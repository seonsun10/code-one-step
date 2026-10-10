export const RUNNER_TIMEOUT_MS = 1800;

export function runChallenge(exercise, code, timeoutMs = RUNNER_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('title', '격리된 코드 실행 공간');
    frame.className = 'runner-frame';
    frame.src = new URL('../public/runner-frame.html', import.meta.url).href;

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      frame.remove();
      resolve(result);
    };
    const onMessage = (event) => {
      if (event.source !== frame.contentWindow || event.origin !== 'null') return;
      if (event.data?.type !== 'study-web-result' || event.data.requestId !== requestId) return;
      const result = event.data.result;
      const passed = Array.isArray(result.results) && result.results.length === exercise.tests.length && result.results.every((test) => test.passed);
      finish({ passed, error: result.error ?? null, output: result.output ?? '', results: result.results ?? [] });
    };
    const timer = window.setTimeout(() => finish({ passed: false, timedOut: true, error: '실행 시간이 길어 코드를 종료했어요. 반복문이 끝나는 조건을 확인해 주세요.', output: '', results: [] }), timeoutMs);
    window.addEventListener('message', onMessage);
    frame.addEventListener('load', () => {
      frame.contentWindow?.postMessage({
        type: 'run',
        requestId,
        code: String(code).slice(0, 20_000),
        entryPoint: exercise.entryPoint,
        tests: exercise.tests,
      }, '*');
    }, { once: true });
    document.body.append(frame);
  });
}
