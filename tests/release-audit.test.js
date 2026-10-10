import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { auditRelease } from '../scripts/audit-release.mjs';

async function makeProject() {
  const projectRoot = await mkdtemp(join(tmpdir(), 'study-web-release-'));
  await mkdir(join(projectRoot, 'dist'), { recursive: true });
  await writeFile(join(projectRoot, 'package.json'), JSON.stringify({ dependencies: {} }));
  await writeFile(join(projectRoot, 'dist', 'index.html'), '<main>Learn</main>');
  await writeFile(join(projectRoot, 'dist', '_headers'), [
    '/',
    "  Content-Security-Policy: default-src 'self'; connect-src 'self'",
    '',
  ].join('\n'));
  return projectRoot;
}

test('release audit accepts a small static artifact with required headers', async () => {
  const projectRoot = await makeProject();
  try {
    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, true);
    assert.equal(result.files, 2);
    assert.deepEqual(result.violations, []);
    assert.equal(result.largest.path, '_headers');
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit rejects server directories, environment files, and runtime dependencies', async () => {
  const projectRoot = await makeProject();
  try {
    await mkdir(join(projectRoot, 'dist', 'functions'));
    await writeFile(join(projectRoot, 'dist', '.env.production'), 'SECRET=value');
    await writeFile(join(projectRoot, 'package.json'), JSON.stringify({ dependencies: { server: '1.0.0' } }));
    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes('functions')));
    assert.ok(result.violations.some((issue) => issue.includes('.env.production')));
    assert.ok(result.violations.some((issue) => issue.includes('Runtime package dependencies')));

    await writeFile(join(projectRoot, 'package.json'), JSON.stringify({ optionalDependencies: { optional: '1.0.0' } }));
    const optionalResult = await auditRelease({ projectRoot });
    assert.ok(optionalResult.violations.some((issue) => issue.includes('Optional runtime package dependencies')));

    await writeFile(join(projectRoot, 'package.json'), JSON.stringify({ peerDependencies: { peer: '1.0.0' } }));
    const peerResult = await auditRelease({ projectRoot });
    assert.ok(peerResult.violations.some((issue) => issue.includes('Peer runtime package dependencies')));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit rejects CSP policies that permit connections outside the site', async () => {
  const projectRoot = await makeProject();
  try {
    await writeFile(join(projectRoot, 'dist', '_headers'), [
      '/index.html',
      "  Content-Security-Policy: default-src 'self'; connect-src 'self' https://api.example.test",
      '',
    ].join('\n'));

    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes("may connect only to 'self' or 'none'")));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit rejects CSP policies that permit external script sources', async () => {
  const projectRoot = await makeProject();
  try {
    await writeFile(join(projectRoot, 'dist', '_headers'), [
      '/index.html',
      "  Content-Security-Policy: default-src 'self'; script-src https://cdn.example.test; connect-src 'self'",
      '',
    ].join('\n'));

    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes('external or unsupported script-src source')));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit rejects an index-only CSP that does not protect the root entry path', async () => {
  const projectRoot = await makeProject();
  try {
    await writeFile(join(projectRoot, 'dist', '_headers'), [
      '/index.html',
      "  Content-Security-Policy: default-src 'self'; connect-src 'self'",
      '',
    ].join('\n'));

    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes('for the root path / is required')));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit rejects Cloudflare rules that remove the CSP header', async () => {
  const projectRoot = await makeProject();
  try {
    await writeFile(join(projectRoot, 'dist', '_headers'), [
      '/*',
      "  Content-Security-Policy: default-src 'self'; connect-src 'self'",
      '/',
      '  ! Content-Security-Policy',
      '',
    ].join('\n'));

    const result = await auditRelease({ projectRoot });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes('Content-Security-Policy removal rules')));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('release audit reports missing required files and enforces supplied host limits', async () => {
  const projectRoot = await makeProject();
  try {
    await rm(join(projectRoot, 'dist', '_headers'));
    await writeFile(join(projectRoot, 'dist', 'large.js'), '123456789');
    const result = await auditRelease({ projectRoot, limits: { maxFiles: 1, maxFileBytes: 8 } });
    assert.equal(result.ok, false);
    assert.ok(result.violations.some((issue) => issue.includes('Required release file is missing: _headers')));
    assert.ok(result.violations.some((issue) => issue.includes('exceeds the 8-byte host limit')));
    assert.ok(result.violations.some((issue) => issue.includes('host limit is 1')));
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
