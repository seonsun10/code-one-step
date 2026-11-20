function reviewedDay({
  focus, objective, query, expectedRows, correctAnswer, wrongOptions, tracePrompt, traceAnswer,
  traceExplanation, faultyQuery, errorPrompt, errorHint, errorReason, displayExample, executionNote,
  setupSql, explainQuery, repairCode, repairStarter, repairInput, repairOutput,
}) {
  return {
    focus,
    objective,
    query,
    expectedRows,
    answerTerm: focus,
    conceptPrompt: `${focus}: PostgreSQL 18에서 자료 형태와 실행 결과를 가장 정확하게 연결한 것은 무엇인가요?`,
    conceptHint: '연산자가 다루는 값의 형식, 출력 행, 실제 검증 범위를 확인하세요.',
    correctAnswer,
    correctFeedback: `${focus}의 선택을 예제의 결과 계약과 연결했어요.`,
    wrongOptions,
    tracePrompt,
    traceAnswer,
    traceHint: '입력 자료와 결과 열을 작은 표로 정리해 확인하세요.',
    traceExplanation,
    codeLines: [faultyQuery],
    errorLines: [1],
    errorPrompt,
    errorHint,
    errorReason,
    fix: query,
    reason: errorReason,
    displayExample,
    executionNote,
    ...(setupSql ? { setupSql } : {}),
    ...(explainQuery ? { explainQuery } : {}),
    ...(repairCode ? { repairCode, repairStarter, repairInput, repairOutput } : {}),
  };
}

export const postgresqlReviewedWeeksThirtySevenToThirtyNine = {
  37: [
    reviewedDay({
      focus: 'JSONB 경로와 text 추출', objective: '중첩 JSON 객체의 경로에서 구조 값과 SQL text 값을 구분해 읽어요.',
      query: `SELECT metadata #> '{profile,level}' AS level_json, metadata #>> '{profile,name}' AS name_text FROM (VALUES ('{"profile":{"level":3,"name":"민서"}}'::JSONB)) AS docs(metadata);`,
      expectedRows: [{ level_json: 3, name_text: '민서' }],
      correctAnswer: 'JSON 경로 `#>`는 JSON/JSONB 값을 유지하고 `#>>`는 경로 결과를 SQL text로 반환해요. 숫자 의미나 JSON 구조가 필요할 때는 JSON 값을 유지하고 텍스트 비교·표시에는 text 연산자를 골라요.',
      wrongOptions: [
        ['#>와 #>>는 모두 SQL text만 반환해요.', '#>는 JSON 값을 유지하고 #>>가 text를 반환해요.'],
        ['경로가 없는 키는 숫자 0으로 자동 대체돼요.', '경로 추출 결과는 없을 때 SQL NULL이 될 수 있어요.'],
        ['JSONB 경로에서 키 대소문자는 무시돼요.', '객체 키는 정확한 이름으로 접근해야 해요.'],
      ],
      tracePrompt: '문서에서 profile.level은 어떤 JSON 값으로, profile.name은 어떤 SQL text로 반환되나요?',
      traceAnswer: 'level은 JSON 숫자 3, name은 text 민서',
      traceExplanation: '#>는 중첩 숫자 값을 JSONB로 내고 TEXT 표시값은 3이에요. #>>는 name 값을 JSON 따옴표 없이 SQL text 민서로 반환해요.',
      displayExample: `SELECT metadata #> '{profile,level}' AS level_json,
       metadata #>> '{profile,name}' AS name_text
FROM (VALUES ('{"profile":{"level":3,"name":"민서"}}'::JSONB)) AS docs(metadata);`,
      executionNote: '같은 JSON 값을 두 경로 연산자로 읽어 PGlite 결과를 확인해요. 외부 JSON schema 검증이나 앱 직렬화는 대신하지 않아요.',
      faultyQuery: `SELECT metadata #>> '{profile,level}' AS level_json, metadata #> '{profile,name}' AS name_text FROM (VALUES ('{"profile":{"level":3,"name":"민서"}}'::JSONB)) AS docs(metadata);`,
      errorPrompt: '숫자는 JSON 자료형으로, 이름은 SQL text로 반환해야 하는데 두 경로 연산자를 뒤집은 줄을 찾으세요.',
      errorHint: '#>는 JSON, #>>는 text 결과예요.',
      errorReason: '연산자를 뒤집으면 level_json이 SQL text가 되고 name_text가 JSON 문자열이 되어 결과 자료형 계약이 달라져요.',
    }),
    reviewedDay({
      focus: 'JSONB 포함 연산자 @>', objective: '왼쪽 JSON 구조가 오른쪽 조건의 필요한 키·값을 포함하는지 판정해요.',
      query: `SELECT id FROM (VALUES (1, '{"topic":"sql","active":true}'::JSONB), (2, '{"topic":"js","active":true}'::JSONB), (3, '{"topic":"sql","active":false}'::JSONB)) AS docs(id, metadata) WHERE metadata @> '{"topic":"sql"}'::JSONB ORDER BY id;`,
      expectedRows: [{ id: 1 }, { id: 3 }],
      correctAnswer: '`left @> right`는 왼쪽 JSONB 값이 오른쪽 구조를 포함하는지 확인해요. 오른쪽에 지정하지 않은 추가 키가 있어도 일치할 수 있으며 배열의 순서·포함 규칙은 단순 문자열 부분 검색과 다릅니다.',
      wrongOptions: [
        ['@>는 왼쪽 JSON 문서 전체가 오른쪽 JSON과 문자열로 똑같은지 검사해요.', '@>는 JSON 구조 포함 관계를 검사해 부분 조건과 추가 키가 함께 있을 수 있어요.'],
        ['topic이 sql인 값은 active 여부가 참일 때만 포함돼요.', '오른쪽 조건은 topic만 지정했으므로 active는 필터하지 않아요.'],
        ['JSONB 포함 검사는 SQL LIKE의 `%sql%`와 같은 부분 문자열 검색이에요.', '@>는 JSON 구조 연산자이고 텍스트 패턴 검색과 다릅니다.'],
      ],
      tracePrompt: 'topic이 sql인 JSONB 행은 active 값과 상관없이 어떤 id가 일치하나요?',
      traceAnswer: 'id 1과 id 3',
      traceExplanation: '오른쪽 JSON 조건은 topic=sql만 포함해요. id 1은 active true, id 3은 false지만 둘 다 topic 조건을 만족해요.',
      displayExample: `SELECT id
FROM (VALUES
  (1, '{"topic":"sql","active":true}'::JSONB),
  (2, '{"topic":"js","active":true}'::JSONB),
  (3, '{"topic":"sql","active":false}'::JSONB)
) AS docs(id, metadata)
WHERE metadata @> '{"topic":"sql"}'::JSONB
ORDER BY id;`,
      executionNote: 'PGlite에서 세 JSON 문서와 @> 결과 id를 확인해요. 포함 인덱스의 성능이나 모든 JSON 연산자 사용 가능성을 뜻하지 않아요.',
      faultyQuery: `SELECT id FROM (VALUES (1, '{"topic":"sql","active":true}'::JSONB), (2, '{"topic":"js","active":true}'::JSONB), (3, '{"topic":"sql","active":false}'::JSONB)) AS docs(id, metadata) WHERE metadata @> '{"topic":"sql","active":true}'::JSONB ORDER BY id;`,
      errorPrompt: '요구 조건은 topic=sql인데 active=true까지 추가해 일치 행을 과하게 줄이는 JSON 조건을 찾으세요.',
      errorHint: '오른쪽 객체에 넣은 모든 키가 포함 조건이 돼요.',
      errorReason: '추가 active 조건은 id 3을 제외해 요구보다 좁은 결과를 만들어요. 필요한 키만 오른쪽 JSON에 적으세요.',
    }),
    reviewedDay({
      focus: 'JSONB GIN 인덱스 범위', objective: 'GIN 인덱스를 포함 검색 후보로 만들고 실제 계획·연산자 지원을 따로 확인해요.',
      setupSql: `CREATE TABLE json_search_docs (id INTEGER PRIMARY KEY, metadata JSONB NOT NULL); INSERT INTO json_search_docs VALUES (1, '{"tags":["sql","json"]}'), (2, '{"tags":["js"]}'), (3, '{"tags":["sql"]}'); CREATE INDEX json_search_docs_metadata_gin ON json_search_docs USING GIN (metadata);`,
      query: `SELECT id FROM json_search_docs WHERE metadata @> '{"tags":["sql"]}'::JSONB ORDER BY id;`,
      explainQuery: `EXPLAIN SELECT id FROM json_search_docs WHERE metadata @> '{"tags":["sql"]}'::JSONB;`,
      expectedRows: [{ id: 1 }, { id: 3 }],
      correctAnswer: 'GIN은 JSONB의 여러 구성 요소 검색을 지원할 수 있지만 실제 사용 여부는 연산자 클래스·질의 연산자·자료량·비용 추정에 달려요. 인덱스가 있다는 사실만으로 성능 향상이나 특정 계획 노드를 보장하지 않아요.',
      wrongOptions: [
        ['GIN 인덱스는 JSONB의 모든 경로·비교·정렬 질의를 자동으로 최적화해요.', '지원되는 연산자는 연산자 클래스에 따라 다르고 계획도 비용에 따라 달라요.'],
        ['인덱스가 생성되면 EXPLAIN 결과는 항상 Bitmap Index Scan이어야 해요.', '작은 표에서 플래너가 순차 스캔을 택할 수 있어요.'],
        ['인덱스는 원본 JSON 문서를 대신 저장해 SELECT 결과를 바꿔요.', '인덱스는 검색 경로이며 질의 결과 의미를 바꾸지 않아요.'],
      ],
      tracePrompt: 'tags 배열에 sql이 포함된 문서 id와 예상 계획 확인 방법은 무엇인가요?',
      traceAnswer: 'id 1과 id 3이며 EXPLAIN으로 실제 계획을 확인해요.',
      traceExplanation: 'id 1의 태그는 sql·json, id 3에는 sql이 있어요. 인덱스 생성 뒤 EXPLAIN은 조회 경로를 관찰할 뿐 인덱스 사용을 약속하지 않아요.',
      displayExample: `CREATE INDEX json_search_docs_metadata_gin
ON json_search_docs USING GIN (metadata);

EXPLAIN SELECT id FROM json_search_docs
WHERE metadata @> '{"tags":["sql"]}'::JSONB;`,
      executionNote: 'PGlite에서 포함 질의 결과·GIN 정의·EXPLAIN 반환을 확인해요. 표가 작아 실제 인덱스 노드가 선택되지 않아도 실패로 처리하지 않아요.',
      faultyQuery: `CREATE INDEX json_search_docs_metadata_gin ON json_search_docs USING GIN (metadata); -- 모든 JSON 질의가 무조건 빨라짐`,
      errorPrompt: 'GIN 생성만으로 모든 JSON 질의의 사용과 속도를 보장한다고 말하는 부분을 찾으세요.',
      errorHint: '연산자 클래스와 실제 실행 계획을 함께 살펴보세요.',
      errorReason: 'GIN이 지원하는 연산자와 플래너 선택은 질의·데이터에 따라 달라요. 해당 검색 결과와 계획을 측정해야 해요.',
    }),
    reviewedDay({
      focus: '배열 포함과 겹침 연산자', objective: '배열 안 원소 포함(@>)과 공통 요소 존재(&&)를 구분해 검색해요.',
      query: `SELECT label, topics @> ARRAY['sql']::TEXT[] AS has_sql, topics && ARRAY['python','js']::TEXT[] AS overlaps FROM (VALUES ('a', ARRAY['sql','json']::TEXT[]), ('b', ARRAY['js']::TEXT[]), ('c', ARRAY['python','sql']::TEXT[])) AS docs(label, topics) ORDER BY label;`,
      expectedRows: [
        { label: 'a', has_sql: true, overlaps: false },
        { label: 'b', has_sql: false, overlaps: true },
        { label: 'c', has_sql: true, overlaps: true },
      ],
      correctAnswer: '`@>`는 왼쪽 배열이 오른쪽 배열의 모든 원소를 포함하는지, `&&`는 두 배열에 공통 원소가 하나라도 있는지 검사해요. 문자열 한 덩어리의 부분 포함이나 JSON 연산자와 혼동하지 않아요.',
      wrongOptions: [
        ['@>는 두 배열에 공통 값 하나만 있어도 참이에요.', '공통 원소 여부는 &&이고 @>는 오른쪽 원소를 모두 포함해야 해요.'],
        ['&&는 왼쪽 배열에 오른쪽 배열 전체가 들어 있는지 검사해요.', '&&는 원소 하나 이상의 겹침을 검사해요.'],
        ['배열에 sql이 들어 있으면 `LIKE` 문자열 검색과 모든 경계가 같아요.', '배열 연산은 구성 원소를 비교하고 텍스트 LIKE는 문자열 패턴을 비교해요.'],
      ],
      tracePrompt: 'a, b, c의 has_sql과 overlaps는 각각 어떤 불리언 쌍인가요?',
      traceAnswer: 'a true/false, b false/true, c true/true',
      traceExplanation: 'a는 sql은 있지만 python/js와 겹치지 않아요. b는 js가 겹치고 sql은 없어요. c는 sql 포함 및 python 겹침을 모두 만족해요.',
      displayExample: `SELECT label,
       topics @> ARRAY['sql']::TEXT[] AS has_sql,
       topics && ARRAY['python','js']::TEXT[] AS overlaps
FROM (VALUES
  ('a', ARRAY['sql','json']::TEXT[]),
  ('b', ARRAY['js']::TEXT[]),
  ('c', ARRAY['python','sql']::TEXT[])
) AS docs(label, topics)
ORDER BY label;`,
      executionNote: '두 배열 연산자의 결과를 PGlite에서 세 입력 행과 대조해요. 배열 자료형 자체가 중복 방지·외래 키 같은 관계 제약을 제공하지는 않아요.',
      faultyQuery: `SELECT label, topics @> ARRAY['python','js']::TEXT[] AS overlaps FROM (VALUES ('a', ARRAY['sql','json']::TEXT[]), ('b', ARRAY['js']::TEXT[]), ('c', ARRAY['python','sql']::TEXT[])) AS docs(label, topics);`,
      errorPrompt: '공통 원소 하나만 찾는 overlaps 결과에 전체 포함 연산자를 사용한 줄을 찾으세요.',
      errorHint: '오른쪽 두 값 모두 필요한지, 하나만 겹치면 되는지 구분하세요.',
      errorReason: '@>는 python과 js를 모두 포함해야 참이에요. 하나라도 공통이면 `&&`를 사용해야 해요.',
    }),
    reviewedDay({
      focus: '관계형 열과 JSONB의 분리 기준', objective: '자주 조인·제약하는 반복 항목을 연결 표로 옮길지 사용 요구에서 판단해요.',
      setupSql: `CREATE TABLE tag_dimension (tag TEXT PRIMARY KEY); INSERT INTO tag_dimension VALUES ('json'), ('practice'), ('sql'); CREATE TABLE attempt_tag_relation (attempt_id INTEGER NOT NULL REFERENCES attempts(id), tag TEXT NOT NULL REFERENCES tag_dimension(tag), PRIMARY KEY (attempt_id, tag)); INSERT INTO attempt_tag_relation VALUES (1, 'sql'), (1, 'practice'), (2, 'json');`,
      query: `SELECT attempt_id, COUNT(*)::INTEGER AS tag_count FROM attempt_tag_relation WHERE attempt_id = 1 GROUP BY attempt_id;`,
      expectedRows: [{ attempt_id: 1, tag_count: 2 }],
      correctAnswer: '반복 태그를 개별 검색·조인하고 존재하는 값만 허용하며 중복을 막으려면 tag 표와 복합 기본 키·외래 키가 유용해요. 유연한 문서 속성은 JSONB가 알맞을 수 있어 요구되는 관계·검증·질의 빈도를 기준으로 나눠요.',
      wrongOptions: [
        ['JSONB는 어떤 속성에도 schema·검증이 자동 적용돼 관계형 표가 필요 없어요.', 'JSONB 자료형은 전체 업무 schema와 외래 키 정책을 자동으로 정의하지 않아요.'],
        ['배열이나 콤마 문자열에도 각 값의 외래 키·고유성을 표준 제약으로 둘 수 있어요.', '개별 참조와 중복을 강하게 검증하려면 연결 표가 명확해요.'],
        ['모든 JSON 속성은 사용 빈도와 무관하게 각각 열로 쪼개야 해요.', '변경이 드물고 문서형인 자료는 JSONB가 맞을 수 있어요.'],
      ],
      tracePrompt: 'attempt 1에는 몇 개의 고유 태그가 연결됐고, 중복 연결은 어떤 제약이 막나요?',
      traceAnswer: '태그 2개이며 (attempt_id, tag) 기본 키가 중복을 막아요.',
      traceExplanation: '관계형 연결 표에는 sql·practice 두 행이 연결돼 있어요. 복합 기본 키는 같은 attempt_id/tag 쌍을 중복 저장할 수 없게 해요.',
      displayExample: 'CREATE TABLE attempt_tag_relation (\n  attempt_id INTEGER NOT NULL REFERENCES attempts(id),\n  tag TEXT NOT NULL REFERENCES tag_dimension(tag),\n  PRIMARY KEY (attempt_id, tag)\n);',
      executionNote: 'fixture에서 외래 키·복합 기본 키·개별 태그 수를 확인해요. JSONB나 배열을 쓰지 말라는 보편 규칙으로 확대하지 않아요.',
      faultyQuery: 'CREATE TABLE attempt_tag_relation (attempt_id INTEGER, tags TEXT); -- 참조·중복 제약 없음',
      errorPrompt: '태그를 별도로 조회·참조해야 하는데 여러 태그를 한 문자열 열에 뭉친 설계를 찾으세요.',
      errorHint: '시도마다 태그 한 개를 관계의 한 행으로 표현할 수 있어요.',
      errorReason: '한 문자열은 태그별 외래 키와 같은 시도의 중복 태그를 데이터베이스가 검증하지 못해요. 연결 행과 복합 키를 사용하세요.',
    }),
  ],
  38: [
    reviewedDay({
      focus: '출력 열·자료형 계약', objective: '계산 결과의 이름·자료형·정렬 순서를 명시해 호출자가 안정적으로 읽게 해요.',
      query: 'SELECT id::INTEGER AS learner_id, name::TEXT AS display_name FROM learners ORDER BY id;',
      expectedRows: [
        { learner_id: 1, display_name: '민서' }, { learner_id: 2, display_name: '준' },
        { learner_id: 3, display_name: '하린' }, { learner_id: 4, display_name: '도윤' },
      ],
      correctAnswer: 'SELECT의 alias와 명시적 형 변환은 결과 계약을 읽기 쉽게 만들어요. 정렬 순서를 반환 계약에 포함하려면 ORDER BY도 명시해야 하며 물리 입력 순서를 가정하지 않아요.',
      wrongOptions: [
        ['열 alias를 바꾸면 원본 표의 저장 열 이름도 같이 바뀌어요.', 'alias는 해당 질의 결과의 표시 이름이며 schema 변경이 아니에요.'],
        ['정수형 id가 있으므로 ORDER BY 없이도 모든 실행에서 행 순서는 고정돼요.', '관계형 질의 결과 순서는 ORDER BY가 없으면 보장되지 않아요.'],
        ['SELECT *로 모든 열을 반환해야 새 열이 생겨도 공개 계약이 안정돼요.', '별표는 열 추가에 따라 출력 계약이 바뀔 수 있어 필요한 열을 명시하는 편이 분명해요.'],
      ],
      tracePrompt: '표시 이름과 정렬 기준을 적용한 네 번째 결과의 열은 무엇인가요?',
      traceAnswer: 'learner_id 4, display_name 도윤',
      traceExplanation: '실제 learners.name을 display_name으로 반환하고 id 오름차순으로 정렬하므로 네 번째 행은 도윤이에요.',
      displayExample: 'SELECT id::INTEGER AS learner_id,\n       name::TEXT AS display_name\nFROM learners\nORDER BY id;',
      executionNote: 'PGlite에서 열 alias·값·행 순서를 검증해요. 애플리케이션 JSON serializer가 같은 계약을 유지하는지는 별도 시스템 범위예요.',
      faultyQuery: 'SELECT * FROM learners; -- 열 이름·순서·행 순서가 영구 공개 계약',
      errorPrompt: '필요하지 않은 모든 열을 공개하고 행 순서까지 보장된다고 가정하는 질의를 찾으세요.',
      errorHint: '출력 열을 명시하고 정렬 기준을 직접 작성하세요.',
      errorReason: 'SELECT *은 schema 열 추가에 따라 결과 계약이 넓어지고 ORDER BY가 없으면 행 순서를 보장하지 않아요.',
    }),
    reviewedDay({
      focus: '빈 집합의 COUNT·SUM·AVG', objective: '입력 행이 하나도 없을 때 집계별 결과와 COALESCE 정책을 분리해요.',
      query: 'SELECT COUNT(*)::INTEGER AS row_count, SUM(points)::INTEGER AS point_sum, AVG(points)::NUMERIC AS point_average, COALESCE(SUM(points), 0)::INTEGER AS display_sum FROM attempts WHERE id > 100;',
      expectedRows: [{ row_count: 0, point_sum: null, point_average: null, display_sum: 0 }],
      correctAnswer: '빈 입력에서 COUNT는 0을 반환하지만 SUM과 AVG는 NULL이 될 수 있어요. 화면 표시 기본값이 0이어야 할 때만 요구 계약을 확인하고 COALESCE로 바꾸며 원래 “자료 없음” 의미와 구분해요.',
      wrongOptions: [
        ['빈 SUM과 AVG는 언제나 숫자 0이에요.', 'COUNT와 달리 대부분의 집계는 입력이 없으면 NULL을 반환해요.'],
        ['COALESCE는 원본 attempts 행을 삽입해 집계 결과를 만들어요.', 'COALESCE는 결과 식의 NULL을 대체하며 원본 행을 바꾸지 않아요.'],
        ['display_sum 0과 point_sum NULL은 언제나 업무 의미가 같아요.', 'NULL은 입력 부재, 0은 정해진 숫자 합이라 정책상 다를 수 있어요.'],
      ],
      tracePrompt: 'id > 100인 빈 입력에서 count, sum, average, 표시용 coalesce 합계는 각각 무엇인가요?',
      traceAnswer: '0, NULL, NULL, 0',
      traceExplanation: '입력이 없어 COUNT는 0이고 SUM·AVG는 NULL이에요. COALESCE만 NULL 합계를 표시 정책에 따라 0으로 대체해요.',
      displayExample: 'SELECT COUNT(*) AS row_count,\n       SUM(points) AS point_sum,\n       AVG(points) AS point_average,\n       COALESCE(SUM(points), 0) AS display_sum\nFROM attempts WHERE id > 100;',
      executionNote: '0행 필터에서 집계 차이를 PGlite로 확인해요. 화면 표시 기본값이 학습자의 “점수가 없다”는 기록까지 바꾸는 것은 아니에요.',
      faultyQuery: 'SELECT COUNT(*), COALESCE(AVG(points), 0) FROM attempts WHERE id > 100; -- 평균이 존재한다고 표시',
      errorPrompt: '빈 입력을 실제 평균 0점으로 표시해 자료 부재와 점수를 혼동하는 식을 찾으세요.',
      errorHint: 'COUNT, SUM, AVG의 빈 입력 값을 각각 비교하세요.',
      errorReason: '빈 평균은 NULL로 계산 근거가 없어요. 평균 0으로 바꾸는 것이 요구된 표현인지 먼저 결정해야 합니다.',
    }),
    reviewedDay({
      focus: '동점 보조 키와 안정된 순서', objective: '같은 점수의 행까지 결정적으로 정렬해 반복 가능한 상위 결과를 만들어요.',
      query: 'SELECT id, points FROM attempts ORDER BY points DESC, id ASC LIMIT 3;',
      expectedRows: [{ id: 4, points: 80 }, { id: 5, points: 80 }, { id: 3, points: 70 }],
      correctAnswer: '점수 내림차순만 쓰면 같은 점수 행끼리 순서가 정해지지 않아요. 고유한 보조 키 id를 추가해 상위 결과·페이지에서 동점까지 결정적으로 정렬할 수 있어요.',
      wrongOptions: [
        ['점수 내림차순만 쓰면 같은 점수의 id 순서도 보장돼요.', '동점 그룹의 순서를 고정하려면 추가 정렬 키가 필요해요.'],
        ['LIMIT은 정렬 기준과 관계없이 최고 점수 행을 선택해요.', '어떤 행을 상위로 고를지 ORDER BY가 결정하고 LIMIT은 결과 수를 제한해요.'],
        ['두 행의 점수가 같으면 SQL은 자동으로 중복 행 하나를 제거해요.', '정렬은 행을 제거하지 않으며 DISTINCT와도 다른 기능이에요.'],
      ],
      tracePrompt: 'points DESC, id ASC로 정렬해 상위 세 행을 선택하면 어떤 id 순서인가요?',
      traceAnswer: '4, 5, 3',
      traceExplanation: '80점 두 행은 id 오름차순 4, 5이고 그다음 70점 id 3이 와요.',
      displayExample: 'SELECT id, points FROM attempts\nORDER BY points DESC, id ASC\nLIMIT 3;',
      executionNote: '같은 80점 두 행의 보조 키 순서와 LIMIT 결과를 PGlite에서 확인해요. OFFSET 페이지 간 다른 트랜잭션 변경 안정성은 별도 설계 문제예요.',
      faultyQuery: 'SELECT id, points FROM attempts ORDER BY points DESC LIMIT 3;',
      errorPrompt: '동점인 80점 행 두 개의 순서를 결정하지 않는 정렬 질의를 찾으세요.',
      errorHint: 'points 값이 같을 때 추가로 비교할 고유 열을 선택하세요.',
      errorReason: '점수만으로 id 4와 5의 상대 순서가 보장되지 않아요. `id ASC`를 추가해야 결과를 재현할 수 있어요.',
    }),
    reviewedDay({
      focus: 'NULL·빈 문자열의 경계 결과', objective: '누락·빈 텍스트·일반 값을 별도 입력으로 두고 조건별 의미를 확인해요.',
      query: `WITH notes(label, review_note) AS (VALUES ('missing', NULL::TEXT), ('empty', ''::TEXT), ('written', 'ok'::TEXT)) SELECT label, review_note IS NULL AS is_missing, review_note IS DISTINCT FROM 'ok' AS differs_from_ok FROM notes ORDER BY label;`,
      expectedRows: [
        { label: 'empty', is_missing: false, differs_from_ok: true },
        { label: 'missing', is_missing: true, differs_from_ok: true },
        { label: 'written', is_missing: false, differs_from_ok: false },
      ],
      correctAnswer: 'NULL은 값 누락 상태이고 빈 문자열은 길이 0인 실제 text예요. `IS DISTINCT FROM`은 NULL을 포함한 두 값을 NULL 결과 없이 비교해 테스트·변경 조건의 경계를 명시할 수 있어요.',
      wrongOptions: [
        ['NULL과 빈 문자열은 PostgreSQL에서 동일한 값이에요.', 'NULL은 누락 상태이고 빈 문자열은 실제로 존재하는 text 값이에요.'],
        ['NULL과 등호 비교는 false를 확정하므로 IS DISTINCT FROM이 필요 없어요.', '일반 등호 비교는 NULL과 만나면 UNKNOWN이 될 수 있어요.'],
        ['IS DISTINCT FROM은 두 값이 다를 때 NULL을 반환해요.', '이 연산자는 NULL을 서로 비교 가능한 값처럼 다뤄 참·거짓 결과를 줘요.'],
      ],
      tracePrompt: 'missing, empty, written 행의 is_missing/differs_from_ok 결과는 무엇인가요?',
      traceAnswer: 'missing true/true, empty false/true, written false/false',
      traceExplanation: '누락은 IS NULL만 참이고 빈 문자열은 실제 값이라 distinct 비교가 참이에요. ok만 기준 text와 같아 두 번째 비교가 거짓이에요.',
      displayExample: `WITH notes(label, review_note) AS (
  VALUES ('missing', NULL::TEXT), ('empty', ''::TEXT), ('written', 'ok'::TEXT)
)
SELECT label, review_note IS NULL AS is_missing,
       review_note IS DISTINCT FROM 'ok' AS differs_from_ok
FROM notes ORDER BY label;`,
      executionNote: 'NULL과 빈 문자열을 각각 만들어 PGlite에서 비교해요. 실제 설문·메모에서 무엇을 누락으로 처리할지는 제품 규칙으로 결정해야 해요.',
      faultyQuery: `SELECT review_note <> 'ok' FROM (VALUES (NULL::TEXT)) AS notes(review_note); -- 누락도 false로 분류`,
      errorPrompt: 'NULL 입력의 비교 결과를 참·거짓 중 하나라고 단정해 누락 경계를 잃는 조건을 찾으세요.',
      errorHint: 'NULL 비교에는 UNKNOWN이 생길 수 있고 distinct 비교는 별도 결과를 제공해요.',
      errorReason: "`NULL <> 'ok'`는 TRUE/FALSE가 아니라 UNKNOWN이에요. 누락을 분류하려면 IS NULL 또는 IS DISTINCT FROM의 요구 의미를 명확히 정하세요.",
    }),
    reviewedDay({
      focus: '결과 계약 assertion', objective: '행 개수·경계·열 의미를 질의 결과 assertion으로 기록해 회귀 때 다시 확인해요.',
      query: 'SELECT (COUNT(*) = 5) AS has_five_rows, (MIN(points) = 40) AS minimum_is_40, (MAX(points) = 80) AS maximum_is_80 FROM attempts;',
      expectedRows: [{ has_five_rows: true, minimum_is_40: true, maximum_is_80: true }],
      correctAnswer: '데이터 예제는 기대 행 수, 경계값, 중복·NULL·정렬과 출력 열을 명시해야 해요. 문법 파싱에 성공한 사실만으로 결과 의미가 맞다고 판단하지 말고 중요한 기대를 자동 assertion으로 유지해요.',
      wrongOptions: [
        ['SQL 문장이 실행되기만 하면 기대 행 수와 경계도 검증된 거예요.', '문법 성공과 업무 결과 계약은 서로 다른 검증이에요.'],
        ['MIN/MAX를 검사하면 행 수와 중복 행도 자동으로 검증돼요.', '경계값 assertion만으로 전체 행 수나 중복 여부를 증명할 수 없어요.'],
        ['테스트에서 NULL·동점·빈 집합은 다루지 않아도 돼요.', '경계 입력을 일부러 포함해야 안정된 결과 계약을 확인할 수 있어요.'],
      ],
      tracePrompt: 'fixture에서 총 행 수와 points 최솟값·최댓값 세 assertion은 어떻게 나오나요?',
      traceAnswer: 'true, true, true',
      traceExplanation: 'attempts는 다섯 행이고 points는 40에서 80 사이예요. 총 건수와 양끝을 각각 독립된 boolean 결과로 확인해요.',
      displayExample: 'SELECT COUNT(*) = 5 AS has_five_rows,\n       MIN(points) = 40 AS minimum_is_40,\n       MAX(points) = 80 AS maximum_is_80\nFROM attempts;',
      executionNote: 'PGlite에서 기대 계약 세 가지를 boolean 값으로 확인해요. 작은 테스트 집합만으로 임의 운영 데이터에 모든 업무 요건이 충분하다고 주장하지 않아요.',
      faultyQuery: 'SELECT COUNT(*) > 0 AS has_data FROM attempts; -- 다섯 행과 점수 경계까지 검증',
      errorPrompt: '행이 하나 이상 있다는 확인만으로 상세한 반환 계약 전체를 검증했다고 주장하는 부분을 찾으세요.',
      errorHint: '전체 행 수와 최소·최대값을 각각 검사하고 있어요?',
      errorReason: 'COUNT > 0은 데이터 존재 여부만 알려 줘요. 예상 건수와 중요한 값 경계도 독립적으로 확인해야 해요.',
    }),
  ],
  39: [
    reviewedDay({
      focus: '성과 결과표 요구와 LEFT JOIN', objective: '시도 기록이 없는 학습자도 포함하고 활성 결과만 집계해 전체 표를 만들어요.',
      query: 'SELECT l.id, l.name, COUNT(a.id) FILTER (WHERE a.active IS TRUE)::INTEGER AS active_count, COALESCE(SUM(a.points) FILTER (WHERE a.active IS TRUE), 0)::INTEGER AS points_total FROM learners AS l LEFT JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.id, l.name ORDER BY points_total DESC, l.id;',
      expectedRows: [
        { id: 1, name: '민서', active_count: 2, points_total: 100 },
        { id: 3, name: '하린', active_count: 1, points_total: 80 },
        { id: 2, name: '준', active_count: 1, points_total: 70 },
        { id: 4, name: '도윤', active_count: 0, points_total: 0 },
      ],
      correctAnswer: 'LEFT JOIN은 시도 행이 없는 학습자도 남겨요. 집계는 실제 attempt id를 세고 FILTER로 활성만 선택하며, 표시 점수 합계는 요구에 따라 빈 값을 0으로 변환해요. 동점·최종 순서에는 고유 id를 추가해야 해요.',
      wrongOptions: [
        ['INNER JOIN을 쓰면 시도가 없는 학습자도 결과에 남아요.', 'INNER JOIN은 맞는 시도 행이 없는 learner를 제거해요.'],
        ['COUNT(*)는 LEFT JOIN에서 시도 없는 도윤을 0건으로 계산해요.', '확장된 한 행이 생기므로 COUNT(*)는 1이 되고, COUNT(a.id)는 0이에요.'],
        ['비활성 점수도 active_count와 points_total에 자동 포함돼요.', 'FILTER 조건은 active가 true인 시도만 집계해요.'],
      ],
      tracePrompt: '활성 시도 점수 합계 내림차순 결과에서 도윤은 어떤 한 행으로 남나요?',
      traceAnswer: 'id 4, active_count 0, points_total 0',
      traceExplanation: 'LEFT JOIN은 도윤의 학습자 행을 보존하고 시도 열은 NULL이에요. COUNT(a.id)는 0이고 COALESCE 합계는 0을 보여 줘요.',
      displayExample: 'SELECT l.id, l.name,\n       COUNT(a.id) FILTER (WHERE a.active IS TRUE) AS active_count,\n       COALESCE(SUM(a.points) FILTER (WHERE a.active IS TRUE), 0) AS points_total\nFROM learners AS l\nLEFT JOIN attempts AS a ON a.learner_id = l.id\nGROUP BY l.id, l.name\nORDER BY points_total DESC, l.id;',
      executionNote: '네 학습자·다섯 시도에서 LEFT JOIN·FILTER·빈 합계와 결정적 정렬을 PGlite로 확인해요.',
      faultyQuery: 'SELECT l.id, l.name, COUNT(*) AS active_count FROM learners AS l INNER JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.id, l.name;',
      errorPrompt: '시도가 없는 learner를 제거하고 실제 attempt 개수 대신 조인된 행 수를 세는 질의를 찾으세요.',
      errorHint: '기록이 없는 학습자 행도 남기는 조인과 nullable 쪽 키를 선택하세요.',
      errorReason: 'INNER JOIN은 도윤을 빼고 COUNT(*)는 비활성 행까지 셉니다. LEFT JOIN과 COUNT(a.id) FILTER(active)로 요구를 나누세요.',
    }),
    reviewedDay({
      focus: '관계 키와 태그 결과 연결', objective: '외래 키 연결을 따라 learner·attempt·tag를 결합하고 중복 태그를 안정되게 표시해요.',
      setupSql: `INSERT INTO tags VALUES ('practice'), ('sql'), ('json'); INSERT INTO attempt_tags VALUES (1, 'sql'), (1, 'practice'), (2, 'json'), (3, 'practice');`,
      query: `SELECT a.id AS attempt_id, l.name, string_agg(t.tag_name, ',' ORDER BY t.tag_name) AS tags FROM attempts AS a JOIN learners AS l ON l.id = a.learner_id JOIN attempt_tags AS t ON t.attempt_id = a.id WHERE a.id = 1 GROUP BY a.id, l.name;`,
      expectedRows: [{ attempt_id: 1, name: '민서', tags: 'practice,sql' }],
      correctAnswer: '외래 키와 조인 열을 따라 시도 id 1에서 learner 1 민서와 두 연결 tag를 찾을 수 있어요. 다중 행 텍스트 집계에는 구분자와 내부 정렬을 명시해 결과 문자열을 결정적으로 만들어요.',
      wrongOptions: [
        ['attempt_id와 learner_id는 값이 항상 같은 키예요.', '서로 다른 표의 독립 식별자라 실제 외래 키 관계로 연결해야 해요.'],
        ['string_agg 안의 행 순서는 ORDER BY 없이 항상 입력 순서예요.', '집계 입력 순서를 고정하려면 집계 안에 ORDER BY를 둬요.'],
        ['tag_name은 tag dimension 외래 키가 있어도 중복되는 관계 행을 허용해요.', 'attempt_tags의 (attempt_id, tag_name) 기본 키가 동일 연결 중복을 막아요.'],
      ],
      tracePrompt: 'attempt id 1의 학습자와 연결 태그를 tag 오름차순으로 합치면 무엇인가요?',
      traceAnswer: '민서, practice,sql',
      traceExplanation: 'attempt 1은 learner 1 민서 소유예요. 연결 테이블 행은 practice와 sql 두 개이고 ORDER BY로 그 순서가 고정돼요.',
      displayExample: `SELECT a.id AS attempt_id, l.name,
       string_agg(t.tag_name, ',' ORDER BY t.tag_name) AS tags
FROM attempts AS a
JOIN learners AS l ON l.id = a.learner_id
JOIN attempt_tags AS t ON t.attempt_id = a.id
WHERE a.id = 1
GROUP BY a.id, l.name;`,
      executionNote: 'fixture 외래 키·복합 키에 맞춰 세 표를 연결하고 PGlite에서 이름·태그 집계를 확인해요.',
      faultyQuery: `SELECT a.id, l.name, string_agg(t.tag_name, ',') FROM attempts AS a JOIN learners AS l ON l.id = a.id JOIN attempt_tags AS t ON t.attempt_id = a.id WHERE a.id = 3 GROUP BY a.id, l.name;`,
      errorPrompt: '시도 id를 학습자 id와 직접 비교해 잘못된 learner를 연결할 수 있는 JOIN을 찾으세요.',
      errorHint: 'attempts.learner_id가 learners.id를 참조해요.',
      errorReason: 'attempts.id는 attempts 행 식별자이고 learners.id는 소유 학습자 식별자예요. 두 표는 `a.learner_id = l.id`로 연결하세요.',
    }),
    reviewedDay({
      focus: 'JOIN 행 증폭과 사전 집계', objective: '다중 태그 조인이 점수 합계를 부풀리지 않도록 각 관계의 집계 단위를 먼저 정해요.',
      setupSql: `INSERT INTO tags VALUES ('practice'), ('sql'), ('json'); INSERT INTO attempt_tags VALUES (1, 'sql'), (1, 'practice'), (2, 'json');`,
      query: `WITH active_scores AS (SELECT learner_id, SUM(points)::INTEGER AS points_total FROM attempts WHERE active IS TRUE GROUP BY learner_id), tag_counts AS (SELECT a.learner_id, COUNT(t.tag_name)::INTEGER AS tag_links FROM attempts AS a JOIN attempt_tags AS t ON t.attempt_id = a.id WHERE a.active IS TRUE GROUP BY a.learner_id) SELECT l.id, l.name, COALESCE(s.points_total, 0)::INTEGER AS points_total, COALESCE(tc.tag_links, 0)::INTEGER AS tag_links FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id LEFT JOIN tag_counts AS tc ON tc.learner_id = l.id ORDER BY l.id;`,
      expectedRows: [
        { id: 1, name: '민서', points_total: 100, tag_links: 3 },
        { id: 2, name: '준', points_total: 70, tag_links: 0 },
        { id: 3, name: '하린', points_total: 80, tag_links: 0 },
        { id: 4, name: '도윤', points_total: 0, tag_links: 0 },
      ],
      correctAnswer: '태그 조인은 시도 하나를 여러 행으로 늘려요. 점수 합계와 태그 개수를 각각 원래 기준 단위로 집계한 뒤 learner별 한 행씩 조합하면 합계가 중복 곱셈되지 않아요.',
      wrongOptions: [
        ['JOIN 뒤 SUM은 연결된 태그 수만큼 중복된 시도 점수를 자동으로 알아서 제거해요.', '집계는 입력 행의 중복을 보존하므로 먼저 점수의 grain을 정해야 해요.'],
        ['COUNT(DISTINCT points)는 학습자의 실제 점수 총합과 같아요.', '중복 점수 값 자체를 제거하면 서로 다른 시도의 유효 점수도 하나로 합칠 수 있어요.'],
        ['CTE는 결과를 저장하므로 이후 조인의 중복이 자동으로 없어져요.', 'CTE 이름만으로 행이 중복 제거되지 않으며 각 CTE 집계 키를 맞춰야 해요.'],
      ],
      tracePrompt: '민서에게 활성 attempt 두 건과 태그 연결 세 건이 있을 때 점수 합계와 태그 연결 수는?',
      traceAnswer: '점수 합계 100, 태그 연결 3',
      traceExplanation: '점수 CTE는 learner 1의 활성 점수 40+60을 한 행으로 묶어요. 태그 집계는 attempt 1의 두 태그와 attempt 2의 json 하나를 별도 계산해 3이에요.',
      displayExample: `WITH active_scores AS (
  SELECT learner_id, SUM(points)::INTEGER AS points_total
  FROM attempts WHERE active IS TRUE GROUP BY learner_id
), tag_counts AS (
  SELECT a.learner_id, COUNT(t.tag_name)::INTEGER AS tag_links
  FROM attempts AS a JOIN attempt_tags AS t ON t.attempt_id = a.id
  WHERE a.active IS TRUE GROUP BY a.learner_id
)
SELECT l.id, l.name, COALESCE(s.points_total, 0), COALESCE(tc.tag_links, 0)
FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id
LEFT JOIN tag_counts AS tc ON tc.learner_id = l.id ORDER BY l.id;`,
      executionNote: 'PGlite에서 CTE별 집계와 최종 learner당 한 행 결과를 확인해요. 조인 후 단순 SUM이 태그 수만큼 부풀 수 있는지 fixture로 설명해요.',
      faultyQuery: `SELECT l.id, SUM(a.points)::INTEGER AS points_total FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id JOIN attempt_tags AS t ON t.attempt_id = a.id WHERE a.active IS TRUE GROUP BY l.id;`,
      errorPrompt: '같은 attempt가 태그 개수만큼 조인된 뒤 점수 SUM에 중복 포함되는 질의를 찾으세요.',
      errorHint: '점수는 attempt당, 태그 수는 연결 관계당 따로 먼저 집계하세요.',
      errorReason: 'attempt 1의 40점이 두 태그 행과 결합해 두 번 더해져요. 점수 집계와 태그 집계를 기준 행 단위로 나눈 뒤 합치세요.',
    }),
    reviewedDay({
      focus: '빈 기록·NULL·동점 통합 경계', objective: '0건 학습자·비활성 시도·같은 점수와 NULL 메모를 한 결과 검사에 넣어요.',
      query: 'SELECT COUNT(DISTINCT learner_id)::INTEGER AS learners_with_attempts, COUNT(*) FILTER (WHERE active IS FALSE)::INTEGER AS inactive_attempts, COUNT(DISTINCT points) FILTER (WHERE points = 80)::INTEGER AS distinct_eighty_scores, COUNT(*) FILTER (WHERE review_note IS NULL)::INTEGER AS missing_notes FROM attempts;',
      expectedRows: [{ learners_with_attempts: 3, inactive_attempts: 1, distinct_eighty_scores: 1, missing_notes: 5 }],
      correctAnswer: '통합 결과는 행 개수, 서로 다른 학습자, 비활성 경계, 점수 동점, NULL을 각기 다른 집계로 검사해요. 같은 입력 자료를 두고 각 측정값이 무엇을 세는지 말로 구분해야 해요.',
      wrongOptions: [
        ['COUNT(DISTINCT points) FILTER (WHERE points=80)는 80점 시도 행을 두 개 세요.', 'DISTINCT는 80이라는 점수 값을 한 번만 세요.'],
        ['비활성 행을 세려면 active IS TRUE 조건을 사용해요.', '비활성은 active IS FALSE 조건으로 선택해요.'],
        ['review_note가 NULL이면 빈 문자열 한 건으로 집계돼요.', 'NULL은 누락 상태고 빈 문자열은 별도 text 값이에요.'],
      ],
      tracePrompt: 'attempt를 한 번도 하지 않은 도윤을 제외한 고유 학습자 수, 비활성 수, 고유 80점 수, NULL 메모 수는?',
      traceAnswer: '3, 1, 1, 5',
      traceExplanation: '학습자 1·2·3만 시도가 있어 3명, 비활성 id5 한 건, 80점 값은 두 행이지만 고유 점수는 1개예요. 메모 입력이 없어 다섯 값 모두 NULL이에요.',
      displayExample: 'SELECT COUNT(DISTINCT learner_id) AS learners_with_attempts,\n       COUNT(*) FILTER (WHERE active IS FALSE) AS inactive_attempts,\n       COUNT(DISTINCT points) FILTER (WHERE points = 80) AS distinct_eighty_scores,\n       COUNT(*) FILTER (WHERE review_note IS NULL) AS missing_notes\nFROM attempts;',
      executionNote: '중복·NULL·비활성 fixture 경계를 집계해요. `COUNT(DISTINCT points)`와 행 개수를 바꿔 읽지 않도록 결과 이름을 명시해요.',
      faultyQuery: 'SELECT COUNT(*) FILTER (WHERE points = 80) AS distinct_eighty_scores FROM attempts;',
      errorPrompt: '고유 80점 값 하나가 아니라 80점 시도 두 행을 세는 집계를 찾으세요.',
      errorHint: '행 개수와 DISTINCT 값 개수의 구문 차이를 확인하세요.',
      errorReason: 'COUNT(*)는 80점인 두 시도 행을 모두 세요. 고유한 점수 값을 세려면 `COUNT(DISTINCT points)`가 필요해요.',
    }),
    reviewedDay({
      focus: '최종 성과 집계와 실행 계획 리뷰', objective: '학습자별 활성 점수 총합을 계산해 cohort별 한 행 계약을 만들고 계획을 읽어요.',
      query: 'WITH active_scores AS (SELECT learner_id, SUM(points)::INTEGER AS points_total FROM attempts WHERE active IS TRUE GROUP BY learner_id) SELECT l.cohort, COUNT(*)::INTEGER AS learner_count, COUNT(s.learner_id)::INTEGER AS learners_with_scores, COALESCE(SUM(s.points_total), 0)::INTEGER AS cohort_points FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id GROUP BY l.cohort ORDER BY cohort_points DESC, l.cohort;',
      explainQuery: 'EXPLAIN WITH active_scores AS (SELECT learner_id, SUM(points)::INTEGER AS points_total FROM attempts WHERE active IS TRUE GROUP BY learner_id) SELECT l.cohort, COUNT(*)::INTEGER AS learner_count, COUNT(s.learner_id)::INTEGER AS learners_with_scores, COALESCE(SUM(s.points_total), 0)::INTEGER AS cohort_points FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id GROUP BY l.cohort ORDER BY cohort_points DESC, l.cohort;',
      expectedRows: [
        { cohort: 'A', learner_count: 2, learners_with_scores: 2, cohort_points: 170 },
        { cohort: 'B', learner_count: 1, learners_with_scores: 1, cohort_points: 80 },
        { cohort: 'C', learner_count: 1, learners_with_scores: 0, cohort_points: 0 },
      ],
      correctAnswer: '먼저 attempt를 learner별 한 행으로 집계한 뒤 cohort에 합산해요. LEFT JOIN으로 점수가 없는 학습자를 유지하고 COUNT와 COALESCE에서 사람 수·자료가 없는 합계 표현을 분리해요. EXPLAIN은 이 질의의 계획을 보여 주지만 cost는 실제 시간 보장이 아니에요.',
      wrongOptions: [
        ['attempt·tag를 먼저 모두 JOIN한 뒤 SUM하면 점수 중복 여부를 무시해도 돼요.', '질의에 연결 표가 추가되면 행 grain이 바뀌어 사전 집계 또는 중복 관리가 필요해요.'],
        ['cohort C의 learners_with_scores는 LEFT JOIN 뒤 COUNT(*)이므로 0이에요.', 'COUNT(*)는 도윤 learner 행 하나를 세고, 점수 없는 사람 수는 nullable aggregate key를 세어야 해요.'],
        ['CTE의 이름과 EXPLAIN 결과만 있으면 기대 cohort 값이 자동 검증돼요.', '실제 결과 행과 열을 기대 계약과 따로 비교해야 해요.'],
      ],
      tracePrompt: 'A·B·C cohort별 전체 학습자 수·점수가 있는 학습자 수·활성 점수 합계는?',
      traceAnswer: 'A 2명/2명/170점, B 1명/1명/80점, C 1명/0명/0점',
      traceExplanation: 'A에는 민서의 100과 준의 70, B에는 하린의 80, C에는 점수 기록이 없는 도윤이 있어요. C의 LEFT JOIN 결과는 유지되며 합계 표시만 0이 돼요.',
      displayExample: `WITH active_scores AS (
  SELECT learner_id, SUM(points)::INTEGER AS points_total
  FROM attempts WHERE active IS TRUE GROUP BY learner_id
)
SELECT l.cohort, COUNT(*) AS learner_count,
       COUNT(s.learner_id) AS learners_with_scores,
       COALESCE(SUM(s.points_total), 0) AS cohort_points
FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id
GROUP BY l.cohort ORDER BY cohort_points DESC, l.cohort;
-- EXPLAIN은 계획 관찰이며 결과 행 검증을 대체하지 않아요.`,
      executionNote: 'PGlite에서 세 cohort 결과와 EXPLAIN 계획 생성을 확인해요. 성능 benchmark·production 통계·운영 배포 DB는 검증하지 않아요.',
      faultyQuery: 'SELECT l.cohort, SUM(a.points) FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.cohort; -- inactive/learner empty and output order unresolved',
      errorPrompt: '활성 조건·기록 없는 학습자·정렬 계약을 모두 놓친 최종 요약 질의를 찾으세요.',
      errorHint: '활성 attempt를 먼저 집계하고 전체 learners 기준 LEFT JOIN 뒤 cohort를 묶으세요.',
      errorReason: '현재는 비활성 점수를 포함하고 시도 없는 학습자를 빠뜨리며 cohort 행 순서도 지정하지 않아요. 각 계약을 CTE·LEFT JOIN·보조 정렬 키로 명시하세요.',
      repairStarter: 'SELECT l.cohort, SUM(a.points) FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.cohort;',
      repairCode: 'WITH active_scores AS (SELECT learner_id, SUM(points)::INTEGER AS points_total FROM attempts WHERE active IS TRUE GROUP BY learner_id) SELECT l.cohort, COUNT(*)::INTEGER AS learner_count, COUNT(s.learner_id)::INTEGER AS learners_with_scores, COALESCE(SUM(s.points_total), 0)::INTEGER AS cohort_points FROM learners AS l LEFT JOIN active_scores AS s ON s.learner_id = l.id GROUP BY l.cohort ORDER BY cohort_points DESC, l.cohort;',
      repairInput: '전체 4명·5회 시도·비활성 점수와 cohort A/B/C 경계',
      repairOutput: 'A 2/2/170, B 1/1/80, C 1/0/0 결과와 결정적 cohort 순서',
    }),
  ],
};
