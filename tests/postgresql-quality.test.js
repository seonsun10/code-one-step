import assert from 'node:assert/strict';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { gradeAnswer } from '../src/grading.js';
import { codingProblems } from '../src/coding-problems.js';
import { getExercise, tracks } from '../src/content.js';
import { sameExerciseValue } from '../src/runner-values.js';
import { evaluatePostgresSource } from '../src/postgresql-grading.js';
import { validateCodingProblemBank } from '../scripts/coding-problem-schema.mjs';
import { postgresqlCoursePlans, postgresqlReviewedIntroDayCases } from '../src/curriculum-weeks-postgresql.js';

const track = tracks.find((item) => item.id === 'postgresql');
const problems = codingProblems.filter((problem) => problem.language === 'postgresql');
const levels = ['입문', '기초', '중급', '고급', '실전'];

function assertTraceId(trace) {
  assert.match(trace.id, /-v\d+-short(?:-v2)?$/);
  if (trace.id.endsWith('-short-v2')) {
    const legacyId = trace.id.replace(/-short-v2$/, '-short');
    assert.ok(trace.legacyIds?.includes(legacyId), trace.id);
    assert.equal(getExercise(legacyId), trace);
  }
}

async function queryAndRollback(db, sql) {
  await db.exec('BEGIN;');
  try {
    const result = await db.query(sql);
    await db.exec('ROLLBACK;');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK;');
    throw error;
  }
}

async function seedPostgresqlReviewFixture(db) {
  await db.exec(problems[0].database.setup);
  await db.exec(`INSERT INTO learners VALUES
      (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'), (4, '도윤', 'C');
    INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on) VALUES
      (1, 1, 'SQL', 40, TRUE, '2026-01-01'),
      (2, 1, 'JS', 60, TRUE, '2026-01-02'),
      (3, 2, 'SQL', 70, TRUE, '2026-01-03'),
      (4, 3, 'SQL', 80, TRUE, '2026-01-04'),
      (5, 3, 'SQL', 80, FALSE, '2026-01-05');`);
}

test('PostgreSQL curriculum is a complete 39-week path with 195 sessions and 585 questions', () => {
  assert.ok(track);
  assert.equal(track.course.weeks, 39);
  assert.equal(track.course.sessions, 195);
  assert.equal(track.course.questions, 585);
  assert.equal(track.course.contentStatus, '문항 검수 완료');
  assert.equal(track.contentReview.version, 'PostgreSQL 18.6 (실행기 18.3)');
  assert.equal(track.contentReview.reviewedAt, '2026-11-02');
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 39 }, (_, index) => index + 1));
  assert.deepEqual(track.topics.map((topic) => topic.stage), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(track.topics.map((topic) => topic.lessonIds.length), [7, 6, 7, 5, 7, 7]);
  assert.deepEqual(track.lessons.map((lesson) => lesson.week), Array.from({ length: 39 }, (_, index) => index + 1));

  const exerciseIds = track.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id));
  assert.equal(exerciseIds.length, 585);
  assert.equal(new Set(exerciseIds).size, 585);
  for (const url of [
    'https://www.postgresql.org/docs/18/sql-select.html',
    'https://www.postgresql.org/docs/18/ddl-constraints.html',
    'https://www.postgresql.org/docs/18/queries-order.html',
    'https://www.postgresql.org/docs/18/queries-limit.html',
    'https://www.postgresql.org/docs/18/functions-comparison.html',
    'https://www.postgresql.org/docs/18/functions-subquery.html',
    'https://www.postgresql.org/docs/18/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES',
    'https://www.postgresql.org/docs/18/queries-with.html',
    'https://www.postgresql.org/docs/18/queries-union.html',
    'https://www.postgresql.org/docs/18/tutorial-window.html',
    'https://www.postgresql.org/docs/18/functions-window.html',
    'https://www.postgresql.org/docs/18/dml.html',
    'https://www.postgresql.org/docs/18/dml-returning.html',
    'https://www.postgresql.org/docs/18/tutorial-transactions.html',
    'https://www.postgresql.org/docs/18/transaction-iso.html',
    'https://www.ibm.com/think/topics/database-normalization',
    'https://www.postgresql.org/docs/18/sql-begin.html',
    'https://www.postgresql.org/docs/18/indexes.html',
    'https://www.postgresql.org/docs/18/indexes-types.html',
    'https://www.postgresql.org/docs/18/indexes-multicolumn.html',
    'https://www.postgresql.org/docs/18/indexes-partial.html',
    'https://www.postgresql.org/docs/18/indexes-examine.html',
    'https://www.postgresql.org/docs/18/using-explain.html',
    'https://www.postgresql.org/docs/18/sql-explain.html',
    'https://www.postgresql.org/docs/18/release-18.html',
    'https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/',
    'https://www.postgresql.org/docs/18/sql-createview.html',
    'https://www.postgresql.org/docs/18/rules-views.html',
    'https://www.postgresql.org/docs/18/ddl-priv.html',
    'https://www.postgresql.org/docs/18/datatype-numeric.html',
    'https://www.postgresql.org/docs/18/arrays.html',
    'https://www.postgresql.org/docs/18/datatype-json.html',
    'https://www.postgresql.org/docs/18/functions-json.html',
    'https://www.postgresql.org/docs/18/functions-array.html',
    'https://www.postgresql.org/docs/18/gin.html',
    'https://www.postgresql.org/docs/18/gin-builtin-opclasses.html',
    'https://www.postgresql.org/docs/18/sql-prepare.html',
    'https://www.postgresql.org/docs/18/libpq-exec.html',
    'https://www.postgresql.org/docs/18/errcodes-appendix.html',
    'https://www.postgresql.org/docs/18/explicit-locking.html',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
  for (const [index, lesson] of track.lessons.entries()) {
    const plan = postgresqlCoursePlans[index];
    assert.equal(lesson.title, plan.title, lesson.id);
    assert.equal(lesson.intro, '', lesson.id);
    assert.deepEqual(lesson.points, [], lesson.id);
    assert.deepEqual(lesson.prerequisiteLessonIds, index ? [track.lessons[index - 1].id] : [], lesson.id);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);
    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const reviewedCase = postgresqlReviewedIntroDayCases[lesson.week]?.[dayIndex];
      assert.equal(day.title, reviewedCase?.focus ?? plan.days[dayIndex], `${lesson.id}/${day.number} title`);
      assert.doesNotMatch(day.intro, /automatically regression verified|자동 회귀 검증/, `${lesson.id}/${day.number} intro`);
      assert.equal(day.exercises.length, 3, `${lesson.id}/${day.number}`);
      const concept = day.exercises[0];
      const selected = concept.choices.find((option) => option.id === concept.answer)?.text;
      assert.equal(selected, postgresqlReviewedIntroDayCases[lesson.week]?.[day.number - 1]?.correctAnswer ?? postgresqlCoursePlans[lesson.week - 1].correct[day.number - 1], concept.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(gradeAnswer(day.exercises[1], day.exercises[1].acceptedAnswers[0]), true, day.exercises[1].id);
      if (dayIndex === 4) {
        const repair = day.exercises[2];
        assert.equal(repair.type, 'repair-code', repair.id);
        assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
        const reviewedCase = postgresqlReviewedIntroDayCases[lesson.week]?.[day.number - 1];
        const expectedFix = (reviewedCase?.repairCode ?? reviewedCase?.fix ?? postgresqlCoursePlans[index].fix).replaceAll('__DAY__', String(day.number));
        assert.equal(new RegExp(repair.solutionPatterns[0], 'i').test(expectedFix), true, repair.id);
        assert.equal(gradeAnswer(repair, expectedFix), true, repair.id);
      } else {
        const locate = day.exercises[2];
        assert.equal(locate.type, 'locate-error', locate.id);
        assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
      }
    }
  }
});

test('PostgreSQL weeks one through three use distinct, output-traced daily examples and specific repairs', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT NOT NULL, cohort TEXT NOT NULL);
      CREATE TABLE attempts (id INTEGER PRIMARY KEY, learner_id INTEGER NOT NULL REFERENCES learners(id), topic TEXT NOT NULL, points INTEGER NOT NULL, active BOOLEAN NOT NULL, submitted_on DATE NOT NULL);
      INSERT INTO learners VALUES (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B');
      INSERT INTO attempts VALUES
        (1, 1, 'sql', 40, TRUE, '2026-01-01'),
        (2, 2, 'sql', 60, TRUE, '2026-01-02'),
        (3, 1, 'sql', 70, TRUE, '2026-01-03'),
        (4, 3, 'sql', 80, TRUE, '2026-01-04'),
        (5, 3, 'sql', 100, TRUE, '2026-01-05');`);

    for (const weekNumber of [1, 2, 3]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
      assert.equal(day.example, review.displayExample ?? review.query);
        assert.equal(day.objective, review.objective);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.length, 4);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.ok(trace.prompt.includes(review.query), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.explanation.includes(review.errorReason), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks four through six exercise distinct logic, NULL, and sorting results', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT NOT NULL, cohort TEXT NOT NULL);
      CREATE TABLE attempts (id INTEGER PRIMARY KEY, learner_id INTEGER NOT NULL REFERENCES learners(id), topic TEXT NOT NULL, points INTEGER NOT NULL, active BOOLEAN NOT NULL, submitted_on DATE NOT NULL, review_note TEXT);
      INSERT INTO learners VALUES (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B');
      INSERT INTO attempts VALUES
        (1, 1, 'sql', 40, TRUE, '2026-01-01', 'done'),
        (2, 2, 'sql', 60, FALSE, '2026-01-02', NULL),
        (3, 1, 'sql', 70, TRUE, '2026-01-03', ''),
        (4, 3, 'sql', 80, FALSE, '2026-01-04', NULL),
        (5, 3, 'sql', 100, FALSE, '2026-01-05', 'pending'),
        (6, 3, 'sql', 80, TRUE, '2026-01-06', 'done');`);

    for (const weekNumber of [4, 5, 6]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
      assert.equal(day.example, review.displayExample ?? review.query);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.length, 4);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        const repaired = await db.query(review.fix);
        assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
        const faulty = await db.query(review.codeLines.join('\n'));
        assert.notDeepEqual(faulty.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} defect is observable`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks seven through nine trace pages, text functions, dates, and time zones', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES
        (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'),
        (4, '도윤', 'C'), (5, '가온', 'B'), (6, '라온', 'A');
      INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on, review_note) VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01', 'done'),
        (2, 2, 'JavaScript', 60, FALSE, '2026-01-02', NULL),
        (3, 1, 'sql', 70, TRUE, '2026-01-03', ''),
        (4, 3, '데이터', 80, FALSE, '2026-01-04', NULL),
        (5, 3, 'SQL', 100, FALSE, '2026-01-05', 'pending'),
        (6, 3, 'sql', 80, TRUE, '2026-01-06', 'done');`);

    for (const weekNumber of [7, 8, 9]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
        assert.equal(day.example, review.displayExample ?? review.query);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.length, 4);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        const repaired = await db.query(review.fix);
        assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
        const faulty = await db.query(review.codeLines.join('\n'));
        assert.notDeepEqual(faulty.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} defect is observable`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks ten through twelve verify distinct rows, CASE branches, and NULL-aware aggregates', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES (1, '민서', 'A'), (2, '준', 'B'), (3, '하린', 'C');
      INSERT INTO attempts VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01', 'done', 4),
        (2, 1, 'SQL', 60, FALSE, '2026-01-02', NULL, NULL),
        (3, 1, 'sql', 70, TRUE, '2026-01-03', '', 0),
        (4, 2, 'SQL', 80, FALSE, '2026-01-04', NULL, 5),
        (5, 2, 'SQL', 100, FALSE, '2026-01-05', 'pending', 10),
        (6, 3, 'JS', 80, TRUE, '2026-01-06', 'done', NULL);`);

    for (const weekNumber of [10, 11, 12]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
        assert.equal(day.example, review.query);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.length, 4);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        const repaired = await db.query(review.fix);
        assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
        let faultyRows;
        try {
          faultyRows = (await db.query(review.codeLines.join('\n'))).rows;
        } catch {
          faultyRows = null;
        }
        assert.ok(faultyRows === null || JSON.stringify(faultyRows) !== JSON.stringify(review.expectedRows), `W${weekNumber} D${dayIndex + 1} defect is observable`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks thirteen through fifteen trace groups, joins, and preserved rows', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'), (4, '도윤', 'C');
      INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on, review_note) VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01', 'done'),
        (2, 1, 'SQL', 60, FALSE, '2026-01-02', NULL),
        (3, 1, 'JS', 70, TRUE, '2026-01-03', ''),
        (4, 2, 'SQL', 80, FALSE, '2026-01-04', NULL),
        (5, 2, 'SQL', 100, FALSE, '2026-01-05', 'pending'),
        (6, 3, 'JS', 80, TRUE, '2026-01-06', 'done');`);

    for (const weekNumber of [13, 14, 15]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
        assert.equal(day.example, review.query);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.length, 4);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        const repaired = await db.query(review.fix);
        assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
        let faultyRows;
        try {
          faultyRows = (await db.query(review.codeLines.join('\n'))).rows;
        } catch {
          faultyRows = null;
        }
        assert.ok(faultyRows === null || JSON.stringify(faultyRows) !== JSON.stringify(review.expectedRows), `W${weekNumber} D${dayIndex + 1} defect is observable`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks sixteen through eighteen verify many-to-many joins and subquery cardinality', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES
        (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'), (4, '도윤', 'C');
      INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on, review_note) VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01', 'done'),
        (2, 1, 'JS', 60, TRUE, '2026-01-02', NULL),
        (3, 2, 'SQL', 70, TRUE, '2026-01-03', ''),
        (4, 3, 'SQL', 80, TRUE, '2026-01-04', 'review');
      INSERT INTO tags (name) VALUES ('기초'), ('복습'), ('경계'), ('미분류');
      INSERT INTO attempt_tags (attempt_id, tag_name) VALUES
        (1, '기초'), (1, '복습'), (2, '복습'), (3, '기초'), (4, '경계'), (4, '복습');`);

    for (const weekNumber of [16, 17, 18]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
        assert.equal(day.example, review.query);
        assert.equal(day.objective, review.objective);
        assert.match(concept.id, /-v2-choice$/);
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
        const repaired = await db.query(review.fix);
        assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
        let faultyRows;
        try {
          faultyRows = (await db.query(review.codeLines.join('\n'))).rows;
        } catch {
          faultyRows = null;
        }
        assert.ok(faultyRows === null || JSON.stringify(faultyRows) !== JSON.stringify(review.expectedRows), `W${weekNumber} D${dayIndex + 1} defect is observable`);
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, [2]);
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL weeks nineteen through thirty verify query design, transactions, plans, and indexes', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES
        (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'), (4, '도윤', 'C');
      INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on) VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01'),
        (2, 1, 'JS', 60, TRUE, '2026-01-02'),
        (3, 2, 'SQL', 70, TRUE, '2026-01-03'),
        (4, 3, 'SQL', 80, TRUE, '2026-01-04'),
        (5, 3, 'SQL', 80, FALSE, '2026-01-05');`);

    for (const weekNumber of [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]) {
      const lesson = track.lessons[weekNumber - 1];
      const reviews = postgresqlReviewedIntroDayCases[weekNumber];
      assert.equal(reviews.length, 5);
      assert.equal(new Set(reviews.map((item) => item.query)).size, 5, `W${weekNumber} distinct queries`);

      for (const [dayIndex, review] of reviews.entries()) {
        const day = lesson.studyDays[dayIndex];
        const [concept, trace, diagnostic] = day.exercises;
        assert.equal(day.example, review.displayExample ?? review.query);
        assert.equal(day.objective, review.objective);
        assert.match(concept.id, new RegExp(`-v${review.answerRevision ?? 2}-choice$`));
        assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, review.correctAnswer);
        assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
        for (const option of concept.choices.filter((item) => item.id !== concept.answer)) {
          assert.equal(gradeAnswer(concept, option.id), false, concept.id);
          assert.ok(concept.choiceExplanations[option.id]?.length > 20, concept.id);
        }

        assertTraceId(trace);
        assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
        assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
        assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
        assert.equal(gradeAnswer(trace, ''), false, trace.id);
        assert.ok(trace.hint.includes(review.traceHint), trace.id);

        if (!review.transactionValidation && !review.concurrencyScenario) {
          const result = await queryAndRollback(db, review.query);
          assert.deepEqual(result.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1}: ${review.query}`);
          const repaired = await queryAndRollback(db, review.fix);
          assert.deepEqual(repaired.rows, review.expectedRows, `W${weekNumber} D${dayIndex + 1} repair`);
          let faultyRows;
          try {
            faultyRows = (await queryAndRollback(db, review.codeLines.join('\n'))).rows;
          } catch {
            faultyRows = null;
          }
          assert.ok(faultyRows === null || JSON.stringify(faultyRows) !== JSON.stringify(review.expectedRows), `W${weekNumber} D${dayIndex + 1} defect is observable`);
        } else if (review.transactionValidation) {
          assert.equal(review.query, review.displayExample, `W${weekNumber} D${dayIndex + 1} displayed transaction script`);
          assert.equal(review.fix, review.query, `W${weekNumber} D${dayIndex + 1} reference transaction script`);
        } else {
          assert.ok(review.query.startsWith('BEGIN'), `W${weekNumber} D${dayIndex + 1} isolated level probe`);
        }
        assert.match(diagnostic.id, new RegExp(`-v2-${dayIndex === 4 ? 'repair' : 'locate'}$`));
        assert.ok(diagnostic.explanation.length > 40, diagnostic.id);
        if (dayIndex === 4) {
          assert.equal(diagnostic.type, 'repair-code');
          assert.equal(gradeAnswer(diagnostic, diagnostic.starterCode), false, diagnostic.id);
          assert.equal(gradeAnswer(diagnostic, review.repairCode ?? review.fix), true, diagnostic.id);
        } else {
          assert.deepEqual(diagnostic.answerLines, review.errorLines.map((line) => line + 1));
          assert.ok(diagnostic.prompt.includes(review.errorPrompt), diagnostic.id);
          assert.ok(diagnostic.hint.includes(review.errorHint), diagnostic.id);
        }
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL week twenty-six repair targets one inspected row and writes only to its disposable test database', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    await db.exec(`INSERT INTO learners VALUES
        (1, '민서', 'A'), (2, '준', 'A'), (3, '하린', 'B'), (4, '도윤', 'C');
      INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on) VALUES
        (1, 1, 'SQL', 40, TRUE, '2026-01-01'),
        (2, 1, 'JS', 60, TRUE, '2026-01-02'),
        (3, 2, 'SQL', 70, TRUE, '2026-01-03'),
        (4, 3, 'SQL', 80, TRUE, '2026-01-04'),
        (5, 3, 'SQL', 80, FALSE, '2026-01-05');`);

    const repair = postgresqlReviewedIntroDayCases[26][4];
    const result = await db.query(repair.repairCode);
    assert.deepEqual(result.rows, [{ id: 2, active: false }]);
    assert.deepEqual((await db.query('SELECT id, active FROM attempts ORDER BY id;')).rows, [
      { id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true },
      { id: 4, active: true }, { id: 5, active: false },
    ]);
  } finally {
    await db.close();
  }
});

test('PostgreSQL week twenty-seven transaction examples commit, roll back, and recover to savepoints', async () => {
  for (const [dayIndex, review] of postgresqlReviewedIntroDayCases[27].entries()) {
    const db = new PGlite();
    try {
      await db.exec(review.transactionValidation.setup);
      const results = await db.exec(review.displayExample);
      const expectedRows = review.expectedRows;
      assert.ok(results.some((result) => JSON.stringify(result.rows) === JSON.stringify(expectedRows)), review.focus);
      if (review.transactionValidation.during) {
        assert.ok(results.some((result) => JSON.stringify(result.rows) === JSON.stringify(review.transactionValidation.during)), review.focus);
      }
      const after = await db.query('SELECT id, balance FROM wallet_demo ORDER BY id;');
      assert.deepEqual(after.rows, review.transactionValidation.after, review.focus);
    } finally {
      await db.close();
    }

    const faultyDb = new PGlite();
    try {
      await faultyDb.exec(review.transactionValidation.setup);
      const faultyScript = dayIndex === 4 ? review.repairStarter : review.codeLines.join('\n');
      await faultyDb.exec(faultyScript);
      const faultyAfter = await faultyDb.query('SELECT id, balance FROM wallet_demo ORDER BY id;');
      assert.notDeepEqual(faultyAfter.rows, review.transactionValidation.after, `${review.focus} faulty path must be observable`);
    } finally {
      await faultyDb.close();
    }
  }
});

test('PostgreSQL week twenty-eight isolation commands match the documented levels and retry scope', async () => {
  const reviews = postgresqlReviewedIntroDayCases[28];
  assert.equal(reviews.length, 5);
  assert.equal(new Set(reviews.map((review) => review.query)).size, 5);

  for (const [dayIndex, review] of reviews.entries()) {
    const db = new PGlite();
    try {
      await seedPostgresqlReviewFixture(db);
      const results = await db.exec(review.query);
      assert.ok(results.some((result) => JSON.stringify(result.rows) === JSON.stringify(review.expectedRows)), review.focus);
      assert.ok(review.executionNote, `${review.focus} must disclose the two-session limitation`);

      if (dayIndex !== 3) {
        const faultyDb = new PGlite();
        try {
          await seedPostgresqlReviewFixture(faultyDb);
          const faultyResults = await faultyDb.exec(review.codeLines.join('\n'));
          assert.ok(!faultyResults.some((result) => JSON.stringify(result.rows) === JSON.stringify(review.expectedRows)), `${review.focus} faulty level must differ`);
        } finally {
          await faultyDb.close();
        }
      } else {
        assert.match(review.query, /FOR UPDATE/i);
        assert.doesNotMatch(review.codeLines.join('\n'), /FOR UPDATE/i);
      }

      if (dayIndex === 4) {
        const lesson = track.lessons[27];
        const repair = lesson.studyDays[4].exercises[2];
        assert.equal(repair.type, 'repair-code');
        assert.equal(gradeAnswer(repair, review.repairCode), true);
        assert.equal(gradeAnswer(repair, review.repairStarter), false);
      }
    } finally {
      await db.close();
    }
  }
});

test('PostgreSQL week twenty-nine EXPLAIN examples run while plans remain data-dependent', async () => {
  const reviews = postgresqlReviewedIntroDayCases[29];
  assert.equal(reviews.length, 5);
  for (const [dayIndex, review] of reviews.entries()) {
    const db = new PGlite();
    try {
      await seedPostgresqlReviewFixture(db);
      const results = await db.exec(review.displayExample);
      const planText = results.flatMap((result) => result.rows ?? [])
        .flatMap((row) => Object.values(row))
        .filter((value) => typeof value === 'string')
        .join('\n');
      assert.match(planText, /(?:Scan|Update on|Aggregate|Sort|Result)/i, review.focus);
      const result = await db.query(review.query);
      assert.deepEqual(result.rows, review.expectedRows, `W29 D${dayIndex + 1}: ${review.query}`);
      assert.ok(/계획|플랜|EXPLAIN|ANALYZE/i.test(review.executionNote), review.focus);

      if (dayIndex === 4) {
        assert.deepEqual((await db.query('SELECT id, points FROM attempts WHERE id = 2;')).rows, [{ id: 2, points: 60 }], 'EXPLAIN ANALYZE UPDATE is rolled back');
        const repair = track.lessons[28].studyDays[4].exercises[2];
        assert.equal(gradeAnswer(repair, review.repairCode), true);
        assert.equal(gradeAnswer(repair, review.repairStarter), false);
      }
    } finally {
      await db.close();
    }
  }
});

test('PostgreSQL week thirty index definitions preserve query output and remove exact duplicate indexes', async () => {
  const reviews = postgresqlReviewedIntroDayCases[30];
  assert.equal(reviews.length, 5);
  for (const [dayIndex, review] of reviews.entries()) {
    const db = new PGlite();
    try {
      await seedPostgresqlReviewFixture(db);
      await db.exec(review.indexSetup);
      const result = await db.query(review.query);
      assert.deepEqual(result.rows, review.expectedRows, `W30 D${dayIndex + 1}: ${review.query}`);
      const indexes = await db.query("SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'attempts' ORDER BY indexname;");

      if (dayIndex === 4) {
        assert.equal(indexes.rows.filter((row) => /attempts_points/.test(row.indexname)).length, 2);
        const repair = track.lessons[29].studyDays[4].exercises[2];
        assert.equal(repair.type, 'repair-code');
        assert.equal(gradeAnswer(repair, review.repairCode), true);
        await db.exec(review.repairCode);
        const remaining = await db.query("SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'attempts' AND indexname LIKE 'attempts_points%';");
        assert.deepEqual(remaining.rows, [{ indexname: 'attempts_points_idx' }]);
      } else {
        assert.ok(indexes.rows.some((row) => row.indexdef.includes(review.indexSetup.match(/ON attempts \(([^;]+)\)/i)?.[1]?.split(',')[0] ?? '')));
        const explain = await db.query(`EXPLAIN ${review.planQuery}`);
        assert.ok(explain.rows.length > 0, review.focus);
      }
    } finally {
      await db.close();
    }
  }
});

test('PostgreSQL weeks thirty-one through thirty-three verify view, type, and parameter examples', async () => {
  for (const week of [31, 32, 33]) {
    const reviews = postgresqlReviewedIntroDayCases[week];
    assert.equal(reviews.length, 5, `week ${week}`);

    for (const [dayIndex, review] of reviews.entries()) {
      const db = new PGlite();
      try {
        await seedPostgresqlReviewFixture(db);
        if (review.setupSql) await db.exec(review.setupSql);

        if (week === 31 && dayIndex === 1) {
          await db.exec('BEGIN; UPDATE attempts SET points = 65 WHERE id = 2;');
          assert.deepEqual((await db.query(review.query)).rows, [{ id: 2, points: 65 }]);
          await db.exec('ROLLBACK;');
          assert.deepEqual((await db.query(review.query)).rows, [{ id: 2, points: 60 }]);
        } else {
          const result = await db.query(review.query, review.queryParams ?? []);
          assert.deepEqual(result.rows, review.expectedRows, `W${week} D${dayIndex + 1}: ${review.query}`);
        }

        if (week === 31 && dayIndex === 2) {
          const blockedUpdate = await db.query(review.faultyQuery);
          assert.equal(blockedUpdate.affectedRows, 0);
          assert.deepEqual((await db.query('SELECT active FROM attempts WHERE id = 2;')).rows, [{ active: true }]);
        }
        if (week === 31 && dayIndex === 3) {
          await assert.rejects(db.query(review.codeLines[0]), /permission denied/i);
          await assert.rejects(db.query('SELECT id FROM active_report_invoker ORDER BY id;'), /permission denied/i);
        }
        if (week === 31 && dayIndex === 4) {
          const repair = track.lessons[30].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          await assert.rejects(db.exec(review.codeLines[0]), /cannot change name of view column/i);
          await db.exec(review.repairCode);
          assert.deepEqual((await db.query(review.query)).rows, review.expectedRows);
        }
        if (week === 32 && dayIndex < 4) {
          const faulty = await db.query(review.faultyQuery);
          assert.notDeepEqual(faulty.rows, review.expectedRows, `W32 D${dayIndex + 1} faulty result`);
        }
        if (week === 33 && dayIndex === 0) {
          const unsafeSql = `SELECT id, name FROM learners WHERE name = '${review.queryParams[0]}' ORDER BY id;`;
          assert.deepEqual((await db.query(unsafeSql)).rows.map((row) => row.id), [1, 2, 3, 4]);
          assert.deepEqual((await db.query(review.query, review.queryParams)).rows, []);
        }
        if (week === 33 && dayIndex === 1) {
          assert.deepEqual((await db.query('SELECT COUNT(*)::INTEGER AS total FROM learners;')).rows, [{ total: 4 }]);
        }
        if (week === 33 && dayIndex === 4) {
          const repair = track.lessons[32].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          assert.deepEqual((await db.query(review.repairCode, ['민서'])).rows, [{ id: 1, name: '민서' }]);
          assert.deepEqual((await db.query(review.repairCode, ["' OR TRUE --"])).rows, []);
        }
      } finally {
        await db.close();
      }
    }
  }
});

test('PostgreSQL weeks thirty-four through thirty-six verify diagnostics, plans, and retry boundaries', async () => {
  for (const week of [34, 35, 36]) {
    const reviews = postgresqlReviewedIntroDayCases[week];
    assert.equal(reviews.length, 5, `week ${week}`);

    for (const [dayIndex, review] of reviews.entries()) {
      const db = new PGlite();
      try {
        await seedPostgresqlReviewFixture(db);
        if (review.setupSql) await db.exec(review.setupSql);
        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${week} D${dayIndex + 1}: ${review.query}`);

        if (week === 34 && dayIndex === 0) {
          await assert.rejects(db.query(review.codeLines[0]), (error) => error.code === '42601');
        }
        if (week === 34 && dayIndex === 1) {
          await assert.rejects(db.query(review.codeLines[0]), (error) => error.code === '23514');
          assert.deepEqual((await db.query('SELECT COUNT(*)::INTEGER AS total FROM diagnostic_scores;')).rows, [{ total: 1 }]);
        }
        if (week === 34 && dayIndex === 2) {
          await assert.rejects(db.query(review.codeLines[0]), (error) => error.code === '42703');
        }
        if (week === 34 && dayIndex === 3) {
          assert.deepEqual((await db.query(review.codeLines[0])).rows, []);
        }
        if (week === 34 && dayIndex === 4) {
          const repair = track.lessons[33].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          assert.deepEqual((await db.query(review.repairCode)).rows, review.expectedRows);
        }
        if (week === 35 && review.explainQuery) {
          const planRows = (await db.query(review.explainQuery)).rows;
          assert.ok(planRows.length > 0, review.focus);
          const plan = planRows.map((row) => row['QUERY PLAN']).join('\n');
          if (dayIndex === 2) assert.match(plan, /cost=/i);
          if (dayIndex === 3) assert.match(plan, /actual time=.*rows=/i);
          if (dayIndex === 1) {
            const indexes = await db.query("SELECT indexdef FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'attempts_points_diagnostic_idx';");
            assert.equal(indexes.rows.length, 1);
            assert.match(indexes.rows[0].indexdef, /\(points\)/i);
          }
        }
        if (week === 35 && dayIndex === 4) {
          const repair = track.lessons[34].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          await db.exec(review.repairCode);
          assert.deepEqual((await db.query('SELECT id, points FROM attempts WHERE id = 2;')).rows, [{ id: 2, points: 60 }]);
        }
        if (week === 36 && dayIndex === 0) {
          await db.exec('BEGIN;');
          assert.deepEqual((await db.query('SELECT id, points FROM attempts WHERE id = 2 FOR UPDATE;')).rows, [{ id: 2, points: 60 }]);
          await db.exec('UPDATE attempts SET points = 65 WHERE id = 2; ROLLBACK;');
          assert.deepEqual((await db.query('SELECT id, points FROM attempts WHERE id = 2;')).rows, [{ id: 2, points: 60 }]);
        }
        if (week === 36 && dayIndex === 2) {
          await db.exec('BEGIN;');
          await db.query(review.query);
          await db.exec('UPDATE lock_wallets SET balance = balance - 5 WHERE id = 1; UPDATE lock_wallets SET balance = balance + 5 WHERE id = 2; COMMIT;');
          assert.deepEqual((await db.query('SELECT id, balance FROM lock_wallets ORDER BY id;')).rows, [
            { id: 1, balance: 95 }, { id: 2, balance: 55 },
          ]);
        }
        if (week === 36 && dayIndex === 3) {
          assert.match(review.executionNote, /실행했다고 표현하지 않아요/);
          assert.deepEqual(result.rows, [{ sqlstate: '40P01', recovery: '전체 트랜잭션을 처음부터 재시도' }]);
        }
        if (week === 36 && dayIndex === 4) {
          const repair = track.lessons[35].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          assert.deepEqual((await db.query(review.query)).rows, []);
          assert.deepEqual((await db.query('SELECT balance FROM retry_wallet WHERE id = 1;')).rows, [{ balance: 105 }]);
          assert.deepEqual((await db.query('SELECT COUNT(*)::INTEGER AS total FROM applied_adjustments;')).rows, [{ total: 1 }]);
        }
      } finally {
        await db.close();
      }
    }
  }
});

test('PostgreSQL weeks thirty-seven through thirty-nine verify JSON, output contracts, and the integrated capstone', async () => {
  for (const week of [37, 38, 39]) {
    const reviews = postgresqlReviewedIntroDayCases[week];
    assert.equal(reviews.length, 5, `week ${week}`);

    for (const [dayIndex, review] of reviews.entries()) {
      const db = new PGlite();
      try {
        await seedPostgresqlReviewFixture(db);
        if (review.setupSql) await db.exec(review.setupSql);
        const result = await db.query(review.query);
        assert.deepEqual(result.rows, review.expectedRows, `W${week} D${dayIndex + 1}: ${review.query}`);

        if (review.explainQuery) {
          const planRows = (await db.query(review.explainQuery)).rows;
          assert.ok(planRows.length > 0, review.focus);
          assert.ok(planRows.every((row) => typeof row['QUERY PLAN'] === 'string'), review.focus);
        }
        if (week === 37 && dayIndex === 2) {
          const indexes = await db.query("SELECT indexdef FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'json_search_docs_metadata_gin';");
          assert.equal(indexes.rows.length, 1);
          assert.match(indexes.rows[0].indexdef, /USING gin \(metadata\)/i);
        }
        if (week === 38 && dayIndex === 1) {
          assert.deepEqual(result.rows, [{ row_count: 0, point_sum: null, point_average: null, display_sum: 0 }]);
        }
        if (week === 39 && dayIndex === 1) {
          const wrongJoin = await db.query(review.codeLines[0]);
          assert.equal(wrongJoin.rows[0].name, '하린');
          assert.notEqual(wrongJoin.rows[0].name, '준');
        }
        if (week === 39 && dayIndex === 2) {
          const inflated = await db.query(review.codeLines[0]);
          assert.deepEqual(inflated.rows, [{ id: 1, points_total: 140 }]);
        }
        if (week === 39 && dayIndex === 4) {
          const repair = track.lessons[38].studyDays[4].exercises[2];
          assert.equal(gradeAnswer(repair, review.repairCode), true);
          assert.deepEqual((await db.query(review.repairCode)).rows, review.expectedRows);
        }
      } finally {
        await db.close();
      }
    }
  }
});

test('PostgreSQL week twenty-four repair enforces primary key, foreign key, NOT NULL, and CHECK rules', async () => {
  const review = postgresqlReviewedIntroDayCases[24][4];
  const invalidDb = new PGlite();
  const validDb = new PGlite();
  try {
    for (const db of [invalidDb, validDb]) {
      await db.exec(problems[0].database.setup);
      await db.exec("INSERT INTO learners (id, name, cohort) VALUES (1, '민서', 'A'), (2, '준', 'B');");
    }

    await invalidDb.exec(review.repairStarter);
    await invalidDb.exec('INSERT INTO progress_checks (learner_id, points) VALUES (1, NULL), (1, 10);');
    assert.equal((await invalidDb.query('SELECT COUNT(*)::INTEGER AS total FROM progress_checks;')).rows[0].total, 2);

    await validDb.exec(review.repairCode);
    await validDb.exec('INSERT INTO progress_checks (learner_id, points) VALUES (1, 10);');
    await assert.rejects(validDb.query('INSERT INTO progress_checks (learner_id, points) VALUES (1, 20);'));
    await assert.rejects(validDb.query('INSERT INTO progress_checks (learner_id, points) VALUES (2, NULL);'));
    await assert.rejects(validDb.query('INSERT INTO progress_checks (learner_id, points) VALUES (2, -1);'));
    await assert.rejects(validDb.query('INSERT INTO progress_checks (learner_id, points) VALUES (99, 10);'));
    assert.deepEqual((await validDb.query('SELECT learner_id, points FROM progress_checks ORDER BY learner_id;')).rows, [
      { learner_id: 1, points: 10 },
    ]);
  } finally {
    await invalidDb.close();
    await validDb.close();
  }
});

test('all 195 PostgreSQL teaching examples parse and run against the documented fixture schema', async () => {
  const db = new PGlite();
  try {
    await db.exec(problems[0].database.setup);
    for (const [weekIndex, plan] of postgresqlCoursePlans.entries()) {
      for (let day = 1; day <= 5; day += 1) {
        const query = plan.query.replaceAll('__DAY__', String(day));
        const result = await db.query(query);
        assert.ok(Array.isArray(result.rows), `week ${weekIndex + 1}, day ${day}: ${query}`);
      }
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL problem bank has 50 reviewed executable questions in five levels', () => {
  assert.equal(problems.length, 50);
  assert.deepEqual(Object.fromEntries(levels.map((level) => [
    level,
    problems.filter((problem) => problem.level === level).length,
  ])), { 입문: 10, 기초: 10, 중급: 10, 고급: 10, 실전: 10 });

  const knownTopicIds = new Set(tracks.flatMap((item) => item.topics.map((topic) => topic.id)));
  assert.deepEqual(validateCodingProblemBank(codingProblems, { knownTopicIds }), { valid: true, errors: [] });
  for (const [index, problem] of problems.entries()) {
    assert.equal(problem.versionContext, '기준 문서는 PostgreSQL 18.6, PostgreSQL 19 RC 1(2026-10-15)은 정식 배포 전 후보, 실행기는 PGlite 0.5.8 / PostgreSQL 18.3', problem.id);
    assert.equal(problem.runtime.adapterId, 'postgresql-query-v1', problem.id);
    assert.equal(problem.review.status, 'approved', problem.id);
    assert.equal(problem.grading.tests.length, 6, problem.id);
    assert.equal(problem.examples.length, 3, problem.id);
    assert.ok(problem.hints.length >= 3, problem.id);
    assert.ok(problem.commonMistakes.length >= 2, problem.id);
    assert.ok(problem.sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/sql.html'), problem.id);
    assert.ok(problem.sources.some((source) => source.url === 'https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/'), problem.id);
    assert.deepEqual(problem.prerequisiteIds, index ? [problems[index - 1].id] : [], problem.id);
  }
});

test('PostgreSQL problems 1–25 state the real task, trace examples, and keep the answer out of the editor starter', async () => {
  const batch = problems.slice(0, 25);
  assert.equal(batch.length, 25);

  for (const problem of problems) {
    assert.ok(problem.starterCode.trim(), `${problem.id} needs a starter prompt`);
    assert.ok(problem.starterCode.split('\n').every((line) => line.trim().startsWith('--')), `${problem.id} starter must not contain the reference SQL`);
    assert.match(problem.starterCode, /TODO/, `${problem.id} needs a clear place to start`);
  }

  for (const problem of batch) {
    const expectedReviewDate = /postgresql-topic-counts-0[12]$/.test(problem.id) ? '2026-10-23' : '2026-10-16';
    assert.equal(problem.review.reviewedAt, expectedReviewDate, problem.id);
    assert.doesNotMatch(problem.statement, /테이블 구조와 각 테스트 입력을 이용해 요구된 행만 반환/, problem.id);
    assert.ok(problem.examples.every((example) => example.explanation.includes('결과:')), `${problem.id} examples need result reasoning`);
    assert.ok(problem.constraints.some((constraint) => constraint.includes('실행기가 준비')), problem.id);
  }

  const find = (id) => batch.find((problem) => problem.id === id);
  assert.match(find('postgresql-filter-points-01').statement, /40점 이상/);
  assert.match(find('postgresql-filter-points-03').statement, /60점 이상 100점 이하/);
  assert.match(find('postgresql-top-scores-02').statement, /active가 TRUE/);
  assert.match(find('postgresql-top-scores-03').statement, /60점 이상/);
  assert.match(find('postgresql-learner-totals-03').statement, /selected_attempts CTE/);
  assert.equal(find('postgresql-topic-counts-01').title, '입문 · 주제별 기록 수 세기');
  assert.match(find('postgresql-topic-counts-01').statement, /시도 행 수/);
  assert.match(find('postgresql-topic-counts-01').statement, /attempt_count/);
  assert.deepEqual(find('postgresql-topic-counts-01').examples[0].expected, [
    { topic: 'js', attempt_count: 2 },
    { topic: 'sql', attempt_count: 1 },
  ]);
  assert.match(find('postgresql-topic-counts-01').examples[0].explanation, /js=2건/);
  assert.match(find('postgresql-topic-counts-02').statement, /attempt_count/);
  assert.match(find('postgresql-topic-counts-03').statement, /learner_count/);
  assert.match(find('postgresql-topic-counts-03').statement, /서로 다른 학습자 수/);
  assert.match(find('postgresql-topic-counts-03').examples[2].explanation, /db=1명/);
  assert.match(find('postgresql-learner-join-03').statement, /cohort가 C가 아닌/);
  assert.match(find('postgresql-left-join-count-02').requirements.join(' '), /조건을 조인의 ON 절/);
  assert.ok(find('postgresql-top-scores-01').sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/queries-limit.html'));
  assert.ok(find('postgresql-learner-totals-01').sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/functions-aggregate.html'));
  assert.ok(find('postgresql-learner-join-01').sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/queries-table-expressions.html'));

  const db = new PGlite();
  try {
    for (const problem of batch) {
      const database = {
        ...problem.database,
        setup: `DROP TABLE IF EXISTS attempt_tags, tags, attempts, learners;\n${problem.database.setup}`,
      };
      const result = await evaluatePostgresSource(db, {
        database,
        tests: problem.grading.tests,
        code: problem.solution.referenceImplementation,
      });
      assert.equal(result.passed, true, `${problem.id}: ${JSON.stringify(result.results)}`);
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL problems 26–50 teach the advanced cases and match their examples to executable answers', async () => {
  const batch = problems.slice(25, 50);
  assert.equal(batch.length, 25);

  for (const problem of batch) {
    assert.equal(problem.review.status, 'approved', problem.id);
    assert.equal(problem.review.reviewedAt, '2026-10-23', problem.id);
    assert.ok(problem.sources.every((source) => source.reviewedAt === '2026-10-23'), problem.id);
    assert.doesNotMatch(problem.statement, /테이블 구조와 각 테스트 입력을 이용해 요구된 행만 반환/, problem.id);
    assert.ok(problem.requirements.length >= 3, problem.id);
    assert.ok(problem.hints.length >= 3, problem.id);
    assert.ok(problem.commonMistakes.length >= 2, problem.id);
    assert.ok(problem.examples.every((example) => example.explanation.includes('결과:')), `${problem.id} examples need result reasoning`);
    assert.ok(problem.examples.every((example) => example.expected.length >= 0), `${problem.id} examples need expected rows`);
  }

  const find = (id) => batch.find((problem) => problem.id === id);
  assert.match(find('postgresql-filter-points-05').statement, /2026-04-01 당일 또는 그 이후/);
  assert.ok(find('postgresql-filter-points-05').examples.some((example) => example.expected.length > 0));
  assert.match(find('postgresql-top-scores-05').statement, /topic마다 점수가 가장 높은 행을 하나씩/);
  assert.match(find('postgresql-top-scores-05').solution.referenceImplementation, /DISTINCT ON \(topic\)/);
  assert.match(find('postgresql-learner-totals-05').statement, /활성 기록이 2건 이상/);
  assert.match(find('postgresql-topic-counts-05').statement, /고유 학습자가 2명 이상/);
  assert.match(find('postgresql-learner-join-05').statement, /name, cohort, topic, points/);
  assert.match(find('postgresql-left-join-count-05').requirements.join(' '), /cohort 열도 반환/);
  assert.match(find('postgresql-above-average-05').statement, /100점 이하/);
  assert.match(find('postgresql-score-bands-05').statement, /bonus_points가 NULL이면 unreviewed/);
  assert.match(find('postgresql-cohort-totals-05').statement, /학습자가 2명 이상인 기수/);
  assert.match(find('postgresql-topic-ranking-04').solution.referenceImplementation, /RANK\(\)/);
  assert.match(find('postgresql-topic-ranking-04').statement, /다음 순위 번호는 동점 수만큼 건너뜁니다/);
  assert.ok(find('postgresql-topic-ranking-04').examples.some((example) => example.expected.some((row) => row.id === 5 && row.place === 3)));
  assert.match(find('postgresql-topic-ranking-05').solution.referenceImplementation, /DENSE_RANK\(\)/);
  assert.match(find('postgresql-topic-ranking-05').statement, /다음 순위는 건너뛰지 않습니다/);
  assert.ok(find('postgresql-topic-ranking-05').examples.some((example) => example.expected.some((row) => row.id === 5 && row.place === 2)));

  const db = new PGlite();
  try {
    for (const problem of batch) {
      const database = {
        ...problem.database,
        setup: `DROP TABLE IF EXISTS attempt_tags, tags, attempts, learners;\n${problem.database.setup}`,
      };
      const result = await evaluatePostgresSource(db, {
        database,
        tests: problem.grading.tests,
        code: problem.solution.referenceImplementation,
      });
      assert.equal(result.results.length, 6, problem.id);
      assert.equal(result.passed, true, `${problem.id}: ${JSON.stringify(result.results)}`);
      for (const example of problem.examples) {
        assert.ok(problem.grading.tests.some((testCase) => testCase.input === example.input && sameExerciseValue(testCase.expected, example.expected)), `${problem.id} example must come from a public case`);
      }
    }
  } finally {
    await db.close();
  }
});

test('all 300 SQL public cases match when the reference queries run on PostgreSQL 18.3', async () => {
  const db = new PGlite();
  try {
    const version = await db.query('SELECT version() AS version');
    assert.match(version.rows[0].version, /PostgreSQL 18\.3/);

    for (const problem of problems) {
      const database = {
        ...problem.database,
        setup: `DROP TABLE IF EXISTS attempt_tags, tags, attempts, learners;\n${problem.database.setup}`,
      };
      const result = await evaluatePostgresSource(db, {
        database,
        tests: problem.grading.tests,
        code: problem.solution.referenceImplementation,
      });
      assert.equal(result.results.length, problem.grading.tests.length, problem.id);
      assert.equal(result.passed, true, `${problem.id}: ${JSON.stringify(result.results)}`);
      result.results.forEach((item, index) => {
        assert.ok(sameExerciseValue(item.actual, problem.grading.tests[index].expected), `${problem.id} case ${index + 1}`);
      });
    }
  } finally {
    await db.close();
  }
});

test('PostgreSQL grading rejects multiple statements, writes, and oversized result sets', async () => {
  const db = new PGlite();
  try {
    const problem = problems[0];
    const database = {
      ...problem.database,
      setup: `${problem.database.setup}`,
    };
    const testCase = [{ input: '', expected: [] }];
    for (const code of [
      'SELECT 1 AS value; SELECT 2 AS value',
      'UPDATE attempts SET points = 0 RETURNING id',
      'SELECT generate_series AS id FROM generate_series(1, 101)',
    ]) {
      const result = await evaluatePostgresSource(db, { database, tests: testCase, code });
      assert.equal(result.passed, false, code);
      assert.equal(result.results.length, 1, code);
      assert.equal(result.results[0].actualAvailable, false, code);
      assert.ok(result.results[0].error, code);
      await db.exec('DROP TABLE IF EXISTS attempt_tags, tags, attempts, learners;');
    }
  } finally {
    await db.close();
  }
});
