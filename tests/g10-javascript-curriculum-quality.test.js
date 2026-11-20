import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { getExercise, getTrack } from '../src/content.js';
import { curriculumAdditions } from '../src/curriculum-additions.js';
import { javascriptCourseExpansion, javascriptExpansion } from '../src/curriculum-expansion-javascript.js';
import { gradeAnswer } from '../src/grading.js';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const findExercise = (exercises, id) => exercises.find((item) => item.id === id || item.legacyIds?.includes(id));

function runModuleExample(example, allowFailure = false) {
  const files = example.match(/^\/\/ format\.mjs\r?\n([\s\S]*?)\r?\n\/\/ main\.mjs\r?\n([\s\S]*)$/);
  assert.ok(files, 'module example names its two files');
  const directory = mkdtempSync(join(tmpdir(), 'javascript-module-example-'));
  try {
    writeFileSync(join(directory, 'format.mjs'), files[1].trim() + '\n');
    writeFileSync(join(directory, 'main.mjs'), files[2].trim() + '\n');
    const result = spawnSync(process.execPath, [join(directory, 'main.mjs')], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 5000,
    });
    assert.equal(result.error, undefined, 'module example process starts');
    if (allowFailure) return { status: result.status, stdout: result.stdout.trimEnd(), stderr: result.stderr };
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trimEnd();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('JavaScript capstone score validation distinguishes NaN, coercion, and valid zero', () => {
  const lesson = getTrack('javascript').lessons.find((item) => item.week === 12);
  const validation = lesson.studyDays[0].exercises.find((item) => item.id === 'js-w12-d1-validation-v2');
  const rangeOnlyRejects = (score) => score < 0 || score > 100;
  const validScore = (score) => Number.isFinite(score) && score >= 0 && score <= 100;

  assert.equal(rangeOnlyRejects(NaN), false);
  assert.equal(rangeOnlyRejects(Infinity), true);
  assert.equal(rangeOnlyRejects('50'), false);
  assert.deepEqual([NaN, Infinity, '50', 0, 100, 101].map(validScore), [false, false, false, true, true, false]);
  assert.equal(validation.choices.find((option) => option.id === validation.answer).text, '`Number.isFinite(score)`');
  assert.match(validation.explanation, /NaN < 0.*NaN > 100/);
  for (const option of validation.choices) assert.equal(gradeAnswer(validation, option.id), option.id === validation.answer);

  const completion = lesson.studyDays[2].exercises.find((item) => item.id === 'js-w12-d3-immutable-choice');
  assert.match(completion.choiceExplanations[completion.answer], /기존 배열을 그대로 반환/);
  const trace = findExercise(lesson.studyDays[4].exercises, 'js-w12-d5-copy-trace-v2');
  assert.equal((trace.prompt.match(/`/g) ?? []).length % 2, 0);
  assert.equal(gradeAnswer(trace, '1:2'), true);
  const integratedExample = lesson.studyDays[4].example;
  assert.match(integratedExample, /scores\.every\(isValidScore\)/);
  assert.match(integratedExample, /RangeError/);
  assert.match(integratedExample, /average\(\[NaN\]\)/);
});

test('JavaScript explanations preserve Map identity, empty averages, and duplicate-sensitive results', () => {
  const lessons = getTrack('javascript').lessons;
  const exercise = (week, id) => lessons.find((item) => item.week === week).studyDays.flatMap((day) => day.exercises).find((item) => item.id === id);
  assert.match(exercise(15, 'js-w15-d3-error-v2').explanation, /조회는 false/);
  assert.match(exercise(19, 'js-w19-d2-error-v2').explanation, /초기값 0만 추가해도 0으로 나누면 NaN/);
  assert.equal([].reduce((sum, value) => sum + value, 0) / 0, NaN);

  const pairs = [];
  for (const left of ['js']) for (const right of ['js', 'js']) if (left === right) pairs.push(left);
  const membership = ['js'].filter((id) => new Set(['js', 'js']).has(id));
  assert.deepEqual(pairs, ['js', 'js']);
  assert.deepEqual(membership, ['js']);
  assert.match(exercise(21, 'js-w21-d2-error-v2').explanation, /중복 결과의 계약/);
});

test('JavaScript request cleanup example checks HTTP status and handles rejected requests', async () => {
  const day = getTrack('javascript').lessons.find((item) => item.week === 24).studyDays[2];
  let cleanup;
  let jsonCalled = false;
  let shownError;
  let shownResult;
  const mockUseEffect = (effect) => { cleanup = effect(); };
  const mockFetch = async () => ({ ok: false, json: async () => { jsonCalled = true; return []; } });
  await new AsyncFunction('useEffect', 'fetch', 'query', 'setResults', 'setError', day.example)(
    mockUseEffect, mockFetch, 'js', (value) => { shownResult = value; }, (error) => { shownError = error; },
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(jsonCalled, false);
  assert.equal(shownResult, undefined);
  assert.match(shownError.message, /요청 실패/);
  assert.equal(typeof cleanup, 'function');
  cleanup();
  const missingCleanup = day.exercises.find((item) => item.id === 'js-w24-d3-missing-cleanup-v2');
  assert.match(missingCleanup.codeLines[2], /catch/);
  assert.deepEqual(missingCleanup.answerLines, [4]);
});

test('JavaScript conditional and loop exercises use distinct, previously taught cases', () => {
  const track = getTrack('javascript');
  const conditionals = track.lessons.find((item) => item.id === 'js-conditionals');
  const andCase = conditionals.studyDays[1].exercises.find((item) => item.id === 'js-conditionals-boolean-v2');
  assert.match(andCase.prompt, /paid.*값은 무엇/);
  assert.deepEqual(andCase.acceptedAnswers, ['true']);
  assert.match(andCase.explanation, /paid.*true/);

  for (const id of ['js-variables', 'js-conditionals', 'js-loops']) {
    const lesson = track.lessons.find((item) => item.id === id);
    for (const question of lesson.studyDays.flatMap((day) => day.exercises).filter((item) => item.type === 'short-answer')) {
      assert.doesNotMatch(question.explanation, /선언, 호출, 연산을 차례대로 추적/);
    }
  }

  const loops = track.lessons.find((item) => item.id === 'js-loops');
  const accumulation = findExercise(loops.studyDays[2].exercises, 'js-loops-accumulation-trace-v2');
  assert.match(accumulation.prompt, /콘솔에 출력되는 값/);
  assert.deepEqual(accumulation.acceptedAnswers, ['3']);
  assert.match(accumulation.explanation, /total은 0에서 1, 3으로 바뀌어.*합계 3/);
});

test('G10 JavaScript units one through three retain their original questions in the reviewed weekly route', () => {
  const track = getTrack('javascript');
  const firstThreeUnitIds = ['js-variables', 'js-conditionals', 'js-loops'];
  const initialQuestions = new Map([
    ['js-variables', ['js-variables-choice', 'js-variables-reassignment', 'js-variables-tdz']],
    ['js-conditionals', ['js-conditionals-choice', 'js-conditionals-boolean-v2', 'js-conditionals-equality']],
    ['js-loops', ['js-loop-locate', 'js-loops-for-of', 'js-loops-accumulation-trace-v2']],
  ]);
  const correctChoiceText = new Map([
    ['js-variables-choice', '`const course = "JavaScript"`'],
    ['js-variables-reassignment', '`let completed = 0`'],
    ['js-conditionals-choice', 'score >= 60'],
    ['js-loops-for-of', '`for (const score of scores) { total += score; }`'],
  ]);

  assert.deepEqual(javascriptExpansion.lessonOrder.slice(0, 3), firstThreeUnitIds);
  assert.deepEqual(javascriptCourseExpansion.lessonOrder.slice(0, 12), javascriptExpansion.lessonOrder);
  assert.deepEqual(track.lessons.slice(0, 12).map((lesson) => lesson.id), javascriptExpansion.lessonOrder);

  const variableLesson = track.lessons.find((lesson) => lesson.id === 'js-variables');
  assert.deepEqual(javascriptCourseExpansion.existingWeeks['js-variables'].legacyExerciseDays, [2, 2, 2]);
  assert.deepEqual(variableLesson.studyDays[0].exercises.map((exercise) => exercise.id), [
    'js-w1-d1-concept-v2', 'js-w1-d1-trace-v3', 'js-w1-d1-debug-v2',
  ]);
  assert.match(variableLesson.studyDays[0].objective, /typeof/);
  assert.deepEqual(variableLesson.studyDays[1].exercises.map((exercise) => exercise.id), initialQuestions.get('js-variables'));
  assert.match(variableLesson.studyDays[1].title, /변수 선언 규칙/);
  assert.match(variableLesson.studyDays[1].objective, /const와 let.*선언 전 접근/);

  for (const lessonId of firstThreeUnitIds) {
    const lesson = track.lessons.find((item) => item.id === lessonId);
    const questionIds = initialQuestions.get(lessonId);
    const mappedQuestions = lesson.studyDays.flatMap((day) => day.exercises).filter((exercise) => questionIds.some((id) => id === exercise.id || exercise.legacyIds?.includes(id)));

    assert.equal(lesson.studyDays.length, 5, lessonId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), lessonId);
    assert.equal(mappedQuestions.length, questionIds.length, lessonId);
    for (const id of questionIds) {
      assert.ok(mappedQuestions.some((exercise) => exercise.id === id || exercise.legacyIds?.includes(id)), `${lessonId} keeps ${id} in the reviewed route`);
    }
    assert.equal(new Set(lesson.exercises.map((exercise) => exercise.id)).size, 15, lessonId);

    for (const exercise of mappedQuestions) {
      if (exercise.type === 'choice') {
        assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
        assert.equal(exercise.choices.find((choice) => choice.id === exercise.answer).text, correctChoiceText.get(exercise.id));
        for (const choice of exercise.choices) {
          assert.ok(exercise.choiceExplanations[choice.id]?.length > 20, `${exercise.id} explains ${choice.id}`);
          if (choice.id !== exercise.answer) assert.equal(gradeAnswer(exercise, choice.id), false, exercise.id);
        }
      } else if (exercise.type === 'short-answer') {
        assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        assert.ok(exercise.explanation.length > 20, exercise.id);
      } else if (exercise.type === 'locate-error') {
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        assert.ok(exercise.codeLines[exercise.answerLines[0] - 1].length > 0, exercise.id);
        assert.ok(exercise.explanation.length > 20, exercise.id);
      } else {
        assert.fail(`Unexpected legacy question type: ${exercise.type} (${exercise.id})`);
      }
    }
  }
});

test('G10 JavaScript initial examples match current ECMAScript metadata and published output', async () => {
  const metadata = curriculumAdditions.javascript;
  assert.equal(metadata.version, 'ECMAScript 2026');
  assert.equal(metadata.reviewedAt, '2026-10-24');
  assert.ok(metadata.sources.some((source) => source.url === 'https://262.ecma-international.org/17.0/'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://tc39.es/ecma262/2026/multipage/abstract-operations.html#sec-stringtonumber'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html#sec-number.isinteger'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://ecma-international.org/publications-and-standards/standards/ecma-262/'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst'));

  const expectedOutputs = new Map([
    ['js-conditionals', ['통과']],
    ['js-loops', ['9']],
  ]);
  for (const [lessonId, expected] of expectedOutputs) {
    const lesson = metadata.lessons.find((item) => item.id === lessonId);
    const output = [];
    await new AsyncFunction('console', lesson.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
    assert.deepEqual(output, expected, lessonId);
  }
});

test('G10 JavaScript units four through six teach coherent function, array, and object skills', async () => {
  const track = getTrack('javascript');
  const unitIds = ['js-functions', 'js-arrays', 'js-objects'];
  const legacyQuestionIds = new Map([
    ['js-functions', ['js-function-repair', 'js-functions-return-value', 'js-functions-default-argument']],
    ['js-arrays', ['js-sum-coding', 'js-arrays-append-immutable', 'js-arrays-filter-map']],
    ['js-objects', ['js-objects-dynamic-key', 'js-objects-undefined', 'js-objects-reference']],
  ]);
  const exampleOutputs = new Map([
    ['js-functions', ['안녕, 민', '8', '안녕, 학습자 안녕, 민', '안녕, 학습자 안녕, 학습자 안녕, null', 'JS (기초)']],
    ['js-arrays', ['Python', 'JS,React', '60,90', 'a,b b,a', 'React null']],
    ['js-objects', ['민', '소개 없음', '민 2', 'Python: 30분', '1 2 민']],
  ]);
  const locateFaults = new Map([
    ['js-w4-d2-debug-v2', 'value * 2;'],
    ['js-w4-d3-debug-v2', 'name = "학습자";'],
    ['js-w4-d4-debug-v2', 'name || "학습자"'],
    ['js-w5-d2-debug-v2', 'courses.push("React")'],
    ['js-w5-d3-debug-v3', 'scores.filter((score) => score > 60)'],
    ['js-w5-d4-debug-v2', 'return names.sort()'],
    ['js-arrays-filter-map', 'scores.map((score) => score >= 60)'],
    ['js-w6-d2-debug-v3', 'profile.bio.length'],
    ['js-objects-reference', 'const second = first;'],
    ['js-w6-d3-debug-v2', 'const next = { level: 2 };'],
    ['js-w6-d4-debug-v2', 'return course.title + course.minutes;'],
  ]);
  const locatorById = new Map();

  assert.deepEqual(javascriptExpansion.lessonOrder.slice(3, 6), unitIds);
  assert.deepEqual(javascriptCourseExpansion.lessonOrder.slice(3, 6), unitIds);
  assert.deepEqual(track.lessons.slice(3, 6).map((lesson) => lesson.id), unitIds);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    const exercises = lesson.studyDays.flatMap((day) => day.exercises);
    const expectedOutputs = exampleOutputs.get(unitId);

    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 15, unitId);
    for (const id of legacyQuestionIds.get(unitId)) assert.ok(exercises.some((exercise) => exercise.id === id || exercise.legacyIds?.includes(id)), `${unitId} retains ${id}`);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.ok(day.intro.length > 30, `${unitId} ${day.title} has a useful daily introduction`);
      const output = [];
      await new AsyncFunction('console', day.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
      assert.deepEqual(output, [expectedOutputs[index]], `${unitId} ${day.title}`);

      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} has a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} has an explanation`);
        assert.notEqual(exercise.hint, '코드가 어떤 값을 만들고, 그 값이 호출자에게 어떻게 전달되는지 따라가 보세요.', exercise.id);
        assert.notEqual(exercise.hint, '선언, 호출, 연산이 어떤 순서로 실행되는지 한 줄씩 따라가 보세요.', exercise.id);

        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.ok(exercise.choices.every((choice) => exercise.choiceExplanations[choice.id]?.length > 20), exercise.id);
        } else if (exercise.type === 'short-answer') {
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        } else if (exercise.type === 'locate-error') {
          const line = exercise.codeLines[exercise.answerLines[0] - 1];
          assert.ok(line, `${exercise.id} answer line exists`);
          locatorById.set(exercise.id, exercise);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} has an example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has a test case`);
          assert.match(exercise.gradingNote, /코드를 실행하지 않습니다|실행형 채점은 아니며|실행 채점이 아니라/);
        }
      }
    }
  }

  for (const [id, expectedFault] of locateFaults) {
    const exercise = locatorById.get(id);
    assert.ok(exercise, `${id} is part of the visible route`);
    const line = exercise.codeLines[exercise.answerLines[0] - 1];
    assert.ok(line.includes(expectedFault), `${id} answer points to the actual defect`);
    assert.match(exercise.explanation, new RegExp(`${exercise.answerLines[0]}번 줄`), `${id} explanation points to the answer line`);
  }

  const runLocator = async (id) => {
    const exercise = locatorById.get(id);
    const output = [];
    await new AsyncFunction('console', exercise.codeLines.join('\n'))({ log: (...values) => output.push(values.map(String).join(' ')) });
    return output;
  };
  assert.deepEqual(await runLocator('js-w4-d4-debug-v2'), ['안녕, 학습자']);
  assert.deepEqual(await runLocator('js-w6-d3-debug-v2'), ['undefined 2']);
  assert.deepEqual(await runLocator('js-w6-d4-debug-v2'), ['Python30']);
});

test('G10 JavaScript units seven through nine teach scope, modules, and browser form boundaries', async () => {
  const track = getTrack('javascript');
  const unitIds = ['js-scope-closures', 'js-modules-errors-tests', 'js-dom-forms'];
  const legacyQuestionIds = new Map([
    ['js-scope-closures', ['js-scope-tdz', 'js-scope-function-return', 'js-scope-shadowing']],
    ['js-modules-errors-tests', ['js-modules-named-import', 'js-modules-namespace-import', 'js-tests-failure-case']],
    ['js-dom-forms', ['js-dom-input-value', 'js-dom-normalized-save', 'js-dom-safe-text']],
  ]);
  const exampleOutputs = new Map([
    ['js-scope-closures', [['안쪽', '바깥'], ['함수 안'], ['1 2 1'], ['1 2'], ['1 1 2']]],
    ['js-modules-errors-tests', [['JS'], ['JS'], ['title is required'], ['12 12 null null'], ['일반 제목 통과', '공백 제목 통과', '숫자 입력 통과']]],
    ['js-dom-forms', [['true'], ['React null'], ['<b>저장됨</b>'], ['React null'], ['<b>제목을 입력하세요</b>', '<b>React</b> 저장됨']]],
  ]);
  const locateFaults = new Map([
    ['js-scope-tdz', 'console.log(score);'],
    ['js-w7-d2-debug-v2', 'console.log(label);'],
    ['js-w7-d3-debug-v2', 'return () => count++;'],
    ['js-w7-d4-debug-v2', 'return () => count + 1;'],
    ['js-w8-d2-debug-v3', 'import toTitle from'],
    ['js-w8-d3-debug-v2', 'if (!title)'],
    ['js-w8-d4-debug-v2', 'const value = Number(raw);'],
    ['js-dom-normalized-save', 'save(input.value);'],
    ['js-w9-d2-debug-v2', 'save(value);'],
    ['js-w9-d3-debug-v2', 'element.innerHTML = message;'],
    ['js-w9-d4-debug-v2', 'return input.value;'],
  ]);
  const locatorById = new Map();
  const createDomDocument = () => {
    const listeners = new Map();
    const form = {
      addEventListener(type, listener) { listeners.set(type, listener); },
      requestSubmit() {
        const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
        listeners.get('submit')(event);
        this.lastEvent = event;
        return event;
      },
    };
    const elements = new Map([
      ['#course-form', form],
      ['#course-title', { value: ' React ' }],
      ['#preview', { textContent: '' }],
      ['#message', { textContent: '' }],
    ]);
    return {
      form,
      elements,
      document: { querySelector(selector) { return elements.get(selector) ?? null; } },
    };
  };

  assert.deepEqual(javascriptExpansion.lessonOrder.slice(6, 9), unitIds);
  assert.deepEqual(javascriptCourseExpansion.lessonOrder.slice(6, 9), unitIds);
  assert.deepEqual(track.lessons.slice(6, 9).map((lesson) => lesson.id), unitIds);
  assert.deepEqual(javascriptCourseExpansion.existingWeeks['js-scope-closures'].legacyExerciseDays, [1, 2, 1]);
  assert.deepEqual(javascriptCourseExpansion.existingWeeks['js-dom-forms'].legacyExerciseDays, [4, 2, 3]);
  const scopeLesson = track.lessons.find((item) => item.id === 'js-scope-closures');
  assert.deepEqual(scopeLesson.studyDays.slice(0, 3).map((day) => day.exercises
    .filter((exercise) => legacyQuestionIds.get('js-scope-closures').includes(exercise.id))
    .map((exercise) => exercise.id)), [
    ['js-scope-tdz', 'js-scope-shadowing'],
    ['js-scope-function-return'],
    [],
  ]);
  const domLesson = track.lessons.find((item) => item.id === 'js-dom-forms');
  assert.deepEqual(domLesson.studyDays.map((day) => day.exercises
    .filter((exercise) => legacyQuestionIds.get('js-dom-forms').includes(exercise.id))
    .map((exercise) => exercise.id)), [
    [],
    ['js-dom-normalized-save'],
    ['js-dom-safe-text'],
    ['js-dom-input-value'],
    [],
  ]);
  assert.ok(curriculumAdditions.javascript.sources.some((source) => source.url === 'https://html.spec.whatwg.org/multipage/input.html'));
  assert.ok(curriculumAdditions.javascript.sources.some((source) => source.url === 'https://dom.spec.whatwg.org/'));

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    const exercises = lesson.studyDays.flatMap((day) => day.exercises);
    const expectedOutputs = exampleOutputs.get(unitId);

    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 15, unitId);
    for (const id of legacyQuestionIds.get(unitId)) assert.ok(exercises.some((exercise) => exercise.id === id), `${unitId} retains ${id}`);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.ok(day.intro.length > 40, `${unitId} ${day.title} has a useful daily introduction`);
      const output = [];
      if (unitId === 'js-modules-errors-tests' && index < 2) {
        assert.doesNotMatch(day.example, /await import|data:text/i, `${day.title} uses the static module syntax being taught`);
        output.push(runModuleExample(day.example));
        const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
        assert.ok(trace.prompt.includes(day.example), `${trace.id} traces the runnable two-file example`);
        assert.equal(gradeAnswer(trace, trace.acceptedAnswers[0]), true, trace.id);
        if (index === 0) {
          assert.match(day.example, /export function toTitle/);
          assert.match(day.example, /import \{ toTitle \} from "\.\/format\.mjs"/);
        } else {
          assert.match(day.example, /export const formatTitle/);
          assert.match(day.example, /import \{ formatTitle as toTitle \} from "\.\/format\.mjs"/);
        }
      } else if (unitId === 'js-dom-forms') {
        const fixture = createDomDocument();
        await new AsyncFunction('console', 'document', day.example)({ log: (...values) => output.push(values.map(String).join(' ')) }, fixture.document);
        if (index === 0) assert.equal(fixture.form.lastEvent.defaultPrevented, true);
        if (index !== 1) assert.match(day.example, /document\.querySelector\(/, `${day.title} uses a browser DOM element`);
      } else {
        await new AsyncFunction('console', day.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
      }
      assert.deepEqual(output, expectedOutputs[index], `${unitId} ${day.title}`);
      if (unitId === 'js-modules-errors-tests' && index === 4) {
        assert.match(day.objective, /테스트 사례/);
        assert.match(day.example, /actual === expected/);
      }

      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} has a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} has an explanation`);
        assert.notEqual(exercise.hint, '코드가 어떤 값을 만들고, 그 값이 호출자에게 어떻게 전달되는지 따라가 보세요.', exercise.id);
        assert.notEqual(exercise.hint, '선언, 호출, 연산이 어떤 순서로 실행되는지 한 줄씩 따라가 보세요.', exercise.id);

        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.ok(exercise.choices.every((choice) => exercise.choiceExplanations[choice.id]?.length > 20), exercise.id);
        } else if (exercise.type === 'short-answer') {
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        } else if (exercise.type === 'locate-error') {
          const line = exercise.codeLines[exercise.answerLines[0] - 1];
          assert.ok(line, `${exercise.id} answer line exists`);
          locatorById.set(exercise.id, exercise);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} has an example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has a test case`);
          assert.match(exercise.gradingNote, /코드를 실행하지 않습니다|실행형 채점은 아니며|실행 채점이 아니라/);
        }
      }
    }
  }

  for (const [id, expectedFault] of locateFaults) {
    const exercise = locatorById.get(id);
    assert.ok(exercise, `${id} is part of the visible route`);
    const line = exercise.codeLines[exercise.answerLines[0] - 1];
    assert.ok(line.includes(expectedFault), `${id} answer points to the actual defect`);
    assert.match(exercise.explanation, new RegExp(`${exercise.answerLines[0]}번 줄`), `${id} explanation points to the answer line`);
  }

  assert.equal(getExercise('js-w6-d2-debug-v2').id, 'js-w6-d2-debug-v3');
  assert.equal(getExercise('js-w6-d2-trace-v3').id, 'js-w6-d2-trace-v4');
  assert.doesNotMatch(getTrack('javascript').lessons.find((item) => item.id === 'js-objects').studyDays[1].example, /\.trim\(|\?\?/);
  assert.equal(getExercise('js-w8-d2-debug-v2').id, 'js-w8-d2-debug-v3');
  assert.equal(getExercise('js-w8-d2-trace-v3').id, 'js-w8-d2-trace-v4');

  const safeTextTrace = track.lessons.find((item) => item.id === 'js-dom-forms').studyDays[4].exercises
    .find((exercise) => exercise.id === 'js-w9-d5-trace-v2' || exercise.legacyIds?.includes('js-w9-d5-trace-v2'));
  assert.deepEqual(safeTextTrace.acceptedAnswers, ['<b>제목을 입력하세요</b>']);
  assert.ok(safeTextTrace.explanation.includes('예상 출력은 `<b>제목을 입력하세요</b>`입니다.'));
  assert.ok(!safeTextTrace.explanation.includes('<b>안녕</b>'));

  const runLocator = async (id, args = ['console']) => {
    const exercise = locatorById.get(id);
    const output = [];
    const consoleCapture = { log: (...values) => output.push(values.map(String).join(' ')) };
    const fn = new AsyncFunction(...args, exercise.codeLines.join('\n'));
    await fn(...args.map((name) => name === 'console' ? consoleCapture : undefined));
    return output;
  };
  assert.deepEqual(await runLocator('js-w7-d3-debug-v2'), ['0']);
  assert.deepEqual(await runLocator('js-w7-d4-debug-v2'), ['1 1']);
  assert.deepEqual(await runLocator('js-w8-d4-debug-v2'), ['0']);
  await assert.rejects(runLocator('js-w6-d2-debug-v3'), TypeError);
  await assert.rejects(runLocator('js-w7-d2-debug-v2'), ReferenceError);
  const invalidDefaultImport = runModuleExample(locatorById.get('js-w8-d2-debug-v3').codeLines.join('\n'), true);
  assert.notEqual(invalidDefaultImport.status, 0);
  assert.match(invalidDefaultImport.stderr, /default/i);

  const d1Concept = track.lessons.find((lesson) => lesson.id === unitIds[1]).studyDays[0].exercises.find((exercise) => exercise.id === 'js-w8-d1-concept-v2');
  assert.match(d1Concept.prompt, /named export `toTitle`/);
  assert.match(d1Concept.prompt, /가져와 호출/);
  assert.equal(d1Concept.choices.find((choice) => choice.id === d1Concept.answer).text, 'named import로 가져와 함수를 호출한다');
  assert.deepEqual(d1Concept.choices.map((choice) => choice.text).sort(), [
    'named import로 가져와 함수를 호출한다',
    '중괄호 없는 import를 쓰지만 default export는 없다',
    'import 대신 export를 호출한다',
  ].sort());
  assert.doesNotMatch(d1Concept.prompt, /" js ".*"JS"/);

  const d4DomLocator = locatorById.get('js-w9-d4-debug-v2');
  const domOutput = [];
  await new AsyncFunction('console', 'input', `${d4DomLocator.codeLines.join('\n')}\nconsole.log(readTitle({ value: " React " }));`)({ log: (...values) => domOutput.push(values.map(String).join(' ')) }, undefined);
  assert.deepEqual(domOutput, [' React ']);
});

test('G10 JavaScript units ten through twelve verify async web, event-loop, and capstone content', async () => {
  const track = getTrack('javascript');
  const unitIds = ['js-promises-fetch', 'js-event-loop', 'js-algorithms-capstone'];
  const legacyQuestionIds = new Map([
    ['js-promises-fetch', ['js-promises-await-v2', 'js-fetch-ok', 'js-promises-network-failure-v2']],
    ['js-event-loop', ['js-event-loop-order', 'js-event-loop-timer-v2', 'js-event-loop-microtask']],
    ['js-algorithms-capstone', ['js-capstone-complexity', 'js-capstone-empty-average', 'js-capstone-immutable']],
  ]);
  const exampleOutputs = new Map([
    ['js-promises-fetch', [['React'], ['HTTP 404'], ['network: offline'], ['2'], ['/courses true true']]],
    ['js-event-loop', [['A, D, B, C'], ['sync, timer'], ['sync, promise, queued, timer'], ['1', 'ready'], ['queued function', 'chunk']]],
    ['js-algorithms-capstone', [['true 80'], ['0 80'], ['js js,react true'], ['240 0'], ['{"average":90,"completed":["js","react"]} true']]],
  ]);
  const locateFaults = new Map([
    ['js-promises-await-v2', { line: 2, text: 'const profile = response.json();' }],
    ['js-w10-d2-debug-v2', { line: 3, text: 'if (!response.ok) return data;' }],
    ['js-w10-d3-debug-v2', { line: 3, text: 'catch (error) { return {}; }' }],
    ['js-w10-d4-debug-v2', { line: 2, text: 'return response.json;' }],
    ['js-w11-d2-debug-v2', { line: 2, text: 'setTimeout(runTask(), 0);' }],
    ['js-w11-d3-debug-v2', { line: 2, text: 'Promise.resolve().then(log("microtask"));' }],
    ['js-w11-d4-debug-v2', { line: 3, text: 'while (workRemains()) doSmallWork();' }],
    ['js-capstone-empty-average', { line: 3, text: 'return total / scores.length;' }],
    ['js-w12-d3-mutation', { line: 4, text: 'completed.push(lessonId);' }],
    ['js-w12-d4-range', { line: 3, text: 'for (let index = 0; index <= scores.length; index += 1) {' }],
  ]);
  const locatorById = new Map();
  const sourceUrls = curriculumAdditions.javascript.sources.map((source) => source.url);

  assert.deepEqual(javascriptExpansion.lessonOrder.slice(9, 12), unitIds);
  assert.deepEqual(javascriptCourseExpansion.lessonOrder.slice(9, 12), unitIds);
  assert.deepEqual(track.lessons.slice(9, 12).map((lesson) => lesson.id), unitIds);
  assert.equal(curriculumAdditions.javascript.reviewedAt, '2026-10-24');
  for (const url of [
    'https://fetch.spec.whatwg.org/',
    'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
    'https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames',
  ]) assert.ok(sourceUrls.includes(url), `official source is linked: ${url}`);

  const eventLoopDayOne = track.lessons.find((lesson) => lesson.id === 'js-event-loop').studyDays[0];
  const eventLoopOrder = eventLoopDayOne.exercises.find((exercise) => exercise.id === 'js-event-loop-order');
  assert.match(eventLoopOrder.prompt, /위 예제/);
  assert.equal(eventLoopOrder.choices.find((choice) => choice.id === eventLoopOrder.answer).text, exampleOutputs.get('js-event-loop')[0][0]);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    const exercises = lesson.studyDays.flatMap((day) => day.exercises);
    const expectedOutputs = exampleOutputs.get(unitId);

    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, `${unitId} has distinct daily introductions`);
    assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 15, unitId);
    for (const id of legacyQuestionIds.get(unitId)) assert.ok(exercises.some((exercise) => exercise.id === id), `${unitId} retains ${id}`);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.ok(day.intro.length > 45, `${unitId} ${day.title} has a useful daily introduction`);
      const output = [];
      await new AsyncFunction('console', day.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
      assert.deepEqual(output, expectedOutputs[index], `${unitId} ${day.title}`);

      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} has a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} has an explanation`);

        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.ok(exercise.choices.every((choice) => exercise.choiceExplanations[choice.id]?.length > 20), exercise.id);
          for (const choice of exercise.choices) {
            if (choice.id !== exercise.answer) assert.equal(gradeAnswer(exercise, choice.id), false, exercise.id);
          }
        } else if (exercise.type === 'short-answer') {
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        } else if (exercise.type === 'locate-error') {
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.codeLines[exercise.answerLines[0] - 1], `${exercise.id} answer line exists`);
          locatorById.set(exercise.id, exercise);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} has an example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has test cases`);
          assert.match(exercise.gradingNote, /코드를 실행하지 않습니다|실행형 채점은 아니며|실행 채점이 아니라/);
        }
      }
    }
  }

  for (const [id, expected] of locateFaults) {
    const exercise = locatorById.get(id);
    assert.ok(exercise, `${id} is part of the visible route`);
    assert.equal(exercise.answerLines[0], expected.line, `${id} answer line`);
    assert.ok(exercise.codeLines[expected.line - 1].includes(expected.text), `${id} selected line contains the defect`);
    assert.match(exercise.explanation, new RegExp(`${expected.line}번 줄`), `${id} explanation identifies the selected line`);
  }

  const defective = (id) => locatorById.get(id).codeLines.join('\n');
  const profile = await new AsyncFunction('response', `${defective('js-promises-await-v2')}\nreturn loadName(response);`)({ json: async () => ({ name: 'Ada' }) });
  assert.equal(profile, undefined, 'the un-awaited response.json() does not expose the parsed profile');

  const loadFailedResponse = await new AsyncFunction('response', `${defective('js-w10-d2-debug-v2')}\nreturn load(response);`)({ ok: false, json: async () => ({ message: 'missing' }) });
  assert.deepEqual(loadFailedResponse, { message: 'missing' }, 'the defective HTTP branch returns an error body as normal data');

  const networkFailure = await new AsyncFunction('fetcher', `${defective('js-w10-d3-debug-v2')}\nreturn load(fetcher);`)(async () => { throw new Error('offline'); });
  assert.deepEqual(networkFailure, {}, 'the defective catch hides the failed request as an empty success value');

  const jsonMethod = () => {};
  const returnedJson = await new AsyncFunction('response', `${defective('js-w10-d4-debug-v2')}\nreturn readJson(response);`)({ json: jsonMethod });
  assert.equal(returnedJson, jsonMethod, 'the defective code returns the method instead of invoking it');

  const microtaskOutput = [];
  await new AsyncFunction('console', defective('js-w11-d3-debug-v2'))({ log: (...values) => microtaskOutput.push(values.map(String).join(' ')) });
  assert.deepEqual(microtaskOutput, ['microtask', 'sync'], 'the defective code calls log before scheduling a microtask');

  const cancelExercise = track.lessons.find((lesson) => lesson.id === 'js-promises-fetch').studyDays[4].exercises.find((exercise) => exercise.id === 'js-w10-d5-trace-v2' || exercise.legacyIds?.includes('js-w10-d5-trace-v2'));
  const cancelCode = cancelExercise.prompt.match(/\n\n`([\s\S]+?)`$/)?.[1];
  assert.ok(cancelCode, 'the cancellation trace includes runnable example code');
  const cancelOutput = [];
  await new AsyncFunction('console', cancelCode)({ log: (...values) => cancelOutput.push(values.map(String).join(' ')) });
  assert.deepEqual(cancelOutput, ['/courses true true']);
  assert.equal(gradeAnswer(cancelExercise, cancelOutput.join('\n')), true);

  const averageIsNaN = await new AsyncFunction(`${defective('js-capstone-empty-average')}\nreturn Number.isNaN(average([]));`)();
  assert.equal(averageIsNaN, true, 'the defective empty average returns NaN');

  const mutated = await new AsyncFunction(`${defective('js-w12-d3-mutation')}\nconst completed = ['js']; addCompletion(completed, 'react'); return completed;`)();
  assert.deepEqual(mutated, ['js', 'react'], 'the defective completion function mutates its input');

  const outOfBoundsTotal = await new AsyncFunction(`${defective('js-w12-d4-range')}\nreturn total([60, 80, 100]);`)();
  assert.ok(Number.isNaN(outOfBoundsTotal), 'the inclusive loop reads beyond the last valid array index');
});
