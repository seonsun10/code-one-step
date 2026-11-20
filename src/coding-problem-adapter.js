const languageLabels = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  postgresql: 'SQL · PostgreSQL',
  fastapi: 'FastAPI · Python',
  python: 'Python',
  java: 'Java',
  spring: 'Spring Boot',
  react: 'React',
};

export function toCodingExercise(problem) {
  if (!problem || problem.runtime?.status !== 'verified' || problem.grading?.mode !== 'runtime-output') {
    throw new Error('실행 검수를 통과한 문제만 코드 실행 화면에 연결할 수 있습니다.');
  }
  return {
    id: problem.id,
    type: 'coding',
    title: problem.title,
    language: languageLabels[problem.language] ?? problem.language,
    prompt: problem.statement,
    entryPoint: problem.contract.entryPoint,
    adapterId: problem.runtime.adapterId,
    database: problem.database,
    starterCode: problem.starterCode,
    acceptanceCriteria: {
      requirements: [...problem.requirements],
      constraints: [...problem.constraints],
    },
    tests: problem.grading.tests.map((item) => ({ input: item.input, expected: item.expected })),
    hint: problem.hints[0],
    explanation: problem.solution.explanation,
  };
}
