const levelNames = ['입문', '기초', '중급', '고급', '실전'];
const levelRules = [
  { threshold: 40, limit: 2 },
  { threshold: 50, limit: 3 },
  { threshold: 60, limit: 4 },
  { threshold: 70, limit: 5 },
  { threshold: 80, limit: 6, sinceDate: '2026-04-01' },
];

const scenarios = [
  { learners: [], attempts: [] },
  {
    learners: [[1, '민서', 'A'], [2, '준', 'A'], [3, '하린', 'B']],
    attempts: [[1, 1, 'sql', 90, true, '2026-01-03'], [2, 2, 'js', 70, true, '2026-01-02'], [3, 1, 'js', 70, false, '2026-01-01']],
  },
  {
    learners: [[1, '민서', 'A'], [2, '준', 'B'], [3, '하린', 'B'], [4, '도윤', 'A']],
    attempts: [[1, 1, 'sql', 80, true, '2026-02-01'], [2, 2, 'sql', 80, true, '2026-02-02'], [3, 3, 'web', 50, false, '2026-02-03'], [4, 1, 'web', 40, true, '2026-02-04'], [5, 4, 'sql', 70, true, '2026-02-05']],
  },
  {
    learners: [[1, '서윤', 'C'], [2, '지호', 'A']],
    attempts: [[1, 1, 'db', -10, true, '2026-03-01'], [2, 1, 'db', 0, true, '2026-03-02'], [3, 2, 'sql', 100, true, '2026-03-03']],
  },
  {
    learners: [[1, '예린', 'A'], [2, '태오', 'A'], [3, '가은', 'C'], [4, '시우', 'B']],
    attempts: [[1, 1, 'sql', 100, true, '2026-04-01'], [2, 2, 'sql', 60, true, '2026-04-02'], [3, 3, 'api', 60, true, '2026-04-03'], [4, 4, 'api', 20, false, '2026-04-04'], [5, 1, 'api', 40, true, '2026-04-05']],
  },
  {
    learners: [[1, '유나', 'B'], [2, '건우', 'C'], [3, '채원', 'B'], [4, '은우', 'C']],
    attempts: [[1, 1, 'sql', 55, true, '2026-05-01'], [2, 2, 'sql', 75, false, '2026-05-02'], [3, 3, 'web', 85, true, '2026-05-03'], [4, 4, 'web', 95, true, '2026-05-04'], [5, 1, 'api', 65, true, '2026-05-05'], [6, 3, 'api', 65, false, '2026-05-06']],
  },
];

const database = {
  setup: `CREATE TABLE learners (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  cohort TEXT NOT NULL
);
CREATE TABLE attempts (
  id INTEGER PRIMARY KEY,
  learner_id INTEGER NOT NULL REFERENCES learners(id),
  topic TEXT NOT NULL,
  points INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  submitted_on DATE NOT NULL,
  review_note TEXT,
  bonus_points INTEGER
);
CREATE TABLE tags (
  name TEXT PRIMARY KEY
);
CREATE TABLE attempt_tags (
  attempt_id INTEGER NOT NULL REFERENCES attempts(id),
  tag_name TEXT NOT NULL REFERENCES tags(name),
  PRIMARY KEY (attempt_id, tag_name)
);`,
  reset: 'TRUNCATE attempt_tags, attempts, learners, tags;',
  description: 'learners(id, name, cohort), attempts(id, learner_id, topic, points, active, submitted_on, review_note, bonus_points), tags(name), attempt_tags(attempt_id, tag_name)를 사용합니다. attempt_tags는 복합 기본 키와 외래 키로 시도와 태그의 다대다 관계를 표현합니다. review_note와 bonus_points는 NULL일 수 있습니다. 사례마다 메모리 DB와 표를 초기화합니다.',
};

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function seedScenario(scenario) {
  const rows = [];
  if (scenario.learners.length) {
    rows.push(`INSERT INTO learners (id, name, cohort) VALUES ${scenario.learners
      .map(([id, name, cohort]) => `(${id}, ${sqlText(name)}, ${sqlText(cohort)})`).join(', ')};`);
  }
  if (scenario.attempts.length) {
    rows.push(`INSERT INTO attempts (id, learner_id, topic, points, active, submitted_on, review_note, bonus_points) VALUES ${scenario.attempts
      .map(([id, learnerId, topic, points, active, date]) => `(${id}, ${learnerId}, ${sqlText(topic)}, ${points}, ${active}, ${sqlText(date)}, ${id % 3 === 1 ? "'done'" : id % 3 === 2 ? 'NULL' : "''"}, ${id % 3 === 1 ? Math.floor(points / 10) : id % 3 === 2 ? 'NULL' : '0'})`).join(', ')};`);
    rows.push("INSERT INTO tags (name) VALUES ('기초'), ('복습'), ('경계'), ('미분류');");
    const mappings = scenario.attempts.flatMap(([id]) => [
      [id, id % 2 === 0 ? '복습' : '기초'],
      ...(id % 2 === 0 ? [[id, '경계']] : []),
    ]);
    rows.push(`INSERT INTO attempt_tags (attempt_id, tag_name) VALUES ${mappings
      .map(([attemptId, tag]) => `(${attemptId}, ${sqlText(tag)})`).join(', ')};`);
  }
  return rows.join('\n');
}

const tasks = [
  {
    id: 'filter-points', title: '점수 조건으로 행 고르기', topic: 'SELECT와 WHERE',
    query: ({ threshold, sinceDate }, level) => `SELECT id, points FROM attempts WHERE points >= ${threshold}${level >= 2 ? ` AND points <= ${threshold + 40}` : ''}${level >= 1 ? ' AND active = TRUE' : ''}${level >= 4 ? ` AND submitted_on >= '${sinceDate}'` : ''} ORDER BY id;`,
    expected: ({ attempts }, { threshold }, level) => attempts
      .filter(([, , , points, active, submittedOn]) => points >= threshold && (level < 2 || points <= threshold + 40) && (level < 1 || active) && (level < 4 || submittedOn >= levelRules[level].sinceDate))
      .sort(([left], [right]) => left - right).map(([id, , , points]) => ({ id, points })),
    intent: '점수 하한을 포함하는 비교 조건을 사용하고 필요한 행만 남깁니다.',
  },
  {
    id: 'top-scores', title: '정렬 기준을 고정해 상위 행 고르기', topic: '정렬과 LIMIT',
    query: ({ threshold, limit }, level) => level >= 4
      ? `WITH best_per_topic AS (
  SELECT DISTINCT ON (topic) id, topic, points
  FROM attempts
  WHERE active = TRUE AND points >= ${threshold}
  ORDER BY topic, points DESC, id ASC
)
SELECT id, topic, points FROM best_per_topic ORDER BY points DESC, id ASC LIMIT ${limit};`
      : `SELECT id, topic, points FROM attempts${level >= 1 ? ` WHERE active = TRUE${level >= 2 ? ` AND points >= ${threshold}` : ''}` : ''} ORDER BY points DESC, id ASC LIMIT ${limit};`,
    expected: ({ attempts }, { threshold, limit }, level) => {
      const selected = attempts.filter(([, , , points, active]) => (level < 1 || active) && (level < 2 || points >= threshold));
      let ranked = selected;
      if (level >= 4) {
        const bestByTopic = new Map();
        for (const row of [...selected].sort((left, right) => left[2].localeCompare(right[2]) || right[3] - left[3] || left[0] - right[0])) {
          if (!bestByTopic.has(row[2])) bestByTopic.set(row[2], row);
        }
        ranked = [...bestByTopic.values()];
      }
      return ranked.sort((left, right) => right[3] - left[3] || left[0] - right[0]).slice(0, limit)
        .map(([id, , topic, points]) => ({ id, topic, points }));
    },
    intent: '점수 내림차순과 ID 오름차순으로 순서를 고정한 뒤 상위 결과를 고릅니다.',
  },
  {
    id: 'learner-totals', title: '학습자별 합계와 HAVING 적용', topic: '집계와 그룹',
    query: ({ threshold }, level) => `${level >= 2 ? `WITH selected_attempts AS (SELECT learner_id, points FROM attempts${level >= 1 ? ' WHERE active = TRUE' : ''})\n` : ''}SELECT learner_id, SUM(points)::INTEGER AS total_points FROM ${level >= 2 ? 'selected_attempts' : 'attempts'}${level === 1 ? ' WHERE active = TRUE' : ''} GROUP BY learner_id HAVING SUM(points) >= ${threshold}${level >= 4 ? ' AND COUNT(*) >= 2' : ''} ORDER BY total_points DESC, learner_id;`,
    expected: ({ attempts }, { threshold }, level) => {
      const totals = new Map();
      const counts = new Map();
      for (const [, learnerId, , points, active] of attempts) {
        if (level >= 1 && !active) continue;
        totals.set(learnerId, (totals.get(learnerId) ?? 0) + points);
        counts.set(learnerId, (counts.get(learnerId) ?? 0) + 1);
      }
      return [...totals].filter(([learnerId, total]) => total >= threshold && (level < 4 || counts.get(learnerId) >= 2))
        .sort((left, right) => right[1] - left[1] || left[0] - right[0])
        .map(([learner_id, total_points]) => ({ learner_id, total_points }));
    },
    intent: '학습자별 점수 합계를 계산하고 기준 미만인 그룹을 HAVING으로 제외합니다.',
  },
  {
    id: 'topic-counts', title: '주제별 고유 학습자 수 계산', topic: 'COUNT와 DISTINCT',
    query: (_, level) => {
      const countColumn = level >= 2 ? 'learner_count' : 'attempt_count';
      return `SELECT topic, COUNT(${level >= 2 ? 'DISTINCT learner_id' : '*'})::INTEGER AS ${countColumn} FROM attempts${level >= 1 ? ' WHERE active = TRUE' : ''} GROUP BY topic${level >= 4 ? ' HAVING COUNT(DISTINCT learner_id) >= 2' : ''} ORDER BY topic;`;
    },
    expected: ({ attempts }, _, level) => {
      const groups = new Map();
      for (const [, learnerId, topic, , active] of attempts) {
        if (level >= 1 && !active) continue;
        const learners = groups.get(topic) ?? new Set();
        learners.add(level >= 2 ? learnerId : Symbol());
        groups.set(topic, learners);
      }
      const countColumn = level >= 2 ? 'learner_count' : 'attempt_count';
      return [...groups].filter(([, learners]) => level < 4 || learners.size >= 2).sort(([left], [right]) => left.localeCompare(right))
        .map(([topic, learners]) => ({ topic, [countColumn]: learners.size }));
    },
    intent: '시도 행 수와 주제별 고유 학습자 수를 구분해 집계합니다.',
  },
  {
    id: 'learner-join', title: '외래 키로 학습자 정보 붙이기', topic: 'INNER JOIN',
    query: ({ threshold }, level) => `SELECT l.name${level >= 4 ? ', l.cohort' : ''}, a.topic, a.points FROM attempts AS a JOIN learners AS l ON l.id = a.learner_id WHERE a.points >= ${threshold}${level >= 1 ? ' AND a.active = TRUE' : ''}${level >= 2 ? " AND l.cohort <> 'C'" : ''} ORDER BY a.points DESC, a.id;`,
    expected: ({ learners, attempts }, { threshold }, level) => {
      const learnerById = new Map(learners.map(([id, name, cohort]) => [id, { name, cohort }]));
      return attempts.filter(([, , , points, active]) => points >= threshold && (level < 1 || active))
        .filter(([, learnerId]) => level < 2 || learnerById.get(learnerId)?.cohort !== 'C')
        .sort((left, right) => right[3] - left[3] || left[0] - right[0])
        .map(([, learnerId, topic, points]) => level >= 4
          ? { name: learnerById.get(learnerId).name, cohort: learnerById.get(learnerId).cohort, topic, points }
          : { name: learnerById.get(learnerId).name, topic, points });
    },
    intent: '외래 키 관계로 학습자 정보를 붙이고 조건에 맞는 시도만 반환합니다.',
  },
  {
    id: 'left-join-count', title: '활동이 없는 학습자도 남기기', topic: 'LEFT JOIN',
    query: ({ threshold }, level) => `SELECT l.id${level >= 4 ? ', l.cohort' : ''}, COUNT(a.id)::INTEGER AS attempt_count FROM learners AS l LEFT JOIN attempts AS a ON a.learner_id = l.id${level >= 1 ? ' AND a.active = TRUE' : ''}${level >= 2 ? ` AND a.points >= ${threshold}` : ''} GROUP BY l.id${level >= 4 ? ', l.cohort' : ''} ORDER BY l.id;`,
    expected: ({ learners, attempts }, { threshold }, level) => learners.map(([id, , cohort]) => ({
      id,
      ...(level >= 4 ? { cohort } : {}),
      attempt_count: attempts.filter(([, learnerId, , points, active]) => learnerId === id && (level < 1 || active) && (level < 2 || points >= threshold)).length,
    })),
    intent: 'LEFT JOIN 조건을 ON 절에 두어 일치 행이 없는 왼쪽 행도 보존합니다.',
  },
  {
    id: 'above-average', title: '스칼라 하위 질의와 평균 비교', topic: '하위 질의',
    query: ({ threshold }, level) => `SELECT id, points FROM attempts WHERE ${level >= 1 ? 'active = TRUE AND ' : ''}${level >= 2 ? `points >= ${threshold} AND ` : ''}points > (SELECT AVG(points) FROM attempts${level >= 1 ? ' WHERE active = TRUE' : ''})${level >= 4 ? ` AND points <= ${threshold + 20}` : ''} ORDER BY id;`,
    expected: ({ attempts }, { threshold }, level) => {
      const averageRows = attempts.filter(([, , , , active]) => level < 1 || active);
      const eligible = averageRows.filter(([, , , points]) => (level < 2 || points >= threshold) && (level < 4 || points <= threshold + 20));
      const values = averageRows.map(([, , , points]) => points);
      const average = values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
      return average === null ? [] : eligible.filter(([, , , points]) => points > average)
        .sort(([left], [right]) => left - right).map(([id, , , points]) => ({ id, points }));
    },
    intent: '한 행의 비교 기준으로 단일 값 결과를 반환하는 하위 질의를 사용합니다.',
  },
  {
    id: 'score-bands', title: 'CASE로 점수 구간 표시하기', topic: 'CASE 표현식',
    query: ({ threshold }, level) => `${level >= 2 ? `WITH selected_attempts AS (SELECT id, points${level >= 4 ? ', bonus_points' : ''} FROM attempts WHERE active = TRUE)\n` : ''}SELECT id, CASE ${level >= 4 ? "WHEN bonus_points IS NULL THEN 'unreviewed' " : ''}WHEN points >= ${threshold + 20} THEN 'high' WHEN points >= ${threshold} THEN 'middle' ELSE 'low' END AS band FROM ${level >= 2 ? 'selected_attempts' : 'attempts'}${level === 1 ? ' WHERE active = TRUE' : ''} ORDER BY id;`,
    expected: ({ attempts }, { threshold }, level) => attempts.filter(([, , , , active]) => level < 1 || active)
      .sort(([left], [right]) => left - right).map(([id, , , points]) => ({
        id,
        band: level >= 4 && id % 3 === 2
          ? 'unreviewed'
          : points >= threshold + 20 ? 'high' : points >= threshold ? 'middle' : 'low',
      })),
    intent: 'CASE의 조건 순서와 경계값에 맞춰 각 행을 명확한 구간으로 나눕니다.',
  },
  {
    id: 'cohort-totals', title: 'CTE와 조인으로 기수별 합계 만들기', topic: 'CTE와 통합 집계',
    query: ({ threshold }, level) => `WITH selected_totals AS (
  SELECT learner_id, SUM(points)::INTEGER AS total_points
  FROM attempts
  ${level >= 1 ? `WHERE active = TRUE${level >= 2 ? ` AND points >= ${threshold}` : ''}` : ''}
  GROUP BY learner_id
)
SELECT l.cohort, SUM(t.total_points)::INTEGER AS cohort_points
FROM learners AS l
JOIN selected_totals AS t ON t.learner_id = l.id
GROUP BY l.cohort
HAVING SUM(t.total_points) >= ${threshold}
${level >= 4 ? '  AND COUNT(DISTINCT l.id) >= 2\n' : ''}
ORDER BY cohort_points DESC, l.cohort;`,
    expected: ({ learners, attempts }, { threshold }, level) => {
      const learnerById = new Map(learners.map(([id, , cohort]) => [id, cohort]));
      const totals = new Map();
      for (const [, learnerId, , points, active] of attempts) {
        if ((level >= 1 && !active) || (level >= 2 && points < threshold)) continue;
        const cohort = learnerById.get(learnerId);
        totals.set(cohort, (totals.get(cohort) ?? 0) + points);
      }
      const learnerCounts = new Map();
      for (const [, learnerId, , points, active] of attempts) {
        if ((level >= 1 && !active) || (level >= 2 && points < threshold)) continue;
        const cohort = learnerById.get(learnerId);
        learnerCounts.set(cohort, (learnerCounts.get(cohort) ?? new Set()).add(learnerId));
      }
      return [...totals].filter(([cohort, total]) => total >= threshold && (level < 4 || learnerCounts.get(cohort)?.size >= 2))
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .map(([cohort, cohort_points]) => ({ cohort, cohort_points }));
    },
    intent: 'CTE로 계산 단계를 이름 붙이고 조인한 뒤 그룹 단위로 결과를 만듭니다.',
  },
  {
    id: 'topic-ranking', title: '주제별 점수 순위 매기기', topic: '윈도 함수',
    query: (_, level) => `SELECT id, topic, points, ${level >= 4 ? 'DENSE_RANK()' : level >= 2 ? 'RANK()' : 'ROW_NUMBER()'} OVER (PARTITION BY topic ORDER BY points DESC) AS place FROM attempts${level >= 1 ? ' WHERE active = TRUE' : ''} ORDER BY topic, points DESC, id;`,
    expected: ({ attempts }, _, level) => {
      const selected = attempts.filter(([, , , , active]) => level < 1 || active);
      const byTopic = new Map();
      for (const row of selected) {
        const group = byTopic.get(row[2]) ?? [];
        group.push(row);
        byTopic.set(row[2], group);
      }
      return [...byTopic].sort(([left], [right]) => left.localeCompare(right)).flatMap(([, group]) => {
        group.sort((left, right) => right[3] - left[3] || left[0] - right[0]);
        let competitionRank = 0;
        let denseRank = 0;
        let previousPoints;
        return group.map(([id, , topic, points], index) => {
          if (index === 0 || points !== previousPoints) {
            competitionRank = index + 1;
            denseRank += 1;
          }
          previousPoints = points;
          return {
            id,
            topic,
            points,
            place: level >= 4 ? denseRank : level >= 2 ? competitionRank : index + 1,
          };
        });
      });
    },
    intent: '윈도 함수의 PARTITION BY는 결과 행을 줄이지 않고 주제별 순위를 계산합니다.',
  },
];

const setup = database.setup;

function formatRows(rows) {
  if (!rows.length) return '결과 행이 없습니다.';
  return rows.map((row) => Object.entries(row).map(([key, value]) => `${key}=${value}`).join(', ')).join(' / ');
}

function reviewedTaskCopy(task, rules, level) {
  const { threshold, limit } = rules;
  const activeOnly = level >= 1;
  const rangeText = level >= 2 ? `${threshold}점 이상 ${threshold + 40}점 이하` : `${threshold}점 이상`;
  const pointsCondition = `points가 ${rangeText}${activeOnly ? '이며 active가 TRUE' : ''}`;

  switch (task.id) {
    case 'filter-points':
      return {
        objective: level >= 2
          ? '두 경계값을 모두 포함하는 점수 범위를 조건으로 작성합니다.'
          : '점수 하한을 포함하는 비교 조건을 작성합니다.',
        statement: `attempts에서 ${pointsCondition}인 행을 고르세요.${level >= 4 ? ` submitted_on이 ${rules.sinceDate} 당일 또는 그 이후인 행만 포함합니다.` : ''} id와 points 열만 반환하고 id 오름차순으로 정렬합니다.`,
        requirements: [
          level >= 2 ? `points는 ${threshold}점과 ${threshold + 40}점을 포함해 그 사이여야 합니다.` : `points가 ${threshold}점인 행도 포함합니다.`,
          ...(activeOnly ? ['active가 TRUE인 행만 남깁니다.'] : []),
          ...(level >= 4 ? [`submitted_on >= DATE '${rules.sinceDate}' 조건을 적용합니다.`] : []),
          'id, points 열을 이 순서로 반환하고 id 오름차순으로 정렬합니다.',
        ],
        hints: ['SELECT 목록에 id와 points를 지정하세요.', level >= 2 ? 'BETWEEN 또는 두 비교식을 AND로 묶어 양쪽 경계를 포함하세요.' : `points >= ${threshold}로 하한을 포함하세요.`, ...(activeOnly ? ['active = TRUE 조건도 WHERE에 결합하세요.'] : ['마지막에 ORDER BY id를 추가하세요.'])],
        commonMistakes: ['상한이나 하한을 제외하는 > 또는 < 연산자를 쓰는 실수', ...(activeOnly ? ['점수 조건만 넣고 active 조건을 빠뜨리는 실수'] : ['id 정렬을 생략해 결과 순서를 고정하지 않는 실수'])],
        solution: `점수 범위와 활성 여부${level >= 4 ? ', 제출 날짜' : ''}를 WHERE에서 검사합니다. ${level >= 2 ? `BETWEEN ${threshold} AND ${threshold + 40}은 양 끝을 포함합니다.` : `points >= ${threshold}는 기준 점수를 포함합니다.`}${level >= 4 ? ` 날짜 리터럴 DATE '${rules.sinceDate}'와 비교해 경계를 분명히 합니다.` : ''} 마지막으로 ORDER BY id가 반환 행의 순서를 고정합니다.`,
        explainExample: (rows) => `기준은 ${rangeText}이며 ${activeOnly ? '활성 행만' : '활성 여부와 무관하게'}${level >= 4 ? ` ${rules.sinceDate} 이후 제출된 행만` : ''} 남깁니다. 결과: ${formatRows(rows)}`,
        sources: ['https://www.postgresql.org/docs/18/sql-select.html', 'https://www.postgresql.org/docs/18/functions-comparison.html'],
      };
    case 'top-scores':
      return {
        objective: level >= 2
          ? '조건을 먼저 적용한 뒤 결정적인 정렬과 LIMIT으로 상위 행을 선택합니다.'
          : '내림차순과 보조 정렬을 사용해 상위 행의 순서를 고정합니다.',
        statement: `attempts에서 ${activeOnly ? 'active가 TRUE이고 ' : ''}${level >= 2 ? `points가 ${threshold}점 이상인 행만 대상으로 ` : ''}${level >= 4 ? 'topic마다 점수가 가장 높은 행을 하나씩 남긴 뒤 그 후보 중 ' : ''}점수가 높은 순서로 최대 ${limit}개를 고르세요. 동점은 id가 작은 행을 먼저 두고 id, topic, points를 반환합니다.`,
        requirements: [
          ...(activeOnly ? ['active가 TRUE인 행만 대상으로 합니다.'] : []),
          ...(level >= 2 ? [`points가 ${threshold}점 미만인 행은 제외합니다.`] : []),
          ...(level >= 4 ? ['topic별 최고 점수를 고른 뒤 전체 상위 결과를 선택합니다. 같은 topic 최고점이 여러 개면 id가 작은 행 하나만 남깁니다.'] : []),
          'points 내림차순, id 오름차순으로 정렬한 뒤 LIMIT을 적용합니다.',
          'id, topic, points 열을 이 순서로 반환합니다.',
        ],
        hints: ['필요한 세 열을 SELECT에 적으세요.', 'WHERE 조건을 정렬보다 먼저 적용하세요.', ...(level >= 4 ? ['DISTINCT ON (topic)과 ORDER BY topic, points DESC, id ASC로 주제별 대표 행을 정하세요.'] : []), `ORDER BY points DESC, id ASC LIMIT ${limit} 순으로 작성하세요.`],
        commonMistakes: ['LIMIT 전에 정렬하지 않아 상위 행이 달라지는 실수', '점수가 같은 행을 id 오름차순으로 고정하지 않는 실수', ...(level >= 2 ? ['최소 점수 조건을 빠뜨리는 실수'] : []), ...(level >= 4 ? ['주제별 최고 행을 고르기 전에 전체 LIMIT부터 적용하는 실수'] : [])],
        solution: `먼저 ${[activeOnly && 'active = TRUE', level >= 2 && `points >= ${threshold}`].filter(Boolean).join(' 및 ') || '모든 행'}을 남깁니다. ${level >= 4 ? 'DISTINCT ON (topic)을 사용해 각 주제에서 points DESC, id ASC 기준 첫 행을 선택합니다. 그 결과를 다시 전체 점수 내림차순·id 오름차순으로 정렬하고 ' : ''}ORDER BY points DESC, id ASC로 동점까지 순서를 고정한 뒤 LIMIT ${limit}을 적용합니다.`,
        explainExample: (rows) => `${[activeOnly && '활성 행', level >= 2 && `${threshold}점 이상`].filter(Boolean).length ? `먼저 ${[activeOnly && '활성 행', level >= 2 && `${threshold}점 이상`].filter(Boolean).join('·')} 조건을 적용합니다. ` : '별도 필터 없이 전체 행을 대상으로 합니다. '}${level >= 4 ? 'topic마다 최고 행 하나를 남긴 뒤 ' : ''}점수 내림차순·id 오름차순으로 정렬해 앞 ${limit}개를 선택합니다. 결과: ${formatRows(rows)}`,
        sources: ['https://www.postgresql.org/docs/18/queries-order.html', 'https://www.postgresql.org/docs/18/queries-limit.html'],
      };
    case 'learner-totals':
      return {
        objective: level >= 2
          ? 'CTE로 대상 행을 이름 붙이고 그룹 집계와 HAVING 조건을 적용합니다.'
          : '학습자별 합계와 행 필터·그룹 필터를 구분합니다.',
        statement: `attempts의 점수를 learner_id별로 합산하세요. ${activeOnly ? 'active가 TRUE인 기록만 합산하고 ' : ''}합계가 ${threshold}점 이상인 학습자만 남기며${level >= 4 ? ' 집계에 사용된 활성 기록이 2건 이상인 학습자만 반환하고' : ''}, 합계 내림차순·learner_id 오름차순으로 정렬합니다.${level >= 2 ? ' 대상 기록은 selected_attempts CTE에서 먼저 선택하세요.' : ''}`,
        requirements: [
          ...(activeOnly ? ['active가 TRUE인 기록만 합산합니다.'] : []),
          'learner_id별 SUM(points)를 total_points 열로 반환합니다.',
          `합계가 ${threshold}점인 그룹도 포함하고 미만 그룹은 제외합니다.`,
          'total_points 내림차순, learner_id 오름차순으로 정렬합니다.',
          ...(level >= 2 ? ['selected_attempts CTE에서 집계 대상 행을 준비합니다.'] : []),
          ...(level >= 4 ? ['COUNT(*) >= 2 조건으로 학습자별 활성 시도 횟수도 HAVING에서 확인합니다.'] : []),
        ],
        hints: ['합산할 행의 조건은 GROUP BY 전 단계에 적용하세요.', 'learner_id로 그룹을 만들고 SUM(points)를 계산하세요.', `그룹 합계 ${threshold} 이상 조건은 HAVING에 두세요.`],
        commonMistakes: ['집계 전 행 조건을 HAVING에 두거나 합계 조건을 WHERE에 두는 실수', 'GROUP BY에 learner_id를 빠뜨리거나 동점 정렬을 생략하는 실수'],
        solution: `${level >= 2 ? 'selected_attempts CTE에서 활성 기록을 먼저 선택합니다. ' : activeOnly ? 'WHERE active = TRUE로 집계 대상을 먼저 제한합니다. ' : ''}GROUP BY learner_id와 SUM(points)로 합계를 계산하고, HAVING SUM(points) >= ${threshold}${level >= 4 ? ' AND COUNT(*) >= 2' : ''}로 그룹을 거릅니다. 최종 정렬은 합계 내림차순과 학습자 ID 오름차순입니다.`,
        explainExample: (rows) => `${activeOnly ? '활성 기록만' : '모든 기록을'} 학습자별로 합산하고 ${threshold}점 미만${level >= 4 ? ' 또는 활성 시도 2건 미만' : ''}인 그룹은 제외했습니다. 합계 내림차순 결과: ${rows.length ? rows.map((row) => `learner_id ${row.learner_id}: ${row.total_points}점`).join(' / ') : '조건을 만족하는 그룹이 없습니다.'}`,
        sources: ['https://www.postgresql.org/docs/18/sql-select.html', 'https://www.postgresql.org/docs/18/functions-aggregate.html', 'https://www.postgresql.org/docs/18/queries-with.html'],
      };
    case 'topic-counts':
      const countColumn = level >= 2 ? 'learner_count' : 'attempt_count';
      return {
        objective: level >= 2
          ? '활성 기록에서 주제별 고유 학습자 수를 계산합니다.'
          : '주제별 전체 또는 활성 기록 수를 GROUP BY로 계산합니다.',
        statement: `attempts를 topic별로 묶어 ${level >= 2 ? '활성 기록을 제출한 서로 다른 학습자 수' : `${activeOnly ? '활성 ' : ''}시도 행 수`}를 계산하세요.${level >= 4 ? ' 고유 학습자가 2명 이상인 주제만 남깁니다.' : ''} topic과 ${countColumn}를 반환하고 topic 오름차순으로 정렬합니다.`,
        requirements: [
          ...(activeOnly ? ['active가 TRUE인 기록만 집계합니다.'] : []),
          level >= 2 ? '같은 학습자의 반복 기록은 한 명으로 셉니다.' : '기록 한 행을 시도 한 건으로 셉니다.',
          `topic별로 그룹을 만들고 ${countColumn}를 정수로 반환합니다.`,
          'topic 오름차순으로 정렬합니다.',
          ...(level >= 4 ? ['HAVING COUNT(DISTINCT learner_id) >= 2 조건을 적용합니다.'] : []),
        ],
        hints: ['topic을 SELECT와 GROUP BY에 사용하세요.', level >= 2 ? 'COUNT(DISTINCT learner_id)는 같은 학습자의 중복 기록을 한 번만 셉니다.' : '기록 행 수는 COUNT(*)로 셉니다.', ...(activeOnly ? ['active = TRUE 조건을 집계 전에 적용하세요.'] : ['마지막에 ORDER BY topic을 추가하세요.'])],
        commonMistakes: ['고유 학습자 수와 시도 행 수를 혼동하는 실수', ...(activeOnly ? ['비활성 기록을 WHERE에서 제외하지 않는 실수'] : ['GROUP BY topic을 생략하는 실수'])],
        solution: `${activeOnly ? 'WHERE active = TRUE로 대상 기록을 먼저 고릅니다. ' : ''}${level >= 2 ? 'COUNT(DISTINCT learner_id)는 한 주제에서 반복 시도한 같은 학습자를 한 번만 셉니다.' : 'COUNT(*)는 조건을 만족하는 시도 행을 셉니다.'}GROUP BY topic으로 주제별 결과를 만들고 ${countColumn} 열에 담아 topic 오름차순으로 정렬합니다.`,
        explainExample: (rows) => `${activeOnly ? '활성 기록만 ' : ''}${level >= 2 ? '주제별 서로 다른 학습자 수' : '주제별 시도 행 수'}를 계산했습니다. 결과: ${rows.length ? rows.map((row) => `${row.topic}=${row[countColumn]}${level >= 2 ? '명' : '건'}`).join(' / ') : '결과 행이 없습니다.'}`,
        sources: ['https://www.postgresql.org/docs/18/sql-select.html', 'https://www.postgresql.org/docs/18/functions-aggregate.html'],
      };
    case 'learner-join':
      const joinPointsCondition = `points가 ${threshold}점 이상${activeOnly ? '이고 active가 TRUE인' : ''}`;
      return {
        objective: level >= 2
          ? '외래 키로 조인하고 행 필터와 학습자 속성 필터를 결합합니다.'
          : '외래 키를 기준으로 attempts에 학습자 이름을 연결합니다.',
        statement: `attempts와 learners를 learner_id = id로 연결하고 ${joinPointsCondition}${level >= 2 ? ' cohort가 C가 아닌 학습자의' : ' 학습자의'} 시도를 반환하세요. 결과 열은 name${level >= 4 ? ', cohort' : ''}, topic, points이며 점수 내림차순·시도 id 오름차순입니다.`,
        requirements: [
          'attempts.learner_id와 learners.id를 연결하는 INNER JOIN을 사용합니다.',
          `points가 ${threshold}점 이상인 행을 포함합니다.`,
          ...(activeOnly ? ['active가 TRUE인 시도만 포함합니다.'] : []),
          ...(level >= 2 ? ["learners.cohort가 'C'인 학습자는 제외합니다."] : []),
          ...(level >= 4 ? ['학습자의 cohort 열도 반환합니다.'] : []),
          '점수 내림차순, attempts.id 오름차순으로 정렬합니다.',
        ],
        hints: ['두 테이블에 별칭을 붙이면 열 출처를 분명히 쓸 수 있습니다.', 'JOIN의 ON에는 learners.id = attempts.learner_id를 놓으세요.', '행 조건은 WHERE에 두고 점수와 id를 기준으로 정렬하세요.'],
        commonMistakes: ['JOIN 조건을 빠뜨려 모든 조합(카티션 곱)을 만드는 실수', ...(level >= 2 ? ["cohort <> 'C' 조건을 빠뜨리는 실수"] : ['점수 내림차순과 동점 시도 ID 오름차순을 지키지 않는 실수'])],
        solution: `attempts를 learners와 learner_id = id로 연결해 이름을 가져옵니다. ${[activeOnly && 'active = TRUE', `points >= ${threshold}`, level >= 2 && "cohort <> 'C'"].filter(Boolean).join(' 및 ')} 조건을 적용한 뒤 점수 내림차순, 시도 id 오름차순으로 고정합니다.`,
        explainExample: (rows) => `외래 키가 가리키는 학습자를 연결하고 ${[activeOnly && '활성', `${threshold}점 이상`, level >= 2 && 'C 기수 제외'].filter(Boolean).join('·')} 조건을 적용했습니다. 결과: ${formatRows(rows)}`,
        sources: ['https://www.postgresql.org/docs/18/queries-table-expressions.html', 'https://www.postgresql.org/docs/18/ddl-constraints.html'],
      };
    case 'left-join-count':
      return {
        objective: '모든 학습자를 보존하면서 LEFT JOIN으로 연결된 기록 수를 셉니다.',
        statement: `learners의 모든 학습자를 반환하고 attempts 기록 수를 세세요. ${activeOnly ? 'active가 TRUE인 기록만 ' : ''}${level >= 2 ? `points가 ${threshold}점 이상인 기록만 ` : ''}세되, 조건에 맞는 기록이 없는 학습자도 결과에 남아야 합니다. id${level >= 4 ? '와 cohort' : ''}, attempt_count를 반환하고 id 오름차순으로 정렬합니다.`,
        requirements: [
          '왼쪽 표는 learners이며 모든 학습자를 보존합니다.',
          'attempts.learner_id와 learners.id를 LEFT JOIN으로 연결합니다.',
          ...(activeOnly ? ['active 조건을 조인의 ON 절에 둡니다.'] : []),
          ...(level >= 2 ? [`points >= ${threshold} 조건도 ON 절에 둡니다.`] : []),
          'COUNT(a.id)를 attempt_count로 반환하고 id로 정렬합니다.',
          ...(level >= 4 ? ['cohort 열도 반환하고 GROUP BY에 포함합니다.'] : []),
        ],
        hints: ['LEFT JOIN은 오른쪽 행이 없어도 왼쪽 행을 남깁니다.', activeOnly ? 'attempts의 조건을 WHERE가 아니라 ON에 추가하세요.' : '학습자와 시도를 id로 연결하세요.', 'COUNT(*)는 미일치 왼쪽 행을 1건으로 셀 수 있으니 오른쪽 키를 세세요.'],
        commonMistakes: ['오른쪽 표 조건을 WHERE에 둬 미일치 학습자가 결과에서 사라지는 실수', 'COUNT(*)로 조인 실패 행까지 시도 1건으로 세는 실수'],
        solution: `learners를 왼쪽에 두고 attempts를 LEFT JOIN합니다. ${[activeOnly && 'active = TRUE', level >= 2 && `points >= ${threshold}`].filter(Boolean).join(' 및 ') || '추가 기록 조건 없음'}은 ON에 둬도 일치하지 않는 학습자가 보존됩니다. COUNT(a.id)는 실제 연결된 시도만 셉니다.`,
        explainExample: (rows) => `학습자 행은 모두 유지하고 ${[activeOnly && '활성', level >= 2 && `${threshold}점 이상`].filter(Boolean).join('·') || '모든'} 시도만 연결해 셌습니다. 결과: ${rows.map((row) => `id=${row.id}, 시도 ${row.attempt_count}건`).join(' / ')}`,
        sources: ['https://www.postgresql.org/docs/18/queries-table-expressions.html', 'https://www.postgresql.org/docs/18/functions-aggregate.html'],
      };
    case 'above-average':
      return {
        objective: level >= 2 ? '평균 기준 하위 질의와 별도의 최소 점수 조건을 결합합니다.' : '스칼라 하위 질의의 평균과 각 기록의 점수를 비교합니다.',
        statement: `각 기록의 points가 ${activeOnly ? '활성 기록의' : '전체 기록의'} 평균보다 큰 행을 반환하세요.${level >= 2 ? ` 단, 반환 후보는 ${threshold}점 이상이어야 합니다. 평균 기준 자체는 모든 활성 기록으로 계산합니다.` : ''}${level >= 4 ? ` 반환 후보는 ${threshold + 20}점 이하이기도 해야 합니다.` : ''} id와 points를 반환하고 id 오름차순으로 정렬합니다.`,
        requirements: [
          ...(activeOnly ? ['비교 기준 평균은 active = TRUE인 모든 기록에서 계산합니다.'] : ['비교 기준 평균은 모든 attempts 행에서 계산합니다.']),
          ...(activeOnly ? ['반환 결과도 active가 TRUE인 행으로 제한합니다.'] : []),
          ...(level >= 2 ? [`반환 후보는 points >= ${threshold}여야 합니다.`] : []),
          ...(level >= 4 ? [`반환 후보는 points <= ${threshold + 20} 조건도 만족해야 합니다. 이 상한은 평균 계산 모집단을 바꾸지 않습니다.`] : []),
          '행 점수가 평균보다 큰 경우만 id, points로 반환합니다.',
        ],
        hints: ['AVG(points)는 하나의 비교 기준 값을 만드는 집계입니다.', '평균을 괄호 안 스칼라 하위 질의로 작성하세요.', ...(activeOnly ? ['평균을 계산할 표와 바깥 결과 모두에 활성 조건을 적용하세요.'] : ['points > (하위 질의 결과)로 비교하세요.'])],
        commonMistakes: ['평균이 아니라 전체 합계를 기준으로 비교하는 실수', ...(level >= 2 ? ['최소 점수 조건까지 평균 계산 대상에 넣어 기준을 바꾸는 실수'] : ['평균과 같은 점수까지 결과에 포함하는 실수'])],
        solution: `괄호 안 AVG 질의는 ${activeOnly ? '모든 활성 행' : '전체 행'}의 평균을 계산합니다. 바깥 질의는 ${[activeOnly && '활성 행', level >= 2 && `${threshold}점 이상`, level >= 4 && `${threshold + 20}점 이하`].filter(Boolean).join('·') || '모든 행'} 중 points가 그 평균보다 큰 행만 반환합니다.`,
        explainExample: (rows) => `평균은 ${activeOnly ? '활성 기록 전체' : '전체 기록'}로 계산${level >= 2 ? `하고 반환 후보는 ${threshold}점 이상으로 제한` : ''}${level >= 4 ? `한 뒤 ${threshold + 20}점 이하의 상한도 적용` : ''}했습니다. 평균을 초과한 결과: ${formatRows(rows)}`,
        sources: ['https://www.postgresql.org/docs/18/functions-subquery.html', 'https://www.postgresql.org/docs/18/functions-aggregate.html'],
      };
    case 'score-bands':
      return {
        objective: 'CASE 조건을 위에서부터 평가해 각 점수를 하나의 구간으로 분류합니다.',
        statement: `각 attempts 행을 ${level >= 4 ? "bonus_points가 NULL이면 unreviewed, 그 외에는 " : ''}high(점수 ${threshold + 20}점 이상), middle(${threshold}점 이상 ${threshold + 20}점 미만), low(${threshold}점 미만)로 분류하세요. ${activeOnly ? 'active가 TRUE인 행만 ' : ''}id와 band를 반환하고 id 오름차순으로 정렬합니다.${level >= 2 ? ' 활성 행은 selected_attempts CTE에서 선택하세요.' : ''}`,
        requirements: [
          ...(activeOnly ? ['active = TRUE인 행만 분류합니다.'] : []),
          `high 조건을 ${threshold + 20}점 이상으로 둡니다.`,
          `middle은 ${threshold}점 이상 ${threshold + 20}점 미만이며, 나머지는 low입니다.`,
          ...(level >= 2 ? ['selected_attempts CTE에서 id와 points를 준비합니다.'] : []),
          ...(level >= 4 ? ['bonus_points IS NULL 조건을 점수 구간보다 먼저 검사해 unreviewed로 분류합니다. CTE에 bonus_points도 포함합니다.'] : []),
          'id, band 열을 반환하고 id 오름차순으로 정렬합니다.',
        ],
        hints: ['높은 점수 조건을 CASE의 먼저 오는 WHEN에 놓으세요.', '경계 점수는 상한·하한 조건에서 한 번만 포함되게 하세요.', ...(activeOnly ? ['활성 행 조건을 적용한 다음 CASE를 평가하세요.'] : ['ELSE는 하한보다 작은 나머지 점수를 처리합니다.'])],
        commonMistakes: ['중첩되는 CASE 조건에서 넓은 범위를 먼저 검사해 상위 구간을 가리는 실수', '경계 점수를 두 구간에 모두 넣거나 어느 구간에서도 빼는 실수'],
        solution: `CASE는 조건을 순서대로 확인하므로 ${level >= 4 ? 'bonus_points IS NULL을 먼저 검사해 unreviewed로 표시합니다. 그 외 행은 ' : ''}${threshold + 20}점 이상을 먼저 high로 분류합니다. 다음 ${threshold}점 이상은 middle, ELSE는 low입니다. ${level >= 2 ? 'selected_attempts CTE에서 활성 기록을 먼저 준비합니다. ' : activeOnly ? '활성 행만 먼저 남깁니다. ' : ''}id 순서로 결과를 정렬합니다.`,
        explainExample: (rows) => `${activeOnly ? '활성 행만 분류하고 ' : ''}${level >= 4 ? '보너스 점수가 NULL인 미검토 행은 unreviewed로 표시한 뒤 나머지를 ' : ''}점수 ${threshold + 20} 이상은 high, ${threshold} 이상은 middle, 그 미만은 low입니다. 결과: ${formatRows(rows)}`,
        sources: ['https://www.postgresql.org/docs/18/functions-conditional.html', 'https://www.postgresql.org/docs/18/sql-select.html'],
      };
    case 'cohort-totals':
      return {
        objective: 'CTE에서 학습자별 합계를 계산한 뒤 learners에 연결해 기수별 합계를 만듭니다.',
        statement: `학습자별 점수 합계를 selected_totals CTE에서 계산하고 learners와 연결해 cohort별 합계를 구하세요. ${activeOnly ? '활성 기록만 ' : ''}${level >= 2 ? `각 기록은 ${threshold}점 이상이어야 하며 ` : ''}기수 합계가 ${threshold}점 이상인 그룹만 반환합니다.${level >= 4 ? ' 포함된 학습자가 2명 이상인 기수만 남깁니다.' : ''} cohort_points 내림차순, cohort 오름차순으로 정렬합니다.`,
        requirements: [
          ...(activeOnly ? ['active = TRUE 기록만 학습자별 합계에 포함합니다.'] : []),
          ...(level >= 2 ? [`points >= ${threshold} 조건은 학습자 합계를 계산하기 전에 적용합니다.`] : []),
          'selected_totals에서 learner_id별 SUM(points)를 계산합니다.',
          'learners를 연결해 cohort별 합계를 SUM으로 계산합니다.',
          `기수 합계가 ${threshold}점인 그룹도 포함합니다.`,
          ...(level >= 4 ? ['COUNT(DISTINCT l.id) >= 2로 서로 다른 학습자가 두 명 이상인지 HAVING에서 확인합니다.'] : []),
        ],
        hints: ['selected_totals CTE에서 학습자별 합계 표를 먼저 만드세요.', 'learner_id로 learners를 연결한 뒤 cohort로 다시 그룹화하세요.', '최종 기수 합계 기준은 HAVING에 놓으세요.'],
        commonMistakes: ['기록별 점수 하한과 최종 기수 합계 하한을 혼동하는 실수', '학습자별 합계 없이 원시 기록을 바로 합산해 특정 관계에서 점수를 중복시키는 실수'],
        solution: `selected_totals CTE에서 ${[activeOnly && '활성', level >= 2 && `${threshold}점 이상`].filter(Boolean).join('·') || '전체'} 기록을 learner_id별로 합산합니다. learners와 연결해 cohort로 그룹화하고 HAVING으로 기수 합계 ${threshold}점 이상만 남깁니다.`,
        explainExample: (rows) => `${[activeOnly && '활성', level >= 2 && `${threshold}점 이상`].filter(Boolean).join('·') || '전체'} 기록을 학습자별로 합친 뒤 기수별로 다시 합산했습니다. 결과: ${rows.map((row) => `${row.cohort} 기수=${row.cohort_points}점`).join(' / ') || '조건을 만족하는 기수가 없습니다.'}`,
        sources: ['https://www.postgresql.org/docs/18/queries-with.html', 'https://www.postgresql.org/docs/18/sql-select.html', 'https://www.postgresql.org/docs/18/functions-aggregate.html'],
      };
    case 'topic-ranking':
      const rankingFunction = level >= 4 ? 'DENSE_RANK' : level >= 2 ? 'RANK' : 'ROW_NUMBER';
      return {
        objective: level >= 4
          ? 'DENSE_RANK로 동점 순위를 유지하면서 다음 순위를 건너뛰지 않습니다.'
          : level >= 2
            ? 'RANK로 같은 점수에 같은 순위를 주고 다음 순위 번호를 건너뜁니다.'
            : 'ROW_NUMBER로 주제마다 점수순 고유 번호를 붙이고 원래 행을 유지합니다.',
        statement: `attempts의 점수를 topic별로 순위를 매기세요. ${activeOnly ? 'active가 TRUE인 행만 순위에 포함하고 ' : ''}${rankingFunction}()를 place로 반환합니다. ${level >= 4 ? '동점은 같은 순위를 받고 다음 순위는 건너뛰지 않습니다.' : level >= 2 ? '동점은 같은 순위를 받고 다음 순위 번호는 동점 수만큼 건너뜁니다.' : '동점도 각각 다른 연속 번호를 받습니다.'} 최종 출력은 topic·points 내림차순·id 오름차순입니다.`,
        requirements: [
          ...(activeOnly ? ['active = TRUE 행만 윈도 계산에 포함합니다.'] : []),
          'PARTITION BY topic으로 주제마다 순위를 다시 시작합니다.',
          ...(level >= 4 ? ['같은 점수는 같은 DENSE_RANK를 받고, 다음 점수는 바로 다음 순위입니다.'] : level >= 2 ? ['같은 점수는 같은 RANK를 받고, 다음 순위는 행 수만큼 건너뜁니다.'] : ['ROW_NUMBER()는 동점 행에도 서로 다른 연속 순번을 부여합니다.']),
          '윈도 계산은 결과 행을 그룹 하나로 줄이지 않습니다.',
          '최종 결과는 topic, points 내림차순, id 오름차순입니다.',
        ],
        hints: [`${rankingFunction}() 뒤에 OVER (...)를 작성하세요.`, '주제별 분할에는 PARTITION BY topic을 사용하세요.', '윈도 정렬과 최종 결과 정렬은 별개입니다.'],
        commonMistakes: ['GROUP BY로 시도 행을 합쳐 원래 행을 잃는 실수', level >= 4 ? 'RANK와 DENSE_RANK의 동점 다음 순위 차이를 혼동하는 실수' : level >= 2 ? '같은 점수의 행을 윈도 ORDER BY에 id까지 넣어 동점으로 인식하지 못하는 실수' : 'OVER 절의 정렬이 최종 출력 순서도 보장한다고 생각하는 실수'],
        solution: `${rankingFunction}() OVER (PARTITION BY topic ORDER BY points DESC)는 주제마다 점수 순위를 계산합니다. ${level >= 4 ? 'DENSE_RANK는 동점 다음 번호를 건너뛰지 않습니다.' : level >= 2 ? 'RANK는 동점 다음 번호를 동점 행 수만큼 건너뜁니다.' : 'ROW_NUMBER는 동점에도 서로 다른 연속 번호를 줍니다.'} 윈도 함수는 원래 행을 유지하므로 최종 ORDER BY도 별도로 지정합니다.${activeOnly ? ' 활성 기록만 순위에 포함합니다.' : ''}`,
        explainExample: (rows) => `${activeOnly ? '활성 행만 ' : ''}topic별 점수 순위를 ${rankingFunction} 규칙으로 매겼습니다. 결과: ${rows.map((row) => `${row.topic} id=${row.id} ${row.points}점→${row.place}위`).join(' / ') || '결과 행이 없습니다.'}`,
        sources: ['https://www.postgresql.org/docs/18/functions-window.html', 'https://www.postgresql.org/docs/18/sql-select.html'],
      };
    default:
      return null;
  }
}

const officialSourceTitles = {
  'https://www.postgresql.org/docs/18/sql-select.html': 'PostgreSQL 18 공식 SELECT 문서',
  'https://www.postgresql.org/docs/18/functions-comparison.html': 'PostgreSQL 18 공식 비교 함수 문서',
  'https://www.postgresql.org/docs/18/queries-order.html': 'PostgreSQL 18 공식 정렬 문서',
  'https://www.postgresql.org/docs/18/queries-limit.html': 'PostgreSQL 18 공식 LIMIT 문서',
  'https://www.postgresql.org/docs/18/functions-aggregate.html': 'PostgreSQL 18 공식 집계 함수 문서',
  'https://www.postgresql.org/docs/18/queries-with.html': 'PostgreSQL 18 공식 WITH 질의 문서',
  'https://www.postgresql.org/docs/18/queries-table-expressions.html': 'PostgreSQL 18 공식 테이블 식과 JOIN 문서',
  'https://www.postgresql.org/docs/18/ddl-constraints.html': 'PostgreSQL 18 공식 제약 조건 문서',
  'https://www.postgresql.org/docs/18/functions-subquery.html': 'PostgreSQL 18 공식 하위 질의 문서',
  'https://www.postgresql.org/docs/18/functions-conditional.html': 'PostgreSQL 18 공식 조건식 문서',
  'https://www.postgresql.org/docs/18/functions-window.html': 'PostgreSQL 18 공식 윈도 함수 문서',
};

function defineProblem(task, level, taskIndex) {
  const rules = levelRules[level];
  const cases = scenarios.map((scenario) => ({
    input: seedScenario(scenario),
    expected: task.expected(scenario, rules, level),
  }));
  const levelName = levelNames[level];
  const sql = task.query(rules, level);
  const prior = level * tasks.length + taskIndex;
  const reviewDate = level >= 3 || (level === 2 && taskIndex >= 5) || (task.id === 'topic-counts' && level < 2)
    ? '2026-10-23'
    : '2026-10-16';
  const copy = reviewedTaskCopy(task, rules, level);
  const exampleCases = task.id === 'topic-ranking' && level >= 4
    ? [cases[2], cases[3], cases[4]]
    : level >= 4 ? cases.slice(3, 6) : cases.slice(1, 4);
  return {
    id: `postgresql-${task.id}-${String(level + 1).padStart(2, '0')}`,
    title: `${levelName} · ${task.id === 'topic-counts' && level < 2 ? '주제별 기록 수 세기' : task.title}`,
    language: 'postgresql',
    framework: 'PostgreSQL',
    versionContext: '기준 문서는 PostgreSQL 18.6, PostgreSQL 19 RC 1(2026-10-15)은 정식 배포 전 후보, 실행기는 PGlite 0.5.8 / PostgreSQL 18.3',
    level: levelName,
    topicIds: [`postgresql-phase-${level + 1}`],
    prerequisiteIds: prior ? [`postgresql-${tasks[prior === 0 ? 0 : (prior - 1) % tasks.length].id}-${String(Math.floor((prior - 1) / tasks.length) + 1).padStart(2, '0')}`] : [],
    estimatedMinutes: [10, 15, 20, 25, 30][level],
    objective: copy?.objective ?? task.intent,
    statement: copy?.statement ?? `테이블 구조와 각 테스트 입력을 이용해 요구된 행만 반환하는 PostgreSQL 질의를 작성하세요. ${task.intent} 반환 행과 열 이름은 예제에 맞추고 필요한 정렬 순서를 유지합니다.`,
    requirements: copy?.requirements ?? [task.intent, '예제의 열 이름과 행 순서를 지킵니다.'],
    constraints: [
      'PostgreSQL SELECT 또는 WITH ... SELECT 한 문장을 작성합니다.',
      '각 테스트의 표와 입력 행은 실행기가 준비합니다. 답안에는 데이터를 넣지 말고 읽기 전용 질의만 작성합니다.',
      '각 테스트는 초기화한 메모리 DB에서 읽기 전용 트랜잭션으로 실행합니다.',
    ],
    contract: {
      kind: 'sql',
      inputDescription: '테스트마다 learners와 attempts에 입력 데이터가 채워집니다.',
      outputDescription: '정렬한 PostgreSQL 결과 행 배열을 반환합니다.',
    },
    database,
    examples: exampleCases.map((test, index) => ({
      input: test.input,
      expected: test.expected,
      explanation: copy?.explainExample(test.expected) ?? `예제 ${index + 1}: 새 메모리 데이터에서 같은 질의를 실행한 결과입니다.`,
    })),
    starterCode: `-- ${copy?.objective ?? task.intent}\n-- TODO: 위 조건을 만족하는 SELECT 또는 WITH ... SELECT 질의를 작성하세요.`,
    runtime: { status: 'verified', mode: 'sql-query', adapterId: 'postgresql-query-v1' },
    grading: { mode: 'runtime-output', comparison: 'deep-value', tests: cases },
    hints: copy?.hints ?? [
      '요구된 출력 열과 행 기준을 먼저 적어 보세요.',
      'WHERE와 HAVING, JOIN 조건의 위치를 구분하세요.',
      '공식 PostgreSQL 문법으로 결과의 정렬과 경계값을 다시 확인하세요.',
    ],
    commonMistakes: copy?.commonMistakes ?? [
      'SELECT 목록에 필요하지 않은 열을 더해 반환 모양이 달라지는 실수',
      '동점 정렬 기준이나 NULL·중복 행을 고려하지 않는 실수',
    ],
    solution: {
      explanation: copy?.solution ?? `${task.intent} 참조 질의는 각 예제 데이터를 사용해 PostgreSQL 엔진에서 실행하고 전체 공개 테스트 결과와 대조합니다.`,
      referenceImplementation: sql,
      complexity: '실행 계획과 입력 행 수에 따라 달라집니다.',
    },
    sources: [
      ...(copy?.sources ?? []).map((url) => ({ title: officialSourceTitles[url] ?? 'PostgreSQL 18 공식 문서', url, reviewedAt: reviewDate })),
      { title: 'PostgreSQL 18 공식 SQL 문서', url: 'https://www.postgresql.org/docs/18/sql.html', reviewedAt: reviewDate },
      { title: 'PostgreSQL 18.6 공식 릴리스 안내', url: 'https://www.postgresql.org/docs/18/release-18-6.html', reviewedAt: reviewDate },
      { title: 'PostgreSQL 19 RC 1 공식 안내 · 정식 배포 전', url: 'https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/', reviewedAt: reviewDate },
      { title: 'PGlite 0.5.8 공식 브라우저 실행 문서', url: 'https://pglite.dev/docs/', reviewedAt: reviewDate },
    ],
    review: { status: 'approved', reviewedAt: reviewDate },
  };
}

export const postgresqlProblems = levelNames.flatMap((_, level) => tasks.map((task, index) => defineProblem(task, level, index)));

export { database as postgresqlProblemDatabase, scenarios as postgresqlProblemScenarios };
