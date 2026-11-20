import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { gradeAnswer } from '../src/grading.js';
import { tracks } from '../src/content.js';

const exerciseById = (id) => tracks
  .flatMap((track) => track.lessons)
  .flatMap((lesson) => lesson.exercises)
  .find((exercise) => exercise?.id === id);

test('choice and short answers are graded without accepting an empty answer', () => {
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, 'b'), true);
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, ''), false);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, '  SUM(scores) / len(scores) '), true);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, ''), false);
  const pythonExpression = { type: 'short-answer', answerNormalization: 'python-expression', acceptedAnswers: ['sum(scores) / len(scores)'] };
  assert.equal(gradeAnswer(pythonExpression, 'sum( scores )/len( scores )'), true);
  assert.equal(gradeAnswer(pythonExpression, 'SUM(scores) / len(scores)'), false);
});

test('literal output answers preserve case and meaningful internal spacing', () => {
  const exactOutput = {
    type: 'short-answer',
    answerNormalization: 'exact-output',
    acceptedAnswers: ['Kotlin → JVM'],
  };

  assert.equal(gradeAnswer(exactOutput, 'Kotlin → JVM'), true);
  assert.equal(gradeAnswer(exactOutput, '  Kotlin → JVM  '), true);
  assert.equal(gradeAnswer(exactOutput, 'kotlin → jvm'), false);
  assert.equal(gradeAnswer(exactOutput, 'Kotlin  → JVM'), false);
  assert.equal(gradeAnswer({ ...exactOutput, acceptedAnswers: ['시작\n완료'] }, '시작\r\n완료'), true);
});

test('case-sensitive grading preserves code-output casing while allowing spacing differences', () => {
  const output = {
    type: 'short-answer',
    answerNormalization: 'case-sensitive',
    acceptedAnswers: ['2 / True'],
  };

  assert.equal(gradeAnswer(output, '2 / True'), true);
  assert.equal(gradeAnswer(output, '  2   /   True  '), true);
  assert.equal(gradeAnswer(output, '2 / true'), false);
  assert.equal(gradeAnswer(output, '2 / TRUE'), false);
});

test('error-location and code-repair grading check exact expected changes', () => {
  const locate = { type: 'locate-error', answerLines: [2] };
  assert.equal(gradeAnswer(locate, [2]), true);
  assert.equal(gradeAnswer(locate, [1, 2]), false);
  assert.equal(gradeAnswer({ type: 'repair-code', requiredFragments: ['return true;'] }, 'return true;'), false);
  const repair = {
    type: 'repair-code',
    solutionPatterns: [String.raw`^setProfile\(\{[ \t]*\.\.\.profile,[ \t]*name:[ \t]*nextName[ \t]*\}[ \t]*\);?$`],
  };
  assert.equal(gradeAnswer(repair, ''), false);
  assert.equal(gradeAnswer(repair, 'setProfile({ ...profile, name: nextName });'), true);
  assert.equal(gradeAnswer(repair, 'setProfile({...profile,name:nextName});'), true);
  assert.equal(gradeAnswer(repair, 'profile.name = nextName; setProfile(profile);'), false);
});

test('repair grading ignores formatting and accepts the documented Java operand order', () => {
  const javaRepair = exerciseById('java-method-repair');
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) { return right+left; }'), true);
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) {\n  return left\n    + right;\n}'), true);
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) { return left-right; }'), false);

  const functionRepair = exerciseById('js-function-repair');
  assert.equal(gradeAnswer(functionRepair, 'function double(value) { return value*2; }'), true);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n return value\n  * 2;\n}'), true);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n return\n  value * 2;\n}'), false);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) { value*2; }'), false);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n  // This comment does not change the return path.\n  return value * 2;\n}'), true);
});

test('JavaScript repair exercises accept equivalent solutions that meet their full contract', () => {
  const cases = [
    ['js-w4-d5-repair', 'courseLabel', [
      'function courseLabel(title, level) { return title + " (" + level + ")"; }',
      "function courseLabel(title, level) { return title + ' (' + level + ')'; }",
    ], [{ args: ['JS', '기초'], expected: 'JS (기초)' }, { args: ['React', '중급'], expected: 'React (중급)' }]],
    ['js-w5-d4-repair', 'sortedCopy', [
      'function sortedCopy(names) { return names.slice().sort(); }',
      'function sortedCopy(names) { return names.toSorted(); }',
      'function sortedCopy(names) { return Array.from(names).sort(); }',
      'function sortedCopy(names) { const copy = names.slice(); copy.sort(); return copy; }',
      'function sortedCopy(names) { const copy = [...names]; copy.sort(); return copy; }',
    ], [{ args: [['b', 'a']], expected: ['a', 'b'], preserves: 0 }, { args: [['c', 'a']], expected: ['a', 'c'], preserves: 0 }]],
    ['js-w5-d5-repair', 'lastVisible', [
      'function lastVisible(items) { if (items.length === 0) return null; return items[items.length - 1]; }',
      'function lastVisible(items) { if (items.length === 0) return null; return items.at(-1); }',
      'function lastVisible(items) { if (!items.length) return null; return items.at(-1); }',
      'function lastVisible(items) { return items.length === 0 ? null : items.at(-1); }',
    ], [{ args: [['JS', 'React']], expected: 'React' }, { args: [[]], expected: null }]],
    ['js-w6-d4-repair', 'courseSummary', [
      'function courseSummary(course) { return course.title + ": " + course.minutes + "분"; }',
      "function courseSummary(course) { return course.title + ': ' + course.minutes + '분'; }",
    ], [{ args: [{ title: 'Python', minutes: 30 }], expected: 'Python: 30분' }, { args: [{ title: 'React', minutes: 15 }], expected: 'React: 15분' }]],
    ['js-w6-d5-repair', 'updateLevel', [
      'function updateLevel(profile, level) { return { ...profile, level: level }; }',
      'function updateLevel(profile, level) { return Object.assign({}, profile, { level }); }',
      'function updateLevel(profile, level) { return Object.assign({}, profile, { level: level }); }',
      'function updateLevel(profile, level) { const updated = { ...profile }; updated.level = level; return updated; }',
      'function updateLevel(profile, level) { const updated = Object.assign({}, profile); updated.level = level; return updated; }',
    ], [{ args: [{ name: '민', level: 1 }, 2], expected: { name: '민', level: 2 }, preserves: 0 }, { args: [{ name: '수', theme: 'dark' }, 3], expected: { name: '수', theme: 'dark', level: 3 }, preserves: 0 }]],
  ];

  const normalize = (value) => Array.isArray(value)
    ? [...value].map(normalize)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalize(entry)]))
      : value;

  for (const [id, name, implementations, checks] of cases) {
    for (const code of implementations) {
      assert.equal(gradeAnswer(exerciseById(id), code), true, `${id} should accept an equivalent solution`);
      const implementation = vm.runInNewContext(`(${code})`);
      for (const { args, expected, preserves } of checks) {
        const original = preserves === undefined ? undefined : structuredClone(args[preserves]);
        assert.deepEqual(normalize(implementation(...args)), expected, `${name} meets its example contract`);
        if (preserves !== undefined) assert.deepEqual(args[preserves], original, `${name} leaves its input unchanged`);
      }
    }
  }

  assert.equal(gradeAnswer(exerciseById('js-w4-d5-repair'), 'function courseLabel(title, level) { return title + level; }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w5-d4-repair'), 'function sortedCopy(names) { return names.sort(); }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w5-d5-repair'), 'function lastVisible(items) { return items.at(-1); }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w6-d4-repair'), 'function courseSummary(course) { return course.title + course.minutes; }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w6-d5-repair'), 'function updateLevel(profile, level) { profile.level = level; return profile; }'), false);
});

test('JavaScript W10–W12 repairs accept equivalent async, scheduling, and collection implementations', async () => {
  const compile = (code, globals = {}) => vm.runInNewContext(`(${code})`, globals);

  const readJsonImplementations = [
    'function readJson(response) { return response.json(); }',
    'async function readJson(response) { return await response.json(); }',
  ];
  for (const code of readJsonImplementations) {
    assert.equal(gradeAnswer(exerciseById('js-w10-d4-repair-v2'), code), true);
    assert.deepEqual(await compile(code)({ json: async () => ({ count: 2 }) }), { count: 2 });
  }

  const signalImplementations = [
    'function requestWithSignal(url, controller) { return fetch(url, { signal: controller.signal }); }',
    'function requestWithSignal(url, controller) { const options = { signal: controller.signal }; return fetch(url, options); }',
  ];
  for (const code of signalImplementations) {
    let received;
    const fetch = (url, options) => { received = { url, options }; return 'sent'; };
    const requestWithSignal = compile(code, { fetch });
    const controller = { signal: { request: 1 } };
    assert.equal(gradeAnswer(exerciseById('js-w10-d5-repair-v2'), code), true);
    assert.equal(requestWithSignal('/courses', controller), 'sent');
    assert.equal(received.url, '/courses');
    assert.equal(received.options.signal, controller.signal);
  }

  const renderImplementations = [
    'function scheduleRender(update, requestFrame) { return requestFrame(() => update("ready")); }',
    'function scheduleRender(update, requestFrame) { const callback = () => update("ready"); return requestFrame(callback); }',
    'function scheduleRender(update, requestFrame) { return requestFrame(function () { update("ready"); }); }',
  ];
  for (const code of renderImplementations) {
    let callback;
    const updates = [];
    const scheduleRender = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w11-d4-repair-v2'), code), true);
    assert.equal(scheduleRender((value) => updates.push(value), (next) => { callback = next; return 'queued'; }), 'queued');
    assert.deepEqual(updates, [], 'the scheduled callback does not run immediately');
    assert.equal(typeof callback, 'function');
    callback();
    assert.deepEqual(updates, ['ready']);
  }

  const chunkImplementations = [
    'function scheduleChunk(work, scheduleTask) { return scheduleTask(work); }',
    'function scheduleChunk(work, scheduleTask) { return scheduleTask(() => work()); }',
  ];
  for (const code of chunkImplementations) {
    let callback;
    let runs = 0;
    const scheduleChunk = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w11-d5-repair-v2'), code), true);
    assert.equal(scheduleChunk(() => { runs += 1; }, (next) => { callback = next; return 'queued'; }), 'queued');
    assert.equal(runs, 0, 'the chunk is deferred to the scheduler');
    callback();
    assert.equal(runs, 1);
  }

  const averageImplementations = [
    'function average(scores) { if (scores.length === 0) return 0; return scores.reduce((sum, score) => sum + score, 0) / scores.length; }',
    'function average(scores) { if (!scores.length) return 0; return scores.reduce((sum, score) => sum + score, 0) / scores.length; }',
    'function average(scores) { if (scores.length === 0) { return 0; } const total = scores.reduce((sum, score) => sum + score, 0); return total / scores.length; }',
    'function average(scores) { if (scores.length === 0) return 0; let total = 0; for (const score of scores) total += score; return total / scores.length; }',
  ];
  for (const code of averageImplementations) {
    const average = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w12-d4-average-repair'), code), true);
    for (const input of [[], [2, 4, 6], [10]]) {
      const original = [...input];
      assert.equal(average(input), original.length ? original.reduce((sum, value) => sum + value, 0) / original.length : 0);
      assert.deepEqual(input, original, 'average preserves its input');
    }
  }

  const completionImplementations = [
    'function addCompletion(completed, lessonId) { if (completed.includes(lessonId)) return completed; return [...completed, lessonId]; }',
    'function addCompletion(completed, lessonId) { if (completed.indexOf(lessonId) !== -1) return completed; return completed.concat(lessonId); }',
    'function addCompletion(completed, lessonId) { if (completed.includes(lessonId)) { return completed; } const next = completed.slice(); next.push(lessonId); return next; }',
    'function addCompletion(completed, lessonId) { const isNew = !completed.includes(lessonId); return isNew ? [...completed, lessonId] : completed; }',
  ];
  for (const code of completionImplementations) {
    const addCompletion = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w12-d5-completion-repair'), code), true);
    const completed = ['js'];
    const next = addCompletion(completed, 'react');
    assert.deepEqual(completed, ['js'], 'a new completion does not mutate the original array');
    assert.notEqual(next, completed);
    assert.deepEqual([...next], ['js', 'react']);
    assert.equal(addCompletion(next, 'react'), next, 'a duplicate returns the existing array reference');
  }

  assert.equal(gradeAnswer(exerciseById('js-w12-d4-average-repair'), 'function average(scores) { return scores.reduce((sum, score) => sum + score) / scores.length; }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w12-d5-completion-repair'), 'function addCompletion(completed, lessonId) { completed.push(lessonId); return completed; }'), false);
});

test('JavaScript W13–W15 repairs accept equivalent string, Date, Map, and Set implementations', () => {
  const compile = (code) => vm.runInNewContext(`(${code})`);

  const normalizeQueryImplementations = [
    'function normalizeQuery(query) { return query.trim().toLowerCase(); }',
    'function normalizeQuery(query) { const normalized = query.trim().toLowerCase(); return normalized; }',
    'function normalizeQuery(query) { return query.trim().toLocaleLowerCase("en-US"); }',
  ];
  for (const code of normalizeQueryImplementations) {
    const normalizeQuery = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w13-d4-repair-v2'), code), true);
    for (const input of ['  React  ', '  JS  ']) {
      assert.equal(normalizeQuery(input), input.trim().toLowerCase());
    }
  }

  const normalizeTagImplementations = [
    'function normalizeTag(tag) { return tag.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase(); }',
    'function normalizeTag(tag) { const compact = tag.trim().replace(/\\s+/gu, " "); return compact.normalize("NFC").toLowerCase(); }',
  ];
  for (const code of normalizeTagImplementations) {
    const normalizeTag = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w13-d5-repair-v2'), code), true);
    const input = '  Cafe\u0301\t JS  ';
    assert.equal(normalizeTag(input), 'café js');
    assert.equal(input, '  Cafe\u0301\t JS  ', 'normalization preserves the source string');
  }

  const validDateImplementations = [
    'function isValidDate(date) { return date instanceof Date && !Number.isNaN(date.getTime()); }',
    'function isValidDate(date) { return date instanceof Date && Number.isFinite(date.getTime()); }',
  ];
  for (const code of validDateImplementations) {
    const context = vm.runInNewContext(`({ isValidDate: (${code}), valid: new Date(0), invalid: new Date("bad"), other: { getTime: () => 0 } })`);
    assert.equal(gradeAnswer(exerciseById('js-w14-d4-repair-v2'), code), true);
    assert.equal(context.isValidDate(context.valid), true);
    assert.equal(context.isValidDate(context.invalid), false);
    assert.equal(context.isValidDate(context.other), false);
  }

  const elapsedHourImplementations = [
    'function hoursBetween(start, end) { return (end.getTime() - start.getTime()) / 3600000; }',
    'function hoursBetween(start, end) { return (end.getTime() - start.getTime()) / (60 * 60 * 1000); }',
    'function hoursBetween(start, end) { const elapsedMs = end.getTime() - start.getTime(); return elapsedMs / 3600000; }',
  ];
  for (const code of elapsedHourImplementations) {
    const context = vm.runInNewContext(`({ hoursBetween: (${code}), start: new Date(0), end: new Date(7200000), earlier: new Date(-3600000) })`);
    assert.equal(gradeAnswer(exerciseById('js-w14-d5-repair-v2'), code), true);
    assert.equal(context.hoursBetween(context.start, context.end), 2);
    assert.equal(context.hoursBetween(context.end, context.start), -2);
    assert.equal(context.hoursBetween(context.start, context.start), 0);
    assert.equal(context.hoursBetween(context.earlier, context.start), 1);
  }

  const orderedEntriesImplementations = [
    'function orderedEntries(map) { return [...map.entries()]; }',
    'function orderedEntries(map) { return [...map]; }',
    'function orderedEntries(map) { return Array.from(map.entries()); }',
    'function orderedEntries(map) { return Array.from(map); }',
  ];
  for (const code of orderedEntriesImplementations) {
    const orderedEntries = compile(code);
    const map = new Map([['js', 2], ['py', 1]]);
    assert.equal(gradeAnswer(exerciseById('js-w15-d4-repair-v2'), code), true);
    assert.deepEqual(Array.from(orderedEntries(map), ([key, value]) => [key, value]), [['js', 2], ['py', 1]]);
    assert.deepEqual(Array.from(orderedEntries(new Map())), []);
    assert.deepEqual([...map], [['js', 2], ['py', 1]], 'Map order and contents remain unchanged');
  }

  const uniqueIdsImplementations = [
    'function uniqueIds(ids) { return [...new Set(ids)]; }',
    'function uniqueIds(ids) { return Array.from(new Set(ids)); }',
  ];
  for (const code of uniqueIdsImplementations) {
    const uniqueIds = compile(code);
    assert.equal(gradeAnswer(exerciseById('js-w15-d5-repair-v2'), code), true);
    const input = ['js', 'js', 'py'];
    assert.deepEqual([...uniqueIds(input)], ['js', 'py']);
    assert.deepEqual(input, ['js', 'js', 'py'], 'Set conversion preserves the source array');
    assert.deepEqual([...uniqueIds([])], []);
  }

  assert.equal(gradeAnswer(exerciseById('js-w13-d4-repair-v2'), 'function normalizeQuery(query) { return query.trim(); }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w13-d5-repair-v2'), 'function normalizeTag(tag) { return tag.trim().toLowerCase(); }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w14-d4-repair-v2'), 'function isValidDate(date) { return date.getTime() !== NaN; }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w14-d5-repair-v2'), 'function hoursBetween(start, end) { return 0; }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w15-d4-repair-v2'), 'function orderedEntries(map) { return Object.entries(map); }'), false);
  assert.equal(gradeAnswer(exerciseById('js-w15-d5-repair-v2'), 'function uniqueIds(ids) { return ids; }'), false);
});

test('repair grading ignores comments and strings when checking required code', () => {
  const cases = [
    ['js-function-repair', 'function double(value) { // return value * 2;\n}'],
    ['py-function-repair', 'def double(value):\n    # return value * 2'],
    ['java-method-repair', 'static int add(int left, int right) { // return left + right;\n}'],
    ['react-state-repair', 'function rename(nextName) { // setProfile({ ...profile, name: nextName })\n}'],
  ];

  for (const [id, response] of cases) {
    assert.equal(gradeAnswer(exerciseById(id), response), false, `${id} should not accept a comment as code`);
  }

  assert.equal(gradeAnswer(exerciseById('js-function-repair'), 'function double(value) { const note = "return value * 2;"; }'), false);
  assert.equal(gradeAnswer(exerciseById('py-function-repair'), 'def double(value):\n    """return value * 2"""'), false);
  assert.equal(gradeAnswer(exerciseById('java-method-repair'), 'static int add(int left, int right) { String note = """\nreturn left + right;\n"""; }'), false);
});

test('Python double function accepts either multiplication operand order', () => {
  const repair = exerciseById('py-function-repair');
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return 2 * value'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    # Return the computed value.\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return (\n        value\n        * 2\n    )'), true);
});

test('JavaScript repair rejects the original expression when it remains as a duplicate statement', () => {
  const repair = exerciseById('js-function-repair');
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; value * 2; }'), false);
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; value * 2 }'), false);
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; }'), true);
});

test('repair solution patterns reject matching text outside the required active function body', () => {
  const incorrectSolutions = [
    ['js-function-repair', 'function double(value) { const matcher = /return value * 2;/; }'],
    ['js-function-repair', 'function double(value) { re"turn" value * 2; }'],
    ['js-function-repair', 'function double(value) { if (false) return value * 2; }'],
    ['js-function-repair', 'function double(value) { return value * 2; value\n*\n2; }'],
    ['js-function-repair', 'function double(value) { return value * 2; (value * 2); }'],
    ['py-function-repair', 'def double(value):\nreturn value * 2'],
    ['py-function-repair', 'def double(value):\n    if False:\n        return value * 2'],
    ['java-method-repair', 'static int add(int left, int right) { if (false) return left + right; return 0; }'],
    ['react-state-repair', 'function rename(nextName) { if (false) setProfile({ ...profile, name: nextName }); }'],
  ];

  for (const [id, response] of incorrectSolutions) {
    assert.equal(gradeAnswer(exerciseById(id), response), false, `${id} should reject a non-solution containing the required text`);
  }

  assert.equal(gradeAnswer(exerciseById('react-state-repair'), 'function rename(nextName) {\n setProfile({\n  ...profile,\n  name: nextName\n });\n}'), true);
});

test('coding exercise is correct only after every test passes', () => {
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: true }), true);
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: false }), false);
});
