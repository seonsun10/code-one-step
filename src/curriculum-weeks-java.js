import {
  choice, locateError, shortAnswer, versionedShortAnswer, repairCode, studySession, weeklyLesson,
} from './curriculum-tools.js';

// The first twelve weeks extend the reviewed G10 lessons.  The integration
// layer keeps the original three questions in days 1–3 and attaches these
// additions without changing their ids or saved-answer meanings.
const legacyLessonIds = [
  'java-variables', 'java-conditions', 'java-loops', 'java-methods', 'java-classes',
  'java-interfaces-records', 'java-collections-generics', 'java-exceptions',
  'java-lambdas-streams', 'java-concurrency-tests', 'java-jvm-performance', 'java-algorithms-capstone',
];

const phaseDefinitions = [
  ['java-foundation', 1, 4, '기초 문법과 흐름', '값, 조건, 반복을 읽고 작은 메서드로 표현해요.'],
  ['java-object-model', 5, 8, '객체와 모델링', '객체의 책임, 타입, 컬렉션, 실패를 모델링해요.'],
  ['java-language-depth', 9, 12, '언어 기능 깊이', '함수형 흐름, 동시성, JVM 관점을 기초부터 연결해요.'],
  ['java-io-data', 13, 16, '입출력과 데이터', '파일·시간·직렬화와 데이터 경계를 안전하게 다뤄요.'],
  ['java-design-quality', 17, 21, '설계와 품질', '테스트, 설계 원칙, 관찰 가능성을 코드에 적용해요.'],
  ['java-practice', 22, 26, '문제 해결과 프로젝트', '알고리즘 선택과 작은 기능 설계로 배운 내용을 연결해요.'],
];

const phases = phaseDefinitions.map(([id, startWeek, endWeek, title, objective]) => ({
  id, startWeek, endWeek, title, objective,
}));

const phaseFor = (week) => phases.find(({ startWeek, endWeek }) => week >= startWeek && week <= endWeek).id;

const topics = [
  ['java-foundation', '기초 문법과 제어 흐름'],
  ['java-object-model', '객체와 자료 모델'],
  ['java-language-depth', '언어 기능과 실행 모델'],
  ['java-io-data', '입출력과 데이터 경계'],
  ['java-design-quality', '설계·테스트·운영 품질'],
  ['java-practice', '문제 해결과 종합 연습'],
];

const topicFor = (week) => topics[Math.min(5, Math.floor((week - 1) / 5))][0];

const weekPlans = [
  ['타입과 값', '기본형·참조형을 구분하고 표현 범위를 정해요.', ['변수 선언과 초기화', '정수·실수 타입', '상수와 재대입', '문자와 논리값', '값 변환 읽기']],
  ['조건과 비교', '비교 결과와 분기 순서를 코드로 설명해요.', ['비교 연산자', '문자열 내용 비교', 'if와 else if', '논리 연산자', 'switch 표현식 읽기']],
  ['반복과 배열', '배열 범위를 지키며 반복의 종료 조건을 설계해요.', ['배열 인덱스', '향상된 for문', 'continue와 break', 'for 종료 조건', '중첩 반복 읽기']],
  ['메서드와 범위', '입력·출력·지역 범위를 분명히 한 메서드를 만들어요.', ['매개변수와 반환값', '반환형 선택', '반환 경로 점검', '지역 변수 범위', '메서드 오버로딩']],
  ['클래스와 캡슐화', '객체가 맡을 상태와 동작을 나누고 외부 변경을 제한해요.', ['필드와 생성자', '인스턴스와 static', '접근 제어자', 'getter의 역할', '불변 객체 기초']],
  ['상속과 다형성', '공통 계약과 구현의 차이를 다형성으로 표현해요.', ['상속 관계 읽기', '메서드 재정의', '추상 클래스', '인터페이스 계약', '다형성 호출']],
  ['제네릭과 컬렉션', '자료의 성격에 맞는 컬렉션과 타입 매개변수를 선택해요.', ['List와 순서', 'Set과 중복', 'Map과 키', '제네릭 경계', '컬렉션 순회']],
  ['예외와 자원', '실패 원인을 보존하고 닫아야 할 자원을 안전하게 다뤄요.', ['예외 흐름', 'checked 예외 읽기', 'catch 순서', 'try-with-resources', '예외에 맥락 더하기']],
  ['람다와 함수형 인터페이스', '동작을 값처럼 전달하고 부작용의 위치를 점검해요.', ['람다 문법', 'Predicate와 조건', 'Function 변환', 'Consumer 부작용', '메서드 참조']],
  ['스트림 파이프라인', '중간 연산과 최종 연산을 구분해 데이터 흐름을 읽어요.', ['filter', 'map', 'flatMap', 'collect와 toList', '스트림 재사용 금지']],
  ['동시성과 안전성', '공유 가변 상태의 경합을 발견하고 안전한 경계를 세워요.', ['스레드와 작업', '가시성의 문제', '원자적 카운터', '동기화 범위', '완료 신호 테스트']],
  ['JVM과 성능 측정', '추측 대신 측정으로 병목 후보와 개선 결과를 비교해요.', ['힙과 스택 개념', '할당 관찰', '워밍업의 의미', '프로파일링 질문', '측정 결과 해석']],
  ['파일과 경로', '경로를 조합하고 파일 입출력 실패를 호출 규약으로 다뤄요.', ['Path 만들기', '문자 인코딩', '파일 읽기', '파일 쓰기', '존재 여부와 오류']],
  ['날짜와 시간', '시간대와 불변 시간 객체를 구분해 일정 데이터를 다뤄요.', ['LocalDate', 'LocalDateTime', 'Instant', 'ZoneId', '시간 계산']],
  ['입력 검증과 DTO 경계', '외부 입력을 검증하고 데이터 전달용 DTO와 실패 이유를 분명히 다뤄요.', ['문자열 파싱', 'null 경계', '입력 검증', 'DTO의 역할', '오류 메시지 설계']],
  ['네트워크 기본', '요청·응답·시간 제한을 분리해 실패 가능한 통신을 읽어요.', ['URI 구성', '요청 메서드', '상태 코드', 'timeout', '응답 본문 확인']],
  ['단위 테스트', '작은 규칙을 빠르게 확인하고 실패 원인을 읽기 좋은 테스트를 써요.', ['Arrange Act Assert', '경계값', '예외 검증', '테스트 이름', '독립성']],
  ['설계 원칙', '변경 이유가 다른 코드를 분리하고 의존성 방향을 설명해요.', ['한 가지 책임', '의존성 역전', '구성으로 재사용', '명시적 계약', '변경 영향 찾기']],
  ['불변성과 동등성', '값 객체의 동등성·해시 규약과 변경 가능성의 범위를 이해해요.', ['equals 의미', 'hashCode 규약', 'record 값 모델', '방어적 복사', '컬렉션 키 주의']],
  ['관찰 가능성과 로그', '유용한 맥락을 남기되 민감한 값을 기록하지 않아요.', ['로그 수준', '구조화된 맥락', '예외 기록', '민감 정보', '측정 가능한 사건']],
  ['리팩터링 연습', '동작을 보존하며 긴 메서드를 작고 읽기 쉬운 단위로 나눠요.', ['냄새 찾기', '의미 있는 이름', '조건 추출', '중복 제거', '작은 커밋 단위']],
  ['자료 구조 선택', '조회·삽입·정렬 요구에 맞춰 자료 구조를 고르고 근거를 남겨요.', ['배열과 목록', '스택과 큐', '해시 기반 조회', '정렬된 자료', '복잡도 비교']],
  ['탐색과 정렬', '입력 조건에 맞는 탐색·정렬 전략을 선택하고 경계를 검증해요.', ['선형 탐색', '이진 탐색 전제', '정렬 비교', '중복 값', '오프바이원 검사']],
  ['재귀와 분할', '종료 조건을 먼저 정하고 호출 깊이를 의식해 문제를 나눠요.', ['기저 조건', '재귀 호출', '스택 깊이', '분할 정복', '반복으로 바꾸기']],
  ['작은 기능 설계', '요구사항을 입력·규칙·출력으로 나누고 테스트 가능한 API를 설계해요.', ['요구사항 분해', '도메인 용어', '메서드 계약', '오류 정책', '예제 시나리오']],
  ['종합 복습과 다음 계획', '배운 개념을 연결해 약점을 찾고 다음 학습 단위를 스스로 정해요.', ['코드 읽기', '오류 진단', '설계 선택', '성능 가설', '학습 회고']],
];

const weekIntros = [
  '자바 변수는 선언만으로 항상 읽을 수 있는 건 아니에요. 지역 변수는 사용 전에 값을 정해야 하고, 타입에 따라 담을 수 있는 범위도 달라요.',
  '비교식은 true·false로 평가되고, 조건문은 그 결과로 실행할 코드를 골라요. 문자열은 `==`가 아니라 `equals`로 글자 내용을 비교해요.',
  '배열은 0번 위치부터 시작해요. 길이가 3이면 유효한 인덱스는 0부터 2까지라 반복 조건을 잘못 잡으면 범위를 벗어나요.',
  '메서드는 입력값을 받아 결과를 돌려주는 작은 작업 단위예요. 값을 돌려주는 메서드는 조건이 어느 쪽으로 가도 반환해야 해요.',
  '객체가 필요한 상태는 생성할 때 받아 유효한 상태로 시작하는 편이 안전해요. 접근 제어와 불변성은 외부에서 값을 바꾸는 범위를 줄여 줘요.',
  '다형성에서는 변수의 선언 타입과 실제 객체 타입을 구분해야 해요. 재정의한 메서드를 부르면 실제 객체의 구현이 선택돼요.',
  '컬렉션은 데이터를 담는 방식이 달라요. List는 순서, Set은 중복 여부, Map은 키로 찾는 일이 중요할 때 골라요.',
  '예외는 문제가 생긴 위치와 원인을 호출자에게 전달해요. 파일처럼 닫아야 하는 자원은 try-with-resources로 사용 후 닫아요.',
  '람다는 함수형 인터페이스가 요구하는 동작을 값처럼 넘길 때 써요. 콜백 안에서 상태를 바꾸면 부작용이 어디서 생기는지도 살펴봐요.',
  'Stream의 filter·map 같은 중간 연산은 최종 연산을 호출하기 전까지 실행되지 않아요. 한 번 사용한 Stream은 다시 쓸 수 없어요.',
  '여러 스레드가 같은 값을 읽고 바꾸면 서로의 변경이 덮일 수 있어요. 값이 보이는 문제와 여러 동작이 한 번에 이뤄져야 하는 문제를 나눠 봐요.',
  'JVM이 메모리를 관리해도 메모리 사용량을 객체 개수만으로 알 수는 없어요. 실행 시간도 워밍업과 반복 조건을 맞춰야 비교할 수 있어요.',
  '경로를 확인한 순간과 파일을 읽는 순간 사이에 파일 상태가 달라질 수 있어요. 사전 확인만 믿지 말고 실제 입출력에서 나는 예외를 처리해요.',
  '날짜·시각·시간대가 있는 순간은 서로 다른 정보예요. 일정이 무엇을 뜻하는지에 따라 `LocalDate`, `Instant`, `ZoneId`를 골라요.',
  '외부에서 받은 문자열은 변환과 필수값 검사를 통과해야 내부 규칙에 사용할 수 있어요. DTO는 전달할 데이터를 묶지만 검증을 저절로 해 주지는 않아요.',
  'HTTP 요청은 응답이 오지 않거나 오류 상태를 돌려줄 수 있어요. 요청 제한 시간과 상태 코드, 응답 본문을 각각 확인해야 해요.',
  '이 주차의 `assertEquals`·`assertThrows`는 예제에서 결과를 비교하는 도우미예요. JUnit 자동 테스트가 아니며 실제 프로젝트에서는 테스트 프레임워크에 등록해 실행해요.',
  '설계 원칙은 외워서 모든 클래스에 적용하는 규칙이 아니에요. 바뀌는 이유가 다른 책임을 나누고, 작은 테스트로 변경 영향을 확인해요.',
  '`equals`와 `hashCode`는 객체가 같은지와 해시 컬렉션에서 어디를 찾을지 함께 결정해요. `record`도 내부에 둔 가변 객체까지 자동으로 불변으로 만들지는 않아요.',
  '로그는 어떤 일이 왜 실패했는지 찾도록 맥락을 남겨요. 비밀번호·토큰 같은 비밀이나 불필요한 개인정보는 기록하지 않아요.',
  '리팩터링은 밖에서 보이는 동작을 유지하며 코드를 더 이해하기 쉽게 정리하는 일이에요. 한 번에 작게 바꾸고 테스트로 동작이 유지되는지 확인해요.',
  '자료 구조마다 조회·삽입·삭제·순서에서 드는 비용이 달라요. 필요한 연산을 먼저 정한 뒤 그 요구에 맞는 구조를 골라요.',
  '이진 탐색은 입력이 정렬되어 있어야 범위를 절반씩 줄일 수 있어요. 중복 값이나 찾지 못했을 때의 결과도 확인해요.',
  '재귀 함수는 멈추는 조건과 입력이 줄어드는 과정을 함께 살펴야 해요. 입력이 크면 호출 깊이가 부담이 될 수 있어 반복문과 비교해요.',
  '기능을 만들기 전에 입력, 정상 결과, 잘못된 입력의 처리 방식을 정하면 메서드 계약과 테스트 사례를 분명하게 쓸 수 있어요.',
  '실제 출력을 코드에서 추적하고 오류를 재현하면 막연한 추측을 줄일 수 있어요. 실행 시간 한 번만으로 성능이 좋아졌다고 결론 내리지는 않아요.',
];

const slug = (text) => text.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

const weekKnowledge = [
  ['`long`', '`long`은 int보다 넓은 정수 범위를 제공해요.', '`boolean`', '`char`', 'long total = 3_000_000_000L;', 'long'],
  ['`left.equals(right)`', '문자열의 글자 내용을 비교하려면 equals를 사용해요.', '`left == right`', '`left = right`', 'boolean same = left.equals(right);', 'equals'],
  ['`index < values.length`', '마지막 유효 인덱스는 length보다 하나 작아요.', '`index <= values.length`', '`index < values.length - 1`', 'for (int index = 0; index < values.length; index++) {}', 'length'],
  ['모든 경로에서 값을 반환한다', 'int 반환 메서드는 정상적으로 끝나는 모든 경로에서 int를 반환해야 해요.', '조건문 안에서만 반환한다', '호출자가 알아서 기본값을 받는다', 'static int abs(int value) { return value < 0 ? -value : value; }', 'return'],
  ['생성자로 필수 상태를 초기화한다', '객체가 유효하려면 필요한 값은 생성 시점에 받는 편이 안전해요.', '필드를 모두 public으로 둔다', '모든 필드를 static으로 만든다', 'final String title; Course(String title) { this.title = title; }', 'constructor'],
  ['인터페이스 타입에 의존한다', '호출자는 구현체보다 필요한 동작 계약을 알면 돼요.', '구현 클래스마다 분기한다', '모든 메서드를 static으로 만든다', 'interface Notifier { void send(String message); }', 'interface'],
  ['중복 없는 값에는 Set을 쓴다', 'Set은 같은 값의 중복 저장을 허용하지 않아요.', '순서를 보장하려면 항상 List만 쓴다', '키가 없으면 Map을 쓴다', 'Set<String> tags = new HashSet<>();', 'Set'],
  ['복구할 수 없으면 원인을 보존해 전파한다', '현재 계층이 복구할 수 없다면 실패 원인과 맥락을 숨기지 않아야 해요.', 'catch에서 null만 반환한다', '모든 예외를 무시한다', 'try (var reader = Files.newBufferedReader(path)) { return reader.readLine(); }', 'try-with-resources'],
  ['Predicate는 참·거짓 조건을 표현한다', 'Predicate<T>는 T를 받아 boolean을 돌려주는 함수형 인터페이스예요.', 'Predicate는 값을 다른 타입으로 바꾼다', 'Predicate는 항상 출력만 한다', 'Predicate<String> blank = String::isBlank;', 'Predicate'],
  ['filter는 조건을 통과한 원소만 남긴다', 'filter는 원소를 걸러 내고 map은 원소 값을 바꿔요.', 'filter는 원소를 정렬한다', 'filter는 스트림을 즉시 List로 만든다', 'var adults = ages.stream().filter(age -> age >= 18).toList();', 'filter'],
  ['원자적 연산 또는 동기화로 경합을 보호한다', '공유 카운터의 count++는 읽기와 쓰기가 나뉘어 경합할 수 있어요.', 'sleep 시간을 늘린다', '필드를 public으로 바꾼다', 'AtomicInteger count = new AtomicInteger(); count.incrementAndGet();', 'AtomicInteger'],
  ['같은 입력과 지표로 전후를 비교한다', '측정 조건이 달라지면 변경 효과를 판단할 수 없어요.', '느린 것 같은 반복문을 모두 바꾼다', '한 번만 측정해 결론 낸다', 'long started = System.nanoTime(); runTask(); long elapsed = System.nanoTime() - started;', 'measurement'],
  ['Path로 경로를 조합한다', 'Path는 운영체제 경로 구분자를 직접 이어 붙이는 실수를 줄여요.', '문자열에 /를 항상 더한다', '파일명을 SQL로 변환한다', 'Path file = Path.of("data", "courses.txt");', 'Path'],
  ['Instant는 시간대 없는 지역 시간이 아니다', 'Instant는 UTC 기준의 한 시점을 나타내고 LocalDateTime은 시간대 정보가 없어요.', 'LocalDateTime은 항상 UTC다', 'ZoneId는 날짜만 저장한다', 'Instant now = Instant.now();', 'Instant'],
  ['외부 문자열은 파싱 실패를 고려한다', '숫자 문자열은 형식이 틀릴 수 있으므로 실패 정책이 필요해요.', '모든 문자열은 숫자로 변환된다', 'null을 0으로 바꾸면 검증이 끝난다', 'int minutes = Integer.parseInt(input);', 'parse'],
  ['시간 제한을 요청에 명시한다', '네트워크 호출은 응답하지 않을 수 있으므로 대기 정책을 정해야 해요.', '상태 코드를 무시한다', '요청마다 새 스레드를 무한히 만든다', 'HttpRequest request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(2)).GET().build();', 'timeout'],
  ['경계값을 별도 사례로 테스트한다', '0, 빈 목록, 최대값처럼 경계는 일반 사례와 다른 오류를 드러내요.', '성공 사례 하나만 테스트한다', '테스트 순서에 의존한다', 'assertEquals(0, sum(List.of()));', 'boundary'],
  ['변경 이유가 다른 책임을 분리한다', '한 클래스가 저장·표시·규칙을 모두 가지면 변경 영향이 커져요.', '모든 기능을 한 메서드에 둔다', '이름만 바꾸고 책임은 그대로 둔다', 'class CourseService { private final CourseRepository repository; }', 'responsibility'],
  ['equals를 재정의하면 hashCode도 함께 맞춘다', 'HashMap과 HashSet은 hashCode와 equals의 일관성을 전제로 해요.', 'equals만 바꾸면 충분하다', '모든 객체를 ==로 비교한다', 'record CourseId(String value) {}', 'hashCode'],
  ['비밀번호·토큰 같은 비밀값은 로그에 남기지 않는다', '로그는 운영에 유용하지만 유출되면 안 되는 정보도 될 수 있어요.', '문제 분석을 위해 원문 전체를 출력한다', '예외를 모두 버린다', 'log.info("courseId={}", courseId);', 'sensitive'],
  ['동작을 지키는 작은 변경부터 한다', '리팩터링은 외부 동작을 바꾸지 않고 구조를 개선하는 작업이에요.', '테스트 없이 여러 파일을 한 번에 바꾼다', '중복을 남기고 이름만 줄인다', 'boolean eligible = age >= 18;', 'refactoring'],
  ['키로 자주 찾는 데이터에는 Map을 고려한다', '키와 값의 관계를 Map으로 표현하면 조회 의도가 분명해져요.', '모든 데이터를 문자열로 합친다', '항상 배열이 가장 빠르다', 'Map<String, Integer> done = new HashMap<>();', 'Map'],
  ['이진 탐색 전에는 정렬 조건이 필요하다', '이진 탐색은 가운데 비교로 범위를 버리므로 정렬되지 않은 입력에는 적용할 수 없어요.', '중복이 있으면 무조건 불가능하다', '목록이 비어 있으면 정렬된다', 'int found = Collections.binarySearch(sorted, target);', 'sorted'],
  ['재귀는 종료 조건부터 확인한다', '기저 조건이 없으면 호출이 계속 쌓여 StackOverflowError가 날 수 있어요.', '재귀에는 매개변수가 필요 없다', '호출 횟수는 메모리와 무관하다', 'static int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }', 'base case'],
  ['입력·규칙·출력을 계약으로 적는다', '작은 기능도 무엇을 받고 어떤 실패를 어떻게 돌려주는지 정해야 테스트할 수 있어요.', 'UI 문구만 먼저 확정한다', '오류는 발생한 뒤 정한다', 'int nextLevel(int completed) { return completed + 1; }', 'contract'],
  ['회고는 근거가 있는 다음 행동으로 끝낸다', '틀린 문제 유형과 원인을 기록하면 다음 주제를 선택할 수 있어요.', '점수만 보고 이유를 잊는다', '모르는 것을 모두 같은 난이도로 분류한다', 'List<String> review = List.of("collections", "exceptions");', 'review'],
];

const dayKnowledge = {
  '변수 선언과 초기화': ['선언할 때 타입과 이름을 함께 적는다', '지역 변수는 사용 전에 초기화되어야 해요.', '이름만 적는다', '초기화 없이 읽는다', 'int attempts = 0;', 'initialization'],
  '정수·실수 타입': ['소수 계산에는 double을 고려한다', '정수 나눗셈은 소수 부분을 버릴 수 있어요.', 'int만 사용한다', 'boolean으로 계산한다', 'double average = total / 2.0;', 'double'],
  '문자와 논리값': ['boolean에는 true 또는 false만 둔다', 'boolean은 조건의 결과를 저장해요.', '문자열 아무 값', '정수 인덱스', "char status = 'Y'; boolean completed = false;", 'boolean'],
  '상수와 재대입': ['바뀌지 않는 참조는 final로 선언한다', 'final 지역 변수에는 다시 대입할 수 없어요.', 'static으로만 선언한다', '항상 public으로 둔다', 'final int maxAttempts = 3;', 'final'],
  '값 변환 읽기': ['명시적 변환에서 정보 손실을 확인한다', '넓은 타입을 좁은 타입으로 바꾸면 범위가 줄 수 있어요.', '변환은 항상 안전하다', '문자열 비교가 된다', 'int count = (int) total;', 'cast'],
  '비교 연산자': ['==는 기본형 값 비교에 쓴다', '기본형의 ==는 값을 비교해요.', '항상 문자열 내용 비교', '대입 연산', 'boolean passed = score >= 60;', 'comparison'],
  '문자열 내용 비교': ['String 내용은 equals로 비교한다', '서로 다른 String 객체도 같은 글자일 수 있어요.', '==만 사용한다', '=으로 비교한다', 'boolean same = left.equals(right);', 'equals'],
  '논리 연산자': ['&&는 두 조건이 모두 참일 때 참이다', '&&는 왼쪽이 거짓이면 오른쪽을 평가하지 않을 수 있어요.', '둘 중 하나만 참이면 참이다', '조건을 반전한다', 'boolean adult = age >= 18 && age < 65;', '&&'],
  'if와 else if': ['먼저 참이 된 분기가 실행된다', 'else if 사슬은 위에서부터 조건을 검사해요.', '모든 분기가 실행된다', 'else가 먼저 실행된다', 'if (score >= 90) grade = "A"; else if (score >= 80) grade = "B";', 'else if'],
  'switch 표현식 읽기': ['case 값이 일치하는 분기를 선택한다', 'switch는 하나의 선택 값을 여러 경우와 비교해요.', '항상 default만 실행한다', '문자열을 더한다', 'String label = switch (day) { case 1 -> "Mon"; default -> "Other"; };', 'switch'],
  '배열 인덱스': ['첫 인덱스는 0이다', '길이가 n인 배열의 마지막 인덱스는 n - 1이에요.', '첫 인덱스는 1이다', 'length도 유효 인덱스다', 'int[] values = {2, 3, 4};\nint first = values[0];', 'index'],
  'for 종료 조건': ['index < length로 범위를 제한한다', 'index가 length가 되면 배열 범위를 벗어나요.', '<= length를 쓴다', '종료 조건을 생략한다', 'for (int i = 0; i < values.length; i++) {}', 'length'],
  '향상된 for문': ['인덱스가 필요 없으면 향상된 for문을 쓴다', '향상된 for문은 각 원소를 순서대로 읽어요.', '항상 인덱스를 계산한다', '배열 길이를 늘린다', 'for (int value : values) { total += value; }', 'for-each'],
  'continue와 break': ['break는 가장 가까운 반복문을 끝낸다', 'continue는 다음 반복으로 넘어가고 break는 반복문을 종료해요.', 'break는 다음 반복만 건너뛴다', 'continue는 메서드를 끝낸다', 'if (found) break;', 'break'],
  '중첩 반복 읽기': ['안쪽 반복은 바깥 반복마다 다시 시작한다', '중첩 반복의 총 실행 횟수는 두 반복의 범위에 영향을 받아요.', '안쪽 반복은 한 번만 실행한다', '바깥 반복을 무시한다', 'for (int row = 0; row < 2; row++) { for (int col = 0; col < 3; col++) {} }', 'nested loop'],
  '매개변수와 반환값': ['매개변수는 호출자가 전달한 값을 받는다', '반환값은 메서드가 호출자에게 돌려주는 결과예요.', '매개변수는 항상 필드다', 'void 메서드는 값을 반환한다', 'static int add(int left, int right) { return left + right; }', 'parameter'],
  '반환 경로': ['모든 조건 경로에서 int를 반환한다', 'int 반환 메서드는 반환 없이 끝날 수 없어요.', '한 경로만 반환한다', '컴파일러가 0을 넣는다', 'return value >= 0 ? value : -value;', 'return'],
  '반환형 선택': ['참·거짓 결과에는 boolean을 반환한다', '호출자가 조건식에서 결과를 바로 사용할 수 있어요.', 'void를 반환한다', 'String으로 임의의 문구를 반환한다', 'static boolean isComplete(int completed) { return completed > 0; }', 'boolean'],
  '반환 경로 점검': ['조건이 거짓인 경로도 값을 반환한다', '반환형이 있는 메서드는 모든 정상 실행 경로에서 값을 돌려줘야 해요.', '참인 경로만 반환한다', '컴파일러가 기본값을 넣는다', 'static int absolute(int value) { if (value >= 0) return value; return -value; }', 'return'],
  '메서드 오버로딩': ['매개변수 목록이 달라야 오버로딩된다', '반환형만 다른 메서드는 같은 서명으로 취급돼요.', '반환형만 바꾼다', '메서드 이름을 모두 다르게 한다', 'static int sum(int a, int b) { return a + b; }', 'overloading'],
  '지역 변수 범위': ['지역 변수는 선언된 블록 안에서만 보인다', '블록 밖에서는 그 지역 변수의 이름을 사용할 수 없어요.', '모든 메서드에서 공유된다', '클래스 필드가 된다', 'if (ready) { int count = 1; }', 'scope'],
  '작은 계산 메서드': ['한 메서드는 한 가지 계산 책임을 둔다', '작은 메서드는 이름으로 규칙을 설명하고 테스트하기 쉬워요.', '모든 계산을 main에 둔다', '반환값 없이 출력만 한다', 'static boolean isAdult(int age) { return age >= 18; }', 'method'],
  '필드와 생성자': ['생성자는 객체의 초기 상태를 만든다', '필수 필드를 생성 시점에 받으면 불완전한 객체를 줄여요.', '생성자는 반환형을 가진다', '필드만 있으면 초기화된다', 'Course(String title) { this.title = title; }', 'constructor'],
  '인스턴스와 static': ['static 필드는 클래스 전체가 공유한다', '인스턴스 필드는 객체마다 따로 존재해요.', 'static은 객체마다 복사된다', '인스턴스 필드는 항상 final이다', 'private static int createdCount;', 'static'],
  '접근 제어자': ['private 필드는 클래스 내부에서만 직접 접근한다', 'private은 객체의 내부 표현을 외부 코드에서 숨겨요.', 'private은 모든 패키지에서 접근된다', 'public과 같다', 'private int minutes;', 'private'],
  'getter의 역할': ['getter는 읽기 접근을 의도적으로 제공한다', '필드를 public으로 열지 않고 필요한 값만 읽게 할 수 있어요.', 'getter는 반드시 값을 바꾼다', 'setter와 같은 역할이다', 'public int minutes() { return minutes; }', 'getter'],
  '불변 객체 기초': ['불변 객체는 생성 뒤 관찰 가능한 상태를 바꾸지 않는다', '필드를 final로 두고 변경 메서드를 제공하지 않는 방식이 한 출발점이에요.', '모든 컬렉션이 자동 불변이다', 'final이면 내부 객체도 자동 불변이다', 'record Course(String title, int minutes) {}', 'immutable'],
  '상속 관계 읽기': ['extends는 상위 클래스의 기능을 물려받는다', '하위 클래스는 상위 타입으로 다룰 수 있어요.', 'extends는 인터페이스 구현 전용이다', '상속은 필드를 복사한다', 'class EmailNotifier extends Notifier {}', 'extends'],
  '메서드 재정의': ['@Override는 상위 메서드를 재정의함을 확인한다', '오타나 서명 차이로 새 메서드가 되는 실수를 컴파일러가 잡아줘요.', '@Override는 오버로딩 표시다', 'private 메서드를 재정의한다', '@Override public void send(String message) {}', 'Override'],
  '추상 클래스': ['추상 클래스는 공통 구현과 미완성 동작을 함께 둘 수 있다', '공통 상태나 기본 구현이 필요할 때 추상 클래스를 고려해요.', '추상 클래스는 new로 항상 만든다', '추상 메서드는 본문이 필요하다', 'abstract class Report { abstract String render(); }', 'abstract'],
  '인터페이스 계약': ['인터페이스는 필요한 동작의 약속을 표현한다', '구현체가 달라도 호출자는 같은 메서드 계약을 사용할 수 있어요.', '인터페이스는 객체 상태를 저장한다', '인터페이스는 한 번만 구현한다', 'interface Notifier { void send(String message); }', 'interface'],
  '다형성 호출': ['참조 타입의 계약으로 메서드를 호출한다', '실제 구현체가 재정의한 동작이 실행돼요.', '항상 상위 클래스 본문만 실행된다', '형변환 없이는 호출할 수 없다', 'Notifier notifier = new EmailNotifier(); notifier.send("hi");', 'polymorphism'],
  'List와 순서': ['List는 입력 순서를 유지하면서 같은 값도 여러 번 보존한다', 'List는 추가한 순서를 유지하고 중복 원소도 별도 위치에 남겨요.', 'List는 중복을 제거한다', '키로만 조회한다', 'List<String> names = new ArrayList<>();', 'List'],
  'Set과 중복': ['Set은 같은 원소의 중복을 허용하지 않는다', 'Set은 고유 원소만 유지하고, HashSet은 순회 순서를 보장하지 않아요.', 'Set은 인덱스로 읽는다', 'Set은 삽입 순서를 항상 보장한다', 'Set<String> tags = new HashSet<>();', 'Set'],
  'Map과 키': ['Map은 키와 값의 관계를 저장한다', 'Map은 키를 값에 연결하고 같은 키에 put하면 기존 값을 교체해요.', 'Map은 값만 저장한다', 'Map은 순서 없는 List다', 'Map<String, Integer> scores = new HashMap<>();', 'Map'],
  '제네릭 경계': ['T extends Comparable<T>이면 T를 안전하게 비교할 수 있다', 'Comparable<T> 경계는 T에서 compareTo를 호출할 수 있음을 보장해요.', '경계는 모든 타입을 Object로 바꾼다', '경계는 컴파일 시 검사를 끈다', 'static <T extends Comparable<T>> T max(T left, T right) { return left.compareTo(right) >= 0 ? left : right; }', 'generic'],
  '컬렉션 순회': ['Iterator로 순회 중 구조를 바꿀 때 remove를 사용한다', 'ArrayList는 Iterator.remove로 현재 원소를 지우며 for-each 안의 직접 제거는 피해야 해요.', 'for-each에서 list.remove를 쓴다', '항상 인덱스가 필요하다', 'Iterator<String> it = names.iterator();', 'Iterator'],
  '예외 흐름': ['예외는 정상 반환과 다른 실패 경로를 알린다', '예외 유형과 메시지는 호출자가 실패를 구분해 처리하게 돕습니다.', '예외는 무시해도 된다', '예외는 boolean과 같다', 'throw new IllegalArgumentException("minutes must be positive");', 'exception'],
  'checked 예외 읽기': ['checked 예외는 처리하거나 선언해야 한다', 'checked 예외는 현재 메서드에서 잡거나 throws로 호출자에게 전달해야 해요.', 'RuntimeException만 선언한다', 'catch하면 항상 복구된다', 'Files.readString(path);', 'throws'],
  'catch 순서': ['구체적인 예외를 먼저 catch한다', '상위 Exception을 먼저 잡으면 뒤의 IOException 절은 도달 불가능해 컴파일되지 않아요.', 'Exception을 항상 먼저 쓴다', '순서는 실행과 무관하다', 'catch (IOException e) {} catch (Exception e) {}', 'catch'],
  'try-with-resources': ['try-with-resources는 AutoCloseable을 자동으로 닫는다', 'AutoCloseable 자원은 try 블록이 정상·예외로 끝나도 close를 시도해요.', 'finally가 없어도 파일은 영원히 열린다', '모든 객체를 닫는다', 'try (BufferedReader reader = Files.newBufferedReader(path)) {}', 'AutoCloseable'],
  '예외에 맥락 더하기': ['원인 예외를 보존하며 작업 맥락을 더한다', '새 예외 생성자에 cause를 전달하면 원래 실패를 예외 체인에서 진단할 수 있어요.', '원인 없이 새 예외만 던진다', '메시지를 비운다', 'throw new IllegalStateException("course load failed", cause);', 'cause'],
  '람다 문법': ['람다는 함수형 인터페이스의 한 메서드 구현을 표현한다', '호환되는 함수형 인터페이스 계약의 추상 메서드 본문을 람다로 전달해요.', '모든 인터페이스에 람다를 쓴다', '람다는 클래스를 상속한다', 'Runnable task = () -> save();', 'lambda'],
  'Predicate와 조건': ['Predicate<T>의 test는 boolean을 반환한다', 'Predicate는 입력을 검사하고 다른 API에 전달할 수 있는 boolean 조건을 돌려줘요.', 'Predicate는 T를 반환한다', 'Predicate는 입출력을 한다', 'Predicate<Integer> even = n -> n % 2 == 0;', 'Predicate'],
  'Function 변환': ['Function<T,R>은 T를 R로 변환한다', 'Function의 apply는 입력 T에서 계산한 결과 타입 R을 반환해요.', 'Function은 boolean만 반환한다', 'Function은 값을 삭제한다', 'Function<String, Integer> length = String::length;', 'Function'],
  'Consumer 부작용': ['Consumer<T>는 값을 받아 부작용을 수행할 수 있다', 'Consumer.accept는 입력을 처리하지만 호출자에게 반환값을 돌려주지 않아요.', 'Consumer는 항상 새 값을 만든다', 'Consumer는 조건만 검사한다', 'Consumer<String> print = System.out::println;', 'Consumer'],
  '메서드 참조': ['메서드 참조는 호환되는 람다를 간결하게 쓴 표현이다', '메서드 참조는 대상 함수형 메서드와 매개변수·반환 계약이 맞아야 해요.', '모든 메서드를 ::로 바꾼다', '생성자를 호출할 수 없다', 'names.forEach(System.out::println);', 'method reference'],
  'filter': ['filter는 조건이 참인 원소만 다음 단계로 보낸다', '원래 List를 직접 바꾸지 않고 새 스트림 흐름을 만들어요.', 'filter는 값을 다른 타입으로 바꾼다', 'filter는 항상 즉시 실행된다', 'var adults = ages.stream().filter(age -> age >= 18).toList();', 'filter'],
  'map': ['map은 각 원소를 다른 값으로 변환한다', '원소 수는 보통 유지되지만 값의 타입은 달라질 수 있어요.', 'map은 원소를 제거한다', 'map은 스트림을 닫는다', 'var lengths = names.stream().map(String::length).toList();', 'map'],
  'flatMap': ['flatMap은 중첩된 흐름을 한 흐름으로 펼친다', '각 원소가 여러 원소를 만드는 경우에 사용할 수 있어요.', 'flatMap은 정렬만 한다', 'flatMap은 첫 원소만 남긴다', 'var words = lines.stream().flatMap(line -> Arrays.stream(line.split(" "))).toList();', 'flatMap'],
  'collect와 toList': ['toList는 스트림 결과를 List로 모은다', 'Java 16부터 쓸 수 있고 encounter order를 유지하는 수정 불가 List를 반환해요.', 'toList는 중간 연산이다', 'collect는 정렬만 한다', 'var result = names.stream().toList();', 'toList'],
  '스트림 재사용 금지': ['최종 연산한 Stream은 다시 사용하지 않는다', 'count·toList 같은 최종 연산 뒤에는 새 스트림을 만들어야 해요.', 'stream을 무한히 재사용한다', 'stream은 List와 같다', 'long count = names.stream().count();', 'terminal operation'],
  '스레드와 작업': ['Thread는 별도 실행 흐름을 나타낸다', '`new Thread(task)`는 플랫폼 스레드를 만들고 `start()`가 실행을 예약해요. Java 21부터 가상 스레드 API도 제공돼요.', '모든 코드는 동시에 실행된다', 'Thread는 값을 저장한다', 'Thread worker = new Thread(task); worker.start();', 'Thread'],
  '가시성의 문제': ['volatile은 한 변수의 최신 값 가시성에 사용될 수 있다', '복합 연산의 원자성까지 보장하지는 않아요.', 'volatile이 모든 동기화를 대체한다', 'volatile은 값을 암호화한다', 'private volatile boolean stopped;', 'volatile'],
  '원자적 카운터': ['AtomicInteger의 incrementAndGet은 원자적으로 증가한다', '단순 카운터 갱신에서 읽기·쓰기 경합을 줄여요.', 'int의 ++도 항상 원자적이다', 'sleep으로 원자성이 생긴다', 'count.incrementAndGet();', 'AtomicInteger'],
  '동기화 범위': ['synchronized 범위는 필요한 공유 상태만 보호한다', '너무 넓으면 경쟁이 커지고 너무 좁으면 불변 조건이 깨질 수 있어요.', '모든 메서드를 무조건 잠근다', '잠금은 필요 없다', 'synchronized (lock) { balance += amount; }', 'synchronized'],
  '완료 신호 테스트': ['CountDownLatch로 작업 완료를 기다릴 수 있다', '고정 sleep보다 완료 조건을 명시해 테스트 흔들림을 줄여요.', 'sleep만 늘린다', '테스트 순서에 의존한다', 'latch.await();', 'CountDownLatch'],
  '힙과 스택 개념': ['객체는 보통 힙에, 호출 프레임은 스택에 관련된다', '정확한 구현 세부는 JVM에 따라 다를 수 있어 단순 모델로만 이해해요.', '모든 값은 힙에만 있다', '스택은 파일 저장소다', 'var course = new Course("Java");', 'heap'],
  '할당 관찰': ['반복 안의 새 객체 생성은 할당량을 늘릴 수 있다', '문제인지 여부는 실제 측정으로 판단해야 해요.', 'new는 항상 느리다', '할당은 GC와 무관하다', 'for (int i = 0; i < n; i++) { values.add(new Point(i, i)); }', 'allocation'],
  '워밍업의 의미': ['JIT 최적화 전후 실행 특성이 달라질 수 있다', '마이크로 측정은 워밍업과 반복 횟수를 고려해야 해요.', '첫 실행만 측정한다', '워밍업은 결과를 조작한다', 'for (int i = 0; i < 10_000; i++) runTask();', 'JIT'],
  '프로파일링 질문': ['프로파일러는 시간을 많이 쓰는 지점을 찾는 근거다', '측정 결과 없이 코드 모양만으로 병목을 단정하면 안 돼요.', '프로파일러가 코드를 자동 수정한다', '가장 긴 메서드가 항상 병목이다', 'long started = System.nanoTime(); runTask();', 'profiler'],
  '측정 결과 해석': ['p95는 느린 쪽 5% 요청의 경계를 보여 준다', '이 예제는 순위에 따른 최근접 순위법으로 작은 표본의 p95를 구해요. 서비스 지표의 percentile 방식은 도구 설정도 확인해야 합니다.', 'p95는 평균과 같다', '한 번의 값만 보면 된다', 'long elapsed = System.nanoTime() - started;', 'p95'],
  'Path 만들기': ['Path.of는 경로 요소를 안전하게 조합한다', '문자열 연결보다 운영체제 구분자 처리 실수를 줄여요.', '항상 /를 붙인다', 'File 객체만 쓸 수 있다', 'Path path = Path.of("data", "course.txt");', 'Path'],
  '문자 인코딩': ['명시한 Charset으로 바이트를 문자로 해석한다', '서로 다른 인코딩 가정은 글자 깨짐을 만들 수 있어요.', '모든 파일은 ASCII다', '인코딩은 파일 크기다', 'Files.readString(path, StandardCharsets.UTF_8);', 'UTF-8'],
  '파일 읽기': ['Files.readString은 읽기 실패를 예외로 알릴 수 있다', '파일 없음·권한 오류를 호출 규약에 맞게 다뤄야 해요.', '항상 빈 문자열을 준다', '파일을 자동 생성한다', 'String text = Files.readString(path);', 'Files.readString'],
  '파일 쓰기': ['Files.writeString은 지정 경로에 문자열을 쓴다', '기존 파일 처리 방식과 실패 정책을 확인해야 해요.', '읽기만 한다', '항상 메모리에만 저장한다', 'Files.writeString(path, content);', 'Files.writeString'],
  '존재 여부와 오류': ['exists 검사 뒤에도 파일 상태는 바뀔 수 있다', '검사는 힌트일 뿐 실제 읽기·쓰기의 예외 처리는 여전히 필요해요.', 'exists면 예외는 없다', '파일은 절대 바뀌지 않는다', 'if (Files.exists(path)) { Files.readString(path); }', 'TOCTOU'],
  'LocalDate': ['LocalDate는 시간대 없는 날짜를 표현한다', '생일·마감일처럼 시각이 필요 없는 값에 맞아요.', 'UTC 시각을 저장한다', '시간대까지 자동 저장한다', 'LocalDate due = LocalDate.of(2026, 10, 11);', 'LocalDate'],
  'LocalDateTime': ['LocalDateTime은 날짜와 시각을 가지지만 시간대는 없다', '서버 간 비교에는 어떤 ZoneId인지 따로 정해야 해요.', '항상 UTC다', '날짜만 저장한다', 'LocalDateTime meeting = LocalDateTime.of(2026, 10, 11, 9, 0);', 'LocalDateTime'],
  'Instant': ['Instant는 UTC 기준 한 시점을 표현한다', '서로 다른 지역의 같은 순간을 비교할 때 유용해요.', '지역 달력 날짜다', '시간대 문자열이다', 'Instant createdAt = Instant.now();', 'Instant'],
  'ZoneId': ['ZoneId로 지역 규칙을 명시한다', '서머타임 같은 지역 규칙은 단순 고정 오프셋과 다를 수 있어요.', '문자열 비교만 한다', '날짜를 정렬한다', 'ZoneId seoul = ZoneId.of("Asia/Seoul");', 'ZoneId'],
  '시간 계산': ['plusDays는 새 시간 객체를 반환한다', 'java.time 타입은 불변이라 원래 값이 바뀌지 않아요.', '원래 날짜를 직접 바꾼다', '밀리초를 직접 더한다', 'LocalDate tomorrow = today.plusDays(1);', 'plusDays'],
  '문자열 파싱': ['parseInt는 잘못된 숫자 형식에서 예외를 던질 수 있다', '외부 입력은 숫자라는 보장이 없어요.', '항상 0을 반환한다', '공백을 자동 무시한다', 'int count = Integer.parseInt(input);', 'NumberFormatException'],
  'null 경계': ['null 가능성은 API 경계에서 명시한다', '어떤 값이 없을 수 있는지 호출자와 합의해야 해요.', 'null을 무조건 역참조한다', '모든 null을 빈 문자열로 바꾼다', 'Objects.requireNonNull(title);', 'null'],
  '입력 검증': ['검증 실패는 사용자가 이해할 수 있는 규칙과 연결한다', '범위·형식·필수값을 변환 전에 확인하면 실패 원인이 분명해져요.', '검증 없이 저장한다', '모든 오류를 같은 메시지로 만든다', 'if (minutes <= 0) throw new IllegalArgumentException("minutes must be positive");', 'validation'],
  'DTO의 역할': ['DTO는 계층 사이에 전달할 데이터를 표현한다', 'record는 정해진 데이터 모양을 간결하게 표현하지만 JSON 직렬화까지 자동으로 수행하지는 않아요.', 'DTO는 데이터베이스 연결이다', 'record를 만들면 JSON 문자열도 자동으로 생성된다', 'record CourseRequest(String title, int minutes) {}', 'DTO'],
  '오류 메시지 설계': ['오류 메시지는 실패한 입력 규칙을 알려야 한다', '민감한 내부 정보는 사용자 메시지에 넣지 않아요.', '스택트레이스를 그대로 보낸다', '항상 오류라고만 쓴다', 'throw new IllegalArgumentException("minutes must be positive");', 'error message'],
  'URI 구성': ['URI는 요청 대상의 식별자를 표현한다', '경로·쿼리의 인코딩 규칙을 직접 문자열로 추측하지 않는 편이 안전해요.', 'URI는 응답 본문이다', 'URI는 HTTP 상태다', 'URI uri = URI.create("https://example.com/courses");', 'URI'],
  '요청 메서드': ['GET은 조회 의도를 나타낸다', '서버가 어떤 동작을 할지 HTTP 메서드와 함께 해석해요.', 'GET은 항상 데이터를 수정한다', 'POST와 같은 의미다', 'HttpRequest.newBuilder(uri).GET().build();', 'GET'],
  '상태 코드': ['2xx 상태 코드는 일반적으로 성공 응답 범위다', '응답 본문을 읽기 전에 상태 코드와 계약을 확인해야 해요.', '404도 성공이다', '상태 코드는 필요 없다', 'boolean successful = statusCode >= 200 && statusCode < 300;', 'status code'],
  'timeout': ['요청 timeout은 무한 대기를 피하는 정책이다', '시간 제한 뒤의 재시도·오류 처리는 별도로 설계해야 해요.', 'timeout은 응답 성공을 보장한다', 'timeout은 서버를 빠르게 한다', 'request.timeout(Duration.ofSeconds(2));', 'timeout'],
  '응답 본문 확인': ['응답 본문은 상태 코드와 형식을 확인한 뒤 해석한다', '성공처럼 보이는 문자열도 계약과 맞는지 검증해야 해요.', '항상 JSON이라고 가정한다', '본문을 로그에 무조건 남긴다', 'String body = response.body();', 'response body'],
  'Arrange Act Assert': ['테스트는 준비·실행·검증을 구분하면 읽기 쉽다', '실패했을 때 어느 단계의 문제인지 파악하기 쉬워요.', '모든 코드를 한 줄에 둔다', '검증 없이 실행만 한다', 'int result = add(2, 3); assertEquals(5, result);', 'AAA'],
  '경계값': ['빈 값과 최소·최대값을 별도 테스트한다', '경계는 오프바이원과 누락된 분기를 드러내요.', '평균값만 쓴다', '경계는 구현과 무관하다', 'assertEquals(0, sum(java.util.Collections.emptyList()));', 'boundary'],
  '예외 검증': ['assertThrows로 기대한 예외 유형을 검증한다', '예외가 난다는 사실과 유형을 함께 확인할 수 있어요.', '모든 예외를 성공으로 본다', 'try-catch를 비운다', 'assertThrows(IllegalArgumentException.class, () -> parse("x"));', 'assertThrows'],
  '테스트 이름': ['테스트 이름은 조건과 기대 결과를 드러낸다', '실패 보고만 봐도 어떤 규칙이 깨졌는지 알 수 있어요.', 'test1처럼 번호만 쓴다', '구현 세부를 이름에 숨긴다', 'void emptyList_returnsZero() {}', 'test name'],
  '독립성': ['각 테스트는 실행 순서와 공유 상태에 의존하지 않는다', '한 테스트의 결과가 다음 테스트의 전제가 되면 흔들릴 수 있어요.', '한 테스트가 데이터를 남긴다', '이름순 실행을 믿는다', 'CourseService service = new CourseService(new CourseRepository());', 'independence'],
  '한 가지 책임': ['클래스는 바뀌는 이유를 한 가지로 좁힌다', '저장 규칙과 화면 출력 규칙은 다른 이유로 바뀔 수 있어요.', '모든 책임을 합친다', '메서드 수만 줄인다', 'class CourseFormatter { String format(Course course) { return course.title(); } }', 'SRP'],
  '의존성 역전': ['상위 정책은 구체 구현보다 추상 계약에 의존한다', '테스트에서 대체 구현을 넣기 쉬워져요.', '서비스가 new로 저장소를 만든다', '인터페이스를 제거한다', 'interface CourseRepository { Course find(String id); }', 'dependency inversion'],
  '구성으로 재사용': ['변하는 기능은 구성으로 조합할 수 있다', '상속 계층을 깊게 만들지 않고 협력 객체를 바꿀 수 있어요.', '모든 재사용은 extends다', '필드를 static으로 만든다', 'class ReportService { private final Formatter formatter; }', 'composition'],
  '명시적 계약': ['메서드 계약은 입력·출력·실패 조건을 밝혀야 한다', '호출자는 정상값과 오류를 구분할 수 있어야 해요.', '반환형 없이 설명한다', '오류를 숨긴다', 'Optional<Course> findById(String id) { return Optional.empty(); }', 'contract'],
  '변경 영향 찾기': ['변경 전 호출자와 테스트를 함께 찾는다', '공개 메서드의 변경은 여러 사용처에 영향을 줄 수 있어요.', '구현만 보고 수정한다', '컴파일 오류를 무시한다', 'Optional<Course> course = repository.findById("java");', 'call site'],
  'equals 의미': ['equals는 논리적으로 같은 값을 비교한다', '값 객체는 서로 다른 인스턴스여도 같은 식별값일 수 있어요.', 'equals는 주소만 비교한다', 'equals는 정렬한다', 'left.equals(right);', 'equals'],
  'hashCode 규약': ['equals가 true인 두 객체는 같은 hashCode여야 한다', '해시 기반 컬렉션이 같은 값을 찾기 위한 규약이에요.', 'hashCode는 항상 고유하다', 'equals와 무관하다', 'Objects.hash(value);', 'hashCode'],
  'record 값 모델': ['record는 데이터 구성 요소와 접근자를 간결하게 만든다', '기본 record는 구성 요소 필드를 재대입하는 setter를 만들지 않아요.', 'record는 상속만 한다', 'record는 항상 가변이다', 'record CourseId(String value) {}', 'record'],
  '방어적 복사': ['가변 컬렉션은 복사해 내부 상태 노출을 줄인다', '외부가 전달한 List를 나중에 바꾸면 객체 규칙이 깨질 수 있어요.', '참조를 그대로 공개한다', 'final이면 복사가 필요 없다', 'this.tags = List.copyOf(tags);', 'defensive copy'],
  '컬렉션 키 주의': ['Map의 키는 삽입 뒤 동등성 기준이 바뀌지 않아야 한다', '가변 키를 바꾸면 해시 버킷에서 찾지 못할 수 있어요.', '키는 언제든 바꾼다', '키에는 equals가 필요 없다', 'Map<CourseId, Course> courses = new HashMap<>();', 'mutable key'],
  '로그 수준': ['복구 가능한 흐름과 장애는 다른 로그 수준을 고려한다', '운영자가 행동해야 할 오류와 진단용 정보는 구분할 수 있어야 해요.', '모두 error로 남긴다', '로그를 전혀 남기지 않는다', 'log.info("course loaded id={}", id);', 'log level'],
  '구조화된 맥락': ['로그에는 검색 가능한 식별 맥락을 남긴다', 'courseId 같은 비민감 식별자는 문제 추적에 도움이 돼요.', '자유 문장만 남긴다', '비밀번호를 넣는다', 'context.put("courseId", "java");', 'context'],
  '예외 기록': ['예외를 기록할 때 원인 객체를 함께 전달한다', '스택 정보가 있어야 실패 지점을 추적할 수 있어요.', '메시지만 남긴다', '예외를 삭제한다', 'log.error("course load failed", exception);', 'stack trace'],
  '민감 정보': ['토큰과 비밀번호는 로그에서 마스킹하거나 제외한다', '로그 접근 범위가 넓을 수 있어 비밀값 유출을 막아야 해요.', '디버깅을 위해 그대로 남긴다', '해시도 항상 공개한다', 'log.info("login userId={}", userId);', 'redaction'],
  '측정 가능한 사건': ['측정 값에는 단위와 발생 위치를 함께 정한다', '같은 이름의 숫자라도 ms인지 건수인지 모르면 비교할 수 없어요.', '숫자만 출력한다', '측정은 로그와 무관하다', 'long elapsedMs = Duration.between(started, Instant.now()).toMillis();', 'metric'],
  '냄새 찾기': ['긴 메서드와 중복 분기는 리팩터링 후보가 될 수 있다', '코드 냄새는 오류 확정이 아니라 더 살펴볼 신호예요.', '모든 긴 코드는 삭제한다', '이름만 짧게 만든다', 'boolean eligible = age >= 18;', 'code smell'],
  '의미 있는 이름': ['이름은 값과 동작의 역할을 설명해야 한다', 'x보다 completedLessons처럼 의도가 드러나는 이름이 읽기 쉬워요.', '한 글자 이름이 항상 낫다', '타입 이름을 반복한다', 'int completedLessons = 3;', 'naming'],
  '조건 추출': ['복잡한 조건은 의미 있는 boolean으로 추출할 수 있다', '조건의 이유를 이름으로 설명하면 변경하기 쉬워요.', '조건을 더 길게 한 줄에 쓴다', 'if를 모두 중첩한다', 'boolean isAdult = age >= 18;', 'extract variable'],
  '중복 제거': ['같은 규칙은 한 곳으로 모아 변경을 한 번에 한다', '복사된 규칙은 시간이 지나며 서로 다르게 바뀌기 쉬워요.', '복사본을 더 만든다', '주석만 추가한다', 'static boolean isValid(int minutes) { return minutes > 0; }', 'duplication'],
  '작은 커밋 단위': ['한 커밋에는 검토 가능한 한 가지 의도를 담는다', '문제 원인을 되돌리거나 검토하기 쉬워져요.', '서로 다른 기능을 섞는다', '테스트를 빼고 커밋한다', 'git commit -m "Extract validation rule"', 'commit'],
  '배열과 목록': ['크기가 자주 바뀌면 List를 고려한다', '배열 길이는 고정이고 List는 원소 추가·삭제 API를 제공해요.', '배열은 항상 가변 길이다', 'List는 인덱스가 없다', 'List<Integer> scores = new ArrayList<>();', 'ArrayList'],
  '스택과 큐': ['스택은 LIFO, 큐는 FIFO 순서다', '최근 작업 되돌리기와 대기 작업 처리는 필요한 순서가 달라요.', '둘은 같은 순서다', '둘 다 정렬한다', 'Deque<String> queue = new ArrayDeque<>();', 'Deque'],
  '해시 기반 조회': ['HashMap 조회 평균 성능은 해시 분포에 의존한다', '평균 O(1)은 모든 입력에서 보장되는 상수 시간이 아니에요.', '항상 O(1) 보장이다', '정렬이 필요하다', 'Map<String, Integer> counts = new HashMap<>();', 'HashMap'],
  '정렬된 자료': ['정렬된 List는 이진 탐색의 전제가 된다', '삽입 비용과 조회 비용을 함께 고려해야 해요.', '정렬은 조회와 무관하다', '정렬 뒤 중복이 사라진다', 'Collections.sort(values);', 'sorting'],
  '복잡도 비교': ['복잡도는 입력 크기가 커질 때의 증가 경향을 설명한다', '작은 입력에서는 상수 비용도 실제 선택에 영향을 줘요.', '항상 실행 시간을 정확히 말한다', '메모리와 무관하다', 'O(n) vs O(log n)', 'complexity'],
  '선형 탐색': ['정렬되지 않은 목록은 앞에서부터 비교할 수 있다', '최악에는 모든 원소를 확인하므로 O(n)이에요.', '항상 O(log n)이다', '정렬이 필요하다', 'for (int value : values) if (value == target) return true;', 'linear search'],
  '이진 탐색 전제': ['이진 탐색 입력은 정렬되어 있어야 한다', '가운데 비교로 절반을 버리는 판단이 정렬에 의존해요.', '중복이 없어야만 한다', '배열만 가능하다', 'Collections.binarySearch(sorted, target);', 'binary search'],
  '정렬 비교': ['Comparator는 두 값의 순서를 정의한다', '정렬 기준을 명시하면 제목·점수 같은 서로 다른 기준을 선택할 수 있어요.', 'equals만 사용한다', 'compare는 boolean을 준다', 'courses.sort(Comparator.comparing(Course::title));', 'Comparator'],
  '중복 값': ['중복이 있는 탐색은 어떤 위치를 원하는지 계약해야 한다', '첫 위치·아무 위치·모든 위치는 서로 다른 요구예요.', '중복은 자동 제거된다', '계약이 필요 없다', 'int index = Collections.binarySearch(sorted, target);', 'duplicate'],
  '오프바이원 검사': ['구간의 포함·제외 경계를 먼저 적는다', 'start 포함 end 제외 같은 규칙을 통일하면 인덱스 오류를 줄여요.', '끝을 추측한다', 'length를 마지막 인덱스로 쓴다', 'for (int i = start; i < end; i++) {}', 'half-open range'],
  '기저 조건': ['기저 조건은 재귀 호출을 멈추는 입력을 정의한다', '더 이상 작은 문제로 나눌 수 없는 경우를 먼저 처리해야 해요.', '재귀는 끝없이 호출한다', '기저 조건은 마지막에 둔다', 'if (n <= 1) return 1;', 'base case'],
  '재귀 호출': ['재귀 호출은 더 작은 문제로 진행해야 한다', '입력이 줄지 않으면 종료 조건에 도달하지 못할 수 있어요.', '같은 인수로 호출한다', '반환값을 버린다', 'return n * factorial(n - 1);', 'recursive call'],
  '스택 깊이': ['깊은 재귀는 호출 스택 한계를 넘을 수 있다', '입력 크기가 크면 반복문이나 명시적 스택을 고려할 수 있어요.', '재귀는 메모리를 쓰지 않는다', 'StackOverflowError는 정상값이다', 'factorial(100_000);', 'StackOverflowError'],
  '분할 정복': ['분할 정복은 문제를 작은 부분으로 나누고 결과를 합친다', '정복 단계에서 부분 결과를 올바르게 결합해야 해요.', '반복을 금지한다', '정렬과 무관하다', 'int middle = left + (right - left) / 2;', 'divide and conquer'],
  '반복으로 바꾸기': ['반복문은 재귀의 상태를 변수로 명시할 수 있다', '호출 깊이가 큰 경우 반복이 스택 사용을 줄일 수 있어요.', '반복은 항상 더 짧다', '재귀 결과와 달라야 한다', 'int result = 1; for (int i = 2; i <= n; i++) result *= i;', 'iteration'],
  '요구사항 분해': ['요구사항을 입력·규칙·출력으로 나눈다', '각 부분을 적으면 빠진 규칙과 테스트 사례를 찾기 쉬워요.', '화면부터 만든다', '예외는 나중에 정한다', 'int nextLevel(int completed) { return completed + 1; }', 'requirements'],
  '도메인 용어': ['코드 이름은 사용자가 쓰는 도메인 용어와 맞춘다', 'completedLessons는 의미를 전달하지만 data1은 전달하지 못해요.', '모든 이름을 줄인다', '기술 용어만 쓴다', 'record CourseProgress(int completedLessons) {}', 'ubiquitous language'],
  '메서드 계약': ['메서드는 입력·반환·실패 조건을 약속한다', '호출자는 계약을 바탕으로 예외와 결과를 처리해요.', '구현만 있으면 된다', '계약은 주석에만 둔다', 'Optional<Course> find(String id) { return Optional.empty(); }', 'method contract'],
  '오류 정책': ['예상 가능한 잘못된 입력의 처리 방식을 정한다', '예외·빈 결과·오류 객체 중 무엇을 쓸지 호출자와 합의해야 해요.', '오류를 무시한다', '모든 실패를 null로 만든다', 'throw new IllegalArgumentException("id is blank");', 'error policy'],
  '예제 시나리오': ['예제는 정상·경계·실패 사례를 포함한다', '사용자가 실제로 어떤 결과를 받을지 확인할 수 있어요.', '성공 사례 하나면 충분하다', '입력 없이 출력만 적는다', 'nextLevel(0) // 1', 'scenario'],
  '코드 읽기': ['코드 읽기는 입력에서 결과까지 흐름을 추적하는 일이다', '이름·조건·반환값을 따라가면 숨은 가정을 찾을 수 있어요.', '처음 줄만 읽는다', '실행 없이 알 수 없다', `import java.util.List;

class CompletionSummary {
  public static void main(String[] args) {
    List<Boolean> completed = List.of(true, false, true);
    long count = completed.stream().filter(Boolean::booleanValue).count();
    System.out.println(count); // 2
  }
}`, 'control flow'],
  '오류 진단': ['재현 조건과 실제·기대 결과를 분리해 기록한다', '증상만으로 원인을 단정하면 엉뚱한 부분을 고칠 수 있어요.', '첫 가설을 사실로 본다', '로그를 지운다', 'assertEquals(expected, actual);', 'reproduction'],
  '설계 선택': ['설계 선택은 요구와 제약의 근거를 남긴다', 'Map을 고른 이유가 키 조회라면 요구가 바뀔 때도 검토할 수 있어요.', '유행하는 패턴만 쓴다', '근거 없이 추측한다', 'Map<String, Integer> progressByTrack = new HashMap<>();', 'trade-off'],
  '성능 가설': ['성능 가설은 측정 가능한 지표와 함께 세운다', '어느 입력에서 어떤 지연이 줄어야 하는지 정해야 검증할 수 있어요.', '느릴 것 같다고 단정한다', '한 번만 실행한다', 'long started = System.nanoTime(); runTask();', 'hypothesis'],
  '학습 회고': ['회고는 다음에 연습할 약점과 근거를 적는다', '오답 유형을 기록하면 다음 문제 선택을 조정할 수 있어요.', '점수만 남긴다', '모든 주제를 다시 시작한다', 'List<String> weakTopics = List.of("exceptions");', 'retrospective'],
};

const completeIntroExamples = {
  '변수 선언과 초기화': `class VariableInitializationExample {
  public static void main(String[] args) {
    int attempts = 0;
    System.out.println(attempts); // 0
  }
}`,
  '정수·실수 타입': `class NumericTypesExample {
  public static void main(String[] args) {
    double total = 5;
    double average = total / 2.0;
    System.out.println(average); // 2.5
  }
}`,
  '문자와 논리값': `class BooleanValueExample {
  public static void main(String[] args) {
    char status = 'Y';
    boolean completed = false;
    System.out.println(status); // Y
    System.out.println(completed); // false
  }
}`,
  '상수와 재대입': `class FinalVariableExample {
  public static void main(String[] args) {
    final int maxAttempts = 3;
    System.out.println(maxAttempts); // 3
  }
}`,
  '값 변환 읽기': `class NumericCastExample {
  public static void main(String[] args) {
    double total = 5.8;
    int count = (int) total;
    System.out.println(count); // 5: 소수 부분은 버려져요.
  }
}`,
  '비교 연산자': `class ComparisonExample {
  public static void main(String[] args) {
    int score = 75;
    boolean passed = score >= 60;
    System.out.println(passed); // true
  }
}`,
  '문자열 내용 비교': `class StringEqualityExample {
  public static void main(String[] args) {
    String left = new String("Java");
    String right = new String("Java");
    boolean same = left.equals(right);
    System.out.println(same); // true
  }
}`,
  '논리 연산자': `class LogicalOperatorExample {
  public static void main(String[] args) {
    int age = 30;
    boolean adult = age >= 18 && age < 65;
    System.out.println(adult); // true
  }
}`,
  'if와 else if': `class IfElseIfExample {
  public static void main(String[] args) {
    int score = 84;
    String grade;
    if (score >= 90) {
      grade = "A";
    } else if (score >= 80) {
      grade = "B";
    } else {
      grade = "C";
    }
    System.out.println(grade); // B
  }
}`,
  'switch 표현식 읽기': `class SwitchExpressionExample {
  public static void main(String[] args) {
    int day = 1;
    String label = switch (day) {
      case 1 -> "Mon";
      default -> "Other";
    };
    System.out.println(label); // Mon
  }
}`,
  '배열 인덱스': `class ArrayIndexExample {
  public static void main(String[] args) {
    int[] values = {2, 3, 4};
    int first = values[0];
    System.out.println(first); // 2
  }
}`,
  'for 종료 조건': `class ForLoopBoundaryExample {
  public static void main(String[] args) {
    int[] values = {2, 3, 4};
    int sum = 0;
    for (int i = 0; i < values.length; i++) {
      sum += values[i];
    }
    System.out.println(sum); // 9
  }
}`,
  '향상된 for문': `class EnhancedForExample {
  public static void main(String[] args) {
    int[] values = {2, 3, 4};
    int total = 0;
    for (int value : values) {
      total += value;
    }
    System.out.println(total); // 9
  }
}`,
  'continue와 break': `class ContinueBreakExample {
  public static void main(String[] args) {
    int[] values = {0, 2, 4, 6};
    int total = 0;
    for (int value : values) {
      if (value == 0) continue;
      if (value > 3) break;
      total += value;
    }
    System.out.println(total); // 2
  }
}`,
  '중첩 반복 읽기': `class NestedLoopExample {
  public static void main(String[] args) {
    int pairs = 0;
    for (int row = 0; row < 2; row++) {
      for (int col = 0; col < 3; col++) {
        pairs++;
      }
    }
    System.out.println(pairs); // 6
  }
}`,
};

const completeWeeksFourToSixExamples = {
  '매개변수와 반환값': `class AddMethodExample {
  public static void main(String[] args) {
    System.out.println(add(2, 3)); // 5
  }

  static int add(int left, int right) {
    return left + right;
  }
}`,
  '반환형 선택': `class BooleanReturnExample {
  public static void main(String[] args) {
    System.out.println(isComplete(3)); // true
  }

  static boolean isComplete(int completed) {
    return completed > 0;
  }
}`,
  '반환 경로 점검': `class ReturnPathExample {
  public static void main(String[] args) {
    System.out.println(absolute(-4)); // 4
  }

  static int absolute(int value) {
    if (value >= 0) return value;
    return -value;
  }
}`,
  '지역 변수 범위': `class LocalScopeExample {
  public static void main(String[] args) {
    printCountWhenReady(true);
  }

  static void printCountWhenReady(boolean ready) {
    if (ready) {
      int count = 1;
      System.out.println(count); // 1; count is visible inside this block
    }
  }
}`,
  '메서드 오버로딩': `class OverloadExample {
  public static void main(String[] args) {
    System.out.println(sum(2.0, 3.5)); // 5.5
  }

  static int sum(int left, int right) {
    return left + right;
  }

  static double sum(double left, double right) {
    return left + right;
  }
}`,
  '필드와 생성자': `class ConstructorExample {
  public static void main(String[] args) {
    Course course = new Course("Java");
    System.out.println(course.title()); // Java
  }

  static class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    String title() {
      return title;
    }
  }
}`,
  '인스턴스와 static': `class InstanceAndStaticExample {
  public static void main(String[] args) {
    Course first = new Course("Java");
    Course second = new Course("Python");
    System.out.println(first.title() + ", " + second.title() + ", created=" + Course.createdCount()); // Java, Python, created=2
  }

  static class Course {
    private static int createdCount;
    private final String title;

    Course(String title) {
      this.title = title;
      createdCount++;
    }

    String title() {
      return title;
    }

    static int createdCount() {
      return createdCount;
    }
  }
}`,
  '접근 제어자': `class PrivateCourse {
  private int minutes;

  PrivateCourse(int minutes) {
    this.minutes = minutes;
  }

  int getMinutes() {
    return minutes;
  }
}

class AccessModifierExample {
  public static void main(String[] args) {
    PrivateCourse course = new PrivateCourse(40);
    System.out.println(course.getMinutes()); // 40
    // course.minutes; 다른 클래스에서 private 필드에 직접 접근할 수 없어요.
  }
}`,
  'getter의 역할': `class GetterExample {
  public static void main(String[] args) {
    Course course = new Course("Java");
    System.out.println(course.getTitle()); // Java
  }

  static class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    public String getTitle() {
      return title;
    }
  }
}`,
  '불변 객체 기초': `class ImmutableObjectExample {
  public static void main(String[] args) {
    Course course = new Course("Java", 40);
    System.out.println(course.title() + ", " + course.minutes()); // Java, 40
  }

  static class Course {
    private final String title;
    private final int minutes;

    Course(String title, int minutes) {
      this.title = title;
      this.minutes = minutes;
    }

    String title() {
      return title;
    }

    int minutes() {
      return minutes;
    }
  }
}`,
  '상속 관계 읽기': `class InheritanceExample {
  public static void main(String[] args) {
    Notifier notifier = new EmailNotifier();
    notifier.send("hello"); // sent: hello
  }

  static class Notifier {
    void send(String message) {
      System.out.println("sent: " + message);
    }
  }

  static class EmailNotifier extends Notifier {}
}`,
  '메서드 재정의': `class OverrideExample {
  public static void main(String[] args) {
    new EmailNotifier().send("welcome"); // email: welcome
  }

  static class Notifier {
    public void send(String message) {
      System.out.println("base: " + message);
    }
  }

  static class EmailNotifier extends Notifier {
    @Override
    public void send(String message) {
      System.out.println("email: " + message);
    }
  }
}`,
  '추상 클래스': `class AbstractClassExample {
  public static void main(String[] args) {
    System.out.println(new CourseReport().render()); // Courses: 2
  }

  static abstract class Report {
    abstract String render();
  }

  static class CourseReport extends Report {
    @Override
    String render() {
      return "Courses: 2";
    }
  }
}`,
  '인터페이스 계약': `class InterfaceContractExample {
  public static void main(String[] args) {
    Notifier notifier = new EmailNotifier();
    notifier.send("ready"); // email: ready
  }

  interface Notifier {
    void send(String message);
  }

  static class EmailNotifier implements Notifier {
    @Override
    public void send(String message) {
      System.out.println("email: " + message);
    }
  }
}`,
  '다형성 호출': `class PolymorphicCallExample {
  public static void main(String[] args) {
    Notifier notifier = new EmailNotifier();
    notifier.send("hi"); // email: hi
  }

  interface Notifier {
    void send(String message);
  }

  static class EmailNotifier implements Notifier {
    @Override
    public void send(String message) {
      System.out.println("email: " + message);
    }
  }
}`,
};

function knowledgeFor(title, week) {
  const knowledge = dayKnowledge[title];
  if (!knowledge) throw new Error(`Missing day-specific Java content: week ${week}, ${title}`);
  return knowledge;
}

// Each tuple answers the displayed question directly: correct, two distractors,
// then the reason for each in the same order.
const focusedConceptOptions = {
  '1-1': ['초기화하기 전에 읽을 수 없어요. 컴파일 오류가 납니다.', '선언만 해도 기본값 0이 들어 있어요.', '컴파일은 되지만 실행 중 null 오류가 나요.', '지역 변수는 필드처럼 기본값을 자동으로 받지 않아요. 초기화 전에 읽으면 컴파일 오류가 납니다.', '지역 변수에는 필드의 기본값 규칙이 적용되지 않아요.', 'int 지역 변수의 초기화 누락은 실행 중 null 오류가 아니라 컴파일 오류로 확인돼요.'],
  '1-3': ['네. 읽기 전에 한 번만 값을 대입하면 됩니다.', '아니요. final은 선언과 동시에 값을 정해야 합니다.', '네. 첫 대입 뒤에도 원하는 만큼 다시 바꿀 수 있습니다.', '초기값을 선언문에서 바로 주지 않았더라도 final 지역 변수는 사용 전에 한 번 대입할 수 있어요.', '초기화가 늦었다는 이유만으로 컴파일 오류가 나지는 않아요.', 'final 변수에 두 번째 값을 대입하면 컴파일 오류가 납니다.'],
  '1-5': ['5', '6', '5.9', 'double에서 int로 변환하면 소수 부분을 0 방향으로 버립니다.', '이 변환은 가장 가까운 정수로 반올림하지 않습니다.', 'int에는 소수 부분을 저장할 수 없습니다.'],
  '2-1': ['score == 60', 'score >= 60', 'score = 60', '==는 score가 60과 같을 때만 참이에요.', '>=는 60과 그보다 큰 점수에서 참이 돼요.', '단일 =는 비교가 아니라 대입이에요.'],
  '2-2': ['"Java".equals(name)', 'name.equals("Java")', 'name == "Java"', '문자열 리터럴은 null이 아니므로 name이 null이어도 equals 호출이 안전해요.', 'name이 null이면 equals를 호출하는 순간 NullPointerException이 날 수 있어요.', '==는 문자열 내용이 아니라 두 참조가 같은 객체인지 비교해요.'],
  '4-2': ['if 본문이 실행돼요.', 'else 본문이 실행돼요.', '어느 본문도 실행되지 않아요.', 'isComplete(3)은 true를 반환하므로 if의 본문으로 들어가요.', 'true는 if 조건을 통과하므로 else 본문이 아니라 if 본문이 실행돼요.', '조건식이 true라 if와 else 양쪽이 모두 실행되지는 않아요.'],
  '2-3': ['B 분기', 'A 분기', 'C 분기', '84는 90 미만이고 80 이상이므로 B 분기가 실행됩니다.', '84는 A 조건인 90 이상을 만족하지 않습니다.', 'B 조건이 참이므로 마지막 else는 실행되지 않습니다.'],
  '2-4': ['true', 'false', '20', '20은 18 이상이고 65 미만이므로 두 조건이 모두 참입니다.', '두 조건이 모두 참이므로 &&의 결과도 참입니다.', '비교와 &&의 결과는 숫자가 아니라 boolean입니다.'],
  '2-5': ['Mon', 'Other', '1', 'day가 1이므로 case 1의 문자열 Mon이 대입됩니다.', 'default는 일치하는 case가 없을 때 선택됩니다.', '1은 day의 값이며 label에 대입되는 결과는 문자열입니다.'],
  '3-1': ['values[2]', 'values[3]', 'values[0]', '원소가 세 개인 배열의 인덱스는 0, 1, 2이므로 마지막은 2입니다.', '인덱스 3은 배열 범위를 벗어납니다.', '인덱스 0은 첫 번째 원소입니다.'],
  '3-2': ['values는 {2, 3} 그대로예요. value는 각 원소 값을 받아 쓰는 지역 변수라 대입해도 배열 원소는 바뀌지 않습니다.', 'values가 {4, 6}으로 바뀌어요.', '배열이 자동으로 두 배 길이가 돼요.', '향상된 for문의 int 반복 변수는 현재 원소 값을 복사해 받으므로 그 변수에 대입해도 배열은 바뀌지 않아요.', '반복 변수 value만 바뀌고 배열 원소에 다시 대입하지 않아요.', '반복문은 배열의 길이를 변경하지 않습니다.'],
  '3-3': ['continue는 현재 반복을 건너뛰고 break는 가장 가까운 반복문을 끝냅니다.', 'continue와 break는 모두 메서드를 끝냅니다.', 'continue는 반복문을 끝내고 break는 현재 반복만 건너뜁니다.', 'continue는 다음 반복으로 넘어가고 break는 반복문을 빠져나갑니다.', '메서드 반환은 return이 담당합니다.', '두 명령의 역할이 서로 바뀌었습니다.'],
  '3-5': ['6번', '3번', '5번', '바깥 반복 두 번마다 안쪽 반복이 세 번 실행되어 2 × 3 = 6번입니다.', '안쪽 반복 세 번이 바깥 반복마다 다시 실행됩니다.', '반복 횟수는 더하지 않고 각 횟수의 곱으로 셉니다.'],
  '4-3': ['음수 경로가 값을 반환하지 않아 컴파일 오류가 납니다.', '음수 경로에서 자동으로 0을 반환합니다.', '호출자가 반환값을 직접 만들어야 합니다.', 'int 반환 메서드가 정상적으로 끝나는 모든 경로에서 int를 반환해야 합니다.', '메서드의 누락된 return에 기본값이 자동으로 추가되지 않습니다.', '호출자 대신 메서드의 모든 정상 경로에서 반환값을 제공해야 합니다.'],
  '5-5': ['필드가 final이고 생성 후 값을 바꾸는 메서드가 없습니다.', 'final이면 가변 객체 내부도 자동으로 불변이 됩니다.', '모든 컬렉션은 자동으로 불변입니다.', '예제는 변경 불가능한 String과 기본형을 final 필드에 담고 변경 메서드를 제공하지 않습니다.', 'final 참조가 가리키는 가변 객체의 내부 상태는 바뀔 수 있습니다.', '가변 컬렉션은 별도로 복사하거나 변경을 제한해야 합니다.'],
  '5-1': ['title 필드', 'createdCount 필드', 'main 메서드', '생성자가 받은 "Java"를 `this.title`에 저장하므로 title이 초기화돼요.', 'createdCount는 클래스 전체가 공유하는 값이라 Course 객체별 제목을 보관하지 않아요.', 'main은 호출 흐름을 시작할 뿐 Course의 제목 상태를 저장하지 않아요.'],
  '5-3': ['`protected int getMinutes()`를 제공한다', '`private int getMinutes()`를 제공한다', '`static` 필드로 바꾼다', '하위 클래스가 상속해 사용할 수 있는 protected 메서드로 읽기 동작을 제공하면서 필드는 private으로 유지해요.', 'private 메서드는 하위 클래스에서 직접 사용할 수 없어요.', 'static은 접근 범위를 정하지 않으며 객체 상태를 캡슐화하는 대안이 아니에요.'],
  '6-2': ['@Override를 붙이고 public void send(String message)를 선언합니다.', '@Override를 붙이고 send()를 선언합니다.', 'private void send(String message)를 선언합니다.', '상위 메서드와 매개변수 목록이 같고 접근 범위를 좁히지 않아야 합니다.', '매개변수 목록이 달라 재정의가 아닌 다른 메서드입니다.', '상위 public 메서드를 private으로 접근 범위를 좁혀 재정의할 수 없습니다.'],
  '6-3': ['Report는 추상 클래스이고 CourseReport가 render를 구현합니다.', 'Report를 직접 new로 생성해야 합니다.', 'CourseReport는 render 구현 없이 일반 클래스로 생성할 수 있습니다.', '일반 하위 클래스는 물려받은 추상 메서드를 구현해야 합니다.', '추상 클래스는 직접 인스턴스화할 수 없습니다.', '추상 메서드를 구현하지 않으면 하위 클래스도 추상이어야 합니다.'],
  '7-1': ['3개예요.', '2개예요.', '1개예요.', 'Mina, Jin, Mina 세 원소를 각각 추가했으므로 List 크기는 3이에요.', '두 번째 Mina도 별도 원소로 남아 크기에 포함돼요.', '중복을 허용하는 List에는 세 번의 add가 세 원소를 만들어요.'],
  '8-3': ['Exception', 'IOException', 'FileNotFoundException', 'Exception은 이 세 타입 중 가장 넓은 상위 타입이에요.', 'IOException은 Exception의 하위 타입이라 더 좁아요.', 'FileNotFoundException은 IOException의 하위 타입이라 가장 구체적이에요.'],
  '9-1': ['두 번 실행돼요.', '선언할 때 한 번 실행되고 run에서 또 한 번 실행돼요.', '실행되지 않아요.', '`task`를 만들 때는 본문이 실행되지 않고 `run()`을 호출한 두 번만 save가 실행돼요.', '람다를 변수에 대입하는 것만으로는 본문이 실행되지 않아요.', '각 run 호출이 Runnable 본문을 한 번 실행합니다.'],
  '9-2': ['false', 'true', '5', '5 % 2는 1이므로 짝수 조건은 false예요.', '5는 2로 나누어떨어지지 않아 짝수 조건이 참이 아니에요.', 'Predicate.test는 숫자 자체가 아니라 조건의 참·거짓을 반환해요.'],
  '6-4': ['public void send(String message)를 구현합니다.', 'private void send(String message)를 구현합니다.', 'send()만 구현합니다.', '인터페이스 메서드를 구현하는 일반 클래스는 같은 계약을 public으로 구현해야 합니다.', 'private은 인터페이스 메서드의 공개 접근 범위를 만족하지 않습니다.', '매개변수가 달라 인터페이스의 send(String)을 구현하지 않습니다.'],
  '6-5': ['실제 객체가 EmailNotifier라 재정의한 메서드가 호출됩니다.', '참조 타입이 Notifier이면 항상 상위 본문만 호출됩니다.', '명시적 형변환을 해야 send를 호출할 수 있습니다.', '인스턴스 메서드의 재정의 호출은 실제 객체의 구현을 선택합니다.', '참조 타입은 호출 가능한 계약을 정하지만 재정의된 구현은 실제 객체에 따라 선택됩니다.', 'Notifier 계약에 send가 있으므로 별도 형변환 없이 호출합니다.'],
  '9-3': ['String을 받아 Integer를 반환합니다.', 'Integer를 받아 String을 반환합니다.', 'String을 받아 boolean만 반환합니다.', 'Function<T, R>의 첫 타입은 입력, 두 번째 타입은 반환값입니다.', '입력과 반환 타입을 거꾸로 읽었습니다. 입력은 String이고 반환은 Integer입니다.', '이 선언의 반환 타입은 boolean이 아니라 Integer입니다.'],
  '9-4': ['문자열 ready를 출력합니다.', 'ready의 길이를 반환합니다.', 'ready가 빈 문자열인지 검사합니다.', '예제의 Consumer는 System.out::println이므로 accept가 전달된 문자열을 출력합니다.', 'Consumer.accept는 값을 반환하지 않으며 이 구현은 출력합니다.', '빈 문자열 검사는 이 Consumer의 구현이 아닙니다.'],
  '10-2': ['각 문자열의 길이를 담은 정수의 흐름', '기준을 통과한 문자열만 남긴 흐름', '문자열을 하나로 합친 단일 값', 'String::length가 각 문자열을 길이인 정수로 변환합니다.', '조건에 따라 원소를 고르는 연산은 filter입니다.', 'map은 각 원소를 변환하며 값을 하나로 합치지 않습니다.'],
  '10-1': ['[60, 85]', '[55, 60, 85]', '[60, 85, 60]', '55는 조건을 통과하지 못하고 60과 85만 남아요.', 'filter는 조건에 맞지 않는 55도 남기지 않습니다.', '입력에 60을 추가한 경우와 달리 기본 예제에는 세 번째 60이 없습니다.'],
  '12-1': ['main의 지역 변수와 호출 상태를 설명하는 스택 프레임', 'new Course가 만드는 객체 인스턴스', '프로그램이 저장한 파일 내용', '지역 변수와 메서드 호출 상태는 일반적인 JVM 설명에서 스택 프레임과 연결해요.', '객체 인스턴스는 이 설명 모델에서 힙과 연결하며 지역 변수와 구분합니다.', '메서드 호출 프레임은 파일 시스템 저장 공간이 아닙니다.'],
  '13-1': ['`data.resolve("courses.txt")`로 하위 경로를 붙입니다.', '경로 문자열에 `/courses.txt`를 직접 이어 붙입니다.', '`Path.of`를 호출하면 파일도 자동으로 생성됩니다.', 'Path.resolve가 운영체제에 맞는 경로 요소 조합을 처리합니다.', '구분자를 직접 붙이면 운영체제별 경로 처리 실수가 생길 수 있어요.', 'Path 객체를 만드는 일과 실제 파일 생성은 별개의 작업입니다.', 0],
  '13-2': ['쓰기와 읽기에 모두 UTF-8 Charset을 지정합니다.', '파일을 저장한 운영체제의 기본 Charset을 추측합니다.', '파일은 어떤 Charset으로 읽어도 같은 문자로 해석됩니다.', '같은 바이트를 같은 문자로 읽으려면 기록과 읽기에 같은 Charset을 써야 합니다.', '운영체제 기본값은 환경에 따라 달라질 수 있어요.', '바이트를 문자로 바꾸는 규칙이 다르면 글자가 깨질 수 있습니다.', 1],
  '13-3': ['`Files.readString`이 IOException 계열 예외를 던질 수 있습니다.', '파일이 없으면 항상 빈 문자열을 반환합니다.', '파일 읽기는 실패하지 않으므로 예외 처리가 필요 없습니다.', '파일이 없거나 읽을 수 없으면 NoSuchFileException 등 IOException 계열 실패가 발생할 수 있어요.', '파일 없음은 빈 파일과 같은 결과가 아닙니다.', '파일 입출력은 경로와 권한에 따라 실패할 수 있습니다.', 2],
  '13-4': ['기존 내용을 지우고 새 문자열을 기록합니다.', '기존 내용 뒤에 새 문자열을 항상 덧붙입니다.', '경로가 없으면 상위 폴더까지 모두 자동 생성합니다.', '기본 옵션은 기존 파일을 비운 뒤 기록하며, 경로가 없으면 파일을 만들 수 있어요.', '추가 기록은 APPEND 옵션을 지정해야 합니다.', 'Files.writeString은 없는 상위 디렉터리까지 자동으로 만들지 않습니다.', 0],
  '13-5': ['`checked=true, read=missing`이 출력됩니다.', '`exists`가 true였으므로 파일 읽기가 반드시 성공합니다.', '파일이 지워졌어도 `read=Java`가 출력됩니다.', '검사 뒤 파일이 삭제되어 readString이 NoSuchFileException을 던지고 catch가 실행됩니다.', 'exists는 이후의 읽기 성공을 예약하지 않습니다.', '코드는 삭제 뒤 실제로 읽으므로 이전 내용을 읽을 수 없습니다.', 1],
  '14-1': ['날짜만 있고 시각·시간대가 필요 없는 마감일은 LocalDate로 표현합니다.', 'Instant로 달력 날짜만 표현합니다.', 'LocalDate에는 시간대가 항상 들어 있습니다.', 'LocalDate는 년·월·일을 표현하고 시각이나 시간대는 포함하지 않아요.', 'Instant는 타임라인상의 한 시점입니다.', 'LocalDate 자체에는 시간대 정보가 없습니다.', 2],
  '14-2': ['LocalDateTime에는 날짜와 시각이 있지만 시간대 정보는 없습니다.', 'LocalDateTime은 UTC 오프셋을 자동으로 포함합니다.', 'LocalDateTime은 날짜 없이 시각만 표현합니다.', 'LocalDateTime만으로는 이 벽시각이 어느 지역의 순간인지 알 수 없어요.', '시간대는 LocalDateTime 값에 자동으로 붙지 않습니다.', '시각만 담는 타입은 LocalTime입니다.', 0],
  '14-3': ['Instant는 시간대 표기와 분리해 타임라인의 한 시점을 표현합니다.', 'Instant는 시간대 없는 벽시각입니다.', 'Instant는 날짜만 저장하고 시각은 저장하지 않습니다.', 'Instant는 UTC 기준 타임라인의 한 시점이며 서로 다른 지역의 시각과 비교할 때 쓸 수 있어요.', '지역의 벽시각을 순간으로 바꾸려면 ZoneId가 필요합니다.', 'Instant에는 날짜와 시각이 모두 포함됩니다.', 1],
  '14-4': ['`Asia/Seoul`의 규칙으로 오전 9시를 `2026-10-11T00:00:00Z`로 변환합니다.', 'ZoneId는 입력한 LocalDateTime을 바꾸지 않고 UTC 문자만 붙입니다.', 'ZoneId는 모든 날짜에 고정된 `+09:00`만 뜻합니다.', '2026년 10월 11일 서울은 UTC보다 9시간 빠르므로 오전 9시는 UTC 자정입니다.', 'atZone은 지역 규칙을 적용해 순간으로 변환합니다.', '지역 시간대에는 날짜에 따라 달라지는 규칙이 포함될 수 있어요.', 2],
  '14-5': ['`plusDays(1)`은 다음 날짜를 담은 새 LocalDate를 돌려줍니다.', '기존 today 객체의 날짜를 직접 바꿉니다.', 'plusDays는 날짜를 바꾸지 않고 long만 반환합니다.', 'java.time 객체는 불변이므로 계산 결과를 새 값으로 받아야 합니다.', '기존 값은 그대로 유지됩니다.', 'plusDays의 반환형은 LocalDate입니다.', 0],
  '15-1': ['`Integer.parseInt("forty")`는 NumberFormatException을 던집니다.', '잘못된 숫자 문자열을 0으로 바꿉니다.', '입력 문자열을 수정해 숫자로 만듭니다.', '정수 형식이 아니면 parseInt가 NumberFormatException으로 실패합니다.', '숫자 형식이 없는 문자열을 0으로 해석하지 않습니다.', 'parseInt는 입력 문자열을 자동으로 보정하지 않습니다.', 1],
  '15-2': ['`Objects.requireNonNull`이 지정한 메시지와 함께 NullPointerException을 던집니다.', 'null을 빈 문자열로 자동 변환합니다.', 'null이면 메시지 없이 정상 반환합니다.', '필수 제목이 null이면 경계에서 즉시 예외를 내고 지정 메시지를 전달합니다.', '이 메서드는 빈 문자열을 만들지 않습니다.', '필수값이 없는데 정상 반환하지 않습니다.', 2],
  '15-3': ['0분은 허용되지 않아 IllegalArgumentException이 발생합니다.', '0은 양수이므로 그대로 반환됩니다.', '잘못된 값은 자동으로 1분으로 고쳐집니다.', '메서드의 조건은 0 이하를 거부하고 양수만 반환합니다.', '0은 양수가 아닙니다.', '코드는 입력을 자동 보정하지 않고 예외로 알립니다.', 0],
  '15-4': ['CourseRequest는 강의 제목과 수업 시간(분)을 한 값으로 묶어 다른 계층에 전달합니다.', 'record를 선언하면 JSON 응답이 자동으로 만들어집니다.', 'DTO는 반드시 데이터베이스에 직접 저장되어야 합니다.', 'record는 값을 묶는 형태만 정해요. JSON 응답으로 바꾸는 일은 별도 도구나 코드가 맡습니다.', 'record 선언만으로 JSON 변환 기능이 생기지는 않습니다.', 'DTO는 데이터를 전달하는 모양을 정하며 저장 위치를 강제하지 않습니다.', 1],
  '15-5': ['실패한 규칙을 설명하되 비밀번호나 토큰 같은 비밀 원문은 넣지 않습니다.', '진단을 위해 모든 내부 값과 토큰을 사용자에게 보여 줍니다.', '오류가 나면 어떤 규칙이 실패했는지 숨깁니다.', '사용자가 고칠 수 있도록 실패 규칙은 알리고 민감한 내부 정보는 제외해야 합니다.', '비밀값 노출은 오류 원인을 알려 주는 데 필요하지 않습니다.', '규칙을 생략하면 사용자가 잘못된 입력을 고치기 어렵습니다.', 2],
  '16-1': ['URI는 서버 주소와 경로·쿼리 같은 요청 대상을 표현하지만, 만들기만 해서는 요청을 보내지 않습니다.', 'URI를 만들면 서버 연결과 요청이 자동으로 시작됩니다.', 'URI에는 경로나 쿼리 정보를 담을 수 없습니다.', 'URI.create는 주소 값을 만듭니다. 실제 통신은 HttpClient로 요청을 보내야 시작돼요.', '주소를 나타내는 값과 실제 네트워크 동작을 혼동했습니다.', 'URI에는 경로와 쿼리 같은 구성 요소가 들어갈 수 있습니다.', 0],
  '16-2': ['`.GET()`은 HttpRequest에 사용할 요청 방식을 GET으로 설정합니다.', '`.GET()`은 응답 상태 코드를 설정합니다.', '`.GET()`을 호출하면 요청이 즉시 전송됩니다.', 'HttpRequest.Builder의 GET은 요청 방식을 설정하고 build는 요청 객체만 만듭니다.', '요청 방식과 서버가 돌려주는 상태 코드는 별도 정보입니다.', '요청을 보내려면 HttpClient.send 또는 sendAsync를 호출해야 합니다.', 1],
  '16-3': ['이 메서드는 200 이상 300 미만인 상태 코드에서 true를 반환합니다.', '상태 코드가 200보다 크기만 하면 모두 true입니다.', '204만 성공으로 판단하고 나머지는 false입니다.', '조건식 `statusCode >= 200 && statusCode < 300`이 2xx 범위를 검사합니다.', '3xx·4xx·5xx는 200 이상이라는 조건만으로 성공 처리할 수 없습니다.', '코드는 특정 값 204가 아니라 범위를 비교합니다.', 2],
  '16-4': ['요청을 보낸 뒤 2초 안에 응답이 오지 않으면 timeout 예외가 발생할 수 있습니다.', '연결을 여는 데 걸리는 시간만 제한하고 응답 대기는 무한히 허용합니다.', 'timeout을 설정하면 서버가 반드시 2초 안에 작업을 마칩니다.', 'HttpRequest.Builder.timeout은 응답 대기 제한이며, 초과하면 send에서 HttpTimeoutException이 발생할 수 있습니다.', '연결 수립 제한은 HttpClient의 connectTimeout과 다른 설정입니다.', '요청 시간 제한은 서버 작업 완료를 보장하지 않습니다.', 0],
  '16-5': ['본문 문자열만으로 실제 응답의 성공 여부를 판단할 수 없습니다. 상태 코드와 예상한 데이터 형식도 확인해야 합니다.', '본문에 Java가 있으면 상태 코드와 관계없이 요청은 성공입니다.', 'SampleResponse 객체를 만들면 실제 서버 응답이 생성됩니다.', '응답 본문은 서버가 준 데이터 일부일 뿐 성공 여부나 형식까지 보장하지 않습니다.', '오류 상태에서도 본문이 함께 올 수 있습니다.', '예제의 SampleResponse는 직접 만든 로컬 객체라 네트워크 응답이 아닙니다.', 1],
  '17-1': ['Arrange에서 준비하고 Act에서 동작을 실행한 뒤 Assert에서 결과를 확인합니다.', 'Assert로 값을 준비하고 Arrange에서 결과를 출력합니다.', 'Act는 예외를 무시하고 다음 테스트를 실행합니다.', '입력과 상태를 준비한 뒤 동작을 실행하고 기대 결과를 확인하는 순서입니다.', '세 단계의 역할과 순서를 서로 바꿨습니다.', '검증은 동작을 실행한 뒤 결과를 비교하는 단계입니다.', 2],
  '17-2': ['빈 목록은 반복문이 한 번도 돌지 않으므로 합계의 시작값 0이 그대로 반환되는지 확인해야 합니다.', '빈 목록은 항상 null을 반환해야 합니다.', '빈 목록은 반복문에서 자동으로 오류가 발생하므로 테스트할 필요가 없습니다.', '빈 입력은 반복문이 실행되지 않는 경계를 확인해 합계 초기값이 반환되는지 보여 줍니다.', '메서드는 null이 아니라 초기화한 정수 합계를 반환합니다.', '빈 목록은 정상적인 입력이며 이 메서드는 0을 돌려줍니다.', 0],
  '17-3': ['잘못된 분 입력에서 parseMinutes가 IllegalArgumentException을 던지는지 확인합니다.', '잘못된 입력이 예외 없이 0으로 바뀌는지 확인합니다.', '정상 입력에서 AssertionError가 발생하는지 확인합니다.', '예외 검증은 실패 상황을 재현하고 기대한 예외 종류가 나오는지 확인합니다.', '예제는 잘못된 입력을 0으로 보정하지 않고 예외로 알립니다.', '정상 입력을 넣어서는 이 예제의 실패 경로를 검사할 수 없습니다.', 1],
  '17-4': ['이 테스트 이름은 빈 목록을 입력했을 때 합계가 0이어야 한다는 조건과 결과를 나타냅니다.', '이 이름만으로는 입력이나 기대 결과를 알 수 없습니다.', '테스트 메서드 이름은 실행 순서를 지정합니다.', '이름에 조건과 기대 결과를 넣으면 실패 보고에서 확인할 규칙을 찾기 쉽습니다.', 'emptyList와 returnsZero가 입력 경계와 기대값을 드러냅니다.', '메서드 이름은 테스트 실행 순서를 정하지 않습니다.', 2],
  '17-5': ['각 테스트가 별도 저장소를 만들어 한 테스트의 데이터가 다른 테스트 결과를 바꾸지 않게 합니다.', '첫 테스트가 만든 데이터를 다음 테스트가 반드시 이어받게 합니다.', '테스트가 끝난 뒤 모든 저장소를 전역 변수에 합칩니다.', '독립된 객체를 사용하면 실행 순서나 이전 테스트의 변경 상태에 덜 의존합니다.', '공유 상태를 전제로 하면 실행 순서에 따라 결과가 달라질 수 있습니다.', '예제는 두 서비스에 서로 다른 저장소 객체를 전달합니다.', 0],
  '18-1': ['강의 데이터는 Course에 두고, 화면에 표시할 문자열 규칙은 CourseFormatter가 맡습니다.', 'Course가 데이터 저장과 모든 화면 표현을 함께 맡아야 합니다.', 'CourseFormatter가 강의 데이터를 영구 저장해야 합니다.', '데이터를 표현하는 책임과 표시 형식을 바꾸는 책임을 나눕니다.', '표시 형식만 바뀌어도 Course를 수정해야 합니다.', 'Formatter는 이 예제에서 저장소 역할을 하지 않습니다.', 1],
  '18-2': ['CourseService는 InMemoryCourseRepository가 아니라 CourseRepository 인터페이스에 의존합니다.', 'CourseService 안에서 InMemoryCourseRepository를 직접 생성해야 합니다.', '인터페이스는 구현이 하나뿐이어야 사용할 수 있습니다.', '상위 기능이 인터페이스 계약을 사용하면 구현을 바꿔 끼우기 쉬워집니다.', '구현체를 서비스 안에서 직접 만들면 대체하기 어려워집니다.', '인터페이스는 구현이 여러 개일 때도 같은 계약으로 다룰 수 있습니다.', 2],
  '18-3': ['ReportService는 Formatter 객체에 출력을 맡기고 생성자에서 사용할 구현을 받습니다.', 'Formatter를 상속해야만 출력 형식을 바꿀 수 있습니다.', 'ReportService가 모든 Formatter 구현을 직접 수정해야 합니다.', '구성은 필요한 동작을 가진 객체를 전달해 함께 사용하게 합니다.', '상속만이 동작 재사용 방법은 아닙니다.', '현재 예제에서 ReportService는 PrefixFormatter를 생성하지 않습니다.', 0],
  '18-4': ['Map에 id가 없으면 findById는 null 대신 `Optional.empty()`를 반환합니다.', '키가 없으면 Optional 안에 null을 넣어 반환합니다.', '키가 없어도 임의의 Course를 새로 만들어 반환합니다.', 'Optional은 조회 결과가 있을 수도 없을 수도 있다는 계약을 드러냅니다.', 'Optional.empty는 값이 없는 결과이며 Optional 자체는 null이 아닙니다.', '조회 메서드는 없는 데이터를 자동 생성하지 않습니다.', 1],
  '18-5': ['공개 반환형을 바꾸기 전에 구현체, 호출 위치, 테스트가 새 계약을 따르는지 확인합니다.', '인터페이스 반환형만 바꾸고 구현체와 호출 코드는 확인하지 않습니다.', '코드 변경 전에는 테스트를 살펴볼 필요가 없습니다.', '인터페이스의 결과 형태가 바뀌면 이를 구현하거나 사용하는 모든 코드가 영향을 받을 수 있습니다.', '컴파일되는 구현체와 호출자는 새 반환형에 맞춰야 합니다.', '테스트는 바뀐 계약과 기존 동작을 확인하는 한 방법입니다.', 0],
  '10-4': ['최종 연산', '중간 연산', '조건 검사 연산', 'toList는 스트림을 소비해 결과 목록을 만드는 최종 연산입니다.', '중간 연산은 스트림을 반환하지만 toList는 List를 반환합니다.', '조건에 맞는 원소를 고르는 filter와 다른 역할입니다.'],
  '11-3': ['2000', '1000', '0', '두 스레드가 각각 1000번 원자적으로 증가하고 모두 끝났으므로 합계는 2000입니다.', '한 스레드의 증가 횟수만 계산했습니다.', 'join으로 두 스레드가 끝난 뒤 값을 읽습니다.'],
  '11-4': ['공유 balance 증가를 잠금으로 감싸 동시 갱신의 충돌을 막습니다.', '각 스레드가 독립적으로 가진 지역 변수를 보호합니다.', '모든 메서드를 자동으로 잠급니다.', '두 스레드가 같은 LOCK을 사용해 balance++ 구간을 한 번에 하나씩 실행합니다.', 'balance는 두 스레드가 공유하는 static 필드입니다.', 'synchronized는 지정한 잠금 구간에만 적용됩니다.'],
  '11-5': ['latch의 카운트가 0이 되어야 정상 반환됩니다.', '스레드가 생성되기만 하면 됩니다.', 'await 호출 즉시 카운트와 관계없이 반환됩니다.', 'CountDownLatch.await는 카운트가 0이 될 때까지 기다립니다. 인터럽트되면 예외가 발생합니다.', '스레드 생성만으로 countDown이 실행된 것은 아닙니다.', '카운트가 0이 되기 전에는 정상적으로 반환되지 않습니다.'],
  '12-2': ['3', '2', '0', 'index가 0, 1, 2일 때 각각 하나씩 추가하므로 크기는 3입니다.', '0도 반복에 포함되므로 두 번이 아니라 세 번 추가합니다.', '반복문은 세 번 실행되어 Point를 세 개 추가합니다.'],
  '12-4': ['전체 경과 시간만으로 비용이 집중된 위치와 측정 변동을 구분할 수 없습니다.', 'nanoTime은 항상 느린 메서드 이름을 반환합니다.', '가장 긴 메서드가 언제나 병목입니다.', '대표 입력을 반복 측정하고 프로파일링하면 비용이 큰 경로를 더 잘 찾을 수 있습니다.', 'nanoTime은 시간 값을 반환할 뿐 메서드별 비용을 알려주지 않습니다.', '소스 길이와 실행 비용은 일치하지 않을 수 있습니다.'],
  '12-5': ['19ms', '20ms', '10.5ms', '최근접 순위 ceil(0.95 × 20)은 19이므로 정렬된 19번째 값은 19ms입니다.', '20ms는 최댓값이고 이 계산의 순위는 19입니다.', '10.5ms는 1부터 20까지의 평균으로, p95가 아닙니다.'],
  '19-1': ['`equals`는 두 문자열의 글자 내용을 비교합니다.', '`==`는 두 String의 글자 내용이 같은지 비교합니다.', '`equalsIgnoreCase`는 대소문자를 구분해 비교합니다.', '두 String 객체가 달라도 내용이 같으면 equals는 true입니다.', '참조 비교 연산자 `==`는 객체의 글자 내용이 아닌 같은 객체인지 확인합니다.', 'equalsIgnoreCase는 대소문자를 무시하므로 이 예제의 비교 규칙과 다릅니다.', 2],
  '19-2': ['`equals`가 true인 두 CourseId는 같은 hashCode를 반환해야 합니다.', 'hashCode가 같은 두 CourseId는 반드시 equals도 true여야 합니다.', '서로 다른 객체는 언제나 서로 다른 hashCode를 가져야 합니다.', 'HashMap이 같은 논리 키를 찾으려면 equals가 같은 객체의 hashCode도 같아야 합니다.', '해시 충돌은 가능하므로 같은 hashCode만으로 두 객체가 같다고 단정할 수 없습니다.', '서로 다른 키가 우연히 같은 hashCode를 가질 수 있습니다.', 0],
  '19-3': ['record는 구성 요소의 접근자와 값 비교 메서드를 자동으로 제공합니다.', 'record는 구성 요소가 모두 가변 객체여도 내부까지 자동 복사합니다.', 'record에는 생성자나 메서드를 추가할 수 없습니다.', 'CourseId의 `value()`는 record 구성 요소를 읽는 접근자입니다.', 'record가 제공하는 복사는 깊은 복사가 아니며 참조형 구성 요소의 내부 변경을 막지 않습니다.', 'record에도 명시적인 생성자와 추가 메서드를 선언할 수 있습니다.', 1],
  '19-4': ['`List.copyOf`는 입력 요소를 담은 변경 불가 목록을 만들고 원본 목록과 분리합니다.', '`final` 필드에 원본 목록을 그대로 넣으면 외부 수정도 막힙니다.', '`List.copyOf`는 목록의 각 요소 객체 내부까지 깊게 복사합니다.', '생성 후 source.clear()를 호출해도 CourseTags가 만든 별도 목록에는 backend가 남습니다.', 'final은 참조 재대입을 막지만 그 참조가 가리키는 목록의 변경까지 막지는 않습니다.', 'List.copyOf는 새 목록의 구조를 제한하지만 요소 객체까지 깊이 복사하지는 않습니다.', 2],
  '19-5': ['HashMap 키의 equals·hashCode에 쓰는 값은 Map에 넣은 뒤 바뀌지 않아야 합니다.', '키 값을 바꾸면 HashMap이 기존 항목의 위치를 자동으로 다시 계산합니다.', 'Map에서 값을 찾을 때는 hashCode와 equals를 확인할 필요가 없습니다.', '조회할 때 새 CourseId를 만들어도 값이 같고 두 메서드가 일관되면 같은 항목을 찾습니다.', 'HashMap은 변경된 키를 자동으로 다시 저장하지 않습니다.', '서로 다른 객체여도 equals와 hashCode가 같은 규칙을 따르면 키 조회가 가능합니다.', 0],
  '20-1': ['Logger의 기준이 INFO일 때 INFO 기록은 허용하고 FINE 기록은 걸러집니다.', 'INFO 기준은 INFO보다 낮은 FINE 기록도 허용합니다.', 'setLevel(INFO)는 INFO 기록을 모두 끕니다.', '예제에서는 isLoggable(INFO)가 true이고 isLoggable(FINE)은 false입니다.', 'FINE은 INFO보다 낮은 상세 수준이라 INFO 기준을 통과하지 않습니다.', '기준 수준 자체인 INFO는 기록 가능한 수준입니다.', 2],
  '20-2': ['Map에 event와 courseId를 별도 키로 저장하면 두 값을 구분해 다룰 수 있습니다.', 'Map에 넣는 즉시 실제 로그 파일이나 관측 시스템으로 전송됩니다.', 'event와 courseId를 한 문자열에만 이어 붙여야 검색할 수 있습니다.', '예제의 Map은 필드를 나눠 보여 주는 모형이며 실제 Logger나 로그 저장소를 호출하지 않습니다.', '값이 저장된 자료 구조와 로그를 기록·전달하는 동작은 서로 다릅니다.', '필드를 분리하면 항목 이름과 값의 관계를 그대로 유지할 수 있습니다.', 1],
  '20-3': ['`LogRecord.setThrown(failure)`은 예외 객체를 기록 항목에 연결합니다.', '`setThrown`은 예외 원인을 메시지 문자열로 바꾸고 원본 객체를 버립니다.', '`LogRecord`를 만들면 연결된 핸들러가 없어도 로그가 자동 전송됩니다.', '예제에서 getThrown()은 연결한 IllegalStateException을 그대로 돌려줍니다.', '이 예제는 LogRecord를 만들고 출력할 뿐 로그 핸들러에 보내지 않습니다.', 'Throwable 객체를 연결하면 기록 항목에서 예외 정보를 확인할 수 있습니다.', 0],
  '20-4': ['토큰이 있으면 원문 대신 `***`를 표시하고 null이나 빈 값은 `(missing)`으로 표시합니다.', '토큰 원문을 그대로 출력해 장애를 분석합니다.', '토큰이 없으면 빈 문자열을 비밀값처럼 마스킹합니다.', '예제는 실제 토큰 abc123을 출력하지 않고 `token=***`를 출력합니다.', '원문을 남기면 로그 접근자가 비밀값을 볼 수 있습니다.', 'redact는 null과 빈 문자열을 `(missing)`으로 처리합니다.', 2],
  '20-5': ['시간 차이 250밀리초는 값 250과 단위 ms로 표시됩니다.', 'Instant 두 개를 빼면 결과는 항상 초 단위 정수입니다.', '측정값에는 단위나 사건 이름을 적지 않는 편이 좋습니다.', '고정된 두 시각의 차이는 `value=250, unit=ms`입니다.', '예제는 Duration.toMillis()를 호출해 밀리초 단위 숫자를 만듭니다.', '사건 이름과 단위가 없으면 숫자의 의미를 확인하기 어렵습니다.', 1],
  '21-1': ['같은 나이 조건이 두 곳에 반복되어 있어 규칙 변경 때 서로 달라질 수 있습니다.', '조건이 두 번 나오므로 현재 출력은 반드시 잘못된 값입니다.', 'boolean 변수는 메서드에서만 선언할 수 있습니다.', '두 조건은 지금 같은 입력과 같은 기준을 사용하므로 출력은 둘 다 true입니다.', '중복 코드는 변경 위험 신호이지 현재 결과가 틀렸다는 증거는 아닙니다.', '이 예제의 두 조건은 모두 age가 20인지 확인하는 계산입니다.', 2],
  '21-2': ['`completedLessons`는 변수에 저장한 값의 역할을 설명합니다.', '한 글자 변수 이름은 의미와 관계없이 항상 읽기 쉽습니다.', '변수 이름에는 반드시 자료형을 반복해 적어야 합니다.', '예제는 completedLessons에 3을 저장해 completed=3을 출력합니다.', '짧은 `n`만으로는 이 정수가 무엇을 세는지 알기 어렵습니다.', '이름에 값의 역할을 적으면 코드를 읽는 사람이 의도를 알기 쉽습니다.', 0],
  '21-3': ['`age >= 18`을 `isAdult`라는 boolean 이름으로 표현합니다.', '조건을 추출하면 비교 결과는 항상 반대로 바뀝니다.', 'isAdult는 age가 18보다 큰 경우에만 true입니다.', 'age가 20이면 isAdult는 true를 출력합니다.', '비교식은 18도 포함하므로 `>`가 아니라 `>=`입니다.', '예제의 식은 정확히 `age >= 18`입니다.', 1],
  '21-4': ['여러 호출 위치에서 같은 분 검사를 쓰도록 `isValidMinutes` 한 곳에 모읍니다.', '검사식을 호출 위치마다 복사해 두면 변경이 더 안전합니다.', 'isValidMinutes는 분이 0보다 작을 때도 true를 반환해야 합니다.', '분 검사 규칙을 바꾸려면 공통 메서드 한 곳을 고치면 됩니다.', '예제의 공통 규칙은 `minutes > 0`입니다.', '복사된 식을 여러 곳에서 따로 수정하면 기준이 서로 달라질 수 있습니다.', 0],
  '21-5': ['커밋 전에 `git diff --cached`로 준비한 변경을 확인합니다.', '`git add`는 파일을 바로 공유 원격 저장소에 올립니다.', '`git commit`은 작업 폴더의 모든 변경을 자동으로 검사하고 배포합니다.', '예제의 명령 순서는 파일 준비, 준비된 변경 검토, 커밋입니다.', 'git add는 지정한 파일 변경을 다음 커밋에 포함할 준비를 합니다.', 'git diff --cached는 준비 영역과 마지막 커밋 사이의 차이를 보여 줍니다.', 2],
  '22-1': ['배열 길이는 2로 고정되고 List는 원소를 추가해 크기를 바꿀 수 있어요.', '배열은 원소를 추가하면 자동으로 길이가 늘어나요.', 'List는 원소를 추가할 수 없고 길이만 고정돼요.', '예제는 배열에 두 값을 두고 List에 세 값을 추가해 길이 2와 크기 3을 출력합니다.', 'Java 배열의 길이는 생성 뒤 바꿀 수 없습니다.', 'ArrayList는 add로 원소를 추가할 수 있어요.', 0],
  '22-2': ['스택은 마지막에 넣은 second를 먼저 꺼내고, 큐는 먼저 넣은 first를 먼저 꺼냅니다.', '스택과 큐 모두 먼저 넣은 first를 먼저 꺼냅니다.', '스택과 큐 모두 값을 정렬한 뒤 꺼냅니다.', 'push 두 번 뒤 pop은 second를, addLast 두 번 뒤 removeFirst는 first를 꺼냅니다.', '스택은 후입선출이라 마지막 값을 먼저 꺼냅니다.', 'Deque는 정렬 기능이 아니라 양쪽 끝 삽입·삭제를 제공합니다.', 1],
  '22-3': ['java 키의 방문 횟수는 2이고 서로 다른 키 수는 2입니다.', 'java 키의 방문 횟수는 1이고 키 수는 3입니다.', 'HashMap은 값을 합산하지 않으므로 java 조회 결과는 null입니다.', 'merge를 두 번 호출해 java 값은 2가 되고 sql까지 두 키가 남습니다.', 'merge의 기존 값 처리 함수 Integer::sum이 두 번의 방문을 합산합니다.', 'java와 sql 두 키만 넣었으므로 keys는 2입니다.', 2],
  '22-4': ['정렬 뒤 scores는 [3, 5, 8]이고 값 5의 인덱스는 1입니다.', '정렬 뒤 scores는 [3, 5, 8]이지만 이진 탐색 결과는 2입니다.', 'Collections.sort는 List를 복사하므로 원본 순서 [8, 3, 5]가 유지됩니다.', 'Collections.sort가 목록을 오름차순으로 정렬하고 binarySearch가 인덱스 1을 찾습니다.', '인덱스는 0부터 시작하므로 5는 두 번째 위치인 1입니다.', '예제는 복사본이 아닌 scores 목록을 직접 정렬합니다.', 0],
  '22-5': ['예제는 선형 탐색에서 7개, 이진 탐색에서 3개 값을 비교합니다.', '선형 탐색에서 3개, 이진 탐색에서 7개 값을 비교합니다.', '두 탐색은 항상 입력 크기와 관계없이 한 번만 비교합니다.', '정렬된 8개 값에서 7은 선형 탐색의 일곱 번째, 이진 탐색의 세 번째 비교에서 발견됩니다.', '선형 탐색은 앞에서부터 비교하므로 7번째 값까지 7회 확인합니다.', '이진 탐색은 가운데를 기준으로 범위를 좁혀 3회 비교합니다.', 1],
  '23-1': ['목록이 정렬되지 않아도 앞에서부터 비교하면 7을 찾고 5는 찾지 못합니다.', '선형 탐색은 목록이 정렬된 경우에만 사용할 수 있습니다.', '선형 탐색은 값을 찾지 못하면 항상 예외를 던집니다.', 'contains는 각 값을 순서대로 비교하므로 정렬되지 않은 목록에서도 동작합니다.', '이 예제는 먼저 정렬하지 않아도 모든 원소를 차례로 검사합니다.', 'contains 메서드는 찾지 못한 경우 false를 반환합니다.', 2],
  '23-2': ['오름차순으로 정렬된 목록에서 5는 인덱스 2에 있습니다.', '정렬된 목록에서 5는 인덱스 3에 있습니다.', '이진 탐색은 중복 값이 없는 배열에서만 사용할 수 있습니다.', '목록 [1, 3, 5, 7, 9]는 정렬되어 있고 5의 인덱스는 2입니다.', '인덱스는 0부터 세므로 세 번째 값 5의 위치는 2입니다.', 'Collections.binarySearch는 List에도 사용할 수 있습니다.', 0],
  '23-3': ['Comparator.comparing(Course::title)이 제목을 오름차순으로 정렬해 [Algorithms, Java]를 출력합니다.', 'Comparator는 두 Course의 제목이 같은지만 검사해 정렬하지 않습니다.', 'Comparator가 제목을 내림차순으로 정렬해 [Java, Algorithms]를 출력합니다.', '제목의 사전식 순서로 Algorithms가 Java보다 먼저 옵니다.', 'Comparator.comparing은 지정한 비교 기준으로 목록을 정렬합니다.', '예제의 comparator에는 reversed가 없어 제목 오름차순입니다.', 1],
  '23-4': ['찾은 값이 여러 개면 Collections.binarySearch는 그중 어느 인덱스를 돌려줄지 보장하지 않습니다.', '중복 값이 있으면 항상 첫 번째 인덱스를 돌려줍니다.', '중복 값이 있으면 자동으로 목록에서 모두 제거합니다.', '이 예제는 값이 존재하는지만 확인하고 첫 위치라고 단정하지 않습니다.', 'API 문서는 같은 값이 여러 개일 때 반환 인덱스를 특정하지 않습니다.', '검색은 목록을 수정하거나 중복 원소를 제거하지 않습니다.', 2],
  '23-5': ['시작 인덱스 1은 포함하고 끝 인덱스 4는 제외해 [1, 2, 3]을 선택합니다.', '시작 인덱스 1은 제외하고 끝 인덱스 4는 포함해 [2, 3, 4]를 선택합니다.', '끝 인덱스가 4이므로 인덱스 0부터 4까지 선택합니다.', '반복 조건 index < end라서 1, 2, 3만 목록에 추가됩니다.', '반열린 구간은 시작을 포함하고 끝은 포함하지 않습니다.', 'startInclusive는 1이므로 인덱스 0은 선택하지 않습니다.', 0],
  '24-1': ['factorial(5)는 120이고 음수 입력은 IllegalArgumentException을 던집니다.', 'factorial(5)는 15이고 음수는 0을 반환합니다.', 'factorial(5)는 24이고 음수 입력도 정상 계산합니다.', '5부터 1까지 곱하면 120이며 음수는 메서드 시작에서 거부됩니다.', '팩토리얼은 더하기가 아니라 5×4×3×2×1을 계산합니다.', '음수 입력에 0을 기본값으로 돌려주지 않고 예외를 던집니다.', 1],
  '24-2': ['sumTo(5)는 15이고 sumTo(0)은 0입니다. 음수 입력은 거부합니다.', 'sumTo(5)는 5이고 sumTo(0)은 1입니다.', 'sumTo(5)는 15이고 sumTo(-1)도 0으로 조용히 처리합니다.', '각 호출에서 n을 하나 줄여 더하면 5+4+3+2+1=15이고 0에서 끝납니다.', '재귀 결과에는 현재 n과 더 작은 입력의 결과가 함께 들어갑니다.', '음수 입력은 유효한 합계로 취급하지 않고 IllegalArgumentException을 던집니다.', 2],
  '24-3': ['요청 깊이 5는 결과 5이고 음수 깊이는 IllegalArgumentException으로 거부됩니다.', '요청 깊이 5는 결과 4이고 음수는 계속 재귀합니다.', '요청 깊이 5는 결과 120입니다.', '각 재귀 단계에서 1을 더하고 0에서 멈추므로 깊이 5가 반환됩니다.', '5단계의 호출 수를 세어 5를 반환합니다.', '음수에서 0까지 감소시키면 종료 조건에 도달하지 못하므로 입력을 먼저 거부해야 합니다.', 0],
  '24-4': ['정렬된 입력에서 값 7의 인덱스 3을 돌려주고 없으면 -1을 돌려줍니다.', '값 7을 찾지 못해도 항상 인덱스 0을 돌려줍니다.', '이진 탐색은 정렬되지 않은 입력에서도 결과를 보장합니다.', 'values[3]이 7이므로 검색 결과는 3입니다.', '검색 범위가 빌 때까지 찾지 못한 경우 -1을 반환합니다.', '가운데 값을 버리는 판단은 오름차순 정렬 전제에 의존합니다.', 1],
  '24-5': ['반복으로 계산한 factorial(5)는 120이고 long 범위를 넘으면 ArithmeticException을 던집니다.', 'factorial(5)는 120이고 곱셈이 넘쳐도 결과를 그대로 반환합니다.', '반복문은 factorial(5)를 15로 계산합니다.', 'Math.multiplyExact가 각 곱셈에서 long 범위를 검사합니다.', '21!처럼 long 범위를 넘는 결과는 예외로 알립니다.', '2부터 5까지 차례로 곱하면 120입니다.', 2],
};

const questionVersionOverrides = {
  '1-3': { choice: 4, short: 3 },
  '2-1': { choice: 4, short: 3 },
  '2-2': { choice: 3, short: 3 },
  '2-5': { short: 3 },
  '3-2': { choice: 3 },
  '3-5': { short: 3 },
  '4-1': { short: 3 },
  '4-2': { short: 3 },
  '4-3': { short: 3 },
  '4-5': { short: 3 },
  '5-1': { short: 3 },
  '5-2': { short: 3 },
  '5-3': { short: 3 },
  '6-3': { short: 3 },
  '7-1': { choice: 3, short: 3 },
  '7-3': { short: 3 },
  '8-3': { choice: 3 },
  '9-1': { choice: 3 },
  '9-2': { choice: 3 },
  '9-3': { short: 3 },
  '10-1': { choice: 3, short: 3 },
  '10-3': { short: 3 },
  '10-5': { short: 3 },
  '11-1': { short: 3 },
  '11-2': { short: 3 },
  '11-5': { short: 3 },
  '12-1': { short: 3 },
  '12-2': { short: 3 },
  '12-3': { short: 3 },
  '12-5': { short: 3 },
  '25-1': { short: 2 },
  '25-2': { short: 2 },
  '25-5': { short: 2 },
};

function conceptChoice(id, title, knowledge, focusedNotes) {
  const [answer, reason, firstWrong, secondWrong] = knowledge;
  const concept = focusedNotes?.concept;
  const prompt = typeof concept === 'string' ? concept : concept?.prompt;
  const hint = concept?.hint ?? focusedNotes?.conceptHint;
  const match = id.match(/java-w(\d+)-d(\d+)-choice/);
  const focusedOptions = match && focusedConceptOptions[`${match[1]}-${match[2]}`];
  if (focusedOptions) {
    const [correct, wrongOne, wrongTwo, correctWhy, wrongOneWhy, wrongTwoWhy, answerIndex = 1] = focusedOptions;
    const options = [[wrongOne, wrongOneWhy], [correct, correctWhy], [wrongTwo, wrongTwoWhy]];
    const [correctOption] = options.splice(1, 1);
    options.splice(answerIndex, 0, correctOption);
    return choice(id, `${title} 판단`, prompt, options, answerIndex,
      hint ?? '예제의 입력과 실행 순서를 확인해 보세요.', correctWhy);
  }
  const wrongWhy = concept?.wrongWhy ?? focusedNotes?.conceptWrongWhy;
  const explanation = concept?.explanation;
  return choice(id, `${title} 판단`, prompt ?? `${title} 상황에서 가장 타당한 선택은 무엇인가요?`, [
    [firstWrong, wrongWhy?.[0] ?? '이 선택은 이 상황의 핵심 제약을 만족하지 않거나, 서로 다른 개념을 혼동합니다.'],
    [answer, reason],
    [secondWrong, wrongWhy?.[1] ?? '일부 상황에서는 관련이 있을 수 있지만, 이 문제의 요구를 직접 해결하지는 못합니다.'],
  ], 1, hint ?? '코드가 표현해야 할 값의 성격, 실패 가능성, 또는 계약을 먼저 확인해 보세요.', explanation ?? (concept ? `${reason} ${focusedNotes.intro}` : `${reason} 이 근거를 예제의 타입·메서드·비교식과 연결해 보세요.`));
}

function errorQuestion(id, title, code, line, correction) {
  return locateError(id, `${title} 오류 위치`, '아래 코드에서 의도와 맞지 않아 수정해야 하는 줄을 고르세요.', 'Java', code, [line], '값의 범위, null 가능성, 또는 호출 순서가 코드의 약속과 맞는지 한 줄씩 확인해 보세요.', `${line}번 줄을 \`${correction}\`로 고쳐야 합니다. 이 수정은 코드가 표현하려는 규칙과 실제 실행 경로를 맞춥니다.`);
}

const koreanRecallAliases = {
  initialization: ['초기화', '변수 초기화'], double: ['배정밀도 실수', '더블'], boolean: ['불리언', '논리형'], cast: ['형변환', '타입 변환'],
  comparison: ['비교 연산', '비교 연산자'], equals: ['문자열 내용 비교', '동등 비교'], '&&': ['논리 AND', '논리 그리고'], 'for-each': ['향상된 for문'],
  parameter: ['매개변수'], overloading: ['메서드 오버로딩'], constructor: ['생성자'], immutable: ['불변 객체', '불변성'], polymorphism: ['다형성'],
  exception: ['예외'], 'method reference': ['메서드 참조'], 'terminal operation': ['최종 연산'], allocation: ['할당'],
  filter: ['필터링'], map: ['매핑', '변환'], flatMap: ['평탄화', '평면화'],
  LocalDate: ['날짜'], LocalDateTime: ['날짜와 시간'], Instant: ['순간', '시점'], AAA: ['준비 실행 검증'],
  'status code': ['상태 코드'], 'response body': ['응답 본문'], boundary: ['경계값'], 'dependency inversion': ['의존성 역전'],
  composition: ['구성'], 'call site': ['호출 위치'], 'mutable key': ['가변 키'], 'log level': ['로그 수준'], 'stack trace': ['스택 트레이스'],
  metric: ['측정 지표'], 'code smell': ['코드 냄새'], naming: ['이름 짓기', '명명'], 'extract variable': ['변수 추출'],
  complexity: ['복잡도'], 'linear search': ['선형 탐색'], 'binary search': ['이진 탐색'], 'half-open range': ['반열린 구간', '시작 포함 끝 제외'],
  'base case': ['기저 조건'], 'recursive call': ['재귀 호출'], iteration: ['반복'], requirements: ['요구사항'],
  'ubiquitous language': ['도메인 용어', '보편 언어'], 'method contract': ['메서드 계약'], scenario: ['시나리오'],
  'control flow': ['제어 흐름'], reproduction: ['재현 조건'], 'trade-off': ['트레이드오프', '절충'], retrospective: ['회고'],
};

function recallQuestion(id, title, phrase, question) {
  // The Java identifier/API remains valid, and the Korean wording displayed
  // in the lesson is accepted for learners who know the concept but not its English label yet.
  const acceptedAnswers = [...new Set([phrase, ...(koreanRecallAliases[phrase] ?? []), title])];
  return shortAnswer(id, `${title} 핵심어`, question, acceptedAnswers, '이 세션의 제목과 예제에서 설명한 규칙을 함께 떠올려 보세요.', `정답은 \`${phrase}\`입니다. 이 개념을 사용할 때의 전제와 예외 상황도 실제 코드에서 확인해야 해요.`);
}

function applicationChoice(id, title, knowledge) {
  const [answer, reason, firstWrong, secondWrong] = knowledge;
  const explanation = `${reason} 오늘의 코드 예제에서 이 원칙이 입력과 결과에 어떻게 연결되는지 다시 확인해 보세요.`;
  const [, weekText, dayText] = id.match(/java-w(\d+)-d(\d+)/) ?? [];
  const answerIndex = weekText && dayText ? ((Number(weekText) - 1) * 5 + Number(dayText) - 1) % 3 : 1;
  const options = [
    [firstWrong, '이 설명은 오늘 배운 규칙을 유지하지 못하거나 다른 개념을 혼동합니다.'],
    [answer, explanation],
    [secondWrong, '이 선택은 관련된 개념일 수 있지만 질문에서 요구한 규칙을 설명하지 않습니다.'],
  ];
  const [correctOption] = options.splice(1, 1);
  options.splice(answerIndex, 0, correctOption);
  return choice(id, `${title} · 다른 상황에 적용`, `오늘의 ${title} 예제를 다른 입력이나 호출자에 적용할 때도 맞는 설명은 무엇인가요?`, options, answerIndex, '예제의 입력·결과와 오늘의 규칙을 연결해 같은 원칙이 적용되는지 확인하세요.', explanation);
}

const completeWeeksThirteenToFifteenExamples = {
  'Path 만들기': `class PathCreateExample {
  public static void main(String[] args) {
    java.nio.file.Path data = java.nio.file.Path.of("data");
    java.nio.file.Path courseFile = data.resolve("courses.txt");
    System.out.println(courseFile.getFileName()); // courses.txt
  }
}`,
  '문자 인코딩': `class TextEncodingExample {
  public static void main(String[] args) throws java.io.IOException {
    java.nio.file.Path file = java.nio.file.Files.createTempFile("lesson-", ".txt");
    try {
      java.nio.file.Files.writeString(file, "첫 강의", java.nio.charset.StandardCharsets.UTF_8);
      String title = java.nio.file.Files.readString(file, java.nio.charset.StandardCharsets.UTF_8);
      System.out.println(title); // 첫 강의
    } finally {
      java.nio.file.Files.deleteIfExists(file);
    }
  }
}`,
  '파일 읽기': `class FileReadExample {
  public static void main(String[] args) throws java.io.IOException {
    java.nio.file.Path file = java.nio.file.Files.createTempFile("lesson-", ".txt");
    try {
      java.nio.file.Files.writeString(file, "Java", java.nio.charset.StandardCharsets.UTF_8);
      String text = java.nio.file.Files.readString(file, java.nio.charset.StandardCharsets.UTF_8);
      System.out.println("read=" + text); // read=Java
    } finally {
      java.nio.file.Files.deleteIfExists(file);
    }
  }
}`,
  '파일 쓰기': `class FileWriteExample {
  public static void main(String[] args) throws java.io.IOException {
    java.nio.file.Path file = java.nio.file.Files.createTempFile("lesson-", ".txt");
    try {
      writeCourse(file, "Java NIO");
      System.out.println(java.nio.file.Files.readString(file, java.nio.charset.StandardCharsets.UTF_8)); // Java NIO
    } finally {
      java.nio.file.Files.deleteIfExists(file);
    }
  }

  static java.nio.file.Path writeCourse(java.nio.file.Path path, String text) throws java.io.IOException {
    return java.nio.file.Files.writeString(path, text, java.nio.charset.StandardCharsets.UTF_8);
  }
}`,
  '존재 여부와 오류': `class FileExistenceExample {
  public static void main(String[] args) throws java.io.IOException {
    java.nio.file.Path file = java.nio.file.Files.createTempFile("lesson-", ".txt");
    try {
      java.nio.file.Files.writeString(file, "Java", java.nio.charset.StandardCharsets.UTF_8);
      boolean existedAtCheck = java.nio.file.Files.exists(file);
      java.nio.file.Files.delete(file); // 다른 작업이 검사 직후 파일을 바꾼 상황을 재현해요.
      try {
        java.nio.file.Files.readString(file, java.nio.charset.StandardCharsets.UTF_8);
        System.out.println("read=Java");
      } catch (java.nio.file.NoSuchFileException exception) {
        System.out.println("checked=" + existedAtCheck + ", read=missing"); // checked=true, read=missing
      }
    } finally {
      java.nio.file.Files.deleteIfExists(file);
    }
  }
}`,
  'LocalDate': `class LocalDateExample {
  public static void main(String[] args) {
    java.time.LocalDate due = java.time.LocalDate.of(2026, 10, 11);
    java.time.LocalDate nextDay = due.plusDays(1);
    System.out.println(due + " -> " + nextDay); // 2026-10-11 -> 2026-10-12
  }
}`,
  'LocalDateTime': `class LocalDateTimeExample {
  public static void main(String[] args) {
    java.time.LocalDateTime meeting = java.time.LocalDateTime.of(2026, 10, 11, 9, 0);
    System.out.println(meeting); // 2026-10-11T09:00
  }
}`,
  'Instant': `class InstantExample {
  public static void main(String[] args) {
    java.time.Instant createdAt = java.time.Instant.parse("2026-10-11T00:00:00Z");
    System.out.println(createdAt); // 2026-10-11T00:00:00Z
  }
}`,
  'ZoneId': `class ZoneIdExample {
  public static void main(String[] args) {
    java.time.LocalDateTime meeting = java.time.LocalDateTime.of(2026, 10, 11, 9, 0);
    java.time.ZoneId seoul = java.time.ZoneId.of("Asia/Seoul");
    java.time.Instant moment = meeting.atZone(seoul).toInstant();
    System.out.println(moment); // 2026-10-11T00:00:00Z
  }
}`,
  '시간 계산': `class DateCalculationExample {
  public static void main(String[] args) {
    java.time.LocalDate today = java.time.LocalDate.of(2026, 10, 11);
    java.time.LocalDate due = today.plusDays(1);
    long remainingDays = java.time.temporal.ChronoUnit.DAYS.between(today, due);
    System.out.println("due=" + due + ", days=" + remainingDays); // due=2026-10-12, days=1
  }
}`,
  '문자열 파싱': `class IntegerParsingExample {
  public static void main(String[] args) {
    for (String input : new String[] {"45", "forty"}) {
      try {
        int minutes = Integer.parseInt(input);
        System.out.println("minutes=" + minutes);
      } catch (NumberFormatException exception) {
        System.out.println("invalid integer");
      }
    }
    // minutes=45
    // invalid integer
  }
}`,
  'null 경계': `class NullBoundaryExample {
  public static void main(String[] args) {
    try {
      requiredTitle(null);
    } catch (NullPointerException exception) {
      System.out.println(exception.getMessage()); // 제목이 필요합니다
    }
  }

  static String requiredTitle(String title) {
    return java.util.Objects.requireNonNull(title, "제목이 필요합니다");
  }
}`,
  '입력 검증': `class InputValidationExample {
  public static void main(String[] args) {
    try {
      System.out.println(requirePositiveMinutes(30)); // 30
      requirePositiveMinutes(0);
    } catch (IllegalArgumentException exception) {
      System.out.println(exception.getMessage()); // 분은 양수여야 합니다 (입력값: 0)
    }
  }

  static int requirePositiveMinutes(int minutes) {
    if (minutes <= 0) throw new IllegalArgumentException("분은 양수여야 합니다 (입력값: " + minutes + ")");
    return minutes;
  }
}`,
  'DTO의 역할': `class CourseRequestExample {
  record CourseRequest(String title, int minutes) {}

  public static void main(String[] args) {
    CourseRequest request = toRequest("Java", 30);
    System.out.println(request); // CourseRequest[title=Java, minutes=30] — record의 기본 문자열이며 JSON 응답은 아니에요.
  }

  static CourseRequest toRequest(String title, int minutes) {
    return new CourseRequest(title, minutes);
  }
}`,
  '오류 메시지 설계': `class ErrorMessageExample {
  public static void main(String[] args) {
    try {
      requirePositiveMinutes(-1);
    } catch (IllegalArgumentException exception) {
      System.out.println(exception.getMessage()); // 분은 양수여야 합니다 (입력값: -1)
    }
  }

  static int requirePositiveMinutes(int minutes) {
    if (minutes <= 0) throw new IllegalArgumentException("분은 양수여야 합니다 (입력값: " + minutes + ")");
    return minutes;
  }
}`,
};

const repairSpecs = [
  ['clampAttempts', 'int attempts', 'return Math.max(0, attempts);', 'Math\.max[ \t]*\([ \t]*0[ \t]*,[ \t]*attempts[ \t]*\)'],
  ['sameText', 'String left, String right', 'return left.equals(right);', 'left\.equals[ \t]*\([ \t]*right[ \t]*\)'],
  ['lastIndex', 'int[] values', 'return values.length - 1;', 'values\.length[ \t]*-[ \t]*1'],
  ['absolute', 'int value', 'return value < 0 ? -value : value;', 'value[ \t]*<[ \t]*0[ \t]*\?[ \t]*-[ \t]*value[ \t]*:[ \t]*value'],
  ['hasTitle', 'String title', 'return !title.isBlank();', '!title\.isBlank[ \t]*\([ \t]*\)'],
  ['canSend', 'Notifier notifier', 'notifier.send("ready");', 'notifier\.send[ \t]*\([ \t]*"ready"[ \t]*\)'],
  ['hasTag', 'Set<String> tags, String tag', 'return tags.contains(tag);', 'tags\.contains[ \t]*\([ \t]*tag[ \t]*\)'],
  ['readOrEmpty', 'String text', 'return text == null ? "" : text;', 'text[ \t]*==[ \t]*null[ \t]*\?[ \t]*""[ \t]*:[ \t]*text'],
  ['isEven', 'int value', 'return value % 2 == 0;', 'value[ \t]*%[ \t]*2[ \t]*==[ \t]*0'],
  ['doubleValue', 'int value', 'return value * 2;', 'value[ \t]*\*[ \t]*2'],
  ['nextCount', 'AtomicInteger count', 'return count.incrementAndGet();', 'count\.incrementAndGet[ \t]*\([ \t]*\)'],
  ['elapsed', 'long started', 'return System.nanoTime() - started;', 'System\.nanoTime[ \t]*\([ \t]*\)[ \t]*-[ \t]*started'],
  ['child', 'Path directory', 'return directory.resolve("courses.txt");', 'directory\.resolve[ \t]*\([ \t]*"courses\.txt"[ \t]*\)'],
  ['tomorrow', 'LocalDate date', 'return date.plusDays(1);', 'date\.plusDays[ \t]*\([ \t]*1[ \t]*\)'],
  ['minutes', 'String input', 'return Integer.parseInt(input);', 'Integer\.parseInt[ \t]*\([ \t]*input[ \t]*\)'],
  ['ok', 'int status', 'return status >= 200 && status < 300;', 'status[ \t]*>=[ \t]*200[ \t]*&&[ \t]*status[ \t]*<[ \t]*300'],
  ['emptySum', 'List<Integer> values', 'return values.stream().mapToInt(Integer::intValue).sum();', 'values\.stream[\s\S]*mapToInt[\s\S]*sum'],
  ['eligible', 'int age', 'return age >= 18;', 'age[ \t]*>=[ \t]*18'],
  ['sameId', 'CourseId left, CourseId right', 'return left.equals(right);', 'left\.equals[ \t]*\([ \t]*right[ \t]*\)'],
  ['safeLabel', 'String label', 'return label.replace("token", "***");', 'label\.replace[ \t]*\([ \t]*"token"[ \t]*,[ \t]*"\*\*\*"[ \t]*\)'],
  ['trimmed', 'String value', 'return value.trim();', 'value\.trim[ \t]*\([ \t]*\)'],
  ['completed', 'Map<String, Integer> done, String track', 'return done.getOrDefault(track, 0);', 'done\.getOrDefault[ \t]*\([ \t]*track[ \t]*,[ \t]*0[ \t]*\)'],
  ['found', 'List<Integer> sorted, int target', 'return Collections.binarySearch(sorted, target);', 'Collections\.binarySearch[ \t]*\([ \t]*sorted[ \t]*,[ \t]*target[ \t]*\)'],
  ['factorial', 'int n', 'return n <= 1 ? 1 : n * factorial(n - 1);', 'n[ \t]*<=[ \t]*1[\s\S]*factorial'],
  ['nextLevel', 'int completed', 'return completed + 1;', 'completed[ \t]*\+[ \t]*1'],
  ['needsReview', 'int wrongAnswers', 'return wrongAnswers > 0;', 'wrongAnswers[ \t]*>[ \t]*0'],
];

const completeWeeksSevenToNineExamples = {
  'List와 순서': `class ListOrderExample {
  public static void main(String[] args) {
    java.util.List<String> names = new java.util.ArrayList<>();
    names.add("Mina");
    names.add("Jin");
    names.add("Mina");
    System.out.println(names); // [Mina, Jin, Mina]
  }
}`,
  'Set과 중복': `class SetDuplicateExample {
  public static void main(String[] args) {
    java.util.Set<String> tags = new java.util.HashSet<>();
    tags.add("java");
    tags.add("collections");
    tags.add("java");
    System.out.println(tags.size() + ", has-java=" + tags.contains("java")); // 2, has-java=true
  }
}`,
  'Map과 키': `class MapLookupExample {
  public static void main(String[] args) {
    java.util.Map<String, Integer> minutesByCourse = new java.util.HashMap<>();
    minutesByCourse.put("Java", 40);
    minutesByCourse.put("Python", 35);
    System.out.println(minutesByCourse.get("Java")); // 40
  }
}`,
  '제네릭 경계': `class ComparableBoundExample {
  public static void main(String[] args) {
    System.out.println(max(2, 5)); // 5
  }

  static <T extends Comparable<T>> T max(T left, T right) {
    return left.compareTo(right) >= 0 ? left : right;
  }
}`,
  '컬렉션 순회': `class IteratorRemoveExample {
  public static void main(String[] args) {
    java.util.List<String> names = new java.util.ArrayList<>(java.util.Arrays.asList("Java", "Python"));
    java.util.Iterator<String> iterator = names.iterator();
    while (iterator.hasNext()) {
      if (iterator.next().equals("Python")) iterator.remove();
    }
    System.out.println(names); // [Java]
  }
}`,
  '예외 흐름': `class ExceptionFlowExample {
  public static void main(String[] args) {
    try {
      validateMinutes(-1);
    } catch (IllegalArgumentException exception) {
      System.out.println(exception.getMessage()); // minutes must be positive
    }
  }

  static void validateMinutes(int minutes) {
    if (minutes <= 0) throw new IllegalArgumentException("minutes must be positive");
  }
}`,
  'checked 예외 읽기': `class CheckedExceptionExample {
  public static void main(String[] args) {
    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.StringReader("Java\\n"));
    try {
      System.out.println(reader.readLine()); // Java
    } catch (java.io.IOException exception) {
      System.out.println("read failed");
    }
  }
}`,
  'catch 순서': `class CatchOrderExample {
  public static void main(String[] args) {
    try {
      throw new java.io.FileNotFoundException("courses.txt");
    } catch (java.io.FileNotFoundException exception) {
      System.out.println("file missing"); // file missing
    } catch (java.io.IOException exception) {
      System.out.println("read failed");
    } catch (Exception exception) {
      System.out.println("unexpected failure");
    }
  }
}`,
  'try-with-resources': `class TryWithResourcesExample {
  public static void main(String[] args) throws java.io.IOException {
    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.StringReader("Java\\n"));
    try (java.io.BufferedReader resource = reader) {
      System.out.println(resource.readLine()); // Java
    }
  }
}`,
  '예외에 맥락 더하기': `class ExceptionCauseExample {
  public static void main(String[] args) {
    try {
      throw new java.io.IOException("disk unavailable");
    } catch (java.io.IOException cause) {
      IllegalStateException wrapped = new IllegalStateException("course load failed", cause);
      System.out.println(wrapped.getMessage() + ": " + wrapped.getCause().getMessage()); // course load failed: disk unavailable
    }
  }
}`,
  '람다 문법': `class RunnableLambdaExample {
  public static void main(String[] args) {
    Runnable task = () -> save();
    task.run(); // saved
  }

  static void save() {
    System.out.println("saved");
  }
}`,
  'Predicate와 조건': `class PredicateExample {
  public static void main(String[] args) {
    java.util.function.Predicate<Integer> even = number -> number % 2 == 0;
    System.out.println(even.test(4)); // true
  }
}`,
  'Function 변환': `class FunctionExample {
  public static void main(String[] args) {
    java.util.function.Function<String, Integer> length = String::length;
    System.out.println(length.apply("Java")); // 4
  }
}`,
  'Consumer 부작용': `class ConsumerExample {
  public static void main(String[] args) {
    java.util.function.Consumer<String> print = System.out::println;
    print.accept("ready"); // ready
  }
}`,
  '메서드 참조': `class MethodReferenceExample {
  public static void main(String[] args) {
    java.util.List<String> names = java.util.Arrays.asList("Mina", "Jin");
    names.forEach(System.out::println);
    // Mina
    // Jin
  }
}`,
};

const completeWeeksTenToTwelveExamples = {
  filter: `class StreamFilterExample {
  public static void main(String[] args) {
    java.util.List<Integer> scores = java.util.Arrays.asList(55, 60, 85);
    java.util.List<Integer> passing = scores.stream()
        .filter(score -> score >= 60)
        .collect(java.util.stream.Collectors.toList());
    System.out.println(passing); // [60, 85]
  }
}`,
  map: `class StreamMapExample {
  public static void main(String[] args) {
    java.util.List<String> names = java.util.Arrays.asList("Mina", "Jin");
    java.util.List<Integer> lengths = names.stream()
        .map(String::length)
        .collect(java.util.stream.Collectors.toList());
    System.out.println(lengths); // [4, 3]
  }
}`,
  flatMap: `class StreamFlatMapExample {
  public static void main(String[] args) {
    java.util.List<String> lines = java.util.Arrays.asList("Java APIs", "clean code");
    java.util.List<String> words = lines.stream()
        .flatMap(line -> java.util.Arrays.stream(line.split(" ")))
        .collect(java.util.stream.Collectors.toList());
    System.out.println(words); // [Java, APIs, clean, code]
  }
}`,
  'collect와 toList': `class StreamToListExample {
  public static void main(String[] args) {
    java.util.List<String> names = java.util.Arrays.asList("ann", "bob");
    // Stream.toList() is available from Java 16 and returns an unmodifiable list.
    java.util.List<String> upper = names.stream().map(String::toUpperCase).toList();
    System.out.println(upper); // [ANN, BOB]
  }
}`,
  '스트림 재사용 금지': `class StreamReuseExample {
  public static void main(String[] args) {
    java.util.List<String> names = java.util.Arrays.asList("Mina", "Jin");
    long count = names.stream().count();
    java.util.List<String> upper = names.stream()
        .map(String::toUpperCase)
        .collect(java.util.stream.Collectors.toList());
    System.out.println("count=" + count + ", upper=" + upper); // count=2, upper=[MINA, JIN]
  }
}`,
  '스레드와 작업': `class ThreadTaskExample {
  public static void main(String[] args) throws InterruptedException {
    Runnable task = () -> System.out.println("work finished");
    Thread worker = new Thread(task);
    worker.start();
    worker.join();
    // Java 21+: Thread.ofVirtual().start(task) can suit many blocking I/O tasks.
  }
}`,
  '가시성의 문제': `class VisibilityExample {
  private static volatile boolean stopped;

  public static void main(String[] args) throws InterruptedException {
    Thread worker = new Thread(() -> {
      while (!stopped) Thread.yield();
      System.out.println("stopped"); // stopped
    });
    worker.start();
    stopped = true;
    worker.join();
  }
}`,
  '원자적 카운터': `class AtomicCounterExample {
  public static void main(String[] args) {
    java.util.concurrent.atomic.AtomicInteger count = new java.util.concurrent.atomic.AtomicInteger();
    Runnable increment = () -> {
      for (int index = 0; index < 1_000; index++) count.incrementAndGet();
    };
    Thread first = new Thread(increment);
    Thread second = new Thread(increment);
    first.start();
    second.start();
    try {
      first.join();
      second.join();
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      return;
    }
    System.out.println(count.get()); // 2000
  }
}`,
  '동기화 범위': `class SynchronizedBlockExample {
  private static final Object LOCK = new Object();
  private static int balance;

  public static void main(String[] args) throws InterruptedException {
    Runnable deposit = () -> {
      for (int index = 0; index < 1_000; index++) {
        synchronized (LOCK) {
          balance++;
        }
      }
    };
    Thread first = new Thread(deposit);
    Thread second = new Thread(deposit);
    first.start();
    second.start();
    first.join();
    second.join();
    System.out.println(balance); // 2000
  }
}`,
  '완료 신호 테스트': `class CompletionSignalExample {
  public static void main(String[] args) throws InterruptedException {
    java.util.concurrent.CountDownLatch finished = new java.util.concurrent.CountDownLatch(1);
    Thread worker = new Thread(finished::countDown);
    worker.start();
    finished.await();
    System.out.println("done"); // done
  }
}`,
  '힙과 스택 개념': `class HeapAndStackExample {
  public static void main(String[] args) {
    Course course = new Course("Java");
    int completed = 2;
    System.out.println(course.title + ":" + completed); // Java:2
  }

  static class Course {
    final String title;
    Course(String title) { this.title = title; }
  }
}`,
  '할당 관찰': `class AllocationExample {
  public static void main(String[] args) {
    java.util.List<Point> points = new java.util.ArrayList<>();
    for (int index = 0; index < 3; index++) {
      points.add(new Point(index, index));
    }
    System.out.println("points=" + points.size()); // points=3
  }

  static class Point {
    final int x;
    final int y;
    Point(int x, int y) { this.x = x; this.y = y; }
  }
}`,
  '워밍업의 의미': `class WarmupExample {
  public static void main(String[] args) {
    long checksum = 0;
    for (int run = 0; run < 10_000; run++) checksum += calculate(run);
    System.out.println(checksum); // 49995000
    // Repeating a path can warm a runtime; it does not guarantee a particular JIT decision.
  }

  static int calculate(int value) { return value; }
}`,
  '프로파일링 질문': `class ProfilingExample {
  public static void main(String[] args) {
    long started = System.nanoTime();
    runTask();
    long elapsed = System.nanoTime() - started;
    System.out.println(elapsed >= 0); // true
    // One timing sample does not identify a hot path; profile representative workloads.
  }

  static void runTask() {
    long checksum = 0;
    for (int index = 0; index < 1_000; index++) checksum += index;
  }
}`,
  '측정 결과 해석': `class PercentileExample {
  public static void main(String[] args) {
    java.util.List<Integer> millis = new java.util.ArrayList<>();
    for (int value = 1; value <= 20; value++) millis.add(value);
    java.util.Collections.sort(millis);
    int rank = (int) Math.ceil(0.95 * millis.size());
    int p95 = millis.get(rank - 1);
    System.out.println("p95=" + p95 + " ms"); // p95=19 ms
  }
}`,
};

const completeWeeksSixteenToEighteenExamples = {
  'URI 구성': `class UriRequestExample {
  public static void main(String[] args) {
    java.net.URI target = java.net.URI.create("https://example.com/courses?language=java");
    System.out.println(target.getPath() + "?" + target.getQuery()); // /courses?language=java
    // URI creation alone does not send a network request.
  }
}`,
  '요청 메서드': `class HttpMethodExample {
  public static void main(String[] args) {
    java.net.URI target = java.net.URI.create("https://example.com/courses");
    java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder(target).GET().build();
    System.out.println(request.method()); // GET
    // Building a request does not send it.
  }
}`,
  '상태 코드': `class StatusCodeExample {
  public static void main(String[] args) {
    int statusCode = 204; // 고정된 예시 응답이며 실제 서버 호출은 하지 않아요.
    boolean successful = isSuccessfulStatus(statusCode);
    System.out.println("status=" + statusCode + ", success=" + successful); // status=204, success=true
  }

  static boolean isSuccessfulStatus(int statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
}`,
  'timeout': `class RequestTimeoutExample {
  public static void main(String[] args) {
    java.net.URI target = java.net.URI.create("https://example.com/courses");
    java.net.http.HttpRequest request = timeoutRequest(target);
    System.out.println("timeout=" + request.timeout().get() + ", method=" + request.method()); // timeout=PT2S, method=GET
    // Building a request does not send it; timeout applies when a client sends it.
  }

  static java.net.http.HttpRequest timeoutRequest(java.net.URI uri) {
    return java.net.http.HttpRequest.newBuilder(uri)
        .timeout(java.time.Duration.ofSeconds(2))
        .GET()
        .build();
  }
}`,
  '응답 본문 확인': `class ResponseBodyExample {
  public static void main(String[] args) {
    SampleResponse response = new SampleResponse("Java"); // 로컬 고정값으로 응답 본문 읽기만 보여 줘요.
    String body = response.body();
    System.out.println("body=" + body); // body=Java
  }

  static final class SampleResponse {
    private final String body;

    SampleResponse(String body) {
      this.body = body;
    }

    String body() {
      return body;
    }
  }
}`,
  'Arrange Act Assert': `class ArrangeActAssertExample {
  public static void main(String[] args) {
    int left = 2;
    int right = 3; // Arrange: 입력을 준비해요.
    int result = add(left, right); // Act: 동작을 실행해요.
    assertEquals(5, result); // Assert: 결과를 검증해요.
    System.out.println("passed: add"); // passed: add
  }

  static int add(int left, int right) {
    return left + right;
  }

  static void assertEquals(int expected, int actual) {
    if (expected != actual) throw new AssertionError("expected=" + expected + ", actual=" + actual);
  }
}`,
  '경계값': `class BoundaryTestExample {
  public static void main(String[] args) {
    int total = sum(java.util.Collections.<Integer>emptyList());
    assertEquals(0, total);
    System.out.println("empty sum=" + total); // empty sum=0
  }

  static int sum(java.util.List<Integer> values) {
    int total = 0;
    for (int value : values) total += value;
    return total;
  }

  static void assertEquals(int expected, int actual) {
    if (expected != actual) throw new AssertionError("expected=" + expected + ", actual=" + actual);
  }
}`,
  '예외 검증': `class ExceptionAssertionExample {
  public static void main(String[] args) {
    assertThrows(IllegalArgumentException.class, () -> parseMinutes("x"));
    System.out.println("passed: invalid input throws"); // passed: invalid input throws
  }

  static int parseMinutes(String input) {
    try {
      return Integer.parseInt(input);
    } catch (NumberFormatException exception) {
      throw new IllegalArgumentException("minutes must be an integer", exception);
    }
  }

  static void assertThrows(Class<? extends RuntimeException> expected, Runnable action) {
    try {
      action.run();
    } catch (RuntimeException exception) {
      if (expected.isInstance(exception)) return;
      throw new AssertionError("unexpected exception", exception);
    }
    throw new AssertionError("expected " + expected.getSimpleName());
  }
}`,
  '테스트 이름': `class TestNameExample {
  public static void main(String[] args) {
    emptyList_returnsZero();
    System.out.println("passed: emptyList_returnsZero"); // passed: emptyList_returnsZero
  }

  static void emptyList_returnsZero() {
    assertEquals(0, sum(java.util.Collections.<Integer>emptyList()));
  }

  static int sum(java.util.List<Integer> values) {
    int total = 0;
    for (int value : values) total += value;
    return total;
  }

  static void assertEquals(int expected, int actual) {
    if (expected != actual) throw new AssertionError("expected=" + expected + ", actual=" + actual);
  }
}`,
  '독립성': `class IndependentTestsExample {
  public static void main(String[] args) {
    CourseService firstTest = new CourseService(new CourseRepository());
    CourseService secondTest = new CourseService(new CourseRepository());
    firstTest.add("Java");
    System.out.println("first=" + firstTest.count() + ", second=" + secondTest.count()); // first=1, second=0
  }

  static final class CourseRepository {
    private final java.util.List<String> courses = new java.util.ArrayList<>();

    void add(String title) {
      courses.add(title);
    }

    int count() {
      return courses.size();
    }
  }

  static final class CourseService {
    private final CourseRepository repository;

    CourseService(CourseRepository repository) {
      this.repository = repository;
    }

    void add(String title) {
      repository.add(title);
    }

    int count() {
      return repository.count();
    }
  }
}`,
  '한 가지 책임': `class SingleResponsibilityExample {
  public static void main(String[] args) {
    Course course = new Course("Java");
    CourseFormatter formatter = new CourseFormatter();
    System.out.println(formatter.format(course)); // Java
  }

  static final class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    String title() {
      return title;
    }
  }

  static final class CourseFormatter {
    String format(Course course) {
      return course.title();
    }
  }
}`,
  '의존성 역전': `class DependencyInversionExample {
  public static void main(String[] args) {
    java.util.Map<String, Course> courses = new java.util.HashMap<>();
    courses.put("java", new Course("Java"));
    CourseRepository repository = new InMemoryCourseRepository(courses);
    CourseService service = new CourseService(repository);
    System.out.println(service.findTitle("java")); // Java
    System.out.println(service.findTitle("sql")); // (missing)
  }

  interface CourseRepository {
    java.util.Optional<Course> find(String id);
  }

  static final class InMemoryCourseRepository implements CourseRepository {
    private final java.util.Map<String, Course> courses;

    InMemoryCourseRepository(java.util.Map<String, Course> courses) {
      this.courses = courses;
    }

    public java.util.Optional<Course> find(String id) {
      return java.util.Optional.ofNullable(courses.get(id));
    }
  }

  static final class CourseService {
    private final CourseRepository repository;

    CourseService(CourseRepository repository) {
      this.repository = repository;
    }

    String findTitle(String id) {
      return repository.find(id).map(Course::title).orElse("(missing)");
    }
  }

  static final class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    String title() {
      return title;
    }
  }
}`,
  '구성으로 재사용': `class CompositionExample {
  public static void main(String[] args) {
    ReportService service = new ReportService(new PrefixFormatter());
    System.out.println(service.render("Java")); // Report: Java
  }

  interface Formatter {
    String format(String title);
  }

  static final class PrefixFormatter implements Formatter {
    public String format(String title) {
      return "Report: " + title;
    }
  }

  static final class ReportService {
    private final Formatter formatter;

    ReportService(Formatter formatter) {
      this.formatter = formatter;
    }

    String render(String title) {
      return formatter.format(title);
    }
  }
}`,
  '명시적 계약': `class ExplicitContractExample {
  public static void main(String[] args) {
    java.util.Map<String, Course> courses = new java.util.HashMap<>();
    courses.put("java", new Course("Java"));
    System.out.println("missing=" + findById(courses, "sql").isPresent()); // missing=false
  }

  static java.util.Optional<Course> findById(java.util.Map<String, Course> courses, String id) {
    return java.util.Optional.ofNullable(courses.get(id));
  }

  static final class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    String title() {
      return title;
    }
  }
}`,
  '변경 영향 찾기': `class ChangeImpactExample {
  public static void main(String[] args) {
    java.util.Map<String, Course> courses = new java.util.HashMap<>();
    courses.put("java", new Course("Java"));
    CourseRepository repository = new InMemoryCourseRepository(courses);
    java.util.Optional<Course> course = repository.findById("java"); // 이 호출부도 공개 계약 변경의 영향을 받아요.
    System.out.println("found=" + course.isPresent() + ", title=" + course.map(Course::title).orElse("(missing)")); // found=true, title=Java
    System.out.println("missing=" + repository.findById("sql").isPresent()); // missing=false
  }

  interface CourseRepository {
    java.util.Optional<Course> findById(String id);
  }

  static final class InMemoryCourseRepository implements CourseRepository {
    private final java.util.Map<String, Course> courses;

    InMemoryCourseRepository(java.util.Map<String, Course> courses) {
      this.courses = courses;
    }

    public java.util.Optional<Course> findById(String id) {
      return java.util.Optional.ofNullable(courses.get(id));
    }
  }

  static final class Course {
    private final String title;

    Course(String title) {
      this.title = title;
    }

    String title() {
      return title;
    }
  }
}`,
};

const completeWeeksNineteenToTwentyOneExamples = {
  'equals 의미': `class EqualsMeaningExample {
  public static void main(String[] args) {
    String left = "java";
    String right = new String("java");
    System.out.println("same=" + left.equals(right)); // same=true
  }
}`,
  'hashCode 규약': `class HashCodeContractExample {
  public static void main(String[] args) {
    CourseId inserted = new CourseId("java");
    CourseId lookup = new CourseId("java");
    java.util.Map<CourseId, String> titles = new java.util.HashMap<>();
    titles.put(inserted, "Java");
    System.out.println("title=" + titles.get(lookup)); // title=Java
  }

  static final class CourseId {
    private final String value;

    CourseId(String value) { this.value = value; }

    @Override
    public boolean equals(Object other) {
      if (this == other) return true;
      if (!(other instanceof CourseId)) return false;
      return value.equals(((CourseId) other).value);
    }

    @Override
    public int hashCode() { return java.util.Objects.hash(value); }
  }
}`,
  'record 값 모델': `class RecordValueExample {
  public static void main(String[] args) {
    CourseId id = new CourseId("java");
    System.out.println("id=" + id.value()); // id=java
  }

  // Record classes became a permanent Java feature in Java 16.
  record CourseId(String value) {}
}`,
  '방어적 복사': `class DefensiveCopyExample {
  public static void main(String[] args) {
    java.util.List<String> source = new java.util.ArrayList<>();
    source.add("backend");
    CourseTags tags = new CourseTags(source);
    source.clear();
    System.out.println("tags=" + tags.values()); // tags=[backend]
  }

  static final class CourseTags {
    private final java.util.List<String> values;

    CourseTags(java.util.List<String> values) {
      this.values = java.util.List.copyOf(values); // List.copyOf requires Java 10+.
    }

    java.util.List<String> values() { return values; }
  }
}`,
  '컬렉션 키 주의': `class StableMapKeyExample {
  public static void main(String[] args) {
    java.util.Map<CourseId, String> titles = new java.util.HashMap<>();
    titles.put(new CourseId("java"), "Java");
    String title = titles.get(new CourseId("java"));
    System.out.println("title=" + title); // title=Java
  }

  static final class CourseId {
    private final String value;

    CourseId(String value) { this.value = value; }

    @Override
    public boolean equals(Object other) {
      if (this == other) return true;
      if (!(other instanceof CourseId)) return false;
      return value.equals(((CourseId) other).value);
    }

    @Override
    public int hashCode() { return value.hashCode(); }
  }
}`,
  '로그 수준': `class LogLevelExample {
  public static void main(String[] args) {
    java.util.logging.Logger logger = java.util.logging.Logger.getLogger("course");
    logger.setLevel(java.util.logging.Level.INFO);
    boolean infoEnabled = logger.isLoggable(java.util.logging.Level.INFO);
    boolean fineEnabled = logger.isLoggable(java.util.logging.Level.FINE);
    System.out.println("info=" + infoEnabled + ", fine=" + fineEnabled); // info=true, fine=false
  }
}`,
  '구조화된 맥락': `class LogContextExample {
  public static void main(String[] args) {
    java.util.Map<String, String> context = new java.util.LinkedHashMap<>();
    context.put("event", "course.loaded");
    context.put("courseId", "java");
    System.out.println("event=" + context.get("event") + ", courseId=" + context.get("courseId"));
    // event=course.loaded, courseId=java. Fields stay separate until a logger formats them.
  }
}`,
  '예외 기록': `class LogExceptionExample {
  public static void main(String[] args) {
    IllegalStateException failure = new IllegalStateException("repository unavailable");
    java.util.logging.LogRecord record = new java.util.logging.LogRecord(
        java.util.logging.Level.SEVERE, "course load failed");
    record.setThrown(failure);
    System.out.println("level=" + record.getLevel().getName()
        + ", cause=" + record.getThrown().getMessage());
    // level=SEVERE, cause=repository unavailable. This example creates a record; it does not send it to a handler.
  }
}`,
  '민감 정보': `class SensitiveLogExample {
  public static void main(String[] args) {
    String token = "abc123"; // 예시 비밀값이며 실제 자격 증명을 사용하지 않아요.
    System.out.println("token=" + redact(token)); // token=***
    System.out.println("missing=" + redact(null)); // missing=(missing)
  }

  static String redact(String token) {
    return token == null || token.isEmpty() ? "(missing)" : "***";
  }
}`,
  '측정 가능한 사건': `class MeasuredEventExample {
  public static void main(String[] args) {
    java.time.Instant started = java.time.Instant.parse("2026-01-01T10:00:00Z");
    java.time.Instant finished = java.time.Instant.parse("2026-01-01T10:00:00.250Z");
    long elapsedMs = java.time.Duration.between(started, finished).toMillis();
    System.out.println("event=course.load, value=" + elapsedMs + ", unit=ms");
    // event=course.load, value=250, unit=ms
  }
}`,
  '냄새 찾기': `class CodeSmellExample {
  public static void main(String[] args) {
    int age = 20;
    boolean eligible = age >= 18;
    boolean canEnroll = age >= 18; // 같은 규칙이 두 곳에 반복돼요.
    System.out.println("eligible=" + eligible + ", canEnroll=" + canEnroll);
    // eligible=true, canEnroll=true
  }
}`,
  '의미 있는 이름': `class MeaningfulNameExample {
  public static void main(String[] args) {
    int completedLessons = 3;
    System.out.println("completed=" + completedLessons); // completed=3
  }
}`,
  '조건 추출': `class ExtractConditionExample {
  public static void main(String[] args) {
    int age = 20;
    boolean isAdult = age >= 18;
    System.out.println("isAdult=" + isAdult); // isAdult=true
  }
}`,
  '중복 제거': `class RemoveDuplicationExample {
  public static void main(String[] args) {
    boolean canCreate = canCreateCourse(30);
    boolean canExtend = canExtendCourse(0);
    System.out.println("canCreate=" + canCreate + ", canExtend=" + canExtend);
    // canCreate=true, canExtend=false
  }

  static boolean canCreateCourse(int minutes) {
    return isValidMinutes(minutes);
  }

  static boolean canExtendCourse(int minutes) {
    return isValidMinutes(minutes);
  }

  static boolean isValidMinutes(int minutes) {
    return minutes > 0;
  }
}`,
};

const completeWeeksTwentyTwoToTwentyFourExamples = {
  '배열과 목록': `class ArrayAndListExample {
  public static void main(String[] args) {
    int[] fixedScores = { 3, 5 };
    java.util.List<Integer> flexibleScores = new java.util.ArrayList<>();
    flexibleScores.add(3);
    flexibleScores.add(5);
    flexibleScores.add(8);
    System.out.println("arrayLength=" + fixedScores.length + ", listSize=" + flexibleScores.size());
    // arrayLength=2, listSize=3
  }
}`,
  '스택과 큐': `class StackAndQueueExample {
  public static void main(String[] args) {
    java.util.Deque<String> stack = new java.util.ArrayDeque<>();
    stack.push("first");
    stack.push("second");
    String mostRecent = stack.pop();

    java.util.Deque<String> queue = new java.util.ArrayDeque<>();
    queue.addLast("first");
    queue.addLast("second");
    String nextWaiting = queue.removeFirst();
    System.out.println("stack=" + mostRecent + ", queue=" + nextWaiting);
    // stack=second, queue=first
  }
}`,
  '해시 기반 조회': `class HashMapLookupExample {
  public static void main(String[] args) {
    java.util.Map<String, Integer> visits = new java.util.HashMap<>();
    visits.merge("java", 1, Integer::sum);
    visits.merge("java", 1, Integer::sum);
    visits.put("sql", 1);
    System.out.println("java=" + visits.get("java") + ", keys=" + visits.size());
    // java=2, keys=2
  }
}`,
  '정렬된 자료': `class SortedDataExample {
  public static void main(String[] args) {
    java.util.List<Integer> scores = new java.util.ArrayList<>(java.util.Arrays.asList(8, 3, 5));
    java.util.Collections.sort(scores);
    int position = java.util.Collections.binarySearch(scores, 5);
    System.out.println("scores=" + scores + ", position=" + position);
    // scores=[3, 5, 8], position=1
  }
}`,
  '복잡도 비교': `class ComplexityComparisonExample {
  public static void main(String[] args) {
    int[] sorted = { 1, 2, 3, 4, 5, 6, 7, 8 };
    int target = 7;
    int linearChecks = linearSearch(sorted, target);
    int binaryChecks = binarySearchChecks(sorted, target);
    System.out.println("linearChecks=" + linearChecks + ", binaryChecks=" + binaryChecks
        + ", growth=O(n)/O(log n)");
    // linearChecks=7, binaryChecks=3, growth=O(n)/O(log n)
  }

  static int linearSearch(int[] values, int target) {
    int checks = 0;
    for (int value : values) {
      checks++;
      if (value == target) return checks;
    }
    return checks;
  }

  static int binarySearchChecks(int[] sorted, int target) {
    int low = 0;
    int high = sorted.length - 1;
    int checks = 0;
    while (low <= high) {
      int middle = low + (high - low) / 2;
      checks++;
      if (sorted[middle] == target) return checks;
      if (sorted[middle] < target) low = middle + 1;
      else high = middle - 1;
    }
    return checks;
  }
}`,
  '선형 탐색': `class LinearSearchExample {
  public static void main(String[] args) {
    java.util.List<Integer> values = java.util.Arrays.asList(4, 7, 2, 9);
    System.out.println("contains7=" + contains(values, 7) + ", contains5=" + contains(values, 5));
    // contains7=true, contains5=false
  }

  static boolean contains(java.util.List<Integer> values, int target) {
    for (int value : values) {
      if (value == target) return true;
    }
    return false;
  }
}`,
  '이진 탐색 전제': `class BinarySearchPreconditionExample {
  public static void main(String[] args) {
    java.util.List<Integer> sorted = java.util.Arrays.asList(1, 3, 5, 7, 9);
    int index = java.util.Collections.binarySearch(sorted, 5);
    System.out.println("found=" + (index >= 0) + ", index=" + index);
    // found=true, index=2
  }
}`,
  '정렬 비교': `class ComparatorSortExample {
  public static void main(String[] args) {
    java.util.List<Course> courses = new java.util.ArrayList<>();
    courses.add(new Course("Java"));
    courses.add(new Course("Algorithms"));
    courses.sort(java.util.Comparator.comparing(Course::title));
    System.out.println(courses); // [Algorithms, Java]
  }

  static final class Course {
    private final String title;

    Course(String title) { this.title = title; }

    String title() { return title; }

    @Override
    public String toString() { return title; }
  }
}`,
  '중복 값': `class DuplicateSearchExample {
  public static void main(String[] args) {
    java.util.List<Integer> sorted = java.util.Arrays.asList(1, 2, 2, 2, 4);
    int anyMatchingIndex = java.util.Collections.binarySearch(sorted, 2);
    System.out.println("found=" + (anyMatchingIndex >= 0)); // found=true
    // binarySearch does not promise the first index when duplicates exist.
  }
}`,
  '오프바이원 검사': `class HalfOpenRangeExample {
  public static void main(String[] args) {
    java.util.List<Integer> values = java.util.Arrays.asList(0, 1, 2, 3, 4);
    int startInclusive = 1;
    int end = 4; // end is excluded from the selected range.
    java.util.List<Integer> selected = new java.util.ArrayList<>();
    for (int index = startInclusive; index < end; index++) selected.add(values.get(index));
    System.out.println("selected=" + selected); // selected=[1, 2, 3]
  }
}`,
  '기저 조건': `class RecursionBaseCaseExample {
  public static void main(String[] args) {
    System.out.println("factorial(5)=" + factorial(5)); // factorial(5)=120
  }

  static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be non-negative");
    if (n <= 1) return 1L;
    return Math.multiplyExact(n, factorial(n - 1));
  }
}`,
  '재귀 호출': `class RecursiveCallExample {
  public static void main(String[] args) {
    System.out.println("sumTo(5)=" + sumTo(5)); // sumTo(5)=15
  }

  static long sumTo(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be non-negative");
    if (n == 0) return 0L;
    return n + sumTo(n - 1);
  }
}`,
  '스택 깊이': `class RecursionDepthExample {
  public static void main(String[] args) {
    int requestedDepth = 5;
    System.out.println("depth=" + countDepth(requestedDepth)); // depth=5
    // A safe maximum recursion depth depends on the runtime and call stack; 100,000 is not a portable limit.
  }

  static int countDepth(int remaining) {
    if (remaining < 0) throw new IllegalArgumentException("remaining must be non-negative");
    if (remaining == 0) return 0;
    return 1 + countDepth(remaining - 1);
  }
}`,
  '분할 정복': `class DivideAndConquerExample {
  public static void main(String[] args) {
    int[] sorted = { 1, 3, 5, 7, 9 };
    System.out.println("index=" + search(sorted, 7)); // index=3
  }

  static int search(int[] values, int target) {
    int left = 0;
    int right = values.length - 1;
    while (left <= right) {
      int middle = left + (right - left) / 2;
      if (values[middle] == target) return middle;
      if (values[middle] < target) left = middle + 1;
      else right = middle - 1;
    }
    return -1;
  }
}`,
  '반복으로 바꾸기': `class IterativeFactorialExample {
  public static void main(String[] args) {
    System.out.println("factorial(5)=" + factorial(5)); // factorial(5)=120
  }

  static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be non-negative");
    long result = 1;
    for (int value = 2; value <= n; value++) result = Math.multiplyExact(result, value);
    return result;
  }
}`,
};

const completeWeeksTwentyFiveToTwentySixExamples = {
  '요구사항 분해': `class RequirementBreakdownExample {
  public static void main(String[] args) {
    System.out.println("nextLevel(0)=" + nextLevel(0)); // nextLevel(0)=1
    System.out.println("nextLevel(3)=" + nextLevel(3)); // nextLevel(3)=4
  }

  // 입력: 완료한 단원 수, 규칙: 음수는 거부하고 1 증가, 출력: 다음 단원 번호
  static int nextLevel(int completed) {
    if (completed < 0) throw new IllegalArgumentException("completed must be non-negative");
    return Math.addExact(completed, 1);
  }
}`,
  '도메인 용어': `class DomainLanguageExample {
  // record는 Java 16부터 제공돼요. 값 전달용 데이터 모델이며 자동 검증기는 아니에요.
  record CourseProgress(int completedLessons) {}

  public static void main(String[] args) {
    CourseProgress progress = new CourseProgress(3);
    System.out.println(progress.completedLessons()); // 3
    System.out.println(progress); // CourseProgress[completedLessons=3]
  }
}`,
  '메서드 계약': `class MethodContractExample {
  static class Course {}

  interface CourseRepository {
    java.util.Optional<Course> findById(String id);
  }

  public static void main(String[] args) {
    CourseRepository repository = id -> "java".equals(id)
      ? java.util.Optional.of(new Course())
      : java.util.Optional.empty();
    System.out.println("found=" + repository.findById("java").isPresent()); // found=true
    System.out.println("missing=" + repository.findById("unknown").isPresent()); // missing=false
  }
}`,
  '오류 정책': `class ErrorPolicyExample {
  public static void main(String[] args) {
    System.out.println("valid=" + requirePositiveId(42)); // valid=42
    try {
      requirePositiveId(0);
    } catch (IllegalArgumentException exception) {
      System.out.println("invalid=" + exception.getMessage()); // invalid=id must be positive
    }
  }

  static int requirePositiveId(int id) {
    if (id <= 0) throw new IllegalArgumentException("id must be positive");
    return id;
  }
}`,
  '예제 시나리오': `class ExampleScenarioExample {
  public static void main(String[] args) {
    checkNextLevel(0);  // 정상 경계: 1
    checkNextLevel(3);  // 정상 사례: 4
    checkNextLevel(-1); // 실패 사례: 거부
  }

  static void checkNextLevel(int completed) {
    try {
      System.out.println(completed + " -> " + nextLevel(completed));
    } catch (IllegalArgumentException exception) {
      System.out.println(completed + " -> rejected");
    }
  }

  static int nextLevel(int completed) {
    if (completed < 0) throw new IllegalArgumentException("completed must be non-negative");
    return Math.addExact(completed, 1);
  }
}`,
  '코드 읽기': `class CompletionSummary {
  public static void main(String[] args) {
    java.util.List<Boolean> completed = java.util.Arrays.asList(true, false, true);
    long count = completed.stream().filter(Boolean::booleanValue).count();
    System.out.println("completed=" + count + "/" + completed.size()); // completed=2/3
  }
}`,
  '오류 진단': `class ReproductionExample {
  public static void main(String[] args) {
    int expected = 4;
    int actualBeforeFix = nextLevelBeforeFix(3);
    System.out.println("before: expected=" + expected + ", actual=" + actualBeforeFix); // before: expected=4, actual=3

    int actualAfterFix = nextLevel(3);
    System.out.println("after: expected=" + expected + ", actual=" + actualAfterFix); // after: expected=4, actual=4
  }

  static int nextLevelBeforeFix(int completed) { return completed; }
  static int nextLevel(int completed) {
    if (completed < 0) throw new IllegalArgumentException("completed must be non-negative");
    return Math.addExact(completed, 1);
  }
}`,
  '설계 선택': `class DesignChoiceExample {
  public static void main(String[] args) {
    java.util.Map<String, Integer> progressByTrack = new java.util.LinkedHashMap<>();
    progressByTrack.put("java", 8);
    progressByTrack.put("python", 5);
    System.out.println("java=" + progressByTrack.get("java")); // java=8
  }
}`,
  '성능 가설': `class PerformanceHypothesisExample {
  public static void main(String[] args) {
    long started = System.nanoTime();
    long result = sumTo(100000);
    long elapsed = elapsedNanos(started);
    System.out.println("sum=" + result); // sum=5000050000
    System.out.println("elapsedNanos=" + elapsed + " (one observation, not a benchmark)");
  }

  static long sumTo(int limit) {
    long sum = 0;
    for (int value = 1; value <= limit; value++) sum += value;
    return sum;
  }

  static long elapsedNanos(long started) {
    return System.nanoTime() - started;
  }
}`,
  '학습 회고': `class LearningRetrospectiveExample {
  public static void main(String[] args) {
    java.util.Map<String, Integer> mistakesByTopic = new java.util.LinkedHashMap<>();
    mistakesByTopic.put("exceptions", 3);
    mistakesByTopic.put("collections", 1);
    mistakesByTopic.put("loops", 0);

    String nextTopic = topicWithMostMistakes(mistakesByTopic);
    System.out.println("review next: " + nextTopic + " (" + mistakesByTopic.get(nextTopic) + " mistakes)");
    // review next: exceptions (3 mistakes)
  }

  static String topicWithMostMistakes(java.util.Map<String, Integer> mistakesByTopic) {
    String selected = null;
    int highestCount = -1;
    for (java.util.Map.Entry<String, Integer> entry : mistakesByTopic.entrySet()) {
      if (entry.getValue() > highestCount) {
        selected = entry.getKey();
        highestCount = entry.getValue();
      }
    }
    if (selected == null) throw new IllegalArgumentException("at least one topic is required");
    return selected;
  }
}`,
};

const focusedJavaFoundationNotes = {
  '변수 선언과 초기화': {
    intro: '`attempts`를 0으로 초기화한 뒤 바로 출력해 0이 나옵니다. 선언은 이름과 타입을 정하고, 초기화는 첫 값을 정한다는 차이를 예제에서 확인해요.',
    concept: { prompt: '`int attempts;`만 선언한 지역 변수를 첫 대입 전에 읽으려 합니다. 어떤 일이 생기나요?', hint: '선언과 초기화는 달라요. 지역 변수는 필드처럼 기본값을 자동으로 받지 않습니다.' },
    recall: { prompt: '변수에 처음 사용할 값을 대입해 읽을 수 있는 상태로 만드는 일을 무엇이라고 하나요?', accepted: ['초기화', '변수 초기화', 'initialization'], hint: '선언과 함께 `= 0`처럼 첫 값을 정하는 단계예요.', explanation: '초기화는 변수가 처음 사용할 값을 갖도록 정하는 과정이에요. 예제에서는 `attempts`를 0으로 초기화합니다.' },
  },
  '정수·실수 타입': {
    intro: '`5 / 2`는 정수 나눗셈이라 2이고, `5 / 2.0`은 실수 연산이라 2.5예요. 소수 결과가 필요한지 입력의 범위·정밀도와 함께 판단해요.',
    concept: { prompt: '`int left = 5; int right = 2;`에서 나눗셈 결과에 소수 부분이 필요합니다. 알맞은 방법은 무엇인가요?', hint: '결과 변수만 double로 바꿔도 정수 나눗셈에서 버려진 소수는 돌아오지 않아요.', wrongWhy: ['int끼리 나누면 먼저 소수 부분을 버리는 정수 나눗셈이 돼요.', 'boolean은 참·거짓을 표현하며 수치 계산 타입이 아니에요.'] },
    recall: { prompt: '정수 5를 정수 2로 나눈 Java 식 `5 / 2`의 결과는 무엇인가요?', accepted: ['2'], hint: 'int 나눗셈에서는 소수 부분이 유지되지 않아요.', explanation: '`5 / 2`는 정수 나눗셈이므로 결과는 정수 2예요. 소수 결과가 필요하면 `5 / 2.0`처럼 실수 연산을 해야 합니다.' },
    application: { prompt: '`int total = 5;`에서 평균을 소수로 계산해 2.5를 얻으려면 어떤 식을 쓰나요?', correct: '`total / 2.0`을 계산해 실수 결과를 얻어요.', correctWhy: '실수 리터럴이 연산에 참여하므로 정수 나눗셈처럼 소수 부분을 버리지 않아요.', wrong: ['`total / 2`를 계산한 뒤 결과를 double에 넣어요.', '`total % 2`를 사용해 평균을 구해요.'], wrongWhy: ['결과 변수만 double이어도 int끼리의 나눗셈은 먼저 2가 됩니다.', '%는 나머지를 계산하므로 평균이 아니에요.'], hint: '결과 변수의 타입보다 나눗셈 피연산자의 타입을 먼저 보세요.' },
  },
  '상수와 재대입': {
    intro: '`maxAttempts`는 `final`로 초기화된 뒤 다시 대입할 수 없어요. 예제는 초기값 3을 출력하며, 뒤에 다른 값을 대입하면 컴파일 오류가 납니다.',
    concept: '`final int maxAttempts; maxAttempts = 3;`처럼 선언할 때 값을 넣지 않은 지역 변수에 첫 값을 나중에 한 번 대입해도 되나요?',
    conceptHint: '선언 뒤 처음 값을 한 번 정하는 것과 값을 정한 뒤 다시 바꾸는 것을 구분하세요.',
    recall: { prompt: '`attempts`를 3으로 시작한 뒤 실행 중 4로 바꾸려 합니다. 선언과 대입을 한 줄씩 적으세요.', accepted: ['int attempts = 3; attempts = 4;', 'int attempts=3; attempts=4;', 'int attempts = 3; 다음 attempts = 4;'], hint: '다시 대입할 변수에는 `final`을 붙이지 않아요.', explanation: '`int attempts = 3;`으로 초기화하고, 값이 바뀔 때 `attempts = 4;`를 대입해요. 이 변수에는 `final`을 붙이지 않습니다.' },
    application: { prompt: '`final List<String> names`에 새 목록을 대입한 뒤 원소를 추가할 수 있는지 구분해 보세요.', correct: '다른 목록을 names에 재대입할 수는 없지만, 참조한 가변 목록에는 원소를 추가할 수 있어요.', correctWhy: '`final`이 막는 것은 변수 참조의 재대입이고, 참조 대상의 변경까지 자동으로 막지는 않아요.', wrong: ['목록 내용과 names 참조를 모두 바꿀 수 없어요.', 'names에 새 ArrayList를 대입해도 final에는 영향이 없어요.'], wrongWhy: ['final 참조가 가리키는 객체가 가변이면 그 객체 상태는 바뀔 수 있어요.', 'final 변수에는 초기화 뒤 새 참조를 대입할 수 없어요.'], hint: '변수 참조를 바꾸는 일과 참조 대상 객체를 수정하는 일을 나눠 보세요.' },
  },
  '문자와 논리값': {
    intro: '`char`에는 UTF-16 코드 단위 하나를 저장해요. 일부 이모지는 두 코드 단위가 필요하므로 `String`으로 다뤄요. 예제에서는 문자 상태와 완료 여부를 각각 출력해요.',
    concept: '`boolean completed = false;`에서 completed에 대입할 수 있는 값의 종류는 무엇인가요?',
    conceptHint: '문자 하나와 참·거짓 결과는 서로 다른 타입이에요.',
    conceptWrongWhy: ['String은 문자열 타입이고 한 문자를 나타내는 char와 달라요.', '정수 인덱스는 위치를 나타내며 조건 결과를 담지 않아요.'],
    recall: { prompt: 'Java의 `boolean` 값 두 가지를 그대로 적으세요.', accepted: ['true와 false', 'true false', '참과 거짓', '참 또는 거짓'], hint: '논리형은 조건의 두 결과 중 하나를 표현해요.', explanation: '`boolean`에는 `true` 또는 `false`가 들어가요. 예제에서 `completed`는 false예요.' },
    application: { prompt: '`isReady(char status)`가 문자 Y일 때만 true를 반환해야 합니다. 어떤 조건식을 쓰나요?', correct: '`status == \'Y\'`를 반환해요.', correctWhy: 'char 값과 문자 리터럴을 비교한 결과가 참 또는 거짓이 됩니다.', wrong: ['`status = \'Y\'`로 대입해요.', '`status == "Y"`로 비교해요.'], wrongWhy: ['단일 등호는 비교가 아니라 대입 연산자예요.', '큰따옴표 값은 String이라 char 매개변수와 타입이 맞지 않아요.'], hint: '비교 연산자와 char 리터럴의 작은따옴표를 확인하세요.' },
  },
  '값 변환 읽기': {
    intro: '`double total = 5.8; int count = (int) total;`을 실행하면 `count`는 5예요. 실수에서 정수로 바꿀 때 소수 부분이 보존되지 않아요.',
    concept: '`double amount = 5.9; int whole = (int) amount;`에서 whole 값은 무엇인가요?',
    conceptHint: 'double에서 int로 바꿀 때 반올림하지 않고 0 방향으로 소수 부분을 버려요.',
    conceptWrongWhy: ['이 변환은 가장 가까운 정수로 반올림하지 않아요.', 'String 내용 비교는 숫자 타입 변환과 관계가 없어요.'],
    recall: { prompt: 'Java에서 `double` 값 5.9를 `(int) 5.9`로 변환하면 결과 숫자는 무엇인가요?', accepted: ['5'], hint: '소수 부분을 반올림하지 않고 0 방향으로 버려요.', explanation: 'double에서 int로의 변환은 소수 부분을 0 방향으로 버립니다. 따라서 `(int) 5.9`는 5이고 `(int) -5.9`는 -5예요.' },
    application: { prompt: '`int displayed = (int) 12.8;`을 계산하면 displayed에는 무엇이 저장되나요?', correct: '12가 저장돼요. 소수부 .8을 버립니다.', correctWhy: 'double에서 int로 좁히는 변환은 이 경우 소수 부분을 버리며 반올림하지 않아요.', wrong: ['13이 저장돼요.', '12.8이 그대로 저장돼요.'], wrongWhy: ['양수 12.8은 가장 가까운 정수로 반올림되지 않습니다.', 'int는 소수부를 저장할 수 없고 변환 과정에서 정보가 사라져요.'], hint: '형 변환이 반올림인지 소수 부분을 버리는 변환인지 구분하세요.' },
  },
  '비교 연산자': {
    intro: '`score >= 60`은 60점도 통과로 판단해 boolean을 만들어요. `==`는 기본형 값 비교, `=`는 대입이라는 차이를 확인해요.',
    concept: '`score`가 정확히 60인지 비교해 결과가 true가 되는 Java 조건식은 무엇인가요?',
    conceptHint: '기준과 같을 때만 참인지, 기준보다 큰 값도 포함하는지 살펴보세요.',
    conceptWrongWhy: ['`>=`는 60과 그보다 큰 값까지 참이므로 정확히 같은 경우만 고르지 않아요.', '단일 `=`는 비교가 아니라 값을 대입해요.'],
    recall: { prompt: '`int score`가 60 이상인지 검사하는 Java 조건식을 적으세요.', accepted: ['score >= 60', 'score>=60', '(score >= 60)', '60 <= score', '(60 <= score)', 'score > 59'], hint: '60과 같은 경우도 통과하는 비교식을 만들어요. `int`에서 60 이상은 59보다 큰 경우와 같아요.', explanation: '`score >= 60`은 60과 그보다 큰 값에서 참이에요. 같은 뜻의 `60 <= score`와 `(score >= 60)`도 맞고, `int`에서는 `score > 59`도 같은 결과를 냅니다. 정확히 60인지 확인하는 `score == 60`과는 달라요.' },
    application: { prompt: '`score`가 정확히 60인지와 60 이상인지를 각각 검사하는 식은 무엇인가요?', correct: '정확히 같음은 `score == 60`, 60 이상은 `score >= 60`이에요.', correctWhy: '`==`는 같음을, `>=`는 큼 또는 같음을 나타냅니다.', wrong: ['두 경우 모두 `score = 60`을 사용해요.', '정확히 60은 `score > 60`, 60 이상은 `score == 60`이에요.'], wrongWhy: ['단일 `=`는 대입 연산자이지 비교가 아니에요.', '두 조건을 서로 바꾸어 썼어요.'], hint: '경계값 60을 직접 넣어 참이어야 할 조건을 확인하세요.' },
  },
  '문자열 내용 비교': {
    intro: '각각 `new String("Java")`로 만든 객체는 서로 다르지만 글자 내용은 같아요. `equals`는 내용을 비교하고 `==`는 참조가 같은 객체를 가리키는지 비교해요.',
    concept: '`name`이 null일 수도 있습니다. 내용이 `Java`와 같은지 확인하면서 NullPointerException을 피하는 식은 무엇인가요?',
    conceptHint: '`name.equals(...)`는 name이 null이면 안전한지 생각해 보세요.',
    recall: { prompt: '서로 다른 `String` 객체에 같은 글자가 들어 있을 때, 글자 내용이 같은지 확인하는 메서드는 무엇인가요?', accepted: ['equals', 'equals 메서드', 'String.equals'], hint: '두 참조가 같은 객체인지 비교하는 `==`와 구분하세요.', explanation: '`equals`는 문자열의 글자 내용을 비교해요. 참조가 같은 객체인지 비교하는 `==`와 다릅니다.' },
    application: { prompt: '`left`와 `right`가 각각 `new String("Java")`로 만들어졌습니다. 내용 일치를 확인하는 방법은 무엇인가요?', correct: '`left.equals(right)`는 true예요.', correctWhy: '서로 다른 String 인스턴스라도 문자 내용이 같으므로 equals 비교는 true입니다.', wrong: ['`left == right`는 true예요.', '`left = right`가 내용 비교를 해요.'], wrongWhy: ['두 new String 호출은 각각 다른 객체를 만들기 때문에 참조 동일성은 false예요.', '단일 등호는 비교가 아니라 참조 대입이에요.'], hint: '비교 대상이 참조인지 그 안에 담긴 문자 내용인지 구분하세요.' },
  },
  '논리 연산자': {
    intro: '`age >= 18 && age < 65`는 두 조건이 모두 참일 때 true예요. 왼쪽이 false면 `&&` 오른쪽은 평가하지 않는 단락 평가도 확인해요.',
    concept: '`age`가 20일 때 `age >= 18 && age < 65`의 결과는 무엇인가요?',
    conceptHint: '`&&` 양쪽 조건을 각각 계산한 뒤 결과를 결합하세요.',
    conceptWrongWhy: ['`||`는 둘 중 하나가 참이면 전체가 참이므로 다른 연산자예요.', '`!`는 하나의 boolean 결과를 반대로 바꾸는 연산자예요.'],
    recall: { prompt: '두 boolean 조건이 모두 true일 때만 true가 되는 Java 연산자는 무엇인가요?', accepted: ['&&', '논리 AND', '논리 그리고'], hint: '기호 두 개로 쓰는 단락 평가 AND 연산자예요.', explanation: '`&&`는 양쪽 조건이 모두 true여야 전체 결과가 true예요. 왼쪽이 false면 오른쪽을 평가하지 않을 수 있습니다.' },
    application: { prompt: '`age`가 17일 때 `age >= 18 && audit()`에서 audit()가 실행될까요?', correct: '실행되지 않아요. 왼쪽이 false라 전체 결과가 이미 false예요.', correctWhy: 'Java의 `&&`는 왼쪽이 false이면 오른쪽 피연산자를 평가하지 않는 단락 평가를 합니다.', wrong: ['두 조건을 계산하려고 항상 audit()를 실행해요.', '왼쪽이 false이므로 전체 결과가 true예요.'], wrongWhy: ['&&의 오른쪽은 왼쪽 값에 따라 생략될 수 있어요.', 'AND는 양쪽 조건이 모두 true여야 전체가 true입니다.'], hint: '왼쪽 결과만으로 AND의 전체 결과가 정해지는지 확인하세요.' },
  },
  'if와 else if': {
    intro: '예제의 84점은 90점 이상 조건은 거짓이고 80점 이상 조건은 참이라 B가 출력돼요. 조건은 위에서부터 확인해 처음 참인 분기만 실행합니다.',
    concept: '`score`가 84이고 A 조건이 B 조건보다 위에 있을 때 선택되는 분기는 무엇인가요?',
    conceptHint: '`else if` 사슬은 위에서부터 검사해 처음 참인 분기를 선택해요.',
    conceptWrongWhy: ['else if 사슬은 여러 분기의 본문을 모두 실행하는 구조가 아니에요.', 'else는 앞선 조건이 하나도 참이 아닐 때 실행돼요.'],
    recall: { prompt: '`if`와 여러 `else if` 중 어느 분기가 실행되는지 정하는 검사 순서는 어떤가요?', accepted: ['위에서부터 검사해 처음 참인 분기', '처음 참인 분기', '위에서부터 순서대로'], hint: '조건을 코드에 적은 순서대로 검사합니다.', explanation: 'Java는 위에서부터 조건을 검사해 첫 참 분기의 본문을 실행하고 나머지 else if와 else는 건너뜁니다.' },
    application: { prompt: '`if (score >= 90) A; else if (score >= 80) B;`에서 score가 95면 어떤 분기가 선택되나요?', correct: '첫 조건이 참이므로 A 분기만 선택돼요.', correctWhy: '`95 >= 90`이 true여서 이후 else-if 조건은 검사하지 않아요.', wrong: ['A와 B 분기를 모두 실행해요.', '첫 조건을 건너뛰고 B를 선택해요.'], wrongWhy: ['if/else if 사슬에서는 한 분기를 고른 뒤 나머지는 실행하지 않아요.', '조건은 위에서부터 평가하므로 먼저 A가 선택됩니다.'], hint: '첫 조건부터 값을 대입해 true가 되는 지점을 찾으세요.' },
  },
  'switch 표현식 읽기': {
    intro: '`day`가 1이면 `case 1 -> "Mon"`의 값이 switch 표현식 결과가 돼요. 일치하는 case가 없을 때만 default가 선택됩니다.',
    concept: '`int day = 1;`인 switch 표현식에서 label에는 어떤 문자열이 대입되나요?',
    conceptHint: 'selector 값 1과 case 상수를 비교하세요.',
    conceptWrongWhy: ['default는 다른 case와 일치하지 않을 때 사용하는 분기예요.', 'switch는 선택 값과 case를 비교하며 문자열을 이어 붙이지 않아요.'],
    recall: { prompt: '화살표형 switch에서 `case 1 ->` 규칙이 선택되면 바로 다음 `case 2 ->` 본문도 이어서 실행되나요?', accepted: ['아니요', '아니오', '실행되지 않아요', '실행하지 않습니다'], hint: '콜론형 case와 화살표형 case의 실행 방식을 구분하세요.', explanation: '화살표형 `case ->` 규칙은 선택된 규칙만 실행하고 다음 case로 흘러가지 않아요. 콜론형 switch 문과 다른 점입니다.' },
    application: { prompt: 'day가 7이고 일치하는 case가 없으면 어떤 값이 선택되나요?', correct: 'default 분기가 선택되어 `"Other"`를 돌려줘요.', correctWhy: 'selector와 일치하는 case가 없을 때 default가 결과 값을 제공합니다.', wrong: ['첫 case의 `"Mon"`이 기본값처럼 선택돼요.', '모든 case 본문이 차례로 실행돼요.'], wrongWhy: ['case 1은 day가 1일 때만 일치합니다.', '화살표형 switch는 일치하는 규칙의 결과 하나를 선택해요.'], hint: '어떤 case도 일치하지 않을 때의 fallback을 확인하세요.' },
  },
  '배열 인덱스': {
    intro: '`values`는 길이가 3이고 유효한 인덱스는 0, 1, 2예요. `values[0]`은 첫 원소 2이며 `values[3]`은 범위를 벗어납니다.',
    concept: '`int[] values = {2, 3, 4};`에서 마지막 원소를 읽는 표현은 무엇인가요?',
    conceptHint: '인덱스는 0부터 시작하므로 마지막 번호는 길이보다 하나 작아요.',
    conceptWrongWhy: ['배열 인덱스는 1부터 시작하지 않아요.', '`values.length`는 원소 수이지 마지막 유효 인덱스가 아니에요.'],
    recall: { prompt: '`int[] values = {2, 3, 4};`에서 `values[2]`의 값은 무엇인가요?', accepted: ['4'], hint: '인덱스 0부터 차례로 각 값을 놓아 보세요.', explanation: '인덱스 0은 2, 1은 3, 2는 4예요. 길이가 3이면 유효 인덱스는 0부터 2까지입니다.' },
    application: { prompt: '길이가 3인 배열을 처음부터 끝까지 순회할 때 마지막 유효 인덱스는 무엇인가요?', correct: '2예요. 일반식으로는 `length - 1`입니다.', correctWhy: '인덱스가 0부터 시작하므로 마지막 위치는 길이 3에서 1을 뺀 2예요.', wrong: ['3이에요.', '1이에요.'], wrongWhy: ['3은 배열의 길이여서 인덱스로 접근하면 범위를 벗어나요.', '1은 길이 3 배열의 가운데 원소예요.'], hint: '세 위치를 0, 1, 2로 적어 마지막 번호를 확인하세요.' },
  },
  '향상된 for문': {
    intro: '향상된 for문은 2, 3, 4를 차례로 `value`에 전달해요. 합계는 0에서 시작해 2 + 3 + 4인 9가 됩니다. 위치 번호를 바꿔야 할 때는 일반 for문을 선택해요.',
    concept: '`int[] values = {2, 3};`에서 `for (int value : values) { value *= 2; }`가 끝난 뒤 배열 `values`의 원소는 어떻게 되나요?',
    conceptHint: '반복 변수 `value`와 배열 원소 자체가 같은 저장 위치인지 확인하세요.',
    conceptWrongWhy: ['반복 변수 value에 값을 다시 대입해도 원래 배열의 int 원소는 바뀌지 않아요.', '향상된 for문은 배열 길이를 변경하지 않습니다.'],
    recall: { prompt: '`for (int value : values)`에서 매 반복마다 현재 원소를 받는 변수는 무엇인가요?', accepted: ['value'], hint: '콜론 왼쪽에 선언한 반복 변수이며 매 회차 현재 원소를 받아요.', explanation: '향상된 for문의 `value`는 매 반복마다 배열의 현재 원소를 받습니다. 인덱스가 필요 없는 전체 순회에 적합해요.' },
    application: { prompt: '`values`가 `{2, 3, 4}`이고 각 원소를 total에 더하면 반복 종료 후 값은 얼마인가요?', correct: '9예요. 각 원소를 한 번씩 더해 2 + 3 + 4가 됩니다.', correctWhy: '향상된 for문은 배열의 모든 원소를 차례대로 value에 전달해요.', wrong: ['첫 원소만 한 번 더한 2예요.', '배열 길이인 3이에요.'], wrongWhy: ['반복문 본문은 첫 항목에서 끝나지 않고 각 원소에 대해 실행됩니다.', '합계 대상은 원소 값 2, 3, 4이지 원소 개수가 아니에요.'], hint: '`value`와 `total`이 반복마다 어떻게 변하는지 적어 보세요.' },
  },
  'continue와 break': {
    intro: '입력 0, 2, 4, 6에서 0은 continue로 건너뛰고 2는 더해요. 다음 값 4에서 break가 반복을 끝내므로 6은 처리되지 않고 합계는 2입니다.',
    concept: '`continue`와 `break`의 동작을 올바르게 구분한 설명은 무엇인가요?',
    conceptHint: '`continue`는 현재 반복의 나머지, `break`는 반복문 전체에 영향을 줘요.',
    conceptWrongWhy: ['현재 반복만 건너뛰는 동작은 continue예요.', 'break는 가장 가까운 반복문이나 switch를 끝내며 메서드 전체를 끝내지는 않아요.'],
    recall: { prompt: '현재 반복의 남은 부분을 건너뛰고 다음 반복으로 넘어가는 키워드는 무엇인가요?', accepted: ['continue'], hint: '반복문 전체를 끝내는 break와 구분하세요.', explanation: '`continue`는 현재 반복에서 남은 문장을 건너뛰고 다음 반복을 시작해요. `break`는 가장 가까운 반복문을 끝냅니다.' },
    application: { prompt: '입력이 `{0, 2, 4, 6}`이고 0에서 continue, 4보다 큰 값에서 break합니다. 출력 합계는 무엇인가요?', correct: '2예요. 0은 건너뛰고 2만 더한 뒤 4에서 반복이 끝나요.', correctWhy: 'continue는 0을 건너뛰고, break 조건은 4에서 실행되어 그 다음 값 6은 방문하지 않아요.', wrong: ['12예요. 모든 값을 더해요.', '8이에요. 0과 2를 건너뛰고 4와 6을 더해요.'], wrongWhy: ['break가 실행되면 이후 원소를 방문하지 않습니다.', '4는 조건이 참이 되는 순간 반복을 끝내므로 더해지지 않아요.'], hint: '각 값에서 continue 검사, break 검사, 덧셈 순서로 추적하세요.' },
  },
  'for 종료 조건': {
    intro: '길이가 3인 배열에서는 index가 0, 1, 2일 때만 본문을 실행해야 해요. `< values.length`는 세 원소를 모두 포함하고 index가 3이면 멈춥니다.',
    concept: '`index`를 0부터 증가시키며 길이가 3인 배열 전체를 읽는 종료 조건은 무엇인가요?',
    conceptHint: '길이와 같은 인덱스는 배열에 없으므로 조건에서 제외해야 해요.',
    conceptWrongWhy: ['index가 length일 때도 참이면 존재하지 않는 다음 원소에 접근합니다.', 'length - 1보다 작게 제한하면 마지막 인덱스를 건너뛰어요.'],
    recall: { prompt: '배열의 모든 인덱스를 순회하는 for 조건에서 길이와 비교할 기호는 무엇인가요?', accepted: ['<', 'index < length', 'i < values.length'], hint: '길이 자체는 유효한 마지막 인덱스가 아니에요.', explanation: '`index < values.length`는 마지막 유효 인덱스 `length - 1`까지 실행하고 index가 length가 되면 멈춥니다.' },
    application: { prompt: '길이가 3인 배열에서 `for (int i = 0; i < values.length; i++)` 본문은 몇 번 실행되나요?', correct: '3번이에요. i는 0, 1, 2를 거칩니다.', correctWhy: '0, 1, 2가 조건을 통과하고 i가 3이면 `3 < 3`이 false예요.', wrong: ['4번이에요. i가 3인 경우도 포함돼요.', '2번이에요. i가 2에 도달하면 멈춰요.'], wrongWhy: ['조건은 `<=`가 아니라 `<`라 3은 본문에 들어가지 않아요.', 'i가 2일 때 `2 < 3`은 true라 마지막 원소를 처리합니다.'], hint: '0부터 시작해 조건식이 false가 될 때까지 i를 나열해 보세요.' },
  },
  '중첩 반복 읽기': {
    intro: '바깥 반복은 row를 0, 1 두 번 실행하고 매 row마다 안쪽 반복은 col을 0, 1, 2 세 번 실행해요. 본문은 2 × 3인 6회 실행됩니다.',
    concept: '바깥 반복이 2회, 안쪽 반복이 매번 3회 실행되는 중첩 반복의 본문 실행 횟수는 몇 번인가요?',
    conceptHint: '안쪽 반복은 바깥 반복이 한 번 실행될 때마다 다시 시작해요.',
    conceptWrongWhy: ['안쪽 반복은 바깥 반복의 첫 회차 뒤에도 다시 실행돼요.', '바깥 반복 횟수는 안쪽 반복의 총 실행 횟수에 영향을 줍니다.'],
    recall: { prompt: '바깥 반복은 2회 실행되고 안쪽 반복의 조건이 처음부터 false라면 안쪽 본문은 총 몇 번 실행되나요?', accepted: ['0', '0회', '한 번도 실행되지 않아요'], hint: '안쪽 반복은 본문에 들어가기 전에 조건을 먼저 검사해요.', explanation: '안쪽 반복의 첫 조건 검사부터 false이므로 본문에 한 번도 들어가지 않아요. 바깥 반복이 두 번이어도 안쪽 본문 실행 횟수는 0회입니다.' },
    application: { prompt: '바깥 for가 4회, 안쪽 for가 매번 2회라면 안쪽 본문은 몇 번 실행되나요?', correct: '8회예요. 4 × 2입니다.', correctWhy: '안쪽 본문 두 번이 바깥 반복 네 회차 각각에서 실행되므로 전체는 4 × 2인 8회예요.', wrong: ['2회예요.', '6회예요.'], wrongWhy: ['2회는 안쪽 반복 한 회차의 실행 횟수라 바깥 반복을 반영하지 않았어요.', '두 반복은 더하는 것이 아니라 매 바깥 회차마다 안쪽 횟수가 반복되어 곱해져요.'], hint: '바깥 반복 네 회차 각각에 안쪽 반복 두 번을 배치해 보세요.' },
  },
};

const focusedJavaWeeksFourToSixNotes = {
  '매개변수와 반환값': {
    intro: '예제 호출 `add(2, 3)`은 매개변수 `left=2`, `right=3`으로 들어가고 합계 5를 반환해요. 호출자에서 메서드 안으로 값이 들어가고 다시 결과가 나오는 흐름을 따라가세요.',
    concept: { prompt: '`add(int left, int right)`를 `add(2, 3)`으로 호출합니다. 선언에서 `left`와 `right`의 역할은 무엇인가요?', hint: '호출 괄호 안의 실제 값과 메서드 선언 괄호 안의 받는 이름을 나누어 보세요.', wrongWhy: ['매개변수는 메서드가 호출될 때 전달된 값을 받는 이름이지 클래스 필드가 아니에요.', '`void`는 반환값이 없다는 선언이라 합계를 호출자에게 돌려주는 예제와 맞지 않아요.'] },
    recall: { prompt: '`add(2, 3)`을 호출할 때 괄호 안의 숫자 2와 3을 무엇이라고 하나요?', accepted: ['인자', '인수', 'argument', 'arguments'], hint: '메서드 선언의 `left`, `right`와 달리 호출할 때 실제로 전달하는 값이에요.', explanation: '`add(2, 3)`의 2와 3은 인자(인수)이고, 메서드 선언의 `left`, `right`는 그 값을 받는 매개변수예요.' },
    application: { prompt: '`add(4, 3)`을 호출하고 메서드가 `return left + right;`를 실행하면 호출자는 무엇을 받나요?', correct: '정수 7을 반환받아요. left에는 4, right에는 3이 들어갑니다.', correctWhy: '매개변수에 전달된 두 값을 더한 결과가 int 반환값으로 호출자에게 돌아와요.', wrong: ['매개변수가 클래스 필드가 되므로 결과는 항상 0이에요.', 'void 메서드처럼 아무 값도 반환하지 않아요.'], wrongWhy: ['메서드 매개변수는 이 호출에서 전달된 값을 받고 덧셈 결과를 만들어요.', 'add의 반환형은 int이므로 호출자가 계산 결과를 받을 수 있어요.'], hint: 'left와 right에 실제 인자를 각각 대입한 다음 반환식을 계산하세요.' },
  },
  '반환형 선택': {
    intro: '`isComplete(3)`은 `completed > 0`을 계산해 true를 반환하고 출력해요. 반환형은 메서드가 돌려주는 결과의 종류와 호출자가 사용할 방법에 맞춥니다.',
    concept: { prompt: '`isComplete(3)`이 true를 돌려줄 때 `if (isComplete(3)) { ... }`에서 어느 본문이 실행되나요?', hint: 'if 조건식이 true일 때 실행되는 중괄호를 고르세요.', wrongWhy: ['true인 조건은 if 본문을 실행해요.', '조건이 true일 때는 if 본문만 실행되고 else는 건너뜁니다.'] },
    recall: { prompt: '예제의 `isComplete(0)`을 호출하면 어떤 값이 반환되나요?', accepted: ['false', '거짓'], hint: '메서드 안의 `completed > 0` 조건에 0을 넣어 보세요.', explanation: '`0 > 0`은 false이므로 `isComplete(0)`은 false를 반환해요. 반환형 boolean은 이 참·거짓 값을 담습니다.' },
    application: { prompt: '`isComplete(0)`은 `completed > 0`을 검사합니다. 반환되는 논리값은 무엇인가요?', correct: '0은 0보다 크지 않으므로 false를 반환해요.', correctWhy: '비교식 `completed > 0`의 결과는 boolean이고 0에서는 거짓입니다.', wrong: ['반환형이 boolean이므로 언제나 true예요.', '메서드가 반환값 없이 끝나므로 null을 돌려줘요.'], wrongWhy: ['boolean은 비교식의 결과를 담지만 그 값은 실제 입력에 따라 달라져요.', 'boolean 기본형 메서드는 비교 결과를 반환하며 null은 boolean 값이 아니에요.'], hint: '`0 > 0`이 참인지 거짓인지 먼저 계산하세요.' },
  },
  '반환 경로 점검': {
    intro: '`absolute(-4)`는 첫 조건을 건너뛰고 `return -value`에서 4를 돌려줘요. 값이 있는 반환형은 참·거짓 각 경로에서 메서드가 정상 종료하기 전에 값을 반환해야 합니다.',
    concept: { prompt: '`int absolute(int value)`가 0 이상일 때만 값을 반환하고 음수 경로에서 끝난다면 어떤 점이 문제인가요?', hint: 'value가 음수인 입력을 넣어 메서드 마지막 줄까지 따라가 보세요.', wrongWhy: ['참인 경로만 반환하면 음수 입력의 정상 실행 경로에 반환값이 없어요.', '컴파일러가 반환형에 맞는 임의의 기본값을 자동으로 채우지는 않아요.'] },
    recall: { prompt: '예제에서 `absolute(-4)`를 호출하면 어떤 값이 출력되나요?', accepted: ['4', '4예요'], hint: '`value`는 -4이므로 음수 경로의 `return -value;`를 계산하세요.', explanation: '`value`가 -4이므로 `-value`는 4예요. 메서드는 이 값을 호출자에게 반환하고 main이 출력합니다.' },
    application: { prompt: '`absolute(5)`를 예제처럼 실행하면 어떤 값이 반환되나요?', correct: '첫 조건 `value >= 0`이 참이므로 5를 바로 반환해요.', correctWhy: '0 이상 경로는 `return value`를 실행하고 뒤의 음수용 반환문은 도달하지 않아요.', wrong: ['모든 입력을 부정수로 바꾸므로 -5를 반환해요.', '음수 경로용 반환문도 이어 실행해 0을 반환해요.'], wrongWhy: ['예제는 절댓값 함수라 양수의 부호를 바꾸지 않아요.', 'return이 실행되면 메서드가 끝나므로 다음 반환문은 실행되지 않아요.'], hint: '조건식이 참일 때 실행되는 return에서 메서드 흐름이 끝나는지 확인하세요.' },
  },
  '지역 변수 범위': {
    intro: '`ready=true`일 때 `count`는 if 블록 안에서 1로 선언되고 그 안에서 출력돼요. 블록이 닫힌 뒤에는 같은 이름을 사용할 수 없으므로 선언과 사용 위치를 함께 봅니다.',
    concept: { prompt: '`count`가 `if (ready) { ... }` 안에서 선언됐습니다. 닫는 중괄호 뒤에서 `count`를 읽을 수 있나요?', hint: '변수를 선언한 블록의 여는 중괄호와 닫는 중괄호를 확인하세요.', wrongWhy: ['지역 변수는 선언된 블록 범위에서만 이름을 사용할 수 있어요.', 'if 블록의 지역 변수는 모든 메서드가 공유하는 필드가 되지 않아요.'] },
    recall: { prompt: '지역 변수 이름을 사용할 수 있는 코드 영역을 Java에서 무엇이라고 하나요?', accepted: ['scope', '범위', '변수 범위', '지역 변수 범위'], hint: '변수의 선언 위치가 그 이름을 볼 수 있는 영역을 정해요.', explanation: '지역 변수의 scope(범위)는 선언된 블록 안이에요. 예제의 `count`는 if 블록 안에서 출력됩니다.' },
    application: { prompt: '`ready=false`라면 `count`가 선언된 블록과 출력문은 어떻게 되나요?', correct: '블록에 들어가지 않으므로 count 선언과 출력이 모두 실행되지 않아요.', correctWhy: 'if 본문 전체는 ready가 true일 때만 실행돼요.', wrong: ['count가 자동으로 0으로 초기화되어 출력돼요.', '지역 변수 선언은 if 조건과 무관하게 먼저 실행돼요.'], wrongWhy: ['선언은 필드 선언이 아니라 if 본문 안의 지역 선언이라 본문 실행 여부를 따라요.', '제어 흐름은 조건을 먼저 검사하고 거짓이면 본문을 건너뜁니다.'], hint: 'false 조건일 때 중괄호 안으로 들어가는지부터 판단하세요.' },
  },
  '메서드 오버로딩': {
    intro: '`sum(2.0, 3.5)`는 double 매개변수를 받는 오버로드를 선택해 5.5를 출력해요. 이름이 같아도 매개변수 타입이 다른 두 선언 중 호출 인자에 맞는 메서드가 선택됩니다.',
    concept: { prompt: '`sum(int, int)`와 `sum(double, double)`가 함께 선언될 수 있는 이유는 무엇인가요?', hint: '반환형만 비교하지 말고 호출을 구분하는 매개변수 목록을 보세요.', wrongWhy: ['반환형만 다른 선언은 메서드 호출 시 어느 쪽인지 구별할 근거가 아니에요.', '두 메서드가 다른 이름이면 오버로딩이 아니라 별도 메서드 이름이에요.'] },
    recall: { prompt: '예제의 `sum(2.0, 3.5)`를 호출하면 콘솔에 출력되는 내용은 무엇인가요?', accepted: ['5.5', '5.5예요'], hint: 'double 오버로드의 덧셈 결과를 계산하세요.', explanation: '두 double 인자의 합은 5.5예요. `println`은 이 값을 `5.5`로 출력합니다. 호출 인자의 타입에 맞는 `sum(double, double)`이 선택돼요.' },
    application: { prompt: '`sum(2, 3)`과 `sum(2.0, 3.5)`는 예제에서 각각 어떤 오버로드를 선택하나요?', correct: '첫 호출은 int 버전, 두 번째는 double 버전을 선택해요.', correctWhy: '호출 인자의 타입에 적용되는 매개변수 목록이 메서드 선택을 구분해요.', wrong: ['두 호출 모두 반환형이 int인 버전을 선택해요.', '호출 인자 타입과 관계없이 항상 먼저 선언된 버전만 선택해요.'], wrongWhy: ['두 번째 호출에는 double 인자가 있어 double 매개변수 버전이 맞아요.', '컴파일 시 호출 인자와 적용 가능한 매개변수 목록을 확인해요.'], hint: '각 호출의 인자 타입을 해당 메서드 선언의 괄호 안 타입과 비교하세요.' },
  },
  '필드와 생성자': {
    intro: '`new Course("Java")`가 Course 객체를 만들 때 생성자는 전달받은 문자열을 `title` 필드에 저장해요. 생성자는 객체가 처음 사용할 상태를 준비하고 예제의 title 메서드는 Java를 돌려줍니다.',
    concept: { prompt: '`new Course("Java")`로 객체를 만들면 생성자는 전달받은 문자열을 어느 필드에 저장하나요?', hint: '생성자 안의 `this.title = title;` 대입문에서 왼쪽을 확인하세요.' },
    recall: { prompt: '`class Course`에서 생성자 이름은 클래스 이름과 같아야 합니다. 예제의 생성자 이름은 무엇인가요?', accepted: ['Course', 'Course 클래스'], hint: '`Course(String title)`의 첫 단어를 확인하세요.', explanation: '예제의 생성자 이름은 `Course`예요. 생성자는 반환형을 적지 않고 클래스와 같은 이름을 사용합니다.' },
    application: { prompt: '`new Course("Python")`을 만들고 `title()`을 부르면 어떤 문자열을 돌려주나요?', correct: '`Python`을 반환해요. 생성자가 전달된 문자열을 그 객체의 title 필드에 저장합니다.', correctWhy: '각 객체의 생성자는 자신의 title 필드를 인자로 초기화해요.', wrong: ['모든 Course가 같은 기본값 Java를 반환해요.', '생성자는 값을 반환하므로 객체 대신 Python 문자열이 course가 돼요.'], wrongWhy: ['예제는 생성자 인자를 해당 객체 필드에 대입하므로 객체별로 값이 달라요.', '생성자는 반환형을 선언하는 일반 메서드가 아니며 new가 객체 참조를 돌려줘요.'], hint: '생성자 매개변수가 어느 인스턴스 필드에 대입되는지 따라가세요.' },
  },
  '인스턴스와 static': {
    intro: '두 Course는 각자 Java와 Python이라는 title을 가지지만 `createdCount`는 클래스가 공유해 2가 출력돼요. 인스턴스별 상태와 모든 객체가 함께 보는 클래스 상태를 구분하세요.',
    concept: { prompt: '예제에서 두 Course의 제목은 다르고 생성 개수는 함께 2를 세려 합니다. 어떤 값을 static으로 두는 것이 알맞나요?', hint: '객체마다 다른 값과 모든 객체가 공유할 값을 나누어 보세요.', wrongWhy: ['각 Course의 title을 static으로 만들면 두 제목이 같은 저장 공간을 공유해요.', '인스턴스 필드는 객체마다 생기므로 전체 생성 개수를 한 번만 세는 목적과 달라요.'] },
    recall: { prompt: '예제처럼 객체 변수 대신 클래스 이름으로 생성 개수를 얻으려면 어떤 호출을 쓰나요?', accepted: ['Course.createdCount()', 'Course.createdCount() 메서드'], hint: '`createdCount()`는 static 메서드라 클래스 이름 뒤에 점을 찍어 호출할 수 있어요.', explanation: '`Course.createdCount()`는 Course 클래스가 공유하는 생성 개수를 반환해요. 괄호를 생략한 `Course.createdCount`는 메서드 호출이 아닙니다. 객체마다 다른 `title`은 인스턴스 메서드로 읽습니다.' },
    application: { prompt: '예제에서 Course를 세 개 더 생성한 뒤 `createdCount()`를 호출하면 어떤 값이 되나요?', correct: '기존 두 개와 추가 세 개를 합해 5예요.', correctWhy: '생성자마다 같은 static 필드를 1씩 증가시키므로 객체 전체의 누계가 됩니다.', wrong: ['각 객체에 별도로 저장되므로 마지막 객체의 수 1이에요.', 'static은 생성자에서 바꿀 수 없어 0이에요.'], wrongWhy: ['createdCount는 각 객체의 필드가 아니라 공유 클래스 필드예요.', 'static 필드도 생성자에서 접근해 값을 변경할 수 있어요.'], hint: '현재 2에서 Course 객체를 만들 때마다 한 번씩 증가시켜 보세요.' },
  },
  '접근 제어자': {
    intro: '다른 클래스인 AccessModifierExample은 `course.getMinutes()`로 40을 읽지만 private인 minutes에 바로 접근하지 못해요. 필요한 읽기 동작만 메서드로 공개합니다.',
    concept: { prompt: '하위 클래스가 다른 패키지에서도 `minutes` 값을 읽게 하면서 필드 자체는 private으로 유지하려면 어떤 메서드를 제공할 수 있나요?', hint: '필드 접근은 private으로 제한하고 하위 클래스가 호출할 읽기 동작은 protected로 제공하세요.', wrongWhy: ['private 메서드는 다른 패키지의 하위 클래스에서 사용할 수 없어요.', 'static은 접근 범위를 정하는 키워드가 아니며 인스턴스 필드의 getter를 대신하지 않아요.'] },
    recall: { prompt: '예제의 다른 클래스에서 `course` 객체의 분 수를 얻을 때 작성하는 메서드 호출식은 무엇인가요?', accepted: ['course.getMinutes()', 'course.getMinutes() 메서드'], hint: '`AccessModifierExample`의 출력문에서 객체 이름과 공개 메서드를 확인하세요.', explanation: '`course.getMinutes()`로 값을 읽어요. `getter`라는 말만으로는 어떤 메서드인지 특정할 수 없고, private 필드에는 직접 접근할 수 없습니다.' },
    application: { prompt: '다른 클래스에서 40을 읽으려면 예제의 어떤 호출을 사용하나요?', correct: '`course.getMinutes()`를 호출해 공개된 읽기 동작을 사용해요.', correctWhy: '필드를 공개하지 않고 클래스가 제공하는 메서드로 필요한 값을 읽습니다.', wrong: ['private을 제거하고 모든 필드를 public으로 바꿔요.', '외부 코드에서 `course.minutes`를 그대로 읽어요.'], wrongWhy: ['한 값을 읽으려고 모든 내부 상태를 공개할 필요는 없어요.', '다른 클래스에서는 private 필드에 직접 접근할 수 없습니다.'], hint: '예제가 private 필드 외부에 제공한 메서드 이름을 찾으세요.' },
  },
  'getter의 역할': {
    intro: '`getTitle()`은 Course 안의 private title을 읽어 Java를 돌려줘요. 읽기 접근을 제공하는 메서드이며 title 필드를 새 값으로 바꾸지는 않습니다.',
    concept: { prompt: '`getTitle()`을 호출했을 때 필드 값을 바꾸지 않고 읽는다는 설명은 무엇인가요?', hint: '메서드가 반환하는 값과 필드에 대입하는 문장이 있는지 구분하세요.', wrongWhy: ['읽기 메서드가 반드시 상태를 변경해야 하는 것은 아니에요.', 'setter는 값을 설정하는 역할이고 getter와 목적이 달라요.'] },
    recall: { prompt: '객체의 값을 바꾸지 않고 읽기 위해 제공하는 메서드를 흔히 무엇이라고 하나요?', accepted: ['getter', '게터', '읽기 접근자'], hint: '값을 설정하는 setter와 짝을 이루는 이름이에요.', explanation: 'getter는 캡슐화된 상태를 읽을 수 있게 제공해요. 예제는 getTitle()로 Java를 돌려줍니다.' },
    application: { prompt: '`new Course("Python").getTitle()`을 실행하면 어떤 문자열이 나오나요?', correct: '`Python`이 나와요. 새 Course의 title에 전달한 값이 반환됩니다.', correctWhy: '생성자가 전달된 값을 객체의 title 필드에 저장하고 getter는 그 값을 읽어 반환해요.', wrong: ['기존 예제와 같은 `Java`가 나와요.', 'getter는 문자열을 반환하지 않으므로 아무 값도 얻을 수 없어요.'], wrongWhy: ['새 객체의 title은 생성자에 넘긴 `Python`이에요.', 'getTitle은 String을 반환하는 메서드입니다.'], hint: '새 객체의 생성자 인자가 어느 필드에 저장되는지 따라가 보세요.' },
  },
  '불변 객체 기초': {
    intro: 'Course의 title과 minutes는 final로 초기화되고 이를 바꾸는 메서드가 없어 Java, 40이라는 상태가 유지돼요. 이 예제는 불변 값만 담아 불변 상태를 보여 주며 final 참조가 가변 객체까지 동결하지는 않습니다.',
    concept: { prompt: '예제의 Course 상태가 생성 뒤 바뀌지 않는 가장 직접적인 이유는 무엇인가요?', hint: '필드의 재대입 가능성과 외부에 상태 변경 메서드를 제공하는지 확인하세요.', wrongWhy: ['컬렉션은 종류와 생성 방법에 따라 가변일 수 있어 자동으로 모두 불변은 아니에요.', 'final 참조는 참조의 재대입을 제한하지만 참조 대상 객체를 자동으로 불변화하지 않아요.'] },
    recall: { prompt: '생성 뒤 관찰할 수 있는 상태가 바뀌지 않는 객체를 무엇이라고 하나요?', accepted: ['immutable', '불변 객체', '불변'], hint: '만들어진 뒤 상태를 변경하지 않는 객체를 뜻해요.', explanation: '불변 객체는 생성 뒤 관찰 가능한 상태가 변하지 않아요. 이 예제의 String과 int 필드는 final이고 변경 메서드가 없습니다.' },
    application: { prompt: 'Course의 minutes를 40에서 50으로 바꾸려는 새 요구가 생기면 이 예제의 방식과 맞는 선택은 무엇인가요?', correct: '기존 객체의 필드를 직접 바꾸지 말고 새 값 50을 가진 Course 객체를 만들어요.', correctWhy: '이 클래스는 private final 필드와 변경 메서드 없는 구조로 상태 변경을 허용하지 않아요.', wrong: ['final 필드에 새 값을 다시 대입해 같은 객체를 변경해요.', 'title만 final이므로 minutes는 외부에서 바로 바꿔도 돼요.'], wrongWhy: ['final 필드는 생성 뒤 재대입할 수 없어요.', '두 필드 모두 private final이라 다른 클래스가 직접 접근할 수도 없습니다.'], hint: '기존 객체의 수정 대신 새 상태를 가진 객체를 만드는 것이 가능한지 확인하세요.' },
  },
  '상속 관계 읽기': {
    intro: '`EmailNotifier`는 `Notifier`를 extends하고 자체 send 구현이 없어서 상위 클래스의 send를 사용해 `sent: hello`를 출력해요. 상속은 객체 안에 필드를 복사하는 것이 아니라 타입 사이 관계를 선언합니다.',
    concept: { prompt: '`class EmailNotifier extends Notifier {}`에 구현된 send가 없을 때 호출이 가능한 이유는 무엇인가요?', hint: '하위 클래스가 상위 클래스에서 물려받는 구체 메서드를 확인하세요.', wrongWhy: ['extends는 클래스를 상속할 때 쓰고 인터페이스 구현에는 implements를 써요.', '상속은 메서드와 타입 관계를 제공하며 필드를 객체마다 복사하는 연산이 아니에요.'] },
    recall: { prompt: 'Java 클래스가 상위 클래스를 상속할 때 선언에 사용하는 키워드는 무엇인가요?', accepted: ['extends', 'extends 키워드'], hint: '`class EmailNotifier ... Notifier` 사이에 쓰는 단어예요.', explanation: '실제 선언에는 `extends` 키워드를 써요. `상속`은 관계를 설명하는 말이지 Java 코드에 적는 키워드는 아닙니다. EmailNotifier는 Notifier의 하위 타입이 됩니다.' },
    application: { prompt: 'EmailNotifier가 send를 재정의하지 않은 상태에서 `notifier.send("hello")`는 어떤 문구를 출력하나요?', correct: '상속한 구현이 실행되어 `sent: hello`를 출력해요.', correctWhy: 'EmailNotifier에 재정의가 없으므로 Notifier에 정의된 구체 메서드가 사용됩니다.', wrong: ['구현을 재정의하지 않았으므로 무조건 컴파일 오류예요.', 'extends가 필드를 복사하므로 메시지를 출력하지 않아요.'], wrongWhy: ['상위 클래스에 접근 가능한 구체 메서드가 있어 상속된 동작을 호출할 수 있어요.', '메서드 호출은 상속 계층에서 구현을 찾으며 필드 복사 규칙과 관계가 없어요.'], hint: '하위 클래스에 send가 선언되어 있는지, 상위 클래스에 구현이 있는지 확인하세요.' },
  },
  '메서드 재정의': {
    intro: '`EmailNotifier.send("welcome")`은 상위 구현 대신 `email: welcome`을 출력해요. `@Override`와 메서드 이름·매개변수 목록을 맞춰 실제로 재정의되었는지 확인합니다.',
    concept: { prompt: '상위 `send(String)`과 같은 시그니처로 하위 메서드를 선언하고 재정의를 확인하는 조합은 무엇인가요?', hint: '메서드 선언 바로 위 주석처럼 보이는 표식과 매개변수 타입을 확인하세요.', wrongWhy: ['@Override는 같은 이름의 다른 매개변수 메서드를 오버로딩하라고 표시하지 않아요.', 'private 메서드는 상위 타입에서 접근해 재정의할 수 있는 동작이 아니에요.'] },
    recall: { prompt: '컴파일러가 상위 메서드의 재정의 여부를 검사하도록 메서드 위에 붙이는 주석형 어노테이션은 무엇인가요?', accepted: ['@Override', 'Override', '오버라이드'], hint: '예제의 EmailNotifier.send 선언 바로 위에 있어요.', explanation: '`@Override`를 붙이면 이름·매개변수 등이 상위 메서드와 맞지 않을 때 컴파일러가 오류를 알려 줍니다.' },
    application: { prompt: '하위 메서드를 `send()`로 바꿨는데 상위 메서드는 `send(String)`입니다. @Override가 붙어 있다면 어떤 결과가 맞나요?', correct: '시그니처가 달라 상위 메서드를 재정의하지 못하고 컴파일 오류가 나요.', correctWhy: '매개변수 목록이 다르므로 이름이 비슷해도 같은 메서드 재정의가 아닙니다.', wrong: ['매개변수는 재정의에서 무시되므로 정상 재정의돼요.', '호출될 때 빈 문자열이 자동으로 전달돼요.'], wrongWhy: ['매개변수 목록은 메서드 시그니처와 호출 가능성을 구분해요.', 'Java가 누락된 인자를 자동으로 채우지 않습니다.'], hint: '상위와 하위 선언의 괄호 안 타입과 개수를 비교하세요.' },
  },
  '추상 클래스': {
    intro: '`Report`는 render 계약을 남긴 추상 클래스라 직접 만들 수 없고, `CourseReport`가 이를 구현해 Courses: 2를 돌려줘요. 공통 구현과 하위 클래스가 채울 동작을 함께 표현합니다.',
    concept: { prompt: '추상 메서드 render가 남아 있는 `Report`와 `CourseReport`의 관계로 맞는 설명은 무엇인가요?', hint: 'new로 만들 수 있는 타입과 미완성 메서드를 구현해야 하는 타입을 나누세요.', wrongWhy: ['추상 클래스는 구현되지 않은 추상 동작이 남은 상태로 직접 인스턴스화할 수 없어요.', '추상 메서드는 하위 구체 클래스가 구현해야 하므로 본문이 필수가 아니에요.'] },
    recall: { prompt: '추상 클래스 Report를 상속한 구체 클래스 CourseReport가 구현해야 하는 메서드 이름은 무엇인가요?', accepted: ['render', 'render()', 'render 메서드'], hint: '`Report`에 본문 없이 선언된 추상 메서드 이름을 확인하세요.', explanation: '`Report`는 `render()`를 추상 메서드로 선언했어요. 이를 구현해야 CourseReport를 일반 클래스로 만들 수 있습니다.' },
    application: { prompt: '새 `PdfReport`를 만들 때 Report.render() 계약을 채우려면 무엇을 해야 하나요?', correct: 'PdfReport가 Report를 상속하고 render()를 구현해야 해요.', correctWhy: '구체 하위 클래스는 남아 있는 추상 메서드를 구현해야 인스턴스화할 수 있어요.', wrong: ['Report를 그대로 new로 만든 뒤 실행 중에 빈 메서드를 추가해요.', 'render 메서드를 삭제해도 추상 클래스의 요구는 사라져요.'], wrongWhy: ['추상 클래스는 인스턴스화할 수 없고 Java 객체에 실행 중 메서드를 추가할 수 없습니다.', '상속 계약에서 요구하는 메서드는 구현으로 충족해야 해요.'], hint: 'CourseReport가 render를 구현하는 형태를 PdfReport에 적용해 보세요.' },
  },
  '인터페이스 계약': {
    intro: '`EmailNotifier`는 Notifier의 send 계약을 public 메서드로 구현하고, Notifier 참조로 호출해 `email: ready`를 출력해요. 인터페이스는 구현 세부가 달라도 호출자가 의존할 동작을 약속합니다.',
    concept: { prompt: '`EmailNotifier implements Notifier`가 컴파일되려면 send에 대해 지켜야 하는 것은 무엇인가요?', hint: '인터페이스에 선언된 메서드의 이름, 매개변수와 구현 메서드의 공개 범위를 비교하세요.', wrongWhy: ['인터페이스는 인스턴스 필드에 객체 상태를 저장하는 클래스가 아니에요.', '클래스는 필요한 인터페이스 계약을 구현하며 한 번만 구현할 수 있다는 제한은 없어요.'] },
    recall: { prompt: '호출자와 서로 다른 구현체가 공유할 메서드 계약을 선언하는 Java 타입 구조는 무엇인가요?', accepted: ['interface', '인터페이스'], hint: '`class EmailNotifier implements Notifier`에서 Notifier의 선언 종류예요.', explanation: '인터페이스는 구현체가 제공해야 할 메서드 계약을 표현하고 호출자는 그 타입을 통해 호출할 수 있어요.' },
    application: { prompt: '`SmsNotifier`도 Notifier를 구현하려고 합니다. 호출자가 `Notifier` 타입으로 send를 부를 수 있게 하려면 무엇이 필요한가요?', correct: 'SmsNotifier가 `public void send(String message)`를 구현해야 해요.', correctWhy: '인터페이스 계약의 이름·매개변수를 지키고 public으로 구현하면 호출자가 같은 타입을 사용할 수 있어요.', wrong: ['Notifier를 extends하는 일반 클래스만 만들면 구현 메서드 없이 계약이 완성돼요.', 'send를 private으로 선언해 인터페이스 메서드를 숨겨요.'], wrongWhy: ['Notifier는 인터페이스이므로 구현 클래스는 implements를 사용하고 메서드를 구현해야 합니다.', '인터페이스 메서드를 구현할 때는 공개 범위를 줄일 수 없어요.'], hint: '예제의 EmailNotifier 선언과 public send 시그니처를 따라 보세요.' },
  },
  '다형성 호출': {
    intro: '`Notifier notifier = new EmailNotifier()`에서 변수의 선언 타입은 Notifier지만 실제 객체는 EmailNotifier예요. send를 부르면 실제 객체의 구현이 선택되어 `email: hi`가 출력됩니다.',
    concept: { prompt: '`notifier.send("hi")`가 EmailNotifier의 본문을 실행하는 이유는 무엇인가요?', hint: '변수의 선언 타입과 new로 실제 생성한 객체 타입을 구분하세요.', wrongWhy: ['인스턴스 메서드 호출은 상위 타입의 선언만 보고 항상 그 본문을 실행하지 않아요.', '다형성 호출은 구현체마다 형변환을 요구하지 않고 공통 계약을 통해 동작해요.'] },
    recall: { prompt: '상위 타입의 참조로 호출해도 실제 객체의 재정의된 동작이 선택되는 객체지향 개념은 무엇인가요?', accepted: ['polymorphism', '다형성'], hint: '여러 구현체를 같은 상위 계약으로 다루는 개념이에요.', explanation: '다형성 덕분에 Notifier 참조로 호출해도 실제 객체 EmailNotifier의 재정의 메서드가 실행됩니다.' },
    application: { prompt: 'EmailNotifier 대신 다른 Notifier 구현체를 변수에 넣어 같은 send 호출을 하면 무엇이 선택되나요?', correct: '같은 Notifier 계약 호출이 실제 객체의 send 구현으로 연결돼요.', correctWhy: '인스턴스 메서드의 동적 디스패치는 실제 객체 타입의 재정의 구현을 선택합니다.', wrong: ['Notifier 참조라면 구현체와 무관하게 항상 추상 계약 본문만 실행돼요.', '구현체를 바꿀 때마다 호출하려면 명시적 형변환이 필수예요.'], wrongWhy: ['인터페이스 선언은 호출 계약이며 실제 구현체가 실행할 메서드 본문을 제공합니다.', '공통 타입으로 호출하므로 이 예제의 send에는 형변환이 필요하지 않아요.'], hint: '선언 타입이 아닌 new 뒤의 객체가 가진 send 구현을 확인하세요.' },
  },
};

const focusedWeekTwentyFiveToTwentySixNotes = {
  '요구사항 분해': {
    concept: {
      prompt: 'nextLevel을 만들기 전에 입력값, 처리 규칙, 반환값을 나누어 적는 주된 이유는 무엇인가요?',
      hint: '입력과 반환값만 적으면 음수처럼 잘못된 값의 처리 규칙이 빠질 수 있어요.',
      wrongWhy: ['화면 모양은 기능의 입력·규칙·출력 계약을 대신하지 못해요.', '오류 처리를 미루면 잘못된 입력이 어떤 결과를 내야 하는지 정해지지 않아요.'],
      explanation: '입력·규칙·출력을 나누면 빠진 조건과 확인할 사례를 찾기 쉽습니다. 이 예제에서는 음수 거부도 규칙에 포함돼요.',
    },
    intro: '예제의 입력은 완료 단원 수이고 규칙은 1을 더하는 것입니다. 음수는 거부하고 int 범위를 넘는 경우 Math.addExact가 예외를 던지는 것도 계약의 일부예요.',
    recall: { prompt: '기능의 입력·규칙·출력을 나누어 빠진 조건을 찾는 작업을 한글 또는 영어로 적으세요.', accepted: ['요구사항 분해', '요구사항 분석', '요구 분석', 'requirements decomposition', 'requirements analysis'], hint: '무엇을 받고, 어떤 규칙을 적용하고, 무엇을 돌려주는지 정리하는 설계 단계예요.', explanation: '요구사항 분해(요구 분석)는 입력, 처리 규칙, 결과를 나누어 빠진 조건을 찾는 작업입니다.' },
    application: {
      prompt: '호출자가 nextLevel(3)을 부르고, 음수 입력도 전달할 수 있습니다. 예제의 계약과 맞는 설명은 무엇인가요?',
      correct: 'nextLevel(3)은 4를 돌려주고, nextLevel(-1)은 IllegalArgumentException을 던져요.',
      correctWhy: 'completed가 0 이상이면 1을 더하고, 음수는 거부한다는 입력·규칙·출력 계약을 그대로 적용했어요.',
      wrong: ['nextLevel(3)은 항상 3을 돌려주고 음수는 0으로 바꿔요.', '음수도 그대로 1을 더해 -1을 돌려줘요.'],
      wrongWhy: ['예제의 규칙은 입력을 그대로 반환하거나 잘못된 값을 기본값으로 바꾸지 않아요.', '음수 입력은 계산 전에 명시적으로 거부해요.'],
      hint: 'completed가 3인 정상 입력과 -1인 잘못된 입력을 따로 추적해 보세요.',
    },
  },
  '도메인 용어': {
    concept: {
      prompt: 'CourseProgress와 completedLessons처럼 코드 이름에 담아야 할 말은 어디에서 가져오는 것이 좋나요?',
      hint: '개발팀 내부 약어보다 학습 서비스를 쓰는 사람이 실제로 사용하는 표현을 살펴보세요.',
      wrongWhy: ['이름을 짧게 줄이면 읽는 사람이 의미를 추측해야 해요.', '기술 용어만으로 이름을 정하면 업무에서 쓰는 뜻과 어긋날 수 있어요.'],
      explanation: '사용자와 개발자가 함께 쓰는 도메인 용어를 코드 이름과 모델에 반영하면 같은 개념을 두고 다르게 이해할 가능성이 줄어요.',
    },
    intro: 'CourseProgress와 completedLessons는 학습 도메인의 의미를 이름에 담아요. record는 Java 16부터 쓸 수 있으며 구성 요소로 접근자를 만들지만, 음수 같은 도메인 규칙을 자동으로 검증하지는 않습니다.',
    recall: { prompt: '개발자와 사용자가 같은 도메인 표현을 코드에 쓰도록 맞추는 원칙을 한글 또는 영어로 적으세요.', accepted: ['공통 언어', '도메인 공통 언어', '유비쿼터스 언어', 'ubiquitous language'], hint: '개발자 내부 약어보다 사용자 업무에서 실제로 쓰는 말을 모델에 반영해요.', explanation: '공통 언어(ubiquitous language)는 사용자와 개발자가 함께 쓰는 도메인 표현을 코드와 대화에 일관되게 반영하는 원칙입니다.' },
    application: {
      prompt: '화면에 완료 단원 수를 보여 주려 합니다. CourseProgress 예제를 확장할 때 가장 읽기 쉬운 구성은 무엇인가요?',
      correct: 'CourseProgress에 completedLessons처럼 업무 의미가 드러나는 구성 요소를 두고 그 접근자로 값을 읽어요.',
      correctWhy: 'record의 구성 요소 이름은 데이터의 도메인 의미를 표현하고 같은 이름의 접근자로 값을 읽을 수 있어요.',
      wrong: ['값 이름을 data1로 줄이고 화면 코드에서 의미를 추측하게 해요.', 'record를 쓰면 completedLessons가 음수인지 자동으로 검사한다고 가정해요.'],
      wrongWhy: ['이름만으로 역할을 알 수 있어야 하며 사용자가 쓰는 용어를 코드에 연결해야 해요.', 'record는 데이터 운반을 간결하게 하지만 도메인 제약을 자동 검증하지 않아요.'],
      hint: '구성 요소 이름이 전달하는 의미와 record가 자동으로 보장하는 범위를 구분해 보세요.',
    },
  },
  '메서드 계약': {
    concept: {
      prompt: 'findById가 항목을 찾지 못했을 때 호출자가 안전하게 처리하도록 메서드에 무엇을 분명히 정해야 하나요?',
      hint: '호출자가 받을 값과 항목이 없을 때의 결과를 함께 확인하세요.',
      wrongWhy: ['구현 코드만으로는 호출자가 반환값이나 실패 동작을 미리 알 수 없어요.', '계약은 주석에만 둘 수 없고 타입과 실제 동작도 같은 약속을 따라야 해요.'],
      explanation: '메서드 계약에는 입력, 반환값, 실패 조건과 그 표현 방법이 포함됩니다. 이 예제는 항목이 없으면 빈 Optional을 반환해요.',
    },
    intro: '저장소 예제는 유효한 id를 받으면 Course를 담은 Optional을, 없으면 Optional.empty()를 돌려줍니다. 이 학습용 람다는 외부 DB를 쓰지 않으며, 실제 저장소는 아니에요.',
    recall: { prompt: '메서드의 입력, 반환값, 실패 조건에 관한 약속을 한글 또는 영어로 적으세요.', accepted: ['메서드 계약', '함수 계약', '메서드의 계약', 'method contract'], hint: '호출자와 구현자가 함께 지켜야 할 메서드의 약속이에요.', explanation: '메서드 계약(method contract)은 입력, 반환값, 실패 조건에 대해 호출자와 구현자가 지켜야 할 약속입니다.' },
    application: {
      prompt: 'id가 유효한 문자열 "spring"이지만 저장소에 항목이 없습니다. 예제와 같은 계약이라면 호출자는 무엇을 받나요?',
      correct: 'CourseRepository.findById("spring")은 Optional.empty()를 돌려주고, 호출자는 isPresent() 등으로 부재를 확인해요.',
      correctWhy: '유효하지만 찾을 수 없는 항목은 빈 Optional로 표현하는 계약이므로 null을 반환하지 않아요.',
      wrong: ['찾지 못한 경우도 무조건 null을 반환해요.', '저장소가 항목을 만들고 id를 임의로 바꿔서 돌려줘요.'],
      wrongWhy: ['Optional 계약은 값의 부재를 빈 Optional로 표현해요.', 'findById는 조회 계약이며 생성이나 id 재작성 동작을 약속하지 않아요.'],
      hint: '입력이 유효한지와 해당 id의 값이 실제로 있는지는 다른 조건이에요.',
    },
  },
  '오류 정책': {
    concept: {
      prompt: 'requirePositiveId에 0이 들어올 수 있다면, 구현 전에 먼저 정해야 할 것은 무엇인가요?',
      hint: '유효하지 않은 입력을 무시할지, 결과로 알릴지, 예외로 알릴지 살펴보세요.',
      wrongWhy: ['실패를 무시하면 호출자는 잘못된 입력이 처리됐는지 알 수 없어요.', '모든 실패를 null로 바꾸면 반환 타입이나 실패 원인과 맞지 않을 수 있어요.'],
      explanation: '예상 가능한 잘못된 입력을 어떤 결과나 예외로 알릴지 정해야 호출자도 그 실패를 일관되게 처리할 수 있어요.',
    },
    intro: 'requirePositiveId는 1 이상의 id를 그대로 돌려주고 0 이하 입력에는 IllegalArgumentException을 던집니다. 이 정책을 호출자가 알 수 있어야 오류를 조용히 숨기거나 잘못된 값으로 저장하지 않아요.',
    recall: { prompt: '예상 가능한 잘못된 입력을 어떤 결과나 예외로 알릴지 미리 정하는 결정을 무엇이라고 하나요?', hint: '잘못된 입력을 무시하거나 null로 뭉개지 않고 호출자에게 어떻게 알릴지 정해요.' },
    application: {
      prompt: '새 호출자가 requirePositiveId(0)을 전달했습니다. 기존 메서드 계약을 지키는 동작은 무엇인가요?',
      correct: 'IllegalArgumentException을 던져 잘못된 id를 알리고, 양수인 id만 반환해요.',
      correctWhy: '조건 id <= 0을 검사해 예외를 던진 뒤에야 유효한 id를 반환해요.',
      wrong: ['0을 조용히 1로 바꾸어 정상 id처럼 반환해요.', '예외 대신 null을 반환해 정수 반환 타입의 계약을 바꿔요.'],
      wrongWhy: ['자동 보정은 예제에 정의되지 않은 정책이며 호출자의 입력 오류를 숨길 수 있어요.', '메서드 반환 타입은 int이고, 잘못된 입력은 명시한 예외로 알려요.'],
      hint: '검증 조건에 걸렸을 때 반환문 전에 어떤 분기가 실행되는지 확인해 보세요.',
    },
  },
  '예제 시나리오': {
    concept: {
      prompt: 'nextLevel의 규칙이 정상 입력에서는 1을 더하고 음수에서는 예외를 던지는지 확인하려면 어떤 사례를 준비해야 하나요?',
      hint: '정상 입력뿐 아니라 허용 범위의 경계와 거부해야 할 입력도 포함하세요.',
      wrongWhy: ['성공 사례 하나만으로는 경계와 잘못된 입력의 처리 규칙을 확인할 수 없어요.', '기대 결과가 없는 출력만으로는 함수가 약속을 지켰는지 판단하기 어려워요.'],
      explanation: '시나리오는 입력과 기대 결과를 짝지어 보여 줍니다. 정상값, 경계값, 실패 입력을 나누면 계약의 각 부분을 확인할 수 있어요.',
    },
    intro: '시나리오는 대표 정상값만 보여 주지 않습니다. 0 같은 경계값과 -1 같은 실패값을 함께 넣어 코드의 계약이 각 경우에 어떻게 반응하는지 비교해요.',
    recall: { prompt: '구체적인 입력값과 기대 결과를 한 쌍으로 적는 테스트 단위를 한글 또는 영어로 적으세요.', accepted: ['테스트 케이스', '테스트 사례', 'test case'], hint: '입력 조건만 나열하는 대신 그 입력에서 예상하는 결과도 함께 정합니다.', explanation: '테스트 케이스(test case)는 구체적인 입력값과 기대 결과를 짝으로 정해 기능의 동작을 확인하는 단위입니다.' },
    application: {
      prompt: 'nextLevel을 검토할 테스트 사례를 고릅니다. 정상·경계·실패 경로를 모두 확인하는 세트는 무엇인가요?',
      correct: '0은 1, 3은 4를 반환하고, -1은 IllegalArgumentException을 던지는지 확인해요.',
      correctWhy: '정상 입력 둘과 실패 입력 하나로 기대 결과를 각기 적어 기능 계약의 경계를 확인해요.',
      wrong: ['3을 한 번 넣고 결과가 4인지 확인한 뒤 모든 입력이 안전하다고 결론 내요.', '출력 문구만 확인하고 음수 입력에서의 동작은 확인하지 않아요.'],
      wrongWhy: ['정상 사례 하나는 경계와 실패 정책을 검증하지 않아요.', '예제의 계약에는 음수 거부가 포함되므로 실패 경로도 확인해야 해요.'],
      hint: '숫자 범위의 아래 경계와 계약을 위반하는 입력을 따로 넣어 보세요.',
    },
  },
  '코드 읽기': {
    concept: {
      prompt: '목록에서 filter를 거쳐 count 결과가 나오는 예제의 값을 정확히 예상하려면 어떻게 읽어야 하나요?',
      hint: '입력 원소마다 조건 결과를 확인한 뒤, 마지막 연산이 무엇을 세는지 보세요.',
      wrongWhy: ['첫 줄만 읽으면 필터와 최종 연산이 결과에 미치는 영향을 놓쳐요.', '이 예제는 각 원소의 조건과 API 동작을 따라가면 결과를 추론할 수 있어요.'],
      explanation: '코드 읽기는 입력값이 조건과 연산을 거쳐 반환되거나 출력되는 순서를 추적하는 일입니다. 여기서는 true인 항목만 남긴 뒤 그 수를 셉니다.',
    },
    intro: '목록 [true, false, true]에서 filter가 true인 항목만 남기고 count가 2를 셉니다. List 입력, 중간 필터, 최종 결과 순서로 데이터가 흐르는지 추적하세요.',
    recall: { prompt: '입력이 조건과 연산을 거쳐 결과로 이어지는 순서를 한글 또는 영어로 적으세요.', accepted: ['실행 흐름', '제어 흐름', '코드 흐름', 'control flow'], hint: '변수 값이 어느 조건을 통과해 어디서 반환되거나 출력되는지 따라가요.', explanation: '실행 흐름(제어 흐름, control flow)은 입력이 조건과 연산을 거쳐 반환되거나 출력되기까지의 순서입니다.' },
    application: {
      prompt: 'completed가 [true, false, false, true]로 바뀌었습니다. 같은 스트림은 완료 항목을 몇 개 출력하나요?',
      correct: 'filter(Boolean::booleanValue)는 true 두 개만 남기므로 count는 2예요.',
      correctWhy: 'false 두 항목은 필터에서 제외되고 true 두 항목만 최종 count에 포함돼요.',
      wrong: ['목록 길이인 4를 출력해요.', 'true와 false를 모두 세어 3을 출력해요.'],
      wrongWhy: ['목록 전체 크기는 4지만 결과 연산은 조건을 통과한 원소만 셉니다.', 'count는 합계가 아니라 필터를 통과한 항목 수예요.'],
      hint: 'count 전에 filter 조건을 통과하는 원소만 표시해 보세요.',
    },
  },
  '오류 진단': {
    concept: {
      prompt: 'nextLevel(3)의 기대값은 4인데 실제값이 3입니다. 원인을 찾기 전에 먼저 남길 정보는 무엇인가요?',
      hint: '같은 입력으로 다시 확인할 수 있도록 입력값, 기대 결과, 실제 결과를 함께 기록하세요.',
      wrongWhy: ['첫 추측만으로 원인을 확정하면 다른 실행 경로나 조건을 놓칠 수 있어요.', '로그를 지우면 실패를 다시 확인하고 비교할 근거가 사라져요.'],
      explanation: '재현 조건과 기대·실제 결과를 먼저 고정하면 같은 상황에서 원인을 추적하고 수정 전후를 비교할 수 있습니다.',
    },
    intro: '예제는 completed=3에서 기대값 4, 수정 전 실제값 3을 같은 입력으로 재현한 뒤, 수정 후 실제값을 다시 비교합니다. 코드를 바꾸기 전에 입력·기대 결과·실제 결과를 기록해야 원인을 좁힐 수 있어요.',
    recall: { prompt: '문제를 다시 확인할 수 있게 입력, 기대 결과, 실제 결과를 남긴 사례를 한글 또는 영어로 적으세요.', accepted: ['재현 조건', '재현 사례', '오류 재현', '재현 가능한 사례', 'reproduction'], hint: '수정 전 결과를 같은 조건에서 다시 확인할 수 있도록 기록해요.', explanation: '재현 사례(reproduction)는 같은 입력에서 문제가 다시 나타나는지 확인할 수 있도록 입력과 기대·실제 결과를 기록한 것입니다.' },
    application: {
      prompt: 'nextLevel(3)의 기대값은 4인데 실제값은 3입니다. 첫 조치로 가장 적절한 것은 무엇인가요?',
      correct: '입력 3, 기대값 4, 실제값 3을 재현 가능한 실패 사례로 기록하고 해당 호출 경로를 추적해요.',
      correctWhy: '재현 조건과 결과 차이를 먼저 고정하면 수정 전후를 같은 기준으로 비교할 수 있어요.',
      wrong: ['관련 없는 메서드들을 한꺼번에 수정하고 다시 실행해요.', '기대값을 실제값 3으로 바꿔 오류를 없애요.'],
      wrongWhy: ['여러 변경을 섞으면 어느 수정이 원인을 해결했는지 알기 어려워요.', '요구한 계약이 nextLevel(3)=4라면 기대값을 임의로 바꾸면 결함을 감추게 돼요.'],
      hint: '먼저 실패를 반복할 수 있는 입력과 결과 차이를 남기고, 그 다음 한 가지 원인을 확인해 보세요.',
    },
  },
  '설계 선택': {
    concept: {
      prompt: '언어 이름으로 해당 학습 진행 수를 자주 찾는 요구에 맞는 자료 구조는 무엇이며, 선택 근거는 무엇인가요?',
      hint: '찾을 때 이미 알고 있는 값이 숫자 위치인지, 언어 이름 같은 키인지 구분하세요.',
      wrongWhy: ['배열만 저장하면 언어 이름과 각 위치의 대응 관계도 따로 관리해야 해요.', '언어별 if 분기는 항목이 늘 때마다 코드를 수정하게 만들어요.'],
      explanation: 'Map은 언어 이름과 진행 수를 키·값으로 연결하므로 이 요구를 직접 표현합니다. 정렬이나 순회가 중요해지면 다른 자료 구조와 비용도 비교해야 해요.',
    },
    intro: 'progressByTrack은 언어 이름을 키로 완료 단원 수를 찾습니다. 키 조회라는 요구에는 Map이 맞지만, 정렬·순회·메모리 사용 같은 다른 요구가 생기면 다시 비교해야 해요.',
    recall: { prompt: '설계안의 장점과 비용을 요구에 비추어 함께 비교하는 일을 한글 또는 영어로 적으세요.', accepted: ['장단점 비교', '절충 관계', '상충 관계', '트레이드오프', 'trade-off', 'tradeoff'], hint: '어떤 선택이 무엇을 쉽게 하고 무엇을 더 어렵게 만드는지 비교해요.', explanation: '장단점 비교(트레이드오프, trade-off)는 한 선택의 이점과 그 선택으로 생기는 비용을 요구사항에 맞춰 살펴보는 일입니다.' },
    application: {
      prompt: '새 요구사항은 언어 이름으로 완료 단원 수를 자주 찾는 것입니다. 어떤 설계와 근거가 예제에 맞나요?',
      correct: 'Map<String, Integer>를 쓰고 언어 이름을 키로 삼아 해당 진행 수를 조회해요.',
      correctWhy: 'Map은 키와 값을 연결하므로 이름을 알고 있을 때 대응하는 수를 직접 찾는 요구와 맞아요.',
      wrong: ['완료 수만 배열에 넣고 언어 이름과 인덱스의 대응 규칙은 기록하지 않아요.', '언어마다 서로 다른 변수와 if 분기를 계속 추가해요.'],
      wrongWhy: ['이름-인덱스 표가 빠지면 값을 어느 언어와 연결하는지 알 수 없어요.', '언어를 추가할 때마다 분기를 고쳐야 해 키 조회라는 요구를 직접 표현하지 못해요.'],
      hint: '조회할 때 주어진 값이 위치 번호인지, 키로 사용할 이름인지 살펴보세요.',
    },
  },
  '성능 가설': {
    concept: {
      prompt: '코드 변경으로 응답 시간을 줄이려는 주장을 검증 가능하게 만들려면 무엇을 함께 정해야 하나요?',
      hint: '어떤 입력에서 어떤 지표가 얼마나 달라져야 하는지 적으세요.',
      wrongWhy: ['느낌만으로는 변경 전후의 차이를 측정하거나 재현할 수 없어요.', '한 번의 실행에는 준비 과정과 우연한 부하가 섞일 수 있어 결론의 근거가 약해요.'],
      explanation: '성능 가설은 대표 입력, 관찰할 지표, 기대하는 변화와 측정 조건을 포함해야 결과로 판단할 수 있어요.',
    },
    intro: 'nanoTime은 벽시계 시각이 아니라 임의 기준점으로부터의 고해상도 값입니다. 같은 JVM 안에서 시작값과 끝값의 차이를 재면 경과 시간을 구할 수 있지만, 이 예제의 한 번 측정만으로 성능이 좋아졌다고 결론내리지는 마세요.',
    recall: { prompt: '측정 전에 입력과 지표, 기대 변화를 정해 검증할 수 있게 만든 예상을 한글 또는 영어로 적으세요.', accepted: ['성능 가설', '성능에 대한 가설', '가설', 'performance hypothesis', 'hypothesis'], hint: '“느릴 것 같다” 대신 측정 대상, 입력 크기, 기대 변화를 정해요.', explanation: '성능 가설은 대표 입력과 측정 지표, 기대하는 변화를 정해 실제 측정으로 확인할 수 있게 만든 예상입니다.' },
    application: {
      prompt: '다른 JVM의 nanoTime() 값을 서로 빼서 두 실행의 속도를 비교하려 합니다. 정확한 설명은 무엇인가요?',
      correct: '각 nanoTime 값은 임의 기준점에 상대적이므로 같은 JVM 안에서 시작과 끝의 차이를 구해야 해요.',
      correctWhy: 'nanoTime은 벽시계 시간이 아니며 다른 JVM 인스턴스는 다른 기준점을 사용할 수 있어요.',
      wrong: ['nanoTime은 UTC 시각이므로 JVM이 달라도 원시 값을 직접 비교할 수 있어요.', '반환 단위가 나노초이므로 모든 실행에서 실제 해상도가 항상 1나노초예요.'],
      wrongWhy: ['공식 API는 nanoTime이 어떤 시각 체계와도 무관하며 경과 시간에만 쓰인다고 설명해요.', '정밀도와 실제 시간 해상도는 다르며 나노초 해상도를 보장하지 않아요.'],
      hint: '두 원시 값이 아니라 한 JVM의 시작값과 종료값 차이가 의미를 갖는다는 점을 기억하세요.',
    },
  },
  '학습 회고': {
    concept: {
      prompt: '다음 복습 주제를 고를 때 점수만 기록하는 대신 어떤 정보를 함께 돌아봐야 하나요?',
      hint: '틀린 문제의 종류와 왜 막혔는지가 다음 학습 행동을 정하는 근거예요.',
      wrongWhy: ['점수만으로는 어떤 개념을 놓쳤는지 알기 어려워요.', '모든 주제를 처음부터 반복하면 실제 약점에 맞춘 계획을 세우기 어려워요.'],
      explanation: '학습 회고는 결과와 막힌 이유를 돌아보고, 그 근거로 다음에 연습할 행동을 정하는 과정입니다.',
    },
    intro: '주제별 오답 수를 세어 가장 많이 막힌 예외 처리를 다음 복습 대상으로 고릅니다. 오답 수는 다음 연습을 정하는 단서이지 지식 수준의 완전한 측정은 아니므로, 오답 원인도 함께 돌아보세요.',
    recall: { prompt: '학습 결과와 막힌 이유를 돌아보고 다음 연습을 정하는 활동을 한글 또는 영어로 적으세요.', accepted: ['회고', '학습 회고', '돌아보기', 'retrospective'], hint: '점수만 보지 말고 틀린 유형과 원인을 바탕으로 다음 행동을 정해요.', explanation: '회고(retrospective)는 학습 결과와 막힌 이유를 돌아보고, 그 근거로 다음에 할 연습을 정하는 활동입니다.' },
    application: {
      prompt: 'exceptions 3회, collections 1회, loops 0회로 기록됐습니다. 예제의 규칙에 따라 다음 복습 주제는 무엇인가요?',
      correct: 'exceptions를 먼저 복습해요. 기록된 오답이 3회로 가장 많기 때문이에요.',
      correctWhy: 'topicWithMostMistakes는 가장 큰 오답 수를 가진 주제를 선택해 다음 복습 후보로 돌려줘요.',
      wrong: ['기록 순서상 마지막인 loops를 선택해요.', '오답이 하나라도 있는 모든 주제를 같은 순서로 다시 시작해요.'],
      wrongWhy: ['Map의 마지막 항목을 고르는 규칙은 코드에 없고 loops의 오답 수는 0이에요.', '예제는 오답이 가장 많은 한 주제를 우선 골라요.'],
      hint: '각 주제의 횟수를 비교해 가장 큰 수를 먼저 찾으세요.',
    },
  },
};

const focusedJavaWeeksSevenToNineNotes = {
  'List와 순서': {
    intro: '`names`에 Mina, Jin, Mina를 차례대로 넣으면 출력도 `[Mina, Jin, Mina]`예요. `List`는 삽입 순서를 유지하고 같은 값도 여러 번 담을 수 있어, 두 요구를 모두 만족합니다.',
    concept: { prompt: '`Mina`, `Jin`, `Mina`를 차례로 `names`에 추가한 직후 `names.size()`는 얼마인가요?', hint: '같은 Mina도 List에 각각 추가한 원소로 세어 보세요.', wrongWhy: ['두 번째 Mina도 별도 원소로 남기 때문에 크기에 포함돼요.', 'List는 세 번 추가한 원소를 모두 유지합니다.'] },
    recall: { prompt: 'List에 원소를 추가할 때 사용하는 메서드 이름은 무엇인가요?', accepted: ['add', 'add()', 'add 메서드'], hint: '`names.add("Mina")`에서 원소를 추가하는 메서드 이름을 확인하세요.', explanation: '`add`는 List에 원소를 추가해요. 예제에서는 이 메서드를 세 번 호출해 세 원소를 만듭니다.' },
    application: { prompt: '`names`에 `"SQL"`을 한 번 더 추가합니다. 순서와 중복을 허용하는 List의 출력은 어떻게 되나요?', correct: '`[Mina, Jin, Mina, SQL]`로 기존 원소 뒤에 SQL이 추가돼요.', correctWhy: 'List는 삽입 순서를 유지하고 중복도 허용하므로 기존 세 값 뒤에 새 입력이 놓입니다.', wrong: ['중복인 Mina가 제거되어 `[Mina, Jin, SQL]`이 돼요.', 'Map이 아니므로 새 값을 추가할 수 없어 오류가 나요.'], wrongWhy: ['중복 제거는 Set의 특성이고 List는 Mina를 두 번 남겨요.', 'List에는 add로 원소를 추가할 수 있어요.'], hint: '예제의 세 원소를 그대로 적은 뒤 새로 추가한 값을 마지막에 붙여 보세요.' },
  },
  'Set과 중복': {
    intro: '`HashSet`에 `java`, `collections`, `java`를 넣으면 고유한 값은 두 개이고 `contains("java")`는 true예요. `HashSet`의 순회 순서는 예제에서 보장하지 않으므로 화면도 그 순서를 정답으로 가정하지 않습니다.',
    concept: { prompt: '예제에 `"java"`를 두 번 넣은 뒤에도 고유한 태그 수가 2인 이유는 무엇인가요?', hint: '같은 값의 두 번째 add가 새 원소를 늘리는지 확인하세요.', wrongWhy: ['Set은 인덱스로 읽는 자료 구조가 아니며 중복 여부를 기준으로 원소를 관리해요.', 'HashSet은 삽입 순서를 보장하지 않으므로 예제는 순서를 정답으로 비교하지 않습니다.'] },
    recall: { prompt: '`Set`에 같은 문자열을 두 번 추가하면 고유 원소는 몇 개 남나요?', accepted: ['1', '하나', '1개', '한 개'], hint: '두 값이 같으면 Set에는 하나만 남아요. 고유 원소 수를 세어 보세요.', explanation: 'Set은 같은 원소의 중복 저장을 허용하지 않아요. 같은 문자열을 두 번 추가해도 그 값은 한 번만 존재합니다.' },
    application: { prompt: '`tags`에 `"spring"`을 두 번 더 추가합니다. 예제와 같은 Set에서 `size()`는 얼마인가요?', correct: '3이에요. `java`, `collections`, `spring` 세 가지 고유 값이 남습니다.', correctWhy: 'Set은 두 번째 spring을 별도 원소로 세지 않으므로 고유한 문자열은 세 개예요.', wrong: ['4예요. add를 호출한 총 횟수를 셉니다.', 'HashSet은 삽입 순서를 모르므로 size도 알 수 없어요.'], wrongWhy: ['size는 호출 횟수가 아니라 현재 고유 원소 수를 반환해요.', '순회 순서가 정해지지 않아도 원소 수는 확인할 수 있어요.'], hint: '서로 다른 문자열만 한 번씩 적고 그 개수를 세어 보세요.' },
  },
  'Map과 키': {
    intro: '`minutesByCourse`는 `"Java"` 키에 40, `"Python"` 키에 35를 연결해요. 같은 키에 새 값을 넣으면 기존 값이 교체되고, 존재하지 않는 키의 `get` 결과는 null일 수 있습니다.',
    concept: { prompt: '`minutesByCourse`에서 `"Java"`처럼 이름을 주고 해당 학습 시간을 찾는 데 Map이 맞는 이유는 무엇인가요?', hint: '컬렉션이 저장하는 한 항목이 단일 값인지, 키와 대응하는 값인지 살펴보세요.', wrongWhy: ['Map은 키와 값의 연결을 저장하므로 값만 쌓는 구조가 아닙니다.', 'Map은 단순한 위치 기반 목록이 아니며 키를 사용해 값을 찾습니다.'] },
    recall: { prompt: '값이 연결되지 않은 키로 `minutesByCourse.get("Kotlin")`을 호출하면 어떤 결과를 받을 수 있나요?', accepted: ['null', '널', 'null 값'], hint: '`Map.get`은 없는 키를 만나면 기본 숫자 0을 자동으로 만들지 않아요.', explanation: '이 예제에서 `Kotlin`은 키가 없으므로 `get`은 null을 반환해요. 이후 계산 전에 키가 있는지 확인하거나 `getOrDefault` 같은 방법을 사용할 수 있습니다.' },
    application: { prompt: '`minutesByCourse`에 `"Kotlin"` 키가 없습니다. 없을 때 0을 사용하려면 어떤 호출이 명확한가요?', correct: '`minutesByCourse.getOrDefault("Kotlin", 0)`을 사용해요.', correctWhy: 'getOrDefault는 키가 있을 때 저장된 값을, 없을 때 지정한 기본값 0을 반환합니다.', wrong: ['`minutesByCourse.get("Kotlin") + 0`을 바로 계산해요.', '`minutesByCourse.containsValue("Kotlin")`으로 시간을 읽어요.'], wrongWhy: ['키가 없으면 get은 null을 반환할 수 있어 정수와 더할 때 unboxing 오류가 날 수 있어요.', 'containsValue는 값이 포함됐는지 boolean으로 검사하며 키의 학습 시간을 반환하지 않습니다.'], hint: '키가 없는 경우의 기본 반환값을 인자로 지정하는 Map 메서드를 떠올리세요.' },
  },
  '제네릭 경계': {
    intro: '`max(2, 5)`에서 T는 Integer로 추론되고, `Comparable<T>`가 제공하는 `compareTo`로 두 값을 비교해 5를 반환해요. 비교할 수 없는 임의의 타입은 이 메서드에 전달할 수 없도록 컴파일 단계에서 제한합니다.',
    concept: { prompt: '`max`의 `T extends Comparable<T>` 선언이 `left.compareTo(right)`를 허용하는 근거는 무엇인가요?', hint: '경계가 T에 대해 어떤 동작을 보장하는지 확인하세요.', wrongWhy: ['경계는 타입을 무조건 Object로 바꾸는 것이 아니라 허용 타입에 필요한 계약을 제한합니다.', '제네릭 경계는 타입 검사를 끄지 않고 사용할 수 있는 멤버를 보장합니다.'] },
    recall: { prompt: '`Comparable<T>`의 `compareTo`는 두 값의 순서를 어떤 세 가지 부호 결과로 알려 주나요?', accepted: ['음수, 0, 양수', '음수 0 양수', 'negative zero positive', '음수·0·양수'], hint: '왼쪽 값이 작음, 같음, 큼을 반환값 부호로 구분합니다.', explanation: '`compareTo`는 비교 결과로 음수, 0, 양수 중 하나를 반환해요. 예제는 0 이상이면 left를, 아니면 right를 선택합니다.' },
    application: { prompt: '`max("ant", "bee")`를 호출하면 사전식 비교에서 어느 문자열이 반환되나요?', correct: '`"bee"`가 반환돼요. `"ant".compareTo("bee")`가 음수이므로 right를 선택합니다.', correctWhy: '문자열의 자연 순서에서 ant가 bee보다 앞서므로 비교 결과가 음수이고 삼항식은 right를 돌려줘요.', wrong: ['`"ant"`가 반환돼요. 비교가 음수면 left를 선택합니다.', '두 문자열이 다르면 Comparable 경계가 있어도 컴파일되지 않아요.'], wrongWhy: ['메서드는 compareTo 결과가 0 이상일 때만 left를 반환해요.', 'String은 Comparable<String>을 구현하므로 예제의 두 값은 비교할 수 있습니다.'], hint: 'compareTo가 음수일 때 삼항식의 어느 분기로 가는지 따라가세요.' },
  },
  '컬렉션 순회': {
    intro: '예제는 Iterator가 Python을 반환한 직후 `iterator.remove()`를 호출해 그 원소만 지우고 `[Java]`를 출력해요. 이 ArrayList 반복자에서 제거하려면 목록이 아니라 반복자의 remove를 사용하고, 먼저 next를 호출해야 합니다.',
    concept: { prompt: '예제처럼 순회 중 `"Python"` 항목을 제거하면서 ArrayList를 안전하게 갱신하는 호출은 무엇인가요?', hint: '현재 원소를 반환한 Iterator가 제공하는 제거 메서드를 사용하세요.', wrongWhy: ['for-each가 제공하는 반복 중 list 직접 변경은 ArrayList 반복자와 구조 변경 상태가 충돌할 수 있어요.', '인덱스는 이 예제의 Iterator 순회에 필요하지 않고 모든 컬렉션에 인덱스가 있는 것도 아닙니다.'] },
    recall: { prompt: '예제에서 `Iterator.next()`로 받은 현재 원소를 안전하게 제거할 때 작성하는 메서드 호출식은 무엇인가요?', accepted: ['iterator.remove()', 'iterator.remove() 호출'], hint: '`Iterator` 객체의 이름과 그 객체가 제공하는 제거 메서드를 함께 적으세요.', explanation: '`iterator.remove()`는 가장 최근 `next()`가 반환한 원소를 제거해요. 컬렉션에서 `remove`를 직접 호출하면 반복 중 구조가 바뀌어 안전하지 않을 수 있습니다. `next()` 전이나 같은 원소에 `remove()`를 반복하는 호출도 허용되지 않아요.' },
    application: { prompt: '예제에서 조건을 `"Java"`와 비교하도록 바꾸고 같은 Iterator 제거를 적용하면 목록은 무엇이 되나요?', correct: '`[Python]`만 남아요. Iterator가 반환한 Java를 제거하고 나머지 원소는 유지합니다.', correctWhy: 'remove는 직전에 next가 반환한 Java를 목록에서 지우고 Python은 조건에 맞지 않아 남깁니다.', wrong: ['`[]`가 돼요. 한 번 remove하면 반복자 전체 원소가 모두 지워집니다.', '`[Java, Python]`이 그대로예요. Iterator.remove는 목록을 변경하지 않습니다.'], wrongWhy: ['remove는 반복자 전체가 아니라 현재 next로 받은 한 원소를 제거합니다.', 'ArrayList의 iterator.remove는 지원되는 제거 동작으로 backing list의 해당 원소를 지워요.'], hint: '각 next 결과 중 조건에 맞는 Java만 표시하고 제거 후 남는 원소를 적어 보세요.' },
  },
  '예외 흐름': {
    intro: '`validateMinutes(-1)`은 조건에 걸려 `IllegalArgumentException`을 던지고, 호출부 catch가 메시지를 출력해요. 실패를 정상 반환값으로 가장하지 않고 예외 경로로 알려 주는 예제입니다.',
    concept: { prompt: '`validateMinutes(-1)`처럼 허용되지 않는 입력을 만났을 때 예외가 나타내는 것은 무엇인가요?', hint: '정상 결과와 구별해 실패 이유를 호출자에게 알리는 경로입니다.', wrongWhy: ['예외를 무시하면 잘못된 입력 뒤에 실행된 코드가 실패를 모른 채 진행할 수 있어요.', '예외는 true/false 값이 아니며 별도의 제어 흐름으로 전달됩니다.'] },
    recall: { prompt: '`validateMinutes(-1)`이 잘못된 인자를 알리며 던지는 예외의 상위 RuntimeException 계열 이름은 무엇인가요?', accepted: ['IllegalArgumentException', '불법 인자 예외', '잘못된 인자 예외'], hint: '메서드 인자의 허용 범위를 어긴 호출을 나타내는 예외예요.', explanation: '`IllegalArgumentException`은 메서드가 부적절한 인자를 받았음을 나타냅니다. 예제는 0 이하의 minutes를 거부해요.' },
    application: { prompt: '`validateMinutes(0)`이 같은 조건 검사를 통과할까요?', correct: '통과하지 않고 `IllegalArgumentException`을 던져요. 조건 `minutes <= 0`이 참입니다.', correctWhy: '0은 양수가 아니므로 예외를 던지는 분기가 실행되고 메시지는 `minutes must be positive`입니다.', wrong: ['0은 예외 조건의 경계 바깥이라 정상 처리돼요.', '검증 메서드는 void이므로 실패해도 호출자에게 어떤 신호도 주지 않아요.'], wrongWhy: ['검사는 0도 포함하는 `<= 0`이므로 0에서 참입니다.', 'void는 정상 반환값이 없다는 뜻이지 예외를 던질 수 없다는 뜻이 아니에요.'], hint: '`minutes <= 0`에 0을 대입해 참인지 거짓인지 확인하세요.' },
  },
  'checked 예외 읽기': {
    intro: '`BufferedReader.readLine()`은 IOException을 던질 수 있어요. 이 예제는 catch로 처리합니다. 호출자가 처리 정책을 정하게 하려면 메서드 선언에 IOException을 throws로 전달할 수도 있습니다.',
    concept: { prompt: '`Files.readString(path)`처럼 checked 예외를 던질 수 있는 호출을 컴파일하려면 메서드 작성자가 해야 하는 일은 무엇인가요?', hint: '실패 가능성을 호출자까지 전달하거나 현재 위치에서 처리해야 합니다.', wrongWhy: ['RuntimeException만 선언하는 것으로 IOException 같은 checked 예외 처리를 대신할 수 없습니다.', 'catch 문은 실패를 자동으로 복구해 주지 않으며, 실제 정책을 코드에 적어야 해요.'] },
    recall: { prompt: '`BufferedReader.readLine()`이 던지는 checked 예외의 타입은 무엇인가요?', accepted: ['IOException', 'java.io.IOException', '입출력 예외'], hint: '파일·문자 스트림의 입력 실패를 나타내는 java.io 예외예요.', explanation: '`readLine()`은 IOException을 던질 수 있어요. 호출 메서드에서 catch하거나 throws로 선언해야 컴파일됩니다.' },
    application: { prompt: '`readTitle()`이 IOException을 처리하지 않고 호출자에게 전달합니다. 메서드 선언에 무엇을 추가해야 하나요?', correct: '`throws IOException`을 선언해 호출자가 처리하도록 해야 해요.', correctWhy: 'checked 예외를 메서드 본문에서 잡지 않았으므로 호출 관계에 throws 선언을 통해 전달해야 합니다.', wrong: ['반환형을 String에서 IOException으로 바꾸면 예외 선언이 됩니다.', '메서드에 `throws RuntimeException`만 선언하면 IOException도 자동으로 처리됩니다.'], wrongWhy: ['반환형과 예외 선언은 별개이며 String 반환 계약을 유지할 수 있어요.', 'IOException은 RuntimeException의 하위 타입이 아닌 checked 예외라 별도로 처리해야 합니다.'], hint: 'catch를 추가하지 않고 checked 예외를 넘길 때 메서드 시그니처에 붙이는 키워드를 쓰세요.' },
  },
  'catch 순서': {
    intro: '`FileNotFoundException`은 `IOException`의 하위 타입이고, IOException은 Exception의 하위 타입이에요. 여러 catch를 두면 구체적인 타입을 먼저 처리하고 넓은 상위 타입을 뒤에 둬야 합니다.',
    concept: { prompt: '`FileNotFoundException`, `IOException`, `Exception` 중 가장 넓은 상위 예외 타입은 무엇인가요?', hint: '`FileNotFoundException`은 IOException의 하위 타입이고 IOException은 Exception의 하위 타입이에요.', wrongWhy: ['IOException은 Exception의 하위 타입이라 더 좁아요.', 'FileNotFoundException은 IOException의 하위 타입이라 더 구체적이에요.'] },
    recall: { prompt: '`FileNotFoundException`과 `Exception`을 함께 처리할 때 먼저 두어야 하는 예외 클래스의 이름은 무엇인가요?', accepted: ['FileNotFoundException', 'java.io.FileNotFoundException', 'FileNotFoundException 예외'], hint: '더 넓은 Exception이 하위 파일 예외까지 먼저 잡지 않도록 하세요.', explanation: '`FileNotFoundException`은 `Exception`보다 구체적이므로 먼저 catch해야 해요. 어떤 예외인지 이름을 써야 순서를 정확히 알 수 있습니다. 이후 상위 타입을 처리하면 도달 불가능한 catch를 피할 수 있어요.' },
    application: { prompt: '`catch (IOException e)` 뒤에 `catch (FileNotFoundException e)`를 두면 무엇이 문제인가요?', correct: 'FileNotFoundException 절에 도달할 수 없어 컴파일 오류가 납니다. 하위 예외를 먼저 둬야 해요.', correctWhy: '앞의 IOException이 이미 FileNotFoundException을 포함하므로 뒤의 더 구체적인 절이 도달 불가능합니다.', wrong: ['Java가 먼저 작성한 뒤쪽 catch를 우선 실행해 정상 처리합니다.', '컴파일은 되지만 파일 없음 예외가 항상 IOException으로 바뀝니다.'], wrongWhy: ['catch는 순서대로 검사하며 도달할 수 없는 절은 컴파일 오류입니다.', '예외의 실제 타입은 catch 순서를 바꿔도 바뀌지 않아요.'], hint: '앞 catch 타입이 뒤 catch 타입의 상위인지 확인하세요.' },
  },
  'try-with-resources': {
    intro: '예제는 BufferedReader를 try의 자원 목록에 선언해요. 블록이 정상 종료되거나 예외로 빠져나갈 때 Java가 close를 시도합니다. 이 동작은 자원 타입이 AutoCloseable을 구현해야 합니다.',
    concept: { prompt: 'try-with-resources가 자동으로 닫아 주는 자원의 공통 타입 계약은 무엇인가요?', hint: '자원을 닫는 close 메서드를 정의하는 인터페이스 이름을 확인하세요.', wrongWhy: ['try 블록은 모든 객체를 닫지 않고 자원 위치에 선언된 AutoCloseable 자원만 닫아요.', 'finally는 수동 정리 방법일 수 있지만 try-with-resources가 요구하는 자원 계약은 아닙니다.'] },
    recall: { prompt: 'try-with-resources 자원 목록에 넣을 수 있는 close 계약의 인터페이스는 무엇인가요?', accepted: ['AutoCloseable', 'java.lang.AutoCloseable'], hint: 'BufferedReader가 구현하는 Closeable의 상위 자원 인터페이스예요.', explanation: 'try-with-resources는 AutoCloseable을 구현한 자원을 블록 종료 시 자동으로 닫아요. 모든 객체가 대상인 것은 아닙니다.' },
    application: { prompt: '예제의 `reader.readLine()`이 IOException을 던져 블록이 중간에 끝나도 resource는 어떻게 되나요?', correct: '블록을 벗어날 때 resource.close()를 시도해요. readLine 실패 때문에 정리가 생략되지 않습니다.', correctWhy: 'try-with-resources는 정상 종료와 예외 종료 모두에서 자원 닫기를 시도하도록 정의되어 있어요.', wrong: ['정상 종료일 때만 닫고 IOException이면 열린 채 남아요.', '자원 목록에 등록한 reader 외에도 메서드의 모든 객체를 닫아요.'], wrongWhy: ['예외 경로에서도 닫기를 시도하는 것이 try-with-resources의 핵심입니다.', '자동 정리는 try 자원으로 선언한 AutoCloseable에만 적용됩니다.'], hint: 'try 본문을 빠져나가는 경로가 정상인지 예외인지와 관계없이 닫기 규칙을 떠올리세요.' },
  },
  '예외에 맥락 더하기': {
    intro: '`IOException("disk unavailable")`을 원인으로 `IllegalStateException("course load failed", cause)`를 만들어요. 상위 계층은 작업 맥락을 알면서도 원래 실패 메시지를 cause 체인에서 확인할 수 있습니다.',
    concept: { prompt: '파일 읽기 IOException을 더 높은 계층의 IllegalStateException으로 바꿀 때 원래 실패 정보를 보존하는 방법은 무엇인가요?', hint: '새 예외 생성자의 메시지뿐 아니라 원인 예외 인자도 전달하세요.', wrongWhy: ['원인 없이 새 예외만 만들면 disk unavailable의 원래 진단 정보가 사라집니다.', '메시지를 비우는 것만으로는 cause 객체를 보존할 수 없어요.'] },
    recall: { prompt: '새 예외에서 원인 예외를 꺼낼 때 사용하는 `Throwable` 메서드 이름은 무엇인가요?', accepted: ['getCause', 'getCause()', 'getCause 메서드'], hint: '예제에서 `wrapped`의 원인을 반환하는 호출을 찾아보세요.', explanation: '`getCause()`는 새 예외에 연결한 원인 예외를 돌려줘요. 예제에서는 원래 `IOException`의 메시지를 읽습니다.' },
    application: { prompt: '예제의 wrapped에서 `getCause().getMessage()`를 호출하면 어떤 원래 메시지가 나오나요?', correct: '`disk unavailable`이 나와요. cause로 넘긴 IOException의 메시지입니다.', correctWhy: 'IllegalStateException은 전달받은 IOException을 cause로 보관해 원래 실패 원인을 이어 줍니다.', wrong: ['새 예외의 메시지인 `course load failed`가 반환돼요.', 'cause는 메시지를 보관하지 않아 항상 null을 반환해요.'], wrongWhy: ['새 예외 자신의 메시지는 getMessage()이고 getCause().getMessage()는 원인 메시지예요.', '2인자 생성자로 cause를 넘겼으므로 getCause()는 IOException을 돌려줍니다.'], hint: 'wrapped의 메시지와 wrapped.getCause()의 메시지를 구분하세요.' },
  },
  '람다 문법': {
    intro: '`Runnable task = () -> save();`는 실행할 동작을 값으로 만듭니다. 선언만으로 save가 실행되지는 않고 `task.run()`을 호출할 때 본문이 한 번 실행돼 `saved`를 출력해요.',
    concept: '`Runnable task = () -> save();`를 만든 뒤 `task.run()`을 두 번 호출하면 save는 몇 번 실행되나요?',
    recall: { prompt: '람다를 연결할 수 있고 한 개의 추상 메서드 계약을 가진 인터페이스를 무엇이라고 하나요?', accepted: ['함수형 인터페이스', 'functional interface', '함수형인터페이스'], hint: '`Runnable`처럼 람다 본문과 연결되는 인터페이스 종류를 떠올리세요.', explanation: '함수형 인터페이스는 람다가 구현할 추상 메서드 계약을 제공해요. default/static 메서드가 있어도 추상 메서드가 하나라면 해당 계약을 유지할 수 있습니다.' },
    application: { prompt: '`Runnable task = () -> save();` 뒤에 `task.run()`을 한 번 호출하면 save는 언제 몇 번 실행되나요?', correct: '`run()` 호출 시 save가 한 번 실행되고 `saved`가 출력돼요.', correctWhy: 'Runnable의 run이 람다 본문을 실행하므로 명시한 한 번의 호출이 save 한 번으로 이어집니다.', wrong: ['task를 대입한 순간 이미 한 번 실행됐고 run에서 두 번째로 실행돼요.', 'Runnable은 반환값이 없으므로 본문도 실행되지 않습니다.'], wrongWhy: ['람다 본문은 run 호출 전에 지연되어 있고 대입 때 실행되지 않아요.', 'Runnable의 void 반환은 결과값이 없다는 뜻이지 본문 생략이 아닙니다.'], hint: '실행을 일으키는 호출은 대입문인지 `run()`인지 순서대로 표시하세요.' },
  },
  'Predicate와 조건': {
    intro: '`even.test(4)`는 조건을 평가해 true를 돌려줘요. Predicate는 입력 T를 받아 참·거짓을 답하는 계약이라 filter 같은 API에 조건을 전달할 수 있습니다.',
    concept: { prompt: '`number -> number % 2 == 0`으로 만든 `even.test(5)`는 어떤 값을 반환하나요?', hint: '5를 2로 나눈 나머지를 계산한 뒤 0과 같은지 비교하세요.', wrongWhy: ['5를 2로 나눈 나머지는 1이라 짝수 조건은 거짓이에요.', 'Predicate.test는 숫자 입력을 그대로 반환하지 않고 조건 결과를 돌려줘요.'] },
    recall: { prompt: '`Predicate<T>`에서 조건을 검사하는 추상 메서드의 이름은 무엇인가요?', accepted: ['test', 'test(T)', 'test 메서드'], hint: '예제에서 even에 정수 4를 전달한 호출 이름을 보세요.', explanation: '`test(value)`는 조건 결과 boolean을 돌려줘요. `even.test(4)`의 결과는 true입니다.' },
    application: { prompt: '같은 짝수 Predicate에 `test(7)`을 호출하면 결과는 무엇인가요?', correct: 'false예요. 7을 2로 나눈 나머지는 0이 아닙니다.', correctWhy: '조건 `number % 2 == 0`에서 7의 나머지는 1이므로 짝수가 아니라고 판정합니다.', wrong: ['true예요. Predicate는 입력이 Integer이면 항상 true를 돌려줘요.', '7을 반환해요. test는 입력 원소를 그대로 돌려줍니다.'], wrongWhy: ['Predicate의 답은 주어진 조건의 실제 평가 결과에 따라 달라져요.', 'Predicate<T>의 test 반환형은 T가 아니라 boolean입니다.'], hint: '`7 % 2`를 먼저 계산하고 0과 같은지 비교하세요.' },
  },
  'Function 변환': {
    intro: '`Function<String, Integer> length`는 문자열을 입력받아 정수 길이를 반환해요. `length.apply("Java")`는 네 글자를 세어 4가 됩니다.',
    concept: { prompt: '`Function<String, Integer>`에서 입력과 반환 타입은 각각 무엇인가요?', hint: 'Function의 첫 타입 인자는 입력이고 두 번째 타입 인자는 결과입니다.', wrongWhy: ['Function은 결과가 항상 boolean인 조건 인터페이스가 아니에요.', 'Function은 값을 제거하는 연산이 아니라 입력을 결과 타입으로 변환하는 동작입니다.'] },
    recall: { prompt: '예제의 Function에 문자열을 전달해 길이를 계산할 때 호출하는 메서드 이름은 무엇인가요?', accepted: ['apply', 'apply()', 'apply 메서드'], hint: '`Function`의 함수를 실제 입력과 함께 실행하는 메서드예요.', explanation: '`length.apply("Java")`는 Function에 `Java`를 전달해 길이 4를 계산해요. `apply`가 전달받은 동작을 실행합니다.' },
    application: { prompt: '`Function<String, String> upper = String::toUpperCase`에 `"java"`를 전달하면 결과는 무엇인가요?', correct: '`JAVA`를 반환해요. 문자열을 대문자로 바꾸는 변환입니다.', correctWhy: 'String::toUpperCase가 입력 문자열의 대문자 형태를 새 결과로 반환합니다.', wrong: ['true를 반환해요. Function은 Predicate와 같은 조건 판정입니다.', '원래 문자열을 바꾸지 않고 결과도 반환하지 않아요.'], wrongWhy: ['String에서 String으로 타입을 변환하는 Function이며 boolean 조건이 아닙니다.', '이 메서드 참조는 변환 결과 문자열을 반환해요.'], hint: '입력 `java`의 각 ASCII 소문자를 대문자로 바꾸세요.' },
  },
  'Consumer 부작용': {
    intro: '`print.accept("ready")`는 PrintStream으로 ready를 출력해요. Consumer는 값을 받아 처리하지만 결과값을 돌려주지 않으므로, 변환 결과가 필요하면 Function을 선택해야 합니다.',
    concept: { prompt: '`Consumer<String> print`의 `accept("ready")`가 하는 일을 설명한 문장은 무엇인가요?', hint: '인자를 소비해 부수 효과를 낼 수 있지만 반환값은 없는 계약입니다.', wrongWhy: ['Consumer의 목적은 입력을 반환값으로 변환하는 것이 아니에요.', '조건 판정은 Predicate의 역할이고 Consumer는 값을 전달받아 처리합니다.'] },
    recall: { prompt: '`Consumer<T>`의 `accept` 메서드가 돌려주는 반환값은 무엇인가요?', accepted: ['없음', '반환값 없음', 'void', '값을 반환하지 않는다'], hint: 'Consumer의 함수형 메서드 선언에 표시된 반환형을 떠올리세요.', explanation: '`accept(T)`는 void를 반환해요. 출력 같은 부수 효과를 수행할 수 있지만 호출자가 결과값을 받지는 않습니다.' },
    application: { prompt: '`print.accept("Java")`를 호출하면 예제의 PrintStream에 어떤 일이 생기나요?', correct: '콘솔에 `Java`가 출력되고 accept 자체는 값을 반환하지 않아요.', correctWhy: 'System.out::println을 연결한 Consumer가 입력 문자열을 출력하는 동작을 수행합니다.', wrong: ['문자열을 `JAVA`로 변환해 반환하지만 출력은 하지 않아요.', '문자열이 짝수 길이인지 true/false를 반환해요.'], wrongWhy: ['문자열 변환은 Function의 역할이고 예제는 println 부수 효과를 연결합니다.', '조건 판정은 Predicate의 역할이며 Consumer.accept 반환형은 void예요.'], hint: 'accept에 전달된 인자와 System.out.println에 연결한 동작을 따라가세요.' },
  },
  '메서드 참조': {
    intro: '`names.forEach(System.out::println)`은 목록의 이름마다 println을 전달해 Mina와 Jin을 출력해요. 메서드 참조는 대상 함수형 인터페이스의 매개변수·반환 계약과 호환되는 람다를 간결하게 쓸 때 사용합니다.',
    concept: '`names.forEach(System.out::println)`이 동작하는 이유는 무엇인가요?',
    conceptHint: 'forEach가 요구하는 입력과 println이 받을 수 있는 인자를 비교하세요.',
    conceptWrongWhy: ['메서드 참조는 아무 메서드에나 붙이는 변환이 아니며 시그니처가 호환되어야 합니다.', '메서드 참조에는 객체 메서드 참조도 있고 생성자 참조도 있어요.'],
    recall: { prompt: '메서드의 이름과 대상 `::`를 사용해 호환되는 람다를 간결하게 표시하는 문법을 무엇이라고 하나요?', accepted: ['메서드 참조', 'method reference'], hint: '예제에서 `System.out`과 `println` 사이에 쓰인 표기를 떠올리세요.', explanation: '`System.out::println`은 매개변수를 받아 println에 전달하는 호환 람다의 메서드 참조입니다.' },
    application: { prompt: '`names.forEach(System.out::println)`을 같은 동작의 람다로 바꾸면 어떤 표현인가요?', correct: '`names.forEach(name -> System.out.println(name))`이에요.', correctWhy: 'forEach가 전달한 각 name을 println에 넘기는 동작이 메서드 참조와 같습니다.', wrong: ['`names.forEach(() -> System.out.println())`이에요.', '`names.forEach(name -> name)`이에요.'], wrongWhy: ['forEach는 각 항목을 받는 Consumer를 요구하므로 매개변수를 생략할 수 없고 출력 인자도 필요합니다.', 'name을 그대로 반환할 뿐 출력하지 않아 예제의 부수 효과와 다릅니다.'], hint: '목록에서 전달되는 각 name을 람다 매개변수로 받고 println에 그대로 넘기세요.' },
  },
};

const focusedJavaWeeksTenToTwelveNotes = {
  filter: {
    intro: '입력 `[55, 60, 85]`에서 `score >= 60`인 원소만 다음 단계로 보냅니다. 결과는 `[60, 85]`이고 원본 목록은 그대로예요.',
    concept: { prompt: '`[55, 60, 85]`에 `filter(score -> score >= 60)`을 적용하면 남는 목록은 무엇인가요?', hint: '각 점수에 조건을 적용하고 참인 원소만 입력 순서대로 남기세요.', wrongWhy: ['`55`는 조건을 만족하지 않아 결과에서 빠져요.', '이 선택지는 60을 하나 더 넣은 다른 입력의 결과예요.'] },
    recall: { prompt: '입력 끝에 60을 하나 더 추가하면 filter 결과는 무엇인가요?', accepted: ['[60, 85, 60]', '[60,85,60]', '60, 85, 60 순서'], hint: 'filter는 조건을 통과한 중복 원소도 입력 순서대로 보존해요.', explanation: '`score >= 60`을 통과하는 값은 60, 85, 마지막 60이므로 결과는 `[60, 85, 60]`입니다. filter는 중복을 제거하지 않아요.' },
    application: { prompt: '입력 끝에 60을 하나 더 추가하면 같은 `filter` 결과는 무엇인가요?', correct: '`[60, 85, 60]`이에요. 조건을 통과한 중복 원소도 원래 순서대로 남습니다.', correctWhy: 'filter는 조건을 만족하는 각 원소를 보존하므로 마지막의 두 번째 60도 결과에 포함돼요.', wrong: ['`[60, 85]`예요. filter는 중복을 자동으로 제거합니다.', '`[55, 60, 85, 60]`이에요. filter는 조건을 확인하지 않습니다.'], wrongWhy: ['중복 제거는 Set 같은 별도 연산 없이 filter가 수행하지 않아요.', '55는 60 이상이 아니므로 결과에서 빠집니다.'], hint: '각 원소를 독립적으로 비교하고, 참인 항목을 입력 순서대로 모으세요.' },
  },
  map: {
    intro: '`String::length`를 `map`에 전달해 `[Mina, Jin]`을 `[4, 3]`으로 바꿉니다. 원소 수와 순서는 유지하면서 원소 타입과 값이 String에서 Integer로 바뀌어요.',
    concept: '`names.stream().map(String::length)`는 문자열 목록을 어떤 값의 흐름으로 변환하나요?',
    conceptHint: 'map은 원소마다 변환 함수를 한 번 적용해 결과 원소를 만듭니다.',
    conceptWrongWhy: ['map은 원소를 거르는 조건 연산이 아니며 이 예제에서는 모든 이름을 변환해요.', 'map은 값을 변환할 뿐 스트림을 닫거나 최종 결과를 바로 만들지 않습니다.'],
    recall: { prompt: '`["Mina", "Jin"]`에 `map(String::length)`를 적용한 결과를 적으세요.', accepted: ['[4, 3]', '[4,3]', '4와 3'], hint: 'Mina는 네 글자, Jin은 세 글자예요.', explanation: 'map은 각 이름의 길이를 반환하므로 결과는 정수 목록 `[4, 3]`입니다.' },
    application: { prompt: '입력 앞에 `"Bo"`를 추가하면 `map(String::length)`의 결과는 무엇인가요?', correct: '`[2, 4, 3]`이에요. 입력 순서대로 각 문자열의 길이를 반환합니다.', correctWhy: 'Bo, Mina, Jin의 길이는 각각 2, 4, 3이고 map은 순서를 유지해 변환해요.', wrong: ['`[2]`예요. map은 첫 번째 결과 뒤에서 중단됩니다.', '`[Bo, Mina, Jin]`이에요. map은 원소를 바꾸지 않습니다.'], wrongWhy: ['map은 특별한 종료 조건이 없으며 모든 입력 원소에 적용됩니다.', 'String::length가 각 문자열을 정수 길이로 바꿉니다.'], hint: '새 입력 순서를 유지하면서 각 문자열의 문자 수로 바꾸세요.' },
  },
  flatMap: {
    intro: '`["Java APIs", "clean code"]`의 각 문장을 공백 기준 단어 스트림으로 만든 다음 하나의 흐름으로 펼쳐 `[Java, APIs, clean, code]`를 얻습니다.',
    concept: '`flatMap`이 문장별 단어 흐름을 처리할 때 `map`과 다른 점은 무엇인가요?',
    conceptHint: '각 입력이 여러 결과를 만들 때 중첩된 스트림을 하나의 흐름으로 합치는지 살펴보세요.',
    conceptWrongWhy: ['flatMap은 정렬 연산이 아니며 원소 비교 순서를 정하지 않아요.', '첫 결과만 남기는 연산이 아니라 각 문장에서 나온 단어를 모두 이어 붙여요.'],
    recall: { prompt: '마지막 입력에 `"safe tools"`를 추가하면 flatMap 결과 끝에 어떤 두 단어가 더해지나요?', accepted: ['safe, tools', '[safe, tools]', 'safe와 tools'], hint: '새 문장을 공백으로 나눈 뒤 원래 문장들 뒤에 순서대로 붙이세요.', explanation: '새 입력은 `safe`와 `tools` 두 단어를 만들고, flatMap은 이 결과도 기존 단어 흐름 끝에 이어 붙입니다.' },
    application: { prompt: '마지막 입력에 `"safe tools"`를 추가하면 flatMap 결과 끝에는 무엇이 더해지나요?', correct: '`safe`, `tools`가 순서대로 더해져 최종 결과는 `[Java, APIs, clean, code, safe, tools]`예요.', correctWhy: '각 문장에서 만든 단어 스트림을 입력 문장 순서와 단어 순서에 따라 하나로 연결합니다.', wrong: ['`[safe tools]`라는 한 문자열만 결과에 더해져요.', '`safe`, `tools`가 맨 앞에 놓이고 앞 문장의 결과는 사라져요.'], wrongWhy: ['예제는 split 결과를 flatMap하므로 두 단어가 개별 원소가 됩니다.', 'flatMap은 입력 순서에 따라 각 하위 흐름을 펼칩니다.'], hint: '새 문장을 공백 기준으로 나눈 두 원소를 기존 네 원소 뒤에 붙이세요.' },
  },
  'collect와 toList': {
    intro: '예제는 `ann`, `bob`을 대문자로 변환한 결과를 `Stream.toList()`로 모읍니다. 이 API는 Java 16부터 사용할 수 있고 반환 목록은 수정할 수 없어요.',
    concept: '스트림에서 `map(...).toList()`의 `toList()`는 어떤 종류의 연산인가요?',
    conceptHint: '중간 연산은 새 스트림을 이어 주고, 최종 연산은 파이프라인을 소비해 결과를 반환해요.',
    conceptWrongWhy: ['toList는 조건이나 변환을 뒤에 연결하는 중간 연산이 아니라 최종 결과를 모읍니다.', 'collect는 collector를 사용해 누적하는 최종 연산이지 정렬만 하는 API가 아니에요.'],
    recall: { prompt: 'Oracle Java API 기준으로 `Stream.toList()`를 사용할 수 있게 된 Java 버전을 적으세요.', accepted: ['Java 16', '16', 'Java 16부터', 'Java 16 이상'], hint: '최신 API라도 도입 버전을 확인하면 오래된 런타임과의 호환 여부를 판단할 수 있어요.', explanation: '`Stream.toList()`는 Java 16에 추가됐어요. 이전 버전에서는 `collect(Collectors.toList())`를 사용할 수 있지만, 그 결과의 변경 가능성은 `toList()`와 같다고 가정하면 안 됩니다.' },
    application: { prompt: '`upper`에 `upper.add("KOTLIN")`을 호출하면 어떻게 되나요?', correct: '`UnsupportedOperationException`이 발생해요. `Stream.toList()`가 돌려준 목록은 수정할 수 없습니다.', correctWhy: 'Stream.toList의 결과는 수정 불가 목록이므로 원소 추가와 제거를 지원하지 않아요.', wrong: ['목록 끝에 KOTLIN이 추가돼요. toList는 항상 ArrayList를 반환합니다.', '원본 `names`가 변경되고 upper에는 아무 변화가 없어요.'], wrongWhy: ['Stream.toList의 결과 구현 클래스를 ArrayList로 가정할 수 없고 명세상 수정 불가입니다.', '파이프라인 결과 목록을 변경하려는 호출이며 원본 입력 목록과는 별개예요.'], hint: '이 API 결과의 변경 가능성 계약과 add 호출을 대조하세요.' },
  },
  '스트림 재사용 금지': {
    intro: '`count()`가 첫 스트림을 소비한 뒤에는 다시 사용하지 않습니다. 대문자 목록은 원본 `names`에서 새 `stream()`을 열어 계산해요.',
    concept: '이미 `count()`를 호출해 소비한 Stream 객체를 다음 `map` 파이프라인에 다시 쓸 수 있나요?',
    conceptHint: 'Stream은 자료를 보관하는 재사용 목록이 아니라 한 번 소비하는 파이프라인이에요.',
    conceptWrongWhy: ['Stream 객체는 원본 List와 같은 재사용 가능한 컨테이너가 아니에요.', '최종 연산 뒤에도 같은 파이프라인을 여러 번 실행할 수 있다고 보장하지 않습니다.'],
    recall: { prompt: '예제에서 Stream을 소비해 다시 쓸 수 없게 만드는 최종 연산은 무엇인가요?', accepted: ['count()', 'count', 'count 연산'], hint: '원소 수를 구한 다음 대문자 목록을 만들기 전에 호출한 연산을 찾으세요.', explanation: '`count()`가 첫 Stream을 소비합니다. 그 뒤에는 같은 Stream을 재사용하지 않고 원본 목록에서 새 Stream을 만들어야 해요.' },
    application: { prompt: '먼저 `names.stream().count()`를 계산한 뒤 대문자 목록도 구하려면 어떤 방식이 맞나요?', correct: '원본 `names`에서 다시 `stream()`을 호출해 새 파이프라인을 만들어요.', correctWhy: '목록은 재사용할 수 있고 각 stream 파이프라인은 독립적으로 한 번씩 소비할 수 있습니다.', wrong: ['이미 count를 끝낸 같은 Stream 객체에 map을 이어서 실행해요.', 'count를 다시 계산하면 원본 names가 자동으로 대문자 목록이 돼요.'], wrongWhy: ['최종 연산이 끝난 Stream은 재사용할 수 없습니다.', 'count는 원본 목록을 변경하거나 새 목록을 만들지 않아요.'], hint: '재사용할 수 있는 원본 List와 한 번 소비하는 Stream을 구분하세요.' },
  },
  '스레드와 작업': {
    intro: '`start()`는 별도 플랫폼 스레드에서 작업을 실행하게 하고 `join()`은 main이 작업 종료를 기다리게 합니다. `run()`을 직접 호출하면 새 스레드를 시작하지 않아요. Java 21부터 가상 스레드 생성 API도 제공됩니다.',
    concept: '`worker.start()`가 `worker.run()`을 직접 호출하는 것과 다른 점은 무엇인가요?',
    conceptHint: '새 스레드의 실행을 시작하는 메서드와 Runnable 본문을 보통 메서드처럼 부르는 상황을 구분하세요.',
    conceptWrongWhy: ['모든 Java 코드가 동시에 실행되는 것은 아니며 각 스레드의 시작 지점이 필요해요.', 'Thread는 작업 결과를 저장하는 컨테이너가 아니라 실행 흐름을 제어합니다.'],
    recall: { prompt: 'main 스레드가 worker의 작업이 끝날 때까지 기다릴 때 호출하는 Thread 메서드는 무엇인가요?', accepted: ['join', 'join()', 'worker.join()', 'Thread.join', 'join 메서드'], hint: '예제에서 `start()` 다음에 worker에 호출하는 메서드예요.', explanation: '`join()`은 호출한 스레드가 대상 스레드의 종료를 기다리게 합니다. 기다리는 중 인터럽트되면 `InterruptedException`을 처리해야 해요.' },
    application: { prompt: '`worker.start()`를 `worker.run()`으로 바꾸면 작업은 어디서 실행되나요?', correct: '새 스레드는 시작되지 않고 현재 main 스레드가 run 본문을 동기적으로 실행해요.', correctWhy: 'run은 일반 메서드 호출이고 Thread의 별도 실행 흐름을 시작하는 동작은 start가 담당합니다.', wrong: ['가상 스레드로 자동 전환돼요.', '작업은 실행되지 않고 Thread 객체에 저장돼요.'], wrongWhy: ['가상 스레드는 명시적인 API 선택이며 run 호출이 자동 변환하지 않아요.', '직접 run을 호출하면 현재 호출 흐름에서 본문을 실행합니다.'], hint: '새 스레드를 만드는 호출이 `start`인지 `run`인지 확인하세요.' },
  },
  '가시성의 문제': {
    intro: '`stopped`는 volatile 필드라 worker의 반복문에서 main의 변경을 관찰할 수 있습니다. volatile은 가시성을 다루지만 `count++`처럼 여러 단계인 복합 연산을 원자적으로 만들지는 않아요.',
    concept: '`volatile boolean stopped`가 이 종료 신호에서 해결하는 문제는 무엇인가요?',
    conceptHint: 'main에서 쓴 최신 값을 worker가 읽도록 하는 메모리 가시성에 집중하세요.',
    conceptWrongWhy: ['volatile은 여러 읽기·계산·쓰기 단계 전체를 하나의 원자 연산으로 묶지 않아요.', 'volatile은 값의 암호화나 비밀 보호 기능이 아닙니다.'],
    recall: { prompt: 'volatile만으로 `count++` 같은 복합 갱신에 보장되지 않는 성질은 무엇인가요?', accepted: ['원자성', '원자성 보장', '원자적 처리'], hint: '한 번의 증가를 읽기·계산·쓰기 단계로 나누어 보면 알 수 있어요.', explanation: '`volatile`은 변수의 가시성과 순서 제약을 다루지만, 읽고 더하고 쓰는 여러 단계를 하나로 묶는 원자성은 보장하지 않습니다.' },
    application: { prompt: '공유 `int count`에 두 스레드가 `count++`를 수행합니다. 선언에 volatile만 붙이면 증가 횟수가 모두 보존되나요?', correct: '아니요. volatile은 가시성을 제공해도 `count++`의 읽기·계산·쓰기를 원자적으로 만들지 않아요.', correctWhy: '두 스레드의 복합 갱신이 서로 겹칠 수 있으므로 AtomicInteger나 적절한 synchronized가 필요합니다.', wrong: ['네. volatile은 모든 복합 연산을 자동으로 잠가요.', '아니요. volatile은 한 번 기록된 값을 다른 스레드에 숨깁니다.'], wrongWhy: ['volatile은 상호 배제 잠금이 아니며 증가 연산을 원자화하지 않습니다.', 'volatile의 목적은 변경 가시성이고 값을 숨기는 것이 아닙니다.'], hint: 'count++를 읽기, 1 더하기, 다시 쓰기의 단계로 나눠 생각하세요.' },
  },
  '원자적 카운터': {
    intro: '두 작업이 각각 1,000번 `incrementAndGet()`을 호출하고 모두 `join()`한 뒤 출력하므로 결과는 2,000이에요. AtomicInteger는 각 증가를 원자적으로 수행합니다.',
    concept: '각 스레드가 AtomicInteger를 1,000번 증가시키고 두 스레드가 끝난 뒤 읽을 때 기대하는 값은 무엇인가요?',
    conceptHint: '두 작업이 모두 완료된 다음 각 반복 횟수를 더하세요.',
    conceptWrongWhy: ['각각 1,000번이므로 한 스레드의 반복만 세는 것은 부족합니다.', '각 원자 증가가 한 번씩 반영되므로 1,000을 임의로 더하거나 빼지 않아요.'],
    recall: { prompt: '`AtomicInteger`의 현재 값을 원자적으로 1 증가시키고 새 값을 돌려주는 메서드 이름은 무엇인가요?', accepted: ['incrementAndGet', 'incrementAndGet()', 'incrementAndGet 메서드'], hint: '예제에서 반복문마다 count에 호출하는 메서드 이름을 찾으세요.', explanation: '`incrementAndGet()`은 증가와 새 값 반환을 원자적으로 수행합니다. “원자적 증가”만으로는 어떤 메서드인지 특정할 수 없어요.' },
    application: { prompt: '같은 구조에서 작업을 3개 만들고 각각 500번 증가시키면 종료 후 값은 얼마인가요?', correct: '1,500이에요. 원자 증가 500회를 세 작업이 각각 수행합니다.', correctWhy: '3 × 500번의 증가가 손실 없이 반영되며 출력은 모든 작업을 join한 뒤 이뤄집니다.', wrong: ['500이에요. AtomicInteger는 한 스레드의 횟수만 저장합니다.', '1,499예요. 마지막 증가를 항상 버립니다.'], wrongWhy: ['공유 인스턴스 하나에 세 작업이 모두 증가를 적용합니다.', 'incrementAndGet은 각 호출을 원자적으로 완료합니다.'], hint: '세 작업의 반복 횟수를 합하고 join 뒤 출력한다는 점을 확인하세요.' },
  },
  '동기화 범위': {
    intro: '두 작업이 같은 `LOCK`으로 `balance++` 구간을 보호합니다. 같은 잠금 객체를 사용하는 동안 한 번에 하나의 작업만 임계 구역에 들어가 최종값 2,000을 보존해요.',
    concept: '예제의 `synchronized (LOCK)`이 보호하는 공유 상태와 목적은 무엇인가요?',
    conceptHint: '두 스레드가 함께 바꾸는 balance를 같은 monitor 안에서 갱신합니다.',
    conceptWrongWhy: ['무조건 모든 메서드를 잠그면 필요 없는 코드까지 직렬화해 경쟁을 늘릴 수 있어요.', '동기화 없이 읽고 쓰면 증가의 일부가 겹쳐 사라질 수 있습니다.'],
    recall: { prompt: '두 스레드가 같은 임계 구역을 사용하도록 예제에서 공유하는 잠금 객체 이름은 무엇인가요?', accepted: ['LOCK', 'lock', 'LOCK 객체', '같은 LOCK'], hint: 'balance 갱신을 감싼 synchronized 괄호 안의 이름을 적으세요.', explanation: '모든 balance 갱신이 같은 LOCK monitor를 사용해야 서로 배타적으로 실행돼요.' },
    application: { prompt: '두 작업이 각각 서로 다른 잠금 객체를 synchronized 대상으로 사용하면 balance 증가를 서로 보호할 수 있나요?', correct: '아니요. 서로 다른 monitor는 서로를 막지 않으므로 같은 공유 상태의 갱신을 보호하지 못해요.', correctWhy: '상호 배제가 되려면 경쟁하는 모든 경로가 같은 잠금 객체를 사용해야 합니다.', wrong: ['네. synchronized 키워드는 잠금 대상과 관계없이 모든 스레드를 막아요.', '네. int 증가는 본래 원자적이어서 잠금이 필요 없어요.'], wrongWhy: ['동기화는 지정한 monitor 객체를 기준으로 경쟁합니다.', '일반적인 int 증가 연산은 원자적이지 않습니다.'], hint: '두 실행 경로가 같은 객체의 monitor를 획득하는지 확인하세요.' },
  },
  '완료 신호 테스트': {
    intro: 'worker가 작업 완료 지점에서 `countDown()`을 호출하고 main은 `await()`으로 0이 될 때까지 기다립니다. 고정 시간만큼 쉬는 방식보다 완료 조건을 직접 기다려 흔들림을 줄여요.',
    concept: '`finished.await()`가 반환되기 전에 무엇이 보장되어야 하나요?',
    conceptHint: 'CountDownLatch의 카운트가 0이 되는 신호를 기다리는지 확인하세요.',
    conceptWrongWhy: ['고정된 sleep은 작업 완료와 연결된 신호가 아니어서 느린 환경에서 충분하지 않을 수 있어요.', '테스트 실행 순서는 스레드 완료를 보장하는 동기화 수단이 아닙니다.'],
    recall: { prompt: '예제에서 worker가 완료 신호를 보내는 `CountDownLatch` 메서드 이름은 무엇인가요?', accepted: ['countDown', 'countDown()', 'finished.countDown()', 'countDown() 메서드'], hint: 'worker가 실행할 때 메서드 참조로 전달한 호출을 확인하세요.', explanation: '`countDown()`은 latch 카운트를 1 줄입니다. 0이 되면 `await()` 중인 스레드가 대기를 마칠 수 있어요.' },
    application: { prompt: '작업이 100ms 안에 끝난다고 가정해 `Thread.sleep(100)`으로 대체하면 테스트가 안정적으로 완료를 기다릴 수 있나요?', correct: '아니요. 스케줄링이나 환경 지연으로 100ms 뒤에도 끝나지 않을 수 있으므로 완료 latch를 기다려야 해요.', correctWhy: '시간 경과와 작업 완료는 같은 조건이 아니며 실제 완료 신호를 기다리는 편이 결정적입니다.', wrong: ['네. sleep은 모든 운영체제에서 정확히 100ms 뒤 작업을 끝냅니다.', '네. sleep은 worker의 예외와 무관하게 성공을 보장합니다.'], wrongWhy: ['스레드 스케줄링과 실행시간은 고정되지 않습니다.', 'sleep은 종료나 예외를 관찰하지 않고 현재 스레드만 대기시킵니다.'], hint: '기다리는 기준이 시간의 경과인지 작업의 완료인지 구분하세요.' },
  },
  '힙과 스택 개념': {
    intro: '`course` 지역 변수로 객체를 참조하고 `completed` 지역 값과 함께 제목을 출력합니다. 힙과 스택 설명은 이해를 위한 JVM 개념 모델이며 최적화와 구현에 따라 실제 배치는 달라질 수 있어요.',
    concept: '일반적인 JVM 설명 모델에서 main 메서드의 지역 변수와 호출 상태는 어디에 연결해 설명하나요?',
    conceptHint: 'Course 객체가 아니라 main 메서드가 실행될 때 사용하는 호출 프레임의 위치를 떠올리세요.',
    conceptWrongWhy: ['모든 값이 힙에만 저장된다고 단정할 수 없어요. 지역 변수와 호출 프레임의 모델도 고려해야 합니다.', '스택은 파일 저장 공간이 아니라 메서드 호출 프레임을 설명하는 런타임 개념입니다.'],
    recall: { prompt: '예제의 지역 변수 `course`는 Course 객체 자체 대신 무엇을 가리키나요?', accepted: ['참조', '객체 참조', 'Course 객체 참조', 'reference'], hint: '지역 변수에 객체의 모든 필드가 복사되는지, 객체를 가리키는 값이 저장되는지 구분하세요.', explanation: '`course`는 Course 인스턴스를 가리키는 참조를 담습니다. 개념 모델에서는 지역 변수와 호출 프레임을 스택에 연결해 설명하지만 실제 최적화는 JVM 구현에 따라 달라질 수 있어요.' },
    application: { prompt: 'Course 객체의 제목이 항상 힙에 별도 객체로 실재하고 최적화될 수 없다고 말해도 되나요?', correct: '아니요. 힙·스택은 개념 모델이며 JIT의 escape analysis 같은 최적화가 실제 할당을 제거하거나 바꿀 수 있어요.', correctWhy: 'Java 명세는 이 예제의 지역 변수와 객체가 특정 물리 메모리 위치에 항상 배치된다고 보장하지 않습니다.', wrong: ['네. new를 쓴 모든 객체는 어떤 최적화에서도 반드시 힙 할당을 유지합니다.', '아니요. 지역 변수는 언제나 디스크에 저장됩니다.'], wrongWhy: ['런타임 구현은 관찰 가능한 동작을 보존하면서 할당을 최적화할 수 있어요.', '지역 변수와 호출 프레임은 디스크 저장과 관계가 없습니다.'], hint: '소스 코드의 객체 생성 표현과 JVM이 실제로 수행하는 최적화를 구분하세요.' },
  },
  '할당 관찰': {
    intro: '반복문은 Point 객체 세 개를 리스트에 추가하고 `size()`로 원소 수를 출력합니다. 이 값은 객체 수를 세는 실습 결과이지 바이트 단위 할당량이나 성능 측정치는 아니에요.',
    concept: '반복문이 0부터 2까지 돌며 매번 Point를 추가한 뒤 출력하는 `points.size()`는 얼마인가요?',
    conceptHint: '0, 1, 2의 세 인덱스에서 각각 한 객체를 추가합니다.',
    conceptWrongWhy: ['size는 한 번의 반복 횟수만 반환하지 않고 현재 목록의 모든 원소 수를 돌려줘요.', '이 반복문은 인덱스 0, 1, 2에서 각각 실행되므로 두 개보다 많습니다.'],
    recall: { prompt: '예제의 `points.size()`가 직접 알려 주는 값은 무엇인가요?', accepted: ['목록의 원소 수', '리스트 원소 수'], hint: '이 출력은 `points.size()`의 결과이며 메모리 크기를 측정한 값은 아니에요.', explanation: '`points.size()`는 현재 목록에 든 원소 수를 알려 줍니다. 이 예제에서 원소가 Point이더라도 실제 메모리 할당량이나 전체 객체 수를 측정하는 값은 아니에요.' },
    application: { prompt: '반복 조건을 `index < 5`로 바꾸면 `points.size()`는 무엇이 되나요?', correct: '5예요. 인덱스 0부터 4까지 다섯 개를 추가합니다.', correctWhy: '한 반복마다 한 Point를 추가하므로 반복이 다섯 번이면 목록 크기도 5입니다.', wrong: ['4예요. 마지막 인덱스가 4이므로 네 번 반복합니다.', '10이에요. 각 Point는 x와 y 필드를 가지므로 목록에 두 번 들어갑니다.'], wrongWhy: ['0, 1, 2, 3, 4의 다섯 인덱스가 실행됩니다.', 'Point 하나를 만들어 목록에 한 번 추가하므로 필드 수가 목록 크기를 늘리지 않아요.'], hint: '0 이상 5 미만의 정수를 직접 나열해 반복 횟수를 세세요.' },
  },
  '워밍업의 의미': {
    intro: '같은 계산 경로를 반복 실행하면 JVM이 실행 특성을 관찰하고 최적화할 기회를 얻습니다. 이 예제의 checksum은 출력용일 뿐, 반복 횟수만으로 JIT 결정이나 성능 향상을 보장하지 않아요.',
    concept: '벤치마크에서 측정 전에 같은 경로를 반복하는 워밍업의 주된 이유는 무엇인가요?',
    conceptHint: '초기 실행과 충분히 반복된 실행의 JVM 상태가 달라질 수 있습니다.',
    conceptWrongWhy: ['첫 실행은 클래스 로딩과 초기화 등의 비용을 포함할 수 있어 대표 실행과 다를 수 있어요.', '워밍업은 결과를 조작하는 절차가 아니라 측정 조건을 안정화하려는 과정입니다.'],
    recall: { prompt: '워밍업은 특정 JIT 최적화나 성능 향상을 보장하나요?', accepted: ['아니요', '아니오', '보장되지 않는다', '보장하지 않는다', '항상 보장되는 것은 아니다'], hint: '워밍업은 JVM에 최적화 기회를 주지만 최종 결정은 런타임과 실행 조건에 달려 있어요.', explanation: '워밍업은 초기 실행 영향을 줄이는 데 도움이 되지만 특정 최적화나 성능 향상을 보장하지 않습니다.' },
    application: { prompt: '첫 호출 시간 하나만 재서 메서드 성능을 확정해도 되나요?', correct: '아니요. 워밍업과 여러 측정 반복, 대표 입력을 포함하고 신뢰할 수 있는 벤치마크 방법을 사용해야 해요.', correctWhy: '단일 샘플은 클래스 초기화, JIT, 스케줄링 등 영향을 분리하지 못합니다.', wrong: ['네. 첫 호출은 항상 충분히 최적화된 상태입니다.', '네. 한 번 측정하면 입력 크기와 부하가 달라도 같은 성능입니다.'], wrongWhy: ['초기 호출은 런타임 준비 전이라 이후 실행과 다를 수 있어요.', '입력과 실행 환경은 결과에 영향을 주므로 대표 조건을 여러 번 관찰해야 합니다.'], hint: '초기 실행 하나가 반복 실행과 대표 workload를 대신할 수 있는지 확인하세요.' },
  },
  '프로파일링 질문': {
    intro: '예제의 `nanoTime()`은 이 한 번의 작업에 걸린 경과 시간을 재지만 병목 위치를 알려 주지는 않습니다. 실제 최적화 전에는 대표 workload를 실행하며 CPU·할당 프로파일러로 뜨거운 경로를 확인해요.',
    concept: '한 번의 `System.nanoTime()` 측정만으로 느린 원인을 찾을 수 없는 이유는 무엇인가요?',
    conceptHint: '경과 시간 하나는 비용이 어디에 쓰였는지 분해해 보여 주지 않습니다.',
    conceptWrongWhy: ['메서드 길이는 실행 빈도와 입력 크기, 대기 시간을 나타내지 않아요.', '측정은 코드를 자동으로 수정하거나 병목 원인을 알려 주는 마법 기능이 아닙니다.'],
    recall: { prompt: '실제 실행에서 시간이나 할당을 많이 차지하는 코드 경로를 관찰하는 도구를 무엇이라고 하나요?', accepted: ['프로파일러', '프로파일링 도구', 'profiler', '프로파일링'], hint: '코드 길이가 아니라 대표 실행의 비용을 관찰하는 도구예요.', explanation: '프로파일러는 대표 workload의 CPU 시간, 할당 등 비용을 관찰해 병목 후보를 찾는 근거를 줍니다.' },
    application: { prompt: '응답이 느린 원인을 조사합니다. 코드에서 가장 긴 메서드를 먼저 고치면 충분한가요?', correct: '아니요. 대표 트래픽이나 입력으로 프로파일링해 실제 CPU·할당 비용이 집중되는 경로를 먼저 확인해야 해요.', correctWhy: '긴 메서드가 호출되지 않거나 비용이 작을 수 있고, 짧은 코드가 반복 호출되어 병목일 수 있습니다.', wrong: ['네. 글자 수가 가장 많은 메서드가 항상 가장 느립니다.', '아니요. 전체 요청을 재현하지 말고 임의로 sleep을 넣으면 원인이 확정됩니다.'], wrongWhy: ['소스 길이와 실제 실행 비용은 같은 지표가 아닙니다.', 'sleep은 병목의 위치나 비용을 프로파일링하지 않아요.'], hint: '코드 모양에 대한 추측과 대표 실행에서 얻은 비용 근거를 구분하세요.' },
  },
  '측정 결과 해석': {
    intro: '1부터 20ms까지 정렬된 표본에서 최근접 순위법의 p95 순위는 `ceil(0.95 × 20) = 19`라 결과는 19ms입니다. 서비스 도구는 다른 percentile 계산법을 쓸 수 있으므로 산출 설정도 확인해야 해요.',
    concept: '1ms부터 20ms까지 정렬된 20개 표본에 최근접 순위법을 적용하면 p95 값은 얼마인가요?',
    conceptHint: '먼저 `ceil(0.95 × 표본 수)`로 1부터 세는 순위를 구하세요.',
    conceptWrongWhy: ['평균은 전체 합을 표본 수로 나눈 값이라 p95와 다른 통계입니다.', '이 예제는 20개를 정렬하고 19번째 값을 사용하므로 최대값을 택하지 않아요.'],
    recall: { prompt: '20개 표본에서 최근접 순위법으로 p95를 구할 때 오름차순 몇 번째 값을 고르나요?', accepted: ['19번째', '19번째 값', '열아홉 번째', '열아홉 번째 값'], hint: '`ceil(0.95 × 20)`을 계산해 1부터 세는 순위를 구하세요.', explanation: '`ceil(0.95 × 20) = 19`이므로 오름차순으로 정렬한 19번째 값을 선택합니다. 예제에서는 그 값이 19ms입니다.' },
    application: { prompt: '표본에 100ms가 하나 추가되어 총 21개가 되면 같은 규칙의 p95는 얼마인가요?', correct: '20ms예요. ceil(0.95 × 21) = 20이므로 정렬된 20번째 값입니다.', correctWhy: '21개 값에서 20번째 값은 기존 20ms이고 가장 느린 100ms 값은 21번째입니다.', wrong: ['100ms예요. p95는 항상 가장 큰 관측값을 선택합니다.', '19ms예요. 표본 수가 변해도 순위는 항상 19입니다.'], wrongWhy: ['최댓값은 21번째 값이고 p95의 nearest-rank 순위는 20입니다.', '순위는 표본 수에 따라 다시 계산하므로 21개에서는 20번째입니다.'], hint: '먼저 21개 표본의 rank를 계산하고 정렬된 값에서 해당 위치를 선택하세요.' },
  },
};

const focusedJavaWeeksThirteenToFifteenNotes = {
  'Path 만들기': {
    intro: '`Path.of("data")`로 디렉터리 경로를 만들고 `resolve("courses.txt")`로 파일 이름을 붙입니다. 이 코드는 경로를 만들 뿐 실제 파일을 생성하지 않아요.',
    concept: { prompt: '`data` 아래 `courses.txt`를 경로로 붙이고 싶습니다. 운영체제별 구분자를 직접 조립하지 않는 방법은 무엇인가요?', hint: 'Path 객체의 한 경로 요소를 다른 Path에 붙이는 메서드를 찾으세요.' },
    recall: { prompt: '예제에서 `courseFile.getFileName()`이 돌려주는 파일 이름은 무엇인가요?', accepted: ['courses.txt', '파일 이름은 courses.txt', 'courses.txt 파일 이름'], hint: '상위 경로가 아니라 마지막 경로 요소를 답하세요.', explanation: '마지막 경로 요소는 `courses.txt`입니다. Path를 만든 것만으로 실제 파일이 생성되지는 않아요.' },
    application: { prompt: '`data` 아래 `archive` 폴더를 거쳐 `courses.txt`를 붙이려면 어떻게 연결하나요?', correct: '`data.resolve("archive").resolve("courses.txt")`처럼 Path 요소를 차례로 연결해요.', correctWhy: 'resolve를 이어 쓰면 운영체제에 맞는 구분자 처리를 Path API가 담당합니다.', wrong: ['`"data/archive/courses.txt"` 문자열을 모든 운영체제에서 직접 조립해요.', '첫 resolve 호출이 경로와 같은 이름의 파일을 자동으로 만들어 줘요.'], wrongWhy: ['경로 구분자를 직접 가정하지 않는 편이 이식성이 좋습니다.', 'Path.resolve는 경로 값을 조합할 뿐 파일 시스템을 변경하지 않아요.'], hint: '각 하위 경로 요소를 resolve로 하나씩 붙이세요.' },
  },
  '문자 인코딩': {
    intro: '파일에 `첫 강의`를 쓸 때 UTF-8을 지정하고 같은 Charset으로 다시 읽습니다. 기록과 읽기의 문자 인코딩 가정이 달라지면 글자가 깨질 수 있어요.',
    concept: { prompt: '파일을 UTF-8로 기록한 뒤 여러 환경에서 같은 한글을 읽으려면 읽기에도 무엇을 명시해야 하나요?', hint: '바이트를 문자로 해석하는 규칙을 쓰기와 읽기에서 맞추세요.' },
    recall: { prompt: 'TextEncodingExample이 출력하는 한글 문구는 무엇인가요?', accepted: ['첫 강의', '출력은 첫 강의'], hint: 'UTF-8로 쓴 뒤 같은 인코딩으로 읽은 문자열을 공백까지 확인하세요.', explanation: '읽은 문자열은 `첫 강의`입니다. 가운데 공백도 출력 결과에 포함돼요. 같은 Charset을 쓰므로 이 예제의 바이트가 같은 문자로 해석됩니다.' },
    application: { prompt: 'UTF-8로 쓴 파일을 다른 Charset으로 읽으면 어떤 문제가 생길 수 있나요?', correct: '같은 바이트가 다른 문자로 해석되어 한글이 깨질 수 있어요.', correctWhy: '문자 인코딩은 바이트와 문자의 대응 규칙이므로 읽기와 쓰기에서 일치해야 합니다.', wrong: ['JVM이 원래 문자를 자동으로 알아내 항상 복원해요.', 'Charset은 파일 내용이 아니라 경로 구분자만 바꿔요.'], wrongWhy: ['바이트만으로 원래 의도한 문자 인코딩을 항상 추론할 수 없습니다.', 'Charset은 바이트를 문자로 변환하는 규칙입니다.'], hint: '같은 바이트열을 서로 다른 문자 표로 읽는 상황을 생각하세요.' },
  },
  '파일 읽기': {
    intro: '임시 파일에 `Java`를 기록하고 `Files.readString`으로 읽어 `read=Java`를 출력합니다. 파일 없음이나 권한 문제는 정상 반환값이 아니라 입출력 예외로 다뤄야 해요.',
    concept: { prompt: '`Files.readString(path, UTF_8)`을 호출했는데 파일이 없으면 어떤 결과를 예상해야 하나요?', hint: '없는 파일을 빈 파일처럼 읽을 수 있는지, 입출력 실패를 예외로 알리는지 확인하세요.' },
    recall: { prompt: '예제에서 파일을 읽은 뒤 콘솔에 출력되는 한 줄을 그대로 적으세요.', accepted: ['read=Java'], hint: '읽은 문자열을 `read=` 뒤에 붙입니다. 사이에 공백을 더하지 않아요.', explanation: '파일 내용은 `Java`이므로 실제 출력은 `read=Java`입니다. `read = Java`는 공백이 추가되어 다른 문자열이에요.' },
    application: { prompt: '파일이 삭제됐거나 읽기 권한이 없다면 호출자는 어떻게 처리해야 하나요?', correct: '`IOException` 계열 실패를 호출 규약에 맞게 처리하거나 상위 호출자에게 전달해요.', correctWhy: '파일 입출력은 경로·권한·동시 변경 때문에 실패할 수 있어요.', wrong: ['실패를 빈 문자열로 바꿔 성공처럼 반환해요.', '파일이 없으면 `readString`이 null을 반환한다고 가정해요.'], wrongWhy: ['실패를 성공 데이터와 섞으면 호출자가 오류를 알아차리지 못합니다.', '파일 읽기 API는 없는 파일을 null로 표현하지 않습니다.'], hint: '정상적으로 읽은 빈 파일과 읽기 실패를 구분하세요.' },
  },
  '파일 쓰기': {
    intro: '`Files.writeString`은 주어진 경로에 문자열을 기록하고 경로를 돌려줍니다. 기본 옵션을 쓰면 기존 파일 내용을 바꿀 수 있어요.',
    concept: { prompt: '이미 `Old`가 들어 있는 파일에 기본 `Files.writeString(path, "New")`를 호출하면 내용은 어떻게 되나요?', hint: '기본 옵션이 기존 내용을 덧붙이는지, 지우고 새로 쓰는지 확인하세요.' },
    recall: { prompt: '예제의 `writeCourse(file, "Java NIO")` 뒤 파일을 읽으면 어떤 문자열이 나오나요?', accepted: ['Java NIO', '파일 내용은 Java NIO', 'Java NIO가 출력됩니다'], hint: '기록한 text 값이 파일 내용이 됩니다.', explanation: '기록한 문자열은 `Java NIO`이고 예제는 같은 파일을 다시 읽어 출력합니다.' },
    application: { prompt: '기존 내용을 보존하면서 뒤에 새 문자열을 덧붙이려면 기본 호출만으로 충분한가요?', correct: '아니요. `StandardOpenOption.APPEND` 같은 추가 기록 옵션을 지정해야 해요.', correctWhy: '기본 `writeString` 호출은 기존 파일을 덮어쓰도록 동작합니다.', wrong: ['네. `Files.writeString`은 항상 기존 내용 뒤에 이어 씁니다.', '네. 경로를 Path로 전달하면 파일 내용이 자동으로 보존됩니다.'], wrongWhy: ['추가 기록은 `APPEND` 옵션을 명시해야 합니다.', 'Path는 위치를 표현하며 기록 정책은 파일 쓰기 옵션이 정합니다.'], hint: '기본 기록 옵션과 APPEND 옵션을 구분하세요.' },
  },
  '존재 여부와 오류': {
    intro: '파일이 존재하는지 확인한 직후 다른 작업이 파일을 지우는 상황을 재현합니다. 확인 당시의 상태가 실제 읽기까지 보장되지는 않으므로 읽기 예외도 처리해야 해요.',
    concept: { prompt: '예제는 `exists`가 true를 돌려준 다음 파일을 삭제합니다. 마지막에 어떤 줄을 출력하나요?', hint: '파일 삭제 뒤 `readString`이 성공하는지 보고 catch의 출력도 확인하세요.' },
    recall: { prompt: '파일이 있는지 확인한 뒤 실제로 읽기 전에 파일이 사라질 수 있습니다. 이 상황을 한국어로 설명하세요.', accepted: ['파일을 확인한 뒤 읽기 전에 사라질 수 있음', '파일 확인과 사용 사이에 상태가 바뀜', '검사 후 실제 읽기 전에 파일 상태가 바뀌는 문제', 'TOCTOU 경쟁 조건'], hint: '확인한 시점과 실제로 읽는 시점 사이에 무슨 변화가 생길 수 있는지 생각하세요.', explanation: '파일 확인 직후 다른 작업이 파일을 지울 수 있어요. 확인과 사용 사이의 이런 상태 변화를 TOCTOU 경쟁 조건이라고 부르며, 실제 읽기에서 `NoSuchFileException` 같은 예외도 처리해야 합니다.' },
    application: { prompt: '파일 사용 전에 `exists`를 검사하는 것으로 읽기 실패 처리가 끝났다고 볼 수 있나요?', correct: '아니요. 검사와 읽기 사이에 파일 상태가 바뀔 수 있으므로 실제 읽기의 예외도 처리해야 해요.', correctWhy: '존재 확인과 파일 읽기는 서로 다른 시점의 작업입니다.', wrong: ['네. `exists`가 true면 이후 파일 작업은 반드시 성공해요.', '네. 검사에 성공한 경로는 다른 프로세스가 삭제할 수 없어요.'], wrongWhy: ['다른 작업이 검사 직후 파일을 지울 수 있습니다.', 'exists는 잠금이나 파일 보존 기능이 아닙니다.'], hint: '검사 직후 다른 프로세스가 파일을 바꿀 가능성을 고려하세요.' },
  },
  LocalDate: {
    intro: '`LocalDate`로 마감일을 표현하고 `plusDays(1)`로 다음 날짜를 계산합니다. 이 날짜 값에는 시각이나 시간대가 들어 있지 않아요.',
    concept: { prompt: '시각이 필요 없는 생일이나 마감일을 표현할 때 맞는 타입은 무엇인가요?', hint: '년·월·일만 필요한지, 특정 순간이나 시각까지 필요한지 구분하세요.' },
    recall: { prompt: '`2026-10-11`에서 하루 뒤를 계산한 결과를 적으세요.', accepted: ['2026-10-12', '2026년 10월 12일', '다음 날은 2026-10-12'], hint: '예제는 `plusDays(1)`을 호출합니다.', explanation: '하루 뒤 날짜는 `2026-10-12`입니다. 원래 `due` 값은 바뀌지 않고 계산 결과가 새 값으로 반환돼요.' },
    application: { prompt: '마감일 `2026-10-11`에서 `plusDays(3)`을 호출하면 어떤 날짜가 되나요?', correct: '`2026-10-14`가 됩니다.', correctWhy: 'plusDays는 달력 날짜에 지정한 일수를 더한 새 LocalDate를 돌려줍니다.', wrong: ['`2026-10-13`이 됩니다. 시작 날짜를 세 번 포함해 하루를 빼야 해요.', '원래 값 `2026-10-11`이 바뀌지 않으므로 결과도 그대로예요.'], wrongWhy: ['3일 뒤는 10월 14일입니다.', 'LocalDate는 불변이지만 계산 결과로 새 값을 반환합니다.'], hint: '10월 11일 다음 날부터 날짜를 세 번 더하세요.' },
  },
  LocalDateTime: {
    intro: '`LocalDateTime`은 `2026-10-11T09:00` 같은 날짜와 시각을 담지만 지역 시간대는 포함하지 않습니다. 이를 실제 순간으로 해석하려면 시간대 정보가 더 필요해요.',
    concept: { prompt: '`2026-10-11T09:00`이라는 값만으로 회의가 세계 어디서나 같은 순간인지 알 수 있나요?', hint: '지역의 시계 시각과 전 세계 타임라인의 순간을 구분하세요.' },
    recall: { prompt: '예제에서 콘솔에 출력되는 LocalDateTime 문자열을 그대로 적으세요.', accepted: ['2026-10-11T09:00'], hint: '날짜와 시각 사이에 들어가는 문자까지 확인하세요.', explanation: '실제 출력은 `2026-10-11T09:00`이며 시간대 정보는 포함하지 않습니다. 한국어 날짜로 바꾸어 쓰면 같은 화면 출력 문자열이 아닙니다.' },
    application: { prompt: '이 LocalDateTime을 한 시점으로 바꾸려면 어떤 정보가 더 필요한가요?', correct: '회의가 열리는 지역의 `ZoneId`가 필요합니다.', correctWhy: '같은 오전 9시도 지역 시간대에 따라 서로 다른 순간을 가리킵니다.', wrong: ['시간대는 필요 없고 날짜 문자열 뒤에 Z만 붙이면 됩니다.', '호스트 컴퓨터의 기본 시간대를 항상 사용하면 됩니다.'], wrongWhy: ['Z를 붙이는 것은 UTC 시각이라고 단정하는 것이어서 입력 의미를 바꿉니다.', '기본 시간대는 환경마다 달라 데이터의 의미를 흔들 수 있습니다.'], hint: '값에 포함되지 않은 지역 시간대 규칙을 명시하세요.' },
  },
  Instant: {
    intro: '`Instant`는 `2026-10-11T00:00:00Z`처럼 UTC 기준의 순간을 표현합니다. 지역 시간대를 바꿔 표시해도 타임라인의 같은 순간을 가리킬 수 있어요.',
    concept: { prompt: '서로 다른 지역의 이벤트 시각이 같은 순간인지 비교할 때 기준으로 쓸 타입은 무엇인가요?', hint: '달력의 벽시각이 아니라 타임라인에서 한 지점을 나타내는 타입을 고르세요.' },
    recall: { prompt: 'InstantExample이 콘솔에 출력하는 UTC 문자열을 그대로 적으세요.', accepted: ['2026-10-11T00:00:00Z'], hint: '문자열 끝의 `Z`까지 확인하세요.', explanation: '실제 출력은 `2026-10-11T00:00:00Z`이며 타임라인의 한 순간입니다. 한국어 날짜 표기는 같은 출력 문자열이 아닙니다.' },
    application: { prompt: '서울의 `2026-10-11 09:00`과 UTC의 `2026-10-11 00:00`은 같은 순간인가요?', correct: '네. 서울은 그 날짜에 UTC보다 9시간 빠르므로 같은 순간입니다.', correctWhy: '두 표기는 시간대가 다르지만 Instant로 바꾸면 같은 타임라인 값이 됩니다.', wrong: ['아니요. 시각 숫자가 다르면 언제나 다른 순간입니다.', '아니요. Instant는 UTC 외의 지역 시각과 비교할 수 없습니다.'], wrongWhy: ['지역 시각을 비교하려면 각자의 시간대 오프셋을 고려해야 합니다.', 'Instant는 시간대별 지역 시각을 공통 타임라인의 순간으로 비교합니다.'], hint: '서울 시각에서 9시간을 빼 UTC 시각으로 맞추세요.' },
  },
  ZoneId: {
    intro: '`ZoneId`는 지역 시간대 규칙을 적용해 날짜·시각을 실제 순간으로 바꿔요. 서머타임 전환 때 존재하지 않는 시각은 그 간격만큼 앞으로 옮기고, 두 번 나타나는 시각은 기본적으로 전환 전 시간대를 선택합니다. 예약에 다른 기준이 필요하면 규칙을 직접 정해야 합니다.',
    concept: { prompt: '`2026-10-11 09:00` 서울 시각을 Instant로 바꾸면 어떤 값이 되나요?', hint: '서울 시각은 이 날짜에 UTC보다 9시간 빠릅니다.' },
    recall: { prompt: '예제의 서울 오전 9시를 변환한 Instant 값을 적으세요.', accepted: ['2026-10-11T00:00:00Z', '출력은 2026-10-11T00:00:00Z', 'UTC 자정'], hint: '서울 시각에서 9시간을 빼면 UTC 시각입니다.', explanation: '`2026-10-11 09:00` Asia/Seoul은 `2026-10-11T00:00:00Z`와 같은 순간입니다.' },
    application: { prompt: '일정이 `America/New_York` 지역 규칙을 따라야 할 때 연중 고정된 `-05:00`만 저장하면 충분한가요?', correct: '아니요. `ZoneId`는 서머타임처럼 날짜에 따라 달라지는 지역 규칙도 반영합니다.', correctWhy: '지역 시간대의 오프셋은 날짜에 따라 바뀔 수 있어요.', wrong: ['네. 뉴욕은 일 년 내내 -05:00을 사용합니다.', '네. LocalDateTime만 있으면 모든 지역에서 순간이 하나로 정해집니다.'], wrongWhy: ['뉴욕은 계절에 따라 UTC 오프셋이 바뀝니다.', 'LocalDateTime에는 지역 정보가 없습니다.'], hint: '고정 오프셋과 지역의 날짜별 시간 규칙을 구분하세요.' },
  },
  '시간 계산': {
    intro: '오늘 날짜에서 마감일을 계산하고 `ChronoUnit.DAYS.between`으로 남은 일수를 셉니다. `LocalDate`는 불변이라 계산한 날짜를 새 변수에 받아요.',
    concept: { prompt: '`today.plusDays(1)`의 결과를 `due`에 저장하면 원래 `today` 값은 어떻게 되나요?', hint: 'java.time 객체는 계산할 때 기존 값을 수정하는지 새 값을 돌려주는지 확인하세요.' },
    recall: { prompt: '예제의 출력에서 마감일까지 남은 일수와 날짜를 적으세요.', accepted: ['due=2026-10-12, days=1', '마감일 2026-10-12, 하루 남음', '2026-10-12에 하루 남음'], hint: 'today는 10월 11일이고 due는 하루 뒤입니다.', explanation: '마감일은 `2026-10-12`이고 두 날짜 사이에는 하루가 있습니다.' },
    application: { prompt: 'today가 `2026-10-11`일 때 `plusDays(3)`으로 due를 만들면 due와 남은 일수는 얼마인가요?', correct: 'due는 `2026-10-14`이고 남은 일수는 3일입니다.', correctWhy: '3일 뒤 날짜를 만든 다음 DAYS.between으로 날짜 차이를 계산합니다.', wrong: ['due는 `2026-10-13`이고 남은 일수는 2일입니다.', 'LocalDate가 바뀌지 않으므로 due도 `2026-10-11`입니다.'], wrongWhy: ['10월 11일에서 3일 뒤는 10월 14일입니다.', 'plusDays는 원래 값을 유지하고 새 LocalDate를 돌려줍니다.'], hint: '새 날짜를 먼저 계산하고 두 날짜의 일수 차이를 세세요.' },
  },
  '문자열 파싱': {
    intro: '`Integer.parseInt`로 `"45"`는 정수로 바꾸고 `"forty"`는 `NumberFormatException`으로 거부합니다. 외부 입력은 변환 실패 가능성을 고려해야 해요.',
    concept: { prompt: '`Integer.parseInt("forty")`를 실행하면 어떤 일이 일어나나요?', hint: '숫자 형식이 아닌 문자열을 0으로 보정하는지, 변환 오류로 알리는지 확인하세요.' },
    recall: { prompt: '첫 입력 `"45"`를 파싱했을 때 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['minutes=45'], hint: '정수 45를 `minutes=` 뒤에 이어 붙입니다.', explanation: '숫자 문자열 `"45"`가 정수 45로 변환되어 실제로 `minutes=45`를 출력합니다.' },
    application: { prompt: '`Integer.parseInt("45.5")`처럼 소수점이 있는 문자열도 정수로 자동 반올림되나요?', correct: '아니요. 이 형식은 정수가 아니므로 NumberFormatException이 발생합니다.', correctWhy: 'parseInt는 정수 형식의 문자열만 받아들이며 반올림하지 않습니다.', wrong: ['네. 소수 부분을 자동으로 반올림해 46을 반환합니다.', '네. 소수 부분을 버리고 45를 반환합니다.'], wrongWhy: ['정수 파싱 API는 소수 입력을 반올림하지 않습니다.', '소수점 문자열을 정수 부분만 잘라 처리하지 않습니다.'], hint: '입력 문자열이 정수 문법을 만족하는지 확인하세요.' },
  },
  'null 경계': {
    intro: '`Objects.requireNonNull(title, "제목이 필요합니다")`은 필수 제목이 null인지 경계에서 확인합니다. 잘못된 입력을 뒤쪽 코드에서 모호한 오류로 만드는 대신 명확한 한국어 메시지로 거부해요.',
    concept: { prompt: '필수 제목이 null일 때 `Objects.requireNonNull`은 어떻게 동작하나요?', hint: 'null을 빈 문자열로 바꾸는지, 지정한 메시지로 실패를 분명히 하는지 확인하세요.' },
    recall: { prompt: '`requiredTitle(null)`이 예외와 함께 출력하는 메시지를 그대로 적으세요.', accepted: ['제목이 필요합니다'], hint: 'requireNonNull 호출의 두 번째 인자를 확인하세요.', explanation: '인자가 null이면 NullPointerException이 나며 한국어 메시지 `제목이 필요합니다`를 출력합니다.' },
    application: { prompt: 'title이 필수값인데 호출자가 null을 전달했다면 어떤 경계 처리가 알맞나요?', correct: '입력 경계에서 null을 거부하고 필요한 값을 설명하는 오류를 돌려줍니다.', correctWhy: '필수 여부를 처음 확인할 수 있는 지점에서 실패 원인을 분명히 합니다.', wrong: ['null을 아무 설명 없이 빈 문자열로 바꿔 저장합니다.', '뒤에서 NullPointerException이 날 때까지 검사하지 않습니다.'], wrongWhy: ['빈 문자열은 null과 다른 값이므로 임의로 바꾸면 계약이 달라집니다.', '늦게 실패하면 원래 잘못된 입력 위치를 찾기 어려워요.'], hint: '필수값 여부를 가장 먼저 확인할 수 있는 API 경계를 찾으세요.' },
  },
  '입력 검증': {
    intro: '`requirePositiveMinutes`는 0 이하의 시간을 `IllegalArgumentException`으로 거부하고 양수만 반환합니다. 예제는 양수 성공 결과와 0 입력의 실패 경계를 함께 보여 줍니다.',
    concept: { prompt: '`requirePositiveMinutes(0)`을 호출하면 어떤 결과가 나오나요?', hint: '코드가 0 이하를 검사한 뒤 예외를 던지는지 확인하세요.' },
    recall: { prompt: '예제에서 `requirePositiveMinutes(30)`을 호출했을 때 콘솔에 출력되는 값은 무엇인가요?', accepted: ['30', '30을 출력'], hint: '양수 입력은 예외 없이 그대로 반환되고 그 값을 출력해요.', explanation: '30은 양수이므로 입력값을 그대로 반환하고, 예제에서 `30`을 출력합니다.' },
    application: { prompt: '예약 시간으로 `-5`를 받으면 어떤 처리가 맞나요?', correct: '입력 규칙을 어겼으므로 IllegalArgumentException으로 거부합니다.', correctWhy: '음수는 양수 분이라는 메서드 계약을 만족하지 않습니다.', wrong: ['절댓값 5로 자동 변환해 저장합니다.', '잘못된 값이어도 그대로 정상 반환합니다.'], wrongWhy: ['자동 보정은 명시된 계약에 없고 사용자의 입력 의미를 바꿉니다.', '음수는 양수 입력 조건을 통과하지 못합니다.'], hint: '계약을 만족하지 않는 값을 조용히 보정하지 말고 명시적으로 처리하세요.' },
  },
  'DTO의 역할': {
    intro: '`CourseRequest` record는 강의 제목과 수업 시간을 한 값으로 묶어 다른 계층에 전달합니다. 화면에 보이는 기본 문자열은 JSON 응답과 다릅니다.',
    concept: { prompt: '`CourseRequest(String title, int minutes)` record가 맡는 역할은 무엇인가요?', hint: '데이터를 한 값으로 묶는 일과 JSON 응답을 만드는 일을 구분하세요.' },
    recall: { prompt: '`toRequest("Java", 30)`가 만든 record의 기본 문자열 출력은 무엇인가요?', accepted: ['CourseRequest[title=Java, minutes=30]', 'record 출력은 CourseRequest[title=Java, minutes=30]'], hint: 'record가 생성하는 기본 toString 형식을 확인하세요.', explanation: '실제 출력은 `CourseRequest[title=Java, minutes=30]`입니다. `제목 Java, 수업 시간 30분`은 뜻을 옮긴 설명이지 코드의 출력 문자열은 아니에요.' },
    application: { prompt: 'API가 JSON으로 응답하게 하려면 이 record 선언만으로 충분한가요?', correct: '아니요. 값을 JSON 응답으로 바꾸는 도구나 코드가 따로 필요해요.', correctWhy: 'record는 값을 묶는 형태만 정하고 JSON 응답을 만들지는 않습니다.', wrong: ['네. 모든 Java record는 JSON 응답으로 자동 변환됩니다.', '아니요. record는 API 응답에 사용할 수 없습니다.'], wrongWhy: ['자동 변환은 JSON 도구나 변환 코드가 담당합니다.', 'record를 응답에 쓸 수 있지만 JSON으로 바꾸는 방법은 따로 정해야 합니다.'], hint: '데이터 묶음과 JSON 형식 변환은 서로 다른 일입니다.' },
  },
  '오류 메시지 설계': {
    intro: '입력 검증 실패에는 사용자가 고칠 수 있는 규칙을 알려 주고 실제 입력값도 필요할 때만 표시합니다. 비밀번호나 토큰 같은 비밀값은 오류 메시지에 노출하지 않아요.',
    concept: { prompt: '오류 메시지를 읽은 사용자가 잘못된 입력을 고칠 수 있도록 어떤 내용을 알려야 하나요?', hint: '실패한 규칙은 설명하되 로그·화면에 비밀 원문이 노출되지 않는지도 확인하세요.' },
    recall: { prompt: '`requirePositiveMinutes(-1)`이 출력하는 한국어 오류 문구를 그대로 적으세요.', accepted: ['분은 양수여야 합니다 (입력값: -1)'], hint: '예외 메시지의 규칙 설명과 입력값 표기까지 확인하세요.', explanation: '출력은 `분은 양수여야 합니다 (입력값: -1)`입니다. 앞부분만 적으면 입력값 정보가 빠집니다.' },
    application: { prompt: '같은 오류 메시지에 잘못된 비밀번호 원문을 덧붙여도 되나요?', correct: '아니요. 실패한 규칙은 안내하되 비밀번호 같은 비밀값은 메시지와 로그에 노출하지 않습니다.', correctWhy: '민감한 값은 오류 설명에 필요하지 않고 노출되면 보안 위험이 됩니다.', wrong: ['네. 사용자와 운영자가 볼 수 있게 원문을 그대로 표시합니다.', '네. 메시지가 구체적이면 비밀번호 전체도 포함해도 됩니다.'], wrongWhy: ['오류 화면이나 로그 접근자가 제한되지 않을 수 있습니다.', '실패 규칙과 비밀 원문은 구분해야 합니다.'], hint: '사용자가 고칠 수 있는 설명과 비밀 데이터의 노출을 구분하세요.' },
  },
};

const focusedJavaWeeksSixteenToEighteenNotes = {
  'URI 구성': {
    intro: '`URI.create`는 서버 주소를 나타내는 값을 만듭니다. 이 단계에서는 서버에 연결하거나 요청을 보내지 않아요.',
    concept: { prompt: '`URI.create`로 주소를 만들면 서버에 요청이 전송되나요?', hint: '주소 값을 만드는 단계와 HttpClient로 요청을 보내는 단계를 구분하세요.' },
    recall: { prompt: '예제 URI의 경로와 쿼리를 붙여 출력한 한 줄은 무엇인가요?', accepted: ['/courses?language=java', '경로와 쿼리는 /courses?language=java', '/courses?language=java가 출력됩니다'], hint: 'getPath() 뒤에 물음표와 getQuery() 결과를 붙입니다.', explanation: '경로는 `/courses`, 쿼리는 `language=java`이므로 출력은 `/courses?language=java`입니다.' },
    application: { prompt: '`https://example.com/courses?page=2`에서 `getQuery()`가 돌려주는 값은 무엇인가요?', correct: '쿼리 값은 `page=2`입니다.', correctWhy: '쿼리 구성 요소에는 물음표 뒤의 `page=2`가 들어갑니다.', wrong: ['`/courses?page=2`입니다.', '경로가 있으므로 null입니다.'], wrongWhy: ['`/courses`는 경로이고 쿼리는 `page=2`입니다.', '이 URI에는 쿼리 구성 요소가 있습니다.'], hint: '경로와 물음표 뒤 쿼리 값을 나누어 보세요.' },
  },
  '요청 메서드': {
    intro: '`HttpRequest.Builder.GET()`은 요청 방식을 지정하고 `build()`는 요청 객체를 만듭니다. 실제 전송은 `HttpClient.send`나 `sendAsync`를 호출해야 해요.',
    concept: { prompt: '예제에서 `.GET()`을 호출하면 HttpRequest의 어떤 값이 정해지나요?', hint: '응답 코드나 본문이 아니라 서버에 보낼 요청의 종류입니다.' },
    recall: { prompt: '요청을 만든 뒤 `request.method()`가 출력하는 값은 무엇인가요?', accepted: ['GET', '요청 방식은 GET', 'GET이 출력됩니다'], hint: '예제는 Builder에서 `.GET()`을 선택합니다.', explanation: '`request.method()`는 설정한 요청 방식을 돌려주므로 `GET`이 출력됩니다. 요청은 아직 전송되지 않았어요.' },
    application: { prompt: 'Builder의 `.GET()`을 `.DELETE()`로 바꾸면 `request.method()`는 무엇을 돌려주나요?', correct: '`DELETE`를 돌려줍니다.', correctWhy: '각 메서드는 빌더에 해당 요청 방식을 설정합니다.', wrong: ['계속 `GET`을 돌려줍니다.', '응답 상태 코드인 204를 돌려줍니다.'], wrongWhy: ['요청 방식을 `.DELETE()`로 바꿨으므로 메서드 이름도 DELETE입니다.', '응답 상태 코드는 요청 객체의 method 값이 아닙니다.'], hint: '요청 객체의 method는 Builder에서 선택한 방식을 보여 줍니다.' },
  },
  '상태 코드': {
    intro: '예제는 실제 서버 응답이 아니라 숫자 204를 넣어 200 이상 300 미만인지 검사합니다. HTTP 상태 코드가 성공 범위여도 작업이 이미 끝났다는 뜻은 아닐 수 있어요.',
    concept: { prompt: '`isSuccessfulStatus`는 어떤 상태 코드에서 `true`를 반환하나요?', hint: '메서드의 두 비교식이 함께 만족해야 합니다.' },
    recall: { prompt: '상태 코드 204를 넣었을 때 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['status=204, success=true'], hint: '204는 200 이상이고 300보다 작습니다.', explanation: '204는 조건 `>= 200 && < 300`을 만족하므로 실제 출력은 `status=204, success=true`입니다.' },
    application: { prompt: '`isSuccessfulStatus(404)`의 결과는 무엇인가요?', correct: '`false`입니다. 404는 300보다 작지 않습니다.', correctWhy: '404는 200 이상이지만 300 미만은 아니므로 두 번째 조건을 통과하지 못합니다.', wrong: ['`true`입니다. 200보다 큰 모든 코드는 성공입니다.', '`false`지만 404는 2xx 범위입니다.'], wrongWhy: ['메서드는 200 이상이면서 300 미만인 값만 true로 처리합니다.', '404는 4xx 범위이며 2xx가 아닙니다.'], hint: '조건의 두 번째 경계인 300 미만에 404를 넣어 보세요.' },
  },
  timeout: {
    intro: '이 예제는 요청에 2초 응답 제한을 설정하지만 실제로 요청을 보내지는 않습니다. 제한 시간 안에 응답이 오지 않으면 실제 전송 시 timeout 예외가 발생할 수 있어요.',
    concept: { prompt: '`HttpRequest.Builder.timeout(Duration.ofSeconds(2))`는 무엇을 제한하나요?', hint: '연결만 여는 시간 제한과 요청 응답을 기다리는 제한을 구분하세요.' },
    recall: { prompt: '예제에서 설정한 제한과 요청 방식을 합쳐 출력한 한 줄은 무엇인가요?', accepted: ['timeout=PT2S, method=GET', 'timeout = PT2S, method = GET', '제한 PT2S, 방식 GET'], hint: '`Duration.ofSeconds(2)`의 문자열과 GET 방식을 적으세요.', explanation: '2초는 `PT2S`로 표시되고 요청 방식은 `GET`이므로 해당 줄이 출력됩니다.' },
    application: { prompt: '제한 시간을 `Duration.ofMillis(500)`으로 바꾸면 `request.timeout().get()`은 어떤 문자열을 돌려주나요?', correct: '`PT0.5S`를 돌려줍니다.', correctWhy: 'Java Duration은 500밀리초를 0.5초로 표현합니다.', wrong: ['`PT500S`를 돌려줍니다.', '`PT2S`로 그대로 남습니다.'], wrongWhy: ['밀리초를 초로 바꾸면 0.5초이지 500초가 아닙니다.', '설정값을 바꿨으므로 결과도 500밀리초를 반영합니다.'], hint: '500밀리초는 0.5초입니다.' },
  },
  '응답 본문 확인': {
    intro: '예제의 `SampleResponse`는 코드 안에서 만든 가짜 응답 객체라 실제 HTTP 통신을 하지 않습니다. 실제 응답 본문은 상태 코드와 약속한 형식을 확인한 뒤 해석해야 해요.',
    concept: { prompt: '`new SampleResponse("Java")`를 만들면 실제 서버에서 HTTP 응답을 받은 것인가요?', hint: '예제에서 직접 생성하는 객체와 HttpClient가 받은 응답을 구분하세요.' },
    recall: { prompt: '로컬 SampleResponse의 본문을 읽어 콘솔에 출력하는 한 줄을 그대로 적으세요.', accepted: ['body=Java'], hint: '`response.body()`가 반환하는 문자열을 `body=` 뒤에 붙입니다.', explanation: '이 로컬 객체의 본문은 `Java`이므로 실제 출력은 `body=Java`입니다.' },
    application: { prompt: '실제 응답의 본문이 `Java`여도 상태 코드가 500이면 성공으로 처리해도 되나요?', correct: '아니요. 본문 문자열만으로 성공을 판단하지 말고 상태 코드와 응답 계약을 확인해야 합니다.', correctWhy: '서버는 실패 상태와 함께 설명용 본문을 돌려줄 수 있습니다.', wrong: ['네. 본문에 Java라는 값이 있으면 항상 성공입니다.', '네. 본문만 읽으면 상태 코드는 필요 없습니다.'], wrongWhy: ['같은 본문 내용도 성공·실패 응답에 모두 올 수 있습니다.', '응답의 상태와 본문은 서로 다른 정보입니다.'], hint: '본문 내용과 HTTP 응답 결과를 따로 살펴보세요.' },
  },
  'Arrange Act Assert': {
    intro: '이 예제는 입력 준비, 메서드 실행, 결과 확인의 순서를 보여 줍니다. 간단한 검증 메서드는 실행 흐름을 설명하기 위한 것입니다.',
    concept: { prompt: '테스트에서 입력을 준비하고, 동작을 실행한 뒤, 기대 결과를 확인하는 순서는 무엇인가요?', hint: '준비·실행·검증을 뜻하는 세 단계를 순서대로 놓으세요.' },
    recall: { prompt: 'add 테스트가 끝난 뒤 콘솔에 출력되는 성공 문구를 그대로 적으세요.', accepted: ['passed: add'], hint: '출력문에 적힌 콜론 뒤 공백과 이름까지 확인하세요.', explanation: '검증이 모두 통과하면 `passed: add`를 출력합니다.' },
    application: { prompt: '`add(2, 3)`이 6을 돌려준다면 `assertEquals(5, result)`는 어떻게 되나요?', correct: '`AssertionError`가 발생해 테스트가 실패합니다.', correctWhy: '기대값 5와 실제값 6이 다르므로 assertion이 실패합니다.', wrong: ['기대값을 실제값 6으로 자동 바꿉니다.', '숫자가 다르더라도 테스트는 항상 통과합니다.'], wrongWhy: ['검증은 기대값을 고치지 않고 차이를 실패로 알립니다.', '예제의 assertion은 값이 같을 때만 정상 반환합니다.'], hint: '기대값과 실제 반환값이 같은지 비교하세요.' },
  },
  '경계값': {
    intro: '합계를 0으로 시작하는 메서드가 빈 목록에서도 0을 돌려주는지 확인합니다. 빈 입력은 반복문이 한 번도 실행되지 않는 경계예요.',
    concept: { prompt: '빈 목록을 별도 테스트하면 어떤 누락을 찾을 수 있나요?', hint: '원소가 없으면 반복문이 실행되지 않는다는 점을 떠올리세요.' },
    recall: { prompt: '빈 목록을 합산한 뒤 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['empty sum=0'], hint: '목록이 비었으므로 합계의 초기값이 그대로 남습니다.', explanation: '반복문은 실행되지 않고 total은 0이므로 실제 출력은 `empty sum=0`입니다.' },
    application: { prompt: '`sum(Arrays.asList(2, -1, 0))`의 반환값은 얼마인가요?', correct: '합계 결과는 `1`입니다.', correctWhy: '`sum`은 2, -1, 0을 하나씩 모두 더하므로 결과는 `1`입니다.', wrong: ['`3`입니다. 음수와 0은 무시됩니다.', '`0`입니다. 목록에 0이 포함되면 합도 0입니다.'], wrongWhy: ['메서드는 모든 값을 더하며 음수도 포함합니다.', '합계는 목록에 0이 있는지와 관계없이 모든 값을 더한 결과입니다.'], hint: '목록의 원소를 순서대로 더하세요.' },
  },
  '예외 검증': {
    intro: '숫자가 아닌 문자열을 분으로 바꿀 때 메서드는 `IllegalArgumentException`으로 실패합니다. 테스트는 예외 종류를 확인하며, 이 예제의 간단한 검증 도우미는 JUnit API가 아니에요.',
    concept: { prompt: '`parseMinutes("x")`가 잘못된 입력을 거부하는지 확인하려면 무엇을 검사해야 하나요?', hint: '실패 여부만이 아니라 메서드가 던지는 예외 종류도 살펴보세요.' },
    recall: { prompt: '예외 검증이 통과하면 콘솔에 출력되는 문구를 그대로 적으세요.', accepted: ['passed: invalid input throws'], hint: '예제의 출력문에서 `passed:` 뒤 문장 전체를 확인하세요.', explanation: '기대한 IllegalArgumentException이 발생하면 `passed: invalid input throws`를 출력합니다.' },
    application: { prompt: '예상 예외를 `IllegalArgumentException`으로 지정했는데 코드가 하위 타입인 `NumberFormatException`을 던지면 예제의 검사도 통과하나요?', correct: '네. 검사 도우미는 `expected.isInstance(exception)`을 사용해 하위 타입도 허용합니다.', correctWhy: 'NumberFormatException은 IllegalArgumentException의 하위 타입이고 isInstance는 그 관계를 인정합니다.', wrong: ['아니요. 예외 타입이 한 글자라도 다르면 항상 실패합니다.', '네. 예외가 무엇이든 던져지기만 하면 통과합니다.'], wrongWhy: ['이 검사는 정확한 타입 일치가 아니라 지정 타입의 인스턴스인지 확인합니다.', '기대 타입과 관계없는 예외는 허용하지 않습니다.'], hint: 'NumberFormatException의 상위 타입과 `Class.isInstance` 동작을 확인하세요.' },
  },
  '테스트 이름': {
    intro: '`emptyList_returnsZero`는 입력 경계와 기대 결과를 이름에 드러냅니다. 실패 보고에서 어떤 상황을 확인하는 테스트인지 찾기 쉬워요.',
    concept: { prompt: '`emptyList_returnsZero`라는 이름은 어떤 입력 상황과 결과를 약속하나요?', hint: '이름의 앞부분과 뒷부분을 나누어 읽으세요.' },
    recall: { prompt: '예제가 호출하는 테스트 메서드 이름은 무엇인가요?', accepted: ['emptyList_returnsZero', '빈 목록은 0을 반환'], hint: 'main에서 실행하는 메서드 이름을 적으세요.', explanation: '호출되는 이름은 `emptyList_returnsZero`입니다.' },
    application: { prompt: '`add(1, 3)`의 결과가 4인지 검사하는 메서드라면 어떤 이름이 상황을 잘 드러내나요?', correct: '`onePlusThree_returnsFour`처럼 입력 조건과 기대 결과를 담습니다.', correctWhy: '실패 메시지와 테스트 목록에서 무엇을 검증하는지 추측하지 않아도 됩니다.', wrong: ['`test1`처럼 모든 테스트를 숫자만으로 구분합니다.', '`works`처럼 결과나 입력을 생략합니다.'], wrongWhy: ['번호만으로는 어떤 동작을 확인하는지 알기 어렵습니다.', '좋은 이름에는 조건이나 기대 결과가 드러나야 합니다.'], hint: '숫자 입력과 기대 합계를 이름에 함께 담으세요.' },
  },
  '독립성': {
    intro: '두 테스트는 각각 새 저장소와 서비스를 만듭니다. 한쪽에서 추가한 강의가 다른 쪽 결과에 섞이지 않아요.',
    concept: { prompt: '각 테스트가 별도 저장소를 사용하면 무엇을 줄일 수 있나요?', hint: '테스트가 실행된 순서나 이전 테스트의 변경값을 생각하세요.' },
    recall: { prompt: '첫 서비스에만 Java를 추가한 뒤 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['first=1, second=0'], hint: '첫 서비스의 저장소만 한 항목을 갖습니다.', explanation: '첫 저장소에는 Java가 들어가고 둘째 저장소는 비어 있어 실제 출력은 `first=1, second=0`입니다.' },
    application: { prompt: '두 서비스에 같은 Repository 객체를 전달하면 첫 서비스에 Java를 추가한 뒤 두 번째 `count()`는 얼마인가요?', correct: '`1`입니다. 두 서비스가 같은 저장소 상태를 봅니다.', correctWhy: '두 서비스가 같은 객체를 공유하므로 한쪽의 추가가 다른 쪽 조회에도 보입니다.', wrong: ['`0`입니다. 서비스 객체가 다르면 저장소도 자동으로 분리됩니다.', '`2`입니다. 저장소 하나에 서비스 수만큼 복제됩니다.'], wrongWhy: ['두 서비스 객체만 다를 뿐 저장소 참조를 공유하면 상태도 공유합니다.', '공유 저장소에 추가된 강의는 한 번만 저장됩니다.'], hint: '서로 다른 Service와 서로 다른 Repository는 같은 상황이 아닙니다.' },
  },
  '한 가지 책임': {
    intro: '`Course`는 강의 제목을 보관하고 `CourseFormatter`는 그 제목을 문자열로 표시합니다. 데이터 변경과 화면 형식 변경의 이유를 나눕니다.',
    concept: { prompt: '화면에 보이는 강의 제목 형식만 바뀐다면 어느 역할을 먼저 살펴봐야 하나요?', hint: '제목을 보관하는 역할과 화면용 문자열을 만드는 역할을 구분하세요.' },
    recall: { prompt: 'CourseFormatter가 Java 강의 객체를 표시해 출력하는 문자열은 무엇인가요?', accepted: ['Java', '출력은 Java', '강의 제목 Java'], hint: 'formatter는 이 예제에서 제목을 그대로 반환합니다.', explanation: 'CourseFormatter가 course.title()을 반환해 출력은 `Java`입니다.' },
    application: { prompt: '강의 제목을 화면에서 `Course: SQL` 형식으로 표시하려면 어느 역할의 동작을 바꾸는 편이 알맞나요?', correct: '`CourseFormatter`를 바꾸고 Course의 저장 데이터는 그대로 둡니다.', correctWhy: '변경 요청은 보관 값이 아니라 화면에 표시하는 형식에 관한 것입니다.', wrong: ['제목을 저장하는 Course에 출력 포맷과 화면 문구를 모두 넣습니다.', 'Course의 title 필드에 `Course: ` 접두사를 저장합니다.'], wrongWhy: ['표시 규칙이 데이터 모델에 섞이면 서로 다른 변경 이유가 한곳에 모입니다.', '저장값 자체를 바꾸면 다른 사용처도 접두사가 붙은 제목을 받습니다.'], hint: '강의의 실제 제목과 화면에 보여 주는 모양을 구분하세요.' },
  },
  '의존성 역전': {
    intro: 'CourseService는 저장소 인터페이스를 사용하고, 메모리 저장 구현체는 생성자로 전달됩니다. 저장 방식이 바뀌어도 서비스의 조회 규칙을 유지할 수 있어요.',
    concept: { prompt: 'CourseService가 저장 구현을 쉽게 바꿀 수 있는 이유는 무엇인가요?', hint: '필드와 생성자의 선언 타입을 구체 클래스와 비교하세요.' },
    recall: { prompt: '`findTitle("java")`가 돌려주는 제목은 무엇인가요?', accepted: ['Java', '강의 제목은 Java', 'Java를 반환합니다'], hint: '예제 저장소는 `java` 키에 어떤 Course를 연결했는지 확인하세요.', explanation: '메모리 저장소의 `java` 항목은 Course("Java")이므로 제목은 `Java`입니다.' },
    application: { prompt: 'DatabaseCourseRepository가 같은 CourseRepository 계약을 구현하면 CourseService의 생성자나 조회 코드를 바꿔야 하나요?', correct: '아니요. 같은 계약을 지키면 생성자에 새 구현을 전달할 수 있습니다.', correctWhy: '서비스가 구체 저장소가 아니라 CourseRepository 인터페이스에 의존합니다.', wrong: ['네. 서비스 코드에서 구체 저장소의 모든 메서드 이름을 다시 적어야 합니다.', '네. 인터페이스는 메모리 저장소에서만 사용할 수 있습니다.'], wrongWhy: ['호출 계약이 같으면 구현을 바꿔도 서비스는 같은 방식으로 사용합니다.', '인터페이스는 저장 방식에 묶이지 않도록 경계를 둡니다.'], hint: '생성자 매개변수 타입이 구현체인지 인터페이스인지 확인하세요.' },
  },
  '구성으로 재사용': {
    intro: '`ReportService`는 `Formatter`를 생성자로 받아 `render`에서 위임합니다. 같은 서비스에 다른 Formatter를 전달해 표시 방식을 바꿀 수 있어요.',
    concept: { prompt: 'ReportService가 출력 형식을 바꿀 때 Formatter 인터페이스가 하는 역할은 무엇인가요?', hint: '실제 문자열을 만드는 객체와 그 객체를 호출하는 서비스를 구분하세요.' },
    recall: { prompt: '예제의 PrefixFormatter가 Java에 접두사를 붙여 출력하는 문장을 그대로 적으세요.', accepted: ['Report: Java'], hint: 'Formatter가 입력 앞에 `Report: `를 붙입니다. 콜론 다음 공백도 확인하세요.', explanation: 'PrefixFormatter가 접두사를 붙여 `Report: Java`를 반환합니다.' },
    application: { prompt: '새 UppercaseFormatter가 `format("Java")`에서 `JAVA`를 돌려주면 ReportService의 `render("Java")` 결과는 무엇인가요?', correct: '`JAVA`입니다. ReportService는 전달된 Formatter 결과를 그대로 반환합니다.', correctWhy: '서비스는 특정 formatter의 구현을 고정하지 않고 인터페이스 메서드에 위임합니다.', wrong: ['항상 `Report: Java`입니다.', '`Java`입니다. formatter 결과는 버립니다.'], wrongWhy: ['그 결과는 PrefixFormatter를 넣었을 때의 값입니다.', 'ReportService.render는 formatter.format(title)을 반환합니다.'], hint: '서비스의 render 메서드가 formatter 반환값을 어떻게 처리하는지 보세요.' },
  },
  '명시적 계약': {
    intro: '`findById`는 값이 있으면 Optional 안에 Course를 담고, 없으면 빈 Optional을 반환합니다. 호출자는 null을 직접 추측하지 않아도 돼요.',
    concept: { prompt: 'Map에 없는 id를 조회했을 때 `findById`는 어떤 결과를 반환하나요?', hint: 'Optional.ofNullable은 입력이 null일 때 어떤 Optional을 만드는지 확인하세요.' },
    recall: { prompt: '예제에서 없는 `sql` 항목을 조회한 결과를 출력한 줄은 무엇인가요?', accepted: ['missing=false', 'missing = false', '없는 강의는 false'], hint: 'Optional이 비어 있으면 isPresent()는 false입니다.', explanation: 'sql은 Map에 없어서 Optional.empty가 되고 `isPresent()`는 false입니다.' },
    application: { prompt: 'Map에 `java`가 Course로 저장되어 있다면 `findById(courses, "java").isPresent()`는 무엇인가요?', correct: '`true`입니다. 조회한 Course가 Optional에 담깁니다.', correctWhy: 'Map.get은 저장된 Course를 반환하고 ofNullable은 이를 값이 있는 Optional로 감쌉니다.', wrong: ['`false`입니다. ofNullable은 항상 빈 Optional을 만듭니다.', '`null`입니다. 메서드는 Optional을 반환하지 않습니다.'], wrongWhy: ['ofNullable은 입력이 null이 아니면 값이 있는 Optional을 반환합니다.', '메서드의 반환형은 Optional<Course>입니다.'], hint: '조회된 값이 null인지 아닌지 먼저 확인하세요.' },
  },
  '변경 영향 찾기': {
    intro: 'Repository의 조회 결과는 Optional<Course>입니다. 인터페이스·구현체·호출 코드가 함께 이 반환 약속을 지켜야 합니다.',
    concept: { prompt: '공개 메서드의 반환형을 바꾸기 전에 어떤 사용처를 확인해야 하나요?', hint: '메서드를 구현하는 코드와 호출하는 코드, 그 계약을 확인하는 검사를 떠올리세요.' },
    recall: { prompt: '예제에서 java 항목을 조회해 콘솔에 출력하는 줄을 그대로 적으세요.', accepted: ['found=true, title=Java'], hint: '출력에 존재 여부와 강의 제목이 모두 들어가는지 확인하세요.', explanation: 'java 항목은 존재하므로 Optional이 비어 있지 않고 제목은 Java입니다. 실제 출력에는 두 값이 모두 표시돼요.' },
    application: { prompt: 'findById의 반환형을 Course에서 Optional<Course>로 바꾸면 실제로 고쳐야 할 곳은 어디인가요?', correct: '인터페이스 구현체와 findById 호출부, 해당 결과를 확인하는 테스트를 함께 고쳐야 합니다.', correctWhy: '반환 계약을 바꾸면 이를 구현하고 사용하는 코드 모두가 새 타입에 맞춰야 합니다.', wrong: ['인터페이스 선언만 바꾸면 모든 구현체와 호출부가 자동으로 맞춰집니다.', '호출하는 쪽은 반환형이 바뀌어도 이전처럼 Course로 바로 사용할 수 있습니다.'], wrongWhy: ['Java는 구현체와 호출자의 타입 불일치를 자동 수정하지 않습니다.', '호출부도 Optional에서 값의 존재 여부를 처리해야 합니다.'], hint: '인터페이스 선언을 구현하거나 호출하는 모든 위치를 따라가 보세요.' },
  },
};

const focusedJavaWeeksNineteenToTwentyOneNotes = {
  'equals 의미': {
    intro: '예제의 두 String은 서로 다른 객체지만 글자 내용은 모두 `java`입니다. `equals`는 내용을 비교해 true를 반환해요.',
    concept: { prompt: '예제의 left와 right는 서로 다른 String 객체인데 `left.equals(right)`가 true인 이유는 무엇인가요?', hint: '참조가 같은지와 문자열 내용이 같은지를 구분하세요.' },
    recall: { prompt: '예제에서 두 문자열을 비교해 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['same=true'], hint: 'equals는 두 문자열의 내용이 같은지 확인합니다.', explanation: '두 변수는 서로 다른 객체지만 내용이 `java`로 같아 `same=true`가 출력됩니다.' },
    application: { prompt: '`"Java".equals(new String("Java"))`의 결과는 무엇인가요?', correct: '`true`입니다. 두 문자열의 내용이 같습니다.', correctWhy: 'equals는 서로 다른 객체인지가 아니라 문자열 내용을 비교합니다.', wrong: ['`false`입니다. new String으로 만들면 내용도 다릅니다.', '`true`입니다. 두 변수는 같은 객체를 가리킵니다.'], wrongWhy: ['새 객체를 만들었어도 생성자에 전달한 문자열 내용은 같습니다.', 'new String은 별도 객체를 만들므로 참조가 같다고 볼 수 없습니다.'], hint: '객체 생성 방식과 문자열 내용 비교를 따로 보세요.' },
  },
  'hashCode 규약': {
    intro: 'CourseId는 value가 같으면 equals가 true이고 같은 해시값을 계산합니다. 해시가 같아도 서로 다른 키일 수 있어 equals 비교도 필요해요.',
    concept: { prompt: '두 CourseId의 `equals`가 true라면 hashCode는 어떤 관계여야 하나요?', hint: 'HashMap이 같은 논리 키를 다시 찾으려면 두 메서드가 어떤 약속을 지켜야 하는지 생각하세요.' },
    recall: { prompt: '새 CourseId로 조회해 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['title=Java'], hint: '삽입과 조회 객체의 value가 모두 `java`입니다.', explanation: '두 객체는 equals와 hashCode 규약상 같은 키이므로 `title=Java`가 나옵니다.' },
    application: { prompt: '두 서로 다른 CourseId의 hashCode가 우연히 같지만 equals가 false라면 HashMap은 두 키를 구분할 수 있나요?', correct: '네. 같은 해시값은 찾을 후보를 모으는 데 쓰고, equals로 실제 키를 구분합니다.', correctWhy: '해시 충돌은 허용되며 HashMap은 같은 해시값 안에서도 키의 equals를 확인합니다.', wrong: ['아니요. hashCode가 같으면 두 키는 항상 같은 항목으로 취급됩니다.', '아니요. 서로 다른 객체는 hashCode가 반드시 달라야 합니다.'], wrongWhy: ['같은 hashCode만으로 equals가 true라고 결론 내릴 수 없습니다.', '서로 다른 키가 같은 hashCode를 갖는 충돌은 정상적으로 생길 수 있습니다.'], hint: '해시값의 역할과 키의 동등성 비교를 나누어 생각하세요.' },
  },
  'record 값 모델': {
    intro: '`record CourseId(String value)`는 value를 보관하고 `value()` 접근자와 값 기준 동등성 메서드를 제공합니다. record가 참조형 구성 요소까지 깊게 복사하는 것은 아니에요.',
    concept: { prompt: '예제에서 `id.value()`는 무엇을 돌려주나요?', hint: 'record 선언의 괄호 안에 적힌 구성 요소 이름을 확인하세요.' },
    recall: { prompt: 'CourseId record의 값을 콘솔에 출력한 줄을 그대로 적으세요.', accepted: ['id=java'], hint: '`value()`가 record 구성 요소의 값을 돌려줍니다.', explanation: 'record 구성 요소 value에 `java`를 넣었으므로 `id=java`가 출력됩니다.' },
    application: { prompt: '`new CourseId("sql").equals(new CourseId("sql"))`의 결과는 무엇인가요?', correct: '`true`입니다. record는 구성 요소 값을 기준으로 비교합니다.', correctWhy: 'record가 제공하는 equals는 같은 record 타입의 구성 요소 값이 같으면 true입니다.', wrong: ['`false`입니다. new를 두 번 쓰면 값 비교는 할 수 없습니다.', '`true`입니다. record 객체 두 개는 같은 객체입니다.'], wrongWhy: ['두 객체는 다르지만 record의 equals는 구성 요소 값을 비교합니다.', '두 생성 호출은 별도 객체를 만드므로 참조가 같은 것은 아닙니다.'], hint: 'record의 자동 생성 equals와 참조 비교를 구분하세요.' },
  },
  '방어적 복사': {
    intro: '`List.copyOf`는 원본과 분리된 변경 불가 목록을 만듭니다. 이 복사는 얕은 복사라 목록 안의 가변 객체까지 복제하지는 않아요.',
    concept: { prompt: '생성 뒤 source 목록을 비웠는데도 `tags.values()`에 backend가 남는 이유는 무엇인가요?', hint: '생성자에서 원본 참조를 저장했는지, 새 목록을 만들어 저장했는지 확인하세요.' },
    recall: { prompt: '원본 목록을 비운 뒤 CourseTags가 출력하는 목록은 무엇인가요?', accepted: ['tags=[backend]', 'tags = [backend]', '목록에는 backend가 남습니다'], hint: '생성자는 List.copyOf로 원본 목록과 분리된 값을 보관합니다.', explanation: 'source.clear()는 원본만 비우므로 복사해 둔 목록은 `tags=[backend]`입니다.' },
    application: { prompt: '`tags.values().add("frontend")`를 호출하면 어떻게 되나요?', correct: '변경 불가 목록을 수정하려 해서 `UnsupportedOperationException`이 발생합니다.', correctWhy: 'List.copyOf가 돌려주는 목록은 구조를 변경할 수 없습니다.', wrong: ['정상적으로 추가되고 source도 함께 바뀝니다.', 'CourseTags가 새 목록을 다시 만들어 추가를 허용합니다.'], wrongWhy: ['원본과 분리된 목록이며 반환 목록도 수정할 수 없습니다.', 'values()는 저장한 목록을 그대로 반환하고 변경 가능한 복사본을 만들지 않습니다.'], hint: '원본 참조 분리와 반환 목록의 수정 가능성은 서로 다른 성질입니다.' },
  },
  '컬렉션 키 주의': {
    intro: 'HashMap에서 CourseId를 다시 찾을 수 있는 것은 삽입 때와 조회 때의 `value`, `equals`, `hashCode` 기준이 같기 때문입니다. 키의 비교 기준은 넣은 뒤 바꾸지 않는 편이 안전해요.',
    concept: { prompt: 'Map에 넣은 키의 equals·hashCode 기준 필드가 나중에 바뀌면 어떤 문제가 생길 수 있나요?', hint: 'HashMap이 키를 저장할 때 계산한 위치와 조회 때 계산하는 위치를 비교하세요.' },
    recall: { prompt: '새 CourseId로 조회해 콘솔에 출력되는 제목 줄을 그대로 적으세요.', accepted: ['title=Java'], hint: '삽입한 키와 조회 키의 value가 모두 `java`입니다.', explanation: '두 키의 값과 동등성 규칙이 같아 `title=Java`를 찾습니다.' },
    application: { prompt: 'Map에 넣은 뒤 키의 비교 기준이 되는 값을 바꾸면 왜 조회가 실패할 수 있나요?', correct: '삽입 때와 조회 때 해시값이 달라져 저장된 위치에서 키를 찾지 못할 수 있습니다.', correctWhy: 'HashMap은 삽입 시의 해시값을 기준으로 저장 위치를 정하고 조회에서도 현재 해시값을 사용합니다.', wrong: ['HashMap은 키 필드 변경을 감지해 항목을 자동으로 옮깁니다.', '키의 hashCode와 equals는 Map 조회에 사용되지 않습니다.'], wrongWhy: ['키 변경을 자동 감지해 내부 위치를 다시 만드는 동작은 없습니다.', 'HashMap은 해시값으로 후보를 찾고 equals로 키를 비교합니다.'], hint: '키가 Map에 들어간 뒤에도 비교에 쓰는 값이 안정적인지 확인하세요.' },
  },
  '로그 수준': {
    intro: '예제는 Logger 기준을 INFO로 두고 기록 가능 여부만 확인합니다. 실제 메시지를 로그 핸들러나 파일로 보내지는 않아요.',
    concept: { prompt: 'Logger 기준이 INFO일 때 INFO와 FINE 중 어느 수준을 기록할 수 있나요?', hint: '기준보다 낮은 세부 기록은 걸러집니다.' },
    recall: { prompt: '두 로그 수준의 검사 결과로 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['info=true, fine=false'], hint: 'INFO는 기준과 같고 FINE은 그보다 낮은 상세 수준입니다.', explanation: 'INFO 기록은 허용되고 FINE 기록은 기준보다 낮아 `info=true, fine=false`입니다.' },
    application: { prompt: 'Logger 기준을 WARNING으로 바꾼 뒤 `isLoggable(INFO)`를 확인하면 무엇을 돌려주나요?', correct: '`false`입니다. INFO는 WARNING보다 낮습니다.', correctWhy: '기준보다 낮은 로그 요청은 isLoggable에서 false로 판단합니다.', wrong: ['`true`입니다. INFO는 WARNING보다 낮아 더 중요한 로그입니다.', '`true`입니다. 모든 로그 수준을 항상 허용합니다.'], wrongWhy: ['수준 순서에서 WARNING이 INFO보다 높으므로 INFO는 걸러집니다.', '예제는 지정한 최소 수준을 기준으로 허용 여부를 계산합니다.'], hint: '로그 수준 이름의 일반적인 의미보다 Logger의 기준 비교를 따르세요.' },
  },
  '구조화된 맥락': {
    intro: '예제는 Map에 event와 courseId를 각각 넣은 뒤 보기 좋게 한 줄로 출력합니다. 실제 Logger나 로그 저장소를 호출하는 예제는 아니에요.',
    concept: { prompt: '예제에서 event와 courseId를 Map의 서로 다른 항목에 넣는 목적은 무엇인가요?', hint: '두 값의 이름과 내용을 따로 확인할 수 있다는 점을 생각하세요.' },
    recall: { prompt: 'Map에서 두 값을 읽어 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['event=course.loaded, courseId=java'], hint: 'event 값과 courseId 값을 각각 Map에서 읽습니다.', explanation: 'Map에 저장한 두 값을 이어 출력해 `event=course.loaded, courseId=java`가 됩니다.' },
    application: { prompt: '이 예제만 실행하면 실제 로그 파일에 기록되나요?', correct: '아니요. Map에 값을 담아 콘솔에 출력할 뿐 실제 로그 API나 파일은 사용하지 않습니다.', correctWhy: '구조화된 필드 모양을 보여 주는 예제와 실제 로그 기록은 별개의 작업입니다.', wrong: ['네. Map에 값을 넣으면 Logger가 자동으로 파일에 기록합니다.', '네. System.out.println은 로그 저장소에 구조화된 필드를 전송합니다.'], wrongWhy: ['예제는 Logger나 FileHandler에 연결하지 않았습니다.', 'System.out.println은 콘솔에 문자열을 출력하며 구조화 로그 전송은 하지 않습니다.'], hint: '코드에서 실제로 호출하는 기록·전송 API가 있는지 확인하세요.' },
  },
  '예외 기록': {
    intro: '예제는 LogRecord에 예외 객체를 연결하고 그 메시지를 읽습니다. LogRecord를 만든 것만으로 Logger나 처리기에 전송되지는 않아요.',
    concept: { prompt: '`record.setThrown(failure)`는 LogRecord에 어떤 정보를 연결하나요?', hint: '오류 문구 문자열이 아니라 실제 예외 객체를 넘깁니다.' },
    recall: { prompt: 'LogRecord의 수준과 원인 메시지를 콘솔에 출력하는 줄을 그대로 적으세요.', accepted: ['level=SEVERE, cause=repository unavailable'], hint: '기록의 수준과 failure 객체의 메시지를 합쳐 출력합니다.', explanation: '예제는 `SEVERE` 수준과 예외 메시지를 읽어 해당 줄을 출력합니다.' },
    application: { prompt: '예제는 LogRecord를 만들고 출력합니다. 이 코드만으로 오류가 로그 파일에 저장되나요?', correct: '아니요. 실제 Logger에 전달하거나 처리기에 연결하지 않았습니다.', correctWhy: 'LogRecord는 로그 요청의 내용을 담는 객체이고, 기록·전달에는 Logger와 Handler가 필요합니다.', wrong: ['네. LogRecord 생성자는 자동으로 기본 로그 파일에 기록합니다.', '네. setThrown을 호출하면 예외가 자동으로 전송됩니다.'], wrongWhy: ['생성만으로 로그 처리기를 호출하지 않습니다.', 'setThrown은 예외 정보를 연결할 뿐 로그를 보내지 않습니다.'], hint: '객체 생성과 로그 핸들러로 전달하는 동작을 구분하세요.' },
  },
  '민감 정보': {
    intro: '예제는 비밀값 원문을 보여 주지 않고 존재할 때 `***`, null이나 빈 문자열일 때 `(missing)`으로 표시합니다. 값의 유효성을 확인하는 검사는 별도예요.',
    concept: { prompt: '토큰이 있는 경우 로그에 남길 안전한 표시는 무엇인가요?', hint: '현재 토큰 값이 출력되지 않도록 만든 메서드의 반환값을 보세요.' },
    recall: { prompt: '토큰 abc123과 null을 각각 처리한 출력 두 줄은 무엇인가요?', accepted: ['token=***\nmissing=(missing)', 'token = *** / missing = (missing)', 'token은 마스킹되고 없는 값은 missing으로 표시'], hint: 'redact는 실제 값과 null에 서로 다른 안전한 표시를 반환합니다.', explanation: '실제 토큰은 `***`로 가려지고 null은 `(missing)`으로 표시됩니다.' },
    application: { prompt: '`redact("")`는 어떤 문자열을 돌려주나요?', correct: '`(missing)`을 돌려줍니다.', correctWhy: '메서드는 null과 빈 문자열 모두 값이 없는 경우로 처리합니다.', wrong: ['빈 문자열을 그대로 돌려줍니다.', '`***`를 돌려줍니다.'], wrongWhy: ['조건식에서 token.isEmpty()가 true이면 `(missing)` 경로를 선택합니다.', '`***`는 null도 빈 문자열도 아닌 토큰이 있을 때 반환합니다.'], hint: 'null 검사 다음에 빈 문자열 검사도 확인하세요.' },
  },
  '측정 가능한 사건': {
    intro: '예제의 두 시각은 고정된 학습용 값입니다. 차이를 밀리초로 계산해 사건 이름·값·단위를 함께 출력하지만 실제 서비스 지표를 수집하지는 않아요.',
    concept: { prompt: '측정 숫자 옆에 사건 이름과 단위를 적어야 하는 이유는 무엇인가요?', hint: '숫자 250만 봤을 때 무엇을 뜻하는지 알 수 있는지 생각하세요.' },
    recall: { prompt: '두 시각 사이 차이를 콘솔에 출력하는 줄을 그대로 적으세요.', accepted: ['event=course.load, value=250, unit=ms'], hint: '두 시각 사이 간격은 250밀리초입니다.', explanation: 'Duration.toMillis() 결과에 사건 이름과 `ms` 단위를 붙여 해당 줄을 출력합니다.' },
    application: { prompt: '예제에서 elapsedMs에 250이 들어 있는 이유는 무엇인가요?', correct: 'finished가 started보다 250밀리초 뒤라서입니다.', correctWhy: 'Duration.between으로 두 Instant의 차이를 구한 뒤 toMillis()로 바꿉니다.', wrong: ['Instant.parse에 적힌 시간이 분 단위이기 때문입니다.', 'toMillis()는 항상 250을 돌려주기 때문입니다.'], wrongWhy: ['두 시각 문자열의 차이는 0.25초이고, toMillis()는 밀리초를 반환합니다.', '다른 두 시각을 넣으면 결과도 그 차이에 따라 달라집니다.'], hint: '10:00:00.000Z와 10:00:00.250Z 사이의 차이를 계산하세요.' },
  },
  '냄새 찾기': {
    intro: '예제는 같은 `age >= 18` 조건을 두 번 계산합니다. 지금 결과가 틀린 것은 아니지만, 규칙이 바뀔 때 한 곳만 고칠 위험이 있어요.',
    concept: { prompt: 'eligible과 canEnroll이 모두 true인 현재 코드는 잘못된 결과인가요?', hint: '두 변수에 사용한 조건과 코드 냄새가 뜻하는 바를 구분하세요.' },
    recall: { prompt: 'age가 20일 때 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['eligible=true, canEnroll=true'], hint: '20은 두 `age >= 18` 조건을 모두 만족합니다.', explanation: '두 변수 모두 같은 비교식의 결과를 받아 `eligible=true, canEnroll=true`를 출력합니다.' },
    application: { prompt: '성인 기준을 21로 바꾸기로 했다면 중복된 비교식을 둘 다 고쳐야 하나요?', correct: '네. 현재는 같은 규칙이 두 곳에 있어 한 곳만 바꾸면 결과가 달라질 수 있습니다.', correctWhy: '중복된 규칙은 한 부분만 수정해 서로 다른 기준을 쓰게 될 위험이 있습니다.', wrong: ['아니요. Java가 한 비교식의 변경을 다른 곳에도 자동 반영합니다.', '아니요. 두 비교식 중 하나는 실행되지 않습니다.'], wrongWhy: ['각 비교식은 별도로 작성돼 있어 한쪽만 바꿔도 다른 쪽은 그대로입니다.', '예제는 두 비교식을 모두 계산해 출력합니다.'], hint: '복사된 조건식은 서로 연결되어 자동으로 바뀌지 않습니다.' },
  },
  '의미 있는 이름': {
    intro: '`completedLessons`는 3이라는 값이 완료한 수업 수임을 알려 줍니다. 이름이 짧은지보다 역할을 설명하는지가 중요해요.',
    concept: { prompt: '`completedLessons`라는 이름이 `n`보다 읽기 쉬운 이유는 무엇인가요?', hint: '변수가 어떤 값을 나타내는지 이름만 보고 알 수 있는지 비교하세요.' },
    recall: { prompt: '완료한 수업 수를 콘솔에 출력하는 줄을 그대로 적으세요.', accepted: ['completed=3'], hint: '변수 이름과 정수 값을 출력합니다.', explanation: 'completedLessons에 3을 저장해 `completed=3`을 출력합니다.' },
    application: { prompt: '완료한 수업 수를 저장하는 변수의 이름으로 더 알맞은 것은 무엇인가요?', correct: '`completedLessons`처럼 값의 역할이 드러나는 이름입니다.', correctWhy: '코드만 읽어도 정수가 무엇을 세는지 알 수 있습니다.', wrong: ['`n`처럼 한 글자만 쓰는 이름입니다.', '`intValue`처럼 자료형만 나타내는 이름입니다.'], wrongWhy: ['한 글자만으로는 이 값의 의미를 추측하기 어렵습니다.', '자료형은 int 선언에서 이미 알 수 있고 값의 역할은 드러나지 않습니다.'], hint: '값의 자료형보다 도메인에서 맡은 의미를 적으세요.' },
  },
  '조건 추출': {
    intro: '예제는 `age >= 18` 비교 결과에 `isAdult`라는 이름을 붙입니다. 나이가 20이면 비교 결과를 boolean으로 읽을 수 있어요.',
    concept: { prompt: 'age가 20일 때 `isAdult`에는 어떤 값이 들어가나요?', hint: '비교식의 경계인 18 이상인지 확인하세요.' },
    recall: { prompt: '나이가 20일 때 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['isAdult=true'], hint: '20은 18 이상입니다.', explanation: '`age >= 18`이 true이므로 출력은 `isAdult=true`입니다.' },
    application: { prompt: 'age를 17로 바꾸면 `isAdult`는 어떤 값인가요?', correct: '`false`입니다. 17은 18보다 작습니다.', correctWhy: '조건식은 18 이상을 확인하므로 17은 조건을 만족하지 않습니다.', wrong: ['`true`입니다. 17은 정수입니다.', '`false`입니다. age가 null이기 때문입니다.'], wrongWhy: ['조건은 정수 여부가 아니라 18 이상인지 비교합니다.', '예제의 age는 기본형 int라 null이 될 수 없습니다.'], hint: '17을 `age >= 18`에 대입하세요.' },
  },
  '중복 제거': {
    intro: '서로 다른 두 기능이 `isValidMinutes`를 함께 호출해 같은 양수 규칙을 사용합니다. 규칙을 바꿀 때 검사 메서드 한 곳만 수정하면 돼요.',
    concept: { prompt: '두 기능이 같은 `isValidMinutes`를 호출하면 어떤 변경 이점이 있나요?', hint: '공통 규칙을 여러 호출 위치가 따로 복사해 두는 상황과 비교하세요.' },
    recall: { prompt: '30분과 0분을 검사해 출력한 줄은 무엇인가요?', accepted: ['valid=true, invalid=false', 'valid = true, invalid = false', '30분은 true, 0분은 false'], hint: '메서드는 0보다 큰 분만 true로 처리합니다.', explanation: '30은 양수이고 0은 양수가 아니므로 해당 결과가 나옵니다.' },
    application: { prompt: '허용 기준을 바꾸기로 했다면 두 기능의 검사를 각각 고쳐야 하나요?', correct: '아니요. 공통 `isValidMinutes` 메서드의 기준을 한 번 바꾸면 됩니다.', correctWhy: '두 호출 위치가 같은 메서드를 사용하므로 규칙은 한 곳에서 관리됩니다.', wrong: ['네. 각 기능에 검사식이 따로 복사돼 있습니다.', '네. 공통 메서드 결과는 호출하는 곳마다 자동으로 달라집니다.'], wrongWhy: ['예제의 호출 위치 두 곳 모두 isValidMinutes를 사용합니다.', '같은 인자에 대한 메서드 결과는 해당 규칙에 따라 같습니다.'], hint: 'canCreate와 canExtend가 실제로 호출하는 메서드를 찾아보세요.' },
  },
  '작은 커밋 단위': {
    intro: '예제는 파일 하나를 커밋 준비 영역에 올리고, 그 변경만 다시 확인한 뒤 한 의도로 커밋합니다. 실제 저장소에서 명령을 실행한 예는 아니에요.',
    concept: { prompt: '`git add` 뒤 커밋하기 전에 staged diff를 확인하면 무엇을 알 수 있나요?', hint: '다음 커밋에 포함될 변경 내용을 확인합니다.' },
    recall: { prompt: 'staged 변경을 확인하는 명령은 무엇인가요?', accepted: ['git diff --cached -- src/CourseService.java', 'git diff --cached', '준비한 변경은 git diff --cached로 확인합니다'], hint: '예제에서 git add 다음, git commit 전에 실행하는 명령입니다.', explanation: '`git diff --cached`는 커밋 준비 영역에 올린 변경을 보여 줍니다.' },
    application: { prompt: '파일을 `git add`한 뒤 아직 커밋하지 않은 staged 변경을 확인하는 명령은 무엇인가요?', correct: '`git diff --cached -- 파일경로`를 실행합니다.', correctWhy: '이 명령은 현재 커밋 준비 영역과 마지막 커밋 사이의 차이를 확인합니다.', wrong: ['`git diff -- 파일경로`만 실행합니다.', '`git commit -- 파일경로`를 실행합니다.'], wrongWhy: ['기본 git diff는 주로 아직 stage하지 않은 변경을 보여 줍니다.', 'commit은 변경 확인 명령이 아니라 커밋을 만드는 명령입니다.'], hint: '예제에서 diff 명령 뒤에 붙은 `--cached` 옵션을 보세요.' },
  },
};

const focusedJavaWeeksTwentyTwoToTwentyFourNotes = {
  '배열과 목록': {
    intro: '배열은 만든 뒤 길이를 바꿀 수 없고, ArrayList는 add로 원소를 추가할 수 있어요. 예제는 배열 길이 2와 목록 크기 3을 비교합니다.',
    concept: { prompt: '예제에서 fixedScores.length는 2이고 flexibleScores.size()는 3인 이유는 무엇인가요?', hint: '배열과 목록에 값을 몇 개 넣었는지 각각 세어 보세요.' },
    recall: { prompt: '배열 길이와 목록 크기를 출력하는 줄을 그대로 적으세요.', accepted: ['arrayLength=2, listSize=3'], hint: '배열에는 두 값을 넣고 목록에는 세 번 add를 호출합니다.', explanation: '배열 길이는 2로 유지되고 add를 세 번 호출한 목록 크기는 3입니다.' },
    application: { prompt: '강의 점수가 늘어날 수 있어 항목을 추가해야 한다면 어떤 자료 구조가 예제 요구에 맞나요?', correct: '`ArrayList` 같은 List를 사용해 add로 원소를 추가합니다.', correctWhy: '예제의 ArrayList는 원소를 추가할 수 있고 목록 크기가 함께 늘어납니다.', wrong: ['크기가 고정된 int 배열을 사용하고 기존 길이를 자동으로 늘립니다.', '배열을 사용하면 add 메서드가 자동으로 추가 공간을 만듭니다.'], wrongWhy: ['배열 길이는 생성 뒤 바뀌지 않아 새 배열을 만들고 복사해야 합니다.', '기본 배열에는 add 메서드가 없습니다.'], hint: '항목 추가 뒤에도 같은 자료 구조를 이어서 쓸 수 있는지 확인하세요.' },
  },
  '스택과 큐': {
    intro: 'ArrayDeque를 스택처럼 쓰면 마지막에 넣은 값을 먼저 꺼내고, 큐처럼 쓰면 먼저 기다린 값을 먼저 꺼냅니다. 예제는 push/pop과 addLast/removeFirst를 각각 사용해요.',
    concept: { prompt: '두 값을 넣은 뒤 stack.pop()과 queue.removeFirst()는 각각 어떤 문자열을 꺼내나요?', hint: '스택은 마지막 값부터, 큐는 먼저 들어온 값부터 꺼냅니다.' },
    recall: { prompt: '스택과 큐에서 꺼낸 값을 출력하는 줄을 그대로 적으세요.', accepted: ['stack=second, queue=first'], hint: 'second는 스택에 마지막으로 넣었고 first는 큐에 먼저 넣었습니다.', explanation: '스택은 `second`, 큐는 `first`를 먼저 꺼내므로 해당 줄이 출력됩니다.' },
    application: { prompt: '작업 취소 기능에서 가장 최근 작업을 먼저 되돌리려면 예제의 어떤 순서를 사용하나요?', correct: '스택처럼 push로 넣고 pop으로 꺼내 가장 최근 항목을 먼저 처리합니다.', correctWhy: '스택의 후입선출 순서는 가장 최근에 넣은 작업을 먼저 되돌리는 요구에 맞습니다.', wrong: ['큐처럼 먼저 넣은 작업부터 removeFirst로 꺼냅니다.', 'Deque에 넣기 전에 작업 이름을 가나다순으로 정렬합니다.'], wrongWhy: ['먼저 들어온 작업을 먼저 처리하는 순서라 가장 최근 작업이 먼저 나오지 않습니다.', '정렬은 최근 작업 순서라는 요구를 표현하지 않습니다.'], hint: '최근 기록을 먼저 취소하는 순서를 LIFO와 FIFO 중에서 고르세요.' },
  },
  '해시 기반 조회': {
    intro: 'Map.merge는 같은 키가 이미 있으면 기존 값과 새 값을 합칠 수 있어요. 이 예제는 java 방문을 두 번 세고, sql을 한 번 추가해요.',
    concept: { prompt: '두 번 merge한 java의 값과 Map에 들어 있는 서로 다른 키의 수는 각각 얼마인가요?', hint: 'java는 두 번, sql은 한 번 넣었지만 키 이름은 두 종류입니다.' },
    recall: { prompt: 'java 방문 수와 Map의 전체 키 수를 출력하는 줄을 그대로 적으세요.', accepted: ['java=2, keys=2'], hint: 'java의 값은 두 번 합산되고 키는 java와 sql입니다.', explanation: 'java의 값은 2이고 키는 java와 sql 두 개이므로 해당 줄이 출력됩니다.' },
    application: { prompt: 'HashMap의 빠른 조회를 설명할 때 정확한 표현은 무엇인가요?', correct: '해시가 키를 잘 분산하면 기본 조회가 평균적으로 상수 시간에 가깝지만 모든 입력에서 보장되는 것은 아닙니다.', correctWhy: 'HashMap 문서는 해시 함수가 항목을 잘 분산한다는 조건 아래 get·put의 상수 시간 성능을 설명합니다.', wrong: ['HashMap의 get은 키가 어떤 값이든 반드시 한 번의 비교만 합니다.', 'HashMap은 조회할 때마다 모든 키를 정렬합니다.'], wrongWhy: ['충돌과 해시 분포에 따라 비교 비용이 달라질 수 있습니다.', 'HashMap은 키를 정렬 상태로 보관한다고 보장하지 않습니다.'], hint: '평균적인 성능 설명에 붙는 해시 분포 조건을 포함하세요.' },
  },
  '정렬된 자료': {
    intro: 'Collections.sort는 전달한 목록 자체를 오름차순으로 바꿉니다. 이진 탐색 전에는 같은 순서 기준으로 정렬되어 있어야 하며, 예제에서 5는 인덱스 1에 있어요.',
    concept: { prompt: '정렬한 뒤 scores에서 5를 찾은 인덱스가 1인 이유는 무엇인가요?', hint: '정렬 결과 [3, 5, 8]에서 인덱스를 0부터 세어 보세요.' },
    recall: { prompt: '정렬된 점수 목록과 5의 위치를 출력하는 줄을 그대로 적으세요.', accepted: ['scores=[3, 5, 8], position=1'], hint: '정렬 뒤 5는 두 번째 원소입니다.', explanation: '정렬 결과에서 인덱스 0은 3, 1은 5, 2는 8입니다.' },
    application: { prompt: '목록을 정렬하지 않고 Collections.binarySearch를 호출하면 결과가 보장되나요?', correct: '아니요. 같은 기준으로 정렬되지 않은 목록에 대한 결과는 정의되어 있지 않습니다.', correctWhy: 'binarySearch의 전제는 지정한 자연 순서나 Comparator 순서로 목록이 정렬되어 있는 것입니다.', wrong: ['네. binarySearch가 호출할 때마다 목록을 먼저 자동 정렬합니다.', '네. List라면 정렬 상태와 관계없이 항상 정확한 인덱스를 돌려줍니다.'], wrongWhy: ['binarySearch는 목록을 정렬하지 않습니다.', '검색의 가운데 비교는 정렬된 순서가 있어야 버릴 범위를 판단할 수 있습니다.'], hint: '검색 전에 실제로 sort를 호출했는지 확인하세요.' },
  },
  '복잡도 비교': {
    intro: '예제는 8개 정렬 값에서 7을 찾을 때 선형 탐색의 비교 횟수 7과 이진 탐색의 비교 횟수 3을 셉니다. O(n)과 O(log n)은 입력 크기가 커질 때의 증가 경향을 나타내요.',
    concept: { prompt: '예제에서 target=7을 찾을 때 선형 탐색과 이진 탐색은 각각 몇 번 비교하나요?', hint: '선형 탐색은 1부터 7까지 훑고, 이진 탐색은 가운데부터 범위를 좁힙니다.' },
    recall: { prompt: '두 탐색의 비교 횟수와 증가 경향을 출력하는 줄을 그대로 적으세요.', accepted: ['linearChecks=7, binaryChecks=3, growth=O(n)/O(log n)'], hint: '예제의 비교 횟수 변수를 보고 마지막 growth 표기도 확인하세요.', explanation: '7은 오름차순 목록의 일곱 번째 값이라 선형 탐색은 7회, 이진 탐색은 3회 비교합니다.' },
    application: { prompt: '정렬된 목록의 크기를 8개에서 16개로 늘리고 가장 큰 값을 찾으면 이 예제 알고리즘의 비교 횟수는 각각 얼마인가요?', correct: '선형 탐색은 16회, 이진 탐색은 5회입니다.', correctWhy: '선형 탐색은 마지막 값까지 16개를 확인하고, 이진 탐색은 8·12·14·15·16을 비교해 5회에 찾습니다.', wrong: ['선형 탐색 8회, 이진 탐색 3회입니다.', '두 방식 모두 16회입니다.'], wrongWhy: ['입력 크기를 16개로 늘리면 선형 탐색은 최대 16개를 확인하고, 이진 탐색도 한 단계 더 필요합니다.', '이진 탐색은 비교할 범위를 절반씩 줄입니다.'], hint: '코드의 가운데 인덱스를 따라 1부터 16까지의 정렬 값을 직접 추적하세요.' },
  },
  '선형 탐색': {
    intro: '선형 탐색은 첫 원소부터 차례로 비교하므로 입력이 정렬되어 있지 않아도 사용할 수 있어요. 찾으면 true, 끝까지 없으면 false를 반환합니다.',
    concept: { prompt: '정렬되지 않은 values에서 contains(values, 7)과 contains(values, 5)는 어떤 값을 반환하나요?', hint: '목록의 값 4, 7, 2, 9를 순서대로 확인하세요.' },
    recall: { prompt: '값 7과 5의 검색 결과를 출력하는 줄을 그대로 적으세요.', accepted: ['contains7=true, contains5=false'], hint: '7은 두 번째 위치에 있고 5는 목록에 없습니다.', explanation: '7을 찾아 true를 반환하고, 5는 끝까지 확인해도 없어 false를 반환합니다.' },
    application: { prompt: '정렬할 수 없거나 목록이 작아 간단히 존재 여부만 확인할 때 선형 탐색을 쓸 수 있나요?', correct: '네. 정렬 전제 없이 처음부터 비교할 수 있지만, 최악에는 모든 원소를 확인해 O(n) 시간이 듭니다.', correctWhy: '선형 탐색은 정렬 순서를 이용하지 않고 각 원소를 순서대로 검사합니다.', wrong: ['아니요. 선형 탐색도 오름차순 정렬이 있어야 합니다.', '네. 목록 크기와 관계없이 항상 O(1)입니다.'], wrongWhy: ['정렬은 이진 탐색의 전제이며 선형 탐색에는 필요하지 않습니다.', '찾는 값이 없거나 마지막에 있으면 모든 원소를 확인해야 합니다.'], hint: '마지막 원소가 없을 때 몇 개를 비교해야 하는지 생각하세요.' },
  },
  '이진 탐색 전제': {
    intro: 'Collections.binarySearch는 정렬된 목록의 가운데를 확인하며 절반씩 검색 범위를 줄입니다. 예제 목록에서 5는 인덱스 2에 있어요.',
    concept: { prompt: '정렬된 목록 [1, 3, 5, 7, 9]에서 binarySearch가 돌려주는 5의 인덱스는 무엇인가요?', hint: '인덱스는 0부터 시작합니다.' },
    recall: { prompt: '찾기 여부와 인덱스를 출력하는 줄을 그대로 적으세요.', accepted: ['found=true, index=2'], hint: '목록의 세 번째 값이 5입니다.', explanation: '세 번째 원소의 인덱스는 2이므로 found는 true이고 index는 2입니다.' },
    application: { prompt: '목록이 정렬되어 있지 않다면 binarySearch의 반환값을 실제 위치로 믿어도 되나요?', correct: '아니요. 정렬 전제가 깨져 결과가 정의되지 않으므로 먼저 같은 기준으로 정렬하거나 선형 탐색을 써야 합니다.', correctWhy: '가운데 값보다 작거나 큰지를 근거로 절반을 제외하려면 정렬되어 있어야 합니다.', wrong: ['네. binarySearch는 unsorted 목록도 내부에서 정렬해 검색합니다.', '네. 정렬은 중복 값이 있을 때만 필요합니다.'], wrongWhy: ['Collections.binarySearch는 목록을 자동 정렬하지 않습니다.', '중복 여부와 무관하게 탐색 전 정렬이 필요합니다.'], hint: '목록을 정렬하지 않고 가운데 기준으로 한쪽을 버릴 근거가 있는지 살펴보세요.' },
  },
  '정렬 비교': {
    intro: 'Comparator.comparing(Course::title)은 Course 제목을 비교 기준으로 삼아요. 예제에서는 사전식 오름차순으로 Algorithms가 Java보다 먼저 옵니다.',
    concept: { prompt: 'Course 목록을 제목 오름차순으로 정렬할 때 Comparator.comparing(Course::title)이 지정하는 것은 무엇인가요?', hint: 'Course 전체가 아니라 어떤 값으로 순서를 정하는지 확인하세요.' },
    recall: { prompt: '제목 순으로 정렬한 목록의 콘솔 출력을 그대로 적으세요.', accepted: ['[Algorithms, Java]'], hint: 'A로 시작하는 Algorithms와 J로 시작하는 Java의 순서를 비교하세요.', explanation: '제목의 오름차순으로 정렬되어 `[Algorithms, Java]`가 출력됩니다.' },
    application: { prompt: '제목이 같은 Course 둘의 입력 순서를 정렬 후에도 유지하려면 Collections.sort의 어떤 특성을 이용할 수 있나요?', correct: '안정 정렬이므로 comparator 결과가 같은 원소는 서로의 기존 순서를 유지합니다.', correctWhy: 'Collections.sort는 안정 정렬을 보장해 비교 결과가 같은 원소끼리 순서를 바꾸지 않습니다.', wrong: ['Comparator는 같은 제목을 가진 원소를 자동으로 중복 제거합니다.', '정렬 뒤 같은 제목 원소의 순서는 무작위로만 정해집니다.'], wrongWhy: ['정렬은 목록 원소를 제거하지 않습니다.', '안정 정렬은 동등한 비교 결과의 상대 순서를 보존합니다.'], hint: 'Comparator의 결과가 0인 두 원소의 순서를 생각하세요.' },
  },
  '중복 값': {
    intro: 'binarySearch는 같은 값이 여러 개일 때 그중 어느 위치를 돌려줄지 보장하지 않아요. 예제의 목적은 찾았는지 확인하는 것이며 첫 위치를 찾는 것은 별도 요구입니다.',
    concept: { prompt: '목록에 2가 세 번 있을 때 Collections.binarySearch가 첫 번째 2의 인덱스를 반환한다고 보장하나요?', hint: 'API가 중복 원소 중 반환할 위치를 지정하는지 확인하세요.' },
    recall: { prompt: '중복된 2를 검색한 결과로 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['found=true'], hint: '코드는 인덱스가 아니라 검색 결과가 음수인지 아닌지만 확인합니다.', explanation: '2가 있으므로 binarySearch의 결과는 음수가 아니며 `found=true`가 출력됩니다.' },
    application: { prompt: '정렬 목록에서 값이 처음 나타나는 인덱스를 요구사항으로 반환하려면 무엇을 해야 하나요?', correct: 'binarySearch 결과를 첫 위치라고 가정하지 말고, 첫 원소의 위치를 찾는 하한 탐색을 구현하거나 검증해야 합니다.', correctWhy: '표준 binarySearch는 중복 원소 중 어느 위치를 반환할지 보장하지 않습니다.', wrong: ['binarySearch가 돌려준 인덱스는 언제나 첫 번째 위치입니다.', '목록에 중복이 있어도 검색 메서드가 자동으로 중복을 삭제합니다.'], wrongWhy: ['API 문서가 중복 값의 반환 위치를 특정하지 않습니다.', '검색 호출은 목록을 바꾸거나 원소를 삭제하지 않습니다.'], hint: '존재 확인과 첫 위치 반환은 서로 다른 함수 계약입니다.' },
  },
  '오프바이원 검사': {
    intro: '반복 조건이 index < end이므로 시작 인덱스는 포함하고 끝 인덱스는 제외합니다. startInclusive=1, end=4일 때 인덱스 1·2·3을 선택해요.',
    concept: { prompt: 'startInclusive가 1이고 end가 4일 때 선택 목록에 values[4]가 들어가지 않는 이유는 무엇인가요?', hint: '반복문의 조건이 <=인지 <인지 확인하세요.' },
    recall: { prompt: '선택한 값 목록을 출력하는 줄을 그대로 적으세요.', accepted: ['selected=[1, 2, 3]'], hint: '인덱스 1부터 3까지의 값을 순서대로 적으세요.', explanation: '반열린 구간 [1, 4)는 인덱스 1, 2, 3을 포함해 `[1, 2, 3]`을 만듭니다.' },
    application: { prompt: '목록 전체를 선택하려면 반열린 구간을 어떻게 지정해야 하나요?', correct: '시작을 0, 끝을 values.size()로 둡니다. 끝은 제외되지만 마지막 유효 인덱스까지 포함됩니다.', correctWhy: '유효한 목록 인덱스는 0부터 size()-1이므로 [0, size())가 전체 원소를 나타냅니다.', wrong: ['끝을 values.size()-1로 두고 <= 조건을 사용합니다.', '시작과 끝을 모두 values.size()로 둡니다.'], wrongWhy: ['끝 포함 조건은 경계를 다루는 기준을 바꾸어 다른 오류가 생기기 쉽습니다.', '빈 구간이 되어 원소를 선택하지 않습니다.'], hint: '시작 포함·끝 제외 규칙으로 첫 인덱스와 마지막 경계를 적으세요.' },
  },
  '기저 조건': {
    intro: '팩토리얼(1부터 n까지의 곱)은 음수를 거부하고 0이나 1에서 1을 반환해 재귀를 멈춥니다. 예제의 5는 120이고, long 범위를 넘는 계산은 예외로 알려요.',
    concept: { prompt: 'factorial(0)이 1을 반환해야 하는 이유는 무엇인가요?', hint: '재귀 호출을 멈추는 경우와 곱셈의 시작값을 함께 생각하세요.' },
    recall: { prompt: 'factorial(5)의 콘솔 출력을 그대로 적으세요.', accepted: ['factorial(5)=120'], hint: '5×4×3×2×1을 계산하세요.', explanation: '곱셈을 차례로 계산하면 5×4×3×2×1이 되어 결과는 120입니다.' },
    application: { prompt: 'factorial(-1)을 호출하면 예제는 어떻게 처리하나요?', correct: '계산을 시작하기 전에 IllegalArgumentException을 던져 음수 입력을 거부합니다.', correctWhy: '팩토리얼 입력은 음수가 아닌 정수라는 계약을 명시적으로 검사합니다.', wrong: ['음수도 1로 바꾸고 정상 결과를 반환합니다.', '기저 조건을 지나 무한히 양수를 곱합니다.'], wrongWhy: ['메서드는 음수를 무시하지 않고 예외를 던집니다.', 'n<0 조건에서 재귀 계산 전에 종료합니다.'], hint: 'n<0 검사와 n<=1 기저 조건의 실행 순서를 보세요.' },
  },
  '재귀 호출': {
    intro: 'sumTo는 현재 수와 그보다 하나 작은 수까지의 합을 더해 0까지 내려갑니다. 예제는 작은 입력 5를 사용하며, 큰 입력은 호출 스택 한계 때문에 반복문을 고려해야 해요. 음수는 거부합니다.',
    concept: { prompt: 'sumTo(5)가 15를 반환하는 재귀 관계는 무엇인가요?', hint: '현재 입력 n에 한 단계 작은 입력의 합을 더합니다.' },
    recall: { prompt: 'sumTo(5)의 콘솔 출력을 그대로 적으세요.', accepted: ['sumTo(5)=15'], hint: '5+4+3+2+1을 계산하세요.', explanation: '1+2+3+4+5를 더하면 결과는 15입니다.' },
    application: { prompt: 'sumTo(-1)을 호출했을 때 0을 돌려주는 것이 왜 잘못된 입력 처리인가요?', correct: '이 함수의 입력 계약은 0 이상의 정수이므로 음수를 정상 합계처럼 처리하지 말고 예외로 알려야 합니다.', correctWhy: '음수를 0과 같은 결과로 조용히 바꾸면 호출자가 잘못된 입력을 알아차리지 못합니다.', wrong: ['음수 합계는 정의되어 있지 않으므로 어떤 입력이든 0을 반환하는 편이 맞습니다.', 'sumTo(-1)은 음수에서 0으로 계속 감소해 종료 조건에 도달합니다.'], wrongWhy: ['현재 구현은 입력 계약을 명시해 음수를 거부하도록 수정합니다.', '음수에서 계속 감소하면 0에 도달하지 않아 재귀가 끝나지 않습니다.'], hint: '유효하지 않은 입력의 오류와 정상 합계 0을 구분하세요.' },
  },
  '스택 깊이': {
    intro: 'countDepth는 5에서 0까지 한 단계씩 내려가며 호출 수 5를 돌려줍니다. 음수는 종료 조건에 도달하지 못하므로 먼저 거부하고, 큰 입력의 안전한 최대 깊이는 실행 환경마다 달라요.',
    concept: { prompt: 'countDepth(-1)이 음수 검사 없이 실행되면 왜 종료되지 않나요?', hint: '각 재귀 호출에서 remaining 값이 어떤 방향으로 변하는지 보세요.' },
    recall: { prompt: '요청 깊이 5로 호출했을 때 콘솔 출력을 그대로 적으세요.', accepted: ['depth=5'], hint: '5, 4, 3, 2, 1에서 각각 한 단계씩 더하고 0에서 멈춥니다.', explanation: '다섯 번의 재귀 단계가 쌓여 `depth=5`를 출력합니다.' },
    application: { prompt: '큰 입력을 재귀로 처리해 StackOverflowError가 날 수 있다면 어떤 선택을 고려하나요?', correct: '요구 입력 크기를 확인하고 반복문이나 명시적 스택으로 바꾸는 방법을 검토합니다. 안전한 최대 재귀 깊이는 고정값으로 단정하지 않습니다.', correctWhy: '재귀 호출은 호출 스택을 사용하며 한계는 JVM과 실행 환경에 따라 달라집니다.', wrong: ['모든 JVM에서 안전한 최대 깊이가 정확히 100,000이라고 가정합니다.', 'StackOverflowError가 나면 계산 결과로 사용합니다.'], wrongWhy: ['재귀 깊이의 안전한 한계는 이식 가능한 고정 숫자로 보장되지 않습니다.', '오류는 정상 계산 결과가 아니라 호출 스택이 감당하지 못한 상태입니다.'], hint: '코드의 요청값과 런타임별 스택 한계를 구분하세요.' },
  },
  '분할 정복': {
    intro: 'search는 정렬된 배열 가운데를 확인하고 목표보다 작거나 큰 쪽의 절반을 버립니다. 값이 없으면 -1을 반환하며, 예제는 7의 인덱스 3을 찾아요.',
    concept: { prompt: 'search가 target보다 작은 가운데 값을 확인한 뒤 left를 middle+1로 바꾸는 이유는 무엇인가요?', hint: '오름차순 배열에서 가운데보다 왼쪽에 target이 있을 수 있는지 확인하세요.' },
    recall: { prompt: 'search(values, 7)의 결과로 콘솔에 출력되는 줄을 그대로 적으세요.', accepted: ['index=3'], hint: '배열의 인덱스는 0부터 시작합니다.', explanation: '배열의 네 번째 원소 7의 인덱스는 3입니다.' },
    application: { prompt: 'search가 정렬된 빈 배열을 받으면 무엇을 반환하나요?', correct: '-1을 반환합니다. 처음부터 left가 0, right가 -1이라 반복문이 실행되지 않습니다.', correctWhy: '검색 범위가 비어 있는 상태로 시작해 목표를 찾지 못한 반환 경로에 도달합니다.', wrong: ['인덱스 0을 반환합니다.', '배열 원소를 읽다가 반드시 ArrayIndexOutOfBoundsException이 발생합니다.'], wrongWhy: ['빈 배열에는 인덱스 0이 없습니다.', 'left<=right가 처음부터 false라 배열을 읽지 않습니다.'], hint: '배열 길이 0일 때 초기 left와 right를 계산하세요.' },
  },
  '반복으로 바꾸기': {
    intro: '반복문은 result에 2부터 n까지 곱한 값을 누적해 factorial(5)=120을 구합니다. Math.multiplyExact로 long 범위를 넘는 계산을 조용한 잘못된 값으로 만들지 않습니다.',
    concept: { prompt: '반복 버전에서 result를 1로 시작하고 각 value를 곱하는 이유는 무엇인가요?', hint: '팩토리얼의 곱셈을 누적할 초기값을 생각하세요.' },
    recall: { prompt: '반복문으로 계산한 factorial(5)의 콘솔 출력을 그대로 적으세요.', accepted: ['factorial(5)=120'], hint: 'result는 1에서 시작해 2, 3, 4, 5를 차례로 곱합니다.', explanation: '누적 결과는 1×2×3×4×5이므로 120입니다.' },
    application: { prompt: 'long 결과가 범위를 넘는 factorial 입력은 예제에서 어떻게 처리하나요?', correct: 'Math.multiplyExact가 곱셈 범위 초과를 감지해 ArithmeticException을 던집니다.', correctWhy: '일반 long 곱셈의 오버플로 값으로 계속 진행하지 않고 계산 실패를 알립니다.', wrong: ['long은 어떤 크기의 정수도 저장하므로 예외가 나지 않습니다.', '오버플로가 나면 Java가 자동으로 BigInteger로 바꿉니다.'], wrongWhy: ['long의 범위는 유한하며 곱셈은 그 범위를 넘을 수 있습니다.', 'long 연산이 자동으로 다른 자료형으로 전환되지는 않습니다.'], hint: '곱셈에 사용한 API가 오버플로를 검사하는지 확인하세요.' },
  },
};

function focusedWeekApplicationChoice(id, title, notes) {
  const { prompt, correct, correctWhy, wrong, wrongWhy, hint } = notes;
  const [, weekText, dayText] = id.match(/java-w(\d+)-d(\d+)/) ?? [];
  const answerIndex = weekText && dayText ? ((Number(weekText) - 1) * 5 + Number(dayText) - 1) % 3 : 1;
  const options = [
    [wrong[0], wrongWhy[0]],
    [correct, correctWhy],
    [wrong[1], wrongWhy[1]],
  ];
  const [correctOption] = options.splice(1, 1);
  options.splice(answerIndex, 0, correctOption);
  return choice(id, `${title} · 예제 적용`, prompt, options, answerIndex, hint, correctWhy);
}

const completeGitExample = `git add src/CourseService.java
git diff --cached -- src/CourseService.java
git commit -m "Extract validation rule"`;

// Day four is the repair day. These examples deliberately follow that day's
// stated skill, instead of reusing a week-wide example that can teach a
// different concept.
const dayFourRepairSpecs = [
  ['isReady', 'char status', 'boolean', "return status == 'Y';", "status[ \\t]*==[ \\t]*'Y'"],
  ['isWorkingAge', 'int age', 'boolean', 'return age >= 18 && age < 65;', 'age[ \\t]*>=[ \\t]*18[ \\t]*&&[ \\t]*age[ \\t]*<[ \\t]*65'],
  ['sumValues', 'int[] values', 'int', 'int total = 0; for (int index = 0; index < values.length; index++) { total += values[index]; } return total;', 'for[\\s\\S]*index[ \\t]*<[ \\t]*values\\.length[\\s\\S]*total[ \\t]*\\+=[\\s\\S]*return[ \\t]+total'],
  ['countWhenReady', 'boolean ready', 'int', 'if (ready) { int count = 1; return count; } return 0;', 'scope'],
  ['titleOf', 'Course course', 'String', 'return course.getTitle();', 'course\\.getTitle[ \\t]*\\([ \\t]*\\)'],
  ['sendNotification', 'Notifier notifier', 'void', 'notifier.send("ready");', 'notifier\\.send[ \\t]*\\([ \\t]*"ready"[ \\t]*\\)'],
  ['max', 'T left, T right', 'T', 'return left.compareTo(right) >= 0 ? left : right;', 'left\\.compareTo[ \\t]*\\([ \\t]*right[ \\t]*\\)[ \\t]*>=[ \\t]*0[ \\t]*\\?[ \\t]*left[ \\t]*:[ \\t]*right'],
  ['readFirstLine', 'java.io.BufferedReader reader', 'String', 'try (java.io.BufferedReader resource = reader) { return resource.readLine(); }', 'try[ \\t]*\\([ \\t]*java\\.io\\.BufferedReader[ \\t]+resource[ \\t]*=[ \\t]*reader[ \\t]*\\)[\\s\\S]*resource\\.readLine'],
  ['announce', 'java.util.function.Consumer<String> consumer', 'void', 'consumer.accept("ready");', 'consumer\\.accept[ \\t]*\\([ \\t]*"ready"[ \\t]*\\)'],
  ['names', 'java.util.List<Course> courses', 'java.util.List<String>', 'return courses.stream().map(Course::name).toList();', 'courses\\.stream[\\s\\S]*map[\\s\\S]*toList'],
  ['add', 'java.util.List<String> values, String value', 'void', 'synchronized (values) { values.add(value); }', 'synchronized[ \\t]*\\([ \\t]*values[ \\t]*\\)[\\s\\S]*values\\.add'],
  ['elapsedNanos', 'long started', 'long', 'return System.nanoTime() - started;', 'System\\.nanoTime[ \\t]*\\([ \\t]*\\)[ \\t]*-[ \\t]*started'],
  ['writeCourse', 'java.nio.file.Path path, String text', 'java.nio.file.Path', 'return java.nio.file.Files.writeString(path, text);', 'Files\\.writeString[ \\t]*\\([ \\t]*path[ \\t]*,[ \\t]*text[ \\t]*\\)'],
  ['toInstant', 'java.time.LocalDateTime time, java.time.ZoneId zone', 'java.time.Instant', 'return time.atZone(zone).toInstant();', 'time\\.atZone[ \\t]*\\([ \\t]*zone[ \\t]*\\)\\.toInstant'],
  ['toRequest', 'String title, int minutes', 'CourseRequest', 'return new CourseRequest(title, minutes);', 'new[ \\t]+CourseRequest[ \\t]*\\([ \\t]*title[ \\t]*,[ \\t]*minutes[ \\t]*\\)'],
  ['timeoutRequest', 'java.net.URI uri', 'java.net.http.HttpRequest', 'return java.net.http.HttpRequest.newBuilder(uri).timeout(java.time.Duration.ofSeconds(2)).GET().build();', 'HttpRequest\\.newBuilder[\\s\\S]*timeout[\\s\\S]*Duration\\.ofSeconds\\(2\\)[\\s\\S]*GET[\\s\\S]*build'],
  ['emptyList_returnsZero', '', 'void', 'assertEquals(0, sum(java.util.Collections.<Integer>emptyList()));', 'assertEquals[ \\t]*\\([ \\t]*0[ \\t]*,[ \\t]*sum[ \\t]*\\([ \\t]*java\\.util\\.Collections\\.<Integer>emptyList[ \\t]*\\([ \\t]*\\)[ \\t]*\\)[ \\t]*\\)'],
  ['find', 'java.util.Map<String, Course> courses, String id', 'java.util.Optional<Course>', 'return java.util.Optional.ofNullable(courses.get(id));', 'Optional\\.ofNullable[\\s\\S]*courses\\.get'],
  ['copyTags', 'java.util.List<String> tags', 'java.util.List<String>', 'return java.util.List.copyOf(tags);', 'List\\.copyOf[ \\t]*\\([ \\t]*tags[ \\t]*\\)'],
  ['redact', 'String token', 'String', 'return token == null || token.isEmpty() ? "(missing)" : "***";', 'return[ \\t]+token[ \\t]*==[ \\t]*null[ \\t]*\\|\\|[ \\t]*token\\.isEmpty[ \\t]*\\([ \\t]*\\)[ \\t]*\\?[ \\t]*"\\(missing\\)"[ \\t]*:[ \\t]*"\\*\\*\\*"'],
  ['isValidMinutes', 'int minutes', 'boolean', 'return minutes > 0;', 'minutes[ \\t]*>[ \\t]*0'],
  ['findSorted', 'java.util.List<Integer> values, int target', 'int', 'return java.util.Collections.binarySearch(values, target);', 'Collections\\.binarySearch[ \\t]*\\([ \\t]*values[ \\t]*,[ \\t]*target[ \\t]*\\)'],
  ['hasDuplicate', 'java.util.List<Integer> values', 'boolean', 'return new java.util.HashSet<>(values).size() != values.size();', 'new[ \\t]+java\\.util\\.HashSet<>[\\s\\S]*size[\\s\\S]*!=[\\s\\S]*values\\.size'],
  ['mergeCount', 'int leftCount, int rightCount', 'int', 'return Math.addExact(leftCount, rightCount);', 'Math\\.addExact[ \\t]*\\([ \\t]*leftCount[ \\t]*,[ \\t]*rightCount[ \\t]*\\)'],
  ['requirePositiveId', 'int id', 'int', 'if (id <= 0) throw new IllegalArgumentException("id"); return id;', 'if[ \\t]*\\([ \\t]*id[ \\t]*<=[ \\t]*0[ \\t]*\\)[\\s\\S]*IllegalArgumentException[\\s\\S]*return[ \\t]+id'],
  ['elapsedNanos', 'long started', 'long', 'return System.nanoTime() - started;', 'System\\.nanoTime[ \\t]*\\([ \\t]*\\)[ \\t]*-[ \\t]*started'],
];

const repairBehaviorCases = {
  1: { examples: [{ input: "isReady('Y')", output: 'true' }], tests: [{ input: "isReady('Y')", expected: 'true' }, { input: "isReady('N')", expected: 'false' }] },
  2: { examples: [{ input: 'isWorkingAge(30)', output: 'true' }], tests: [{ input: 'isWorkingAge(18)', expected: 'true' }, { input: 'isWorkingAge(65)', expected: 'false' }] },
  3: { examples: [{ input: 'sumValues(new int[] {2, 3})', output: '5' }], tests: [{ input: 'sumValues(new int[] {2, 3})', expected: '5' }, { input: 'sumValues(new int[0])', expected: '0' }] },
  4: { examples: [{ input: 'countWhenReady(true)', output: '1' }], tests: [{ input: 'countWhenReady(true)', expected: '1' }, { input: 'countWhenReady(false)', expected: '0' }] },
  5: { examples: [{ input: 'titleOf(new Course("Java"))', output: 'Java' }], tests: [{ input: 'titleOf(new Course("Java"))', expected: 'Java' }, { input: 'titleOf(new Course(""))', expected: '빈 문자열' }] },
  6: { examples: [{ input: 'sendNotification(notifier)', output: 'notifier.send("ready") 1회 호출' }], tests: [{ input: 'EmailNotifier 구현체', expected: 'send("ready") 1회 호출' }, { input: '다른 Notifier 구현체', expected: 'send("ready") 1회 호출' }] },
  7: { examples: [{ input: 'max("ant", "bee")', output: '"bee"' }], tests: [{ input: 'max(2, 5)', expected: '5' }, { input: 'max("bee", "ant")', expected: '"bee"' }] },
  8: { examples: [{ input: 'readFirstLine("Java\\n")', output: 'Java' }], tests: [{ input: 'readFirstLine("Java\\n")', expected: 'Java' }, { input: 'readFirstLine("")', expected: 'null' }] },
  9: { examples: [{ input: 'recording Consumer passed to announce', output: 'one accept("ready") call' }], tests: [{ input: 'announce(recordingConsumer)', expected: 'accept("ready") is called once' }, { input: 'announce(outputConsumer)', expected: 'ready is emitted once' }] },
  13: { examples: [{ input: 'writeCourse(path, "Java NIO")', output: 'writes Java NIO as UTF-8 and returns path' }], tests: [{ input: 'writeCourse(path, "Java NIO")', expected: 'file contains Java NIO and the same path is returned' }, { input: 'writeCourse(path, "")', expected: 'file is empty and the same path is returned' }] },
  14: { examples: [{ input: 'toInstant(LocalDateTime.of(2026, 10, 11, 9, 0), ZoneId.of("Asia/Seoul"))', output: '2026-10-11T00:00:00Z' }], tests: [{ input: 'toInstant(LocalDateTime.of(2026, 10, 11, 9, 0), ZoneId.of("Asia/Seoul"))', expected: '2026-10-11T00:00:00Z' }, { input: 'toInstant(LocalDateTime.of(2026, 10, 11, 9, 0), ZoneId.of("America/Los_Angeles"))', expected: '2026-10-11T16:00:00Z' }] },
  15: { examples: [{ input: 'toRequest("Java", 30)', output: 'CourseRequest[title=Java, minutes=30]' }], tests: [{ input: 'toRequest("Java", 30)', expected: 'CourseRequest[title=Java, minutes=30]' }, { input: 'toRequest("SQL", 20)', expected: 'CourseRequest[title=SQL, minutes=20]' }] },
  16: { examples: [{ input: 'timeoutRequest(uri).timeout()', output: 'PT2S' }], tests: [{ input: 'timeoutRequest(uri).timeout()', expected: 'PT2S' }, { input: 'timeoutRequest(uri).method()', expected: 'GET' }] },
  17: { examples: [{ input: 'sum(Collections.emptyList())', output: '0' }], tests: [{ input: 'sum(Collections.emptyList())', expected: '0' }, { input: 'sum(Arrays.asList(2, 3))', expected: '5' }] },
  18: { examples: [{ input: 'find(Map.of(), "sql")', output: 'Optional.empty' }], tests: [{ input: 'find(Map.of(), "sql")', expected: 'Optional.empty' }, { input: 'find(Map.of("java", course), "java")', expected: 'Optional.of(course)' }] },
  19: { examples: [{ input: 'construct CourseTags(source); source.clear()', output: 'values() still contains backend' }], tests: [{ input: 'construct CourseTags(source); source.clear()', expected: 'values() still contains backend' }, { input: 'tags.values().add("frontend")', expected: 'UnsupportedOperationException' }] },
  20: { examples: [{ input: 'redact("abc123")', output: '***' }, { input: 'redact(null)', output: '(missing)' }], tests: [{ input: 'redact("abc123")', expected: '***' }, { input: 'redact(null)', expected: '(missing)' }] },
  21: { examples: [{ input: 'isValidMinutes(30)', output: 'true' }], tests: [{ input: 'isValidMinutes(30)', expected: 'true' }, { input: 'isValidMinutes(0)', expected: 'false' }] },
  22: { examples: [{ input: 'findSorted([1, 3, 5, 7], 5)', output: '2' }], tests: [{ input: 'findSorted([1, 3, 5, 7], 5)', expected: '2' }, { input: 'findSorted([1, 3, 5, 7], 4)', expected: '-3 (삽입 위치 2)' }] },
  23: { examples: [{ input: 'hasDuplicate([1, 2, 2])', output: 'true' }], tests: [{ input: 'hasDuplicate([1, 2, 2])', expected: 'true' }, { input: 'hasDuplicate([1, 2, 3])', expected: 'false' }] },
  24: { examples: [{ input: 'mergeCount(8, 3)', output: '11' }], tests: [{ input: 'mergeCount(8, 3)', expected: '11' }, { input: 'mergeCount(0, 0)', expected: '0' }, { input: 'mergeCount(Integer.MAX_VALUE, 1)', expected: 'ArithmeticException' }] },
};

function repairQuestion(id, title, week) {
  const [methodName, parameters, returnType, solution, solutionBody] = dayFourRepairSpecs[week - 1];
  const throwsClause = week === 8 || week === 13 ? ' throws java.io.IOException' : '';
  const declaredReturnType = week === 7 ? '<T extends Comparable<T>> T' : returnType;
  const starterReturn = returnType === 'void' ? 'return;' : returnType === 'String' ? 'return "";' : returnType.startsWith('java.') || returnType === 'Path' || returnType === 'LocalDate' || returnType === 'CourseRequest' || returnType === 'T' ? 'return null;' : returnType === 'long' ? 'return 0L;' : returnType === 'int' ? 'return 0;' : 'return false;';
  const escapedParameters = parameters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[ \\t]+');
  const escapedSolution = solution.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[ \\t]+');
  const pattern = String.raw`^[ \t]*static[ \t]+${declaredReturnType}[ \t]+${methodName}[ \t]*\([ \t]*${escapedParameters}[ \t]*\)${throwsClause ? '[ \\t]+throws[ \\t]+java\\.io\\.IOException' : ''}[ \t]*\{[ \t\r\n]*${escapedSolution}[ \t\r\n]*\}[ \t]*$`;
  const starterBody = week === 4 ? 'if (ready) { int count = 1; } return count;' : week === 7 ? 'return left;' : starterReturn;
  const foundationPrompt = {
    1: '문자와 논리값 규칙에 맞춰 status가 문자 Y일 때만 true를 반환하고 다른 문자는 false가 되도록 `isReady`를 고치세요.',
    2: '논리 연산자 규칙에 맞춰 나이가 18 이상 65 미만일 때만 true가 되도록 `isWorkingAge`를 고치세요.',
    3: 'for 종료 조건 규칙에 맞춰 배열의 모든 정수를 더하고 빈 배열에는 0을 돌려주도록 `sumValues`를 고치세요.',
  }[week];
  const foundationHint = {
    1: 'char 값과 작은따옴표의 문자 Y를 비교한 결과를 그대로 반환하세요.',
    2: '두 경계를 모두 포함 여부에 맞게 쓰고, 나이 범위를 AND로 연결하세요.',
    3: '합계를 0에서 시작하고 index가 values.length보다 작은 동안 각 값을 더하세요.',
  }[week];
  const foundationExplanation = {
    1: '`status == \'Y\'`는 문자 값이 Y인지 검사해 boolean을 반환합니다. 다른 문자는 false예요.',
    2: '`age >= 18 && age < 65`는 18을 포함하고 65는 제외하는 구간을 표현합니다.',
    3: '합계를 0으로 초기화하고 인덱스 0부터 마지막 유효 인덱스까지 더하면 빈 배열은 0, 일반 배열은 모든 원소의 합을 반환해요.',
    9: '`consumer.accept("ready")`는 전달된 Consumer를 한 번 호출합니다. Consumer는 값을 반환하지 않으며 실제 콘솔 출력 여부는 전달한 구현에 달려 있어요.',
  }[week];
  const prompt = foundationPrompt ?? (week === 4
    ? `${title}에서 count를 선언된 블록 안에서 사용하도록 메서드를 고치세요.`
    : week === 7
      ? `${title}에서 두 제네릭 값 중 큰 값을 반환하도록 Comparable<T>의 compareTo를 사용해 고치세요.`
      : week === 8
        ? `${title}에서 첫 줄을 읽고 리소스를 자동으로 닫으며 IOException을 호출자에게 알리도록 메서드를 고치세요.`
        : week === 6
          ? `${title}에 따라 Notifier의 send 계약을 호출하도록 메서드를 고치세요.`
          : week === 9
            ? `${title}: 받은 Consumer에 "ready"를 정확히 한 번 전달하고 반환값은 만들지 않도록 고치세요.`
        : week === 5
            ? `${title}을 확인하고 Course의 getter로 제목을 반환하도록 메서드 본문을 고치세요.`
            : week === 15
              ? `${title}: 이미 선언된 CourseRequest record의 title과 minutes를 모두 전달해 새 DTO를 반환하세요.`
            : week === 16
              ? `${title}: 요청을 보낼 때 2초 제한이 실제 HttpRequest에 설정되도록 메서드를 고치세요.`
            : week === 17
              ? `${title}: 비어 있는 목록의 합이 0인지 확인하는 테스트 메서드를 완성하세요.`
            : week === 20
              ? `${title}: 토큰 원문을 로그에 노출하지 않도록 실제 값을 마스킹하고, 값이 없을 때는 안전한 표시를 반환하세요.`
            : `${title}에서 요구한 규칙을 만족하도록 메서드 본문을 고치세요.`);
  const hint = foundationHint ?? (week === 4
    ? 'count를 선언한 중괄호 블록과 그 값을 반환하는 위치를 확인하세요.'
    : week === 7
      ? 'Comparable<T>의 compareTo는 두 값의 순서를 음수·0·양수로 알려 줍니다.'
      : week === 8
        ? 'Java 8에서도 사용할 수 있는 try-with-resources 형태로 리소스를 선언하고, checked 예외를 메서드 시그니처에 반영하세요.'
        : week === 6
          ? 'Notifier가 약속한 메서드 이름과 매개변수를 확인하세요.'
          : week === 9
            ? 'Consumer<T>의 accept가 한 값을 받으며 void를 반환한다는 계약을 확인하세요.'
          : week === 15
            ? 'record 선언에 적힌 모든 구성 요소를 생성자 인자로 전달해야 합니다.'
          : week === 16
            ? 'connectTimeout은 연결 수립 제한이고, HttpRequest.Builder.timeout은 요청 전체의 응답 대기 제한입니다.'
          : week === 17
            ? '테스트 이름에는 입력 경계와 기대 결과를 담고, 본문에서 실제 값을 assertion과 비교하세요.'
          : week === 20
            ? '토큰 값 자체를 반환하거나 일부만 치환하지 마세요. null·빈 값과 실제 비밀값을 구분해 처리하세요.'
            : week === 22
              ? '목록은 같은 기준으로 정렬되어 있어야 하며, 찾지 못한 결과는 음수 삽입 위치 값입니다.'
              : week === 23
                ? 'HashSet은 중복 값을 한 번만 보관하므로 크기를 원래 목록과 비교하세요.'
                : week === 24
                  ? '일반 int 덧셈은 overflow를 확인하지 않으므로 Math.addExact를 사용하세요.'
          : `이 단원의 예제에서 ${methodName}이 처리해야 하는 입력·반환 규칙을 다시 확인해 보세요.`);
  const focusedRepairContent = {
    10: {
      prompt: 'collect와 toList: courses의 각 Course에서 name을 읽어 입력 순서를 유지한 List<String>으로 반환하도록 메서드를 고치세요. Course에는 name() 메서드가 있습니다.',
      explanation: '각 Course의 name을 map으로 읽고 Stream.toList()로 결과 목록을 만들어요. Stream.toList()는 Java 16부터 제공되고 반환 목록은 수정할 수 없습니다.',
    },
    11: {
      prompt: '동기화 범위: values에 value를 추가하는 호출이 values 객체를 잠금으로 사용하는 synchronized 블록 안에서 실행되도록 메서드를 고치세요.',
      explanation: '같은 values 객체를 잠금으로 삼아 add 호출을 보호합니다. 여러 경로에서 같은 목록에 접근한다면 모든 경쟁 접근이 이 잠금 규칙을 따라야 해요.',
    },
    12: {
      prompt: '프로파일링 질문: started 이후 경과한 나노초를 반환하도록 elapsedNanos 메서드를 고치세요. 이 시간 차이만으로 병목 위치를 알 수는 없습니다.',
      explanation: 'System.nanoTime()에서 시작 시각을 빼면 경과한 나노초를 구할 수 있어요. 이 메서드는 시간만 재며 병목 위치를 찾으려면 대표 실행을 프로파일링해야 합니다.',
    },
    13: {
      prompt: '파일 쓰기: path에 text를 UTF-8로 기록하고 사용한 Path를 반환하도록 writeCourse 메서드를 고치세요.',
      explanation: 'Files.writeString(path, text)는 기본 UTF-8로 문자열을 기록하고 path를 반환합니다. 상위 디렉터리 생성이나 오류 무시는 자동으로 하지 않아요.',
    },
    14: {
      prompt: 'ZoneId: 지정한 지역 시간대 규칙으로 time을 해석해 해당 순간을 Instant로 반환하도록 toInstant 메서드를 고치세요.',
      explanation: 'time.atZone(zone).toInstant()는 LocalDateTime에 지역 시간대 규칙을 적용한 뒤 타임라인의 순간을 반환합니다. 입력된 ZoneId가 날짜별 오프셋을 결정해요.',
    },
    15: {
      prompt: 'DTO의 역할(데이터 전달 객체): 강의 제목과 수업 시간을 모두 담아 새 CourseRequest를 반환하도록 메서드를 고치세요.',
      explanation: '`return new CourseRequest(title, minutes);`는 두 입력값을 새 DTO에 모두 담아 돌려줍니다. record 선언만으로 JSON 응답을 만들지는 않아요.',
    },
    18: {
      prompt: '명시적 계약: Map에 id가 있으면 해당 강의를 `Optional.of`로 감싸고, 없으면 `Optional.empty`를 반환하도록 find를 고치세요.',
      explanation: '`Optional.ofNullable(courses.get(id))`는 조회 결과가 있으면 그 값을 담고, 키가 없으면 빈 Optional을 돌려줘요. 호출자는 값이 없을 때도 안전하게 처리할 수 있습니다.',
    },
    19: {
      prompt: '방어적 복사: `List.copyOf(tags)`로 목록을 보관하세요. 호출자가 원본을 바꿔도 이 객체의 목록은 유지되고, 반환한 목록에는 항목을 추가할 수 없어야 합니다.',
      explanation: '`List.copyOf(tags)`는 원본과 분리된 변경 불가 목록을 만듭니다. 요소 객체 자체까지 깊게 복사하는 것은 아니며, 이 예제의 String 요소는 불변입니다.',
    },
    21: {
      prompt: '중복 제거: 여러 기능에서 재사용할 `isValidMinutes`를 완성하세요. 분이 0보다 클 때만 true를 반환해야 합니다.',
      explanation: '`minutes > 0`이라는 공통 규칙을 isValidMinutes 한 곳에 두면 두 호출 위치가 같은 판단을 사용하고 기준을 한 번에 바꿀 수 있어요.',
    },
    22: {
      prompt: '정렬된 자료 — 오름차순으로 정렬된 `values`에서 target의 인덱스를 반환하세요. 찾지 못하면 Collections.binarySearch가 정한 음수 삽입 위치 값을 그대로 반환합니다.',
      explanation: '`Collections.binarySearch`는 정렬된 목록에서 값을 찾고, 없으면 삽입 위치를 나타내는 음수 값을 돌려줍니다. 이 문제는 실제 실행 채점이 아니라 전체 메서드 구조만 확인합니다.',
    },
    23: {
      prompt: '중복 값 — values 안에 같은 정수가 두 번 이상 있으면 true, 모두 서로 다르면 false를 반환하도록 메서드를 고치세요.',
      explanation: 'HashSet에 값을 모았을 때 원소 수가 원래 목록 크기보다 작으면 중복이 있습니다. 빈 목록과 서로 다른 값만 있는 경우는 false입니다.',
    },
    24: {
      prompt: '분할 정복 — 왼쪽과 오른쪽 부분 문제에서 얻은 개수를 더해 반환하세요. int 범위를 넘으면 잘못된 값 대신 ArithmeticException을 던지세요.',
      explanation: '`Math.addExact`는 두 부분 결과를 합산하고 int 범위를 벗어나는 경우 예외를 던져 조용한 overflow를 막습니다. 이 메서드는 결과를 합치는 단계만 보여 주며 분할과 재귀 호출까지 구현하지는 않습니다.',
    },
  }[week];
  const behavior = repairBehaviorCases[week];
  return repairCode({
    id, title: `${title} 코드 수정`, prompt: focusedRepairContent?.prompt ?? prompt, language: 'Java',
    starterCode: `static ${declaredReturnType} ${methodName}(${parameters})${throwsClause} {\n    ${starterBody}\n}`,
    solutionPatterns: [pattern],
    acceptanceCriteria: {
      requirements: [`\`${solution}\` 규칙을 구현해요.`, '메서드 시그니처를 유지해요.'],
      constraints: ['입력 매개변수를 직접 변경하지 않아요.', '추가 입출력이나 전역 상태를 사용하지 않아요.'],
      examples: behavior?.examples ?? [{ input: `${methodName}(...)`, output: solution }],
      tests: behavior?.tests ?? [{ input: '대표 정상 입력', expected: solution }, { input: '경계 입력', expected: solution }],
    },
    gradingNote: '실행형 채점은 아니며, 메서드 전체 구조에서 요구한 코드 패턴만 확인해요. 반환값이나 부수 효과를 실제 실행해 검증하지는 않습니다. 공백과 선택 세미콜론은 허용합니다.',
    hint,
    explanation: foundationExplanation ?? focusedRepairContent?.explanation ?? `${solution}는 ${title}의 핵심 규칙을 코드로 표현합니다. 이 문제는 전체 메서드 구조만 확인하며, 코드를 실행하거나 모든 런타임 환경을 검증하지는 않아요.`,
  });
}

function newSession(week, day, title, objective) {
  const base = `java-w${week}-d${day}`;
  const knowledge = knowledgeFor(title, week);
  const [,,,, snippet, key] = knowledge;
  const focusedNotes = week <= 3
    ? focusedJavaFoundationNotes[title]
    : week <= 6 ? focusedJavaWeeksFourToSixNotes[title]
      : week <= 9 ? focusedJavaWeeksSevenToNineNotes[title]
        : week <= 12 ? focusedJavaWeeksTenToTwelveNotes[title]
          : week <= 15 ? focusedJavaWeeksThirteenToFifteenNotes[title]
      : week <= 18 ? focusedJavaWeeksSixteenToEighteenNotes[title]
        : week <= 21 ? focusedJavaWeeksNineteenToTwentyOneNotes[title]
          : week <= 24 ? focusedJavaWeeksTwentyTwoToTwentyFourNotes[title]
      : week >= 25 ? focusedWeekTwentyFiveToTwentySixNotes[title] : undefined;
  const focusedCatalogNotes = week <= 24 && Boolean(focusedNotes);
  const versionOverride = questionVersionOverrides[`${week}-${day}`] ?? {};
  const conceptVersion = versionOverride.choice ?? (focusedConceptOptions[`${week}-${day}`] ? 3 : focusedCatalogNotes ? 2 : 0);
  const shortVersion = versionOverride.short ?? (focusedCatalogNotes ? 2 : 0);
  const example = completeIntroExamples[title] ?? completeWeeksFourToSixExamples[title] ?? completeWeeksSevenToNineExamples[title] ?? completeWeeksTenToTwelveExamples[title] ?? completeWeeksThirteenToFifteenExamples[title] ?? completeWeeksSixteenToEighteenExamples[title] ?? completeWeeksNineteenToTwentyOneExamples[title] ?? completeWeeksTwentyTwoToTwentyFourExamples[title] ?? completeWeeksTwentyFiveToTwentySixExamples[title] ?? (week === 21 && day === 5 ? completeGitExample : snippet);
  const questions = [
    conceptChoice(`${base}-choice${conceptVersion ? `-v${conceptVersion}` : ''}`, title, knowledge, focusedNotes),
    day === 4
      ? repairQuestion(`${base}-repair${week <= 3 || week === 4 || week === 6 || week === 7 || week === 9 || week === 15 || week === 16 || week === 17 || week === 20 || week === 24 ? '-v2' : ''}`, title, week)
      : focusedNotes
        ? (() => {
          const prompt = focusedNotes.recall.prompt;
          const acceptedAnswers = focusedNotes.recall.accepted ?? [...new Set([key, ...(koreanRecallAliases[key] ?? []), title])];
          const hint = focusedNotes.recall.hint;
          const explanation = focusedNotes.recall.explanation ?? `정답은 \`${key}\`입니다. ${focusedNotes.intro}`;
          const outputQuestion = /(?:콘솔|화면|예제).{0,24}출력|출력(?:되는|하는|한) (?:값|한 줄|줄|문구|문자열|내용|결과)|(?:실행|호출) 결과.{0,12}(?:적|쓰)|반환값.{0,12}(?:적|쓰)|값이 반환|결과(?:를 받을 수 있나요|.*더해지나요)|그대로 적으세요/.test(prompt)
            && acceptedAnswers.some((answer) => /[A-Za-z]/.test(answer));
          const codeQuestion = /한 줄씩 적으세요/.test(prompt);
          const id = `${base}-short${shortVersion ? `-v${shortVersion}` : ''}`;
          const titleText = focusedCatalogNotes ? `${title} 이해 확인` : `${title} 핵심어`;
          return outputQuestion || codeQuestion
            ? versionedShortAnswer(id, titleText, prompt, acceptedAnswers, hint, explanation, 'case-sensitive')
            : shortAnswer(id, titleText, prompt, acceptedAnswers, hint, explanation);
        })()
        : recallQuestion(`${base}-short`, title, key, `${title} 예제에서 규칙·타입·API·연산을 나타내는 말을 적으세요.`),
    focusedNotes?.application
      ? focusedWeekApplicationChoice(`${base}-apply${focusedCatalogNotes ? '-v3' : '-v2'}`, title, focusedNotes.application)
      : applicationChoice(`${base}-apply${week <= 3 ? '-v3' : '-v2'}`, title, knowledge),
  ];
  return studySession(day, title, objective, focusedNotes?.intro ?? `${objective} 예제의 입력과 결과를 따라가며 핵심 규칙을 확인하고, 마지막에는 적용 범위와 다음 복습 대상을 정리합니다.`, example, questions, week === 21 && day === 5 ? 'Git' : undefined);
}

function legacyAdditions(week, title, days) {
  const lessonId = legacyLessonIds[week - 1];
  const sessions = days.map((dayTitle, index) => {
    const day = index + 1;
    const count = day <= 3 ? 2 : 3;
    const session = newSession(week, day, dayTitle, `${title}의 ${dayTitle} 규칙을 설명하고 작은 예제에 적용해요.`);
    // Legacy questions already occupy days 1–3. Only these additions are
    // exported; the integration layer combines them into three-question days.
    return studySession(day, session.title, session.objective, session.intro, session.example, session.exercises.slice(0, count));
  });
  return {
    week,
    phaseId: phaseFor(week),
    lessonId,
    title,
    objective: weekPlans[week - 1][1],
    intro: weekIntros[week - 1],
    example: sessions[0].example,
    points: [],
    sessions,
  };
}

const existingWeeks = Object.fromEntries(weekPlans.slice(0, 12).map(([title, objective, days], index) => {
  const value = legacyAdditions(index + 1, title, days);
  return [value.lessonId, value];
}));

const reviewedDayObjectives = {
  25: [
    '요구를 입력·규칙·출력으로 나누어 빠진 조건을 찾습니다.',
    '사용자와 개발자가 함께 쓰는 도메인 용어를 코드 이름과 모델에 반영합니다.',
    '메서드의 입력·반환값·실패 조건을 호출자가 알 수 있게 정합니다.',
    '잘못된 입력을 어떤 결과나 예외로 알릴지 정하고 구현에 반영합니다.',
    '정상·경계·실패 입력과 각 기대 결과를 테스트 사례로 작성합니다.',
  ],
  26: [
    '입력 목록에서 조건과 연산을 거쳐 결과가 만들어지는 순서를 추적합니다.',
    '같은 입력으로 문제를 재현하고 기대 결과와 실제 결과를 비교합니다.',
    '자료 구조나 구현 방식을 요구와 비용에 따라 선택합니다.',
    '성능 가설을 지표와 측정 조건으로 구체화하고 측정의 한계를 구분합니다.',
    '틀린 문제와 막힌 이유를 돌아보고 다음 복습 주제를 정합니다.',
  ],
};

const lessons = weekPlans.slice(12).map(([title, objective, days], offset) => {
  const week = offset + 13;
  const sessions = days.map((dayTitle, index) => newSession(
    week,
    index + 1,
    dayTitle,
    reviewedDayObjectives[week]?.[index] ?? `${title}에서 ${dayTitle}의 목적과 경계를 설명해요.`,
  ));
  return weeklyLesson({
    id: `java-week-${week}-${slug(title)}`,
    topicId: topicFor(week),
    week,
    title,
    objective,
    intro: weekIntros[week - 1],
    points: [],
    example: sessions[0].example,
    sessions,
    difficulty: week <= 16 ? '중급' : week <= 21 ? '고급' : '실전',
  });
});

export const javaCourseExpansion = {
  phases,
  lessonOrder: [...legacyLessonIds, ...lessons.map((lesson) => lesson.id)],
  existingWeeks,
  lessons,
  reviewedWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
};
