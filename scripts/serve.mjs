import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dirFlag = process.argv.indexOf('--dir');
const serveRoot = resolve(dirFlag >= 0 ? process.argv[dirFlag + 1] ?? 'dist' : projectRoot);
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
]);

if (!serveRoot.startsWith(`${projectRoot}${sep}`) && serveRoot !== projectRoot) {
  throw new Error('The preview directory must be inside the project folder.');
}

const server = createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const filePath = resolve(serveRoot, `.${pathname}`);
  if (!filePath.startsWith(`${serveRoot}${sep}`) && filePath !== resolve(serveRoot, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    if (!statSync(filePath).isFile()) throw new Error('Not a file');
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }

  const runnerPage = filePath.endsWith(`${sep}public${sep}runner-frame.html`);
  const contentSecurityPolicy = runnerPage
    ? "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
    : "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
  response.writeHead(200, {
    'Content-Type': mimeTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
    'Content-Security-Policy': contentSecurityPolicy,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store',
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Study Web preview: http://127.0.0.1:${port}\n`);
});
