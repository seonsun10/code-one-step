import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { getTrack } from '../src/content.js';
import { curriculumAdditions } from '../src/curriculum-additions.js';
import { pythonExpansion } from '../src/curriculum-expansion-python.js';
import { gradeAnswer } from '../src/grading.js';

const unitIds = ['py-functions', 'py-lists', 'py-dictionaries'];
const legacyQuestionIds = new Map([
  ['py-functions', ['py-function-repair', 'py-functions-parameter-choice', 'py-functions-short']],
  ['py-lists', ['py-average-short', 'py-lists-index-choice', 'py-lists-locate']],
  ['py-dictionaries', ['py-dictionaries-choice', 'py-dictionaries-locate', 'py-dictionaries-short']],
]);
const expectedOutputs = new Map([
  ['py-functions', [['115'], ['안녕하세요, 민아', '환영, 준'], ['저장 완료', 'None'], ['110.0 0.1'], ['80.0']]],
  ['py-lists', [['80.0', 'None'], ['d', "['b', 'c']"], ["['read', 'review', 'quiz', 'test']", "['read', 'review', 'quiz', 'test', 'ship']"], ['[1, 2, 3]', '[1, 2, 3]', 'None'], ["[['done']]"]]],
  ['py-dictionaries', [['92'], ['0'], ['True 0', 'False 0'], ['mina 92', 'jun 85'], ['True', 'Python']]],
]);
const pythonCommand = ['python', 'python3'].find((command) => {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 1500 });
  return !result.error && result.status === 0;
});

const runPython = (code) => spawnSync(pythonCommand, ['-X', 'utf8', '-c', code], {
  encoding: 'utf8',
  timeout: 2500,
  maxBuffer: 4096,
});

test('G10 Python units four through six retain their source questions and teach distinct daily objectives', () => {
  const track = getTrack('python');
  assert.deepEqual(pythonExpansion.lessonOrder.slice(3, 6), unitIds);
  assert.deepEqual(track.lessons.slice(0, 12).map((lesson) => lesson.id), pythonExpansion.lessonOrder);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    const exercises = lesson.studyDays.flatMap((day) => day.exercises);

    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, `${unitId} has distinct daily objectives`);
    assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 15, unitId);
    for (const id of legacyQuestionIds.get(unitId)) {
      assert.equal(exercises.filter((exercise) => exercise.id === id || exercise.legacyIds?.includes(id)).length, 1, `${unitId} retains ${id} exactly once`);
    }

    for (const day of lesson.studyDays) {
      assert.ok(day.intro.length > 35, `${unitId} ${day.title} has a useful introduction`);
      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} has a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} has a useful explanation`);

        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.ok(exercise.choices.every((choice) => exercise.choiceExplanations[choice.id]?.length > 20), exercise.id);
          for (const choice of exercise.choices) {
            if (choice.id !== exercise.answer) assert.equal(gradeAnswer(exercise, choice.id), false, `${exercise.id}: ${choice.id}`);
          }
        } else if (exercise.type === 'short-answer') {
          assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        } else if (exercise.type === 'locate-error') {
          const lineNumber = exercise.answerLines[0];
          assert.ok(exercise.codeLines[lineNumber - 1], `${exercise.id} answer line exists`);
          assert.match(exercise.explanation, new RegExp(`${lineNumber}번 줄`), `${exercise.id} explanation names the selected line`);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} has an example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has test cases`);
          assert.match(exercise.gradingNote, /실행 결과를 채점하는 문항은 아닙니다|실행형 채점은 아니며/);
        } else {
          assert.fail(`Unexpected question type: ${exercise.type} (${exercise.id})`);
        }
      }
    }
  }
});

test('G10 Python functions, lists, and dictionaries daily examples match their actual output', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    for (const [index, day] of lesson.studyDays.entries()) {
      const result = runPython(day.example);
      assert.equal(result.error, undefined, `${unitId} ${day.title}: ${result.error?.message ?? ''}`);
      assert.equal(result.status, 0, `${unitId} ${day.title}: ${result.stderr}`);
      assert.deepEqual(result.stdout.trimEnd().split(/\r?\n/), expectedOutputs.get(unitId)[index], `${unitId} ${day.title}`);
    }
  }
});

test('G10 Python list and dictionary diagnostics point to faults that reproduce', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(3, 6).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));
  const defects = new Map([
    ['py-w04-d4-locate-v2', '    rate = 0.2'],
    ['py-lists-locate', 'tasks + ["복습"]'],
    ['py-w05-d4-locate-v2', 'sorted(scores)'],
    ['py-dictionaries-locate', 'print(scores[name])'],
    ['py-w06-d4-locate-v2', 'for name, score in scores:'],
  ]);

  for (const [id, expectedLine] of defects) {
    const exercise = exercises.get(id);
    assert.ok(exercise, `${id} is part of the route`);
    assert.ok(exercise.codeLines[exercise.answerLines[0] - 1].includes(expectedLine), `${id} selects the defect`);
    assert.match(exercise.explanation, new RegExp(`${exercise.answerLines[0]}번 줄`), `${id} explanation points to the selected line`);
  }

  const runLocated = (id) => runPython(exercises.get(id).codeLines.join('\n'));
  assert.equal(runLocated('py-w04-d4-locate-v2').stdout.trim(), '0.1');
  assert.equal(runLocated('py-lists-locate').stdout.trim(), "['읽기']");
  assert.equal(runLocated('py-w05-d4-locate-v2').stdout.trim(), '[3, 1, 2]');
  const missingKey = runLocated('py-dictionaries-locate');
  assert.notEqual(missingKey.status, 0);
  assert.match(missingKey.stderr, /KeyError/);
  const unpack = runLocated('py-w06-d4-locate-v2');
  assert.notEqual(unpack.status, 0);
  assert.match(unpack.stderr, /ValueError/);
});

test('G10 Python function and collection repairs accept their stated solutions and preserve contracts', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(3, 6).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));
  const repairs = [
    {
      id: 'py-function-repair',
      answers: ['def double(value):\n    return value * 2'],
      calls: 'print(double(0), double(-3))',
      expected: '0 -6',
    },
    {
      id: 'py-w04-d5-repair-v2',
      answers: ['def discounted(price, rate):\n    return price * (1 - rate)'],
      calls: 'print(discounted(100, 0.2))\nprint(discounted(100, 1))\nprint(discounted(0, 0.2))\nprint(discounted(100, 0))',
      expected: '80.0\n0\n0.0\n100',
    },
    {
      id: 'py-w05-d5-repair-v3',
      answers: [
        'def filter_minutes(minutes, minimum):\n    return [value for value in minutes if value >= minimum]',
        'def filter_minutes(minutes, minimum):\n    result = []\n    for value in minutes:\n        if value >= minimum:\n            result.append(value)\n    return result',
      ],
      calls: 'values = [45, 60, 80, 60]\nprint(filter_minutes(values, 60), values)\nprint(filter_minutes([], 10))',
      expected: '[60, 80, 60] [45, 60, 80, 60]\n[]',
    },
    {
      id: 'py-w06-d5-repair-v2',
      answers: ['def nested_course_title(record):\n    course = record.get("course") or {}\n    return course.get("title", "제목 없음")'],
      calls: 'print(repr(nested_course_title({})))\nprint(repr(nested_course_title({"course": None})))\nprint(repr(nested_course_title({"course": {}})))\nprint(repr(nested_course_title({"course": {"title": ""}})))\nprint(repr(nested_course_title({"course": {"title": "Python"}})))',
      expected: "'제목 없음'\n'제목 없음'\n'제목 없음'\n''\n'Python'",
    },
  ];

  for (const repair of repairs) {
    const exercise = exercises.get(repair.id);
    assert.ok(exercise, `${repair.id} is part of the route`);
    for (const answer of repair.answers) {
      assert.equal(gradeAnswer(exercise, answer), true, `${repair.id} accepts the documented full-function answer`);
      const result = runPython(`${answer}\n${repair.calls}`);
      assert.equal(result.error, undefined, `${repair.id}: ${result.error?.message ?? ''}`);
      assert.equal(result.status, 0, `${repair.id}: ${result.stderr}`);
      assert.equal(result.stdout.trimEnd().replace(/\r\n/g, '\n'), repair.expected, repair.id);
    }
  }
});

test('G10 Python version metadata cites the stable release and current collection references', () => {
  const metadata = curriculumAdditions.python;
  assert.equal(metadata.version, 'Python 3.15.1');
  assert.equal(metadata.reviewedAt, '2026-10-23');
  assert.ok(metadata.sources.some((source) => source.url === 'https://www.python.org/downloads/release/python-3151/'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://docs.python.org/3.15/tutorial/controlflow.html'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://docs.python.org/3.15/tutorial/datastructures.html'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://docs.python.org/3.15/library/stdtypes.html#mapping-types-dict'));
  assert.match(metadata.versionContext, /Python 3\.12\.10에서 실행/);
  assert.match(metadata.versionContext, /Python 3\.15\.1 런타임으로 실행해 확인하지는 않았어요/);
});
