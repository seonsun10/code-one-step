import test from 'node:test';
import assert from 'node:assert/strict';
import { tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const track = tracks.find((item) => item.id === 'ai');

test('AI and LLM curriculum has 27 sequential weeks across six clear stages', () => {
  assert.ok(track);
  assert.equal(track.title, 'AI · LLM 기초와 활용');
  assert.equal(track.course.weeks, 27);
  assert.equal(track.course.sessions, 135);
  assert.equal(track.course.questions, 405);
  assert.equal(track.lessons.length, 27);
  assert.deepEqual(track.topics.map(({ startWeek, endWeek }) => [startWeek, endWeek]), [
    [1, 5], [6, 10], [11, 13], [14, 18], [19, 23], [24, 27],
  ]);
  assert.deepEqual(track.lessons[0].points, [
    '규칙 프로그램과 학습 모델을 사례로 설명해요.',
    'AI와 머신러닝의 포함 관계를 사례로 설명해요.',
    '특정 과제용 AI와 범용 AI를 사례로 설명해요.',
  ]);
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 27 }, (_, index) => index + 1));
  assert.equal(track.course.contentStatus, '문항 검수 완료');
  assert.ok(track.lessons.every((lesson) => lesson.contentReviewStatus === '문항 검수 완료'));

  track.lessons.forEach((lesson, index) => {
    assert.equal(lesson.week, index + 1, lesson.id);
    assert.deepEqual(lesson.prerequisiteLessonIds, index ? [track.lessons[index - 1].id] : [], lesson.id);
    assert.equal(lesson.studyDays.length, 5, lesson.id);
    assert.equal(lesson.showSessionSummary, false, lesson.id);
    assert.equal(lesson.points.length, 3, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.title)).size, 5, `${lesson.id} daily topics`);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, `${lesson.id} daily examples`);
    assert.ok(lesson.studyDays.every((day) => day.activities.every((activity) => !/코드 흐름|코드를 실행/.test(activity.prompt))), lesson.id);
  });
});

test('every AI study day contains distinct concept, answer, and practical judgment questions', () => {
  const allExerciseIds = [];
  for (const lesson of track.lessons) {
    for (const day of lesson.studyDays) {
      assert.equal(day.exercises.length, 3, `${lesson.id} day ${day.number}`);
      const [concept, trace, application] = day.exercises;
      assert.deepEqual([concept.type, trace.type, application.type], ['choice', 'short-answer', 'choice']);
      assert.equal(new Set(day.exercises.map((exercise) => exercise.prompt)).size, 3, `${lesson.id} day ${day.number} prompts`);

      for (const exercise of [concept, application]) {
        const choiceIds = exercise.choices.map((choice) => choice.id);
        assert.equal(new Set(choiceIds).size, 3, exercise.id);
        assert.equal(new Set(exercise.choices.map((choice) => choice.text)).size, 3, exercise.id);
        assert.ok(choiceIds.includes(exercise.answer), exercise.id);
        assert.deepEqual(Object.keys(exercise.choiceExplanations).sort(), [...choiceIds].sort(), exercise.id);
        assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
      }

      assert.ok(trace.acceptedAnswers.length > 0, trace.id);
      assert.ok(trace.acceptedAnswers.every((answer) => typeof answer === 'string' && answer.trim()), trace.id);
      assert.equal(gradeAnswer(trace, trace.acceptedAnswers[0]), true, trace.id);
      allExerciseIds.push(...day.exercises.map((exercise) => exercise.id));
    }
  }
  assert.equal(allExerciseIds.length, 405);
  assert.equal(new Set(allExerciseIds).size, 405);
});

test('weekly principles are not repeated in every AI question explanation', () => {
  for (const lesson of track.lessons) {
    const weeklyPrinciple = lesson.intro.match(/[^.]*\.$/)?.[0].trim();
    assert.ok(weeklyPrinciple, lesson.id);
    for (const day of lesson.studyDays) {
      for (const exercise of day.exercises) {
        const feedback = [exercise.explanation, ...Object.values(exercise.choiceExplanations ?? {})];
        for (const message of feedback) {
          assert.ok(!message.includes(weeklyPrinciple), `${exercise.id} repeats its weekly principle`);
        }
      }
    }
  }
});

test('probability, regression, and attention examples agree with their answer keys', () => {
  const bayes = track.lessons[3].studyDays[2].exercises;
  assert.match(bayes[0].prompt, /경고를 받은 585건/);
  assert.match(bayes[0].choices.find((choice) => choice.id === bayes[0].answer).text, /15\.4%/);
  assert.ok(bayes[1].acceptedAnswers.includes('베이즈 정리'));
  assert.equal(gradeAnswer(bayes[1], '베이즈 정리'), true);

  const regression = track.lessons[6].studyDays[2].exercises;
  assert.match(regression[0].prompt, /MAE = \(2\+8\)\/2/);
  assert.match(regression[0].prompt, /MSE = \(2²\+8²\)\/2/);
  assert.equal(regression[1].acceptedAnswers[0], '34');
  assert.equal(gradeAnswer(regression[1], '34'), true);

  const attention = track.lessons[13].studyDays[1].exercises;
  assert.equal(attention[0].choices.find((choice) => choice.id === attention[0].answer).text, '0.25×2=0.5, 0.75×10=7.5이므로 두 값을 더하면 8이에요.');
  assert.ok(attention[1].acceptedAnswers.includes('가중합'));
  const perceptronDay = track.lessons[10].studyDays[0];
  assert.match(perceptronDay.example, /편향값을 0으로 둠/);
  assert.match(perceptronDay.exercises[0].choices.find((choice) => choice.id === perceptronDay.exercises[0].answer).text, /편향값/);
  const outageChoice = track.lessons[25].studyDays[1].exercises[0].choices.find((choice) => choice.id === track.lessons[25].studyDays[1].exercises[0].answer);
  assert.match(outageChoice.text, /실패를 사용자에게 알리고/);
  assert.doesNotMatch(outageChoice.text, /조용히 실패/);
  assert.equal(track.lessons[13].studyDays[3].example.includes('실제 역할이 이렇게 고정된다는 뜻은 아님'), true);
  assert.equal(track.lessons[14].studyDays[2].example.includes('15.4%'), false);
  assert.equal(track.lessons[20].studyDays[0].example.includes('적절한 조각 크기는 자료와 실제 질문으로 평가'), true);
});

test('AI and LLM references are official links and actual model use stays optional', () => {
  assert.deepEqual(track.prerequisites, ['없음 — 코딩이나 AI 도구 계정 없이 시작할 수 있어요.']);
  assert.equal(track.contentReview.sources.length, 14);
  assert.ok(track.contentReview.sources.every((source) => source.url.startsWith('https://') && source.label.trim()));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://developers.google.com/machine-learning/crash-course/neural-networks'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://developers.openai.com/api/docs/guides/model-optimization'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://ai.google.dev/gemini-api/docs/image-understanding'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://ai.google.dev/gemini-api/docs/audio'));
  assert.match(track.contentReview.versionContext, /외부 AI 서비스로 보내지 않아요/);
  assert.match(track.lessons[17].studyDays[0].activities[2].prompt, /실제 AI 도구 사용은 선택/);
  assert.doesNotMatch(JSON.stringify(track.lessons), /fetch\s*\(|XMLHttpRequest|Authorization\s*:/i);
});

test('AI course keeps product-scope notes in the collapsed source details', () => {
  assert.equal(track.contentReview.version, '');
  assert.match(track.contentReview.versionContext, /특정 모델이나 제품에 묶이지 않는/);
  assert.match(track.contentReview.versionContext, /외부 AI 서비스로 보내지 않아요/);
});

test('AI application weeks 19–21 give each day a concrete optional practice task', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 19 && lesson.week <= 21);
  const practiceSteps = lessons.flatMap((lesson) => lesson.studyDays.map((day) => day.activities[2]));
  const prompts = practiceSteps.map((step) => step.prompt);

  assert.equal(lessons.length, 3);
  assert.equal(practiceSteps.length, 15);
  assert.equal(new Set(prompts).size, 15);
  assert.ok(practiceSteps.every((step) => step.title.includes('선택 실습')));
  assert.ok(prompts.every((prompt) => prompt.includes('AI 도구')));
  assert.ok(practiceSteps.every((step) => step.prompt.length >= 45));
  assert.doesNotMatch(prompts.join('\n'), /실제 AI 도구 사용은 선택|예제의 숫자·조건·자료를 하나 바꾸고/);
  const taskRequirements = [
    /11\/3 화면 수정.*11\/4 시험/, /업무 계정을 받습니다/, /C-104.*2027-03-31/,
    /신입 20명·예산 100만 원·기간 2주/, /시행일/, /2026-10-28.*18도/,
    /search_policy\(topic\)/, /reports\/old\.csv.*읽기 전용/, /승인 전에는 보내지 않는 흐름/,
    /permission_denied/, /환불 정책 v3, 시행일 2026-10-01/, /폐기된 환불 v2/, /근거와 대조/,
    /v4는 11\/1 시행 예정 초안/, /신청 7일 이내.*검색 결과가 빈 사례.*두 실패가 각각 어느 단계/,
  ];
  taskRequirements.forEach((requirement, index) => assert.match(prompts[index], requirement));
});

test('AI method selection and multimodal weeks 22–23 give each day a practical task', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 22 && lesson.week <= 23);
  const practiceSteps = lessons.flatMap((lesson) => lesson.studyDays.map((day) => day.activities[2]));
  const prompts = practiceSteps.map((step) => step.prompt);

  assert.equal(lessons.length, 2);
  assert.equal(practiceSteps.length, 10);
  assert.equal(new Set(prompts).size, 10);
  assert.ok(practiceSteps.every((step) => step.title.includes('선택 실습')));
  assert.ok(prompts.every((prompt) => prompt.includes('AI')));
  assert.ok(prompts.every((prompt) => /직접|도구 없이/.test(prompt)));
  assert.ok(practiceSteps.every((step) => step.prompt.length >= 55));
  const taskRequirements = [
    /공지 정리해 줘.*11\/3 점검.*배포일 미정/, /환불 v3, 시행 중.*다음 달 시행 예정 초안/,
    /배송 지연.*결제 취소.*로그인 오류/, /9:00~17:30.*휴게 시간이 60분.*7\.5시간/,
    /결제 전 취소 가능.*결제 후에는 고객센터 확인.*프롬프트만 쓸 때와 문서를 검색/,
    /16,900원.*18,900원.*결제에는 자동 반영하지 않아요/, /파란 책 오른쪽.*빨간 컵.*일부를 가려/,
    /배송비는 삼만 원입니다.*삼만 원이 십만 원으로 바뀌면/, /도서관은 오후 6시.*합성된 음성임.*동의/,
    /얼굴·주소 라벨.*가상 사진.*불필요한 개인정보 제거/,
  ];
  taskRequirements.forEach((requirement, index) => assert.match(prompts[index], requirement));
});
