function normalizeAnswer(value) {
  return String(value ?? '').trim().toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ');
}

function normalizePythonExpression(value) {
  return String(value ?? '').replace(/\s+/g, '');
}

function stripComments(source, language = '') {
  const text = String(source ?? '').replace(/\r\n?/g, '\n');
  const python = language.toLocaleLowerCase('en') === 'python';
  const supportsTemplateStrings = ['javascript', 'react'].includes(language.toLocaleLowerCase('en'));
  const output = [...text];
  let state = 'code';
  let quote = '';

  const blank = (index) => {
    if (text[index] !== '\n') output[index] = ' ';
  };

  for (let index = 0; index < text.length; index += 1) {
    const current = text[index];
    const next = text[index + 1];

    if (state === 'line-comment') {
      if (current === '\n') state = 'code';
      else blank(index);
      continue;
    }

    if (state === 'block-comment') {
      if (current === '*' && next === '/') {
        blank(index);
        blank(index + 1);
        index += 1;
        state = 'code';
      } else {
        blank(index);
      }
      continue;
    }

    if (state === 'string') {
      if (current === '\\') {
        if (index + 1 < text.length) {
          index += 1;
        }
      } else if (quote.length > 1 && text.startsWith(quote, index)) {
        index += quote.length - 1;
        state = 'code';
      } else {
        if (quote.length === 1 && current === quote) state = 'code';
      }
      continue;
    }

    if ((python && current === '#') || (!python && current === '/' && next === '/')) {
      blank(index);
      if (next === '/') blank(index + 1);
      if (next === '/') index += 1;
      state = 'line-comment';
      continue;
    }

    if (!python && current === '/' && next === '*') {
      blank(index);
      blank(index + 1);
      index += 1;
      state = 'block-comment';
      continue;
    }

    const tripleQuote = (python || language.toLocaleLowerCase('en') === 'java') &&
      (text.startsWith("'''", index) || text.startsWith('"""', index));
    if (tripleQuote || current === "'" || current === '"' || (supportsTemplateStrings && current === '`')) {
      quote = tripleQuote ? text.slice(index, index + 3) : current;
      index += quote.length - 1;
      state = 'string';
    }
  }

  return output.join('');
}

export function gradeAnswer(exercise, response) {
  switch (exercise.type) {
    case 'choice':
      return String(response ?? '') === exercise.answer;
    case 'short-answer':
      return exercise.acceptedAnswers.some((answer) => exercise.answerNormalization === 'python-expression'
        ? normalizePythonExpression(response) === normalizePythonExpression(answer)
        : normalizeAnswer(response) === normalizeAnswer(answer));
    case 'locate-error': {
      const selected = Array.isArray(response) ? [...response].sort((a, b) => a - b) : [];
      const correct = [...exercise.answerLines].sort((a, b) => a - b);
      return selected.length === correct.length && selected.every((line, index) => line === correct[index]);
    }
    case 'repair-code': {
      if (typeof response !== 'string' || !Array.isArray(exercise.solutionPatterns) || exercise.solutionPatterns.length === 0) return false;
      const code = stripComments(response, exercise.language).trim();
      return exercise.solutionPatterns.some((pattern) => new RegExp(pattern).test(code));
    }
    case 'coding':
      return response === true || Boolean(response && response.passed === true);
    default:
      return false;
  }
}
