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

  if (entryPolicies.length === 0) {
    violations.push('A Content-Security-Policy for the root path / is required.');
  }

  for (const { route, value } of policies) {
    const directives = new Map();
    const relevantNames = new Set(['connect-src', 'default-src', 'script-src', 'script-src-elem']);
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
    const allowedScriptSources = new Set(["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", 'blob:']);
    for (const name of scriptDirectiveNames) {
      const sources = directives.get(name);
      if (sources && (sources.length === 0 || sources.some((source) => !allowedScriptSources.has(source)))) {
        violations.push(`Content-Security-Policy for ${route} has an external or unsupported ${name} source.`);
      }
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
    process.stdout.write(`Release audit passed: ${result.files} files, largest ${largestMiB} MiB, restrictive CSP without removals or external scripts, no runtime packages, server/development files, or local learner data.\n`);
  }
}
