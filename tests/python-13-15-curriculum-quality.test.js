import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { getExercise, getLesson } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const tempRoot = resolve('.tmp');
mkdirSync(tempRoot, { recursive: true });

function runPython(code, options = {}) {
  const env = { ...process.env, TEMP: tempRoot, TMP: tempRoot, TMPDIR: tempRoot, ...options.env };
  delete env.STUDY_MODE;
  delete env.LIMIT;
  return spawnSync('python', ['-c', code], { encoding: 'utf8', timeout: 5000, env });
}

const expectedOutputs = {
  13: ["['python', 'java']", 'Hi, Mina', 'True', '3', '17'],
  14: ['2026', 'True', '2026-01-02T00:00:00+00:00', 'True', '{"at": "2026-01-02T00:00:00+00:00"}'],
  15: ['data/notes.txt', 'False', 'ready', 'local', '10'],
};

test('Python weeks 13–15 examples execute and match all fifteen answer keys', (t) => {
  const probe = spawnSync('python', ['--version'], { encoding: 'utf8', timeout: 2000 });
  if (probe.error) return t.skip(`Local Python runtime unavailable: ${probe.error.code}`);

  for (const [weekText, outputs] of Object.entries(expectedOutputs)) {
    const week = Number(weekText);
    const lesson = getLesson(`py-week-${String(week).padStart(2, '0')}`);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (const [index, day] of lesson.studyDays.entries()) {
      const exercise = day.exercises.find((item) => item.type === 'short-answer');
      const run = runPython(day.example);
      const id = `py-w${String(week).padStart(2, '0')}-d${index + 1}-trace`;
      assert.equal(run.error, undefined, `${id}: ${run.error?.message ?? ''}`);
      assert.equal(run.status, 0, `${id}: ${run.stderr}`);
      assert.equal(run.stdout.trimEnd(), outputs[index], id);
      assert.deepEqual(exercise.acceptedAnswers, [outputs[index]], id);
    }
  }
});

test('Python weeks 13–15 code-location cases reproduce their stated defects', (t) => {
  const probe = spawnSync('python', ['--version'], { encoding: 'utf8', timeout: 2000 });
  if (probe.error) return t.skip(`Local Python runtime unavailable: ${probe.error.code}`);

  const failures = [
    ['py-w13-d3-locate', 'AttributeError'],
    ['py-w13-d4-locate', 'IndexError'],
    ['py-w14-d1-locate', 'ValueError'],
    ['py-w14-d4-locate', 'JSONDecodeError'],
    ['py-w15-d1-locate', 'TypeError'],
    ['py-w15-d2-locate', 'FileNotFoundError'],
    ['py-w15-d3-locate', 'FileExistsError'],
  ];
  for (const [id, errorName] of failures) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    const run = runPython(exercise.codeLines.join('\n'));
    assert.equal(run.status, 1, id);
    assert.match(run.stderr, new RegExp(errorName), id);
  }

  const serialize = getExercise('py-w14-d5-repair-v2');
  const serializeRun = runPython(`${serialize.starterCode}\nfrom datetime import datetime\nprint(serialize_event(datetime.now()))`);
  assert.match(serializeRun.stderr, /TypeError/);
  const config = getExercise('py-w15-d5-repair-v2');
  const configRun = runPython(`${config.starterCode}\nprint(read_limit({}))`);
  assert.match(configRun.stderr, /KeyError/);

  assert.match(getExercise('py-w13-d5-choice').explanation, /정규식이 필요하지 않습니다/);
  const naiveTime = getExercise('py-w14-d2-locate');
  assert.match(naiveTime.codeLines[1], /datetime\(2026, 1, 2\)/);
  assert.doesNotMatch(naiveTime.codeLines[1], /tzinfo=/);
  assert.match(naiveTime.explanation, /현재 시스템 로컬 시간대/);
  assert.match(getExercise('py-w15-d4-locate').codeLines[1], /production-secret/);
});

test('Python weeks 13–15 give item-specific feedback and scoped code-repair contracts', () => {
  for (const week of [13, 14, 15]) {
    const lesson = getLesson(`py-week-${String(week).padStart(2, '0')}`);
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length > 30, `${lesson.id} D${day.number} objective`);
      const choice = day.exercises.find((item) => item.type === 'choice');
      assert.match(choice.prompt, /^Python \d+주차 \d+일 · .+: 맞는 설명을 고르세요\./, choice.id);
      assert.doesNotMatch(choice.prompt, /다음 예시는|주차.*사례입니다/, choice.id);
      assert.equal(choice.choices.length, 3, choice.id);
      for (const option of choice.choices) {
        const feedback = choice.choiceExplanations[option.id];
        assert.ok(feedback?.length > 25, `${choice.id} ${option.id}`);
        assert.doesNotMatch(feedback, /필요한 입력·자료형·제어 흐름 중 하나/);
      }
      const trace = day.exercises.find((item) => item.type === 'short-answer');
      assert.match(trace.prompt, /^Python \d+주차 \d+일 · .+: 실행 결과를 입력하세요\./, trace.id);
      assert.doesNotMatch(trace.prompt, /주차의 .* 예제에서 표시한 핵심 결과/, trace.id);
      assert.doesNotMatch(trace.explanation, /값이 바뀌는 시점과 새 객체를 반환하는지 여부를 분리해서 읽어야/);
      const locate = day.exercises.find((item) => item.type === 'locate-error');
      if (locate) assert.match(locate.prompt, /^Python \d+주차 \d+일 · .+: 요구사항과 맞지 않는 줄을 고르세요\./, locate.id);
    }
  }

  assert.match(getExercise('py-w13-d4-choice').choiceExplanations.a, /두 번째는 2/);
  assert.match(getExercise('py-w13-d4-choice').choiceExplanations.a, /문자열 3/);
  assert.match(getExercise('py-w13-d5-choice').choiceExplanations.a, /구분자가 고정되어 있으면/);
  assert.match(getExercise('py-w15-d5-choice').choiceExplanations.b, /형식과 허용 범위/);
  assert.match(getExercise('py-w15-d5-choice').choiceExplanations.c, /설정 문서/);
  assert.match(getExercise('py-w15-d2-locate').explanation, /exists\(\).*이후 읽기 성공을 보장하지 않습니다/);
  const settingsRepair = getExercise('py-w15-d5-repair-v2');
  assert.equal(settingsRepair.title, '설정 기본값 경계 처리');
  assert.match(settingsRepair.prompt, /^LIMIT가 없거나 None이면 10을 반환하고/);

  const repairs = [
    ['py-w13-d5-repair-v2', 'def course_number(label):\n    return label.split("-")[-1]', 'def course_number(label):\n    return label'],
    ['py-w14-d5-repair-v2', 'def serialize_event(value):\n    return json.dumps({"at": value.isoformat()})', 'def serialize_event(value):\n    return json.dumps({"at": value})'],
    ['py-w15-d5-repair-v2', 'def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10', 'def read_limit(settings):\n    return int(settings["LIMIT"])'],
  ];
  for (const [id, valid, invalid] of repairs) {
    const exercise = getExercise(id);
    assert.equal(gradeAnswer(exercise, valid), true, `${id} valid solution`);
    assert.equal(gradeAnswer(exercise, invalid), false, `${id} invalid solution`);
    assert.ok(exercise.acceptanceCriteria.tests.length > 1, id);
    assert.match(exercise.gradingNote, /정적/);
  }
  assert.deepEqual(getExercise('py-w15-d5-repair-v2').acceptanceCriteria.tests.map((item) => item.expected), [0, 10, 10, 'ValueError가 전파됨']);
});

test('Python weeks 13–15 accepted repairs produce their documented boundary results', (t) => {
  const probe = spawnSync('python', ['--version'], { encoding: 'utf8', timeout: 2000 });
  if (probe.error) return t.skip(`Local Python runtime unavailable: ${probe.error.code}`);

  const repairs = [
    [
      'py-w13-d5-repair-v2',
      'def course_number(label):\n    return label.split("-")[-1]',
      'print(course_number("course-004"))',
      '004',
    ],
    [
      'py-w14-d5-repair-v2',
      'import json\ndef serialize_event(value):\n    return json.dumps({"at": value.isoformat()})',
      'from datetime import datetime, timezone, timedelta\nvalue = datetime(2026, 1, 2, 9, tzinfo=timezone(timedelta(hours=9)))\nprint(serialize_event(value))',
      '{"at": "2026-01-02T09:00:00+09:00"}',
    ],
    [
      'py-w15-d5-repair-v2',
      'def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10',
      'print(read_limit({"LIMIT": "0"}))\nprint(read_limit({}))\nprint(read_limit({"LIMIT": None}))',
      '0\n10\n10',
    ],
  ];

  for (const [id, solution, checks, expected] of repairs) {
    const exercise = getExercise(id);
    assert.equal(gradeAnswer(exercise, solution), true, `${id} accepted solution`);
    const run = runPython(`${solution}\n${checks}`);
    assert.equal(run.status, 0, `${id}: ${run.stderr}`);
    assert.equal(run.stdout.replace(/\r\n/g, '\n').trimEnd(), expected, id);
  }

  const invalidLimit = runPython('def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10\nprint(read_limit({"LIMIT": "many"}))');
  assert.equal(invalidLimit.status, 1);
  assert.match(invalidLimit.stderr, /ValueError/);
});
