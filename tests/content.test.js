import test from 'node:test';
import assert from 'node:assert/strict';
import { exerciseTypes, lessons, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

test('starter catalog contains all requested language and framework tracks', () => {
  assert.deepEqual(tracks.map((track) => track.title), ['JavaScript', 'Python', 'Java', 'Spring Boot', 'React']);
});

test('every lesson has a unique id, a learning objective, and a supported exercise', () => {
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  assert.equal(new Set(lessons.map((lesson) => lesson.exercise.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.objective.length > 10, lesson.id);
    assert.ok(['기초', '입문'].includes(lesson.difficulty), lesson.id);
    assert.match(lesson.duration, /^\d+분$/);
    assert.ok(exerciseTypes.has(lesson.exercise.type), lesson.id);
    assert.ok(lesson.exercise.explanation.length > 20, lesson.id);
  }
});

test('starter catalog includes several ways to practice', () => {
  const types = new Set(lessons.map((lesson) => lesson.exercise.type));
  for (const type of ['choice', 'short-answer', 'locate-error', 'repair-code', 'coding']) {
    assert.ok(types.has(type), `missing exercise type ${type}`);
  }
});

test('choice exercises explain every option and vary the correct option position', () => {
  const choiceExercises = lessons.map((lesson) => lesson.exercise).filter((exercise) => exercise.type === 'choice');
  const answerPositions = new Set();
  for (const exercise of choiceExercises) {
    assert.deepEqual(Object.keys(exercise.choiceExplanations).sort(), exercise.choices.map((choice) => choice.id).sort());
    answerPositions.add(exercise.choices.findIndex((choice) => choice.id === exercise.answer));
  }
  assert.ok(answerPositions.size > 1);
});

test('JavaScript coding lessons define bounded test cases and an explicit entry point', () => {
  const codingExercises = lessons.map((lesson) => lesson.exercise).filter((exercise) => exercise.type === 'coding');
  assert.ok(codingExercises.length > 0);
  for (const exercise of codingExercises) {
    assert.match(exercise.entryPoint, /^[A-Za-z_$][\w$]*$/);
    assert.ok(exercise.tests.length > 0);
    for (const testCase of exercise.tests) {
      assert.ok(Array.isArray(testCase.input));
      assert.ok(Object.hasOwn(testCase, 'expected'));
    }
  }
});

test('every track has a reviewed source record and valid topic-to-lesson links', () => {
  const topicIds = new Set();
  const linkedLessonIds = new Set();

  for (const track of tracks) {
    assert.ok(track.objective.length > 10, track.id);
    assert.ok(track.prerequisites.length > 0, track.id);
    assert.ok(track.prerequisites.every((item) => item.length > 4), track.id);
    assert.equal(track.contentReview.status, '검수 완료', track.id);
    assert.match(track.contentReview.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(track.contentReview.versionContext.length > 5, track.id);
    assert.ok(track.contentReview.sources.length > 0, track.id);
    for (const source of track.contentReview.sources) {
      assert.ok(source.label.length > 3, track.id);
      assert.equal(new URL(source.url).protocol, 'https:');
    }

    assert.ok(track.topics.length > 0, track.id);
    for (const topic of track.topics) {
      assert.ok(!topicIds.has(topic.id), `duplicate topic ${topic.id}`);
      topicIds.add(topic.id);
      assert.ok(topic.objective.length > 10, topic.id);
      assert.ok(topic.lessonIds.length > 0, topic.id);
      for (const lessonId of topic.lessonIds) {
        const lesson = track.lessons.find((item) => item.id === lessonId);
        assert.ok(lesson, `missing lesson ${lessonId}`);
        assert.equal(lesson.topicId, topic.id, lessonId);
        assert.ok(!linkedLessonIds.has(lessonId), `lesson linked more than once: ${lessonId}`);
        linkedLessonIds.add(lessonId);
      }
    }
  }

  assert.deepEqual([...linkedLessonIds].sort(), lessons.map((lesson) => lesson.id).sort());
});

test('each track advances through three numbered stages and ordered lesson prerequisites', () => {
  for (const track of tracks) {
    assert.deepEqual(track.topics.map((topic) => topic.stage), [1, 2, 3], track.id);
    track.lessons.forEach((lesson, index) => {
      assert.equal(lesson.number, index + 1, lesson.id);
      assert.deepEqual(lesson.prerequisiteLessonIds, index ? [track.lessons[index - 1].id] : [], lesson.id);
      assert.equal(lesson.referenceVersion, track.contentReview.version, lesson.id);
      assert.equal(lesson.reviewedAt, track.contentReview.reviewedAt, lesson.id);
    });
  }
});

test('every question has a usable prompt, hint, explanation, and a verifiable answer shape', () => {
  for (const lesson of lessons) {
    const exercise = lesson.exercise;
    assert.ok(exercise.prompt.length > 20, exercise.id);
    assert.ok(exercise.hint.length > 10, exercise.id);
    assert.ok(exercise.explanation.length > 20, exercise.id);

    if (exercise.type === 'choice') {
      const choiceIds = exercise.choices.map((choice) => choice.id);
      assert.ok(choiceIds.length >= 2, exercise.id);
      assert.equal(new Set(choiceIds).size, choiceIds.length, exercise.id);
      assert.ok(choiceIds.includes(exercise.answer), exercise.id);
      assert.ok(choiceIds.every((id) => exercise.choiceExplanations[id]?.length > 10), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.answer), true, exercise.id);
      const wrongChoice = choiceIds.find((id) => id !== exercise.answer);
      assert.equal(gradeAnswer(exercise, wrongChoice), false, exercise.id);
    }

    if (exercise.type === 'short-answer') {
      assert.ok(exercise.acceptedAnswers.length > 0, exercise.id);
      assert.ok(exercise.acceptedAnswers.every((answer) => answer.trim().length > 0), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.acceptedAnswers[0]), true, exercise.id);
    }

    if (exercise.type === 'locate-error') {
      assert.ok(exercise.codeLines.length > 0, exercise.id);
      assert.ok(exercise.answerLines.length > 0, exercise.id);
      assert.equal(new Set(exercise.answerLines).size, exercise.answerLines.length, exercise.id);
      assert.ok(exercise.answerLines.every((line) => Number.isInteger(line) && line > 0 && line <= exercise.codeLines.length), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.answerLines), true, exercise.id);
    }

    if (exercise.type === 'repair-code') {
      assert.ok(exercise.starterCode.length > 0, exercise.id);
      assert.ok(exercise.requiredFragments.length > 0, exercise.id);
      assert.ok(exercise.requiredFragments.every((part) => part.length > 0), exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.starterCode), false, exercise.id);
      assert.equal(gradeAnswer(exercise, exercise.requiredFragments.join('\n')), true, exercise.id);
    }
  }
});

test('array and list boundary-error exercises include their data and identify the faulty condition line', () => {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const checks = [
    ['js-loops', /const numbers = \[2, 3, 4\]/, 'numbers.length', '<='],
    ['py-loops', /values = \[2, 3, 4\]/, 'values[1:]', 'values[1:]'],
    ['java-loops', /int\[\] values = \{2, 3, 4\}/, 'values.length', '<='],
  ];
  for (const [lessonId, initializedData, faultyCondition, faultyOperator] of checks) {
    const exercise = byId.get(lessonId).exercise;
    assert.match(byId.get(lessonId).example, initializedData, lessonId);
    const faultyLine = exercise.codeLines[exercise.answerLines[0] - 1];
    assert.ok(faultyLine.includes(faultyCondition), lessonId);
    assert.ok(faultyLine.includes(faultyOperator), lessonId);
    assert.ok(exercise.explanation.includes(`${exercise.answerLines[0]}번 줄`), lessonId);
  }
});

test('React state repair requires both preserving old fields and replacing the requested field', () => {
  const exercise = lessons.find((lesson) => lesson.id === 'react-state').exercise;
  assert.equal(gradeAnswer(exercise, 'setProfile({ ...profile, name: nextName });'), true);
  assert.equal(gradeAnswer(exercise, 'setProfile({ ...profile });'), false);
  assert.equal(gradeAnswer(exercise, 'profile.name = nextName; setProfile(profile);'), false);
});

test('version records match each track and link to official primary documentation', () => {
  const officialHosts = {
    javascript: ['262.ecma-international.org', 'ecma-international.org'],
    python: ['docs.python.org', 'www.python.org'],
    java: ['docs.oracle.com', 'www.oracle.com'],
    spring: ['docs.spring.io'],
    react: ['react.dev'],
  };
  const expectedVersions = {
    javascript: 'ECMAScript 2026',
    python: 'Python 3.14.8',
    java: 'Java SE 25 LTS',
    spring: 'Spring Boot 4.1.1',
    react: 'React 19.3',
  };
  for (const track of tracks) {
    assert.equal(track.contentReview.version, expectedVersions[track.id], track.id);
    assert.ok(track.contentReview.sources.length > 0, track.id);
    for (const source of track.contentReview.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:', source.url);
      assert.ok(officialHosts[track.id].includes(url.hostname), source.url);
    }
  }
});
