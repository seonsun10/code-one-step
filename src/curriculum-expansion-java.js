import { choice, locateError, shortAnswer, versionedShortAnswer, lesson } from './curriculum-tools.js';

const java = (id, title, prompt, options, answerIndex, hint, explanation) =>
  choice(id, title, prompt, options, answerIndex, hint, explanation);

export const javaExpansion = {
  topics: [
    {
      id: 'java-basics',
      stage: 1,
      title: '값과 조건',
      objective: '타입이 있는 값을 선언하고 조건에 따라 흐름을 나눠요.',
      lessonIds: ['java-variables', 'java-conditions'],
    },
    {
      id: 'java-control',
      stage: 2,
      title: '반복과 객체의 기본',
      objective: '반복으로 자료를 처리하고 메서드와 클래스로 코드를 나눠요.',
      lessonIds: ['java-loops', 'java-methods', 'java-classes'],
    },
    {
      id: 'java-modeling',
      stage: 3,
      title: '자료 모델과 오류 처리',
      objective: '인터페이스·컬렉션·예외로 변화와 실패를 다뤄요.',
      lessonIds: ['java-interfaces-records', 'java-collections-generics', 'java-exceptions'],
    },
    {
      id: 'java-data-flow',
      stage: 4,
      title: '데이터 흐름과 동시성',
      objective: '스트림과 동시성 코드를 읽고 안전하게 검증해요.',
      lessonIds: ['java-lambdas-streams', 'java-concurrency-tests'],
    },
    {
      id: 'java-production',
      stage: 5,
      title: '실전 설계와 성능',
      objective: 'JVM 관점의 측정과 알고리즘 선택으로 문제를 완성해요.',
      lessonIds: ['java-jvm-performance', 'java-algorithms-capstone'],
    },
  ],
  lessonOrder: [
    'java-variables', 'java-conditions',
    'java-loops', 'java-methods', 'java-classes',
    'java-interfaces-records', 'java-collections-generics', 'java-exceptions',
    'java-lambdas-streams', 'java-concurrency-tests',
    'java-jvm-performance', 'java-algorithms-capstone',
  ],
  lessons: [
    lesson('java-interfaces-records', 'java-modeling', '인터페이스와 record로 모델 표현하기', '14분', '구현의 약속과 읽기 전용 데이터를 알맞게 구분해요.',
      '인터페이스는 구현체가 지켜야 할 동작의 약속을 적는 곳이에요. Java의 `record`는 주로 값을 운반하는 불변 데이터 모델을 간결하게 표현합니다. 둘은 서로 대체 관계가 아니라 맡는 역할이 달라요.',
      ['인터페이스는 클래스가 구현해야 할 동작을 약속해요.', '`record`의 구성 요소는 접근자와 상태를 함께 선언해요.', '값의 모양은 `record`, 여러 구현의 공통 동작은 인터페이스로 표현하는지 먼저 생각해요.'],
      'interface Notifier {\n    void send(String message);\n}\n\nrecord Course(String title, int minutes) {}', [
        java('java-inheritance-choice-v2', '기본 동작 상속하기', 'EmailNotifier가 `BaseNotifier`의 기본 동작을 물려받아 필요한 동작을 확장하려고 합니다. 두 클래스의 관계로 알맞은 선언은 무엇인가요?', [
          ['`class EmailNotifier extends BaseNotifier {}`', '`extends`는 클래스가 한 상위 클래스의 동작과 상태를 물려받는 관계를 선언해요.'],
          ['`class EmailNotifier implements BaseNotifier {}`', '`implements` 뒤에는 인터페이스가 와야 하므로 일반 클래스인 BaseNotifier와 맞지 않아요.'],
          ['`class BaseNotifier extends EmailNotifier {}`', '이 선언은 상속 방향을 반대로 두어 EmailNotifier가 기본 동작을 물려받지 못해요.'],
        ], 0, '기본 동작을 가진 부모 클래스와 그 동작을 확장할 자식 클래스의 방향을 확인해 보세요.',
        'EmailNotifier가 BaseNotifier를 확장하면 상위 클래스의 기본 동작을 물려받고 필요한 동작을 추가하거나 재정의할 수 있어요.'),
        locateError('java-override-locate-v2', '@Override 시그니처 점검', '`@Override` 선언이 상위 클래스 메서드를 실제로 재정의하도록 수정해야 하는 줄을 고르세요.', 'Java', [
          'class Notifier {',
          '  public void send(String message) {}',
          '}',
          'class EmailNotifier extends Notifier {',
          '  @Override',
          '  public void send() {}',
          '}',
        ], [6], '재정의 메서드의 이름과 매개변수 목록이 상위 메서드와 같은지 비교해 보세요.',
        '6번 줄은 `public void send(String message) {}`로 고쳐야 해요. 매개변수가 빠져 있으면 상위 메서드를 재정의하지 못해 `@Override` 검사가 실패합니다.'),
        shortAnswer('java-abstract-short-v2', '추상 클래스 사용', '추상 메서드가 남아 있는 `Report`를 `new Report()`로 직접 만들 수 있나요? `직접 만들 수 없다` 또는 `아니다`로 답하세요.',
          ['직접 만들 수 없다', '직접 생성할 수 없다', '아니다'], '추상 클래스는 공통 뼈대와 미완성 동작을 두며, 구체 클래스가 추상 메서드를 구현해야 해요.',
          '추상 클래스 자체는 직접 인스턴스화할 수 없어요. 추상 메서드를 구현한 구체 하위 클래스를 만들어 사용합니다.'),
      ], '중급'),

    lesson('java-collections-generics', 'java-modeling', '컬렉션과 제네릭으로 타입 지키기', '15분', '자료의 성격에 맞는 컬렉션을 고르고 제네릭으로 원소 타입을 제한해요.',
      '`List`는 순서와 중복을 보존하고, `Set`은 중복을 허용하지 않으며, `Map`은 키로 값을 찾습니다. 제네릭은 컬렉션 안에 어떤 타입을 넣을 수 있는지 컴파일 시점에 확인하게 해 줍니다.',
      ['순서와 중복이 필요하면 `List`를 고려해요.', '키로 값을 찾을 때는 `Map<K, V>`를 사용해요.', '`List<String>`은 문자열 외의 값을 넣으려는 실수를 컴파일 단계에서 잡아줘요.'],
      'List<String> tags = new ArrayList<>();\ntags.add("java");\nMap<String, Integer> minutesByCourse = Map.of("Java", 40);', [
        java('java-collections-choice-v2', '순서와 중복 보존하기', '`Java`, `Python`, `Java`를 입력한 순서와 중복까지 그대로 보존하려면 어떤 컬렉션이 알맞나요?', [
          ['`Set<String>`', 'Set은 같은 값의 중복을 허용하지 않으므로 두 번째 Java가 별도로 남지 않아요.'],
          ['`List<String>`', 'List는 입력 순서와 중복 원소를 모두 보존해요.'],
          ['`Map<String, String>`', 'Map은 키와 값의 관계를 표현하므로 단순한 순서 있는 목록 요구와 맞지 않아요.'],
        ], 1, '순서를 보존하는지와 같은 값을 여러 번 담을 수 있는지를 각각 확인해 보세요.',
        '`List<String>`은 입력 순서와 중복을 보존합니다. 순서가 필요 없고 중복만 제거하려는 요구라면 `Set`이 더 알맞아요.'),
        locateError('java-generics-locate', '제네릭 타입 불일치 찾기', '문자열 목록에 숫자를 넣으려는 줄을 선택하세요.', 'Java', [
          'List<String> names = new ArrayList<>();',
          'names.add("Mina");',
          'names.add(3);',
        ], [3], '꺾쇠 안에 적힌 타입이 컬렉션 원소의 타입이에요.',
        '3번 줄은 `List<String>`에 `int` 값을 넣으려 하므로 컴파일되지 않습니다. 문자열로 넣으려면 `names.add("3")`처럼 의도를 분명히 해야 합니다.'),
        versionedShortAnswer('java-map-short', 'Map의 값 찾기', '`Map<String, Integer> minutesByCourse`에서 키가 `"Java"`인 값을 읽는 메서드 호출을 적으세요.',
          ['minutesByCourse.get("Java")'], 'Map에서 값을 찾을 때는 키를 전달하는 메서드를 사용해요.',
          '`minutesByCourse.get("Java")`는 해당 키의 값을 반환합니다. 키가 없을 수 있는 경우에는 반환값이 `null`일 수 있으므로 후속 처리도 설계해야 해요.', 'case-sensitive'),
      ], '중급'),

    lesson('java-exceptions', 'java-modeling', '예외를 원인에 맞게 처리하기', '14분', '실패를 숨기지 않고 복구 가능한 경우와 호출자에게 알려야 할 경우를 나눠요.',
      '예외는 정상 흐름 밖의 실패를 알리는 신호입니다. 복구할 수 없는 예외를 빈 값으로 숨기면 원인을 잃을 수 있어요. 필요한 정보를 담아 처리하거나, 현재 계층에서 처리할 근거가 없다면 호출자에게 전파합니다.',
      ['예외를 잡을 때는 실제로 복구하거나 의미 있는 정보를 더할 수 있는지 확인해요.', '`try` 블록에서 생긴 예외는 대응하는 `catch`에서 처리할 수 있어요.', '리소스는 `try`-with-resources로 닫는 책임을 명확히 할 수 있어요.'],
      'try (BufferedReader reader = Files.newBufferedReader(path)) {\n    return reader.readLine();\n}', [
        java('java-exception-choice', '예외를 삼키지 않기', '파일을 읽는 도중 예외가 났고, 이 메서드에서는 복구할 방법이 없습니다. 가장 알맞은 선택은 무엇인가요?', [
          ['예외에 맥락을 더해 호출자에게 전파하거나 선언한다', '현재 계층에서 복구할 수 없다면 실패 원인을 보존해 상위에서 판단하게 할 수 있어요.'],
          ['모든 예외를 무시하고 다음 줄을 실행한다', '실패를 숨기면 데이터 손상이나 잘못된 결과가 뒤늦게 나타날 수 있어요.'],
          ['아무 설명 없이 `catch`에서 `null`을 반환한다', 'null은 파일에 빈 내용이 있었는지 읽기에 실패했는지 구분하기 어렵게 만들어요.'],
        ], 0, '호출한 쪽이 실패 여부와 원인을 구분할 수 있는지 살펴보세요.',
        '복구 근거가 없다면 예외를 숨기지 않는 편이 안전합니다. 예외 유형과 작업 맥락을 보존하면 호출자가 재시도, 사용자 안내, 기록 같은 정책을 정할 수 있어요.'),
        locateError('java-checked-exception-locate-v2', 'checked 예외 처리 누락 찾기', '`readLine()`에서 발생할 수 있는 checked 예외를 선언하거나 처리하지 않은 줄을 고르세요.', 'Java', [
          'try {',
          '    BufferedReader reader = new BufferedReader(new StringReader("Java"));',
          '    String firstLine = reader.readLine();',
          '}',
        ], [3], '`readLine()`이 던지는 checked 예외를 컴파일러가 어떤 방식으로 처리하도록 요구하는지 확인해 보세요.',
        '3번 줄의 `readLine()`은 `IOException`을 던질 수 있습니다. 호출 메서드에 `throws IOException`을 선언하거나, 적절한 `catch`에서 처리해야 합니다.'),
        versionedShortAnswer('java-catch-short-v2', 'catch 절 순서', '`IOException`과 `Exception`을 각각 잡으려면 어떤 타입의 `catch` 절을 먼저 두어야 하나요?',
          ['IOException', 'IOException 먼저', '구체적인 예외', '구체적인 예외 먼저', '더 구체적인 예외 먼저'], '상위 예외가 하위 예외를 먼저 잡아 버리는지 생각해 보세요.',
          '더 구체적인 `IOException`을 먼저 처리하고, 그 뒤에 상위 타입인 `Exception`을 둬야 합니다. 반대 순서면 뒤의 `IOException` 절에 도달할 수 없어 컴파일 오류가 납니다.', 'case-sensitive'),
      ], '중급'),

    lesson('java-lambdas-streams', 'java-data-flow', '람다와 스트림의 데이터 흐름 읽기', '16분', '중간 연산과 최종 연산을 구분하고 스트림을 한 번만 소비해요.',
      '람다는 짧은 동작을 값처럼 전달하는 표현입니다. 스트림 파이프라인은 `filter`, `map` 같은 중간 연산을 연결하고 `toList`, `count` 같은 최종 연산에서 결과를 만듭니다. 스트림은 한 번 최종 연산으로 소비하면 다시 사용할 수 없어요.',
      ['`filter`는 조건에 맞는 원소만 남겨요.', '`map`은 각 원소를 다른 값으로 변환해요.', '스트림은 재사용하지 말고 필요하면 새 스트림을 만들어요.'],
      'List<String> names = List.of("ann", "bob");\nList<String> upper = names.stream()\n    .filter(name -> name.length() == 3)\n    .map(String::toUpperCase)\n    .toList();', [
        java('java-lambda-choice-v2', 'Runnable 람다 읽기', '`Runnable task = () -> save();`의 의미로 알맞은 것은 무엇인가요?', [
          ['task를 선언하는 즉시 save가 실행된다', '람다 본문은 Runnable의 run 메서드가 호출될 때 실행돼요.'],
          ['실행할 동작을 Runnable 값으로 만들고, run 호출 때 save를 실행한다', '매개변수가 없는 람다가 Runnable의 run 동작을 구현해요.'],
          ['save의 반환값을 Runnable에 저장한다', 'Runnable은 반환값이 없는 동작을 표현해요.'],
        ], 1, '람다를 값으로 만드는 시점과 그 동작을 호출하는 시점을 구분해 보세요.',
        '이 문장은 `save()` 호출을 감싼 Runnable 동작을 만듭니다. 이후 `task.run()`을 호출해야 람다 본문이 실행돼요.'),
        locateError('java-predicate-locate-v2', 'Predicate 반환값 오류 찾기', '`Predicate<Integer>`의 람다 결과가 조건식의 참·거짓 값이 되지 않는 줄을 고르세요.', 'Java', [
          'Predicate<Integer> isEven = number -> number % 2;',
          'boolean result = isEven.test(4);',
        ], [1], '`Predicate<T>`의 추상 메서드는 어떤 타입을 반환해야 하는지 확인해 보세요.',
        '1번 줄은 나머지 연산의 `int` 값을 반환해 `Predicate<Integer>`의 `boolean` 반환 계약과 맞지 않습니다. `number -> number % 2 == 0`처럼 짝수 조건을 만들어야 합니다.'),
        shortAnswer('java-function-short-v2', 'Function 결과 읽기', '`Function<String, Integer> length = String::length`에서 `length.apply("Java")`의 반환값은 얼마인가요?',
          ['4'], '`String::length`는 문자열의 길이를 정수로 반환해요.',
          '`"Java"`에는 문자 네 개가 있으므로 `length.apply("Java")`의 반환값은 `4`입니다. `Function<T, R>`은 입력 타입 T의 값을 R 타입으로 바꾸는 동작을 나타내요.'),
      ], '고급'),

    lesson('java-concurrency-tests', 'java-data-flow', '동시성과 테스트의 경계 세우기', '17분', '공유 가변 상태의 위험을 이해하고 결정적인 단위 테스트를 작성해요.',
      '여러 스레드가 같은 변경 가능한 값을 동시에 읽고 쓰면 실행 순서에 따라 결과가 달라질 수 있습니다. 동시성 코드는 작은 단위로 나누고, 테스트에서는 시간에 의존하는 대기보다 결과를 관찰할 수 있는 동기화 방식을 선택해야 해요.',
      ['`count++`는 읽기·계산·쓰기의 여러 단계로 이루어질 수 있어요.', '공유 상태를 줄이거나 동기화 도구를 선택해 경합을 관리해요.', '테스트는 임의의 `sleep`보다 완료 신호나 제어 가능한 의존성을 선호해요.'],
      'AtomicInteger count = new AtomicInteger();\ncount.incrementAndGet();', [
        java('java-filter-choice-v2', 'filter 조건 적용', '`scores.stream().filter(score -> score >= 60)`은 어떤 역할을 하나요?', [
          ['모든 점수를 평균 하나로 합친다', '하나로 합치는 연산은 `filter`가 아니라 별도의 최종 연산이 필요해요.'],
          ['60점 이상인 점수만 다음 단계로 전달한다', '`filter`는 조건이 참인 원소를 남기고 원래 목록은 수정하지 않아요.'],
          ['각 점수에 60을 더한다', '각 원소의 값을 바꾸는 변환은 `map`의 역할이에요.'],
        ], 1, '조건을 통과한 원소를 거르는지, 값을 바꾸거나 합치는지 구분해 보세요.',
        '`filter`는 조건이 참인 점수만 스트림의 다음 단계로 보냅니다. 이 연산 자체가 평균 계산을 하거나 원본 목록을 바꾸지는 않아요.'),
        locateError('java-map-locate-v2', 'map 결과 타입 불일치 찾기', '`String::length`가 반환하는 타입과 목록 선언이 맞지 않는 줄을 고르세요.', 'Java', [
          'List<String> names = Arrays.asList("Mina", "Jin");',
          'List<String> lengths = names.stream()',
          '    .map(String::length)',
          '    .collect(Collectors.toList());',
        ], [2], '`map` 뒤의 각 원소 타입이 String인지 Integer인지 따라가 보세요.',
        '2번 줄은 `List<String>`을 선언하지만 `.map(String::length)`는 `Stream<Integer>`를 만듭니다. `List<Integer> lengths`로 선언해야 타입이 맞아요.'),
        versionedShortAnswer('java-flatmap-short-v2', 'flatMap 결과 펼치기', '`["Java APIs", "clean code"]`에 공백 분리 후 `flatMap`을 적용한 결과를 목록으로 적으세요.',
          ['[Java, APIs, clean, code]', '[Java,APIs,clean,code]'], '`flatMap`은 각 입력의 여러 결과를 한 흐름으로 펼쳐요.',
          '각 문장은 두 단어로 나뉘고 `flatMap`이 네 단어를 하나의 흐름으로 이어 `[Java, APIs, clean, code]`를 만듭니다.', 'case-sensitive'),
      ], '고급'),

    lesson('java-jvm-performance', 'java-production', 'JVM 성능을 측정하며 개선하기', '17분', '추측 대신 측정으로 병목을 찾고 결과의 범위를 설명해요.',
      '성능 문제는 코드 한 줄만 보고 확정할 수 없습니다. 입력 규모, 워밍업, 할당량, 지연 시간 같은 관찰 기준을 정하고 측정한 뒤 바꾼 부분이 실제로 효과가 있는지 비교해야 해요. Java 25 LTS의 안정 기능을 기준으로 하며, preview 기능은 이 단원의 기본 해법에 포함하지 않습니다.',
      ['성능 개선 전후는 같은 입력과 측정 기준으로 비교해요.', '프로파일러 결과는 실제 병목 후보를 좁히는 근거예요.', 'Java preview 기능은 `--enable-preview`가 필요한 별도 상태이므로 안정 API처럼 가정하지 않아요.'],
      'long startedAt = System.nanoTime();\nrunTask();\nlong elapsedNanos = System.nanoTime() - startedAt;', [
        java('java-thread-choice-v2', 'Thread 시작 시점', '`Thread worker = new Thread(task);` 뒤에 `worker.start()`를 호출하면 어떤 일이 일어나나요?', [
          ['task의 실행이 새 스레드에 예약된다', '`start()`는 새 실행 흐름을 시작하고 그 안에서 `run()`을 호출해요.'],
          ['task가 끝날 때까지 현재 스레드가 자동으로 대기한다', '완료를 기다리려면 `join()` 같은 별도 동기화가 필요해요.'],
          ['worker 객체가 만들어지는 즉시 task가 이미 실행됐다', '생성자는 작업을 연결할 뿐 실행을 시작하지 않아요.'],
        ], 0, '작업을 연결하는 생성자, 새 스레드를 시작하는 `start`, 현재 흐름에서 메서드를 부르는 `run`을 나눠 보세요.',
        '`start()`는 별도의 실행 흐름을 시작합니다. 직접 `run()`을 호출하면 보통 현재 스레드에서 일반 메서드처럼 실행돼요.'),
        locateError('java-visibility-locate-v2', '공유 중지 상태의 가시성 문제 찾기', '한 스레드가 바꾼 중지 상태를 다른 스레드가 계속 읽을 때 동기화·가시성 보장이 없는 선언을 고르세요.', 'Java', [
          'class Worker {',
          '    private boolean stopped;',
          '    void stop() { stopped = true; }',
          '    void work() { while (!stopped) Thread.yield(); }',
          '}',
        ], [2], '서로 다른 스레드의 읽기와 쓰기 사이에 어떤 happens-before 보장이 있는지 확인해 보세요.',
        '2번 줄은 공유 boolean의 가시성을 보장하지 않습니다. 이 단순한 플래그라면 `volatile`로 선언하거나, 같은 lock 안에서 읽고 쓰는 등 적절한 동기화가 필요해요. `volatile`은 여러 단계의 복합 갱신까지 원자적으로 만들지는 않습니다.'),
        versionedShortAnswer('java-atomic-short-v2', '원자적 정수 타입', '정수 값을 원자적으로 증가시키는 Java 동시성 API 타입의 이름을 적으세요.',
          ['AtomicInteger'], '일반 `int`의 `count++`와 원자적 증가 API를 비교해 보세요.',
          '`AtomicInteger`는 원자적 증가와 읽기 메서드를 제공합니다. 여러 필드를 함께 변경하는 불변 조건까지 자동으로 보호하는 것은 아니므로 동기화 범위를 따로 설계해야 해요.', 'case-sensitive'),
      ], '고급'),

    lesson('java-algorithms-capstone', 'java-production', '알고리즘 선택으로 학습 기록 완성하기', '20분', '요구사항에 맞는 자료 구조와 시간 복잡도를 설명하며 작은 기능을 설계해요.',
      '실전 문제에서는 먼저 입력 크기와 필요한 조회·삽입·정렬 작업을 분명히 해야 합니다. 예를 들어 학습 기록을 키로 빠르게 찾는다면 `Map`을 고려할 수 있어요. 자료 구조의 평균 성능은 구현과 데이터 분포에 따라 달라질 수 있으므로, 무조건적인 약속 대신 요구 조건을 함께 설명합니다.',
      ['문제의 입력 크기와 필요한 연산을 먼저 적어요.', '키로 학습 기록을 찾는 요구에는 `Map`을 고려할 수 있어요.', '정렬이 필요한 시점과 중복 처리 규칙을 명확히 한 뒤 구현을 고르세요.'],
      'Map<String, Integer> completedByTrack = new HashMap<>();\ncompletedByTrack.put("java", 12);\nint completed = completedByTrack.getOrDefault("java", 0);', [
        java('java-heap-choice-v2', '객체 저장 영역', '`Course course = new Course("Java")`를 실행해 만든 `Course` 인스턴스는 JVM의 어느 메모리 영역에 놓이나요?', [
          ['각 스레드의 호출 프레임을 저장하는 스택', '지역 변수와 참조가 호출 프레임에 포함될 수 있지만, 객체 인스턴스의 저장 영역을 뜻하지는 않아요.'],
          ['객체와 배열을 위한 힙', 'JVM 명세에서 객체와 배열은 힙에 할당돼요.'],
          ['클래스 메타데이터 영역', '클래스 메타데이터와 개별 Course 인스턴스는 서로 다른 종류의 데이터예요.'],
        ], 1, '지역 변수 `course`가 들고 있는 참조와 `new Course(...)`가 만든 객체를 구분해 보세요.',
        '`course`라는 지역 참조는 호출 프레임의 지역 변수이고, `new Course(...)`가 만든 객체 인스턴스는 힙에 놓입니다. 최적화된 실행의 실제 물리 배치는 JVM 구현에 따라 달라질 수 있어요.'),
        locateError('java-allocation-locate-v2', '반복 할당 지점 찾기', '할당량을 관찰할 때 반복마다 새 `Point` 객체를 만드는 줄을 고르세요.', 'Java', [
          'List<Point> points = new ArrayList<>();',
          'for (int index = 0; index < 3; index++) {',
          '    points.add(new Point(index, index));',
          '}',
          'System.out.println(points.size());',
        ], [3], '`new Point(...)`가 반복문 안에서 몇 번 실행되는지 세어 보세요.',
        '3번 줄은 반복할 때마다 새 객체를 만들어 세 번 할당합니다. 할당이 있다는 사실만으로 성능 결함이라고 단정하지 말고, 대표 입력을 프로파일링해 실제 비용을 확인해야 해요.'),
        shortAnswer('java-warmup-short-v2', '워밍업 목적', '성능을 측정하기 전에 같은 코드 경로를 여러 번 실행해 초기화·JIT 영향을 줄이는 준비 과정을 무엇이라고 하나요?',
          ['워밍업', 'jvm 워밍업', 'warmup', 'warm-up'], '최초 실행의 초기화 비용과 반복 실행 후 상태를 구분해 보세요.',
          '워밍업은 측정 전에 대표 코드 경로를 반복 실행해 초기화·JIT 등 실행 상태가 자리잡도록 돕는 과정입니다. 특정 컴파일 최적화가 반드시 발생한다고 보장하지는 않아요.'),
      ], '실전'),
  ],
  extraExercises: {
    'java-variables': [
      java('java-variables-type-choice', '큰 정수형 선택', '32비트 `int` 범위를 넘을 수 있는 정수 값을 저장하려고 합니다. 일반적으로 어떤 기본형을 먼저 고려할까요?', [
        ['`boolean`', 'boolean은 true 또는 false만 저장해요.'],
        ['`long`', '`long`은 `int`보다 넓은 범위의 부호 있는 정수를 저장해요.'],
        ['`char`', 'char는 단일 UTF-16 코드 단위를 표현하는 데 쓰여요.'],
      ], 1, '정수 기본형의 저장 범위가 서로 다르다는 점을 떠올려 보세요.',
      'int 범위를 넘을 수 있는 정수에는 long을 고려합니다. 아주 큰 수나 정확한 10진 계산에는 별도의 타입과 요구사항 검토가 필요할 수 있어요.'),
      locateError('java-variable-locate', '선언 뒤 재대입 찾기', '값을 바꿀 수 없도록 선언한 변수에 다시 값을 대입하는 줄을 고르세요.', 'Java', [
        'final int maxAttempts = 3;',
        'int attempts = 0;',
        'maxAttempts = 4;',
      ], [3], '`final`로 선언한 지역 변수의 값을 다시 대입할 수 있는지 보세요.',
      '3번 줄은 final 변수 `maxAttempts`에 다시 값을 대입하므로 컴파일되지 않습니다. 바뀌는 값이라면 처음부터 final이 아닌 변수로 선언해야 해요.'),
    ],
    'java-conditions': [
      java('java-condition-choice', '문자열 내용 비교', '두 문자열이 같은 글자 순서를 가지는지 비교할 때 가장 알맞은 표현은 무엇인가요?', [
        ['`left == right`', '==는 두 참조가 같은 객체를 가리키는지 비교하므로 내용 비교의 일반적인 방법이 아니에요.'],
        ['`left.equals(right)`', 'equals는 문자열 객체의 내용을 비교해요.'],
        ['`left = right`', '=는 값을 대입하는 연산자라 비교 결과를 만들지 않아요.'],
      ], 1, '문자열 객체 자체가 같은지와 글자 내용이 같은지를 구분해 보세요.',
      '문자열 내용 비교에는 `equals`를 사용합니다. left가 null일 수 있으면 상수 쪽에서 호출하거나 null 정책을 먼저 정해야 해요.'),
      shortAnswer('java-condition-short', '`else if`의 실행 조건', '`if` 조건이 거짓이고 앞선 `else if`가 없다면 `else` 블록은 실행될까요? `실행된다` 또는 `예`로 답하세요.',
        ['실행된다', '예'], 'else는 앞의 조건들이 맞지 않을 때의 분기예요.',
        '앞선 조건이 모두 거짓이면 else 블록이 실행됩니다. 조건의 순서가 겹치는 경우 먼저 만나는 참 조건이 선택됩니다.'),
    ],
    'java-loops': [
      java('java-loop-choice', '향상된 for문 선택', '배열의 모든 값을 읽기만 하고 인덱스는 필요하지 않습니다. 가장 읽기 쉬운 반복문은 무엇인가요?', [
        ['`for (int i = values.length; i >= 0; i++) { total += values[i]; }`', '첫 접근부터 values.length를 사용해 범위를 벗어나며 종료 조건도 맞지 않아요.'],
        ['`while (true) { total += values[0]; }`', '무한 반복이며 배열 전체를 순회하지 않아요.'],
        ['`for (int value : values) { total += value; }`', '향상된 for문은 각 원소를 직접 읽을 때 의도를 간결하게 보여 줘요.'],
      ], 2, '인덱스가 정말 필요한지 먼저 생각해 보세요.',
      '원소 값만 필요하면 향상된 for문이 범위 계산 실수를 줄여 줍니다. 인덱스나 일부 구간이 필요할 때는 일반 for문이 더 알맞을 수 있어요.'),
      shortAnswer('java-loop-short', '`break`의 효과', '반복문 안에서 `break`를 만나면 현재 반복은 어떻게 될까요? `반복문을 종료한다`로 답하세요.',
        ['반복문을 종료한다', '반복문 종료'], 'break는 다음 반복으로 건너뛰는 continue와 역할이 달라요.',
        'break는 가장 가까운 반복문 또는 switch를 종료합니다. 다음 반복만 건너뛰려면 continue를 사용해요.'),
    ],
    'java-methods': [
      java('java-method-choice', '반환형 고르기', '성공 여부만 알려 주는 `isComplete` 메서드의 가장 알맞은 반환형은 무엇인가요?', [
        ['`void`', 'void는 호출자에게 값을 돌려주지 않아요.'],
        ['`boolean`', 'true 또는 false 두 상태를 돌려주는 메서드에는 boolean이 맞아요.'],
        ['`String`', '문자열을 반환할 이유가 없는 성공 여부에는 boolean이 더 명확해요.'],
      ], 1, '메서드 결과가 가질 수 있는 값의 종류를 생각해 보세요.',
      '참·거짓 판단 결과에는 boolean을 반환하면 호출하는 코드의 조건식에서도 자연스럽게 사용할 수 있어요.'),
      locateError('java-method-locate', '반환 없는 경로 찾기', '반환형이 int인 메서드에서 결과를 반환하지 않고 끝날 수 있는 줄과 관련된 조건문을 고르세요.', 'Java', [
        'static int absolute(int value) {',
        '    if (value >= 0) {',
        '        return value;',
        '    }',
        '}',
      ], [2], '조건이 거짓일 때 메서드 끝까지 가면 int 값이 반환되는지 확인해 보세요.',
      '2번 줄의 조건이 거짓이면 메서드는 반환 없이 끝납니다. 음수일 때도 `return -value;`처럼 int를 반환하는 경로를 추가해야 해요.'),
    ],
    'java-classes': [
      java('java-class-choice', '인스턴스마다 다른 값', '각 Course 객체마다 서로 다른 제목을 보관하고 생성자에서 초기화하려 합니다. 가장 알맞은 필드 선언은 무엇인가요?', [
        ['`private static String title;`', 'static 필드는 클래스 전체가 공유하므로 모든 Course가 같은 하나의 제목을 보게 돼요.'],
        ['`void title;`', 'void는 메서드 반환형에 쓰며 필드 타입이 될 수 없어요.'],
        ['`private final String title;`', '인스턴스 필드는 객체마다 별도로 존재하며 생성자에서 초기화한 final 참조는 재대입할 수 없어요.'],
      ], 2, '값이 객체 하나마다 따로 있어야 하는지, 클래스 전체가 공유해야 하는지 구분해 보세요.',
      '제목은 Course 인스턴스의 상태이므로 인스턴스 필드가 맞습니다. static은 모든 인스턴스가 공유해야 하는 값에만 사용하세요.'),
      shortAnswer('java-class-short-v2', 'private 필드 접근', '하위 클래스가 상위 클래스의 `private` 필드에 직접 접근할 수 있나요? `접근할 수 없다` 또는 `아니다`로 답하세요.', ['접근할 수 없다', '직접 접근할 수 없다', '하위 클래스는 직접 접근할 수 없다', '아니다'], '`private`은 선언한 클래스 내부에서만 필드에 직접 접근할 수 있게 제한해요.',
        '하위 클래스도 상위 클래스의 `private` 필드에 직접 접근할 수 없습니다. 필요한 값은 상위 클래스가 제공하는 메서드로 읽게 할 수 있어요.'),
    ],
  },
};
