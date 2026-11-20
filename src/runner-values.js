function isPlainRecord(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function sameExerciseValue(actual, expected) {
  if (actual === expected || Object.is(actual, expected)) return true;
  if (typeof actual !== typeof expected || actual === null || expected === null) return false;

  if (Array.isArray(actual) || Array.isArray(expected)) {
    return Array.isArray(actual) && Array.isArray(expected)
      && actual.length === expected.length
      && actual.every((value, index) => sameExerciseValue(value, expected[index]));
  }

  if (isPlainRecord(actual) || isPlainRecord(expected)) {
    if (!isPlainRecord(actual) || !isPlainRecord(expected)) return false;
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    return actualKeys.length === expectedKeys.length
      && actualKeys.every((key, index) => key === expectedKeys[index]
        && sameExerciseValue(actual[key], expected[key]));
  }

  return false;
}

export function formatExerciseValue(value) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

export function formatCodingExampleValue(value) {
  if (typeof value === 'string') return value;
  try {
    const compact = JSON.stringify(value);
    if (compact === undefined) return String(value);

    const columns = [...compact].reduce((width, character) => (
      width + (character.codePointAt(0) > 0xff ? 2 : 1)
    ), 0);
    return columns <= 32 ? compact : JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}
