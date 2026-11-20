import assert from 'node:assert/strict';
import test from 'node:test';
import { tracks } from '../src/content.js';

const python = tracks.find((track) => track.id === 'python');

test('Python week sixteen names the dataclass concept practiced on each day', () => {
  const week16 = python.lessons.find((lesson) => lesson.week === 16);
  const objectives = [
    /@dataclass.*필드.*생성자/,
    /default_factory.*인스턴스마다.*새 목록/,
    /frozen.*다시.*대입/,
    /==.*필드 값/,
    /값 객체.*의미/,
  ];
  const intros = [
    /자동.*생성자/,
    /가변 목록.*공유/,
    /재대입.*FrozenInstanceError/,
    /값 비교.*객체 동일성/,
    /CourseId.*검사/,
  ];

  assert.ok(week16);
  for (const [index, day] of week16.studyDays.entries()) {
    assert.match(day.objective, objectives[index], `day ${day.number} objective`);
    assert.match(day.intro, intros[index], `day ${day.number} intro`);
    assert.doesNotMatch(day.intro, /은\(는\)|한 가지 결정을 분명하게 만드는 도구/);
  }

  const factoryDay = week16.studyDays[1];
  assert.match(factoryDay.example, /first\.tags\.append\("Python"\)/);
  assert.match(factoryDay.example, /second = Course\(\)/);
});

test('Python weeks seventeen and eighteen explain each testing and diagnosis task', () => {
  const expectations = new Map([
    [17, {
      objectives: [
        /assert.*AssertionError/,
        /빈 목록.*경계 입력/,
        /assertRaises.*ValueError/,
        /테스트용 데이터/,
        /회귀 테스트/,
      ],
      intros: [
        /최적화 옵션.*-O.*제거/,
        /None/,
        /ValueError/,
        /pytest.*@pytest\.fixture/,
        /돌아왔는지/,
      ],
    }],
    [18, {
      objectives: [
        /재현 기록/,
        /로그 수준/,
        /traceback의 프레임/,
        /raise.*from error/,
        /필요한 입력 경계/,
      ],
      intros: [
        /같은 입력으로.*다시 확인/,
        /stderr/,
        /호출 목록의 함수 이름/,
        /__cause__.*원래 오류/,
        /대소문자/,
      ],
    }],
  ]);

  for (const [weekNumber, { objectives, intros }] of expectations) {
    const week = python.lessons.find((lesson) => lesson.week === weekNumber);
    assert.ok(week, `week ${weekNumber}`);
    assert.equal(week.studyDays.length, 5, `week ${weekNumber} has five study days`);

    for (const [index, day] of week.studyDays.entries()) {
      assert.match(day.objective, objectives[index], `week ${weekNumber} day ${day.number} objective`);
      assert.match(day.intro, intros[index], `week ${weekNumber} day ${day.number} intro`);
      assert.doesNotMatch(day.intro, /은\(는\)|한 가지 결정을 분명하게 만드는 도구/);
    }
  }
});

test('Python weeks thirteen through twenty-six have distinct week introductions', () => {
  const topicChecks = new Map([
    [13, /문자열.*정규식/], [14, /시간대.*JSON/], [15, /pathlib.*환경/], [16, /데이터클래스.*불변/],
    [17, /정상.*경계.*예외/], [18, /로그.*호출 경로.*예외/], [19, /자료구조.*측정/], [20, /HTTP.*시간 제한.*JSON/],
    [21, /취소.*비동기.*스레드.*프로세스/], [22, /명령행.*종료 코드/], [23, /저장.*복구/], [24, /함수.*중복.*리뷰/],
    [25, /요구.*실패 조건/], [26, /완료 기준.*회귀.*다음 4주/],
  ]);
  const lessons = python.lessons.filter((lesson) => lesson.week >= 13 && lesson.week <= 26);
  const intros = lessons.map((lesson) => lesson.intro);

  assert.equal(lessons.length, 14);
  assert.equal(new Set(intros).size, 14, 'each advanced week needs its own introduction');
  for (const lesson of lessons) {
    assert.match(lesson.intro, topicChecks.get(lesson.week), `week ${lesson.week}`);
    assert.doesNotMatch(lesson.intro, /월요일부터 금요일까지|이 검수에서/);
  }

  const processPoolIntro = python.lessons.find((lesson) => lesson.week === 21).studyDays[3].intro;
  assert.match(processPoolIntro, /작은 작업.*비용.*결론 내리면 안/);
  assert.doesNotMatch(processPoolIntro, /검수|감사/);
});

test('Python weeks 16–26 use hints specific to each code-reading and debugging task', () => {
  const lessons = python.lessons.filter((lesson) => lesson.week >= 16 && lesson.week <= 26);
  const genericHints = new Set([
    '대입, 호출, 반환의 순서를 한 줄씩 표시하고 추측으로 답하지 마세요.',
    '값의 자료형, 반복 범위, 자원 수명 또는 외부 입력 경계 중 무엇이 깨지는지 살펴보세요.',
    '코드에서 값을 만들고, 바꾸고, 반환하거나 기다리는 지점을 표시해 보세요.',
  ]);

  assert.equal(lessons.length, 11);
  lessons.forEach((lesson) => {
    const traceHints = [];
    const locateHints = [];
    const choiceHints = [];

    lesson.studyDays.forEach((day) => {
      for (const exercise of day.exercises) {
        if (exercise.type === 'short-answer') traceHints.push(exercise.hint);
        if (exercise.type === 'locate-error') locateHints.push(exercise.hint);
        if (exercise.type === 'choice' && lesson.week >= 19) choiceHints.push(exercise.hint);
      }
    });

    assert.equal(traceHints.length, 5, `week ${lesson.week} trace hints`);
    assert.equal(locateHints.length, 4, `week ${lesson.week} locate hints`);
    assert.equal(new Set(traceHints).size, 5, `week ${lesson.week} trace hints should fit each example`);
    assert.equal(new Set(locateHints).size, 4, `week ${lesson.week} locate hints should fit each bug`);
    traceHints.forEach((hint) => assert.ok(hint && !genericHints.has(hint), `week ${lesson.week}: ${hint}`));
    locateHints.forEach((hint) => assert.ok(hint && !genericHints.has(hint), `week ${lesson.week}: ${hint}`));

    if (lesson.week >= 19) {
      assert.equal(choiceHints.length, 5, `week ${lesson.week} choice hints`);
      assert.equal(new Set(choiceHints).size, 5, `week ${lesson.week} choice hints should fit each topic`);
      choiceHints.forEach((hint) => assert.ok(hint && !genericHints.has(hint), `week ${lesson.week}: ${hint}`));
    }
  });
});

test('Python logging and exception-chain diagnostics give executable, unambiguous corrections', () => {
  const week18 = python.lessons.find((lesson) => lesson.week === 18);
  const loggingCase = week18.studyDays[1].exercises.find((exercise) => exercise.type === 'locate-error');
  const chainingCase = week18.studyDays[3].exercises.find((exercise) => exercise.type === 'locate-error');

  assert.equal(loggingCase.codeLines[loggingCase.answerLines[0] - 1], 'logging.debug("write failed: disk is full")');
  assert.match(loggingCase.explanation, /저장 작업이 실제 실패.*error 수준/);

  assert.equal(chainingCase.codeLines[2], 'except ValueError as error:');
  assert.match(chainingCase.explanation, /from error/);
  assert.equal(chainingCase.answerLines[0], 4);
});
