import { choice, locateError, outputTrace, repairCode, studySession } from './curriculum-tools.js';
import { reviewedPythonWeeks7to9 } from './curriculum-expansion-python-w7-9-reviewed.js';
import { reviewedPythonWeeks10to12 } from './curriculum-expansion-python-w10-12-reviewed.js';

const reviewedChoice = (id, title, prompt, correct, wrong, hint, explanation) => choice(
  id,
  title,
  prompt,
  [
    [correct, explanation],
    ...wrong.map(([text, feedback]) => [text, feedback]),
  ],
  0,
  hint,
  explanation,
);

const reviewedTrace = (id, title, question, code, answers, hint, explanation) => outputTrace(
  id,
  title,
  `${question}\n\n${code}`,
  answers,
  hint,
  explanation,
);

const repairPatterns = {
  parseInteger: [
    String.raw`^def\s+parse_integer\s*\(\s*raw\s*\)\s*:\s*\n[ \t]+return\s+int\s*\(\s*raw\s*\)\s*$`,
    String.raw`^def\s+parse_integer\s*\(\s*raw\s*\)\s*:\s*\n[ \t]+value\s*=\s*int\s*\(\s*raw\s*\)\s*\n[ \t]+return\s+value\s*$`,
  ],
  hasTitle: [
    String.raw`^def\s+has_title\s*\(\s*title\s*\)\s*:\s*\n[ \t]+return\s+bool\s*\(\s*title\s+and\s+title\.strip\s*\(\s*\)\s*\)\s*$`,
    String.raw`^def\s+has_title\s*\(\s*title\s*\)\s*:\s*\n[ \t]+if\s+title\s+is\s+None\s*:\s*\n[ \t]+return\s+False\s*\n[ \t]+return\s+bool\s*\(\s*title\.strip\s*\(\s*\)\s*\)\s*$`,
  ],
  evenValues: [
    String.raw`^def\s+even_values\s*\(\s*values\s*\)\s*:\s*\n[ \t]+return\s+\[\s*value\s+for\s+value\s+in\s+values\s+if\s+value\s*%\s*2\s*==\s*0\s*\]\s*$`,
    String.raw`^def\s+even_values\s*\(\s*values\s*\)\s*:\s*\n[ \t]+result\s*=\s*\[\s*\]\s*\n[ \t]+for\s+value\s+in\s+values\s*:\s*\n[ \t]+if\s+value\s*%\s*2\s*==\s*0\s*:\s*\n[ \t]+result\.append\s*\(\s*value\s*\)\s*\n[ \t]+return\s+result\s*$`,
  ],
};

function reviewedRepair({ id, name, starterCode, prompt, patterns, requirements, constraints, examples, tests, hint, explanation }) {
  return repairCode({
    id,
    title: `${name} 함수 수정`,
    prompt: `${prompt}\n\n\`${starterCode}\``,
    language: 'Python',
    starterCode,
    solutionPatterns: patterns,
    acceptanceCriteria: { requirements, constraints, examples, tests },
    gradingNote: '실행 결과를 채점하는 문항은 아닙니다. 고정된 전체 함수 형태를 검사하므로, 아래 입력·기대 결과로 답을 직접 실행해 확인하세요. 제시한 두 풀이 형태는 허용하고 일부 코드만 붙인 답은 정답 처리하지 않습니다.',
    hint,
    explanation,
  });
}

const parseIntegerRepair = reviewedRepair({
  id: 'py-w01-d5-repair-v2',
  name: '입력값을 정수로 바꾸기',
  starterCode: 'def parse_integer(raw):\n    return raw',
  prompt: 'raw에는 정수로 바꿀 수 있는 문자열이 들어옵니다. 그 문자열을 정수로 변환해 반환하세요. 숫자가 아닌 문자열의 ValueError는 여기서 숨기지 않습니다.',
  patterns: repairPatterns.parseInteger,
  requirements: ['문자열을 `int`로 변환해요.', '변환한 정수를 반환해요.'],
  constraints: ['화면에 출력하지 않고 값을 반환해요.', '숫자가 아닌 입력 오류를 조용히 기본값으로 바꾸지 않아요.'],
  examples: [{ input: '"17"', output: '17' }, { input: '"0"', output: '0' }],
  tests: [{ input: '"-2"', expected: '-2' }, { input: '"ten"', expected: 'ValueError가 발생함' }],
  hint: '`int(raw)`의 반환값을 확인하고, 그 값을 호출한 쪽에 돌려주세요.',
  explanation: '`int(raw)`가 숫자 문자열을 정수로 바꿔 돌려줍니다. 숫자가 아닌 문자열에서는 `ValueError`가 발생하므로 여기서 조용히 감추지 않습니다.',
});

const hasTitleRepair = reviewedRepair({
  id: 'py-w02-d5-repair',
  name: '가드 절로 입력 먼저 거르기',
  starterCode: 'def has_title(title):\n    return True',
  prompt: '입력은 문자열 또는 None입니다. None이거나 공백뿐인 제목은 False, 공백을 제외하고 문자가 하나라도 있는 제목은 True를 반환하세요.',
  patterns: repairPatterns.hasTitle,
  requirements: ['문자열 또는 None을 입력으로 받아요.', 'None이면 False를 반환해요.', '문자열은 양끝 공백을 제거한 뒤 비었는지 판정해요.'],
  constraints: ['문자열을 화면에 출력하지 않고 Boolean을 반환해요.', 'None에 `strip()`을 호출해 AttributeError를 내지 않아요.'],
  examples: [{ input: 'None', output: 'False' }, { input: '"  Python  "', output: 'True' }],
  tests: [{ input: '"   "', expected: 'False' }, { input: '"x"', expected: 'True' }],
  hint: 'None 검사를 먼저 하거나, None과 빈 문자열을 안전하게 거짓으로 거른 다음 `strip()` 결과를 판정하세요.',
  explanation: '가드 순서는 중요합니다. None에 바로 `strip()`을 호출하면 실패하므로 None을 먼저 거른 뒤 공백 제거 결과의 참거짓을 Boolean으로 반환합니다.',
});

const evenValuesRepair = reviewedRepair({
  id: 'py-w03-d5-repair',
  name: '조건으로 새 목록 만들기',
  starterCode: 'def even_values(values):\n    return values',
  prompt: '입력 목록에서 짝수만 담은 새 목록을 반환하세요. 대괄호 안에 for와 if를 쓰는 목록 생성식이나, 같은 동작을 하는 빈 목록·for문 풀이를 사용할 수 있습니다.',
  patterns: repairPatterns.evenValues,
  requirements: ['짝수 원소만 포함해요.', '새 목록을 반환해요.', '입력 순서를 유지해요.'],
  constraints: ['입력 목록을 제자리에서 바꾸지 않아요.', '출력만 하고 반환을 생략하지 않아요.'],
  examples: [{ input: '[1, 2, 3, 4]', output: '[2, 4]' }],
  tests: [{ input: '[]', expected: '[]' }, { input: '[-3, -2, 0]', expected: '[-2, 0]' }],
  hint: '새 결과 목록을 만들고, `value % 2 == 0`인 원소만 담으세요.',
  explanation: '목록 생성식은 조건을 통과한 원소만 새 목록에 담습니다. 같은 조건을 빈 목록과 for문으로 표현해도 요구 결과는 같습니다.',
});

const foundations = {
  1: {
    objective: '변수의 새 값이 어떻게 만들어지는지 읽고, 숫자 문자열과 숫자의 차이를 설명해요.',
    intro: '첫 주는 값의 자료형을 확인하고 변수에 새 값을 대입하는 연습부터 시작합니다. 코드 한 줄씩 실행해 본 뒤 같은 규칙을 다른 값에 적용해 보세요.',
    points: ['대입문의 오른쪽을 먼저 계산한 뒤 왼쪽 이름에 결과를 저장해요.', '따옴표 안의 숫자는 문자열이며 숫자 연산 전에 명시적으로 변환해야 해요.', '`//`는 나눈 값보다 크지 않은 정수 쪽으로 내리고 `%`는 나머지를 구해요.', '수정 문항은 실행 채점이 아니라 고정된 함수 형태를 검사해요.'],
    example: 'count = 4\ncount += 1\nprint(count)  # 5',
    sessions: [
      studySession(1, '대입과 재대입', '기존 값으로 새 값을 계산해 같은 변수에 저장합니다.', '대입은 오른쪽 계산 결과를 변수 이름에 연결합니다. `+=`도 값을 읽고 계산한 뒤 다시 저장하는 대입입니다.', 'count = 4\ncount += 1\nprint(count)', [
        reviewedChoice('py-w01-d1-choice-v2', '재대입의 순서', 'count가 4일 때 `count += 1` 다음 줄에서 어떤 값이 저장되어 있나요?', '`count`에는 5가 저장된다.', [['`count`는 계속 4다.', '덧셈 결과를 다시 대입하므로 기존 값은 5로 갱신됩니다.'], ['`count`에는 1이 저장된다.', '`+=`는 오른쪽 값만 저장하는 문장이 아니라 기존 값에 더한 결과를 저장합니다.']], '기존 count를 읽고 1을 더한 뒤, 계산 결과가 다시 어디에 저장되는지 보세요.', '`count += 1`은 `count = count + 1`과 같은 누적 대입입니다.'),
        reviewedTrace('py-w01-d1-trace-v2', '재대입 결과 추적', '아래 코드의 출력값을 입력하세요.', 'count = 4\ncount += 1\nprint(count)', ['5'], '대입 전 값 4와 더할 값 1을 계산하세요.', '4에 1을 더한 결과 5가 다시 count에 저장되고 출력됩니다.'),
      ]),
      studySession(2, '문자열 값과 자료형', '따옴표가 있는 숫자와 정수를 구분하고 문자열 연결 결과를 설명합니다.', '따옴표는 값의 자료형을 바꿉니다. 숫자처럼 보이는 문자열 두 개를 더할 때 숫자 덧셈을 기대하지 않도록 실제 자료형을 함께 확인합니다.', 'raw = "3"\njoined = raw + "4"\nprint(joined, type(joined).__name__)', [
        reviewedChoice('py-w01-d2-choice-v2', '따옴표와 문자열 연결', '다음 코드가 출력하는 값과 자료형을 함께 고르세요.', '`34 str`', [['`7 int`', '두 피연산자가 모두 문자열이므로 숫자 덧셈이 아닙니다.'], ['TypeError', '두 문자열의 `+`는 오류가 아니라 이어 붙이기입니다.']], '따옴표가 붙은 두 값의 자료형을 확인하세요.', '문자열 "3"과 "4"를 `+`로 연결한 값은 "34"이고 자료형 이름은 `str`입니다.'),
        reviewedTrace('py-w01-d2-trace-v2', '문자열 연결 추적', '아래 코드의 전체 출력을 입력하세요.', 'raw = "3"\njoined = raw + "4"\nprint(joined, type(joined).__name__)', ['34 str'], '문자열 두 값을 연결한 다음 type 이름을 읽으세요.', 'print의 인자 두 개가 공백 하나로 구분되어 `34 str`이 출력됩니다.'),
      ]),
      studySession(3, '정수 몫과 나머지', '일반 나눗셈·내림한 몫·나머지가 각각 어떤 값을 만드는지 구분합니다.', '`/`는 나눗셈 결과를 실수로 돌려줍니다. `//`는 나눈 값보다 크지 않은 쪽 정수로 내리고, `%`는 그때의 나머지를 구합니다. 음수를 나눌 때도 결과를 확인해요.', 'print(17 / 5, 17 // 5, 17 % 5)\nprint(-17 // 5, -17 % 5)', [
        reviewedChoice('py-w01-d3-choice-v2', '나눗셈 연산자 구분', '`17 / 5`, `17 // 5`, `17 % 5`의 결과를 순서대로 고르세요.', '`3.4`, `3`, `2`', [['`3`, `3`, `0`', '`/`는 정수 나눗셈에서 실수를 돌려주며 나머지는 2입니다.'], ['`3.4`, `3.4`, `5`', '`//`는 바닥 몫 3, `%`는 나머지 2를 돌려줍니다.']], '각 연산자가 실수 나눗셈, 바닥 몫, 나머지 중 무엇인지 나눠 보세요.', '17을 5로 나누면 3.4이고, 바닥 몫은 3이며, 나머지는 2입니다.'),
        reviewedTrace('py-w01-d3-trace-v2', '나눗셈 결과 추적', '아래 코드가 출력하는 두 줄의 값을 차례대로 입력하세요.', 'print(17 / 5, 17 // 5, 17 % 5)\nprint(-17 // 5, -17 % 5)', ['3.4 3 2\n-4 3'], '첫 줄은 양수, 둘째 줄은 음수 나눗셈 결과를 확인하세요.', '양수 계산은 `3.4 3 2`입니다. 음수의 `-17 // 5`는 0 쪽이 아니라 아래쪽 정수 `-4`로 내리고, 나머지는 `3`입니다.'),
      ]),
      studySession(4, '문자열에 변수 값 넣기 (f-string)', 'f-string의 중괄호 안 표현식이 실행되어 문자열에 들어가는 것을 확인합니다.', 'f-string은 문자열 앞에 `f`를 붙이고, 중괄호 안에 값을 넣어 만듭니다. 일반 문자열의 `{name}`은 자동으로 바뀌지 않으므로 두 형태를 구별합니다.', 'name = "Mina"\nminutes = 40\nprint(f"{name}: {minutes}분")', [
        reviewedChoice('py-w01-d4-choice-v2', 'f-string 표현식', '다음 코드의 출력으로 맞는 것은 무엇인가요?', '`Mina: 40분`', [['`{name}: {minutes}분`', '문자열 앞의 f가 중괄호 안 표현식을 평가해 값을 삽입합니다.'], ['`Mina: 40`', '문자열 끝의 분도 f-string 내용이라 그대로 출력됩니다.']], '문자열 앞의 f와 중괄호 안의 변수 두 개를 살펴보세요.', '각 중괄호에 name과 minutes의 값이 들어가 `Mina: 40분`이 됩니다.'),
        reviewedTrace('py-w01-d4-trace-v2', 'f-string 출력 추적', '아래 코드가 출력하는 문자열을 입력하세요.', 'name = "Mina"\nminutes = 40\nprint(f"{name}: {minutes}분")', ['Mina: 40분'], '변수 값을 중괄호 자리에 넣으세요.', 'name은 Mina, minutes는 40이므로 `Mina: 40분`을 출력합니다.'),
        locateError('py-w01-d4-locate-v2', '문자열 보간 오류 찾기', '이름을 메시지에 삽입하려는데 그대로 `{name}`이 보입니다. 실제 원인이 있는 줄을 고르세요.', 'Python', ['name = "Mina"', 'message = "이름: {name}"', 'print(message)'], [2], '2번 줄은 앞에 f가 없는 일반 문자열입니다.', '2번 줄의 일반 문자열은 중괄호를 치환하지 않습니다. `message = f"이름: {name}"`으로 고치세요.'),
      ]),
      studySession(5, '입력값을 정수로 바꾸기', '숫자 문자열을 int로 바꾸고 변환 오류를 숨기지 않습니다.', '텍스트 입력은 문자열로 들어옵니다. 계산 전에 `int()`로 바꾸며, 숫자가 아닌 입력에서 생기는 `ValueError`는 실제 호출자가 처리 정책을 정해야 합니다.', 'raw = "27"\nage = int(raw)\nprint(age + 1)', [
        reviewedChoice('py-w01-d5-choice-v2', '명시적 정수 변환', 'raw가 문자열 `"27"`일 때 `int(raw) + 1`의 결과는 무엇인가요?', '정수 28', [['문자열 `"271"`', '덧셈 전에 int가 27을 정수로 변환합니다.'], ['오류', '숫자로 표현 가능한 문자열이므로 int 변환이 성공합니다.']], 'int 호출이 더하기보다 먼저 처리됩니다.', '`int("27")`은 정수 27이며 여기에 1을 더하면 28입니다.'),
        reviewedTrace('py-w01-d5-trace-v2', '입력 변환 결과 추적', '아래 코드의 출력값을 입력하세요.', 'raw = "27"\nage = int(raw)\nprint(age + 1)', ['28'], 'raw는 문자열이지만 age에는 변환된 정수가 들어갑니다.', '27을 정수로 바꿔 1을 더하므로 28을 출력합니다.'),
        parseIntegerRepair,
      ]),
    ],
  },
  2: {
    objective: '비교 조건을 논리 연산자로 묶고, 분기마다 실행되는 코드를 추적해요.',
    intro: '둘 이상의 경계를 한꺼번에 검사하고 if/elif/else에서 어떤 가지가 실행되는지 확인합니다. 먼저 조건을 참·거짓으로 평가한 뒤 실행 줄을 따라가세요.',
    points: ['범위의 양 끝을 모두 만족해야 할 때는 `and`를 써요.', '`if`와 `else`는 같은 들여쓰기 깊이에 두고 각 본문을 안쪽에 작성해요.', '`if`/`elif` 사슬은 위에서 처음 참이 된 가지 하나만 실행해요.', '빈 문자열과 빈 목록은 조건식에서 거짓으로 평가돼요.'],
    example: 'age = 20\nprint(age >= 18 and age < 65)  # True',
    sessions: [
      studySession(1, 'AND로 조건 범위 확인', '18 이상이고 65 미만일 때만 참이 되는 조건을 만듭니다.', '범위 조건에는 아래쪽 경계와 위쪽 경계가 모두 있습니다. 둘 다 만족해야 하는 조건을 `and`로 연결하고 경계값을 확인합니다.', 'age = 20\nprint(age >= 18 and age < 65)', [
        reviewedChoice('py-w02-d1-choice-v2', '두 경계를 모두 검사하기', '18 이상, 65 미만인 경우만 참이어야 합니다. age 값에 적용할 조건은 무엇인가요?', '`age >= 18 and age < 65`', [['`age >= 18 or age < 65`', 'or는 한 조건만 참이어도 통과하므로 범위 밖 값도 통과합니다.'], ['`age > 18 and age <= 65`', '이 식은 18과 65 경계를 포함하는 방식이 요구와 다릅니다.']], '두 경계 비교가 모두 참이어야 하므로 and를 사용하고 포함 여부도 확인하세요.', '18은 포함하고 65는 제외해야 하므로 `>= 18`과 `< 65`를 and로 연결합니다.'),
        reviewedTrace('py-w02-d1-trace-v2', '범위 조건 추적', 'age가 20일 때 아래 코드의 출력값을 입력하세요.', 'age = 20\nprint(age >= 18 and age < 65)', ['True'], '20은 18 이상인지, 65 미만인지 각각 검사하세요.', '두 비교가 모두 참이므로 and 전체 결과는 True입니다.'),
      ]),
      studySession(2, 'if·else 들여쓰기', '조건이 거짓일 때 else 가지로 이동하고 두 가지의 들여쓰기 구조를 읽습니다.', 'Python은 들여쓰기로 블록을 구분합니다. if와 else는 같은 깊이로 놓고, 각각의 본문은 그보다 한 단계 들여씁니다.', 'has_ticket = False\nif has_ticket:\n    print("입장")\nelse:\n    print("입장 대기")', [
        reviewedChoice('py-w02-d2-choice-v2', 'else가 연결되는 위치', 'if의 조건이 False일 때 else 본문이 실행되도록 하는 구조는 무엇인가요?', 'if와 else를 같은 들여쓰기 깊이에 두고 두 본문을 한 단계 들여쓴다.', [['else를 if 본문과 같은 들여쓰기로 넣는다.', '그렇게 하면 else가 if 블록 안에 잘못 놓여 문법 오류가 납니다.'], ['if 본문만 들여쓰고 else 본문은 왼쪽 끝에 둔다.', 'else 본문도 해당 분기의 코드이므로 한 단계 들여써야 합니다.']], '분기 표지(if/else)와 각 분기 본문의 깊이를 따로 비교하세요.', 'if와 else는 같은 수준의 분기이며, 각 print 문은 분기 안쪽에 있어야 합니다.'),
        reviewedTrace('py-w02-d2-trace-v2', 'else 분기 추적', 'has_ticket이 False일 때 출력되는 문구를 입력하세요.', 'has_ticket = False\nif has_ticket:\n    print("입장")\nelse:\n    print("입장 대기")', ['입장 대기'], '조건이 거짓일 때 어떤 분기가 선택되는지 보세요.', '조건이 False이므로 else 본문만 실행되어 입장 대기를 출력합니다.'),
      ]),
      studySession(3, 'if·elif·else 분기', '위에서 처음 참인 분기 하나를 선택하고 나머지 경우를 처리합니다.', 'if/elif/else 사슬은 순서대로 조건을 확인합니다. 앞 분기에서 이미 선택되면 뒤의 elif와 else는 실행하지 않습니다.', 'score = 72\nif score >= 80:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)', [
        reviewedChoice('py-w02-d3-choice-v2', '분기 하나 선택하기', 'score가 72일 때 어떤 분기가 실행되나요?', '`score >= 60`인 elif 분기', [['A와 B 분기가 모두 실행된다.', 'if/elif 사슬에서는 처음 참인 분기 하나만 실행합니다.'], ['else 분기가 실행된다.', '앞의 elif 조건이 참이므로 else까지 내려가지 않습니다.']], '80 이상은 아니지만 60 이상인지 이어서 검사하세요.', '첫 조건 72 >= 80은 거짓이고 둘째 72 >= 60은 참이므로 B가 선택됩니다.'),
        reviewedTrace('py-w02-d3-trace-v2', '성적 분기 결과', 'score가 72일 때 전체 코드의 출력값을 입력하세요.', 'score = 72\nif score >= 80:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)', ['B'], '각 비교식을 위에서부터 차례대로 평가하세요.', '첫 조건은 거짓이고 둘째가 참이라 grade에 B가 저장되어 출력됩니다.'),
      ]),
      studySession(4, '빈 값의 참거짓', '빈 문자열과 빈 목록이 조건식에서 거짓으로 평가되는 규칙을 확인합니다.', '빈 문자열·목록은 `bool()`에서 False입니다. 컬렉션에 값이 있는지 보는 일상적인 조건에서는 `is True` 대신 컬렉션 자체를 조건에 두는 방법도 알아봅니다.', 'items = []\nprint(bool(items))', [
        reviewedChoice('py-w02-d4-choice-v2', '빈 목록의 Boolean 값', '`items = []`일 때 `bool(items)`의 결과는 무엇인가요?', 'False', [['True', '빈 목록은 원소가 없으므로 거짓으로 평가됩니다.'], ['0', '`bool()`은 Boolean 값을 돌려주며 길이를 반환하지 않습니다.']], '목록에 원소가 있는지 살펴보세요.', '빈 목록은 거짓으로 평가되므로 `bool(items)`는 `False`를 반환합니다.'),
        reviewedTrace('py-w02-d4-trace-v2', '빈 컬렉션 추적', '아래 코드가 출력하는 값을 입력하세요.', 'items = []\nprint(bool(items))', ['False'], '비어 있는 list의 참거짓을 확인하세요.', '원소가 없는 목록은 False로 평가되어 그 값이 출력됩니다.'),
        locateError('py-w02-d4-locate-v2', '목록의 참거짓 검사 찾기', '목록이 비어 있지 않을 때만 본문을 실행하려 합니다. 조건이 의도와 맞지 않는 줄을 고르세요.', 'Python', ['items = ["Python"]', 'if items is True:', '    print("has item")'], [2], '`items`에는 값이 있으니 목록 자체의 참거짓을 검사해야 합니다.', '2번 줄은 목록이 True와 같은 객체인지 검사합니다. 비어 있지 않은 목록은 참이지만 True 객체와 같지는 않으므로 본문을 실행하지 않습니다. `if items:`를 쓰세요.'),
      ]),
      studySession(5, '가드 절로 입력 먼저 거르기', '유효하지 않은 값과 공백만 있는 제목을 본 처리보다 먼저 분리합니다.', '가드 절은 처리할 수 없는 입력을 먼저 반환해 뒤쪽 코드를 단순하게 만듭니다. None인지 먼저 확인하고, 그 다음 공백을 정리합니다.', 'def display_title(title):\n    if title is None:\n        return "제목 없음"\n    clean = title.strip()\n    if not clean:\n        return "제목 없음"\n    return clean\n\nprint(display_title("  Python  "))', [
        reviewedChoice('py-w02-d5-choice-v2', '가드 순서', '`title`이 None일 수도 있을 때 안전한 첫 검사는 무엇인가요?', '`title is None`인지 먼저 확인하고 종료한다.', [['None인지 확인하기 전에 `title.strip()`을 호출한다.', 'None에는 strip 메서드가 없어 AttributeError가 발생할 수 있습니다.'], ['모든 오류를 except로 감춰 빈 제목을 반환한다.', '예외를 숨기기보다 입력 조건을 직접 검사해 계약을 분명히 해야 합니다.']], 'None에 문자열 메서드를 호출할 수 있는지 생각해 보세요.', 'None을 먼저 처리한 뒤 문자열 공백을 검사하면 None에서 메서드 오류가 나지 않습니다.'),
        reviewedTrace('py-w02-d5-trace-v2', '가드 이후 결과 추적', '입력이 `"  Python  "`일 때 출력되는 제목을 입력하세요.', 'def display_title(title):\n    if title is None:\n        return "제목 없음"\n    clean = title.strip()\n    if not clean:\n        return "제목 없음"\n    return clean\n\nprint(display_title("  Python  "))', ['Python'], '양끝 공백을 제거한 clean 값을 보세요.', 'None이 아니고 공백 제거 뒤 내용이 있으므로 `Python`을 반환하고 출력합니다.'),
        hasTitleRepair,
      ]),
    ],
  },
  3: {
    objective: '목록의 모든 원소를 순회하고 반복 경계와 누적값을 확인해요.',
    intro: '반복은 시작과 끝 경계, 방문하는 원소, 누적 규칙을 함께 확인해야 합니다. 목록 전체를 빠뜨리지 않고 처리한 뒤 반복 변수와 합계를 직접 추적합니다.',
    points: ['`for value in values`는 iterable의 원소를 차례대로 꺼내요.', '`range(start, stop)`은 start는 포함하고 stop은 포함하지 않아요.', '누적 변수는 반복 전에 초기화하고 매번 현재 값만큼 갱신해요.', 'while 반복은 조건을 바꾸는 경로와 종료 가능성을 같이 확인해요.'],
    example: 'values = [2, 3, 4]\ntotal = 0\nfor value in values:\n    total += value\nprint(total)  # 9',
    sessions: [
      studySession(1, '리스트 전체를 순회하기', '목록의 첫 원소부터 마지막 원소까지 방문해 누락 없이 합산합니다.', '목록 조각을 순회하면 처음 값이 빠질 수 있습니다. 전체 목록을 그대로 순회하고 누적값을 한 단계씩 계산합니다.', 'values = [2, 3, 4]\ntotal = 0\nfor value in values:\n    total += value\nprint(total)', [
        reviewedChoice('py-w03-d1-choice-v2', '전체 목록 순회', '목록의 모든 원소를 한 번씩 처리하는 반복 대상은 무엇인가요?', '`for value in values:`', [['`for value in values[1:]:`', '1번 인덱스부터 시작해 첫 원소 2가 빠집니다.'], ['`for value in range(len(values) - 1):`', '끝 경계가 제외되어 마지막 인덱스를 방문하지 못합니다.']], '반복 대상에 목록 전체가 들어 있는지, 일부 조각인지 확인하세요.', '`values`를 직접 순회하면 첫 원소부터 끝 원소까지 모두 꺼냅니다.'),
        reviewedTrace('py-w03-d1-trace-v2', '목록 누적 추적', '아래 코드의 합계를 입력하세요.', 'values = [2, 3, 4]\ntotal = 0\nfor value in values:\n    total += value\nprint(total)', ['9'], '반복 순서는 2, 3, 4이고 매번 total에 더합니다.', '0에서 시작해 2, 3, 4를 더하면 9입니다.'),
      ]),
      studySession(2, 'range의 시작과 끝 경계', 'range의 시작은 포함하고 끝은 제외하는 규칙을 코드 결과로 확인합니다.', '두 인자를 쓰는 range에서 첫 값은 나오지만 두 번째 값은 나오지 않습니다. 인덱스와 반복 횟수를 설계할 때 이 차이를 검산합니다.', 'print(list(range(2, 5)))\nprint(list(range(3)))', [
        reviewedChoice('py-w03-d2-choice-v2', 'range의 끝 제외', '`range(3)`이 만드는 값을 고르세요.', '`0, 1, 2`', [['`1, 2, 3`', '시작값을 생략한 range는 0에서 시작하고 3은 포함하지 않습니다.'], ['`0, 1, 2, 3`', 'range의 stop 인자 3은 결과에서 제외됩니다.']], '시작값 생략 시 기본 시작값과 stop 제외 규칙을 함께 떠올리세요.', '`range(3)`은 기본값 0에서 시작해 3 직전까지 순회합니다.'),
        reviewedTrace('py-w03-d2-trace-v2', '두 range 결과 읽기', '아래 코드의 두 목록을 출력 순서대로 입력하세요.', 'print(list(range(2, 5)))\nprint(list(range(3)))', ['[2, 3, 4]\n[0, 1, 2]'], '첫 줄은 2부터 5 직전, 다음 줄은 0부터 3 직전입니다.', '두 print 호출은 각각 `[2, 3, 4]`와 `[0, 1, 2]`를 별도 줄에 출력합니다.'),
      ]),
      studySession(3, 'for 반복으로 합계 누적하기', '0으로 시작한 합계에 목록의 각 값을 더해 최종 결과를 만듭니다.', '누적은 이전 합계와 현재 원소를 더해 다시 저장하는 흐름입니다. 단순 대입으로 바꾸면 이전 값이 사라지므로 `+=`가 필요한지 확인합니다.', 'total = 0\nfor value in [1, 2, 3]:\n    total += value\nprint(total)', [
        reviewedChoice('py-w03-d3-choice-v2', '누적 대입', '합계에서 현재 원소를 더하면서 이전 합계를 보존하는 문장은 무엇인가요?', '`total += value`', [['`total = value`', '이 문장은 이전 합계를 덮어쓰고 현재 원소만 남깁니다.'], ['`value += total`', '반복 변수 자체를 바꾸며 합계 변수 total을 갱신하지 않습니다.']], '현재 값만 저장하는지, 기존 합계와 더하는지 구분하세요.', '`total += value`는 매 반복에서 이전 total에 새 value를 더합니다.'),
        reviewedTrace('py-w03-d3-trace-v2', '합계 추적', '아래 코드가 출력하는 합계를 입력하세요.', 'total = 0\nfor value in [1, 2, 3]:\n    total += value\nprint(total)', ['6'], '각 반복 뒤 total은 1, 3, 6으로 바뀝니다.', '초깃값 0에 각 원소를 순서대로 더해 최종 합계 6을 출력합니다.'),
      ]),
      studySession(4, 'while 반복을 끝내기', '매 반복에서 종료 조건을 바꾸고 마지막 상태를 확인합니다.', 'while 조건이 참인 동안 본문이 반복됩니다. 반복 본문에서 count를 감소시켜 조건이 언젠가 거짓이 되도록 만들어야 합니다.', 'count = 3\nwhile count > 0:\n    count -= 1\nprint("left:", count)', [
        reviewedChoice('py-w03-d4-choice-v2', 'while 종료 조건', 'count가 3에서 시작해 while을 끝내려면 본문에서 필요한 동작은 무엇인가요?', '`count`를 1씩 줄여 0에 도달하게 한다.', [['`count`를 바꾸지 않고 조건을 다시 확인한다.', 'count가 계속 3이면 조건이 계속 참이라 반복이 끝나지 않습니다.'], ['`count`에 계속 1을 더한다.', '양수 count가 커지면 `count > 0` 조건이 계속 참입니다.']], '반복 뒤 조건 `count > 0`이 거짓이 될 수 있는지 확인하세요.', 'count를 줄이면 3, 2, 1 뒤 0이 되고 조건이 False가 되어 종료합니다.'),
        reviewedTrace('py-w03-d4-trace-v2', '반복 종료 뒤 출력', '아래 코드의 전체 출력 한 줄을 입력하세요.', 'count = 3\nwhile count > 0:\n    count -= 1\nprint("left:", count)', ['left: 0'], '반복 본문 실행 뒤 count가 0이 될 때까지 추적하세요.', 'count가 0이 되면 조건이 False이므로 반복을 빠져나와 `left: 0` 전체를 출력합니다.'),
        locateError('py-w03-d4-locate-v2', '무한 반복 위험 찾기', 'count를 0까지 줄이려는데 반복 본문에서 오히려 1을 더하고 있습니다. 원인이 되는 줄을 고르세요.', 'Python', ['count = 3', 'while count > 0:', '    count += 1'], [3], '반복할 때마다 count가 0에 가까워지는지 살펴보세요.', '3번 줄의 `count += 1`은 양수 count를 계속 키워 `count > 0`을 끝내 거짓으로 만들지 못합니다. `count -= 1`로 바꿔야 반복이 종료됩니다.'),
      ]),
      studySession(5, '조건으로 새 목록 만들기', '목록에서 짝수만 골라 원본 순서를 유지하는 새 목록을 만들어요.', '대괄호 안에 반복과 조건을 써서 새 목록을 만들 수 있어요. 이 문법을 목록 컴프리헨션이라고 불러요. 반복할 값, 결과에 담을 값, 선택 조건을 차례로 읽고 짝수가 없는 목록에서도 결과를 확인해요.', 'values = [0, 1, 2, 3, 4, 5]\neven = [value for value in values if value % 2 == 0]\nprint(even)', [
        reviewedChoice('py-w03-d5-choice-v2', '조건에 맞는 값 고르기', '`value % 2 == 0` 조건은 새 목록에 담을 값을 어떻게 정하나요?', '2로 나눈 나머지가 0인 원소만 담는다.', [['모든 원소를 담고 원본 목록만 정렬한다.', 'if 조건은 결과에 넣을 원소를 고르며, 정렬하지 않습니다.'], ['각 원소를 두 배로 바꿔 담는다.', '결과에 담는 값은 value 자체이므로 두 배로 바뀌지 않습니다.']], '조건이 참인 원소만 남기고, 각 원소를 어떤 값으로 담는지도 살펴보세요.', '2로 나눈 나머지가 0인 짝수만 원래 순서를 유지해 새 목록에 담습니다.'),
        reviewedTrace('py-w03-d5-trace-v2', '필터 목록 추적', '아래 코드가 출력하는 목록을 입력하세요.', 'values = [0, 1, 2, 3, 4, 5]\neven = [value for value in values if value % 2 == 0]\nprint(even)', ['[0, 2, 4]'], '0도 2로 나누어 나머지가 0인지 확인하세요.', '0, 2, 4만 조건을 통과하여 `[0, 2, 4]`가 됩니다.'),
        evenValuesRepair,
      ]),
    ],
  },
};

Object.assign(foundations, {
  4: {
    objective: '매개변수에 값을 전달하고 계산 결과를 반환하며, 함수 경계를 설계해요.',
    intro: '매개변수와 인수의 차이부터 시작해 기본값과 키워드 호출, 반환값, 지역 이름을 차례로 익힙니다. 함수 안에서 계산한 값이 호출한 곳으로 어떻게 전달되는지 매일 실행해 확인하세요.',
    points: ['정의의 이름은 매개변수이고 호출에서 넘기는 실제 값은 인수예요.', '`return`은 결과를 호출자에게 전달하고 `print`는 화면에 보여 줘요.', '기본값은 인수를 생략했을 때 쓰이며, 키워드 인자 뒤에는 위치 인자를 둘 수 없어요.', '함수 안에서 대입한 이름은 별도 선언 없이는 지역 이름이에요.', '수정 문항은 전체 함수 모양을 검사하는 정적 채점이며 코드를 실행해 채점하지 않아요.'],
    example: 'def add_fee(price, fee):\n    return price + fee\n\nprint(add_fee(100, 15))',
    sessions: [
      studySession(1, '매개변수와 반환값', '함수 정의의 매개변수로 값이 들어오고 return 결과가 호출자에게 전달되는 흐름을 추적해요.', '매개변수는 함수가 받을 값을 정하고, 호출할 때 전달하는 인수는 그 자리에 연결됩니다. 계산한 값은 return으로 돌려줘야 호출한 코드가 사용할 수 있어요.', 'def add_fee(price, fee):\n    return price + fee\n\nprint(add_fee(100, 15))', [
        reviewedChoice('py-w04-d1-choice-v2', '매개변수와 인수', '`add_fee(100, 15)`를 호출할 때 `price`와 `fee`에 각각 들어가는 값은 무엇인가요?', '`price`는 100, `fee`는 15예요.', [['`price`는 15, `fee`는 100이에요.', '위치 인수는 정의된 매개변수 순서대로 연결됩니다.'], ['두 이름에는 함수 반환 뒤에 값이 들어가요.', '인수는 함수가 실행되기 시작할 때 매개변수에 연결됩니다.']], '함수 정의의 괄호 안 이름 순서와 호출 괄호 안 값 순서를 맞춰 보세요.', '첫 번째 위치 인수 100은 `price`, 두 번째 15는 `fee`에 전달됩니다.'),
        reviewedTrace('py-w04-d1-trace-v2', '매개변수 전달과 결과', '아래 코드의 전체 출력을 입력하세요.', 'def add_fee(price, fee):\n    return price + fee\n\nprint(add_fee(100, 15))', ['115'], '호출 인수를 매개변수에 대입한 뒤 return 식을 계산하세요.', '`price`와 `fee`는 각각 100과 15이므로 함수는 115를 반환하고 출력합니다.'),
      ]),
      studySession(2, '기본·키워드 인자', '기본값이 사용되는 조건과 이름을 지정한 호출의 결과를 구분해요.', '기본값은 호출자가 해당 인수를 생략한 경우에만 사용됩니다. 키워드 인자는 매개변수 이름을 지정해 전달하므로 호출 순서를 읽을 때 이름과 위치를 함께 확인하세요.', 'def greet(name, prefix="안녕하세요"):\n    return f"{prefix}, {name}"\n\nprint(greet("민아"))\nprint(greet("준", prefix="환영"))', [
        reviewedChoice('py-w04-d2-choice-v2', '기본값이 선택되는 때', '`greet("민아")` 호출에서 `prefix`에 사용되는 값은 무엇인가요?', '함수 정의에 적힌 기본값 `안녕하세요`예요.', [['Python이 이름에서 임의로 만든 빈 문자열이에요.', '문자열이 자동 생성되지 않으며 선언에 둔 기본값을 사용합니다.'], ['`name`과 같은 `민아`예요.', '호출은 `name`만 전달했으므로 생략된 `prefix`에 기본값이 들어갑니다.']], '호출에서 전달한 인수와 생략한 인수를 구분하세요.', '두 번째 인수 `prefix`를 생략했으므로 정의에 선언한 `안녕하세요`가 사용됩니다.'),
        reviewedTrace('py-w04-d2-trace-v2', '기본값과 키워드 호출 출력', '아래 두 줄의 전체 출력을 순서대로 입력하세요.', 'def greet(name, prefix="안녕하세요"):\n    return f"{prefix}, {name}"\n\nprint(greet("민아"))\nprint(greet("준", prefix="환영"))', ['안녕하세요, 민아\n환영, 준'], '첫 호출은 prefix를 생략하고, 둘째 호출은 이름을 지정해 다른 값을 줍니다.', '첫 호출은 기본 인사말을, 둘째는 키워드로 전달한 환영을 사용하므로 두 줄이 차례로 출력됩니다.'),
      ]),
      studySession(3, 'return과 None', '화면 출력과 함수 반환은 서로 다르며 return을 생략하면 None이 되는 이유를 확인해요.', 'print는 값을 화면에 표시하고 반환값으로는 None을 돌려줍니다. 함수가 계산 결과를 다른 코드에 전달하려면 계산식을 return해야 해요.', 'def show(message):\n    print(message)\n\nreturned = show("저장 완료")\nprint(returned)', [
        reviewedChoice('py-w04-d3-choice-v2', '출력과 반환 구분', '`show("저장 완료")`는 문자열을 화면에 출력하지만, `show`가 명시적으로 반환하는 값은 무엇인가요?', '`None`이에요.', [['출력한 문자열 `저장 완료`예요.', '화면에 출력하는 동작만으로 문자열이 반환값이 되지는 않습니다.'], ['호출할 때마다 새로 만든 빈 문자열이에요.', 'return이 없는 함수의 기본 반환값은 빈 문자열이 아니라 None입니다.']], '호출 화면에 보인 값과 대입문에 저장된 값을 따로 추적하세요.', '함수 본문은 출력만 하고 return하지 않아 `returned`에는 None이 대입됩니다.'),
        reviewedTrace('py-w04-d3-trace-v2', 'print와 반환값 출력', '아래 코드의 전체 출력을 두 줄로 입력하세요.', 'def show(message):\n    print(message)\n\nreturned = show("저장 완료")\nprint(returned)', ['저장 완료\nNone'], '첫 출력은 함수 안의 print, 다음은 함수 호출 결과를 담은 변수입니다.', '함수 안에서 `저장 완료`를 먼저 출력하고, 명시적 return이 없으므로 다음 줄에서 None을 출력합니다.'),
      ]),
      studySession(4, '스코프와 지역 이름', '함수가 바깥 값을 읽는 것과 같은 이름에 지역 값을 대입하는 것을 구분해요.', '함수는 바깥 범위의 이름을 읽을 수 있습니다. 하지만 함수 안에서 그 이름에 대입하면 별도 선언이 없는 한 지역 이름이 되므로 바깥 값은 바뀌지 않습니다.', 'rate = 0.1\ndef add_tax(price):\n    return round(price * (1 + rate), 2)\n\ndef set_rate():\n    rate = 0.2\n\nset_rate()\nprint(add_tax(100), rate)', [
        reviewedChoice('py-w04-d4-choice-v2', '읽기와 지역 대입', '`set_rate` 안의 `rate = 0.2`는 바깥 `rate`에 어떤 영향을 주나요?', '함수 안의 지역 이름만 만들므로 바깥 값은 0.1로 남아요.', [['모든 같은 이름의 변수를 찾아 바깥 값까지 바꿔요.', '이름이 같아도 함수 안 대입은 자동으로 전역 상태를 바꾸지 않습니다.'], ['함수가 끝나면 바깥 이름도 자동으로 삭제돼요.', '지역 이름의 수명은 함수 호출 동안이며 바깥 이름은 계속 존재합니다.']], '함수 안에서 이름에 값을 대입했는지 확인하세요.', '`rate = 0.2`는 지역 이름을 새로 만듭니다. 따라서 바깥의 세율은 0.1이고 결과는 `110.0 0.1`입니다.'),
        reviewedTrace('py-w04-d4-trace-v2', '지역 이름과 바깥 값', '아래 코드의 전체 출력을 입력하세요.', 'rate = 0.1\ndef add_tax(price):\n    return round(price * (1 + rate), 2)\n\ndef set_rate():\n    rate = 0.2\n\nset_rate()\nprint(add_tax(100), rate)', ['110.0 0.1'], '함수 안 대입은 지역 범위에서만 일어납니다. add_tax는 바깥 rate를 읽어요.', '지역 `rate`는 함수 호출이 끝나면 사라지고, `add_tax`가 읽는 바깥 값은 0.1이므로 `110.0 0.1`이 출력됩니다.'),
        locateError('py-w04-d4-locate-v2', '바깥 세율이 바뀌지 않는 줄 찾기', '호출 뒤 바깥 `rate`가 0.2가 되기를 기대하는 코드입니다. 기대와 다르게 만드는 줄을 고르세요.', 'Python', ['rate = 0.1', 'def set_rate():', '    rate = 0.2', 'set_rate()', 'print(rate)'], [3], '함수 안의 대입이 지역 이름을 만드는지 추적하세요.', '3번 줄의 대입은 `set_rate`의 지역 이름만 만듭니다. 바깥 상태를 명시적으로 바꾸기보다 새 값을 반환해 호출자가 대입하도록 설계하는 편이 안전합니다.'),
      ]),
      studySession(5, '작은 함수로 책임 나누기', '하나의 계산을 독립 함수로 두고 호출자가 결과를 조합할 수 있게 해요.', '작은 함수는 입력, 계산, 반환이 분명할 때 테스트와 재사용이 쉬워집니다. 화면 출력이나 입력 읽기를 계산 함수 안에 섞지 말고 결과를 돌려주세요.', 'def discounted(price, rate):\n    return price * (1 - rate)\n\nprint(discounted(100, 0.2))', [
        reviewedChoice('py-w04-d5-choice-v2', '계산 함수의 경계', '할인 금액 계산 함수를 재사용하기 쉬운 형태로 만드는 방법은 무엇인가요?', '가격과 할인율을 인수로 받고 계산한 값을 반환해요.', [['함수가 화면에만 출력하고 호출자는 값을 받을 수 없게 해요.', '출력만 하면 다른 계산에서 결과를 이어 쓸 수 없습니다.'], ['함수 안에서 전역 가격을 직접 읽고 수정해요.', '숨겨진 전역 입력과 변경은 테스트와 호출자의 제어를 어렵게 합니다.']], '함수가 필요한 입력을 인수로 받고 계산 결과를 호출자에게 전달하는지 보세요.', '입력과 반환이 분명한 함수는 여러 호출에서 다시 쓸 수 있고 독립적으로 검사하기도 쉽습니다.'),
        reviewedTrace('py-w04-d5-trace-v2', '할인 함수 결과 추적', '아래 코드의 출력을 입력하세요.', 'def discounted(price, rate):\n    return price * (1 - rate)\n\nprint(discounted(100, 0.2))', ['80.0'], '1에서 0.2를 빼 할인 후 비율을 구한 뒤 가격을 곱하세요.', '100 × (1 − 0.2)는 80.0이며 함수가 그 값을 반환해 출력합니다.'),
        reviewedRepair({
          id: 'py-w04-d5-repair-v2', name: '작은 함수로 책임 나누기',
          starterCode: 'def discounted(price, rate):\n    print(price * (1 - rate))',
          prompt: '할인된 가격을 출력하지 말고 반환하세요. rate는 0 이상 1 이하의 숫자라고 가정합니다.',
          patterns: [String.raw`^def\s+discounted\s*\(\s*price\s*,\s*rate\s*\)\s*:\s*\n[ \t]+return\s+price\s*\*\s*\(\s*1\s*-\s*rate\s*\)\s*$`],
          requirements: ['`price * (1 - rate)` 계산 결과를 반환해요.'],
          constraints: ['`print`만 하고 함수 결과를 반환하지 않는 답은 허용하지 않아요.', '입력 범위 안에서 호출자의 상태를 바꾸지 않아요.'],
          examples: [{ input: '100, 0.2', output: '80.0' }],
  tests: [{ input: '0, 0.2', expected: '0.0' }, { input: '100, 1', expected: '0' }, { input: '100, 0', expected: '100' }],
          hint: '현재 함수는 계산값을 출력만 합니다. 같은 식을 return 뒤에 두면 호출자가 결과를 받을 수 있어요.',
          explanation: '계산 함수는 화면 출력에 묶이지 않도록 결과를 반환합니다. 허용 범위의 양끝 할인율에서도 계산 결과가 맞는지 확인하세요.',
        }),
      ]),
    ],
  },
});

Object.assign(foundations, {
  5: {
    objective: '인덱싱·변환·집계로 순서 있는 데이터를 다루고 빈 입력과 원본 변경을 확인해요.',
    intro: '리스트의 위치 규칙을 확인하고, 원소를 추가·정렬·복사·필터링하는 방법을 비교합니다. 평균처럼 합계와 원소 수를 결합하는 계산은 입력이 비었을 때의 계약도 먼저 정하세요.',
    points: ['인덱스는 0부터 시작하고 슬라이스의 끝 인덱스는 포함하지 않아요.', '비어 있지 않은 숫자 목록의 평균은 합계를 원소 수로 나눠요. 빈 목록은 따로 처리해야 해요.', '`append`는 항목 하나, `extend`는 반복 가능한 원소들을 추가하며 `+`는 새 목록을 만들어요.', '`sorted`는 새 정렬 목록을 반환하고 `list.sort()`는 원본을 바꾸며 None을 반환해요.', '얕은 복사는 바깥 목록만 복사해 안쪽 변경 가능한 객체를 공유할 수 있어요. 조건으로 새 목록을 만들 때도 안쪽 객체는 그대로 공유될 수 있어요.'],
    example: 'scores = [70, 80, 90]\nif scores:\n    average = sum(scores) / len(scores)\n    print(average)\nelse:\n    print("점수 없음")',
    sessions: [
      studySession(1, '평균과 빈 목록', '합계와 원소 수로 평균을 계산하고 빈 목록에서는 나누기를 건너뛰어요.', '평균은 합계를 원소 수로 나눈 값입니다. 빈 목록은 분모가 0이므로 문제의 계약에 따라 None, 안내 문구, 예외 중 하나를 명시적으로 선택해야 해요.', 'def average(values):\n    if not values:\n        return None\n    return sum(values) / len(values)\n\nprint(average([70, 80, 90]))\nprint(average([]))', [
        reviewedChoice('py-w05-d1-choice-v2', '평균의 분자와 분모', '비어 있지 않은 `scores`의 산술 평균을 구하는 식은 무엇인가요?', '`sum(scores) / len(scores)`예요.', [['`len(scores) / sum(scores)`예요.', '원소 수는 분자가 아니라 더한 점수를 나누는 분모입니다.'], ['`sum(scores) / (len(scores) - 1)`예요.', '표본 분산 보정이 아니라 단순 산술 평균을 묻고 있어 원소 수로 나눕니다.']], '점수들을 모두 더한 뒤 그 점수가 몇 개인지 세어 나누세요.', '비어 있지 않은 목록의 평균은 총합을 항목 수로 나눈 값입니다. 빈 목록에서는 먼저 별도 분기를 해야 합니다.'),
        reviewedTrace('py-w05-d1-trace-v2', '평균과 빈 입력의 출력', '아래 코드의 전체 출력을 두 줄로 입력하세요.', 'def average(values):\n    if not values:\n        return None\n    return sum(values) / len(values)\n\nprint(average([70, 80, 90]))\nprint(average([]))', ['80.0\nNone'], '첫 목록은 합을 3으로 나누고, 두 번째 목록은 먼저 빈 입력 분기를 탑니다.', '점수 평균은 80.0이고 빈 목록은 나눗셈을 하지 않아 None을 반환합니다.'),
      ]),
      studySession(2, '인덱스와 슬라이스', '인덱스 하나와 끝을 제외하는 슬라이스가 선택하는 원소를 추적해요.', '정수 인덱스는 한 원소를 선택하고 음수 인덱스는 끝에서부터 셉니다. 슬라이스는 시작은 포함하고 끝은 제외하므로 범위가 벗어나도 인덱싱과 달리 잘린 결과를 돌려줄 수 있어요.', 'items = ["a", "b", "c", "d"]\nprint(items[-1])\nprint(items[1:3])', [
        reviewedChoice('py-w05-d2-choice-v2', '슬라이스 끝 인덱스', '`items = ["a", "b", "c", "d"]`일 때 `items[1:3]`은 무엇인가요?', '`["b", "c"]`예요.', [['`["b", "c", "d"]`예요.', '슬라이스의 stop 값 3은 포함되지 않으므로 인덱스 3의 d는 빠집니다.'], ['`["a", "b", "c"]`예요.', 'start가 1이므로 인덱스 0의 a는 포함되지 않습니다.']], 'start 1은 포함하고 stop 3은 제외해 그 사이 인덱스를 적으세요.', '인덱스 1과 2의 원소만 선택되어 `["b", "c"]`가 됩니다.'),
        reviewedTrace('py-w05-d2-trace-v2', '음수 인덱스와 슬라이스', '아래 코드의 전체 출력을 두 줄로 입력하세요.', 'items = ["a", "b", "c", "d"]\nprint(items[-1])\nprint(items[1:3])', ['d\n[\'b\', \'c\']'], '음수 -1은 마지막 원소이며, 슬라이스 stop 3은 포함되지 않습니다.', '첫 줄은 마지막 값 d, 둘째 줄은 인덱스 1과 2의 목록 표현을 출력합니다.'),
      ]),
      studySession(3, 'append·extend와 새 목록', '제자리 변경 메서드와 결과를 새 변수에 저장해야 하는 `+`의 차이를 구분해요.', '`append`는 전달한 객체 하나를 끝에 넣고 `extend`는 그 객체의 원소를 차례로 추가합니다. 리스트 `+`는 새 리스트를 만들며 결과를 사용하지 않으면 원본은 그대로입니다.', 'tasks = ["read"]\ntasks.append("review")\ntasks.extend(["quiz", "test"])\ncopy = tasks + ["ship"]\nprint(tasks)\nprint(copy)', [
        reviewedChoice('py-w05-d3-choice-v2', 'append와 extend', '`tasks = ["read"]`에서 `tasks.extend(["review", "quiz"])` 뒤의 목록은 무엇인가요?', '`["read", "review", "quiz"]`예요.', [['`["read", ["review", "quiz"]]`예요.', '목록 하나를 한 원소로 넣는 동작은 append이며 extend는 각 원소를 펼칩니다.'], ['새 목록만 반환하고 `tasks`는 그대로예요.', 'extend는 기존 목록을 제자리에서 바꾸고 새 목록을 반환하지 않습니다.']], '전달한 두 값을 하나의 묶음 원소로 넣는지 각각 추가하는지 보세요.', '`extend`는 전달한 반복 가능 객체를 순회해 각 원소를 현재 목록 끝에 추가합니다.'),
        reviewedTrace('py-w05-d3-trace-v2', '변경 목록과 새 목록 출력', '아래 코드의 두 출력 줄을 입력하세요.', 'tasks = ["read"]\ntasks.append("review")\ntasks.extend(["quiz", "test"])\ncopy = tasks + ["ship"]\nprint(tasks)\nprint(copy)', ['[\'read\', \'review\', \'quiz\', \'test\']\n[\'read\', \'review\', \'quiz\', \'test\', \'ship\']'], 'append와 extend는 tasks를 바꾸고, +의 결과는 copy에 저장됩니다.', '두 제자리 변경 뒤 tasks에는 네 원소가 있고, `+`로 만든 새 목록에는 ship이 하나 더 있습니다.'),
      ]),
      studySession(4, '정렬 결과와 원본', '`sorted`의 반환 목록과 `list.sort()`의 제자리 변경을 비교해요.', '두 방식 모두 정렬 결과를 얻을 수 있지만 원본과 반환값 계약이 다릅니다. `sorted(values)`는 새 목록을 주고, `values.sort()`는 원본을 바꾸며 반환값은 None이에요.', 'scores = [3, 1, 2]\nordered = sorted(scores)\nin_place_result = scores.sort()\nprint(ordered)\nprint(scores)\nprint(in_place_result)', [
        reviewedChoice('py-w05-d4-choice-v2', '정렬 방식 선택', '정렬된 별도 목록이 필요하고 원본 순서를 보존하려면 무엇을 써야 하나요?', '`ordered = sorted(scores)`예요.', [['`ordered = scores.sort()`예요.', '`sort()`는 원본을 바꾸고 None을 반환하므로 ordered에 정렬 목록이 들어가지 않습니다.'], ['`scores.reverse()`예요.', 'reverse는 현재 순서를 뒤집을 뿐 값의 크기 기준으로 정렬하지 않습니다.']], '원본을 그대로 두려는지, 제자리에서 바꿔도 되는지와 반환값을 확인하세요.', '`sorted`는 원본을 유지한 채 새 정렬 목록을 반환합니다.'),
        reviewedTrace('py-w05-d4-trace-v2', 'sorted와 sort의 출력', '아래 코드의 세 줄 출력을 순서대로 입력하세요.', 'scores = [3, 1, 2]\nordered = sorted(scores)\nin_place_result = scores.sort()\nprint(ordered)\nprint(scores)\nprint(in_place_result)', ['[1, 2, 3]\n[1, 2, 3]\nNone'], '`sorted`가 만든 목록, 변경된 scores, sort 호출 반환값을 차례로 확인하세요.', 'ordered와 scores는 모두 오름차순이고 `list.sort()` 호출 결과를 저장한 변수는 None입니다.'),
        locateError('py-w05-d4-locate-v2', '정렬된 새 목록을 잃는 줄 찾기', '원본 `scores`는 보존하고 정렬된 새 목록을 출력하려는 코드입니다. 기대와 다르게 만드는 줄을 고르세요.', 'Python', ['scores = [3, 1, 2]', 'sorted(scores)', 'print(scores)'], [2], '`sorted`가 새 목록을 반환해도 그 값을 저장하거나 사용했는지 보세요.', '2번 줄은 정렬된 새 목록을 만들고 버립니다. `ordered = sorted(scores)`로 저장한 뒤 ordered를 출력해야 원본과 결과를 모두 보존할 수 있습니다.'),
      ]),
      studySession(5, '얕은 복사와 조건으로 새 목록 만들기', '조건에 맞는 항목만 새 목록에 담고, 안쪽 목록은 원본과 공유되는지 확인해요.', '`copy()`는 바깥 목록만 새로 만듭니다. 안쪽 목록은 원본과 같은 객체일 수 있어요. 조건을 넣어 새 목록을 만들어도 안쪽 목록까지 복사하지는 않습니다.', 'records = [["pending"], ["done"]]\nsnapshot = records.copy()\npending = [record for record in records if record[0] == "pending"]\nsnapshot[0][0] = "done"\nprint(pending)', [
        reviewedChoice('py-w05-d5-choice-v2', '얕은 복사 경계', '`records.copy()`가 만든 바깥 목록의 안쪽 목록은 원본과 어떤 관계인가요?', '같은 안쪽 목록 객체를 가리킬 수 있어 값을 바꾸면 원본에서도 보여요.', [['안쪽 목록까지 새 목록으로 복제돼요.', '`list.copy()`는 중첩 객체를 재귀 복사하지 않습니다.'], ['안쪽 목록은 자동으로 변경할 수 없게 돼요.', '복사는 자료형의 변경 가능성을 없애지 않으며 참조를 공유할 수 있습니다.']], '바깥 목록과 안에 든 목록이 각각 새 객체인지 나눠 생각하세요.', '얕은 복사에서는 바깥 리스트만 새로 만들어지고 안쪽 목록 참조는 원본과 공유됩니다.'),
        reviewedTrace('py-w05-d5-trace-v3', '공유 객체와 필터 결과', '아래 코드가 출력하는 한 줄을 입력하세요.', 'records = [["pending"], ["done"]]\nsnapshot = records.copy()\npending = [record for record in records if record[0] == "pending"]\nsnapshot[0][0] = "done"\nprint(pending)', ["[['done']]"], 'pending과 snapshot의 첫 요소가 같은 안쪽 목록인지 확인하세요.', '컴프리헨션으로 만든 pending은 바깥 목록은 새것이지만 안쪽 첫 목록을 records와 공유합니다. snapshot에서 그 목록의 값을 바꾸므로 출력은 `[[\'done\']]`입니다.'),
        reviewedRepair({
          id: 'py-w05-d5-repair-v3', name: '기준에 맞는 값 고르기',
          starterCode: 'def filter_minutes(minutes, minimum):\n    return minutes',
          prompt: '기준 시간 이상인 값만 입력 순서대로 새 목록으로 반환하세요. 중복 값도 입력에 나온 횟수만큼 유지하고 원본 목록은 바꾸지 않습니다.',
          patterns: [
            String.raw`^def\s+filter_minutes\s*\(\s*minutes\s*,\s*minimum\s*\)\s*:\s*\n[ \t]+return\s+\[\s*value\s+for\s+value\s+in\s+minutes\s+if\s+value\s*>=\s*minimum\s*\]\s*$`,
            String.raw`^def\s+filter_minutes\s*\(\s*minutes\s*,\s*minimum\s*\)\s*:\s*\n[ \t]+result\s*=\s*\[\s*\]\s*\n[ \t]+for\s+value\s+in\s+minutes\s*:\s*\n[ \t]+if\s+value\s*>=\s*minimum\s*:\s*\n[ \t]+result\.append\s*\(\s*value\s*\)\s*\n[ \t]+return\s+result\s*$`,
          ],
          requirements: ['`value >= minimum`인 값만 새 결과에 담아요.', '입력 순서와 중복 횟수를 유지해요.'],
          constraints: ['입력 목록을 제자리에서 바꾸지 않아요.', '출력만 하지 않고 목록을 반환해요.'],
          examples: [{ input: '[45, 60, 80], 60', output: '[60, 80]' }],
          tests: [{ input: '[], 10', expected: '[]' }, { input: '[5, 10], 10', expected: '[10]' }, { input: '[10, 10], 10', expected: '[10, 10]' }],
          hint: '빈 결과 목록에 기준 이상인 값만 차례로 담거나, 반복문과 조건을 대괄호 안에 써서 새 목록을 만드세요.',
          explanation: '같은 입력에서 같은 순서의 새 결과를 반환하고 원본은 보존해야 합니다. 반복문과 조건을 대괄호 안에 쓰는 방식과 일반 for문을 모두 정답으로 인정합니다.',
        }),
      ]),
    ],
  },
  6: {
    objective: '딕셔너리 키의 직접 조회와 기본값, 순회, 중첩 데이터의 필수 조건을 다뤄요.',
    intro: '딕셔너리는 키와 값의 관계를 저장합니다. 반드시 있어야 하는 키는 직접 확인하고, 빠질 수 있는 키는 get이나 포함 검사를 사용하세요. 여러 필드를 읽거나 안쪽 딕셔너리로 들어갈 때는 누락된 입력의 동작도 정합니다.',
    points: ['`data[key]`는 키가 없을 때 KeyError가 나므로 필수 키인지 먼저 정해요.', '`get(key, default)`는 키가 없을 때 기본값을 반환하고 딕셔너리를 바꾸지 않아요.', '값 0과 키 누락을 구분해야 하면 `key in data`도 함께 확인해요.', '`items()`는 삽입된 순서대로 키와 값 쌍을 순회해요.', '필수 키 집합이 제공 키 집합의 부분집합인지 `required <= provided` 방향으로 확인해요.', '중첩 키 접근은 각 단계의 누락·None 계약을 정하고 안전하게 처리해요.'],
    example: 'record = {"course": {"title": "Python", "minutes": 40}}\nrequired = {"title", "minutes"}\nprovided = set(record["course"])\nprint(required <= provided)\nprint(record["course"].get("title"))',
    sessions: [
      studySession(1, '키로 값 찾기', '필수 키의 이름으로 연결된 값을 직접 조회해요.', '딕셔너리의 키는 값에 접근하는 이름표입니다. 반드시 존재해야 하는 키라면 대괄호 조회가 간단하지만, 누락 가능성이 있는 입력에는 KeyError가 날 수 있어요.', 'scores = {"mina": 92}\nprint(scores["mina"])', [
        reviewedChoice('py-w06-d1-choice-v2', '키와 값 조회', '`scores["mina"]`가 선택하는 값은 무엇인가요?', '키 `mina`에 연결된 값 92예요.', [['딕셔너리의 첫 번째 값이라는 위치예요.', '딕셔너리 대괄호는 목록처럼 숫자 위치가 아니라 키를 조회합니다.'], ['키 이름 `mina` 그 자체예요.', '조회 결과는 대괄호 안 키에 대응하는 값 92입니다.']], '대괄호 안 표현식은 위치 번호가 아니라 딕셔너리의 키입니다.', '문자열 키 `mina`가 가리키는 점수 92를 반환합니다.'),
        reviewedTrace('py-w06-d1-trace-v2', '키 조회 결과', '아래 코드의 출력을 입력하세요.', 'scores = {"mina": 92}\nprint(scores["mina"])', ['92'], '딕셔너리에서 mina 키를 찾아 연결된 숫자를 읽으세요.', 'mina 키에 저장된 값은 92입니다.'),
      ]),
      studySession(2, 'get으로 기본값 지정', '선택 키가 없을 때 예외 대신 사용할 값을 정해요.', '`get`은 키가 있으면 연결된 값을 돌려주고 없으면 지정한 기본값을 돌려줍니다. 키 누락을 허용하는 화면 조회와 필수 키의 오류 처리를 구분하세요.', 'scores = {"mina": 92}\nprint(scores.get("jun", 0))', [
        reviewedChoice('py-w06-d2-choice-v2', 'get의 기본값', '`scores`에 `jun` 키가 없을 때 `scores.get("jun", 0)`은 무엇을 돌려주나요?', '기본값 0을 돌려줘요.', [['딕셔너리에 `jun: 0`을 저장하고 None을 돌려줘요.', '`get`은 조회 메서드이며 누락 키를 딕셔너리에 추가하지 않습니다.'], ['항상 KeyError를 발생시켜요.', '직접 대괄호 조회와 달리 get은 지정한 기본값으로 누락을 처리합니다.']], '키의 존재 여부와 get의 두 번째 인수가 무엇을 뜻하는지 확인하세요.', 'jun 키가 없으므로 두 번째 인수 0을 반환합니다. 이 조회만으로 원본은 바뀌지 않습니다.'),
        reviewedTrace('py-w06-d2-trace-v2', '누락 키의 결과', '아래 코드의 출력을 입력하세요.', 'scores = {"mina": 92}\nprint(scores.get("jun", 0))', ['0'], '딕셔너리에 jun이 없으므로 get의 기본값을 확인하세요.', '누락된 키에 지정한 정수 0이 반환되어 출력됩니다.'),
      ]),
      studySession(3, '키 존재와 기본값 구분', '저장된 0과 없는 키를 get만으로 구별할 수 없는 상황을 확인해요.', '기본값 자체가 실제 값일 수도 있습니다. 예를 들어 저장된 0과 없는 키가 모두 get의 결과 0이 될 수 있으므로 존재 여부가 중요하면 `in` 검사를 함께 사용하세요.', 'minutes = {"intro": 0}\nprint("intro" in minutes, minutes.get("intro", 0))\nprint("review" in minutes, minutes.get("review", 0))', [
        reviewedChoice('py-w06-d3-choice-v2', '저장된 0과 누락 키', '`get("key", 0)`의 결과가 0일 때 실제 값 0이 저장된 것인지 누락인지 구분하려면 무엇을 추가로 확인해야 하나요?', '`"key" in data`로 키의 존재 여부를 확인해요.', [['결과 0만 보고 항상 누락이라고 판단해요.', '저장된 실제 값이 0일 수도 있어 결과만으로 구분할 수 없습니다.'], ['`len(data) == 0`인지 확인해요.', '다른 키가 있을 수 있으므로 전체 딕셔너리 길이는 특정 키의 존재를 알려주지 않습니다.']], '기본값과 실제 저장값이 같을 수 있는지 생각하세요.', '`in` 검사는 값이 0인지와 무관하게 해당 키가 저장되어 있는지를 직접 알려줍니다.'),
        reviewedTrace('py-w06-d3-trace-v2', '저장된 값과 누락 키 출력', '아래 코드의 두 줄을 입력하세요.', 'minutes = {"intro": 0}\nprint("intro" in minutes, minutes.get("intro", 0))\nprint("review" in minutes, minutes.get("review", 0))', ['True 0\nFalse 0'], '각 줄에서 먼저 키 포함 여부, 다음으로 get 결과를 읽으세요.', 'intro는 실제 키라 `True 0`, review는 없어 `False 0`을 출력합니다.'),
      ]),
      studySession(4, 'items로 키와 값 순회', 'items가 주는 키·값 쌍을 각각 받아 순서대로 처리해요.', '딕셔너리 자체를 반복하면 키를 순회합니다. 키와 값을 함께 쓰려면 `items()`가 돌려주는 쌍을 풀어 받으세요. Python 딕셔너리는 삽입 순서를 유지하므로 이 예제의 출력 순서를 확인할 수 있어요.', 'scores = {"mina": 92, "jun": 85}\nfor name, score in scores.items():\n    print(name, score)', [
        reviewedChoice('py-w06-d4-choice-v2', '키와 값을 함께 순회하기', '키와 점수를 각각 변수에 받아 순회할 때 사용할 코드는 무엇인가요?', '`for name, score in scores.items():`예요.', [['`for name, score in scores:`예요.', '딕셔너리 직접 반복은 기본적으로 키를 줍니다. 키 문자열을 두 변수로 풀려고 하면 오류가 날 수 있습니다.'], ['`for score in scores.values():`예요.', 'values만 순회하면 점수는 받지만 해당 점수의 이름 키는 받을 수 없습니다.']], '반복문에서 키와 값 둘 다 필요한지 보고 반복 대상이 쌍을 제공하는지 확인하세요.', '`items()`는 각 항목의 키와 값을 쌍으로 제공해 두 변수에 나눠 담을 수 있습니다.'),
        reviewedTrace('py-w06-d4-trace-v2', '딕셔너리 항목 출력 순서', '아래 코드의 전체 출력을 두 줄로 입력하세요.', 'scores = {"mina": 92, "jun": 85}\nfor name, score in scores.items():\n    print(name, score)', ['mina 92\njun 85'], '딕셔너리에 넣은 순서대로 각 키와 값 쌍을 추적하세요.', 'mina 항목을 먼저 넣고 jun 항목을 다음에 넣었으므로 두 줄이 그 순서로 나옵니다.'),
        locateError('py-w06-d4-locate-v2', '키와 값을 잘못 푸는 줄 찾기', '이름과 점수를 각각 출력하려는 코드입니다. 실행 중 쌍을 나누는 방식이 잘못된 줄을 고르세요.', 'Python', ['scores = {"mina": 92, "jun": 85}', 'for name, score in scores:', '    print(name, score)'], [2], '딕셔너리를 직접 반복했을 때 받는 값이 키인지 키·값 쌍인지 확인하세요.', '2번 줄에서 딕셔너리를 직접 반복하면 키만 나옵니다. 키와 값이 모두 필요하면 `scores.items()`를 순회하세요.'),
      ]),
      studySession(5, '중첩 데이터와 필수 키', '중첩 키를 안전히 읽고 필수 필드 집합 검사의 방향을 확인해요.', '중첩 조회는 바깥 객체의 존재를 확인한 뒤 안쪽 키를 읽어야 합니다. 데이터 형식이 정해져 있다면 필수 키 집합과 실제 키 집합을 비교해 누락을 검출할 수 있어요.', 'record = {"course": {"title": "Python", "minutes": 40}}\nrequired = {"title", "minutes"}\nprovided = set(record["course"])\nprint(required <= provided)\nprint(record["course"].get("title"))', [
        reviewedChoice('py-w06-d5-choice-v2', '필수 키 부분집합 검사', '`required`의 모든 키가 `provided`에도 있는지 확인하는 비교는 무엇인가요?', '`required <= provided`예요.', [['`provided <= required`예요.', '이 방향은 제공된 키만 필요한 키 안에 포함되는지 확인해 누락 필드를 놓칠 수 있습니다.'], ['`required >= provided`예요.', '이 비교도 방향이 반대라 provided에 불필요한 키가 있을 때의 포함 관계를 검사합니다.']], '필요한 키 집합을 왼쪽, 실제로 받은 키 집합을 오른쪽에 두세요.', '필요한 모든 키가 제공된 집합에 포함되어야 하므로 required가 provided의 부분집합인지 확인합니다.'),
        reviewedTrace('py-w06-d5-trace-v2', '중첩 키와 필수 필드 결과', '아래 두 줄의 출력을 순서대로 입력하세요.', 'record = {"course": {"title": "Python", "minutes": 40}}\nrequired = {"title", "minutes"}\nprovided = set(record["course"])\nprint(required <= provided)\nprint(record["course"].get("title"))', ['True\nPython'], 'course 내부 키 두 개가 required에 모두 있는지 확인하고 제목 값을 읽으세요.', '필수 키가 모두 제공되어 True, 안쪽 title 값은 Python입니다.'),
        reviewedRepair({
          id: 'py-w06-d5-repair-v2', name: '중첩 데이터와 필수 키',
          starterCode: 'def nested_course_title(record):\n    return record["course"]["title"]',
          prompt: 'record는 딕셔너리이며 course는 없거나 None일 수 있습니다. course 딕셔너리에서 title을 돌려주고, course 또는 title 키가 없을 때만 "제목 없음"을 반환하세요. title 값 자체가 빈 문자열이면 그대로 반환합니다.',
          patterns: [String.raw`^def\s+nested_course_title\s*\(\s*record\s*\)\s*:\s*\n[ \t]+course\s*=\s*record\.get\(\s*"course"\s*\)\s*or\s*\{\s*\}\s*\n[ \t]+return\s+course\.get\(\s*"title"\s*,\s*"제목 없음"\s*\)\s*$`],
          requirements: ['course 누락 또는 None을 빈 딕셔너리처럼 처리해요.', 'title 키가 없을 때만 기본 문구를 반환해요.', 'title 키의 빈 문자열은 그대로 반환해요.'],
          constraints: ['record와 course는 문제에 적힌 딕셔너리 또는 None 계약을 따릅니다.', '출력하지 않고 값을 반환해요.'],
          examples: [{ input: '{"course": {"title": "Python"}}', output: 'Python' }],
          tests: [{ input: '{}', expected: '제목 없음' }, { input: '{"course": null}', expected: '제목 없음' }, { input: '{"course": {}}', expected: '제목 없음' }, { input: '{"course": {"title": ""}}', expected: '"" (빈 문자열)' }],
          hint: '먼저 course를 안전한 딕셔너리 값으로 정하고, 그 안에서 title 키를 조회하세요. 기본값은 키가 없을 때만 쓰여야 합니다.',
          explanation: '`record.get("course") or {}`는 빠지거나 None인 course를 빈 딕셔너리로 처리합니다. 이후 `get("title", 기본값)`은 title 키가 없을 때만 제목 없음 문자열을 반환하므로 저장된 빈 문자열은 유지합니다.',
        }),
      ]),
    ],
  },
});

Object.assign(foundations, reviewedPythonWeeks7to9);
Object.assign(foundations, reviewedPythonWeeks10to12);

export const reviewedPythonFoundationWeeks = Object.fromEntries(
  Object.entries(foundations).map(([week, entry]) => [Number(week), entry]),
);
