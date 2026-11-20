import { loadPyodide, version as pyodideVersion } from '../public/runtime/pyodide/pyodide.mjs';

const MAX_SOURCE_CHARS = 20_000;
const MAX_CASES = 20;
const MAX_RESULT_BYTES = 100_000;
const PACKAGE_NAMES = [
  'micropip', 'anyio', 'annotated-doc', 'annotated-types', 'certifi', 'h11', 'httpcore', 'httpx',
  'idna', 'pydantic', 'pydantic-core', 'sniffio', 'starlette', 'typing-extensions', 'typing-inspection',
];

let resultPort;
let runtimePromise;
let running = false;

const pythonRunner = String.raw`
import asyncio
import json

from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

async def _study_request(app, request):
    async with LifespanManager(app):
        transport = ASGITransport(app=app, raise_app_exceptions=False)
        async with AsyncClient(transport=transport, base_url="http://study.local") as client:
            options = {
                "method": request["method"],
                "url": request["path"],
                "params": request.get("query") or None,
                "headers": request.get("headers") or None,
            }
            if "json" in request:
                options["json"] = request["json"]
            response = await client.request(**options)
            if len(response.content) > 100_000:
                raise ValueError("응답 본문이 100KB 제한을 넘었습니다.")
            try:
                body = response.json()
            except (ValueError, UnicodeDecodeError):
                body = None
            return {"status": response.status_code, "json": body}

async def _study_run_all(source, cases):
    results = []
    for request in cases:
        try:
            namespace = {"__name__": "__main__"}
            exec(compile(source, "<학습자 FastAPI 코드>", "exec"), namespace, namespace)
            app = namespace.get("app")
            if not isinstance(app, FastAPI):
                raise TypeError("코드에서 FastAPI()로 만든 app 변수를 찾지 못했습니다.")
            results.append({"actualAvailable": True, "actual": await _study_request(app, request), "error": ""})
        except Exception as error:
            results.append({"actualAvailable": False, "error": str(error)[:500]})
    result_text = json.dumps(results, ensure_ascii=False, separators=(",", ":"))
    if len(result_text.encode("utf-8")) > 100_000:
        raise ValueError("테스트 결과가 100KB 제한을 넘었습니다.")
    return result_text
`;

function send(message) {
  resultPort?.postMessage(message);
}

async function initialize() {
  if (!runtimePromise) {
    const indexURL = new URL('../public/runtime/pyodide/', import.meta.url).href;
    runtimePromise = loadPyodide({ indexURL }).then(async (pyodide) => {
      if (pyodideVersion !== '314.0.7') throw new Error(`지원하지 않는 Pyodide 버전: ${pyodideVersion}`);
      await pyodide.loadPackage(PACKAGE_NAMES);
      const micropip = pyodide.pyimport('micropip');
      const wheelBase = new URL('../public/runtime/pyodide/', import.meta.url);
      await micropip.install(new URL('opentelemetry_api-1.45.1-py3-none-any.whl', wheelBase).href, { deps: false });
      await micropip.install([
        new URL('fastapi-0.143.0-py3-none-any.whl', wheelBase).href,
        new URL('asgi_lifespan-2.1.0-py3-none-any.whl', wheelBase).href,
      ], { deps: false });
      micropip.destroy();
      await pyodide.runPythonAsync(`import asyncio, json
import anyio.to_thread

# Pyodide has no native threads. FastAPI normally sends sync callables to AnyIO's
# thread pool; each isolated learning request instead evaluates them inline.
async def _study_run_sync(function, *args, **kwargs):
    return function(*args)

anyio.to_thread.run_sync = _study_run_sync

from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient`);
      return pyodide;
    });
  }
  return runtimePromise;
}

self.addEventListener('message', async (event) => {
  const message = event.data;
  if (message?.type === 'initialize') {
    resultPort = event.ports[0];
    if (!resultPort) return;
    try {
      await initialize();
      send({ type: 'ready' });
    } catch (error) {
      send({ type: 'finished', error: String(error?.stack ?? error?.message ?? 'FastAPI 실행기를 준비하지 못했어요.').slice(0, 2_000), results: [] });
      self.close();
    }
    return;
  }

  if (message?.type !== 'run' || running) return;
  running = true;
  try {
    const source = String(message.code ?? '').slice(0, MAX_SOURCE_CHARS);
    const tests = Array.isArray(message.tests) ? message.tests.slice(0, MAX_CASES) : [];
    if (!source.trim() || !tests.length || tests.length !== message.tests.length
      || tests.some((test) => !test || typeof test.input !== 'object' || test.input === null)) {
      throw new Error('실행 코드 또는 HTTP 요청 테스트 설정을 확인해 주세요.');
    }
    const pyodide = await initialize();
    pyodide.globals.set('_study_source', source);
    pyodide.globals.set('_study_cases', JSON.stringify(tests.map((test) => test.input)));
    pyodide.globals.set('_study_runner', pythonRunner);
    const result = await pyodide.runPythonAsync(`exec(_study_runner, globals())\nasyncio.run(_study_run_all(_study_source, json.loads(_study_cases)))`);
    const resultText = result.toString();
    if (typeof result?.destroy === 'function') result.destroy();
    if (new TextEncoder().encode(resultText).length > MAX_RESULT_BYTES) throw new Error('테스트 결과가 100KB 제한을 넘었습니다.');
    send({ type: 'finished', results: JSON.parse(resultText), error: '' });
  } catch (error) {
    send({ type: 'finished', results: [], error: String(error?.message ?? 'FastAPI 코드를 실행하지 못했어요.').slice(0, 500) });
  } finally {
    running = false;
  }
});
