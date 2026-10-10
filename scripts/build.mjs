import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (!outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error('Build output must remain inside the project folder.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(resolve(projectRoot, 'index.html'), resolve(outputDirectory, 'index.html'));
await cp(resolve(projectRoot, '_headers'), resolve(outputDirectory, '_headers'));
await cp(resolve(projectRoot, 'src'), resolve(outputDirectory, 'src'), { recursive: true, force: true });
await cp(resolve(projectRoot, 'public'), resolve(outputDirectory, 'public'), { recursive: true, force: true });
process.stdout.write(`Static site copied to ${outputDirectory}\n`);
