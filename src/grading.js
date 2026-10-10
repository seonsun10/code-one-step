function normalizeAnswer(value) {
  return String(value ?? '').trim().toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ');
}

export function gradeAnswer(exercise, response) {
  switch (exercise.type) {
    case 'choice':
      return String(response ?? '') === exercise.answer;
    case 'short-answer':
      return exercise.acceptedAnswers.some((answer) => normalizeAnswer(response) === normalizeAnswer(answer));
    case 'locate-error': {
      const selected = Array.isArray(response) ? [...response].sort((a, b) => a - b) : [];
      const correct = [...exercise.answerLines].sort((a, b) => a - b);
      return selected.length === correct.length && selected.every((line, index) => line === correct[index]);
    }
    case 'repair-code':
      return typeof response === 'string' &&
        exercise.requiredFragments.every((fragment) => response.includes(fragment)) &&
        exercise.forbiddenFragments.every((fragment) => !response.includes(fragment));
    case 'coding':
      return response === true || Boolean(response && response.passed === true);
    default:
      return false;
  }
}
