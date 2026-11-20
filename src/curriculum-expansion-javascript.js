import { choice, lesson, locateError, outputTrace, repairCode, shortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { javascriptReviewedWeeks22To24, javascriptReviewedWeeks25To26 } from './curriculum-expansion-javascript-reviewed.js';

const valuesTopic = 'javascript-values';
const controlTopic = 'javascript-control';
const dataTopic = 'javascript-data';
const webTopic = 'javascript-web';
const advancedTopic = 'javascript-advanced';

export const javascriptExpansion = {
  topics: [
    {
      id: valuesTopic,
      stage: 1,
      title: '입문 · 값과 조건',
      objective: '값을 이름에 담고, 조건 결과에 따라 안전하게 흐름을 나눠요.',
      lessonIds: ['js-variables', 'js-conditionals'],
    },
    {
      id: controlTopic,
      stage: 2,
      title: '기초 · 반복과 함수',
      objective: '반복 작업을 함수로 묶고 입력과 결과의 흐름을 읽어요.',
      lessonIds: ['js-loops', 'js-functions'],
    },
    {
      id: dataTopic,
      stage: 3,
      title: '중급 · 데이터와 범위',
      objective: '배열과 객체 데이터를 다루고, 변수가 보이는 범위를 구분해요.',
      lessonIds: ['js-arrays', 'js-objects', 'js-scope-closures'],
    },
    {
      id: webTopic,
      stage: 4,
      title: '고급 · 모듈과 비동기 웹',
      objective: '코드를 나누고, 화면 입력과 네트워크 결과를 안전하게 처리해요.',
      lessonIds: ['js-modules-errors-tests', 'js-dom-forms', 'js-promises-fetch'],
    },
    {
      id: advancedTopic,
      stage: 5,
      title: '실전 · 실행 흐름과 설계',
      objective: '이벤트 루프를 이해하고, 성능을 고려해 작은 기능을 설계해요.',
      lessonIds: ['js-event-loop', 'js-algorithms-capstone'],
    },
  ],
  lessonOrder: [
    'js-variables', 'js-conditionals',
    'js-loops', 'js-functions',
    'js-arrays', 'js-objects', 'js-scope-closures',
    'js-modules-errors-tests', 'js-dom-forms', 'js-promises-fetch',
    'js-event-loop', 'js-algorithms-capstone',
  ],
  extraExercises: {
    'js-variables': [
      choice('js-variables-reassignment', '값을 바꿀 이름 고르기', '학습한 문제 수가 늘어날 때마다 값을 바꿔야 합니다. 가장 알맞은 선언은 무엇인가요?', [
        ['`const completed = 0`', '`const`로 선언한 이름에는 새 값을 다시 대입할 수 없어요.'],
        ['`let completed = 0`', '`let`은 같은 블록 안에서 값을 다시 대입할 수 있어요.'],
        ['`const completed`', '초기값 없이 `const`를 선언할 수는 없어요.'],
      ], 1, '나중에 그 이름에 다른 숫자를 다시 넣어야 하는지 생각해 보세요.',
      '`completed`는 학습하면서 바뀌므로 `let`으로 선언하는 것이 알맞습니다.'),
      locateError('js-variables-tdz', '선언 전 접근 찾기', '아래 코드가 실행 초기에 오류가 나는 원인이 되는 줄을 고르세요.', 'JavaScript', [
        'console.log(score);',
        'const score = 10;',
      ], [1], '선언문보다 먼저 읽는 이름이 있는지 순서를 확인해 보세요.',
      '`const`와 `let`으로 선언한 이름은 선언문을 실행하기 전에는 읽을 수 없습니다. 1번 줄을 선언 뒤로 옮기면 됩니다.'),
    ],
    'js-conditionals': [
      shortAnswer('js-conditionals-boolean-v2', 'AND 결과가 참이 되는 조건', '`enrolled`가 true일 때 `enrolled && paid`가 true가 되려면 `paid` 값은 무엇인가요?', ['true'],
        '`&&`의 양쪽 값이 모두 true여야 합니다.', '`enrolled`가 이미 true이므로 전체 식이 true가 되려면 `paid`도 true여야 합니다.'),
      locateError('js-conditionals-equality', '비교가 아닌 대입 찾기', '아래 코드에서 등급을 비교하려다 값을 덮어쓰는 줄을 고르세요.', 'JavaScript', [
        'let grade = "B";',
        'if (grade = "A") {',
        '  console.log("우수");',
        '}',
      ], [2], '조건 안의 기호가 값을 비교하는지, 새 값을 넣는지 확인해 보세요.',
      '2번 줄의 `=`는 대입 연산자입니다. 비교하려면 `grade === "A"`처럼 엄격한 동등 비교를 사용해야 합니다.'),
    ],
    'js-loops': [
      choice('js-loops-for-of', '값을 직접 꺼내기', '`scores` 배열의 모든 점수를 더할 때 인덱스가 필요 없다면 어떤 반복문이 읽기 쉬울까요?', [
        ['`for (const score of scores) { total += score; }`', '배열의 각 값을 직접 `score`로 받아 인덱스 계산 없이 더할 수 있어요.'],
        ['`for (const score in scores) { total += score; }`', '`for...in`은 배열 값보다 속성 이름(인덱스 문자열)을 순회해 의도와 달라질 수 있어요.'],
        ['`for (const score of total) { scores += score; }`', '숫자인 `total`은 순회할 수 없고, 배열도 변경하려는 대상이 아니에요.'],
      ], 0, '배열의 인덱스가 아니라 각 원소 값이 필요합니다.',
      '`for...of`는 반복 가능한 값의 원소를 하나씩 꺼낼 때 알맞습니다.'),
      outputTrace('js-loops-accumulation-trace-v2', '누적 합계 추적', '다음 코드가 실행된 뒤 콘솔에 출력되는 값을 적으세요.\n\nconst values = [1, 2];\nlet total = 0;\nfor (const value of values) total += value;\nconsole.log(total);', ['3'],
        '각 반복에서 이전 total에 현재 값을 더하는지 따라가세요.', 'total은 0에서 1, 3으로 바뀌어 두 값의 합계 3을 출력합니다.'),
    ],
    'js-functions': [
      choice('js-functions-return-value', '반환값 고르기', '`function double(value) { return value * 2; }`에서 `double(4)`의 값은 무엇인가요?', [
        ['`8`', '함수는 4에 2를 곱한 값을 return하므로 호출 결과는 8이에요.'],
        ['`4`', '입력값을 그대로 돌려주지 않고 두 배로 계산해요.'],
        ['`undefined`', 'return 문이 있으므로 함수 호출은 계산한 값을 반환해요.'],
      ], 0, 'return 오른쪽의 식에 value가 4일 때를 대입해 보세요.',
      '`return value * 2`의 value가 4이므로 함수 호출 결과는 8입니다.'),
      choice('js-functions-default-argument', '기본 매개변수', '인자를 생략한 `greet()`에서 기본 이름을 사용하려면 어떤 선언이 맞나요?', [
        ['`function greet(name) { return name; }`', '이름을 전달하지 않으면 name은 undefined가 됩니다.'],
        ['`function greet(name = "학습자") { return name; }`', '매개변수 기본값은 인자가 생략되거나 undefined일 때 사용돼요.'],
        ['`function greet = "학습자"(name)`', '함수 선언 이름에 값을 대입하는 문법은 기본 매개변수가 아니에요.'],
      ], 1, '기본값은 함수 괄호 안 매개변수 선언에서 지정할 수 있어요.',
      '매개변수에 `= "학습자"`를 지정하면 인자가 없을 때 기본 이름을 받습니다.'),
    ],
    'js-arrays': [
      choice('js-arrays-append-immutable', '원본을 유지하며 항목 추가', '`courses`를 바꾸지 않고 "React"가 추가된 새 배열을 만드는 방법은?', [
        ['`const next = [...courses, "React"]`', '전개 문법은 원소를 복사하고 새 값을 붙인 새 배열을 만들어요.'],
        ['`const next = courses.push("React")`', '`push`는 원본을 바꾸고 새 배열 대신 새 길이를 반환해요.'],
        ['`courses[1] = "React"`', '인덱스 대입은 원본을 바꾸고 기존 항목을 덮어써요.'],
      ], 0, '새 배열을 만들면서 기존 원본을 건드리지 않는 방법을 떠올려 보세요.',
      '전개 문법으로 복사한 뒤 "React"를 추가하면 원본은 그대로 남습니다.'),
      locateError('js-arrays-filter-map', '필터링 결과 찾기', '60점 이상 점수만 남겨야 합니다. 점수 배열 대신 true/false 배열을 만드는 줄을 고르세요.', 'JavaScript', [
        'const scores = [55, 60, 90];',
        'const passed = scores.map((score) => score >= 60);',
        'console.log(passed);',
      ], [2], '조건에 맞는 값만 남기는 메서드와 각 값을 바꾸는 메서드를 구분해 보세요.',
      '2번 줄의 map은 `[false, true, true]`를 만듭니다. 통과 점수만 남기려면 `filter((score) => score >= 60)`를 써야 합니다.'),
    ],
  },
  lessons: [
    lesson('js-objects', dataTopic, '객체로 관련 데이터 묶기', '12분', '객체의 속성을 읽고, 값이 없는 경우를 안전하게 구분해요.',
      '객체는 이름이 붙은 속성으로 관련 데이터를 묶습니다. 사용자 이름과 완료한 단원 수처럼 서로 연관된 값은 객체 안에 표현할 수 있어요.',
      ['점 표기법은 유효한 속성 이름을 읽을 때 편리해요.', '대괄호 표기법은 변수에 든 속성 이름을 사용할 때 필요해요.', '없는 속성을 읽으면 보통 `undefined`가 나와요.'],
      'const learner = { name: "Mina", completed: 4 };\nconsole.log(learner.name);', [
        choice('js-objects-dynamic-key', '변수로 속성 읽기', '`const key = "completed";`일 때 `learner`에서 해당 속성 값을 읽는 올바른 표현은 무엇인가요?', [
          ['`learner.key`', '점 표기법은 글자 그대로 `key`라는 속성을 찾습니다.'],
          ['`learner[key]`', '대괄호 안의 변수 값을 계산해 `completed` 속성을 찾습니다.'],
          ['`key[learner]`', '속성 이름 문자열은 객체에서 값을 읽는 대상이 아니에요.'],
        ], 1, '변수에 든 문자열을 속성 이름으로 사용해야 합니다.', '`learner[key]`는 key의 값인 "completed"를 사용해 속성을 읽습니다.'),
        outputTrace('js-objects-undefined', '`undefined` 결과', '`const course = { title: "JavaScript" };`일 때 `course.level`의 결과를 적으세요.', ['undefined'],
          '객체에 `level` 속성이 실제로 있는지 확인해 보세요.', '존재하지 않는 일반 객체 속성을 읽으면 `undefined`가 반환됩니다.'),
        locateError('js-objects-reference', '공유된 객체 찾기', '두 학습자 설정이 서로 독립적이어야 합니다. 한 쪽 수정이 다른 쪽에도 보이게 만드는 줄을 고르세요.', 'JavaScript', [
          'const first = { theme: "light" };',
          'const second = first;',
          'second.theme = "dark";',
          'console.log(first.theme);',
        ], [2], '두 이름이 서로 다른 객체인지 같은 객체를 가리키는지 살펴보세요.',
        '2번 줄은 객체를 복사하지 않고 같은 객체를 가리키게 합니다. 독립된 객체가 필요하면 `const second = { ...first };`처럼 복사하세요.'),
      ], '중급'),
    lesson('js-scope-closures', dataTopic, '범위와 클로저 이해하기', '14분', '블록 범위를 구분하고, 함수가 바깥 값을 기억하는 방식을 설명해요.',
      '변수의 범위는 그 이름을 읽을 수 있는 코드 영역입니다. 클로저는 함수가 만들어질 때 주변 범위의 값을 계속 참조할 수 있는 성질이에요.',
      ['`let`과 `const`는 블록 범위를 가져요.', '안쪽 함수는 바깥 함수의 변수에 접근할 수 있어요.', '클로저는 공유할 값과 수명을 의도적으로 설계할 때 유용해요.'],
      'const label = "바깥";\n{\n  const label = "안쪽";\n  console.log(label);\n}\nconsole.log(label);', [
        locateError('js-scope-tdz', '선언 전 접근 찾기', '아래 코드에서 아직 초기화되지 않은 이름을 읽어 오류가 나는 줄을 고르세요.', 'JavaScript', [
          'console.log(score);',
          'const score = 10;',
        ], [1], 'const 선언문보다 앞에서 score를 읽는지 확인하세요.', '1번 줄은 const 선언이 실행되기 전에 score를 읽습니다. let과 const는 블록 범위를 가지며 선언 전 초기화 구간에서는 접근할 수 없습니다.'),
        choice('js-scope-function-return', '함수 지역값 전달', '함수 안의 label을 호출한 쪽에서 사용하려면 어떤 흐름이 필요할까요?', [
          ['함수에서 return하고 호출 결과를 저장한다', '지역 값을 반환하면 함수 바깥에서도 호출 결과를 사용할 수 있습니다.'],
          ['함수가 끝난 뒤 label을 직접 읽는다', '지역 변수 label은 함수 실행이 끝나면 바깥 범위에서 보이지 않습니다.'],
          ['const 이름은 자동으로 전역에 등록된다', 'const는 전역으로 승격되지 않고 선언된 블록에 범위가 제한됩니다.'],
        ], 0, '함수 내부 이름과 호출 결과를 각각 구분해 보세요.', '함수는 return으로 값을 호출자에게 전달할 수 있습니다. 지역 이름 자체가 바깥 범위에 공개되는 것은 아닙니다.'),
        shortAnswer('js-scope-shadowing', '가려진 값 적기', '`const level = "기초"; { const level = "중급"; }` 다음 줄에서 바깥 `level`의 값을 적으세요.', ['기초'],
          '중괄호 안의 이름은 바깥 이름을 같은 블록 안에서만 가립니다.', '안쪽 블록의 level은 블록이 끝나면 사라지고, 바깥 level은 "기초" 그대로입니다.'),
      ], '중급'),
    lesson('js-modules-errors-tests', webTopic, '모듈, 오류, 테스트로 경계 만들기', '15분', '모듈의 공개 API를 정하고 예외 경로도 테스트해요.',
      '모듈은 파일마다 책임을 나누고 필요한 이름만 `export`합니다. 아래 예제는 `format.mjs`와 `main.mjs` 두 파일로 나눠 저장한 뒤 `node main.mjs`로 실행할 수 있어요. 오류는 원인을 숨기지 말고 전달하고, 테스트는 정상 경로와 실패 경로를 함께 확인합니다.',
      ['named export는 필요한 기능만 공개해요.', '예상하지 못한 상태는 조용히 삼키지 말고 적절히 전달하거나 처리해요.', '테스트는 성공 사례와 실패 사례를 모두 다루면 경계가 분명해져요.'],
      '// format.mjs\nexport function toTitle(text) {\n  if (!text) throw new Error("text is required");\n  return text[0].toUpperCase() + text.slice(1);\n}\n\n// main.mjs\nimport { toTitle } from "./format.mjs";\nconsole.log(toTitle("javaScript")); // JavaScript', [
        choice('js-modules-named-import', 'named export 가져오기', '`format.js`가 `export function toTitle() {}`를 제공할 때 올바른 가져오기는 무엇인가요?', [
          ['`import toTitle from "./format.js";`', 'default export가 없으면 중괄호 없는 default import는 맞지 않아요.'],
          ['`import { toTitle } from "./format.js";`', 'named export 이름을 중괄호로 지정해 가져옵니다.'],
          ['`import * as toTitle from "./format.js";`', 'namespace import는 모듈 객체를 만들며 함수 하나를 바로 가져오는 표현이 아니에요.'],
        ], 1, 'default export와 이름을 붙여 export한 경우의 import 모양을 구분해 보세요.', 'named export는 export한 이름을 중괄호 안에 적어 가져옵니다.'),
        choice('js-modules-namespace-import', '모듈 네임스페이스 가져오기', '`format.js`에서 `toTitle`과 `toSlug`를 공개했을 때 두 이름을 한 객체 아래에서 쓰는 방법은?', [
          ['`import * as format from "./format.js"` 후 `format.toTitle` 사용', 'namespace import는 모듈의 공개 이름들을 객체처럼 묶어 제공합니다.'],
          ['`import { format } from "./format.js"`', 'format이라는 named export가 따로 선언되지 않았다면 이 이름은 가져올 수 없습니다.'],
          ['`import [toTitle, toSlug] from "./format.js"`', 'ES module import 목록에는 배열 대괄호를 쓰지 않습니다.'],
        ], 0, '모듈 전체를 한 지역 이름으로 가져오려는 경우의 별표 구문을 떠올려 보세요.', 'namespace import는 `import * as 이름` 구문을 쓰고 내보낸 기능은 `이름.기능`으로 접근합니다.'),
        shortAnswer('js-tests-failure-case', '실패 경로 고르기', '`toTitle`이 빈 문자열에서 오류를 던진다면, 아래 중 실패 경로를 검증하는 입력을 적으세요: `"hello"`, `""`, `"JavaScript"`', ['""', "''", '빈 문자열'],
          '값이 없는 입력에서 어떤 분기가 실행되는지 보세요.', '빈 문자열은 `!text` 조건을 만족해 오류 경로를 실행합니다.'),
      ], '고급'),
    lesson('js-dom-forms', webTopic, 'DOM과 폼 입력 다루기', '15분', '폼에서 사용자의 입력을 읽고 기본 제출 동작을 필요한 경우 제어해요.',
      'DOM은 브라우저가 HTML을 객체 형태로 표현한 것입니다. 폼 제출은 기본적으로 페이지 이동을 일으킬 수 있으므로, 자바스크립트로 먼저 검사할 때는 기본 동작을 멈춰야 합니다.',
      ['`querySelector`는 CSS 선택자로 첫 요소를 찾습니다.', '입력 요소의 현재 문자열 값은 보통 `.value`에서 읽어요.', '폼 제출 처리기에서 `event.preventDefault()`는 기본 페이지 이동을 막아요.'],
      'function normalizeTitle(raw) {\n  const title = raw.trim();\n  return title.length > 0 ? title : null;\n}\n\nconsole.log(normalizeTitle("  React  "), normalizeTitle("   ")); // React null', [
        choice('js-dom-input-value', '입력 값 읽기', '`<input id="name">` 요소를 `const input = document.querySelector("#name")`로 찾았습니다. 사용자가 입력한 현재 값을 읽는 표현은 무엇인가요?', [
          ['`input.value`', 'input 요소의 value 속성은 사용자가 입력한 현재 문자열을 제공합니다.'],
          ['`input.textContent`', 'input은 자식 텍스트 노드에 값을 두지 않으므로 입력값을 읽는 용도가 아니에요.'],
          ['`input.innerHTML`', '입력값이 아니라 요소 내부 HTML을 다루는 속성이에요.'],
        ], 0, 'input에 입력한 문자열을 보관하는 속성을 떠올려 보세요.', '`input.value`로 현재 입력값을 읽습니다.'),
        locateError('js-dom-normalized-save', '검사와 저장 값 불일치 찾기', '공백을 제거해 검사하고 저장할 때, 검사에는 정리한 값을 쓰면서 원본을 저장하게 만드는 줄을 고르세요.', 'JavaScript', [
          'const title = input.value.trim();',
          'if (!title) return;',
          'save(input.value);',
        ], [3], '검사에 사용한 title과 save에 전달하는 인자가 같은 값인지 비교하세요.', '3번 줄은 trim하지 않은 원본 input.value를 저장합니다. 검증을 통과한 동일한 정리값 title을 저장해야 앞뒤 공백이 남지 않습니다.'),
        choice('js-dom-safe-text', '일반 텍스트로 표시', '사용자가 입력한 `<b>안녕</b>`를 마크업이 아닌 글자로 보여 주는 속성은?', [
          ['`element.textContent`', 'textContent는 문자열을 텍스트로 설정하며 HTML로 파싱하지 않습니다.'],
          ['`element.innerHTML`', 'innerHTML은 문자열을 마크업으로 파싱합니다.'],
          ['`element.outerHTML`', 'outerHTML은 대상 요소 자체의 마크업을 다루므로 표시 문구의 안전한 기본값이 아닙니다.'],
        ], 0, '사용자 문자열을 DOM 노드로 해석할지 텍스트로 둘지 구분하세요.', '일반 문구는 textContent로 설정하면 태그 모양의 문자열도 텍스트로 표시됩니다.'),
      ], '고급'),
    lesson('js-promises-fetch', webTopic, 'Promise와 fetch 결과 처리하기', '16분', '비동기 요청의 성공·실패와 HTTP 응답 상태를 구분해 처리해요.',
      'Promise는 나중에 끝나는 작업의 결과를 나타냅니다. 이 과정의 예제는 네트워크에 접속하지 않고 `fetch`와 Response를 흉내 낸 함수를 사용합니다. 실제 Fetch에서는 네트워크 실패와 HTTP 오류 상태를 따로 확인하고, 본문 JSON도 비동기로 읽습니다.',
      ['`await`는 async 함수 안에서 Promise 결과를 기다립니다.', 'HTTP 오류 응답은 네트워크 오류와 다르게 별도 상태 확인이 필요해요.', '사용자에게 표시할 오류는 필요한 정보만 남기고 일관되게 처리해요.'],
      'async function loadCourses(fetcher) {\n  const response = await fetcher("/api/courses");\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n\nconst courses = await loadCourses(async () => ({ ok: true, json: async () => [{ title: "React" }] }));\nconsole.log(courses[0].title); // React (mock 응답)', [
        locateError('js-promises-await-v2', 'JSON 결과를 기다리지 않은 줄 찾기', '응답 본문을 파싱한 뒤 사용자 이름을 읽으려 합니다. Promise 객체에서 바로 `name`을 읽게 만드는 줄은?', 'JavaScript', [
          'async function loadName(response) {',
          '  const profile = response.json();',
          '  return profile.name;',
          '}',
        ], [2], '`json()`은 파싱 결과가 아니라 Promise를 먼저 돌려줍니다.', '2번 줄은 Promise를 profile에 저장합니다. `await response.json()`으로 이행된 객체를 받은 뒤 속성을 읽어야 합니다.'),
        choice('js-fetch-ok', 'HTTP 오류 확인하기', '`fetch`로 받은 응답이 404여도 네트워크 연결은 성공했을 수 있습니다. 응답 상태를 확인하는 조건은 무엇인가요?', [
          ['`if (!response.ok) throw new Error("request failed");`', '`response.ok`는 일반적으로 200~299 상태에서 참이므로 HTTP 실패를 구분할 수 있어요.'],
          ['`if (!fetch) throw new Error("request failed");`', 'fetch는 이미 호출한 함수 이름이며 응답 상태를 나타내지 않아요.'],
          ['`if (!response.json) throw new Error("request failed");`', 'json 메서드 존재 여부는 HTTP 상태 코드 검사와 다릅니다.'],
        ], 0, '네트워크 연결 여부와 HTTP 상태 코드는 서로 다른 정보입니다.', '`response.ok`를 검사해야 404나 500 같은 HTTP 실패 응답도 오류 흐름으로 보낼 수 있습니다.'),
        choice('js-promises-network-failure-v2', '네트워크 실패 전달하기', '`fetch` 자체가 네트워크 문제로 거부될 수 있습니다. 호출자가 실패를 구분하도록 하려면 어떤 처리가 적절한가요?', [
          ['`try { return await fetch(url); } catch (error) { throw error; }`', '실패를 숨기지 않고 호출자가 처리할 수 있도록 전달합니다.'],
          ['`try { return await fetch(url); } catch { return {}; }`', '네트워크 실패를 정상 응답처럼 바꾸어 원인을 감춥니다.'],
          ['`if (!response.ok) throw error;`', '요청이 거부되면 response가 만들어지지 않을 수 있어 이 검사에 도달하지 않습니다.'],
        ], 0, 'HTTP 응답을 받은 경우와 응답조차 받지 못한 경우를 나누어 보세요.', 'fetch가 거부되면 catch에서 오류를 다시 던지거나 명시적인 오류 상태로 바꾸어 호출자에게 알려야 합니다.'),
      ], '고급'),
    lesson('js-event-loop', advancedTopic, '이벤트 루프의 실행 순서', '14분', '동기 코드, microtask, timer 작업의 순서를 구분해 디버깅해요.',
      '자바스크립트는 현재 실행 중인 동기 코드를 먼저 마칩니다. Promise 콜백 같은 microtask는 다음 timer 작업보다 먼저 처리되지만, 브라우저와 Node의 세부 API 순서는 환경에 따라 다를 수 있습니다.',
      ['동기 문장은 현재 호출 스택에서 먼저 실행돼요.', 'Promise의 then 콜백은 일반 timer보다 앞서 처리되는 microtask예요.', '실행 순서 문제는 사용하는 환경과 API를 함께 확인해야 해요.'],
      'const order = ["A"];\nPromise.resolve().then(() => order.push("B"));\norder.push("D");\nawait new Promise((resolve) => setTimeout(() => { order.push("C"); resolve(); }, 0));\nconsole.log(order.join(", ")); // A, D, B, C', [
        choice('js-event-loop-order', '기본 실행 순서', '위 예제의 일반적인 출력 순서는 무엇인가요?', [
          ['A, D, B, C', '동기 A와 D가 먼저, microtask B가 다음, timer C가 마지막에 실행됩니다.'],
          ['A, B, D, C', 'B는 Promise 콜백이므로 현재 동기 코드 D보다 먼저 실행되지 않아요.'],
          ['A, D, C, B', 'microtask는 다음 timer 작업보다 먼저 비워집니다.'],
        ], 0, '동기 문장을 모두 마친 뒤 Promise 콜백과 timer를 비교해 보세요.', '현재 코드 A와 D를 먼저 실행한 다음 microtask B, timer C 순서가 됩니다.'),
        choice('js-event-loop-timer-v2', '0ms 타이머의 의미', '`setTimeout(callback, 0)`에 관한 설명으로 맞는 것은 무엇인가요?', [
          ['현재 코드가 끝나기 전에 callback을 즉시 실행한다.', '타이머도 현재 동기 호출 스택이 끝나기 전에는 callback을 실행하지 않습니다.'],
          ['현재 실행 흐름이 끝난 뒤 가능한 다음 시점에 callback을 예약한다.', '0은 대기 시간을 보장하지 않으며 현재 흐름이 끝난 뒤 실행할 작업을 예약합니다.'],
          ['Promise microtask보다 항상 먼저 callback을 실행한다.', '현재 작업이 끝나면 microtask를 처리한 뒤 다음 timer task를 실행합니다.'],
        ], 1, '0은 같은 줄에서 즉시 실행한다는 뜻이 아닙니다.', 'setTimeout의 0ms는 동기 실행이 끝난 뒤 가능한 시점에 task를 예약합니다. Promise microtask는 다음 timer task보다 먼저 처리됩니다.'),
        shortAnswer('js-event-loop-microtask', 'Promise 콜백 종류', '`Promise.resolve().then(() => {})`의 then 콜백은 일반적으로 어떤 작업 큐에 들어가나요?', ['microtask', '마이크로태스크'],
          'Promise의 then과 timer는 같은 우선순위의 작업이 아니에요.', 'Promise then 콜백은 microtask 큐에서 처리되어 일반 timer 작업보다 먼저 실행됩니다.'),
      ], '실전'),
    lesson('js-algorithms-capstone', advancedTopic, '실전 · 학습 통계 기능 설계', '18분', '입력 검증, 선형 탐색, 불변 데이터 갱신을 조합해 작은 기능을 완성해요.',
      '실전 기능은 한 가지 문법만으로 끝나지 않습니다. 이 단원에서는 완료 기록을 한 번 순회해 통계를 만들고, 입력이 잘못된 경우와 데이터 변경 범위를 함께 고려합니다.',
      ['한 번의 순회로 합계와 개수를 모으면 보통 O(n) 시간이 걸려요.', '평균을 구할 때 0개인 경우를 먼저 처리해야 해요.', '새 배열과 새 객체를 만들면 이전 기록을 의도치 않게 바꾸지 않을 수 있어요.'],
      'function average(scores) {\n  if (scores.length === 0) return 0;\n  return scores.reduce((sum, score) => sum + score, 0) / scores.length;\n}\nconsole.log(average([60, 80, 100]), average([])); // 80 0', [
        choice('js-capstone-complexity', '한 번 순회의 시간', '점수 n개를 한 번씩만 더해 평균을 만드는 함수의 시간 복잡도는 무엇인가요?', [
          ['O(1)', '입력 개수가 늘어나도 같은 수의 작업만 하는 경우가 O(1)입니다.'],
          ['O(n)', '각 점수를 한 번씩 확인하므로 입력 개수에 비례해 작업이 늘어납니다.'],
          ['O(n²)', '모든 점수 쌍을 비교하는 중첩 반복이 없으므로 O(n²)가 아니에요.'],
        ], 1, '점수 하나당 몇 번 처리하는지 세어 보세요.', '입력의 모든 원소를 한 번씩 처리하므로 시간 복잡도는 O(n)입니다.'),
        locateError('js-capstone-empty-average', '빈 배열 나눗셈 찾기', '완료한 문제 수가 0개일 수 있습니다. 0으로 나누게 되는 줄을 고르세요.', 'JavaScript', [
          'function average(scores) {',
          '  const total = scores.reduce((sum, score) => sum + score, 0);',
          '  return total / scores.length;',
          '}',
        ], [3], 'scores가 빈 배열이면 length가 얼마인지 생각해 보세요.', '3번 줄에서 0으로 나누면 JavaScript는 예외 대신 NaN을 계산 결과로 만들어요. 먼저 빈 배열일 때 어떤 값을 돌려줄지 정해야 합니다.'),
        shortAnswer('js-capstone-immutable', '배열 끝에 추가한 새 배열', '`const next = [...completedIds, lessonId];`는 기존 `completedIds`를 바꾸지 않고 무엇을 만드나요?', ['새 배열', 'new array'],
          '전개 문법이 배열 원소를 어디에 펼치는지 살펴보세요.', '전개 문법은 기존 원소를 새 배열 리터럴에 복사하고 lessonId를 뒤에 더한 새 배열을 만듭니다.'),
      ], '실전'),
  ],
};

// G11 keeps the original twelve lesson and exercise identifiers above.  The
// course object below adds a week/day rhythm around them instead of replacing
// a learner's saved answers.
const legacyWeekIds = [
  'js-variables', 'js-conditionals', 'js-loops', 'js-functions', 'js-arrays',
  'js-objects', 'js-scope-closures', 'js-modules-errors-tests', 'js-dom-forms',
  'js-promises-fetch', 'js-event-loop', 'js-algorithms-capstone',
];

const courseWeeks = [
  ['값과 이름', '값의 종류와 const/let을 구분하고 읽기 쉬운 이름을 붙입니다.', 'const title = "JavaScript";\nlet completed = 0;', '값을 다시 대입해야 하나요?', 'const'],
  ['조건과 비교', '비교식과 논리식을 읽고 조건 분기를 안전하게 만듭니다.', 'const canStart = loggedIn && agreed;', '두 조건이 모두 참이어야 하나요?', 'true'],
  ['반복과 순회', '배열을 한 번씩 순회하며 종료 조건과 누적값을 점검합니다.', 'for (const score of scores) total += score;', '배열의 값 자체가 필요한가요?', 'for...of'],
  ['함수와 반환', '입력, 반환값, 부수 효과를 구분해 작은 함수를 만듭니다.', 'function label(name) { return `안녕, ${name}`; }', '호출자에게 돌려줄 값이 있나요?', 'return'],
  ['배열 변환', 'map, filter, reduce의 목적을 구분하고 원본 변경을 피합니다.', 'const passed = scores.filter((score) => score >= 60);', '결과가 배열인가요, 하나의 값인가요?', 'filter'],
  ['객체와 데이터 모델', '객체 속성, 선택적 값, 얕은 복사를 사용해 데이터를 표현합니다.', 'const next = { ...profile, nickname: "민" };', '원래 객체도 바뀌면 안 되나요?', 'spread'],
  ['범위와 클로저', '블록 범위와 함수가 기억하는 바깥 값을 구분합니다.', 'function counter() { let n = 0; return () => ++n; }', '이름이 선언된 블록 안인가요?', 'scope'],
  ['모듈과 오류', '모듈 경계를 정하고 실패를 숨기지 않는 오류 흐름을 만듭니다.', 'export function parse(text) { if (!text) throw new Error("required"); }', '호출자가 실패를 알아야 하나요?', 'throw'],
  ['DOM과 접근성', '요소를 안전하게 찾고 입력과 이벤트를 사용자 흐름에 맞게 처리합니다.', 'form.addEventListener("submit", (event) => event.preventDefault());', '기본 브라우저 동작을 멈춰야 하나요?', 'preventDefault'],
  ['Promise와 요청', 'await, 응답 상태, 취소 흐름을 구분해 비동기 결과를 처리합니다.', 'const response = await fetch("/api/courses");', '응답 본문도 비동기인가요?', 'await'],
  ['실행 순서', '동기 작업, microtask, timer의 순서를 추적하고 긴 작업을 피합니다.', 'Promise.resolve().then(() => console.log("microtask"));', '현재 호출 스택이 먼저 비워지나요?', 'microtask'],
  ['작은 기능 통합', '학습 기록을 검증하고 완료 수와 평균을 계산해 불변 데이터로 반환합니다.', 'function average(scores) {\n  if (scores.length === 0) return 0;\n  return scores.reduce((sum, score) => sum + score, 0) / scores.length;\n}', '빈 입력과 기록 갱신을 함께 처리해야 하나요?', 'immutable'],
  ['문자열과 정규화', '문자열을 비교하기 전에 공백과 대소문자 정책을 명시합니다.', 'const key = text.trim().toLowerCase();', '비교 전에 같은 형태로 만들었나요?', 'trim'],
  ['날짜와 시간', 'Date 값을 표시용 문자열과 계산용 시간값으로 구분합니다.', 'const due = new Date("2026-10-11T09:00:00Z");', '시간대가 포함된 입력인가요?', 'Date'],
  ['Map과 Set', '키 기반 조회와 중복 제거에 알맞은 컬렉션을 선택합니다.', 'const ids = new Set(["a", "a", "b"]);', '중복을 자동으로 제거해야 하나요?', 'Set'],
  ['이터레이터와 제너레이터', '지연 순회가 필요한 경우 generator의 next 흐름을 읽습니다.', 'function* pages() { yield 1; yield 2; }', '값을 한 번에 모두 만들 필요가 있나요?', 'yield'],
  ['클래스와 합성', '상속보다 필요한 동작을 조합하는 설계를 비교합니다.', 'const service = { save, validate };', '공유할 것은 상태인가요, 동작인가요?', 'composition'],
  ['프로토타입 이해', '객체 자신의 속성과 프로토타입 체인의 조회를 구분합니다.', 'Object.hasOwn(profile, "name")', '객체가 직접 가진 속성인가요?', 'prototype'],
  ['테스트 설계', '정상, 경계, 실패 사례를 나누어 테스트의 의도를 표현합니다.', 'assert.equal(total([]), 0);', '빈 입력도 요구사항에 있나요?', 'boundary'],
  ['디버깅 방법', '재현, 관찰, 가설 검증 순서로 오류 원인을 좁힙니다.', 'console.log({ input, result });', '먼저 재현 가능한 최소 사례가 있나요?', 'reproduce'],
  ['성능 측정', '추측 대신 측정값으로 병목을 찾고 불필요한 일을 줄입니다.', 'performance.mark("render-start");', '측정 전후 조건이 같은가요?', 'measure'],
  ['브라우저 저장소', 'localStorage의 문자열 경계와 JSON 파싱 실패를 처리합니다.', 'localStorage.setItem("theme", JSON.stringify(theme));', '저장소 값은 문자열인가요?', 'JSON'],
  ['네트워크 상태', '로딩, 빈 결과, HTTP 실패, 네트워크 실패를 구분해 화면에 표시합니다.', 'if (!response.ok) throw new Error(`HTTP ${response.status}`);', 'HTTP 실패와 연결 실패가 같은가요?', 'response.ok'],
  ['동시 요청 제어', '늦게 도착한 응답과 취소 신호를 다뤄 오래된 화면 갱신을 막습니다.', 'const controller = new AbortController();', '새 요청 전에 이전 요청을 취소해야 하나요?', 'AbortController'],
  ['보안 경계', '신뢰하지 않는 문자열을 HTML로 해석하지 않고 입력 경계를 점검합니다.', 'element.textContent = message;', '문자열을 HTML로 넣고 있나요?', 'textContent'],
  ['캡스톤 점검', '요구사항, 오류 경로, 접근성, 테스트를 점검하며 작은 앱을 마무리합니다.', 'const lessons = [{ completed: true }, { completed: false }];\nconst summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + Number(lesson.completed) }), { total: 0, completed: 0 });\nconsole.log(summary); // { total: 2, completed: 1 }', '사용자 흐름과 실패 흐름을 모두 확인했나요?', 'review'],
];

const legacyDayTitles = [
  ['값과 자료형', 'const와 let', '연산식 읽기', '문자열 만들기', '재할당 추적'],
  ['비교 연산자', '논리식 조합', '조건 분기', '참과 거짓', '가드 조건'],
  ['반복 범위', '배열 순회', '누적값 갱신', '반복 종료', '배열 메서드'],
  ['매개변수', 'return 값', '기본 인자', '함수 범위', '작은 함수 설계'],
  ['배열 인덱스', '배열 추가와 삭제', 'map과 filter', '복사와 원본', '배열 경계값'],
  ['속성 읽기', '선택적 값', '객체 펼치기', '객체 참조', '데이터 모양 설계'],
  ['블록 범위', '함수 범위', '클로저 상태', '호출 순서', '클로저 활용'],
  ['모듈 내보내기', '모듈 가져오기', '오류 만들기', '예외 처리', '단위 테스트 경계'],
  ['요소 선택', '입력값 읽기', '이벤트 연결', '폼 제출', 'DOM 업데이트'],
  ['Promise 결과', 'async와 await', 'HTTP 상태', 'JSON 응답', '요청 취소'],
  ['호출 스택', '타이머 큐', 'microtask', '렌더 작업', '긴 작업 나누기'],
  ['요구사항과 평균', '빈 입력과 누적', '완료 기록 갱신', '복잡도 점검', '통합 검토'],
];

const phaseDefinitions = [
  ['js-foundation', '1단계 · 프로그래밍 기초', 1, 4, '값, 조건, 반복, 함수를 읽고 작성합니다.'],
  ['js-data', '2단계 · 데이터 다루기', 5, 8, '배열과 객체, 범위, 모듈로 데이터를 정리합니다.'],
  ['js-browser', '3단계 · 브라우저와 비동기', 9, 12, 'DOM, 요청, 실행 흐름을 실제 화면의 문제와 연결합니다.'],
  ['js-language', '4단계 · 언어를 넓히기', 13, 16, '문자열, 시간, 컬렉션, 지연 순회를 활용합니다.'],
  ['js-quality', '5단계 · 설계와 품질', 17, 21, '설계, 테스트, 디버깅, 측정의 근거를 세웁니다.'],
  ['js-application', '6단계 · 웹 기능 완성', 22, 26, '저장, 네트워크, 보안, 종합 점검으로 기능을 다듬습니다.'],
];

function escapedCodePattern(source) {
  return String(source)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
}

function exactFunctionRepairPattern(functionName, starterCode, repairBody) {
  // The generated questions are structural checks, not code execution. Keep
  // the accepted shape intentionally narrow: preserve the starter signature
  // and require the repaired body so a missing default parameter or changed
  // function contract cannot earn a false pass.
  const nameMatch = /^\s*(?:async\s+)?function\*?\s+([A-Za-z_$][\w$]*)\s*\(/.exec(starterCode);
  if (!nameMatch || nameMatch[1] !== functionName) throw new Error(`Missing ${functionName} starter declaration`);
  const openingParen = nameMatch[0].lastIndexOf('(');
  let depth = 0;
  let quote = '';
  let escaped = false;
  let signatureEnd = -1;
  for (let index = openingParen; index < starterCode.length; index += 1) {
    const character = starterCode[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '(') depth += 1;
    else if (character === ')' && --depth === 0) {
      signatureEnd = index + 1;
      break;
    }
  }
  if (signatureEnd === -1) throw new Error(`Unclosed ${functionName} starter parameters`);
  const signature = starterCode.slice(0, signatureEnd).trim();
  return `^\\s*${escapedCodePattern(signature)}\\s*\\{\\s*${escapedCodePattern(repairBody)}\\s*\\}\\s*$`;
}

function phaseForWeek(week) {
  return phaseDefinitions.find(([, , start, end]) => week >= start && week <= end)[0];
}

const practice = [
  ['const와 let', '계속 증가하는 완료 수를 선언하는 알맞은 방법은?', ['`const done = 0`', '`let done = 0`', '`const done;`'], 1, 'let done = 1; done += 2;\nconsole.log(done);', ['3'], ['const course = "JS";', 'course = "Java";', 'console.log(course);'], 2, '2번 줄은 const로 선언한 이름에 새 값을 대입합니다. 재대입이 필요하면 let을 사용해야 합니다.', 'increaseDone', 'function increaseDone(done) {\n  return done;\n}', 'return done + 1;', '완료 수에 1을 더한 값을 반환한다.'],
  ['엄격 비교', '문자열 "0"과 숫자 0을 비교할 때 타입까지 비교하는 연산자는?', ['`==`', '`=`', '`===`'], 2, 'console.log(3 > 2 && 2 > 5);', ['false'], ['const role = "admin";', 'if (role = "member") {', '  showMember();', '}'], 2, '2번 줄은 비교 대신 role 값을 바꿉니다. `role === "member"`로 비교해야 합니다.', 'isAdult', 'function isAdult(age) {\n  return age;\n}', 'return age >= 18;', '18 이상이면 true, 그 외에는 false를 반환한다.'],
  ['for...of 순회', '배열의 각 점수 자체를 하나씩 읽을 때 가장 알맞은 반복문은?', ['`for (const score of scores)`', '`for (const score in scores)`', '`for (const score of total)`'], 0, 'let sum = 0;\nfor (const n of [1, 2, 3]) sum += n;\nconsole.log(sum);', ['6'], ['const scores = [80, 90];', 'for (const score in scores) {', '  total += score;', '}'], 2, '2번 줄의 for...in은 배열 값이 아니라 인덱스 문자열을 순회합니다. 점수를 더하려면 for...of를 사용해야 합니다.', 'countPassed', 'function countPassed(scores) {\n  return 0;\n}', 'return scores.filter((score) => score >= 60).length;', '60점 이상 점수의 개수를 반환한다.'],
  ['반환값', '입력값을 두 배로 계산한 결과를 호출자에게 보내려면 무엇이 필요할까요?', ['`console.log(value * 2)`만 사용', '`return value * 2`', '함수 밖에서 value 변경'], 1, 'function add(left, right) { return left + right; }\nconsole.log(add(2, 5));', ['7'], ['function double(value) {', '  value * 2;', '}', 'const result = double(3);'], 2, '2번 줄은 계산만 하고 반환하지 않습니다. `return value * 2;`가 필요합니다.', 'formatName', 'function formatName(name) {\n  return name;\n}', 'return `학습자: ${name}`;', '이름 앞에 "학습자: "를 붙인 문자열을 반환한다.'],
  ['배열 변환', '원본 배열 길이를 유지하며 각 값을 변환한 새 배열을 만드는 메서드는?', ['`filter`', '`map`', '`find`'], 1, 'const labels = ["a", "b"].map((text) => text.toUpperCase());\nconsole.log(labels.join(","));', ['A,B'], ['const names = ["B", "A"];', 'const visible = names.sort();', 'render(names);'], 2, '2번 줄의 sort는 names 원본을 바꿉니다. 원본 순서를 유지하려면 `[...names].sort()`가 필요합니다.', 'discount', 'function discount(prices) {\n  return prices;\n}', 'return prices.map((price) => price * 0.9);', '각 가격의 10%를 뺀 새 배열을 반환한다.'],
  ['객체 복사', 'profile의 다른 속성을 유지하면서 name만 바꿀 때 알맞은 표현은?', ['`profile.name = name`', '`{ ...profile, name }`', '`Object.keys(profile)`'], 1, 'const profile = { name: "민", level: 2 };\nconst next = { ...profile, level: 3 };\nconsole.log(next.name);', ['민'], ['const first = { theme: "light" };', 'const second = first;', 'second.theme = "dark";'], 2, '2번 줄은 객체를 복사하지 않아 first와 second가 같은 객체를 가리킵니다. 전개 문법으로 새 객체를 만들어야 합니다.', 'renameProfile', 'function renameProfile(profile, name) {\n  return profile;\n}', 'return { ...profile, name };', '기존 속성을 보존하고 name 속성만 새 값으로 바꾼 객체를 반환한다.'],
  ['블록 범위', 'if 블록 안에서 const로 만든 이름은 어디에서 읽을 수 있을까요?', ['같은 블록 안', '파일 어디에서나', '함수 호출 뒤 자동으로'], 0, 'let label = "밖";\n{ const label = "안"; }\nconsole.log(label);', ['밖'], ['if (true) {', '  const bonus = 3;', '}', 'console.log(bonus);'], 4, '4번 줄은 블록 밖에서 bonus를 읽습니다. 블록 밖에서도 필요하면 바깥에서 선언해야 합니다.', 'makeCounter', 'function makeCounter() {\n  let count = 0;\n  return () => count;\n}', 'return () => ++count;', '호출할 때마다 이전 count보다 1 큰 값을 반환하는 함수를 반환한다.'],
  ['오류 전달', '입력 누락을 호출자에게 알릴 때 가장 알맞은 동작은?', ['조용히 undefined 반환', '원인을 담은 Error를 던짐', '빈 catch 블록 사용'], 1, 'function parse(text) { if (!text) throw new Error("required"); return text; }\ntry { parse(""); } catch (error) { console.log(error.message); }', ['required'], ['async function save(item) {', '  try { await write(item); }', '  catch (error) { return; }', '}'], 3, '3번 줄은 저장 실패를 성공처럼 숨깁니다. 사용자에게 상태를 보이거나 오류를 다시 던져야 합니다.', 'requireTitle', 'function requireTitle(title) {\n  return title;\n}', 'if (!title) throw new Error("title is required");\n  return title;', '빈 문자열이면 Error를 던지고, 값이 있으면 그대로 반환한다.'],
  ['폼 제출', '폼 검증 후 브라우저의 기본 페이지 이동을 막는 메서드는?', ['`event.preventDefault()`', '`event.stop()`', '`form.value()`'], 0, 'const value = "   ".trim();\nconsole.log(value.length);', ['0'], ['form.addEventListener("submit", (event) => {', '  event.preventDefault;', '  save(input.value);', '});'], 2, '2번 줄은 preventDefault 함수를 실행하지 않습니다. 괄호를 붙여 호출해야 합니다.', 'readTitle', 'function readTitle(input) {\n  return input.value;\n}', 'return input.value.trim();', '입력 요소의 현재 값을 읽어 앞뒤 공백을 제거해 반환한다.'],
  ['fetch 응답', 'fetch 응답이 404일 때 HTTP 실패를 확인하는 속성은?', ['`response.ok`', '`response.json`', '`fetch.ok`'], 0, 'async function size() { const response = await fetch("/api"); return response.status; }', ['200'], ['async function load() {', '  const response = await fetch("/api/me");', '  const data = response.json();', '  return data.name;', '}'], 3, '3번 줄의 json()은 Promise를 반환합니다. `await response.json()`으로 결과를 기다린 뒤 name을 읽어야 합니다.', 'readJson', 'async function readJson(response) {\n  return response.json();\n}', 'return await response.json();', '응답 본문을 파싱한 실제 값을 반환한다.'],
  ['microtask', '일반 timer보다 먼저 처리되는 Promise then 콜백은 어느 큐에 들어갈까요?', ['task 큐', 'microtask 큐', 'call stack 끝'], 1, 'console.log("A");\nPromise.resolve().then(() => console.log("B"));\nconsole.log("C");', ['A,C,B'], ['button.addEventListener("click", () => {', '  while (true) {}', '  status.textContent = "done";', '});'], 2, '2번 줄의 끝나지 않는 반복은 주 스레드를 점유해 화면 갱신과 입력을 막습니다.', 'afterTick', 'function afterTick(log) {\n  log("later");\n}', 'return Promise.resolve().then(() => log("later"));', '현재 동기 흐름 뒤 microtask에서 log를 호출하는 Promise를 반환한다.'],
  ['불변 갱신', '완료 목록 끝에 id를 추가하면서 원본 배열을 바꾸지 않는 표현은?', ['`completed.push(id)`', '`[...completed, id]`', '`completed = id`'], 1, 'const ids = ["a"];\nconst next = [...ids, "b"];\nconsole.log(ids.length);', ['1'], ['function addId(ids, id) {', '  ids.push(id);', '  return ids;', '}'], 2, '2번 줄은 호출자가 가진 ids 배열도 바꿉니다. 새 배열을 반환하려면 전개 문법을 사용해야 합니다.', 'average', 'function average(scores) {\n  return scores.reduce((sum, score) => sum + score) / scores.length;\n}', 'if (scores.length === 0) return 0;\n  return scores.reduce((sum, score) => sum + score, 0) / scores.length;', '빈 배열에는 0을 반환하고, 그 외에는 합계를 길이로 나눈다.'],
  ['문자열 정규화', '사용자 검색어의 앞뒤 공백과 대소문자를 무시하려면 어떤 순서가 알맞을까요?', ['`text.trim().toLowerCase()`', '`text.toLowerCase().length`', '`text.split(" ")`'], 0, 'console.log("  JS ".trim().toLowerCase());', ['js'], ['const query = " JS ";', 'if (query === "js") show();', ''], 2, '2번 줄은 공백과 대소문자가 다른 문자열을 그대로 비교합니다. 비교 전 정규화가 필요합니다.', 'normalizeQuery', 'function normalizeQuery(query) {\n  return query;\n}', 'return query.trim().toLowerCase();', '앞뒤 공백을 제거하고 소문자로 만든 문자열을 반환한다.'],
  ['시간대', '서버에서 받은 UTC 시각을 계산용으로 보관할 때 알맞은 값은?', ['현지 표시 문자열만', '`Date` 객체 또는 timestamp', '시간대 없는 임의 문자열'], 1, 'const due = new Date("2026-10-11T09:00:00Z");\nconsole.log(Number.isNaN(due.valueOf()));', ['false'], ['const due = new Date("2026-10-11");', 'if (due === "2026-10-11") notify();', ''], 2, '2번 줄은 Date 객체와 문자열을 엄격 비교합니다. 비교하려면 시간값이나 같은 형식의 문자열로 변환해야 합니다.', 'isFuture', 'function isFuture(date, now) {\n  return false;\n}', 'return date.getTime() > now.getTime();', 'date가 now보다 미래이면 true를 반환한다.'],
  ['Set 중복 제거', '등록한 코스 id의 중복을 제거하는 데 알맞은 컬렉션은?', ['`Set`', '`Array`만 사용', '`Date`'], 0, 'const ids = new Set(["a", "a", "b"]);\nconsole.log(ids.size);', ['2'], ['const selected = new Set();', 'selected.add("js");', 'selected.add("js");', 'console.log(selected[0]);'], 4, '4번 줄은 Set을 배열처럼 인덱스로 읽습니다. 값은 for...of나 has로 다뤄야 합니다.', 'hasCourse', 'function hasCourse(ids, id) {\n  return false;\n}', 'return ids.has(id);', 'Set 안에 id가 있으면 true를 반환한다.'],
  ['generator', '한 페이지씩 값을 만들고 다음 값을 요청할 때 쓰기 좋은 문법은?', ['`yield`가 있는 generator', '즉시 실행 함수만', '객체 리터럴만'], 0, 'function* pages() { yield 1; yield 2; }\nconsole.log(pages().next().value);', ['1'], ['function* pages() {', '  return 1;', '  yield 2;', '}'], 2, '2번 줄의 return은 generator를 끝냅니다. 다음 값을 이어서 제공하려면 yield를 사용해야 합니다.', 'firstPage', 'function* firstPage() {\n  return 1;\n}', 'yield 1;', '첫 next 호출에서 value 1을 제공하는 generator를 만든다.'],
  ['합성', '검증과 저장을 필요한 함수만 조합해 서비스에 넣는 방식은?', ['동작을 담은 객체 조합', '모든 기능을 한 전역 변수에 작성', '상속만 강제'], 0, 'const service = { validate, save };\nconsole.log(typeof service.save);', ['function'], ['const service = { validate, save };', 'service.validate = save();', ''], 2, '2번 줄은 save를 즉시 실행한 반환값으로 validate를 덮어쓸 수 있습니다. 함수를 참조로 보관해야 합니다.', 'runSave', 'function runSave(validate, save, value) {\n  return save(value);\n}', 'if (!validate(value)) return false;\n  return save(value);', '검증이 실패하면 false를 반환하고, 통과한 경우에만 save를 호출한다.'],
  ['프로토타입', '객체 자신이 직접 가진 속성인지 확인하는 정적 메서드는?', ['`Object.hasOwn`', '`Object.values`', '`Array.isArray`'], 0, 'const profile = Object.create({ role: "learner" });\nprofile.name = "민";\nconsole.log(Object.hasOwn(profile, "name"));', ['true'], ['const profile = Object.create({ role: "learner" });', 'if (profile.hasOwnProperty("role")) show();', ''], 2, '2번 줄의 hasOwnProperty는 프로토타입 오염이나 null 프로토타입 객체에서 안전하지 않을 수 있습니다. Object.hasOwn(profile, "role")을 사용하세요.', 'ownName', 'function ownName(profile) {\n  return true;\n}', 'return Object.hasOwn(profile, "name");', 'profile이 직접 가진 name 속성이 있을 때만 true를 반환한다.'],
  ['경계 테스트', '빈 배열을 받는 합계 함수에 필요한 테스트 사례는?', ['`[]` 입력', '큰 배열만', '문자열만'], 0, 'function total(values) { return values.reduce((sum, value) => sum + value, 0); }\nconsole.log(total([]));', ['0'], ['function total(values) {', '  return values.reduce((sum, value) => sum + value);', '}'], 2, '2번 줄은 빈 배열에서 초기값 없이 reduce를 호출합니다. 0 같은 초기 누적값이 필요합니다.', 'total', 'function total(values) {\n  return 0;\n}', 'return values.reduce((sum, value) => sum + value, 0);', '빈 배열에는 0, 숫자 배열에는 모든 값의 합계를 반환한다.'],
  ['재현 가능한 오류', '간헐적 오류를 조사할 때 가장 먼저 확보할 자료는?', ['재현 절차와 입력', '코드 전체를 즉시 다시 작성', '오류를 숨기는 catch'], 0, 'const input = { page: 0 };\nconsole.log(JSON.stringify(input));', ['{"page":0}'], ['try {', '  render(data);', '} catch (error) {', '  // ignore', '}'], 4, '4번 줄은 오류를 무시해 원인과 재현 정보를 잃습니다. 오류 상태와 관련 입력을 기록해야 합니다.', 'parsePage', 'function parsePage(value) {\n  return Number(value);\n}', 'const page = Number(value);\n  if (!Number.isInteger(page) || page < 1) throw new Error("invalid page");\n  return page;', '1 이상의 정수 페이지 번호만 반환하고 나머지는 오류로 알린다.'],
  ['측정', '렌더링이 느리다는 가설을 검증하는 가장 신뢰할 만한 방법은?', ['같은 조건에서 시간 측정', '느낌으로 함수 삭제', '한 번만 보고 결론'], 0, 'performance.mark("start");\nperformance.mark("end");\nconsole.log(performance.measure("render", "start", "end").duration >= 0);', ['true'], ['console.time("render");', 'render(items);', 'console.time("render");'], 3, '3번 줄은 같은 라벨로 측정을 시작합니다. 끝낼 때는 `console.timeEnd("render")`를 호출해야 합니다.', 'limitItems', 'function limitItems(items, limit) {\n  return items;\n}', 'return items.slice(0, limit);', '앞에서부터 limit개 이하의 새 배열을 반환한다.'],
  ['JSON 저장', 'localStorage에 객체를 저장하기 전에 필요한 변환은?', ['`JSON.stringify`', '`JSON.parse`', '`Object.freeze`'], 0, 'const theme = JSON.parse("{\"mode\":\"dark\"}");\nconsole.log(theme.mode);', ['dark'], ['localStorage.setItem("prefs", { mode: "dark" });', 'const prefs = JSON.parse(localStorage.getItem("prefs"));', ''], 1, '1번 줄은 객체를 문자열로 직렬화하지 않습니다. 저장 전 JSON.stringify가 필요하며, 읽을 때 null과 파싱 실패도 처리해야 합니다.', 'readPrefs', 'function readPrefs(text) {\n  return {};\n}', 'if (!text) return {};\n  return JSON.parse(text);', '저장된 문자열이 없으면 빈 객체를, 있으면 파싱한 객체를 반환한다.'],
  ['요청 상태', 'HTTP 500 응답을 사용자에게 실패 상태로 보이려면 어떤 확인이 필요한가요?', ['`response.ok` 검사', '응답 객체가 존재하는지만 검사', 'json 변환만 수행'], 0, 'const response = { ok: false, status: 500 };\nconsole.log(!response.ok);', ['true'], ['const response = await fetch("/api/courses");', 'const courses = await response.json();', 'render(courses);'], 2, '2번 줄 전에 response.ok를 검사하지 않으면 404나 500의 본문을 정상 데이터처럼 렌더링할 수 있습니다.', 'loadCourses', 'async function loadCourses(response) {\n  return response.json();\n}', 'if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();', '성공 응답일 때만 JSON 본문을 반환하고 실패 상태는 Error로 알린다.'],
  ['요청 취소', '검색어가 바뀔 때 이전 요청의 오래된 결과를 막는 브라우저 API는?', ['`AbortController`', '`Array.sort`', '`setInterval`'], 0, 'const controller = new AbortController();\ncontroller.abort();\nconsole.log(controller.signal.aborted);', ['true'], ['const controller = new AbortController();', 'fetch("/api?q=a", { signal: controller });', 'controller.abort();'], 2, '2번 줄에는 controller 자체가 아니라 `controller.signal`을 전달해야 취소 신호가 요청에 연결됩니다.', 'requestWithSignal', 'function requestWithSignal(url, controller) {\n  return fetch(url);\n}', 'return fetch(url, { signal: controller.signal });', 'controller의 signal을 fetch 옵션에 전달한 Promise를 반환한다.'],
  ['안전한 DOM 출력', '사용자 작성 텍스트를 화면에 보일 때 HTML로 해석하지 않는 속성은?', ['`textContent`', '`innerHTML`', '`outerHTML`'], 0, 'const element = { textContent: "" };\nelement.textContent = "<b>안전</b>";\nconsole.log(element.textContent);', ['<b>안전</b>'], ['const message = userInput;', 'target.innerHTML = message;', ''], 2, '2번 줄은 신뢰하지 않는 문자열을 HTML로 해석할 수 있습니다. 단순 텍스트 표시에는 textContent를 사용하세요.', 'showMessage', 'function showMessage(element, message) {\n  element.innerHTML = message;\n}', 'element.textContent = message;', 'message를 HTML로 해석하지 않고 텍스트로 표시한다.'],
  ['기능 점검', '배포 전 학습 통계 화면에서 실패 흐름까지 확인하는 검토는?', ['빈 결과와 요청 실패를 함께 점검', '정상 데이터 한 번만 확인', '콘솔 오류를 숨김'], 0, 'const completed = [true, false, true];\nconsole.log(completed.filter(Boolean).length);', ['2'], ['function summary(items) {', '  return items.reduce((total, item) => total + item.minutes);', '}', 'summary([]);'], 2, '2번 줄은 초기 누적값 없이 reduce를 호출합니다. 빈 목록에서는 TypeError가 나므로 0 같은 초기값을 전달해야 합니다.', 'completedCount', 'function completedCount(items) {\n  return 0;\n}', 'return items.filter((item) => item.completed === true).length;', 'completed가 true인 항목 수를 반환한다.'],
];

const repairChecks = {
  increaseDone: [['2', '3'], ['0', '1']], isAdult: [['18', 'true'], ['17', 'false']],
  countPassed: [['[55, 60, 90]', '2'], ['[]', '0']], formatName: [['"민"', '"학습자: 민"'], ['""', '"학습자: "']],
  discount: [['[100, 50]', '[90, 45]'], ['[]', '[]']], renameProfile: [['{ name: "A", level: 2 }, "B"', '{ name: "B", level: 2 }'], ['{ level: 1 }, "M"', '{ level: 1, name: "M" }']],
  makeCounter: [['호출 1회', '1'], ['호출 2회', '2']], requireTitle: [['"JS"', '"JS"'], ['""', 'Error']],
  readTitle: [['{ value: " JS " }', '"JS"'], ['{ value: "" }', '""']], readJson: [['Response JSON { id: 1 }', '{ id: 1 }'], ['Response JSON []', '[]']],
  afterTick: [['log 함수', 'microtask 뒤 later 기록'], ['log 함수', 'Promise 반환']], average: [['[2, 4]', '3'], ['[]', '0']],
  normalizeQuery: [['" JS "', '"js"'], ['"React"', '"react"']], isFuture: [['미래 date, 과거 now', 'true'], ['같은 시각', 'false']],
  hasCourse: [['Set("js"), "js"', 'true'], ['Set("js"), "py"', 'false']], firstPage: [['첫 next()', '1'], ['첫 next()의 done', 'false']],
  runSave: [['validate false', 'false'], ['validate true', 'save 결과']], ownName: [['{ name: "민" }', 'true'], ['Object.create({ name: "민" })', 'false']],
  total: [['[2, 3]', '5'], ['[]', '0']], parsePage: [['"2"', '2'], ['"0"', 'Error']],
  limitItems: [['[1, 2, 3], 2', '[1, 2]'], ['[1], 5', '[1]']], readPrefs: [['null', '{}'], ['"{\\"mode\\":\\"dark\\"}"', '{ mode: "dark" }']],
  loadCourses: [['ok response JSON []', '[]'], ['500 response', 'Error']], requestWithSignal: [['url, controller', 'fetch에 signal 전달'], ['다른 controller', '그 signal을 사용']],
  showMessage: [['element, "<b>x</b>"', 'textContent에 문자열'], ['element, "안녕"', '텍스트 표시']], completedCount: [['[{ completed: true }, { completed: false }]', '1'], ['[]', '0']],
};

// Function and later implementation sessions use examples that match the
// day's task instead of replaying the weekly fixture.
const foundationRepairVariants = {
  '4-4': ['withDefault', 'function withDefault(name = "학습자") {\n  return "";\n}', 'return `안녕, ${name}`;', 'name이 없으면 기본 이름을 사용해 인사 문자열을 반환한다.', ['"민"', '"안녕, 민"'], ['undefined', '"안녕, 학습자"']],
  '4-5': ['courseLabel', 'function courseLabel(title, level) {\n  return title;\n}', 'return `${title} (${level})`;', '제목과 수준을 함께 담은 표시 문자열을 반환한다.', ['"JS", "기초"', '"JS (기초)"'], ['"React", "중급"', '"React (중급)"']],
  '5-4': ['sortedCopy', 'function sortedCopy(names) {\n  return names.sort();\n}', 'return [...names].sort();', '원본 배열을 유지하며 정렬한 새 배열을 반환한다.', ['["b", "a"]', '["a", "b"]'], ['["c", "a"]', '["a", "c"]']],
  '5-5': ['lastVisible', 'function lastVisible(items) {\n  return items[items.length];\n}', 'return items.length === 0 ? null : items[items.length - 1];', '빈 배열은 null로, 그 외에는 마지막 항목을 반환한다.', ['["JS", "React"]', '"React"'], ['[]', 'null']],
  '6-4': ['courseSummary', 'function courseSummary(course) {\n  return course.title + course.minutes;\n}', 'return `${course.title}: ${course.minutes}분`;', '객체의 제목과 학습 시간을 읽기 쉬운 문장으로 반환한다.', ['{ title: "Python", minutes: 30 }', '"Python: 30분"'], ['{ title: "React", minutes: 15 }', '"React: 15분"']],
  '6-5': ['updateLevel', 'function updateLevel(profile, level) {\n  profile.level = level;\n  return profile;\n}', 'return { ...profile, level };', '기존 profile을 바꾸지 않고 다른 필드를 보존한 새 객체를 반환한다.', ['{ name: "민", level: 1 }, 2', '{ name: "민", level: 2 }'], ['{ name: "수", theme: "dark" }, 3', '{ name: "수", theme: "dark", level: 3 }']],
  '7-4': ['makeCounter', 'function makeCounter() {\n  let count = 0;\n  return () => count;\n}', 'let count = 0;\n  return () => ++count;', '반환된 함수를 호출할 때마다 닫힌 count를 1 늘려 반환한다.', ['2회 호출', '1, 2'], ['새 counter에서 1회 호출', '1']],
  '7-5': ['makeCounterPair', 'function makeCounterPair() {\n  let count = 0;\n  return [() => count++, () => count++];\n}', 'let count = 0;\n  return [() => ++count, () => ++count];', '첫 호출은 1을 반환하고, 두 반환 함수가 같은 count 상태를 공유해 다음 호출은 2를 반환한다.', ['첫 함수, 둘째 함수 순서로 한 번씩 호출', '1, 2'], ['첫 함수 두 번 호출', '1, 2']],
  '8-4': ['parseAttempt', 'function parseAttempt(raw) {\n  try { return Number(raw); }\n  catch { return 0; }\n}', 'if (typeof raw !== "string" || raw.trim() === "") return null;\n  const value = Number(raw);\n  return Number.isInteger(value) ? value : null;', '문자열을 숫자로 변환한 결과가 정수이면 숫자로 반환하고, 공백·정수가 아닌 값·비문자열 입력은 null로 반환한다.', ['"12"', 12], ['"2.5"', 'null']],
  '8-5': ['isUsableTitle', 'function isUsableTitle(title) {\n  return true;\n}', 'return typeof title === "string" && title.trim().length > 0;', '문자열이며 공백만 있지 않은 제목에서만 true를 반환한다.', ['"React"', 'true'], ['"   "', 'false']],
};

const javascriptRepairAlternativeBodies = {
  '4-5': ['return title + " (" + level + ")";', "return title + ' (' + level + ')';"],
  '5-4': [
    'return names.slice().sort();',
    'return names.toSorted();',
    'return Array.from(names).sort();',
    'const copy = names.slice();\n  copy.sort();\n  return copy;',
    'const copy = [...names];\n  copy.sort();\n  return copy;',
  ],
  '5-5': [
    'if (items.length === 0) return null;\n  return items[items.length - 1];',
    'if (items.length === 0) return null;\n  return items.at(-1);',
    'if (!items.length) return null;\n  return items.at(-1);',
    'return items.length === 0 ? null : items.at(-1);',
  ],
  '6-4': ['return course.title + ": " + course.minutes + "분";', "return course.title + ': ' + course.minutes + '분';"],
  '6-5': [
    'return { ...profile, level: level };',
    'return Object.assign({}, profile, { level });',
    'return Object.assign({}, profile, { level: level });',
    'const updated = { ...profile };\n  updated.level = level;\n  return updated;',
    'const updated = Object.assign({}, profile);\n  updated.level = level;\n  return updated;',
  ],
  '7-4': [
    'let count = 0;\n  return () => { count += 1; return count; };',
    'let count = 0;\n  return function () { return ++count; };',
    'let count = 0;\n  return () => (count += 1);',
  ],
  '7-5': [
    'let count = 0;\n  return [() => { count += 1; return count; }, () => { count += 1; return count; }];',
    'let count = 0;\n  return [function () { return ++count; }, function () { return ++count; }];',
  ],
  '8-4': [
    'if (typeof raw !== "string" || raw.trim() === "") return null;\n  const value = Number(raw);\n  if (!Number.isInteger(value)) return null;\n  return value;',
    "if (typeof raw !== 'string' || raw.trim() === '') return null;\n  const value = Number(raw);\n  return Number.isInteger(value) ? value : null;",
  ],
  '8-5': [
    "return typeof title === 'string' && title.trim().length > 0;",
    'if (typeof title !== "string") return false;\n  return title.trim().length > 0;',
    'return typeof title === "string" && Boolean(title.trim());',
  ],
  '10-4': ['return await response.json();'],
  '10-5': ['const options = { signal: controller.signal };\n  return fetch(url, options);'],
  '11-4': [
    'const callback = () => update("ready");\n  return requestFrame(callback);',
    'return requestFrame(function () { update("ready"); });',
  ],
  '11-5': ['return scheduleTask(() => work());'],
  '13-4': [
    'const normalized = query.trim().toLowerCase();\n  return normalized;',
    'return query.trim().toLocaleLowerCase("en-US");',
  ],
  '13-5': [
    'const compact = tag.trim().replace(/\\s+/gu, " ");\n  return compact.normalize("NFC").toLowerCase();',
  ],
  '14-4': ['return date instanceof Date && Number.isFinite(date.getTime());'],
  '14-5': [
    'return (end.getTime() - start.getTime()) / (60 * 60 * 1000);',
    'const elapsedMs = end.getTime() - start.getTime();\n  return elapsedMs / 3600000;',
  ],
  '15-4': [
    'return [...map];',
    'return Array.from(map.entries());',
    'return Array.from(map);',
  ],
  '15-5': ['return Array.from(new Set(ids));'],
  '9-4': [
    'const title = input.value.trim();\n  if (title.length === 0) return null;\n  return title;',
    'const title = input.value.trim();\n  if (!title) return null;\n  return title;',
    'const title = input.value.trim();\n  return title || null;',
  ],
};

const foundationRepairAlternativePatterns = {
  '10-4': [String.raw`^\s*async\s+function\s+readJson\s*\(\s*response\s*\)\s*\{\s*return\s+await\s+response\.json\(\)\s*;?\s*\}\s*$`],
};

const foundationDailyCases = {
  '1-1': ['값의 자료형', '숫자 분 단위를 저장한 값의 자료형을 확인하는 표현은?', ['`typeof minutes`', '`minutes.type`', '`Number(minutes)`'], 0, 'const minutes = 30;\nconsole.log(typeof minutes);', ['number'], ['const label = "JavaScript";', 'label = "JS";', 'console.log(label);'], 2, '2번 줄은 const로 선언한 label에 새 값을 대입합니다. 값이 바뀌면 let으로 선언해야 합니다.'],
  '1-2': ['변수 선언 규칙', '값을 다시 대입할 이름을 선언할 때 고려해야 할 규칙은?', ['`let completed = 0`으로 선언하면 다시 대입할 수 있다', '`const completed = 0`으로 선언하면 다시 대입할 수 있다', '블록 안에서 선언한 이름은 선언 전에 읽을 수 있다'], 0, 'const course = "JavaScript";\nlet completed = 0;\ncompleted += 1;\nconsole.log(course, completed);', ['JavaScript 1'], ['const course = "JavaScript";', 'console.log(course);', 'let completed = 0;'], 3, '3번 줄은 completed를 선언하기 전에 읽습니다. const와 let으로 선언한 이름은 선언문을 실행하기 전에 접근할 수 없습니다.'],
  '1-3': ['누적 연산', '반복 중 score를 total에 계속 더하는 알맞은 식은?', ['`total += score`', '`total =+ score`', '`score += total`'], 0, 'const total = 2 * 3 + 1;\nconsole.log(total);', ['7'], ['const total = 0;', 'total += score;', 'console.log(total);'], 2, '2번 줄은 const로 선언한 total을 다시 대입합니다. 누적값을 바꿔야 하면 let total로 선언해야 합니다.'],
  '2-1': ['엄격한 동등 비교', '문자열 "3"과 숫자 3을 타입까지 구분해 비교하는 연산자는?', ['`==`', '`=`', '`===`'], 2, 'console.log("3" === 3);', ['false'], ['const role = "admin";', 'if (role = "member") {', '  showMember();', '}'], 2, '2번 줄의 =는 비교가 아니라 role 값을 바꾸는 대입입니다. ===로 비교해야 합니다.'],
  '2-2': ['논리 AND', '로그인과 약관 동의가 모두 필요할 때 사용할 논리 연산자는?', ['`||`', '`&&`', '`!`'], 1, 'const loggedIn = true;\nconst agreed = false;\nconsole.log(loggedIn && agreed);', ['false'], ['const loggedIn = false;', 'const agreed = true;', 'if (loggedIn || agreed) start();'], 3, '3번 줄의 ||는 둘 중 하나만 참이어도 시작합니다. 두 조건이 모두 필요하면 &&를 사용해야 합니다.'],
  '2-3': ['가드 조건', '제목이 비어 있으면 저장 전에 바로 끝내는 가장 읽기 쉬운 흐름은?', ['`if (!title) return;`', '`if (title) throw title;`', '`title = true;`'], 0, 'function canSave(title) {\n  if (!title) return false;\n  return true;\n}\nconsole.log(canSave(""));', ['false'], ['function saveTitle(title) {', '  if (!title) save(title);', '  write(title);', '}'], 2, '2번 줄은 비어 있는 제목을 막지 않고 save를 호출합니다. 가드 절은 if (!title) return;처럼 이후 작업을 건너뛰어야 합니다.'],
  '3-1': ['반복 범위', '세 항목의 인덱스를 0부터 2까지 읽으려면 종료 조건은?', ['`index < 3`', '`index <= 3`', '`index > 3`'], 0, 'const indexes = [];\nfor (let index = 0; index < 3; index += 1) indexes.push(index);\nconsole.log(indexes.join(","));', ['0,1,2'], ['const scores = [80, 90];', 'for (let index = 0; index <= scores.length; index += 1) {', '  console.log(scores[index]);', '}'], 2, '2번 줄은 index가 scores.length인 한 번을 더 실행해 범위를 벗어난 값을 읽습니다. < scores.length여야 합니다.'],
  '3-2': ['배열 값 순회', '점수 배열의 값 자체를 하나씩 읽을 때 알맞은 반복문은?', ['`for (const score of scores)`', '`for (const score in scores)`', '`for (const score of total)`'], 0, 'let total = 0;\nfor (const score of [2, 4]) total += score;\nconsole.log(total);', ['6'], ['const scores = [80, 90];', 'for (const score in scores) {', '  console.log(score + 1);', '}'], 2, '2번 줄의 for...in은 점수가 아니라 인덱스 문자열을 순회합니다. 값이 필요하면 for...of를 사용해야 합니다.'],
  '3-3': ['누적값 유지', '반복하면서 이전 합계에 현재 값을 더하는 초기값 선언은?', ['`let total = 0`', '`const total = []`', '`let total = undefined`'], 0, 'let total = 0;\nfor (const value of [1, 2, 3]) total += value;\nconsole.log(total);', ['6'], ['let total = 0;', 'for (const value of [1, 2, 3]) {', '  total = 0;', '  total += value;', '}'], 3, '3번 줄은 반복할 때마다 total을 0으로 되돌립니다. 초기화는 반복문 밖에서 한 번만 해야 합니다.'],
  '4-1': ['매개변수', '호출자가 준 이름을 함수 안에서 받기 위한 위치는?', ['함수 괄호 안의 매개변수', 'return 뒤', 'console.log 안'], 0, 'function greet(name) { return `안녕, ${name}`; }\nconsole.log(greet("민"));', ['안녕, 민'], ['function greet(name) {', '  return `안녕, ${user}`;', '}'], 2, '2번 줄의 user는 선언되지 않았습니다. 함수가 받은 매개변수 name을 사용해야 합니다.'],
  '4-2': ['반환값', 'double(4)의 계산 결과를 호출자에게 돌려주려면 필요한 문장은?', ['`return value * 2`', '`console.log(value * 2)`만 작성', '`value * 2;`만 작성'], 0, 'function double(value) { return value * 2; }\nconsole.log(double(4));', ['8'], ['function double(value) {', '  value * 2;', '}', 'const result = double(4);'], 2, '2번 줄은 계산 결과를 반환하지 않습니다. 호출자가 결과를 받으려면 return value * 2가 필요합니다.'],
  '4-3': ['기본 인자', '이름을 생략했을 때 기본 인사말을 제공하는 선언은?', ['`function greet(name = "학습자")`', '`function greet(name) { name = "학습자"; }`', '`function greet() { return name; }`'], 0, 'function greet(name = "학습자") { return `안녕, ${name}`; }\nconsole.log(greet());', ['안녕, 학습자'], ['function greet(name) {', '  name = "학습자";', '  return `안녕, ${name}`;', '}'], 2, '2번 줄은 전달된 이름도 항상 기본값으로 덮어씁니다. 기본값은 매개변수 선언에서 name = "학습자"처럼 지정해야 합니다.'],
  '5-1': ['배열 인덱스', '세 개 항목 배열의 마지막 유효 인덱스는?', ['`items.length - 1`', '`items.length`', '`items.length + 1`'], 0, 'const items = ["JS", "React", "Python"];\nconsole.log(items[2]);', ['Python'], ['const items = ["JS", "React"];', 'console.log(items[items.length]);'], 2, '2번 줄은 마지막 인덱스보다 하나 큰 위치를 읽어 undefined가 됩니다. 마지막 항목의 인덱스는 length - 1입니다.'],
  '5-2': ['배열에 항목 추가', '기존 목록을 보존하며 course를 새 배열 끝에 더하는 표현은?', ['`[...courses, course]`', '`courses.push(course)`', '`courses = course`'], 0, 'const courses = ["JS"];\nconst next = [...courses, "React"];\nconsole.log(next.length);', ['2'], ['const courses = ["JS"];', 'const next = courses.push("React");', 'console.log(next.length);'], 2, '2번 줄의 push 반환값은 배열이 아니라 새 길이입니다. 새 배열이 필요하면 전개 문법을 사용해야 합니다.'],
  '5-3': ['배열 필터링', '60점 이상 점수만 남기는 메서드는?', ['`scores.filter((score) => score >= 60)`', '`scores.map((score) => score >= 60)`', '`scores.find((score) => score >= 60)`'], 0, 'const passed = [55, 60, 90].filter((score) => score >= 60);\nconsole.log(passed.length);', ['2'], ['const scores = [55, 60, 90];', 'const passed = scores.map((score) => score >= 60);', 'console.log(passed);'], 2, '2번 줄의 map은 true/false 배열을 만듭니다. 통과 점수만 남기려면 filter를 사용해야 합니다.'],
  '6-1': ['객체 속성 읽기', 'profile 객체의 name 속성을 읽는 표현은?', ['`profile.name`', '`name.profile`', '`profile(name)`'], 0, 'const profile = { name: "민" };\nconsole.log(profile.name);', ['민'], ['const profile = { name: "민" };', 'console.log(profile.title.toUpperCase());'], 2, '2번 줄은 없는 title 속성의 값을 읽은 뒤 메서드를 호출해 오류가 납니다. 존재 여부를 먼저 확인해야 합니다.'],
  '6-2': ['선택적 속성', '선택적인 profile.bio가 없을 때 안전히 읽는 표현은?', ['`profile.bio?.trim()`', '`profile.bio.trim()`', '`profile.bio!`'], 0, 'const profile = {};\nconsole.log(profile.bio?.trim());', ['undefined'], ['const profile = {};', 'console.log(profile.bio.trim());'], 2, '2번 줄은 bio가 undefined일 때 trim을 호출합니다. 선택적 체이닝으로 없을 수 있는 값을 처리해야 합니다.'],
  '6-3': ['객체 펼치기', 'profile의 level만 바꾸며 다른 속성을 보존하는 표현은?', ['`{ ...profile, level: 2 }`', '`profile.level = 2`', '`{ level: 2 }`'], 0, 'const profile = { name: "민", level: 1 };\nconst next = { ...profile, level: 2 };\nconsole.log(next.name);', ['민'], ['const profile = { name: "민", level: 1 };', 'const next = { level: 2 };', 'console.log(next.name);'], 2, '2번 줄은 name을 복사하지 않아 다음 객체에서 잃습니다. 기존 속성을 보존하려면 ...profile을 포함해야 합니다.'],
  '7-1': ['블록 범위', 'if 블록 안에서 const로 선언한 이름을 읽을 수 있는 범위는?', ['같은 블록 안', '파일 전체', '다음 함수 호출'], 0, 'let label = "밖";\n{ const label = "안"; }\nconsole.log(label);', ['밖'], ['if (true) {', '  const bonus = 3;', '}', 'console.log(bonus);'], 4, '4번 줄은 블록 밖에서 bonus를 읽습니다. 블록 밖에서도 필요하면 바깥에서 선언해야 합니다.'],
  '7-2': ['함수 범위', '함수 안에서 선언한 total을 함수 밖에서 읽으려 하면?', ['참조 오류가 난다', '자동으로 전역이 된다', '0이 된다'], 0, 'function total() { const value = 3; return value; }\nconsole.log(total());', ['3'], ['function total() {', '  const value = 3;', '}', 'console.log(value);'], 4, '4번 줄은 함수 지역 변수 value를 함수 밖에서 읽습니다. 지역 변수는 함수 바깥에서 보이지 않습니다.'],
  '7-3': ['클로저 상태', 'makeCounter를 두 번 호출하면 count는 어떻게 되나요?', ['호출마다 별도 count를 가진다', '항상 하나만 공유한다', '반환 함수는 count를 잊는다'], 0, 'function makeCounter() { let count = 0; return () => ++count; }\nconst next = makeCounter();\nconsole.log(next());', ['1'], ['function makeCounter() {', '  let count = 0;', '  return () => count++;', '}', 'const next = makeCounter();', 'console.log(next(), next());'], 3, '3번 줄의 count++는 증가 전 값을 반환합니다. 호출 시 1부터 반환하려면 ++count를 사용해야 합니다.'],
  '8-1': ['모듈 내보내기', 'toTitle 함수를 다른 파일에 공개하는 선언은?', ['`export function toTitle(text) {}`', '`import function toTitle(text) {}`', '`public function toTitle(text) {}`'], 0, 'export function toTitle(text) { return text.toUpperCase(); }\nconsole.log(toTitle("js"));', ['JS'], ['function toTitle(text) { return text.toUpperCase(); }', 'export { formatTitle };'], 2, '2번 줄은 선언되지 않은 formatTitle을 내보냅니다. 실제 정의한 toTitle을 export해야 합니다.'],
  '8-2': ['named import', 'named export toTitle을 가져오는 올바른 문장은?', ['`import { toTitle } from "./format.js";`', '`import toTitle from "./format.js";`', '`import [toTitle] from "./format.js";`'], 0, 'const title = "js";\nconsole.log(title.toUpperCase());', ['JS'], ['import toTitle from "./format.js";', 'console.log(toTitle("js"));'], 1, '1번 줄은 default export가 없는 named export를 default import로 가져옵니다. 중괄호로 이름을 지정해야 합니다.'],
  '8-3': ['오류 만들기', '필수 title이 없을 때 호출자에게 실패를 알리는 방법은?', ['`throw new Error("title is required")`', '`return;`만 실행', '`catch {}`로 숨김'], 0, 'function requireTitle(title) { if (!title) throw new Error("required"); return title; }\ntry { requireTitle(""); } catch (error) { console.log(error.message); }', ['required'], ['function requireTitle(title) {', '  if (!title) return;', '  return title;', '}'], 2, '2번 줄은 필수 입력 누락을 성공처럼 undefined로 숨깁니다. 호출자가 처리할 수 있게 Error를 던져야 합니다.'],
  '9-1': ['폼 기본 동작', 'submit 처리기에서 브라우저의 페이지 이동을 막는 호출은?', ['event.preventDefault()', 'event.stopPropagation()', 'form.reset()'], 0, 'let saved = false;\nform.addEventListener("submit", (event) => { event.preventDefault(); saved = true; });\nconsole.log(saved);', ['true'], ['form.addEventListener("submit", (event) => {', '  event.preventDefault;', '  save(input.value);', '});'], 2, '2번 줄은 preventDefault를 호출하지 않습니다. 괄호를 붙여야 폼의 기본 제출 동작을 막습니다.'],
  '9-2': ['입력값 정리', '공백뿐인 제목을 거부하고 저장할 문자열은 정리하는 순서는?', ['trim한 값을 검사하고 저장', '원본을 저장한 뒤 trim', '문자열을 Boolean으로 바꾸기'], 0, 'const value = "  React  ".trim();\nconsole.log(value);', ['React'], ['const value = input.value;', 'if (!value.trim()) return;', 'save(value);'], 3, '3번 줄은 검사에 사용한 trim 결과를 버리고 원본을 저장합니다. 정리한 값을 별도 변수에 담아 검사와 저장에 함께 사용하세요.'],
  '9-3': ['텍스트 표시', '사용자가 입력한 제목을 HTML로 해석하지 않고 보여 주는 속성은?', ['textContent', 'innerHTML', 'outerHTML'], 0, 'const message = "<b>저장됨</b>";\npreview.textContent = message;\nconsole.log(preview.textContent);', ['<b>저장됨</b>'], ['function showMessage(element, message) {', '  element.innerHTML = message;', '}'], 2, '2번 줄은 입력 문자열을 HTML로 파싱합니다. 단순 문구는 textContent로 표시해 마크업으로 실행되지 않도록 하세요.'],
  '10-1': ['JSON 비동기 파싱', 'Response.json()의 결과를 바로 사용하려면 async 함수 안에서 필요한 것은?', ['await', 'JSON.stringify', 'Promise.resolve만'], 0, 'const response = { json: async () => ({ title: "React" }) };\nconsole.log(response.json() instanceof Promise);', ['true'], ['async function read(response) {', '  const data = response.json();', '  return data.name;', '}'], 2, '2번 줄은 Promise를 data에 저장합니다. await response.json()으로 파싱된 객체를 받아야 속성을 읽을 수 있습니다.'],
  '10-2': ['HTTP 오류 확인', 'fetch 응답을 업무 데이터로 처리하기 전에 확인할 속성은?', ['response.ok', 'response.url만', 'response.bodyUsed'], 0, 'const response = { ok: false, status: 404 };\nconsole.log(response.ok);', ['false'], ['async function load(response) {', '  const data = await response.json();', '  return data.name;', '}'], 2, '2번 줄은 HTTP 404 같은 오류 응답도 정상 결과처럼 파싱합니다. response.ok를 먼저 검사하고 실패를 별도 경로로 전달하세요.'],
  '10-3': ['네트워크 실패 처리', '요청 자체가 실패할 수 있는 fetch 호출을 호출자가 처리하게 하는 방법은?', ['예외를 상위로 전달하거나 오류 상태로 변환', '항상 빈 객체를 성공으로 반환', 'catch에서 아무 동작 없이 종료'], 0, 'async function load() {\n  try { return await fetch("/api"); }\n  catch (error) { throw error; }\n}', ['Promise를 거부'], ['async function load() {', '  try { return await fetch("/api"); }', '  catch (error) { return {}; }', '}'], 3, '3번 줄은 연결 실패와 정상적인 빈 결과를 같은 객체로 바꿔 원인을 숨깁니다. 실패를 명시적인 오류 상태나 예외로 유지하세요.'],
  '11-1': ['호출 스택', '동기 코드와 Promise 콜백의 출력 순서를 고르세요.', ['start, end, later', 'start, later, end', 'later, start, end'], 0, 'const order = ["start"];\nPromise.resolve().then(() => order.push("later"));\norder.push("end");\nsetTimeout(() => console.log(order.join(", ")), 0);', ['start, end, later'], ['const start = Date.now();', 'while (Date.now() - start < 5000) {}', 'console.log("완료");'], 2, '2번 줄의 긴 동기 반복은 메인 스레드를 점유합니다. 호출 스택이 끝나기 전에는 입력 처리와 렌더링이 진행되지 않습니다.'],
  '11-2': ['타이머 큐', '현재 동기 코드 뒤에 예약된 setTimeout 콜백의 실행 시점은?', ['현재 작업과 microtask 뒤', '현재 줄 직후 즉시', 'Promise 콜백보다 항상 먼저'], 0, 'setTimeout(() => console.log("timer"), 0);\nconsole.log("sync");', ['sync, timer'], ['function runTask() { console.log("task"); }', 'setTimeout(runTask(), 0);'], 2, '2번 줄은 runTask의 반환값을 타이머에 넘기기 전에 함수를 즉시 호출합니다. 함수 참조를 전달하려면 setTimeout(runTask, 0)을 사용하세요.'],
  '11-3': ['microtask 순서', '동기 코드와 Promise.then의 출력 순서는?', ['sync, microtask', 'microtask, sync', '순서가 정해지지 않음'], 0, 'console.log("sync");\nPromise.resolve().then(() => console.log("microtask"));', ['sync, microtask'], ['const log = (message) => console.log(message);', 'Promise.resolve().then(log("microtask"));', 'console.log("sync");'], 2, '2번 줄은 log를 즉시 호출해 `microtask`를 먼저 출력하고, 그 반환값인 undefined를 then에 전달합니다. 콜백을 예약하려면 `() => log("microtask")`처럼 함수를 전달해야 합니다.'],
};

const advancedDailyCaseSpecs = {
  13: [
    ['앞뒤 공백과 대소문자', '검색어 "  React  "와 "react"를 같은 값으로 비교하려면 어떤 정규화가 필요한가요?', 'trim 후 toLowerCase를 적용한다', '문자열 길이만 비교한다', '공백을 제거하지 않고 대문자로 바꾼다', 'const query = "  React  ";\nconsole.log(query.trim().toLowerCase());', 'react', 'function findCourse(query) {\n  return query.toLowerCase();\n}', 2, '2번 줄은 앞 공백을 남겨 "react"와 같은 키로 비교할 수 없습니다. trim 결과에 소문자 변환을 적용해야 합니다.'],
    ['연속 공백 접기', '입력 중 탭과 여러 공백을 각각 한 칸으로 바꾸는 정규식은?', 'replace(/\\s+/g, " ")', 'replace(" ", "")', 'split("")', 'const label = "JS   기초";\nconsole.log(label.replace(/\\s+/g, " "));', 'JS 기초', 'const label = "JS   기초";\nconsole.log(label.replace(" ", ""));', 2, '2번 줄은 첫 공백 하나만 빈 문자열로 바꾸므로 연속 공백과 나머지 공백이 남습니다. 공백 묶음을 전역으로 찾아 한 칸으로 바꾸세요.'],
    ['유니코드 정규형', '조합 방식이 다른 같은 악센트 문자열을 비교하기 전에 사용할 메서드는?', 'normalize("NFC")', 'toFixed(2)', 'toISOString()', 'const a = "\\u00e9";\nconst b = "e\\u0301";\nconsole.log(a.normalize("NFC") === b.normalize("NFC"));', 'true', 'const a = "\\u00e9";\nconst b = "e\\u0301";\nconsole.log(a === b);', 3, '3번 줄은 시각적으로 같은 글자의 코드 포인트 구성이 다른 경우를 그대로 비교합니다. 비교 전에 같은 유니코드 정규형으로 맞추세요.'],
    ['접두어 보존 검색', '검색어가 공백뿐이면 모든 코스를 보여 주지 않으려면?', '정규화 결과가 비었는지 먼저 확인한다', '빈 문자열로 includes를 호출한다', '원본 문자열을 숫자로 바꾼다', 'const query = "   ".trim().toLowerCase();\nconsole.log(query.length === 0);', 'true', 'function search(items, query) {\n  return items.filter((item) => item.includes(query));\n}', 2, '2번 줄은 빈 검색어도 허용합니다. 빈 문자열은 모든 문자열에서 찾아지므로 정규화 결과를 먼저 검사해야 합니다.'],
    ['정규화 함수 계약', '정규화 함수가 공백 입력을 받았을 때 안정적인 결과를 만들려면?', '문자열 여부와 빈 결과 정책을 먼저 정한다', '모든 입력에 trim을 바로 호출한다', '입력을 전역 변수에 저장한다', 'function normalizeQuery(value) {\n  if (typeof value !== "string") return "";\n  return value.trim().toLowerCase();\n}\nconsole.log(normalizeQuery("  "));', '""', 'function normalizeQuery(value) {\n  return value.trim().toLowerCase();\n}', 2, '2번 줄은 null 같은 비문자열 입력에서 예외가 발생합니다. 함수 계약에 입력 형식과 공백 결과 정책을 포함해야 합니다.'],
  ],
  14: [
    ['UTC ISO 파싱', '서버의 ISO 문자열을 시간 계산용 값으로 만들 때 알맞은 방법은?', '시간대가 표시된 ISO 문자열을 Date로 파싱한다', '현지 시각 문자열을 Z 없이 붙인다', '날짜 문자열을 사전순으로 뺀다', 'const due = new Date("2026-10-11T09:00:00Z");\nconsole.log(due.toISOString());', '2026-10-11T09:00:00.000Z', 'const due = new Date("2026-10-11 09:00");\nconsole.log(due.toISOString());', 1, '1번 줄은 시간대 정보가 없는 문자열이라 실행 환경의 현지 시간대로 해석될 수 있습니다. 서버 시각에는 UTC 오프셋을 명시하세요.'],
    ['밀리초 간격', '두 Date의 경과 밀리초를 계산하는 올바른 식은?', 'end.getTime() - start.getTime()', 'end.getUTCDate() - start.getUTCDate()', 'Date.now() - end.getTime()', 'const start = new Date("2026-10-11T09:00:00Z");\nconst end = new Date("2026-10-11T09:00:02Z");\nconsole.log(end.getTime() - start.getTime());', '2000', 'const start = new Date("2026-10-11T09:00:00Z");\nconst end = new Date("2026-10-11T09:00:02Z");\nconsole.log(end.getUTCDate() - start.getUTCDate());', 3, '3번 줄의 getUTCDate는 월의 날짜 부분만 반환합니다. 경과 시간을 계산하려면 전체 타임스탬프의 차이를 구해야 합니다.'],
    ['표시 시간대', '같은 순간을 사용자의 시간대로 읽기 좋게 보여 주려면?', 'Intl.DateTimeFormat에 표시할 timeZone을 지정한다', '계산용 타임스탬프를 직접 더한다', 'toString 결과를 저장 데이터로 쓴다', 'const date = new Date("2026-10-11T09:00:00Z");\nconsole.log(new Intl.DateTimeFormat("ko-KR", { timeZone: "UTC", hour: "2-digit", hourCycle: "h23" }).format(date));', '09시', 'const date = new Date("2026-10-11T09:00:00Z");\nconsole.log(date.getHours());', 2, '2번 줄은 실행 환경의 현지 시간대에 따라 값이 달라집니다. 표시 정책을 고정하려면 Intl.DateTimeFormat의 timeZone을 지정하세요.'],
    ['잘못된 날짜 검증', '파싱 실패한 Date를 확인하는 조건은?', 'Number.isNaN(date.getTime())', 'date === NaN', 'date.getTime() === NaN', 'const date = new Date("not-a-date");\nconsole.log(Number.isNaN(date.getTime()));', 'true', 'const date = new Date("not-a-date");\nconsole.log(date.getTime() === NaN);', 2, '2번 줄은 NaN이 자기 자신과 같지 않아 실패를 감지하지 못합니다. Number.isNaN으로 타임스탬프를 검사하세요.'],
    ['시간 간격 경계', '시작보다 이른 종료 시각의 간격을 음수로 숨기지 않으려면?', '입력 순서를 검사하고 음수 정책을 명시한다', '절댓값으로 바꾸어 원인을 숨긴다', '날짜의 일(day) 부분만 비교한다', 'function hoursBetween(start, end) {\n  return (end.getTime() - start.getTime()) / 3600000;\n}\nconsole.log(hoursBetween(new Date(0), new Date(7200000)));', '2', 'function hoursBetween(start, end) {\n  return (end.getUTCDate() - start.getUTCDate()) / 3600000;\n}', 2, '2번 줄은 일자만 빼서 서로 다른 시각의 실제 경과를 계산하지 못합니다. 타임스탬프 전체 차이를 사용하고 역순 입력 정책도 정하세요.'],
  ],
  15: [
    ['Set 중복 제거', '코스 id의 중복을 제거하고 고유 개수를 구하는 조합은?', 'new Set(ids).size', 'ids.map().length', 'new Map(ids).length', 'const ids = ["js", "js", "py"];\nconsole.log(new Set(ids).size);', '2', 'const ids = ["js", "js", "py"];\nconsole.log(ids.length);', 2, '2번 줄은 원래 배열 항목 수인 3을 반환해 중복을 제거하지 않습니다. Set의 size를 확인하세요.'],
    ['Map 집계', '각 과목의 풀이 횟수를 세려면 어떤 컬렉션이 알맞나요?', '과목명을 키로 두는 Map', '중복 키를 허용하지 않는 Set', '항목 순서만 가진 문자열', 'const counts = new Map();\ncounts.set("js", (counts.get("js") ?? 0) + 1);\nconsole.log(counts.get("js"));', '1', 'const counts = new Map();\ncounts.set("js", 1);\ncounts.set("js", 1);\nconsole.log(counts.get("js"));', 3, '3번 줄은 같은 키의 값을 다시 1로 설정해 누적하지 않습니다. 기존 값을 읽어 1을 더하세요.'],
    ['객체 키 동일성', '서로 다른 두 객체를 Map 키로 넣었을 때 기본 동작은?', '객체 참조가 다르면 서로 다른 키다', '내용이 같으면 자동으로 같은 키다', '객체는 Map 키로 쓸 수 없다', 'const first = { id: 1 };\nconst second = { id: 1 };\nconst map = new Map([[first, "A"]]);\nconsole.log(map.has(second));', 'false', 'const first = { id: 1 };\nconst second = { id: 1 };\nconst map = new Map([[first, "A"]]);\nconsole.log(map.get(second));', 4, '4번 줄은 구조가 같은 별도 객체를 같은 키라고 가정합니다. 객체 키는 내용이 아니라 참조 동일성으로 비교됩니다.'],
    ['삽입 순서 순회', 'Map의 항목을 저장한 순서대로 읽는 방법은?', 'for...of로 entries를 순회한다', 'Object.keys(map)을 호출한다', 'map.sort()를 호출한다', 'const map = new Map([["b", 2], ["a", 1]]);\nconsole.log([...map.keys()].join(","));', 'b,a', 'const map = new Map([["b", 2], ["a", 1]]);\nconsole.log(Object.keys(map).join(","));', 2, '2번 줄은 Map의 항목을 일반 객체의 열거 키로 읽지 못합니다. Map 자체를 순회하거나 keys()를 사용하세요.'],
    ['존재 여부 확인', 'Map에서 값이 0이어도 키 존재를 구분하는 메서드는?', 'map.has(key)', 'Boolean(map.get(key))', 'map.size(key)', 'const map = new Map([["done", 0]]);\nconsole.log(map.has("done"));', 'true', 'const map = new Map([["done", 0]]);\nconsole.log(Boolean(map.get("done")));', 2, '2번 줄은 저장된 0을 없는 값처럼 취급합니다. 값의 truthiness와 키 존재 여부를 분리해 has를 쓰세요.'],
  ],
  16: [
    ['yield 순서', 'generator가 yield한 값을 한 번씩 꺼내는 메서드는?', 'next()', 'resume()', 'iterate()', 'function* pages() { yield "A"; yield "B"; }\nconst iterator = pages();\nconsole.log(iterator.next().value);', 'A', 'function* pages() { yield "A"; yield "B"; }\nconst iterator = pages();\nconsole.log(iterator.value);', 3, '3번 줄에서 pages()는 iterator를 돌려주며 value를 직접 갖지 않습니다. next() 결과의 value를 읽으세요.'],
    ['next 완료 상태', '두 값을 yield한 generator에서 세 번째 next()의 done 값은?', 'true', 'false', 'undefined', 'function* ids() { yield 1; yield 2; }\nconst iterator = ids();\niterator.next(); iterator.next();\nconsole.log(iterator.next().done);', 'true', 'function* ids() { yield 1; yield 2; }\nconst iterator = ids();\nconsole.log(iterator.next().done);', 2, '2번 줄은 첫 yield 전의 상태라 아직 완료되지 않았습니다. 두 값을 소비한 뒤 다음 호출에서 done이 true가 됩니다.'],
    ['return 값과 yield 구분', 'generator의 return 값은 기본 반복에서 어떻게 처리되나요?', 'done이 true인 마지막 결과에만 포함된다', '모든 for...of 반복에 포함된다', '첫 next()의 value가 된다', 'function* values() { yield "화면"; return "끝"; }\nconsole.log([...values()].join(","));', '화면', 'function* values() { yield "화면"; return "끝"; }\nconsole.log([...values()].join(","));', 2, '2번 줄은 return 값까지 반복에 들어간다고 가정합니다. for...of는 done이 false인 yield 값만 모읍니다.'],
    ['지연 페이지 생성', '페이지 목록을 한 번에 복사하지 않고 요청할 때 하나씩 내보내려면?', 'generator에서 각 페이지를 yield한다', '모든 페이지를 먼저 concat한다', '배열 길이를 반환한다', 'function* cursor(pages) {\n  for (const page of pages) yield page;\n}\nconsole.log([...cursor([1, 2])].join(","));', '1,2', 'function* cursor(pages) {\n  return pages;\n}\nconsole.log([...cursor([1, 2])].join(","));', 2, '2번 줄은 배열을 return 값으로 끝내므로 반복 항목을 내보내지 않습니다. 지연 순회에는 각 항목을 yield하세요.'],
    ['순회 조기 종료', 'for...of를 break했을 때 generator의 자원 정리 코드는 어디에 둘까요?', 'try/finally의 finally', 'generator 다음의 console.log', 'yield 뒤의 주석', 'function* stream() {\n  try { yield "chunk"; }\n  finally { console.log("closed"); }\n}\nfor (const chunk of stream()) break;', 'closed', 'function* stream() {\n  try { yield "chunk"; }\n  finally { console.log("closed"); }\n}\nfor (const chunk of stream()) break;', 2, '반복을 조기 종료하면 generator의 finally가 실행됩니다. 정리 동작은 이 경계 안에 두어야 합니다.'],
  ],
  17: [
    ['캡슐화된 필드', '클래스 내부에서만 접근하게 만드는 private 필드 표기는?', '#value', '_value', 'private value', 'class Counter {\n  #value = 0;\n  read() { return this.#value; }\n}\nconsole.log(new Counter().read());', '0', 'class Counter {\n  #value = 0;\n  read() { return this.value; }\n}', 3, '3번 줄은 private 필드 #value가 아니라 없는 공개 속성 value를 읽습니다. 선언한 private 이름을 그대로 사용하세요.'],
    ['메서드 this', '객체에서 떼어 낸 인스턴스 메서드가 this를 잃지 않게 하려면?', '호출 경계를 유지하거나 명시적으로 bind한다', '메서드 이름을 문자열로 바꾼다', '인스턴스를 JSON으로 변환한다', 'class Course {\n  constructor(title) { this.title = title; }\n  label() { return this.title; }\n}\nconst course = new Course("JS");\nconsole.log(course.label());', 'JS', 'class Course {\n  constructor(title) { this.title = title; }\n  label() { return this.title; }\n}\nconst label = new Course("JS").label;\nconsole.log(label());', 4, '분리된 label() 호출에는 원래 인스턴스의 this가 연결되지 않습니다. 호출부에서 객체와 함께 호출하거나 bind를 사용하세요.'],
    ['동작 조합', '검증기와 저장기를 선택적으로 조합하는 설계가 유리한 상황은?', '기능을 교체·시험하기 쉽게 만들 때', '모든 동작이 고정되어 상속이 필수일 때', '함수 호출을 모두 전역 변수로 숨길 때', 'function makeService(validate, save) {\n  return { validate, save };\n}\nconsole.log(typeof makeService);', 'function', 'function makeService(validate, save) {\n  return save(validate);\n}', 2, '2번 줄은 생성 시 두 동작을 즉시 실행해 독립 교체와 테스트를 어렵게 합니다. 필요한 기능을 객체로 조합해 반환하세요.'],
    ['오버라이드 호출', '하위 클래스가 부모의 label 동작을 확장하려면?', 'super.label() 결과를 조합한다', '부모 prototype을 직접 수정한다', '인스턴스의 constructor를 문자열로 바꾼다', 'class Base {\n  label() { return "기초"; }\n}\nclass Pro extends Base {\n  label() { return super.label() + " 심화"; }\n}\nconsole.log(new Pro().label());', '기초 심화', 'class Base { label() { return "기초"; } }\nclass Pro extends Base { label() { return super.label + " 심화"; } }\nconsole.log(new Pro().label());', 2, '2번 줄은 부모 메서드를 호출하지 않고 함수 객체를 문자열 연결에 사용합니다. super.label()로 결과를 얻으세요.'],
    ['대체 가능성 점검', '부모 계약을 따르는 하위 타입을 검토할 때 확인할 것은?', '호출자가 기대하는 입력·출력 계약을 유지한다', '부모 메서드의 반환 타입을 임의로 바꾼다', '부모 생성자를 생략하고 상태를 가정한다', 'class Store {\n  save(value) { return Boolean(value); }\n}\nclass MemoryStore extends Store {}\nconsole.log(new MemoryStore().save("ok"));', 'true', 'class Store { save(value) { return Boolean(value); } }\nclass MemoryStore extends Store { save(value) { return undefined; } }', 2, '하위 클래스가 같은 메서드 이름만 유지하고 반환 계약을 없애면 호출자의 기대를 깨뜨립니다. 대체 가능성은 동작 계약까지 확인해야 합니다.'],
  ],
  18: [
    ['자체 속성 검사', 'prototype에서 상속한 id와 객체 자신의 id를 구분하는 메서드는?', 'Object.hasOwn(course, "id")', '"id" in course만', 'course.id !== undefined만', 'const proto = { id: "base" };\nconst course = Object.create(proto);\nconsole.log(Object.hasOwn(course, "id"));', 'false', 'const proto = { id: "base" };\nconst course = Object.create(proto);\nconsole.log("id" in course);', 3, '3번 줄의 in 연산자는 prototype에 있는 속성도 true로 확인합니다. 자체 속성만 필요하면 Object.hasOwn을 사용하세요.'],
    ['프로토타입 조회', '상속 연결을 확인하는 표준 호출은?', 'Object.getPrototypeOf(value)', 'value.prototype()', 'Object.parentOf(value)', 'const base = { active: true };\nconst item = Object.create(base);\nconsole.log(Object.getPrototypeOf(item) === base);', 'true', 'const base = { active: true };\nconst item = Object.create(base);\nconsole.log(item.prototype === base);', 3, '3번 줄은 인스턴스의 prototype 속성을 읽지만 연결은 내부 프로토타입 슬롯에 있습니다. Object.getPrototypeOf를 사용하세요.'],
    ['자체 값 우선순위', '객체와 prototype에 같은 이름 속성이 있을 때 일반 조회 결과는?', '객체 자신의 속성 값', 'prototype 값만', '항상 undefined', 'const base = { level: 1 };\nconst item = Object.create(base);\nitem.level = 2;\nconsole.log(item.level);', '2', 'const base = { level: 1 };\nconst item = Object.create(base);\nitem.level = 2;\nconsole.log(Object.getPrototypeOf(item).level);', 4, '4번 줄은 item에서 해석된 값을 읽지 않고 prototype 객체의 값을 직접 읽습니다. 속성 조회 결과와 상속 원본을 구분하세요.'],
    ['열거와 상속', 'for...in 결과에서 상속된 enumerable 속성을 빼려면?', 'Object.hasOwn으로 각 키를 거른다', '키를 대문자로 바꾼다', 'Object.keys 결과를 문자열화한다', 'const base = { inherited: 1 };\nconst item = Object.assign(Object.create(base), { own: 2 });\nconst keys = [];\nfor (const key in item) if (Object.hasOwn(item, key)) keys.push(key);\nconsole.log(keys.join(","));', 'own', 'const base = { inherited: 1 };\nconst item = Object.assign(Object.create(base), { own: 2 });\nconst keys = [];\nfor (const key in item) keys.push(key);\nconsole.log(keys.join(","));', 4, '4번 줄은 prototype에서 물려받은 enumerable 키도 포함합니다. 자체 키만 필요한 경우 hasOwn으로 거르세요.'],
    ['허용 필드 경계', '외부 키를 객체 속성으로 기록할 때 우선 적용할 검증은?', '허용 필드 목록으로 키를 제한한다', '입력 키를 곧바로 prototype에 할당한다', '모든 값을 함수로 실행한다', 'function setField(target, key, value) {\n  if (!["title", "done"].includes(key)) return false;\n  target[key] = value;\n  return true;\n}\nconsole.log(setField({}, "done", true));', 'true', 'function setField(target, key, value) {\n  target[key] = value;\n  return true;\n}', 2, '외부 키를 무검증으로 객체 경로에 기록하면 의도하지 않은 속성 변경으로 이어질 수 있습니다. 허용된 필드 목록을 먼저 확인하세요.'],
  ],
  19: [
    ['Arrange Act Assert', '테스트의 Arrange-Act-Assert에서 Act가 뜻하는 것은?', '검증할 동작을 한 번 실행한다', '기대 결과만 적는다', '테스트 환경을 무작위로 바꾼다', 'const scores = [2, 4];\nconst average = scores.reduce((sum, value) => sum + value, 0) / scores.length;\nconsole.log(average);', '3', 'const scores = [2, 4];\nconst average = scores.reduce((sum, value) => sum + value, 0) / scores.length;\nconsole.log(average === 4);', 3, '3번 줄은 실제 계산 결과 3 대신 잘못된 기대값 4를 확인합니다. 테스트의 Act 결과를 계산해 맞는 기대를 세우세요.'],
    ['경계 사례 선택', '빈 배열 평균의 정책이 0이라면 꼭 추가할 경계 테스트는?', 'average([])가 0인지 확인한다', '평균이 정수인 목록만 두 번 검사한다', '배열 변수 이름만 확인한다', 'function average(values) {\n  if (values.length === 0) return 0;\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconsole.log(average([]));', '0', 'function average(values) {\n  return values.reduce((sum, value) => sum + value) / values.length;\n}\nconsole.log(average([]));', 2, '2번 줄은 초기값 없는 reduce를 빈 배열에서 호출해 예외가 납니다. 빈 경계 입력을 별도로 검사해야 합니다.'],
    ['테스트 독립성', '각 테스트가 실행 순서와 무관하게 반복 가능하려면?', '테스트별 상태를 초기화하고 공유 변경을 피한다', '앞선 테스트가 만든 전역 상태를 기대한다', '실패 테스트를 무조건 건너뛴다', 'function makeProgress() { return { done: [] }; }\nconst first = makeProgress();\nconst second = makeProgress();\nconsole.log(first.done === second.done);', 'false', 'const shared = { done: [] };\nfunction makeProgress() { return shared; }\nconsole.log(makeProgress() === makeProgress());', 3, '3번 줄은 모든 호출이 같은 전역 객체를 공유하게 합니다. 테스트 간 누수와 실행 순서 의존성을 막으려면 상태를 각각 만드세요.'],
    ['비동기 대기', 'Promise를 반환하는 동작의 완료를 검증하는 테스트에서 필요한 것은?', '테스트가 Promise를 기다리도록 await하거나 반환한다', 'assert를 setTimeout 안에 숨긴다', 'Promise를 문자열로 변환한다', 'async function load() { return "완료"; }\nconst result = await load();\nconsole.log(result);', '완료', 'test("로드", () => {\n  load().then((result) => expect(result).toBe("완료"));\n});', 2, '2번 줄은 테스트가 Promise를 기다리지 않고 끝날 수 있습니다. Promise를 반환하거나 async 테스트에서 await하세요.'],
    ['회귀 입력 고정', '수정한 함수의 버그가 다시 생기지 않게 하는 가장 직접적인 검사는?', '실패를 만들었던 입력과 기대 출력을 고정한다', '함수 이름만 포함하는 문자열을 검사한다', '주석의 설명만 비교한다', 'function normalize(value) { return value.trim().toLowerCase(); }\nconsole.log(normalize("  JS ") === "js");', 'true', 'function normalize(value) { return value.trim().toLowerCase(); }\nconsole.log(normalize("  JS ") === "JS");', 2, '2번 줄의 기대값은 함수의 소문자 정규화 계약과 다릅니다. 원래 실패 입력에 대한 올바른 결과를 회귀 테스트로 고정하세요.'],
  ],
};

Object.assign(advancedDailyCaseSpecs, {
  20: [
    ['최소 재현 입력', '오류를 반복해서 관찰하기 위한 첫 단계는?', '문제가 다시 나는 최소 입력과 순서를 고정한다', '여러 코드를 한꺼번에 바꾼다', '재현 전에 캐시를 모두 지운다', 'function firstCourse(courses) {\n  return courses[0]?.title ?? "없음";\n}\nconsole.log(firstCourse([]));', '없음', 'function firstCourse(courses) {\n  return courses[0].title;\n}\nconsole.log(firstCourse([]));', 2, '2번 줄은 빈 목록에서 undefined.title을 읽어 예외를 냅니다. 빈 입력을 포함하는 작은 사례부터 고정하세요.'],
    ['관찰 값과 가설', '간헐적인 검색 결과 문제를 좁히는 데 가장 유용한 로그는?', '요청 id·검색어·응답 도착 순서를 함께 남긴다', '매 렌더마다 전체 객체를 무제한 출력한다', '오류를 잡아 아무 기록도 남기지 않는다', 'const events = ["r1 시작", "r2 시작", "r2 완료", "r1 완료"];\nconsole.log(events.join(" -> "));', 'r1 시작 -> r2 시작 -> r2 완료 -> r1 완료', 'async function load(query) {\n  try { return await request(query); }\n  catch { return []; }\n}', 3, '3번 줄은 실패 원인을 빈 결과로 바꿔 관찰할 단서를 없앱니다. 오류 유형과 요청 맥락을 제한된 로그나 명시적 상태로 남기세요.'],
    ['가설 검증 순서', '오류 원인을 찾을 때 한 번에 하나의 조건만 바꾸는 이유는?', '어떤 변경이 결과에 영향을 줬는지 분리한다', '실행 시간을 일부러 늘린다', '테스트 데이터를 계속 바꾼다', 'const before = 2;\nconst after = before + 1;\nconsole.log(after);', '3', 'const before = 2;\nconst after = before + 1 + Math.random();\nconsole.log(after);', 2, '2번 줄은 무작위 입력을 추가해 결과를 고정하지 못합니다. 한 번에 하나의 가설을 확인하세요.'],
    ['예외 경계 보존', '예외를 발견한 뒤 호출자가 실패 원인을 알 수 있게 하는 방법은?', '오류를 기록하거나 의미 있는 오류 상태로 전달한다', '항상 빈 배열을 반환한다', 'catch 블록에서 아무 일도 하지 않는다', 'function parseCount(value) {\n  const count = Number(value);\n  if (!Number.isFinite(count)) throw new TypeError("숫자가 아닙니다");\n  return count;\n}\nconsole.log(parseCount("3"));', '3', 'function parseCount(value) {\n  try { return Number(value); }\n  catch { return 0; }\n}', 2, 'Number 변환 실패와 유효한 0을 같은 결과로 숨깁니다. 입력 검증 후 호출자가 구분할 수 있도록 오류를 전달하세요.'],
    ['재현 후 회귀 방지', '원인을 수정한 다음 추가할 회귀 검사는?', '원래 실패 입력과 정상 경계 입력을 함께 확인한다', '수정한 줄의 글자 수만 비교한다', '테스트를 제거해 실행 시간을 줄인다', 'function findTitle(items, id) {\n  return items.find((item) => item.id === id)?.title ?? null;\n}\nconsole.log(findTitle([], "missing"));', 'null', 'function findTitle(items, id) {\n  return items.find((item) => item.id === id).title;\n}', 2, '2번 줄은 일치 항목이 없을 때 예외를 냅니다. 빈 결과와 정상 항목을 모두 고정해 회귀를 막으세요.'],
  ],
  21: [
    ['측정 구간', '화면 지연의 원인을 파악하는 첫 성능 측정은?', '사용자가 기다리는 실제 작업 구간을 반복 측정한다', '코드 줄 수로 속도를 추정한다', '기억에 의존해 가장 긴 함수를 고른다', 'const start = performance.now();\nconst result = [1, 2, 3].filter((value) => value > 1);\nconst elapsed = performance.now() - start;\nconsole.log(result.join(","), elapsed >= 0);', '2,3 true', 'const elapsed = Date.now() - performance.now();\nconsole.log(elapsed);', 1, '1번 줄은 서로 다른 시계 기준을 빼 결과가 의미 없는 간격이 됩니다. performance.now()로 시작과 끝을 재세요.'],
    ['선형 순회', '길이 n인 배열을 한 번 filter하는 시간 증가를 표현하면?', 'O(n)', 'O(1)', '항상 O(n²)', 'const values = [1, 2, 3];\nconst doubled = values.map((value) => value * 2);\nconsole.log(doubled.length);', '3', 'const values = [1, 2, 3];\nfor (const left of values) for (const right of values) console.log(left, right);', 2, '중첩 순회는 각 값마다 전체 배열을 다시 방문해 비교 횟수가 대략 n²로 증가합니다. 단일 filter와 비용을 구분하세요.'],
    ['중복 계산 제거', '같은 입력으로 만든 비싼 결과를 반복 사용하려면 먼저 확인할 점은?', '프로파일에서 반복 계산이 실제 병목인지 확인한다', '모든 함수에 무조건 캐시를 넣는다', '결과를 전역 변수에 영구 보관한다', 'function visible(items, query) {\n  return items.filter((item) => item.title.includes(query));\n}\nconsole.log(visible([{ title: "JS" }], "J").length);', '1', 'function visible(items, query) {\n  const result = items.filter((item) => item.title.includes(query));\n  return items.filter((item) => item.title.includes(query));\n}', 3, '3번 줄은 같은 필터를 다시 실행해 앞에서 만든 result도 버립니다. 실제 병목을 측정하고 중복 작업을 제거하세요.'],
    ['캐시 키 구성', '검색 결과를 캐시할 때 키에서 빠뜨리면 안 되는 값은?', '결과를 바꾸는 모든 입력과 데이터 버전', '현재 화면의 글꼴 이름', '함수 주석의 문장 수', 'function cacheKey(query, category) {\n  return query.trim().toLowerCase() + "|" + category;\n}\nconsole.log(cacheKey(" JS ", "all"));', 'js|all', 'function cacheKey(query, category) {\n  return query.trim().toLowerCase();\n}', 2, '2번 줄은 category를 키에서 빼 서로 다른 필터 결과를 같은 캐시에 저장할 수 있습니다. 결과에 영향을 주는 입력을 모두 포함하세요.'],
    ['목록 렌더 범위', '목록이 매우 커서 한 화면에 필요한 항목만 그릴 때 검토할 방법은?', '측정 후 페이지네이션이나 가상화를 적용한다', '모든 항목을 DOM에 숨겨 둔다', '배열을 매 렌더마다 두 번 복사한다', 'const visible = items.slice(start, start + pageSize);\nconsole.log(visible.length);', '화면에 필요한 항목 수', 'const visible = items.slice(0, items.length);\nconsole.log(visible.length);', 1, '1번 줄은 목록 전체를 복사해 화면에 필요한 범위 제한을 하지 않습니다. 측정값을 바탕으로 범위를 줄이세요.'],
  ],
  22: [
    ['문자열 저장 경계', 'localStorage에 객체를 저장하기 전에 필요한 변환은?', 'JSON.stringify로 문자열화한다', 'JSON.parse로 객체를 다시 읽는다', '객체를 그대로 setItem에 전달한다', 'const progress = { done: 2 };\nconst raw = JSON.stringify(progress);\nconsole.log(typeof raw);', 'string', 'const progress = { done: 2 };\nlocalStorage.setItem("progress", progress);', 2, '2번 줄은 객체를 문자열로 직렬화하지 않아 정보가 손실됩니다. 저장 전에 JSON.stringify를 사용하세요.'],
    ['파싱 실패 복구', '저장 문자열이 손상됐을 때 화면이 멈추지 않게 하는 경계는?', 'JSON.parse를 try/catch하고 안전한 기본값을 반환한다', '파싱을 계속 반복한다', '손상 데이터도 객체라고 단정한다', 'function readProgress(raw) {\n  try { return JSON.parse(raw); }\n  catch { return { done: 0 }; }\n}\nconsole.log(readProgress("{").done);', '0', 'function readProgress(raw) {\n  return JSON.parse(raw);\n}', 2, '2번 줄은 잘못된 JSON에서 SyntaxError를 내어 화면 로드를 중단시킬 수 있습니다. 안전한 복구값을 정의하세요.'],
    ['저장 데이터 버전', '저장 형식이 바뀔 때 기존 기록을 안전하게 읽으려면?', '버전 필드를 확인하고 마이그레이션 또는 기본 경로를 둔다', '기존 기록을 무조건 새 모양으로 단정한다', '모든 필드를 문자열로 합친다', 'const saved = { version: 1, done: ["js"] };\nconsole.log(saved.version);', '1', 'function loadSaved(saved) {\n  return saved.lessons.map((item) => item.id);\n}', 2, '2번 줄은 버전 1 데이터에 없는 lessons 필드를 곧바로 읽습니다. 버전을 확인해 변환하거나 기본값을 제공하세요.'],
    ['저장 용량 오류', '브라우저 저장이 실패할 수 있을 때 필요한 대응은?', '용량·권한 실패를 잡아 사용자에게 저장 실패를 알린다', '브라우저가 무제한 저장을 보장한다고 가정한다', '실패하면 데이터를 조용히 지운다', 'function save(storage, key, value) {\n  try { storage.setItem(key, JSON.stringify(value)); return true; }\n  catch { return false; }\n}\nconsole.log(typeof save);', 'function', 'function save(storage, key, value) {\n  storage.setItem(key, JSON.stringify(value));\n  return true;\n}', 2, '저장소 할당량이나 권한 때문에 setItem이 예외를 낼 수 있습니다. 성공 여부를 확인해 사용자에게 상태를 알려야 합니다.'],
    ['다른 탭 갱신', '같은 사이트의 다른 탭에서 바뀐 localStorage를 알리는 이벤트는?', 'storage 이벤트', 'DOMContentLoaded 이벤트', 'submit 이벤트', 'const eventName = "storage";\nconsole.log(eventName);', 'storage', 'window.addEventListener("submit", onStorageChange);', 1, '1번 줄은 폼 제출 이벤트를 구독하므로 다른 탭의 저장 변경을 받지 못합니다. storage 이벤트를 사용하세요.'],
  ],
  23: [
    ['HTTP 실패 검사', 'fetch가 응답을 받았지만 404일 때 먼저 검사할 값은?', 'response.ok', 'response.json 함수의 존재만', 'response.url 길이', 'const response = { ok: false, status: 404 };\nconsole.log(response.ok);', 'false', 'async function load(response) {\n  return await response.json();\n}', 2, '2번 줄은 HTTP 상태가 실패여도 본문을 정상 데이터처럼 처리합니다. response.ok를 검사해 실패 상태를 분리하세요.'],
    ['성공한 빈 결과', '요청 성공 후 항목이 0개인 화면은 어떤 상태로 다뤄야 하나요?', '성공한 빈 결과 안내', '네트워크 오류', '무한 로딩', 'const status = "success";\nconst items = [];\nconsole.log(status === "success" && items.length === 0);', 'true', 'const status = "loading";\nconst items = [];\nconsole.log(status === "success" && items.length === 0);', 1, '1번 줄은 요청 완료 뒤에도 loading에 남습니다. 성공한 빈 결과와 진행 중 상태를 따로 표현하세요.'],
    ['네트워크 예외 처리', '연결 실패로 fetch가 reject될 때 사용자 화면에 필요한 것은?', '오류 상태와 재시도 방법', '빈 결과를 성공처럼 표시', '요청을 무한히 반복', 'function message(status) {\n  return status === "error" ? "다시 시도해 주세요" : "불러왔어요";\n}\nconsole.log(message("error"));', '다시 시도해 주세요', 'async function load() {\n  try { return await fetch("/courses"); }\n  catch { return []; }\n}', 3, '3번 줄은 네트워크 실패를 성공한 빈 목록과 구별하지 못하게 합니다. 오류 상태를 유지하고 재시도 경로를 제공하세요.'],
    ['로딩 종료', '요청 성공과 실패 어느 쪽에서도 로딩 표시를 닫으려면?', 'finally에서 진행 상태를 정리한다', '성공 경로에만 상태를 바꾼다', '응답 본문에서만 상태를 바꾼다', 'async function load() {\n  try { return await fetch("/courses"); }\n  finally { console.log("요청 종료"); }\n}\nconsole.log(typeof load);', 'function', 'async function load() {\n  try { return await fetch("/courses"); }\n  catch { setLoading(false); }\n}', 3, '3번 줄은 성공 경로에서 로딩을 끄지 않습니다. 성공·실패 공통 정리는 finally에 두세요.'],
    ['JSON 응답 파싱', 'Response에서 JSON 데이터를 얻기 위한 올바른 호출은?', 'await response.json()', 'response.json 프로퍼티만 반환', 'JSON.stringify(response)', 'async function read(response) {\n  return await response.json();\n}\nconsole.log(typeof read);', 'function', 'async function read(response) {\n  return response.json;\n}', 2, '2번 줄은 메서드 자체를 반환해 파싱을 시작하지 않습니다. json()을 호출하고 비동기 결과를 기다리세요.'],
  ],
  24: [
    ['최신 요청 식별', '검색어를 바꾼 뒤 오래된 응답을 무시하는 조건은?', '응답 id가 최신 요청 id와 같은지 확인한다', '응답이 먼저 시작했는지 확인한다', '배열 길이가 같은지 확인한다', 'function isLatest(id, latestId) {\n  return id === latestId;\n}\nconsole.log(isLatest("r2", "r2"));', 'true', 'function shouldApply(id, latestId) {\n  return id <= latestId;\n}', 2, '2번 줄은 이전 id도 최신 id보다 작다는 이유로 허용합니다. 최신 id와 정확히 같은 응답만 적용하세요.'],
    ['AbortController 연결', '요청 취소를 fetch에 전달하는 옵션은?', 'signal: controller.signal', 'controller: true', 'abort: controller.abort()', 'const controller = new AbortController();\nconst options = { signal: controller.signal };\nconsole.log(options.signal === controller.signal);', 'true', 'const controller = new AbortController();\nfetch("/search", { controller });', 2, '2번 줄은 fetch가 인식하지 않는 controller 옵션을 전달합니다. AbortController의 signal을 요청 옵션에 넣으세요.'],
    ['Effect 정리', '새 검색어로 이전 요청을 취소하는 시점은?', 'Effect 정리 함수에서 controller.abort()를 호출한다', '응답 본문을 모두 읽은 뒤에만 취소한다', '다시 렌더링될 때 이전 컨트롤러를 잊는다', 'function cancel(controller) {\n  controller.abort();\n  return controller.signal.aborted;\n}\nconsole.log(typeof cancel);', 'function', 'useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n}, [url]);', 4, 'Effect가 다시 실행되거나 사라져도 이전 요청은 정리되지 않습니다. cleanup에서 abort를 호출하세요.'],
    ['디바운스 경계', '짧은 시간 입력이 계속될 때 요청 수를 줄이는 기법은?', '마지막 입력 뒤 일정 시간이 지나면 요청한다', '입력할 때마다 즉시 요청한다', '응답을 무조건 오래 캐시한다', 'let timer;\nfunction schedule(run) {\n  clearTimeout(timer);\n  timer = setTimeout(run, 250);\n}\nconsole.log(typeof schedule);', 'function', 'function schedule(run) {\n  setTimeout(run, 250);\n  clearTimeout(timer);\n}', 2, '2번 줄은 기존 타이머를 취소하기 전에 새 타이머를 만들어 요청이 여러 번 실행될 수 있습니다. 먼저 기존 타이머를 정리하세요.'],
    ['중복 저장 방지', '사용자가 같은 저장 요청을 두 번 보내지 않도록 할 UI 상태는?', '요청 중 제출을 잠그고 결과 뒤 다시 연다', '요청을 무한 재전송한다', '완료 상태를 요청 전에 확정한다', 'function canSubmit(status) {\n  return status !== "saving";\n}\nconsole.log(canSubmit("saving"));', 'false', 'function saveTwice(save) {\n  save();\n  save();\n}', 2, '2번 줄은 사용자 동작 한 번에 저장 요청을 중복 전송합니다. 요청 중 상태를 표시해 제출을 제한하세요.'],
  ],
  25: [
    ['텍스트 출력', '신뢰하지 않는 댓글을 마크업으로 실행하지 않고 표시하는 DOM 속성은?', 'textContent', 'innerHTML', 'outerHTML', 'const message = "<img>";\nelement.textContent = message;\nconsole.log(element.textContent);', '<img>', 'function show(element, message) {\n  element.innerHTML = message;\n}', 2, '2번 줄은 문자열을 HTML로 파싱해 실행 가능한 마크업으로 취급합니다. 단순 텍스트는 textContent를 사용하세요.'],
    ['URL 구성 인코딩', '검색어를 URL 쿼리 값으로 넣기 전에 사용할 함수는?', 'encodeURIComponent(query)', 'escapeHTML(query)', 'JSON.parse(query)', 'const query = "JS & React";\nconsole.log(encodeURIComponent(query));', 'JS%20%26%20React', 'const query = "JS & React";\nconst url = "/search?q=" + query;', 2, '2번 줄은 & 같은 예약 문자를 쿼리 구분자로 해석하게 만들 수 있습니다. 값 부분을 encodeURIComponent로 인코딩하세요.'],
    ['허용 목록 이동', '과정 이동 경로를 외부 입력으로 만들 때 안전한 기본은?', '허용된 내부 경로만 선택하게 한다', '입력 주소를 그대로 location에 대입한다', 'URL 검증을 생략한다', 'function coursePath(id) {\n  if (!["js", "py"].includes(id)) return "#/tracks";\n  return "#/track/" + id;\n}\nconsole.log(coursePath("js"));', '#/track/js', 'function openNext(path) {\n  location.href = path;\n}', 2, '2번 줄은 외부 입력에 따라 임의 주소로 이동할 수 있습니다. 허용된 내부 식별자로 목적지를 구성하세요.'],
    ['민감정보 저장', '브라우저 코드에서 비밀번호 저장을 피해야 하는 이유는?', '같은 출처 스크립트나 기기 사용자가 읽을 수 있다', 'localStorage가 자동으로 암호화된다', '브라우저 저장은 서버에서만 접근 가능하다', 'const key = "progress";\nconsole.log(key);', 'progress', 'localStorage.setItem("password", password);', 1, '1번 줄은 브라우저 저장소가 비밀 저장소라고 가정합니다. 같은 출처 스크립트나 기기 사용자가 읽을 수 있으므로 비밀정보를 저장하지 마세요.'],
    ['HTML 삽입 경계', '외부 문구를 화면에 표시하는 가장 안전한 기본 선택은?', 'DOM 노드의 textContent로 텍스트를 넣는다', '문자열을 그대로 innerHTML에 붙인다', '입력 길이만 제한한다', 'function appendMessage(list, message) {\n  const item = document.createElement("li");\n  item.textContent = message;\n  list.append(item);\n  return item;\n}\nconsole.log(typeof appendMessage);', 'function', 'function appendMessage(list, message) {\n  list.innerHTML += "<li>" + message + "</li>";\n}', 2, '2번 줄은 메시지를 실행 가능한 HTML 문자열 안에 삽입합니다. DOM 노드를 만들고 textContent로 텍스트를 넣으세요.'],
  ],
  26: [
    ['기능 계약', '캡스톤 기능을 구현하기 전 합의할 계약은?', '입력·성공 결과·빈 값·오류 동작을 구체화한다', '화면 색만 결정한다', '함수 이름만 정한다', 'function summarize(items) {\n  return { total: items.length, empty: items.length === 0 };\n}\nconsole.log(summarize([]).empty);', 'true', 'function summarize(items) {\n  return { total: items.length };\n}\nconsole.log(summarize([]).completed.length);', 2, '2번 줄은 반환 계약에 없는 completed를 바로 읽습니다. 입력과 결과 형식을 먼저 정하고 빈 경로까지 확인하세요.'],
    ['실패 경로 알림', '기록을 불러오지 못했을 때 적절한 흐름은?', '오류를 알리고 재시도·초기화 선택을 제공한다', '빈 기록인 척 조용히 덮어쓴다', '로딩 표시를 영원히 유지한다', 'function viewFor(status) {\n  if (status === "error") return "기록을 읽지 못했어요";\n  return "학습 기록";\n}\nconsole.log(viewFor("error"));', '기록을 읽지 못했어요', 'function viewFor(status) {\n  return status === "loading" ? "불러오는 중" : "학습 기록";\n}', 2, '2번 줄은 error와 success를 같은 화면으로 처리해 실패를 알리지 못합니다. 오류 문구와 다음 행동을 제공하세요.'],
    ['키보드 사용 흐름', '화면 동작을 키보드로 사용할 수 있게 하는 의미 있는 요소는?', 'button 또는 href가 있는 a', 'onClick만 붙인 일반 span', 'tabIndex 없는 div', 'function ResumeLink({ href }) {\n  return <a href={href}>이어 학습</a>;\n}\nconsole.log(typeof ResumeLink);', 'function', 'function ResumeLink({ href, open }) {\n  return <span onClick={() => open(href)}>이어 학습</span>;\n}', 2, '2번 줄의 span은 기본 키보드 초점과 링크 의미를 제공하지 않습니다. 이동은 href를 가진 a로 표현하세요.'],
    ['빈 상태와 오류 분리', '성공했지만 결과가 없을 때와 요청 실패의 UI는?', '빈 상태 안내와 오류 안내를 따로 렌더링한다', '두 경우 모두 같은 빈 목록으로 보여 준다', '오류만 표시하고 성공 데이터는 숨긴다', 'function statusFor(ok, items) {\n  if (!ok) return "error";\n  return items.length === 0 ? "empty" : "ready";\n}\nconsole.log(statusFor(true, []));', 'empty', 'function statusFor(ok, items) {\n  return items.length === 0 ? "empty" : "ready";\n}', 2, '2번 줄은 ok가 false인 요청 실패도 빈 결과로 분류합니다. 실패, 성공한 빈 목록, 성공한 데이터 상태를 분리하세요.'],
    ['배포 전 회귀 묶음', '작은 앱을 배포하기 전 최소 회귀 묶음에 포함할 것은?', '정상·빈 값·오류·키보드 동작을 각각 확인한다', '홈 화면 한 번만 연다', '콘솔 로그만 본다', 'const checks = ["정상", "빈 값", "오류", "키보드"];\nconsole.log(checks.length);', '4', 'const checks = ["정상"];\nconsole.log(checks.length);', 1, '1번 줄은 정상 경로 하나만 검사해 경계 실패와 키보드 접근 문제를 발견하지 못합니다. 네 흐름을 따로 확인하세요.'],
  ],
});

Object.assign(advancedDailyCaseSpecs, {
  20: [
    ['최소 재현 입력', '오류를 반복해서 관찰하기 위한 첫 단계는?', '문제가 다시 나는 최소 입력과 순서를 고정한다', '여러 코드를 한꺼번에 바꾼다', '재현 전에 캐시를 모두 지운다', 'function firstCourse(courses) {\n  return courses[0]?.title ?? "없음";\n}\nconsole.log(firstCourse([]));', '없음', 'function firstCourse(courses) {\n  return courses[0].title;\n}\nconsole.log(firstCourse([]));', 2, '2번 줄은 빈 목록에서 undefined.title을 읽어 예외를 냅니다. 빈 입력을 포함하는 작은 사례부터 고정하세요.'],
    ['관찰 값과 가설', '간헐적인 검색 결과 문제를 좁히는 데 가장 유용한 로그는?', '요청 id·검색어·응답 도착 순서를 함께 남긴다', '매 렌더마다 전체 객체를 무제한 출력한다', '오류를 잡아 아무 기록도 남기지 않는다', 'const events = ["r1 시작", "r2 시작", "r2 완료", "r1 완료"];\nconsole.log(events.join(" -> "));', 'r1 시작 -> r2 시작 -> r2 완료 -> r1 완료', 'async function load(query) {\n  try { return await request(query); }\n  catch { return []; }\n}', 3, '3번 줄은 실패 원인을 빈 결과로 바꿔 관찰할 단서를 없앱니다. 오류 유형과 요청 맥락을 제한된 로그나 명시적 상태로 남기세요.'],
    ['가설 검증 순서', '오류 원인을 찾을 때 한 번에 하나의 조건만 바꾸는 이유는?', '어떤 변경이 결과에 영향을 줬는지 분리한다', '실행 시간을 일부러 늘린다', '테스트 데이터를 계속 바꾼다', 'const before = 2;\nconst after = before + 1;\nconsole.log(after);', '3', 'const before = 2;\nconst after = before + 1 + Math.random();\nconsole.log(after);', 2, '2번 줄은 무작위 입력을 추가해 결과를 고정하지 못합니다. 한 번에 하나의 가설을 확인하세요.'],
    ['예외 경계 보존', '호출자가 실패 원인을 알 수 있게 하는 방법은?', '오류를 기록하거나 의미 있는 오류 상태로 전달한다', '항상 빈 배열을 반환한다', 'catch 블록에서 아무 일도 하지 않는다', 'function parseCount(value) {\n  const count = Number(value);\n  if (!Number.isFinite(count)) throw new TypeError("숫자가 아닙니다");\n  return count;\n}\nconsole.log(parseCount("3"));', '3', 'function parseCount(value) {\n  try { return Number(value); }\n  catch { return 0; }\n}', 2, 'Number 변환 실패와 유효한 0을 같은 결과로 숨깁니다. 입력 검증 후 호출자가 구분할 수 있도록 오류를 전달하세요.'],
    ['재현 후 회귀 방지', '원인을 수정한 다음 추가할 회귀 검사는?', '원래 실패 입력과 정상 경계 입력을 함께 확인한다', '수정한 줄의 글자 수만 비교한다', '테스트를 제거해 실행 시간을 줄인다', 'function findTitle(items, id) {\n  return items.find((item) => item.id === id)?.title ?? null;\n}\nconsole.log(findTitle([], "missing"));', 'null', 'function findTitle(items, id) {\n  return items.find((item) => item.id === id).title;\n}', 2, '2번 줄은 일치 항목이 없을 때 예외를 냅니다. 빈 결과와 정상 항목을 모두 고정해 회귀를 막으세요.'],
  ],
  21: [
    ['측정 구간', '화면 지연의 원인을 파악하는 첫 성능 측정은?', '사용자가 기다리는 실제 작업 구간을 반복 측정한다', '코드 줄 수로 속도를 추정한다', '기억에 의존해 가장 긴 함수를 고른다', 'const start = performance.now();\nconst result = [1, 2, 3].filter((value) => value > 1);\nconst elapsed = performance.now() - start;\nconsole.log(result.join(","), elapsed >= 0);', '2,3 true', 'const elapsed = Date.now() - performance.now();\nconsole.log(elapsed);', 1, '1번 줄은 서로 다른 시계 기준을 빼 결과가 의미 없는 간격이 됩니다. performance.now()로 시작과 끝을 재세요.'],
    ['선형 순회', '길이 n인 배열을 한 번 filter하는 시간 증가를 표현하면?', 'O(n)', 'O(1)', '항상 O(n²)', 'const values = [1, 2, 3];\nconst doubled = values.map((value) => value * 2);\nconsole.log(doubled.length);', '3', 'const values = [1, 2, 3];\nfor (const left of values) for (const right of values) console.log(left, right);', 2, '중첩 순회는 각 값마다 전체 배열을 다시 방문해 비교 횟수가 대략 n²로 증가합니다. 단일 filter와 비용을 구분하세요.'],
    ['중복 계산 제거', '같은 입력으로 만든 비싼 결과를 반복 사용하려면 먼저 확인할 점은?', '프로파일에서 반복 계산이 실제 병목인지 확인한다', '모든 함수에 무조건 캐시를 넣는다', '결과를 전역 변수에 영구 보관한다', 'function visible(items, query) {\n  return items.filter((item) => item.title.includes(query));\n}\nconsole.log(visible([{ title: "JS" }], "J").length);', '1', 'function visible(items, query) {\n  const result = items.filter((item) => item.title.includes(query));\n  return items.filter((item) => item.title.includes(query));\n}', 3, '3번 줄은 같은 필터를 다시 실행해 앞에서 만든 result도 버립니다. 실제 병목을 측정하고 중복 작업을 제거하세요.'],
    ['캐시 키 구성', '검색 결과 캐시 키에 포함해야 하는 값은?', '결과를 바꾸는 모든 입력과 데이터 버전', '현재 화면의 글꼴 이름', '함수 주석의 문장 수', 'function cacheKey(query, category) {\n  return query.trim().toLowerCase() + "|" + category;\n}\nconsole.log(cacheKey(" JS ", "all"));', 'js|all', 'function cacheKey(query, category) {\n  return query.trim().toLowerCase();\n}', 2, '2번 줄은 category를 키에서 빼 서로 다른 필터 결과를 같은 캐시에 저장할 수 있습니다. 결과에 영향을 주는 입력을 모두 포함하세요.'],
    ['목록 렌더 범위', '매우 큰 목록에서 한 화면에 필요한 항목만 그릴 때 검토할 방법은?', '측정 후 페이지네이션이나 가상화를 적용한다', '모든 항목을 DOM에 숨겨 둔다', '배열을 매 렌더마다 두 번 복사한다', 'const items = [1, 2, 3, 4];\nconst start = 1;\nconst pageSize = 1;\nconst visible = items.slice(start, start + pageSize);\nconsole.log(visible.length);', '1', 'const visible = items.slice(0, items.length);\nconsole.log(visible.length);', 1, '1번 줄은 목록 전체를 복사해 화면에 필요한 범위 제한을 하지 않습니다. 측정값을 바탕으로 범위를 줄이세요.'],
  ],
  22: [
    ['문자열 저장 경계', 'localStorage에 객체를 저장하기 전에 필요한 변환은?', 'JSON.stringify로 문자열화한다', 'JSON.parse로 객체를 다시 읽는다', '객체를 그대로 setItem에 전달한다', 'const progress = { done: 2 };\nconst raw = JSON.stringify(progress);\nconsole.log(typeof raw);', 'string', 'const progress = { done: 2 };\nlocalStorage.setItem("progress", progress);', 2, '2번 줄은 객체를 문자열로 직렬화하지 않아 정보가 손실됩니다. 저장 전에 JSON.stringify를 사용하세요.'],
    ['파싱 실패 복구', '저장 문자열이 손상됐을 때 화면이 멈추지 않게 하는 경계는?', 'JSON.parse를 try/catch하고 안전한 기본값을 반환한다', '파싱을 계속 반복한다', '손상 데이터도 객체라고 단정한다', 'function readProgress(raw) {\n  try { return JSON.parse(raw); }\n  catch { return { done: 0 }; }\n}\nconsole.log(readProgress("{").done);', '0', 'function readProgress(raw) {\n  return JSON.parse(raw);\n}', 2, '2번 줄은 잘못된 JSON에서 SyntaxError를 내어 화면 로드를 중단시킬 수 있습니다. 안전한 복구값을 정의하세요.'],
    ['저장 데이터 버전', '저장 형식이 바뀔 때 기존 기록을 안전하게 읽으려면?', '버전을 확인하고 마이그레이션 또는 기본 경로를 둔다', '기존 기록을 무조건 새 모양으로 단정한다', '모든 필드를 문자열로 합친다', 'const saved = { version: 1, done: ["js"] };\nconsole.log(saved.version);', '1', 'function loadSaved(saved) {\n  return saved.lessons.map((item) => item.id);\n}', 2, '2번 줄은 버전 1 데이터에 없는 lessons 필드를 곧바로 읽습니다. 버전을 확인해 변환하거나 기본값을 제공하세요.'],
    ['저장 용량 오류', '브라우저 저장이 실패할 수 있을 때 필요한 대응은?', '용량·권한 실패를 잡아 사용자에게 저장 실패를 알린다', '브라우저가 무제한 저장을 보장한다고 가정한다', '실패하면 데이터를 조용히 지운다', 'function save(storage, key, value) {\n  try { storage.setItem(key, JSON.stringify(value)); return true; }\n  catch { return false; }\n}\nconsole.log(typeof save);', 'function', 'function save(storage, key, value) {\n  storage.setItem(key, JSON.stringify(value));\n  return true;\n}', 2, '저장소 할당량이나 권한 때문에 setItem이 예외를 낼 수 있습니다. 성공 여부를 확인해 사용자에게 상태를 알려야 합니다.'],
    ['다른 탭 갱신', '같은 사이트의 다른 탭에서 바뀐 localStorage를 알리는 이벤트는?', 'storage 이벤트', 'DOMContentLoaded 이벤트', 'submit 이벤트', 'const eventName = "storage";\nconsole.log(eventName);', 'storage', 'window.addEventListener("submit", onStorageChange);', 1, '1번 줄은 폼 제출 이벤트를 구독하므로 다른 탭의 저장 변경을 받지 못합니다. storage 이벤트를 사용하세요.'],
  ],
  23: [
    ['HTTP 실패 검사', 'fetch가 응답을 받았지만 404일 때 먼저 검사할 값은?', 'response.ok', 'response.json 함수의 존재만', 'response.url 길이', 'const response = { ok: false, status: 404 };\nconsole.log(response.ok);', 'false', 'async function load(response) {\n  return await response.json();\n}', 2, '2번 줄은 HTTP 상태가 실패여도 본문을 정상 데이터처럼 처리합니다. response.ok를 검사해 실패 상태를 분리하세요.'],
    ['성공한 빈 결과', '요청 성공 후 항목이 0개인 화면은 어떤 상태로 다뤄야 하나요?', '성공한 빈 결과 안내', '네트워크 오류', '무한 로딩', 'const status = "success";\nconst items = [];\nconsole.log(status === "success" && items.length === 0);', 'true', 'const status = "loading";\nconst items = [];\nconsole.log(status === "success" && items.length === 0);', 1, '1번 줄은 요청 완료 뒤에도 loading에 남습니다. 성공한 빈 결과와 진행 중 상태를 따로 표현하세요.'],
    ['네트워크 예외 처리', '연결 실패로 fetch가 reject될 때 사용자 화면에 필요한 것은?', '오류 상태와 재시도 방법', '빈 결과를 성공처럼 표시', '요청을 무한히 반복', 'function message(status) {\n  return status === "error" ? "다시 시도해 주세요" : "불러왔어요";\n}\nconsole.log(message("error"));', '다시 시도해 주세요', 'async function load() {\n  try { return await fetch("/courses"); }\n  catch { return []; }\n}', 3, '3번 줄은 네트워크 실패를 성공한 빈 목록과 구별하지 못하게 합니다. 오류 상태를 유지하고 재시도 경로를 제공하세요.'],
    ['로딩 종료', '요청 성공과 실패 어느 쪽에서도 로딩 표시를 닫으려면?', 'finally에서 진행 상태를 정리한다', '성공 경로에만 상태를 바꾼다', '응답 본문에서만 상태를 바꾼다', 'async function load() {\n  try { return await fetch("/courses"); }\n  finally { console.log("요청 종료"); }\n}\nconsole.log(typeof load);', 'function', 'async function load() {\n  try { return await fetch("/courses"); }\n  catch { setLoading(false); }\n}', 3, '3번 줄은 성공 경로에서 로딩을 끄지 않습니다. 성공·실패 공통 정리는 finally에 두세요.'],
    ['JSON 응답 파싱', 'Response에서 JSON 데이터를 얻기 위한 올바른 호출은?', 'await response.json()', 'response.json 프로퍼티만 반환', 'JSON.stringify(response)', 'async function read(response) {\n  return await response.json();\n}\nconsole.log(typeof read);', 'function', 'async function read(response) {\n  return response.json;\n}', 2, '2번 줄은 메서드 자체를 반환해 파싱을 시작하지 않습니다. json()을 호출하고 비동기 결과를 기다리세요.'],
  ],
  24: [
    ['최신 요청 식별', '검색어를 바꾼 뒤 오래된 응답을 무시하는 조건은?', '응답 id가 최신 요청 id와 같은지 확인한다', '응답이 먼저 시작했는지 확인한다', '배열 길이가 같은지 확인한다', 'function isLatest(id, latestId) {\n  return id === latestId;\n}\nconsole.log(isLatest("r2", "r2"));', 'true', 'function shouldApply(id, latestId) {\n  return id <= latestId;\n}', 2, '2번 줄은 이전 id도 최신 id보다 작다는 이유로 허용합니다. 최신 id와 정확히 같은 응답만 적용하세요.'],
    ['AbortController 연결', '요청 취소를 fetch에 전달하는 옵션은?', 'signal: controller.signal', 'controller: true', 'abort: controller.abort()', 'const controller = new AbortController();\nconst options = { signal: controller.signal };\nconsole.log(options.signal === controller.signal);', 'true', 'const controller = new AbortController();\nfetch("/search", { controller });', 2, '2번 줄은 fetch가 인식하지 않는 controller 옵션을 전달합니다. AbortController의 signal을 요청 옵션에 넣으세요.'],
    ['Effect 정리', '새 검색어로 이전 요청을 취소하는 시점은?', 'Effect 정리 함수에서 controller.abort()를 호출한다', '응답 본문을 모두 읽은 뒤에만 취소한다', '다시 렌더링될 때 이전 컨트롤러를 잊는다', 'function cancel(controller) {\n  controller.abort();\n  return controller.signal.aborted;\n}\nconsole.log(typeof cancel);', 'function', 'useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n}, [url]);', 4, 'Effect가 다시 실행되거나 사라져도 이전 요청은 정리되지 않습니다. cleanup에서 abort를 호출하세요.'],
    ['디바운스 경계', '짧은 시간 입력이 계속될 때 요청 수를 줄이는 기법은?', '마지막 입력 뒤 일정 시간이 지나면 요청한다', '입력할 때마다 즉시 요청한다', '응답을 무조건 오래 캐시한다', 'let timer;\nfunction schedule(run) {\n  clearTimeout(timer);\n  timer = setTimeout(run, 250);\n}\nconsole.log(typeof schedule);', 'function', 'function schedule(run) {\n  setTimeout(run, 250);\n  clearTimeout(timer);\n}', 2, '2번 줄은 기존 타이머를 취소하기 전에 새 타이머를 만들어 요청이 여러 번 실행될 수 있습니다. 먼저 기존 타이머를 정리하세요.'],
    ['중복 저장 방지', '같은 저장 요청을 두 번 보내지 않도록 할 UI 상태는?', '요청 중 제출을 잠그고 결과 뒤 다시 연다', '요청을 무한 재전송한다', '완료 상태를 요청 전에 확정한다', 'function canSubmit(status) {\n  return status !== "saving";\n}\nconsole.log(canSubmit("saving"));', 'false', 'function saveTwice(save) {\n  save();\n  save();\n}', 2, '2번 줄은 사용자 동작 한 번에 저장 요청을 중복 전송합니다. 요청 중 상태를 표시해 제출을 제한하세요.'],
  ],
  25: [
    ['텍스트 출력', '신뢰하지 않는 댓글을 마크업으로 실행하지 않고 표시하는 DOM 속성은?', 'textContent', 'innerHTML', 'outerHTML', 'const element = { textContent: "" };\nconst message = "<img>";\nelement.textContent = message;\nconsole.log(element.textContent);', '<img>', 'function show(element, message) {\n  element.innerHTML = message;\n}', 2, '2번 줄은 문자열을 HTML로 파싱해 실행 가능한 마크업으로 취급합니다. 단순 텍스트는 textContent를 사용하세요.'],
    ['URL 구성 인코딩', '검색어를 URL 쿼리 값으로 넣기 전에 사용할 함수는?', 'encodeURIComponent(query)', 'escapeHTML(query)', 'JSON.parse(query)', 'const query = "JS & React";\nconsole.log(encodeURIComponent(query));', 'JS%20%26%20React', 'const query = "JS & React";\nconst url = "/search?q=" + query;', 2, '2번 줄은 & 같은 예약 문자를 쿼리 구분자로 해석하게 만들 수 있습니다. 값 부분을 encodeURIComponent로 인코딩하세요.'],
    ['허용 목록 이동', '과정 이동 경로를 외부 입력으로 만들 때 안전한 기본은?', '허용된 내부 경로만 선택하게 한다', '입력 주소를 그대로 location에 대입한다', 'URL 검증을 생략한다', 'function coursePath(id) {\n  if (!["js", "py"].includes(id)) return "#/tracks";\n  return "#/track/" + id;\n}\nconsole.log(coursePath("js"));', '#/track/js', 'function openNext(path) {\n  location.href = path;\n}', 2, '2번 줄은 외부 입력에 따라 임의 주소로 이동할 수 있습니다. 허용된 내부 식별자로 목적지를 구성하세요.'],
    ['민감정보 저장', '브라우저 코드에서 비밀번호 저장을 피해야 하는 이유는?', '같은 출처 스크립트나 기기 사용자가 읽을 수 있다', 'localStorage가 자동으로 암호화된다', '브라우저 저장은 서버에서만 접근 가능하다', 'const key = "progress";\nconsole.log(key);', 'progress', 'function saveSecret(password) {\n  localStorage.setItem("password", password);\n}', 2, '2번 줄은 브라우저 저장소가 비밀 저장소라고 가정합니다. 같은 출처 스크립트나 기기 사용자가 읽을 수 있으므로 비밀정보를 저장하지 마세요.'],
    ['HTML 삽입 경계', '외부 문구를 화면에 표시하는 안전한 기본 선택은?', 'DOM 노드의 textContent로 텍스트를 넣는다', '문자열을 그대로 innerHTML에 붙인다', '입력 길이만 제한한다', 'function appendMessage(list, message) {\n  const item = document.createElement("li");\n  item.textContent = message;\n  list.append(item);\n  return item;\n}\nconsole.log(typeof appendMessage);', 'function', 'function appendMessage(list, message) {\n  list.innerHTML += "<li>" + message + "</li>";\n}', 2, '2번 줄은 메시지를 실행 가능한 HTML 문자열 안에 삽입합니다. DOM 노드를 만들고 textContent로 텍스트를 넣으세요.'],
  ],
  26: [
    ['기능 계약', '캡스톤 기능을 구현하기 전 합의할 계약은?', '입력·성공 결과·빈 값·오류 동작을 구체화한다', '화면 색만 결정한다', '함수 이름만 정한다', 'function summarize(items) {\n  return { total: items.length, completed: items.filter((item) => item.done).length };\n}\nconsole.log(summarize([]).completed);', '0', 'function summarize(items) {\n  return { total: items.length };\n}\nconsole.log(summarize([]).completed.length);', 2, '2번 줄은 반환 계약에 없는 completed를 바로 읽습니다. 입력과 결과 형식을 먼저 정하고 빈 경로까지 확인하세요.'],
    ['실패 경로 알림', '기록을 불러오지 못했을 때 적절한 흐름은?', '오류를 알리고 재시도·초기화 선택을 제공한다', '빈 기록인 척 조용히 덮어쓴다', '로딩 표시를 영원히 유지한다', 'function viewFor(status) {\n  if (status === "error") return "기록을 읽지 못했어요";\n  return "학습 기록";\n}\nconsole.log(viewFor("error"));', '기록을 읽지 못했어요', 'function viewFor(status) {\n  return status === "loading" ? "불러오는 중" : "학습 기록";\n}', 2, '2번 줄은 error와 success를 같은 화면으로 처리해 실패를 알리지 못합니다. 오류 문구와 다음 행동을 제공하세요.'],
    ['키보드 사용 흐름', '화면 동작을 키보드로 사용할 수 있게 하는 의미 있는 요소는?', 'button 또는 href가 있는 a', 'onClick만 붙인 일반 span', 'tabIndex 없는 div', 'function ResumeTarget(href) {\n  return { tag: "a", href, label: "이어 학습" };\n}\nconsole.log(ResumeTarget("#/lesson/js").tag);', 'a', 'function ResumeTarget(href, open) {\n  return { tag: "span", onClick: () => open(href) };\n}', 2, '2번 줄의 span은 기본 키보드 초점과 링크 의미를 제공하지 않습니다. 이동은 href를 가진 a로 표현하세요.'],
    ['빈 상태와 오류 분리', '성공했지만 결과가 없을 때와 요청 실패의 UI는?', '빈 상태 안내와 오류 안내를 따로 렌더링한다', '두 경우 모두 같은 빈 목록으로 보여 준다', '오류만 표시하고 성공 데이터는 숨긴다', 'function statusFor(ok, items) {\n  if (!ok) return "error";\n  return items.length === 0 ? "empty" : "ready";\n}\nconsole.log(statusFor(true, []));', 'empty', 'function statusFor(ok, items) {\n  return items.length === 0 ? "empty" : "ready";\n}', 2, '2번 줄은 ok가 false인 요청 실패도 빈 결과로 분류합니다. 실패, 성공한 빈 목록, 성공한 데이터 상태를 분리하세요.'],
    ['배포 전 회귀 묶음', '작은 앱을 배포하기 전 최소 회귀 묶음에 포함할 것은?', '정상·빈 값·오류·키보드 동작을 각각 확인한다', '홈 화면 한 번만 연다', '콘솔 로그만 본다', 'const checks = ["정상", "빈 값", "오류", "키보드"];\nconsole.log(checks.length);', '4', 'const checks = ["정상"];\nconsole.log(checks.length);', 1, '1번 줄은 정상 경로 하나만 검사해 경계 실패와 키보드 접근 문제를 발견하지 못합니다. 네 흐름을 따로 확인하세요.'],
  ],
});

const advancedDailyCases = Object.fromEntries(Object.entries(advancedDailyCaseSpecs).flatMap(([week, cases]) =>
  cases.map(([title, prompt, correctOption, wrongOptionA, wrongOptionB, traceCode, traceOutput, errorCode, errorLine, errorExplanation], index) => {
    const answer = (Number(week) + index) % 3;
    const options = [];
    options[answer] = correctOption;
    options[(answer + 1) % 3] = wrongOptionA;
    options[(answer + 2) % 3] = wrongOptionB;
    return [String(week) + '-' + (index + 1), [title, prompt, options, answer, traceCode, [traceOutput], errorCode.split('\n'), errorLine, errorExplanation]];
  }),
));

advancedDailyCases['13-5'][4] = 'const query = "   ".trim().toLowerCase();\nconsole.log(JSON.stringify(query));';
advancedDailyCases['24-5'][6] = ['function saveTwice(save) {', '  return save() && save();', '}'];
advancedDailyCases['24-5'][7] = 2;
advancedDailyCases['26-1'][6] = [
  'function summarize(items) {',
  '  return items.reduce((summary, item) => summary + Number(item.done));',
  '}',
];
advancedDailyCases['26-1'][7] = 2;
advancedDailyCases['26-1'][8] = '2번 줄은 초기 누적값 없이 reduce를 호출합니다. 빈 목록에서는 TypeError가 나므로 초기값 0을 전달해야 합니다.';

const foundationSnippetRepairVariants = {
  '1-4': {
    starterCode: 'const name = "민지";\nconst greeting = "";\nconsole.log(greeting);',
    solutionPatterns: [String.raw`^\s*const\s+name\s*=\s*"민지"\s*;\s*const\s+greeting\s*=\s*"안녕, "\s*\+\s*name\s*;\s*console\.log\(\s*greeting\s*\)\s*;?\s*$`],
    requirement: 'name에 든 값 앞에 "안녕, "을 붙여 greeting에 저장하고 출력한다.',
    example: { input: 'name = "민지"', output: '안녕, 민지' },
    check: { input: 'name = "수진"', expected: '안녕, 수진' },
  },
  '1-5': {
    starterCode: 'let currentAttempt = 1;\nconsole.log(currentAttempt);',
    solutionPatterns: [String.raw`^\s*let\s+currentAttempt\s*=\s*1\s*;\s*currentAttempt\s*\+=\s*1\s*;\s*console\.log\(\s*currentAttempt\s*\)\s*;?\s*$`, String.raw`^\s*let\s+currentAttempt\s*=\s*1\s*;\s*currentAttempt\s*=\s*currentAttempt\s*\+\s*1\s*;\s*console\.log\(\s*currentAttempt\s*\)\s*;?\s*$`],
    requirement: 'currentAttempt에 1을 더해 새 값을 저장한 뒤 출력한다.',
    example: { input: 'currentAttempt = 1', output: '2' },
    check: { input: 'currentAttempt = 4', expected: '5' },
  },
  '2-4': {
    starterCode: 'const loggedIn = true;\nconst agreed = false;\nconst canStart = loggedIn || agreed;\nconsole.log(canStart);',
    solutionPatterns: [String.raw`^\s*const\s+loggedIn\s*=\s*true\s*;\s*const\s+agreed\s*=\s*false\s*;\s*const\s+canStart\s*=\s*loggedIn\s*&&\s*agreed\s*;\s*console\.log\(\s*canStart\s*\)\s*;?\s*$`],
    requirement: '로그인과 동의가 모두 true일 때만 canStart가 true가 되도록 고친다.',
    example: { input: 'loggedIn = true, agreed = false', output: 'false' },
    check: { input: 'loggedIn = true, agreed = true로 바꿔 다시 실행', expected: 'true' },
  },
  '2-5': {
    starterCode: 'const hasError = true;\nconst attempts = 3;\nconst canRetry = hasError && attempts <= 3;\nconsole.log(canRetry);',
    solutionPatterns: [String.raw`^\s*const\s+hasError\s*=\s*true\s*;\s*const\s+attempts\s*=\s*3\s*;\s*const\s+canRetry\s*=\s*hasError\s*&&\s*attempts\s*<\s*3\s*;\s*console\.log\(\s*canRetry\s*\)\s*;?\s*$`],
    requirement: '3회째에는 다시 시도하지 않도록 비교 연산자를 고친다.',
    example: { input: 'hasError = true, attempts = 3', output: 'false' },
    check: { input: 'hasError = true, attempts = 2', expected: 'true' },
  },
  '3-4': {
    starterCode: 'const items = ["JavaScript", "React"];\nfor (let index = 0; index <= items.length; index += 1) {\n  console.log(items[index]);\n}',
    solutionPatterns: [String.raw`^\s*const\s+items\s*=\s*\[\s*"JavaScript"\s*,\s*"React"\s*\]\s*;\s*for\s*\(\s*let\s+index\s*=\s*0\s*;\s*index\s*<\s*items\.length\s*;\s*index\s*\+=\s*1\s*\)\s*\{\s*console\.log\(\s*items\[\s*index\s*\]\s*\)\s*;?\s*\}\s*$`],
    requirement: '배열에 실제로 있는 항목만 한 번씩 출력하도록 반복 조건을 고친다.',
    example: { input: '["JavaScript", "React"]', output: 'JavaScript, React' },
    check: { input: '빈 배열 []', expected: '출력 없음' },
  },
  '3-5': {
    starterCode: 'const scores = [2, 4, 6];\nlet total;\nfor (const score of scores) total += score;\nconsole.log(total);',
    solutionPatterns: [String.raw`^\s*const\s+scores\s*=\s*\[\s*2\s*,\s*4\s*,\s*6\s*\]\s*;\s*let\s+total\s*=\s*0\s*;\s*for\s*\(\s*const\s+score\s+of\s+scores\s*\)\s*total\s*\+=\s*score\s*;\s*console\.log\(\s*total\s*\)\s*;?\s*$`],
    requirement: '누적값을 0에서 시작해 일반 배열과 빈 배열의 합을 계산한다.',
    example: { input: '[2, 4, 6]', output: '12' },
    check: { input: 'scores = []', expected: '0' },
  },
};

const foundationErrorVariants = {
  '7-4': [['if (active) {', '  const theme = "dark";', '}', 'console.log(theme);'], 4, '4번 줄에서 theme은 if 블록 안에서만 유효합니다. 블록 밖에서 필요하면 값을 반환하거나 바깥 범위에서 선언해야 합니다.'],
  '9-1': [['form.addEventListener("submit", (event) => {', '  event.preventDefault;', '  save(input.value);', '});'], 2, '2번 줄은 메서드를 호출하지 않아 브라우저의 기본 제출 이동을 막지 못합니다. event.preventDefault()로 호출하세요.'],
  '9-2': [['const value = input.value;', 'if (!value.trim()) return;', 'save(value);'], 3, '3번 줄은 공백을 제거하지 않은 입력을 저장합니다. 검증과 저장에 같은 정리된 값을 사용하세요.'],
  '9-3': [['function showMessage(element, message) {', '  element.innerHTML = message;', '}'], 2, '2번 줄은 사용자 문자열을 HTML로 해석합니다. 단순 안내 문구는 textContent로 표시하세요.'],
  '9-4': [['const value = input.value.trim();', 'if (!value) return;', 'save(value);'], 1, '1번 줄에서 입력을 정리해도 실제 제출 이벤트를 취소하지 않으면 페이지가 이동할 수 있습니다. 이벤트 경계를 함께 처리하세요.'],
  '10-1': [['async function readProfile(response) {', '  const profile = response.json();', '  return profile.name;', '}'], 2, '2번 줄의 json()은 Promise를 반환합니다. await로 파싱 결과를 받아야 name에 접근할 수 있습니다.'],
  '10-2': [['async function load(response) {', '  const data = await response.json();', '  return data.name;', '}'], 2, '2번 줄 전에 response.ok를 확인하지 않아 HTTP 오류 본문을 정상 데이터처럼 처리할 수 있습니다. 상태를 먼저 검사하세요.'],
  '10-3': [['async function load(response) {', '  if (!response.ok) throw new Error("request failed");', '  try { return await response.json(); } catch { return {}; }', '}'], 3, '3번 줄은 잘못된 JSON을 정상적인 빈 객체로 바꿔 오류 원인을 숨깁니다. 파싱 실패는 호출자가 오류 상태로 다룰 수 있게 전달하세요.'],
  '10-4': [['function readJson(response) {', '  return response.json;', '}'], 2, '2번 줄은 json 메서드를 호출하지 않고 함수만 반환합니다. response.json()을 호출해 본문을 파싱하는 Promise를 반환하세요.'],
  '11-1': [['const start = Date.now();', 'while (Date.now() - start < 5000) {}', 'console.log("완료");'], 2, '2번 줄의 긴 동기 반복은 메인 스레드를 점유합니다. 호출 스택이 끝나기 전에는 입력 처리와 렌더링이 진행되지 않습니다.'],
  '11-2': [['function runTask() { console.log("task"); }', 'setTimeout(runTask(), 0);'], 2, '2번 줄은 runTask의 반환값을 타이머에 넘기기 전에 함수를 즉시 호출합니다. 함수 참조를 전달하려면 setTimeout(runTask, 0)을 사용하세요.'],
  '11-3': [['const log = (message) => console.log(message);', 'Promise.resolve().then(log("microtask"));', 'console.log("sync");'], 2, '2번 줄은 log를 즉시 호출해 `microtask`를 먼저 출력하고, 그 반환값인 undefined를 then에 전달합니다. 콜백을 예약하려면 `() => log("microtask")`처럼 함수를 전달해야 합니다.'],
  '11-4': [['function scheduleRender(update, requestFrame) {', '  update("now");', '}'], 2, '2번 줄은 callback을 프레임에 예약하지 않고 즉시 실행합니다. requestFrame에 callback을 전달하세요.'],
};

const javascriptNamedExportExample = [
  '// format.mjs',
  'export function toTitle(text) {',
  '  return text.toUpperCase();',
  '}',
  '',
  '// main.mjs',
  'import { toTitle } from "./format.mjs";',
  'console.log(toTitle("js")); // JS',
].join('\n');

const javascriptNamedImportAliasExample = [
  '// format.mjs',
  'export const formatTitle = (text) => text.toUpperCase();',
  '',
  '// main.mjs',
  'import { formatTitle as toTitle } from "./format.mjs";',
  'console.log(toTitle("js")); // JS',
].join('\n');

const completeFoundationExamples = {
  1: [
    'const minutes = 30;\nconsole.log(typeof minutes); // number',
    'const course = "JavaScript";\nlet completed = 0;\ncompleted += 1;\nconsole.log(course, completed); // JavaScript 1',
    'let total = 2;\nconst score = 3;\ntotal += score;\nconsole.log(total); // 5',
    'const name = "민지";\nconst greeting = "안녕, " + name;\nconsole.log(greeting); // 안녕, 민지',
    'let currentAttempt = 1;\ncurrentAttempt = currentAttempt + 1;\nconsole.log(currentAttempt); // 2',
  ],
  2: [
    'const text = "3";\nconst count = 3;\nconsole.log(text === count); // false',
    'const loggedIn = true;\nconst agreed = false;\nconsole.log(loggedIn && agreed); // false',
    'const score = 59;\nif (score >= 60) {\n  console.log("통과");\n} else {\n  console.log("한 번 더 확인");\n}',
    'const loggedIn = true;\nconst agreed = false;\nconst canStart = loggedIn && agreed;\nconsole.log(canStart); // false',
    'const hasError = true;\nconst attempts = 2;\nconst canRetry = hasError && attempts < 3;\nconsole.log(canRetry); // true',
  ],
  3: [
    'const indexes = [];\nfor (let index = 0; index < 3; index += 1) indexes.push(index);\nconsole.log(indexes.join(",")); // 0,1,2',
    'let total = 0;\nfor (const score of [2, 4]) total += score;\nconsole.log(total); // 6',
    'let total = 0;\nfor (const value of [1, 2, 3]) total += value;\nconsole.log(total); // 6',
    'const items = ["JavaScript", "React"];\nconst index = 1;\nconst nextIndex = 2;\nconsole.log(index < items.length, nextIndex < items.length); // true false',
    'const scores = [2, 4, 6];\nlet total = 0;\nfor (const score of scores) total += score;\nconst emptyScores = [];\nlet emptyTotal = 0;\nfor (const score of emptyScores) emptyTotal += score;\nconsole.log(total, emptyTotal); // 12 0',
  ],
  4: [
    'function greet(name) {\n  return `안녕, ${name}`;\n}\n\nconsole.log(greet("민")); // 안녕, 민',
    'function double(value) {\n  return value * 2;\n}\n\nconsole.log(double(4)); // 8',
    'function greet(name = "학습자") {\n  return `안녕, ${name}`;\n}\n\nconsole.log(greet(), greet("민")); // 안녕, 학습자 안녕, 민',
    'function greet(name = "학습자") {\n  return `안녕, ${name}`;\n}\n\nconsole.log(greet(), greet(undefined), greet(null)); // 안녕, 학습자 안녕, 학습자 안녕, null',
    'function courseLabel(title, level) {\n  return `${title} (${level})`;\n}\n\nconsole.log(courseLabel("JS", "기초")); // JS (기초)',
  ],
  5: [
    'const items = ["JS", "React", "Python"];\nconsole.log(items[2]); // Python',
    'const courses = ["JS"];\nconst next = [...courses, "React"];\nconsole.log(next.join(",")); // JS,React',
    'const scores = [55, 60, 90];\nconst passed = scores.filter((score) => score >= 60);\nconsole.log(passed.join(",")); // 60,90',
    'function sortedCopy(names) {\n  return [...names].sort();\n}\n\nconst names = ["b", "a"];\nconsole.log(sortedCopy(names).join(","), names.join(",")); // a,b b,a',
    'function lastVisible(items) {\n  return items.length === 0 ? null : items[items.length - 1];\n}\n\nconsole.log(lastVisible(["JS", "React"]), lastVisible([])); // React null',
  ],
  6: [
    'const profile = { name: "민" };\nconsole.log(profile.name); // 민',
    'const profile = {};\nconsole.log(profile.bio?.length || "소개 없음"); // 소개 없음',
    'const profile = { name: "민", level: 1 };\nconst next = { ...profile, level: 2 };\nconsole.log(next.name, next.level); // 민 2',
    'function courseSummary(course) {\n  return `${course.title}: ${course.minutes}분`;\n}\n\nconsole.log(courseSummary({ title: "Python", minutes: 30 })); // Python: 30분',
    'function updateLevel(profile, level) {\n  return { ...profile, level };\n}\n\nconst profile = { name: "민", level: 1 };\nconst next = updateLevel(profile, 2);\nconsole.log(profile.level, next.level, next.name); // 1 2 민',
  ],
  7: [
    'const label = "바깥";\n{\n  const label = "안쪽";\n  console.log(label); // 안쪽\n}\nconsole.log(label); // 바깥',
    'function createLabel() {\n  const label = "함수 안";\n  return label;\n}\n\nconsole.log(createLabel()); // 함수 안',
    'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\n\nconst first = makeCounter();\nconst second = makeCounter();\nconsole.log(first(), first(), second()); // 1 2 1',
    'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\n\nconst next = makeCounter();\nconsole.log(next(), next()); // 1 2',
    'function makeCounter() {\n  let count = 0;\n  return { next: () => ++count, read: () => count };\n}\n\nconst counter = makeCounter();\nconsole.log(counter.next(), counter.read(), counter.next()); // 1 1 2',
  ],
  8: [
    javascriptNamedExportExample,
    javascriptNamedImportAliasExample,
    'function requireTitle(title) {\n  if (typeof title !== "string" || title.trim() === "") {\n    throw new Error("title is required");\n  }\n  return title.trim();\n}\n\ntry {\n  console.log(requireTitle("   "));\n} catch (error) {\n  console.log(error.message); // title is required\n}',
    'function parseAttempt(raw) {\n  if (typeof raw !== "string" || raw.trim() === "") return null;\n  const value = Number(raw);\n  return Number.isInteger(value) ? value : null;\n}\n\nconsole.log(parseAttempt("12"), parseAttempt("12.0"), parseAttempt("2.5"), parseAttempt(" ")); // 12 12 null null',
    'function isUsableTitle(title) {\n  return typeof title === "string" && title.trim().length > 0;\n}\n\nconst cases = [\n  ["일반 제목", "React", true],\n  ["공백 제목", "   ", false],\n  ["숫자 입력", 42, false],\n];\n\nfor (const [label, input, expected] of cases) {\n  const actual = isUsableTitle(input);\n  console.log(label, actual === expected ? "통과" : "실패");\n}',
  ],
  9: [
    '// HTML에 <form id="course-form"><button>저장</button></form>이 있다고 가정합니다.\nconst form = document.querySelector("#course-form");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  console.log(event.defaultPrevented);\n});\nform.requestSubmit(); // true',
    'function normalizeTitle(raw) {\n  const title = raw.trim();\n  return title.length > 0 ? title : null;\n}\n\nconsole.log(normalizeTitle("  React  "), normalizeTitle("   ")); // React null',
    '// HTML에 <output id="preview"></output>이 있다고 가정합니다.\nconst preview = document.querySelector("#preview");\npreview.textContent = "<b>저장됨</b>";\nconsole.log(preview.textContent); // <b>저장됨</b>',
    '// HTML에 <input id="course-title" value=" React ">가 있다고 가정합니다.\nfunction readTitle(input) {\n  const title = input.value.trim();\n  return title.length > 0 ? title : null;\n}\n\nconsole.log(readTitle(document.querySelector("#course-title")), readTitle({ value: " " })); // React null',
    '// HTML에 course-form, course-title, message 요소가 있다고 가정합니다.\nfunction readTitle(input) {\n  const title = input.value.trim();\n  return title.length > 0 ? title : null;\n}\n\nconst form = document.querySelector("#course-form");\nconst input = document.querySelector("#course-title");\nconst message = document.querySelector("#message");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const title = readTitle(input);\n  message.textContent = title === null ? "<b>제목을 입력하세요</b>" : `${title} 저장됨`;\n});\ninput.value = "   ";\nform.requestSubmit();\nconsole.log(message.textContent);\ninput.value = "<b>React</b>";\nform.requestSubmit();\nconsole.log(message.textContent); // 태그가 글자로 표시됨',
  ],
  10: [
    'async function readTitle(response) {\n  const data = await response.json();\n  return data.title;\n}\nconst response = { json: async () => ({ title: "React" }) };\nconsole.log(await readTitle(response)); // React',
    'async function load(response) {\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\ntry {\n  await load({ ok: false, status: 404, json: async () => ({ message: "missing" }) });\n} catch (error) {\n  console.log(error.message); // HTTP 404\n}',
    'async function load(fetcher) {\n  try {\n    await fetcher();\n    return "loaded";\n  } catch (error) {\n    return `network: ${error.message}`;\n  }\n}\nconst offline = () => Promise.reject(new Error("offline"));\nconsole.log(await load(offline)); // network: offline',
    'async function readJson(response) {\n  return response.json();\n}\nconst response = { json: async () => ({ count: 2 }) };\nconsole.log((await readJson(response)).count); // 2',
    'function requestWithSignal(url, controller) {\n  return fetch(url, { signal: controller.signal });\n}\nconst controller = new AbortController();\nlet sentSignal;\nconst fetch = (url, options) => { sentSignal = options.signal; return url; };\nconst request = requestWithSignal("/courses", controller);\ncontroller.abort();\nconsole.log(request, sentSignal === controller.signal, sentSignal.aborted); // /courses true true',
  ],
  11: [
    'const order = ["A"];\nPromise.resolve().then(() => order.push("B"));\nsetTimeout(() => order.push("C"), 0);\norder.push("D");\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", ")); // A, D, B, C',
    'const order = [];\nsetTimeout(() => order.push("timer"), 0);\norder.push("sync");\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", ")); // sync, timer',
    'const order = ["sync"];\nPromise.resolve().then(() => order.push("promise"));\nqueueMicrotask(() => order.push("queued"));\nsetTimeout(() => order.push("timer"), 0);\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", ")); // sync, promise, queued, timer',
    'function scheduleRender(update, requestFrame) {\n  return requestFrame(() => update("ready"));\n}\nconst pending = [];\nscheduleRender((value) => console.log(value), (callback) => { pending.push(callback); return pending.length; });\nconsole.log(pending.length);\npending[0](); // 1, then ready (requestAnimationFrame 모형)',
    'function scheduleChunk(work, scheduleTask) {\n  return scheduleTask(work);\n}\nlet pending;\nconst result = scheduleChunk(() => console.log("chunk"), (callback) => { pending = callback; return "queued"; });\nconsole.log(result, typeof pending);\npending(); // queued function, then chunk (스케줄러 모형)',
  ],
};

const focusedFoundationDailyCases = {
  '1-1': ['자료형 확인', '숫자 값 minutes의 자료형을 확인하는 표현은?', ['`typeof minutes`', '`typeof "minutes"`', '`typeof "30"`'], 0, 'const minutes = 30;\nconsole.log(typeof minutes);', ['number'], ['const minutes = 30;', 'console.log(typeof "minutes");'], 2, '2번 줄은 변수 minutes가 아니라 따옴표 안의 문자열을 확인합니다. 변수 값의 자료형을 보려면 typeof minutes를 사용하세요.'],
  '1-2': ['변수 선언 규칙', '값을 다시 대입할 이름을 선언할 때 고려해야 할 규칙은?', ['`let completed = 0`으로 선언하면 다시 대입할 수 있다', '`const completed = 0`으로 선언하면 다시 대입할 수 있다', '블록 안에서 선언한 이름은 선언 전에 읽을 수 있다'], 0, 'const course = "JavaScript";\nlet completed = 0;\ncompleted += 1;\nconsole.log(course, completed);', ['JavaScript 1'], ['const course = "JavaScript";', 'console.log(course);', 'let completed = 0;'], 3, '3번 줄은 completed를 선언하기 전에 읽습니다. const와 let으로 선언한 이름은 선언문을 실행하기 전에 접근할 수 없습니다.'],
  '1-3': ['대입 연산자', 'total이 2일 때 3을 더해 5로 바꾸는 문장은?', ['`total = 3`', '`total += 3`', '`total === 3`'], 1, 'let total = 2;\nconst score = 3;\ntotal += score;\nconsole.log(total);', ['5'], ['let total = 2;', 'const score = 3;', 'total = score;', 'console.log(total);'], 3, '3번 줄은 기존 total에 더하지 않고 score 값 3으로 덮어씁니다. 기존 값에 더하려면 `total += score`를 사용하세요.'],
  '1-4': ['문자열 연결', 'name이 "민지"일 때 "안녕, 민지"를 만드는 문장은?', ['`"안녕, " + name`', '`"안녕, ${name}"`', '`"안녕, " + "name"`'], 0, 'const name = "민지";\nconst greeting = "안녕, " + name;\nconsole.log(greeting);', ['안녕, 민지'], ['const name = "민지";', 'const greeting = "안녕, " + "name";', 'console.log(greeting);'], 2, '2번 줄은 변수 name의 값이 아니라 글자 "name"을 연결합니다. 문자열과 변수 값을 이어 붙이려면 따옴표 밖에 변수 이름을 적으세요.'],
  '1-5': ['변수 값 갱신', 'currentAttempt가 1일 때 값을 2로 바꾸는 문장은?', ['`currentAttempt + 1`', '`currentAttempt = currentAttempt + 1`', '`const currentAttempt = 2`'], 1, 'let currentAttempt = 1;\ncurrentAttempt = currentAttempt + 1;\nconsole.log(currentAttempt);', ['2'], ['const currentAttempt = 1;', 'currentAttempt = currentAttempt + 1;', 'console.log(currentAttempt);'], 2, '2번 줄에서 const로 선언한 이름에 새 값을 대입해 오류가 납니다. 다시 대입할 변수는 let으로 선언해야 합니다.'],
  '2-1': ['엄격한 동등 비교', '문자열 "3"과 숫자 3을 자료형 변환 없이 비교하는 연산자는?', ['`==`', '`===`', '`=`'], 1, 'const text = "3";\nconst count = 3;\nconsole.log(text === count);', ['false'], ['const text = "3";', 'const count = 3;', 'console.log(text == count);'], 3, '3번 줄의 `==`는 비교 전에 일부 자료형을 변환하므로 이 값은 true가 됩니다. 자료형까지 구분하려면 `===`를 사용하세요.'],
  '2-2': ['논리 AND', '로그인과 약관 동의가 모두 필요할 때 두 조건을 묶는 연산자는?', ['`loggedIn || agreed`', '`loggedIn && agreed`', '`!loggedIn && agreed`'], 1, 'const loggedIn = true;\nconst agreed = false;\nconsole.log(loggedIn && agreed);', ['false'], ['const loggedIn = true;', 'const agreed = false;', 'const canStart = loggedIn || agreed;', 'console.log(canStart);'], 3, '3번 줄은 `||`를 사용해 둘 중 하나만 참이어도 시작을 허용합니다. 두 조건이 모두 참이어야 한다면 `&&`를 써야 합니다.'],
  '2-3': ['조건 분기', '60점 이상을 통과로 판단할 때 올바른 조건식은?', ['`score > 60`', '`score >= 60`', '`score = 60`'], 1, 'const score = 59;\nif (score >= 60) {\n  console.log("통과");\n} else {\n  console.log("한 번 더 확인");\n}', ['한 번 더 확인'], ['const score = 59;', 'if (score = 60) {', '  console.log("통과");', '} else {', '  console.log("한 번 더 확인");', '}'], 2, '2번 줄의 `=`는 비교가 아니라 score에 60을 대입합니다. 기준점 이상인지 비교하려면 `>=`를 사용하세요.'],
  '2-4': ['참과 거짓', '로그인과 동의가 모두 필요할 때, `loggedIn=true`, `agreed=false`의 결과는?', ['`loggedIn && agreed`는 false', '`loggedIn || agreed`는 true', '`loggedIn && !agreed`는 true'], 0, 'const loggedIn = true;\nconst agreed = false;\nconst canStart = loggedIn && agreed;\nconsole.log(canStart);', ['false'], ['const loggedIn = true;', 'const agreed = false;', 'const canStart = loggedIn || agreed;', 'console.log(canStart);'], 3, '3번 줄은 `||`를 사용해 둘 중 하나만 참이어도 시작을 허용합니다. 두 조건이 모두 참이어야 한다면 `&&`를 써야 합니다.'],
  '2-5': ['재시도 조건', '오류가 있고 시도 횟수가 3보다 작을 때만 다시 시도하려면 어떤 조건이 맞나요?', ['`hasError || attempts < 3`', '`hasError && attempts <= 3`', '`hasError && attempts < 3`'], 2, 'const hasError = true;\nconst attempts = 2;\nconst canRetry = hasError && attempts < 3;\nconsole.log(canRetry);', ['true'], ['const hasError = true;', 'const attempts = 3;', 'const canRetry = hasError && attempts <= 3;', 'console.log(canRetry);'], 3, '3번 줄의 `<= 3`은 이미 시도 횟수가 3회인 경우도 허용합니다. 요구사항은 3회 미만이므로 `< 3`이어야 합니다.'],
  '3-1': ['반복 범위', '길이가 3인 배열의 모든 인덱스를 읽으려면 종료 조건은?', ['`index < items.length`', '`index <= items.length`', '`index > items.length`'], 0, 'const items = ["Java", "Python", "JavaScript"];\nconst indexes = [];\nfor (let index = 0; index < items.length; index += 1) indexes.push(index);\nconsole.log(indexes.join(","));', ['0,1,2'], ['const items = ["Java", "Python", "JavaScript"];', 'for (let index = 0; index <= items.length; index += 1) {', '  console.log(items[index]);', '}'], 2, '2번 줄의 `<=`는 index가 배열 길이와 같을 때도 반복합니다. 유효한 마지막 인덱스는 length - 1이므로 `< items.length`를 써야 합니다.'],
  '3-2': ['배열 값 순회', '인덱스가 아니라 배열 원소 자체를 차례대로 읽을 때 적합한 반복문은?', ['`for...in`', '`for...of`', '`if...else`'], 1, 'let total = 0;\nfor (const score of [2, 4]) total += score;\nconsole.log(total);', ['6'], ['const scores = [2, 4];', 'let total = 0;', 'for (const index in scores) {', '  total += index;', '}', 'console.log(total);'], 3, '`for...in`은 배열 원소가 아니라 열거 가능한 속성 이름(배열에서는 인덱스 문자열)을 순회합니다. 값이 필요하면 `for...of`를 사용하세요.'],
  '3-3': ['누적값 유지', '반복하면서 이전 합계에 현재 값을 더할 때 초기화는 어디에서 해야 하나요?', ['반복문 안에서 매번 `total = 0`', '반복문 전에 `let total = 0`', '마지막에 `const total = 0`'], 1, 'let total = 0;\nfor (const value of [1, 2, 3]) total += value;\nconsole.log(total);', ['6'], ['let total = 0;', 'for (const value of [1, 2, 3]) {', '  total = 0;', '  total += value;', '}', 'console.log(total);'], 3, '3번 줄에서 합계를 매 반복마다 초기화해 앞의 누적값을 지웁니다. 반복문 전에 한 번만 0으로 초기화해야 합니다.'],
  '3-4': ['반복 종료', '길이가 2인 배열에서 index가 2라면 읽을 다음 항목이 남았나요?', ['`index < items.length`는 false', '`index <= items.length`는 true', '`index === items.length`는 true'], 0, 'const items = ["JavaScript", "React"];\nconst index = 1;\nconst nextIndex = 2;\nconsole.log(index < items.length, nextIndex < items.length);', ['true false'], ['const items = ["JavaScript", "React"];', 'for (let index = 0; index <= items.length; index += 1) {', '  console.log(items[index]);', '}'], 2, '2번 줄의 `<=`는 index가 배열 길이와 같을 때도 반복해 범위를 벗어난 항목까지 읽으려 합니다. 유효한 동안만 반복하려면 `< items.length`를 사용하세요.'],
  '3-5': ['빈 배열의 합계', '점수 배열이 비어 있을 때 합계도 0이 되게 하려면 무엇이 필요한가요?', ['합계의 시작값을 `0`으로 정한다', '합계의 시작값을 `undefined`로 둔다', '빈 배열에 점수 `1`을 추가한다'], 0, 'const scores = [2, 4, 6];\nlet total = 0;\nfor (const score of scores) total += score;\nconst emptyScores = [];\nlet emptyTotal = 0;\nfor (const score of emptyScores) emptyTotal += score;\nconsole.log(total, emptyTotal);', ['12 0'], ['const scores = [];', 'let total;', 'for (const score of scores) total += score;', 'console.log(total);'], 2, '2번 줄에서 total이 undefined로 시작해 숫자를 더하면 NaN이 됩니다. 점수가 없을 때도 0을 남기려면 누적값을 먼저 0으로 초기화하세요.'],
  '4-1': ['매개변수 전달', 'greet("민")을 호출했을 때 함수 안에서 "민" 값을 받는 이름은?', ['`name`', '`greet`', '`console`'], 0, 'function greet(name) {\n  return `안녕, ${name}`;\n}\nconsole.log(greet("민"));', ['안녕, 민'], ['function greet(name) {', '  return `안녕, ${greet}`;', '}', 'console.log(greet("민"));'], 2, '2번 줄은 매개변수 name이 아니라 함수 이름 greet를 문자열에 넣습니다. 전달된 이름을 사용하려면 `${name}`을 써야 합니다.'],
  '4-2': ['반환값', '호출한 쪽에서 double(4)의 결과를 사용할 수 있게 하려면 어떤 문장이 필요한가요?', ['`value * 2;`', '`return value * 2;`', '`console.log(value * 2);`'], 1, 'function double(value) {\n  return value * 2;\n}\nconsole.log(double(4));', ['8'], ['function double(value) {', '  value * 2;', '  return value;', '}', 'console.log(double(4));'], 2, '2번 줄은 계산만 하고 값을 반환하지 않습니다. `return value * 2;`로 계산 결과를 호출자에게 돌려줘야 합니다.'],
  '4-3': ['기본 인자', 'name을 생략한 greet()에서 기본 이름을 사용하려면 어디에 값을 지정해야 하나요?', ['함수 매개변수 선언의 `name = "학습자"`', '함수 이름을 `greet = "학습자"`로 바꾸기', '호출 뒤에 `return "학습자"`를 실행하기'], 0, 'function greet(name = "학습자") {\n  return `안녕, ${name}`;\n}\nconsole.log(greet());', ['안녕, 학습자'], ['function greet(name) {', '  name = "학습자";', '  return `안녕, ${name}`;', '}', 'console.log(greet("민"));'], 2, '2번 줄은 사용자가 전달한 이름도 덮어씁니다. 기본값은 매개변수 선언에 지정해야 인자를 생략했을 때만 적용됩니다.'],
  '4-4': ['기본 인자 경계', '기본값이 "학습자"인 인사 함수에서 greet(), greet(undefined), greet(null)의 결과를 비교할 때 옳은 설명은?', ['앞의 두 호출에만 기본값이 적용된다', '세 호출 모두 기본값이 적용된다', '세 호출 모두 기본값을 사용하지 않는다'], 0, 'function greet(name = "학습자") {\n  return `안녕, ${name}`;\n}\nconsole.log(greet() === greet(undefined), greet(null));', ['true 안녕, null'], ['function greet(name = "학습자") {', '  return `안녕, ${name || "학습자"}`;', '}', 'console.log(greet(null));'], 2, '2번 줄의 `||`는 명시적으로 전달된 null도 기본 이름으로 바꿉니다. 기본 매개변수는 인자가 생략되거나 undefined일 때만 기본값을 적용하므로 이 대체 처리를 제거해야 합니다.'],
  '4-5': ['작은 함수 설계', '제목과 수준을 "JS (기초)"처럼 묶어 반환하는 식은?', ['`title + level`', '`${title} (${level})`', '`console.log(title, level)`'], 1, 'function courseLabel(title, level) {\n  return `${title} (${level})`;\n}\nconsole.log(courseLabel("JS", "기초"));', ['JS (기초)'], ['function courseLabel(title, level) {', '  return `${title} (${level})`;', '}', 'console.log(courseLabel("JS", "기초"));'], 2, '2번 줄은 두 입력을 한 문자열로 결합하지만 함수에서 결과를 반환하지 않습니다. 계산 결과를 호출자가 쓰도록 return을 붙이세요.'],
  '5-1': ['배열 인덱스', '길이가 3인 items 배열의 마지막 항목을 읽는 인덱스는?', ['`items.length`', '`items.length - 1`', '`items.length + 1`'], 1, 'const items = ["JS", "React", "Python"];\nconsole.log(items[items.length - 1]);', ['Python'], ['const items = ["JS", "React", "Python"];', 'console.log(items[items.length]);'], 2, '2번 줄의 인덱스는 배열 길이와 같아 범위를 벗어납니다. 마지막 유효 인덱스는 `items.length - 1`입니다.'],
  '5-2': ['배열에 항목 추가', '기존 courses를 유지하면서 "React"가 추가된 새 배열을 만드는 방법은?', ['`const next = [...courses, "React"]`', '`const next = courses.push("React")`', '`courses[1] = "React"`'], 0, 'const courses = ["JS"];\nconst next = [...courses, "React"];\nconsole.log(next.join(","));', ['JS,React'], ['const courses = ["JS"];', 'const next = courses.push("React");', 'console.log(next.join(","));'], 2, '2번 줄의 push는 원본을 바꾸고 새 배열 대신 새 길이 숫자를 반환합니다. 원본을 유지한 새 배열이 필요하면 전개 문법을 사용하세요.'],
  '5-3': ['배열 필터링', 'scores에서 60점 이상인 점수만 남기는 메서드는?', ['`map`', '`filter`', '`forEach`'], 1, 'const scores = [55, 60, 90];\nconst passed = scores.filter((score) => score >= 60);\nconsole.log(passed.join(","));', ['60,90'], ['const scores = [55, 60, 90];', 'const passed = scores.filter((score) => score > 60);', 'console.log(passed.join(","));'], 2, '2번 줄의 >는 경계값 60을 제외합니다. 60점 이상에는 60도 포함되므로 >=를 사용해야 합니다.'],
  '5-4': ['복사와 원본', '원본 names 순서를 보존하며 정렬한 새 배열을 반환하는 방법은?', ['`return names.sort()`', '`return [...names].sort()`', '`return names.reverse()`'], 1, 'function sortedCopy(names) {\n  return [...names].sort();\n}\n\nconst names = ["b", "a"];\nconsole.log(sortedCopy(names).join(","), names.join(","));', ['a,b b,a'], ['function sortedCopy(names) {', '  return names.sort();', '}', 'const names = ["b", "a"];', 'console.log(sortedCopy(names).join(","), names.join(","));'], 2, '2번 줄의 sort는 names 원본을 바꿉니다. 복사본 `[...names]`을 정렬해야 원래 순서가 유지됩니다.'],
  '5-5': ['배열 경계값', '빈 배열이면 null, 그 외에는 마지막 항목을 반환하는 방법은?', ['`items[items.length]`', '`items.length === 0 ? null : items[items.length - 1]`', '`items[0]`'], 1, 'function lastVisible(items) {\n  return items.length === 0 ? null : items[items.length - 1];\n}\n\nconsole.log(lastVisible(["JS", "React"]), lastVisible([]));', ['React null'], ['function lastVisible(items) {', '  return items[items.length];', '}', 'console.log(lastVisible(["JS", "React"]));'], 2, '2번 줄은 배열에서 벗어난 `items.length` 위치를 읽어 undefined를 돌려줍니다. 빈 배열과 마지막 유효 인덱스를 각각 처리해야 합니다.'],
  '6-1': ['객체 속성 읽기', 'profile에서 name 속성의 값을 읽는 표현은?', ['`profile.name`', '`profile->name`', '`name.profile`'], 0, 'const profile = { name: "민" };\nconsole.log(profile.name);', ['민'], ['const profile = { name: "민" };', 'console.log(profile.title);'], 2, '2번 줄은 profile에 없는 title 속성을 읽어 undefined를 출력합니다. 이 객체에서 name 값을 읽으려면 `profile.name`을 사용해야 합니다.'],
  '6-2': ['선택적 속성', 'profile에 bio가 없을 수도 있을 때 오류 없이 글자 수를 읽고 기본 문구를 보여 주려면?', ['`profile.bio.length || "소개 없음"`', '`profile.bio?.length || "소개 없음"`', '`profile?.bio.length || "소개 없음"`'], 1, 'const profile = {};\nconsole.log(profile.bio?.length || "소개 없음");', ['소개 없음'], ['const profile = {};', 'console.log(profile.bio.length || "소개 없음");'], 2, '2번 줄은 bio가 없으면 `.length`에 접근하기 전에 undefined에서 멈춰 오류가 납니다. bio 속성에 `?.`를 붙이면 접근을 건너뛰고, 이미 배운 `||`가 기본 문구를 선택합니다.'],
  '6-3': ['객체 펼치기', 'profile의 모든 속성을 보존하고 level만 2로 바꾼 새 객체는?', ['`{ ...profile, level: 2 }`', '`{ level: 2 }`', '`profile.level = 2`'], 0, 'const profile = { name: "민", level: 1 };\nconst next = { ...profile, level: 2 };\nconsole.log(next.name, next.level);', ['민 2'], ['const profile = { name: "민", level: 1 };', 'const next = { level: 2 };', 'console.log(next.name, next.level);'], 2, '2번 줄은 name 속성을 복사하지 않아 next.name이 undefined가 됩니다. 기존 필드를 보존하면서 level만 바꾸려면 `{ ...profile, level: 2 }`를 반환해야 합니다.'],
  '6-4': ['객체 속성 조합', 'course의 제목과 분을 "Python: 30분" 문자열로 반환하는 방법은?', ['`course.title + course.minutes`', '`${course.title}: ${course.minutes}분`', '`course.minutes + "분"`'], 1, 'function courseSummary(course) {\n  return `${course.title}: ${course.minutes}분`;\n}\n\nconsole.log(courseSummary({ title: "Python", minutes: 30 }));', ['Python: 30분'], ['function courseSummary(course) {', '  return course.title + course.minutes;', '}', 'console.log(courseSummary({ title: "Python", minutes: 30 }));'], 2, '2번 줄은 제목과 분 숫자만 이어 붙여 `Python30`을 만듭니다. 반환 문자열에 콜론·공백과 `분` 단위가 들어가도록 고쳐야 합니다.'],
  '6-5': ['데이터 모양 설계', '기존 profile을 바꾸지 않고 다른 필드를 보존하며 level만 갱신하려면?', ['`profile.level = level; return profile;`', '`return { ...profile, level };`', '`return { level };`'], 1, 'function updateLevel(profile, level) {\n  return { ...profile, level };\n}\n\nconst profile = { name: "민", level: 1 };\nconst next = updateLevel(profile, 2);\nconsole.log(profile.level, next.level, next.name);', ['1 2 민'], ['function updateLevel(profile, level) {', '  profile.level = level;', '  return profile;', '}', 'const profile = { name: "민", level: 1 };'], 2, '전개 문법으로 새 객체를 만들면 원래 profile의 다른 속성을 보존하면서 입력 객체를 바꾸지 않을 수 있습니다.'],
  '7-1': ['블록 범위와 이름 가리기', '안쪽 블록의 label을 출력한 다음 바깥 label을 출력하면 어떤 순서인가요?', ['`안쪽 바깥`', '`바깥 안쪽`', 'ReferenceError'], 0, 'const label = "바깥";\n{\n  const label = "안쪽";\n  console.log(label);\n}\nconsole.log(label);', ['안쪽\n바깥'], ['if (true) {', '  const bonus = 3;', '}', 'console.log(bonus);'], 4, '4번 줄은 if 블록 안에서 선언된 bonus를 바깥에서 읽습니다. 이 코드에는 바깥 bonus가 없으므로 ReferenceError가 발생합니다.'],
  '7-2': ['함수 지역 변수', '함수 안에서 만든 label을 호출한 쪽에서 사용하려면 어떤 동작이 필요한가요?', ['함수에서 값을 반환하고 호출 결과를 받는다', '지역 변수는 자동으로 전역 이름이 된다', '호출 뒤 같은 이름을 바로 읽는다'], 0, 'function createLabel() {\n  const label = "함수 안";\n  return label;\n}\n\nconst result = createLabel();\nconsole.log(result);', ['함수 안'], ['function createLabel() {', '  const label = "함수 안";', '}', 'console.log(label);'], 4, '4번 줄은 함수가 끝난 뒤 함수 지역 변수 label을 직접 읽습니다. 호출자가 써야 할 값은 return하고 호출 결과를 다른 이름에 담아야 합니다.'],
  '7-3': ['클로저의 독립 상태', '각 counter가 자기 count를 유지하고 첫 번째 counter를 두 번, 두 번째 counter를 한 번 호출하면 출력은?', ['`1 2 1`', '`1 1 1`', '`0 1 2`'], 0, 'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst first = makeCounter();\nconst second = makeCounter();\nconsole.log(first(), first(), second());', ['1 2 1'], ['function makeCounter() {', '  let count = 0;', '  return () => count++;', '}', 'const first = makeCounter();', 'console.log(first());'], 3, '3번 줄의 count++는 증가하기 전 값을 반환하므로 첫 호출이 0입니다. 먼저 증가한 뒤 반환하려면 ++count를 사용하세요.'],
  '7-4': ['클로저 반환값', 'makeCounter가 반환한 함수는 바깥 함수가 끝난 뒤 count를 어떻게 다루나요?', ['기억한 count를 호출할 때마다 갱신한다', '함수가 끝나면 count를 읽을 수 없다', '모든 counter가 전역 count 하나를 공유한다'], 0, 'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nconsole.log(next(), next());', ['1 2'], ['function makeCounter() {', '  let count = 0;', '  return () => count + 1;', '}', 'const next = makeCounter();', 'console.log(next(), next());'], 3, '3번 줄은 count를 읽어 1을 더하지만 count 자체를 갱신하지 않아 매번 1을 반환합니다. 상태가 바뀌어야 하면 ++count를 사용하세요.'],
  '7-5': ['비공개 상태를 가진 counter', 'count를 바깥에서 직접 바꾸지 못하게 하고 next 호출로만 늘리려면 무엇을 반환하나요?', ['count를 닫아 둔 함수들', 'count를 전역 변수로 선언', 'count 숫자만 한 번 반환'], 0, 'function makeCounter() {\n  let count = 0;\n  return { next: () => ++count, read: () => count };\n}\nconst counter = makeCounter();\nconsole.log(counter.next(), counter.read(), counter.next());', ['1 1 2'], ['function makeCounter() {', '  let count = 0;', '  return { next: () => count++, read: () => count };', '}', 'const counter = makeCounter();', 'console.log(counter.next(), counter.read(), counter.next());'], 3, '3번 줄의 후위 증가 연산자는 증가하기 전 값을 반환합니다. 첫 next()가 1을 반환해야 한다면 먼저 증가하는 ++count를 사용하세요.'],
  '8-1': ['named export 공개', '모듈이 named export `toTitle`을 제공할 때, 해당 함수를 가져와 호출하는 올바른 방법은?', ['named import로 가져와 함수를 호출한다', '중괄호 없는 import를 쓰지만 default export는 없다', 'import 대신 export를 호출한다'], 0, javascriptNamedExportExample, ['JS'], ['// format.mjs', 'function toTitle(text) { return text.toUpperCase(); }', 'export { formatTitle };'], 3, '3번 줄은 정의하지 않은 formatTitle을 내보내려 합니다. 이 파일에서 실제로 선언한 toTitle을 공개해야 합니다.'],
  '8-2': ['named import 별칭', 'named export `formatTitle`을 현재 파일에서 `toTitle`이라는 이름으로 쓰는 구문은?', ['`import { formatTitle as toTitle } ...`', '`import toTitle ...`', '`import [formatTitle as toTitle] ...`'], 0, javascriptNamedImportAliasExample, ['JS'], ['// format.mjs', 'export const formatTitle = (text) => text.toUpperCase();', '', '// main.mjs', 'import toTitle from "./format.mjs";', 'console.log(toTitle("js"));'], 5, '5번 줄은 default export를 가져오지만 format.mjs는 named export formatTitle만 제공합니다. `{ formatTitle as toTitle }`로 공개 이름과 사용할 별칭을 함께 적으세요.'],
  '8-3': ['필수 입력 오류', 'title이 문자열이 아니거나 공백뿐이면 호출자에게 알려주고, 정상 값은 양끝 공백을 제거해 반환하려면?', ['입력을 확인하고 조건에 맞지 않으면 Error를 던진다', '모든 입력을 그대로 성공 반환한다', 'catch에서 어떤 실패든 빈 문자열로 숨긴다'], 0, 'function requireTitle(title) {\n  if (typeof title !== "string" || title.trim() === "") throw new Error("title is required");\n  return title.trim();\n}\ntry {\n  console.log(requireTitle("   "));\n} catch (error) {\n  console.log(error.message);\n}', ['title is required'], ['function requireTitle(title) {', '  if (!title) throw new Error("title is required");', '  return title.trim();', '}', 'try { requireTitle("   "); } catch (error) { console.log(error.message); }'], 2, '2번 줄의 `if (!title)`은 빈 문자열은 거르지만 공백 문자열은 truthy라 통과시킵니다. trim한 결과가 비었는지도 검사해야 호출자에게 필수 입력 오류를 정확히 알릴 수 있습니다.'],
  '8-4': ['숫자 문자열 파싱', '"12"와 "12.0"은 정수 12로, "2.5"와 공백 입력은 null로 처리하는 함수의 결과는?', ['`12 12 null null`', '`12 12.0 2.5 0`', '`12 NaN null null`'], 0, 'function parseAttempt(raw) {\n  if (typeof raw !== "string" || raw.trim() === "") return null;\n  const value = Number(raw);\n  return Number.isInteger(value) ? value : null;\n}\nconsole.log(parseAttempt("12"), parseAttempt("12.0"), parseAttempt("2.5"), parseAttempt(" "));', ['12 12 null null'], ['function parseAttempt(raw) {', '  const value = Number(raw);', '  return Number.isInteger(value) ? value : null;', '}', 'console.log(parseAttempt(" "));'], 2, '2번 줄의 `Number(raw)`는 공백 문자열을 0으로 변환합니다. 뒤의 정수 검사는 이 0을 통과시키므로 변환 전에 문자열이 비었는지 거르는 조건이 필요합니다.'],
  '8-5': ['입력 검증 회귀 사례', '문자열 제목을 검사할 때 정상·공백·비문자 입력의 기대 결과 조합은?', ['`true false false`', '`true true false`', '`false false true`'], 0, 'function isUsableTitle(title) {\n  return typeof title === "string" && title.trim().length > 0;\n}\nconsole.log(isUsableTitle("React"), isUsableTitle("   "), isUsableTitle(null));', ['true false false'], ['function isUsableTitle(title) {', '  return typeof title === "string";', '}', 'console.log(isUsableTitle("React"), isUsableTitle("   "), isUsableTitle(null));'], 2, '문자열 타입인지 검사해도 공백뿐인 문자열은 여전히 true가 됩니다. trim 후 길이도 확인해야 합니다.'],
  '9-1': ['submit 기본 동작 막기', 'submit 처리기에서 검증과 저장을 직접 할 때 폼의 기본 제출을 막는 메서드는?', ['`event.preventDefault()`', '`event.stopPropagation()`만', '`form.reset()`'], 0, 'let defaultPrevented = false;\nconst event = { preventDefault() { defaultPrevented = true; } };\nevent.preventDefault();\nconsole.log(defaultPrevented);', ['true'], ['let defaultPrevented = false;', 'const event = { preventDefault() { defaultPrevented = true; } };', 'event.preventDefault;', 'console.log(defaultPrevented);'], 3, '3번 줄은 메서드 참조만 가져오고 호출하지 않습니다. 기본 동작을 취소하려면 실제 이벤트에서 preventDefault()를 호출해야 합니다.'],
  '9-2': ['정규화한 입력 검증', '입력 "  React  "는 "React"로 저장하고 공백 입력은 거부할 때 필요한 순서는?', ['trim 결과를 변수에 저장하고, 비었는지 확인한 뒤 같은 값을 저장한다', '원본을 저장하고 저장 뒤 화면에서 trim한다', '원본이 truthy인지 검사한 뒤 그대로 저장한다'], 0, 'function normalizeTitle(raw) {\n  const title = raw.trim();\n  return title.length > 0 ? title : null;\n}\nconsole.log(normalizeTitle("  React  "), normalizeTitle("   "));', ['React null'], ['const value = input.value;', 'if (!value.trim()) return;', 'save(value);'], 3, '3번 줄은 검사에 쓴 trim 결과가 아니라 원본 value를 저장합니다. 정규화 값을 한 번 보관하고 공백 확인과 저장에 같은 변수를 사용하세요.'],
  '9-3': ['사용자 문자열 표시', '사용자가 입력한 `<b>안녕</b>`를 HTML로 해석하지 않고 그대로 표시하는 DOM 속성은?', ['`textContent`', '`innerHTML`', '`outerHTML`'], 0, 'const preview = { textContent: "" };\npreview.textContent = "<b>안녕</b>";\nconsole.log(preview.textContent);', ['<b>안녕</b>'], ['function showMessage(element, message) {', '  element.innerHTML = message;', '}'], 2, '2번 줄의 innerHTML은 문자열을 마크업으로 해석합니다. 텍스트만 표시할 때는 textContent를 사용하세요. 이 작은 모형은 브라우저의 HTML 파서나 보안 동작 자체를 실행하지 않습니다.'],
  '9-4': ['입력 요소에서 제목 읽기', 'input.value의 앞뒤 공백을 제거하고 빈 제목은 null로 거부하는 결과 함수는?', ['trim한 값이 비면 null, 아니면 trim한 문자열을 반환한다', '원본 문자열을 항상 반환한다', '빈 문자열을 공백으로 채워 반환한다'], 0, 'function readTitle(input) {\n  const title = input.value.trim();\n  return title.length > 0 ? title : null;\n}\nconsole.log(readTitle({ value: " React " }), readTitle({ value: " " }));', ['React null'], ['function readTitle(input) {', '  const title = input.value.trim();', '  if (title.length === 0) return null;', '  return input.value;', '}'], 4, '4번 줄은 trim한 title 대신 원본 input.value를 반환해 앞뒤 공백을 남깁니다. 빈 값 검사를 통과한 뒤에는 정리된 title을 반환해야 합니다. 실제 submit 처리기에서는 별도로 기본 동작을 취소해야 합니다.'],
  '9-5': ['안전한 피드백 통합', '오류 문구 `"<b>제목을 입력하세요</b>"`를 태그가 아닌 글자로 표시하려면 어떤 갱신이 맞나요?', ['`element.textContent = message`', '`element.innerHTML = message`', '`element.outerHTML = message`'], 0, 'const preview = { textContent: "" };\nconst message = "<b>제목을 입력하세요</b>";\npreview.textContent = message;\nconsole.log(preview.textContent);', ['<b>제목을 입력하세요</b>'], ['function showMessage(element, message) {', '  element.innerHTML = message;', '}'], 2, 'textContent는 문자열을 일반 텍스트 값으로 둡니다. 실제 브라우저 DOM에서 실행하면 태그 문자열을 요소로 생성하지 않습니다.'],
  '10-1': ['JSON 본문 기다리기', '`response.json()`으로 받은 값을 곧바로 사용하려면 async 함수에서 어떤 처리가 필요한가요?', ['`await response.json()`으로 파싱 결과를 기다린다', '`JSON.stringify(response.json())`로 Promise를 문자열로 바꾼다', '`Promise.resolve`만 호출하고 결과를 읽는다'], 0, 'async function readTitle(response) {\n  const data = await response.json();\n  return data.title;\n}\nconst response = { json: async () => ({ title: "React" }) };\nconsole.log(await readTitle(response));', ['React'], ['async function readTitle(response) {', '  const data = response.json();', '  return data.title;', '}'], 2, '2번 줄은 파싱 결과가 아니라 Promise를 data에 저장합니다. await로 이행된 값을 받은 다음 title을 읽어야 합니다.'],
  '10-2': ['HTTP 상태 확인', '응답이 404나 500일 때도 성공 처리하지 않도록 확인할 속성은?', ['`response.ok`', '`response.status === 200`만', '`fetch.ok`'], 0, 'const response = { ok: false, status: 404 };\nconsole.log(response.ok, response.status);', ['false 404'], ['async function load(response) {', '  const data = await response.json();', '  if (!response.ok) return data;', '  return data;', '}'], 3, '3번 줄은 HTTP 오류 응답을 정상 데이터처럼 반환합니다. 성공 응답만 처리하려면 response.ok가 false일 때 오류 흐름으로 보내야 합니다.'],
  '10-3': ['요청 실패 전달', '네트워크 요청이 거부되었을 때 호출자가 실패를 알아차릴 수 있는 흐름은?', ['오류를 다시 던지거나 구분 가능한 실패 결과를 반환한다', 'catch에서 항상 빈 객체를 성공 결과로 반환한다', '실패 이유와 관계없이 아무 값 없이 종료한다'], 0, 'async function load(fetcher) {\n  try {\n    await fetcher();\n    return "loaded";\n  } catch (error) {\n    return `network: ${error.message}`;\n  }\n}\nconst offline = () => Promise.reject(new Error("offline"));\nconsole.log(await load(offline));', ['network: offline'], ['async function load(fetcher) {', '  try { return await fetcher(); }', '  catch (error) { return {}; }', '}'], 3, '3번 줄은 실패를 빈 객체로 바꾸어 정상 성공과 구분하기 어렵게 만듭니다. 오류를 다시 전달하거나 명시적인 오류 결과로 바꾸세요.'],
  '10-4': ['JSON 파싱 결과', '`Response.json()`의 반환값과 이행 후 결과를 올바르게 설명한 것은?', ['파싱된 JavaScript 값으로 이행되는 Promise를 반환한다', '항상 JSON 원문 문자열을 즉시 반환한다', '응답 상태가 200일 때만 JSON 본문을 반환한다'], 0, 'async function readJson(response) {\n  return response.json();\n}\nconst response = { json: async () => ({ count: 2 }) };\nconsole.log((await readJson(response)).count);', ['2'], ['function readJson(response) {', '  return response.json;', '}'], 2, '2번 줄은 json 메서드를 호출하지 않고 함수 자체만 반환합니다. `response.json()`을 호출하면 본문을 파싱하는 Promise를 얻습니다.'],
  '10-5': ['요청 취소 신호 전달', 'AbortController로 요청을 취소하려면 fetch 옵션에 무엇을 전달해야 하나요?', ['`{ signal: controller.signal }`', '`{ abort: controller }`', '`controller.abort()`를 fetch의 첫 인자로 전달'], 0, 'function requestWithSignal(url, controller) {\n  return fetch(url, { signal: controller.signal });\n}\nconst controller = new AbortController();\nlet sentSignal;\nconst fetch = (url, options) => { sentSignal = options.signal; return url; };\nconst request = requestWithSignal("/courses", controller);\ncontroller.abort();\nconsole.log(request, sentSignal === controller.signal, sentSignal.aborted);', ['/courses true true'], ['function requestWithSignal(url, controller) {', '  return fetch(url);', '}'], 2, '3번 줄은 signal을 요청 옵션에 전달하지 않습니다. 해당 controller.signal을 fetch 두 번째 인자에 전달해야 abort()가 그 요청의 signal을 취소 상태로 바꿀 수 있습니다.'],
  '11-1': ['호출 스택 순서', '동기 함수 호출이 끝나기 전에 예약한 Promise 콜백은 언제 실행되나요?', ['현재 동기 호출 흐름이 끝난 뒤 microtask로 실행된다', '함수 호출 도중 즉시 끼어들어 실행된다', '다음 timer 콜백보다 항상 나중에 실행된다'], 0, 'const order = ["before"];\nfunction work() { order.push("inside"); }\nwork();\norder.push("after");\nPromise.resolve().then(() => { order.push("promise"); console.log(order.join(", ")); });', ['before, inside, after, promise'], ['const order = ["before"];', 'Promise.resolve().then(() => order.push("promise"));', 'order.push("after");', 'console.log(order.join(", "));'], 4, '4번 줄은 Promise 콜백보다 먼저 동기적으로 실행되어 출력에 promise가 포함되지 않습니다. microtask가 처리된 뒤 값을 출력해야 합니다.'],
  '11-2': ['timer 작업 예약', '`setTimeout(runTask, 0)`의 의미로 맞는 것은?', ['현재 호출이 끝난 뒤 가능한 시점에 함수 호출을 예약한다', '`runTask()`를 현재 줄에서 바로 실행한다', '정확히 0밀리초 뒤 실행을 보장한다'], 0, 'const order = [];\nsetTimeout(() => order.push("timer"), 0);\norder.push("sync");\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", "));', ['sync, timer'], ['function runTask() { console.log("task"); }', 'setTimeout(runTask(), 0);'], 2, '2번 줄은 runTask를 즉시 호출하고 그 반환값을 타이머에 전달합니다. 함수 참조인 runTask를 넘겨야 예약된 시점에 실행됩니다.'],
  '11-3': ['microtask 먼저 처리', '현재 동기 작업이 끝난 뒤 일반 timer task보다 먼저 처리되는 작업은?', ['Promise.then 또는 queueMicrotask 콜백', '다음 setTimeout 콜백', '새 스크립트의 동기 문장'], 0, 'const order = ["sync"];\nPromise.resolve().then(() => order.push("promise"));\nqueueMicrotask(() => order.push("queued"));\nsetTimeout(() => order.push("timer"), 0);\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", "));', ['sync, promise, queued, timer'], ['const log = (message) => console.log(message);', 'Promise.resolve().then(log("microtask"));', 'console.log("sync");'], 2, '2번 줄은 log를 즉시 호출해 `microtask`를 먼저 출력하고, 그 반환값인 undefined를 then에 전달합니다. 콜백을 예약하려면 `() => log("microtask")`처럼 함수를 전달해야 합니다.'],
  '11-4': ['화면 갱신 예약', '다음 화면 갱신 전에 시각적 변경을 예약할 때 브라우저 API로 알맞은 것은?', ['`requestAnimationFrame(update)`', '`queueMicrotask(update)`', '`setInterval(update, 0)`'], 0, 'function scheduleRender(update, requestFrame) {\n  return requestFrame(() => update("ready"));\n}\nconst pending = [];\nscheduleRender((value) => console.log(value), (callback) => { pending.push(callback); return pending.length; });\nconsole.log(pending.length);\npending[0]();', ['1', 'ready'], ['button.addEventListener("click", () => {', '  status.textContent = "시작";', '  while (workRemains()) doSmallWork();', '  status.textContent = "완료";', '});'], 3, '3번 줄은 click 처리기 안에서 끝날 때까지 동기 반복을 실행해 브라우저가 그 프레임을 그릴 수 없게 합니다. 시각 갱신은 requestAnimationFrame으로 예약하되, 긴 계산은 작은 조각으로 나눠 다음 task에 넘겨야 합니다. requestAnimationFrame만으로 긴 계산이 자동 분할되지는 않습니다.'],
  '11-5': ['긴 작업 나누기', '작업 일부를 끝낸 뒤 브라우저가 다른 task와 렌더링을 처리할 기회를 주려면 어떤 방식이 적절한가요?', ['작업을 작은 단위로 나누고 다음 조각을 timer task로 예약한다', '긴 반복문을 한 번의 동기 호출에서 끝낸다', '매 조각을 queueMicrotask로 계속 연결한다'], 0, 'const order = [];\nsetTimeout(() => order.push("chunk"), 0);\norder.push("yield");\nawait new Promise((resolve) => setTimeout(resolve, 5));\nconsole.log(order.join(", "));', ['yield, chunk'], ['function scheduleChunk(work, scheduleTask) {', '  work();', '}'], 2, '3번 줄은 작업을 바로 동기 실행해 양보 기회를 만들지 않습니다. 작은 작업을 다음 task로 예약해 브라우저가 다른 일을 처리할 수 있게 하세요. queueMicrotask를 계속 연결하면 task나 렌더링으로 양보하지 못할 수 있습니다.'],
};


const focusedFoundationErrorVariants = {
  '1-4': [focusedFoundationDailyCases['1-4'][6], 2, focusedFoundationDailyCases['1-4'][8]],
  '2-3': [focusedFoundationDailyCases['2-3'][6], 2, focusedFoundationDailyCases['2-3'][8]],
  '2-4': [focusedFoundationDailyCases['2-4'][6], 3, focusedFoundationDailyCases['2-4'][8]],
  '3-4': [focusedFoundationDailyCases['3-4'][6], 2, focusedFoundationDailyCases['3-4'][8]],
  ...Object.fromEntries(Array.from({ length: 25 }, (_, index) => {
    const week = 7 + Math.floor(index / 5);
    const day = (index % 5) + 1;
    const dayKey = `${week}-${day}`;
    const dailyCase = focusedFoundationDailyCases[dayKey];
    return [dayKey, [dailyCase[6], dailyCase[7], dailyCase[8]]];
  })),
};

const focusedFoundationChoiceFeedback = {
  '1-1': ['minutes에는 숫자 30이 들어 있습니다. `typeof minutes`의 결과는 자료형 이름을 담은 문자열 "number"입니다.', '`"minutes"`는 변수 minutes가 아니라 글자 minutes입니다. 따라서 자료형은 string입니다.', '`"30"`은 따옴표로 감싼 글자라서 숫자가 아닌 string 자료형입니다.'],
  '1-2': ['const는 다시 대입할 수 없어 completed를 늘릴 수 없습니다.', 'let은 선언한 블록 안에서 새 값을 대입할 수 있어 횟수처럼 변하는 값에 알맞습니다.', 'completed를 선언하지 않고 대입하면 먼저 읽는 순간 ReferenceError가 발생합니다.'],
  '1-3': ['대입은 기존 total을 새 값으로 바꿉니다. 더하려면 `+=`를 사용하세요.', '`+=`는 기존 total에 score를 더해 기존 값과 새 값을 함께 반영합니다.', '`===`는 비교 결과만 만들고 total을 바꾸지 않습니다.'],
  '1-4': ['문자열 뒤에 변수 name을 이어 붙이면 그 변수에 담긴 값이 들어갑니다.', '일반 따옴표 안의 `${name}`은 값으로 바뀌지 않고 글자 그대로 남습니다.', '따옴표 안에 쓴 name은 변수 값이 아니라 글자 name입니다.'],
  '1-5': ['이 식은 새 숫자를 계산하지만 변수에 저장하지 않아 기존 값이 그대로입니다.', '기존 값에 1을 더한 결과를 currentAttempt에 대입합니다.', '이미 선언한 이름을 const로 다시 선언할 수 없습니다.'],
  '2-1': ['==는 비교 전에 문자열과 숫자를 변환할 수 있어 두 값이 같다고 판단합니다.', '===는 값과 자료형을 함께 비교하므로 문자열 "3"과 숫자 3은 다릅니다.', '=는 비교가 아니라 값을 변수에 대입하는 연산자입니다.'],
  '2-2': ['OR는 둘 중 하나만 참이어도 참이므로 두 조건이 모두 필요하다는 요구와 다릅니다.', 'AND는 로그인과 약관 동의가 모두 참일 때만 참입니다.', '이 조건은 로그인 상태가 false일 때만 동의 여부를 확인하는 흐름이라 요구를 뒤집습니다.'],
  '2-3': ['`>`는 60을 제외하므로 60점 이상이라는 조건을 충족하지 않습니다.', '`>=`는 60점과 그보다 높은 점수를 모두 통과시킵니다.', '`=`는 score에 값을 대입할 뿐 비교하지 않습니다.'],
  '2-4': ['AND는 두 조건이 모두 참이어야 접근을 허용합니다.', 'OR는 로그인만 되어 있어도 접근을 허용하므로 약관 동의 조건을 빠뜨립니다.', '로그인했지만 동의하지 않은 경우만 참이 되어 요구와 반대입니다.'],
  '2-5': ['OR를 쓰면 시도 횟수만 적어도 재시도 조건이 참이 될 수 있습니다.', '`<= 3`은 이미 3회인 경우까지 허용합니다.', '오류가 있고 시도 횟수가 3보다 작을 때만 재시도할 수 있습니다.'],
  '3-1': ['인덱스는 0부터 시작하며 length보다 작을 때만 배열 안의 항목을 가리킵니다.', '<=는 index가 length인 한 번까지 반복해 존재하지 않는 항목도 읽게 합니다.', 'index가 length보다 커질 때는 첫 반복도 하지 못해 배열을 순회하지 않습니다.'],
  '3-2': ['for...in은 배열의 원소 값이 아니라 속성 키인 인덱스 문자열을 순회합니다.', 'for...of는 배열에서 실제 원소 값을 하나씩 꺼내 합산할 때 알맞습니다.', 'if...else는 조건 분기 문법이지 배열 순회 문법이 아닙니다.'],
  '3-3': ['반복마다 0으로 초기화하면 앞에서 계산한 합계가 사라집니다.', '반복문 앞에서 한 번 초기화하면 각 반복이 기존 합계에 새 값을 더할 수 있습니다.', '반복이 끝난 뒤 const로 다시 선언해도 반복 중 합계 계산에 사용할 수 없습니다.'],
  '3-4': ['index가 length보다 작지 않으므로 배열 끝에 도달했을 때 false가 됩니다.', '<=는 index가 length와 같아도 true가 되어 다음 원소가 남았다고 오판합니다.', '같다는 비교는 끝에 도달했음을 뜻하며 남은 원소가 있다는 뜻이 아닙니다.'],
  '3-5': ['0부터 시작하면 점수가 없을 때도 합계가 0으로 남습니다.', 'undefined에 숫자를 더하면 결과가 NaN이 되어 합계가 되지 않습니다.', '배열에 임의의 점수를 넣으면 빈 입력이라는 조건 자체가 바뀝니다.'],
  '4-1': ['name은 호출 시 전달된 값 "민"을 함수 안에서 가리킵니다.', 'greet는 함수를 실행할 때 사용하며 입력값을 받는 매개변수 이름이 아닙니다.', 'console은 브라우저 콘솔 객체이지 이름 입력값이 아닙니다.'],
  '4-2': ['식만 적으면 값이 호출자에게 반환되지 않습니다.', 'return은 계산 결과를 호출한 쪽으로 돌려줘 double(4)의 값이 8이 됩니다.', 'console.log는 화면에 출력만 하며 함수의 반환값은 undefined로 남습니다.'],
  '4-3': ['매개변수 기본값은 인자가 생략됐을 때 적용됩니다.', 'greet는 함수 이름이며 기본값을 매개변수에 지정하는 자리가 아닙니다.', 'return은 기본값을 선언하는 문법이 아니며 호출 흐름을 나눌 수 없습니다.'],
  '4-4': ['인자 생략과 undefined는 기본값을 사용하지만 null은 명시된 값이므로 그대로 전달됩니다.', 'null은 생략된 인자나 undefined와 같지 않아 기본값을 사용하지 않습니다.', '생략되거나 undefined인 경우에는 매개변수 기본값이 적용됩니다.'],
  '4-5': ['문자열 사이에 구분 기호와 괄호가 없어 제목과 수준을 알아보기 어렵습니다.', '템플릿 리터럴에 제목과 수준을 모두 넣어 요구된 표시 문자열을 만듭니다.', 'console.log는 출력만 하고 함수가 문자열 값을 반환하지 않습니다.'],
  '5-1': ['length와 같은 인덱스는 배열 끝 바로 다음 위치라 undefined를 읽습니다.', '배열은 0부터 인덱스를 세므로 마지막 유효 위치는 length - 1입니다.', 'length보다 큰 인덱스는 배열 범위를 더 벗어납니다.'],
  '5-2': ['전개 문법은 원본을 유지하고 항목이 추가된 새 배열을 만듭니다.', 'push는 원본을 바꾸고 배열이 아니라 새 길이를 반환합니다.', '인덱스에 대입하면 원본 배열의 항목을 덮어씁니다.'],
  '5-3': ['map은 각 원소를 변환해 모든 항목을 유지합니다.', 'filter는 조건이 참인 원소만 새 배열에 남깁니다.', 'forEach는 순회할 뿐 선택된 값의 배열을 반환하지 않습니다.'],
  '5-4': ['sort는 원본 배열을 직접 정렬해 입력 참조의 순서를 바꿉니다.', '전개로 복사한 배열을 정렬하면 새 결과만 정렬되고 원본은 보존됩니다.', 'reverse도 원본 배열을 직접 바꾸므로 요구를 충족하지 않습니다.'],
  '5-5': ['길이만큼의 인덱스는 범위 밖이고 빈 배열도 구분하지 못합니다.', '빈 입력은 null, 그 외에는 마지막 인덱스인 length - 1의 값을 반환합니다.', '첫 항목을 읽으므로 마지막 항목 요구와 다르고 빈 배열도 undefined가 됩니다.'],
  '6-1': ['점 표기법으로 객체의 name 속성을 읽을 수 있습니다.', '화살표 접근은 JavaScript 객체 속성 접근 문법이 아닙니다.', '객체의 속성을 읽는 방향과 주체가 뒤바뀐 표현입니다.'],
  '6-2': ['bio가 없으면 trim 호출 전에 TypeError가 발생합니다.', '선택적 체이닝은 bio가 nullish일 때 뒤의 trim 호출을 건너뜁니다.', 'profile 자체는 존재하지만 그 안의 bio가 없어 안전하지 않습니다.'],
  '6-3': ['전개 문법은 기존 속성을 복사하고 이후 적은 level 값으로 덮어씁니다.', 'name 같은 나머지 속성을 새 객체로 보존하지 않습니다.', '입력 객체 자체를 바꾸므로 새로운 객체를 만들지 않습니다.'],
  '6-4': ['문자열 구분자와 분 단위를 빠뜨리고 제목·숫자만 붙입니다.', '속성 값을 읽어 구분자와 단위를 포함한 문장을 반환합니다.', '제목을 빠뜨리고 분 단위 숫자만 반환합니다.'],
  '6-5': ['기존 객체의 level을 바꾸고 같은 참조를 반환합니다.', '전개 복사본에 level만 덮어써 다른 속성과 원본을 보존합니다.', '새 객체에는 level만 들어 있어 profile의 기존 속성을 잃습니다.'],
  '7-1': ['안쪽 블록에서는 안쪽 label이 보이고, 블록 뒤에는 바깥 label이 다시 보입니다.', '실행 순서는 안쪽 블록의 출력이 먼저이므로 반대가 됩니다.', '바깥 label은 여전히 선언된 상태라 두 번째 출력에서 오류가 나지 않습니다.'],
  '7-2': ['return으로 값을 돌려주고 호출 결과를 변수에 담아야 함수 밖에서 사용할 수 있습니다.', '함수 안의 const 이름은 전역 이름으로 승격되지 않습니다.', '호출 뒤에도 함수 지역 이름은 보이지 않으므로 직접 읽을 수 없습니다.'],
  '7-3': ['첫 counter의 두 호출은 1, 2이고 별도로 만든 counter는 새 count에서 1을 반환합니다.', '두 번째 counter도 별도 상태를 가지므로 첫 counter의 2를 공유하지 않습니다.', '전위 증가가 먼저 상태를 바꾸므로 첫 출력은 0이 아닙니다.'],
  '7-4': ['반환 함수가 count를 기억하고 호출 때마다 그 상태를 갱신합니다.', '클로저는 바깥 함수가 끝난 뒤에도 참조한 렉시컬 환경을 유지합니다.', '각 makeCounter 호출이 별도의 지역 count를 만듭니다.'],
  '7-5': ['함수로 count를 닫아 두면 외부에서 직접 대입하지 않고 정해 둔 동작으로 상태를 바꿀 수 있습니다.', '전역 count는 모든 counter가 함께 쓰므로 독립된 상태를 제공하지 않습니다.', '숫자만 반환하면 이후 호출에서 상태를 이어 갱신할 함수가 없습니다.'],
  '8-1': ['named export는 같은 이름을 중괄호로 가져온 뒤 호출합니다.', 'default export가 없는 모듈에서 default를 구조 분해하면 함수가 나오지 않습니다.', 'export는 다른 모듈이 가져갈 값을 공개하는 선언이며 실행 동작이 아닙니다.'],
  '8-2': ['named import의 `as` 뒤에 현재 파일에서 사용할 별칭을 적습니다.', '중괄호 없는 문법은 default import이며 named export를 직접 지정하지 않습니다.', '배열 괄호는 import 구문의 이름 목록 문법이 아닙니다.'],
  '8-3': ['문자열 타입과 공백 제거 후 비었는지를 확인하고, 실패는 Error로 명시합니다.', '공백 문자열은 truthy이며 값을 정리하지도 않습니다.', '빈 catch는 호출자가 실패를 구분하고 대응할 정보를 잃게 합니다.'],
  '8-4': ['공백을 먼저 거부하고 숫자로 변환한 결과가 정수이면 반환합니다. "12.0"도 숫자 12로 변환되므로 통과합니다.', 'Number("2.5")는 2.5로 변환되며 정수 값이 아니어서 null을 반환합니다. 공백은 Number 변환 전에 거부해야 합니다.', 'Number("2.5")는 NaN이 아니라 2.5입니다. 공백도 변환만 하면 0이 되므로 정수 검사를 그대로 통과할 수 있습니다.'],
  '8-5': ['타입이 문자열이고 trim 후 길이가 양수일 때만 유효합니다.', '공백 문자열은 truthy이므로 공백을 제거한 길이를 확인해야 거부됩니다.', '정상 제목은 유효하고 null은 문자열 검사를 통과하지 못합니다.'],
  '9-1': ['preventDefault()를 실제 이벤트 객체에서 호출해야 기본 제출 동작을 취소합니다.', 'stopPropagation은 전파를 제어하며 기본 동작 취소를 대신하지 않습니다.', 'reset은 폼 값을 초기화하며 제출 취소와 다른 동작입니다.'],
  '9-2': ['한 번 정리한 값을 검사하고 저장해야 입력에 공백이 남지 않습니다.', '저장 시점에 정리하지 않으면 공백을 포함한 원본을 보존하게 됩니다.', '공백 문자열은 truthy이므로 원본을 검사하는 것만으로는 부족합니다.'],
  '9-3': ['textContent는 값을 일반 텍스트로 설정해 마크업으로 파싱하지 않습니다.', 'innerHTML은 문자열을 HTML로 해석합니다.', 'outerHTML은 요소 자체를 HTML 문자열로 바꾸는 속성입니다.'],
  '9-4': ['입력값을 trim하고, 결과가 비면 null을, 있으면 정리된 제목을 반환합니다.', '원본을 반환하면 양끝 공백을 제거한다는 조건을 어깁니다.', '공백을 남기는 것은 정규화 요구와 반대입니다.'],
  '9-5': ['textContent로 설정하면 태그 모양의 문자열도 일반 텍스트 값으로 둡니다.', 'innerHTML은 외부 메시지를 마크업으로 해석합니다.', 'outerHTML은 메시지가 아니라 대상 요소 자체를 교체하는 방향입니다.'],
  '10-1': ['await를 사용하면 response.json()의 Promise가 이행된 JavaScript 값을 받은 뒤 속성을 읽을 수 있습니다.', 'JSON.stringify는 Promise를 기다리거나 본문을 파싱하지 않습니다.', 'Promise.resolve만으로는 아직 끝나지 않은 json() 결과를 동기 값으로 바꾸지 못합니다.'],
  '10-2': ['response.ok는 성공 상태 범위(2xx)를 나타내므로 404와 500을 모두 구분합니다.', '200만 비교하면 정상적인 201·204 응답도 거부할 수 있습니다.', 'fetch 함수에는 ok 상태 속성이 없습니다. 응답 객체를 확인하세요.'],
  '10-3': ['catch에서 오류를 다시 던지거나 명시적인 오류 결과를 만들면 호출자가 실패를 구분할 수 있습니다.', '빈 객체는 정상 데이터처럼 보여 네트워크 실패 원인을 감춥니다.', '조용히 종료하면 호출자가 왜 결과가 없는지 알 수 없습니다.'],
  '10-4': ['json()은 본문을 읽고 파싱한 JavaScript 값으로 이행되는 Promise를 반환합니다.', 'json()은 원문 문자열을 즉시 반환하지 않습니다.', '본문 읽기와 JSON 파싱은 HTTP 상태 확인과 별개의 비동기 단계입니다.'],
  '10-5': ['fetch의 두 번째 인자에 controller.signal을 넣어야 abort()가 요청에 연결됩니다.', 'Fetch 옵션 이름은 abort가 아니라 signal입니다.', 'abort()는 controller의 메서드이며 fetch 첫 번째 인자인 URL을 대체하지 않습니다.'],
  '11-1': ['Promise 콜백은 현재 호출 스택의 동기 문장이 끝난 뒤 microtask로 처리됩니다.', '비동기 콜백은 실행 중인 동기 함수에 끼어들지 않습니다.', 'Promise callback은 다음 timer보다 먼저 처리되므로 항상 나중이라는 설명은 틀립니다.'],
  '11-2': ['0ms timer는 현재 실행이 끝난 뒤 가능한 시점에 callback을 task로 예약합니다.', 'runTask를 괄호로 호출하면 예약 전에 동기 실행합니다.', '0ms는 정확한 실행 시각이나 즉시 실행을 보장하지 않습니다.'],
  '11-3': ['Promise.then과 queueMicrotask는 현재 task 종료 뒤 microtask queue에서 처리됩니다.', '일반 timer callback은 microtask checkpoint 다음 task에서 실행됩니다.', '새 스크립트 동기 코드는 현재 실행 중인 스크립트보다 먼저 끼어들지 않습니다.'],
  '11-4': ['requestAnimationFrame은 다음 repaint 전에 실행할 화면 갱신 callback을 예약합니다.', 'microtask는 렌더링 양보를 보장하는 예약 수단이 아닙니다.', '0ms interval은 화면 프레임 시점에 맞춘 API가 아닙니다.'],
  '11-5': ['작업을 작은 조각으로 나누고 timer 같은 다음 task로 예약하면 브라우저가 중간에 다른 일을 처리할 기회를 얻습니다.', '긴 동기 반복은 실행 중 입력과 화면 갱신을 막습니다.', 'microtask를 계속 이어 붙이면 다음 task와 렌더링으로 양보하지 못할 수 있습니다.'],
};

const focusedFoundationRepairExplanations = {
  '1-4': '문자열을 따옴표 밖의 변수 name과 `+`로 이어 붙이면 값이 들어갑니다. 일반 따옴표 안의 name은 글자로 남으므로 변수 이름은 문자열 밖에 둬야 합니다.',
  '1-5': 'currentAttempt에 1을 더한 결과를 다시 대입해야 다음 줄에서 갱신된 값 2를 읽을 수 있습니다. `+= 1`과 `= currentAttempt + 1`은 이 경우 같은 값을 만듭니다.',
  '2-4': '로그인과 동의가 모두 필요하므로 두 조건을 `&&`로 연결합니다. 하나만 true인 경우 false이고, 둘 다 true일 때만 canStart가 true입니다.',
  '2-5': '3회 미만은 3을 포함하지 않으므로 `< 3`을 사용합니다. 시도 횟수가 2일 때 true, 3일 때 false인지 확인하세요.',
  '3-4': '배열 길이가 2면 인덱스 0과 1만 유효합니다. `< items.length`로 반복하면 범위 밖의 items[2]를 읽지 않습니다.',
  '3-5': '누적값을 0에서 시작하면 점수가 있을 때는 합계가 되고, 빈 배열에서는 반복이 건너뛰어 0이 남습니다.',
  '4-4': '기본 인자는 인자를 생략하거나 undefined를 전달했을 때 적용되고, null은 그대로 전달됩니다. 빈 입력과 명시적 값의 경계를 나눠 확인하세요.',
  '4-5': 'courseLabel은 제목과 수준을 한 문자열에 조합해 반환합니다. 함수 밖에서 출력하는 대신 호출자가 반환값을 쓸 수 있게 하세요.',
  '5-4': 'sort는 호출한 배열 자체를 정렬합니다. 원본을 유지하려면 전개 문법이나 slice()로 복사한 뒤 정렬하거나, toSorted()로 새 정렬 배열을 얻으세요. 원본과 결과를 각각 확인하세요.',
  '5-5': '빈 배열에서는 null을 반환하고, 그 외에는 length - 1 또는 at(-1)로 마지막 항목을 읽을 수 있습니다. 빈 입력과 두 항목 입력을 모두 확인하세요.',
  '6-4': '객체의 title과 minutes 속성을 읽어 `제목: 분 수분` 형태로 반환합니다. 속성 사이 공백·콜론과 숫자 뒤의 단위를 확인하세요.',
  '6-5': '전개 문법이나 Object.assign으로 새 객체를 만든 다음 level만 덮어쓰면 입력 profile은 유지되고 나머지 필드도 보존됩니다. 원본과 새 객체를 함께 비교하세요.',
  '7-4': '클로저가 count를 계속 참조하더라도 `count + 1`은 값을 계산할 뿐 상태를 바꾸지 않습니다. 호출마다 하나씩 늘리려면 전위 증가 결과를 반환해야 합니다.',
  '7-5': '두 함수가 같은 count를 공유하는 것만으로는 부족합니다. 후위 증가 `count++`는 증가 전 값을 반환하므로 첫 호출은 0이 됩니다. count는 makeCounterPair 안에 두고 두 반환 함수에서 전위 증가 `++count`를 사용하면 상태를 공유하면서 첫 결과 1, 다음 결과 2를 얻습니다.',
  '8-4': '먼저 문자열인지 확인하고 trim 결과가 비면 null을 반환합니다. Number로 바꾼 뒤 Number.isInteger가 true인 값만 반환하므로 "12.0"은 12, 2.5는 null이 됩니다.',
  '8-5': '정상 문자열, 공백 문자열, null을 따로 검사하세요. 타입 확인은 null에서 trim을 호출하지 않게 하고 trim 결과 길이는 공백 입력을 거부합니다.',
  '9-4': 'input.value에서 읽은 문자열을 trim한 뒤 빈 입력 여부를 판단하고 정리된 결과만 반환합니다. 실제 폼에서는 submit 이벤트의 기본 동작 취소도 별도로 필요합니다.',
  '9-5': 'textContent로 메시지를 넣으면 태그처럼 보이는 문자열을 HTML로 파싱하지 않고 글자로 둡니다. 제출 오류 안내를 연결할 때도 외부 입력은 텍스트로 다루세요.',
  '10-4': 'json() 메서드를 호출하면 파싱 결과를 담은 Promise를 반환합니다. 호출자가 await할 수 있도록 그 Promise를 반환하면 됩니다. async 함수에서 다음 로직에 파싱값을 써야 할 때만 await를 추가하세요.',
  '10-5': 'AbortController의 signal은 fetch의 두 번째 옵션 객체에 전달합니다. controller.abort()는 해당 signal을 사용 중인 요청을 취소하며, 예제의 fetch 함수는 네트워크 호출 대신 전달 인자만 기록하는 모형입니다.',
  '11-4': '화면에 반영할 변경은 requestAnimationFrame callback에서 적용할 수 있습니다. 브라우저 모형 테스트는 예약과 callback 인자를 확인할 뿐 실제 화면 페인트 시점을 재현하지 않습니다.',
  '11-5': '긴 작업을 한 번에 실행하지 말고 작은 조각을 다음 task로 넘기는 스케줄러를 사용합니다. 단순한 callback 전달만으로 작업 분할이 자동으로 이루어지지는 않으며, 호출자가 work를 작은 단위로 나눠야 합니다.',
};

const focusedFoundationExerciseGuidance = {
  '5-3': { debug: '60점이 경계값으로 포함되는지 확인하세요.' },
  '1-1': { choice: '`minutes`는 변수 이름입니다. 따옴표로 감싸면 변수 값이 아니라 글자 자체를 확인하게 되니, 선택지에서 따옴표가 있는지 살펴보세요.', trace: 'typeof에 따옴표 없는 변수 이름을 전달하는지 확인하세요.', traceExplanation: 'typeof로 숫자 30의 자료형을 확인하므로 자료형 이름인 문자열 "number"가 출력됩니다.' },
  '1-2': { trace: 'completed가 처음 값에서 몇 번 증가하는지 따라가세요.', traceExplanation: 'completed는 0에서 1을 더해 1이 되고, course는 JavaScript로 유지됩니다.' },
  '1-3': { choice: 'total에 score 3을 더할지, 기존 값을 새 값 3으로 덮어쓸지 비교해 보세요.', trace: 'total이 2에서 시작해 score 3을 더한 뒤 어떤 값이 되는지 따라가세요.', traceExplanation: 'total의 기존 값 2에 score 3을 더해 5가 됩니다.' },
  '1-4': { choice: '일반 문자열과 변수 이름을 `+`로 연결할 때 따옴표 밖에 둘 값을 찾아보세요.', trace: '문자열 뒤에 name 변수의 값이 이어지는지 확인하세요.', traceExplanation: 'name에 든 민지가 "안녕, " 뒤에 이어져 "안녕, 민지"가 됩니다.', repair: '빈 greeting에 문자열과 변수 name을 연결해 저장하세요.' },
  '1-5': { choice: '계산한 값과 변수에 저장한 값은 달라요. 갱신한 횟수를 남기려면 대입이 필요한지 살펴보세요.', trace: '1에 1을 더한 결과가 currentAttempt에 저장되는지 따라가세요.', traceExplanation: 'currentAttempt는 1에서 2로 바뀌어 2를 출력합니다.', repair: '1을 더한 값을 currentAttempt에 다시 대입하세요.' },
  '2-1': { choice: '숫자 3과 문자열 "3"은 자료형이 달라요. 값뿐 아니라 자료형도 비교하는 연산자를 찾아보세요.', trace: '두 값의 내용뿐 아니라 자료형도 같은지 비교하세요.', traceExplanation: '문자열 3과 숫자 3은 자료형이 다르므로 엄격한 비교 결과는 false입니다.' },
  '2-2': { trace: 'AND의 두 조건 중 하나가 false일 때 결과를 확인하세요.', traceExplanation: '로그인은 true지만 약관 동의가 false여서 AND 결과도 false입니다.' },
  '2-3': { choice: '60점도 기준에 포함해야 해요. 60보다 큰 값만 통과시키는 조건과 비교해 보세요.', trace: 'score 59가 60 이상인지 계산하고 if의 어느 쪽이 실행되는지 따라가세요.', traceExplanation: '59는 60 이상이 아니므로 else 쪽의 "한 번 더 확인"이 출력됩니다.' },
  '2-4': { choice: '두 조건이 모두 필요하면 두 값이 각각 true일 때만 전체 조건도 true여야 해요.', trace: '로그인과 동의 값이 각각 true인지 확인하세요.', traceExplanation: '로그인은 true지만 동의는 false라 두 조건을 묶은 결과는 false입니다.', repair: '둘 중 하나만 true여도 통과시키는 `||`를 두 조건이 모두 참이어야 하는 `&&`로 바꾸세요.' },
  '2-5': { choice: '오류 여부와 횟수 조건이 모두 참이어야 해요. 2회와 3회에서 `< 3`의 결과를 확인하세요.', trace: 'hasError와 attempts < 3을 각각 계산한 뒤 AND로 묶으세요.', traceExplanation: '오류가 있고 횟수 2는 3보다 작으므로 조건은 true입니다.', repair: '최대 횟수인 3회는 제외되도록 `<=`를 `<`로 바꾸세요.' },
  '3-1': { choice: '배열 인덱스는 0부터 시작해요. 길이가 3이면 마지막 인덱스는 2이므로 3보다 작은 동안 반복해야 해요.', trace: 'index가 3과 같아지면 반복이 멈추는지 확인하세요.', traceExplanation: 'index는 0, 1, 2에서만 반복하므로 이 값들이 출력됩니다.' },
  '3-2': { trace: 'score 값 2와 4를 total에 차례로 더하세요.', traceExplanation: 'total은 0에서 시작해 2와 4를 더하므로 6이 됩니다.' },
  '3-3': { choice: '합계는 반복할 때마다 이어져야 해요. 반복문 안에서 total을 다시 0으로 만드는 경우와 한 번만 초기화하는 경우를 비교해 보세요.', trace: '첫 번째 반복 뒤 total에 두 번째 값을 더하세요.', traceExplanation: '첫 번째 반복 뒤 total은 1이고, 두 번째 반복에서 2를 더해 3이 됩니다.' },
  '3-4': { choice: '배열 길이와 같은 인덱스는 마지막 요소 다음 위치예요. index가 items.length와 같을 때 조건식 결과를 확인해 보세요.', trace: 'index 1과 2가 length 2보다 작은지 각각 비교하세요.', traceExplanation: '1은 2보다 작아 true이고, 2는 같으므로 false입니다.', repair: '배열 길이와 같은 인덱스는 범위 밖이므로 반복 조건의 `<=`를 `<`로 바꾸세요.' },
  '3-5': { choice: '누적값을 0에서 시작하면 빈 배열도 0으로 남아요. 값이 있는 배열과 빈 배열을 나눠 확인하세요.', trace: '점수 2, 4, 6을 더하고 빈 배열에서는 반복이 한 번도 돌지 않는다는 점을 확인하세요.', traceExplanation: '2, 4, 6을 더하면 12입니다. 빈 배열은 반복할 값이 없어 시작값 0이 그대로 남습니다.', repair: '반복 전에 total을 0으로 초기화해 점수가 없어도 합계가 숫자로 남게 하세요.' },
  '4-1': { choice: '함수 선언의 괄호 안 이름과 호출 괄호에 전달한 값을 비교하세요.', trace: '호출할 때 전달한 이름이 매개변수에 들어간 뒤 반환 문자열에 어떻게 들어가는지 따라가세요.', traceExplanation: '예상 출력은 `안녕, 민`입니다. greet("민")에서 name은 "민"을 받고 템플릿 리터럴이 그 값을 반환합니다.' },
  '4-2': { choice: '`return`으로 돌려주는 값과 `console.log`로 출력하는 값을 구분하세요.', trace: '4를 value에 대입한 뒤 곱셈 결과가 반환되는지 확인하세요.', traceExplanation: '예상 출력은 `8`입니다. double(4)에서 value는 4이고 `value * 2`가 8을 반환합니다.', debug: '2번 줄의 계산식과 다음 줄의 return을 비교해 호출자가 실제로 받는 값이 무엇인지 확인하세요.' },
  '4-3': { choice: '호출 인자를 생략했을 때 매개변수 선언에서 값을 정하는 문법을 찾으세요.', trace: 'greet()에는 인자가 없으므로 매개변수 선언의 기본값이 사용됩니다.', traceExplanation: '예상 출력은 `안녕, 학습자`입니다. greet()에서 name 인자가 생략되어 기본값 "학습자"가 사용됩니다.', debug: 'greet("민")처럼 값을 직접 전달했을 때도 함수 본문의 대입이 그 값을 덮어쓰는지 살펴보세요.' },
  '4-4': { choice: '인자 생략, undefined, null을 각각 별개의 입력으로 비교하세요.', trace: '기본값이 적용되는 두 호출과 명시적 null을 넘기는 호출의 결과를 나눠 보세요.', traceExplanation: '예상 출력은 `true 안녕, null`입니다. 생략과 undefined는 기본값을 사용하지만 null은 명시된 값으로 유지됩니다.', debug: '명시적으로 전달한 null을 `||`가 기본 이름으로 바꾸는지 확인하세요. 기본 매개변수의 동작 범위보다 넓은 대체입니다.', repair: '기본값은 매개변수 선언에 두고, 본문에서 모든 값을 덮어쓰지 않도록 반환식을 고치세요.' },
  '4-5': { choice: '반환 문자열에 제목·공백·괄호·수준이 모두 들어가는지 확인하세요.', trace: '두 매개변수가 템플릿 리터럴의 어느 위치에 들어가는지 대입하세요.', traceExplanation: '예상 출력은 `JS (기초)`입니다. title과 level을 형식에 맞게 끼워 넣은 문자열이 함수에서 반환됩니다.', debug: '표현식이 값을 돌려주는지, 호출자가 그 값에 접근할 수 있는지 살펴보세요.', repair: '템플릿 리터럴이나 문자열 결합으로 두 매개변수를 요구된 괄호 형식에 넣어 반환하세요.' },
  '5-1': { choice: '길이와 마지막 인덱스가 같은 수가 아님을 생각하고 0부터 세어 보세요.', trace: '배열 원소 수 3에서 마지막 유효 인덱스를 계산한 뒤 해당 값을 읽으세요.', traceExplanation: '예상 출력은 `Python`입니다. items의 length는 3이고 마지막 인덱스는 2이므로 items[2]를 읽습니다.', debug: '배열 인덱스가 0부터 시작한다는 점을 이용해 length와 같은 위치가 존재하는지 확인하세요.' },
  '5-2': { choice: 'push가 원본 배열을 바꾸는지, 새 배열을 돌려주는지 구분하세요.', trace: '전개 문법으로 만든 next에 원래 원소와 새 문자열이 어떤 순서로 담기는지 보세요.', traceExplanation: '예상 출력은 `JS,React`입니다. 전개 문법이 "JS"를 복사하고 "React"를 뒤에 붙인 뒤 join이 두 값을 연결합니다.', debug: 'push의 반환값은 배열이 아니라 새 길이 숫자라는 점을 다음 줄의 join 호출과 연결하세요.' },
  '5-3': { choice: '원소를 다른 값으로 바꾸는 메서드와 조건에 맞는 원소만 고르는 메서드를 구분하세요.', trace: '55, 60, 90 각각에 조건을 적용하고 true인 원소만 남겨 보세요.', traceExplanation: '예상 출력은 `60,90`입니다. 60점 이상인 원소는 60과 90이고 filter가 이 두 값을 새 배열에 남깁니다.', debug: 'map callback은 Boolean을 만들지만 요구사항은 조건을 통과한 원래 점수들을 남기는 것입니다.' },
  '5-4': { choice: 'sort를 어느 배열에서 호출하는지 확인하고 입력 배열의 순서도 비교하세요.', trace: '복사 배열의 정렬 결과와 names 원본의 순서를 각각 추적하세요.', traceExplanation: '예상 출력은 `a,b b,a`입니다. sortedCopy는 복사 배열을 정렬하고 원본 names는 `b,a`로 유지됩니다.', debug: 'sort가 호출된 대상이 원본 names인지 복사본인지 확인하세요.', repair: 'toSorted()를 사용하거나 names를 복사한 뒤 복사본에 sort()를 호출하세요.' },
  '5-5': { choice: '먼저 빈 배열을 확인하고, 원소가 있을 때만 length - 1을 읽으세요.', trace: '첫 호출의 마지막 인덱스와 두 번째 호출의 빈 배열 분기를 각각 적용하세요.', traceExplanation: '예상 출력은 `React null`입니다. 두 항목 배열은 마지막 값 React를 반환하고 빈 배열은 정책대로 null을 반환합니다.', debug: 'length 인덱스는 범위 밖이며 빈 배열에 대해서도 별도 반환 정책이 필요합니다.', repair: '빈 배열이면 null을 반환하고, 나머지는 length - 1 또는 at(-1)로 마지막 항목을 반환하세요.' },
  '6-1': { choice: '속성 이름이 고정되어 있을 때 점 표기법으로 객체와 키를 연결하세요.', trace: 'profile 객체 안에 선언된 name의 값을 찾아 출력에 대입하세요.', traceExplanation: '예상 출력은 `민`입니다. profile의 name 속성 값이 "민"이므로 profile.name을 읽으면 그 값이 출력됩니다.', debug: '객체에 실제로 선언된 속성 이름과 읽으려는 속성 이름을 비교하세요.' },
  '6-2': { choice: 'profile 자체가 있는지, bio 속성만 없는지 구분해 `?.`가 필요한 위치를 찾으세요.', trace: 'bio가 없어 `?.length`가 undefined가 된 다음, ||가 기본 문구를 고르는 순서를 따라가세요.', traceExplanation: '예상 출력은 `소개 없음`입니다. bio가 없으면 `profile.bio?.length`는 오류 대신 undefined가 되고, 이미 배운 `||`가 오른쪽 안내 문구를 선택합니다.', debug: 'bio가 undefined일 때 `.length`에 바로 접근하면 어느 줄에서 예외가 발생하는지 확인하세요.' },
  '6-3': { choice: '새 객체를 만들면서 기존 속성을 복사하고 level만 덮어쓰는 순서를 확인하세요.', trace: '전개 복사본의 name은 유지되고 level은 뒤에 적은 새 값으로 바뀌는지 확인하세요.', traceExplanation: '예상 출력은 `민 2`입니다. 전개 문법이 name을 보존하고 뒤의 level: 2가 기존 level을 덮어씁니다.', debug: '새 객체에 name을 복사하지 않은 줄을 찾아, 전체 속성 보존 요구와 비교하세요.' },
  '6-4': { choice: '제목과 시간 값 외에 콜론·공백과 분 단위까지 반환 문자열에 포함하세요.', trace: 'course.title과 course.minutes를 각각 대입하고 구분자와 단위를 유지하세요.', traceExplanation: '예상 출력은 `Python: 30분`입니다. title과 minutes 사이의 콜론·공백, 숫자 뒤의 단위까지 반환합니다.', debug: '반환식에 제목과 숫자만 있는지, 요구된 구분자와 단위도 들어 있는지 비교하세요.', repair: 'title과 minutes를 템플릿 리터럴에 넣고 콜론·공백과 `분` 단위를 포함해 반환하세요.' },
  '6-5': { choice: '원본 객체와 반환된 객체의 참조·속성을 각각 비교하고 다른 필드가 보존되는지 확인하세요.', trace: '원본 level, 새 객체 level, 복사되어 남은 name을 차례로 출력값에 대입하세요.', traceExplanation: '예상 출력은 `1 2 민`입니다. 원본 level은 1로 남고 next에는 level 2와 복사된 name "민"이 있습니다.', debug: '입력 객체를 직접 수정하는지, 복사한 객체에 level을 덮어쓰는지 구분하세요.', repair: '전개 문법이나 Object.assign으로 새 객체를 반환하고 그 객체의 level만 인자로 덮어쓰세요.' },
  '7-1': { choice: '같은 이름이 안쪽 블록과 바깥 블록에 각각 선언된 범위를 확인하세요.', trace: '첫 console.log는 안쪽 블록 안에서, 두 번째는 블록이 끝난 뒤 실행됩니다.', traceExplanation: '예상 출력은 `안쪽\\n바깥`입니다. 첫 출력은 블록 안의 label, 두 번째 출력은 바깥 label을 읽습니다.', debug: 'score를 const로 선언하기 전에 첫 접근이 실행되는 순서를 확인하세요.' },
  '7-2': { choice: '함수 안의 지역 이름과 함수 호출이 반환하는 값을 구분하세요.', trace: 'createLabel이 label을 반환하고, 그 결과가 result에 저장되는 순서를 따라가세요.', traceExplanation: '예상 출력은 `함수 안`입니다. createLabel이 지역 label을 반환하고 호출자가 그 값을 result에 담아 출력합니다.', debug: '함수가 끝난 뒤에도 지역 이름을 직접 읽을 수 있는지, 반환값이 있는지 확인하세요.' },
  '7-3': { choice: '각 makeCounter 호출이 별도 count를 만들고, 후위 증가가 어떤 값을 반환하는지 비교하세요.', trace: '첫 counter의 두 호출과 새로 만든 second의 첫 호출을 순서대로 추적하세요.', traceExplanation: '예상 출력은 `1 2 1`입니다. first는 자기 count를 1과 2로 올리고 second는 별도 count에서 1을 반환합니다.', debug: '후위 증가가 count를 바꾸기 전 값을 먼저 반환한다는 점을 확인하세요.' },
  '7-4': { choice: '바깥 함수가 끝난 뒤 반환 함수가 count를 갱신하는지 확인하세요.', trace: '반환 함수의 첫 호출과 두 번째 호출 사이에 count가 어떻게 변하는지 보세요.', traceExplanation: '예상 출력은 `1 2`입니다. 반환된 함수가 count를 기억하고 `++count`로 호출마다 값을 하나씩 늘립니다.', debug: '`count + 1`은 계산만 하고 저장하지 않습니다. 두 호출 사이에 count 자체가 바뀌는지 확인하세요.', repair: '반환된 함수가 호출될 때 count를 먼저 증가시키고 그 값을 반환하게 하세요.' },
  '7-5': { choice: 'count를 함수 안에 두고 같은 상태를 참조하는 함수들을 반환하는 구조를 떠올리세요.', trace: 'next가 count를 1로 올리고 read는 그 값을 읽으며, 다음 next는 2로 올립니다.', traceExplanation: '예상 출력은 `1 1 2`입니다. next가 count를 1로 바꾼 뒤 read가 1을 읽고, 다음 next가 2를 반환합니다.', repair: 'count는 바깥 함수 안에 유지하고 두 반환 함수 모두 전위 증가를 사용해 같은 상태를 공유하게 하세요.' },
  '8-1': { choice: 'export가 공개한 이름과 default export의 유무를 확인하세요.', trace: 'format.mjs의 named export를 main.mjs가 가져와 호출할 때 무엇을 출력하는지 확인하세요.', traceExplanation: '예상 출력은 `JS`입니다. format.mjs가 공개한 toTitle을 main.mjs가 중괄호 안에 같은 이름으로 가져와 호출합니다.' },
  '8-2': { choice: '원래 공개 이름 formatTitle과 가져온 쪽의 별칭 toTitle을 구분하세요.', trace: 'formatTitle을 toTitle이라는 이름으로 가져와 호출하는 두 파일의 결과를 확인하세요.', traceExplanation: '예상 출력은 `JS`입니다. named import의 `as` 뒤에 적은 toTitle이 현재 파일에서 사용할 이름입니다.', debug: '모듈이 named export로 내보낸 이름과 default import 구문을 비교하세요.' },
  '8-3': { choice: '빈 문자열과 공백 문자열을 모두 실패로 분류하고 오류가 호출자에게 전달되는지 확인하세요.', trace: '공백뿐인 title에서 검증 분기가 throw를 실행하고 catch가 오류 메시지를 읽습니다.', traceExplanation: '예상 출력은 `title is required`입니다. 공백 제거 후 비어 있으므로 Error를 던지고 catch가 message를 출력합니다.', debug: '공백 문자열은 truthy라는 점을 이용해 `!title` 검사가 놓치는 입력을 찾으세요.' },
  '8-4': { choice: 'Number 변환 전에 빈 문자열을 거부하고, 변환한 결과가 정수인지 확인하세요.', trace: '"12.0"은 숫자 12로 변환되어 통과하고, 2.5와 공백은 각각 소수와 빈 입력으로 거부됩니다.', traceExplanation: '예상 출력은 `12 12 null null`입니다. Number("12.0")은 숫자 12이고 Number.isInteger(12)는 true입니다. 2.5는 정수가 아니며 공백은 변환 전에 걸러집니다.', debug: 'Number(" ")가 0이 되는 동작 때문에 공백 입력이 정수로 통과하는지 확인하세요.', repair: '문자열 타입과 trim 결과의 빈 값부터 확인하고, Number 변환 뒤 Number.isInteger를 적용하세요.' },
  '8-5': { choice: '정상 문자열, 공백 문자열, null에서 타입 검사와 trim 검사가 어떤 순서로 평가되는지 보세요.', trace: '각 호출에서 문자열 조건과 trim 길이 조건의 true/false를 차례로 계산하세요.', traceExplanation: '예상 출력은 `true false false`입니다. React는 유효하고 공백 문자열은 trim 뒤 비며 null은 문자열 타입 검사를 통과하지 못합니다.', repair: 'typeof 검사로 문자열만 통과시키고 trim한 길이가 0보다 큰지 반환 조건에 포함하세요.' },
  '9-1': { choice: '기본 동작 취소와 이벤트 전파 중 어느 동작을 제어하려는지 구분하세요.', trace: 'submit 이벤트 처리기에서 preventDefault가 기본 동작을 취소하는 시점을 확인하세요.', traceExplanation: '예상 출력은 `true`입니다. submit 이벤트 처리기에서 preventDefault()를 호출하므로 브라우저의 기본 폼 제출이 취소됩니다.' },
  '9-2': { choice: '검사에 쓴 정리값과 실제 저장에 넘기는 값이 같은지 비교하세요.', trace: '두 입력 각각에서 trim 결과가 비었는지와 반환 정책을 적용하세요.', traceExplanation: '예상 출력은 `React null`입니다. 첫 입력은 공백을 제거한 React, 두 번째 공백 입력은 null을 반환합니다.', debug: '검증에는 value.trim()을 쓰면서 저장에는 원본 value를 다시 쓰는지 확인하세요.' },
  '9-3': { choice: '문자열을 HTML로 파싱할지 일반 텍스트 값으로 둘지 선택하세요.', trace: '브라우저 문서에서 찾은 요소에 textContent를 설정한 뒤 읽으세요.', traceExplanation: '예상 출력은 `<b>저장됨</b>`입니다. textContent는 이 문자열을 HTML 요소로 만들지 않고 글자로 저장합니다.', debug: 'innerHTML이 태그 문자열을 마크업으로 해석한다는 점과 텍스트 전용 요구를 비교하세요.' },
  '9-4': { choice: 'input.value는 문자열이므로 trim 후 빈 결과와 유효한 제목을 나눠 반환하세요.', trace: '앞뒤 공백을 제거한 첫 값과 빈 문자열이 되는 두 번째 값을 비교하세요.', traceExplanation: '예상 출력은 `React null`입니다. 정리한 첫 제목은 React이고 공백뿐인 두 번째 입력은 null입니다.', debug: '정리한 title을 계산했는데 마지막 줄에서 원본 input.value를 반환하는지 확인하세요.', repair: '입력값을 한 번 trim하고, 비면 null을 반환한 뒤 정리된 title을 반환하세요.' },
  '9-5': { choice: 'textContent와 innerHTML 중 입력 문자열을 태그로 해석하지 않는 속성을 선택하세요.', trace: '빈 입력의 안내 문구와 태그 모양의 사용자 제목이 화면에 어떤 글자로 남는지 확인하세요.', traceExplanation: '예상 출력은 `<b>제목을 입력하세요</b>`입니다. 두 번째 출력은 `<b>React</b> 저장됨`입니다. 두 문자열 모두 textContent로 표시하므로 HTML 요소가 아니라 글자입니다.', repair: '메시지를 HTML로 해석하는 속성 대신 textContent에 대입하세요.' },
  '10-1': { choice: '`response.json()`의 Promise가 이행된 뒤에야 파싱된 값의 속성을 읽을 수 있습니다.', trace: 'response.json()이 반환한 Promise를 await한 뒤 title을 읽으세요.', traceExplanation: '예상 출력은 `React`입니다. 모형의 json() Promise가 title이 든 객체로 이행되고, await 뒤 data.title을 반환합니다.' },
  '10-2': { choice: '연결 여부와 response.ok가 나타내는 HTTP 상태 범위를 구분하세요.', trace: '응답 객체에 저장된 ok와 status 값을 각각 읽으세요.', traceExplanation: '예상 출력은 `false 404`입니다. 404 응답을 받았으므로 상태 확인은 false이고 status는 404입니다.', debug: '3번 줄이 실패 상태를 정상 데이터 반환으로 바꾸는지 확인하세요.' },
  '10-3': { choice: '네트워크 거부 때 오류가 호출자까지 전달되는지, 성공처럼 보이는 값으로 숨겨지는지 비교하세요.', debug: 'catch가 빈 객체를 반환해 성공 데이터처럼 보이게 하는지 확인하세요.' },
  '10-4': { choice: 'json은 메서드이므로 본문을 읽으려면 괄호로 호출해야 합니다.', debug: '2번 줄이 response.json 함수 자체를 반환하는지, 호출 결과 Promise를 반환하는지 확인하세요.', repair: 'response.json()을 호출하고 결과 Promise를 반환하세요. 이미 async 함수이면 다음 동작을 계속하는 경우에만 await가 필요합니다.' },
  '10-5': { choice: 'signal은 controller 자체가 아니라 fetch의 두 번째 옵션 객체 안에 전달합니다.', trace: '모형 fetch가 받은 signal이 controller.signal과 같은지, abort() 뒤 취소 상태가 되는지 확인하세요.', traceExplanation: '예상 출력은 `/courses true true`입니다. fetch 모형은 URL과 signal만 기록합니다. abort()가 signal 상태를 바꾸는 과정은 확인하지만 실제 네트워크 요청 취소는 실행하지 않습니다.', repair: 'fetch의 두 번째 인자에 `{ signal: controller.signal }`을 전달하세요.' },
  '11-1': { choice: '동기 문장 D가 끝난 뒤 Promise microtask B와 timer C가 어떤 순서로 처리되는지 확인하세요.', trace: 'work 호출 안에서 inside를 먼저 넣고, 호출이 끝난 뒤 after를 넣습니다. Promise 콜백은 동기 코드가 끝난 뒤 실행됩니다.', traceExplanation: '예상 출력은 `before, inside, after, promise`입니다. work가 동기 실행되어 inside를 넣고, 호출 뒤 after를 넣은 다음 Promise 콜백이 promise를 추가합니다.' },
  '11-2': { choice: '타이머에 함수를 호출한 결과가 아니라 callback 함수 참조를 넘기는지 확인하세요.', trace: '동기 코드가 sync를 넣은 뒤 예약된 0ms timer가 timer를 넣고, 마지막 대기 timer 이후 출력됩니다.', traceExplanation: '예상 출력은 `sync, timer`입니다. 동기 코드가 먼저 sync를 넣고, 앞서 예약한 timer callback이 timer를 추가한 뒤 마지막 대기가 끝납니다.', debug: 'runTask()가 그 자리에서 실행되는지, 함수 참조 runTask가 예약되는지 구분하세요.' },
  '11-3': { choice: '현재 task가 끝난 뒤 Promise.then과 queueMicrotask가 일반 timer보다 먼저 처리되는지 비교하세요.', debug: 'then에 log 호출 결과가 아니라 나중에 실행할 함수를 넘기는지 확인하세요.' },
  '11-4': { choice: '다음 화면 repaint에 맞출 callback 예약과 긴 동기 계산의 task 양보를 구분하세요.', debug: '3번 줄의 동기 반복이 끝날 때까지 브라우저 입력과 화면 갱신을 막는지 확인하세요.', repair: 'requestFrame이 update callback을 다음 repaint에 예약하고, 그 반환값을 호출자에게 돌려주게 하세요. 긴 계산 자체는 별도 task로 나눠야 합니다.' },
  '11-5': { choice: '작업 callback을 작은 조각으로 나누어 다음 task에 넘기고 중간에 브라우저가 처리할 기회를 얻는지 보세요.', trace: '동기 코드에서 먼저 넣는 값과 예약된 timer callback이 나중에 추가하는 값을 구분하세요.', traceExplanation: '예상 출력은 `yield, chunk`입니다. 동기 코드가 먼저 yield를 넣고, 기다리는 동안 예약된 timer callback이 chunk를 추가합니다.', repair: '작업은 callback 인자로 넘기고 scheduleTask가 돌려준 예약 결과를 그대로 반환하세요. 작업을 나누는 책임은 호출자에 있습니다.' },
};

const focusedFoundationSessionNotes = {
  '1-1': { objective: '숫자 값을 이름에 저장하고 typeof로 그 자료형을 확인해요.', intro: 'minutes에는 숫자 30이 들어 있습니다. 변수 이름을 typeof에 전달했을 때와 숫자를 따옴표로 감쌌을 때 자료형이 어떻게 달라지는지 비교하세요.' },
  '1-2': { objective: 'const와 let의 재할당 가능 여부와 선언 전 접근 규칙을 구분해요.', intro: 'const로 선언한 코스 이름은 다시 대입할 수 없고, let으로 선언한 완료 수는 바뀔 수 있습니다. 두 이름 모두 선언문을 실행하기 전에 읽을 수 없다는 점도 확인하세요.' },
  '1-3': { objective: '대입 연산자로 기존 값에 새 값을 더하고 결과를 확인해요.', intro: 'total은 2에서 시작하고 score 3을 더해 5가 됩니다. `total = score`처럼 새 값으로 덮어쓰는 경우와 비교하세요.' },
  '1-4': { objective: '문자열과 변수 값을 `+`로 이어 새 문자열을 만들어요.', intro: '일반 따옴표 문자열 안의 name은 글자 그대로 남습니다. 따옴표 밖에서 변수 name을 연결해 "안녕, 민지"를 만들어 보세요.' },
  '1-5': { objective: 'let 변수에 새 값을 대입해 값이 바뀌는 순서를 따라가요.', intro: 'currentAttempt는 1에서 시작합니다. 현재 값에 1을 더하고 다시 대입하면 다음 줄에서 2를 읽을 수 있습니다.' },
  '2-1': { objective: '엄격한 동등 비교로 값과 자료형을 함께 비교해요.', intro: '문자열 "3"과 숫자 3은 글자 모양이 같아도 자료형이 다릅니다. `==`와 `===`가 비교 전에 값을 변환하는지 구분하세요.' },
  '2-2': { objective: '두 조건이 모두 참이어야 할 때 논리 AND를 사용해요.', intro: '학습을 시작하려면 로그인과 약관 동의가 모두 필요합니다. 두 번째 조건이 false일 때 전체 결과를 확인하세요.' },
  '2-3': { objective: 'if와 else로 60점 기준의 통과 여부를 나눠요.', intro: '점수가 기준인 60점 이상인지 비교하고, 조건이 참일 때와 거짓일 때 실행되는 코드를 구분하세요. 60점을 포함하는지도 확인하세요.' },
  '2-4': { objective: '여러 조건이 모두 참이어야 하는 접근 규칙을 논리 AND로 표현해요.', intro: '접근하려면 로그인과 약관 동의가 모두 필요합니다. 두 입력값을 각각 바꿔 보며 `&&`와 `||`가 결과에 주는 차이를 확인하세요.' },
  '2-5': { objective: '두 불리언 조건이 모두 참일 때만 재시도하도록 논리식을 만들어요.', intro: '오류가 있고 시도 횟수가 3보다 작아야 합니다. 시도 횟수 2와 3을 각각 넣어 경계가 정확한지 확인하세요.' },
  '3-1': { objective: '배열 인덱스가 0부터 length 미만까지 순회하도록 경계를 정해요.', intro: '배열 길이가 3이면 유효한 인덱스는 0, 1, 2입니다. 반복 조건을 `<=`로 바꾸었을 때 마지막에 어떤 값이 추가로 읽히는지 확인하세요.' },
  '3-2': { objective: 'for...of로 배열의 원소를 읽고 각 값을 합산해요.', intro: '점수 배열에서 실제 점수 값을 하나씩 받아 더합니다. for...in을 쓰면 원소가 아니라 인덱스가 나온다는 차이를 비교하세요.' },
  '3-3': { objective: '누적값을 반복문 전에 한 번만 초기화하고 합계를 유지해요.', intro: '각 반복에서 total은 이전 합계에 현재 값을 더해야 합니다. 반복문 안에서 0으로 다시 지정하면 결과가 왜 마지막 값에 머무는지 추적하세요.' },
  '3-4': { objective: '인덱스가 배열 길이보다 작을 때만 다음 원소가 있다고 판단해요.', intro: '길이 2인 배열의 유효한 인덱스는 0과 1입니다. 인덱스가 length와 같으면 배열이 끝났으므로 `<`와 `<=`의 차이를 확인하세요.' },
  '3-5': { objective: 'for...of로 점수를 더하고 빈 배열의 결과도 확인해요.', intro: '합계는 0에서 시작해 각 점수를 더합니다. 빈 배열에서는 반복문이 실행되지 않아 합계가 0으로 남는 이유를 확인하세요.' },
  '4-1': { objective: '함수 호출의 인자를 매개변수 이름으로 받고 결과에 사용해요.', intro: 'greet("민")의 인자 "민"은 함수 안에서 매개변수 name이 받습니다. 선언의 괄호와 호출의 괄호가 각각 어떤 역할인지 구분하세요.' },
  '4-2': { objective: 'return으로 계산값을 함수 밖으로 돌려줘요.', intro: 'double은 입력값을 두 배로 계산합니다. return이 없으면 호출한 쪽에서 계산 결과를 사용할 수 없다는 점을 console.log만 쓴 경우와 비교하세요.' },
  '4-3': { objective: '인자를 생략한 호출에 적용할 매개변수 기본값을 선언해요.', intro: 'greet()에 이름을 전달하지 않았을 때만 "학습자"를 사용합니다. 기본값은 함수 매개변수 선언에 둘 수 있습니다.' },
  '4-4': { objective: '인자 생략·undefined·null에서 기본 매개변수의 경계를 구분해요.', intro: 'JavaScript 기본 매개변수는 인자가 생략되거나 undefined일 때 적용됩니다. null은 명시적으로 전달된 값이어서 기본 이름을 대체하지 않습니다.' },
  '4-5': { objective: '두 매개변수를 읽어 짧고 재사용 가능한 표시 함수를 설계해요.', intro: 'courseLabel은 제목과 수준을 하나의 표시 문자열로 반환합니다. 반환값의 형식과 함수 호출자가 다시 사용할 수 있는 점을 확인하세요.' },
  '5-1': { objective: '배열 인덱스가 0부터 시작하며 마지막 위치는 length - 1임을 확인해요.', intro: '세 항목의 인덱스는 0, 1, 2입니다. length는 항목 수이지 마지막 인덱스가 아니므로 경계에서 배열 밖을 읽지 않도록 하세요.' },
  '5-2': { objective: '전개 문법으로 원본을 보존하며 새 배열에 항목을 추가해요.', intro: 'courses를 직접 바꾸지 않고 기존 값을 복사한 뒤 React를 추가합니다. push가 바꾸는 대상과 반환하는 값도 비교하세요.' },
  '5-3': { objective: 'filter 조건으로 필요한 배열 원소만 새 배열에 남겨요.', intro: 'map은 원소마다 결과를 만들고 filter는 조건이 참인 원소만 남깁니다. 60점 경계값을 포함하는지 확인하세요.' },
  '5-4': { objective: '원본 배열은 그대로 두고 정렬 결과를 새 배열로 받아요.', intro: 'sort()는 호출한 배열을 바꿉니다. 전개 문법이나 slice()로 복사한 뒤 sort()를 호출하거나, toSorted()를 사용해 원본과 새 결과를 비교해 보세요.' },
  '5-5': { objective: '빈 배열인지 확인한 뒤 마지막 항목을 안전하게 반환해요.', intro: '빈 배열에는 마지막 항목이 없으므로 이 문제는 null을 반환합니다. 값이 있으면 length - 1 또는 at(-1)로 마지막 항목을 읽을 수 있어요.' },
  '6-1': { objective: '점 표기법으로 객체의 고정된 속성 이름을 읽어요.', intro: 'profile.name은 profile 객체의 name 속성 값을 읽습니다. 다음 수업의 동적 속성 접근과 비교할 기준으로 살펴보세요.' },
  '6-2': { objective: '옵셔널 체이닝으로 값이 없을 수 있는 속성을 오류 없이 읽어요.', intro: 'bio가 없으면 `profile.bio?.length`는 undefined가 됩니다. W2에서 배운 `||`가 이때 기본 문구를 고르는 흐름을 보세요. 문자열 정리 메서드는 아직 쓰지 않습니다.' },
  '6-3': { objective: '객체를 펼쳐 기존 속성을 보존하고 지정한 값만 덮어써요.', intro: '전개 문법은 기존 profile 속성을 새 객체에 복사합니다. 뒤에 적은 level: 2가 기존 level을 대체하고 name은 유지되는지 확인하세요.' },
  '6-4': { objective: '객체 속성 여러 개를 읽어 간결한 문장으로 반환해요.', intro: 'courseSummary는 title과 minutes를 읽어 사람이 확인하기 쉬운 문장을 만듭니다. 속성 값의 결합과 단위 표현을 살펴보세요.' },
  '6-5': { objective: '원본 객체를 바꾸지 않고 필요한 속성만 다른 새 객체에 반영해요.', intro: 'updateLevel은 profile을 복사한 뒤 level만 갱신합니다. 원본의 값, 새 객체의 값, 복사되어 유지된 name을 한꺼번에 비교하세요.' },
  '7-1': { objective: '블록 안팎에서 같은 이름이 가려지는 범위와 출력 순서를 확인해요.', intro: '안쪽 const label은 중괄호 안에서만 바깥 이름을 가립니다. 안쪽 값과 바깥 값을 각각 출력하고, 선언 범위를 벗어난 이름은 별도로 오류가 나는지 비교하세요.' },
  '7-2': { objective: '함수 지역 값을 return으로 호출자에게 전달해요.', intro: '함수 안의 지역 변수는 함수 바깥에서 직접 읽을 수 없습니다. 호출자가 필요로 하는 값은 반환값으로 전달하는 흐름을 따라가세요.' },
  '7-3': { objective: '클로저가 상태를 기억하고 각 팩토리 호출은 별도 상태를 만든다는 점을 확인해요.', intro: '첫 counter를 두 번, 두 번째 counter를 한 번 호출해 `1, 2, 1`이 되는지 살펴보세요. 같은 함수 정의를 사용해도 생성 호출이 다르면 count는 독립적입니다.' },
  '7-4': { objective: '반환된 클로저가 count를 갱신하고 다음 호출에서 이어 쓰게 해요.', intro: 'makeCounter가 끝난 뒤에도 반환 함수는 count를 참조합니다. `count + 1`과 `++count`의 차이는 계산값만 만드는지 상태도 갱신하는지입니다.' },
  '7-5': { objective: '작은 공개 함수로 클로저 상태를 제한하고 호출 계약을 검증해요.', intro: 'count 자체는 감추고 next와 read 동작만 공개합니다. 두 함수가 한 상태를 공유하는지, 첫 증가값이 1인지 확인하세요.' },
  '8-1': { objective: 'named export로 함수 이름을 공개하고 다른 파일에서 같은 이름으로 가져와요.', intro: '예제는 `format.mjs`와 `main.mjs` 두 파일입니다. 각각 파일로 저장한 뒤 `node main.mjs`를 실행하면 export한 함수가 import되어 호출됩니다.' },
  '8-2': { objective: 'named import의 별칭으로 공개 이름과 현재 파일에서 쓸 이름을 연결해요.', intro: '예제는 `format.mjs`와 `main.mjs` 두 파일입니다. formatTitle이라는 공개 이름은 유지하고 main.mjs에서는 toTitle로 가져와 `node main.mjs`로 실행합니다.' },
  '8-3': { objective: '잘못된 필수 입력에 오류를 던지고 호출 지점에서 메시지를 처리해요.', intro: '문자열 여부와 공백 입력을 먼저 검증합니다. 예외를 삼키지 않고 호출자가 잡아 필요한 안내로 연결하는 경로를 살펴보세요.' },
  '8-4': { objective: '숫자로 변환한 값이 정수인지 확인하고 빈 입력을 걸러요.', intro: 'Number(" ")는 0이 될 수 있어 먼저 공백을 거릅니다. "12.0"은 숫자 12로 변환되므로 통과하고, 2.5처럼 정수가 아닌 값은 거부되는지 확인하세요.' },
  '8-5': { objective: '정상·공백·잘못된 형식의 입력을 테스트 사례로 만들고 결과를 비교해요.', intro: '회귀 테스트는 정상 입력뿐 아니라 공백과 잘못된 형식도 확인합니다. 각 사례에 기대 결과를 적고 실제 결과와 비교해 변경 뒤에도 조건이 유지되는지 봅니다.' },
  '9-1': { objective: 'submit 이벤트에서 preventDefault를 호출해 기본 페이지 제출을 취소해요.', intro: 'HTML에 id가 course-form인 폼이 있다고 가정합니다. 사용자가 제출 버튼을 누르면 submit 처리기가 실행되고, preventDefault()가 기본 페이지 이동을 막습니다.' },
  '9-2': { objective: 'input.value를 정규화하고 검증한 동일한 값을 저장 흐름에 사용해요.', intro: '검증용 trim 결과와 원본 입력을 혼동하면 공백이 남습니다. 공백뿐인 입력은 거부하고 유효한 값은 정리된 형태로 유지하세요.' },
  '9-3': { objective: '사용자 문구를 textContent로 DOM에 넣어 HTML로 해석되지 않게 보여요.', intro: 'HTML에 id가 preview인 output 요소가 있다고 가정합니다. 사용자가 입력한 `<b>저장됨</b>`도 textContent에 넣으면 태그가 아니라 글자로 표시됩니다.' },
  '9-4': { objective: 'input 요소에서 읽은 제목을 정리하고 빈 결과를 거부해요.', intro: 'input.value는 문자열입니다. trim 뒤 비면 null을 반환하고, 값이 있으면 정리된 제목만 다음 저장 단계로 전달합니다.' },
  '9-5': { objective: '입력 검증 실패 문구를 textContent로 표시하는 안전한 갱신 흐름을 설계해요.', intro: '폼 제출부터 제목 검사와 결과 표시까지 연결합니다. 제목이 비었을 때 안내하고, 태그처럼 보이는 제목도 글자로 표시합니다.' },
  '10-1': { objective: 'response.json()의 Promise를 기다린 뒤 파싱된 값에서 필요한 속성을 읽어요.', intro: 'Response.json()은 본문을 읽고 파싱한 JavaScript 값으로 이행되는 Promise를 반환합니다. 예제 응답은 네트워크 없이 이 반환 형태를 흉내 낸 모형입니다.' },
  '10-2': { objective: 'HTTP 응답 상태와 네트워크 연결 실패를 구분하고 response.ok로 성공 범위를 검사해요.', intro: '404 응답도 서버와 연결해 응답을 받은 경우입니다. 200만 확인하지 말고 response.ok를 사용해 모든 2xx 상태와 나머지 상태를 구분하세요.' },
  '10-3': { objective: '요청 Promise가 거부되는 실패를 호출자에게 숨기지 않고 전달해요.', intro: 'fetch의 네트워크 실패는 Promise 거부로 전달될 수 있습니다. 빈 객체를 성공값처럼 돌려주지 말고 오류를 다시 던지거나 구분 가능한 오류 결과를 만드세요.' },
  '10-4': { objective: '응답 본문을 JSON으로 파싱하는 메서드를 호출하고 반환된 Promise를 사용해요.', intro: 'json은 메서드이므로 괄호를 붙여 호출해야 본문을 읽습니다. 반환 Promise를 직접 돌려주면 호출자가 await할 수 있습니다.' },
  '10-5': { objective: 'AbortController.signal을 Fetch 옵션에 연결하고 취소 상태 변화를 확인해요.', intro: '요청을 시작할 때 controller.signal을 전달하고 controller.abort()를 호출합니다. 모형 fetch는 URL과 signal 전달만 기록하며 실제 네트워크 요청이나 네트워크 취소는 실행하지 않습니다.' },
  '11-1': { objective: '동기 함수 호출이 호출 스택을 쌓고 끝나는 순서와 Promise 콜백 시점을 추적해요.', intro: '현재 동기 작업은 중간에 비동기 callback에게 실행을 넘기지 않습니다. 전체 동기 호출이 끝난 뒤 Promise microtask가 실행되는 흐름을 코드 순서와 대조하세요.' },
  '11-2': { objective: 'setTimeout의 callback을 실행하지 않고 전달하며 timer가 task로 예약되는 시점을 구분해요.', intro: '0ms는 정확히 0밀리초 뒤 실행이나 동기 실행을 뜻하지 않습니다. 현재 동기 흐름과 microtask 처리 뒤 가능한 시점에 callback이 실행됩니다.' },
  '11-3': { objective: 'Promise.then과 queueMicrotask를 timer task보다 먼저 처리하는 microtask 순서를 확인해요.', intro: '동기 출력 뒤 microtask는 예약된 순서대로 처리되고, 그 다음 timer callback이 실행됩니다. 예제는 Node에서 확인 가능한 기본 Promise·queueMicrotask·timer 순서만 사용합니다.' },
  '11-4': { objective: 'requestAnimationFrame이 다음 repaint 전에 호출되도록 화면 갱신을 예약하는 역할을 구분해요.', intro: 'Promise microtask는 렌더링을 기다리거나 양보하는 API가 아닙니다. 화면 갱신 callback은 requestAnimationFrame으로 예약하며, 이 예제의 모형은 callback 전달만 확인합니다.' },
  '11-5': { objective: '긴 처리를 작은 조각으로 나누고 다음 task에 예약해 브라우저가 다른 일을 처리할 기회를 줘요.', intro: 'callback을 스케줄러에 전달하는 함수는 작업 분할 정책을 대신 정하지 않습니다. 호출자는 work를 작은 단위로 나눠 task 사이에 실행해야 합니다. microtask를 연속 예약하는 것은 렌더링 양보와 다릅니다.' },
};

const revisedFoundationDays = new Set(Object.keys(focusedFoundationDailyCases));
const versionedFoundationQuestionDays = new Set(['1-3', '1-4', '1-5', '2-3', '2-4', '2-5', '3-4', '3-5', '6-2', '8-2']);
const versionedFoundationRepairDays = new Set(['7-4', '7-5', '8-4', '8-5', '9-4', '9-5', '10-4', '10-5', '11-4', '11-5']);

const foundationAdvancedRepairVariants = {
  '9-4': ['readTitle', 'function readTitle(input) {\n  return input.value;\n}', 'const title = input.value.trim();\n  return title.length > 0 ? title : null;', '입력 양끝 공백을 제거하고 빈 제목은 null로 반환한다.', ['{ value: "  React  " }', '"React"'], ['{ value: " " }', 'null']],
  '9-5': ['showMessage', 'function showMessage(element, message) {\n  element.innerHTML = message;\n}', 'element.textContent = message;', '메시지를 HTML로 해석하지 않고 일반 텍스트로 표시한다.', ['element, "<b>안녕</b>"', '텍스트 그대로 표시'], ['element, "저장됨"', '"저장됨"']],
  '10-4': ['readJson', 'function readJson(response) {\n  return response.json;\n}', 'return response.json();', 'response.json()을 호출하고 파싱 Promise를 호출자에게 반환한다.', ['response.json() -> Promise', '파싱된 값'], ['응답 본문이 유효한 JSON인 경우', '이행된 JavaScript 값']],
  '10-5': ['requestWithSignal', 'function requestWithSignal(url, controller) {\n  return fetch(url);\n}', 'return fetch(url, { signal: controller.signal });', '해당 controller.signal을 Fetch 옵션에 전달한다.', ['url, controller', 'signal이 포함된 요청'], ['다른 URL, controller', '다른 controller의 signal']],
  '11-4': ['scheduleRender', 'function scheduleRender(update, requestFrame) {\n  update("now");\n}', 'return requestFrame(() => update("ready"));', '다음 repaint 전에 시각 변경 callback을 예약하고 예약 결과를 반환한다.', ['update, requestAnimationFrame', '예약된 callback'], ['update, requestFrame 모형', 'callback이 한 번 전달됨']],
  '11-5': ['scheduleChunk', 'function scheduleChunk(work, scheduleTask) {\n  work();\n}', 'return scheduleTask(work);', '작업 callback을 다음 task scheduler에 넘기고 scheduler의 반환값을 전달한다. work 자체는 호출자가 작은 조각으로 나눈다.', ['작업 조각, setTimeout wrapper', '예약 결과'], ['작업 조각, mock scheduler', '예약 결과와 callback']],
  '13-5': ['normalizeTag', 'function normalizeTag(tag) {\n  return tag;\n}', 'return tag.trim().toLowerCase();', '태그 앞뒤 공백을 제거하고 소문자로 정규화한다.', ['"  Spring "', '"spring"'], ['"JS"', '"js"']],
  '14-5': ['hoursBetween', 'function hoursBetween(start, end) {\n  return 0;\n}', 'return (end.getTime() - start.getTime()) / 3600000;', '두 Date 사이의 경과 시간을 시간 단위로 반환한다.', ['09:00Z와 11:00Z', '2'], ['같은 시각 두 Date', '0']],
  '15-5': ['countUniqueIds', 'function countUniqueIds(ids) {\n  return ids.length;\n}', 'return new Set(ids).size;', '중복을 제외한 코스 id의 개수를 반환한다.', ['["js", "js", "py"]', '2'], ['[]', '0']],
  '16-5': ['pageCursor', 'function* pageCursor(pages) {\n  return pages;\n}', 'for (const page of pages) yield page;', '입력된 페이지를 한 번에 펼치지 않고 순서대로 yield한다.', ['[1, 2]의 첫 두 next()', '1, 2'], ['빈 pages의 첫 next()', 'done: true']],
  '17-5': ['makeCourseService', 'function makeCourseService(validate, save) {\n  return save;\n}', 'return { validate, save };', '검증과 저장 동작을 독립 함수로 받아 서비스 객체에 조합한다.', ['validate, save 함수', '두 동작이 든 객체'], ['다른 함수 쌍', '입력 함수를 보존한 객체']],
  '18-5': ['hasOwnCourseId', 'function hasOwnCourseId(course) {\n  return true;\n}', 'return Object.hasOwn(course, "id");', '프로토타입 상속이 아니라 course 자체의 id 속성만 확인한다.', ['{ id: "js" }', 'true'], ['Object.create({ id: "js" })', 'false']],
  '19-5': ['coversEmptyInput', 'function coversEmptyInput(cases) {\n  return false;\n}', 'return cases.some((item) => item.input.length === 0);', '테스트 사례에 입력이 빈 경계가 포함됐는지 반환한다.', ['[{ input: [] }]', 'true'], ['[{ input: [1] }]', 'false']],
  '20-5': ['failureContext', 'function failureContext(error, operation) {\n  return {};\n}', 'return { name: error.name, message: error.message, operation };', '오류 유형·메시지·작업 맥락을 별도 필드로 담은 객체를 반환한다.', ['TypeError, "invalid", "parse"', '각 값을 가진 객체'], ['Error, "offline", "save"', '작업 "save"를 담은 객체']],
  '21-5': ['elapsedMilliseconds', 'function elapsedMilliseconds(start, end) {\n  return start;\n}', 'return end - start;', '같은 시계의 시작·끝 측정값 차이를 밀리초로 반환한다.', ['120, 175', '55'], ['10, 10', '0']],
  '22-5': ['writeProgress', 'function writeProgress(storage, key, progress) {\n  storage.setItem(key, progress);\n}', 'storage.setItem(key, JSON.stringify(progress));\n  return true;', '진도 객체를 JSON 문자열로 저장하고 저장 호출 뒤 true를 반환한다.', ['"progress", { done: 2 }', 'JSON 문자열 저장'], ['"theme", { mode: "dark" }', 'JSON 문자열 저장']],
  '23-5': ['responseMessage', 'function responseMessage(response) {\n  return "완료";\n}', 'return response.ok ? "불러왔어요" : "다시 시도해 주세요";', 'HTTP 성공 응답과 실패 응답에 서로 다른 화면 안내를 반환한다.', ['{ ok: true }', '"불러왔어요"'], ['{ ok: false }', '"다시 시도해 주세요"']],
  '24-5': ['isLatestRequest', 'function isLatestRequest(requestId, latestId) {\n  return true;\n}', 'return requestId === latestId;', '응답 요청 식별자가 현재 최신 요청과 같을 때만 true를 반환한다.', ['"r2", "r2"', 'true'], ['"r1", "r2"', 'false']],
  '25-5': ['setSafeMessage', 'function setSafeMessage(element, message) {\n  element.innerHTML = message;\n}', 'element.textContent = message;\n  return element.textContent;', '메시지를 HTML로 해석하지 않고 textContent로 설정한 뒤 그 값을 반환한다.', ['"<b>안전</b>"', '태그가 포함된 텍스트'], ['"저장됨"', '저장됨']],
  '26-5': ['summarizeLessons', 'function summarizeLessons(lessons) {\n  return {};\n}', 'return lessons.reduce((summary, lesson) => ({ total: summary.total + 1, completed: summary.completed + Number(lesson.completed) }), { total: 0, completed: 0 });', '빈 목록을 포함해 전체 수와 완료 수를 초기값이 있는 누적 결과로 반환한다.', ['완료 1개·미완료 1개', '{ total: 2, completed: 1 }'], ['빈 목록', '{ total: 0, completed: 0 }']],
};

function specificExercises(week, day) {
  const [baseTitle, baseChoicePrompt, baseOptions, baseAnswer, baseTraceCode, baseTraceAnswers, baseCodeLines, baseErrorLine, baseErrorExplanation, baseFunctionName, baseStarterCode, baseRepairBody, baseRepairRequirement] = practice[week - 1];
  const dayKey = String(week) + '-' + day;
  const guidance = focusedFoundationExerciseGuidance[dayKey] ?? {};
  const dailyCase = focusedFoundationDailyCases[dayKey] ?? foundationDailyCases[dayKey] ?? advancedDailyCases[dayKey];
  const [title, choicePrompt, options, answer, traceCode, traceAnswers, baseCodeLinesForDay, baseErrorLineForDay, baseErrorExplanationForDay] = dailyCase ?? [baseTitle, baseChoicePrompt, baseOptions, baseAnswer, baseTraceCode, baseTraceAnswers, baseCodeLines, baseErrorLine, baseErrorExplanation];
  if (!Array.isArray(options)) throw new TypeError(`Daily JavaScript choice options are missing for week ${week}, day ${day}`);
  const choiceFeedback = focusedFoundationChoiceFeedback[dayKey];
  const errorVariant = focusedFoundationErrorVariants[dayKey] ?? foundationErrorVariants[dayKey];
  const [codeLines, errorLine, errorExplanation] = errorVariant ?? [baseCodeLinesForDay, baseErrorLineForDay, baseErrorExplanationForDay];
  const variant = foundationRepairVariants[dayKey] ?? foundationAdvancedRepairVariants[dayKey];
  const [functionName, starterCode, repairBody, repairRequirement, exampleCheck, testCheck] = variant ?? [baseFunctionName, baseStarterCode, baseRepairBody, baseRepairRequirement];
  const checks = variant ? [exampleCheck, testCheck] : repairChecks[functionName];
  if (!checks) throw new Error(`Missing repair checks for ${functionName}`);
  const dayLens = revisedFoundationDays.has(dayKey) ? '' : [
    '새 개념을 처음 적용하는 상황에서',
    '입력과 출력의 관계를 확인하는 상황에서',
    '경계 조건을 검토하는 상황에서',
    '기능을 구현하기 전 설계하는 상황에서',
    '한 주의 학습을 마무리하며 리뷰하는 상황에서',
  ][day - 1];
  const questionId = (suffix) => {
    const version = versionedFoundationQuestionDays.has(dayKey) ? 3 : revisedFoundationDays.has(dayKey) ? 2 : 0;
    return `js-w${week}-d${day}-${suffix}${dayKey === '5-3' && suffix === 'debug' ? '-v3' : version ? `-v${version}` : ''}`;
  };
  const preservePriorQuestionIds = (exercise, suffix) => {
    if (!versionedFoundationQuestionDays.has(dayKey)) return exercise;
    const previousId = `js-w${week}-d${day}-${suffix}`;
    exercise.legacyIds = [...new Set([...(exercise.legacyIds ?? []), previousId, `${previousId}-v2`])];
    return exercise;
  };
  const makeChoice = (suffix, focus) => preservePriorQuestionIds(choice(
    questionId(suffix), `${title} · ${focus}`, `${dayLens ? `${dayLens} ` : ''}${choicePrompt}`,
    options.map((text, index) => [text, choiceFeedback?.[index] ?? (index === answer
      ? `이 선택은 ${title}에서 요구한 동작을 만듭니다.`
      : `“${text}”를 선택하면 ${title}의 입력·조건·결과 중 하나를 만족하지 못합니다.`)]),
    answer, guidance.choice ?? '문제에서 요구한 동작과 조건을 먼저 확인한 뒤, 각 선택지가 그 조건을 만족하는지 비교해 보세요.', choiceFeedback?.[answer] ?? `정답은 코드의 실제 동작과 ${title}의 요구사항을 함께 만족합니다. 다른 선택지는 문법의 역할이나 경계 조건이 다릅니다.`,
  ), suffix);
  const makeTrace = (suffix, focus) => outputTrace(
    questionId(suffix), `${title} · ${focus}`, `${dayLens ? `${dayLens} ` : ''}다음 코드가 실행된 뒤 콘솔에 출력되는 값을 적으세요.\n\n\`${traceCode}\``, traceAnswers,
    guidance.trace ?? '선언, 호출, 연산이 어떤 순서로 실행되는지 한 줄씩 따라가 보세요.', guidance.traceExplanation ?? `예상 출력은 \`${traceAnswers[0]}\`입니다. 선언, 호출, 연산을 차례대로 추적해 이 결과가 나오는 이유를 확인하세요.`,
  );
  const makeDebug = (suffix, focus) => preservePriorQuestionIds(locateError(
    questionId(suffix), `${title} · ${focus}`, `${dayLens ? `${dayLens} ` : ''}${title} 요구사항과 다른 동작을 만드는 줄을 고르세요.`, 'JavaScript', codeLines, [errorLine],
    guidance.debug ?? '각 줄이 값, 참조, 호출 중 무엇을 하는지 확인해 보세요.', errorExplanation,
  ), suffix);
  const makeRepair = (suffix, focus) => repairCode({
    id: `js-w${week}-d${day}-${suffix}${versionedFoundationRepairDays.has(dayKey) ? '-v2' : ''}`, title: `${title} · ${focus}`,
    prompt: `${dayLens ? `${dayLens} ` : ''}아래 \`${functionName}\` 함수를 요구사항에 맞게 고치세요. ${repairRequirement} 이 문제의 자동 평가는 코드를 실행하지 않고 함수 구조와 핵심 표현식을 검사합니다.`, language: 'JavaScript', starterCode,
    solutionPatterns: [
      exactFunctionRepairPattern(functionName, starterCode, repairBody),
      ...(javascriptRepairAlternativeBodies[dayKey] ?? []).map((body) => exactFunctionRepairPattern(functionName, starterCode, body)),
      ...(foundationRepairAlternativePatterns[dayKey] ?? []),
    ],
    acceptanceCriteria: { requirements: [repairRequirement], constraints: ['함수 이름과 매개변수는 유지한다.', '요구사항과 무관한 전역 상태를 변경하지 않는다.'], examples: [{ input: checks[0][0], output: checks[0][1] }], tests: [{ input: checks[1][0], expected: checks[1][1] }] },
    gradingNote: '자동 평가는 코드를 실행하지 않습니다. 함수 선언과 핵심 반환/검사 구조만 확인하므로 실제 서비스에서는 별도 실행 테스트가 필요합니다.', hint: guidance.repair ?? '요구사항을 입력 조건, 변환, 반환값으로 나누어 작성해 보세요.', explanation: focusedFoundationRepairExplanations[dayKey] ?? `${repairRequirement} 반환값과 부수 효과를 분리하면 호출자가 함수를 예측하기 쉬워집니다.`,
  });
  const makeSnippetRepair = (focus) => {
    const snippet = foundationSnippetRepairVariants[dayKey];
    if (!snippet) throw new Error(`Missing JavaScript snippet repair for ${dayKey}`);
    const exercise = repairCode({
      id: `js-w${week}-d${day}-repair-v2`, title: `${title} · ${focus}`,
      prompt: `아래 코드를 요구사항에 맞게 고치세요. ${snippet.requirement}\n\n제출 코드는 자동으로 실행하지 않으므로 제시된 예제와 확인 조건을 직접 실행해 결과도 살펴보세요.`,
      language: 'JavaScript', starterCode: snippet.starterCode, solutionPatterns: snippet.solutionPatterns,
      acceptanceCriteria: {
        requirements: [snippet.requirement],
        constraints: ['이번 주까지 배운 문법으로 작성한다.'],
        examples: [snippet.example],
        tests: [snippet.check],
      },
      gradingNote: '자동 평가는 코드를 실행하지 않고 핵심 코드 모양을 확인합니다. 예제와 확인 조건을 직접 실행해 빈 입력이나 경계에서도 결과를 점검하세요.',
      hint: guidance.repair ?? '예제의 입력과 기대 결과를 비교하고 바꿔야 할 한 줄을 찾아보세요.',
      explanation: focusedFoundationRepairExplanations[dayKey] ?? snippet.requirement,
    });
    exercise.legacyIds = [`js-w${week}-d${day}-repair`];
    return exercise;
  };
  const set = week <= 3 && day === 4 ? [makeChoice('concept', '개념 판단'), makeDebug('debug', '오류 분석'), makeSnippetRepair('코드 수정')]
    : week <= 3 && day === 5 ? [makeSnippetRepair('복습 구현'), makeChoice('concept', '개념 판단'), makeTrace('trace', '실행 추적')]
      : day === 1 ? [makeChoice('concept', '개념 판단'), makeTrace('trace', '실행 추적'), makeDebug('debug', '오류 분석')]
    : day === 2 ? [makeTrace('trace', '값 계산'), makeDebug('debug', '경계 확인'), makeChoice('concept', 'API 선택')]
      : day === 3 ? [makeDebug('debug', '원인 찾기'), makeChoice('concept', '설계 판단'), makeTrace('trace', '결과 예측')]
        : day === 4 ? [makeChoice('concept', '적용 계획'), makeDebug('debug', '수정 전 점검'), makeRepair('repair', '코드 수정')]
          : [makeRepair('repair', '복습 구현'), makeChoice('concept', '요구사항 검토'), makeTrace('trace', '최종 확인')];
  return set;
}

function sessionExercises(week, day) { return specificExercises(week, day); }

function legacyExerciseDaysForWeek(week) {
  if (week === 7) return [1, 2, 1];
  if (week === 9) return [4, 2, 3];
  return week === 1 ? [2, 2, 2] : [1, 2, 3];
}

function progressiveExamples(week, subject) {
  if (week === 26) {
    return [1, 2, 3, 4, 5].map((day) => advancedDailyCases[`26-${day}`][4]);
  }
  const practiceCase = practice[week - 1];
  const traceCode = practiceCase[4];
  const errorLines = practiceCase[6];
  const starterCode = practiceCase[10];
  const repairBody = practiceCase[11];
  const header = starterCode.slice(0, starterCode.indexOf('{')).trimEnd();
  const repairedCode = `${header} {\n  ${repairBody}\n}\n// 수정한 함수의 대표 입력과 빈 경계도 확인하세요.`;
  const dayFiveRepair = foundationAdvancedRepairVariants[`${week}-5`];
  const dayFiveExample = dayFiveRepair
    ? `${dayFiveRepair[1].slice(0, dayFiveRepair[1].indexOf('{')).trimEnd()} {\n  ${dayFiveRepair[2]}\n}\n// 대표 입력과 경계 결과를 확인하세요.`
    : repairedCode;
  return [subject[2], traceCode, errorLines.join('\n'), starterCode, dayFiveExample];
}

function weeklySessions(week, subject) {
  if (reviewedJavaScriptWeeks[week]) return reviewedJavaScriptWeeks[week].sessions;
  const focus = [
    '핵심 규칙과 선택 근거를 설명합니다.',
    '대표 입력을 코드에 넣어 반환값을 단계별로 계산합니다.',
    '실패하거나 잘못된 결과를 만드는 조건과 줄을 확인합니다.',
    '함수 구조를 유지하면서 요구사항을 코드로 구현합니다.',
    '빈 값과 경계 입력에서 결과를 다시 확인하고 이유를 설명합니다.',
  ];
  const examples = progressiveExamples(week, subject);
  return [1, 2, 3, 4, 5].map((day) => studySession(
    day,
    `${day}일차 · ${subject[0]} ${['판단', '추적', '디버깅', '수정', '검증'][day - 1]}`,
    `${subject[0]}: ${focus[day - 1]} ${subject[3]}`,
    `${subject[1]} ${focus[day - 1]}`,
    examples[day - 1],
    sessionExercises(week, day),
  ));
}

const reviewedJavaScriptWeeks = {
  13: {
    objective: '문자열의 공백·영문 대소문자·유니코드 정규화 정책을 구분해 안전하게 비교하고 검색합니다.',
    overviewExample: 'function normalizeQuery(value) {\n  return value.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase();\n}\nconst query = normalizeQuery("  Cafe\\u0301   JS  ");\nconsole.log(query); // café js',
    sessions: [
      studySession(1, '1일차 · 공백과 대소문자 정규화', '영문 코스 이름의 앞뒤 공백을 제거하고 소문자로 바꿔 대소문자 차이를 무시합니다.', 'trim은 양 끝 공백만 제거하고 toLowerCase는 기본 유니코드 소문자 규칙을 적용합니다. 이 예제는 React 같은 영문 이름에 한정하며, 다른 언어의 검색은 서비스에 맞는 문자 비교 정책을 정해야 합니다.', 'function normalizeQuery(value) {\n  return value.trim().toLowerCase();\n}\nconsole.log(normalizeQuery("  React  ")); // react', [
        choice('js-w13-d1-normalize-v2', '검색어 정규화 선택', '영문 코스 이름 "  React  "와 "react"를 대소문자 차이 없이 비교하려면 어떤 처리가 알맞나요?', [
          ['양쪽 값을 `trim().toLowerCase()`로 정규화한 뒤 비교한다', '이 영문 이름 예제에서는 양끝 공백과 대소문자 차이를 모두 없앤 뒤 같은 정책으로 비교합니다.'],
          ['양쪽 값에 `trim()`만 적용한다', '공백은 제거하지만 `React`와 `react`의 대소문자 차이는 남습니다.'],
          ['양쪽 값에 `toLowerCase()`만 적용한다', '대소문자는 맞춰도 앞뒤 공백이 남아 일치하지 않습니다.'],
        ], 0, '공백 제거와 대소문자 변경은 서로 다른 작업입니다. 두 입력에 모두 필요한 처리를 적용하세요.', '이 영문 이름 예제의 검색 정책이 대소문자를 무시하므로 비교 전에 양쪽 값을 같은 방식으로 정규화해야 합니다.'),
        outputTrace('js-w13-d1-trace-v2', '정규화 출력 추적', '다음 코드가 출력하는 문자열을 적으세요.\n\n`const query = "  React  ";\nconsole.log(query.trim().toLowerCase());`', ['react'], 'trim 뒤에 남은 대문자가 어떻게 바뀌는지 확인하세요.', 'trim은 양끝 공백을 없애고 toLowerCase는 영문 대문자를 소문자로 바꾸므로 `react`가 출력됩니다.'),
        locateError('js-w13-d1-error-v2', '비교 전에 빠진 정규화 찾기', '대소문자를 무시하고 검색해야 합니다. 요구를 깨뜨리는 줄을 고르세요.', 'JavaScript', ['const query = "  React  ";', 'const key = query.trim().toLowerCase();', 'if (query.includes(key)) showResults();'], [3], '정규화한 key를 만들었는데 비교에는 어느 변수를 사용했는지 확인하세요.', '3번 줄은 원본 query를 검색해 앞 공백과 대문자 때문에 일치하지 않습니다. 양쪽 값을 같은 정책으로 정규화해 비교해야 합니다.'),
      ]),
      studySession(2, '2일차 · 연속 공백 접기', '입력 문자열의 탭·줄바꿈·연속 공백을 한 칸으로 접고 앞뒤 공백을 제거합니다.', 'replace의 정규식 플래그가 결과 범위를 결정합니다. 첫 항목만 바꾸는지, 모든 공백 묶음을 바꾸는지 입력으로 확인하세요.', 'function normalizeLabel(value) {\n  return value.trim().replace(/\\s+/gu, " ");\n}\nconsole.log(normalizeLabel("  JS\\t  기초  ")); // JS 기초', [
        outputTrace('js-w13-d2-trace-v2', '탭과 여러 공백의 출력', '다음 코드의 출력값을 적으세요.\n\n`const label = "JS\\t  기초";\nconsole.log(label.trim().replace(/\\s+/gu, " "));`', ['JS 기초'], '정규식 `\\s+`는 연속된 공백류 문자 묶음을 찾고 g는 다음 묶음도 처리합니다.', '탭과 두 칸 공백이 하나의 공백으로 바뀌어 `JS 기초`가 출력됩니다.'),
        locateError('js-w13-d2-error-v2', '첫 공백만 바꾸는 오류 찾기', '문자열 전체의 공백 묶음을 한 칸으로 접어야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['function compact(value) {', '  return value.trim().replace(" ", " ");', '}', 'console.log(compact("JS   기초"));'], [2], '문자열 인자를 사용한 replace가 한 번만 바꾸는지 살펴보세요.', '2번 줄의 문자열 검색은 처음 발견한 공백만 처리합니다. 탭과 모든 연속 공백을 다루려면 전역 정규식 `/\\s+/gu`가 필요합니다.'),
        choice('js-w13-d2-regex-v2', '공백 묶음 정규식 선택', '탭과 여러 공백을 각각 한 칸으로 바꾸는 패턴은 무엇인가요?', [
          ['`/\\s+/gu`를 사용해 전역 치환한다', '`\\s+`가 공백류 문자 한 개 이상을 찾고 g가 문자열 전체에서 반복합니다.'],
          ['`/ /`로 한 번만 치환한다', '일반 공백 하나만 처음 한 번 바꾸므로 탭과 뒤의 공백은 남습니다.'],
          ['`/\\s/`로 전역 플래그 없이 치환한다', '공백류 한 문자만 처음 한 번 바꾸며 연속 묶음 전체를 처리하지 않습니다.'],
        ], 0, '공백류 문자 묶음과 문자열 전체 탐색을 각각 나타내는 정규식 요소를 찾으세요.', '`\\s+`와 전역 플래그 g를 함께 써야 모든 공백 묶음을 한 칸으로 바꿉니다.'),
      ]),
      studySession(3, '3일차 · 유니코드 정규형 비교', '같은 글자가 여러 코드 포인트 조합으로 저장될 수 있음을 알고 NFC 정규화 뒤 비교합니다.', '눈에 보이는 모양이 같아도 문자열의 코드 포인트 나열이 다를 수 있습니다. NFC는 정준적으로 동등한 표현을 같은 정규형으로 맞춥니다.', 'const composed = "\\u00e9";\nconst decomposed = "e\\u0301";\nconsole.log(composed === decomposed); // false\nconsole.log(composed.normalize("NFC") === decomposed.normalize("NFC")); // true', [
        choice('js-w13-d3-nfc-v2', '정준 동등 문자열 비교', '화면에는 같은 악센트 글자로 보이는 두 문자열을 정준 정규화해 비교할 때 쓸 메서드는?', [
          ['각 문자열에 `.normalize("NFC")`를 적용한 뒤 비교한다', 'NFC는 정준적으로 동등한 코드 포인트 표현을 공통 형태로 맞춥니다.'],
          ['각 문자열에 `.trim()`만 적용한다', '양끝 공백만 제거할 뿐 문자 조합 방식은 바꾸지 않습니다.'],
          ['각 문자열에 `.toLowerCase()`만 적용한다', '대소문자만 바꾸며 조합형 유니코드 표현은 그대로 둡니다.'],
        ], 0, '대소문자나 공백 문제가 아니라 같은 문자의 코드 포인트 표현 차이를 다룹니다.', 'NFC 정규화 후 비교하면 정준적으로 같은 두 표현을 같은 문자열로 비교할 수 있습니다.'),
        outputTrace('js-w13-d3-trace-v2', 'NFC 비교 결과', '다음 코드의 마지막 출력값을 적으세요.\n\n`const a = "\\u00e9";\nconst b = "e\\u0301";\nconsole.log(a.normalize("NFC") === b.normalize("NFC"));`', ['true'], '정규화 전에는 서로 다르지만 NFC를 각각 적용한 뒤 비교합니다.', '두 문자열은 같은 문자를 정준적으로 다르게 표현합니다. 둘 다 NFC로 만든 뒤에는 같으므로 `true`입니다.'),
        locateError('js-w13-d3-error-v2', '겉모양만 같은 문자열 비교 오류', '정준적으로 같은 유니코드 문자열을 비교해야 합니다. 요구를 놓친 줄을 고르세요.', 'JavaScript', ['const a = "\\u00e9";', 'const b = "e\\u0301";', 'const same = a === b;', 'console.log(same);'], [3], '두 값이 같은 글자를 표현해도 코드 포인트 배열이 같다고 보장되는지 확인하세요.', '3번 줄은 정규화 전 문자열을 직접 비교합니다. 비교 정책이 정준 동등성을 요구하면 양쪽에 같은 NFC 정규화를 적용해야 합니다.'),
      ]),
      studySession(4, '4일차 · 빈 검색어와 검색 결과', '검색어를 정규화한 다음 빈 문자열인지 먼저 검사해 의도하지 않은 전체 결과 노출을 막습니다.', '빈 문자열은 모든 문자열에서 찾을 수 있습니다. 검색 기능이 빈 입력일 때 전체 목록을 보여 줄지 숨길지 정책을 정하고 코드로 표현하세요.', 'function findCourses(courses, query) {\n  const key = query.trim().toLowerCase();\n  if (key === "") return [];\n  return courses.filter((course) => course.toLowerCase().includes(key));\n}\nconsole.log(findCourses(["Java", "React"], "   ").length); // 0', [
        choice('js-w13-d4-empty-v2', '빈 검색어 정책', '공백만 입력했을 때 검색 결과가 모두 표시되지 않도록 하려면 어떤 순서가 안전한가요?', [
          ['검색어를 정규화하고 빈 문자열이면 결과를 반환하지 않는다', '공백만 있는 입력을 먼저 빈 값으로 판정해 빈 문자열 검색이 전체 일치하는 문제를 막습니다.'],
          ['원본 검색어를 그대로 모든 제목의 includes에 전달한다', '공백 입력은 대개 아무 결과도 찾지 못하고 대소문자 정책도 적용되지 않습니다.'],
          ['빈 검색어도 그대로 includes에 전달한다', '빈 문자열은 모든 문자열에 포함되므로 전체 코스가 반환될 수 있습니다.'],
        ], 0, '먼저 공백과 대소문자 정책을 적용하고, 정규화 결과가 비었는지 검사하세요.', '정규화 결과가 빈 문자열이면 검색을 계속하지 않도록 명시적인 빈 검색 정책을 구현합니다.'),
        locateError('js-w13-d4-error-v2', '빈 문자열이 전체와 일치하는 오류', '공백 입력에서 결과를 숨기는 계약을 깨뜨리는 줄을 고르세요.', 'JavaScript', ['function search(items, query) {', '  const key = query.trim().toLowerCase();', '  return items.filter((item) => item.toLowerCase().includes(key));', '}'], [3], 'key가 빈 문자열일 때 includes의 결과를 생각해 보세요.', '3번 줄은 빈 key를 검사하지 않고 includes에 전달합니다. 빈 문자열은 모든 제목에 포함되므로 빈 결과를 반환하는 분기가 먼저 필요합니다.'),
        repairCode({ id: 'js-w13-d4-repair-v2', title: '검색어 정규화 함수 작성', prompt: '아래 `normalizeQuery`를 고치세요. 양끝 공백을 제거하고 소문자로 반환합니다. 평가는 코드를 실행하지 않고 전체 함수 구조를 검사합니다.', language: 'JavaScript', starterCode: 'function normalizeQuery(query) {\n  return query;\n}', solutionPatterns: [String.raw`^\s*function\s+normalizeQuery\s*\(\s*query\s*\)\s*\{\s*return\s+query\.trim\(\)\.toLowerCase\(\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['검색어의 앞뒤 공백을 제거하고 소문자로 만든 문자열을 반환한다.'], constraints: ['입력 문자열을 변경하지 않는다.'], examples: [{ input: '" React "', output: '"react"' }], tests: [{ input: '"  JS  "', expected: '"js"' }] }, gradingNote: '전체 함수 모양을 검사하는 정적 패턴 채점이며 코드를 실행하지 않습니다.', hint: '문자열 메서드를 연결해 정규화한 결과를 반환하세요.', explanation: 'trim으로 경계 공백을 제거한 뒤 toLowerCase로 대소문자 차이를 줄입니다.' }),
      ]),
      studySession(5, '5일차 · 검색 정규화 통합 점검', '공백·연속 공백·유니코드 정규형을 검색 키에 일관되게 적용하고 빈 검색을 별도로 처리합니다.', '정규화는 데이터를 표시할 때 무조건 바꾸는 규칙이 아닙니다. 비교·검색 계약에 필요한 변환만 적용하고 원래 표시 문자열은 보존합니다.', 'function normalizeTag(tag) {\n  return tag.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase();\n}\nconsole.log(JSON.stringify(normalizeTag("  Cafe\\u0301   JS  "))); // "café js"', [
        repairCode({ id: 'js-w13-d5-repair-v2', title: '태그 정규화 함수 작성', prompt: '아래 `normalizeTag`를 고치세요. 양끝 공백을 제거하고 공백 묶음은 한 칸으로 접은 뒤 NFC와 소문자로 정규화합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function normalizeTag(tag) {\n  return tag;\n}', solutionPatterns: [String.raw`^\s*function\s+normalizeTag\s*\(\s*tag\s*\)\s*\{\s*return\s+tag\.trim\(\)\.replace\(\s*\/\\s\+\/gu\s*,\s*" "\s*\)\.normalize\(\s*"NFC"\s*\)\.toLowerCase\(\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['양끝 공백을 지우고 내부 공백 묶음은 한 칸으로 바꾼 후 NFC·소문자 형태를 반환한다.'], constraints: ['입력 문자열 자체를 변경하지 않는다.'], examples: [{ input: '" Cafe\\u0301   JS "', output: '"café js"' }], tests: [{ input: '"  JS   기초  "', expected: '"js 기초"' }] }, gradingNote: '함수 구조를 검사하는 정적 패턴 평가로 JavaScript를 실행하지 않습니다.', hint: 'trim → replace → normalize → toLowerCase 순서로 반환식을 만드세요.', explanation: '비교 정책에 필요한 공백 정리와 NFC 정규화를 한 순서로 적용합니다. 화면에 표시할 원본 문자열은 별도로 보존하세요.' }),
        choice('js-w13-d5-policy-v2', '정규화 정책과 표시값 구분', '검색용으로 정규화한 문자열을 화면에도 그대로 덮어써야 하나요?', [
          ['아니요. 검색용 키와 원래 표시 문자열을 별도로 보관한다', '비교 정책에 맞춘 검색 키를 만들더라도 사용자가 입력하거나 제목에 적힌 원본 표시를 보존할 수 있습니다.'],
          ['항상 NFKC로 바꾼 문자열만 저장한다', '호환 정규화는 일부 표시상 다른 문자를 하나로 바꿀 수 있어 모든 저장·표시에 적합하지 않습니다.'],
          ['정규화 없이 대소문자와 공백 정책을 기대한다', '문자열 비교는 기본적으로 공백·대소문자·정규형 차이를 자동으로 없애지 않습니다.'],
        ], 0, '비교에 사용할 키와 사용자에게 보여 줄 원본 값의 역할을 구분하세요.', '정규화는 기능 계약에 맞게 비교용으로 적용하고, 표시용 원본을 보존하는 편이 안전합니다.'),
        outputTrace('js-w13-d5-trace-v2', '통합 검색 키 출력', '다음 코드의 출력 문자열을 적으세요.\n\n`const value = "  Cafe\\u0301   JS  ";\nconsole.log(value.trim().replace(/\\s+/gu, " ").normalize("NFC").toLowerCase());`', ['café js'], '양끝 공백 제거, 내부 공백 묶음 치환, NFC, 소문자 변환 순으로 적용하세요.', '정규화 뒤 결과는 공백 하나로 구분된 소문자 `café js`입니다.'),
      ]),
    ],
  },
  14: {
    objective: 'Date의 UTC 타임스탬프와 표시 시간대를 구분하고, 유효성·경과 시간 계산을 명시적으로 다룹니다.',
    overviewExample: 'const start = new Date("2026-10-11T09:00:00Z");\nconst end = new Date("2026-10-11T09:00:02Z");\nconsole.log(end.getTime() - start.getTime()); // 2000 milliseconds',
    sessions: [
      studySession(1, '1일차 · ISO 시각과 시간대', '시간대가 포함된 표준 ISO 날짜 문자열을 Date로 파싱하고 UTC 문자열로 확인합니다.', 'Date는 한 순간의 타임스탬프를 저장하며 시간대 자체를 보존하지 않습니다. 시간대가 없는 날짜-시간 문자열은 실행 환경의 현지 시간으로 해석될 수 있으므로 입력 계약을 분명히 하세요.', 'const due = new Date("2026-10-11T09:00:00Z");\nconsole.log(due.toISOString()); // 2026-10-11T09:00:00.000Z', [
        choice('js-w14-d1-utc-v2', '서버 시각 입력 형식 선택', '서버가 전달한 시각을 어느 지역에서 읽어도 같은 순간으로 파싱하려면 어떤 입력이 좋나요?', [
          ['`2026-10-11T09:00:00Z`처럼 시간대 오프셋을 포함한다', 'Z는 UTC 오프셋을 명시하므로 현지 시간대 설정에 따라 순간이 달라지지 않습니다.'],
          ['`2026-10-11T09:00:00`처럼 오프셋 없이 보낸다', '시간대 없는 날짜-시간 문자열은 실행 환경의 현지 시간으로 해석됩니다.'],
          ['`2026/10/11 09:00` 같은 비표준 문자열을 보낸다', '비표준 문자열 형식의 파싱은 브라우저별 동작을 보장하지 않습니다.'],
        ], 0, '입력 자체가 UTC인지 현지 시각인지 식별할 시간대 정보가 있는지 확인하세요.', '서버와 클라이언트가 같은 순간을 해석하도록 ISO 문자열에 Z 또는 명시적 오프셋을 포함합니다.'),
        outputTrace('js-w14-d1-trace-v2', 'ISO 시각의 UTC 출력', '다음 코드의 출력을 적으세요.\n\n`const due = new Date("2026-10-11T09:00:00Z");\nconsole.log(due.toISOString());`', ['2026-10-11T09:00:00.000Z'], 'toISOString은 UTC 표기 Z와 밀리초 자릿수를 포함합니다.', '지정한 시각은 이미 UTC입니다. toISOString은 같은 순간을 `2026-10-11T09:00:00.000Z`로 표시합니다.'),
        locateError('js-w14-d1-error-v2', '현지 시간으로 달라지는 파싱 찾기', '서비스 간에 같은 순간으로 해석되어야 합니다. 시간대가 빠진 줄을 고르세요.', 'JavaScript', ['const sentAt = new Date("2026-10-11T09:00:00Z");', 'const dueAt = new Date("2026-10-11T09:00:00");', 'console.log(sentAt.toISOString(), dueAt.toISOString());'], [2], '두 문자열 중 어느 하나에만 Z나 오프셋이 있는지 비교하세요.', '2번 줄의 날짜-시간 문자열에는 시간대가 없습니다. 이 형식은 현지 시간으로 해석될 수 있어 실행 기기의 시간대에 따라 다른 순간이 됩니다.'),
      ]),
      studySession(2, '2일차 · 타임스탬프 간격', 'Date의 getTime 값은 epoch 이후 밀리초이므로 차를 이용해 경과 시간을 계산합니다.', 'Date 객체의 달력 날짜 부분은 경과 시간을 뜻하지 않습니다. 두 타임스탬프의 차를 밀리초 단위로 먼저 구한 다음 필요한 단위로 바꾸세요.', 'const start = new Date("2026-10-11T09:00:00Z");\nconst end = new Date("2026-10-11T09:00:02Z");\nconsole.log(end.getTime() - start.getTime()); // 2000', [
        outputTrace('js-w14-d2-trace-v2', '두 초 사이의 밀리초', '다음 코드가 출력하는 수를 적으세요.\n\n`const start = new Date("2026-10-11T09:00:00Z");\nconst end = new Date("2026-10-11T09:00:02Z");\nconsole.log(end.getTime() - start.getTime());`', ['2000'], 'Date 타임스탬프 한 단위는 밀리초입니다. 2초를 밀리초로 바꾸세요.', '두 시각의 차는 2초이며 1초는 1000밀리초이므로 `2000`입니다.'),
        locateError('js-w14-d2-error-v2', '달력 날짜를 경과 시간으로 쓰는 오류', '두 시각 사이의 전체 간격을 밀리초로 반환해야 합니다. 틀린 줄을 고르세요.', 'JavaScript', ['function elapsedMs(start, end) {', '  return end.getUTCDate() - start.getUTCDate();', '}', 'console.log(elapsedMs(new Date(0), new Date(2000)));'], [2], 'UTC 날짜 구성요소와 전체 epoch 밀리초 값은 서로 다른 정보를 줍니다.', '2번 줄은 월의 날짜 부분 차이만 구합니다. 경과 밀리초에는 `end.getTime() - start.getTime()`을 사용해야 합니다.'),
        choice('js-w14-d2-units-v2', '경과 시간 단위 변환', '밀리초 차이를 시간 단위로 바꾸는 식은 무엇인가요?', [
          ['`(end.getTime() - start.getTime()) / 3_600_000`', '한 시간은 3,600초이고 1초는 1,000밀리초이므로 3,600,000으로 나눕니다.'],
          ['`end.getDate() - start.getDate()`', '월의 일(day-of-month)만 빼므로 월 경계를 지나면 틀리고 단위도 시간이 아닙니다.'],
          ['`(end.getTime() - start.getTime()) * 60`', '밀리초 차이에 60을 곱하면 더 커지며 시간 단위 변환이 아닙니다.'],
        ], 0, '밀리초에서 시간으로 바꿀 때 한 시간에 몇 밀리초가 있는지 계산하세요.', '밀리초 차를 3,600,000으로 나누면 시간 단위의 경과값을 얻습니다.'),
      ]),
      studySession(3, '3일차 · 고정 시간대 표시', '하나의 순간을 원하는 지역 시간대로 표시하려면 Intl.DateTimeFormat에 timeZone을 지정합니다.', 'Date는 기기 현지 시간대로 표시될 수 있습니다. 고정된 업무 지역이나 사용자 선택 지역을 보여 줄 때는 표시 시간대를 코드에서 명시하세요.', 'const instant = new Date("2026-10-11T09:00:00Z");\nconst formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });\nconsole.log(formatter.format(instant)); // 18:00', [
        locateError('js-w14-d3-error-v2', '기기 시간대에 묶인 표시 찾기', '모든 학습자에게 서울 업무 시간대로 표시해야 합니다. 어느 줄을 고쳐야 하나요?', 'JavaScript', ['const instant = new Date("2026-10-11T09:00:00Z");', 'const label = instant.toLocaleString("ko-KR");', 'console.log(label);'], [2], 'toLocaleString에 표시 시간대를 따로 지정하지 않은 경우를 살펴보세요.', '2번 줄은 실행 기기의 기본 시간대를 사용합니다. 원하는 지역의 표시를 보장하려면 Intl.DateTimeFormat 옵션에 `timeZone`을 지정하세요.'),
        choice('js-w14-d3-format-v2', '지역 시간 표시 선택', 'UTC 순간을 항상 서울 시간으로 표시하려면 어떤 설정이 필요하나요?', [
          ['`Intl.DateTimeFormat` 옵션에 `timeZone: "Asia/Seoul"`을 준다', '표시 지역을 명시하면 사용자의 기기 기본 시간대에 좌우되지 않습니다.'],
          ['문자열에 `+9`를 덧붙인다', '표시 문자열을 임의로 바꾸는 것은 날짜를 시간대로 변환하는 안전한 방법이 아닙니다.'],
          ['`getHours()` 값을 사용한다', 'getHours는 실행 환경의 현지 시각을 반환하므로 지역을 고정하지 않습니다.'],
        ], 0, '계산용 순간을 바꾸지 말고 표시 포맷터에서 목표 시간대를 지정하세요.', 'Intl.DateTimeFormat의 timeZone 옵션으로 표시 시간대를 고정합니다.'),
        outputTrace('js-w14-d3-trace-v2', '서울 시간대 표시 추적', '다음 코드의 출력을 적으세요.\n\n`const instant = new Date("2026-10-11T09:00:00Z");\nconsole.log(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(instant));`', ['18:00'], '서울은 이 예제 시각에서 UTC보다 9시간 빠릅니다.', '09:00 UTC에 9시간을 더하면 서울의 18:00이므로 출력은 `18:00`입니다.'),
      ]),
      studySession(4, '4일차 · 잘못된 Date 검증', '유효하지 않은 Date는 NaN 타임스탬프를 갖습니다. 비교 전에 유효성을 확인합니다.', '잘못된 날짜를 문자열과 직접 비교하거나 Invalid Date 객체끼리 비교하지 마세요. `getTime()`이 NaN인지 확인해 유효성을 판단하고, 유효한 시각끼리 비교하세요.', 'function isValidDate(date) {\n  return date instanceof Date && !Number.isNaN(date.getTime());\n}\nconsole.log(isValidDate(new Date("not-a-date")), isValidDate(new Date(0))); // false true', [
        choice('js-w14-d4-invalid-v2', '잘못된 Date 판별', '파싱에 실패했을 수 있는 Date 객체의 타임스탬프 유효성을 검사하는 조건은?', [
          ['`Number.isNaN(date.getTime())`를 확인한다', '잘못된 Date의 숫자 타임스탬프는 NaN이므로 이를 검사할 수 있습니다.'],
          ['`date === "Invalid Date"`를 검사한다', 'Date 객체와 toString 결과 문자열을 서로 비교하므로 실패 여부를 확인하지 못합니다.'],
          ['`date.getTime() === NaN`을 검사한다', 'NaN은 자기 자신과도 같지 않아 이 비교는 항상 false입니다.'],
        ], 0, 'NaN은 일반 숫자와 동등 비교할 수 없습니다. 전용 검사 API를 생각하세요.', 'Number.isNaN으로 getTime 결과를 검사해야 잘못된 Date를 알아낼 수 있습니다.'),
        locateError('js-w14-d4-error-v2', 'NaN과 직접 비교하는 오류', '파싱 실패를 올바르게 감지해야 합니다. 잘못된 조건을 고르세요.', 'JavaScript', ['function isValidDate(date) {', '  return date.getTime() !== NaN;', '}', 'console.log(isValidDate(new Date("bad")));'], [2], 'NaN === NaN이 참인지 거짓인지 떠올려 보세요.', '2번 줄의 NaN 직접 비교는 항상 예상과 다른 결과를 냅니다. `!Number.isNaN(date.getTime())`처럼 전용 검사 함수를 사용하세요.'),
        repairCode({ id: 'js-w14-d4-repair-v2', title: 'Date 유효성 검사 함수 작성', prompt: '아래 `isValidDate`를 고치세요. Date 객체를 받고 유효한 날짜면 true, 아니면 false를 반환합니다. 정적 패턴 채점이며 코드를 실행하지 않습니다.', language: 'JavaScript', starterCode: 'function isValidDate(date) {\n  return true;\n}', solutionPatterns: [String.raw`^\s*function\s+isValidDate\s*\(\s*date\s*\)\s*\{\s*return\s+date\s+instanceof\s+Date\s*&&\s*!Number\.isNaN\(date\.getTime\(\)\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['Date 인스턴스이면서 getTime 결과가 NaN이 아닐 때만 true를 반환한다.'], constraints: ['NaN을 직접 동등 비교하지 않는다.'], examples: [{ input: 'new Date(0)', output: 'true' }], tests: [{ input: 'new Date("bad")', expected: 'false' }] }, gradingNote: '전체 함수 구조를 확인하는 패턴 평가로 Date를 실행하지 않습니다.', hint: 'Date 인스턴스 여부와 getTime의 NaN 여부를 각각 확인하세요.', explanation: '잘못된 Date는 getTime에서 NaN을 돌려줍니다. Number.isNaN을 사용하면 유효한 Date만 통과시킬 수 있습니다.' }),
      ]),
      studySession(5, '5일차 · 경과 시간 통합 검증', '명시적인 두 타임스탬프 차로 경과 시간을 구하고, 입력이 역순이면 음수가 된다는 계약도 확인합니다.', '경과 시간과 달력 날짜 이동은 다른 문제입니다. 서머타임이 적용되는 지역에서 현지 달력의 하루가 늘 24시간이라고 가정하지 말고, 실제 타임스탬프 차 또는 달력 규칙을 선택하세요.', 'function hoursBetween(start, end) {\n  return (end.getTime() - start.getTime()) / 3_600_000;\n}\nconsole.log(hoursBetween(new Date(0), new Date(7_200_000))); // 2', [
        repairCode({ id: 'js-w14-d5-repair-v2', title: '경과 시간을 시간 단위로 계산', prompt: '아래 `hoursBetween`을 고치세요. 유효한 Date `start`, `end`의 경과 시간을 시간 단위로 반환하며 end가 더 이르면 음수도 그대로 반환합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function hoursBetween(start, end) {\n  return 0;\n}', solutionPatterns: [String.raw`^\s*function\s+hoursBetween\s*\(\s*start\s*,\s*end\s*\)\s*\{\s*return\s*\(\s*end\.getTime\(\)\s*-\s*start\.getTime\(\)\s*\)\s*\/\s*3600000\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['두 Date 타임스탬프의 차를 밀리초에서 시간으로 바꿔 반환한다.'], constraints: ['끝이 시작보다 이르면 음수 결과를 숨기지 않는다.'], examples: [{ input: 'new Date(0), new Date(7_200_000)', output: '2' }], tests: [{ input: 'new Date(7_200_000), new Date(0)', expected: '-2' }] }, gradingNote: '함수 구조를 검사하며 실제 Date 실행 채점은 하지 않습니다.', hint: 'end와 start의 getTime 차를 구해 밀리초/시간 변환값으로 나누세요.', explanation: '한 시간은 3,600,000밀리초입니다. 순서를 바꾸지 않으므로 역순 구간은 음수로 드러납니다.' }),
        choice('js-w14-d5-dst-v2', '서머타임 전환과 경과 시간', '뉴욕의 시계가 2026-03-08에 01:30에서 03:30으로 넘어가는 동안 아래 UTC 타임스탬프의 실제 경과 시간은 얼마인가요?\n\n`const start = new Date("2026-03-08T06:30:00Z");\nconst end = new Date("2026-03-08T07:30:00Z");\nconsole.log((end.getTime() - start.getTime()) / 3600000);`', [
          ['1시간', 'UTC 타임스탬프 차는 정확히 3,600,000밀리초라 실제 경과 시간은 1시간입니다. 현지 시계 표시는 DST 전환 때문에 2시간 이동합니다.'],
          ['2시간', '현지 시계 숫자의 차를 경과 시간으로 보면 서머타임 전환을 중복 계산합니다.'],
          ['24시간', '두 시각은 같은 날짜 안의 한 시간 간격이며 달력 하루가 지나지 않았습니다.'],
        ], 0, '현지 시계 숫자 차와 두 UTC 타임스탬프의 차를 따로 계산하세요.', '서머타임 전환일에는 현지 시각 표기가 크게 움직여도 실제 경과 시간은 타임스탬프 차로 구해야 합니다.'),
        outputTrace('js-w14-d5-trace-v2', '2시간 간격 확인', '다음 코드의 출력값을 적으세요.\n\n`function hoursBetween(start, end) { return (end.getTime() - start.getTime()) / 3600000; }\nconsole.log(hoursBetween(new Date(0), new Date(7200000)));`', ['2'], '7,200,000밀리초를 3,600,000으로 나누세요.', '두 타임스탬프의 차는 7,200,000밀리초이며 시간으로 바꾸면 `2`입니다.'),
      ]),
    ],
  },
  15: {
    objective: 'Set으로 중복 없는 값 모음을 만들고 Map으로 키별 값을 저장·조회·순회하는 기준을 익힙니다.',
    overviewExample: 'const counts = new Map([["js", 2], ["py", 1]]);\nconst unique = new Set(["js", "js", "py"]);\nconsole.log([...counts].map(([id, count]) => `${id}:${count}`).join(","), unique.size); // js:2,py:1 2',
    sessions: [
      studySession(1, '1일차 · Set으로 중복 제거', '중복 없는 id 집합과 고유 개수를 Set으로 표현하고 has와 size를 사용합니다.', 'Set은 같은 값의 중복 추가를 막습니다. 원시 문자열 id 비교와 객체 참조 비교는 다르게 동작하므로 이 주에는 문자열 id부터 확인합니다.', 'const ids = new Set(["js", "js", "py"]);\nconsole.log(ids.size, ids.has("py")); // 2 true', [
        choice('js-w15-d1-set-v2', '고유 id 컬렉션 선택', '중복 코스 id를 제거하고 포함 여부도 빠르게 확인하려면 어떤 자료형이 적합한가요?', [
          ['`Set`에 id를 추가하고 `has`와 `size`를 사용한다', 'Set은 같은 원시 id를 한 번만 보관하며 멤버십과 고유 개수를 확인할 수 있습니다.'],
          ['배열 길이만 저장한다', '배열은 중복을 자동으로 제거하지 않으므로 길이가 고유 개수와 다를 수 있습니다.'],
          ['각 id를 불리언 변수로 따로 만든다', 'id 종류가 늘 때마다 변수와 검사를 추가해야 하므로 일반적인 집합 관리에 맞지 않습니다.'],
        ], 0, '필요한 동작은 고유성 보장과 포함 여부 확인입니다.', 'Set은 중복을 제거하고 has/size로 필요한 두 연산을 제공합니다.'),
        outputTrace('js-w15-d1-trace-v2', '중복 제거 뒤 개수', '다음 코드의 출력값을 적으세요.\n\n`const ids = ["js", "js", "py"];\nconsole.log(new Set(ids).size);`', ['2'], '동일한 문자열 `js`는 Set에 한 번만 들어갑니다.', '고유 값은 `js`, `py` 두 개이므로 size는 `2`입니다.'),
        locateError('js-w15-d1-error-v2', '원본 배열 길이를 고유 개수로 오해', '중복을 제거한 개수를 반환해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['const ids = ["js", "js", "py"];', 'const unique = new Set(ids);', 'console.log(ids.length);'], [3], 'Set을 만들고도 어떤 자료형의 length를 출력하고 있는지 확인하세요.', '3번 줄은 중복이 있는 원본 배열의 길이 3을 출력합니다. Set의 고유 항목 수는 `unique.size`입니다.'),
      ]),
      studySession(2, '2일차 · Map으로 빈도 집계', 'Map의 키별 횟수를 읽고 갱신하며 첫 입력과 값 0을 구분합니다.', 'get은 없는 키에서 undefined를 반환합니다. `?? 0`으로 첫 누적값을 만들고, 이미 저장한 0과 없는 키를 구분할 때는 has를 사용하세요.', 'function countById(ids) {\n  const counts = new Map();\n  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);\n  return counts;\n}\nconsole.log(countById(["js", "js", "py"]).get("js")); // 2', [
        outputTrace('js-w15-d2-trace-v2', 'Map 첫 번째 누적값', '다음 코드의 출력값을 적으세요.\n\n`const counts = new Map();\ncounts.set("js", (counts.get("js") ?? 0) + 1);\nconsole.log(counts.get("js"));`', ['1'], '처음 `get("js")`는 undefined이므로 nullish 기본값 0을 사용합니다.', '0에 1을 더해 저장하므로 출력은 `1`입니다.'),
        locateError('js-w15-d2-error-v2', 'Map 값을 매번 1로 덮어쓰기', '반복 입력의 개수를 누적해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['const counts = new Map();', 'for (const id of ["js", "js"]) {', '  counts.set(id, 1);', '}', 'console.log(counts.get("js"));'], [3], '같은 id를 두 번 만나면 저장된 값이 어떻게 되는지 따라가 보세요.', '3번 줄은 매번 1로 덮어써 누적하지 않습니다. 기존 값을 읽어 1을 더한 결과를 저장해야 합니다.'),
        choice('js-w15-d2-zero-v2', '저장된 0과 없는 키 구분', 'Map에서 값 0을 저장한 키가 존재하는지 확인하는 가장 명확한 방법은?', [
          ['`map.has(key)`를 호출한다', 'has는 값이 0인지와 관계없이 키의 존재 여부를 확인합니다.'],
          ['`Boolean(map.get(key))`를 검사한다', '저장된 값이 0이면 false가 되어 존재하는 키를 놓칩니다.'],
          ['`map.get(key) ?? "없음"`만 검사한다', '저장된 0은 nullish가 아니지만 존재 여부 확인 목적은 has가 더 직접적입니다.'],
        ], 0, '키의 존재와 해당 키에 저장된 값은 별개의 정보입니다.', '값이 falsy일 수 있으므로 Map의 has 메서드로 키 존재를 확인합니다.'),
      ]),
      studySession(3, '3일차 · 객체 키와 참조 동일성', 'Map 객체 키는 구조가 아니라 객체 참조의 동일성으로 비교함을 확인합니다.', '내용이 같은 두 객체도 서로 다른 참조입니다. 구조를 키로 삼아야 한다면 안정된 원시 id를 키로 쓰거나 명시적인 직렬화 정책을 설계하세요.', 'const first = { id: 1 };\nconst second = { id: 1 };\nconst map = new Map([[first, "저장됨"]]);\nconsole.log(map.has(first), map.has(second)); // true false', [
        locateError('js-w15-d3-error-v2', '새 객체를 기존 키로 착각하는 오류', '같은 id를 가진 별도 객체도 찾아야 한다고 요구하는 코드입니다. 가정이 틀린 줄을 고르세요.', 'JavaScript', ['const first = { id: 1 };', 'const second = { id: 1 };', 'const map = new Map([[first, "저장됨"]]);', 'console.log(map.has(second));'], [4], '두 변수에 담긴 객체가 같은 참조인지 확인하세요.', '4번 줄의 조회는 false입니다. 내용이 같아도 별도 객체는 다른 참조이기 때문입니다. 같은 id로 조회하려면 저장과 조회에 원시 id를 키로 사용하세요.'),
        choice('js-w15-d3-identity-v2', 'Map 객체 키 동작', '내용이 같은 서로 다른 객체 `a`와 `b`를 Map 키로 사용할 때 기본 동작은?', [
          ['서로 다른 키로 취급한다', '객체 키는 구조 비교가 아니라 각 객체 참조의 동일성으로 비교됩니다.'],
          ['프로퍼티가 같으므로 같은 키로 취급한다', 'Map은 객체 구조를 자동으로 깊게 비교하지 않습니다.'],
          ['객체 키는 허용되지 않아 TypeError가 난다', 'Map은 객체를 포함해 어떤 값이든 키로 사용할 수 있습니다.'],
        ], 0, '두 객체가 `===`로 같은 참조인지 생각하세요.', '별도로 만든 두 객체는 프로퍼티가 같아도 서로 다른 Map 키입니다.'),
        outputTrace('js-w15-d3-trace-v2', '별도 객체 키 조회 결과', '다음 코드의 출력을 `true false` 형식으로 적으세요.\n\n`const first = { id: 1 };\nconst second = { id: 1 };\nconst map = new Map([[first, "A"]]);\nconsole.log(map.has(first), map.has(second));`', ['true false'], 'Map에 넣을 때 사용한 객체와 새로 만든 객체의 참조를 비교하세요.', '처음 객체는 Map에 넣었으므로 true이고, 내용만 같은 두 번째 객체는 다른 참조라 false입니다.'),
      ]),
      studySession(4, '4일차 · Map 삽입 순서로 순회', 'Map을 직접 반복해 키와 값을 삽입 순서대로 읽고 배열 변환 시에도 그 순서를 유지합니다.', 'Map은 반복 가능한 키-값 컬렉션입니다. 일반 객체처럼 Object.entries에 넘기지 말고 Map의 entries나 직접 순회를 사용하세요.', 'const counts = new Map([["js", 2], ["py", 1]]);\nconst labels = [...counts].map(([id, count]) => `${id}:${count}`);\nconsole.log(labels.join(",")); // js:2,py:1', [
        choice('js-w15-d4-order-v2', 'Map 항목 순회 선택', 'Map의 키와 값을 삽입된 순서대로 읽는 방법은?', [
          ['`for (const [key, value] of map)` 또는 `map.entries()`를 사용한다', 'Map 반복자는 삽입 순서대로 각 `[key, value]` 쌍을 제공합니다.'],
          ['`Object.entries(map)`를 사용한다', 'Map 항목이 일반 객체의 열거형 프로퍼티로 변환되지는 않습니다.'],
          ['`map[0]`으로 첫 항목을 읽는다', 'Map은 숫자 인덱스로 항목에 접근하는 배열이 아닙니다.'],
        ], 0, 'Map은 반복 가능한 컬렉션이며 각 순회 값은 키와 값의 쌍입니다.', 'Map 자체나 entries()를 반복하면 삽입 순서의 키-값 쌍을 받을 수 있습니다.'),
        locateError('js-w15-d4-error-v2', '객체 열거로 Map을 읽는 오류', '각 Map 항목의 `key:value`를 출력해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['const map = new Map([["js", 2], ["py", 1]]);', 'const entries = Object.entries(map);', 'console.log(entries.length);'], [2], 'Map을 일반 객체의 프로퍼티 열거 API로 읽고 있는지 확인하세요.', '2번 줄은 Map 내부 키-값 항목을 반환하지 않습니다. `[...map]` 또는 `[...map.entries()]`를 사용하세요.'),
        repairCode({ id: 'js-w15-d4-repair-v2', title: '삽입 순서의 Map 항목 반환', prompt: '아래 `orderedEntries`를 고치세요. Map의 `[key, value]` 쌍을 삽입 순서의 배열로 반환합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function orderedEntries(map) {\n  return [];\n}', solutionPatterns: [String.raw`^\s*function\s+orderedEntries\s*\(\s*map\s*\)\s*\{\s*return\s*\[\s*\.\.\.map\.entries\(\)\s*\]\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['Map의 key-value 쌍을 삽입 순서의 새 배열로 반환한다.'], constraints: ['Map을 일반 객체로 변환하지 않는다.'], examples: [{ input: 'new Map([["js", 2], ["py", 1]])', output: '[["js", 2], ["py", 1]]' }], tests: [{ input: 'new Map()', expected: '[]' }] }, gradingNote: '전체 함수 모양을 확인하는 정적 패턴 평가이며 Map 코드를 실행하지 않습니다.', hint: 'Map의 entries 반복자를 전개 문법으로 새 배열에 담으세요.', explanation: 'Map의 entries는 삽입 순서의 키-값 쌍을 반복하므로 전개하면 해당 순서가 유지된 배열을 얻습니다.' }),
      ]),
      studySession(5, '5일차 · Map과 Set 경계 통합', 'Map의 값과 키 존재를 구분하고 Set의 빈 입력·중복 제거를 실제 결과로 확인합니다.', 'Set은 삽입 순서도 유지하지만 배열 인덱스로 조회하지 않습니다. Map은 저장된 0과 누락을 has로 구분합니다. 자료구조가 제공하는 연산을 기준으로 선택하세요.', 'function uniqueIds(ids) {\n  return [...new Set(ids)];\n}\nconst counts = new Map([["done", 0]]);\nconsole.log(uniqueIds(["js", "js", "py"]).join(","), counts.has("done"), new Set([]).size); // js,py true 0', [
        repairCode({ id: 'js-w15-d5-repair-v2', title: '고유 id 목록 반환', prompt: '아래 `uniqueIds`를 고치세요. 입력 순서를 보존하면서 중복 id를 제거한 새 배열을 반환합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function uniqueIds(ids) {\n  return ids;\n}', solutionPatterns: [String.raw`^\s*function\s+uniqueIds\s*\(\s*ids\s*\)\s*\{\s*return\s*\[\s*\.\.\.new\s+Set\(\s*ids\s*\)\s*\]\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['중복을 제거한 id 배열을 입력의 첫 등장 순서대로 반환한다.'], constraints: ['입력 배열을 변경하지 않는다.'], examples: [{ input: '["js", "js", "py"]', output: '["js", "py"]' }], tests: [{ input: '[]', expected: '[]' }] }, gradingNote: '전체 함수 구조를 검사하는 정적 패턴 평가이며 JavaScript 실행은 제공하지 않습니다.', hint: 'Set으로 중복을 제거한 다음 전개해 반환 배열을 만드세요.', explanation: 'Set은 중복을 막고 삽입 순서를 유지합니다. 전개하면 입력 배열을 바꾸지 않는 새 배열을 반환합니다.' }),
        choice('js-w15-d5-boundary-v2', '저장된 0과 누락된 키 구분', 'Map에 `"done"`이라는 키와 값 0이 저장되어 있을 때 키가 있는지 확인하는 답은?', [
          ['`map.has("done")`은 true다', 'has는 저장값의 참·거짓과 무관하게 해당 키가 존재하는지 확인합니다.'],
          ['`Boolean(map.get("done"))`은 true다', '저장된 0은 falsy이므로 Boolean 결과는 false입니다.'],
          ['`map.get("missing") ?? 0`은 missing 키를 저장한다', 'get은 조회만 수행하며 기본값을 반환해도 Map에 새 키를 추가하지 않습니다.'],
        ], 0, '키가 저장됐는지와 그 키의 값이 truthy인지는 다른 질문입니다.', '값 0도 유효한 저장값일 수 있으므로 Map.has로 존재 여부를 확인하세요.'),
        outputTrace('js-w15-d5-trace-v2', '통합 Set·Map 출력', '다음 코드의 출력 전체를 적으세요.\n\n`const ids = [...new Set(["js", "js", "py"])];\nconst counts = new Map([["done", 0]]);\nconsole.log(ids.join(","), counts.has("done"), new Set([]).size);`', ['js,py true 0'], 'Set은 중복을 없애지만 첫 등장 순서를 유지합니다. 빈 Set의 크기는 0입니다.', '고유 id는 `js,py`, Map 키는 존재하므로 true, 빈 Set의 크기는 0입니다.'),
      ]),
    ],
  },
  16: {
    objective: '제너레이터의 지연 실행과 next 결과의 value/done을 구분하고, 조기 종료 때 정리 작업을 보장합니다.',
    overviewExample: 'function* pageIds() { yield 1; yield 2; }\nconst iterator = pageIds();\nconsole.log(JSON.stringify([iterator.next(), iterator.next(), iterator.next()])); // [{"value":1,"done":false},{"value":2,"done":false},{"done":true}]',
    sessions: [
      studySession(1, '1일차 · 제너레이터와 지연 실행', 'function* 호출은 본문을 바로 실행하지 않고 iterator를 반환하며, next()가 yield까지 진행합니다.', 'Generator 객체에는 value 속성이 직접 없습니다. next()가 반환하는 iterator result에서 value와 done을 읽습니다.', 'function* pages() { console.log("read"); yield "A"; }\nconst iterator = pages();\nconsole.log("created", iterator.next().value); // read\n// 출력: read\n// 다음 출력: created A', [
        choice('js-w16-d1-next-v2', '제너레이터 첫 값 요청', '`function* ids() { yield "js"; }`를 호출한 뒤 첫 값을 가져오는 올바른 방법은?', [
          ['`ids().next().value`를 읽는다', 'generator 호출은 iterator를 만들고 next()가 본문을 첫 yield까지 실행합니다.'],
          ['`ids().value`를 읽는다', 'generator 호출 결과는 iterator이며 아직 value 결과 객체가 아닙니다.'],
          ['`ids().yield`를 호출한다', 'yield는 generator 함수 안의 구문이지 호출할 수 있는 메서드가 아닙니다.'],
        ], 0, 'generator 호출과 한 값을 요청하는 동작은 서로 다른 단계입니다.', 'next()가 반환한 객체의 value를 읽어 첫 yield 값을 얻습니다.'),
        outputTrace('js-w16-d1-trace-v2', '첫 next 결과 추적', '다음 코드가 출력하는 값을 적으세요.\n\n`function* pages() { yield "A"; }\nconst iterator = pages();\nconsole.log(iterator.next().value, iterator.next().done);`', ['A true'], '첫 next는 A를 내보내고 두 번째 next는 더 낼 값이 없는 완료 결과를 돌려줍니다.', '첫 결과의 값은 A입니다. generator가 한 번 yield한 뒤 끝나므로 두 번째 next의 done은 true입니다.'),
        locateError('js-w16-d1-error-v2', 'iterator에 없는 value 읽기', '첫 페이지 값을 출력해야 합니다. 값을 잘못 읽는 줄을 고르세요.', 'JavaScript', ['function* pages() { yield "A"; }', 'const iterator = pages();', 'console.log(iterator.value);'], [3], 'pages()가 돌려주는 것은 iterator입니다. 아직 next 결과를 요청했나요?', '3번 줄의 iterator 자체에는 value가 없습니다. `iterator.next().value`를 읽어야 합니다.'),
      ]),
      studySession(2, '2일차 · next 결과의 완료 상태', 'yield 값을 모두 소비한 뒤의 next 결과는 done: true이며 기본 value는 undefined입니다.', 'next()는 `{ value, done }` 결과를 한 번씩 돌려줍니다. 마지막으로 yield한 값의 done은 false이고, 다음 호출부터 완료 상태입니다.', 'function* ids() { yield 1; yield 2; }\nconst iterator = ids();\nconsole.log(iterator.next().done, iterator.next().done, iterator.next().done); // false false true', [
        outputTrace('js-w16-d2-trace-v2', '완료 상태 전환 추적', '다음 출력 전체를 적으세요.\n\n`function* ids() { yield 1; yield 2; }\nconst iterator = ids();\nconsole.log(iterator.next().done, iterator.next().done, iterator.next().done);`', ['false false true'], '두 번은 값을 받고 세 번째 호출은 남은 yield가 없는 상태를 반환합니다.', '첫 번째와 두 번째 호출은 각각 값을 내보내 done이 false입니다. 세 번째 호출은 이미 끝나 true입니다.'),
        locateError('js-w16-d2-error-v2', 'value와 done 혼동 찾기', '요구사항은 세 번째 next 호출의 완료 여부를 출력하는 것입니다. 잘못된 줄을 고르세요.', 'JavaScript', ['function* ids() { yield 1; yield 2; }', 'const iterator = ids();', 'iterator.next(); iterator.next();', 'console.log(iterator.next().value);'], [4], '세 번째 호출에서 필요한 것은 값인가요, 완료 상태인가요?', '4번 줄은 세 번째 결과의 value를 출력합니다. 완료 여부가 필요하므로 `.done`을 읽어야 합니다. 이때 기본 value는 undefined입니다.'),
        choice('js-w16-d2-done-v2', '마지막 next 결과 판단', '두 값을 yield한 generator에서 세 번째 `next()` 결과는 무엇인가요?', [
          ['`{ value: undefined, done: true }`', '모든 yield를 소비한 뒤에는 완료 결과가 반환되고 별도 return 값이 없어 value는 undefined입니다.'],
          ['`{ value: 2, done: true }`', '두 번째 yield 결과는 done false입니다. 완료 여부는 다음 호출에서 확인됩니다.'],
          ['`{ value: undefined, done: false }`', '더 진행할 yield가 없으므로 세 번째 결과의 done은 true입니다.'],
        ], 0, '마지막 yield를 돌려주는 호출과, 그 다음 완료를 확인하는 호출을 세어 보세요.', '기본 완료 결과는 value가 undefined이고 done이 true입니다.'),
      ]),
      studySession(3, '3일차 · yield 값과 return 값', 'yield 값은 반복 항목이 되고 generator의 return 값은 done이 true인 최종 결과가 됩니다.', 'for...of와 배열 전개는 yield된 항목만 순회합니다. 종료 결과 자체를 읽어야 하면 iterator.next()의 마지막 value와 done을 직접 확인하세요.', 'function* pages() { yield "page"; return "end"; }\nconst iterator = pages();\nconst first = iterator.next();\nconst last = iterator.next();\nconsole.log(first.value, first.done, last.value, last.done); // page false end true', [
        choice('js-w16-d3-return-v2', 'generator return 의미', 'generator 안의 `return "end"`가 일반 반복에서 yield 항목처럼 전달되나요?', [
          ['아니요. done이 true인 최종 iterator result의 value에 담긴다', 'return은 generator를 끝내며 완료 결과를 만듭니다. for...of는 완료 결과를 순회 항목으로 소비하지 않습니다.'],
          ['예. 항상 for...of의 마지막 항목이 된다', 'for...of는 done이 false인 yield 결과만 반복 항목으로 처리합니다.'],
          ['아니요. return 값은 모든 iterator에서 버려진다', '완료 iterator result의 value에는 generator가 반환한 값이 들어갈 수 있습니다.'],
        ], 0, 'yield 항목과 done이 true인 종료 결과를 따로 구분하세요.', 'return 값은 iterator를 직접 읽을 때 확인할 수 있지만 기본 for...of 항목에는 포함되지 않습니다.'),
        outputTrace('js-w16-d3-trace-v2', 'yield와 종료 결과 추적', '다음 출력 전체를 적으세요.\n\n`function* pages() { yield "page"; return "end"; }\nconst iterator = pages();\nconst first = iterator.next();\nconst last = iterator.next();\nconsole.log(first.value, first.done, last.value, last.done);`', ['page false end true'], '첫 next의 yield와 두 번째 next의 완료 결과를 구분하세요.', '첫 결과는 `page, false`, 종료 결과는 `end, true`이므로 출력은 `page false end true`입니다.'),
        locateError('js-w16-d3-error-v2', '완료 결과를 반복 항목으로 오해', '진단 화면이 yield된 페이지와 종료 사유를 모두 보여야 합니다. 종료 값을 놓치는 줄을 고르세요.', 'JavaScript', ['function* pages() { yield "page"; return "end"; }', 'const items = [...pages()];', 'console.log(items.includes("end"));'], [2], '전개 문법이 소비하는 iterator result가 done false인지 true인지 생각하세요.', '2번 줄의 전개는 yield 항목만 모으고 done이 true인 `return` 값은 항목으로 넣지 않습니다. 종료 값이 필요하면 next 결과를 직접 검사해야 합니다.'),
      ]),
      studySession(4, '4일차 · 요청 시 하나씩 yield', 'generator로 각 페이지를 요청 시점에 하나씩 내보내 전체 배열 복사를 피합니다.', 'generator는 호출 시 본문이 멈춘 상태의 iterator를 반환합니다. 값을 한꺼번에 return하면 반복 항목을 만들지 않으므로 각 페이지를 yield해야 합니다.', 'function* firstPage() {\n  yield 1;\n}\nconst result = firstPage().next();\nconsole.log(result.value, result.done); // 1 false', [
        choice('js-w16-d4-lazy-v2', '지연 순회 선택', '페이지가 요청될 때마다 하나씩 처리하고 싶습니다. 어느 접근이 필요한가요?', [
          ['generator가 페이지를 하나씩 yield한다', '호출자는 next 또는 for...of로 필요한 시점에 각 페이지를 소비할 수 있습니다.'],
          ['호출 순간 모든 페이지를 새 배열에 복사한다', '전체 복사는 요청 시점의 지연 처리가 아니며 큰 입력을 한 번에 처리합니다.'],
          ['generator 본문에서 배열을 return한다', '배열을 return해도 배열 자체가 yield 항목으로 전달되는 것은 아닙니다.'],
        ], 0, '필요할 때 다음 값을 소비하는 지연 흐름을 생각하세요.', '각 입력 항목을 yield하면 호출자가 요청하는 순서대로 하나씩 내보낼 수 있습니다.'),
        locateError('js-w16-d4-error-v2', '반복 대신 배열을 반환하는 오류', '입력을 반복 항목으로 하나씩 제공해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['function* cursor(pages) {', '  return pages;', '}', 'console.log([...cursor([1, 2])].join(","));'], [2], 'return은 generator를 완료합니다. 반복할 값은 어떤 구문으로 내보내나요?', '2번 줄은 배열을 종료 값으로 반환하므로 `[...cursor(...)]`에는 항목이 없습니다. 입력 배열을 순회하며 각 page를 yield해야 합니다.'),
        repairCode({ id: 'js-w16-d4-repair-v2', title: '첫 페이지를 내보내는 generator', prompt: '아래 `firstPage`를 고치세요. 첫 next 호출에서 value 1을 내보내고 done은 false여야 합니다. 정적 패턴 평가이며 코드를 실행하지 않습니다.', language: 'JavaScript', starterCode: 'function* firstPage() {\n  return 1;\n}', solutionPatterns: [String.raw`^\s*function\s*\*\s*firstPage\s*\(\s*\)\s*\{\s*yield\s+1\s*;?\s*\}\s*$`, String.raw`^\s*function\s*\*\s*firstPage\s*\(\s*\)\s*\{\s*yield\s*\*\s*\[\s*1\s*\]\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['첫 next 호출에서 value 1과 done false를 제공한다.'], constraints: ['generator 선언을 유지하고 return으로 끝내지 않는다.'], examples: [{ input: 'firstPage().next()', output: '{ value: 1, done: false }' }], tests: [{ input: 'firstPage().next().value', expected: '1' }] }, gradingNote: '정적 패턴 채점으로 함수 모양만 확인하며 코드는 실행하지 않습니다.', hint: '반복 항목으로 보낼 값에는 yield를 사용하세요.', explanation: 'yield 1은 첫 반복 항목을 내보내고 generator를 멈춥니다. return 1은 완료 상태의 종료 값입니다.' }),
      ]),
      studySession(5, '5일차 · 조기 종료와 정리', '반복이 일찍 중단될 때 try/finally로 generator의 열린 작업을 정리합니다.', 'for...of를 break하면 반복기는 return()으로 닫히고 활성화된 try/finally의 finally가 실행됩니다. 아직 진입하지 않은 generator body의 finally가 실행된다고 혼동하지 마세요.', 'function* pages() {\n  try { yield "A"; yield "B"; }\n  finally { console.log("cleanup"); }\n}\nfor (const page of pages()) { console.log(page); break; } // A, cleanup', [
        outputTrace('js-w16-d5-trace-v2', 'break 이후 finally 추적', '다음 코드는 두 줄로 출력합니다. 순서대로 적으세요.\n\n`function* pages() { try { yield "A"; yield "B"; } finally { console.log("cleanup"); } }\nfor (const page of pages()) { console.log(page); break; }`', ['A\ncleanup', 'A cleanup'], '첫 반복 본문에서 A를 출력한 뒤 break가 반복기를 닫습니다.', '첫 항목 A를 출력하고 조기 종료하며 iterator 정리 절차가 finally를 실행해 cleanup을 출력합니다.'),
        choice('js-w16-d5-finally-v2', '반복기 자원 정리', 'generator가 파일이나 잠금 같은 자원을 보유한 채 중단될 수 있습니다. 정리 코드는 어디에 두나요?', [
          ['yield를 감싼 `try`의 `finally` 블록', '정상 완료와 반복기 조기 종료 모두에서 활성화된 finally가 정리 코드를 실행합니다.'],
          ['generator 함수를 부르기 전의 호출 코드', '호출 전에는 generator 내부 자원이나 반복기 종료 상황을 정리할 수 없습니다.'],
          ['오직 generator 맨 끝의 일반 문장', 'break로 반복이 일찍 끝나면 정상 흐름은 해당 문장까지 진행하지 않을 수 있습니다.'],
        ], 0, '정상 완료와 break 두 경로에서 모두 실행되는 구문을 고르세요.', '열린 자원은 try/finally로 감싸서 조기 종료에도 정리되도록 해야 합니다.'),
        repairCode({ id: 'js-w16-d5-repair-v2', title: '입력을 순서대로 yield하는 cursor', prompt: '아래 `pageCursor`를 고치세요. 입력 iterable의 값을 전체 복사 없이 순서대로 yield합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function* pageCursor(pages) {\n  return pages;\n}', solutionPatterns: [String.raw`^\s*function\s*\*\s*pageCursor\s*\(\s*pages\s*\)\s*\{\s*for\s*\(\s*const\s+page\s+of\s+pages\s*\)\s*yield\s+page\s*;?\s*\}\s*$`, String.raw`^\s*function\s*\*\s*pageCursor\s*\(\s*pages\s*\)\s*\{\s*yield\s*\*\s*pages\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['입력 iterable의 각 page를 순서대로 하나씩 내보낸다.'], constraints: ['입력을 배열로 펼치거나 변경하지 않는다.'], examples: [{ input: '["A", "B"]', output: 'A then B' }], tests: [{ input: '[]', expected: 'no yielded values' }] }, gradingNote: '전체 함수 구조를 정규식으로 검사하는 정적 채점이며 코드를 실행하지 않습니다.', hint: 'for...of에서 값을 하나씩 꺼내 yield하세요.', explanation: '반복문과 yield를 함께 쓰면 빈 입력은 아무 값도 내지 않고 큰 iterable도 필요할 때 순회합니다.' }),
      ]),
    ],
  },
  17: {
    objective: 'private 상태·this 바인딩·의존성 합성·super 오버라이드·호환 계약을 비교해 변경 가능한 클래스를 설계합니다.',
    overviewExample: 'function makeService(validate, save) {\n  return { submit(value) { return validate(value) ? save(value) : "rejected"; } };\n}\nconst saved = [];\nconst service = makeService((value) => value.length > 0, (value) => { saved.push(value); return `saved:${value}`; });\nconsole.log(service.submit("JS"), service.submit(""), saved.join(",")); // saved:JS rejected JS',
    sessions: [
      studySession(1, '1일차 · 클래스의 private 상태', '클래스 내부 값은 #privateField로 숨기고 공개 메서드로만 읽거나 변경하게 합니다.', 'JavaScript의 #private field는 문자열 키가 붙은 일반 프로퍼티가 아니며 선언한 클래스 바깥에서 직접 접근할 수 없습니다.', 'class Counter {\n  #value = 0;\n  increment() { this.#value += 1; }\n  read() { return this.#value; }\n}\nconst counter = new Counter();\ncounter.increment();\nconsole.log(counter.read()); // 1', [
        choice('js-w17-d1-private-v2', '캡슐화 필드 표기', '클래스 바깥에서 직접 읽지 못하게 선언하는 필드 이름은?', [
          ['`#value`처럼 이름 앞에 #을 둔다', 'private identifier는 #을 이름의 일부로 사용하며 선언한 클래스 안에서 참조합니다.'],
          ['`_value`처럼 밑줄만 둔다', '밑줄은 관례일 뿐 JavaScript가 외부 접근을 막아 주지 않습니다.'],
          ['`private value`라고 적는다', '이 표기는 JavaScript class field 문법이 아닙니다.'],
        ], 0, '문서 관례로 비공개를 표시하는 것과 언어가 접근을 제한하는 문법을 구별하세요.', 'JavaScript private field는 선언과 사용에 # 접두어를 붙입니다.'),
        outputTrace('js-w17-d1-trace-v2', 'private 상태 갱신 추적', '다음 출력값을 적으세요.\n\n`class Counter { #value = 0; increment() { this.#value += 1; } read() { return this.#value; } }\nconst counter = new Counter(); counter.increment();\nconsole.log(counter.read());`', ['1'], '생성 직후 0에서 increment를 한 번 호출합니다.', 'private 값은 0으로 시작하고 increment가 한 번 더하므로 read 결과는 1입니다.'),
        locateError('js-w17-d1-error-v2', 'private 이름을 공개 속성으로 읽는 오류', '선언한 private 필드를 읽어야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['class Counter {', '  #value = 0;', '  read() { return this.value; }', '}'], [3], '#value와 value가 같은 필드 이름인지 비교하세요.', '3번 줄은 공개 속성 value를 읽습니다. 선언한 `#value`를 클래스 안에서 사용해야 합니다.'),
      ]),
      studySession(2, '2일차 · 메서드와 this 바인딩', '메서드를 객체에서 분리하면 호출 때 this가 달라질 수 있어 bind 또는 호출 경계를 선택합니다.', '클래스 메서드는 자동으로 인스턴스에 바인딩되지 않습니다. 이벤트나 콜백으로 전달할 때 소유 객체를 유지할지 명시하세요.', 'class Course {\n  constructor(title) { this.title = title; }\n  label() { return this.title; }\n}\nconst course = new Course("JS");\nconst readLabel = course.label.bind(course);\nconsole.log(course.label(), readLabel()); // JS JS', [
        outputTrace('js-w17-d2-trace-v2', 'this를 묶은 콜백 추적', '다음 출력값을 적으세요.\n\n`class Course { constructor(title) { this.title = title; } label() { return this.title; } }\nconst course = new Course("JS");\nconsole.log(course.label(), course.label.bind(course)());`', ['JS JS'], '첫 호출은 객체를 receiver로 유지하고 두 번째는 bind가 같은 객체를 고정합니다.', '두 호출 모두 course 인스턴스의 title을 읽으므로 `JS JS`가 출력됩니다.'),
        locateError('js-w17-d2-error-v2', '분리 호출에서 this를 잃는 줄', '콜백이 늘 course 인스턴스의 제목을 반환해야 합니다. 안전하지 않은 줄을 고르세요.', 'JavaScript', ['class Course { constructor(title) { this.title = title; } label() { return this.title; } }', 'const course = new Course("JS");', 'const readLabel = course.label;', 'queueMicrotask(() => console.log(readLabel()));'], [3], '메서드를 꺼내 변수에 저장할 때 receiver가 함께 저장되나요?', '3번 줄은 메서드만 떼어냅니다. 콜백에서 원래 인스턴스를 유지하려면 `course.label.bind(course)`처럼 묶어야 합니다.'),
        choice('js-w17-d2-this-v2', '콜백에서 인스턴스 보존', '인스턴스 메서드를 콜백으로 전달한 뒤에도 this가 해당 인스턴스를 가리키게 하는 방법은?', [
          ['`course.label.bind(course)`로 묶어 전달한다', 'bind는 호출 receiver를 고정한 새 함수를 반환합니다.'],
          ['메서드 이름을 문자열로 복사한다', '문자열에는 함수 동작이나 인스턴스 receiver가 보존되지 않습니다.'],
          ['인스턴스를 JSON으로 변환한다', '직렬화는 메서드의 호출 receiver를 보존하거나 바인딩하지 않습니다.'],
        ], 0, 'callback 호출자가 원래 객체 대신 다른 this를 줄 수 있는지 생각하세요.', 'bind로 receiver를 고정하거나 호출 위치에서 `course.label()` 형태를 유지합니다.'),
      ]),
      studySession(3, '3일차 · 의존성 합성', '검증과 저장 함수를 서비스가 직접 만들지 않고 입력으로 받아 필요할 때 조합합니다.', '구성 요소를 생성할 때 함수들을 실행하지 말고 객체에 보관한 뒤 submit 요청이 들어오면 호출하세요. 이렇게 하면 테스트 대역이나 다른 구현을 바꿔 끼울 수 있습니다.', 'function makeService(validate, save) {\n  return { submit(value) { return validate(value) ? save(value) : "rejected"; } };\n}\nconst saved = [];\nconst service = makeService((value) => value.length > 0, (value) => { saved.push(value); return `saved:${value}`; });\nconsole.log(service.submit("JS"), service.submit(""), saved.join(",")); // saved:JS rejected JS', [
        choice('js-w17-d3-compose-v2', '구성 요소 조합 선택', '저장 함수를 실제 DB 대신 메모리에 기록하는 구현으로 바꿔 가며 시험하려면 어느 설계가 바꾸기 쉬운가요?', [
          ['validate와 save를 인자로 받아 서비스에서 조합한다', '의존 함수를 분리해 두면 테스트에서 대역 함수를 주입할 수 있습니다.'],
          ['모듈 로딩 때 전역 DB 함수를 바로 실행한다', '전역 실행은 구성과 요청 동작을 섞고 테스트에서 교체하기 어렵습니다.'],
          ['save를 문자열로 저장해 나중에 eval한다', '실행 가능한 코드를 문자열로 다루는 것은 타입·안전·테스트 경계를 악화시킵니다.'],
        ], 0, '서비스 생성 시 기능을 실행하는 대신 동작을 전달받아야 교체할 수 있습니다.', '의존성 합성은 독립 기능을 주입해 서비스 행위를 명확히 조립합니다.'),
        outputTrace('js-w17-d3-trace-v2', '검증 통과/실패 추적', '다음 코드의 출력 전체를 적으세요.\n\n`function makeService(validate, save) { return { submit(value) { return validate(value) ? save(value) : "rejected"; } }; }\nconst service = makeService((value) => value.length > 0, (value) => `saved:${value}`);\nconsole.log(service.submit("JS"), service.submit(""));`', ['saved:JS rejected'], '첫 입력은 길이가 0보다 크고 두 번째 입력은 빈 문자열입니다.', '첫 호출은 save를 실행해 saved:JS를 반환하고, 빈 값은 검증에서 걸려 rejected가 됩니다.'),
        locateError('js-w17-d3-error-v2', '서비스 생성 때 의존성을 즉시 실행', '서비스는 validate와 save를 나중에 호출할 수 있도록 보관해야 합니다. 실행을 앞당기는 줄을 고르세요.', 'JavaScript', ['function makeService(validate, save, value) {', '  return { validate: validate(value), save: save(value) };', '}'], [2], '인자 value를 받지 않은 서비스 생성 시점에도 두 함수 호출이 바로 일어나는지 확인하세요.', '2번 줄은 서비스 객체를 만들면서 validate와 save를 즉시 실행합니다. 함수 참조를 보관하고 submit 같은 동작에서 호출해야 합니다.'),
      ]),
      studySession(4, '4일차 · 상속과 super 오버라이드', '하위 클래스가 부모 동작을 재사용하려면 `super.method()`를 호출하고 추가 결과를 결합합니다.', 'extends는 동작 공유를 표현할 때 쓸 수 있지만 무조건 상속할 필요는 없습니다. 메서드를 오버라이드할 때 super.method와 super.method()의 차이를 확인하세요.', 'class Course { label() { return "기초"; } }\nclass ProCourse extends Course {\n  label() { return super.label() + " · 심화"; }\n}\nconsole.log(new ProCourse().label()); // 기초 · 심화', [
        choice('js-w17-d4-super-v2', '부모 동작 확장', '하위 클래스에서 부모 label 결과에 문구를 덧붙이는 표현은?', [
          ['`super.label() + " · 심화"`', 'super.label()을 호출해 부모의 반환 문자열을 받은 뒤 새 결과를 조합합니다.'],
          ['`super.label + " · 심화"`', '괄호가 빠져 부모 메서드 결과가 아니라 함수 객체를 문자열에 연결합니다.'],
          ['`this.super.label()`', 'super는 this의 일반 속성이 아니라 메서드 본문에서 사용하는 특수 문법입니다.'],
        ], 0, '부모 메서드 자체와 그 메서드가 반환한 값을 구분하세요.', 'super.label()처럼 호출 괄호가 있어야 부모 메서드 결과를 얻습니다.'),
        locateError('js-w17-d4-error-v2', '부모 메서드를 호출하지 않는 오류', 'label은 부모 결과 뒤에 심화 문구를 붙여 반환해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['class Course { label() { return "기초"; } }', 'class ProCourse extends Course { label() { return super.label + " · 심화"; } }', 'console.log(new ProCourse().label());'], [2], 'super.label 뒤에 메서드 호출 괄호가 있는지 확인하세요.', '2번 줄은 함수를 호출하지 않고 함수 객체를 문자열에 더합니다. `super.label()`로 결과를 받아야 합니다.'),
        repairCode({ id: 'js-w17-d4-repair-v2', title: '부모 label을 확장하는 하위 클래스', prompt: '아래 `ProCourse`를 고치세요. label()은 부모 label 결과 뒤에 ` · 심화`를 붙여 반환합니다. 전체 클래스 구조를 검사하는 정적 패턴 평가이며 실행하지 않습니다.', language: 'JavaScript', starterCode: 'class Course { label() { return "기초"; } }\nclass ProCourse extends Course { label() { return super.label + " · 심화"; } }', solutionPatterns: [String.raw`^\s*class\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*return\s+"기초"\s*;?\s*\}\s*\}\s*class\s+ProCourse\s+extends\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*return\s+super\.label\(\)\s*\+\s*" · 심화"\s*;?\s*\}\s*\}\s*$`], acceptanceCriteria: { requirements: ['ProCourse.label은 부모 label() 결과 뒤에 ` · 심화`를 붙인다.'], constraints: ['Course의 label 구현은 바꾸지 않고 super.label()을 호출한다.'], examples: [{ input: 'new ProCourse().label()', output: '기초 · 심화' }], tests: [{ input: 'super.label', expected: '호출 괄호가 있는 부모 메서드 결과' }] }, gradingNote: '전체 두 클래스 선언의 형태를 검사하는 정적 패턴 평가이며 실행 채점은 아닙니다.', hint: 'super 뒤에서 부모 메서드를 실제 호출하고 그 반환 문자열을 연결하세요.', explanation: '메서드 참조 super.label은 함수이며 호출 결과는 super.label()입니다. 하위 구현은 부모 동작을 재사용한 뒤 확장합니다.' }),
      ]),
      studySession(5, '5일차 · 하위 타입의 계약 유지', '상속을 사용한다면 하위 객체도 부모를 사용하는 호출자의 입력·반환 계약을 지켜야 합니다.', '상속은 코드를 재사용한다는 이유만으로 선택하지 않습니다. 하위 클래스가 부모가 보장한 동작을 깨면 부모 자리에 바꿔 넣을 수 없습니다.', 'class Store { save(value) { return Boolean(value); } }\nclass MemoryStore extends Store {}\nfunction persist(store, value) { return store.save(value); }\nconsole.log(persist(new MemoryStore(), "ok"), persist(new MemoryStore(), "")); // true false', [
        choice('js-w17-d5-contract-v2', '상속 계약 검토', '호출자가 Store.save가 불리언을 반환한다고 기대할 때 하위 클래스가 지켜야 할 기준은?', [
          ['같은 입력 계약을 받아 같은 종류의 결과 계약을 유지한다', '호출자는 부모형을 하위형으로 바꿔도 약속된 입력과 반환 동작을 신뢰할 수 있어야 합니다.'],
          ['성공할 때 문자열을 반환해 더 많은 정보를 준다', '문자열을 truthy 여부만으로 쓰더라도 boolean 반환 계약과는 다릅니다.'],
          ['부모의 메서드를 모두 제거하고 외부 전역 상태를 읽는다', '기존 호출자가 의존하던 인터페이스와 기대 동작을 보존하지 않습니다.'],
        ], 0, '기존 호출자가 하위 인스턴스도 대체해 쓸 수 있어야 합니다.', '부모의 반환 계약을 지키면 호출자는 실제 하위 클래스를 알 필요 없이 같은 기준으로 사용합니다.'),
        outputTrace('js-w17-d5-trace-v2', '저장 계약 결과 추적', '다음 출력 전체를 적으세요.\n\n`class Store { save(value) { return Boolean(value); } }\nclass MemoryStore extends Store {}\nfunction persist(store, value) { return store.save(value); }\nconsole.log(persist(new MemoryStore(), "ok"), persist(new MemoryStore(), ""));`', ['true false'], '첫 문자열은 비어 있지 않고 두 번째 문자열은 빈 값입니다.', 'Boolean 변환 결과는 각각 true와 false라 두 호출의 출력은 `true false`입니다.'),
        repairCode({ id: 'js-w17-d5-repair-v2', title: 'Boolean 저장 계약을 유지하는 하위 클래스', prompt: '아래 `MemoryStore`를 고치세요. 부모 `Store.save`를 그대로 상속하거나, 같은 Boolean 결과 계약을 구현해 입력이 비어 있지 않으면 true, 비어 있으면 false를 반환합니다. 전체 클래스의 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'class Store { save(value) { return Boolean(value); } }\nclass MemoryStore extends Store { save(value) { return `saved:${value}`; } }', solutionPatterns: [String.raw`^\s*class\s+Store\s*\{\s*save\s*\(\s*value\s*\)\s*\{\s*return\s+Boolean\(value\)\s*;?\s*\}\s*\}\s*class\s+MemoryStore\s+extends\s+Store\s*\{\s*save\s*\(\s*value\s*\)\s*\{\s*return\s+Boolean\(value\)\s*;?\s*\}\s*\}\s*$`, String.raw`^\s*class\s+Store\s*\{\s*save\s*\(\s*value\s*\)\s*\{\s*return\s+Boolean\(value\)\s*;?\s*\}\s*\}\s*class\s+MemoryStore\s+extends\s+Store\s*\{\s*\}\s*$`], acceptanceCriteria: { requirements: ['MemoryStore.save는 부모와 같은 Boolean 결과 계약을 유지한다.'], constraints: ['부모 메서드를 상속하거나 같은 Boolean 반환 계약을 지킨다.', '빈 문자열 입력은 false, 비어 있지 않은 문자열은 true를 반환한다.'], examples: [{ input: 'new MemoryStore().save("ok")', output: 'true' }], tests: [{ input: 'new MemoryStore().save("")', expected: 'false' }] }, gradingNote: '두 클래스의 전체 선언 형태를 검사하는 정적 패턴이며 실행 채점은 제공하지 않습니다.', hint: '하위 메서드의 결과 자료형이 부모 메서드와 같도록 하세요.', explanation: '상속을 받는 호출자는 부모 계약을 믿습니다. 문자열 응답으로 바꾸지 않고 Boolean 결과를 유지해야 합니다.' }),
      ]),
    ],
  },
  18: {
    objective: '객체의 자체 속성·상속 조회·그림자 속성을 구분하고 입력 가능한 필드를 명시적인 허용 목록으로 제한합니다.',
    overviewExample: 'const base = { role: "learner" };\nconst profile = Object.create(base);\nprofile.name = "민";\nconsole.log(Object.hasOwn(profile, "name"), Object.hasOwn(profile, "role"), "role" in profile); // true false true',
    sessions: [
      studySession(1, '1일차 · 자체 속성과 상속 속성', 'Object.hasOwn은 객체가 직접 가진 키만 검사하고 in은 프로토타입 체인도 확인합니다.', '기본 프로퍼티 검사와 상속 여부를 혼동하지 마세요. 객체 자신의 필드인지 확인하는 문제라면 Object.hasOwn이 의도를 직접 표현합니다.', 'const base = { role: "learner" };\nconst profile = Object.create(base);\nprofile.name = "민";\nconsole.log(Object.hasOwn(profile, "name"), Object.hasOwn(profile, "role"), "role" in profile); // true false true', [
        choice('js-w18-d1-own-v2', '직접 소유한 속성 검사', 'role이 prototype에서 상속되고 name은 profile에 직접 저장됐습니다. 자체 속성만 확인하는 방법은?', [
          ['`Object.hasOwn(profile, "role")`', '해당 키가 profile 자체에 저장됐는지 확인하며 상속된 role은 false입니다.'],
          ['`"role" in profile`', 'in은 prototype을 포함해 조회하므로 상속된 role도 true입니다.'],
          ['`Object.getPrototypeOf(profile).role`', '이 표현은 prototype 값에 접근하며 객체 자체 소유 여부를 검사하지 않습니다.'],
        ], 0, '속성 값 조회가 아니라 실제 소유 위치를 확인하세요.', 'Object.hasOwn은 프로토타입 체인을 따라가지 않고 자체 속성만 판별합니다.'),
        outputTrace('js-w18-d1-trace-v2', '상속 속성 검사 출력', '다음 출력 전체를 적으세요.\n\n`const proto = { id: "base" };\nconst course = Object.create(proto);\nconsole.log(Object.hasOwn(course, "id"), "id" in course);`', ['false true'], 'id는 prototype에만 있지만 in은 prototype chain도 검색합니다.', 'course 자체에는 id가 없어서 첫 결과는 false이고 상속 조회에는 있으므로 두 번째는 true입니다.'),
        locateError('js-w18-d1-error-v2', '상속 속성까지 검사하는 연산자', '객체 자체에 선언한 title만 찾아야 합니다. 요구와 다른 줄을 고르세요.', 'JavaScript', ['const base = { title: "기본" };', 'const course = Object.create(base);', 'console.log("title" in course);'], [3], 'in이 현재 객체 외에 어떤 곳까지 탐색하는지 생각하세요.', '3번 줄은 프로토타입 체인의 title도 포함해 true를 반환합니다. 자체 속성만 필요하면 Object.hasOwn(course, "title")을 사용하세요.'),
      ]),
      studySession(2, '2일차 · 프로토타입 연결 조회', 'Object.getPrototypeOf로 객체의 실제 프로토타입 연결을 읽습니다.', 'prototype은 각 인스턴스가 일반 속성으로 보유하는 값이 아닙니다. 표준 조회 API를 사용하고 null prototype 같은 경계도 기억하세요.', 'const base = { active: true };\nconst item = Object.create(base);\nconsole.log(Object.getPrototypeOf(item) === base, item.active); // true true', [
        outputTrace('js-w18-d2-trace-v2', '프로토타입 연결 추적', '다음 출력 전체를 적으세요.\n\n`const base = { active: true };\nconst item = Object.create(base);\nconsole.log(Object.getPrototypeOf(item) === base, item.active);`', ['true true'], 'Object.create가 전달받은 base를 item의 프로토타입으로 연결합니다.', '첫 비교는 같은 객체 참조를 확인해 true이고, item.active는 상속된 값을 읽어 true입니다.'),
        locateError('js-w18-d2-error-v2', '인스턴스의 prototype 속성 오해', 'item의 프로토타입 객체를 출력해야 합니다. 잘못된 줄을 고르세요.', 'JavaScript', ['const base = { active: true };', 'const item = Object.create(base);', 'console.log(item.prototype === base);'], [3], '인스턴스에서 일반 프로퍼티 prototype을 읽는 것과 내부 연결 조회는 다릅니다.', '3번 줄의 item.prototype은 표준 연결 조회가 아닙니다. `Object.getPrototypeOf(item)`을 사용하세요.'),
        choice('js-w18-d2-get-prototype-v2', '프로토타입 표준 API', '객체의 프로토타입 연결을 반환하는 호출은 무엇인가요?', [
          ['`Object.getPrototypeOf(item)`', '이 API는 객체의 내부 프로토타입 연결을 반환합니다.'],
          ['`item.prototype`', 'prototype은 주로 생성자 함수의 프로퍼티이며 인스턴스 연결을 이렇게 읽지 않습니다.'],
          ['`Object.keys(item)`', '열거 가능한 자체 문자열 키만 반환하며 프로토타입 연결은 반환하지 않습니다.'],
        ], 0, '프로퍼티를 열거하는 것과 객체의 내부 연결을 묻는 API를 구분하세요.', 'Object.getPrototypeOf가 연결된 prototype 객체를 직접 반환합니다.'),
      ]),
      studySession(3, '3일차 · 그림자 속성과 조회 우선순위', '객체 자체에 같은 이름을 대입하면 prototype 값을 바꾸지 않고 자체 속성으로 가립니다.', '속성 조회는 객체 자체에서 먼저 찾고 없으면 prototype으로 이동합니다. 일반 대입은 보통 prototype 속성의 값을 직접 수정하지 않고 자체 속성을 만듭니다.', 'const base = { level: 1 };\nconst item = Object.create(base);\nconsole.log(item.level);\nitem.level = 2;\nconsole.log(item.level, Object.getPrototypeOf(item).level); // 1\n// 다음 출력: 2 1', [
        choice('js-w18-d3-shadow-v2', '상속 값 가리기', 'item과 prototype 모두에 level이 있을 때 item.level 조회는 어디의 값을 먼저 반환하나요?', [
          ['item 자체의 level', '속성 조회는 객체 자체에서 키를 찾으면 prototype 탐색보다 그 값을 우선합니다.'],
          ['항상 가장 바깥 prototype의 level', '자체 속성이 이미 발견되면 prototype까지 더 탐색하지 않습니다.'],
          ['둘 중 하나를 무작위로 선택한다', '일반 속성 조회는 객체 자체부터 위로 올라가는 결정된 순서입니다.'],
        ], 0, '속성 조회는 현재 객체를 먼저 검사합니다.', '객체의 자체 값이 있으면 그 값이 상속값을 가리는 shadow property가 됩니다.'),
        outputTrace('js-w18-d3-trace-v2', '자체 대입과 prototype 값', '다음 출력 전체를 적으세요.\n\n`const base = { level: 1 };\nconst item = Object.create(base);\nitem.level = 2;\nconsole.log(item.level, Object.getPrototypeOf(item).level);`', ['2 1'], '일반 대입 뒤 item 자체와 base를 따로 확인하세요.', 'item에는 level 2가 자체 속성으로 만들어지고 prototype의 level은 1로 남아 `2 1`이 출력됩니다.'),
        locateError('js-w18-d3-error-v2', '자체 조회 대신 prototype 원본을 읽음', '현재 item에서 조회될 level을 출력해야 합니다. 결과를 다르게 읽는 줄을 고르세요.', 'JavaScript', ['const base = { level: 1 };', 'const item = Object.create(base);', 'item.level = 2;', 'console.log(Object.getPrototypeOf(item).level);'], [4], '대입 이후 item 조회와 prototype 원본 조회는 같은 결과인가요?', '4번 줄은 prototype 객체의 원본 1을 읽습니다. 일반 조회 결과를 알고 싶다면 `item.level`을 읽어야 합니다.'),
      ]),
      studySession(4, '4일차 · for...in과 자체 열거 키', 'for...in은 상속된 enumerable 문자열 키도 나열하므로 자체 키가 필요하면 필터링합니다.', 'Object.hasOwn으로 각 열거 키의 소유 위치를 확인하세요. Object.keys는 자체 enumerable 문자열 키만 반환하는 대안입니다.', 'const base = { inherited: 1 };\nconst item = Object.assign(Object.create(base), { own: 2 });\nconst keys = [];\nfor (const key in item) if (Object.hasOwn(item, key)) keys.push(key);\nconsole.log(keys.join(",")); // own', [
        choice('js-w18-d4-enumeration-v2', '자체 열거 키만 수집', 'for...in 순회 결과에서 상속 키를 제외하려면 어떤 검사인가요?', [
          ['각 key에 `Object.hasOwn(item, key)`를 적용한다', '열거된 키가 현재 item 자체에 존재할 때만 결과에 추가합니다.'],
          ['`key in item`을 검사한다', 'in은 prototype chain까지 조회하므로 상속 키도 포함합니다.'],
          ['모든 key를 바로 결과에 추가한다', '상속된 enumerable 문자열 키도 결과에 들어갑니다.'],
        ], 0, '열거에 포함된 키가 객체 자체의 것인지 검사하세요.', 'for...in은 상속 enumerable 키를 포함할 수 있어 Object.hasOwn으로 필터링합니다.'),
        locateError('js-w18-d4-error-v2', 'for...in에서 상속 키 필터 누락', 'own 프로퍼티만 출력해야 합니다. 누락된 검사를 보완해야 하는 줄을 고르세요.', 'JavaScript', ['const base = { inherited: 1 };', 'const item = Object.assign(Object.create(base), { own: 2 });', 'const keys = [];', 'for (const key in item) keys.push(key);', 'console.log(keys.join(","));'], [4], 'for...in은 item 외에 prototype에서도 열거 가능한 키를 찾을 수 있습니다.', '4번 줄은 발견한 key를 소유 여부 확인 없이 모두 넣습니다. `Object.hasOwn(item, key)`일 때만 push해야 합니다.'),
        repairCode({ id: 'js-w18-d4-repair-v2', title: '자체 열거 키만 반환하는 함수', prompt: '아래 `ownKeys`를 고치세요. for...in 결과 중 객체 자체가 소유한 키만 배열에 담습니다. 정적 패턴 평가로 코드는 실행하지 않습니다.', language: 'JavaScript', starterCode: 'function ownKeys(item) {\n  return [];\n}', solutionPatterns: [String.raw`^\s*function\s+ownKeys\s*\(\s*item\s*\)\s*\{\s*const\s+keys\s*=\s*\[\s*\]\s*;\s*for\s*\(\s*const\s+key\s+in\s+item\s*\)\s*\{\s*if\s*\(\s*Object\.hasOwn\(item\s*,\s*key\s*\)\s*\)\s*keys\.push\(key\)\s*;?\s*\}\s*return\s+keys\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['prototype에서 상속한 key를 제외하고 자체 열거 키 배열을 반환한다.'], constraints: ['Object.hasOwn으로 소유 여부를 검사한다.'], examples: [{ input: 'Object.create({ inherited: 1 }, { own: { value: 2, enumerable: true } })', output: '["own"]' }], tests: [{ input: '{}', expected: '[]' }] }, gradingNote: '전체 함수 구조를 검사하는 정적 패턴 평가이며 JavaScript를 실행하지 않습니다.', hint: 'for...in 안에서 자체 속성 조건을 확인한 뒤 keys에 넣으세요.', explanation: 'for...in은 상속된 enumerable 키도 순회합니다. Object.hasOwn으로 자체 속성만 필터링해야 합니다.' }),
      ]),
      studySession(5, '5일차 · 수정 가능한 필드 제한', '외부 객체를 갱신할 때 허용 필드 목록을 검사해 임의 키 쓰기를 제한합니다.', 'JSON이나 폼 입력의 키를 모두 객체에 복사하지 마세요. 허용 목록을 사용하고 필요하지 않은 키·프로토타입 관련 이름은 수정 대상에서 제외합니다.', 'function applyPatch(target, patch) {\n  const allowed = new Set(["title", "done"]);\n  for (const [key, value] of Object.entries(patch)) {\n    if (allowed.has(key)) target[key] = value;\n  }\n  return target;\n}\nconst course = applyPatch({ title: "Old" }, { title: "New", constructor: "bad" });\nconsole.log(course.title, Object.hasOwn(course, "constructor")); // New false', [
        choice('js-w18-d5-allowlist-v2', '수정 가능한 필드 경계', '사용자 입력 객체를 course에 반영할 때 임의의 키가 저장되지 않도록 하는 방법은?', [
          ['키가 명시적 허용 목록에 있는 경우만 대입한다', '기능에서 수정하기로 한 필드만 통과시켜 입력의 예상하지 못한 키를 차단합니다.'],
          ['Object.keys를 돌며 모든 값을 대입한다', '외부가 보낸 임의의 필드도 그대로 내부 객체에 반영됩니다.'],
          ['입력 키를 모두 대문자로 바꾸고 허용한다', '표기 변경은 어떤 필드가 허용됐는지 제한하지 않습니다.'],
        ], 0, '검증은 이름을 바꾸는 것이 아니라 허용된 이름인지 확인해야 합니다.', '명시적 allowlist를 통과한 필드만 반영하면 객체 표면을 제한할 수 있습니다.'),
        outputTrace('js-w18-d5-trace-v2', '허용 목록 갱신 추적', '다음 출력 전체를 적으세요.\n\n`function applyPatch(target, patch) { const allowed = new Set(["title", "done"]); for (const [key, value] of Object.entries(patch)) if (allowed.has(key)) target[key] = value; return target; }\nconst course = applyPatch({ title: "Old" }, { title: "New", constructor: "bad" });\nconsole.log(course.title, Object.hasOwn(course, "constructor"));`', ['New false'], 'title은 허용되고 constructor는 허용 목록에 없습니다.', 'title만 새 값으로 바뀌고 constructor 키는 쓰이지 않아 `New false`가 출력됩니다.'),
        repairCode({ id: 'js-w18-d5-repair-v2', title: '허용 필드 검사 함수', prompt: '아래 `canUpdate`를 고치세요. fields Set에 key가 들어 있을 때만 true를 반환합니다. 전체 함수 구조의 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function canUpdate(fields, key) {\n  return true;\n}', solutionPatterns: [String.raw`^\s*function\s+canUpdate\s*\(\s*fields\s*,\s*key\s*\)\s*\{\s*return\s+fields\.has\(key\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['허용 필드 Set에 key가 있을 때만 true를 반환한다.'], constraints: ['Set의 has 결과를 반환하고 목록에 없는 키를 허용하지 않는다.'], examples: [{ input: 'new Set(["title"]), "title"', output: 'true' }], tests: [{ input: 'new Set(["title"]), "constructor"', expected: 'false' }] }, gradingNote: '정적 함수 패턴만 확인하며 JavaScript 실행은 제공하지 않습니다.', hint: 'Set에서 항목 존재 여부를 묻는 메서드를 사용하세요.', explanation: 'Set.has는 허용 목록에 있는 필드만 통과시켜 임의 입력 키가 반영되지 않게 합니다.' }),
      ]),
    ],
  },
  19: {
    objective: '정상·경계·실패 입력을 구분하고 테스트가 실행을 기다리는지 확인해 회귀를 막습니다.',
    intro: '테스트는 코드를 실행하는 단계와 기대 결과를 판정하는 단계를 분리합니다. 이 과정에서는 빈 입력·공유 상태·비동기 완료·실패 재현을 작은 사례로 고정합니다.',
    points: ['Arrange는 입력과 상태를 준비하고 Act는 동작을 한 번 실행하며 Assert는 실제 결과와 기대를 비교합니다.', '빈 입력의 결과는 서비스 계약에 따라 정하고 테스트로 고정합니다.', '각 테스트는 독립적으로 반복 가능해야 하며 비동기 테스트는 Promise가 끝날 때까지 기다려야 합니다.'],
    overviewExample: 'function average(values) {\n  if (values.length === 0) return 0;\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconst scores = [2, 4];\nconst actual = average(scores);\nconsole.log(actual, average([]), actual === 3); // 3 0 true',
    sessions: [
      studySession(1, '1일차 · 준비·실행·검증', '테스트 입력을 준비하고 함수를 실행한 뒤 실제 결과를 기대 결과와 비교합니다.', 'Arrange는 입력, Act는 검사할 동작, Assert는 실제와 기대의 비교입니다. 세 단계의 순서를 분리하면 실패가 입력 문제인지 동작 문제인지 읽기 쉽습니다.', 'function total(values) { return values.reduce((sum, value) => sum + value, 0); }\nconst input = [2, 4]; // Arrange\nconst actual = total(input); // Act\nconsole.log(actual === 6); // Assert: true', [
        choice('js-w19-d1-aaa-v2', '테스트의 세 단계', '아래 검증 코드에서 `actual = total(input)`은 Arrange·Act·Assert 중 어느 역할인가요?', [
          ['검사할 함수를 실행하는 Act', '이 줄은 준비된 입력을 실제 함수에 전달해 관찰할 값을 만듭니다.'],
          ['입력 자료를 준비하는 Arrange', '입력 배열은 앞 줄에서 만들어졌으므로 함수 호출 자체는 준비 단계가 아닙니다.'],
          ['기대 결과와 비교하는 Assert', '비교는 다음 줄의 `actual === 6`에서 수행합니다.'],
        ], 0, '이 줄 전후에서 입력은 이미 있고, 비교식은 아직 나오지 않았습니다.', '함수 호출은 실제 동작을 수행하는 Act입니다. 결과를 비교하는 Assert와 구분하세요.'),
        outputTrace('js-w19-d1-trace-v2', '합계 테스트 추적', '다음 코드의 마지막 출력값을 적으세요.\n\n`function total(values) { return values.reduce((sum, value) => sum + value, 0); }\nconst actual = total([2, 4]);\nconsole.log(actual === 6);`', ['true'], 'Act의 반환값은 6이고, Assert는 그 값과 6을 비교합니다.', 'total의 반환값은 6이며 기대값도 6이므로 비교 결과는 true입니다.'),
        locateError('js-w19-d1-error-v2', '잘못 고정된 기대값 찾기', 'total([2, 4])의 계약상 결과는 6입니다. 이 테스트에서 잘못된 줄을 고르세요.', 'JavaScript', ['function total(values) { return values.reduce((sum, value) => sum + value, 0); }', 'const actual = total([2, 4]);', 'if (actual !== 5) throw new Error("실패");'], [3], '먼저 Act가 돌려주는 합계를 계산한 뒤 Assert의 기대 숫자와 비교하세요.', '3번 줄은 실제 결과 6을 기대값 5와 비교해 정상 동작을 실패로 판정합니다. 기대 결과가 계약과 일치해야 합니다.'),
      ]),
      studySession(2, '2일차 · 경계 입력 정책', '빈 배열을 포함한 경계 입력에서 합의한 결과를 테스트하고 정상 입력과 분리합니다.', '빈 평균을 0으로 볼지, 기록 없음으로 표현할지는 기능 계약의 결정입니다. 여기서는 함수가 숫자 0을 반환하고 화면은 별도로 기록 없음 상태를 보여 주는 정책을 사용합니다.', 'function average(values) {\n  if (values.length === 0) return 0;\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconsole.log(average([]), average([2, 4])); // 0 3', [
        choice('js-w19-d2-empty-policy-v2', '빈 평균의 계약', '이 과정에서 `average([])`의 계약을 0으로 정했다면 꼭 검증할 경계 사례는?', [
          ['빈 배열을 전달해 결과가 0인지 확인한다', '명시한 빈 입력 정책을 직접 실행해 바뀌지 않도록 고정합니다.'],
          ['점수가 두 개인 정상 배열만 다시 검사한다', '정상 경로는 빈 배열을 처리하는 분기를 통과하지 않습니다.'],
          ['반환값 대신 함수 이름에 average가 있는지 확인한다', '이름만으로는 빈 입력에서 계산이 안전한지 알 수 없습니다.'],
        ], 0, '요구사항에서 일반 입력과 다른 분기를 만드는 입력이 무엇인지 찾으세요.', '빈 배열은 별도 경로이므로 `average([]) === 0`을 직접 검사해야 합니다.'),
        outputTrace('js-w19-d2-trace-v2', '빈 배열과 정상 평균', '다음 출력 전체를 순서대로 적으세요.\n\n`function average(values) { if (values.length === 0) return 0; return values.reduce((sum, value) => sum + value, 0) / values.length; }\nconsole.log(average([]), average([2, 4]));`', ['0 3'], '첫 호출은 빈 배열 가드에서 끝나고 두 번째는 (2 + 4) / 2를 계산합니다.', '빈 입력은 명시한 정책에 따라 0이고 정상 입력 평균은 3이라 `0 3`입니다.'),
        locateError('js-w19-d2-error-v2', '빈 reduce 경계 찾기', 'average([])가 예외 없이 0을 반환해야 합니다. 경계에서 실패하는 줄을 고르세요.', 'JavaScript', ['function average(values) {', '  return values.reduce((sum, value) => sum + value) / values.length;', '}', 'console.log(average([]));'], [2], '빈 배열에서 초기 누적값 없는 reduce는 첫 값을 얻지 못합니다.', '2번 줄은 초기값 없는 reduce를 빈 배열에서 호출해 예외를 던집니다. 초기값 0만 추가해도 0으로 나누면 NaN이므로, 빈 배열을 먼저 확인해 0을 반환해야 합니다.'),
      ]),
      studySession(3, '3일차 · 독립적 테스트 상태', '각 테스트가 자신만의 상태를 만들어 실행 순서에 기대지 않도록 합니다.', '공유 객체를 수정하면 앞 테스트의 데이터가 다음 테스트에 남을 수 있습니다. 상태 생성 함수를 호출할 때마다 새 객체를 돌려주고, 외부 시스템이나 랜덤 입력에 기대지 않는 테스트를 만드세요.', 'function makeProgress() { return { completed: [] }; }\nconst first = makeProgress();\nconst second = makeProgress();\nfirst.completed.push("js");\nconsole.log(first === second, second.completed.length); // false 0', [
        choice('js-w19-d3-isolation-v2', '테스트 격리 선택', '테스트가 어떤 순서로 실행돼도 같은 결과를 내게 하려면?', [
          ['각 테스트가 별도 상태를 만들고 초기화한다', '테스트 사이에 변경한 값이 넘어오지 않으므로 실행 순서와 독립적입니다.'],
          ['앞선 테스트가 만든 전역 값을 다음 테스트가 사용한다', '공유 값의 이전 변경에 따라 다음 결과가 달라져 순서 의존성이 생깁니다.'],
          ['문제가 날 때마다 실행 중간에 무작위 값을 만든다', '입력 자체가 바뀌어 동일한 실패를 반복하기 어렵습니다.'],
        ], 0, '한 테스트에서 바꾼 값이 다음 테스트의 시작 상태에 남는지 따져 보세요.', '각 테스트가 초기 상태를 직접 준비하면 다른 테스트의 실행 순서에 의존하지 않습니다.'),
        outputTrace('js-w19-d3-trace-v2', '상태 격리 출력 추적', '다음 출력 전체를 적으세요.\n\n`function makeProgress() { return { completed: [] }; }\nconst first = makeProgress();\nconst second = makeProgress();\nfirst.completed.push("js");\nconsole.log(first === second, second.completed.length);`', ['false 0'], '함수를 두 번 호출하면 각 호출에서 새로운 객체와 배열을 만듭니다.', '서로 다른 객체라 첫 값은 false이고 second의 배열은 수정되지 않아 길이 0입니다.'),
        locateError('js-w19-d3-error-v2', '공유 상태 제거하기', '각 호출이 독립된 진도 객체를 받아야 합니다. 모든 호출에 같은 배열을 돌려주는 줄을 고르세요.', 'JavaScript', ['const shared = { completed: [] };', 'function makeProgress() {', '  return shared;', '}', 'console.log(makeProgress() === makeProgress());'], [3], '두 호출이 반환하는 참조가 서로 다른지 확인하세요.', '3번 줄은 매 호출마다 전역 shared를 반환하므로 변경 상태가 테스트 사이에 공유됩니다. 함수 안에서 새 객체를 만들도록 바꾸세요.'),
      ]),
      studySession(4, '4일차 · 비동기 테스트 완료 대기', 'Promise를 반환하는 동작을 기다린 뒤 결과를 검증해 테스트가 먼저 끝나지 않게 합니다.', '비동기 검증은 완료 시점을 명시해야 합니다. 이 과정의 코드는 Promise 흐름을 보여 주며, Node.js 내장 `node:test`에서는 테스트 callback을 `async`로 만들고 `await`하거나 Promise를 반환해야 완료 전에 테스트가 종료되지 않습니다.', 'async function verifyLoad(load) {\n  const value = await load();\n  return value === "ready";\n}\nconst passed = await verifyLoad(async () => "ready");\nconsole.log(passed); // true', [
        choice('js-w19-d4-await-v2', '비동기 assertion 기다리기', 'Node.js `node:test`에서 Promise를 반환하는 함수가 끝난 뒤 assertion을 실행하려면?', [
          ['테스트를 async로 만들고 await하거나 Promise를 반환한다', '러너가 비동기 완료를 기다려 assertion이 실제로 실행된 뒤 결과를 판정합니다.'],
          ['setTimeout 안에서 assertion을 호출하고 테스트를 동기 종료한다', '테스트 함수가 끝난 뒤 callback이 실행될 수 있어 실패가 결과에 반영되지 않습니다.'],
          ['Promise를 문자열로 바꿔 즉시 비교한다', '문자열에는 비동기 동작의 완료 결과가 들어 있지 않습니다.'],
        ], 0, '검증 함수가 끝날 때 비동기 작업도 이미 완료돼 있어야 합니다.', '비동기 test callback은 Promise 완료를 기다려야 합니다. Node 러너는 Promise를 반환하거나 async/await로 완료를 전달할 수 있습니다.'),
        locateError('js-w19-d4-error-v2', '테스트가 기다리지 않는 줄', 'load가 Promise를 반환합니다. assertion Promise를 테스트 러너가 기다리게 하지 않는 줄을 고르세요.', 'JavaScript · Node test fragment', ['test("load", () => {', '  load().then((value) => assert.equal(value, "ready"));', '});'], [2], 'callback의 반환값이 Promise인지 확인하세요. 중괄호 안에서 호출만 하고 버리면 암묵 반환되지 않습니다.', '2번 줄은 Promise를 시작하지만 반환하지 않습니다. `return load().then(...)` 또는 async callback의 `await load()`로 러너에 완료를 알려야 합니다.'),
        repairCode({ id: 'js-w19-d4-repair-v2', title: 'Promise 결과를 기다리는 검증 함수', prompt: '아래 `verifyLoad`를 고치세요. load의 Promise가 완료된 뒤 값이 "ready"인지 비교한 불리언 Promise를 반환합니다. await 또는 then 형태의 정적 패턴을 평가하며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'async function verifyLoad(load) {\n  const value = load();\n  return value === "ready";\n}', solutionPatterns: [String.raw`^\s*async\s+function\s+verifyLoad\s*\(\s*load\s*\)\s*\{\s*const\s+value\s*=\s*await\s+load\(\)\s*;?\s*return\s+value\s*===\s*"ready"\s*;?\s*\}\s*$`, String.raw`^\s*(?:async\s+)?function\s+verifyLoad\s*\(\s*load\s*\)\s*\{\s*return\s+load\(\)\.then\(\s*(?:\(\s*value\s*\)|value)\s*=>\s*value\s*===\s*"ready"\s*\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['load가 이행된 뒤 그 결과를 ready와 비교한다.'], constraints: ['Promise 자체를 문자열처럼 비교하지 않는다.'], examples: [{ input: 'async () => "ready"', output: 'true' }], tests: [{ input: 'async () => "ready"', expected: 'true' }, { input: 'async () => "later"', expected: 'false' }] }, gradingNote: '함수 전체 패턴을 확인하는 정적 채점입니다. Promise 실행 채점은 아닙니다.', hint: 'await를 쓰거나 then callback에서 이행된 결과를 비교하세요.', explanation: 'await와 then은 모두 Promise가 이행된 뒤 실제 값을 비교하게 해 불리언 Promise를 반환합니다.' }),
      ]),
      studySession(5, '5일차 · 회귀 사례 묶기', '실패를 만들었던 입력을 정상·경계 입력과 함께 고정해 수정 후 회귀를 확인합니다.', '회귀 검사는 수정 전 실패를 일으킨 최소 입력을 반드시 포함해야 합니다. 이 예제는 공백·대문자 입력과 일반 문자열, 빈 문자열의 기대값을 각각 비교합니다.', 'function normalize(value) { return value.trim().toLowerCase(); }\nconst cases = [["  JS ", "js"], ["React", "react"], ["", ""]];\nconsole.log(cases.map(([input, expected]) => normalize(input) === expected).join(",")); // true,true,true', [
        choice('js-w19-d5-regression-v2', '회귀 테스트의 입력', '버그를 고쳐도 다시 나타나지 않도록 테스트에 꼭 남겨야 하는 것은?', [
          ['원래 실패했던 최소 입력과 그 입력에 대한 올바른 기대 결과', '수정 전 증상을 다시 만들고 새 계약을 지켰는지 직접 확인합니다.'],
          ['함수 이름을 포함하는 문자열 하나', '함수가 실제로 입력을 처리하는지나 결과가 맞는지는 검사하지 않습니다.'],
          ['설명 주석만 비교하는 검사', '주석이 맞아도 동작이 달라진 오류를 감지하지 못합니다.'],
        ], 0, '실패를 보였던 입력을 수정 뒤 다시 실행할 수 있나요?', '회귀 테스트는 과거 실패 입력과 기대값을 실행해 같은 결함이 다시 생기지 않게 합니다.'),
        outputTrace('js-w19-d5-trace-v3', '세 회귀 사례의 결과', '다음 코드가 출력하는 세 비교 결과를 적으세요.\n\n`function normalize(value) { return value.trim().toLowerCase(); }\nconst cases = [["  JS ", "js"], ["React", "react"], ["", ""]];\nconsole.log(cases.map(([input, expected]) => normalize(input) === expected).join(","));`', ['true,true,true'], '세 입력 각각에 trim과 소문자 변환을 적용한 결과를 기대 문자열과 비교하세요.', '공백·대문자 입력, 일반 문자열, 빈 문자열이 각 기대값과 같으므로 세 결과가 모두 true입니다.'),
        repairCode({ id: 'js-w19-d5-repair-v2', title: '빈 입력 회귀 사례 포함 확인', prompt: '아래 `coversEmptyInput`을 고치세요. cases 중 input이 빈 배열인 사례가 하나라도 있으면 true를 반환합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function coversEmptyInput(cases) {\n  return false;\n}', solutionPatterns: [String.raw`^\s*function\s+coversEmptyInput\s*\(\s*cases\s*\)\s*\{\s*return\s+cases\.some\(\(\s*item\s*\)\s*=>\s*item\.input\.length\s*===\s*0\s*\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['input이 빈 배열인 항목이 있으면 true를 반환한다.'], constraints: ['cases 배열을 변경하지 않는다.'], examples: [{ input: '[{ input: [] }]', output: 'true' }], tests: [{ input: '[{ input: [] }]', expected: 'true' }, { input: '[{ input: [1] }]', expected: 'false' }] }, gradingNote: '전체 함수 구조 정적 채점이며 코드를 실행하지 않습니다.', hint: '배열 원소 중 조건을 만족하는 항목의 존재 여부를 검사하세요.', explanation: 'some은 한 항목이라도 빈 입력 조건을 만족하면 true를 반환해 회귀 경계 사례를 확인할 수 있습니다.' }),
      ]),
    ],
  },
  20: {
    objective: '오류를 고치기 전에 최소 입력으로 재현하고 관찰 근거 하나씩으로 가설을 검증합니다.',
    intro: '디버깅은 임의 변경이 아니라 재현 가능한 증거를 모으는 순서입니다. 입력과 순서를 고정하고, 필요한 상태만 관찰한 뒤 한 번에 한 가설을 시험합니다. 실패 원인을 빈 값이나 성공으로 숨기지 않습니다.',
    points: ['최소 재현 사례는 문제를 만들기 위해 필요한 입력·순서만 남깁니다.', '로그에는 오류 유형과 요청 식별자처럼 원인 판별에 필요한 정보만 담고 비밀번호·토큰·개인 자료는 넣지 않습니다.', '수정 뒤 원래 실패 사례와 정상·경계 사례를 다시 실행합니다.'],
    overviewExample: 'function firstTitle(courses) {\n  return courses[0]?.title ?? "없음";\n}\nconsole.log(firstTitle([]), firstTitle([{ title: "JS" }])); // 없음 JS',
    sessions: [
      studySession(1, '1일차 · 최소 재현 만들기', '문제를 반복해서 관찰할 수 있도록 입력과 실행 순서를 최소한으로 고정합니다.', '불필요한 데이터를 제거해도 같은 실패가 나는지 확인합니다. 빈 목록처럼 작은 입력은 undefined 접근 같은 경계를 단순하게 드러냅니다.', 'function firstTitle(courses) { return courses[0]?.title ?? "없음"; }\nconsole.log(firstTitle([])); // 없음', [
        choice('js-w20-d1-repro-v2', '최소 재현 시작', '가끔 빈 목록에서 제목을 읽다 실패합니다. 원인을 좁히는 첫 단계는?', [
          ['실패를 다시 만드는 최소 입력과 순서를 고정한다', '같은 증상을 반복해야 이후 한 가지씩 바꾼 결과를 비교할 수 있습니다.'],
          ['관련 코드 여러 곳을 동시에 수정한다', '증상이 사라져도 어떤 수정이 영향을 줬는지 분리할 수 없습니다.'],
          ['재현 전에 모든 데이터를 무작위로 바꾼다', '실패 입력이 유지되지 않아 동일한 문제인지 비교하기 어렵습니다.'],
        ], 0, '어떤 조건일 때만 빈 목록이 되는지 입력을 줄여 다시 실행해 보세요.', '최소 재현은 불필요한 요인을 제거하면서 같은 문제를 되풀이할 수 있는 사례입니다.'),
        outputTrace('js-w20-d1-trace-v2', '빈 목록의 안전한 결과', '다음 출력 전체를 적으세요.\n\n`function firstTitle(courses) { return courses[0]?.title ?? "없음"; }\nconsole.log(firstTitle([]), firstTitle([{ title: "JS" }]));`', ['없음 JS'], '첫 배열에는 항목이 없고 두 번째 배열의 첫 항목에는 title이 있습니다.', '빈 배열은 nullish 경로의 대체 문자열을 쓰고 정상 배열은 JS를 읽어 `없음 JS`입니다.'),
        locateError('js-w20-d1-error-v2', '재현 입력에서 예외 나는 줄', 'courses가 빈 배열일 때도 안전하게 기본 제목을 보여야 합니다. 실패를 만드는 줄을 고르세요.', 'JavaScript', ['function firstTitle(courses) {', '  return courses[0].title;', '}', 'console.log(firstTitle([]));'], [2], '빈 배열에서 courses[0]의 값이 무엇인지 확인하세요.', '2번 줄은 없는 첫 항목의 title을 읽습니다. optional chaining과 기본값 또는 명시적인 빈 배열 분기가 필요합니다.'),
      ]),
      studySession(2, '2일차 · 관찰과 가설', '오류를 구분할 최소 맥락만 관찰하고 관찰 사실과 원인 가설을 분리합니다.', '동시 요청 문제를 살필 때 요청 id와 시작·완료 순서는 유용합니다. 전체 사용자 객체를 무제한 기록하거나 인증 값·검색 개인정보를 로그에 남기면 안 됩니다.', 'const events = ["r1 시작", "r2 시작", "r2 완료", "r1 완료"];\nconsole.log(events.join(" -> ")); // 요청 응답 순서를 관찰', [
        choice('js-w20-d2-observe-v2', '진단에 필요한 로그', '검색 결과가 가끔 오래된 요청으로 덮입니다. 처음 관찰할 로그로 가장 적절한 것은?', [
          ['요청 id와 시작·완료 시각, 현재 검색어의 안전한 요약', '요청별 흐름과 응답 순서를 비교할 단서를 주면서 필요한 맥락에 한정합니다.'],
          ['렌더마다 토큰과 전체 사용자 객체를 전부 출력한다', '민감정보를 노출하고 로그가 과도해 원인 단서도 찾기 어려워집니다.'],
          ['catch에서 모든 실패를 빈 배열로 바꾸고 아무것도 기록하지 않는다', '정상 빈 결과와 실패가 구분되지 않아 원인을 관찰할 수 없습니다.'],
        ], 0, '오래된 결과와 새 결과를 식별할 값과 도착 순서를 생각하세요.', '요청 식별자와 처리 순서 등 원인을 구분하는 최소 정보만 안전하게 남기세요.'),
        outputTrace('js-w20-d2-trace-v2', '응답 도착 순서 읽기', '다음 로그 배열을 이어 쓴 출력으로 적으세요.\n\n`const events = ["r1 시작", "r2 시작", "r2 완료", "r1 완료"];\nconsole.log(events.join(" -> "));`', ['r1 시작 -> r2 시작 -> r2 완료 -> r1 완료'], 'join의 구분자는 각 배열 항목 사이에 한 번씩 들어갑니다.', '배열 순서대로 화살표 구분자를 넣어 연결하면 `r1 시작 -> r2 시작 -> r2 완료 -> r1 완료`입니다.'),
        locateError('js-w20-d2-error-v2', '실패 원인을 감추는 catch', '요청 실패를 빈 검색 결과와 구분해 보여야 합니다. 이 요구를 깨뜨리는 줄을 고르세요.', 'JavaScript', ['async function load(query) {', '  try { return await request(query); }', '  catch { return []; }', '}'], [3], '연결 실패도 호출자가 구분할 수 있는 상태로 남는지 보세요.', '3번 줄은 모든 실패를 성공한 빈 목록처럼 바꿉니다. 오류를 의미 있는 실패 상태로 전달하거나 필요한 안전한 맥락을 기록해야 합니다.'),
      ]),
      studySession(3, '3일차 · 한 가설씩 확인하기', '재현 입력을 유지한 채 한 번에 하나의 조건만 바꾸어 원인과 결과의 관계를 분리합니다.', '입력이 계속 바뀌면 수정이 효과가 있었는지 알 수 없습니다. 고정한 입력에서 하나의 조건만 바꾸고 결과를 비교하세요. 무작위 값은 진단 과정에 추가하지 않습니다.', 'function canLoad(value) { return value !== null; }\nconsole.log(canLoad(null), canLoad("js")); // false true', [
        choice('js-w20-d3-hypothesis-v2', '가설 검증 순서', '두 가지 수정이 동시에 바뀌었을 때 결과가 달라졌습니다. 다음 실험은 어떻게 해야 하나요?', [
          ['입력을 고정하고 변경 하나만 되돌리거나 적용해 비교한다', '변수 하나만 달라야 결과 차이를 그 수정과 연결할 수 있습니다.'],
          ['매번 다른 입력과 난수를 추가한다', '실험마다 조건이 달라져 원인 후보를 더 분리하기 어려워집니다.'],
          ['한 번 통과한 결과를 보고 테스트를 지운다', '같은 입력에서 재현 가능한 결과인지 확인하지 못합니다.'],
        ], 0, '변경한 변수 외에 나머지 실험 조건도 같은지 점검하세요.', '재현 입력을 고정하고 조건을 하나씩 바꿔야 어떤 가설이 결과를 바꾸는지 알 수 있습니다.'),
        outputTrace('js-w20-d3-trace-v2', '고정 입력의 가드 결과', '다음 출력값을 적으세요.\n\n`function canLoad(value) { return value !== null; }\nconsole.log(canLoad(null), canLoad("js"));`', ['false true'], '첫 호출에는 null, 두 번째에는 문자열을 전달합니다.', 'null은 거절되어 false이고 문자열은 null이 아니므로 true입니다.'),
        locateError('js-w20-d3-error-v2', '재현 결과를 불안정하게 만드는 줄', '같은 입력에서 assertion이 항상 같은 결과를 내야 합니다. 무작위성을 끌어오는 줄을 고르세요.', 'JavaScript', ['function passes() {', '  const expected = 3;', '  return expected === 3 + Math.random();', '}'], [3], '같은 호출을 반복해도 비교의 양쪽 값이 같게 유지되는지 확인하세요.', '3번 줄은 실행마다 다른 난수를 기대값에 더해 결과가 불안정해집니다. 고정 입력과 고정 기대값을 사용하세요.'),
      ]),
      studySession(4, '4일차 · 오류 경계 보존', '잘못된 입력과 유효한 빈 결과를 구분하고 호출자가 실패 원인을 처리할 수 있게 합니다.', '모든 오류를 기본값으로 감추면 호출자는 실패와 정상 결과를 구분하지 못합니다. 실패 이유를 보존하되 사용자 입력이나 민감값을 로그에 무분별하게 복사하지 않습니다.', 'function parseSettings(text) {\n  return JSON.parse(text);\n}\ntry { parseSettings("not-json"); }\ncatch (error) { console.log(error.name); } // SyntaxError', [
        choice('js-w20-d4-error-boundary-v2', '예외 전달 판단', '설정 문자열 파싱이 실패할 수 있고 호출 화면에서 오류 안내가 필요합니다. 적절한 경계 처리는?', [
          ['실패를 명시적 오류 상태나 처리 가능한 예외로 전달한다', '호출자가 로딩·정상 데이터·실패 안내를 따로 표시할 수 있습니다.'],
          ['실패할 때마다 성공한 빈 객체를 반환한다', '유효한 빈 설정과 형식 오류를 같은 값으로 만들어 원인을 감춥니다.'],
          ['오류를 삼키고 화면을 계속 로딩 상태로 둔다', '실패를 알릴 수 없고 로딩도 끝나지 않아 사용자가 복구할 수 없습니다.'],
        ], 0, '정상 입력으로 만든 빈 설정과 파싱 실패가 같은 결과가 되는지 확인하세요.', '실패는 성공한 빈 값과 분리된 상태로 호출자에게 전달해야 재시도나 오류 안내가 가능합니다.'),
        outputTrace('js-w20-d4-trace-v2', '실패 유형 관찰', '아래 코드에서 콘솔에 출력되는 오류 유형 이름을 적으세요.\n\n`try { JSON.parse("not-json"); } catch (error) { console.log(error.name); }`', ['SyntaxError'], 'JSON.parse가 문법에 맞지 않는 JSON 문자열을 읽으면 어떤 예외를 던지는지 떠올리세요.', '유효하지 않은 JSON 텍스트는 SyntaxError를 던지므로 그 name이 출력됩니다.'),
        repairCode({ id: 'js-w20-d4-repair-v2', title: '파싱 실패를 호출자에게 전달', prompt: '아래 `parseSettings`를 고치세요. JSON 파싱 성공 때는 값을 반환하고 실패 때는 오류를 숨기지 않고 호출자에게 전달합니다. 정적 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function parseSettings(text) {\n  try { return JSON.parse(text); }\n  catch { return {}; }\n}', solutionPatterns: [String.raw`^\s*function\s+parseSettings\s*\(\s*text\s*\)\s*\{\s*return\s+JSON\.parse\(\s*text\s*\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['유효한 JSON은 파싱한 값을 반환한다.'], constraints: ['잘못된 JSON의 SyntaxError를 빈 객체로 바꾸지 않고 호출자에게 전달한다.'], examples: [{ input: '"{\\"theme\\":\\"dark\\"}"', output: '{ theme: "dark" }' }], tests: [{ input: '"{}"', expected: '{}' }, { input: '"not-json"', expected: 'SyntaxError가 전달됨' }] }, gradingNote: '전체 함수 모양의 정적 패턴 채점이며 오류 경로를 실행하는 채점은 아닙니다.', hint: '오류를 catch해서 대체 객체로 바꾸는 경계를 제거하세요.', explanation: 'JSON.parse가 던지는 SyntaxError를 전달하면 호출자가 오류 상태와 성공한 빈 설정을 구분할 수 있습니다.' }),
      ]),
      studySession(5, '5일차 · 수정 후 회귀 확인', '수정 전 실패를 일으킨 사례와 정상 사례를 고정해 같은 결함의 재발을 확인합니다.', '회귀 입력은 코드의 오류 문구나 사용자의 비밀 값을 복사하지 않고도 증상을 재현할 수 있어야 합니다. 오류 종류와 수행 작업을 제한적으로 구조화하면 원인 확인과 데이터 보호를 함께 고려할 수 있습니다.', 'function failureContext(error, operation) {\n  return { name: error.name, operation };\n}\nconst context = failureContext(new TypeError("invalid"), "parse");\nconsole.log(context.name, context.operation); // TypeError parse', [
        choice('js-w20-d5-regression-v2', '수정 후 검증 묶음', '빈 목록 오류를 수정한 뒤 가장 유용한 최소 회귀 입력 묶음은?', [
          ['원래 빈 입력, 정상 항목, 관련 경계 입력', '재현 사례와 수정된 정상 경로를 함께 확인해 부작용을 발견합니다.'],
          ['큰 정상 목록 하나만 여러 번 실행', '처음 실패했던 빈 입력 경로가 다시 깨져도 알 수 없습니다.'],
          ['수정한 함수의 글자 수를 이전과 비교', '코드가 요구 결과를 내는지는 글자 수로 판정할 수 없습니다.'],
        ], 0, '첫 실패를 다시 만드는 입력과 수정으로 영향받을 정상 입력을 함께 고르세요.', '회귀 검증은 원래 실패했던 재현 입력과 정상·경계 결과를 함께 유지해야 합니다.'),
        outputTrace('js-w20-d5-trace-v2', '제한된 오류 맥락 출력', '다음 출력 전체를 적으세요.\n\n`function failureContext(error, operation) { return { name: error.name, operation }; }\nconst context = failureContext(new TypeError("invalid"), "parse");\nconsole.log(context.name, context.operation);`', ['TypeError parse'], '객체에는 오류 클래스 이름과 작업 식별자만 담깁니다.', '오류의 name은 TypeError이고 operation은 parse이므로 `TypeError parse`입니다.'),
        repairCode({ id: 'js-w20-d5-repair-v2', title: '안전한 오류 맥락 만들기', prompt: '아래 `failureContext`를 고치세요. 오류의 이름과 작업 식별자만 새 객체로 반환합니다. 원시 오류 메시지나 입력값은 기록하지 않습니다. 정적 함수 패턴 평가이며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function failureContext(error, operation) {\n  return {};\n}', solutionPatterns: [String.raw`^\s*function\s+failureContext\s*\(\s*error\s*,\s*operation\s*\)\s*\{\s*return\s*\{\s*name\s*:\s*error\.name\s*,\s*operation\s*\}\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['error.name과 operation을 각각 name과 operation 키로 반환한다.'], constraints: ['오류 메시지와 원본 입력을 결과에 복사하지 않는다.'], examples: [{ input: 'TypeError, "parse"', output: '{ name: "TypeError", operation: "parse" }' }], tests: [{ input: 'TypeError, "parse"', expected: 'TypeError와 parse 보존' }, { input: 'SyntaxError, "read"', expected: 'SyntaxError와 read 보존' }] }, gradingNote: '함수 구조를 검사하는 정적 패턴이며 코드를 실행하지 않습니다.', hint: '새 객체에 error.name과 operation을 각각 명시적으로 담으세요.', explanation: '오류 유형과 수행 작업은 진단에 쓰고, 원시 메시지에 포함될 수 있는 개인정보·비밀값은 복사하지 않습니다.' }),
      ]),
    ],
  },
  21: {
    objective: '동일한 입력에서 성능을 측정하고 평균적 자료구조 비용과 반복 작업을 비교해 필요한 일만 수행합니다.',
    intro: '성능 개선은 추측이나 코드 줄 수가 아니라 대표 입력에서의 측정과 결과 동일성으로 판단합니다. 고해상도 시계, 반복 관찰, 평균적인 자료구조 비용, 목록 범위 계산을 연결합니다.',
    points: ['짧은 실행 구간에는 같은 monotonic 고해상도 시계를 쓰고 측정 시간은 환경에 따라 달라질 수 있음을 기억합니다.', 'Set 조회는 저장소 크기보다 빠를 것을 보장하는 추상 규칙이 아니라 평균 접근 시간이 sublinear여야 하는 명세입니다.', '불필요한 중복 계산을 줄이되 입력 변화에 따라 낡은 결과를 재사용하지 않는지 검사합니다.', 'slice로 화면에 필요한 데이터 범위를 고르는 것과 실제 DOM 가상화 렌더링은 별도 작업입니다.'],
    overviewExample: 'function measure(run, now) {\n  const start = now();\n  run();\n  return now() - start;\n}\nconst ticks = [100, 102.5];\nconsole.log(measure(() => 42, () => ticks.shift())); // 2.5 ms',
    sessions: [
      studySession(1, '1일차 · 일관된 시계로 측정', '같은 monotonic 고해상도 시계로 작업 전후를 측정하고 시간 차를 밀리초로 계산합니다.', '짧은 작업 측정에는 시작과 끝에서 같은 시계를 사용합니다. 예제의 주입 시계는 브라우저의 performance.now와 같은 시간 단위·차 계산을 결정적으로 확인하기 위한 테스트 대역입니다.', 'function measure(run, now) { const start = now(); run(); return now() - start; }\nconst ticks = [100, 102.5];\nconsole.log(measure(() => 42, () => ticks.shift())); // 2.5', [
        choice('js-w21-d1-clock-v2', '측정에 쓸 시계', '브라우저에서 짧은 코드 구간의 경과 시간을 비교할 때 적절한 기본 시계는?', [
          ['performance.now()를 시작과 끝에서 모두 호출한다', '같은 monotonic 고해상도 기준의 두 timestamp를 빼면 경과 밀리초를 얻습니다.'],
          ['Date.now()와 performance.now()를 서로 빼서 사용한다', '각 시계의 기준 원점이 다르므로 두 값을 직접 빼면 유효한 경과 시간이 아닙니다.'],
          ['현재 시간 문자열 길이로 실행 속도를 추측한다', '문자열 길이는 실행에 걸린 시간이나 병목을 측정하지 않습니다.'],
        ], 0, '시작과 끝 값의 단위뿐 아니라 기준 시계도 같은지 확인하세요.', 'performance.now는 같은 기준의 고해상도 단조 시간 값을 제공해 짧은 경과 시간을 측정하기 적절합니다.'),
        outputTrace('js-w21-d1-trace-v2', '결정적 측정값 계산', '주입된 시계가 100과 102.5를 차례로 반환합니다. 출력되는 밀리초 값을 적으세요.\n\n`function measure(run, now) { const start = now(); run(); return now() - start; }\nconst ticks = [100, 102.5];\nconsole.log(measure(() => 42, () => ticks.shift()));`', ['2.5'], '두 번째 timestamp에서 첫 번째 timestamp를 뺍니다.', '102.5 - 100은 2.5이므로 출력은 2.5밀리초입니다.'),
        locateError('js-w21-d1-error-v2', '서로 다른 기준 시계 사용', '시작과 끝의 timestamp는 같은 performance 시계에서 얻어야 합니다. 잘못 섞인 계산 줄을 고르세요.', 'JavaScript', ['const start = Date.now();', 'runWork();', 'const elapsed = performance.now() - start;'], [3], 'Date.now는 Unix epoch 기준이고 performance.now는 performance time origin 기준입니다.', '3번 줄은 서로 다른 원점의 timestamp를 빼므로 유효한 경과 시간이 아닙니다. 시작과 종료를 모두 performance.now()로 측정하세요.'),
      ]),
      studySession(2, '2일차 · 자료 크기에 따른 조회 비용', '목록을 반복 비교할 때 중첩 순회 비용을 알아보고 반복 검색에 자료구조를 선택합니다.', '작은 입력에서는 두 방법의 차이가 보이지 않을 수 있습니다. 항목 수가 커지는 상황에서 비교 횟수가 어떻게 증가하는지 따지고, Set의 평균 조회 특성을 과장하지 않습니다.', 'function commonIds(first, second) {\n  const otherIds = new Set(second);\n  return first.filter((id) => otherIds.has(id));\n}\nconsole.log(commonIds(["js", "py"], ["py", "java"]).join(",")); // py', [
        choice('js-w21-d2-lookup-v2', '반복 포함 여부 조회', 'second 목록의 포함 여부를 first의 각 id마다 확인합니다. 반복 조회를 위해 Set을 만들었을 때 정확한 설명은?', [
          ['평균적으로 하위 선형 조회를 요구하지만 모든 조회가 반드시 O(1)이라고 보장하지는 않는다', 'ECMAScript는 키 수와 무관한 상수 시간이라고 단정하지 않고 평균 접근을 sublinear로 요구합니다.'],
          ['Set.has는 입력 크기와 상관없이 항상 O(1)이라고 명세한다', '구현의 자료구조 세부 비용은 고정 상수 시간으로 보장되지 않습니다.'],
          ['Set을 만들면 first의 중복 id도 자동으로 제거된다', 'Set은 두 번째 조회 집합만 만들며 반환되는 first 원소는 filter 결과에 따라 남습니다.'],
        ], 0, '언어 명세가 보장하는 것은 한 가지 특정 내부 자료구조의 복잡도인지 확인하세요.', 'Set은 평균적으로 sublinear 접근이 요구되지만 항상 O(1)이라는 보장은 없습니다.'),
        outputTrace('js-w21-d2-trace-v2', '집합 조회 순서 추적', '다음 코드의 결과를 적으세요.\n\n`function commonIds(first, second) { const otherIds = new Set(second); return first.filter((id) => otherIds.has(id)); }\nconsole.log(commonIds(["js", "py"], ["py", "java"]).join(","));`', ['py'], 'first의 순서를 유지하며 각 id가 otherIds에 들어 있는지 확인하세요.', 'js는 없고 py는 있으므로 결과 배열은 py 하나를 담습니다.'),
        locateError('js-w21-d2-error-v2', '중첩 순회 비용 찾기', '각 목록을 반복 비교하는 비용을 줄이려 합니다. 모든 항목 쌍을 검사하는 줄을 고르세요.', 'JavaScript', ['function commonIds(first, second) {', '  const matches = [];', '  for (const left of first) {', '    for (const right of second) if (left === right) matches.push(left);', '  }', '  return matches;', '}'], [4], 'first 원소 하나마다 second 전체를 다시 도는 중첩 반복이 있는지 확인하세요.', '4번 줄은 각 first 항목마다 second 전체를 검사합니다. 포함 여부만 필요하면 Set을 고려할 수 있습니다. 다만 이 코드는 second에 같은 값이 여러 번 있으면 그만큼 추가하므로, 변경 전 중복 결과의 계약을 확인해야 합니다.'),
      ]),
      studySession(3, '3일차 · 중복 계산 제거와 정확성', '같은 안정된 입력으로 계산한 결과를 재사용하되 값이 바뀌면 오래된 계산값을 쓰지 않습니다.', '중복 계산을 줄이는 것은 도움이 될 수 있지만 캐시와 메모이제이션은 입력 변화 시 무효화 경계가 필요합니다. 우선 함수 안에서 계산 결과를 한 번 구해 여러 곳에 사용하는 단순한 최적화를 확인합니다.', 'function buildView(items, query) {\n  const matches = items.filter((item) => item.title.includes(query));\n  return { items: matches, count: matches.length };\n}\nconsole.log(buildView([{ title: "JS" }, { title: "Java" }], "J").count); // 2', [
        choice('js-w21-d3-reuse-v2', '계산 재사용 판단', '비싼 filter 결과를 화면과 결과 개수에 모두 써야 합니다. 안전한 첫 개선은?', [
          ['같은 입력에 대한 결과를 한 번 계산해 같은 함수 호출 안에서 재사용한다', '중복 순회를 피하면서 입력 시점의 같은 결과와 개수를 맞출 수 있습니다.'],
          ['입력이 바뀌어도 예전 결과를 영구적으로 전역 캐시에 보관한다', '검색어와 데이터가 바뀌면 낡은 결과를 반환할 수 있습니다.'],
          ['filter를 한 번 더 실행해 결과 개수만 구한다', '동일한 비싼 순회를 다시 수행하므로 중복 계산이 유지됩니다.'],
        ], 0, '같은 호출의 결과를 두 번 구하고 있는지부터 확인하세요.', '결과 배열을 한 번 계산해 반환 목록과 count가 같은 계산 시점의 값을 공유하도록 합니다.'),
        outputTrace('js-w21-d3-trace-v2', '필터 결과 재사용 추적', '다음 코드가 출력하는 count를 적으세요.\n\n`function buildView(items, query) { const matches = items.filter((item) => item.title.includes(query)); return { items: matches, count: matches.length }; }\nconsole.log(buildView([{ title: "JS" }, { title: "Java" }], "J").count);`', ['2'], '두 title 중 대문자 J를 포함하는 항목 수를 세세요.', 'JS와 Java 두 항목 모두 J를 포함하므로 count는 2입니다.'),
        locateError('js-w21-d3-error-v2', '같은 검색 결과를 다시 계산', '같은 입력으로 결과와 개수를 만들어야 합니다. 같은 filter를 두 번 호출하는 줄을 고르세요.', 'JavaScript', ['function buildView(items, query) {', '  const visible = items.filter((item) => item.title.includes(query));', '  const count = items.filter((item) => item.title.includes(query)).length;', '  return { visible, count };', '}'], [3], '이미 visible 결과가 만들어졌는데 별도의 필터가 한 번 더 실행되는지 보세요.', '3번 줄은 동일한 filter를 다시 실행합니다. 앞의 visible.length를 쓰면 중복 순회를 줄이고 둘의 결과 일치도 유지합니다.'),
      ]),
      studySession(4, '4일차 · 비교 가능한 반복 측정', '같은 입력과 검증 조건에서 여러 번 측정하고 차이가 환경 변동인지 실제 개선인지 살핍니다.', '한 번의 짧은 실행 시간은 브라우저 부하·JIT 준비·타이머 해상도에 민감할 수 있습니다. 비교 전 결과가 같은지 확인하고 준비 실행 뒤 동일 입력을 여러 차례 측정하세요. 단일 숫자로 성능을 단정하지 않습니다.', 'function mean(samples) {\n  if (samples.length === 0) return 0;\n  return samples.reduce((sum, value) => sum + value, 0) / samples.length;\n}\nconsole.log(mean([2, 3, 4]), mean([])); // 3 0', [
        choice('js-w21-d4-benchmark-v2', '공정한 간단 비교', '두 구현의 짧은 작업 시간을 비교하려 합니다. 측정 전에 맞춰야 할 조건은?', [
          ['같은 입력·환경에서 결과를 확인하고 준비 후 여러 차례 측정한다', '입력과 실행 조건을 맞추고 반복 관찰해야 변동을 단일 실행 차이와 구분할 수 있습니다.'],
          ['각 구현에 다른 크기의 입력을 한 번씩만 넣는다', '측정 결과에 입력 규모와 실행 변동이 섞여 비교할 수 없습니다.'],
          ['더 짧아 보이는 함수의 줄 수만 비교한다', '코드 길이는 처리 시간이나 사용자 체감 성능을 나타내지 않습니다.'],
        ], 0, '측정하려는 구현 외의 입력 크기와 실행 환경은 비교에서 같아야 합니다.', '동일 입력과 조건을 맞추고 여러 관찰을 비교하되, 짧은 벤치마크 한 번으로 일반 성능을 단정하지 마세요.'),
        locateError('js-w21-d4-error-v2', '빈 샘플 평균 오류 찾기', '측정 결과가 하나도 없을 때 mean은 합의된 정책인 0을 반환해야 합니다. 실패하는 줄을 고르세요.', 'JavaScript', ['function mean(samples) {', '  return samples.reduce((sum, value) => sum + value) / samples.length;', '}', 'console.log(mean([]));'], [2], '빈 배열의 reduce와 0으로 나누는 경로를 함께 살펴보세요.', '2번 줄은 빈 배열에서 초기값 없는 reduce를 호출해 예외가 납니다. 빈 샘플 정책을 먼저 정하고 명시적으로 처리해야 합니다.'),
        repairCode({ id: 'js-w21-d4-repair-v2', title: '측정 표본 평균 계산', prompt: '아래 `mean`을 고치세요. 표본이 비어 있으면 0, 아니면 모든 duration의 산술 평균을 반환합니다. reduce 또는 for...of 형태의 정적 패턴을 평가하며 실행 채점은 아닙니다.', language: 'JavaScript', starterCode: 'function mean(samples) {\n  return 0;\n}', solutionPatterns: [String.raw`^\s*function\s+mean\s*\(\s*samples\s*\)\s*\{\s*if\s*\(\s*samples\.length\s*===\s*0\s*\)\s*return\s+0\s*;?\s*return\s*samples\.reduce\(\(\s*sum\s*,\s*value\s*\)\s*=>\s*sum\s*\+\s*value\s*,\s*0\s*\)\s*\/\s*samples\.length\s*;?\s*\}\s*$`, String.raw`^\s*function\s+mean\s*\(\s*samples\s*\)\s*\{\s*if\s*\(\s*samples\.length\s*===\s*0\s*\)\s*return\s+0\s*;?\s*let\s+total\s*=\s*0\s*;?\s*for\s*\(\s*const\s+value\s+of\s+samples\s*\)\s*\{\s*total\s*\+=\s*value\s*;?\s*\}\s*return\s+total\s*\/\s*samples\.length\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['표본 목록이 비어 있으면 정한 정책에 따라 숫자 0을 반환한다.', '표본이 있으면 값들의 산술 평균을 반환한다.'], constraints: ['합계는 0에서 시작해 모든 표본을 한 번씩 더한다.'], examples: [{ input: '[2, 3, 4]', output: '3' }], tests: [{ input: '[]', expected: '0' }, { input: '[2, 4]', expected: '3' }] }, gradingNote: '함수 전체 구조 정적 패턴 평가이며 코드 실행 채점은 아닙니다.', hint: '빈 목록을 먼저 처리한 뒤 reduce나 반복문으로 합계를 구해 나누세요.', explanation: '빈 샘플과 수치 표본을 나눈 뒤 모든 duration을 한 번씩 더해 개수로 나눕니다.' }),
      ]),
      studySession(5, '5일차 · 필요한 목록 범위만 선택', '화면에 필요한 시작 위치와 개수로 목록 일부를 선택하고 페이지 경계를 확인합니다.', 'slice는 새 배열의 데이터 범위를 고를 뿐 실제 DOM 가상화나 스크롤 렌더링을 구현하지 않습니다. 시작 위치·개수의 음수 경계를 정한 뒤 빈 목록과 끝을 넘는 시작점도 확인하세요.', 'function visibleItems(items, start, count) {\n  const begin = Math.max(0, start);\n  return items.slice(begin, begin + Math.max(0, count));\n}\nconsole.log(visibleItems(["A", "B", "C", "D"], 1, 2).join(",")); // B,C', [
        choice('js-w21-d5-window-v2', '큰 목록 표시 범위', '아주 긴 과정 목록에서 한 페이지에 필요한 항목만 계산하려면?', [
          ['시작 위치와 페이지 크기로 slice 범위를 정한다', '현재 페이지 데이터만 새 배열에 골라 다음 표시 단계로 전달합니다.'],
          ['목록이 길어도 매번 전체 항목을 모두 그린다', '화면에 보이지 않는 항목까지 계속 처리해 DOM 작업이 커질 수 있습니다.'],
          ['배열을 sort해 항목 수를 줄인다', '정렬은 표시 범위를 줄이지 않고 원래 순서도 바꿀 수 있습니다.'],
        ], 0, '필요한 첫 항목 위치와 화면에 담을 개수를 나눠 생각하세요.', 'slice로 페이지 데이터 범위를 선택할 수 있지만 이 예제만으로 브라우저의 DOM 가상화가 구현되는 것은 아닙니다.'),
        outputTrace('js-w21-d5-trace-v2', '페이지 항목 출력', '다음 코드에서 선택되는 항목을 순서대로 적으세요.\n\n`function visibleItems(items, start, count) { return items.slice(start, start + count); }\nconsole.log(visibleItems(["A", "B", "C", "D"], 1, 2).join(","));`', ['B,C'], 'slice의 끝 인덱스는 포함하지 않습니다.', '시작 1부터 끝 인덱스 3 직전까지 선택하므로 B와 C가 출력됩니다.'),
        repairCode({ id: 'js-w21-d5-repair-v2', title: '페이지 범위를 안전하게 자르기', prompt: '아래 `visibleItems`를 고치세요. 음수 시작 위치와 페이지 크기는 0으로 취급하고, 요청한 개수 이하의 새 배열을 반환합니다. Math.max 경계 변수 또는 inline slice 형태의 정적 패턴을 평가하며 DOM 렌더링이나 실행 채점은 제공하지 않습니다.', language: 'JavaScript', starterCode: 'function visibleItems(items, start, count) {\n  return items;\n}', solutionPatterns: [String.raw`^\s*function\s+visibleItems\s*\(\s*items\s*,\s*start\s*,\s*count\s*\)\s*\{\s*const\s+begin\s*=\s*Math\.max\(0\s*,\s*start\s*\)\s*;\s*return\s+items\.slice\(\s*begin\s*,\s*begin\s*\+\s*Math\.max\(0\s*,\s*count\s*\)\s*\)\s*;?\s*\}\s*$`, String.raw`^\s*function\s+visibleItems\s*\(\s*items\s*,\s*start\s*,\s*count\s*\)\s*\{\s*return\s+items\.slice\(\s*Math\.max\(0\s*,\s*start\s*\)\s*,\s*Math\.max\(0\s*,\s*start\s*\)\s*\+\s*Math\.max\(0\s*,\s*count\s*\)\s*\)\s*;?\s*\}\s*$`, String.raw`^\s*function\s+visibleItems\s*\(\s*items\s*,\s*start\s*,\s*count\s*\)\s*\{\s*const\s+begin\s*=\s*Math\.max\(0\s*,\s*start\s*\)\s*;\s*const\s+size\s*=\s*Math\.max\(0\s*,\s*count\s*\)\s*;\s*return\s+items\.slice\(\s*begin\s*,\s*begin\s*\+\s*size\s*\)\s*;?\s*\}\s*$`], acceptanceCriteria: { requirements: ['start 위치부터 count개 이하를 새 배열로 반환한다.'], constraints: ['음수 start와 count를 0으로 처리하고 입력 items를 바꾸지 않는다.'], examples: [{ input: '["A", "B", "C"], 1, 2', output: '["B", "C"]' }], tests: [{ input: '["A", "B"], -1, 1', expected: '["A"]' }, { input: '["A"], 4, 2', expected: '[]' }, { input: '[], 0, 5', expected: '[]' }] }, gradingNote: '전체 함수 모양을 검사하는 정적 패턴입니다. 배열 코드 실행이나 DOM 가상화를 채점하지 않습니다.', hint: 'start와 count를 각각 0 이상으로 제한한 뒤 slice 범위를 계산하세요.', explanation: '범위를 입력 조건에 따라 계산하고 slice를 사용하면 원본 배열을 변경하지 않고 필요한 항목만 반환합니다.' }),
      ]),
    ],
  },
  ...javascriptReviewedWeeks22To24,
  ...javascriptReviewedWeeks25To26,
};

function legacyAdditions(week, subject) {
  if (week === 12) {
    const sessions = [
      [
        choice('js-w12-d1-validation-v2', '점수 입력 검증', '점수가 0 이상 100 이하인 숫자여야 합니다. `score < 0 || score > 100`이면 거부하는 검사에 더해, `NaN`과 숫자가 아닌 값도 거부하려면 어떤 검사가 필요할까요?', [
          ['`Number.isFinite(score)`', '`NaN`과 무한대, 숫자가 아닌 값을 모두 거부하고 유한한 숫자만 허용합니다.'],
          ['`typeof score === "number"`만', '`NaN`도 number 타입이므로 유한한 값인지 확인하지 못합니다.'],
          ['`Boolean(score)`', '유효한 0점도 거부하고 무한대는 참으로 판단하므로 점수 검증에 적합하지 않습니다.'],
        ], 0, '`NaN`을 0 또는 100과 비교한 결과와 문자열이 비교될 때의 타입 변환을 확인하세요.', '`NaN < 0`과 `NaN > 100`은 모두 false이고, 범위 비교는 문자열을 숫자로 변환할 수 있습니다. 먼저 `Number.isFinite(score)`로 유한한 숫자인지 확인한 뒤 0~100 범위를 검사합니다.'),
        outputTrace('js-w12-d1-average-trace', '평균 계산 추적', '유효한 점수가 `[60, 80, 100]`일 때 산술 평균은 얼마인가요?', ['80', '80.0'], '세 점수의 합을 개수 3으로 나눠 보세요.', '합계 240을 점수 개수 3으로 나누면 평균은 80입니다.'),
      ],
      [
        choice('js-w12-d2-empty-policy', '빈 통계의 결과', '학습 기록이 하나도 없을 때 `average([])`가 안정적으로 숫자 결과를 반환하게 하려면 어떤 정책이 적절할까요?', [
          ['0을 반환하고 화면에서 기록 없음도 구분한다', '계산 함수는 숫자를 돌려주고, 화면은 빈 기록 상태를 별도로 설명할 수 있습니다.'],
          ['`0 / 0` 결과를 그대로 평균으로 표시한다', 'JavaScript는 NaN을 만들므로 숫자 통계로 사용할 수 없습니다.'],
          ['첫 항목에 접근해 기본값을 추측한다', '빈 배열에는 첫 항목이 없어 undefined를 처리해야 합니다.'],
        ], 0, '빈 입력에서 reduce와 나눗셈이 각각 어떤 동작을 하는지 확인하세요.', '빈 입력을 명시적으로 처리하고 0을 반환하면 계산 계약이 명확해집니다.'),
        outputTrace('js-w12-d2-average-trace', '기록 평균 추적', '점수가 `[70, 90]`일 때 두 점수의 평균을 적으세요.', ['80', '80.0'], '두 점수를 더한 뒤 2로 나눠 보세요.', '70과 90의 합은 160이고, 두 점의 평균은 80입니다.'),
      ],
      [
        choice('js-w12-d3-immutable-choice', '중복 없는 완료 기록', '기존 배열을 바꾸지 않으면서 `lessonId`를 완료 목록에 한 번만 추가하려면 어떤 흐름이 알맞을까요?', [
          ['이미 있으면 기존 배열을 반환하고, 없으면 전개해 새 배열을 만든다', '이미 있는 id는 기존 배열을 그대로 반환하고, 새 id는 복사한 배열에 추가해 원본을 보존합니다.'],
          ['항상 `completed.push(lessonId)`를 호출한다', '기존 배열을 직접 바꾸며 이미 있는 id도 중복 저장합니다.'],
          ['`completed = lessonId`로 바꾼다', '배열을 id 문자열 하나로 교체해 기존 목록과 배열 자료형을 모두 잃습니다.'],
        ], 0, '중복 확인과 원본 불변 조건을 각각 만족하는지 생각해 보세요.', 'includes로 중복을 확인하고, 새 항목은 전개 문법으로 만든 새 배열에 담습니다.'),
        locateError('js-w12-d3-mutation', '기존 배열 변경 찾기', '완료 기록 함수는 입력으로 받은 배열을 바꾸지 않아야 합니다. 기존 배열을 직접 변경하는 줄을 고르세요.', 'JavaScript', [
          'function addCompletion(completed, lessonId) {',
          '  const next = [...completed];',
          '  next.push(lessonId);',
          '  completed.push(lessonId);',
          '  return next;',
          '}',
        ], [4], '복사한 next와 매개변수 completed 중 어느 쪽을 push하는지 줄별로 확인하세요.', '4번 줄은 호출자가 넘긴 completed 배열을 직접 변경합니다. 복사본 next만 갱신해야 합니다.'),
      ],
      [
        choice('js-w12-d4-single-pass', '한 번 순회하는 이유', '점수 배열의 합계와 개수를 함께 모아 평균을 만들 때 별도 정렬 없이 한 번 순회한다면 시간 복잡도는?', [
          ['O(n)', '각 점수를 일정한 횟수만 읽으므로 입력 길이에 비례합니다.'],
          ['O(n log n)', '정렬은 필요하지 않으므로 이 계산의 필수 비용이 아닙니다.'],
          ['O(1)', '배열을 읽을 때마다 일정한 작업이 필요하므로 원소 수가 늘수록 처리량도 비례해 증가합니다.'],
        ], 0, '각 원소를 한 번씩만 방문하는 반복 횟수와 입력 길이를 비교하세요.', '입력 n개를 한 번 순회하는 비용은 O(n)입니다.'),
        locateError('js-w12-d4-range', '배열 경계 찾기', '점수 배열을 정확히 한 번씩 읽어야 합니다. 존재하지 않는 마지막 다음 인덱스까지 순회하게 만드는 줄을 고르세요.', 'JavaScript', [
          'function total(scores) {',
          '  let sum = 0;',
          '  for (let index = 0; index <= scores.length; index += 1) {',
          '    sum += scores[index];',
          '  }',
          '  return sum;',
          '}',
        ], [3], '유효한 마지막 배열 인덱스는 length와 같은지, length보다 작은지 확인하세요.', '3번 줄의 `<=`는 index가 scores.length인 경우도 허용합니다. `< scores.length`로 바꾸면 유효한 인덱스만 방문합니다.'),
        repairCode({
          id: 'js-w12-d4-average-repair', title: '빈 입력을 고려한 평균 함수',
          prompt: '아래 `average` 함수를 고치세요. 빈 배열에는 0을 반환하고, 그 외에는 숫자를 모두 더해 점수 개수로 나눠야 합니다. 자동 평가는 함수를 실행하지 않고 전체 함수 구조를 확인합니다.',
          language: 'JavaScript', starterCode: 'function average(scores) {\n  return scores.reduce((sum, score) => sum + score) / scores.length;\n}',
          solutionPatterns: [
            String.raw`^\s*function\s+average\s*\(\s*scores\s*\)\s*\{\s*if\s*\(\s*scores\.length\s*===\s*0\s*\)\s*return\s+0\s*;?\s*return\s+scores\.reduce\(\s*\(\s*sum\s*,\s*score\s*\)\s*=>\s*sum\s*\+\s*score\s*,\s*0\s*\)\s*\/\s*scores\.length\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+average\s*\(\s*scores\s*\)\s*\{\s*if\s*\(\s*!scores\.length\s*\)\s*return\s+0\s*;?\s*return\s+scores\.reduce\(\s*\(\s*sum\s*,\s*score\s*\)\s*=>\s*sum\s*\+\s*score\s*,\s*0\s*\)\s*\/\s*scores\.length\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+average\s*\(\s*scores\s*\)\s*\{\s*if\s*\(\s*scores\.length\s*===\s*0\s*\)\s*\{\s*return\s+0\s*;?\s*\}\s*const\s+total\s*=\s*scores\.reduce\(\s*\(\s*sum\s*,\s*score\s*\)\s*=>\s*sum\s*\+\s*score\s*,\s*0\s*\)\s*;?\s*return\s+total\s*\/\s*scores\.length\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+average\s*\(\s*scores\s*\)\s*\{\s*if\s*\(\s*scores\.length\s*===\s*0\s*\)\s*return\s+0\s*;?\s*let\s+total\s*=\s*0\s*;?\s*for\s*\(\s*const\s+score\s+of\s+scores\s*\)\s*total\s*\+=\s*score\s*;?\s*return\s+total\s*\/\s*scores\.length\s*;?\s*\}\s*$`,
          ],
          acceptanceCriteria: { requirements: ['빈 배열은 0을 반환하고, 숫자 배열은 산술 평균을 반환한다.'], constraints: ['입력 배열을 변경하지 않는다.'], examples: [{ input: '[2, 4, 6]', output: '4' }], tests: [{ input: '[]', expected: '0' }, { input: '[60, 80, 100]', expected: '80' }] },
          gradingNote: '실행 채점이 아니라 전체 함수 모양과 지정한 반환식을 확인합니다. 실제 앱에서 추가 입력 테스트가 필요합니다.', hint: '빈 배열을 먼저 확인하고, reduce에는 빈 배열에서도 안전한 초기 합계 0을 전달하세요.', explanation: '빈 배열을 먼저 반환하면 0으로 나누는 경로를 막습니다. reduce의 초기값 0도 안전하게 누적을 시작하게 합니다.',
        }),
      ],
      [
        choice('js-w12-d5-integration-check', '통합 기능 검토', '평균 통계를 출시하기 전에 가장 중요한 입력 검증 조합은?', [
          ['빈 목록, 정상 숫자, NaN·무한대, 범위 밖 값', '계산 경계와 잘못된 숫자 입력을 함께 드러냅니다.'],
          ['중간 크기의 정상 목록 하나만', '빈 입력과 유효하지 않은 값을 확인하지 못합니다.'],
          ['정렬된 숫자만', '정렬 여부는 평균 계산의 입력 조건을 검증하지 않습니다.'],
        ], 0, '정상 경로와 빈 값·잘못된 숫자 경로를 모두 포함하세요.', '정상, 빈 배열, NaN·무한대, 허용 범위 밖 입력을 나눠 확인해야 합니다.'),
        outputTrace('js-w12-d5-copy-trace', '복사와 원본 비교', '다음을 실행한 뒤 출력되는 `completed.length:next.length` 값을 적으세요.\n\n`const completed = ["js"];\nconst next = [...completed, "react"];\nconsole.log(completed.length + ":" + next.length);`', ['1:2'], '전개 문법은 새 배열을 만들기 때문에 두 길이를 따로 세어 보세요.', '기존 배열은 한 항목이고 새 배열은 두 항목이므로 출력은 `1:2`입니다.'),
        repairCode({
          id: 'js-w12-d5-completion-repair', title: '완료 기록을 불변으로 갱신',
          prompt: '아래 `addCompletion` 함수를 고치세요. 이미 완료한 id면 입력 배열을 그대로 반환하고, 새 id면 기존 배열을 바꾸지 않은 새 배열을 반환합니다. 자동 평가는 함수를 실행하지 않고 전체 함수 구조를 확인합니다.',
          language: 'JavaScript', starterCode: 'function addCompletion(completed, lessonId) {\n  completed.push(lessonId);\n  return completed;\n}',
          solutionPatterns: [
            String.raw`^\s*function\s+addCompletion\s*\(\s*completed\s*,\s*lessonId\s*\)\s*\{\s*if\s*\(\s*completed\.includes\(lessonId\)\s*\)\s*return\s+completed\s*;?\s*return\s*\[\s*\.\.\.completed\s*,\s*lessonId\s*\]\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+addCompletion\s*\(\s*completed\s*,\s*lessonId\s*\)\s*\{\s*if\s*\(\s*completed\.indexOf\(lessonId\)\s*!==\s*-1\s*\)\s*return\s+completed\s*;?\s*return\s+completed\.concat\(lessonId\)\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+addCompletion\s*\(\s*completed\s*,\s*lessonId\s*\)\s*\{\s*if\s*\(\s*completed\.includes\(lessonId\)\s*\)\s*\{\s*return\s+completed\s*;?\s*\}\s*const\s+next\s*=\s*completed\.slice\(\s*\)\s*;?\s*next\.push\(lessonId\)\s*;?\s*return\s+next\s*;?\s*\}\s*$`,
            String.raw`^\s*function\s+addCompletion\s*\(\s*completed\s*,\s*lessonId\s*\)\s*\{\s*const\s+isNew\s*=\s*!completed\.includes\(lessonId\)\s*;?\s*return\s+isNew\s*\?\s*\[\s*\.\.\.completed\s*,\s*lessonId\s*\]\s*:\s*completed\s*;?\s*\}\s*$`,
          ],
          acceptanceCriteria: { requirements: ['기존 id는 중복 추가하지 않고 새 id는 새 배열 끝에 한 번 추가한다.'], constraints: ['새 id를 추가할 때 completed 배열을 직접 바꾸지 않는다.'], examples: [{ input: '["js"], "react"', output: '["js", "react"]' }], tests: [{ input: '["js"], "js"', expected: '["js"]' }, { input: '["js"], "react"', expected: '["js", "react"]' }] },
          gradingNote: '실행 채점이 아니라 전체 함수 모양과 중복·전개 반환 표현식을 확인합니다. 동작 검증에는 실제 함수 단위 테스트도 필요합니다.', hint: '먼저 includes로 중복 여부를 확인한 뒤, 새 id일 때만 전개 문법으로 새 배열을 반환하세요.', explanation: '기존 id는 그대로 두고 새 id만 새 배열에 추가하면 중복과 원본 변경을 모두 피할 수 있습니다.',
        }),
      ],
    ];
    const titles = ['요구사항과 평균', '빈 입력과 누적', '완료 기록 갱신', '복잡도 점검', '통합 검토'];
    const goals = [
      '점수 유효성, 평균의 입력과 결과를 명확히 합니다.',
      '빈 목록의 정책과 안전한 누적값을 정합니다.',
      '완료 기록을 중복 없이 원본을 보존하며 갱신합니다.',
      '한 번 순회하는 비용과 배열 경계를 확인합니다.',
      '정상·빈 값·잘못된 값·중복 기록을 함께 점검합니다.',
    ];
    const intros = [
      '계산 전에 점수가 유한한 숫자이며 0에서 100 사이인지 검증합니다. 입력 검사와 평균 계산을 별도 함수로 나누어 역할을 확인합니다.',
      '기록이 없는 평균은 0으로 정의하고, 화면은 0점 기록과 기록 없음 상태를 구분해야 합니다. 계산 정책과 표시 정책을 따로 살펴봅니다.',
      '완료된 단원 ID를 중복 없이 추가하면서 기존 배열은 그대로 둡니다. 호출 전후 배열과 같은 ID를 다시 넣은 결과를 비교합니다.',
      '배열을 순회할 때 유효한 인덱스가 0부터 length - 1까지임을 확인합니다. 빈 배열과 세 항목 배열로 종료 조건을 점검합니다.',
      '평균과 완료 목록을 하나의 요약으로 묶어 정상·빈 입력, 중복 ID, 배열 경계 사례를 함께 검토합니다. 이 단계에서 기능 계약을 다시 확인합니다.',
    ];
    const examples = [
      'function isValidScore(score) { return Number.isFinite(score) && score >= 0 && score <= 100; }\nfunction average(scores) { if (scores.length === 0) return 0; return scores.reduce((sum, score) => sum + score, 0) / scores.length; }\nconst scores = [60, 80, 100];\nconsole.log(scores.every(isValidScore), average(scores)); // true 80',
      'function average(scores) { if (scores.length === 0) return 0; return scores.reduce((sum, score) => sum + score, 0) / scores.length; }\nconsole.log(average([]), average([60, 80, 100])); // 0 80',
      'function addCompletion(completed, lessonId) { return completed.includes(lessonId) ? completed : [...completed, lessonId]; }\nconst completed = ["js"];\nconst next = addCompletion(completed, "react");\nconst duplicate = addCompletion(next, "react");\nconsole.log(completed.join(","), next.join(","), duplicate === next); // js js,react true',
      'function total(scores) { let sum = 0; for (let index = 0; index < scores.length; index += 1) sum += scores[index]; return sum; }\nconsole.log(total([60, 80, 100]), total([])); // 240 0',
      'function isValidScore(score) { return Number.isFinite(score) && score >= 0 && score <= 100; }\nfunction average(scores) { if (!Array.isArray(scores)) throw new TypeError("scores must be an array"); if (scores.length === 0) return 0; if (!scores.every(isValidScore)) throw new RangeError("scores must be finite numbers from 0 to 100"); return scores.reduce((sum, score) => sum + score, 0) / scores.length; }\nfunction addCompletion(completed, lessonId) { return completed.includes(lessonId) ? completed : [...completed, lessonId]; }\nfunction summarize(progress) { return { average: average(progress.scores), completed: [...new Set(progress.completed)] }; }\nconst progress = { scores: [80, 100], completed: ["js", "react", "js"] };\nlet invalidScoreRejected = false;\ntry { average([NaN]); } catch (error) { invalidScoreRejected = error instanceof RangeError; }\nconsole.log(JSON.stringify(summarize(progress)), invalidScoreRejected); // {"average":90,"completed":["js","react"]} true',
    ];
    return sessions.map((exercises, index) => studySession(index + 1, `${index + 1}일차 · ${titles[index]}`, goals[index], intros[index], examples[index], exercises));
  }

  return [1, 2, 3, 4, 5].map((day) => {
    const all = sessionExercises(week, day);
    const needed = 3 - legacyExerciseDaysForWeek(week).filter((legacyDay) => legacyDay === day).length;
    const dayKey = String(week) + '-' + day;
    const dailyCase = focusedFoundationDailyCases[dayKey] ?? foundationDailyCases[dayKey] ?? advancedDailyCases[dayKey];
    const dailyTitle = dailyCase?.[0] ?? legacyDayTitles[week - 1][day - 1];
    const sessionNote = focusedFoundationSessionNotes[dayKey];
    const repairVariant = foundationRepairVariants[dayKey] ?? foundationAdvancedRepairVariants[dayKey];
    const example = completeFoundationExamples[week]?.[day - 1] ?? dailyCase?.[4] ?? repairVariant?.[1] ?? progressiveExamples(week, subject)[day - 1];
    const objective = sessionNote?.objective ?? (dailyCase || repairVariant
      ? `${dailyTitle}의 입력, 결과, 실패 경계를 코드로 확인하고 적용합니다.`
      : `${subject[0]}: ${['핵심 규칙과 선택 근거를 설명합니다.', '대표 입력을 코드에 넣어 반환값을 단계별로 계산합니다.', '실패 조건과 잘못된 결과를 만드는 줄을 찾습니다.', '함수 구조를 유지하며 요구사항을 구현합니다.', '빈 값과 경계 입력에서 동작을 검증합니다.'][day - 1]}`);
    const intro = sessionNote?.intro ?? `${subject[1]} ${dailyTitle}과 관련한 기존 문제를 푼 뒤 오늘의 추가 문제에서 근거를 확장합니다.`;
    const dailyExercises = week === 9 && day === 4
      ? all.slice(1, 1 + needed)
      : all.slice(0, needed);
    return studySession(day, `${day}일차 · ${dailyTitle}`, objective, intro, example, dailyExercises);
  });
}

const newLessons = courseWeeks.slice(12).map((subject, offset) => {
  const week = offset + 13;
  const reviewed = reviewedJavaScriptWeeks[week];
  return weeklyLesson({
    id: `js-week-${week}`,
    topicId: phaseForWeek(week),
    week,
    title: `${week}주차 · ${subject[0]}`,
    objective: reviewed?.objective ?? subject[1],
    intro: reviewed?.intro ?? `${subject[1]} 이 주에는 매일 한 가지 판단을 코드와 연결하고, 금요일에는 수정 문제로 정리합니다.`,
    points: reviewed?.points ?? [subject[3], '문법만 외우지 말고 입력·출력·실패 경로를 함께 확인합니다.', '답을 고른 근거를 예제 코드의 한 줄과 연결해 설명합니다.'],
    example: reviewed?.overviewExample ?? subject[2],
    sessions: weeklySessions(week, subject),
    difficulty: week <= 16 ? '중급' : week <= 21 ? '고급' : '실전',
  });
});

for (const lesson of newLessons) {
  for (const session of lesson.sessions) {
    const alternatives = javascriptRepairAlternativeBodies[`${lesson.week}-${session.number}`];
    if (!alternatives?.length) continue;
    for (const exercise of session.exercises.filter((item) => item.type === 'repair-code')) {
      const match = /^\s*(?:async\s+)?function\*?\s+([A-Za-z_$][\w$]*)\s*\(/.exec(exercise.starterCode ?? '');
      if (!match) throw new Error(`Missing function declaration for ${exercise.id}`);
      exercise.solutionPatterns.push(...alternatives.map((body) => exactFunctionRepairPattern(match[1], exercise.starterCode, body)));
    }
  }
}

const javascriptClassRepairAlternativePatterns = new Map([
  ['js-w17-d4-repair-v2', [
    String.raw`^\s*class\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*return\s+"기초"\s*;?\s*\}\s*\}\s*class\s+ProCourse\s+extends\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*return\s+\x60\$\{\s*super\.label\(\)\s*\}\s*· 심화\x60\s*;?\s*\}\s*\}\s*$`,
    String.raw`^\s*class\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*return\s+"기초"\s*;?\s*\}\s*\}\s*class\s+ProCourse\s+extends\s+Course\s*\{\s*label\s*\(\s*\)\s*\{\s*const\s+base\s*=\s*super\.label\(\)\s*;\s*return\s+base\s*\+\s*" · 심화"\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w17-d5-repair-v2', [
    String.raw`^\s*class\s+Store\s*\{\s*save\s*\(\s*value\s*\)\s*\{\s*return\s+Boolean\(value\)\s*;?\s*\}\s*\}\s*class\s+MemoryStore\s+extends\s+Store\s*\{\s*save\s*\(\s*value\s*\)\s*\{\s*return\s+(?:Boolean\(value\)|!!\s*value|value\s*\?\s*true\s*:\s*false)\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w18-d4-repair-v2', [
    String.raw`^\s*function\s+ownKeys\s*\(\s*item\s*\)\s*\{\s*const\s+keys\s*=\s*\[\s*\]\s*;\s*for\s*\(\s*const\s+key\s+in\s+item\s*\)\s*\{\s*if\s*\(\s*Object\.hasOwn\(item\s*,\s*key\s*\)\s*\)\s*\{\s*keys\.push\(key\)\s*;?\s*\}\s*\}\s*return\s+keys\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+ownKeys\s*\(\s*item\s*\)\s*\{\s*const\s+keys\s*=\s*\[\s*\]\s*;\s*for\s*\(\s*const\s+key\s+in\s+item\s*\)\s*\{\s*if\s*\(!\s*Object\.hasOwn\(item\s*,\s*key\s*\)\s*\)\s*continue\s*;\s*keys\.push\(key\)\s*;?\s*\}\s*return\s+keys\s*;?\s*\}\s*$`,
  ]],
  ['js-w18-d5-repair-v2', [
    String.raw`^\s*function\s+canUpdate\s*\(\s*fields\s*,\s*key\s*\)\s*\{\s*return\s+fields\.has\(key\)\s*===\s*true\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+canUpdate\s*\(\s*fields\s*,\s*key\s*\)\s*\{\s*if\s*\(\s*fields\.has\(key\)\s*\)\s*return\s+true\s*;\s*return\s+false\s*;?\s*\}\s*$`,
  ]],
]);

for (const lesson of newLessons) {
  for (const session of lesson.sessions) {
    for (const exercise of session.exercises) {
      const alternatives = javascriptClassRepairAlternativePatterns.get(exercise.id);
      if (alternatives) exercise.solutionPatterns.push(...alternatives);
    }
  }
}

const javascriptTestingAndPerformanceAlternativePatterns = new Map([
  ['js-w19-d4-repair-v2', [
    String.raw`^\s*async\s+function\s+verifyLoad\s*\(\s*load\s*\)\s*\{\s*return\s+await\s+load\(\)\s*===\s*"ready"\s*;?\s*\}\s*$`,
  ]],
  ['js-w19-d5-repair-v2', [
    String.raw`^\s*function\s+coversEmptyInput\s*\(\s*cases\s*\)\s*\{\s*return\s+cases\.some\(\(\s*\{\s*input\s*\}\s*\)\s*=>\s*input\.length\s*===\s*0\s*\)\s*;?\s*\}\s*$`,
  ]],
  ['js-w20-d4-repair-v2', [
    String.raw`^\s*function\s+parseSettings\s*\(\s*text\s*\)\s*\{\s*try\s*\{\s*return\s+JSON\.parse\(\s*text\s*\)\s*;?\s*\}\s*catch\s*\(\s*error\s*\)\s*\{\s*throw\s+error\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w20-d5-repair-v2', [
    String.raw`^\s*function\s+failureContext\s*\(\s*error\s*,\s*operation\s*\)\s*\{\s*const\s+name\s*=\s*error\.name\s*;\s*return\s*\{\s*name\s*,\s*operation\s*\}\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+failureContext\s*\(\s*error\s*,\s*operation\s*\)\s*\{\s*return\s*\{\s*name\s*:\s*error\.name\s*,\s*operation\s*:\s*operation\s*\}\s*;?\s*\}\s*$`,
  ]],
  ['js-w21-d4-repair-v2', [
    String.raw`^\s*function\s+mean\s*\(\s*samples\s*\)\s*\{\s*if\s*\(\s*samples\.length\s*===\s*0\s*\)\s*return\s+0\s*;?\s*let\s+total\s*=\s*0\s*;?\s*for\s*\(\s*let\s+index\s*=\s*0\s*;\s*index\s*<\s*samples\.length\s*;\s*index\s*\+=\s*1\s*\)\s*total\s*\+=\s*samples\[index\]\s*;?\s*return\s+total\s*\/\s*samples\.length\s*;?\s*\}\s*$`,
  ]],
  ['js-w21-d5-repair-v2', [
    String.raw`^\s*function\s+visibleItems\s*\(\s*items\s*,\s*start\s*,\s*count\s*\)\s*\{\s*const\s+begin\s*=\s*Math\.max\(start\s*,\s*0\s*\)\s*;\s*const\s+size\s*=\s*Math\.max\(count\s*,\s*0\s*\)\s*;\s*return\s+items\.slice\(\s*begin\s*,\s*begin\s*\+\s*size\s*\)\s*;?\s*\}\s*$`,
  ]],
]);

for (const lesson of newLessons) {
  for (const session of lesson.sessions) {
    for (const exercise of session.exercises) {
      const alternatives = javascriptTestingAndPerformanceAlternativePatterns.get(exercise.id);
      if (alternatives) exercise.solutionPatterns.push(...alternatives);
    }
  }
}

export const javascriptCourseExpansion = {
  phases: phaseDefinitions.map(([id, title, startWeek, endWeek, objective]) => ({ id, title, startWeek, endWeek, objective })),
  lessonOrder: [...legacyWeekIds, ...newLessons.map((lesson) => lesson.id)],
  existingWeeks: Object.fromEntries(legacyWeekIds.map((lessonId, index) => {
    const week = index + 1;
    return [lessonId, {
      week,
      phaseId: phaseForWeek(week),
      legacyExerciseDays: legacyExerciseDaysForWeek(week),
      sessions: legacyAdditions(week, courseWeeks[index]),
    }];
  })),
  lessons: newLessons,
  reviewedWeeks: Array.from({ length: 26 }, (_, index) => index + 1),
};
