import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import { gradeAnswer } from '../src/grading.js';
import { findLessonForExercise, getCurrentExerciseId, getExercise, tracks } from '../src/content.js';
import { typescriptReviewedOpeningWeeks } from '../src/curriculum-typescript-w1-w3-reviewed.js';
import { typescriptReviewedWeeksFourToSix } from '../src/curriculum-typescript-w4-w6-reviewed.js';
import { typescriptReviewedWeeksSevenToNine } from '../src/curriculum-typescript-w7-w9-reviewed.js';
import { typescriptReviewedWeeksTenToTwelve } from '../src/curriculum-typescript-w10-w12-reviewed.js';
import { typescriptReviewedWeeksThirteenToFifteen } from '../src/curriculum-typescript-w13-w15-reviewed.js';
import { typescriptReviewedWeeksSixteenToEighteen } from '../src/curriculum-typescript-w16-w18-reviewed.js';
import { typescriptReviewedWeeksNineteenToTwentyOne } from '../src/curriculum-typescript-w19-w21-reviewed.js';
import { typescriptReviewedWeeksTwentyTwoToTwentyFour } from '../src/curriculum-typescript-w22-w24-reviewed.js';
import { typescriptReviewedWeeksTwentyFiveToTwentySix } from '../src/curriculum-typescript-w25-w26-reviewed.js';

const track = tracks.find((item) => item.id === 'typescript');

test('TypeScript course is a complete, sequential 26-week path with 130 sessions and 390 questions', () => {
  assert.ok(track);
  assert.equal(track.lessons.length, 26);
  assert.equal(track.course.sessions, 130);
  assert.equal(track.course.questions, 390);
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 26 }, (_, index) => index + 1));
  assert.deepEqual(track.topics.map((topic) => topic.stage), [1, 2, 3, 4, 5, 6]);
  assert.equal(new Set(track.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id))).size, 390);
  assert.deepEqual(track.lessons.map((lesson) => lesson.week), Array.from({ length: 26 }, (_, index) => index + 1));
});

test('each TypeScript lesson has five unique examples and three distinct, gradeable questions per day', () => {
  for (const lesson of track.lessons) {
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);
    for (const [index, day] of lesson.studyDays.entries()) {
      assert.equal(day.exercises.length, 3, lesson.id);
      assert.equal(gradeAnswer(day.exercises[0], day.exercises[0].answer), true, day.exercises[0].id);
      assert.equal(day.exercises[1].type, 'short-answer', day.exercises[1].id);
      const correction = day.exercises[2];
      if (index === 4) {
        assert.equal(correction.type, 'repair-code', correction.id);
        assert.equal(gradeAnswer(correction, correction.starterCode), false, correction.id);
        const accepted = correction.solutionPatterns[0].slice(1, -1).replaceAll('\\', '');
        assert.equal(gradeAnswer(correction, accepted), true, correction.id);
      } else {
        assert.equal(correction.type, 'locate-error', correction.id);
        assert.equal(gradeAnswer(correction, correction.answerLines), true, correction.id);
      }
    }
  }
});

test('TypeScript daily trace answers match the actual output of all 130 examples', async () => {
  for (const lesson of track.lessons) {
    for (const day of lesson.studyDays) {
      const exercise = day.exercises[1];
      const wrapped = 'async function __curriculumExample() {\n' + day.example + '\n}\n__curriculumExample();';
      const compiled = ts.transpileModule(wrapped, {
        reportDiagnostics: true,
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      });
      const errors = (compiled.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      assert.deepEqual(errors, [], exercise.id + ' example must transpile');

      const output = [];
      const context = { console: { log: (...values) => output.push(values.map((value) => String(value)).join(' ')) } };
      const pending = vm.runInNewContext(compiled.outputText, context, { timeout: 1000 });
      await pending;

      const actualOutput = output.join(' ');
      assert.equal(exercise.answerNormalization, 'exact-output', exercise.id);
      assert.equal(actualOutput.trim(), exercise.acceptedAnswers[0].trim(), exercise.id + ' expected output');
      assert.equal(gradeAnswer(exercise, actualOutput), true, exercise.id + ' actual output is accepted');
    }
  }
});

test('versioned TypeScript trace ids keep saved progress linked to current questions', () => {
  const traces = track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises.filter((exercise) => exercise.title.endsWith('결과 추적'))));
  assert.equal(traces.length, 130);
  for (const exercise of traces) {
    const reissued = /ts-w(?:22|23|24)-/.test(exercise.id);
    assert.match(exercise.id, reissued ? /-trace-v4$/ : /-trace-v3$/);
    assert.ok(exercise.legacyIds.length >= 1 && exercise.legacyIds.length <= (reissued ? 3 : 2));
    for (const legacyId of exercise.legacyIds) {
      assert.match(legacyId, /^ts-w\d+-d[1-5](-v2-trace|-trace-v3|-trace)$/);
      assert.equal(getCurrentExerciseId(legacyId), exercise.id);
      assert.equal(getExercise(legacyId), exercise);
      assert.equal(findLessonForExercise(legacyId).id, findLessonForExercise(exercise.id).id);
    }
  }
});

test('TypeScript final-week examples and answers match each review topic', () => {
  const lesson = track.lessons.find((item) => item.week === 26);
  const reviewedDays = typescriptReviewedWeeksTwentyFiveToTwentySix[26];
  for (const [index, day] of lesson.studyDays.entries()) {
    const choice = day.exercises[0];
    assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, reviewedDays[index].rule, day.title);
    assert.equal(day.exercises[1].acceptedAnswers[0], reviewedDays[index].answer, day.title);
  }
  assert.match(lesson.studyDays[2].exercises[2].prompt, /키보드 조작/);
  assert.match(lesson.studyDays[3].exercises[2].prompt, /버전과 실행 범위/);
});

test('TypeScript weeks one through three teach distinct daily cases with versioned, gradeable questions', () => {
  for (const week of [1, 2, 3]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedOpeningWeeks[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, day.id + ' objective');
      assert.equal(day.example, reviewed.example, day.id + ' example');

      const [concept, trace, repairOrLocate] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.match(trace.id, /-trace-v3$/, trace.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer meaning');
      assert.equal(concept.hint, reviewed.conceptHint, concept.id + ' topic-specific hint');
      assert.notEqual(concept.hint, '실제 값의 타입과 선언한 타입을 대조하세요.', concept.id + ' no generic hint');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id);
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }

      assert.equal(trace.acceptedAnswers[0], reviewed.answer, trace.id);
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);

      if (index === 4) {
        assert.equal(repairOrLocate.type, 'repair-code', repairOrLocate.id);
        assert.equal(repairOrLocate.starterCode, reviewed.starter, repairOrLocate.id);
        assert.equal(gradeAnswer(repairOrLocate, reviewed.starter), false, repairOrLocate.id);
        assert.equal(gradeAnswer(repairOrLocate, reviewed.solution), true, repairOrLocate.id);
        assert.deepEqual(repairOrLocate.acceptanceCriteria.examples, [{ input: reviewed.starter, output: reviewed.solution }], repairOrLocate.id);
        assert.equal(repairOrLocate.acceptanceCriteria.tests[0].input, reviewed.starter, repairOrLocate.id);
        assert.equal(repairOrLocate.acceptanceCriteria.tests[1].input, reviewed.solution, repairOrLocate.id);
      } else {
        assert.equal(repairOrLocate.type, 'locate-error', repairOrLocate.id);
        assert.match(repairOrLocate.id, /-v2-locate$/, repairOrLocate.id);
        assert.deepEqual(repairOrLocate.answerLines, [reviewed.line], repairOrLocate.id);
        assert.equal(gradeAnswer(repairOrLocate, [reviewed.line]), true, repairOrLocate.id);
        assert.equal(gradeAnswer(repairOrLocate, [reviewed.line + 1]), false, repairOrLocate.id);
      }
    }
  }

  assert.match(typescriptReviewedOpeningWeeks[1][2].example, /null.*undefined/s);
  assert.match(typescriptReviewedOpeningWeeks[1][3].example, /as number/);
  assert.match(typescriptReviewedOpeningWeeks[2][3].example, /value: unknown/);
  assert.match(typescriptReviewedOpeningWeeks[3][3].example, /prefix\?: string/);
  assert.match(typescriptReviewedOpeningWeeks[3][4].example, /prefix = "안녕하세요"/);
});

test('TypeScript weeks four through six teach distinct arrays, object contracts, and union cases', () => {
  for (const week of [4, 5, 6]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksFourToSix[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');

      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.match(trace.id, /-trace-v3$/, trace.id);
      assert.match(locateOrRepair.id, /-v2-(locate|repair)$/, locateOrRepair.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      assert.equal(concept.hint, reviewed.conceptHint, concept.id + ' topic-specific hint');
      assert.equal(new Set(concept.choices.map((option) => option.text)).size, concept.choices.length, concept.id + ' unique choices');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }

      assert.equal(trace.acceptedAnswers[0], reviewed.answer, trace.id + ' trace key');
      assert.ok(trace.hint.length >= 15, trace.id + ' useful hint');
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);

      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id + ' starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
        assert.deepEqual(locateOrRepair.acceptanceCriteria.examples, [{ input: reviewed.starter, output: reviewed.solution }], locateOrRepair.id);
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id + ' faulty line');
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id + ' diagnosis');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  const correctPositions = [4, 5, 6].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => correctPositions.filter((position) => position === letter).length), [5, 5, 5]);
});

test('TypeScript weeks seven through nine connect narrowing, exhaustive states, and generics to distinct cases', () => {
  for (const week of [7, 8, 9]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksSevenToNine[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');

      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.match(trace.id, /-trace-v3$/, trace.id);
      assert.match(locateOrRepair.id, /-v2-(locate|repair)$/, locateOrRepair.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      assert.equal(new Set(concept.choices.map((option) => option.text)).size, concept.choices.length, concept.id + ' unique choices');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }

      assert.equal(trace.acceptedAnswers[0], reviewed.answer, trace.id + ' trace key');
      assert.ok(trace.hint.length >= 15, trace.id + ' useful hint');
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);

      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id + ' starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id + ' faulty line');
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id + ' diagnosis');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  const correctPositions = [7, 8, 9].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => correctPositions.filter((position) => position === letter).length), [5, 5, 5]);

  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext };
  const bugSources = new Map();
  const expectedLines = new Map();
  for (const week of [7, 8, 9]) {
    for (const [index, reviewed] of typescriptReviewedWeeksSevenToNine[week].entries()) {
      if (week === 7 && index === 3) continue;
      const fileName = ts.sys.resolvePath('typescript-quality-bug-' + week + '-' + (index + 1) + '.ts');
      const key = fileName.replaceAll('\\', '/');
      bugSources.set(key, reviewed.bug.join('\n') + '\nexport {};');
      expectedLines.set(key, reviewed.line);
    }
  }
  const host = ts.createCompilerHost(options);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  const getSourceFile = host.getSourceFile.bind(host);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = bugSources.get(keyFor(fileName));
    return source === undefined
      ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  host.readFile = (fileName) => bugSources.get(keyFor(fileName)) ?? readFile(fileName);
  host.fileExists = (fileName) => bugSources.has(keyFor(fileName)) || fileExists(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...bugSources.keys()], options, host))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const [fileName, expectedLine] of expectedLines) {
    const errorLines = diagnostics
      .filter((diagnostic) => keyFor(diagnostic.file.fileName) === fileName)
      .map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    assert.ok(errorLines.includes(expectedLine), fileName + ' should report its faulty line ' + expectedLine + ', got ' + errorLines.join(','));
  }

  const emptyNameBug = typescriptReviewedWeeksSevenToNine[7][3].bug.join('\n') + '\nconsole.log(displayName(""));';
  const emittedBug = ts.transpileModule(emptyNameBug, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const bugOutput = [];
  vm.runInNewContext(emittedBug, { console: { log: (value) => bugOutput.push(value) } }, { timeout: 1000 });
  assert.deepEqual(bugOutput, ['이름 없음'], 'truthiness bug must reproduce the empty-string regression');
});

test('TypeScript weeks ten through twelve teach constraints, utility transforms, and conditional types in order', () => {
  for (const week of [10, 11, 12]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksTenToTwelve[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.match(trace.id, /-trace-v3$/, trace.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.equal(trace.acceptedAnswers[0], reviewed.answer, trace.id);
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);

      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id);
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  assert.match(typescriptReviewedWeeksTenToTwelve[11][1].example, /Pick<Profile, "name" \| "level">/);
  assert.doesNotMatch(typescriptReviewedWeeksTenToTwelve[11][1].example, /Pick<Profile,[^>]*token/);
  assert.match(typescriptReviewedWeeksTenToTwelve[11][2].example, /Omit<Profile, "token">/);
  assert.match(typescriptReviewedWeeksTenToTwelve[12][3].example, /Promise<infer Value>/);

  const correctPositions = [10, 11, 12].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => correctPositions.filter((position) => position === letter).length), [5, 5, 5]);

  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext };
  const bugSources = new Map();
  const expectedLines = new Map();
  for (const week of [10, 11, 12]) {
    for (const [index, reviewed] of typescriptReviewedWeeksTenToTwelve[week].entries()) {
      if (week === 11 && (index === 1 || index === 2)) continue;
      const fileName = ts.sys.resolvePath('typescript-quality-bug-' + week + '-' + (index + 1) + '.ts');
      const key = fileName.replaceAll('\\', '/');
      bugSources.set(key, reviewed.bug.join('\n') + '\nexport {};');
      expectedLines.set(key, reviewed.line);
    }
  }
  const host = ts.createCompilerHost(options);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  const getSourceFile = host.getSourceFile.bind(host);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = bugSources.get(keyFor(fileName));
    return source === undefined
      ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  host.readFile = (fileName) => bugSources.get(keyFor(fileName)) ?? readFile(fileName);
  host.fileExists = (fileName) => bugSources.has(keyFor(fileName)) || fileExists(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...bugSources.keys()], options, host))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const [fileName, expectedLine] of expectedLines) {
    const errorLines = diagnostics
      .filter((diagnostic) => keyFor(diagnostic.file.fileName) === fileName)
      .map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    assert.ok(errorLines.includes(expectedLine), fileName + ' should report its faulty line ' + expectedLine + ', got ' + errorLines.join(','));
  }
});

test('TypeScript weeks thirteen through fifteen connect modules, async results, and class contracts to distinct cases', () => {
  for (const week of [13, 14, 15]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksThirteenToFifteen[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);
    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.deepEqual(trace.acceptedAnswers, [reviewed.answer], trace.id);
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);
      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts full repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id);
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  const positions = [13, 14, 15].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => positions.filter((position) => position === letter).length), [5, 5, 5]);

  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
  const moduleSources = new Map([
    [ts.sys.resolvePath('typescript-reviewed-math.ts').replaceAll('\\', '/'), 'export function add(a: number, b: number) { return a + b; }'],
    [ts.sys.resolvePath('typescript-reviewed-lesson.ts').replaceAll('\\', '/'), 'export default function createLesson() { return "Modules"; }'],
    [ts.sys.resolvePath('typescript-reviewed-app-named.ts').replaceAll('\\', '/'), 'import { sum } from "./typescript-reviewed-math.js";\nconsole.log(sum(1, 2));'],
    [ts.sys.resolvePath('typescript-reviewed-app-default.ts').replaceAll('\\', '/'), 'import { createLesson } from "./typescript-reviewed-lesson.js";\nconsole.log(createLesson());'],
  ]);
  const moduleHost = ts.createCompilerHost(options);
  const moduleGetSourceFile = moduleHost.getSourceFile.bind(moduleHost);
  const moduleReadFile = moduleHost.readFile.bind(moduleHost);
  const moduleFileExists = moduleHost.fileExists.bind(moduleHost);
  const moduleKeyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  moduleHost.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = moduleSources.get(moduleKeyFor(fileName));
    return source === undefined ? moduleGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  moduleHost.readFile = (fileName) => moduleSources.get(moduleKeyFor(fileName)) ?? moduleReadFile(fileName);
  moduleHost.fileExists = (fileName) => moduleSources.has(moduleKeyFor(fileName)) || moduleFileExists(fileName);
  const moduleProgram = ts.createProgram([...moduleSources.keys()], options, moduleHost);
  const moduleErrors = ts.getPreEmitDiagnostics(moduleProgram).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const appName of ['typescript-reviewed-app-named.ts', 'typescript-reviewed-app-default.ts']) {
    const appPath = ts.sys.resolvePath(appName).replaceAll('\\', '/');
    const errors = moduleErrors.filter((diagnostic) => moduleKeyFor(diagnostic.file.fileName) === appPath);
    assert.ok(errors.some((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line === 0), appName + ' should diagnose the invalid imported name');
  }

  const bugSources = new Map();
  const expectedLines = new Map();
  for (const week of [13, 14, 15]) {
    for (const [index, reviewed] of typescriptReviewedWeeksThirteenToFifteen[week].entries()) {
      if (week === 13 && index < 2) continue;
      const fileName = ts.sys.resolvePath('typescript-quality-bug-' + week + '-' + (index + 1) + '.ts');
      const key = fileName.replaceAll('\\', '/');
      bugSources.set(key, reviewed.bug.join('\n') + '\nexport {};');
      expectedLines.set(key, reviewed.line);
    }
  }
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = bugSources.get(keyFor(fileName));
    return source === undefined ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  host.readFile = (fileName) => bugSources.get(keyFor(fileName)) ?? readFile(fileName);
  host.fileExists = (fileName) => bugSources.has(keyFor(fileName)) || fileExists(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...bugSources.keys()], options, host))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const [fileName, expectedLine] of expectedLines) {
    const errorLines = diagnostics.filter((diagnostic) => keyFor(diagnostic.file.fileName) === fileName)
      .map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    assert.ok(errorLines.includes(expectedLine), fileName + ' should report its faulty line ' + expectedLine + ', got ' + errorLines.join(','));
  }
});

test('TypeScript weeks sixteen through eighteen connect guards, untrusted input, and overloads to distinct cases', () => {
  for (const week of [16, 17, 18]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksSixteenToEighteen[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);
    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.deepEqual(trace.acceptedAnswers, [reviewed.answer], trace.id);
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);
      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts full repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id);
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id);
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  const positions = [16, 17, 18].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => positions.filter((position) => position === letter).length), [5, 5, 5]);

  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
  const bugSources = new Map();
  const expectedLines = new Map();
  for (const week of [16, 17, 18]) {
    for (const [index, reviewed] of typescriptReviewedWeeksSixteenToEighteen[week].entries()) {
      if ((week === 16 && index === 3) || (week === 17 && (index === 1 || index === 2))) continue;
      const fileName = ts.sys.resolvePath('typescript-quality-bug-' + week + '-' + (index + 1) + '.ts');
      const key = fileName.replaceAll('\\', '/');
      bugSources.set(key, reviewed.bug.join('\n') + '\nexport {};');
      expectedLines.set(key, reviewed.line);
    }
  }
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = bugSources.get(keyFor(fileName));
    return source === undefined ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  host.readFile = (fileName) => bugSources.get(keyFor(fileName)) ?? readFile(fileName);
  host.fileExists = (fileName) => bugSources.has(keyFor(fileName)) || fileExists(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...bugSources.keys()], options, host))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const [fileName, expectedLine] of expectedLines) {
    const errorLines = diagnostics.filter((diagnostic) => keyFor(diagnostic.file.fileName) === fileName)
      .map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    assert.ok(errorLines.includes(expectedLine), fileName + ' should report its faulty line ' + expectedLine + ', got ' + errorLines.join(','));
  }

  const falsePredicate = typescriptReviewedWeeksSixteenToEighteen[16][3].bug.join('\n');
  const falsePredicateJs = ts.transpileModule(falsePredicate, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  assert.throws(() => vm.runInNewContext(falsePredicateJs, { console }, { timeout: 1000 }), /toFixed/, 'a false type predicate must reproduce its runtime failure');

  const assertionBug = typescriptReviewedWeeksSixteenToEighteen[17][2].bug.join('\n') + '\nconsole.log(typeof count);';
  const assertionJs = ts.transpileModule(assertionBug, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const outputs = [];
  vm.runInNewContext(assertionJs, { console: { log: (value) => outputs.push(value) } }, { timeout: 1000 });
  assert.deepEqual(outputs, ['171', 'string'], 'a type assertion must not change the runtime string');
});

test('TypeScript weeks nineteen through twenty-one teach declarations, null safety, and separate test evidence', () => {
  for (const week of [19, 20, 21]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksNineteenToTwentyOne[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.deepEqual(trace.acceptedAnswers, [reviewed.answer], trace.id);
      assert.ok(trace.hint.length >= 15, trace.id + ' useful hint');
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);
      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id + ' starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id + ' faulty line');
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id + ' diagnosis');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }

  const positions = [19, 20, 21].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => positions.filter((position) => position === letter).length), [5, 5, 5]);

  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
  const bugSources = new Map();
  const expectedLines = new Map();
  for (const week of [19, 20, 21]) {
    for (const [index, reviewed] of typescriptReviewedWeeksNineteenToTwentyOne[week].entries()) {
      if ((week === 19 && (index === 0 || index === 2 || index === 3))
        || (week === 20 && (index === 3 || index === 4))
        || (week === 21 && (index === 0 || index === 1 || index === 2 || index === 3 || index === 4))) continue;
      const fileName = ts.sys.resolvePath('typescript-quality-bug-' + week + '-' + (index + 1) + '.ts');
      const key = fileName.replaceAll('\\', '/');
      bugSources.set(key, reviewed.bug.join('\n') + '\nexport {};');
      expectedLines.set(key, reviewed.line);
    }
  }
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = bugSources.get(keyFor(fileName));
    return source === undefined ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  host.readFile = (fileName) => bugSources.get(keyFor(fileName)) ?? readFile(fileName);
  host.fileExists = (fileName) => bugSources.has(keyFor(fileName)) || fileExists(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...bugSources.keys()], options, host))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  for (const [fileName, expectedLine] of expectedLines) {
    const errorLines = diagnostics.filter((diagnostic) => keyFor(diagnostic.file.fileName) === fileName)
      .map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    assert.ok(errorLines.includes(expectedLine), fileName + ' should report its faulty line ' + expectedLine + ', got ' + errorLines.join(','));
  }

  const jsOptions = { allowJs: true, checkJs: true, noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022 };
  const jsFiles = new Map();
  const jsBugLines = new Map();
  for (const [index, reviewed] of typescriptReviewedWeeksNineteenToTwentyOne[19].entries()) {
    if (index === 2 || index === 3) {
      jsFiles.set(ts.sys.resolvePath('typescript-reviewed-js-' + index + '.js').replaceAll('\\', '/'), reviewed.example);
      jsFiles.set(ts.sys.resolvePath('typescript-reviewed-js-repair-' + index + '.js').replaceAll('\\', '/'), reviewed.solution);
      const bugFile = ts.sys.resolvePath('typescript-reviewed-js-bug-' + index + '.js').replaceAll('\\', '/');
      jsFiles.set(bugFile, reviewed.bug.join('\n'));
      jsBugLines.set(bugFile, reviewed.line);
    }
  }
  const jsHost = ts.createCompilerHost(jsOptions);
  const jsGetSourceFile = jsHost.getSourceFile.bind(jsHost);
  const jsReadFile = jsHost.readFile.bind(jsHost);
  const jsFileExists = jsHost.fileExists.bind(jsHost);
  jsHost.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = jsFiles.get(keyFor(fileName));
    return source === undefined ? jsGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true, ts.ScriptKind.JS);
  };
  jsHost.readFile = (fileName) => jsFiles.get(keyFor(fileName)) ?? jsReadFile(fileName);
  jsHost.fileExists = (fileName) => jsFiles.has(keyFor(fileName)) || jsFileExists(fileName);
  for (const fileName of jsFiles.keys()) {
    const fileDiagnostics = ts.getPreEmitDiagnostics(ts.createProgram([fileName], jsOptions, jsHost))
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
    if (jsBugLines.has(fileName)) {
      const errorLines = fileDiagnostics.map((diagnostic) => diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
      assert.ok(errorLines.includes(jsBugLines.get(fileName)), fileName + ' should report JavaScript contract fault on line ' + jsBugLines.get(fileName) + ', got ' + errorLines.join(','));
    } else {
      assert.deepEqual(fileDiagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), [], fileName + ' should pass checkJs');
    }
  }

  const packageRoot = ts.sys.resolvePath('node_modules/typescript-quality-lesson-package');
  const packageDts = ts.sys.resolvePath(packageRoot + '/index.d.ts');
  const packageConsumer = ts.sys.resolvePath('typescript-quality-package-consumer.ts');
  const packageSources = new Map([
    [keyFor(ts.sys.resolvePath(packageRoot + '/package.json')), JSON.stringify({ name: 'typescript-quality-lesson-package', type: 'module', types: './index.d.ts', exports: { '.': { types: './index.d.ts', import: './index.js', default: './index.js' } } })],
    [keyFor(packageDts), 'export function format(value: string): string;'],
    [keyFor(ts.sys.resolvePath(packageRoot + '/index.js')), 'export function format(value) { return `[${value}]`; }'],
    [keyFor(packageConsumer), 'import { format } from "typescript-quality-lesson-package";\nconst label: string = format("TS");\nconst wrong: number = format("TS");\nconsole.log(label);'],
  ]);
  const packageDirectories = new Set([keyFor(packageRoot)]);
  const packageHost = ts.createCompilerHost(options);
  const packageGetSourceFile = packageHost.getSourceFile.bind(packageHost);
  const packageReadFile = packageHost.readFile.bind(packageHost);
  const packageFileExists = packageHost.fileExists.bind(packageHost);
  const packageDirectoryExists = packageHost.directoryExists.bind(packageHost);
  const packageRealpath = packageHost.realpath?.bind(packageHost);
  packageHost.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = packageSources.get(keyFor(fileName));
    return source === undefined ? packageGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) : ts.createSourceFile(fileName, source, languageVersion, true, fileName.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS);
  };
  packageHost.readFile = (fileName) => packageSources.get(keyFor(fileName)) ?? packageReadFile(fileName);
  packageHost.fileExists = (fileName) => packageSources.has(keyFor(fileName)) || packageFileExists(fileName);
  packageHost.directoryExists = (directoryName) => packageDirectories.has(keyFor(directoryName)) || packageDirectoryExists(directoryName);
  if (packageRealpath) packageHost.realpath = (fileName) => packageSources.has(keyFor(fileName)) ? keyFor(fileName) : packageRealpath(fileName);
  const packageResolution = ts.resolveModuleName('typescript-quality-lesson-package', packageConsumer, options, packageHost).resolvedModule;
  assert.equal(keyFor(packageResolution?.resolvedFileName), keyFor(packageDts), 'TypeScript package resolution should use the exports.types declaration target');
  const packageDiagnostics = ts.getPreEmitDiagnostics(ts.createProgram([packageConsumer], options, packageHost))
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  assert.ok(packageDiagnostics.some((diagnostic) => diagnostic.file
    && keyFor(diagnostic.file.fileName) === keyFor(packageConsumer)
    && diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 === 3), 'consumer call should use the resolved string declaration');

  const unusedDirective = ts.sys.resolvePath('typescript-reviewed-unused-expect-error.ts');
  const unusedSource = typescriptReviewedWeeksNineteenToTwentyOne[21][0].bug.join('\n');
  const unusedHost = ts.createCompilerHost(options);
  const unusedGetSourceFile = unusedHost.getSourceFile.bind(unusedHost);
  const unusedReadFile = unusedHost.readFile.bind(unusedHost);
  const unusedFileExists = unusedHost.fileExists.bind(unusedHost);
  unusedHost.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => keyFor(fileName) === keyFor(unusedDirective)
    ? ts.createSourceFile(fileName, unusedSource, languageVersion, true)
    : unusedGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  unusedHost.readFile = (fileName) => keyFor(fileName) === keyFor(unusedDirective) ? unusedSource : unusedReadFile(fileName);
  unusedHost.fileExists = (fileName) => keyFor(fileName) === keyFor(unusedDirective) || unusedFileExists(fileName);
  const unusedProgram = ts.createProgram([unusedDirective], options, unusedHost);
  const unusedDirectiveDiagnostic = ts.getPreEmitDiagnostics(unusedProgram).find((diagnostic) => diagnostic.code === 2578);
  assert.ok(unusedDirectiveDiagnostic, 'unused @ts-expect-error should be reported');
  assert.equal(unusedDirectiveDiagnostic.file.getLineAndCharacterOfPosition(unusedDirectiveDiagnostic.start).line + 1, 1, 'unused directive faulty line');

  const declarationBug = typescriptReviewedWeeksNineteenToTwentyOne[19][0].bug.join('\n');
  const declarationJs = ts.transpileModule(declarationBug, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  assert.throws(() => vm.runInNewContext(declarationJs, { console }, { timeout: 1000 }), /getLessonCount is not defined/, 'declare must not create a runtime implementation');

  const assertionBug = typescriptReviewedWeeksNineteenToTwentyOne[20][3].bug.join('\n');
  const assertionJs = ts.transpileModule(assertionBug, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  assert.throws(() => vm.runInNewContext(assertionJs, { console }, { timeout: 1000 }), /toUpperCase/, 'non-null assertion must not make an absent search result exist');

  const fallbackBug = typescriptReviewedWeeksNineteenToTwentyOne[20][4].bug.join('\n');
  const fallbackJs = ts.transpileModule(fallbackBug, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const fallbackOutput = [];
  vm.runInNewContext(fallbackJs, { console: { log: (value) => fallbackOutput.push(value) } }, { timeout: 1000 });
  assert.deepEqual(fallbackOutput, [30], 'logical OR replaces a valid zero with the fallback');

  const falsePositiveTest = typescriptReviewedWeeksNineteenToTwentyOne[21][1].bug.join('\n');
  const falsePositiveJs = ts.transpileModule(falsePositiveTest, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const falsePositiveOutput = [];
  vm.runInNewContext(falsePositiveJs, { console: { log: (value) => falsePositiveOutput.push(value) } }, { timeout: 1000 });
  assert.deepEqual(falsePositiveOutput, [true], 'a test that compares a constant to itself can pass without calling the implementation');

  const emptyBoundary = typescriptReviewedWeeksNineteenToTwentyOne[21][2].bug.join('\n');
  const emptyBoundaryJs = ts.transpileModule(emptyBoundary, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  assert.throws(() => vm.runInNewContext(emptyBoundaryJs, { console }, { timeout: 1000 }), /toFixed/, 'the empty boundary example must reproduce its missing-value failure');

  const invalidParser = typescriptReviewedWeeksNineteenToTwentyOne[21][3].bug.join('\n');
  const invalidParserJs = ts.transpileModule(invalidParser, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const invalidParserOutput = [];
  vm.runInNewContext(invalidParserJs, { console: { log: (value) => invalidParserOutput.push(value) } }, { timeout: 1000 });
  assert.deepEqual(invalidParserOutput, ['NaN'], 'a numeric conversion without validation accepts an invalid semantic result');

  const emptyReduce = typescriptReviewedWeeksNineteenToTwentyOne[21][4].bug.join('\n');
  const emptyReduceJs = ts.transpileModule(emptyReduce, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  assert.throws(() => vm.runInNewContext(emptyReduceJs, { console }, { timeout: 1000 }), /Reduce of empty array with no initial value/, 'the regression example must reproduce the missing-initial-value failure');
});

test('TypeScript weeks twenty-two through twenty-four connect the capstone model, implementation, and tool boundaries', () => {
  for (const week of [22, 23, 24]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksTwentyTwoToTwentyFour[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v3-choice$/, concept.id);
      assert.ok(concept.legacyIds.includes(concept.id.replace(/-v3-choice$/, '-v2-choice')), concept.id + ' keeps the previous attempt ID');
      assert.ok(trace.id.endsWith('-trace-v4'), trace.id);
      assert.ok(trace.legacyIds.includes(trace.id.replace(/-v4$/, '-v3')), trace.id + ' keeps the previous trace ID');
      assert.ok(locateOrRepair.legacyIds.includes(locateOrRepair.id.replace(/-v3-/, '-v2-')), locateOrRepair.id + ' keeps the previous task ID');
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.deepEqual(trace.acceptedAnswers, [reviewed.answer], trace.id);
      assert.ok(trace.hint.length >= 15, trace.id + ' useful hint');
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);
      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id + ' starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id + ' faulty line');
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id + ' diagnosis');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }
  const positions = [22, 23, 24].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => positions.filter((position) => position === letter).length), [5, 5, 5]);
});

test('TypeScript weeks twenty-two through twenty-four reproduce the capstone and tooling boundaries', () => {
  const baseOptions = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
  function diagnosticsFor(sources, overrides = {}) {
    const options = { ...baseOptions, ...overrides };
    const files = new Map([...sources].map(([fileName, source]) => [ts.sys.resolvePath(fileName).replaceAll('\\', '/'), source]));
    const host = ts.createCompilerHost(options);
    const originalGetSourceFile = host.getSourceFile.bind(host);
    const originalReadFile = host.readFile.bind(host);
    const originalFileExists = host.fileExists.bind(host);
    const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
    host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
      const source = files.get(keyFor(fileName));
      return source === undefined
        ? originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
        : ts.createSourceFile(fileName, source, languageVersion, true, fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    };
    host.readFile = (fileName) => files.get(keyFor(fileName)) ?? originalReadFile(fileName);
    host.fileExists = (fileName) => files.has(keyFor(fileName)) || originalFileExists(fileName);
    return ts.getPreEmitDiagnostics(ts.createProgram([...files.keys()], options, host))
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.file && diagnostic.start !== undefined);
  }
  const faultyLine = (diagnostics, fileName, line) => diagnostics.some((diagnostic) =>
    ts.sys.resolvePath(diagnostic.file.fileName).replaceAll('\\', '/') === ts.sys.resolvePath(fileName).replaceAll('\\', '/')
    && diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 === line);
  const run = (source, extra = '') => {
    const compiled = ts.transpileModule(source + '\n' + extra, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
    const output = [];
    vm.runInNewContext(compiled, { console: { log: (...values) => output.push(values.map(String).join(' ')) } }, { timeout: 1000 });
    return output;
  };

  const week24 = typescriptReviewedWeeksTwentyTwoToTwentyFour[24];
  const moduleBug = week24[0].bug.join('\n');
  const moduleRepair = week24[0].solution;
  const moduleFiles = (app) => new Map([
    ['lesson.ts', 'export function formatLesson(id: string) { return "lesson:" + id; }'],
    ['app.ts', app],
  ]);
  const moduleDiagnostics = diagnosticsFor(moduleFiles(moduleBug));
  assert.ok(faultyLine(moduleDiagnostics, 'app.ts', 2), 'a type-only imported function cannot be called as a runtime value');
  assert.deepEqual(diagnosticsFor(moduleFiles(moduleRepair)), [], 'a value import should resolve and compile');

  const indexBug = week24[1].bug.join('\n');
  assert.ok(faultyLine(diagnosticsFor(new Map([['typescript-quality-w24/index.ts', indexBug]]), { noUncheckedIndexedAccess: true }),
    'typescript-quality-w24/index.ts', 2), 'unchecked array lookup should be diagnosed on the access');
  const domBug = week24[2].bug.join('\n');
  assert.ok(faultyLine(diagnosticsFor(new Map([['typescript-quality-w24/dom.ts', domBug]])), 'typescript-quality-w24/dom.ts', 2),
    'nullable DOM values should be checked before string operations');
  const jsxFile = 'typescript-quality-w24/card.tsx';
  const jsxOptions = { jsx: ts.JsxEmit.Preserve };
  assert.ok(faultyLine(diagnosticsFor(new Map([[jsxFile, week24[3].bug.join('\n')]]), jsxOptions), jsxFile, 4), 'TSX props should reject a number for a string title');
  assert.deepEqual(diagnosticsFor(new Map([[jsxFile, week24[3].solution]]), jsxOptions), [], 'corrected TSX props should type-check');

  const w22 = typescriptReviewedWeeksTwentyTwoToTwentyFour[22];
  const duplicateTitleLookup = w22[0].bug.join('\n') + '\nconst lessons = [{ id: "lesson-a", title: "같은 이름" }, { id: "lesson-b", title: "다른 이름" }];\nconsole.log(findLesson(lessons, "lesson-b")?.title ?? "없음");';
  assert.deepEqual(run(duplicateTitleLookup), ['없음'], 'looking up by display title should fail when the caller provides an ID');
  const falseStorageCast = w22[3].bug.join('\n') + '\nconsole.log(toSaved({ lessonId: "ts-w2", completed: true }).lesson_id);';
  assert.deepEqual(run(falseStorageCast), ['undefined'], 'a type assertion must not rename stored object fields');

  const w23 = typescriptReviewedWeeksTwentyTwoToTwentyFour[23];
  assert.deepEqual(run(w23[1].example.replace('{ lessonId: "ts-w2" }', '{ lessonId: 2 }')), ['invalid'], 'the parser should reject a non-string external ID');
  const mutatingSum = w23[2].bug.join('\n') + '\nconst items = [{ id: "w1", minutes: 20 }, { id: "w2", minutes: 15 }];\nconsole.log(totalMinutes(items) + ":" + items.map((item) => item.minutes).join(","));';
  assert.deepEqual(run(mutatingSum), ['20:15'], 'the faulty summary returns one item and mutates the source list');
  const missingCompletion = w23[3].bug.join('\n') + '\nconsole.log(completeLesson([], "missing").ok);';
  assert.deepEqual(run(missingCompletion), ['true'], 'the faulty implementation reports a missing lesson as complete');
  assert.deepEqual(run(w23[4].starter), ['true,false'], 'the unguarded completion rate fails the empty-input case');
  assert.deepEqual(run(w23[4].solution), ['true,true'], 'the fixed completion rate covers normal and empty input');
  assert.deepEqual(run(week24[4].bug.join('\n')), ['TypeScript 7.0:true'], 'the faulty version record confuses a CLI with its programmatic API');
  assert.deepEqual(run(week24[4].solution), ['false'], 'the corrected record distinguishes the unsupported API');
});

test('TypeScript weeks twenty-five and twenty-six contain distinct reviewed cases with balanced answer positions', () => {
  for (const week of [25, 26]) {
    const lesson = track.lessons.find((item) => item.week === week);
    const reviewedDays = typescriptReviewedWeeksTwentyFiveToTwentySix[week];
    assert.equal(reviewedDays.length, 5, 'reviewed week ' + week);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, 'distinct examples in week ' + week);

    for (const [index, day] of lesson.studyDays.entries()) {
      const reviewed = reviewedDays[index];
      assert.equal(day.objective, reviewed.objective, 'W' + week + ' D' + day.number + ' objective');
      assert.equal(day.example, reviewed.example, 'W' + week + ' D' + day.number + ' example');
      const [concept, trace, locateOrRepair] = day.exercises;
      assert.match(concept.id, /-v2-choice$/, concept.id);
      assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);
      assert.equal(concept.choices.find((option) => option.id === concept.answer)?.text, reviewed.rule, concept.id + ' answer key');
      for (const option of concept.choices) {
        assert.ok(concept.choiceExplanations[option.id]?.trim(), concept.id + '/' + option.id + ' feedback');
        if (option.id !== concept.answer) assert.equal(gradeAnswer(concept, option.id), false, concept.id + '/' + option.id);
      }
      assert.deepEqual(trace.acceptedAnswers, [reviewed.answer], trace.id);
      assert.ok(trace.hint.length >= 15, trace.id + ' useful hint');
      assert.ok(trace.explanation.length >= 30, trace.id + ' reasoning');
      assert.equal(gradeAnswer(trace, reviewed.answer), true, trace.id);
      assert.equal(gradeAnswer(trace, '__not_the_answer__'), false, trace.id);
      if (index === 4) {
        assert.equal(locateOrRepair.type, 'repair-code', locateOrRepair.id);
        assert.equal(locateOrRepair.starterCode, reviewed.starter, locateOrRepair.id + ' starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.starter), false, locateOrRepair.id + ' rejects starter');
        assert.equal(gradeAnswer(locateOrRepair, reviewed.solution), true, locateOrRepair.id + ' accepts complete repair');
      } else {
        assert.equal(locateOrRepair.type, 'locate-error', locateOrRepair.id);
        assert.deepEqual(locateOrRepair.answerLines, [reviewed.line], locateOrRepair.id + ' faulty line');
        assert.equal(locateOrRepair.explanation, reviewed.diagnosis, locateOrRepair.id + ' diagnosis');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line]), true, locateOrRepair.id + ' accepts faulty line');
        assert.equal(gradeAnswer(locateOrRepair, [reviewed.line + 1]), false, locateOrRepair.id + ' rejects adjacent line');
      }
    }
  }
  const positions = [25, 26].flatMap((week) => track.lessons.find((item) => item.week === week).studyDays.map((day) => day.exercises[0].answer));
  assert.deepEqual(['a', 'b', 'c'].map((letter) => positions.filter((position) => position === letter).length), [4, 3, 3]);
});

test('TypeScript weeks twenty-five and twenty-six reproduce unsafe paths and verify complete repairs', () => {
  const run = (source) => {
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
    const output = [];
    vm.runInNewContext(compiled, { console: { log: (...values) => output.push(values.map(String).join(' ')) } }, { timeout: 1000 });
    return output;
  };
  const day = (week, index) => typescriptReviewedWeeksTwentyFiveToTwentySix[week][index];

  assert.deepEqual(run(day(25, 0).bug.join('\n')), ['2:1'], 'unknown version must be reproduced as an unsafe downgrade');
  assert.deepEqual(run(day(25, 0).solution), ['unsupported'], 'unknown version must be rejected by the repair');
  assert.throws(() => run(day(25, 1).bug.join('\n')), /filter/, 'missing saved fields must reproduce the unsafe access');
  assert.deepEqual(run(day(25, 1).solution), ['0'], 'missing saved fields must take the documented fallback');
  assert.deepEqual(run(day(25, 1).solution.replace('restore("{}")', 'restore("{")')), ['0'], 'malformed JSON syntax must take the documented fallback');
  assert.deepEqual(run(day(25, 2).bug.join('\n')), ['script'], 'substring lookup must accept a non-key fragment');
  assert.deepEqual(run(day(25, 2).solution), ['not-found'], 'exact allowlisting must reject a non-key fragment');
  assert.deepEqual(run(day(25, 3).bug.join('\n')), ['true'], 'an unreviewed license string must reproduce false approval');
  assert.deepEqual(run(day(25, 3).solution), ['false'], 'an unreviewed package must remain unapproved');
  assert.deepEqual(run(day(25, 4).bug.join('\n')), ['false:bad'], 'failed backup validation must demonstrate replaced prior state');
  assert.deepEqual(run(day(25, 4).solution), ['false:saved'], 'failed backup validation must preserve prior state');

  assert.deepEqual(run(day(26, 0).bug.join('\n')), ['NaN'], 'a cast must not validate malformed numeric input');
  assert.deepEqual(run(day(26, 0).solution), ['invalid'], 'runtime parsing must reject malformed numeric input');
  assert.deepEqual(run(day(26, 1).bug.join('\n')), ['true'], 'a happy-path-only suite must reproduce its narrow false confidence');
  assert.deepEqual(run(day(26, 1).solution), ['true'], 'the expanded normal/boundary/error suite must pass');
  assert.deepEqual(run(day(26, 2).bug.join('\n')), ['false'], 'mouse-only activation must remain visible as a failing check');
  assert.deepEqual(run(day(26, 2).solution), ['2'], 'the semantic button plan must contain Enter and Space');
  assert.deepEqual(run(day(26, 3).bug.join('\n')), ['latest:transpile only'], 'inconsistent verification claims must be preserved by the broken record');
  assert.deepEqual(run(day(26, 3).solution), ['TypeScript 6.0.3:passed'], 'the repaired record must state the executed version and check');
  assert.deepEqual(run(day(26, 4).bug.join('\n')), ['2'], 'unknown progress identifiers must be reproduced as counted');
  assert.deepEqual(run(day(26, 4).solution), ['1'], 'only known progress identifiers must be counted');
});

test('reviewed TypeScript weeks one through twenty-six examples and repaired answers pass strict compiler diagnostics', () => {
  const options = {
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.Preserve,
  };
  const files = new Map();
  let fileNumber = 0;
  const reviewedWeeks = {
    ...typescriptReviewedOpeningWeeks,
    ...typescriptReviewedWeeksFourToSix,
    ...typescriptReviewedWeeksSevenToNine,
    ...typescriptReviewedWeeksTenToTwelve,
    ...typescriptReviewedWeeksThirteenToFifteen,
    ...typescriptReviewedWeeksSixteenToEighteen,
    ...typescriptReviewedWeeksNineteenToTwentyOne,
    ...typescriptReviewedWeeksTwentyTwoToTwentyFour,
    ...typescriptReviewedWeeksTwentyFiveToTwentySix,
  };
  for (const week of Array.from({ length: 26 }, (_, index) => index + 1)) {
    for (const [index, reviewed] of reviewedWeeks[week].entries()) {
      if ((week === 19 && (reviewed === reviewedWeeks[19][2] || reviewed === reviewedWeeks[19][3]))
        || (week === 24 && index === 0)) continue;
      for (const source of [reviewed.example, reviewed.solution]) {
        const extension = week === 24 && index === 3 ? '.tsx' : '.ts';
        const fileName = ts.sys.resolvePath('typescript-quality-' + fileNumber + extension);
        files.set(fileName.replaceAll('\\', '/'), source + '\nexport {};');
        fileNumber += 1;
      }
    }
  }
  files.set(ts.sys.resolvePath('typescript-reviewed-math.ts').replaceAll('\\', '/'), 'export function add(a: number, b: number): number { return a + b; }');
  files.set(ts.sys.resolvePath('typescript-reviewed-lesson.ts').replaceAll('\\', '/'), 'export default function createLesson(): string { return "Modules"; }');

  const host = ts.createCompilerHost(options);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  const originalReadFile = host.readFile.bind(host);
  const originalFileExists = host.fileExists.bind(host);
  const keyFor = (fileName) => ts.sys.resolvePath(fileName).replaceAll('\\', '/');
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = files.get(keyFor(fileName));
    if (source !== undefined) return ts.createSourceFile(fileName, source, languageVersion, true, fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    return originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  };
  host.readFile = (fileName) => files.get(keyFor(fileName)) ?? originalReadFile(fileName);
  host.fileExists = (fileName) => files.has(keyFor(fileName)) || originalFileExists(fileName);

  const program = ts.createProgram([...files.keys()], options, host);
  const errors = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(
    errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')),
    [],
    'all reviewed examples and accepted repair answers should type-check under strict mode',
  );
});

test('TypeScript teaching examples parse with the bundled compiler and their printed answers match', async () => {
  for (const lesson of track.lessons) {
    for (const day of lesson.studyDays) {
      const compiled = ts.transpileModule(day.example, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        reportDiagnostics: true,
      });
      const errors = (compiled.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      assert.deepEqual(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), [], `${lesson.id}/${day.number} syntax`);

      let actual = '';
      const sandbox = { console: { log: (...values) => { actual = values.map(String).join(' '); } } };
      const run = vm.runInNewContext(`(async () => {\n${compiled.outputText}\n})()`, sandbox, { timeout: 1000 });
      await run;
      const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
      assert.equal(actual, trace.acceptedAnswers[0], `${lesson.id}/${day.number} output`);
      assert.equal(gradeAnswer(trace, actual), true, trace.id);
    }
  }
});

test('TypeScript concept hints are written for their daily question instead of using generic filler', () => {
  const genericHint = '실제 값의 타입과 선언한 타입을 대조하세요.';
  for (const lesson of track.lessons) {
    const hints = lesson.studyDays.map((day) => day.exercises[0].hint);
    assert.ok(hints.every((hint) => hint && hint !== genericHint), `week ${lesson.week} has topic-specific hints`);
    assert.equal(new Set(hints).size, hints.length, `week ${lesson.week} has distinct daily hints`);
  }
});

