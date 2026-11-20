import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { codingProblems } from '../src/coding-problems.js';
import { sameExerciseValue } from '../src/runner-values.js';
import { tracks } from '../src/content.js';
import { validateCodingProblemBank } from '../scripts/coding-problem-schema.mjs';
import { transpileTypeScript } from '../src/typescript-transpiler.js';

const levels = ['입문', '기초', '중급', '고급', '실전'];
const javascriptProblems = codingProblems.filter((problem) => problem.language === 'javascript');
const typescriptProblems = codingProblems.filter((problem) => problem.language === 'typescript');
const fastapiProblems = codingProblems.filter((problem) => problem.language === 'fastapi');
const mainSource = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

test('JavaScript bank has 50 reviewed problems in five ordered levels', () => {
  assert.equal(javascriptProblems.length, 50);
  assert.deepEqual(
    Object.fromEntries(levels.map((level) => [
      level,
      javascriptProblems.filter((problem) => problem.level === level).length,
    ])),
    { 입문: 10, 기초: 10, 중급: 10, 고급: 10, 실전: 10 },
  );

  const knownTopicIds = new Set(tracks.flatMap((track) => track.topics.map((topic) => topic.id)));
  assert.deepEqual(validateCodingProblemBank(codingProblems, { knownTopicIds }), { valid: true, errors: [] });
  for (const [index, problem] of javascriptProblems.entries()) {
    assert.equal(problem.language, 'javascript', problem.id);
    assert.equal(problem.versionContext, 'ECMAScript 2026', problem.id);
    assert.equal(problem.review.status, 'approved', problem.id);
    assert.ok(problem.grading.tests.length >= 6, `${problem.id} needs six grading cases`);
    assert.ok(problem.examples.length >= 3, `${problem.id} needs public examples`);
    assert.ok(problem.hints.length >= 2, `${problem.id} needs staged hints`);
    assert.ok(problem.commonMistakes?.length >= 2, `${problem.id} needs specific common mistakes`);
    assert.ok(problem.solution.explanation.length >= 40, `${problem.id} needs a reviewed explanation`);
    assert.ok(problem.solution.complexity.length > 0, `${problem.id} needs complexity guidance`);
    assert.ok(problem.sources.some((source) => source.url.startsWith('https://')), `${problem.id} needs an official HTTPS reference`);
    assert.deepEqual(problem.prerequisiteIds, index === 0 ? [] : [javascriptProblems[index - 1].id], `${problem.id} must follow the prior step`);
  }
});

test('the first 25 JavaScript problems state their input and output contracts precisely', () => {
  const batch = javascriptProblems.slice(0, 25);
  assert.equal(batch.length, 25);
  assert.equal(batch.at(-1).id, 'js-two-sum-indices');
  for (const problem of batch) {
    assert.ok(problem.statement.trim().length >= 40, problem.id);
    assert.ok(problem.examples.every((example) => problem.grading.tests.some((testCase) =>
      sameExerciseValue(example.input, testCase.input) && sameExerciseValue(example.expected, testCase.expected))), problem.id);
  }

  const twoSum = batch.at(-1);
  assert.match(twoSum.statement, /안전한 정수 배열/);
  assert.ok(twoSum.requirements.some((requirement) => requirement.includes('Number.MAX_SAFE_INTEGER')));
  assert.ok(twoSum.grading.tests.some((testCase) => sameExerciseValue(testCase.input, [[3], 6]) && sameExerciseValue(testCase.expected, [])));
  assert.ok(twoSum.grading.tests.some((testCase) => sameExerciseValue(testCase.input, [[Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER], 0]) && sameExerciseValue(testCase.expected, [0, 1])));
});

test('the final 25 JavaScript problems make boundary and runtime behavior explicit', () => {
  const batch = javascriptProblems.slice(25);
  assert.equal(batch.length, 25);
  assert.equal(batch.at(-1).id, 'js-build-query-string');
  for (const problem of batch) {
    assert.ok(problem.statement.trim().length >= 40, problem.id);
    assert.ok(problem.examples.every((example) => problem.grading.tests.some((testCase) =>
      sameExerciseValue(example.input, testCase.input) && sameExerciseValue(example.expected, testCase.expected))), problem.id);
  }

  const find = (id) => batch.find((problem) => problem.id === id);
  assert.ok(find('js-summarize-by-category').statement.includes('객체로 반환'));
  assert.doesNotMatch(find('js-summarize-by-category').statement, /순서를 유지/);
  assert.ok(find('js-index-by-key').requirements.some((requirement) => requirement.includes('불리언')));
  assert.match(find('js-retry-delays').statement, /초기값이 최대값보다 크면 첫 대기시간도 최대값/);
  assert.match(find('js-longest-unique-substring').statement, /여러 코드 포인트로 조합된 이모지는 각각 셉니다/);
  assert.ok(find('js-build-query-string').grading.tests.some((testCase) =>
    sameExerciseValue(testCase.input, [{ tag: ['js', null, 'web'] }]) && sameExerciseValue(testCase.expected, 'tag=js&tag=web')));
  assert.ok(find('js-validate-profile').grading.tests.some((testCase) =>
    sameExerciseValue(testCase.input, [{ name: 'A', email: 'a@b.c' + String.fromCharCode(10), age: 20 }]) && sameExerciseValue(testCase.expected, ['email'])));
  assert.ok(find('js-calculate-taxed-total').sources.some((source) => source.url.endsWith('/Number')));
  assert.ok(find('js-calculate-taxed-total').sources.some((source) => source.url.endsWith('/Math/round')));
});

test('TypeScript bank has 50 reviewed problems in five ordered levels', () => {
  assert.equal(typescriptProblems.length, 50);
  assert.deepEqual(
    Object.fromEntries(levels.map((level) => [
      level,
      typescriptProblems.filter((problem) => problem.level === level).length,
    ])),
    { 입문: 10, 기초: 10, 중급: 10, 고급: 10, 실전: 10 },
  );

  const knownTopicIds = new Set(tracks.flatMap((track) => track.topics.map((topic) => topic.id)));
  assert.deepEqual(validateCodingProblemBank(codingProblems, { knownTopicIds }), { valid: true, errors: [] });
  for (const [index, problem] of typescriptProblems.entries()) {
    assert.equal(problem.versionContext, '브라우저 변환기 TypeScript 6.0.3 · TypeScript 7.0.2 안정판 · 7.1 Beta 시험판 (2026-10-23 확인)', problem.id);
    assert.equal(problem.runtime.adapterId, 'typescript-function-v1', problem.id);
    assert.equal(problem.review.status, 'approved', problem.id);
    assert.ok(problem.grading.tests.length >= 6, `${problem.id} needs six grading cases`);
    assert.ok(problem.examples.length >= 3, `${problem.id} needs public examples`);
    assert.ok(problem.hints.length >= 2, `${problem.id} needs staged hints`);
    assert.ok(problem.commonMistakes?.length >= 2, `${problem.id} needs specific common mistakes`);
    assert.ok(problem.solution.explanation.length >= 40, `${problem.id} needs a reviewed explanation`);
    assert.ok(problem.sources.some((source) => source.url === 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/'), `${problem.id} needs the current official release reference`);
    assert.deepEqual(problem.prerequisiteIds, index === 0 ? [] : [typescriptProblems[index - 1].id], `${problem.id} must follow the prior step`);
  }
});

test('the first 25 TypeScript problems align examples, explanations, and official handbook sources', () => {
  const batch = typescriptProblems.slice(0, 25);
  assert.equal(batch.length, 25);
  const handbookUrls = new Set([
    'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
    'https://www.typescriptlang.org/docs/handbook/2/objects.html',
    'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
    'https://www.typescriptlang.org/docs/handbook/2/functions.html',
    'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    'https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html',
  ]);
  for (const problem of batch) {
    assert.equal(problem.review.reviewedAt, '2026-10-16', problem.id);
    assert.ok(problem.examples.every((example) => problem.grading.tests.some((testCase) =>
      sameExerciseValue(example.input, testCase.input) && sameExerciseValue(example.expected, testCase.expected))), problem.id);
    assert.ok(problem.sources.some((source) => handbookUrls.has(source.url)), `${problem.id} needs a relevant official Handbook source`);
  }

  const find = (id) => batch.find((problem) => problem.id === id);
  assert.equal(find('ts-first-enabled-label').examples[2].expected, null);
  assert.match(find('ts-first-enabled-label').examples[2].explanation, /없어 null/);
  assert.match(find('ts-format-duration').examples[2].explanation, /몫 0과 나머지 59/);
  assert.match(find('ts-product-range').examples[2].explanation, /하한보다 낮고 둘째는 상한보다 높아 둘 다 제외/);
  const firstCharacter = find('ts-count-first-letter');
  assert.match(firstCharacter.statement, /첫 유니코드 문자/);
  assert.match(firstCharacter.solution.referenceImplementation, /\[\.\.\.word\]\[0\]/);
  assert.ok(firstCharacter.grading.tests.some((testCase) =>
    sameExerciseValue(testCase.input, [['🙂', '🙂x', 'a']]) && sameExerciseValue(testCase.expected, { '🙂': 2, a: 1 })));
});

test('the final 25 TypeScript problems cover safe records, utility types, and honest numeric contracts', () => {
  const batch = typescriptProblems.slice(25);
  assert.equal(batch.length, 25);
  const sourceUrls = new Set([
    'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
    'https://www.typescriptlang.org/docs/handbook/2/objects.html',
    'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
    'https://www.typescriptlang.org/docs/handbook/2/functions.html',
    'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    'https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html',
    'https://www.typescriptlang.org/docs/handbook/utility-types.html',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
    'https://tc39.es/ecma262/2022/multipage/numbers-and-dates.html#sec-number.issafeinteger',
  ]);
  for (const problem of batch) {
    assert.equal(problem.review.reviewedAt, '2026-10-23', problem.id);
    assert.ok(problem.sources.some((source) => source.url === 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/' && source.reviewedAt === '2026-10-23'), `${problem.id} needs the current beta status`);
    assert.ok(problem.examples.every((example) => problem.grading.tests.some((testCase) =>
      sameExerciseValue(example.input, testCase.input) && sameExerciseValue(example.expected, testCase.expected))), problem.id);
    assert.ok(problem.sources.some((source) => sourceUrls.has(source.url)), `${problem.id} needs a relevant official source`);
  }

  const find = (id) => batch.find((problem) => problem.id === id);
  assert.equal(find('ts-count-by-priority').examples[1].expected.low, 1);
  assert.match(find('ts-count-by-priority').examples[1].explanation, /low 값이 한 번/);
  assert.match(find('ts-split-pages').examples[2].explanation, /두 항목이 pageSize 2/);
  assert.match(find('ts-index-users').examples[2].explanation, /서로 다른 키/);
  assert.ok(find('ts-count-by-priority').grading.tests.some((testCase) =>
    sameExerciseValue(testCase.input, [[{ priority: '__proto__' }, { priority: 'constructor' }, { priority: '__proto__' }]])
    && Object.hasOwn(testCase.expected, '__proto__')));
  assert.ok(find('ts-count-by-key').grading.tests.some((testCase) => Object.hasOwn(testCase.expected, '__proto__')));
  assert.ok(find('ts-map-count-by-key').grading.tests.some((testCase) => Object.hasOwn(testCase.expected, '__proto__')));
  assert.ok(find('ts-index-users').grading.tests.some((testCase) => Object.hasOwn(testCase.expected, '__proto__')));
  assert.ok(find('ts-pick-profile-fields').grading.tests.some((testCase) => Object.hasOwn(testCase.expected, '__proto__')));
  assert.ok(find('ts-get-key-or-default').grading.tests.some((testCase) =>
    sameExerciseValue(testCase.input, [{}, 'toString', 'fallback']) && testCase.expected === 'fallback'));
  assert.match(find('ts-paid-total').statement, /실제 결제 금액 계산에 사용하지 않습니다/);
  assert.match(find('ts-paid-total').solution.explanation, /정수 최소 화폐 단위/);
  assert.ok(find('ts-paid-total').sources.some((source) => source.url.endsWith('/Number')));
  assert.ok(find('ts-valid-count-input').grading.tests.some((testCase) => testCase.input[0] === 9007199254740992 && testCase.expected === false));
  assert.ok(find('ts-valid-count-input').grading.tests.some((testCase) => testCase.input[0] === 9007199254740991 && testCase.expected === true));
  assert.match(find('ts-valid-count-input').solution.referenceImplementation, /Number\.isSafeInteger/);
  assert.match(find('ts-newest-record').statement, /유한한 숫자/);
  assert.match(find('ts-newest-record').solution.referenceImplementation, /Number\.isFinite/);
  assert.equal(find('ts-clean-tags').examples[2].input[0][0], '  ');
  assert.match(find('ts-clean-tags').examples[2].explanation, /공백 항목을 제외/);
});

test('TypeScript practical numeric helpers reject unsafe counts and skip invalid timestamps', () => {
  for (const [id, extraCases] of [
    ['ts-valid-count-input', [[[9007199254740992], false], [[Number.POSITIVE_INFINITY], false]]],
    ['ts-newest-record', [
      [[[{ createdAt: Number.NaN, id: 'invalid' }, { createdAt: 2, id: 'valid' }]], { createdAt: 2, id: 'valid' }],
      [[[{ createdAt: Number.POSITIVE_INFINITY, id: 'invalid' }]], null],
    ]],
  ]) {
    const problem = typescriptProblems.find((item) => item.id === id);
    const sandbox = {};
    const source = `${problem.solution.referenceImplementation}\nglobalThis.solve = ${problem.contract.entryPoint};`;
    const compiled = transpileTypeScript(source);
    assert.equal(compiled.ok, true, `${id}: ${compiled.error ?? ''}`);
    vm.runInNewContext(compiled.code, sandbox, { timeout: 1_000 });
    for (const [input, expected] of extraCases) {
      const actual = sandbox.solve(...input);
      assert.ok(sameExerciseValue(structuredClone(actual), expected), `${id}: unexpected boundary result`);
    }
  }
});

test('FastAPI bank has fifty reviewed ASGI problems across five ordered levels', () => {
  assert.equal(fastapiProblems.length, 50);
  assert.deepEqual(
    Object.fromEntries(levels.map((level) => [
      level,
      fastapiProblems.filter((problem) => problem.level === level).length,
    ])),
    { 입문: 10, 기초: 10, 중급: 10, 고급: 10, 실전: 10 },
  );
  const knownTopicIds = new Set(tracks.flatMap((track) => track.topics.map((topic) => topic.id)));
  assert.deepEqual(validateCodingProblemBank(codingProblems, { knownTopicIds }), { valid: true, errors: [] });
  for (const [index, problem] of fastapiProblems.entries()) {
    assert.equal(problem.versionContext, '학습 기준 FastAPI 0.162.0 (2026-10-23, 2026-11-02 확인) · 브라우저 실행 FastAPI 0.143.0 / Starlette 1.0.0 / Pydantic 2.12.5 · Pyodide 314.0.7 / Python 3.14.2', problem.id);
    assert.equal(problem.contract.kind, 'asgi-app', problem.id);
    assert.equal(problem.runtime.adapterId, 'fastapi-asgi-v1', problem.id);
    assert.equal(problem.runtime.mode, 'asgi-request', problem.id);
    assert.equal(problem.review.status, 'approved', problem.id);
    assert.equal(problem.review.reviewedAt, '2026-10-16', problem.id);
    assert.ok(problem.grading.tests.length >= 1 && problem.grading.tests.length <= 6, problem.id);
    assert.equal(problem.examples.length, Math.min(3, problem.grading.tests.length), `${problem.id} should show each useful example without padding duplicate cases`);
    assert.ok(problem.hints.length >= 2, `${problem.id} needs staged hints`);
    assert.ok(problem.commonMistakes.length >= 2, `${problem.id} needs topic-specific mistakes`);
    assert.ok(problem.solution.explanation.length >= 40, `${problem.id} needs an explanation`);
    assert.ok(problem.requirements.length >= 3, `${problem.id} needs acceptance criteria`);
    assert.ok(problem.requirements.some((requirement) => requirement.includes('HTTP 상태 코드')), `${problem.id} needs explicit status criteria`);
    assert.ok(problem.examples.every((example) => /사례 \d+: .* → HTTP \d+,/.test(example.explanation)), `${problem.id} examples must trace a real request and response`);
    assert.ok(problem.examples.every((example) => !example.explanation.includes('HTTP 상태와 JSON 응답을 확인합니다')), `${problem.id} must not use boilerplate examples`);
    assert.ok(problem.sources.some((source) => source.url === 'https://fastapi.tiangolo.com/tutorial/'), `${problem.id} needs the official FastAPI reference`);
    assert.ok(problem.sources.some((source) => source.url === 'https://fastapi.tiangolo.com/release-notes/' && source.reviewedAt === '2026-11-02'), `${problem.id} needs a current version source`);
    assert.ok(problem.sources.some((source) => source.url !== 'https://fastapi.tiangolo.com/tutorial/'), `${problem.id} needs a topic-specific official source`);
    assert.ok(problem.sources.filter((source) => source.url !== 'https://fastapi.tiangolo.com/release-notes/').every((source) => source.reviewedAt === '2026-10-16'), `${problem.id} topic sources need their review date`);
    assert.deepEqual(problem.prerequisiteIds, index ? [fastapiProblems[index - 1].id] : [], `${problem.id} must follow the prior step`);
  }
});

test('FastAPI problems 1–25 keep their request examples exact and include their stated response contracts', () => {
  const batch = fastapiProblems.slice(0, 25);
  assert.equal(batch.length, 25);
  const find = (id) => batch.find((problem) => problem.id === id);
  assert.match(find('fastapi-query-default').statement, /limit을 생략하면 3개/);
  assert.ok(find('fastapi-query-default').examples.some((example) => example.expected.json.items.length === 3));
  assert.match(find('fastapi-body-field-constraints').statement, /1~40자/);
  assert.ok(find('fastapi-body-field-constraints').grading.tests.filter((testCase) => testCase.expected.status === 422).length >= 3);
  assert.ok(find('fastapi-body-field-constraints').examples.some((example) => example.expected.status === 422));
  assert.ok(find('fastapi-enum-path').grading.tests.some((testCase) => testCase.input.path.endsWith('/blocked')));
  assert.ok(find('fastapi-enum-path').grading.tests.some((testCase) => testCase.expected.status === 422));
  assert.ok(find('fastapi-enum-path').examples.some((example) => example.expected.status === 422));
  assert.ok(find('fastapi-bounded-query').grading.tests.filter((testCase) => testCase.expected.status === 422).length >= 2);
  assert.ok(find('fastapi-bounded-query').examples.some((example) => example.expected.status === 422));
  assert.ok(find('fastapi-dependency-query-page').grading.tests.filter((testCase) => testCase.expected.status === 422).length >= 2);
  assert.ok(find('fastapi-dependency-query-page').examples.some((example) => example.expected.status === 422));
  assert.equal(find('fastapi-response-list-model').grading.tests.length, 1);
  assert.match(find('fastapi-query-sort-order').statement, /같은 점수는 id 오름차순/);
  assert.ok(find('fastapi-query-sort-order').grading.tests.some((testCase) => testCase.expected.status === 422));
  assert.ok(find('fastapi-query-sort-order').examples.some((example) => example.expected.status === 422));
  assert.notDeepEqual(
    find('fastapi-query-sort-order').grading.tests[1].expected.json.items,
    find('fastapi-query-sort-order').grading.tests[2].expected.json.items,
  );
  assert.match(find('fastapi-auth-header-role').solution.explanation, /실제 사용자의 신원이나 세션을 확인하지 않으므로/);
});

test('FastAPI problems 26–50 make CORS, validation errors, and final query inputs observable', () => {
  const batch = fastapiProblems.slice(25, 50);
  assert.equal(batch.length, 25);
  const find = (id) => batch.find((problem) => problem.id === id);
  assert.ok(find('fastapi-validation-safe-error').grading.tests.some((testCase) => testCase.expected.status === 422 && testCase.expected.json.code === 'invalid_input'));
  assert.ok(find('fastapi-validation-location').grading.tests.some((testCase) => testCase.expected.status === 422 && testCase.expected.json.code === 'invalid_credentials_shape'));
  assert.ok(find('fastapi-cors-origins').grading.tests.some((testCase) => testCase.input.method === 'OPTIONS' && testCase.expected.status === 200));
  assert.ok(find('fastapi-cors-origins').grading.tests.some((testCase) => testCase.input.method === 'OPTIONS' && testCase.expected.status === 400));
  assert.match(find('fastapi-cors-origins').solution.explanation, /응답 헤더 비교와 실제 브라우저/);
  assert.ok(find('fastapi-cors-origins').grading.tests.some((testCase) => testCase.input.method === 'OPTIONS' && testCase.input.headers?.['Access-Control-Request-Method'] === 'POST' && testCase.expected.status === 200));
  assert.ok(find('fastapi-safe-sort-allowlist').grading.tests.some((testCase) => testCase.expected.status === 422));
  assert.equal(find('fastapi-safe-sort-allowlist').grading.tests.length, 3);
  assert.match(find('fastapi-bearer-token-type').solution.explanation, /인증 성공을 뜻하지 않습니다/);
  assert.ok(find('fastapi-conditional-fields').grading.tests.some((testCase) => testCase.input.json.score === null && !Object.hasOwn(testCase.expected.json, 'score')));
  assert.match(find('fastapi-headers-request-id').title, /기본값/);
  assert.match(find('fastapi-validation-location').title, /검증 실패/);
  assert.match(find('fastapi-lifespan-test-ready').title, /시작 때/);
  for (const problem of batch) {
    const caseKeys = problem.grading.tests.map((testCase) => JSON.stringify(testCase));
    assert.equal(new Set(caseKeys).size, caseKeys.length, `${problem.id} must not repeat exact cases`);
  }
  assert.deepEqual(
    find('fastapi-safe-sort-allowlist').grading.tests[0].expected.json.items.map((item) => item.id),
    [2, 1, 3],
  );
  assert.deepEqual(
    find('fastapi-safe-sort-allowlist').grading.tests[1].expected.json.items.map((item) => item.id),
    [1, 3, 2],
  );
  assert.ok(find('fastapi-final-course-api').grading.tests.some((testCase) => testCase.input.query?.published === 'true' && testCase.expected.json.published));
  assert.ok(find('fastapi-final-course-api').grading.tests.some((testCase) => testCase.input.query?.published === 'false' && !testCase.expected.json.published));
});

test('coding preparation list includes tracks with executable problems', () => {
  assert.match(mainSource, /const languages = \[\.\.\.new Set\(runnableProblems\.map\(\(problem\) => problem\.language\)\)\]/);
  assert.match(mainSource, /const languageDirectoryTracks = languages\.map\(\(id\) =>/);
  assert.match(mainSource, /const count = runnableProblems\.filter\(\(problem\) => problem\.language === track\.id\)\.length/);
});

test('TypeScript solutions transpile and return every expected value without changing inputs', () => {
  for (const problem of typescriptProblems) {
    const sandbox = { args: null };
    const source = `${problem.solution.referenceImplementation}\nglobalThis.solve = ${problem.contract.entryPoint};`;
    const compiled = transpileTypeScript(source);
    assert.equal(compiled.ok, true, `${problem.id}: ${compiled.error ?? ''}`);
    vm.runInNewContext(compiled.code, sandbox, { timeout: 250 });
    assert.equal(typeof sandbox.solve, 'function', `${problem.id} reference implementation must define a function`);

    for (const [index, sample] of problem.grading.tests.entries()) {
      const original = structuredClone(sample.input);
      sandbox.args = structuredClone(sample.input);
      const actual = vm.runInNewContext('solve(...args)', sandbox, { timeout: 1_000 });
      assert.ok(
        sameExerciseValue(structuredClone(actual), sample.expected),
        `${problem.id} sample ${index + 1} expected ${JSON.stringify(sample.expected)} but got ${JSON.stringify(actual)}`,
      );
      assert.ok(sameExerciseValue(sandbox.args, original), `${problem.id} sample ${index + 1} must not mutate input`);
    }
  }
});

test('TypeScript transpiler rejects malformed source and enforces its size bound', () => {
  assert.equal(transpileTypeScript('function broken(: string {').ok, false);
  assert.match(transpileTypeScript('x'.repeat(20_001)).error, /20,000/);
});

test('every JavaScript reference solution returns the expected values without changing inputs', () => {
  for (const problem of javascriptProblems) {
    const sandbox = { args: null };
    vm.runInNewContext(`globalThis.solve = (${problem.solution.referenceImplementation});`, sandbox, { timeout: 250 });
    assert.equal(typeof sandbox.solve, 'function', `${problem.id} reference implementation must define a function`);

    for (const [index, sample] of problem.grading.tests.entries()) {
      const original = structuredClone(sample.input);
      sandbox.args = structuredClone(sample.input);
      const actual = vm.runInNewContext('solve(...args)', sandbox, { timeout: 250 });
      assert.ok(
        sameExerciseValue(structuredClone(actual), sample.expected),
        `${problem.id} sample ${index + 1} expected ${JSON.stringify(sample.expected)} but got ${JSON.stringify(actual)}`,
      );
      assert.ok(sameExerciseValue(sandbox.args, original), `${problem.id} sample ${index + 1} must not mutate input`);
    }
  }
});
