import { formatExerciseValue, sameExerciseValue } from './runner-values.js';

export const RUNNER_TIMEOUT_MS = 1800;
export const RUNNER_STARTUP_TIMEOUT_MS = 5000;
export const POSTGRESQL_RUNNER_TIMEOUT_MS = 15000;
export const FASTAPI_INITIALIZE_TIMEOUT_MS = 60000;
export const FASTAPI_RUNNER_TIMEOUT_MS = 8000;
const FASTAPI_IDLE_TIMEOUT_MS = 60_000;
const MAX_RUNNER_TESTS = 20;
const MAX_RESULT_TEXT = 1800;
let fastApiRuntime = null;

function runnerFailure(error, timedOut = false, total = 0, state = 'error') {
  return {
    passed: false,
    state: timedOut ? 'timeout' : state,
    timedOut,
    error: String(error ?? '코드를 실행하지 못했어요.').slice(0, 500),
    output: '',
    outputWasTruncated: false,
    passedCount: 0,
    total,
    results: [],
  };
}

function disposeFastApiRuntime(state) {
  if (!state || state.disposed) return;
  state.disposed = true;
  clearTimeout(state.idleTimer);
  if (!state.readyResolved) state.rejectReady(new Error('FastAPI 실행기가 종료되었습니다.'));
  state.port.removeEventListener('message', state.onMessage);
  state.worker.removeEventListener('error', state.onError);
  state.port.close();
  state.worker.terminate();
  if (fastApiRuntime === state) fastApiRuntime = null;
}

function createFastApiRuntime() {
  const worker = new Worker(new URL('./fastapi-runner.worker.js', import.meta.url), { type: 'module' });
  const channel = new MessageChannel();
  let resolveReady;
  let rejectReady;
  const ready = new Promise((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  ready.catch(() => undefined);
  const state = {
    worker,
    port: channel.port1,
    ready,
    resolveReady,
    rejectReady,
    readyResolved: false,
    currentResult: null,
    running: false,
    disposed: false,
    idleTimer: null,
  };
  state.onMessage = (event) => {
    const message = event.data;
    if (message?.type === 'ready' && !state.readyResolved) {
      state.readyResolved = true;
      state.resolveReady();
      return;
    }
    if (message?.type !== 'finished') return;
    if (!state.readyResolved) {
      state.rejectReady(new Error(String(message.error ?? 'FastAPI 실행기를 준비하지 못했어요.').slice(0, 500)));
      return;
    }
    state.currentResult?.(message);
  };
  state.onError = () => {
    state.currentResult?.({ type: 'finished', error: 'FastAPI Python Worker가 예기치 않게 종료되었습니다.', results: [] });
    disposeFastApiRuntime(state);
  };
  state.port.addEventListener('message', state.onMessage);
  state.port.start();
  worker.addEventListener('error', state.onError);
  try {
    worker.postMessage({ type: 'initialize', port: channel.port2 }, [channel.port2]);
  } catch (error) {
    disposeFastApiRuntime(state);
    throw error;
  }
  return state;
}

function runFastApiChallenge(exercise, code) {
  if (fastApiRuntime?.running) {
    return Promise.resolve(runnerFailure('FastAPI 실행기가 다른 코드를 확인 중이에요. 잠시 뒤 다시 실행해 주세요.', false, exercise.tests.length));
  }

  let state;
  try {
    if (!fastApiRuntime) fastApiRuntime = createFastApiRuntime();
    state = fastApiRuntime;
    clearTimeout(state.idleTimer);
    state.running = true;
  } catch {
    return Promise.resolve(runnerFailure('FastAPI 실행 작업 공간을 열지 못했어요.', false, exercise.tests.length));
  }

  return new Promise((resolve) => {
    let settled = false;
    let timer;
    const finish = (result, terminate = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      state.currentResult = null;
      state.running = false;
      if (terminate) disposeFastApiRuntime(state);
      else state.idleTimer = window.setTimeout(() => disposeFastApiRuntime(state), FASTAPI_IDLE_TIMEOUT_MS);
      resolve(result);
    };
    state.currentResult = (message) => {
      const rawResults = Array.isArray(message.results) ? message.results.slice(0, exercise.tests.length) : [];
      const results = rawResults.map((item, index) => {
        const actualAvailable = item?.actualAvailable === true;
        const actual = actualAvailable ? item.actual : undefined;
        return {
          passed: actualAvailable && !item?.error && sameExerciseValue(actual, exercise.tests[index]?.expected),
          actualAvailable,
          actual: actualAvailable ? formatExerciseValue(actual).slice(0, MAX_RESULT_TEXT) : '',
          output: '',
          error: String(item?.error ?? '').slice(0, 500),
        };
      });
      const passedCount = results.filter((item) => item.passed).length;
      const fatalError = String(message.error ?? '').slice(0, 500);
      const passed = !fatalError && results.length === exercise.tests.length && results.every((item) => item.passed);
      finish({
        passed,
        state: fatalError ? 'error' : passed ? 'passed' : 'partial',
        timedOut: false,
        error: fatalError,
        output: '',
        outputWasTruncated: false,
        passedCount,
        total: exercise.tests.length,
        results,
      }, Boolean(fatalError && !state.readyResolved));
    };
    timer = window.setTimeout(() => finish(runnerFailure(
      'FastAPI Python 실행 환경 준비가 60초를 넘어 종료했어요. 이 페이지의 정적 자산이 모두 열리는지 확인해 주세요.',
      true,
      exercise.tests.length,
    ), true), FASTAPI_INITIALIZE_TIMEOUT_MS);

    state.ready.then(() => {
      if (settled) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => finish(runnerFailure(
        'FastAPI 코드 실행이 8초를 넘어 Worker를 종료했어요. 반복 작업과 응답 크기를 확인해 주세요.',
        true,
        exercise.tests.length,
      ), true), FASTAPI_RUNNER_TIMEOUT_MS);
      try {
        state.worker.postMessage({
          type: 'run',
          code: String(code).slice(0, 20_000),
          tests: exercise.tests.slice(0, MAX_RUNNER_TESTS),
        });
      } catch {
        finish(runnerFailure('FastAPI 코드를 실행 Worker에 전달하지 못했어요.', false, exercise.tests.length), true);
      }
    }).catch((error) => {
      finish(runnerFailure(String(error?.message ?? 'FastAPI 실행기를 준비하지 못했어요.').slice(0, 500), false, exercise.tests.length), true);
    });
  });
}

function compileTypeScript(code, timeoutMs) {
  return new Promise((resolve) => {
    let worker;
    let settled = false;
    const finish = (result, terminate = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (worker) {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        if (terminate) worker.terminate();
      }
      resolve(result);
    };
    const onMessage = (event) => finish(event.data, true);
    const onError = () => finish({ ok: false, error: 'TypeScript 컴파일을 시작하지 못했어요.' }, true);
    const timer = window.setTimeout(
      () => finish({ ok: false, timedOut: true, error: 'TypeScript 변환 시간이 제한을 넘었습니다.' }, true),
      timeoutMs,
    );
    try {
      worker = new Worker(new URL('./typescript-compiler.worker.js', import.meta.url), { type: 'module' });
      worker.addEventListener('message', onMessage, { once: true });
      worker.addEventListener('error', onError, { once: true });
      worker.postMessage({ source: String(code).slice(0, 20_000) });
    } catch {
      finish({ ok: false, error: 'TypeScript 컴파일 작업 공간을 열지 못했어요.' }, true);
    }
  });
}

export async function runChallenge(exercise, code, timeoutMs = RUNNER_TIMEOUT_MS) {
  const isPostgres = exercise?.adapterId === 'postgresql-query-v1';
  const isFastApi = exercise?.adapterId === 'fastapi-asgi-v1';
  const runTimeout = isPostgres ? POSTGRESQL_RUNNER_TIMEOUT_MS : timeoutMs;
  if (!exercise || (!isPostgres && !isFastApi && !/^[A-Za-z_$][\w$]*$/.test(exercise.entryPoint ?? ''))
    || !Array.isArray(exercise.tests) || !exercise.tests.length || exercise.tests.length > MAX_RUNNER_TESTS) {
    return runnerFailure('문제의 실행 테스트 설정을 확인할 수 없어요.');
  }

  if (isPostgres) {
    return new Promise((resolve) => {
      let worker;
      let settled = false;
      const finish = (result, terminate = false) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (worker) {
          worker.removeEventListener('message', onMessage);
          worker.removeEventListener('error', onError);
          if (terminate) worker.terminate();
        }
        resolve(result);
      };
      const onMessage = (event) => {
        if (event.data?.type !== 'finished') return;
        const result = event.data;
        const rawResults = Array.isArray(result.results) ? result.results.slice(0, exercise.tests.length) : [];
        const results = rawResults.map((test, index) => {
          const actualAvailable = test?.actualAvailable === true;
          const actual = actualAvailable ? test.actual : undefined;
          const passed = actualAvailable && !test?.error && sameExerciseValue(actual, exercise.tests[index]?.expected);
          return {
            passed,
            actualAvailable,
            actual: actualAvailable ? formatExerciseValue(actual).slice(0, MAX_RESULT_TEXT) : '',
            output: String(test?.output ?? '').slice(0, MAX_RESULT_TEXT),
            error: String(test?.error ?? '').slice(0, 500),
          };
        });
        const passedCount = results.filter((test) => test.passed).length;
        const passed = !result.error && results.length === exercise.tests.length && results.every((test) => test.passed);
        finish({
          passed,
          state: result.error ? 'error' : passed ? 'passed' : 'partial',
          timedOut: false,
          error: String(result.error ?? '').slice(0, 500),
          output: '',
          outputWasTruncated: false,
          passedCount,
          total: exercise.tests.length,
          results,
        }, true);
      };
      const onError = () => finish(runnerFailure('PostgreSQL 실행 공간을 열지 못했어요.', false, exercise.tests.length), true);
      const timer = window.setTimeout(() => finish(runnerFailure(
        'PostgreSQL 실행 시간이 15초를 넘어서 종료했어요. 쿼리와 결과 범위를 확인해 주세요.',
        true,
        exercise.tests.length,
      ), true), runTimeout);
      try {
        worker = new Worker(new URL('./postgresql-query.worker.js', import.meta.url), { type: 'module' });
        worker.addEventListener('message', onMessage);
        worker.addEventListener('error', onError, { once: true });
        worker.postMessage({
          type: 'run-postgresql',
          code: String(code).slice(0, 20_000),
          database: exercise.database,
          tests: exercise.tests,
        });
      } catch {
        finish(runnerFailure('PostgreSQL 실행 작업 공간을 열지 못했어요.', false, exercise.tests.length), true);
      }
    });
  }

  if (isFastApi) return runFastApiChallenge(exercise, code);

  let executableCode = String(code);
  if (exercise.adapterId === 'typescript-function-v1') {
    const compiled = await compileTypeScript(executableCode, timeoutMs);
    if (!compiled?.ok) {
      return runnerFailure(compiled?.error ?? 'TypeScript 코드를 변환하지 못했어요.', compiled?.timedOut === true, exercise.tests.length);
    }
    executableCode = compiled.code;
  }
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('title', '격리된 코드 실행 공간');
    frame.className = 'runner-frame';
    frame.src = new URL('../public/runner-frame.html', import.meta.url).href;

    let settled = false;
    let startupTimer;
    let executionTimer;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(startupTimer);
      clearTimeout(executionTimer);
      window.removeEventListener('message', onMessage);
      frame.remove();
      resolve(result);
    };
    const onMessage = (event) => {
      if (event.source !== frame.contentWindow || event.origin !== 'null' || event.data?.requestId !== requestId) return;
      if (event.data?.type === 'study-web-ready') {
        clearTimeout(startupTimer);
        executionTimer = window.setTimeout(
          () => finish(runnerFailure('실행 시간이 길어 코드를 종료했어요. 반복문이 끝나는 조건을 확인해 주세요.', true, exercise.tests.length)),
          timeoutMs,
        );
        frame.contentWindow?.postMessage({
          type: 'run',
          requestId,
          code: executableCode.slice(0, 20_000),
          entryPoint: exercise.entryPoint,
          tests: exercise.tests.slice(0, MAX_RUNNER_TESTS),
        }, '*');
        return;
      }
      if (event.data?.type !== 'study-web-result') return;
      const result = event.data.result && typeof event.data.result === 'object'
        ? event.data.result
        : { error: '실행 결과를 올바르게 받지 못했어요.', results: [] };
      if (result.unavailable === true) {
        finish(runnerFailure(result.error, false, exercise.tests.length, 'unavailable'));
        return;
      }
      const rawResults = Array.isArray(result.results) ? result.results.slice(0, exercise.tests.length) : [];
      const results = rawResults.map((test, index) => {
        const expected = exercise.tests[index]?.expected;
        const actualAvailable = test?.actualAvailable === true;
        const actual = actualAvailable ? test.actual : undefined;
        const passed = actualAvailable && !test?.error && sameExerciseValue(actual, expected);
        return {
          passed,
          actualAvailable,
          actual: actualAvailable ? formatExerciseValue(actual).slice(0, MAX_RESULT_TEXT) : '',
          output: String(test?.output ?? '').slice(0, MAX_RESULT_TEXT),
          error: String(test?.error ?? '').slice(0, 500),
        };
      });
      const passedCount = results.filter((test) => test.passed).length;
      const passed = !result.error && results.length === exercise.tests.length && results.every((test) => test.passed);
      finish({
        passed,
        state: result.error ? 'error' : passed ? 'passed' : 'partial',
        error: String(result.error ?? '').slice(0, 500),
        output: String(result.output ?? '').slice(0, MAX_RESULT_TEXT),
        outputWasTruncated: result.outputWasTruncated === true,
        passedCount,
        total: exercise.tests.length,
        results,
      });
    };
    startupTimer = window.setTimeout(
      () => finish(runnerFailure('코드 실행 공간을 준비하지 못했어요. 다시 시도해 주세요.', false, exercise.tests.length, 'unavailable')),
      RUNNER_STARTUP_TIMEOUT_MS,
    );
    window.addEventListener('message', onMessage);
    frame.addEventListener('error', () => finish(runnerFailure('코드 실행 화면을 열지 못했어요.', false, exercise.tests.length, 'unavailable')), { once: true });
    frame.addEventListener('load', () => {
      frame.contentWindow?.postMessage({
        type: 'initialize',
        requestId,
      }, '*');
    }, { once: true });
    document.body.append(frame);
  });
}
