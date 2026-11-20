import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { getTrack } from '../src/content.js';
import { curriculumAdditions } from '../src/curriculum-additions.js';
import { pythonExpansion } from '../src/curriculum-expansion-python.js';
import { pythonCourseExpansion } from '../src/curriculum-weeks-python.js';
import { gradeAnswer } from '../src/grading.js';

const unitIds = ['py-classes-types', 'py-async-concurrency', 'py-data-capstone'];
const legacyQuestionAssignments = [
  ['py-classes-locate', unitIds[0], 1],
  ['py-classes-choice', unitIds[0], 3],
  ['py-classes-types-short', unitIds[0], 3],
  ['py-async-short', unitIds[1], 3],
  ['py-async-choice', unitIds[1], 4],
  ['py-async-locate', unitIds[1], 4],
  ['py-capstone-choice-v2', unitIds[2], 2],
  ['py-capstone-locate', unitIds[2], 5],
  ['py-capstone-short', unitIds[2], 5],
];
const expectedOutputs = new Map([
  [unitIds[0], ['민아', 'Python 함수 실전', '3', "Course(title='Python', hours=12)", '09:00']],
  [unitIds[1], ['5', "익명\n''", 'True', '완료순: 준, 민아 / 결과순: 민아와 준', '333332833333500000']],
  [unitIds[2], ['[True, False, False]', '1', "['복습', '퀴즈', '읽기']", '0 0\nNone', '60.0\n0']],
]);
const projectTempDirectory = join(process.cwd(), '.tmp');
mkdirSync(projectTempDirectory, { recursive: true });
const pythonCommand = ['python', 'python3'].find((command) => {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 1500 });
  return !result.error && result.status === 0;
});

const pythonEnvironment = (tempDirectory = projectTempDirectory) => ({
  ...process.env,
  TMP: tempDirectory,
  TEMP: tempDirectory,
  TMPDIR: tempDirectory,
});

const runPython = (code, { timeout = 2500 } = {}) => spawnSync(pythonCommand, ['-X', 'utf8', '-c', code], {
  env: pythonEnvironment(),
  encoding: 'utf8',
  timeout,
  maxBuffer: 4096,
});

const runPythonFile = (code, timeout = 5000) => {
  const folder = mkdtempSync(join(projectTempDirectory, 'g10-python-file-'));
  try {
    const path = join(folder, 'example.py');
    writeFileSync(path, code, 'utf8');
    return spawnSync(pythonCommand, ['-X', 'utf8', path], {
      cwd: folder,
      env: pythonEnvironment(folder),
      encoding: 'utf8',
      timeout,
      maxBuffer: 4096,
    });
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
};

test('G10 Python units ten through twelve preserve the route and explain every daily question', () => {
  const track = getTrack('python');
  assert.deepEqual(pythonExpansion.lessonOrder.slice(9, 12), unitIds);
  assert.deepEqual(pythonCourseExpansion.lessonOrder.slice(0, 12), pythonExpansion.lessonOrder);
  assert.deepEqual(track.lessons.slice(0, 12).map((lesson) => lesson.id), pythonExpansion.lessonOrder);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    assert.ok(lesson, `missing routed lesson ${unitId}`);
    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, `${unitId} repeats a daily goal`);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.ok(day.intro.length > 35, `${unitId} day ${index + 1} needs a useful goal`);
      for (const exercise of day.exercises) {
        assert.ok(exercise.hint?.length > 12, `${exercise.id} needs a usable hint`);
        assert.ok(exercise.explanation?.length > 20, `${exercise.id} needs a teaching explanation`);
        if (exercise.type === 'choice') {
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          assert.ok(exercise.choices.every((choice) => exercise.choiceExplanations[choice.id]?.length > 22), exercise.id);
          for (const choice of exercise.choices) {
            if (choice.id !== exercise.answer) assert.equal(gradeAnswer(exercise, choice.id), false, `${exercise.id}: ${choice.id}`);
          }
        } else if (exercise.type === 'short-answer') {
          assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
        } else if (exercise.type === 'locate-error') {
          const line = exercise.answerLines[0];
          assert.ok(exercise.codeLines[line - 1], `${exercise.id} points outside its code`);
          assert.match(exercise.explanation, new RegExp(`${line}번 줄`), `${exercise.id} explanation must name its answer line`);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} needs an example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 1, `${exercise.id} needs edge cases`);
          assert.match(exercise.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
        } else {
          assert.fail(`Unexpected exercise type ${exercise.type} (${exercise.id})`);
        }
      }
    }
  }

  for (const [exerciseId, lessonId, dayNumber] of legacyQuestionAssignments) {
    const lesson = track.lessons.find((item) => item.id === lessonId);
    assert.ok(lesson.studyDays[dayNumber - 1].exercises.some((exercise) => exercise.id === exerciseId || exercise.legacyIds?.includes(exerciseId)), exerciseId);
  }
});

test('G10 Python classes, async, and capstone examples match Python output', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    for (const [index, day] of lesson.studyDays.entries()) {
      if (unitId === unitIds[1] && index === 3) continue;
      const result = unitId === unitIds[1] && index === 4
        ? runPythonFile(day.example)
        : runPython(day.example);
      assert.equal(result.error, undefined, `${unitId} day ${index + 1}: ${result.error?.message ?? ''}`);
      assert.equal(result.status, 0, `${unitId} day ${index + 1}: ${result.stderr}`);
      assert.equal(result.stdout.trimEnd().replace(/\r\n/g, '\n'), expectedOutputs.get(unitId)[index], `${unitId} day ${index + 1}`);
    }
  }
});

test('G10 Python gather output preserves input order when the local asyncio runtime is available', { skip: !pythonCommand }, (context) => {
  const day = getTrack('python').lessons.find((lesson) => lesson.id === unitIds[1]).studyDays[3];
  const result = runPythonFile(day.example, 3000);
  if (result.error?.code === 'ETIMEDOUT') {
    context.skip('The Windows sandbox did not finish this asyncio.run example within the bounded 3 second check.');
    return;
  }
  assert.equal(result.error, undefined, result.error?.message ?? '');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trimEnd().replace(/\r\n/g, '\n'), expectedOutputs.get(unitIds[1])[3]);
});

test('G10 Python class, async, and data diagnostics identify real faults', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(9, 12).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));

  const instanceCount = exercises.get('py-w10-d2-locate-v2');
  assert.equal(instanceCount.codeLines[instanceCount.answerLines[0] - 1].trim(), 'self.active += 1');
  const instanceResult = runPython(instanceCount.codeLines.join('\n'));
  assert.equal(instanceResult.status, 0, instanceResult.stderr);
  assert.equal(instanceResult.stdout.trim(), '0 1 1');

  const repr = exercises.get('py-w10-d4-locate-v2');
  assert.equal(repr.codeLines[repr.answerLines[0] - 1].trim(), 'print(self.title)');
  const reprResult = runPython(repr.codeLines.join('\n'));
  assert.notEqual(reprResult.status, 0);
  assert.match(reprResult.stderr, /TypeError.*__repr__.*non-string|__repr__ returned non-string/);

  const typeHint = exercises.get('py-w11-d1-locate-v2');
  const typeHintResult = runPython(typeHint.codeLines.join('\n'));
  assert.notEqual(typeHintResult.status, 0);
  assert.match(typeHintResult.stderr, /TypeError/);

  const optional = exercises.get('py-w11-d2-locate-v2');
  assert.equal(optional.codeLines[optional.answerLines[0] - 1].trim(), 'if not name:');
  const optionalResult = runPython(optional.codeLines.join('\n'));
  assert.equal(optionalResult.status, 0, optionalResult.stderr);
  assert.equal(optionalResult.stdout.trim().replace(/\r\n/g, '\n'), "'익명'\n'익명'");

  const invalidRecord = exercises.get('py-w12-d1-locate-v2');
  assert.equal(invalidRecord.codeLines[invalidRecord.answerLines[0] - 1].trim(), 'if record["done"]:');
  const noneRecordResult = runPython(invalidRecord.codeLines.join('\n'));
  assert.notEqual(noneRecordResult.status, 0);
  assert.match(noneRecordResult.stderr, /TypeError/);
  const missingKeyCode = invalidRecord.codeLines.join('\n').replace('records = [{"done": True}, None, {}]', 'records = [{}]');
  const missingKeyResult = runPython(missingKeyCode);
  assert.notEqual(missingKeyResult.status, 0);
  assert.match(missingKeyResult.stderr, /KeyError/);

  const assignment = exercises.get('py-w12-d2-locate-v2');
  const syntaxResult = runPython(assignment.codeLines.join('\n'));
  assert.notEqual(syntaxResult.status, 0);
  assert.match(syntaxResult.stderr, /SyntaxError/);

  const sort = exercises.get('py-w12-d3-locate-v2');
  assert.equal(sort.codeLines[sort.answerLines[0] - 1].startsWith('ordered = records.sort('), true);
  const sortResult = runPython(sort.codeLines.join('\n'));
  assert.equal(sortResult.status, 0, sortResult.stderr);
  assert.equal(sortResult.stdout.trim(), "['복습', '퀴즈', '읽기'] None");

  const emptyAverage = exercises.get('py-w12-d4-locate-v2');
  const averageResult = runPython(emptyAverage.codeLines.join('\n'));
  assert.notEqual(averageResult.status, 0);
  assert.match(averageResult.stderr, /ZeroDivisionError/);
});

test('G10 Python class, process, and completion repairs meet their documented contracts', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(9, 12).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));

  const studySession = exercises.get('py-w10-d5-repair-v2');
  const studySessionAnswer = 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return self.clock.now()';
  assert.equal(gradeAnswer(studySession, studySessionAnswer), true);
  const sessionResult = runPython(`${studySessionAnswer}\nclass FixedClock:\n    def __init__(self, value):\n        self.value = value\n    def now(self):\n        return self.value\nprint(StudySession(FixedClock("09:00")).label())\nprint(StudySession(FixedClock("14:30")).label())`);
  assert.equal(sessionResult.status, 0, sessionResult.stderr);
  assert.equal(sessionResult.stdout.trim().replace(/\r\n/g, '\n'), '09:00\n14:30');

  const submit = exercises.get('py-w11-d5-repair-v2');
  const submitAnswer = 'def submit_cpu(executor, calculate, limit):\n    return executor.submit(calculate, limit)';
  assert.equal(gradeAnswer(submit, submitAnswer), true);
  const submitResult = runPython(`class FakeExecutor:\n    def submit(self, function, value):\n        self.received = (function.__name__, value)\n        return future\ndef square(value):\n    return value * value\nfuture = object()\nexecutor = FakeExecutor()\n${submitAnswer}\nreturned = submit_cpu(executor, square, 5)\nprint(returned is future, executor.received)`);
  assert.equal(submitResult.status, 0, submitResult.stderr);
  assert.equal(submitResult.stdout.trim(), "True ('square', 5)");

  const completion = exercises.get('py-w12-d5-repair-v2');
  const completionAnswer = 'def completion_rate(done, total):\n    if total == 0:\n        return 0\n    return done / total * 100';
  assert.match(completion.prompt, /0 ≤ done ≤ total/);
  assert.match(completion.acceptanceCriteria.constraints.join(' '), /0 ≤ done ≤ total/);
  assert.equal(gradeAnswer(completion, completionAnswer), true);
  const completionResult = runPython(`${completionAnswer}\nprint(completion_rate(3, 5))\nprint(completion_rate(0, 5))\nprint(completion_rate(0, 0))`);
  assert.equal(completionResult.status, 0, completionResult.stderr);
  assert.equal(completionResult.stdout.trim().replace(/\r\n/g, '\n'), '60.0\n0.0\n0');
});

test('Python 3.15 references cover classes, repr, typing, asyncio, and process pools', () => {
  const metadata = curriculumAdditions.python;
  assert.equal(metadata.version, 'Python 3.15.1');
  assert.equal(metadata.reviewedAt, '2026-10-23');
  for (const url of [
    'https://www.python.org/downloads/release/python-3151/',
    'https://docs.python.org/3.15/tutorial/classes.html',
    'https://docs.python.org/3.15/reference/datamodel.html#object.__repr__',
    'https://docs.python.org/3.15/library/typing.html',
    'https://docs.python.org/3.15/library/asyncio-task.html',
    'https://docs.python.org/3.15/library/concurrent.futures.html',
  ]) {
    assert.ok(metadata.sources.some((source) => source.url === url), `missing official reference ${url}`);
  }
  assert.match(metadata.versionContext, /Python 3\.12\.10에서 실행/);
  assert.match(metadata.versionContext, /Python 3\.15\.1 런타임으로 실행해 확인하지는 않았어요/);
});
