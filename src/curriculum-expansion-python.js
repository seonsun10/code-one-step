import { choice, locateError, outputTrace, shortAnswer, versionedShortAnswer, lesson } from './curriculum-tools.js';

const pythonExpansion = {
  topics: [
    { id: 'python-foundations', stage: 1, title: '입문 · 값과 판단', objective: '값을 저장하고 조건에 따라 프로그램의 첫 흐름을 만들어요.', lessonIds: ['py-variables', 'py-conditions'] },
    { id: 'python-flow', stage: 2, title: '기초 · 반복과 함수', objective: '반복 작업을 정리하고 재사용할 계산을 함수로 나눠요.', lessonIds: ['py-loops', 'py-functions'] },
    { id: 'python-data', stage: 3, title: '중급 · 자료와 오류', objective: '컬렉션을 선택하고 모듈과 예외로 프로그램을 안정적으로 만들어요.', lessonIds: ['py-lists', 'py-dictionaries', 'py-modules-errors'] },
    { id: 'python-structure', stage: 4, title: '고급 · 구조와 모델링', objective: '파일 자원, 지연 계산, 클래스로 더 큰 프로그램의 구조를 다뤄요.', lessonIds: ['py-files-context', 'py-iterators-generators', 'py-classes-types'] },
    { id: 'python-practice', stage: 5, title: '실전 · 동시 작업과 데이터', objective: '비동기 작업의 경계를 이해하고 작은 데이터 처리 기능을 설계해요.', lessonIds: ['py-async-concurrency', 'py-data-capstone'] },
  ],
  lessonOrder: [
    'py-variables', 'py-conditions', 'py-loops', 'py-functions', 'py-lists', 'py-dictionaries',
    'py-modules-errors', 'py-files-context', 'py-iterators-generators', 'py-classes-types',
    'py-async-concurrency', 'py-data-capstone',
  ],
  lessons: [
    lesson('py-dictionaries', 'python-data', '키로 데이터 찾기', '11분', '딕셔너리에서 키와 값의 관계를 안전하게 다뤄요.',
      '딕셔너리는 이름표인 키로 값을 찾는 자료형입니다. 위치가 중요한 목록에는 리스트를, 항목의 이름으로 찾는 정보에는 딕셔너리를 선택하면 의도가 분명해져요.',
      ['키는 딕셔너리 안에서 중복될 수 없어요.', '`scores["mina"]`처럼 키로 값을 가져와요.', '없을 수도 있는 키는 `get`으로 기본값을 정할 수 있어요.'],
      'scores = {"mina": 92, "jun": 85}\nprint(scores.get("yuna", 0))', [
        choice('py-dictionaries-choice', '이름으로 점수 찾기', '`scores = {"mina": 92}`일 때 Mina의 점수를 얻는 표현식은 무엇인가요?', [
          ['scores["mina"]', '문자열 키 `"mina"`로 해당 값을 조회해요.'],
          ['scores[0]', '딕셔너리는 삽입 순서를 이용하는 0번 위치 조회가 목적이 아니며, 이 키는 존재하지 않아요.'],
          ['scores.mina', '일반 딕셔너리 키는 속성 접근 문법으로 읽지 않아요.'],
        ], 0, '점수에 붙인 이름표가 무엇인지 보세요.', '딕셔너리는 키를 대괄호 안에 넣어 값을 조회합니다.'),
        locateError('py-dictionaries-locate', '없을 수 있는 키 찾기', '사용자가 없을 때도 0점을 표시하고 싶습니다. 예외를 일으킬 수 있는 줄을 고르세요.', 'Python', [
          'scores = {"mina": 92}', 'name = "yuna"', 'print(scores[name])',
        ], [3], '딕셔너리에 `"yuna"` 키가 있는지 확인해 보세요.', '3번 줄의 `scores[name]`은 없는 키에 `KeyError`를 일으킵니다. `scores.get(name, 0)`처럼 기본값을 정할 수 있어요.'),
        shortAnswer('py-dictionaries-short', '기본값 결과 쓰기', '`{"a": 3}.get("b", 0)`의 결과를 숫자로 입력하세요.', ['0'], '키 `"b"`가 실제로 있는지 먼저 보세요.', '키가 없으면 `get`의 두 번째 인자인 기본값 0을 반환합니다.'),
      ], '중급'),
    lesson('py-modules-errors', 'python-data', '모듈과 예외 경계', '12분', '가져온 기능을 사용하고 예상 가능한 실패를 좁게 처리해요.',
      '모듈은 관련 기능을 담은 파일입니다. 예외 처리는 실패를 숨기는 장치가 아니라, 예상한 실패를 필요한 위치에서 처리하는 방법이에요.',
      ['`import math` 뒤에는 `math.sqrt(9)`처럼 모듈 이름을 붙여요.', '`except ValueError`는 값 형식이 맞지 않을 때만 처리해요.', '너무 넓은 `except:`는 예상하지 못한 오류까지 숨길 수 있어요.'],
      'import math\n\ntry:\n    radius = float("3")\nexcept ValueError:\n    radius = 0\nprint(math.pi * radius ** 2)', [
        choice('py-modules-choice', '가져온 모듈 사용하기', '`import math` 뒤에 9의 제곱근을 구하는 올바른 코드는 무엇인가요?', [
          ['math.sqrt(9)', '`math` 모듈의 `sqrt` 함수를 모듈 이름과 함께 호출해요.'],
          ['sqrt.math(9)', '`sqrt`는 함수 이름이고 모듈 이름은 앞에 둬야 하므로 `math.sqrt(9)`처럼 호출해야 해요.'],
          ['math["sqrt"](9)', '모듈은 딕셔너리처럼 대괄호로 함수를 조회하지 않아요.'],
        ], 0, '`import` 뒤의 이름이 어디에 붙는지 생각해 보세요.', '`import math`는 `math.sqrt`처럼 모듈의 공개 이름을 통해 기능을 사용하게 합니다.'),
        locateError('py-modules-errors-locate', '너무 넓은 예외 처리 찾기', '숫자로 바꾸지 못한 경우만 처리하려고 합니다. 다른 버그까지 감출 수 있는 줄을 고르세요.', 'Python', [
          'try:', '    age = int(text)', 'except:', '    age = 0',
        ], [3], '처리하려는 실패의 예외 이름이 코드에 보이는지 확인하세요.', '3번 줄의 bare `except:`는 거의 모든 예외를 잡습니다. 이 경우에는 `except ValueError:`처럼 좁혀야 해요.'),
        versionedShortAnswer('py-modules-errors-short', '`int` 변환 실패 예외', '`int("three")`가 값의 형식 때문에 실패할 때 처리할 예외 이름을 입력하세요.', ['ValueError'], '문자열은 숫자로 해석할 수 없을 때 어떤 “값” 관련 오류가 날까요?', '숫자로 바꿀 수 없는 문자열은 `ValueError`를 발생시킵니다.', 'case-sensitive'),
      ], '중급'),
    lesson('py-files-context', 'python-structure', '파일을 안전하게 열고 닫기', '12분', '컨텍스트 관리자로 파일 자원을 예외 상황에서도 정리해요.',
      '파일은 열고 난 뒤 닫아야 하는 자원입니다. `with open(...) as file:`은 블록이 끝날 때 파일을 닫도록 보장해, 중간에 예외가 나도 정리할 수 있게 합니다.',
      ['`with` 블록을 벗어나면 파일은 자동으로 닫혀요.', '텍스트 파일 인코딩을 명시하면 환경 차이를 줄일 수 있어요.', '`read()`는 전체 내용을 문자열로 읽을 수 있어요.'],
      'with open("notes.txt", encoding="utf-8") as file:\n    text = file.read()\nprint(text)', [
        choice('py-files-context-choice', '파일 자동 정리', '파일을 읽은 뒤 예외가 발생해도 닫히게 하는 형태는 무엇인가요?', [
          ['with open("notes.txt", encoding="utf-8") as file:', '`with`가 블록 종료 시 파일의 정리를 맡아요.'],
          ['file = open("notes.txt")', '직접 연 파일은 별도로 `close()`를 보장해야 해요.'],
          ['open = "notes.txt"', '파일을 여는 호출이 아니라 이름을 덮어쓰는 대입이에요.'],
        ], 0, '블록을 빠져나갈 때 자원을 정리하는 문법을 떠올려 보세요.', '`with`와 컨텍스트 관리자는 파일 같은 자원을 예외 상황에서도 정리합니다.'),
        locateError('py-files-context-locate', '닫히지 않는 파일 찾기', '반복해서 실행할 수 있는 코드에서 파일이 닫히지 않을 수 있습니다. 원인이 되는 줄을 고르세요.', 'Python', [
          'file = open("notes.txt", encoding="utf-8")', 'text = file.read()', 'print(text)',
        ], [1], '이 코드에 파일 정리를 맡은 `with` 또는 `close()`가 있는지 확인하세요.', '1번 줄에서 연 파일을 닫는 코드가 없습니다. `with open(...) as file:`로 감싸는 방식이 안전합니다.'),
        versionedShortAnswer('py-files-context-short', '파일 전체 읽기', '`file` 객체에서 텍스트 전체를 한 번에 읽는 메서드 호출을 입력하세요.', ['file.read()'], '한 줄 단위가 아니라 전체 내용을 읽는 메서드와 객체 이름을 함께 적으세요.', '`file.read()`는 현재 위치부터 파일 끝까지의 내용을 문자열로 읽습니다.', 'case-sensitive'),
      ], '고급'),
    lesson('py-iterators-generators', 'python-structure', '필요할 때 하나씩 만들기', '13분', '이터레이터와 제너레이터가 값을 지연해서 만드는 방식을 설명해요.',
      '제너레이터 함수는 `yield`에서 값을 하나 내놓고 상태를 기억합니다. 큰 데이터를 모두 목록으로 만들지 않고 하나씩 다룰 수 있지만, 한 번 소진한 제너레이터는 처음부터 다시 읽지 못해요.',
      ['`yield`가 있는 함수 호출은 제너레이터 객체를 만들어요.', '`next()`는 다음 값을 하나 꺼내요.', '제너레이터는 필요한 순간에 값을 계산하는 지연 평가에 적합해요.'],
      'def squares(limit):\n    for number in range(limit):\n        yield number * number\n\nfor value in squares(3):\n    print(value)', [
        choice('py-generators-choice', '반복자의 첫 값', '`items = iter([0, 1, 4])`를 만든 뒤 `next(items)`가 반환하는 값은 무엇인가요?', [
          ['0', '`items`는 목록의 첫 원소부터 시작해요.'],
          ['1', '1은 두 번째 원소예요. 첫 `next` 호출은 한 항목만 반환해요.'],
          ['4', '4는 세 번째 원소예요. 첫 `next` 호출은 한 항목만 반환해요.'],
        ], 0, '`iter`가 받은 목록의 첫 원소를 확인하세요.', '`iter`가 만든 반복자에서 처음 `next`를 호출하면 목록의 첫 값인 0을 반환합니다.'),
        locateError('py-generators-locate', '소진된 제너레이터 찾기', '두 번째 반복에서 아무 값도 출력되지 않습니다. 그 원인이 되는 줄을 고르세요.', 'Python', [
          'numbers = (n * n for n in range(3))', 'for value in numbers:', '    print(value)', 'for value in numbers:', '    print(value)',
        ], [4], '첫 번째 반복이 `numbers`에서 값을 모두 꺼낸 뒤 어떤 상태인지 생각하세요.', '4번 줄에서 같은 제너레이터를 다시 반복하지만 이미 소진됐어요. 새 제너레이터를 만들거나 결과를 목록으로 저장해야 합니다.'),
        versionedShortAnswer('py-generators-short', '다음 항목 꺼내기', '이터레이터 `items`에서 다음 값을 하나 꺼내는 호출을 입력하세요.', ['next(items)'], '내장 함수 하나가 이터레이터의 다음 값을 요청해요.', '`next(items)`는 이터레이터에서 다음 항목을 가져오며, 더 없으면 `StopIteration`이 발생합니다.', 'case-sensitive'),
      ], '고급'),
    lesson('py-classes-types', 'python-structure', '객체와 타입 힌트로 모델 표현하기', '14분', '상태와 동작을 클래스로 묶고 함수의 입력·출력 의도를 타입 힌트로 나타내요.',
      '클래스는 서로 관련된 데이터와 동작을 한 모델로 묶습니다. 타입 힌트는 실행 중 강제 검사가 아니라, 사람이 읽고 타입 검사 도구가 확인할 수 있는 약속이에요.',
      ['인스턴스 메서드의 첫 매개변수는 관례상 `self`예요.', '`__init__`은 새 인스턴스의 초기 상태를 정해요.', '`def total(values: list[int]) -> int:`는 입력과 반환값의 의도를 적어요.'],
      'class Counter:\n    def __init__(self, value: int = 0):\n        self.value = value\n\n    def increment(self) -> None:\n        self.value += 1', [
        choice('py-classes-choice', '인스턴스 상태 바꾸기', '`Counter.increment` 안에서 인스턴스의 `value`를 하나 늘리는 코드는 무엇인가요?', [
          ['self.value += 1', '`self`를 통해 현재 인스턴스의 상태에 접근해 갱신해요.'],
          ['value += 1', '지역 이름 `value`가 정의되어 있지 않아 인스턴스 상태를 바꾸지 못해요.'],
          ['Counter.value += 1', '이 코드는 클래스 전체 속성을 다루는 형태이며 각 인스턴스의 값이 아니에요.'],
        ], 0, '메서드에서 현재 만들어진 객체를 가리키는 이름을 찾으세요.', '인스턴스 속성은 `self.value`처럼 `self`를 통해 읽고 바꿉니다.'),
        locateError('py-classes-locate', '초기화 메서드 이름 찾기', '`Student("민아")`를 만들 때 TypeError가 발생합니다. 원인이 되는 줄을 고르세요.', 'Python', [
          'class Student:', '    def _init_(self, name):', '        self.name = name',
        ], [2], 'Python이 생성 시 자동으로 찾는 메서드 이름에는 밑줄이 몇 개인지 확인하세요.', '2번 줄의 `_init_`는 초기화 메서드 이름이 아닙니다. Python이 인자를 받을 `__init__`을 찾지 못해 객체 생성이 실패합니다.'),
        shortAnswer('py-classes-types-short', '정수 반환 타입', '정수를 반환한다는 타입 힌트의 빈칸을 채우세요: `def count() ___ int:`', ['->'], '반환 타입 앞에는 ASCII 하이픈과 부등호 기호를 순서대로 붙여 씁니다.', '반환 타입 힌트는 `-> int`처럼 하이픈과 부등호 기호로 씁니다. 비슷하게 생긴 Unicode 화살표는 Python 문법이 아니에요. 타입 힌트 자체는 Python이 자동으로 런타임 강제하지 않습니다.'),
      ], '고급'),
    lesson('py-async-concurrency', 'python-practice', '기다리는 작업을 함께 다루기', '14분', '비동기 함수의 `await` 경계와 동시성의 한계를 구분해요.',
      '`async def` 함수는 호출만으로 본문을 완료하지 않고 코루틴 객체를 만듭니다. `await`는 기다리는 동안 다른 작업이 진행할 기회를 주지만, CPU를 오래 쓰는 계산을 저절로 빠르게 만들지는 않아요.',
      ['비동기 함수 안에서 비동기 작업 결과는 `await`로 받아요.', '`asyncio.gather`는 여러 awaitable을 함께 기다릴 수 있어요.', 'CPU 중심 작업은 비동기 문법만으로 병렬 실행되는 것이 아니에요.'],
      'import asyncio\n\nasync def load_pair():\n    first, second = await asyncio.gather(fetch_a(), fetch_b())\n    return first + second', [
        choice('py-async-choice', '코루틴 결과 받기', '`async def fetch_name(): ...`를 호출한 결과를 비동기 함수 안에서 값으로 받는 코드는 무엇인가요?', [
          ['name = await fetch_name()', '`await`가 코루틴의 완료를 기다리고 결과를 받아요.'],
          ['name = fetch_name()', '이 대입은 보통 코루틴 객체를 저장할 뿐 결과값을 기다리지 않아요.'],
          ['name = yield fetch_name()', '`yield`는 제너레이터 문법이며 이 비동기 호출의 결과 대기가 아니에요.'],
        ], 0, '비동기 작업의 완료를 기다리는 키워드를 찾으세요.', '코루틴의 실제 결과가 필요할 때는 비동기 함수 안에서 `await`를 사용합니다.'),
        locateError('py-async-locate', '기다리지 않은 코루틴 찾기', 'client는 get 호출이 코루틴을 반환하는 비동기 HTTP 클라이언트입니다. 응답 본문 대신 코루틴 객체가 남을 수 있는 줄을 고르세요.', 'Python', [
          'async def title(client):', '    response = client.get("/title")', '    return response.text',
        ], [2], '비동기 HTTP 클라이언트의 `get`이 완료될 때까지 기다리는 문법이 있는지 보세요.', '2번 줄은 `await` 없이 코루틴을 대입할 수 있습니다. 실제 비동기 클라이언트라면 `response = await client.get(...)` 형태가 필요해요.'),
        versionedShortAnswer('py-async-short', '비동기 함수 선언', '비동기 함수를 선언할 때 `def` 앞에 붙이는 키워드를 입력하세요.', ['async'], '함수 선언을 비동기로 만드는 짧은 키워드예요.', '`async def`로 선언한 함수는 코루틴 함수가 됩니다.', 'case-sensitive'),
      ], '실전'),
    lesson('py-data-capstone', 'python-practice', '작은 학습 기록 요약 만들기', '16분', '입력 검증, 집계, 예외 경계를 조합해 읽기 쉬운 데이터 처리 함수를 설계해요.',
      '실전 문제에서는 정답 하나보다 데이터의 모양과 실패 방식을 먼저 정하는 일이 중요합니다. 이 단원은 목록을 순회해 완료 항목을 세고, 잘못된 입력은 호출한 쪽이 알아차릴 수 있게 명확히 다루는 연습입니다.',
      ['각 기록에서 필요한 키를 읽기 전에 입력 형태를 확인해요.', '완료 여부처럼 참·거짓인 값은 조건문으로 집계할 수 있어요.', '문제를 고칠 수 있는 호출자에게는 의미 있는 예외를 전달하는 편이 좋아요.'],
      'def completed_count(records: list[dict[str, object]]) -> int:\n    return sum(1 for record in records if record.get("done") is True)', [
        choice('py-capstone-choice-v2', '완료 항목만 세기', '`records`의 각 딕셔너리에서 `done`이 `True`인 항목 하나당 1을 더하는 조건은 무엇인가요?', [
          ['record.get("done") is True', '값이 실제 `True`인 기록만 세므로 조건의 의도가 분명해요.'],
          ['record["done"] = True', '`=`는 비교가 아니라 대입이므로 조건식으로 쓸 수 없어요.'],
          ['record.get("done") is False', '`False`인 기록만 고르므로 완료된 항목을 세려는 조건과 반대예요.'],
        ], 0, '완료 여부가 정확히 True인지 확인하는 표현식을 찾으세요.', '`record.get("done") is True`는 키가 없을 때도 예외 없이 거짓이 되어 완료된 항목만 셉니다.'),
        locateError('py-capstone-locate', '완료율 계산 오류 찾기', '완료율을 백분율로 계산하려는데, 완료 수가 아니라 전체 수가 분자에 들어갔습니다. 잘못된 줄을 고르세요.', 'Python', [
          'completed = 3', 'total = 5', 'rate = total / total * 100', 'print(rate)',
        ], [3], '완료율의 분자와 분모가 각각 무엇인지 생각해 보세요.', '3번 줄은 전체 수를 분자와 분모에 모두 사용해 항상 100이 됩니다. `completed / total * 100`이어야 해요.'),
        shortAnswer('py-capstone-short', '완료율 계산', '`completed = 3`, `total = 5`일 때 `completed / total * 100`의 결과를 입력하세요.', ['60', '60.0'], '먼저 3을 5로 나눈 뒤 100을 곱하세요.', '3 / 5는 0.6이고, 여기에 100을 곱하면 완료율은 60입니다.'),
      ], '실전'),
  ],
  extraExercises: {
    'py-variables': [
      choice('py-variables-type-choice', '문자열과 숫자 더하기', '`"3" + "4"`의 결과는 무엇인가요?', [
        ['"34"', '문자열끼리의 `+`는 두 문자열을 이어 붙여요.'], ['7', '숫자 덧셈은 문자열을 정수로 변환한 뒤에만 가능해요.'], ['오류', '두 피연산자가 모두 문자열이므로 오류가 아니에요.'],
      ], 0, '따옴표가 붙은 값의 자료형을 확인하세요.', '따옴표 안의 값은 문자열이므로 `+`는 연결 연산입니다.'),
      shortAnswer('py-variables-short', '`//`의 몫', '`17 // 5`의 결과를 숫자로 입력하세요.', ['3'], '결과에서 소수 부분을 자르는 연산이 아니라, 몫의 바닥값을 구해요.', '`//`는 바닥 나눗셈이에요. 양수인 17을 5로 나눈 몫의 바닥값은 3이며, 음수에서는 0 방향이 아니라 음의 무한대 방향으로 내림해요.'),
    ],
    'py-conditions': [
      locateError('py-conditions-locate', '들여쓰기 범위 찾기', '`else`의 들여쓰기가 잘못되어 문법 오류가 납니다. 원인이 되는 줄을 고르세요.', 'Python', [
        'if logged_in:', '    print("환영")', '    else:', '        print("로그인 필요")',
      ], [3], '같은 조건의 `if`와 `else`는 같은 깊이에 있어야 해요.', '3번 줄의 `else`는 바깥 `if`와 같은 깊이여야 합니다. 앞의 공백을 없애 `else:`로 고치면 됩니다.'),
      shortAnswer('py-conditions-short', '거짓 분기 결과', '`age = 17`일 때 `age >= 18` 조건은 거짓이에요. 거짓 분기에서 `result = "미성년"`을 실행하면 result에 어떤 값이 들어가나요?', ['미성년'], '17이 18 이상인지 먼저 판정하세요.', '조건이 거짓이므로 거짓 분기의 대입이 실행되어 result에는 문자열 미성년이 저장됩니다.'),
    ],
    'py-loops': [
      choice('py-loops-range-choice', '반복 횟수 세기', '`for number in range(2, 5):`가 순회하는 숫자 목록은 무엇인가요?', [
        ['2, 3, 4', '시작값 2는 결과에 포함되지만, 종료 경계인 5는 포함되지 않아요.'], ['2, 3, 4, 5', '두 번째 인자 5는 종료 경계라 순회 결과에서 제외돼요.'], ['1, 2, 3, 4', '`range(2, 5)`는 2부터 시작하므로 1은 순회 결과에 포함되지 않아요.'],
      ], 0, 'range의 두 번째 숫자가 포함되는지 생각해 보세요.', '`range(2, 5)`는 2부터 시작해 5 바로 전인 4까지 만듭니다.'),
      shortAnswer('py-loops-short', '누적 결과', '`total = 0`에서 `for value in [1, 2, 3]: total += value` 뒤의 `total`을 숫자로 입력하세요.', ['6'], '목록의 값을 차례대로 더해 보세요.', '1, 2, 3을 더하면 누적값은 6입니다.'),
    ],
    'py-functions': [
      choice('py-functions-parameter-choice', '기본 매개변수', '`def greet(name="손님"):`일 때 `greet()`가 함수 안에서 사용하는 `name` 값은 무엇인가요?', [
          ['"손님"', '`name` 인수를 생략했으므로 선언에 둔 기본값인 손님을 사용해요.'], ['None', '기본값이 있으므로 `None`이 자동으로 들어가지 않아요.'], ['오류', '기본값이 있어 인수 없이 호출할 수 있어요.'],
      ], 0, '호출에서 인수를 빼면 함수 선언의 어떤 값이 쓰이는지 보세요.', '기본 매개변수는 호출자가 그 인수를 생략했을 때 사용됩니다.'),
      outputTrace('py-functions-short', '반환 없는 함수', '`def show(): print("hi")`를 호출했을 때 반환값을 입력하세요.', ['None'], '`print`의 출력과 함수의 반환값은 달라요.', '`return`이 없는 Python 함수는 기본적으로 `None`을 반환합니다.'),
    ],
    'py-lists': [
      choice('py-lists-index-choice', '마지막 원소', '`items = ["a", "b", "c"]`에서 마지막 원소를 얻는 표현식은 무엇인가요?', [
          ['items[-1]', '음수 인덱스 -1은 마지막 원소를 가리켜요.'], ['items[3]', '길이가 3인 리스트의 마지막 유효 인덱스는 2예요.'], ['items[0]', '인덱스 0은 리스트의 첫 번째 항목인 a를 선택해요.'],
      ], 0, 'Python의 음수 인덱스 규칙을 떠올려 보세요.', '`items[-1]`은 리스트의 마지막 원소를 선택합니다.'),
      locateError('py-lists-locate', '원본을 바꾸지 않는 줄 찾기', '원래 목록에 항목을 추가하려 했지만 목록이 바뀌지 않습니다. 원인이 되는 줄을 고르세요.', 'Python', [
        'tasks = ["읽기"]', 'tasks + ["복습"]', 'print(tasks)',
      ], [2], '새 목록을 만드는 연산의 결과를 어디에 저장했는지 확인하세요.', '2번 줄의 `+`는 새 목록을 만들지만 저장하지 않습니다. `tasks.append("복습")` 또는 `tasks = tasks + ["복습"]`가 필요해요.'),
    ],
  },
};

export { pythonExpansion };
