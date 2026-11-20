import assert from 'node:assert/strict';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { codingProblems } from '../src/coding-problems.js';
import { exerciseTypes, findLessonForExercise, getExercise, getLesson, getTopic, getTrack, lessons, tracks } from '../src/content.js';
import { foundationsTrack, foundationsWeeks } from '../src/foundations.js';
import { gradeAnswer } from '../src/grading.js';

test('common foundations publishes twenty-six reviewed weeks with fifteen ordered exercises each', () => {
  assert.equal(foundationsTrack.course.weeks, 26);
  assert.equal(foundationsTrack.course.sessions, 130);
  assert.equal(foundationsTrack.course.questions, 390);
  assert.deepEqual(foundationsTrack.course.reviewedWeeks, Array.from({ length: 26 }, (_, index) => index + 1));
  assert.equal(foundationsWeeks.length, 26);
  assert.equal(foundationsTrack.lessons.length, 26);

  assert.deepEqual(foundationsWeeks.map((week) => week.week), Array.from({ length: 26 }, (_, index) => index + 1));

  const existingIds = new Set([
    ...lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id)),
    ...codingProblems.map((problem) => problem.id),
  ]);
  for (const week of foundationsWeeks) {
    assert.equal(week.contentReviewStatus, '문항 검수 완료');
    assert.ok(week.objective.length > 20);
    assert.ok(week.intro.length > 40);
    assert.equal(week.prerequisiteLessonIds[0], week.week === 1 ? undefined : `foundation-w${String(week.week - 1).padStart(2, '0')}`);
    assert.equal(week.studyDays.length, 5);
    assert.equal(week.exercises.length, 15);
    assert.deepEqual(week.studyDays.map((day) => day.number), [1, 2, 3, 4, 5]);
    assert.ok(week.studyDays.every((day) => day.exercises.length === 3));
    assert.ok(week.studyDays.every((day) => day.objective.length > 15 && day.intro.length > 30 && day.example.length > 10));
    assert.ok(week.studyDays.every((day) => day.activities.length === 3 && day.activities.every((item) => item.title.length > 3 && item.prompt.length > 10)));
    assert.equal(new Set(week.exercises.map((exercise) => exercise.id)).size, 15);
    assert.equal(new Set(week.studyDays.flatMap((day) => day.exercises.map((exercise) => exercise.title))).size, 15);
    for (const exercise of week.exercises) {
      assert.equal(existingIds.has(exercise.id), false, `${exercise.id} must not collide with an existing exercise`);
      existingIds.add(exercise.id);
      assert.ok(exerciseTypes.has(exercise.type), `${exercise.id} has a supported question type`);
      assert.ok(exercise.prompt.length > 20, `${exercise.id} states a clear task`);
      assert.ok(exercise.hint.length > 10, `${exercise.id} has a useful hint`);
      assert.ok(exercise.explanation.length > 20, `${exercise.id} explains the answer`);

      if (exercise.type === 'choice') {
        assert.ok(exercise.choices.length >= 3);
        assert.equal(new Set(exercise.choices.map((choice) => choice.id)).size, exercise.choices.length);
        assert.ok(exercise.choices.some((choice) => choice.id === exercise.answer));
        assert.deepEqual(Object.keys(exercise.choiceExplanations).sort(), exercise.choices.map((choice) => choice.id).sort());
        assert.equal(gradeAnswer(exercise, exercise.answer), true);
        assert.equal(gradeAnswer(exercise, '__wrong__'), false);
      } else if (exercise.type === 'short-answer') {
        assert.ok(exercise.acceptedAnswers.length >= 1);
        for (const answer of exercise.acceptedAnswers) assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
        assert.equal(gradeAnswer(exercise, '이 답은 맞지 않아요'), false);
      } else if (exercise.type === 'locate-error') {
        assert.ok(exercise.codeLines.length >= 3);
        assert.ok(exercise.answerLines.length > 0);
        assert.ok(exercise.answerLines.every((line) => line >= 1 && line <= exercise.codeLines.length));
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true);
        const wrongLine = Array.from({ length: exercise.codeLines.length }, (_, index) => index + 1)
          .find((line) => !exercise.answerLines.includes(line));
        assert.equal(gradeAnswer(exercise, [wrongLine]), false);
      }

      assert.equal(getExercise(exercise.id)?.id, exercise.id);
      assert.equal(findLessonForExercise(exercise.id)?.id, week.id);
    }
  }
  const answerPositions = foundationsWeeks.flatMap((week) => week.exercises
    .filter((exercise) => exercise.type === 'choice')
    .map((exercise) => exercise.choices.findIndex((option) => option.id === exercise.answer)));
  assert.ok([0, 1, 2].every((position) => answerPositions.filter((item) => item === position).length >= 10));
});

test('foundation week 1 distinguishes POSIX and Windows absolute path roots', () => {
  const weekOne = foundationsWeeks[0];
  const absolutePathQuestion = weekOne.exercises.find((exercise) => exercise.id === 'foundation-w01-d01-q01');

  assert.match(weekOne.studyDays[0].intro, /POSIX/);
  assert.ok(weekOne.studyDays[0].intro.includes('C:\\workspace\\app'));
  assert.match(absolutePathQuestion.prompt, /파일 시스템의 루트/);
  assert.doesNotMatch(absolutePathQuestion.prompt, /시스템의 시작 위치/);
  assert.match(absolutePathQuestion.choiceExplanations.b, /POSIX.*루트/);
  assert.match(absolutePathQuestion.explanation, /Windows.*드라이브 루트/);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url.includes('about_path_syntax?view=powershell-7.6')), true);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url.includes('9799919799/basedefs/V1_chap03.html')), true);
});

test('foundation week 1 grades the portable parent-directory command for Bash and PowerShell', () => {
  const parentDirectoryQuestion = foundationsWeeks[0].exercises.find((exercise) => exercise.id === 'foundation-w01-d04-q02');

  assert.match(parentDirectoryQuestion.prompt, /Bash와 PowerShell에서 모두/);
  assert.deepEqual(parentDirectoryQuestion.acceptedAnswers, ['cd ..']);
  assert.equal(gradeAnswer(parentDirectoryQuestion, 'cd ..'), true);
  assert.equal(gradeAnswer(parentDirectoryQuestion, 'cd..'), false);
});

test('foundation week 4 distinguishes a post-restore status check from diff output', () => {
  const restoreQuestion = foundationsWeeks[3].exercises.find((exercise) => exercise.id === 'foundation-w04-d05-q03');

  assert.equal(restoreQuestion.answerLines.length, 1);
  assert.deepEqual(restoreQuestion.answerLines, [4]);
  assert.match(restoreQuestion.codeLines[0], /복원 전/);
  assert.match(restoreQuestion.codeLines[2], /git diff/);
  assert.match(restoreQuestion.codeLines[3], /복원 후 git status는 확인하지 않음/);
  assert.match(restoreQuestion.explanation, /diff.*staging 상태/);
});

test('foundation week 5 only accepts commands that report both branch and worktree state', () => {
  const branchStatusQuestion = foundationsWeeks[4].exercises.find((exercise) => exercise.id === 'foundation-w05-d04-q02');

  assert.deepEqual(branchStatusQuestion.acceptedAnswers, ['git status --short --branch', 'git status --branch']);
  assert.ok(branchStatusQuestion.acceptedAnswers.every((answer) => gradeAnswer(branchStatusQuestion, answer)));
  assert.equal(gradeAnswer(branchStatusQuestion, 'git branch --show-current'), false);
  assert.match(branchStatusQuestion.explanation, /브랜치 이름만 출력/);
});

test('foundation week 7 presents a complete conflict block and grades every marker', () => {
  const lesson = foundationsWeeks[6];
  const markerQuestion = lesson.exercises.find((exercise) => exercise.id === 'foundation-w07-d01-q03');
  const defaultLabelQuestion = lesson.exercises.find((exercise) => exercise.id === 'foundation-w07-d03-q02');

  assert.equal(lesson.versionReviewedAt, '2026-10-16');
  assert.deepEqual(markerQuestion.answerLines, [2, 4, 6]);
  assert.equal(gradeAnswer(markerQuestion, [2, 4, 6]), true);
  assert.equal(gradeAnswer(markerQuestion, [2]), false);
  assert.match(markerQuestion.codeLines[1], /^<<<<<<< HEAD$/);
  assert.match(markerQuestion.codeLines[3], /^=======$/);
  assert.match(markerQuestion.codeLines[5], /^>>>>>>> feature$/);
  assert.match(defaultLabelQuestion.prompt, /문자열/);
});

test('foundation weeks 9 and 10 keep PR answers scoped and use safe secret examples', () => {
  const weekNine = foundationsWeeks[8];
  const weekTen = foundationsWeeks[9];
  const scopeQuestion = weekNine.exercises.find((exercise) => exercise.id === 'foundation-w09-d01-q02');
  const testKindsQuestion = weekNine.exercises.find((exercise) => exercise.id === 'foundation-w09-d04-q02');
  const secretQuestion = weekNine.exercises.find((exercise) => exercise.id === 'foundation-w09-d04-q03');
  const mergeReadinessQuestion = weekNine.exercises.find((exercise) => exercise.id === 'foundation-w09-d05-q02');

  assert.equal(weekNine.versionReviewedAt, '2026-10-16');
  assert.equal(weekTen.versionReviewedAt, '2026-10-16');
  assert.match(weekTen.referenceVersion, /Node\.js 26\.12\.0/);
  assert.ok(scopeQuestion.acceptedAnswers.length >= 4);
  assert.ok(scopeQuestion.acceptedAnswers.every((answer) => gradeAnswer(scopeQuestion, answer)));
  assert.equal(testKindsQuestion.acceptedAnswers.length, 18);
  assert.ok(testKindsQuestion.acceptedAnswers.every((answer) => gradeAnswer(testKindsQuestion, answer)));
  assert.equal(gradeAnswer(testKindsQuestion, '정상 입력만 확인'), false);
  assert.ok(secretQuestion.codeLines[2].includes('[REAL_KEY_REDACTED]'));
  assert.doesNotMatch(secretQuestion.codeLines[2], /sk-live-actual-secret-value/);
  assert.match(secretQuestion.explanation, /폐기하고 교체/);
  assert.ok(mergeReadinessQuestion.acceptedAnswers.every((answer) => gradeAnswer(mergeReadinessQuestion, answer)));
  assert.equal(gradeAnswer(mergeReadinessQuestion, '요구사항·검사·리뷰 상태'), false);
});

test('foundation week 10 explains its error example and uses learner-friendly Korean', () => {
  const weekTen = foundationsWeeks[9];
  const factsDay = weekTen.studyDays[0];
  const callFlowDay = weekTen.studyDays[1];
  const factQuestion = weekTen.exercises.find((exercise) => exercise.id === 'foundation-w10-d01-q01');

  assert.match(factsDay.example, /뜻: 값이 정해지지 않은 상태\(undefined\)에서 그 값 안의 정보를 읽으려 했다는 오류예요\./);
  assert.match(factsDay.example, /확인된 위치: `renderCard` 함수의 18번째 줄/);
  assert.match(factsDay.example, /가능한 원인: API 응답에 필요한 값이 빠졌을 수 있어요\./);
  assert.match(factsDay.example, /다음에 확인할 것: 문제가 난 입력과 `renderCard`에 전달된 값을 살펴봐요\./);
  assert.doesNotMatch(factsDay.example, /보고됨|가설:/);
  assert.match(factQuestion.prompt, /이 기록만으로 바로 알 수 있는 내용은 무엇인가요/);
  assert.match(factQuestion.choices.find((choice) => choice.id === factQuestion.answer).text, /18번째 줄/);
  assert.match(callFlowDay.intro, /함수 호출 기록\(스택 추적\)/);
  assert.match(callFlowDay.intro, /외부 라이브러리\(가져다 쓰는 코드\)/);
});

test('foundation weeks 11 and 12 keep debugging metadata current and distinguish undefined lookup from property failure', () => {
  const weekEleven = foundationsWeeks[10];
  const weekTwelve = foundationsWeeks[11];
  const missingItemHypothesis = weekTwelve.exercises.find((exercise) => exercise.id === 'foundation-w12-d01-q02');
  const emptyArrayLookup = weekTwelve.exercises.find((exercise) => exercise.id === 'foundation-w12-d02-q02');

  assert.equal(weekEleven.versionReviewedAt, '2026-10-16');
  assert.equal(weekTwelve.versionReviewedAt, '2026-10-16');
  assert.match(weekEleven.intro, /아직 확인하지 않은 원인 후보를 ‘가설’이라고 해요/);
  assert.match(weekEleven.referenceVersion, /Chrome DevTools Console.*Node\.js 26\.12\.0/);
  assert.match(weekTwelve.referenceVersion, /Chrome DevTools Console.*Node\.js 26\.12\.0/);
  assert.match(missingItemHypothesis.prompt, /JavaScript/);
  assert.ok(missingItemHypothesis.acceptedAnswers.every((answer) => gradeAnswer(missingItemHypothesis, answer)));
  assert.match(missingItemHypothesis.explanation, /items\[0\].*undefined.*TypeError/);
  assert.match(emptyArrayLookup.prompt, /JavaScript/);
  assert.match(emptyArrayLookup.explanation, /예외가 나지 않아요/);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url.includes('Language_overview#arrays')), true);
});

test('foundation weeks 13 and 14 use test and HTTP sources with explanations that match each answer', () => {
  const weekThirteen = foundationsWeeks[12];
  const weekFourteen = foundationsWeeks[13];
  const requestQuestion = weekFourteen.exercises.find((exercise) => exercise.id === 'foundation-w14-d01-q01');
  const malformedHeaderQuestion = weekFourteen.exercises.find((exercise) => exercise.id === 'foundation-w14-d01-q03');

  assert.equal(weekThirteen.versionReviewedAt, '2026-10-16');
  assert.match(weekThirteen.referenceVersion, /Node\.js 26\.12\.0 test runner/);
  assert.equal(weekFourteen.versionReviewedAt, '2026-10-16');
  assert.equal(requestQuestion.choices.find((choice) => choice.id === requestQuestion.answer).text, '메서드는 요청 동작이고 경로는 대상 리소스다');
  assert.match(requestQuestion.explanation, /POST는 요청 메서드.*\/courses는 대상 리소스/);
  assert.equal(requestQuestion.choiceExplanations[requestQuestion.answer], requestQuestion.explanation);
  assert.doesNotMatch(requestQuestion.explanation, /Content-Type/);
  assert.match(malformedHeaderQuestion.explanation, /콜론/);
  assert.match(weekFourteen.exercises.find((exercise) => exercise.id === 'foundation-w14-d02-q01').hint, /GET.*조회/);
});

test('foundation weeks 15 and 16 align cache and API contract hints and explanations', () => {
  const weekFifteen = foundationsWeeks[14];
  const weekSixteen = foundationsWeeks[15];
  const acceptQuestion = weekFifteen.exercises.find((exercise) => exercise.id === 'foundation-w15-d01-q01');
  const cacheQuestion = weekFifteen.exercises.find((exercise) => exercise.id === 'foundation-w15-d03-q01');
  const operationQuestion = weekSixteen.exercises.find((exercise) => exercise.id === 'foundation-w16-d04-q01');
  const schemaExampleQuestion = weekSixteen.exercises.find((exercise) => exercise.id === 'foundation-w16-d05-q01');

  assert.equal(weekFifteen.versionReviewedAt, '2026-10-16');
  assert.equal(weekSixteen.versionReviewedAt, '2026-10-16');
  assert.match(weekSixteen.referenceVersion, /OpenAPI Specification 3\.2\.1/);
  assert.equal(acceptQuestion.choiceExplanations[acceptQuestion.answer], 'Accept는 받을 응답 표현에 대한 선호를 전달해요.');
  assert.match(weekFifteen.exercises.find((exercise) => exercise.id === 'foundation-w15-d03-q02').explanation, /저장.*재검증/);
  assert.match(cacheQuestion.explanation, /저장하지 않도록/);
  assert.match(operationQuestion.explanation, /paths.*경로.*get operation/);
  assert.doesNotMatch(operationQuestion.explanation, /responses를 operation 아래/);
  assert.match(schemaExampleQuestion.hint, /integer/);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://spec.openapis.org/oas/v3.2.1.html'), true);
});

test('foundation weeks 17 and 18 reflect the current API and PostgreSQL release status', () => {
  const weekSeventeen = foundationsWeeks[16];
  const weekEighteen = foundationsWeeks[17];
  const deleteQuestion = weekSeventeen.exercises.find((exercise) => exercise.id === 'foundation-w17-d01-q01');
  const scoreConstraintQuestion = weekEighteen.exercises.find((exercise) => exercise.id === 'foundation-w18-d04-q01');
  const nullCheckQuestion = weekEighteen.exercises.find((exercise) => exercise.id === 'foundation-w18-d04-q03');

  assert.equal(weekSeventeen.versionReviewedAt, '2026-10-16');
  assert.match(weekSeventeen.referenceVersion, /OpenAPI Specification 3\.2\.1/);
  assert.match(deleteQuestion.hint, /DELETE.*\/courses\/42/);
  assert.equal(weekEighteen.versionReviewedAt, '2026-10-16');
  assert.match(weekEighteen.referenceVersion, /PostgreSQL 19 RC 1/);
  assert.match(weekEighteen.intro, /RC 1/);
  assert.doesNotMatch(weekEighteen.intro, /19는 현재 베타/);
  assert.equal(scoreConstraintQuestion.choices.find((choice) => choice.id === scoreConstraintQuestion.answer).text, 'CHECK (score >= 0)');
  assert.match(scoreConstraintQuestion.prompt, /NULL인지 여부와는 별도로/);
  assert.match(scoreConstraintQuestion.explanation, /NULL 허용 여부.*NOT NULL/);
  assert.match(nullCheckQuestion.explanation, /음수 값도 통과/);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url.includes('postgresql-19-rc-1-released')), true);
});

test('foundation weeks 19 and 20 match PostgreSQL query results and valid SQL answers', async () => {
  const weekNineteen = foundationsWeeks[18];
  const weekTwenty = foundationsWeeks[19];
  const selectColumnsQuestion = weekNineteen.exercises.find((exercise) => exercise.id === 'foundation-w19-d01-q02');
  const compositeLocateQuestion = weekNineteen.exercises.find((exercise) => exercise.id === 'foundation-w19-d05-q03');
  const joinQuestion = weekTwenty.exercises.find((exercise) => exercise.id === 'foundation-w20-d04-q01');

  assert.equal(weekNineteen.versionReviewedAt, '2026-10-16');
  assert.equal(weekTwenty.versionReviewedAt, '2026-10-16');
  assert.ok(gradeAnswer(selectColumnsQuestion, 'name, level'));
  assert.equal(gradeAnswer(selectColumnsQuestion, 'name level'), false);
  assert.deepEqual(compositeLocateQuestion.answerLines, [5]);
  assert.equal(compositeLocateQuestion.codeLines[1], 'FROM students');
  assert.match(joinQuestion.choices.find((choice) => choice.id === joinQuestion.answer).text, /두 행/);

  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE students (id integer, name text, level integer, nickname text);
      INSERT INTO students VALUES (1, 'Mina', 2, 'Mina'), (2, 'Jun', 1, NULL), (3, 'Ara', 2, NULL);
      CREATE TABLE enrollments (student_id integer, course_id integer);
      INSERT INTO enrollments VALUES (1, 3), (1, 4);
    `);

    const selectedRows = await db.query('SELECT name FROM students WHERE level = 2 ORDER BY id');
    assert.deepEqual(selectedRows.rows.map((row) => row.name), ['Mina', 'Ara']);

    const boundaryRows = await db.query('SELECT score FROM (VALUES (59), (60), (80)) AS scores(score) WHERE score >= 60 ORDER BY score');
    assert.deepEqual(boundaryRows.rows.map((row) => row.score), [60, 80]);

    const tiedRows = await db.query('SELECT id, score FROM (VALUES (1, 80), (2, 80), (3, 60)) AS results(id, score) ORDER BY score DESC, id ASC');
    assert.deepEqual(tiedRows.rows, [{ id: 1, score: 80 }, { id: 2, score: 80 }, { id: 3, score: 60 }]);

    const nullRows = await db.query('SELECT id FROM students WHERE nickname IS NULL ORDER BY id');
    assert.deepEqual(nullRows.rows.map((row) => row.id), [2, 3]);

    const combinedRows = await db.query('SELECT id, name FROM students WHERE level >= 2 AND nickname IS NOT NULL ORDER BY id ASC');
    assert.deepEqual(combinedRows.rows, [{ id: 1, name: 'Mina' }]);

    const countRows = await db.query('SELECT COUNT(*) AS all_rows, COUNT(score) AS scored_rows FROM (VALUES (10), (NULL), (20)) AS scores(score)');
    assert.deepEqual(countRows.rows, [{ all_rows: 3, scored_rows: 2 }]);

    const groupedRows = await db.query("SELECT region, SUM(amount) AS total FROM (VALUES ('west', 10), ('west', 20), ('east', 5)) AS orders(region, amount) GROUP BY region ORDER BY region");
    assert.deepEqual(groupedRows.rows, [{ region: 'east', total: 5 }, { region: 'west', total: 30 }]);

    const havingRows = await db.query("SELECT region, SUM(amount) AS total FROM (VALUES ('west', 70), ('west', 40), ('east', 100)) AS orders(region, amount) GROUP BY region HAVING SUM(amount) > 100");
    assert.deepEqual(havingRows.rows, [{ region: 'west', total: 110 }]);

    const joinedRows = await db.query('SELECT s.id, e.course_id FROM students s INNER JOIN enrollments e ON e.student_id = s.id ORDER BY s.id, e.course_id');
    assert.deepEqual(joinedRows.rows, [{ id: 1, course_id: 3 }, { id: 1, course_id: 4 }]);

    const leftJoinedRows = await db.query('SELECT s.id, e.course_id FROM students s LEFT JOIN enrollments e ON e.student_id = s.id WHERE s.id <= 2 ORDER BY s.id, e.course_id');
    assert.deepEqual(leftJoinedRows.rows, [{ id: 1, course_id: 3 }, { id: 1, course_id: 4 }, { id: 2, course_id: null }]);
  } finally {
    await db.close();
  }
});

test('foundation weeks 21 and 22 teach safe transaction scope and use sanitized secret examples', async () => {
  const weekTwentyOne = foundationsWeeks[20];
  const weekTwentyTwo = foundationsWeeks[21];
  const broadUpdate = weekTwentyOne.exercises.find((exercise) => exercise.id === 'foundation-w21-d01-q03');
  const transactionScope = weekTwentyOne.exercises.find((exercise) => exercise.id === 'foundation-w21-d04-q03');
  const weekTwentyTwoText = JSON.stringify(weekTwentyTwo);
  const secretLines = weekTwentyTwo.exercises
    .filter((exercise) => exercise.type === 'locate-error')
    .flatMap((exercise) => exercise.codeLines)
    .filter((line) => /(?:TOKEN|PASSWORD)=/.test(line));

  assert.equal(weekTwentyOne.versionReviewedAt, '2026-10-16');
  assert.equal(weekTwentyTwo.versionReviewedAt, '2026-10-16');
  assert.match(weekTwentyTwo.referenceVersion, /Secrets Management.*CI\/CD Security.*GitHub secret scanning/);
  assert.match(weekTwentyTwo.intro, /가짜 값과 정적 사례/);
  assert.equal(new Set(weekTwentyTwo.studyDays.map((day) => day.intro)).size, 5);
  assert.deepEqual(broadUpdate.answerLines, [3]);
  assert.deepEqual(transactionScope.answerLines, [2]);
  assert.ok(secretLines.some((line) => line.includes('[REAL_TOKEN_REDACTED]')));
  assert.ok(secretLines.some((line) => line.includes('[REAL_PASSWORD_REDACTED]')));
  assert.doesNotMatch(weekTwentyTwoText, /sk-live-actual-token|prod-password-2026|abcd-real-secret/);
  assert.equal(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://docs.github.com/en/code-security/concepts/secret-security/push-protection'), true);

  const db = new PGlite();
  try {
    await db.exec('CREATE TABLE inventory (id integer PRIMARY KEY, count integer); INSERT INTO inventory VALUES (1, 4), (8, 7);');

    await db.exec('BEGIN; UPDATE inventory SET count = 3 WHERE id = 8 OR id > 0;');
    const broadenedRows = await db.query('SELECT id FROM inventory WHERE count = 3 ORDER BY id');
    assert.deepEqual(broadenedRows.rows.map((row) => row.id), [1, 8]);
    await db.exec('ROLLBACK;');
    const rolledBackRows = await db.query('SELECT id, count FROM inventory ORDER BY id');
    assert.deepEqual(rolledBackRows.rows, [{ id: 1, count: 4 }, { id: 8, count: 7 }]);

    await db.exec('BEGIN; UPDATE inventory SET count = 3 WHERE id = 8; COMMIT;');
    const committedRows = await db.query('SELECT id, count FROM inventory ORDER BY id');
    assert.deepEqual(committedRows.rows, [{ id: 1, count: 4 }, { id: 8, count: 3 }]);
  } finally {
    await db.close();
  }
});

test('foundation weeks 23 and 24 align security and API-contract questions with their examples', () => {
  const weekTwentyThree = foundationsWeeks[22];
  const weekTwentyFour = foundationsWeeks[23];
  const authorizationCheck = weekTwentyThree.exercises.find((exercise) => exercise.id === 'foundation-w23-d01-q03');
  const contractCheck = weekTwentyFour.exercises.find((exercise) => exercise.id === 'foundation-w24-d01-q03');
  const createContractCheck = weekTwentyFour.exercises.find((exercise) => exercise.id === 'foundation-w24-d03-q03');
  const regressionCheck = weekTwentyFour.exercises.find((exercise) => exercise.id === 'foundation-w24-d04-q03');
  const failureRecord = weekTwentyFour.exercises.find((exercise) => exercise.id === 'foundation-w24-d05-q03');

  assert.equal(weekTwentyThree.versionReviewedAt, '2026-10-16');
  assert.equal(weekTwentyFour.versionReviewedAt, '2026-10-16');
  assert.match(weekTwentyThree.referenceVersion, /OWASP Input Validation.*RFC 9110/);
  assert.match(weekTwentyFour.referenceVersion, /Node\.js 26.*OpenAPI 3\.2\.1/);
  assert.equal(new Set(weekTwentyThree.studyDays.map((day) => day.intro)).size, 5);
  assert.equal(new Set(weekTwentyFour.studyDays.map((day) => day.intro)).size, 5);
  assert.equal(weekTwentyThree.exercises.length, 15);
  assert.equal(weekTwentyFour.exercises.length, 15);

  assert.deepEqual(authorizationCheck.answerLines, [4]);
  assert.match(authorizationCheck.codeLines[2], /request\.body\.role/);
  assert.match(authorizationCheck.codeLines[3], /role === "admin"/);
  assert.match(authorizationCheck.explanation, /요청에서 받은 role/);
  assert.ok(weekTwentyThree.exercises.some((exercise) => exercise.id === 'foundation-w23-d02-q03' && exercise.answerLines[0] === 3));
  assert.ok(weekTwentyThree.exercises.some((exercise) => exercise.id === 'foundation-w23-d05-q03' && exercise.codeLines[3].includes('[REDACTED_BEARER_TOKEN]')));
  assert.doesNotMatch(JSON.stringify(weekTwentyThree), /eyJ[a-zA-Z0-9_-]{12,}\.[a-zA-Z0-9_-]{12,}/);

  assert.deepEqual(contractCheck.answerLines, [4]);
  assert.match(contractCheck.codeLines[3], /response\.status, 200/);
  assert.doesNotMatch(contractCheck.codeLines.join('\n'), /response\.body\.name/);
  assert.match(contractCheck.prompt, /name 형식/);
  assert.deepEqual(createContractCheck.answerLines, [4]);
  assert.match(createContractCheck.codeLines[3], /response\.status, 201/);
  assert.doesNotMatch(createContractCheck.codeLines.join('\n'), /response\.body\.id/);
  assert.match(createContractCheck.prompt, /생성 ID 계약/);
  assert.match(regressionCheck.codeLines[1], /input = \[\]/);
  assert.match(regressionCheck.codeLines[3], /summarize\(\[1\]\)/);
  assert.match(failureRecord.codeLines[1], /기대한 값: 4, 실제 결과: 5/);

  const sourceUrls = foundationsTrack.contentReview.sources.map((source) => source.url);
  assert.ok(sourceUrls.includes('https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'));
  assert.ok(sourceUrls.includes('https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'));
  assert.ok(sourceUrls.includes('https://nodejs.org/api/test.html'));
  assert.ok(sourceUrls.includes('https://spec.openapis.org/oas/v3.2.1.html'));
});

test('foundation weeks 25 and 26 teach review and release decisions without stale secrets or unreachable examples', () => {
  const weekTwentyFive = foundationsWeeks[24];
  const weekTwentySix = foundationsWeeks[25];
  const outOfScopeSecret = weekTwentyFive.exercises.find((exercise) => exercise.id === 'foundation-w25-d02-q03');
  const topicFallback = weekTwentySix.exercises.find((exercise) => exercise.id === 'foundation-w26-d02-q03');
  const weekText = JSON.stringify([weekTwentyFive, weekTwentySix]);

  assert.equal(weekTwentyFive.versionReviewedAt, '2026-10-16');
  assert.equal(weekTwentySix.versionReviewedAt, '2026-10-16');
  assert.match(weekTwentyFive.referenceVersion, /Git 2\.56\.0.*OWASP CI\/CD Security.*Secrets Management/);
  assert.match(weekTwentySix.referenceVersion, /Node\.js 26\.12\.0.*OpenAPI 3\.2\.1.*PostgreSQL 18\.6/);
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://git-scm.com/docs/user-manual'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/'));
  assert.equal(new Set(weekTwentyFive.studyDays.map((day) => day.intro)).size, 5);
  assert.equal(new Set(weekTwentySix.studyDays.map((day) => day.intro)).size, 5);
  assert.equal(weekTwentyFive.exercises.length, 15);
  assert.equal(weekTwentySix.exercises.length, 15);

  assert.deepEqual(outOfScopeSecret.answerLines, [4]);
  assert.ok(outOfScopeSecret.codeLines[3].includes('[REDACTED_SECRET]'));
  assert.doesNotMatch(weekText, /prod-secret-2026/);
  assert.deepEqual(topicFallback.answerLines, [4]);
  assert.match(topicFallback.codeLines[2], /allowed\.has\(topic\)/);
  assert.match(topicFallback.codeLines[3], /showAllLessons/);
  assert.match(topicFallback.explanation, /지원하지 않는 문자열/);
});

test('common foundations are independently routable and do not change the language tracks', () => {
  assert.equal(tracks.length, 12);
  assert.deepEqual(tracks.filter((track) => track.id !== 'postgresql').map((track) => track.id), [
    'javascript', 'python', 'java', 'fastapi', 'spring', 'react', 'nextjs', 'kotlin', 'csharp', 'typescript', 'ai',
  ]);
  assert.equal(getTrack('foundations'), foundationsTrack);
  assert.equal(getLesson('foundation-w01')?.trackId, 'foundations');
  assert.deepEqual(getTopic('foundations-tooling')?.lessons.map((lesson) => lesson.id), ['foundation-w01', 'foundation-w02']);
  assert.deepEqual(getTopic('foundations-git')?.lessons.map((lesson) => lesson.id), ['foundation-w03', 'foundation-w04']);
  assert.deepEqual(getTopic('foundations-git-collaboration')?.lessons.map((lesson) => lesson.id), [
    'foundation-w05', 'foundation-w06', 'foundation-w07', 'foundation-w08', 'foundation-w09',
  ]);
  assert.deepEqual(getTopic('foundations-debugging')?.lessons.map((lesson) => lesson.id), ['foundation-w10', 'foundation-w11', 'foundation-w12']);
  assert.deepEqual(getTopic('foundations-http')?.lessons.map((lesson) => lesson.id), ['foundation-w14', 'foundation-w15']);
  assert.deepEqual(getTopic('foundations-api-contracts')?.lessons.map((lesson) => lesson.id), ['foundation-w16']);
  assert.deepEqual(getTopic('foundations-api')?.lessons.map((lesson) => lesson.id), ['foundation-w17']);
  assert.deepEqual(getTopic('foundations-sql-model')?.lessons.map((lesson) => lesson.id), ['foundation-w18']);
  assert.deepEqual(getTopic('foundations-sql-query')?.lessons.map((lesson) => lesson.id), ['foundation-w19']);
  assert.deepEqual(getTopic('foundations-sql-relations')?.lessons.map((lesson) => lesson.id), ['foundation-w20']);
  assert.deepEqual(getTopic('foundations-sql-transactions')?.lessons.map((lesson) => lesson.id), ['foundation-w21']);
  assert.deepEqual(getTopic('foundations-security')?.lessons.map((lesson) => lesson.id), ['foundation-w22', 'foundation-w23']);
  assert.deepEqual(getTopic('foundations-testing')?.lessons.map((lesson) => lesson.id), ['foundation-w13', 'foundation-w24']);
  assert.deepEqual(getTopic('foundations-delivery')?.lessons.map((lesson) => lesson.id), ['foundation-w25']);
  assert.deepEqual(getTopic('foundations-capstone')?.lessons.map((lesson) => lesson.id), ['foundation-w26']);
  for (const week of foundationsWeeks.slice(1)) {
    assert.equal(getLesson(week.id)?.prerequisiteLessonIds[0], `foundation-w${String(week.week - 1).padStart(2, '0')}`);
  }
  assert.ok(foundationsTrack.contentReview.sources.every((source) => source.url.startsWith('https://')));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://docs.github.com/en/pull-requests/reference/pull-requests'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://developer.chrome.com/docs/devtools/console'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://www.rfc-editor.org/rfc/rfc9457.html'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://spec.openapis.org/oas/latest.html'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://www.postgresql.org/support/versioning/'));
  assert.ok(foundationsTrack.contentReview.sources.some((source) => source.url === 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'));
});
