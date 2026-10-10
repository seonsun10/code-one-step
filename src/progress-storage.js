import { emptyProgress, normalizeProgress, PROGRESS_VERSION } from './progress.js';

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
    && value.version === PROGRESS_VERSION
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
  now = () => new Date(),
}) {
  let storageMode = '준비 중';
  let writeQueue = Promise.resolve();

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
    };
  }

  async function loadProgress() {
    const { primary, fallback } = await readBoth();
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
    } else {
      storageMode = '저장 준비 중';
    }
    return normalizeProgress(latest ?? emptyProgress());
  }

  function saveProgress(value) {
    const operation = writeQueue.catch(() => undefined).then(async () => {
      const { primary, fallback } = await readBoth();
      const previous = newest(primary, fallback);
      const progress = normalizeProgress(value);
      const updatedAt = Math.max(
        now().getTime(),
        timestamp(progress.updatedAt),
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
        return saved;
      } catch (primaryError) {
        try {
          await writeFallback(saved);
          storageMode = '이 브라우저에 저장';
          return saved;
        } catch (fallbackError) {
          throw new Error(`학습 기록을 저장하지 못했습니다. ${fallbackError.message || primaryError.message}`);
        }
      }
    });
    writeQueue = operation;
    return operation;
  }

  return {
    getStorageMode: () => storageMode,
    loadProgress,
    saveProgress,
  };
}
