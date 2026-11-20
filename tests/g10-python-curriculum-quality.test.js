import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { getTrack } from '../src/content.js';
import { curriculumAdditions } from '../src/curriculum-additions.js';
import { pythonExpansion } from '../src/curriculum-expansion-python.js';
import { pythonCourseExpansion } from '../src/curriculum-weeks-python.js';
import { gradeAnswer } from '../src/grading.js';

const unitIds = ['py-variables', 'py-conditions', 'py-loops'];
const legacyQuestionIds = new Map([
  ['py-variables', ['py-variables-choice', 'py-variables-type-choice', 'py-variables-short']],
  ['py-conditions', ['py-conditions-choice', 'py-conditions-locate', 'py-conditions-short']],
  ['py-loops', ['py-loop-locate', 'py-loops-range-choice', 'py-loops-short']],
]);
const expectedOutputs = new Map([
  ['py-variables', [['5'], ['34 str'], ['3.4 3 2', '-4 3'], ['Mina: 40분'], ['28']]],
  ['py-conditions', [['True'], ['입장 대기'], ['B'], ['False'], ['Python']]],
  ['py-loops', [['9'], ['[2, 3, 4]', '[0, 1, 2]'], ['6'], ['left: 0'], ['[0, 2, 4]']]],
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

test('G10 Python units one through three retain their original questions in the reviewed weekly route', () => {
  const track = getTrack('python');
  assert.deepEqual(pythonExpansion.lessonOrder.slice(0, 3), unitIds);
  assert.deepEqual(pythonCourseExpansion.lessonOrder.slice(0, 12), pythonExpansion.lessonOrder);
  assert.deepEqual(track.lessons.slice(0, 12).map((lesson) => lesson.id), pythonExpansion.lessonOrder);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    const exercises = lesson.studyDays.flatMap((day) => day.exercises);
    const legacyIds = legacyQuestionIds.get(unitId);

    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, `${unitId} has five distinct daily teaching goals`);
    assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 15, unitId);
    for (const id of legacyIds) {
      assert.equal(exercises.filter((exercise) => exercise.id === id || exercise.legacyIds?.includes(id)).length, 1, `${unitId} retains ${id} exactly once`);
    }

    for (const day of lesson.studyDays) {
      assert.ok(day.intro.length > 35, `${unitId} ${day.title} has a useful daily introduction`);
      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} has a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} has an explanation`);

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
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} has a public example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 0, `${exercise.id} has test cases`);
          assert.match(exercise.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
        } else {
          assert.fail(`Unexpected question type: ${exercise.type} (${exercise.id})`);
        }
      }
    }
  }
});

test('G10 Python daily examples match their stated outputs on the available local interpreter', { skip: !pythonCommand }, () => {
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

test('G10 Python defect-location questions identify executable or concrete faulty lines', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const questions = track.lessons.slice(0, 3).flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  const byId = new Map(questions.map((exercise) => [exercise.id, exercise]));
  const defectLines = new Map([
    ['py-w01-d4-locate-v2', 'message = "이름: {name}"'],
    ['py-w02-d4-locate-v2', 'if items is True:'],
    ['py-loop-locate', 'for value in values[1:]'],
    ['py-w03-d4-locate-v2', 'count += 1'],
  ]);

  for (const [id, expectedLine] of defectLines) {
    const exercise = byId.get(id);
    assert.ok(exercise, `${id} is on the learner route`);
    assert.ok(exercise.codeLines[exercise.answerLines[0] - 1].includes(expectedLine), `${id} selects its defect`);
    assert.match(exercise.explanation, new RegExp(`${exercise.answerLines[0]}번 줄`), `${id} explains its selected line`);
  }

  const runLocated = (id) => {
    const result = runPython(byId.get(id).codeLines.join('\n'));
    assert.equal(result.error, undefined, `${id}: ${result.error?.message ?? ''}`);
    assert.equal(result.status, 0, `${id}: ${result.stderr}`);
    return result.stdout.trimEnd();
  };
  assert.equal(runLocated('py-w01-d4-locate-v2'), '이름: {name}');
  assert.equal(runLocated('py-w02-d4-locate-v2'), '');
  assert.equal(runLocated('py-loop-locate'), '7');
  assert.match(byId.get('py-w03-d4-locate-v2').prompt, /오히려 1을 더하고/);
});

test('G10 Python code repairs accept and execute both documented solution forms', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(0, 3).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));
  const repairCases = [
    {
      id: 'py-w01-d5-repair-v2',
      answers: [
        'def parse_integer(raw):\n    return int(raw)',
        'def parse_integer(raw):\n    value = int(raw)\n    return value',
      ],
      calls: 'print(parse_integer("17"), parse_integer("0"), parse_integer("-2"))',
      expected: '17 0 -2',
    },
    {
      id: 'py-w02-d5-repair',
      answers: [
        'def has_title(title):\n    return bool(title and title.strip())',
        'def has_title(title):\n    if title is None:\n        return False\n    return bool(title.strip())',
      ],
      calls: 'print(has_title(None), has_title("   "), has_title("  x  "))',
      expected: 'False False True',
    },
    {
      id: 'py-w03-d5-repair',
      answers: [
        'def even_values(values):\n    return [value for value in values if value % 2 == 0]',
        'def even_values(values):\n    result = []\n    for value in values:\n        if value % 2 == 0:\n            result.append(value)\n    return result',
      ],
      calls: 'values = [1, -2, 0, 3, 2]\nprint(even_values(values), values)\nprint(even_values([]))',
      expected: '[-2, 0, 2] [1, -2, 0, 3, 2]\n[]',
    },
  ];

  for (const item of repairCases) {
    const exercise = exercises.get(item.id);
    assert.ok(exercise, `${item.id} is on the learner route`);
    for (const answer of item.answers) {
      assert.equal(gradeAnswer(exercise, answer), true, `${item.id} accepts documented solution`);
      const result = runPython(`${answer}\n${item.calls}`);
      assert.equal(result.error, undefined, `${item.id}: ${result.error?.message ?? ''}`);
      assert.equal(result.status, 0, `${item.id}: ${result.stderr}`);
      assert.equal(result.stdout.trimEnd().replace(/\r\n/g, '\n'), item.expected, item.id);
    }
  }
});

test('Python learning metadata points to the current stable release and beginner references', () => {
  const metadata = curriculumAdditions.python;
  assert.equal(metadata.version, 'Python 3.15.1');
  assert.equal(metadata.reviewedAt, '2026-10-23');
  assert.ok(metadata.sources.some((source) => source.url === 'https://www.python.org/downloads/release/python-3151/'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://docs.python.org/3.15/tutorial/introduction.html'));
  assert.ok(metadata.sources.some((source) => source.url === 'https://docs.python.org/3.15/tutorial/controlflow.html'));
  assert.match(metadata.versionContext, /Python 3\.12\.10에서 실행/);
  assert.match(metadata.versionContext, /Python 3\.15\.1 런타임으로 실행해 확인하지는 않았어요/);
});
