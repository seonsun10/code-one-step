import { choice, lesson, locateError, shortAnswer } from './curriculum-tools.js';

const distractorFeedback = {
  'spring-injection-why-choice': [
    '',
    '호출할 때마다 구현체를 직접 만들면 Spring의 객체 연결과 대체 가능한 테스트 경계를 우회합니다.',
    '전역 변수는 의존 관계를 생성자에 드러내지 않아 교체와 테스트가 어려워집니다.',
  ],
  'spring-service-boundary-choice': [
    '',
    '라우터 설정은 HTTP 경로를 연결하는 곳이지 가격이나 주문 업무 규칙을 조율하는 곳이 아닙니다.',
    '템플릿은 화면 표현을 담당하므로 주문 가능 여부 같은 서버 업무 규칙을 두기 어렵습니다.',
  ],
  'spring-config-choice': [
    '',
    'Java 상수로 만든 비밀값은 코드와 함께 저장소에 커밋될 수 있습니다.',
    '프로파일은 설정 묶음을 선택할 뿐 비밀번호를 숨기거나 암호화하지 않습니다.',
  ],
  'spring-controller-role-choice': [
    '',
    '컨트롤러가 저장소 질의와 업무 규칙까지 맡으면 요청 경계와 업무 계층이 뒤섞입니다.',
    '브라우저 테마는 클라이언트 화면 설정이며 서버 컨트롤러의 HTTP 처리 책임이 아닙니다.',
  ],
  'spring-validation-server-choice': [
    '',
    '화면 검증은 Java 타입을 자동 생성하지 않고 서버 신뢰 경계도 대신하지 않습니다.',
    '서버 검증은 입력의 유효성을 판단할 뿐 데이터베이스 운영 비용을 없애지 않습니다.',
  ],
  'spring-errors-choice': [
    '2xx는 성공을 뜻하므로 필수 입력 누락을 성공으로 응답하면 호출자가 오류를 알 수 없습니다.',
    '',
    '5xx는 서버 쪽 실패 범주라 잘못된 요청을 보낸 호출자의 책임과 맞지 않습니다.',
  ],
  'spring-tx-choice': [
    '컨트롤러에서 작업을 나누면 두 변경 사이에 실패가 생길 때 원자성을 보장하기 어렵습니다.',
    '',
    '요청 전체를 무조건 묶으면 관련 없는 작업까지 긴 트랜잭션에 포함될 수 있습니다.',
  ],
  'spring-tx-choice-v2': [
    '',
    '일반 데이터베이스 트랜잭션은 별도 이메일 제공자 호출을 자동으로 원자 처리하거나 되돌리지 않습니다.',
    '이미 전송된 외부 메시지는 데이터베이스의 롤백만으로 메일 제공자에서 삭제되지 않습니다.',
  ],
  'spring-security-choice': [
    '',
    '인가는 이미 확인된 사용자가 특정 작업을 할 수 있는지 판단합니다.',
    '캐시 무효화는 오래된 캐시 값을 제거하는 작업으로 사용자 신원을 확인하지 않습니다.',
  ],
  'spring-test-choice': [
    '',
    'JVM 전체 성능 측정은 요청 매핑과 HTTP 응답 계약을 검증하지 않습니다.',
    '운영 DB를 직접 확인하면 테스트가 운영 데이터에 의존하고 결과도 안정적이지 않습니다.',
  ],
  'spring-test-choice-v2': [
    '',
    '@WebMvcTest는 할인 계산 같은 순수 업무 로직보다 MVC 요청 경계를 검증하는 데 맞습니다.',
    '운영 서버와 DB를 이용하면 순수 계산의 단위 테스트 범위를 불필요하게 넓힙니다.',
  ],
  'spring-resilience-choice': [
    '',
    '응답 시간 초과는 Java 컴파일 오류가 아니므로 컴파일 단계와 재시도 안전성은 별개입니다.',
    '시간 제한이 네트워크 연결을 항상 끊는 것은 아니며 서버가 이미 처리했을 수도 있습니다.',
  ],
  'spring-observe-choice-v2': [
    '',
    '문자열을 이어 붙인 한 줄은 memberId와 courseId를 개별 key-value 필드로 보장하지 않습니다.',
    '필드를 모두 제거하면 로그 수집기에서 필요한 등록 사건을 검색할 수 없습니다.',
  ],
  'spring-capstone-choice': [
    '',
    '환경 변수에는 비밀값이 있을 수 있어 전체 설정을 응답에 포함하면 안 됩니다.',
    '내부 스택 추적은 구현 세부 정보를 노출하므로 API 응답에 포함하지 않아야 합니다.',
  ],
  'react-components-reuse-choice': [
    '',
    '화면 전체를 하나의 문자열로 묶으면 필요한 부분만 재사용하거나 따로 검증하기 어렵습니다.',
    '이름 없는 전역 DOM 참조는 React의 컴포넌트와 선언형 렌더 흐름 밖에서 상태를 바꿉니다.',
  ],
  'react-props-contract-choice': [
    '',
    '쿠키는 브라우저가 보관하는 데이터이지 부모가 자식 컴포넌트에 전달하는 입력이 아닙니다.',
    '임의 DOM 속성은 HTML 요소의 속성이며 React 컴포넌트 함수 인자를 대신하지 않습니다.',
  ],
  'react-event-choice': [
    '',
    '괄호를 붙이면 렌더링 중 `save`를 즉시 실행하고 반환값을 이벤트에 넘깁니다.',
    '문자열은 함수 참조가 아니므로 React가 클릭 때 호출할 핸들러가 되지 않습니다.',
  ],
  'react-state-copy-choice': [
    '',
    '변수에 대입해도 React setter가 호출되지 않아 화면 갱신을 요청하지 않습니다.',
    '현재 렌더의 `count`를 직접 더하면 연속 업데이트에서 오래된 값을 캡처할 수 있습니다.',
  ],
  'react-state-copy-choice-v2': [
    '기존 배열을 직접 바꾸거나 setter에 새 항목만 넘기면 이전 항목이 보존되지 않습니다.',
    '',
    '배열 복사만 하고 새 항목을 추가하지 않으면 목록 내용이 달라지지 않습니다.',
  ],
  'react-form-list-choice': [
    '',
    '정렬이나 삽입으로 위치가 바뀌면 인덱스 key가 다른 항목에 재사용될 수 있습니다.',
    '무작위 key는 렌더마다 달라져 React가 항목을 새 요소로 취급하고 상태를 잃게 할 수 있습니다.',
  ],
  'react-form-list-choice-v2': [
    'value만 연결하고 변경 handler를 제공하지 않으면 사용자의 편집을 state로 반영할 수 없습니다.',
    'id는 접근성·폼 식별에 쓸 수 있지만 그 자체로 현재 value와 입력 state를 동기화하지 않습니다.',
    '',
  ],
  'react-effect-choice': [
    '',
    '렌더링 결과만 계산하는 값을 다시 state에 복사하면 중복 상태와 불필요한 Effect가 생깁니다.',
    'React 밖의 전역 변수에 결과를 복사해도 변경 사실을 React가 자동으로 알지 못합니다.',
  ],
  'react-effect-choice-v2': [
    'useMemo는 외부 연결의 시작·정리 수명을 동기화하는 Hook이 아닙니다.',
    '',
    'useState는 화면 데이터를 보관하지만 React 외부 연결의 lifecycle을 시작하고 정리하지 않습니다.',
  ],
  'react-reducer-choice': [
    '',
    'DOM을 직접 바꾸면 React가 관리하는 화면 상태와 실제 DOM이 서로 달라질 수 있습니다.',
    '전역 변수에 변경 규칙을 흩어 놓으면 React 렌더가 갱신되지 않고 상태 흐름도 추적하기 어렵습니다.',
  ],
  'react-hook-choice-v2': [
    '각 호출은 같은 Hook 코드를 실행하지만 Hook 호출별 state와 Effect는 서로 독립적입니다.',
    'Hook 함수 이름이 같아도 서로 다른 컴포넌트의 local state를 하나의 값으로 합치지는 않습니다.',
    '첫 컴포넌트의 닫기 동작은 그 호출이 가진 setter만 사용하므로 다른 호출의 open 값은 바뀌지 않습니다.',
  ],
  'react-hook-name-choice-v3': [
    'get으로 시작하는 이름은 소문자 use 접두사를 드러내지 않습니다.',
    'React custom Hook 이름은 대문자 Use가 아니라 소문자 use로 시작합니다.',
    '',
  ],
  'react-async-choice-v2': [
    '',
    '여러 boolean은 loading과 error가 동시에 true인 표현도 만들어 요청 단계를 혼란스럽게 합니다.',
    'DOM class를 읽는 방식은 React가 상태를 소유하고 다시 렌더링하는 흐름 밖에 있습니다.',
  ],
  'react-hook-choice': [
    '',
    'Hook을 조건부로 호출하면 렌더 사이 호출 순서가 달라져 상태 연결이 틀어질 수 있습니다.',
    'Hook 호출 규칙은 JSX 반환을 금지하지 않으며 컴포넌트 렌더링과 별개입니다.',
  ],
  'react-async-choice': [
    '',
    '늦게 도착한 오래된 응답을 그대로 저장하면 최신 검색 결과를 덮어쓸 수 있습니다.',
    '요청을 복제해 속도 경쟁을 시키면 중복 작업과 응답 순서 문제를 늘립니다.',
  ],
  'react-route-choice': [
    '',
    '클릭 이벤트만 있는 div는 링크 주소 확인, 새 탭 열기, 키보드 기본 동작을 제공하지 않습니다.',
    '버튼은 작업 실행에 적합하고 목적지로 이동하는 링크 계약을 표현하지 않습니다.',
  ],
  'react-test-role-choice-v2': [
    '',
    'test id는 화면의 역할이나 사용자에게 보이는 이름이 바뀌어도 남을 수 있어 사용자 관점의 접근성을 확인하지 못합니다.',
    'CSS class는 스타일 구현 세부 정보이며 버튼의 역할과 accessible name을 검증하지 않습니다.',
  ],
  'react-performance-choice': [
    '',
    '모든 함수의 메모이제이션은 비용과 복잡도를 더할 수 있고 측정된 병목을 보장해 줄이지 않습니다.',
    '이름을 짧게 바꾸는 것은 렌더링이나 목록 계산의 실행 비용을 줄이지 않습니다.',
  ],
  'react-capstone-choice': [
    '',
    '한 목록에만 필요한 표시 값을 전역으로 올리면 관계없는 화면까지 상태 구조에 결합됩니다.',
    'DOM을 직접 읽어 값을 보관하면 React 상태와 화면 갱신 흐름을 우회합니다.',
  ],
};

const c = (id, title, prompt, options, answerIndex, hint, explanation) => {
  const texts = options.length === 1 && options[0].length > 2 ? options[0] : null;
  const answeredOptions = texts
    ? texts.map((text, index) => [text, index === answerIndex ? explanation : distractorFeedback[id]?.[index]])
    : options;
  if (answeredOptions.some(([, feedback]) => typeof feedback !== 'string' || !feedback.trim())) {
    throw new Error(`Choice ${id} needs a specific explanation for every option`);
  }
  return choice(id, title, prompt, answeredOptions, answerIndex, hint, explanation);
};
const s = shortAnswer;
const e = locateError;

export const springExpansion = {
  lessonOrder: [
    'spring-injection', 'spring-service', 'spring-config-profiles',
    'spring-controller', 'spring-validation', 'spring-rest-errors',
    'spring-data-transaction', 'spring-security-basics', 'spring-integration-tests',
    'spring-timeout-cache-resilience', 'spring-observability-performance',
    'spring-api-operations-capstone',
  ],
  topics: [
    { id: 'spring-foundation', stage: 1, title: '객체와 애플리케이션 기초', objective: 'Bean과 의존성을 연결하고 설정을 환경에 맞게 분리해요.', lessonIds: ['spring-injection', 'spring-service', 'spring-config-profiles'] },
    { id: 'spring-web', stage: 2, title: '요청과 응답 다루기', objective: 'HTTP 요청, 입력 검증, 일관된 오류 응답을 설계해요.', lessonIds: ['spring-controller', 'spring-validation', 'spring-rest-errors'] },
    { id: 'spring-data-security', stage: 3, title: '데이터와 서비스 품질', objective: '트랜잭션 경계, 보안 기본값, 통합 테스트를 판단해요.', lessonIds: ['spring-data-transaction', 'spring-security-basics', 'spring-integration-tests'] },
    { id: 'spring-reliability', stage: 4, title: '복원력과 운영 관찰', objective: '느린 의존성을 다루고 장애 원인을 관측 가능한 신호로 남겨요.', lessonIds: ['spring-timeout-cache-resilience', 'spring-observability-performance'] },
    { id: 'spring-capstone', stage: 5, title: 'API 설계 캡스톤', objective: '경계·오류·테스트·운영 기준을 묶어 작은 API를 설계해요.', lessonIds: ['spring-api-operations-capstone'] },
  ],
  lessons: [
    lesson('spring-config-profiles', 'spring-foundation', '설정과 프로파일 분리', '10분', '배포 환경별 설정을 코드와 비밀값에서 분리해요.',
      '공통 기본값과 환경별 설정을 나눠 두면 같은 코드를 여러 환경에서 쓸 수 있어요. 프로파일은 설정을 고르는 기능이지 비밀번호를 숨기는 곳은 아니므로, 비밀값은 배포 환경에서 따로 전달해요.',
      ['공통 기본값은 기본 설정에 둬요.', '프로파일은 환경별 차이를 선택하는 기능이에요.', '비밀번호와 토큰은 저장소에 커밋하지 않아요.'],
      'spring:\n  profiles:\n    active: local\n---\nspring:\n  config:\n    activate:\n      on-profile: local\n  datasource:\n    url: jdbc:h2:mem:study', [
        c('spring-config-choice', '환경별 설정 고르기', '운영 데이터베이스 주소와 비밀번호를 Git 저장소에 올리지 않으려면 어떤 방법이 알맞을까요?', [
          ['환경 변수나 배포 환경의 비밀 설정으로 주입한다', 'Java 코드의 상수로 작성한다', '프로파일 이름을 비밀번호로 사용한다'],
        ], 0, '저장소에 남는 파일과 배포 시 전달되는 설정을 구분해 보세요.', '민감한 값은 코드와 공개 설정 파일 밖에서 주입하고, 저장소에 실값을 커밋하지 않습니다.'),
        s('spring-config-short', '프로파일의 역할', '프로파일이 바꾸는 것은 비밀번호 자체가 아니라 무엇인지 한 단어로 적어 보세요.', ['환경', '실행 환경'], 'local, test, prod처럼 실행 조건의 차이를 떠올려 보세요.', '프로파일은 실행할 설정 묶음을 선택해 환경별 차이를 분리합니다.'),
        e('spring-config-locate', '설정 파일의 민감 정보 찾기', '아래 설정에서 저장소에 실제 값으로 남기면 안 되는 줄을 고르세요.', 'Spring Boot 설정', [
          'spring.application.name=course-api', 'server.port=8080', 'spring.datasource.password=plaintext-example', 'logging.level.root=INFO',
      ], [3], '서비스 이름이나 포트와 데이터베이스 인증 정보의 민감도를 비교해 보세요.', '3번 줄은 설명용 문자열이지만 운영 비밀번호를 이 자리에 직접 적으면 안 됩니다. `${DB_PASSWORD}` 같은 외부 설정을 사용하고 실제 값은 저장소에 커밋하지 않아야 해요.'),
      ]),
    lesson('spring-rest-errors', 'spring-web', 'REST 응답과 오류 일관성', '11분', '성공·실패 상황에 맞는 HTTP 상태와 응답 형태를 골라요.',
      'REST API는 응답 본문뿐 아니라 HTTP 상태 코드로 결과를 표현합니다. 오류를 모두 200으로 돌려보내면 호출자가 성공과 실패를 구분하기 어렵고, 서버 내부 세부 정보까지 노출해서도 안 됩니다.',
      ['리소스 생성은 상황에 맞는 201 응답을 고려해요.', '잘못된 입력은 4xx, 예상하지 못한 서버 장애는 5xx 범주예요.', '오류 응답에는 안전한 설명과 추적 식별자를 두고 내부 스택 추적은 숨겨요.'],
      'return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);', [
        c('spring-errors-choice', '요청 오류 상태 고르기', '필수 `title`이 빠진 요청을 받은 API가 돌려줄 상태 범주로 가장 알맞은 것은 무엇인가요?', [
          ['2xx 성공', '4xx 클라이언트 요청 오류', '5xx 서버 장애'],
        ], 1, '요청을 고쳐야 하는 주체가 호출자인지 서버인지 먼저 생각해 보세요.', '필수 입력이 없는 것은 호출자가 보낸 요청의 문제라 4xx 범주가 적절합니다. 구체 상태는 API 계약에 일관되게 정해야 합니다.'),
        s('spring-errors-short-v2', '404 응답의 의미', '조회 API가 404 Not Found를 반환하면 클라이언트에 어떤 결과를 알리나요?', ['요청한 리소스가 존재하지 않음', '대상을 찾지 못함', '리소스를 찾을 수 없음'], '정상 조회 성공이나 서버 장애가 아니라 요청한 대상의 존재 여부를 생각해 보세요.', '이 학습 API 계약에서 404 Not Found는 요청한 리소스를 찾지 못했음을 나타냅니다. 다른 API는 권한 정책에 따라 존재 여부를 감출 수 있지만, 이 예제는 명시적으로 404를 사용합니다.'),
        e('spring-errors-locate', '오류 상태 숨기기 찾기', '요청 검증 오류를 서버 성공으로 숨기는 부분을 선택하세요.', 'Spring MVC', [
          '@ExceptionHandler(MethodArgumentNotValidException.class)', 'ResponseEntity<ApiError> handleInvalidInput(Exception error) {', '    return ResponseEntity.ok(new ApiError("INVALID_INPUT"));', '}',
        ], [3], '응답 본문이 오류라고 말하는데 HTTP 상태는 무엇을 말하는지 확인해 보세요.', '3번 줄은 오류 본문을 보내면서 200 OK를 사용합니다. 계약에 맞는 4xx 상태를 반환해야 호출자가 실패를 분명히 알 수 있어요.'),
      ]),
    lesson('spring-data-transaction', 'spring-data-security', '저장 작업과 트랜잭션 경계', '12분', '함께 성공하거나 함께 취소되어야 하는 저장 작업을 구분해요.',
      '트랜잭션은 여러 데이터 변경을 하나의 작업 단위로 다루는 경계입니다. Spring의 `@Transactional`은 일반적으로 프록시를 통해 적용되므로 같은 객체 내부 호출 등 실제 적용 조건도 확인해야 합니다. 예제의 메일 호출은 외부 효과가 DB 롤백 대상이 아님을 보여 주는 비교 사례이며, 실제 DB 연결은 제공하지 않습니다.',
      ['함께 성공해야 하는 변경을 같은 서비스 작업으로 묶어요.', '읽기 전용 조회와 데이터 변경의 목적을 구분해요.', '트랜잭션은 외부 API 호출까지 자동으로 되돌려 주지 않아요.'],
      '@Transactional\npublic void enroll(long memberId, long courseId) {\n    memberRepository.reserve(memberId);\n    enrollmentRepository.save(memberId, courseId);\n    mailClient.sendConfirmation(memberId);\n}', [
        c('spring-tx-choice-v2', '외부 효과와 트랜잭션', '등록 저장이 실패해 데이터베이스가 롤백되면 이미 보낸 확인 이메일도 취소될까요?', [
          ['아니요. 외부 이메일 전송은 일반 DB 트랜잭션이 자동으로 되돌리지 못한다', '같은 메서드 안에서 호출했으므로 DB와 메일이 항상 함께 롤백된다', 'DB 롤백이 메일 제공자의 수신함에서 메시지를 삭제한다'],
        ], 0, '이메일 제공자가 현재 데이터베이스 트랜잭션에 실제로 참여하는지 살펴보세요.', '일반 DB 트랜잭션은 외부 메일 전송을 원자적으로 묶지 않습니다. 커밋 뒤 이벤트 처리나 재시도 가능한 전달 경계를 설계할 수 있습니다.'),
        s('spring-tx-short-v2', '커밋 뒤 이벤트 처리', '트랜잭션이 성공적으로 커밋된 뒤 이벤트를 처리하도록 지정하는 Spring 이벤트 단계는 무엇인가요?', ['AFTER_COMMIT', 'after commit'], 'Transactional event listener의 기본 이벤트 단계 이름을 떠올려 보세요.', '커밋 뒤 알림 같은 외부 효과를 처리할 때 TransactionPhase.AFTER_COMMIT을 지정할 수 있습니다. 트랜잭션이 없을 때도 처리하려면 별도의 fallback 정책이 필요합니다.'),
        e('spring-tx-locate-v2', '실패를 삼켜 커밋할 수 있는 줄 찾기', 'RuntimeException이 발생했지만 트랜잭션 메서드가 정상 반환하도록 실패를 삼키는 줄을 고르세요.', 'Spring service', [
          '@Transactional',
          'void enroll(long memberId) {',
          '    capacity.reserve(memberId);',
          '    try {',
          '        enrollmentRepository.save(memberId);',
          '    } catch (RuntimeException failure) {',
          '        return;',
          '    }',
          '}',
        ], [7], 'Spring 기본 롤백 규칙이 적용되려면 런타임 예외가 트랜잭션 경계를 빠져나가는지 확인하세요.', '7번 줄에서 예외를 삼키고 정상 반환하면 기본 롤백 규칙이 실패를 감지하지 못해 앞서 수행한 변경이 커밋될 수 있습니다. 예외를 다시 던지거나 계약에 맞게 rollback-only를 표시하세요.'),
      ]),
    lesson('spring-security-basics', 'spring-data-security', '요청 보안의 기본 경계', '12분', '인증과 권한 확인을 분리하고 안전한 기본값을 선택해요.',
      '인증은 요청자가 누구인지 확인하고, 인가는 그 사용자가 어떤 작업을 할 수 있는지 확인합니다. 공개 읽기 API가 있더라도 관리 기능은 명시적으로 보호해야 하며, 실제 구성은 애플리케이션의 인증 방식과 보안 체인 설정에 따라 달라져요.',
      ['인증은 신원 확인, 인가는 작업 권한 확인이에요.', '기본 차단 후 공개할 경로만 명시하면 실수로 노출할 위험이 줄어요.', '비밀번호를 평문 로그나 오류 응답에 남기지 않아요.'],
      'authorizeHttpRequests(auth -> auth\n    .requestMatchers("/api/public/**").permitAll()\n    .requestMatchers("/api/admin/**").hasRole("ADMIN")\n    .anyRequest().authenticated());', [
        c('spring-security-choice', '인증과 인가 구분', '로그인한 사용자인지 확인하는 동작은 무엇인가요?', [
          ['인증', '인가', '캐시 무효화'],
        ], 0, '“누구인지”와 “무엇을 할 수 있는지”를 구분해 보세요.', '인증(Authentication)은 요청자의 신원을 확인합니다. 인가(Authorization)는 확인된 사용자에게 특정 작업을 허용할지 판단합니다.'),
        s('spring-security-short-v2', '메서드 보안 활성화', '@PreAuthorize 같은 메서드 수준 권한 검사를 적용하기 전에 기본적으로 켜야 하는 설정 어노테이션은 무엇인가요?', ['@EnableMethodSecurity'], 'Spring Security 설정에서 메서드 인가 interceptor를 등록하는 어노테이션입니다.', '@PreAuthorize는 메서드 보안이 활성화되어야 실행 시 인가 검사로 적용됩니다. 설정 클래스에 @EnableMethodSecurity를 선언하세요.'),
        e('spring-security-locate', '권한 규칙 누락 찾기', '관리 경로가 인증만으로 열리고 관리자 권한은 검사하지 않는 줄을 선택하세요.', 'Spring Security 설정', [
          '.authorizeHttpRequests(auth -> auth', '    .requestMatchers("/api/public/**").permitAll()', '    .requestMatchers("/api/admin/**").authenticated()', '    .anyRequest().denyAll());',
        ], [3], '로그인 여부와 관리자 역할 여부가 같은 조건인지 살펴보세요.', '3번 줄은 관리 경로에 로그인만 요구합니다. 관리자 작업에는 `hasRole("ADMIN")` 같은 권한 검사도 필요합니다.'),
      ]),
    lesson('spring-integration-tests', 'spring-data-security', '통합 테스트의 경계', '11분', 'Spring 컨텍스트가 필요한 동작과 단위 테스트를 구분해요.',
      '단위 테스트는 작은 객체의 규칙을 빠르게 확인하고, 통합 테스트는 Spring 설정·웹 계층·협력 객체가 함께 연결되는지를 확인합니다. 모든 테스트에 전체 컨텍스트를 올릴 필요는 없지만 실제 경계가 틀릴 수 있는 구간은 검증해야 해요.',
      ['순수 계산은 작은 단위 테스트로 확인해요.', 'HTTP 바인딩이나 보안 설정은 해당 통합 경계를 검사해요.', '테스트는 외부 운영 DB가 아니라 통제 가능한 격리 자원을 사용해요.'],
      '@WebMvcTest(CourseController.class)\nclass CourseControllerTest {\n    @Autowired MockMvc mvc;\n    @MockitoBean CourseService courseService;\n}', [
        c('spring-test-choice-v2', '순수 업무 로직 테스트', 'Spring 컨텍스트나 HTTP 없이 할인 금액을 계산하는 순수 Java 메서드를 검증하려면 어떤 테스트부터 선택할까요?', [
          ['객체를 직접 만들고 입력·반환값을 확인하는 작은 JUnit 단위 테스트', '@WebMvcTest로 MVC 컨텍스트와 요청 매핑을 올린다', '실제 운영 서버와 데이터베이스에 연결한다'],
        ], 0, '검증 대상이 순수 계산인지 MVC 요청 경계인지 먼저 나누세요.', 'Spring이나 HTTP 동작이 없는 순수 계산은 객체를 직접 만들고 입력과 반환값을 확인하는 작은 단위 테스트로 충분합니다.'),
        s('spring-test-short-v2', 'MockMvc 요청 실행', 'MockMvc에서 만든 요청을 MVC 테스트 환경에 전달하는 메서드는 무엇인가요?', ['perform'], '예제의 mockMvc 뒤에 이어지는 요청 실행 메서드를 확인하세요.', 'perform(...)은 MockMvc로 요청을 실행하고 반환된 결과에 andExpect(...) 검증을 연결합니다.'),
        e('spring-test-locate-v2', 'MVC 슬라이스에 없는 서비스 주입 찾기', '@WebMvcTest는 MVC 경계만 로드합니다. 테스트 컨텍스트에 등록되지 않은 실제 CourseService를 직접 주입하는 줄을 고르세요.', 'Spring test', [
          '@WebMvcTest(CourseController.class)',
          'class CourseControllerTest {',
          '    @Autowired MockMvc mvc;',
          '    @Autowired CourseService courseService;',
          '}',
        ], [4], '@WebMvcTest의 웹 슬라이스에는 일반 서비스 Bean이 자동 포함되지 않습니다. 대체 Bean이 필요한지 살펴보세요.', '4번 줄은 웹 슬라이스에 자동 등록되지 않은 CourseService를 요구합니다. 실제 서비스를 로드하는 대신 @MockitoBean으로 협력자를 테스트용 mock으로 대체할 수 있습니다.'),
      ]),
    lesson('spring-timeout-cache-resilience', 'spring-reliability', '느린 의존성과 캐시 일관성', '13분', '시간 제한과 캐시 갱신을 이용해 장애 전파를 줄여요.',
      '외부 서비스가 느려지면 요청 스레드와 연결이 오래 묶여 다른 사용자에게도 장애가 번질 수 있어요. 시간 제한, 제한된 재시도, 회로 차단 같은 정책을 상황에 맞게 쓰고, 변경된 데이터의 캐시 무효화 규칙도 정의해야 합니다.',
      ['무한 대기 대신 업무에 맞는 시간 제한을 정해요.', '재시도는 횟수·대상·중복 실행 안전성을 고려해 제한해요.', '캐시된 값을 바꾼 뒤에는 오래된 항목을 갱신하거나 무효화해요.'],
      'HttpRequest request = HttpRequest.newBuilder(uri)\n    .timeout(Duration.ofSeconds(2))\n    .GET()\n    .build();', [
        e('spring-resilience-locate', '시간 제한 누락 찾기', '외부 서비스가 응답하지 않을 때 요청이 계속 대기할 수 있는 부분을 선택하세요.', 'Java HTTP client', [
          'HttpRequest request = HttpRequest.newBuilder(uri).GET().build();',
          'HttpResponse<String> response = client.send(request, BodyHandlers.ofString());',
        ], [1], '요청을 만들 때 제한 시간을 실제 요청 설정에 연결했는지 확인하세요.', '1번 줄은 HTTP 요청을 만들지만 `.timeout(Duration.ofSeconds(...))`을 설정하지 않았습니다. Duration 값을 다른 곳에 선언하는 것만으로는 이 요청의 대기 시간이 제한되지 않습니다.'),
        c('spring-resilience-choice', '재시도 안전성', '결제 요청을 다시 시도해도 되는 경우로 가장 알맞은 것은 무엇인가요?', [
          ['업무상 일시 오류만 제한 횟수로 처리하고 중복 요청을 멱등 키로 보호한다', '모든 RuntimeException을 횟수 제한 없이 다시 요청한다', '최대 시도 횟수만 설정하면 결제가 자동으로 중복 제거된다'],
        ], 0, '일시적인 실패인지, 같은 업무 요청의 반복 실행을 막는지 함께 확인하세요.', '다시 시도할 오류와 횟수를 제한하고, 결제 요청은 멱등 키로 같은 요청의 중복 부작용을 막아야 합니다.'),
        s('spring-cache-short', '캐시 키 확인', '강좌 응답이 언어별로 달라질 때 캐시 항목을 구분하는 식별 묶음을 무엇이라 하나요?', ['캐시 키', 'cache key'], '결과를 바꾸는 요청 값이 캐시 식별에 반영되는지 생각해 보세요.', '캐시 키는 요청 결과를 구분하는 식별자입니다. locale별 응답을 반환한다면 강좌 ID뿐 아니라 locale도 키에 포함해야 언어가 다른 결과가 섞이지 않습니다.'),
      ]),
    lesson('spring-observability-performance', 'spring-reliability', '로그·지표·추적과 성능', '13분', '요청 식별자와 관측 신호로 느린 구간을 좁혀요.',
      '운영 관측은 로그, 지표, 분산 추적을 함께 사용해 문제의 범위와 흐름을 알아내는 방법입니다. 구조화 로그는 사건과 키·값을 구분하고, 메트릭은 값 종류가 제한된 태그로 집계하며, 활성 trace 문맥은 서비스 간 호출을 연결합니다. 비밀번호와 토큰은 로그에서 제외하고 성능은 대표 시나리오로 측정해요.',
      ['로그는 개별 사건의 맥락, 지표는 시간에 따른 수치 변화를 보여 줘요.', '추적은 여러 서비스에 걸친 한 요청의 경로를 잇는 데 유용해요.', '요청 본문 전체, 토큰, 비밀번호를 로그에 남기지 않아요.'],
      'log.info("course request requestId={} courseId={}", requestId, courseId);', [
        c('spring-observe-choice-v2', '구조화 로그 설정', '로그 수집기에서 memberId와 courseId를 각각 검색하려 합니다. 문자열 연결 예제에 어떤 변경을 적용해야 할까요?', [
          ['logging.structured.format.console로 구조화 출력을 설정하고 SLF4J key-value 필드로 기록한다', 'JSON처럼 보이는 문자열 하나에 두 값을 이어 붙인다', '검색이 어렵지 않도록 memberId와 courseId 모두 기록하지 않는다'],
        ], 0, '출력 형식과 로그 이벤트 안의 필드를 모두 기계가 구분할 수 있어야 합니다.', 'Boot에서 구조화 JSON 출력을 설정하고 SLF4J key-value API로 값을 별도 필드에 기록하면 수집기가 각 값을 독립적으로 검색할 수 있습니다.'),
        s('spring-observe-short-v2', '분산 추적 ID', '활성 trace 안의 로그와 하위 서비스 호출을 같은 요청 흐름으로 연결하는 식별자는 무엇인가요?', ['trace ID', 'trace id', '추적 ID'], '하위 호출을 같은 분산 요청 흐름에 묶는 값을 떠올리세요.', 'trace ID는 하나의 분산 요청 흐름을 식별합니다. request ID를 별도로 만들 수 있지만 trace ID와 항상 같은 값이라고 단정하지 않습니다.'),
        e('spring-observe-locate-v2', '개별 ID를 메트릭 태그로 쓰는 줄 찾기', '메트릭 태그의 값 종류가 courseId 수만큼 계속 늘어나지 않게 하려 합니다. 고카디널리티 값을 태그로 추가하는 줄을 고르세요.', 'Micrometer', [
          'Counter.builder("course.lookup")', '  .tag("courseId", Long.toString(courseId))', '  .register(registry)', '  .increment();',
        ], [2], 'Micrometer는 종류가 제한된 낮은 cardinality 값을 메트릭과 추적에 기록하고, 개별 식별자는 메트릭 태그에서 피하도록 안내합니다.', '2번 줄은 강좌별 고유 ID를 메트릭 차원으로 만들어 시계열 수를 크게 늘릴 수 있습니다. outcome처럼 허용 값 종류가 제한된 태그로 집계하세요.'),
      ]),
    lesson('spring-api-operations-capstone', 'spring-capstone', '학습 과정 API 설계 검토', '18분', 'HTTP 계약·검증·트랜잭션·테스트·운영 관찰을 함께 검토해요.',
      '마지막 과제는 실제 프로젝트를 실행하는 대신 설계 리뷰를 연습합니다. 과정 생성 API가 검증, 권한, 저장 실패, 중복 요청, 관측 정보를 어떻게 처리할지 근거를 들어 판단해 보세요. 안정 버전의 공통 Spring 원칙을 적용하고 프로젝트별 설정이 필요한 항목은 확인 대상으로 남깁니다.',
      ['요청 DTO와 도메인 규칙을 분리해요.', '중복 요청이 부작용을 만들지 않도록 계약을 정해요.', '실패 응답과 로그에는 안전한 정보만 남겨요.'],
      'POST /api/courses\n201 Created\nLocation: /api/courses/42\n{ "id": 42, "title": "Java 기초" }', [
        c('spring-capstone-choice', '생성 API 계약', '클라이언트가 과정 생성을 성공한 뒤 새 리소스를 다시 조회할 수 있도록 함께 제공하기 좋은 응답 정보는 무엇인가요?', [
          ['생성 리소스의 식별자와 위치 정보', '서버의 전체 환경 변수', '저장소의 내부 스택 추적'],
        ], 0, '클라이언트가 다음 요청을 만들 때 필요한 공개 계약을 생각해 보세요.', '리소스 식별자와 Location은 새 리소스의 주소를 알려 줍니다. 환경 변수나 내부 스택 추적은 공개 API 응답에 포함하지 않습니다.'),
        s('spring-capstone-short', '중복 생성 방지 키', '동일한 요청을 다시 보내도 부작용이 중복되지 않게 하는 요청 속성을 무엇이라고 하나요?', ['멱등성', 'idempotency'], '호출을 한 번 하거나 여러 번 해도 결과 효과가 같도록 하는 성질이에요.', '멱등성은 재시도나 중복 전송이 있어도 같은 요청이 중복 생성 같은 부작용을 반복하지 않도록 설계하는 성질입니다.'),
        e('spring-capstone-locate', '응답의 내부 정보 노출 찾기', '클라이언트 오류 응답에 공개하면 안 되는 서버 정보를 반환하는 줄을 고르세요.', 'Spring API', [
          'catch (DataAccessException error) {', '    log.error("course save failed", error);', '    return ResponseEntity.internalServerError().body(error.getMessage());', '}',
        ], [3], '로그 내부 진단과 인터넷에 공개되는 응답은 누가 읽는지 비교해 보세요.', '3번 줄은 DB 오류 메시지를 그대로 응답 본문에 노출합니다. 외부에는 안정된 오류 코드와 안전한 안내만 보내고 상세 원인은 제한된 로그에 남겨야 합니다.'),
      ]),
  ],
  extraExercises: {
    'spring-injection': [
      c('spring-injection-why-choice', '필수 협력 객체 확인', '서비스가 생성될 때 저장소가 반드시 필요하다는 점을 가장 분명하게 나타내는 방법은 무엇인가요?', [
        ['필수 저장소를 생성자 매개변수로 받는다', '필요할 때마다 메서드 안에서 새 저장소를 만든다', '공유 전역 변수에 저장소를 숨긴다'],
      ], 0, '객체가 준비되는 순간 필요한 것을 드러내는 방식을 생각해 보세요.', '생성자 주입은 필수 협력 객체가 없으면 인스턴스를 만들 수 없게 해 객체의 준비 조건을 표현합니다.'),
      e('spring-injection-locate', '직접 생성한 의존성 찾기', '컨테이너가 관리하는 저장소를 사용하지 않고 서비스가 구현체를 직접 만드는 줄을 고르세요.', 'Spring service', [
        '@Service class CourseService {', '    private final CourseRepository repository = new JdbcCourseRepository();', '    Course find(long id) { return repository.find(id); }', '}',
      ], [2], '객체를 외부에서 전달받는지 클래스 안에서 직접 생성하는지 찾아보세요.', '2번 줄에서 서비스가 구체 구현을 직접 만듭니다. 생성자 주입으로 인터페이스를 전달하면 테스트와 구현 교체가 쉬워집니다.'),
    ],
    'spring-service': [
      c('spring-service-boundary-choice', '계층 역할 구분', '가격 계산과 주문 가능 여부 같은 업무 규칙을 조율하기에 가장 자연스러운 계층은 무엇인가요?', [
        ['서비스', 'HTTP 라우터 설정 파일', '화면 템플릿'],
      ], 0, '저장소 호출 여러 개와 업무 규칙을 묶는 위치를 찾아보세요.', '서비스는 업무 규칙과 협력 객체 호출을 조율하는 곳입니다. 컨트롤러는 요청과 응답에 집중하도록 분리할 수 있어요.'),
      s('spring-service-short', '서비스 입력 유형', '서비스가 생성자에서 전달받는 외부 협력 객체를 일반적으로 무엇이라고 하나요?', ['의존성', 'dependency'], '객체가 자신의 책임을 수행하는 데 필요해 함께 일하는 대상이에요.', '의존성은 객체가 기능을 수행할 때 사용하는 협력 대상입니다. 생성자 매개변수에 두면 필요 조건이 드러나요.'),
    ],
    'spring-controller': [
      c('spring-controller-role-choice', '컨트롤러 책임', 'HTTP 요청 JSON을 애플리케이션 작업으로 연결하는 컨트롤러의 주된 책임은 무엇인가요?', [
        ['요청을 받고 입력을 전달한 뒤 응답을 만든다', '모든 데이터베이스 쿼리와 업무 규칙을 직접 구현한다', '화면 브라우저의 테마 설정을 저장한다'],
      ], 0, 'HTTP 경계와 업무 처리의 책임을 구분해 보세요.', '컨트롤러는 HTTP 요청·응답 경계를 담당하고 실제 업무 규칙은 서비스에 위임하는 편이 테스트하기 쉽습니다.'),
      e('spring-controller-locate-v2', '경로 변수 바인딩 누락 찾기', 'GET /api/courses/42 요청의 42를 메서드 매개변수에 연결하지 못하게 하는 줄을 고르세요.', 'Spring MVC', [
        '@GetMapping("/api/courses/{id}")', 'CourseView find(long id) {', '    return service.find(id);', '}',
      ], [2], '경로의 `{id}`와 메서드의 `id` 매개변수가 연결되는지 살펴보세요.', '2번 줄에 `@PathVariable("id")`가 없어 URL의 `{id}` 값을 매개변수에 연결하지 않습니다.'),
    ],
    'spring-validation': [
      c('spring-validation-server-choice', '서버 검증 이유', '입력 화면에서 검증했더라도 서버에서 다시 검증해야 하는 이유는 무엇인가요?', [
        ['브라우저 밖에서 직접 만든 요청도 도착할 수 있다', '화면 검증은 항상 Java 타입을 자동 생성한다', '서버 검증은 데이터베이스 비용을 없앤다'],
      ], 0, '클라이언트는 요청을 바꿔 보낼 수 있다는 점을 떠올려 보세요.', '클라이언트 검증은 사용성 보조일 뿐 신뢰 경계가 아닙니다. 서버는 직접 전송된 입력도 검증해야 해요.'),
      s('spring-validation-short', '필드 제약 실행', '`@Valid`와 같은 검증 표시를 붙인 요청 객체의 필드 규칙을 실행하는 역할을 맡는 구성 요소를 무엇이라고 하나요?', ['검증 제공자', 'bean validation provider', 'validator'], '제약 어노테이션만 선언해도 실행에 필요한 구현이 있어야 해요.', 'Bean Validation 제약을 실제로 평가하려면 클래스패스에 호환되는 검증 제공자가 필요합니다. 프로젝트 의존성과 Spring 버전을 확인해야 해요.'),
    ],
  },
};

export const reactExpansion = {
  lessonOrder: [
    'react-components', 'react-props', 'react-events-state', 'react-state',
    'react-forms-lists', 'react-effects-derived-state', 'react-reducer-context',
    'react-custom-hooks', 'react-async-data', 'react-routing-accessibility',
    'react-testing-performance', 'react-architecture-capstone',
  ],
  topics: [
    { id: 'react-foundation', stage: 1, title: '화면의 기본 단위', objective: '컴포넌트, props, 이벤트, 상태로 작은 화면을 구성해요.', lessonIds: ['react-components', 'react-props', 'react-events-state', 'react-state'] },
    { id: 'react-state-and-effects', stage: 2, title: '화면 상태와 목록', objective: '입력 폼과 목록의 상태를 예측 가능하게 관리해요.', lessonIds: ['react-forms-lists', 'react-effects-derived-state', 'react-reducer-context'] },
    { id: 'react-composition', stage: 3, title: '재사용과 비동기 데이터', objective: '사용자 정의 Hook과 요청 상태를 분리해요.', lessonIds: ['react-custom-hooks', 'react-async-data'] },
    { id: 'react-quality', stage: 4, title: '접근성·검증·성능', objective: '라우팅 경계와 접근성, 테스트, 측정 기반 최적화를 함께 검토해요.', lessonIds: ['react-routing-accessibility', 'react-testing-performance'] },
    { id: 'react-capstone', stage: 5, title: '작은 앱 설계', objective: '데이터 흐름과 컴포넌트 경계를 설명하는 화면 설계를 완성해요.', lessonIds: ['react-architecture-capstone'] },
  ],
  lessons: [
    lesson('react-forms-lists', 'react-state-and-effects', '폼 입력과 목록 키', '11분', '입력 값을 상태에 연결하고 각 목록 항목의 안정된 키를 선택해요.',
      '제어 입력은 React 상태와 화면 값이 한 방향으로 연결됩니다. 반복 렌더링하는 목록에는 항목의 안정된 식별자를 key로 지정해야 항목 삽입·삭제 때 각 화면 조각의 정체성을 유지할 수 있어요.',
      ['입력 값과 onChange를 같은 상태에 연결해요.', '목록 항목의 key는 항목의 안정된 ID를 사용해요.', '배열 인덱스는 항목 재정렬이 없다고 보장될 때만 신중하게 고려해요.'],
      'function CourseList({ courses }) {\n  return courses.map((course) => <li key={course.id}>{course.title}</li>);\n}', [
        c('react-form-list-choice-v2', '제어 입력 연결 고르기', 'title state를 보여 주고 입력한 새 값도 state에 반영하는 제어 입력에 필요한 조합은?', [
          ['`value={title}`만 지정', '`id="title"`만 지정', '`value={title}`와 동기 `onChange` handler'],
        ], 2, '`value`가 현재 값을 지정하는지, 사용자가 바꾼 값이 handler를 통해 state로 돌아오는지 확인해요.', '제어 입력은 현재 `value`를 state로 표시하고 `onChange`에서 새 입력값을 동기적으로 state에 반영해야 합니다.'),
        s('react-form-short-v2', 'label 연결 대상', 'label의 `htmlFor`와 같은 값으로 연결해야 하는 입력 요소의 속성은 무엇인가요?', ['id', 'input id', '`id` 속성'], 'label은 화면에 보이는 문구를, input은 연결 대상 식별자를 제공합니다.', '예를 들어 `htmlFor="course-title"`은 `id="course-title"`인 입력과 연결됩니다.'),
        e('react-list-locate', '불안정한 키 찾기', '재정렬할 수 있는 목록에서 항목 식별을 깨뜨릴 수 있는 줄을 선택하세요.', 'React JSX 개념 코드', [
          'function CourseList({ courses }) {', '  return courses.map((course, index) => (', '    <li key={index}>{course.title}</li>', '  ));', '}',
        ], [3], '항목 순서가 바뀌면 인덱스 값은 같은 항목을 계속 가리키는지 생각해 보세요.', '3번 줄의 배열 인덱스 key는 앞에 항목을 추가하거나 재정렬하면 다른 과정에 재사용될 수 있습니다. 데이터의 안정된 ID를 사용하세요.'),
      ]),
    lesson('react-effects-derived-state', 'react-state-and-effects', 'Effect와 파생 상태 구분', '12분', '화면 계산과 외부 시스템 동기화를 구분해 불필요한 상태를 줄여요.',
      '렌더링에 필요한 값이 기존 props와 state에서 계산된다면 매 렌더링에서 직접 계산할 수 있어요. Effect는 브라우저 API, 구독, 네트워크 같은 React 밖의 시스템과 동기화할 때 사용하며 계산 결과를 state에 복사하는 용도로 남용하지 않습니다.',
      ['파생 값은 가능하면 렌더링 중 계산해요.', 'Effect는 외부 시스템과 동기화할 때 사용해요.', 'Effect 의존성은 Effect가 읽는 반응형 값과 일치해야 해요.'],
      'const visibleCourses = courses.filter((course) => course.title.includes(query));', [
        c('react-effect-choice-v2', '외부 연결 시작 고르기', 'roomId에 따라 React 바깥의 실시간 연결을 만들고 값이 바뀌거나 컴포넌트가 사라질 때 정리할 Hook은?', [
          ['`useMemo`', '`useEffect`와 정리 함수', '`useState`만 사용'],
        ], 1, '렌더링 값 계산이 아니라 외부 시스템과 연결·해제가 필요한지 확인하세요.', '외부 연결은 Effect에서 설정하고 반환한 정리 함수로 의존성 변경 전과 언마운트 때 연결을 해제합니다.'),
        s('react-effect-short-v2', '파생 목록 계산', '현재 courses에서 완료 항목만 보여 주는 목록을 별도 Effect state로 복사하지 않을 때 사용할 배열 메서드는 무엇인가요?', ['filter', '.filter()', 'filter()'], '조건에 맞는 원소만 남기는 배열 메서드를 떠올려 보세요.', '`courses.filter((course) => course.done)`처럼 현재 입력에서 화면에 필요한 목록을 계산할 수 있습니다.'),
        e('react-effect-locate-v2', '검색 Effect 의존성 찾기', 'Effect가 읽는 `query`가 바뀔 때마다 새 검색을 시작해야 합니다. 이를 막는 줄을 고르세요.', 'React Effect 개념 코드', [
          'useEffect(() => {', '  search(query);', '}, []);',
        ], [3], 'Effect 본문에서 읽은 query와 마지막 의존성 배열을 대조하세요.', '3번 줄의 빈 배열은 query 변경을 반영하지 않습니다. Effect가 읽는 query를 의존성에 두어 검색어가 바뀔 때 다시 동기화해야 합니다.'),
      ]),
    lesson('react-reducer-context', 'react-state-and-effects', 'Reducer와 Context 선택', '12분', '서로 관련된 복잡한 상태 변경과 깊은 전달을 역할에 맞게 나눠요.',
      '여러 이벤트가 같은 상태를 여러 방식으로 바꾸면 reducer에 상태 전이 규칙을 모을 수 있습니다. Context는 깊은 컴포넌트에 값을 전달하는 통로이지 상태 로직을 자동으로 단순하게 만드는 기능은 아니므로 변경 빈도와 범위를 살펴야 해요.',
      ['reducer는 현재 상태와 action으로 다음 상태를 반환해요.', 'reducer는 같은 입력에 같은 결과를 돌려주는 순수 함수여야 해요.', 'Context 값 변경은 그 값을 읽는 소비자의 다시 렌더링에 영향을 줄 수 있어요.'],
      'function reducer(state, action) {\n  if (action.type === "reset") return initialState;\n  return state;\n}', [
        c('react-reducer-choice', 'Reducer가 알맞은 상황', '화면 상태 변경 규칙이 여러 이벤트에 걸쳐 있고 서로 연결되어 있다면 어떤 도구가 규칙을 한곳에 모으기 좋을까요?', [
          ['reducer', 'DOM 요소의 임의 속성 변경', '각 이벤트에서 state 일부를 전역 변수로 덮어쓰기'],
        ], 0, '액션에 따른 다음 상태 계산을 한 함수로 모을 수 있는지 생각해 보세요.', 'Reducer는 현재 상태와 action을 받아 다음 상태를 계산하므로 복잡한 상태 전이를 한곳에서 읽고 테스트하기 쉽습니다.'),
        s('react-reducer-action-default-short-v3', '알 수 없는 action', 'reducer가 처리 분기가 없는 action type을 받았을 때 기존 상태를 안전하게 유지하려면 무엇을 반환하나요?', ['현재 state', '기존 상태', '바뀌지 않은 상태'], '각 action 분기 뒤의 기본 반환 동작을 확인하세요.', '처리하는 action type이 없으면 입력 state를 그대로 반환해 알 수 없는 action이 기존 상태를 바꾸지 않게 합니다.'),
        e('react-reducer-context-locate-v2', 'Context 값 사용 찾기', 'Provider의 theme이 바뀌어도 Header가 계속 고정된 색을 표시하게 만드는 줄을 고르세요.', 'React Context 개념 코드', [
          'const ThemeContext = createContext("light");', 'function Header() {', '  return <span>light</span>;', '}',
        ], [3], 'header가 Context 값을 읽는지, JSX에 글자를 고정해 두었는지 확인하세요.', '3번 줄은 Context를 소비하지 않고 `light` 글자를 고정해 Provider 값 변경을 반영하지 않습니다. `useContext(ThemeContext)`로 값을 읽어야 합니다.'),
      ]),
    lesson('react-custom-hooks', 'react-composition', '사용자 정의 Hook 만들기', '12분', '상태 로직을 공유하되 Hook 호출 규칙을 지켜요.',
      '사용자 정의 Hook은 React Hook을 사용하는 로직을 함수로 묶어 컴포넌트 사이에서 재사용합니다. 이름은 `use`로 시작하고 컴포넌트 또는 다른 Hook의 최상위에서 호출해야 합니다. Hook은 화면 조각 자체가 아니라 상태 로직을 공유해요.',
      ['Hook 이름은 `use`로 시작해요.', '반복문·조건문 안에서 Hook을 호출하지 않아요.', '여러 컴포넌트가 같은 Hook을 써도 각 호출의 상태는 서로 독립적이에요.'],
      'function useDisclosure() {\n  const [open, setOpen] = useState(false);\n  return { open, show: () => setOpen(true), hide: () => setOpen(false) };\n}', [
        c('react-hook-name-choice-v3', 'Hook 이름', '상태와 Effect를 사용하는 사용자 정의 Hook으로 알맞은 이름은?', [
          ['`getDisclosure`', '`UseDisclosure`', '`useDisclosure`'],
        ], 2, 'React custom Hook은 소문자 use 접두사로 시작합니다.', '이름을 `useDisclosure`처럼 소문자 use로 시작하면 Hook 규칙과 lint 도구가 사용자 정의 Hook으로 인식합니다.'),
        s('react-hook-top-level-short-v2', 'Hook 호출 위치', '조건이나 반복 횟수에 따라 호출 수가 달라지지 않도록 Hook을 둘 위치는 어디인가요?', ['컴포넌트 또는 custom Hook의 최상위', '컴포넌트 함수 최상위', 'custom Hook의 최상위'], 'early return보다 앞에서 컴포넌트 또는 다른 Hook의 본문 최상위에 둡니다.', 'Hook은 컴포넌트나 사용자 정의 Hook의 최상위에서 같은 순서로 호출해야 합니다.'),
        e('react-hook-return-locate-v2', 'Hook 반환 계약 찾기', '호출자가 열림 상태를 표시하고 바꿀 수 없게 만드는 줄을 고르세요.', 'React custom Hook 개념 코드', [
          'function useDisclosure() {', '  const [open, setOpen] = useState(false);', '  return open;', '}',
        ], [3], '호출자가 상태 값뿐 아니라 열기·닫기 동작에 접근할 수 있는지 보세요.', '3번 줄은 open 값만 반환해 setter와 동작을 숨깁니다. `{ open, setOpen }` 또는 명시적 show/hide 함수를 반환해야 합니다.'),
      ]),
    lesson('react-async-data', 'react-composition', '비동기 데이터 상태 나누기', '13분', '로딩·성공·실패 상태와 늦게 도착한 응답을 구분해요.',
      '비동기 요청 화면은 로딩 중, 성공, 실패를 서로 다른 상태로 보여 줘야 합니다. 요청이 취소되거나 검색어가 바뀐 뒤 이전 응답이 늦게 오면 최신 화면을 덮어쓸 수 있으므로 요청 수명과 결과 순서를 고려해야 해요.',
      ['로딩·성공·실패가 서로 모순되지 않게 모델링해요.', '이전 요청 결과가 최신 요청 화면을 덮지 않게 해요.', '요청 실패는 빈 결과와 다르게 안내해요.'],
      'useEffect(() => {\n  const controller = new AbortController();\n  fetchCourses(query, { signal: controller.signal })\n    .then(setCourses)\n    .catch((error) => {\n      if (error.name !== "AbortError") setError(error);\n    });\n  return () => controller.abort();\n}, [query]);', [
        c('react-async-choice-v2', '요청 상태 모델', 'loading과 error가 동시에 참인 모순을 줄이고 요청 단계를 하나씩 표현하는 방법은?', [
          ['`status`를 idle, loading, success, error 중 하나로 관리합니다.', 'loading과 error boolean을 각각 독립적으로 저장합니다.', '상태를 저장하지 않고 DOM class를 읽어 현재 단계를 추측합니다.'],
        ], 0, '요청이 한 시점에 어떤 단계인지 하나의 구분된 값으로 나타내세요.', '한 시점의 요청 단계가 하나의 값이면 서로 모순되는 boolean 조합을 만들지 않고 각 결과를 분기하기 쉽습니다.'),
        s('react-async-loading-short-v2', '요청 전 화면 상태', '검색 요청을 `await`하기 직전에 화면 상태를 어떤 값으로 바꾸나요?', ['loading', '불러오는 중', '로딩'], '요청이 완료되기 전 진행 중임을 먼저 표시합니다.', '요청을 시작한 직후 `loading`으로 바꾸면 응답을 기다리는 동안 사용자가 진행 중 상태를 확인할 수 있습니다.'),
        e('react-async-locate', '오래된 응답 반영 찾기', '컴포넌트가 바뀌어도 늦은 이전 요청이 결과를 덮어쓸 수 있게 만드는 줄을 선택하세요.', 'React 요청 개념 코드', [
          'useEffect(() => {', '  fetchCourses(query).then(setCourses);', '}, [query]);',
        ], [2], 'query가 바뀐 뒤 이전 Promise가 끝나도 상태 갱신이 남아 있는지 살펴보세요.', '2번 줄은 이전 요청을 취소하거나 무시하지 않고 바로 상태에 반영합니다. 요청 수명 또는 최신 요청 식별 검사가 필요합니다.'),
      ]),
    lesson('react-routing-accessibility', 'react-quality', '화면 이동과 접근성 경계', '13분', '링크·버튼의 의미를 지키고 화면 이동 뒤 초점을 안내해요.',
      '클라이언트 라우팅은 화면 주소와 컴포넌트 구성을 연결하지만, 접근 가능한 이동에는 의미 있는 링크·버튼, 변경된 제목 안내, 적절한 초점 이동도 필요합니다. 정적 학습 앱의 이 예시는 라우터 제품을 설치하거나 서버 렌더링을 전제하지 않는 개념 문제예요.',
      ['이동은 링크, 현재 화면 안 동작은 버튼을 사용해요.', '아이콘만 있는 컨트롤에는 접근 가능한 이름을 제공해요.', '화면이 바뀌면 제목과 포커스 이동을 함께 고려해요.'],
      '<a href="/courses/java">Java 과정 열기</a>\n<button type="button">목록 새로고침</button>', [
        c('react-route-choice', '의미 있는 요소 고르기', '다른 과정의 주소로 이동하는 조작에 가장 맞는 HTML 요소는 무엇인가요?', [
          ['목적지가 있는 링크', '클릭 이벤트만 붙인 `<div>`', '제출 동작이 없는 기본 제출 버튼'],
        ], 0, '사용자가 새 탭에서 열거나 링크 주소를 확인할 필요가 있는지 생각해 보세요.', '화면 이동에는 목적지 URL을 가진 링크가 의미와 브라우저 기본 동작을 제공합니다.'),
        s('react-action-button-short-v2', '화면 안 동작의 요소', '현재 화면에서 설명을 펼치는 동작에 의미와 기본 키보드 실행을 제공할 HTML 요소는 무엇인가요?', ['button', '버튼', '<button>'], '주소로 이동하는 링크와 화면 안에서 동작을 실행하는 요소를 구분하세요.', '현재 화면에서 동작을 실행할 때는 버튼을 사용합니다. 목적지로 이동하는 조작은 href가 있는 링크로 표현합니다.'),
        e('react-route-focus-locate-v2', '이동 뒤 포커스 찾기', '화면 이동 뒤 제목으로 키보드 포커스를 실제로 옮기지 않는 줄을 고르세요.', 'React JSX 개념 코드', [
          'function CoursePage({ course, pathname }) {',
          '  const headingRef = useRef(null);',
          '  useEffect(() => { headingRef.current?.scrollIntoView(); }, [pathname]);',
          '  return <h1 ref={headingRef} tabIndex={-1}>{course.title}</h1>;',
          '}',
        ], [3], '화면을 스크롤하는 것과 키보드의 현재 포커스 위치를 바꾸는 것은 같은 동작이 아닙니다.', '3번 줄은 제목을 화면 안으로 스크롤하지만 키보드 포커스를 이동하지 않습니다. 새 화면의 제목을 안내하려면 대상이 programmatic focus를 받을 수 있게 하고 `.focus()`를 호출해야 합니다.'),
      ]),
    lesson('react-testing-performance', 'react-quality', '사용자 관점 테스트와 성능 측정', '14분', '화면의 사용자 동작을 검증하고 측정 결과에 따라 최적화해요.',
      '테스트는 내부 함수 호출보다 사용자가 보고 조작하는 결과를 확인하는 편이 안전합니다. 성능 최적화는 먼저 느린 구간을 측정하고, 실제 병목과 렌더링 비용을 확인한 뒤 필요한 곳에 적용해야 해요. React 19.3 기능은 해당 버전의 공식 호환 범위에서만 사용합니다.',
      ['레이블과 사용자 동작을 통해 결과를 확인해요.', '메모이제이션은 항상 빠르다는 보장이 없어요.', '계측 결과와 React 도구로 병목을 찾은 뒤 최적화해요.'],
      'render(<CourseForm />);\nawait user.type(screen.getByLabelText("과정 이름"), "Java");\nawait user.click(screen.getByRole("button", { name: "저장" }));\nexpect(await screen.findByText("저장했어요")).toBeVisible();', [
        c('react-test-role-choice-v2', '사용자 역할과 이름으로 찾기', '이름이 “저장”인 실제 버튼을 사용자 관점에서 찾는 Testing Library 쿼리는?', [
          ['`screen.getByRole("button", { name: "저장" })`', '`screen.getByTestId("save")`', '`container.querySelector(".save")`'],
        ], 0, '접근성 트리에서 보이는 버튼 역할과 그 이름을 함께 조회하세요.', '역할과 accessible name으로 요소를 찾으면 테스트가 사용자에게 제공되는 의미와 이름을 함께 확인합니다.'),
        s('react-test-result-short-v2', '동작 뒤 보이는 결과', '저장 버튼을 누른 뒤 화면에 표시할 성공 문구를 `저장했어요`로 정했습니다. 사용자에게 확인할 결과 문구를 적으세요.', ['저장했어요', '“저장했어요”'], '호출 함수가 실행됐는지와 사용자가 성공 안내를 실제로 볼 수 있는지는 다른 확인입니다.', '이 시나리오의 성공 결과는 화면에 보이는 `저장했어요`입니다. 테스트는 저장 뒤 이 문구가 나타나는지도 확인해야 합니다.'),
        e('react-test-measure-locate-v3', '목록 필터의 의존성 찾기', '측정 후 useMemo를 적용한 목록 필터입니다. 검색어가 바뀌어도 이전 결과가 남을 수 있는 줄을 고르세요.', 'React JSX 개념 코드', [
          'function CourseResults({ courses, query }) {',
          '  const visible = useMemo(() => filterCourses(courses, query), [courses]);',
          '  return <CourseList courses={visible} />;',
          '}',
        ], [2], '필터 함수가 읽는 props와 의존성 배열에 들어 있는 값을 비교하세요.', '2번 줄의 필터는 courses와 query를 모두 읽지만 의존성에는 courses만 있습니다. `[courses, query]`를 사용해야 검색어가 바뀔 때도 계산을 다시 합니다.'),
      ]),
    lesson('react-architecture-capstone', 'react-capstone', '학습 기록 화면 설계 캡스톤', '18분', '화면 상태·컴포넌트 경계·접근성을 설명하는 설계를 완성해요.',
      '학습 기록 화면을 직접 구현한다고 가정하고 데이터 흐름을 설계합니다. 상단에 진도 요약, 중간에 경로별 단원, 하단에 최근 풀이를 둡니다. 이 앱은 영속 저장을 서버에 맡기지 않으므로 브라우저 저장 경계와 실패 안내를 포함해야 해요.',
      ['공유할 상태와 컴포넌트 로컬 상태를 나눠요.', '한 화면에 필요한 데이터를 명시적인 props로 전달해요.', '빈 기록·저장 실패·키보드 초점 상태도 설계에 포함해요.'],
      'LearningPage\n├─ ProgressSummary\n├─ TrackSection\n│  └─ LessonRow\n└─ RecentAnswers', [
        c('react-capstone-choice', '컴포넌트 상태 위치', '최근 풀이 목록만 펼치거나 접는 표시 상태가 해당 섹션에서만 쓰인다면 어디에 두는 편이 단순한가요?', [
          ['해당 목록 컴포넌트의 로컬 상태', '모든 화면이 공유하는 최상위 전역 상태', 'DOM에서 매번 직접 읽는 숨은 값'],
        ], 0, '다른 화면이나 형제 컴포넌트가 이 값을 실제로 공유해야 하는지 확인해요.', '한 섹션 내부에서만 사용하는 표시 상태는 그 컴포넌트 가까이에 두면 데이터 흐름이 단순해집니다.'),
        s('react-disclosure-state-short-v2', '펼침 상태의 의미', '펼침 상태가 처음 false이고 사용자가 버튼을 한 번 눌러 반전되면 `aria-expanded`에 전달할 값은 무엇인가요?', ['true', '참', '열림'], '한 번 누르면 false의 반대 상태가 됩니다.', '한 번 눌러 상태를 반전한 결과는 true입니다. 버튼의 `aria-expanded`에도 실제 열림 상태를 반영해야 합니다.'),
        e('react-capstone-empty-locate-v2', '빈 기록 안내 찾기', '최근 답안이 없을 때 빈 이유와 다음 행동을 모두 안내하지 않는 줄을 고르세요.', 'React JSX 개념 코드', [
          'function RecentAnswers({ answers }) {',
          '  if (answers.length === 0) return null;',
          '  return <ul>{answers.map((answer) => <li key={answer.id}>{answer.text}</li>)}</ul>;',
          '}',
        ], [2], '빈 배열에서 아무 내용도 렌더링하지 않으면 사용자는 저장된 답이 없는지 확인할 방법이 없습니다.', '2번 줄은 빈 기록일 때 화면을 비워 둡니다. “아직 답안이 없습니다”라는 안내와 학습을 계속할 경로를 표시해야 합니다.'),
      ]),
  ],
  extraExercises: {
    'react-components': [
      c('react-components-reuse-choice', '컴포넌트 단위 선택', '반복해서 쓰이는 과정 제목과 설명 표시를 화면에서 재사용하고 싶습니다. 무엇으로 묶는 게 자연스러울까요?', [
        ['입력과 표현 책임이 분명한 작은 컴포넌트', '화면 전체를 하나의 거대한 인라인 문자열로 작성', 'DOM 요소를 이름 없는 전역 변수에 저장'],
      ], 0, '같은 모양과 책임을 가진 UI를 독립적으로 읽고 재사용할 방법을 생각해 보세요.', '작은 컴포넌트는 역할과 props가 분명해 재사용하거나 따로 테스트하기 좋습니다.'),
      s('react-components-short', 'JSX 반환', '함수 컴포넌트가 화면에 보여 줄 UI 설명을 작성할 때 반환하는 문법 표현을 무엇이라고 부르나요?', ['JSX', 'jsx'], 'HTML처럼 보이지만 JavaScript 표현과 조합되는 문법이에요.', 'JSX는 JavaScript에서 UI 구조를 표현하는 문법 확장입니다.'),
    ],
    'react-props': [
      c('react-props-contract-choice', '상위에서 값 전달', '부모가 자식 컴포넌트에 과정 제목을 전달할 때 사용하는 입력 값은 무엇인가요?', [
        ['props', '브라우저 쿠키', 'DOM의 임의 속성 문자열'],
      ], 0, '컴포넌트를 함수처럼 호출할 때 전달하는 입력을 떠올려 보세요.', '`props`는 부모가 JSX 속성으로 전달해 자식 함수가 입력으로 받는 값 객체예요. 자식은 그 값을 읽어 화면을 표시하고, 값이 달라지면 부모가 새 props를 전달합니다.'),
      e('react-props-locate', '컴포넌트 입력 누락 찾기', '`title` prop을 화면에 표시하지 않는 줄을 고르세요.', 'React JSX', [
        'function TrackHeading({ title }) {', '  return <h2>배울 주제</h2>;', '}',
      ], [2], '매개변수로 받은 `title`이 JSX에서 쓰이는지 살펴보세요.', '2번 줄은 고정 문구만 렌더링해 전달된 `title` prop을 사용하지 않습니다.'),
    ],
    'react-events-state': [
      c('react-event-choice', '이벤트 핸들러 전달', '클릭할 때 실행해야 하는 `save` 함수를 버튼에 전달하는 표현으로 알맞은 것은 무엇인가요?', [
        ['onClick={save}', 'onClick={save()}', 'onClick="save"'],
      ], 0, '렌더링 중 바로 호출되는 표현과 나중에 호출할 함수 참조를 구분해요.', '`onClick={save}`는 함수 참조를 전달하고 사용자가 클릭할 때 React가 실행합니다.'),
      s('react-event-short-v2', '렌더 state 스냅샷', 'count가 0인 렌더의 클릭 handler에서 `setCount((current) => current + 1)`을 호출한 직후, 다시 렌더되기 전에 `console.log(count)`를 실행하면 무엇을 기록하나요?', ['0'], 'setter는 다음 렌더를 요청하지만 현재 handler가 캡처한 count 변수를 즉시 바꾸지 않습니다.', '현재 handler는 count가 0인 렌더의 스냅샷을 읽으므로 로그는 0입니다. 다음 렌더에서 새 state 1을 받습니다.'),
    ],
    'react-state': [
      c('react-state-copy-choice-v2', '기존 배열 보존하며 추가하기', 'courses에 course 하나를 추가하면서 기존 항목과 state 참조를 안전하게 보존하는 표현은?', [
        ['current.push(course) 뒤 같은 current를 반환', '[...current, course]', 'course만 setter에 전달'],
      ], 1, '이전 배열에서 원소를 복사하고 새 항목을 붙인 새 참조를 만드는지 살펴보세요.', '함수형 updater 안에서 새 배열을 반환하면 최신 courses를 보존하고 새 항목도 추가합니다.'),
      e('react-state-remove-locate-v2', '배열에서 항목 제외하기', 'id와 같은 항목을 제거하려는 filter 조건에서 잘못된 줄을 고르세요.', 'React state 개념 코드', [
        'function removeCourse(courses, id) {', '  return courses.filter((course) => course.id === id);', '}',
      ], [2], 'filter는 조건이 참인 항목을 남깁니다. 지울 항목과 비교 방향을 확인하세요.', '2번 줄은 삭제할 id와 같은 항목만 남기므로 결과에 제거 대상이 그대로 들어갑니다. 남길 조건은 `course.id !== id`입니다.'),
    ],
  },
};
