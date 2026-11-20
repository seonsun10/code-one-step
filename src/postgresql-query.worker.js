import { PGlite } from '@electric-sql/pglite';
import { evaluatePostgresSource } from './postgresql-grading.js';

const MAX_SOURCE_CHARS = 20_000;

async function loadPostgres() {
  const safeFetch = globalThis.fetch.bind(globalThis);
  const wasmResponse = (name) => safeFetch(new URL(`./${name}`, import.meta.url), { credentials: 'omit' })
    .then((response) => {
      if (!response.ok) throw new Error('PostgreSQL 실행 파일을 불러오지 못했습니다.');
      return response;
    });
  const [pgliteWasmModule, initdbWasmModule, fsBundle] = await Promise.all([
    wasmResponse('pglite.wasm').then((response) => WebAssembly.compileStreaming(response)),
    wasmResponse('initdb.wasm').then((response) => WebAssembly.compileStreaming(response)),
    wasmResponse('pglite.data').then((response) => response.blob()),
  ]);

  for (const name of ['fetch', 'indexedDB', 'importScripts', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'caches']) {
    try { Object.defineProperty(globalThis, name, { value: undefined, configurable: false, writable: false }); } catch { /* browser-owned globals may be read-only */ }
  }

  const db = await PGlite.create({ pgliteWasmModule, initdbWasmModule, fsBundle });
  await db.waitReady;
  return db;
}

self.addEventListener('message', async (event) => {
  const request = event.data;
  if (!request || request.type !== 'run-postgresql') return;
  let db;
  try {
    if (typeof request.code !== 'string' || request.code.length > MAX_SOURCE_CHARS) {
      throw new Error(`SQL 코드는 ${MAX_SOURCE_CHARS.toLocaleString()}자 이하여야 합니다.`);
    }
    db = await loadPostgres();
    const result = await evaluatePostgresSource(db, request);
    self.postMessage({ type: 'finished', ...result });
  } catch (error) {
    self.postMessage({ type: 'finished', error: String(error?.message ?? error).slice(0, 500), results: [] });
  } finally {
    if (db) {
      try { await db.close(); } catch { /* closing the disposable worker releases this database */ }
    }
    self.close();
  }
});
