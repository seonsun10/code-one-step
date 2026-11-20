import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as bundle } from 'esbuild';
import { codingProblems } from '../src/coding-problems.js';
import { tracks } from '../src/content.js';
import { validateCodingProblemBank } from './coding-problem-schema.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');
const knownTopicIds = new Set(tracks.flatMap((track) => track.topics.map((topic) => topic.id)));
const problemBankCheck = validateCodingProblemBank(codingProblems, { knownTopicIds });
if (!problemBankCheck.valid) {
  throw new Error(`Coding problem bank is invalid:\n${problemBankCheck.errors.join('\n')}`);
}

if (!outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error('Build output must remain inside the project folder.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(resolve(projectRoot, 'index.html'), resolve(outputDirectory, 'index.html'));
await cp(resolve(projectRoot, '_headers'), resolve(outputDirectory, '_headers'));
await cp(resolve(projectRoot, 'src'), resolve(outputDirectory, 'src'), { recursive: true, force: true });
await cp(resolve(projectRoot, 'public'), resolve(outputDirectory, 'public'), { recursive: true, force: true });
const pyodidePackageRoot = resolve(projectRoot, 'node_modules/pyodide');
const pyodideDistDirectory = resolve(outputDirectory, 'public/runtime/pyodide');
await mkdir(pyodideDistDirectory, { recursive: true });
for (const asset of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip']) {
  await cp(resolve(pyodidePackageRoot, asset), resolve(pyodideDistDirectory, asset));
}
await bundle({
  entryPoints: [resolve(projectRoot, 'src/editor-runtime.js')],
  outfile: resolve(outputDirectory, 'src/editor-runtime.js'),
  bundle: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  legalComments: 'inline',
});
await bundle({
  entryPoints: [resolve(projectRoot, 'src/typescript-compiler.worker.js')],
  outfile: resolve(outputDirectory, 'src/typescript-compiler.worker.js'),
  bundle: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
});
await bundle({
  entryPoints: [resolve(projectRoot, 'src/postgresql-query.worker.js')],
  outfile: resolve(outputDirectory, 'src/postgresql-query.worker.js'),
  bundle: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
});

const postgresqlDist = resolve(projectRoot, 'node_modules/@electric-sql/pglite/dist');
for (const asset of ['pglite.wasm', 'initdb.wasm', 'pglite.data']) {
  await cp(resolve(postgresqlDist, asset), resolve(outputDirectory, 'src', asset));
}

const packageLock = JSON.parse(await readFile(resolve(projectRoot, 'package-lock.json'), 'utf8'));
const editorPackages = Object.entries(packageLock.packages)
  .filter(([name, entry]) => name.startsWith('node_modules/')
    && entry.license === 'MIT'
    && name !== 'node_modules/esbuild'
    && !name.startsWith('node_modules/@esbuild/'))
  .sort(([left], [right]) => left.localeCompare(right));
const licenseSections = await Promise.all(editorPackages.map(async ([packagePath, entry]) => {
  const packageName = packagePath.slice('node_modules/'.length);
  const licenseText = await readFile(resolve(projectRoot, packagePath, 'LICENSE'), 'utf8');
  return `## ${packageName}@${entry.version} (MIT)\n\n${licenseText.trim()}`;
}));
const typescriptPackage = packageLock.packages['node_modules/typescript'];
if (typescriptPackage) {
  const typescriptRoot = resolve(projectRoot, 'node_modules/typescript');
  const [licenseText, thirdPartyNotice] = await Promise.all([
    readFile(resolve(typescriptRoot, 'LICENSE.txt'), 'utf8'),
    readFile(resolve(typescriptRoot, 'ThirdPartyNoticeText.txt'), 'utf8'),
  ]);
  licenseSections.push(`## typescript@${typescriptPackage.version} (Apache-2.0)\n\n${licenseText.trim()}\n\n### Bundled third-party notices\n\n${thirdPartyNotice.trim()}`);
}
const pglitePackage = packageLock.packages['node_modules/@electric-sql/pglite'];
if (pglitePackage) {
  const pgliteRoot = resolve(projectRoot, 'node_modules/@electric-sql/pglite');
  const apacheLicense = await readFile(resolve(pgliteRoot, 'LICENSE'), 'utf8');
  licenseSections.push(`## @electric-sql/pglite@${pglitePackage.version} (Apache-2.0 and PostgreSQL License)\n\n${apacheLicense.trim()}\n\n### PostgreSQL License\n\nPostgreSQL Database Management System\n(also known as Postgres, formerly as Postgres95)\n\nPortions Copyright © 1996-2026, The PostgreSQL Global Development Group\n\nPortions Copyright © 1994, The Regents of the University of California\n\nPermission to use, copy, modify, and distribute this software and its documentation for any purpose, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and this paragraph and the following two paragraphs appear in all copies.\n\nIN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\nTHE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.`);
}
await writeFile(
  resolve(outputDirectory, 'THIRD_PARTY_LICENSES.txt'),
  `Third-party license notices for locally bundled CodeMirror editor packages, TypeScript compiler worker, PostgreSQL WASM runtime, and FastAPI/Pyodide runtime.\n\n${licenseSections.join('\n\n')}\n\n${(await readFile(resolve(projectRoot, 'licenses/fastapi-runtime-wheel-notices.txt'), 'utf8')).trim()}\n`,
);
process.stdout.write(`Static site copied to ${outputDirectory}\n`);
