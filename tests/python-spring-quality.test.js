import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { getExercise, getLesson } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

test('Python explanations match the environment and regression examples', () => {
  const environment = getExercise('py-w15-d4-trace');
  const environmentChoice = getExercise('py-w15-d4-choice');
  assert.deepEqual(environment.acceptedAnswers, ['local']);
  assert.match(environment.prompt, /설정되지 않았다고 가정/);
  assert.match(environment.explanation, /기본값인 local/);
  assert.doesNotMatch(`${environment.hint} ${environment.explanation} ${environmentChoice.explanation}`, /production-secret|token/);

  const regressionDay = getLesson('py-week-26').studyDays[1];
  const regressionTrace = getExercise('py-w26-d2-trace-v2');
  const regressionChoice = getExercise('py-w26-d2-choice-v2');
  assert.deepEqual(regressionTrace.acceptedAnswers, ['3/3 passed']);
  for (const explanation of [regressionDay.intro, regressionChoice.explanation, regressionTrace.explanation]) {
    assert.match(explanation, /3.*0.*2/);
    assert.doesNotMatch(explanation, /3\+4|합계.{0,8}7/);
  }
});

test('Python regression question has one correct choice and explains each alternative', () => {
  const exercise = getExercise('py-w17-d5-choice-v2');
  assert.equal(getExercise('py-w17-d5-choice'), null);
  assert.match(exercise.choices.find((option) => option.id === exercise.answer).text, /고친 버그/);
  const incorrect = exercise.choices.filter((option) => option.id !== exercise.answer);
  assert.ok(incorrect.some((option) => /다시 발생해도 실패하지 않아야/.test(option.text)));
  assert.ok(incorrect.some((option) => /한 번 성공하면 삭제/.test(option.text)));
  assert.ok(exercise.choices.every((option) => exercise.choiceExplanations[option.id].length > 25));
});

test('Python weeks 16–18 explain the operations behind each example result', () => {
  const reasons = {
    16: [/생성자.*title/, /default_factory=list.*객체마다 새 목록/, /value.*frozen=True/, /같은 클래스.*비교/, /클래스 이름.*필드 값/],
    17: [/double\(3\).*assert/, /빈 목록.*else.*None/, /ValueError.*assertRaises/, /별도 딕셔너리.*False/, /빈 목록.*3/],
    18: [/actual.*UnicodeDecodeError/, /logging\.warning.*print/, /마지막 항목.*calculate/, /ValueError.*__cause__/, /None.*빈 문자열.*repr/],
  };
  for (const [week, patterns] of Object.entries(reasons)) {
    const lesson = getLesson(`py-week-${week}`);
    lesson.studyDays.forEach((day, index) => {
      const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
      assert.ok(trace, `${week}/${index + 1}`);
      assert.match(trace.explanation, patterns[index], trace.id);
      assert.doesNotMatch(trace.explanation, /값이 바뀌는 시점과 새 객체를 반환하는지 여부/, trace.id);
    });
  }
});

test('Python weeks 16–18 explain each incorrect concept choice specifically', () => {
  const cases = [
    ['py-w16-d1-choice', [['전역 변수', /인스턴스|필드/], ['인스턴스를 만들 수 없다', /생성자|Course\("Python"\)/]]],
    ['py-w16-d2-choice', [['자동 복사', /공유|복사|인스턴스/], ['불변 문자열에만', /목록|호출|가변/]]],
    ['py-w16-d3-choice', [['생성할 수 없다', /생성|초기화/], ['깊게 불변', /안쪽|가변|재대입/]]],
    ['py-w16-d4-choice', [['객체 주소', /필드|값|동일/], ['지원하지 않는다', /==|동등|eq/]]],
    ['py-w16-d5-choice', [['데이터베이스 연결', /저장|DB|영속/], ['어떤 검증도', /검증|생성|값/]]],
    ['py-w17-d1-choice', [['계속 실행한다', /AssertionError|실패|멈춥/], ['문자열로만 출력', /출력|예외|화면/]]],
    ['py-w17-d2-choice', [['평균적인 입력', /빈|첫 값|마지막|경계/], ['기대값이 필요 없다', /기대|계약|결과/]]],
    ['py-w17-d3-choice', [['except: pass', /예외|오류|숨기/], ['만들면 안 된다', /예외|실패|검사/]]],
    ['py-w17-d4-choice', [['전역 목록', /공유|상태|테스트마다/], ['함수 밖에서만', /setUp|함수|테스트마다/]]],
    ['py-w17-d5-choice-v2', [['실패하지 않아야', /다시|실패|기대/], ['한 번 성공하면 삭제', /남겨|삭제|회귀/]]],
    ['py-w18-d1-choice', [['결과만 적으면', /입력|환경|행동|실제/], ['고친 뒤에만', /수정 전|고치기 전|재현/]]],
    ['py-w18-d2-choice', [['반드시 같은 레벨', /WARNING|ERROR|경고|오류|심각도/], ['메시지 내용과 무관', /내용|심각도|레벨|상황/]]],
    ['py-w18-d3-choice', [['항상 그대로 공개', /공개|사용자|민감/], ['원인과 관계없다', /호출|경로|예외|스택/]]],
    ['py-w18-d4-choice', [['원래 예외를 지우기', /원인|__cause__|from error/], ['으로만 만든다', /raise|예외|반환/]]],
    ['py-w18-d5-choice', [['모듈을 전부 다시', /재작성|전체|다시 쓰/], ['확인 절차가 필요 없다', /테스트|검증|확인/]]],
  ];

  for (const [exerciseId, wrongChoices] of cases) {
    const exercise = getExercise(exerciseId);
    assert.ok(exercise, exerciseId);
    for (const [choiceText, feedbackPattern] of wrongChoices) {
      const option = exercise.choices.find((item) => item.text.includes(choiceText));
      assert.ok(option, `${exerciseId}: missing choice containing ${choiceText}`);
      const feedback = exercise.choiceExplanations[option.id];
      assert.match(feedback, feedbackPattern, `${exerciseId}: ${choiceText}`);
      assert.doesNotMatch(feedback, /필요한 입력·자료형·제어 흐름 중 하나를 놓칩니다/, exerciseId);
    }
    assert.doesNotMatch(exercise.hint, /값을 만들고, 바꾸고, 반환하거나 기다리는/ , exerciseId);
    assert.doesNotMatch(exercise.explanation, /문법 모양만 보고 판단하지 말고/, exerciseId);
  }

  const mutableDefault = getExercise('py-w16-d2-locate');
  assert.match(mutableDefault.explanation, /Python 3\.15.*클래스 정의.*ValueError/);
  assert.doesNotMatch(mutableDefault.explanation, /인스턴스 사이에 공유/);
});

test('Python weeks 19–21 keep performance and concurrency examples aligned with their explanations', () => {
  const sorting = getExercise('py-w19-d3-choice');
  assert.match(sorting.choiceExplanations[sorting.answer], /정렬된 새 목록/);
  assert.doesNotMatch(sorting.choiceExplanations[sorting.answer], /반복마다.*정렬/);

  const nestedLoop = getExercise('py-w19-d4-locate');
  assert.equal(nestedLoop.codeLines[0], 'values = [1, 2]');
  assert.deepEqual(nestedLoop.answerLines, [3]);
  assert.match(nestedLoop.explanation, /3번 줄.*n×n/);

  const mockedTimeout = getExercise('py-w20-d2-trace-v2');
  assert.match(mockedTimeout.prompt, /네트워크에 연결하지 않고 timeout 값 전달만 확인하는 모형/);
  assert.match(mockedTimeout.explanation, /실제 네트워크 통신은 일어나지 않습니다/);
  assert.match(mockedTimeout.prompt, /timeout=2/);

  const cancellation = getExercise('py-w21-d1-choice');
  assert.match(cancellation.choiceExplanations[cancellation.answer], /취소.*호출자/);
  const gatheredError = getExercise('py-w21-d2-choice');
  assert.match(gatheredError.choiceExplanations[gatheredError.answer], /예외 객체/);
  const lockedCounter = getExercise('py-w21-d5-choice');
  assert.match(lockedCounter.choiceExplanations[lockedCounter.answer], /Lock 구역/);
});

test('advanced Python days use their own example and output expectation', () => {
  const checks = [
    ['py-week-13', 'py-w13-d1-trace', /strip\(\)/, "['python', 'java']"],
    ['py-week-13', 'py-w13-d3-trace', /re\.search/, 'True'],
    ['py-week-14', 'py-w14-d4-trace', /json\.loads/, 'True'],
    ['py-week-16', 'py-w16-d2-trace', /default_factory/, "['Python'] []"],
    ['py-week-19', 'py-w19-d4-trace-v2', /for right in/, '4'],
    ['py-week-19', 'py-w19-d5-trace-v2', /timeit\.timeit/, 'float'],
    ['py-week-20', 'py-w20-d2-trace-v2', /timeout=2/, '2'],
    ['py-week-20', 'py-w20-d5-trace-v2', /public_error/, '잠시 후 다시 시도해 주세요.'],
    ['py-week-21', 'py-w21-d1-trace-v2', /task\.cancel\(\)/, 'cleanup,cancelled'],
    ['py-week-21', 'py-w21-d2-trace-v2', /asyncio\.gather/, 'ValueError'],
    ['py-week-22', 'py-w22-d1-trace-v2', /parse_args/, 'notes.json'],
    ['py-week-22', 'py-w22-d2-trace-v2', /redirect_stderr/, 'stdout=record, stderr=invalid input'],
    ['py-week-22', 'py-w22-d3-trace-v2', /SystemExit\(2\)/, '2'],
    ['py-week-22', 'py-w22-d5-trace-v2', /format_help/, 'help=True, exit=2, required=True'],
    ['py-week-23', 'py-w23-d1-trace-v2', /not isinstance\(minutes, bool\)/, 'True'],
    ['py-week-23', 'py-w23-d2-trace-v2', /os\.replace/, "[{'title': 'Python'}]"],
    ['py-week-23', 'py-w23-d5-trace-v2', /recovery_report/, 'recovery=success; count=2\nrecovery=failed; reason=OSError'],
    ['py-week-24', 'py-w24-d4-trace-v2', /result = "retry"/, 'retry'],
    ['py-week-24', 'py-w24-d5-trace-v2', /save_course/, 'saved'],
    ['py-week-23', 'py-w23-d4-trace-v2', /backup/, 'True'],
    ['py-week-24', 'py-w24-d2-trace', /dict\.fromkeys/, "['py', 'js']"],
    ['py-week-25', 'py-w25-d1-trace-v3', /steps = \["읽기", "검증", "적용"\]/, '읽기 -> 검증 -> 적용'],
    ['py-week-25', 'py-w25-d5-trace-v2', /backup_restore/, 'ready=False; failed=backup_restore'],
    ['py-week-26', 'py-w26-d3-trace-v2', /timeit\.timeit/, 'items=100; runs=100; result=float'],
    ['py-week-26', 'py-w26-d5-trace-v2', /next_weeks/, 'weeks=4; topics=4; criteria=True'],
  ];
  for (const [lessonId, exerciseId, pattern, answer] of checks) {
    const lesson = getLesson(lessonId);
    const exercise = getExercise(exerciseId);
    assert.match(lesson.studyDays[exercise.studyDay - 1].example, pattern, lessonId);
    assert.deepEqual(exercise.acceptedAnswers, [answer], exerciseId);
  }
  const week13 = getLesson('py-week-13').studyDays.map((day) => day.example);
  assert.equal(new Set(week13).size, 5, 'string lessons must not reuse one strip/split example');

  const requirementsDay = getLesson('py-week-25').studyDays[0];
  const requirementsRun = spawnSync('python', ['-c', requirementsDay.example], {
    encoding: 'utf8',
    timeout: 3000,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  assert.equal(requirementsRun.status, 0, requirementsRun.stderr);
  assert.equal(requirementsRun.stdout.trimEnd(), '읽기 -> 검증 -> 적용');
});

test('Python weeks seventeen through nineteen examples run and match their answers', () => {
  for (const weekNumber of [17, 18, 19]) {
    const lesson = getLesson(`py-week-${weekNumber}`);
    assert.ok(lesson, `week ${weekNumber}`);

    for (const day of lesson.studyDays) {
      const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
      assert.ok(trace, `week ${weekNumber} day ${day.number} trace`);

      const result = spawnSync('python', ['-c', day.example], { encoding: 'utf8', timeout: 3000 });
      assert.equal(result.error, undefined, result.error?.message ?? `week ${weekNumber} day ${day.number}`);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout.trimEnd(), trace.acceptedAnswers[0], `week ${weekNumber} day ${day.number}`);
    }
  }
});

test('Python default_factory example demonstrates independent instance lists and keeps prior progress', () => {
  const day = getLesson('py-week-16').studyDays[1];
  const trace = getExercise('py-w16-d2-trace-v2');

  assert.equal(trace.id, 'py-w16-d2-trace-v3');
  assert.ok(trace.legacyIds.includes('py-w16-d2-trace'));
  assert.ok(trace.legacyIds.includes('py-w16-d2-trace-v2'));
  assert.ok(trace.prompt.endsWith(day.example));
  assert.deepEqual(trace.acceptedAnswers, ["['Python'] []"]);

  const result = spawnSync('python', ['-c', day.example], { encoding: 'utf8', timeout: 3000 });
  assert.equal(result.error, undefined, result.error?.message ?? '');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trimEnd(), "['Python'] []");
});

test('Python weeks 13 through 26 use daily concept and error-location cases', () => {
  const expectedExampleTerms = {
    13: ['strip', 'f"Hi', 're.search', 'group(2)', 'slug.split'],
    14: ['date(', 'tzinfo', 'isoformat', 'json.loads', 'json.dumps'],
    15: ['Path("data")', 'exists()', 'mkdir', 'getenv', 'read_limit'],
    16: ['@dataclass', 'default_factory', 'frozen=True', '==', 'CourseId'],
    17: ['double', 'first', 'ValueError', 'make_record', 'total'],
    18: ['report', 'logging.warning', 'ZeroDivisionError', 'ValueError', 'normalize'],
    19: ['seen = set()', 'minutes.get', 'sorted', 'for right in', 'timeit.timeit'],
    20: ['status', 'timeout=2', 'json.loads', 'payload', 'public_error'],
    21: ['CancelledError', 'asyncio.gather', 'ThreadPoolExecutor', 'ProcessPoolExecutor', 'with lock'],
    22: ['argparse', 'redirect_stderr', 'SystemExit(2)', 'show_summary', 'format_help'],
    23: ['isinstance', 'TemporaryDirectory', 'minutes', 'backup.get', 'recovery_report'],
    24: ['format_title', 'dict.fromkeys', 'writer', 'result = "retry"', 'save_course'],
    25: ['requirements', 'minutes', 'load_backup', 'valid_backup', 'backup_restore'],
    26: ['required', 'total_minutes', 'timeit.timeit', 'format_help', 'next_weeks'],
  };
  for (const [weekText, terms] of Object.entries(expectedExampleTerms)) {
    const week = Number(weekText);
    const lesson = getLesson(`py-week-${String(week).padStart(2, '0')}`);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (const [index, term] of terms.entries()) {
      const day = index + 1;
      const base = `py-w${String(week).padStart(2, '0')}-d${day}`;
      const choice = getExercise(`${base}-choice${((week === 17 && day === 5) || (week === 25 && day === 5) || week === 26) ? '-v2' : ''}`);
      assert.match(lesson.studyDays[index].example, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${base} example`);
      if (week < 13) assert.match(choice.choiceExplanations[choice.answer], /실제 동작과 맞아/, choice.id);
      else assert.doesNotMatch(choice.choiceExplanations[choice.answer], /실제 동작과 맞아/, choice.id);
      if (day < 5) {
        const locate = getExercise(`${base}-locate`);
        assert.equal(locate.answerLines.length, 1, locate.id);
        assert.ok(locate.codeLines[locate.answerLines[0] - 1].trim(), locate.id);
        assert.match(locate.explanation, new RegExp(`${locate.answerLines[0]}번 줄`), locate.id);
      } else {
        const repair = getExercise(`${base}-repair${week >= 13 && week <= 26 ? '-v2' : ''}`);
        assert.ok(repair.solutionPatterns.length > 0, repair.id);
      }
    }
  }
});

test('Python week 18 distinguishes warning logs from printed standard output', () => {
  const exercise = getExercise('py-w18-d2-trace');
  assert.match(exercise.prompt, /표준 출력에서 `print`가 표시하는 값만/);
  assert.match(exercise.prompt, /표준 오류에 따로 기록/);
  assert.deepEqual(exercise.acceptedAnswers, ['warning']);
});

test('Python weeks twenty-five and twenty-six give specific capstone guidance and scoped repair contracts', () => {
  const expectedNotes = [
    [25, 1, /작업으로 나누고/, /읽기→검증→적용/],
    [25, 2, /bool이 int의 하위형/, /bool을 별도로 제외/],
    [25, 3, /복구 실패를 빈 성공 결과와 구분/, /실제 파일을 읽지 않습니다/],
    [25, 4, /버전 불일치·bool 버전·필수 키 누락/, /4\/4 통과/],
    [25, 5, /각 검사 이름과 실패 상태/, /backup_restore가 실패/],
    [26, 1, /각 필수 기준의 결과/, /모든 검사가 True/],
    [26, 2, /빈 목록과 필수 키 누락/, /빈 목록 0/],
    [26, 3, /timeit 측정 결과는 환경에 따라/, /초 값은 출력하지 않습니다/],
    [26, 4, /실제 등록한 옵션/, /ArgumentParser가 --backup/],
    [26, 5, /관찰 가능한 성공 기준/, /next_action과 success/],
  ];
  for (const [week, day, objective, intro] of expectedNotes) {
    const lesson = getLesson(`py-week-${week}`);
    const studyDay = lesson.studyDays[day - 1];
    assert.match(studyDay.objective, objective, `${lesson.id} D${day} objective`);
    assert.match(studyDay.intro, intro, `${lesson.id} D${day} explanation`);
  }

  const choiceFeedback = [
    ['py-w25-d1-choice', '단계의 순서는', /순서가 바뀌면.*순서는 중요/],
    ['py-w25-d2-choice', '자료형은 화면 표시', /계산·저장·검증/],
    ['py-w25-d2-choice', '검증 없이 문자열', /숫자 필드.*계약/],
    ['py-w25-d4-choice', '유효한 백업 하나', /잘못된 버전.*누락 필드/],
    ['py-w25-d4-choice', '기대 결과를 기록', /기대 결과를 기록/],
    ['py-w25-d5-choice-v2', '실패한 점검 이름', /어떤 점검을 고칠지/],
    ['py-w26-d1-choice-v2', '필수 목록 밖', /목록 밖의 실패/],
    ['py-w26-d2-choice-v2', '빈 목록의 합은 1', /sum\(\[\]\).*0/],
    ['py-w26-d3-choice-v2', '입력 항목 수와 관계없이', /입력 크기에 따라/],
    ['py-w26-d4-choice-v2', '등록한 --backup 옵션을 도움말에 넣지 않는다', /--backup.*PATH/],
    ['py-w26-d4-choice-v2', '오류를 낸 뒤에만', /오류를 내기 전/],
    ['py-w26-d5-choice-v2', '다음 행동과 성공 조건 없이도', /다음 행동과 성공 조건/],
  ];
  for (const [exerciseId, text, pattern] of choiceFeedback) {
    const exercise = getExercise(exerciseId);
    const option = exercise.choices.find((choice) => choice.text.includes(text));
    assert.ok(option, `${exerciseId}: missing choice containing ${text}`);
    assert.match(exercise.choiceExplanations[option.id], pattern, `${exerciseId}: ${text}`);
  }

  const requirementsLocate = getExercise('py-w25-d1-locate');
  assert.deepEqual(requirementsLocate.answerLines, [1], requirementsLocate.id);
  assert.match(requirementsLocate.explanation, /읽기, 검증, 적용/, requirementsLocate.id);
  const requirementsTrace = getExercise('py-w25-d1-trace-v3');
  assert.equal(requirementsTrace.id, 'py-w25-d1-trace-v4');
  assert.deepEqual(requirementsTrace.acceptedAnswers, ['읽기 -> 검증 -> 적용']);

  const backupValidation = getExercise('py-w25-d4-trace-v2');
  assert.match(backupValidation.prompt, /not isinstance\(version, bool\)/, backupValidation.id);
  assert.deepEqual(backupValidation.acceptedAnswers, ['4/4 scenarios passed'], backupValidation.id);
  const releaseChoice = getExercise('py-w25-d5-choice-v2');
  assert.match(releaseChoice.choices.find((choice) => choice.id === releaseChoice.answer).text, /검사가 모두 통과/);
  assert.match(releaseChoice.explanation, /backup_restore/);
  assert.doesNotMatch(releaseChoice.choices.map((choice) => choice.text).join(' '), /디버그 설정/);
  assert.match(getExercise('py-w26-d1-trace-v2').explanation, /backup은 False/);
  const nextPlanExample = getLesson('py-week-26').studyDays[4].example;
  assert.match(nextPlanExample, /next_action.*success/);
  assert.match(nextPlanExample, /"topic": "저장 형식"/);
  assert.match(nextPlanExample, /"success": "실패한 검사 모두 보고"/);
  assert.doesNotMatch(nextPlanExample, /"(schema|recovery|regression|release)"/);
  assert.equal(getLesson('py-week-25').studyDays[4].title, '배포 전 점검');

  const repairs = [
    [
      'py-w25-d5-repair-v2',
      'def release_report(checks):\n    if not checks:\n        return {"ready": False, "failed": ["no_checks"]}\n    failed = [name for name, passed in checks.items() if not passed]\n    return {"ready": not failed, "failed": failed}',
      'def release_report(checks):\n    return {"ready": True, "failed": []}',
      /no_checks/,
    ],
    [
      'py-w26-d5-repair-v2',
      'def review_plan(weak_topics):\n    return [{"topic": topic, "next_action": f"Review one {topic} example", "success": f"Solve a new {topic} case"} for topic in weak_topics]',
      'def review_plan(weak_topics):\n    return [{"topic": topic, "next_action": "study more", "success": None} for topic in weak_topics]',
      /(observable|measurable) success/,
    ],
  ];
  for (const [exerciseId, accepted, rejected, criteria] of repairs) {
    const exercise = getExercise(exerciseId);
    assert.equal(gradeAnswer(exercise, accepted), true, `${exerciseId} accepts the specified structure`);
    assert.equal(gradeAnswer(exercise, rejected), false, `${exerciseId} rejects the weak starter`);
    assert.ok(exercise.acceptanceCriteria.tests.length >= 3, exerciseId);
    assert.match(exercise.gradingNote, /실행형 채점이 아닙니다/);
    assert.match(exercise.acceptanceCriteria.tests.map((entry) => entry.expected).join(' '), criteria, exerciseId);
  }
});

test('Python weeks sixteen through eighteen align dataclasses, regression tests, and diagnosis repairs', () => {
  const cases = [
    [16, 'py-week-16', 5, 'CourseId(value=1)', 'py-w16-d5-trace', /frozen=True/],
    [17, 'py-week-17', 3, 'expected', 'py-w17-d3-trace-v2', /assertRaises\(ValueError\)/],
    [17, 'py-week-17', 4, 'False', 'py-w17-d4-trace', /second_test = make_record\(\)/],
    [17, 'py-week-17', 5, '3', 'py-w17-d5-trace', /assert total\(\[\]\) == 0/],
    [18, 'py-week-18', 1, 'UnicodeDecodeError', 'py-w18-d1-trace-v2', /expected.*actual/s],
    [18, 'py-week-18', 3, 'calculate', 'py-w18-d3-trace-v2', /traceback\.extract_tb/],
    [18, 'py-week-18', 4, 'ValueError', 'py-w18-d4-trace-v2', /raise ValueError.*from error/s],
    [18, 'py-week-18', 5, "''", 'py-w18-d5-trace-v2', /normalize\(None\)/],
  ];
  for (const [week, lessonId, dayNumber, expected, traceId, examplePattern] of cases) {
    const lesson = getLesson(lessonId);
    const day = lesson.studyDays[dayNumber - 1];
    const trace = day.exercises.find((exercise) => exercise.id === traceId || exercise.legacyIds?.includes(traceId));
    assert.ok(trace, traceId);
    assert.deepEqual(trace.acceptedAnswers, [expected], traceId);
    assert.ok(trace.prompt.endsWith(day.example), traceId);
    assert.match(day.example, examplePattern, traceId);
    assert.equal(day.exercises.length, 3, `${week} D${dayNumber}`);
  }

  const repairCases = [
    [
      'py-w16-d5-repair-v2',
      'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass CourseId:\n    value: int',
      'from dataclasses import dataclass\n@dataclass\nclass CourseId:\n    value: int',
    ],
    [
      'py-w17-d5-repair-v2',
      'def total(values):\n    return sum(values)\ndef test_total_empty():\n    assert total([]) == 0',
      'def total(values):\n    return sum(values)\ndef test_total_empty():\n    assert total([]) == 1',
    ],
    [
      'py-w18-d5-repair-v2',
      'def normalize(name):\n    if name is None:\n        return ""\n    return name.strip()',
      'def normalize(name):\n    return name.lower().strip()',
    ],
  ];
  for (const [exerciseId, accepted, rejected] of repairCases) {
    const exercise = getExercise(exerciseId);
    assert.ok(exercise, exerciseId);
    assert.equal(gradeAnswer(exercise, accepted), true, `${exerciseId} accepted structure`);
    assert.equal(gradeAnswer(exercise, rejected), false, `${exerciseId} rejected structure`);
    assert.ok(exercise.acceptanceCriteria.requirements.length > 0, exerciseId);
    assert.ok(exercise.acceptanceCriteria.tests.length > 1, exerciseId);
    assert.match(exercise.gradingNote, /실행형 채점이 아닙니다/);
  }
  assert.match(getExercise('py-w17-d5-repair-v2').prompt, /테스트의 잘못된 기대값/);
  assert.match(getExercise('py-w18-d5-repair-v2').prompt, /None 입력은 빈 문자열/);
});

test('Python repair titles name the actual correction without repeating the topic', () => {
  const titles = new Map([
    [16, 'CourseId 값 객체 정의 고치기'],
    [17, '빈 목록 합계 기대값 고치기'],
    [18, 'None 입력 처리 함수 고치기'],
    [19, '실행 시간 측정 함수 고치기'],
    [21, '공유 카운터 증가를 Lock으로 보호하기'],
    [23, '복구 실패 상태 보고 고치기'],
    [25, '출시 점검 결과 보고 고치기'],
    [26, '다음 4주 복습 계획 고치기'],
  ]);

  for (const [weekNumber, expectedTitle] of titles) {
    const lesson = getLesson(`py-week-${weekNumber}`);
    const repair = lesson.studyDays[4].exercises.find((exercise) => exercise.type === 'repair-code');
    assert.ok(repair, `week ${weekNumber} Friday repair`);
    assert.equal(repair.title, expectedTitle, `week ${weekNumber}`);
  }
});

test('Python async cancellation and gathered exceptions use valid, precise examples', () => {
  const cancellation = getExercise('py-w21-d1-locate');
  assert.ok(cancellation.codeLines.includes('    try:'), cancellation.id);
  assert.ok(cancellation.codeLines.includes('    except BaseException:'), cancellation.id);
  assert.deepEqual(cancellation.answerLines, [5], cancellation.id);
  assert.match(cancellation.explanation, /CancelledError/, cancellation.id);
  assert.match(cancellation.prompt, /^Python 21주차 1일 · 코루틴 취소: 요구사항과 맞지 않는 줄을 고르세요\./, cancellation.id);

  const gathered = getExercise('py-w21-d2-locate');
  assert.match(gathered.codeLines.join('\n'), /return_exceptions=True/, gathered.id);
  assert.deepEqual(gathered.answerLines, [2], gathered.id);
  assert.match(gathered.explanation, /예외 객체/, gathered.id);

  const standardError = getExercise('py-w22-d2-locate');
  assert.deepEqual(standardError.codeLines, ['import sys', 'print("invalid input")'], standardError.id);
  assert.deepEqual(standardError.answerLines, [2], standardError.id);
  assert.match(standardError.explanation, /sys\.stderr/, standardError.id);
});

test('Python weeks nineteen through twenty-one explain measured, network, and concurrent behavior precisely', () => {
  const expected = new Map([
    ['py-w19-d1-trace', /두 번째 py는 건너뛰어 두 값/],
    ['py-w19-d5-trace-v2', /float으로 반환/],
    ['py-w20-d2-trace-v2', /실제 네트워크 통신은 일어나지 않습니다/],
    ['py-w20-d4-trace', /빈 목록은 list/],
    ['py-w21-d1-trace-v2', /예외를 다시 올려/],
    ['py-w21-d2-trace-v2', /ValueError 객체/],
    ['py-w21-d3-trace-v2', /map이 원래 입력 순서를 보존/],
    ['py-w21-d4-trace-v2', /\[4, 9\]/],
    ['py-w21-d5-trace-v2', /counter는 400/],
  ]);
  for (const [exerciseId, pattern] of expected) {
    const exercise = getExercise(exerciseId);
    assert.ok(exercise, exerciseId);
    assert.match(exercise.explanation, pattern, exerciseId);
    assert.doesNotMatch(exercise.explanation, /값이 바뀌는 시점과 새 객체를 반환하는지 여부/, exerciseId);
  }
  assert.match(getExercise('py-w21-d4-trace-v2').prompt, /__main__ 가드/);

  for (const week of [19, 20, 21]) {
    const lesson = getLesson(`py-week-${week}`);
    for (const day of lesson.studyDays) {
      const [choice] = day.exercises;
      assert.doesNotMatch(choice.explanation, /문법 모양만 보고 판단하지 말고/, choice.id);
      assert.ok(Object.values(choice.choiceExplanations).every((item) => item.trim().length > 20), choice.id);
    }
  }

  const repairs = [
    ['py-w19-d5-repair-v2', 'import timeit\ndef benchmark_contains(values, target):\n    return timeit.timeit(lambda: target in values, number=100)', 'def benchmark_contains(values, target):\n    return target in values'],
    ['py-w20-d5-repair-v2', 'def public_error(status, detail):\n    if status == 400:\n        message = "입력값을 확인해 주세요."\n    elif status >= 500:\n        message = "잠시 후 다시 시도해 주세요."\n    else:\n        message = "요청을 처리할 수 없습니다."\n    return {"status": status, "message": message}', 'def public_error(status, detail):\n    return {"status": status, "message": detail}'],
    ['py-w21-d5-repair-v2', 'from concurrent.futures import ThreadPoolExecutor\nfrom threading import Lock\ncounter = 0\nlock = Lock()\ndef increment_many(_):\n    global counter\n    for _ in range(100):\n        with lock:\n            counter += 1\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    list(pool.map(increment_many, range(4)))', 'from concurrent.futures import ThreadPoolExecutor\nfrom threading import Lock\ncounter = 0\nlock = Lock()\ndef increment_many(_):\n    global counter\n    for _ in range(100):\n        counter += 1\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    list(pool.map(increment_many, range(4)))'],
  ];
  for (const [exerciseId, accepted, rejected] of repairs) {
    const exercise = getExercise(exerciseId);
    assert.equal(gradeAnswer(exercise, accepted), true, `${exerciseId} accepts the repair`);
    assert.equal(gradeAnswer(exercise, rejected), false, `${exerciseId} rejects the original bug`);
    assert.match(exercise.gradingNote, /실행형 채점이 아닙니다/);
  }
});

test('Python weeks twenty-two through twenty-four use real CLI, safe recovery, and validation-first examples', () => {
  const explanations = [
    ['py-w22-d3-trace-v2', /출력 없이 SystemExit\(2\)/],
    ['py-w22-d5-trace-v2', /stderr 진단/],
    ['py-w23-d1-trace-v2', /bool이 아닌 정수/],
    ['py-w23-d2-trace-v2', /임시 파일에 저장한 JSON/],
    ['py-w23-d4-trace-v2', /bool이 아닌 정수 1/],
    ['py-w23-d5-trace-v2', /실패와 오류 종류/],
    ['py-w24-d2-trace', /입력 순서의 첫 py, js 키/],
    ['py-w24-d3-trace', /파일 저장은 일어나지 않습니다/],
    ['py-w24-d4-trace-v2', /두 if 본문이 모두 실행/],
    ['py-w24-d5-trace-v2', /검증을 통과하고 writer가 호출/],
  ];
  for (const [exerciseId, pattern] of explanations) {
    assert.match(getExercise(exerciseId).explanation, pattern, exerciseId);
  }
  assert.match(getExercise('py-w22-d3-trace-v2').prompt, /프로세스 종료 코드를 입력/);
  assert.match(getExercise('py-w22-d5-trace-v2').prompt, /help_available/);
  assert.match(getExercise('py-w23-d4-trace-v2').prompt, /not isinstance\(version, bool\)/);
  assert.match(getExercise('py-w24-d5-trace-v2').prompt, /not isinstance\(title, str\) or not title\.strip\(\)/);
  assert.match(getLesson('py-week-22').studyDays[1].objective, /stdout.*stderr/);

  for (const week of [22, 23, 24]) {
    const lesson = getLesson(`py-week-${week}`);
    for (const day of lesson.studyDays) {
      const choice = day.exercises[0];
      assert.doesNotMatch(choice.explanation, /문법 모양만 보고 판단하지 말고/, choice.id);
      assert.ok(Object.values(choice.choiceExplanations).every((text) => text.trim().length > 20), choice.id);
    }
  }

  const repairs = [
    ['py-w22-d5-repair-v2', 'import argparse\ndef parse_file_option(parser, argv):\n    parser.add_argument("--file", required=True, help="읽을 JSON 파일")\n    return parser.parse_args(argv)', 'import argparse\ndef parse_file_option(parser, argv):\n    return parser.parse_args(argv)'],
    ['py-w23-d5-repair-v2', 'def recovery_report(records, error):\n    if error is not None:\n        return {"ok": False, "error": type(error).__name__}\n    return {"ok": True, "recovered": len(records)}', 'def recovery_report(records, error):\n    return {"ok": True, "recovered": len(records)}'],
    ['py-w24-d5-repair-v2', 'def save_course(record, writer):\n    title = record.get("title")\n    if not isinstance(title, str) or not title.strip():\n        return "invalid"\n    return writer(record)', 'def save_course(record, writer):\n    result = writer(record)\n    if not record.get("title"):\n        return "invalid"\n    return result'],
  ];
  for (const [exerciseId, accepted, rejected] of repairs) {
    const exercise = getExercise(exerciseId);
    assert.equal(gradeAnswer(exercise, accepted), true, `${exerciseId} accepts the repair`);
    assert.equal(gradeAnswer(exercise, rejected), false, `${exerciseId} rejects the original bug`);
    assert.match(exercise.gradingNote, /실행형 채점이 아닙니다/);
  }
});

test('Spring generated sessions no longer relabel a weekday fixture as another concept', () => {
  const checks = [
    ['spring-week-13', 'spring-w13-d1-short-v2', '타입 안전 설정', '@ConfigurationProperties', 'spring-w13-d1-locate-v2', /타입 안전 설정/],
    ['spring-week-19', 'spring-w19-d1-short-v2', 'JWT 검증', 'JwtDecoder', 'spring-w19-d1-locate-v2', /Base64URL.*서명과 토큰 조건/],
    ['spring-week-23', 'spring-w23-d1-short-v2', 'Dockerfile', 'JSON exec form', 'spring-w23-d1-locate-v2', /Dockerfile/],
  ];
  for (const [lessonId, exerciseId, concept, expectedAnswer, locateId, promptPattern] of checks) {
    const lesson = getLesson(lessonId);
    const exercise = getExercise(exerciseId);
    const locate = getExercise(locateId);
    const locateMarker = concept === 'JWT 검증' ? 'decodeBase64Payload' : concept === 'Dockerfile' ? 'ENTRYPOINT java -jar' : concept;
    assert.equal(exercise.acceptedAnswers[0], expectedAnswer, exerciseId);
    if (promptPattern) assert.match(exercise.prompt, promptPattern, exerciseId);
    assert.ok(locate.codeLines.join('\n').includes(locateMarker), locate.id);
    assert.equal(locate.answerLines.length, 1, locate.id);
    assert.ok(lesson.studyDays.some((day) => day.exercises.some((item) => item.id === exerciseId || item.legacyIds?.includes(exerciseId))), lessonId);
  }
});
