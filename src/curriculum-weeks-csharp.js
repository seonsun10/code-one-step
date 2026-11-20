import { choice, shortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { csharpReviewedOpeningWeeks } from './curriculum-csharp-w1-w3-reviewed.js';
import { csharpReviewedMiddleWeeks } from './curriculum-csharp-w4-w6-reviewed.js';
import { csharpReviewedCollectionWeeks } from './curriculum-csharp-w7-w9-reviewed.js';
import { csharpReviewedDesignWeeks } from './curriculum-csharp-w10-w12-reviewed.js';
import { csharpReviewedBehaviorWeeks } from './curriculum-csharp-w13-w18-reviewed.js';
import { csharpReviewedOperationsWeeks } from './curriculum-csharp-w19-w21-reviewed.js';
import { csharpReviewedWebApiWeeks } from './curriculum-csharp-w22-w24-reviewed.js';
import { csharpReviewedDataSecurityWeeks } from './curriculum-csharp-w25-w27-reviewed.js';
import { csharpReviewedConcurrencyOperationsWeeks } from './curriculum-csharp-w28-w30-reviewed.js';
import { csharpReviewedCapstoneWeeks } from './curriculum-csharp-w31-w33-reviewed.js';
import { csharpReviewedFinalCapstoneWeeks } from './curriculum-csharp-w34-w35-reviewed.js';

// C# and .NET examples are for reading and design practice. This static site
// does not compile C#, start ASP.NET, or connect to a database.
const phases = [
  { id: 'csharp-phase-language', stage: 1, title: 'C# 문법과 기본 흐름', weeks: [1, 2, 3, 4, 5], objective: '값·조건·반복·함수로 프로그램의 흐름을 읽어요.' },
  { id: 'csharp-phase-data', stage: 2, title: '컬렉션과 안전한 데이터', weeks: [6, 7, 8, 9, 10], objective: '컬렉션·LINQ·널 안전성·객체 모델을 익혀요.' },
  { id: 'csharp-phase-design', stage: 3, title: '객체 설계와 오류 처리', weeks: [11, 12, 13, 14, 15], objective: '계약·제네릭·함수형 요소·오류·자원 수명을 살펴봐요.' },
  { id: 'csharp-phase-dotnet', stage: 4, title: '.NET과 비동기 품질', weeks: [16, 17, 18, 19, 20], objective: '비동기 흐름, 최신 C#, 테스트, SDK와 설정 경계를 이해해요.' },
  { id: 'csharp-phase-web', stage: 5, title: 'ASP.NET Core와 데이터 경계', weeks: [21, 22, 23, 24, 25], objective: '웹 요청·권한·저장소·보안·성능을 설계해요.' },
  { id: 'csharp-phase-capstone', stage: 6, title: '실무 구조와 캡스톤', weeks: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35], objective: '서비스 운영 조건과 검증 범위를 작은 앱 설계에 연결해요.' },
];

// Each day records one concept, a reading snippet, a checked rule, a common
// misconception, and its direct consequence. No snippet is executed here.
const weeks = [
  ['C#과 .NET 시작하기', '언어 코드와 플랫폼 실행 환경의 역할을 구분해요.', [
    ['C#과 .NET', 'C# source → compiler → .NET runtime', 'C#은 언어이고 .NET은 런타임·라이브러리·도구를 포함하는 플랫폼이에요.', 'C#과 .NET은 같은 이름의 한 구성요소예요.', '언어 문법과 플랫폼 API·배포 조건을 혼동해요.'],
    ['프로젝트 파일', '<Project Sdk="Microsoft.NET.Sdk">', '프로젝트 파일은 빌드 입력과 대상 프레임워크 같은 설정을 담아요.', '소스 파일 이름만 바꾸면 모든 빌드 설정이 자동 변경돼요.', '대상 버전과 실제 참조 API가 어긋날 수 있어요.'],
    ['진입점', 'static void Main(string[] args) { }', '전통적인 콘솔 앱은 Main 진입점을 사용할 수 있어요.', '모든 C# 파일마다 Main을 하나씩 둬야 해요.', '진입점이 중복되거나 앱 시작 흐름을 잘못 찾아요.'],
    ['최상위 문', 'Console.WriteLine("학습 시작");', '최상위 문은 간단한 실행 파일의 진입 코드를 줄여 쓸 수 있어요.', '최상위 문은 프로젝트나 런타임을 없애요.', '코드 작성 편의와 실제 실행 환경을 같은 것으로 오해해요.'],
    ['코드와 실행 증거', 'reviewed concept · compiled · executed', '문서에서 예제를 검토한 일과 실제 컴파일·실행은 다른 검증이에요.', '코드 설명을 읽으면 컴파일도 성공한 거예요.', '실행하지 않은 코드를 동작 확인한 것으로 오해해요.'],
  ]],
  ['변수와 기본 타입', '이름·타입·재할당을 구분해요.', [
    ['명시적 타입', 'int lessonsDone = 2;', '변수 선언에서 타입과 이름, 초기값을 볼 수 있어요.', 'int 변수에는 문자열도 자동 저장돼요.', '잘못된 타입의 값이 컴파일 단계에서 거부돼요.'],
    ['var 타입 추론', 'var title = "C#";', 'var는 우변을 바탕으로 선언 시 타입을 추론해요.', 'var는 실행 중 값마다 타입이 바뀌는 동적 타입이에요.', '추론된 타입과 가능한 연산을 잘못 판단해요.'],
    ['값 갱신', 'int count = 1;\ncount = count + 1;', '재할당 가능한 변수는 같은 타입 범위에서 새 값을 대입해요.', '대입 연산자는 오른쪽과 왼쪽을 비교해요.', '비교식과 상태 갱신을 혼동해요.'],
    ['상수', 'const int MaxAttempts = 3;', 'const 값은 컴파일 시점에 정할 수 있는 상수 표현이어야 해요.', 'const에는 실행 중 받은 임의의 객체를 저장해요.', '컴파일 상수와 런타임 설정을 혼동해요.'],
    ['값 타입과 참조 타입', 'int score = 90;\nstring name = "Mina";', '값 복사와 참조가 가리키는 객체 공유는 타입과 연산에 따라 달라요.', '모든 변수 대입은 언제나 객체를 깊게 복사해요.', '별칭을 통한 변경이 화면이나 계산에 영향을 줄 수 있어요.'],
  ]],
  ['숫자·문자·문자열', '범위와 변환 규칙을 읽어요.', [
    ['정수 범위', 'int value = int.MaxValue;', '고정 폭 정수는 표현 가능한 범위를 가져요.', 'int는 범위를 넘으면 자동으로 더 큰 정밀 타입이 돼요.', '누적값이 넘쳐 잘못된 결과를 만들 수 있어요.'],
    ['명시 변환', 'long total = (long)smallCount;', '일부 수치 변환은 명시해 의도를 드러내야 해요.', '숫자 타입은 항상 손실 없이 자동 변환돼요.', '값 손실이나 변환 오류를 놓쳐요.'],
    ['문자와 문자열', "char letter = 'C';\nstring word = \"C#\";", 'char는 UTF-16 코드 단위 하나, string은 문자열을 표현해요.', 'char와 string은 따옴표 외에 모두 같은 타입이에요.', '문자와 문자열의 메서드·타입 계약을 어겨요.'],
    ['문자열 보간', 'string greeting = $"안녕하세요, {name}";', '보간 문자열은 중괄호 안의 표현식 결과를 문자열에 넣어요.', '보간 안의 코드는 별도 네트워크 요청을 자동 실행해요.', '표현식 효과와 문자열 표시를 혼동해요.'],
    ['금액 정밀도', 'decimal price = 12.50m;', '금액 계산은 decimal 같은 적합한 표현과 반올림 정책을 고려해요.', 'double은 모든 십진 금액을 정확히 표현해요.', '부동소수점 오차가 정산 결과에 누적돼요.'],
  ]],
  ['연산과 조건', '비교와 논리 결합으로 분기를 읽어요.', [
    ['비교 결과', 'bool passed = score >= 60;', '비교 연산은 bool 결과를 만들어요.', '비교식의 결과는 항상 원래 숫자 타입이에요.', '조건문에 필요한 참·거짓 흐름을 놓쳐요.'],
    ['논리 AND', 'bool allowed = active && consented;', '&&는 두 조건이 모두 참이어야 참이고 오른쪽 평가를 건너뛸 수 있어요.', '&&는 양쪽 표현식을 항상 실행해요.', '오른쪽 조건의 부수 효과 실행 시점을 잘못 예상해요.'],
    ['if/else', 'if (score >= 60) { label = "통과"; }', 'if는 조건에 따라 실행 블록을 선택해요.', 'C#에서 숫자 1은 bool true로 자동 변환돼요.', '타입 조건이 맞지 않아 코드 계약을 어겨요.'],
    ['switch 식', 'var label = grade switch { 1 => "A", _ => "기타" };', 'switch 식은 일치한 팔의 값을 결과로 만들어요.', 'switch 식에는 모든 입력을 다루는 기본 팔이 필요 없어요.', '다루지 않은 입력에서 예외나 의도치 않은 상태가 생겨요.'],
    ['패턴 가드', 'if (value is string text && text.Length > 0)', '패턴 검사는 타입·값 조건을 확인하고 범위에서 변수를 사용할 수 있어요.', '패턴 검사가 사용자의 업무 규칙 전체를 자동 검증해요.', '형식은 맞지만 업무상 잘못된 값이 통과해요.'],
  ]],
  ['반복과 흐름 제어', '반복 횟수·종료·원소 접근을 확인해요.', [
    ['for 경계', 'for (int i = 0; i < items.Count; i++) { }', '인덱스는 0부터 Count보다 작은 동안 유효해요.', 'i <= items.Count는 마지막 원소까지 정확히 한 번만 방문해요.', 'Count 인덱스를 읽어 범위를 벗어나요.'],
    ['foreach', 'foreach (var item in items) { Read(item); }', 'foreach는 열거 가능한 항목을 차례로 읽는 흐름이에요.', 'foreach의 현재 항목을 임의로 다음 인덱스로 건너뛰어요.', '변경·순회 규칙을 어기거나 항목을 중복 처리해요.'],
    ['while 종료', 'while (pending.Count > 0) { ProcessOne(); }', 'while 반복은 상태가 종료 조건을 만족하도록 갱신돼야 해요.', 'while은 반복 횟수를 자동으로 제한해요.', '조건이 계속 참이라 작업이 끝나지 않을 수 있어요.'],
    ['break와 continue', 'if (item.IsInvalid) continue;', 'continue는 현재 회차를 건너뛰고 다음 회차로 이동해요.', 'continue는 전체 반복을 영구 종료해요.', '잘못된 레코드 처리 뒤 나머지 작업이 멈춰요.'],
    ['범위 안전', 'if (index >= 0 && index < items.Count) { }', '접근 전에 인덱스의 아래·위 경계를 확인할 수 있어요.', '음수 인덱스는 배열의 끝에서부터 자동 계산돼요.', '잘못된 입력으로 인덱스 예외가 나요.'],
  ]],
  ['메서드와 반환값', '함수 계약과 호출 결과를 추적해요.', [
    ['매개변수와 반환형', 'int Double(int value) => value * 2;', '메서드 시그니처는 입력 매개변수와 반환 타입을 정해요.', '반환 타입은 호출자에게 영향을 주지 않아요.', '호출부가 결과 타입을 잘못 사용해요.'],
    ['void', 'void LogTitle(string title) { }', 'void는 메서드가 의미 있는 결과값을 반환하지 않음을 나타내요.', 'void 메서드 결과는 항상 숫자 0이에요.', '결과가 필요한 흐름에 값을 전달하지 못해요.'],
    ['매개변수 전달', 'void Rename(Member member, string name)', '참조형 객체를 인자로 전달해도 변수 자체 복사와 객체 수정은 구분해야 해요.', '인자를 바꾸면 호출자의 모든 로컬 변수가 자동 교체돼요.', '객체 변경과 호출자 변수 재대입을 혼동해요.'],
    ['선택 매개변수', 'string Greet(string name, string prefix = "안녕")', '선택 매개변수는 호출부에서 값을 생략할 때 기본값을 써요.', '선택값은 언제나 설정 파일에서 다시 읽혀요.', '호출 계약과 환경 설정을 섞어요.'],
    ['이름 있는 인자', 'Send(to: recipient, urgent: true);', '이름 있는 인자는 호출부에서 각 인자의 역할을 분명히 해요.', '인자 이름은 런타임 타입 검사를 끄는 옵션이에요.', '잘못된 인자 값이 유효한 타입이라도 의미가 틀려요.'],
  ]],
  ['배열과 제네릭 컬렉션', '순서·키·중복 정책에 맞는 자료 구조를 골라요.', [
    ['배열 크기', 'int[] scores = new int[3];', '배열 길이는 생성 시 고정돼요.', '배열은 항목을 추가하면 자동으로 크기가 늘어요.', '변경 가능한 목록이 필요할 때 구조가 맞지 않아요.'],
    ['List<T>', 'var titles = new List<string>();', 'List<T>는 순서 있는 가변 컬렉션이에요.', 'List<T>는 중복 항목을 자동 제거해요.', '반복 데이터가 사라져요.'],
    ['Dictionary<TKey,TValue>', 'var byId = new Dictionary<int, Member>();', 'Dictionary는 키로 값을 찾고 키의 중복 정책을 지켜요.', 'Dictionary는 중복 키를 서로 다른 행으로 자동 보관해요.', '키 중복 때 예외나 잘못된 갱신이 나요.'],
    ['HashSet<T>', 'var tags = new HashSet<string>();', 'HashSet<T>은 같은 값의 중복 저장을 방지하는 데 쓸 수 있어요.', 'HashSet은 입력 순서와 중복을 모두 보장해요.', '순서가 중요한 화면 결과가 달라질 수 있어요.'],
    ['Queue와 Stack', 'queue.Enqueue(job);\nstack.Push(page);', 'Queue는 선입선출, Stack은 후입선출 흐름에 적합해요.', '두 컬렉션은 항상 가장 오래된 항목부터 꺼내요.', '작업이나 되돌리기 순서가 요구와 반대로 돼요.'],
  ]],
  ['LINQ 조회와 변환', '필터·변환·정렬 결과와 실행 시점을 구분해요.', [
    ['Where 필터', 'var active = users.Where(user => user.Enabled);', 'Where는 조건에 맞는 원소를 선택하는 조회를 만들어요.', 'Where는 원소 값을 다른 타입으로 바꿔요.', '조건 필터와 매핑을 바꿔 결과 형태가 달라져요.'],
    ['Select 변환', 'var names = users.Select(user => user.Name);', 'Select는 각 원소를 결과 값으로 변환해요.', 'Select는 원본 컬렉션의 객체를 자동 삭제해요.', '프로젝션 결과를 원본 변경으로 오해해요.'],
    ['OrderBy', 'var ordered = users.OrderBy(user => user.Name);', 'OrderBy는 키 기준 정렬 조회를 만들어요.', 'OrderBy는 원본 List를 반드시 직접 재배열해요.', '원본 순서가 보존된다고 잘못 기대해요.'],
    ['GroupBy', 'var byTeam = users.GroupBy(user => user.TeamId);', 'GroupBy는 키가 같은 항목들을 그룹으로 묶어요.', 'GroupBy는 그룹별 집계값을 자동 계산해요.', '그룹과 집계 결과 모양을 혼동해요.'],
    ['지연 실행', 'var query = users.Where(user => user.Enabled);', '일부 LINQ 조회는 열거될 때 소스 값을 읽어요.', '조회 변수 선언 순간 데이터가 항상 복사돼요.', '소스가 바뀐 뒤 결과가 달라지는 이유를 놓쳐요.'],
  ]],
  ['널 가능성과 안전한 접근', '널 상태와 빈 값, 기본값 정책을 나눠요.', [
    ['nullable 참조', 'string? nickname = null;', 'nullable 참조 주석은 null 가능성을 분석 도구에 알려요.', 'string?은 자동으로 빈 문자열을 저장해요.', 'null과 빈 값을 같은 사용자 상태로 취급해요.'],
    ['null 조건 연산자', 'var length = nickname?.Length;', '?.는 수신자가 null이면 다음 접근을 건너뛰고 null 결과를 만들어요.', '?.는 null을 0으로 바꿔요.', 'nullable 결과를 후속 코드가 처리하지 못해요.'],
    ['null 병합', 'var label = nickname ?? "학습자";', '??는 왼쪽이 null인 경우에만 기본값을 선택해요.', '??는 빈 문자열이나 0도 기본값으로 바꿔요.', '빈 값 정책을 null 정책에 섞어 데이터 의미가 달라져요.'],
    ['null 병합 대입', 'settings.Name ??= "기본";', '??=는 왼쪽이 null일 때만 값을 대입해요.', '??=는 기존에 저장된 이름을 항상 덮어써요.', '사용자가 이미 정한 값을 잃을 수 있어요.'],
    ['널 검증 경계', 'ArgumentNullException.ThrowIfNull(input);', '외부 경계에서 필수 입력의 null 여부를 명시적으로 확인할 수 있어요.', 'nullable 주석이 입력값을 런타임에서 검사해 줘요.', '잘못된 값이 깊은 계층까지 전달돼 오류 위치가 흐려져요.'],
  ]],
  ['레코드와 데이터 모델', '값의 동일성과 변경 가능성을 설계해요.', [
    ['record class', 'public record Lesson(string Title, int Order);', 'record class는 값 기반 동등성 등 데이터 모델에 유용한 동작을 제공해요.', 'record는 자동으로 모든 필드가 깊게 불변이에요.', '참조된 내부 객체가 바뀌어도 완전 불변이라고 오해해요.'],
    ['record struct', 'public readonly record struct Point(int X, int Y);', 'record struct는 값 타입 데이터 모델을 표현할 수 있어요.', '모든 record는 힙 참조 타입이에요.', '복사·박싱·성능 특성을 잘못 예상해요.'],
    ['with 복사', 'var updated = lesson with { Order = 2 };', 'with는 record 값을 바탕으로 일부 속성을 바꾼 새 인스턴스를 만들 수 있어요.', 'with는 항상 기존 객체를 제자리에서 바꿔요.', '원본을 유지할지 바꿀지 예상과 달라져요.'],
    ['DTO 분리', 'LessonResponse → LessonDto', '전송 모델은 내부 도메인 객체와 분리해 필요한 값만 노출할 수 있어요.', '데이터베이스 엔티티를 그대로 외부 응답에 보내야 해요.', '내부 필드·변경이 API 계약으로 새어 나가요.'],
    ['불변 기본값', 'public string Title { get; init; } = "";', 'init은 초기화 시점에 설정하고 이후 변경을 제한하는 설계에 쓸 수 있어요.', 'init 속성은 참조된 객체까지 깊게 고정해요.', '중첩된 가변 자료가 예기치 않게 변경돼요.'],
  ]],
  ['클래스와 캡슐화', '객체 상태와 공개 계약을 나눠요.', [
    ['생성자', 'public Member(string name) { Name = name; }', '생성자는 객체가 만들어질 때 초기 상태를 정해요.', '생성자 안의 검사는 이후 모든 변경도 자동 검사해요.', '생성 뒤 잘못된 값이 들어오는 경로를 놓쳐요.'],
    ['프로퍼티', 'public string Name { get; private set; }', '접근자는 외부에 읽기·쓰기 계약을 정해요.', 'public 프로퍼티는 내부 불변성을 자동 보장해요.', '의도하지 않은 객체 상태 변경을 허용해요.'],
    ['필드 백킹 프로퍼티', 'public string Name { get; set; }', '프로퍼티는 구현을 숨기고 호출 계약을 제공할 수 있어요.', '자동 프로퍼티는 언제나 검증과 정규화를 수행해요.', '입력 검증을 별도 위치에서 놓칠 수 있어요.'],
    ['접근 제한', 'private readonly string _key;', 'private은 타입 내부 구현으로 접근을 제한해요.', 'private은 같은 객체 인스턴스의 수명 동안 값이 자동 저장돼요.', '접근 제어와 저장·수명 관리를 혼동해요.'],
    ['불변식', 'if (quantity < 0) throw new ArgumentOutOfRangeException();', '도메인 불변식은 생성·변경 경로에서 유지돼야 해요.', '한 번 생성할 때 검사하면 모든 갱신도 자동 안전해요.', '잘못된 상태가 객체 안에 오래 남아요.'],
  ]],
  ['상속과 인터페이스', '다형성과 구현 의존을 판단해요.', [
    ['인터페이스', 'interface ILessonStore { Lesson? Find(int id); }', '인터페이스는 호출자가 기대할 기능 계약을 표현해요.', '인터페이스가 구현 데이터베이스 종류를 보장해요.', '추상 계약과 실제 공급자 기능을 혼동해요.'],
    ['다형성', 'ILessonStore store = new MemoryLessonStore();', '인터페이스 형식 변수로 구현체를 바꾸어 연결할 수 있어요.', '인터페이스 변수는 실행 시 항상 단 하나의 구현만 허용해요.', '테스트·운영 구현 분리 목적을 놓쳐요.'],
    ['상속', 'class PremiumCourse : Course { }', '상속은 is-a 관계와 대체 가능성이 성립하는지 따져 사용해요.', '코드 재사용은 언제나 상속이 가장 단순해요.', '기본 클래스 변경이 여러 하위 타입에 퍼져요.'],
    ['구성', 'class ReportService(IReportStore store) { }', '구성은 필요한 협력 객체를 전달받아 조립해요.', '모든 클래스가 구체 구현을 직접 만들어야 테스트가 쉬워요.', '교체·검증이 어려운 강한 결합이 생겨요.'],
    ['SOLID 첫 원칙', 'ReportService → one reason to change', '책임이 응집된 타입은 변경 이유를 좁히는 데 도움이 돼요.', '파일을 여러 개로 나누면 책임 설계가 자동으로 끝나요.', '구조만 쪼개고 변경 결합은 그대로 남아요.'],
  ]],
  ['제네릭과 타입 제약', '타입 매개변수와 컬렉션 계약을 읽어요.', [
    ['제네릭 메서드', 'T Identity<T>(T value) => value;', '제네릭 메서드는 호출 시 타입 인자를 적용할 수 있어요.', 'T는 실행 때마다 임의로 다른 타입을 자동 저장하는 동적 값이에요.', '입력과 반환 타입 관계를 놓쳐요.'],
    ['where 제약', 'where T : notnull', '제약 조건은 타입 매개변수가 만족할 규칙을 제한해요.', '제약은 임의의 업무 규칙을 검사해요.', '컴파일 타입 조건과 런타임 데이터 검증을 혼동해요.'],
    ['제네릭 컬렉션', 'IReadOnlyList<Lesson> lessons', '제네릭 컬렉션은 원소 타입과 읽기·쓰기 계약을 함께 표현해요.', 'IReadOnlyList는 데이터 자체를 깊게 불변으로 만들어요.', '공유 가변 참조로 값이 바뀔 수 있어요.'],
    ['공변성', 'IEnumerable<out T>', '공변 출력 형식은 특정 참조 타입 대입 방향을 허용할 수 있어요.', 'out은 메서드에서 반드시 값을 반환하라는 문법이에요.', '매개변수 전달 규칙과 타입 매개변수 관계를 혼동해요.'],
    ['불변성 기본', 'List<Dog> is not List<Animal>', '가변 제네릭 컬렉션은 쓰기 안전성을 위해 서로 다른 형식 간 대입이 제한돼요.', 'Dog 목록에 Animal 아무 값이나 안전하게 넣을 수 있어요.', '기존 목록에 호환되지 않는 타입이 들어와요.'],
  ]],
  ['람다·delegate·이벤트', '함수 값을 전달하되 수명과 구독을 확인해요.', [
    ['람다', 'Func<int, int> double = value => value * 2;', '람다는 짧은 함수 동작을 값으로 전달할 수 있어요.', '화살표 함수는 별도 타입이나 매개변수 계약 없이 실행돼요.', '요구하는 delegate 형식과 반환이 맞지 않아요.'],
    ['Func와 Action', 'Action<string> log = message => Write(message);', 'Func는 결과가 있는 호출, Action은 void 호출에 쓸 수 있어요.', 'Action은 항상 숫자 결과를 반환해요.', '호출 결과를 기대해 잘못된 코드를 작성해요.'],
    ['클로저 캡처', 'int total = 0;\nAction add = () => total++;', '람다는 바깥 변수에 접근할 수 있지만 캡처된 상태의 수명도 살펴야 해요.', '캡처된 변수는 여러 스레드에서 자동으로 안전해요.', '동시에 바꾸면 경쟁 상태가 생길 수 있어요.'],
    ['이벤트 구독', 'publisher.Changed += OnChanged;', '이벤트는 발행자와 구독자의 알림 계약을 연결해요.', '구독 객체가 사라지면 이벤트가 구독을 자동 해제해요.', '발행자가 구독 객체를 오래 붙잡아 메모리 수명이 늘어날 수 있어요.'],
    ['구독 해제', 'publisher.Changed -= OnChanged;', '더 이상 필요 없는 구독은 적절한 수명 시점에 해제할 수 있어요.', '이벤트 핸들러는 중복 등록해도 한 번만 실행돼요.', '같은 알림이 여러 번 처리돼요.'],
  ]],
  ['예외와 결과 오류', '예외 정책과 정상적인 실패 결과를 구분해요.', [
    ['예외 전파', 'try { Load(); } catch (IOException error) { }', 'catch는 예상한 예외 유형을 처리하거나 변환하는 경계예요.', '빈 catch가 모든 실패를 복구해요.', '오류를 숨겨 데이터 손실이나 잘못된 성공 상태가 남아요.'],
    ['finally', 'try { Use(); } finally { Release(); }', 'finally는 정상·예외 경로 뒤 정리 작업에 사용할 수 있어요.', 'finally는 예외를 자동으로 다시 시도해요.', '자원 정리와 복구 정책을 혼동해요.'],
    ['예외 vs 입력 결과', 'bool TryParse(string raw, out int value)', '자주 예상되는 잘못된 입력은 Try 패턴 등 명시적 결과로 표현할 수 있어요.', '모든 잘못된 사용자 입력은 프로세스 종료 예외로 처리해야 해요.', '일반 입력 오류가 장애처럼 기록돼요.'],
    ['예외 맥락 보존', 'throw new DataException("저장 실패", error);', '오류를 감쌀 때 내부 예외를 보존해 원인을 추적할 수 있어요.', '원래 예외 메시지를 버려도 디버깅 근거가 같아요.', '장애의 최초 원인을 찾기 어려워요.'],
    ['오류 노출', 'return Results.Problem();', '사용자 응답과 내부 진단 정보는 공개 범위를 나눠요.', '스택 추적을 모든 사용자에게 반환해야 지원이 쉬워요.', '경로·설정·개인 데이터가 응답에 노출될 수 있어요.'],
  ]],
  ['자원과 파일 입출력', '자원 수명과 외부 데이터 형식을 검토해요.', [
    ['IDisposable', 'using var stream = File.OpenRead(path);', 'using은 범위를 벗어날 때 IDisposable 자원 정리에 사용돼요.', 'using은 파일 내용을 영구 저장해 줘요.', '열린 핸들이 남아 파일·메모리 자원이 고갈돼요.'],
    ['비동기 정리', 'await using var resource = OpenAsync();', 'IAsyncDisposable 자원은 비동기 정리가 필요할 수 있어요.', 'await using은 트랜잭션을 항상 commit해요.', '정리·취소·저장 정책을 혼동해요.'],
    ['경로 입력', 'var fullPath = Path.GetFullPath(input);', '외부 경로는 정규화 뒤 허용된 기준 폴더 안인지 검증해야 해요.', '경로를 정규화하면 권한 검사가 끝나요.', '상위 폴더를 빠져나가는 파일 접근이 허용돼요.'],
    ['직렬화 계약', 'JsonSerializer.Deserialize<LessonDto>(json);', 'JSON 역직렬화 결과도 필수 값·범위·업무 규칙을 검증해야 해요.', '형식에 맞게 역직렬화되면 데이터는 항상 유효해요.', '구조만 맞는 악성·불완전 값이 후속 처리를 깨뜨려요.'],
    ['스트림 경계', 'await stream.CopyToAsync(destination, token);', '스트림은 크기·취소·부분 입력·자원 소유권을 고려해 읽어야 해요.', '스트림은 무한히 작은 메모리를 사용해요.', '큰 입력이 메모리와 연결을 고갈시킬 수 있어요.'],
  ]],
  ['Task와 async/await', '비동기 작업과 스레드 실행을 구분해요.', [
    ['Task 결과', 'Task<int> LoadCountAsync();', 'Task<T>는 나중에 얻을 비동기 결과를 표현할 수 있어요.', 'Task는 요청할 때 새 전용 스레드를 보장해요.', '스레드 수명·성능을 잘못 예상해요.'],
    ['await 전파', 'var count = await LoadCountAsync();', 'await는 완료를 비동기적으로 기다리고 결과·예외를 호출 흐름에 연결해요.', 'await를 쓰면 호출자가 기다리지 않아도 돼요.', '완료 순서와 오류 처리를 놓쳐요.'],
    ['async 반환형', 'async Task SaveAsync() { await SaveCoreAsync(); }', 'async Task 메서드는 완료·예외를 비동기 작업으로 전달해요.', 'async void는 일반 업무 메서드에서 호출·예외 추적에 안전해요.', '호출자가 완료나 예외를 기다릴 수 없어요.'],
    ['취소 토큰', 'await LoadAsync(cancellationToken);', 'CancellationToken은 취소 요청을 협력적으로 전달해요.', '토큰을 전달하면 모든 작업이 즉시 강제 종료돼요.', '취소를 무시한 작업이 화면·서버 자원을 계속 써요.'],
    ['동기 차단 금지', 'var result = await FetchAsync();', '비동기 흐름은 필요 없는 `.Result`/`.Wait()` 블로킹을 피해야 해요.', 'Task.Result는 항상 비동기 await와 같아요.', '교착·스레드 고갈·응답 지연을 만들 수 있어요.'],
  ]],
  ['C# 14와 .NET 10 버전 읽기', '안정 기능과 패치 업데이트의 역할을 분리해요.', [
    ['현재 안정 기준', 'C# 14 → .NET 10 LTS', '2026-11-02 공식 자료 기준 C# 14는 최신 안정 언어 버전이고 .NET 10 LTS에서 지원돼요.', 'C# 14는 .NET 11 RC3에서만 쓸 수 있어요.', '미리보기 버전과 안정 배포 기준을 혼동해요.'],
    ['최신 패치 확인', '.NET 10.0.14 · 2026-10-25', '.NET 10의 최신 서비스 패치와 언어 버전은 서로 다른 버전 축이에요.', '런타임 패치가 올라가면 C# 문법도 자동으로 새 메이저 버전이 돼요.', '지원 패치와 언어 기능의 변경을 잘못 전달해요.'],
    ['null 조건 대입', 'customer?.Order = currentOrder;', 'C# 14는 null 조건 접근을 일부 대입식 왼쪽에 사용할 수 있어요.', '?. 대입은 customer가 null이어도 오른쪽 코드를 항상 실행해요.', '조건이 없을 때 불필요한 계산·부수 효과가 발생한다고 오해해요.'],
    ['확장 멤버', 'extension(IEnumerable<int> values) { public bool IsEmpty => !values.Any(); }', 'C# 14 확장 블록은 확장 속성 등 멤버 형태를 표현할 수 있어요.', '확장 멤버가 원본 타입 소스 코드를 직접 수정해요.', '별도 API와 기존 타입 구현을 혼동해요.'],
    ['미리보기 경계', 'stable C# 14 feature ≠ preview feature', '안정 문법·실험 문법·지원 SDK 조합을 출처에서 따로 확인해요.', '.NET 11 RC 기능은 현재 C# 안정 문법과 같아요.', '사전 출시 기능을 안정 프로젝트에 섞어 호환성을 잃어요.'],
  ]],
  ['테스트 기초와 경계 사례', '테스트가 증명하는 범위와 입력 경계를 다뤄요.', [
    ['단위 테스트', '[Fact]\npublic void Empty_returns_zero() { }', '단위 테스트는 작게 분리한 로직의 예상 결과를 확인해요.', '단위 테스트 하나가 실제 운영 시스템 전체를 증명해요.', '네트워크·저장소·권한 통합 오류를 놓쳐요.'],
    ['경계 사례', 'Assert.Equal(0, Sum(Array.Empty<int>()));', '빈 값·최소·최대·잘못된 입력을 요구에 따라 검사해요.', '평균 입력만 통과하면 경계 동작도 보장돼요.', '실제 사용자가 만나는 경계에서 실패해요.'],
    ['회귀 테스트', 'old behavior + new requirement', '고친 오류를 다시 재현하는 검사는 회귀 방지에 도움이 돼요.', '버그를 고친 뒤 같은 경로를 다시 확인할 필요가 없어요.', '이전 문제가 다음 수정에서 되돌아올 수 있어요.'],
    ['테스트 대역', 'IClock → FakeClock', '대역은 외부 시스템 경계나 시간을 제어해 단위 검증을 돕는 도구예요.', 'FakeClock이 실제 운영 시계와 모든 OS 동작을 증명해요.', '대역 결과와 실제 통합 동작 차이를 놓쳐요.'],
    ['통합 범위', 'unit → component → integration', '검사는 넓어질수록 실제 경계와 상호작용을 더 많이 확인해요.', '많은 단위 테스트 수가 운영 환경 확인을 대신해요.', '호스트·권한·설정 문제를 출시 전에 못 찾아요.'],
  ]],
  ['SDK·솔루션·패키지', '복원·빌드·테스트 단계의 역할을 알아봐요.', [
    ['SDK와 런타임', 'dotnet --info', 'SDK는 개발·컴파일 도구, 런타임은 앱 실행 구성요소를 포함해요.', 'SDK와 런타임은 항상 설치·버전이 동일해요.', '로컬 실행 가능 여부를 잘못 판단해요.'],
    ['솔루션과 프로젝트', '.sln → app.csproj + tests.csproj', '솔루션은 여러 프로젝트를 묶어 관리할 수 있어요.', '솔루션 파일이 모든 프로젝트 참조를 자동 생성해요.', '테스트·앱 프로젝트 연결 누락을 놓쳐요.'],
    ['restore와 build', 'dotnet restore → dotnet build', 'restore는 의존 패키지를 확인하고 build는 소스를 컴파일해요.', 'restore가 사용자 C# 프로그램을 테스트해요.', '복원 성공을 코드 정확성으로 착각해요.'],
    ['패키지 고정', 'PackageReference Version="x.y.z"', '의존 버전 범위와 잠금 파일이 재현 가능성에 영향을 줘요.', '최신 패키지를 매번 받으면 항상 같은 빌드가 돼요.', '다른 환경에서 다른 패키지 코드가 선택돼요.'],
    ['패치 유지', 'supported line → current servicing patch', '.NET 지원은 지원되는 계열의 최신 패치를 유지하는 정책을 따라요.', 'LTS라는 이름이면 몇 년 동안 패치 확인을 안 해도 돼요.', '알려진 보안·안정성 수정이 빠져요.'],
  ]],
  ['호스트·의존성 주입·설정', '앱 조립과 수명 주기를 읽어요.', [
    ['Generic Host', 'Host.CreateApplicationBuilder(args);', 'Host는 설정·의존성 주입·로깅·수명 관리를 묶을 수 있어요.', 'Host 호출 하나가 웹 서버나 DB를 자동 배포해요.', '앱 시작과 운영 자원을 혼동해요.'],
    ['의존성 등록', 'services.AddScoped<IStore, Store>();', '등록은 인터페이스 구현과 수명 주기를 조립해요.', '등록만 하면 저장 데이터베이스가 자동 설정돼요.', '잘못된 서비스 구성이나 수명 누수가 생겨요.'],
    ['수명 주기', 'Singleton · Scoped · Transient', '각 수명은 인스턴스 재사용 범위를 다르게 정해요.', 'Scoped 객체를 Singleton에서 잡아도 수명 차이는 무시돼요.', '오래된 요청 상태가 재사용되거나 예외가 나요.'],
    ['설정 우선순위', 'options.Value.TimeoutSeconds', '환경 설정은 공급자와 우선순위·검증 규칙을 확인해야 해요.', '설정값은 소스 코드에 적힌 기본값만 사용돼요.', '운영 설정이 예상과 다르게 덮어써져요.'],
    ['비밀값 분리', 'secret → environment/secret store', '비밀값은 소스·로그·공개 설정 파일에 넣지 않아요.', '환경 변수라면 화면 캡처나 로그에 공개해도 안전해요.', '배포 기록이나 진단 출력에서 자격 정보가 새어 나가요.'],
  ]],
  ['로깅과 관측 가능성', '운영 신호를 기록하되 개인정보를 보호해요.', [
    ['구조화 로그', 'logger.LogInformation("Loaded {Count}", count);', '구조화 필드는 검색·집계에 도움이 돼요.', '로그 문장은 언제나 타입이 있는 지표와 같아요.', '수치 추세와 개별 사건을 혼동해요.'],
    ['로그 수준', 'Trace · Debug · Information · Warning · Error', '로그 수준은 사건의 심각도와 운영 노출량을 구분해요.', '모든 요청을 Error로 기록하면 중요한 장애를 쉽게 찾아요.', '경보가 과다해 실제 오류가 묻혀요.'],
    ['민감 정보', 'LogInformation("Member {MemberId}", safeId);', '로그 필드는 업무에 필요한 최소 정보만 포함해야 해요.', '전화번호·토큰을 로그에 남기면 디버깅이 쉬워 항상 이득이에요.', '백업·중앙 로그에서 개인 정보와 비밀이 노출돼요.'],
    ['메트릭과 추적', 'request duration · trace id', '메트릭은 집계된 추세, 추적은 요청 간 연결 정보를 볼 수 있어요.', 'trace ID가 있으면 요청 본문과 비밀값도 보존해야 해요.', '과도한 데이터 수집으로 개인정보와 비용이 늘어요.'],
    ['오류 응답 분리', 'client message ≠ internal exception', '사용자 안내와 내부 진단은 별도 경로로 기록해요.', '내부 스택을 그대로 반환해야 사용자 지원이 정확해요.', '구현 세부와 경로가 외부에 노출돼요.'],
  ]],
  ['ASP.NET Core 요청 흐름', 'HTTP 요청과 애플리케이션 경계를 따라가요.', [
    ['Minimal API', 'app.MapGet("/lessons", () => Results.Ok(items));', '엔드포인트는 경로·메서드와 처리 로직을 연결해요.', 'MapGet은 데이터를 영구 저장해요.', '조회 응답을 저장 완료처럼 안내해요.'],
    ['미들웨어 순서', 'UseRouting → UseAuthentication → UseAuthorization', '미들웨어 순서가 요청 처리와 보안에 영향을 줘요.', '미들웨어 등록 순서는 실행 결과와 관계없어요.', '인증 전에 보호 리소스가 실행될 수 있어요.'],
    ['라우트 매개변수', 'MapGet("/lessons/{id:int}", (int id) => ...)', '경로 제약은 라우트 매칭에 사용되고 추가 업무 검증은 따로 필요해요.', 'int 제약이 권한·존재 여부까지 검증해요.', '존재하지 않거나 접근 금지된 자료를 처리해요.'],
    ['의존성 주입', 'MapGet("/lessons", (ILessonStore store) => ...)', '엔드포인트 매개변수로 등록된 서비스를 받을 수 있어요.', '매개변수 타입만 적으면 구현체가 자동으로 선택돼요.', '필수 등록 누락이나 서비스 수명 문제가 생겨요.'],
    ['요청 본문', 'app.MapPost("/lessons", (CreateLesson input) => ...);', '역직렬화 뒤에도 업무 규칙·권한·크기 제한을 검증해야 해요.', '요청 본문 타입이 맞으면 값이 모두 신뢰 가능해요.', '조작된 필드가 저장·업무 로직으로 유입돼요.'],
  ]],
  ['API 계약과 HTTP 오류', '상태 코드·검증·문서 계약을 연결해요.', [
    ['HTTP 메서드 의미', 'GET /lessons/12', 'GET은 조회 의도를 나타내며 안전·멱등성 계약을 따라야 해요.', 'GET 요청은 서버 데이터를 바꿔도 표준 의미에 맞아요.', '캐시·재시도·크롤러 동작이 예기치 않게 바뀌어요.'],
    ['검증 응답', 'Results.ValidationProblem(errors);', '입력 오류는 클라이언트가 고칠 수 있도록 안전한 필드 오류로 표현해요.', '유효성 오류에도 내부 스택을 응답해야 해요.', '시스템 경로와 내부 값을 노출해요.'],
    ['404와 403', 'not found · forbidden', '자료 부재와 권한 부족은 정책에 따라 다른 HTTP 상태로 다룰 수 있어요.', '모든 실패는 200과 빈 JSON으로 보내야 해요.', '클라이언트가 성공·오류 흐름을 잘못 처리해요.'],
    ['OpenAPI 계약', 'route metadata → OpenAPI document', 'API 스키마는 경로·입력·응답의 공개 계약을 설명해요.', '문서를 생성하면 실제 권한·정확성이 자동 보장돼요.', '문서와 동작이 달라 통합 문제가 발생해요.'],
    ['버전 호환', 'v1 response contract → existing clients', 'API 변경은 기존 클라이언트 계약과 호환성을 확인해야 해요.', '응답 필드 삭제는 모든 클라이언트에 영향이 없어요.', '기존 앱이 필드 부재를 처리하지 못해요.'],
  ]],
  ['EF Core와 저장소 경계', '쿼리·엔티티·트랜잭션을 실제 DB 보장과 구분해요.', [
    ['엔티티와 DTO', 'LessonEntity → LessonResponse', '저장 모델과 외부 계약을 분리하면 내부 열 노출을 줄일 수 있어요.', 'EF 엔티티를 그대로 직렬화하면 모든 공개 API에 적합해요.', '내부 관계·민감 열이 외부에 드러나요.'],
    ['IQueryable', 'query.Where(item => item.Active)', 'IQueryable 연산은 공급자에 따라 저장소 쿼리로 변환될 수 있어요.', 'IQueryable은 메모리에서 모든 쿼리를 즉시 실행해요.', '데이터베이스 실행 위치와 성능을 잘못 예상해요.'],
    ['추적과 읽기', 'AsNoTracking()', '읽기 전용 조회는 변경 추적이 필요 없는지 확인할 수 있어요.', 'AsNoTracking은 데이터 정확성과 권한을 검증해요.', '성능 옵션을 보안·업무 규칙 검사로 오해해요.'],
    ['N+1 조회', 'one list query + one query per item', '연관 자료 접근이 항목마다 추가 조회를 일으키는지 살펴봐요.', '반복문 안의 데이터 접근은 항상 한 번의 쿼리예요.', '응답 시간과 DB 부하가 항목 수에 비례해 커져요.'],
    ['트랜잭션', 'begin → writes → commit / rollback', '트랜잭션 범위와 실패 시 원자성은 실제 provider 동작을 확인해야 해요.', '메모리 테스트가 실제 DB 격리 수준을 증명해요.', '동시 요청에서 일부만 저장되거나 중복이 생길 수 있어요.'],
  ]],
  ['인증·권한과 보안 입력', '신원 확인과 허용 행위를 따로 검사해요.', [
    ['인증과 권한', 'authenticated ≠ authorized', '인증은 누구인지, 권한은 특정 행위를 허용하는지 판단해요.', '로그인만 했으면 모든 자료를 수정할 수 있어요.', '다른 사용자 리소스를 바꾸는 권한 오류가 나요.'],
    ['최소 권한', 'RequireAuthorization("lesson-editor");', '역할·정책은 작업별 최소 권한으로 적용해요.', '숨겨 둔 버튼이 서버 권한 검사를 대신해요.', '직접 API 요청으로 보호 기능이 호출돼요.'],
    ['입력 검증', 'validate id, length, enum, ownership', '요청한 값과 자원 소유권을 서버 경계에서 확인해요.', '클라이언트 UI에서 검사하면 요청 입력도 안전해요.', '변조 요청이 잘못된 사용자 데이터에 접근해요.'],
    ['비밀·개인정보', 'never log access token or password', '토큰·비밀번호를 응답·로그·저장소에 불필요하게 노출하지 않아요.', '암호화된 로그라면 자격 정보를 무제한 기록해도 돼요.', '로그 복사본에서 인증 정보가 유출돼요.'],
    ['보안 오류 처리', 'generic response + protected diagnostics', '외부에는 필요한 오류만 공개하고 상세 진단은 보호된 로그에 둬요.', '사용자 메시지에 SQL·경로·스택을 포함해야 수정할 수 있어요.', '공격자가 시스템 구조와 입력 경계를 탐색해요.'],
  ]],
  ['성능·캐시·메모리', '측정과 수명에 근거해 최적화해요.', [
    ['프로파일링', 'measure → identify bottleneck → change → measure', '프로파일링 결과로 실제 병목을 찾고 수정 효과를 재측정해요.', '추측만으로 LINQ를 전부 없애면 항상 빨라요.', '가독성만 낮추고 병목은 그대로 남아요.'],
    ['캐시 키', 'cache key includes tenant + locale + id', '캐시 키는 사용자·테넌트·언어 등 결과가 달라지는 조건을 포함해야 해요.', '요청 경로만 같으면 모든 사용자 캐시를 공유해도 돼요.', '다른 사용자 데이터가 반환될 수 있어요.'],
    ['캐시 무효화', 'write → invalidate/update related key', '갱신 경로와 캐시 무효화 정책을 함께 설계해요.', '캐시는 만료 시간을 주면 항상 최신 상태예요.', '오래된 데이터가 표시돼요.'],
    ['할당과 Span', 'ReadOnlySpan<char> view = input.AsSpan();', 'Span 계열은 특정 범위의 데이터를 효율적으로 다룰 때 활용해요.', 'Span은 모든 앱에서 자동으로 더 빠르고 안전해요.', '측정 없이 복잡한 저수준 코드를 늘려요.'],
    ['취소·시간 제한', 'CancellationToken + request timeout', '외부 호출은 시간·취소·재시도 횟수를 제한해야 해요.', '무제한 대기와 자동 재시도가 가장 안정적이에요.', '요청 자원이 고갈되고 트래픽이 증폭돼요.'],
  ]],
  ['비동기 스트림과 동시성', '작업 수명·공유 상태·취소를 설계해요.', [
    ['IAsyncEnumerable', 'await foreach (var item in stream.WithCancellation(token))', '비동기 열거는 값이 준비될 때 순차적으로 받아올 수 있어요.', 'async stream을 만들면 모든 데이터가 미리 메모리에 담겨요.', '메모리와 backpressure를 잘못 예상해요.'],
    ['lock 범위', 'lock (gate) { state.Update(); }', '공유 상태를 보호할 때 짧고 명확한 임계 구역을 사용해요.', 'lock은 await 뒤에도 안전하게 범위를 유지해요.', '컴파일 제한이나 교착 위험을 무시해요.'],
    ['Concurrent 컬렉션', 'ConcurrentDictionary<string, int>', '동시 컬렉션은 개별 연산 안전성을 제공해도 복합 업무 규칙은 별도 동기화가 필요해요.', 'ConcurrentDictionary의 여러 호출 조합은 전체가 원자적이에요.', '중복 작업이나 lost update가 생길 수 있어요.'],
    ['백그라운드 작업', 'BackgroundService.ExecuteAsync(stoppingToken)', '호스트 관리 작업은 종료 신호와 예외 정책에 연결돼야 해요.', '백그라운드 서비스는 앱이 종료돼도 영구 실행돼요.', '종료 때 저장 중인 데이터나 작업을 잃어요.'],
    ['재시도 정책', 'bounded retry + idempotency key', '재시도는 횟수·간격·멱등성 계약과 함께 정해요.', '타임아웃이 나면 결제가 처리되지 않았다고 단정할 수 있어요.', '이미 성공한 업무를 다시 실행해 중복돼요.'],
  ]],
  ['배포·운영·종료', '설정·헬스·종료 동작을 점검해요.', [
    ['환경 설정', 'Development ≠ Production', '환경별 설정은 코드 변경 없이 안전하게 달라야 해요.', '개발 환경의 기본 비밀값을 운영에서 재사용해도 돼요.', '테스트용 계정과 권한이 공개 환경에 남아요.'],
    ['헬스 체크', '/health/live · /health/ready', 'liveness와 readiness는 서로 다른 운영 질문에 답해요.', '헬스 체크 200 응답은 모든 요청이 정상임을 보장해요.', '부분 장애가 가려져 트래픽이 고장난 인스턴스로 가요.'],
    ['graceful shutdown', 'stop accepting → drain → dispose', '종료 과정은 새 작업 수락·진행 중 작업·자원 정리를 나눠요.', '프로세스가 종료되면 모든 요청은 자동 완료돼요.', '응답·저장 중 작업이 잘리거나 자원을 놓쳐요.'],
    ['컨테이너 이미지', 'app + runtime + non-secret config', '이미지는 필요한 런타임과 앱을 전달하고 비밀은 외부 설정으로 주입해요.', '이미지 안에 자격 증명을 구우면 안전해요.', '이미지 재배포·캐시에서 비밀값이 남아요.'],
    ['롤백 계획', 'release N → detect → rollback N-1', '출시 전 이전 버전 복구 조건과 데이터 호환성을 점검해요.', '바이너리만 되돌리면 데이터 변경도 항상 복원돼요.', '코드와 데이터 스키마 버전이 맞지 않아요.'],
  ]],
  ['요구사항과 계층 설계', '사용자 흐름과 도메인 책임을 나눠요.', [
    ['수용 기준', 'Given empty catalog, when opened, then show recovery path', '수용 기준은 입력·행동·기대 결과를 구체화해요.', '“화면이 잘 작동한다”는 조건만으로 경계 동작이 정해져요.', '빈 상태·실패 경로를 테스트에서 빠뜨려요.'],
    ['도메인 모델', 'Course → Lesson → Progress', '도메인 관계와 사용자 작업을 데이터 구조에 반영해요.', 'UI 화면 트리만으로 도메인 규칙을 전부 설명할 수 있어요.', '업무 규칙이 여러 화면에 중복돼요.'],
    ['애플리케이션 서비스', 'CompleteLesson(command) → result', '응용 서비스는 사용자 동작을 조정하고 도메인 규칙을 호출해요.', 'Controller에 저장·검증·알림 로직을 모두 넣어야 단순해요.', '화면·저장소 간 결합이 커져 테스트와 변경이 어려워요.'],
    ['저장소 경계', 'ILessonRepository', '저장소 인터페이스는 교체할 경계를 만들지만 실제 저장 보장은 구현이 결정해요.', '인터페이스 이름만 있으면 데이터가 영구 저장돼요.', '메모리·DB 구현 동작 차이를 누락해요.'],
    ['오류 상태', 'loading · empty · success · failure', '사용자 흐름은 정상 결과와 실패·빈 상태를 각각 설계해요.', '예외가 나면 화면은 언제나 적절한 안내를 보여 줘요.', '사용자가 멈춘 화면에서 다음 행동을 알 수 없어요.'],
  ]],
  ['실무 코드 리뷰와 변경 안전성', '작은 diff·호환성·근거를 검토해요.', [
    ['변경 범위', 'one behavior → focused diff', '한 번에 좁은 변경을 만들면 검토와 원인 추적이 쉬워요.', '요청과 무관한 정리는 리뷰에 영향을 주지 않아요.', '실제 동작 변경을 놓치고 되돌리기 어려워요.'],
    ['계약 변화', 'old caller → new response', '메서드·DTO·API 변경은 기존 호출자에 미치는 영향을 확인해요.', '내부 코드 이름 변경은 어떤 소비자에도 영향이 없어요.', '외부 직렬화 계약이나 테스트가 깨져요.'],
    ['nullable 변경', 'string → string?', 'null 가능성 변경은 모든 호출부의 빈·오류 처리를 다시 검토해요.', '주석 타입 변경만으로 런타임 데이터가 정제돼요.', 'null dereference가 다른 경계로 이동해요.'],
    ['리뷰 질문', 'what invariant does this preserve?', '리뷰는 의도·실패 경로·테스트 근거를 묻고 확인해요.', '작동 예제 하나면 보안·경계 조건도 증명돼요.', '누락된 권한·동시성·성능 조건이 남아요.'],
    ['검증 보고', 'tested · inspected · not run', '실행한 검사와 정적 검토, 미검증 범위를 따로 보고해요.', '코드 리뷰는 빌드 성공과 실제 배포를 증명해요.', '검증 수준을 과장해 위험 판단을 그르쳐요.'],
  ]],
  ['캡스톤: 학습 기록 API 요구 분석', '작은 학습 기록 기능을 요구와 상태로 나눠요.', [
    ['사용자 시나리오', 'catalog → lesson → answer → local progress', '사용자 경로에는 입력·확인·재진입·오류 흐름을 포함해요.', '성공 경로만 있으면 학습 기록 기능이 완성돼요.', '새로고침·중복 제출·저장 실패에서 기록이 깨져요.'],
    ['요청 계약', 'CompleteLessonRequest { LessonId, Answer }', '요청 형식은 필수 값·길이·허용 범위를 명시해요.', 'C# 클래스 타입이 들어오면 요청 값은 검증됐어요.', '손상된 외부 값이 서비스 계층으로 유입돼요.'],
    ['응답 모델', 'ProgressResponse { CompletedAt, Status }', '응답에는 현재 사용자 작업에 필요한 결과만 포함해요.', '내부 엔티티를 전부 반환해야 클라이언트가 편해요.', '내부 필드와 개인 기록이 의도치 않게 노출돼요.'],
    ['실패 계약', '400 validation · 401 unauthenticated · 403 forbidden', '입력·신원·권한 오류를 구분해 안전한 응답을 정해요.', '모든 오류를 성공 응답으로 바꾸면 API가 안정적이에요.', '클라이언트가 실패를 성공 기록으로 저장해요.'],
    ['학습 기록 경계', 'reviewed design ≠ built endpoint', '이 사이트의 캡스톤은 API 설계 연습이고 실제 서버를 실행하지 않아요.', '설계 답안을 제출하면 .NET 서비스가 동작하는 거예요.', '개념 연습을 배포·실행 확인으로 오해해요.'],
  ]],
  ['캡스톤: 서비스·테스트 경계', '계약·협력 객체·검증 층을 정리해요.', [
    ['도메인 책임', 'ProgressPolicy → Complete / Reject', '업무 정책은 UI·HTTP 프레임워크와 구분해 설명해요.', 'Controller의 분기문이 자동으로 도메인 모델이에요.', '같은 정책이 여러 endpoint에서 달라져요.'],
    ['저장 책임', 'IProgressStore.SaveAsync(progress, token)', '저장 경계는 성공·동시 갱신·취소 의미를 정의해야 해요.', '메서드가 Task를 반환하면 영구 저장 성공이 보장돼요.', '저장소 오류를 성공 처리할 수 있어요.'],
    ['단위 테스트 사례', 'valid · missing · forbidden · duplicate', '정상·부재·권한·중복 경계 사례를 분리해 검토해요.', '정상 케이스 하나가 오류 정책까지 검증해요.', '실패 응답과 재시도 중복을 놓쳐요.'],
    ['통합 테스트 설계', 'route + serializer + fake store', '통합 검사는 프레임워크 연결과 공개 응답 계약을 확인해요.', 'Fake store를 쓴 테스트가 실제 SQL 트랜잭션을 검증해요.', 'provider별 쿼리·경합 문제가 남아요.'],
    ['보안 리뷰', 'authorize owner before read/write', '요청자와 자료 소유 관계를 조회·수정 모두에서 확인해요.', '목록에서 숨긴 ID는 직접 요청으로도 접근할 수 없어요.', '예측 가능한 ID를 통해 타인 기록이 조회돼요.'],
  ]],
  ['캡스톤: 데이터·비동기·복구', '작업 시간·오류·진도 복구를 설계해요.', [
    ['멱등 완료', 'same command + idempotency key', '중복 제출에 같은 결과를 주려면 저장 계약을 함께 설계해요.', '버튼을 두 번 누를 수 없게 보이면 중복 요청이 없어요.', '네트워크 재시도에서 완료 기록이 중복돼요.'],
    ['취소 전파', 'request token → service → repository', '취소 신호를 각 비동기 경계까지 전달할 수 있어요.', 'HTTP 연결 종료가 모든 저장 작업을 자동 취소해요.', '요청이 끝난 뒤 작업이 계속 자원을 사용해요.'],
    ['동시 수정', 'version check → conflict result', '동시 갱신은 낙관적 충돌 감지나 직렬화 정책으로 다룰 수 있어요.', '마지막으로 저장한 값은 언제나 모든 사용자에게 올바른 최신 값이에요.', '사용자가 저장한 진행 상황을 덮어써요.'],
    ['복구 흐름', 'restore last known valid backup', '복구는 형식 검증·버전 변환·사용자 확인으로 나눠요.', '백업 파일을 읽으면 그 데이터가 항상 안전하고 완전해요.', '손상되거나 다른 형식의 파일로 정상 진도를 덮어요.'],
    ['관측 기준', 'failure count + safe correlation id', '장애 원인은 개인 정보 없이 상관관계 식별자로 추적할 수 있어요.', '모든 요청 본문을 로그로 남겨야 디버깅이 가능해요.', '학습 답안과 사용자 기록이 로그에 노출돼요.'],
  ]],
  ['캡스톤: 최종 검토와 범위 보고', '검토한 설계와 실제 검증을 구분해요.', [
    ['전체 계층', 'HTTP → application → domain → storage', '요청의 데이터·권한·업무·저장 경계를 순서대로 설명해요.', '계층을 나누면 보안 검사가 자동 완료돼요.', '한 계층의 책임 누락이 경로 끝까지 전달돼요.'],
    ['회귀 계획', 'old cases + new cases', '수정 후 새 요구와 기존 경계 사례를 함께 다시 확인해요.', '새 케이스만 통과하면 예전 기능은 항상 보존돼요.', '기존 동작이 바뀐 회귀를 놓쳐요.'],
    ['출시 체크', 'version · secrets · migrations · rollback', '버전·비밀값·데이터 변경·복구 방법은 별도 출시 항목이에요.', 'dotnet publish만 성공하면 운영 준비가 끝나요.', '설정·권한·데이터 호환 오류가 출시 뒤 나요.'],
    ['기술 한계 보고', 'concept checked · not compiled · not deployed', '이 과정의 문항 정답은 실제 C# 컴파일이나 서비스 테스트 결과가 아니에요.', '선택지 정답이 .NET 앱의 빌드·보안 승인을 뜻해요.', '사용자에게 실행 검증 수준을 오해시켜요.'],
    ['다음 학습 계획', '.NET docs → local SDK → small test project', '실제 개발을 시작할 때 공식 SDK로 프로젝트를 만들고 빌드·테스트해야 해요.', '브라우저 학습 과정만으로 프로덕션 .NET 개발 숙련을 보장해요.', '실제 도구·운영·협업 검증이 빠져요.'],
  ]],
];

const phaseFor = (week) => phases.find((phase) => phase.weeks.includes(week));
const levelFor = (week) => week <= 5 ? '입문' : week <= 10 ? '기초' : week <= 16 ? '중급' : week <= 22 ? '고급' : '실전';
const nonExecutionClaim = '이 사이트에서 C# 코드를 컴파일하거나 .NET 앱을 실행해 결과를 확인했어요.';

function reviewedExercisesFor(week, day, review, id) {
  const index = (week - 1) * 5 + day - 1;
  const ruleAnswer = index % 3;
  const ruleOptions = [[review.rule, review.ruleExplanation], ...review.ruleWrong];
  ruleOptions.splice(ruleAnswer, 0, ruleOptions.shift());
  const ruleCheck = choice(
    id + '-v2-rule', '규칙 적용 확인',
    review.rulePrompt + '\n\n' + review.example,
    ruleOptions, ruleAnswer, review.ruleHint, review.ruleExplanation,
  );
  const trace = shortAnswer(
    id + '-v3-trace', '예제 결과 추적',
    review.tracePrompt + '\n\n' + review.example,
    [review.traceAnswer, ...(review.traceAlternatives ?? [])], review.traceHint, review.traceExplanation, 'case-sensitive',
  );
  trace.legacyIds = [id + '-v2-trace', id + '-trace'];
  const effectAnswer = (index + 1) % 3;
  const effectOptions = [[review.effectCorrect, review.effectExplanation], ...review.effectWrong];
  effectOptions.splice(effectAnswer, 0, effectOptions.shift());
  const effect = choice(
    id + '-v2-effect', '실무 영향 판단',
    review.effectPrompt,
    effectOptions, effectAnswer, review.effectHint, review.effectExplanation,
  );
  return [ruleCheck, trace, effect];
}

function exercisesFor(week, day, record) {
  const [concept, example, rule, misconception, consequence] = record;
  const id = 'csharp-w' + String(week).padStart(2, '0') + '-d' + day;
  const reviewed = reviewedFor(week, day);
  if (reviewed) return reviewedExercisesFor(week, day, reviewed, id);
  const ruleOptions = [
    [rule, '현재 확인한 C#/.NET 계약에 맞는 설명이에요.'],
    [misconception, concept + '의 타입·수명·플랫폼 경계를 놓친 설명이에요.'],
    [nonExecutionClaim, '이 트랙은 코드 읽기와 설계 판단만 제공하고 앱을 실행하지 않아요.'],
  ];
  const ruleAnswer = (week + day) % 3;
  const rightRule = ruleOptions.shift();
  ruleOptions.splice(ruleAnswer, 0, rightRule);
  const understanding = choice(
    id + '-rule', concept + ' 규칙 확인',
    '아래는 C#/.NET 개념 코드예요. 올바른 설명을 고르세요.\n\n' + example,
    ruleOptions, ruleAnswer, concept + '의 타입·플랫폼·수명 규칙을 떠올려 보세요.', concept + '의 핵심 규칙이에요. ' + rule,
  );
  const recall = shortAnswer(
    id + '-recall', concept + ' 용어 확인',
    '오늘의 핵심 개념 이름을 적어 보세요.\n\n' + concept + ': ' + rule,
    [concept], '오늘 코드에서 다룬 개념의 이름을 입력하세요.', concept + '의 핵심 규칙이에요. ' + rule,
  );
  const effectOptions = [
    [consequence, '이 오해로 생길 수 있는 직접적인 영향이에요.'],
    [rule, '올바른 규칙이지만 질문은 잘못된 가정의 결과를 물어요.'],
    [nonExecutionClaim, '개념 문항은 컴파일·런타임 결과를 증명하지 않아요.'],
  ];
  const effectAnswer = (week * 2 + day) % 3;
  const rightEffect = effectOptions.shift();
  effectOptions.splice(effectAnswer, 0, rightEffect);
  const consequenceCheck = choice(
    id + '-effect', concept + ' 영향 판단',
    '“' + misconception + '”이라고 가정하면 발생할 수 있는 가장 직접적인 영향은 무엇인가요?',
    effectOptions, effectAnswer, '잘못된 가정이 데이터·호출자·사용자 흐름에 미치는 영향을 생각해 보세요.', concept + '에서 이 오해를 따르면 ' + consequence,
  );
  return [understanding, recall, consequenceCheck];
}

function reviewedFor(week, day) {
  return csharpReviewedOpeningWeeks[week]?.[day - 1]
    ?? csharpReviewedMiddleWeeks[week]?.[day - 1]
    ?? csharpReviewedCollectionWeeks[week]?.[day - 1]
    ?? csharpReviewedDesignWeeks[week]?.[day - 1]
    ?? csharpReviewedBehaviorWeeks[week]?.[day - 1]
    ?? csharpReviewedOperationsWeeks[week]?.[day - 1]
    ?? csharpReviewedWebApiWeeks[week]?.[day - 1]
    ?? csharpReviewedDataSecurityWeeks[week]?.[day - 1]
    ?? csharpReviewedConcurrencyOperationsWeeks[week]?.[day - 1]
    ?? csharpReviewedCapstoneWeeks[week]?.[day - 1]
    ?? csharpReviewedFinalCapstoneWeeks[week]?.[day - 1];
}

const lessons = weeks.map((spec, index) => {
  const week = index + 1;
  const phase = phaseFor(week);
  const sessions = spec[2].map((record, indexInWeek) => {
    const day = indexInWeek + 1;
    const [concept, example, rule] = record;
    const reviewed = reviewedFor(week, day);
    return studySession(
      day, concept, reviewed?.objective ?? (spec[0] + '에서 ' + concept + '의 역할을 설명해요.'),
      reviewed
        ? reviewed.rule
        : rule,
      reviewed?.example ?? example, exercisesFor(week, day, record),
    );
  });
  return weeklyLesson({
    id: 'csharp-week-' + String(week).padStart(2, '0'),
    topicId: phase.id, week, title: spec[0],
    objective: spec[1],
    intro: '',
    points: [],
    example: spec[2][0][1],
    sessions, difficulty: levelFor(week),
  });
});

export const csharpCourseExpansion = {
  phases,
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: lessons.length }, (_, index) => index + 1),
};
