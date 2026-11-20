const choiceIds = ['a', 'b', 'c', 'd'];

export function choice(id, title, prompt, options, answerIndex, hint, explanation) {
  if (typeof id !== 'string' || !id || !Array.isArray(options) || options.length < 2 || options.length > choiceIds.length) {
    throw new TypeError(`Choice ${id} must have two to four options`);
  }
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
    throw new RangeError(`Choice ${id} must have a valid answer index`);
  }
  if (options.some((option) => !Array.isArray(option) || option.length !== 2 || option.some((value) => typeof value !== 'string' || !value.trim()))) {
    throw new TypeError(`Choice ${id} options must include non-empty text and feedback`);
  }
  const choiceExplanations = Object.fromEntries(options.map(([text, why], index) => [choiceIds[index], why]));
  return {
    id,
    type: 'choice',
    title,
    prompt,
    choices: options.map(([text], index) => ({ id: choiceIds[index], text })),
    choiceExplanations,
    answer: choiceIds[answerIndex],
    hint,
    explanation,
  };
}

export function locateError(id, title, prompt, language, codeLines, answerLines, hint, explanation) {
  return {
    id,
    type: 'locate-error',
    title,
    prompt,
    language,
    codeLines,
    answerLines,
    hint,
    explanation,
  };
}

export function shortAnswer(id, title, prompt, acceptedAnswers, hint, explanation, answerNormalization = 'default') {
  return {
    id,
    type: 'short-answer',
    title,
    prompt,
    acceptedAnswers,
    answerNormalization,
    hint,
    explanation,
  };
}

export function versionedShortAnswer(id, title, prompt, acceptedAnswers, hint, explanation, answerNormalization = 'default') {
  const match = String(id).match(/^(.*?)-v(\d+)$/);
  const baseId = match?.[1] ?? String(id);
  const previousVersion = Number(match?.[2] ?? 1);
  const exercise = shortAnswer(
    baseId + '-v' + (previousVersion + 1),
    title,
    prompt,
    acceptedAnswers,
    hint,
    explanation,
    answerNormalization,
  );
  exercise.legacyIds = [baseId];
  for (let version = 2; version <= previousVersion; version += 1) {
    exercise.legacyIds.push(baseId + '-v' + version);
  }
  return exercise;
}

export function outputTrace(id, title, prompt, acceptedAnswers, hint, explanation) {
  return versionedShortAnswer(id, title, prompt, acceptedAnswers, hint, explanation, 'exact-output');
}

export function repairCode({
  id,
  title,
  prompt,
  language,
  starterCode,
  solutionPatterns,
  acceptanceCriteria,
  gradingNote,
  hint,
  explanation,
}) {
  if (!Array.isArray(solutionPatterns) || solutionPatterns.length === 0) {
    throw new TypeError(`Repair exercise ${id} must have a complete accepted-code pattern`);
  }
  return {
    id,
    type: 'repair-code',
    title,
    prompt,
    language,
    starterCode,
    solutionPatterns,
    acceptanceCriteria,
    gradingNote,
    hint,
    explanation,
  };
}

export function lesson(id, topicId, title, duration, objective, intro, points, example, exercises, difficulty = '중급') {
  if (!Array.isArray(exercises) || exercises.length < 3) {
    throw new TypeError(`Lesson ${id} must have at least three exercises`);
  }
  if (new Set(exercises.map((exercise) => exercise?.id)).size !== exercises.length || exercises.some((exercise) => !exercise?.id)) {
    throw new TypeError(`Lesson ${id} must have uniquely identified exercises`);
  }
  return {
    id,
    topicId,
    title,
    difficulty,
    duration,
    objective,
    intro,
    points,
    example,
    exercises,
  };
}

export function studySession(number, title, objective, intro, example, exercises = [], exampleLanguage = null) {
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new RangeError('A study session number must be between one and five');
  }
  if (!Array.isArray(exercises)) throw new TypeError(`Study session ${number} exercises must be an array`);
  const activities = [
    {
      time: '10~15분',
      title: '목표를 내 말로 설명하기',
      prompt: `“${objective}”를 한 문장으로 설명해요.`,
    },
    {
      time: '20~25분',
      title: '예제 바꿔 보기',
      prompt: '예제의 값이나 조건을 한 가지 바꾸고 결과를 예상해요. 실행할 수 없다면 코드 흐름을 줄마다 따라가요.',
    },
    {
      time: '20~30분',
      title: '직접 작성하고 문제 풀기',
      prompt: '예제를 덮고 작은 변형을 작성한 뒤 세 문제를 풀어요. 틀린 문제는 놓친 규칙을 찾아 다시 설명해요.',
    },
    {
      time: '10분',
      title: '복습 기록 남기기',
      prompt: '배운 점, 남은 질문, 다시 풀 문제를 별도 노트에 적어요.',
    },
  ];
  return { number, title, objective, intro, example, activities, activitiesCollapsed: true, exercises, ...(exampleLanguage ? { exampleLanguage } : {}) };
}

export function weeklyLesson({
  id,
  topicId,
  week,
  title,
  objective,
  intro,
  points,
  example,
  sessions,
  difficulty = '기초',
}) {
  if (!Number.isInteger(week) || week < 1 || week > 52) {
    throw new RangeError(`Weekly lesson ${id} must use week one through fifty-two`);
  }
  if (!Array.isArray(sessions) || sessions.length !== 5) {
    throw new TypeError(`Weekly lesson ${id} must contain five study sessions`);
  }
  const sessionNumbers = sessions.map((session) => session.number);
  if (sessionNumbers.some((number, index) => number !== index + 1)) {
    throw new TypeError(`Weekly lesson ${id} sessions must be ordered from one to five`);
  }
  if (sessions.some((session) => session.exercises.length !== 3)) {
    throw new TypeError(`Weekly lesson ${id} must contain three questions per study session`);
  }
  const exercises = sessions.flatMap((session) =>
    session.exercises.map((exercise) => ({ ...exercise, studyDay: session.number })),
  );
  if (new Set(exercises.map((exercise) => exercise.id)).size !== 15 || exercises.some((exercise) => !exercise.id)) {
    throw new TypeError(`Weekly lesson ${id} must contain fifteen uniquely identified questions`);
  }
  return {
    id,
    topicId,
    week,
    title,
    difficulty,
    duration: '주 5회 · 회당 60~90분',
    objective,
    intro,
    points,
    example,
    sessions,
    exercises,
  };
}
