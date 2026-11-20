import { choice, shortAnswer, versionedShortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { reviewedNextObjectives, reviewedNextWeeks } from './curriculum-nextjs-w19-w21.js';
import { reviewedQualityObjectives, reviewedQualityWeeks } from './curriculum-nextjs-w22-w24.js';
import { reviewedReactBoundaryObjectives, reviewedReactBoundaryWeeks } from './curriculum-nextjs-w25.js';
import { reviewedCompatibilityObjectives, reviewedCompatibilityWeeks } from './curriculum-nextjs-w26-w28.js';
import { reviewedReliabilityObjectives, reviewedReliabilityWeeks } from './curriculum-nextjs-w29-w30.js';
import { reviewedReliabilityExamples } from './curriculum-nextjs-w29-w30-examples.js';
import { reviewedReleaseObjectives, reviewedReleaseWeeks } from './curriculum-nextjs-w31-w33.js';
import { reviewedReleaseExamples } from './curriculum-nextjs-w31-w33-examples.js';

// This track teaches Next.js concepts and code reading only. The static site
// does not run a Next.js/Node server, so none of these snippets are presented
// as executable or output-graded code.
const phases = [
  { id: 'nextjs-phase-foundations', stage: 1, title: 'Next.js와 App Router 기초', weeks: [1, 2, 3, 4], objective: 'React 선수 지식 위에 Next.js 프로젝트와 화면 경로를 읽어요.' },
  { id: 'nextjs-phase-routing', stage: 2, title: '라우팅과 화면 구성', weeks: [5, 6, 7, 8], objective: '동적 경로, 레이아웃, Server/Client 경계를 구분해요.' },
  { id: 'nextjs-phase-rendering', stage: 3, title: '데이터와 렌더링 흐름', weeks: [9, 10, 11, 12, 13], objective: '데이터 요청, 로딩, 오류, 메타데이터의 책임을 연결해요.' },
  { id: 'nextjs-phase-server-features', stage: 4, title: '요청과 서버 기능 이해', weeks: [14, 15, 16, 17, 18], objective: '서버 전용 기능을 실제 실행 지원과 혼동하지 않고 설계해요.' },
  { id: 'nextjs-phase-quality', stage: 5, title: '품질·보안·성능', weeks: [19, 20, 21, 22, 23, 24], objective: '접근성, 비밀값, 테스트와 성능을 검토해요.' },
  { id: 'nextjs-phase-reliability', stage: 6, title: '테스트·운영·장애 대응', weeks: [25, 26, 27, 28, 29, 30], objective: '테스트 근거, 저장소 경계, 오류 복구 흐름을 설계해요.' },
  { id: 'nextjs-phase-release', stage: 7, title: '정적 배포와 실전 설계', weeks: [31, 32, 33], objective: '정적 배포의 지원 범위를 알고 학습 앱 구조를 완성해요.' },
];

// Each daily case provides a specific concept, a reading example, the rule,
// the tempting mistake, and the consequence. Questions check understanding;
// they do not compile or execute the snippet.
const weeks = [
  {
    title: 'Next.js가 맡는 역할', objective: 'React 화면 위에 라우팅과 렌더링 방식을 제공하는 Next.js의 경계를 설명해요.',
    days: [
      ['프레임워크의 역할', '/* app/page.tsx → / */\nexport default function HomePage() {\n  return <main><h1>과정</h1></main>;\n}', 'Next.js는 React 컴포넌트로 화면을 만들고, 라우팅·렌더링·빌드 규칙을 연결해요.', 'Next.js는 React와 무관한 별도 UI 언어예요.', 'React 문법과 Next.js의 파일·요청 규칙을 함께 살펴야 해요.', 'React가 화면 내용을 표현하고 Next.js가 프로젝트·요청 흐름의 규칙을 제공하는지 구분해요.'],
      ['App Router와 파일 경로', 'app/\n├── page.tsx                 → /\n└── courses/\n    └── page.tsx             → /courses', 'App Router에서는 app 아래의 page 파일과 폴더 경로가 화면 URL을 만들어요.', '아무 파일이나 app 안에 있으면 URL이 돼요.', 'page 파일인지 일반 구성 파일인지 구분해야 해요.', '파일 경로에서 page.tsx를 기준으로 브라우저 주소를 계산해요.'],
      ['빌드와 실행 모드', '# 변경 내용을 빠르게 확인하는 개발 서버\nnext dev\n\n# 배포용 결과를 생성한 뒤 Node 서버로 제공\nnext build\nnext start', 'next dev는 개발, next build는 배포 빌드, next start는 빌드된 서버 앱 실행 단계예요.', '개발 모드에서 본 결과가 곧 배포 빌드 검증이에요.', '정적 내보내기와 Node 서버 배포의 차이를 확인해야 해요.', '빌드 성공과 실제 배포 서버 실행은 각각 별도 증거로 확인해요.'],
      ['서버 렌더와 브라우저 UI', 'export default async function CoursesPage() {\n  const courses = await getPublicCourses();\n  return <CourseList courses={courses} />;\n}', 'App Router의 기본 컴포넌트는 서버에서 데이터를 읽고 화면을 만들 수 있어요.', '모든 컴포넌트 코드는 브라우저에서 실행돼요.', '브라우저 전용 API를 서버 컴포넌트에서 바로 쓸 수 없어요.', '서버 전용 코드와 브라우저 이벤트가 필요한 작은 컴포넌트를 구분해요.'],
      ['프로젝트 요구사항 읽기', '요구: 과정 안내 페이지를 정적 파일로 배포\n필요: 메뉴 열기·검색 필터 같은 브라우저 상호작용\n불필요: 매 요청마다 실행하는 서버 코드', '미리 만들 수 있는 페이지와 브라우저 상호작용은 정적으로 배포할 수 있지만 요청별 서버 기능은 호스트가 Node 실행을 지원해야 해요.', '기능을 정한 뒤 배포 제약은 나중에 생각해요.', '서버 전용 기능이 필요한지 초기에 판별해야 해요.', '화면 동작 요구와 요청 시점 서버 처리 요구를 따로 적어 호스팅 적합성을 판단해요.'],
    ],
  },
  {
    title: '프로젝트 구조와 명명 규칙', objective: 'app, src, public 및 파일 이름이 가지는 의미를 구분해요.',
    days: [
      ['app 디렉터리', 'app/\n└── courses/\n    ├── page.tsx       # /courses 화면\n    └── layout.tsx     # 하위 화면을 감싸는 공통 UI', '라우트를 만드는 page와 경로 아래 화면을 감싸는 layout은 서로 다른 예약 파일이에요.', '폴더 깊이만 같으면 모든 파일이 페이지가 돼요.', '예약된 page·layout 파일과 일반 모듈을 구별해야 해요.', '같은 폴더의 page와 layout이 각각 URL과 공유 UI를 맡는지 확인해요.'],
      ['src/app 구조', 'src/\n└── app/\n    └── courses/\n        └── page.tsx   # /courses\n\n# app/과 src/app/ 중 프로젝트에서 선택한 한 구조를 사용', 'Next.js 프로젝트는 루트 app 또는 src/app을 사용할 수 있어요. 두 구조가 합쳐지는 것은 아니므로 하나를 기준으로 파일을 찾아요.', 'src/app과 app을 동시에 두어도 한쪽이 자동 병합돼요.', '팀이 선택한 한 구조를 기준으로 파일을 찾는 게 중요해요.', 'src/app이라는 파일 위치가 URL에 /src 접두사를 더하지 않는 점도 구분해요.'],
      ['public 자산', 'public/\n└── logo.svg\n\n브라우저 URL: /logo.svg', 'public의 정적 파일은 public 접두사를 제외한 경로로 제공돼요.', 'public/logo.svg의 URL도 /public/logo.svg예요.', '파일 경로와 브라우저 URL은 public 접두사를 빼고 연결돼요.', '파일 시스템 경로와 사용자에게 노출되는 정적 URL을 각각 읽어요.'],
      ['예약 파일', 'app/courses/\n├── page.tsx       # /courses 페이지\n└── loading.tsx    # 하위 화면이 기다리는 동안의 UI', 'loading.tsx는 해당 경로의 로딩 UI 경계이며 /courses/loading이라는 주소를 만들지 않아요.', 'loading.tsx는 URL /courses/loading을 뜻해요.', '예약 파일이 URL 세그먼트가 아니라는 점을 확인해야 해요.', '주소를 만드는 예약 파일과 화면 상태를 표현하는 예약 파일을 구별해요.'],
      ['모듈 경계', 'app/courses/page.tsx\n  imports\nlib/course-data.ts  # URL을 만들지 않는 재사용 모듈', '라우트 화면 파일만 URL 규칙에 참여하고 lib의 일반 모듈은 필요한 화면에서 가져와요.', '모든 로직을 page.tsx 한 파일에 넣어야 Next.js가 읽어요.', '라우트 파일은 화면 경계로 두고 재사용 코드는 모듈로 나눠요.', '파일이 app의 라우트 예약 이름인지 일반 TypeScript 모듈인지 먼저 구분해요.'],
    ],
  },
  {
    title: '페이지와 루트 레이아웃', objective: 'page와 layout의 책임, 중첩 구조, 기본 HTML 문서를 익혀요.',
    days: [
      ['page 기본 내보내기', '// app/courses/page.tsx\nexport default function CoursesPage() {\n  return <main><h1>강의 목록</h1></main>;\n}', '예약 파일 page.tsx는 해당 경로의 화면 컴포넌트를 기본(default) 내보내기로 제공해요.', 'page.tsx에는 이름 있는 상수만 내보내면 화면이 자동 생성돼요.', '예약 파일이 요구하는 내보내기 형태를 확인해야 해요.', '경로 폴더뿐 아니라 page 파일의 export 형태까지 확인해 실제 페이지가 정의됐는지 판단해요.'],
      ['root layout', "import type { ReactNode } from 'react';\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang=\"ko\">\n      <body>{children}</body>\n    </html>\n  );\n}", '루트 layout은 필수 문서 요소인 html·body를 만들고 현재 하위 페이지를 children 위치에 넣어요.', '각 page가 자기 html과 body를 중복으로 만들어야 해요.', '루트 레이아웃에서 하위 경로가 들어갈 children을 렌더링해야 해요.', '루트 layout의 문서 뼈대와 page가 제공하는 본문을 역할별로 나눠 읽어요.'],
      ['중첩 layout', '// app/courses/layout.tsx\nexport default function CoursesLayout({ children }: { children: React.ReactNode }) {\n  return <section><nav>강의 메뉴</nav>{children}</section>;\n}', '공통 segment가 유지되는 client navigation에서는 공유 layout UI와 상태를 유지할 수 있어요. 새로고침·경로 구조 변경까지 무조건 상태가 보존된다는 뜻은 아니에요.', 'layout은 경로를 이동할 때마다 무조건 초기화돼요.', '유지되는 레이아웃 상태와 페이지별 상태의 경계를 봐야 해요.', '두 페이지가 같은 courses layout 아래에 있을 때 메뉴를 공유하고 각 page만 바꾸는 구조를 읽어요.'],
      ['route group', 'app/\n└── (learning)/\n    └── courses/\n        └── page.tsx   # /courses', '괄호 route group은 파일을 묶지만 괄호 안 이름은 URL segment에 포함하지 않아요.', '(learning)이 URL에 /learning으로 노출돼요.', '폴더 구성 이름과 실제 URL 경로를 따로 읽어야 해요.', '디렉터리 분류 이름과 사용자에게 보이는 주소를 파일 경로에서 분리해요.'],
      ['private folder', 'app/\n└── _components/\n    └── CourseCard.tsx  # 라우트 생성에서 제외\n\n# 밑줄은 URL 제외 규칙이며 접근 제어 수단이 아닙니다.', '밑줄 private folder는 라우트 파일을 정리할 때 URL 생성을 피하게 돕지만 보안 경계나 권한 검사를 제공하지 않아요.', '_components 폴더도 자동으로 공개 URL이 돼요.', '라우트용 파일과 내부 UI 구성 파일을 구분해야 해요.', 'URL 생성 규칙과 사용자 접근 권한은 서로 다른 문제로 다뤄요.'],
    ],
  },
  {
    title: '링크와 탐색', objective: '내부 이동, 브라우저 이동, 내비게이션 상태를 알맞게 선택해요.',
    days: [
      ['next/link', 'import Link from "next/link";\n\nexport function CourseNav() {\n  return <Link href="/courses">과정 목록</Link>;\n}', '앱 내부 이동은 HTML 링크의 의미를 유지하면서 Next.js Link의 client navigation과 prefetch 지원을 사용할 수 있어요.', '내부 이동도 모든 경우 window.location만 직접 바꿔야 해요.', '클라이언트 내비게이션과 전체 문서 이동 요구를 구별해요.', '내부 경로에는 일반 링크 의미와 framework navigation을 함께 제공하는 Link를 사용해요.', '화면 전환 요구가 없고 /courses 안에서 목록을 여는 링크를 읽고 내부 이동에 맞는 컴포넌트를 고르세요.'],
      ['동적 href', 'import Link from "next/link";\n\nconst allowedCourseSlugs = new Set(["react", "nextjs"]);\nconst slug = allowedCourseSlugs.has(input) ? input : null;\nconst href = slug ? `/courses/${encodeURIComponent(slug)}` : "/courses";\n\n<Link href={href}>과정 보기</Link>', '동적 segment 값은 먼저 허용된 ID인지 확인하고 URL 인코딩을 적용해요.', '사용자 입력 문자열을 경로에 검증 없이 붙여도 안전해요.', '외부·사용자 입력 경로가 의도한 목적지인지 확인해야 해요.', '인코딩은 URL 문법을 보호하고 allowlist 검증은 존재하거나 허용된 과정인지 확인해요.', '검색창 입력을 상세 href에 연결할 때 허용된 slug인지 확인하고, 실패하면 안전한 목록 경로를 써요.'],
      ['뒤로 가기', '"use client";\nimport Link from "next/link";\nimport { useRouter } from "next/navigation";\n\nexport function CourseNavigation() {\n  const router = useRouter();\n  return (\n    <>\n      <button type="button" onClick={() => router.back()}>이전 화면</button>\n      <Link href="/courses">강의 목록</Link>\n    </>\n  );\n}', 'router.back은 client navigation에서 브라우저 기록의 이전 항목으로 이동해요. 이전 기록이 없을 수 있으므로 고정 목적지 링크를 대안으로 함께 보여 줄 수 있어요.', '이전 기록이 항상 존재한다고 가정해도 돼요.', '직접 진입했을 때 사용할 대체 이동 경로를 설계해야 해요.', '상세 주소 직접 진입에는 뒤로 기록이 없을 수 있으므로 사용자가 선택할 수 있는 목록 경로도 제공해요.', '상세 페이지는 검색 결과에서 올 수도, 북마크에서 바로 열 수도 있어요. 뒤로 가기와 확실한 목록 이동을 함께 제공해요.'],
      ['현재 경로 표시', 'import Link from "next/link";\n\n// 현재 주소가 /courses일 때만 현재 항목임을 표시\n<Link href="/courses" aria-current="page">강의 목록</Link>', '현재 route 항목은 색상 외에도 aria-current="page"로 보조 기술에 알려요.', '색상만 바꾸면 모든 사용자가 현재 위치를 알아요.', '키보드·보조 기술에서 현재 항목을 알 수 있는지 확인해요.', '현재 위치의 시각 스타일과 기계가 읽을 수 있는 현재 페이지 의미를 함께 표시해요.', '메뉴 항목이 실제 현재 주소와 일치할 때만 현재 페이지 의미를 시각 표시와 함께 제공해요.'],
      ['외부 링크', '<a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">\n  Next.js 공식 문서 (새 탭)\n</a>', '외부 사이트 링크는 외부 목적지를 직접 가리키는 a 요소로 표현해요. 새 탭을 열면 rel 안전 속성을 명시하고 사용자가 새 탭임을 알게 해요.', '외부 URL도 항상 내부 Link로 감싸야 해요.', '내부 라우팅과 외부 문서 이동을 구분해야 해요.', '다른 사이트로 이동하는 일반 링크에 내부 route prefetch를 전제로 하지 않아요.', '다른 도메인의 문서를 새 탭으로 열면서 링크 종류와 새 탭 보안·안내를 확인해요.'],
    ],
  },
  {
    title: '동적 경로와 경로 매개변수', objective: '폴더 세그먼트로 생성되는 경로와 매개변수 검증을 익혀요.',
    days: [
      ['동적 세그먼트', 'app/courses/[courseId]/page.tsx\n\n/courses/javascript-basics\nparams → { courseId: "javascript-basics" }', '대괄호 폴더 하나가 해당 위치 URL의 한 segment를 캡처해 params로 전달해요.', '대괄호 이름이 화면 제목으로 자동 출력돼요.', '경로 문자열을 도메인 ID로 쓰기 전 형식과 존재 여부를 확인해요.', 'URL 값은 화면에 자동 출력되는 제목이 아니라 데이터 조회 전에 검증할 route 입력이에요.', '강의 slug 한 조각을 URL로 받아야 합니다. 파일 경로와 params 객체에서 이름·타입·값을 연결해 읽으세요.'],
      ['현재 params 계약', 'type Props = { params: Promise<{ courseId: string }> };\n\nexport default async function Page({ params }: Props) {\n  const { courseId } = await params;\n  return <h1>과정 {courseId}</h1>;\n}', 'Next.js App Router page의 params는 Promise예요. 서버 page를 async로 선언하고 await해서 값을 읽어요.', 'params는 언제나 동기 객체이므로 await가 필요 없어요.', '사용 중인 Next.js 버전과 params 타입을 공식 문서에서 확인해요.', '0.143이나 Next 14의 과거 동기 예제를 현재 Next.js 16.4 App Router 규칙과 섞지 않아요.', '현재 Next.js App Router 계약에 맞게 Promise params를 받은 서버 페이지에서 slug를 꺼내요.'],
      ['여러 세그먼트', 'app/blog/[year]/[slug]/page.tsx\n\n/blog/2026/app-router\nparams → { year: "2026", slug: "app-router" }', '동적 폴더마다 별도 route key가 생기고 값은 문자열 params로 내려와요.', '두 폴더 이름이 같은 값을 덮어쓰는 게 정상이에요.', '경로 매개변수 이름과 데이터 조회 키를 일치시켜요.', '경로 파일 순서에 맞춰 year와 slug를 서로 다른 키로 읽어요.', '연도와 글 slug가 각자 다른 segment가 되도록 경로를 정하고 문자열 입력 검증도 포함해요.'],
      ['catch-all segment', 'app/docs/[...parts]/page.tsx\n\n/docs/router/files\nparams → { parts: ["router", "files"] }', '[...parts]는 한 개 이상 이어진 하위 경로를 문자열 배열로 받아요.', 'catch-all은 경로가 없어도 항상 빈 배열로 일치해요.', '선택적 catch-all과 일반 catch-all의 최소 일치 경로를 구분해요.', '일반 catch-all은 `/docs`만으로는 일치하지 않고 한 segment 이상이 필요해요.', '문서가 최소 하위 경로 하나를 요구할 때 [..]와 [...parts] 규칙을 구분해요.'],
      ['경로 입력 검증', 'import { notFound } from "next/navigation";\n\nconst courseId = parseCourseId(rawCourseId);\nif (!courseId) notFound();\nconst course = await findCourse(courseId);\nif (!course) notFound();', '주소에서 온 문자열은 형식과 데이터 존재 여부를 각각 확인하고, 안전한 not-found 경계로 보낼 수 있어요.', 'URL에 들어온 값은 내부 데이터 키와 일치한다고 신뢰해요.', '잘못된 ID와 존재하지 않는 ID를 안전한 화면으로 연결해요.', '형식이 허용되는 ID라도 해당 데이터가 없을 수 있으므로 두 조건을 분리해 처리해요.', '형식에 맞는 slug도 데이터가 존재하지 않을 수 있습니다. 입력 형식 검사와 조회 결과 검사를 따로 둬요.'],
    ],
  },
  {
    title: '검색 매개변수와 URL 상태', objective: '검색어·필터를 URL과 연결하고 현재 버전의 비동기 API를 읽어요.',
    days: [
      ['searchParams 읽기', 'type Search = { q?: string | string[]; page?: string | string[] };\ntype Props = { searchParams: Promise<Search> };\n\nexport default async function Page({ searchParams }: Props) {\n  const search = await searchParams;\n  const q = typeof search.q === "string" ? search.q : "";\n  return <CourseResults query={q} />;\n}', 'page의 searchParams는 Promise이며 plain object 값을 담아요. 중복 키는 string[]일 수 있으므로 입력 모양을 확인해요.', '검색 매개변수는 React state처럼 항상 동기 객체예요.', '버전이 바뀐 API 서명은 릴리스별 공식 문서를 기준으로 확인해요.', 'URL에 같은 q가 여러 번 있으면 배열로 올 수 있어 단일 문자열로 쓸 수 있는지 검증해요.', '현재 page prop에서 비동기 query 객체를 읽고 중복 키 값의 타입을 고려해요.'],
      ['URLSearchParams', 'const params = new URLSearchParams();\nparams.set("q", searchText);\nparams.set("level", "beginner");\nconst href = `/courses?${params.toString()}`;', 'URLSearchParams는 공백·& 같은 값을 쿼리 문자열에 맞게 인코딩해요. set은 같은 키 값을 하나로 설정해요.', '공백·&가 포함된 값을 URL에 그대로 이어 붙여도 돼요.', '검색어와 특수 문자가 URL 구조를 바꾸지 않는지 확인해요.', '문자열을 직접 이어 붙이지 않고 set/toString으로 query 값을 안전하게 직렬화해요.', '검색어에 & 문자가 있어도 다음 query key로 오해되지 않도록 브라우저 표준 API로 주소를 만들어요.'],
      ['검색 상태 보존', 'import Link from "next/link";\n\n<Link href={{ pathname: "/courses", query: { q: searchText, level: "beginner" } }}>\n  검색 결과 열기\n</Link>', '공유·새로고침·뒤로 가기 후에도 유지할 검색 조건은 URL query로 표현할 수 있어요.', '모든 검색 조건을 컴포넌트 메모리에만 보관해야 해요.', '주소 복사와 뒤로 가기에서 검색 조건이 유지되는지 확인해요.', '링크 목적지를 URL에 포함하면 새로고침이나 주소 공유에도 검색 조건을 전달할 수 있어요.', '다른 사용자와 공유하고 뒤로 이동해도 같은 공개 필터를 복원할 수 있도록 링크 목적지에 조건을 담아요.'],
      ['페이지 이동 조건', 'const raw = search.page;\nconst value = typeof raw === "string" ? Number(raw) : Number.NaN;\nconst page = Number.isSafeInteger(value) && value >= 1 && value <= 100\n  ? value\n  : 1;', 'query 값은 문자열 입력이므로 안전한 정수인지와 허용 범위를 검사하고 기본값을 적용해요.', 'query의 page 값은 항상 양의 정수예요.', 'NaN, 음수, 큰 값을 포함해 잘못된 입력을 다뤄요.', '숫자로 바꾼 뒤에도 정수 여부와 제품 상한을 확인해야 페이지 offset이 예측 가능해요.', 'URL의 page 입력이 단일 문자열일 때만 숫자로 바꾸고, 안전한 1–100 정수가 아니면 기본 페이지로 처리해요.'],
      ['URL과 개인 정보', 'const params = new URLSearchParams({ q: publicSearchTerm });\nconst shareableUrl = `/courses?${params.toString()}`;\n// Never put passwords, session tokens, or private identifiers here.', '검색 공유가 필요한 공개 검색어만 URL에 넣고 자격 증명·민감한 개인정보는 다른 보호 경로로 다뤄요.', '비밀번호와 개인 식별 정보를 query string으로 보내도 돼요.', '브라우저 기록·서버 로그·공유 URL에 값이 남는 위험을 살펴요.', 'query string은 브라우저 기록·공유 링크·일부 로그에 노출될 수 있어 비밀값 전달 수단이 아니에요.', 'URL을 기록·복사·로그에서 볼 수 있는 사람의 범위를 생각해 비밀 값과 공개 검색 조건을 분리해요.'],
    ],
  },
  {
    title: 'Server Component 이해', objective: '기본 서버 컴포넌트의 역할과 서버 전용 코드 경계를 설명해요.',
    days: [
      ['기본 컴포넌트 경계', 'export default async function CoursePage() {\n  const course = await getPublicCourse("react");\n  return <main><h1>{course.title}</h1></main>;\n}', 'App Router의 page와 layout은 별도 client 선언이 없으면 Server Component예요.', '모든 page가 기본적으로 브라우저에서 실행돼요.', '화면이 처음 보이는 HTML과 상호작용 코드를 나눠 살펴요.', '정적 강의 소개 화면과 그 아래 상호작용 버튼이 각각 어느 경계인지 구분해요.'],
      ['서버에서 데이터 읽기', 'export default async function CoursePage() {\n  const courses = await getPublicCourses();\n  return <CourseList items={courses} />;\n}', 'Server Component는 데이터 원천 가까이에서 조회하고 그 결과로 UI를 만들 수 있어요.', 'Server Component에서 브라우저의 localStorage를 바로 읽을 수 있어요.', '서버에 없는 브라우저 API와 서버 데이터 접근을 구분해요.', 'page가 서버에서 공개 강의 목록을 가져와 HTML을 구성하는 흐름을 읽어요.'],
      ['서버 전용 비밀값', 'import "server-only";\n\nexport async function getCatalog() {\n  const response = await fetch(process.env.CATALOG_URL!, {\n    headers: { authorization: `Bearer ${process.env.CATALOG_TOKEN}` },\n  });\n  return response.json();\n}', '서버 전용 모듈은 비밀 환경값을 읽을 수 있고 server-only 경계로 Client Component에서 가져오는 실수를 빌드 오류로 막을 수 있어요.', 'NEXT_PUBLIC_을 붙이면 비밀 키가 브라우저에서 더 안전해져요.', '환경 변수 접두사와 모듈 실행 경계를 함께 살펴요.', '서버 전용 토큰이 브라우저 번들로 흘러가지 않도록 secret 사용 파일을 client import graph에서 차단해요.'],
      ['서버 컴포넌트 한계', 'export default async function Page() {\n  const course = await getCourse("react");\n  return <FavoriteButton courseId={course.id} />;\n}\n\n// FavoriteButton은 작은 Client Component', 'Server Component는 서버 데이터와 HTML을 준비하고 상태·onClick이 필요한 자식은 Client Component에 맡겨요.', '서버 page에 useState와 onClick을 직접 넣어요.', '훅·이벤트가 필요한 모듈을 식별해 경계를 좁혀요.', '과정 조회와 즐겨찾기 클릭 기능을 서버 화면과 작은 상호작용 경계로 나눠요.'],
      ['서버 화면 끼워 넣기', 'import Modal from "./modal"; // Client Component\nimport CourseSummary from "./course-summary"; // Server Component\n\nexport default function Page() {\n  return <Modal><CourseSummary /></Modal>;\n}', 'Server Component는 부모 서버 화면에서 렌더한 뒤 Client Component의 children 슬롯으로 전달할 수 있어요. Client 모듈이 서버 모듈을 import하는 것과는 다른 구성이에요.', 'Client Component가 직접 서버 전용 모듈을 import해 실행해요.', '모듈 import와 서버에서 만든 children 전달을 나눠 읽어요.', 'Modal이 상호작용 경계를 제공해도 CourseSummary 조회를 서버 쪽에서 유지하도록 부모 page가 두 컴포넌트를 조합해요.'],
    ],
  },
  {
    title: 'Client Component와 상호작용', objective: 'use client 경계, 브라우저 API, 상태를 좁은 컴포넌트에 배치해요.',
    days: [
      ['use client 지시문', '"use client";\n\nimport { useState } from "react";\n\nexport function StudyMenu() {\n  const [open, setOpen] = useState(false);\n  return <button onClick={() => setOpen((value) => !value)}>{open ? "닫기" : "열기"}</button>;\n}', 'use client는 import보다 앞에 두고 해당 파일에서 시작하는 client module graph를 선언해요.', '파일 중간이나 컴포넌트 함수 안에 지시문을 두면 같은 경계가 돼요.', '문자열 지시문의 위치와 import 순서를 점검해요.', '상태가 필요한 StudyMenu 한 파일의 맨 위에 client boundary를 선언해요.'],
      ['useState 사용', '"use client";\nimport { useState } from "react";\n\nexport function LessonToggle() {\n  const [expanded, setExpanded] = useState(false);\n  return <button aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>\n    {expanded ? "설명 접기" : "설명 보기"}\n  </button>;\n}', 'useState는 Client Component 렌더 사이에 사용자의 펼침 상태를 보존하고 이벤트에서 갱신해요.', 'Server Component 함수의 일반 지역 변수는 다시 렌더해도 자동 보존돼요.', '클릭 뒤 다시 렌더해도 남아야 하는 값인지 살펴요.', '설명 펼침 여부를 컴포넌트 호출의 일회성 지역 변수가 아니라 React state로 관리해요.'],
      ['이벤트 처리기', '"use client";\n\nexport function SaveDraftButton({ onSave }: { onSave: () => void }) {\n  return <button type="button" onClick={onSave}>초안 저장</button>;\n}', 'onClick 같은 브라우저 이벤트 처리기는 Client Component의 상호작용 코드예요.', '서버 렌더 데이터에 일반 이벤트 함수를 직렬화해 자동 클릭을 처리해요.', '이벤트 실행 위치가 브라우저의 사용자 동작인지 판단해요.', '클릭했을 때만 초안 저장 콜백을 호출하는 버튼은 client 경계에 둬요.'],
      ['Effect로 브라우저 문서 갱신', '"use client";\nimport { useEffect } from "react";\n\nexport function DocumentTitle({ title }: { title: string }) {\n  useEffect(() => { document.title = title; }, [title]);\n  return <h1>{title}</h1>;\n}', 'useEffect는 hydration 뒤 브라우저의 document 같은 외부 시스템과 동기화할 때 사용해요.', '서버 렌더 함수가 실행될 때 document.title을 바로 변경해요.', 'server prerender 동안 브라우저 전역이 존재하는지 살펴요.', '초기 제목 UI는 HTML로 만들고 document.title 업데이트는 브라우저 Effect에서 처리해요.'],
      ['client module graph', '"use client";\nimport { useState } from "react";\nimport RichEditor from "./rich-editor";\n\n// RichEditor도 client graph에 포함돼요.\nexport function AnswerPanel() {\n  const [draft, setDraft] = useState("");\n  return <RichEditor value={draft} onChange={setDraft} />;\n}', 'client로 표시한 모듈이 import하는 구성 요소는 브라우저 번들의 client module graph에 포함돼요.', '한 파일에 use client를 붙여도 그 파일이 import하는 JavaScript 양은 달라지지 않아요.', '지시문이 표시된 위치뿐 아니라 그 아래 import 의존성까지 살펴요.', '큰 편집기와 모든 페이지를 우연히 client graph에 포함하지 않도록 상호작용 경계를 필요한 화면에만 붙여요.'],
    ],
  },
  {
    title: '서버·클라이언트 사이 props', objective: '직렬화 가능한 값과 함수·비밀 데이터의 전달 제한을 이해해요.',
    days: [
      ['직렬화 가능한 props', 'import FavoriteButton from "./favorite-button";\n\nexport default async function Page() {\n  const course = await getCourse("react");\n  return <FavoriteButton course={{ id: course.id, title: course.title }} />;\n}', 'Server Component에서 Client Component로 건네는 props는 현재 React에서 지원하는 직렬화 형태여야 해요.', '직렬화 가능한 데이터라면 모든 함수·인스턴스도 그대로 전달돼요.', '경계의 값 타입과 컴포넌트가 실제 필요로 하는 필드를 확인해요.', '문자열·숫자와 공개 plain object처럼 지원이 명확한 데이터를 props로 건네고 임의 함수는 빼요.'],
      ['일반 함수와 Server Function', 'function onSave() { /* 서버 지역 함수 */ }\n<ClientButton onSave={onSave} />\n\n// 지원되는 Server Function은 별도 "use server" 계약을 사용', '일반 서버 함수는 client prop으로 직렬화되지 않지만 framework가 인식하는 Server Function은 별도 지원 계약으로 전달할 수 있어요.', '컴포넌트 안의 모든 서버 함수가 자동으로 원격 호출 API가 돼요.', '일반 JavaScript 함수와 명시적으로 선언한 Server Function을 구분해요.', '지원 계약 없는 onSave 함수 참조는 client prop으로 넘길 수 없고 "use server" 함수만 별도 Server Function 규칙을 따라요.'],
      ['공개 DTO로 최소화', 'const profile = {\n  displayName: row.displayName,\n  avatarUrl: row.avatarUrl,\n};\nreturn <ClientProfile profile={profile} />;\n// row.passwordHash 같은 내부 필드는 전달하지 않음', 'Server Component가 조회한 원본 전체 대신 Client Component가 표시할 공개 필드만 골라 전달해요.', '필요한 화면 필드가 하나면 DB row 전체를 편하게 props로 넘겨요.', '화면에 필요한 데이터와 서버 내부·민감 데이터를 나눠요.', '데이터 접근 계층에서 제한된 DTO를 만들면 불필요한 내부 필드가 RSC 경계로 넘어가지 않아요.'],
      ['명시적 날짜 DTO', 'const courseView = {\n  title: course.title,\n  startedAt: course.startedAt.toISOString(),\n};\nreturn <CourseCard course={courseView} />;', '표시·백업 계약을 간단히 유지하려면 날짜를 명시적인 ISO 문자열 DTO로 만들 수 있어요. 직렬화 지원 범위는 React 계약을 따라요.', '모든 특수 객체가 JSON 문자열로 자동 바뀌어 의미 손실이 없어요.', '컴포넌트 경계에서 앱이 의도한 날짜 표현 형식을 정했는지 봐요.', '문자열 DTO는 앱이 선택한 명시적 표현이에요. 이를 Date가 React에서 전달 불가하다는 뜻으로 일반화하지 않아요.'],
      ['첫 렌더와 hydration 일치', '"use client";\nimport { useEffect, useState } from "react";\n\nexport function Clock({ initialTime }: { initialTime: string }) {\n  const [time, setTime] = useState(initialTime);\n  useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []);\n  return <time>{time}</time>;\n}', '첫 브라우저 렌더가 서버가 만든 초기 HTML과 맞아야 hydration 불일치를 피할 수 있어요.', '서버와 브라우저가 서로 다른 현재 시간을 초기 렌더에서 바로 출력해요.', '서버 렌더 값과 브라우저 첫 렌더 값이 동일한지 확인해요.', '초기 출력은 서버에서 전달한 initialTime을 쓰고 지역 시각은 hydration 후 Effect에서 갱신해요.'],
    ],
  },
  {
    title: '서버 데이터 읽기와 캐시 경계', objective: '데이터 원천, 요청 흐름, 캐시와 최신성 결정을 문서 기준으로 판단해요.',
    days: [
      ['서버 fetch', 'export default async function CoursePage() {\n  const response = await fetch("https://api.example.com/courses");\n  const courses = await response.json();\n  return <CourseList courses={courses} />;\n}', 'Server Component는 async/await으로 데이터 요청을 기다린 뒤 결과로 UI를 만들 수 있어요. 실제 앱에서는 응답 상태와 데이터 모양도 검증해야 해요.', '데이터를 가져오려면 모든 조회를 useEffect와 브라우저 상태로 옮겨야 해요.', '요청이 실행되는 서버 경계와 결과를 JSX로 내보내는 순서를 읽어요.', 'page에서 필요한 공개 과정을 서버에서 조회하고 그 결과를 목록 UI에 전달해요.', '서버에서 받아온 목록이 UI props가 되는 흐름과 응답 검증의 필요를 설명해요.'],
      ['HTTP 응답 검사', 'async function getCourse(id: string) {\n  const response = await fetch(`/api/courses/${id}`);\n  if (!response.ok) throw new Error("Course request failed");\n  return response.json();\n}', 'fetch는 네트워크 오류에서는 reject하지만 404·500 같은 HTTP 응답만으로는 reject하지 않으므로 `response.ok`를 확인해 오류 경계에 전달해요.', 'JSON 본문을 읽을 수 있으면 404와 500도 성공 응답이에요.', 'HTTP 상태가 정상인지와 본문이 JSON인지 각각 확인해요.', '없는 과정 응답을 정상 자료처럼 표시하지 말고 응답 검사를 거쳐 정해진 오류 UI로 보내요.', 'HTTP 상태 검사와 본문 파싱은 별도 단계이며 오류 UI가 어떤 상태를 받을지 정해요.'],
      ['같은 GET 요청 재사용', 'async function CourseTitle() {\n  const response = await fetch(courseUrl);\n  return <h1>{(await response.json()).title}</h1>;\n}\n\nasync function CourseCard() {\n  const response = await fetch(courseUrl);\n  return <CourseSummary data={await response.json()} />;\n}', 'Next.js 16.4의 같은 렌더 과정에서 동일 URL·옵션의 GET fetch는 요청 메모이제이션으로 결과를 공유할 수 있어요. 이는 서로 다른 요청 간 영구 캐시와 다른 범위예요.', '같은 렌더에서 같은 GET을 두 번 쓰면 언제나 두 외부 요청이 발생하고 한 번 저장된 값은 영구 캐시예요.', '한 서버 렌더 안의 동일 fetch와 여러 요청에 걸친 persistent cache를 구분해요.', '같은 공개 과정 자료가 제목과 카드에서 필요하면 중복 조회와 장기 캐시를 서로 다른 문제로 판단해요.', 'memoization은 한 렌더 pass 안의 동일 GET 요청을 공유하고 다음 요청까지 저장하는 데이터 cache와는 달라요.'],
      ['독립 요청 병렬 처리', 'const coursesRequest = getCourses();\nconst noticesRequest = getNotices();\nconst [courses, notices] = await Promise.all([\n  coursesRequest,\n  noticesRequest,\n]);\nreturn <Dashboard courses={courses} notices={notices} />;', '서로의 결과를 기다리지 않는 요청은 먼저 모두 시작한 뒤 Promise.all로 기다릴 수 있어요. Promise.all은 하나라도 reject되면 전체 결과가 실패해요.', '독립 요청은 첫 번째 결과를 받을 때까지 시작하지 말고 순서대로 기다려요.', '데이터 의존 관계가 있는지와 부분 실패를 허용하는지 먼저 봐요.', '강의 목록과 공지처럼 서로 독립적인 자료는 병렬 요청하고, 둘 다 꼭 필요한 화면인지 함께 확인해요.', 'Promise.all은 각 요청을 먼저 시작해 대기 시간을 줄이지만 부분 결과가 필요하면 다른 실패 처리 계약이 필요해요.'],
      ['현재 버전의 명시적 캐시', '// next.config.ts에서 cacheComponents: true\nimport { cacheLife } from "next/cache";\n\nexport async function getPublicCourses() {\n  "use cache";\n  cacheLife("hours");\n  return fetch(COURSE_URL).then(readCourseResponse);\n}', 'Next.js 16 Cache Components에서는 `cacheComponents`를 켠 환경에서 `use cache`로 명시적으로 캐시하고 `cacheLife`로 수명을 정해요. 이전 모델의 `fetch` cache·`revalidate` 계약과 혼동하지 않아요.', '모든 Next.js 16 프로젝트에서 설정이나 지시문과 무관하게 fetch 결과가 같은 기간 동안 자동 영구 저장돼요.', '프로젝트의 Cache Components 설정과 적용 중인 공식 캐시 모델을 먼저 확인해요.', 'Cache Components를 켠 모델에서는 공개 과정 카탈로그만 명시적으로 캐시하고 개인별 데이터 경계를 따로 검토해요.', 'Cache Components 환경의 use cache/cacheLife와 이전 캐시 모델의 force-cache/revalidate는 설정 전제와 API를 버전 문서로 확인해요.', '현재 프로젝트가 Cache Components를 쓰는지 먼저 확인하고, 공개 카탈로그의 캐시 수명은 최신성과 데이터 공개 범위에 맞춰 정해요.'],
    ],
  },
  {
    title: '로딩과 점진적 화면 표시', objective: '라우트 로딩 상태와 비동기 화면 경험의 역할을 구분해요.',
    days: [
      ['라우트 loading 경계', 'export default function Loading() {\n  return (\n    <>\n      <p role="status">강의 목록을 불러오는 중입니다.</p>\n      <main aria-busy="true">\n        <CourseListSkeleton aria-hidden="true" />\n      </main>\n    </>\n  );\n}', '같은 route 폴더의 loading.tsx는 기본 Server Component이며 page와 그 아래를 Suspense 경계로 감싸 즉시 보여 줄 대기 UI를 제공해요. 요청 timeout을 설정하지는 않아요.', 'loading.tsx 파일이 데이터 요청의 timeout과 취소까지 자동 설정해요.', 'UI fallback과 네트워크 timeout·취소는 서로 다른 책임이에요.', '과정 목록 조회가 끝날 때까지 의미 있는 대기 안내를 보여 주되 서버 요청 제한 시간과 혼동하지 않아요.', 'loading.tsx는 navigation의 UI fallback 경계이고 서버 호출의 시간 제한을 구성하는 API가 아니에요.'],
      ['세밀한 Suspense 경계', 'import { Suspense } from "react";\n\nexport default function CoursePage() {\n  return (\n    <main>\n      <h1>강의</h1>\n      <Suspense fallback={<CourseSkeleton />}>\n        <CourseList />\n      </Suspense>\n    </main>\n  );\n}', 'React Suspense는 경계 안에서 suspend하는 작업의 fallback을 보여 줘요. 경계 밖 제목은 먼저 표시할 수 있고 오류 처리에는 error boundary가 따로 필요해요.', 'Suspense가 404·500·모든 예외를 자동 복구해요.', 'fallback이 감싼 비동기 하위 요소와 별도 오류 UI를 구분해요.', '강의 제목은 즉시 보여 주고 느린 목록만 별도 skeleton을 표시해요.', 'Suspense는 대기 중인 UI를 바꾸는 경계이며 예외를 복구하는 route error boundary를 대신하지 않아요.'],
      ['접근 가능한 skeleton', 'return (\n  <section aria-label="강의 목록">\n    <p role="status">강의 목록을 불러오는 중입니다.</p>\n    <div aria-hidden="true"><CourseCardSkeleton /></div>\n  </section>\n);', '시각용 skeleton은 aria-hidden으로 보조 기술에서 감출 수 있지만 대기 상태 자체를 짧은 status 문구로도 알려요.', '회색 placeholder만 화면에 있으면 보조 기술 사용자에게도 대기 상태가 전달돼요.', '장식용 골격과 사용자가 알아야 할 진행 상태가 각각 표현됐는지 점검해요.', '네트워크를 기다리는 동안 보이는 카드 모양은 꾸밈으로 두고 상태 문구는 화면 읽기 기능에도 전달해요.', 'aria-hidden skeleton은 장식만 숨기므로 별도 status 안내가 있어야 대기 이유를 전달할 수 있어요.'],
      ['느린 영역 따로 스트리밍', 'import { Suspense } from "react";\n\nasync function SlowSummary() {\n  const summary = await getSlowSummary();\n  return <p>{summary.text}</p>;\n}\n\nexport default function CoursePage() {\n  return (\n    <main>\n      <h1>강의</h1>\n      <CourseSearch />\n      <Suspense fallback={<p role="status">요약 준비 중</p>}>\n        <SlowSummary />\n      </Suspense>\n    </main>\n  );\n}', '지연이 큰 하위 영역을 좁은 boundary에 넣으면 준비된 나머지 화면이 그 요청을 기다리지 않아요. 이는 느린 원인을 고치거나 요청을 취소하는 기능은 아니에요.', '한 느린 데이터 요청이 있어도 같은 화면의 모든 독립 영역을 반드시 숨겨야 해요.', '무엇이 즉시 준비되고 어느 컴포넌트가 실제로 suspend하는지 살펴요.', '요약 카드가 늦더라도 강의 제목과 탐색은 먼저 사용할 수 있게 화면 경계를 나눠요.', '가까운 Suspense boundary가 점진적 표시 범위를 정하고 요청의 timeout·취소 정책은 별도로 설계해요.'],
      ['스트리밍과 서버 필요성', 'return (\n  <main>\n    <h1>과정</h1>\n    <Suspense fallback={<CourseListSkeleton />}>\n      <CourseList />\n    </Suspense>\n  </main>\n);\n\n// Server streaming sends the shell, fallback, then ready HTML.', 'Next.js는 지원되는 서버 렌더 경로에서 shell·fallback과 준비된 HTML을 점진적으로 보낼 수 있어요. 스트리밍은 HTTP 서버 응답 기능이며 정적 파일 자체에 요청별 서버가 생기지 않아요.', '정적 export 파일만 올리면 새 요청 때 서버가 늦은 내용을 계속 스트리밍해 줘요.', '코드의 Suspense 경계와 배포 호스트가 실제 stream response를 제공하는지 함께 확인해요.', '호스트가 정적 파일만 제공한다면 요청별 동적 스트리밍을 기능으로 약속하지 않아요.', 'Suspense는 React 렌더 경계를 제공하지만 server streaming은 그 경계를 HTTP로 보낼 실행 서버를 요구해요.'],
    ],
  },
  {
    title: '오류·빈 결과·not-found', objective: '실패 원인에 맞는 오류 화면과 재시도 경계를 선택해요.',
    days: [
      ['라우트 error boundary', '"use client";\n\ntype Props = { error: Error & { digest?: string }; retry: () => void };\n\nexport default function Error({ retry }: Props) {\n  return (\n    <section role="alert">\n      <p>과정을 불러오지 못했어요.</p>\n      <button onClick={() => retry()}>다시 시도</button>\n    </section>\n  );\n}', 'error.tsx는 Client Component error boundary예요. 같은 segment의 page와 하위 일부 오류를 보여 주지만 같은 segment의 layout·root 초기화·빌드 오류 모두를 잡는 전역 복구기는 아니에요.', 'error.tsx가 root layout 시작 실패와 모든 빌드 오류까지 같은 화면에서 복구해요.', '경계가 감싸는 하위 route subtree와 상위 layout·전역 오류 범위를 나눠요.', '강의 page의 runtime 렌더 실패에는 가까운 error boundary를 두고 root layout 실패 범위는 별도로 설계해요.', 'error.tsx는 정해진 route subtree를 감싸며 root layout/template과 빌드 시작 문제를 자동 복구하지 않아요.'],
      ['retry로 일시 오류 복구', 'export default function Error({ retry }: { retry: () => void }) {\n  return <button onClick={() => retry()}>다시 시도</button>;\n}', 'Next.js 16.3부터 안정 API인 `retry()`가 error.tsx에 제공돼 자식의 데이터를 다시 요청하고 렌더해요. DB 상태를 고치거나 모든 실패가 해결된다는 보장은 없어요.', '버튼을 누르는 순간 retry가 원본 DB 레코드를 수정해 오류 원인을 제거해요.', 'UI 재요청과 데이터 복구 작업의 책임을 구별해요.', '일시적인 네트워크 장애에는 retry를 제공할 수 있지만 영구적인 잘못된 데이터라면 원인 자체를 고쳐야 해요.', 'retry는 자식 subtree를 다시 fetch하고 렌더할 기회예요. 재실행한다고 외부 시스템의 오류 원인을 자동 수정하지 않아요.'],
      ['없는 리소스 notFound', 'import { notFound } from "next/navigation";\n\nconst course = await getCourse(courseId);\nif (!course) notFound();\nreturn <CoursePage course={course} />;', '없는 리소스는 notFound()로 not-found UI에 연결하고 검색 제외 `noindex`를 표시해요. 응답 스트리밍 전이면 404지만 이미 streaming이 시작된 응답 상태를 뒤에서 바꿀 수는 없어요.', '권한 거부·요청 실패까지 모두 빈 성공 객체로 바꿔요.', '리소스 없음과 인증·인가 실패, 서버 예외 및 streaming 시작 시점을 분리해요.', '없는 강의는 not-found UI로 연결하고 권한 실패나 서버 오류는 각각 자신의 계약으로 처리해요.', 'notFound는 없는 경로를 처리하고 noindex를 더하지만 상태 코드는 streaming 전후에 달라질 수 있어요.'],
      ['정상 빈 목록과 오류 구분', 'if (!response.ok) throw new Error("Course request failed");\nconst courses = await response.json();\nif (courses.length === 0) return <EmptyCourses />;\nreturn <CourseList courses={courses} />;', '성공 응답 안의 빈 배열은 정상적인 empty state이고 실패한 HTTP 응답·네트워크 오류와는 다른 상태예요.', '목록이 비어 있으면 서버 오류라고 가정하고 오류 페이지로 보내요.', 'HTTP 실패 검사, 성공한 빈 자료, 실제 항목 존재를 순서대로 판단해요.', '아직 등록한 강의가 없을 때 시작 안내를 제공하되 요청 실패를 빈 성공 상태처럼 숨기지 않아요.', '빈 상태는 성공 자료가 없다는 뜻이고 fetch 실패는 데이터를 확인하지 못했다는 뜻이에요.'],
      ['오류 메시지와 digest', 'type Props = { error: Error & { digest?: string } };\n\nexport default function Error({ error }: Props) {\n  return (\n    <section role="alert">\n      <p>요청을 처리하지 못했어요.</p>\n      {error.digest && <small>문의 코드: {error.digest}</small>}\n    </section>\n  );\n}', '서버 오류 상세는 민감한 내부 내용이므로 사용자에게 일반 안내를 보여 줘요. digest는 제한된 서버 로그의 같은 오류를 찾는 식별자로 사용할 수 있어요.', 'token과 내부 stack trace를 그대로 화면에 출력해야 사용자가 오류를 이해해요.', '사용자 안내 문구와 운영용 로그 상관관계 ID가 각각 누구에게 보여야 하는지 살펴요.', '요청 실패를 알리고 필요할 때 digest 코드로 운영 기록을 찾되 예외 본문·자격 증명은 공개하지 않아요.', 'Next는 production에서 Server Component 오류 메시지를 일반화하고 digest로 서버 로그와 연결할 수 있어요.'],
    ],
  },
  {
    title: 'metadata와 검색 노출', objective: '고정 페이지와 경로별 메타데이터를 분리하고 대표 URL·공유 정보를 실제 페이지 내용에 맞춰요.',
    days: [
      ['고정 페이지 metadata', 'import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: { default: "코드한걸음", template: "%s | 코드한걸음" },\n  description: "프로그래밍 학습 과정과 연습 문제를 살펴보세요.",\n};', '항상 같은 공개 설명은 Server Component page나 layout에서 정적 metadata 객체로 선언해요. title template은 자식 segment에 적용되고 default도 필요해요.', '고정 설명도 매 요청마다 generateMetadata로 다시 조회하고 metadata export를 Client Component에 옮겨요.', '내용이 요청에 따라 바뀌는지와 page/layout의 server metadata 위치를 구별해요.', '정적 과정 카탈로그의 공통 제목·설명은 정적 객체로 선언하고 하위 화면 제목 규칙을 template로 정해요.', '고정된 공개 metadata는 Server Component 경로에서 정적으로 선언하고 title template의 기본 제목을 함께 제공해요.'],
      ['동적 경로 generateMetadata', 'type Props = { params: Promise<{ slug: string }> };\n\nexport async function generateMetadata({ params }: Props) {\n  const { slug } = await params;\n  const response = await fetch(`https://api.example.org/courses/${slug}`);\n  if (!response.ok) return { title: "과정을 찾을 수 없습니다" };\n  const course = await response.json();\n  return { title: `${course.title} 과정`, description: course.summary };\n}', '경로·외부 자료에 따라 달라지는 정보는 `generateMetadata`에서 반환해요. Next.js 16 page의 params는 Promise이고 동적 metadata도 서버 렌더의 일부예요.', '브라우저 화면이 뜬 뒤에만 document.title을 바꾸면 첫 서버 HTML metadata가 자동으로 똑같이 갱신돼요.', '사용자가 받는 HTML의 초기 head와 Client Component effect 시점을 나눠 살펴요.', 'slug로 과정이 바뀌면 그 slug에 대응하는 제목과 설명을 같은 서버 경로에서 만들어요.', '동적 제목·설명은 generateMetadata에서 Promise params와 실제 경로 자료를 읽어 반환해요.'],
      ['metadataBase와 canonical', 'import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  metadataBase: new URL("https://learn.example.org"),\n  alternates: { canonical: "/courses/react" },\n};', '상대 canonical URL을 완전한 주소로 만들려면 root metadataBase가 필요해요. Canonical은 내용이 대표되는 경로를 가리키므로 각 페이지의 실제 대표 URL을 정해요.', 'metadataBase 없이 모든 상대 URL은 자동으로 현재 방문 도메인을 안전하게 보완하고 canonical은 언제나 홈이에요.', '절대 URL이 필요한 metadata 필드의 origin과 query가 다른 중복 페이지 정책을 확인해요.', 'utm query만 다른 같은 과정 화면은 검증된 과정 상세 경로를 canonical로 사용하고 다른 과정은 자기 경로를 가리켜요.', 'metadataBase로 origin을 제공하고 페이지별 alternates.canonical은 그 페이지의 대표 경로로 설정해요.'],
      ['Open Graph 공유 카드', 'export const metadata: Metadata = {\n  title: "React 과정 · 코드한걸음",\n  description: "컴포넌트와 상태 흐름을 연습하는 과정입니다.",\n  openGraph: {\n    title: "React 과정 · 코드한걸음",\n    description: "컴포넌트와 상태 흐름을 연습하는 과정입니다.",\n    images: [{ url: "/courses/react/opengraph-image.png", alt: "React 과정" }],\n  },\n};', 'Open Graph는 외부 서비스가 미리보기로 읽는 페이지 공개 정보를 표현해요. 텍스트·공유 이미지는 실제 페이지 주제와 일치해야 하고 URL에는 metadataBase가 적용돼요.', '공개 카드 설명에 로그인 token이나 학습자의 개인 오답 수를 넣어도 URL만 알면 비공개예요.', '외부 공유 시 전달되는 title·description·image가 누구에게나 보여도 되는 내용인지 확인해요.', '공개 과정 소개만 카드에 사용하고 계정별 진도나 비공개 요약은 metadata에 전달하지 않아요.', 'Open Graph에는 공개 과정 정보만 사용하고 공유 카드 내용과 표시 페이지의 제목·주제를 맞춰요.'],
      ['서버 metadata와 페이지 데이터', 'async function getCourse(slug: string) {\n  const response = await fetch(`https://api.example.org/courses/${slug}`);\n  if (!response.ok) return null;\n  return response.json() as Promise<Course | null>;\n}\n\nexport async function generateMetadata({ params }: Props) {\n  const { slug } = await params;\n  const course = await getCourse(slug);\n  return { title: course?.title ?? "과정을 찾을 수 없습니다" };\n}\n\nexport default async function Page({ params }: Props) {\n  const { slug } = await params;\n  const course = await getCourse(slug);\n  return course ? <CoursePage course={course} /> : <NotFoundView />;\n}', 'metadata와 본문에서 같은 URL·옵션의 fetch를 사용하면 Next.js가 해당 fetch를 memoize할 수 있어요. 이 동작을 임의 DB 함수나 모든 사용자 간 지속 캐시로 확대하지 않아요.', 'metadata export를 Client Component에서 호출해 브라우저 전용 값으로 바꾸거나 본문과 제목에 서로 다른 과정 slug를 사용해요.', '한 요청에서 metadata·본문에 쓰는 같은 자료와 사용자 간 장기 cache 저장을 분리해요.', '요청 실패·없는 과정·정상 과정을 일관된 metadata와 본문 상태로 표현하고 민감한 값은 공개 카드에 보내지 않아요.', '동일 render의 같은 fetch만 문서가 보장하는 memoization 범위로 다루고 page와 metadata의 slug·fallback 일관성을 확인해요.'],
    ],
  },
  {
    title: 'Route Handler의 개념과 경계', objective: 'Route Handler의 URL·HTTP method·Request/Response 계약과 정적 export의 실행 한계를 구분해요.',
    days: [
      ['Route Handler URL과 page 구분', '// app/courses/page.tsx → 화면 URL /courses\n// app/api/courses/route.ts → HTTP URL /api/courses\n// page.tsx는 화면, route.ts는 Request/Response를 처리해요.', 'route.ts는 Web Request·Response API를 사용하는 서버 HTTP 경계예요. 같은 route segment에서 page.tsx와 route.ts가 같은 URL 응답을 동시에 소유하지 않도록 배치해요.', 'route.ts는 React 화면 파일이어서 요청마다 브라우저 클릭 handler로 실행돼요.', '브라우저 화면 URL과 API 요청 URL, 파일 위치에 따른 충돌을 각각 살펴요.', '과정 HTML 화면 `/courses`와 자료 API `/api/courses`를 분리해 소비자와 응답 종류를 명확히 해요.', 'Route Handler는 server request handler이므로 UI route와 별도 endpoint로 구성해요.'],
      ['HTTP method별 서버 함수', 'import type { NextRequest } from "next/server";\n\nexport async function GET(request: NextRequest) {\n  return Response.json({ courses: [] });\n}\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  return Response.json({ accepted: Boolean(body) }, { status: 202 });\n}', 'route.ts에서 GET·POST 같은 이름의 export는 각 HTTP method 요청을 처리해요. 이 함수들은 React component의 이벤트 함수가 아니며 Next 서버에 도착해야 실행돼요.', '브라우저 버튼에서 export된 GET 함수가 자동으로 직접 호출되며 HTTP 요청은 필요하지 않아요.', '호출자가 보내는 Request와 handler가 반환하는 Response 사이의 경계를 확인해요.', '목록 조회 GET과 새 자료 제출 POST를 각각 서버 endpoint로 두고 화면에서 fetch를 호출하는 흐름을 그려요.', 'HTTP method export는 request-time Route Handler를 등록하며 버튼 event와는 별도 서버 기능이에요.'],
      ['Response 본문과 상태 코드', 'export async function GET() {\n  const courses = await getPublishedCourses();\n  return Response.json(\n    { data: courses },\n    { status: 200, headers: { "Cache-Control": "public, max-age=60" } },\n  );\n}\n\nexport async function POST() {\n  return Response.json({ error: { code: "invalid_input" } }, { status: 400 });\n}', 'JSON body·HTTP status·response header는 클라이언트가 읽는 API 계약이에요. 본문에 error 필드를 넣더라도 HTTP status를 별도로 실패로 지정해야 해요.', '오류 코드가 JSON에 있으면 어떤 요청이든 HTTP 200을 사용해도 client fetch가 실패를 알아채요.', '성공·거절 결과의 상태와 본문을 함께 테스트할 기준으로 나눠요.', '잘못된 요청에는 400과 안정된 오류 body를 함께 반환해 클라이언트가 성공 데이터처럼 다루지 않도록 해요.', 'Response body의 모양과 status는 별개이므로 API 계약에서 둘 다 명시해요.'],
      ['Request JSON은 신뢰하지 않기', 'export async function POST(request: Request) {\n  let raw: unknown;\n  try {\n    raw = await request.json();\n  } catch {\n    return Response.json({ error: { code: "invalid_json" } }, { status: 400 });\n  }\n  const parsed = CreateCourseSchema.safeParse(raw);\n  if (!parsed.success) {\n    return Response.json({ error: { code: "invalid_input" } }, { status: 400 });\n  }\n  return Response.json(await createCourse(parsed.data), { status: 201 });\n}', 'request.json()은 본문을 JavaScript 값으로 파싱할 뿐 도메인 필드·타입·길이를 검증하지 않아요. 잘못된 JSON 파싱 실패와 정상 JSON 안의 잘못된 입력을 구분해요.', 'JSON 파싱만 성공하면 입력이 신뢰되어 저장소에 바로 전달돼요.', '외부 request body의 문법 오류와 schema 검증 오류가 서로 다른 실패 근거임을 확인해요.', '잘못된 JSON은 invalid_json, 스키마를 통과하지 않은 데이터는 invalid_input으로 응답해요.', '파싱 뒤에도 입력 schema와 도메인 조건을 검증한 데이터만 변경 작업에 전달해요.'],
      ['정적 export와 동적 handler', 'export const dynamic = "force-static";\n\nexport async function GET() {\n  return Response.json({ catalog: ["react", "nextjs"] });\n}\n\n// 정적 export는 빌드 때 응답 파일을 만들어요.\n// POST나 요청 cookie/header에 반응하는 handler는 실행 서버가 필요해요.', 'Next.js 정적 export에서는 `dynamic = "force-static"`로 표시한 GET Route Handler의 응답을 빌드 산출물로 만들 수 있어요. 요청마다 바뀌는 입력과 다른 HTTP method는 정적 파일만으로 처리하지 못해요.', 'static export 뒤에는 POST나 사용자별 Request 값을 받을 Node 서버가 그대로 포함돼요.', '빌드 시 고정 가능한 GET 결과와 요청 당시 동작할 HTTP server 기능을 구분해요.', '정적 catalog JSON은 build-time 파일로 제공할 수 있지만 계정별 변경 요청은 server runtime이 필요해요.', '이 앱은 Next.js 서버를 실행하지 않으므로 handler 예제를 설명 코드로만 제공하고 정적 GET 파일 생성과 request-time 처리를 구분해요.'],
    ],
  },
  {
    title: 'HTTP 계약과 API 설계', objective: '상태 코드·검증·페이지 범위·재시도·오류 본문을 일관된 HTTP API 계약으로 설계해요.',
    days: [
      ['상태 코드와 생성 응답', 'return Response.json(\n  { data: { id: course.id, title: course.title } },\n  { status: 201, headers: { Location: `/api/courses/${course.id}` } },\n);\n\n// 삭제 성공 + 돌려줄 본문이 없음: 204', '새 자원을 만들면 201과 생성 자원의 Location을 반환할 수 있어요. 204는 성공했지만 응답 본문이 없다는 뜻이에요. 입력 오류·미존재는 별도 4xx로 표현해요.', '생성·검증 실패·없는 자원·본문 없는 삭제 응답을 모두 status 200 한 가지로 나타내요.', '각 HTTP status의 표준 의미와 응답 body 존재 여부를 확인해요.', 'POST 생성은 201과 자원 위치를, DELETE 성공인데 body가 없으면 204를 선택해 client 계약을 맞춰요.', 'API 결과 종류에 맞는 status와 body·Location을 선택하고 204에 JSON 응답을 붙이지 않아요.'],
      ['서버 schema 검증과 필드 허용', 'type CreateCourseInput = { title: string; summary?: string };\n\nconst body: unknown = await request.json();\nconst input = CreateCourseSchema.safeParse(body);\nif (!input.success) {\n  return Response.json({ error: { code: "invalid_input" } }, { status: 400 });\n}\nawait saveCourse({ title: input.data.title, summary: input.data.summary });', '요청은 브라우저가 보내므로 TypeScript type annotation만으로 runtime 값을 검증하지 않아요. 서버 schema에서 필수·선택·범위·허용 필드를 확인하고 검증된 값만 저장해요.', '화면에서 title을 required로 표시했으면 직접 API 요청도 항상 올바른 title을 보내요.', 'compile-time 타입 선언과 network body runtime 검증을 분리해요.', '필수 제목 누락과 예상하지 않은 공개 필드를 서버에서 거부하거나 정책에 맞춰 제한해요.', 'TypeScript 타입만 믿지 말고 unknown request body를 server schema 검증 뒤 사용해요.'],
      ['제한된 cursor 페이지네이션', 'const rawLimit = Number(searchParams.get("limit") ?? 20);\nconst limit = Number.isInteger(rawLimit)\n  ? Math.min(Math.max(rawLimit, 1), 100)\n  : 20;\nconst cursor = parseAndValidateCursor(searchParams.get("cursor"));\nconst page = await listCourses({ limit, cursor, orderBy: "createdAt,id" });', 'limit과 cursor는 사용자 입력이므로 integer·범위·형식을 검사해요. Cursor 방식에는 일관된 정렬 키와 다음 cursor 계약이 필요하고 요청 크기를 무제한 DB 쿼리로 전달하지 않아요.', 'limit 값을 상한 없이 넘기고 정렬 기준 없이 페이지를 나누면 모든 화면에서 중복·누락 없는 결과가 보장돼요.', '페이지 경계 입력과 동시 변경 시 정렬·cursor 안정성을 함께 검토해요.', 'limit=50000 요청은 상한 100으로 제한하고 cursor 형식이 틀리면 안정된 400 오류를 돌려요.', '페이지 크기와 cursor는 서버에서 검증하고 안정적인 정렬 키로 다음 페이지를 구성해요.'],
      ['변경 요청 재시도와 멱등성', 'export async function POST(request: Request) {\n  const key = request.headers.get("Idempotency-Key");\n  if (!key || key.length > 128) {\n    return Response.json({ error: { code: "invalid_key" } }, { status: 400 });\n  }\n  return runOrReturnStoredResult({ key, operation: "create-course" });\n}', '네트워크 재시도는 같은 변경을 중복 수행할 수 있어요. POST는 HTTP 자체가 일반적으로 멱등하다고 보장하지 않으므로 이 예는 key·사용자·작업 범위·저장 결과 중복 방지를 앱 계약으로 명시해요.', '클라이언트가 POST를 다시 보내도 서버나 네트워크가 같은 결과를 자동 deduplicate해요.', '재시도 때 key가 그대로인지, 서버가 완료 결과를 안전하게 재사용하는지 확인해요.', '같은 생성 요청을 다시 보냈을 때 course를 두 번 만들지 않도록 key와 결과를 저장하고 무관한 사용자 요청끼리 key를 공유하지 않아요.', 'Idempotency-Key라는 이름만 붙여서는 중복 방지가 되지 않으며 server-side key·범위·결과 보존 로직이 필요해요.'],
      ['공개 오류와 운영 식별자', 'return Response.json(\n  { error: { code: "course_unavailable", message: "과정을 불러오지 못했습니다.", requestId } },\n  { status: 503 },\n);\n\n// 서버 로그에만 상세 예외와 제한된 requestId를 기록', '오류 response는 안정된 기계 판독 code, 사용자가 취할 행동, 필요한 경우 상관용 requestId만 공개해요. 내부 stack·SQL·token은 보호된 서버 로그에 남겨요.', '예외 stack trace와 Authorization header를 응답 body에 복사해야 사용자가 지원을 요청할 수 있어요.', '사용자용 메시지와 내부 운영 진단 정보를 분리하고 status와 오류 code가 모순되지 않는지 확인해요.', '서비스 일시 장애는 503과 짧은 안내를 주고 requestId로 제한된 서버 로그를 찾되 비밀값을 응답에 싣지 않아요.', '오류 envelope를 일정하게 유지하면서 HTTP 실패 status를 사용하고 내부 예외·credential은 공개하지 않아요.'],
    ],
  },
  {
    title: '폼과 Server Actions 개념', objective: '기본 HTML 폼 제출, Server Function 실행 경계, 요청 데이터 검증과 pending 상태를 연결해요.',
    days: [
      ['form action과 서버 경계', 'import { createCourse } from "./actions";\n\nexport function CreateCourseForm() {\n  return (\n    <form action={createCourse}>\n      <label htmlFor="title">과정 이름</label>\n      <input id="title" name="title" required />\n      <button type="submit">과정 만들기</button>\n    </form>\n  );\n}', '폼 action에 연결한 Server Function은 서버에서 실행돼요. 기본 form 계약은 JavaScript가 준비되기 전 제출을 지원할 수 있지만, 이 정적 학습 사이트에는 해당 서버가 없어요.', 'action 속성에 함수를 넣으면 정적 파일 호스트가 그 함수를 서버에서 실행해요.', 'React 폼 문법과 실제 Server Function을 받아 줄 Next.js 서버 배포를 별도로 확인해요.', '현재 학습 화면에서는 코드만 읽고, 실제 변경 저장은 Server Action을 배포한 서버에서만 일어난다고 구분해요.', 'form action이 브라우저 이벤트 handler가 아닌 서버 변경 경계에 연결되는 방식을 읽어요.'],
      ['FormData의 누락·반복 값', 'function readCourseFields(formData: FormData) {\n  const rawTitle = formData.get("title");\n  const rawTags = formData.getAll("tag");\n  if (typeof rawTitle !== "string") return { error: "과정 이름을 입력해 주세요." };\n  const tags = rawTags.filter((value): value is string => typeof value === "string");\n  return { title: rawTitle.trim(), tags };\n}', 'get() 결과는 없거나 파일일 수 있고 반복 필드는 getAll()로 다뤄요. Object.fromEntries(formData)는 Server Action 보조 필드도 포함할 수 있어요.', '모든 필드가 하나의 문자열로 반드시 존재하고 중복 입력도 자동으로 합쳐져요.', 'null·File·반복 값마다 허용 형태를 정하고 서버 입력 schema에 넘겨요.', '누락되거나 파일인 title을 문자열 메서드로 바로 처리하면 잘못된 입력에서 실패해요.', 'title 단일값과 tag 반복값을 각각 확인해 FormData가 보내는 실제 형태를 검증해요.'],
      ['변경 action의 인증·검증', '"use server";\n\nexport async function renameCourse(formData: FormData) {\n  const user = await requireUser();\n  const id = formData.get("courseId");\n  const title = formData.get("title");\n  if (typeof id !== "string" || typeof title !== "string") return { error: "입력을 확인해 주세요." };\n  const course = await findCourse(id);\n  if (!course || course.ownerId !== user.id) throw new Error("Forbidden");\n  const parsed = CourseTitle.safeParse(title);\n  if (!parsed.success) return { error: "과정 이름을 확인해 주세요." };\n  await saveCourseTitle(id, parsed.data);\n}', '폼의 숨김 필드도 클라이언트 입력이에요. action 안에서 로그인 상태와 대상 자원 권한을 확인하고, 사용자 값은 서버에서 검증해요.', '페이지를 못 보는 사용자는 action도 호출할 수 없으므로 action 자체 권한 검사는 생략해요.', '페이지 접근 제어와 직접 POST가 가능한 각 Server Action 검사는 독립적으로 해요.', '과정 ID를 바꾸어 보낸 요청도 자원 소유자 확인을 통과하지 않으면 저장되지 않게 해요.', 'hidden courseId를 신뢰하지 말고 매 action에서 인증·자원 권한·입력 유효성을 검사해요.'],
      ['useActionState 결과와 pending', '"use client";\nimport { useActionState } from "react";\nimport { createCourse } from "./actions";\n\ntype FormState = { message: string };\nconst initialState: FormState = { message: "" };\n\nexport function CourseForm() {\n  const [state, formAction, pending] = useActionState(createCourse, initialState);\n  return <form action={formAction}><p aria-live="polite">{state.message}</p><button disabled={pending}>저장</button></form>;\n}', 'useActionState는 [state, action, isPending]을 돌려줘요. 연결한 Server Function은 formData 전에 이전 state를 첫 인자로 받아요.', 'action 함수가 이전 상태와 폼 자료의 순서를 무시해도 자동으로 같은 계약이 돼요.', '클라이언트 Hook 반환값과 서버 action 함수 signature를 같이 확인해요.', '검증 오류 메시지를 상태로 돌려보내고 제출 중 버튼을 잠그면 사용자는 실패·대기 상태를 구분할 수 있어요.', '서버 action은 `(previousState, formData)` 순서로 받고 폼은 반환 상태와 pending을 각각 표시해요.'],
      ['폼 내부 useFormStatus', '"use client";\nimport { useFormStatus } from "react-dom";\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n  return <button type="submit" disabled={pending}>{pending ? "저장 중" : "저장"}</button>;\n}\n\nexport function CourseForm({ action }: { action: (data: FormData) => void }) {\n  return <form action={action}><input name="title" /><SubmitButton /></form>;\n}', 'useFormStatus를 읽는 버튼 컴포넌트는 상태를 추적할 부모 form의 자손이어야 해요. 폼 자신이 호출해 자기 제출 상태를 읽는 Hook으로 쓰지 않아요.', 'SubmitButton이 form 바깥에 있어도 가장 가까운 form의 pending을 자동으로 찾아요.', '컴포넌트 트리에서 status Hook과 연결된 form의 부모·자식 위치를 살펴요.', '재사용 제출 버튼을 form 안쪽 자식으로 배치하고 form 밖 버튼의 상태는 별도로 전달해요.', 'useFormStatus는 가장 가까운 부모 form 제출을 읽으므로 제출 버튼을 실제 form 내부 자손으로 렌더해요.'],
    ],
  },
  {
    title: '검증·재검증·변경 후 화면', objective: '사용자가 고칠 수 있는 필드 오류와 낙관적 상태, 경로·태그 캐시 갱신을 선택해요.',
    days: [
      ['검증 오류를 필드에 연결', 'const titleErrorId = state.fieldErrors.title ? "title-error" : undefined;\n\nreturn (\n  <>\n    <label htmlFor="title">과정 이름</label>\n    <input id="title" name="title" aria-invalid={Boolean(titleErrorId)} aria-describedby={titleErrorId} />\n    {titleErrorId && <p id={titleErrorId}>{state.fieldErrors.title}</p>}\n    <p role="status">{state.message}</p>\n  </>\n);', '각 입력 오류는 해당 입력에 연결하고 성공·일반 알림과 구분해요. 서버 action에서 반환한 오류도 어떤 필드를 수정해야 하는지 알려야 해요.', '오류 문구만 화면 어딘가에 표시하면 어떤 입력의 오류인지 자동으로 알 수 있어요.', 'label·aria-invalid·aria-describedby와 폼 전체 상태 안내의 관계를 확인해요.', '필드 오류가 시각·보조 기술 모두에서 해당 입력과 연결되도록 해요.', 'title 입력의 오류 id를 aria-describedby에 연결하고 유효성 실패를 일반 성공 메시지로 표시하지 않아요.'],
      ['낙관적 UI와 기준 상태', '"use client";\nimport { useOptimistic, useState } from "react";\n\ntype Course = { id: string; title: string; pending?: boolean };\ntype Props = { courses: Course[]; action: (data: FormData) => Promise<{ error?: string }> };\n\nexport function CourseList({ courses, action }: Props) {\n  const [shown, addOptimistic] = useOptimistic(courses, (current, title: string) => [...current, { id: `pending-${current.length}`, title, pending: true }]);\n  const [message, setMessage] = useState("");\n  async function submit(formData: FormData) {\n    const value = formData.get("title");\n    if (typeof value !== "string" || !value.trim()) { setMessage("과정 이름을 입력해 주세요."); return; }\n    setMessage("");\n    addOptimistic(value.trim());\n    try {\n      const result = await action(formData);\n      if (result.error) setMessage(result.error);\n    } catch {\n      setMessage("저장하지 못했어요. 다시 시도해 주세요.");\n    }\n  }\n  return <form action={submit}><label>과정 이름 <input name="title" /></label><p role="status">{message}</p>{shown.map((course) => <p key={course.id}>{course.title}</p>)}<button type="submit">추가</button></form>;\n}', 'useOptimistic이 보여주는 값은 action이 처리되는 동안의 임시 표시예요. action이 끝나면 실제 props 상태가 기준이 돼요. 예제는 빈 제목을 막고, 저장 거절·실패를 화면에 알려 임시 표시가 성공으로 오해되지 않게 해요.', '임시 항목을 서버 저장 전부터 영구 정답 상태로 간주해 실패 여부를 무시해요.', '보이는 임시 상태와 저장 후 서버가 확정한 원본 목록을 분리해요.', '요청이 거부되면 기준 상태로 돌아가고, 사용자가 오류를 확인해 다시 제출할 수 있게 해요.', 'optimistic 항목은 action 진행 중인 임시값이에요. 실패 메시지를 표시하고 저장 확정 뒤에는 실제 props 목록을 기준으로 보여 줘요.'],
      ['즉시 갱신 updateTag', '"use server";\nimport { updateTag } from "next/cache";\n\nexport async function renameCourse(id: string, title: string) {\n  await saveCourseTitle(id, title);\n  updateTag("courses");\n}', '현재 Next.js에서 updateTag는 Server Action 안에서만 쓸 수 있고 해당 태그 캐시를 즉시 만료시켜 다음 읽기가 새 데이터를 기다리게 해요.', 'updateTag는 Route Handler나 Client Component 어디서나 stale-while-revalidate를 실행해요.', '호출 위치와 사용자가 방금 쓴 값을 다음 화면에서 바로 읽어야 하는지 확인해요.', '수정 직후 새 과정명을 반드시 보여야 한다면 변경 저장 후 Server Action에서 갱신할 태그를 무효화해요.', 'read-your-own-writes가 필요하면 Server Action의 updateTag를 쓰고 태그가 캐시 데이터에 먼저 붙어 있는지 확인해요.'],
      ['경로와 태그 범위 선택', '"use server";\nimport { revalidatePath, revalidateTag } from "next/cache";\n\nexport async function refreshCourseViews() {\n  // 특정 화면을 다시 만들기\n  revalidatePath("/courses/react");\n\n  // 태그를 사용하는 여러 페이지의 데이터\n  revalidateTag("courses", "max");\n}', '이 함수는 Server Action 예시예요. revalidatePath는 특정 경로·layout을, revalidateTag는 해당 태그를 사용한 여러 페이지의 데이터를 대상으로 해요. `max`는 오래된 자료를 먼저 보여 주고 뒤에서 갱신하는 방식이라 즉시 최신 읽기와 달라요.', '경로 무효화는 모든 페이지의 데이터 태그를 대신하고 revalidateTag(tag) 단일 인자는 최신 권장 호출이에요.', '업데이트 영향이 한 경로인지 여러 tagged query인지와 즉시 최신성 요구를 구분해요.', '목록·상세 화면 중 실제 변경된 경계만 다시 검증해 불필요한 전체 캐시 재계산을 피해요.', 'Server Action이나 Route Handler에서 호출해요. path는 화면 경로, tag는 연결된 데이터 범위이며 revalidateTag의 갱신 방식도 요구에 맞춰 선택해요.'],
      ['변경 후 최신 화면 통합', '"use server";\nimport { updateTag } from "next/cache";\nimport { redirect } from "next/navigation";\n\nexport async function createCourse(formData: FormData) {\n  const course = await saveValidatedCourse(formData);\n  updateTag("courses");\n  redirect(`/courses/${course.slug}`);\n}', '무효화는 실제 데이터 변경이 성공한 뒤 실행해요. updateTag와 redirect를 사용할 때 action의 저장 순서와 읽기 최신성 요구를 명시해요.', '저장 전에 캐시를 무효화하고 redirect만 성공 상태의 근거로 삼아요.', '변경 결과가 확정되는 위치와 화면 이동이 캐시 재사용에 미치는 영향을 함께 설명해요.', '실패한 저장에 성공 목록이 노출되지 않고 성공한 변경은 태그 갱신 후 상세 화면으로 이동하도록 흐름을 읽어요.', '유효성 검사와 저장이 성공한 뒤 tag를 갱신하고 대상 화면으로 이동해 변경 전 데이터를 성공처럼 보여 주지 않아요.'],
    ],
  },
  {
    title: '쿠키·헤더·인증 경계', objective: '요청 쿠키·헤더를 신뢰 경계로 다루고 사용자별 권한·비밀값·캐시 노출을 구분해요.',
    days: [
      ['비동기 cookies와 요청 범위', 'import { Suspense } from "react";\nimport { cookies } from "next/headers";\n\nexport default function ThemePage() {\n  return <Suspense fallback={<p>설정을 불러오는 중이에요.</p>}><ThemeSettings /></Suspense>;\n}\n\nasync function ThemeSettings() {\n  const cookieStore = await cookies();\n  const storedTheme = cookieStore.get("theme")?.value;\n  const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "system";\n  return <main data-theme={theme}><h1>학습 설정</h1></main>;\n}', 'Next.js 16의 cookies()는 비동기 요청 API예요. Cache Components를 켠 프로젝트에서는 쿠키를 읽는 하위 화면을 Suspense로 감싸야 나머지 화면을 먼저 표시할 수 있어요. 설정을 끄면 요청값을 쓰는 경로의 동적 렌더 조건을 확인해요.', 'cookies()는 항상 동기 정적 빌드 값이므로 빌드 결과에 한 번 저장돼 모든 사용자에게 같아요.', '비동기 호출뿐 아니라 현재 Cache Components 설정에서 요청값을 읽는 곳에 Suspense 경계가 필요한지도 확인해요.', '사용자별 theme 값은 요청마다 달라요. 허용 목록(light·dark) 밖의 쿠키는 system 기본값으로 처리하고 로딩 중에는 안내를 보여 줘요.', 'await cookies()로 요청 쿠키를 읽어요. Cache Components를 쓸 때는 요청 시점 화면을 Suspense로 감싸고, 허용한 테마만 사용해요.'],
      ['읽기 전용 headers와 신뢰', 'import { Suspense } from "react";\nimport { headers } from "next/headers";\n\nexport default function Page() {\n  return <Suspense fallback={<p>요청 정보를 확인하고 있어요.</p>}><RequestInfo /></Suspense>;\n}\n\nasync function RequestInfo() {\n  const requestHeaders = await headers();\n  const language = requestHeaders.get("accept-language");\n  const forwardedFor = requestHeaders.get("x-forwarded-for");\n  return <p>요청 언어: {language ?? "미지정"}</p>;\n}', 'headers()는 비동기 요청 API이고 반환된 Headers는 읽기 전용이에요. Cache Components를 켰다면 요청 정보를 읽는 하위 화면에 Suspense 경계를 둬요. 전달 헤더는 브라우저나 proxy가 보낼 수 있으므로 신뢰 proxy가 검증하지 않은 값을 인증 사실로 쓰지 않아요.', 'X-Forwarded-For 헤더가 있으면 발신 IP와 인증 사용자 ID가 항상 검증돼요.', '헤더 API의 읽기 전용 동작, Suspense 경계, proxy 설정에서 보장되는 값을 각각 확인해요.', '요청이 보낸 임의 forwarded 값은 권한 판정이나 계정 식별 근거로 직접 신뢰하지 않아요. Cache Components에서는 로딩 안내를 보여 주고 요청 헤더를 읽어요.', 'await headers()는 읽기에 쓰고 요청 정보를 읽는 화면은 Cache Components에서 Suspense로 감싸요. forwarded 헤더는 신뢰 proxy 경계가 확인된 때만 제한된 용도로 써요.'],
      ['인증 다음 자원별 인가', '"use server";\n\nexport async function renameCourse(id: string, title: string) {\n  const user = await requireUser();\n  const course = await findCourse(id);\n  if (!course || course.ownerId !== user.id) throw new Error("Forbidden");\n  await updateCourse(course.id, title);\n}', '인증은 호출자가 누구인지, 인가는 해당 자원에 무엇을 할 수 있는지 확인해요. 페이지에서 확인해도 외부 호출 가능한 각 Server Action 안에서 권한을 다시 검사해요.', '페이지 렌더에서 로그인을 확인했으므로 다른 과정 ID를 넣은 action도 허용돼요.', '서버에서 실제 자원을 불러와 로그인 사용자와 소유자·역할을 비교해요.', 'ID를 바꾸어 타인의 과정을 수정하는 IDOR를 action의 소유권 검사에서 막아요.', '로그인 확인 뒤 수정 대상 과정의 소유권이나 권한을 action 내부에서 따로 검사해요.'],
      ['클라이언트 공개 환경값', 'const publicLabel = process.env.NEXT_PUBLIC_SITE_LABEL;\nconst privateKey = process.env.PRIVATE_API_KEY;\n\n// 클라이언트 모듈에서 PRIVATE_API_KEY를 읽지 않음\n// 비밀이 필요한 호출은 서버 전용 함수에서 처리', 'NEXT_PUBLIC_ 접두 환경값은 브라우저 번들 공개를 전제로 해요. 비밀 API key는 server-only 경로에서만 사용하고 사용자로 보내는 props·오류·로그에서 제외해요.', '변수 이름만 PRIVATE이면 클라이언트 import나 props에 전달해도 값이 감춰져요.', '클라이언트 번들 및 Server/Client 경계를 따라 비밀값이 이동하는지 확인해요.', '컴파일 시 공개 대상으로 처리된 환경값은 브라우저 소스에서 읽힐 수 있으므로 secret에 접두사를 붙이지 않아요.', 'NEXT_PUBLIC은 공개값으로 취급하고 private key는 server-only 코드에서만 읽어요.'],
      ['사용자별 응답과 캐시 분리', 'async function getDashboard(userId: string) {\n  const user = await requireUser();\n  if (user.id !== userId) throw new Error("Forbidden");\n  return readPrivateDashboard(user.id);\n}\n\n// 이 결과를 사용자 공용 cache로 재사용하지 않음', '개인별 dashboard는 현재 인증 주체를 확인한 뒤 반환하고 공용 캐시에 다른 사용자 결과가 섞이지 않게 해야 해요. cache key나 비캐시 선택은 사용하는 모델에서 검증해요.', '경로가 /dashboard로 같으니 로그인한 사용자마다 동일한 공유 캐시를 안전하게 써요.', '요청 간 캐시 재사용 범위와 인증 주체를 포함하는 데이터 접근 정책을 검토해요.', '계정 A의 진도나 설정이 계정 B에게 노출되지 않도록 개인 응답을 일반 공개 콘텐츠와 다른 범위로 처리해요.', '공개 목록과 개인 dashboard 캐시를 구분하고 사용자 식별·인가 경계 없이 개인 결과를 공유하지 않아요.'],
    ],
  },
  {
    title: '캐시와 재검증 전략', objective: '최신성·재사용·사용자별 데이터에 맞춰 캐시 범위를 읽어요.',
    days: [
      ['공개 데이터와 요청 데이터 경계', String.raw`// next.config.ts: cacheComponents: true
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { cookies } from "next/headers";

async function PublicCourseCatalog() {
  "use cache";
  cacheLife("hours");
  return <CourseList courses={await readPublicCourses()} />;
}

async function LearnerProgress() {
  const session = await readSession(await cookies());
  return <ProgressSummary userId={session.userId} />;
}

export default function CoursesPage() {
  return <><PublicCourseCatalog />
    <Suspense fallback={<p>진도 불러오는 중</p>}><LearnerProgress /></Suspense>
  </>;
}`, 'Next.js 16의 Cache Components를 사용할 때 공개 catalog는 명시적으로 cache하고, 쿠키에 의존하는 개인 진도는 요청 경계에서 읽어요. 프로젝트 설정과 적용 모델을 먼저 확인해요.', '폴더 이름에 대괄호가 있거나 cookies()를 쓰면 어떤 배포 방식에서도 모든 출력이 자동으로 정적이에요.', '정적·동적이라는 이름만 보지 말고 어떤 값이 빌드 입력인지 현재 요청 입력인지, Cache Components가 설정됐는지 확인해요.', '공개 목록과 사용자별 진도는 재사용 범위가 달라요. Cache Components가 켜진 경우 요청별 UI는 Suspense 경계가 필요할 수 있어요.', 'Cache Components 모델, 공개 데이터의 캐시 여부, 요청 API를 읽는 위치를 함께 확인해 화면 생성 시점을 판단해요.'],
      ['캐시 수명과 이전 모델 구분', String.raw`// Cache Components를 켠 Next.js 16 프로젝트
async function getPublicCourses() {
  "use cache";
  cacheLife("hours");
  return fetch("https://catalog.example.org/courses").then((r) => r.json());
}

// Cache Components를 사용하지 않는 기존 모델의 명시적 시간 재검증
const response = await fetch("https://catalog.example.org/notices", {
  next: { revalidate: 300 },
});`, 'Cache Components의 `use cache`·`cacheLife`와 이전 캐시 모델의 `fetch` 옵션은 서로 다른 설정 문맥이에요. 이전 모델은 fetch 결과가 기본 영구 캐시라고 가정하지 말고 의도를 명시해요.', '프로젝트에 Cache Components가 없는지도 확인하지 않고 모든 fetch가 기본으로 영구 저장된다고 설명해요.', '프로젝트 설정을 먼저 확인한 뒤 각 모델에서 공개 자료의 재사용·재검증 정책을 따로 읽어요.', '이 예는 최신 Cache Components 경로와 이전 모델의 300초 revalidate 예시를 분리해 보여 줘요. 설정 모델을 섞으면 학습자가 실제 프로젝트 동작을 잘못 예측해요.', '캐시 API는 Next.js 버전뿐 아니라 `cacheComponents` 설정과 사용하는 모델을 확인하고 설명해요.'],
      ['태그와 변경 뒤 신선도', String.raw`import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function getCourseList() {
  "use cache";
  cacheLife("hours");
  cacheTag("courses");
  return readCourseList();
}

export async function renameCourseAction(formData: FormData) {
  "use server";
  await saveCourseTitle(formData);
  updateTag("courses");
}`, 'cacheTag로 데이터와 무효화 이름을 연결해요. Server Action에서 방금 변경한 값을 즉시 다시 읽어야 하면 updateTag를 검토하고, stale 응답을 허용하는 경로와 혼동하지 않아요.', 'updateTag를 실행하면 등록되지 않은 tag도 전역 검색되어 모든 경로가 항상 갱신돼요.', 'tag 연결 위치, 호출할 수 있는 서버 경계, 변경 뒤 허용되는 오래된 값 여부를 확인해요.', 'updateTag는 연결된 tag의 데이터를 Server Action에서 즉시 만료해 read-your-own-writes를 지원해요. tag 연결과 저장 성공 순서가 필요해요.', '데이터에 tag를 붙인 뒤 변경이 성공했을 때 요구되는 freshness에 따라 updateTag 또는 revalidateTag 정책을 선택해요.'],
      ['요청값은 cache 경계 밖에서 읽기', String.raw`// next.config.ts: cacheComponents: true
import { Suspense } from "react";
import { cookies } from "next/headers";

export default function MyCoursesPage() {
  return <Suspense fallback={<p>학습 기록을 불러오는 중이에요.</p>}><MyCoursesContent /></Suspense>;
}

async function MyCoursesContent() {
  const cookieStore = await cookies();
  const session = await requireSession(cookieStore);
  const courses = await readCoursesForUser(session.userId);
  return <main><h1>내 학습 기록</h1>
    <CourseProgressList courses={courses} />
  </main>;
}

// 요청 cookies()/headers()는 "use cache" 함수 안에서 직접 읽지 않아요.`, '요청에서 얻은 쿠키·헤더 값은 cache scope 바깥에서 읽어요. Cache Components를 켰다면 요청값을 읽는 화면을 Suspense로 감싸고, 개인 기록은 인가를 거친 사용자 경계로 다뤄 공용 cache에 섞지 않아요.', '공유 URL이 같으므로 사용자마다 다른 진도 목록도 같은 공개 캐시 항목으로 안전하게 재사용돼요.', '캐시 적중 여부보다 반환 자료의 소유자와 호출 요청의 인증 주체가 같은지 먼저 확인해요.', '요청 쿠키는 사용자별 입력이에요. 공개 목록처럼 공유할 데이터와 한 학습자의 기록을 구분해야 교차 계정 노출을 막을 수 있어요.', 'cookies()·headers()는 cached scope 바깥에서 읽어요. Cache Components에서는 요청값을 읽는 화면에 Suspense를 두고 사용자별 자료를 공개 cache와 분리해요.'],
      ['캐시 결정표 작성', String.raw`type CacheDecision = {
  dataOwner: "public" | "learner";
  maxStaleness: "minutes" | "hours" | "none";
  invalidation: "time" | "tag" | "path" | "none";
};

const catalogPolicy: CacheDecision = {
  dataOwner: "public",
  maxStaleness: "hours",
  invalidation: "tag",
};
// 내 오답 기록은 owner, freshness, invalidation을 별도로 결정`, '캐시를 켤지 말지만 적지 말고 데이터 소유자, 허용 가능한 오래된 시간, 갱신 트리거를 함께 정해요. 사용자의 학습 기록은 공개 catalog와 같은 cache 정책을 자동 상속하지 않아요.', 'cache 설정 하나를 추가하면 최신성·권한·무효화가 자동으로 모두 보장돼요.', '공개 과정 이름과 방금 수정된 개인 진도 각각에 대해 세 결정을 기록해요.', '캐시 정책은 성능 옵션이면서 데이터 공유 경계예요. 개인 기록은 공개 자료와 다른 소유 범위로 검토해야 해요.', '데이터 소유자·최대 stale 허용·시간/태그/경로 무효화 방식을 개별 자료 유형마다 기록해요.'],
    ],
  },
  {
    title: '웹 보안과 입력 신뢰', objective: '출력 인코딩, 링크, 환경값, 요청 보호를 설계해요.',
    days: [
      ['텍스트 출력과 raw HTML', String.raw`type CommentProps = { text: string };

export function Comment({ text }: CommentProps) {
  // React가 일반 text child를 문맥에 맞게 escape해 표시해요.
  return <p>{text}</p>;
}

// 실제로 검증된 rich HTML이 필요한 별도 요구가 없다면
// dangerouslySetInnerHTML로 사용자 입력을 출력하지 않아요.`, '일반 텍스트 child와 HTML 파싱 sink를 구분해요. React의 기본 text 렌더링은 적절하지만 raw HTML 삽입은 sanitizer 없이 사용자 입력에 쓰면 안 돼요.', '모든 JSX 출력은 어떤 문맥에서든 자동으로 안전하므로 HTML 문자열도 그대로 주입해요.', '질문에 들어온 값을 일반 텍스트로 렌더하는지, HTML parser가 처리하는 sink에 넘기는지 따라가요.', '일반 문장에 `<script>` 비슷한 입력이 있어도 text child로 렌더하면 markup으로 해석하지 않아요. raw HTML은 별도 공격 표면이에요.', '사용자 문장에는 일반 text child를 쓰고, rich HTML이 꼭 필요하면 검증된 sanitizer·허용 요소 정책을 적용해요.'],
      ['리다이렉트 목적지 검증', String.raw`const SITE_ORIGIN = "https://learn.example.org";
const allowedOrigins = new Set([SITE_ORIGIN, "https://docs.example.org"]);

export function safeDestination(candidate: string) {
  try {
    const url = new URL(candidate, SITE_ORIGIN);
    if (url.protocol !== "https:" || url.username || url.password || !allowedOrigins.has(url.origin)) return "/courses";
    return url.href;
  } catch {
    return "/courses";
  }
}
// redirect에 도착 URL을 쓰기 전 scheme과 정확한 origin을 검사해요.`, '사용자가 준 URL을 parse한 뒤 허용한 scheme과 정확한 origin 집합을 비교하고 실패하면 내부 고정 경로로 돌아가요. 문자열 prefix만 비교하지 않아요.', '주소가 `learn.example.org.attacker.invalid`로 시작하면 같은 사이트로 취급해요.', 'canonical URL에서 scheme·host·port를 포함하는 origin을 비교하고 잘못된 입력 예를 함께 시험해요.', '악성 주소는 정상 호스트 문자열을 포함할 수 있어요. 정확히 파싱한 origin을 allowlist와 비교하면 접미사 혼동을 막을 수 있어요.', 'URL parser로 정규화한 뒤 https와 등록된 정확한 origin을 허용하고 그 외에는 안전한 내부 목적지를 사용해요.'],
      ['Server Action 요청 보호', String.raw`"use server";

export async function renameCourse(formData: FormData) {
  const user = await requireUser();
  const rawCourseId = formData.get("courseId");
  const rawTitle = formData.get("title");
  if (typeof rawCourseId !== "string" || typeof rawTitle !== "string") return { ok: false };
  const courseId = rawCourseId.trim();
  const title = rawTitle.trim();
  if (!courseId || !isValidCourseTitle(title)) return { ok: false };
  const course = await readCourse(courseId);
  if (!course || course.ownerId !== user.id) return { ok: false };
  await saveCourseTitle(course.id, title);
  return { ok: true };
}
// framework의 Origin 보호 설정도 배포 proxy 경계와 함께 검토`, 'Server Action은 직접 요청될 수 있으므로 매 action 안에서 인증·자원별 인가·입력 검증을 해요. Next 기본 Origin/Host 검사와 extra allowed origins 설정은 프록시 구성과 대조해야 해요.', 'SameSite 쿠키 하나면 모든 CSRF와 action 권한 문제가 해결돼요.', '브라우저 요청 출처 방어, 사용자 인증, course 소유권 검사를 서로 다른 방어선으로 점검해요.', '쿠키의 same-site 속성은 도움이 될 수 있지만 잘못된 action 권한이나 프레임워크/proxy origin 설정을 대신하지 않아요.', 'Server Action 안에서 매 호출마다 로그인·자원 권한을 확인하고, 프레임워크 origin 정책과 허용 proxy origin을 배포 설정에 맞춰요.'],
      ['CSP의 역할과 제약', String.raw`// 예시는 앱 의존성을 검토할 시작점이지 완성 정책이 아니에요.
const contentSecurityPolicy = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

// nonce 기반 Next.js CSP는 요청별 nonce와 동적 렌더링 조건을 가집니다.
// 정적 export라면 배포 결과와 필요한 script/style를 별도로 검증해요.`, 'CSP는 허용 리소스 출처를 제한하는 방어층이에요. nonce 기반 Next.js 구성은 요청별 nonce를 만들기 위해 동적 렌더링을 요구해 정적 prerender·ISR과 함께 쓸 수 없어요.', 'default-src 한 줄을 복사하면 모든 script·style·image 동작과 CSP 우회가 검증돼요.', '현재 빌드 방식, script/style 출처, nonce 사용 여부를 확인하고 배포 환경에서 실제 위반 보고를 점검해요.', '정책이 필요한 Next 리소스를 차단하거나 너무 넓게 허용할 수 있어요. 헤더 한 줄만으로 보안 완성을 주장할 수 없어요.', 'CSP를 기본 보안의 대체물이 아닌 한 방어층으로 취급하고 nonce와 정적 배포의 양립 조건을 확인해요.'],
      ['운영 로그와 민감 입력', String.raw`// password, cookie, Authorization header, 원문 body는 기록하지 않음
function safeLogField(value: unknown) {
  if (typeof value !== "string") return "미지정";
  return value.replace(/[\r\n]/g, " ").slice(0, 120);
}

function writeCourseRenameLog(courseId: string, outcome: "accepted" | "rejected", source: unknown) {
  logger.info({
    event: "course.rename",
    courseId,
    outcome,
    source: safeLogField(source), // 꼭 필요한 비민감 보조값만 기록
  });
}`, '로그에는 작업 종류·데이터 ID·처리 결과처럼 필요한 값만 남겨요. 추가 출처 문구가 꼭 필요하면 줄바꿈을 정리하고 길이를 제한하며 인증 정보와 원문 body는 빼요.', '내부 로그는 일반 사용자에게 안 보이므로 token과 전체 request body를 적어도 돼요.', '로그 필드가 수집·보관되는 곳, 사용자 제어 가능성, 인증 비밀 포함 여부를 확인해요.', '민감 로그는 계정 탈취로 이어질 수 있고 줄바꿈은 로그 레코드 위조·혼선을 만들 수 있어요.', '작업 ID·결과 같은 필요한 값만 기록하고 secret을 제외해요. 추가 문자열이 필요하면 길이와 개행을 제한해요.'],
    ],
  },
  {
    title: '에셋·이미지·폰트', objective: '정적 자산 경로와 최적화 컴포넌트의 조건을 이해해요.',
    days: [
      ['의미 이미지와 장식 이미지', String.raw`import Image from "next/image";

export function CourseBanner() {
  return <section>
    <Image src="/course-map.png" alt="초급부터 실전까지의 학습 경로" width={960} height={540} />
    <Image src="/corner-decoration.svg" alt="" width={32} height={32} />
  </section>;
}`, '정보를 전달하는 그림은 그 정보를 설명하는 alt를, 주변 장식만 하는 그림은 빈 alt를 써요. 실제 표시 종횡비에 맞는 width/height를 제공해 layout shift를 줄여요.', '이미지가 최적화되므로 alt를 비우거나 `course-map.png`처럼 파일명만 써도 의미가 전달돼요.', '그림을 보지 못해도 필요한 정보를 얻을 수 있는지 판단하고, 장식인지 콘텐츠인지 구분해요.', '초급에서 실전으로 이어지는 그림은 학습 경로 정보를 담아요. 구석 장식 SVG에는 중복 낭독을 만들 설명이 필요하지 않아요.', '정보 이미지 alt는 목적·정보를 설명하고, 장식 이미지는 `alt=""`로 처리하며 원본 비율 크기를 지정해요.'],
      ['원격 이미지 출처 좁히기', String.raw`// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "media.example.org",
      port: "",
      pathname: "/courses/**",
      search: "",
    }],
  },
};
export default nextConfig;`, '원격 최적화 이미지가 필요한 경우 protocol·hostname·port·pathname·query 정책을 최소 범위로 정해요. 허용 출처는 콘텐츠 공급원을 통제한다는 뜻이 아니므로 외부 자료도 확인해요.', 'remotePatterns에 `**` wildcard를 모든 위치에 두면 임의의 호스트와 경로가 필요한 과정 이미지에만 허용돼요.', '실제 이미지 URL 몇 개를 대조해 필요한 호스트와 경로만 허용되는지, HTTPS·query가 예상대로 제한되는지 확인해요.', '광범위 허용은 최적화 엔드포인트가 요청할 외부 이미지 범위를 넓혀요. 특정 과정 미디어 경로만 허용해야 해요.', 'remotePatterns를 정확한 HTTPS 호스트·필요한 path로 제한하고 과한 wildcard와 불필요한 query를 허용하지 않아요.'],
      ['자체 호스팅 폰트와 권리', String.raw`import localFont from "next/font/local";

const learningSans = localFont({
  src: "../fonts/learning-sans.woff2",
  variable: "--font-learning",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className={learningSans.variable}>
    <body>{children}</body>
  </html>;
}`, 'next/font/local은 호출 파일 기준 경로의 폰트를 빌드 산출물에 포함해 외부 font 요청을 줄여요. 파일을 포함하기 전에 라이선스·배포 권한과 fallback을 확인해요.', '로컬로 복사하면 폰트의 라이선스 검토와 대체 글꼴 지정은 필요 없어져요.', 'src 경로가 실제 import 파일 기준인지 확인하고 폰트 사용·수정·재배포 권한을 따로 검토해요.', '자체 호스팅은 외부 요청을 줄이지만 타인 폰트를 사용할 법적 권리를 자동 제공하지 않아요.', '파일 경로·사용 라이선스·fallback·표시 전략을 확인한 폰트만 localFont에 연결해요.'],
      ['반응형 후보 선택', String.raw`import Image from "next/image";

export function CourseCover() {
  return <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
    <Image
      src="/course-cover.jpg"
      alt="JavaScript 과정 표지"
      fill
      sizes="(max-width: 720px) 100vw, 720px"
      style={{ objectFit: "cover" }}
    />
  </div>;
}
// fill 부모는 position: relative와 안정된 크기를 가져야 해요.`, 'fill 이미지를 쓰는 부모는 positioning context와 크기를 가져야 해요. sizes는 실제 CSS 표시 폭을 알려 브라우저가 srcset 후보를 고르도록 도와요.', 'sizes를 생략해도 브라우저는 카드 폭을 자동으로 알아서 가장 작은 파일만 받아요.', '데스크톱·모바일에서 카드가 차지하는 실제 폭과 srcset 선택 기준을 대조해요.', '잘못된 크기 정보는 작은 모바일 화면에서도 과한 이미지 다운로드를 만들거나 필요한 선명도를 낮출 수 있어요.', 'fill 부모의 레이아웃을 정하고 실제 viewport별 폭에 맞는 sizes를 제공해요.'],
      ['public 파일과 공개 범위', String.raw`const publicFiles = [
  "/icons/course.svg",       // 공개 아이콘
  "/images/course-map.png", // 공개 과정 그림
  // "/backups/user-progress.json"은 public에 두지 않음
];

// public 파일은 URL로 직접 받을 수 있는 정적 자산이에요.
// 비밀 token, 개인 기록, 배포 전 자료를 넣지 않아요.`, 'public 폴더 파일은 브라우저 URL로 공개돼요. 이름을 어렵게 짓거나 페이지에서 링크를 숨기는 것은 접근 제어가 아니에요.', '긴 난수 파일명은 로그인 없는 public 정적 파일을 개인 비밀 데이터로 바꿔요.', '빌드/호스트에서 URL을 아는 익명 사용자가 해당 파일을 직접 받을 수 있는지 살펴요.', '학습 기록 JSON이나 비밀 설정을 public에 저장하면 URL을 통한 직접 공개가 돼요.', '공개 가능한 그림·아이콘만 public에 두고 개인 백업·비밀·보호해야 할 파일은 다른 경계에 둬요.'],
    ],
  },
  {
    title: '접근성과 문서 구조', objective: '의미 있는 HTML, 키보드 흐름, 상태 안내를 설계해요.',
    days: [
      ['페이지 landmark와 제목 계층', String.raw`export default function CoursesPage() {
  return <main id="main-content">
    <h1>과정 목록</h1>
    <section aria-labelledby="recommended-title">
      <h2 id="recommended-title">추천 과정</h2>
      <p>최근 추가된 학습 경로</p>
    </section>
  </main>;
}`, '본문 landmark와 실제 제목 요소는 시각적인 크기와 별개로 문서 구조를 알려요.', 'main을 CSS로 꾸미거나 굵은 div 제목만 쓰면 보조 기술도 같은 의미로 알아서 변환해요.', '공통 layout에 이미 main이 있는지와 본문에 main·h1이 중복되지 않는지 확인해요.', '랜드마크와 제목을 의미 없는 div로 바꾸면 화면 읽기 사용자가 본문과 섹션으로 이동하기 어려워져요.'],
      ['명시적 label과 오류 연결', String.raw`export function CourseSearchField() {
  return <div>
    <label htmlFor="course-query">과정 검색</label>
    <input id="course-query" aria-invalid="true" aria-describedby="query-help query-error" />
    <p id="query-help">과정 이름의 일부를 입력해요.</p>
    <p id="query-error">검색어는 2자 이상이어야 해요.</p>
  </div>;
}`, 'htmlFor와 id는 입력 이름을 연결하고 aria-describedby는 도움말·오류 설명을 연결해요.', 'placeholder는 입력값을 쓰면 사라지므로 영구 레이블을 대신해요.', '입력과 연결된 label, 도움말, 실제 오류 상태가 있는지 함께 확인해요.', '레이블이 빠지거나 오류가 필드와 연결되지 않으면 사용자가 입력 목적과 수정 방법을 놓칠 수 있어요.'],
      ['검색 결과 status 공지', String.raw`export function SearchResultStatus({ count }: { count: number }) {
  return <p role="status" aria-atomic="true">
    검색 결과 {count}개
  </p>;
}`, 'status는 화면 초점을 빼앗지 않고 비긴급 상태 업데이트를 알리는 live region이에요.', '결과가 바뀔 때마다 검색 입력으로 포커스를 보내야만 새 내용을 알 수 있어요.', '컨테이너가 업데이트 전에 존재하는지와 불필요하게 반복 낭독되지 않는지 살펴요.', '상태 역할이 없는 변경은 보조 기술 사용자에게 전달되지 않을 수 있고 과도한 focus 이동은 현재 입력을 방해해요.'],
      ['검증 오류 뒤 초점', String.raw`"use client";
import { useEffect, useRef } from "react";

export function CourseForm({ showError }: { showError: boolean }) {
  const firstInvalidRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showError) firstInvalidRef.current?.focus();
  }, [showError]);
  return <form>
    <label htmlFor="course-name">과정 이름</label>
    <input
      id="course-name"
      ref={firstInvalidRef}
      aria-invalid={showError}
      aria-describedby={showError ? "course-name-error" : undefined}
    />
    {showError && <p id="course-name-error">이름을 입력해 주세요.</p>}
  </form>;
}`, '검증 오류가 준비된 시점에 오류를 바로 수정할 위치로 포커스를 안내해요.', '모든 렌더나 입력마다 첫 필드로 포커스를 되돌려도 타이핑 흐름에 문제가 없어요.', '오류가 실제 발생했을 때만 요약 또는 첫 오류 필드로 이동하는지 확인해요.', '포커스를 너무 일찍 또는 매 입력마다 옮기면 오류 위치가 아닌 사용자의 현재 작업을 빼앗아요.'],
      ['움직임 감소 선호', String.raw`export function LoadingMark() {
  return <span>
    <span className="spinner" aria-hidden="true">●</span>
    <span className="sr-only">과정 저장 중</span>
  </span>;
}

/* app/globals.css
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
  html { scroll-behavior: auto; }
}
*/`, 'prefers-reduced-motion은 사용자 시스템 선호에 맞춰 장식 움직임을 줄이고 핵심 상태 텍스트는 보존해요.', '움직임 감소 설정은 장식 애니메이션을 더 빠르게 만들라는 뜻이에요.', '움직임이 줄어도 로딩·완료 같은 의미가 텍스트나 정적 모양으로 전달되는지 확인해요.', '설정을 무시하거나 애니메이션과 함께 상태 정보까지 지우면 사용자의 선호나 작업 맥락을 놓쳐요.'],
    ],
  },
  {
    title: '테스트 전략', objective: '정적 코드 구조와 실제 Next.js 테스트를 구분해 검증 계획을 작성해요.',
    days: [
      ['순수 함수 단위 검사', String.raw`import test from "node:test";
import assert from "node:assert/strict";
import { formatCourseTitle } from "./course-title.js";

test("과정 코드를 화면 제목으로 변환한다", () => {
  assert.equal(formatCourseTitle("js"), "JavaScript");
  assert.equal(formatCourseTitle("unknown"), "과정");
  assert.equal(formatCourseTitle(""), "과정");
});`, '입력·출력 계약과 지원하지 않는 key·빈 값 경계를 빠르게 검사해요.', '대표 입력 하나의 테스트가 라우팅·브라우저 접근성·HTTP 응답까지 증명해요.', '경계 입력의 기대 결과를 실제 함수 계약과 맞추고 각 테스트가 보장하는 범위를 구분해요.', '정상 입력만 검사하면 fallback 오류가 남고 단위 결과를 앱 전체 동작으로 과장할 수 있어요.'],
      ['사용자 동작 컴포넌트 검사', String.raw`/** @jest-environment jsdom */
import { test, expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaveButton } from "./SaveButton";

test("저장 뒤 결과를 사용자에게 알린다", async () => {
  const user = userEvent.setup();
  render(<SaveButton />);
  await user.click(screen.getByRole("button", { name: "저장" }));
  expect(screen.getByRole("status")).toHaveTextContent("저장됨");
});`, '접근 가능한 이름으로 실제 버튼을 찾고 사용자 동작 뒤 결과 상태를 검증해요.', '컴포넌트 내부 state를 직접 조작하거나 자식의 CSS class만 검사하면 버튼 흐름도 같게 확인돼요.', '쿼리 role·name과 검증 문구가 실제 렌더된 접근성 계약에 맞는지 확인해요.', '구현 state나 DOM 위치에 묶인 테스트는 사용자가 버튼을 실행할 수 있는지 알려주지 못해요.'],
      ['Route Handler 통합 요청', String.raw`import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("과정 API가 HTTP JSON 계약을 반환한다", async () => {
  const response = await fetch(new URL("/api/courses", baseUrl));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.courses));
});`, '통합 테스트는 실제 실행 앱으로 요청해 상태 코드와 JSON body를 모두 확인해요.', '소스에서 GET 함수명만 찾으면 요청 라우팅·실행·응답 계약도 검증돼요.', '테스트 서버가 기동된 조건인지, status와 body assertion이 각각 있는지 살펴요.', '정적 문자열 검색은 HTTP가 handler까지 도달하거나 데이터가 반환되는지를 보장하지 않아요.'],
      ['브라우저 E2E 검색', String.raw`import { test, expect } from "@playwright/test";

test("과정 검색 결과가 보인다", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("searchbox", { name: "과정 검색" }).fill("React");
  await expect(
    page.getByRole("link", { name: "React 과정" })
  ).toBeVisible();
});`, 'E2E는 실제 브라우저와 production-like 앱에서 사용자의 검색 흐름을 실행해요.', 'TSX 문법 분석만 성공하거나 주소 문자열만 확인하면 브라우저 E2E도 완료돼요.', 'baseURL, 실행 앱, 브라우저와 await되는 재시도 assertion이 준비됐는지 확인해요.', '문법·파일 이름 검사에는 route, 입력 상호작용과 결과 렌더링 증거가 없어요.'],
      ['네 가지 UI 상태 회귀', String.raw`/** @jest-environment jsdom */
import { test, expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SearchFeedback } from "./SearchFeedback";

const scenarios = [
  { state: "empty", role: "status", message: "검색어를 입력해요" },
  { state: "loading", role: "status", message: "검색 중" },
  { state: "error", role: "alert", message: "검색에 실패했어요" },
  { state: "success", role: "status", message: "과정 2개" },
] as const;

for (const scenario of scenarios) {
  test("상태 안내: " + scenario.state, () => {
    render(<SearchFeedback {...scenario} />);
    expect(screen.getByRole(scenario.role)).toHaveTextContent(scenario.message);
  });
}`, 'empty·loading·error·success 각각의 문구와 상태 역할을 독립 사례로 검증해요.', '성공 하나만 검사하면 빈 결과, 대기 안내, 오류 복구가 같은 계약으로 보장돼요.', '오류처럼 즉시 주의가 필요한 상태와 비긴급 status, 성공 시 결과 수를 따로 확인해요.', '오류를 계속 loading으로 보이게 하거나 모든 변경에 같은 역할을 쓰면 사용자가 진행 상태를 오해할 수 있어요.'],
    ],
  },
  {
    title: '성능과 데이터 전송', objective: '측정 근거와 사용자 기기 제약을 바탕으로 성능을 판단해요.',
    days: [
      ['작은 Client 경계', String.raw`import CourseList from "./CourseList";
import ProgressToggle from "./ProgressToggle";

export default async function CoursesPage() {
  const courses = await getPublicCourses();
  return <>
    <CourseList courses={courses} />
    <ProgressToggle initialComplete={false} />
  </>;
}`, '읽기 전용 목록은 서버에 두고 브라우저 state가 실제 필요한 버튼만 Client Component로 나눠요.', '페이지에 클릭 하나가 있어도 전체 route의 모든 모듈을 client graph로 옮겨요.', '작은 client 경계가 서버에서 내려주는 props까지 불필요하게 크지 않은지 확인해요.', '넓은 client boundary는 불필요한 브라우저 JavaScript와 전달 데이터를 증가시킬 수 있어요.'],
      ['선택 기능 dynamic import', String.raw`"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const MarkdownEditor = dynamic(() => import("./MarkdownEditor"), {
  loading: () => <p role="status">편집기 준비 중</p>,
  ssr: false,
});

export function OptionalEditor() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setIsOpen(true)}>편집기 열기</button>
    {isOpen && <MarkdownEditor />}
  </>;
}`, '큰 client 전용 편집기를 별도 chunk로 불러오고 준비 중 UI를 보여줘요.', 'dynamic import를 전부 사용하면 추가 요청과 사용 시 지연도 사라져요.', '초기 번들의 감소와 기능 사용 시 추가 요청·대기 시간을 함께 비교해요.', '분할은 코드 전송 시점만 바꿀 수 있어 무조건 더 빠르거나 추가 비용이 없는 것은 아니에요.'],
      ['이미지의 로딩 시점', String.raw`import Image from "next/image";

export function CourseGalleryCard() {
  return <Image
    src="/courses/react-cover.webp"
    alt="React 컴포넌트 과정 표지"
    width={640}
    height={360}
    loading="lazy"
  />;
}`, '화면 밖 카드 그림은 늦게 불러오고 첫 화면의 LCP 이미지는 실제 측정에 따라 우선순위를 정해요.', '첫 화면 LCP 이미지도 항상 lazy로 미루거나 모든 카드 이미지를 미리 받아요.', '뷰포트 위치, LCP 기여, 반응형 표시 크기와 내려받는 바이트를 같이 살펴요.', '무관한 이미지까지 미리 받으면 대역폭을 차지하고, 첫 화면 핵심 이미지를 늦추면 콘텐츠 표시가 지연될 수 있어요.'],
      ['Web Vitals 수집 경계', String.raw`"use client";
import { useReportWebVitals } from "next/web-vitals";

const reportForLocalReview: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (process.env.NODE_ENV === "development") {
    console.info(metric.name, metric.value);
  }
};

export function WebVitalsReview() {
  useReportWebVitals(reportForLocalReview);
  return null;
}`, '작은 Client Component에서 hook을 쓸 수 있지만 외부 저장 endpoint나 계측은 별도 구현이에요.', 'hook만 설치하면 Next.js가 실제 방문자 데이터를 무료 저장하고 dashboard에 보여줘요.', '실제 callback 안정성과 수집 대상, 개인정보·전송 동의를 확인하고 무수집 범위도 명시해요.', 'hook은 자동 analytics 서비스가 아니며 서버 컴포넌트나 정적 소스 검사만으로 사용자 값을 모으지 않아요.'],
      ['측정 비교와 성능 예산', String.raw`export const performanceReview = {
  app: "production-like next build + next start",
  route: "/courses",
  compareWith: ["same viewport", "same device", "same network profile"],
  labMetrics: ["LCP", "INP", "CLS"],
  fieldData: "not collected: no analytics endpoint",
  budget: "set after representative baseline; no assumed number",
} as const;`, '동일 조건의 lab 비교와 실제 field 데이터는 다른 증거이며 예산은 대표 baseline 뒤에 정해요.', '조건이 다른 Lighthouse 한 번의 점수로 회귀를 확정하거나 근거 없이 byte budget을 정해요.', 'production-like 빌드에서 같은 route·기기 조건으로 반복 측정하고 현장 자료 유무를 기록해요.', '실험실 시뮬레이션은 실제 사용자 기기 분포를 대신하지 않고 임의 예산은 병목 근거를 제공하지 않아요.'],
    ],
  },
  {
    title: 'React 기능과 Next 경계', objective: 'React 컴포넌트 지식을 App Router에서 활용하며 서버 기능을 구분해요.',
    days: [
      ['공유 컴포넌트', String.raw`export default async function CoursesPage() {
  const courses = await listPublicCourses();
  return (
    <main>
      {courses.map((course) => (
        <article key={course.id}>
          <CourseTitle title={course.title} />
          <ProgressToggle courseId={course.id} initialDone={course.done} />
        </article>
      ))}
    </main>
  );
}`, '서버 page의 데이터 조회와 버튼의 상태·클릭 처리를 별도 module 경계에 둬요.', '파일이 components 폴더에 있다는 이유로 모든 컴포넌트가 자동 client가 돼요.', '파일 위치가 아니라 import graph와 사용하는 API가 실행 경계를 결정해요.'],
      ['Context 경계', String.raw`"use client";
import { createContext, useContext, useState } from "react";

type ThemeValue = { theme: "light" | "dark"; toggleTheme: () => void };
const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeValue["theme"]>("light");
  const value = {
    theme,
    toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light"),
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("ThemeProvider 안에서 사용해야 해요.");
  return value;
}`, 'Context Provider와 소비 hook은 client 경계에 두고 server layout은 children을 전달해요.', 'Context를 쓰기 위해 데이터 조회 page 전체를 client graph로 옮겨요.', '작은 provider 경계를 두면 서버에서 그릴 수 있는 하위 콘텐츠의 범위를 유지할 수 있어요.'],
      ['Effect와 외부 시스템', String.raw`"use client";
import { useEffect } from "react";

export function ProgressTitle({ courseId, courseTitle, onProgress }: Props) {
  useEffect(() => {
    const channel = subscribeToProgress(courseId, onProgress);
    document.title = courseTitle;
    return () => channel.unsubscribe();
  }, [courseId, courseTitle, onProgress]);
  return null;
}`, 'Effect는 브라우저 구독처럼 외부 시스템과 연결할 때 쓰고, 값이 바뀌거나 화면에서 사라지면 구독을 정리해요.', '화면에서 바로 계산되는 제목 값을 state에 복사하려고 Effect를 추가해요.', '이전 구독을 해제하지 않으면 강좌가 바뀐 뒤에도 중복 알림이 남아요.'],
      ['이벤트와 Server Action', String.raw`"use client";
import { useState } from "react";
// ./actions.ts 파일은 "use server"로 시작해요.
import { saveProgress } from "./actions";

export function ProgressToggle({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <form action={saveProgress}>
      <input type="hidden" name="courseId" value={courseId} />
      <button type="button" onClick={() => setOpen(!open)}>상세 전환</button>
      <button type="submit">진도 저장</button>
      {open && <p>저장 요청은 서버에서 다시 인증·인가해요.</p>}
    </form>
  );
}`, 'onClick은 브라우저 이벤트이고 저장 요청은 Server Action으로 처리해요. 서버는 매 요청마다 로그인과 대상 자료의 권한을 확인해야 해요.', '화면에서 버튼을 숨기면 서버가 받은 courseId의 권한도 자동 확인돼요.', '폼 제출이나 action 지정은 실행 경계를 만들 뿐 자료 변경 권한 검사를 대신하지 않아요.'],
      ['React API 버전', String.raw`const frameworkReview = {
  nextVersion: "잠금 파일에서 확인",
  reactVersion: "잠금 파일에서 확인",
  reactApi: ["useActionState", "useOptimistic"],
  checkPeerRangeAndFrameworkSupport: true,
} as const;

// 프로젝트에 hook을 추가하기 전에 지원 근거를 기록해요.`, 'React hook 문서와 잠금 파일에 적힌 Next.js·React 버전을 함께 대조해요.', '현재 React 문서에 소개된 API라면 모든 기존 Next.js 설치에서 지원돼요.', '공식 API 문서는 사용법 근거예요. 실제 프로젝트에서 쓸 수 있는지는 설치된 두 버전과 Next.js 지원 문서로 확인해요.'],
    ],
  },
  {
    title: '업데이트와 호환성', objective: '안정 기능·실험 기능·프리릴리스 API를 구분해요.',
    days: [
      ['안정판 문서', String.raw`const manifest = {
  reviewedReference: "2026-10-29 확인: 최신 안정판 문서 Next.js 16.4.3",
  packageLock: {
    name: "study-web",
    lockfileVersion: 3,
    packages: {
      "": { dependencies: { next: "^16.4.1", "example-formatter": "^2.1.0" } },
      "node_modules/next": {
        version: "16.4.1",
        resolved: "https://registry.npmjs.org/next/-/next-16.4.1.tgz",
        integrity: "<잠금 파일의 무결성 값>",
      },
      "node_modules/example-formatter": {
        version: "2.1.3",
        integrity: "<잠금 파일의 무결성 값>",
      },
    },
  },
  reviewedAt: "2026-10-29",
  note: "최신 문서 확인만으로 프로젝트 설치 버전이 바뀌지는 않아요.",
} as const;`, 'package.json의 허용 버전 범위, 잠금 파일에 기록된 설치 버전, 공식 문서 확인 날짜를 따로 적어요.', 'package.json의 범위만 보고 현재 설치 버전을 단정해요.', '최신 공식 문서의 버전과 학습 프로젝트에 설치된 버전은 다를 수 있어요.'],
      ['릴리스와 API 상태', String.raw`const release = "Next.js 16.4";
const summary = "지연 컴파일과 Cache Components 개선";
const beforeTeaching = [
  "기능별 API 문서를 확인해요",
  "안정판인지 실험 기능인지 기록해요",
  "활성화 조건과 지원 버전을 확인해요",
] as const;`, '릴리스 소개는 요약으로 읽고 API별 안정 상태·설정·지원 버전을 별도 확인해요.', '블로그에 기능이 언급되면 모든 프로젝트에서 안정 기능으로 쓸 수 있어요.', '소개 문장만으로 활성화 조건이나 호환 버전을 알 수 없어요.'],
      ['Next.js 16 변경 경계', String.raw`type CoursePage = PageProps<"/courses/[slug]">;

export default async function Page({ params }: CoursePage) {
  const { slug } = await params;
  return <CourseDetails slug={slug} />;
}

// Next.js 16부터 middleware.ts와 middleware()를 proxy.ts와 proxy()로 옮겨요.`, 'params를 비동기로 읽고 middleware.ts·middleware()는 새 규약인 proxy.ts·proxy()로 옮겨요.', 'params는 계속 동기 객체이고 middleware 파일 규약도 그대로 권장돼요.', '큰 버전 업데이트에서는 타입 계약과 파일 이름·함수 규약 변경도 함께 확인해요.'],
      ['사용 중단 예정 설정 바꾸기', String.raw`const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.test", pathname: "/courses/**" },
    ],
  },
};`, '사용 중단 예정인 설정은 경고만 감추지 말고 remotePatterns로 옮겨 필요한 출처만 허용해요.', '경고를 숨기거나 외부 이미지 호스트를 모두 허용하면 변경이 끝나요.', '새 설정에서 허용하는 프로토콜·호스트·경로가 실제 이미지 주소와 맞는지 확인해요.'],
      ['패키지 공급망 확인', String.raw`const lockedPackage = {
  name: "next",
  version: "16.4.1",
  resolved: "https://registry.npmjs.org/next/-/next-16.4.1.tgz",
  integrity: "<잠금 파일의 무결성 값>",
};
// 출처·보안 공지·유지보수·라이선스·배포 크기도 확인해요.`, '잠금 파일의 재현성과 출처·취약점·유지보수·라이선스 검토를 구분해요.', '버전을 고정하면 패키지의 안전성·라이선스·관리 상태도 자동 보증돼요.', '무결성 검사는 다운로드가 고정된 내용과 같은지 확인하지만 패키지가 적절한지는 별도 판단이에요.'],
    ],
  },
  {
    title: '테스트 결과 읽기와 결함 분류', objective: '문제의 원인을 콘텐츠·타입·빌드·서버 경계로 나눠요.',
    days: [
      ['생성 route 타입', String.raw`// 먼저 next typegen, next dev, next build 중 하나를 실행해요.
type Props = PageProps<"/courses/[slug]">;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}`, 'Next 16의 Promise params와 next typegen이 만드는 경로 타입을 확인해요.', 'as any를 붙이거나 next-env.d.ts를 직접 고쳐 타입 오류를 감춰요.', '경로 타입을 생성한 시점과 현재 설치된 Next.js 버전을 함께 확인해요.'],
      ['Root layout 빌드 오류', String.raw`// app/layout.tsx
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}`, 'App Router의 최상위 layout 파일과 `<html>`, `<body>` 작성 규칙을 먼저 확인해요.', 'page 안에 html을 중복 추가하거나 브라우저 캐시를 지워 빌드 오류를 해결해요.', '파일 구성 문제로 생긴 빌드 오류와 화면 실행 중 생긴 오류는 원인과 확인 방법이 달라요.'],
      ['예상된 없음과 예외', String.raw`import { notFound } from "next/navigation";

async function loadCourse(courseUrl: string) {
  const response = await fetch(courseUrl);
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("과정 정보를 불러오지 못했어요.");

  const course = await response.json();
  return <CourseDetails course={course} />;
}`, '없는 리소스는 notFound로, 503 등 요청 실패는 오류 경계로 분류해요.', '서비스 장애도 notFound로 바꾸거나 실패한 응답을 빈 성공 객체로 표시해요.', '404와 일시적인 5xx는 사용자가 취할 행동이 다른 실패 상태예요.'],
      ['계정 사이 캐시 격리', String.raw`async function getDashboard() {
  const user = await requireAuthenticatedUser();
  return repository.findProgressForUser(user.id);
}

// 확인 순서: A 로그인 → 조회 → B 로그인 → 같은 경로 다시 조회`, 'A로 로그인해 조회한 뒤 B로 로그인해 같은 경로를 다시 여는 순서와, 각 응답의 데이터 주인을 기록해요.', '한 사용자 새로고침만 통과하면 계정 간 캐시 격리도 증명돼요.', '같은 URL이라도 응답에 다른 사용자의 기록이 섞이지 않도록 로그인 사용자와 캐시 범위를 확인해야 해요.'],
      ['최소 재현과 안전한 제보', String.raw`const report = {
  nextVersion: "16.4.3",
  route: "/courses/state",
  input: { slug: "missing" },
  expected: "자료 없음 화면",
  actual: "처리되지 않은 오류",
  secrets: "삭제함",
} as const;`, '버전·경로·최소 입력·기대/실제 결과만 남기고 인증 정보를 제거해요.', '환경 설정 파일 전체와 인증 쿠키를 첨부하면 누구나 같은 오류를 재현할 수 있어요.', '제보는 다른 사람이 다시 확인할 수 있게 쓰되 민감한 정보는 빼야 해요.'],
    ],
  },
  {
    title: '라우팅과 UI 테스트 심화', objective: '깊은 경로와 사용자 흐름의 테스트 사례를 작성해요.',
    days: [
      ['직접 진입과 이동', String.raw`import { expect, test } from "@playwright/test";

// playwright.config.ts의 baseURL을 실행 중인 사이트 주소로 설정해요.
test("깊은 경로 직접 진입과 목록 이동", async ({ page }) => {
  await page.goto("/tracks/react");
  await page.getByRole("link", { name: "상태" }).click();
  await expect(page).toHaveURL(/\/tracks\/react\/lessons\/state$/);
  await page.goBack();
  await expect(page).toHaveURL("/tracks/react");

  await page.goto("/tracks/react/lessons/state");
  await expect(page.getByRole("heading", { name: "상태" })).toBeVisible();
});`, '직접 URL 진입을 시작점으로 시험하고 내부 이동·뒤로 가기 시나리오도 분리해요.', '루트의 제목이 보이면 배포 환경의 깊은 경로도 정상이에요.', '내부 client navigation과 새 route 요청은 서로 다른 경로 해석 오류를 가질 수 있어요.'],
      ['not-found 테스트 경계', String.raw`test("없는 강의 화면에 돌아갈 링크가 표시됨", async ({ page }) => {
  await page.goto("/courses/missing");
  await expect(page.getByRole("heading", { name: "강의를 찾을 수 없어요." })).toBeVisible();
  await expect(page.getByRole("link", { name: "모든 강의" })).toHaveAttribute("href", "/courses");
  // 응답이 streaming되기 전인지 확인한 뒤 HTTP 상태도 검사해요.
});`, '없는 과정 화면과 복귀 경로를 확인하고 streaming 여부에 따라 status 기대를 정해요.', 'not-found UI가 보이면 실제 요청이 반드시 HTTP 404였다고 가정해요.', 'Next.js는 streaming 시작 뒤 not-found UI를 보여 줘도 이미 전송된 HTTP status를 바꿀 수 없어요.'],
      ['제어된 loading 전이', String.raw`import type { Page } from "@playwright/test";

async function verifyLoading(page: Page) {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });

  await page.route("**/api/courses/slow", async (route) => {
    await responseGate;
    await route.fulfill({ json: { title: "상태" } });
  });
  const navigation = page.goto("/courses/slow");
  await expect(page.getByRole("status")).toContainText("불러오는 중");
  releaseResponse();
  await navigation;
  await expect(page.getByRole("heading", { name: "상태" })).toBeVisible();
}`, '응답을 제어해 loading을 본 다음 고정 sleep 없이 재시도 assertion으로 최종 상태를 기다려요.', 'CI가 빨라 보이도록 고정 3초 뒤 한 번만 화면을 확인해요.', '테스트가 지연을 제어하고 관찰 가능한 상태 완료를 기다리면 환경별 임의 시간에 덜 의존해요.'],
      ['레이블·키보드 폼 흐름', String.raw`import type { Page } from "@playwright/test";

async function verifyCourseForm(page: Page) {
  await page.goto("/courses/new");
  const title = page.getByLabel("강의 이름");
  await title.fill("");
  await title.press("Enter");
  const error = page.getByText("강의 이름을 입력해 주세요.");
  await expect(error).toBeVisible();
  await expect(error).toHaveAttribute("id", "title-error");
  await expect(title).toHaveAttribute("aria-describedby", "title-error");
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await title.fill("상태 기초");
  await title.press("Enter");
  await expect(page.getByRole("status")).toContainText("저장됐어요.");
}`, '접근 가능한 label, 키보드 제출, 오류 연결, 성공 상태를 각각 확인해요.', '저장 버튼을 마우스로 누른 성공 한 번이 입력 오류와 키보드 동작도 증명해요.', 'label 기반 선택과 실패·성공 두 경로는 포인터 전용 테스트가 놓치는 접근성 계약을 검증해요.'],
      ['Fake가 대체한 범위', String.raw`import assert from "node:assert/strict";

type CourseRepository = {
  findById: (id: string) => Promise<{ id: string; title: string } | null>;
};

async function buildCoursePage(id: string, repository: CourseRepository) {
  const course = await repository.findById(id);
  return course ? { title: course.title } : null;
}

async function verifyCourseModel() {
  const fakeCourseRepository = {
    findById: async (id: string) => id === "state" ? { id, title: "상태" } : null,
  };

  const pageModel = await buildCoursePage("state", fakeCourseRepository);
  assert.deepEqual(pageModel, { title: "상태" });
}
// 이 단위 검사는 실제 SQL·권한 확인·Next.js 서버를 실행하지 않아요.
await verifyCourseModel();`, '가짜 저장소를 이용한 단위 검사와 실제 데이터베이스·권한·Next.js 실행 검사를 구분해요.', '가짜 저장소 검사가 통과하면 실제 데이터베이스 구조와 권한 확인까지 검증돼요.', '가짜 저장소는 지정한 부분만 대신해요. 실제 데이터베이스와 권한은 별도 통합 검사로 확인해야 해요.'],
    ],
  },
  {
    title: '에러 관측과 복구 설계', objective: '실패 상태·추적 정보·복구 선택지를 제품 흐름으로 연결해요.',
    days: [
      ['관측 ID', 'requestId: "req-abc123"', '민감값 대신 추적 ID로 내부 로그와 사용자 제보를 연결해요.', '모든 요청 본문을 로그에 남겨 원인을 찾아요.', '로그에 개인 정보나 인증 정보가 노출되지 않는지 확인해요.'],
      ['재시도 정책', 'retry only transient failures with a bound', '일시 실패만 횟수·간격을 제한해 재시도해요.', '모든 오류를 무한 재시도해요.', '중복 변경·비용 증가·사용자 대기를 함께 고려해요.'],
      ['중단과 취소', 'AbortController + signal', '요청 취소 신호와 컴포넌트 수명, 결과 반영 정책을 연결해요.', '사용자가 화면을 나가도 오래된 결과를 항상 저장해요.', '취소가 UI 작업뿐 아니라 서버 부작용도 취소한다고 오해하지 않아요.'],
      ['복구 CTA', '<button>다시 불러오기</button>', '복구 가능한 실패에는 구체적인 다음 행동을 제공해요.', '모든 오류에 같은 홈 이동 버튼만 제공해요.', '사용자가 입력한 값 보존과 재시도 영향 범위를 점검해요.'],
      ['운영 한계 표시', 'static export: no request-time Node handler', '배포 환경이 처리하지 않는 요청 기능을 명확히 문서화해요.', 'UI 안내만 추가하면 실행 서버 기능이 생겨요.', '기능 소개·문제 설명·배포 설정의 지원 상태를 일치시켜요.'],
    ],
  },
  {
    title: '데이터 계층과 저장소 계약', objective: 'Next.js와 데이터 저장소 사이 책임을 API·권한·마이그레이션으로 나눠요.',
    days: [
      ['데이터 접근 계층', 'getCourseRepository().findVisibleById(id)', '화면에서 저장소 호출을 분리해 테스트 가능한 데이터 계약을 만들어요.', '컴포넌트 파일에 SQL과 권한 검사를 섞어요.', '서버 전용 접근 코드가 클라이언트 번들에 포함되지 않는지 확인해요.'],
      ['트랜잭션', 'begin → update course → write audit → commit', '함께 성공·실패해야 하는 변경은 저장소 트랜잭션 경계를 검토해요.', '두 쓰기가 각자 성공해도 한 작업으로 일관돼요.', '부분 실패 시 어떤 상태가 남는지 테스트해요.'],
      ['스키마 변경', 'migration → deploy compatible code → verify', '기존 사용자 데이터와 호환되는 변경 순서를 설계해요.', '배포마다 데이터 삭제 후 다시 만들면 안전해요.', '롤백 가능성·백업·기존 버전 호환을 확인해요.'],
      ['권한별 조회', 'findCourseForViewer(courseId, viewerId)', '권한을 결과 응답 뒤에 숨기지 말고 데이터 조회 경계에서 확인해요.', 'URL의 임의 ID를 알면 다른 사람 데이터도 읽을 수 있어요.', 'IDOR와 누락된 객체별 권한 검사를 점검해요.'],
      ['현재 저장 범위', 'this site: browser-local progress only', '정적 학습기 기록은 브라우저 안에 보관되고 서버 동기화와 별개예요.', 'localStorage가 기기 간 계정 동기화를 제공해요.', '백업·로그인·동기화가 실제로 지원되는 기능인지 정확히 구분해요.'],
    ],
  },
  {
    title: '정적 export의 지원 경계', objective: '정적 파일 배포에서 가능한 기능과 Node 서버가 필요한 기능을 판별해요.',
    days: [
      ['output export', 'output: "export"', '정적 export는 빌드 때 만든 파일을 제공하며 요청별 서버 코드를 실행하지 않아요.', 'export 옵션이 Node 요청 runtime을 브라우저로 옮겨요.', '정적 호스팅이 지원하는 파일·라우팅 규칙을 확인해요.'],
      ['지원되는 정적 경로', 'pre-rendered page + browser interaction', '미리 만들 수 있는 페이지와 브라우저 상호작용은 정적 사이트에서 제공할 수 있어요.', '정적 파일이면 사용자마다 다른 요청 처리가 가능해요.', '빌드 시 생성되는 데이터와 요청별 데이터 차이를 구분해요.'],
      ['지원되지 않는 서버 기능', 'Server Actions / request-dependent Route Handler', '요청별 기능은 실행 가능한 Node 서버 환경이 필요해요.', 'Cloudflare Pages 정적 파일이 임의 Node handler를 실행해요.', '플랫폼 제품·무료 한도·런타임 모델을 공식 문서에서 확인해요.'],
      ['동적 경로 내보내기', 'generateStaticParams() → known build-time paths', '빌드 시 알 수 있는 경로는 미리 생성할 수 있어요.', '빌드 뒤에 새 동적 경로가 서버 없이 자동 생성돼요.', '모든 페이지 경로를 미리 알 수 있는지 확인해요.'],
      ['범위 라벨링', 'client-only practice · no server execution', '실행 지원과 코드 읽기 가이드를 UI에서 구분해요.', '단어 “Next.js”가 있으면 실제 Next 서버를 실행했다고 말해요.', '학습기 기능이 보장하는 정확한 검증 수준을 명시해요.'],
    ],
  },
  {
    title: '정적 사이트 배포와 환경 설정', objective: '무료 정적 호스팅에 맞는 빌드 자산과 설정 노출을 검토해요.',
    days: [
      ['build 산출물', 'next build → out/', 'export 배포는 빌드 결과물 경로와 호스트 설정을 확인해요.', '저장소 소스와 서버 실행이 배포물에 자동 포함돼요.', '배포 디렉터리에 실제 필요한 파일이 존재하는지 감사해요.'],
      ['base path와 asset prefix', 'basePath: "/study"', '프로젝트 하위 경로 배포는 URL 생성과 asset 경로를 함께 설정해요.', '도메인 루트에서만 잘 되면 하위 경로도 자동 호환돼요.', '페이지·이미지·내비게이션의 하위 경로를 시험해요.'],
      ['환경값 공개', 'NEXT_PUBLIC_SITE_NAME  |  PRIVATE_API_KEY', '클라이언트 prefix는 공개 가능한 값에만 사용해요.', '빌드 환경 변수는 브라우저에서 모두 비공개예요.', '정적 산출물에서 실제 문자열을 검색해 노출 여부를 확인해요.'],
      ['무료 한도', 'asset bytes + build minutes + request limits', '무료 등급은 현재 제한과 약관을 배포 시점에 확인해요.', '무료 플랜은 영구 무료이고 무제한이에요.', '초과 시 비용·사용 중단·데이터 영향이 어떻게 되는지 검토해요.'],
      ['출시 검수', 'build → audit → preview → publish', '공개 전 로컬 빌드·링크·보안 헤더·기능 경계를 확인해요.', '로컬 개발 화면이 열리면 공개 배포도 안전해요.', 'preview 결과와 사용자가 받는 실제 사이트를 구분해요.'],
    ],
  },
  {
    title: 'Capstone: 정적 학습 대시보드', objective: '정적 Next.js 학습 대시보드의 요구·경계·검증 계획을 완성해요.',
    days: [
      ['요구사항과 경로 지도', 'tracks → track/[id] → lesson/[slug]', 'URL·정적 데이터·화면 상태를 사용자 여정으로 연결해요.', '폴더 트리만 만들면 접근성·오류·기록 요구가 해결돼요.', '첫 진입·직접 URL·없는 항목의 흐름을 작성해요.'],
      ['서버 기능 대안', 'public lesson data + client-side saved progress', '정적 데이터와 브라우저 저장으로 가능한 기능만 제품 약속에 넣어요.', '브라우저 저장이 계정 동기화와 서버 DB를 대신해요.', '기기 간 지속성과 로컬 백업의 차이를 명시해요.'],
      ['컴포넌트 경계 검토', 'Server page → small client progress widget', '초기 화면 데이터와 상호작용 위젯의 실행 위치를 나눠요.', '대시보드 전체에 client 지시문을 붙여 모든 경계를 단순화해요.', '클라이언트 코드·전달 데이터·저장 상태를 최소화해요.'],
      ['테스트 계획', 'route cases + keyboard + empty + error', '정상·빈 상태·잘못된 주소·키보드 경로를 검증 계획에 포함해요.', '정적 코드 예제가 맞아 보이면 실제 테스트 계획은 필요 없어요.', '실제 구현 환경이 없는 항목은 계획 검토와 실행 검증을 구분해요.'],
      ['기능 범위 보고', 'verified / concept-only / unsupported', '지원·개념 연습·미지원 기능을 각각 사실대로 공개해요.', '미지원 서버 기능을 감추면 사용자에게 간단한 경험이 돼요.', '사용자가 코드 실행과 개념 학습을 혼동하지 않도록 범위를 표시해요.'],
    ],
  },
];

const phaseFor = (week) => phases.find((phase) => phase.weeks.includes(week));
const levelFor = (week) => week <= 4 ? '입문' : week <= 8 ? '기초' : week <= 15 ? '중급' : week <= 22 ? '고급' : '실전';
const genericStaticMisconception = '이 사이트가 Next.js 서버에서 예제를 실행하고 결과를 검증했어요.';

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

function reviewedShortAnswer(id, question) {
  const asksForExactName = /명령을 적으세요|JavaScript 키워드|키워드|훅|prop 이름|문자열 값을 무엇이라 이름 붙|속성 이름|속성을 적으세요|함수 이름|표준 함수를 적으세요|메서드 이름|인터페이스 이름|타입 이름|지시문을 적으세요|dynamic 값|role 이름|locator\/assertion|폴더는 무엇/.test(question.prompt);
  const createAnswer = asksForExactName ? versionedShortAnswer : shortAnswer;
  return createAnswer(id, question.title, question.prompt, question.acceptedAnswers, question.hint, question.explanation,
    asksForExactName ? 'case-sensitive' : undefined);
}

// W1-W3 are authored as dated learning cases instead of repeating a template
// that only asks learners to name each day's topic.
const reviewedFirstWeeks = {
  1: [
    {
      check: reviewedCheck('React와 Next.js의 책임', '강의 페이지는 React로 화면을 그리고 URL 규칙과 빌드 흐름도 필요합니다. 어떤 설명이 두 도구의 역할을 정확히 나누나요?', 'React로 UI를 만들고 Next.js가 라우팅·렌더링·빌드 체계를 연결해요.', ['Next.js가 React를 대체하는 별도 UI 언어예요.', 'React가 파일 경로 라우터와 배포 서버까지 자동 제공해요.'], 0, '화면 컴포넌트와 앱 프레임워크가 맡는 일을 따로 보세요.', 'React는 컴포넌트와 화면 UI를 제공하고 Next.js는 그 UI를 앱 경로·렌더링·빌드 규칙에 연결해요.', ['Next.js는 React 기반 프레임워크라 두 책임을 교체 관계로 보면 안 돼요.', 'React만으로는 이 파일 기반 Next.js 경로 규칙이 자동 생기지 않아요.']),
      explain: reviewedWrite('화면 UI 담당 찾기', '위 구조에서 제목과 본문처럼 실제 화면 요소를 표현하는 UI 라이브러리는 무엇인가요?', ['React', 'React UI', 'React 컴포넌트'], '프레임워크 이름과 화면 컴포넌트 라이브러리 이름을 구분하세요.', '이 예제의 JSX 화면은 React 컴포넌트로 표현하고 Next.js가 이를 애플리케이션 경로와 빌드 흐름에 연결해요.'),
      apply: reviewedWrite('프레임워크 계층 설명', '팀 문서에 “React 화면과 파일 기반 경로·빌드 규칙을 묶는 프레임워크”라고 적었습니다. 프레임워크 이름을 쓰세요.', ['Next.js', 'Next.js 프레임워크'], 'React 위에서 앱 구조와 경로 규칙을 제공하는 도구예요.', '요구에 적힌 파일 기반 경로와 빌드 체계를 제공하는 이름은 Next.js예요.'),
    },
    {
      check: reviewedCheck('page 파일에서 URL 읽기', 'App Router에서 app/courses/page.tsx를 배치했을 때 이 화면의 경로는 무엇인가요?', '/courses', ['/app/courses/page.tsx', '/courses/page.tsx'], 1, 'app은 라우트 루트이고 page.tsx는 URL에 적지 않는 예약 파일이에요.', 'courses 폴더가 경로 segment가 되고 page.tsx가 화면을 정의하므로 주소는 /courses예요.', ['app은 프로젝트 안의 라우터 디렉터리라 URL prefix가 아니에요.', '예약 파일 이름 page.tsx 자체는 주소 segment가 되지 않아요.']),
      explain: reviewedWrite('홈 화면 예약 경로', '같은 규칙에서 app/page.tsx가 연결하는 브라우저 경로를 적으세요.', ['/', '루트', '루트 경로', '홈 경로', '홈페이지 경로'], '라우트 루트에 바로 있는 page 파일이에요.', '루트 page.tsx에는 폴더 segment가 없어서 사이트의 / 경로를 정의해요.'),
      apply: reviewedWrite('라우트 예약 파일 확인', 'app/courses 폴더에서 /courses 화면을 실제로 정의하는 예약 파일 이름은 무엇인가요?', ['page.tsx', 'page'], '공유 UI 파일 layout과 화면 파일을 구별하세요.', '화면 route를 정의하는 예약 파일은 page.tsx예요. layout.tsx는 하위 화면을 감싸는 공통 UI예요.'),
    },
    {
      check: reviewedCheck('개발·빌드·실행 단계 구분', 'Next.js 앱을 개발하고 배포용 산출물을 만든 뒤 Node 서버로 실행합니다. 올바른 명령 순서는 무엇인가요?', 'next dev → next build → next start', ['next build → next dev → next start', 'next dev → next start → next build'], 2, '개발 확인과 배포 빌드, 빌드된 서버 앱 실행은 각각 목적이 달라요.', 'next dev는 개발, next build는 최적화된 배포 빌드, next start는 그 빌드 결과를 Node 서버에서 실행해요.', ['next start는 빌드 결과를 시작하는 단계이므로 개발 명령 뒤 빌드가 필요해요.', 'next build가 배포용 파일을 만들기 전에 배포 서버 실행부터 할 수는 없어요.']),
      explain: reviewedWrite('배포 빌드 명령', '개발 서버가 아니라 배포용 최적화 결과를 생성하는 명령을 적으세요.', ['next build', 'next build 명령', 'next build 명령어'], '세 명령 중 배포 산출물을 만드는 단계를 고르세요.', 'next build가 배포용 결과를 만들고 next start가 해당 서버 앱을 실행해요.'),
      apply: reviewedWrite('Node 서버 시작 명령', 'next build가 성공한 뒤 빌드된 Next.js 앱을 Node 서버에서 시작하는 명령은 무엇인가요?', ['next start', 'next start 명령', 'next start 명령어'], '빌드를 생성하는 명령과 그 빌드를 실행하는 명령을 구분하세요.', '서버 배포 흐름에서 next start는 앞서 만든 production build를 실행해요. 정적 export 호스트에서는 이 Node 서버가 실행되는 것이 아니에요.'),
    },
    {
      check: reviewedCheck('App Router 기본 실행 위치', '별도 지시문이 없는 App Router 컴포넌트에서 서버 데이터 함수로 강의 목록을 불러옵니다. 가장 정확한 설명은 무엇인가요?', '기본 Server Component에서 비동기 데이터를 읽고 화면을 만들 수 있어요.', ['모든 page는 먼저 브라우저에서 실행되므로 window를 바로 읽어야 해요.', '모든 컴포넌트가 Client Component라 useState가 기본 제공돼요.'], 0, 'App Router의 기본 컴포넌트 경계와 브라우저 전용 API를 구분하세요.', 'App Router는 기본적으로 Server Component를 사용해 서버에서 데이터를 읽을 수 있어요. 브라우저 상태나 이벤트가 필요한 UI만 client 경계로 나눠요.', ['기본 서버 컴포넌트는 브라우저 전역 window에 접근하는 곳이 아니에요.', 'useState와 이벤트 처리기는 client 경계 안에서 사용해요.']),
      explain: reviewedWrite('기본 컴포넌트 구분', 'App Router에서 별도 client 지시문이 없는 page 컴포넌트는 어떤 종류인가요?', ['Server Component', '서버 컴포넌트'], '기본값을 묻고 있어요. 상호작용 UI와 혼동하지 마세요.', '별도로 경계를 선언하지 않은 App Router 컴포넌트는 Server Component예요.'),
      apply: reviewedWrite('브라우저 이벤트 경계', '열기 버튼의 onClick과 useState가 필요한 작은 컴포넌트에 둘 client 경계를 나타내는 지시문을 적으세요.', ["'use client'", '"use client"', 'use client'], '컴포넌트 모듈 맨 위에 표시하는 문자열 지시문이에요.', '브라우저 이벤트와 React state를 쓰는 컴포넌트는 모듈 경계에 use client를 선언해요. 화면 전체를 무조건 client로 바꿀 필요는 없어요.'),
    },
    {
      check: reviewedCheck('정적 호스팅 요구 판별', '사이트에는 미리 생성 가능한 공개 강의 페이지와 브라우저 필터만 있습니다. 요청 때마다 실행할 서버 API도 필요한가요?', '정적 페이지와 브라우저 동작은 제공할 수 있고, 요청별 서버 처리는 별도 런타임이 필요해요.', ['정적 호스팅은 브라우저 이벤트도 실행할 수 없어요.', '정적 파일 호스트가 FastAPI나 Next.js Node handler를 자동 실행해요.'], 1, '호스트가 정적 파일을 제공하는 것과 요청별 서버 코드를 실행하는 것을 나누세요.', '정적 내보내기는 빌드된 페이지와 브라우저 코드를 제공하지만, Route Handler·Server Action 같은 요청별 처리기는 실행 서버가 필요해요.', ['브라우저에서 실행되는 필터와 정적 자산 제공은 정적 사이트에서도 가능해요.', '정적 호스트가 Python이나 Node 서버 코드를 대신 실행하지는 않아요.']),
      explain: reviewedWrite('요청별 처리의 배포 조건', '사용자 요청마다 DB를 읽는 동적 서버 코드를 실행하려면 정적 파일 외에 무엇이 필요한가요?', ['서버 런타임', 'Node 서버', 'Node.js 서버', 'Node.js 런타임', '실행 서버'], '요청 시점에 코드가 돌아가는 환경이에요.', '동적 요청 코드는 Node.js 같은 서버 런타임에서 실행돼요. 정적 파일 호스트에는 그 실행기가 없어요.'),
      apply: reviewedWrite('정적 호스팅의 적합성 확인', '호스팅 선택 전에 각 기능이 빌드 시 생성되는지, 브라우저에서 실행되는지, 요청 때 서버에서 실행되는지 무엇을 구분해야 하나요?', ['실행 위치', '기능의 실행 위치', '실행 시점과 위치', '기능의 실행 시점과 위치', '요청 시점 서버 처리 여부', '빌드·브라우저·요청 서버 실행 위치'], '빌드·브라우저·요청 서버 중 어느 단계인지 생각해 보세요.', '기능의 실행 위치와 요청별 서버 처리 여부를 먼저 적어야 정적 호스팅에서 제공할 수 있는 범위를 판단할 수 있어요.'),
    },
  ],
  2: [
    {
      check: reviewedCheck('page와 layout 역할 나누기', 'app/courses 안에 page.tsx와 layout.tsx가 있습니다. /courses 화면을 정의하는 파일은 무엇인가요?', 'page.tsx가 /courses의 화면을 정의해요.', ['layout.tsx가 자동으로 /courses 본문을 만들어요.', '폴더 이름 courses만으로 별도 화면 내용도 자동 생성돼요.'], 2, 'URL과 화면 본문을 만드는 예약 파일 이름을 확인하세요.', 'page.tsx는 경로에서 보여 줄 화면이고 layout.tsx는 해당 경로와 하위 화면을 감싸는 공통 UI예요.', ['layout은 공통 껍데기이며 실제 페이지 본문을 대신 정의하지 않아요.', '폴더는 URL segment를 만들지만 화면 콘텐츠는 page 파일이 정의해요.']),
      explain: reviewedWrite('공유 UI 예약 파일', 'courses 경로의 여러 하위 화면에서 공통 메뉴를 감싸려면 어떤 예약 파일을 사용하나요?', ['layout.tsx', 'layout'], 'page와 짝을 이루어 여러 화면을 감싸는 파일이에요.', 'layout.tsx는 해당 경로 아래의 페이지에 공통 UI를 제공해요.'),
      apply: reviewedWrite('URL 파일 조각 제외', 'app/courses/page.tsx로 만든 주소에서 URL에 포함하지 않는 예약 파일 이름은 무엇인가요?', ['page.tsx', 'page'], '폴더 segment와 예약 파일 이름을 나눠 보세요.', 'courses 폴더는 /courses segment가 되지만 page.tsx 파일명은 URL에 붙지 않아요.'),
    },
    {
      check: reviewedCheck('src/app 위치 선택', '새 프로젝트의 app 위치를 정합니다. Next.js가 지원하는 구조 선택을 고르세요.', '루트 app/ 또는 src/app/ 중 한 구조를 프로젝트에서 사용해요.', ['두 위치의 파일이 자동 병합되어 한 라우터가 돼요.', 'src/app을 쓰면 브라우저 경로 앞에 항상 /src가 추가돼요.'], 0, '폴더를 소스 안에 둘 수 있어도 URL prefix와 같은 의미는 아니에요.', '프로젝트는 루트 app/ 또는 src/app/ 구조를 사용할 수 있어요. 서로 자동 병합되지 않으므로 정한 하나를 사용해요.', ['두 트리의 자동 병합을 전제로 두면 어느 파일이 라우트인지 모호해져요.', 'src는 선택 가능한 소스 디렉터리 위치이지 URL segment가 아니에요.']),
      explain: reviewedWrite('라우터 위치 후보 확인', '루트 app/을 쓰지 않을 때 App Router 전체를 둘 수 있는 소스 디렉터리 경로를 적으세요.', ['src/app', 'src/app/'], 'src 폴더 안의 예약 디렉터리 이름을 쓰세요.', 'Next.js는 소스 디렉터리 구조로 src/app을 지원하며 URL에는 src가 자동 추가되지 않아요.'),
      apply: reviewedWrite('선택한 소스 구조의 URL', 'src/app/courses/page.tsx를 선택한 앱 구조에 두었을 때 URL은 무엇인가요?', ['/courses'], 'src와 app은 URL segment가 아니며 courses가 경로예요.', 'src는 파일 정리 위치이고 app은 라우트 루트예요. courses가 실제 URL segment라 경로는 /courses예요.'),
    },
    {
      check: reviewedCheck('public 파일 URL 변환', '로고 파일을 public/logo.svg에 두었습니다. 브라우저에서 요청할 URL을 고르세요.', '/logo.svg', ['/public/logo.svg', '/assets/logo.svg'], 0, '정적 파일 경로에서 public/ 접두사는 URL에 들어가지 않아요.', 'Next.js public 디렉터리 파일은 public 접두사를 뺀 /logo.svg 경로에서 제공돼요.', ['public은 파일 위치이지 브라우저 URL segment가 아니에요.', '해당 파일은 assets 아래가 아니라 public 루트에 있으므로 /assets를 붙이지 않아요.']),
      explain: reviewedWrite('정적 파일 주소 작성', 'public/images/course.svg 파일을 브라우저에서 참조할 URL 경로로 바꾸세요.', ['/images/course.svg'], 'public 폴더 이름을 뺀 나머지 경로를 사용하세요.', 'public 아래의 경로는 브라우저 URL에서 public을 제거해 /images/course.svg가 돼요.'),
      apply: reviewedWrite('파일 위치와 주소 구분', 'public 디렉터리에 포함하지 않는 접두어가 /logo.svg 앞에 붙나요? 붙지 않는다면 무엇인가요?', ['public', 'public/'], '물리 경로 이름 중 URL에 제외되는 폴더예요.', '파일은 public/logo.svg에 있지만 브라우저 주소는 /logo.svg여서 public 접두어를 붙이지 않아요.'),
    },
    {
      check: reviewedCheck('loading.tsx의 역할', 'app/courses/loading.tsx를 추가했습니다. 이 파일이 만들어 주는 것은 무엇인가요?', 'courses 화면이 기다리는 동안 보여 주는 loading UI예요.', ['새 주소 /courses/loading 페이지예요.', 'app이 DB 응답을 자동 재시도하는 서버 작업이에요.'], 1, '파일 이름이 URL인지, 라우트 상태 UI인지 생각해 보세요.', 'loading.tsx는 세그먼트 화면이 기다리는 동안 보여 주는 로딩 상태 UI를 정의해요.', ['예약된 loading 파일 자체가 /loading이라는 URL segment를 추가하지 않아요.', '로딩 UI가 요청 retry 정책이나 서버 동작을 자동 설정하지 않아요.']),
      explain: reviewedWrite('세그먼트 화면 정의', '주소 /courses 화면의 본문과 route entry를 정의하는 예약 파일을 적으세요.', ['page.tsx', 'page'], '로딩 상태 파일이 아니라 page 파일이에요.', 'page.tsx가 /courses 화면을 정의하고 loading.tsx는 기다리는 동안의 UI를 제공해요.'),
      apply: reviewedWrite('대기 중 UI 파일 찾기', 'courses 페이지 로딩 중 스켈레톤을 자동 연결하는 예약 파일 이름은 무엇인가요?', ['loading.tsx', 'loading'], '상태 이름이 들어간 예약 파일이에요.', 'loading.tsx는 해당 segment의 로딩 상태 화면으로 연결되며 /courses/loading 주소를 뜻하지 않아요.'),
    },
    {
      check: reviewedCheck('라우트와 일반 모듈 구분', '강의 데이터를 읽는 `lib/course-data.ts`를 만들었습니다. 이 파일만 추가해 새 브라우저 경로가 생기나요?', '아니요. app 라우트 예약 파일이 아니라 일반 모듈이라 URL을 만들지 않아요.', ['예요. 파일명이 URL 경로 segment가 돼요.', '예요. lib 안의 모든 TypeScript 파일은 public asset URL이 돼요.'], 2, 'Next 라우트 규칙은 app 경로와 예약 파일 이름을 봐요.', '재사용 모듈은 필요한 화면이 import해서 사용할 뿐 page나 route handler 같은 예약 파일이 아니면 URL을 정의하지 않아요.', ['일반 모듈 파일 이름을 app URL로 자동 노출하지 않아요.', 'lib 폴더는 public 정적 자산 디렉터리와 역할이 달라요.']),
      explain: reviewedWrite('재사용 코드 배치', '화면 경로와 분리해 강의 조회 함수를 재사용할 일반 모듈을 예제 구조에서 어느 폴더에 두었나요?', ['lib/course-data.ts'], '예제에서 화면 파일 밖의 domain/data 코드를 둔 경로를 확인하세요.', 'lib/course-data.ts는 재사용 모듈 예시로 route page 파일과 별도이며 그 자체로 URL을 만들지 않아요.'),
      apply: reviewedWrite('일반 모듈의 브라우저 경로', 'lib/course-data.ts를 import 없이 추가하기만 했을 때 새 URL이 생기나요? 정확히 “생기지 않음”으로 답하세요.', ['생기지 않음', '아니요', '없음'], '파일이 app 안의 예약 page 파일인지 확인하세요.', '일반 모듈은 파일을 추가한 것만으로 공개 URL을 만들지 않아요. 화면이 import해 사용해야 해요.'),
    },
  ],
  3: [
    {
      check: reviewedCheck('page 컴포넌트 내보내기', 'app/courses/page.tsx에 화면 컴포넌트를 선언했습니다. App Router 화면으로 제공하려면 어떤 export가 필요하나요?', '화면 컴포넌트를 default export로 내보내요.', ['상수만 named export하면 Next.js가 이를 자동 화면으로 바꿔요.', '파일명만 page.tsx로 만들면 컴포넌트가 없어도 화면이 생성돼요.'], 1, '예약 파일이 요구하는 기본 내보내기 형태를 확인하세요.', 'page.tsx는 화면 컴포넌트를 default export해야 예약 파일의 페이지 계약을 만족해요.', ['named export 상수는 페이지 컴포넌트의 default export를 대신하지 않아요.', '파일명만으로 화면 본문이 생기는 것은 아니므로 컴포넌트를 내보내야 해요.']),
      explain: reviewedWrite('화면 기본 내보내기 키워드', 'Next.js 페이지 컴포넌트에 필요한 “기본 내보내기” 키워드 두 단어를 적으세요.', ['export default', 'default export'], 'named export와 대비되는 JavaScript 구문이에요.', 'page.tsx는 페이지 컴포넌트를 export default로 제공해요.'),
      apply: reviewedWrite('예약 파일 확인', '브라우저 경로 /courses를 화면으로 만들 때 이 폴더의 파일 이름으로 사용할 예약 파일을 적으세요.', ['page.tsx', 'page'], '폴더 segment를 정의하는 파일이에요.', 'app/courses/page.tsx의 page.tsx가 해당 URL의 화면을 제공해요.'),
    },
    {
      check: reviewedCheck('루트 layout 문서 계약', '루트 layout이 하위 페이지를 공통으로 감쌉니다. Next.js root layout에 필요한 HTML 문서 요소는 무엇인가요?', '<html>과 <body>를 반환해요.', ['각 page가 <html>만 각각 반환하면 돼요.', '루트 layout에는 children을 넣지 않고 메타데이터만 반환해요.'], 2, '페이지 바깥 문서의 최상위 요소 두 개를 떠올리세요.', '루트 layout은 <html>과 <body>를 포함하고 children을 body 안에 렌더링하는 문서 뼈대예요.', ['중첩 page마다 문서 요소를 중복 생성하지 않고 root layout이 제공합니다.', '하위 화면이 들어갈 children 자리를 렌더링해야 합니다.']),
      explain: reviewedWrite('하위 화면 삽입 위치', '루트 layout props 중 현재 page 또는 중첩 layout이 들어갈 자식 슬롯 이름은 무엇인가요?', ['children'], 'React 컴포넌트에 포함된 자식 요소를 뜻하는 이름이에요.', 'layout은 children을 문서 body 안에 렌더링해 하위 page를 감싸요.'),
      apply: reviewedWrite('문서 바깥 요소 구성', '기본 문서의 언어와 콘텐츠를 올바르게 감싸려면 루트 layout이 반환해야 하는 요소 쌍을 답하세요.', ['html과 body', '<html>과 <body>', 'html body', 'html/body', '<html>/<body>', 'html, body'], '루트 문서와 그 안의 콘텐츠 영역을 함께 적으세요.', '루트 layout은 html 문서 요소와 body 콘텐츠 영역을 정의하며 그 안에 children을 둬요.'),
    },
    {
      check: reviewedCheck('공유 중첩 layout 상태', 'courses 아래 목록에서 상세 페이지로 client navigation합니다. 두 경로가 같은 활성 courses layout을 공유할 때 일반적으로 기대하는 동작은 무엇인가요?', '공유 layout이 유지되어 공통 메뉴와 해당 레이아웃 상태를 보존할 수 있어요.', ['모든 layout은 navigation마다 강제로 새로고침돼요.', 'layout이 공유되면 서로 다른 page 내용도 자동으로 같아져요.'], 0, '공유되는 segment의 껍데기와 그 아래 교체되는 페이지를 나누세요.', '같은 활성 layout을 공유하는 client navigation은 layout 상태와 UI를 유지할 수 있고 하위 page 내용은 경로에 따라 바뀌어요.', ['공유 layout은 client navigation 동안 무조건 page처럼 매번 교체되지 않아요.', 'layout을 공유해도 자식 page는 각 URL에 맞는 화면을 렌더링해요.']),
      explain: reviewedWrite('layout의 하위 슬롯', '공통 navigation 아래에 각 하위 페이지 내용을 표시하는 layout prop 이름을 적으세요.', ['children'], '레이아웃이 감싸는 자식 콘텐츠예요.', '중첩 layout은 children으로 하위 page를 받아 공유 UI와 함께 렌더링해요.'),
      apply: reviewedWrite('상태 보존 범위 주의', '공유 layout에서 보존될 수 있는 상태는 같은 활성 layout을 유지하는 어떤 동작에서 기대하나요?', ['client navigation', '클라이언트 navigation', '클라이언트 내비게이션', '클라이언트 측 페이지 이동', '클라이언트 측 화면 이동', 'client-side navigation'], '새 문서 요청으로 페이지를 처음 여는 상황과 구분하세요.', '같은 활성 layout 아래의 client navigation에서는 공유 layout 상태가 유지될 수 있지만 새로고침 전반의 영속 저장을 뜻하지는 않아요.'),
    },
    {
      check: reviewedCheck('route group URL 계산', 'app/(learning)/courses/page.tsx에서 괄호 폴더의 이름은 브라우저 URL에 포함되나요?', '아니요. route group 이름은 파일 정리용이며 이 경로는 /courses예요.', ['예요. 괄호를 뺀 /learning/courses가 돼요.', '예요. 괄호 포함 /(learning)/courses가 돼요.'], 1, 'route group 폴더의 괄호 segment는 URL에서 제외돼요.', '괄호로 만든 route group은 디렉터리를 정리하지만 URL에 segment를 추가하지 않으므로 경로는 /courses예요.', ['괄호 폴더 이름은 URL에 segment로 표시되지 않아요.', '폴더의 괄호 문법 자체가 URL에 출력되는 것도 아니에요.']),
      explain: reviewedWrite('그룹 폴더 이름 판별', '예제 app/(learning)/courses/page.tsx에서 URL에 나타나지 않는 폴더 segment 이름을 적으세요.', ['(learning)', 'learning'], '괄호로 감싼 경로 그룹이에요.', 'learning은 route group 이름으로 URL을 추가하지 않으며 화면 경로는 /courses예요.'),
      apply: reviewedWrite('실제 페이지 경로', 'route group을 포함한 app/(learning)/courses/page.tsx가 정의하는 브라우저 경로를 적으세요.', ['/courses'], 'URL에는 괄호 그룹 이름을 넣지 마세요.', '괄호 그룹은 조직용이라 실제 URL path는 /courses예요.'),
    },
    {
      check: reviewedCheck('밑줄 폴더의 보안 한계', 'app/_components/CourseCard.tsx는 라우트 파일이 아닙니다. 밑줄 private folder가 의미하는 바는 무엇인가요?', '자동 라우트 생성을 피하는 파일 조직 규칙이며 접근 권한을 보호하지는 않아요.', ['로그인 없이 파일을 볼 수 없게 만드는 인증 설정이에요.', '폴더 아래의 모든 TypeScript 파일을 URL로 공개해요.'], 2, '라우팅 이름 규칙과 사용자별 인증·인가를 혼동하지 마세요.', 'underscore private folder는 라우트와 충돌하지 않게 내부 코드 파일을 정리하는 방법일 뿐 인증이나 인가를 수행하지 않아요.', ['파일 경로를 private folder에 두는 것으로 사용자 권한 검사가 생기지 않아요.', '밑줄 private folder는 URL 생성에서 제외하려고 사용하는 규칙이에요.']),
      explain: reviewedWrite('라우트 제외 표식 작성', '라우트로 인식되지 않는 폴더 이름을 만들 때 Next.js 파일 규칙상 이름 앞에 붙이는 문자를 적으세요.', ['_', '밑줄', '언더스코어'], '영문 underscore 문자예요.', 'private folder는 폴더 이름을 밑줄로 시작해 라우팅 대상과 구분해요.'),
      apply: reviewedWrite('접근 제어와 폴더 규칙', '밑줄 폴더만으로 사용자 인증·인가가 적용되나요? 적용되지 않는다는 의미를 답하세요.', ['적용되지 않음', '아니요', '보안 권한을 제공하지 않음'], 'URL 제외 규칙이 보안 기능인지 구별하세요.', 'private folder는 라우트 조직 편의를 주지만 보안 접근 제어는 서버의 별도 인증·인가에서 구현해야 해요.'),
    },
  ],
};

// W4-W6 connect navigation and URL input to decisions a learner must make
// while building real routes. Each day has a decision plus two distinct
// explain/apply prompts instead of a repeated topic-name template.
const reviewedRoutingWeeks = {
  4: [
    {
      check: reviewedCheck('내부 경로의 링크', '과정 목록 안에서 /courses/detail 화면으로 이동하는 메뉴를 만듭니다. 전체 문서 새로고침을 요구하지 않을 때 적절한 선택은 무엇인가요?', 'next/link의 Link에 /courses/detail을 href로 전달해요.', ['button 클릭에서 location.href를 직접 바꾸고 링크 의미는 제거해요.', '내부 경로를 항상 외부 사이트용 새 탭 링크로 열어요.'], 0, '사용자가 이동할 목적지를 문서와 키보드에서 링크로 알 수 있어야 해요.', '앱 내부 목적지에는 Link를 사용하면 앵커 링크의 의미와 Next.js client navigation을 함께 사용할 수 있어요. prefetch는 배포 설정과 route 상태에 따라 달라지므로 직접 실행 결과로 단정하지 않아요.', ['클릭 가능한 버튼은 목적지가 있다는 의미를 링크로 제공하지 않고 직접 문서 이동만 강제해요.', '같은 앱의 경로를 새 탭 외부 링크 취급하면 요구한 기본 내부 이동과 맞지 않아요.']),
      explain: reviewedWrite('Link 모듈 경로', 'App Router에서 내부 이동에 사용할 Link를 가져올 모듈 경로를 정확히 적으세요.', ['next/link', "'next/link'", '"next/link"'], 'React의 일반 a 요소와 Next.js 링크 컴포넌트의 모듈을 구분하세요.', 'Next.js 내부 라우트에는 next/link에서 Link를 가져와 사용해요.'),
      apply: reviewedWrite('내부 링크의 목적지', '화면 제목이 “강의 목록”이고 실제 목적지가 /courses입니다. Link에 넣을 href 값을 적으세요.', ['/courses'], '링크 글자가 아니라 주소 경로를 답하세요.', 'href="/courses"가 링크의 실제 이동 목적지를 명시해요.'),
    },
    {
      check: reviewedCheck('동적 링크 입력 검증', '사용자가 입력한 문자열을 강의 slug로 받아 상세 Link를 만듭니다. 허용된 slug인지 확인한 뒤 encodeURIComponent를 적용하는 코드가 갖는 두 역할을 정확히 설명한 것은 무엇인가요?', 'allowlist는 허용된 강의를 고르고 인코딩은 URL 안에서 값의 문법을 안전하게 표현해요.', ['인코딩만 하면 그 강의가 실제로 존재하거나 사용자에게 허용됐음을 보장해요.', 'allowlist는 공백과 & 문자를 URL 규칙에 맞게 바꾸고 인코딩은 접근 권한을 검사해요.'], 1, '값이 허용되는지와 그 값을 주소에 어떻게 표현하는지는 다른 검사예요.', '허용 목록은 해당 slug가 앱에서 유효한 선택인지 확인하고, 인코딩은 주소 문법을 깨지 않게 표현해요. 어느 쪽도 사용자 인가를 대체하지 않아요.', ['인코딩은 URL 문자를 표현할 뿐 데이터 존재나 권한을 보장하지 않아요.', '두 역할이 뒤바뀌었어요. allowlist는 값의 허용 여부, 인코딩은 URL 표현을 다뤄요.']),
      explain: reviewedWrite('목적지 검증 단계', '입력 문자열을 href로 만들기 전에 과정 목록에 실제로 허용된 slug인지 확인하는 검증 방식은 무엇인가요?', ['allowlist', '허용 목록', '허용 목록 검사', '허용값 목록'], '가능한 값을 미리 정해 그 집합에 포함되는지 확인해요.', 'allowlist 검사는 URL 인코딩과 별도로 허용된 목적지 집합에 값이 속하는지 확인해요.'),
      apply: reviewedWrite('경로 세그먼트 인코딩', '검증을 마친 slug 값을 URL path segment 안에 넣기 전 사용할 JavaScript 표준 함수를 적으세요.', ['encodeURIComponent'], '전체 URL이 아니라 개별 경로 값을 인코딩해요.', 'encodeURIComponent는 path segment의 값에 들어가는 문자를 URL 표현으로 인코딩해요. 입력 검증을 대신하지 않아요.'),
    },
    {
      check: reviewedCheck('뒤로 가기와 직접 진입', '상세 화면이 검색 결과에서 열린 경우도 있고 북마크 주소로 바로 열린 경우도 있습니다. 뒤로 가기 기능에 함께 제공할 가장 안정적인 이동 선택지는 무엇인가요?', 'router.back()과 별도로 강의 목록으로 이동하는 명시적 Link를 보여 줘요.', ['모든 사용자에게 브라우저 이전 기록이 있다고 가정하고 router.back()만 제공해요.', '이동은 전부 router.refresh()로 처리해 브라우저 기록을 지워요.'], 2, '주소를 직접 열면 현재 탭의 이전 앱 화면이 없을 수 있어요.', 'router.back()은 브라우저 기록을 따르므로 이전 항목이 보장되지 않아요. 고정된 목록 Link는 직접 진입한 경우에도 목적지를 제공해요.', ['직접 진입에는 앱 내부 이전 기록이 없을 수 있으므로 하나의 동작만으로 복귀를 보장할 수 없어요.', 'refresh는 현재 화면 데이터를 새로 고치는 기능이지 목록으로 이동하는 기능이 아니에요.']),
      explain: reviewedWrite('useRouter의 실행 경계', 'next/navigation의 useRouter를 호출하는 컴포넌트는 Server Component와 Client Component 중 어디여야 하나요?', ['Client Component', '클라이언트 컴포넌트', '클라이언트'], '훅은 브라우저 쪽 이벤트에서 사용해요.', 'useRouter는 Client Component에서 사용하고 모듈 경계에 use client를 둬요.'),
      apply: reviewedWrite('기록이 없어도 가능한 이동', '브라우저 이전 기록에 의존하지 않고 /courses를 열 수 있도록 제공할 요소를 Link 또는 button 중에서 고르세요.', ['Link', '링크', 'next/link Link'], '사용자가 도착할 주소가 정해진 요소예요.', '목적지가 고정된 탐색은 /courses를 href로 제공하는 Link가 의미와 동작을 함께 전달해요.'),
    },
    {
      check: reviewedCheck('현재 위치의 접근성 표시', '현재 주소가 /courses일 때만 과정 메뉴 항목을 현재 위치라고 표시하려 합니다. 보조 기술에도 의미를 전달하는 속성은 무엇인가요?', '해당 활성 링크에 aria-current="page"를 설정해요.', ['aria-current="page"를 메뉴의 모든 링크에 똑같이 설정해요.', '색상만 바꾸면 현재 경로 정보가 보조 기술에도 자동 전달돼요.'], 0, '현재라는 표시는 실제 활성 항목 하나에만 적용하고 의미도 기계가 읽을 수 있게 해요.', '현재 경로에 맞는 링크에 aria-current="page"를 붙이면 시각적 스타일 외에도 현재 페이지 의미를 전달해요.', ['모든 링크가 동시에 현재 페이지일 수 없으므로 활성 목적지와 일치하는 항목만 표시해요.', '색상은 접근성 트리에서 현재 페이지 의미를 제공하지 않아요.']),
      explain: reviewedWrite('현재 페이지 속성', '현재 route와 일치하는 한 메뉴 링크에 설정할 ARIA 속성 이름과 값 조합을 적으세요.', ['aria-current="page"', "aria-current='page'", 'aria-current page'], '현재 위치를 나타내는 속성에 page 값을 사용해요.', '활성 링크에 aria-current="page"를 주어 보조 기술에 현재 위치를 알릴 수 있어요.'),
      apply: reviewedWrite('활성 메뉴 선택 조건', '현재 URL이 /courses/react일 때 href가 /courses인 상위 메뉴 링크에도 무조건 현재 페이지라고 표시해야 하나요? 아니요 또는 표시 조건을 적으세요.', ['아니요', '아니요. 실제 현재 페이지와 일치해야 해요.', '실제 현재 페이지와 일치할 때만 표시'], '상위 메뉴가 선택된 상태와 현재 페이지 자체인지 구분하세요.', 'aria-current="page"는 현재 페이지를 가리키는 한 링크에 사용해야 해요. 단순히 부모 경로라는 이유로 무조건 설정하지 않아요.'),
    },
    {
      check: reviewedCheck('새 탭 외부 링크', '새 탭에서 Next.js 공식 문서를 여는 외부 링크를 작성합니다. 올바른 요소와 보안 관계 속성 조합은 무엇인가요?', '외부 목적지에 a 요소를 쓰고 target="_blank"와 rel="noopener noreferrer"를 지정해요.', ['외부 주소도 next/link의 내부 prefetch가 동작한다고 가정해 Link로 감싸요.', 'button에서 새 탭을 열고 주소와 새 탭 여부는 사용자에게 알리지 않아요.'], 1, '외부 목적지에는 HTML 링크를 쓰고 새 탭을 열면 그 사실도 알려요.', '다른 도메인으로 이동하는 일반 링크는 a 요소로 표현해요. 새 탭을 열 때 rel 안전 속성과 “새 탭” 안내를 둘 수 있어요.', ['Next Link는 내부 라우트용 탐색 컴포넌트라 외부 문서 링크를 내부 화면처럼 다루지 않아요.', '목적지 이동에는 링크 의미를 제공하고 새 탭 동작을 링크 텍스트에 안내하는 편이 명확해요.']),
      explain: reviewedWrite('외부 목적지 요소', 'nextjs.org와 같은 다른 도메인으로 일반 이동할 때 목적지를 표현하는 HTML 요소를 적으세요.', ['a', '<a>', 'anchor', '앵커'], 'href 속성을 가진 기본 HTML 링크 요소예요.', '외부 사이트의 URL은 HTML a 요소의 href로 연결해요.'),
      apply: reviewedWrite('새 탭 열기 속성', '외부 링크를 새 탭에서 열도록 할 때 target 속성에 넣을 값을 적으세요.', ['_blank', 'target="_blank"'], '언더스코어와 blank를 사용해요.', 'target="_blank"는 링크 목적지를 새 브라우징 context에서 열도록 요청해요. 텍스트로 새 탭임을 함께 안내해요.'),
    },
  ],
  5: [
    {
      check: reviewedCheck('한 segment 동적 경로', '강의 slug 하나를 받아 /courses/react-basics에 대응하는 페이지를 만들려 합니다. 올바른 파일 경로와 params 값은 무엇인가요?', 'app/courses/[slug]/page.tsx이며 params.slug는 "react-basics" 문자열이에요.', ['app/courses/[...slug]/page.tsx이며 params.slug는 단일 문자열이에요.', 'app/courses/page.tsx에서 폴더 이름을 자동으로 slug 변수로 받아요.'], 2, '대괄호 하나는 URL segment 하나를 캡처하고 키 이름은 폴더명에서 와요.', 'app/courses/[slug]/page.tsx의 동적 폴더 한 개는 한 segment를 잡아요. /courses/react-basics에서는 slug가 문자열 "react-basics"예요.', ['[...slug]는 한 개 이상의 하위 segment를 배열로 받는 catch-all 규칙이에요.', '동적 폴더가 있어야 해당 값을 경로 params로 받아요. 고정 page 파일은 자동으로 slug param을 만들지 않아요.']),
      explain: reviewedWrite('동적 params 비동기 읽기', 'Next.js 16 App Router의 서버 page에서 Promise<{ slug: string }> 타입 params의 값을 꺼내려면 page를 async로 선언하고 무엇을 적용하나요?', ['await', 'await params', 'await를 사용해요'], 'Promise 결과를 기다리는 JavaScript 키워드예요.', '현재 App Router page에서 params는 Promise이므로 서버 page에서 await params로 값을 읽어요.'),
      apply: reviewedWrite('slug 값 찾기', 'app/courses/[slug]/page.tsx에서 /courses/react-basics에 접근했을 때 params 객체의 키 이름을 적으세요.', ['slug', 'params.slug'], '대괄호 안의 route 이름을 사용해요.', '동적 segment 이름이 slug이므로 params.slug로 접근하고, 값은 URL에서 온 문자열이에요.'),
    },
    {
      check: reviewedCheck('현재 params Promise 계약', 'Next.js 16 App Router 서버 page가 `{ params: Promise<{ courseId: string }> }`를 받습니다. 값을 안전하게 읽는 코드는 무엇인가요?', 'async page 안에서 `const { courseId } = await params`를 실행해요.', ['동기 page에서 `params.courseId`를 바로 읽어요.', 'Client Component에서 `useSearchParams()`로 route params를 가져와요.'], 0, 'params와 search query는 다른 입력이고 현재 page 계약은 비동기예요.', 'Next.js 16의 page params는 Promise예요. 서버 page를 async로 선언하고 await로 해제해요. 오래된 동기 signature를 현재 규칙으로 사용하지 않아요.', ['Promise 객체에 courseId가 바로 있지 않아 현재 타입에서 동기 접근은 맞지 않아요.', 'searchParams는 query string 입력이고 동적 route params를 읽는 page prop을 대신하지 않아요.']),
      explain: reviewedWrite('서버 page의 params 해제', '다음 타입에서 `{ params: Promise<{ id: string }> }`를 받은 async page가 id를 읽을 때 사용하는 await 식을 완성하세요: `const { id } = ____ params`.', ['await'], 'Promise 값을 기다리는 예약어 하나를 적어요.', 'Promise인 params의 값을 destructuring하기 전에 await를 적용해요.'),
      apply: reviewedWrite('비동기 입력 대기', 'page에서 `params`가 Promise임을 타입으로 표현할 때 일반 동적 segment 입력을 감싸는 TypeScript 타입 이름은 무엇인가요?', ['Promise', 'Promise<T>', 'Promise 타입'], '비동기 완료 값을 나타내는 표준 JavaScript 타입이에요.', '현재 route params 계약은 Promise<{ ... }> 형태로 명시해요.'),
    },
    {
      check: reviewedCheck('두 segment의 매개변수', '블로그 경로가 /blog/2026/app-router 구조이고 연도와 글 slug를 각각 받아야 합니다. `app/blog/[year]/[slug]/page.tsx`의 params를 올바르게 설명한 것은 무엇인가요?', 'year와 slug가 각각 문자열 params이며 year는 숫자로 쓰기 전에 형식을 검증해요.', ['params가 배열 하나이고 두 segment를 자동 정수화해요.', '파일 경로의 순서와 무관하게 두 값은 모두 params.slug로 저장돼요.'], 1, 'URL segment는 타입이 숫자처럼 보여도 기본적으로 문자열 입력이에요.', '각 대괄호 이름이 독립된 키로 전달돼요. URL의 year도 문자열이며 숫자 연산 전에 형식·범위를 검사해야 해요.', ['이 경로는 두 개의 이름 있는 동적 segment를 사용하며 자동 배열/숫자 변환 계약은 없어요.', '각 segment 이름이 별도 param key를 만들기 때문에 값이 하나로 덮이지 않아요.']),
      explain: reviewedWrite('연도 입력 기본 타입', '경로 `/blog/2026/app-router`에서 `[year]`가 제공하는 params 값의 기본 JavaScript 타입을 적으세요.', ['string', '문자열'], 'URL segment는 우선 텍스트예요.', 'year라는 이름은 값을 자동 숫자로 변환하지 않아서 params.year는 문자열이에요.'),
      apply: reviewedWrite('게시물 매개변수 이름', '파일 경로의 마지막 동적 폴더가 `[slug]`일 때 해당 글 식별자에 사용할 params key를 적으세요.', ['slug', 'params.slug'], '대괄호 안의 이름과 같아요.', '동적 폴더 `[slug]`의 값은 params.slug에 들어가요.'),
    },
    {
      check: reviewedCheck('catch-all 경로 최소 길이', '문서가 `/docs`보다 아래 경로 segment를 최소 하나 요구합니다. `/docs/a/b`의 경로 부분들을 배열로 받으면서 `/docs` 자체에는 일치하지 않을 폴더 문법은 무엇인가요?', '`[...parts]` 일반 catch-all을 사용해요.', ['`[[...parts]]` optional catch-all을 사용해 `/docs`도 같은 page에서 받아요.', '`[parts]`를 써서 여러 경로 조각이 자동 배열로 합쳐져요.'], 0, '일반 catch-all과 선택적 catch-all에서 대괄호 한 겹 차이가 최소 경로를 바꿔요.', '일반 `[...parts]`는 하나 이상의 segment를 배열로 받고 부모 `/docs` 경로만으로는 일치하지 않아요. `[[...parts]]`는 부모 경로도 선택적으로 받을 수 있어요.', ['optional catch-all은 부모 경로도 처리하므로 요구한 최소 하위 segment 조건과 달라요.', '동적 segment 하나는 한 문자열을 받아 여러 경로 조각을 자동 결합하지 않아요.']),
      explain: reviewedWrite('Catch-all의 반환 자료형', '일반 `[...parts]` 경로에 `/docs/router/files`로 접근할 때 `params.parts`는 문자열 하나인가요, 문자열 배열인가요?', ['문자열 배열', '배열', 'string[]', 'string 배열'], '여러 path segment를 담는 컨테이너예요.', 'catch-all은 경로 조각을 각각 유지하므로 params.parts는 string[]이에요.'),
      apply: reviewedWrite('선택적 catch-all 부모 경로', '부모 `/docs`만으로도 같은 경로 파일에 일치해야 할 때 `[...parts]` 대신 사용할 폴더 이름을 적으세요.', ['[[...parts]]', '[[...slug]]', 'optional catch-all', '선택적 catch-all'], 'catch-all 대괄호 한 쌍을 더 감싸요.', 'optional catch-all인 `[[...parts]]`는 하위 segment가 없는 부모 경로도 일치하게 해요.'),
    },
    {
      check: reviewedCheck('경로 검증과 notFound', '강의 상세 page가 params에서 받은 courseId를 조회합니다. 잘못된 형식과 데이터 없음은 처리하되 단순 URL이 인증이라고 주장하지 않으려면 어떤 흐름이 맞나요?', 'ID 형식을 검증하고 조회 결과가 없으면 notFound()를 사용하며 접근 권한은 별도로 검사해요.', ['courseId가 URL에 있다는 사실만으로 사용자가 그 강의에 접근 가능하다고 판단해요.', '형식이 틀려도 모든 입력을 조회에 넘기고 예외 상세를 화면에 보여 줘요.'], 2, '주소 형식·데이터 존재·사용자 인가는 별개 조건이에요.', 'route param은 외부 입력 문자열이에요. 형식과 존재 여부를 확인하고 notFound()로 없는 경로를 처리할 수 있지만 인증/인가를 대신하지 않아요.', ['주소를 아는 것과 그 데이터를 볼 권한이 있는 것은 다르며 서버 인가 검사가 필요해요.', '검증되지 않은 문자열을 조회하거나 원시 예외를 노출하면 잘못된 입력과 정보 노출을 다루지 못해요.']),
      explain: reviewedWrite('없는 자원의 라우트 처리', 'Next.js에서 현재 route 렌더 흐름을 not-found 화면으로 전환하는 `next/navigation` 함수 이름을 적으세요.', ['notFound', 'notFound()'], '이름이 not-found 경계를 설명하는 함수예요.', '유효한 항목이 없는 경우 notFound()를 호출해 not-found 경로를 표시할 수 있어요.'),
      apply: reviewedWrite('권한 검사의 분리', '사용자가 URL의 courseId를 알고 있다는 사실만으로 비공개 강의 읽기 권한을 얻나요? 권한 확인 여부를 답하세요.', ['아니요', '권한 검사가 별도로 필요해요.', '별도 인가 검사가 필요해요', '별도 접근 권한 확인이 필요해요', 'URL을 안다고 권한을 얻는 것은 아니에요.'], 'URL 식별자와 사용자의 권한은 다른 정보예요.', 'route params는 리소스를 식별할 뿐 권한을 증명하지 않으므로 민감 데이터 조회 전에 인가 검사가 필요해요.'),
    },
  ],
  6: [
    {
      check: reviewedCheck('page searchParams의 형태', 'Next.js 16 App Router page에서 `?tag=react&tag=next`를 읽습니다. props 계약과 중복 키 결과를 올바르게 설명한 것은 무엇인가요?', 'searchParams는 Promise인 plain object이고 반복 키의 값은 string[]일 수 있어요.', ['searchParams는 항상 동기 URLSearchParams 인스턴스이며 getAll()을 바로 호출해요.', '각 query 값은 반복 여부와 상관없이 숫자로 변환된 단일 값이에요.'], 1, 'page prop과 브라우저 URLSearchParams 객체를 구분하고 반복 키를 고려하세요.', '현재 page의 searchParams prop은 Promise인 plain object예요. 값은 단일 string 또는 반복 키의 string[]일 수 있어요.', ['page prop은 브라우저의 URLSearchParams instance와 같은 객체가 아니며 먼저 await해야 해요.', '검색 query는 URL 텍스트로 오므로 자동 숫자 변환되지 않고 반복 키도 배열 형태일 수 있어요.']),
      explain: reviewedWrite('반복 query 값 타입', 'page prop에서 `?tag=react&tag=next`처럼 동일한 키가 여러 번 올 수 있습니다. 이때 tag를 단일 문자열로 가정하지 않을 때 허용해야 할 타입을 적으세요.', ['string[]', '문자열 배열', 'string 또는 string[]'], '같은 키에 해당하는 여러 값을 보존하는 배열이에요.', '중복 query key는 배열이 될 수 있으므로 tag?: string | string[] 형태로 처리해요.'),
      apply: reviewedWrite('page 검색 prop 비동기 처리', 'Next.js 16 page props의 `searchParams`를 읽기 전에 적용할 JavaScript 연산 키워드를 적으세요.', ['await', 'await searchParams'], 'Promise를 기다리는 키워드예요.', 'page에서 Promise인 searchParams를 await한 뒤 plain object 값을 살펴요.'),
    },
    {
      check: reviewedCheck('query 문자열 직렬화', '공개 검색어 `design & accessibility`를 query 값으로 넣어 링크를 만듭니다. `URLSearchParams.set()`과 `toString()`을 사용하는 이유는 무엇인가요?', '값을 query 규칙에 맞게 인코딩해 `&`가 새 매개변수 구분자로 해석되지 않게 해요.', ['입력한 값을 비밀로 암호화해 브라우저 기록에서 숨겨요.', 'set()이 Next 서버에서 검색을 실행하고 결과를 검증해요.'], 2, '문자열 표현의 정확성과 정보의 비밀성은 서로 다른 성질이에요.', 'URLSearchParams는 query 값을 URL 형식에 맞게 직렬화해요. 인코딩은 구조를 보호하지만 암호화나 비밀 보관은 아니에요.', ['인코딩된 URL도 기록·복사·로그에 보일 수 있어 민감값을 숨기는 암호화가 아니에요.', 'URLSearchParams는 주소 값 도구일 뿐 Next 서버 검색이나 학습 사이트 실행을 제공하지 않아요.']),
      explain: reviewedWrite('query 생성의 표준 API', '브라우저 표준에서 query 매개변수 직렬화를 돕는 JavaScript 인터페이스 이름을 적으세요.', ['URLSearchParams'], 'URL과 검색 매개변수 이름이 결합된 객체예요.', 'URLSearchParams의 set과 toString을 사용해 query 문자열을 구성할 수 있어요.'),
      apply: reviewedWrite('같은 키의 값 바꾸기', 'URLSearchParams의 `set("q", value)`는 기존 q 값을 모두 유지해 추가하나요, q의 값을 설정해 기존 값을 대체하나요?', ['대체해요', '기존 값을 대체해요', '하나의 값으로 설정해요', '대체'], '반복 값을 추가하는 append와 차이가 있어요.', 'set은 해당 이름의 값을 하나로 설정하며 같은 이름의 이전 값을 대체해요. append는 반복 키를 추가해요.'),
    },
    {
      check: reviewedCheck('공유 가능한 필터와 URL', '과정 목록 검색에서 공개 검색어와 난이도 필터는 주소 복사·새로고침 후에도 복원돼야 합니다. 가장 맞는 저장 위치는 무엇인가요?', '공유가 필요한 공개 필터를 query string에 두고 page에서 다시 읽어요.', ['모든 조건을 컴포넌트 메모리에만 두고 주소는 고정해요.', '검색 조건을 비밀번호와 함께 query에 넣어 공유 링크로 전달해요.'], 0, '요구사항에 주소 공유와 새로고침 뒤 복원이 포함돼요.', '공유 가능한 공개 검색 상태는 query string에 표현할 수 있어요. 페이지가 그 query를 읽어 결과를 구성하면 URL 자체로 상태를 복원할 수 있어요.', ['메모리 state만 쓰면 복사한 URL이나 새로고침에서 상태를 전달할 수 없어요.', 'query는 공개 주소이므로 비밀 정보와 인증 토큰을 넣을 수 없어요.']),
      explain: reviewedWrite('공유 상태 위치', '주소 복사와 새로고침 후에도 복원해야 하는 공개 검색어를 브라우저 URL의 어느 부분에 표현할 수 있나요?', ['query', 'query string', '검색 매개변수', '쿼리 문자열'], '경로 뒤 물음표 다음에 오는 key=value 영역이에요.', '공개 필터는 URL의 query string으로 표현할 수 있어 공유와 새로고침에 재사용돼요.'),
      apply: reviewedWrite('주소 복원 조건', '새로고침 후에도 검색 상태를 복원해야 합니다. React 컴포넌트가 사라져도 주소에 남아 있는 상태 통로를 무엇이라 부르나요?', ['URL', 'query string', 'URL query', '검색 매개변수'], '브라우저가 표시하고 공유할 수 있는 현재 주소예요.', 'URL에 검색 상태를 담으면 메모리 state가 초기화되어도 페이지가 같은 공개 조건을 다시 읽을 수 있어요.'),
    },
    {
      check: reviewedCheck('페이지 query의 안전한 정규화', '페이지 번호 query는 브라우저에서 온 문자열이고 반복 키는 배열일 수 있습니다. 1–100 범위의 단일 안전 정수만 허용할 때 적절한 처리 순서는 무엇인가요?', '값이 단일 문자열인지 확인하고 Number 변환 후 safe integer·범위를 검사하고 아니면 기본값을 써요.', ['`parseInt(raw)` 결과를 검사 없이 offset 계산에 사용해요.', 'URL query는 서버에서 생성되므로 숫자·범위 검사가 필요 없어요.'], 1, '타입 검사와 숫자 변환 이후에도 전체 입력 조건을 확인하세요.', 'query는 외부 문자열이며 중복 값은 배열이 될 수 있어요. 문자열 여부, 정수 여부, 안전 범위 1–100을 검사하고 거절 시 일관된 기본값을 사용해요.', ['parseInt는 `2junk` 같은 부분 숫자를 받아들이며 정수·허용 범위를 보장하지 않아요.', '주소는 사용자가 바꿀 수 있으므로 서버 렌더 시에도 입력을 신뢰할 수 없어요.']),
      explain: reviewedWrite('안전한 정수 범위 함수', '숫자가 JavaScript가 정확히 표현할 수 있는 정수인지 검사할 때 사용할 Number 함수 이름을 적으세요.', ['Number.isSafeInteger', 'isSafeInteger'], 'Number와 정수 안전성 검사를 결합한 API예요.', 'Number.isSafeInteger(value)는 NaN·소수·안전 범위를 넘는 값 등을 거를 때 사용할 수 있어요.'),
      apply: reviewedWrite('페이지 최대값 설정', '문제의 서비스가 페이지 번호 1부터 100까지만 허용합니다. 101이 들어오면 사용해야 하는 상한 기준을 숫자로 답하세요.', ['100'], '요구사항에 명시된 최대 페이지예요.', '검증은 서비스가 정한 최소 1과 최대 100 안에서만 통과하게 해요.'),
    },
    {
      check: reviewedCheck('URL에서 비밀 값 제외', '과정 검색어는 공유 가능하지만 사용자 인증 토큰은 비밀이어야 합니다. 주소가 브라우저 기록·공유·일부 로그에 남을 수 있다는 점을 고려한 설계는 무엇인가요?', '공개 검색어만 URL에 두고 토큰·비밀번호는 query string에 넣지 않아요.', ['검색어와 access token을 함께 query string에 직렬화해 링크를 공유해요.', 'URLSearchParams가 query 값을 자동 암호화하므로 토큰을 넣어도 돼요.'], 2, 'URL 인코딩은 읽기 어려운 표현일 뿐 접근 통제나 비밀 보관 기능이 아니에요.', 'URL은 기록되거나 복사되고 요청 로그에 포함될 수 있어요. 공개 가능한 검색 조건만 query에 두고 인증 정보는 보호된 인증 경로에서 다뤄요.', ['토큰을 URL에 포함하면 공유 주소와 기록·로그로 전달될 위험이 있어요.', 'URLSearchParams는 값을 인코딩할 뿐 암호화하지 않아요.']),
      explain: reviewedWrite('query에 넣지 않을 정보', 'URL로 공유 가능한 공개 검색어와 달리 주소에 넣지 말아야 하는 인증 정보의 예를 하나 적으세요.', ['비밀번호', '토큰', 'access token', '세션 토큰', '인증 토큰'], '유출 시 사용자를 대신해 접근할 수 있는 값이에요.', '인증 토큰이나 비밀번호는 URL query로 전달하지 않아요.'),
      apply: reviewedWrite('안전한 공유 URL', '북마크로 공유해도 되는 검색어와 필터를 URL에 남기고 비밀값을 제외하는 원칙을 짧게 적으세요.', ['공개 검색 조건만 URL에 넣어요', '공개 검색어만 URL에 둬요', '민감정보를 URL에 넣지 않아요', '토큰 없이 공개 필터만 공유해요'], 'URL을 받은 사람이 누구든 볼 수 있다고 생각해요.', '공유 URL에는 공개 조건만 포함하고 자격 증명이나 개인정보는 포함하지 않아요.'),
    },
  ],
};

// W7-W9 make the rendering boundary, browser interaction, and data contract
// visible in separate daily decisions instead of treating "use client" as an
// application-wide switch.
const reviewedComponentWeeks = {
  7: [
    {
      check: reviewedCheck('App Router의 기본 컴포넌트', 'app/courses/page.tsx에서 데이터 조회 뒤 제목을 반환하지만 `use client`는 선언하지 않았습니다. 파일의 기본 실행 경계를 정확히 설명한 것은 무엇인가요?', 'page는 Server Component라 서버에서 데이터를 읽어 화면을 만들고 그 컴포넌트 코드는 브라우저로 보내지 않아요.', ['page는 항상 Client Component라 모든 코드가 브라우저에서 실행돼요.', 'page는 빌드가 끝난 뒤에만 실행되고 요청 처리나 동적 렌더는 할 수 없어요.'], 0, '파일이 page라는 사실만으로 Client Component가 되지는 않아요.', 'App Router의 page와 layout은 기본 Server Component예요. 서버에서 공개 데이터를 읽어 UI를 만들 수 있고 필요한 상호작용은 작은 Client Component로 분리해요.', ['use client가 없다는 전제에서 기본 경계는 Client Component가 아니에요.', '서버 컴포넌트는 프로젝트 설정과 경로 렌더링 방식에 따라 빌드 또는 요청 처리 중 렌더될 수 있어요.']),
      explain: reviewedWrite('페이지 기본 경계 이름', 'App Router page에 별도 `use client` 선언이 없을 때 기본이 되는 컴포넌트 종류를 적으세요.', ['Server Component', '서버 컴포넌트', '서버 컴포넌트예요'], '기본 경계는 서버 쪽 렌더와 데이터 접근을 허용해요.', 'App Router page는 명시적인 client 경계가 없으면 Server Component예요.'),
      apply: reviewedWrite('서버 페이지가 맡는 일', '공개 강의 데이터를 읽어 제목과 설명을 첫 화면 HTML로 준비하는 page는 Server Component와 Client Component 중 무엇으로 두는 것이 자연스러운가요?', ['Server Component', '서버 컴포넌트'], '화면 상호작용 없이 서버 데이터로 내용을 만드는 상황이에요.', '공개 데이터 조회와 초기 콘텐츠 렌더는 Server Component의 기본 사용 사례예요.'),
    },
    {
      check: reviewedCheck('서버에서 읽는 데이터', '과정 페이지는 강의 공개 목록을 데이터 원천 가까이에서 조회한 뒤 화면으로 보여 줍니다. Server Component 안에서 이 흐름을 구현하는 설명으로 맞는 것은 무엇인가요?', '비동기 Server Component가 조회 함수를 기다리고 결과를 UI props로 전달할 수 있어요.', ['서버에서 실행되는 page도 localStorage를 읽어야 강의 목록을 가져올 수 있어요.', '조회 함수는 브라우저 이벤트에서만 실행되고 Server Component는 정적 문구만 반환해요.'], 1, '데이터 조회 위치와 브라우저 저장소의 실행 환경을 구분하세요.', 'Server Component는 데이터 원천 가까이에서 조회 결과로 UI를 구성할 수 있어요. 브라우저 localStorage는 서버 렌더 시 사용할 수 없어요.', ['localStorage는 브라우저 API라 서버의 초기 렌더 코드에서 사용할 수 없어요.', 'App Router Server Component는 서버에서 비동기 데이터 조회와 UI 렌더를 할 수 있어요.']),
      explain: reviewedWrite('서버 조회를 기다리는 키워드', 'async Server Component에서 `getPublicCourses()`가 돌려주는 Promise 결과를 기다릴 때 사용하는 JavaScript 키워드는 무엇인가요?', ['await'], 'async 함수 안에서 비동기 결과를 기다릴 때 사용해요.', '서버 컴포넌트를 async로 두고 await로 데이터 조회를 기다릴 수 있어요.'),
      apply: reviewedWrite('브라우저 API 위치', '서버 page 함수 안에서 `localStorage.getItem()`을 바로 호출하려 합니다. 이 브라우저 전용 API를 읽어야 하는 환경은 무엇인가요?', ['브라우저', 'Client Component', '클라이언트 컴포넌트'], '서버 렌더 시에는 사용자 브라우저의 저장소가 존재하지 않아요.', 'localStorage는 브라우저에서만 제공되므로 Client Component와 적절한 브라우저 시점에서 다뤄요.'),
    },
    {
      check: reviewedCheck('비밀 모듈 보호', 'API 토큰을 읽는 데이터 모듈이 Server Component에서 사용됩니다. Client Component가 실수로 해당 모듈을 import하지 못하도록 하는 Next.js 권장 경계는 무엇인가요?', '모듈 맨 위에서 `server-only`를 import해 잘못된 client 환경 사용을 빌드 오류로 막아요.', ['NEXT_PUBLIC_ 접두사를 토큰에 붙여 브라우저에서 숨겨요.', '폴더 이름을 `_private`로 바꾸면 모듈 import와 인증이 차단돼요.'], 2, '환경 변수 노출 규칙과 모듈 환경 경계는 서로 다른 보호예요.', 'server-only를 표시한 모듈은 Client Component에서 import할 때 빌드 오류를 일으켜 server 전용 코드가 client module graph로 들어가는 실수를 막아요.', ['NEXT_PUBLIC_ 접두사는 변수를 브라우저 번들에 공개하므로 비밀값에 사용하면 안 돼요.', '밑줄 폴더는 route 생성 규칙이며 보안이나 모듈 실행 경계를 막지 않아요.']),
      explain: reviewedWrite('server-only import 표기', 'Next.js에서 서버 전용 데이터 모듈의 실행 환경을 명시할 때 import하는 패키지 이름을 적으세요.', ['server-only', "'server-only'", '"server-only"'], 'Next가 환경 경계 오류를 보여 주는 데 사용하는 import예요.', '서버 전용 모듈의 최상단에서 `import "server-only"`를 사용해요.'),
      apply: reviewedWrite('공개 환경 변수 접두사 판단', '브라우저 코드로 공개하려는 목적이 없는 API 토큰 변수에 `NEXT_PUBLIC_`을 붙여야 하나요? 붙이지 않는다는 답을 적으세요.', ['아니요', '붙이지 않아요', '붙이지 않음', '사용하지 않아요'], '이 접두사가 Next.js에서 브라우저에 공개하는 의미인지 기억하세요.', 'NEXT_PUBLIC_ 변수는 client bundle에 공개될 수 있으므로 토큰이나 비밀 키에는 사용하지 않아요.'),
    },
    {
      check: reviewedCheck('서버 렌더와 상호작용 분리', '강의 상세 page는 서버에서 제목을 읽고 화면 아래 즐겨찾기 버튼은 클릭에 따라 상태가 바뀝니다. 책임을 나누는 설계는 무엇인가요?', 'page는 Server Component로 유지하고 즐겨찾기 상태·이벤트를 작은 Client Component에 둬요.', ['page 전체에 `use client`를 붙여 server fetch와 모든 UI를 브라우저로 옮겨요.', 'Server Component의 onClick에 서버 함수 참조를 일반 HTML 속성처럼 직접 넣어요.'], 0, '데이터를 준비하는 역할과 클릭 후 상태를 바꾸는 역할을 나눠요.', '정적 제목과 데이터 조회는 Server Component에 두고 실제 브라우저 상태와 이벤트가 필요한 버튼만 Client Component로 만들 수 있어요.', ['전체 페이지를 client graph로 만들면 필요 이상의 브라우저 JavaScript를 보내고 server 전용 경계도 좁히기 어려워요.', '일반 Server Component에서는 브라우저 이벤트 처리기를 직접 연결할 수 없어요.']),
      explain: reviewedWrite('버튼 상태가 필요한 경계', '즐겨찾기 버튼의 useState와 onClick 코드를 둘 컴포넌트 종류를 적으세요.', ['Client Component', '클라이언트 컴포넌트'], '브라우저 상호작용이 일어나는 경계예요.', 'state와 event handler가 필요한 버튼은 Client Component에 두어요.'),
      apply: reviewedWrite('페이지 렌더 역할', '클릭 기능이 없는 강의 제목을 server page에서 데이터와 함께 렌더링할 때 유지할 수 있는 기본 컴포넌트를 답하세요.', ['Server Component', '서버 컴포넌트'], '상호작용이 없으므로 client 경계를 추가할 필요가 없어요.', '데이터와 기본 페이지 표시에는 Server Component를 유지하고 상호작용이 생기는 부분만 별도 경계로 분리해요.'),
    },
    {
      check: reviewedCheck('Client 안에 서버 UI 배치', 'Server page는 서버에서 만든 요약 화면을 클릭으로 열고 닫는 Client Modal의 children으로 넣으려 합니다. 가능한 합성 방식은 무엇인가요?', '부모 Server Component가 Modal과 CourseSummary를 import해 `<Modal><CourseSummary /></Modal>`로 조합해요.', ['Modal Client Component가 CourseSummary의 서버 모듈을 직접 import해요.', 'Client Component를 쓰려면 CourseSummary도 반드시 모든 코드를 client graph에서 실행해야 해요.'], 1, 'Server module import와 이미 렌더할 요소를 children으로 전달하는 경우를 구분하세요.', '서버 부모는 Server Component 결과를 children prop으로 Client Component에 넘길 수 있어요. Client Component가 서버 전용 모듈을 직접 import하는 패턴과 달라요.', ['client module graph에서 직접 import하면 서버 전용 코드 경계를 오염시키므로 서버 부모가 합성해야 해요.', 'Server Component를 client import graph로 옮기지 않고 서버가 만든 children 출력으로 끼워 넣을 수 있어요.']),
      explain: reviewedWrite('children 슬롯 관계', '모달 Client Component 안에 부모 page가 전달한 Server Component 출력이 들어갈 때 사용하는 표준 React prop 이름을 적으세요.', ['children'], '여는 태그와 닫는 태그 사이 자식 요소를 받는 prop이에요.', '서버 page가 `<Modal><CourseSummary /></Modal>`로 작성하면 CourseSummary 결과는 Modal의 children이에요.'),
      apply: reviewedWrite('서버 부모의 컴포넌트 조합', 'Client Modal의 children으로 서버 화면을 제공할 때 두 화면을 함께 조합하는 코드는 어느 쪽 page에서 작성해야 하나요?', ['Server Component', '서버 부모', '서버 page', '부모 Server Component'], '두 모듈을 import해 children을 만드는 바깥쪽 환경이에요.', 'Server Component 부모가 client Modal과 Server Component children을 함께 import해 조합해요.'),
    },
  ],
  8: [
    {
      check: reviewedCheck('use client 선언 위치', 'React state가 필요한 StudyMenu.tsx를 Client Component로 표시하려 합니다. 현재 Next.js 규칙에 맞는 배치는 무엇인가요?', '파일의 첫 지시문으로 `"use client"`를 import 위에 둬요.', ['컴포넌트 함수 안에 `"use client"` 문자열을 반환해요.', 'state 훅을 쓴 뒤 파일 아래쪽에 directive를 선언해요.'], 2, '모듈의 import 순서보다 먼저 처리되는 지시문인지 확인하세요.', 'use client는 module boundary를 선언하므로 파일 시작 부분에서 import보다 위에 놓여야 해요.', ['컴포넌트의 반환 문자열은 모듈 경계 지시문이 아니에요.', '지시문을 훅 사용 뒤나 import 아래에 두면 올바른 최상단 위치가 아니에요.']),
      explain: reviewedWrite('지시문 앞에 오는 항목', '정확한 `"use client"` 경계에서는 다음에 import 구문이 옵니다. import보다 먼저 있는 것은 코드 구문상 무엇인가요?', ['지시문', 'directive', '모듈 지시문', '문자열 지시문'], '영문으로는 directive라고 불러요.', 'use client는 파일 최상단의 directive로 import 문보다 앞에 놓여요.'),
      apply: reviewedWrite('필요한 client 파일 선택', 'state와 클릭 이벤트가 필요한 `StudyMenu`만 상호작용하도록 만들 때 use client를 선언할 위치는 무엇인가요?', ['StudyMenu 파일', 'StudyMenu.tsx', 'StudyMenu 모듈', '상호작용 컴포넌트 파일'], '앱 전체가 아니라 해당 메뉴 코드를 선언하는 파일이에요.', '작은 상호작용 컴포넌트의 파일에 경계를 선언해 필요한 import graph만 client 쪽으로 포함해요.'),
    },
    {
      check: reviewedCheck('버튼 열림 상태 보존', '설명 보기 버튼을 누를 때마다 펼친 상태와 접은 상태가 다음 렌더에서도 유지돼야 합니다. 적절한 상태 선택은 무엇인가요?', 'Client Component의 useState로 expanded 값을 보관하고 setter로 바꿔요.', ['함수 안의 let expanded 변수만 바꾸면 React가 업데이트를 보존해요.', 'Server Component에서 useState를 호출해 서버 요청 사이 상태를 저장해요.'], 0, '재렌더 사이에 보존되어야 하는 값인지 생각하세요.', 'Client Component의 useState는 React 렌더 간 값을 보존하고 setter 호출로 UI를 다시 그려요.', ['지역 let 변수는 React 상태 추적 대상이 아니어서 재렌더 시 보존되지 않아요.', 'Server Component에서는 useState 훅을 사용할 수 없어요.']),
      explain: reviewedWrite('상태 훅 이름', '버튼을 누른 뒤 펼침 boolean 상태를 다음 렌더에도 보관할 때 사용하는 React 훅을 적으세요.', ['useState'], '상태 값을 선언하는 React Hook이에요.', '상호작용 상태는 Client Component의 useState로 관리해요.'),
      apply: reviewedWrite('버튼 접근성 상태 값', '화면 설명이 열렸는지를 버튼에 알려 주기 위해 boolean 상태 `expanded`를 연결할 HTML 속성 이름을 적으세요.', ['aria-expanded', 'aria-expanded="true"', 'aria-expanded 속성'], '열림·닫힘 상태를 보조 기술에 전달하는 ARIA 속성이에요.', '버튼에 aria-expanded={expanded}를 연결하면 상호작용 상태를 보조 기술에도 전달해요.'),
    },
    {
      check: reviewedCheck('이벤트 처리기 실행', 'Client SaveDraftButton의 onClick에는 이미 Client Component 안에서 만든 onSave 함수가 전달됩니다. 사용자가 버튼을 눌렀을 때 이벤트 코드는 어디서 실행되나요?', '브라우저에서 click 이벤트가 발생할 때 Client Component의 onSave가 실행돼요.', ['Server Component를 렌더하는 동안 클릭 처리 코드가 실행돼요.', 'onClick 속성 문자열이 URL을 바꾸고 브라우저 기록을 추가해요.'], 1, '이 예제는 client 쪽에서 만든 callback이 Client Component 안에서 연결되는 경우예요.', 'Client Component 이벤트 처리는 브라우저의 사용자 동작에 연결돼요. 일반 server callback을 RSC props로 그대로 건넨다는 뜻과는 다른 상황이에요.', ['사용자 click 전 서버 렌더 중에 handler를 실행하지 않아요.', '이벤트 처리기는 직접 URL 이동을 뜻하지 않고 버튼 click에 연결된 함수예요.']),
      explain: reviewedWrite('클릭 이벤트 속성', 'HTML button에서 사용자가 클릭했을 때 Client Component 함수를 등록하는 React 속성 이름을 적으세요.', ['onClick', 'onClick 속성'], 'React event 이름은 camelCase예요.', 'Client Component의 onClick에 브라우저 이벤트 callback을 연결해요.'),
      apply: reviewedWrite('이벤트 안 버튼 의미', '저장 함수는 “초안 저장” 작업을 수행합니다. 이동 주소가 없고 현재 화면에서 작업을 실행하는 요소를 Link와 button 중에서 선택하세요.', ['button', '버튼'], '행동을 실행하는 요소인지 주소를 여는 요소인지 구분하세요.', '현재 화면에서 저장 작업을 실행하는 동작에는 button이 맞고 이동 목적지에는 Link를 사용해요.'),
    },
    {
      check: reviewedCheck('document.title 갱신 시점', '문서 제목은 첫 화면 HTML에서도 보이고 브라우저 탭 제목도 Client Component의 title prop을 따라야 합니다. document 접근을 둘 알맞은 위치는 무엇인가요?', 'Client Component가 hydration된 뒤 useEffect에서 document.title을 갱신해요.', ['Server Component 렌더 함수 중 window.document를 직접 읽어요.', '초기 JSX를 만들 때 브라우저가 아직 없더라도 localStorage에 제목을 기록해요.'], 2, 'document는 브라우저 환경 객체이고 첫 화면 HTML을 만들 때에는 브라우저에 아직 없어요.', '초기 제목은 JSX/metadata의 server-compatible 출력으로 만들고 브라우저 문서 동기화는 Client Component의 useEffect에서 해요.', ['서버 렌더에는 window/document 전역이 없어요.', 'localStorage도 브라우저 전용이며 JSX 초기 출력에 대신 쓸 수 없어요.']),
      explain: reviewedWrite('Effect 훅 이름', 'Client Component가 브라우저 document.title과 동기화할 때 사용할 React 훅을 적으세요.', ['useEffect'], '브라우저 외부 시스템과 동기화하는 React Hook이에요.', 'document 같은 브라우저 API와의 동기화는 useEffect 안에서 처리해요.'),
      apply: reviewedWrite('초기 제목 표시', '페이지가 열릴 때 JavaScript가 실행되기 전에도 문서 제목 또는 주요 제목을 볼 수 있게 하려면, 브라우저 Effect와 초기 JSX 중 어디에 핵심 표시 문구를 두어야 하나요?', ['초기 JSX', 'JSX', '서버 렌더 HTML', '초기 HTML'], '초기 화면에서 바로 받을 수 있는 결과를 생각하세요.', 'Effect는 hydration 후 실행되므로 첫 표시 문구는 JSX/초기 HTML에도 있어야 해요.'),
    },
    {
      check: reviewedCheck('client module graph 크기', '과정 페이지 대부분은 정적 소개이고 `RichEditor` 하나만 큰 client 의존성을 사용합니다. 브라우저 JavaScript를 줄이는 경계 선택은 무엇인가요?', 'RichEditor가 필요한 작은 Client Component 파일만 `use client`로 선언해요.', ['루트 layout 전체를 client로 만들어 모든 하위 import를 포함해요.', 'RichEditor가 포함된 모든 경로를 서버 요청으로 바꾸면 client graph가 자동 분리돼요.'], 0, 'use client가 있는 모듈에서 시작하는 import graph의 크기를 생각하세요.', 'client 경계를 필요한 상호작용 파일로 좁히면 나머지 정적 UI와 server rendering을 유지하면서 브라우저 bundle에 포함되는 의존성을 줄일 수 있어요.', ['루트 전체를 client로 만들면 넓은 하위 import graph가 브라우저로 향할 수 있어요.', '서버 요청 전환만으로 client import graph의 모듈 포함 규칙이 자동 변경되지는 않아요.']),
      explain: reviewedWrite('client 경계 넓이', '리치 텍스트 편집기 하나를 위해 루트 레이아웃 전체를 Client Component로 만들기보다 경계를 어느 수준으로 최소화하나요?', ['필요한 컴포넌트', '상호작용이 필요한 작은 컴포넌트', '편집기 컴포넌트', '작은 client component'], '사용자가 조작하는 기능의 가장 작은 적절한 경계를 골라요.', '필요한 곳에만 client 경계를 두어 작은 상호작용과 그 import graph만 브라우저에 포함해요.'),
      apply: reviewedWrite('첫 화면과 client HTML', '처음 직접 방문한 경로에서는 Client Component도 서버에서 HTML을 만들 수 있습니다. 그 HTML을 상호작용 가능하게 하는 다음 브라우저 단계는 무엇인가요?', ['hydration', '하이드레이션', 'React hydration'], '서버 HTML에 브라우저 이벤트를 연결하는 과정이에요.', '초기 방문의 Client Component는 서버가 미리 HTML을 만들 수 있고 브라우저 hydration이 event handler를 붙여요.'),
    },
  ],
  9: [
    {
      check: reviewedCheck('Server에서 Client로 값 전달', 'Server page가 FavoriteButton에 공개 강의 id와 제목을 넘깁니다. RSC 경계를 통과하는 props 계약을 올바르게 설명한 것은 무엇인가요?', 'React가 직렬화할 수 있는 값만 전달하고 버튼에 필요한 공개 필드만 골라요.', ['JSON에 들어갈 수 있으면 모든 함수와 class instance도 client로 전달돼요.', 'server/client 경계를 통과하는 props는 네트워크와 브라우저에 나타나지 않아요.'], 1, '값 타입의 직렬화 가능성과 공개해도 되는 데이터인지 둘 다 확인하세요.', 'Client Component props는 React RSC payload에 직렬화돼 전달돼요. 값이 지원되는 형태인지, 브라우저에 보내도 되는 필드인지 확인해야 해요.', ['함수와 임의 class instance는 자동으로 전달되지 않고 serializable 범위는 JSON과 같다고 단정할 수 없어요.', 'Server Component 코드가 브라우저로 오지 않더라도 props와 렌더 payload는 client로 전달될 수 있어요.']),
      explain: reviewedWrite('경계 값 검사 이름', 'Server Component에서 Client Component로 보내기 전 값이 React의 전송 계약을 만족하는지 확인할 때 사용하는 검토 개념을 적으세요.', ['직렬화 가능성', 'serializable', '직렬화'], 'React가 RSC 경계 데이터 표현으로 바꿀 수 있는지 묻고 있어요.', 'props는 React가 지원하는 형태로 직렬화되어 RSC payload를 통해 전달돼요.'),
      apply: reviewedWrite('client에 보내면 안 되는 값', '화면에는 강의 제목만 필요한데 DB record 전체에 내부 billingToken이 있습니다. client prop에서 제거해야 할 데이터 분류는 무엇인가요?', ['민감 데이터', '비밀 데이터', '내부 데이터', 'billingToken'], '브라우저 사용자에게 노출되어서는 안 되는 내부 값이에요.', 'Client props는 브라우저로 전달될 수 있으므로 민감·비밀 필드를 DTO에서 제거해요.'),
    },
    {
      check: reviewedCheck('일반 함수와 Server Function 구별', 'ClientButton의 서버 저장 동작에 사용할 함수가 필요합니다. 서버의 모든 일반 함수가 client prop으로 넘어가는 것이 아니라면 지원 가능한 예외는 무엇인가요?', '명시적인 `use server` 계약으로 선언한 Server Function을 전달해요.', ['일반 서버 지역 함수를 use client 컴포넌트에서 직접 참조해요.', '함수 본문을 JSON 문자열로 바꾸면 원격 서버 실행이 자동 생성돼요.'], 2, '네트워크 호출 규칙을 갖도록 framework에 명시하는 함수 종류를 생각하세요.', '일반 함수 참조는 Client Component props에서 직렬화할 수 없어요. 명시적인 use server Server Function은 네트워크 호출 가능한 별도 계약이며 입력과 권한을 서버에서 검증해야 해요.', ['일반 지역 함수가 모듈 경계를 넘어 원격 호출 가능해지지는 않아요.', '함수 코드를 문자열로 전달하는 것은 Server Function 계약이나 안전한 호출 경계를 만들지 않아요.']),
      explain: reviewedWrite('Server Function 지시문', '지원되는 서버 호출 함수를 표시하기 위해 함수 본문 시작 부분이나 서버 파일 최상단에서 사용하는 지시문 이름은 무엇인가요?', ['use server', "'use server'", '"use server"'], 'client 경계의 반대 방향에서 지원하는 server function directive예요.', 'use server는 일반 callback과 구별되는 framework Server Function contract를 표시해요.'),
      apply: reviewedWrite('Server Function 입력 신뢰', 'Server Function은 브라우저에서 직접 요청될 수 있습니다. 함수의 인수는 신뢰 입력과 검증된 입력 중 무엇으로 취급해야 하나요?', ['신뢰할 수 없는 입력', '신뢰 입력이 아님', '검증해야 하는 입력', '검증 전 신뢰하면 안 돼요'], '사용자가 요청을 직접 만들 수 있는지 생각하세요.', 'Server Function argument는 client-controlled이므로 유효성 검사와 권한 검증을 거쳐야 해요.'),
    },
    {
      check: reviewedCheck('원본 row 대신 최소 DTO', 'DB 사용자 row에는 name, avatarUrl, passwordHash, billingToken이 있고 ClientProfile은 표시 이름과 아바타만 씁니다. 무엇을 전달하는 편이 안전한가요?', 'name과 avatarUrl만 고른 화면 전용 DTO를 만들어 전달해요.', ['row 객체 전체를 전달하고 브라우저 UI에서 비밀 필드만 숨겨요.', 'passwordHash를 문자열로 인코딩하면 표시 이름과 함께 안전하게 공개돼요.'], 0, '렌더링하지 않는 prop도 브라우저 payload로 전달될 수 있어요.', '필요한 공개 필드만 데이터 접근 계층이나 server page에서 선택한 DTO로 전달하면 민감 필드의 우발적 노출을 줄여요.', ['클라이언트에서 보이지 않게 그리는 것은 해당 값이 브라우저 payload에서 제거된다는 의미가 아니에요.', '인코딩은 비밀 데이터 노출을 막거나 권한을 제한하지 않아요.']),
      explain: reviewedWrite('필요 필드만 전달하는 객체', '서버 내부 원본 대신 화면에 필요한 필드를 선택해 Client Component에 전달하는 표시용 객체 패턴을 무엇이라 부르나요?', ['DTO', 'data transfer object', '표시 DTO', '데이터 전달 객체'], 'Data Transfer Object의 약자예요.', 'DTO는 화면에 필요한 공개 필드만 골라 데이터 경계를 제한해요.'),
      apply: reviewedWrite('서버 비밀 필드 경계', 'client profile이 사용하지 않는 `passwordHash`를 props에서 제거해야 할 곳은 원본 데이터를 client에 넘긴 다음 UI에서 숨기는 곳인가요, server에서 반환 DTO를 만들 때인가요?', ['server에서 반환 DTO를 만들 때', '서버 DTO를 만들 때', 'server에서 DTO를 만들어요', '데이터 접근 계층에서 DTO를 제한해요'], '브라우저 payload가 만들어지기 전에 제거해야 해요.', '필드 최소화는 서버 경계에서 수행해야 민감한 값을 RSC payload에 싣지 않아요.'),
    },
    {
      check: reviewedCheck('날짜를 명시적 화면 형식으로 만들기', '강의 화면은 시작 일자를 ISO 텍스트로 표시하고 경계 타입 변환을 단순하게 유지하려 합니다. 맞는 선택은 무엇인가요?', 'course.startedAt.toISOString()으로 화면 DTO에 문자열 표현을 명시해요.', ['모든 프레임워크 버전에서 어떤 임의 class 객체든 자동 JSON 변환된다고 가정해요.', 'toISOString()은 날짜 문자열이 아니라 사용자 인증을 암호화해요.'], 1, '지원 계약과 제품에서 원하는 전송 표현을 구별하세요.', 'ISO 문자열은 앱이 선택한 표시 DTO 형식이에요. React의 RSC 직렬화 지원 범위와 일반 JSON.stringify 동작은 같은 개념으로 단정하지 않아요.', ['React RSC는 고유 직렬화 계약을 가지며 모든 임의 인스턴스를 지원한다고 가정하면 안 돼요.', 'toISOString은 UTC 기반 날짜 문자열 표현이지 암호화 함수가 아니에요.']),
      explain: reviewedWrite('ISO 문자열 생성 함수', 'JavaScript Date를 ISO 8601 표시 문자열 DTO로 만들 때 호출하는 메서드 이름을 적으세요.', ['toISOString', 'toISOString()'], 'Date 객체의 ISO 표기 메서드예요.', 'toISOString()은 Date의 시점을 ISO 문자열로 표현해요.'),
      apply: reviewedWrite('표시 DTO의 목적', '서버 객체를 client UI로 보내기 전에 `startedAt`을 문자열로 변환하면 화면이 소비할 공개 필드 모양을 어떤 객체로 정리하는 셈인가요?', ['DTO', '표시 DTO', '직렬화 DTO'], '화면 전달용 데이터만 모은 객체예요.', '명시적 DTO는 client 컴포넌트가 필요한 자료와 날짜 표현을 좁게 정의해요.'),
    },
    {
      check: reviewedCheck('hydration 첫 렌더 맞추기', '서버가 만든 첫 HTML에 지역 시각을 포함해야 합니다. Server/Client에서 서로 다른 현재 시각을 초기 렌더마다 계산할 때 발생할 수 있는 문제를 피하는 설계는 무엇인가요?', '서버가 initialTime을 전달하고 Client Component가 같은 값으로 첫 렌더한 뒤 Effect에서 브라우저 현지 시각으로 바꿔요.', ['서버와 브라우저가 각각 new Date().toLocaleTimeString()을 초기 JSX에서 호출해요.', '초기 HTML을 비워 두고 hydration 오류를 무시해요.'], 2, 'hydration은 브라우저 첫 렌더와 서버 HTML을 연결하므로 두 출력이 맞아야 해요.', '서버 initialTime을 첫 state에 넣어 초기 마크업을 일치시켜요. 브라우저별 시각으로 바꾸는 동작은 hydration 뒤 Effect에서 수행할 수 있어요.', ['서버와 브라우저의 시각/locale이 다르면 첫 렌더 결과가 달라 hydration mismatch가 날 수 있어요.', '빈 HTML은 콘텐츠를 숨길 뿐 초기 화면 일치 문제를 제대로 설계하지 않아요.']),
      explain: reviewedWrite('초기 state 입력', '서버 출력과 첫 브라우저 렌더를 같게 하기 위해 Clock Client Component가 props로 받을 문자열 값을 무엇이라 이름 붙였나요?', ['initialTime'], '예제의 첫 출력값을 전달하는 prop이에요.', '서버가 만든 문자열을 initialTime prop으로 전달해 첫 state에 사용해요.'),
      apply: reviewedWrite('첫 클라이언트 렌더 시점', '서버 HTML 다음에 브라우저가 같은 결과를 그리며 event handler를 붙이는 React 과정을 무엇이라 하나요?', ['hydration', '하이드레이션', 'React hydration'], '초기 서버 HTML에 상호작용을 연결하는 단계예요.', 'hydration은 React가 DOM에 event handler를 연결하고 클라이언트 UI를 활성화하는 과정이에요.'),
    },
  ],
};

const reviewedDataWeeks = {
  10: [
    {
      check: reviewedCheck('서버에서 자료 가져오기', '강의 첫 화면은 외부 API에서 공개 과정 자료를 가져와 목록을 만듭니다. 데이터 접근 코드를 browser bundle에서 제외하고 서버 결과로 페이지를 그리는 방법은 무엇인가요?', 'async Server Component에서 fetch를 기다리고 받은 자료로 UI를 반환해요.', ['Client Component의 useEffect에서만 요청할 수 있어 서버 렌더를 사용할 수 없어요.', '브라우저 전역 localStorage에 응답을 넣어야만 서버가 page를 렌더해요.'], 0, 'App Router에서 기본 page 경계와 서버 데이터 접근을 연결해요.', 'Server Component는 async 함수에서 fetch와 await를 사용해 자료를 읽고 서버에서 결과 UI를 만들 수 있어요.', ['Client Component의 useEffect는 브라우저 상호작용이 필요한 경우에 쓸 수 있지만 서버 fetch의 유일한 방법은 아니에요.', '서버 실행 중에는 브라우저의 localStorage가 존재하지 않아요.']),
      explain: reviewedWrite('서버 HTTP 요청 함수', '서버의 공개 API 응답을 요청하고 Next.js에서 확장된 HTTP cache 설정을 받을 수 있는 Web API 이름을 적으세요.', ['fetch', 'fetch()', 'Fetch API'], '브라우저와 서버 모두에서 사용하는 표준 요청 함수예요.', 'Next.js는 서버 fetch에 framework cache와 재검증 옵션 계약을 추가해요.'),
      apply: reviewedWrite('데이터 UI 연결', '서버 page가 `courses` 배열을 조회했습니다. 조회 결과를 목록으로 그리는 React 호출에 전달하는 속성 이름을 한 가지 적으세요.', ['courses'], '서버에서 조회한 결과를 자식 UI 입력값으로 전달해요.', '조회 결과는 `<CourseList courses={courses} />`처럼 화면에 필요한 prop으로 연결할 수 있어요.'),
    },
    {
      check: reviewedCheck('응답 상태 확인', '`fetch(url)`이 404 응답과 JSON 오류 본문을 반환했습니다. JSON 파싱 성공만으로 정상 과정 자료처럼 처리하지 않으려면 무엇을 확인해야 하나요?', '본문을 사용하기 전에 `response.ok`가 true인지 검사하고 실패는 오류 경계로 전달해요.', ['fetch는 모든 4xx·5xx 상태에서 자동 reject하므로 status 검사는 필요 없어요.', 'response.json()이 끝나면 HTTP 요청은 성공한 것으로 간주해요.'], 1, '네트워크 예외와 HTTP 오류 status는 서로 다른 응답 경로예요.', '`fetch`는 네트워크 오류에서는 reject하지만 404 같은 HTTP 응답은 정상적으로 resolve할 수 있어요. 상태 검사를 먼저 해야 해요.', ['HTTP 오류 status는 Response로 전달될 수 있어 `response.ok` 또는 status를 검사해야 해요.', '본문이 JSON이라는 사실은 해당 응답이 성공인지 설명하지 않아요.']),
      explain: reviewedWrite('정상 HTTP 응답 판별', 'fetch 결과에서 2xx 상태인지 확인하는 boolean 속성을 적으세요.', ['response.ok', 'res.ok', 'ok'], 'Response 객체에서 성공 범위를 나타내요.', 'response.ok가 false이면 body 파싱 전에 오류나 도메인별 실패 흐름으로 넘겨요.'),
      apply: reviewedWrite('없는 자료와 요청 실패', 'API가 강의 없음 상태를 HTTP 오류로 돌려줍니다. 그 응답을 빈 성공 강의 객체처럼 표시하지 않으려면 JSON을 쓰기 전에 어느 값을 검증하나요?', ['response.ok', 'HTTP status', '응답 상태', 'status code', '상태 코드'], 'HTTP 응답의 성공 여부를 먼저 확인해요.', '상태를 확인해 실패를 오류 경계나 not-found 결정으로 보낸 뒤 성공 본문을 사용해요.'),
    },
    {
      check: reviewedCheck('GET 요청 메모이제이션 범위', '한 Server Component render pass에서 두 컴포넌트가 같은 URL과 옵션의 GET fetch를 호출합니다. 현재 Next.js가 기본으로 제공할 수 있는 동작은 무엇인가요?', '같은 render pass 안의 일치하는 GET 요청 결과를 메모이제이션으로 공유해요.', ['한 번의 memoization 결과가 이후 모든 사용자 요청의 영구 Data Cache가 돼요.', 'Route Handler도 React component tree이므로 모든 GET fetch가 그 안에서 동일하게 memoize돼요.'], 2, '한 React server render 안에서 요청 중복을 줄이는 기능과 여러 요청에 걸친 cache 저장을 나눠요.', '동일한 GET URL·옵션은 하나의 서버 렌더 과정에서 재사용될 수 있어요. 이 memoization은 요청 사이에 남는 지속 cache가 아니에요.', ['렌더 pass의 memoization은 현재 렌더 공유이며 다음 사용자 요청까지 저장하는 Data Cache가 아니에요.', 'Route Handler는 React component tree 밖에서 실행되므로 동일한 memoization 규칙으로 설명하면 안 돼요.']),
      explain: reviewedWrite('동일 요청 재사용 용어', '하나의 서버 렌더 안에서 일치하는 여러 GET 호출이 결과를 공유하는 요청 단위 동작을 Next.js 문서 용어로 적으세요.', ['memoization', '메모이제이션', 'request memoization', '요청 메모이제이션'], '동일 입력 요청 결과를 한 번의 계산 범위에서 기억해요.', 'GET memoization은 render pass에 범위가 있고 persistent Data Cache와 구별돼요.'),
      apply: reviewedWrite('두 컴포넌트의 동일 조회', '페이지 제목과 요약 카드가 같은 URL·옵션의 공개 GET 데이터를 한 render pass 안에서 각각 요청합니다. 요청 간 저장 여부를 정하기 전에 기본 중복 호출 공유 기능을 무엇이라 부르나요?', ['memoization', '메모이제이션', '요청 메모이제이션'], '영구 Data Cache가 아니라 렌더 중 요청 합치기에 관한 말이에요.', 'Next.js fetch memoization으로 동일 GET 호출을 현재 render pass에서 공유할 수 있어요.'),
    },
    {
      check: reviewedCheck('독립된 요청 시작 시점', '페이지에 과정 목록과 공지 목록이 필요하고 두 API 응답은 서로의 입력값을 사용하지 않습니다. 둘의 기다림을 줄이는 흐름은 무엇인가요?', '각 요청을 먼저 시작하고 결과를 `Promise.all`로 함께 기다려요.', ['과정 응답을 받은 뒤에만 공지 요청을 시작해요.', '두 응답이 독립적이어도 page에서 하나의 데이터만 조회할 수 있어요.'], 0, '두 번째 요청이 첫 번째 결과에 의존하는지 살펴요.', '독립된 요청을 먼저 시작하면 둘이 겹쳐 진행되고 Promise.all에서 함께 기다릴 수 있어요.', ['불필요하게 순차화하면 첫 요청 시간이 두 번째 요청 시작을 막아 전체 대기 시간이 길어져요.', '독립 API 응답을 한 page에서 함께 조회할 수 있어요.']),
      explain: reviewedWrite('함께 기다리는 Promise 함수', '이미 시작한 독립 Promise들의 결과가 모두 필요할 때 사용한 JavaScript 함수 이름을 적으세요.', ['Promise.all', 'Promise.all()'], '모든 입력 Promise가 fulfilled될 때 결과 배열을 반환해요.', 'Promise.all은 독립 요청을 함께 기다리며 하나라도 reject되면 결과 전체가 reject돼요.'),
      apply: reviewedWrite('요청 의존 순서', '과정 API가 먼저 돌려주는 courseId를 다음 재생목록 API의 URL에 사용합니다. 두 fetch를 병렬로 시작할 수 있나요? 아니라면 어느 순서를 유지해야 하나요?', ['순차', '순차 요청', '첫 요청 뒤 두 번째 요청', 'courseId 응답 뒤에 재생목록 요청'], '두 번째 요청의 입력이 첫 번째 응답에서 나와요.', '이 의존 관계에서는 course 응답을 받은 뒤 playlist 요청을 만들어야 해요.'),
    },
    {
      check: reviewedCheck('Cache Components 캐시 계약', '프로젝트 설정에 `cacheComponents: true`가 있고 자주 바뀌지 않는 공개 카탈로그 함수를 캐시합니다. 현재 모델과 일치하는 선택은 무엇인가요?', '함수 안의 `use cache`와 `cacheLife`로 범위와 수명을 명시해요.', ['설정과 지시문 없이 모든 요청 결과가 자동으로 영구 저장된다고 가정해요.', '`cache: "no-store"`를 설정하면 최신 자료가 영구 캐시에 들어가요.'], 1, 'Cache Components를 켠 모델과 이전 fetch cache 모델을 분리해요.', 'Cache Components 환경에서는 `use cache`로 함수·컴포넌트 캐시를 선택하고 `cacheLife`로 수명을 정할 수 있어요.', ['Cache Components는 암묵적인 모든 데이터 영구 저장을 뜻하지 않아요. 캐시는 명시적으로 선택해요.', 'no-store는 framework persistent cache를 피하는 선택이며 영구 캐시를 의미하지 않아요.']),
      explain: reviewedWrite('캐시 함수 지시문', '`cacheComponents: true` 환경에서 함수나 컴포넌트의 출력을 캐시하도록 표시하는 Next.js 지시문을 적으세요.', ['use cache', "'use cache'", '"use cache"'], 'Cache Components에서 사용해요.', '`use cache`는 캐시 범위를 선언하며 설정과 cacheLife 정책도 확인해야 해요.'),
      apply: reviewedWrite('캐시 최신성 정책', '수시간마다 갱신해도 되는 공개 강의 목록을 Cache Components에서 재사용하려 합니다. cacheLife의 역할을 한 문장 또는 핵심어로 적으세요.', ['cache 수명', '캐시 수명', '수명 설정', 'revalidate와 expire 설정', '캐시 만료 설정'], '이 캐시가 얼마나 오래 유효한지 정하는 정책이에요.', 'cacheLife는 use cache로 표시한 함수·컴포넌트 결과의 캐시 수명을 조정해요.'),
    },
  ],
  11: [
    {
      check: reviewedCheck('route loading UI 역할', '사용자가 `/courses`로 이동했을 때 목록 준비 전 안내가 바로 필요합니다. `app/courses/loading.tsx`의 책임을 정확히 설명한 것은 무엇인가요?', 'page 하위 렌더가 준비되는 동안 보일 fallback UI를 제공해요.', ['fetch나 DB 요청의 서버 timeout 값을 설정하고 취소해요.', '오류와 요청 실패를 성공 화면으로 바꿔요.'], 2, '사용자에게 보이는 대기 표현과 데이터 요청 제어를 구분해요.', 'loading.tsx는 page 하위에 자동 Suspense fallback UI를 제공하지만 timeout·요청 취소 설정은 하지 않아요.', ['loading UI는 요청 처리 제한 시간이나 AbortSignal 설정 API가 아니에요.', '실패 복구에는 오류 경계가 필요하고 loading은 대기 상태를 표시해요.']),
      explain: reviewedWrite('라우트 대기 파일 이름', '`app/courses/page.tsx` 하위 화면의 자동 route loading boundary를 만들 때 함께 둘 예약 파일명을 적으세요.', ['loading.tsx', 'loading.js'], '이 파일은 URL이 아니라 fallback 화면을 정의해요.', '같은 route segment의 loading 파일이 page와 하위 렌더를 Suspense로 감싸요.'),
      apply: reviewedWrite('timeout과 대기 UI 구분', '외부 API가 30초 넘게 응답하지 않으면 요청을 중단하려 합니다. loading.tsx를 추가하는 것만으로 이 timeout이 설정되나요?', ['아니요', '아니요, timeout은 별도로 설정해요', 'timeout을 따로 설정해야 해요', '취소/timeout API를 별도로 써요'], 'fallback UI와 네트워크 실행 정책이 다른 책임인지 생각해요.', 'loading.tsx는 UI만 표시하며 request timeout과 취소는 fetch/host 쪽에서 별도로 구현해요.'),
    },
    {
      check: reviewedCheck('Suspense 대기와 오류 구분', '서버 목록 컴포넌트가 비동기 응답을 기다립니다. 느린 동안 fallback을 보여 주되 발생한 예외는 별도의 오류 흐름으로 두는 선택은 무엇인가요?', '비동기 컴포넌트를 React Suspense 경계로 감싸고 오류에는 error boundary를 둬요.', ['Suspense가 모든 서버 예외·404·권한 오류까지 성공 결과처럼 처리해요.', '하위 요청이 느리면 전체 HTML을 빈 문자열로 보내요.'], 0, 'fallback이 다루는 것은 pending 상태예요.', 'Suspense는 경계 안의 suspending 작업이 끝날 때까지 fallback을 표시하고, 실패 복구는 오류 경계의 역할이에요.', ['Suspense는 대기 UI 경계이며 404나 임의 예외 처리용 오류 boundary가 아니에요.', '대기 중 fallback을 내보낼 수 있어 처음부터 빈 문서만 보내는 방식과 달라요.']),
      explain: reviewedWrite('대기 중 대체 UI 용어', 'React Suspense에서 비동기 하위 화면이 준비되기 전 보이는 대체 UI prop 이름을 적으세요.', ['fallback', 'fallback prop'], '해당 JSX property가 대기 화면을 지정해요.', 'fallback은 Suspense 경계 안의 내용이 준비되는 동안 보여 줄 UI예요.'),
      apply: reviewedWrite('실패 복구 경계', 'Suspense 내부의 데이터 요청이 reject되어 예외가 발생했습니다. 대기 fallback이 아니라 어느 종류의 경계를 사용해야 하나요?', ['error boundary', 'Error Boundary', '오류 경계', 'error.tsx'], 'pending state가 끝나고 오류가 난 흐름을 담당하는 UI예요.', '비동기 대기에는 Suspense, 오류 화면과 재시도에는 route error boundary를 각각 사용해요.'),
    },
    {
      check: reviewedCheck('장식 skeleton의 접근성', '시각적인 카드 skeleton은 화면에 남겨 두고 screen reader에는 중복 placeholder를 읽히지 않게 하면서 대기 상태를 알려야 합니다. 알맞은 구성은 무엇인가요?', 'skeleton을 `aria-hidden`으로 감추고 별도 status 문구로 진행 상태를 알려요.', ['전체 영역을 aria-hidden으로 감춰 대기 문구도 없애요.', 'status 없이 회색 placeholder만 두면 보조 기술에도 자동 안내돼요.'], 1, '시각용 모양과 중요한 상태 안내를 따로 검토해요.', 'placeholder는 장식일 수 있지만 로딩 중이라는 상태는 `role="status"` 같은 안내로 전달할 수 있어요.', ['컨테이너 전체를 감추면 상태 안내도 보조 기술에서 사라져요.', '색과 모양만으로 대기 상태를 screen reader가 알 수 있다고 보장할 수 없어요.']),
      explain: reviewedWrite('상태 메시지 역할', '진행 상황이 바뀌었음을 보조 기술에 알리는 HTML 접근성 role 값 한 가지를 적으세요.', ['status', 'role="status"'], '`role` 속성 안에 넣는 상태 영역 이름이에요.', '짧은 진행 안내를 role="status" 영역으로 제공할 수 있어요.'),
      apply: reviewedWrite('placeholder 노출 제어', '카드 모양 회색 placeholder만 감춰 실제 과정 제목을 읽지 않게 하려 합니다. 꾸밈 부분에 붙일 접근성 속성 이름을 적으세요.', ['aria-hidden', 'aria-hidden="true"'], '보조 기술에 장식 요소를 숨기는 속성이에요.', 'aria-hidden은 skeleton 장식에 적용하고 실제 대기 문구는 별도 status로 유지해요.'),
    },
    {
      check: reviewedCheck('느린 하위 영역 분리', '페이지 제목과 검색 도구는 준비됐지만 무거운 강의 요약만 느립니다. 준비된 UI를 막지 않고 요약 대기 상태를 분리하는 설계는 무엇인가요?', '느린 요약 컴포넌트만 가까운 Suspense 경계로 감싸요.', ['루트 화면 전체를 한 번의 느린 요청 뒤에 표시해요.', 'Suspense 안의 요청은 느린 원인을 고치거나 timeout을 자동 설정해요.'], 2, '사용자가 먼저 쓸 수 있는 영역과 실제로 suspend하는 하위 경계를 봐요.', '세밀한 Suspense는 대기 중인 영역에만 fallback을 표시하고 준비된 나머지 UI를 먼저 보낼 수 있어요.', ['상위 전체를 막으면 독립된 준비 완료 UI도 함께 늦어져요.', 'Suspense는 렌더 대기 경계이며 요청 성능·timeout 구현을 대신하지 않아요.']),
      explain: reviewedWrite('준비 완료 UI 표현', '느린 자식과 무관하게 먼저 표시할 수 있는 페이지 제목·탐색처럼 사용 가능한 UI를 어떤 상태의 화면이라고 설명할 수 있나요?', ['준비된 UI', '즉시 표시할 UI', 'fallback 밖의 콘텐츠', '먼저 렌더되는 콘텐츠'], 'suspend하지 않는 경계 바깥 부분을 떠올려요.', 'Suspense 바깥에서 준비된 heading과 도구는 fallback과 함께 먼저 표시될 수 있어요.'),
      apply: reviewedWrite('느린 카드 적용', '강의 목록에서 제목·검색은 빠르고 추천 요약만 느립니다. fallback을 좁혀 감쌀 대상은 페이지 전체인가요, 추천 요약 컴포넌트인가요?', ['추천 요약 컴포넌트', '요약 컴포넌트', '느린 영역', '느린 하위 영역'], '실제 지연이 있는 최소 UI 단위를 고르세요.', '느린 추천 요약 컴포넌트를 Suspense로 감싸면 제목·검색 기능을 먼저 보여 줄 수 있어요.'),
    },
    {
      check: reviewedCheck('스트리밍 실행 요건', 'Suspense fallback 다음에 준비된 서버 HTML을 점진적으로 받는 기능을 정적 export 호스트에 기대해도 될까요?', 'request-time streaming은 이를 전송할 Next.js 서버와 호스트 지원이 필요해요.', ['Suspense JSX만 있으면 정적 파일 호스트도 요청마다 새 서버 응답을 생성해요.', '정적 export가 Route Handler와 임의 Node 코드를 파일 응답에 포함해요.'], 0, '렌더링 경계와 HTTP 응답을 실제로 만들어 주는 배포 환경을 함께 확인해요.', 'Suspense는 점진적으로 보여 줄 렌더 경계를 정의하고 request-time streaming은 서버가 실제 HTTP 응답을 보낼 때 사용할 수 있어요.', ['정적 파일 호스트는 빌드 산출물을 제공하며 임의의 요청별 Next 서버 실행을 추가하지 않아요.', 'Route Handler와 임의 Node 코드는 정적 export HTML 안에 실행 가능한 server endpoint로 들어가지 않아요.']),
      explain: reviewedWrite('점진 HTML 응답 용어', '서버가 먼저 화면 shell을 보내고 준비되는 영역을 뒤이어 전송하는 응답 방식은 무엇인가요?', ['streaming', '스트리밍', '서버 스트리밍'], '렌더 결과를 한 번에 모아 보내는 방식과 구별해요.', '서버 streaming은 응답 가능한 UI 조각을 점진적으로 전송해요.'),
      apply: reviewedWrite('호스팅 한계 적용', '정적 파일만 제공하는 현재 학습 사이트에서 요청마다 Next.js Server Component를 실행해 요약을 스트리밍한다고 안내해도 되나요?', ['아니요', '정적 호스트는 요청별 서버 스트리밍을 하지 않아요', '실행 서버가 필요해요', '개념 예제라고 표시해야 해요'], '사이트에 Node/Next 실행 서버가 실제 있는지 확인해요.', '정적 학습 사이트는 코드 읽기를 제공할 뿐 요청별 Next.js 렌더나 stream 실행을 제공하지 않아요.'),
    },
  ],
  12: [
    {
      check: reviewedCheck('route error 경계 범위', '`app/courses/error.tsx`를 두려 합니다. 현재 route의 runtime 렌더 오류를 fallback으로 표시하는 계약을 정확하게 설명한 것은 무엇인가요?', 'error.tsx는 Client Component 경계로 감싼 하위 page 오류를 처리해요.', ['같은 segment의 layout과 root 초기화·build 오류까지 전부 복구해요.', 'Server Component이므로 use client 없이 브라우저 버튼 handler를 직접 실행해요.'], 1, '해당 경계가 감싸는 하위 트리와 상위 문서·빌드 단계를 구분해요.', 'error.tsx는 Client Component여야 하고 해당 route 경계의 하위 runtime 렌더 오류에 fallback을 제공해요.', ['같은 segment의 상위 layout과 root layout 초기화는 해당 error boundary 안에 들지 않아 별도 global 오류 처리가 필요할 수 있어요.', 'error boundary 파일은 브라우저 재시도 버튼을 제공하려면 client boundary여야 해요.']),
      explain: reviewedWrite('route 오류 파일 이름', 'App Router에서 route segment의 오류 fallback을 정의하는 예약 파일명은 무엇인가요?', ['error.tsx', 'error.js'], '로딩 경계와 이름을 혼동하지 마세요.', 'error.tsx는 해당 route subtree의 runtime 오류를 처리해요.'),
      apply: reviewedWrite('root layout 오류 범위', 'root layout 자체가 초기화되지 않아 같은 segment의 error.tsx도 렌더할 수 없습니다. 더 넓은 문서 경계를 다루는 특별 오류 파일은 무엇인가요?', ['global-error.tsx', 'global-error.js', 'global error'], '루트 app 디렉터리에서 정의하는 오류 문서 경계예요.', 'Root layout 실패는 같은 segment error.tsx의 조상 경계 밖이므로 global-error 처리를 별도로 검토해요.'),
    },
    {
      check: reviewedCheck('현재 오류 retry API', '일시적인 fetch 오류 뒤 Next.js 16.4.3의 route error 화면에서 자식 데이터를 다시 요청하고 렌더하려 합니다. 제공되는 안정 API는 무엇인가요?', '`retry()`를 호출해 error boundary의 자식 요청과 렌더를 다시 시도해요.', ['retry는 현재 route의 외부 DB 내용을 자동 수정하는 write 작업이에요.', '이 API는 아직 실험 기능이라 `unstable_retry`라고 불러야 해요.'], 2, '공식 error.tsx 참조의 현재 prop 이름과 안정화 버전을 확인해요.', 'Next.js 16.4.3에서 error.tsx는 안정 API인 `retry()`를 제공해 실패가 일시적인 경우 boundary children을 다시 가져오고 렌더해요.', ['retry는 다시 시도할 기회일 뿐 저장소 상태를 수정하거나 성공을 보장하지 않아요.', 'Next.js 16.3부터 `retry()`는 안정 API예요. 예전 실험 이름 `unstable_retry`와 구분하세요.']),
      explain: reviewedWrite('오류 재시도 함수', '현재 과정 기준에서 `app/courses/error.tsx`가 다시 조회를 시도할 때 호출하는 함수 prop 이름을 적으세요.', ['retry', 'retry()'], '버튼의 onClick에 연결하는 함수예요.', 'retry()는 경계 자식의 fetch와 렌더를 다시 시도해요.'),
      apply: reviewedWrite('일시 실패 여부 판단', 'DB에 필수 과정 레코드가 빠진 영구 오류입니다. error 화면의 retry만 반복하면 그 데이터 누락이 자동으로 복구되나요?', ['아니요', '아니요, 원본 데이터를 고쳐야 해요', 'retry는 DB를 수정하지 않아요'], '렌더를 다시 시도하는 것과 손상된 원본을 고치는 일을 구별해요.', 'retry는 다시 불러오는 UI 행동이지 영구 데이터 오류의 원인을 수정하지 않아요.'),
    },
    {
      check: reviewedCheck('notFound와 streaming status', '과정이 없을 때 `notFound()`를 호출합니다. 화면 처리와 HTTP 상태 계약을 정확히 설명한 것은 무엇인가요?', 'not-found UI와 noindex를 적용하고, 이미 streaming이 시작된 뒤라면 시작된 HTTP status는 200일 수 있어요.', ['streaming 시점과 무관하게 항상 응답 헤더를 404로 소급 변경해요.', '모든 fetch·권한·서버 오류도 성공 빈 과정으로 바꾸고 검색 색인을 허용해요.'], 0, 'notFound의 UI 처리와 이미 전송한 HTTP 헤더의 변경 가능성을 분리해요.', 'notFound는 route render를 멈추고 not-found UI 및 noindex를 적용해요. streaming 전에 호출되면 404를 보낼 수 있지만 streaming이 시작된 뒤의 응답 status는 200으로 유지될 수 있어요.', ['이미 시작된 HTTP streaming 응답의 status를 사후 변경할 수 없으므로 항상 404라고 단정하면 안 돼요.', 'notFound는 없는 리소스 흐름이지 권한 거부·네트워크 오류를 성공 상태로 감추는 공통 예외 처리기가 아니에요.']),
      explain: reviewedWrite('검색 제외 metadata 값', 'Next.js notFound UI와 함께 검색 엔진에 색인하지 말라는 robots metadata 값은 무엇인가요?', ['noindex', 'noindex tag', 'robots noindex'], '검색 로봇 지시를 나타내는 문자열이에요.', 'notFound()는 `<meta name="robots" content="noindex" />`를 추가해요.'),
      apply: reviewedWrite('존재하지 않는 과정 처리', '과정 조회가 성공했지만 해당 ID가 없습니다. 조회 실패 예외나 무권한 응답이 아니라 리소스 없음 화면으로 안내하기 위해 호출하는 함수를 적으세요.', ['notFound', 'notFound()', 'not found'], 'Next navigation API에서 가져오는 함수예요.', '검증된 리소스 없음은 notFound()로 해당 segment의 not-found UI에 연결해요.'),
    },
    {
      check: reviewedCheck('빈 성공 결과 구분', 'API 요청은 성공했으며 과정 배열이 비어 있습니다. 네트워크 오류로 오해하지 않게 보여 줄 상태는 무엇인가요?', '유효한 빈 응답용 EmptyCourses 안내를 표시해요.', ['정상 빈 목록도 항상 서버 오류 화면으로 보내요.', '자료가 없을 때 숨기기 위해 HTTP 실패를 무시하고 임의 더미 항목을 채워요.'], 1, '요청이 성공했는지와 반환된 배열의 개수가 0인지 분리해 확인해요.', '성공한 빈 결과는 사용자가 다음 행동을 알 수 있는 empty state이고 fetch 실패는 별도의 error 상태예요.', ['빈 배열은 API 성공 응답일 수 있으므로 그 자체만으로 server error가 아니에요.', 'HTTP 실패를 숨기거나 존재하지 않는 자료를 더미로 채우면 사용자의 실제 데이터 상태를 왜곡해요.']),
      explain: reviewedWrite('정상 결과 없음 화면', '요청은 성공했지만 표시할 과정이 하나도 없을 때 보여주는 UI 상태를 간단히 부르는 이름은 무엇인가요?', ['empty state', '빈 상태', 'empty UI', '빈 결과 상태'], '오류 상태와 반대인 정상 응답의 화면이에요.', 'empty state는 유효한 조회 결과가 비었음을 알리고 다음 행동을 제안해요.'),
      apply: reviewedWrite('오류와 빈 배열 판단 순서', '빈 배열 여부를 검사하기 전에 HTTP 오류를 성공으로 처리하지 않으려면 먼저 어떤 응답 정보를 확인해야 하나요?', ['response.ok', 'HTTP status', '응답 상태', 'status code', '상태 코드'], '본문 모양 검사보다 응답 상태를 먼저 확인해요.', 'HTTP 상태가 성공인지 확인한 다음 JSON 배열이 비었는지 판단해요.'),
    },
    {
      check: reviewedCheck('운영 식별자와 오류 상세 분리', 'Server Component에서 예외가 발생했고 오류 boundary에서 사용자가 문의할 수 있는 코드를 보여 주려 합니다. 무엇을 노출하는 편이 안전한가요?', '일반 사용자 안내와 제한된 서버 로그에서 찾을 수 있는 digest 식별자를 사용해요.', ['원본 stack trace와 요청 token을 그대로 화면에 출력해요.', '인증 헤더 전체를 digest 대신 보여 줘야 지원팀이 로그를 찾아요.'], 2, '사용자 메시지와 운영자가 오류를 찾는 상관관계 값을 분리해요.', 'Production에서 Server Component 오류 내용은 일반화될 수 있고 digest로 서버 로그의 같은 오류를 찾을 수 있어요. 원문 비밀값은 사용자 화면에 보내지 않아요.', ['원본 예외와 stack trace에는 경로·입력·secret이 포함될 수 있으므로 안전 안내에 그대로 붙이지 않아요.', '인증 token은 진단 식별자가 아니며 공개 화면이나 로그에 노출하면 안 돼요.']),
      explain: reviewedWrite('같은 서버 오류 찾기', 'Next.js가 오류를 server log와 연결할 때 사용할 수 있게 Error에 제공하는 자동 식별자 속성은 무엇인가요?', ['digest', 'error.digest'], '원본 오류 메시지를 공개하지 않고 오류 발생을 찾는 해시 식별자예요.', 'error.digest는 같은 서버-side error를 로그에서 확인하는 데 쓸 수 있어요.'),
      apply: reviewedWrite('오류 fallback 문구', '브라우저 화면에는 내부 예외 대신 짧고 안전한 사용자 문구를 보여 주려 합니다. 원문 stack trace와 token을 복사할까요, 일반 오류 안내를 제공할까요?', ['일반 오류 안내', '안전한 오류 메시지', '요청을 처리하지 못했다는 안내', 'stack trace는 공개하지 않아요'], '사용자에게 필요한 다음 행동만 알리는 문구를 선택해요.', '일반 안내는 상황을 설명하고 digest 같은 제한된 식별자는 별도의 지원 경로로 사용할 수 있어요.'),
    },
  ],
  13: [
    {
      check: reviewedCheck('고정 페이지 metadata 위치', '과정 카탈로그의 title과 description은 모든 방문자에게 같고 요청별 데이터를 쓰지 않습니다. 적절한 App Router 구현은 무엇인가요?', 'page.tsx 또는 layout.tsx의 Server Component에서 정적 metadata 객체를 export해요.', ['Client Component useEffect로 document.title만 바꾸어 첫 응답 metadata로 사용해요.', '매 요청마다 같은 문자열을 조회하도록 generateMetadata를 호출해요.'], 0, 'metadata가 실제로 request에 따라 바뀌는지 살펴요.', '고정된 page metadata는 Server Component page/layout의 정적 객체로 선언해요.', ['브라우저 effect는 첫 server response의 metadata를 대신하지 않아요.', '정적 메타데이터에 동적 조회 함수를 붙일 필요가 없어요.']),
      explain: reviewedWrite('metadata 정적 export 이름', 'Next.js page/layout 파일에서 고정된 제목·설명을 반환할 때 export하는 정적 객체의 이름을 적으세요.', ['metadata', 'metadata 객체', 'Metadata'], 'generateMetadata 함수와 구별해요.', '고정 metadata는 page 또는 layout의 `metadata` 객체에서 선언해요.'),
      apply: reviewedWrite('고정 공개 과정 설명 배치', '요청마다 바뀌지 않는 `/about` 페이지 설명을 선언하려 합니다. page/layout 파일에서 어떤 종류의 API로 내보내나요?', ['Server Component metadata 객체', 'metadata export', 'page 또는 layout metadata', '정적 metadata'], '브라우저 UI hook 대신 route metadata API를 생각해요.', '고정 설명은 Server Component page/layout의 정적 metadata export로 선언해요.'),
    },
    {
      check: reviewedCheck('동적 metadata와 Promise params', '`/courses/[slug]`마다 다른 제목을 만듭니다. Next.js 16 App Router에서 경로 값을 읽고 metadata를 반환하는 계약은 무엇인가요?', 'async generateMetadata에서 Promise params를 await하고 해당 과정의 metadata를 반환해요.', ['Client Component의 useEffect에서 params를 읽어 metadata export를 바꿔요.', '파일 경로만으로 모든 과정 slug의 서로 다른 제목이 자동 생성돼요.'], 1, 'metadata 함수의 서버 실행 위치와 현재 async params 계약을 확인해요.', '현재 page params는 Promise예요. 동적 metadata는 async generateMetadata에서 값을 await한 뒤 반환해요.', ['Client effect의 document.title 변경은 server metadata를 대체하지 않아요.', 'slug마다 다른 실제 제목 자료는 data source에서 읽어야 해요.']),
      explain: reviewedWrite('경로별 metadata 함수', '동적 경로값이나 외부 자료에 따라 Metadata 객체를 만드는 App Router 함수 이름은 무엇인가요?', ['generateMetadata', 'generateMetadata()', '동적 metadata 함수'], 'export const metadata와 구별되는 함수예요.', '동적 title·description은 `generateMetadata`에서 반환할 수 있어요.'),
      apply: reviewedWrite('클라이언트 effect 대체', 'slug마다 검색 제목을 다르게 해야 하지만 useEffect로 document.title만 설정했습니다. request metadata를 만들 Next API를 적으세요.', ['generateMetadata', 'async generateMetadata', '서버 generateMetadata'], 'App Router metadata는 Server Component 경계에 있어요.', '`generateMetadata`에서 await params와 공개 course 자료를 읽어 route별 metadata를 반환해요.'),
    },
    {
      check: reviewedCheck('페이지별 canonical 절대 주소', '여러 과정의 canonical link가 상대 경로입니다. 대표 절대 URL을 구성하는 설정과 path 정책의 올바른 조합은 무엇인가요?', 'root metadataBase에 공개 origin을 두고 각 과정에 해당하는 canonical path를 지정해요.', ['metadataBase 없이 상대 URL은 항상 현재 사용자의 도메인으로 안전하게 해석돼요.', '모든 과정 canonical을 홈 `/` 하나로 고정해요.'], 2, '절대 URL 기준과 각 콘텐츠의 대표 경로를 따로 확인해요.', '상대 URL metadata에는 metadataBase가 필요하고 각 canonical은 해당 page의 실제 대표 URL이어야 해요.', ['metadataBase 없는 relative URL 기반 필드는 build 오류가 될 수 있어요.', '모든 route를 홈으로 지정하면 대표 콘텐츠와 canonical 값이 어긋나요.']),
      explain: reviewedWrite('metadata 절대 URL 기준', 'canonical이나 Open Graph image의 상대 경로 앞에 origin을 붙이는 Metadata 설정 이름을 적으세요.', ['metadataBase', 'metadata base'], 'root metadata에서 URL 기반 metadata에 정하는 기준이에요.', 'metadataBase는 URL metadata field에 필요한 절대 기준 주소를 제공해요.'),
      apply: reviewedWrite('과정별 canonical path', '`/courses/react?utm_source=mail`과 `/courses/react`가 같은 공개 콘텐츠입니다. 추적 query가 빠진 대표 canonical에 남겨야 할 과정 경로를 적으세요.', ['/courses/react', 'courses/react'], '콘텐츠를 대표하는 path만 떠올려요.', '정책에서 추적용 query를 제외한 `/courses/react`를 canonical로 지정할 수 있어요.'),
    },
    {
      check: reviewedCheck('Open Graph 공개 범위', '강의 상세 링크를 외부 메신저에서 공유할 때 preview title·description·image를 보여 줍니다. Open Graph에 알맞은 값은 무엇인가요?', '실제 과정 주제와 일치하는 누구나 볼 수 있는 제목·요약·대표 이미지예요.', ['로그인 cookie와 사용자별 학습 기록을 image metadata에 포함해요.', '비공개 dashboard 내용을 모든 과정의 공유 카드에 보여 줘요.'], 0, '외부 플랫폼 미리보기는 로그인하지 않은 사람도 읽을 수 있어요.', 'Open Graph metadata는 공개 공유 정보이므로 실제 page 주제와 일치하고 개인 비밀을 포함하지 않아야 해요.', ['공유 metadata는 session 접근 통제가 아니므로 private data를 넣지 않아요.', 'preview 내용은 링크 방문 후 화면에 표시되는 과정과 맞아야 해요.']),
      explain: reviewedWrite('공유 미리보기 객체', 'title·description·image URL을 소셜 공유 preview metadata로 정의하는 Next.js Metadata 필드 이름을 적으세요.', ['openGraph', 'Open Graph'], 'camelCase metadata property예요.', 'Open Graph 공유 속성은 Metadata 객체의 `openGraph` 필드에 있어요.'),
      apply: reviewedWrite('개인 기록 metadata에서 제외', '과정 소개 링크에 공개 제목은 넣을 수 있지만 비공개 학습 기록은 어느 metadata 범위로 내보내면 안 되나요?', ['Open Graph metadata', '공유 metadata', '외부 preview metadata', '공개 공유 카드'], '검색·메신저가 로그인 없이 읽는 head 값이에요.', 'Open Graph 등 공개 metadata에는 사용자별 진도·오답·token을 넣지 않아요.'),
    },
    {
      check: reviewedCheck('metadata/page fetch memoization 범위', '`generateMetadata`와 `Page`가 같은 URL·옵션의 fetch를 씁니다. 문서 계약을 과장하지 않는 설명은 무엇인가요?', '동일 fetch는 렌더 안에서 memoized될 수 있지만 custom DB 함수나 사용자 간 영구 cache를 뜻하지 않아요.', ['custom database 호출도 모두 자동으로 memoize되어 모든 사용자에게 영구 보존돼요.', 'metadata fetch는 page fetch와 상관없이 반드시 별도 외부 요청을 만들어야 해요.'], 1, '동일 render의 fetch와 여러 요청에 걸친 persistent cache를 나눠요.', '같은 fetch 요청을 metadata와 page에서 memoize할 수 있어요. 이를 모든 DB helper나 사용자 간 장기 cache로 확대하지 않아요.', ['문서의 memoization 범위는 fetch 계약이지 arbitrary DB access 전부가 아니에요.', '동일 데이터 fetch는 metadata와 page 사이에서 memoized될 수 있어요.']),
      explain: reviewedWrite('렌더 단위 요청 재사용', '현재 렌더 범위에서 같은 입력의 fetch 결과를 재사용하는 동작을 무엇이라고 하나요?', ['memoization', '메모이제이션', 'request memoization'], '다음 방문자까지 저장하는 persistent cache와 달라요.', 'Request memoization은 일정한 렌더 범위 안에서 동일 fetch를 공유해요.'),
      apply: reviewedWrite('본문과 제목 route 일치', '본문에는 `slug=python` 과정이 보이고 metadata는 기본 `slug=react` 제목을 반환합니다. 두 경로에서 동일하게 await할 동적 route prop 이름은 무엇인가요?', ['params', 'await params', 'Promise params'], '현재 요청의 dynamic segment를 전달해요.', 'Page와 generateMetadata에서 같은 Promise params.slug를 읽어 본문·title 대상 과정을 일치시켜요.'),
    },
  ],
  14: [
    {
      check: reviewedCheck('Route Handler와 page URL 분리', '화면 `/courses`와 JSON endpoint를 함께 둡니다. App Router에서 두 응답 경계를 명확히 나누는 구현은 무엇인가요?', '`/courses` page와 `/api/courses` Route Handler를 별도 route segment에 둬요.', ['같은 segment의 page.tsx와 route.ts가 같은 URL을 동시에 소유해요.', 'route.ts가 React page이므로 API JSON과 HTML을 자동 함께 반환해요.'], 0, '화면 component와 HTTP Request·Response endpoint의 목적과 경로를 보세요.', 'Route Handler는 HTTP server handler예요. page와 충돌하는 같은 route가 아니라 명시된 API 경로에 둬요.', ['같은 경로가 page UI와 별도 route 응답으로 동시에 겹치면 안 돼요.', 'route.ts는 React component가 아니라 Request handler예요.']),
      explain: reviewedWrite('HTTP handler 파일', 'App Router에서 GET·POST 같은 HTTP 요청 함수를 export하는 예약 파일 이름은 무엇인가요?', ['route.ts', 'route.js', 'route 파일'], 'page.tsx와는 다른 예약 파일이에요.', '`route.ts`는 해당 route의 HTTP Request·Response handler를 제공해요.'),
      apply: reviewedWrite('API endpoint 파일 위치', '공개 JSON 목록 URL이 `/api/courses`입니다. route handler를 선언할 App Router 파일 경로를 적으세요.', ['app/api/courses/route.ts', 'app/api/courses/route.js', 'api/courses/route.ts'], 'api와 courses 폴더 뒤에 두는 예약 파일이에요.', 'GET API `/api/courses`는 `app/api/courses/route.ts`에 정의할 수 있어요.'),
    },
    {
      check: reviewedCheck('HTTP method export와 호출 조건', '`route.ts`에 GET과 POST를 export합니다. 이 함수가 실행되는 조건을 정확하게 설명한 것은 무엇인가요?', '실제 Next.js 서버가 해당 endpoint로 들어온 같은 HTTP method 요청을 받을 때예요.', ['React component 이름이 GET이면 page 렌더 때 자동 실행돼요.', 'POST export만 있으면 정적 hosting이 새 자료 요청을 저장해 줘요.'], 1, '함수 export로 route를 정의하는 일과 server runtime을 배포하는 일을 구분해요.', 'GET·POST export는 method별 HTTP request handler이고 서버 요청 도착 때 실행돼요.', ['Component의 이름과 HTTP method route export는 다른 API예요.', '정적 hosting은 handler나 저장소를 포함하지 않아요.']),
      explain: reviewedWrite('과정 목록 조회 method', '자료 목록을 읽는 Route Handler의 HTTP method export 이름을 대문자로 적으세요.', ['GET', 'GET()'], '일반적인 조회 요청 method예요.', '`export async function GET(request)`는 endpoint의 GET 요청을 처리해요.'),
      apply: reviewedWrite('새 자료 생성 method', '동일 API URL로 과정 생성 요청을 처리할 별도 route handler method 이름을 적으세요.', ['POST', 'POST()'], '요청 body를 받는 생성·변경 요청에서 쓰여요.', '새 과정 생성 handler는 `export async function POST(request)`로 정의할 수 있어요.'),
    },
    {
      check: reviewedCheck('상태와 JSON body의 분리', '`GET /api/courses/unknown`에서 해당 과정이 없습니다. 호출자가 HTTP 실패로 해석하도록 할 response는 무엇인가요?', '404 status와 안정된 JSON error body를 함께 반환해요.', ['error 필드를 넣되 HTTP 200으로 성공 status를 그대로 둬요.', '404를 보내면서 정상 course data도 본문에 채워요.'], 2, 'JSON body와 status code가 각각 알려 주는 정보를 확인해요.', 'Response body의 `error`만으로 status가 바뀌지 않으므로 resource 없음은 HTTP 404로도 표현해요.', ['200은 성공 결과로 보이므로 client가 실패를 놓칠 수 있어요.', '404와 정상 자원 representation은 서로 맞지 않는 계약이에요.']),
      explain: reviewedWrite('JSON response 메서드', 'data object와 status option으로 JSON HTTP response를 만드는 표준 Web API static method를 적으세요.', ['Response.json', 'Response.json()'], '요청 body를 읽는 Request.json과 반대쪽이에요.', '`Response.json(data, { status })`로 JSON response를 반환해요.'),
      apply: reviewedWrite('리소스 없음 상태 code', 'JSON 문법과 query는 정상이나 요청한 course slug가 저장소에 없습니다. 반환할 HTTP 상태 code를 적으세요.', ['404', '404 Not Found', 'Not Found'], '입력 규칙 오류가 아니라 해당 대상이 없는 경우예요.', 'resource가 없으면 404 Not Found로 표현해요.'),
    },
    {
      check: reviewedCheck('요청 파싱과 schema 단계', 'POST body parsing은 성공했지만 title이 배열이고 허용 길이를 넘었습니다. 안전한 처리 순서는 무엇인가요?', 'request body를 unknown 값으로 검증하고 schema·도메인 규칙 통과 후에만 저장해요.', ['JSON 파싱에 성공했으므로 body를 검증 없이 DB 함수에 넘겨요.', '입력 오류여도 생성 성공인 201을 먼저 반환해요.'], 0, '문법으로 읽을 수 있는 JSON인지와 업무 규칙을 만족하는 값을 나눠요.', 'request.json()은 JSON 값을 parsing할 뿐 title 타입이나 허용 길이를 검증하지 않으므로 schema 단계가 필요해요.', ['유효한 JSON 안에도 숫자·배열·비허용 값이 들어올 수 있어요.', '201은 resource를 실제 생성한 뒤 반환하는 성공 상태예요.']),
      explain: reviewedWrite('runtime 요청 검증', '요청 JSON field·type·길이를 저장 전에 확인하는 server 측 절차는 무엇인가요?', ['schema 검증', '입력 검증', 'runtime validation', '유효성 검사'], 'JSON syntax parsing 이후에 실행하는 단계예요.', '서버가 schema와 domain constraints로 request 값을 runtime에서 검증해요.'),
      apply: reviewedWrite('Malformed JSON 처리', 'request body가 중괄호를 닫지 않아 request.json() parsing이 실패했습니다. 성공 data를 반환하는 대신 어떤 요청 오류 범주로 응답하나요?', ['400', '400 Bad Request', 'invalid_json', '잘못된 JSON 요청 오류'], '요청 문법 오류는 처리할 수 없는 client 입력이에요.', 'Malformed JSON은 안전한 invalid_json 오류 code와 400 Bad Request로 돌려요.'),
    },
    {
      check: reviewedCheck('Static export Route Handler 지원', '정적 export에 고정된 과정 catalog JSON을 포함하려 합니다. Next.js 지원 조건을 올바르게 설명한 것은 무엇인가요?', 'force-static GET 결과는 build 때 정적 파일이 될 수 있지만 요청별 입력에 반응하는 API는 안 돼요.', ['POST handler가 배포된 static folder에서 매 요청마다 실행돼 데이터를 저장해요.', '정적 JSON 파일은 request cookies를 읽어 로그인 사용자별 응답으로 바뀌어요.'], 1, 'build-time에 미리 만들 수 있는 GET과 incoming request runtime을 구분해요.', 'Static export는 force-static으로 표시한 GET을 build-time 파일로 생성할 수 있어요. 동적 request값과 변경 method에는 server runtime이 필요해요.', ['static export에는 request-time mutation handler가 실행될 API server가 없어요.', '미리 생성한 파일은 쿠키나 요청 header에 맞춰 사용자별 결과로 바뀌지 않아요.']),
      explain: reviewedWrite('사전 생성 GET config', '정적 export에서 Route Handler의 GET 결과를 build 때 정적 응답으로 만들도록 지정할 `dynamic` 값은 무엇인가요?', ['"force-static"', 'force-static', 'dynamic = "force-static"'], 'GET export와 함께 선언할 수 있는 값이에요.', '`export const dynamic = "force-static"`을 사용하면 지원되는 정적 GET handler를 prerender할 수 있어요.'),
      apply: reviewedWrite('정적 학습 사이트의 실행 조건', '이 사이트는 Next.js Node server 없이 정적 파일만 제공합니다. POST Route Handler 예제가 실제 JSON을 저장한다고 하려면 어떤 실행 경계를 배포해야 하나요?', ['Next.js server', 'Node.js server', 'Next.js 실행 서버', 'request-time server'], '실제 HTTP 요청을 받고 코드를 실행할 서버가 필요해요.', 'POST handler는 request-time Next.js server와 저장 기능이 필요하며 현재 사이트의 코드 읽기에서는 실행되지 않아요.'),
    },
  ],
  15: [
    {
      check: reviewedCheck('상태 코드와 생성 자원 계약', 'POST가 새 과정을 만들고 client가 상세 요청에 사용할 주소를 알아야 합니다. HTTP 계약은 무엇인가요?', '201 Created를 보내고 Location에 새 과정의 자원 URI를 제공해요.', ['본문이 없어도 생성 성공에는 204를 써요.', '무슨 결과든 200만 보내고 client가 본문으로 성공 여부를 추측해요.'], 2, '새 자원이 실제로 만들어졌는지와 식별 URI를 봐요.', '201은 성공한 요청이 새 resource를 만들었음을 알리고 Location이 primary resource URI를 나타낼 수 있어요.', ['204는 응답 content가 없는 상태라 생성된 resource 정보를 표현하지 못해요.', '200만 반환하면 client가 생성 결과·자원 위치를 일관되게 해석하기 어려워요.']),
      explain: reviewedWrite('생성 성공 status', 'POST 처리로 새로운 API resource를 실제 만들었을 때 사용하는 HTTP status code를 적으세요.', ['201', '201 Created'], '일반 성공과 새 resource 생성 성공을 구분해요.', '201 Created는 요청 처리로 새 자원이 만들어졌다는 뜻이에요.'),
      apply: reviewedWrite('본문 없는 삭제 결과', 'DELETE로 과정을 삭제했고 반환할 JSON representation이 없습니다. 성공과 본문 부재를 함께 나타내는 code는 무엇인가요?', ['204', '204 No Content'], '성공했지만 response content를 보낼 필요가 없어요.', '204 No Content는 요청이 완료되었고 response content가 없음을 나타내요.'),
    },
    {
      check: reviewedCheck('client type과 서버 runtime 검증', '클라이언트 TypeScript가 `title: string`으로 선언한 POST body를 handler가 받습니다. 저장 전에 무엇을 확인해야 하나요?', 'request body를 unknown으로 읽고 서버 schema에서 title·길이·필수 조건을 검사해요.', ['같은 TypeScript type을 사용하는 client가 보냈으므로 server validation은 필요 없어요.', 'JSON으로 전송되면 title과 DB business rule도 자동 검증돼요.'], 2, 'compile-time annotation과 network를 넘어온 실제 값의 신뢰 수준은 달라요.', '요청값은 수정 가능한 외부 입력이라 TypeScript type만으로 runtime 검증을 대신하지 못해요.', ['client code의 type은 공격자나 구버전 앱의 body를 막지 않아요.', 'JSON parsing은 business rule·field 길이 검사를 하지 않아요.']),
      explain: reviewedWrite('요청 데이터 runtime 확인', '필드·타입·길이를 DB 저장 전에 server가 확인하는 필수 절차는 무엇인가요?', ['서버 입력 검증', 'runtime schema 검증', '입력 검증', '유효성 검사'], '실제 request body에 수행해야 하는 검사예요.', 'Route Handler에서 runtime schema와 domain rule로 사용자 입력을 검증해야 해요.'),
      apply: reviewedWrite('공백 title 거부', 'POST에 `title: "   "`가 왔습니다. string type만으로 사용할 수 있는 과정명이라 볼 수 있나요? 서버가 실행할 검사를 적으세요.', ['trim 후 빈 값 검사', 'trim과 빈 문자열 검사', '공백 제거 후 필수값 검사', '문자열 길이와 공백 확인'], 'type이 맞아도 내용이 유효한지 확인해요.', '공백을 trim한 값이 비어 있는지와 길이 제한을 server에서 검사하고 실패를 400으로 반환해요.'),
    },
    {
      check: reviewedCheck('페이지 크기와 cursor 제한', '사용자가 `?limit=500000&cursor=bad`로 목록을 조회합니다. 안전한 API 기준은 무엇인가요?', 'limit를 integer·상한으로 제한하고 cursor의 형식과 sort 경계도 검증해요.', ['요청 limit를 데이터베이스에 그대로 전달해 가능한 전체 자료를 내려줘요.', '브라우저의 page control만 검증하면 server는 query 값을 믿어도 돼요.'], 2, 'query string은 사용자가 직접 수정해 조회 자원량과 페이지 위치에 영향을 줘요.', 'limit 상한·cursor 형식·결정적인 정렬 키를 server에서 검증해 과한 조회와 페이지 중복·누락을 줄여요.', ['무제한 limit는 큰 DB 작업과 응답을 유발할 수 있어요.', '서버는 사용자 입력 query를 자체 검증해야 해요.']),
      explain: reviewedWrite('페이지 크기 최댓값', '사용자 제공 limit가 DB 조회량을 늘리지 않도록 server가 정하는 허용 최대를 무엇이라 하나요?', ['최대 limit', '페이지 크기 상한', 'max page size', '최대 페이지 크기'], 'default 값과 별도로 허용량의 끝을 생각해요.', 'limit는 양의 정수 범위와 maximum page size를 검증해야 해요.'),
      apply: reviewedWrite('cursor 순서 안정성', '과정이 계속 추가되는 도중 cursor pagination으로 중복·누락을 줄이고 싶습니다. 각 페이지에 같은 기준으로 적용해야 할 query 속성은 무엇인가요?', ['결정적 정렬', '안정된 정렬 키', '고유 tie-breaker가 있는 정렬', '일관된 순서'], 'cursor가 어느 항목 뒤인지 request마다 일관되게 계산해야 해요.', 'createdAt에 고유 id 같은 tie-breaker를 더한 안정된 정렬로 cursor를 구성해요.'),
    },
    {
      check: reviewedCheck('POST 재시도와 중복 생성 방지', '새 과정을 저장했지만 응답이 끊겨 client가 POST를 다시 보냅니다. 중복 생성 방지를 위한 조건은 무엇인가요?', '같은 operation key를 server가 범위화해 결과와 저장하고 재요청에서 그 결과를 반환해야 해요.', ['HTTP POST는 재전송을 자동 감지해 같은 resource를 한 번만 만들어요.', 'Idempotency-Key 문자열을 받으면 저장·비교 코드 없이 server가 기존 결과를 알아내요.'], 1, '헤더에 key가 존재하는 것과 server-side deduplication 로직을 구별해요.', 'POST는 기본적으로 idempotent하지 않아요. Idempotency-Key pattern은 server가 key scope와 operation 결과를 기억해야 해요.', ['POST 재시도는 처리에 따라 중복 부작용을 낼 수 있어 HTTP가 자동으로 지우지 않아요.', '요청 헤더 값은 database나 저장된 결과 비교 없이는 중복을 막지 못해요.']),
      explain: reviewedWrite('변경 요청 중복 식별 헤더', '재전송된 같은 논리 mutation을 server에서 식별할 때 앱이 사용할 수 있는 header 이름을 적으세요.', ['Idempotency-Key', 'idempotency-key'], 'header 명칭 자체로 서버 동작이 구현되는 것은 아니에요.', 'Idempotency-Key를 인증 사용자·operation과 함께 저장해 같은 재시도의 결과를 재사용할 수 있어요.'),
      apply: reviewedWrite('다른 사용자 key scope', '서로 다른 두 계정이 우연히 같은 key string을 보냈습니다. 두 사람의 저장 결과가 교차되지 않도록 idempotency 기록을 무엇과 함께 범위화할까요?', ['사용자와 operation', '인증 사용자·작업', 'user id 및 endpoint', '사용자별 작업 범위'], '무작위 key 중복 가능성을 가정해 tenant 경계를 함께 둬요.', 'idempotency key를 현재 사용자와 endpoint/operation에 묶고 그 조합에서 저장된 결과만 재사용해요.'),
    },
    {
      check: reviewedCheck('안전한 공개 오류 응답', 'client는 invalid input과 서버 장애를 구분해야 하지만 내부 SQL과 token은 공개하면 안 됩니다. 좋은 오류 계약은 무엇인가요?', '정해진 error code·안전한 message·필요한 requestId를 적절한 HTTP 4xx/5xx status로 돌려요.', ['stack trace와 Authorization token을 body에 넣고 status는 200으로 고정해요.', '모든 오류를 빈 500으로 바꾸어 입력을 고칠 수 있는 client도 구분하지 못하게 해요.'], 0, '사용자가 고칠 요청인지 server 장애인지 알려 주면서 상세 로그는 보호해요.', '안정된 public error envelope와 HTTP status는 client 처리를 돕고 requestId는 제한된 로그에서 진단을 찾게 해요.', ['stack·SQL·credential은 내부 구현과 비밀 정보라 공개하면 안 되고 200은 실패와 모순돼요.', '입력 오류와 server 장애는 다른 status와 조치가 필요해요.']),
      explain: reviewedWrite('서버 오류 상관 식별자', '상세 예외를 공개하지 않고 서버 로그에서 동일한 요청 오류를 찾게 전달할 수 있는 값은 무엇인가요?', ['requestId', 'request id', 'correlation id', '상관관계 식별자'], 'stack trace 대신 요청을 검색하는 제한된 식별값이에요.', 'requestId를 전달하면 내부 로그의 상세 오류를 안전한 운영 경계 안에서 찾을 수 있어요.'),
      apply: reviewedWrite('입력 오류 status 선택', 'title이 누락된 POST는 client가 고칠 수 있는 잘못된 요청입니다. 이 요청 오류를 내부 장애 500과 구분하는 대표 status code를 적으세요.', ['400', '400 Bad Request'], '서버 내부 오류가 아니라 request 입력이 잘못됐어요.', 'Invalid input은 400 Bad Request와 안정된 invalid_input code를 반환해요.'),
    },
  ],
  16: [
    {
      check: reviewedCheck('form action의 실제 실행 위치', '과정 만들기 폼에 `action={createCourse}`를 연결했습니다. JavaScript가 아직 내려오지 않은 제출도 지원할 수 있지만, 이 학습 사이트처럼 정적 HTML만 제공하는 호스트에서는 어떤 사실을 기억해야 하나요?', 'Server Function은 Next.js 서버에서 처리하며 정적 호스트만으로 함수가 실행되지는 않아요.', ['action은 일반 브라우저 onSubmit handler라 함수가 항상 사용자 기기에서만 실행돼요.', '폼 HTML이 Server Function 구현을 포함하므로 정적 호스트가 요청을 저장해 줘요.'], 2, '폼의 제출 계약과 실제 요청을 받을 실행 서버를 각각 확인해요.', 'Server Action은 서버 함수예요. form action 연결은 제출 경계를 만들지만 정적 파일 호스트가 Next.js 서버 실행을 제공하지는 않아요.', ['Server Function은 이름 그대로 서버에서 실행되고 일반 client event callback과 같은 코드 경계가 아니에요.', '정적 HTML은 Server Action request endpoint나 데이터를 저장할 서버를 만들지 않아요.']),
      explain: reviewedWrite('action 함수의 종류', 'HTML form의 action에 서버에서 변경 작업을 처리하도록 연결하는 Next.js 비동기 함수 경계를 무엇이라고 하나요?', ['Server Action', 'Server Function', '서버 액션', '서버 함수'], '브라우저 코드의 event handler와 실행 위치가 달라요.', 'Server Action은 서버에서 실행되는 Server Function으로 폼 제출과 변경 작업에 연결할 수 있어요.'),
      apply: reviewedWrite('정적 학습 화면의 기능 경계', '현재 사이트가 정적 파일만 배포하고 Node/Next 서버를 갖지 않습니다. 예제 폼이 과정 데이터를 실제 저장한다고 안내하려면 무엇이 먼저 필요할까요?', ['Next.js 서버', '실행 서버', 'Server Action을 처리하는 서버', '서버 실행 환경'], '사용자 요청을 받아 변경 코드를 실행할 기반을 떠올려요.', '현재 앱에서는 설명만 제공하며 실제 변경하려면 Server Action을 처리할 Next.js 서버와 저장소가 필요해요.'),
    },
    {
      check: reviewedCheck('FormData 필드 모양 검증', '`title` 하나와 여러 `tag`를 받는 action입니다. 사용자 입력의 누락·파일·반복 값을 올바르게 다루는 설명은 무엇인가요?', 'get("title")은 string·File·null일 수 있고 반복 `tag` 값은 getAll() 결과를 검증해요.', ['FormData.get은 필드가 없어도 문자열을 주고 모든 중복 이름을 배열 하나로 합쳐요.', 'Object.fromEntries(formData)는 Next.js action 메타데이터가 없고 값을 schema 타입으로 자동 변환해요.'], 1, '브라우저에서 제출한 FormData API가 반환하는 원래 값과 schema 변환을 나눠요.', 'FormData.get은 하나의 FormDataEntryValue 또는 null이고, 반복 항목은 getAll()로 읽어요. Object.fromEntries를 쓰면 `$ACTION_` 보조 속성이 포함될 수도 있어요.', ['get은 누락될 수 있고 File도 반환하므로 typeof와 형식 검사가 필요해요.', 'Object.fromEntries는 검증·타입 변환을 하지 않고 action 보조 키가 포함될 수 있어요.']),
      explain: reviewedWrite('반복 필드 읽기', '폼에서 같은 `tag` 이름을 여러 번 제출했을 때 모든 값을 모으는 FormData 메서드 이름을 적으세요.', ['getAll', 'getAll()', 'formData.getAll', 'formData.getAll("tag")'], '한 이름에 대한 첫 값만 읽는 get과 구분해요.', '반복 이름의 값을 전부 확인하려면 formData.getAll("tag")를 사용한 뒤 각 값의 타입과 허용 범위를 검증해요.'),
      apply: reviewedWrite('누락된 문자열 처리', '`formData.get("title")`을 trim하려는데 사용자가 필드를 생략해 값이 null입니다. 문자열 처리 전에 필요한 검사 기준을 적으세요.', ['null 검사', '문자열인지 검사', 'string인지 검사', 'typeof title === "string"', '값이 string인지 확인'], '문자열 메서드를 부를 수 있는지 먼저 확인해요.', 'title이 실제 문자열인지 확인하고 누락이나 File 값은 사용자가 고칠 수 있는 입력 오류로 반환해요.'),
    },
    {
      check: reviewedCheck('Server Action 입력·권한 재검사', '관리자 페이지는 로그인 사용자를 렌더했지만, `renameCourse(id, title)` Server Action은 POST로 직접 호출될 수 있습니다. 수정 전에 필요한 검증은 무엇인가요?', 'Action 내부에서 호출자를 인증하고 해당 과정의 수정 권한과 title 입력을 각각 검사해요.', ['페이지에서 로그인 확인을 했으므로 action에서 id나 title 검증은 하지 않아요.', '브라우저 버튼을 숨기고 전달한 hidden id를 신뢰하면 자원 소유자 확인이 돼요.'], 2, '화면에서 보인다는 사실과 action이 호출 가능하다는 사실을 분리해요.', 'Server Action은 별도 진입점이므로 인증만으로 충분하지 않고 대상 자원별 인가와 클라이언트 입력 검증도 매 호출마다 필요해요.', ['페이지 렌더의 검사는 action으로 자동 전달되지 않고 잘못된 입력·직접 POST도 허용될 수 있어요.', 'hidden 입력은 사용자가 바꿀 수 있는 요청값이므로 서버에서 대상 자원의 owner와 비교해야 해요.']),
      explain: reviewedWrite('인증과 인가 확인 순서', '사용자가 로그인했는지 확인하는 것에 더해, 수정 대상 과정에 실제 권한이 있는지 검사하는 일을 무엇이라 하나요?', ['인가', '권한 확인', '자원 권한 검사', 'authorization'], '누구인지 확인하는 authentication과 구분해요.', '인증은 호출자 신원 확인이고 인가는 해당 호출자가 이 과정 변경을 할 수 있는지 확인하는 절차예요.'),
      apply: reviewedWrite('변조된 과정 ID 방어', '세션 사용자가 폼의 hidden `courseId`를 다른 사람 과정 ID로 바꿔 보내면 어떤 서버 조건을 확인해야 저장을 막을 수 있나요?', ['course.ownerId와 user.id 비교', '소유자 확인', '사용자에게 해당 과정 수정 권한이 있는지 확인', '자원별 인가'], '요청 ID를 인증된 사용자와 연결된 저장 데이터와 비교해요.', '서버에서 과정을 다시 읽고 소유자나 역할을 인증된 사용자와 대조한 뒤에만 변경해요.'),
    },
    {
      check: reviewedCheck('useActionState의 세 값과 인자 순서', '폼에서 검증 결과를 상태로 보여 주면서 제출 중 버튼을 비활성화합니다. 현재 React·Next 폼 가이드에 맞는 설명은 무엇인가요?', 'state, formAction, isPending을 받고 Server Function은 previousState 다음에 FormData를 받아요.', ['두 값만 받고 Server Function은 항상 FormData 하나만 인자로 받아요.', '반환 배열의 세 번째 값은 저장 결과이고 pending은 별도 Promise를 직접 만들어야 해요.'], 0, 'Hook의 반환 tuple과 state를 추가했을 때 action 인자 순서를 확인해요.', 'useActionState는 state·dispatcher·pending 세 값을 반환하고, 폼 action에 연결할 Server Function은 이전 상태를 첫 인자로 받은 뒤 FormData를 받아요.', ['폼 데이터를 action에 넘기면서 첫 상태 인자를 추가하는 계약을 함께 따라야 해요.', '세 번째 반환값이 isPending이며 별도 timeout Promise는 필요하지 않아요.']),
      explain: reviewedWrite('폼 상태 Hook 이름', 'Server Action의 반환 상태와 진행 중 여부를 React 폼과 연결하는 Hook 이름을 적으세요.', ['useActionState', 'React useActionState'], '이전 이름과 최신 Hook 이름을 혼동하지 마세요.', 'useActionState는 [state, dispatchAction, isPending]을 반환해 폼 Action 결과와 진행 상태를 연결해요.'),
      apply: reviewedWrite('이전 상태 인자 반영', '원래 `saveCourse(formData)`였던 함수를 useActionState에 연결하고 `{ message: string }` 상태를 받습니다. 서버 함수의 첫 번째 매개변수로 무엇을 추가해야 하나요?', ['previousState', 'prevState', '이전 상태', 'FormState'], '폼 데이터를 받기 전에 이전 결과 state가 전달돼요.', 'action signature를 `(previousState, formData)`로 바꾸고 성공·검증 결과에 같은 상태 shape를 반환해요.'),
    },
    {
      check: reviewedCheck('useFormStatus를 둬야 할 위치', '`SubmitButton`이 진행 중일 때 비활성화되도록 `useFormStatus()`를 호출합니다. Hook이 제출 상태를 읽게 하는 구조는 무엇인가요?', 'SubmitButton을 상태를 읽을 부모 form 안에 렌더하는 자식 컴포넌트로 둬요.', ['SubmitButton을 form 바깥에 두면 앱에서 가장 가까운 보이는 form의 pending을 알아서 찾아요.', '폼 컴포넌트 자신이 form을 반환하기 전에 Hook을 부르면 자기 자식 form의 상태를 읽어요.'], 1, '상태를 읽는 컴포넌트와 해당 form의 실제 React 부모·자식 관계를 따라가요.', 'useFormStatus는 상위 부모 form의 제출 상태를 읽으므로 Hook을 호출하는 버튼은 form 내부 자손 컴포넌트여야 해요.', ['폼의 자식 트리 밖에서는 해당 form의 상태를 읽지 못해요.', '부모가 반환한 자식 form의 context를 그 부모가 거꾸로 읽을 수 없어요.']),
      explain: reviewedWrite('폼 제출 상태 boolean', 'useFormStatus가 action 처리 중인지 알려 주는 반환 객체의 속성 이름을 적으세요.', ['pending', 'isPending'], '버튼을 비활성화하거나 진행 문구를 보여 줄 때 사용해요.', 'useFormStatus의 pending이 제출 중인지 알려 줘요.'),
      apply: reviewedWrite('재사용 버튼 컴포넌트 배치', '공통 SubmitButton이 useFormStatus를 이용해 “저장 중”을 표시합니다. 이 컴포넌트를 부모 form의 어느 위치에 두어야 하나요?', ['form 안', 'form의 자식', 'form 내부 자손', 'form 내부'], 'Hook이 추적할 form의 context가 전달되는 트리 위치예요.', 'SubmitButton을 대상 form의 하위 자손으로 렌더해야 해당 form의 진행 상태를 읽어요.'),
    },
  ],
  17: [
    {
      check: reviewedCheck('필드 오류와 성공 상태 연결', '과정 이름 입력이 길이 제한을 넘었습니다. 사용자가 해당 입력에서 오류를 확인하고 수정하게 하는 접근성 있는 반환 방식은 무엇인가요?', '필드 오류를 입력의 aria-describedby·aria-invalid와 연결하고 성공 안내와 구분해요.', ['페이지 아래에 붉은 문장만 보여 주면 입력 연결과 상태 안내가 자동 제공돼요.', '검증에 실패해도 성공 문구로 폼 상태를 갱신해 사용자가 다시 제출하지 않게 해요.'], 2, '오류 문구가 어느 입력을 설명하는지 보조 기술과 시각 UI 양쪽에서 확인해요.', '필드별 오류는 label·aria-invalid·aria-describedby로 해당 입력과 연결하고 폼 상태 메시지와 혼동하지 않아요.', ['색과 위치만으로는 오류 입력과 프로그램적 관계가 전달되지 않아요.', '검증 실패는 성공 상태가 아니므로 수정할 필드와 다음 시도를 알려야 해요.']),
      explain: reviewedWrite('필드 오류 설명 속성', '오류 문단의 id를 입력의 `aria-describedby` 값으로 연결해 오류 내용을 해당 입력에 알리는 HTML 속성을 적으세요.', ['aria-describedby'], '입력 이름을 지정하는 label 연결 속성과는 목적이 달라요.', 'aria-describedby는 입력과 추가 설명 또는 오류 메시지의 관계를 프로그램적으로 연결해요.'),
      apply: reviewedWrite('오류 입력 표시', '서버 validation 결과에 title 오류가 있습니다. 오류 문구에 연결된 입력이 잘못된 상태임을 보조 기술에 표시하는 속성을 적으세요.', ['aria-invalid', 'aria-invalid="true"'], '오류 설명 연결과 오류 여부 표시를 함께 생각해요.', 'title 입력에 aria-invalid="true"를 주고 aria-describedby로 구체 오류를 연결해요.'),
    },
    {
      check: reviewedCheck('낙관적 값의 임시성', '사용자가 새 강의를 제출하자 목록에 먼저 표시했지만 저장 요청이 실패했습니다. useOptimistic 상태의 올바른 해석은 무엇인가요?', '낙관적 항목은 Action 진행 중 임시 표시이며 완료 뒤 실제 기준 props와 오류 결과를 반영해요.', ['useOptimistic에 전달한 값은 mutation 성공과 무관하게 영구 저장돼요.', 'optimistic UI는 서버 데이터와 상태가 같으므로 실패 응답을 표시할 필요가 없어요.'], 0, '임시 상태를 만든 기준 값과 실제 저장 성공 후 서버가 반환하는 값을 비교해요.', 'useOptimistic은 Action이 진행되는 동안 먼저 보여 주는 값이에요. 완료되면 기준 state로 돌아오므로 서버 결과와 실패 안내를 따로 처리해요.', ['React UI Hook은 데이터베이스에 기록하는 API가 아니에요.', '실패 원인이나 사용자 재시도 안내는 optimistic 표시만으로 해결되지 않아요.']),
      explain: reviewedWrite('임시 화면 업데이트 Hook', '서버 응답을 기다리기 전에 목록이 바뀐 것처럼 임시 UI를 보여 줄 때 사용하는 React Hook을 적으세요.', ['useOptimistic'], 'action이 완료되면 기준 값으로 돌아갈 수 있는 UI 상태예요.', 'useOptimistic은 진행 중 임시 상태를 보여 주며 저장 완료를 보장하지 않아요.'),
      apply: reviewedWrite('실패 뒤 기준 상태 복원', 'optimistic으로 추가한 강의 저장 Action이 거부되었습니다. 그 항목이 최종 목록처럼 남지 않게 기준이 되어야 할 데이터는 무엇인가요?', ['서버가 확인한 목록', '기준 props', '원본 상태', '서버에서 다시 읽은 목록'], 'optimistic 업데이트를 시작할 때 제공한 원본 데이터예요.', '작업이 끝나면 실제 서버가 확인한 props·목록을 기준으로 보여 주고 실패 이유를 안내해요.'),
    },
    {
      check: reviewedCheck('read-your-own-writes 즉시 갱신', 'Server Action이 과정 이름을 수정하고 다음 화면에서 방금 쓴 값을 즉시 읽어야 합니다. Next.js 16 Cache Components에서 맞는 선택은 무엇인가요?', '캐시 데이터에 연결된 tag를 Server Action에서 updateTag로 즉시 만료해요.', ['Route Handler에서도 updateTag를 호출하고 stale 데이터를 제공하는 것이 read-your-own-writes 계약이에요.', 'updateTag는 tag 등록 없이 전역 모든 데이터를 언제나 자동으로 다시 써요.'], 1, '서버 Action 전용 여부와 즉시 fresh 데이터가 필요한 상황인지 확인해요.', 'updateTag는 Server Action에서만 사용하며 연결된 cache tag를 즉시 expire해 다음 요청이 새 값을 기다리게 해요.', ['Route Handler에는 revalidateTag를 쓰며 profile="max"는 stale-while-revalidate 흐름이에요.', '먼저 `use cache` 결과의 `cacheTag` 또는 fetch의 `next.tags`로 tag를 연결해야 해요.']),
      explain: reviewedWrite('즉시 tag 만료 API', 'Server Action에서 tag cache를 바로 만료해 사용자가 방금 변경한 값을 다시 읽도록 하는 Next.js 함수는 무엇인가요?', ['updateTag', 'updateTag()'], 'Server Action 전용 read-your-own-writes를 생각해요.', 'updateTag(tag)는 지정 캐시를 즉시 만료하고 다음 읽기는 새 값을 기다려요.'),
      apply: reviewedWrite('Route Handler의 stale 정책', 'Webhook Route Handler에서 업데이트 알림을 받고, 방문자가 당분간 오래된 페이지를 보더라도 백그라운드 갱신을 허용합니다. 사용할 API와 profile 값을 적으세요.', ['revalidateTag("courses", "max")', 'revalidateTag with max', 'revalidateTag', 'revalidateTag("courses", "max")를 사용해요'], 'updateTag는 Server Action 전용이고 이 시나리오는 stale-while-revalidate예요.', 'Route Handler에서 revalidateTag("courses", "max")로 표시하고 다음 요청 때 stale 데이터를 보이며 갱신할 수 있어요.'),
    },
    {
      check: reviewedCheck('path와 tag 무효화 범위', '한 과정 상세 경로만 최신 화면을 다시 계산하고 싶습니다. tag를 쓰는 여러 경로 데이터 무효화와 특정 경로 무효화를 구별한 설명은 무엇인가요?', '특정 `/courses/react` route를 대상으로 하면 revalidatePath를 사용해요.', ['revalidatePath는 해당 경로와 무관한 모든 tag 데이터를 전역에서 만료해요.', 'revalidateTag("courses") 단일 인자가 현재 권장 표준이며 캐시 path를 지정해요.'], 2, '페이지 경로 단위인지 해당 데이터를 사용하는 화면 전체인지 대상 범위를 읽어요.', 'revalidatePath는 page/layout 경로를 지정하고 revalidateTag는 그 tag가 연결된 데이터의 사용처를 대상으로 해요. tag의 freshness profile도 별도로 결정해요.', ['경로와 데이터 tag는 같은 캐시 식별자가 아니며 영향 범위가 다릅니다.', '최신 공식 계약에서는 revalidateTag에 profile이 필요하고 `"max"`는 stale-while-revalidate를 뜻해요.']),
      explain: reviewedWrite('경로 기반 캐시 API', '캐시 tag가 아니라 `/courses/react` 같은 특정 page 또는 layout 경로를 기준으로 갱신하는 Next.js 함수는 무엇인가요?', ['revalidatePath', 'revalidatePath()'], '데이터 tag와 URL 경로를 구별해요.', 'revalidatePath(path)는 특정 page 또는 layout path를 무효화하는 경로 기반 API예요.'),
      apply: reviewedWrite('공유 목록 데이터 재검증', '여러 화면이 `courses` tag가 붙은 동일한 과정 목록을 읽습니다. 해당 데이터를 참조하는 화면 전반을 대상으로 하는 함수 이름을 적으세요.', ['revalidateTag', 'revalidateTag("courses", "max")'], '한 URL이 아니라 cache tag 연결을 대상으로 해요.', 'tag 기반 데이터 캐시라면 revalidateTag를 사용하고 필요한 profile에 따라 stale 제공 여부를 선택해요.'),
    },
    {
      check: reviewedCheck('변경 완료 순서와 이동', '새 과정을 저장한 뒤 목록 캐시를 즉시 만료하고 상세 화면으로 보냅니다. 실패한 저장이 성공 흐름으로 보이지 않게 하는 순서는 무엇인가요?', '검증·저장을 성공시킨 다음 tag를 갱신하고 상세 경로로 redirect해요.', ['저장 결과를 확인하기 전에 cache를 성공 상태로 무효화하고 새 상세 화면으로 보냅니다.', '먼저 redirect해서 사용자가 도착한 뒤 아직 실패할 수도 있는 저장을 실행해요.'], 0, '데이터가 실제로 확정되는 시점과 후속 cache·navigation 호출 순서를 그려요.', '서버 mutation이 성공한 뒤 캐시를 갱신하고 이동해야 실패한 변경을 성공처럼 보이지 않게 할 수 있어요.', ['변경 실패를 확인하기 전에 성공용 UI와 cache 작업을 확정하면 현재 데이터를 왜곡해요.', '저장 Action이 완료되기 전에 redirect하면 사용자에게 성공 여부를 근거 없이 보여 줄 수 있어요.']),
      explain: reviewedWrite('Redirect 전 완료 단계', '새 상세 경로로 이동하기 전에 서버 변경을 성공으로 확정할 데이터 작업은 무엇인가요?', ['저장', 'DB 저장', 'mutation 완료', '데이터 변경 성공'], '폼 입력을 확인한 뒤 영구 데이터가 바뀌는 단계를 생각해요.', '검증과 실제 저장이 완료된 뒤에 cache 변경 및 redirect를 실행해요.'),
      apply: reviewedWrite('실패 흐름 남기기', 'saveCourse가 validation 오류를 반환했습니다. 오류 필드에 머물며 사용자에게 수정 안내를 해야 하나요, 성공 상세 페이지로 보내야 하나요?', ['오류 필드에 머물러요', '수정 안내를 보여 줘요', 'validation 오류를 반환해요', 'redirect하지 않아요'], '성공 경로는 데이터 변경이 실제 반영된 경우예요.', 'validation 오류면 action state에 필드 오류를 반환해 폼을 유지하고 성공 redirect는 실행하지 않아요.'),
    },
  ],
  18: [
    {
      check: reviewedCheck('cookies의 비동기 요청 경계', '개인별 테마 설정을 Server Component에서 읽습니다. Next.js 16의 cookies API와 요청 렌더링 관계를 설명한 것은 무엇인가요?', 'await cookies()로 읽어요. Cache Components를 켰다면 이 값을 쓰는 화면을 Suspense로 감싸 정적 화면과 나눠요.', ['cookies()는 빌드 때 확정된 전역 값을 동기 반환하므로 모든 사용자 화면이 같아요.', 'Server Component에서 쿠키를 쓰고 이미 전송된 HTML response header를 나중에 변경할 수 있어요.'], 1, '쿠키 값이 언제 정해지는지, 현재 Cache Components 설정에서 어디에 Suspense 경계를 둬야 하는지 확인해요.', 'Next.js 16의 cookies()는 비동기 요청 API라 값이 방문자 요청마다 달라요. Cache Components를 켠 경우 쿠키를 읽는 화면을 Suspense로 감싸면 나머지 정적 화면을 먼저 보여 줄 수 있어요.', ['쿠키는 사용자 HTTP 요청마다 달라질 수 있고 현재 API는 Promise를 돌려줘요.', 'Server Component 렌더는 쿠키를 변경하지 못하며 response header를 설정할 수 있는 Action/Route Handler가 필요해요.']),
      explain: reviewedWrite('요청 cookies 호출', 'Next.js App Router에서 cookieStore를 얻기 위해 await를 붙여 호출하는 요청 API 이름을 적으세요.', ['cookies', 'cookies()', 'await cookies()'], 'next/headers에서 가져오는 API예요.', '현재 Next.js API는 `await cookies()`로 request cookie store를 읽어요.'),
      apply: reviewedWrite('사용자 설정의 빌드 범위', '사용자별 theme 쿠키를 page에서 읽습니다. 그 값은 한 번의 build 시 모든 방문자에 공통으로 계산할 값인가요, 요청마다 달라질 수 있는 값인가요?', ['요청마다 달라져요', '요청별 값', '사용자마다 달라질 수 있어요', 'request-time'], '브라우저가 HTTP 요청에 쿠키를 함께 전송해요.', 'cookie 값은 방문자 요청마다 달라질 수 있어 정적 build 결과 하나에 공통으로 고정할 수 없어요.'),
    },
    {
      check: reviewedCheck('요청 헤더와 신뢰 proxy', '`headers()`에서 `x-forwarded-for` 값을 읽었습니다. 이 값으로 관리자 사용자나 신뢰 가능한 원본 주소를 곧바로 판정해도 될까요?', '요청 헤더는 읽기 전용이지만 입력일 수 있어 신뢰하도록 설정된 proxy가 검증한 조건을 확인해요.', ['헤더 이름에 forwarded가 있으면 Next.js가 인증·주소를 암호학적으로 검증했어요.', 'headers() 반환값은 변경 가능하므로 브라우저가 보낸 값을 안전한 server value로 덮어써요.'], 0, 'Headers API의 불변성은 그 안의 값이 참이라는 보증과 달라요.', 'headers()가 반환하는 Headers는 읽기 전용 요청 정보예요. 임의 헤더 값은 신뢰 proxy가 통제하는지 확인하기 전에는 인증이나 권한 근거가 아니에요.', ['헤더 이름이나 프레임워크 접근 방식이 사용자 입력값의 진실성을 증명하지 않아요.', 'API가 readonly라는 사실은 전달된 값이 검증됐다는 뜻이 아니에요.']),
      explain: reviewedWrite('요청 헤더 API', 'Next.js App Router에서 현재 HTTP request의 읽기 전용 Header 객체를 얻는 비동기 API 이름은 무엇인가요?', ['headers', 'headers()', 'await headers()'], 'next/headers의 request API 중 cookie와 구분해요.', '현재 request Headers 객체를 얻을 때 `await headers()`를 사용해요.'),
      apply: reviewedWrite('임의 forwarded 값 사용 제한', '운영 proxy의 신뢰 설정 여부를 확인하지 못했습니다. 사용자가 보낸 x-forwarded-for를 로그인 판정에 사용해도 되나요?', ['아니요', '신뢰 proxy 검증이 필요해요', '인증 근거로 쓰면 안 돼요', '사용자 입력이라 검증 전에는 신뢰하지 않아요'], 'request header는 요청 주체가 통제할 수 있는 입력일 수 있어요.', '신뢰할 proxy가 값을 설정·정제한다는 운영 경계를 확인하기 전에는 forwarded header로 신원·권한을 확정하지 않아요.'),
    },
    {
      check: reviewedCheck('인증 뒤 리소스 소유권 검사', '페이지는 로그인한 사용자만 보이게 했지만 export된 Server Action이 `deleteCourse(courseId)`를 처리합니다. IDOR를 막는 추가 확인은 무엇인가요?', 'Action 안에서 세션과 실제 과정 소유자 또는 역할 권한을 매번 확인해요.', ['관리 페이지에만 form을 렌더하면 Server Action 직접 POST도 같은 UI 검사를 통과해요.', '로그인만 했으면 어떤 courseId가 전달돼도 삭제할 수 있어요.'], 1, '페이지 UI가 아니라 action 자체가 호출되었을 때 필요한 권한 관계를 확인해요.', 'Next.js 문서는 Server Action이 직접 POST로 도달될 수 있다고 보고 action 안에서 인증·자원별 인가를 다시 확인하도록 요구해요.', ['UI에서 버튼을 감춘 것은 외부 요청이나 변조된 id를 막지 않아요.', '인증은 사용자를 확인하고 인가는 그 사용자에게 해당 course의 삭제 권한이 있는지 검사해요.']),
      explain: reviewedWrite('한 사용자 자원 권한', 'courseId를 바꾼 요청이 타인 소유 자료를 수정하지 못하게 course 소유자와 session user를 비교하는 보안 확인은 무엇인가요?', ['인가', '권한 확인', '소유권 검사', 'resource authorization'], '인증 성공과 특정 객체 작업 허가는 다른 검사예요.', '객체 소유권·역할에 따른 자원별 authorization을 action에서 검사해 IDOR를 막아요.'),
      apply: reviewedWrite('action 자체 로그인 검사', '페이지의 requireUser 검사만 있고 별도 renameCourse Server Action에는 세션 확인이 없습니다. 세션 검사를 어디에 추가해야 하나요?', ['Server Action 안', 'action 내부', 'renameCourse 안', '매 Server Action마다'], 'Action은 독립 요청 진입점이에요.', '실제 변경을 수행하는 Server Action 안에서 매 호출마다 사용자 인증과 그 다음 자원 인가를 검사해요.'),
    },
    {
      check: reviewedCheck('NEXT_PUBLIC과 비밀 키 구분', '브라우저에서 읽어도 되는 화면 label과 결제 제공자 비밀 키를 환경변수로 둡니다. 현재 Next.js 공개 경계를 지키는 선택은 무엇인가요?', 'NEXT_PUBLIC_ 변수만 공개 정보로 취급하고 비밀 키는 server-only 데이터 접근 경계에서 사용해요.', ['변수명이 PRIVATE_로 시작하면 client bundle에 포함되더라도 Next.js가 값을 자동 암호화해요.', '비밀키를 props로 Client Component에 넘기고 화면에 출력하지 않으면 안전해요.'], 2, '접두사 규칙과 서버에서 클라이언트로 넘어가는 값 경계를 확인해요.', 'Next.js는 NEXT_PUBLIC_ 환경변수를 브라우저 bundle로 노출해요. secret은 server-only 모듈 안에서 쓰고 반환 DTO·props·로그에 싣지 않아요.', ['PRIVATE_ 같은 임의 접두사는 client bundle 노출을 막는 Next.js 설정이 아니에요.', 'Client Component에 전달한 prop은 browser가 받을 수 있으므로 화면에 표시하지 않아도 비밀이 아니에요.']),
      explain: reviewedWrite('브라우저 공개 접두사', 'Next.js가 브라우저 bundle 공개 대상으로 취급하는 환경변수 접두사를 적으세요.', ['NEXT_PUBLIC_', 'NEXT_PUBLIC'], '공개 analytics label 예시와 서버 전용 키를 나눠요.', 'NEXT_PUBLIC_ 접두사 값은 브라우저에서 볼 수 있다고 가정해야 해요.'),
      apply: reviewedWrite('결제 키 전달 차단', 'PRIVATE_API_KEY를 Client Component에 prop으로 넘기지 않고 읽어야 할 모듈의 실행 경계를 적으세요.', ['server-only', '서버 전용', '서버에서만'], '브라우저 module graph로 가져오지 못하게 경계를 표시해요.', '비밀값은 server-only 데이터 접근 코드 안에서만 사용하고 클라이언트로 전달하지 않아요.'),
    },
    {
      check: reviewedCheck('개인 데이터 캐시 격리', '사용자별 학습 dashboard 경로는 모두 `/dashboard`지만 각자의 오답·진도 자료가 달라요. 캐시 설계에서 가장 안전한 판단은 무엇인가요?', '인증 사용자별로 권한 확인과 데이터 범위를 적용하고 개인 응답이 공용 cache에 교차 재사용되지 않게 해요.', ['URL 경로가 같으므로 사용자 간 결과를 동일한 공유 key에 저장해요.', 'UI에서 로그인 이름만 바꾸면 공용으로 재사용한 다른 계정의 payload가 분리돼요.'], 0, 'URL의 모양보다 캐시 안의 데이터가 누구에게 속하는지 확인해요.', '개인 응답은 사용자 신원 및 인가 경계를 따라야 해요. 사용자별 key를 실제 cache model에서 검증하거나 공용 cache를 피해야 타인 자료가 섞이지 않아요.', ['같은 URL은 사용자마다 다른 private data를 공유해도 된다는 증거가 아니에요.', '클라이언트 표시는 서버에서 이미 노출된 다른 사람의 데이터 접근을 막지 못해요.']),
      explain: reviewedWrite('개인 응답의 데이터 범위', '두 계정의 오답 기록이 섞이지 않게 private dashboard에서 먼저 검증하고 데이터 접근에 적용할 서버 문맥은 무엇인가요?', ['인증된 사용자', '현재 사용자', 'session user', '권한을 확인한 현재 사용자'], '요청 URL이 아니라 데이터 소유 주체예요.', '현재 인증된 사용자와 자원 권한을 확인하고 그 사용자의 범위만 반환해야 해요.'),
      apply: reviewedWrite('공유 캐시 도입 전 확인', '개인별 학습 결과를 cache key에 사용자 식별 없이 저장하려 합니다. 다른 계정에 값이 섞이지 않게 하려면 무엇을 바꾸거나 확인해야 하나요?', ['공유 캐시를 피해요', '사용자별 cache scope', '사용자 ID 포함과 authorization 검증', '개인 응답을 공용 캐시에 두지 않아요'], '캐시가 요청 사이에서 재사용되는 범위와 key를 점검해요.', '개인 결과에 공용 캐시를 적용하지 않거나, 권한 검증된 사용자별 식별 범위와 Next.js 캐시 계약을 확인해야 해요.'),
    },
  ],
};

function reviewedExercisesFor(week, day, id) {
  const questionSet = reviewedFirstWeeks[week]?.[day - 1]
    ?? reviewedRoutingWeeks[week]?.[day - 1]
    ?? reviewedComponentWeeks[week]?.[day - 1]
    ?? reviewedReactBoundaryWeeks[week]?.[day - 1]
    ?? reviewedCompatibilityWeeks[week]?.[day - 1]
    ?? reviewedReliabilityWeeks[week]?.[day - 1]
    ?? reviewedReleaseWeeks[week]?.[day - 1]
    ?? reviewedQualityWeeks[week]?.[day - 1]
    ?? reviewedNextWeeks[week]?.[day - 1]
    ?? reviewedDataWeeks[week]?.[day - 1];
  if (!questionSet) return null;

  const { check, explain, apply } = questionSet;
  const distractors = check.wrong.map((text, index) => [text, check.wrongFeedback[index]]);
  distractors.splice(check.answerIndex, 0, [check.correct, check.explanation]);
  return [
    choice(`${id}-decision-v2`, check.title, check.prompt, distractors, check.answerIndex, check.hint, check.explanation),
    reviewedShortAnswer(`${id}-reason-v2`, explain),
    reviewedShortAnswer(`${id}-apply-v2`, apply),
  ];
}

function exercisesFor(week, day, record) {
  const [concept, example, rule, misconception, consequence] = record;
  const id = `nextjs-w${String(week).padStart(2, '0')}-d${day}`;
  const reviewedExercises = reviewedExercisesFor(week, day, id);
  if (reviewedExercises) return reviewedExercises;

  const options = [
    [rule, `정답: ${rule}`],
    [misconception, `이 판단은 ${misconception}`],
    [genericStaticMisconception, '이 과정은 개념 코드만 다루며 Next.js 서버 실행 검증을 제공하지 않아요.'],
  ];
  const decision = choice(`${id}-decision`, `${concept} 판단`, `아래는 ${concept}을 설명하는 개념 코드예요. 요구사항에 맞는 올바른 판단을 고르세요.\n\n${example}`, options, 0, `${concept}의 실행 위치와 공식 계약을 먼저 확인하세요.`, rule);
  const term = shortAnswer(`${id}-term`, `${concept} 용어 확인`, `오늘 코드에서 다루는 핵심 Next.js 개념은 무엇인가요?\n\n${concept}: ${rule}`, [concept], `예제 제목의 Next.js 규칙을 한 단어 또는 짧은 구절로 적어 보세요.`, `${concept}은(는) ${rule}`);
  const outcomeOptions = [
    [consequence, `이 경계를 놓치면 ${consequence}`],
    [rule, '이 설명은 바람직한 규칙이고 질문은 발생 가능한 영향에 대한 내용이에요.'],
    [genericStaticMisconception, '정적 학습 화면은 서버 실행을 제공하지 않으므로 실제 동작으로 단정할 수 없어요.'],
  ];
  const outcome = choice(`${id}-boundary`, `${concept} 영향 확인`, `이 사례에서 흔한 오해를 그대로 적용하면 어떤 문제가 생길 수 있나요?\n\n오해: ${misconception}`, outcomeOptions, 0, '잘못된 가정이 실행 위치·데이터·사용자 안내에 미치는 영향을 생각해 보세요.', consequence);
  return [decision, term, outcome];
}

const lessons = weeks.map((weekSpec, index) => {
  const week = index + 1;
  const phase = phaseFor(week);
  const sessions = weekSpec.days.map((record, dayIndex) => {
    const day = dayIndex + 1;
    const [concept, originalExample, rule, , , reviewedObjective] = record;
    const example = reviewedReleaseExamples[week]?.[day - 1]
      ?? reviewedReliabilityExamples[week]?.[day - 1]
      ?? originalExample;
    const dailyObjective = reviewedReleaseObjectives[week]?.[day - 1]
      ?? reviewedReliabilityObjectives[week]?.[day - 1]
      ?? reviewedReactBoundaryObjectives[week]?.[day - 1]
      ?? reviewedCompatibilityObjectives[week]?.[day - 1]
      ?? reviewedQualityObjectives[week]?.[day - 1]
      ?? reviewedNextObjectives[week]?.[day - 1];
    const objective = dailyObjective ?? reviewedObjective ?? `${weekSpec.title}에서 ${concept}의 역할과 한계를 설명해요.`;
    return studySession(day, concept, objective, rule, example, exercisesFor(week, day, record));
  });
  return weeklyLesson({
    id: `nextjs-week-${String(week).padStart(2, '0')}`,
    topicId: phase.id,
    week,
    title: weekSpec.title,
    objective: weekSpec.objective,
    intro: '',
    points: [],
    example: reviewedReleaseExamples[week]?.[0]
      ?? reviewedReliabilityExamples[week]?.[0]
      ?? weekSpec.days[0][1],
    sessions,
    difficulty: levelFor(week),
  });
});

export const nextjsCourseExpansion = {
  phases,
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: lessons.length }, (_, index) => index + 1),
};
