import { transpileTypeScript } from './typescript-transpiler.js';

self.addEventListener('message', (event) => {
  const result = transpileTypeScript(event.data?.source);
  self.postMessage(result);
});
