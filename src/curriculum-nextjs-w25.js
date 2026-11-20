const reviewedCheck = (title, prompt, correct, wrong, answerIndex, hint, explanation, wrongFeedback) => ({
  title,
  prompt,
  correct,
  wrong,
  answerIndex,
  hint,
  explanation,
  wrongFeedback,
});

const reviewedWrite = (title, prompt, acceptedAnswers, hint, explanation) => ({
  title,
  prompt,
  acceptedAnswers,
  hint,
  explanation,
});

export const reviewedReactBoundaryObjectives = {
  25: [
    'useState와 browser event가 필요한 작은 Client Component를 서버 page 경계와 나눠요.',
    'Context Provider만 클라이언트 경계에 두고 서버 콘텐츠 트리를 불필요하게 넓히지 않아요.',
    'Effect는 외부 구독에 연결하고 dependency 변경 때 cleanup이 이전 연결을 정리하는지 확인해요.',
    '브라우저 event handler와 server Action은 실행 위치·호출 경계·입력 검증 책임이 다름을 구분해요.',
    'React API 사용 전 고정된 Next/React 설치 조합과 공식 API 지원 문맥을 확인해요.',
  ],
};

export const reviewedReactBoundaryWeeks = {
  25: [
    {
      check: reviewedCheck(
        '작은 Client Component 경계',
        '과정 페이지는 서버에서 과정 데이터를 읽습니다. 버튼만 `useState`와 `onClick`을 써서 접을 수 있어요. 어떤 경계가 적절한가요?',
        '서버 페이지는 유지하고 상호작용이 필요한 버튼 컴포넌트 진입 파일에만 `use client`를 둬요.',
        ['page 전체에 `use client`를 추가해 데이터 읽기까지 브라우저로 옮겨요.', '파일 이름에 ClientButton이라고 붙이면 지시문 없이 hook과 onClick을 서버에서 쓸 수 있어요.'],
        0,
        '서버 데이터 조회와 브라우저 이벤트가 필요한 모듈을 나눠 보세요.',
        '`use client`는 해당 파일을 시작으로 한 module graph의 경계를 정해요. 서버에서 가져온 page와 데이터 접근을 유지하고 hook·event가 필요한 작은 하위 컴포넌트에서 시작하면 client bundle을 줄일 수 있어요.',
        ['페이지 전체를 client로 바꾸면 서버에서 처리 가능한 코드까지 client graph에 포함될 수 있어요.', '파일 이름은 React의 실행 경계를 선언하지 않아요.'],
      ),
      explain: reviewedWrite(
        '클라이언트 경계 지시문',
        'React hook과 browser event가 필요한 모듈의 맨 위에 선언하는 Next.js 지시문은 무엇인가요?',
        ['use client', '"use client"', "'use client'"],
        '공백이 포함된 두 단어의 module directive예요.',
        '`"use client"`는 browser interaction이 필요한 모듈 graph의 시작 경계를 선언해요.',
      ),
      apply: reviewedWrite(
        '상호작용 경계 최소화',
        '서버에서 만든 `CourseTitle`과 상호작용하는 `ProgressToggle`을 함께 표시합니다. 꼭 Client Component가 되어야 하는 쪽은 무엇인가요?',
        ['ProgressToggle', 'ProgressToggle만', '진도 버튼'],
        'state를 바꾸고 click event를 처리하는 쪽을 찾으세요.',
        '정적인 `CourseTitle`은 서버에 둘 수 있고 browser state와 event를 쓰는 `ProgressToggle`만 Client Component가 되면 돼요.',
      ),
    },
    {
      check: reviewedCheck(
        'Context Provider 범위',
        '서버 root layout이 Server Component 자식 페이지를 렌더링합니다. 테마 Context가 필요한 작은 설정 UI가 있을 때 적절한 설계는 무엇인가요?',
        'Context를 쓰는 Provider를 Client Component로 만들고 서버 layout은 그 Provider가 감싸는 children을 전달해요.',
        ['Context를 읽는 화면을 위해 모든 page와 data module에 `use client`를 붙여요.', 'Context Provider를 server-only 모듈에 두면 browser state가 자동으로 공유돼요.'],
        2,
        'Provider의 기능 경계와 Provider가 감싸는 화면 트리의 서버/클라이언트 위치를 나눠요.',
        'React Context는 Client Component 경계에서 제공해요. 서버 layout은 client Provider를 배치하면서 Server Component children을 전달할 수 있어, Provider 자체만 interactive boundary로 두는 구조를 사용할 수 있어요.',
        ['전체 tree를 client로 옮길 필요는 없고 server layout은 공통 껍데기를 유지할 수 있어요.', 'Server Component에서 Context provider 기능을 직접 실행할 수 있는 것은 아니에요.'],
      ),
      explain: reviewedWrite(
        'Context 소비 hook',
        'Client Component에서 상위 Provider가 준 현재 값을 읽는 React hook 이름은 무엇인가요?',
        ['useContext', 'useContext()'],
        'createContext로 만든 객체를 받는 React hook이에요.',
        '`useContext(ThemeContext)`는 가장 가까운 상위 Provider의 현재 값을 읽어요.',
      ),
      apply: reviewedWrite(
        'Provider 배치 경계',
        'Server Component인 root layout에서 테마 Provider를 사용해 자식 화면을 감쌀 때 Provider children 자리에 전달할 React prop 이름은 무엇인가요?',
        ['children'],
        'layout이 감싸는 하위 화면을 가리키는 기본 prop이에요.',
        'layout은 Client Provider를 감싸는 위치에 배치하고 기존 서버 하위 화면을 `children`으로 전달해요.',
      ),
    },
    {
      check: reviewedCheck(
        'Effect가 필요한 상황',
        '화면은 prop `courseTitle`을 보여 주고 브라우저 `document.title`도 갱신해야 합니다. useEffect를 쓰기 적절한 작업은 무엇인가요?',
        '`document.title` 같은 browser 외부 시스템 동기화를 Effect에서 수행하고 화면 제목은 render에서 바로 계산해요.',
        ['표시 제목을 별도 state에 복사하는 데 Effect를 쓰고 매번 두 값을 동기화해요.', '서버 component가 browser의 document를 직접 읽어도 동일하게 실행돼요.'],
        1,
        '렌더 계산과 React 바깥의 browser 시스템 동기화를 구분하세요.',
        'Effect는 document, subscription 같은 외부 시스템과 동기화할 때 써요. prop에서 바로 알 수 있는 화면 값은 render 중 사용하고 별도 state 복사를 만들지 않아요.',
        ['파생 값을 Effect로 복사하면 추가 render와 stale state 위험이 생겨요.', '서버 환경에는 browser document가 없고 Effect도 Client Component에서 실행돼요.'],
      ),
      explain: reviewedWrite(
        '외부 시스템 예',
        '브라우저 탭의 제목을 바꾸는 `document.title`은 React 안의 파생 state와 외부 browser 시스템 중 어느 쪽인가요?',
        ['외부 browser 시스템', '외부 시스템', '브라우저 외부 시스템'],
        'React 컴포넌트 state와 별도로 브라우저가 소유하는 값을 떠올리세요.',
        '`document.title`은 browser DOM의 값이므로 Effect로 동기화할 수 있는 외부 시스템이에요.',
      ),
      apply: reviewedWrite(
        'Effect dependency 변경',
        'Effect가 `courseId`별 subscription을 열고 있으며 `courseId`가 바뀔 때 이전 구독을 끝내야 합니다. 반환 함수가 해야 할 작업은 무엇인가요?',
        ['이전 구독 정리', 'unsubscribe', '구독 해제'],
        'Effect 재실행 전 또는 컴포넌트가 사라질 때 외부 연결을 닫아요.',
        'cleanup은 이전 `courseId` 구독을 해제한 뒤 새 식별자로 다시 연결하고 unmount 시에도 자원을 정리해요.',
      ),
    },
    {
      check: reviewedCheck(
        'Event handler와 Server Action',
        '즐겨찾기 아이콘은 `onClick`으로 화면 상태를 바꾸고 서버에는 별도 저장 요청을 보냅니다. 코드 경계를 올바르게 이해한 설명은 무엇인가요?',
        'onClick은 Client Component의 browser event이고 저장은 명시적 요청 또는 Server Action 경계를 통해 서버에서 검증해요.',
        ['일반 onClick 함수는 Next.js가 자동으로 서버에서 실행하고 입력을 검증해요.', 'Client Component에서 숨긴 버튼이면 서버 Action 호출 권한도 자동 보호돼요.'],
        0,
        '사용자 event 처리와 신뢰할 수 없는 서버 입력의 검증 위치를 나누세요.',
        '일반 event handler는 browser에서 실행돼요. 저장 요청을 서버가 받더라도 서버에서 인증·인가·입력 검증을 해야 하고 UI의 숨김은 권한 보호가 아니에요.',
        ['onClick은 자동 Server Action이 아니며 실행 위치와 네트워크 경계를 명시해야 해요.', 'UI 상태나 버튼 표시만으로 서버 mutation 권한을 보호할 수 없어요.'],
      ),
      explain: reviewedWrite(
        '브라우저 클릭 속성',
        '버튼 클릭 때 Client Component의 함수를 연결하는 JSX 속성 이름은 무엇인가요?',
        ['onClick', 'onClick 속성'],
        '브라우저 사용자 입력 event 이름을 camelCase로 적어요.',
        '`onClick` handler는 Client Component의 browser event 경계에서 실행돼요.',
      ),
      apply: reviewedWrite(
        '서버 저장 인가 주체',
        '브라우저가 강의 즐겨찾기 저장을 요청합니다. 서버가 저장 전에 권한을 확인할 주체는 누구인가요?',
        ['인증된 현재 사용자', '현재 인증된 사용자', '현재 사용자와 자원 권한'],
        '요청 body가 주장하는 소유자가 아니라 서버가 검증한 요청 identity예요.',
        '서버는 인증된 사용자를 식별하고 해당 강의 또는 사용자 데이터에 대한 권한을 직접 검증해야 해요.',
      ),
    },
    {
      check: reviewedCheck(
        'React API와 Next 설치 조합',
        '새 React hook 예제가 공식 React 문서에 있습니다. 팀의 기존 프로젝트에서 사용 가능 여부를 판단할 근거로 가장 적절한 것은 무엇인가요?',
        '프로젝트 lockfile의 Next·React 버전과 각 공식 문서의 버전 지원을 확인해요.',
        ['React 최신 문서에 있으면 어떤 Next.js 버전에서도 곧바로 사용할 수 있어요.', '편집기에서 import 자동완성이 뜨면 빌드·런타임 호환성이 보장돼요.'],
        2,
        '공식 API 존재 여부와 현재 프로젝트가 그 API를 함께 지원하는지는 다른 질문이에요.',
        'Next.js가 지원하는 React 조합과 실제 lockfile 버전을 확인해야 해요. editor autocomplete만으로 빌드 또는 runtime 호환성을 증명하지 않아요.',
        ['최신 React API도 프레임워크의 peer range와 설치 버전이 맞는지 확인해야 해요.', '자동완성은 타입 인덱스가 있다는 증거이지 실행 호환성 검증이 아니에요.'],
      ),
      explain: reviewedWrite(
        '재현 설치 기준 파일',
        '개발자 사이에서 Next.js와 React의 정확한 설치 버전을 재현할 때 확인할 npm 파일은 무엇인가요?',
        ['package-lock.json', 'lockfile', '잠금 파일'],
        'package.json 범위 대신 실제 해석된 버전을 기록해요.',
        'lockfile의 정확한 의존성 해석을 확인한 뒤 공식 호환 문서와 비교해요.',
      ),
      apply: reviewedWrite(
        '새 React API 채택 전 확인',
        'React 문서에서 새 hook을 발견했습니다. 현재 프로젝트 호환성을 확인하기 위해 함께 대조할 framework와 라이브러리 이름을 적으세요.',
        ['Next.js와 React 버전', '설치된 Next.js와 React 버전', 'Next와 React'],
        '프레임워크와 API가 제공되는 React runtime 버전 둘 다 확인하세요.',
        '현재 설치된 Next.js와 React 조합, 해당 Next 버전의 지원 문서를 확인한 뒤 새 API를 채택해요.',
      ),
    },
  ],
};
