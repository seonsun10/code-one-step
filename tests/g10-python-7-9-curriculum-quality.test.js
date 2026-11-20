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

const unitIds = ['py-modules-errors', 'py-files-context', 'py-iterators-generators'];
const legacyQuestionAssignments = [
  ['py-modules-choice', unitIds[0], 1],
  ['py-modules-errors-locate', unitIds[0], 2],
  ['py-modules-errors-short', unitIds[0], 3],
  ['py-files-context-choice', unitIds[1], 1],
  ['py-files-context-locate', unitIds[1], 2],
  ['py-files-context-short', unitIds[1], 3],
  ['py-generators-choice', unitIds[2], 1],
  ['py-generators-locate', unitIds[2], 2],
  ['py-generators-short', unitIds[2], 3],
];
const expectedOutputs = new Map([
  [unitIds[0], ['4\n3.0', '12 0', 'ValueError', '변환 시도 끝\n8', '7 0']],
  [unitIds[1], ['복습\nTrue', '복습', '한글 bytes', '30', '완료']],
  [unitIds[2], ['4\n7', '[0, 1, 4]\n[]', '시작\n계속', '[10, 12, 14]', '[0, 1, 4, 9]']],
]);
const projectTempDirectory = join(process.cwd(), '.tmp');
mkdirSync(projectTempDirectory, { recursive: true });
const pythonCommand = ['python', 'python3'].find((command) => {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 1500 });
  return !result.error && result.status === 0;
});

const runPython = (code, { cwd, timeout = 2500 } = {}) => spawnSync(pythonCommand, ['-X', 'utf8', '-c', code], {
  cwd,
  env: { ...process.env, TMP: projectTempDirectory, TEMP: projectTempDirectory, TMPDIR: projectTempDirectory },
  encoding: 'utf8',
  timeout,
  maxBuffer: 4096,
});

test('G10 Python units seven through nine preserve the route and explain every daily question', () => {
  const track = getTrack('python');
  assert.deepEqual(pythonExpansion.lessonOrder.slice(6, 9), unitIds);
  assert.deepEqual(pythonCourseExpansion.lessonOrder.slice(0, 12), pythonExpansion.lessonOrder);
  assert.deepEqual(track.lessons.slice(0, 12).map((lesson) => lesson.id), pythonExpansion.lessonOrder);

  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    assert.ok(lesson, `missing routed lesson ${unitId}`);
    assert.equal(lesson.studyDays.length, 5, unitId);
    assert.ok(lesson.studyDays.every((day) => day.exercises.length === 3), unitId);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, `${unitId} repeats a daily introduction`);

    for (const [index, day] of lesson.studyDays.entries()) {
      assert.ok(day.intro.length > 35, `${unitId} day ${index + 1} needs a useful learning goal`);
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
          assert.match(exercise.explanation, new RegExp(`${line}번 줄`), `${exercise.id} explanation does not identify the answer`);
          assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
        } else if (exercise.type === 'repair-code') {
          assert.ok(exercise.acceptanceCriteria.examples.length > 0, `${exercise.id} needs a public example`);
          assert.ok(exercise.acceptanceCriteria.tests.length > 1, `${exercise.id} needs edge cases`);
          assert.match(exercise.gradingNote, /실행 결과를 채점하는 문항은 아닙니다/);
        } else {
          assert.fail(`Unexpected exercise type ${exercise.type} (${exercise.id})`);
        }
      }
    }
  }

  const iteratorFirst = track.lessons.find((item) => item.id === unitIds[2]).studyDays[0]
    .exercises.find((item) => item.id === 'py-generators-choice');
  assert.equal(iteratorFirst.title, '반복자의 첫 값');
  assert.match(iteratorFirst.prompt, /iter\(\[0, 1, 4\]\)/);
  assert.doesNotMatch(iteratorFirst.prompt, /squares|yield|제너레이터/);

  for (const [exerciseId, lessonId, dayNumber] of legacyQuestionAssignments) {
    const lesson = track.lessons.find((item) => item.id === lessonId);
    assert.ok(lesson.studyDays[dayNumber - 1].exercises.some((exercise) => exercise.id === exerciseId || exercise.legacyIds?.includes(exerciseId)), exerciseId);
  }
});

test('G10 Python units seven through nine examples match actual Python output', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const lineReadingExample = track.lessons.find((item) => item.week === 8).studyDays[3].example;
  assert.match(lineReadingExample, /path\.open\(encoding="utf-8"\)/);
  assert.doesNotMatch(lineReadingExample, /StringIO/);
  for (const unitId of unitIds) {
    const lesson = track.lessons.find((item) => item.id === unitId);
    for (const [index, day] of lesson.studyDays.entries()) {
      const result = runPython(day.example);
      assert.equal(result.error, undefined, `${unitId} day ${index + 1}: ${result.error?.message ?? ''}`);
      assert.equal(result.status, 0, `${unitId} day ${index + 1}: ${result.stderr}`);
      assert.equal(result.stdout.trimEnd().replace(/\r\n/g, '\n'), expectedOutputs.get(unitId)[index], `${unitId} day ${index + 1}`);
    }
  }
});

test('G10 Python defect-location questions select defects that change behavior', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(6, 9).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));
  const finallyReturn = exercises.get('py-w07-d4-locate-v2');
  assert.equal(finallyReturn.codeLines[finallyReturn.answerLines[0] - 1].trim(), 'return 0');
  const finallyOutput = runPython(`${finallyReturn.codeLines.join('\n')}\nprint(parse_count("8"))\nprint(parse_count("bad"))`);
  assert.equal(finallyOutput.status, 0, finallyOutput.stderr);
  assert.equal(finallyOutput.stdout.trim().replace(/\r\n/g, '\n'), '0\n0');

  const fullRead = exercises.get('py-w08-d4-locate-v2');
  assert.equal(fullRead.codeLines[fullRead.answerLines[0] - 1].trim(), 'text = file.read()');
  assert.match(fullRead.explanation, /2번 줄/);
  const folder = mkdtempSync(join(projectTempDirectory, 'g10-python-stream-'));
  try {
    writeFileSync(join(folder, 'scores.txt'), '10\n20\n', 'utf8');
    const fullReadResult = runPython(fullRead.codeLines.join('\n'), { cwd: folder });
    assert.equal(fullReadResult.status, 0, fullReadResult.stderr);
    assert.equal(fullReadResult.stdout.trim(), '30');
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }

  const unbounded = exercises.get('py-w09-d4-locate-v2');
  assert.equal(unbounded.codeLines[unbounded.answerLines[0] - 1].trim(), 'values = list(count(10, 2))');
  assert.match(unbounded.explanation, /2번 줄/);
  const timed = runPython(unbounded.codeLines.join('\n'), { timeout: 350 });
  assert.equal(timed.error?.code, 'ETIMEDOUT', 'the unbounded collection should be stopped by the subprocess timeout');
});

test('G10 Python module, file, and generator repairs accept executable solutions and boundaries', { skip: !pythonCommand }, () => {
  const track = getTrack('python');
  const exercises = new Map(track.lessons.slice(6, 9).flatMap((lesson) => lesson.exercises).map((exercise) => [exercise.id, exercise]));
  const parse = exercises.get('py-w07-d5-repair-v2');
  const parseAnswer = 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0';
  assert.equal(gradeAnswer(parse, parseAnswer), true);
  const parsed = runPython(`${parseAnswer}\nprint(parse_count("-4"), parse_count(""))\ntry:\n    parse_count(None)\nexcept TypeError as error:\n    print(type(error).__name__)`);
  assert.equal(parsed.status, 0, parsed.stderr);
  assert.equal(parsed.stdout.trim().replace(/\r\n/g, '\n'), '-4 0\nTypeError');

  const save = exercises.get('py-w08-d5-repair-v2');
  const saveAnswer = 'def save_text_atomically(path, text):\n    temporary_path = None\n    try:\n        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as temporary:\n            temporary_path = Path(temporary.name)\n            temporary.write(text)\n        os.replace(temporary_path, path)\n    except OSError:\n        if temporary_path is not None:\n            temporary_path.unlink(missing_ok=True)\n        raise';
  assert.equal(gradeAnswer(save, saveAnswer), true);
  const saved = runPython(`from pathlib import Path\nfrom tempfile import NamedTemporaryFile, TemporaryDirectory\nfrom unittest.mock import patch\nimport tempfile\nimport os\n${saveAnswer}\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "notes.txt"\n    path.write_text("이전", encoding="utf-8")\n    save_text_atomically(path, "새 내용")\n    print(path.read_text(encoding="utf-8"))\n    with patch("os.replace", side_effect=OSError("교체 실패")):\n        try:\n            save_text_atomically(path, "실패할 내용")\n        except OSError:\n            print(path.read_text(encoding="utf-8"))\n            print(sorted(item.name for item in Path(folder).iterdir()))`);
  assert.equal(saved.status, 0, saved.stderr);
  assert.equal(saved.stdout.trim().replace(/\r\n/g, '\n'), '새 내용\n새 내용\n[\'notes.txt\']');

  const squares = exercises.get('py-w09-d5-repair-v2');
  const generatorAnswers = [
    'def squares_until(limit):\n    return (number * number for number in range(limit))',
    'def squares_until(limit):\n    for number in range(limit):\n        yield number * number',
  ];
  for (const answer of generatorAnswers) {
    assert.equal(gradeAnswer(squares, answer), true);
    const generated = runPython(`${answer}\nvalues = squares_until(4)\nprint(list(values))\nprint(list(values))\nprint(list(squares_until(-2)))`);
    assert.equal(generated.status, 0, generated.stderr);
    assert.equal(generated.stdout.trim().replace(/\r\n/g, '\n'), '[0, 1, 4, 9]\n[]\n[]');
  }
});

test('Python 3.15 course references cover errors, file I/O, iterators, and infinite inputs', () => {
  const metadata = curriculumAdditions.python;
  assert.equal(metadata.version, 'Python 3.15.1');
  assert.equal(metadata.reviewedAt, '2026-10-23');
  for (const url of [
    'https://www.python.org/downloads/release/python-3151/',
    'https://docs.python.org/3.15/tutorial/errors.html',
    'https://docs.python.org/3.15/tutorial/inputoutput.html',
    'https://docs.python.org/3.15/tutorial/classes.html',
    'https://docs.python.org/3.15/library/pathlib.html',
    'https://docs.python.org/3.15/library/tempfile.html',
    'https://docs.python.org/3.15/library/os.html#os.replace',
    'https://docs.python.org/3.15/library/itertools.html',
  ]) {
    assert.ok(metadata.sources.some((source) => source.url === url), `missing official reference ${url}`);
  }
  assert.match(metadata.versionContext, /Python 3\.12\.10에서 실행/);
  assert.match(metadata.versionContext, /Python 3\.15\.1 런타임으로 실행해 확인하지는 않았어요/);
});
