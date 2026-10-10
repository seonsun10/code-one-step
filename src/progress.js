export const PROGRESS_FORMAT = 'study-web-progress';
export const PROGRESS_VERSION = 1;
export const MAX_BACKUP_BYTES = 1_000_000;
const MAX_ANSWERS = 500;
const MAX_DRAFTS = 100;

function validTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
    ? value
    : new Date().toISOString();
}

export function emptyProgress() {
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: [],
    answers: [],
    drafts: {},
    lastLessonId: null,
    lastTrackId: null,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyProgress();
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: Array.isArray(value.completedLessonIds)
      ? [...new Set(value.completedLessonIds.filter((id) => typeof id === 'string').slice(0, 200))]
      : [],
    answers: Array.isArray(value.answers)
      ? value.answers
          .filter((answer) => answer && typeof answer.exerciseId === 'string' && typeof answer.correct === 'boolean')
          .slice(-MAX_ANSWERS)
          .map((answer) => ({
            exerciseId: answer.exerciseId.slice(0, 120),
            correct: answer.correct,
            response: typeof answer.response === 'string'
              ? answer.response.slice(0, 20_000)
              : Array.isArray(answer.response)
                ? answer.response.filter(Number.isInteger).slice(0, 50)
                : String(answer.response ?? '').slice(0, 1_000),
            answeredAt: validTimestamp(answer.answeredAt),
            note: typeof answer.note === 'string' ? answer.note.slice(0, 500) : '',
          }))
      : [],
    drafts: normalizeDrafts(value.drafts),
    lastLessonId: typeof value.lastLessonId === 'string' ? value.lastLessonId.slice(0, 120) : null,
    lastTrackId: typeof value.lastTrackId === 'string' ? value.lastTrackId.slice(0, 120) : null,
    updatedAt: validTimestamp(value.updatedAt),
  };
}

function normalizeDrafts(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .slice(-MAX_DRAFTS)
      .filter(([id, draft]) => typeof id === 'string' && (typeof draft === 'string' || Array.isArray(draft)))
      .map(([id, draft]) => [
        id.slice(0, 120),
        typeof draft === 'string' ? draft.slice(0, 20_000) : draft.filter(Number.isInteger).slice(0, 50),
      ]),
  );
}

export function makeBackup(progress, exportedAt = new Date().toISOString()) {
  return {
    format: PROGRESS_FORMAT,
    version: PROGRESS_VERSION,
    exportedAt,
    progress: normalizeProgress(progress),
  };
}

export function parseBackup(text) {
  if (typeof text !== 'string') throw new TypeError('백업 파일을 문자 데이터로 읽을 수 없습니다.');
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) {
    throw new RangeError('백업 파일이 1MB보다 큽니다.');
  }

  let backup;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new SyntaxError('JSON 파일을 읽을 수 없습니다. 파일이 손상되지 않았는지 확인해 주세요.');
  }

  if (!backup || backup.format !== PROGRESS_FORMAT || backup.version !== PROGRESS_VERSION || !backup.progress) {
    throw new TypeError('코드한걸음 백업 파일 형식이나 버전을 확인할 수 없습니다.');
  }

  if (!Array.isArray(backup.progress.completedLessonIds) || !Array.isArray(backup.progress.answers)) {
    throw new TypeError('백업 안에 학습 기록이 올바른 형식으로 들어 있지 않습니다.');
  }

  return normalizeProgress(backup.progress);
}
