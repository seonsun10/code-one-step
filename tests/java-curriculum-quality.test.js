import test from 'node:test';
import assert from 'node:assert/strict';
import { getExercise, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const javaTrack = tracks.find((track) => track.id === 'java');

function assertExerciseIdOrLegacy(exercise, expectedId) {
  if (exercise.id === expectedId) return;
  assert.ok(exercise.legacyIds?.includes(expectedId), `${exercise.id} should preserve ${expectedId}`);
  assert.equal(getExercise(expectedId)?.id, exercise.id);
}

test('Java weekly pages use useful introductions without repeated helper copy', () => {
  assert.equal(javaTrack.lessons.length, 26);
  assert.equal(new Set(javaTrack.lessons.map((lesson) => lesson.title)).size, 26);
  assert.equal(new Set(javaTrack.lessons.map((lesson) => lesson.intro)).size, 26);
  for (const lesson of javaTrack.lessons) {
    assert.doesNotMatch(lesson.title, /^\d+주차\s*[·:]/, lesson.id);
    assert.deepEqual(lesson.points, [], lesson.id);
    assert.ok(lesson.intro.length > 35, lesson.id);
    assert.doesNotMatch(lesson.intro, /실제 프로그램의 입력·상태·출력 사이에 생기는 경계/, lesson.id);
    assert.doesNotMatch(lesson.intro, /하루 한 개의 핵심 규칙|정답은 문법 암기보다|수정 문제는 구조를 확인/, lesson.id);
    assert.doesNotMatch(lesson.intro, /이번 주는 .*를 하루씩 나누어 읽고/, lesson.id);
    assert.doesNotMatch(lesson.intro, /날짜와 시간는|네트워크 기본는/, lesson.id);
  }

  assert.match(javaTrack.contentReview.versionContext, /Java SE 25 LTS/);
  assert.match(javaTrack.contentReview.versionContext, /Java 27.*비-LTS/);
  assert.equal(javaTrack.contentReview.reviewedAt, '2026-11-02');
});

test('Java focused questions answer their stated input, result, or code contract', () => {
  const cases = [
    [1, 3, 4, /한 번만 값을 대입/], [1, 5, 3, /^5$/], [2, 1, 4, /^score == 60$/],
    [2, 2, 3, /^"Java"\.equals\(name\)$/], [2, 3, 3, /^B 분기$/], [2, 4, 3, /^true$/], [2, 5, 3, /^Mon$/],
    [3, 1, 3, /^values\[2\]$/], [3, 2, 3, /values는 \{2, 3\} 그대로/], [3, 3, 3, /continue.*건너뛰고 break.*끝냅니다/], [3, 5, 3, /^6번$/],
    [4, 3, 3, /컴파일 오류/], [5, 5, 3, /필드가 final/], [6, 2, 3, /public void send\(String message\)/],
    [6, 3, 3, /CourseReport가 render를 구현/], [6, 4, 3, /public void send\(String message\)/],
    [6, 5, 3, /실제 객체가 EmailNotifier/], [9, 3, 3, /String을 받아 Integer/], [9, 4, 3, /ready를 출력/],
    [10, 1, 3, /^\[60, 85\]$/], [10, 2, 3, /길이를 담은 정수/], [10, 4, 3, /^최종 연산$/], [11, 3, 3, /^2000$/],
    [11, 4, 3, /공유 balance 증가/], [11, 5, 3, /카운트가 0/], [12, 2, 3, /^3$/],
    [12, 1, 3, /지역 변수와 호출 상태/], [12, 4, 3, /비용이 집중된 위치/], [12, 5, 3, /^19ms$/],
  ];
  for (const [week, day, version, expected] of cases) {
    const id = `java-w${week}-d${day}-choice-v${version}`;
    const question = getExercise(id);
    assert.ok(question, id);
    if (week <= 3) assert.equal(getExercise(`java-w${week}-d${day}-choice-v${version - 1}`), null, id);
    assert.match(question.choices.find((option) => option.id === question.answer).text, expected, id);
    for (const option of question.choices) {
      assert.equal(gradeAnswer(question, option.id), option.id === question.answer, `${id}/${option.id}`);
      assert.ok(question.choiceExplanations[option.id].length > 15, `${id}/${option.id}`);
    }
  }
});

test('Java day-four repairs are aligned with the day skill through all 26 weeks', () => {
  const expectedEvidence = [
    "status == 'Y'", 'age >= 18', 'values.length', 'value < 0', 'getTitle', 'consumer.accept', 'compareTo(right)', 'resource = reader',
    'consumer.accept', 'toList', 'synchronized', 'nanoTime', 'Files.writeString', 'atZone', 'CourseRequest(title, minutes)',
    'timeout(java.time.Duration.ofSeconds(2))', 'assertEquals(0, sum(java.util.Collections.<Integer>emptyList()))', 'ofNullable', 'copyOf', 'token == null', 'minutes > 0', 'binarySearch', 'HashSet', 'Math.addExact',
    'IllegalArgumentException', 'nanoTime',
  ];

  javaTrack.lessons.forEach((lesson, index) => {
    const week = index + 1;
    const repairId = week <= 4 || week === 6 || week === 7 || week === 9 || week === 15 || week === 16 || week === 17 || week === 20 || week === 24 ? `java-w${week}-d4-repair-v2` : `java-w${week}-d4-repair`;
    const repair = getExercise(repairId);
    assert.ok(repair, `missing week ${index + 1} repair`);
    assert.equal(repair.type, 'repair-code', repair.id);
    assert.match(repair.prompt, new RegExp(lesson.studyDays[3].title), repair.id);
    const expected = week === 4 ? 'int count = 1; return count;' : week === 6 ? 'notifier.send("ready")' : week === 7 ? 'compareTo(right)' : expectedEvidence[index];
    assert.ok(repair.acceptanceCriteria.requirements[0].includes(expected), repair.id);
  });
});

test('Java short answers accept Korean concept wording as well as Java names', () => {
  const cases = [
    ['java-w1-d1-short-v2', '초기화'],
    ['java-w2-d2-short-v3', 'equals'],
    ['java-w9-d5-short-v2', '메서드 참조'],
    ['java-w14-d5-short-v2', '마감일 2026-10-12, 하루 남음'],
    ['java-w23-d2-short-v2', 'found=true, index=2'],
  ];

  cases.forEach(([id, response]) => {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.equal(gradeAnswer(exercise, response), true, `${id} should accept ${response}`);
  });
});

test('Java W2 D1 accepts equivalent integer threshold conditions', () => {
  const exercise = getExercise('java-w2-d1-short-v3');
  assert.ok(exercise);
  for (const answer of ['60 <= score', 'score > 59', '(score >= 60)']) {
    assert.equal(gradeAnswer(exercise, answer), true, `${exercise.id} should accept ${answer}`);
  }
});

test('Java W4-W6 short answers accept equivalent numbers and reject vague or invalid code', () => {
  const overloadOutput = getExercise('java-w4-d5-short-v3');
  assert.equal(gradeAnswer(overloadOutput, '5.5'), true);
  assert.equal(gradeAnswer(overloadOutput, '5.50'), false);

  const staticCall = getExercise('java-w5-d2-short-v3');
  assert.equal(gradeAnswer(staticCall, 'Course.createdCount()'), true);
  assert.equal(gradeAnswer(staticCall, 'Course.createdCount'), false);

  const getterCall = getExercise('java-w5-d3-short-v3');
  assert.equal(gradeAnswer(getterCall, 'course.getMinutes()'), true);
  assert.equal(gradeAnswer(getterCall, 'getter'), false);

  const inheritanceKeyword = getExercise('java-w6-d1-short-v2');
  assert.equal(gradeAnswer(inheritanceKeyword, 'extends'), true);
  assert.equal(gradeAnswer(inheritanceKeyword, '상속'), false);
});

test('Java W7-W9 short answers distinguish exact API names and receivers', () => {
  const iteratorRemoval = getExercise('java-w7-d5-short-v2');
  assert.equal(gradeAnswer(iteratorRemoval, 'iterator.remove()'), true);
  assert.equal(gradeAnswer(iteratorRemoval, 'remove'), false);

  const catchOrder = getExercise('java-w8-d3-short-v2');
  assert.equal(gradeAnswer(catchOrder, 'FileNotFoundException'), true);
  assert.equal(gradeAnswer(catchOrder, '하위 예외'), false);

  const causeMethod = getExercise('java-w8-d5-short-v2');
  assert.equal(gradeAnswer(causeMethod, 'getCause()'), true);
  assert.equal(gradeAnswer(causeMethod, 'cause 읽기'), false);
});

test('Java W10-W12 short answers distinguish APIs, list size, and guarantees', () => {
  assert.equal(gradeAnswer(getExercise('java-w11-d1-short-v3'), 'join()'), true);
  assert.equal(gradeAnswer(getExercise('java-w11-d1-short-v3'), '작업 종료 대기'), false);
  assert.equal(gradeAnswer(getExercise('java-w11-d3-short-v2'), '원자적 증가'), false);
  assert.equal(gradeAnswer(getExercise('java-w11-d5-short-v3'), '카운트 감소'), false);

  const listSize = getExercise('java-w12-d2-short-v3');
  assert.match(listSize.prompt, /points\.size\(\)/);
  assert.equal(gradeAnswer(listSize, '목록의 원소 수'), true);
  assert.equal(gradeAnswer(listSize, 'Point 객체 수'), false);

  const warmup = getExercise('java-w12-d3-short-v3');
  assert.equal(gradeAnswer(warmup, '보장되지 않는다'), true);
  assert.equal(gradeAnswer(warmup, '반드시 일어나지 않는다'), false);
});

test('Java W13-W15 short answers match exact output and shown success paths', () => {
  assert.equal(gradeAnswer(getExercise('java-w13-d2-short-v2'), '첫 강의'), true);
  assert.equal(gradeAnswer(getExercise('java-w13-d2-short-v2'), '첫강의'), false);
  assert.equal(gradeAnswer(getExercise('java-w13-d3-short-v2'), 'read=Java'), true);
  assert.equal(gradeAnswer(getExercise('java-w13-d3-short-v2'), 'read = Java'), false);
  assert.equal(gradeAnswer(getExercise('java-w13-d3-short-v2'), '출력은 read=Java'), false);
  assert.equal(gradeAnswer(getExercise('java-w14-d2-short-v2'), '2026-10-11T09:00'), true);
  assert.equal(gradeAnswer(getExercise('java-w14-d2-short-v2'), '2026년 10월 11일 09:00'), false);
  assert.equal(gradeAnswer(getExercise('java-w14-d2-short-v2'), '출력은 2026-10-11T09:00'), false);
  assert.equal(gradeAnswer(getExercise('java-w14-d3-short-v2'), '2026-10-11T00:00:00Z'), true);
  assert.equal(gradeAnswer(getExercise('java-w14-d3-short-v2'), '2026년 10월 11일 UTC 00:00'), false);
  assert.equal(gradeAnswer(getExercise('java-w14-d3-short-v2'), '출력은 2026-10-11T00:00:00Z'), false);
  assert.equal(gradeAnswer(getExercise('java-w15-d1-short-v2'), 'minutes=45'), true);
  assert.equal(gradeAnswer(getExercise('java-w15-d1-short-v2'), '45분을 출력'), false);
  assert.equal(gradeAnswer(getExercise('java-w15-d1-short-v2'), '출력은 minutes=45'), false);
  assert.equal(gradeAnswer(getExercise('java-w15-d2-short-v2'), '제목이 필요합니다'), true);
  assert.equal(gradeAnswer(getExercise('java-w15-d2-short-v2'), 'title is required'), false);
  assert.equal(gradeAnswer(getExercise('java-w15-d5-short-v2'), '분은 양수여야 합니다 (입력값: -1)'), true);
  assert.equal(gradeAnswer(getExercise('java-w15-d5-short-v2'), 'minutes must be positive'), false);

  const inputValidation = javaTrack.lessons.find((lesson) => lesson.week === 15).studyDays[2];
  assert.match(inputValidation.example, /requirePositiveMinutes\(30\)/);
  assert.match(getExercise('java-w15-d3-short-v2').prompt, /콘솔에 출력/);
});

test('Java W16-W18 exact output answers reject strings with changed spacing or missing fields', () => {
  for (const [id, exact, changed] of [
    ['java-w16-d3-short-v2', 'status=204, success=true', 'status = 204, success = true'],
    ['java-w16-d5-short-v2', 'body=Java', 'body = Java'],
    ['java-w17-d1-short-v2', 'passed: add', 'passed:add'],
    ['java-w17-d2-short-v2', 'empty sum=0', 'empty sum = 0'],
    ['java-w17-d3-short-v2', 'passed: invalid input throws', 'passed:invalid input throws'],
    ['java-w17-d5-short-v2', 'first=1, second=0', 'first = 1, second = 0'],
    ['java-w18-d3-short-v2', 'Report: Java', 'Report:Java'],
    ['java-w18-d5-short-v2', 'found=true, title=Java', 'found = true, title = Java'],
  ]) {
    const exercise = getExercise(id);
    assert.equal(gradeAnswer(exercise, exact), true, `${id} accepts its displayed output`);
    assert.equal(gradeAnswer(exercise, changed), false, `${id} rejects a different output string`);
  }
  assert.equal(gradeAnswer(getExercise('java-w18-d5-short-v2'), 'Java가 있어 true입니다'), false);
});

test('Java W19-W21 output answers match the displayed strings exactly', () => {
  for (const [id, exact, changed] of [
    ['java-w19-d1-short-v2', 'same=true', 'same = true'],
    ['java-w19-d2-short-v2', 'title=Java', 'title = Java'],
    ['java-w19-d3-short-v2', 'id=java', 'id = java'],
    ['java-w19-d5-short-v2', 'title=Java', 'title = Java'],
    ['java-w20-d1-short-v2', 'info=true, fine=false', 'info = true, fine = false'],
    ['java-w20-d2-short-v2', 'event=course.loaded, courseId=java', 'event = course.loaded, courseId = java'],
    ['java-w20-d3-short-v2', 'level=SEVERE, cause=repository unavailable', 'level = SEVERE, cause = repository unavailable'],
    ['java-w20-d5-short-v2', 'event=course.load, value=250, unit=ms', 'event = course.load, value = 250, unit = ms'],
    ['java-w21-d1-short-v2', 'eligible=true, canEnroll=true', 'eligible = true, canEnroll = true'],
    ['java-w21-d2-short-v2', 'completed=3', 'completed = 3'],
    ['java-w21-d3-short-v2', 'isAdult=true', 'isAdult = true'],
  ]) {
    const exercise = getExercise(id);
    assert.equal(gradeAnswer(exercise, exact), true, `${id} accepts its displayed output`);
    assert.equal(gradeAnswer(exercise, changed), false, `${id} rejects a changed output string`);
  }
});

test('Java W22-W24 output answers match the displayed strings exactly', () => {
  for (const [id, exact, changed] of [
    ['java-w22-d1-short-v2', 'arrayLength=2, listSize=3', 'arrayLength = 2, listSize = 3'],
    ['java-w22-d2-short-v2', 'stack=second, queue=first', '스택은 second, 큐는 first'],
    ['java-w22-d3-short-v2', 'java=2, keys=2', 'java 방문 2회, 키 2개'],
    ['java-w22-d5-short-v2', 'linearChecks=7, binaryChecks=3, growth=O(n)/O(log n)', '선형 7회, 이진 3회, O(n)과 O(log n)'],
    ['java-w23-d1-short-v2', 'contains7=true, contains5=false', '7은 있고 5는 없습니다'],
    ['java-w23-d2-short-v2', 'found=true, index=2', 'found = true, index = 2'],
    ['java-w23-d3-short-v2', '[Algorithms, Java]', 'Algorithms, Java'],
    ['java-w23-d5-short-v2', 'selected=[1, 2, 3]', 'selected = [1, 2, 3]'],
    ['java-w24-d1-short-v2', 'factorial(5)=120', '120'],
    ['java-w24-d2-short-v2', 'sumTo(5)=15', '15'],
    ['java-w24-d3-short-v2', 'depth=5', 'depth = 5'],
    ['java-w24-d5-short-v2', 'factorial(5)=120', 'factorial(5) = 120'],
  ]) {
    const exercise = getExercise(id);
    assert.ok(exercise, `${id} exists`);
    assert.deepEqual(exercise.acceptedAnswers, [exact], `${id} has one exact output answer`);
    assert.equal(gradeAnswer(exercise, exact), true, `${id} accepts its displayed output`);
    assert.equal(gradeAnswer(exercise, changed), false, `${id} rejects a changed or incomplete answer`);
  }
});

test('Java W25 terminology answers accept specific concepts and keep legacy IDs separate', () => {
  const requirements = getExercise('java-w25-d1-short-v2');
  assert.ok(requirements);
  assert.equal(gradeAnswer(requirements, '요구사항 분해'), true);
  assert.equal(gradeAnswer(requirements, 'requirements analysis'), true);
  assert.equal(gradeAnswer(requirements, 'requirements'), false);
  assert.equal(getExercise('java-w25-d1-short'), null);

  const sharedLanguage = getExercise('java-w25-d2-short-v2');
  assert.equal(gradeAnswer(sharedLanguage, '도메인 공통 언어'), true);
  assert.equal(gradeAnswer(sharedLanguage, 'ubiquitous language'), true);
  assert.equal(gradeAnswer(sharedLanguage, '보편 언어'), false);
  assert.equal(getExercise('java-w25-d2-short'), null);

  const testCase = getExercise('java-w25-d5-short-v2');
  assert.ok(testCase);
  assert.equal(gradeAnswer(testCase, '테스트 케이스'), true);
  assert.equal(gradeAnswer(testCase, 'test case'), true);
  assert.equal(gradeAnswer(testCase, '사례'), false);
  assert.equal(gradeAnswer(testCase, 'scenario'), false);
  assert.equal(getExercise('java-w25-d5-short'), null);
});

test('every generated Java short answer matches its Korean prompt or exact-output contract', () => {
  javaTrack.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer' && /^java-w\d+-d\d+-short(?:-v\d+)?$/.test(exercise.id))
    .forEach((exercise) => {
      const week = Number(exercise.id.match(/java-w(\d+)/)[1]);
      if (week <= 3) {
        assert.doesNotMatch(exercise.prompt, /규칙·타입·API·연산/);
        assert.ok(exercise.acceptedAnswers.length > 0, `${exercise.id} needs an explicit expected answer`);
      } else if (week < 25) {
        if (/그대로 적으세요/.test(exercise.prompt)) {
          assert.equal(exercise.acceptedAnswers.length, 1, `${exercise.id} must accept only the displayed output`);
        } else {
          assert.ok(exercise.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), `${exercise.id} lacks a Korean answer`);
        }
        if (week <= 24) {
          assert.doesNotMatch(exercise.prompt, /규칙·타입·API·연산/, `${exercise.id} needs a focused recall prompt`);
        } else {
          assert.match(exercise.prompt, /규칙·타입·API·연산/, `${exercise.id} must describe its accepted answer scope`);
        }
      } else {
        assert.ok(exercise.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), `${exercise.id} lacks a Korean answer`);
        assert.doesNotMatch(exercise.prompt, /규칙·타입·API·연산/, `${exercise.id} needs a focused recall prompt`);
      }
    });
});

test('generated Java application questions use the displayed-example versioned IDs', () => {
  const applications = javaTrack.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.id.endsWith('-apply-v2'));
  assert.equal(applications.length, 10);
  applications.forEach((exercise) => {
    const week = Number(exercise.id.match(/java-w(\d+)/)[1]);
    if (week < 25) assert.match(exercise.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);
    else assert.doesNotMatch(exercise.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);
    assert.doesNotMatch(exercise.prompt, /```|\n\s*`/);
    assert.ok(exercise.choices.some((option) => option.id === exercise.answer), exercise.id);
    assert.ok(exercise.choiceExplanations[exercise.answer]?.trim(), exercise.id);
    assert.equal(getExercise(exercise.id.replace('-apply-v2', '-apply')), null, exercise.id);
  });
  const initialApplications = javaTrack.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.id.endsWith('-apply-v3'));
  assert.equal(initialApplications.length, 84);
  initialApplications.forEach((exercise) => {
    assert.doesNotMatch(exercise.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);
    assert.ok(exercise.choices.some((option) => option.id === exercise.answer), exercise.id);
    assert.ok(exercise.choiceExplanations[exercise.answer]?.trim(), exercise.id);
  });
});

test('Java repair grading still requires the documented full method structure', () => {
  const repair = getExercise('java-w13-d4-repair');
  assert.equal(gradeAnswer(repair, 'return java.nio.file.Files.writeString(path, text);'), false);
  assert.equal(gradeAnswer(repair, 'static java.nio.file.Path writeCourse(java.nio.file.Path path, String text) { return java.nio.file.Files.writeString(path, text); }'), false);
  assert.equal(gradeAnswer(repair, 'static java.nio.file.Path writeCourse(java.nio.file.Path path, String text) throws java.io.IOException { return java.nio.file.Files.writeString(path, text); }'), true);
});

test('Java weeks 13 through 25 match their weekly topics and daily question evidence', () => {
  const cases = {
    13: [['Path 만들기', 'Path.of'], ['문자 인코딩', 'StandardCharsets.UTF_8'], ['파일 읽기', 'Files.readString'], ['파일 쓰기', 'Files.writeString'], ['존재 여부', 'Files.exists']],
    14: [['LocalDate', 'LocalDate.of'], ['LocalDateTime', 'LocalDateTime.of'], ['Instant', 'Instant.parse'], ['ZoneId', 'ZoneId.of'], ['시간 계산', 'plusDays']],
    15: [['문자열 파싱', 'Integer.parseInt'], ['null 경계', 'requireNonNull'], ['입력 검증', 'minutes <= 0'], ['DTO의 역할', 'CourseRequest'], ['오류 메시지', 'IllegalArgumentException']],
    16: [['URI 구성', 'URI.create'], ['요청 메서드', '.GET()'], ['상태 코드', 'statusCode >= 200'], ['timeout', 'timeout'], ['응답 본문', 'response.body()']],
    17: [['Arrange Act Assert', 'assertEquals'], ['경계값', 'Collections.<Integer>emptyList'], ['예외 검증', 'assertThrows'], ['테스트 이름', 'emptyList_returnsZero'], ['독립성', 'new CourseRepository']],
    18: [['한 가지 책임', 'CourseFormatter'], ['의존성 역전', 'interface CourseRepository'], ['구성으로 재사용', 'Formatter formatter'], ['명시적 계약', 'Optional<Course>'], ['변경 영향 찾기', 'findById("java")']],
    19: [['equals 의미', 'left.equals(right)'], ['hashCode 규약', 'Objects.hash'], ['record 값 모델', 'record CourseId'], ['방어적 복사', 'List.copyOf'], ['컬렉션 키 주의', 'HashMap']],
    20: [['로그 수준', 'logger.isLoggable'], ['구조화된 맥락', 'courseId'], ['예외 기록', 'setThrown'], ['민감 정보', 'redact(token)'], ['측정 가능한 사건', 'Duration.between']],
    21: [['냄새 찾기', 'eligible'], ['의미 있는 이름', 'completedLessons'], ['조건 추출', 'isAdult'], ['중복 제거', 'isValidMinutes'], ['작은 커밋 단위', 'git commit']],
    22: [['배열과 목록', 'ArrayList'], ['스택과 큐', 'ArrayDeque'], ['해시 기반 조회', 'HashMap'], ['정렬된 자료', 'Collections.sort'], ['복잡도 비교', 'O(n)']],
    23: [['선형 탐색', 'for (int value'], ['이진 탐색 전제', 'binarySearch'], ['정렬 비교', 'Comparator'], ['중복 값', 'binarySearch'], ['오프바이원 검사', 'index < end']],
    24: [['기저 조건', 'n <= 1'], ['재귀 호출', 'sumTo(n - 1)'], ['스택 깊이', '100,000'], ['분할 정복', 'left + (right - left) / 2'], ['반복으로 바꾸기', 'value <= n']],
    25: [['요구사항 분해', 'nextLevel'], ['도메인 용어', 'CourseProgress'], ['메서드 계약', 'Optional<Course>'], ['오류 정책', 'IllegalArgumentException'], ['예제 시나리오', 'checkNextLevel']],
  };
  const weeklyExamples = {
    13: 'Path.of', 14: 'LocalDate.of', 15: 'Integer.parseInt', 16: 'URI.create', 17: 'assertEquals', 18: 'CourseFormatter',
    19: 'EqualsMeaningExample', 20: 'LogLevelExample', 21: 'CodeSmellExample', 22: 'ArrayList', 23: 'for (int value', 24: 'n <= 1', 25: 'nextLevel',
  };

  for (const [weekText, markers] of Object.entries(cases)) {
    const week = Number(weekText);
    const lesson = javaTrack.lessons.find((item) => item.week === week);
    assert.ok(lesson.example.includes(weeklyExamples[week]), `${lesson.id} weekly example`);
    for (const [index, [title, marker]] of markers.entries()) {
      const day = lesson.studyDays[index];
      assert.ok(day.title.includes(title), `${lesson.id} day ${index + 1}`);
      assert.ok(day.example.includes(marker), `${lesson.id} day ${index + 1}`);
      const choice = day.exercises.find((exercise) => exercise.type === 'choice');
      assert.ok(choice, `${lesson.id} day ${index + 1} choice`);
      assert.ok(choice.choiceExplanations[choice.answer].length >= 20, choice.id);
      assert.doesNotMatch(choice.choiceExplanations[choice.answer], /책임과 적용 범위.*API 계약·설정/);
      const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
      if (short) assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
      const locate = day.exercises.find((exercise) => exercise.type === 'locate-error');
      if (locate) {
        assert.ok(locate.answerLines.every((line) => locate.codeLines[line - 1]?.trim()), locate.id);
        assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
      }
      const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
      if (repair) {
        assert.ok(repair.acceptanceCriteria.requirements[0].length > 15, repair.id);
        assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
      }
    }
  }
});

test('Java week 26 code-reading example follows the complete input-to-result flow', () => {
  const day = javaTrack.lessons.find((lesson) => lesson.week === 26).studyDays[0];
  assert.match(day.example, /class CompletionSummary/);
  assert.match(day.example, /Arrays\.asList\(true, false, true\)/);
  assert.match(day.example, /\.filter\(Boolean::booleanValue\)\.count\(\)/);
  assert.match(day.example, /System\.out\.println\("completed=" \+ count \+ "\/" \+ completed\.size\(\)\); \/\/ completed=2\/3/);
  assert.doesNotMatch(day.intro, /실패 경로를 함께 확인/);
});

test('Java weeks 25 and 26 teach complete examples and transfer each idea to a new case', () => {
  const expected = {
    25: [
      ['RequirementBreakdownExample', 'Math.addExact'],
      ['DomainLanguageExample', 'record CourseProgress(int completedLessons)'],
      ['MethodContractExample', 'Optional.empty()'],
      ['ErrorPolicyExample', 'IllegalArgumentException'],
      ['ExampleScenarioExample', 'checkNextLevel(-1)'],
    ],
    26: [
      ['CompletionSummary', 'Arrays.asList(true, false, true)'],
      ['ReproductionExample', 'actualBeforeFix'],
      ['DesignChoiceExample', 'progressByTrack.get("java")'],
      ['PerformanceHypothesisExample', 'System.nanoTime() - started'],
      ['LearningRetrospectiveExample', 'topicWithMostMistakes'],
    ],
  };
  const applicationMarkers = [
    ['nextLevel(3)', 'nextLevel(-1)'], ['CourseProgress', 'completedLessons'], ['"spring"', '빈 Optional'],
    ['requirePositiveId(0)', 'IllegalArgumentException'], ['정상·경계·실패', '-1은 IllegalArgumentException'],
    ['[true, false, false, true]', 'count는 2'], ['기대값은 4', '실제값 3'], ['언어 이름', 'Map<String, Integer>'],
    ['nanoTime()', '같은 JVM'], ['exceptions 3회', 'exceptions'],
  ];
  const days = [];

  for (const [weekText, cases] of Object.entries(expected)) {
    const week = Number(weekText);
    const lesson = javaTrack.lessons.find((item) => item.week === week);
    assert.equal(lesson.studyDays.length, 5);
    cases.forEach(([className, marker], index) => {
      const day = lesson.studyDays[index];
      assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
      assert.match(day.example, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), day.title);
      assert.match(day.example, /public static void main\(String\[\] args\)/, day.title);
      assert.ok(day.example.includes('System.out.println('), day.title);
      assert.ok(day.intro.length > 80, day.title);
      days.push(day);
    });
  }

  days.forEach((day, index) => {
    const [promptMarker, answerMarker] = applicationMarkers[index];
    const concept = day.exercises.find((exercise) => exercise.type === 'choice');
    const application = day.exercises.find((exercise) => exercise.id.endsWith('-apply-v2'));
    const recall = day.exercises.find((exercise) => exercise.type === 'short-answer');
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    assert.ok(application, day.title);
    assert.ok(recall || repair, day.title);
    const correctOption = application.choices.find((option) => option.id === application.answer);
    assert.ok(application.prompt.includes(promptMarker) || correctOption.text.includes(promptMarker), application.id);
    assert.ok(correctOption.text.includes(answerMarker) || application.choiceExplanations[application.answer].includes(answerMarker), application.id);
    assert.notEqual(application.prompt, concept.prompt, application.id);
    assert.notDeepEqual(application.choices.map((option) => option.text), concept.choices.map((option) => option.text), application.id);
    if (recall) {
      assert.doesNotMatch(recall.prompt, /규칙·타입·API·연산/, recall.id);
      assert.ok(recall.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), recall.id);
      assert.ok(recall.hint.length > 20, recall.id);
    } else {
      assert.ok(repair.starterCode.includes('return'), repair.id);
      assert.ok(repair.hint.length > 20, repair.id);
    }
  });
  assert.match(javaTrack.lessons.find((item) => item.week === 25).studyDays[1].example, /Java 16부터/);
  assert.match(javaTrack.lessons.find((item) => item.week === 26).studyDays[3].intro, /벽시계/);
  const repositoryExample = javaTrack.lessons.find((item) => item.week === 25).studyDays[2].example;
  assert.match(repositoryExample, /"java"\.equals\(id\)/);
  const reproductionExample = javaTrack.lessons.find((item) => item.week === 26).studyDays[1].example;
  assert.match(reproductionExample, /completed < 0/);
  assert.match(reproductionExample, /Math\.addExact\(completed, 1\)/);
});

test('Java weeks 1 through 3 show complete examples with traceable results', () => {
  const expectedResults = [
    ['VariableInitializationExample', '// 0'],
    ['NumericTypesExample', '// 2.5'],
    ['FinalVariableExample', '// 3'],
    ['BooleanValueExample', '// false'],
    ['NumericCastExample', '// 5: 소수 부분은 버려져요.'],
    ['ComparisonExample', '// true'],
    ['StringEqualityExample', '// true'],
    ['IfElseIfExample', '// B'],
    ['LogicalOperatorExample', '// true'],
    ['SwitchExpressionExample', '// Mon'],
    ['ArrayIndexExample', '// 2'],
    ['EnhancedForExample', '// 9'],
    ['ContinueBreakExample', '// 2'],
    ['ForLoopBoundaryExample', '// 9'],
    ['NestedLoopExample', '// 6'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week <= 3).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, 15);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes('System.out.println('), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    day.exercises.filter((exercise) => exercise.type === 'choice').forEach((exercise) => {
      assert.doesNotMatch(exercise.prompt, /을 적용할 때/, exercise.id);
      assert.ok(exercise.choices.some((option) => option.id === exercise.answer), exercise.id);
      assert.ok(exercise.choiceExplanations[exercise.answer]?.trim(), exercise.id);
    });
    const codeReading = day.exercises.find((exercise) => exercise.id.endsWith('-apply'));
    if (codeReading) assert.match(codeReading.explanation, /예제의 `.+` 사용이 핵심입니다\./, codeReading.id);
  });
});

test('Java weeks 4 through 6 use complete examples and questions that match each daily topic', () => {
  const expectedResults = [
    ['AddMethodExample', '// 5'], ['BooleanReturnExample', '// true'], ['ReturnPathExample', '// 4'],
    ['LocalScopeExample', '// 1'], ['OverloadExample', '// 5.5'],
    ['ConstructorExample', '// Java'], ['InstanceAndStaticExample', '// Java, Python, created=2'],
    ['AccessModifierExample', '// 40'], ['GetterExample', '// Java'], ['ImmutableObjectExample', '// Java, 40'],
    ['InheritanceExample', '// sent: hello'], ['OverrideExample', '// email: welcome'],
    ['AbstractClassExample', '// Courses: 2'], ['InterfaceContractExample', '// email: ready'],
    ['PolymorphicCallExample', '// email: hi'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 4 && lesson.week <= 6).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, 15);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes('System.out.println('), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
  });

  const inheritance = getExercise('java-inheritance-choice-v2');
  assert.match(inheritance.choices.find((option) => option.id === inheritance.answer).text, /extends BaseNotifier/);
  const override = getExercise('java-override-locate-v2');
  assert.deepEqual(override.answerLines, [6]);
  assert.match(override.explanation, /send\(String message\)/);
  assert.equal(gradeAnswer(getExercise('java-abstract-short-v2'), '직접 생성할 수 없다'), true);
  assert.equal(gradeAnswer(getExercise('java-class-short-v2'), '하위 클래스는 직접 접근할 수 없다'), true);

  const localScopeRepair = getExercise('java-w4-d4-repair-v2');
  assert.equal(gradeAnswer(localScopeRepair, 'static int countWhenReady(boolean ready) { if (ready) { int count = 1; return count; } return 0; }'), true);
  assert.equal(gradeAnswer(localScopeRepair, localScopeRepair.starterCode), false);
  const interfaceRepair = getExercise('java-w6-d4-repair-v2');
  assert.equal(gradeAnswer(interfaceRepair, 'static void sendNotification(Notifier notifier) { notifier.send("ready"); }'), true);
  const expectedRepairCases = [
    ['java-w1-d4-repair-v2', { input: "isReady('Y')", output: 'true' }, [{ input: "isReady('Y')", expected: 'true' }, { input: "isReady('N')", expected: 'false' }]],
    ['java-w2-d4-repair-v2', { input: 'isWorkingAge(30)', output: 'true' }, [{ input: 'isWorkingAge(18)', expected: 'true' }, { input: 'isWorkingAge(65)', expected: 'false' }]],
    ['java-w3-d4-repair-v2', { input: 'sumValues(new int[] {2, 3})', output: '5' }, [{ input: 'sumValues(new int[] {2, 3})', expected: '5' }, { input: 'sumValues(new int[0])', expected: '0' }]],
    ['java-w4-d4-repair-v2', { input: 'countWhenReady(true)', output: '1' }, [{ input: 'countWhenReady(true)', expected: '1' }, { input: 'countWhenReady(false)', expected: '0' }]],
    ['java-w5-d4-repair', { input: 'titleOf(new Course("Java"))', output: 'Java' }, [{ input: 'titleOf(new Course("Java"))', expected: 'Java' }, { input: 'titleOf(new Course(""))', expected: '빈 문자열' }]],
    ['java-w6-d4-repair-v2', { input: 'sendNotification(notifier)', output: 'notifier.send("ready") 1회 호출' }, [{ input: 'EmailNotifier 구현체', expected: 'send("ready") 1회 호출' }, { input: '다른 Notifier 구현체', expected: 'send("ready") 1회 호출' }]],
  ];
  expectedRepairCases.forEach(([id, example, cases]) => {
    const exercise = getExercise(id);
    assert.deepEqual(exercise.acceptanceCriteria.examples[0], example, id);
    assert.deepEqual(exercise.acceptanceCriteria.tests, cases, id);
    assert.match(exercise.gradingNote, /실행형 채점은 아니며/);
    assert.match(exercise.gradingNote, /실행해 검증하지는 않습니다/);
  });
  assert.ok(!getExercise('java-interface-choice'));
  assert.ok(!getExercise('java-record-locate'));
  assert.ok(!getExercise('java-record-short'));
  assert.ok(!getExercise('java-class-short'));
});

test('Java weeks 7 through 9 use complete examples and questions that match each daily topic', () => {
  const expectedResults = [
    ['ListOrderExample', '// [Mina, Jin, Mina]'],
    ['SetDuplicateExample', '// 2, has-java=true'],
    ['MapLookupExample', '// 40'],
    ['ComparableBoundExample', '// 5'],
    ['IteratorRemoveExample', '// [Java]'],
    ['ExceptionFlowExample', '// minutes must be positive'],
    ['CheckedExceptionExample', '// Java'],
    ['CatchOrderExample', '// file missing'],
    ['TryWithResourcesExample', '// Java'],
    ['ExceptionCauseExample', '// course load failed: disk unavailable'],
    ['RunnableLambdaExample', '// saved'],
    ['PredicateExample', '// true'],
    ['FunctionExample', '// 4'],
    ['ConsumerExample', '// ready'],
    ['MethodReferenceExample', '// Mina'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 7 && lesson.week <= 9).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, 15);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    if (choice) {
      assert.ok(choice.choices.some((option) => option.id === choice.answer), choice.id);
      assert.ok(choice.choiceExplanations[choice.answer]?.trim(), choice.id);
    }
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    if (short) assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    const locate = day.exercises.find((exercise) => exercise.type === 'locate-error');
    if (locate) {
      assert.ok(locate.answerLines.every((line) => locate.codeLines[line - 1]?.trim()), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
    }
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });

  const collectionChoice = getExercise('java-collections-choice-v2');
  assert.match(collectionChoice.choices.find((option) => option.id === collectionChoice.answer).text, /List<String>/);
  assert.equal(gradeAnswer(getExercise('java-catch-short-v2'), 'IOException 먼저'), true);
  const lambdaChoice = getExercise('java-lambda-choice-v2');
  assert.match(lambdaChoice.choices.find((option) => option.id === lambdaChoice.answer).text, /run 호출 때 save/);
  assert.deepEqual(getExercise('java-predicate-locate-v2').answerLines, [1]);
  assert.equal(gradeAnswer(getExercise('java-function-short-v2'), '4'), true);

  const genericRepair = getExercise('java-w7-d4-repair-v2');
  assert.equal(gradeAnswer(genericRepair, 'static <T extends Comparable<T>> T max(T left, T right) { return left.compareTo(right) >= 0 ? left : right; }'), true);
  assert.equal(gradeAnswer(genericRepair, genericRepair.starterCode), false);
  const resourceRepair = getExercise('java-w8-d4-repair');
  assert.equal(gradeAnswer(resourceRepair, 'static String readFirstLine(java.io.BufferedReader reader) throws java.io.IOException { try (java.io.BufferedReader resource = reader) { return resource.readLine(); } }'), true);
  assert.equal(gradeAnswer(resourceRepair, resourceRepair.starterCode), false);
  assert.match(resourceRepair.gradingNote, /실행형 채점은 아니며/);

  assert.equal(getExercise('java-collections-choice'), null);
  assert.equal(getExercise('java-stream-short'), null);
});

test('Java weeks 10 through 12 use complete examples and questions that match each daily topic', () => {
  const expectedResults = [
    ['StreamFilterExample', '[60, 85]'],
    ['StreamMapExample', '[4, 3]'],
    ['StreamFlatMapExample', '[Java, APIs, clean, code]'],
    ['StreamToListExample', '[ANN, BOB]'],
    ['StreamReuseExample', 'count=2, upper=[MINA, JIN]'],
    ['ThreadTaskExample', 'work finished'],
    ['VisibilityExample', 'stopped'],
    ['AtomicCounterExample', '// 2000'],
    ['SynchronizedBlockExample', '// 2000'],
    ['CompletionSignalExample', 'done'],
    ['HeapAndStackExample', 'Java:2'],
    ['AllocationExample', 'points=3'],
    ['WarmupExample', '// 49995000'],
    ['ProfilingExample', '// true'],
    ['PercentileExample', 'p95=19 ms'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 10 && lesson.week <= 12).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, 15);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    if (choice) {
      assert.ok(choice.choices.some((option) => option.id === choice.answer), choice.id);
      assert.ok(choice.choiceExplanations[choice.answer]?.trim(), choice.id);
    }
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    if (short) assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    const locate = day.exercises.find((exercise) => exercise.type === 'locate-error');
    if (locate) {
      assert.ok(locate.answerLines.every((line) => locate.codeLines[line - 1]?.trim()), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
    }
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });

  const filter = getExercise('java-filter-choice-v2');
  assert.match(filter.prompt, /어떤 역할/);
  assert.match(filter.choices.find((option) => option.id === filter.answer).text, /60점 이상/);
  assert.deepEqual(getExercise('java-map-locate-v2').answerLines, [2]);
  assert.equal(gradeAnswer(getExercise('java-flatmap-short-v2'), '[Java, APIs, clean, code]'), true);
  const thread = getExercise('java-thread-choice-v2');
  assert.match(thread.choices.find((option) => option.id === thread.answer).text, /새 스레드/);
  assert.deepEqual(getExercise('java-visibility-locate-v2').answerLines, [2]);
  assert.equal(gradeAnswer(getExercise('java-atomic-short-v2'), 'AtomicInteger'), true);
  const heap = getExercise('java-heap-choice-v2');
  assert.match(heap.choices.find((option) => option.id === heap.answer).text, /힙/);
  assert.deepEqual(getExercise('java-allocation-locate-v2').answerLines, [3]);
  assert.equal(gradeAnswer(getExercise('java-warmup-short-v2'), '워밍업'), true);
  assert.match(days[3].example, /\.toList\(\)/);
});

test('Java weeks 10 through 12 use versioned, topic-specific daily question sets', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 10 && lesson.week <= 12);
  const days = lessons.flatMap((lesson) => lesson.studyDays.map((day) => ({ week: lesson.week, ...day })));

  assert.equal(days.length, 15);
  days.forEach((day) => {
    const prefix = `java-w${day.week}-d${day.number}-`;
    const choice = day.exercises.find((exercise) => [`${prefix}choice-v2`, `${prefix}choice-v3`].includes(exercise.id));
    assert.ok(choice, `${prefix}choice`);
    assert.doesNotMatch(choice.prompt, /상황에서 가장 타당한 선택/);
    assert.equal(Object.values(choice.choiceExplanations).filter((text) => text.trim()).length, 3, choice.id);

    const short = day.exercises.find((exercise) => exercise.id.startsWith(`${prefix}short-v`));
    if (short) {
      assert.ok(short.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), short.id);
      assert.doesNotMatch(short.prompt, /규칙·타입·API·연산/);
      assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    }

    const application = day.exercises.find((exercise) => exercise.id === `${prefix}apply-v3`);
    if (application) {
      assert.doesNotMatch(application.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);
      assert.ok(application.choices.some((option) => option.id === application.answer), application.id);
      assert.ok(application.choiceExplanations[application.answer]?.trim(), application.id);
    }
  });

  assert.match(days[3].example, /Java 16/);
  assert.match(days[5].example, /Java 21/);
});

test('Java weeks 10–12 keep three different checks per day and align repair prompts with their answers', () => {
  const revisedShorts = [
    [10, 1, 3, '[60, 85, 60]', /입력 끝에 60/],
    [10, 3, 3, 'safe, tools', /마지막 입력에/],
    [10, 5, 3, 'count()', /Stream을 소비/],
    [11, 1, 3, 'join', /작업이 끝날 때까지/],
    [11, 2, 3, '원자성', /보장되지 않는 성질/],
    [11, 5, 3, 'countDown', /완료 신호/],
    [12, 1, 3, '참조', /course.*무엇을 가리키나요/],
    [12, 2, 3, '목록의 원소 수', /직접 알려 주는 값/],
    [12, 3, 3, '아니요', /성능 향상을 보장/],
    [12, 5, 3, '19번째', /몇 번째 값을/],
  ];

  for (const [week, dayNumber, version, acceptedAnswer, promptPattern] of revisedShorts) {
    const prefix = `java-w${week}-d${dayNumber}-short`;
    const short = getExercise(`${prefix}-v${version}`);
    assert.ok(short, `${prefix}-v${version}`);
    const previousId = `${prefix}-v${version - 1}`;
    const previousExercise = getExercise(previousId);
    if (short.legacyIds?.includes(previousId)) assert.equal(previousExercise?.id, short.id, `${prefix} saved progress alias`);
    else assert.equal(previousExercise, null, `${prefix} old revision`);
    assert.match(short.prompt, promptPattern, short.id);
    assert.equal(gradeAnswer(short, acceptedAnswer), true, `${short.id} accepts ${acceptedAnswer}`);
  }

  const distinctDays = [
    [10, 1], [10, 3], [10, 5], [11, 1], [11, 2], [11, 5], [12, 1], [12, 2], [12, 3], [12, 5],
  ];
  for (const [week, dayNumber] of distinctDays) {
    const day = javaTrack.lessons.find((lesson) => lesson.week === week).studyDays[dayNumber - 1];
    const prompts = day.exercises.map((exercise) => exercise.prompt.trim());
    assert.equal(new Set(prompts).size, prompts.length, `week ${week}, day ${dayNumber}`);
  }

  const heapDay = javaTrack.lessons.find((lesson) => lesson.week === 12).studyDays[0];
  const heapChoice = heapDay.exercises.find((exercise) => exercise.id === 'java-w12-d1-choice-v3');
  assert.match(heapChoice.prompt, /지역 변수와 호출 상태/);
  assert.match(heapChoice.choices.find((option) => option.id === heapChoice.answer).text, /스택 프레임/);

  const collectRepair = getExercise('java-w10-d4-repair');
  assert.match(collectRepair.prompt, /각 Course에서 name을 읽어 입력 순서/);
  assert.match(collectRepair.explanation, /Java 16부터/);
  const profilingRepair = getExercise('java-w12-d4-repair');
  assert.match(profilingRepair.prompt, /경과한 나노초/);
  assert.match(profilingRepair.explanation, /병목 위치를 찾으려면.*프로파일링/);
});

test('Java weeks 13 through 15 use complete examples and correct file, time, and DTO boundaries', () => {
  const expectedResults = [
    ['PathCreateExample', 'courses.txt'],
    ['TextEncodingExample', '// 첫 강의'],
    ['FileReadExample', '// read=Java'],
    ['FileWriteExample', '// Java NIO'],
    ['FileExistenceExample', 'checked=true, read=missing'],
    ['LocalDateExample', '2026-10-11 -> 2026-10-12'],
    ['LocalDateTimeExample', '2026-10-11T09:00'],
    ['InstantExample', '2026-10-11T00:00:00Z'],
    ['ZoneIdExample', '2026-10-11T00:00:00Z'],
    ['DateCalculationExample', 'due=2026-10-12, days=1'],
    ['IntegerParsingExample', '// invalid integer'],
    ['NullBoundaryExample', '// 제목이 필요합니다'],
    ['InputValidationExample', '// 분은 양수여야 합니다 (입력값: 0)'],
    ['CourseRequestExample', 'CourseRequest[title=Java, minutes=30]'],
    ['ErrorMessageExample', '// 분은 양수여야 합니다 (입력값: -1)'],
  ];
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 13 && lesson.week <= 15);
  const days = lessons.flatMap((lesson) => lesson.studyDays);

  assert.equal(lessons[2].title, '입력 검증과 DTO 경계');
  assert.equal(days.length, expectedResults.length);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    assert.ok(choice.choices.some((option) => option.id === choice.answer), choice.id);
    assert.ok(choice.choiceExplanations[choice.answer]?.trim(), choice.id);
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    if (short) assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });

  const dto = getExercise('java-w15-d4-choice-v3');
  assert.match(dto.choiceExplanations[dto.answer], /JSON 응답으로 바꾸는 일은 별도 도구나 코드/);
  assert.match(dto.choices.find((option) => option.id === dto.answer).text, /강의 제목과 수업 시간\(분\)/);
  assert.equal(getExercise('java-w15-d4-repair'), null);
  const dtoRepair = getExercise('java-w15-d4-repair-v2');
  assert.match(dtoRepair.starterCode, /String title, int minutes/);
  assert.equal(gradeAnswer(dtoRepair, 'static CourseRequest toRequest(String title, int minutes) { return new CourseRequest(title, minutes); }'), true);
  assert.equal(gradeAnswer(dtoRepair, 'static CourseRequest toRequest(String title, int minutes) { return new CourseRequest(title); }'), false);
  assert.equal(dtoRepair.acceptanceCriteria.tests[1].input, 'toRequest("SQL", 20)');

  const answerPositions = days.flatMap((day) => day.exercises.filter((exercise) => exercise.id.endsWith('-apply-v3')))
    .map((exercise) => exercise.choices.findIndex((option) => option.id === exercise.answer));
  assert.equal(answerPositions.length, 15);
  assert.ok(answerPositions.every((position) => position >= 0 && position < 3));
  assert.equal(getExercise('java-w15-d4-apply'), null);
});

test('Java weeks 13 through 15 use three distinct, example-grounded daily questions', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 13 && lesson.week <= 15);
  const choiceAnswerPositions = [];
  const applicationAnswerPositions = [];

  assert.equal(lessons.length, 3);
  lessons.forEach((lesson) => lesson.studyDays.forEach((day) => {
    const prefix = `java-w${lesson.week}-d${day.number}-`;
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    const application = day.exercises.find((exercise) => exercise.id === `${prefix}apply-v3`);
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');

    assert.equal(choice.id, `${prefix}choice-v3`);
    assert.ok(application, `${prefix}apply-v3`);
    assert.equal(getExercise(`${prefix}choice`), null, `${prefix}legacy choice`);
    assert.equal(getExercise(`${prefix}apply-v2`), null, `${prefix}legacy application`);
    assert.equal(day.exercises.length, 3, day.title);

    const prompts = day.exercises.map((exercise) => exercise.prompt.trim());
    assert.equal(new Set(prompts).size, 3, `${day.title} repeats a question`);
    assert.ok(day.example.includes('class '), `${day.title} needs a complete class example`);

    for (const question of [choice, application]) {
      const correctOption = question.choices.find((option) => option.id === question.answer);
      assert.ok(correctOption, question.id);
      assert.equal(gradeAnswer(question, question.answer), true, question.id);
      assert.ok(question.choiceExplanations[question.answer]?.trim(), question.id);
      question.choices.filter((option) => option.id !== question.answer).forEach((option) => {
        assert.equal(gradeAnswer(question, option.id), false, `${question.id}/${option.id}`);
        assert.ok(question.choiceExplanations[option.id]?.trim(), `${question.id}/${option.id}`);
      });
    }

    choiceAnswerPositions.push(choice.choices.findIndex((option) => option.id === choice.answer));
    applicationAnswerPositions.push(application.choices.findIndex((option) => option.id === application.answer));

    if (short) {
      assertExerciseIdOrLegacy(short, `${prefix}short-v2`);
      assert.doesNotMatch(short.prompt, /규칙·타입·API·연산/, short.id);
      short.acceptedAnswers.forEach((answer) => assert.equal(gradeAnswer(short, answer), true, `${short.id}/${answer}`));
    } else {
      assert.ok(repair, `${day.title} needs either a short answer or repair exercise`);
    }
  }));

  for (const positions of [choiceAnswerPositions, applicationAnswerPositions]) {
    assert.equal(positions.length, 15);
    assert.deepEqual([...new Set(positions)].sort(), [0, 1, 2]);
  }

  const writeRepair = getExercise('java-w13-d4-repair');
  assert.match(writeRepair.prompt, /UTF-8로 기록하고 사용한 Path를 반환/);
  assert.deepEqual(writeRepair.acceptanceCriteria.tests.map(({ expected }) => expected), [
    'file contains Java NIO and the same path is returned',
    'file is empty and the same path is returned',
  ]);

  const zoneRepair = getExercise('java-w14-d4-repair');
  assert.match(zoneRepair.prompt, /지정한 지역 시간대 규칙/);
  assert.deepEqual(zoneRepair.acceptanceCriteria.tests.map(({ expected }) => expected), [
    '2026-10-11T00:00:00Z',
    '2026-10-11T16:00:00Z',
  ]);
});

test('Java weeks 16 through 18 use complete examples for networking, tests, and design contracts', () => {
  const expectedResults = [
    ['UriRequestExample', '/courses?language=java'],
    ['HttpMethodExample', '// GET'],
    ['StatusCodeExample', 'status=204, success=true'],
    ['RequestTimeoutExample', 'timeout=PT2S, method=GET'],
    ['ResponseBodyExample', 'body=Java'],
    ['ArrangeActAssertExample', 'passed: add'],
    ['BoundaryTestExample', 'empty sum=0'],
    ['ExceptionAssertionExample', 'passed: invalid input throws'],
    ['TestNameExample', 'passed: emptyList_returnsZero'],
    ['IndependentTestsExample', 'first=1, second=0'],
    ['SingleResponsibilityExample', '// Java'],
    ['DependencyInversionExample', '// Java'],
    ['CompositionExample', 'Report: Java'],
    ['ExplicitContractExample', 'missing=false'],
    ['ChangeImpactExample', 'found=true, title=Java'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 16 && lesson.week <= 18).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, expectedResults.length);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    assert.ok(choice.choices.some((option) => option.id === choice.answer), choice.id);
    assert.ok(choice.choiceExplanations[choice.answer]?.trim(), choice.id);
    const apply = day.exercises.find((exercise) => exercise.id.endsWith('-apply-v3'));
    assert.ok(apply, `${day.title} must use the revised applied question`);
    assert.doesNotMatch(apply.prompt, /```|\n\s*`/);
    assert.ok(apply.choices.find((option) => option.id === apply.answer)?.text.length > 12, apply.id);
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    if (short) assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });

  const timeoutRepair = getExercise('java-w16-d4-repair-v2');
  assert.equal(getExercise('java-w16-d4-repair'), null);
  assert.match(timeoutRepair.starterCode, /java.net.URI uri/);
  assert.equal(gradeAnswer(timeoutRepair, 'static java.net.http.HttpRequest timeoutRequest(java.net.URI uri) { return java.net.http.HttpRequest.newBuilder(uri).timeout(java.time.Duration.ofSeconds(2)).GET().build(); }'), true);
  assert.equal(gradeAnswer(timeoutRepair, 'static java.net.http.HttpRequest timeoutRequest(java.net.URI uri) { return java.net.http.HttpClient.newBuilder().connectTimeout(java.time.Duration.ofSeconds(3)).build(); }'), false);

  const testRepair = getExercise('java-w17-d4-repair-v2');
  assert.equal(getExercise('java-w17-d4-repair'), null);
  assert.match(testRepair.prompt, /비어 있는 목록의 합이 0/);
  assert.equal(gradeAnswer(testRepair, 'static void emptyList_returnsZero() { assertEquals(0, sum(java.util.Collections.<Integer>emptyList())); }'), true);
  assert.equal(gradeAnswer(testRepair, 'static String testName() { return "returns_empty_when_courses_are_missing"; }'), false);

  for (const lesson of javaTrack.lessons.filter((item) => item.week >= 25)) {
    for (const day of lesson.studyDays) {
      assert.ok(day.exercises.some((exercise) => exercise.id.endsWith('-apply-v2')), `missing revised application question: ${day.title}`);
    }
  }
});

test('Java weeks 16 through 18 use distinct, example-grounded questions and honest framework boundaries', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 16 && lesson.week <= 18);
  const days = lessons.flatMap((lesson) => lesson.studyDays);
  const choicePositions = [];
  const applicationPositions = [];

  assert.equal(days.length, 15);
  assert.match(lessons.find((lesson) => lesson.week === 17).intro, /JUnit.*아니라|실제.*테스트 프레임워크/);

  days.forEach((day) => {
    const week = lessons.find((lesson) => lesson.studyDays.includes(day)).week;
    const prefix = `java-w${week}-d${day.number}-`;
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    const application = day.exercises.find((exercise) => exercise.id === `${prefix}apply-v3`);
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');

    assert.equal(choice.id, `${prefix}choice-v3`);
    assert.ok(application, `${prefix}apply-v3`);
    assert.equal(getExercise(`${prefix}choice`), null, `${prefix}legacy choice`);
    assert.equal(getExercise(`${prefix}apply-v2`), null, `${prefix}legacy application`);
    assert.equal(day.exercises.length, 3, day.title);
    assert.equal(new Set(day.exercises.map((exercise) => exercise.prompt.trim())).size, 3, `${day.title} repeats a prompt`);
    assert.notEqual(choice.choices.find((option) => option.id === choice.answer).text, application.choices.find((option) => option.id === application.answer).text, `${day.title} repeats the same answer`);
    assert.doesNotMatch(choice.prompt, /상황에서 가장 타당한 선택/);
    assert.doesNotMatch(application.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);

    for (const question of [choice, application]) {
      assert.equal(gradeAnswer(question, question.answer), true, question.id);
      question.choices.filter((option) => option.id !== question.answer).forEach((option) => {
        assert.equal(gradeAnswer(question, option.id), false, `${question.id}/${option.id}`);
      });
      question.choices.forEach((option) => assert.ok(question.choiceExplanations[option.id]?.trim(), `${question.id}/${option.id}`));
    }

    choicePositions.push(choice.choices.findIndex((option) => option.id === choice.answer));
    applicationPositions.push(application.choices.findIndex((option) => option.id === application.answer));

    if (short) {
      assertExerciseIdOrLegacy(short, `${prefix}short-v2`);
      assert.doesNotMatch(short.prompt, /규칙·타입·API·연산/);
      short.acceptedAnswers.forEach((answer) => assert.equal(gradeAnswer(short, answer), true, `${short.id}/${answer}`));
    } else {
      assert.ok(repair, `${day.title} needs a repair question`);
    }
  });

  for (const positions of [choicePositions, applicationPositions]) {
    assert.equal(positions.length, 15);
    assert.deepEqual([...new Set(positions)].sort(), [0, 1, 2]);
  }

  const networkDays = lessons.find((lesson) => lesson.week === 16).studyDays;
  assert.match(networkDays[0].exercises[0].prompt, /URI\.create|요청/);
  assert.match(networkDays[4].intro, /실제 서버|실제 HTTP/);

  const optionalRepair = getExercise('java-w18-d4-repair');
  assert.match(optionalRepair.prompt, /Optional\.of.*Optional\.empty/);
  assert.deepEqual(optionalRepair.acceptanceCriteria.tests.map(({ expected }) => expected), ['Optional.empty', 'Optional.of(course)']);
  assert.equal(gradeAnswer(optionalRepair, 'static java.util.Optional<Course> find(java.util.Map<String, Course> courses, String id) { return java.util.Optional.ofNullable(courses.get(id)); }'), true);
  assert.equal(gradeAnswer(optionalRepair, 'static java.util.Optional<Course> find(java.util.Map<String, Course> courses, String id) { return java.util.Optional.of(courses.get(id)); }'), false);
  const designDays = lessons.find((lesson) => lesson.week === 18).studyDays;
  assert.match(designDays[1].example, /courses\.get\(id\)/);
  assert.match(designDays[1].example, /Optional\.ofNullable/);
  assert.match(designDays[1].example, /orElse\("\(missing\)"\)/);
  assert.match(designDays[4].example, /Optional\.ofNullable\(courses\.get\(id\)\)/);
  assert.doesNotMatch(designDays[4].example, /course\.get\(\)\.title\(\)/);
  assert.match(designDays[4].example, /course\.map\(Course::title\)\.orElse/);
  assert.match(designDays[4].example, /findById\("sql"\)/);
});

test('Java weeks 19 through 21 use complete examples and safe logging/refactoring evidence', () => {
  const expectedResults = [
    ['EqualsMeaningExample', 'same=true'],
    ['HashCodeContractExample', 'title=Java'],
    ['RecordValueExample', 'id=java'],
    ['DefensiveCopyExample', 'tags=[backend]'],
    ['StableMapKeyExample', 'title=Java'],
    ['LogLevelExample', 'info=true, fine=false'],
    ['LogContextExample', 'context.put("courseId", "java")'],
    ['LogExceptionExample', 'setThrown'],
    ['SensitiveLogExample', 'token=***'],
    ['MeasuredEventExample', 'value=250, unit=ms'],
    ['CodeSmellExample', 'eligible=true, canEnroll=true'],
    ['MeaningfulNameExample', 'completed=3'],
    ['ExtractConditionExample', 'isAdult=true'],
    ['RemoveDuplicationExample', 'canCreate=true, canExtend=false'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 19 && lesson.week <= 21).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, 15);
  days.slice(0, 14).forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const apply = day.exercises.find((exercise) => exercise.id.endsWith('-apply-v3'));
    assert.ok(apply, `${day.title} must use the revised applied question`);
    assert.doesNotMatch(apply.prompt, /```|\n\s*`/);
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });

  const gitDay = days[14];
  assert.equal(gitDay.exampleLanguage, 'Git');
  assert.match(gitDay.example, /^git add[\s\S]*git diff --cached[\s\S]*git commit/);
  assert.equal(getExercise('java-w20-d4-repair'), null);
  const safeRedaction = getExercise('java-w20-d4-repair-v2');
  assert.match(safeRedaction.starterCode, /String token/);
  assert.equal(gradeAnswer(safeRedaction, 'static String redact(String token) { return token == null || token.isEmpty() ? "(missing)" : "***"; }'), true);
  assert.equal(gradeAnswer(safeRedaction, 'static String redact(String label) { return label.replace("token", "***"); }'), false);
});

test('Java weeks 19 through 21 ask distinct questions grounded in equality, logging, and refactoring examples', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 19 && lesson.week <= 21);
  const days = lessons.flatMap((lesson) => lesson.studyDays);
  const choicePositions = [];
  const applicationPositions = [];

  assert.equal(days.length, 15);
  days.forEach((day) => {
    const week = lessons.find((lesson) => lesson.studyDays.includes(day)).week;
    const prefix = `java-w${week}-d${day.number}-`;
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    const application = day.exercises.find((exercise) => exercise.id === `${prefix}apply-v3`);
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');

    assert.equal(choice.id, `${prefix}choice-v3`);
    assert.ok(application, `${prefix}apply-v3`);
    assert.equal(getExercise(`${prefix}choice`), null, `${prefix}legacy choice`);
    assert.equal(getExercise(`${prefix}apply-v2`), null, `${prefix}legacy application`);
    assert.equal(new Set(day.exercises.map((exercise) => exercise.prompt.trim())).size, 3, `${day.title} repeats a prompt`);
    assert.notEqual(choice.choices.find((option) => option.id === choice.answer).text, application.choices.find((option) => option.id === application.answer).text, `${day.title} repeats the same answer`);
    assert.doesNotMatch(choice.prompt, /상황에서 가장 타당한 선택/);
    assert.doesNotMatch(application.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);

    for (const question of [choice, application]) {
      assert.equal(gradeAnswer(question, question.answer), true, question.id);
      question.choices.filter((option) => option.id !== question.answer).forEach((option) => {
        assert.equal(gradeAnswer(question, option.id), false, `${question.id}/${option.id}`);
      });
      question.choices.forEach((option) => assert.ok(question.choiceExplanations[option.id]?.trim(), `${question.id}/${option.id}`));
    }

    choicePositions.push(choice.choices.findIndex((option) => option.id === choice.answer));
    applicationPositions.push(application.choices.findIndex((option) => option.id === application.answer));

    if (short) {
      assertExerciseIdOrLegacy(short, `${prefix}short-v2`);
      assert.doesNotMatch(short.prompt, /규칙·타입·API·연산/);
      short.acceptedAnswers.forEach((answer) => assert.equal(gradeAnswer(short, answer), true, `${short.id}/${answer}`));
    } else {
      assert.ok(repair, `${day.title} needs a repair question`);
    }
  });

  for (const positions of [choicePositions, applicationPositions]) {
    assert.equal(positions.length, 15);
    assert.deepEqual([...new Set(positions)].sort(), [0, 1, 2]);
  }

  const lessonsByWeek = Object.fromEntries(lessons.map((lesson) => [lesson.week, lesson]));
  assert.match(lessonsByWeek[19].studyDays[3].intro, /얕은 복사|깊게 복사/);
  assert.match(lessonsByWeek[20].studyDays[1].intro, /실제 Logger|실제 로그/);
  assert.match(lessonsByWeek[20].studyDays[2].intro, /전송되지|전송되지는/);
  assert.match(lessonsByWeek[20].studyDays[4].intro, /고정된 학습용 값/);
  assert.match(lessonsByWeek[21].studyDays[4].intro, /실제 저장소에서.*실행/);

  const defensiveCopyRepair = getExercise('java-w19-d4-repair');
  assert.match(defensiveCopyRepair.prompt, /List\.copyOf/);
  assert.match(defensiveCopyRepair.prompt, /항목을 추가할 수 없어야/);
  assert.deepEqual(defensiveCopyRepair.acceptanceCriteria.tests.map(({ expected }) => expected), [
    'values() still contains backend',
    'UnsupportedOperationException',
  ]);

  const duplicationRepair = getExercise('java-w21-d4-repair');
  assert.match(duplicationRepair.prompt, /isValidMinutes/);
  assert.match(duplicationRepair.prompt, /0보다 클 때만 true/);
  assert.deepEqual(duplicationRepair.acceptanceCriteria.tests.map(({ expected }) => expected), ['true', 'false']);
  assert.match(lessonsByWeek[21].studyDays[3].example, /canCreateCourse\(int minutes\)/);
  assert.match(lessonsByWeek[21].studyDays[3].example, /canExtendCourse\(int minutes\)/);
  assert.match(lessonsByWeek[21].studyDays[3].example, /return isValidMinutes\(minutes\)/);
});

test('Java weeks 22 through 24 use complete collection, search, and recursion examples', () => {
  const expectedResults = [
    ['ArrayAndListExample', 'arrayLength=2, listSize=3'],
    ['StackAndQueueExample', 'stack=second, queue=first'],
    ['HashMapLookupExample', 'java=2, keys=2'],
    ['SortedDataExample', 'scores=[3, 5, 8], position=1'],
    ['ComplexityComparisonExample', 'linearChecks=7, binaryChecks=3'],
    ['LinearSearchExample', 'contains7=true, contains5=false'],
    ['BinarySearchPreconditionExample', 'found=true, index=2'],
    ['ComparatorSortExample', '[Algorithms, Java]'],
    ['DuplicateSearchExample', 'found=true'],
    ['HalfOpenRangeExample', 'selected=[1, 2, 3]'],
    ['RecursionBaseCaseExample', 'factorial(5)=120'],
    ['RecursiveCallExample', 'sumTo(5)=15'],
    ['RecursionDepthExample', 'depth=5'],
    ['DivideAndConquerExample', 'index=3'],
    ['IterativeFactorialExample', 'factorial(5)=120'],
  ];
  const days = javaTrack.lessons.filter((lesson) => lesson.week >= 22 && lesson.week <= 24).flatMap((lesson) => lesson.studyDays);

  assert.equal(days.length, expectedResults.length);
  days.forEach((day, index) => {
    const [className, expectedResult] = expectedResults[index];
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(day.example.includes(expectedResult), day.title);
    const choice = day.exercises.find((exercise) => exercise.type === 'choice');
    assert.ok(choice.choices.some((option) => option.id === choice.answer), choice.id);
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');
    if (repair) assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
  });
});

test('Java weeks 22 through 24 ask distinct questions about the examples and cover error boundaries', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 22 && lesson.week <= 24);
  const days = lessons.flatMap((lesson) => lesson.studyDays);
  const answerPositions = [];

  assert.equal(days.length, 15);
  days.forEach((day) => {
    const week = lessons.find((lesson) => lesson.studyDays.includes(day)).week;
    const prefix = `java-w${week}-d${day.number}-`;
    const concept = day.exercises.find((exercise) => exercise.type === 'choice');
    const application = day.exercises.find((exercise) => exercise.id === `${prefix}apply-v3`);
    const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
    const repair = day.exercises.find((exercise) => exercise.type === 'repair-code');

    assert.equal(concept.id, `${prefix}choice-v3`);
    assert.ok(application, `${prefix}apply-v3`);
    assert.doesNotMatch(concept.prompt, /상황에서 가장 타당한 선택/);
    assert.doesNotMatch(application.prompt, /오늘의 .* 예제를 다른 입력이나 호출자에 적용/);
    assert.equal(new Set(day.exercises.map((exercise) => exercise.prompt.trim())).size, 3, day.title);
    assert.notEqual(
      concept.choices.find((option) => option.id === concept.answer).text,
      application.choices.find((option) => option.id === application.answer).text,
      `${day.title} repeats the same answer`,
    );

    for (const question of [concept, application]) {
      assert.equal(gradeAnswer(question, question.answer), true, question.id);
      question.choices.filter((option) => option.id !== question.answer).forEach((option) => {
        assert.equal(gradeAnswer(question, option.id), false, `${question.id}/${option.id}`);
      });
      question.choices.forEach((option) => assert.ok(question.choiceExplanations[option.id]?.trim(), `${question.id}/${option.id}`));
    }
    answerPositions.push(concept.choices.findIndex((option) => option.id === concept.answer));

    if (short) {
      assertExerciseIdOrLegacy(short, `${prefix}short-v2`);
      assert.doesNotMatch(short.prompt, /규칙·타입·API·연산/);
      short.acceptedAnswers.forEach((answer) => assert.equal(gradeAnswer(short, answer), true, `${short.id}/${answer}`));
    } else {
      assert.ok(repair, `${day.title} needs a repair question`);
    }
  });

  assert.deepEqual([...new Set(answerPositions)].sort(), [0, 1, 2]);

  const byWeek = Object.fromEntries(lessons.map((lesson) => [lesson.week, lesson]));
  assert.match(byWeek[22].studyDays[3].exercises.find((exercise) => exercise.type === 'repair-code').prompt, /오름차순/);
  assert.match(byWeek[23].studyDays[3].intro, /첫 위치를 찾는 것은 별도 요구/);
  assert.match(byWeek[24].studyDays[3].exercises.find((exercise) => exercise.type === 'repair-code').prompt, /int 범위/);
  assert.match(byWeek[24].studyDays[0].example, /Math\.multiplyExact/);
  assert.match(byWeek[24].studyDays[1].example, /n < 0.*IllegalArgumentException/s);
  assert.match(byWeek[24].studyDays[2].example, /remaining < 0.*IllegalArgumentException/s);
  assert.match(byWeek[24].studyDays[4].example, /Math\.multiplyExact/);

  const sortedSearchRepair = getExercise('java-w22-d4-repair');
  assert.deepEqual(sortedSearchRepair.acceptanceCriteria.tests.map(({ expected }) => expected), ['2', '-3 (삽입 위치 2)']);
  assert.equal(gradeAnswer(sortedSearchRepair, 'static int findSorted(java.util.List<Integer> values, int target) { return java.util.Collections.binarySearch(values, target); }'), true);

  const duplicateRepair = getExercise('java-w23-d4-repair');
  assert.deepEqual(duplicateRepair.acceptanceCriteria.tests.map(({ expected }) => expected), ['true', 'false']);
  assert.equal(gradeAnswer(duplicateRepair, 'static boolean hasDuplicate(java.util.List<Integer> values) { return new java.util.HashSet<>(values).size() != values.size(); }'), true);

  const mergeRepair = getExercise('java-w24-d4-repair-v2');
  assert.equal(getExercise('java-w24-d4-repair'), null);
  assert.deepEqual(mergeRepair.acceptanceCriteria.tests.map(({ expected }) => expected), ['11', '0', 'ArithmeticException']);
  assert.equal(gradeAnswer(mergeRepair, 'static int mergeCount(int leftCount, int rightCount) { return Math.addExact(leftCount, rightCount); }'), true);
  assert.equal(gradeAnswer(mergeRepair, 'static int mergeCount(int leftCount, int rightCount) { return leftCount + rightCount; }'), false);
});

test('Java weeks 25 and 26 use clear Korean prompts, hints, and answer explanations', () => {
  const lessons = javaTrack.lessons.filter((lesson) => lesson.week >= 25);
  const expectedObjectives = [
    ['요구를 입력·규칙·출력으로 나누어', '사용자와 개발자가 함께 쓰는 도메인 용어를', '메서드의 입력·반환값·실패 조건을', '잘못된 입력을 어떤 결과나 예외로', '정상·경계·실패 입력과 각 기대 결과를'],
    ['입력 목록에서 조건과 연산을 거쳐', '같은 입력으로 문제를 재현하고', '자료 구조나 구현 방식을 요구와 비용에 따라', '성능 가설을 지표와 측정 조건으로', '틀린 문제와 막힌 이유를 돌아보고'],
  ];

  assert.equal(lessons.length, 2);
  lessons.forEach((lesson, lessonIndex) => {
    assert.doesNotMatch(lesson.intro, /는 실제 프로그램의 입력·상태·출력 사이에 생기는 경계/);
    assert.doesNotMatch(lesson.intro, /는 실제/);
    lesson.studyDays.forEach((day, dayIndex) => {
      assert.ok(day.objective.startsWith(expectedObjectives[lessonIndex][dayIndex]), `${lesson.week}-${day.number}: ${day.objective}`);
      assert.doesNotMatch(day.objective, /목적과 경계를 설명해요/);
      const choice = day.exercises.find((exercise) => exercise.type === 'choice');

      assert.doesNotMatch(choice.prompt, /상황에서 가장 타당한 선택/);
      assert.ok(choice.hint.length >= 20, choice.id);
      assert.doesNotMatch(choice.hint, /값의 성격, 실패 가능성, 또는 계약을 먼저 확인/);
      assert.doesNotMatch(choice.explanation, /이 근거를 예제의 타입·메서드·비교식과 연결/);
      assert.ok(choice.choices.every((option) => choice.choiceExplanations[option.id]?.length > 15), choice.id);

      const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
      if (short) {
        assert.match(short.prompt, /한글 또는 영어로 적으세요/);
        assert.match(short.explanation, /[가-힣]/);
        assert.ok(short.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), short.id);
        short.acceptedAnswers.forEach((answer) => assert.equal(gradeAnswer(short, answer), true, `${short.id}/${answer}`));
      }
    });
  });
});
