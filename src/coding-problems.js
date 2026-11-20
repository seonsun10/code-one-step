import { additionalJavascriptProblems } from './coding-problems-javascript.js';
import { advancedJavascriptProblems } from './coding-problems-javascript-more.js';
import { typescriptProblems } from './coding-problems-typescript.js';
import { postgresqlProblems } from './coding-problems-postgresql.js';
import { fastapiProblems } from './coding-problems-fastapi.js';

export const codingProblems = [
  {
    id: 'js-sum-coding',
    title: '숫자 배열의 합 구하기',
    language: 'javascript',
    framework: null,
    versionContext: 'ECMAScript 2026',
    level: '입문',
    topicIds: ['js-data'],
    prerequisiteIds: [],
    estimatedMinutes: 15,
    objective: '배열에 담긴 숫자를 누적해 하나의 결과로 반환합니다.',
    statement: '숫자가 담긴 배열을 받아 모든 숫자의 합을 반환하는 `sumNumbers` 함수를 작성하세요. 빈 배열의 합은 0입니다. 실행 결과는 공개 입력 사례의 반환값으로 채점합니다.',
    requirements: [
      '배열에 담긴 모든 숫자의 합을 숫자로 반환합니다.',
      '빈 배열을 받으면 0을 반환합니다.',
    ],
    constraints: [
      '함수 이름은 `sumNumbers`로 유지합니다.',
      '결과를 콘솔에 출력하는 대신 반환합니다.',
    ],
    contract: {
      kind: 'function',
      entryPoint: 'sumNumbers',
      inputDescription: '숫자 배열 한 개를 인자로 전달합니다.',
      outputDescription: '배열의 숫자를 더한 값을 반환합니다.',
    },
    examples: [
      { input: [[2, 3, 4]], expected: 9, explanation: '2 + 3 + 4를 계산합니다.' },
      { input: [[]], expected: 0, explanation: '빈 배열은 시작값 0을 반환합니다.' },
      { input: [[-1, 6]], expected: 5, explanation: '음수도 합산합니다.' },
    ],
    starterCode: 'function sumNumbers(numbers) {\n  // 배열의 숫자를 모두 더해 반환하세요.\n  return 0;\n}',
    runtime: { status: 'verified', mode: 'function-return', adapterId: 'javascript-function-v1' },
    grading: {
      mode: 'runtime-output',
      comparison: 'deep-value',
      tests: [
        { input: [[2, 3, 4]], expected: 9 },
        { input: [[-1, 6]], expected: 5 },
        { input: [[]], expected: 0 },
        { input: [[0]], expected: 0 },
        { input: [[-3, -2, -1]], expected: -6 },
        { input: [[1.5, 2.25]], expected: 3.75 },
      ],
    },
    hints: [
      '누적값을 0에서 시작하면 빈 배열의 결과도 자연스럽게 정해집니다.',
      '`reduce`를 쓴다면 두 번째 인자로 시작값 0을 전달할 수 있습니다.',
    ],
    commonMistakes: [
      '초기값을 0으로 전달하지 않아 빈 배열에서 reduce가 오류를 내는 실수',
      '합계를 반환하지 않고 콘솔 출력만 해 반환값 채점에 실패하는 실수',
    ],
    solution: {
      explanation: '배열의 각 숫자를 누적값에 더합니다. 초기값을 0으로 주면 빈 배열에서도 같은 규칙으로 0을 반환합니다.',
      referenceImplementation: 'function sumNumbers(numbers) {\n  return numbers.reduce((sum, number) => sum + number, 0);\n}',
      complexity: 'O(n) 시간, O(1) 추가 공간',
    },
    sources: [
      {
        title: 'ECMA-262 17th edition: Array.prototype.reduce',
        url: 'https://tc39.es/ecma262/2026/multipage/indexed-collections.html#sec-array.prototype.reduce',
        reviewedAt: '2026-10-13',
      },
    ],
    review: { status: 'approved', reviewedAt: '2026-10-13' },
  },
  ...additionalJavascriptProblems,
  ...advancedJavascriptProblems,
  ...typescriptProblems,
  ...postgresqlProblems,
  ...fastapiProblems,
];
