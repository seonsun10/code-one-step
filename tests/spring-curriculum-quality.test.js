import test from 'node:test';
import assert from 'node:assert/strict';
import { getExercise, getLesson, getTrack } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

test('Spring Boot weeks 1 through 3 explain each day without repeated setup copy', () => {
  const evidence = {
    1: [/`final` 필드/, /필수 협력 객체/, /@Service/, /singleton/, /가짜 구현/],
    2: [/요청과 응답/, /업무 규칙/, /existsByTitle/, /요청 DTO/, /실패/],
    3: [/DB_PASSWORD/, /spring\.config\.activate\.on-profile/, /비밀값/, /@ConfigurationPropertiesScan/, /@Validated.*Validation/],
  };

  for (const [weekText, markers] of Object.entries(evidence)) {
    const lesson = getLesson(['spring-injection', 'spring-service', 'spring-config-profiles'][Number(weekText) - 1]);
    assert.ok(lesson, `week ${weekText}`);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.intro)).size, 5, lesson.id);

    lesson.studyDays.forEach((day, index) => {
      assert.ok(day.intro.length > 35, `${weekText}/${day.number}`);
      assert.match(day.intro, markers[index], `${weekText}/${day.number}`);
      assert.doesNotMatch(day.intro, /오늘의 주제는|실행 앱이 아니라 개념을 설명하는 Spring 스니펫/, `${weekText}/${day.number}`);
    });
  }

  const spring = getTrack('spring');
  assert.equal(spring.contentReview.version, 'Spring Boot 4.1.2');
  assert.equal(spring.contentReview.reviewedAt, '2026-11-02');
  assert.match(spring.contentReview.versionContext, /4\.2\.0-RC1.*(시험판|정식 배포 전)/);
  assert.match(spring.contentReview.versionContext, /Framework 7\.0\.10/);
});

test('Spring Java identifiers preserve case and map earlier saved question IDs', () => {
  const track = getTrack('spring');
  const questions = track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer' && exercise.answerNormalization === 'case-sensitive');
  assert.equal(questions.length, 34);

  for (const exercise of questions) {
    assert.ok(exercise.legacyIds?.length, exercise.id);
    for (const legacyId of exercise.legacyIds) assert.equal(getExercise(legacyId), exercise, legacyId);
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const wrongCase = answer.toLocaleLowerCase('ko-KR');
      if (wrongCase !== answer) assert.equal(gradeAnswer(exercise, wrongCase), false, `${exercise.id}: ${wrongCase}`);
    }
  }
});

test('Spring foundation weeks 1 through 5 use distinct day examples and specific answer guidance', () => {
  const tracks = {
    1: { lessonId: 'spring-injection', marker: ['CourseRepository', 'final', '@Service', 'lastCourseId', 'mock'] },
    2: { lessonId: 'spring-service', marker: ['@RestController', 'existsByTitle', 'JpaRepository', 'CourseRequest', '@RestControllerAdvice'] },
    3: { lessonId: 'spring-config-profiles', marker: ['DB_PASSWORD', 'spring.config.activate.on-profile', 'password', '@ConfigurationProperties', '@Min(1)'] },
    4: { lessonId: 'spring-controller', marker: ['@GetMapping', '@RequestBody', '@PathVariable', '201', 'notFound'] },
    5: { lessonId: 'spring-validation', marker: ['@NotBlank', '@Valid', 'getFieldErrors', 'request.clientSaysValid', 'badRequest'] },
  };

  for (const [weekText, expected] of Object.entries(tracks)) {
    const week = Number(weekText);
    const lesson = getLesson(expected.lessonId);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);

    for (let day = 1; day <= 5; day += 1) {
      const base = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const session = lesson.studyDays[day - 1];
      const choice = session.exercises.find((exercise) => exercise.type === 'choice' && exercise.id.startsWith(`${base}-choice`));
      const short = session.exercises.find((exercise) => exercise.type === 'short-answer' && exercise.id.startsWith(`${base}-short`));
      const located = getExercise(`${base}-locate`);
      assert.equal(session.exercises.length, 3, `${base} daily question count`);
      assert.ok(session.example.includes(expected.marker[day - 1]), `${base} daily example`);
      assert.ok(choice.prompt.includes(expected.marker[day - 1]), `${choice.id} scenario`);
      assert.ok(choice.choiceExplanations[choice.answer].length > 25, `${choice.id} correct feedback`);
      for (const option of choice.choices.filter((item) => item.id !== choice.answer)) {
        const explanation = choice.choiceExplanations[option.id];
        assert.ok(explanation.length > 25, `${choice.id}/${option.id} feedback`);
        assert.match(explanation, /[가-힣]/, `${choice.id}/${option.id} Korean feedback`);
      }
      assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
      assert.ok(short.acceptedAnswers.length > 0, short.id);
      assert.match(short.explanation, /[가-힣]/, short.id);
      if (located) {
        assert.equal(located.answerLines.length, 1, located.id);
        assert.ok(located.codeLines[located.answerLines[0] - 1].trim(), located.id);
        assert.match(located.explanation, /[가-힣]/, located.id);
      }
    }
  }
});

test('Spring W3 D1 password placeholder explanation answers the question asked', () => {
  const exercise = getExercise('spring-w03-d1-short');
  assert.match(exercise.prompt, /비밀번호 설정/);
  assert.ok(exercise.acceptedAnswers.includes('DB_PASSWORD'));
  assert.match(exercise.explanation, /DB_PASSWORD/);
  assert.match(exercise.explanation, /비밀번호|비밀값/);
  assert.doesNotMatch(exercise.explanation, /spring\.datasource\.url.*SPRING_DATASOURCE_URL/);
  assert.equal(gradeAnswer(exercise, 'DB_PASSWORD'), true);

  const profileExercise = getExercise('spring-w03-d2-short');
  assert.ok(profileExercise.acceptedAnswers.includes('prod'));
  assert.match(profileExercise.prompt, /어떤 프로파일이 활성화됐을 때/);
  assert.match(profileExercise.explanation, /그 자체로 프로파일을 활성화하지 않아요/);
  assert.equal(gradeAnswer(profileExercise, 'prod'), true);
});

test('Spring W5 D3 maps binding field errors into a safe public response', () => {
  const lesson = getLesson('spring-validation');
  const day = lesson.studyDays[2];
  const choice = getExercise('spring-w05-d3-choice');
  const short = getExercise('spring-w05-d3-short');

  assert.match(day.example, /exception\.getBindingResult\(\)\.getFieldErrors\(\)/);
  assert.match(day.example, /record (?:Public)?FieldIssue\(String field, String message\)/);
  assert.match(day.example, /error\.getField\(\)/);
  assert.match(day.example, /입력값을 확인해 주세요/);
  assert.doesNotMatch(day.example, /getRejectedValue|getCodes|getArguments|body\(Map\.of\("errors",\s*errors\.getFieldErrors\(\)\)\)/);
  assert.match(choice.prompt, /FieldError|필드 오류/);
  assert.match(choice.prompt, /exception\.getBindingResult\(\)\.getFieldErrors\(\)/);
  assert.match(choice.prompt, /PublicFieldIssue/);
  assert.match(choice.choiceExplanations[choice.answer], /FieldError|오류 객체/);
  assert.equal(gradeAnswer(choice, choice.answer), true);
  assert.match(short.prompt, /BindingResult/);
  assert.ok(short.acceptedAnswers.includes('getFieldErrors()'));
  assert.equal(gradeAnswer(short, 'getFieldErrors()'), true);
  assert.match(short.explanation, /rejectedValue|거부 값|입력값/);
});

test('Spring equivalent short answers and validation questions match their examples', () => {
  const substitute = getExercise('spring-w01-d5-short');
  assert.ok(substitute.acceptedAnswers.includes('fake'));
  assert.ok(substitute.acceptedAnswers.includes('가짜 객체'));
  assert.equal(gradeAnswer(substitute, 'fake'), true);
  assert.equal(gradeAnswer(substitute, '가짜 객체'), true);

  const validationChoice = getExercise('spring-w03-d5-choice');
  const validationShort = getExercise('spring-w03-d5-short');
  assert.match(validationChoice.prompt, /`course\.max-size` 값을 `-1`로 바꾸어/);
  assert.match(validationShort.prompt, /`course\.max-size`를 `-1`로 바꿨을 때/);
});

test('Spring W12 D5 keeps the trace ID separate from the public error message', () => {
  const lesson = getLesson('spring-api-operations-capstone');
  const day = lesson.studyDays[4];
  const expectedShape = /record ApiError\(String code, String message, String traceId\)/;

  assert.match(day.example, expectedShape);
  assert.match(day.example, /new ApiError\("INTERNAL_ERROR", "요청을 처리하지 못했습니다\.", traceId\)/);

  for (const exercise of day.exercises) {
    const snippet = exercise.type === 'locate-error' ? exercise.codeLines.join('\n') : exercise.prompt;
    assert.match(snippet, expectedShape, exercise.id);
    assert.match(snippet, /new ApiError\("INTERNAL_ERROR", "요청을 처리하지 못했습니다\.", traceId\)/, exercise.id);
  }
});

test('G10 Spring Boot units 1 through 3 keep every original question on its intended day with the correct answer', () => {
  const spring = getTrack('spring');
  assert.equal(spring.contentReview.version, 'Spring Boot 4.1.2');
  assert.equal(spring.contentReview.reviewedAt, '2026-11-02');

  const originals = [
    {
      lessonId: 'spring-injection',
      days: [
        { id: 'spring-injection-choice', type: 'choice', expected: /필수 의존성이 생성 시점에 드러나고 테스트 대체가 쉬워진다/ },
        { id: 'spring-injection-why-choice', type: 'choice', expected: /필수 저장소를 생성자 매개변수로 받는다/ },
        { id: 'spring-injection-locate', type: 'locate-error', expected: /new JdbcCourseRepository/ },
      ],
    },
    {
      lessonId: 'spring-service',
      days: [
        { id: 'spring-service-choice', type: 'choice', expected: /^Controller$/ },
        { id: 'spring-service-boundary-choice', type: 'choice', expected: /^서비스$/ },
        { id: 'spring-service-short', type: 'short-answer', expected: '의존성' },
      ],
    },
    {
      lessonId: 'spring-config-profiles',
      days: [
        { id: 'spring-config-choice', type: 'choice', expected: /환경 변수나 배포 환경의 비밀 설정으로 주입한다/ },
        { id: 'spring-config-short', type: 'short-answer', expected: '환경' },
        { id: 'spring-config-locate', type: 'locate-error', expected: /spring\.datasource\.password=/ },
      ],
    },
  ];

  for (const { lessonId, days } of originals) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);

    for (const [index, expected] of days.entries()) {
      const day = index + 1;
      const matches = lesson.exercises.filter((exercise) => exercise.id === expected.id);
      assert.equal(matches.length, 1, `${expected.id} must appear exactly once`);
      const exercise = matches[0];
      assert.equal(exercise.studyDay, day, `${expected.id} study day`);
      assert.equal(exercise.type, expected.type, `${expected.id} question type`);
      assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === expected.id), `${expected.id} visible daily route`);

      if (expected.type === 'choice') {
        const correct = exercise.choices.find((option) => option.id === exercise.answer);
        assert.ok(correct, `${expected.id} answer ID resolves to a choice`);
        assert.match(correct.text, expected.expected, `${expected.id} answer meaning`);
        assert.ok(exercise.choiceExplanations[exercise.answer].length > 25, `${expected.id} correct-answer explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answer), true, `${expected.id} grading`);
      } else if (expected.type === 'short-answer') {
        assert.ok(exercise.acceptedAnswers.includes(expected.expected), `${expected.id} accepted answer`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} explanation`);
        assert.equal(gradeAnswer(exercise, expected.expected), true, `${expected.id} grading`);
      } else {
        assert.equal(exercise.answerLines.length, 1, `${expected.id} unique faulty line`);
        assert.match(exercise.codeLines[exercise.answerLines[0] - 1], expected.expected, `${expected.id} faulty code`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} correction explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true, `${expected.id} grading`);
      }
    }
  }
});

test('G10 Spring Boot units 4 through 6 align original questions with HTTP, validation, and error-response examples', () => {
  const originals = [
    {
      lessonId: 'spring-controller',
      days: [
        { id: 'spring-controller-choice', type: 'choice', expected: /@GetMapping\("\/courses"\)/ },
        { id: 'spring-controller-role-choice', type: 'choice', expected: /요청을 받고 입력을 전달한 뒤 응답을 만든다/ },
        { id: 'spring-controller-locate-v2', type: 'locate-error', expected: /CourseView find\(long id\)/, absent: /@PathVariable/ },
      ],
    },
    {
      lessonId: 'spring-validation',
      days: [
        { id: 'spring-validation-choice', type: 'choice', expected: /@RequestBody와 @Valid/ },
        { id: 'spring-validation-server-choice', type: 'choice', expected: /브라우저 밖에서 직접 만든 요청도 도착할 수 있다/ },
        { id: 'spring-validation-short', type: 'short-answer', expected: '검증 제공자' },
      ],
    },
    {
      lessonId: 'spring-rest-errors',
      days: [
        { id: 'spring-errors-choice', type: 'choice', expected: /4xx 클라이언트 요청 오류/ },
        { id: 'spring-errors-short-v2', type: 'short-answer', expected: '요청한 리소스가 존재하지 않음' },
        { id: 'spring-errors-locate', type: 'locate-error', expected: /ResponseEntity\.ok/ },
      ],
    },
  ];

  for (const { lessonId, days } of originals) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);

    for (const [index, expected] of days.entries()) {
      const day = index + 1;
      const matches = lesson.exercises.filter((exercise) => exercise.id === expected.id);
      assert.equal(matches.length, 1, `${expected.id} must appear exactly once`);
      const exercise = matches[0];
      assert.equal(exercise.studyDay, day, `${expected.id} study day`);
      assert.equal(exercise.type, expected.type, `${expected.id} question type`);
      assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === expected.id), `${expected.id} visible daily route`);

      if (expected.type === 'choice') {
        const correct = exercise.choices.find((option) => option.id === exercise.answer);
        assert.ok(correct, `${expected.id} answer ID resolves to a choice`);
        assert.match(correct.text, expected.expected, `${expected.id} answer meaning`);
        assert.ok(exercise.choiceExplanations[exercise.answer].length > 15, `${expected.id} correct-answer explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answer), true, `${expected.id} grading`);
      } else if (expected.type === 'short-answer') {
        assert.ok(exercise.acceptedAnswers.includes(expected.expected), `${expected.id} accepted answer`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} explanation`);
        assert.equal(gradeAnswer(exercise, expected.expected), true, `${expected.id} grading`);
      } else {
        assert.equal(exercise.answerLines.length, 1, `${expected.id} unique faulty line`);
        const faultyLine = exercise.codeLines[exercise.answerLines[0] - 1];
        assert.match(faultyLine, expected.expected, `${expected.id} faulty code`);
        if (expected.absent) assert.doesNotMatch(faultyLine, expected.absent, `${expected.id} demonstrates the actual omission`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} correction explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true, `${expected.id} grading`);
      }
    }
  }
});

test('G10 Spring Boot units 7 through 9 align transaction, security, and MVC-test questions with their daily examples', () => {
  const originals = [
    {
      lessonId: 'spring-data-transaction',
      days: [
        { id: 'spring-tx-choice-v2', type: 'choice', marker: '@Transactional', expected: /외부 이메일 전송은 일반 DB 트랜잭션이 자동으로 되돌리지 못한다/ },
        { id: 'spring-tx-short-v2', type: 'short-answer', marker: 'mailClient.sendConfirmation', expected: 'AFTER_COMMIT' },
        { id: 'spring-tx-locate-v2', type: 'locate-error', marker: 'IllegalStateException', expected: /return;/ },
      ],
    },
    {
      lessonId: 'spring-security-basics',
      days: [
        { id: 'spring-security-choice', type: 'choice', marker: 'Authentication', expected: /^인증$/ },
        { id: 'spring-security-short-v2', type: 'short-answer', marker: '@PreAuthorize', expected: '@EnableMethodSecurity' },
        { id: 'spring-security-locate', type: 'locate-error', marker: 'SecurityFilterChain', expected: /\.authenticated\(\)/ },
      ],
    },
    {
      lessonId: 'spring-integration-tests',
      days: [
        { id: 'spring-test-choice-v2', type: 'choice', marker: '@WebMvcTest', expected: /객체를 직접 만들고 입력·반환값을 확인하는 작은 JUnit 단위 테스트/ },
        { id: 'spring-test-short-v2', type: 'short-answer', marker: 'mockMvc.perform', expected: 'perform' },
        { id: 'spring-test-locate-v2', type: 'locate-error', marker: '@MockitoBean CourseService', expected: /@Autowired CourseService/ },
      ],
    },
  ];

  for (const { lessonId, days } of originals) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);

    for (const [index, expected] of days.entries()) {
      const day = index + 1;
      const matches = lesson.exercises.filter((exercise) => exercise.id === expected.id);
      assert.equal(matches.length, 1, `${expected.id} must appear exactly once`);
      const exercise = matches[0];
      assert.equal(exercise.studyDay, day, `${expected.id} study day`);
      assert.equal(exercise.type, expected.type, `${expected.id} question type`);
      assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === expected.id), `${expected.id} visible daily route`);
      assert.ok(lesson.studyDays[day - 1].example.includes(expected.marker), `${expected.id} daily example context`);

      if (expected.type === 'choice') {
        const correct = exercise.choices.find((option) => option.id === exercise.answer);
        assert.ok(correct, `${expected.id} answer ID resolves to a choice`);
        assert.match(correct.text, expected.expected, `${expected.id} answer meaning`);
        assert.ok(exercise.choiceExplanations[exercise.answer].length > 15, `${expected.id} correct-answer explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answer), true, `${expected.id} grading`);
      } else if (expected.type === 'short-answer') {
        assert.ok(exercise.acceptedAnswers.includes(expected.expected), `${expected.id} accepted answer`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} explanation`);
        assert.equal(gradeAnswer(exercise, expected.expected), true, `${expected.id} grading`);
      } else {
        assert.equal(exercise.answerLines.length, 1, `${expected.id} unique faulty line`);
        assert.match(exercise.codeLines[exercise.answerLines[0] - 1], expected.expected, `${expected.id} faulty code`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} correction explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true, `${expected.id} grading`);
      }
    }
  }
});

test('Spring transaction and MVC examples match the W7-W9 questions', () => {
  const springTrack = getTrack('spring');
  assert.equal(springTrack.contentReview.version, 'Spring Boot 4.1.2');
  assert.match(springTrack.contentReview.versionContext, /Java 17–27과 Spring Framework 7\.0\.10 이상/);
  assert.ok(springTrack.contentReview.sources.some((source) => source.url.endsWith('/transaction/TransactionDefinition.html')));
  assert.ok(springTrack.contentReview.sources.some((source) => source.url === 'https://docs.spring.io/spring-boot/reference/web/spring-security.html'));
  assert.ok(springTrack.contentReview.sources.some((source) => source.url === 'https://github.com/spring-projects/spring-security/releases/tag/7.1.2'));

  const transaction = getLesson('spring-data-transaction');
  const atomicity = transaction.studyDays[1];
  const atomicityChoice = atomicity.exercises.find((item) => item.id === 'spring-w07-d2-choice-v2');
  assert.match(atomicity.example, /@Transactional/);
  assert.match(atomicity.example, /@TransactionalEventListener\(phase = TransactionPhase\.AFTER_COMMIT\)/);
  assert.match(atomicityChoice.prompt, /예제에서는 메일을 DB 커밋 뒤에/);

  const proxy = transaction.studyDays[3];
  const proxyChoice = proxy.exercises.find((item) => item.id === 'spring-w07-d4-choice');
  assert.match(proxyChoice.prompt, /현재 예제처럼 다른 Spring Bean의 메서드를 호출하는 경우와 달리/);
  assert.match(proxyChoice.prompt, /같은 객체에서 `this\.reserveCapacity\(\)`/);

  const readOnly = transaction.studyDays[4];
  const readOnlyChoice = readOnly.exercises.find((item) => item.id === 'spring-w07-d5-choice');
  const readOnlyShort = readOnly.exercises.find((item) => item.id === 'spring-w07-d5-short-v2');
  assert.match(readOnly.example, /public CourseView find/);
  assert.match(readOnlyChoice.prompt, /위 조회 예제/);
  assert.match(readOnlyShort.prompt, /위 조회 메서드/);
  assert.match(readOnlyChoice.choices.find((item) => item.id === readOnlyChoice.answer).text, /readOnly = true는 빼요/);

  const mock = getLesson('spring-integration-tests').studyDays[2];
  assert.match(mock.example, /@WebMvcTest\(CourseController\.class\)/);
  assert.match(mock.example, /@MockitoBean CourseService/);
});

test('G10 Spring Boot units 10 through 12 keep resilience, observability, and API questions on their intended days', () => {
  const originals = [
    {
      lessonId: 'spring-timeout-cache-resilience',
      days: [
        { id: 'spring-resilience-locate', type: 'locate-error', exampleMarker: '.timeout(Duration', expected: /HttpRequest\.newBuilder/ },
        { id: 'spring-resilience-choice', type: 'choice', exampleMarker: 'idempotencyKey', expected: /일시 오류.*멱등 키/ },
        { id: 'spring-cache-short', type: 'short-answer', exampleMarker: 'Locale locale', expected: '캐시 키' },
      ],
    },
    {
      lessonId: 'spring-observability-performance',
      days: [
        { id: 'spring-observe-choice-v2', type: 'choice', exampleMarker: 'addKeyValue', expected: /구조화 출력을 설정하고.*key-value/ },
        { id: 'spring-observe-short-v2', type: 'short-answer', exampleMarker: 'tracer.currentSpan()', expected: 'trace id' },
        { id: 'spring-observe-locate-v2', type: 'locate-error', exampleMarker: '.tag("outcome"', expected: /tag\("courseId"/ },
      ],
    },
    {
      lessonId: 'spring-api-operations-capstone',
      days: [
        { id: 'spring-capstone-choice', type: 'choice', exampleMarker: 'ResponseEntity.created', expected: /생성 리소스의 식별자와 위치 정보/ },
        { id: 'spring-capstone-short', type: 'short-answer', exampleMarker: 'Idempotency-Key', expected: '멱등성' },
        { id: 'spring-capstone-locate', type: 'locate-error', exampleMarker: 'INTERNAL_SERVER_ERROR', expected: /error\.getMessage\(\)/ },
      ],
    },
  ];

  for (const { lessonId, days } of originals) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);

    for (const [index, expected] of days.entries()) {
      const day = index + 1;
      const matches = lesson.exercises.filter((exercise) => exercise.id === expected.id);
      assert.equal(matches.length, 1, `${expected.id} appears once`);
      const exercise = matches[0];
      assert.equal(exercise.studyDay, day, `${expected.id} day mapping`);
      assert.equal(exercise.type, expected.type, `${expected.id} question type`);
      assert.ok(lesson.studyDays[day - 1].exercises.some((item) => item.id === expected.id), `${expected.id} visible in its day`);
      assert.ok(lesson.studyDays[day - 1].example.includes(expected.exampleMarker), `${expected.id} teaching example`);

      if (expected.type === 'choice') {
        const answer = exercise.choices.find((option) => option.id === exercise.answer);
        assert.ok(answer, `${expected.id} answer ID resolves`);
        assert.match(answer.text, expected.expected, `${expected.id} answer meaning`);
        assert.ok(exercise.choiceExplanations[exercise.answer].length > 25, `${expected.id} answer explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answer), true, `${expected.id} grading`);
      } else if (expected.type === 'short-answer') {
        assert.ok(exercise.acceptedAnswers.includes(expected.expected), `${expected.id} accepted answer`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} answer explanation`);
        assert.equal(gradeAnswer(exercise, expected.expected), true, `${expected.id} grading`);
      } else {
        assert.equal(exercise.answerLines.length, 1, `${expected.id} one diagnosed line`);
        assert.match(exercise.codeLines[exercise.answerLines[0] - 1], expected.expected, `${expected.id} diagnosed code`);
        assert.ok(exercise.explanation.length > 25, `${expected.id} correction explanation`);
        assert.equal(gradeAnswer(exercise, exercise.answerLines), true, `${expected.id} grading`);
      }
    }
  }
});

test('Spring W10–W11 timeout, retry, cache, and trace examples match their answer contracts', () => {
  const timeout = getExercise('spring-w10-d1-choice');
  const timeoutAnswer = timeout.choices.find((choice) => choice.id === timeout.answer);
  assert.match(timeout.prompt, /실제 catalogClient 요청 설정에는 전달하지 않았습니다/);
  assert.match(timeoutAnswer.text, /실제 요청에는 적용되지 않아 느린 호출이 계속 기다릴 수 있다/);
  assert.match(timeout.choiceExplanations[timeout.answer], /HTTP 클라이언트의 요청 설정에 시간 제한/);

  const retry = getExercise('spring-w10-d2-choice');
  const retryDistractors = retry.choices.filter((choice) => choice.id !== retry.answer).map((choice) => choice.text).join('\n');
  assert.match(retryDistractors, /모든 RuntimeException.*최대 3회 다시 보내면.*멱등 키 없이도/);

  const w10 = getLesson('spring-timeout-cache-resilience');
  assert.match(w10.studyDays[3].example, /@CacheEvict\(cacheNames = "course-view", allEntries = true\)/);
  assert.match(w10.studyDays[4].example, /@RequestHeader\("Idempotency-Key"\)/);

  const w11 = getLesson('spring-observability-performance');
  assert.match(w11.studyDays[0].example, /addKeyValue\("memberId", memberId\)/);
  assert.match(w11.studyDays[0].example, /addKeyValue\("courseId", courseId\)/);
  assert.equal(getExercise('spring-observe-short'), null, 'trace ID question meaning change receives a new progress ID');
  const traceId = getExercise('spring-observe-short-v2');
  assert.deepEqual(traceId.acceptedAnswers, ['trace ID', 'trace id', '추적 ID']);
  assert.doesNotMatch(w11.studyDays[1].example, /Use the active trace ID/);
});

test('Spring weeks 1 through 3 give each daily question a distinct, correctly scoped application', () => {
  const missingRepository = getExercise('spring-w01-d1-choice-v2');
  assert.equal(getExercise('spring-w01-d1-choice'), null, 'changed question meaning receives a new progress id');
  assert.match(missingRepository.prompt, /CourseRepository Bean.*찾지 못하면/);
  assert.match(missingRepository.choices.find((item) => item.id === missingRepository.answer).text, /컨텍스트 생성이 실패/);
  assert.equal(gradeAnswer(missingRepository, missingRepository.answer), true);

  const constructor = getExercise('spring-w01-d2-choice-v2');
  assert.equal(getExercise('spring-w01-d2-choice'), null, 'changed question meaning receives a new progress id');
  assert.match(constructor.prompt, /CourseRepository와 Clock 두 협력 객체/);
  assert.match(constructor.choices.find((item) => item.id === constructor.answer).text, /두 타입을 모두 매개변수/);

  const serviceRule = getExercise('spring-w02-d2-choice-v3');
  assert.equal(getExercise('spring-w02-d2-choice'), null, 'changed question meaning receives a new progress id');
  assert.equal(getExercise('spring-w02-d2-choice-v2'), null, 'concurrency requirement receives a new progress id');
  assert.match(serviceRule.prompt, /같은 제목의 강좌/);
  assert.match(serviceRule.prompt, /existsByTitle/);
  assert.match(serviceRule.prompt, /동시 요청/);
  assert.match(serviceRule.choices.find((item) => item.id === serviceRule.answer).text, /고유 제약.*제약 위반/);
  assert.match(getLesson('spring-service').studyDays[1].example, /DB에도 title 고유 제약/);
  assert.match(getExercise('spring-w02-d2-short-v2').explanation, /동시 요청.*DB 고유 제약/);
  assert.deepEqual(getExercise('spring-w02-d2-short-v2').acceptedAnswers, ['existsByTitle']);
  assert.equal(getExercise('spring-w02-d2-short')?.id, getExercise('spring-w02-d2-short-v2')?.id, 'saved answers resolve through the prior progress ids');
  assert.equal(gradeAnswer(serviceRule, serviceRule.answer), true);

  const dto = getExercise('spring-w02-d4-locate');
  assert.equal(dto.answerLines.length, 1);
  assert.match(dto.codeLines[dto.answerLines[0] - 1], /Course create\(Course request\)/);
  assert.doesNotMatch(dto.codeLines.join('\n'), /return course;/);
  assert.equal(gradeAnswer(dto, dto.answerLines), true);

  const env = getExercise('spring-w03-d1-choice-v2');
  assert.equal(getExercise('spring-w03-d1-choice'), null, 'changed question meaning receives a new progress id');
  assert.match(env.prompt, /spring\.datasource\.url/);
  assert.match(env.choices.find((item) => item.id === env.answer).text, /SPRING_DATASOURCE_URL/);
  assert.equal(gradeAnswer(env, env.answer), true);

  const properties = getLesson('spring-config-profiles');
  assert.match(properties.studyDays[3].example, /@ConfigurationPropertiesScan/);
  assert.match(properties.studyDays[3].intro, /@EnableConfigurationProperties/);
  const propertiesChoice = properties.studyDays[3].exercises.find((item) => item.type === 'choice');
  assert.doesNotMatch(propertiesChoice.prompt, /표식이 빠져 있나요/);
  const missingAnnotation = properties.studyDays[3].exercises.find((item) => item.type === 'locate-error');
  assert.equal(missingAnnotation.answerLines.length, 1);
  assert.match(missingAnnotation.codeLines[missingAnnotation.answerLines[0] - 1], /record CourseProperties/);
  assert.equal(gradeAnswer(missingAnnotation, missingAnnotation.answerLines), true);

  const validated = properties.studyDays[4];
  assert.match(validated.example, /@Validated/);
  assert.match(validated.example, /@Min\(1\)/);
  assert.match(validated.intro, /Jakarta Validation 구현체/);
  const invalidSetting = validated.exercises.find((item) => item.type === 'locate-error');
  assert.match(invalidSetting.prompt, /Jakarta Validation provider/);
  assert.equal(invalidSetting.answerLines.length, 1);
  assert.match(invalidSetting.codeLines[invalidSetting.answerLines[0] - 1], /course\.max-size=-1/);
  assert.equal(gradeAnswer(invalidSetting, invalidSetting.answerLines), true);

  for (const id of ['spring-w01-d4-locate', 'spring-w01-d5-locate', 'spring-w02-d4-locate', 'spring-w02-d5-locate', 'spring-w03-d4-locate', 'spring-w03-d5-locate']) {
    const locate = getExercise(id);
    assert.doesNotMatch(locate.prompt, /규칙을 깨거나 운영상 위험을 만드는 줄/);
    assert.match(locate.hint, /[가-힣]/);
  }
});

test('Spring weeks 4 through 6 align HTTP examples, status contracts, and trace context', () => {
  assert.equal(getExercise('spring-w04-d1-choice'), null, 'changed GET question meaning gets a new history id');
  const getSafety = getExercise('spring-w04-d1-choice-v2');
  assert.match(getSafety.prompt, /읽기 전용 조회 API/);
  assert.match(getSafety.choices.find((item) => item.id === getSafety.answer).text, /부작용/);
  assert.equal(gradeAnswer(getSafety, getSafety.answer), true);

  const createContract = getExercise('spring-w04-d4-locate');
  assert.match(createContract.prompt, /201 Created/);
  assert.equal(createContract.answerLines.length, 1);
  assert.match(createContract.codeLines[createContract.answerLines[0] - 1], /ResponseEntity\.ok/);
  assert.equal(gradeAnswer(createContract, createContract.answerLines), true);

  const noResource = getExercise('spring-w06-d2-choice-v2');
  assert.match(noResource.prompt, /조회가 정상적으로 끝났지만.*리소스가 없습니다/);
  assert.match(noResource.choices.find((item) => item.id === noResource.answer).text, /404 Not Found/);
  assert.equal(getExercise('spring-w06-d2-short'), null, 'meaning-refined response interpretation has a new history id');
  assert.ok(getExercise('spring-w06-d2-short-v2'));
  assert.equal(getExercise('spring-errors-short'), null, 'the misplaced creation-status recall is retired');
  assert.ok(getExercise('spring-errors-short-v2'));

  const badRequest = getExercise('spring-w06-d3-choice-v2');
  assert.match(badRequest.prompt, /@Valid @RequestBody/);
  assert.match(badRequest.choices.find((item) => item.id === badRequest.answer).text, /400 Bad Request/);
  assert.deepEqual(getExercise('spring-w06-d3-short-v2').acceptedAnswers, ['400', '400 Bad Request']);

  const traceLesson = getLesson('spring-rest-errors');
  assert.match(traceLesson.studyDays[4].intro, /Micrometer Tracing.*활성 추적 문맥/);
  const traceChoice = getExercise('spring-w06-d5-choice-v2');
  assert.match(traceChoice.prompt, /현재 요청 span/);
  assert.match(traceChoice.choices.find((item) => item.id === traceChoice.answer).text, /현재 span/);
  assert.equal(getExercise('spring-w06-d5-short')?.id, getExercise('spring-w06-d5-short-v2')?.id, 'saved answers resolve through the prior progress ids');
  assert.ok(getExercise('spring-w06-d5-short-v2'));

  assert.equal(getExercise('spring-w06-d5-locate'), null, 'the corrected failing line gets a new history id');
  const traceLocate = getExercise('spring-w06-d5-locate-v2');
  assert.equal(traceLocate.answerLines.length, 1);
  assert.equal(traceLocate.answerLines[0], 2);
  assert.match(traceLocate.codeLines[1], /request\.getHeader\("X-Trace-Id"\)/);
  assert.match(traceLocate.prompt, /임의로 정할 수 있는 별도 헤더/);
  assert.match(traceLocate.hint, /활성 문맥.*검증되지 않은/);
  assert.equal(gradeAnswer(traceLocate, traceLocate.answerLines), true);

  for (const id of ['spring-w04-d4-locate', 'spring-w04-d5-locate', 'spring-w05-d4-locate', 'spring-w05-d5-locate']) {
    const locate = getExercise(id);
    assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/);
    assert.match(locate.prompt, /201|404|조회 대상|clientSaysValid|4xx/);
  }
});

test('Spring weeks 7 through 9 separate transaction, security, and MVC testing objectives', () => {
  const transaction = getLesson('spring-data-transaction');
  assert.match(transaction.studyDays[1].example, /mailClient\.sendConfirmation/);
  const externalSideEffect = getExercise('spring-w07-d2-choice-v2');
  assert.equal(getExercise('spring-w07-d2-choice'), null);
  assert.match(externalSideEffect.prompt, /DB 롤백.*이미 보낸 메일까지 취소/);
  assert.match(externalSideEffect.prompt, /mailClient\.sendConfirmation/);
  assert.equal(gradeAnswer(externalSideEffect, externalSideEffect.answer), true);

  assert.equal(getExercise('spring-tx-choice'), null);
  assert.ok(getExercise('spring-tx-choice-v2'));
  assert.equal(getExercise('spring-tx-short'), null);
  assert.deepEqual(getExercise('spring-tx-short-v2').acceptedAnswers, ['AFTER_COMMIT', 'after commit']);
  assert.equal(getExercise('spring-tx-locate'), null);
  const swallowedFailure = getExercise('spring-tx-locate-v2');
  assert.deepEqual(swallowedFailure.answerLines, [7]);
  assert.match(swallowedFailure.codeLines[6], /return;/);
  assert.match(swallowedFailure.explanation, /예외를 삼키고 정상 반환/);
  assert.equal(getExercise('spring-w07-d3-short'), null);
  assert.ok(getExercise('spring-w07-d3-short-v2'));
  assert.equal(getExercise('spring-w07-d4-short'), null);
  assert.deepEqual(getExercise('spring-w07-d4-short-v2').acceptedAnswers, [
    '다른 Spring Bean으로 분리해 외부 호출', '다른 Bean으로 분리', '별도 Bean으로 분리', '외부 Bean 경계로 이동', '프록시를 거치는 별도 Bean에서 호출',
  ]);
  assert.equal(getExercise('spring-w07-d5-short'), null);
  assert.match(getExercise('spring-w07-d5-short-v2').explanation, /보안 경계라고 보장하지 않으므로/);
  for (const id of ['spring-w07-d4-locate', 'spring-w07-d5-locate']) {
    const locate = getExercise(id);
    assert.doesNotMatch(locate.hint, /HTTP 바인딩, 설정 비밀값/);
  }

  assert.equal(getExercise('spring-security-short'), null);
  assert.deepEqual(getExercise('spring-security-short-v2').acceptedAnswers, ['@EnableMethodSecurity']);
  assert.equal(getExercise('spring-w08-d5-short'), null);
  assert.deepEqual(getExercise('spring-w08-d5-short-v2').acceptedAnswers, ['anyRequest()', 'anyRequest']);
  for (const id of ['spring-w08-d4-locate', 'spring-w08-d5-locate']) {
    const locate = getExercise(id);
    assert.doesNotMatch(locate.hint, /HTTP 바인딩, 설정 비밀값/);
  }

  assert.equal(getExercise('spring-test-choice'), null);
  assert.ok(getExercise('spring-test-choice-v2'));
  assert.equal(getExercise('spring-w09-d3-choice'), null);
  const sliceBoundary = getExercise('spring-w09-d3-choice-v2');
  assert.match(sliceBoundary.prompt, /일반 CourseService Bean/);
  assert.match(sliceBoundary.choices.find((item) => item.id === sliceBoundary.answer).text, /일반 서비스 Bean은 자동으로 포함되지 않는다/);
  assert.equal(getExercise('spring-test-short'), null);
  assert.deepEqual(getExercise('spring-test-short-v2').acceptedAnswers, ['perform']);
  assert.equal(getExercise('spring-test-locate'), null);
  const missingCollaborator = getExercise('spring-test-locate-v2');
  assert.deepEqual(missingCollaborator.answerLines, [4]);
  assert.match(missingCollaborator.codeLines[3], /@Autowired CourseService/);
  assert.match(missingCollaborator.explanation, /@MockitoBean/);
  assert.equal(getExercise('spring-w09-d3-short')?.id, getExercise('spring-w09-d3-short-v2')?.id);
  assert.deepEqual(getExercise('spring-w09-d3-short-v2').acceptedAnswers, ['@MockitoBean']);
  assert.match(getExercise('spring-w09-d4-locate').hint, /Content-Type/);
  assert.equal(getExercise('spring-w09-d5-locate'), null);
  const creationStatus = getExercise('spring-w09-d5-locate-v2');
  assert.match(creationStatus.prompt, /201 Created/);
  assert.match(creationStatus.codeLines[creationStatus.answerLines[0] - 1], /isOk\(\)/);
  assert.equal(gradeAnswer(creationStatus, creationStatus.answerLines), true);
});

test('Spring weeks 6 through 10 daily cases use the day concept in all three questions', () => {
  const concepts = {
    6: ['@ControllerAdvice', '404 계약', '400 계약', '안전한 오류 메시지', '추적 ID'],
    7: ['@Transactional', '원자성', 'rollback', '프록시 호출', '읽기 전용'],
    8: ['Authentication', 'Authorization', 'SecurityFilterChain', 'hasRole', '기본 차단'],
    9: ['@WebMvcTest', 'MockMvc', 'mock 협력자', '요청 바인딩', '응답 검증'],
    10: ['timeout', '재시도', '캐시 키', '무효화', '멱등 키'],
  };
  for (const [weekText, dailyConcepts] of Object.entries(concepts)) {
    const week = Number(weekText);
    const lessonId = week <= 12
      ? ['spring-injection', 'spring-service', 'spring-config-profiles', 'spring-controller', 'spring-validation', 'spring-rest-errors', 'spring-data-transaction', 'spring-security-basics', 'spring-integration-tests', 'spring-timeout-cache-resilience'][week - 1]
      : `spring-week-${String(week).padStart(2, '0')}`;
    const lesson = getLesson(lessonId);
    dailyConcepts.forEach((concept, index) => {
      const day = index + 1;
      const id = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const session = lesson.studyDays[day - 1];
      const choice = session.exercises.find((item) => item.id.startsWith(`${id}-choice`));
      const short = session.exercises.find((item) => item.id.startsWith(`${id}-short`));
      const locate = session.exercises.find((item) => item.id.startsWith(`${id}-locate`));
      assert.ok(lesson.studyDays.some((studyDay) => studyDay.exercises.some((item) => item.id === short.id)), id);
      if (week <= 9) {
        assert.ok(short.acceptedAnswers.length > 0, short.id);
        assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
      } else if (week === 10 && day === 3) {
        assert.equal(short.acceptedAnswers[0], 'locale', short.id);
        assert.match(short.prompt, /두 입력.*courseId 외에 어떤 값/, short.id);
      } else if (week === 10 && day === 4) {
        assert.equal(short.acceptedAnswers[0], '@CacheEvict', short.id);
        assert.match(short.prompt, /변경 메서드.*캐시 항목을 제거/, short.id);
      } else {
        assert.equal(short.acceptedAnswers[0], concept, short.id);
        if (week !== 10) assert.match(short.prompt, new RegExp(concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), short.id);
      }
      assert.equal(choice.answer, 'a', choice.id);
      if (locate) {
        assert.equal(locate.answerLines.length, 1, locate.id);
        assert.ok(locate.codeLines[locate.answerLines[0] - 1].trim(), locate.id);
        assert.match(locate.explanation, /./, locate.id);
      }
    });
  }
});

test('Spring weeks 6 through 10 use topic-matched questions and learner-specific Korean feedback', () => {
  const weeks = {
    6: { id: 'spring-rest-errors', exampleMarkers: ['@RestControllerAdvice', 'notFound', 'badRequest', 'new ApiError', 'traceId'], questionMarkers: ['@RestControllerAdvice', 'notFound', 'badRequest', 'new ApiError', 'traceId'] },
    7: { id: 'spring-data-transaction', exampleMarkers: ['@Transactional', 'capacity.reserve', 'capacity exceeded', 'enrollmentService.enroll', 'readOnly'], questionMarkers: ['@Transactional', 'capacity.reserve', 'capacity exceeded', 'enrollmentService.enroll', 'readOnly'] },
    8: { id: 'spring-security-basics', exampleMarkers: ['SecurityContextHolder', '@PreAuthorize', 'SecurityFilterChain', 'hasRole', 'denyAll'], questionMarkers: ['SecurityContextHolder', '@PreAuthorize', 'SecurityFilterChain', 'hasRole', 'denyAll'] },
    9: { id: 'spring-integration-tests', exampleMarkers: ['@WebMvcTest', 'mockMvc.perform', '@MockitoBean CourseService', 'APPLICATION_JSON', 'isCreated()'], questionMarkers: ['@WebMvcTest', 'mockMvc.perform', 'when(service.find', 'APPLICATION_JSON', 'isCreated()'] },
    10: {
      id: 'spring-timeout-cache-resilience',
      exampleMarkers: ['.timeout(Duration', 'idempotencyKey', 'Locale locale', '@CacheEvict', 'Idempotency-Key'],
      questionMarkers: ['catalogClient.fetch', 'catch (RuntimeException', 'key = "#courseId"', '@Cacheable(cacheNames = "course-view", key = "#course.id")', 'paymentClient.charge(request)'],
    },
  };

  for (const [weekText, expected] of Object.entries(weeks)) {
    const week = Number(weekText);
    const lesson = getLesson(expected.id);
    assert.equal(lesson.contentReviewStatus, '문항 검수 완료', lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);
    for (let day = 1; day <= 5; day += 1) {
      const exampleMarker = expected.exampleMarkers[day - 1];
      const questionMarker = expected.questionMarkers[day - 1];
      const session = lesson.studyDays[day - 1];
      const choice = session.exercises.find((item) => item.id.startsWith(`spring-w${String(week).padStart(2, '0')}-d${day}-choice`));
      const short = session.exercises.find((item) => item.id.startsWith(`spring-w${String(week).padStart(2, '0')}-d${day}-short`));
      assert.ok(session.example.includes(exampleMarker), `${lesson.id} day ${day} example`);
      assert.ok(choice.prompt.includes(questionMarker), choice.id);
      assert.equal(choice.answer, 'a', choice.id);
      assert.match(choice.choices.find((option) => option.id === choice.answer)?.text, /[가-힣]/, choice.id);
      for (const option of choice.choices.filter((item) => item.id !== choice.answer)) {
        const feedback = choice.choiceExplanations[option.id];
        assert.ok(feedback.length > 25, `${choice.id}/${option.id}`);
        assert.match(feedback, /[가-힣]/, `${choice.id}/${option.id}`);
      }
      assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
      assert.ok(short.acceptedAnswers.length > 0, short.id);
      assert.match(short.explanation, /[가-힣]/, short.id);
      assert.equal(session.exercises.length, 3, `${lesson.id} day ${day}`);
    }
  }

  const resilience = getLesson('spring-timeout-cache-resilience');
  const timeout = getExercise('spring-resilience-locate');
  assert.equal(timeout.answerLines.length, 1, timeout.id);
  assert.match(timeout.codeLines[timeout.answerLines[0] - 1], /HttpRequest\.newBuilder/);
  assert.match(timeout.explanation, /\.timeout\(Duration/);
  const retry = getExercise('spring-resilience-choice');
  assert.equal(retry.studyDay, 2, retry.id);
  assert.match(retry.choices.find((option) => option.id === retry.answer)?.text, /일시 오류.*멱등 키/);
  assert.equal(getExercise('spring-cache-short').studyDay, 3);
  assert.equal(getExercise('spring-cache-short').acceptedAnswers[0], '캐시 키');
  assert.ok(resilience.studyDays.every((day) => day.exercises.length === 3), resilience.id);
});

test('Spring weeks 7 through 12 match their legacy lesson titles and question bank', () => {
  const weeks = [
    { id: 'spring-data-transaction', title: /트랜잭션/, topic: '트랜잭션 경계', legacy: 'spring-tx-' },
    { id: 'spring-security-basics', title: /보안/, topic: '인증과 인가', legacy: 'spring-security-' },
    { id: 'spring-integration-tests', title: /통합 테스트/, topic: 'MVC 계층 테스트', legacy: 'spring-test-' },
    { id: 'spring-timeout-cache-resilience', title: /느린 의존성/, topic: '캐시와 시간 제한', legacy: 'spring-resilience-' },
    { id: 'spring-observability-performance', title: /로그·지표·추적/, topic: '관측 가능성', legacy: 'spring-observe-' },
    { id: 'spring-api-operations-capstone', title: /API 설계 검토/, topic: 'API 설계 통합', legacy: 'spring-capstone-' },
  ];

  for (const [index, expected] of weeks.entries()) {
    const week = index + 7;
    const lesson = getLesson(expected.id);
    assert.match(lesson.title, expected.title, lesson.id);
    assert.equal(lesson.week, week, lesson.id);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.ok(lesson.exercises.some((exercise) => exercise.id.startsWith(expected.legacy)), `${lesson.id} legacy questions`);
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.includes(expected.topic), `${lesson.id} day ${day.number} objective`);
      assert.ok(day.example.startsWith(`// ${expected.topic} ·`), `${lesson.id} day ${day.number} example`);
    }
  }

  assert.equal(getLesson('spring-observability-performance').contentReviewStatus, '문항 검수 완료');
  assert.equal(getLesson('spring-api-operations-capstone').contentReviewStatus, '문항 검수 완료');
});

test('Spring weeks 10 through 12 separate correct teaching examples from intentionally faulty exercises', () => {
  const lessons = [
    getLesson('spring-timeout-cache-resilience'),
    getLesson('spring-observability-performance'),
    getLesson('spring-api-operations-capstone'),
  ];
  const misleadingPatterns = [
    /catch \(RuntimeException/,
    /key = "#courseId"/,
    /UUID\.randomUUID\(\)/,
    /tag\("courseId"/,
    /password=\{\}/,
    /ResponseEntity\.ok\(null\)/,
    /error\.getMessage\(\)/,
    /requestMatchers\("\/api\/admin\/\*\*"\)\.authenticated\(\)/,
  ];

  for (const lesson of lessons) {
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (const day of lesson.studyDays) {
      for (const pattern of misleadingPatterns) {
        assert.doesNotMatch(day.example, pattern, `${lesson.id}/${day.number} teaching example contains ${pattern}`);
      }
      const dailyChoiceId = `spring-w${String(lesson.week).padStart(2, '0')}-d${day.number}-choice`;
      const choice = day.exercises.find((exercise) => exercise.id.startsWith(dailyChoiceId));
      assert.ok(choice, `${lesson.id}/${day.number} keeps its code-reading exercise`);
      if (day.number === 2 && lesson.id === 'spring-timeout-cache-resilience') {
        assert.match(choice.prompt, /catch \(RuntimeException/, choice.id);
      }
      if (lesson.id === 'spring-api-operations-capstone' && day.number === 4) {
        assert.match(choice.prompt, /\.authenticated\(\)/, choice.id);
      }
    }
  }

  assert.match(lessons[0].studyDays[2].example, /Locale locale/);
  assert.match(lessons[1].studyDays[0].example, /addKeyValue/);
  assert.match(lessons[1].studyDays[3].example, /RestClient\.Builder/);
  assert.match(lessons[2].studyDays[0].example, /ResponseEntity\.created/);
  assert.match(lessons[2].studyDays[3].example, /hasRole\("ADMIN"\)/);
  assert.match(lessons[0].studyDays[1].intro, /멱등 키.*제공자/);
  assert.match(lessons[0].studyDays[2].intro, /CacheManager/);
  assert.match(lessons[1].studyDays[0].intro, /structured\.format\.console/);
  assert.match(lessons[1].studyDays[3].intro, /자동 구성.*RestClient\.Builder/);
  assert.match(lessons[2].studyDays[3].intro, /ROLE_ADMIN/);
  assert.match(lessons[2].studyDays[4].intro, /Micrometer Tracing/);
});

test('Spring week 12 capstone examples and three question formats match each API design day', () => {
  const expected = [
    { concept: '생성 응답 계약', exampleMarker: 'ResponseEntity.created', questionMarker: 'ResponseEntity.ok(null)', answer: '201', locate: null },
    { concept: '멱등 요청', exampleMarker: 'Idempotency-Key', questionMarker: 'paymentClient.charge(request)', answer: '멱등 키', locate: null },
    { concept: '안전한 오류 응답', exampleMarker: 'INTERNAL_SERVER_ERROR', questionMarker: 'error.getMessage()', answer: '오류 DTO', locate: 'error.getMessage()' },
    { concept: '접근 권한', exampleMarker: '.hasRole("ADMIN")', questionMarker: '.authenticated()', answer: '인가', locate: '.authenticated()' },
    { concept: '요청 추적', exampleMarker: 'tracer.currentSpan()', questionMarker: 'UUID.randomUUID', answer: 'trace ID', locate: 'UUID.randomUUID' },
  ];
  const lesson = getLesson('spring-api-operations-capstone');
  assert.equal(lesson.contentReviewStatus, '문항 검수 완료', lesson.id);
  assert.equal(lesson.studyDays.length, 5, lesson.id);
  assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);

  for (const [index, daySpec] of expected.entries()) {
    const day = index + 1;
    const session = lesson.studyDays[index];
    const id = `spring-w12-d${day}`;
    const choice = getExercise(`${id}-choice`);
    const short = getExercise(`${id}-short`);
    assert.equal(session.exercises.length, 3, id);
    assert.ok(session.objective.includes(daySpec.concept), `${id} objective`);
    assert.ok(session.example.includes(daySpec.exampleMarker), `${id} teaching example`);
    assert.ok(choice.prompt.includes(daySpec.questionMarker), `${choice.id} diagnostic scenario`);
    assert.ok(short.prompt.includes(daySpec.questionMarker), `${short.id} diagnostic scenario`);
    assert.equal(short.acceptedAnswers[0], daySpec.answer, short.id);
    assert.equal(choice.answer, 'a', choice.id);
    assert.equal(choice.choiceExplanations[choice.answer], choice.explanation, choice.id);
    assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
    assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    for (const distractor of choice.choices.filter((option) => option.id !== choice.answer)) {
      const feedback = choice.choiceExplanations[distractor.id];
      assert.ok(feedback.length > 20, `${choice.id}/${distractor.id}`);
      assert.match(feedback, /[가-힣]/, `${choice.id}/${distractor.id}`);
    }

    const locate = session.exercises.find((exercise) => exercise.type === 'locate-error');
    if (daySpec.locate) {
      assert.ok(locate, `${id} locate question`);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1].includes(daySpec.locate), locate.id);
      assert.match(locate.explanation, /[가-힣]/, locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
    } else {
      assert.equal(locate, undefined, `${id} does not add an unrelated defect`);
    }
  }
});

test('Spring weeks 11 through 15 use topic-specific examples, decisions, and real error lines', () => {
  const weeks = {
    11: {
      lessonId: 'spring-observability-performance',
      concepts: ['구조화 로그', 'trace ID', '메트릭', '분산 추적', '민감 정보'],
      markers: ['addKeyValue("event"', 'tracer.currentSpan()', '.tag("outcome"', 'RestClient.Builder', 'event", "login_failed'],
      questionMarkers: ['member=', 'UUID.randomUUID', 'tag("courseId"', 'RestClient.create', 'password={}'],
      answers: [/구조화 로그 출력을 설정하고.*key-value/, /현재 요청의 활성 tracing 문맥/, /종류가 제한된 결과 태그/, /RestClient.Builder/, /원문 비밀번호/],
      acceptedAnswers: ['구조화 로그', '현재 요청의 tracing 문맥', '고카디널리티', 'RestClient.Builder', '비밀번호'],
    },
    12: {
      lessonId: 'spring-api-operations-capstone',
      concepts: ['201', '멱등 키', '오류 DTO', '인가', 'trace ID'],
      markers: ['ResponseEntity.created', 'Idempotency-Key', 'INTERNAL_SERVER_ERROR', '.hasRole("ADMIN")', 'tracer.currentSpan()'],
      questionMarkers: ['ResponseEntity.ok(null)', 'paymentClient.charge(request)', 'error.getMessage()', '.authenticated()', 'UUID.randomUUID'],
      answers: [/생성 상태와 새 리소스의 위치·표현/, /멱등 키를 받아 처리 결과와 함께 기록/, /안정된 오류 코드.*5xx/, /인증 뒤에도.*관리 역할/, /현재 요청의 trace 문맥/],
    },
    13: {
      lessonId: 'spring-week-13',
      concepts: ['타입 안전 설정', 'prefix', '검증', '외부 값', '설정 문서화'],
      markers: ['Integer.parseInt(maxSize)', 'course.max-size=20', '@ConfigurationProperties', 'password=change-me', 'course.timeout=500'],
      answers: [/타입이 있는 ConfigurationProperties/, /prefix.*실제 설정 키/, /검증이 실행되도록/, /비밀번호는 배포 환경/, /Duration 값의 단위를 명시/],
      acceptedAnswers: ['@ConfigurationProperties', 'course-api', '@Validated', '비밀번호', '밀리초'],
    },
    14: {
      lessonId: 'spring-week-14',
      concepts: ['Pageable', '정렬 기준', '기본 크기', '최대 크기', '응답 메타데이터'],
      markers: ['PageRequest.of(page, size)', 'request.sort()', 'Pageable pageable', 'PageRequest.of(page, requestedSize)', 'page.getContent()'],
      answers: [/Pageable을 바인딩/, /허용 목록/, /기본값을 정하고/, /최대 페이지 크기/, /응답 DTO.*페이지 메타데이터/],
      acceptedAnswers: ['0', '허용 목록', '@PageableDefault', 'page >= 0, size >= 1', 'getTotalElements()'],
    },
    15: {
      lessonId: 'spring-week-15',
      concepts: ['지연 로딩', 'fetch join', '쿼리 수', 'DTO 조회', '측정'],
      markers: ['return repository.findAll()', 'left join fetch c.lessons', 'countByCourseId', 'repository.findByPublishedTrue()', '강좌 {}건 조회'],
      questionMarkers: ['return repository.findAll()', 'left join fetch c.lessons', 'countByCourseId', 'List<Course> findByPublishedTrue', 'courses.size()'],
      answers: [/서비스 경계에서 필요한 값만 DTO/, /필요한 컬렉션만 fetch/, /한 번의 쿼리/, /필요한 컬럼만 반환/, /PreparedStatement.*경과 시간/],
      acceptedAnswers: ['LazyInitializationException', '카티션 곱', '25', 'DTO projection', '26'],
    },
  };

  for (const [weekText, expected] of Object.entries(weeks)) {
    const week = Number(weekText);
    const lesson = getLesson(expected.lessonId);
    assert.ok(lesson, expected.lessonId);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (let day = 1; day <= 5; day += 1) {
      const id = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const choice = lesson.studyDays[day - 1].exercises.find((item) => item.id.startsWith(`${id}-choice`));
      const short = lesson.studyDays[day - 1].exercises.find((item) => item.id.startsWith(`${id}-short`));
      assert.ok(choice, `${id} choice`);
      assert.ok(short, `${id} short answer`);
      assert.equal(short.acceptedAnswers[0], expected.acceptedAnswers?.[day - 1] ?? expected.concepts[day - 1], short.id);
      assert.equal(lesson.studyDays[day - 1].exercises.filter((item) => item.id === choice.id || item.id === short.id).length, 2, id);
      assert.doesNotMatch(lesson.studyDays[day - 1].example, /UnsupportedOperationException|CourseBoundary/, `${id} study example`);
      assert.ok(lesson.studyDays[day - 1].example.includes(expected.markers[day - 1]), `${id} teaching example should match its concept`);
      assert.ok(choice.prompt.includes((expected.questionMarkers ?? expected.markers)[day - 1]), `${id} choice prompt should retain its diagnostic scenario`);
      const selected = choice.choices.find((item) => item.id === choice.answer)?.text;
      assert.match(selected, expected.answers[day - 1], choice.id);
      if (week === 11) assert.match(choice.choiceExplanations[choice.answer], /key-value|tracing|시계열|인증 비밀값|courseId.*outcome|원문 비밀번호/, choice.id);
      else if (week === 12) assert.match(choice.choiceExplanations[choice.answer], /[가-힣]/, choice.id);
      else if (week < 13) assert.equal(choice.choiceExplanations[choice.answer], short.explanation, choice.id);
      else {
        assert.match(choice.choiceExplanations[choice.answer], /[가-힣]/, choice.id);
        assert.doesNotMatch(choice.choiceExplanations[choice.answer], /핵심 개념|책임 경계를 분명하게/, choice.id);
      }
      for (const distractor of choice.choices.filter((item) => item.id !== choice.answer)) {
        const feedback = choice.choiceExplanations[distractor.id];
        assert.ok(feedback.length > 20, `${choice.id}/${distractor.id} needs a useful explanation`);
        assert.match(feedback, /[가-힣]/, `${choice.id}/${distractor.id} should be Korean`);
        assert.doesNotMatch(feedback, /코드에 나타난 .* 문제를 해결하지 못합니다/, `${choice.id}/${distractor.id} must explain the issue`);
      }

      if (day >= 4 || week >= 13) {
        const locate = lesson.studyDays[day - 1].exercises.find((item) => item.type === 'locate-error');
        assert.ok(locate, locate?.id ?? `${id} locate`);
        assert.equal(locate.answerLines.length, 1, locate.id);
        assert.ok(locate.codeLines[locate.answerLines[0] - 1].includes((expected.questionMarkers ?? expected.markers)[day - 1]), locate.id);
        if (week === 11 || week === 12) assert.match(locate.hint, /[가-힣]/, locate.id);
        if (week === 11) assert.match(locate.explanation, /관측|비밀|tracing/, locate.id);
        else if (week === 12) assert.match(locate.explanation, /[가-힣]/, locate.id);
        else if (week < 13) assert.equal(locate.explanation, short.explanation, locate.id);
        else {
          assert.match(locate.hint, /[가-힣]/, locate.id);
          assert.match(locate.explanation, /[가-힣]/, locate.id);
          assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/, locate.id);
        }
      }
    }
  }
});

test('Spring weeks 13 through 15 make each exercise scenario and its assumptions explicit', () => {
  const expectations = {
    13: [
      [/course\.max-size.*문자열/, /course-api/, /Validation 구현체/, /실제 운영 비밀번호/, /500밀리초/],
    ],
    14: [
      [/size=10000/, /internalNote/, /size를 생략하면 50개/, /최대 페이지 크기 100/, /전체 결과 수/],
    ],
    15: [
      [/OSIV.*비활성화/, /enrollments\(수강생 목록\).*lessons\(강의 목록\)/, /25개/, /id와 title/, /PreparedStatement.*걸린 시간/],
    ],
  };
  for (const week of [13, 14, 15]) {
    const lesson = getLesson(`spring-week-${String(week).padStart(2, '0')}`);
    for (let day = 1; day <= 5; day += 1) {
      const session = lesson.studyDays[day - 1];
      const id = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const choice = session.exercises.find((item) => item.id.startsWith(`${id}-choice`));
      const short = session.exercises.find((item) => item.id.startsWith(`${id}-short`));
      const locate = session.exercises.find((item) => item.type === 'locate-error');
      assert.match(choice.prompt, expectations[week][0][day - 1], choice.id);
      assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
      assert.match(short.explanation, /[가-힣]/, short.id);
      assert.match(locate.prompt, /[가-힣]/, locate.id);
      assert.match(locate.hint, /[가-힣]/, locate.id);
      assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/, locate.id);
    }
  }

  const validationSetup = getLesson('spring-week-13').studyDays[2].intro;
  assert.match(validationSetup, /Bean으로 등록/);
  assert.match(validationSetup, /Validation 구현체/);
  const lazyLoadingSetup = getLesson('spring-week-15').studyDays[0].intro;
  assert.match(lazyLoadingSetup, /OSIV가 비활성화/);
  const statisticsSetup = getLesson('spring-week-15').studyDays[4].intro;
  assert.match(statisticsSetup, /hibernate\.generate_statistics=true/);
  assert.match(statisticsSetup, /PreparedStatement/);
  assert.match(statisticsSetup, /SessionFactory.*누적/);
  assert.match(statisticsSetup, /실행 검증하지 않았습니다/);

  const countOnlyExample = getLesson('spring-week-15').studyDays[4].example;
  assert.match(countOnlyExample, /List<Course> courses = repository\.findAll\(\)/);
  assert.match(countOnlyExample, /log\.info\("강좌 \{\}건 조회", courses\.size\(\)\)/);
  assert.doesNotMatch(countOnlyExample, /getPrepareStatementCount\(\)|System\.nanoTime\(\)/);

  const fetchLesson = getLesson('spring-week-15');
  const fetchChoice = fetchLesson.studyDays[1].exercises.find((item) => item.type === 'choice');
  assert.match(fetchChoice.prompt, /enrollments\(수강생 목록\).*lessons\(강의 목록\)/);
  assert.match(fetchChoice.choiceExplanations[fetchChoice.answer], /곱집합.*MultipleBagFetchException/);
  const fetchShort = fetchLesson.studyDays[1].exercises.find((item) => item.type === 'short-answer');
  assert.doesNotMatch(fetchShort.prompt, /to-many/);
  assert.match(fetchShort.explanation, /Hibernate의 Bag.*MultipleBagFetchException/);

  const projectionExample = fetchLesson.studyDays[3].example;
  assert.match(projectionExample, /List<Course> findPublished\(\)/);
  assert.match(projectionExample, /return repository\.findByPublishedTrue\(\)/);

  const springSources = getTrack('spring').contentReview.sources.map((source) => source.url);
  assert.ok(springSources.includes('https://docs.hibernate.org/orm/7.4/querylanguage/html_single/'));
  assert.ok(springSources.includes('https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html'));
  assert.ok(springSources.includes('https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/stat/Statistics.html'));
  assert.ok(springSources.includes('https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/loader/MultipleBagFetchException.html'));
  assert.ok(springSources.includes('https://github.com/spring-projects/spring-boot/releases/tag/v4.1.2'));
  assert.ok(!springSources.some((url) => /\/orm\/(7\.0|7\.1|7\.2)\//.test(url)));
});

test('Spring weeks 11 and 12 replace repeated generic wording with scenario-specific review prompts', () => {
  const observability = getLesson('spring-observability-performance');
  const expectedPrompts = [
    /memberId와 courseId를 각각 검색/,
    /같은 요청의 trace를 이어야 합니다/,
    /courseId 값을 매번 다른 메트릭 태그/,
    /외부 호출에 관측 문맥을 이어 주려면/,
    /로그 수집·보존 권한을 개발팀만으로 제한할 수 없는/,
  ];
  for (let index = 0; index < 5; index += 1) {
    const day = index + 1;
    const prefix = `spring-w11-d${day}`;
    const session = observability.studyDays[index];
    const choice = session.exercises.find((item) => item.id.startsWith(`${prefix}-choice`));
    const short = session.exercises.find((item) => item.id.startsWith(`${prefix}-short`));
    assert.match(choice.prompt, expectedPrompts[index], choice.id);
    assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
    assert.equal(choice.answer, 'a', choice.id);
    assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
    assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
    for (const distractor of choice.choices.filter((item) => item.id !== choice.answer)) {
      assert.ok(choice.choiceExplanations[distractor.id].length > 25, `${choice.id}/${distractor.id}`);
    }
  }

  const extraChoice = getExercise('spring-observe-choice-v2');
  assert.match(extraChoice.prompt, /memberId와 courseId.*검색/);
  const extraLocate = getExercise('spring-observe-locate-v2');
  assert.deepEqual(extraLocate.answerLines, [2]);
  assert.match(extraLocate.codeLines[1], /courseId/);
  assert.match(extraLocate.explanation, /고유한.*시계열|시계열.*늘/);

  for (const [id, prompt, line] of [
    ['spring-w11-d4-locate-v2', /Boot.*관측 customizer/, 'RestClient.create'],
    ['spring-w11-d5-locate-v2', /비밀번호 원문/, 'password={}'],
    ['spring-w12-d4-locate-v2', /ADMIN 역할/, '.authenticated()'],
    ['spring-w12-d5-locate-v2', /활성 tracing 문맥/, 'UUID.randomUUID'],
  ]) {
    const locate = getExercise(id);
    assert.ok(locate, id);
    assert.match(locate.prompt, prompt, id);
    assert.ok(locate.codeLines[locate.answerLines[0] - 1].includes(line), id);
    assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/, id);
  }
});

test('Spring weeks 16 through 21 separate correct teaching examples from contextual repair cases', () => {
  const weeks = {
    16: {
      lessonId: 'spring-week-16',
      concepts: ['AFTER_COMMIT', 'transactional outbox', 'eventId', 'courseId와 title', '실패 상태'],
      answerLetters: ['b', 'a', 'c', 'b', 'a'],
      markers: ['@EventListener', 'broker.send(event)', 'receiptRepository.save', 'Course course', 'catch (RuntimeException ignored)'],
      exampleMarkers: ['@TransactionalEventListener', 'OutboxEvent.pending', 'insertIfAbsent(event.eventId())', 'record CoursePublished(long courseId', 'markRetryable'],
      answers: [/커밋 뒤 알림/, /outbox에 기록/, /eventId를 기록/, /불변 이벤트 DTO/, /실패를 기록/],
      prompts: [/트랜잭션이 되돌려지면 메일도 보내지 않아야/, /프로세스가 중단될 수/, /같은 .*이벤트가 두 번 전달/, /record는 엔티티 참조/, /broker\.send가 예외/],
    },
    17: {
      lessonId: 'spring-week-17',
      concepts: ['fake repository', '@MockitoBean', 'flush 후 clear', 'test', '404'],
      answerLetters: ['c', 'b', 'a', 'c', 'b'],
      markers: ['@SpringBootTest', '@Autowired CourseService service', 'findById', '@ActiveProfiles("prod")', 'status().isOk()'],
      exampleMarkers: ['InMemoryCourseRepository', '@MockitoBean', 'entityManager.flush()', '@ActiveProfiles("test")', 'isNotFound()'],
      answers: [/가짜 협력자를 주입/, /서비스 협력자를 mock bean/, /flush와 clear 뒤/, /테스트 전용 datasource/, /상태 코드와 오류 응답 본문/],
      prompts: [/저장소를 대체하는 구성/, /@WebMvcTest에서 .*빈이 없어/, /repository\.save 후 findById/, /prod 프로파일/, /status\(\)\.isOk\(\)/],
    },
    18: {
      lessonId: 'spring-week-18',
      concepts: ['@ServiceConnection', 'Spring 관리 Bean', 'migration 이력과 스크립트', '테스트별 고유 식별자', '단위 테스트'],
      answerLetters: ['a', 'c', 'b', 'a', 'c'],
      markers: ['5432/dev', '@Container', 'spring.flyway.enabled=false', '42L', '@SpringBootTest'],
      exampleMarkers: ['@ServiceConnection', '@Bean', 'spring.flyway.enabled=true', 'UUID.randomUUID()', 'new PriceFormatter()'],
      answers: [/컨테이너 연결/, /Spring context보다 오래 살아 있는 Spring 관리 컨테이너/, /운영과 같은 Flyway\/Liquibase migration/, /테스트마다 고유한 데이터/, /빠른 단위 테스트/],
      prompts: [/@Testcontainers.*spring\.datasource\.url/, /@Container.*Spring 컨텍스트는 재사용/, /spring\.flyway\.enabled=false/, /기본 키 42/, /PriceFormatter\.format\(1000\)/],
    },
    19: {
      lessonId: 'spring-week-19',
      concepts: ['JwtDecoder', 'aud', 'SCOPE_courses.read', '401, 403', 'hasAuthority("SCOPE_courses.read")'],
      answerLetters: ['b', 'c', 'a', 'b', 'c'],
      markers: ['decodeBase64Payload', 'decoder.setJwtValidator', 'hasAuthority("courses.read")', '.requestMatchers("/admin/**").authenticated()', 'hasRole("SCOPE_courses.read")'],
      exampleMarkers: ['oauth2ResourceServer', 'jwt.audiences=', 'SCOPE_courses.read', 'hasRole("ADMIN")', 'hasAuthority("SCOPE_courses.read")'],
      answers: [/JwtDecoder/, /aud claim/, /SCOPE_/, /401.*403/, /hasAuthority/],
      prompts: [/서명이나 발급자 검증/, /`aud`가.*https:\/\/api\.example\.com/, /JWT의 `scope` claim/, /유효한 토큰.*403/, /기본 scope converter/],
    },
    20: {
      lessonId: 'spring-week-20',
      concepts: ['scheme, host, port', '인증과 인가', '정확한 허용 출처', 'CSRF 보호', 'GET과 POST'],
      answerLetters: ['a', 'b', 'c', 'a', 'b'],
      markers: ['endsWith("example.com")', 'cors.isAllowedOrigin', 'setAllowCredentials(true)', 'csrf.disable', 'allowedMethods("*")'],
      exampleMarkers: ['allowedOrigins("https://app.example.com")', 'authorizeHttpRequests', 'setAllowedOrigins(List.of("https://app.example.com"))', 'csrf(Customizer.withDefaults())', 'allowedMethods("GET", "POST")'],
      answers: [/scheme·host·port/, /CORS 정책과 별도로/, /자격 증명을 포함하는 요청에는.*출처를 구체적으로/, /CSRF 보호를 유지/, /실제 API 계약에 필요한 GET과 POST/],
      prompts: [/evil-example\.com/, /로그인하지 않은 사용자/, /세션 쿠키를 포함/, /폼 로그인과 세션 쿠키/, /GET 조회와 POST 생성/],
    },
    21: {
      lessonId: 'spring-week-21',
      concepts: ['별도 Spring 빈', '유한 대기열', 'AsyncUncaughtExceptionHandler', 'actorId', 'Thread.currentThread().interrupt()'],
      answerLetters: ['c', 'a', 'b', 'c', 'a'],
      markers: ['this.sendAsync(event)', 'setQueueCapacity(Integer.MAX_VALUE)', 'catch (MailException error)', 'Executors.newFixedThreadPool(8)', 'catch (InterruptedException ignored)'],
      exampleMarkers: ['private final NotificationTask task', 'setQueueCapacity(200)', 'CompletableFuture<Void> send', 'String actorId = authentication.getName()', 'Thread.currentThread().interrupt()'],
      answers: [/별도 Spring 빈/, /크기가 제한된 대기열.*포화 시 대응/, /Future를 반환/, /actor ID.*작업 인자/, /작업을 멈춘다/],
      prompts: [/기본 프록시 방식/, /대기열 크기에 사실상 상한이 없습니다/, /호출자가 작업의 성공·실패/, /일반 Executor/, /보고서 작성을 멈춰/],
    },
  };

  for (const [weekText, expected] of Object.entries(weeks)) {
    const week = Number(weekText);
    const lesson = getLesson(expected.lessonId);
    assert.ok(lesson, expected.lessonId);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (let day = 1; day <= 5; day += 1) {
      const id = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const session = lesson.studyDays[day - 1];
      const choice = session.exercises.find((item) => item.id.startsWith(`${id}-choice`));
      const short = session.exercises.find((item) => item.id.startsWith(`${id}-short`));
      const locate = session.exercises.find((item) => item.type === 'locate-error');
      assert.ok(choice, `${id} choice`);
      assert.ok(short, `${id} short answer`);
      assert.ok(locate, `${id} locate`);
      assert.equal(short.acceptedAnswers[0], expected.concepts[day - 1], short.id);
      assert.equal(choice.answer, expected.answerLetters?.[day - 1] ?? 'a', choice.id);
      assert.doesNotMatch(lesson.studyDays[day - 1].example, /UnsupportedOperationException|CourseBoundary/, `${id} study example`);
      assert.ok(lesson.studyDays[day - 1].example.includes(expected.exampleMarkers?.[day - 1] ?? expected.markers[day - 1]), `${id} teaching example marker`);
      assert.ok(choice.prompt.includes(expected.markers[day - 1]), `${id} repair case must use its question marker`);
      if (week >= 16 && week <= 21) {
        assert.notEqual(lesson.studyDays[day - 1].example, choice.prompt.slice(choice.prompt.indexOf('\n\n') + 2), `${id} must not reuse the faulty repair snippet as the worked example`);
      }
      if (expected.prompts) {
        assert.match(choice.prompt, expected.prompts[day - 1], choice.id);
        assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
        assert.match(short.hint, /[가-힣]/, short.id);
        assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/, locate.id);
        assert.match(locate.prompt, /[가-힣]/, locate.id);
      }
      const answer = choice.choices.find((item) => item.id === choice.answer)?.text;
      assert.match(answer, expected.answers[day - 1], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      assert.equal(gradeAnswer(short, short.acceptedAnswers[0]), true, short.id);
      assert.equal(choice.choiceExplanations[choice.answer], short.explanation, choice.id);
      for (const distractor of choice.choices.filter((item) => item.id !== choice.answer)) {
        const feedback = choice.choiceExplanations[distractor.id];
        assert.ok(feedback.length > 20, `${choice.id}/${distractor.id} needs a useful explanation`);
        assert.doesNotMatch(feedback, /해결하지 못합니다$/, `${choice.id}/${distractor.id} must explain the issue`);
      }
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1].includes(expected.markers[day - 1]), locate.id);
      assert.equal(locate.explanation, short.explanation, locate.id);
    }
  }

  const answerLetters = [16, 17, 18, 19, 20, 21].flatMap((week) =>
    getLesson(`spring-week-${String(week).padStart(2, '0')}`).studyDays.map((day) => day.exercises.find((item) => item.type === 'choice').answer),
  );
  assert.deepEqual(
    answerLetters.reduce((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 }),
    { a: 10, b: 10, c: 10 },
  );
});

test('Spring weeks 22 through 24 balance correct answer positions', () => {
  const answerLetters = [22, 23, 24].flatMap((week) =>
    getLesson(`spring-week-${String(week).padStart(2, '0')}`).studyDays.map((day) => day.exercises.find((item) => item.type === 'choice').answer),
  );
  assert.deepEqual(
    answerLetters.reduce((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 }),
    { a: 5, b: 5, c: 5 },
  );
});

test('Spring weeks 25 and 26 version changed choice contracts and balance correct positions', () => {
  const answerLetters = [25, 26].flatMap((week) =>
    getLesson(`spring-week-${String(week).padStart(2, '0')}`).studyDays.map((day) => day.exercises.find((item) => item.type === 'choice').answer),
  );
  assert.deepEqual(
    answerLetters.reduce((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 }),
    { a: 4, b: 3, c: 3 },
  );
  for (const week of [22, 23, 24, 25, 26]) {
    const lesson = getLesson(`spring-week-${String(week).padStart(2, '0')}`);
    for (const session of lesson.studyDays) {
      const choice = session.exercises.find((item) => item.type === 'choice');
      assert.match(choice.id, /-choice-v2$/, choice.id);
    }
  }
});

test('Spring weeks 21 through 26 use contextual operational cases and question-specific feedback', () => {
  const weeks = {
    21: {
      lessonId: 'spring-week-21',
      concepts: ['별도 Spring 빈', '유한 대기열', 'AsyncUncaughtExceptionHandler', 'actorId', 'Thread.currentThread().interrupt()'],
      answerLetters: ['c', 'a', 'b', 'c', 'a'],
      markers: ['this.sendAsync(event)', 'setQueueCapacity(Integer.MAX_VALUE)', 'catch (MailException error)', 'Executors.newFixedThreadPool(8)', 'catch (InterruptedException ignored)'],
      exampleMarkers: ['private final NotificationTask task', 'setQueueCapacity(200)', 'CompletableFuture<Void> send', 'String actorId = authentication.getName()', 'Thread.currentThread().interrupt()'],
      answers: [/별도 Spring 빈/, /크기가 제한된 대기열.*포화 시 대응/, /Future를 반환/, /actor ID.*작업 인자/, /작업을 멈춘다/],
      prompts: [/기본 프록시 방식/, /대기열 크기에 사실상 상한이 없습니다/, /호출자가 작업의 성공·실패/, /일반 Executor/, /보고서 작성을 멈춰/],
    },
    22: {
      lessonId: 'spring-week-22',
      concepts: ['health group', 'liveness', 'readiness', '커스텀 메트릭', '인증·인가와 네트워크 접근 제어'],
      answerLetters: ['b', 'a', 'c', 'a', 'b'],
      markers: ['probes.enabled=false', 'group.liveness.include=', 'group.readiness.include=', 'tag("courseId"', 'exposure.include=*'],
      exampleMarkers: ['probes.enabled=true', 'include=livenessState', 'include=readinessState,db', '.tag("outcome", outcome)', 'exposure.include=health,info'],
      answers: [/배포에서 실제로 쓰는 probe health group/, /공유 DB 상태를 liveness에서 제외/, /DB 없이는 업무 요청을 처리할 수/, /제한된 outcome 값을 meter tag/, /필요한 endpoint만 노출/],
      prompts: [/Kubernetes manifest.*\/livez.*\/readyz/, /모든 앱 인스턴스가 공유 DB/, /모든 강좌 요청은 DB/, /`courseId`는 수십만 개/, /Spring Security 의존성이 없어.*gateway가 인터넷 요청/],
    },
    23: {
      lessonId: 'spring-week-23',
      concepts: ['JSON exec form', '실행 시', 'EXPOSE', 'runtime secret 주입', 'digest'],
      answerLetters: ['c', 'a', 'b', 'c', 'a'],
      markers: ['ENTRYPOINT java -jar', 'ENV SPRING_PROFILES_ACTIVE=', 'EXPOSE 8080', 'ENV DB_PASSWORD=', 'FROM eclipse-temurin:21-jre'],
      exampleMarkers: ['ENTRYPOINT ["java"', 'SPRING_PROFILES_ACTIVE는 배포 설정에서 주입합니다.', 'docker run -p 8080:8080', 'RUN --mount=type=secret', '@sha256:<verified-platform-digest>'],
      answers: [/JSON exec form으로 Java를 직접 실행/, /환경별 profile을 배포 시 주입/, /EXPOSE.*별도로.*-p/, /빌드 전용 값은 BuildKit secret mount/, /digest로 정확한 image content/],
      prompts: [/Java 프로세스가 SIGTERM/, /같은 image를 사용/, /EXPOSE 8080.*실행 컴퓨터에서 접속/, /비공개 저장소 token/, /동일 base image content/],
    },
    24: {
      lessonId: 'spring-week-24',
      concepts: ['RollingUpdate', 'expand/contract', 'rollback', '애플리케이션 시작 시', 'p95 latency'],
      answerLetters: ['b', 'c', 'a', 'b', 'c'],
      markers: ['type: Recreate', 'RENAME COLUMN title', 'DROP COLUMN title', 'course.timeout:PT0S', 'availableReplicas == desiredReplicas'],
      exampleMarkers: ['type: RollingUpdate', 'ADD COLUMN name varchar', '복구 기간이 끝난 뒤에만 구 컬럼을 제거합니다.', 'timeout.isZero()', 'p95Latency()'],
      answers: [/readiness와 충분한 surge 용량/, /새 컬럼 추가·backfill/, /rollback 창 동안 구버전 앱이 읽는 컬럼/, /필수 timeout을 시작 시/, /replica readiness에 더해 오류율/],
      prompts: [/새 Kubernetes pod가 Ready/, /v1은 `title`, v2는 `name`/, /직전 애플리케이션으로 되돌릴 수/, /양수 Duration/, /모든 pod가 Ready/],
    },
    25: {
      lessonId: 'spring-week-25',
      concepts: ['하위 호환성', '선택 필드', 'deprecated', '404', 'title을 유지하고 선택 필드 추가'],
      answerLetters: ['a', 'b', 'c', 'a', 'b'],
      markers: ['/api/v2/courses', 'required: [title, displayName]', '@Deprecated', '"200":', 'record CourseView(String courseId'],
      exampleMarkers: ['/api/v1/courses', 'required: [title]', 'deprecated: true', '"404":', 'title: { type: string }'],
      answers: [/기존 앱이 옮길 때까지 v1 주소를 지원/, /기존 요청을 받으려면 새 필드는 선택값/, /OpenAPI 문서에 사용 종료 예정/, /문서에 실제 404 응답/, /기존 `title`을 유지/],
      prompts: [/모바일 앱이 `\/api\/v1\/courses`를 계속 호출/, /v1 모바일 앱은 `title`만 보냅니다/, /v1은 단계적으로 종료/, /`404`와 `ApiError` JSON/, /외부 앱이 응답의 `title`/],
    },
    26: {
      lessonId: 'spring-week-26',
      concepts: ['원자적 조건부 UPDATE', '404', '소유권 또는 접근 권한', '저카디널리티', '기한과 검증 가능한 완료 조건'],
      answerLetters: ['c', 'a', 'b', 'c', 'a'],
      markers: ['countByCourseId', 'ResponseEntity.ok(error.getMessage())', 'return CourseView.from(course)', 'counter.tag("requestId"', 'new ActionItem("DB 시간 제한 추가"'],
      exampleMarkers: ['UPDATE course SET seats_left = seats_left - 1', 'HttpStatus.NOT_FOUND', 'authorization.assertCanRead', '.tag("outcome"', '"플랫폼 팀"'],
      answers: [/DB에서 남은 좌석이 양수일 때만 원자적으로 줄이고/, /알려진 도메인 오류는 안전한 오류 DTO/, /인증된 현재 사용자와 불러온 강좌/, /메트릭에는 정해진 결과 태그만/, /담당자·완료 기한·검증 가능한 결과/],
      prompts: [/마지막 한 자리를 두 요청이 동시에 신청/, /없는 강좌 요청/, /회원 A가 URL의 `courseId`를 회원 B의 ID/, /요청마다 다른 `requestId`/, /장애 회고에서 “DB 시간 제한 추가”/],
    },
  };

  for (const [weekText, expected] of Object.entries(weeks)) {
    const week = Number(weekText);
    const lesson = getLesson(expected.lessonId);
    assert.ok(lesson, expected.lessonId);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    for (let day = 1; day <= 5; day += 1) {
      const id = `spring-w${String(week).padStart(2, '0')}-d${day}`;
      const choice = lesson.studyDays[day - 1].exercises.find((item) => item.id.startsWith(`${id}-choice`));
      const short = lesson.studyDays[day - 1].exercises.find((item) => item.id.startsWith(`${id}-short`));
      const locate = lesson.studyDays[day - 1].exercises.find((item) => item.type === 'locate-error');
      const marker = expected.markers[day - 1];
      assert.ok(choice && short && locate, id);
      assert.equal(short.acceptedAnswers[0], expected.concepts[day - 1], short.id);
      assert.equal(choice.answer, expected.answerLetters?.[day - 1] ?? 'a', choice.id);
      assert.ok(lesson.studyDays[day - 1].example.includes(expected.exampleMarkers?.[day - 1] ?? marker), `${id} teaching example marker`);
      if (week >= 16 && week <= 26) {
        assert.notEqual(lesson.studyDays[day - 1].example, choice.prompt.slice(choice.prompt.indexOf('\n\n') + 2), `${id} must not reuse the faulty repair snippet as the worked example`);
      }
      assert.ok(choice.prompt.includes(marker), `${id} choice must use its example`);
      if (expected.prompts) {
        assert.match(choice.prompt, expected.prompts[day - 1], choice.id);
        assert.doesNotMatch(short.prompt, /핵심 개념의 이름을 입력/, short.id);
        assert.doesNotMatch(locate.hint, /Spring 프록시, HTTP 바인딩, 설정 비밀값/, locate.id);
      }
      assert.match(choice.choices.find((item) => item.id === choice.answer)?.text, expected.answers[day - 1], choice.id);
      assert.equal(choice.choiceExplanations[choice.answer], short.explanation, choice.id);
      for (const distractor of choice.choices.filter((item) => item.id !== choice.answer)) {
        const explanation = choice.choiceExplanations[distractor.id];
        assert.ok(explanation.length > 20, `${choice.id}/${distractor.id}`);
        assert.doesNotMatch(explanation, /해결하지 못합니다$/, `${choice.id}/${distractor.id}`);
      }
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1].includes(marker), `${locate.id} selected defect`);
      assert.equal(locate.explanation, short.explanation, locate.id);
    }
  }
});

test('Spring W16 D3 makes duplicate event recording atomic before business work', () => {
  const day = getLesson('spring-week-16').studyDays[2];
  const choice = getExercise('spring-w16-d3-choice');
  const short = getExercise('spring-w16-d3-short-v2');

  assert.match(day.example, /@Transactional/);
  assert.match(day.example, /insertIfAbsent\(event\.eventId\(\)\)/);
  assert.doesNotMatch(day.example, /existsById/);
  assert.match(day.example, /enrollmentService\.apply\(event\)/);
  assert.match(short.explanation, /eventId.*고유 제약/);
  assert.match(short.explanation, /한 트랜잭션/);
  assert.equal(choice.choiceExplanations[choice.answer], short.explanation);
});

test('Spring W18 imports Spring-managed Testcontainers and keeps formatter output consistent', () => {
  const containerDay = getLesson('spring-week-18').studyDays[1];
  const formatterDay = getLesson('spring-week-18').studyDays[4];
  const formatterChoice = getExercise('spring-w18-d5-choice');
  const formatterShort = getExercise('spring-w18-d5-short-v2');

  assert.match(containerDay.example, /@TestConfiguration\(proxyBeanMethods = false\)/);
  assert.match(containerDay.example, /@Bean\s+@ServiceConnection/);
  assert.match(containerDay.example, /@Import\(ContainerConfiguration\.class\)/);
  assert.match(formatterDay.example, /assertEquals\("1,000원", formatter\.format\(1000\)\)/);
  assert.match(formatterChoice.prompt, /assertEquals\("1,000원", formatter\.format\(1000\)\)/);
  assert.equal(formatterChoice.choiceExplanations[formatterChoice.answer], formatterShort.explanation);
});

test('Spring W19 security examples use Korean comments and one exact scope authority answer', () => {
  const tokenDay = getLesson('spring-week-19').studyDays[0];
  const roleDay = getLesson('spring-week-19').studyDays[3];
  const scopeAnswer = getExercise('spring-w19-d3-short-v2');

  assert.match(tokenDay.example, /신뢰하는 인증 서버의 issuer-uri/);
  assert.doesNotMatch(tokenDay.example, /Configure issuer-uri/);
  assert.match(roleDay.example, /JWT 권한 변환기가 roles claim/);
  assert.doesNotMatch(roleDay.example, /The JWT converter/);
  assert.deepEqual(scopeAnswer.acceptedAnswers, ['SCOPE_courses.read']);
  assert.equal(gradeAnswer(scopeAnswer, 'SCOPE_courses.read'), true);
});

test('Spring W19–W21 repair prompts keep explanatory code comments in Korean', () => {
  const audiencePrompt = getExercise('spring-w19-d2-short-v2').prompt;
  const interruptPrompt = getExercise('spring-w21-d5-short-v3').prompt;

  assert.match(audiencePrompt, /audienceValidator를 결합하지 않았습니다/);
  assert.match(interruptPrompt, /중단 요청을 무시하고 계속 진행/);
  assert.doesNotMatch(`${audiencePrompt}\n${interruptPrompt}`, /audienceValidator is not composed|\/\/ continue/);
});

test('Spring W22–W26 learner examples and repair snippets do not leave instructional comments in English', () => {
  const learnerText = [22, 23, 24, 25, 26]
    .flatMap((week) => getLesson(`spring-week-${week}`).studyDays)
    .flatMap((day) => [day.example, ...day.exercises.map((exercise) => exercise.prompt)])
    .join('\n');

  assert.doesNotMatch(learnerText, /Kubernetes HTTP probe paths|A shared database outage|Every course request requires|Restrict these routes/);
  assert.doesNotMatch(learnerText, /Keep one artifact|Set SPRING_PROFILES_ACTIVE in deployment|One immutable image/);
  assert.doesNotMatch(learnerText, /Local run:|Cluster routing is configured|Build tooling reads|Application DB credentials/);
  assert.doesNotMatch(learnerText, /Review upstream security|Release builds must reproduce|Keep old ready pods/);
  assert.doesNotMatch(learnerText, /Expand: add a nullable|Backfill and deploy|Contract only after|Requirement: replace instances/);
  assert.doesNotMatch(learnerText, /course\.timeout is required and must be positive/);
  assert.doesNotMatch(learnerText, /Existing clients still call|Omitted displayName remains|The endpoint returns 404|existing client field remains|optional additive field/);
  assert.doesNotMatch(learnerText, /only the owner may read|fixed values: success|Add database timeout|platform-team|staging request fails/);
});

test('Spring W23 port repair asks learners to find an explicit false claim', () => {
  const locate = getExercise('spring-w23-d3-locate-v2');

  assert.deepEqual(locate.answerLines, [3]);
  assert.match(locate.codeLines[2], /EXPOSE 8080만으로 실행 컴퓨터의 8080 포트도 자동 공개됩니다/);
  assert.match(locate.explanation, /EXPOSE.*컨테이너에서 사용할 포트를 기록할 뿐 실행 컴퓨터에 공개하지 않습니다/);
});

test('Spring W23 keeps the container entry point compatible with deployment profile injection', () => {
  const week = getLesson('spring-week-23');
  const entryPoint = week.studyDays[0].example;
  const profile = week.studyDays[1].example;

  assert.match(entryPoint, /ENTRYPOINT \["java", "-jar", "app\.jar"\]/);
  assert.doesNotMatch(entryPoint, /CMD .*spring\.profiles\.active/);
  assert.match(profile, /SPRING_PROFILES_ACTIVE는 배포 설정에서 주입합니다/);
  assert.match(profile, /name: SPRING_PROFILES_ACTIVE[\s\S]*value: prod/);
});

test('Spring W24 migration and configuration examples show the required setup', () => {
  const migration = getLesson('spring-week-24').studyDays[1];
  const config = getLesson('spring-week-24').studyDays[3];

  assert.ok(migration.example.indexOf('ALTER TABLE courses ADD COLUMN name') < migration.example.indexOf('UPDATE courses SET name = title'));
  assert.match(migration.example, /구 버전이 모두 종료된 뒤/);
  assert.match(migration.intro, /두 컬럼에 함께 쓰는 호환 버전/);
  assert.match(migration.intro, /구 버전이 모두 종료된 뒤.*기존 행/);
  assert.match(config.example, /@ConfigurationPropertiesScan/);
  assert.match(config.example, /course\.timeout=3s/);
  assert.match(config.intro, /직접 검증/);
  assert.match(config.intro, /Bean Validation으로 바꿀 때는 `@Validated`/);
});

test('Spring W26 D5 action item example and repair question include all tracked fields', () => {
  const day = getLesson('spring-week-26').studyDays[4];
  const choice = getExercise('spring-w26-d5-choice-v2');

  assert.match(day.example, /"플랫폼 팀",\s*LocalDate\.parse\("2026-11-15"\),/);
  assert.match(day.example, /스테이징에서 요청이 설정한 시간 안에 실패하는지 확인/);
  assert.match(choice.prompt, /new ActionItem\("DB 시간 제한 추가", null, null, null\)/);
});

test('Spring W25–W26 use clear Korean session labels and state the W26 enrollment precondition', () => {
  const expectedTitles = [
    ['기존 API 경로 유지', '선택 항목 추가', '사용 종료 예고', '오류 응답 문서화', '기존 앱 호환'],
    ['정원 초과 방지', '안전한 오류 응답', '강좌 접근 권한', '요청 지표 구분', '회고 조치 추적'],
  ];

  for (const [weekIndex, week] of [25, 26].entries()) {
    const days = getLesson(`spring-week-${week}`).studyDays;
    assert.deepEqual(days.map((day) => day.title), expectedTitles[weekIndex]);
    assert.equal(new Set(days.map((day) => day.intro)).size, 5);
    for (const day of days) {
      assert.ok(day.intro.length > 45, `${week}/${day.number} should explain the example`);
      assert.doesNotMatch(`${day.title} ${day.objective} ${day.intro}`, /deprecation|endpoint|migration|consumer|strict decoder|principal|owner\/share|authorization service|cardinality|meter tag/i);
      assert.doesNotMatch(day.intro, /오늘의 주제는|실행 앱이 아니라 개념을 설명하는 Spring 스니펫/);
    }
  }

  const enrollmentDay = getLesson('spring-week-26').studyDays[0];
  const enrollmentChoice = getExercise('spring-w26-d1-choice-v2');
  assert.match(enrollmentDay.intro, /강좌 존재와 신청 권한을 먼저 확인/);
  assert.match(enrollmentDay.intro, /동시 강좌 삭제는 다루지 않습니다/);
  assert.match(enrollmentDay.intro, /READ COMMITTED/);
  assert.match(enrollmentDay.intro, /REPEATABLE READ.*SERIALIZABLE.*직렬화 오류/);
  assert.match(enrollmentChoice.prompt, /강좌가 있고 신청 권한도 확인된 상태/);
  assert.match(enrollmentDay.example, /DB 고유 제약: \(course_id, member_id\)/);
  const deprecatedDay = getLesson('spring-week-25').studyDays[2];
  const deprecatedChoice = getExercise('spring-w25-d3-choice-v2');
  assert.doesNotMatch(deprecatedDay.title, /deprecation/i);
  assert.doesNotMatch(deprecatedChoice.title + deprecatedChoice.prompt, /deprecation|Operation Object|endpoint/i);
});

test('Spring W13 D4 distinguishes the change-me placeholder from a real credential', () => {
  const day = getLesson('spring-week-13').studyDays[3];
  const choice = day.exercises.find((exercise) => exercise.type === 'choice');
  const short = day.exercises.find((exercise) => exercise.type === 'short-answer');
  const locate = day.exercises.find((exercise) => exercise.type === 'locate-error');

  assert.match(day.intro, /change-me는.*자리표시자/);
  assert.match(day.example, /spring\.datasource\.password=change-me/);
  assert.match(choice.prompt, /change-me.*자리표시자/);
  assert.match(choice.choiceExplanations[choice.answer], /실제.*비밀번호.*배포 환경/);
  assert.match(short.prompt, /change-me.*자리표시자/);
  assert.match(short.explanation, /실제.*비밀번호/);
  assert.match(locate.prompt, /자리표시자/);
  assert.doesNotMatch(locate.prompt, /실제 배포 자격 증명을 이력에 남기는 줄/);
});

test('Spring weeks 16 through 18 keep explanatory code comments in Korean', () => {
  const learnerText = [16, 17, 18]
    .flatMap((week) => getLesson(`spring-week-${week}`).studyDays)
    .flatMap((day) => [day.example, ...day.exercises.flatMap((exercise) => [exercise.prompt, ...(exercise.codeLines ?? [])])])
    .join('\n');

  assert.doesNotMatch(learnerText, /\/\/ ignore|\/\/ test profile points only|# Run the same versioned migration path/);
});

test('Spring weeks 13 through 26 use specific Korean summaries without repeated filler', () => {
  for (let week = 13; week <= 26; week += 1) {
    const lesson = getLesson(`spring-week-${week}`);
    assert.ok(lesson, `spring-week-${week}`);
    assert.doesNotMatch(lesson.objective, /을\(를\)|를\(을\)/, lesson.id);
    assert.equal(lesson.points.length, 0, `${lesson.id} should not repeat the same generic bullet list`);
    assert.doesNotMatch(lesson.intro, /다섯 일차는|개념 스니펫|프로젝트의 Spring Boot 버전과 의존성/, lesson.id);
  }

  assert.match(getLesson('spring-week-19').studyDays[1].title, /발급자\(issuer\).*대상\(aud\)/);
  assert.match(getLesson('spring-week-20').studyDays[2].title, /자격 증명/);
  assert.match(getLesson('spring-week-21').studyDays[1].title, /작업 실행기\(Executor\)/);
});

test('Spring weekly lesson titles do not repeat the week number shown in the lesson header', () => {
  const spring = getTrack('spring');
  assert.equal(spring.lessons.length, 26);

  for (const lesson of spring.lessons) {
    assert.doesNotMatch(lesson.title, /^\d+주차\s*[·:]/, lesson.id);
  }
});
