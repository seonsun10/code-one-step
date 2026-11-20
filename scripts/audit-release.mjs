import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { basename, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare Pages limits checked on 2026-10-10; see docs/plan/release-checklist.md.
const hostedLimits = { maxFiles: 20_000, maxFileBytes: 25 * 1024 * 1024 };
const forbiddenDirectories = new Set([
  '.git',
  '.omx',
  'coverage',
  'docs',
  'functions',
  'node_modules',
  'tests',
]);

function readHeaders(text) {
  const blocks = [];
  let current = null;

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = { route: line.trim(), headers: [], removals: [] };
      blocks.push(current);
      continue;
    }

    const removal = line.match(/^\s+!\s+([^:\s]+)\s*$/);
    if (removal && current) {
      current.removals.push(removal[1].toLowerCase());
      continue;
    }

    const match = line.match(/^\s+([^:\s]+)\s*:\s*(.*)$/);
    if (match && current) current.headers.push({ name: match[1].toLowerCase(), value: match[2] });
  }

  return blocks;
}

function auditContentSecurityPolicies(headersText) {
  const violations = [];
  const blocks = readHeaders(headersText);
  if (blocks.some(({ removals }) => removals.includes('content-security-policy'))) {
    violations.push('Content-Security-Policy removal rules are not allowed in the static release.');
  }

  const policies = blocks.flatMap(({ route, headers }) => headers
    .filter(({ name }) => name === 'content-security-policy')
    .map(({ value }) => ({ route, value })));
  const entryPolicies = policies.filter(({ route }) => route === '/');
  const runnerRoutes = ['/public/runner-frame.html', '/public/runner-frame'];
  const exactApplicationRoutes = new Set(['/', '/index.html', ...runnerRoutes]);

  if (entryPolicies.length === 0) {
    violations.push('A Content-Security-Policy for the root path / is required.');
  }

  for (const route of runnerRoutes) {
    const routePolicies = policies.filter((policy) => policy.route === route);
    if (routePolicies.length !== 1) {
      violations.push(`Exactly one Content-Security-Policy for runner route ${route} is required.`);
      continue;
    }

    const directives = new Map();
    const duplicateDirectives = new Set();
    for (const directive of routePolicies[0].value.split(';')) {
      const [rawName, ...sources] = directive.trim().split(/\s+/);
      const name = rawName?.toLowerCase();
      if (!name) continue;
      if (directives.has(name)) duplicateDirectives.add(name);
      directives.set(name, sources.map((source) => source.toLowerCase()));
    }

    const requiredDirectives = new Map([
      ['default-src', ["'none'"]],
      ['script-src', ["'unsafe-inline'", "'unsafe-eval'", 'blob:']],
      ['worker-src', ['blob:']],
      ['connect-src', ["'none'"]],
      ['object-src', ["'none'"]],
      ['base-uri', ["'none'"]],
      ['form-action', ["'none'"]],
      ['frame-ancestors', ["'self'"]],
    ]);

    for (const name of duplicateDirectives) {
      violations.push(`Content-Security-Policy for runner route ${route} repeats ${name}.`);
    }
    for (const [name, requiredSources] of requiredDirectives) {
      const actualSources = directives.get(name);
      if (!actualSources || actualSources.length !== requiredSources.length || requiredSources.some((source) => !actualSources.includes(source))) {
        violations.push(`Content-Security-Policy for runner route ${route} must set ${name} ${requiredSources.join(' ')}.`);
      }
    }
    for (const name of directives.keys()) {
      if (!requiredDirectives.has(name)) {
        violations.push(`Content-Security-Policy for runner route ${route} has unexpected ${name}.`);
      }
    }
  }

  for (const { route } of policies) {
    if (!exactApplicationRoutes.has(route)) {
      violations.push(`Content-Security-Policy rules must use an exact application route; wildcard, placeholder, and absolute URL patterns are not allowed: ${route}.`);
    }
  }

  for (const { route, value } of policies) {
    const directives = new Map();
    const relevantNames = new Set(['connect-src', 'default-src', 'script-src', 'script-src-elem', 'style-src']);
    let duplicateRelevantDirective = false;

    for (const directive of value.split(';')) {
      const [rawName, ...sources] = directive.trim().split(/\s+/);
      const name = rawName?.toLowerCase();
      if (!relevantNames.has(name)) continue;
      if (directives.has(name)) {
        duplicateRelevantDirective = true;
      } else {
        directives.set(name, sources.map((source) => source.toLowerCase()));
      }
    }

    if (duplicateRelevantDirective) {
      violations.push(`Content-Security-Policy for ${route} repeats a source directive.`);
    }

    const connectSources = directives.get('connect-src');
    if (!connectSources) {
      violations.push(`Content-Security-Policy for ${route} must declare connect-src exactly once.`);
    } else if (connectSources.length !== 1 || !["'self'", "'none'"].includes(connectSources[0])) {
      violations.push(`Content-Security-Policy for ${route} may connect only to 'self' or 'none'.`);
    }

    const scriptDirectiveNames = ['default-src', 'script-src', 'script-src-elem'];
    const allowedScriptSources = new Set(["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "'wasm-unsafe-eval'", 'blob:']);
    for (const name of scriptDirectiveNames) {
      const sources = directives.get(name);
      if (sources && (sources.length === 0 || sources.some((source) => !allowedScriptSources.has(source)))) {
        violations.push(`Content-Security-Policy for ${route} has an external or unsupported ${name} source.`);
      }
    }

    const styleSources = directives.get('style-src');
    const allowedStyleSources = new Set(["'self'", "'unsafe-inline'"]);
    if (styleSources && (styleSources.length === 0 || styleSources.some((source) => !allowedStyleSources.has(source)))) {
      violations.push(`Content-Security-Policy for ${route} has an external or unsupported style-src source.`);
    }

    if (!directives.has('script-src-elem') && !directives.has('script-src') && !directives.has('default-src')) {
      violations.push(`Content-Security-Policy for ${route} must restrict script sources.`);
    }
  }

  return violations;
}

export async function auditRelease({
  projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..'),
  limits = hostedLimits,
} = {}) {
  const root = resolve(projectRoot);
  const output = resolve(root, 'dist');
  if (!output.startsWith(`${root}${sep}`)) {
    throw new Error('Release output must remain inside the project folder.');
  }

  const violations = [];
  const files = [];

  try {
    const outputInfo = await lstat(output);
    if (!outputInfo.isDirectory() || outputInfo.isSymbolicLink()) {
      return { ok: false, files, bytes: 0, largest: null, violations: ['dist must be a real directory.'] };
    }
  } catch {
    return { ok: false, files, bytes: 0, largest: null, violations: ['dist is missing; run npm run build first.'] };
  }

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolutePath = resolve(directory, entry.name);
      const relativePath = relative(output, absolutePath).split(sep).join('/');
      const entryInfo = await lstat(absolutePath);

      if (entryInfo.isSymbolicLink()) {
        violations.push(`Symbolic links are not allowed: ${relativePath}`);
        continue;
      }

      if (entryInfo.isDirectory()) {
        if (forbiddenDirectories.has(entry.name.toLowerCase())) {
          violations.push(`Development or server directory found: ${relativePath}`);
          continue;
        }
        await visit(absolutePath);
        continue;
      }

      if (!entryInfo.isFile()) {
        violations.push(`Unsupported release entry: ${relativePath}`);
        continue;
      }

      const fileName = basename(relativePath).toLowerCase();
      if (/^\.env(?:\..*)?$/.test(fileName)) violations.push(`Environment file found: ${relativePath}`);
      if (/^(?:study-web-progress-.*\.json|code-one-step-progress-.*\.json|.*\.tmp\.json)$/.test(fileName)) {
        violations.push(`Local learner data or temporary file found: ${relativePath}`);
      }
      if (fileName === '_worker.js' || fileName === 'package.json' || fileName === 'package-lock.json') {
        violations.push(`Server or package metadata found: ${relativePath}`);
      }
      if (entryInfo.size > limits.maxFileBytes) {
        violations.push(`File exceeds the ${limits.maxFileBytes}-byte host limit: ${relativePath}`);
      }
      files.push({ path: relativePath, bytes: entryInfo.size });
    }
  }

  await visit(output);
  const filePaths = new Set(files.map((file) => file.path));
  for (const requiredPath of ['index.html', '_headers']) {
    if (!filePaths.has(requiredPath)) violations.push(`Required release file is missing: ${requiredPath}`);
  }

  if (filePaths.has('_headers')) {
    try {
      violations.push(...auditContentSecurityPolicies(await readFile(resolve(output, '_headers'), 'utf8')));
    } catch {
      violations.push('Release _headers file could not be read.');
    }
  }

  if (files.length > limits.maxFiles) {
    violations.push(`Release contains ${files.length} files; host limit is ${limits.maxFiles}.`);
  }

  try {
    const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
    if (Object.keys(manifest.dependencies ?? {}).length > 0) {
      violations.push('Runtime package dependencies are not allowed in the zero-cost static release.');
    }
    if (Object.keys(manifest.optionalDependencies ?? {}).length > 0) {
      violations.push('Optional runtime package dependencies are not allowed in the zero-cost static release.');
    }
    if (Object.keys(manifest.peerDependencies ?? {}).length > 0) {
      violations.push('Peer runtime package dependencies are not allowed in the zero-cost static release.');
    }

    const editorPackages = Object.keys(manifest.devDependencies ?? {}).filter((name) => name.startsWith('@codemirror/'));
    if (editorPackages.length > 0) {
      let notices = '';
      try {
        notices = await readFile(resolve(output, 'THIRD_PARTY_LICENSES.txt'), 'utf8');
      } catch {
        violations.push('Bundled CodeMirror editor requires THIRD_PARTY_LICENSES.txt in the release.');
      }
      if (notices && !notices.includes('MIT License')) {
        violations.push('CodeMirror third-party license notices must include the MIT license text.');
      }
      for (const packageName of editorPackages) {
        if (!notices.includes(`## ${packageName}@`)) {
          violations.push(`CodeMirror package license is missing from THIRD_PARTY_LICENSES.txt: ${packageName}`);
        }
      }
    }

    if (manifest.devDependencies?.typescript) {
      if (!filePaths.has('src/typescript-compiler.worker.js')) {
        violations.push('The TypeScript runner requires its bundled compiler worker in the static release.');
      }
      let notices = '';
      try {
        notices = await readFile(resolve(output, 'THIRD_PARTY_LICENSES.txt'), 'utf8');
      } catch {
        violations.push('The bundled TypeScript compiler requires THIRD_PARTY_LICENSES.txt in the release.');
      }
      if (notices && (!notices.includes('## typescript@') || !notices.includes('Apache License'))) {
        violations.push('The TypeScript compiler requires its Apache-2.0 license notice in the release.');
      }
    }

    if (manifest.devDependencies?.pyodide) {
      const runtimeBase = 'public/runtime/pyodide/';
      const requiredRuntimeFiles = [
        'src/fastapi-runner.worker.js',
        ...['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'runtime-manifest.json']
          .map((name) => `${runtimeBase}${name}`),
      ];
      for (const requiredPath of requiredRuntimeFiles) {
        if (!filePaths.has(requiredPath)) {
          violations.push(`The FastAPI/Pyodide runner requires its local release asset: ${requiredPath}`);
        }
      }

      let runtimeManifest = null;
      try {
        runtimeManifest = JSON.parse(await readFile(resolve(output, `${runtimeBase}runtime-manifest.json`), 'utf8'));
      } catch {
        violations.push('The FastAPI/Pyodide runtime manifest is missing or invalid.');
      }

      if (runtimeManifest) {
        if (!runtimeManifest.pyodide || String(runtimeManifest.pyodide) !== String(manifest.devDependencies.pyodide)) {
          violations.push('The Pyodide package and bundled runtime manifest versions must match exactly.');
        }
        if (!runtimeManifest.fastapi || !runtimeManifest.python || !Array.isArray(runtimeManifest.wheels) || runtimeManifest.wheels.length === 0) {
          violations.push('The FastAPI/Pyodide runtime manifest must declare versions and pinned wheels.');
        }

        for (const wheel of runtimeManifest.wheels ?? []) {
          if (!wheel || !/^[A-Za-z0-9_.+-]+\.whl$/.test(wheel.file ?? '') || !/^[a-f0-9]{64}$/i.test(wheel.sha256 ?? '')) {
            violations.push(`Invalid FastAPI/Pyodide wheel manifest entry: ${wheel?.file ?? '(missing file)'}`);
            continue;
          }

          const wheelPath = `${runtimeBase}${wheel.file}`;
          if (!filePaths.has(wheelPath)) {
            violations.push(`FastAPI/Pyodide wheel is missing from the release: ${wheelPath}`);
            continue;
          }
          const actualHash = createHash('sha256').update(await readFile(resolve(output, wheelPath))).digest('hex');
          if (actualHash !== wheel.sha256.toLowerCase()) {
            violations.push(`FastAPI/Pyodide wheel SHA-256 does not match its manifest: ${wheel.file}`);
          }
        }

        let notices = '';
        try {
          notices = await readFile(resolve(output, 'THIRD_PARTY_LICENSES.txt'), 'utf8');
        } catch {
          violations.push('The FastAPI/Pyodide runtime requires THIRD_PARTY_LICENSES.txt in the release.');
        }
        for (const notice of [
          'Pyodide JavaScript runtime',
          `fastapi ${runtimeManifest.fastapi}`,
          `asgi-lifespan ${runtimeManifest.asgiLifespan}`,
          'opentelemetry-api',
        ]) {
          if (notices && !notices.includes(notice)) {
            violations.push(`FastAPI/Pyodide third-party license notices are missing ${notice}.`);
          }
        }
      }
    }
  } catch {
    violations.push('Root package.json is missing or invalid.');
  }

  const largest = files.reduce((current, file) => (!current || file.bytes > current.bytes ? file : current), null);
  return {
    ok: violations.length === 0,
    files: files.length,
    bytes: files.reduce((total, file) => total + file.bytes, 0),
    largest,
    violations,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await auditRelease();
  if (!result.ok) {
    process.stderr.write(`Release audit failed:\n${result.violations.map((issue) => `- ${issue}`).join('\n')}\n`);
    process.exitCode = 1;
  } else {
    const largestMiB = (result.largest.bytes / 1024 / 1024).toFixed(3);
    process.stdout.write(`Release audit passed: ${result.files} files, largest ${largestMiB} MiB, same-origin scripts and connections, no external script/style sources, isolated runner CSP, no runtime packages, server/development files, or learner data.\n`);
  }
}
