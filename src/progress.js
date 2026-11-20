export const PROGRESS_FORMAT = 'study-web-progress';
export const LEGACY_PROGRESS_VERSION = 1;
export const PROGRESS_VERSION = 2;
export const MAX_BACKUP_BYTES = 1_000_000;
export const MAX_COMPLETED_LESSONS = 1_000;
const MAX_ANSWERS = 500;
const MAX_CODING_ANSWERS = 500;
const MAX_EXERCISE_RESULTS = 10_000;
const MAX_CODING_RESULTS = 5_000;
const MAX_DRAFTS = 100;
const MAX_CODING_DRAFTS = 100;
const MAX_EXECUTION_TESTS = 20;

function normalizeExecution(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const states = new Set(['passed', 'partial', 'error', 'timeout']);
  if (!states.has(value.state)) return null;
  const total = Number.isInteger(value.total) ? Math.max(0, Math.min(MAX_EXECUTION_TESTS, value.total)) : 0;
  const results = Array.isArray(value.results)
    ? value.results.slice(0, MAX_EXECUTION_TESTS).map((result) => ({
        passed: result?.passed === true,
        actualAvailable: result?.actualAvailable === true,
        actual: typeof result?.actual === 'string' ? result.actual.slice(0, 1800) : '',
        output: typeof result?.output === 'string' ? result.output.slice(0, 1800) : '',
        error: typeof result?.error === 'string' ? result.error.slice(0, 500) : '',
      }))
    : [];
  return {
    state: value.state,
    passedCount: Number.isInteger(value.passedCount) ? Math.max(0, Math.min(total, value.passedCount)) : 0,
    total,
    error: typeof value.error === 'string' ? value.error.slice(0, 500) : '',
    output: typeof value.output === 'string' ? value.output.slice(0, 1800) : '',
    outputWasTruncated: value.outputWasTruncated === true,
    results,
  };
}

function validTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
    ? value
    : new Date().toISOString();
}

export function emptyProgress() {
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: [],
    legacyCompletedLessonIds: [],
    answers: [],
    exerciseResults: [],
    drafts: {},
    codingAnswers: [],
    codingResults: [],
    codingDrafts: {},
    codingRecordsSeparated: true,
    lastLessonId: null,
    lastExerciseId: null,
    lastTrackId: null,
    lastCodingProblemId: null,
    lastActivity: 'learning',
    codingFilters: emptyCodingFilters(),
    updatedAt: new Date().toISOString(),
  };
}

function emptyCodingFilters() {
  return { search: '', language: '', level: '', topic: '', status: '' };
}

function normalizeCodingFilters(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyCodingFilters();
  return {
    search: typeof value.search === 'string' ? value.search.trim().slice(0, 100) : '',
    language: typeof value.language === 'string' ? value.language.slice(0, 50) : '',
    level: typeof value.level === 'string' ? value.level.slice(0, 50) : '',
    topic: typeof value.topic === 'string' ? value.topic.slice(0, 120) : '',
    status: ['not-started', 'in-progress', 'review', 'solved'].includes(value.status) ? value.status : '',
  };
}

export function isSupportedProgressVersion(version) {
  return version === LEGACY_PROGRESS_VERSION || version === PROGRESS_VERSION;
}

export function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyProgress();
  const hasExerciseResults = Array.isArray(value.exerciseResults);
  const normalizeAnswers = (items, limit) => Array.isArray(items)
    ? items
        .filter((answer) => answer && typeof answer.exerciseId === 'string' && typeof answer.correct === 'boolean')
        .slice(-limit)
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
          ...(normalizeExecution(answer.execution) ? { execution: normalizeExecution(answer.execution) } : {}),
        }))
    : [];
  const answers = normalizeAnswers(value.answers, MAX_ANSWERS);
  const codingAnswers = normalizeAnswers(value.codingAnswers, MAX_CODING_ANSWERS);
  const normalizeResults = (items, answerItems) => {
    const resultByExercise = new Map();
    for (const result of Array.isArray(items) ? items : []) {
      if (!result || typeof result.exerciseId !== 'string' || typeof result.correct !== 'boolean') continue;
      const exerciseId = result.exerciseId.slice(0, 120);
      resultByExercise.delete(exerciseId);
      resultByExercise.set(exerciseId, {
        exerciseId,
        correct: result.correct,
        answeredAt: validTimestamp(result.answeredAt),
      });
    }
    for (const answer of answerItems) {
      const current = resultByExercise.get(answer.exerciseId);
      if (!current || timestampOf(answer) >= timestampOf(current)) {
        resultByExercise.set(answer.exerciseId, {
          exerciseId: answer.exerciseId,
          correct: answer.correct,
          answeredAt: answer.answeredAt,
        });
      }
    }
    return [...resultByExercise.values()];
  };
  const exerciseResults = normalizeResults(value.exerciseResults, answers).slice(-MAX_EXERCISE_RESULTS);
  const codingResults = normalizeResults(value.codingResults, codingAnswers).slice(-MAX_CODING_RESULTS);
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: Array.isArray(value.completedLessonIds)
      ? [...new Set(value.completedLessonIds.filter((id) => typeof id === 'string').slice(0, MAX_COMPLETED_LESSONS))]
      : [],
    legacyCompletedLessonIds: [...new Set((Array.isArray(value.legacyCompletedLessonIds)
      ? value.legacyCompletedLessonIds
      : !hasExerciseResults && Array.isArray(value.completedLessonIds)
        ? value.completedLessonIds
        : []).filter((id) => typeof id === 'string').slice(0, MAX_COMPLETED_LESSONS))],
    answers,
    exerciseResults,
    drafts: normalizeDrafts(value.drafts),
    codingAnswers,
    codingResults,
    codingDrafts: normalizeDrafts(value.codingDrafts, MAX_CODING_DRAFTS),
    codingRecordsSeparated: value.codingRecordsSeparated === true,
    lastLessonId: typeof value.lastLessonId === 'string' ? value.lastLessonId.slice(0, 120) : null,
    lastExerciseId: typeof value.lastExerciseId === 'string' ? value.lastExerciseId.slice(0, 120) : null,
    lastTrackId: typeof value.lastTrackId === 'string' ? value.lastTrackId.slice(0, 120) : null,
    lastCodingProblemId: typeof value.lastCodingProblemId === 'string' ? value.lastCodingProblemId.slice(0, 120) : null,
    lastActivity: value.lastActivity === 'coding' ? 'coding' : 'learning',
    codingFilters: normalizeCodingFilters(value.codingFilters),
    updatedAt: validTimestamp(value.updatedAt),
  };
}

export function separateCodingRecords(progress, codingProblemIds) {
  if (progress.codingRecordsSeparated) return progress;
  const knownIds = new Set(codingProblemIds);
  const codingAnswers = new Map((progress.codingAnswers ?? []).map((answer) => [`${answer.exerciseId}:${answer.answeredAt}`, answer]));
  for (const answer of progress.answers ?? []) {
    if (knownIds.has(answer.exerciseId)) codingAnswers.set(`${answer.exerciseId}:${answer.answeredAt}`, answer);
  }
  progress.codingAnswers = [...codingAnswers.values()].slice(-MAX_CODING_ANSWERS);
  const codingResults = new Map((progress.codingResults ?? []).map((result) => [result.exerciseId, result]));
  for (const result of progress.exerciseResults ?? []) {
    const current = codingResults.get(result.exerciseId);
    if (knownIds.has(result.exerciseId) && (!current || timestampOf(result) >= timestampOf(current))) {
      codingResults.set(result.exerciseId, result);
    }
  }
  progress.codingResults = [...codingResults.values()].slice(-MAX_CODING_RESULTS);
  for (const id of knownIds) {
    if (typeof progress.drafts?.[id] === 'string' && typeof progress.codingDrafts?.[id] !== 'string') {
      progress.codingDrafts[id] = progress.drafts[id];
    }
  }
  progress.codingRecordsSeparated = true;
  return progress;
}

function timestampOf(result) {
  const timestamp = Date.parse(result?.answeredAt);
  return Number.isFinite(timestamp) ? timestamp : -1;
}

function latestResultsFrom(progress, resultKey, answerKey) {
  const resultByExercise = new Map(
    (Array.isArray(progress?.[resultKey]) ? progress[resultKey] : [])
      .filter((result) => result && typeof result.exerciseId === 'string' && typeof result.correct === 'boolean')
      .map((result) => [result.exerciseId, result]),
  );
  for (const answer of Array.isArray(progress?.[answerKey]) ? progress[answerKey] : []) {
    if (answer && typeof answer.exerciseId === 'string' && typeof answer.correct === 'boolean') {
      const current = resultByExercise.get(answer.exerciseId);
      if (!current || timestampOf(answer) >= timestampOf(current)) resultByExercise.set(answer.exerciseId, answer);
    }
  }
  return [...resultByExercise.values()];
}

export function migrateExerciseIds(progress, getCurrentExerciseId, regradeAnswer) {
  if (!progress || typeof progress !== 'object' || typeof getCurrentExerciseId !== 'function') return progress;
  const migratedAnswers = new Map();
  for (const answer of Array.isArray(progress.answers) ? progress.answers : []) {
    if (!answer || typeof answer.exerciseId !== 'string') continue;
    const previousId = answer.exerciseId;
    const currentId = getCurrentExerciseId(previousId);
    if (previousId === currentId) continue;
    answer.exerciseId = currentId;
    if (typeof regradeAnswer === 'function') answer.correct = Boolean(regradeAnswer(currentId, answer.response));
    migratedAnswers.set(`${currentId}:${answer.answeredAt}`, answer);
  }
  for (const result of Array.isArray(progress.exerciseResults) ? progress.exerciseResults : []) {
    if (!result || typeof result.exerciseId !== 'string') continue;
    const previousId = result.exerciseId;
    const currentId = getCurrentExerciseId(previousId);
    if (previousId === currentId) continue;
    result.exerciseId = currentId;
    if (typeof regradeAnswer === 'function') {
      result.correct = migratedAnswers.get(`${currentId}:${result.answeredAt}`)?.correct ?? false;
    }
  }
  if (typeof progress.lastExerciseId === 'string') {
    progress.lastExerciseId = getCurrentExerciseId(progress.lastExerciseId);
  }
  if (progress.drafts && typeof progress.drafts === 'object' && !Array.isArray(progress.drafts)) {
    const drafts = Object.fromEntries(Object.entries(progress.drafts).filter(([id]) => getCurrentExerciseId(id) === id));
    for (const [id, draft] of Object.entries(progress.drafts)) {
      const currentId = getCurrentExerciseId(id);
      if (currentId !== id && !Object.hasOwn(drafts, currentId)) drafts[currentId] = draft;
    }
    progress.drafts = drafts;
  }
  return progress;
}

export function latestExerciseResults(progress) {
  return latestResultsFrom(progress, 'exerciseResults', 'answers');
}

export function latestCodingResults(progress) {
  return latestResultsFrom(progress, 'codingResults', 'codingAnswers');
}

export function recordExerciseResult(progress, result) {
  if (!result || typeof result.exerciseId !== 'string' || typeof result.correct !== 'boolean') {
    return latestExerciseResults(progress);
  }
  const resultByExercise = new Map(
    latestExerciseResults(progress).map((entry) => [entry.exerciseId, entry]),
  );
  const exerciseId = result.exerciseId.slice(0, 120);
  resultByExercise.set(exerciseId, {
    exerciseId,
    correct: result.correct,
    answeredAt: validTimestamp(result.answeredAt),
  });
  return [...resultByExercise.values()].slice(-MAX_EXERCISE_RESULTS);
}

export function recordCodingResult(progress, result) {
  if (!result || typeof result.exerciseId !== 'string' || typeof result.correct !== 'boolean') {
    return latestCodingResults(progress);
  }
  const resultByProblem = new Map(latestCodingResults(progress).map((entry) => [entry.exerciseId, entry]));
  const exerciseId = result.exerciseId.slice(0, 120);
  resultByProblem.set(exerciseId, {
    exerciseId,
    correct: result.correct,
    answeredAt: validTimestamp(result.answeredAt),
  });
  return [...resultByProblem.values()].slice(-MAX_CODING_RESULTS);
}

export function getCompletedLessonIds(lessons, progress) {
  const answers = new Map(latestExerciseResults(progress).map((answer) => [answer.exerciseId, answer]));
  return lessons.filter((lesson) => lesson.exercises.every((exercise) => answers.get(exercise.id)?.correct)).map((lesson) => lesson.id);
}

function normalizeDrafts(value, limit = MAX_DRAFTS) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .slice(-limit)
      .filter(([id, draft]) => typeof id === 'string' && (typeof draft === 'string' || Array.isArray(draft)))
      .map(([id, draft]) => [
        id.slice(0, 120),
        typeof draft === 'string' ? draft.slice(0, 20_000) : draft.filter(Number.isInteger).slice(0, 50),
      ]),
  );
}

export function makeBackup(progress, exportedAt = new Date().toISOString()) {
  const backup = {
    format: PROGRESS_FORMAT,
    version: PROGRESS_VERSION,
    exportedAt,
    progress: normalizeProgress(progress),
    omittedFromSizeLimit: { answers: 0, drafts: 0, codingAnswers: 0, codingDrafts: 0 },
  };
  const encoder = new TextEncoder();
  let size = encoder.encode(JSON.stringify(backup)).byteLength;

  const removeOldestAnswer = (collection, omittedKey) => {
    const hadMultiple = backup.progress[collection].length > 1;
    const removed = backup.progress[collection].shift();
    const previousOmitted = backup.omittedFromSizeLimit[omittedKey];
    const nextOmitted = previousOmitted + 1;
    size -= encoder.encode(JSON.stringify(removed)).byteLength + (hadMultiple ? 1 : 0);
    size += String(nextOmitted).length - String(previousOmitted).length;
    backup.omittedFromSizeLimit[omittedKey] = nextOmitted;
  };

  while (size > MAX_BACKUP_BYTES && backup.progress.answers.length) {
    removeOldestAnswer('answers', 'answers');
  }
  while (size > MAX_BACKUP_BYTES && backup.progress.codingAnswers.length) {
    removeOldestAnswer('codingAnswers', 'codingAnswers');
  }

  const draftEntries = Object.fromEntries(['drafts', 'codingDrafts'].map((key) => [key, Object.entries(backup.progress[key])]));
  const removeOldestDraft = (collection, omittedKey) => {
    const entries = draftEntries[collection];
    const hadMultiple = entries.length > 1;
    const [id, draft] = entries.shift();
    const previousOmitted = backup.omittedFromSizeLimit[omittedKey];
    const nextOmitted = previousOmitted + 1;
    size -= encoder.encode(JSON.stringify(id)).byteLength + 1 + encoder.encode(JSON.stringify(draft)).byteLength + (hadMultiple ? 1 : 0);
    size += String(nextOmitted).length - String(previousOmitted).length;
    backup.omittedFromSizeLimit[omittedKey] = nextOmitted;
    delete backup.progress[collection][id];
  };

  while (size > MAX_BACKUP_BYTES && draftEntries.drafts.length) {
    removeOldestDraft('drafts', 'drafts');
  }
  while (size > MAX_BACKUP_BYTES && draftEntries.codingDrafts.length) {
    removeOldestDraft('codingDrafts', 'codingDrafts');
  }

  size = encoder.encode(JSON.stringify(backup)).byteLength;
  while (size > MAX_BACKUP_BYTES && backup.progress.answers.length) {
    removeOldestAnswer('answers', 'answers');
    size = encoder.encode(JSON.stringify(backup)).byteLength;
  }
  while (size > MAX_BACKUP_BYTES && backup.progress.codingAnswers.length) {
    removeOldestAnswer('codingAnswers', 'codingAnswers');
    size = encoder.encode(JSON.stringify(backup)).byteLength;
  }
  while (size > MAX_BACKUP_BYTES && draftEntries.drafts.length) {
    removeOldestDraft('drafts', 'drafts');
    size = encoder.encode(JSON.stringify(backup)).byteLength;
  }
  while (size > MAX_BACKUP_BYTES && draftEntries.codingDrafts.length) {
    removeOldestDraft('codingDrafts', 'codingDrafts');
    size = encoder.encode(JSON.stringify(backup)).byteLength;
  }

  if (size > MAX_BACKUP_BYTES) throw new RangeError('학습 진도 요약이 백업 파일 크기 제한을 넘습니다.');
  return backup;
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

  if (!backup || backup.format !== PROGRESS_FORMAT || !isSupportedProgressVersion(backup.version) || !backup.progress) {
    throw new TypeError('코드한걸음 백업 파일 형식이나 버전을 확인할 수 없습니다.');
  }

  if (backup.progress.version !== undefined && backup.progress.version !== backup.version) {
    throw new TypeError('백업 파일과 학습 기록의 버전이 서로 다릅니다.');
  }

  if (!Array.isArray(backup.progress.completedLessonIds) || !Array.isArray(backup.progress.answers)) {
    throw new TypeError('백업 안에 학습 기록이 올바른 형식으로 들어 있지 않습니다.');
  }

  return normalizeProgress(backup.progress);
}
