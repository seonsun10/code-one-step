import { choice, shortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { kotlinReviewedOpeningWeeks } from './curriculum-kotlin-w1-w3-reviewed.js';
import { kotlinReviewedMiddleWeeks } from './curriculum-kotlin-w4-w6-reviewed.js';
import { kotlinReviewedCollectionWeeks } from './curriculum-kotlin-w7-w9-reviewed.js';
import { kotlinReviewedSafetyWeeks } from './curriculum-kotlin-w10-w12-reviewed.js';
import { kotlinReviewedDesignWeeks } from './curriculum-kotlin-w13-w15-reviewed.js';
import { kotlinReviewedAdvancedWeeks } from './curriculum-kotlin-w16-w18-reviewed.js';
import { kotlinReviewedConcurrencyWeeks } from './curriculum-kotlin-w19-w21-reviewed.js';
import { kotlinReviewedAndroidWeeks } from './curriculum-kotlin-w22-w24-reviewed.js';
import { kotlinReviewedComposeWeeks } from './curriculum-kotlin-w25-w27-reviewed.js';
import { kotlinReviewedArchitectureWeeks } from './curriculum-kotlin-w28-w30-reviewed.js';
import { kotlinReviewedCapstoneWeek } from './curriculum-kotlin-w31-reviewed.js';

const reviewedWeeks = {
  ...kotlinReviewedOpeningWeeks,
  ...kotlinReviewedMiddleWeeks,
  ...kotlinReviewedCollectionWeeks,
  ...kotlinReviewedSafetyWeeks,
  ...kotlinReviewedDesignWeeks,
  ...kotlinReviewedAdvancedWeeks,
  ...kotlinReviewedConcurrencyWeeks,
  ...kotlinReviewedAndroidWeeks,
  ...kotlinReviewedComposeWeeks,
  ...kotlinReviewedArchitectureWeeks,
  ...kotlinReviewedCapstoneWeek,
};

// Kotlin and Android snippets are for code-reading practice; this static site
// does not compile Kotlin, build APKs, or run an Android emulator.
const phases = [
  { id: 'kotlin-phase-language', stage: 1, title: 'Kotlin 문법과 실행 흐름', weeks: [1, 2, 3, 4, 5], objective: '값·조건·반복과 Kotlin 프로그램의 기초를 익혀요.' },
  { id: 'kotlin-phase-functions', stage: 2, title: '함수와 컬렉션', weeks: [6, 7, 8, 9, 10], objective: '함수·람다·목록·집합·키와 값의 연결을 익히고 목록 변경 방식을 구분해요.' },
  { id: 'kotlin-phase-types', stage: 3, title: '안전한 타입과 객체 설계', weeks: [11, 12, 13, 14, 15, 16, 17], objective: '널 안전성·객체·제네릭·Java 상호운용을 배워요.' },
  { id: 'kotlin-phase-concurrency', stage: 4, title: '오류·코루틴·테스트', weeks: [18, 19, 20, 21, 22], objective: '오류·구조화 동시성·Flow·테스트의 경계를 살펴봐요.' },
  { id: 'kotlin-phase-android', stage: 5, title: 'Android와 Jetpack Compose', weeks: [23, 24, 25, 26, 27], objective: 'Android 수명 주기와 Compose의 상태 기반 화면을 익혀요.' },
  { id: 'kotlin-phase-practice', stage: 6, title: '앱 구조·품질·실전 설계', weeks: [28, 29, 30, 31], objective: '데이터·접근성·성능·검증을 묶어 앱을 설계해요.' },
];

// Each day: topic, illustrative snippet, accurate rule, common misconception,
// and a practical consequence. Snippets are not represented as executed.
const weeks = [
  ['Kotlin 첫걸음', 'Kotlin 코드와 실행 대상의 차이를 알아봐요.', [
    ['Kotlin의 활용 대상', 'Kotlin source → JVM / Android / Native / JS', 'Kotlin은 여러 실행 대상에 사용할 수 있어요.', 'Kotlin은 Android 앱에서만 실행돼요.', '대상마다 이용할 수 있는 API와 배포 방식이 달라요.'],
    ['main 진입점', 'fun main() { println("Hello") }', '일반 JVM 콘솔 프로그램은 main에서 시작할 수 있어요.', '모든 Kotlin 함수 이름은 main이어야 해요.', '앱 프레임워크는 별도의 진입 흐름을 관리해요.'],
    ['문장과 표현식', 'val total = 2 + 3', 'Kotlin의 여러 구문은 값을 만드는 표현식이에요.', '세미콜론이 있어야만 문장이 끝나요.', '표현식 결과를 놓치면 다음 계산을 잘못 추적해요.'],
    ['주석', '// 한 줄 주석\n/** API 문서 */', '주석은 실행되지 않고 코드를 설명해요.', '주석의 문장은 컴파일러가 참이라고 보증해요.', '주석과 구현이 다르면 잘못된 사용을 유도해요.'],
    ['Kotlin과 JVM', 'Kotlin source → bytecode → JVM', 'Kotlin/JVM은 JVM 위에서 Java와 상호운용할 수 있어요.', 'Kotlin 파일은 Java와 같은 문법으로 읽혀요.', '언어 문법과 공통 플랫폼을 혼동해 코드를 잘못 이해해요.'],
  ]],
  ['값·변수·타입 추론', '재할당과 타입 선언을 구별해요.', [
    ['val과 var', 'val name = "Kotlin"\nvar count = 1', 'val은 재할당하지 않는 이름, var는 재할당할 수 있는 이름이에요.', 'val은 참조한 객체까지 깊게 불변으로 만들어요.', '참조 재할당과 객체 내부 변경을 따로 봐야 해요.'],
    ['타입 추론', 'val count = 3  // Int', '초깃값에서 타입을 추론할 수 있어요.', '실행 중 값마다 변수 타입이 바뀌어요.', '타입에 맞지 않는 값은 컴파일 단계에서 거부돼요.'],
    ['명시적 타입', 'val title: String = "학습"', '콜론 뒤에 타입을 적어 의도를 명시할 수 있어요.', 'String 변수에 숫자를 넣으면 자동 변환돼요.', '필요한 타입 변환을 별도로 표현해야 해요.'],
    ['지역 변수 초기화', 'var score: Int\nscore = 10', '지역 변수는 읽기 전에 값이 초기화되어야 해요.', '선언만 한 지역 변수는 자동으로 0이에요.', '초기화가 보장되지 않으면 컴파일 오류가 나요.'],
    ['컴파일 상수', 'const val MAX_RETRIES = 3', 'const val은 컴파일 시점 상수 조건을 만족해야 해요.', 'const val에는 실행 중 계산한 아무 객체나 넣을 수 있어요.', '조건에 맞지 않는 값은 일반 val 등으로 선언해야 해요.'],
  ]],
  ['숫자·문자·문자열', '기본 타입과 변환의 의미를 알아봐요.', [
    ['정수 타입', 'val count: Int = 12\nval big = count.toLong()', '숫자 타입 변환이 필요하면 toLong처럼 명시해요.', 'Int 값은 더 넓은 숫자 타입으로 자동 변환돼요.', '암묵 변환을 가정하면 타입 오류가 발생해요.'],
    ['정수 범위', 'val next = Int.MAX_VALUE + 1', '고정 폭 정수는 범위를 넘을 때 오버플로할 수 있어요.', 'Int는 넘치는 순간 자동으로 BigInteger가 돼요.', '큰 누적값은 Long 등 적합한 타입을 골라야 해요.'],
    ['부동소수점', 'val price = 0.1 + 0.2', '일부 십진수는 이진 부동소수점으로 정확히 표현되지 않아요.', 'Double은 모든 십진 계산을 정확히 표현해요.', '금액 계산은 정밀도와 반올림 규칙을 별도로 정해야 해요.'],
    ['Char와 String', "val letter: Char = 'K'\nval word: String = \"Kotlin\"", 'Char는 문자 하나, String은 문자열을 나타내요.', '작은따옴표와 큰따옴표는 같은 타입을 만들어요.', '문자열과 문자 연산을 혼동해 타입 오류가 날 수 있어요.'],
    ['문자열 템플릿', 'val name = "Mina"\nval greeting = "안녕, $name"', '문자열 템플릿은 달러 기호 뒤 이름이나 중괄호 표현식을 넣어요.', '문자열 안의 이름은 표시 없이 자동으로 치환돼요.', '연결과 보간을 잘못 이해하면 화면에 값이 아닌 문법이 보여요.'],
  ]],
  ['조건식과 when', '조건 표현식과 분기 범위를 다뤄요.', [
    ['if 표현식', 'val label = if (score >= 60) "통과" else "도전"', 'if는 두 분기에서 값을 반환하는 표현식으로 쓸 수 있어요.', '값을 만드는 if는 else가 없어도 돼요.', '분기 결과가 빠지면 값을 정할 수 없어요.'],
    ['논리 연산', 'if (age >= 14 && consent) "가능" else "확인"', '&&와 ||는 Boolean을 결합하고 오른쪽 평가를 건너뛸 수 있어요.', '논리 연산은 양쪽 조건을 항상 모두 실행해요.', '건너뛸 수 있는 곳에 부수 효과를 넣으면 동작이 달라져요.'],
    ['when 표현식', 'val grade = when (score) { in 90..100 -> "A"; else -> "확인" }', 'when은 값·범위·조건에 따라 분기할 수 있어요.', 'when은 숫자만 비교할 수 있어요.', '요구와 맞지 않는 항목을 쓰면 상태가 빠질 수 있어요.'],
    ['포함 범위', 'val passed = score in 60..100', '.. 범위는 시작값과 끝값을 포함해요.', '60..100은 양쪽 경계값을 제외해요.', '경계 조건이 달라져 합격 기준을 잘못 적용해요.'],
    ['Boolean 엄격성', 'if (active) "사용 중" else "중지"', '조건식은 Boolean 값이어야 해요.', '숫자 0과 1은 false와 true로 자동 변환돼요.', '조건 타입을 놓치면 의도한 분기를 표현하지 못해요.'],
  ]],
  ['반복문과 범위', '반복 종료 조건과 인덱스를 확인해요.', [
    ['for 순회', 'for (name in names) { println(name) }', 'for는 컬렉션이나 범위의 원소를 차례로 순회해요.', 'Kotlin for는 C 스타일 증감식이 필수예요.', '잘못된 반복 문법이나 인덱스 계산은 범위 오류를 만들어요.'],
    ['until 경계', 'for (i in 0 until items.size) { /* read */ }', 'until은 시작은 포함하고 끝은 제외해요.', '0 until size는 size 인덱스도 포함해요.', '마지막 원소 다음 인덱스를 읽을 수 있어요.'],
    ['downTo와 step', 'for (n in 10 downTo 2 step 2) { /* work */ }', 'downTo는 감소 범위, step은 간격을 지정해요.', 'step은 반복 방향을 자동으로 뒤집어요.', '방향과 간격이 맞지 않아 예상한 횟수만큼 반복하지 않아요.'],
    ['while 종료', 'while (i < items.size) { i++ }', 'while은 조건이 참인 동안 반복하므로 상태 갱신을 확인해요.', '반복 변수 변경 없이도 while은 알아서 끝나요.', '종료 조건이 바뀌지 않아 무한 반복할 수 있어요.'],
    ['인덱스와 원소', 'for ((i, item) in items.withIndex()) { /* use */ }', 'withIndex는 원소와 인덱스를 함께 제공해요.', '컬렉션 인덱스는 항상 1부터 시작해요.', '인덱스 기준을 잘못 잡아 다른 원소를 선택할 수 있어요.'],
  ]],
  ['함수와 반환값', '함수 계약과 반환 표현식을 익혀요.', [
    ['함수 계약', 'fun double(value: Int): Int = value * 2', '함수 선언은 매개변수 타입과 반환 타입을 표현해요.', '함수는 매개변수 타입과 무관하게 아무 값이나 받을 수 있어요.', '호출자가 잘못된 값을 전달해 타입 계약을 깨요.'],
    ['표현식 본문', 'fun double(value: Int) = value * 2', '한 표현식의 결과를 반환하는 함수는 = 본문을 쓸 수 있어요.', '= 본문에도 return을 반드시 적어요.', '본문 문법을 섞으면 함수 선언이 올바르지 않아요.'],
    ['기본 인자', 'fun greet(name: String, prefix: String = "안녕하세요")', '기본 인자는 호출부에서 생략할 수 있는 값을 제공해요.', '기본 인자는 함수 전체에 전역 상태를 만들어요.', '기본값을 잘못 정하면 생략한 호출의 의미가 바뀌어요.'],
    ['이름 있는 인자', 'greet(prefix = "반가워요", name = "Mina")', '이름 있는 인자는 호출부에서 각 값의 매개변수를 보여 줘요.', '이름 있는 인자는 타입 검사를 끄는 문법이에요.', '매개변수 이름·값이 맞지 않으면 호출 계약을 어겨요.'],
    ['Unit 반환', 'fun logTitle(title: String): Unit { println(title) }', 'Unit은 의미 있는 반환 데이터가 없는 함수의 결과예요.', 'Unit은 숫자 0처럼 계산할 수 있어요.', '호출 결과가 필요하다면 별도 반환값을 설계해야 해요.'],
  ]],
  ['람다와 고차 함수', '함수 값을 전달하고 람다 매개변수를 읽어요.', [
    ['람다', 'val add = { a: Int, b: Int -> a + b }', '람다는 함수 값을 간결하게 표현해요.', '중괄호 코드는 항상 클래스 선언이에요.', '함수 값과 문장 블록을 혼동해 콜백을 잘못 전달해요.'],
    ['고차 함수', 'fun apply(x: Int, action: (Int) -> Int) = action(x)', '함수를 인자로 받거나 반환하면 고차 함수예요.', '함수 타입 값은 문자열처럼 호출할 수 없어요.', '입력·출력 계약을 어기면 타입 오류가 나요.'],
    ['it 매개변수', 'names.map { it.uppercase() }', '매개변수가 하나인 간단한 람다에서 it을 쓸 수 있어요.', '중첩된 모든 람다의 it은 늘 같은 값을 가리켜요.', '대상을 헷갈려 잘못된 객체를 처리할 수 있어요.'],
    ['후행 람다', 'names.filter { name -> name.isNotBlank() }', '마지막 매개변수가 함수 타입이면 람다를 괄호 밖에 쓸 수 있어요.', '후행 람다를 쓰면 다른 필수 인자도 생략돼요.', '필수 매개변수 누락으로 호출할 수 없어요.'],
    ['변수 캡처', 'var total = 0\nvalues.forEach { total += it }', '람다는 바깥 변수의 값을 캡처할 수 있어요.', '캡처한 가변 변수는 여러 스레드에서 자동 안전해요.', '동시 변경에 동기화가 없으면 결과가 틀어질 수 있어요.'],
  ]],
  ['List·Set·Map', 'List·Set·Map에 여러 값을 담는 방법과 차이를 구별해요.', [
    ['List 순서', 'val lessons = listOf("변수", "함수", "클래스")', 'List는 순서가 있는 원소 모음을 나타내요.', '모든 List는 중복 원소를 자동 제거해요.', '중복이 의미 있는 데이터를 잃을 수 있어요.'],
    ['Set 중복', 'val tags = setOf("Kotlin", "Android")', 'Set은 중복을 허용하지 않는 원소 모음이에요.', 'Set은 인덱스로 접근하는 List와 같은 구조예요.', '순서나 위치를 기대하면 잘못된 자료 구조예요.'],
    ['Map 키', 'val scores = mapOf("Mina" to 90)', 'Map은 키를 통해 값에 접근하는 자료 구조예요.', 'Map 값은 정수 인덱스로만 조회돼요.', '키의 존재 여부를 빠뜨려 값이 없을 때를 놓쳐요.'],
    ['map 변환', 'val lengths = names.map { it.length }', 'map은 원소를 바꾼 새 결과 목록을 만들어요.', 'map은 원본 목록을 언제나 직접 수정해요.', '새 결과를 사용하지 않아 변환이 반영되지 않아요.'],
    ['filter 조건', 'val active = users.filter { it.enabled }', 'filter는 조건을 만족하는 원소만 결과에 남겨요.', 'filter는 조건이 거짓인 원소를 선택해요.', '조건 방향이 반대여서 보여 줄 데이터가 누락돼요.'],
  ]],
  ['읽기 전용 목록과 Sequence', 'List로 읽는 것과 목록을 직접 바꾸는 일을 구분해요. Sequence는 결과가 필요할 때 항목을 처리해요.', [
    ['List와 MutableList', 'val view: List<Int> = listOf(1, 2)\nval edit = mutableListOf(1, 2)', 'List는 이 참조에서 변경 API를 제공하지 않고 MutableList는 제공해요.', 'List 타입이면 다른 별칭을 통한 변경도 막혀요.', '같은 원본을 공유하면 화면 데이터가 바뀔 수 있어요.'],
    ['읽기 전용의 한계', 'val source = mutableListOf(1)\nval view: List<Int> = source', '읽기 전용 타입은 참조 API를 제한하지만 깊은 불변은 보장하지 않아요.', 'source를 바꿔도 view 내용은 고정돼요.', '가변 별칭이 수정해 화면·계산 결과가 달라져요.'],
    ['새 목록 생성', 'val next = oldList + item', '+는 기존 참조 대신 결과 컬렉션을 만들 수 있어요.', 'next를 만들면 oldList 자체가 수정돼요.', '결과값을 저장하지 않아 변경이 사라져요.'],
    ['Sequence 지연', 'items.asSequence().filter { it.active }.take(5).toList()', 'Sequence 연산은 최종 결과가 요청될 때 처리를 지연할 수 있어요.', 'Sequence는 모든 중간 목록을 즉시 만들어 둬요.', '실행 시점과 순서를 틀리게 예상해요.'],
    ['성능과 선택', 'items.filter { it.active }.map { it.name }', '작은 자료엔 List가 단순하고 큰 연쇄 처리엔 Sequence를 측정해 비교할 수 있어요.', 'Sequence는 어떤 입력에서도 무조건 더 빨라요.', '근거 없는 최적화가 코드만 복잡하게 만들어요.'],
  ]],
  ['값이 없을 때의 처리', 'null(값 없음)을 허용하는 타입과 안전한 접근 방법을 익혀요.', [
    ['null을 허용하는 타입', 'val nickname: String? = null', 'String?은 문자열이나 null을 담고, String은 문자열만 담아요.', 'Kotlin의 String에는 null을 자유롭게 넣을 수 있어요.', 'null일 때를 처리하지 않으면 타입 오류나 실행 중 오류가 생길 수 있어요.'],
    ['안전 호출', 'val length = nickname?.length', '?.는 왼쪽이 null이면 뒤의 속성 접근을 건너뛰고 null을 돌려줘요.', '안전 호출은 null을 빈 문자열로 바꿔요.', '결과가 null일 때를 처리하지 않으면 다음 단계에서 문제가 생길 수 있어요.'],
    ['null일 때 대체값 사용', 'val label = nickname ?: "학습자"', '?:는 왼쪽이 null일 때만 오른쪽 값을 선택해요.', '?:는 빈 문자열과 모든 오류도 대체해요.', 'null과 빈 문자열을 같은 상태로 다루면 값의 의미를 잃어요.'],
    ['!!로 null 아님을 단언', 'val size = nickname!!.length', '!!는 값이 null이 아니라고 강제하며, 실제 null이면 예외가 나요.', '!!는 실행 중 값을 안전하게 확인해 줘요.', '외부 값이 null이면 앱 작업이 중단될 수 있어요.'],
    ['목록과 목록 속 null', 'val names: List<String?> = listOf("Mina", null)', '목록 자체가 null일 수 있는 경우와 목록 안의 값이 null일 수 있는 경우는 달라요.', 'List<String?>과 List<String>?은 같은 타입이에요.', '물음표가 붙은 위치를 놓치면 다른 대상을 검사하게 돼요.'],
  ]],
  ['타입 확인과 입력 검증', '값의 실제 타입을 확인하고 외부에서 받은 입력을 따로 검증해요.', [
    ['is 검사', 'if (value is String) value.length else 0', 'is 검사에 성공하면 그 안에서 컴파일러가 타입을 좁혀 문자열 기능을 쓸 수 있어요(스마트 캐스트).', 'is는 문자열 업무 규칙까지 검증해요.', '형식만 맞는 잘못된 값이 다음 계층에 전달돼요.'],
    ['검사 뒤 타입을 좁혀 쓰기', 'if (item != null) item.title.length', '값이 검사 뒤에도 바뀌지 않는다고 판단되면 컴파일러가 null이 아닌 값으로 다뤄 줘요.', '모든 var 속성은 다른 코드가 바꿀 수 있어도 안전하게 좁혀져요.', '검사 뒤 값이 바뀔 수 있으면 안전한 접근을 보장하기 어려워요.'],
    ['안전 변환 as?', 'val title = value as? String', 'as?는 변환 실패 시 예외 대신 null을 반환해요.', 'as?는 어떤 값도 문자열로 바꿔요.', '실패 결과를 처리하지 않으면 데이터가 빠져요.'],
    ['숫자 문자열 확인', 'val count = raw.toIntOrNull()', '숫자로 바꿀 수 없는 문자열에는 null이 돌아와요.', 'toIntOrNull은 잘못된 입력을 0으로 바꿔요.', '실패와 실제 0을 구분하지 못해요.'],
    ['타입과 업무 규칙 확인', 'val email = raw.trim()\nif (email.contains("@")) { /* format */ }', '값의 타입 확인과 업무 규칙 검사는 별도로 해야 해요.', 'String 타입이면 이메일 형식과 실제 수신 가능 여부까지 확인돼요.', '제대로 확인하지 않은 입력이 저장되거나 요청에 쓰일 수 있어요.'],
  ]],
  ['클래스와 프로퍼티', '생성자·초기화·접근 범위를 읽어요.', [
    ['생성자에서 프로퍼티 만들기', 'class Course(val title: String)', '클래스 이름 뒤 괄호에서 val을 붙인 값은 객체의 프로퍼티로 저장돼요.', 'val이나 var가 없어도 모든 생성자 값이 객체의 프로퍼티가 돼요.', '무엇이 저장되고 외부에 보이는지 혼동할 수 있어요.'],
    ['init 초기화', 'class Member(val age: Int) { init { require(age >= 0) } }', 'init은 새 객체를 만들 때 실행돼요.', 'init은 앱에서 클래스 선언 때 한 번 실행돼요.', '객체 생성 시 조건 검사를 놓쳐 잘못된 상태가 생겨요.'],
    ['읽을 때 계산하는 getter', 'val label: String get() = title.uppercase()', 'getter는 프로퍼티 값을 읽을 때 계산을 실행할 수 있어요.', 'getter 결과는 별도 선언 없이 자동 저장돼요.', '비용 큰 계산이 반복 실행될 수 있어요.'],
    ['private 접근 제한', 'private val token: String', 'private은 지정한 범위 밖에서 프로퍼티에 직접 접근하지 못하게 해요.', 'private은 값을 암호화해 다른 도구가 읽지 못하게 해요.', '접근 범위가 잘못되면 내부 상태를 원하지 않게 공개할 수 있어요.'],
    ['나중에 초기화하는 lateinit', 'lateinit var repository: Repository', 'lateinit은 String 같은 null을 허용하지 않는 객체 타입의 var를 나중에 초기화할 때 써요.', 'lateinit은 읽을 때 기본 객체를 만들어 줘요.', '초기화 전에 읽으면 예외가 발생해요.'],
  ]],
  ['값과 상태를 표현하는 타입', '학습자·학습 내용·진행 상태를 Kotlin 타입으로 나타내요.', [
    ['값 비교용 data class', 'data class Lesson(val id: String, val title: String)', '선언할 때 이름 뒤 괄호에 적은 값으로 기본 비교·출력·복사를 만들어요.', '클래스 본문에 적은 값도 기본 비교와 복사에 들어가요.', '같은 학습자나 학습 내용인지 잘못 판단할 수 있어요.'],
    ['data class 복사', 'val next = lesson.copy(title = "함수")', 'copy는 일부 값을 바꾼 새 객체를 만들고 나머지는 원본 값을 사용해요.', 'copy는 안에 든 목록과 객체까지 모두 따로 복사해요.', '원본과 복사본이 같은 목록을 함께 바꿀 수 있어요.'],
    ['얕은 복사', 'data class Notebook(val pages: MutableList<String>)', 'copy()는 객체만 새로 만들고 안에 든 목록은 원본과 함께 쓸 수 있어요.', 'copy()는 안에 든 목록까지 모두 따로 복사해요.', '복사본에서 바꾼 목록 항목이 원본에도 나타날 수 있어요.'],
    ['enum 상태', 'enum class Status { READY, DONE }', 'enum은 미리 정한 상태를 나타내요. 저장할 번호는 선언 순서와 따로 정할 수 있어요.', 'enum은 입력될 때마다 새로운 상태를 만들어요.', '정해지지 않은 상태를 다루는 방법을 놓칠 수 있어요.'],
    ['sealed 상태와 ID', 'sealed interface LoadState\n@JvmInline value class UserId(val value: String)', 'sealed는 정해진 상태를 다루고 value class는 학습자 ID를 일반 문자열과 구분해요.', 'value class는 ID 형식과 계정 존재 여부까지 자동 확인해요.', '새 상태 처리를 빠뜨리거나 다른 문자열을 ID로 잘못 넘길 수 있어요.'],
  ]],
  ['상속과 기능 조합', '클래스를 이어받아 기능을 바꾸는 방법과 객체를 조합하는 방법을 배워요.', [
    ['상속 기본값', 'class Course', '클래스는 기본으로 상속할 수 없어요.', 'Kotlin 클래스는 처음부터 누구나 상속할 수 있어요.', '예상하지 못한 하위 클래스가 내부 동작에 기대게 돼요.'],
    ['open과 override', 'open class Screen\nclass CourseScreen : Screen()', '상속을 허용하고 함수를 다시 정의할 때 필요한 표시를 알아봐요.', '하위 클래스는 모든 함수를 자동으로 다시 정의해요.', '열리지 않은 함수를 다시 정의하려 해 컴파일 오류가 나요.'],
    ['인터페이스', 'interface Refreshable { fun refresh() }', '인터페이스는 클래스가 제공해야 할 기능을 정해요.', '인터페이스는 값 저장과 객체 생성을 대신해요.', '필요한 기능을 구현하지 않아 오류가 날 수 있어요.'],
    ['객체 조합', 'class Service(private val repository: Repository)', '필요한 객체를 전달받아 상속 없이 기능을 함께 쓸 수 있어요.', '기능을 다시 쓰려면 반드시 상속해야 해요.', '클래스 사이 결합이 커져 바꾸거나 시험하기 어려워져요.'],
    ['by로 기능 맡기기', 'class CachedRepo(source: Repository) : Repository by source', 'by는 직접 만들지 않은 인터페이스 기능을 다른 객체에 맡겨요.', 'by는 함수를 원격 서버로 자동 전송해요.', '어느 객체가 실제 기능을 처리하는지 놓칠 수 있어요.'],
  ]],
  ['확장 함수와 객체 처리', '확장 함수와 let·apply·run이 값을 다루는 방법을 살펴봐요.', [
    ['확장 함수', 'fun String.firstLetter() = first()', '확장 함수는 원본 클래스를 고치지 않고 점 표기법으로 기능을 더해요.', '확장 함수가 원래 클래스의 private 값에 접근해요.', '실제 멤버로 오해해 접근 권한과 동작을 잘못 판단할 수 있어요.'],
    ['어떤 함수가 선택될까', 'fun CharSequence.label() = "글"', '실제 멤버가 있으면 멤버가 먼저 선택되고 확장끼리는 변수에 적힌 타입을 따라요.', '확장은 실행 중 실제 객체 종류를 보고 자동으로 바뀌어요.', '기대한 함수와 다른 결과가 나올 수 있어요.'],
    ['null과 빈 문자열', 'fun String?.displayName() = this ?: "(이름 없음)"', '?.와 ?:는 null을 확인하며 빈 문자열은 따로 확인해야 해요.', '빈 문자열은 자동으로 null과 같아져요.', '빈 값과 값이 없는 상태를 구분하지 못해요.'],
    ['let으로 값 계산하기', 'user?.let { value -> value.name }', 'let은 값을 받아 중괄호 안 마지막 계산 결과를 돌려줘요.', 'let은 입력 객체를 그대로 돌려줘요.', '결과 값이나 null일 때의 흐름을 잘못 예상해요.'],
    ['apply와 run', 'val config = Config().apply { enabled = true }', 'apply는 설정한 객체를, run은 중괄호 안 마지막 값을 돌려줘요.', 'apply와 run은 언제나 같은 값을 돌려줘요.', '다음 코드가 받을 객체나 결과를 잘못 예상해요.'],
  ]],
  ['여러 자료형에 맞춰 타입 지키기', '여러 자료형에 같은 함수를 쓰고, 값을 읽거나 받는 안전한 방향을 배워요.', [
    ['여러 자료형에 쓰는 함수', 'fun <T> first(items: List<T>): T = items.first()', '자료형이 달라도 같은 함수 틀을 재사용해요.', 'T는 모든 값을 자동 변환하는 Any 별칭이에요.', '캐스트 실패나 잘못된 타입 가정을 만들어요.'],
    ['Box가 값의 자료형을 지켜요', 'class Box<T>(val value: T)', 'Box<String>에는 문자열을, Box<Int>에는 정수를 담아요.', 'Box는 생성 후 모든 타입으로 바뀔 수 있어요.', '대입·반환에서 타입 불일치가 생겨요.'],
    ['문자열을 더 넓은 자료형으로 읽기', 'interface Source<out T> { fun next(): T }', 'out은 T를 반환값으로 내보내기만 해요.', 'out T는 T를 아무 입력 매개변수로 받아도 돼요.', '안전하지 않은 쓰기를 허용할 수 없어요.'],
    ['넓은 입력을 받는 처리기 재사용', 'interface Sink<in T> { fun accept(value: T) }', 'in은 T를 입력으로 받아 처리하게 해요.', 'in T는 T의 하위 타입만 반환한다는 뜻이에요.', '대입 방향을 틀려 타입 안전성을 깨뜨려요.'],
    ['원소 자료형을 모르는 목록 읽기', 'fun inspect(items: MutableList<*>) { /* safe reads */ }', 'MutableList<*>는 원소 자료형을 모를 때 안전하게 읽도록 도와요.', '별표 표기에는 아무 자료형의 값이나 넣어도 돼요.', '검증되지 않은 쓰기로 런타임 타입 오류가 나요.'],
  ]],
  ['Java와 함께 쓸 때 null 안전성', 'Java 반환값의 null 처리와 Kotlin 2.4 업데이트의 기능 상태를 확인해요.', [
    ['Java에서 받은 값과 null', 'val title: String? = provider.getTitle()', 'null일 수 있는 Java 반환값은 Kotlin에서 호출한 곳이 안전하게 처리해요.', 'Java가 String을 반환한다고 선언했으므로 null을 줄 수 없어요.', '예상하지 못한 null이 실행 중 오류를 만들어요.'],
    ['Java의 @Nullable 표시', '@Nullable String getTitle()', '@Nullable은 Kotlin에 null일 수 있음을 알려 주지만 공백이나 형식은 따로 검사해야 해요.', '어노테이션이 실제 반환값을 자동으로 검사해요.', '표시와 실제 값이 다르면 예상하지 못한 오류가 날 수 있어요.'],
    ['Kotlin 버전 숫자 읽기', 'Kotlin 2.4.0 언어 기능 → Kotlin 2.4.21 버그 수정', '2.4.0은 언어 기능을 추가한 업데이트고 2.4.21은 같은 2.4 계열의 버그 수정판이에요.', '버그 수정 업데이트마다 새 문법이 모두 추가돼요.', '컴파일러·Gradle·Android 플러그인 호환성을 따로 확인하지 않으면 빌드가 실패할 수 있어요.'],
    ['함수에 필요한 값 미리 적기', 'context(logger: Logger) fun audit() = logger.write("기록")', '함수 선언에 필요한 문맥 값을 적는 기능은 정식 지원하지만 일부 호출 문법은 아직 실험 중이에요.', 'Kotlin 2.4의 모든 문맥 관련 문법이 정식 지원돼요.', '실험 중인 문법을 설정 확인 없이 쓰면 빌드가 실패할 수 있어요.'],
    ['대괄호로 목록 만들기', 'val topics = ["Kotlin", "Android"]', 'Kotlin 2.4의 대괄호 목록 표기는 실험 중이며 listOf는 안정적으로 쓸 수 있어요.', '2.4.21에서는 2.4의 모든 실험 문법이 정식 지원돼요.', '필요한 설정 없이 새 문법을 쓰면 빌드가 실패할 수 있어요.'],
  ]],
  ['오류를 나누고 알맞게 처리하기', '입력 오류·앱 상태·취소·일시적 연결 문제를 구분해요.', [
    ['오류가 나도 마지막에 할 일', 'val n = try { raw.toInt() } catch (e: NumberFormatException) { 0 }', 'try와 catch가 결과값을 정하고 finally는 성공·실패와 관계없이 마지막에 실행돼요.', 'catch를 비우면 예외가 자동 복구돼요.', '오류를 숨기면 잘못된 값이 계속 전파돼요.'],
    ['잘못된 입력과 준비 안 된 상태', 'require(page > 0)\ncheck(repositoryReady)', 'require는 호출한 값, check는 작업을 시작할 수 있는 현재 상태를 확인해요.', 'require와 check는 네트워크 재시도 기능이에요.', '예외와 사용자 안내 정책을 별도로 정해야 해요.'],
    ['성공·실패 상태를 빠짐없이 처리하기', 'sealed interface LoadState', '정해 둔 결과 상태를 모두 나열하면 when에서 빠진 경우를 확인할 수 있어요.', '성공 값만 있으면 실패 상태도 자동 표현돼요.', '호출부가 오류나 빈 상태를 처리하지 못해요.'],
    ['오류를 결과값으로 다루기', 'val result = runCatching { parse(raw) }', 'Result는 성공·실패를 값으로 담지만 복구 정책은 호출자가 정해요.', 'runCatching은 모든 오류를 자동 복구해요.', '취소 예외까지 삼켜 작업 흐름을 깨뜨릴 수 있어요.'],
    ['오류 종류에 맞게 대응하기', 'when (state) { is Error -> showRetry(); else -> showContent() }', '입력·권한·네트워크 오류는 각각 다른 안내와 복구가 필요해요.', '모든 오류에 같은 재시도 버튼이면 안전해요.', '재시도할 수 없는 작업을 반복해 자원을 낭비해요.'],
  ]],
  ['코루틴 기초', '멈췄다가 이어지는 함수와 작업의 결과·실행 위치를 구분해요.', [
    ['멈췄다가 이어지는 함수 (suspend)', 'suspend fun load(): List<Lesson>', 'suspend는 코루틴 함수가 중간에 멈췄다가 이어질 수 있음을 표시해요.', 'suspend는 호출마다 새 스레드를 만들어요.', '실행 위치를 오판해 화면을 막을 수 있어요.'],
    ['작업을 묶고 완료까지 기다리기 (coroutineScope)', 'coroutineScope { launch { repository.refresh() } }', 'coroutineScope는 안에서 시작한 작업을 묶고 모두 끝날 때까지 기다려요.', 'scope 안에서 시작한 작업은 앱 종료 뒤에도 영구 실행돼요.', '작업 수명과 취소가 맞물리지 않아 일이 누락되거나 남아요.'],
    ['결과 없는 작업 시작하기 (launch)', 'scope.launch { repository.refresh() }', 'launch는 작업 완료·취소를 다룰 Job을 돌려주며 계산 결과는 반환하지 않아요.', 'launch는 최종 데이터 값을 반환해요.', '결과·오류를 전달할 별도 상태 계약이 필요해요.'],
    ['작업 결과 기다려 받기 (async·await)', 'val task = scope.async { loadCount() }\nval n = task.await()', 'async는 나중에 받을 결과를 만들고 await는 그 결과를 기다려요.', 'await 없이도 실패가 항상 즉시 전달돼요.', '오류와 취소의 전파 시점을 잘못 예상해요.'],
    ['실행 위치 바꾸기 (Dispatcher)', 'withContext(Dispatchers.IO) { blockingRead() }', 'Dispatcher는 코루틴이 실행될 스레드나 스레드 묶음을 정해요.', '모든 suspend 함수는 자동으로 IO에서 실행돼요.', '기다리는 작업이 화면을 막거나 실행 자원을 오래 점유할 수 있어요.'],
  ]],
  ['작업 수명과 취소 관리', '관련된 작업의 시작·완료·취소 관계를 설계해요.', [
    ['부모와 자식', 'coroutineScope { launch { refresh() } }', '구조화된 동시성은 자식 작업을 부모 scope 수명에 연결해요.', '모든 scope 작업은 앱 종료 뒤에도 영구 실행돼요.', 'scope 수명이 맞지 않아 작업 누락 또는 누수가 생겨요.'],
    ['긴 계산 중 취소 확인하기', 'ensureActive()', 'CPU 계산 반복문은 취소를 자동으로 확인하지 않으므로 중간에 확인해야 해요.', 'CPU 반복은 취소 요청을 자동으로 즉시 감지해요.', '취소 요청 뒤에도 작업이 계속 CPU를 사용할 수 있어요.'],
    ['취소 신호와 일반 오류 구분하기', 'catch (e: CancellationException) { throw e }', 'CancellationException은 취소 신호라 성공값으로 바꾸지 말고 다시 전달해요.', '취소 예외를 성공값으로 바꾸어도 부모 취소가 유지돼요.', '부모가 취소한 자식 작업이 불필요하게 남아요.'],
    ['화면 수명에 맞는 작업 관리 (viewModelScope)', 'viewModelScope.launch { repository.refresh() }', 'viewModelScope는 화면 정보를 관리하는 ViewModel의 수명에 연결돼요.', 'ViewModel 작업은 프로세스 종료 뒤에도 보장돼요.', '앱을 닫아도 계속되어야 하는 작업은 별도 설계가 필요해요.'],
    ['작업에 시간 제한 두기', 'withTimeoutOrNull(1_000) { load() }', '시간 제한을 넘긴 작업은 취소하고 정해진 결과로 알려야 해요.', '시간 제한이 지나도 작업은 끝날 때까지 계속 실행돼요.', '시간 초과와 정상 결과를 구분하지 못해요.'],
  ]],
  ['Flow와 화면 상태', '값을 만드는 시점과 최신 상태·일회성 알림의 차이를 알아봐요.', [
    ['수집할 때 값을 만드는 흐름 (Flow)', 'val titles: Flow<List<String>> = observeTitles()', '기본 Flow는 값을 받기 시작할 때마다 안의 코드를 실행해요.', 'Flow 변수를 만들면 값이 자동 방출돼요.', '값을 받기 시작하지 않아 화면에 새 값이 오지 않아요.'],
    ['Flow 값 바꾸고 받아 보기 (map·collect)', 'flow.map { it.size }.collect { render(it) }', 'map은 보내는 값을 바꾸고 collect는 값을 받아 처리하기 시작해요.', 'Flow 연산을 적는 순간 언제나 즉시 실행돼요.', '작업을 받는 범위가 맞지 않아 누락되거나 불필요하게 계속 받을 수 있어요.'],
    ['가장 최근 화면 상태 보관 (StateFlow)', 'val uiState: StateFlow<UiState>', 'StateFlow는 현재 상태를 보관하고 새로 받기 시작한 쪽에 최신 상태를 전해요.', 'StateFlow는 과거 이벤트를 모두 무제한 저장해요.', '상태와 알림을 섞어 알림이 중복되거나 빠져요.'],
    ['여러 곳에 알림 보내기 (SharedFlow)', 'MutableSharedFlow<Event>(replay = 0)', 'SharedFlow는 값을 여러 구독자에게 전달하며 다시 보낼 이전 값과 임시 보관량을 설정해요.', '구독자가 없어도 모든 과거 값이 무조건 저장돼요.', '구독 시점과 다시 보내는 값의 개수에 따라 이벤트를 놓칠 수 있어요.'],
    ['화면이 보일 때만 값 받기', 'repeatOnLifecycle(Lifecycle.State.STARTED)', 'repeatOnLifecycle은 화면이 보이는 동안 수집하고, 숨겨지면 멈췄다가 다시 보일 때 재시작해요.', '화면이 안 보여도 모든 Flow를 영구 수집해야 해요.', '불필요한 작업이 배터리와 네트워크를 사용해요.'],
  ]],
  ['코루틴 테스트', '가상 시간과 아직 사용법이 바뀔 수 있는 테스트 기능을 구분해요.', [
    ['runTest', 'runTest { assertEquals(1, repository.load()) }', 'runTest는 코루틴을 제어할 테스트 문맥에서 실행해요.', 'runTest가 실제 Android 기기와 네트워크도 검사해요.', '외부 시스템을 대체하지 않아 테스트가 느리고 불안정해져요.'],
    ['가상 시간', 'advanceTimeBy(1_000)', '테스트 scheduler 시간을 움직여 지연 작업을 확인할 수 있어요.', '가상 시간이 기기 전체 시스템 시계를 변경해요.', '실제 대기에 의존하면 테스트가 느려져요.'],
    ['테스트 dispatcher', 'Dispatchers.setMain(testDispatcher)', 'Main dispatcher를 대체해 ViewModel 작업을 제어할 수 있어요.', '테스트 dispatcher가 프로덕션 설정도 자동 변경해요.', '테스트와 실제 환경 차이를 놓칠 수 있어요.'],
    ['Flow 검증', 'awaitItem() → assertEquals(expected, actual)', '방출값·오류·완료 시점을 나눠 검사해요.', '첫 값이 맞으면 이후 상태도 모두 맞아요.', '중간 갱신과 종료 문제를 놓쳐요.'],
    ['테스트 층', 'unit test + UI test + device test', '단위·화면·플랫폼 검사는 서로 다른 위험을 확인해요.', '가짜 저장소 단위 테스트가 실제 권한 동작까지 보장해요.', '기기 수명 주기·권한 오류가 출시 뒤 드러나요.'],
  ]],
  ['Android 프로젝트', '모듈·Manifest·SDK 버전과 도구를 살펴봐요.', [
    ['모듈과 자원', 'app module → source sets → manifest/resources', 'Android 프로젝트는 모듈과 빌드 설정으로 소스와 자원을 관리해요.', '설정은 Kotlin 코드 한 파일에서 자동 추론돼요.', '모듈 설정이 틀리면 소스·자원이 빌드에서 빠져요.'],
    ['Manifest', '<application android:label="학습 노트" />', 'Manifest는 앱 구성요소와 메타데이터를 선언해요.', 'Manifest 권한 선언만으로 런타임 허용도 끝나요.', '권한이 필요한 기능이 거부될 수 있어요.'],
    ['compileSdk와 targetSdk', 'compileSdk = 37; targetSdk = 37', 'compileSdk는 참조 API, targetSdk는 호환 동작에 관련돼요.', 'targetSdk 갱신은 새 OS 기기 테스트를 대신해요.', '동작 변경을 검토하지 않아 호환 문제가 나요.'],
    ['Android 17 API', 'Android 17 · API level 37', '2026-10-14 공식 확인 기준 Android 17은 API 37 안정판이에요.', 'Android 17은 아직 일반 공개 전 베타예요.', '미리보기 기능을 안정 API로 오해해 호환이 깨져요.'],
    ['Studio와 emulator', 'Android Studio → Gradle → emulator/device', '실제 앱 빌드·기기 검증에는 Android 개발 도구가 필요해요.', '정적 학습 사이트가 APK와 기기 동작을 검사해요.', '실행하지 않은 앱을 검증 완료로 오해해요.'],
  ]],
  ['Activity 수명 주기', '화면 재생성과 저장 위치를 구분해요.', [
    ['Activity 콜백', 'onCreate → onStart → onResume', 'Activity는 상태 변화에 따라 수명 주기 콜백을 거쳐요.', 'Activity 인스턴스는 앱 설치부터 삭제까지 하나예요.', '화면 재생성 뒤 임시 상태가 사라질 수 있어요.'],
    ['구성 변경', 'configuration change → recreate/adapt', '회전 등 구성 변경에 UI와 리소스를 맞춰야 해요.', '회전은 모든 앱에서 상태 변화 없이 끝나요.', '입력 상태가 초기화되거나 작업이 중복돼요.'],
    ['ViewModel', 'ViewModel → screen state and events', 'ViewModel은 화면 재생성 사이 업무 상태를 유지하는 데 쓸 수 있어요.', 'ViewModel은 프로세스 종료 뒤에도 데이터를 저장해요.', '프로세스 복구가 안 되어 기록이 사라질 수 있어요.'],
    ['SavedStateHandle', 'savedStateHandle["query"] = query', '작고 복원 가능한 UI 상태를 보존하는 데 활용할 수 있어요.', 'SavedStateHandle은 큰 DB나 파일 저장소를 대체해요.', '용량·수명 한계를 넘으면 상태 복원이 실패해요.'],
    ['영구 데이터 계층', 'UI → ViewModel → repository → local storage', '장기 보존 데이터는 화면 수명과 다른 저장소에 둬야 해요.', '메모리 변수만으로 앱 재실행 뒤 기록이 돌아와요.', '프로세스 종료 후 사용자 기록을 잃어요.'],
  ]],
  ['Compose UI 기초', 'Composable과 선언형 화면 업데이트를 익혀요.', [
    ['Composable', '@Composable fun Greeting() { Text("안녕") }', 'Composable은 Compose UI를 선언하는 함수예요.', 'Composable은 최초 한 번만 호출돼요.', '재구성 때 본문 부수 효과가 중복될 수 있어요.'],
    ['선언형 UI', 'CourseCard(title = state.title)', '현재 상태를 바탕으로 화면을 기술해요.', '화면 객체를 한 번 바꾸면 상태 변화가 자동 반영돼요.', '상태 갱신이 없어 낡은 내용이 표시돼요.'],
    ['Modifier', 'Text("학습", modifier = Modifier.padding(16.dp))', 'Modifier는 배치·그리기·입력 등 UI 동작을 연결해요.', 'Modifier 순서는 레이아웃에 영향이 없어요.', '순서 차이로 크기·터치 영역이 달라져요.'],
    ['재구성', 'state update → recomposition', 'Compose는 상태 변화에 필요한 UI 설명을 다시 실행해요.', '재구성은 언제나 앱 전체를 처음부터 만들어요.', '비싼 작업이 반복되어 프레임 지연이 생겨요.'],
    ['effect 분리', 'LaunchedEffect(userId) { load(userId) }', 'effect API와 키가 작업 수명·재실행 조건을 나타내요.', 'Composable 본문에서 네트워크 요청을 매번 해도 돼요.', '재구성마다 중복 요청이 발생해요.'],
  ]],
  ['Compose 상태와 이벤트', '상태 끌어올리기와 단방향 흐름을 배워요.', [
    ['remember', 'var open by remember { mutableStateOf(false) }', 'remember는 현재 composition 동안 재구성 사이 값을 기억해요.', 'remember 값은 재부팅 뒤에도 자동 저장돼요.', '화면이 다시 만들어질 때 필요한 값이 사라져요.'],
    ['rememberSaveable', 'var query by rememberSaveable { mutableStateOf("") }', '저장 가능한 작은 UI 값을 복원 과정에서 보존할 수 있어요.', '모든 사용자 기록을 DB처럼 영구 저장해요.', '큰 값이나 미지원 타입은 복원되지 않을 수 있어요.'],
    ['상태 끌어올리기', 'Filter(value = query, onChange = { query = it })', '공통 상태를 상위로 올리면 여러 UI가 같은 값을 사용해요.', '자식마다 상태를 복사하면 늘 일치해요.', '상태 복사본이 달라 화면과 결과가 어긋나요.'],
    ['이벤트와 상태', 'onClick = { viewModel.complete(lessonId) }', 'UI 이벤트를 상태 소유자에게 보내고 갱신 상태를 다시 표시해요.', 'UI가 저장소 전역 값을 직접 바꿔야 해요.', '변경 책임이 흩어져 검증이 어려워져요.'],
    ['상태와 이벤트 분리', 'UiState(progress = 0.5) + CompleteLesson(id)', '화면의 현재 상태와 과거 입력 이벤트는 다른 개념이에요.', '현재 상태 하나에 모든 과거 이벤트가 자동 저장돼요.', '일회성 안내가 화면 복귀 뒤 중복 표시돼요.'],
  ]],
  ['목록·탐색·적응형 화면', 'Compose 목록과 다양한 화면 크기를 설계해요.', [
    ['LazyColumn', 'LazyColumn { items(lessons) { LessonRow(it) } }', 'LazyColumn은 긴 목록에서 필요한 항목을 지연 구성해요.', 'LazyColumn은 항상 모든 행을 처음부터 그려요.', '불필요한 구성으로 메모리와 반응성이 나빠져요.'],
    ['안정 key', 'items(lessons, key = { it.id }) { LessonRow(it) }', '안정적인 key는 항목 상태를 데이터와 연결해요.', '목록이 바뀌어도 인덱스만 쓰면 항목 식별이 같아요.', '체크·입력 상태가 다른 행으로 이동할 수 있어요.'],
    ['Navigation 인자', 'navigate("lesson/" + lessonId)', '화면 이동에는 필요한 식별자 등 검증 가능한 인자를 전달해요.', '화면 객체 전체를 경로에 직렬화 없이 전달해요.', '큰 값·민감 값 노출과 복원 오류가 생겨요.'],
    ['Adaptive UI', 'window size → list/detail layout', 'Android 17은 다양한 창 크기·폼 팩터에 적응하는 UI를 강조해요.', '기기 이름만 알면 모든 화면 크기에 맞아요.', '분할·접이식·데스크톱 화면에서 내용이 잘려요.'],
    ['창 크기별 배치', 'compact: one pane; expanded: list + detail', '사용 가능한 창 너비에 따라 화면 구성을 조정할 수 있어요.', '태블릿도 세로 방향으로 고정하면 편리해요.', '큰 화면 공간을 쓰지 못하고 사용성이 낮아져요.'],
  ]],
  ['저장소와 데이터 계층', 'Repository·Room·DataStore의 경계를 알아봐요.', [
    ['Repository', 'ViewModel → CourseRepository → data source', 'Repository는 UI와 데이터 접근 방식 사이의 경계를 만들어요.', 'Repository가 인증·권한·검증을 자동 보장해요.', '별도 검증이 없으면 민감 데이터가 노출돼요.'],
    ['Room과 DataStore', 'Room: records; DataStore: small preferences', '관계형 데이터는 Room, 작은 설정값은 DataStore를 검토해요.', '모든 데이터를 하나의 key-value 저장소에 넣는 게 안전해요.', '검색·무결성·마이그레이션 요구와 맞지 않아요.'],
    ['로딩·성공·오류', 'Loading | Content(items) | Error(retryable)', '화면 상태를 분리하면 빈 상태·오류 복구를 제공할 수 있어요.', '실패해도 오래된 성공 화면을 보여 주면 사용자가 알아요.', '오래된 정보를 최신 정보로 오해해요.'],
    ['요청 취소', 'fetch inside lifecycle-bound scope', '화면 수명에 맞춰 요청 취소나 결과 반영을 제한해요.', '화면을 닫아도 모든 요청을 계속 실행해야 해요.', '불필요한 데이터·배터리 사용과 늦은 UI 갱신이 생겨요.'],
    ['앱 내 비밀값', 'PUBLIC_ENDPOINT // not a secret', '앱에 포함된 값은 추출될 수 있으니 비밀 키를 넣지 않아요.', '난독화한 APK 안의 키는 서버에서도 비밀이에요.', '키 탈취로 무단 호출과 데이터 접근이 발생해요.'],
  ]],
  ['접근성·권한·개인정보', '최소 권한과 접근 가능한 의미 전달을 다뤄요.', [
    ['Semantics 레이블', 'IconButton(onClick = save) { Icon(..., contentDescription = "저장") }', '레이블은 보조 기술이 UI 목적을 이해하도록 도와요.', '아이콘 모양·색상만으로 모든 사용자가 기능을 알아요.', '스크린 리더가 버튼 목적을 전달하지 못해요.'],
    ['터치와 확대', 'Modifier.sizeIn(minWidth = target, minHeight = target)', '작은 터치 영역과 고정 글자 크기는 사용성을 낮출 수 있어요.', '시각 디자인이 맞으면 터치·확대를 확인할 필요 없어요.', '누르거나 읽기 어려운 화면이 돼요.'],
    ['런타임 권한', 'request permission when feature is used', '필요한 기능 시점에 권한을 요청하고 거부 경로를 처리해요.', 'Manifest 선언만으로 런타임 허용도 완료돼요.', '기능이 거부되거나 불필요한 요청으로 신뢰가 낮아져요.'],
    ['최소 권한', 'request only the permission needed for this action', '목적에 필요한 최소 권한과 대체 경로를 제공해요.', '첫 실행 때 모든 권한을 한꺼번에 요청해도 돼요.', '개인정보 노출과 권한 거부가 늘어요.'],
    ['로그 최소화', 'logger.info("lesson loaded") // no token or PII', '로그에는 목적에 필요한 최소 내용만 남기고 비밀을 제외해요.', '앱 내부 로그는 사용자 정보가 있어도 안전해요.', '공유·백업·오류 수집으로 민감값이 유출돼요.'],
  ]],
  ['성능·보안·릴리스', '측정과 API 수준별 검증을 계획해요.', [
    ['성능 측정', 'profile → inspect recomposition and frame time', '측정 자료로 병목을 찾아 고쳐요.', 'Composable을 쪼개면 언제나 빨라져요.', '복잡도만 늘고 실제 병목은 남아요.'],
    ['외부 값 검증', 'val id = parseId(raw) ?: return errorState', 'Intent·Navigation·네트워크 입력을 사용 전에 검증해요.', '앱 내부 화면에서 온 값이면 항상 올바른 값이에요.', '변조된 값으로 잘못된 데이터 접근·오류가 생겨요.'],
    ['안전한 로그', 'logger.info("loaded") // do not log secrets', '운영 로그에서 비밀값과 불필요한 개인 정보를 제외해요.', '로그가 기기에 있으니 개인정보가 남아도 돼요.', '기기·백업·진단 수집 과정에서 값이 노출돼요.'],
    ['API 수준', 'if (SDK_INT >= requiredApi) { useNewApi() }', 'minSdk·compileSdk·기기 지원 조건을 확인해야 해요.', 'compileSdk가 최신이면 예전 기기도 모든 새 API를 지원해요.', '미지원 API 호출로 구형 기기에서 종료돼요.'],
    ['Android 17 동작 변경', 'targetSdk 37 → review behavior changes', 'API 37 대상 앱은 동작 변화와 대형 화면 적응을 검토해요.', 'targetSdk 변경이 호환성 테스트를 대신해요.', '권한·화면 변화로 기존 흐름이 깨질 수 있어요.'],
  ]],
  ['캡스톤: 학습 기록 앱', '배운 내용을 작은 Android 앱 설계에 연결해요.', [
    ['요구와 흐름', 'course list → lesson → saved progress', '요구를 화면·데이터·빈 상태·오류 상태로 나눠요.', '화면만 그리면 데이터 복구 요구도 충족돼요.', '오프라인·재진입·실패 경로에서 기록을 잃어요.'],
    ['도메인과 UI 상태', 'sealed interface ScreenState', '불가능한 상태 조합을 피하도록 화면 상태 타입을 설계해요.', 'Boolean 여러 개는 상태가 언제나 서로 배타적이에요.', '모순된 버튼·안내 문구가 나타날 수 있어요.'],
    ['계층 설계', 'Compose → ViewModel → repository → Room', 'UI·상태·저장소를 나누면 독립 검토와 테스트가 쉬워요.', 'ViewModel 하나에 화면·DB·네트워크를 모두 넣어야 단순해요.', '책임이 얽혀 변경과 테스트가 어려워져요.'],
    ['검증 계획', 'unit + Compose UI + device checks', '테스트 층마다 로직·화면·플랫폼의 다른 위험을 확인해요.', '개념 퀴즈 정답이 실제 기기 정상 동작을 증명해요.', '권한·수명 주기 문제를 출시 전에 못 찾아요.'],
    ['범위 보고', 'reviewed concept / locally built / not run', '실행한 검증과 개념 검토, 미지원 범위를 분명히 나눠요.', '문서를 검토하면 앱 빌드와 출시 점검도 끝나요.', '실행하지 않은 기능을 검증 완료로 오해해요.'],
  ]],
];

const phaseFor = (week) => phases.find((phase) => phase.weeks.includes(week));
const levelFor = (week) => week <= 5 ? '입문' : week <= 10 ? '기초' : week <= 17 ? '중급' : week <= 22 ? '고급' : '실전';
const staticRunnerClaim = '이 사이트가 Kotlin 코드를 컴파일하고 Android 앱 실행 결과까지 검증했어요.';

function reviewedExercisesFor(week, day, review, id) {
  const index = (week - 1) * 5 + day - 1;
  const ruleAnswer = index % 3;
  const ruleOptions = [
    [review.rule, review.ruleExplanation],
    ...review.ruleWrong,
  ];
  const correctRule = ruleOptions.shift();
  ruleOptions.splice(ruleAnswer, 0, correctRule);
  const ruleCheck = choice(
    id + '-v' + (review.ruleVersion ?? 2) + '-rule', '규칙 적용 확인',
    review.rulePrompt + '\n\n' + review.example,
    ruleOptions, ruleAnswer, review.ruleHint, review.ruleExplanation,
  );
  const traceVersion = review.traceVersion ?? (week <= 27 ? 3 : 2);
  const traceId = id + '-v' + traceVersion + '-trace';
  const trace = shortAnswer(
    traceId, '예제 결과 추적',
    (review.tracePrompt ?? '예제의 결과를 적어 보세요.') + '\n\n' + review.example,
    [review.traceAnswer, ...(review.traceAlternatives ?? [])], review.traceHint, review.traceExplanation,
    review.traceNormalization ?? (week <= 27 ? 'exact-output' : 'default'),
  );
  if (traceVersion > 2) {
    trace.legacyIds = [id + '-trace'];
    for (let version = 2; version < traceVersion; version += 1) {
      trace.legacyIds.push(id + '-v' + version + '-trace');
    }
  }
  const effectAnswer = (index + 1) % 3;
  const effectOptions = [
    [review.effectCorrect, review.effectExplanation],
    ...review.effectWrong,
  ];
  const correctEffect = effectOptions.shift();
  effectOptions.splice(effectAnswer, 0, correctEffect);
  const effect = choice(
    id + '-v' + (review.effectVersion ?? 2) + '-effect', '실무 영향 판단',
    review.effectPrompt,
    effectOptions, effectAnswer, review.effectHint, review.effectExplanation,
  );
  return [ruleCheck, trace, effect];
}

function exercisesFor(week, day, record) {
  const [concept, example, rule, misconception, consequence] = record;
  const id = 'kotlin-w' + String(week).padStart(2, '0') + '-d' + day;
  const reviewed = reviewedWeeks[week]?.[day - 1];
  if (reviewed) return reviewedExercisesFor(week, day, reviewed, id);
  const ruleOptions = [
    [rule, '이 설명은 공식 Kotlin/Android 계약에 맞는 판단이에요.'],
    [misconception, concept + '의 타입·수명·플랫폼 경계를 놓친 설명이에요.'],
    [staticRunnerClaim, '이 과정은 개념 학습만 제공하며 Kotlin/Android 실행은 하지 않아요.'],
  ];
  const ruleAnswer = (week + day) % 3;
  const rightRule = ruleOptions.shift();
  ruleOptions.splice(ruleAnswer, 0, rightRule);
  const decision = choice(
    id + '-rule', concept + ' 개념 확인',
    '아래는 Kotlin/Android 개념 코드예요. 올바른 설명을 고르세요.\n\n' + example,
    ruleOptions, ruleAnswer, concept + '의 타입·수명·플랫폼 규칙을 떠올려 보세요.', concept + '의 핵심 규칙이에요. ' + rule,
  );
  const recall = shortAnswer(
    id + '-recall', concept + ' 용어 확인',
    '오늘의 핵심 주제 이름을 짧게 적어 보세요.\n\n' + concept + ': ' + rule,
    [concept], '오늘 코드에서 다룬 개념의 이름을 입력하세요.', concept + '의 핵심 규칙이에요. ' + rule,
  );
  const outcomeOptions = [
    [consequence, '이 오해로 생길 수 있는 직접적인 영향이에요.'],
    [rule, '올바른 규칙이지만 질문은 잘못된 가정의 결과를 물어요.'],
    [staticRunnerClaim, '정적 학습 과정은 기기 실행 결과를 보장하지 않아요.'],
  ];
  const outcomeAnswer = (week * 2 + day) % 3;
  const rightOutcome = outcomeOptions.shift();
  outcomeOptions.splice(outcomeAnswer, 0, rightOutcome);
  const outcome = choice(
    id + '-effect', concept + ' 영향 판단',
    '“' + misconception + '”이라고 가정하면 발생할 수 있는 가장 직접적인 영향은 무엇인가요?',
    outcomeOptions, outcomeAnswer, '잘못된 가정이 타입·상태·사용자 경험에 미치는 영향을 살펴보세요.', concept + '에서 이 오해를 따르면 ' + consequence,
  );
  return [decision, recall, outcome];
}

const lessons = weeks.map((spec, index) => {
  const week = index + 1;
  const phase = phaseFor(week);
  const sessions = spec[2].map((record, indexInWeek) => {
    const day = indexInWeek + 1;
    const [concept, example, rule] = record;
    const reviewed = reviewedWeeks[week]?.[indexInWeek];
    return studySession(
      day, reviewed?.title ?? concept, reviewed?.objective ?? (spec[0] + '에서 ' + concept + '의 역할을 설명해요.'),
      reviewed
        ? '예제에서 각 값이 어떻게 달라지는지 살펴봐요. ' + reviewed.rule
        : '예제는 개념 코드이며 이 사이트에서 컴파일하거나 실행하지 않아요. ' + rule,
      reviewed?.example ?? example, exercisesFor(week, day, record),
    );
  });
  return weeklyLesson({
    id: 'kotlin-week-' + String(week).padStart(2, '0'),
    topicId: phase.id, week, title: spec[0],
    objective: spec[1],
    intro: '',
    points: [],
    example: spec[2][0][1].length > 12 ? spec[2][0][1] : spec[2][0][1] + '\n// Kotlin code-reading example',
    sessions, difficulty: levelFor(week),
  });
});

export const kotlinCourseExpansion = {
  phases,
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: lessons.length }, (_, index) => index + 1),
};

