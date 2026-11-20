import assert from 'node:assert/strict';
import test from 'node:test';
import { tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';
import { csharpReviewedOpeningWeeks } from '../src/curriculum-csharp-w1-w3-reviewed.js';
import { csharpReviewedMiddleWeeks } from '../src/curriculum-csharp-w4-w6-reviewed.js';
import { csharpReviewedCollectionWeeks } from '../src/curriculum-csharp-w7-w9-reviewed.js';
import { csharpReviewedDesignWeeks } from '../src/curriculum-csharp-w10-w12-reviewed.js';
import { csharpReviewedBehaviorWeeks } from '../src/curriculum-csharp-w13-w18-reviewed.js';
import { csharpReviewedOperationsWeeks } from '../src/curriculum-csharp-w19-w21-reviewed.js';
import { csharpReviewedWebApiWeeks } from '../src/curriculum-csharp-w22-w24-reviewed.js';
import { csharpReviewedDataSecurityWeeks } from '../src/curriculum-csharp-w25-w27-reviewed.js';
import { csharpReviewedConcurrencyOperationsWeeks } from '../src/curriculum-csharp-w28-w30-reviewed.js';
import { csharpReviewedCapstoneWeeks } from '../src/curriculum-csharp-w31-w33-reviewed.js';
import { csharpReviewedFinalCapstoneWeeks } from '../src/curriculum-csharp-w34-w35-reviewed.js';

const track = tracks.find((item) => item.id === 'csharp');

test('decimal mathematical value accepts equivalent decimal forms', () => {
  const exercise = track.lessons[2].studyDays[4].exercises[1];
  for (const answer of ['25', '25.0', '25.00', '25.000']) assert.equal(gradeAnswer(exercise, answer), true, answer);
  for (const answer of ['2500', '25.01', '12.50']) assert.equal(gradeAnswer(exercise, answer), false, answer);
});

test('C# opening rule questions use hints for their concept, not their trace exercise', () => {
  const exercises = new Map(track.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => [exercise.id, exercise])));
  for (const [week, days] of Object.entries(csharpReviewedOpeningWeeks)) {
    for (const [index, day] of days.entries()) {
      assert.ok(day.ruleHint, `week ${week}, day ${index + 1} needs a rule hint`);
      assert.notEqual(day.ruleHint, day.traceHint, `week ${week}, day ${index + 1} must not reuse its output hint`);
      assert.match(day.ruleHint, /역할|구분|확인|생각|살펴|규칙|범위|단위|평가|대상|도구|대입|타입|정수|복사|자료형|접미사|나눠/);
      const id = `csharp-w${String(week).padStart(2, '0')}-d${index + 1}`;
      assert.equal(exercises.get(`${id}-v2-rule`)?.hint, day.ruleHint, `week ${week}, day ${index + 1} must show its rule hint`);
    }
  }
});

test('all C# weekly rule prompts are connected to their displayed hint', () => {
  const reviewedWeeks = [
    csharpReviewedOpeningWeeks,
    csharpReviewedMiddleWeeks,
    csharpReviewedCollectionWeeks,
    csharpReviewedDesignWeeks,
    csharpReviewedBehaviorWeeks,
    csharpReviewedOperationsWeeks,
    csharpReviewedWebApiWeeks,
    csharpReviewedDataSecurityWeeks,
    csharpReviewedConcurrencyOperationsWeeks,
    csharpReviewedCapstoneWeeks,
    csharpReviewedFinalCapstoneWeeks,
  ];
  const exercises = new Map(track.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => [exercise.id, exercise])));
  let checked = 0;
  for (const weeks of reviewedWeeks) {
    for (const [week, days] of Object.entries(weeks)) {
      for (const [index, day] of days.entries()) {
        const id = `csharp-w${String(week).padStart(2, '0')}-d${index + 1}-v2-rule`;
        assert.ok(day.rulePrompt, `${id} needs a rule question`);
        assert.ok(day.ruleHint, `${id} needs a rule hint`);
        assert.equal(exercises.get(id)?.hint, day.ruleHint, `${id} must display its rule hint`);
        checked += 1;
      }
    }
  }
  assert.equal(checked, 175);
});

test('C# weeks 25–27 explain important English API concepts in Korean', () => {
  const weeks = csharpReviewedDataSecurityWeeks;
  const explanations = [
    [weeks[25][1].rule, /최종 연산/],
    [weeks[25][3].rule, /지연 로딩/],
    [weeks[25][4].rule, /트랜잭션.*한 번의 `SaveChanges`/],
    [weeks[26][2].traceExplanation, /제목 앞뒤 공백을 지우면/],
    [weeks[26][2].effectCorrect, /자료별 권한 검사 누락/],
    [weeks[27][0].rule, /기준값\(baseline\).*성능 프로파일/],
    [weeks[27][1].effectCorrect, /비공개 학습 기록/],
    [weeks[27][3].rule, /복사본 없이.*수명 제한/],
    [weeks[27][4].rule, /취소 신호.*협조해야/],
  ];
  for (const [copy, expected] of explanations) assert.match(copy, expected);
});

test('selected C# rule hints point to the rule concept rather than unrelated trace details', () => {
  const cases = [
    [csharpReviewedMiddleWeeks[5][1], 'csharp-w05-d2-v2-rule', /요소|인덱스/],
    [csharpReviewedCollectionWeeks[7][0], 'csharp-w07-d1-v2-rule', /항목 수|길이/],
    [csharpReviewedCollectionWeeks[7][1], 'csharp-w07-d2-v2-rule', /인덱스|순서|중복/],
    [csharpReviewedCollectionWeeks[9][4], 'csharp-w09-d5-v2-rule', /null|빈 값|길이|형식/],
    [csharpReviewedBehaviorWeeks[13][1], 'csharp-w13-d2-v2-rule', /제약|비교|정렬/],
    [csharpReviewedBehaviorWeeks[13][4], 'csharp-w13-d5-v2-rule', /가변 목록|타입 보장/],
    [csharpReviewedBehaviorWeeks[15][4], 'csharp-w15-d5-v2-rule', /응답|예외|진단/],
    [csharpReviewedBehaviorWeeks[18][0], 'csharp-w18-d1-v2-rule', /언어 버전|안정 런타임|프리릴리스/],
    [csharpReviewedBehaviorWeeks[18][1], 'csharp-w18-d2-v2-rule', /런타임 패치|SDK|C# 언어 버전/],
    [csharpReviewedBehaviorWeeks[18][3], 'csharp-w18-d4-v2-rule', /확장 멤버|원본 형식/],
    [csharpReviewedBehaviorWeeks[18][4], 'csharp-w18-d5-v2-rule', /LTS|RC|프리릴리스/],
    [csharpReviewedOperationsWeeks[19][0], 'csharp-w19-d1-v2-rule', /검사|DB|함수 계약/],
    [csharpReviewedOperationsWeeks[19][1], 'csharp-w19-d2-v2-rule', /경계|최솟값|최댓값/],
    [csharpReviewedOperationsWeeks[19][2], 'csharp-w19-d3-v2-rule', /결함|기대 동작/],
    [csharpReviewedOperationsWeeks[19][4], 'csharp-w19-d5-v2-rule', /메모리|DB|provider/],
    [csharpReviewedOperationsWeeks[20][1], 'csharp-w20-d2-v2-rule', /프로젝트|빌드 설정/],
    [csharpReviewedOperationsWeeks[20][2], 'csharp-w20-d3-v2-rule', /패키지|컴파일|테스트/],
    [csharpReviewedOperationsWeeks[20][3], 'csharp-w20-d4-v2-rule', /의존성|버전 그래프/],
    [csharpReviewedOperationsWeeks[21][4], 'csharp-w21-d5-v2-rule', /비밀값|로그/],
    [csharpReviewedWebApiWeeks[23][2], 'csharp-w23-d3-v2-rule', /경로 형식|route constraint/],
    [csharpReviewedWebApiWeeks[23][4], 'csharp-w23-d5-v2-rule', /역직렬화|요청/],
    [csharpReviewedDataSecurityWeeks[25][4], 'csharp-w25-d5-v2-rule', /SaveChanges|transaction 범위/],
    [csharpReviewedDataSecurityWeeks[27][0], 'csharp-w27-d1-v2-rule', /측정|병목|전후/],
    [csharpReviewedDataSecurityWeeks[27][3], 'csharp-w27-d4-v2-rule', /view|복사|수명/],
    [csharpReviewedConcurrencyOperationsWeeks[29][3], 'csharp-w29-d4-v2-rule', /자격 증명|이미지|실행/],
    [csharpReviewedConcurrencyOperationsWeeks[29][4], 'csharp-w29-d5-v2-rule', /구·신 버전|schema|데이터/],
    [csharpReviewedConcurrencyOperationsWeeks[30][1], 'csharp-w30-d2-v2-rule', /식별자|완료 상태|이동 규칙/],
    [csharpReviewedCapstoneWeeks[31][0], 'csharp-w31-d1-v2-rule', /요청된 동작|별도 변경|포맷/],
    [csharpReviewedCapstoneWeeks[31][4], 'csharp-w31-d5-v2-rule', /실제|검토|테스트|실행/],
    [csharpReviewedCapstoneWeeks[32][0], 'csharp-w32-d1-v2-rule', /중복 요청|권한|저장 실패/],
    [csharpReviewedCapstoneWeeks[33][1], 'csharp-w33-d2-v2-rule', /Task 완료|commit|저장/],
    [csharpReviewedCapstoneWeeks[33][2], 'csharp-w33-d3-v2-rule', /권한|중복|저장 오류/],
    [csharpReviewedCapstoneWeeks[33][3], 'csharp-w33-d4-v2-rule', /실제로 연결|실제 데이터베이스/],
    [csharpReviewedFinalCapstoneWeeks[34][0], 'csharp-w34-d1-v2-rule', /같은 작업.*같은 요청 키/],
    [csharpReviewedFinalCapstoneWeeks[34][1], 'csharp-w34-d2-v2-rule', /취소 신호/],
    [csharpReviewedFinalCapstoneWeeks[34][2], 'csharp-w34-d3-v2-rule', /처음 읽은 버전.*저장 직전/],
    [csharpReviewedFinalCapstoneWeeks[34][3], 'csharp-w34-d4-v2-rule', /현재 진도.*파일 형식/],
    [csharpReviewedFinalCapstoneWeeks[34][4], 'csharp-w34-d5-v2-rule', /로그|답안|인증/],
    [csharpReviewedFinalCapstoneWeeks[35][0], 'csharp-w35-d1-v2-rule', /요청 내용과 사용 권한|업무 규칙|자료 저장/],
    [csharpReviewedFinalCapstoneWeeks[35][1], 'csharp-w35-d2-v2-rule', /새 오류|기존 정상|권한/],
    [csharpReviewedFinalCapstoneWeeks[35][2], 'csharp-w35-d3-v2-rule', /점검표|실제/],
    [csharpReviewedFinalCapstoneWeeks[35][3], 'csharp-w35-d4-v2-rule', /학습 자료|서버|실제 DB/],
    [csharpReviewedFinalCapstoneWeeks[35][4], 'csharp-w35-d5-v2-rule', /공식 문서|SDK|빌드|테스트/],
    [csharpReviewedDesignWeeks[11][0], 'csharp-w11-d1-v2-rule', /생성 직후|불변식/],
    [csharpReviewedBehaviorWeeks[16][0], 'csharp-w16-d1-v2-rule', /자원 정리|commit/],
    [csharpReviewedBehaviorWeeks[16][4], 'csharp-w16-d5-v2-rule', /bufferSize|byte 수/],
    [csharpReviewedBehaviorWeeks[17][1], 'csharp-w17-d2-v2-rule', /대기 동안|제어/],
    [csharpReviewedBehaviorWeeks[17][4], 'csharp-w17-d5-v2-rule', /동기 호출|차단/],
    [csharpReviewedOperationsWeeks[20][4], 'csharp-w20-d5-v2-rule', /LTS|최신 patch/],
    [csharpReviewedOperationsWeeks[21][0], 'csharp-w21-d1-v2-rule', /Generic Host|웹 서버|DB/],
    [csharpReviewedWebApiWeeks[23][0], 'csharp-w23-d1-v2-rule', /MapGet|서버 시작/],
    [csharpReviewedWebApiWeeks[23][3], 'csharp-w23-d4-v2-rule', /DI에|DB 연결/],
    [csharpReviewedWebApiWeeks[24][1], 'csharp-w24-d2-v2-rule', /필드별 오류|내부 예외/],
    [csharpReviewedWebApiWeeks[24][3], 'csharp-w24-d4-v2-rule', /metadata|문서 생성|UI/],
    [csharpReviewedWebApiWeeks[24][4], 'csharp-w24-d5-v2-rule', /기존 client|null|계약 테스트/],
    [csharpReviewedConcurrencyOperationsWeeks[28][0], 'csharp-w28-d1-v2-rule', /취소 신호|WithCancellation/],
    [csharpReviewedConcurrencyOperationsWeeks[28][1], 'csharp-w28-d2-v2-rule', /같은 잠금|await/],
    [csharpReviewedConcurrencyOperationsWeeks[28][2], 'csharp-w28-d3-v2-rule', /만드는 함수.*여러 번/],
    [csharpReviewedConcurrencyOperationsWeeks[28][3], 'csharp-w28-d4-v2-rule', /호스트의 종료 신호|\.NET 10/],
    [csharpReviewedConcurrencyOperationsWeeks[28][4], 'csharp-w28-d5-v2-rule', /어떤 오류|중복 처리를 막을/],
    [csharpReviewedConcurrencyOperationsWeeks[30][0], 'csharp-w30-d1-v2-rule', /처음 상태|기대 결과/],
    [csharpReviewedConcurrencyOperationsWeeks[30][2], 'csharp-w30-d3-v2-rule', /업무 규칙|HTTP 응답/],
    [csharpReviewedConcurrencyOperationsWeeks[30][3], 'csharp-w30-d4-v2-rule', /메모리 기반|프로그램을 닫은 뒤/],
    [csharpReviewedConcurrencyOperationsWeeks[30][4], 'csharp-w30-d5-v2-rule', /저장 실패|다음 행동/],
    [csharpReviewedCapstoneWeeks[31][1], 'csharp-w31-d2-v2-rule', /응답 항목|앱|값이 없/],
    [csharpReviewedCapstoneWeeks[31][2], 'csharp-w31-d3-v2-rule', /값이 비어|기존 코드|저장 자료/],
    [csharpReviewedCapstoneWeeks[31][3], 'csharp-w31-d4-v2-rule', /실패|동시 변경|불변식/],
    [csharpReviewedCapstoneWeeks[33][0], 'csharp-w33-d1-v2-rule', /업무 규칙|응답/],
  ];
  const exercises = new Map(track.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => [exercise.id, exercise])));
  for (const [day, id, pattern] of cases) {
    assert.notEqual(day.ruleHint, day.traceHint, id);
    assert.match(day.ruleHint, pattern, id);
    assert.equal(exercises.get(id)?.hint, day.ruleHint, id);
  }
});

test('C# trace answers accept the exact output shown by their examples', () => {
  const exercises = new Map(track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises)).flatMap((exercise) => [[exercise.id, exercise], ...(exercise.legacyIds ?? []).map((id) => [id, exercise])]));
  for (const [id, output] of [
    ['csharp-w02-d3-v2-trace', '2/True'],
    ['csharp-w02-d5-v2-trace', '4/5;2'],
    ['csharp-w03-d4-v2-trace', '상태:완료/1'],
    ['csharp-w07-d1-v2-trace', '3/85'],
    ['csharp-w07-d2-v2-trace', '4/C#,API,LINQ,LINQ'],
    ['csharp-w08-d4-v2-trace', 'A/2\nB/1'],
    ['csharp-w10-d4-v2-trace', '7/반복문'],
    ['csharp-w10-d5-v2-trace', 'C#/1'],
    ['csharp-w11-d1-v2-trace', '2'],
    ['csharp-w11-d2-v2-trace', '1'],
    ['csharp-w11-d3-v2-trace', 'LINQ'],
    ['csharp-w11-d5-v2-trace', '70'],
    ['csharp-w12-d2-v2-trace', 'C#\n[C#]'],
    ['csharp-w14-d2-v2-trace', '4\nlog:완료'],
    ['csharp-w15-d2-v2-trace', 'handled\ncleanup'],
    ['csharp-w16-d1-v2-trace', 'work\ndisposed\nafter'],
    ['csharp-w16-d2-v2-trace', 'work\nasync-disposed\nafter'],
    ['csharp-w16-d4-v2-trace', 'invalid'],
    ['csharp-w17-d3-v2-trace', 'done\nobserved'],
  ]) {
    assert.equal(gradeAnswer(exercises.get(id), output), true, id);
  }
});

test('C# short answers accept Korean booleans and output lines separated by a newline', () => {
  const exercises = new Map(track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises)).flatMap((exercise) => [[exercise.id, exercise], ...(exercise.legacyIds ?? []).map((id) => [id, exercise])]));
  assert.equal(gradeAnswer(exercises.get('csharp-w02-d4-v2-trace'), '거짓'), true);
  assert.equal(gradeAnswer(exercises.get('csharp-w06-d4-v2-trace'), '안녕하세요, 민서\n반가워요, 민서; 생략한 prefix에는 기본값 사용'), true);
});

test('C# result traces check case-sensitive output while accepting recorded alternatives', () => {
  const traces = track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises.filter((exercise) => exercise.title === '예제 결과 추적')));
  const foldWhitespace = (value) => String(value).trim().replace(/\s+/g, ' ');
  const flipCase = (value) => [...value].map((character) => {
    if (character >= 'a' && character <= 'z') return character.toUpperCase();
    if (character >= 'A' && character <= 'Z') return character.toLowerCase();
    return character;
  }).join('');

  assert.equal(traces.length, 175);
  for (const exercise of traces) {
    assert.equal(exercise.answerNormalization, 'case-sensitive', exercise.id);
    assert.deepEqual(exercise.legacyIds, [exercise.id.replace('-v3-trace', '-v2-trace'), exercise.id.replace('-v3-trace', '-trace')]);
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const changed = flipCase(answer);
      if (changed !== answer && !exercise.acceptedAnswers.some((alternative) => foldWhitespace(alternative) === foldWhitespace(changed))) {
        assert.equal(gradeAnswer(exercise, changed), false, exercise.id);
      }
    }
  }
});

test('C# and .NET course progresses from syntax to service and release design across 35 weeks', () => {
  assert.ok(track);
  assert.equal(track.title, 'C# · .NET');
  assert.equal(track.contentReview.version, 'C# 14 · .NET 10.0.14 LTS · EF Core 10 LTS · 개념 학습');
  assert.equal(track.contentReview.reviewedAt, '2026-11-02');
  assert.equal(track.course.weeks, 35);
  assert.equal(track.course.sessions, 175);
  assert.equal(track.course.questions, 525);
  assert.equal(track.course.phases, 6);
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 35 }, (_, index) => index + 1));
  assert.deepEqual(track.topics.map((phase) => phase.stage), [1, 2, 3, 4, 5, 6]);
  assert.equal(track.practiceUnit, '개념 연습');
  assert.equal(track.practiceMode, '코드 읽기·설계 판단 525개');
  assert.match(track.contentReview.versionContext, /2026-11-02.*\.NET 10\.0\.14.*10\.0\.403.*C# 14\.0/);
  assert.doesNotMatch(track.contentReview.versionContext, /지원 정책 표는 10\.0\.13/);
  assert.match(track.contentReview.versionContext, /C# 컴파일, ASP\.NET 앱·데이터베이스 실행은 제공하지 않아요/);
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-versioning'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/api/system.boolean.tostring?view=net-10.0'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/switch-expression'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/iteration-statements'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/collections'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/api/system.argumentnullexception.throwifnull?view=net-10.0'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/using-properties'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/events-overview'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/exception-handling-statements'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/task-asynchronous-programming-model'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/cancel-an-async-task-or-a-list-of-tasks'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-14.0/extensions'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://dotnet.microsoft.com/en-us/download/dotnet'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://github.com/dotnet/core/blob/main/release-notes/11.0/preview/rc3/11.0.0-rc.3.md'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/core/extensions/generic-host'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/deserialization'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.14/10.0.14.md'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-october-2026-servicing-updates/'));

  const currentVersionWeek = track.lessons.find((lesson) => lesson.title.includes('C# 14와 .NET 10'));
  assert.ok(currentVersionWeek);
  const weekText = currentVersionWeek.exercises.map((exercise) => `${exercise.prompt} ${exercise.explanation}`).join(' ');
  assert.match(weekText, /C# 14/);
  assert.match(weekText, /\.NET 10\.0\.14/);
  assert.match(weekText, /10\.0\.403/);
  assert.match(weekText, /2026-10-13 자료에는 \.NET 10\.0\.13.*10월 25일 최신 릴리스에는 10\.0\.14/);
  assert.match(weekText, /rc\.3/);
  assert.match(weekText, /null 조건 대입/);

  for (const [index, week] of track.lessons.entries()) {
    assert.equal(week.week, index + 1);
    assert.equal(week.studyDays.length, 5);
    assert.equal(week.exercises.length, 15);
    assert.doesNotMatch(week.title, /^\d+주차 · /, week.id);
    assert.equal(week.intro, '', week.id);
    assert.deepEqual(week.points, [], week.id);
    assert.equal(week.prerequisiteLessonIds.length, index ? 1 : 0, week.id);
  }
});

test('C# lessons provide reviewed concept checks without promising runnable coding problems', () => {
  const exercises = track.lessons.flatMap((lesson) => lesson.exercises);
  assert.equal(exercises.length, 525);
  assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 525);
  assert.ok(exercises.every((exercise) => ['choice', 'short-answer'].includes(exercise.type)));

  const answerPositions = [];
  for (const lesson of track.lessons) {
    for (const day of lesson.studyDays) {
      assert.equal(day.exercises.length, 3);
      const [understanding, recall, consequence] = day.exercises;
      assert.equal(understanding.type, 'choice');
      assert.equal(recall.type, 'short-answer');
      assert.equal(consequence.type, 'choice');
      for (const exercise of [understanding, recall, consequence]) {
        assert.ok(exercise.prompt.length > 20, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 10, exercise.id);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true, exercise.id);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? '__wrong__' : '전혀 다른 답'), false, exercise.id);
      }
      for (const exercise of [understanding, consequence]) {
        const options = exercise.choices.map((option) => option.text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko'));
        assert.equal(new Set(options).size, options.length, exercise.id);
        assert.equal(Object.keys(exercise.choiceExplanations).length, exercise.choices.length, exercise.id);
        answerPositions.push(exercise.choices.findIndex((option) => option.id === exercise.answer));
      }
    }
  }
  assert.ok([0, 1, 2].every((position) => answerPositions.filter((item) => item === position).length >= 40));
});

test('C# weeks one through three connect complete code traces, language rules, and practical consequences', () => {
  const ids = new Set();
  const answerPositions = [];

  for (let weekNumber = 1; weekNumber <= 3; weekNumber++) {
    const reviews = csharpReviewedOpeningWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.traceHint.length > 10);
      assert.ok(review.traceExplanation.length > 40);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 15, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedOpeningWeeks[1][0].ruleExplanation, /프로그래밍 언어/);
  assert.match(csharpReviewedOpeningWeeks[1][3].ruleExplanation, /file-based/);
  assert.match(csharpReviewedOpeningWeeks[2][1].ruleExplanation, /정적 타입/);
  assert.match(csharpReviewedOpeningWeeks[2][4].traceExplanation, /같은 List 객체/);
  assert.match(csharpReviewedOpeningWeeks[3][0].ruleExplanation, /unchecked/);
  assert.match(csharpReviewedOpeningWeeks[3][1].effectExplanation, /overflow/);
  assert.match(csharpReviewedOpeningWeeks[3][2].ruleExplanation, /UTF-16/);
  assert.match(csharpReviewedOpeningWeeks[3][4].ruleExplanation, /decimal/);
});

test('C# opening trace questions accept equivalent answers without accepting unsupported execution claims', () => {
  const [fileExample, evidenceQuestion] = track.lessons[0].studyDays.slice(3).map((day) => day.exercises[1]);
  for (const answer of ['ready; 실행 여부는 알 수 없음', 'ready; 실제 실행 여부는 알 수 없음', 'ready; 실행 여부 확인 불가']) {
    assert.equal(gradeAnswer(fileExample, answer), true, answer);
  }
  assert.equal(gradeAnswer(fileExample, 'ready; 실행 성공'), false);
  for (const answer of ['없음', '없어요', '없습니다', '아니요']) {
    assert.equal(gradeAnswer(evidenceQuestion, answer), true, answer);
  }
  assert.equal(gradeAnswer(evidenceQuestion, '빌드 성공'), false);
});

test('C# weeks four through six teach branching, iteration, and method contracts through distinct scenarios', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['비교 결과', '논리 AND', 'if/else', 'switch 식', '패턴 가드'],
    ['for 경계', 'foreach', 'while 종료', 'break와 continue', '범위 안전'],
    ['매개변수와 반환형', 'void', '매개변수 전달', '선택 매개변수', '이름 있는 인자'],
  ];

  for (const [weekIndex, weekNumber] of [4, 5, 6].entries()) {
    const reviews = csharpReviewedMiddleWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 60);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedMiddleWeeks[5][1].rule, /읽기 전용/);
  assert.match(csharpReviewedMiddleWeeks[5][3].rule, /다음 회차/);
  assert.match(csharpReviewedMiddleWeeks[6][2].rule, /참조 값 자체를 복사/);
  assert.match(csharpReviewedMiddleWeeks[6][3].effectExplanation, /호환성/);
  assert.match(csharpReviewedMiddleWeeks[6][4].effectExplanation, /소스 호환성/);
});

test('C# weeks seven through nine teach collection choice, LINQ timing, and runtime null guards with traceable examples', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['배열 크기', 'List<T>', 'Dictionary<TKey,TValue>', 'HashSet<T>', 'Queue와 Stack'],
    ['Where 필터', 'Select 변환', 'OrderBy', 'GroupBy', '지연 실행'],
    ['nullable 참조', 'null 조건 연산자', 'null 병합', 'null 병합 대입', '널 검증 경계'],
  ];

  for (const [weekIndex, weekNumber] of [7, 8, 9].entries()) {
    const reviews = csharpReviewedCollectionWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedCollectionWeeks[7][2].rule, /TryAdd/);
  assert.match(csharpReviewedCollectionWeeks[7][3].rule, /삽입 순서/);
  assert.match(csharpReviewedCollectionWeeks[8][4].rule, /열거할 때/);
  assert.match(csharpReviewedCollectionWeeks[9][0].rule, /컴파일/);
  assert.match(csharpReviewedCollectionWeeks[9][4].rule, /runtime guard/);
});

test('C# weeks ten through twelve teach record semantics, encapsulation, and replaceable design contracts', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['record class', 'record struct', 'with 복사', 'DTO 분리', '불변 기본값'],
    ['생성자', '프로퍼티', '필드 백킹 프로퍼티', '접근 제한', '불변식'],
    ['인터페이스', '다형성', '상속', '구성', 'SOLID 첫 원칙'],
  ];

  for (const [weekIndex, weekNumber] of [10, 11, 12].entries()) {
    const reviews = csharpReviewedDesignWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedDesignWeeks[10][0].traceExplanation, /값 기반 동등성/);
  assert.match(csharpReviewedDesignWeeks[10][2].rule, /얕은 복사/);
  assert.match(csharpReviewedDesignWeeks[10][4].effectExplanation, /깊은 불변성/);
  assert.match(csharpReviewedDesignWeeks[11][2].rule, /C# 14/);
  assert.match(csharpReviewedDesignWeeks[11][4].effectExplanation, /불변식/);
  assert.match(csharpReviewedDesignWeeks[11][4].example, /if \(initial < 0\).*ArgumentOutOfRangeException/s);
  assert.match(csharpReviewedDesignWeeks[11][4].rule, /초기 잔액이 0 이상/);
  assert.match(csharpReviewedDesignWeeks[12][2].rule, /is-a 관계/);
  assert.match(csharpReviewedDesignWeeks[12][3].effectExplanation, /의존성 주입 컨테이너/);
  assert.match(csharpReviewedDesignWeeks[12][4].rule, /변경 이유/);
});

test('C# weeks thirteen through fifteen teach generic contracts, delegate lifetimes, and failure/resource boundaries', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['제네릭 메서드', 'where 제약', '제네릭 컬렉션', '공변성', '불변성 기본'],
    ['람다', 'Func와 Action', '클로저 캡처', '이벤트 구독', '구독 해제'],
    ['예외 전파', 'finally', '예외 vs 입력 결과', '예외 맥락 보존', '오류 노출'],
  ];

  for (const [weekIndex, weekNumber] of [13, 14, 15].entries()) {
    const reviews = csharpReviewedBehaviorWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedBehaviorWeeks[13][1].rule, /CompareTo/);
  assert.match(csharpReviewedBehaviorWeeks[13][3].rule, /out T/);
  assert.match(csharpReviewedBehaviorWeeks[14][2].effectExplanation, /동시성 정책/);
  assert.match(csharpReviewedBehaviorWeeks[14][4].traceExplanation, /한 등록/);
  assert.match(csharpReviewedBehaviorWeeks[15][0].traceExplanation, /일치/);
  assert.match(csharpReviewedBehaviorWeeks[15][2].rule, /예상되는 변환 실패/);
  assert.match(csharpReviewedBehaviorWeeks[15][3].rule, /InnerException/);
  assert.match(csharpReviewedBehaviorWeeks[15][4].effectExplanation, /정보 노출/);
});

test('C# weeks sixteen through eighteen connect resource boundaries, async flow, and current version status', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['IDisposable', '비동기 정리', '경로 입력', '직렬화 계약', '스트림 경계'],
    ['Task 결과', 'await 전파', 'async 반환형', '취소 토큰', '동기 차단 금지'],
    ['현재 안정 기준', '최신 패치 확인', 'null 조건 대입', '확장 멤버', '미리보기 경계'],
  ];

  for (const [weekIndex, weekNumber] of [16, 17, 18].entries()) {
    const reviews = csharpReviewedBehaviorWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedBehaviorWeeks[17][2].rule, /async void/);
  assert.match(csharpReviewedBehaviorWeeks[17][3].rule, /각 작업이 토큰을 확인/);
  assert.match(csharpReviewedBehaviorWeeks[17][4].effectExplanation, /교착/);
  assert.match(csharpReviewedBehaviorWeeks[18][1].rule, /언어 메이저 버전을 자동으로 바꾸지는/);
  assert.match(csharpReviewedBehaviorWeeks[18][2].traceExplanation, /호출되지 않아요/);
  assert.match(csharpReviewedBehaviorWeeks[18][3].rule, /원본 형식/);
  assert.match(csharpReviewedBehaviorWeeks[18][4].rule, /프리릴리스/);
});

test('C# weeks nineteen through twenty-one connect test evidence, reproducible projects, and host composition', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['단위 테스트', '경계 사례', '회귀 테스트', '테스트 대역', '통합 범위'],
    ['SDK와 런타임', '솔루션과 프로젝트', 'restore와 build', '패키지 고정', '패치 유지'],
    ['Generic Host', '의존성 등록', '수명 주기', '설정 우선순위', '비밀값 분리'],
  ];

  for (const [weekIndex, weekNumber] of [19, 20, 21].entries()) {
    const reviews = csharpReviewedOperationsWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedOperationsWeeks[20][0].rule, /SDK/);
  assert.match(csharpReviewedOperationsWeeks[20][3].rule, /packages\.lock\.json/);
  assert.match(csharpReviewedOperationsWeeks[21][0].rule, /서버·DB/);
  assert.match(csharpReviewedOperationsWeeks[21][2].rule, /Scoped/);
  assert.match(csharpReviewedOperationsWeeks[21][3].traceExplanation, /뒤에 등록/);
  assert.match(csharpReviewedOperationsWeeks[21][4].traceExplanation, /실제 credential 값은 예제에 없어요/);
});

test('C# weeks twenty-two through twenty-four connect observability, ASP.NET request flow, and HTTP contracts', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['구조화 로그', '로그 수준', '민감 정보', '메트릭과 추적', '오류 응답 분리'],
    ['Minimal API', '미들웨어 순서', '라우트 매개변수', '의존성 주입', '요청 본문'],
    ['HTTP 메서드 의미', '검증 응답', '404와 403', 'OpenAPI 계약', '버전 호환'],
  ];

  for (const [weekIndex, weekNumber] of [22, 23, 24].entries()) {
    const reviews = csharpReviewedWebApiWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.studyDays.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.studyDays[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedWebApiWeeks[22][0].example, /LogInformation\("Loaded \{Count\}/);
  assert.match(csharpReviewedWebApiWeeks[22][3].example, /new MeterListener/);
  assert.match(csharpReviewedWebApiWeeks[23][1].rule, /등록 순서/);
  assert.match(csharpReviewedWebApiWeeks[23][4].rule, /JSON body/);
  assert.match(csharpReviewedWebApiWeeks[24][0].rule, /멱등성/);
  assert.match(csharpReviewedWebApiWeeks[24][3].rule, /OpenAPI document/);
  assert.match(csharpReviewedWebApiWeeks[24][4].traceExplanation, /Summary는 null/);
  assert.match(csharpReviewedWebApiWeeks[22][4].rule, /RFC 9457/);
  for (const url of [
    'https://learn.microsoft.com/en-us/dotnet/core/extensions/logging/overview',
    'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel',
    'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0',
    'https://www.rfc-editor.org/rfc/rfc9457.html',
    'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0',
    'https://www.rfc-editor.org/rfc/rfc9110.html',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
});

test('C# weeks twenty-five through twenty-seven connect EF Core, resource security, and measured performance', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['엔티티와 DTO', 'IQueryable', '추적과 읽기', 'N+1 조회', '트랜잭션'],
    ['인증과 권한', '최소 권한', '입력 검증', '비밀·개인정보', '보안 오류 처리'],
    ['프로파일링', '캐시 키', '캐시 무효화', '할당과 Span', '취소·시간 제한'],
  ];

  for (const [weekIndex, weekNumber] of [25, 26, 27].entries()) {
    const reviews = csharpReviewedDataSecurityWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.sessions.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.sessions[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedDataSecurityWeeks[26][2].rule, /권한/);
  assert.match(csharpReviewedDataSecurityWeeks[26][4].rule, /404/);
  assert.match(csharpReviewedDataSecurityWeeks[27][0].traceExplanation, /실제 측정값이 아니라/);
  assert.match(csharpReviewedDataSecurityWeeks[27][0].rule, /기준값.*성능 프로파일/);
  assert.match(csharpReviewedDataSecurityWeeks[27][1].rule, /조직.*캐시 키/);
  assert.match(csharpReviewedDataSecurityWeeks[27][3].rule, /ref struct/);
  assert.match(csharpReviewedDataSecurityWeeks[27][4].rule, /취소는 작업이 협조해야/);
  for (const url of [
    'https://learn.microsoft.com/en-us/ef/core/what-is-new/',
    'https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying',
    'https://learn.microsoft.com/en-us/ef/core/querying/tracking',
    'https://learn.microsoft.com/en-us/ef/core/saving/transactions',
    'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/profilers',
    'https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/performance/',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
});

test('C# weeks twenty-eight through thirty connect concurrency, operations, and layered design', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['IAsyncEnumerable', 'lock 범위', 'Concurrent 컬렉션', '백그라운드 작업', '재시도 정책'],
    ['환경 설정', '헬스 체크', 'graceful shutdown', '컨테이너 이미지', '롤백 계획'],
    ['수용 기준', '도메인 모델', '애플리케이션 서비스', '저장소 경계', '오류 상태'],
  ];

  for (const [weekIndex, weekNumber] of [28, 29, 30].entries()) {
    const reviews = csharpReviewedConcurrencyOperationsWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.sessions.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.sessions[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedConcurrencyOperationsWeeks[28][2].rule, /여러 번 실행/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[28][3].rule, /.NET 10/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[28][4].example, /status != 503/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[28][4].effectExplanation, /중복 요청을 가려내야/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[29][0].traceExplanation, /나중 값인/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[29][1].rule, /반복해서 재시작/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[29][4].rule, /확장 후 축소 방식/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[30][2].rule, /HTTP 상태 코드/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[30][3].rule, /프로그램을 다시 시작/);
  assert.match(csharpReviewedConcurrencyOperationsWeeks[30][4].effectExplanation, /실제 사이트 화면/);
  for (const url of [
    'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/generate-consume-asynchronous-stream',
    'https://learn.microsoft.com/en-us/dotnet/standard/collections/thread-safe/',
    'https://learn.microsoft.com/en-us/dotnet/api/system.collections.concurrent.concurrentdictionary-2.getoradd',
    'https://learn.microsoft.com/en-us/dotnet/core/compatibility/extensions/10.0/backgroundservice-executeasync-task',
    'https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience',
    'https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers',
    'https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/dotnet/core/docker/container-images',
    'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
});

test('C# weeks thirty-one through thirty-three turn review and capstone requirements into verified cases', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['변경 범위', '계약 변화', 'nullable 변경', '리뷰 질문', '검증 보고'],
    ['사용자 시나리오', '요청 계약', '응답 모델', '실패 계약', '학습 기록 경계'],
    ['도메인 책임', '저장 책임', '단위 테스트 사례', '통합 테스트 설계', '보안 리뷰'],
  ];

  for (const [weekIndex, weekNumber] of [31, 32, 33].entries()) {
    const reviews = csharpReviewedCapstoneWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.sessions.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.sessions[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 45);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedCapstoneWeeks[31][1].rule, /API 버전/);
  assert.match(csharpReviewedCapstoneWeeks[31][4].rule, /실제 확인한 결과만/);
  assert.match(csharpReviewedCapstoneWeeks[32][1].rule, /실행 중 잘못된 입력/);
  assert.match(csharpReviewedCapstoneWeeks[32][3].rule, /다시 로그인할지|다시 불러올지/);
  assert.match(csharpReviewedCapstoneWeeks[33][1].rule, /프로그램을 다시 시작해도 기록이 남는지/);
  assert.match(csharpReviewedCapstoneWeeks[33][3].effectExplanation, /실제 데이터베이스/);
  assert.match(csharpReviewedCapstoneWeeks[33][4].effectExplanation, /로그인이나 데이터베이스/);
  assert.match(csharpReviewedCapstoneWeeks[31][3].example, /reservedBefore \+ newlyReserved/);
  assert.match(csharpReviewedCapstoneWeeks[32][1].example, /IsNullOrWhiteSpace/);
  assert.match(csharpReviewedCapstoneWeeks[32][3].example, /_ => 500/);
  assert.doesNotMatch(csharpReviewedCapstoneWeeks[32][3].example, /_ => 200/);
  assert.equal(csharpReviewedCapstoneWeeks[32][3].traceAnswer, '400/401/403/409/200/500');
  for (const url of [
    'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles',
    'https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0',
    'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices',
    'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0',
    'https://www.rfc-editor.org/rfc/rfc9457.html',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
});

test('C# weeks thirty-four and thirty-five complete recovery and release capstones with verified cases', () => {
  const ids = new Set();
  const answerPositions = [];
  const expectedTopics = [
    ['멱등 완료', '취소 전파', '동시 수정', '복구 흐름', '관측 기준'],
    ['전체 계층', '회귀 계획', '출시 체크', '기술 한계 보고', '다음 학습 계획'],
  ];

  for (const [weekIndex, weekNumber] of [34, 35].entries()) {
    const reviews = csharpReviewedFinalCapstoneWeeks[weekNumber];
    const week = track.lessons[weekNumber - 1];
    assert.equal(reviews.length, 5);
    assert.deepEqual(week.sessions.map((day) => day.title), expectedTopics[weekIndex]);

    for (const [dayIndex, review] of reviews.entries()) {
      const day = week.sessions[dayIndex];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.equal(day.intro, review.rule);
      assert.ok(review.example.includes('Console.WriteLine'), `W${weekNumber} D${dayIndex + 1}`);
      assert.ok(review.traceHint.length > 15);
      assert.ok(review.traceExplanation.length > 50);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, exercise.title === '예제 결과 추적' ? /-v3-trace$/ : /-v2-/);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 25, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        assert.equal(new Set(choiceExercise.choices.map((option) => option.text.trim())).size, 3, choiceExercise.id);
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 20, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.equal(ids.size, 30);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(csharpReviewedFinalCapstoneWeeks[34][0].rule, /같은 요청 키/);
  assert.match(csharpReviewedFinalCapstoneWeeks[34][1].effectExplanation, /취소 신호 전달.*저장 확정/);
  assert.match(csharpReviewedFinalCapstoneWeeks[34][2].rule, /version|ETag/);
  assert.match(csharpReviewedFinalCapstoneWeeks[34][3].effectExplanation, /저장 중 오류/);
  assert.match(csharpReviewedFinalCapstoneWeeks[35][0].rule, /사용자 권한/);
  assert.match(csharpReviewedFinalCapstoneWeeks[35][2].effectExplanation, /되돌리는 방법/);
  assert.match(csharpReviewedFinalCapstoneWeeks[35][3].rule, /실행/);
  for (const url of [
    'https://learn.microsoft.com/en-us/ef/core/saving/concurrency',
    'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles',
    'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices',
  ]) {
    assert.ok(track.contentReview.sources.some((source) => source.url === url), url);
  }
});
