import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getExercise, getLesson, getTrack, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const trackById = (id) => tracks.find((track) => track.id === id);
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const questionById = (id) => tracks
  .flatMap((track) => track.lessons)
  .flatMap((lesson) => [...lesson.exercises, ...lesson.sessions.flatMap((session) => session.exercises)])
  .find((exercise) => exercise.id === id || exercise.legacyIds?.includes(id));

function makeDocument() {
  const createElement = (tag) => {
    const attributes = {};
    const element = {
      tagName: tag.toUpperCase(),
      textContent: '',
      children: [],
      append(child) { this.children.push(child); },
      getAttribute(name) { return attributes[name] ?? null; },
    };
    Object.defineProperty(element, 'href', {
      get() { return attributes.href ?? ''; },
      set(value) { attributes.href = String(value); },
    });
    return element;
  };
  return { createElement, body: createElement('body') };
}

function runModuleSnippet(source) {
  const files = source.match(/^\/\/ format\.mjs\r?\n([\s\S]*?)\r?\n\/\/ main\.mjs\r?\n([\s\S]*)$/);
  assert.ok(files, 'module snippet names its two files');
  const directory = mkdtempSync(join(tmpdir(), 'javascript-module-test-'));
  try {
    writeFileSync(join(directory, 'format.mjs'), files[1].trim() + '\n');
    writeFileSync(join(directory, 'main.mjs'), files[2].trim() + '\n');
    const result = spawnSync(process.execPath, [join(directory, 'main.mjs')], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 5000,
    });
    assert.equal(result.error, undefined, 'module snippet process starts');
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trimEnd();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('the first JavaScript type check explains the typeof result and gives a relevant hint', () => {
  const exercise = getExercise('js-w1-d1-concept-v2');
  const answerText = exercise.choices.find((option) => option.id === exercise.answer)?.text;
  const answerExplanation = exercise.choiceExplanations[exercise.answer];

  assert.equal(answerText, '`typeof minutes`');
  assert.match(exercise.hint, /따옴표/);
  assert.doesNotMatch(exercise.hint, /호출자|반환|return/);
  assert.match(answerExplanation, /typeof minutes/);
  assert.match(answerExplanation, /"number"/);
  assert.match(answerExplanation, /문자열/);
  assert.equal(gradeAnswer(exercise, exercise.answer), true);
});

test('JavaScript foundation choice hints for weeks one through three match the concept', () => {
  const hintsByQuestion = [
    ['js-w1-d3-concept-v3', /total.*score|기존 합계/],
    ['js-w1-d4-concept-v3', /일반 문자열.*변수.*\+/],
    ['js-w1-d5-concept-v3', /계산한 값.*변수에 저장|대입이 필요한지/],
    ['js-w2-d1-concept-v2', /숫자 3.*문자열.*자료형/],
    ['js-w2-d3-concept-v3', /60점.*기준|60점도/],
    ['js-w2-d4-concept-v3', /두 조건.*모두/],
    ['js-w2-d5-concept-v3', /오류 여부.*모두 참|횟수 조건이 모두/],
    ['js-w3-d1-concept-v2', /인덱스는 0부터/],
    ['js-w3-d3-concept-v2', /합계.*반복/],
    ['js-w3-d4-concept-v3', /index가 items\.length/],
    ['js-w3-d5-concept-v3', /누적값.*빈 배열|0부터 시작/],
  ];

  for (const [id, hintPattern] of hintsByQuestion) {
    const exercise = getExercise(id);
    assert.match(exercise.hint, hintPattern, id);
    assert.doesNotMatch(exercise.hint, /문제에서 요구한 동작과 조건을 먼저 확인/, id);
  }
});

test('JavaScript foundation examples introduce variables, conditions, loops, and functions in order', async () => {
  const track = getTrack('javascript');
  const expected = [
    {
      lessonId: 'js-variables',
      titles: ['자료형 확인', '변수 선언 규칙', '대입 연산자', '문자열 연결', '변수 값 갱신'],
      outputs: ['number', 'JavaScript 1', '5', '안녕, 민지', '2'],
      prematureSyntax: /function\s|=>|`|\bfor\s*\(/,
      prematureExercise: /function\s|=>|template literal|백틱|\.reduce\(|\bfor\s*\(/i,
    },
    {
      lessonId: 'js-conditionals',
      titles: ['엄격한 동등 비교', '논리 AND', '조건 분기', '참과 거짓', '재시도 조건'],
      outputs: ['false', 'false', '한 번 더 확인', 'false', 'true'],
      prematureSyntax: /function\s|=>|\.trim\(|Boolean\(/,
      prematureExercise: /function\s|=>|\.trim\(|Boolean\(/,
    },
    {
      lessonId: 'js-loops',
      titles: ['반복 범위', '배열 값 순회', '누적값 유지', '반복 종료', '빈 배열의 합계'],
      outputs: ['0,1,2', '6', '6', 'true false', '12 0'],
      prematureSyntax: /function\s|=>|\.reduce\(/,
      prematureExercise: /function\s|=>|\.reduce\(/,
    },
  ];

  for (const unit of expected) {
    const lesson = track.lessons.find((item) => item.id === unit.lessonId);
    assert.deepEqual(lesson.studyDays.map((day) => day.title.split(' · ').at(-1)), unit.titles, unit.lessonId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unit.lessonId);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.doesNotMatch(day.example, unit.prematureSyntax, `${unit.lessonId}, day ${index + 1}`);
      const output = [];
      await new AsyncFunction('console', day.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
      assert.deepEqual(output, [unit.outputs[index]], `${unit.lessonId}, day ${index + 1}`);
      for (const exercise of day.exercises) {
        assert.doesNotMatch(JSON.stringify(exercise), unit.prematureExercise, exercise.id);
        if (exercise.type === 'choice') assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
        else if (exercise.type === 'short-answer') assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        else if (exercise.type === 'locate-error') assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        else if (exercise.type === 'repair-code') {
          const repairSolutions = new Map([
            ['js-w1-d4-repair-v2', { code: 'const name = "민지";\nconst greeting = "안녕, " + name;\nconsole.log(greeting);', output: ['안녕, 민지'] }],
            ['js-w1-d5-repair-v2', { code: 'let currentAttempt = 1;\ncurrentAttempt += 1;\nconsole.log(currentAttempt);', output: ['2'] }],
            ['js-w2-d4-repair-v2', { code: 'const loggedIn = true;\nconst agreed = false;\nconst canStart = loggedIn && agreed;\nconsole.log(canStart);', output: ['false'] }],
            ['js-w2-d5-repair-v2', { code: 'const hasError = true;\nconst attempts = 3;\nconst canRetry = hasError && attempts < 3;\nconsole.log(canRetry);', output: ['false'] }],
            ['js-w3-d4-repair-v2', { code: 'const items = ["JavaScript", "React"];\nfor (let index = 0; index < items.length; index += 1) {\n  console.log(items[index]);\n}', output: ['JavaScript', 'React'] }],
            ['js-w3-d5-repair-v2', { code: 'const scores = [2, 4, 6];\nlet total = 0;\nfor (const score of scores) total += score;\nconsole.log(total);', output: ['12'] }],
          ]);
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          const solution = repairSolutions.get(exercise.id);
          assert.equal(gradeAnswer(exercise, solution.code), true, exercise.id);
          const output = [];
          await new AsyncFunction('console', solution.code)({ log: (...values) => output.push(values.map(String).join(' ')) });
          assert.deepEqual(output, solution.output, `${exercise.id} repair output`);
          assert.match(exercise.gradingNote, /실행하지 않고/);
        }
        else assert.fail(`Unexpected exercise type before the functions unit: ${exercise.type} (${exercise.id})`);
      }
    }
  }

  const functionsUnit = track.lessons.find((item) => item.id === 'js-functions');
  assert.match(functionsUnit.studyDays[0].example, /function greet/);
  for (const [week, days] of [[1, [3, 4, 5]], [2, [3, 4, 5]], [3, [4, 5]]]) {
    for (const day of days) {
      for (const suffix of day === 5 ? ['concept'] : ['concept', 'debug']) {
        const current = getExercise(`js-w${week}-d${day}-${suffix}-v3`);
        assert.ok(current, `${week}-${day} ${suffix} was reissued with a new version`);
        assert.equal(getExercise(`js-w${week}-d${day}-${suffix}`), current);
        assert.equal(getExercise(`js-w${week}-d${day}-${suffix}-v2`), current);
      }
      if (day >= 4) {
        const repair = getExercise(`js-w${week}-d${day}-repair-v2`);
        assert.ok(repair, `${week}-${day} retains code-writing practice`);
        assert.equal(getExercise(`js-w${week}-d${day}-repair`), repair);
      }
      if (day === 5 || week === 1 && day === 3) {
        const trace = getExercise(`js-w${week}-d${day}-trace-v4`);
        assert.ok(trace, `${week}-${day} trace was reissued with a new version`);
        assert.equal(getExercise(`js-w${week}-d${day}-trace-v3`), trace);
      }
    }
  }
});

test('React performance practice matches the measured filter and leaves trivial memoization to the next day', () => {
  const lesson = getLesson('react-testing-performance');
  const measuredDay = lesson.studyDays[2];
  const debug = measuredDay.exercises.find((exercise) => exercise.id === 'react-test-measure-locate-v3');
  assert.match(measuredDay.example, /filterCourses\(courses, query\), \[courses, query\]/);
  assert.match(debug.codeLines[1], /filterCourses\(courses, query\), \[courses\]/);
  assert.deepEqual(debug.answerLines, [2]);
  assert.match(debug.explanation, /\[courses, query\]/);
  assert.equal(gradeAnswer(debug, [2]), true);
  assert.equal(gradeAnswer(debug, [3]), false);
  assert.equal(lesson.studyDays[3].title, '불필요한 메모 방지');
});

test('G10 React units one through three align original questions with clear daily examples', () => {
  const assignments = [
    {
      lessonId: 'react-components',
      questionId: 'react-components-reuse-choice',
      title: '컴포넌트 이름과 재사용',
      answerText: '입력과 표현 책임이 분명한 작은 컴포넌트',
      exampleMarkers: ['function CourseCard({ title, description })', '<CourseCard title="React"', '<CourseCard title="Java"'],
    },
    {
      lessonId: 'react-props',
      questionId: 'react-props-contract-choice',
      title: 'prop 전달과 읽기 전용',
      answerText: 'props',
      exampleMarkers: ['function CourseTitle({ title })', 'function CoursePage()', '<CourseTitle title="React" />'],
    },
    {
      lessonId: 'react-events-state',
      questionId: 'react-event-choice',
      title: '이벤트 참조와 인자 전달',
      answerText: 'onClick={save}',
      exampleMarkers: ['function CourseActions({ course, save, remove })', 'onClick={save}', 'onClick={() => remove(course.id)}'],
    },
  ];
  const react = getTrack('react');
  const allExercises = react.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));

  for (const expected of assignments) {
    const lesson = getLesson(expected.lessonId);
    const day = lesson.studyDays[1];
    const exercise = getExercise(expected.questionId);

    assert.equal(lesson.studyDays.length, 5, expected.lessonId);
    assert.equal(day.title, expected.title, expected.lessonId);
    assert.equal(day.exercises.length, 3, expected.lessonId);
    assert.equal(day.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(lesson.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(allExercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(exercise.type, 'choice', expected.questionId);
    assert.equal(exercise.studyDay, 2, expected.questionId);
    assert.ok(exercise.hint.length > 25, expected.questionId);
    assert.ok(exercise.explanation.length > 35, expected.questionId);
    assert.equal(gradeAnswer(exercise, exercise.answer), true, expected.questionId);
    assert.equal(exercise.choices.find((item) => item.id === exercise.answer)?.text, expected.answerText, expected.questionId);
    for (const marker of expected.exampleMarkers) assert.ok(day.example.includes(marker), `${expected.lessonId}: ${marker}`);
    for (const option of exercise.choices) {
      assert.ok(exercise.choiceExplanations[option.id]?.length > 25, `${expected.questionId}/${option.id}`);
      assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${expected.questionId}/${option.id}`);
    }
  }

});

test('G10 React units four through six align state, form, and effect questions with complete examples', () => {
  const assignments = [
    {
      lessonId: 'react-state',
      questionId: 'react-state-repair',
      studyDay: 1,
      dayTitle: '객체 복사',
      type: 'repair-code',
      exampleMarkers: ['function ProfileEditor()', 'setProfile({ ...profile, name: nextName })', 'profile.level'],
      acceptedAnswer: 'function rename(nextName) {\n  setProfile({ ...profile, name: nextName });\n}',
    },
    {
      lessonId: 'react-state',
      questionId: 'react-state-copy-choice-v2',
      studyDay: 2,
      dayTitle: '배열 추가',
      type: 'choice',
      answerText: '[...current, course]',
      exampleMarkers: ['function CourseAdder({ course })', 'setCourses((current) => [...current, course])'],
    },
    {
      lessonId: 'react-state',
      questionId: 'react-state-remove-locate-v2',
      studyDay: 3,
      dayTitle: '배열 제거',
      type: 'locate-error',
      answerLines: [2],
      exampleMarkers: ['current.filter((course) => course.id !== idToRemove)', 'key={course.id}'],
      faultyCode: 'course.id === id',
    },
    {
      lessonId: 'react-forms-lists',
      questionId: 'react-form-list-choice-v2',
      studyDay: 1,
      dayTitle: '제어 입력',
      type: 'choice',
      answerText: '`value={title}`와 동기 `onChange` handler',
      exampleMarkers: ['function TitleEditor()', 'value={title}', 'onChange={(event) => setTitle(event.target.value)}'],
    },
    {
      lessonId: 'react-forms-lists',
      questionId: 'react-form-short-v2',
      studyDay: 2,
      dayTitle: 'label 연결',
      type: 'short-answer',
      acceptedAnswer: 'id',
      exampleMarkers: ['htmlFor="course-title"', 'id="course-title"'],
    },
    {
      lessonId: 'react-forms-lists',
      questionId: 'react-list-locate',
      studyDay: 3,
      dayTitle: '안정된 key',
      type: 'locate-error',
      answerLines: [3],
      exampleMarkers: ['key={course.id}'],
      faultyCode: 'key={index}',
    },
    {
      lessonId: 'react-effects-derived-state',
      questionId: 'react-effect-choice-v2',
      studyDay: 1,
      dayTitle: '외부 연결 수명',
      type: 'choice',
      answerText: '`useEffect`와 정리 함수',
      exampleMarkers: ['function createConnection(roomId)', 'return () => connection.disconnect();', '}, [roomId]);'],
    },
    {
      lessonId: 'react-effects-derived-state',
      questionId: 'react-effect-short-v2',
      studyDay: 2,
      dayTitle: '파생 목록',
      type: 'short-answer',
      acceptedAnswer: 'filter',
      exampleMarkers: ['function CompletedCourses({ courses })', 'courses.filter((course) => course.done)', 'key={course.id}'],
    },
    {
      lessonId: 'react-effects-derived-state',
      questionId: 'react-effect-locate-v2',
      studyDay: 3,
      dayTitle: '검색 동기화',
      type: 'locate-error',
      answerLines: [3],
      exampleMarkers: ['function updateSearchLog(query)', 'updateSearchLog(query)', '}, [query]);'],
      faultyCode: '}, []);',
    },
  ];
  const react = getTrack('react');
  const allExercises = react.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));

  for (const expected of assignments) {
    const lesson = getLesson(expected.lessonId);
    const day = lesson.studyDays[expected.studyDay - 1];
    const exercise = getExercise(expected.questionId);

    assert.equal(day.title, expected.dayTitle, expected.questionId);
    assert.equal(day.exercises.length, 3, expected.questionId);
    assert.equal(day.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(lesson.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(allExercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(exercise.type, expected.type, expected.questionId);
    assert.equal(exercise.studyDay, expected.studyDay, expected.questionId);
    assert.ok(exercise.hint.length > 25, expected.questionId);
    assert.ok(exercise.explanation.length > 35, expected.questionId);
    for (const marker of expected.exampleMarkers) assert.ok(day.example.includes(marker), `${expected.questionId}: ${marker}`);

    if (expected.type === 'choice') {
      assert.equal(gradeAnswer(exercise, exercise.answer), true, expected.questionId);
      assert.equal(exercise.choices.find((item) => item.id === exercise.answer)?.text, expected.answerText, expected.questionId);
      for (const option of exercise.choices) {
        assert.ok(exercise.choiceExplanations[option.id]?.length > 25, `${expected.questionId}/${option.id}`);
        assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${expected.questionId}/${option.id}`);
      }
    } else if (expected.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.some((answer) => gradeAnswer(exercise, answer)), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.acceptedAnswer), true, expected.questionId);
    } else if (expected.type === 'repair-code') {
      assert.equal(gradeAnswer(exercise, exercise.starterCode), false, expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.acceptedAnswer), true, expected.questionId);
    } else {
      assert.deepEqual(exercise.answerLines, expected.answerLines, expected.questionId);
      assert.ok(exercise.codeLines[expected.answerLines[0] - 1].includes(expected.faultyCode), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.answerLines), true, expected.questionId);
    }
  }
});

test('G10 React units seven through nine align reducer, Hook, and request questions with their daily examples', () => {
  const assignments = [
    {
      lessonId: 'react-reducer-context',
      questionId: 'react-reducer-choice',
      studyDay: 1,
      dayTitle: '순수 reducer',
      type: 'choice',
      answerText: 'reducer',
      markers: ['const initialState = { open: false, query: "React" }', '...state, open: true', 'return state;'],
    },
    {
      lessonId: 'react-reducer-context',
      questionId: 'react-reducer-action-default-short-v3',
      studyDay: 2,
      dayTitle: '명시적 action',
      type: 'short-answer',
      acceptedAnswer: '현재 state',
      markers: ['function CompleteCourseButton({ course, dispatch })', 'type: "course/complete"', 'id: course.id'],
    },
    {
      lessonId: 'react-reducer-context',
      questionId: 'react-reducer-context-locate-v2',
      studyDay: 3,
      dayTitle: 'Context 소비',
      type: 'locate-error',
      answerLines: [3],
      faultyCode: 'return <span>light</span>;',
      markers: ['useContext(ThemeContext)', '<ThemeContext.Provider value="dark">'],
    },
    {
      lessonId: 'react-custom-hooks',
      questionId: 'react-hook-name-choice-v3',
      studyDay: 1,
      dayTitle: 'Hook 이름',
      type: 'choice',
      answerText: '`useDisclosure`',
      markers: ['import { useState } from "react"', 'function useDisclosure()', 'return { open, setOpen }'],
    },
    {
      lessonId: 'react-custom-hooks',
      questionId: 'react-hook-top-level-short-v2',
      studyDay: 2,
      dayTitle: 'Hook 호출 위치',
      type: 'short-answer',
      acceptedAnswer: '컴포넌트 함수 최상위',
      markers: ['function Panel({ enabled })', 'const [open, setOpen] = useState(false)', 'if (!enabled) return null'],
    },
    {
      lessonId: 'react-custom-hooks',
      questionId: 'react-hook-return-locate-v2',
      studyDay: 3,
      dayTitle: 'Hook 반환 계약',
      type: 'locate-error',
      answerLines: [3],
      faultyCode: 'return open;',
      markers: ['show: () => setOpen(true)', 'hide: () => setOpen(false)'],
    },
    {
      lessonId: 'react-async-data',
      questionId: 'react-async-choice-v2',
      studyDay: 1,
      dayTitle: '요청 상태 모델',
      type: 'choice',
      answerText: '`status`를 idle, loading, success, error 중 하나로 관리합니다.',
      markers: ['function RequestStatus()', 'useState("idle")', '현재 요청 상태: {status}'],
    },
    {
      lessonId: 'react-async-data',
      questionId: 'react-async-loading-short-v2',
      studyDay: 2,
      dayTitle: '로딩 시작',
      type: 'short-answer',
      acceptedAnswer: 'loading',
      markers: ['async function loadCourses(query, fetchCourses, setStatus)', 'setStatus("loading")', 'await fetchCourses(query)', 'setStatus("error")'],
    },
    {
      lessonId: 'react-async-data',
      questionId: 'react-async-locate',
      studyDay: 3,
      dayTitle: '이전 요청 취소',
      type: 'locate-error',
      answerLines: [2],
      faultyCode: 'fetchCourses(query).then(setCourses);',
      markers: ['function load(query, signal)', 'load(query, controller.signal)', 'return () => controller.abort();', '}, [query]);'],
    },
  ];
  const react = getTrack('react');
  const allExercises = react.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));

  for (const expected of assignments) {
    const lesson = getLesson(expected.lessonId);
    const day = lesson.studyDays[expected.studyDay - 1];
    const exercise = getExercise(expected.questionId);

    assert.equal(day.title, expected.dayTitle, expected.questionId);
    assert.equal(day.exercises.length, 3, expected.questionId);
    assert.equal(day.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(lesson.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(allExercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(exercise.type, expected.type, expected.questionId);
    assert.equal(exercise.studyDay, expected.studyDay, expected.questionId);
    assert.ok(exercise.hint.length > 25, expected.questionId);
    assert.ok(exercise.explanation.length > 35, expected.questionId);
    for (const marker of expected.markers) assert.ok(day.example.includes(marker), `${expected.questionId}: ${marker}`);

    if (expected.type === 'choice') {
      assert.equal(gradeAnswer(exercise, exercise.answer), true, expected.questionId);
      assert.equal(exercise.choices.find((item) => item.id === exercise.answer)?.text, expected.answerText, expected.questionId);
      for (const option of exercise.choices) {
        assert.ok(exercise.choiceExplanations[option.id]?.length > 25, `${expected.questionId}/${option.id}`);
        assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${expected.questionId}/${option.id}`);
      }
    } else if (expected.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.some((answer) => gradeAnswer(exercise, answer)), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.acceptedAnswer), true, expected.questionId);
    } else {
      assert.deepEqual(exercise.answerLines, expected.answerLines, expected.questionId);
      assert.ok(exercise.codeLines[expected.answerLines[0] - 1].includes(expected.faultyCode), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.answerLines), true, expected.questionId);
    }
  }
});

test('G10 React units ten through twelve align accessibility, testing, and capstone questions with complete examples', () => {
  const assignments = [
    {
      lessonId: 'react-routing-accessibility',
      questionId: 'react-route-choice',
      studyDay: 1,
      dayTitle: '주소 이동 링크',
      type: 'choice',
      answerText: '목적지가 있는 링크',
      markers: ['<a href="/tracks/react">React 과정</a>'],
    },
    {
      lessonId: 'react-routing-accessibility',
      questionId: 'react-action-button-short-v2',
      studyDay: 2,
      dayTitle: '동작 버튼',
      type: 'short-answer',
      acceptedAnswer: 'button',
      markers: ['function CourseDetails()', 'useState(false)', 'onClick={() => setExpanded((current) => !current)}'],
    },
    {
      lessonId: 'react-routing-accessibility',
      questionId: 'react-route-focus-locate-v2',
      studyDay: 3,
      dayTitle: '목적지 이후 포커스',
      type: 'locate-error',
      answerLines: [3],
      faultyCode: 'scrollIntoView()',
      markers: ['function CoursePage({ course, pathname })', 'headingRef.current?.focus()', '[pathname]', 'tabIndex={-1}'],
    },
    {
      lessonId: 'react-testing-performance',
      questionId: 'react-test-role-choice-v2',
      studyDay: 1,
      dayTitle: '사용자 역할 조회',
      type: 'choice',
      answerText: '`screen.getByRole("button", { name: "저장" })`',
      markers: ['@testing-library/react', 'screen.getByRole("button", { name: "저장" })'],
    },
    {
      lessonId: 'react-testing-performance',
      questionId: 'react-test-result-short-v2',
      studyDay: 2,
      dayTitle: '사용자 동작',
      type: 'short-answer',
      acceptedAnswer: '저장했어요',
      markers: ['userEvent.setup()', 'await user.click(', 'getByRole("status")', '저장했어요'],
    },
    {
      lessonId: 'react-testing-performance',
      questionId: 'react-test-measure-locate-v3',
      studyDay: 3,
      dayTitle: '측정한 계산 최적화',
      type: 'locate-error',
      answerLines: [2],
      faultyCode: 'useMemo(() => filterCourses(courses, query), [courses])',
      markers: ['function CourseResults({ courses, query })', 'useMemo(() => filterCourses(courses, query), [courses, query])'],
    },
    {
      lessonId: 'react-architecture-capstone',
      questionId: 'react-capstone-choice',
      studyDay: 1,
      dayTitle: '화면 상태 책임',
      type: 'choice',
      answerText: '해당 목록 컴포넌트의 로컬 상태',
      markers: ['function RecentAnswersPanel()', 'useState(false)'],
    },
    {
      lessonId: 'react-architecture-capstone',
      questionId: 'react-disclosure-state-short-v2',
      studyDay: 2,
      dayTitle: '의미 있는 조작',
      type: 'short-answer',
      acceptedAnswer: 'true',
      markers: ['aria-expanded={expanded}', 'aria-controls="recent-answers"', 'hidden={!expanded}'],
    },
    {
      lessonId: 'react-architecture-capstone',
      questionId: 'react-capstone-empty-locate-v2',
      studyDay: 3,
      dayTitle: '빈 기록 안내',
      type: 'locate-error',
      answerLines: [2],
      faultyCode: 'if (answers.length === 0) return null;',
      markers: ['function RecentAnswers({ answers })', '아직 답안이 없습니다.', '<a href="/tracks">과정 선택</a>'],
    },
  ];
  const react = getTrack('react');
  const allExercises = react.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));

  for (const expected of assignments) {
    const lesson = getLesson(expected.lessonId);
    const day = lesson.studyDays[expected.studyDay - 1];
    const exercise = getExercise(expected.questionId);

    assert.equal(day.title, expected.dayTitle, expected.questionId);
    assert.equal(day.exercises.length, 3, expected.questionId);
    assert.equal(day.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(lesson.exercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(allExercises.filter((item) => item.id === expected.questionId).length, 1, expected.questionId);
    assert.equal(exercise.type, expected.type, expected.questionId);
    assert.equal(exercise.studyDay, expected.studyDay, expected.questionId);
    assert.ok(exercise.hint.length > 25, expected.questionId);
    assert.ok(exercise.explanation.length > 35, expected.questionId);
    for (const marker of expected.markers) assert.ok(day.example.includes(marker), `${expected.questionId}: ${marker}`);

    if (expected.type === 'choice') {
      assert.equal(gradeAnswer(exercise, exercise.answer), true, expected.questionId);
      assert.equal(exercise.choices.find((item) => item.id === exercise.answer)?.text, expected.answerText, expected.questionId);
      for (const option of exercise.choices) {
        assert.ok(exercise.choiceExplanations[option.id]?.length > 25, `${expected.questionId}/${option.id}`);
        assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${expected.questionId}/${option.id}`);
      }
    } else if (expected.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.some((answer) => gradeAnswer(exercise, answer)), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.acceptedAnswer), true, expected.questionId);
    } else {
      assert.deepEqual(exercise.answerLines, expected.answerLines, expected.questionId);
      assert.ok(exercise.codeLines[expected.answerLines[0] - 1].includes(expected.faultyCode), expected.questionId);
      assert.equal(gradeAnswer(exercise, expected.answerLines), true, expected.questionId);
    }
  }
});

test('generated JavaScript repairs require a complete accepted code sample', () => {
  const repairs = trackById('javascript').lessons
    .flatMap((lesson) => lesson.exercises)
    .filter((exercise) => exercise.type === 'repair-code' && exercise.id.startsWith('js-w') && /^\s*(?:(?:async\s+)?function\*?\s|class\s)/.test(exercise.starterCode));
  const allRepairs = trackById('javascript').lessons.flatMap((lesson) => lesson.exercises)
    .filter((exercise) => exercise.type === 'repair-code' && exercise.id.startsWith('js-w'));

  assert.equal(repairs.length, 46);
  assert.equal(allRepairs.length, 52);
  for (const exercise of repairs) {
    assert.match(exercise.solutionPatterns[0], /^\^/);
    assert.match(exercise.solutionPatterns[0], /\$$/);
    assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
  }

  const sortedCopy = questionById('js-w5-d4-repair');
  assert.equal(gradeAnswer(sortedCopy, 'function sortedCopy(names) {\n  return [...names].sort();\n}'), true);
  assert.equal(gradeAnswer(sortedCopy, 'function sortedCopy(names) {\n  return names;\n  return [...names].sort();\n}'), false);
  assert.equal(gradeAnswer(sortedCopy, 'not code function sortedCopy(names) { return [...names].sort(); }'), false);
});

test('generated React repairs reject unchanged starters and accept required corrections', () => {
  const repairs = trackById('react').lessons
    .flatMap((lesson) => lesson.exercises)
    .filter((exercise) => exercise.type === 'repair-code' && exercise.id.startsWith('react-w'));

  assert.equal(repairs.length, 52);
  for (const exercise of repairs) {
    assert.match(exercise.solutionPatterns[0], /^\^/);
    assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
  }

  const shouldApplyResponse = questionById('react-w13-d4-repair-v2');
  assert.equal(gradeAnswer(shouldApplyResponse, 'function shouldApplyResponse(activeId, responseId) { return activeId === responseId; }'), true);
  assert.equal(gradeAnswer(shouldApplyResponse, 'function shouldApplyResponse(activeId, responseId) {\n  return true;\n  return activeId === responseId;\n}'), false);
});

test('React later-week sessions show their distinct learning focus instead of a structural-draft label', () => {
  const reactWeeks = trackById('react').lessons.filter((lesson) => lesson.week >= 13);
  assert.equal(reactWeeks.length, 14);
  for (const lesson of reactWeeks) {
    const titles = lesson.sessions.map((session) => session.title);
    assert.equal(new Set(titles).size, 5, lesson.id);
    assert.ok(titles.every((title) => !title.includes('구조 초안')), lesson.id);
  }
});

test('React weeks thirteen through twenty-six keep learner-facing copy concise and specific', () => {
  const react = trackById('react');
  const laterWeeks = react.lessons.filter((lesson) => lesson.week >= 13);
  const allExercises = react.lessons.flatMap((lesson) => lesson.sessions.flatMap((session) => session.exercises));
  const exerciseIds = allExercises.map((exercise) => exercise.id);

  assert.equal(react.lessons.length, 26);
  assert.equal(laterWeeks.length, 14);
  assert.equal(allExercises.length, 390);
  assert.equal(new Set(exerciseIds).size, 390);

  for (const lesson of laterWeeks) {
    assert.doesNotMatch(lesson.title, /^\d+주차\s*[·:]/, lesson.id);
    assert.match(lesson.objective, /요\.$/, lesson.id);
    assert.equal(lesson.intro, '', lesson.id);
    assert.deepEqual(lesson.points, [], lesson.id);
    assert.equal(lesson.sessions.length, 5, lesson.id);

    for (const session of lesson.sessions) {
      assert.match(session.objective, /요\.$/, `${lesson.id}/${session.number}`);
      assert.equal(session.intro, '', `${lesson.id}/${session.number}`);
      assert.equal(session.exercises.length, 3, `${lesson.id}/${session.number}`);

      for (const exercise of session.exercises) {
        assert.doesNotMatch(exercise.prompt, /핵심 개념을 읽으며|값의 흐름을 따라가며|실패 경로를 점검하며|구현 전에 설계하며|주간 복습에서/, exercise.id);
        assert.doesNotMatch(exercise.explanation, /React의 기본 데이터 흐름을 함께 만족|React에서는 값을 직접 바꾸기보다 새 상태 또는 명시적인 JSX를 반환해 흐름을 읽기 쉽게 만듭니다\./, exercise.id);
        for (const explanation of Object.values(exercise.choiceExplanations ?? {})) {
          assert.doesNotMatch(explanation, /필요한 값·상태·접근성 조건을 만족하지 않습니다|React의 데이터 흐름에 맞습니다\./, exercise.id);
        }
      }
    }
  }
});

test('JavaScript weeks one through twelve use day-specific implementation cases', () => {
  const javascript = trackById('javascript');
  for (let week = 1; week <= 12; week += 1) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    const dayFour = lesson.sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
    const dayFive = lesson.sessions[4].exercises.find((exercise) => exercise.type === 'repair-code');
    if (week <= 3) {
      assert.ok(dayFour && dayFive, `JavaScript week ${week} keeps code-writing practice`);
      assert.doesNotMatch(dayFour.starterCode + dayFive.starterCode, /function\s|=>/i, `JavaScript week ${week} uses only taught syntax`);
      assert.ok(lesson.sessions[3].exercises.some((exercise) => exercise.type === 'locate-error'), `JavaScript week ${week} checks a concrete failure`);
      assert.ok(lesson.sessions[4].exercises.some((exercise) => exercise.type === 'short-answer'), `JavaScript week ${week} traces the week's final example`);
      assert.equal(gradeAnswer(dayFour, dayFour.starterCode), false, dayFour.id);
      assert.equal(gradeAnswer(dayFive, dayFive.starterCode), false, dayFive.id);
      continue;
    }
    assert.notEqual(dayFour.starterCode, dayFive.starterCode, `js week ${week}`);
    assert.notEqual(dayFour.acceptanceCriteria.requirements[0], dayFive.acceptanceCriteria.requirements[0], `js week ${week}`);
    assert.equal(gradeAnswer(dayFour, dayFour.starterCode), false, dayFour.id);
    assert.equal(gradeAnswer(dayFive, dayFive.starterCode), false, dayFive.id);
  }
});

test('React weeks one through twelve use day-specific implementation cases', () => {
  const react = trackById('react');
  for (let week = 1; week <= 12; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    const dayFour = lesson.sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
    const dayFive = lesson.sessions[4].exercises.find((exercise) => exercise.type === 'repair-code');
    assert.notEqual(dayFour.starterCode, dayFive.starterCode, `react week ${week}`);
    assert.notEqual(dayFour.acceptanceCriteria.requirements[0], dayFive.acceptanceCriteria.requirements[0], `react week ${week}`);
    assert.equal(gradeAnswer(dayFour, dayFour.starterCode), false, dayFour.id);
    assert.equal(gradeAnswer(dayFive, dayFive.starterCode), false, dayFive.id);
  }
});

test('JavaScript capstone week twelve aligns its five daily cases with the statistics objective', () => {
  const lesson = trackById('javascript').lessons.find((item) => item.week === 12);
  assert.deepEqual(lesson.studyDays.map((day) => day.title), [
    '1일차 · 요구사항과 평균',
    '2일차 · 빈 입력과 누적',
    '3일차 · 완료 기록 갱신',
    '4일차 · 복잡도 점검',
    '5일차 · 통합 검토',
  ]);
  assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5);
  assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3));

  const all = lesson.studyDays.flatMap((day) => day.exercises);
  for (const exercise of all) {
    if (exercise.type === 'choice') {
      assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
      for (const option of exercise.choices.filter((item) => item.id !== exercise.answer)) {
        assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
        assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id} explains each distractor`);
      }
      assert.ok(exercise.choiceExplanations[exercise.answer].length > 25, `${exercise.id} explains the correct choice`);
    }
    if (exercise.type === 'short-answer') assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
    if (exercise.type === 'locate-error') assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
    if (exercise.type === 'repair-code') assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
  }

  const averageRepair = questionById('js-w12-d4-average-repair');
  assert.equal(gradeAnswer(averageRepair, 'function average(scores) {\n  if (scores.length === 0) return 0;\n  return scores.reduce((sum, score) => sum + score, 0) / scores.length;\n}'), true);
  const completionRepair = questionById('js-w12-d5-completion-repair');
  assert.equal(gradeAnswer(completionRepair, 'function addCompletion(completed, lessonId) {\n  if (completed.includes(lessonId)) return completed;\n  return [...completed, lessonId];\n}'), true);
  const average = new Function('function average(scores) { if (scores.length === 0) return 0; return scores.reduce((sum, score) => sum + score, 0) / scores.length; }\nreturn average;')();
  assert.equal(average([60, 80, 100]), 80);
  assert.equal(average([]), 0);
  const addCompletion = new Function('function addCompletion(completed, lessonId) { if (completed.includes(lessonId)) return completed; return [...completed, lessonId]; }\nreturn addCompletion;')();
  const completed = ['js'];
  const next = addCompletion(completed, 'react');
  assert.deepEqual(completed, ['js']);
  assert.deepEqual(next, ['js', 'react']);
  assert.equal(addCompletion(next, 'react'), next);
});

test('JavaScript capstone week twelve overview and daily examples run with their published outputs', async () => {
  const lesson = trackById('javascript').lessons.find((item) => item.week === 12);
  const expected = [
    ['true 80'],
    ['0 80'],
    ['js js,react true'],
    ['240 0'],
    ['{"average":90,"completed":["js","react"]} true'],
  ];
  for (const [index, code] of [lesson.example, ...lesson.sessions.map((session) => session.example)].entries()) {
    const output = [];
    const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
    await new AsyncFunction('console', code)(logger);
    assert.deepEqual(output, [index === 0 ? '80 0' : expected[index - 1][0]], index === 0 ? 'week overview' : lesson.sessions[index - 1].title);
  }
});

test('JavaScript final-week examples match each capstone day and its trace prompt', () => {
  const lesson = trackById('javascript').lessons.find((item) => item.week === 26);
  assert.match(lesson.example, /lessons\.reduce[\s\S]*\{ total: 0, completed: 0 \}/);
  assert.match(lesson.example, /console\.log\(JSON\.stringify\(summary\)\)/);
  for (const day of lesson.studyDays) {
    const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
    if (!trace) continue;
    const match = trace.prompt.match(/\n\n`([\s\S]+?)`$/);
    assert.ok(match, trace.id);
    assert.equal(day.example, match[1], day.title);
  }
  assert.match(lesson.studyDays[0].example, /lessons\.reduce/);
  assert.match(lesson.studyDays[2].example, /createElement\("a"\)/);
  assert.match(lesson.studyDays[3].example, /error/);
  assert.match(lesson.studyDays[3].example, /empty/);
  assert.match(lesson.studyDays[4].example, /buildReport/);
});

test('JavaScript weeks use separate daily foundations for judgment, output, and errors', () => {
  const javascript = trackById('javascript');
  for (let week = 1; week <= 26; week += 1) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    const firstDays = lesson.sessions.slice(0, 3);
    const prompts = firstDays.flatMap((session) => session.exercises.map((exercise) => exercise.prompt));
    assert.equal(new Set(prompts).size, prompts.length, `js week ${week}`);
    const errorCases = firstDays.flatMap((session) => session.exercises).filter((exercise) => exercise.type === 'locate-error');
    assert.ok(errorCases.every((exercise) => gradeAnswer(exercise, exercise.answerLines)), `js week ${week}`);
    assert.equal(new Set(errorCases.map((exercise) => exercise.codeLines.join('\n'))).size, errorCases.length, `js week ${week}`);
  }
});

test('JavaScript foundation weeks one through eleven teach and grade each daily example correctly', async () => {
  const javascript = trackById('javascript');
  const expectedByWeek = {
    1: [['number'], ['JavaScript 1'], ['5'], ['안녕, 민지'], ['2']],
    2: [['false'], ['false'], ['한 번 더 확인'], ['false'], ['true']],
    3: [['0,1,2'], ['6'], ['6'], ['true false'], ['12 0']],
    4: [['안녕, 민'], ['8'], ['안녕, 학습자 안녕, 민'], ['안녕, 학습자 안녕, 학습자 안녕, null'], ['JS (기초)']],
    5: [['Python'], ['JS,React'], ['60,90'], ['a,b b,a'], ['React null']],
    6: [['민'], ['소개 없음'], ['민 2'], ['Python: 30분'], ['1 2 민']],
    7: [['안쪽', '바깥'], ['함수 안'], ['1 2 1'], ['1 2'], ['1 1 2']],
    8: [['JS'], ['JS'], ['title is required'], ['12 12 null null'], ['일반 제목 통과', '공백 제목 통과', '숫자 입력 통과']],
    9: [['true'], ['React null'], ['<b>저장됨</b>'], ['React null'], ['<b>제목을 입력하세요</b>', '<b>React</b> 저장됨']],
    10: [['React'], ['HTTP 404'], ['network: offline'], ['2'], ['/courses true true']],
    11: [['A, D, B, C'], ['sync, timer'], ['sync, promise, queued, timer'], ['1', 'ready'], ['queued function', 'chunk']],
  };

  for (const [week, expected] of [
    [1, ['JavaScript: 1']], [2, ['통과']], [3, ['9']], [4, ['8']], [5, ['9']], [6, ['Mina']],
    [7, ['안쪽', '바깥']], [8, ['JavaScript']], [9, ['React null']],
    [10, ['React']], [11, ['A, D, B, C']],
  ]) {
    const output = [];
    const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
    const overviewExample = trackById('javascript').lessons.find((item) => item.week === week).example;
    if (week === 8) output.push(runModuleSnippet(overviewExample));
    else await new AsyncFunction('console', overviewExample)(logger);
    assert.deepEqual(output, expected, `week ${week} overview example`);
  }

  for (const week of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `week ${week} has five lessons`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `week ${week} has distinct examples`);

    for (const [index, session] of lesson.sessions.entries()) {
      assert.ok(session.objective.length > 25, session.title);
      assert.ok(session.intro.length > 45, session.title);
      const output = [];
      const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
      if (week === 8 && index < 2) output.push(runModuleSnippet(session.example));
      else if (week === 9) {
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
        const document = { querySelector(selector) { return elements.get(selector) ?? null; } };
        await new AsyncFunction('console', 'document', session.example)(logger, document);
        if (index === 0) assert.equal(form.lastEvent.defaultPrevented, true, session.title);
      } else await new AsyncFunction('console', session.example)(logger);
      assert.deepEqual(output, expectedByWeek[week][index], session.title);

      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const wrong of exercise.choices.filter((choice) => choice.id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, wrong.id), false, exercise.id);
            assert.ok(exercise.choiceExplanations[wrong.id].length > 20, `${exercise.id} has useful distractor feedback`);
          }
          assert.ok(exercise.choiceExplanations[exercise.answer].length > 20, `${exercise.id} has useful correct feedback`);
        }
        if (exercise.type === 'short-answer') {
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, 'not the expected output'), false, exercise.id);
          if (exercise.id.startsWith('js-w')) {
            assert.ok(exercise.explanation.length > 20, exercise.id + ' explains the output');
            assert.doesNotMatch(exercise.explanation, /선언, 호출, 연산을 차례대로 추적/);
            const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
            assert.ok(match, `${exercise.id} includes traceable code`);
            const traceOutput = [];
            if (match[1].startsWith('// format.mjs')) traceOutput.push(runModuleSnippet(match[1]));
            else {
              const logger = { log: (...values) => traceOutput.push(values.map(String).join(' ')) };
              await new AsyncFunction('console', match[1])(logger);
            }
            assert.equal(gradeAnswer(exercise, traceOutput.join('\n')), true, `${exercise.id} accepts its actual output`);
          }
        }
        if (exercise.type === 'locate-error') {
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.equal(gradeAnswer(exercise, []), false, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.ok(exercise.explanation.length > exercise.acceptanceCriteria.requirements[0].length + 20, exercise.id);
        }
      }
    }
  }

  for (const [id, submission] of [
    ['js-w1-d4-repair', 'const name = "민지"; const greeting = "안녕, " + name; console.log(greeting);'],
    ['js-w1-d5-repair', 'let currentAttempt = 1; currentAttempt += 1; console.log(currentAttempt);'],
    ['js-w2-d4-repair', 'const loggedIn = true; const agreed = false; const canStart = loggedIn && agreed; console.log(canStart);'],
    ['js-w2-d5-repair', 'const hasError = true; const attempts = 3; const canRetry = hasError && attempts < 3; console.log(canRetry);'],
    ['js-w3-d4-repair', 'const items = ["JavaScript", "React"]; for (let index = 0; index < items.length; index += 1) { console.log(items[index]); }'],
    ['js-w3-d5-repair', 'const scores = [2, 4, 6]; let total = 0; for (const score of scores) total += score; console.log(total);'],
    ['js-w4-d4-repair', 'function withDefault(name = "학습자") { return `안녕, ${name}`; }'],
    ['js-w4-d5-repair', 'function courseLabel(title, level) { return `${title} (${level})`; }'],
    ['js-w5-d4-repair', 'function sortedCopy(names) { return [...names].sort(); }'],
    ['js-w5-d5-repair', 'function lastVisible(items) { return items.length === 0 ? null : items[items.length - 1]; }'],
    ['js-w6-d4-repair', 'function courseSummary(course) { return `${course.title}: ${course.minutes}분`; }'],
    ['js-w6-d5-repair', 'function updateLevel(profile, level) { return { ...profile, level }; }'],
    ['js-w7-d4-repair-v2', 'function makeCounter() { let count = 0; return () => ++count; }'],
    ['js-w7-d5-repair-v2', 'function makeCounterPair() { let count = 0; return [() => ++count, () => ++count]; }'],
    ['js-w8-d4-repair-v2', 'function parseAttempt(raw) { if (typeof raw !== "string" || raw.trim() === "") return null; const value = Number(raw); return Number.isInteger(value) ? value : null; }'],
    ['js-w8-d5-repair-v2', 'function isUsableTitle(title) { return typeof title === "string" && title.trim().length > 0; }'],
    ['js-w9-d4-repair-v2', 'function readTitle(input) { const title = input.value.trim(); return title.length > 0 ? title : null; }'],
    ['js-w9-d5-repair-v2', 'function showMessage(element, message) { element.textContent = message; }'],
    ['js-w10-d4-repair-v2', 'function readJson(response) { return response.json(); }'],
    ['js-w10-d5-repair-v2', 'function requestWithSignal(url, controller) { return fetch(url, { signal: controller.signal }); }'],
    ['js-w11-d4-repair-v2', 'function scheduleRender(update, requestFrame) { return requestFrame(() => update("ready")); }'],
    ['js-w11-d5-repair-v2', 'function scheduleChunk(work, scheduleTask) { return scheduleTask(work); }'],
  ]) {
    assert.equal(gradeAnswer(questionById(id), submission), true, id);
  }

  const defaultArgumentRepair = questionById('js-w4-d4-repair');
  assert.equal(gradeAnswer(defaultArgumentRepair, 'function withDefault(name = "학습자") { return `안녕, ${name}`; }'), true);
  assert.equal(gradeAnswer(defaultArgumentRepair, 'function withDefault(name) { return `안녕, ${name}`; }'), false);
  assert.equal(gradeAnswer(defaultArgumentRepair, 'function withDefault(name, extra) { return `안녕, ${name}`; }'), false);

  const runFunction = (source, name) => new Function(`${source}; return ${name};`)();
  const nextCount = runFunction('function makeCounter() { let count = 0; return () => ++count; }', 'makeCounter')();
  assert.deepEqual([nextCount(), nextCount()], [1, 2]);
  const [first, second] = runFunction('function makeCounterPair() { let count = 0; return [() => ++count, () => ++count]; }', 'makeCounterPair')();
  assert.deepEqual([first(), second(), first()], [1, 2, 3]);
  const parseAttempt = runFunction('function parseAttempt(raw) { if (typeof raw !== "string" || raw.trim() === "") return null; const value = Number(raw); return Number.isInteger(value) ? value : null; }', 'parseAttempt');
  assert.deepEqual(['12', '12.0', '2.5', ' ', 4].map(parseAttempt), [12, 12, null, null, null]);
  assert.equal(Number('2.5'), 2.5, 'Number parses a decimal string as a number, not NaN');
  const isUsableTitle = runFunction('function isUsableTitle(title) { return typeof title === "string" && title.trim().length > 0; }', 'isUsableTitle');
  assert.deepEqual(['React', '   ', null].map(isUsableTitle), [true, false, false]);
  const readTitle = runFunction('function readTitle(input) { const title = input.value.trim(); return title.length > 0 ? title : null; }', 'readTitle');
  assert.deepEqual([{ value: ' React ' }, { value: ' ' }].map(readTitle), ['React', null]);
  const showMessage = runFunction('function showMessage(element, message) { element.textContent = message; }', 'showMessage');
  const preview = { textContent: '' };
  showMessage(preview, '<b>제목을 입력하세요</b>');
  assert.equal(preview.textContent, '<b>제목을 입력하세요</b>');
  const readJson = runFunction('function readJson(response) { return response.json(); }', 'readJson');
  assert.deepEqual(await readJson({ json: async () => ({ title: 'React' }) }), { title: 'React' });
  let sentSignal;
  const requestWithSignal = new Function('fetch', 'function requestWithSignal(url, controller) { return fetch(url, { signal: controller.signal }); }\nreturn requestWithSignal;')((url, options) => {
    sentSignal = options.signal;
    return url;
  });
  const controller = { signal: { aborted: false } };
  assert.equal(requestWithSignal('/courses', controller), '/courses');
  assert.equal(sentSignal, controller.signal);
  const scheduledFrames = [];
  const scheduleRender = runFunction('function scheduleRender(update, requestFrame) { return requestFrame(() => update("ready")); }', 'scheduleRender');
  let rendered;
  assert.equal(scheduleRender((value) => { rendered = value; }, (callback) => { scheduledFrames.push(callback); return 7; }), 7);
  assert.equal(rendered, undefined);
  scheduledFrames[0]();
  assert.equal(rendered, 'ready');
  let scheduledWork;
  const scheduleChunk = runFunction('function scheduleChunk(work, scheduleTask) { return scheduleTask(work); }', 'scheduleChunk');
  let workRan = false;
  assert.equal(scheduleChunk(() => { workRan = true; }, (callback) => { scheduledWork = callback; return 'queued'; }), 'queued');
  assert.equal(workRan, false);
  scheduledWork();
  assert.equal(workRan, true);

  for (const [id, expected] of [
    ['js-w2-d5-trace-v4', 'true'],
    ['js-w3-d5-trace-v4', '12 0'],
    ['js-w4-d5-trace-v2', 'JS (기초)'],
    ['js-w5-d5-trace-v2', 'React null'],
    ['js-w6-d5-trace-v2', '1 2 민'],
    ['js-w7-d5-trace-v2', '1 1 2'],
    ['js-w8-d5-trace-v2', 'true false false'],
    ['js-w9-d2-trace-v2', 'React null'],
    ['js-w9-d5-trace-v2', '<b>제목을 입력하세요</b>'],
  ]) {
    const trace = questionById(id);
    assert.deepEqual(trace.acceptedAnswers, [expected], id);
    assert.equal(gradeAnswer(trace, expected), true, id);
    if (expected.includes(' ')) {
      for (const partial of expected.split(' ')) assert.equal(gradeAnswer(trace, partial), false, `${id} rejects partial output`);
    }
  }
  assert.match(questionById('js-w11-d1-trace-v2').explanation, /before, inside, after, promise/);
  assert.match(questionById('js-w11-d2-trace-v2').hint, /sync.*timer/);
  assert.match(questionById('js-w11-d5-trace-v2').explanation, /yield, chunk/);

  for (const oldId of ['js-functions-parameter', 'js-functions-callback', 'js-arrays-map-return', 'js-arrays-shared-mutation', 'js-scope-block', 'js-closures-independent', 'js-errors-swallowed', 'js-dom-submit', 'js-dom-trim']) {
    assert.equal(questionById(oldId), undefined, `${oldId} was replaced after its topic changed`);
  }
  for (const currentId of ['js-functions-return-value', 'js-functions-default-argument', 'js-arrays-append-immutable', 'js-arrays-filter-map', 'js-scope-tdz', 'js-scope-function-return', 'js-modules-namespace-import', 'js-dom-normalized-save', 'js-dom-safe-text']) {
    assert.ok(questionById(currentId), `${currentId} is present in the revised course`);
  }
});

test('JavaScript weeks thirteen through fifteen use complete examples and topic-matched daily problems', async () => {
  const javascript = trackById('javascript');
  const expected = {
    13: { overview: ['café js'], days: [['react'], ['JS 기초'], ['false', 'true'], ['0'], ['"café js"']] },
    14: { overview: ['2000'], days: [['2026-10-11T09:00:00.000Z'], ['2000'], ['18:00'], ['false true'], ['2']] },
    15: { overview: ['js:2,py:1 2'], days: [['2 true'], ['2'], ['true false'], ['js:2,py:1'], ['js,py true 0']] },
  };

  for (const week of [13, 14, 15]) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    assert.ok(lesson.objective.length > 40, lesson.id);
    assert.match(lesson.example, /console\.log\([\s\S]*\/\//, `${lesson.id} overview prints its result`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, lesson.id);

    if (week === 13) {
      assert.match(lesson.objective, /영문 대소문자/);
      assert.match(lesson.sessions[0].intro, /다른 언어.*문자 비교 정책/);
    }

    for (const [index, session] of lesson.sessions.entries()) {
      assert.ok(session.objective.length > 35, session.title);
      assert.ok(session.intro.length > 45, session.title);
      const output = [];
      const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
      await new AsyncFunction('console', session.example)(logger);
      assert.deepEqual(output, expected[week].days[index], session.title);

      for (const exercise of session.exercises) {
        assert.match(exercise.id, /-v[23]$/, `${exercise.id} preserves prior local completion history`);
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 20, `${exercise.id}: ${option.id} feedback`);
            assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${exercise.id}: ${option.id}`);
          }
          if (exercise.id === 'js-w14-d5-dst-v2') {
            const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
            assert.ok(match, `${exercise.id} contains the elapsed-time case`);
            const caseOutput = [];
            await new AsyncFunction('console', match[1])({ log: (...values) => caseOutput.push(values.map(String).join(' ')) });
            assert.deepEqual(caseOutput, ['1'], `${exercise.id} measures the actual elapsed hour across DST`);
          }
        }
        if (exercise.type === 'short-answer') {
          const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
          assert.ok(match, `${exercise.id} contains the code being graded`);
          const traceOutput = [];
          await new AsyncFunction('console', 'performance', 'AbortController', match[1])(
            { log: (...values) => traceOutput.push(values.map(String).join(' ')) },
            globalThis.performance,
            globalThis.AbortController,
          );
          assert.equal(gradeAnswer(exercise, traceOutput.join('\n')), true, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.explanation.length > 45, `${exercise.id} identifies why the line fails`);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has a boundary case`);
          assert.ok(exercise.gradingNote.includes('실행'), `${exercise.id} discloses static grading`);
        }
      }
    }

    const overview = [];
    await new AsyncFunction('console', lesson.example)({ log: (...values) => overview.push(values.map(String).join(' ')) });
    assert.deepEqual(overview, expected[week].overview, `${lesson.id} weekly example`);
  }

  const normalizeQuery = new Function('function normalizeQuery(query) { return query.trim().toLowerCase(); } return normalizeQuery;')();
  assert.equal(gradeAnswer(questionById('js-w13-d4-repair-v2'), 'function normalizeQuery(query) { return query.trim().toLowerCase(); }'), true);
  assert.equal(normalizeQuery('  React  '), 'react');
  const normalizeTag = new Function('function normalizeTag(tag) { return tag.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase(); } return normalizeTag;')();
  assert.equal(gradeAnswer(questionById('js-w13-d5-repair-v2'), 'function normalizeTag(tag) { return tag.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase(); }'), true);
  assert.equal(normalizeTag('  Cafe\u0301   JS  '), 'café js');
  const isValidDate = new Function('function isValidDate(date) { return date instanceof Date && !Number.isNaN(date.getTime()); } return isValidDate;')();
  assert.equal(gradeAnswer(questionById('js-w14-d4-repair-v2'), 'function isValidDate(date) { return date instanceof Date && !Number.isNaN(date.getTime()); }'), true);
  assert.equal(isValidDate(new Date('bad')), false);
  const hoursBetween = new Function('function hoursBetween(start, end) { return (end.getTime() - start.getTime()) / 3600000; } return hoursBetween;')();
  assert.equal(gradeAnswer(questionById('js-w14-d5-repair-v2'), 'function hoursBetween(start, end) { return (end.getTime() - start.getTime()) / 3600000; }'), true);
  assert.equal(hoursBetween(new Date(0), new Date(7200000)), 2);
  assert.equal(hoursBetween(new Date(7200000), new Date(0)), -2);
  const orderedEntries = new Function('function orderedEntries(map) { return [...map.entries()]; } return orderedEntries;')();
  assert.equal(gradeAnswer(questionById('js-w15-d4-repair-v2'), 'function orderedEntries(map) { return [...map.entries()]; }'), true);
  assert.deepEqual(orderedEntries(new Map([['js', 2], ['py', 1]])), [['js', 2], ['py', 1]]);
  const uniqueIds = new Function('function uniqueIds(ids) { return [...new Set(ids)]; } return uniqueIds;')();
  assert.equal(gradeAnswer(questionById('js-w15-d5-repair-v2'), 'function uniqueIds(ids) { return [...new Set(ids)]; }'), true);
  assert.deepEqual(uniqueIds(['js', 'js', 'py']), ['js', 'py']);
});

test('JavaScript weeks sixteen through eighteen teach generators, classes, and prototypes with verified examples', async () => {
  const javascript = trackById('javascript');
  const expected = {
    16: { overview: ['[{"value":1,"done":false},{"value":2,"done":false},{"done":true}]'], days: [['read', 'created A'], ['false false true'], ['page false end true'], ['1 false'], ['A', 'cleanup']] },
    17: { overview: ['saved:JS rejected JS'], days: [['1'], ['JS JS'], ['saved:JS rejected JS'], ['기초 · 심화'], ['true false']] },
    18: { overview: ['true false true'], days: [['true false true'], ['true true'], ['1', '2 1'], ['own'], ['New false']] },
  };

  for (const week of [16, 17, 18]) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    assert.ok(lesson.objective.length > 45, lesson.id);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, lesson.id);

    for (const [index, session] of lesson.sessions.entries()) {
      assert.ok(session.objective.length > 35, session.title);
      assert.ok(session.intro.length > 45, session.title);
      const output = [];
      await new AsyncFunction('console', session.example)({ log: (...values) => output.push(values.map(String).join(' ')) });
      assert.deepEqual(output, expected[week].days[index], session.title);

      for (const exercise of session.exercises) {
        assert.match(exercise.id, /-v[23]$/, exercise.id);
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 20, `${exercise.id}: ${option.id}`);
            assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${exercise.id}: ${option.id}`);
          }
        }
        if (exercise.type === 'short-answer') {
          const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
          assert.ok(match, `${exercise.id} includes its traced program`);
          const traceOutput = [];
          await new AsyncFunction('console', 'performance', 'AbortController', match[1])(
            { log: (...values) => traceOutput.push(values.map(String).join(' ')) },
            globalThis.performance,
            globalThis.AbortController,
          );
          assert.equal(gradeAnswer(exercise, traceOutput.join('\n')), true, exercise.id);
        }
        if (exercise.type === 'locate-error') assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, exercise.id);
          assert.ok(exercise.gradingNote.includes('실행'), exercise.id);
        }
      }
    }

    const overview = [];
    await new AsyncFunction('console', lesson.example)({ log: (...values) => overview.push(values.map(String).join(' ')) });
    assert.deepEqual(overview, expected[week].overview, `${lesson.id} overview`);
  }

  const firstPage = questionById('js-w16-d4-repair-v2');
  const firstPageSolution = 'function* firstPage() { yield 1; }';
  assert.equal(gradeAnswer(firstPage, firstPageSolution), true);
  assert.deepEqual(new Function(`${firstPageSolution}; return firstPage().next();`)(), { value: 1, done: false });
  const firstPageDelegatedSolution = 'function* firstPage() { yield* [1]; }';
  assert.equal(gradeAnswer(firstPage, firstPageDelegatedSolution), true);
  assert.deepEqual(new Function(`${firstPageDelegatedSolution}; return firstPage().next();`)(), { value: 1, done: false });
  const pageCursor = questionById('js-w16-d5-repair-v2');
  const pageCursorSolution = 'function* pageCursor(pages) { for (const page of pages) yield page; }';
  assert.equal(gradeAnswer(pageCursor, pageCursorSolution), true);
  assert.deepEqual(new Function(`${pageCursorSolution}; return [...pageCursor(["A", "B"])];`)(), ['A', 'B']);
  const pageCursorDelegatedSolution = 'function* pageCursor(pages) { yield* pages; }';
  assert.equal(gradeAnswer(pageCursor, pageCursorDelegatedSolution), true);
  assert.deepEqual(new Function(`${pageCursorDelegatedSolution}; return [...pageCursor(["A", "B"])];`)(), ['A', 'B']);

  const proCourse = questionById('js-w17-d4-repair-v2');
  const proCourseSolutions = [
    'class Course { label() { return "기초"; } } class ProCourse extends Course { label() { return super.label() + " · 심화"; } }',
    'class Course { label() { return "기초"; } } class ProCourse extends Course { label() { return `${super.label()} · 심화`; } }',
    'class Course { label() { return "기초"; } } class ProCourse extends Course { label() { const base = super.label(); return base + " · 심화"; } }',
  ];
  for (const solution of proCourseSolutions) {
    assert.equal(gradeAnswer(proCourse, solution), true, solution);
    assert.equal(new Function(`${solution}; return new ProCourse().label();`)(), '기초 · 심화');
  }
  const memoryStore = questionById('js-w17-d5-repair-v2');
  const memoryStoreInheritedSolution = 'class Store { save(value) { return Boolean(value); } } class MemoryStore extends Store {}';
  assert.equal(gradeAnswer(memoryStore, memoryStoreInheritedSolution), true);
  assert.deepEqual(new Function(`${memoryStoreInheritedSolution}; return [new MemoryStore().save("ok"), new MemoryStore().save("")];`)(), [true, false]);
  const memoryStoreSolution = 'class Store { save(value) { return Boolean(value); } } class MemoryStore extends Store { save(value) { return Boolean(value); } }';
  assert.equal(gradeAnswer(memoryStore, memoryStoreSolution), true);
  assert.deepEqual(new Function(`${memoryStoreSolution}; return [new MemoryStore().save("ok"), new MemoryStore().save("")];`)(), [true, false]);
  for (const body of ['!!value', 'value ? true : false']) {
    const solution = `class Store { save(value) { return Boolean(value); } } class MemoryStore extends Store { save(value) { return ${body}; } }`;
    assert.equal(gradeAnswer(memoryStore, solution), true, body);
    const save = new Function(`${solution}; return (value) => new MemoryStore().save(value);`)();
    assert.deepEqual([save('ok'), save(''), save(0), save([])], [true, false, false, true], body);
  }
  assert.equal(gradeAnswer(memoryStore, 'class Store { save(value) { return Boolean(value); } } class MemoryStore extends Store { save(value) { return `saved:${value}`; } }'), false);

  const ownKeys = questionById('js-w18-d4-repair-v2');
  const ownKeysSolutions = [
    'function ownKeys(item) { const keys = []; for (const key in item) { if (Object.hasOwn(item, key)) keys.push(key); } return keys; }',
    'function ownKeys(item) { const keys = []; for (const key in item) { if (Object.hasOwn(item, key)) { keys.push(key); } } return keys; }',
    'function ownKeys(item) { const keys = []; for (const key in item) { if (!Object.hasOwn(item, key)) continue; keys.push(key); } return keys; }',
  ];
  for (const solution of ownKeysSolutions) {
    assert.equal(gradeAnswer(ownKeys, solution), true, solution);
    assert.deepEqual(new Function(`${solution}; const item = Object.assign(Object.create({ inherited: 1 }), { own: 2 }); return ownKeys(item);`)(), ['own']);
  }
  const canUpdate = questionById('js-w18-d5-repair-v2');
  const canUpdateSolutions = [
    'function canUpdate(fields, key) { return fields.has(key); }',
    'function canUpdate(fields, key) { return fields.has(key) === true; }',
    'function canUpdate(fields, key) { if (fields.has(key)) return true; return false; }',
  ];
  for (const solution of canUpdateSolutions) {
    assert.equal(gradeAnswer(canUpdate, solution), true, solution);
    assert.deepEqual(new Function(`${solution}; const fields = new Set(["title"]); return [canUpdate(fields, "title"), canUpdate(fields, "constructor")];`)(), [true, false]);
  }
});

test('JavaScript weeks nineteen through twenty-one teach testing, debugging, and measured performance', async () => {
  const javascript = trackById('javascript');
  const expected = {
    19: { overview: ['3 0 true'], days: [['true'], ['0 3'], ['false 0'], ['true'], ['true,true,true']] },
    20: { overview: ['없음 JS'], days: [['없음'], ['r1 시작 -> r2 시작 -> r2 완료 -> r1 완료'], ['false true'], ['SyntaxError'], ['TypeError parse']] },
    21: { overview: ['2.5'], days: [['2.5'], ['py'], ['2'], ['3 0'], ['B,C']] },
  };

  for (const week of [19, 20, 21]) {
    const lesson = javascript.lessons.find((item) => item.week === week);
    assert.ok(lesson.objective.length > 45, lesson.id);
    assert.ok(lesson.intro.length > 45, lesson.id);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, lesson.id);

    for (const [index, session] of lesson.sessions.entries()) {
      assert.ok(session.objective.length > 35, session.title);
      assert.ok(session.intro.length > 45, session.title);
      const output = [];
      await new AsyncFunction('console', 'performance', 'AbortController', session.example)(
        { log: (...values) => output.push(values.map(String).join(' ')) },
        globalThis.performance,
        globalThis.AbortController,
      );
      assert.deepEqual(output, expected[week].days[index], session.title);

      for (const exercise of session.exercises) {
        assert.match(exercise.id, exercise.id === 'js-w19-d5-trace-v4' ? /-v4$/ : /-v[23]$/, exercise.id);
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 20, `${exercise.id}: ${option.id}`);
            assert.equal(gradeAnswer(exercise, option.id), option.id === exercise.answer, `${exercise.id}: ${option.id}`);
          }
        }
        if (exercise.type === 'short-answer') {
          const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
          assert.ok(match, `${exercise.id} includes its traced program`);
          const traceOutput = [];
          await new AsyncFunction('console', 'performance', 'AbortController', match[1])(
            { log: (...values) => traceOutput.push(values.map(String).join(' ')) },
            globalThis.performance,
            globalThis.AbortController,
          );
          assert.equal(gradeAnswer(exercise, traceOutput.join('\n')), true, exercise.id);
        }
        if (exercise.type === 'locate-error') assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, exercise.id);
          assert.ok(exercise.gradingNote.includes('실행'), exercise.id);
        }
      }
    }

    const overview = [];
    await new AsyncFunction('console', lesson.example)({ log: (...values) => overview.push(values.map(String).join(' ')) });
    assert.deepEqual(overview, expected[week].overview, `${lesson.id} overview`);
  }

  const emptyCaseSolution = 'function coversEmptyInput(cases) { return cases.some((item) => item.input.length === 0); }';
  const emptyCaseRepair = questionById('js-w19-d5-repair-v2');
  assert.equal(gradeAnswer(emptyCaseRepair, emptyCaseSolution), true);
  const coversEmptyInput = new Function(`${emptyCaseSolution}; return coversEmptyInput;`)();
  assert.equal(coversEmptyInput([{ input: [] }]), true);
  assert.equal(coversEmptyInput([{ input: [1] }]), false);
  const regressionTrace = questionById('js-w19-d5-trace-v3');
  assert.equal(regressionTrace.id, 'js-w19-d5-trace-v4');
  assert.equal(gradeAnswer(regressionTrace, 'true,true,true'), true);
  assert.equal(gradeAnswer(regressionTrace, 'true,true'), false);

  const verifyLoadSolution = 'async function verifyLoad(load) { const value = await load(); return value === "ready"; }';
  const verifyLoadRepair = questionById('js-w19-d4-repair-v2');
  assert.equal(gradeAnswer(verifyLoadRepair, verifyLoadSolution), true);
  const verifyLoad = new Function(`${verifyLoadSolution}; return verifyLoad;`)();
  assert.equal(await verifyLoad(async () => 'ready'), true);
  assert.equal(await verifyLoad(async () => 'later'), false);
  const verifyLoadThenSolution = 'function verifyLoad(load) { return load().then((value) => value === "ready"); }';
  assert.equal(gradeAnswer(verifyLoadRepair, verifyLoadThenSolution), true);
  const verifyLoadThen = new Function(`${verifyLoadThenSolution}; return verifyLoad;`)();
  assert.equal(await verifyLoadThen(async () => 'ready'), true);
  assert.equal(await verifyLoadThen(async () => 'later'), false);
  const verifyLoadInlineAwaitSolution = 'async function verifyLoad(load) { return await load() === "ready"; }';
  assert.equal(gradeAnswer(verifyLoadRepair, verifyLoadInlineAwaitSolution), true);
  const verifyLoadInlineAwait = new Function(`${verifyLoadInlineAwaitSolution}; return verifyLoad;`)();
  assert.equal(await verifyLoadInlineAwait(async () => 'ready'), true);
  assert.equal(await verifyLoadInlineAwait(async () => 'later'), false);
  const emptyCaseDestructuredSolution = 'function coversEmptyInput(cases) { return cases.some(({ input }) => input.length === 0); }';
  assert.equal(gradeAnswer(emptyCaseRepair, emptyCaseDestructuredSolution), true);
  const coversEmptyInputDestructured = new Function(`${emptyCaseDestructuredSolution}; return coversEmptyInput;`)();
  assert.equal(coversEmptyInputDestructured([{ input: [] }]), true);
  assert.equal(coversEmptyInputDestructured([{ input: [1] }]), false);

  const parseSettingsSolution = 'function parseSettings(text) { return JSON.parse(text); }';
  const parseSettingsRepair = questionById('js-w20-d4-repair-v2');
  assert.equal(gradeAnswer(parseSettingsRepair, parseSettingsSolution), true);
  const parseSettings = new Function(`${parseSettingsSolution}; return parseSettings;`)();
  assert.deepEqual(parseSettings('{"theme":"dark"}'), { theme: 'dark' });
  assert.throws(() => parseSettings('not-json'), SyntaxError);
  const parseSettingsRethrowSolution = 'function parseSettings(text) { try { return JSON.parse(text); } catch (error) { throw error; } }';
  assert.equal(gradeAnswer(parseSettingsRepair, parseSettingsRethrowSolution), true);
  const parseSettingsRethrow = new Function(`${parseSettingsRethrowSolution}; return parseSettings;`)();
  assert.deepEqual(parseSettingsRethrow('{"theme":"dark"}'), { theme: 'dark' });
  assert.throws(() => parseSettingsRethrow('not-json'), SyntaxError);

  const failureContextSolution = 'function failureContext(error, operation) { return { name: error.name, operation }; }';
  const failureContextRepair = questionById('js-w20-d5-repair-v2');
  assert.equal(gradeAnswer(failureContextRepair, failureContextSolution), true);
  assert.deepEqual(new Function(`${failureContextSolution}; return failureContext(new TypeError("invalid"), "parse");`)(), { name: 'TypeError', operation: 'parse' });
  for (const solution of [
    'function failureContext(error, operation) { const name = error.name; return { name, operation }; }',
    'function failureContext(error, operation) { return { name: error.name, operation: operation }; }',
  ]) {
    assert.equal(gradeAnswer(failureContextRepair, solution), true, solution);
    assert.deepEqual(new Function(`${solution}; return failureContext(new TypeError("invalid"), "parse");`)(), { name: 'TypeError', operation: 'parse' });
  }

  const meanSolution = 'function mean(samples) { if (samples.length === 0) return 0; return samples.reduce((sum, value) => sum + value, 0) / samples.length; }';
  const meanRepair = questionById('js-w21-d4-repair-v2');
  assert.equal(gradeAnswer(meanRepair, meanSolution), true);
  assert.deepEqual(new Function(`${meanSolution}; return [mean([]), mean([2, 4])];`)(), [0, 3]);
  const meanLoopSolution = 'function mean(samples) { if (samples.length === 0) return 0; let total = 0; for (const value of samples) { total += value; } return total / samples.length; }';
  assert.equal(gradeAnswer(meanRepair, meanLoopSolution), true);
  assert.deepEqual(new Function(`${meanLoopSolution}; return [mean([]), mean([2, 4])];`)(), [0, 3]);
  const meanIndexLoopSolution = 'function mean(samples) { if (samples.length === 0) return 0; let total = 0; for (let index = 0; index < samples.length; index += 1) total += samples[index]; return total / samples.length; }';
  assert.equal(gradeAnswer(meanRepair, meanIndexLoopSolution), true);
  assert.deepEqual(new Function(`${meanIndexLoopSolution}; return [mean([]), mean([2, 4])];`)(), [0, 3]);

  const visibleItemsSolution = 'function visibleItems(items, start, count) { const begin = Math.max(0, start); return items.slice(begin, begin + Math.max(0, count)); }';
  const visibleItemsRepair = questionById('js-w21-d5-repair-v2');
  assert.equal(gradeAnswer(visibleItemsRepair, visibleItemsSolution), true);
  const visibleItems = new Function(`${visibleItemsSolution}; return visibleItems;`)();
  assert.deepEqual(visibleItems(['A', 'B'], -1, 1), ['A']);
  assert.deepEqual(visibleItems(['A'], 4, 2), []);
  assert.deepEqual(visibleItems([], 0, 5), []);
  const visibleItemsInlineSolution = 'function visibleItems(items, start, count) { return items.slice(Math.max(0, start), Math.max(0, start) + Math.max(0, count)); }';
  assert.equal(gradeAnswer(visibleItemsRepair, visibleItemsInlineSolution), true);
  const visibleItemsInline = new Function(`${visibleItemsInlineSolution}; return visibleItems;`)();
  assert.deepEqual(visibleItemsInline(['A', 'B'], -1, 1), ['A']);
  assert.deepEqual(visibleItemsInline(['A'], 4, 2), []);
  const visibleItemsSizedSolution = 'function visibleItems(items, start, count) { const begin = Math.max(0, start); const size = Math.max(0, count); return items.slice(begin, begin + size); }';
  assert.equal(gradeAnswer(visibleItemsRepair, visibleItemsSizedSolution), true);
  const visibleItemsSized = new Function(`${visibleItemsSizedSolution}; return visibleItems;`)();
  assert.deepEqual(visibleItemsSized(['A', 'B'], -1, 1), ['A']);
  assert.deepEqual(visibleItemsSized(['A'], 4, 2), []);
  const visibleItemsReorderedArgumentsSolution = 'function visibleItems(items, start, count) { const begin = Math.max(start, 0); const size = Math.max(count, 0); return items.slice(begin, begin + size); }';
  assert.equal(gradeAnswer(visibleItemsRepair, visibleItemsReorderedArgumentsSolution), true);
  const visibleItemsReorderedArguments = new Function(`${visibleItemsReorderedArgumentsSolution}; return visibleItems;`)();
  assert.deepEqual(visibleItemsReorderedArguments(['A', 'B'], -1, 1), ['A']);
  assert.deepEqual(visibleItemsReorderedArguments(['A'], 4, 2), []);
});

test('JavaScript weeks twenty-two through twenty-four teach browser storage and request boundaries with verified examples', async () => {
  const javascript = trackById('javascript');
  const expected = {
    22: {
      overview: ['true {"done":["js"]}'],
      days: [['{"done":["js"]}'], ['0 2'], ['js'], ['false'], ['1 0 0 0']],
    },
    23: {
      overview: ['0'],
      days: [['HTTP 404'], ['empty items'], ['network rejected, HTTP 503, JSON parse failed'], ['true 0'], ['1 true,false']],
    },
    24: {
      overview: ['false true'],
      days: [['false true'], ['true', 'true'], null, ['1 250'], ['[2]']],
    },
  };
  const lessons = javascript.lessons.filter((lesson) => lesson.week >= 22 && lesson.week <= 24);
  assert.equal(lessons.length, 3);
  assert.equal(lessons.reduce((sum, lesson) => sum + lesson.sessions.flatMap((session) => session.exercises).length, 0), 45);

  for (const lesson of lessons) {
    const week = lesson.week;
    assert.equal(lesson.sessions.length, 5, 'week ' + week + ' has five study days');
    assert.ok(lesson.objective.length > 30, 'week ' + week + ' has a specific objective');
    const allQuestions = lesson.sessions.flatMap((session) => session.exercises);
    assert.equal(allQuestions.length, 15, 'week ' + week + ' has fifteen questions');
    assert.equal(new Set(allQuestions.map((question) => question.id)).size, 15, 'week ' + week + ' has unique question ids');
    assert.equal(allQuestions.filter((question) => question.type === 'repair-code').length, 2, 'week ' + week + ' has two repair tasks');
    assert.ok(lesson.sessions.every((session) => session.exercises.length === 3), 'week ' + week + ' has three questions per day');

    const sources = [['overview', lesson.example], ...lesson.sessions.map((session, index) => ['day ' + (index + 1), session.example])];
    for (const [label, source] of sources) {
      assert.doesNotThrow(() => new AsyncFunction('console', 'AbortController', source), 'week ' + week + ' ' + label + ' parses');
    }
    const overviewOutput = [];
    await new AsyncFunction('console', 'AbortController', lesson.example)({
      log: (...values) => overviewOutput.push(values.map(String).join(' ')),
    }, globalThis.AbortController);
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.deepEqual(overviewOutput, expected[week].overview, 'week ' + week + ' overview output');

    for (let index = 0; index < lesson.sessions.length; index += 1) {
      const session = lesson.sessions[index];
      const exercises = session.exercises;
      assert.equal(new Set(exercises.map((question) => question.prompt)).size, 3, session.title);
      for (const question of exercises) {
        if (question.type === 'choice') {
          assert.equal(gradeAnswer(question, question.answer), true, question.id);
          for (const option of question.choices) {
            assert.ok(question.choiceExplanations[option.id].length > 20, question.id + ' feedback ' + option.id);
            assert.equal(gradeAnswer(question, option.id), option.id === question.answer, question.id + ' ' + option.id);
          }
        }
        if (question.type === 'locate-error') {
          assert.equal(gradeAnswer(question, question.answerLines), true, question.id);
          assert.ok(question.answerLines.every((line) => line > 0 && line <= question.codeLines.length), question.id);
        }
        if (question.type === 'repair-code') {
          assert.equal(gradeAnswer(question, question.starterCode), false, question.id);
          assert.ok(question.acceptanceCriteria.tests.length > 0, question.id);
          assert.ok(question.gradingNote.includes('실행'), question.id);
        }
      }

      const expectedDayOutput = expected[week].days[index];
      if (expectedDayOutput === null) {
        assert.match(session.intro, /React.*개념 스니펫/);
        continue;
      }
      const actualOutput = [];
      await new AsyncFunction('console', 'AbortController', session.example)({
        log: (...values) => actualOutput.push(values.map(String).join(' ')),
      }, globalThis.AbortController);
      await new Promise((resolve) => setTimeout(resolve, 0));
      assert.deepEqual(actualOutput, expectedDayOutput, session.title + ' output');
      if (week === 23 && index === 2) {
        const trace = exercises.find((question) => question.type === 'short-answer');
        const fence = String.fromCharCode(96);
        const match = trace.prompt.match(new RegExp('\\n\\n' + fence + '([\\s\\S]+?)' + fence + '$'));
        assert.ok(match, trace.id + ' includes its three failure paths');
        const traceOutput = [];
        await new AsyncFunction('console', 'AbortController', match[1])({
          log: (...values) => traceOutput.push(values.map(String).join(' ')),
        }, globalThis.AbortController);
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.deepEqual(traceOutput, expectedDayOutput, trace.id);
        assert.equal(gradeAnswer(trace, traceOutput.join('\n')), true, trace.id);
        assert.equal(questionById('js-w23-d3-network-trace-v3').id, 'js-w23-d3-network-trace-v4');
      }
    }
  }

  const week22 = lessons.find((lesson) => lesson.week === 22);
  const readProgressSource = week22.sessions[1].example.match(/function readProgress\(raw\) \{[\s\S]*?\n\}/)[0];
  const readProgress = new Function(readProgressSource + '; return readProgress;')();
  assert.deepEqual(readProgress(null), { done: [] });
  assert.deepEqual(readProgress('{'), { done: [] });
  assert.deepEqual(readProgress('null'), { done: [] });
  assert.deepEqual(readProgress('{"done":2}'), { done: [] });
  assert.deepEqual(readProgress('{"done":["js"]}'), { done: ['js'] });

  const migrationSource = week22.sessions[2].example.match(/function migrate\(saved\) \{[\s\S]*?\n\}/)[0];
  const migrate = new Function(migrationSource + '; return migrate;')();
  assert.deepEqual(migrate({ version: 1, done: ['js'] }), { version: 2, completed: ['js'] });
  assert.deepEqual(migrate({ version: 2, completed: ['py'] }), { version: 2, completed: ['py'] });
  for (const invalid of [null, 2, [], { version: 1, done: 'js' }, { version: 2, completed: [2] }, { version: 3, completed: [] }]) {
    assert.throws(() => migrate(invalid), /Invalid progress|Unsupported progress/);
  }

  const saveSolution = 'function saveProgress(storage, key, progress) { try { storage.setItem(key, JSON.stringify(progress)); return true; } catch { return false; } }';
  const saveRepair = questionById('js-w22-d4-save-progress-v2');
  assert.equal(gradeAnswer(saveRepair, saveSolution), true);
  const saveProgress = new Function(saveSolution + '; return saveProgress;')();
  let savedText;
  assert.equal(saveProgress({ setItem: (key, value) => { savedText = key + ':' + value; } }, 'progress', { done: 2 }), true);
  assert.equal(savedText, 'progress:{"done":2}');
  assert.equal(saveProgress({ setItem() { throw new Error('quota'); } }, 'progress', {}), false);

  const storageEventSolution = 'function progressFromStorageEvent(event) { if (event.key !== "progress" && event.key !== null) return null; if (event.newValue === null) return { done: [] }; try { const progress = JSON.parse(event.newValue); if (progress === null || typeof progress !== "object" || !Array.isArray(progress.done) || !progress.done.every((id) => typeof id === "string")) return { done: [] }; return progress; } catch { return { done: [] }; } }';
  const storageEventRepair = questionById('js-w22-d5-storage-event-repair-v2');
  assert.equal(gradeAnswer(storageEventRepair, storageEventSolution), true);
  const progressFromStorageEvent = new Function(storageEventSolution + '; return progressFromStorageEvent;')();
  assert.equal(progressFromStorageEvent({ key: 'other', newValue: '{}' }), null);
  assert.deepEqual(progressFromStorageEvent({ key: 'progress', newValue: null }), { done: [] });
  assert.deepEqual(progressFromStorageEvent({ key: null, newValue: null }), { done: [] });
  assert.deepEqual(progressFromStorageEvent({ key: 'progress', newValue: '{"done":["js"]}' }), { done: ['js'] });
  assert.deepEqual(progressFromStorageEvent({ key: 'progress', newValue: '{' }), { done: [] });
  assert.deepEqual(progressFromStorageEvent({ key: 'progress', newValue: 'null' }), { done: [] });
  assert.deepEqual(progressFromStorageEvent({ key: 'progress', newValue: '{"done":2}' }), { done: [] });

  const courseListSolution = 'async function courseList(response) { if (!response.ok) return null; return await response.json(); }';
  const courseListRepair = questionById('js-w23-d4-course-list-v2');
  assert.equal(gradeAnswer(courseListRepair, courseListSolution), true);
  const courseList = new Function(courseListSolution + '; return courseList;')();
  assert.deepEqual(await courseList({ ok: true, json: async () => [] }), []);
  assert.equal(await courseList({ ok: false, json: async () => ['ignored'] }), null);

  const loadingSolution = 'async function loadCourses(fetcher, setLoading) { setLoading(true); try { const response = await fetcher("/courses"); if (!response.ok) throw new Error("HTTP " + response.status); return await response.json(); } finally { setLoading(false); } }';
  const loadingRepair = questionById('js-w23-d5-finally-repair-v2');
  assert.equal(gradeAnswer(loadingRepair, loadingSolution), true);
  const loadCourses = new Function(loadingSolution + '; return loadCourses;')();
  const states = [];
  assert.deepEqual(await loadCourses(async () => ({ ok: true, json: async () => ['JS'] }), (value) => states.push(value)), ['JS']);
  assert.deepEqual(states, [true, false]);
  const failureStates = [];
  await assert.rejects(loadCourses(async () => ({ ok: false, status: 503 }), (value) => failureStates.push(value)), /HTTP 503/);
  assert.deepEqual(failureStates, [true, false]);
  const rejectionStates = [];
  await assert.rejects(loadCourses(() => Promise.reject(new TypeError('offline')), (value) => rejectionStates.push(value)), /offline/);
  assert.deepEqual(rejectionStates, [true, false]);

  const debounceSolution = 'function debounce(run, setTimer, clearTimer) { let timer = null; return (...args) => { if (timer !== null) clearTimer(timer); timer = setTimer(() => run(...args), 250); }; }';
  const debounceRepair = questionById('js-w24-d4-debounce-repair-v2');
  assert.equal(gradeAnswer(debounceRepair, debounceSolution), true);
  const debounce = new Function(debounceSolution + '; return debounce;')();
  const activeTimers = new Map();
  const clearedTimers = [];
  let timerId = 0;
  const setTimer = (callback, delay) => {
    timerId += 1;
    activeTimers.set(timerId, { callback, delay });
    return timerId;
  };
  const clearTimer = (id) => {
    clearedTimers.push(id);
    activeTimers.delete(id);
  };
  const ran = [];
  const search = debounce((term) => ran.push(term), setTimer, clearTimer);
  search('ja');
  search('javascript');
  assert.deepEqual(clearedTimers, [1]);
  assert.equal(activeTimers.size, 1);
  assert.equal(activeTimers.get(2).delay, 250);
  activeTimers.get(2).callback();
  assert.deepEqual(ran, ['javascript']);

  const latestSolution = 'function shouldApplyResult(requestId, latestId) { return requestId === latestId; }';
  const latestRepair = questionById('js-w24-d5-latest-result-repair-v2');
  assert.equal(gradeAnswer(latestRepair, latestSolution), true);
  const shouldApplyResult = new Function(latestSolution + '; return shouldApplyResult;')();
  assert.equal(shouldApplyResult(4, 5), false);
  assert.equal(shouldApplyResult(5, 5), true);

  const saveVariableSolution = 'function saveProgress(storage, key, progress) { try { const serialized = JSON.stringify(progress); storage.setItem(key, serialized); return true; } catch (error) { return false; } }';
  assert.equal(gradeAnswer(saveRepair, saveVariableSolution), true);
  const saveProgressWithVariable = new Function(saveVariableSolution + '; return saveProgress;')();
  let variableSavedText;
  assert.equal(saveProgressWithVariable({ setItem: (key, value) => { variableSavedText = `${key}:${value}`; } }, 'progress', { done: ['js'] }), true);
  assert.equal(variableSavedText, 'progress:{"done":["js"]}');
  assert.equal(saveProgressWithVariable({ setItem() { throw new Error('blocked'); } }, 'progress', {}), false);

  const storageEventIncludesSolution = 'function progressFromStorageEvent(event) { if (!["progress", null].includes(event.key)) return null; if (event.newValue === null) return { done: [] }; try { const saved = JSON.parse(event.newValue); if (saved === null || typeof saved !== "object" || Array.isArray(saved) || !Array.isArray(saved.done) || !saved.done.every(id => typeof id === "string")) return { done: [] }; return saved; } catch (error) { return { done: [] }; } }';
  assert.equal(gradeAnswer(storageEventRepair, storageEventIncludesSolution), true);
  const progressFromStorageEventIncludes = new Function(storageEventIncludesSolution + '; return progressFromStorageEvent;')();
  assert.equal(progressFromStorageEventIncludes({ key: 'settings', newValue: '{}' }), null);
  assert.deepEqual(progressFromStorageEventIncludes({ key: null, newValue: null }), { done: [] });
  assert.deepEqual(progressFromStorageEventIncludes({ key: 'progress', newValue: '{"done":["js"]}' }), { done: ['js'] });
  for (const newValue of ['{', 'null', '{"done":[1]}']) {
    assert.deepEqual(progressFromStorageEventIncludes({ key: 'progress', newValue }), { done: [] });
  }

  const courseListBranchSolution = 'async function courseList(response) { if (response.ok) { const courses = await response.json(); return courses; } return null; }';
  assert.equal(gradeAnswer(courseListRepair, courseListBranchSolution), true);
  const courseListWithBranch = new Function(courseListBranchSolution + '; return courseList;')();
  assert.deepEqual(await courseListWithBranch({ ok: true, json: async () => [] }), []);
  let failedBodyRead = false;
  assert.equal(await courseListWithBranch({ ok: false, json: async () => { failedBodyRead = true; return ['unused']; } }), null);
  assert.equal(failedBodyRead, false);

  const loadingNamedValueSolution = 'async function loadCourses(fetcher, setLoading) { setLoading(true); try { const response = await fetcher("/courses"); if (!response.ok) { throw new Error("HTTP " + response.status); } const courses = await response.json(); return courses; } finally { setLoading(false); } }';
  assert.equal(gradeAnswer(loadingRepair, loadingNamedValueSolution), true);
  const loadCoursesWithNamedValue = new Function(loadingNamedValueSolution + '; return loadCourses;')();
  const namedValueStates = [];
  assert.deepEqual(await loadCoursesWithNamedValue(async () => ({ ok: true, json: async () => ['TS'] }), (value) => namedValueStates.push(value)), ['TS']);
  assert.deepEqual(namedValueStates, [true, false]);
  const namedValueFailureStates = [];
  await assert.rejects(loadCoursesWithNamedValue(async () => ({ ok: false, status: 503 }), (value) => namedValueFailureStates.push(value)), /HTTP 503/);
  assert.deepEqual(namedValueFailureStates, [true, false]);

  const debounceNamedFunctionSolution = 'function debounce(run, setTimer, clearTimer) { let timerId = null; return function (...args) { if (timerId !== null) clearTimer(timerId); timerId = setTimer(function () { run(...args); }, 250); }; }';
  assert.equal(gradeAnswer(debounceRepair, debounceNamedFunctionSolution), true);
  const debounceNamedFunction = new Function(debounceNamedFunctionSolution + '; return debounce;')();
  const namedTimers = new Map();
  const namedCleared = [];
  let namedTimerId = 0;
  const namedSearch = debounceNamedFunction((term) => namedTimers.set('ran', term), (callback, delay) => {
    namedTimerId += 1;
    namedTimers.set(namedTimerId, { callback, delay });
    return namedTimerId;
  }, (id) => {
    namedCleared.push(id);
    namedTimers.delete(id);
  });
  namedSearch('ja');
  namedSearch('javascript');
  assert.deepEqual(namedCleared, [1]);
  assert.equal(namedTimers.get(2).delay, 250);
  namedTimers.get(2).callback();
  assert.equal(namedTimers.get('ran'), 'javascript');

  const latestBranchSolution = 'function shouldApplyResult(requestId, latestId) { if (requestId === latestId) return true; return false; }';
  assert.equal(gradeAnswer(latestRepair, latestBranchSolution), true);
  const shouldApplyResultByBranch = new Function(latestBranchSolution + '; return shouldApplyResult;')();
  assert.equal(shouldApplyResultByBranch('older', 'latest'), false);
  assert.equal(shouldApplyResultByBranch('latest', 'latest'), true);
});

test('JavaScript weeks twenty-five and twenty-six teach security boundaries and a capstone with checked examples', async () => {
  const javascript = trackById('javascript');
  const expected = {
    25: {
      overview: ['<img src=x onerror=alert(1)> #/track/js #/tracks'],
      days: [
        ['<img src=x onerror=alert(1)>'],
        ['/search?q=JS%20%26%20React'],
        ['#/tracks'],
        ['true dark'],
        ['li <img> 1'],
      ],
    },
    26: {
      overview: ['{"total":2,"completed":1}'],
      days: [
        ['{"total":0,"completed":0}'],
        ['error empty ready'],
        ['a #/lesson/js 이어서 학습'],
        ['error,empty,ready'],
        ['{"status":"ready","summary":{"total":2,"completed":1}}'],
      ],
    },
  };
  const lessons = javascript.lessons.filter((lesson) => lesson.week === 25 || lesson.week === 26);
  assert.equal(lessons.length, 2);

  for (const lesson of lessons) {
    const week = lesson.week;
    assert.equal(lesson.sessions.length, 5, `week ${week} has five days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `week ${week} has fifteen questions`);
    assert.equal(lesson.sessions.flatMap((session) => session.exercises).filter((question) => question.type === 'repair-code').length, 2, `week ${week} has two repair questions`);
    assert.ok(lesson.objective.length > 40, `week ${week} has a specific objective`);

    for (const [label, source, expectedLines] of [
      ['overview', lesson.example, expected[week].overview],
      ...lesson.sessions.map((session, index) => [`day ${index + 1}`, session.example, expected[week].days[index]]),
    ]) {
      const output = [];
      const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
      await new AsyncFunction('console', 'document', source)(logger, makeDocument());
      assert.deepEqual(output, expectedLines, `week ${week} ${label} output`);
    }

    for (const session of lesson.sessions) {
      assert.equal(session.exercises.length, 3, session.title);
      const trace = session.exercises.find((question) => question.type === 'short-answer');
      if (trace) {
        const snippet = trace.prompt.match(/\n\n`([\s\S]+?)`$/);
        assert.ok(snippet, trace.id);
        assert.equal(session.example, snippet[1], `${trace.id} matches the daily example`);
        assert.equal(gradeAnswer(trace, trace.acceptedAnswers[0]), true, trace.id);
      }
      for (const question of session.exercises) {
        if (question.type === 'choice') {
          assert.equal(gradeAnswer(question, question.answer), true, question.id);
          for (const option of question.choices) {
            assert.ok(question.choiceExplanations[option.id].length > 20, `${question.id} feedback ${option.id}`);
            assert.equal(gradeAnswer(question, option.id), option.id === question.answer, question.id + ' ' + option.id);
          }
        } else if (question.type === 'locate-error') {
          assert.equal(gradeAnswer(question, question.answerLines), true, question.id);
          assert.ok(question.answerLines.every((line) => line > 0 && line <= question.codeLines.length), question.id);
        } else if (question.type === 'repair-code') {
          assert.equal(gradeAnswer(question, question.starterCode), false, question.id);
          assert.ok(question.acceptanceCriteria.tests.length >= 2, question.id);
        }
      }
    }
  }

  const saveThemeSource = 'function saveTheme(storage, theme) { if (!["light", "dark"].includes(theme)) return false; try { storage.setItem("theme", theme); return true; } catch { return false; } }';
  const saveThemeRepair = questionById('js-w25-d4-theme-storage-repair-v3');
  assert.equal(gradeAnswer(saveThemeRepair, saveThemeSource), true);
  const saveTheme = new Function(saveThemeSource + '; return saveTheme;')();
  const stored = new Map();
  const storage = { setItem: (key, value) => stored.set(key, value) };
  assert.equal(saveTheme(storage, 'dark'), true);
  assert.equal(stored.get('theme'), 'dark');
  assert.equal(saveTheme(storage, 'system'), false);
  assert.equal(stored.has('password'), false);
  assert.equal(saveTheme({ setItem() { throw new Error('quota'); } }, 'light'), false);

  const appendSource = 'function appendPlainMessage(list, message) { const item = document.createElement("li"); item.textContent = message; list.append(item); return item; }';
  const appendRepair = questionById('js-w25-d5-plain-dom-repair-v3');
  assert.equal(gradeAnswer(appendRepair, appendSource), true);
  const appendDocument = makeDocument();
  const appendPlainMessage = new Function('document', appendSource + '; return appendPlainMessage;')(appendDocument);
  const list = appendDocument.createElement('ul');
  const node = appendPlainMessage(list, '<img>');
  assert.equal(node.tagName, 'LI');
  assert.equal(node.textContent, '<img>');
  assert.deepEqual(list.children, [node]);

  const statusSource = 'function learningStatus(ok, lessons) { if (!ok) return "error"; return lessons.length === 0 ? "empty" : "ready"; }';
  const statusRepair = questionById('js-w26-d4-status-repair-v3');
  assert.equal(gradeAnswer(statusRepair, statusSource), true);
  const learningStatus = new Function(statusSource + '; return learningStatus;')();
  assert.equal(learningStatus(false, []), 'error');
  assert.equal(learningStatus(true, []), 'empty');
  assert.equal(learningStatus(true, [{ id: 'js' }]), 'ready');

  const reportSource = 'function buildReport(ok, lessons) { const summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + Number(lesson.completed === true) }), { total: 0, completed: 0 }); const status = !ok ? "error" : lessons.length === 0 ? "empty" : "ready"; return { status, summary }; }';
  const reportRepair = questionById('js-w26-d5-build-report-repair-v3');
  assert.equal(gradeAnswer(reportRepair, reportSource), true);
  const buildReport = new Function(reportSource + '; return buildReport;')();
  assert.deepEqual(buildReport(true, []), { status: 'empty', summary: { total: 0, completed: 0 } });
  assert.deepEqual(buildReport(false, []), { status: 'error', summary: { total: 0, completed: 0 } });
  assert.deepEqual(buildReport(true, [{ completed: true }, { completed: false }, { completed: 1 }]), {
    status: 'ready',
    summary: { total: 3, completed: 1 },
  });

  const themeConditionSolution = 'function saveTheme(storage, theme) { if (theme !== "light" && theme !== "dark") return false; try { storage.setItem("theme", theme); return true; } catch (error) { return false; } }';
  assert.equal(gradeAnswer(saveThemeRepair, themeConditionSolution), true);
  const saveThemeWithCondition = new Function(themeConditionSolution + '; return saveTheme;')();
  const conditionStorage = new Map();
  assert.equal(saveThemeWithCondition({ setItem: (key, value) => conditionStorage.set(key, value) }, 'light'), true);
  assert.equal(conditionStorage.get('theme'), 'light');
  assert.equal(saveThemeWithCondition({ setItem() { throw new Error('blocked'); } }, 'dark'), false);
  assert.equal(saveThemeWithCondition({ setItem() { throw new Error('should not run'); } }, 'system'), false);

  const appendSingleQuoteSolution = "function appendPlainMessage(list, message) { const item = document.createElement('li'); item.textContent = message; list.append(item); return item; }";
  const appendNamedItemSolution = 'function appendPlainMessage(list, message) { const created = document.createElement("li"); created.textContent = message; list.append(created); return created; }';
  const appendInjectedLegacySolution = "function appendPlainMessage(list, message, createElement) { const item = createElement('li'); item.textContent = message; list.append(item); return item; }";
  const appendNamedLegacySolution = 'function appendPlainMessage(list, message, createElement) { const created = createElement("li"); created.textContent = message; list.append(created); return created; }';
  for (const solution of [appendSingleQuoteSolution, appendNamedItemSolution, appendInjectedLegacySolution, appendNamedLegacySolution]) {
    assert.equal(gradeAnswer(appendRepair, solution), true, solution);
    const alternativeDocument = makeDocument();
    const appendAlternative = new Function('document', solution + '; return appendPlainMessage;')(alternativeDocument);
    const alternativeList = alternativeDocument.createElement('ul');
    const createElement = (tag) => alternativeDocument.createElement(tag);
    const alternativeItem = solution.includes('createElement) {')
      ? appendAlternative(alternativeList, '', createElement)
      : appendAlternative(alternativeList, '');
    assert.equal(alternativeItem.tagName, 'LI');
    assert.equal(alternativeItem.textContent, '');
    assert.deepEqual(alternativeList.children, [alternativeItem]);
  }

  const nestedStatusSolution = 'function learningStatus(ok, lessons) { return !ok ? "error" : (lessons.length === 0 ? "empty" : "ready"); }';
  assert.equal(gradeAnswer(statusRepair, nestedStatusSolution), true);
  const learningStatusNested = new Function(nestedStatusSolution + '; return learningStatus;')();
  assert.equal(learningStatusNested(false, []), 'error');
  assert.equal(learningStatusNested(true, []), 'empty');
  assert.equal(learningStatusNested(true, [{ id: 'js' }]), 'ready');

  const reportConditionalCountSolution = 'function buildReport(ok, lessons) { const summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + (lesson.completed === true ? 1 : 0) }), { total: 0, completed: 0 }); const status = !ok ? "error" : lessons.length === 0 ? "empty" : "ready"; return { status, summary }; }';
  assert.equal(gradeAnswer(reportRepair, reportConditionalCountSolution), true);
  const buildReportWithConditionalCount = new Function(reportConditionalCountSolution + '; return buildReport;')();
  const reportInput = [{ completed: true }, { completed: false }, { completed: 1 }];
  assert.deepEqual(buildReportWithConditionalCount(true, []), { status: 'empty', summary: { total: 0, completed: 0 } });
  assert.deepEqual(buildReportWithConditionalCount(false, []), { status: 'error', summary: { total: 0, completed: 0 } });
  assert.deepEqual(buildReportWithConditionalCount(true, reportInput), { status: 'ready', summary: { total: 3, completed: 1 } });
  assert.deepEqual(reportInput, [{ completed: true }, { completed: false }, { completed: 1 }]);
});

test('React weeks use separate daily foundations for judgment, output, and errors', () => {
  const react = trackById('react');
  for (let week = 1; week <= 26; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    const firstDays = lesson.sessions.slice(0, 3);
    const prompts = firstDays.flatMap((session) => session.exercises.map((exercise) => exercise.prompt));
    assert.equal(new Set(prompts).size, prompts.length, `react week ${week}`);
    const errorCases = firstDays.flatMap((session) => session.exercises).filter((exercise) => exercise.type === 'locate-error');
    assert.ok(errorCases.every((exercise) => gradeAnswer(exercise, exercise.answerLines)), `react week ${week}`);
    assert.equal(new Set(errorCases.map((exercise) => exercise.codeLines.join('\n'))).size, errorCases.length, `react week ${week}`);
  }
});

test('React weeks one through three teach the daily rule instead of asking for a topic label', () => {
  const react = trackById('react');
  assert.equal(react.contentReview.version, 'React 19.3');
  assert.equal(react.contentReview.sources.some((source) => source.url.includes('react.dev/blog/2026/09/09/react-19-3')), true);

  const answerPositions = { a: 0, b: 0, c: 0 };
  for (let week = 1; week <= 3; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);

    for (const session of lesson.sessions) {
      const prefix = `react-w${week}-d${session.number}`;
      const exercises = session.exercises;
      const choice = exercises.find((exercise) => exercise.type === 'choice');
      const trace = exercises.find((exercise) => exercise.type === 'short-answer');
      const locate = exercises.find((exercise) => exercise.type === 'locate-error');
      const repair = exercises.find((exercise) => exercise.type === 'repair-code');

      assert.equal(exercises.length, 3, `${prefix} retains the daily three-question target`);
      assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 3, `${prefix} does not repeat a prompt`);
      assert.ok(choice, `${prefix} has a choice question`);
      if (choice.id.startsWith('react-w')) assert.equal(choice.id, `${prefix}-concept-v2`);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > (choice.id.startsWith('react-w') ? 35 : 20), `${choice.id}/${option.id} has a rationale`);
      }

      if (trace) {
        assert.ok(!trace.prompt.includes('주제 이름을 적으세요'), trace.id);
        assert.ok(trace.hint.length > 25, trace.id);
        assert.ok(trace.explanation.length > (trace.id.endsWith('-v2') ? 45 : 20), trace.id);
        assert.equal(gradeAnswer(trace, trace.acceptedAnswers[0]), true, trace.id);
        assert.equal(gradeAnswer(trace, '모르겠습니다'), false, trace.id);
        if (trace.id.startsWith('react-w')) {
          const expectedTraceId = `${prefix}-trace-v2`;
          assert.ok(trace.id === expectedTraceId || trace.legacyIds?.includes(expectedTraceId), trace.id);
          assert.ok(trace.prompt.includes('`'), `${trace.id} includes its reviewed example`);
        }
      }

      if (locate) {
        assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
        assert.ok(locate.hint.length > 25, locate.id);
        assert.ok(!locate.hint.includes('prop, state, Hook 규칙, HTML 의미'), locate.id);
        if (session.number === 4) assert.notEqual(locate.explanation, '2번 줄은 prop 값이 아니라 글자 그대로 level을 표시합니다. JSX 표현식 `{level}`을 사용해야 합니다.', locate.id);
      }

      if (repair) {
        assert.ok(repair.hint.length > 25, repair.id);
        assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
        assert.match(repair.gradingNote, /실행하거나 브라우저를 열지 않습니다/);
      }
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });

  const snapshotTrace = questionById('react-event-short-v2');
  assert.equal(gradeAnswer(snapshotTrace, '0'), true);
  assert.match(snapshotTrace.explanation, /현재 handler.*스냅샷/);

  const expectedFaultLines = new Map([
    ['react-w1-d4-debug', [[2], /닫힌 상태/]],
    ['react-w2-d4-debug', [[2], /minutes/]],
    ['react-w3-d4-debug', [[2, 3], /클릭 handler/]],
  ]);
  for (const [id, [lines, explanationPattern]] of expectedFaultLines) {
    const exercise = questionById(id);
    assert.deepEqual(exercise.answerLines, lines, id);
    assert.match(exercise.explanation, explanationPattern, id);
  }

  const verifiedRepairs = [
    ['react-w1-d4-repair', 'function OpenPanel({ isOpen }) { return isOpen ? <section>과정</section> : null; }'],
    ['react-w1-d5-repair', 'function CourseList({ courses }) { return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>; }'],
    ['react-w2-d4-repair', 'function CourseMeta({ title, minutes }) { return <p>{title} · {minutes}분</p>; }'],
    ['react-w2-d5-repair', 'function Panel({ children }) { return <section>{children}</section>; }'],
    ['react-w3-d4-repair-v2', 'function IncrementButton({ count, setCount }) { return <button onClick={() => { setCount((current) => current + 1); setCount((current) => current + 1); }}>두 번 추가</button>; }'],
    ['react-w3-d5-repair-v2', 'function DeleteButton({ remove, id }) { function onDelete(event) { event.stopPropagation(); remove(id); } return <button onClick={onDelete}>삭제</button>; }'],
  ];
  for (const [id, answer] of verifiedRepairs) assert.equal(gradeAnswer(questionById(id), answer), true, id);
});

test('React weeks four through six align state, form, and Effect practice with each day', () => {
  const react = trackById('react');
  const answerPositions = { a: 0, b: 0, c: 0 };
  const repairSolutions = {
    '4-4': `function MarkDone({ courses, setCourses, id }) {
  setCourses((current) => current.map((course) => course.id === id ? { ...course, done: true } : course));
  return null;
}`,
    '4-5': `function AddTwice({ count, setCount }) {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
  return count;
}`,
    '5-4': `function submitTitle(event, title, save) {
  event.preventDefault();
  save(title.trim());
  return title;
}`,
    '5-5': `function CourseField({ title, error, onChange }) {
  return <><label htmlFor="course-title">과정 이름</label><input id="course-title" value={title} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? "course-title-error" : undefined} />{error && <p id="course-title-error">{error}</p>}</>;
}`,
    '6-4': `function useCourses(query) {
  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(query, { signal: controller.signal });
    return () => controller.abort();
  }, [query]);
  return query;
}`,
    '6-5': `function visibleCourses(courses, query) {
  return courses.filter((course) => course.title.includes(query));
}`,
  };
  const expectedTypes = [
    ['repair-code', 'choice', 'short-answer'], ['choice', 'short-answer', 'locate-error'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
    ['choice', 'short-answer', 'locate-error'], ['short-answer', 'choice', 'locate-error'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
    ['choice', 'short-answer', 'locate-error'], ['short-answer', 'choice', 'locate-error'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
  ];

  let expectedIndex = 0;
  for (let week = 4; week <= 6; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    for (const session of lesson.sessions) {
      const prefix = `react-w${week}-d${session.number}`;
      const exercises = session.exercises;
      assert.equal(exercises.length, 3, `${prefix} keeps three daily questions`);
      assert.deepEqual(exercises.map((exercise) => exercise.type), expectedTypes[expectedIndex], `${prefix} has a complementary exercise mix`);
      expectedIndex += 1;
      assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 3, `${prefix} has distinct prompts`);
      assert.ok(exercises.every((exercise) => !exercise.prompt.includes('주제 이름을 적으세요')), `${prefix} asks about a concrete rule`);

      for (const exercise of exercises) {
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.equal(exercise.choices.length, 3, exercise.id);
          for (const option of exercise.choices) assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id} explains the option`);
          answerPositions[exercise.answer] += 1;
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, '모르겠습니다'), false, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.match(exercise.gradingNote, /실행형 채점은 아니며|실행하거나 브라우저를 열지 않습니다/);
          const dayKey = `${week}-${session.number}`;
          if (repairSolutions[dayKey]) assert.equal(gradeAnswer(exercise, repairSolutions[dayKey]), true, exercise.id);
        }
      }
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  for (const id of [
    'react-state-copy-choice-v2', 'react-state-remove-locate-v2',
    'react-form-list-choice-v2', 'react-form-short-v2',
    'react-effect-choice-v2', 'react-effect-short-v2', 'react-effect-locate-v2',
  ]) assert.ok(questionById(id), id);
  assert.equal(questionById('react-state-copy-choice'), undefined);
});

test('React weeks seven through nine align reducers, custom Hooks, and request states with three distinct daily questions', () => {
  const react = trackById('react');
  const expectedTypes = [
    ['choice', 'short-answer', 'locate-error'], ['short-answer', 'choice', 'locate-error'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
  ];
  const repairs = {
    '7-4': `function courseReducer(state, action) {
  if (action.type === "query") return { ...state, query: action.value };
  if (action.type === "complete") return { ...state, completedIds: [...state.completedIds, action.id] };
  return state;
}`,
    '7-5': `function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <span>{theme}</span>;
}`,
    '8-4': `function useSubscription(source, onChange) {
  useEffect(() => { const unsubscribe = source.subscribe(onChange); return () => unsubscribe(); }, [source, onChange]);
  return null;
}`,
    '8-5': `function useDisclosure() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}`,
    '9-4': `function CoursesPanel({ status, courses }) {
  if (status === "loading") return <p>불러오는 중</p>;
  if (status === "error") return <p role="alert">다시 시도하세요</p>;
  if (status === "success" && courses.length === 0) return <p>검색 결과가 없습니다.</p>;
  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;
}`,
    '9-5': 'function courseMessage(status, courses) {\n  if (status === "loading") return "불러오는 중";\n  if (status === "error") return "요청에 실패했습니다";\n  if (status === "success" && courses.length === 0) return "검색 결과가 없습니다";\n  if (status === "success") return `${courses.length}개 과정`;\n  return "요청 전";\n}',
  };
  const allPrompts = [];

  for (let week = 7; week <= 9; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has five distinct daily examples`);

    const locateCases = [];
    for (const session of lesson.sessions) {
      const dayKey = `${week}-${session.number}`;
      const prefix = `react-w${week}-d${session.number}`;
      assert.deepEqual(session.exercises.map((exercise) => exercise.type), expectedTypes[session.number - 1], `${prefix} has a complementary question mix`);
      assert.equal(session.exercises.length, 3, `${prefix} keeps three questions`);
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, `${prefix} uses different prompts`);
      assert.ok(session.objective.length > 25, `${prefix} has a specific learning goal`);
      allPrompts.push(...session.exercises.map((exercise) => exercise.prompt));

      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(new Set(exercise.choices.map((option) => option.text)).size, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id} explains the choice`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, '모르겠습니다'), false, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.ok(exercise.answerLines.every((line) => Number.isInteger(line) && line > 0 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          locateCases.push(exercise.codeLines.join('\n'));
        }
        if (exercise.type === 'repair-code') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.match(exercise.gradingNote, /실행형 채점은 아니며|실행하거나 브라우저를 열지 않습니다/);
          if (repairs[dayKey]) assert.equal(gradeAnswer(exercise, repairs[dayKey]), true, exercise.id);
        }
      }
    }
    assert.equal(new Set(locateCases).size, locateCases.length, `React W${week} does not reuse an error snippet`);
  }

  assert.equal(new Set(allPrompts).size, 45, 'React W7–W9 prompts are distinct across the batch');
  for (const id of [
    'react-reducer-action-default-short-v3', 'react-hook-name-choice-v3',
    'react-w7-d4-repair-v2', 'react-w8-d4-repair', 'react-w9-d4-repair-v2', 'react-w9-d5-repair-v2',
  ]) assert.ok(questionById(id), id);
});

test('React weeks ten through twelve align navigation, user testing, and learning-record cases with each daily goal', () => {
  const react = trackById('react');
  const expectedTypes = [
    ['choice', 'short-answer', 'locate-error'], ['short-answer', 'choice', 'locate-error'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
  ];
  const repairs = {
    '10-4': `function CurrentCourseLink({ pathname }) {
  return <a href="/tracks/react" aria-current={pathname === "/tracks/react" ? "page" : undefined}>React</a>;
}`,
    '10-5': `function MissingCoursePage() {
  return <main><h1>과정을 찾을 수 없습니다</h1><a href="/tracks">과정 목록</a></main>;
}`,
    '11-4': 'function CourseCount({ courses }) {\n  const label = `${courses.length}개 과정`;\n  return <p>{label}</p>;\n}',
    '11-5': `function SaveIconButton({ save }) {
  return <button type="button" aria-label="과정 저장" onClick={save}><SaveIcon aria-hidden="true" /></button>;
}`,
    '12-4': `function SaveStatus({ saveState }) {
  if (saveState === "error") return <p role="alert">기록을 저장하지 못했습니다. 페이지를 닫기 전에 답안을 복사해 주세요.</p>;
  return <p>저장되었습니다.</p>;
}`,
    '12-5': `function ResumeLink({ lesson }) {
  return lesson?.href ? <a href={lesson.href}>이어 학습</a> : <a href="/tracks">과정 선택</a>;
}`,
  };
  const allPrompts = [];

  for (let week = 10; week <= 12; week += 1) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has five distinct daily examples`);
    const locateCases = [];

    for (const session of lesson.sessions) {
      const dayKey = `${week}-${session.number}`;
      const prefix = `react-w${week}-d${session.number}`;
      assert.deepEqual(session.exercises.map((exercise) => exercise.type), expectedTypes[session.number - 1], `${prefix} has a complementary question mix`);
      assert.equal(session.exercises.length, 3, `${prefix} keeps three questions`);
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, `${prefix} uses different prompts`);
      assert.ok(session.objective.length > 25, `${prefix} has a specific learning goal`);
      allPrompts.push(...session.exercises.map((exercise) => exercise.prompt));

      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(new Set(exercise.choices.map((option) => option.text)).size, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id} explains the choice`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, '모르겠습니다'), false, exercise.id);
          assert.doesNotMatch(exercise.prompt, /주제 이름을 적으세요/, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.ok(exercise.answerLines.every((line) => Number.isInteger(line) && line > 0 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          locateCases.push(exercise.codeLines.join('\n'));
        }
        if (exercise.type === 'repair-code') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.match(exercise.gradingNote, /실행형 채점은 아니며|실행하거나 브라우저를 열지 않습니다/);
          if (repairs[dayKey]) assert.equal(gradeAnswer(exercise, repairs[dayKey]), true, exercise.id);
        }
      }
    }

    assert.equal(new Set(locateCases).size, locateCases.length, `React W${week} does not reuse an error snippet`);
  }

  assert.equal(new Set(allPrompts).size, 45, 'React W10–W12 prompts are distinct across the batch');
  for (const id of [
    'react-action-button-short-v2', 'react-route-focus-locate-v2', 'react-test-role-choice-v2',
    'react-test-result-short-v2', 'react-test-measure-locate-v3', 'react-capstone-empty-locate-v2',
    'react-disclosure-state-short-v2', 'react-w10-d4-repair-v2', 'react-w10-d5-repair-v2',
    'react-w11-d4-repair-v2', 'react-w11-d5-repair-v2', 'react-w12-d4-repair-v2', 'react-w12-d5-repair-v2',
  ]) assert.ok(questionById(id), id);
});

test('React weeks thirteen through fifteen align state models, composition, and Context with daily cases', () => {
  const react = trackById('react');
  const expectedTypes = [
    ['choice', 'short-answer', 'locate-error'], ['short-answer', 'locate-error', 'choice'], ['locate-error', 'choice', 'short-answer'], ['choice', 'locate-error', 'repair-code'], ['repair-code', 'choice', 'short-answer'],
  ];
  const repairs = {
    '13-4': `function shouldApplyResponse(activeId, responseId) {
  return activeId === responseId;
}`,
    '13-5': `function isFinalStatus(status) {
  return status === "success" || status === "error";
}`,
    '14-4': `function CourseList({ courses }) {
  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;
}`,
    '14-5': `function SaveAction({ save }) {
  return <button type="button" onClick={save}>저장</button>;
}`,
    '15-4': `function ThemeProvider({ theme, children }) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}`,
    '15-5': `function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <span>{theme === "dark" ? "어두운 화면" : "밝은 화면"}</span>;
}`,
  };
  const allPrompts = [];

  for (const week of [13, 14, 15]) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has five distinct day examples`);
    const locateCases = [];
    const answerPositions = { a: 0, b: 0, c: 0 };

    for (const session of lesson.sessions) {
      const dayKey = `${week}-${session.number}`;
      const prefix = `react-w${week}-d${session.number}`;
      assert.deepEqual(session.exercises.map((exercise) => exercise.type), expectedTypes[session.number - 1], `${prefix} uses the intended exercise mix`);
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, `${prefix} prompts are distinct`);
      assert.ok(session.objective.length > 25, `${prefix} states an actionable daily objective`);
      allPrompts.push(...session.exercises.map((exercise) => exercise.prompt));

      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id} has an option-specific reason`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, '모르겠습니다'), false, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.ok(exercise.answerLines.every((line) => Number.isInteger(line) && line > 0 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          locateCases.push(exercise.codeLines.join('\n'));
        }
        if (exercise.type === 'repair-code') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.match(exercise.gradingNote, /실행형 채점은 아니며|실행하거나 브라우저를 열지 않습니다/);
          if (repairs[dayKey]) assert.equal(gradeAnswer(exercise, repairs[dayKey]), true, exercise.id);
        }
      }

      assert.equal(new Set(locateCases).size, locateCases.length, `React W${week} does not repeat locate stimuli`);
    }

    assert.ok(Math.max(...Object.values(answerPositions)) - Math.min(...Object.values(answerPositions)) <= 1, `React W${week} balances choice positions`);
  }

  assert.equal(new Set(allPrompts).size, 45, 'React W13–W15 prompts are distinct');
  for (const id of [
    'react-w13-d1-debug-v2', 'react-w13-d4-repair-v2', 'react-w14-d1-trace-v2',
    'react-w14-d4-repair-v2', 'react-w14-d5-repair-v2', 'react-w15-d2-debug-v2',
    'react-w15-d4-repair-v2', 'react-w15-d5-repair-v2',
  ]) assert.ok(questionById(id), id);
});

test('advanced JavaScript and React weeks have distinct, gradeable daily learning cases', () => {
  for (const trackId of ['javascript', 'react']) {
    const track = trackById(trackId);
    for (const lesson of track.lessons.filter((item) => item.week >= 13)) {
      assert.ok(track.course.reviewedWeeks.includes(lesson.week), lesson.id);
      const exercises = lesson.sessions.flatMap((session) => session.exercises);
      assert.equal(lesson.sessions.length, 5, `${lesson.id} sessions`);
      assert.ok(lesson.sessions.every((session) => session.exercises.length === 3), `${lesson.id} daily question count`);
      assert.equal(new Set(lesson.sessions.map((session) => session.title)).size, 5, `${lesson.id} daily titles`);
      assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `${lesson.id} daily examples`);
      assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 15, `${lesson.id} daily prompts`);

      for (const exercise of exercises) {
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          const wrong = exercise.choices.find((choice) => choice.id !== exercise.answer);
          assert.equal(gradeAnswer(exercise, wrong.id), false, exercise.id);
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          assert.equal(gradeAnswer(exercise, ''), false, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.codeLines.length >= 2, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.ok(exercise.acceptanceCriteria.requirements[0].length > 20, exercise.id);
        }
      }

      const dayFour = lesson.sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
      const dayFive = lesson.sessions[4].exercises.find((exercise) => exercise.type === 'repair-code');
      assert.notEqual(dayFour.starterCode, dayFive.starterCode, `${lesson.id} repair examples`);
      assert.notEqual(dayFour.acceptanceCriteria.requirements[0], dayFive.acceptanceCriteria.requirements[0], `${lesson.id} repair goals`);
    }
  }
});

test('advanced JavaScript and React code-tracing examples produce their published answers', async () => {
  for (const trackId of ['javascript', 'react']) {
    const track = trackById(trackId);
    for (const lesson of track.lessons.filter((item) => item.week >= 13)) {
      for (const exercise of lesson.sessions.flatMap((session) => session.exercises).filter((item) => item.type === 'short-answer')) {
        const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
        assert.ok(match, `${exercise.id} code example`);
        const output = [];
        const logger = { log: (...values) => output.push(values.map(String).join(' ')) };
        await new AsyncFunction('console', 'performance', 'AbortController', 'document', match[1])(
          logger,
          globalThis.performance,
          globalThis.AbortController,
          makeDocument(),
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(gradeAnswer(exercise, output.join('\n')), true, exercise.id);
      }
    }
  }
});

test('React weeks sixteen through eighteen teach versioned transitions, error recovery, and measured performance', () => {
  const react = trackById('react');
  const expectedRepairs = {
    '16-4': 'function NextAction({ onNext }) {\n  return <button type="button" onClick={onNext}>다음 과정</button>;\n}',
    '16-5': 'function MotionHeading({ title }) {\n  return <ViewTransition><h1>{title}</h1></ViewTransition>;\n}',
    '17-4': 'function ErrorNotice({ error, retry }) {\n  return <div><p role="alert">{error.message}</p><button type="button" onClick={retry}>다시 시도</button></div>;\n}',
    '17-5': 'function EmailField({ email, onEmailChange }) {\n  const invalid = email.length > 0 && !email.includes("@");\n  return <><label htmlFor="email">이메일</label><input id="email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? "email-error" : undefined} />{invalid && <p id="email-error" role="alert">이메일 형식을 확인하세요.</p>}</>;\n}',
    '18-4': 'function App({ theme, typing }) {\n  return <ThemeContext value={theme}><TypingContext value={typing}><Page /></TypingContext></ThemeContext>;\n}',
    '18-5': 'function getVisibleCourses(courses, start, pageSize) {\n  return courses.slice(start, start + pageSize);\n}',
  };

  for (const week of [16, 17, 18]) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has distinct day examples`);
    const prompts = [];
    const answerPositions = { a: 0, b: 0, c: 0 };

    for (const session of lesson.sessions) {
      assert.ok(session.objective.length > 25, session.id);
      const exercises = session.exercises;
      prompts.push(...exercises.map((exercise) => exercise.prompt));
      assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 3, session.id);
      for (const exercise of exercises) {
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id}`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.codeLines.length >= 2, exercise.id);
          assert.ok(exercise.answerLines.every((line) => line >= 1 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.equal(gradeAnswer(exercise, expectedRepairs[`${week}-${session.number}`]), true, exercise.id);
        }
      }
    }

    assert.equal(new Set(prompts).size, 15, `React W${week} prompts are distinct`);
    assert.ok(Math.max(...Object.values(answerPositions)) - Math.min(...Object.values(answerPositions)) <= 1, `React W${week} answer positions are balanced`);
  }
});

test('React weeks nineteen through twenty-one teach accessible forms, safe output, and route failure boundaries', () => {
  const react = trackById('react');
  const expectedRepairs = {
    '19-4': 'function ErrorSummary({ errors }) {\n  return <ul aria-label="입력 오류">{errors.map((error) => <li key={error.id}><a href={"#" + error.fieldId}>{error.message}</a></li>)}</ul>;\n}',
    '19-5': 'function FieldHint({ id, message }) {\n  return <p id={id} role="alert">{message}</p>;\n}',
    '20-4': 'function Comment({ comment }) {\n  return <p>{comment}</p>;\n}',
    '20-5': 'function CommentText({ comment }) {\n  return <p>{comment}</p>;\n}',
    '21-4': 'function LessonPage({ loading, error, lesson, retry }) {\n  if (loading) return <Spinner />;\n  if (error) return <div role="alert"><p>단원을 불러오지 못했습니다.</p><button type="button" onClick={retry}>다시 시도</button></div>;\n  if (!lesson) return <p>단원을 찾을 수 없습니다.</p>;\n  return <Lesson lesson={lesson} />;\n}',
    '21-5': 'function NextLesson({ href }) {\n  return <a href={href}>다음 단원</a>;\n}',
  };

  for (const week of [19, 20, 21]) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has distinct day examples`);
    const prompts = [];
    const answerPositions = { a: 0, b: 0, c: 0 };

    for (const session of lesson.sessions) {
      assert.ok(session.objective.length > 25, session.id);
      prompts.push(...session.exercises.map((exercise) => exercise.prompt));
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, session.id);
      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id}`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.codeLines.length >= 2, exercise.id);
          assert.ok(exercise.answerLines.every((line) => line >= 1 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.equal(gradeAnswer(exercise, expectedRepairs[`${week}-${session.number}`]), true, exercise.id);
        }
      }
    }

    assert.equal(new Set(prompts).size, 15, `React W${week} prompts are distinct`);
    assert.ok(Math.max(...Object.values(answerPositions)) - Math.min(...Object.values(answerPositions)) <= 1, `React W${week} answer positions are balanced`);
  }

  const unsafeOutput = react.lessons.find((item) => item.week === 20).sessions[3].exercises.find((exercise) => exercise.type === 'locate-error');
  assert.match(unsafeOutput.codeLines[unsafeOutput.answerLines[0] - 1], /dangerouslySetInnerHTML/);
  assert.match(unsafeOutput.explanation, /원본 HTML을 그대로 신뢰/);
  const imagePolicy = react.lessons.find((item) => item.week === 20).sessions[2].exercises.find((exercise) => exercise.type === 'locate-error');
  assert.match(imagePolicy.explanation, /React는 속성 값을 렌더링하지만/);
});

test('React weeks twenty-two through twenty-four teach storage recovery, code splitting, and guarded state transitions', async () => {
  const react = trackById('react');
  const expectedRepairs = {
    '22-4': 'function persistProgress(storage, key, value) {\n  try {\n    storage.setItem(key, JSON.stringify(value));\n    return { ok: true };\n  } catch (error) {\n    return { ok: false, error };\n  }\n}',
    '22-5': 'function parseSavedProgress(raw) {\n  if (!raw) return { done: 0 };\n  try { return JSON.parse(raw); } catch { return { done: 0 }; }\n}',
    '23-4': 'function SettingsRoute({ SettingsPage }) {\n  return <Suspense fallback={<p>설정을 불러오는 중입니다.</p>}><SettingsPage /></Suspense>;\n}',
    '23-5': 'function AsyncCoursePage({ CoursePage }) {\n  return <Suspense fallback={<p>불러오는 중</p>}><CoursePage /></Suspense>;\n}',
    '24-4': 'function canTransition(from, to, transitions) {\n  return (transitions[from] ?? []).includes(to);\n}',
    '24-5': 'function mayDispatch(from, to, transitions) {\n  return (transitions[from] ?? []).includes(to);\n}',
  };

  for (const week of [22, 23, 24]) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has distinct day examples`);
    const prompts = [];
    const answerPositions = { a: 0, b: 0, c: 0 };

    for (const session of lesson.sessions) {
      assert.ok(session.objective.length > 25, session.id);
      prompts.push(...session.exercises.map((exercise) => exercise.prompt));
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, session.id);
      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id}`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
          assert.ok(match, `${exercise.id} includes its trace example`);
          const output = [];
          await new AsyncFunction('console', 'performance', 'AbortController', match[1])(
            { log: (...values) => output.push(values.map(String).join(' ')) },
            globalThis.performance,
            globalThis.AbortController,
          );
          assert.equal(gradeAnswer(exercise, output.join('\n')), true, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.codeLines.length >= 2, exercise.id);
          assert.ok(exercise.answerLines.every((line) => line >= 1 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.equal(gradeAnswer(exercise, expectedRepairs[`${week}-${session.number}`]), true, exercise.id);
        }
      }
    }

    assert.equal(new Set(prompts).size, 15, `React W${week} prompts are distinct`);
    assert.ok(Math.max(...Object.values(answerPositions)) - Math.min(...Object.values(answerPositions)) <= 1, `React W${week} answer positions are balanced`);
  }

  const storageRepair = react.lessons.find((item) => item.week === 22).sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
  assert.match(storageRepair.hint, /storage\.setItem/);
  const preloadChoice = react.lessons.find((item) => item.week === 23).sessions[4].exercises.find((exercise) => exercise.type === 'choice');
  assert.match(preloadChoice.prompt, /화면 코드를 미리 불러올 때/);
  assert.match(preloadChoice.choices.find((option) => option.id === preloadChoice.answer).text, /진입 가능성과 전송 비용/);
  const transitionRepair = react.lessons.find((item) => item.week === 24).sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
  assert.match(transitionRepair.hint, /transitions\[from\]/);
});

test('React weeks twenty-five and twenty-six integrate recovery, keyboard use, and safe resume flows', async () => {
  const react = trackById('react');
  const expectedRepairs = {
    '25-4': 'function AnswerControls({ submitting, feedback }) {\n  return <><button type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? "제출 중" : "답안 제출"}</button>{feedback && <p role="status">{feedback}</p>}</>;\n}',
    '25-5': 'function LearningPanel({ loadStatus, saveStatus, exercises, draft, onChange, onSubmit, retry }) {\n  if (loadStatus === "loading") return <p>문항을 불러오는 중입니다.</p>;\n  if (loadStatus === "error") return <div role="alert"><p>문항을 불러오지 못했습니다.</p><button type="button" onClick={retry}>다시 시도</button></div>;\n  if (exercises.length === 0) return <p>아직 문항이 없습니다.</p>;\n  return <form onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}><QuestionList exercises={exercises} /><label htmlFor="answer">답안</label><textarea id="answer" value={draft} onChange={(event) => onChange(event.target.value)} /><button type="submit">제출</button>{saveStatus === "success" && <p role="status">저장되었습니다.</p>}{saveStatus === "error" && <p role="alert">저장에 실패했습니다. 답안을 유지하고 다시 시도하세요.</p>}</form>;\n}',
    '26-4': 'function ResumeLink({ href }) {\n  if (!href) return <a href="/tracks">과정 선택</a>;\n  return <a href={href}>이어 학습</a>;\n}',
    '26-5': 'function ResumeTarget({ lesson }) {\n  return lesson?.href ? <a href={lesson.href}>이어 학습</a> : <a href="/tracks">과정 선택</a>;\n}',
  };

  for (const week of [25, 26]) {
    const lesson = react.lessons.find((item) => item.week === week);
    assert.equal(lesson.sessions.length, 5, `React W${week} has five learning days`);
    assert.equal(lesson.sessions.reduce((sum, session) => sum + session.exercises.length, 0), 15, `React W${week} has fifteen exercises`);
    assert.equal(new Set(lesson.sessions.map((session) => session.example)).size, 5, `React W${week} has distinct day examples`);
    const prompts = [];
    const answerPositions = { a: 0, b: 0, c: 0 };

    for (const session of lesson.sessions) {
      assert.ok(session.objective.length > 25, session.id);
      prompts.push(...session.exercises.map((exercise) => exercise.prompt));
      assert.equal(new Set(session.exercises.map((exercise) => exercise.prompt)).size, 3, session.id);
      for (const exercise of session.exercises) {
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices) {
            assert.ok(exercise.choiceExplanations[option.id].length > 25, `${exercise.id}/${option.id}`);
            if (option.id !== exercise.answer) assert.equal(gradeAnswer(exercise, option.id), false, exercise.id);
          }
        }
        if (exercise.type === 'short-answer') {
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
          const match = exercise.prompt.match(/\n\n`([\s\S]+?)`$/);
          assert.ok(match, `${exercise.id} includes its trace example`);
          const output = [];
          await new AsyncFunction('console', 'performance', 'AbortController', match[1])(
            { log: (...values) => output.push(values.map(String).join(' ')) },
            globalThis.performance,
            globalThis.AbortController,
          );
          assert.equal(gradeAnswer(exercise, output.join('\n')), true, exercise.id);
        }
        if (exercise.type === 'locate-error') {
          assert.ok(exercise.codeLines.length >= 2, exercise.id);
          assert.ok(exercise.answerLines.every((line) => line >= 1 && line <= exercise.codeLines.length), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
          assert.ok(exercise.hint.length > 25, exercise.id);
          assert.ok(exercise.explanation.length > 35, exercise.id);
        }
        if (exercise.type === 'repair-code') {
          assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
          assert.equal(gradeAnswer(exercise, expectedRepairs[`${week}-${session.number}`]), true, exercise.id);
        }
      }
    }

    assert.equal(new Set(prompts).size, 15, `React W${week} prompts are distinct`);
    assert.ok(Math.max(...Object.values(answerPositions)) - Math.min(...Object.values(answerPositions)) <= 1, `React W${week} answer positions are balanced`);
  }

  const capstoneRepair = react.lessons.find((item) => item.week === 25).sessions[4].exercises.find((exercise) => exercise.type === 'repair-code');
  assert.match(capstoneRepair.acceptanceCriteria.requirements[0], /loading·오류·빈 상태/);
  assert.match(capstoneRepair.solutionPatterns[0], /preventDefault/);
  assert.match(capstoneRepair.solutionPatterns[0], /saveStatus/);
  assert.match(capstoneRepair.solutionPatterns[0], /저장되었습니다/);
  const resumeRepair = react.lessons.find((item) => item.week === 26).sessions[3].exercises.find((exercise) => exercise.type === 'repair-code');
  assert.match(resumeRepair.acceptanceCriteria.requirements[0], /과정 카탈로그/);
  assert.match(resumeRepair.solutionPatterns[0], /href/);
});

test('React final lessons use distinct concept hints for accessibility, safety, storage, and recovery', () => {
  const react = trackById('react');
  const genericHint = 'JSX가 보여 주는 값, 이벤트가 바꾸는 값, 외부 시스템과 동기화하는 값을 구분하세요.';
  for (const lesson of react.lessons.filter((item) => item.week >= 19)) {
    const hints = lesson.studyDays.map((day) => day.exercises.find((exercise) => exercise.type === 'choice').hint);
    assert.ok(hints.every((hint) => hint && hint !== genericHint), `React W${lesson.week} uses a topic-specific hint`);
    assert.equal(new Set(hints).size, hints.length, `React W${lesson.week} has distinct concept hints`);
  }
});

test('React repair hints and explanations describe the function being repaired', () => {
  const react = trackById('react');
  const expected = {
    '8-4': [/subscribe.*정리 함수.*source와 onChange/, /구독.*cleanup.*source와 onChange/],
    '13-5': [/성공과 실패.*종료 상태/, /성공한 상태와 실패한 상태.*종료/],
    '19-5': [/id.*role.*alert/, /id.*role=.*alert/],
    '20-4': [/HTML.*텍스트/, /JSX.*텍스트.*HTML/],
    '22-5': [/JSON\.parse.*catch.*기본 객체/, /손상.*파싱 오류.*기본 진도 객체/],
  };
  const genericHint = '입력, 상태 갱신, JSX 반환 중 요구사항이 바꾸는 부분만 먼저 표시하세요.';
  const genericExplanation = 'React에서는 값을 직접 바꾸기보다 새 상태 또는 명시적인 JSX를 반환해 흐름을 읽기 쉽게 만듭니다.';

  for (const [key, [hintPattern, explanationPattern]] of Object.entries(expected)) {
    const [week, day] = key.split('-').map(Number);
    const repair = react.lessons.find((lesson) => lesson.week === week)
      .sessions.find((session) => session.number === day)
      .exercises.find((exercise) => exercise.type === 'repair-code');
    assert.ok(repair, key);
    assert.notEqual(repair.hint, genericHint, repair.id);
    assert.match(repair.hint, hintPattern, repair.id);
    assert.match(repair.explanation, explanationPattern, repair.id);
    assert.doesNotMatch(repair.explanation, new RegExp(genericExplanation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), repair.id);
  }
});

test('JavaScript foundation repair accepts common equivalent solutions for closures and input checks', () => {
  const makeCounterVariants = [
    'function makeCounter() { let count = 0; return () => { count += 1; return count; }; }',
    'function makeCounter() { let count = 0; return function () { return ++count; }; }',
    'function makeCounter() { let count = 0; return () => (count += 1); }',
  ];
  for (const code of makeCounterVariants) {
    assert.equal(gradeAnswer(questionById('js-w7-d4-repair-v2'), code), true);
    const makeCounter = new Function(`${code}; return makeCounter;`)();
    const next = makeCounter();
    assert.deepEqual([next(), next()], [1, 2]);
  }

  const pairVariants = [
    'function makeCounterPair() { let count = 0; return [() => { count += 1; return count; }, () => { count += 1; return count; }]; }',
    'function makeCounterPair() { let count = 0; return [function () { return ++count; }, function () { return ++count; }]; }',
  ];
  for (const code of pairVariants) {
    assert.equal(gradeAnswer(questionById('js-w7-d5-repair-v2'), code), true);
    const makeCounterPair = new Function(`${code}; return makeCounterPair;`)();
    const [first, second] = makeCounterPair();
    assert.deepEqual([first(), second(), first()], [1, 2, 3]);
  }

  const parseAttempt = 'function parseAttempt(raw) { if (typeof raw !== "string" || raw.trim() === "") return null; const value = Number(raw); if (!Number.isInteger(value)) return null; return value; }';
  assert.equal(gradeAnswer(questionById('js-w8-d4-repair-v2'), parseAttempt), true);
  const parse = new Function(`${parseAttempt}; return parseAttempt;`)();
  assert.deepEqual(['12', '12.0', '2.5', ' ', 4].map(parse), [12, 12, null, null, null]);
  assert.match(questionById('js-w8-d4-concept-v2').choiceExplanations.c, /Number\("2\.5"\)는 NaN이 아니라 2\.5입니다/);

  const usableTitleVariants = [
    "function isUsableTitle(title) { return typeof title === 'string' && title.trim().length > 0; }",
    'function isUsableTitle(title) { if (typeof title !== "string") return false; return title.trim().length > 0; }',
    'function isUsableTitle(title) { return typeof title === "string" && Boolean(title.trim()); }',
  ];
  for (const code of usableTitleVariants) {
    assert.equal(gradeAnswer(questionById('js-w8-d5-repair-v2'), code), true);
    const isUsableTitle = new Function(`${code}; return isUsableTitle;`)();
    assert.deepEqual(['React', '   ', null].map(isUsableTitle), [true, false, false]);
  }

  const readTitleVariants = [
    'function readTitle(input) { const title = input.value.trim(); if (title.length === 0) return null; return title; }',
    'function readTitle(input) { const title = input.value.trim(); if (!title) return null; return title; }',
    'function readTitle(input) { const title = input.value.trim(); return title || null; }',
  ];
  for (const code of readTitleVariants) {
    assert.equal(gradeAnswer(questionById('js-w9-d4-repair-v2'), code), true);
    const readTitle = new Function(`${code}; return readTitle;`)();
    assert.deepEqual([{ value: ' React ' }, { value: ' ' }].map(readTitle), ['React', null]);
  }
});

test('React W3 event trace answers require every requested outcome and preserve saved question ids', () => {
  const clickHandler = getExercise('react-w3-d1-trace-v3');
  assert.equal(getExercise('react-w3-d1-trace-v2'), clickHandler);
  const week3 = trackById('react').lessons.find((lesson) => lesson.week === 3);
  assert.ok(week3.sessions[0].exercises.some((exercise) => exercise.id === clickHandler.id));
  assert.equal(gradeAnswer(clickHandler, '아니요'), false);
  assert.equal(gradeAnswer(clickHandler, '클릭할 때'), false);
  assert.equal(gradeAnswer(clickHandler, '아니요. 클릭할 때 실행'), true);
  assert.equal(gradeAnswer(clickHandler, '렌더링 중에는 실행되지 않고 버튼을 클릭할 때 실행'), true);

  const propagation = getExercise('react-w3-d5-trace-v3');
  assert.equal(getExercise('react-w3-d5-trace-v2'), propagation);
  assert.ok(week3.sessions[4].exercises.some((exercise) => exercise.id === propagation.id));
  assert.equal(gradeAnswer(propagation, '삭제만 실행'), false);
  assert.equal(gradeAnswer(propagation, '삭제는 실행되고 부모 카드 처리는 실행되지 않음'), true);
  assert.equal(gradeAnswer(propagation, 'remove만 실행되고 부모 handler는 실행되지 않음'), true);
});

test('React W4-W6 traces match their examples, assumptions, and saved question ids', () => {
  const react = trackById('react');
  const week4 = react.lessons.find((lesson) => lesson.week === 4);
  const appendTrace = getExercise('react-w4-d2-trace-v4');
  assert.equal(getExercise('react-w4-d2-trace-v3'), appendTrace);
  assert.equal(getExercise('react-w4-d2-trace-v2'), appendTrace);
  assert.ok(week4.sessions[1].exercises.some((exercise) => exercise.id === appendTrace.id));
  const appendCode = appendTrace.prompt.match(/\n\n`([^`]+)`$/)?.[1];
  assert.ok(appendCode);
  const appendOutput = [];
  new Function('console', appendCode)({ log: (value) => appendOutput.push(value) });
  assert.deepEqual(appendOutput, ['JS / JS,React']);
  assert.equal(gradeAnswer(appendTrace, appendOutput[0]), true);
  assert.equal(gradeAnswer(appendTrace, 'JS, JS,React'), false);

  const week5 = react.lessons.find((lesson) => lesson.week === 5);
  const describedByTrace = getExercise('react-w5-d5-trace-v3');
  assert.equal(getExercise('react-w5-d5-trace-v2'), describedByTrace);
  assert.ok(week5.sessions[4].exercises.some((exercise) => exercise.id === describedByTrace.id));
  assert.match(describedByTrace.prompt, /aria-describedby="course-title-error"/);
  assert.match(describedByTrace.prompt, /<p id="title-error">/);
  assert.equal(gradeAnswer(describedByTrace, 'course-title-error'), true);
  assert.equal(gradeAnswer(describedByTrace, 'title-error'), false);

  const week6 = react.lessons.find((lesson) => lesson.week === 6);
  const effectTrace = getExercise('react-w6-d3-trace-v3');
  assert.equal(getExercise('react-w6-d3-trace-v2'), effectTrace);
  assert.ok(week6.sessions[2].exercises.some((exercise) => exercise.id === effectTrace.id));
  assert.match(effectTrace.prompt, /개발용 Strict Mode의 추가 실행은 세지 않습니다/);
  assert.equal(gradeAnswer(effectTrace, 'react state'), false);
  assert.equal(gradeAnswer(effectTrace, '두 번; react state'), true);
});

test('React W7-W9 traces align with their code and preserve saved question ids', async () => {
  const react = trackById('react');
  const readCode = (exercise) => {
    const start = exercise.prompt.indexOf('\n\n`');
    assert.notEqual(start, -1, exercise.id);
    return exercise.prompt.slice(start + 3, -1);
  };

  const hookName = getExercise('react-w8-d1-trace-v4');
  assert.equal(getExercise('react-w8-d1-trace-v3'), hookName);
  assert.equal(getExercise('react-w8-d1-trace-v2'), hookName);
  assert.ok(react.lessons.find((lesson) => lesson.week === 8).sessions[0].exercises.some((exercise) => exercise.id === hookName.id));
  const hookNameOutput = [];
  new Function('console', readCode(hookName))({ log: (...values) => hookNameOutput.push(values.join(' ')) });
  assert.deepEqual(hookNameOutput, ['true']);
  assert.equal(gradeAnswer(hookName, 'true'), true);
  assert.equal(gradeAnswer(hookName, 'false'), false);

  const independentHook = getExercise('react-w8-d5-trace-v3');
  assert.equal(getExercise('react-w8-d5-trace-v2'), independentHook);
  assert.ok(react.lessons.find((lesson) => lesson.week === 8).sessions[4].exercises.some((exercise) => exercise.id === independentHook.id));
  const independentCode = readCode(independentHook);
  assert.match(independentHook.prompt, /두 번째 패널의 `right\.open` 값/);
  assert.match(independentCode, /const left = useDisclosure\(\);/);
  assert.match(independentCode, /const right = useDisclosure\(\);/);
  assert.match(independentCode, /onClick=\{left\.show\}/);
  assert.equal(gradeAnswer(independentHook, 'false'), true);
  assert.equal(gradeAnswer(independentHook, 'true'), false);

  const week9 = react.lessons.find((lesson) => lesson.week === 9);
  const loadingTrace = getExercise('react-w9-d1-trace-v3');
  assert.equal(getExercise('react-w9-d1-trace-v2'), loadingTrace);
  assert.ok(week9.sessions[0].exercises.some((exercise) => exercise.id === loadingTrace.id));
  const loadingCode = readCode(loadingTrace);
  assert.match(loadingTrace.prompt, /응답 전까지 끝나지 않는다고 가정/);
  const loadCourses = new Function(`${loadingCode}; return loadCourses;`)();
  const statuses = [];
  let resolveFetch;
  const pendingFetch = new Promise((resolve) => { resolveFetch = resolve; });
  const loading = loadCourses('React', () => pendingFetch, (status) => statuses.push(status));
  assert.deepEqual(statuses, ['loading']);
  resolveFetch(['React']);
  assert.deepEqual(await loading, ['React']);
  assert.deepEqual(statuses, ['loading', 'success']);
  assert.equal(gradeAnswer(loadingTrace, 'loading'), true);

  const abortTrace = getExercise('react-w9-d3-trace-v3');
  assert.equal(getExercise('react-w9-d3-trace-v2'), abortTrace);
  assert.ok(week9.sessions[2].exercises.some((exercise) => exercise.id === abortTrace.id));
  const abortCode = readCode(abortTrace);
  assert.match(abortTrace.prompt, /화면 `result`/);
  assert.match(abortCode, /const \[result, setResult\]/);
  assert.match(abortCode, /if \(!controller\.signal\.aborted\) setResult\(value\)/);
  assert.equal(gradeAnswer(abortTrace, '아니요'), true);
  assert.equal(gradeAnswer(abortTrace, '취소된다'), false);
  const loadSource = abortCode.slice(0, abortCode.indexOf('\n\nfunction SearchResults'));
  const load = new Function(`${loadSource}; return load;`)();
  const controller = new AbortController();
  let applied = false;
  load('A', controller.signal).then((value) => {
    if (!controller.signal.aborted) applied = true;
  });
  controller.abort();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(applied, false);
});

test('React root-relative href trace rejects the different relative path and preserves saved answers', () => {
  const hrefTrace = getExercise('react-w10-d1-trace-v3');
  assert.equal(getExercise('react-w10-d1-trace-v2'), hrefTrace);
  const week10 = trackById('react').lessons.find((lesson) => lesson.week === 10);
  assert.ok(week10.sessions[0].exercises.some((exercise) => exercise.id === hrefTrace.id));
  assert.match(hrefTrace.prompt, /href="\/tracks\/react"/);
  assert.equal(gradeAnswer(hrefTrace, '/tracks/react'), true);
  assert.equal(gradeAnswer(hrefTrace, '"/tracks/react"'), true);
  assert.equal(gradeAnswer(hrefTrace, 'tracks/react'), false);
  const base = 'https://example.test/learn/react';
  assert.equal(new URL('/tracks/react', base).pathname, '/tracks/react');
  assert.equal(new URL('tracks/react', base).pathname, '/learn/tracks/react');
});

test('React button handler trace shows the exact onClick function prop and preserves saved answers', () => {
  const handlerTrace = getExercise('react-w14-d5-trace-v3');
  assert.equal(getExercise('react-w14-d5-trace-v2'), handlerTrace);
  const week14 = trackById('react').lessons.find((lesson) => lesson.week === 14);
  assert.ok(week14.sessions[4].exercises.some((exercise) => exercise.id === handlerTrace.id));
  assert.match(handlerTrace.prompt, /onClick에 전달되는 함수 prop 이름/);
  const match = handlerTrace.prompt.match(/\n\n`([\s\S]+?)`$/);
  assert.ok(match);
  assert.match(match[1], /buttonProps = \{ type: "button", onClick: save \}/);
  assert.equal(gradeAnswer(handlerTrace, 'save'), true);
  assert.equal(gradeAnswer(handlerTrace, 'onClick'), false);
});

test('React save failure trace executes saveBeforeNavigate and preserves both earlier answer ids', () => {
  const saveTrace = getExercise('react-w16-d2-trace-v4');
  assert.equal(getExercise('react-w16-d2-trace-v3'), saveTrace);
  assert.equal(getExercise('react-w16-d2-trace-v2'), saveTrace);
  const week16 = trackById('react').lessons.find((lesson) => lesson.week === 16);
  assert.ok(week16.sessions[1].exercises.some((exercise) => exercise.id === saveTrace.id));
  assert.match(saveTrace.prompt, /saveBeforeNavigate에서 save 결과가/);
  const match = saveTrace.prompt.match(/\n\n`([\s\S]+?)`$/);
  assert.ok(match);
  assert.match(match[1], /await save\(\)/);
  assert.match(match[1], /if \(!result\.ok\) return false/);
  assert.equal(gradeAnswer(saveTrace, 'false'), true);
  assert.equal(gradeAnswer(saveTrace, 'true'), false);
});

test('React W16-W18 trace questions name values present in their runnable examples', () => {
  const promptsById = [
    ['react-w16-d1-trace-v2', /open이 false일 때 예제 조건식이 고르는 값/],
    ['react-w16-d3-trace-v3', /ids\.map\(\(item\) => item\.id\)\.join/],
    ['react-w16-d5-trace-v2', /예제 runtime 객체에 적힌 React 버전/],
    ['react-w17-d1-trace-v2', /예제 boundaryState 객체에서 failed 값/],
    ['react-w18-d1-trace-v2', /예제 actualDuration 배열에서 가장 큰 값/],
  ];
  for (const [id, promptPattern] of promptsById) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.match(exercise.prompt, promptPattern, id);
  }
  const idsTrace = getExercise('react-w16-d3-trace-v3');
  assert.equal(getExercise('react-w16-d3-trace-v2'), idsTrace);
  assert.equal(idsTrace.answerNormalization, 'case-sensitive');
});

test('React capstone trace asks about its learning sequence in Korean', () => {
  const sequenceTrace = getExercise('react-w25-d1-trace-v2');
  const question = sequenceTrace.prompt.split('\n\n`')[0];
  assert.match(question, /학습 단계 이름을 화살표로 연결/);
  assert.doesNotMatch(question, /flow/);
  assert.equal(gradeAnswer(sequenceTrace, 'open -> answer -> feedback -> save'), true);
});
