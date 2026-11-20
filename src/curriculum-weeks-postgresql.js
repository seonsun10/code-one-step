import { choice, locateError, repairCode, shortAnswer, versionedShortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { postgresqlReviewedWeeksFourToSix } from './curriculum-postgresql-w04-w06-reviewed.js';
import { postgresqlReviewedWeeksSevenToNine } from './curriculum-postgresql-w07-w09-reviewed.js';
import { postgresqlReviewedWeeksTenToTwelve } from './curriculum-postgresql-w10-w12-reviewed.js';
import { postgresqlReviewedWeeksThirteenToFifteen } from './curriculum-postgresql-w13-w15-reviewed.js';
import { postgresqlReviewedWeeksSixteenToEighteen } from './curriculum-postgresql-w16-w18-reviewed.js';
import { postgresqlReviewedWeeksNineteenToTwentyOne } from './curriculum-postgresql-w19-w21-reviewed.js';
import { postgresqlReviewedWeeksTwentyTwoToTwentyFour } from './curriculum-postgresql-w22-w24-reviewed.js';
import { postgresqlReviewedWeeksTwentyFiveToTwentySeven } from './curriculum-postgresql-w25-w27-reviewed.js';
import { postgresqlReviewedWeeksTwentyEightToThirty } from './curriculum-postgresql-w28-w30-reviewed.js';
import { postgresqlReviewedWeeksThirtyOneToThirtyThree } from './curriculum-postgresql-w31-w33-reviewed.js';
import { postgresqlReviewedWeeksThirtyFourToThirtySix } from './curriculum-postgresql-w34-w36-reviewed.js';
import { postgresqlReviewedWeeksThirtySevenToThirtyNine } from './curriculum-postgresql-w37-w39-reviewed.js';

const phases = [
  { id: 'postgresql-phase-1', number: 1, title: '입문 · 관계형 표와 조회', startWeek: 1, endWeek: 7, objective: '테이블·행·열을 읽고 SELECT, 조건식, 정렬과 페이지 나누기로 원하는 자료를 가져와요.' },
  { id: 'postgresql-phase-2', number: 2, title: '기초 · 함수와 그룹 집계', startWeek: 8, endWeek: 13, objective: 'NULL, 문자열·날짜 함수, CASE와 집계 그룹을 구분해요.' },
  { id: 'postgresql-phase-3', number: 3, title: '중급 · 관계와 질의 조합', startWeek: 14, endWeek: 20, objective: 'JOIN·하위 질의·CTE·집합 연산으로 질의를 합성해요.' },
  { id: 'postgresql-phase-4', number: 4, title: '고급 · 분석 질의와 스키마', startWeek: 21, endWeek: 25, objective: '윈도 분석, 제약 조건과 정규화로 질의와 데이터 구조를 설계해요.' },
  { id: 'postgresql-phase-5', number: 5, title: '심화 · 변경·트랜잭션·성능', startWeek: 26, endWeek: 32, objective: '데이터 변경과 트랜잭션·인덱스·뷰·자료형을 안전하게 다뤄요.' },
  { id: 'postgresql-phase-6', number: 6, title: '실전 · 안전한 통합 질의', startWeek: 33, endWeek: 39, objective: '입력 경계·오류 진단·성능 관찰과 통합 결과 검증을 실습해요.' },
];

const plans = [
  { title: '관계형 표와 결과 행', objective: '테이블을 행과 열의 관계로 읽고 필요한 열만 선택해요.', days: ['데이터베이스와 테이블', '행과 열', '기본 키의 역할', '명시적인 열 선택', '결과 집합 읽기'], terms: ['테이블', '행', 'PRIMARY KEY', 'SELECT', '결과 집합'], correct: ['자료의 행과 열을 저장하는 관계형 표', '한 건의 레코드', '행을 유일하게 식별하는 제약', '반환할 열을 고르는 SQL 절', '질의 결과로 반환된 행들의 모음'], wrong: ['각 행이 열 이름을 정의해요.', '행 순서는 항상 입력 순서예요.', 'PRIMARY KEY는 중복값과 NULL을 허용해요.'], query: 'SELECT id, name FROM learners WHERE id <= __DAY__ ORDER BY id;', bug: ['SELECT * FROM learners;', 'WHERE cohort = \'A\';'], line: 1, fix: 'SELECT id, name FROM learners;', reason: '화면과 결과 계약에 필요한 열만 요청하면 열 순서·개인 정보·자료 전송을 분명히 관리할 수 있어요.' },
  { title: 'FROM과 별칭', objective: '자료가 시작되는 테이블과 읽기 쉬운 열 별칭을 지정해요.', days: ['FROM의 자료 출처', '테이블 별칭', '열 별칭', '계산식 별칭', '모호한 열 이름'], terms: ['FROM', 'AS', '열 별칭', '표준 출력 열 이름', '테이블 별칭'], correct: ['읽을 테이블을 지정하는 절', '테이블이나 열에 질의 안에서 사용할 이름을 붙이는 키워드', '결과 열에 붙이는 표시 이름', 'AS로 정한 결과 열 이름', '질의에서 테이블 이름을 짧게 부르는 이름'], wrong: ['FROM은 반환 행을 정렬해요.', 'AS는 저장된 실제 열 이름을 바꿔요.', '테이블 별칭은 데이터베이스에 새 테이블을 만들어요.'], query: 'SELECT l.name AS learner_name FROM learners AS l WHERE l.id <= __DAY__ ORDER BY l.id;', bug: ['SELECT name AS learner_name', 'FROM attempts AS a;', 'WHERE a.id <= 2;'], line: 1, fix: 'SELECT name AS learner_name', reason: '결과 표시 이름은 AS 별칭으로 정할 수 있지만 원본 테이블 구조나 저장 데이터는 바뀌지 않아요.' },
  { title: 'WHERE 비교와 경계값', objective: '비교 연산자의 포함 범위를 요구사항과 맞춰요.', days: ['같음과 다름', '초과와 이상', '미만과 이하', '숫자 경계값', 'BETWEEN 양 끝값 포함'], terms: ['=', '>', '<', '>=', 'BETWEEN'], correct: ['두 값이 같은지 비교하는 연산자', '기준값을 포함하지 않고 더 큰 값을 고르는 연산자', '기준값보다 작은 값을 고르는 연산자', '기준값을 포함해 크거나 같은 값을 고르는 연산자', '두 경계값을 모두 포함하는 범위 조건'], wrong: ['=는 행에 값을 대입해요.', '“70 초과”에 >=를 쓰면 경계값 70도 제외돼요.', 'WHERE는 집계가 끝난 그룹을 거릅니다.'], query: 'SELECT id, points FROM attempts WHERE points >= __DAY__ * 10 ORDER BY id;', bug: ['SELECT id FROM attempts', 'WHERE points > 60;', 'ORDER BY id;'], line: 2, fix: 'SELECT id FROM attempts WHERE points >= 60 ORDER BY id;', reason: '요구사항이 기준값을 포함하는 “이상”이면 `>=`를 써야 경계값을 빠뜨리지 않아요.' },
  { title: 'AND·OR·NOT', objective: '여러 조건의 결합과 괄호 우선순위를 확인해요.', days: ['AND 모두 참', 'OR 하나 참', 'NOT 반전', '괄호 우선순위', '조건 분해'], terms: ['AND', 'OR', 'NOT', '괄호', 'Boolean 조건식'], correct: ['두 조건이 모두 참일 때 행을 남기는 연산자', '여러 조건 중 하나가 참이면 행을 남기는 연산자', '조건의 참·거짓을 반전하는 연산자', 'AND와 OR가 섞인 조건의 의도를 분명하게 묶는 기호', '참 또는 거짓으로 판정되는 비교의 조합'], wrong: ['AND는 한 조건만 참이어도 통과해요.', 'OR는 모든 조건이 참이어야 해요.', '괄호 없이 AND와 OR를 읽으면 문맥에 따라 순서가 달라져요.'], query: 'SELECT id FROM attempts WHERE active = TRUE AND points > __DAY__ ORDER BY id;', bug: ['SELECT id FROM attempts', 'WHERE active = TRUE OR points > 70;', 'ORDER BY id;'], line: 2, fix: 'SELECT id FROM attempts WHERE active = TRUE AND points > 70 ORDER BY id;', reason: '모든 조건을 만족해야 하는 요구사항은 AND로 연결해요. OR를 쓰면 한 조건만 맞아도 행이 포함됩니다.' },
  { title: 'NULL과 알 수 없는 값', objective: 'NULL을 비교 연산이 아닌 전용 조건과 대체 함수로 다뤄요.', days: ['NULL은 값이 없음', 'IS NULL', 'IS NOT NULL', 'COALESCE', 'NULL 전파'], terms: ['미지 또는 누락 값', 'IS NULL', 'IS NOT NULL', 'COALESCE', 'UNKNOWN'], correct: ['값이 없거나 알 수 없음을 나타내는 상태', 'NULL인 행을 찾는 조건', 'NULL이 아닌 행을 찾는 조건', '첫 번째 NULL이 아닌 인자를 고르는 함수', 'NULL 비교에서 참·거짓으로 단정되지 않는 논리 상태'], wrong: ['NULL은 0과 같아요.', 'NULL = NULL은 항상 참이에요.', 'COALESCE는 모든 NULL 값을 빈 문자열로 바꿔요.'], query: "SELECT COALESCE(NULL, '대체값') AS display_name WHERE __DAY__ > 0;", bug: ['SELECT id FROM attempts', 'WHERE points = NULL;'], line: 2, fix: 'SELECT id FROM attempts WHERE points IS NULL;', reason: 'NULL과 일반 값을 등호로 비교하면 참으로 판단할 수 없어요. IS NULL 또는 IS NOT NULL로 상태를 검사합니다.' },
  { title: 'ORDER BY와 안정된 정렬', objective: '오름·내림차순과 동점 보조 키를 지정해 결과 순서를 안정화해요.', days: ['ASC 기본 정렬', 'DESC 내림차순', '두 번째 정렬 키', 'NULLS FIRST와 LAST', '정렬의 결정성'], terms: ['ASC', 'DESC', '보조 정렬 키', 'NULLS LAST', '결정적인 순서'], correct: ['작은 값부터 정렬하는 방향', '큰 값부터 정렬하는 방향', '앞선 열이 같은 행의 순서를 결정하는 추가 기준', 'NULL을 정렬 결과의 마지막으로 보내는 옵션', '같은 입력에서 행 순서를 다시 재현할 수 있는 기준'], wrong: ['DESC는 행을 삭제해요.', 'ORDER BY는 동점 행의 순서를 언제나 보장해요.', '여러 정렬 기준은 모두 같은 방향이어야 해요.'], query: 'SELECT id, points FROM attempts ORDER BY points DESC, id ASC LIMIT __DAY__;', bug: ['SELECT id, points FROM attempts', 'ORDER BY points DESC', 'LIMIT 3;'], line: 2, fix: 'SELECT id, points FROM attempts ORDER BY points DESC, id ASC LIMIT 3;', reason: '점수가 같은 행의 순서를 고정하려면 id 같은 보조 키를 추가해 페이지 이동과 비교 결과를 안정화해요.' },
  { title: 'LIMIT·OFFSET과 페이지', objective: '상한과 건너뛸 행 수를 사용해 작은 결과 페이지를 구성해요.', days: ['LIMIT 상한', 'OFFSET 건너뛰기', '페이지 계산', '정렬 뒤 페이지', '페이지 경계'], terms: ['LIMIT', 'OFFSET', '(페이지 - 1) × 크기', '정렬 후 페이지 나누기', '빈 다음 페이지'], correct: ['반환할 최대 행 수를 제한하는 절', '앞에서 건너뛸 행 수를 지정하는 절', '0부터 시작하는 페이지 시작 행 계산식', '항상 같은 결과를 위해 정렬을 먼저 명시하는 방식', '자료 개수와 페이지 크기를 비교해 표시하는 상태'], wrong: ['OFFSET은 테이블의 앞 행을 영구 삭제해요.', 'LIMIT/OFFSET은 정렬 기준이 없어도 행 순서가 안정적이에요.', '페이지 번호에 페이지 크기를 곱하면 첫 페이지 offset은 0이 아니에요.'], query: 'SELECT id, name FROM learners ORDER BY id LIMIT 2 OFFSET __DAY__ - 1;', bug: ['SELECT id, name FROM learners', 'LIMIT 2 OFFSET 2', 'ORDER BY id;'], line: 2, fix: 'SELECT id, name FROM learners ORDER BY id LIMIT 2 OFFSET 2;', reason: '페이지를 나누기 전 결정적인 정렬을 정하고, offset은 `(페이지 번호 - 1) × 페이지 크기`로 계산합니다.' },
  { title: '문자열 함수와 패턴', objective: '대소문자·부분 문자열·패턴 조건으로 텍스트를 가공하고 찾습니다.', days: ['LOWER와 UPPER', '문자열 길이', '부분 문자열 검색', 'LIKE 와일드카드', 'ILIKE 대소문자 무시'], terms: ['LOWER', 'LENGTH', 'POSITION', 'LIKE', 'ILIKE'], correct: ['문자열을 소문자로 바꾸는 함수', '문자열의 문자 수를 세는 함수', '문자열 안에서 다른 문자열 위치를 찾는 함수', '%와 _를 쓰는 패턴 비교 연산자', '대소문자를 구분하지 않는 LIKE 패턴 연산자'], wrong: ['LOWER는 원본 열을 저장 즉시 바꿔요.', 'LIKE의 %는 정확히 한 글자를 뜻해요.', 'ILIKE는 PostgreSQL에서 지원하지 않는 동작이에요.'], query: "SELECT id, LOWER(topic) AS topic_key FROM attempts WHERE topic ILIKE 's%' AND id <= __DAY__ + 5 ORDER BY id;", bug: ["SELECT id FROM attempts", "WHERE topic LIKE 'S%';"], line: 2, fix: "SELECT id FROM attempts WHERE topic ILIKE 's%';", reason: '`LIKE`의 `%`는 0개 이상의 문자, `_`는 한 문자를 나타내며 PostgreSQL `ILIKE`는 대소문자를 무시합니다.' },
  { title: '날짜와 시간 값', objective: '날짜 자료형과 범위 조건, 시간대 표현을 구분해요.', days: ['DATE 자료형', '날짜 리터럴', '날짜 범위', '날짜 더하기', '타임스탬프와 시간대'], terms: ['DATE', 'DATE 리터럴', '범위 조건', 'INTERVAL', 'TIMESTAMPTZ'], correct: ['연·월·일을 표현하는 날짜 자료형', 'DATE를 명시해 해석을 분명하게 한 상수', '시작 포함과 다음 시작 제외를 함께 쓰는 조건', '시간이나 날짜 간격을 표현하는 자료형', '시각과 시간대 정보를 함께 나타내는 자료형'], wrong: ['문자열 날짜는 언제나 세션 설정과 무관하게 해석돼요.', 'BETWEEN은 항상 시작 포함·끝 제외 범위예요.', 'TIMESTAMP와 TIMESTAMPTZ는 시간대 의미가 같아요.'], query: "SELECT id, submitted_on FROM attempts WHERE submitted_on >= DATE '2026-01-01' AND submitted_on < DATE '2026-06-01' + INTERVAL '__DAY__ days' ORDER BY id;", bug: ["SELECT id FROM attempts", "WHERE submitted_on BETWEEN DATE '2026-01-01' AND DATE '2026-02-01';"], line: 2, fix: "SELECT id FROM attempts WHERE submitted_on >= DATE '2026-01-01' AND submitted_on < DATE '2026-02-01';", reason: '기간 조회는 시작일 포함, 다음 기간 시작일 제외로 표현하면 시각이 포함된 열에서도 경계가 명확해요.' },
  { title: 'DISTINCT와 중복 기준', objective: '중복 행 전체와 일부 열 기준 중복 제거 차이를 확인해요.', days: ['DISTINCT 단일 열', '복합 열 조합', 'COUNT DISTINCT', '중복 원인 추적', 'DISTINCT ON'], terms: ['DISTINCT', '복합 값 조합', 'COUNT(DISTINCT ...)', 'JOIN 카디널리티', 'DISTINCT ON'], correct: ['선택 결과의 중복 행을 제거하는 키워드', '함께 선택한 열 값의 조합이 중복 기준이 되는 것', '고유한 값의 개수를 세는 집계 식', '조인 후 행이 늘어나는 정도와 원인을 나타내는 성질', '정렬 기준 첫 행을 그룹별로 남기는 PostgreSQL 확장 문법'], wrong: ['DISTINCT는 원본 테이블 중복 데이터를 삭제해요.', 'SELECT DISTINCT a, b는 a만 비교해 중복을 제거해요.', 'DISTINCT ON은 ORDER BY 없이 어떤 행을 택할지 늘 고정돼요.'], query: 'SELECT DISTINCT topic FROM attempts WHERE id <= __DAY__ + 3 ORDER BY topic;', bug: ['SELECT DISTINCT topic, id FROM attempts', 'ORDER BY topic;'], line: 1, fix: 'SELECT DISTINCT topic FROM attempts ORDER BY topic;', reason: 'DISTINCT는 선택한 모든 열의 조합을 비교합니다. 중복 기준에 포함할 열을 분명히 지정하세요.' },
  { title: 'CASE와 조건 결과', objective: '우선순위가 있는 조건을 CASE로 분류하고 NULL 대체를 구분해요.', days: ['검색 CASE', '조건 순서', 'NULL 대체', 'NULLIF', '분류 결과 검증'], terms: ['CASE', '가장 구체적인 조건 먼저', 'COALESCE', 'NULLIF', 'ELSE'], correct: ['행별 조건에 따라 결과 값을 선택하는 표현식', '겹치는 조건에서는 더 좁은 범위부터 검사하는 순서', '첫 NULL 아닌 인자를 반환하는 함수', '두 인자가 같으면 NULL을 돌려주는 함수', '어떤 WHEN에도 맞지 않을 때 선택하는 분기'], wrong: ['CASE는 만족하는 모든 WHEN을 연속 실행해요.', 'ELSE가 없으면 항상 0을 반환해요.', 'COALESCE는 NULL이 아닌 값도 모두 바꿔요.'], query: "SELECT id, CASE WHEN points >= __DAY__ * 10 THEN 'pass' ELSE 'retry' END AS result FROM attempts ORDER BY id;", bug: ["SELECT id, CASE WHEN points >= 60 THEN 'pass'", "WHEN points >= 90 THEN 'high' END AS result", 'FROM attempts;'], line: 1, fix: "SELECT id, CASE WHEN points >= 90 THEN 'high' WHEN points >= 60 THEN 'pass' ELSE 'retry' END AS result FROM attempts;", reason: 'CASE는 첫 번째로 참인 WHEN 결과를 반환하므로 겹치는 범위는 더 구체적인 조건부터 검사해야 해요.' },
  { title: 'COUNT·SUM·AVG 집계', objective: '행 수와 NULL을 제외한 값의 집계 의미를 비교해요.', days: ['COUNT(*)', 'COUNT(열)', 'SUM', 'AVG', '집계와 NULL'], terms: ['COUNT(*)', 'COUNT(column)', 'SUM', 'AVG', 'COUNT(*)와 COUNT(column)의 차이'], correct: ['NULL 여부와 관계없이 그룹의 행 수를 세는 집계', '해당 열이 NULL이 아닌 행을 세는 집계', '숫자 합계를 구하는 집계 함수', 'NULL을 제외한 값의 산술 평균을 구하는 함수', 'COUNT(*)는 행, COUNT(column)은 존재하는 열 값의 수를 세는 차이'], wrong: ['COUNT(*)는 한 열이 NULL이면 행을 세지 않아요.', 'AVG는 NULL을 0으로 바꾼 뒤 평균을 계산해요.', 'SUM은 GROUP BY 없이 여러 행마다 다른 결과를 내요.'], query: 'SELECT topic, COUNT(*)::INTEGER AS attempts, SUM(points)::INTEGER AS total FROM attempts WHERE id <= __DAY__ + 2 GROUP BY topic ORDER BY topic;', bug: ['SELECT topic, COUNT(*) AS attempts, points', 'FROM attempts GROUP BY topic;'], line: 1, fix: 'SELECT topic, COUNT(*) AS attempts, SUM(points) AS total FROM attempts GROUP BY topic;', reason: '집계 결과와 함께 일반 열을 반환하려면 그 열을 GROUP BY에 넣거나 집계 함수로 감싸야 합니다.' },
  { title: 'GROUP BY와 HAVING', objective: '행 필터와 집계 그룹 필터를 올바른 순서에 배치해요.', days: ['그룹 키', '여러 그룹 키', 'WHERE 먼저 적용', 'HAVING 집계 필터', '집계 행 수 확인'], terms: ['GROUP BY', '복합 그룹 키', 'WHERE', 'HAVING', '그룹 결과'], correct: ['같은 키 값을 가진 행을 집계 그룹으로 묶는 절', '선택한 여러 열의 값 조합으로 그룹을 나누는 기준', '집계 전에 개별 행을 거르는 절', '집계한 그룹을 조건으로 거르는 절', '같은 그룹의 집계 값이 한 행으로 요약된 결과'], wrong: ['HAVING은 집계 전 개별 행만 검사해요.', 'WHERE에서 SUM(points)를 바로 사용할 수 있어요.', 'GROUP BY는 결과 순서를 보장해요.'], query: 'SELECT learner_id, SUM(points)::INTEGER AS total FROM attempts WHERE active = TRUE AND id <= __DAY__ + 3 GROUP BY learner_id HAVING SUM(points) >= 50 ORDER BY total DESC;', bug: ['SELECT learner_id, SUM(points) AS total FROM attempts', 'WHERE SUM(points) >= 50', 'GROUP BY learner_id;'], line: 2, fix: 'SELECT learner_id, SUM(points) AS total FROM attempts GROUP BY learner_id HAVING SUM(points) >= 50;', reason: 'WHERE는 행을 먼저 걸러내고 HAVING은 GROUP BY 이후 집계값 조건으로 그룹을 골라요.' },
  { title: 'INNER JOIN과 관계 키', objective: '외래 키 관계를 사용해 서로 연결된 행을 결합해요.', days: ['JOIN과 ON', '기본 키·외래 키', '테이블 별칭', '필요 열만 선택', '조인 결과 행 수'], terms: ['INNER JOIN', 'ON', '외래 키', '다대일 관계', '조인 키'], correct: ['두 테이블에 일치하는 행만 반환하는 조인', '두 테이블의 행 연결 조건을 적는 절', '다른 테이블의 키를 참조하는 열', '여러 자식 행이 부모 한 행을 참조할 수 있는 관계', '양쪽의 같은 개체를 연결하는 키 열'], wrong: ['JOIN은 같은 이름 열을 자동으로 찾아 항상 연결해요.', '외래 키는 중복값을 허용하지 않아요.', 'JOIN 결과는 원본 행 수보다 절대 늘지 않아요.'], query: 'SELECT l.name, a.topic FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id WHERE a.id <= __DAY__ + 2 ORDER BY a.id;', bug: ['SELECT l.name, a.topic FROM learners AS l JOIN attempts AS a', 'ON a.learner_id = l.name;'], line: 2, fix: 'SELECT l.name, a.topic FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id;', reason: '조인 키는 같은 의미의 식별자끼리 연결합니다. 이름처럼 표시용 문자열과 기본 키를 섞지 않도록 해요.' },
  { title: 'LEFT JOIN과 NULL 확장 행', objective: '일치하지 않는 왼쪽 행을 유지하고 COUNT 기준을 고릅니다.', days: ['LEFT JOIN 보존', '일치 자료 없음', 'COUNT(*) 함정', 'COUNT(오른쪽 키)', 'ON 조건 위치'], terms: ['LEFT JOIN', 'NULL 확장 행', 'COUNT(*)', 'COUNT(right.id)', 'ON'], correct: ['왼쪽의 모든 행을 남기고 오른쪽 일치 자료가 없으면 NULL로 채우는 조인', '오른쪽 행이 없을 때 오른쪽 열에 생기는 NULL 행', 'LEFT JOIN 뒤 일치 행이 없는 경우도 세는 집계', '실제로 연결된 오른쪽 키의 수를 세는 집계', '오른쪽 행 제한을 두어 왼쪽 행 보존을 유지할 수 있는 절'], wrong: ['LEFT JOIN은 연결되지 않은 왼쪽 행을 버려요.', 'COUNT(*)는 오른쪽 일치 건수와 항상 같아요.', '오른쪽 조건을 WHERE에 두어도 모든 왼쪽 행이 유지돼요.'], query: 'SELECT l.id, COUNT(a.id)::INTEGER AS attempts FROM learners AS l LEFT JOIN attempts AS a ON a.learner_id = l.id AND a.active = TRUE WHERE l.id <= __DAY__ + 2 GROUP BY l.id ORDER BY l.id;', bug: ['SELECT l.id, COUNT(*) FROM learners AS l', 'LEFT JOIN attempts AS a ON a.learner_id = l.id', 'GROUP BY l.id;'], line: 1, fix: 'SELECT l.id, COUNT(a.id) FROM learners AS l LEFT JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.id;', reason: '연결 행 수는 NULL이 아닌 오른쪽 기본 키를 세어요. COUNT(*)는 왼쪽 학습자 행도 함께 셉니다.' },
  { title: '다대다 조인과 중복', objective: '조인 카디널리티로 합계가 부풀어 오르는 원인을 찾습니다.', days: ['일대다 행 증가', '다대다 연결', '중복 합계', '조인 전 집계', '유일성 검증'], terms: ['일대다', '연결 테이블', '카디널리티', '먼저 집계하기', 'UNIQUE 제약'], correct: ['한 부모 행에 여러 자식 행이 연결되는 관계', '두 다수 관계를 연결하는 별도의 테이블', '관계가 결합된 뒤 생성되는 행의 수와 분포', '각 원본 행을 한 번만 세도록 미리 묶는 전략', '같은 값 조합이 중복 저장되지 않도록 하는 제약'], wrong: ['일대다 JOIN은 항상 부모마다 결과 한 행만 반환해요.', 'DISTINCT를 추가하면 잘못 부풀어난 합계를 원래 값으로 되돌려요.', '카디널리티는 한 열에 저장된 데이터 형식이에요.'], query: 'WITH totals AS (SELECT learner_id, SUM(points)::INTEGER AS points_sum FROM attempts GROUP BY learner_id) SELECT l.name, totals.points_sum FROM learners AS l JOIN totals ON totals.learner_id = l.id WHERE l.id <= __DAY__ + 1 ORDER BY l.id;', bug: ['SELECT l.id, SUM(a.points) FROM learners AS l', 'JOIN attempts AS a ON a.learner_id = l.id', 'JOIN attempts AS again ON again.learner_id = l.id', 'GROUP BY l.id;'], line: 1, fix: 'SELECT l.id, SUM(a.points) FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.id;', reason: '같은 다수 테이블을 중복 조인하면 원래 합계가 여러 번 더해질 수 있어요. 합칠 단위를 먼저 정리하고 조인하세요.' },
  { title: 'IN·EXISTS와 하위 질의', objective: '값 목록 검사와 관련 행 존재 여부 검사를 비교해요.', days: ['IN 목록', '하위 질의 결과', 'EXISTS', '상관 하위 질의', 'NOT EXISTS와 NULL'], terms: ['IN', '하위 질의', 'EXISTS', '상관 하위 질의', 'NOT EXISTS'], correct: ['값이 하위 질의의 결과 집합 안에 있는지 확인하는 조건', '다른 질의 안에서 하나의 결과를 제공하는 질의', '조건에 맞는 행이 하나라도 있는지 검사하는 표현식', '바깥 질의의 열을 참조하는 하위 질의', '연결된 자식 행이 없다는 사실을 확인하는 패턴'], wrong: ['IN은 결과를 정렬해요.', 'EXISTS는 모든 행을 반환해야 참이에요.', 'NOT IN은 하위 결과에 NULL이 있어도 항상 직관적인 부정을 해요.'], query: 'SELECT l.id, l.name FROM learners AS l WHERE EXISTS (SELECT 1 FROM attempts AS a WHERE a.learner_id = l.id AND a.id <= __DAY__ + 1) ORDER BY l.id;', bug: ['SELECT l.id FROM learners AS l', 'WHERE EXISTS (SELECT a.id FROM attempts AS a);'], line: 2, fix: 'SELECT l.id FROM learners AS l WHERE EXISTS (SELECT 1 FROM attempts AS a WHERE a.learner_id = l.id);', reason: 'EXISTS는 하위 질의가 바깥 행과 연결된 결과를 하나라도 내는지 확인해야 해요.' },
  { title: '상관 스칼라 질의', objective: '한 값 반환 제약과 평균·최댓값 등 비교 질의를 작성해요.', days: ['스칼라 결과', '여러 행 오류', '전체 평균', '상관 조건', 'NULL 결과'], terms: ['스칼라 하위 질의', '한 열·최대 한 행', 'AVG', '상관 참조', '빈 결과의 NULL'], correct: ['표현식 위치에서 단일 값을 제공하는 하위 질의', '스칼라 하위 질의 결과에 필요한 행 개수 제한', 'NULL 입력을 제외한 평균을 계산하는 함수', '바깥 질의 행 값에 따라 달라지는 하위 질의', '집계 입력이 없을 때 AVG가 반환하는 값'], wrong: ['스칼라 자리에 여러 행이 와도 첫 행을 자동 선택해요.', 'AVG는 빈 입력에서 0을 반환해요.', '상관 하위 질의는 외부 행과 연결할 수 없어요.'], query: 'SELECT id, points FROM attempts WHERE points > (SELECT AVG(points) FROM attempts) AND id <= __DAY__ + 3 ORDER BY id;', bug: ['SELECT id FROM attempts', 'WHERE points > (SELECT points FROM attempts);'], line: 2, fix: 'SELECT id FROM attempts WHERE points > (SELECT AVG(points) FROM attempts);', reason: '비교할 행마다 여러 결과가 나오면 스칼라 하위 질의 오류가 발생합니다. 집계로 하나의 비교값을 만들어요.' },
  { title: 'WITH CTE와 단계 분리', objective: '이름을 가진 임시 질의 단계로 복잡한 결과를 읽기 쉽게 나눠요.', days: ['WITH 기본', '여러 CTE 연결', '이전 단계 재사용', '비재귀 CTE', '단계별 검증'], terms: ['WITH', 'CTE', '쉼표로 CTE 추가', '다음 단계에서 앞선 CTE 참조', '중간 결과 검증'], correct: ['이름 있는 질의 결과를 정의한 뒤 본문에서 쓰는 절', 'WITH 절의 이름 붙은 공통 테이블 식', '두 번째 CTE 정의를 시작하는 구분 기호', '뒤에서 먼저 정의된 CTE를 참조하는 방식', '작은 단계의 입력과 결과를 나눠 확인하는 방법'], wrong: ['CTE는 데이터베이스에 영구 테이블을 생성해요.', 'CTE 이름은 기본 질의보다 먼저 참조할 수 있어요.', 'CTE를 쓰면 성능이 항상 빨라져요.'], query: 'WITH selected AS (SELECT id, learner_id, points FROM attempts WHERE id <= __DAY__ + 3), totals AS (SELECT learner_id, SUM(points)::INTEGER AS points_sum FROM selected GROUP BY learner_id) SELECT learner_id, points_sum FROM totals ORDER BY learner_id;', bug: ['WITH selected AS (SELECT id FROM attempts)', 'SELECT learner_id FROM selected;', 'WHERE id <= 2;'], line: 2, fix: 'WITH selected AS (SELECT id, learner_id FROM attempts WHERE id <= 2) SELECT learner_id FROM selected;', reason: 'CTE를 정의한 뒤 메인 질의에서 이름으로 사용합니다. 필터를 중간 단계 안에 두면 필요한 행 흐름이 명확해져요.' },
  { title: 'UNION 계열과 집합 결과', objective: '집합 연산의 열 호환성과 중복 제거 기준을 설명해요.', days: ['UNION', 'UNION ALL', '열 개수와 형식', 'EXCEPT', 'INTERSECT'], terms: ['UNION', 'UNION ALL', '같은 열 개수와 호환 형식', 'EXCEPT', 'INTERSECT'], correct: ['두 결과를 합치고 중복 행을 제거하는 연산자', '두 결과를 합치며 중복 행도 보존하는 연산자', '집합 연산의 양쪽 결과가 맞춰야 하는 구조', '왼쪽 결과 중 오른쪽에 없는 행을 반환하는 연산자', '양쪽 결과에 모두 있는 행을 반환하는 연산자'], wrong: ['UNION ALL은 자동으로 중복을 제거해요.', '집합 연산은 결과 열 개수가 달라도 자동 보완해요.', 'EXCEPT는 오른쪽에만 있는 행을 반환해요.'], query: 'SELECT id FROM learners WHERE id <= __DAY__ UNION SELECT learner_id FROM attempts WHERE learner_id <= __DAY__ ORDER BY id;', bug: ['SELECT id, name FROM learners', 'UNION', 'SELECT learner_id FROM attempts;'], line: 1, fix: 'SELECT id FROM learners UNION SELECT learner_id FROM attempts;', reason: '집합 연산 양쪽은 같은 개수의 열을 호환되는 형식으로 반환해야 합니다.' },
  { title: '윈도 함수 기본', objective: '그룹 행을 줄이지 않고 각 행에 분석 값을 붙여요.', days: ['OVER', 'PARTITION BY', '윈도 ORDER BY', 'ROW_NUMBER', '그룹 집계와 윈도 집계'], terms: ['OVER', 'PARTITION BY', '윈도 ORDER BY', 'ROW_NUMBER()', '윈도 함수'], correct: ['함수를 행 집합 위에서 계산할 윈도로 바꾸는 절', '계산 구간을 그룹별로 나누는 옵션', '각 분할 안에서 함수 계산 순서를 정하는 옵션', '분할 안에서 연속 순번을 반환하는 함수', '원본 결과 행을 유지하며 주변 행 기준 값을 계산하는 함수'], wrong: ['PARTITION BY는 결과 행을 삭제해요.', 'GROUP BY 없이 윈도 함수는 사용할 수 없어요.', 'ROW_NUMBER는 동점 행에 반드시 같은 번호를 줘요.'], query: 'SELECT id, topic, points, ROW_NUMBER() OVER (PARTITION BY topic ORDER BY points DESC, id) AS row_no FROM attempts WHERE id <= __DAY__ + 4 ORDER BY topic, row_no;', bug: ['SELECT topic, points, ROW_NUMBER() OVER (ORDER BY topic)', 'FROM attempts', 'GROUP BY topic;'], line: 1, fix: 'SELECT id, topic, points, ROW_NUMBER() OVER (PARTITION BY topic ORDER BY points DESC) FROM attempts;', reason: '윈도 함수는 GROUP BY처럼 원본 행을 하나로 줄이지 않습니다. 결과 행마다 분할 안의 계산 값을 붙여요.' },
  { title: 'RANK·DENSE_RANK와 동점', objective: '동점이 있을 때 순위 번호와 건너뛰는 순서를 구별해요.', days: ['RANK', 'DENSE_RANK', 'ROW_NUMBER 차이', '정렬 동점', '동점 기준 선택'], terms: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', '동점', '순위 정책'], correct: ['동점 다음 순위 번호를 건너뛰는 함수', '동점 다음 순위 번호를 건너뛰지 않는 함수', '동점 여부와 관계없이 각 행에 별도 번호를 주는 함수', '윈도 정렬 키 값이 같은 두 개 이상의 행', '업무상 동점 표시에 맞춰 선택하는 순위 규칙'], wrong: ['RANK와 DENSE_RANK는 동점에서 같은 다음 번호를 줘요.', 'ROW_NUMBER는 동일 점수면 같은 번호를 반환해요.', 'PARTITION BY는 점수 순위 정렬에 사용돼요.'], query: 'SELECT id, points, RANK() OVER (ORDER BY points DESC) AS rank_no FROM attempts WHERE id <= __DAY__ + 5 ORDER BY points DESC, id;', bug: ['SELECT id, points, RANK() OVER (ORDER BY points DESC, id) AS rank_no', 'FROM attempts;'], line: 1, fix: 'SELECT id, points, RANK() OVER (ORDER BY points DESC) AS rank_no FROM attempts;', reason: 'RANK에서 보조 키까지 윈도 정렬에 넣으면 같은 점수도 서로 다른 순위가 됩니다. 동점을 묶을 열과 표시 순서를 구분하세요.' },
  { title: 'LAG·LEAD와 프레임', objective: '이전·다음 행과 누적 창의 기준 범위를 설정해요.', days: ['LAG 이전 행', 'LEAD 다음 행', '기본값 인자', '누적 SUM', 'ROWS 프레임'], terms: ['LAG()', 'LEAD()', '기본값', '누적 집계', 'ROWS BETWEEN'], correct: ['같은 분할에서 앞선 행의 값을 가져오는 함수', '같은 분할에서 다음 행의 값을 가져오는 함수', '앞 또는 뒤에 가져올 행이 없을 때 반환하는 값', '현재 행까지 누적한 집계 값', '윈도 프레임의 시작과 끝 행 범위를 명시하는 구문'], wrong: ['LAG는 결과를 정렬하는 절이에요.', 'LEAD는 테이블에 다음 행을 추가해요.', '누적 합계는 항상 전체 분할 합계와 같아요.'], query: 'SELECT id, points, LAG(points, 1, 0) OVER (ORDER BY submitted_on, id) AS previous_points FROM attempts WHERE id <= __DAY__ + 4 ORDER BY submitted_on, id;', bug: ['SELECT id, points, LAG(points) OVER () AS previous_points', 'FROM attempts', 'ORDER BY submitted_on;'], line: 1, fix: 'SELECT id, points, LAG(points) OVER (ORDER BY submitted_on, id) AS previous_points FROM attempts ORDER BY submitted_on, id;', reason: '이전·다음 행은 윈도 내부의 정렬을 기준으로 정합니다. 화면 결과를 위한 ORDER BY와 별도로 지정하세요.' },
  { title: '제약 조건과 무결성', objective: '기본 키·외래 키·UNIQUE·CHECK로 잘못된 상태를 차단해요.', days: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK', 'NOT NULL'], terms: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK', 'NOT NULL'], correct: ['행을 유일하게 식별하고 NULL을 허용하지 않는 키 제약', '다른 테이블의 키 존재를 확인하는 관계 제약', '값 또는 값 조합의 중복을 막는 제약', '값이 조건을 만족하는지 검사하는 제약', '필수 열의 NULL 입력을 막는 제약'], wrong: ['외래 키는 관련 테이블이 없어도 값을 허용해요.', 'UNIQUE는 기본 키처럼 항상 NULL을 금지해요.', 'CHECK는 다른 행의 집계 결과를 보장해요.'], query: 'SELECT conname, contype FROM pg_constraint WHERE conrelid = \'learners\'::regclass ORDER BY conname LIMIT __DAY__;', bug: ['CREATE TABLE scores (id INTEGER, points INTEGER);', 'INSERT INTO scores VALUES (1, -5);'], line: 1, fix: 'CREATE TABLE scores (id INTEGER PRIMARY KEY, points INTEGER CHECK (points >= 0));', reason: '제약은 응용 코드뿐 아니라 DB 안에서도 데이터 규칙을 검사해 여러 입력 경로의 일관성을 지켜요.' },
  { title: '정규화와 관계 설계', objective: '반복되는 사실을 분리하고 갱신·삭제 이상을 줄여요.', days: ['반복 데이터', '원자적 열 값', '부분 함수 종속', '갱신 이상', '설계와 조회 조인'], terms: ['정규화', '원자적 값', '기본 키 전체 종속', '갱신 이상', '외래 키 조인'], correct: ['중복 저장과 변경 이상을 줄이도록 관계를 구성하는 과정', '한 열에서 추가 분해할 수 없는 값 단위로 관리하는 원칙', '복합 키의 일부에만 의존하지 않게 하는 원칙', '같은 사실의 반복 수정이 누락되어 값이 달라지는 문제', '분리한 관계의 관련 정보를 질의 시 다시 결합하는 방법'], wrong: ['정규화는 모든 질의를 한 테이블로 합쳐요.', '원자적 값은 언제나 한 글자만 저장한다는 뜻이에요.', '데이터를 분리하면 다시 조회할 수 없어요.'], query: 'SELECT l.cohort, COUNT(a.id)::INTEGER AS attempt_count FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id WHERE l.id <= __DAY__ + 1 GROUP BY l.cohort ORDER BY l.cohort;', bug: ['CREATE TABLE attempts_with_name (id INTEGER, learner_name TEXT, learner_cohort TEXT);', 'INSERT repeated learner facts into every attempt;'], line: 2, fix: 'CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT, cohort TEXT);', reason: '학습자 이름과 기수 사실은 learners에 한 번 저장하고 시도 기록은 외래 키로 연결하면 이름 변경의 반복 수정이 줄어요.' },
  { title: 'INSERT·UPDATE·DELETE', objective: '행 변경 명령의 대상 조건과 RETURNING 결과를 확인해요.', days: ['INSERT 새 행', 'UPDATE 대상 제한', 'DELETE와 WHERE', 'RETURNING', '변경 사전 검토'], terms: ['INSERT', 'UPDATE', 'WHERE 조건', 'RETURNING', '변경 전 SELECT'], correct: ['새 행을 추가하는 명령', '기존 행의 열 값을 바꾸는 명령', '변경·삭제할 행을 제한하는 조건', '변경된 행의 열을 결과로 돌려주는 절', '수정 대상 건수와 키를 먼저 확인하는 절차'], wrong: ['UPDATE에서 WHERE를 생략하면 아무 행도 변경되지 않아요.', 'DELETE FROM은 테이블을 남기고 행만 지워요.', 'RETURNING은 변경 전 값만 반환해요.'], query: 'SELECT id, points FROM attempts WHERE id <= __DAY__ ORDER BY id;', bug: ['UPDATE attempts SET active = FALSE;', '-- 대상 id를 제한하지 않음'], line: 1, fix: 'UPDATE attempts SET active = FALSE WHERE id = 1 RETURNING id, active;', reason: 'UPDATE/DELETE 전에 같은 WHERE로 대상 행을 조회하고, 작은 트랜잭션과 RETURNING으로 영향을 확인하세요.' },
  { title: '트랜잭션과 원자성', objective: '여러 변경의 성공·실패 경계를 트랜잭션으로 묶어요.', days: ['BEGIN', 'COMMIT', 'ROLLBACK', '원자성', '실패 복구'], terms: ['BEGIN', 'COMMIT', 'ROLLBACK', '원자성', '트랜잭션 경계'], correct: ['변경 묶음을 시작하는 명령', '현재 트랜잭션 변경을 확정하는 명령', '현재 트랜잭션 변경을 취소하는 명령', '모든 변경이 성공하거나 함께 취소되는 성질', '작업의 시작·확정·취소를 정하는 범위'], wrong: ['COMMIT은 저장을 취소해요.', 'ROLLBACK은 이미 확정된 트랜잭션을 되돌려요.', '여러 SQL 명령은 자동으로 항상 한 트랜잭션이에요.'], query: 'SELECT current_setting(\'transaction_isolation\') AS isolation_level WHERE __DAY__ > 0;', bug: ['BEGIN;', 'UPDATE accounts SET balance = balance - 100 WHERE id = 1;', 'COMMIT; -- 이체 상대 저장 실패도 확정됨'], line: 3, fix: 'BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;', reason: '관련 변경은 한 트랜잭션에 묶고 중간 단계가 실패하면 COMMIT 대신 ROLLBACK으로 모두 취소합니다.' },
  { title: '격리 수준과 동시 변경', objective: '동시에 실행된 작업에서 읽기·갱신 이상을 이해해요.', days: ['동시 트랜잭션', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE', '재시도 경계'], terms: ['동시성', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE', '직렬화 실패 재시도'], correct: ['여러 트랜잭션이 겹쳐 실행되는 상황', '문장마다 커밋된 자료만 보장하는 기본 격리 수준', '한 트랜잭션 안에서 같은 행의 읽기를 안정화하는 수준', '경쟁 작업의 결과가 직렬 실행과 같도록 보장하는 가장 강한 수준', '직렬화 충돌 후 트랜잭션 전체를 안전하게 다시 실행하는 처리'], wrong: ['격리 수준이 높으면 재시도가 전혀 필요 없어요.', 'READ COMMITTED는 트랜잭션 시작 당시의 스냅샷만 봐요.', '여러 문장을 각각 다시 시도하면 원자성이 유지돼요.'], query: 'SELECT current_setting(\'transaction_isolation\') AS isolation_level WHERE __DAY__ > 0;', bug: ['BEGIN ISOLATION LEVEL SERIALIZABLE;', 'UPDATE inventory SET quantity = quantity - 1 WHERE sku = \'x\';', '-- serialization_failure가 나도 일부 문장만 다시 실행'], line: 3, fix: 'BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE inventory SET quantity = quantity - 1 WHERE sku = \'x\'; COMMIT; -- 직렬화 실패 시 전체 트랜잭션 재시도', reason: '직렬화 오류가 나면 일부 문장만 다시 돌리지 않고 전체 트랜잭션 단위를 재시도해야 결과가 맞아요.' },
  { title: '인덱스와 실행 계획', objective: '선택도·정렬 요구를 확인하고 EXPLAIN으로 접근 경로를 읽어요.', days: ['B-tree 기본', '복합 인덱스 순서', '선택도', 'EXPLAIN', '실측과 추정 비용'], terms: ['B-tree 인덱스', '선두 열', '선택도', 'EXPLAIN', '실행 계획'], correct: ['동등·범위 탐색에 널리 쓰이는 기본 인덱스 구조', '복합 인덱스에서 검색 조건이 잘 활용하는 앞쪽 열', '조건이 전체 행 중 얼마나 좁히는지 나타내는 비율', '실행 없이 계획을 확인하는 명령', 'DB가 선택한 스캔·조인·정렬 경로와 비용 추정'], wrong: ['인덱스가 있으면 항상 순차 스캔보다 빨라요.', '복합 인덱스는 열 순서와 무관하게 똑같이 활용돼요.', 'EXPLAIN ANALYZE는 쿼리를 실행하지 않아요.'], query: 'EXPLAIN SELECT id FROM attempts WHERE points >= __DAY__ * 10 ORDER BY points;', bug: ['CREATE INDEX idx_attempts ON attempts (topic);', 'SELECT id FROM attempts WHERE points = 90;', '-- 인덱스 대상 열이 조건에 맞지 않음'], line: 1, fix: 'CREATE INDEX idx_attempts_points ON attempts (points);', reason: '인덱스는 저장 공간과 쓰기 비용을 더해요. 실제 조건에 맞는 후보를 만들고 실행 계획과 데이터 규모로 효과를 확인하세요.' },
  { title: '인덱스 설계와 부분 인덱스', objective: '복합·부분 인덱스 조건과 쓰기 비용을 함께 따져요.', days: ['복합 키 순서', 'WHERE 부분 인덱스', '정렬과 인덱스', '중복 인덱스', '쓰기 비용'], terms: ['복합 인덱스', '부분 인덱스', '정렬 키와 인덱스', '중복 인덱스 제거', '쓰기 비용'], correct: ['여러 열을 정해진 순서로 저장하는 인덱스', '조건에 맞는 행의 일부만 저장하는 인덱스', '필터와 정렬 열·방향을 고려한 인덱스 구성', '같은 역할을 하는 불필요한 인덱스를 제거하는 점검', '행 추가·수정 때 인덱스도 갱신해야 하는 비용'], wrong: ['각 열의 별도 인덱스를 복합 인덱스와 같다고 볼 수 있어요.', '부분 인덱스 조건은 질의 조건과 관계가 없어요.', '인덱스를 많이 만들수록 쓰기도 빨라져요.'], query: 'SELECT id FROM attempts WHERE active = TRUE AND id <= __DAY__ + 5 ORDER BY submitted_on;', bug: ['CREATE INDEX idx_a ON attempts (points);', 'CREATE INDEX idx_b ON attempts (points);'], line: 2, fix: 'CREATE INDEX idx_a ON attempts (points);', reason: '비슷한 인덱스는 저장과 수정 비용만 늘릴 수 있어요. 질의 계획을 보고 필요한 인덱스만 유지합니다.' },
  { title: 'VIEW와 읽기 모델', objective: '반복 질의를 뷰로 이름 붙이고 보안·갱신 경계를 확인해요.', days: ['CREATE VIEW', '뷰 결과', '단순 갱신 가능성', '뷰 권한', '재사용 계약'], terms: ['VIEW', '뷰 정의 질의', '갱신 가능 뷰', '최소 권한', '뷰 계약'], correct: ['이름을 붙인 저장 질의 정의', '뷰를 조회해 반환되는 행과 열', '조건에 따라 원본 테이블 변경을 허용할 수 있는 뷰', '역할에 필요한 최소 권한만 주는 원칙', '뷰 사용자가 의존하는 열 이름과 의미'], wrong: ['일반 VIEW는 항상 별도 결과를 저장해요.', '모든 집계 뷰는 원본 행을 직접 수정할 수 있어요.', '뷰가 있으면 기본 테이블 권한 검토가 불필요해요.'], query: 'SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = \'public\' AND table_name LIKE \'%\' ORDER BY table_name LIMIT __DAY__;', bug: ['CREATE VIEW active_attempts AS', 'SELECT * FROM attempts;', '-- 필요한 열·필터·권한이 불분명'], line: 1, fix: 'CREATE VIEW active_attempts AS SELECT id, learner_id, points FROM attempts WHERE active = TRUE;', reason: '뷰는 반복 질의의 이름 있는 계약으로 쓸 수 있지만 실제 권한과 접근 가능한 열도 함께 검토해야 해요.' },
  { title: '데이터 타입과 배열·JSON', objective: '관계형 열과 JSONB·배열의 적합한 사용 범위를 비교해요.', days: ['정수·숫자', '날짜와 시각', '배열 자료형', 'JSONB', '정규화와 반정형 데이터'], terms: ['INTEGER와 NUMERIC', 'DATE·TIMESTAMPTZ', 'ARRAY', 'JSONB', '관계 열로 분리'], correct: ['정수와 정확한 소수 금액 등 용도에 맞춰 정하는 수치 형식', '날짜만 필요할 때와 절대 시각을 보존할 때 구분하는 형식', '같은 형식 값의 순서 있는 묶음 자료형', '이진 JSON을 저장·질의하는 PostgreSQL 형식', '자주 필터·조인·제약하는 속성을 별도 열로 저장하는 선택'], wrong: ['부동소수점은 금융 금액을 언제나 정확하게 저장해요.', 'TIMESTAMP는 시간대 정보를 항상 저장해요.', 'JSONB 안에 넣으면 인덱스·검증이 저절로 필요 없어져요.'], query: "SELECT jsonb_build_object('week', __DAY__, 'topic', 'postgresql') AS lesson_info;", bug: ["CREATE TABLE learner (id INTEGER, tags TEXT);", "-- 배열을 쉼표 문자열로 저장해 분리", ''], line: 2, fix: 'CREATE TABLE learner (id INTEGER PRIMARY KEY, tags TEXT[]);', reason: '반정형 속성은 JSONB로 시작할 수 있지만, 자주 질의하고 관계 제약을 둘 값은 별도 열이 더 알맞을 수 있어요.' },
  { title: 'SQL 인젝션과 바인드 매개변수', objective: '사용자 입력을 SQL 코드가 아닌 값으로 바인딩해요.', days: ['문자열 이어 붙이기 위험', '위험한 입력 사례', '바인드 변수', '동적 식별자 허용 목록', '데이터와 문법 분리'], terms: ['SQL 인젝션', '문자열 결합 질의', '바인드 매개변수', '허용 목록', '코드와 값 분리'], correct: ['입력 데이터가 의도하지 않은 SQL 문법으로 해석되는 취약점', '사용자 값을 SQL 소스에 붙여 만드는 위험한 조합', 'SQL 텍스트와 값 데이터를 분리해 전달하는 방식', '동적 테이블·열 이름에 적용하는 승인된 이름 목록', '입력값을 실행 문법이 아닌 데이터로 취급하는 원칙'], wrong: ['따옴표를 화면에서 이스케이프하면 어떤 SQL도 안전해요.', 'Prepared statement는 매개변수 안의 SQL을 실행해요.', '바인드 변수로 테이블 이름도 언제나 바꿀 수 있어요.'], query: 'SELECT id, name FROM learners WHERE id = __DAY__ ORDER BY id;', bug: ["SELECT * FROM learners WHERE name = '" + 'userInput' + "';", '-- userInput에는 SQL 문자가 들어올 수 있음'], line: 1, fix: "SELECT id, name FROM learners WHERE name = $1; -- 값은 별도 매개변수로 전달", reason: 'Prepared statement의 값 자리표시자를 사용하고, 동적으로 고를 식별자는 별도 허용 목록으로 제한하세요.' },
  { title: '오류 코드와 재현 가능한 진단', objective: 'SQLSTATE·관찰된 오류와 가설을 분리해 원인을 확인해요.', days: ['구문 오류 위치', '제약 위반 SQLSTATE', '잘못된 열 참조', '최소 재현', '재현 뒤 회귀 확인'], terms: ['구문 분석 오류', 'SQLSTATE', '42703 undefined_column', '최소 재현', '회귀 테스트'], correct: ['SQL 문법을 구문 분석하는 단계에서 발생한 오류', 'PostgreSQL 오류 종류를 안정적으로 식별하는 다섯 글자 코드', '선언되지 않았거나 접근할 수 없는 열을 참조한 오류 코드', '문제를 만드는 데 필요한 최소 입력·질의·관찰만 남긴 사례', '수정 후 기존 동작이 다시 깨지지 않는지 확인하는 검증'], wrong: ['오류 문구만으로 모든 실행 계획 원인을 확정할 수 있어요.', 'SQLSTATE는 오류 문구를 한글로 번역한 문장입니다.', '수정 후에는 원래 실패 입력을 다시 실행할 필요가 없어요.'], query: "SELECT '42703' AS sqlstate, 'undefined_column' AS error_name WHERE __DAY__ > 0;", bug: ['SELECT learner_name FROM learners;', '-- 실제 열 이름은 name'], line: 1, fix: 'SELECT name AS learner_name FROM learners;', reason: '오류 코드는 관찰 증거입니다. 실제 스키마와 최소 재현을 확인한 뒤 수정하고 같은 사례를 다시 실행하세요.' },
  { title: 'EXPLAIN과 비용 관찰', objective: '실행 계획의 추정 행·스캔 유형과 측정 결과를 구분해요.', days: ['Seq Scan', 'Index Scan', '추정 비용', '실제 행 수', 'EXPLAIN ANALYZE 주의'], terms: ['순차 스캔', '인덱스 스캔', '추정 비용', '실제 행 수', 'EXPLAIN ANALYZE'], correct: ['테이블 블록을 순서대로 읽는 실행 방법', '인덱스 위치를 따라 대상 행을 찾는 실행 방법', '플래너가 비교하는 상대 비용 추정치', '실행 후 관찰한 실제 반환 행 수', '계획을 실제로 실행해 시간과 행을 측정하는 옵션'], wrong: ['Seq Scan은 항상 성능 버그예요.', 'cost 값은 milliseconds로 보장돼요.', 'EXPLAIN ANALYZE는 SELECT도 실행하지 않아요.'], query: 'EXPLAIN SELECT * FROM attempts WHERE id <= __DAY__;', bug: ['EXPLAIN ANALYZE DELETE FROM attempts;', '-- 실측을 위해 운영 자료를 변경'], line: 1, fix: 'EXPLAIN DELETE FROM attempts WHERE id = 1;', reason: 'EXPLAIN ANALYZE는 쿼리를 실제로 실행합니다. UPDATE/DELETE를 측정할 때는 데이터 변경과 잠금 범위를 먼저 통제하세요.' },
  { title: '잠금과 교착 상태', objective: '잠금 범위를 좁히고 교착 탐지 후 전체 작업을 복구해요.', days: ['행 잠금', 'SELECT FOR UPDATE', '잠금 순서', '교착 상태', '재시도와 멱등성'], terms: ['행 잠금', 'FOR UPDATE', '일관된 잠금 순서', '교착 상태', '멱등 재시도'], correct: ['동시 변경 중 특정 행을 보호하는 잠금', '읽은 행을 갱신 전에 잠그는 절', '여러 자원을 같은 순서로 잠가 교착 가능성을 낮추는 방법', '트랜잭션끼리 서로의 잠금 해제를 기다리는 상태', '같은 작업을 다시 실행해도 결과가 중복되지 않게 하는 성질'], wrong: ['테이블 전체를 잠가도 동시 요청에 영향이 없어요.', '교착 상태가 나면 DB가 항상 모든 앱 재시도를 안전하게 처리해요.', 'FOR UPDATE는 일반 조회에도 항상 필요해요.'], query: 'SELECT id, points FROM attempts WHERE id <= __DAY__ ORDER BY id;', bug: ['BEGIN;', 'SELECT * FROM accounts WHERE id = 1;', 'UPDATE accounts SET balance = balance - 10 WHERE id = 1;'], line: 2, fix: 'BEGIN; SELECT * FROM accounts WHERE id = 1 FOR UPDATE; UPDATE accounts SET balance = balance - 10 WHERE id = 1; COMMIT;', reason: '읽은 값에 기초해 변경할 때 트랜잭션에서 필요한 행을 명시적으로 잠그고, 잠금 순서와 재시도 정책을 함께 설계합니다.' },
  { title: 'JSONB·배열 연산과 인덱스 경계', objective: 'GIN 후보와 연산자 선택을 자료 형태·질의 패턴에 맞춰요.', days: ['JSONB 경로', '포함 연산자', 'GIN 인덱스', '배열 포함', '정규 열 분리 기준'], terms: ['JSONB 경로 연산자', '@>', 'GIN', '배열 포함 연산자', '질의 빈도와 제약 기준'], correct: ['JSON 구조 안의 값을 경로로 읽는 연산자', '왼쪽 JSON이 오른쪽 구조를 포함하는지 검사하는 연산자', '다중 구성 요소 포함·검색에 자주 쓰는 인덱스 방식', '배열 안의 값 포함 여부를 검사하는 연산자', '자주 검색·조인·검증하는 항목을 정규 열로 옮기는 판단 기준'], wrong: ['JSONB 키 이름은 항상 대소문자를 무시해요.', 'GIN은 모든 JSON 질의를 자동으로 빠르게 해요.', 'ARRAY의 포함 검사는 일반 텍스트 부분 문자열과 같아요.'], query: "SELECT jsonb_build_object('topic', 'sql', 'day', __DAY__) ->> 'topic' AS topic;", bug: ["SELECT metadata -> 'name' = 'Mina' FROM learner_profiles;", '-- JSON 값과 문자열 비교 형식이 다름'], line: 1, fix: "SELECT metadata ->> 'name' = 'Mina' FROM learner_profiles;", reason: 'JSONB·배열 인덱스도 실제 연산자와 질의 패턴이 맞는지 EXPLAIN으로 확인하고, 강한 관계 제약은 정규 열에 둡니다.' },
  { title: '요구사항부터 테스트하는 질의 설계', objective: '기대 열·행·경계 사례를 먼저 정하고 질의 결과를 검증해요.', days: ['출력 계약 작성', '빈 집합 사례', '중복·동점 사례', 'NULL 경계', '결과 비교 검사'], terms: ['결과 계약', '빈 집합', '동점 입력', 'NULL 경계 사례', '회귀 사례'], correct: ['열·형식·정렬·누락 여부를 명시한 기대 결과', '0행일 때 집계와 JOIN의 반환을 확인하는 입력', '같은 정렬 값의 보조 키를 검증하는 입력', '알 수 없는 값의 조건과 집계 동작을 확인하는 입력', '수정 뒤 재실행해 보존해야 하는 문제 입력'], wrong: ['성공 SQL 문법만 확인하면 결과 의미도 보장돼요.', '빈 테이블 AVG는 자동으로 0을 반환해요.', '동점은 데이터가 커지면 없어지므로 테스트하지 않아도 돼요.'], query: 'SELECT COUNT(*)::INTEGER AS attempt_count FROM attempts WHERE id <= __DAY__;', bug: ['SELECT COUNT(*) FROM attempts WHERE active = TRUE;', '-- 테스트에 중복·비활성 행 없음'], line: 1, fix: 'SELECT COUNT(*)::INTEGER FROM attempts WHERE active = TRUE;', reason: '기대 결과를 열 이름과 순서까지 고정하고 빈 값, 중복, 경계, 정렬 사례를 추가해야 결과 동작을 비교할 수 있어요.' },
  { title: '통합 과제 · 학습자 성과 조회', objective: 'JOIN·집계·하위 질의·정렬을 조합해 요구 결과를 정확히 반환해요.', days: ['요구 출력 표 만들기', '관계와 조인 키 확인', '집계 단위 결정', '경계·동점 테스트', '실행 계획과 리뷰'], terms: ['열·형식·정렬 계약', '외래 키', '집계 단위', '경계 사례', '변경 근거'], correct: ['요구사항을 열·형식·순서로 바꾼 결과 계약', '학습자 테이블과 시도 테이블을 연결하는 키', '합계를 중복 없이 계산할 기준 행 단위', '빈 그룹·동점·NULL·경계 숫자를 포함하는 검증 입력', '질의 변경과 기대 결과를 연결한 리뷰 설명'], wrong: ['모든 열을 선택하면 출력 요구를 놓치지 않아요.', 'JOIN 뒤 SUM은 행 중복 영향을 받지 않아요.', 'OFFSET 페이지는 ORDER BY 없이도 고정돼요.'], query: 'WITH totals AS (SELECT learner_id, SUM(points)::INTEGER AS points_sum FROM attempts WHERE active = TRUE AND id <= __DAY__ + 2 GROUP BY learner_id) SELECT l.id, l.name, totals.points_sum FROM learners AS l JOIN totals ON totals.learner_id = l.id ORDER BY totals.points_sum DESC, l.id;', bug: ['SELECT l.id, l.name, SUM(a.points) AS points_sum', 'FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id', 'GROUP BY l.id;'], line: 3, fix: 'SELECT l.id, l.name, SUM(a.points) AS points_sum FROM learners AS l JOIN attempts AS a ON a.learner_id = l.id GROUP BY l.id, l.name;', reason: '질의 결과 열, 조인 단위, 중복 영향을 점검한 뒤 공개 코딩 문제의 6개 데이터 사례에서 정답 행을 확인합니다.' },
];

export const postgresqlReviewedIntroDayCases = {
  ...postgresqlReviewedWeeksThirtySevenToThirtyNine,
  ...postgresqlReviewedWeeksThirtyFourToThirtySix,
  ...postgresqlReviewedWeeksThirtyOneToThirtyThree,
  ...postgresqlReviewedWeeksTwentyEightToThirty,
  ...postgresqlReviewedWeeksTwentyFiveToTwentySeven,
  ...postgresqlReviewedWeeksTwentyTwoToTwentyFour,
  ...postgresqlReviewedWeeksNineteenToTwentyOne,
  ...postgresqlReviewedWeeksSixteenToEighteen,
  ...postgresqlReviewedWeeksThirteenToFifteen,
  ...postgresqlReviewedWeeksTenToTwelve,
  ...postgresqlReviewedWeeksSevenToNine,
  ...postgresqlReviewedWeeksFourToSix,
  1: [
    {
      focus: '데이터베이스 안의 테이블', objective: 'information_schema에서 사용할 표의 존재를 조회하고, 메타데이터와 실제 표를 구분해요.',
      query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'learners';",
      correctAnswer: 'information_schema.tables는 현재 데이터베이스에서 표의 메타데이터를 조회해요.',
      correctFeedback: 'information_schema.tables는 표 이름과 소유 schema 같은 카탈로그 정보를 조회하며 표의 행 데이터 자체를 반환하지 않아요.',
      wrongOptions: [
        ['FROM information_schema.tables는 learners 행 데이터를 직접 읽어요.', 'information_schema는 표 목록과 구조에 관한 메타데이터를 제공해요. 실제 learner 행을 읽으려면 FROM learners를 써야 해요.'],
        ['table_name 조건은 데이터베이스에 learners 표를 새로 만들어요.', 'SELECT 조회는 데이터를 읽으며 표 생성은 CREATE TABLE 명령의 역할이에요.'],
        ['table_schema 조건은 조회 결과가 아니라 현재 접속 DB를 바꿔요.', 'WHERE 조건은 메타데이터 행을 걸러요. 데이터베이스 연결을 전환하지 않아요.'],
      ],
      answerTerm: 'information_schema.tables',
      tracePrompt: "public schema의 메타데이터에 learners 표가 하나 있어요. table_name이 learners인 행을 고르면 어떤 이름이 반환되나요?",
      traceAnswer: 'learners', traceHint: 'WHERE는 표 이름이 정확히 learners인 메타데이터 행만 남겨요.',
      traceExplanation: '조회는 public schema의 표 메타데이터 중 learners 이름과 일치하는 행을 선택하므로 learners가 반환돼요.',
      expectedRows: [{ table_name: 'learners' }],
      codeLines: ["SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'learner';"],
      errorLines: [1], errorPrompt: '조회할 표 이름을 learners로 지정해 카탈로그 결과에서 정확한 표를 찾으세요.',
      errorHint: '단수 learner와 복수 learners의 철자를 대조하세요.',
      errorReason: "조건이 존재하지 않는 'learner' 이름을 찾으므로 learners 표에 대한 메타데이터가 반환되지 않아요.",
      fix: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'learners';",
      reason: '데이터베이스는 표를 담고, schema는 그 안의 이름 공간이며, information_schema는 표와 열의 메타데이터를 조회하는 표준 인터페이스예요.',
    },
    {
      focus: '행과 열을 결과로 읽기', objective: 'SELECT 목록의 각 열과 반환되는 행을 입력 자료에 연결해요.',
      query: 'SELECT id, name FROM learners WHERE id <= 2 ORDER BY id;',
      correctAnswer: 'SELECT 목록은 반환할 열을 정하고, 각 결과 행은 조건에 맞는 한 학습자 자료를 나타내요.',
      correctFeedback: 'id와 name 두 열을 지정했고 id가 2 이하인 학습자 행이 id 순서로 반환돼요.',
      wrongOptions: [
        ['각 열은 한 명의 학습자를 뜻하고 각 행은 열 이름을 뜻해요.', '행은 한 자료 건이고 열은 그 자료의 속성이에요.'],
        ['ORDER BY id가 없더라도 디스크에 저장된 순서가 결과 순서예요.', 'SQL은 ORDER BY로 정하지 않은 행 순서를 보장하지 않아요.'],
        ['WHERE id <= 2는 테이블에서 id가 2보다 큰 행을 영구 삭제해요.', 'SELECT의 WHERE는 읽을 행만 거를 뿐 원본 자료를 변경하지 않아요.'],
      ],
      answerTerm: '행은 레코드, 열은 속성',
      tracePrompt: '입력: learners (1, 민서), (2, 준), (3, 하린). 예제 SQL 결과에서 id=1 행의 name은 무엇인가요?',
      traceAnswer: '민서', traceHint: '조건을 만족한 뒤 id 오름차순으로 읽고, id가 1인 행의 name을 확인해요.',
      traceExplanation: 'id가 1인 learners 행의 name은 민서예요. SELECT id, name은 두 열만 결과에 포함해요.',
      expectedRows: [{ id: 1, name: '민서' }, { id: 2, name: '준' }],
      codeLines: ['SELECT id, learner_name FROM learners ORDER BY id;'],
      errorLines: [1], errorPrompt: '실제 learners 정의에 있는 열 이름으로 두 열을 조회하세요.',
      errorHint: '테이블에는 name이 있고 learner_name은 선언된 열이 아니에요.',
      errorReason: 'learners에 learner_name 열이 없어서 SELECT 목록의 열 이름을 확인해야 해요.',
      fix: 'SELECT id, name FROM learners ORDER BY id;',
      reason: '관계형 표의 행은 한 자료 건이고 열은 자료의 속성이에요. SELECT 열 목록과 WHERE 조건은 반환 모양과 행 범위를 정해요.',
    },
    {
      focus: '기본 키의 역할', objective: '표 정의의 기본 키 제약을 찾아 행을 유일하게 식별하는 근거를 확인해요.',
      query: "SELECT constraint_name FROM information_schema.table_constraints WHERE table_schema = 'public' AND table_name = 'learners' AND constraint_type = 'PRIMARY KEY';",
      correctAnswer: 'PRIMARY KEY는 한 행을 유일하게 식별하며 NULL과 중복을 허용하지 않아요.',
      correctFeedback: '기본 키 제약은 행 식별자이며 PostgreSQL은 키 열을 UNIQUE와 NOT NULL로 보장해요.',
      wrongOptions: [
        ['PRIMARY KEY는 표마다 여러 개를 선언해도 돼요.', '한 표에는 기본 키 제약 하나만 둘 수 있지만 복합 키는 여러 열로 구성할 수 있어요.'],
        ['PRIMARY KEY는 같은 값과 NULL을 여러 행에서 허용해요.', '기본 키 값은 유일하고 NULL이 될 수 없어요.'],
        ['SELECT id가 한 행만 반환한 사실만으로 id가 기본 키임이 증명돼요.', '현재 표본에서 값이 달랐다는 관찰은 제약 정의를 확인한 것과 같지 않아요.'],
      ],
      answerTerm: 'PRIMARY KEY',
      tracePrompt: "learners의 제약 메타데이터에서 constraint_type='PRIMARY KEY'인 제약 이름은 무엇인가요?",
      traceAnswer: 'learners_pkey', traceHint: 'CREATE TABLE의 id INTEGER PRIMARY KEY가 만드는 기본 제약 이름을 확인해요.',
      traceExplanation: '기본 키 정의에 대해 PostgreSQL이 만든 제약 이름은 learners_pkey예요. 고정 이름을 지정하지 않으면 엔진이 이름을 생성할 수 있어요.',
      expectedRows: [{ constraint_name: 'learners_pkey' }],
      codeLines: ["SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'learners' AND constraint_type = 'UNIQUE';"],
      errorLines: [1], errorPrompt: 'learner 식별을 보장하는 PRIMARY KEY 제약을 메타데이터에서 조회하세요.',
      errorHint: 'UNIQUE만 찾으면 기본 키 constraint_type과 다른 제약을 묻고 있어요.',
      errorReason: "constraint_type이 UNIQUE인 제약을 찾고 있어 PRIMARY KEY 제약 learners_pkey를 반환하지 않아요.",
      fix: "SELECT constraint_name FROM information_schema.table_constraints WHERE table_schema = 'public' AND table_name = 'learners' AND constraint_type = 'PRIMARY KEY';",
      reason: '기본 키는 표 정의의 제약으로 유일하고 NULL이 아닌 식별자를 보장해요. 우연히 현재 행 값이 다른 것과 구조적으로 강제된 규칙을 구분해야 해요.',
    },
    {
      focus: '필요한 열만 명시해 선택하기', objective: '화면에 필요한 출력 열을 SELECT 목록으로 정확히 제한해요.',
      query: 'SELECT id, name FROM learners ORDER BY id;',
      correctAnswer: 'SELECT id, name은 해당 두 열만 반환하며 cohort 같은 나머지 열은 제외해요.',
      correctFeedback: '필요한 출력 계약에 맞춰 열 두 개를 지정했어요. 원본 표나 다른 열은 변경되지 않아요.',
      wrongOptions: [
        ['SELECT *은 항상 화면에 필요한 열만 반환해요.', '*는 현재 표의 모든 열을 포함해 열 변경에 따라 응답도 달라질 수 있어요.'],
        ['SELECT id, name은 원본 표에서 cohort 열을 삭제해요.', 'SELECT는 질의 결과를 만들고 표 정의를 바꾸지 않아요.'],
        ['SELECT 목록의 순서는 결과 열 순서에 영향을 주지 않아요.', 'SELECT 목록에 적은 순서가 결과 열의 순서가 돼요.'],
      ],
      answerTerm: 'id, name',
      tracePrompt: '예제는 SELECT id, name을 사용해요. 입력 표에 id, name, cohort 세 열이 있다면 결과 열은 몇 개인가요?',
      traceAnswer: '2', traceHint: 'SELECT 뒤에 실제로 나열한 출력 열 이름을 세어 보세요.',
      traceExplanation: 'SELECT 목록에는 id와 name 두 열이 있으므로 결과 열은 두 개예요. cohort는 결과에 포함되지 않아요.',
      expectedRows: [{ id: 1, name: '민서' }, { id: 2, name: '준' }, { id: 3, name: '하린' }],
      codeLines: ['SELECT * FROM learners ORDER BY id;'],
      errorLines: [1], errorPrompt: '화면 계약이 id와 name만 요구할 때 SELECT 목록을 그 두 열로 제한하세요.',
      errorHint: '별표 대신 필요한 열 이름을 각각 적어요.',
      errorReason: 'SELECT *은 cohort까지 반환해 id와 name만 필요하다는 출력 계약을 지키지 않아요.',
      fix: 'SELECT id, name FROM learners ORDER BY id;',
      reason: '필요한 열을 명시하면 결과 모양·전달 데이터·변경 영향을 분명히 할 수 있어요. SELECT *은 열 추가가 결과 계약에 뜻밖의 변화를 줄 수 있어요.',
    },
    {
      focus: '질의 결과 집합', objective: '조건에 맞는 행만 정해진 순서로 결과 집합에 남기는 흐름을 읽어요.',
      query: "SELECT id, name FROM learners WHERE cohort = 'A' ORDER BY id;",
      correctAnswer: '결과 집합은 SELECT 결과로 반환된 행들의 모음이며 ORDER BY를 써야 순서를 정할 수 있어요.',
      correctFeedback: "cohort가 A인 행만 남기고 id 순서로 배열해 결과 행의 집합을 만들어요.",
      wrongOptions: [
        ['WHERE는 cohort가 B인 행만 남겨요.', "'A'와 일치하는 행만 통과하므로 B 행은 제외돼요."],
        ['ORDER BY가 없는 SELECT도 표의 저장 순서를 결과 순서로 보장해요.', 'ORDER BY를 지정하지 않으면 SQL은 행 순서를 보장하지 않아요.'],
        ['결과 집합은 조건과 무관하게 표의 모든 행을 항상 반환해요.', 'WHERE 조건이 있으면 그 조건을 만족한 행만 반환돼요.'],
      ],
      answerTerm: 'cohort가 A인 행',
      tracePrompt: "입력: learners (1, 민서, A), (2, 준, A), (3, 하린, B). cohort='A' 결과의 행 수는 몇 개인가요?",
      traceAnswer: '2', traceHint: 'A인 두 행을 남기고 B인 행 하나는 제외해요.',
      traceExplanation: '첫 번째와 두 번째 행만 cohort A이므로 결과 집합의 행은 두 개예요.',
      expectedRows: [{ id: 1, name: '민서' }, { id: 2, name: '준' }],
      codeLines: ["SELECT id, name FROM learners WHERE cohort = 'A' LIMIT 2;"],
      errorLines: [1], errorPrompt: '두 행만 우연히 가져오는 대신 결과 순서를 id로 고정해 질의를 완성하세요.',
      errorHint: 'LIMIT만으로 어떤 두 행인지를 보장할 수 없어요.',
      errorReason: '정렬이 빠져 제한된 결과 부분집합이 어느 행을 담을지 안정적으로 보장되지 않아요.',
      fix: "SELECT id, name FROM learners WHERE cohort = 'A' ORDER BY id LIMIT 2;",
      reason: 'WHERE는 조건에 맞는 행을 걸러요. LIMIT이나 OFFSET을 써 결과 일부를 고를 때는 예측 가능한 결과를 위해 ORDER BY를 명시해야 해요.',
    },
  ],
  2: [
    {
      focus: 'FROM의 자료 출처', objective: 'FROM에서 행을 읽을 실제 표를 지정하고 조건을 적용해요.',
      query: 'SELECT name FROM learners WHERE id = 1;',
      correctAnswer: 'FROM learners가 질의에서 읽을 표를 정하고 WHERE는 그 표의 행을 거릅니다.',
      correctFeedback: 'name 열을 learners 표에서 읽고 id 1인 행만 남겨요.',
      wrongOptions: [
        ['SELECT name만 쓰면 모든 표에서 해당 열을 자동으로 찾아요.', 'FROM은 열이 어느 자료 출처에 있는지 지정해야 해요.'],
        ['WHERE id = 1이 질의에서 읽을 표를 만들어요.', 'WHERE는 FROM에서 고른 행을 필터링하며 표를 만들지 않아요.'],
        ['FROM learners는 데이터베이스에 learners 표를 새로 만들어요.', 'FROM은 기존 표를 질의 자료로 참조해요.'],
      ],
      answerTerm: 'learners',
      tracePrompt: '입력: learners에 (id=1, name=민서)가 있어요. 예제 SQL에서 반환되는 name은 무엇인가요?',
      traceAnswer: '민서', traceHint: 'FROM으로 선택한 표에서 id가 1인 행의 name 열을 읽어요.',
      traceExplanation: 'learners에서 id 1인 행이 민서이므로 결과는 민서예요.',
      expectedRows: [{ name: '민서' }],
      codeLines: ['SELECT name WHERE id = 1;'], errorLines: [1],
      errorPrompt: 'name을 찾을 표를 FROM 절에 지정하세요.', errorHint: 'SELECT 열 목록 다음에 FROM 표 이름이 필요해요.',
      errorReason: '표를 지정하는 FROM이 없어 name을 읽을 자료 출처가 없어요.',
      fix: 'SELECT name FROM learners WHERE id = 1;',
      reason: 'FROM은 자료의 출처를, SELECT는 반환 열을, WHERE는 남길 행을 정해요. 서로 맡는 역할을 섞지 마세요.',
    },
    {
      focus: '테이블 별칭으로 짧게 쓰기', objective: 'FROM에서 선언한 테이블 별칭을 질의 안에서 일관되게 사용해요.',
      query: 'SELECT l.name FROM learners AS l WHERE l.id = 2;',
      correctAnswer: 'FROM learners AS l이 선언한 l은 해당 질의 범위에서 learners 표를 가리키는 별칭이에요.',
      correctFeedback: '선언한 l 별칭을 SELECT와 WHERE에서 같은 표를 가리키도록 일관되게 썼어요.',
      wrongOptions: [
        ['AS l은 데이터베이스 표 이름 learners를 영구히 l로 바꿔요.', '별칭은 그 질의 안에서만 쓰는 이름이고 표 구조를 수정하지 않아요.'],
        ['별칭 l은 FROM에서 선언하지 않아도 모든 표에서 사용할 수 있어요.', '별칭은 FROM 항목에서 선언된 뒤 해당 질의 범위에서 사용할 수 있어요.'],
        ['테이블 별칭은 결과 열의 표시 이름을 바꾸는 문법이에요.', '결과 열 별칭은 SELECT 열 뒤에 AS를 붙여 지정해요.'],
      ],
      answerTerm: 'l',
      tracePrompt: '입력: learners의 id=2 행은 name=준이에요. l은 learners 별칭일 때 예제 결과의 name은 무엇인가요?',
      traceAnswer: '준', traceHint: 'l.id=2는 learners.id=2와 같은 행을 골라요.',
      traceExplanation: 'l이 learners 별칭이므로 l.id=2는 id 2인 학습자 행을 선택하고 그 name인 준을 반환해요.',
      expectedRows: [{ name: '준' }],
      codeLines: ['SELECT l.name FROM learners AS learner WHERE l.id = 2;'], errorLines: [1],
      errorPrompt: 'FROM에서 정한 테이블 별칭을 이후 모든 열 참조에 맞춰 사용하세요.', errorHint: '선언은 learner인데 SELECT와 WHERE는 l을 사용하고 있어요.',
      errorReason: 'FROM이 선언한 별칭은 learner이므로 l.name과 l.id는 정의되지 않은 별칭을 참조해요.',
      fix: 'SELECT learner.name FROM learners AS learner WHERE learner.id = 2;',
      reason: '테이블 별칭은 긴 표 이름을 질의 안에서 짧고 일관된 이름으로 바꾸며 원본 표 이름이나 데이터를 변경하지 않아요.',
    },
    {
      focus: '결과 열 별칭', objective: 'SELECT 표현식에 출력 이름을 부여하고 원본 열 이름과 구분해요.',
      query: 'SELECT name AS learner_name FROM learners WHERE id = 1;',
      correctAnswer: 'SELECT name AS learner_name은 결과 열 이름만 정하고 저장된 name 열은 그대로 둬요.',
      correctFeedback: '조회 결과의 열 레이블을 learner_name으로 표시하며 테이블 정의나 값은 바꾸지 않아요.',
      wrongOptions: [
        ['AS learner_name은 learners 표의 실제 열 이름을 즉시 바꿔요.', 'SELECT의 AS는 질의 결과 레이블만 정해요.'],
        ['열 별칭은 WHERE에서 원본 열 name을 대체해요.', 'WHERE는 원본 입력 열을 참조하고 SELECT 결과 별칭과 처리 시점이 달라요.'],
        ['AS 뒤에는 기존 테이블 이름만 올 수 있고 출력 이름은 붙일 수 없어요.', 'SELECT 표현식에 결과 열 별칭을 붙일 수 있어요.'],
      ],
      answerTerm: 'learner_name',
      tracePrompt: '예제 SQL이 반환하는 열의 표시 이름은 무엇인가요? 입력 행은 id=1, name=민서예요.',
      traceAnswer: 'learner_name', traceHint: 'SELECT 표현식 뒤의 AS 다음에 붙은 이름을 읽어요.',
      traceExplanation: 'AS learner_name은 결과 열의 표시 이름이에요. 원본 열은 계속 name이에요.',
      expectedRows: [{ learner_name: '민서' }],
      codeLines: ['SELECT learner_name FROM learners WHERE id = 1;'], errorLines: [1],
      errorPrompt: '원본 열 name을 읽으면서 결과 열 이름을 learner_name으로 지정하세요.', errorHint: 'learner_name은 표의 저장 열이 아니라 SELECT 결과에 붙일 별칭이에요.',
      errorReason: 'learners의 저장 열은 name이므로 SELECT learner_name은 없는 원본 열을 읽으려 해요.',
      fix: 'SELECT name AS learner_name FROM learners WHERE id = 1;',
      reason: '열 별칭은 API나 화면에 전달할 질의 결과 이름을 읽기 좋게 만들지만 저장된 표 정의를 바꾸지는 않아요.',
    },
    {
      focus: '계산식에 별칭 붙이기', objective: '계산 결과에 안정적으로 참조할 출력 열 이름을 지정해요.',
      query: 'SELECT points * 2 AS doubled_points FROM attempts WHERE id = 1;',
      correctAnswer: '계산식 뒤의 AS doubled_points는 결과 열 이름을 정하며 원본 points는 변경하지 않아요.',
      correctFeedback: '질의는 points 값을 두 배로 계산해 doubled_points라는 결과 열로 반환해요.',
      wrongOptions: [
        ['SELECT 계산식은 attempts.points 값을 저장할 때마다 두 배로 바꿔요.', 'SELECT 산술식은 결과를 계산할 뿐 원본 행을 UPDATE하지 않아요.'],
        ['doubled_points는 자동으로 attempts 표의 새 열이 돼요.', '새 저장 열을 만드는 명령은 ALTER TABLE이며 SELECT 별칭은 결과에만 있어요.'],
        ['별칭은 결과 열 이름과 무관하고 SQL 화면에만 보이는 주석이에요.', '별칭은 결과 집합의 열 레이블로 반환돼요.'],
      ],
      answerTerm: 'doubled_points',
      tracePrompt: '입력: attempts의 id=1 행에서 points=40이에요. doubled_points 결과값은 무엇인가요?',
      traceAnswer: '80', traceHint: '40에 2를 곱한 뒤 결과 열 별칭 아래 반환해요.',
      traceExplanation: '40 × 2는 80이므로 doubled_points 열에 80이 반환돼요. 원본 points 값은 그대로예요.',
      expectedRows: [{ doubled_points: 80 }],
      codeLines: ['SELECT points * 2 FROM attempts WHERE id = 1;'], errorLines: [1],
      errorPrompt: '계산 결과에 API에서 식별하기 쉬운 doubled_points 출력 이름을 붙이세요.', errorHint: '계산식 바로 뒤에 AS와 결과 열 이름을 적어요.',
      errorReason: '식에는 명시적 별칭이 없어 결과 열 이름 계약을 안정적으로 식별하기 어려워요.',
      fix: 'SELECT points * 2 AS doubled_points FROM attempts WHERE id = 1;',
      reason: '계산 결과 별칭은 결과 집합의 열 이름을 명확히 해요. 저장값을 바꾸려면 별도의 변경 명령이 필요해요.',
    },
    {
      focus: '테이블 별칭으로 열 한정하기', objective: '표 별칭과 열 이름을 결합해 열의 출처를 분명하게 표시해요.',
      query: 'SELECT l.id AS learner_id, l.name FROM learners AS l WHERE l.id = 1 ORDER BY l.id;',
      correctAnswer: 'l.id처럼 선언한 표 별칭과 열 이름을 점으로 연결해 열의 출처를 표시해요.',
      correctFeedback: 'FROM에서 선언한 l이 learners를 가리키므로 l.id와 l.name은 출처가 분명한 참조예요.',
      wrongOptions: [
        ['l은 열 이름 별칭이고 id는 테이블 이름이에요.', '점 앞의 l은 표 별칭이고 점 뒤 id는 그 표의 열 이름이에요.'],
        ['표 별칭을 선언하면 해당 별칭을 생략해도 매개 열 출처가 항상 분명해요.', '여러 표를 결합할 때 같은 열 이름의 출처가 모호해질 수 있어 표 한정 참조가 필요해요.'],
        ['l.id는 learners 행을 수정해 별칭 값을 저장해요.', '표 한정 이름은 질의에서 열 출처를 표시하며 자료를 변경하지 않아요.'],
      ],
      answerTerm: 'l.id',
      tracePrompt: '예제에서 learners를 대신하는 표 별칭은 l이에요. id 열의 출처를 표기한 부분은 무엇인가요?',
      traceAnswer: 'l.id', traceHint: '표 별칭 뒤에 점을 쓰고 열 이름을 이어 적어요.',
      traceExplanation: 'l은 learners의 표 별칭이고 id는 열 이름이므로 l.id가 출처가 붙은 열 참조예요.',
      expectedRows: [{ learner_id: 1, name: '민서' }],
      codeLines: ['SELECT learners.id AS learner_id, learners.name FROM learners AS l WHERE learners.id = 1;'], errorLines: [1],
      errorPrompt: 'FROM 절에서 l로 별칭을 선언한 뒤 본문에서도 같은 별칭을 사용하세요.', errorHint: '별칭을 선언한 표 이름은 그 질의 범위에서 별칭으로 참조해야 해요.',
      errorReason: 'FROM learners AS l 뒤에 원래 learners 이름으로 열을 참조해 별칭 사용 계약과 맞지 않아요.',
      fix: 'SELECT l.id AS learner_id, l.name FROM learners AS l WHERE l.id = 1;',
      reason: '테이블 한정 열 이름은 열의 출처를 드러내요. 특히 같은 이름의 열을 가진 여러 표를 다룰 때 참조 대상을 모호하지 않게 해요.',
    },
  ],
  3: [
    {
      focus: '같음과 다름 비교', objective: '같음은 =, 다름은 <>로 비교하고 숫자 점수가 같은 행을 찾아요.',
      query: 'SELECT id, points FROM attempts WHERE points = 70 ORDER BY id;',
      correctAnswer: '=는 두 값을 비교해 같을 때 참이고 <>는 서로 다를 때 참인 비교 연산자예요.',
      correctFeedback: 'WHERE points = 70은 points 값이 정확히 70인 행만 골라요.',
      wrongOptions: [
        ['=는 SQL에서 값을 저장하는 대입 연산자예요.', 'SQL의 =는 비교 연산자예요. 저장 변경은 UPDATE의 SET 절에서 사용해요.'],
        ['<>는 두 값이 같을 때 참이에요.', '<>는 표준 SQL의 같지 않음 연산자예요.'],
        ['숫자 70을 문자열로 감싸지 않으면 비교할 수 없어요.', 'points가 정수 열이면 숫자 리터럴 70과 직접 비교할 수 있어요.'],
      ],
      answerTerm: '=',
      tracePrompt: '입력 점수는 40, 60, 70, 80, 100이에요. points=70 조건에 맞는 행의 수는 몇 개예요?',
      traceAnswer: '1', traceHint: '정확히 70인 점수 한 행만 남아요.',
      traceExplanation: '다섯 점수 중 70과 같은 값은 한 개라 결과 행은 하나예요.',
      expectedRows: [{ id: 3, points: 70 }],
      codeLines: ['SELECT id FROM attempts WHERE points IS 70;'], errorLines: [1],
      errorPrompt: '숫자 70과 같은 점수 행을 찾는 비교 연산자로 질의를 고치세요.', errorHint: 'IS는 NULL/불리언 같은 predicate에 쓰며 일반 숫자 동등 비교는 =예요.',
      errorReason: 'IS 70은 PostgreSQL 비교 연산 문법이 아니에요. 숫자 동등 비교에는 =를 사용해요.',
      fix: 'SELECT id FROM attempts WHERE points = 70;',
      reason: '=와 <>는 값의 같음·다름을 비교해요. 숫자 입력의 등호 비교는 데이터 변경이 아니라 행 필터예요.',
    },
    {
      focus: '초과와 이상 구분', objective: '초과는 >, 이상은 >=로 기준값 포함 여부를 조건에 반영해요.',
      query: 'SELECT id, points FROM attempts WHERE points > 70 ORDER BY id;',
      correctAnswer: '>는 기준값보다 큰 값만 포함하고 >=는 기준값도 포함해요.',
      correctFeedback: '70 초과는 정확히 70을 제외하고 80과 100을 남겨요.',
      wrongOptions: [
        ['>는 기준값과 같아도 참이에요.', '>는 기준값을 제외하고 더 큰 값일 때만 참이에요.'],
        ['>=는 기준값을 제외한 더 큰 값만 뜻해요.', '>=는 기준값과 더 큰 값을 함께 포함해요.'],
        ['“70 초과”와 “70 이상”은 SQL에서 항상 같은 조건이에요.', '초과와 이상은 경계값 70의 포함 여부가 달라요.'],
      ],
      answerTerm: '>',
      tracePrompt: '입력 점수는 40, 60, 70, 80, 100이에요. points > 70에 맞는 행은 몇 개예요?',
      traceAnswer: '2', traceHint: '70은 제외하고 그보다 큰 80과 100을 세어요.',
      traceExplanation: '>는 70을 포함하지 않아 80과 100 두 행이 반환돼요.',
      expectedRows: [{ id: 4, points: 80 }, { id: 5, points: 100 }],
      codeLines: ['SELECT id, points FROM attempts WHERE points >= 70 ORDER BY id;'], errorLines: [1],
      errorPrompt: '요구가 “70 초과”일 때 70 경계값을 제외하도록 연산자를 고치세요.', errorHint: '등호가 붙은 >=는 70을 포함해요.',
      errorReason: '>=70 조건은 70점 행도 포함하므로 “70 초과” 계약보다 범위가 넓어요.',
      fix: 'SELECT id, points FROM attempts WHERE points > 70 ORDER BY id;',
      reason: '경계 숫자가 포함되는지를 말로 먼저 표시해요. 초과는 >, 이상은 >=를 사용해요.',
    },
    {
      focus: '미만과 이하 구분', objective: '미만은 <, 이하는 <=로 아래쪽 경계의 포함 여부를 반영해요.',
      query: 'SELECT id, points FROM attempts WHERE points < 70 ORDER BY id;',
      correctAnswer: '<는 기준값보다 작은 값만 포함하고 <=는 기준값을 함께 포함해요.',
      correctFeedback: '70 미만은 40과 60을 남기고 점수가 정확히 70인 행은 제외해요.',
      wrongOptions: [
        ['<는 기준값과 같은 값도 선택해요.', '<는 기준값을 제외하고 그보다 작은 값만 선택해요.'],
        ['<=는 경계값보다 작은 값만 선택해 경계값은 빼요.', '<=는 기준값과 더 작은 값을 함께 선택해요.'],
        ['“70 이하”와 “70 미만”은 경계 처리도 같아요.', '이하는 70을 포함하고 미만은 70을 제외해요.'],
      ],
      answerTerm: '<',
      tracePrompt: '입력 점수는 40, 60, 70, 80, 100이에요. points < 70에 맞는 행은 몇 개예요?',
      traceAnswer: '2', traceHint: '40과 60은 남기고 경계 70은 제외해요.',
      traceExplanation: '70보다 작은 입력은 40과 60 두 개예요. 점수가 70인 행은 strict less 조건에 맞지 않아요.',
      expectedRows: [{ id: 1, points: 40 }, { id: 2, points: 60 }],
      codeLines: ['SELECT id, points FROM attempts WHERE points <= 70 ORDER BY id;'], errorLines: [1],
      errorPrompt: '요구가 “70 미만”일 때 경계값 70을 결과에서 제외하세요.', errorHint: '<=는 경계값도 포함해요.',
      errorReason: '<=70은 70도 결과에 포함해 “70 미만” 요구와 다릅니다.',
      fix: 'SELECT id, points FROM attempts WHERE points < 70 ORDER BY id;',
      reason: '미만은 <로 끝 경계를 제외하고, 이하는 <=로 경계값을 포함해요.',
    },
    {
      focus: '기준값 경계 포함하기', objective: '“70점 이상” 요구를 >=로 표현해 경계에 있는 70점을 빠뜨리지 않아요.',
      query: 'SELECT id, points FROM attempts WHERE points >= 70 ORDER BY id;',
      correctAnswer: '>=는 기준값과 더 큰 값을 모두 포함해 “70점 이상”을 표현해요.',
      correctFeedback: '70점 이상에는 경계인 70과 그보다 높은 80, 100이 포함돼요.',
      wrongOptions: [
        ['>70은 70도 포함하므로 이상 요구와 같아요.', '>70은 정확히 70인 경계 행을 제외해요.'],
        ['=70은 70 이상인 모든 값과 더 큰 값을 반환해요.', '=는 정확히 같은 값만 고르고 더 큰 값은 포함하지 않아요.'],
        ['>=70은 70보다 작은 값을 포함하고 큰 값은 제외해요.', '>=는 70과 70보다 큰 값에 참이에요.'],
      ],
      answerTerm: '>=',
      tracePrompt: '입력 점수는 40, 60, 70, 80, 100이에요. “70점 이상” 결과에 포함되는 행 수는 몇 개예요?',
      traceAnswer: '3', traceHint: '70 경계값과 그보다 높은 두 점수를 포함해요.',
      traceExplanation: '70, 80, 100 세 행이 기준값 이상이에요. >로 바꾸면 70이 빠져요.',
      expectedRows: [{ id: 3, points: 70 }, { id: 4, points: 80 }, { id: 5, points: 100 }],
      codeLines: ['SELECT id, points FROM attempts WHERE points > 70 ORDER BY id;'], errorLines: [1],
      errorPrompt: '“70점 이상” 요구에 맞춰 경계값 70을 포함하세요.', errorHint: '현재 >는 정확히 70인 행을 제외해요.',
      errorReason: '>70은 80과 100만 반환해 기준값인 70을 빠뜨려요.',
      fix: 'SELECT id, points FROM attempts WHERE points >= 70 ORDER BY id;',
      reason: '요구 문장에 경계값 포함 여부를 표시하고, 이상은 >=로 표현해요.',
    },
    {
      focus: 'BETWEEN 범위와 양 끝값', objective: 'BETWEEN의 시작·끝 값을 모두 포함하는 범위 조건으로 바꿔요.',
      query: 'SELECT id, points FROM attempts WHERE points BETWEEN 60 AND 80 ORDER BY id;',
      correctAnswer: 'BETWEEN 60 AND 80은 60과 80을 포함해 그 사이 값을 선택해요.',
      correctFeedback: 'PostgreSQL의 BETWEEN은 양 끝값을 포함하므로 60, 70, 80을 반환해요.',
      wrongOptions: [
        ['BETWEEN은 60보다 크고 80보다 작은 값만 반환해요.', '일반 BETWEEN은 범위 양 끝값을 모두 포함해요.'],
        ['BETWEEN의 AND는 두 조건 중 하나만 참이면 통과해요.', 'BETWEEN은 하나의 범위 predicate이고 두 끝값을 포함해요.'],
        ['BETWEEN 80 AND 60은 자동으로 값 순서를 바꿔 같은 범위가 돼요.', '일반 BETWEEN은 작성한 하한과 상한이 올바른 순서여야 해요.'],
      ],
      answerTerm: 'BETWEEN',
      tracePrompt: '입력 점수는 40, 60, 70, 80, 100이에요. BETWEEN 60 AND 80의 양 끝값을 포함한 결과 행 수는 몇 개예요?',
      traceAnswer: '3', traceHint: '점수 60, 70, 80이 범위에 포함돼요.',
      traceExplanation: 'BETWEEN은 하한 60과 상한 80을 포함해 세 행을 반환해요. 경계를 제외하는 비교식과 구별하세요.',
      expectedRows: [{ id: 2, points: 60 }, { id: 3, points: 70 }, { id: 4, points: 80 }],
      codeLines: ['SELECT id, points FROM attempts WHERE points > 60 AND points < 80 ORDER BY id;'], errorLines: [1],
      errorPrompt: '양 끝값 60과 80을 포함하는 범위 조건으로 수정하세요.', errorHint: '현재 두 비교 연산자는 각 끝값을 제외해요.',
      errorReason: '>60 AND <80은 60과 80을 제외하므로 요구한 양 끝값 포함 범위가 아니에요.',
      fix: 'SELECT id, points FROM attempts WHERE points BETWEEN 60 AND 80 ORDER BY id;',
      reason: 'BETWEEN은 두 경계값을 모두 포함해요. 요구가 끝값 제외 범위라면 비교 연산자를 별도로 설계하고 확인해야 해요.',
    },
  ],
};

const phaseFor = (week) => phases.find((phase) => week >= phase.startWeek && week <= phase.endWeek);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');

function makeExercises(week, day, plan) {
  const reviewedCase = postgresqlReviewedIntroDayCases[week]?.[day - 1];
  const focus = reviewedCase?.focus ?? plan.days[day - 1];
  const label = `${week}주차 ${day}일차 · ${focus}`;
  const id = `postgresql-week-${String(week).padStart(2, '0')}-day-${day}${reviewedCase ? '-v2' : ''}`;
  const answerId = reviewedCase?.answerRevision ? id.replace(/-v2$/, `-v${reviewedCase.answerRevision}`) : id;
  const correctAnswer = reviewedCase?.correctAnswer ?? plan.correct[day - 1];
  const correctIndex = reviewedCase ? (week + day) % 4 : (week + day) % 3;
  const options = reviewedCase
    ? [[correctAnswer, reviewedCase.correctFeedback], ...reviewedCase.wrongOptions]
    : [
      [correctAnswer, `“${focus}”의 규칙을 결과 열과 행 흐름에 적용한 설명입니다.`],
      [plan.wrong[0], plan.wrong[1]],
      [plan.wrong[2], '이 설명은 SQL 문법 또는 결과가 실제로 보장하는 범위와 달라요.'],
    ];
  const rotated = [...options.slice(correctIndex), ...options.slice(0, correctIndex)];
  const answerIndex = rotated.findIndex(([text]) => text === correctAnswer);
  const example = (reviewedCase?.displayExample ?? reviewedCase?.query ?? plan.query).replaceAll('__DAY__', String(day));
  const reason = reviewedCase?.reason ?? plan.reason;
  const objective = reviewedCase?.objective ?? plan.objective;
  const first = choice(
    `${answerId}-choice`, `${label} 개념 확인`,
    reviewedCase?.conceptPrompt ?? `${label}: PostgreSQL에서 가장 정확한 설명은 무엇인가요?`,
    rotated,
    answerIndex,
    reviewedCase?.conceptHint ?? '예제에서 자료가 어느 단계에서 걸러지거나 변환되는지 확인하세요.',
    reason,
  );
  const answerTerm = reviewedCase?.answerTerm ?? plan.terms[day - 1];
  const answerIdForQuestion = `${answerId}-short`;
  const answerTitle = `${label} ${reviewedCase ? '결과 추적' : '용어 쓰기'}`;
  const answerPrompt = reviewedCase
    ? `${label}: ${reviewedCase.tracePrompt}\n예제 SQL:\n${example}`
    : `${label}: 사용하는 SQL 키워드·함수·원칙을 적으세요.`;
  const acceptedAnswers = reviewedCase?.traceAnswer
    ? [reviewedCase.traceAnswer, ...(reviewedCase.traceAlternatives ?? [])]
    : [...new Set([answerTerm, answerTerm.toUpperCase()])];
  const answerHint = reviewedCase?.traceHint ?? '공식 PostgreSQL 문서의 용어와 오늘 예제를 연결해 보세요.';
  const answerExplanation = reviewedCase?.traceExplanation ?? `${answerTerm}: ${correctAnswer} ${objective}`;
  const caseSensitiveTrace = Boolean(reviewedCase?.traceAnswer)
    && /결과|출력|반환/.test(reviewedCase.tracePrompt)
    && /[A-Za-z]/.test(acceptedAnswers.join(' '));
  const second = caseSensitiveTrace
    ? versionedShortAnswer(answerIdForQuestion, answerTitle, answerPrompt, acceptedAnswers, answerHint, answerExplanation, 'case-sensitive')
    : shortAnswer(answerIdForQuestion, answerTitle, answerPrompt, acceptedAnswers, answerHint, answerExplanation);
  let code = reviewedCase
    ? [`-- ${label}`, ...reviewedCase.codeLines].map((line) => line.replaceAll('__DAY__', String(day)))
    : plan.bug.map((line) => line.replaceAll('__DAY__', String(day)));
  let errorLine = reviewedCase ? reviewedCase.errorLines[0] + 1 : plan.line;
  let errorReason = reviewedCase?.errorReason ?? plan.reason;
  if (!reviewedCase && day === 2) {
    code = [`-- ${label}`, 'SELECT id FROM missing_practice_table;'];
    errorLine = 2;
    errorReason = 'FROM에서 실제 스키마에 없는 테이블을 참조합니다. 예제에 나온 learners 또는 attempts를 사용하세요.';
  } else if (!reviewedCase && day === 3) {
    code = [`-- ${label}`, 'SELECT missing_practice_column FROM attempts;'];
    errorLine = 2;
    errorReason = 'SELECT 목록의 열 이름이 attempts 테이블에 없습니다. 정의된 열 이름과 결과 계약을 확인하세요.';
  } else if (!reviewedCase && day === 4) {
    code = [`-- ${label}`, 'SELECT id FROM attempts WHERE points = NULL;'];
    errorLine = 2;
    errorReason = 'NULL은 등호로 검사할 수 없습니다. IS NULL 또는 IS NOT NULL 조건을 사용하세요.';
  }
  const correction = (reviewedCase?.repairCode ?? reviewedCase?.fix ?? plan.fix).replaceAll('__DAY__', String(day));
  const explanation = `${reason} ${objective}`;
  let third;
  if (day === 5) {
    third = repairCode({
      id: `${id}-repair`,
      title: `${label} 질의 고치기`,
      prompt: `${label}: 아래 SQL을 PostgreSQL 문법으로 고치고 ${objective} 목표를 만족시키세요.`,
      language: 'SQL · PostgreSQL',
      starterCode: reviewedCase?.repairStarter ?? code.join('\n'),
      solutionPatterns: [new RegExp(`^\\s*${escapeRegex(correction)};?\\s*$`, 'i').source],
      acceptanceCriteria: {
        requirements: [`${objective}`],
        constraints: ['데이터베이스 원본을 바꾸는 실행 예제는 읽기 전용 학습기로 실행하지 않습니다.'],
        examples: [{ input: reviewedCase?.repairInput ?? reviewedCase?.tracePrompt ?? '문제에 나온 테이블', output: reviewedCase?.repairOutput ?? (reviewedCase ? JSON.stringify(reviewedCase.expectedRows) : '요구사항에 맞는 SQL 질의') }],
        tests: [{ input: reviewedCase?.repairInput ?? reviewedCase?.tracePrompt ?? '대표 경계 자료', expected: reviewedCase?.repairOutput ?? (reviewedCase ? JSON.stringify(reviewedCase.expectedRows) : '열·행·정렬 조건을 충족하는 결과') }],
      },
      gradingNote: reviewedCase?.repairCode
        ? '이 학습 문항은 수정 코드 패턴을 확인합니다. 제약 동작은 별도 PGlite 회귀에서 검증했으며, 이 화면에서 제출한 DDL을 실행하지는 않습니다.'
        : '문법과 허용 답안 패턴으로 수정 예제를 확인합니다. 실행 채점은 별도 PostgreSQL 코딩 문제 메뉴에서 제공합니다.',
      hint: reviewedCase?.errorHint ?? 'SELECT 열, FROM 테이블, 조건, 그룹, 정렬 순서 중 잘못된 위치부터 확인하세요.',
      explanation,
    });
  } else {
    third = locateError(
      `${id}-locate`, `${label} 오류 줄 찾기`,
      reviewedCase?.errorPrompt ?? `${label}: ${day === 1 ? plan.objective : 'SQL 진단 연습입니다. 아래 사례에서 오류를 만드는 줄을 찾으세요.'}`,
      'SQL · PostgreSQL', code, [errorLine],
      reviewedCase?.errorHint ?? '출력 열·필터 조건·그룹 단위·정렬 순서를 요구사항과 비교하세요.',
      `${errorReason} ${explanation}`,
    );
  }
  return [first, second, third];
}

function makeSession(week, day, plan) {
  const reviewedCase = postgresqlReviewedIntroDayCases[week]?.[day - 1];
  const focus = reviewedCase?.focus ?? plan.days[day - 1];
  const objective = reviewedCase?.objective ?? `${focus}의 규칙을 SQL 결과로 확인해요.`;
  const example = (reviewedCase?.displayExample ?? reviewedCase?.query ?? plan.query).replaceAll('__DAY__', String(day));
  const executionNote = reviewedCase?.executionNote
    ?? (reviewedCase?.transactionValidation
      ? '예제 실행 전에 wallet_demo(id, balance)에 (1, 100), (2, 50)이 준비되어 있다고 가정해요.'
      : '');
  const intro = reviewedCase ? [reviewedCase.tracePrompt, executionNote].filter(Boolean).join(' ') : '';
  return studySession(
    day,
    focus,
    objective,
    intro,
    example,
    makeExercises(week, day, plan),
  );
}

const lessons = plans.map((plan, index) => {
  const week = index + 1;
  const phase = phaseFor(week);
  const sessions = [1, 2, 3, 4, 5].map((day) => makeSession(week, day, plan));
  return weeklyLesson({
    id: `postgresql-week-${String(week).padStart(2, '0')}`,
    topicId: phase.id,
    week,
    title: plan.title,
    objective: plan.objective,
    intro: '',
    points: [],
    example: sessions[0].example,
    sessions,
    difficulty: ['입문', '기초', '중급', '고급', '심화', '실전'][phase.number - 1],
  });
});

export const postgresqlCourseExpansion = {
  phases,
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: 39 }, (_, index) => index + 1),
};

export { plans as postgresqlCoursePlans };
