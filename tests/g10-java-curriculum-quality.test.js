import test from 'node:test';
import assert from 'node:assert/strict';
import { getExercise, getLesson, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const javaTrack = tracks.find((track) => track.id === 'java');

function assertPreviousId(exercise, previousId, label) {
  const previousExercise = getExercise(previousId);
  if (exercise.legacyIds?.includes(previousId)) assert.equal(previousExercise?.id, exercise.id, `${label} saved progress alias`);
  else assert.equal(previousExercise, null, label);
}
const initialWeeks = javaTrack.lessons.filter((lesson) => lesson.week >= 1 && lesson.week <= 3);
const genericFeedback = /핵심 제약을 만족하지 않거나|관련된 개념일 수 있지만|이 근거를 예제의 타입·메서드·비교식과 연결|규칙·타입·API·연산을 나타내는 말을 적으세요/;

test('Java initial lessons 1–3 have concrete concepts, recalls, examples, and daily scenarios', () => {
  assert.equal(initialWeeks.length, 3);
  const days = initialWeeks.flatMap((week) => week.studyDays);
  assert.equal(days.length, 15);

  days.forEach((day, index) => {
    const week = Math.floor(index / 5) + 1;
    const dayNumber = (index % 5) + 1;
    const prefix = `java-w${week}-d${dayNumber}`;
    const concept = day.exercises.find((exercise) => exercise.id.startsWith(`${prefix}-choice`));
    const recall = day.exercises.find((exercise) => exercise.id.startsWith(`${prefix}-short`));

    assert.ok(day.intro.length > 70, day.title);
    assert.doesNotMatch(day.intro, /입력과 결과를 따라가며 핵심 규칙을 확인하고/);
    assert.ok(day.example.includes('public static void main(String[] args)'), day.title);
    assert.ok(concept, `${prefix} concept`);
    assert.ok(concept.prompt.length > 35, concept.id);
    assert.doesNotMatch(concept.prompt, /가장 타당한 선택은 무엇인가요\?$/);
    assert.ok(concept.choices.every((option) => concept.choiceExplanations[option.id]?.length > 16), concept.id);
    assert.doesNotMatch(Object.values(concept.choiceExplanations).join(' '), genericFeedback);
    if (dayNumber === 4) {
      const repair = day.exercises.find((exercise) => exercise.id === `${prefix}-repair-v2`);
      assert.ok(repair, `${prefix} repair`);
      assert.ok(repair.prompt.length > 45, repair.id);
      assert.ok(repair.hint.length > 25, repair.id);
      assert.ok(repair.acceptanceCriteria.tests.length >= 2, repair.id);
      assert.match(repair.gradingNote, /실행형 채점은 아니며/);
    } else {
      assert.ok(recall, `${prefix} recall`);
      assert.ok(recall.prompt.length > 30, recall.id);
      assert.ok(recall.hint.length > 20, recall.id);
      assert.ok(recall.explanation.length > 35, recall.id);
      assert.doesNotMatch(`${recall.prompt} ${recall.explanation}`, genericFeedback);
      assert.equal(gradeAnswer(recall, recall.acceptedAnswers[0]), true, recall.id);
    }

    if (dayNumber >= 4) {
      const application = day.exercises.find((exercise) => exercise.id === `${prefix}-apply-v3`);
      assert.ok(application, `${prefix} application`);
      assert.ok(application.prompt.length > 35, application.id);
      assert.ok(application.hint.length > 25, application.id);
      assert.ok(application.explanation.length > 35, application.id);
      assert.doesNotMatch(Object.values(application.choiceExplanations).join(' '), genericFeedback);
    }
  });
});

test('Java foundational question revisions use new IDs and retain stable catalog questions', () => {
  for (const week of initialWeeks) {
    const original = week.studyDays.flatMap((day) => day.exercises).filter((exercise) =>
      !/-v\d+$/.test(exercise.id));
    assert.ok(original.length > 0, week.title);
    original.forEach((exercise) => assert.ok(getExercise(exercise.id), exercise.id));
  }
});

test('Java local variables cannot be read before initialization', () => {
  const question = getExercise('java-w1-d1-choice-v3');
  assert.ok(question);
  assert.equal(getExercise('java-w1-d1-choice-v2'), null);
  assert.match(question.prompt, /첫 대입 전에 읽으려/);
  assert.match(question.choices.find((option) => option.id === question.answer).text, /초기화하기 전에 읽을 수 없어요/);
  assert.match(question.choiceExplanations[question.answer], /컴파일 오류/);
  assert.equal(gradeAnswer(question, question.answer), true);
});

test('Java questions distinguish the parameter, return, overloading, constructor, access, and abstract-class checks', () => {
  const cases = [
    ['java-w4-d1-short-v3', '인자', 'java-w4-d1-short-v2', /add\(2, 3\)/],
    ['java-w4-d2-choice-v3', 'if 본문이 실행돼요.', 'java-w4-d2-choice-v2', /어느 본문이 실행/],
    ['java-w4-d2-short-v3', 'false', 'java-w4-d2-short-v2', /isComplete\(0\)/],
    ['java-w4-d3-short-v3', '4', 'java-w4-d3-short-v2', /absolute\(-4\)/],
    ['java-w4-d5-short-v3', '5.5', 'java-w4-d5-short-v2', /sum\(2\.0, 3\.5\)/],
    ['java-w5-d1-choice-v3', 'title 필드', 'java-w5-d1-choice-v2', /어느 필드에 저장/],
    ['java-w5-d1-short-v3', 'Course', 'java-w5-d1-short-v2', /생성자 이름/],
    ['java-w5-d2-short-v3', 'Course.createdCount()', 'java-w5-d2-short-v2', /어떤 호출/],
    ['java-w5-d3-choice-v3', '`protected int getMinutes()`를 제공한다', 'java-w5-d3-choice-v2', /하위 클래스가 다른 패키지/],
    ['java-w5-d3-short-v3', 'course.getMinutes()', 'java-w5-d3-short-v2', /메서드 호출식/],
    ['java-w6-d3-short-v3', 'render', 'java-w6-d3-short-v2', /구현해야 하는 메서드 이름/],
  ];

  for (const [id, response, previousId, prompt] of cases) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assertPreviousId(exercise, previousId, id);
    assert.match(exercise.prompt, prompt, id);
    if (exercise.type === 'choice') {
      assert.equal(exercise.choices.find((option) => option.id === exercise.answer)?.text, response, id);
      assert.equal(gradeAnswer(exercise, exercise.answer), true, id);
    } else {
      assert.equal(gradeAnswer(exercise, response), true, `${id} should accept ${response}`);
    }
  }
});

test('Java collection and functional-interface questions do not repeat the original catalog check', () => {
  const cases = [
    ['java-w7-d1-choice-v3', '3개예요.', 'java-w7-d1-choice-v2', /names\.size/],
    ['java-w7-d1-short-v3', 'add', 'java-w7-d1-short-v2', /메서드 이름/],
    ['java-w7-d3-short-v3', 'null', 'java-w7-d3-short-v2', /get\("Kotlin"\)/],
    ['java-w8-d3-choice-v3', 'Exception', 'java-w8-d3-choice-v2', /가장 넓은/],
    ['java-w9-d1-choice-v3', '두 번 실행돼요.', 'java-w9-d1-choice-v2', /두 번 호출/],
    ['java-w9-d2-choice-v3', 'false', 'java-w9-d2-choice-v2', /even\.test\(5\)/],
    ['java-w9-d3-short-v3', 'apply', 'java-w9-d3-short-v2', /메서드 이름/],
  ];

  for (const [id, response, previousId, prompt] of cases) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assertPreviousId(exercise, previousId, id);
    assert.match(exercise.prompt, prompt, id);
    if (exercise.type === 'choice') {
      assert.equal(exercise.choices.find((option) => option.id === exercise.answer)?.text, response, id);
      assert.equal(gradeAnswer(exercise, exercise.answer), true, id);
    } else {
      assert.equal(gradeAnswer(exercise, response), true, `${id} should accept ${response}`);
    }
  }
});

test('Java char example identifies its UTF-16 code-unit scope', () => {
  const day = initialWeeks[0].studyDays.find((item) => item.title === '문자와 논리값');
  assert.match(day.intro, /UTF-16 코드 단위 하나/);
  assert.match(day.intro, /일부 이모지는 두 코드 단위/);
  assert.match(day.example, /char status = 'Y';/);
  assert.match(day.example, /System\.out\.println\(status\); \/\/ Y/);
  assert.match(day.example, /System\.out\.println\(completed\); \/\/ false/);
});

test('the original nine Java foundation questions keep their answer keys and usable feedback', () => {
  const sourceIds = [
    'java-variables-choice', 'java-variables-type-choice', 'java-variable-locate',
    'java-conditions-short', 'java-condition-choice', 'java-condition-short',
    'java-loop-choice', 'java-loop-short', 'java-loop-locate',
  ];
  assert.equal(sourceIds.length, 9);
  for (const id of sourceIds) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.ok(exercise.prompt.length > 20, id);
    assert.ok(exercise.hint.length > 10, id);
    assert.ok(exercise.explanation.length > 20, id);
    if (exercise.type === 'choice') {
      assert.ok(exercise.choices.some((option) => option.id === exercise.answer), id);
      assert.ok(exercise.choices.every((option) => exercise.choiceExplanations[option.id]?.length > 15), id);
    } else if (exercise.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.length > 0, id);
      assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, id);
    } else if (exercise.type === 'locate-error') {
      assert.ok(exercise.answerLines.every((line) => line > 0 && line <= exercise.codeLines.length), id);
      assert.equal(gradeAnswer(exercise, exercise.answerLines), true, id);
    } else {
      assert.fail(`Unexpected original Java exercise type ${exercise.type} (${id})`);
    }
  }
});

test('Java initial lessons 4–6 teach methods, classes, and polymorphism with concrete daily evidence', () => {
  const weeks = javaTrack.lessons.filter((lesson) => lesson.week >= 4 && lesson.week <= 6);
  assert.equal(weeks.length, 3);
  const days = weeks.flatMap((week) => week.studyDays);
  assert.equal(days.length, 15);

  days.forEach((day, index) => {
    const week = Math.floor(index / 5) + 4;
    const dayNumber = (index % 5) + 1;
    const prefix = `java-w${week}-d${dayNumber}`;
    const concept = day.exercises.find((exercise) => [`${prefix}-choice-v2`, `${prefix}-choice-v3`].includes(exercise.id));

    assert.ok(day.intro.length > 70, day.title);
    assert.doesNotMatch(day.intro, /예제의 입력과 결과를 따라가며 핵심 규칙을 확인하고/);
    assert.ok(concept, `${prefix} focused concept`);
    assert.ok(concept.prompt.length > 35, concept.id);
    assert.doesNotMatch(concept.prompt, /가장 타당한 선택은 무엇인가요\?$/);
    assert.ok(concept.choices.every((option) => concept.choiceExplanations[option.id]?.length > 20), concept.id);
    assert.doesNotMatch(Object.values(concept.choiceExplanations).join(' '), genericFeedback);
    assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);

    if (dayNumber >= 4) {
      const application = day.exercises.find((exercise) => exercise.id === `${prefix}-apply-v3`);
      assert.ok(application, `${prefix} example application`);
      assert.ok(application.prompt.length > 45, application.id);
      assert.ok(application.hint.length > 20, application.id);
      assert.ok(application.explanation.length > 30, application.id);
      assert.ok(application.choices.every((option) => application.choiceExplanations[option.id]?.length > 20), application.id);
      assert.doesNotMatch(Object.values(application.choiceExplanations).join(' '), genericFeedback);
      assert.equal(gradeAnswer(application, application.answer), true, application.id);
    }

    if (dayNumber === 4) {
      const expectedRepairId = week === 5 ? `${prefix}-repair` : `${prefix}-repair-v2`;
      const repair = day.exercises.find((exercise) => exercise.id === expectedRepairId);
      assert.ok(repair, `${prefix} repair`);
      assert.ok(repair.acceptanceCriteria.tests.length >= 2, repair.id);
      assert.match(repair.gradingNote, /실행형 채점은 아니며/);
    } else {
      const recall = day.exercises.find((exercise) => exercise.id.startsWith(`${prefix}-short`));
      assert.ok(recall, `${prefix} short answer`);
      assert.ok(recall.prompt.length > 35, recall.id);
      assert.ok(recall.hint.length > 20, recall.id);
      assert.ok(recall.explanation.length > 35, recall.id);
      assert.doesNotMatch(`${recall.prompt} ${recall.explanation}`, genericFeedback);
      assert.equal(gradeAnswer(recall, recall.acceptedAnswers[0]), true, recall.id);
    }
  });
});

test('Java initial lessons 7–9 connect collections, exceptions, and lambdas to concrete daily cases', () => {
  const weeks = javaTrack.lessons.filter((lesson) => lesson.week >= 7 && lesson.week <= 9);
  assert.equal(weeks.length, 3);
  const expected = [
    ['ListOrderExample', '3개예요.'],
    ['SetDuplicateExample', 'Set은 같은 원소의 중복을 허용하지 않는다'],
    ['MapLookupExample', 'Map은 키와 값의 관계를 저장한다'],
    ['ComparableBoundExample', 'T extends Comparable<T>이면 T를 안전하게 비교할 수 있다'],
    ['IteratorRemoveExample', 'Iterator로 순회 중 구조를 바꿀 때 remove를 사용한다'],
    ['ExceptionFlowExample', '예외는 정상 반환과 다른 실패 경로를 알린다'],
    ['CheckedExceptionExample', 'checked 예외는 처리하거나 선언해야 한다'],
    ['CatchOrderExample', 'Exception'],
    ['TryWithResourcesExample', 'try-with-resources는 AutoCloseable을 자동으로 닫는다'],
    ['ExceptionCauseExample', '원인 예외를 보존하며 작업 맥락을 더한다'],
    ['RunnableLambdaExample', '두 번 실행돼요.'],
    ['PredicateExample', 'false'],
    ['FunctionExample', 'String을 받아 Integer를 반환합니다.'],
    ['ConsumerExample', '문자열 ready를 출력합니다.'],
    ['MethodReferenceExample', '메서드 참조는 호환되는 람다를 간결하게 쓴 표현이다'],
  ];
  const applicationMarkers = [
    '"SQL"', '"spring"', 'getOrDefault', 'compareTo("bee")', '[Python]',
    'minutes <= 0', 'throws IOException', 'IOException', 'close()', 'disk unavailable',
    'task.run()', 'test(7)', 'toUpperCase', 'accept 자체는 값을 반환하지 않아요', 'name -> System.out.println(name)',
  ];
  const days = weeks.flatMap((week) => week.studyDays);
  assert.equal(days.length, 15);

  days.forEach((day, index) => {
    const week = Math.floor(index / 5) + 7;
    const dayNumber = (index % 5) + 1;
    const prefix = `java-w${week}-d${dayNumber}`;
    const [className, correctMeaning] = expected[index];
    const concept = day.exercises.find((exercise) => [`${prefix}-choice-v2`, `${prefix}-choice-v3`].includes(exercise.id));
    const correctOption = concept?.choices.find((option) => option.id === concept.answer);

    assert.ok(day.intro.length > 90, day.title);
    assert.doesNotMatch(day.intro, /예제의 입력과 결과를 따라가며 핵심 규칙을 확인하고/);
    assert.match(day.example, new RegExp(`class ${className}\\b`), day.title);
    assert.match(day.example, /public static void main\(String\[\] args\)/, day.title);
    assert.match(day.example, /System\.out(?:\.println\(|::println)/, day.title);
    assert.ok(concept, `${prefix} focused concept`);
    assert.equal(correctOption?.text, correctMeaning, concept?.id);
    assert.ok(concept.choices.every((option) => concept.choiceExplanations[option.id]?.length > 25), concept.id);
    assert.doesNotMatch(Object.values(concept.choiceExplanations).join(' '), genericFeedback);
    assert.equal(gradeAnswer(concept, concept.answer), true, concept.id);

    if (dayNumber !== 4) {
      const recall = day.exercises.find((exercise) => exercise.id.startsWith(`${prefix}-short`));
      assert.ok(recall, `${prefix} focused recall`);
      assert.doesNotMatch(recall.prompt, /규칙·타입·API·연산/);
      assert.ok(recall.acceptedAnswers.some((answer) => /[가-힣]/.test(answer)), recall.id);
      assert.ok(recall.hint.length > 30, recall.id);
      assert.equal(gradeAnswer(recall, recall.acceptedAnswers[0]), true, recall.id);
    }

    if (dayNumber >= 4) {
      const application = day.exercises.find((exercise) => exercise.id === `${prefix}-apply-v3`);
      const correctApplication = application?.choices.find((option) => option.id === application.answer);
      assert.ok(application, `${prefix} application`);
      assert.ok(application.prompt.length > 35, application.id);
      assert.ok(application.hint.length > 25, application.id);
      assert.ok(correctApplication?.text.includes(applicationMarkers[index]), application.id);
      assert.notDeepEqual(application.choices.map((option) => option.text), concept.choices.map((option) => option.text), application.id);
      assert.equal(gradeAnswer(application, application.answer), true, application.id);
    }

    if (dayNumber === 4) {
      const repairId = `${prefix}-repair${week === 8 ? '' : '-v2'}`;
      const repair = day.exercises.find((exercise) => exercise.id === repairId);
      assert.ok(repair, `${prefix} repair`);
      assert.ok(repair.acceptanceCriteria.tests.length >= 2, repair.id);
      assert.match(repair.gradingNote, /실행형 채점은 아니며/);
      assert.equal(gradeAnswer(repair, repair.starterCode), false, repair.id);
      const accepted = week === 7
        ? 'static <T extends Comparable<T>> T max(T left, T right) { return left.compareTo(right) >= 0 ? left : right; }'
        : week === 8
          ? 'static String readFirstLine(java.io.BufferedReader reader) throws java.io.IOException { try (java.io.BufferedReader resource = reader) { return resource.readLine(); } }'
          : 'static void announce(java.util.function.Consumer<String> consumer) { consumer.accept("ready"); }';
      assert.equal(gradeAnswer(repair, accepted), true, repair.id);
    }
  });
});

test('the original Java collection, exception, and lambda questions retain their IDs and answer contracts', () => {
  const originals = [
    ['java-collections-choice-v2', 'choice'], ['java-generics-locate', 'locate-error'], ['java-map-short', 'short-answer'],
    ['java-exception-choice', 'choice'], ['java-checked-exception-locate-v2', 'locate-error'], ['java-catch-short-v2', 'short-answer'],
    ['java-lambda-choice-v2', 'choice'], ['java-predicate-locate-v2', 'locate-error'], ['java-function-short-v2', 'short-answer'],
  ];
  for (const [id, type] of originals) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.equal(exercise.type, type, id);
    assert.ok(exercise.prompt.length > 20, id);
    assert.ok(exercise.hint.length > 15, id);
    assert.ok(exercise.explanation.length > 25, id);
    if (type === 'choice') {
      assert.ok(exercise.choices.some((option) => option.id === exercise.answer), id);
      assert.ok(exercise.choices.every((option) => exercise.choiceExplanations[option.id]?.length > 15), id);
      assert.equal(gradeAnswer(exercise, exercise.answer), true, id);
    } else if (type === 'locate-error') {
      assert.ok(exercise.answerLines.every((line) => line > 0 && line <= exercise.codeLines.length), id);
      assert.equal(gradeAnswer(exercise, exercise.answerLines), true, id);
    } else {
      assert.ok(exercise.acceptedAnswers.length > 0, id);
      assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, id);
    }
  }
});

test('G10 Java 7–9 original questions appear once on the matching weekly study day', () => {
  const scheduledQuestions = {
    'java-collections-generics': [
      [1, 'java-collections-choice-v2'],
      [2, 'java-generics-locate'],
      [3, 'java-map-short'],
    ],
    'java-exceptions': [
      [1, 'java-exception-choice'],
      [2, 'java-checked-exception-locate-v2'],
      [3, 'java-catch-short-v2'],
    ],
    'java-lambdas-streams': [
      [1, 'java-lambda-choice-v2'],
      [2, 'java-predicate-locate-v2'],
      [3, 'java-function-short-v2'],
    ],
  };

  for (const [lessonId, assignments] of Object.entries(scheduledQuestions)) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);
    assert.equal(lesson.exercises.length, 15, lessonId);
    assert.equal(assignments.length, 3, lessonId);

    for (const [dayNumber, exerciseId] of assignments) {
      const day = lesson.studyDays[dayNumber - 1];
      const scheduledExercise = getExercise(exerciseId);
      assert.equal(day.exercises.filter((exercise) => exercise.id === scheduledExercise.id).length, 1, exerciseId);
      assert.equal(lesson.exercises.filter((exercise) => exercise.id === scheduledExercise.id).length, 1, exerciseId);
      assert.equal(scheduledExercise.studyDay, dayNumber, exerciseId);
    }
  }
});

test('G10 Java 10–12 original questions appear once on the matching weekly study day', () => {
  const scheduledQuestions = {
    'java-concurrency-tests': {
      week: 10,
      title: /스트림 파이프라인/,
      exercises: [
        [1, 'java-filter-choice-v2'],
        [2, 'java-map-locate-v2'],
        [3, 'java-flatmap-short-v2'],
      ],
    },
    'java-jvm-performance': {
      week: 11,
      title: /동시성과 안전성/,
      exercises: [
        [1, 'java-thread-choice-v2'],
        [2, 'java-visibility-locate-v2'],
        [3, 'java-atomic-short-v2'],
      ],
    },
    'java-algorithms-capstone': {
      week: 12,
      title: /JVM과 성능 측정/,
      exercises: [
        [1, 'java-heap-choice-v2'],
        [2, 'java-allocation-locate-v2'],
        [3, 'java-warmup-short-v2'],
      ],
    },
  };

  for (const [lessonId, expected] of Object.entries(scheduledQuestions)) {
    const lesson = getLesson(lessonId);
    assert.equal(lesson.week, expected.week, lessonId);
    assert.match(lesson.title, expected.title, lessonId);
    assert.equal(lesson.studyDays.length, 5, lessonId);
    assert.equal(lesson.exercises.length, 15, lessonId);

    for (const [dayNumber, exerciseId] of expected.exercises) {
      const day = lesson.studyDays[dayNumber - 1];
      const scheduledExercise = getExercise(exerciseId);
      assert.equal(day.exercises.filter((exercise) => exercise.id === scheduledExercise.id).length, 1, exerciseId);
      assert.equal(lesson.exercises.filter((exercise) => exercise.id === scheduledExercise.id).length, 1, exerciseId);
      assert.equal(scheduledExercise.studyDay, dayNumber, exerciseId);
    }
  }
});

test('the original Java methods, classes, and interface questions remain accessible', () => {
  const originalIds = [
    'java-method-choice', 'java-method-locate',
    'java-class-choice', 'java-class-short-v2',
    'java-inheritance-choice-v2', 'java-override-locate-v2', 'java-abstract-short-v2',
  ];
  for (const id of originalIds) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.ok(exercise.prompt.length > 20, id);
    assert.ok(exercise.explanation.length > 25, id);
    if (exercise.type === 'choice') {
      assert.ok(exercise.choices.some((option) => option.id === exercise.answer), id);
      assert.ok(exercise.choices.every((option) => exercise.choiceExplanations[option.id]?.length > 15), id);
      assert.equal(gradeAnswer(exercise, exercise.answer), true, id);
    } else if (exercise.type === 'short-answer') {
      assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, id);
    } else if (exercise.type === 'locate-error') {
      assert.ok(exercise.answerLines.every((line) => line > 0 && line <= exercise.codeLines.length), id);
      assert.equal(gradeAnswer(exercise, exercise.answerLines), true, id);
    }
  }
});
