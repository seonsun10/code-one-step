import { emptyProgress, isSupportedProgressVersion, normalizeProgress } from './progress.js';

function timestamp(value) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : -1;
}

function newest(primary, fallback) {
  if (!primary) return fallback;
  if (!fallback) return primary;
  return timestamp(fallback.updatedAt) > timestamp(primary.updatedAt) ? fallback : primary;
}

function validStoredProgress(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && isSupportedProgressVersion(value.version)
    && Array.isArray(value.completedLessonIds)
    && Array.isArray(value.answers)
    && typeof value.updatedAt === 'string'
    && Number.isFinite(Date.parse(value.updatedAt)),
  );
}

export function createProgressStorage({
  readPrimary,
  writePrimary,
  readFallback,
  writeFallback,
  clearFallback = () => {},
  withWriteLock = (operation) => operation(),
  now = () => new Date(),
}) {
  let storageMode = '준비 중';
  let writeQueue = Promise.resolve();
  let lastKnownAt = -1;

  async function readBoth() {
    const [primaryResult, fallbackResult] = await Promise.allSettled([
      Promise.resolve().then(readPrimary),
      Promise.resolve().then(readFallback),
    ]);
    return {
      primary: primaryResult.status === 'fulfilled' && validStoredProgress(primaryResult.value)
        ? normalizeProgress(primaryResult.value)
        : null,
      fallback: fallbackResult.status === 'fulfilled' && validStoredProgress(fallbackResult.value)
        ? normalizeProgress(fallbackResult.value)
        : null,
      primaryAvailable: primaryResult.status === 'fulfilled',
      fallbackAvailable: fallbackResult.status === 'fulfilled',
    };
  }

  async function loadProgress() {
    const { primary, fallback, primaryAvailable, fallbackAvailable } = await readBoth();
    const latest = newest(primary, fallback);
    if (latest && latest === fallback && fallback !== primary) {
      storageMode = '이 브라우저에 저장';
      try {
        await writePrimary(fallback);
        storageMode = '이 기기에 저장';
      } catch {
        // Keep the newer fallback until a future IndexedDB write succeeds.
      }
    } else if (primary) {
      storageMode = '이 기기에 저장';
    } else if (fallback) {
      storageMode = '이 브라우저에 저장';
    } else if (primaryAvailable) {
      storageMode = '이 기기에 저장';
    } else if (fallbackAvailable) {
      storageMode = '이 브라우저에 저장';
    } else {
      storageMode = '저장 준비 중';
    }
    const progress = normalizeProgress(latest ?? emptyProgress());
    lastKnownAt = timestamp(progress.updatedAt);
    return progress;
  }

  async function writeProgress(value, replace = false) {
    const { primary, fallback } = await readBoth();
    const previous = newest(primary, fallback);
    const progress = normalizeProgress(value);
    const previousTime = timestamp(previous?.updatedAt);
    if (!replace && previous && previousTime > lastKnownAt && timestamp(progress.updatedAt) < previousTime) {
      storageMode = '저장 실패';
      const error = new Error('다른 탭에서 최신 학습 기록을 저장했습니다.');
      error.name = 'StaleProgressError';
      throw error;
    }
    const updatedAt = Math.max(
      now().getTime(),
      timestamp(progress.updatedAt) + 1,
      timestamp(previous?.updatedAt) + 1,
    );
    const saved = { ...progress, updatedAt: new Date(updatedAt).toISOString() };

    try {
      await writePrimary(saved);
      storageMode = '이 기기에 저장';
      try {
        await writeFallback(saved);
      } catch {
        try { await clearFallback(); } catch { /* IndexedDB holds the current copy. */ }
      }
      lastKnownAt = timestamp(saved.updatedAt);
      return saved;
    } catch (primaryError) {
      try {
        await writeFallback(saved);
        storageMode = '이 브라우저에 저장';
        lastKnownAt = timestamp(saved.updatedAt);
        return saved;
      } catch (fallbackError) {
        storageMode = '저장 실패';
        throw new Error(`학습 기록을 저장하지 못했습니다. ${fallbackError.message || primaryError.message}`);
      }
    }
  }

  function enqueueWrite(value, replace = false) {
    const operation = writeQueue.catch(() => undefined).then(() => withWriteLock(
      () => writeProgress(value, replace),
    ));
    writeQueue = operation;
    return operation;
  }

  function saveProgress(value) {
    return enqueueWrite(value);
  }

  function replaceProgress(value) {
    return enqueueWrite(value, true);
  }

  return {
    getStorageMode: () => storageMode,
    loadProgress,
    saveProgress,
    replaceProgress,
  };
}
