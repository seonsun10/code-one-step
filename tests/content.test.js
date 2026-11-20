import test from 'node:test';
import assert from 'node:assert/strict';
import { exerciseTypes, findLessonForExercise, getCurrentExerciseId, getExercise, getLesson, lessons, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const exercises = lessons.flatMap((lesson) => lesson.exercises);

test('the learning catalog covers the selected language and framework tracks', () => {
  assert.deepEqual(tracks.map((track) => track.title), ['JavaScript', 'Python', 'Java', 'FastAPI', 'Spring Boot', 'React', 'Next.js', 'Kotlin · Android', 'C# · .NET', 'TypeScript', 'SQL · PostgreSQL', 'AI · LLM 기초와 활용']);
});

test('versioned Kotlin trace ids keep saved progress linked to current questions', () => {
  const kotlin = tracks.find((track) => track.id === 'kotlin');
  const traces = kotlin.lessons.slice(0, 27).flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises.filter((exercise) => exercise.title === '예제 결과 추적')));
  assert.equal(traces.length, 135);
  for (const exercise of traces) {
    assert.equal(exercise.answerNormalization, 'exact-output', exercise.id);
    assert.ok(exercise.legacyIds.length >= 2, exercise.id);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
      assert.equal(findLessonForExercise(legacyId).id, findLessonForExercise(exercise.id).id);
    }
  }
});

test('Kotlin Android identifier traces preserve case and resolve older progress ids', () => {
  const kotlin = tracks.find((track) => track.id === 'kotlin');
  const traces = kotlin.lessons.slice(27).flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer' && exercise.answerNormalization === 'case-sensitive');
  assert.equal(traces.length, 4);

  for (const exercise of traces) {
    assert.ok(exercise.legacyIds?.length, exercise.id);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
    }
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const wrongCase = answer.toLocaleLowerCase('ko-KR');
      if (wrongCase !== answer) assert.equal(gradeAnswer(exercise, wrongCase), false, `${exercise.id}: ${wrongCase}`);
    }
  }
});

test('versioned C# trace ids keep saved progress linked to current questions', () => {
  const csharp = tracks.find((track) => track.id === 'csharp');
  const traces = csharp.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises.filter((exercise) => exercise.title === '예제 결과 추적')));
  assert.equal(traces.length, 175);
  for (const exercise of traces) {
    assert.equal(exercise.answerNormalization, 'case-sensitive', exercise.id);
    assert.deepEqual(exercise.legacyIds, [exercise.id.replace('-v3-trace', '-v2-trace'), exercise.id.replace('-v3-trace', '-trace')]);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
      assert.equal(findLessonForExercise(legacyId).id, findLessonForExercise(exercise.id).id);
    }
  }
});

test('JavaScript output traces grade exact results and preserve every earlier question id', () => {
  const javascript = tracks.find((track) => track.id === 'javascript');
  const traces = javascript.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises
    .filter((exercise) => exercise.answerNormalization === 'exact-output')));
  assert.ok(traces.length >= 80);

  for (const exercise of traces) {
    assert.ok(exercise.legacyIds.length >= 1, exercise.id);
    for (const answer of exercise.acceptedAnswers) assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
      assert.equal(findLessonForExercise(legacyId).id, findLessonForExercise(exercise.id).id);
    }
  }

  const caseSensitiveOutput = getExercise('js-w2-d1-trace');
  assert.equal(gradeAnswer(caseSensitiveOutput, 'false'), true);
  assert.equal(gradeAnswer(caseSensitiveOutput, 'FALSE'), false);
});

test('Python code traces preserve exact output and their previous ids', () => {
  const python = tracks.find((track) => track.id === 'python');
  const traces = python.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises
    .filter((exercise) => exercise.type === 'short-answer' && /trace/i.test(exercise.id))));
  assert.equal(traces.length, 129);

  for (const exercise of traces) {
    assert.equal(exercise.answerNormalization, 'exact-output', exercise.id);
    assert.ok(exercise.legacyIds.length > 0, exercise.id);
    for (const answer of exercise.acceptedAnswers) assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
      assert.equal(findLessonForExercise(legacyId).id, findLessonForExercise(exercise.id).id);
    }
  }

  assert.equal(gradeAnswer(getExercise('py-w02-d4-trace-v2'), 'False'), true);
  assert.equal(gradeAnswer(getExercise('py-w02-d4-trace-v2'), 'false'), false);
  assert.equal(gradeAnswer(getExercise('py-functions-short'), 'None'), true);
  assert.equal(gradeAnswer(getExercise('py-functions-short'), 'none'), false);
  assert.equal(gradeAnswer(getExercise('py-modules-errors-short'), 'ValueError'), true);
  assert.equal(gradeAnswer(getExercise('py-modules-errors-short'), 'valueerror'), false);
  assert.equal(gradeAnswer(getExercise('py-files-context-short'), 'file.read()'), true);
  assert.equal(gradeAnswer(getExercise('py-files-context-short'), 'FILE.READ()'), false);
  assert.equal(gradeAnswer(getExercise('py-generators-short'), 'next(items)'), true);
  assert.equal(gradeAnswer(getExercise('py-generators-short'), 'NEXT(items)'), false);
  assert.equal(gradeAnswer(getExercise('py-async-short'), 'async'), true);
  assert.equal(gradeAnswer(getExercise('py-async-short'), 'ASYNC'), false);
});

test('Java code outputs and case-sensitive identifiers reject differently cased answers', () => {
  const cases = [
    ['java-w1-d3-short-v3', 'int attempts = 3; attempts = 4;', 'INT ATTEMPTS = 3; ATTEMPTS = 4;'],
    ['java-w13-d3-short-v2', 'read=Java', 'READ=JAVA'],
    ['java-w16-d1-short-v2', '/courses?language=java', '/COURSES?LANGUAGE=JAVA'],
    ['java-w21-d1-short-v2', 'eligible=true, canEnroll=true', 'ELIGIBLE=TRUE, CANENROLL=TRUE'],
    ['java-w23-d3-short-v2', '[Algorithms, Java]', '[ALGORITHMS, JAVA]'],
    ['java-w4-d2-short-v3', 'false', 'FALSE'],
    ['java-w7-d3-short-v3', 'null', 'NULL'],
    ['java-w10-d3-short-v3', 'safe, tools', 'SAFE, TOOLS'],
    ['java-w16-d2-short-v2', 'GET', 'get'],
    ['java-w18-d1-short-v2', 'Java', 'java'],
    ['java-map-short', 'minutesByCourse.get("Java")', 'MINUTESBYCOURSE.GET("JAVA")'],
    ['java-catch-short-v2', 'IOException', 'ioexception'],
    ['java-flatmap-short-v2', '[Java, APIs, clean, code]', '[JAVA, APIS, CLEAN, CODE]'],
    ['java-atomic-short-v2', 'AtomicInteger', 'atomicinteger'],
  ];

  for (const [legacyId, correctAnswer, wrongCase] of cases) {
    const exercise = getExercise(legacyId);
    assert.ok(exercise, legacyId);
    assert.ok(exercise.legacyIds.includes(legacyId), legacyId);
    assert.equal(gradeAnswer(exercise, correctAnswer), true, legacyId);
    assert.equal(gradeAnswer(exercise, wrongCase), false, legacyId);
  }
});

test('PostgreSQL output answers preserve case and resolve older saved question ids', () => {
  const postgresql = tracks.find((track) => track.id === 'postgresql');
  const traces = postgresql.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer'
      && exercise.answerNormalization === 'case-sensitive'
      && exercise.legacyIds?.some((id) => id.endsWith('-short')));
  assert.equal(traces.length, 37);

  for (const exercise of traces) {
    assert.ok(exercise.legacyIds.length >= 1, exercise.id);
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
    }
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const wrongCase = answer.toLocaleLowerCase('ko-KR');
      if (wrongCase !== answer) assert.equal(gradeAnswer(exercise, wrongCase), false, `${exercise.id}: ${wrongCase}`);
    }
  }
});

test('React result traces preserve JavaScript case and resolve older saved question ids', () => {
  const react = tracks.find((track) => track.id === 'react');
  const traces = react.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer'
      && exercise.answerNormalization === 'case-sensitive'
      && exercise.legacyIds?.length);
  assert.equal(traces.length, 20);

  for (const exercise of traces) {
    for (const legacyId of exercise.legacyIds) {
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
    }
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const wrongCase = answer.toLocaleLowerCase('ko-KR');
      if (wrongCase !== answer) assert.equal(gradeAnswer(exercise, wrongCase), false, `${exercise.id}: ${wrongCase}`);
    }
  }
});

test('JavaScript output-graded coding practice includes empty, signed, and decimal inputs', () => {
  const exercise = getExercise('js-sum-coding');
  assert.equal(exercise.type, 'coding');
  assert.equal(exercise.entryPoint, 'sumNumbers');
  assert.equal(exercise.tests.length, 6);
  assert.deepEqual(exercise.tests.map((item) => item.expected), [9, 5, 0, 0, -6, 3.75]);
  assert.deepEqual(exercise.acceptanceCriteria.requirements, [
    '배열에 담긴 모든 숫자의 합을 숫자로 반환합니다.',
    '빈 배열을 받으면 0을 반환합니다.',
  ]);
});

test('JavaScript standalone output answers reject changed casing and retain old ids', () => {
  const cases = [
    ['js-objects-undefined', 'undefined', 'UNDEFINED'],
    ['js-w22-d1-string-type-v2', 'string', 'STRING'],
    ['js-w22-d2-parse-value-v2', 'dark', 'DARK'],
    ['js-w24-d2-aborted-v2', 'true', 'TRUE'],
  ];
  for (const [legacyId, correctAnswer, wrongCase] of cases) {
    const exercise = getExercise(legacyId);
    assert.ok(exercise, legacyId);
    assert.ok(exercise.legacyIds?.includes(legacyId), legacyId);
    assert.equal(exercise.answerNormalization, 'exact-output', exercise.id);
    assert.equal(gradeAnswer(exercise, correctAnswer), true, legacyId);
    assert.equal(gradeAnswer(exercise, wrongCase), false, legacyId);
  }
});

test('each track offers weekly lessons with five sessions and fifteen questions per week', () => {
  assert.equal(lessons.length, 351);
  assert.equal(exercises.length, 5_265);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 351);
  assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 5_265);
  for (const track of tracks) {
    const expectedWeeks = track.id === 'nextjs' ? 33 : track.id === 'csharp' ? 35 : track.id === 'kotlin' ? 31 : track.id === 'postgresql' ? 39 : track.id === 'fastapi' ? 30 : track.id === 'ai' ? 27 : 26;
    assert.equal(track.course.weeks, expectedWeeks, track.id);
    assert.equal(track.course.sessions, expectedWeeks * 5, track.id);
    assert.equal(track.course.questions, expectedWeeks * 15, track.id);
    assert.equal(track.course.phases, track.id === 'nextjs' ? 7 : 6, track.id);
    assert.equal(track.course.contentStatus, '문항 검수 완료', track.id);
    assert.ok(Array.isArray(track.course.reviewedWeeks), track.id);
    assert.equal(track.lessons.length, expectedWeeks, track.id);
    assert.deepEqual(track.topics.map((topic) => topic.stage), Array.from({ length: track.id === 'nextjs' ? 7 : 6 }, (_, index) => index + 1), track.id);
    assert.equal(track.lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0), expectedWeeks * 15, track.id);
    track.lessons.forEach((lesson, index) => {
      assert.equal(lesson.number, index + 1, lesson.id);
      assert.equal(lesson.week, index + 1, lesson.id);
      assert.equal(lesson.stage, track.topics.find((topic) => topic.id === lesson.topicId)?.stage, lesson.id);
      assert.deepEqual(lesson.prerequisiteLessonIds, index ? [track.lessons[index - 1].id] : [], lesson.id);
      assert.equal(lesson.referenceVersion, track.contentReview.version, lesson.id);
      assert.equal(lesson.versionReviewedAt, track.contentReview.reviewedAt, lesson.id);
      assert.equal(lesson.studyDays.length, 5, lesson.id);
      assert.deepEqual(lesson.studyDays.map((day) => day.number), [1, 2, 3, 4, 5], lesson.id);
      assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), lesson.id);
      assert.equal(lesson.exercises.length, 15, lesson.id);
    });
  }
});

test('reviewed track-weeks stay approved with the AI course review recorded', () => {
  const expectedWeeks = {
    javascript: Array.from({ length: 26 }, (_, index) => index + 1),
    python: Array.from({ length: 26 }, (_, index) => index + 1),
    java: Array.from({ length: 26 }, (_, index) => index + 1),
    fastapi: Array.from({ length: 30 }, (_, index) => index + 1),
    spring: Array.from({ length: 26 }, (_, index) => index + 1),
    react: Array.from({ length: 26 }, (_, index) => index + 1),
    nextjs: Array.from({ length: 33 }, (_, index) => index + 1),
    kotlin: Array.from({ length: 31 }, (_, index) => index + 1),
    csharp: Array.from({ length: 35 }, (_, index) => index + 1),
    typescript: Array.from({ length: 26 }, (_, index) => index + 1),
    postgresql: Array.from({ length: 39 }, (_, index) => index + 1),
    ai: Array.from({ length: 27 }, (_, index) => index + 1),
  };

  for (const track of tracks) {
    assert.deepEqual(track.course.reviewedWeeks, expectedWeeks[track.id], track.id);
    for (const week of track.course.reviewedWeeks) {
      const lesson = track.lessons.find((item) => item.week === week);
      assert.equal(lesson.contentReviewStatus, '문항 검수 완료', lesson.id);
      assert.equal(lesson.studyDays.length, 5, lesson.id);
      assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), lesson.id);
    }
  }

  assert.equal(tracks.reduce((count, track) => count + track.course.reviewedWeeks.length, 0), 351);
  const ai = tracks.find((track) => track.id === 'ai');
  assert.equal(ai.course.contentStatus, '문항 검수 완료');
  assert.equal(ai.lessons.filter((lesson) => lesson.contentReviewStatus === '문항 검수 완료').length, 27);
});

test('every week and daily session has teaching text, examples, and three questions', () => {
  for (const lesson of lessons) {
    assert.ok(lesson.objective.length > 10, lesson.id);
    assert.equal(typeof lesson.intro, 'string', lesson.id);
    assert.ok(Array.isArray(lesson.points), lesson.id);
    assert.ok(lesson.example.length > 12, lesson.id);
    if (lesson.week > 12) assert.match(lesson.duration, /주 5회/, lesson.id);
    assert.ok(['입문', '기초', '중급', '고급', '심화', '실전'].includes(lesson.difficulty), lesson.id);
    assert.equal(lesson.exercises.length, 15, lesson.id);
    assert.equal(new Set(lesson.exercises.map((exercise) => exercise.id)).size, 15, lesson.id);
    assert.ok(lesson.exercises.every((exercise) => exerciseTypes.has(exercise.type)), lesson.id);
    for (const day of lesson.studyDays) {
      assert.ok(day.title.trim().length > 1, lesson.id);
      assert.ok(day.objective.length > 10, `${lesson.id} day ${day.number}`);
      assert.equal(typeof day.intro, 'string', `${lesson.id} day ${day.number}`);
      assert.ok(day.example.length > 8, `${lesson.id} day ${day.number}`);
      assert.equal(day.activities?.length, 4, `${lesson.id} day ${day.number} study routine`);
      assert.ok(day.activities.every((activity) => activity.time && activity.title && activity.prompt.length > 30), `${lesson.id} day ${day.number} study activities`);
      assert.equal(day.exercises.length, 3, `${lesson.id} day ${day.number}`);
      assert.ok(day.exercises.every((exercise) => exercise.studyDay === day.number), `${lesson.id} day ${day.number}`);
    }
  }
});

test('JavaScript foundation days name the skill being practiced instead of generic filler', () => {
  const javascript = tracks.find((track) => track.id === 'javascript');
  for (const lesson of javascript.lessons.slice(0, 12)) {
    const titles = lesson.studyDays.map((day) => day.title);
    assert.equal(new Set(titles).size, 5, lesson.id);
    for (const title of titles) {
      assert.match(title, /\d+일차 · (?!보강 학습)/, `${lesson.id}: ${title}`);
    }
  }
});

test('weeks marked reviewed use distinct question material on each of the five days', () => {
  const signature = (exercise) => {
    if (exercise.type === 'choice') return JSON.stringify({
      prompt: exercise.prompt,
      choices: exercise.choices.map((item) => item.text).sort(),
    });
    if (exercise.type === 'short-answer') return JSON.stringify({
      prompt: exercise.prompt,
      answers: exercise.acceptedAnswers.map((item) => item.trim().toLowerCase()).sort(),
    });
    if (exercise.type === 'locate-error') return JSON.stringify({ prompt: exercise.prompt, codeLines: exercise.codeLines });
    if (exercise.type === 'repair-code') return exercise.starterCode;
    if (exercise.type === 'coding') return JSON.stringify({ starterCode: exercise.starterCode, tests: exercise.tests });
    return exercise.prompt;
  };

  for (const track of tracks) {
    for (const lesson of track.lessons.filter((item) => track.course.reviewedWeeks.includes(item.week))) {
      for (const type of exerciseTypes) {
        const repeatedTypeQuestions = lesson.studyDays.flatMap((day) => day.exercises)
          .filter((exercise) => exercise.type === type);
        if (repeatedTypeQuestions.length < 2) continue;
        const signatures = repeatedTypeQuestions.map(signature);
        assert.equal(new Set(signatures).size, signatures.length, `${track.id} week ${lesson.week}: repeated ${type} material`);
      }
    }
  }
});

test('advanced JavaScript and React weeks have distinct, gradeable daily learning cases', () => {
  for (const trackId of ['javascript', 'react']) {
    const track = tracks.find((item) => item.id === trackId);
    for (const lesson of track.lessons.filter((item) => item.week > 12)) {
      assert.ok(track.course.reviewedWeeks.includes(lesson.week), lesson.id);
      assert.equal(lesson.contentReviewStatus, '문항 검수 완료', lesson.id);
      assert.equal(lesson.studyDays.length, 5, lesson.id);
      assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, `${lesson.id} daily examples`);
      assert.equal(new Set(lesson.studyDays.map((day) => day.objective)).size, 5, `${lesson.id} daily objectives`);
      assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), lesson.id);
      assert.ok(lesson.studyDays.every((day) => day.example.length > 12), lesson.id);
      assert.doesNotMatch(lesson.studyDays.map((day) => day.example).join('\n'), /function\s+\(/, `${lesson.id} repaired example signature`);
    }
  }
});

test('approved lessons use five distinct daily examples and their published answer keys are accepted', () => {
  let approvedWeeks = 0;
  for (const track of tracks) {
    for (const week of track.course.reviewedWeeks) {
      approvedWeeks += 1;
      const lesson = track.lessons.find((item) => item.week === week);
      assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, track.id + ' week ' + week + ' examples');
      for (const exercise of lesson.exercises) {
        if (exercise.type === 'choice') assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
        if (exercise.type === 'short-answer') assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        if (exercise.type === 'locate-error') assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        if (exercise.type === 'repair-code') assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
      }
    }
  }
  assert.equal(approvedWeeks, 351);
  assert.equal(approvedWeeks * 15, 5_265);
});

test('Python foundation implementation questions match the skill scheduled for each Friday', () => {
  const python = tracks.find((track) => track.id === 'python');
  const expectedFunctions = [
    'parse_integer', 'has_title', 'even_values', 'discounted', 'filter_minutes', 'nested_course_title',
    'parse_count', 'save_text_atomically', 'squares_until', 'StudySession', 'submit_cpu', 'completion_rate',
  ];
  for (const [index, name] of expectedFunctions.entries()) {
    const lesson = python.lessons.find((item) => item.week === index + 1);
    const friday = lesson.studyDays[4];
    const repair = friday.exercises.find((exercise) => exercise.type === 'repair-code');
    assert.ok(repair, lesson.id);
    assert.match(repair.starterCode, new RegExp(name), repair.id);
    if (index === 4) assert.match(repair.title, /기준에 맞는 값 고르기/, repair.id);
    else assert.match(repair.title, new RegExp(friday.title), repair.id);
  }
  const cpuTaskExample = python.lessons.find((item) => item.week === 11).studyDays[4].example;
  assert.match(cpuTaskExample, /if __name__ == "__main__"/);
  assert.match(cpuTaskExample, /ProcessPoolExecutor/);
  assert.match(cpuTaskExample, /def sum_squares\(limit\)/);
  assert.match(cpuTaskExample, /range\(limit\)/);
  assert.doesNotMatch(cpuTaskExample, /def square\(/);
});

test('Python week one answers and examples match each day’s foundation case', () => {
  const expectedAnswers = ['5', '34 str', '3.4 3 2\n-4 3', 'Mina: 40분', '28'];
  const expectedChoices = [
    '`count`에는 5가 저장된다.',
    '`34 str`',
    '`3.4`, `3`, `2`',
    '`Mina: 40분`',
    '정수 28',
  ];

  expectedAnswers.forEach((answer, index) => {
    const day = index + 1;
    const trace = getExercise(`py-w01-d${day}-trace-v2`);
    const concept = getExercise(`py-w01-d${day}-choice-v2`);
    assert.ok(trace, `missing Python week one day ${day} trace question`);
    assert.ok(concept, `missing Python week one day ${day} concept question`);
    assert.ok(trace.prompt.includes([
      'count = 4', 'raw = "3"', '17 / 5', 'f"{name}: {minutes}분"', 'int(raw)',
    ][index]));
    assert.equal(gradeAnswer(trace, answer), true, trace.id);
    assert.equal(concept.choices.find((item) => item.id === concept.answer)?.text, expectedChoices[index], concept.id);
  });

  const python = tracks.find((track) => track.id === 'python');
  for (const [day, expectedCode] of [
    [4, 'message = "이름: {name}"'],
  ]) {
    const locate = python.lessons[0].studyDays[day - 1].exercises.find((item) => item.type === 'locate-error');
    assert.ok(locate, `missing Python week one day ${day} locate question`);
    assert.ok(locate.codeLines.join('\n').includes(expectedCode), locate.id);
  }
});

test('Python weeks one through three connect each legacy check to the daily example and teach concrete rules', () => {
  const expected = {
    1: ['5', '34 str', '3.4 3 2\n-4 3', 'Mina: 40분', '28'],
    2: ['True', '입장 대기', 'B', 'False', 'Python'],
    3: ['9', '[2, 3, 4]\n[0, 1, 2]', '6', 'left: 0', '[0, 2, 4]'],
  };
  const lessons = [null, 'py-variables', 'py-conditions', 'py-loops'];
  for (const [weekText, answers] of Object.entries(expected)) {
    const week = Number(weekText);
    const lesson = getLesson(lessons[week]);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (const [index, day] of lesson.studyDays.entries()) {
      const number = index + 1;
      const id = `py-w${String(week).padStart(2, '0')}-d${number}`;
      assert.equal(day.exercises.length, 3, id);
      assert.ok(day.intro.length > 45, id);
      assert.ok(day.objective.length > 25, id);

      const concept = getExercise(`${id}-choice-v2`);
      const trace = getExercise(`${id}-trace-v2`);
      assert.ok(concept && trace, id);
      assert.ok(trace.prompt.endsWith(day.example), `${id} trace and example differ`);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(gradeAnswer(concept, concept.choices.find((item) => item.id !== concept.answer).id), false, concept.id);
      assert.equal(gradeAnswer(trace, answers[index]), true, trace.id);
      assert.ok(concept.explanation.length > 20, concept.id);
      assert.ok(Object.values(concept.choiceExplanations).every((item) => item.length > 20), concept.id);
    }
  }

  const baseAlignment = [
    ['py-variables-choice', /count.*1/s, 1],
    ['py-variables-type-choice', /"3" \+ "4"/, 2],
    ['py-variables-short', /17 \/\/ 5/, 3],
    ['py-conditions-choice', /18 이상이고 65 미만/, 1],
    ['py-conditions-locate', /else.*들여쓰기/, 2],
    ['py-conditions-short', /거짓 분기/, 3],
    ['py-loop-locate', /첫 원소/, 1],
    ['py-loops-range-choice', /range\(2, 5\)/, 2],
    ['py-loops-short', /\[1, 2, 3\]/, 3],
  ];
  const baseLessons = [null, 'py-variables', 'py-conditions', 'py-loops'];
  const weekForBaseId = new Map([
    ['py-variables-choice', 1], ['py-variables-type-choice', 1], ['py-variables-short', 1],
    ['py-conditions-choice', 2], ['py-conditions-locate', 2], ['py-conditions-short', 2],
    ['py-loop-locate', 3], ['py-loops-range-choice', 3], ['py-loops-short', 3],
  ]);
  for (const [exerciseId, pattern, day] of baseAlignment) {
    const lesson = getLesson(baseLessons[weekForBaseId.get(exerciseId)]);
    const legacyQuestion = getExercise(exerciseId);
    assert.match(legacyQuestion.prompt, pattern, exerciseId);
      assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === exerciseId || item.legacyIds?.includes(exerciseId)), exerciseId);
  }

  for (const [exerciseId, valid, invalid] of [
    ['py-w01-d5-repair-v2', 'def parse_integer(raw):\n    return int(raw)', 'def parse_integer(raw):\n    return raw'],
    ['py-w02-d5-repair', 'def has_title(title):\n    return bool(title and title.strip())', 'def has_title(title):\n    return True'],
    ['py-w03-d5-repair', 'def even_values(values):\n    return [value for value in values if value % 2 == 0]', 'def even_values(values):\n    return values'],
  ]) {
    const repair = getExercise(exerciseId);
    assert.match(repair.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
    assert.equal(gradeAnswer(repair, valid), true, `${exerciseId} valid answer`);
    assert.equal(gradeAnswer(repair, invalid), false, `${exerciseId} invalid answer`);
  }
  assert.equal(gradeAnswer(getExercise('py-w01-d5-repair-v2'), 'def parse_integer(raw):\n    value = int(raw)\n    return value'), true);
  assert.equal(gradeAnswer(getExercise('py-w02-d5-repair'), 'def has_title(title):\n    if title is None:\n        return False\n    return bool(title.strip())'), true);
  assert.equal(gradeAnswer(getExercise('py-w03-d5-repair'), 'def even_values(values):\n    result = []\n    for value in values:\n        if value % 2 == 0:\n            result.append(value)\n    return result'), true);
});

test('Python weeks four through six align function, list, and dictionary lessons with their examples', () => {
  const expectedAnswers = {
    4: ['115', '안녕하세요, 민아\n환영, 준', '저장 완료\nNone', '110.0 0.1', '80.0'],
    5: ['80.0\nNone', "d\n['b', 'c']", "['read', 'review', 'quiz', 'test']\n['read', 'review', 'quiz', 'test', 'ship']", '[1, 2, 3]\n[1, 2, 3]\nNone', "[['done']]"],
    6: ['92', '0', 'True 0\nFalse 0', 'mina 92\njun 85', 'True\nPython'],
  };
  const lessonIds = { 4: 'py-functions', 5: 'py-lists', 6: 'py-dictionaries' };

  for (const [weekText, answers] of Object.entries(expectedAnswers)) {
    const week = Number(weekText);
    const lesson = getLesson(lessonIds[week]);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (const [index, day] of lesson.studyDays.entries()) {
      const number = index + 1;
      const id = `py-w${String(week).padStart(2, '0')}-d${number}`;
      assert.equal(day.exercises.length, 3, id);
      assert.ok(day.intro.length > 45, id);
      assert.ok(day.objective.length > 25, id);
      assert.doesNotMatch(day.intro, /은\(는\)|의 역할을 코드 예시와 작은 수정 문제로 설명해요/, id);

      const concept = getExercise(`${id}-choice-v2`);
      const trace = getExercise(`${id}-trace-v2`);
      assert.ok(concept && trace, id);
      assert.ok(trace.prompt.endsWith(day.example), `${id} trace and example differ`);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
        assert.equal(gradeAnswer(concept, option.id), false, `${concept.id} wrong option`);
      }
      assert.equal(gradeAnswer(trace, answers[index]), true, trace.id);
      assert.ok(Object.values(concept.choiceExplanations).every((item) => item.length > 22), concept.id);
    }
  }

  const updatedTrace = getExercise('py-w05-d5-trace-v3');
  assert.equal(updatedTrace.id, 'py-w05-d5-trace-v4');
  assert.ok(updatedTrace.legacyIds.includes('py-w05-d5-trace-v2'));
  assert.ok(updatedTrace.legacyIds.includes('py-w05-d5-trace-v3'));

  const cpuTrace = getExercise('py-w11-d5-trace-v3');
  assert.equal(cpuTrace.id, 'py-w11-d5-trace-v4');
  assert.ok(cpuTrace.legacyIds.includes('py-w11-d5-trace-v2'));
  assert.ok(cpuTrace.legacyIds.includes('py-w11-d5-trace-v3'));

  const legacyDayAssignments = [
    ['py-function-repair', 'py-functions', 1],
    ['py-functions-parameter-choice', 'py-functions', 2],
    ['py-functions-short', 'py-functions', 3],
    ['py-average-short', 'py-lists', 1],
    ['py-lists-index-choice', 'py-lists', 2],
    ['py-lists-locate', 'py-lists', 3],
    ['py-dictionaries-choice', 'py-dictionaries', 1],
    ['py-dictionaries-locate', 'py-dictionaries', 2],
    ['py-dictionaries-short', 'py-dictionaries', 3],
  ];
  for (const [exerciseId, lessonId, day] of legacyDayAssignments) {
    const lesson = getLesson(lessonId);
    assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === exerciseId || item.legacyIds?.includes(exerciseId)), exerciseId);
  }

  const validRepairs = [
    ['py-w04-d5-repair-v2', 'def discounted(price, rate):\n    return price * (1 - rate)', 'def discounted(price, rate):\n    print(price * (1 - rate))'],
    ['py-w05-d5-repair-v3', 'def filter_minutes(minutes, minimum):\n    result = []\n    for value in minutes:\n        if value >= minimum:\n            result.append(value)\n    return result', 'def filter_minutes(minutes, minimum):\n    return minutes'],
    ['py-w06-d5-repair-v2', 'def nested_course_title(record):\n    course = record.get("course") or {}\n    return course.get("title", "제목 없음")', 'def nested_course_title(record):\n    return record["course"]["title"]'],
  ];
  for (const [exerciseId, valid, invalid] of validRepairs) {
    const repair = getExercise(exerciseId);
    assert.match(repair.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
    assert.equal(gradeAnswer(repair, valid), true, `${exerciseId} valid answer`);
    assert.equal(gradeAnswer(repair, invalid), false, `${exerciseId} invalid answer`);
    assert.ok(repair.acceptanceCriteria.examples.length > 0, exerciseId);
    assert.ok(repair.acceptanceCriteria.tests.length > 1, exerciseId);
  }
  assert.equal(gradeAnswer(getExercise('py-w05-d5-repair-v3'), 'def filter_minutes(minutes, minimum):\n    return [value for value in minutes if value >= minimum]'), true);
});

test('Python weeks seven through nine align modules, files, and iterators with distinct daily examples', () => {
  const expectedAnswers = {
    7: ['4\n3.0', '12 0', 'ValueError', '변환 시도 끝\n8', '7 0'],
    8: ['복습\nTrue', '복습', '한글 bytes', '30', '완료'],
    9: ['4\n7', '[0, 1, 4]\n[]', '시작\n계속', '[10, 12, 14]', '[0, 1, 4, 9]'],
  };
  const lessonIds = { 7: 'py-modules-errors', 8: 'py-files-context', 9: 'py-iterators-generators' };

  for (const [weekText, answers] of Object.entries(expectedAnswers)) {
    const week = Number(weekText);
    const lesson = getLesson(lessonIds[week]);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.ok(lesson.intro.length > 80, lesson.id);
    for (const [index, day] of lesson.studyDays.entries()) {
      const number = index + 1;
      const id = `py-w${String(week).padStart(2, '0')}-d${number}`;
      assert.equal(day.exercises.length, 3, id);
      assert.ok(day.intro.length > 45, id);
      assert.ok(day.objective.length > 25, id);
      assert.doesNotMatch(day.intro, /은\(는\)|의 역할을 코드 예시와 작은 수정 문제로 설명해요/, id);

      const concept = getExercise(`${id}-choice-v2`);
      const trace = getExercise(`${id}-trace-v2`);
      assert.ok(concept && trace, id);
      assert.ok(trace.prompt.endsWith(day.example), `${id} trace and example differ`);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
        assert.equal(gradeAnswer(concept, option.id), false, `${concept.id} wrong option`);
      }
      assert.equal(gradeAnswer(trace, answers[index]), true, trace.id);
      assert.ok(Object.values(concept.choiceExplanations).every((item) => item.length > 22), concept.id);
    }
  }

  const legacyDayAssignments = [
    ['py-modules-choice', 'py-modules-errors', 1],
    ['py-modules-errors-locate', 'py-modules-errors', 2],
    ['py-modules-errors-short', 'py-modules-errors', 3],
    ['py-files-context-choice', 'py-files-context', 1],
    ['py-files-context-locate', 'py-files-context', 2],
    ['py-files-context-short', 'py-files-context', 3],
    ['py-generators-choice', 'py-iterators-generators', 1],
    ['py-generators-locate', 'py-iterators-generators', 2],
    ['py-generators-short', 'py-iterators-generators', 3],
  ];
  for (const [exerciseId, lessonId, day] of legacyDayAssignments) {
    assert.ok(getLesson(lessonId).studyDays[day - 1].exercises.some((item) => item.id === exerciseId || item.legacyIds?.includes(exerciseId)), exerciseId);
  }

  const validRepairs = [
    ['py-w07-d5-repair-v2', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0', 'def parse_count(text):\n    try:\n        return int(text)\n    except:\n        return 0'],
    ['py-w08-d5-repair-v2', 'def save_text_atomically(path, text):\n    temporary_path = None\n    try:\n        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as temporary:\n            temporary_path = Path(temporary.name)\n            temporary.write(text)\n        os.replace(temporary_path, path)\n    except OSError:\n        if temporary_path is not None:\n            temporary_path.unlink(missing_ok=True)\n        raise', 'def save_text_atomically(path, text):\n    path.write_text(text, encoding="utf-8")'],
    ['py-w09-d5-repair-v2', 'def squares_until(limit):\n    for number in range(limit):\n        yield number * number', 'def squares_until(limit):\n    return [number * number for number in range(limit)]'],
  ];
  for (const [exerciseId, valid, invalid] of validRepairs) {
    const exercise = getExercise(exerciseId);
    assert.match(exercise.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
    assert.equal(gradeAnswer(exercise, valid), true, `${exerciseId} valid answer`);
    assert.equal(gradeAnswer(exercise, invalid), false, `${exerciseId} invalid answer`);
    assert.ok(exercise.acceptanceCriteria.examples.length > 0, exerciseId);
    assert.ok(exercise.acceptanceCriteria.tests.length > 1, exerciseId);
  }
  assert.equal(gradeAnswer(getExercise('py-w09-d5-repair-v2'), 'def squares_until(limit):\n    return (number * number for number in range(limit))'), true);
});

test('Python weeks ten through twelve connect classes, async work, and data summaries to each daily case', () => {
  const expectedTraces = {
    'py-w10-d1-trace-v2': '민아',
    'py-w10-d2-trace-v2': 'Python 함수 실전',
    'py-w10-d3-trace-v2': '3',
    'py-w10-d4-trace-v2': "Course(title='Python', hours=12)",
    'py-w10-d5-trace-v2': '09:00',
    'py-w11-d1-trace-v2': '5',
    'py-w11-d2-trace-v2': "익명\n''",
    'py-w11-d3-trace-v2': 'True',
    'py-w11-d4-trace-v2': '완료순: 준, 민아 / 결과순: 민아와 준',
    'py-w11-d5-trace-v2': '333332833333500000',
    'py-w12-d1-trace-v2': '[True, False, False]',
    'py-w12-d2-trace-v2': '1',
    'py-w12-d3-trace-v2': "['복습', '퀴즈', '읽기']",
    'py-w12-d4-trace-v2': '0 0\nNone',
  };
  const lessonIds = { 10: 'py-classes-types', 11: 'py-async-concurrency', 12: 'py-data-capstone' };
  for (const [week, lessonId] of Object.entries(lessonIds)) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lessonId);
    for (const [index, day] of lesson.studyDays.entries()) {
      const id = `py-w${String(week).padStart(2, '0')}-d${index + 1}`;
      assert.equal(day.exercises.length, 3, id);
      assert.ok(day.intro.length > 45, id);
      assert.ok(day.objective.length > 25, id);
      assert.doesNotMatch(day.intro, /은\(는\)|의 역할을 코드 예시와 작은 수정 문제로 설명해요/, id);
      for (const exercise of day.exercises.filter((item) => item.type === 'choice')) {
        assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
        for (const option of exercise.choices.filter((item) => item.id !== exercise.answer)) {
          assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} wrong option`);
        }
      }
      for (const exercise of day.exercises.filter((item) => item.type === 'short-answer' && item.legacyIds?.some((legacyId) => legacyId.endsWith('-trace-v2')))) {
        const legacyTraceId = exercise.legacyIds.find((legacyId) => legacyId.endsWith('-trace-v2'));
        assert.ok(expectedTraces[legacyTraceId], exercise.id);
        assert.ok(exercise.prompt.endsWith(day.example), `${exercise.id} example mismatch`);
        assert.equal(gradeAnswer(exercise, expectedTraces[legacyTraceId]), true, exercise.id);
      }
    }
  }

  const legacyAssignments = [
    ['py-classes-locate', 'py-classes-types', 1],
    ['py-classes-choice', 'py-classes-types', 3],
    ['py-classes-types-short', 'py-classes-types', 3],
    ['py-async-short', 'py-async-concurrency', 3],
    ['py-async-choice', 'py-async-concurrency', 4],
    ['py-async-locate', 'py-async-concurrency', 4],
    ['py-capstone-choice-v2', 'py-data-capstone', 2],
    ['py-capstone-locate', 'py-data-capstone', 5],
    ['py-capstone-short', 'py-data-capstone', 5],
  ];
  for (const [exerciseId, lessonId, day] of legacyAssignments) {
    assert.ok(getLesson(lessonId).studyDays[day - 1].exercises.some((item) => item.id === exerciseId || item.legacyIds?.includes(exerciseId)), exerciseId);
  }

  const completionRateError = getExercise('py-capstone-locate');
  assert.equal(completionRateError.title, '완료율 계산 오류 찾기');
  assert.match(completionRateError.prompt, /완료율/);
  assert.doesNotMatch(completionRateError.title, /평균/);

  const validRepairs = [
    ['py-w10-d5-repair-v2', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return self.clock.now()', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return "now"'],
    ['py-w11-d5-repair-v2', 'def submit_cpu(executor, calculate, limit):\n    return executor.submit(calculate, limit)', 'def submit_cpu(executor, calculate, limit):\n    return calculate(limit)'],
    ['py-w12-d5-repair-v2', 'def completion_rate(done, total):\n    if total == 0:\n        return 0\n    return done / total * 100', 'def completion_rate(done, total):\n    return total / done * 100'],
  ];
  for (const [exerciseId, valid, invalid] of validRepairs) {
    const exercise = getExercise(exerciseId);
    assert.equal(gradeAnswer(exercise, valid), true, `${exerciseId} valid answer`);
    assert.equal(gradeAnswer(exercise, invalid), false, `${exerciseId} invalid answer`);
    assert.ok(exercise.acceptanceCriteria.examples.length > 0, exerciseId);
    assert.ok(exercise.acceptanceCriteria.tests.length > 1, exerciseId);
  }
  const cpuTaskExample = getLesson('py-async-concurrency').studyDays[4].example;
  assert.match(cpuTaskExample, /if __name__ == "__main__"/);
  assert.match(cpuTaskExample, /ProcessPoolExecutor/);
  assert.match(cpuTaskExample, /def sum_squares\(limit\)/);
  assert.match(cpuTaskExample, /range\(limit\)/);
  assert.doesNotMatch(cpuTaskExample, /def square\(/);
});

test('Python weeks thirteen through fifteen align strings, serialization, and filesystem examples with deterministic contracts', () => {
  const expectedTraces = {
    'py-w13-d1-trace': "['python', 'java']",
    'py-w13-d2-trace': 'Hi, Mina',
    'py-w13-d3-trace': 'True',
    'py-w13-d4-trace': '3',
    'py-w13-d5-trace-v2': '17',
    'py-w14-d1-trace': '2026',
    'py-w14-d2-trace': 'True',
    'py-w14-d3-trace': '2026-01-02T00:00:00+00:00',
    'py-w14-d4-trace': 'True',
    'py-w14-d5-trace-v2': '{"at": "2026-01-02T00:00:00+00:00"}',
    'py-w15-d1-trace': 'data/notes.txt',
    'py-w15-d2-trace': 'False',
    'py-w15-d3-trace': 'ready',
    'py-w15-d4-trace': 'local',
    'py-w15-d5-trace': '10',
  };
  const lessonIds = { 13: 'py-week-13', 14: 'py-week-14', 15: 'py-week-15' };
  for (const [week, lessonId] of Object.entries(lessonIds)) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lessonId);
    for (const [index, day] of lesson.studyDays.entries()) {
      const id = `py-w${String(week).padStart(2, '0')}-d${index + 1}`;
      assert.equal(day.exercises.length, 3, id);
      assert.ok(day.objective.length > 20, id);
      assert.ok(day.example.length > 20, id);
      const concept = day.exercises.find((exercise) => exercise.type === 'choice');
      const trace = day.exercises.find((exercise) => exercise.id.includes('-trace'));
      assert.ok(concept && trace, id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
        assert.equal(gradeAnswer(concept, option.id), false, `${concept.id} wrong option`);
      }
      const expectedAnswer = [trace.id, ...(trace.legacyIds ?? [])]
        .map((id) => expectedTraces[id])
        .find((answer) => answer !== undefined);
      assert.notEqual(expectedAnswer, undefined, trace.id);
      assert.ok(trace.prompt.endsWith(day.example), `${trace.id} example mismatch`);
      assert.equal(gradeAnswer(trace, expectedAnswer), true, trace.id);
      if (index < 4) {
        const locate = day.exercises.find((exercise) => exercise.type === 'locate-error');
        assert.ok(locate, `${id} missing error-location exercise`);
        assert.ok(locate.answerLines.every((line) => line >= 1 && line <= locate.codeLines.length), locate.id);
        assert.match(locate.explanation, new RegExp(`${locate.answerLines[0]}번 줄`), locate.id);
      }
    }
  }

  const regexLocate = getExercise('py-w13-d3-locate');
  assert.match(regexLocate.codeLines[1], /"python"/);
  assert.match(regexLocate.explanation, /결과는 `None`/);
  const jsonExample = getLesson('py-week-14').studyDays[4].example;
  assert.match(jsonExample, /value\.isoformat\(\)/);
  assert.match(jsonExample, /json\.dumps/);
  const pathLesson = getLesson('py-week-15');
  assert.match(pathLesson.studyDays[0].example, /\.as_posix\(\)/);
  assert.match(pathLesson.studyDays[1].example, /TemporaryDirectory/);
  assert.match(pathLesson.studyDays[2].example, /TemporaryDirectory/);
  assert.match(pathLesson.studyDays[2].example, /logs\.mkdir\(exist_ok=True\)/);
  assert.match(getExercise('py-w15-d4-trace').prompt, /환경 변수가 설정되지 않았다고 가정/);

  const repairs = [
    ['py-w13-d5-repair-v2', 'def course_number(label):\n    return label.split("-")[-1]', 'def course_number(label):\n    return label'],
    ['py-w14-d5-repair-v2', 'def serialize_event(value):\n    return json.dumps({"at": value.isoformat()})', 'def serialize_event(value):\n    return json.dumps({"at": value})'],
    ['py-w15-d5-repair-v2', 'def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10', 'def read_limit(settings):\n    return int(settings["LIMIT"])'],
  ];
  for (const [exerciseId, valid, invalid] of repairs) {
    const exercise = getExercise(exerciseId);
    assert.ok(exercise, exerciseId);
    assert.equal(gradeAnswer(exercise, valid), true, `${exerciseId} valid answer`);
    assert.equal(gradeAnswer(exercise, invalid), false, `${exerciseId} invalid answer`);
    assert.ok(exercise.acceptanceCriteria.tests.length > 1, exerciseId);
  }
  assert.deepEqual(
    getExercise('py-w15-d5-repair-v2').acceptanceCriteria.tests.map((item) => item.expected),
    [0, 10, 10, 'ValueError가 전파됨'],
  );
});

test('Spring generated judgment questions mark the safe application rule as correct', () => {
  const questions = tracks.find((track) => track.id === 'spring').lessons
    .flatMap((lesson) => lesson.exercises)
    .filter((exercise) => exercise.id.startsWith('spring-w') && exercise.type === 'choice');

  assert.equal(questions.length, 130);
  for (const exercise of questions) {
    const answerText = exercise.choices.find((item) => item.id === exercise.answer)?.text;
    const week = Number(exercise.id.match(/spring-w(\d+)/)?.[1]);
    assert.doesNotMatch(answerText, /의 책임과 적용 범위를 API 계약·설정과 함께 확인한다$/, exercise.id);
    assert.match(answerText, /[가-힣]/, exercise.id);
    assert.match(exercise.explanation, /[가-힣]/, exercise.id);
    assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
  }
});

test('JavaScript capstone error-location question points to a real empty-array failure', () => {
  const exercise = getExercise('js-w26-d1-reduce-init-v3');
  assert.deepEqual(exercise.answerLines, [5]);
  assert.match(exercise.codeLines[1], /\.reduce\(/);
  assert.match(exercise.explanation, /초기 객체를 전달하지 않습니다.*빈 배열이면 TypeError/);
});

test('practice includes concept checks, short answers, debugging, repairs, and executable JavaScript', () => {
  const types = new Set(exercises.map((exercise) => exercise.type));
  for (const type of ['choice', 'short-answer', 'locate-error', 'repair-code', 'coding']) {
    assert.ok(types.has(type), 'missing exercise type ' + type);
  }
});

test('choice questions explain each option and vary the correct option position', () => {
  const choiceExercises = exercises.filter((exercise) => exercise.type === 'choice');
  const answerPositions = new Set();
  assert.ok(choiceExercises.length >= 50);
  for (const exercise of choiceExercises) {
    const choiceIds = exercise.choices.map((choice) => choice.id);
    assert.ok(choiceIds.length >= 2 && choiceIds.length <= 4, exercise.id);
    assert.equal(new Set(choiceIds).size, choiceIds.length, exercise.id);
    const normalizedChoiceText = exercise.choices.map((choice) => choice.text.trim().replace(/\s+/g, ' '));
    assert.equal(new Set(normalizedChoiceText).size, choiceIds.length, `${exercise.id} has duplicate choice text`);
    assert.ok(choiceIds.includes(exercise.answer), exercise.id);
    assert.deepEqual(Object.keys(exercise.choiceExplanations).sort(), [...choiceIds].sort(), exercise.id);
    assert.ok(Object.values(exercise.choiceExplanations).every((why) => why.length > 10), exercise.id);
    assert.equal(new Set(Object.values(exercise.choiceExplanations)).size, choiceIds.length, exercise.id);
    answerPositions.add(exercise.choices.findIndex((choice) => choice.id === exercise.answer));
    assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
    assert.equal(gradeAnswer(exercise, exercise.choices.find((choice) => choice.id !== exercise.answer).id), false, exercise.id);
  }
  assert.ok(answerPositions.size > 1);
  for (const track of tracks) {
    const groups = new Map();
    for (const exercise of track.lessons.flatMap((lesson) => lesson.exercises).filter((item) => item.type === 'choice')) {
      const positions = groups.get(exercise.choices.length) ?? Array(exercise.choices.length).fill(0);
      positions[exercise.choices.findIndex((choice) => choice.id === exercise.answer)] += 1;
      groups.set(exercise.choices.length, positions);
    }
    for (const counts of groups.values()) {
      assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${track.id}: ${counts.join('/')}`);
    }
  }
});

test('choice position balancing preserves existing option IDs and answer meanings', () => {
  const exercise = getExercise('java-variables-choice');
  assert.equal(exercise.answer, 'b');
  assert.equal(exercise.choices.find((choice) => choice.id === 'b').text, 'int count = 42;');
  assert.equal(exercise.choiceExplanations.b, '`int`는 정수를 담는 기본 자료형이에요.');
});

test('all question prompts, hints, explanations, and answer keys are usable', () => {
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, exercises.length, 'question prompts must be unique');
  for (const exercise of exercises) {
    assert.ok(exercise.title.length > 2, exercise.id);
    assert.ok(exercise.prompt.length > 20, exercise.id);
    assert.ok(exercise.hint.length > 10, exercise.id);
    assert.ok(exercise.explanation.length > 20, exercise.id);
    if (exercise.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
      assert.ok(exercise.acceptedAnswers.every((answer) => answer.trim().length > 0), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
      assert.equal(gradeAnswer(exercise, ''), false, exercise.id);
    }
    if (exercise.type === 'locate-error') {
      assert.ok(exercise.codeLines.length >= 2, exercise.id);
      assert.ok(exercise.answerLines.length > 0, exercise.id);
      assert.equal(new Set(exercise.answerLines).size, exercise.answerLines.length, exercise.id);
      assert.ok(exercise.answerLines.every((line) => Number.isInteger(line) && line > 0 && line <= exercise.codeLines.length), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
    }
    if (exercise.type === 'repair-code') {
      assert.ok(exercise.starterCode.length > 0, exercise.id);
      assert.ok(exercise.solutionPatterns?.length > 0, exercise.id);
      for (const pattern of exercise.solutionPatterns) assert.doesNotThrow(() => new RegExp(pattern), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
    }
  }
});

test('JavaScript coding exercises have bounded example cases and an explicit entry point', () => {
  const codingExercises = exercises.filter((exercise) => exercise.type === 'coding');
  assert.ok(codingExercises.length > 0);
  for (const exercise of codingExercises) {
    assert.match(exercise.entryPoint, /^[A-Za-z_$][\w$]*$/);
    assert.ok(exercise.tests.length >= 3, exercise.id);
    for (const testCase of exercise.tests) {
      assert.ok(Array.isArray(testCase.input), exercise.id);
      assert.ok(Object.hasOwn(testCase, 'expected'), exercise.id);
    }
  }
});

test('every track records official version sources and each lesson links to one topic', () => {
  const topicIds = new Set();
  const linkedLessonIds = new Set();
  for (const track of tracks) {
    assert.ok(track.objective.length > 10, track.id);
    assert.ok(track.prerequisites.length > 0, track.id);
    assert.ok(track.prerequisites.every((item) => item.length > 4), track.id);
    assert.equal(track.contentReview.status, '기술 버전·출처 확인 완료', track.id);
    assert.match(track.contentReview.reviewedAt, /^\d{4}-\d{2}-\d{2}$/, track.id);
    assert.ok(track.contentReview.versionContext.length > 5, track.id);
    assert.ok(track.contentReview.sources.length > 0, track.id);
    for (const source of track.contentReview.sources) {
      assert.ok(source.label.length > 3, track.id);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
    for (const topic of track.topics) {
      assert.ok(!topicIds.has(topic.id), 'duplicate topic ' + topic.id);
      topicIds.add(topic.id);
      assert.ok(topic.objective.length > 10, topic.id);
      assert.ok(topic.lessonIds.length > 0, topic.id);
      for (const lessonId of topic.lessonIds) {
        const lesson = track.lessons.find((item) => item.id === lessonId);
        assert.ok(lesson, 'missing lesson ' + lessonId);
        assert.equal(lesson.topicId, topic.id, lessonId);
        assert.ok(!linkedLessonIds.has(lessonId), 'lesson linked more than once: ' + lessonId);
        linkedLessonIds.add(lessonId);
      }
    }
  }
  const springSourceUrls = new Set(tracks.find((track) => track.id === 'spring').contentReview.sources.map((source) => source.url));
  for (const url of [
    'https://docs.spring.io/spring-boot/reference/features/logging.html',
    'https://docs.spring.io/spring-boot/reference/actuator/observability.html',
    'https://docs.spring.io/spring-boot/reference/io/rest-client.html',
    'https://docs.spring.io/spring-boot/api/java/org/springframework/boot/restclient/autoconfigure/RestClientAutoConfiguration.html',
    'https://docs.spring.io/spring-framework/reference/integration/cache.html',
  ]) assert.ok(springSourceUrls.has(url), url);
  assert.deepEqual([...linkedLessonIds].sort(), lessons.map((lesson) => lesson.id).sort());
});

test('version records identify their official technical sources', () => {
  const officialHosts = {
    javascript: ['262.ecma-international.org', 'ecma-international.org', 'tc39.es', 'html.spec.whatwg.org', 'dom.spec.whatwg.org', 'fetch.spec.whatwg.org', 'react.dev', 'www.nist.gov', 'nodejs.org', 'www.w3.org', 'cheatsheetseries.owasp.org'],
    python: ['docs.python.org', 'www.python.org', 'devguide.python.org', 'www.rfc-editor.org'],
    java: ['docs.oracle.com', 'www.oracle.com', 'www.rfc-editor.org', 'docs.junit.org', 'git-scm.com'],
    fastapi: ['fastapi.tiangolo.com', 'github.com', 'pyodide.org', 'asgi.readthedocs.io', 'docs.python.org'],
    spring: ['docs.spring.io', 'docs.micrometer.io', 'docs.hibernate.org', 'docs.docker.com', 'java.testcontainers.org', 'www.rfc-editor.org', 'github.com'],
    react: ['react.dev'],
    nextjs: ['nextjs.org', 'www.npmjs.com', 'react.dev', 'www.rfc-editor.org', 'cheatsheetseries.owasp.org', 'www.postgresql.org', 'www.w3.org', 'developer.mozilla.org', 'testing-library.com', 'nodejs.org', 'playwright.dev', 'github.com'],
    kotlin: ['kotlinlang.org', 'developer.android.com'],
    csharp: ['learn.microsoft.com', 'dotnet.microsoft.com', 'devblogs.microsoft.com', 'github.com', 'www.rfc-editor.org'],
    typescript: ['www.typescriptlang.org', 'devblogs.microsoft.com', 'www.w3.org', 'docs.npmjs.com', 'tc39.es'],
    postgresql: ['www.postgresql.org', 'pglite.dev', 'www.npmjs.com', 'www.ibm.com'],
    ai: ['developers.google.com', 'ai.google.dev', 'arxiv.org', 'huggingface.co', 'developers.openai.com', 'doi.org', 'genai.owasp.org'],
  };
  const expectedVersions = {
    javascript: 'ECMAScript 2026',
    python: 'Python 3.15.1',
    java: 'Java SE 25 LTS',
    fastapi: 'FastAPI 문서 0.162.0 · Python 3.10+ (브라우저 실행기 FastAPI 0.143.0 · Python 3.14.2)',
    spring: 'Spring Boot 4.1.2',
    react: 'React 19.3',
    nextjs: 'Next.js 16.4.3 · 코드 읽기 과정',
    kotlin: 'Kotlin 2.4.21 · Android 17 (API 37) · 개념 학습',
    csharp: 'C# 14 · .NET 10.0.14 LTS · EF Core 10 LTS · 개념 학습',
    typescript: 'TypeScript 7.0.2 안정판 · 7.1 Beta 시험판',
    postgresql: 'PostgreSQL 18.6 (실행기 18.3)',
    ai: '',
  };
  const expectedReviewDates = {
    javascript: '2026-10-24',
    python: '2026-10-23',
    java: '2026-11-02',
    fastapi: '2026-11-02',
    spring: '2026-11-02',
    react: '2026-10-16',
    nextjs: '2026-11-02',
    kotlin: '2026-11-02',
    csharp: '2026-11-02',
    typescript: '2026-10-23',
    postgresql: '2026-11-02',
    ai: '2026-10-28',
  };
  for (const track of tracks) {
    assert.equal(track.contentReview.version, expectedVersions[track.id], track.id);
    assert.equal(track.contentReview.reviewedAt, expectedReviewDates[track.id] ?? '2026-10-13', track.id);
    for (const source of track.contentReview.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:', source.url);
      assert.ok(officialHosts[track.id].includes(url.hostname), source.url);
    }
  }
  const pythonSources = tracks.find((track) => track.id === 'python').contentReview.sources.map((source) => source.url);
  assert.ok(pythonSources.includes('https://docs.python.org/3.14/'));
  assert.ok(pythonSources.includes('https://www.python.org/downloads/release/python-3148/'));
  assert.ok(pythonSources.includes('https://www.python.org/downloads/release/python-3151/'));
  assert.ok(pythonSources.includes('https://docs.python.org/3.15/tutorial/introduction.html'));
  assert.ok(pythonSources.includes('https://docs.python.org/3.15/tutorial/controlflow.html'));
  const javascriptSources = tracks.find((track) => track.id === 'javascript').contentReview.sources.map((source) => source.url);
  assert.ok(javascriptSources.includes('https://tc39.es/ecma262/2026/multipage/abstract-operations.html#sec-stringtonumber'));
  assert.ok(javascriptSources.includes('https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html#sec-number.isinteger'));
  for (const source of [
    'https://tc39.es/ecma262/2026/multipage/global-object.html#sec-encodeuricomponent-uricomponent',
    'https://html.spec.whatwg.org/multipage/interaction.html#focus',
    'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
    'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html',
    'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html',
  ]) assert.ok(javascriptSources.includes(source), source);
  const javaSources = tracks.find((track) => track.id === 'java').contentReview.sources.map((source) => source.url);
  for (const source of [
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.html#nanoTime()',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Path.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Files.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/package-summary.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/ZonedDateTime.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Integer.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html',
    'https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.10',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/AutoCloseable.html',
  ]) assert.ok(javaSources.includes(source), source);
  const springSources = tracks.find((track) => track.id === 'spring').contentReview.sources.map((source) => source.url);
  assert.ok(springSources.includes('https://docs.spring.io/spring-boot/reference/features/external-config.html'));
  assert.ok(springSources.includes('https://github.com/spring-projects/spring-boot/releases/tag/v4.1.2'));
  assert.ok(springSources.includes('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html'));
  assert.ok(springSources.includes('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responseentity.html'));
  assert.ok(springSources.includes('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html'));
  assert.ok(springSources.includes('https://docs.spring.io/spring-boot/reference/actuator/tracing.html'));
  assert.ok(springSources.includes('https://docs.micrometer.io/tracing/reference/api.html'));
  for (const source of [
    'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html',
    'https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html',
    'https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/bean-overriding.html',
    'https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html',
    'https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html',
    'https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html',
    'https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html',
    'https://docs.hibernate.org/orm/7.4/querylanguage/html_single/',
    'https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html',
    'https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/stat/Statistics.html',
    'https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/loader/MultipleBagFetchException.html',
  ]) assert.ok(springSources.includes(source), source);
  for (const source of [
    'https://docs.python.org/3.15/builtins/stdtypes.html',
    'https://docs.python.org/3.15/library/re.html',
    'https://docs.python.org/3.15/library/datetime.html',
    'https://docs.python.org/3.15/library/json.html',
    'https://docs.python.org/3.15/library/pathlib.html',
    'https://docs.python.org/3.15/library/os.html#os.getenv',
    'https://docs.python.org/3.15/library/tempfile.html',
    'https://docs.python.org/3.15/library/dataclasses.html',
    'https://docs.python.org/3.15/library/unittest.html',
    'https://docs.python.org/3.15/library/logging.html',
    'https://docs.python.org/3.15/library/traceback.html',
    'https://docs.python.org/3.15/tutorial/errors.html',
    'https://docs.python.org/3.15/library/timeit.html',
    'https://docs.python.org/3.15/library/asyncio-task.html',
    'https://docs.python.org/3.15/library/concurrent.futures.html',
    'https://docs.python.org/3.15/library/threading.html',
    'https://docs.python.org/3.15/library/urllib.request.html',
    'https://docs.python.org/3.15/library/argparse.html',
    'https://docs.python.org/3.15/library/sys.html',
    'https://docs.python.org/3.15/library/contextlib.html',
    'https://docs.python.org/3.15/library/os.html#os.replace',
    'https://docs.python.org/3.15/library/stdtypes.html#dict',
    'https://docs.python.org/3.15/whatsnew/3.15.html',
    'https://www.rfc-editor.org/rfc/rfc9110.html',
  ]) assert.ok(pythonSources.includes(source), source);
  assert.ok(pythonSources.includes('https://devguide.python.org/versions/'));
  assert.match(tracks.find((track) => track.id === 'python').contentReview.versionContext, /3\.15\.1.*최신 안정판/);
  assert.match(tracks.find((track) => track.id === 'python').contentReview.versionContext, /Python 3\.12\.10.*실행/);
  assert.match(tracks.find((track) => track.id === 'python').contentReview.versionContext, /Python 3\.15\.1 런타임으로 실행해 확인하지는 않았어요/);
  const sourceUrls = Object.fromEntries(tracks.map((track) => [track.id, track.contentReview.sources.map((source) => source.url)]));
  for (const source of [
    'https://kotlinlang.org/docs/numbers.html',
    'https://kotlinlang.org/docs/strings.html',
    'https://kotlinlang.org/docs/characters.html',
    'https://kotlinlang.org/docs/properties.html',
    'https://kotlinlang.org/docs/control-flow.html',
    'https://kotlinlang.org/docs/ranges.html',
    'https://kotlinlang.org/docs/functions.html',
    'https://kotlinlang.org/docs/multiplatform/supported-platforms.html',
    'https://developer.android.com/guide/components/activities/activity-lifecycle',
  ]) assert.ok(sourceUrls.kotlin.includes(source), source);
  assert.ok(sourceUrls.javascript.includes('https://ecma-international.org/publications-and-standards/standards/ecma-262/'));
  for (const source of [
    'https://tc39.es/ecma262/2026/multipage/text-processing.html#sec-string.prototype.normalize',
    'https://tc39.es/ecma262/2026/multipage/text-processing.html#sec-string.prototype.tolowercase',
    'https://tc39.es/ecma262/2026/multipage/keyed-collections.html',
    'https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html#sec-generator-objects',
    'https://tc39.es/ecma262/2026/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions',
    'https://tc39.es/ecma262/2026/multipage/ecmascript-language-expressions.html#sec-super-keyword',
    'https://tc39.es/ecma262/2026/multipage/fundamental-objects.html#sec-object.hasown',
    'https://tc39.es/ecma262/2026/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements',
    'https://nodejs.org/download/release/latest-v18.x/docs/api/test.html',
    'https://www.w3.org/TR/hr-time-3/#dom-performance-now',
    'https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html#sec-date-time-string-format',
    'https://tc39.es/ecma402/2026/#sec-datetimeformat-objects',
  ]) assert.ok(sourceUrls.javascript.includes(source), source);
  assert.ok(sourceUrls.javascript.includes('https://html.spec.whatwg.org/multipage/webstorage.html'));
  assert.ok(sourceUrls.javascript.includes('https://react.dev/reference/react/useEffect'));
  assert.ok(sourceUrls.java.includes('https://www.oracle.com/java/technologies/java-se-support-roadmap.html'));
  for (const source of [
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/net/URI.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpRequest.Builder.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpResponse.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html',
    'https://www.rfc-editor.org/rfc/rfc9110.html#name-successful-2xx',
    'https://docs.junit.org/current/user-guide/',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.logging/java/util/logging/Logger.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.logging/java/util/logging/LogRecord.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/Duration.html',
    'https://git-scm.com/docs/git-add',
    'https://git-scm.com/docs/git-diff',
    'https://git-scm.com/docs/git-commit',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Collections.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Comparator.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Math.html',
    'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StackOverflowError.html',
  ]) assert.ok(sourceUrls.java.includes(source), source);
  assert.ok(sourceUrls.spring.includes('https://docs.spring.io/spring-boot/system-requirements.html'));
  for (const source of [
    'https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html',
    'https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html',
    'https://docs.spring.io/spring-boot/reference/testing/testcontainers.html',
    'https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html',
    'https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html',
    'https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html',
    'https://github.com/spring-projects/spring-security/releases/tag/7.1.2',
    'https://docs.spring.io/spring-boot/reference/web/spring-security.html',
    'https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/TransactionDefinition.html',
    'https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html',
    'https://docs.spring.io/spring-framework/reference/integration/scheduling.html',
    'https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html',
    'https://docs.spring.io/spring-boot/reference/actuator/endpoints.html',
    'https://docs.spring.io/spring-boot/reference/actuator/monitoring.html',
    'https://docs.spring.io/spring-security/reference/servlet/integrations/concurrency.html',
    'https://docs.docker.com/reference/dockerfile',
    'https://docs.docker.com/build/building/best-practices/',
    'https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html',
    'https://www.rfc-editor.org/rfc/rfc9110.html',
  ]) assert.ok(sourceUrls.spring.includes(source), source);
  assert.ok(sourceUrls.react.includes('https://react.dev/blog/2026/09/09/react-19-3'));
});

test('array and list boundary-error exercises match their example and correction', () => {
  const checks = [
    ['js-loops', 'js-loop-locate', /const numbers = \[2, 3, 4\]/, 'numbers.length', '<='],
    ['py-loops', 'py-loop-locate', /values = \[2, 3, 4\]/, 'values[1:]', 'values[1:]'],
    ['java-loops', 'java-loop-locate', /int\[\] values = \{2, 3, 4\}/, 'values.length', '<='],
  ];
  for (const [lessonId, exerciseId, initializedData, faultyCondition, faultyOperator] of checks) {
    const lesson = getLesson(lessonId);
    const exercise = getExercise(exerciseId);
    assert.ok(lesson && exercise);
    assert.match(lesson.example, initializedData, lessonId);
    const faultyLine = exercise.codeLines[exercise.answerLines[0] - 1];
    assert.ok(faultyLine.includes(faultyCondition), exerciseId);
    assert.ok(faultyLine.includes(faultyOperator), exerciseId);
    assert.ok(exercise.explanation.includes(exercise.answerLines[0] + '번 줄'), exerciseId);
  }
});

test('React state repair preserves old fields and changes only the requested field', () => {
  const exercise = getExercise('react-state-repair');
  assert.ok(exercise);
  assert.equal(gradeAnswer(exercise, 'function rename(nextName) { setProfile({ ...profile, name: nextName }); }'), true);
  assert.equal(gradeAnswer(exercise, 'function rename(nextName) { setProfile({...profile,name:nextName}); }'), true);
  assert.equal(gradeAnswer(exercise, 'setProfile({ ...profile });'), false);
  assert.equal(gradeAnswer(exercise, 'profile.name = nextName; setProfile(profile);'), false);
});

test('repair questions state reviewable criteria and accept equivalent formatting', () => {
  const repairs = exercises.filter((exercise) => exercise.type === 'repair-code');
  const accepted = new Map([
    ['js-function-repair', 'function double(value) {\n  return value*2;\n}'],
    ['py-function-repair', 'def double(value):\n  return value*2'],
    ['java-method-repair', 'static int add(int left, int right) { return right+left; }'],
    ['react-state-repair', 'function rename(nextName) { setProfile({...profile,name:nextName}); }'],
  ]);
  const rejected = new Map([
    ['js-function-repair', 'function double(value) {\n  value*2;\n}'],
    ['py-function-repair', 'def double(value):\n  value*2'],
    ['java-method-repair', 'static int add(int left, int right) { return left-right; }'],
    ['react-state-repair', 'profile.name=nextName; setProfile(profile);'],
  ]);
  assert.ok(repairs.length >= tracks.filter((track) => !['nextjs', 'kotlin', 'csharp', 'ai'].includes(track.id)).length * 26, 'each code-repair course should include repair practice throughout the course');
  for (const exercise of repairs) {
    const lesson = lessons.find((item) => item.exercises.some((question) => question.id === exercise.id));
    const track = tracks.find((item) => item.id === lesson.trackId);
    assert.equal(exercise.language, track.title, exercise.id);
    assert.ok(exercise.acceptanceCriteria.requirements.length > 0, exercise.id);
    assert.ok(exercise.acceptanceCriteria.constraints.length > 0, exercise.id);
    assert.ok(exercise.acceptanceCriteria.examples.every((item) => item.input && item.output), exercise.id);
    assert.ok(exercise.acceptanceCriteria.tests.every((item) => item.input && Object.hasOwn(item, 'expected')), exercise.id);
    assert.ok(exercise.gradingNote.length > 15, exercise.id);
    assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
    if (accepted.has(exercise.id)) {
      assert.equal(exercise.language, track.title, exercise.id);
      assert.equal(gradeAnswer(exercise, accepted.get(exercise.id)), true, exercise.id);
      assert.equal(gradeAnswer(exercise, rejected.get(exercise.id)), false, exercise.id);
    }
  }
  assert.equal(gradeAnswer(getExercise('js-function-repair'), 'function double(value) { return value*2 }'), true);
});

test('teaching examples and distractor explanations match their stated conditions', () => {
  assert.match(getLesson('py-conditions').example, /age >= 18 and age < 65/);
  assert.match(getExercise('py-conditions-choice').prompt, /18 이상이고 65 미만/);
  const reactClick = getExercise('react-events-state-choice');
  assert.match(reactClick.choiceExplanations.a, /클릭을 기다리지 않아요/);
  assert.match(reactClick.choiceExplanations.a, /클릭 시 실행할 함수/);
});

test('Java answer keys accept only valid syntax and common formatting', () => {
  const mapRead = getExercise('java-map-short');
  assert.equal(gradeAnswer(mapRead, 'minutesByCourse.get("Java")'), true);
  assert.equal(gradeAnswer(mapRead, "minutesByCourse.get('Java')"), false);
  assert.equal(gradeAnswer(getExercise('java-conditions-short'), 'score>=60'), true);
  assert.equal(gradeAnswer(getExercise('java-function-short-v2'), '4'), true);
});

test('Spring and React framework examples match the failure they teach', () => {
  const springTransaction = getExercise('spring-w07-d4-locate');
  assert.deepEqual(springTransaction.answerLines, [4]);
  assert.match(springTransaction.codeLines[3], /this\.enroll/);
  assert.match(springTransaction.explanation, /별도 Spring Bean으로 분리/);

  const springTimeout = getLesson('spring-timeout-cache-resilience').example;
  assert.match(springTimeout, /HttpRequest\.newBuilder/);
  assert.match(springTimeout, /\.timeout\(Duration\.ofSeconds\(2\)\)/);
  assert.doesNotMatch(springTimeout, /ClientOptions|responseTimeout/);
  assert.doesNotMatch(getLesson('spring-observability-performance').example, /\bkv\(/);
  const springMetricTag = getExercise('spring-observe-locate-v2');
  assert.deepEqual(springMetricTag.answerLines, [2]);
  assert.match(springMetricTag.codeLines[1], /\.tag\("courseId"/);
  assert.match(springMetricTag.explanation, /시계열.*늘/);
  const springTestSlice = getExercise('spring-test-locate-v2');
  assert.deepEqual(springTestSlice.answerLines, [4]);
  assert.match(springTestSlice.codeLines[3], /@Autowired CourseService/);
  assert.match(springTestSlice.explanation, /@MockitoBean/);

  const reactAsync = getLesson('react-async-data').example;
  assert.match(reactAsync, /signal: controller\.signal/);
  assert.match(reactAsync, /\.then\(setCourses\)/);
  assert.match(reactAsync, /error\.name !== "AbortError"/);
  assert.match(reactAsync, /return \(\) => controller\.abort\(\)/);
});
