import { sameExerciseValue } from '../src/runner-values.js';

const LEVELS = new Set(['입문', '기초', '중급', '고급', '실전']);
const ADAPTERS = new Map([
  ['javascript-function-v1', { language: 'javascript', mode: 'function-return', comparison: 'deep-value' }],
  ['typescript-function-v1', { language: 'typescript', mode: 'function-return', comparison: 'deep-value' }],
  ['postgresql-query-v1', { language: 'postgresql', mode: 'sql-query', comparison: 'deep-value' }],
  ['fastapi-asgi-v1', { language: 'fastapi', mode: 'asgi-request', comparison: 'deep-value' }],
]);
const MAX_PROBLEMS = 5_000;
const MAX_CASES = 20;
const MAX_CASE_BYTES = 64 * 1024;
const MAX_SOURCE_CHARS = 20_000;
const MAX_HINTS = 5;
const MAX_VALUE_DEPTH = 12;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const SAFE_IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasText(value, maximum = 10_000) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximum;
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isJsonValue(value, depth = 0, seen = new Set()) {
  if (depth > MAX_VALUE_DEPTH) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object' || seen.has(value)) return false;
  if (!Array.isArray(value) && !isRecord(value)) return false;

  seen.add(value);
  const valid = Array.isArray(value)
    ? Array.from({ length: value.length }, (_, index) => index in value && isJsonValue(value[index], depth + 1, seen)).every(Boolean)
    : Object.values(value).every((item) => isJsonValue(item, depth + 1, seen));
  seen.delete(value);
  return valid;
}

function addTextError(errors, value, path, maximum = 10_000) {
  if (!hasText(value, maximum)) errors.push(`${path}: 비어 있거나 허용 길이를 넘었습니다.`);
}

function validateCases(cases, path, contractKind, errors, { required = true } = {}) {
  if (!Array.isArray(cases)) {
    if (required || cases !== undefined) errors.push(`${path}: 배열이어야 합니다.`);
    return;
  }
  if ((required && cases.length === 0) || cases.length > MAX_CASES) {
    errors.push(`${path}: ${required ? '1' : '0'}–${MAX_CASES}개여야 합니다.`);
    return;
  }

  for (const [index, item] of cases.entries()) {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemPath}: 객체여야 합니다.`);
      continue;
    }
    if (contractKind === 'function' && !Array.isArray(item.input)) {
      errors.push(`${itemPath}.input: 함수 인자 배열이어야 합니다.`);
    } else if (contractKind === 'stdin' && typeof item.input !== 'string') {
      errors.push(`${itemPath}.input: 표준 입력 문자열이어야 합니다.`);
    } else if (contractKind === 'sql' && typeof item.input !== 'string') {
      errors.push(`${itemPath}.input: PostgreSQL 초기 데이터 SQL이어야 합니다.`);
    } else if (contractKind === 'asgi-app' && !isRecord(item.input)) {
      errors.push(`${itemPath}.input: HTTP 요청 객체여야 합니다.`);
    }
    if (!Object.hasOwn(item, 'input') || !isJsonValue(item.input)) errors.push(`${itemPath}.input: JSON 입력값이어야 합니다.`);
    if (!Object.hasOwn(item, 'expected') || !isJsonValue(item.expected)) {
      errors.push(`${itemPath}.expected: JSON 값이어야 합니다.`);
    }
    if (item.explanation !== undefined) addTextError(errors, item.explanation, `${itemPath}.explanation`, 1_000);
    if (contractKind === 'asgi-app') {
      const request = item.input;
      if (isRecord(request)) {
        if (typeof request.method !== 'string' || !/^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)$/.test(request.method)) {
          errors.push(`${itemPath}.input.method: 지원되는 대문자 HTTP 메서드가 필요합니다.`);
        }
        if (typeof request.path !== 'string' || !/^\/[A-Za-z0-9_./-]*$/.test(request.path) || request.path.includes('..')) {
          errors.push(`${itemPath}.input.path: 안전한 절대 경로가 필요합니다.`);
        }
        if (request.query !== undefined && !isRecord(request.query)) errors.push(`${itemPath}.input.query: 객체여야 합니다.`);
        if (request.headers !== undefined && (!isRecord(request.headers)
          || Object.entries(request.headers).some(([key, value]) => !/^[a-zA-Z0-9-]{1,80}$/.test(key) || typeof value !== 'string' || value.length > 1_000))) {
          errors.push(`${itemPath}.input.headers: 짧은 문자열 헤더 객체여야 합니다.`);
        }
      }
      const response = item.expected;
      if (!isRecord(response) || !Number.isInteger(response.status) || response.status < 100 || response.status > 599
        || !Object.hasOwn(response, 'json')) {
        errors.push(`${itemPath}.expected: status와 JSON 응답 본문이 필요합니다.`);
      }
    }
  }

  try {
    const bytes = new TextEncoder().encode(JSON.stringify(cases)).length;
    if (bytes > MAX_CASE_BYTES) errors.push(`${path}: 전체 크기가 ${MAX_CASE_BYTES}바이트를 넘었습니다.`);
  } catch {
    errors.push(`${path}: JSON으로 직렬화할 수 없습니다.`);
  }
}

export function validateCodingProblem(problem) {
  const errors = [];
  if (!isRecord(problem)) return ['문제는 일반 객체여야 합니다.'];

  if (typeof problem.id !== 'string' || !SAFE_ID.test(problem.id)) errors.push('id: 영문 소문자, 숫자, 하이픈 형식이어야 합니다.');
  addTextError(errors, problem.title, 'title', 160);
  if (typeof problem.language !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(problem.language)) errors.push('language: 안정된 언어 ID가 필요합니다.');
  if (problem.framework !== undefined && problem.framework !== null && !hasText(problem.framework, 80)) errors.push('framework: 이름 또는 null이어야 합니다.');
  addTextError(errors, problem.versionContext, 'versionContext', 160);
  if (!LEVELS.has(problem.level)) errors.push('level: 정의된 다섯 난이도 중 하나여야 합니다.');

  if (!Array.isArray(problem.topicIds) || problem.topicIds.length === 0
    || problem.topicIds.some((id) => typeof id !== 'string' || !SAFE_ID.test(id))
    || new Set(problem.topicIds).size !== problem.topicIds.length) {
    errors.push('topicIds: 중복 없는 주제 ID가 하나 이상 필요합니다.');
  }
  if (!Array.isArray(problem.prerequisiteIds)
    || problem.prerequisiteIds.some((id) => typeof id !== 'string' || !SAFE_ID.test(id))
    || new Set(problem.prerequisiteIds).size !== problem.prerequisiteIds.length) {
    errors.push('prerequisiteIds: 중복 없는 문제 ID 배열이어야 합니다.');
  }
  if (!Number.isInteger(problem.estimatedMinutes) || problem.estimatedMinutes < 1 || problem.estimatedMinutes > 240) {
    errors.push('estimatedMinutes: 1–240분 정수여야 합니다.');
  }
  addTextError(errors, problem.objective, 'objective', 500);
  addTextError(errors, problem.statement, 'statement', 5_000);
  if (!Array.isArray(problem.requirements) || problem.requirements.length === 0
    || problem.requirements.some((item) => !hasText(item, 500))) errors.push('requirements: 확인 가능한 요구사항이 하나 이상 필요합니다.');
  if (!Array.isArray(problem.constraints) || problem.constraints.length === 0
    || problem.constraints.some((item) => !hasText(item, 500))) errors.push('constraints: 유효한 제약 설명이 하나 이상 필요합니다.');
  if (typeof problem.starterCode !== 'string' || problem.starterCode.length > MAX_SOURCE_CHARS) {
    errors.push(`starterCode: 문자열이며 ${MAX_SOURCE_CHARS}자 이하여야 합니다.`);
  }

  const contract = problem.contract;
  if (!isRecord(contract) || !['function', 'stdin', 'scenario', 'sql', 'asgi-app'].includes(contract.kind)) {
    errors.push('contract: function, stdin, scenario, sql, asgi-app 중 하나여야 합니다.');
  } else {
    addTextError(errors, contract.inputDescription, 'contract.inputDescription', 500);
    addTextError(errors, contract.outputDescription, 'contract.outputDescription', 500);
    if (contract.kind === 'function' && !SAFE_IDENTIFIER.test(contract.entryPoint ?? '')) {
      errors.push('contract.entryPoint: 유효한 함수 이름이 필요합니다.');
    }
    if (contract.kind !== 'function' && contract.entryPoint !== undefined) errors.push('contract.entryPoint: 함수 계약에서만 사용합니다.');
  }
  const contractKind = isRecord(contract) ? contract.kind : 'scenario';
  validateCases(problem.examples, 'examples', contractKind, errors);

  const runtime = problem.runtime;
  if (!isRecord(runtime) || !['verified', 'unavailable'].includes(runtime.status)) {
    errors.push('runtime.status: verified 또는 unavailable이어야 합니다.');
  }
  const grading = problem.grading;
  if (!isRecord(grading) || !['runtime-output', 'guided'].includes(grading.mode)) {
    errors.push('grading.mode: runtime-output 또는 guided여야 합니다.');
  }

  if (isRecord(runtime) && isRecord(grading)) {
    if (runtime.status === 'verified') {
      const adapter = ADAPTERS.get(runtime.adapterId);
      if (!adapter) errors.push('runtime.adapterId: 검증된 로컬 어댑터가 아닙니다.');
      if (grading.mode !== 'runtime-output') errors.push('grading.mode: 실행 가능한 문제는 runtime-output이어야 합니다.');
      if (adapter && (adapter.language !== problem.language || adapter.mode !== runtime.mode || adapter.comparison !== grading.comparison)) {
        errors.push('runtime/grading: 어댑터·언어·실행 계약·비교 방식이 맞지 않습니다.');
      }
      if (contractKind === 'scenario') errors.push('contract: 실행 문제는 function, stdin 또는 sql 계약이 필요합니다.');
      if (runtime.mode === 'function-return' && contractKind !== 'function') errors.push('runtime.mode: 함수 반환 문제는 function 계약이 필요합니다.');
      if (runtime.mode === 'stdin-stdout' && contractKind !== 'stdin') errors.push('runtime.mode: 표준 입출력 문제는 stdin 계약이 필요합니다.');
      if (runtime.mode === 'sql-query' && (contractKind !== 'sql' || problem.language !== 'postgresql')) errors.push('runtime.mode: PostgreSQL SQL 계약이 필요합니다.');
      if (runtime.mode === 'asgi-request' && (contractKind !== 'asgi-app' || problem.language !== 'fastapi')) errors.push('runtime.mode: FastAPI ASGI 앱 계약이 필요합니다.');
      if (!['function-return', 'stdin-stdout', 'sql-query', 'asgi-request'].includes(runtime.mode)) errors.push('runtime.mode: 지원되는 실행 방식이 아닙니다.');
      validateCases(grading.tests, 'grading.tests', contractKind, errors);
      if (!['deep-value', 'exact-text'].includes(grading.comparison)) errors.push('grading.comparison: deep-value 또는 exact-text여야 합니다.');
      if (grading.comparison === 'exact-text' && Array.isArray(grading.tests)
        && grading.tests.some((item) => typeof item?.expected !== 'string')) {
        errors.push('grading.tests.expected: exact-text 비교는 문자열 기대값만 허용합니다.');
      }
      if (Array.isArray(problem.examples) && Array.isArray(grading.tests)) {
        for (const [index, example] of problem.examples.entries()) {
          const isCovered = grading.tests.some((item) => item
            && sameExerciseValue(item.input, example?.input)
            && sameExerciseValue(item.expected, example?.expected));
          if (!isCovered) errors.push(`examples[${index}]: 입력과 결과가 채점 사례에 포함되어야 합니다.`);
        }
      }
      if (grading.criteria !== undefined) errors.push('grading.criteria: 실행 채점과 함께 사용하지 않습니다.');
      if (runtime.adapterId === 'postgresql-query-v1') {
        if (!isRecord(problem.database)) {
          errors.push('database: PostgreSQL 스키마와 초기화 쿼리가 필요합니다.');
        } else {
          addTextError(errors, problem.database.setup, 'database.setup', 20_000);
          addTextError(errors, problem.database.reset, 'database.reset', 5_000);
        }
        if (Array.isArray(grading.tests) && grading.tests.some((item) => !Array.isArray(item?.expected))) {
          errors.push('grading.tests.expected: PostgreSQL 질의 결과는 행 배열이어야 합니다.');
        }
      } else if (problem.database !== undefined) {
        errors.push('database: PostgreSQL 어댑터에서만 사용합니다.');
      }
    } else {
      if (runtime.mode !== 'none' || runtime.adapterId !== null) errors.push('runtime: 실행 미지원은 mode none과 adapterId null이어야 합니다.');
      if (grading.mode !== 'guided') errors.push('grading.mode: 실행 미지원은 guided이어야 합니다.');
      if (grading.tests !== undefined && (!Array.isArray(grading.tests) || grading.tests.length > 0)) errors.push('grading.tests: 실행 미지원 문제에는 둘 수 없습니다.');
      if (grading.comparison !== undefined) errors.push('grading.comparison: guided 문제에는 자동 비교 방식을 둘 수 없습니다.');
      if (!Array.isArray(grading.criteria) || grading.criteria.length === 0
        || grading.criteria.some((item) => !hasText(item, 500))) errors.push('grading.criteria: 스스로 확인할 기준이 하나 이상 필요합니다.');
    }
  }

  if (!Array.isArray(problem.hints) || problem.hints.length === 0 || problem.hints.length > MAX_HINTS
    || problem.hints.some((item) => !hasText(item, 1_000))) errors.push(`hints: 1–${MAX_HINTS}개의 유효한 단계별 힌트가 필요합니다.`);
  if (!isRecord(problem.solution)) {
    errors.push('solution: 설명과 참고 구현을 포함한 객체가 필요합니다.');
  } else {
    addTextError(errors, problem.solution.explanation, 'solution.explanation', 3_000);
    addTextError(errors, problem.solution.referenceImplementation, 'solution.referenceImplementation', MAX_SOURCE_CHARS);
    if (problem.solution.complexity !== undefined && !hasText(problem.solution.complexity, 160)) errors.push('solution.complexity: 값이 있으면 설명 문자열이어야 합니다.');
  }

  if (!Array.isArray(problem.sources) || problem.sources.length === 0) {
    errors.push('sources: 검증 가능한 HTTPS 출처가 하나 이상 필요합니다.');
  } else {
    for (const [index, source] of problem.sources.entries()) {
      const path = `sources[${index}]`;
      if (!isRecord(source)) {
        errors.push(`${path}: 객체여야 합니다.`);
        continue;
      }
      addTextError(errors, source.title, `${path}.title`, 160);
      if (!validDate(source.reviewedAt)) errors.push(`${path}.reviewedAt: YYYY-MM-DD 날짜가 필요합니다.`);
      try {
        if (new URL(source.url).protocol !== 'https:') errors.push(`${path}.url: HTTPS 출처만 허용합니다.`);
      } catch {
        errors.push(`${path}.url: 유효한 HTTPS URL이 필요합니다.`);
      }
    }
  }

  if (!isRecord(problem.review) || !['draft', 'approved'].includes(problem.review.status)) {
    errors.push('review.status: draft 또는 approved이어야 합니다.');
  } else if (problem.review.status === 'approved' && !validDate(problem.review.reviewedAt)) {
    errors.push('review.reviewedAt: 승인 문항은 YYYY-MM-DD 검수일이 필요합니다.');
  } else if (problem.review.status === 'draft' && problem.review.reviewedAt !== undefined) {
    errors.push('review.reviewedAt: 초안에는 승인 검수일을 둘 수 없습니다.');
  }

  return errors;
}

export function validateCodingProblemBank(problems, { knownTopicIds } = {}) {
  if (!Array.isArray(problems) || problems.length === 0 || problems.length > MAX_PROBLEMS) {
    return { valid: false, errors: [`문제 은행은 1–${MAX_PROBLEMS}개의 항목을 가져야 합니다.`] };
  }

  const errors = [];
  const byId = new Map();
  for (const [index, problem] of problems.entries()) {
    for (const error of validateCodingProblem(problem)) errors.push(`problems[${index}].${error}`);
    if (typeof problem?.id === 'string') {
      if (byId.has(problem.id)) errors.push(`중복된 문제 ID: ${problem.id}`);
      else byId.set(problem.id, problem);
    }
  }

  for (const problem of byId.values()) {
    if (knownTopicIds instanceof Set && Array.isArray(problem.topicIds)) {
      for (const topicId of problem.topicIds) {
        if (!knownTopicIds.has(topicId)) errors.push(`${problem.id}: 주제 ${topicId}가 학습 카탈로그에 없습니다.`);
      }
    }
    if (!Array.isArray(problem.prerequisiteIds)) continue;
    for (const prerequisiteId of problem.prerequisiteIds) {
      if (!byId.has(prerequisiteId)) errors.push(`${problem.id}: 선수 문제 ${prerequisiteId}가 은행에 없습니다.`);
      if (problem.id === prerequisiteId) errors.push(`${problem.id}: 자기 자신을 선수 문제로 지정할 수 없습니다.`);
    }
  }

  const visited = new Set();
  const visiting = new Set();
  let hasCycle = false;
  function visit(id) {
    if (visiting.has(id)) {
      hasCycle = true;
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const prerequisites = byId.get(id)?.prerequisiteIds;
    if (Array.isArray(prerequisites)) {
      for (const prerequisiteId of prerequisites) if (byId.has(prerequisiteId)) visit(prerequisiteId);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
  if (hasCycle) errors.push('선수 문제 관계에 순환 참조가 있습니다.');

  return { valid: errors.length === 0, errors };
}

export const codingProblemLimits = Object.freeze({
  cases: MAX_CASES,
  caseBytes: MAX_CASE_BYTES,
  sourceCharacters: MAX_SOURCE_CHARS,
  hints: MAX_HINTS,
});
