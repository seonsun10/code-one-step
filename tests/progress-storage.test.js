import assert from 'node:assert/strict';
import test from 'node:test';
import { createProgressStorage } from '../src/progress-storage.js';
import { emptyProgress, makeBackup, MAX_BACKUP_BYTES, parseBackup } from '../src/progress.js';
import { MAX_LOCAL_BYTES } from '../src/storage.js';

function createMemoryStorage(options = {}) {
  let primary = options.primary ?? null;
  let fallback = options.fallback ?? null;
  let failPrimaryWrites = Boolean(options.failPrimaryWrites);
  return {
    adapter: {
      readPrimary: async () => primary,
      writePrimary: async (progress) => {
        if (failPrimaryWrites) throw new Error('primary unavailable');
        primary = structuredClone(progress);
      },
      readFallback: () => fallback,
      writeFallback: (progress) => { fallback = structuredClone(progress); },
      clearFallback: () => { fallback = null; },
      now: options.now ?? (() => new Date('2026-10-09T00:00:00.000Z')),
    },
    getPrimary: () => primary,
    getFallback: () => fallback,
    setPrimaryWritesAvailable: (available) => { failPrimaryWrites = !available; },
  };
}

function createSharedWriteLock() {
  let queue = Promise.resolve();
  return (operation) => {
    const result = queue.catch(() => undefined).then(operation);
    queue = result.then(() => undefined, () => undefined);
    return result;
  };
}

test('empty progress reports available IndexedDB before the first lesson is saved', async () => {
  const storage = createProgressStorage(createMemoryStorage().adapter);

  const restored = await storage.loadProgress();

  assert.equal(restored.version, emptyProgress().version);
  assert.equal(storage.getStorageMode(), '이 기기에 저장');
});

test('empty progress reports browser fallback when IndexedDB is unavailable', async () => {
  const storage = createProgressStorage({
    readPrimary: async () => { throw new Error('IndexedDB unavailable'); },
    writePrimary: async () => { throw new Error('IndexedDB unavailable'); },
    readFallback: () => null,
    writeFallback: () => {},
  });

  await storage.loadProgress();

  assert.equal(storage.getStorageMode(), '이 브라우저에 저장');
});

test('empty progress stays preparing when neither local store can be opened', async () => {
  const storage = createProgressStorage({
    readPrimary: async () => { throw new Error('IndexedDB unavailable'); },
    writePrimary: async () => { throw new Error('IndexedDB unavailable'); },
    readFallback: () => { throw new Error('localStorage unavailable'); },
    writeFallback: () => { throw new Error('localStorage unavailable'); },
  });

  await storage.loadProgress();

  assert.equal(storage.getStorageMode(), '저장 준비 중');
});

test('newer fallback progress is restored and promoted into IndexedDB', async () => {
  const memory = createMemoryStorage({
    primary: { ...emptyProgress(), lastTrackId: 'older', updatedAt: '2026-10-08T00:00:00.000Z' },
    fallback: { ...emptyProgress(), lastTrackId: 'newer', updatedAt: '2026-10-09T00:00:00.000Z' },
  });
  const storage = createProgressStorage(memory.adapter);

  const restored = await storage.loadProgress();

  assert.equal(restored.lastTrackId, 'newer');
  assert.equal(memory.getPrimary().lastTrackId, 'newer');
  assert.equal(storage.getStorageMode(), '이 기기에 저장');
});

test('stored v1 records load as v2 with empty coding-only fields', async () => {
  const legacy = { ...emptyProgress(), version: 1, lastTrackId: 'javascript' };
  delete legacy.codingAnswers;
  delete legacy.codingResults;
  delete legacy.codingDrafts;
  delete legacy.codingRecordsSeparated;
  delete legacy.lastCodingProblemId;
  delete legacy.lastActivity;
  delete legacy.codingFilters;
  const storage = createProgressStorage(createMemoryStorage({ primary: legacy }).adapter);

  const restored = await storage.loadProgress();

  assert.equal(restored.version, 2);
  assert.equal(restored.lastTrackId, 'javascript');
  assert.deepEqual(restored.codingAnswers, []);
  assert.deepEqual(restored.codingResults, []);
  assert.deepEqual(restored.codingDrafts, {});
  assert.equal(restored.codingRecordsSeparated, false);
});

test('malformed fallback records cannot replace valid IndexedDB progress', async () => {
  for (const fallback of [
    {},
    { ...emptyProgress(), lastTrackId: 'broken-date', updatedAt: 'not-a-date' },
  ]) {
    const memory = createMemoryStorage({
      primary: { ...emptyProgress(), lastTrackId: 'keep', updatedAt: '2026-10-08T00:00:00.000Z' },
      fallback,
    });
    const storage = createProgressStorage(memory.adapter);

    const restored = await storage.loadProgress();

    assert.equal(restored.lastTrackId, 'keep');
    assert.equal(memory.getPrimary().lastTrackId, 'keep');
  }
});

test('fallback progress survives IndexedDB failure and is promoted after recovery', async () => {
  const memory = createMemoryStorage({ failPrimaryWrites: true });
  const storage = createProgressStorage(memory.adapter);
  const progress = { ...emptyProgress(), lastTrackId: 'python' };

  await storage.saveProgress(progress);
  assert.equal(memory.getFallback().lastTrackId, 'python');
  assert.equal(storage.getStorageMode(), '이 브라우저에 저장');

  memory.setPrimaryWritesAvailable(true);
  const restored = await storage.loadProgress();
  assert.equal(restored.lastTrackId, 'python');
  assert.equal(memory.getPrimary().lastTrackId, 'python');
});

test('queued saves preserve the newest snapshot when an earlier write is slow', async () => {
  let primary = null;
  let holdFirstWrite = true;
  let startFirstWrite;
  let releaseFirstWrite;
  const firstStarted = new Promise((resolve) => { startFirstWrite = resolve; });
  const firstCanFinish = new Promise((resolve) => { releaseFirstWrite = resolve; });
  const storage = createProgressStorage({
    readPrimary: async () => primary,
    writePrimary: async (progress) => {
      if (holdFirstWrite) {
        holdFirstWrite = false;
        startFirstWrite();
        await firstCanFinish;
      }
      primary = structuredClone(progress);
    },
    readFallback: () => null,
    writeFallback: () => {},
    now: () => new Date('2026-10-09T00:00:00.000Z'),
  });

  const first = storage.saveProgress({ ...emptyProgress(), lastTrackId: 'first' });
  await firstStarted;
  const second = storage.saveProgress({ ...emptyProgress(), lastTrackId: 'second' });
  releaseFirstWrite();
  await Promise.all([first, second]);

  assert.equal(primary.lastTrackId, 'second');
  assert.ok(Date.parse(primary.updatedAt) > Date.parse('2026-10-09T00:00:00.000Z'));
});

test('separate tabs cannot overwrite a newer snapshot and explicit restore replaces it', async () => {
  const memory = createMemoryStorage();
  const withWriteLock = createSharedWriteLock();
  const firstTab = createProgressStorage({ ...memory.adapter, withWriteLock });
  const secondTab = createProgressStorage({ ...memory.adapter, withWriteLock });
  const [firstSnapshot, staleSnapshot] = await Promise.all([
    firstTab.loadProgress(),
    secondTab.loadProgress(),
  ]);
  firstSnapshot.lastTrackId = 'first-tab';
  staleSnapshot.lastTrackId = 'stale-tab';

  const saved = await firstTab.saveProgress(firstSnapshot);

  assert.equal(saved.lastTrackId, 'first-tab');
  assert.ok(Date.parse(saved.updatedAt) > Date.parse(firstSnapshot.updatedAt));
  await assert.rejects(secondTab.saveProgress(staleSnapshot), { name: 'StaleProgressError' });
  assert.equal(memory.getPrimary().lastTrackId, 'first-tab');

  staleSnapshot.lastTrackId = 'restored-backup';
  const restored = await secondTab.replaceProgress(staleSnapshot);

  assert.equal(restored.lastTrackId, 'restored-backup');
  assert.ok(Date.parse(restored.updatedAt) > Date.parse(saved.updatedAt));
  await assert.rejects(firstTab.saveProgress(firstSnapshot), { name: 'StaleProgressError' });
  assert.equal(memory.getPrimary().lastTrackId, 'restored-backup');
});

test('save reports failure when both local stores reject the write', async () => {
  const storage = createProgressStorage({
    readPrimary: async () => null,
    writePrimary: async () => { throw new Error('primary unavailable'); },
    readFallback: () => null,
    writeFallback: () => { throw new Error('fallback unavailable'); },
    now: () => new Date('2026-10-09T00:00:00.000Z'),
  });

  await assert.rejects(storage.saveProgress(emptyProgress()), /학습 기록을 저장하지 못했습니다/);
  assert.equal(storage.getStorageMode(), '저장 실패');
});

test('a maximum-size imported backup can be saved through the browser fallback', async () => {
  assert.equal(MAX_LOCAL_BYTES, MAX_BACKUP_BYTES);
  const source = emptyProgress();
  source.answers = Array.from({ length: 60 }, (_, index) => ({
    exerciseId: `exercise-${index}`,
    correct: true,
    response: 'x'.repeat(20_000),
    answeredAt: '2026-10-11T00:00:00.000Z',
  }));
  source.exerciseResults = source.answers.map(({ exerciseId, correct, answeredAt }) => ({ exerciseId, correct, answeredAt }));
  const backupText = JSON.stringify(makeBackup(source));
  assert.ok(new TextEncoder().encode(backupText).byteLength > MAX_BACKUP_BYTES - 25_000);
  const imported = parseBackup(backupText);
  let fallback = null;
  const storage = createProgressStorage({
    readPrimary: async () => { throw new Error('IndexedDB unavailable'); },
    writePrimary: async () => { throw new Error('IndexedDB unavailable'); },
    readFallback: () => fallback,
    writeFallback: (progress) => {
      const size = new TextEncoder().encode(JSON.stringify(progress)).byteLength;
      if (size > MAX_LOCAL_BYTES) throw new RangeError('fallback storage limit exceeded');
      fallback = structuredClone(progress);
    },
  });

  await storage.saveProgress(imported);

  assert.ok(fallback);
  assert.equal(storage.getStorageMode(), '이 브라우저에 저장');
});
