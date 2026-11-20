import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';
import { kotlinReviewedOpeningWeeks } from '../src/curriculum-kotlin-w1-w3-reviewed.js';
import { kotlinReviewedMiddleWeeks } from '../src/curriculum-kotlin-w4-w6-reviewed.js';
import { kotlinReviewedCollectionWeeks } from '../src/curriculum-kotlin-w7-w9-reviewed.js';
import { kotlinReviewedSafetyWeeks } from '../src/curriculum-kotlin-w10-w12-reviewed.js';
import { kotlinReviewedDesignWeeks } from '../src/curriculum-kotlin-w13-w15-reviewed.js';
import { kotlinReviewedAdvancedWeeks } from '../src/curriculum-kotlin-w16-w18-reviewed.js';
import { kotlinReviewedConcurrencyWeeks } from '../src/curriculum-kotlin-w19-w21-reviewed.js';
import { kotlinReviewedAndroidWeeks } from '../src/curriculum-kotlin-w22-w24-reviewed.js';
import { kotlinReviewedComposeWeeks } from '../src/curriculum-kotlin-w25-w27-reviewed.js';
import { kotlinReviewedArchitectureWeeks } from '../src/curriculum-kotlin-w28-w30-reviewed.js';
import { kotlinReviewedCapstoneWeek } from '../src/curriculum-kotlin-w31-reviewed.js';

const track = tracks.find((item) => item.id === 'kotlin');

test('concept questions accept common equivalent forms without accepting wrong claims', () => {
  const lazyList = track.lessons[26].studyDays[0].exercises[1];
  assert.equal(gradeAnswer(lazyList, '아니요, 필요한 항목만 지연 구성해요.'), true);
  assert.equal(gradeAnswer(lazyList, '네. 모든 행을 전부 구성해요.'), false);
  const touchTarget = track.lessons[28].studyDays[1].exercises[1];
  assert.equal(gradeAnswer(touchTarget, '48dp x 48dp 이상'), true);
  assert.equal(gradeAnswer(touchTarget, '24 x 24 dp'), false);
});

test('Kotlin and Android course grows from foundations through app architecture across 31 weeks', () => {
  assert.ok(track);
  assert.equal(track.title, 'Kotlin · Android');
  assert.equal(track.contentReview.version, 'Kotlin 2.4.21 · Android 17 (API 37) · 개념 학습');
  assert.equal(track.contentReview.reviewedAt, '2026-11-02');
  assert.equal(track.course.weeks, 31);
  assert.equal(track.course.sessions, 155);
  assert.equal(track.course.questions, 465);
  assert.equal(track.course.phases, 6);
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 31 }, (_, index) => index + 1));
  assert.deepEqual(track.topics.map((phase) => phase.stage), [1, 2, 3, 4, 5, 6]);
  assert.equal(track.practiceUnit, '개념 연습');
  assert.match(track.practiceMode, /코드 읽기·설계 판단 465개/);
  assert.match(track.contentReview.versionContext, /Kotlin 컴파일이나 Android 앱 빌드는 하지 않아요/);
  assert.ok(track.lessons.every((lesson) => lesson.points.every((point) => !/공식 자료를 .*확인했어요/.test(point))), 'learner notes must not expose internal source-review dates');
  assert.equal(track.lessons[8].title, '읽기 전용 목록과 Sequence');
  assert.match(track.topics.find((topic) => topic.id === 'kotlin-phase-functions').objective, /목록 변경/);
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://kotlinlang.org/docs/releases.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://developer.android.com/about/versions/17'));
  assert.match(track.contentReview.versionContext, /2026년 11월 2일 기준/);
  assert.match(track.contentReview.versionContext, /Android 17\(API 37\)은 정식 출시된 플랫폼/);
  for (const url of [
    'https://kotlinlang.org/docs/numbers.html',
    'https://kotlinlang.org/docs/strings.html',
    'https://kotlinlang.org/docs/characters.html',
    'https://kotlinlang.org/docs/properties.html',
    'https://kotlinlang.org/docs/control-flow.html',
    'https://kotlinlang.org/docs/booleans.html',
    'https://kotlinlang.org/docs/ranges.html',
    'https://kotlinlang.org/docs/functions.html',
    'https://kotlinlang.org/docs/lambdas.html',
    'https://kotlinlang.org/docs/collections-overview.html',
    'https://kotlinlang.org/docs/collection-operations.html',
    'https://kotlinlang.org/docs/collection-transformations.html',
    'https://kotlinlang.org/docs/collection-filtering.html',
    'https://kotlinlang.org/docs/map-operations.html',
    'https://kotlinlang.org/docs/sequences.html',
    'https://kotlinlang.org/docs/null-safety.html',
    'https://kotlinlang.org/docs/typecasts.html',
    'https://kotlinlang.org/docs/classes.html',
    'https://kotlinlang.org/docs/visibility-modifiers.html',
    'https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-int-or-null.html',
    'https://kotlinlang.org/docs/data-classes.html',
    'https://kotlinlang.org/docs/enum-classes.html',
    'https://kotlinlang.org/docs/sealed-classes.html',
    'https://kotlinlang.org/docs/inline-classes.html',
    'https://kotlinlang.org/docs/inheritance.html',
    'https://kotlinlang.org/docs/interfaces.html',
    'https://kotlinlang.org/docs/delegation.html',
    'https://kotlinlang.org/docs/extensions.html',
    'https://kotlinlang.org/docs/scope-functions.html',
    'https://kotlinlang.org/docs/generics.html',
    'https://kotlinlang.org/docs/java-interop.html',
    'https://kotlinlang.org/docs/exceptions.html',
    'https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/',
    'https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/run-catching.html',
    'https://kotlinlang.org/docs/coroutines-basics.html',
    'https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html',
    'https://kotlinlang.org/docs/cancellation-and-timeouts.html',
    'https://kotlinlang.org/docs/exception-handling.html',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/',
    'https://developer.android.com/topic/libraries/architecture/coroutines',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/run-test.html',
    'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/set-main.html',
    'https://developer.android.com/studio/projects/',
    'https://developer.android.com/build',
    'https://developer.android.com/guide/topics/manifest/uses-sdk-element.html',
    'https://developer.android.com/guide/components/intents-filters',
    'https://developer.android.com/guide/topics/manifest/manifest-intro.html',
    'https://developer.android.com/topic/libraries/architecture/viewmodel',
    'https://developer.android.com/topic/libraries/architecture/saving-states',
    'https://developer.android.com/topic/architecture/recommendations',
    'https://kotlinlang.org/docs/multiplatform/supported-platforms.html',
    'https://developer.android.com/guide/components/activities/activity-lifecycle',
    'https://developer.android.com/develop/ui/compose/mental-model',
    'https://developer.android.com/develop/ui/compose/state',
    'https://developer.android.com/develop/ui/compose/side-effects',
    'https://developer.android.com/develop/ui/compose/modifiers',
    'https://developer.android.com/develop/ui/compose/lists',
    'https://developer.android.com/guide/navigation/design/type-safety',
    'https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes',
    'https://developer.android.com/develop/ui/compose/state-saving',
    'https://developer.android.com/topic/architecture/data-layer',
    'https://developer.android.com/topic/architecture/ui-layer',
    'https://developer.android.com/training/data-storage/room',
    'https://developer.android.com/topic/libraries/architecture/datastore',
    'https://developer.android.com/develop/ui/compose/accessibility/semantics',
    'https://developer.android.com/develop/ui/compose/accessibility/api-defaults',
    'https://developer.android.com/develop/ui/compose/testing',
    'https://developer.android.com/guide/topics/permissions/overview',
    'https://developer.android.com/privacy-and-security/security-tips',
    'https://developer.android.com/about/versions/17/behavior-changes-17',
    'https://developer.android.com/topic/performance/overview',
    'https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview',
  ]) assert.ok(track.contentReview.sources.some((source) => source.url === url), url);

  const versionChecks = kotlinReviewedAdvancedWeeks[17].map((review) => `${review.objective} ${review.rulePrompt} ${review.ruleExplanation} ${review.example}`);
  assert.ok(versionChecks.some((text) => text.includes('Kotlin 2.4.21')));
  assert.ok(versionChecks.some((text) => text.includes('함수 선언에 문맥 매개변수')));
  assert.ok(versionChecks.some((text) => text.includes('-Xcollection-literals')));
  assert.ok(versionChecks.some((text) => text.includes('실험')));

  for (const [index, week] of track.lessons.entries()) {
    assert.equal(week.week, index + 1);
    assert.equal(week.studyDays.length, 5);
    assert.equal(week.exercises.length, 15);
    assert.equal(week.intro, '', `${week.id} should not repeat the shared no-run note or day-title list`);
    assert.deepEqual(week.points, []);
    assert.ok(week.prerequisiteLessonIds.length === (index ? 1 : 0), week.id);
  }
});

test('Kotlin trace questions focus on the example and keep the no-run notice at course level', () => {
  const openingReviews = Object.values(kotlinReviewedOpeningWeeks).flat();
  assert.equal(openingReviews.length, 15);
  assert.equal(new Set(openingReviews.map((review) => review.tracePrompt)).size, 15);
  const middleReviews = Object.values(kotlinReviewedMiddleWeeks).flat();
  assert.equal(middleReviews.length, 15);
  assert.equal(new Set(middleReviews.map((review) => review.tracePrompt)).size, 15);
  const collectionReviews = Object.values(kotlinReviewedCollectionWeeks).flat();
  assert.equal(collectionReviews.length, 15);
  assert.equal(new Set(collectionReviews.map((review) => review.tracePrompt)).size, 15);
  const safetyReviews = Object.values(kotlinReviewedSafetyWeeks).flat();
  assert.equal(safetyReviews.length, 15);
  assert.equal(new Set(safetyReviews.map((review) => review.tracePrompt)).size, 15);
  const designReviews = Object.values(kotlinReviewedDesignWeeks).flat();
  assert.equal(designReviews.length, 15);
  assert.equal(new Set(designReviews.map((review) => review.tracePrompt)).size, 15);
  const advancedReviews = Object.values(kotlinReviewedAdvancedWeeks).flat();
  assert.equal(advancedReviews.length, 15);
  assert.equal(new Set(advancedReviews.map((review) => review.tracePrompt)).size, 15);
  const concurrencyReviews = Object.values(kotlinReviewedConcurrencyWeeks).flat();
  assert.equal(concurrencyReviews.length, 15);
  assert.equal(new Set(concurrencyReviews.map((review) => review.tracePrompt)).size, 15);
  const androidReviews = Object.values(kotlinReviewedAndroidWeeks).flat();
  assert.equal(androidReviews.length, 15);
  assert.equal(new Set(androidReviews.map((review) => review.tracePrompt)).size, 15);
  const composeReviews = Object.values(kotlinReviewedComposeWeeks).flat();
  assert.equal(composeReviews.length, 15);
  assert.equal(new Set(composeReviews.map((review) => review.tracePrompt)).size, 15);
  const architectureReviews = Object.values(kotlinReviewedArchitectureWeeks).flat();
  assert.equal(architectureReviews.length, 15);
  assert.equal(new Set(architectureReviews.map((review) => review.tracePrompt)).size, 15);
  const capstoneReviews = Object.values(kotlinReviewedCapstoneWeek).flat();
  assert.equal(capstoneReviews.length, 5);
  assert.equal(new Set(capstoneReviews.map((review) => review.tracePrompt)).size, 5);
  const allTracePrompts = [
    ...openingReviews,
    ...middleReviews,
    ...collectionReviews,
    ...safetyReviews,
    ...designReviews,
    ...advancedReviews,
    ...concurrencyReviews,
    ...androidReviews,
    ...composeReviews,
    ...architectureReviews,
    ...capstoneReviews,
  ].map((review) => review.tracePrompt);
  assert.equal(new Set(allTracePrompts).size, 155);
  assert.ok(allTracePrompts.every((prompt) => prompt?.length > 15));

  assert.match(track.contentReview.versionContext, /Kotlin 컴파일이나 Android 앱 빌드는 하지 않아요/);
  for (const lesson of track.lessons) {
    assert.doesNotMatch(lesson.intro, /Kotlin·Android 실행은 지원하지 않아요\./, lesson.id);
    for (const day of lesson.studyDays) {
      assert.doesNotMatch(day.intro, /컴파일하거나 Android 앱을 실행하지 않아요|컴파일하거나 실행하지 않아요/, day.title);
      const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
      assert.doesNotMatch(trace.prompt, /이 과정은 예제를 읽고 추적하며 Kotlin 코드를 실제로 컴파일·실행하지 않아요\./, trace.id);
    }
  }
});

test('Kotlin lessons provide reviewed concept checks without promising runnable coding problems', () => {
  const lessons = track.lessons;
  const exercises = lessons.flatMap((lesson) => lesson.exercises);
  assert.equal(exercises.length, 465);
  assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 465);
  assert.ok(exercises.every((exercise) => ['choice', 'short-answer'].includes(exercise.type)));
  assert.ok(exercises.every((exercise) => !exercise.type.includes('coding') && exercise.type !== 'repair-code'));

  const answerPositions = [];
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.equal(day.exercises.length, 3);
      const [rule, recall, effect] = day.exercises;
      assert.equal(rule.type, 'choice');
      assert.equal(recall.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      for (const exercise of [rule, recall, effect]) {
        assert.ok(exercise.prompt.length > 20, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 10, exercise.id);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true, exercise.id);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? '__wrong__' : '전혀 다른 답'), false, exercise.id);
      }
      for (const exercise of [rule, effect]) {
        const texts = exercise.choices.map((option) => option.text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko'));
        assert.equal(new Set(texts).size, texts.length, exercise.id);
        assert.equal(Object.keys(exercise.choiceExplanations).length, exercise.choices.length, exercise.id);
        answerPositions.push(exercise.choices.findIndex((option) => option.id === exercise.answer));
      }
    }
  }
  assert.ok([0, 1, 2].every((position) => answerPositions.filter((item) => item === position).length >= 40));
});

test('Kotlin W1-W3 reviewed examples, explanations, and answer keys stay connected', () => {
  const ruleAnswerPositions = [];
  const effectAnswerPositions = [];

  for (let weekNumber = 1; weekNumber <= 3; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedOpeningWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, /-v2-rule$/);
      assert.match(trace.id, /-v3-trace$/);
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      const firstLetter = review.traceAnswer.search(/[a-z]/i);
      if (firstLetter >= 0) {
        const letter = review.traceAnswer[firstLetter];
        const changedCase = review.traceAnswer.slice(0, firstLetter) +
          (letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase()) +
          review.traceAnswer.slice(firstLetter + 1);
        assert.equal(gradeAnswer(trace, changedCase), false, trace.id);
      }
      if (review.traceAnswer.includes(' ')) {
        assert.equal(gradeAnswer(trace, review.traceAnswer.replace(' ', '  ')), false, trace.id);
      }
      const singleLineAlternative = review.traceAlternatives?.find((answer) => answer.includes(' '));
      if (singleLineAlternative) {
        assert.equal(gradeAnswer(trace, singleLineAlternative.replace(' ', '  ')), false, trace.id);
      }

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
      }

      ruleAnswerPositions.push(rule.choices.findIndex((option) => option.id === rule.answer));
      effectAnswerPositions.push(effect.choices.findIndex((option) => option.id === effect.answer));
    }
  }

  for (const positions of [ruleAnswerPositions, effectAnswerPositions]) {
    const counts = [0, 1, 2].map((position) => positions.filter((item) => item === position).length);
    assert.ok(counts.every((count) => count > 0), String(counts));
  }
});

test('Kotlin W4-W6 conditions, loops, and functions use reviewed, traceable daily cases', () => {
  const answerPositions = [];

  for (let weekNumber = 4; weekNumber <= 6; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedMiddleWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, /-v2-rule$/);
      assert.match(trace.id, /-v3-trace$/);
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);
      const firstLetter = review.traceAnswer.search(/[a-z]/i);
      if (firstLetter >= 0) {
        const letter = review.traceAnswer[firstLetter];
        const changedCase = review.traceAnswer.slice(0, firstLetter) +
          (letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase()) +
          review.traceAnswer.slice(firstLetter + 1);
        assert.equal(gradeAnswer(trace, changedCase), false, trace.id);
      }
      if (review.traceAnswer.includes(' ')) {
        assert.equal(gradeAnswer(trace, review.traceAnswer.replace(' ', '  ')), false, trace.id);
      }
      const singleLineAlternative = review.traceAlternatives?.find((answer) => answer.includes(' '));
      if (singleLineAlternative) {
        assert.equal(gradeAnswer(trace, singleLineAlternative.replace(' ', '  ')), false, trace.id);
      }

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(kotlinReviewedMiddleWeeks[4][0].example, /if \(temperature >= 20\).*else/s);
  assert.match(kotlinReviewedMiddleWeeks[4][1].example, /&& 10 \/ points/);
  assert.match(kotlinReviewedMiddleWeeks[4][2].example, /enum class LoadState/);
  assert.match(kotlinReviewedMiddleWeeks[4][2].rule, /모든 항목/);
  assert.match(kotlinReviewedMiddleWeeks[4][3].example, /60\.\.80/);
  assert.doesNotMatch(kotlinReviewedMiddleWeeks[4][3].objective, /폐구간/);
  assert.equal(kotlinReviewedMiddleWeeks[4][3].effectVersion, 3);
  assert.match(kotlinReviewedMiddleWeeks[4][4].tracePrompt, /active가 1일 때/);
  assert.match(kotlinReviewedMiddleWeeks[5][1].example, /0 until 3/);
  assert.doesNotMatch(JSON.stringify(kotlinReviewedMiddleWeeks[5][1]), /상한/);
  assert.equal(kotlinReviewedMiddleWeeks[5][2].traceAnswer, '108642');
  assert.doesNotMatch(JSON.stringify(kotlinReviewedMiddleWeeks[5][2]), /progression/);
  assert.equal(kotlinReviewedMiddleWeeks[5][3].effectVersion, 3);
  assert.match(kotlinReviewedMiddleWeeks[5][4].example, /withIndex\(\)/);
  assert.match(kotlinReviewedMiddleWeeks[6][0].example, /: Int \{/);
  assert.match(kotlinReviewedMiddleWeeks[6][1].example, / = value \* value/);
  assert.match(kotlinReviewedMiddleWeeks[6][2].example, /prefix: String =/);
  assert.equal(kotlinReviewedMiddleWeeks[6][2].effectVersion, 3);
  assert.match(kotlinReviewedMiddleWeeks[6][3].example, /unit = .*value =/s);
  assert.match(kotlinReviewedMiddleWeeks[6][3].effectPrompt, /durationLabel/);
  assert.equal(kotlinReviewedMiddleWeeks[6][3].effectWrong.length, 2);
  assert.equal(kotlinReviewedMiddleWeeks[6][3].effectVersion, 3);
  assert.match(kotlinReviewedMiddleWeeks[6][4].example, /: Unit/);
  assert.equal(kotlinReviewedMiddleWeeks[6][4].effectVersion, 3);
});

test('Kotlin W7-W9 lambdas, collections, and sequences use reviewed, traceable daily cases', () => {
  const answerPositions = [];

  for (let weekNumber = 7; weekNumber <= 9; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedCollectionWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, new RegExp(`-v${review.ruleVersion ?? 2}-rule$`));
      assert.match(trace.id, /-v3-trace$/);
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);
      const firstLetter = review.traceAnswer.search(/[a-z]/i);
      if (firstLetter >= 0) {
        const letter = review.traceAnswer[firstLetter];
        const changedCase = review.traceAnswer.slice(0, firstLetter) +
          (letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase()) +
          review.traceAnswer.slice(firstLetter + 1);
        assert.equal(gradeAnswer(trace, changedCase), false, trace.id);
      }
      if (review.traceAnswer.includes(' ')) {
        assert.equal(gradeAnswer(trace, review.traceAnswer.replace(' ', '  ')), false, trace.id);
      }

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(kotlinReviewedCollectionWeeks[7][0].example, /subtract\(120, 25\)/);
  assert.match(kotlinReviewedCollectionWeeks[7][1].example, /transform: \(Int\) -> Int/);
  assert.match(kotlinReviewedCollectionWeeks[7][2].example, /map \{ it\.length \}/);
  assert.match(kotlinReviewedCollectionWeeks[7][3].example, /\) \{ name ->/);
  assert.match(kotlinReviewedCollectionWeeks[7][4].effectExplanation, /여러 작업의 실행 순서/);
  assert.match(kotlinReviewedCollectionWeeks[8][0].rule, /여러 번/);
  assert.match(kotlinReviewedCollectionWeeks[8][1].effectExplanation, /정렬/);
  assert.match(kotlinReviewedCollectionWeeks[8][2].ruleExplanation, /null/);
  assert.match(kotlinReviewedCollectionWeeks[8][3].example, /\.map \{ it\.length \}/);
  assert.match(kotlinReviewedCollectionWeeks[8][4].example, /\.filter \{ it >= 10 \}/);
  assert.match(kotlinReviewedCollectionWeeks[9][0].rule, /목록/);
  assert.match(kotlinReviewedCollectionWeeks[9][1].traceExplanation, /같은/);
  assert.match(kotlinReviewedCollectionWeeks[9][2].traceExplanation, /original은 두 항목/);
  assert.match(kotlinReviewedCollectionWeeks[9][3].traceExplanation, /확인하지 않아요/);
  assert.match(kotlinReviewedCollectionWeeks[9][4].effectExplanation, /속도/);

  assert.match(kotlinReviewedCollectionWeeks[7][0].objective, /이름 없이 바로 쓰는 함수/);
  assert.equal(kotlinReviewedCollectionWeeks[7][0].ruleVersion, 3);
  assert.match(kotlinReviewedCollectionWeeks[7][4].ruleExplanation, /바깥에서 선언한 변수/);
  assert.equal(kotlinReviewedCollectionWeeks[7][4].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[7][4].effectVersion, 3);
  assert.match(kotlinReviewedCollectionWeeks[8][1].objective, /Set\(집합\)/);
  assert.match(kotlinReviewedCollectionWeeks[8][2].objective, /이름 같은 키/);
  assert.match(kotlinReviewedCollectionWeeks[8][3].objective, /새 목록/);
  assert.match(kotlinReviewedCollectionWeeks[8][4].objective, /filter\(걸러내기\)/);
  assert.equal(kotlinReviewedCollectionWeeks[8][1].effectVersion, 3);
  assert.match(kotlinReviewedCollectionWeeks[8][2].traceExplanation, /null일 수/);
  assert.doesNotMatch(kotlinReviewedCollectionWeeks[8][2].ruleExplanation, /nullable/);
  assert.equal(kotlinReviewedCollectionWeeks[8][3].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][4].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][4].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][3].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][0].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][0].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[8][1].ruleVersion, 3);
  assert.match(kotlinReviewedCollectionWeeks[9][0].objective, /항목을 추가·삭제/);
  assert.equal(kotlinReviewedCollectionWeeks[9][0].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][0].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][1].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][1].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][2].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][2].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][3].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][3].effectVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][4].ruleVersion, 3);
  assert.equal(kotlinReviewedCollectionWeeks[9][4].effectVersion, 3);

  const collectReviewText = (value, key = '') => {
    if (key === 'example' || key === 'effectVersion' || key === 'ruleVersion') return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap((item) => collectReviewText(item));
    if (value && typeof value === 'object') {
      return Object.entries(value).flatMap(([childKey, childValue]) => collectReviewText(childValue, childKey));
    }
    return [];
  };
  const reviewedText = collectReviewText(kotlinReviewedCollectionWeeks).join(' ');
  assert.doesNotMatch(reviewedText, /lexical scope|nullable|predicate|terminal operation|Iterable|원자성|중간 컬렉션|API 수준|참조 재할당|스냅샷/);
});

test('Kotlin W10-W12 null safety, type checks, and class properties use reviewed daily cases', () => {
  const answerPositions = [];

  for (let weekNumber = 10; weekNumber <= 12; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedSafetyWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, new RegExp(`-v${review.ruleVersion ?? 2}-rule$`));
      assert.match(trace.id, /-v3-trace$/);
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      assert.equal(gradeAnswer(trace, review.traceAnswer), true, trace.id);
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);
      const firstLetter = review.traceAnswer.search(/[a-z]/i);
      if (firstLetter >= 0) {
        const letter = review.traceAnswer[firstLetter];
        const changedCase = review.traceAnswer.slice(0, firstLetter) +
          (letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase()) +
          review.traceAnswer.slice(firstLetter + 1);
        assert.equal(gradeAnswer(trace, changedCase), false, trace.id);
      }
      if (review.traceAnswer.includes(' ')) {
        assert.equal(gradeAnswer(trace, review.traceAnswer.replace(' ', '  ')), false, trace.id);
      }

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(kotlinReviewedSafetyWeeks[10][0].example, /String\? = null/);
  assert.match(kotlinReviewedSafetyWeeks[10][1].traceExplanation, /Int\?/);
  assert.match(kotlinReviewedSafetyWeeks[10][2].ruleExplanation, /null/);
  assert.match(kotlinReviewedSafetyWeeks[10][3].effectExplanation, /NullPointerException/);
  assert.match(kotlinReviewedSafetyWeeks[10][4].example, /List<String\?>/);
  assert.match(kotlinReviewedSafetyWeeks[11][0].example, /value is String/);
  assert.match(kotlinReviewedSafetyWeeks[11][1].ruleExplanation, /null이 아님을 확인/);
  assert.match(kotlinReviewedSafetyWeeks[11][2].ruleExplanation, /null/);
  assert.match(kotlinReviewedSafetyWeeks[11][3].example, /toIntOrNull/);
  assert.match(kotlinReviewedSafetyWeeks[11][4].effectExplanation, /실제 주소 사용 여부/);
  assert.match(kotlinReviewedSafetyWeeks[12][0].example, /class Course\(val title: String\)/);
  assert.match(kotlinReviewedSafetyWeeks[12][1].ruleExplanation, /IllegalArgumentException/);
  assert.match(kotlinReviewedSafetyWeeks[12][2].ruleExplanation, /getter/);
  assert.match(kotlinReviewedSafetyWeeks[12][3].ruleExplanation, /private/);
  assert.match(kotlinReviewedSafetyWeeks[12][4].effectExplanation, /isInitialized/);
  assert.ok(Object.values(kotlinReviewedSafetyWeeks).flat().every((review) => review.ruleVersion === 3 && review.effectVersion === 3));
  assert.doesNotMatch(JSON.stringify(kotlinReviewedSafetyWeeks), /nullable|non-null|early access|NPE|수신 객체/);
  assert.doesNotMatch(kotlinReviewedSafetyWeeks[12][3].effectPrompt, /로그/);
  assert.match(kotlinReviewedSafetyWeeks[12][4].objective, /Int나 val에는 쓸 수 없/);

  const source = readFileSync(new URL('../src/curriculum-kotlin-w10-w12-reviewed.js', import.meta.url), 'utf8');
  const sourceFile = ts.createSourceFile('curriculum-kotlin-w10-w12-reviewed.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const duplicates = [];
  const inspectObjects = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const seen = new Set();
      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : property.name.getText(sourceFile);
        if (seen.has(key)) duplicates.push(key);
        seen.add(key);
      }
    }
    ts.forEachChild(node, inspectObjects);
  };
  inspectObjects(sourceFile);
  assert.deepEqual(duplicates, [], 'reviewed Kotlin objects must not silently overwrite earlier learner copy');
});

test('Kotlin W13-W15 data models, inheritance, extensions, and scope functions use reviewed daily cases', () => {
  const answerPositions = [];

  for (let weekNumber = 13; weekNumber <= 15; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedDesignWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      if (review.title) assert.equal(day.title, review.title);
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, new RegExp(`-v${review.ruleVersion ?? 2}-rule$`));
      assert.match(trace.id, new RegExp(`-v${review.traceVersion ?? 3}-trace$`));
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      for (const acceptedAnswer of trace.acceptedAnswers) {
        assert.equal(gradeAnswer(trace, acceptedAnswer), true, trace.id);
        const caseChanged = acceptedAnswer.replace(/[a-z]/i, (letter) => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
        if (caseChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, caseChanged), false, trace.id);
        const spacingChanged = acceptedAnswer.replace(/ /g, '  ');
        if (spacingChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, spacingChanged), false, trace.id);
        const lineBreakChanged = acceptedAnswer.replace(/\n/g, ' ');
        if (lineBreakChanged !== acceptedAnswer && !trace.acceptedAnswers.includes(lineBreakChanged)) {
          assert.equal(gradeAnswer(trace, lineBreakChanged), false, trace.id);
        }
      }
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.deepEqual(kotlinReviewedDesignWeeks[13].map((review) => review.title), [
    '값 비교용 data class', 'data class 복사', '얕은 복사', 'enum 상태', 'sealed 상태와 ID',
  ]);
  assert.deepEqual(track.lessons[12].studyDays.map((day) => day.title), [
    '값 비교용 data class', 'data class 복사', '얕은 복사', 'enum 상태', 'sealed 상태와 ID',
  ]);
  assert.match(kotlinReviewedDesignWeeks[13][0].traceExplanation, /같은지 비교하는 equals/);
  assert.match(kotlinReviewedDesignWeeks[13][2].example, /MutableList/);
  assert.match(kotlinReviewedDesignWeeks[13][3].ruleExplanation, /ordinal/);
  assert.match(kotlinReviewedDesignWeeks[13][4].effectExplanation, /별도 객체로 다뤄질 수도/);
  assert.match(kotlinReviewedDesignWeeks[14][0].ruleExplanation, /하위 클래스/);
  assert.match(kotlinReviewedDesignWeeks[14][2].rule, /인터페이스는 값을 저장하지/);
  assert.match(kotlinReviewedDesignWeeks[14][4].traceExplanation, /SourceReader/);
  assert.match(kotlinReviewedDesignWeeks[15][0].ruleExplanation, /private/);
  assert.match(kotlinReviewedDesignWeeks[15][1].traceExplanation, /선언 타입/);
  assert.match(kotlinReviewedDesignWeeks[15][2].traceExplanation, /빈 문자열/);
  assert.match(kotlinReviewedDesignWeeks[15][3].objective, /중괄호 안 계산 결과/);
  assert.match(kotlinReviewedDesignWeeks[15][4].traceExplanation, /apply/);
  assert.ok(Object.values(kotlinReviewedDesignWeeks).flat().every((review) => review.ruleVersion === 3 && review.effectVersion === 3));
  assert.deepEqual([kotlinReviewedDesignWeeks[13][4].traceVersion, kotlinReviewedDesignWeeks[14][4].traceVersion, kotlinReviewedDesignWeeks[15][1].traceVersion, kotlinReviewedDesignWeeks[15][2].traceVersion], [4, 4, 4, 4]);

  const collectReviewText = (value, key = '') => {
    if (key === 'example' || key.endsWith('Version')) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap((item) => collectReviewText(item));
    if (value && typeof value === 'object') {
      return Object.entries(value).flatMap(([childKey, childValue]) => collectReviewText(childValue, childKey));
    }
    return [];
  };
  const reviewedText = collectReviewText(kotlinReviewedDesignWeeks).join(' ');
  assert.doesNotMatch(reviewedText, /nullable receiver|falsy|정적 타입|backing field|scope 함수|런타임 디스패치|wrapper|delegate|signature|수신 객체|boxing|무할당|교차 관심|보일러플레이트|요청 인자|유틸리티 호출/);
  assert.doesNotMatch(reviewedText, /getter|멀티플랫폼|가변 컬렉션|시험할 때마다|시험에서 고정 시계/);
  assert.match(kotlinReviewedDesignWeeks[14][4].example, /class DisplayReader/);
  assert.doesNotMatch(kotlinReviewedDesignWeeks[14][4].example, /class LoggingReader/);
  assert.match(kotlinReviewedDesignWeeks[15][2].example, /\[" \+ blank\.displayName\(\) \+ "\]/);
});

test('Kotlin W16-W18 generics, Java interop, versions, and error handling use reviewed daily cases', () => {
  const answerPositions = [];
  const weekTitles = {
    16: '여러 자료형에 맞춰 타입 지키기',
    17: 'Java와 함께 쓸 때 null 안전성',
    18: '오류를 나누고 알맞게 처리하기',
  };

  for (let weekNumber = 16; weekNumber <= 18; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedAdvancedWeeks[weekNumber];
    assert.equal(reviews.length, 5);
    assert.equal(week.title, weekTitles[weekNumber]);
    assert.doesNotMatch(week.intro, /variance|star projection|feature line|bug-fix|context parameters|explicit context arguments|collection literals/i);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.title, review.title);
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.equal(rule.id.endsWith(`-v${review.ruleVersion ?? 2}-rule`), true);
      assert.equal(trace.id.endsWith(`-v${review.traceVersion ?? 3}-trace`), true);
      assert.equal(effect.id.endsWith(`-v${review.effectVersion ?? 2}-effect`), true);
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      for (const acceptedAnswer of trace.acceptedAnswers) {
        assert.equal(gradeAnswer(trace, acceptedAnswer), true, trace.id);
        const caseChanged = acceptedAnswer.replace(/[a-z]/i, (letter) => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
        if (caseChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, caseChanged), false, trace.id);
        const spacingChanged = acceptedAnswer.replace(/ /g, '  ');
        if (spacingChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, spacingChanged), false, trace.id);
        const lineBreakChanged = acceptedAnswer.replace(/\n/g, ' ');
        if (lineBreakChanged !== acceptedAnswer && !trace.acceptedAnswers.includes(lineBreakChanged)) {
          assert.equal(gradeAnswer(trace, lineBreakChanged), false, trace.id);
        }
      }
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(kotlinReviewedAdvancedWeeks[16][0].effectExplanation, /비어 있/);
  assert.match(kotlinReviewedAdvancedWeeks[16][2].ruleExplanation, /공변/);
  assert.match(kotlinReviewedAdvancedWeeks[16][3].ruleExplanation, /반공변/);
  assert.match(kotlinReviewedAdvancedWeeks[16][2].objective, /Any는 null이 아닌 모든 Kotlin 자료형/);
  assert.match(kotlinReviewedAdvancedWeeks[16][3].objective, /Any는 null이 아닌 모든 Kotlin 자료형/);
  assert.match(kotlinReviewedAdvancedWeeks[16][4].effectExplanation, /실행 중/);
  assert.match(kotlinReviewedAdvancedWeeks[17][0].ruleExplanation, /플랫폼 타입/);
  assert.match(kotlinReviewedAdvancedWeeks[17][1].ruleExplanation, /업무 규칙/);
  assert.match(kotlinReviewedAdvancedWeeks[17][2].rule, /버그 수정/);
  assert.match(kotlinReviewedAdvancedWeeks[17][3].ruleExplanation, /실험 중/);
  assert.match(kotlinReviewedAdvancedWeeks[17][4].ruleExplanation, /-Xcollection-literals/);
  assert.match(kotlinReviewedAdvancedWeeks[18][0].traceExplanation, /finally/);
  assert.match(kotlinReviewedAdvancedWeeks[18][0].effectExplanation, /\.use\(\)/);
  assert.match(kotlinReviewedAdvancedWeeks[18][1].ruleExplanation, /IllegalArgumentException/);
  assert.match(kotlinReviewedAdvancedWeeks[18][1].ruleExplanation, /IllegalStateException/);
  assert.match(kotlinReviewedAdvancedWeeks[18][2].ruleExplanation, /빠진 처리/);
  assert.match(kotlinReviewedAdvancedWeeks[18][3].ruleExplanation, /Throwable/);
  assert.match(kotlinReviewedAdvancedWeeks[18][3].effectExplanation, /CancellationException/);
  assert.match(kotlinReviewedAdvancedWeeks[18][4].effectExplanation, /한 번만 반영/);

  const javaPlatformExample = kotlinReviewedAdvancedWeeks[17][0].example;
  assert.match(javaPlatformExample, /Java: TitleProvider\.java/);
  assert.match(javaPlatformExample, /Kotlin: Main\.kt/);
  assert.match(javaPlatformExample, /provider\.getTitle\(\)/);
  assert.doesNotMatch(javaPlatformExample, /val title: String\? = null/);

  const annotatedJavaExample = kotlinReviewedAdvancedWeeks[17][1].example;
  assert.match(annotatedJavaExample, /@Nullable/);
  assert.match(annotatedJavaExample, /provider\.getTitle\(\)/);
  assert.match(annotatedJavaExample, /"   "/);
  assert.match(kotlinReviewedAdvancedWeeks[17][3].example, /context\(logger: Logger\)/);

  const unknownMutableList = kotlinReviewedAdvancedWeeks[16][4];
  assert.match(unknownMutableList.example, /MutableList<\*>/);
  assert.match(unknownMutableList.rulePrompt, /MutableList<\*>/);
  assert.doesNotMatch(unknownMutableList.example, /items: List<\*>/);

  for (const reviews of Object.values(kotlinReviewedAdvancedWeeks)) {
    const learnerCopy = reviews.flatMap((review) => [
      review.title,
      review.objective,
      review.tracePrompt,
      review.traceHint,
      review.traceExplanation,
      review.rulePrompt,
      review.rule,
      review.ruleHint,
      review.ruleExplanation,
      review.effectPrompt,
      review.effectCorrect,
      review.effectHint,
      review.effectExplanation,
      ...review.ruleWrong.flat(),
      ...review.effectWrong.flat(),
    ]).join(' ');
    assert.doesNotMatch(learnerCopy, /variance|star projection|nullability 어노테이션|feature line|bug-fix|context parameters|explicit context arguments|collection literals|callable references|\bexperimental\b|\bstable\b/i);
  }
});

test('Kotlin W19-W21 coroutine, cancellation, and Flow lessons use reviewed daily cases', () => {
  const answerPositions = [];

  for (let weekNumber = 19; weekNumber <= 21; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedConcurrencyWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.title, review.title);
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      const [rule, trace, effect] = day.exercises;

      assert.match(rule.id, new RegExp(`-v${review.ruleVersion ?? 2}-rule$`));
      assert.match(trace.id, new RegExp(`-v${review.traceVersion ?? 3}-trace$`));
      assert.match(effect.id, new RegExp(`-v${review.effectVersion ?? 2}-effect$`));
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);
      for (const acceptedAnswer of trace.acceptedAnswers) {
        assert.equal(gradeAnswer(trace, acceptedAnswer), true, trace.id);
        const caseChanged = acceptedAnswer.replace(/[a-z]/i, (letter) => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
        if (caseChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, caseChanged), false, trace.id);
        const spacingChanged = acceptedAnswer.replace(/ /g, '  ');
        if (spacingChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, spacingChanged), false, trace.id);
        const lineBreakChanged = acceptedAnswer.replace(/\n/g, ' ');
        if (lineBreakChanged !== acceptedAnswer && !trace.acceptedAnswers.includes(lineBreakChanged)) {
          assert.equal(gradeAnswer(trace, lineBreakChanged), false, trace.id);
        }
      }
      assert.equal(gradeAnswer(trace, 'wrong output'), false, trace.id);

      for (const choiceExercise of [rule, effect]) {
        const wrongOptions = choiceExercise.choices.filter((option) => option.id !== choiceExercise.answer);
        assert.equal(wrongOptions.length, 2, choiceExercise.id);
        assert.equal(gradeAnswer(choiceExercise, choiceExercise.answer), true, choiceExercise.id);
        for (const option of wrongOptions) {
          assert.equal(gradeAnswer(choiceExercise, option.id), false, choiceExercise.id);
          assert.ok(choiceExercise.choiceExplanations[option.id]?.length > 10, choiceExercise.id);
        }
        answerPositions.push(choiceExercise.choices.findIndex((option) => option.id === choiceExercise.answer));
      }
    }
  }

  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(kotlinReviewedConcurrencyWeeks[19][0].ruleWrong[0][1], /Dispatcher\(/);
  assert.match(kotlinReviewedConcurrencyWeeks[19][1].traceExplanation, /자식/);
  assert.match(kotlinReviewedConcurrencyWeeks[19][2].ruleExplanation, /Job/);
  assert.match(kotlinReviewedConcurrencyWeeks[19][3].ruleExplanation, /Deferred/);
  assert.match(kotlinReviewedConcurrencyWeeks[19][4].effectExplanation, /CPU/);
  assert.match(kotlinReviewedConcurrencyWeeks[20][0].ruleExplanation, /부모/);
  assert.match(kotlinReviewedConcurrencyWeeks[20][1].ruleExplanation, /ensureActive/);
  assert.match(kotlinReviewedConcurrencyWeeks[20][2].effectExplanation, /다시 전달/);
  assert.match(kotlinReviewedConcurrencyWeeks[20][3].effectExplanation, /WorkManager/);
  assert.match(kotlinReviewedConcurrencyWeeks[20][4].ruleExplanation, /정상 결과로 null/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][0].traceExplanation, /collect/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][1].effectExplanation, /중복 방지/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][2].ruleExplanation, /중간 상태를 건너뛰고/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][3].ruleExplanation, /다시 보낼 개수/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][4].effectExplanation, /WhileSubscribed/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][4].example, /flowOf\("불러오는 중", "완료"\)/);
  assert.match(kotlinReviewedConcurrencyWeeks[21][4].traceExplanation, /다시 시작하면 이 차가운 Flow도 두 값을 다시 보내요/);
  assert.equal(kotlinReviewedConcurrencyWeeks[19][3].ruleVersion, 3);
  assert.equal(kotlinReviewedConcurrencyWeeks[21][4].traceVersion, 4);
});

test('Kotlin W22-W24 coroutine tests, Android configuration, and state restoration use distinct reviewed cases', () => {
  const answerPositions = [];
  const ids = new Set();

  for (let weekNumber = 22; weekNumber <= 24; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedAndroidWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.title, review.title);
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.ok(review.traceAnswer.length > 0);
      assert.ok(review.traceHint.length > 10);
      assert.ok(review.traceExplanation.length > 20);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, new RegExp(`-v${exercise === trace ? 3 : 2}-`));
        assert.ok(exercise.prompt.length > 30, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 20, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      for (const acceptedAnswer of trace.acceptedAnswers) {
        assert.equal(gradeAnswer(trace, acceptedAnswer), true, trace.id);
        const caseChanged = acceptedAnswer.replace(/[a-z]/i, (letter) => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
        if (caseChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, caseChanged), false, trace.id);
        const spacingChanged = acceptedAnswer.replace(/ /g, '  ');
        if (spacingChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, spacingChanged), false, trace.id);
        const lineBreakChanged = acceptedAnswer.replace(/\n/g, ' ');
        if (lineBreakChanged !== acceptedAnswer && !trace.acceptedAnswers.includes(lineBreakChanged)) {
          assert.equal(gradeAnswer(trace, lineBreakChanged), false, trace.id);
        }
      }
      assert.equal(gradeAnswer(trace, ''), false, trace.id);
      assert.equal(rule.choices.find((option) => option.id === rule.answer)?.text, review.rule);
      assert.equal(effect.choices.find((option) => option.id === effect.answer)?.text, review.effectCorrect);

      for (const choiceExercise of [rule, effect]) {
        assert.equal(choiceExercise.choices.length, 3, choiceExercise.id);
        const optionTexts = choiceExercise.choices.map((option) => option.text.trim());
        assert.equal(new Set(optionTexts).size, 3, choiceExercise.id);
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
  assert.match(kotlinReviewedAndroidWeeks[22][0].traceExplanation, /가상/);
  assert.match(kotlinReviewedAndroidWeeks[22][3].ruleExplanation, /전역/);
  assert.match(kotlinReviewedAndroidWeeks[22][4].ruleExplanation, /무한/);
  assert.match(kotlinReviewedAndroidWeeks[22][1].ruleExplanation, /ExperimentalCoroutinesApi/);
  assert.match(kotlinReviewedAndroidWeeks[22][2].ruleExplanation, /advanceTimeBy.*ExperimentalCoroutinesApi/s);
  assert.match(kotlinReviewedAndroidWeeks[22][3].ruleExplanation, /setMain.*resetMain.*ExperimentalCoroutinesApi/s);
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/-test-coroutine-scheduler/advance-time-by.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/run-current.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/reset-main.html'));
  assert.match(kotlinReviewedAndroidWeeks[23][1].effectExplanation, /merged manifest/);
  assert.match(kotlinReviewedAndroidWeeks[23][1].ruleExplanation, /targetSdk 31/);
  assert.match(kotlinReviewedAndroidWeeks[23][1].ruleExplanation, /명시/);
  assert.match(kotlinReviewedAndroidWeeks[23][2].ruleExplanation, /minSdk/);
  assert.match(kotlinReviewedAndroidWeeks[23][3].ruleExplanation, /API 37/);
  assert.match(kotlinReviewedAndroidWeeks[23][4].effectExplanation, /빌드/);
  assert.match(kotlinReviewedAndroidWeeks[24][1].ruleExplanation, /재생성/);
  assert.match(kotlinReviewedAndroidWeeks[24][2].ruleExplanation, /앱 프로세스 종료/);
  assert.match(kotlinReviewedAndroidWeeks[24][3].ruleExplanation, /직렬화/);
  assert.match(kotlinReviewedAndroidWeeks[24][4].traceExplanation, /프로세스 메모리/);
  assert.doesNotMatch(JSON.stringify(kotlinReviewedAndroidWeeks[24]), /foreground|system-initiated|process death/i);
});

test('Kotlin W25-W27 Compose UI, state, navigation, and adaptive layouts use reviewed applied cases', () => {
  const answerPositions = [];
  const ids = new Set();

  for (let weekNumber = 25; weekNumber <= 27; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedComposeWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.ok(review.tracePrompt.length > 20);
      assert.ok(review.traceAnswer.length > 0);
      assert.ok(review.traceHint.length > 10);
      assert.ok(review.traceExplanation.length > 25);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        assert.match(exercise.id, new RegExp(`-v${exercise === trace ? 3 : 2}-`));
        assert.ok(exercise.prompt.length > 30, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 20, exercise.id);
      }

      assert.equal(rule.type, 'choice');
      assert.equal(trace.type, 'short-answer');
      assert.equal(effect.type, 'choice');
      assert.ok(rule.prompt.includes(review.example), rule.id);
      assert.ok(trace.prompt.includes(review.example), trace.id);
      assert.ok(trace.prompt.includes(review.tracePrompt), trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])]);
      assert.equal(trace.answerNormalization, 'exact-output', trace.id);
      for (const acceptedAnswer of trace.acceptedAnswers) {
        assert.equal(gradeAnswer(trace, acceptedAnswer), true, trace.id);
        const caseChanged = acceptedAnswer.replace(/[a-z]/i, (letter) => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase());
        if (caseChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, caseChanged), false, trace.id);
        const spacingChanged = acceptedAnswer.replace(/ /g, '  ');
        if (spacingChanged !== acceptedAnswer) assert.equal(gradeAnswer(trace, spacingChanged), false, trace.id);
        const lineBreakChanged = acceptedAnswer.replace(/\n/g, ' ');
        if (lineBreakChanged !== acceptedAnswer && !trace.acceptedAnswers.includes(lineBreakChanged)) {
          assert.equal(gradeAnswer(trace, lineBreakChanged), false, trace.id);
        }
      }
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
  assert.match(kotlinReviewedComposeWeeks[25][0].ruleExplanation, /부수 효과/);
  assert.match(kotlinReviewedComposeWeeks[25][2].traceExplanation, /Modifier/);
  assert.match(kotlinReviewedComposeWeeks[25][4].ruleExplanation, /키/);
  assert.match(kotlinReviewedComposeWeeks[26][0].ruleExplanation, /구성 변경/);
  assert.match(kotlinReviewedComposeWeeks[26][1].ruleExplanation, /장기 보존/);
  assert.match(kotlinReviewedComposeWeeks[26][2].ruleExplanation, /State hoisting/);
  assert.match(kotlinReviewedComposeWeeks[26][3].ruleExplanation, /단방향/);
  assert.match(kotlinReviewedComposeWeeks[26][4].ruleExplanation, /현재 데이터/);
  assert.match(kotlinReviewedComposeWeeks[27][0].traceExplanation, /지연 구성/);
  assert.match(kotlinReviewedComposeWeeks[27][1].ruleExplanation, /unique/);
  assert.match(kotlinReviewedComposeWeeks[27][2].effectExplanation, /deep link/);
  assert.match(kotlinReviewedComposeWeeks[27][2].traceExplanation, /Navigation 2\.8\.0 이상/);
  assert.match(kotlinReviewedComposeWeeks[27][3].ruleExplanation, /window size classes/);
  assert.match(kotlinReviewedComposeWeeks[27][3].traceExplanation, /너비와 높이/);
  assert.match(kotlinReviewedComposeWeeks[27][4].ruleExplanation, /expanded/);
  assert.match(kotlinReviewedComposeWeeks[27][4].traceExplanation, /사용 가능한 높이/);
  assert.ok(track.contentReview.sources.some(({ url }) => url === 'https://developer.android.com/guide/navigation/design/type-safety'));
  assert.ok(track.contentReview.sources.some(({ url }) => url === 'https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes'));
  assert.ok(track.contentReview.sources.some(({ url }) => url === 'https://developer.android.com/develop/ui/compose/state-saving'));
  assert.ok(track.contentReview.sources.some(({ url }) => url === 'https://developer.android.com/privacy-and-security/local-network-permission'));
});

test('Kotlin W28-W30 data, accessibility, security, performance, and release cases state their evidence boundaries', () => {
  const answerPositions = [];
  const ids = new Set();

  for (let weekNumber = 28; weekNumber <= 30; weekNumber++) {
    const week = track.lessons[weekNumber - 1];
    const reviews = kotlinReviewedArchitectureWeeks[weekNumber];
    assert.equal(reviews.length, 5);

    for (const [index, review] of reviews.entries()) {
      const day = week.studyDays[index];
      assert.equal(day.objective, review.objective);
      assert.equal(day.example, review.example);
      assert.ok(review.tracePrompt.length > 20);
      assert.ok(review.traceAnswer.length > 0);
      assert.ok(review.traceHint.length > 10);
      assert.ok(review.traceExplanation.length > 25);
      const [rule, trace, effect] = day.exercises;

      for (const exercise of day.exercises) {
        assert.ok(!ids.has(exercise.id), exercise.id);
        ids.add(exercise.id);
        const expectedVersion = exercise === trace
          ? review.traceVersion ?? 2
          : review.ruleVersion ?? 2;
        assert.match(exercise.id, new RegExp(`-v${expectedVersion}-`));
        assert.ok(exercise.prompt.length > 30, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 20, exercise.id);
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
  assert.match(kotlinReviewedArchitectureWeeks[28][0].ruleExplanation, /repository/);
  assert.match(kotlinReviewedArchitectureWeeks[28][1].ruleExplanation, /DataStore/);
  assert.match(kotlinReviewedArchitectureWeeks[28][2].ruleExplanation, /Flow/);
  assert.match(kotlinReviewedArchitectureWeeks[28][3].ruleExplanation, /stale/);
  assert.match(kotlinReviewedArchitectureWeeks[28][4].ruleExplanation, /WorkManager/);
  assert.match(kotlinReviewedArchitectureWeeks[29][0].ruleExplanation, /semantics/);
  assert.match(kotlinReviewedArchitectureWeeks[29][0].example, /stringResource\(R\.string\.save_action\)/);
  assert.doesNotMatch(kotlinReviewedArchitectureWeeks[29][0].example, /contentDescription = "저장"/);
  assert.match(kotlinReviewedArchitectureWeeks[29][1].traceAnswer, /48 × 48 dp/);
  assert.match(kotlinReviewedArchitectureWeeks[29][2].ruleExplanation, /필요한 권한만/);
  assert.match(kotlinReviewedArchitectureWeeks[29][3].ruleExplanation, /decompile/);
  assert.match(kotlinReviewedArchitectureWeeks[29][4].ruleExplanation, /ACCESS_LOCAL_NETWORK/);
  assert.match(kotlinReviewedArchitectureWeeks[29][4].effectCorrect, /Output Switcher/);
  assert.deepEqual(
    track.lessons[28].studyDays[4].exercises.map(({ id }) => id.match(/-v(\d+)-/)?.[1]),
    ['3', '4', '3'],
  );
  assert.match(kotlinReviewedArchitectureWeeks[30][0].ruleExplanation, /측정/);
  assert.match(kotlinReviewedArchitectureWeeks[30][1].ruleExplanation, /Compose test/);
  assert.match(kotlinReviewedArchitectureWeeks[30][2].ruleExplanation, /targetSdk/);
  assert.match(kotlinReviewedArchitectureWeeks[30][3].ruleExplanation, /API/);
  assert.match(kotlinReviewedArchitectureWeeks[30][4].effectExplanation, /compile/);
});

test('Kotlin W31 capstone maps requirements to state, architecture, tests, and honest release evidence', () => {
  const reviews = kotlinReviewedCapstoneWeek[31];
  const week = track.lessons[30];
  assert.equal(reviews.length, 5);
  const ids = new Set();
  const answerPositions = [];

  for (const [index, review] of reviews.entries()) {
    const day = week.studyDays[index];
    assert.equal(day.objective, review.objective);
    assert.equal(day.example, review.example);
    assert.ok(review.tracePrompt.length > 20);
    assert.ok(review.traceAnswer.length > 0);
    assert.ok(review.traceHint.length > 10);
    assert.ok(review.traceExplanation.length > 25);
    const [rule, trace, effect] = day.exercises;

    for (const exercise of day.exercises) {
      assert.ok(!ids.has(exercise.id), exercise.id);
      ids.add(exercise.id);
      const expectedVersion = exercise === trace ? review.traceVersion ?? 2 : review.ruleVersion ?? 2;
      assert.match(exercise.id, new RegExp(`-v${expectedVersion}-`));
      assert.ok(exercise.prompt.length > 30, exercise.id);
      assert.ok(exercise.hint.length > 10, exercise.id);
      assert.ok(exercise.explanation.length > 20, exercise.id);
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

  assert.equal(ids.size, 15);
  assert.ok([0, 1, 2].every((position) => answerPositions.includes(position)));
  assert.match(reviews[0].example, /요구사항:/);
  assert.match(reviews[1].example, /조회 성공 후 학습 기록이 0개면 Empty 상태/);
  assert.match(reviews[2].example, /Room이 변경된 학습 기록을 Flow로 전달/);
  assert.match(reviews[3].example, /저장 버튼의 목적을 보조 기술에 알림/);
  assert.match(reviews[4].example, /검토 결과:/);
  assert.doesNotMatch(JSON.stringify(reviews), /\b(?:offline|online|acceptance|persistent|device|fixture|runtime)\b/i);
  assert.ok(track.contentReview.sources.some(({ url }) => url === 'https://developer.android.com/training/data-storage/room/testing-db'));
  assert.match(reviews[0].effectExplanation, /앱을 종료·재실행하고/);
  assert.match(reviews[1].ruleExplanation, /서로 다른 상태/);
  assert.match(reviews[2].effectExplanation, /저장 작업 묶음/);
  assert.match(reviews[3].ruleExplanation, /서로 다른 검사/);
  assert.match(reviews[3].ruleExplanation, /실제 입력·실행 환경/);
  assert.match(reviews[4].effectExplanation, /미실행/);
});

test('Kotlin W28-W31 scenario answers use their documented matching rules', () => {
  let strictAnswerCount = 0;
  for (const week of track.lessons.slice(27)) {
    for (const day of week.studyDays) {
      const trace = day.exercises.find((exercise) => exercise.type === 'short-answer');
      const review = (week.week === 31 ? kotlinReviewedCapstoneWeek : kotlinReviewedArchitectureWeeks)[week.week][day.number - 1];
      assert.equal(trace.answerNormalization, review.traceNormalization ?? 'default', trace.id);
      assert.deepEqual(trace.acceptedAnswers, [review.traceAnswer, ...(review.traceAlternatives ?? [])], trace.id);
      for (const answer of trace.acceptedAnswers) assert.equal(gradeAnswer(trace, answer), true, trace.id);
      assert.equal(gradeAnswer(trace, `정답이 아닌 내용: ${trace.id}`), false, trace.id);
      if (trace.answerNormalization === 'case-sensitive') strictAnswerCount += 1;
    }
  }
  assert.equal(strictAnswerCount, 4);
});

test('Kotlin week titles do not repeat the week number already shown in the lesson heading', () => {
  assert.equal(track.lessons.length, 31);
  for (const lesson of track.lessons) {
    assert.doesNotMatch(lesson.title, /^\d+주차\s*[·:]/, lesson.id);
  }
});
