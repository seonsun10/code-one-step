import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { sameExerciseValue } from '../src/runner-values.js';
import { runChallenge } from '../src/runner.js';

const runner = await readFile(new URL('../src/runner.js', import.meta.url), 'utf8');
const frame = await readFile(new URL('../public/runner-frame.html', import.meta.url), 'utf8');
const server = await readFile(new URL('../scripts/serve.mjs', import.meta.url), 'utf8');
const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const editor = await readFile(new URL('../src/editor-runtime.js', import.meta.url), 'utf8');
const progress = await readFile(new URL('../src/progress.js', import.meta.url), 'utf8');
const postgresGrading = await readFile(new URL('../src/postgresql-grading.js', import.meta.url), 'utf8');
const postgresWorker = await readFile(new URL('../src/postgresql-query.worker.js', import.meta.url), 'utf8');
const headers = await readFile(new URL('../_headers', import.meta.url), 'utf8');

function loadRunnerWorker() {
  const template = frame.match(/const workerSource = `([\s\S]*?)`;\s*const workerUrl/);
  assert.ok(template, 'runner iframe must define its worker source');
  return vm.runInNewContext(`\`${template[1]}\``);
}

test('user code runs in an opaque sandboxed frame with a deadline and input bound', () => {
  assert.match(runner, /setAttribute\('sandbox', 'allow-scripts'\)/);
  assert.doesNotMatch(runner, /sandbox[^\n]*allow-same-origin/);
  assert.match(runner, /RUNNER_TIMEOUT_MS = 1800/);
  assert.match(runner, /RUNNER_STARTUP_TIMEOUT_MS = 5000/);
  assert.match(runner, /timeoutMs = RUNNER_TIMEOUT_MS/);
  assert.match(runner, /study-web-ready/);
  assert.match(runner, /result\.unavailable === true/);
  assert.match(runner, /'unavailable'\)/);
  assert.match(runner, /type: 'initialize'/);
  assert.match(runner, /timedOut/);
  assert.match(runner, /String\(code\)\.slice\(0, 20_000\)/);
  assert.match(runner, /frame\.remove\(\)/);
  assert.match(frame, /sendToFrame\(\{ type: 'ready' \}\)/);
  assert.match(frame, /unavailable: true/);
  assert.match(frame, /event\.data\.type === 'initialize'/);
  assert.match(main, /실행 공간을 사용할 수 없어 답안은 저장하지 않았어요/);
});

test('TypeScript is transformed in a bounded same-origin worker before sandbox execution', async () => {
  const transpiler = await readFile(new URL('../src/typescript-transpiler.js', import.meta.url), 'utf8');
  const compilerWorker = await readFile(new URL('../src/typescript-compiler.worker.js', import.meta.url), 'utf8');
  assert.match(runner, /new Worker\(new URL\('\.\/typescript-compiler\.worker\.js', import\.meta\.url\)/);
  assert.match(runner, /finish\(event\.data, true\)/);
  assert.match(runner, /timeoutMs = RUNNER_TIMEOUT_MS/);
  assert.match(runner, /String\(code\)\.slice\(0, 20_000\)/);
  assert.match(runner, /exercise\.adapterId === 'typescript-function-v1'/);
  assert.match(transpiler, /MAX_TYPESCRIPT_CHARS = 20_000/);
  assert.match(transpiler, /ScriptTarget\.ES2022/);
  assert.match(compilerWorker, /self\.postMessage\(result\)/);
});

test('PostgreSQL SQL is graded in a disposable module worker and maps every returned row', async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalWorker = Object.getOwnPropertyDescriptor(globalThis, 'Worker');
  let posted;
  let terminated = false;

  class MockWorker {
    listeners = new Map();
    addEventListener(type, handler) { this.listeners.set(type, handler); }
    removeEventListener(type) { this.listeners.delete(type); }
    postMessage(message) {
      posted = message;
      queueMicrotask(() => this.listeners.get('message')?.({ data: {
        type: 'finished',
        results: [{ actualAvailable: true, actual: [{ id: 7, label: 'ok' }], output: '[rows]', error: '' }],
      } }));
    }
    terminate() { terminated = true; }
  }

  Object.defineProperty(globalThis, 'window', { configurable: true, value: globalThis });
  Object.defineProperty(globalThis, 'Worker', { configurable: true, value: MockWorker });
  try {
    const result = await runChallenge({
      id: 'postgresql-test',
      adapterId: 'postgresql-query-v1',
      database: { setup: 'CREATE TABLE learners (id INTEGER);', reset: 'TRUNCATE learners;' },
      tests: [{ input: '', expected: [{ id: 7, label: 'ok' }] }],
    }, 'SELECT 7 AS id, \'ok\' AS label');
    assert.equal(posted.type, 'run-postgresql');
    assert.equal(posted.code, "SELECT 7 AS id, 'ok' AS label");
    assert.equal(result.passed, true);
    assert.equal(result.passedCount, 1);
    assert.equal(result.results[0].actual, '[\n  {\n    "id": 7,\n    "label": "ok"\n  }\n]');
    assert.equal(terminated, true);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else delete globalThis.window;
    if (originalWorker) Object.defineProperty(globalThis, 'Worker', originalWorker);
    else delete globalThis.Worker;
  }
});

test('runner blocks network access, bounds printed output, and removes worker APIs', () => {
  assert.match(frame, /connect-src 'none'/);
  assert.match(frame, /worker-src blob:/);
  assert.match(frame, /new Worker\(workerUrl\)/);
  assert.match(frame, /MAX_OUTPUT_TEXT = 1800/);
  assert.match(frame, /text\.slice\(0, available\)/);
  assert.match(frame, /MAX_VALUE_DEPTH = 10/);
  assert.match(frame, /MAX_VALUE_NODES = 1000/);
  assert.match(frame, /'fetch', \{ value: undefined/);
  assert.match(frame, /'indexedDB', \{ value: undefined/);
  assert.match(frame, /'importScripts', \{ value: undefined/);
  assert.match(frame, /'postMessage', \{ value: print/);
  assert.match(server, /Content-Security-Policy/);
});

test('local preview serves module-runtime assets with a JavaScript MIME type', () => {
  assert.match(server, /\['\.mjs', 'text\/javascript; charset=utf-8'\]/);
});

test('PostgreSQL runner is local, disposable, read-only, size-limited, and time-limited', () => {
  assert.match(runner, /POSTGRESQL_RUNNER_TIMEOUT_MS = 15000/);
  assert.match(runner, /new Worker\(new URL\('\.\/postgresql-query\.worker\.js', import\.meta\.url\)/);
  assert.match(runner, /type: 'run-postgresql'/);
  assert.match(postgresWorker, /new URL\(`\.\/\$\{name\}`, import\.meta\.url\)/);
  assert.match(postgresWorker, /globalThis, name, \{ value: undefined/);
  assert.match(postgresWorker, /self\.close\(\)/);
  assert.match(postgresGrading, /POSTGRESQL_MAX_QUERY_CHARS = 20_000/);
  assert.match(postgresGrading, /POSTGRESQL_MAX_RESULT_ROWS = 100/);
  assert.match(postgresGrading, /POSTGRESQL_MAX_RESULT_BYTES = 100_000/);
  assert.match(postgresGrading, /BEGIN READ ONLY/);
  assert.match(postgresGrading, /ROLLBACK/);
  assert.match(headers, /script-src 'self' 'wasm-unsafe-eval'/);
});

test('coding execution shows saved per-test results and announces execution states', () => {
  assert.match(main, /data-runner-status role="status" aria-live="polite"/);
  assert.match(main, /남은 시간 \$\{/);
  assert.match(main, /시간 제한을 초과해 실행을 종료했어요/);
  assert.match(main, /테스트별 결과/);
  assert.match(main, /기대 반환값/);
  assert.match(main, /실제 반환값/);
  assert.match(main, /표준 출력/);
  assert.match(main, /출력된 내용이 없습니다/);
  assert.match(main, /현재 결과는 이전 실행 기준입니다/);
  assert.match(main, /모든 테스트를 통과했어요/);
  assert.match(main, /실행 공간을 사용할 수 없어 답안은 저장하지 않았어요/);
  const unavailableIndex = main.indexOf("if (result.state === 'unavailable')");
  const recordAnswerIndex = main.indexOf('recordAnswer(exercise, response, result.passed, note, result);', unavailableIndex);
  assert.ok(unavailableIndex >= 0 && recordAnswerIndex > unavailableIndex, 'runner setup failures must return before saving a wrong answer');
  assert.match(main.slice(unavailableIndex, recordAnswerIndex), /drafts\[exercise\.id\] = String\(response/);
  assert.match(main.slice(unavailableIndex, recordAnswerIndex), /await persistProgress\(\{ immediate: true \}\)/);
});

test('CodeMirror editor has syntax-aware languages, history, indentation, length guard, and draft binding', () => {
  assert.match(editor, /javascript\(\{ jsx: true, typescript: true \}\)/);
  assert.match(editor, /python,/);
  assert.match(editor, /java,/);
  assert.match(editor, /sql: \(\) => sqlLanguage/);
  assert.match(editor, /StreamLanguage\.define/);
  assert.match(editor, /sqlFunctions\.has\(word\)/);
  assert.match(editor, /syntaxHighlighting\(classHighlighter\)/);
  assert.match(editor, /history\(\)/);
  assert.match(editor, /indentOnInput\(\)/);
  assert.match(editor, /indentWithTab/);
  assert.match(editor, /key: 'Shift-Tab', run: indentLess/);
  assert.match(editor, /transaction\.newDoc\.length <= source\.maxLength/);
  assert.match(editor, /source\.dispatchEvent\(new Event\('input', \{ bubbles: true \}\)\)/);
  assert.doesNotMatch(main, /document\.execCommand\('insertText'/);
});

test('runner values compare structured outputs while leaving source code in the worker', () => {
  assert.match(runner, /sameExerciseValue\(actual, expected\)/);
  assert.match(runner, /state: result\.error \? 'error' : passed \? 'passed' : 'partial'/);
  assert.match(runner, /MAX_RUNNER_TESTS = 20/);
  assert.match(progress, /normalizeExecution\(answer\.execution\)/);
});

test('runner worker captures console output and returns bounded values per input case', () => {
  const messages = [];
  const self = { postMessage: (message) => messages.push(message) };
  const context = { self, console: { log() {}, info() {}, warn() {}, error() {} } };
  vm.runInNewContext(loadRunnerWorker(), context);
  self.onmessage({ data: {
    code: 'function summarize(values) { console.log("count", values.length); return { total: values.reduce((a, b) => a + b, 0), detail: { first: values[0] } }; }',
    entryPoint: 'summarize',
    tests: [{ input: [[2, 3]], expected: { total: 5, detail: { first: 2 } } }],
  } });

  assert.equal(messages.length, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(messages[0])), { type: 'ready' });
  assert.deepEqual(JSON.parse(JSON.stringify(messages[1].results[0].actual)), { detail: { first: 2 }, total: 5 });
  assert.equal(messages[1].results[0].output, 'count 2');
  assert.equal(messages[1].error, undefined);
});

test('runner worker grades return values when a solution writes no console output', () => {
  const messages = [];
  const self = { postMessage: (message) => messages.push(message) };
  const context = { self, console: { log() {}, info() {}, warn() {}, error() {} } };
  vm.runInNewContext(loadRunnerWorker(), context);
  self.onmessage({ data: {
    code: 'function sumNumbers(values) { return values.reduce((total, value) => total + value, 0); }',
    entryPoint: 'sumNumbers',
    tests: [{ input: [[2, 3]], expected: 5 }],
  } });

  assert.deepEqual(JSON.parse(JSON.stringify(messages[0])), { type: 'ready' });
  assert.equal(messages[1].results[0].actual, 5);
  assert.equal(messages[1].results[0].output, '');
  assert.equal(sameExerciseValue(messages[1].results[0].actual, 5), true);
});

test('runner worker returns a test error for unsupported or throwing solutions', () => {
  const messages = [];
  const self = { postMessage: (message) => messages.push(message) };
  const context = { self, console: { log() {}, info() {}, warn() {}, error() {} } };
  vm.runInNewContext(loadRunnerWorker(), context);
  self.onmessage({ data: {
    code: 'function solve() { throw new Error("bad input"); }',
    entryPoint: 'solve',
    tests: [{ input: [], expected: 1 }],
  } });

  assert.deepEqual(JSON.parse(JSON.stringify(messages[0])), { type: 'ready' });
  assert.equal(messages[1].results[0].actualAvailable, false);
  assert.match(messages[1].results[0].error, /bad input/);
});

test('the app imports each progress helper it calls from an exported module binding', () => {
  const importBlock = main.match(/import \{([^}]+)\} from '\.\/progress\.js';/);
  assert.ok(importBlock, 'main.js must import its progress helpers from progress.js');
  const importedNames = new Set(importBlock[1].split(',').map((name) => name.trim()));
  const exportedNames = new Set([...progress.matchAll(/export function (\w+)/g)].map((match) => match[1]));

  for (const helper of ['emptyProgress', 'getCompletedLessonIds', 'latestExerciseResults', 'recordExerciseResult', 'makeBackup', 'parseBackup']) {
    assert.ok(importedNames.has(helper), `main.js must import ${helper}`);
    assert.ok(exportedNames.has(helper), `progress.js must export ${helper}`);
  }
});
