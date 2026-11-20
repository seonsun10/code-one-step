import { sameExerciseValue } from './runner-values.js';

export const POSTGRESQL_MAX_QUERY_CHARS = 20_000;
export const POSTGRESQL_MAX_TESTS = 12;
export const POSTGRESQL_MAX_RESULT_ROWS = 100;
export const POSTGRESQL_MAX_RESULT_BYTES = 100_000;

function normalizeValue(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('결과에 표시할 수 없는 숫자가 있습니다.');
    return value;
  }
  if (typeof value === 'bigint') {
    return value >= BigInt(Number.MIN_SAFE_INTEGER) && value <= BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(value)
      : value.toString();
  }
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) return Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('');
  throw new Error('표시할 수 없는 PostgreSQL 결과 형식입니다.');
}

function normalizeRows(rows) {
  if (!Array.isArray(rows) || rows.length > POSTGRESQL_MAX_RESULT_ROWS) {
    throw new Error(`결과는 최대 ${POSTGRESQL_MAX_RESULT_ROWS}행까지 확인할 수 있습니다.`);
  }
  const normalized = rows.map((row) => {
    const columns = Object.keys(row);
    if (columns.length > 40) throw new Error('결과 열은 최대 40개까지 확인할 수 있습니다.');
    return Object.fromEntries(columns.map((column) => [column, normalizeValue(row[column])]));
  });
  if (new TextEncoder().encode(JSON.stringify(normalized)).length > POSTGRESQL_MAX_RESULT_BYTES) {
    throw new Error('결과가 표시 크기 제한을 넘었습니다.');
  }
  return normalized;
}

function validateExercise({ database, tests, code }) {
  if (typeof code !== 'string' || !code.trim() || code.length > POSTGRESQL_MAX_QUERY_CHARS) {
    throw new Error(`SQL 코드는 1–${POSTGRESQL_MAX_QUERY_CHARS.toLocaleString()}자여야 합니다.`);
  }
  if (!database || typeof database.setup !== 'string' || typeof database.reset !== 'string'
    || database.setup.length > 20_000 || database.reset.length > 5_000) {
    throw new Error('문제의 데이터베이스 예제를 확인할 수 없습니다.');
  }
  if (!Array.isArray(tests) || tests.length < 1 || tests.length > POSTGRESQL_MAX_TESTS
    || tests.some((test) => typeof test?.input !== 'string' || test.input.length > 5_000)) {
    throw new Error('SQL 테스트 사례 구성이 올바르지 않습니다.');
  }
}

function asSingleQuery(source) {
  const query = source.trim().replace(/;+\s*$/, '');
  if (!query) throw new Error('실행할 SQL 문장을 작성하세요.');
  return `SELECT * FROM (${query}) AS learner_result LIMIT ${POSTGRESQL_MAX_RESULT_ROWS + 1}`;
}

export async function evaluatePostgresSource(db, { database, tests, code }) {
  validateExercise({ database, tests, code });
  const query = asSingleQuery(code);
  const results = [];
  await db.exec(database.setup);

  for (const test of tests) {
    let transactionOpen = false;
    try {
      await db.exec(database.reset);
      if (test.input.trim()) await db.exec(test.input);
      await db.exec('BEGIN READ ONLY');
      transactionOpen = true;
      const result = await db.query(query);
      await db.exec('ROLLBACK');
      transactionOpen = false;
      const actual = normalizeRows(result.rows);
      results.push({ actualAvailable: true, actual, output: JSON.stringify(actual), error: '' });
    } catch (error) {
      if (transactionOpen) {
        try { await db.exec('ROLLBACK'); } catch { /* the query may already have aborted the transaction */ }
      }
      results.push({ actualAvailable: false, actual: null, output: '', error: String(error?.message ?? error).slice(0, 500) });
    }
  }

  return {
    results,
    passed: results.length === tests.length && results.every((result, index) => (
      result.actualAvailable && !result.error && sameExerciseValue(result.actual, tests[index].expected)
    )),
  };
}
