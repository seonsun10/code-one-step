import assert from 'node:assert/strict';
import test from 'node:test';
import { createProgressStorage } from '../src/progress-storage.js';
import { emptyProgress } from '../src/progress.js';

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

test('save reports failure when both local stores reject the write', async () => {
  const storage = createProgressStorage({
    readPrimary: async () => null,
    writePrimary: async () => { throw new Error('primary unavailable'); },
    readFallback: () => null,
    writeFallback: () => { throw new Error('fallback unavailable'); },
    now: () => new Date('2026-10-09T00:00:00.000Z'),
  });

  await assert.rejects(storage.saveProgress(emptyProgress()), /학습 기록을 저장하지 못했습니다/);
});
