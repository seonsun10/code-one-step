import { choice, locateError, outputTrace, repairCode, studySession } from './curriculum-tools.js';

const concept = (id, title, prompt, answer, distractors, hint, explanation) => choice(
  id, title, prompt,
  [[answer, explanation], ...distractors.map(([text, feedback]) => [text, feedback])],
  0, hint, explanation,
);

const trace = (id, title, code, answer, hint, explanation) => outputTrace(
  id, title, `아래 코드를 직접 추적해 결과를 입력하세요.\n\n${code}`,
  [answer], hint, explanation,
);

const repair = ({ id, title, starterCode, prompt, solutionPatterns, requirements, constraints, examples, tests, hint, explanation }) => repairCode({
  id, title: `${title} 함수 수정`, prompt: `${prompt}\n\n\`${starterCode}\``, language: 'Python', starterCode, solutionPatterns,
  acceptanceCriteria: { requirements, constraints, examples, tests },
  gradingNote: '실행 결과를 채점하는 문항은 아닙니다. 고정된 함수·메서드 구조를 검사하며, 안내된 입력·기대 결과로 답을 직접 실행해 확인하세요.',
  hint, explanation,
});

const completionRatePattern = String.raw`^def\s+completion_rate\s*\(\s*done\s*,\s*total\s*\)\s*:\s*\n[ \t]+if\s+total\s*==\s*0\s*:\s*\n[ \t]+return\s+0\s*\n[ \t]+return\s+done\s*/\s*total\s*\*\s*100\s*$`;
const submitCpuPattern = String.raw`^def\s+submit_cpu\s*\(\s*executor\s*,\s*calculate\s*,\s*limit\s*\)\s*:\s*\n[ \t]+return\s+executor\.submit\s*\(\s*calculate\s*,\s*limit\s*\)\s*$`;
const studySessionPattern = String.raw`^class\s+StudySession\s*:\s*\n[ \t]+def\s+__init__\s*\(\s*self\s*,\s*clock\s*\)\s*:\s*\n[ \t]+self\.clock\s*=\s*clock\s*\n[ \t]+def\s+label\s*\(\s*self\s*\)\s*:\s*\n[ \t]+return\s+self\.clock\.now\s*\(\s*\)\s*$`;

export const reviewedPythonWeeks10to12 = {
  10: {
    objective: '인스턴스의 초기 상태와 메서드 계약을 정의하고, 표현과 조합을 통해 책임을 분명히 해요.',
    intro: '클래스는 데이터를 묶는 문법만이 아니라 상태의 소유자와 동작의 경계를 정합니다. `__init__`에서 인스턴스 상태를 만들고, 클래스 속성과 인스턴스 속성을 구분하고, 표현과 협력 객체를 읽는 순서로 확장합니다.',
    points: ['`__init__`은 새 인스턴스가 만들어질 때 호출되어 초기 상태를 설정해요.', '`self.name`은 인스턴스마다 저장되고 `Course.category` 같은 클래스 속성은 클래스에서 공유해요.', '인스턴스 메서드는 첫 매개변수 `self`로 현재 인스턴스에 접근해요. 반환 타입 힌트는 의도를 나타내며 실행 시 자동으로 강제하지 않아요.', '`__repr__`은 디버깅에 쓸 명확한 문자열을 반환해야 해요.', '필요한 동작을 다른 객체에 위임하는 조합은 관계없는 상속 계층을 만드는 것보다 좁은 의존성을 표현할 수 있어요.'],
    example: 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n\n    def label(self):\n        return self.clock.now()',
    legacyExerciseDays: [3, 1, 3],
    sessions: [
      studySession(1, '__init__', '객체 생성 시 전달된 이름을 인스턴스 상태에 저장해요.', '`__init__`은 인스턴스가 만들어질 때 초기 필드를 설정합니다. 특수 메서드 이름의 양쪽 밑줄 수를 정확히 쓰고, 필드가 클래스 전체가 아니라 현재 객체에 저장되는지 확인하세요.', 'class Student:\n    def __init__(self, name):\n        self.name = name\n\nstudent = Student("민아")\nprint(student.name)', [
        concept('py-w10-d1-choice-v2', '초기화 메서드와 상태', '`Student("민아")`를 만들 때 name을 인스턴스에 보관하는 올바른 초기화 메서드는 무엇인가요?', '`def __init__(self, name): self.name = name`', [['`def init(self, name): self.name = name`', '자동 호출되는 특수 메서드는 이름 양쪽에 밑줄 두 개가 있어야 합니다.'], ['`def __init__(name): self.name = name`', '인스턴스 메서드의 첫 매개변수로 현재 객체를 받아야 합니다.']], '특수 메서드 이름과 인스턴스를 가리키는 첫 매개변수를 확인하세요.', '객체 생성 때 Python이 찾는 이름은 `__init__`이며 첫 인자 `self`가 새 인스턴스입니다.'),
        trace('py-w10-d1-trace-v2', '초기 상태 읽기', 'class Student:\n    def __init__(self, name):\n        self.name = name\n\nstudent = Student("민아")\nprint(student.name)', '민아', '생성자에 전달한 문자열이 어느 인스턴스 속성에 저장되는지 따라가세요.', '생성 시 name 매개변수의 값이 `student.name`에 저장되어 출력됩니다.'),
      ]),
      studySession(2, '인스턴스와 클래스 속성', '공유 속성과 인스턴스별 속성의 값을 나눠 읽어요.', '클래스 본문에 둔 속성은 인스턴스에서 같은 값을 읽을 수 있습니다. 인스턴스에 대입하면 그 인스턴스에 별도 속성이 만들어져 다른 인스턴스나 클래스의 원래 속성은 그대로 남을 수 있어요.', 'class Course:\n    category = "Python"\n\n    def __init__(self, title):\n        self.title = title\n\nfirst = Course("기초")\nsecond = Course("실전")\nfirst.title = "함수"\nprint(Course.category, first.title, second.title)', [
        concept('py-w10-d2-choice-v2', '속성 소유자 구분', '`first.title = "함수"` 실행 뒤 `second.title`이 계속 `실전`인 이유는 무엇인가요?', '`title`은 각 인스턴스에 따로 저장되기 때문이에요.', [['모든 속성 대입이 Course.category를 바꾸기 때문이에요.', '대입 대상은 category가 아니라 `first.title`이며 두 속성의 소유 위치도 다릅니다.'], ['first와 second는 생성 뒤 같은 객체가 되기 때문이에요.', '각 생성 호출은 서로 다른 Course 인스턴스를 만듭니다.']], '속성을 클래스 본문에 선언했는지, 생성자에서 self에 넣었는지 보세요.', 'category는 클래스 속성이지만 title은 `self.title`이므로 인스턴스마다 별도로 저장됩니다.'),
        trace('py-w10-d2-trace-v2', '공유 값과 개별 값 출력', 'class Course:\n    category = "Python"\n\n    def __init__(self, title):\n        self.title = title\n\nfirst = Course("기초")\nsecond = Course("실전")\nfirst.title = "함수"\nprint(Course.category, first.title, second.title)', 'Python 함수 실전', 'category는 클래스에, title은 생성된 두 객체에 각각 저장됩니다.', '출력은 클래스의 Python, 수정된 first 제목 함수, 그대로인 second 제목 실전 순입니다.'),
        locateError('py-w10-d2-locate-v2', '인스턴스 값을 클래스에 잘못 누적', '새 인스턴스 수를 공유 클래스 값에 더하려 합니다. 클래스 속성을 바꾸지 않는 줄을 고르세요.', 'Python', ['class Learner:', '    active = 0', '    def __init__(self):', '        self.active += 1', 'first = Learner()', 'second = Learner()', 'print(Learner.active, first.active, second.active)'], [4], 'self.active를 처음 읽을 때 어떤 인스턴스 속성이 만들어지는지 추적하세요.', '4번 줄은 클래스의 0을 읽지만 `+=` 결과를 현재 인스턴스에 저장합니다. 두 인스턴스를 만든 뒤 출력하면 공유값은 0이고 각 인스턴스 값은 1이라 결함이 드러납니다. 공유 클래스 수를 갱신하려는 목적이라면 `Learner.active += 1`처럼 소유자를 명시해야 합니다.'),
      ]),
      studySession(3, '메서드와 반환 타입', 'self로 상태를 갱신하고 반환 타입 힌트가 있는 메서드 결과를 사용해요.', '메서드는 현재 객체의 상태를 바꾸거나 계산 결과를 돌려줄 수 있습니다. `self`를 빠뜨리면 인스턴스에서 호출할 때 전달 인자가 맞지 않고, 반환 타입 힌트 `-> int`는 의도와 도구 점검을 돕지만 런타임 검사를 대신하지 않습니다.', 'class Counter:\n    def __init__(self, value=0):\n        self.value = value\n\n    def increment(self) -> int:\n        self.value += 1\n        return self.value\n\ncounter = Counter(2)\nprint(counter.increment())', [
        trace('py-w10-d3-trace-v2', '상태 변경 후 반환', 'class Counter:\n    def __init__(self, value=0):\n        self.value = value\n\n    def increment(self) -> int:\n        self.value += 1\n        return self.value\n\ncounter = Counter(2)\nprint(counter.increment())', '3', '초기 상태 2에서 하나를 더한 뒤 같은 값을 반환합니다.', '메서드 호출로 value가 3이 되고 그 정수가 반환되어 출력됩니다.'),
      ]),
      studySession(4, '__repr__', '객체를 디버깅할 때 읽을 수 있는 문자열 표현을 제공해요.', '`repr(object)`는 객체를 개발자가 살펴볼 때 쓸 표현을 요청합니다. `__repr__`은 문자열을 반환해야 하며, 단순 출력만 하고 반환하지 않으면 `None`을 반환해 규약과 맞지 않습니다.', 'class Course:\n    def __init__(self, title, hours):\n        self.title = title\n        self.hours = hours\n\n    def __repr__(self):\n        return f"Course(title={self.title!r}, hours={self.hours})"\n\nprint(repr(Course("Python", 12)))', [
        concept('py-w10-d4-choice-v2', 'repr의 반환 계약', '`repr(Course("Python", 12))`에서 구현된 `__repr__`이 돌려줘야 하는 것은 무엇인가요?', '객체를 나타내는 문자열이에요.', [['print가 화면에 표시한 뒤 반환하는 None이에요.', '`__repr__` 자체가 문자열을 반환해야 하며 화면 출력은 그 계약을 대신하지 않습니다.'], ['정수형 객체 식별자예요.', '객체 식별값은 표현의 선택 사항일 수 있으나 repr 메서드의 반환 자료형은 문자열입니다.']], '`__repr__`의 `return`이 어떤 자료형을 전달하는지 확인하세요.', 'repr 프로토콜은 문자열 결과를 요구하며 `repr` 내장 함수가 그 표현을 사용합니다.'),
        trace('py-w10-d4-trace-v2', '객체 표현 결과', 'class Course:\n    def __init__(self, title, hours):\n        self.title = title\n        self.hours = hours\n\n    def __repr__(self):\n        return f"Course(title={self.title!r}, hours={self.hours})"\n\nprint(repr(Course("Python", 12)))', "Course(title='Python', hours=12)", '`!r`가 title을 repr 형식의 따옴표와 함께 표시하는지 확인하세요.', 'repr 표현에는 문자열 제목이 따옴표와 함께 들어가고 시간은 숫자로 표시됩니다.'),
        locateError('py-w10-d4-locate-v2', '문자열을 반환하지 않는 repr', '객체의 repr을 문자열로 제공하려 합니다. 계약을 깨뜨리는 줄을 고르세요.', 'Python', ['class Course:', '    def __init__(self, title):', '        self.title = title', '    def __repr__(self):', '        print(self.title)', 'print(repr(Course("Python")))'], [5], '`print`가 값을 반환하는지, `__repr__`이 반환해야 하는 것이 무엇인지 확인하세요.', '5번 줄은 문자열을 화면에 출력할 뿐 return하지 않아 `__repr__`이 None을 돌려줍니다. 마지막 줄에서 `repr()`을 요청하면 문자열이 아닌 None을 받은 사실이 TypeError로 드러납니다. 표현 메서드에서 문자열을 `return`해야 합니다.'),
      ]),
      studySession(5, '상속보다 조합', '필요한 시간 제공자 객체를 주입받아 동작을 위임해요.', 'StudySession이 시계 자체의 종류나 내부 구현을 상속할 필요는 없습니다. 필요한 `now()` 동작을 가진 객체를 전달받고 위임하면 테스트에서 가짜 시계를 주입할 수 있으며 의존성이 좁고 분명해집니다.', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n\n    def label(self):\n        return self.clock.now()\n\nclass FixedClock:\n    def now(self):\n        return "09:00"\n\nprint(StudySession(FixedClock()).label())', [
        concept('py-w10-d5-choice-v2', '협력 객체에 위임', 'StudySession이 전달받은 시계의 시간을 사용하는 방법은 무엇인가요?', '`self.clock.now()`를 호출해요.', [['StudySession이 Clock을 상속한 다음 직접 시스템 시간을 읽어요.', '문제의 핵심은 구체 구현을 상속하기보다 주입받은 시계 객체에 필요한 동작을 위임하는 것입니다.'], ['생성자에서 clock을 저장하지 않고 전역 변수로 찾어요.', '전역 상태는 테스트 대체를 어렵게 하고 의존성을 숨깁니다.']], '생성자에서 어떤 객체를 보관했고 label이 누구에게 요청해야 하는지 따라가세요.', 'StudySession은 전달받은 clock 참조에 `now()`를 요청하므로 구체 시계와 독립적으로 동작합니다.'),
        trace('py-w10-d5-trace-v2', '고정 시계 값 위임', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n\n    def label(self):\n        return self.clock.now()\n\nclass FixedClock:\n    def now(self):\n        return "09:00"\n\nprint(StudySession(FixedClock()).label())', '09:00', 'FixedClock 객체의 now가 반환한 값을 StudySession.label도 반환합니다.', 'label이 clock.now()의 결과를 그대로 전달해 09:00이 출력됩니다.'),
        repair({
          id: 'py-w10-d5-repair-v2', title: '상속보다 조합',
          starterCode: 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return "now"',
          prompt: 'StudySession은 clock 객체를 상속하거나 전역 시계에 의존하지 않습니다. 생성자에서 전달받은 객체의 now() 결과를 label()에서 반환하세요.',
          solutionPatterns: [studySessionPattern],
          requirements: ['생성자에서 전달받은 clock을 인스턴스에 보관해요.', 'label이 clock.now()의 결과를 반환해요.'],
          constraints: ['Clock을 상속하지 않아요.', '시각을 출력하거나 고정 문자열로 바꾸지 않아요.'],
          examples: [{ input: 'Clock.now() -> "09:00"', output: '09:00' }],
          tests: [{ input: 'fake clock returns "09:00"', expected: 'label() returns "09:00"' }, { input: 'fake clock returns "14:30"', expected: 'label() returns "14:30"' }],
          hint: '생성자가 받은 객체를 저장한 뒤, label에서 그 객체의 now 메서드를 호출하세요.',
          explanation: '조합은 StudySession이 특정 Clock 하위 클래스가 되게 하지 않고 필요한 동작을 위임합니다. 다른 가짜 시계를 전달해 테스트할 수 있고 반환값은 그대로 보존됩니다.',
        }),
      ]),
    ],
  },
  11: {
    objective: '타입 힌트와 None 가능성을 표현하고, 코루틴 대기와 CPU 작업 위임을 구분해요.',
    intro: '타입 힌트는 호출 계약을 독자와 도구에 알리며 Python 실행기가 자동으로 강제하지 않습니다. 비동기 함수는 코루틴을 만들고, `await`로 기다리는 I/O와 별도의 프로세스에 맡기는 CPU 계산을 같은 기능처럼 섞지 않도록 합니다.',
    points: ['`list[int] -> int` 같은 표기는 함수가 기대하는 입력과 반환을 설명하며 자체로 실행 중 타입 검사는 하지 않아요.', '`Optional[str]`은 문자열 또는 None 가능성을 표현하고, None 여부는 `is None`으로 검사해요.', '`async def` 함수를 호출하면 아직 실행 결과가 아니라 코루틴 객체를 얻어요.', '`await`와 `asyncio.gather`는 기다리는 비동기 작업을 함께 조율하며 CPU 작업을 자동 병렬화하지 않아요.', '`ProcessPoolExecutor.submit`은 실행 결과 대신 Future를 돌려줘요. Windows에서 실행할 예제는 최상위 함수와 main guard를 함께 써요.'],
    example: 'from concurrent.futures import ProcessPoolExecutor\n\ndef square(value):\n    return value * value\n\ndef main():\n    with ProcessPoolExecutor(max_workers=1) as executor:\n        future = executor.submit(square, 4)\n        print(future.result())\n\nif __name__ == "__main__":\n    main()',
    legacyExerciseDays: [4, 4, 3],
    sessions: [
      studySession(1, '타입 힌트 읽기', '함수 입력과 반환 자료형의 의도를 표기하고 도구의 역할을 구분해요.', 'Python 타입 힌트는 정적 분석기와 편집기, 코드를 읽는 사람에게 기대하는 자료형을 설명합니다. 함수를 호출할 때 모든 실제 값을 자동 검사하는 런타임 계약으로 이해하면 안 됩니다.', 'def total(values: list[int]) -> int:\n    return sum(values)\n\nprint(total([2, 3]))', [
        concept('py-w11-d1-choice-v2', '타입 힌트가 하는 일', '`def total(values: list[int]) -> int:`의 의미로 맞는 설명은 무엇인가요?', 'list[int] 입력과 int 반환 의도를 표시하지만 실행 때 자동으로 강제하지는 않아요.', [['Python 인터프리터가 모든 인자의 형식을 호출 때 거부해요.', '기본 Python 실행기는 타입 힌트만으로 런타임 입력 검사를 자동 추가하지 않습니다.'], ['함수의 반환값을 int로 자동 변환해요.', '반환 힌트는 변환 코드가 아니며 함수가 실제로 무엇을 반환하는지 바꾸지 않습니다.']], '표기된 자료형과 실제 런타임 동작을 분리해서 보세요.', '이 표기는 독자와 타입 검사 도구를 위한 계약 표시이며 자동 변환이나 강제 검사는 아닙니다.'),
        trace('py-w11-d1-trace-v2', '정수 목록 합계', 'def total(values: list[int]) -> int:\n    return sum(values)\n\nprint(total([2, 3]))', '5', '힌트와 별개로 함수 본문에서 sum이 어떤 값을 계산하는지 확인하세요.', '2와 3의 합계를 반환하므로 출력은 5입니다.'),
        locateError('py-w11-d1-locate-v2', '힌트와 자동 검사 혼동', '이 함수는 입력이 실제 정수 목록인지 런타임에서 확인하려고 합니다. 타입 힌트만으로 검사된다고 잘못 가정한 줄을 고르세요.', 'Python', ['def total(values: list[int]) -> int:', '    return sum(values)', 'print(total(["2", "3"]))'], [1], '주석 표기만 있는지, isinstance나 명시적 검증 코드가 실제로 있는지 확인하세요.', '1번 줄은 기대 자료형을 주석할 뿐 입력을 검증하지 않습니다. 실제 검사나 변환이 필요하면 함수 안에 별도 로직을 작성해야 합니다.'),
      ]),
      studySession(2, 'Optional 경계', 'None일 수 있는 값과 빈 문자열을 같은 값으로 취급하지 않아요.', '`Optional[str]`은 문자열 또는 None입니다. `if not name`은 None과 빈 문자열을 함께 거르지만, None만 구분하고 빈 문자열은 그대로 다뤄야 한다면 `is None` 검사를 사용합니다.', 'from typing import Optional\n\ndef display_name(name: Optional[str]) -> str:\n    if name is None:\n        return "익명"\n    return name\n\nprint(display_name(None))\nprint(repr(display_name("")))', [
        concept('py-w11-d2-choice-v2', 'None과 빈 문자열 구분', 'None일 때만 기본 이름을 쓰고 저장된 빈 문자열은 보존하려면 어떤 검사가 필요한가요?', '`name is None`', [['`if not name`', '이 조건은 빈 문자열도 거짓으로 보아 None과 함께 기본값으로 바꿉니다.'], ['`name == ""`', '빈 문자열은 검사하지만 None일 때 기본 이름으로 바꾸는 계약을 처리하지 않습니다.']], '값이 None인지, 길이가 0인 문자열인지 각각 대입해 보세요.', '`is None`은 None만 확인하므로 빈 문자열 값은 그대로 반환됩니다.'),
        trace('py-w11-d2-trace-v2', 'Optional 입력 두 경계', 'from typing import Optional\n\ndef display_name(name: Optional[str]) -> str:\n    if name is None:\n        return "익명"\n    return name\n\nprint(display_name(None))\nprint(repr(display_name("")))', '익명\n\'\'', 'None 경로는 익명이고 빈 문자열 경로는 repr로 따옴표를 표시합니다.', '두 번째 줄의 `repr("")`는 공백 없이 `\'\'`를 표시합니다. 빈 문자열을 그대로 돌려줍니다.'),
        locateError('py-w11-d2-locate-v2', '빈 문자열을 None으로 오해', '문자열이 비어 있어도 입력된 값을 보존하고 None일 때만 기본 이름을 쓰려 합니다. 조건이 잘못된 줄을 고르세요.', 'Python', ['def display_name(name):', '    if not name:', '        return "익명"', '    return name', 'print(repr(display_name(None)))', 'print(repr(display_name("")))'], [2], '빈 문자열과 None이 모두 거짓으로 평가되는지 확인하세요.', '2번 줄의 truthiness 검사는 None뿐 아니라 빈 문자열도 거릅니다. 마지막 두 출력에서 둘 다 `\'익명\'`으로 바뀌므로 빈 문자열을 보존하려면 `name is None`을 검사해야 합니다.'),
      ]),
      studySession(3, 'async def', '비동기 함수 호출이 코루틴 객체를 만들고 아직 결과를 기다리지 않는 점을 확인해요.', '`async def`로 선언한 함수를 호출하면 코루틴 객체가 생기며 본문의 실행 결과를 바로 받지 않습니다. 코루틴은 `await`하거나 이벤트 루프에 맡겨 실행해야 합니다.', 'import inspect\n\nasync def load_name():\n    return "Mina"\n\ncoroutine = load_name()\nprint(inspect.iscoroutine(coroutine))\ncoroutine.close()', [
        concept('py-w11-d3-choice-v2', '비동기 함수 호출 결과', '`async def load_name(): ...`를 그냥 `load_name()`으로 호출한 직후 얻는 값은 무엇인가요?', '실행을 기다려야 하는 코루틴 객체예요.', [['함수가 반환할 문자열이 바로 나와요.', '함수 본문을 실행해 결과를 기다리려면 await 또는 이벤트 루프가 필요합니다.'], ['자동으로 새 프로세스에서 실행된 Future예요.', '`async def`는 프로세스 작업 제출을 하지 않고 코루틴 객체를 만듭니다.']], '본문이 완료되기 전 호출 자체가 돌려주는 객체 종류를 보세요.', '비동기 함수 호출은 코루틴 객체를 돌려주며 그 객체를 await해야 본문 실행 결과를 받습니다.'),
        trace('py-w11-d3-trace-v2', '호출 결과가 코루틴인지 확인', 'import inspect\n\nasync def load_name():\n    return "Mina"\n\ncoroutine = load_name()\nprint(inspect.iscoroutine(coroutine))\ncoroutine.close()', 'True', 'async 함수 호출이 결과 문자열을 반환했는지, coroutine 검사 결과인지 확인하세요.', '함수를 await하지 않았으므로 검사 대상은 코루틴이고 `inspect.iscoroutine`은 True입니다.'),
      ]),
      studySession(4, 'await와 gather', '잠시 기다리는 작업의 완료 순서와 gather 결과의 순서를 비교해요.', '이 예제의 `asyncio.sleep`은 I/O 대기 상황을 흉내 내며 실제 네트워크 요청은 보내지 않습니다. 기다리는 시간이 다른 두 작업은 완료 순서가 다를 수 있고, `asyncio.gather`가 돌려주는 결과 목록은 전달한 순서를 유지합니다.', 'import asyncio\n\ncompleted = []\n\nasync def read_name(name, delay):\n    await asyncio.sleep(delay)\n    completed.append(name)\n    return name\n\nasync def load_pair():\n    first, second = await asyncio.gather(\n        read_name("민아", 0.03),\n        read_name("준", 0),\n    )\n    return f"완료순: {\', \'.join(completed)} / 결과순: {first}와 {second}"\n\nprint(asyncio.run(load_pair()))', [
        trace('py-w11-d4-trace-v2', '완료 순서와 결과 순서', 'import asyncio\n\ncompleted = []\n\nasync def read_name(name, delay):\n    await asyncio.sleep(delay)\n    completed.append(name)\n    return name\n\nasync def load_pair():\n    first, second = await asyncio.gather(\n        read_name("민아", 0.03),\n        read_name("준", 0),\n    )\n    return f"완료순: {\', \'.join(completed)} / 결과순: {first}와 {second}"\n\nprint(asyncio.run(load_pair()))', '완료순: 준, 민아 / 결과순: 민아와 준', '두 번째 coroutine은 기다림이 없어 먼저 끝나고, gather 결과는 전달 순서대로 first와 second에 들어갑니다.', '준이 먼저 완료되어 completed 앞에 기록되지만 gather 결과 순서는 입력 순서라 민아와 준이 반환됩니다.'),
      ]),
      studySession(5, 'CPU 작업 분리', 'CPU 함수를 프로세스 실행기에 제출하고 Future 결과를 기다려요.', '기다리는 I/O는 asyncio에서 겹쳐 처리할 수 있지만, 오래 걸리는 CPU 계산은 이벤트 루프를 막을 수 있습니다. ProcessPoolExecutor는 최상위에 정의된 호출 가능한 함수와 인자를 별도 프로세스에 제출하며 Windows에서는 프로세스 생성을 main guard 안에 둡니다. 여기서는 백만 개 수의 제곱을 더해 작업을 분리하는 구조를 보여 줍니다. 프로세스 사용이 항상 더 빠른 것은 아니므로 실제 작업 크기는 측정하고 직렬화 비용도 고려해야 합니다.', 'from concurrent.futures import ProcessPoolExecutor\n\ndef sum_squares(limit):\n    return sum(number * number for number in range(limit))\n\ndef main():\n    with ProcessPoolExecutor(max_workers=1) as executor:\n        future = executor.submit(sum_squares, 1_000_000)\n        print(future.result())\n\nif __name__ == "__main__":\n    main()', [
        concept('py-w11-d5-choice-v2', '작업 제출과 결과 받기', '`executor.submit(sum_squares, 1_000_000)`이 돌려주는 값과 계산 결과를 기다리는 방법은 무엇인가요?', 'Future를 반환하므로 `future.result()`로 완료 결과를 기다려요.', [['제곱 합인 333332833333500000을 즉시 반환해요.', 'submit은 작업을 등록하고 계산이 끝나기 전 Future를 반환합니다.'], ['코루틴을 반환해 `await`해야 해요.', 'concurrent.futures의 Future는 asyncio 코루틴과 다른 인터페이스입니다.']], '작업을 보내는 submit과 완료 값을 얻는 result를 구분하세요.', 'submit은 Future를 반환하고, Future.result()는 완료될 때까지 기다려 계산 결과를 꺼냅니다.'),
        trace('py-w11-d5-trace-v3', '백만 개 제곱 합 결과', 'from concurrent.futures import ProcessPoolExecutor\n\ndef sum_squares(limit):\n    return sum(number * number for number in range(limit))\n\ndef main():\n    with ProcessPoolExecutor(max_workers=1) as executor:\n        future = executor.submit(sum_squares, 1_000_000)\n        print(future.result())\n\nif __name__ == "__main__":\n    main()', '333332833333500000', 'sum_squares는 0부터 999,999까지 각 수의 제곱을 더합니다.', 'ProcessPoolExecutor가 제출한 sum_squares(1_000_000)의 결과를 Future.result()가 받아 출력합니다.'),
        repair({
          id: 'py-w11-d5-repair-v2', title: 'CPU 작업 분리',
          starterCode: 'def submit_cpu(executor, calculate, limit):\n    return calculate(limit)',
          prompt: 'calculate(limit)를 현재 함수에서 직접 실행하지 말고 executor에 제출하고 Future를 반환하세요. Windows 프로세스 풀을 사용할 때 호출부는 `if __name__ == "__main__":` 아래에 두어야 합니다.',
          solutionPatterns: [submitCpuPattern],
          requirements: ['executor.submit에 함수와 인자를 넘겨요.', '호출자에게 반환된 Future를 그대로 돌려줘요.'],
          constraints: ['calculate를 현재 함수에서 직접 호출하지 않아요.', 'Future.result()를 이 함수 안에서 기다리지 않아요.'],
          examples: [{ input: 'sum_squares(5) -> 30', output: '반환 Future의 result() -> 30' }],
          tests: [{ input: 'RecordingExecutor와 sum_squares, 5', expected: 'sum_squares와 5를 submit에 전달하고 반환된 Future 객체 유지' }, { input: 'ProcessPoolExecutor와 최상위 sum_squares', expected: 'Future.result()가 30' }],
          hint: '계산 함수를 실행하지 말고 executor.submit에 함수와 인자를 전달한 뒤 Future를 반환하세요.',
          explanation: 'executor 제출은 계산 함수와 인자를 별도 실행 경계에 넘겨 Future를 돌려줍니다. 실제 결과가 필요할 때 result()를 기다립니다. 작은 계산은 프로세스 시작과 직렬화 비용이 더 클 수 있으므로 작업 크기를 측정해야 합니다.',
        }),
      ]),
    ],
  },
  12: {
    objective: '기록의 형태를 검증하고 집계·정렬·빈 입력 경계를 처리해 완료율을 계산해요.',
    intro: '작은 데이터 요약도 입력 구조, 누락 필드, 정렬 기준, 빈 목록의 의미를 먼저 정해야 합니다. 각 날짜에 검증과 계산을 하나씩 더해 완성된 완료율 함수로 연결합니다.',
    points: ['외부에서 온 record는 딕셔너리인지와 필요한 필드의 자료형을 조회 전에 확인해요.', '완료 상태를 셀 때 키 누락의 기본값과 참인 문자열을 실제 Boolean True와 구분해요.', '정렬은 비교 기준을 key 함수로 드러내고 동률에서 안정된 입력 순서를 확인해요.', '빈 목록에서 합은 0이지만 평균은 분모가 0이므로 별도 계약이 필요해요.', '완료율은 전체가 0일 때를 먼저 정하고, 완료 수를 전체 수로 나눠 백분율로 바꿔요.'],
    example: 'def completion_rate(done, total):\n    if total == 0:\n        return 0\n    return done / total * 100\n\nprint(completion_rate(3, 5))\nprint(completion_rate(0, 0))',
    legacyExerciseDays: [2, 5, 5],
    sessions: [
      studySession(1, '입력 형태 확인', '목록 안 각 항목의 형태와 필드 자료형을 확인한 뒤 처리해요.', '외부 기록은 예상한 모양이라는 보장이 없습니다. 먼저 목록의 각 원소가 딕셔너리인지 확인하고, 필수 필드의 형식도 검사해야 뒤의 집계 코드가 문자열이나 None을 참값으로 오해하지 않습니다.', 'records = [{"done": True}, {"done": "yes"}, None]\nvalid = [isinstance(record, dict) and isinstance(record.get("done"), bool) for record in records]\nprint(valid)', [
        concept('py-w12-d1-choice-v2', '입력 레코드 검증', '기록 안의 done을 Boolean 집계에 넣기 전에 확인할 조합으로 가장 안전한 것은 무엇인가요?', '항목이 dict인지 확인하고 `done` 값이 bool인지 검사해요.', [['`record.get("done")`의 참거짓만 바로 사용해요.', '문자열 "no"도 참으로 평가될 수 있어 Boolean 완료 의미와 달라집니다.'], ['완료 필드가 있는지 확인하지 않고 `record["done"]`을 읽어요.', '필드가 누락되면 KeyError가 나고 자료형도 확인하지 않습니다.']], '원소의 바깥 자료형과 안쪽 필드의 자료형을 각각 확인하세요.', 'dict 검사 후 done의 자료형이 bool인지 확인해야 누락값이나 문자열을 완료 상태로 잘못 세지 않습니다.'),
        trace('py-w12-d1-trace-v2', '자료형 검증 결과', 'records = [{"done": True}, {"done": "yes"}, None]\nvalid = [isinstance(record, dict) and isinstance(record.get("done"), bool) for record in records]\nprint(valid)', '[True, False, False]', '첫 항목은 Boolean, 둘째는 문자열, 셋째는 딕셔너리가 아닙니다.', '첫 record만 형태와 필드 형식을 모두 만족하므로 True이고 나머지는 False입니다.'),
        locateError('py-w12-d1-locate-v2', '검증 전에 키를 읽는 줄', '입력에 None 또는 done 키가 빠진 딕셔너리가 포함될 수 있습니다. 그 전제를 깨는 줄을 고르세요.', 'Python', ['records = [{"done": True}, None, {}]', 'completed = 0', 'for record in records:', '    if record["done"]:', '        completed += 1', 'print(completed)'], [4], '현재 원소 형태와 키 존재 여부를 확인하기 전에 대괄호 키 조회를 하는지 보세요.', '4번 줄은 record가 None이거나 done 키가 없을 때 실패합니다. 원소와 필수 키를 먼저 검증하거나 안전한 조회 정책을 정해야 합니다.'),
      ]),
      studySession(2, '필터와 집계', '실제 Boolean True인 항목만 골라 완료 수를 세어요.', '기록이 유효하다는 전제에서 `get("done") is True`는 정확히 True인 항목만 집계합니다. truthy/falsy 판정이나 키 대입과 비교를 혼동하지 않고, 누락 키는 완료로 세지 않는 정책을 읽습니다.', 'records = [{"done": True}, {"done": "yes"}, {}, {"done": False}]\ncompleted = sum(1 for record in records if record.get("done") is True)\nprint(completed)', [
        trace('py-w12-d2-trace-v2', '완료 항목 수 세기', 'records = [{"done": True}, {"done": "yes"}, {}, {"done": False}]\ncompleted = sum(1 for record in records if record.get("done") is True)\nprint(completed)', '1', '조건이 정확히 True인 항목은 첫 record 하나입니다.', '문자열, 누락, False는 조건을 통과하지 않아 완료 수는 1입니다.'),
        locateError('py-w12-d2-locate-v2', '대입을 조건식에 사용', '완료된 항목만 집계하는 코드에서 비교 대신 상태를 바꾸는 줄을 고르세요.', 'Python', ['completed = 0', 'for record in records:', '    if record["done"] = True:', '        completed += 1'], [3], '조건의 등호가 값을 비교하는지 변수에 대입하는지 확인하세요.', '3번 줄의 단일 `=`는 조건식 비교가 아닌 대입 문법이며 Python의 if 조건에 사용할 수 없습니다. `is True` 또는 `== True`로 비교해야 합니다.'),
      ]),
      studySession(3, '정렬 기준', 'key 함수로 정렬 기준을 명시하고 동률의 입력 순서를 살펴봐요.', '`sorted`는 입력을 그대로 두고 새 목록을 반환합니다. key 함수가 만드는 값이 같으면 Python의 정렬은 안정적이므로 원래 순서가 유지됩니다. 여기서는 학습 시간 오름차순을 명시합니다.', 'records = [{"title": "읽기", "minutes": 20}, {"title": "복습", "minutes": 10}, {"title": "퀴즈", "minutes": 10}]\nordered = sorted(records, key=lambda record: record["minutes"])\nprint([record["title"] for record in ordered])', [
        concept('py-w12-d3-choice-v2', '정렬 기준 선택', '기록을 minutes 오름차순으로 정렬하되 원본 순서를 유지하려면 무엇을 사용하나요?', '`sorted(records, key=lambda record: record["minutes"])`', [['`records.sort(key=...)`', 'sort는 원본 목록을 제자리에서 바꿉니다.'], ['`sorted(records)`', '딕셔너리 목록에는 정렬 기준이 자동으로 결정되지 않아 명시적 key가 필요합니다.']], '새 정렬 결과를 원하는지 원본 변경을 원하는지와 비교할 필드를 확인하세요.', 'sorted와 key를 쓰면 minutes를 기준으로 한 새 목록이 만들어지고 입력은 보존됩니다.'),
        trace('py-w12-d3-trace-v2', '동률 포함 정렬 순서', 'records = [{"title": "읽기", "minutes": 20}, {"title": "복습", "minutes": 10}, {"title": "퀴즈", "minutes": 10}]\nordered = sorted(records, key=lambda record: record["minutes"])\nprint([record["title"] for record in ordered])', "['복습', '퀴즈', '읽기']", '10분짜리 두 항목의 상대 순서는 원래 목록의 순서를 따릅니다.', '복습과 퀴즈가 같은 key를 가져 입력 순서대로 나오고, 20분 읽기가 마지막입니다.'),
        locateError('py-w12-d3-locate-v2', '원본을 바꾸는 정렬 메서드', '정렬된 새 목록을 반환해 원래 순서를 보존하려 합니다. 기대와 다른 호출을 고르세요.', 'Python', ['records = [{"title": "읽기", "minutes": 20}, {"title": "복습", "minutes": 10}, {"title": "퀴즈", "minutes": 10}]', 'ordered = records.sort(key=lambda row: row["minutes"])', 'print([row["title"] for row in records], ordered)'], [2], '`list.sort()`가 새 목록을 반환하는지 원본에서 정렬하는지 확인하세요.', '2번 줄의 sort는 원본을 제자리에서 정렬하고 None을 반환합니다. 마지막 줄은 원본이 정렬되어도 `ordered`가 None임을 보여요. 원본을 보존하며 새 결과가 필요하면 sorted를 사용하세요.'),
      ]),
      studySession(4, '빈 데이터', '빈 목록 합계와 평균을 나누고 평균의 계약을 명시해요.', '`sum([])`는 0이고 항목 수는 0이지만 평균은 0으로 나눌 수 없습니다. 데이터가 없을 때 None을 돌려줄지 안내 문구를 낼지 문제 계약에서 분명히 정하고 합계 결과와 혼동하지 마세요.', 'scores = []\ntotal = sum(scores)\ncount = len(scores)\naverage = total / count if count else None\nprint(total, count)\nprint(average)', [
        concept('py-w12-d4-choice-v2', '빈 목록 평균 경계', '평균을 계산할 때 목록이 비어 있으면 나누기 전에 무엇을 해야 하나요?', '항목 수가 0인지 확인하고 계약에 정한 빈 결과를 반환해요.', [['합계 0을 항목 수 0으로 나눠요.', '0으로 나누기는 ZeroDivisionError를 발생시킵니다.'], ['빈 목록도 평균은 무조건 0이라고 가정해요.', '0은 문제에서 정할 수 있는 정책이지 수학적 평균 계산의 자동 결과가 아닙니다.']], '분모 len(scores)가 빈 목록에서 얼마가 되는지 먼저 구하세요.', '분모가 0일 때 별도 분기하지 않으면 나눗셈이 실패하므로 빈 결과 계약을 먼저 적용해야 합니다.'),
        trace('py-w12-d4-trace-v2', '합계·개수·평균 출력', 'scores = []\ntotal = sum(scores)\ncount = len(scores)\naverage = total / count if count else None\nprint(total, count)\nprint(average)', '0 0\nNone', '빈 sum은 0, len은 0이며 조건식은 None 분기를 선택합니다.', '첫 출력은 합계와 개수 0 0이고, 평균은 분모가 0이라 None으로 정합니다.'),
        locateError('py-w12-d4-locate-v2', '빈 데이터 나누기 오류', '빈 목록에서도 예외 없이 None을 반환하려 합니다. 0으로 나누게 하는 줄을 고르세요.', 'Python', ['scores = []', 'total = sum(scores)', 'average = total / len(scores)', 'print(average)'], [3], '빈 입력일 때 len(scores) 값이 분모로 사용되는지 보세요.', '3번 줄은 빈 목록의 길이 0으로 나누므로 ZeroDivisionError가 납니다. 계산 전에 빈 입력을 처리해야 합니다.'),
      ]),
      studySession(5, '완료율 반환', '전체 기록이 0일 때와 일반 입력의 완료율을 같은 함수 계약으로 처리해요.', '완료율은 `done / total * 100`이며 total이 0이면 계산 전에 기본 결과를 정해야 합니다. 완료 기록 수를 분자에 두고, 함수는 print가 아니라 호출자가 다시 사용할 수 있는 값을 반환합니다.', 'def completion_rate(done, total):\n    if total == 0:\n        return 0\n    return done / total * 100\n\nprint(completion_rate(3, 5))\nprint(completion_rate(0, 0))', [
        repair({
          id: 'py-w12-d5-repair-v2', title: '완료율 반환',
          starterCode: 'def completion_rate(done, total):\n    return total / done * 100',
          prompt: '입력은 0 ≤ done ≤ total인 정수 개수입니다. 완료 수를 전체 수로 나눠 백분율로 반환하세요. 전체 수가 0이면 0을 반환하며, 출력은 하지 않습니다.',
          solutionPatterns: [completionRatePattern],
          requirements: ['total이 0인지 먼저 검사해요.', 'done / total * 100을 반환해요.'],
          constraints: ['done과 total은 `0 ≤ done ≤ total`을 만족하는 정수예요.', '출력 대신 숫자 값을 반환해요.'],
          examples: [{ input: 'done=3, total=5', output: '60.0' }],
          tests: [{ input: 'done=0, total=0', expected: '0' }, { input: 'done=0, total=5', expected: '0.0' }, { input: 'done=3, total=5', expected: '60.0' }],
          hint: '0으로 나눌 수 없으므로 분모를 먼저 검사한 뒤 정상 수식에서 완료 수를 분자에 두세요.',
          explanation: '전체 수가 0이면 나눗셈 없이 합의된 0을 반환합니다. 그 외에는 완료 수를 전체로 나눈 비율에 100을 곱하고 호출자가 쓸 수 있도록 반환합니다.',
        }),
      ]),
    ],
  },
};
