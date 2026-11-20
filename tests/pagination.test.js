import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { paginationState } from '../src/pagination.js';

const mainScript = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

test('pagination returns bounded slices for empty, first, middle, and final pages', () => {
  assert.deepEqual(paginationState(0, 1, 20), {
    page: 1, totalPages: 1, startIndex: 0, endIndex: 0, pages: [1],
  });
  assert.deepEqual(paginationState(26, 2, 10), {
    page: 2, totalPages: 3, startIndex: 10, endIndex: 20, pages: [1, 2, 3],
  });
  assert.deepEqual(paginationState(200, 6, 20), {
    page: 6, totalPages: 10, startIndex: 100, endIndex: 120, pages: [1, '…', 5, 6, 7, '…', 10],
  });
  assert.deepEqual(paginationState(26, 99, 10), {
    page: 3, totalPages: 3, startIndex: 20, endIndex: 26, pages: [1, 2, 3],
  });
});

test('the long coding and practical foundations lists render only their current page', () => {
  assert.match(mainScript, /foundationsTrack\.lessons\.slice\(page\.startIndex, page\.endIndex\)/);
  assert.match(mainScript, /paginationState\(foundationsTrack\.lessons\.length, foundationsPageNumber, 10\)/);
  assert.match(mainScript, /paginationState\(visible, codingCatalogPageNumber, 20\)/);
  assert.match(mainScript, /matchingRows\.forEach\(\(row, index\) => \{\s*row\.hidden = index < page\.startIndex \|\| index >= page\.endIndex;/);
  assert.match(mainScript, /codingCatalogPageNumber = 1;\s*applyCodingFilters\(\);\s*saveCodingFilters\(\);/);
  assert.match(mainScript, /data-pagination-kind="\$\{kind\}" data-pagination-page=/);
  assert.match(mainScript, /aria-current="page"/);
  assert.match(styles, /\.pagination-controls\s*\{[^}]*justify-content:\s*center/);
  assert.match(styles, /\.pagination-page:focus-visible,\s*\.pagination-step:focus-visible\s*\{[^}]*outline:/);
});
