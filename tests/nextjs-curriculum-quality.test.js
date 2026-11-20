import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
import { getExercise, getTrack } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const track = getTrack('nextjs');

function assertQuestionVersion(exercise) {
  assert.match(exercise.id, /-v(?:2|3)$/);
  if (exercise.id.endsWith('-v3')) {
    const legacyId = exercise.id.replace(/-v3$/, '-v2');
    assert.ok(exercise.legacyIds?.includes(legacyId), exercise.id);
    assert.equal(getExercise(legacyId), exercise);
  }
}

test('Next.js identifier answers preserve code casing and older progress IDs', () => {
  const questions = track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer' && exercise.answerNormalization === 'case-sensitive');
  assert.equal(questions.length, 47);

  for (const exercise of questions) {
    assert.ok(exercise.legacyIds?.length, exercise.id);
    for (const legacyId of exercise.legacyIds) assert.equal(getExercise(legacyId), exercise, legacyId);
    for (const answer of exercise.acceptedAnswers) {
      assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
      const wrongCase = answer.toLocaleLowerCase('ko-KR');
      if (wrongCase !== answer) assert.equal(gradeAnswer(exercise, wrongCase), false, `${exercise.id}: ${wrongCase}`);
    }
  }

  const coursesProp = getExercise('nextjs-w10-d1-apply-v2');
  assert.equal(gradeAnswer(coursesProp, 'courses'), true);
  assert.equal(gradeAnswer(coursesProp, 'props'), false);
  const playwright = getExercise('nextjs-w23-d4-apply-v2');
  assert.ok(playwright.acceptedAnswers.every((answer) => answer.includes('getByRole') && answer.includes('toBeVisible')));
  assert.equal(gradeAnswer(playwright, 'await expect link visible'), false);
});

test('Next.js opening lessons accept common equivalent answers without weakening the answer contract', () => {
  const equivalentAnswers = [
    ['nextjs-w01-d2-reason-v2', '루트 경로'],
    ['nextjs-w01-d3-reason-v2', 'next build 명령어'],
    ['nextjs-w01-d3-apply-v2', 'next start 명령'],
    ['nextjs-w01-d5-reason-v2', 'Node.js 런타임'],
    ['nextjs-w01-d5-apply-v2', '실행 시점과 위치'],
    ['nextjs-w03-d2-apply-v2', 'html/body'],
    ['nextjs-w03-d3-apply-v2', '클라이언트 측 화면 이동'],
  ];

  for (const [id, answer] of equivalentAnswers) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.equal(gradeAnswer(exercise, answer), true, `${id}: ${answer}`);
  }

  const routeFile = getExercise('nextjs-w03-d1-apply-v2');
  assert.equal(gradeAnswer(routeFile, 'layout.tsx'), false);
  const staticHost = getExercise('nextjs-w01-d5-reason-v2');
  assert.equal(gradeAnswer(staticHost, 'React'), false);
});

test('Next.js has a 33-week, seven-stage guided course rather than an unsupported server runner', () => {
  assert.ok(track);
  assert.equal(track.course.weeks, 33);
  assert.equal(track.course.sessions, 165);
  assert.equal(track.course.questions, 495);
  assert.equal(track.course.phases, 7);
  assert.deepEqual(track.course.reviewedWeeks, Array.from({ length: 33 }, (_, index) => index + 1));
  assert.equal(track.lessons.length, 33);
  assert.deepEqual(track.topics.map((topic) => topic.stage), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(track.contentReview.version, 'Next.js 16.4.3 · 코드 읽기 과정');
  assert.equal(track.contentReview.reviewedAt, '2026-11-02');
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/blog/next-16.4'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.npmjs.com/package/next'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/error'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/components/link'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/static-exports'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/getting-started/project-structure'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/getting-started/layouts-and-pages'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/components/link'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/page'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/use-router'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/prefetching'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/server-and-client-boundary'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/getting-started/server-and-client-components'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/directives/use-client'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/data-security'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/rsc/use-server'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/useState'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/useContext'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/useEffect'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/fetch'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/directives/use-cache'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/cacheLife'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/caching-without-cache-components'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/loading'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/error'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/not-found'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/Suspense'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/forms'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/directives/use-cache'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/cacheLife'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/updateTag'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/components/image'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/getting-started/fonts'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/content-security-policy'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/production-checklist'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/testing'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/upgrading/version-16'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/config/typescript'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/proxy'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/testing/playwright'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/testing/jest'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.w3.org/WAI/tutorials/forms/labels/'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://testing-library.com/docs/queries/about/'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nodejs.org/api/test.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://playwright.dev/docs/test-assertions'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/getting-started/error-handling'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/tutorial-transactions.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.postgresql.org/docs/18/ddl-alter.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/environment-variables'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/static-exports'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/production-checklist'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/useActionState'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react-dom/hooks/useFormStatus'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://react.dev/reference/react/useOptimistic'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/updateTag'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/revalidatePath'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/cookies'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/headers'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/redirect'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/functions/generate-metadata'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/api-reference/file-conventions/route'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/docs/app/guides/backend-for-frontend'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://www.rfc-editor.org/rfc/rfc9110.html'));
  assert.ok(track.contentReview.versionContext.includes('서버를 실행하지 않으므로'));
  assert.ok(track.contentReview.versionContext.includes('Cache Components'));
});

test('Next.js phases cover every week exactly once and lessons build in order', () => {
  const phaseWeeks = track.topics.flatMap((topic) => topic.lessonIds.map((lessonId) => (
    track.lessons.find((lesson) => lesson.id === lessonId)?.week
  )));
  assert.deepEqual([...phaseWeeks].sort((left, right) => left - right), Array.from({ length: 33 }, (_, index) => index + 1));

  for (const [index, lesson] of track.lessons.entries()) {
    assert.equal(lesson.week, index + 1);
    assert.equal(lesson.contentReviewStatus, '문항 검수 완료');
    assert.equal(lesson.prerequisiteLessonIds.length, index === 0 ? 0 : 1);
    if (index > 0) assert.equal(lesson.prerequisiteLessonIds[0], track.lessons[index - 1].id);
    assert.equal(lesson.studyDays.length, 5);
    assert.equal(lesson.exercises.length, 15);
    assert.equal(new Set(lesson.studyDays.map((day) => day.title)).size, 5, lesson.id);
    assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5, lesson.id);
    assert.equal(lesson.studyDays.reduce((sum, day) => sum + day.exercises.length, 0), 15, lesson.id);
  }
});

test('Next.js week screens avoid duplicate headings and repeated boilerplate', () => {
  assert.equal(track.practiceMode, '코드 읽기·개념 확인 495개');
  assert.match(track.contentReview.versionContext, /2026-11-02.*16\.4\.3/);
  assert.match(track.contentReview.versionContext, /16\.5.*canary.*시험판/);
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://github.com/vercel/next.js/releases'));
  assert.ok(track.contentReview.sources.some((source) => source.url === 'https://nextjs.org/support-policy'));

  for (const lesson of track.lessons) {
    assert.doesNotMatch(lesson.title, /^\d+주차\s*[·:]/, lesson.id);
    assert.equal(lesson.referenceVersion, 'Next.js 16.4.3 · 코드 읽기 과정', lesson.id);
    assert.equal(lesson.intro, '', lesson.id);
    assert.deepEqual(lesson.points, [], lesson.id);

    for (const day of lesson.studyDays) {
      assert.ok(day.intro.length > 15, `${lesson.week}/${day.number} must retain its specific rule`);
      assert.notEqual(day.intro, day.objective, `${lesson.week}/${day.number} repeats its objective`);
      assert.doesNotMatch(day.intro, /이 사이트에서 실행되지 않습니다|원리 확인용 스니펫/);
    }
  }
});

test('all Next.js guided answers are gradeable and distinct', () => {
  const ids = new Set();
  const questions = track.lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(questions.length, 495);

  for (const lesson of track.lessons) {
    for (const day of lesson.studyDays) {
      for (const exercise of day.exercises) {
        assert.equal(ids.has(exercise.id), false, exercise.id);
        ids.add(exercise.id);
        assert.ok(exercise.prompt.length > 35, exercise.id);
        assert.ok(exercise.hint.length > 10, exercise.id);
        assert.ok(exercise.explanation.length > 15, exercise.id);
        assert.notEqual(exercise.type, 'coding', exercise.id);
        assert.notEqual(exercise.type, 'repair-code', exercise.id);

        if (exercise.type === 'choice') {
          assert.equal(exercise.choices.length, 3, exercise.id);
          assert.equal(new Set(exercise.choices.map((choice) => choice.text)).size, 3, exercise.id);
          assert.deepEqual(Object.keys(exercise.choiceExplanations).sort(), exercise.choices.map((choice) => choice.id).sort());
          assert.ok(exercise.choices.some((choice) => choice.id === exercise.answer), exercise.id);
          assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
          for (const option of exercise.choices.filter((choice) => choice.id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(exercise.type, 'short-answer', exercise.id);
          assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
          for (const answer of exercise.acceptedAnswers) assert.equal(gradeAnswer(exercise, answer), true, exercise.id);
          assert.equal(gradeAnswer(exercise, '무관한 답변'), false, exercise.id);
        }
      }
    }
  }
});

test('Next.js weeks one through three have authored daily objectives and contextual questions', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 1 && lesson.week <= 3);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 40, `${lesson.week}/${day.number} example is too small`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
        if (exercise.type === 'choice') answerPositions[exercise.answer] += 1;
      }
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(lessons[0].studyDays[1].exercises[0].choices.find((option) => option.id === lessons[0].studyDays[1].exercises[0].answer)?.text, '/courses');
  assert.ok(lessons[1].studyDays[2].exercises[1].acceptedAnswers.includes('/images/course.svg'));
  assert.ok(lessons[1].studyDays[3].exercises[2].acceptedAnswers.includes('loading.tsx'));
  assert.ok(lessons[2].studyDays[1].exercises[1].acceptedAnswers.includes('children'));
  assert.ok(lessons[2].studyDays[3].exercises[2].acceptedAnswers.includes('/courses'));
  assert.match(lessons[2].studyDays[4].exercises[0].explanation, /인증이나 인가를 수행하지 않아요/);
});

test('Next.js weeks four through six teach navigation, route params, and query state with authored cases', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 4 && lesson.week <= 6);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 80, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
        if (exercise.type === 'choice') answerPositions[exercise.answer] += 1;
      }
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.match(lessons[0].studyDays[1].example, /allowedCourseSlugs[\s\S]*encodeURIComponent/);
  assert.match(lessons[0].studyDays[2].example, /"use client"[\s\S]*router\.back\(\)[\s\S]*href="\/courses"/);
  assert.ok(lessons[0].studyDays[3].example.includes('aria-current="page"'));
  assert.ok(lessons[1].studyDays[1].example.includes('await params'));
  assert.ok(lessons[1].studyDays[3].example.includes('[...parts]'));
  assert.match(lessons[1].studyDays[4].example, /parseCourseId[\s\S]*notFound\(\)/);
  assert.match(lessons[2].studyDays[0].example, /string \| string\[\]/);
  assert.ok(lessons[2].studyDays[0].example.includes('Promise<Search>'));
  assert.ok(lessons[2].studyDays[3].example.includes('Number.isSafeInteger'));
  assert.match(lessons[2].studyDays[4].example, /Never put passwords[\s\S]*tokens/);
  assert.ok(track.lessons.find((lesson) => lesson.title.includes('업데이트와 호환성')).studyDays[0].example.includes('Next.js 16.4.3'));

  const routeAuthorization = getExercise('nextjs-w05-d5-apply-v2');
  assert.equal(gradeAnswer(routeAuthorization, '별도 접근 권한 확인이 필요해요'), true);
  assert.equal(gradeAnswer(routeAuthorization, 'URL을 안다고 권한을 얻는 것은 아니에요.'), true);
  assert.equal(gradeAnswer(routeAuthorization, '로그인만 하면 모든 강의에 접근할 수 있어요.'), false);
});

test('Next.js weeks seven through nine teach server/client boundaries and data transfer with authored cases', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 7 && lesson.week <= 9);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
        if (exercise.type === 'choice') answerPositions[exercise.answer] += 1;
      }
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.match(lessons[0].studyDays[2].example, /server-only[\s\S]*CATALOG_TOKEN/);
  assert.match(lessons[0].studyDays[4].example, /<Modal>[\s\S]*<CourseSummary \/>[\s\S]*<\/Modal>/);
  assert.match(lessons[1].studyDays[0].example, /^"use client";/);
  assert.match(lessons[1].studyDays[3].example, /useEffect[\s\S]*document\.title/);
  assert.match(lessons[1].studyDays[4].example, /RichEditor[\s\S]*client graph/);
  assert.match(lessons[2].studyDays[1].example, /use server/);
  assert.match(lessons[2].studyDays[2].example, /passwordHash/);
  assert.match(lessons[2].studyDays[3].example, /toISOString\(\)/);
  assert.match(lessons[2].studyDays[4].example, /useState\(initialTime\)[\s\S]*useEffect/);

  for (const id of [
    'nextjs-w08-d2-reason-v3',
    'nextjs-w08-d4-reason-v3',
    'nextjs-w09-d4-reason-v3',
  ]) {
    const exercise = getExercise(id);
    assert.ok(exercise, id);
    assert.ok(exercise.legacyIds?.length, id);
    assert.equal(getExercise(id.replace(/-v3$/, '-v2')), exercise);
  }

  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.deepEqual(errors, [], `W${lesson.week} D${day.number} example must parse as TSX`);
    }
  }
  assert.equal(parsedExamples, 15);
});

test('Next.js weeks ten through twelve teach current fetch, streaming, and error contracts', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 10 && lesson.week <= 12);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
        if (exercise.type === 'choice') answerPositions[exercise.answer] += 1;
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.deepEqual(errors, [], `W${lesson.week} D${day.number} example must parse as TSX`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /async function CoursePage[\s\S]*await fetch/);
  assert.match(lessons[0].studyDays[1].example, /!response\.ok/);
  assert.match(lessons[0].studyDays[2].intro, /memoization|메모이제이션/);
  assert.match(lessons[0].studyDays[3].example, /Promise\.all/);
  assert.match(lessons[0].studyDays[4].example, /use cache[\s\S]*cacheLife/);
  assert.match(lessons[0].studyDays[4].objective, /Cache Components/);
  assert.match(lessons[1].studyDays[0].example, /role="status"/);
  assert.match(lessons[1].studyDays[1].example, /<Suspense[\s\S]*fallback/);
  assert.match(lessons[1].studyDays[2].example, /aria-hidden="true"/);
  assert.match(lessons[1].studyDays[4].objective, /정적 파일/);
  assert.match(lessons[2].studyDays[0].example, /^"use client";/);
  assert.match(lessons[2].studyDays[1].example, /retry\(\)/);
  assert.doesNotMatch(lessons[2].studyDays[1].example, /reset/);
  assert.match(lessons[2].studyDays[2].intro, /streaming/);
  assert.match(lessons[2].studyDays[3].example, /response\.ok[\s\S]*courses\.length === 0/);
  assert.match(lessons[2].studyDays[4].example, /error\.digest/);
});

test('Next.js weeks thirteen through fifteen teach metadata, Route Handlers, and HTTP contracts', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 13 && lesson.week <= 15);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts an unrelated answer`);
        }
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} example TSX diagnostic codes: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /export const metadata/);
  assert.match(lessons[0].studyDays[1].example, /generateMetadata[\s\S]*await params/);
  assert.match(lessons[0].studyDays[2].example, /metadataBase[\s\S]*canonical/);
  assert.match(lessons[0].studyDays[3].example, /openGraph[\s\S]*images/);
  assert.match(lessons[0].studyDays[4].example, /generateMetadata[\s\S]*getCourse[\s\S]*Page/);
  assert.match(lessons[1].studyDays[0].example, /page\.tsx[\s\S]*route\.ts/);
  assert.match(lessons[1].studyDays[1].example, /export async function GET[\s\S]*export async function POST/);
  assert.match(lessons[1].studyDays[2].example, /status: 200[\s\S]*status: 400/);
  assert.match(lessons[1].studyDays[3].example, /request\.json[\s\S]*safeParse/);
  assert.match(lessons[1].studyDays[4].example, /force-static[\s\S]*GET/);
  assert.match(lessons[2].studyDays[0].example, /status: 201[\s\S]*Location[\s\S]*204/);
  assert.match(lessons[2].studyDays[1].example, /unknown[\s\S]*safeParse/);
  assert.match(lessons[2].studyDays[2].example, /Math\.min[\s\S]*Math\.max[\s\S]*cursor/);
  assert.match(lessons[2].studyDays[3].example, /Idempotency-Key[\s\S]*runOrReturnStoredResult/);
  assert.match(lessons[2].studyDays[4].example, /requestId[\s\S]*status: 503/);
});

test('Next.js weeks sixteen through eighteen teach forms, cache mutations, and request security boundaries', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 16 && lesson.week <= 18);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} example TSX diagnostic codes: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /<form action=\{createCourse\}>/);
  assert.match(lessons[0].studyDays[1].example, /getAll\("tag"\)/);
  assert.match(lessons[0].studyDays[2].example, /requireUser[\s\S]*ownerId/);
  assert.match(lessons[0].studyDays[3].example, /useActionState[\s\S]*pending/);
  assert.match(lessons[0].studyDays[4].example, /useFormStatus[\s\S]*<form/);
  assert.match(lessons[1].studyDays[0].example, /aria-describedby[\s\S]*role="status"/);
  assert.match(lessons[1].studyDays[1].example, /useOptimistic/);
  assert.match(lessons[1].studyDays[2].example, /updateTag\("courses"\)/);
  assert.match(lessons[1].studyDays[1].example, /useOptimistic[\s\S]*저장하지 못했어요[\s\S]*<label>과정 이름[\s\S]*role="status"[\s\S]*key=\{course\.id\}/);
  assert.match(lessons[1].studyDays[3].example, /"use server"[\s\S]*revalidatePath[\s\S]*revalidateTag\("courses", "max"\)/);
  assert.match(lessons[1].studyDays[4].example, /saveValidatedCourse[\s\S]*updateTag[\s\S]*redirect/);
  assert.match(lessons[2].studyDays[0].example, /<Suspense[\s\S]*await cookies\(\)[\s\S]*storedTheme/);
  assert.match(lessons[2].studyDays[1].example, /<Suspense[\s\S]*await headers\(\)[\s\S]*x-forwarded-for/);
  const cookieBoundary = getExercise('nextjs-w18-d1-decision-v2');
  assert.match(cookieBoundary.choices.find(({ id }) => id === cookieBoundary.answer).text, /Suspense/);
  assert.match(lessons[2].studyDays[2].example, /requireUser[\s\S]*ownerId/);
  assert.match(lessons[2].studyDays[3].example, /NEXT_PUBLIC_SITE_LABEL[\s\S]*PRIVATE_API_KEY/);
  assert.match(lessons[2].studyDays[4].example, /readPrivateDashboard/);
});

test('Next.js weeks nineteen through twenty-one teach caching, security, and asset boundaries', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 19 && lesson.week <= 21);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts an unrelated answer`);
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} example TSX diagnostic codes: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /cacheComponents: true[\s\S]*use cache[\s\S]*cookies\(\)[\s\S]*<Suspense/);
  assert.match(lessons[0].studyDays[1].example, /cacheLife\("hours"\)[\s\S]*revalidate: 300/);
  assert.match(lessons[0].studyDays[2].example, /cacheTag\("courses"\)[\s\S]*updateTag\("courses"\)/);
  assert.match(lessons[0].studyDays[3].example, /<Suspense[\s\S]*await cookies\(\)[\s\S]*readCoursesForUser/);
  assert.match(lessons[0].studyDays[4].example, /dataOwner[\s\S]*learner/);
  assert.match(lessons[1].studyDays[0].example, /return <p>\{text\}<\/p>[\s\S]*dangerouslySetInnerHTML/);
  assert.match(lessons[1].studyDays[1].example, /new URL[\s\S]*url\.username[\s\S]*url\.origin/);
  assert.match(lessons[1].studyDays[2].example, /requireUser[\s\S]*typeof rawCourseId[\s\S]*isValidCourseTitle[\s\S]*ownerId/);
  assert.match(lessons[1].studyDays[3].example, /nonce[\s\S]*정적 export/);
  assert.match(lessons[1].studyDays[4].example, /Authorization header[\s\S]*safeLogField/);
  assert.match(lessons[1].studyDays[4].example, /source: safeLogField\(source\)/);
  assert.ok(lessons[1].studyDays[4].example.includes(String.raw`/[\r\n]/`));
  assert.match(lessons[2].studyDays[0].example, /alt="초급부터 실전까지의 학습 경로"[\s\S]*width=\{960\}/);
  assert.match(lessons[2].studyDays[0].example, /alt=""/);
  assert.match(lessons[2].studyDays[1].example, /remotePatterns[\s\S]*pathname/);
  assert.match(lessons[2].studyDays[2].example, /localFont[\s\S]*learning-sans\.woff2/);
  assert.match(lessons[2].studyDays[3].example, /fill[\s\S]*sizes=/);
  assert.match(lessons[2].studyDays[3].example, /position: "relative"[\s\S]*aspectRatio/);
  assert.match(lessons[2].studyDays[4].example, /publicFiles[\s\S]*backups\/user-progress[\s\S]*개인/);
  assert.match(lessons[0].studyDays[0].objective, /Cache Components[\s\S]*request-time/);
  assert.match(lessons[0].studyDays[2].objective, /tag[\s\S]*재검증 API/);
  assert.match(lessons[1].studyDays[2].objective, /CSRF[\s\S]*인가/);
  assert.match(lessons[2].studyDays[4].objective, /public[\s\S]*개인 학습 백업/);
});

test('Next.js weeks twenty-two through twenty-four teach accessibility, test evidence, and measured performance', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 22 && lesson.week <= 24);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts an unrelated answer`);
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} example TSX diagnostic codes: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /<main[\s\S]*<h1>[\s\S]*aria-labelledby/);
  assert.match(lessons[0].studyDays[1].example, /htmlFor[\s\S]*aria-invalid/);
  assert.match(lessons[0].studyDays[1].example, /aria-describedby/);
  assert.match(lessons[0].studyDays[2].example, /role="status"[\s\S]*aria-atomic/);
  assert.match(lessons[0].studyDays[3].example, /showError[\s\S]*\.focus\(\)/);
  assert.match(lessons[0].studyDays[4].example, /prefers-reduced-motion[\s\S]*animation: none/);
  assert.match(lessons[1].studyDays[0].example, /node:test[\s\S]*assert.equal/);
  assert.ok(lessons[1].studyDays[1].example.includes('getByRole'));
  assert.ok(lessons[1].studyDays[1].example.includes('user.click'));
  assert.match(lessons[1].studyDays[2].example, /fetch\(new URL[\s\S]*response.status[\s\S]*response.json/);
  assert.match(lessons[1].studyDays[3].example, /page.goto[\s\S]*toBeVisible/);
  assert.match(lessons[1].studyDays[4].example, /state: "empty"[\s\S]*state: "loading"[\s\S]*state: "error"[\s\S]*state: "success"/);
  assert.match(lessons[2].studyDays[0].example, /CourseList[\s\S]*ProgressToggle/);
  assert.match(lessons[2].studyDays[1].example, /next\/dynamic[\s\S]*ssr: false/);
  assert.match(lessons[2].studyDays[2].example, /loading="lazy"/);
  assert.match(lessons[2].studyDays[3].example, /useReportWebVitals[\s\S]*development/);
  assert.match(lessons[2].studyDays[4].example, /production-like next build[\s\S]*fieldData[\s\S]*baseline/);
  assert.ok(lessons[0].studyDays[1].objective.includes('aria-describedby'));
  assert.ok(lessons[1].studyDays[2].objective.includes('HTTP'));
  assert.ok(lessons[2].studyDays[4].objective.includes('baseline'));
});

test('Next.js weeks twenty-five through twenty-seven teach React boundaries, version migration, and defect diagnosis', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 25 && lesson.week <= 27);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts an unrelated answer`);
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} example TSX diagnostic codes: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /CoursesPage[\s\S]*ProgressToggle/);
  assert.match(lessons[0].studyDays[1].example, /^"use client";[\s\S]*createContext[\s\S]*useContext[\s\S]*toggleTheme[\s\S]*setTheme/);
  assert.match(lessons[0].studyDays[2].example, /useEffect[\s\S]*subscribeToProgress[\s\S]*unsubscribe/);
  assert.match(lessons[0].studyDays[3].example, /actions\.ts[\s\S]*"use server"[\s\S]*action=\{saveProgress\}[\s\S]*onClick[\s\S]*인증·인가/);
  assert.match(lessons[0].studyDays[4].example, /nextVersion[\s\S]*reactVersion[\s\S]*checkPeerRange/);
  assert.match(lessons[1].studyDays[0].example, /16\.4\.3[\s\S]*packageLock:[\s\S]*lockfileVersion: 3[\s\S]*packages:[\s\S]*node_modules\/next[\s\S]*version: "16\.4\.1"[\s\S]*reviewedAt/);
  assert.match(lessons[1].studyDays[1].example, /release =/);
  assert.match(lessons[1].studyDays[2].example, /PageProps[\s\S]*await params[\s\S]*proxy\.ts/);
  assert.match(lessons[1].studyDays[3].example, /remotePatterns[\s\S]*protocol[\s\S]*pathname/);
  assert.match(lessons[1].studyDays[4].example, /version: "16\.4\.1"[\s\S]*resolved:[\s\S]*next-16\.4\.1\.tgz[\s\S]*integrity/);
  assert.match(lessons[2].studyDays[0].example, /next typegen[\s\S]*PageProps[\s\S]*await params/);
  assert.match(lessons[2].studyDays[1].example, /app\/layout\.tsx[\s\S]*<html[\s\S]*<body/);
  assert.match(lessons[2].studyDays[2].example, /status === 404[\s\S]*notFound\(\)[\s\S]*!response\.ok/);
  assert.match(lessons[2].studyDays[3].example, /requireAuthenticatedUser[\s\S]*findProgressForUser[\s\S]*A 로그인[\s\S]*B 로그인/);
  assert.match(lessons[2].studyDays[4].example, /nextVersion[\s\S]*expected[\s\S]*자료 없음 화면[\s\S]*actual[\s\S]*삭제함/);
});

test('Next.js weeks twenty-eight through thirty teach route tests, recovery, and safe data boundaries', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 28 && lesson.week <= 30);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts unrelated input`);
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} TSX diagnostics: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /baseURL[\s\S]*깊은 경로 직접 진입[\s\S]*page\.goto[\s\S]*goBack/);
  assert.match(lessons[0].studyDays[1].example, /강의를 찾을 수 없어요[\s\S]*모든 강의[\s\S]*streaming/);
  assert.match(lessons[0].studyDays[2].example, /import type \{ Page \}[\s\S]*responseGate[\s\S]*불러오는 중/);
  assert.match(lessons[0].studyDays[3].example, /강의 이름[\s\S]*aria-describedby[\s\S]*저장됐어요/);
  assert.match(lessons[0].studyDays[4].example, /node:assert\/strict[\s\S]*buildCoursePage[\s\S]*실제 SQL/);
  assert.match(lessons[1].studyDays[0].example, /Instrumentation\.onRequestError[\s\S]*digest[\s\S]*routeType/);
  assert.match(lessons[1].studyDays[1].example, /attempt < 3[\s\S]*retryableStatuses/);
  assert.match(lessons[1].studyDays[2].example, /result\?\.query === query[\s\S]*AbortController[\s\S]*signal[\s\S]*controller\.abort/);
  assert.match(lessons[1].studyDays[3].example, /retry[\s\S]*digest/);
  assert.doesNotMatch(lessons[1].studyDays[3].example, /unstable_retry/);
  assert.match(lessons[2].studyDays[0].example, /server-only[\s\S]*verifySession[\s\S]*findOwnedBy/);
  assert.match(lessons[2].studyDays[1].example, /BEGIN[\s\S]*INSERT INTO[\s\S]*ROLLBACK/);
  assert.match(lessons[2].studyDays[2].example, /ADD COLUMN[\s\S]*기존 행을 채운[\s\S]*SET NOT NULL/);
  assert.match(lessons[2].studyDays[3].example, /요청 본문이 아니라 서버에서 확인한 로그인 정보[\s\S]*owner_id = \$3/);
  assert.match(lessons[2].studyDays[4].example, /JSON\.stringify[\s\S]*validateProgressBackup[\s\S]*localStorage[\s\S]*catch[\s\S]*사용자가 직접/);
});

test('Next.js weeks thirty-one through thirty-three teach static release and the integrated capstone', () => {
  const lessons = track.lessons.filter((lesson) => lesson.week >= 31 && lesson.week <= 33);
  const exercises = lessons.flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises));
  assert.equal(lessons.length, 3);
  assert.equal(exercises.length, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.prompt)).size, 45);
  assert.equal(new Set(exercises.map((exercise) => exercise.title)).size, 45);

  const answerPositions = { a: 0, b: 0, c: 0 };
  let parsedExamples = 0;
  for (const lesson of lessons) {
    for (const day of lesson.studyDays) {
      assert.ok(day.objective.length >= 35, `${lesson.week}/${day.number} objective`);
      assert.ok(day.example.length >= 100, `${lesson.week}/${day.number} example lacks context`);
      for (const exercise of day.exercises) {
        assertQuestionVersion(exercise);
        assert.doesNotMatch(exercise.prompt, /오늘 코드에서 다루는 핵심|요구사항에 맞는 올바른 판단/);
        if (exercise.type === 'choice') {
          answerPositions[exercise.answer] += 1;
          for (const option of exercise.choices.filter(({ id }) => id !== exercise.answer)) {
            assert.equal(gradeAnswer(exercise, option.id), false, `${exercise.id} accepts a distractor`);
          }
        } else {
          assert.equal(gradeAnswer(exercise, '완전히 무관한 답변'), false, `${exercise.id} accepts unrelated input`);
        }
        assert.equal(gradeAnswer(exercise, exercise.type === 'choice' ? exercise.answer : exercise.acceptedAnswers[0]), true);
      }

      parsedExamples += 1;
      const { diagnostics = [] } = ts.transpileModule(day.example, {
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
        fileName: `next-w${lesson.week}-d${day.number}.tsx`,
        reportDiagnostics: true,
      });
      const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
      assert.equal(errors.length, 0, `W${lesson.week} D${day.number} TSX diagnostics: ${errors.map(({ code }) => code).join(', ')}`);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  assert.equal(parsedExamples, 15);
  assert.match(lessons[0].studyDays[0].example, /output: "export"[\s\S]*out/);
  assert.match(lessons[0].studyDays[1].example, /dynamic = "force-static"[\s\S]*async function GET[\s\S]*catalog[\s\S]*요청 때 값을 읽지 않는/);
  const staticHandlerChoice = lessons[0].studyDays[1].exercises.find((item) => item.type === 'choice');
  assert.match(staticHandlerChoice.prompt, /force-static/);
  assert.match(staticHandlerChoice.explanation, /force-static/);
  assert.match(lessons[0].studyDays[2].example, /generateStaticParams[\s\S]*react-state[\s\S]*java-methods/);
  assert.match(lessons[0].studyDays[3].example, /POST\(request: Request\)[\s\S]*received: true[\s\S]*실제 저장은 서버 저장소/);
  assert.doesNotMatch(lessons[0].studyDays[3].example, /saved: true/);
  assert.match(lessons[0].studyDays[4].example, /useEffect[\s\S]*localStorage[\s\S]*같은 초기값/);
  assert.match(lessons[1].studyDays[1].example, /next\.config\.ts[\s\S]*basePath: "\/study"[\s\S]*export default nextConfig[\s\S]*TrackNavigation\.tsx[\s\S]*<Link[\s\S]*<Image/);
  assert.match(lessons[1].studyDays[2].example, /NEXT_PUBLIC_SITE_NAME[\s\S]*server-only[\s\S]*PAYMENT_SECRET/);
  assert.match(lessons[1].studyDays[3].example, /브라우저 JavaScript에 값으로 들어가요[\s\S]*NEXT_PUBLIC_DEPLOY_TARGET[\s\S]*같은 파일/);
  assert.match(lessons[1].studyDays[4].example, /pending[\s\S]*공식 요금·약관[\s\S]*hostPreview/);
  assert.match(lessons[2].studyDays[0].example, /routeCases[\s\S]*찾을 수 없음[\s\S]*interactionCases/);
  assert.match(lessons[2].studyDays[1].example, /현재 브라우저 프로필[\s\S]*JSON 파일을 직접[\s\S]*지원하지 않음/);
  assert.match(lessons[2].studyDays[2].example, /ProgressToggle[\s\S]*useState[\s\S]*aria-pressed/);
  assert.match(lessons[2].studyDays[3].example, /verificationPlan[\s\S]*각 경로 직접 진입[\s\S]*실행하지 않은 계획/);
  assert.match(lessons[2].studyDays[4].example, /verified[\s\S]*conceptOnly[\s\S]*unsupportedHere[\s\S]*unrunChecks/);
});
