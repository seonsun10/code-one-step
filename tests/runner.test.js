import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const runner = await readFile(new URL('../src/runner.js', import.meta.url), 'utf8');
const frame = await readFile(new URL('../public/runner-frame.html', import.meta.url), 'utf8');
const server = await readFile(new URL('../scripts/serve.mjs', import.meta.url), 'utf8');
const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

test('user code runs in an opaque sandboxed frame with a deadline and input bound', () => {
  assert.match(runner, /setAttribute\('sandbox', 'allow-scripts'\)/);
  assert.doesNotMatch(runner, /sandbox[^\n]*allow-same-origin/);
  assert.match(runner, /RUNNER_TIMEOUT_MS = 1800/);
  assert.match(runner, /timeoutMs = RUNNER_TIMEOUT_MS/);
  assert.match(runner, /timedOut:\s*true/);
  assert.match(runner, /String\(code\)\.slice\(0, 20_000\)/);
  assert.match(runner, /frame\.remove\(\)/);
});

test('runner blocks network access, bounds printed output, and removes worker APIs', () => {
  assert.match(frame, /connect-src 'none'/);
  assert.match(frame, /worker-src blob:/);
  assert.match(frame, /new Worker\(workerUrl\)/);
  assert.match(frame, /\.slice\(0, 1800\)/);
  assert.match(frame, /'fetch', \{ value: undefined/);
  assert.match(frame, /'indexedDB', \{ value: undefined/);
  assert.match(frame, /'importScripts', \{ value: undefined/);
  assert.match(server, /Content-Security-Policy/);
});

test('coding execution announces the remaining time and its termination status', () => {
  assert.match(main, /data-runner-status role="status" aria-live="polite"/);
  assert.match(main, /남은 시간 \$\{/);
  assert.match(main, /시간 제한을 초과해 실행을 종료했어요/);
  assert.match(main, /코드 실행을 마쳤어요/);
});
