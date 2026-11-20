import { choice, locateError, repairCode, shortAnswer, versionedShortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';

// G10 owns the first twelve lessons and their three original questions. This
// file contributes their remaining daily practice and the fourteen later weeks.
const legacyIds = [
  'react-components', 'react-props', 'react-events-state', 'react-state',
  'react-forms-lists', 'react-effects-derived-state', 'react-reducer-context',
  'react-custom-hooks', 'react-async-data', 'react-routing-accessibility',
  'react-testing-performance', 'react-architecture-capstone',
];

const phases = [
  { id: 'react-phase-foundation', title: '1단계 · 컴포넌트와 상태', startWeek: 1, endWeek: 4, objective: 'JSX, props, 이벤트와 상태 갱신의 흐름을 읽습니다.' },
  { id: 'react-phase-ui', title: '2단계 · 사용자 입력과 Effect', startWeek: 5, endWeek: 8, objective: '목록, 폼, 외부 시스템 동기화, 재사용 로직을 다룹니다.' },
  { id: 'react-phase-data', title: '3단계 · 데이터 화면과 품질', startWeek: 9, endWeek: 12, objective: '비동기 데이터, 접근성, 테스트, 화면 경계를 연결합니다.' },
  { id: 'react-phase-patterns', title: '4단계 · React 패턴 확장', startWeek: 13, endWeek: 16, objective: '상태 모델, 조합, Context, 전환 경험을 설계합니다.' },
  { id: 'react-phase-reliability', title: '5단계 · 신뢰할 수 있는 화면', startWeek: 17, endWeek: 21, objective: '오류 경계, 성능, 보안, 접근성을 실제 흐름에서 점검합니다.' },
  { id: 'react-phase-capstone', title: '6단계 · 제품 기능 완성', startWeek: 22, endWeek: 26, objective: '라우팅 경계와 학습 기록 화면을 설계·검토합니다.' },
];

function escapedCodePattern(source) {
  return String(source)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
}

function repairedReactPattern(functionName, starterCode, repairBody, allowExistingBody = false) {
  const brokenBody = starterCode.slice(starterCode.indexOf('{') + 1, starterCode.lastIndexOf('}')).trim();
  // Require the correction inside the named function and explicitly reject
  // preserving the original broken body unless the unchanged statements are
  // independently valid and only need an added guard. This remains a
  // structure-only check; React rendering is not executed in the browser.
  const brokenBodyGuard = allowExistingBody ? '' : `(?![\\s\\S]*${escapedCodePattern(brokenBody)})`;
  return `^\\s*${brokenBodyGuard}[\\s\\S]*?function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?${escapedCodePattern(repairBody)}[\\s\\S]*?\\}\\s*$`;
}

const specs = [
  ['컴포넌트와 JSX', '작은 화면 조각을 입력과 출력이 분명한 컴포넌트로 나눕니다.', 'function Badge({ level }) { return <span>{level}</span>; }', '과정 수준을 여러 화면에서 표시할 때 가장 읽기 쉬운 구조는?', ['Badge 컴포넌트에 level prop 전달', '각 화면에서 같은 span을 복사', 'DOM을 전역 변수로 보관'], 0, 'function Badge() { return <span>기초</span>; }\nconsole.log(typeof Badge);', ['function'], ['function Badge({ level }) {', '  return <span>level</span>;', '}'], 2, '2번 줄은 prop 값이 아니라 글자 그대로 level을 표시합니다. JSX 표현식 `{level}`을 사용해야 합니다.', 'Badge', 'function Badge({ level }) {\n  return <span>level</span>;\n}', 'return <span>{level}</span>;', '받은 level prop을 텍스트로 렌더링한다.'],
  ['props 계약', '부모가 전달한 읽기 전용 입력을 자식이 표시용으로 사용합니다.', 'function CourseTitle({ title }) { return <h2>{title}</h2>; }', '자식 컴포넌트에 제목을 전달하는 React 입력은?', ['props', 'DOM dataset만', '전역 변수'], 0, 'function CourseTitle({ title }) { return <h2>{title}</h2>; }\n// title="React"', ['React'], ['function CourseTitle({ title }) {', '  title = "기본";', '  return <h2>{title}</h2>;', '}'], 2, '2번 줄은 전달받은 prop을 다시 대입합니다. prop은 읽기 전용 입력으로 취급해야 합니다.', 'CourseTitle', 'function CourseTitle({ title }) {\n  return <h2>제목</h2>;\n}', 'return <h2>{title}</h2>;', '전달받은 title을 h2에 표시한다.'],
  ['이벤트와 상태', '이벤트 처리기는 렌더링 중 실행하지 않고 사용자 동작 뒤 상태를 갱신합니다.', 'function SaveButton({ save }) { return <button onClick={save}>저장</button>; }', '클릭할 때만 save를 실행하려면?', ['onClick={save}', 'onClick={save()}', 'onClick="save"'], 0, 'const [count, setCount] = useState(0);\nsetCount((current) => current + 1);', ['1'], ['function SaveButton({ save }) {', '  return <button onClick={save()}>저장</button>;', '}'], 2, '2번 줄은 렌더링 중 save를 즉시 실행합니다. 함수 참조를 전달해야 클릭 뒤 실행됩니다.', 'Counter', 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => count + 1}>{count}</button>;\n}', 'return <button onClick={() => setCount((current) => current + 1)}>{count}</button>;', '클릭마다 최신 이전 count를 기준으로 1 증가시킨다.'],
  ['불변 상태 갱신', '배열과 객체 상태는 기존 값을 바꾸지 않고 새 값으로 갱신합니다.', 'setCourses((current) => [...current, course]);', '새 과정 하나를 추가하면서 기존 배열을 보존하는 표현은?', ['courses.push(course)', '[...courses, course]', 'courses = course'], 1, 'const next = [...["JS"], "React"];\nconsole.log(next.length);', ['2'], ['function addCourse(course) {', '  courses.push(course);', '  setCourses(courses);', '}'], 2, '2번 줄이 기존 상태 배열을 직접 바꾸고 3번 줄이 같은 참조를 전달합니다. 새 배열을 만들어 setter에 넘겨야 합니다.', 'renameProfile', 'function renameProfile(profile, name) {\n  profile.name = name;\n  return profile;\n}', 'return { ...profile, name };', '기존 profile의 다른 필드를 유지하면서 name만 바꾼 새 객체를 반환한다.'],
  ['폼과 목록 key', '제어 입력과 안정된 key로 편집 가능한 목록을 만듭니다.', 'items.map((item) => <li key={item.id}>{item.title}</li>)', '중간 삽입과 정렬이 가능한 목록에서 key로 알맞은 값은?', ['배열 인덱스', '항목의 안정된 id', '표시 순서'], 1, 'const [name, setName] = useState("");\nsetName("민");', ['민'], ['items.map((item, index) => (', '  <li key={index}>{item.title}</li>', '));'], 2, '2번 줄의 index는 재정렬·삽입 뒤 항목 정체성을 보장하지 않습니다. 안정된 item.id를 key로 사용하세요.', 'CourseForm', 'function CourseForm() {\n  const [title, setTitle] = useState("");\n  return <input value={title} />;\n}', 'return <input value={title} onChange={(event) => setTitle(event.target.value)} />;', '입력 변화가 title 상태를 갱신하는 제어 입력을 만든다.'],
  ['Effect와 파생값', 'Effect는 외부 시스템 동기화에만 쓰고 화면 계산은 렌더 중에 합니다.', 'const visible = items.filter((item) => item.done);', 'props 목록을 필터링해 보여 주는 계산에 먼저 필요한 것은?', ['Effect로 별도 state 저장', '렌더 중 계산', '전역 변수 변경'], 1, 'const visible = [1, 2, 3].filter((n) => n > 1);\nconsole.log(visible.length);', ['2'], ['useEffect(() => {', '  const connection = connect(roomId);', '  return () => connection.disconnect();', '}, []);'], 4, '4번 줄의 빈 의존성 배열은 Effect가 읽는 roomId를 반영하지 않습니다. roomId가 바뀌면 연결도 갱신해야 합니다.', 'Room', 'function Room({ roomId }) {\n  useEffect(() => { connect(roomId); }, []);\n}', '}, [roomId]);', 'roomId가 바뀌면 Effect가 새 방을 기준으로 다시 동기화한다.'],
  ['reducer와 Context', '서로 관련된 상태 전이와 전달 경로를 분리해 읽기 쉽게 합니다.', 'function reducer(state, action) { return { ...state, open: true }; }', '여러 이벤트가 같은 상태를 바꿀 때 규칙을 모으기 좋은 도구는?', ['useReducer', 'DOM 속성 변경', '전역 변수 대입'], 0, 'const next = { ...{ open: false }, open: true };\nconsole.log(next.open);', ['true'], ['function reducer(state, action) {', '  state.open = true;', '  return state;', '}'], 2, '2번 줄은 기존 state 객체를 직접 수정합니다. 새 객체를 만들어 반환해야 전이를 예측하기 쉽습니다.', 'panelReducer', 'function panelReducer(state, action) {\n  if (action.type === "open") return state;\n  return state;\n}', 'return { ...state, open: true };', 'open action에서 open이 true인 새 상태를 반환한다.'],
  ['사용자 정의 Hook', '반복되는 상태 로직을 Hook 규칙을 지키며 함수로 묶습니다.', 'function useDisclosure() { const [open, setOpen] = useState(false); return { open, setOpen }; }', 'Hook 호출 순서를 지켜야 하는 이유는?', ['상태를 호출 순서로 연결하기 때문', 'JSX를 반환할 수 없어서', '서버에 저장해야 해서'], 0, 'function useFlag() { const [on] = useState(false); return on; }\nconsole.log(typeof useFlag);', ['function'], ['function Panel({ enabled }) {', '  if (enabled) {', '    const [open] = useState(false);', '  }', '}'], 3, '3번 줄은 조건에 따라 Hook 호출 여부가 달라집니다. Hook은 컴포넌트 최상위에서 같은 순서로 호출해야 합니다.', 'useOpen', 'function useOpen() {\n  if (true) {\n    const [open, setOpen] = useState(false);\n  }\n}', 'const [open, setOpen] = useState(false);\n  return { open, setOpen };', '조건문 밖에서 Hook을 호출하고 상태와 setter를 반환한다.'],
  ['비동기 데이터', '로딩·성공·실패와 오래된 요청을 분리해 화면에 표시합니다.', 'useEffect(() => { const controller = new AbortController(); return () => controller.abort(); }, [query]);', '검색어가 바뀐 뒤 이전 결과가 최신 화면을 덮지 않게 하는 방법은?', ['이전 요청 취소 또는 식별', '모든 결과를 그대로 setState', '로딩 상태 제거'], 0, 'const controller = new AbortController();\ncontroller.abort();\nconsole.log(controller.signal.aborted);', ['true'], ['useEffect(() => {', '  fetchCourses(query).then(setCourses);', '}, [query]);'], 2, '2번 줄은 이전 요청을 취소하거나 최신 요청인지 확인하지 않고 상태를 갱신합니다. 늦은 응답이 최신 결과를 덮을 수 있습니다.', 'loadCourses', 'async function loadCourses(query) {\n  return fetch(`/api?q=${query}`);\n}', 'const response = await fetch(`/api?q=${query}`);\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();', 'HTTP 실패를 Error로 알리고 성공 응답의 JSON만 반환한다.'],
  ['라우팅과 접근성', '이동과 현재 화면 동작에 알맞은 HTML 의미를 선택합니다.', '<a href="/tracks/react">React 과정</a>', '다른 주소로 이동하는 조작에 알맞은 요소는?', ['button', 'a 링크', '클릭 div'], 1, 'const label = "과정 열기";\nconsole.log(label.length);', ['5'], ['function CourseLink() {', '  return <div onClick={() => navigate("/tracks/react")}>React</div>;', '}'], 2, '2번 줄은 링크 의미, 새 탭 열기, 키보드 동작을 제공하지 않는 div입니다. 목적지 이동에는 링크를 사용하세요.', 'IconButton', 'function IconButton() {\n  return <button><svg aria-hidden="true" /></button>;\n}', 'return <button aria-label="과정 열기"><svg aria-hidden="true" /></button>;', '아이콘만 있는 버튼에 목적을 알 수 있는 접근 가능한 이름을 제공한다.'],
  ['테스트와 성능', '사용자에게 보이는 결과를 테스트하고 측정 후 필요한 곳만 최적화합니다.', 'screen.getByRole("button", { name: "저장" })', '목록이 느리다는 제보 뒤 첫 번째로 할 일은?', ['모든 useMemo 추가', '대표 흐름 프로파일링', '컴포넌트 이름 변경'], 1, 'const names = ["저장", "취소"];\nconsole.log(names.includes("저장"));', ['true'], ['function SaveAction({ save }) {', '  return <span onClick={save}>저장</span>;', '}'], 2, '2번 줄의 span은 버튼 역할과 기본 키보드 동작이 없습니다. 실제 button을 사용해야 합니다.', 'SaveAction', 'function SaveAction({ save }) {\n  return <span onClick={save}>저장</span>;\n}', 'return <button type="button" onClick={save}>저장</button>;', '저장 동작에 실제 button과 접근 가능한 이름을 제공한다.'],
  ['화면 아키텍처', '공유 상태와 로컬 표시 상태를 컴포넌트 경계에 맞춰 둡니다.', 'function RecentAnswers() { const [expanded, setExpanded] = useState(false); }', '최근 답안 섹션에서만 쓰는 펼침 상태를 둘 위치는?', ['해당 섹션의 로컬 state', '모든 화면의 전역 state', 'DOM 속성'], 0, 'const completed = [true, false, true];\nconsole.log(completed.filter(Boolean).length);', ['2'], ['function ProgressActions() {', '  return <button><svg aria-hidden="true" /></button>;', '}'], 2, '2번 줄의 버튼에는 화면 읽기 사용자가 알 수 있는 이름이 없습니다. 텍스트나 aria-label을 제공해야 합니다.', 'RecentAnswers', 'function RecentAnswers() {\n  const [expanded] = useState(false);\n  return <button>최근 답안</button>;\n}', 'const [expanded, setExpanded] = useState(false);\n  return <button aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>최근 답안</button>;', '로컬 펼침 상태와 현재 상태를 나타내는 aria-expanded를 연결한다.'],
  ['상태 모델링', '서로 모순되는 boolean을 줄이기 위해 화면 상태를 명확히 표현합니다.', 'const [status, setStatus] = useState("idle");', '요청 화면에서 loading과 error가 동시에 true가 되는 것을 막기 좋은 모델은?', ['독립 boolean 여러 개', '하나의 status 값', 'DOM class만'], 1, 'const status = "loading";\nconsole.log(status === "loading");', ['true'], ['setLoading(true);', 'setError(true);', 'setData(null);'], 2, '2번 줄은 로딩 중이면서 오류인 모순 상태를 만들 수 있습니다. status 같은 단일 상태 모델로 전이를 제한하세요.', 'statusLabel', 'function statusLabel(status) {\n  return "완료";\n}', 'return status === "error" ? "오류" : "준비";', 'error 상태에는 오류 문구를, 그 외에는 준비 문구를 반환한다.'],
  ['컴포넌트 조합', 'children과 명시적 props를 이용해 재사용 가능한 레이아웃 경계를 만듭니다.', 'function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }', 'Card 내부에 다른 화면 조각을 넣는 입력은?', ['children', 'ref만', 'key만'], 0, 'function Card({ children }) { return <section>{children}</section>; }\nconsole.log(typeof Card);', ['function'], ['function Card({ children }) {', '  return <section>{children()}</section>;', '}'], 2, '2번 줄은 일반 React node인 children을 항상 함수처럼 호출합니다. 렌더링에는 `{children}`을 사용하세요.', 'Card', 'function Card({ title, children }) {\n  return <section>{children}</section>;\n}', 'return <section><h2>{title}</h2>{children}</section>;', 'title과 children을 모두 표시하는 카드 레이아웃을 반환한다.'],
  ['Context 범위', '자주 바뀌는 값과 소비자 범위를 고려해 Context 값을 설계합니다.', 'const ThemeContext = createContext("light");', 'Context provider 값이 바뀌면 일반적으로 다시 렌더링되는 대상은?', ['그 Context를 읽는 소비자', '모든 브라우저 탭', 'Provider 밖 DOM만'], 0, 'const theme = "dark";\nconsole.log(theme === "dark");', ['true'], ['function App() {', '  return <ThemeContext.Provider value={{ mode: "dark" }}>', '    <Page />', '  </ThemeContext.Provider>;', '}'], 2, '2번 줄은 렌더링마다 새 객체를 만들 수 있습니다. 값이 자주 변하지 않는다면 적절한 상태 경계와 필요 시 메모이제이션을 검토하세요.', 'ThemeProvider', 'function ThemeProvider({ children }) {\n  return <ThemeContext.Provider>{children}</ThemeContext.Provider>;\n}', 'return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;', 'Provider에 소비자가 읽을 value를 전달한다.'],
  ['ViewTransition 개념', 'React 19.3의 ViewTransition은 화면 전환 경험을 다루는 안정 기능 범위에서만 검토합니다.', '<ViewTransition><CourseDetail /></ViewTransition>', 'ViewTransition을 적용하기 전 확인할 사항은?', ['지원 환경과 실제 전환 흐름', '모든 상태 갱신에 무조건 적용', '서버 DB 설정'], 0, 'const transitionName = "course-detail";\nconsole.log(transitionName.startsWith("course"));', ['true'], ['function Detail() {', '  return <ViewTransition><h1>과정</h1></ViewTransition>;', '}'], 2, '2번 줄은 개념 예시입니다. 실제 사용 전 현재 React 19.3 문서와 브라우저 지원 범위, 전환할 경로를 확인해야 합니다.', 'CourseDetail', 'function CourseDetail() {\n  return <h1>과정</h1>;\n}', 'return <ViewTransition><h1>과정</h1></ViewTransition>;', '개념 예시로 제목을 ViewTransition 경계 안에 둔다.'],
  ['오류 화면', '렌더링 실패와 요청 실패를 구분해 사용자가 다음 행동을 알 수 있게 합니다.', 'if (error) return <p role="alert">불러오지 못했어요.</p>;', '요청 실패를 빈 목록과 구분해 알려주는 상태는?', ['error 상태', '빈 배열만', '숨은 console만'], 0, 'const error = new Error("network");\nconsole.log(error.message);', ['network'], ['if (error) {', '  return <p>목록이 없어요.</p>;', '}'], 2, '2번 줄은 실패 원인을 빈 결과처럼 표현합니다. 오류 상태와 다시 시도 방법을 구분해 안내해야 합니다.', 'ErrorNotice', 'function ErrorNotice({ error }) {\n  return null;\n}', 'return <p role="alert">{error.message}</p>;', '오류 메시지를 alert 역할의 문장으로 표시한다.'],
  ['렌더링 성능', '비싼 계산은 측정한 뒤 입력이 바뀔 때만 다시 계산하도록 경계를 정합니다.', 'const sorted = useMemo(() => sortCourses(courses), [courses]);', 'useMemo가 특히 도움이 될 수 있는 경우는?', ['항상 모든 값', '측정된 비싼 계산', '클릭 핸들러 이름'], 1, 'const count = [1, 2, 3].length;\nconsole.log(count);', ['3'], ['const sorted = useMemo(() => sortCourses(courses), []);', 'render(sorted);'], 1, '1번 줄의 빈 의존성 배열은 courses가 바뀌어도 정렬 결과를 갱신하지 않습니다. 계산이 읽는 courses를 의존성에 포함해야 합니다.', 'SortedCourses', 'function SortedCourses({ courses }) {\n  const sorted = useMemo(() => sortCourses(courses), []);\n  return <List items={sorted} />;\n}', 'const sorted = useMemo(() => sortCourses(courses), [courses]);', 'courses가 바뀔 때만 정렬 계산을 다시 수행한다.'],
  ['접근 가능한 폼', 'label, 오류 안내, 포커스 순서를 이용해 키보드와 보조 기술 흐름을 만듭니다.', '<label htmlFor="title">과정 이름</label>', '입력의 보이는 이름을 연결하는 label 속성은?', ['htmlFor', 'onClick', 'key'], 0, 'const id = "title";\nconsole.log(id.toUpperCase());', ['TITLE'], ['<label>과정 이름</label>', '<input id="title" />'], 1, '1번 줄의 label이 input id와 연결되지 않았습니다. htmlFor="title"을 제공해야 클릭과 접근 가능한 이름이 연결됩니다.', 'TitleField', 'function TitleField() {\n  return <input id="title" />;\n}', 'return <><label htmlFor="title">과정 이름</label><input id="title" /></>;', 'label과 input을 같은 id로 연결한다.'],
  ['보안 출력 경계', '신뢰하지 않는 문자열은 HTML로 해석하지 않고 텍스트로 표시합니다.', '<p>{comment}</p>', '사용자 댓글을 일반 텍스트로 렌더링하는 JSX는?', ['<p>{comment}</p>', '<p dangerouslySetInnerHTML={{ __html: comment }} />', '<script>{comment}</script>'], 0, 'const comment = "<b>안전</b>";\nconsole.log(comment.includes("<b>"));', ['true'], ['function Comment({ comment }) {', '  return <p dangerouslySetInnerHTML={{ __html: comment }} />;', '}'], 2, '2번 줄은 신뢰하지 않는 문자열을 HTML로 해석할 수 있습니다. 일반 텍스트는 JSX 중괄호로 렌더링하세요.', 'Comment', 'function Comment({ comment }) {\n  return <p dangerouslySetInnerHTML={{ __html: comment }} />;\n}', 'return <p>{comment}</p>;', 'comment를 HTML로 해석하지 않고 텍스트로 렌더링한다.'],
  ['라우팅 데이터 경계', '주소의 매개변수와 화면 데이터 로딩 실패를 별도 경계로 확인합니다.', 'const courseId = params.courseId;', '주소 매개변수로 읽은 id를 요청 전에 점검하는 이유는?', ['잘못된 주소와 요청 실패를 구분', '렌더링을 항상 두 번 하기 위해', 'id를 전역으로 바꾸기 위해'], 0, 'const courseId = "react";\nconsole.log(courseId.length);', ['5'], ['function CoursePage({ courseId }) {', '  fetch(`/api/courses/${courseId}`).then(setCourse);', '}'], 2, '2번 줄은 courseId의 부재나 요청 실패 상태를 화면에서 구분하지 않습니다. 입력 검증과 로딩·오류 상태가 필요합니다.', 'validCourseId', 'function validCourseId(courseId) {\n  return true;\n}', 'return typeof courseId === "string" && courseId.length > 0;', '비어 있지 않은 문자열 id일 때만 true를 반환한다.'],
  ['브라우저 저장소', '계정 없이 이어 하기 위해 JSON 직렬화와 손상 데이터 경계를 처리합니다.', 'localStorage.setItem("progress", JSON.stringify(progress));', '객체를 localStorage에 저장하기 전 필요한 작업은?', ['JSON.stringify', 'JSON.parse', 'Object.keys만'], 0, 'const raw = JSON.stringify({ done: 2 });\nconsole.log(typeof raw);', ['string'], ['localStorage.setItem("progress", { done: 2 });', 'const progress = JSON.parse(localStorage.getItem("progress"));'], 1, '1번 줄은 객체를 명시적으로 JSON 문자열로 만들지 않습니다. 저장소 값은 문자열이므로 stringify가 필요합니다.', 'readProgress', 'function readProgress(raw) {\n  return JSON.parse(raw);\n}', 'if (!raw) return { done: 0 };\n  return JSON.parse(raw);', '저장값이 없으면 기본 진도를 반환하고, 있으면 JSON을 파싱한다.'],
  ['코드 분할', '필요한 화면 경계를 기준으로 지연 로딩을 검토하고 로딩 상태를 제공합니다.', 'const SettingsPage = lazy(() => import("./SettingsPage.js"));', '지연 로딩 컴포넌트를 표시할 때 필요한 경계는?', ['Suspense fallback', '전역 window 변수', 'Effect 없는 fetch'], 0, 'const load = () => import("./Page.js");\nconsole.log(typeof load);', ['function'], ['const SettingsPage = lazy(() => import("./SettingsPage.js"));', 'return <SettingsPage />;'], 2, '2번 줄에는 로드 중 표시할 Suspense 경계가 없습니다. 지연 컴포넌트를 Suspense fallback으로 감싸야 합니다.', 'SettingsRoute', 'function SettingsRoute() {\n  return <SettingsPage />;\n}', 'return <Suspense fallback={<p>불러오는 중</p>}><SettingsPage /></Suspense>;', '지연 컴포넌트를 로딩 fallback을 가진 Suspense로 감싼다.'],
  ['상태 머신 흐름', '사용자 행동과 요청 결과에 따른 허용 전이를 문서화해 모순 상태를 줄입니다.', 'const transitions = { idle: ["loading"], loading: ["success", "error"] };', 'loading 상태에서 허용할 다음 상태를 명시하는 이점은?', ['의도하지 않은 전이 발견', '모든 오류 자동 해결', '서버 비용 제거'], 0, 'const next = ["success", "error"].includes("error");\nconsole.log(next);', ['true'], ['const transitions = { idle: ["loading"] };', 'setStatus("success");'], 2, '2번 줄은 idle에서 success로 직접 전이해 모델의 허용 흐름을 건너뜁니다. 요청 시작과 결과 전이를 분리해야 합니다.', 'canTransition', 'function canTransition(from, to) {\n  return true;\n}', 'return (transitions[from] ?? []).includes(to);', '정의된 전이 목록에 to가 있을 때만 true를 반환한다.'],
  ['캡스톤 설계', '작은 학습 화면의 정상·빈·오류·키보드 흐름을 함께 검토합니다.', 'function ProgressPage({ records }) { return <ProgressSummary records={records} />; }', '학습 기록 화면의 완료 조건에 포함할 항목은?', ['정상 데이터만', '빈 기록과 저장 실패 안내', '마우스 클릭만'], 1, 'const records = [];\nconsole.log(records.length === 0);', ['true'], ['function ExportButton() {', '  return <button><svg aria-hidden="true" /></button>;', '}'], 2, '2번 줄의 버튼에는 내보내기 목적을 알리는 텍스트나 aria-label이 없습니다. 키보드와 보조 기술 사용자가 알 수 있는 이름을 제공해야 합니다.', 'ExportButton', 'function ExportButton({ exportRecords }) {\n  return <button onClick={exportRecords}><svg aria-hidden="true" /></button>;\n}', 'return <button type="button" aria-label="기록 내보내기" onClick={exportRecords}><svg aria-hidden="true" /></button>;', '내보내기 동작을 실제 버튼과 접근 가능한 이름으로 제공한다.'],
  ['배포 전 학습 흐름 점검', '저장된 진도, 빈 화면, 오류 안내, 키보드 동작을 하나의 학습 흐름으로 검토합니다.', 'function ResumeLink({ lessonId }) { return <a href={`#/lesson/${lessonId}`}>이어 학습</a>; }', '브라우저 로컬 진도가 가리키는 단원이 없을 때 화면이 해야 할 일은?', ['깨진 링크를 그대로 연다', '안전한 과정 안내를 보여 준다', '저장소 전체를 즉시 지운다'], 1, 'const saved = null;\nconsole.log(saved === null);', ['true'], ['function ResumeLink({ lessonId }) {', '  return <div onClick={() => openLesson(lessonId)}>이어 학습</div>;', '}'], 2, '2번 줄의 div는 목적지 이동에 필요한 링크 의미와 기본 키보드 동작을 제공하지 않습니다. href가 있는 a 요소로 이어 학습 경로를 표현하세요.', 'ResumeLink', 'function ResumeLink({ lessonId }) {\n  return <div onClick={() => openLesson(lessonId)}>이어 학습</div>;\n}', 'return <a href={`#/lesson/${lessonId}`}>이어 학습</a>;', '이어 학습이라는 주소 이동을 href를 가진 링크로 제공하고, 없는 lessonId는 상위 화면에서 안전하게 처리한다.'],
];

// Editorially reviewed daily cases. Review them in small, source-backed batches.
const reviewedCases = {
  1: [
    ['JSX 중괄호', 'JSX에서 동적 값은 중괄호 안에 넣어요.', 'function Welcome({ name }) { return <h1>{name}</h1>; }\nconst view = <Welcome name="민지" />;'],
    ['컴포넌트 이름과 재사용', '대문자로 시작하는 컴포넌트를 한 번 정의하고 서로 다른 props로 재사용해요.', 'function CourseCard({ title, description }) {\n  return <article><h2>{title}</h2><p>{description}</p></article>;\n}\nconst reactCard = <CourseCard title="React" description="화면을 조각으로 구성해요." />;\nconst javaCard = <CourseCard title="Java" description="객체와 클래스를 배워요." />;'],
    ['JSX 단일 루트', '컴포넌트는 하나의 JSX 루트 또는 Fragment를 반환해요.', 'return <><h1>과정</h1><p>설명</p></>;'],
    ['조건부 렌더링', '조건이 참일 때만 필요한 JSX를 표현할 수 있어요.', 'function panelFor(isOpen) { return isOpen ? <Panel /> : null; }\nconst view = panelFor(false);'],
    ['목록 렌더링', '배열은 map으로 React 요소 목록으로 바꿀 수 있어요.', 'function CourseList({ courses }) {\n  return courses.map((course) => <li key={course.id}>{course.title}</li>);\n}\nconst view = <CourseList courses={[{ id: "react", title: "React" }]} />;'],
  ],
  2: [
    ['prop 전달', '부모는 JSX 속성으로 자식에게 데이터를 전달해요.', 'function CourseTitle({ title }) { return <h2>{title}</h2>; }\nconst course = { title: "React" };\nconst view = <CourseTitle title={course.title} />;'],
    ['prop 전달과 읽기 전용', '부모가 JSX 속성으로 전달한 title을 자식은 읽어 표시하며 다시 대입하지 않아요.', 'function CourseTitle({ title }) { return <h2>{title}</h2>; }\nfunction CoursePage() { return <CourseTitle title="React" />; }'],
    ['기본값', '구조 분해 기본값으로 선택 prop의 기본 표시를 정할 수 있어요.', 'function Badge({ level = "기초" }) { return <span>{level}</span>; }'],
    ['객체 prop', '객체 전체보다 필요한 필드를 명시하면 컴포넌트 계약이 읽기 쉬워져요.', 'function CourseMeta({ title, minutes }) { return <p>{title} · {minutes}분</p>; }\nconst view = <CourseMeta title="React" minutes={30} />;'],
    ['children', 'children은 부모가 컴포넌트 태그 사이에 넣은 React node예요.', 'function Panel({ children }) { return <section>{children}</section>; }\nconst view = <Panel>수강 목록</Panel>;'],
  ],
  3: [
    ['이벤트 참조', 'onClick에는 렌더링 중 실행 결과가 아니라 함수 참조를 전달해요.', '<button onClick={save}>저장</button>'],
    ['이벤트 참조와 인자 전달', '인자 없는 동작은 함수 참조를 넘기고, 추가 인자는 화살표 함수로 클릭 시점에 전달해요.', 'function CourseActions({ course, save, remove }) {\n  return <>\n    <button type="button" onClick={save}>저장</button>\n    <button type="button" onClick={() => remove(course.id)}>삭제</button>\n  </>;\n}'],
    ['함수형 갱신', '이전 상태에 의존하는 갱신은 함수형 setter를 사용해요.', 'setCount((current) => current + 1);'],
    ['배치된 갱신', '같은 이벤트에서 두 번 갱신해도 이전 값을 함수형 updater로 순서대로 연결해요.', 'setCount((current) => current + 1);\nsetCount((current) => current + 1);'],
    ['이벤트 전파', '필요할 때 event.stopPropagation으로 부모 클릭 처리를 막을 수 있어요.', 'function onDelete(event) { event.stopPropagation(); remove(course.id); }'],
  ],
  4: [
    ['객체 복사', '컴포넌트의 profile 상태를 직접 바꾸지 않고 새 객체를 setter에 전달해요. 바뀐 이름과 기존 level을 화면에 보여 줍니다.', 'import { useState } from "react";\n\nfunction ProfileEditor() {\n  const [profile, setProfile] = useState({ name: "민", level: 2 });\n  function rename(nextName) {\n    setProfile({ ...profile, name: nextName });\n  }\n  return <button onClick={() => rename("수")}>{profile.name} · 단계 {profile.level}</button>;\n}'],
    ['배열 추가', 'course를 props로 받고 함수형 updater가 기존 목록을 복사해 새 항목을 덧붙여요.', 'import { useState } from "react";\n\nfunction CourseAdder({ course }) {\n  const [courses, setCourses] = useState([{ id: "js", title: "JavaScript" }]);\n  function addCourse() {\n    setCourses((current) => [...current, course]);\n  }\n  return <button onClick={addCourse}>과정 추가 ({courses.length})</button>;\n}'],
    ['배열 제거', 'initialCourses와 idToRemove를 props로 받습니다. filter가 삭제할 항목을 제외한 새 state 배열을 반환하고, 남은 이름을 목록에 표시해요.', 'import { useState } from "react";\n\nfunction CourseList({ initialCourses, idToRemove }) {\n  const [courses, setCourses] = useState(initialCourses);\n  function removeCourse() {\n    setCourses((current) => current.filter((course) => course.id !== idToRemove));\n  }\n  return (\n    <>\n      <button type="button" onClick={removeCourse}>선택 과정 삭제</button>\n      <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>\n    </>\n  );\n}'],
    ['배열 항목 수정', 'map으로 바뀐 항목만 새 객체로 바꿔요.', 'setCourses((current) => current.map((course) => course.id === id ? { ...course, done: true } : course));'],
    ['상태 스냅샷', 'setter를 호출해도 현재 handler가 캡처한 렌더 값은 그대로예요.', 'function handleClick(count, setCount) { setCount(count + 1); return count; }\nconsole.log(handleClick(4, () => {})); // 4'],
  ],
  5: [
    ['제어 입력', 'useState로 관리하는 값을 input의 value에 표시하고, onChange에서 새 입력값을 바로 저장해요.', 'import { useState } from "react";\n\nfunction TitleEditor() {\n  const [title, setTitle] = useState("React");\n  return (\n    <label>과정 이름\n      <input value={title} onChange={(event) => setTitle(event.target.value)} />\n    </label>\n  );\n}'],
    ['label 연결', '보이는 label의 htmlFor와 입력의 id가 같아야 두 요소가 연결돼요.', 'function CourseTitleInput() {\n  return (\n    <>\n      <label htmlFor="course-title">과정 이름</label>\n      <input id="course-title" name="courseTitle" />\n    </>\n  );\n}'],
    ['안정된 key', 'courses 배열을 props로 받아 각 항목의 데이터 id를 key로 사용해요. 정렬되어도 같은 항목을 식별할 수 있습니다.', 'function CourseList({ courses }) {\n  return (\n    <ul>\n      {courses.map((course) => (\n        <li key={course.id}>{course.title}</li>\n      ))}\n    </ul>\n  );\n}'],
    ['폼 제출', '폼 제출 시 preventDefault로 불필요한 페이지 이동을 막고 상태로 처리해요.', 'function submit(event) { event.preventDefault(); save(title); }'],
    ['입력 오류', '오류 문구는 입력과 연결해 보조 기술 사용자가 원인을 알게 해요.', '<input aria-describedby="title-error" /><p id="title-error">이름을 입력하세요.</p>'],
  ],
  6: [
    ['외부 연결 수명', 'createConnection은 네트워크 없이 연결·해제 로그만 남기는 모형이에요. 실제 외부 연결은 Effect에서 시작하고 roomId 변경 전이나 화면이 사라질 때 정리합니다.', 'import { useEffect } from "react";\n\nfunction createConnection(roomId) {\n  return {\n    connect() { console.log(`연결: ${roomId}`); },\n    disconnect() { console.log(`해제: ${roomId}`); },\n  };\n}\n\nfunction ChatRoom({ roomId }) {\n  useEffect(() => {\n    const connection = createConnection(roomId);\n    connection.connect();\n    return () => connection.disconnect();\n  }, [roomId]);\n  return <p>채팅방: {roomId}</p>;\n}'],
    ['파생 목록', 'courses는 부모에서 받는 props예요. 완료 여부에 따라 계산한 항목을 화면에 바로 표시하며, 별도 state나 Effect는 만들지 않아요.', 'function CompletedCourses({ courses }) {\n  const visible = courses.filter((course) => course.done);\n  return (\n    <ul>\n      {visible.map((course) => <li key={course.id}>{course.title}</li>)}\n    </ul>\n  );\n}'],
    ['검색 동기화', 'query는 props예요. 아래 updateSearchLog는 네트워크 검색 대신 호출 시점만 기록하는 모형이며, Effect는 query가 바뀔 때 다시 동기화합니다.', 'import { useEffect } from "react";\n\nfunction updateSearchLog(query) {\n  console.log(`검색어 동기화: ${query}`);\n}\n\nfunction SearchResults({ query }) {\n  useEffect(() => {\n    updateSearchLog(query);\n  }, [query]);\n  return <p>검색어: {query}</p>;\n}'],
    ['Effect 정리', '요청이 끝나기 전에 query가 바뀌면 오래된 요청을 취소할 수 있어요.', 'useEffect(() => { const controller = new AbortController(); load(query, controller.signal); return () => controller.abort(); }, [query]);'],
    ['중복 state 줄이기', '목록을 저장하고 화면 표시 여부를 따로 저장하면 값이 엇갈릴 수 있어요.', 'const visible = courses.filter((course) => course.title.includes(query));'],
  ],
  7: [
    ['순수 reducer', '초기 상태의 필드는 보존하고, open action만 새 객체로 반영합니다. 처리하지 않는 action은 기존 상태를 그대로 반환해요.', 'const initialState = { open: false, query: "React" };\n\nfunction reducer(state, action) {\n  if (action.type === "open") return { ...state, open: true };\n  return state;\n}'],
    ['명시적 action', '버튼이 course props를 받고 클릭할 때 동작 종류와 대상 id를 reducer에 전달해요.', 'function CompleteCourseButton({ course, dispatch }) {\n  return (\n    <button type="button" onClick={() => dispatch({ type: "course/complete", id: course.id })}>\n      과정 완료\n    </button>\n  );\n}'],
    ['Context 소비', 'Header는 useContext로 가장 가까운 Provider 값을 읽고, Provider가 바뀌면 새 테마를 표시해요.', 'import { createContext, useContext } from "react";\n\nconst ThemeContext = createContext("light");\n\nfunction Header() {\n  const theme = useContext(ThemeContext);\n  return <span>{theme}</span>;\n}\n\nfunction App() {\n  return <ThemeContext.Provider value="dark"><Header /></ThemeContext.Provider>;\n}'],
    ['상태 소유 범위', '함께 바뀌는 화면 상태는 가까운 reducer에서 관리해요.', 'const [state, dispatch] = useReducer(courseReducer, initialState);'],
    ['기본 Context 값', 'Provider가 없을 때의 기본값도 소비 계약에 맞게 정해요.', 'const ThemeContext = createContext("light");'],
  ],
  8: [
    ['Hook 이름', '상태를 재사용하는 Hook은 소문자 use로 시작하고, 내부 state와 setter를 호출자에게 돌려줘요.', 'import { useState } from "react";\n\nfunction useDisclosure() {\n  const [open, setOpen] = useState(false);\n  return { open, setOpen };\n}'],
    ['Hook 호출 위치', 'Hook은 조건문이나 조기 반환보다 먼저 컴포넌트 최상위에서 같은 순서로 호출해요.', 'import { useState } from "react";\n\nfunction Panel({ enabled }) {\n  const [open, setOpen] = useState(false);\n  if (!enabled) return null;\n  return <button onClick={() => setOpen((current) => !current)}>{open ? "열림" : "닫힘"}</button>;\n}'],
    ['Hook 반환 계약', 'useDisclosure를 호출한 컴포넌트가 open 값과 열기·닫기 동작을 모두 사용할 수 있게 반환해요.', 'import { useState } from "react";\n\nfunction useDisclosure() {\n  const [open, setOpen] = useState(false);\n  return {\n    open,\n    show: () => setOpen(true),\n    hide: () => setOpen(false),\n  };\n}'],
    ['Effect를 포함한 Hook', '외부 연결을 감싼 Hook도 의존성과 정리 함수를 관리해요.', 'useEffect(() => { const id = subscribe(onChange); return () => unsubscribe(id); }, [onChange]);'],
    ['호출자 독립성', '각 컴포넌트가 Hook을 호출하면 서로 독립된 상태를 얻어요.', 'const [leftOpen, setLeftOpen] = useState(false); const [rightOpen, setRightOpen] = useState(false);'],
  ],
  9: [
    ['요청 상태 모델', '요청 단계는 idle·loading·success·error 중 하나의 status 값으로 관리해 동시에 참이 될 수 있는 boolean 조합을 피합니다.', 'import { useState } from "react";\n\nfunction RequestStatus() {\n  const [status, setStatus] = useState("idle");\n  return (\n    <>\n      <button type="button" onClick={() => setStatus("loading")}>요청 시작</button>\n      <p>현재 요청 상태: {status}</p>\n    </>\n  );\n}'],
    ['로딩 시작', 'fetchCourses와 setStatus는 호출자가 제공하는 함수예요. 응답을 기다리기 전에 loading으로 바꾸고, 성공·실패 결과를 각각 기록합니다.', 'async function loadCourses(query, fetchCourses, setStatus) {\n  setStatus("loading");\n  try {\n    const courses = await fetchCourses(query);\n    setStatus("success");\n    return courses;\n  } catch (error) {\n    setStatus("error");\n    throw error;\n  }\n}'],
    ['이전 요청 취소', 'load는 query와 AbortSignal을 받아 요청을 시작하는 로컬 모형이에요. 실제 요청 구현은 이 signal을 fetch에 전달하고 취소 오류를 처리해야 합니다.', 'import { useEffect, useState } from "react";\n\nfunction load(query, signal) {\n  return new Promise((resolve) => {\n    const timer = setTimeout(() => resolve(`검색 결과: ${query}`), 150);\n    signal.addEventListener("abort", () => clearTimeout(timer), { once: true });\n  });\n}\n\nfunction SearchResults({ query }) {\n  const [result, setResult] = useState("검색 대기");\n  useEffect(() => {\n    const controller = new AbortController();\n    load(query, controller.signal).then((value) => {\n      if (!controller.signal.aborted) setResult(value);\n    });\n    return () => controller.abort();\n  }, [query]);\n  return <p>{result}</p>;\n}'],
    ['실패와 빈 결과', '실패 상태와 정상적인 빈 목록을 다른 화면으로 안내해요.', 'if (status === "error") return <p role="alert">다시 시도해 주세요.</p>;'],
    ['요청 결과 분기', '성공한 목록이 비었는지와 요청 자체가 실패했는지를 구분해요.', 'if (status === "success" && courses.length === 0) return <p>과정이 없습니다.</p>;'],
  ],
  10: [
    ['주소 이동 링크', '목적지 주소가 있는 이동은 링크 의미로 표현해요. SPA 라우터를 쓰는 프로젝트는 같은 의미를 제공하는 라우터 링크를 사용합니다.', '<a href="/tracks/react">React 과정</a>'],
    ['동작 버튼', '화면 안에서 설명을 펼치고 접는 동작은 로컬 state를 가진 button으로 구현해요.', 'import { useState } from "react";\n\nfunction CourseDetails() {\n  const [expanded, setExpanded] = useState(false);\n  return (\n    <>\n      <button type="button" onClick={() => setExpanded((current) => !current)}>설명 펼치기</button>\n      {expanded && <p>React 과정 설명</p>}\n    </>\n  );\n}'],
    ['목적지 이후 포커스', '화면 이동 뒤 새 제목이 DOM에 표시되면 ref로 실제 포커스를 옮겨 키보드 위치 변화를 안내해요.', 'import { useEffect, useRef } from "react";\n\nfunction CoursePage({ course, pathname }) {\n  const headingRef = useRef(null);\n  useEffect(() => {\n    headingRef.current?.focus();\n  }, [pathname]);\n  return <h1 ref={headingRef} tabIndex={-1}>{course.title}</h1>;\n}'],
    ['현재 위치 표시', '현재 경로와 일치하는 항목에 aria-current를 표시해요.', '<a href="/tracks/react" aria-current="page">React</a>'],
    ['없는 경로 안내', '존재하지 않는 경로에는 안전한 안내와 돌아갈 경로를 제공해요.', 'return <main><h1>과정을 찾을 수 없습니다</h1><a href="/tracks">과정 목록</a></main>;'],
  ],
  11: [
    ['사용자 역할 조회', 'Vitest와 Testing Library가 설정된 테스트 파일에서 role/name 조회로 화면이 버튼 의미와 “저장” 이름을 제공하는지 확인해요.', 'import { render, screen } from "@testing-library/react";\nimport { expect, test } from "vitest";\n\nfunction SaveButton() {\n  return <button type="button">저장</button>;\n}\n\ntest("저장 버튼을 역할과 이름으로 찾는다", () => {\n  render(<SaveButton />);\n  expect(screen.getByRole("button", { name: "저장" }).textContent).toBe("저장");\n});'],
    ['사용자 동작', '서버 없이 버튼 동작을 저장 성공으로 모의하고 user-event로 클릭한 뒤 안내가 나타나는지 검사해요. 실제 서비스에서는 서버 저장이 성공한 뒤 메시지를 표시해야 합니다.', 'import { useState } from "react";\nimport { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\nimport { expect, test } from "vitest";\n\nfunction SavePanel() {\n  const [message, setMessage] = useState("");\n  return (\n    <>\n      <button type="button" onClick={() => setMessage("저장했어요")}>저장</button>\n      {message && <p role="status">{message}</p>}\n    </>\n  );\n}\n\ntest("저장 결과를 사용자에게 알린다", async () => {\n  const user = userEvent.setup();\n  render(<SavePanel />);\n  await user.click(screen.getByRole("button", { name: "저장" }));\n  expect(screen.getByRole("status").textContent).toBe("저장했어요");\n});'],
    ['측정한 계산 최적화', '큰 목록 필터가 실제 병목으로 측정되고 React Compiler의 자동 메모화가 적용되지 않는 경우에만 수동 useMemo를 검토하며, 읽는 props를 모두 의존성에 둡니다.', 'import { useMemo } from "react";\n\nfunction filterCourses(courses, query) {\n  return courses.filter((course) => course.title.includes(query));\n}\n\nfunction CourseResults({ courses, query }) {\n  const visible = useMemo(() => filterCourses(courses, query), [courses, query]);\n  return <ul>{visible.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;\n}'],
    ['불필요한 메모 방지', '빠른 계산은 매 렌더마다 실행해도 충분할 수 있어요.', 'const label = courses.length + "개 과정";'],
    ['접근성 회귀 검사', '테스트에서 이름 없는 아이콘 버튼을 찾을 수 있도록 접근 가능한 이름을 둬요.', '<button aria-label="과정 저장"><SaveIcon aria-hidden="true" /></button>'],
  ],
  12: [
    ['화면 상태 책임', '다른 화면과 공유하지 않는 열림 여부는 기록 목록 화면이 state를 소유해요.', 'import { useState } from "react";\n\nfunction RecentAnswersPanel() {\n  const [expanded, setExpanded] = useState(false);\n  return <p>최근 답안 목록은 {expanded ? "열림" : "닫힘"} 상태입니다.</p>;\n}'],
    ['의미 있는 조작', '버튼의 aria-expanded는 실제 상태와 맞추고 aria-controls가 가리키는 영역을 접어도 DOM에 유지해요.', 'import { useState } from "react";\n\nfunction RecentAnswersPanel() {\n  const [expanded, setExpanded] = useState(false);\n  return (\n    <>\n      <button type="button" aria-expanded={expanded} aria-controls="recent-answers" onClick={() => setExpanded((open) => !open)}>최근 답안</button>\n      <section id="recent-answers" hidden={!expanded}>최근 푼 문제 목록</section>\n    </>\n  );\n}'],
    ['빈 기록 안내', '빈 답안 목록은 이유를 알리고, 바로 과정을 선택해 계속 학습할 수 있는 링크도 제공합니다.', 'function RecentAnswers({ answers }) {\n  if (answers.length === 0) {\n    return (\n      <section>\n        <p>아직 답안이 없습니다.</p>\n        <a href="/tracks">과정 선택</a>\n      </section>\n    );\n  }\n  return <ul>{answers.map((answer) => <li key={answer.id}>{answer.text}</li>)}</ul>;\n}'],
    ['저장 실패 복구', '로컬 저장에 실패하면 보존되지 않았음을 알리고, 저장 함수를 다시 실행할 수 있는 동작을 제공합니다.', 'function SaveStatus({ saveState, retrySave }) {\n  if (saveState !== "error") return null;\n  return (\n    <div role="alert">\n      <p>기록을 저장하지 못했습니다.</p>\n      <button type="button" onClick={retrySave}>다시 저장</button>\n    </div>\n  );\n}'],
    ['이어 학습 경계', '저장된 목적지가 문자열로 확인될 때만 이어 학습 링크를 만들고, 기록이 없거나 잘못된 경우 과정 선택으로 안내해요.', 'function ContinueLearning({ lesson }) {\n  const href = typeof lesson?.href === "string" && lesson.href.length > 0 ? lesson.href : null;\n  if (!href) return <a href="/tracks">과정 선택</a>;\n  return <a href={href}>이어 학습</a>;\n}'],
  ],
  13: [
    ['배타적인 요청 상태', '요청 상태를 하나의 값으로 두면 loading과 error가 함께 참인 모순을 막을 수 있어요.', 'const request = { status: "error", message: "다시 시도해 주세요" };\nconsole.log(request.status);'],
    ['reducer 전이', 'reducer는 현재 상태와 action을 받아 새 상태를 반환해요.', 'function requestReducer(state, action) {\n  if (action.type === "succeeded") return { ...state, status: "success" };\n  return state;\n}\nconsole.log(requestReducer({ status: "loading" }, { type: "succeeded" }).status);'],
    ['빈 결과와 실패 구분', '요청 성공 뒤 목록이 비었는지 요청 자체가 실패했는지 따로 판단해요.', 'function statusFor(ok, courses) {\n  if (!ok) return "error";\n  return courses.length === 0 ? "empty" : "success";\n}\nconsole.log(statusFor(true, []));'],
    ['오래된 응답 차단', '최신 요청 ID와 응답 ID가 일치할 때만 화면 상태를 갱신해요.', 'function shouldApplyResponse(activeId, responseId) {\n  return activeId === responseId;\n}'],
    ['상태 전이 경계', '허용된 요청 상태와 전이마다 정상·거부 사례를 확인해요.', 'const statuses = ["idle", "loading", "success", "empty", "error"];\nconsole.log(statuses.length);'],
  ],
  14: [
    ['children 슬롯', '호출자가 전달한 JSX 조각은 children으로 받아 wrapper 안에 표시해요.', 'const cardProps = { children: "과정 목록" };\nconsole.log(cardProps.children);'],
    ['명시적 props', '컴포넌트가 필요한 입력을 이름이 분명한 props로 받게 해요.', 'function courseLabel({ title, minutes }) {\n  return `${title} · ${minutes}분`;\n}\nconsole.log(courseLabel({ title: "React", minutes: 20 }));'],
    ['레이아웃 조합', '레이아웃은 전달된 header와 children을 모두 표시하고 내부 구현에 결합하지 않아요.', 'const layout = { header: "React 과정", children: "수업 목록" };\nconsole.log(layout.children);'],
    ['안정된 목록 key', '재정렬할 수 있는 항목은 배열 위치가 아니라 항목의 고유 ID로 식별해요.', 'const courses = [{ id: "react" }, { id: "python" }];\nconsole.log(courses.map((course) => course.id).join(","));'],
    ['동작 요소 의미', '화면 안 동작은 키보드로 실행할 수 있는 이름 있는 button으로 표현해요.', 'const action = { element: "button", handler: "save" };\nconsole.log(action.handler);'],
  ],
  15: [
    ['공유 설정 범위', '깊게 중첩된 여러 화면에 공통으로 필요한 값에 Context를 고려해요.', 'const themeContextDefault = "light";\nconsole.log(themeContextDefault);'],
    ['Context 기본값', 'createContext는 컴포넌트 바깥에서 만들고 기본값은 Provider가 없을 때의 정적 대안으로 둬요.', 'const defaultTheme = "light";\nconsole.log(defaultTheme);'],
    ['Context 소비', 'useContext를 호출한 소비 컴포넌트가 가장 가까운 위쪽 Provider의 현재 값을 읽어요.', 'function themeLabel(theme) {\n  return theme === "dark" ? "어두운 화면" : "밝은 화면";\n}\nconsole.log(themeLabel("dark"));'],
    ['Context 값과 범위', 'React 19에서는 Context 자체를 provider로 렌더링하고 value로 값을 공급해요.', 'function ThemeProvider({ theme, children }) {\n  return <ThemeContext value={theme}>{children}</ThemeContext>;\n}'],
    ['Context 갱신과 소비자', 'Provider value가 바뀌면 해당 Context를 읽는 하위 소비자가 최신 값을 받는지 확인해요.', 'function labelForTheme(theme) {\n  return theme === "dark" ? "어두운 화면" : "밝은 화면";\n}\nconsole.log(labelForTheme("dark"));'],
  ],
};

Object.assign(reviewedCases, {
  16: [
    ['전환 업데이트', 'React 19.3에서 ViewTransition 경계의 enter/exit 전환은 Transition으로 표시한 상태 변경에 연결합니다.', 'function CoursePane({ open }) {\n  return open ? <ViewTransition><CourseDetail /></ViewTransition> : null;\n}'],
    ['시각 상태와 저장 결과', 'View Transition은 화면 전환을 조정할 뿐 저장 성공을 뜻하지 않으므로 저장 결과를 별도로 기다립니다.', 'async function saveBeforeNavigate(save, startTransition, setPage) {\n  const result = await save();\n  if (!result.ok) return false;\n  startTransition(() => setPage("next"));\n  return true;\n}'],
    ['안정된 항목 정체성', '전환 중 목록 항목을 기존 항목과 대응하려면 배열 순서가 바뀌어도 유지되는 데이터 id를 key로 사용합니다.', 'function CourseList({ courses }) {\n  return courses.map((course) => <article key={course.id}>{course.title}</article>);\n}'],
    ['키보드와 동작 의미', '화면 전환을 적용해도 이동 동작은 href가 있는 링크, 화면 안 동작은 이름 있는 button으로 제공합니다.', 'function NextAction({ onNext }) {\n  return <button type="button" onClick={onNext}>다음 과정</button>;\n}'],
    ['React 19.3 지원 경계', 'ViewTransition은 React 19.3 안정 기능이며 현재 공식 지원은 DOM renderer입니다. 프로젝트 버전과 renderer를 확인합니다.', 'import { ViewTransition } from "react";\nfunction MotionHeading({ title }) {\n  return <ViewTransition><h1>{title}</h1></ViewTransition>;\n}'],
  ],
  17: [
    ['렌더 오류 경계', 'Error Boundary는 하위 트리의 렌더 오류를 fallback으로 바꾸며 이벤트 처리기와 일반 비동기 오류의 포괄 처리기는 아닙니다.', 'import { Component } from "react";\n\nclass CourseBoundary extends Component {\n  constructor(props) { super(props); this.state = { failed: false }; }\n  static getDerivedStateFromError() { return { failed: true }; }\n  render() {\n    if (this.state.failed) return <p role="alert">과정을 표시하지 못했습니다.</p>;\n    return this.props.children;\n  }\n}'],
    ['복구 안내', 'fallback은 실패 사실과 가능한 다음 행동을 알려야 하며, 다시 시도는 실패 원인을 해소하거나 작업을 다시 시작해야 의미가 있습니다.', 'function ErrorFallback({ retry }) {\n  return <div role="alert"><p>과정을 불러오지 못했습니다.</p><button type="button" onClick={retry}>다시 시도</button></div>;\n}'],
    ['비동기 실패 상태', 'fetch와 같은 비동기 작업의 reject는 요청 흐름에서 잡아 오류 상태로 바꿉니다. Error Boundary가 일반 Promise reject를 자동 처리하지 않습니다.', 'async function loadCourses(fetchCourses, setState) {\n  setState({ status: "loading" });\n  try {\n    const courses = await fetchCourses();\n    setState({ status: "success", courses });\n  } catch (error) {\n    setState({ status: "error", error });\n  }\n}'],
    ['요청 다시 시도', '요청 실패를 표시한 뒤 button에서 실패한 요청을 실제로 다시 실행하는 함수를 호출합니다.', 'function RequestError({ message, retry }) {\n  return <div role="alert"><p>{message}</p><button type="button" onClick={retry}>다시 요청</button></div>;\n}'],
    ['입력 오류와 렌더 오류', '입력값 오류는 입력 옆 검증 안내로 표시하고 Error Boundary가 다루는 렌더링 오류와 구분합니다.', 'function EmailField({ email, onEmailChange }) {\n  const invalid = email.length > 0 && !email.includes("@");\n  return <><label htmlFor="email">이메일</label><input id="email" value={email} onChange={(event) => onEmailChange(event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? "email-error" : undefined} />{invalid && <p id="email-error" role="alert">이메일 형식을 확인하세요.</p>}</>;\n}'],
  ],
  18: [
    ['실측 후 최적화', '실제 느린 상호작용과 React Profiler 측정으로 병목을 확인한 뒤 최적화 효과를 비교합니다.', 'import { Profiler } from "react";\n\nfunction CourseTree({ onRender, children }) {\n  return <Profiler id="course-tree" onRender={onRender}>{children}</Profiler>;\n}'],
    ['계산 의존성', '수동 useMemo를 쓸 때 계산이 읽는 모든 반응형 값과 의존성을 맞추고, React Compiler가 적용된 프로젝트인지도 확인합니다.', 'const visibleCourses = courses.filter((course) => course.title.includes(query));\nconsole.log(visibleCourses.length);'],
    ['함수 참조 안정성', '수동 useCallback은 측정된 memo 소비자 등 참조 안정성이 실제로 필요할 때 고려하고, React Compiler의 자동 최적화 범위와 구분합니다.', 'const sameReference = Object.is(save, save);\nconsole.log(sameReference);'],
    ['Context 소비 범위', 'Profiler에서 자주 바뀌는 Context 값이 무관한 소비자를 갱신한다고 확인되면 책임과 변경 주기에 맞춰 Context를 분리하고 다시 측정합니다.', 'import { createContext } from "react";\n\nconst ThemeContext = createContext("light");\nconst TypingContext = createContext("");\n\nfunction App({ theme, typing }) {\n  return <ThemeContext value={theme}><TypingContext value={typing}><Page /></TypingContext></ThemeContext>;\n}'],
    ['큰 목록 비용', '큰 목록이 실측 병목일 때 페이지네이션이나 가상화를 검토하고 화면에 필요한 구간만 계산해 안정된 key로 렌더링합니다.', 'function getVisibleCourses(courses, start, pageSize) {\n  return courses.slice(start, start + pageSize);\n}\nconsole.log(getVisibleCourses(["React", "Python", "Java"], 1, 1)[0]);'],
  ],
});

const foundationRepairVariants = {
  '1-4': ['OpenPanel', 'function OpenPanel({ isOpen }) {\n  return null;\n}', 'return isOpen ? <section>과정</section> : null;', 'isOpen이 true일 때만 과정 section을 렌더링한다.'],
  '1-5': ['CourseList', 'function CourseList({ courses }) {\n  return null;\n}', 'return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '각 과정의 안정된 id를 key로 사용해 목록을 렌더링한다.'],
  '2-4': ['CourseMeta', 'function CourseMeta({ title, minutes }) {\n  return <p>{title}</p>;\n}', 'return <p>{title} · {minutes}분</p>;', 'title과 minutes prop을 함께 표시한다.'],
  '2-5': ['Panel', 'function Panel({ children }) {\n  return null;\n}', 'return <section>{children}</section>;', '부모가 전달한 children을 section 안에 렌더링한다.'],
  '3-4': ['IncrementButton', 'function IncrementButton({ count, setCount }) {\n  return <button onClick={() => {\n    setCount(count + 1);\n    setCount(count + 1);\n  }}>두 번 추가</button>;\n}', 'return <button onClick={() => {\n    setCount((current) => current + 1);\n    setCount((current) => current + 1);\n  }}>두 번 추가</button>;', '한 번 클릭할 때 함수형 updater 두 개를 큐에 넣어 count를 2 증가시킨다.'],
  '3-5': ['DeleteButton', 'function DeleteButton({ remove, id }) {\n  function onDelete(event) {\n    remove(id);\n  }\n  return <button onClick={onDelete}>삭제</button>;\n}', 'function onDelete(event) {\n    event.stopPropagation();\n    remove(id);\n  }\n  return <button onClick={onDelete}>삭제</button>;', '삭제 버튼이 부모 카드 안에 있어도 부모 click handler로 전파하지 않고 해당 id를 삭제한다.'],
  '4-4': ['MarkDone', 'function MarkDone({ courses, setCourses, id }) {\n  return courses.map((course) => {\n    if (course.id === id) course.done = true;\n    return course;\n  });\n}', 'setCourses((current) => current.map((course) => course.id === id ? { ...course, done: true } : course));\n  return null;', '기존 과정 배열과 항목을 직접 바꾸지 않고 id가 일치하는 항목만 복사해 done을 변경한다.'],
  '4-5': ['AddTwice', 'function AddTwice({ count, setCount }) {\n  setCount(count + 1);\n  setCount(count + 1);\n  return count;\n}', 'setCount((current) => current + 1);\n  setCount((current) => current + 1);\n  return count;', '현재 렌더의 count snapshot은 그대로 두고 updater 두 개를 큐에 넣어 다음 state를 두 번 증가시킨다.'],
  '5-1': ['TitleInput', 'function TitleInput({ title, setTitle }) {\n  return <input value={title} />;\n}', 'return <input value={title} onChange={(event) => setTitle(event.target.value)} />;', '입력값을 state와 연결하고 변경 처리기를 제공한다.'],
  '5-4': ['submitTitle', 'function submitTitle(event, title, save) {\n  save(title.trim());\n  return title;\n}', 'event.preventDefault();\n  save(title.trim());\n  return title;', '기본 폼 제출을 취소한 뒤 정리한 제목을 저장한다.', true],
  '5-5': ['CourseField', 'function CourseField({ title, error, onChange }) {\n  return <><label>과정 이름</label><input id="course-title" value={title} onChange={onChange} />{error && <p>{error}</p>}</>;\n}', 'return <><label htmlFor="course-title">과정 이름</label><input id="course-title" value={title} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? "course-title-error" : undefined} />{error && <p id="course-title-error">{error}</p>}</>;', 'label을 입력에 연결하고 오류가 있을 때 입력과 오류 설명의 id 관계를 연결한다.'],
  '6-4': ['useCourses', 'function useCourses(query) {\n  useEffect(() => { fetchCourses(query); }, [query]);\n  return query;\n}', 'useEffect(() => { const controller = new AbortController();\n    fetchCourses(query, { signal: controller.signal });\n    return () => controller.abort();\n  }, [query]);\n  return query;', 'query별 요청에 AbortController signal을 전달하고 cleanup에서 취소한다.'],
  '6-5': ['visibleCourses', 'function visibleCourses(courses, query) {\n  const [visible, setVisible] = useState([]);\n  return visible;\n}', 'return courses.filter((course) => course.title.includes(query));', '화면 표시용 목록을 현재 입력에서 계산해 반환한다.'],
  '7-4': ['courseReducer', 'function courseReducer(state, action) {\n  if (action.type === "query") return { query: action.value };\n  if (action.type === "complete") return state;\n  return state;\n}', 'if (action.type === "query") return { ...state, query: action.value };\n  if (action.type === "complete") return { ...state, completedIds: [...state.completedIds, action.id] };\n  return state;', 'query와 완료 action을 같은 소유 reducer에서 처리하고 변경하지 않은 state 필드를 모두 보존한다.'],
  '7-5': ['ThemeLabel', 'function ThemeLabel() {\n  return <span>light</span>;\n}', 'const theme = useContext(ThemeContext);\n  return <span>{theme}</span>;', 'Context 기본값을 고정 문자로 대체하지 않고 소비해 현재 테마를 표시한다.'],
  '8-4': ['useSubscription', 'function useSubscription(source, onChange) {\n  useEffect(() => source.subscribe(onChange), [source]);\n  return null;\n}', 'useEffect(() => { const unsubscribe = source.subscribe(onChange); return () => unsubscribe(); }, [source, onChange]);\n  return null;', '구독 Effect를 정리하고 읽은 source와 onChange가 바뀌면 다시 동기화한다.'],
  '8-5': ['useDisclosure', 'let open = false;\nfunction useDisclosure() {\n  return open;\n}', 'const [open, setOpen] = useState(false);\n  return { open, setOpen };', '각 custom Hook 호출 안에 독립 state를 만들고 호출자가 쓸 값과 setter를 반환한다.'],
  '9-4': ['CoursesPanel', 'function CoursesPanel({ status, courses }) {\n  return <ul>{courses.map((course) => <li>{course.title}</li>)}</ul>;\n}', 'if (status === "loading") return <p>불러오는 중</p>;\n  if (status === "error") return <p role="alert">다시 시도하세요</p>;\n  if (status === "success" && courses.length === 0) return <p>검색 결과가 없습니다.</p>;\n  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '로딩·오류·성공 빈 결과·성공 목록을 구분하고 목록에 안정된 key를 제공한다.'],
  '9-5': ['courseMessage', 'function courseMessage(status, courses) {\n  if (status === "error" || courses.length === 0) return "검색 결과가 없습니다";\n  return "불러오는 중";\n}', 'if (status === "loading") return "불러오는 중";\n  if (status === "error") return "요청에 실패했습니다";\n  if (status === "success" && courses.length === 0) return "검색 결과가 없습니다";\n  if (status === "success") return `${courses.length}개 과정`;\n  return "요청 전";', '요청 전·로딩·오류·빈 결과·성공 데이터 상태마다 알맞은 결과를 반환한다.'],
  '10-4': ['CurrentCourseLink', 'function CurrentCourseLink({ pathname }) {\n  return <a href="/tracks/react">React</a>;\n}', 'return <a href="/tracks/react" aria-current={pathname === "/tracks/react" ? "page" : undefined}>React</a>;', '현재 경로와 일치할 때만 aria-current="page"를 제공한다.'],
  '10-5': ['MissingCoursePage', 'function MissingCoursePage() {\n  return <main><h1>과정을 찾을 수 없습니다</h1></main>;\n}', 'return <main><h1>과정을 찾을 수 없습니다</h1><a href="/tracks">과정 목록</a></main>;', '존재하지 않는 경로 안내와 유효한 과정 목록 링크를 함께 제공한다.'],
  '11-4': ['CourseCount', 'function CourseCount({ courses }) {\n  const label = useMemo(() => `${courses.length}개 과정`, [courses.length]);\n  return <p>{label}</p>;\n}', 'const label = `${courses.length}개 과정`;\n  return <p>{label}</p>;', '측정된 비용이 무시할 만큼 작고 참조 안정성이 필요하지 않은 문자열은 직접 계산한다.'],
  '11-5': ['SaveIconButton', 'function SaveIconButton({ save }) {\n  return <button type="button" onClick={save}><SaveIcon aria-hidden="true" /></button>;\n}', 'return <button type="button" aria-label="과정 저장" onClick={save}><SaveIcon aria-hidden="true" /></button>;', '아이콘 버튼에 accessible name을 제공해 역할·이름 쿼리와 키보드 사용을 지원한다.'],
  '12-4': ['SaveStatus', 'function SaveStatus({ saveState }) {\n  if (saveState === "error") return <p>저장되었습니다.</p>;\n  return null;\n}', 'if (saveState === "error") return <p role="alert">기록을 저장하지 못했습니다. 페이지를 닫기 전에 답안을 복사해 주세요.</p>;\n  return <p>저장되었습니다.</p>;', '저장 실패를 alert로 알리고 페이지를 닫기 전 답안을 복사하라는 다음 행동을 안내한다.'],
  '12-5': ['ResumeLink', 'function ResumeLink({ lesson }) {\n  return <a href={lesson.href}>이어 학습</a>;\n}', 'return lesson?.href ? <a href={lesson.href}>이어 학습</a> : <a href="/tracks">과정 선택</a>;', '저장한 단원과 유효한 주소가 있을 때만 이어 학습 링크를 만들고 없으면 과정 선택을 제공한다.'],
  '13-4': ['shouldApplyResponse', 'function shouldApplyResponse(activeId, responseId) {\n  return true;\n}', 'return activeId === responseId;', '최신 요청과 응답의 ID가 같을 때에만 결과를 반영한다.'],
  '13-5': ['isFinalStatus', 'function isFinalStatus(status) {\n  return false;\n}', 'return status === "success" || status === "error";', '요청의 성공 또는 실패가 끝난 상태인지 구분한다.'],
  '14-4': ['CourseList', 'function CourseList({ courses }) {\n  return <ul>{courses.map((course, index) => <li key={index}>{course.title}</li>)}</ul>;\n}', 'return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '정렬과 삽입 뒤에도 과정 항목의 고유 id를 key로 사용한다.'],
  '14-5': ['SaveAction', 'function SaveAction({ save }) {\n  return <span onClick={save}>저장</span>;\n}', 'return <button type="button" onClick={save}>저장</button>;', '저장 동작을 기본 키보드 실행을 지원하는 button으로 표시한다.'],
  '15-4': ['ThemeProvider', 'function ThemeProvider({ theme, children }) {\n  return <ThemeContext>{children}</ThemeContext>;\n}', 'return <ThemeContext value={theme}>{children}</ThemeContext>;', 'React 19 Context provider가 theme 값을 소비자 하위 트리에 전달한다.'],
  '15-5': ['ThemeLabel', 'function ThemeLabel() {\n  return <span>기본</span>;\n}', 'const theme = useContext(ThemeContext);\n  return <span>{theme === "dark" ? "어두운 화면" : "밝은 화면"}</span>;', '같은 ThemeContext를 소비하고 현재 값에 맞는 테마 문구를 렌더링한다.'],
  '16-5': ['MotionHeading', 'function MotionHeading({ title }) {\n  return <h1>{title}</h1>;\n}', 'return <ViewTransition><h1>{title}</h1></ViewTransition>;', '전환 대상 제목을 ViewTransition 경계 안에 렌더링한다.'],
  '17-5': ['RetryAction', 'function RetryAction({ status, retry }) {\n  return null;\n}', 'if (status !== "error") return null;\n  return <button type="button" onClick={retry}>다시 시도</button>;', '오류 상태에만 키보드로 실행 가능한 다시 시도 버튼을 표시한다.'],
  '18-5': ['CourseNames', 'function CourseNames({ courses, query }) {\n  return courses.map((course) => course.title);\n}', 'return useMemo(() => courses.filter((course) => course.title.includes(query)), [courses, query]).map((course) => course.title);', 'courses 또는 query가 바뀔 때 갱신되는 필터 결과의 제목 배열을 반환한다.'],
  '19-5': ['FieldHint', 'function FieldHint({ id, message }) {\n  return <p>{message}</p>;\n}', 'return <p id={id} role="alert">{message}</p>;', '입력과 연결할 수 있는 id와 오류 상태를 알리는 역할을 안내 요소에 제공한다.'],
  '20-5': ['CommentText', 'function CommentText({ comment }) {\n  return <div dangerouslySetInnerHTML={{ __html: comment }} />;\n}', 'return <p>{comment}</p>;', '신뢰하지 않는 댓글을 HTML이 아닌 텍스트로 렌더링한다.'],
  '21-5': ['isValidCourseId', 'function isValidCourseId(courseId) {\n  return true;\n}', 'return typeof courseId === "string" && courseId.length > 0;', '비어 있지 않은 문자열 식별자일 때만 true를 반환한다.'],
  '22-4': ['persistProgress', 'function persistProgress(storage, key, value) {\n  storage.setItem(key, JSON.stringify(value));\n  return "저장 완료";\n}', 'try {\n    storage.setItem(key, JSON.stringify(value));\n    return { ok: true };\n  } catch (error) {\n    return { ok: false, error };\n  }', '쓰기 예외를 성공과 구분하고 실패 때 저장되었다고 알리지 않는다.', true],
  '23-4': ['SettingsRoute', 'function SettingsRoute({ SettingsPage }) {\n  return <SettingsPage />;\n}', 'return <Suspense fallback={<p>설정을 불러오는 중입니다.</p>}><SettingsPage /></Suspense>;', '지연 로드 자식이 대기하는 동안 읽을 수 있는 fallback을 제공한다.'],
  '24-4': ['canTransition', 'function canTransition(from, to, transitions) {\n  return true;\n}', 'return (transitions[from] ?? []).includes(to);', '현재 상태에 정의된 목적 상태로만 이동을 허용한다.'],
  '22-5': ['parseSavedProgress', 'function parseSavedProgress(raw) {\n  return JSON.parse(raw);\n}', 'if (!raw) return { done: 0 };\n  try { return JSON.parse(raw); } catch { return { done: 0 }; }', '값이 없거나 JSON이 손상되어도 안전한 기본 진도 객체를 반환한다.', true],
  '23-5': ['AsyncCoursePage', 'function AsyncCoursePage({ CoursePage }) {\n  return <CoursePage />;\n}', 'return <Suspense fallback={<p>불러오는 중</p>}><CoursePage /></Suspense>;', '지연 로드 화면에 사용자가 볼 수 있는 Suspense 대기 UI를 제공한다.'],
  '24-5': ['mayDispatch', 'function mayDispatch(from, to, transitions) {\n  return true;\n}', 'return (transitions[from] ?? []).includes(to);', '현재 상태에서 정의한 전이 목록에 목적 상태가 있을 때만 true를 반환한다.'],
  '25-4': ['AnswerControls', 'function AnswerControls({ submitting, feedback }) {\n  return <span onClick={submit}>제출</span>;\n}', 'return <><button type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? "제출 중" : "답안 제출"}</button>{feedback && <p role="status">{feedback}</p>}</>;', '키보드로 제출할 수 있는 실제 submit 버튼과 결과 상태 안내를 제공한다.'],
  '25-5': ['LearningPanel', 'function LearningPanel({ loadStatus, saveStatus, exercises, draft, onChange, onSubmit, retry }) {\n  if (loadStatus === "error") return null;\n  return <QuestionList exercises={exercises} />;\n}', 'if (loadStatus === "loading") return <p>문항을 불러오는 중입니다.</p>;\n  if (loadStatus === "error") return <div role="alert"><p>문항을 불러오지 못했습니다.</p><button type="button" onClick={retry}>다시 시도</button></div>;\n  if (exercises.length === 0) return <p>아직 문항이 없습니다.</p>;\n  return <form onSubmit={(event) => { event.preventDefault(); onSubmit(draft); }}><QuestionList exercises={exercises} /><label htmlFor="answer">답안</label><textarea id="answer" value={draft} onChange={(event) => onChange(event.target.value)} /><button type="submit">제출</button>{saveStatus === "success" && <p role="status">저장되었습니다.</p>}{saveStatus === "error" && <p role="alert">저장에 실패했습니다. 답안을 유지하고 다시 시도하세요.</p>}</form>;', 'loading·오류·빈 상태를 구분하고 재시도와 답안 입력을 제공한다. 기본 form 이동을 막고 저장 성공·실패를 알리며 성공 전까지 controlled 초안을 비우지 않는다.'],
  '26-4': ['ResumeLink', 'function ResumeLink({ href }) {\n  return <div onClick={() => openLesson(href)}>이어 학습</div>;\n}', 'if (!href) return <a href="/tracks">과정 선택</a>;\n  return <a href={href}>이어 학습</a>;', '과정 카탈로그에서 확인한 href를 링크로 제공하고 값이 없으면 과정 선택으로 안내한다.'],
  '26-4': ['ResumeLink', 'function ResumeLink({ href }) {\n  return <div onClick={() => openLesson(href)}>이어 학습</div>;\n}', 'if (!href) return <a href="/tracks">과정 선택</a>;\n  return <a href={href}>이어 학습</a>;', '과정 카탈로그에서 확인한 href를 링크로 제공하고 값이 없으면 과정 선택으로 안내한다.'],
  '26-5': ['ResumeTarget', 'function ResumeTarget({ lesson }) {\n  return <a href={lesson.href}>이어 학습</a>;\n}', 'return lesson?.href ? <a href={lesson.href}>이어 학습</a> : <a href="/tracks">과정 선택</a>;', '저장한 단원 주소가 있을 때만 이어 학습 링크를 만들고 없으면 과정 선택으로 안내한다.'],
};

Object.assign(foundationRepairVariants, {
  '19-4': ['ErrorSummary', 'function ErrorSummary({ errors }) {\n  return <ul>{errors.map((error) => <li>{error.message}</li>)}</ul>;\n}', 'return <ul aria-label="입력 오류">{errors.map((error) => <li key={error.id}><a href={"#" + error.fieldId}>{error.message}</a></li>)}</ul>;', '오류마다 안정된 key를 주고 해당 입력으로 이동할 수 있는 링크를 제공한다.'],
  '16-4': ['NextAction', 'function NextAction({ onNext }) {\n  return <span onClick={onNext}>다음 과정</span>;\n}', 'return <button type="button" onClick={onNext}>다음 과정</button>;', '화면 전환과 별개로 다음 동작을 키보드 실행 가능한 button으로 제공한다.'],
  '17-4': ['ErrorNotice', 'function ErrorNotice({ error, retry }) {\n  return <p>{error.message}</p>;\n}', 'return <div><p role="alert">{error.message}</p><button type="button" onClick={retry}>다시 시도</button></div>;', '오류 사실을 알리고 버튼이 전달받은 재시도 동작을 실행하게 한다.'],
  '17-5': ['EmailField', 'function EmailField({ email, onEmailChange }) {\n  if (!email.includes("@")) throw new Error("잘못된 입력");\n  return <input type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />;\n}', 'const invalid = email.length > 0 && !email.includes("@");\n  return <><label htmlFor="email">이메일</label><input id="email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? "email-error" : undefined} />{invalid && <p id="email-error" role="alert">이메일 형식을 확인하세요.</p>}</>;', '입력 검증 실패는 렌더 예외로 던지지 않고, 사용자가 값을 수정할 수 있도록 controlled 입력과 연결된 오류 안내로 표시한다.'],
  '18-4': ['App', 'function App({ theme, typing }) {\n  return <AppContext value={{ theme, typing }}><Page /></AppContext>;\n}', 'return <ThemeContext value={theme}><TypingContext value={typing}><Page /></TypingContext></ThemeContext>;', '측정된 갱신 경계를 안정된 테마와 자주 바뀌는 입력 Context로 분리한다.'],
  '18-5': ['getVisibleCourses', 'function getVisibleCourses(courses, start, pageSize) {\n  return courses;\n}', 'return courses.slice(start, start + pageSize);', '페이지 구간의 항목만 반환해 화면 렌더 범위를 제한한다.'],
  '21-4': ['LessonPage', 'function LessonPage({ loading, error, lesson, retry }) {\n  if (loading) return <Spinner />;\n  return <Lesson lesson={lesson} />;\n}', 'if (loading) return <Spinner />;\n  if (error) return <div role="alert"><p>단원을 불러오지 못했습니다.</p><button type="button" onClick={retry}>다시 시도</button></div>;\n  if (!lesson) return <p>단원을 찾을 수 없습니다.</p>;\n  return <Lesson lesson={lesson} />;', 'loading·요청 오류·없는 단원·성공 데이터를 각각 안내하고 오류에서 재시도할 수 있게 한다.'],
  '21-5': ['NextLesson', 'function NextLesson({ href }) {\n  return <p>다음 단원</p>;\n}', 'return <a href={href}>다음 단원</a>;', '실제 목적지가 있는 링크로 브라우저 이동 기록과 기본 키보드 동작을 보존한다.'],
});

const foundationDailyCases = {
  '1-1': ['JSX 중괄호', 'JSX에서 name 변수 값을 제목에 표시하는 올바른 표현은?', ['`<h1>{name}</h1>`', '`<h1>name</h1>`', '`<h1>${name}</h1>`'], 0, 'const level = "기초";\nconsole.log(level);', ['기초'], ['function Welcome({ name }) {', '  return <h1>name</h1>;', '}'], 2, '2번 줄은 name 값을 읽지 않고 글자 그대로 name을 표시합니다. JSX 값은 {name}처럼 중괄호 안에 넣어야 합니다.'],
  '1-2': ['컴포넌트 이름', '사용자 정의 React 컴포넌트를 JSX에서 구분하기 위한 이름 규칙은?', ['소문자로 시작', '대문자로 시작', '숫자로 시작'], 1, 'function CourseCard() { return <article>React</article>; }\nconsole.log(typeof CourseCard);', ['function'], ['function courseCard() {', '  return <article>React</article>;', '}', 'const view = <courseCard />;'], 4, '4번 줄의 소문자 courseCard는 사용자 정의 컴포넌트가 아니라 HTML 태그처럼 해석됩니다. 컴포넌트 이름은 대문자로 시작해야 합니다.'],
  '1-3': ['JSX 단일 루트', '제목과 설명을 함께 반환할 때 여러 JSX 요소를 묶는 표현은?', ['`<>...</>`', '`<script>...</script>`', '`return`을 두 번 작성'], 0, 'const open = true;\nconsole.log(open ? "open" : "closed");', ['open'], ['function CourseIntro() {', '  return <h1>과정</h1>;', '  <p>설명</p>;', '}'], 3, '3번 줄의 p는 return 뒤에 도달할 수 없습니다. 두 요소는 Fragment 안에 함께 넣어 하나의 JSX 트리로 반환해야 합니다.'],
  '2-1': ['prop 전달', '부모가 course.title 값을 CourseTitle에 전달하는 JSX는?', ['`<CourseTitle title={course.title} />`', '`CourseTitle.title = course.title`', '`<CourseTitle>{title}</CourseTitle>`'], 0, 'const course = { title: "React" };\nconsole.log(course.title);', ['React'], ['function CourseTitle({ title }) {', '  return <h2>{title}</h2>;', '}', 'const view = <CourseTitle />;'], 4, '4번 줄은 title prop을 전달하지 않아 제목을 표시할 데이터가 없습니다. JSX 속성으로 title={course.title}처럼 전달해야 합니다.'],
  '2-2': ['prop 읽기 전용', '받은 title prop을 기본값으로 바꾸고 싶을 때 올바른 방법은?', ['함수 안에서 title에 다시 대입', '구조 분해 기본값을 사용', '전역 변수에 title 저장'], 1, 'const title = "JS";\nconsole.log(title);', ['JS'], ['function CourseTitle({ title }) {', '  title = "기본";', '  return <h2>{title}</h2>;', '}'], 2, '2번 줄은 prop을 다시 대입합니다. prop은 읽기 전용으로 취급하고 기본값은 매개변수 구조 분해에서 정해야 합니다.'],
  '2-3': ['기본 prop 값', 'level prop이 없을 때 "기초"를 표시하도록 선언하는 방법은?', ['`function Badge({ level = "기초" })`', '`level = "기초";`를 본문에서 실행', '`<Badge level />`만 작성'], 0, 'function Badge({ level = "기초" }) { return level; }\nconsole.log(Badge({}));', ['기초'], ['function Badge({ level }) {', '  level = "기초";', '  return <span>{level}</span>;', '}'], 2, '2번 줄은 전달받은 prop을 직접 바꿉니다. level = "기초"는 매개변수 구조 분해에서 기본값으로 지정해야 합니다.'],
  '3-1': ['이벤트 참조', '저장 버튼을 클릭했을 때만 save를 실행하는 onClick 값은?', ['`onClick={save}`', '`onClick={save()}`', '`onClick="save"`'], 0, 'const handler = () => "saved";\nconsole.log(typeof handler);', ['function'], ['function SaveButton({ save }) {', '  return <button onClick={save()}>저장</button>;', '}'], 2, '2번 줄은 렌더링 중 save를 즉시 호출합니다. 클릭 뒤 실행하려면 함수 참조 save를 전달해야 합니다.'],
  '3-2': ['이벤트 인자', '삭제할 course.id를 클릭 시점에 remove로 전달하는 표현은?', ['`onClick={() => remove(course.id)}`', '`onClick={remove(course.id)}`', '`onClick={course.id}`'], 0, 'const course = { id: "react" };\nconsole.log(course.id);', ['react'], ['function DeleteButton({ remove, course }) {', '  return <button onClick={remove(course.id)}>삭제</button>;', '}'], 2, '2번 줄은 렌더링 중 remove를 호출합니다. 추가 인자가 필요하면 화살표 함수 안에서 클릭 시점에 호출해야 합니다.'],
  '3-3': ['함수형 갱신', '같은 이벤트에서 이전 count를 기준으로 두 번 늘릴 때 안전한 setter 형태는?', ['`setCount((current) => current + 1)`', '`setCount(count + 1)`만 두 번', '`count += 1`'], 0, 'let count = 0;\ncount = count + 1;\nconsole.log(count);', ['1'], ['function AddTwice({ count, setCount }) {', '  setCount(count + 1);', '  setCount(count + 1);', '  return null;', '}'], 2, '2번과 3번 줄은 같은 렌더의 count를 읽어 둘 다 같은 값으로 갱신할 수 있습니다. 이전 상태에 의존하면 함수형 setter를 써야 합니다.'],
  '4-1': ['객체 상태 복사', 'profile의 name만 바꾸면서 다른 필드를 보존하는 표현은?', ['`{ ...profile, name }`', '`profile.name = name`', '`Object.keys(profile)`'], 0, 'const profile = { name: "민", level: 2 };\nconst next = { ...profile, name: "수" };\nconsole.log(next.level);', ['2'], ['function rename(profile, name) {', '  profile.name = name;', '  return profile;', '}'], 2, '2번 줄은 기존 객체를 직접 바꿉니다. React 상태는 전개 문법으로 새 객체를 만들어 반환해야 합니다.'],
  '4-2': ['배열 상태 추가', '현재 courses를 유지하면서 새 course를 끝에 추가하는 setter는?', ['`setCourses((current) => [...current, course])`', '`courses.push(course)`', '`setCourses(course)`'], 0, 'const courses = ["JS"];\nconst next = [...courses, "React"];\nconsole.log(next.length);', ['2'], ['function addCourse(courses, course) {', '  courses.push(course);', '  return courses;', '}'], 2, '2번 줄의 push는 기존 배열을 직접 바꿉니다. 상태에는 새 배열을 만들어 setter에 전달해야 합니다.'],
  '4-3': ['배열 항목 제거', 'id가 같은 course를 목록에서 제거하는 filter 조건은?', ['`course.id !== id`', '`course.id === id`', '`courses.pop()`'], 0, 'const ids = ["js", "react"].filter((id) => id !== "js");\nconsole.log(ids.join(","));', ['react'], ['function removeCourse(courses, id) {', '  return courses.filter((course) => course.id === id);', '}'], 2, '2번 줄은 제거하려는 항목만 남깁니다. 삭제하려면 course.id !== id 조건으로 다른 항목을 남겨야 합니다.'],
  '5-1': ['제어 입력', '입력값을 title state와 연결하는 필수 prop 조합은?', ['`value`와 `onChange`', '`id`만', '`key`만'], 0, 'const title = "React";\nconsole.log(title.length);', ['5'], ['function TitleInput({ title }) {', '  return <input value={title} />;', '}'], 2, '2번 줄에는 사용자의 입력을 state로 반영하는 onChange가 없습니다. 제어 입력에는 value와 onChange가 함께 필요합니다.'],
  '5-2': ['label 연결', 'label과 input을 연결하는 속성 조합은?', ['`htmlFor`와 `id`', '`key`와 `ref`', '`value`와 `name`'], 0, 'const id = "title";\nconsole.log(id.toUpperCase());', ['TITLE'], ['<label>과정 이름</label>', '<input id="title" />'], 1, '1번 줄의 label은 input id와 연결되지 않았습니다. label에 htmlFor="title"을 지정해야 합니다.'],
  '5-3': ['안정된 key', '정렬되는 course 목록의 key로 알맞은 값은?', ['`course.id`', '배열 index', '현재 제목'], 0, 'const course = { id: "react" };\nconsole.log(course.id);', ['react'], ['items.map((course, index) => (', '  <li key={index}>{course.title}</li>', '));'], 2, '2번 줄의 index는 삽입과 정렬 뒤 항목 정체성을 보장하지 않습니다. 안정된 course.id를 key로 사용해야 합니다.'],
  '6-1': ['Effect와 외부 시스템', 'roomId에 맞춰 연결을 만들고 정리하는 Hook은?', ['`useEffect`', '`useMemo`', '`useState`만'], 0, 'const roomId = "study";\nconsole.log(roomId);', ['study'], ['useEffect(() => {', '  connect(roomId);', '}, []);'], 3, '3번 줄의 빈 의존성 배열은 roomId 변경을 반영하지 않습니다. Effect가 읽는 roomId를 의존성에 넣어야 합니다.'],
  '6-2': ['파생값', '완료한 항목만 화면에 보일 때 먼저 할 계산은?', ['렌더링 중 filter 계산', 'Effect에서 별도 state 저장', 'DOM 직접 변경'], 0, 'const visible = [true, false].filter(Boolean);\nconsole.log(visible.length);', ['1'], ['const [visible, setVisible] = useState([]);', 'useEffect(() => setVisible(items.filter((item) => item.done)), []);'], 2, '2번 줄의 빈 의존성 배열은 items가 바뀌어도 visible을 갱신하지 않습니다. 단순 파생값은 렌더링 중 계산하는 편이 안전합니다.'],
  '6-3': ['Effect 의존성', 'query를 읽는 요청 Effect의 의존성 배열에는 무엇이 필요할까?', ['`[query]`', '`[]`', '`[setQuery]`만'], 0, 'const query = "react";\nconsole.log(query.includes("act"));', ['true'], ['useEffect(() => {', '  search(query);', '}, []);'], 3, '3번 줄은 query를 읽지만 의존성에 넣지 않아 새 검색어에 맞춰 다시 실행되지 않습니다. [query]가 필요합니다.'],
  '7-1': ['reducer 전이', '관련된 open 상태 전이를 한 곳에 모으는 Hook은?', ['`useReducer`', '`innerHTML`', '`setTimeout`'], 0, 'const next = { ...{ open: false }, open: true };\nconsole.log(next.open);', ['true'], ['function reducer(state, action) {', '  state.open = true;', '  return state;', '}'], 2, '2번 줄은 기존 state 객체를 직접 바꿉니다. reducer는 새 객체를 반환해야 전이를 예측하기 쉽습니다.'],
  '7-2': ['명시적 action', '완료할 course id와 행동 type을 함께 보내는 값은?', ['`dispatch({ type: "course/complete", id: course.id })`', '`dispatch(course.id)`만 전달', '`dispatch(<CourseRow />)`'], 0, 'const action = { type: "course/complete", id: "react" };\nconst course = { id: "js" };\nconsole.log(course.id === action.id);', ['false'], ['function complete(dispatch, course) {', '  dispatch(course.id);', '}'], 2, '2번 줄은 어떤 동작을 처리할지 알리는 type을 보내지 않습니다. action 객체에 type과 대상 id를 함께 담으세요.'],
  '7-3': ['Context 소비', 'Provider의 현재 theme을 Header가 표시하도록 값을 읽는 Hook은?', ['`useContext(ThemeContext)`', '`useReducer(ThemeContext)`', '`document.querySelector("theme")`'], 0, 'const providerValue = "dark";\nconst theme = providerValue;\nconsole.log(theme);', ['dark'], ['const ThemeContext = createContext("light");', 'function Header() {', '  return <span>light</span>;', '}'], 3, '3번 줄은 Context를 읽지 않고 light 글자를 고정합니다. useContext(ThemeContext)로 현재 Provider 값을 소비해야 합니다.'],
  '8-1': ['사용자 정의 Hook 이름', '상태나 Effect를 사용하는 재사용 Hook의 이름은 어떤 접두사로 시작하나요?', ['`use`', '`Use`', '`get`'], 0, 'const hookName = "useDisclosure";\nconsole.log(hookName.startsWith("use"));', ['true'], ['function flag() {', '  const [on] = useState(false);', '  return on;', '}'], 2, '2번 줄의 함수는 Hook을 호출하지만 소문자 use 접두사가 없어 Hook 규칙과 lint 도구가 의도를 알아보기 어렵습니다. useFlag처럼 이름을 지어야 합니다.'],
  '8-2': ['Hook 호출 위치', 'useState를 호출할 수 있는 위치는?', ['컴포넌트 또는 custom Hook 최상위', '조건문 안', '일반 반복문 안'], 0, 'function Panel() { const [open] = useState(false); return open; }\nconsole.log(typeof Panel);', ['function'], ['function Panel({ enabled }) {', '  if (enabled) { const [open] = useState(false); }', '  return null;', '}'], 2, '2번 줄은 조건에 따라 Hook 호출 수가 달라집니다. Hook은 컴포넌트 최상위에서 같은 순서로 호출해야 합니다.'],
  '8-3': ['Hook 반환값', '공개 여부와 setter를 재사용 Hook에서 함께 제공하는 반환값은?', ['`{ open, setOpen }`', '`document.body`', '변경한 prop'], 0, 'const state = { open: false };\nconsole.log(state.open);', ['false'], ['function useOpen() {', '  const [open, setOpen] = useState(false);', '  return open;', '}'], 3, '3번 줄은 setter를 숨겨 호출자가 상태를 바꿀 수 없습니다. 재사용 계약에 필요한 open과 setOpen을 함께 반환해야 합니다.'],
};

// Week 1–3 prompts are authored per day rather than using the broad generated
// prompts below. Changed answer meanings use v2 IDs so saved attempts keep
// their original question contract.
const foundationExerciseOverrides = {
  '1-1': {
    choice: { prompt: 'name prop이 "민지"일 때 제목에 실제 이름을 표시하는 JSX는?', options: [
      ['`<h1>{name}</h1>`', '중괄호가 JSX 표현식으로 name의 현재 값을 읽습니다.'],
      ['`<h1>name</h1>`', '이 표기는 변수 값을 평가하지 않고 name이라는 글자를 그대로 표시합니다.'],
      ['`<h1>${name}</h1>`', '`${...}`는 템플릿 문자열 문법이며 JSX 텍스트 안에서는 변수 삽입 문법이 아닙니다.'],
    ], answer: 0, hint: 'JSX 안에서 JavaScript 표현식을 여는 기호를 확인하세요.', explanation: 'JSX 텍스트 안의 동적 값은 `{name}`처럼 중괄호로 감쌉니다. 템플릿 문자열의 `${name}`과는 문맥이 다릅니다.' },
    trace: { prompt: '부모가 name에 "민지"를 전달합니다. Welcome의 h1에는 어떤 문자열 값이 들어가나요?', answers: ['민지'], hint: 'JSX 속성 `name="민지"`가 자식의 name prop으로 전달되고, `{name}`이 그 값을 읽습니다.', explanation: '부모의 `name="민지"`가 prop이 되고, 자식 JSX의 `{name}`은 변수 값을 표시합니다. 개념 스니펫이며 여기서 브라우저 렌더링은 실행하지 않습니다.' },
    debugHint: '오류 줄의 `<h1>name</h1>`에서 중괄호가 빠졌는지 확인하세요.',
  },
  '1-2': {
    choice: { prompt: 'CourseCard가 사용자 정의 컴포넌트라면 JSX에서 올바르게 참조하는 표기는?', options: [
      ['`<courseCard />`', '소문자로 시작하는 태그 이름은 JSX에서 사용자 변수 참조가 아니라 내장 요소처럼 해석됩니다.'],
      ['`<CourseCard />`', '대문자로 시작하면 현재 범위의 CourseCard 컴포넌트를 참조합니다.'],
      ['`<COURSECARD />`', '모듈 변수 이름의 대소문자를 바꾸면 다른 식별자가 되므로 선언한 CourseCard와 연결되지 않습니다.'],
    ], answer: 1, hint: '내장 요소와 사용자 컴포넌트를 JSX가 어떻게 구분하는지 떠올리세요.', explanation: '사용자 정의 컴포넌트는 PascalCase로 작성합니다. 이 규칙은 JSX가 변수 컴포넌트와 내장 태그를 구분하는 데 쓰입니다.' },
    trace: { prompt: '아래 두 표기 중 선언한 JavaScript 함수 CourseCard를 React 컴포넌트로 참조하는 것은 어느 이름인가요?', answers: ['CourseCard', '<CourseCard />', '대문자로 시작하는 CourseCard'], hint: '선언과 JSX 태그의 철자 및 대소문자를 그대로 대조하세요.', explanation: 'JSX에서 `<CourseCard />`는 대문자로 시작하는 변수 이름을 컴포넌트로 참조합니다. 소문자 `<courseCard />`는 같은 함수 선언을 가리키지 않습니다.' },
    debugHint: 'JSX 태그의 대소문자와 실제 함수 선언 이름이 일치하는지 살펴보세요.',
  },
  '1-3': {
    choice: { prompt: 'h1과 p를 형제 요소로 반환하되 DOM에 불필요한 wrapper를 추가하지 않는 방법은?', options: [
      ['`return <h1>과정</h1>; return <p>설명</p>;`', '첫 return에서 함수가 끝나므로 두 번째 JSX는 반환 트리에 포함되지 않습니다.'],
      ['`return <h1>과정</h1><p>설명</p>;`', '인접한 두 JSX 요소를 감싸지 않으면 하나의 반환 표현식이 되지 않습니다.'],
      ['`return <><h1>과정</h1><p>설명</p></>;`', 'Fragment는 여러 형제 JSX를 하나의 반환 트리로 묶으면서 별도 DOM 요소를 만들지 않습니다.'],
    ], answer: 2, hint: '반환식의 JSX 형제 요소를 묶되 실제 HTML wrapper는 만들지 않는 문법을 고르세요.', explanation: 'Fragment는 컴포넌트 반환값을 하나의 JSX 트리로 묶으며 추가 DOM wrapper를 만들지 않습니다.' },
    trace: { prompt: '이 반환값은 React 요소 트리에서 h1과 p를 함께 묶습니다. 브라우저 DOM에 Fragment 자체를 위한 wrapper 요소가 몇 개 추가되나요?', answers: ['0', '0개', '없음', '추가되지 않음'], hint: 'Fragment는 JSX 반환 구조를 묶지만 별도 HTML 요소를 렌더링하지 않습니다.', explanation: 'Fragment 자체는 DOM 요소가 아니므로 wrapper 요소는 추가되지 않습니다. 자식인 h1과 p만 DOM에 반영됩니다.' },
    debugHint: 'return 뒤에 코드가 남아 있는지, 여러 형제 요소를 하나의 JSX 루트로 묶었는지 확인하세요.',
  },
  '1-4': {
    choice: { prompt: 'isOpen이 false일 때 Panel을 렌더링하지 않고 아무것도 표시하지 않는 표현은?', options: [
      ['`isOpen ? <Panel /> : null`', '조건이 false일 때 null을 반환하므로 Panel도 대체 요소도 렌더링하지 않습니다.'],
      ['`isOpen ? null : <Panel />`', '조건이 false일 때 오히려 Panel을 렌더링하는 분기 순서입니다.'],
      ['`isOpen || <Panel />`', 'isOpen이 false일 때 우변의 Panel을 반환하므로 닫힌 상태 요구와 반대입니다.'],
    ], answer: 0, hint: '삼항식의 조건, 참일 때 값, 거짓일 때 값을 차례로 읽으세요.', explanation: '삼항식은 true 분기에서 Panel을, false 분기에서 null을 반환하므로 닫힌 상태를 표시하지 않습니다.' },
    trace: { prompt: 'panelFor(false)의 반환값은 무엇인가요?', answers: ['null'], hint: '삼항식에서 isOpen이 false일 때 선택되는 오른쪽 분기를 읽으세요.', explanation: 'false일 때 선택되는 값은 null입니다. 이 개념 코드에서는 Panel 요소가 반환되지 않습니다.' },
    debugHint: 'false일 때 선택되는 삼항식 분기가 요구사항과 반대인지 확인하세요.',
    repairHint: 'isOpen이 false인 경우를 먼저 정하고, true일 때만 Panel 요소를 반환하도록 삼항식의 각 분기를 채우세요.',
  },
  '1-5': {
    choice: { prompt: '과정 항목이 삽입·정렬될 수 있는 목록에서 각 li의 key로 가장 안정적인 값은?', options: [
      ['`Math.random()`', '렌더마다 값이 바뀌어 React가 항목을 새 항목으로 취급하고 상태를 보존하지 못할 수 있습니다.'],
      ['`index`', '항목 사이 삽입이나 정렬이 일어나면 같은 인덱스가 다른 항목을 가리킬 수 있습니다.'],
      ['`course.id`', '항목의 정체성을 나타내며 순서가 바뀌어도 같은 항목에 연결할 수 있습니다.'],
    ], answer: 1, hint: '목록 순서가 바뀌어도 항목 자체를 계속 식별하는 값을 고르세요.', explanation: '안정된 항목 ID를 key로 사용하면 삽입과 재정렬 뒤에도 각 자식의 정체성을 유지할 수 있습니다.' },
    trace: { prompt: 'courses에 id가 "react"인 항목 하나가 있습니다. map에서 해당 항목의 li에 전달되는 key 값은 무엇인가요?', answers: ['react', '"react"'], hint: 'map 콜백이 읽는 `course.id`와 입력 객체의 id 값을 대입하세요.', explanation: '입력 객체의 id가 `react`이므로 해당 li의 key도 `react`입니다. key는 목록 형제 사이에서 항목 정체성을 구분합니다.' },
    debugHint: '삽입·정렬이 가능한 배열에서 index 대신 항목 자체의 지속적인 식별자를 사용했는지 확인하세요.',
    repairHint: 'map 콜백에서 course의 안정된 id를 li의 key prop에 연결하세요.',
  },
  '2-1': {
    choice: { prompt: 'course.title 값을 CourseTitle의 title prop으로 전달하는 방법은?', options: [
      ['`<CourseTitle>{course.title}</CourseTitle>`', '이 표현은 값을 children으로 전달하므로 자식이 title prop으로 받지 않습니다.'],
      ['`<CourseTitle title="course.title" />`', '따옴표 안의 내용은 표현식이 아니라 문자 그대로의 `course.title`입니다.'],
      ['`<CourseTitle title={course.title} />`', 'JSX 중괄호 안의 표현식 값이 title prop으로 전달됩니다.'],
    ], answer: 2, hint: '자식이 구조 분해하는 prop 이름과 부모 JSX 속성 이름을 일치시키세요.', explanation: 'JSX 속성 `title={course.title}`가 평가한 값을 자식의 `title` prop으로 전달합니다.' },
    trace: { prompt: 'course.title이 "React"입니다. CourseTitle 컴포넌트에서 title로 받는 값은 무엇인가요?', answers: ['React', '"React"'], hint: '부모의 course.title 값을 title JSX 속성에 전달합니다.', explanation: '부모 객체의 title 값인 React가 자식의 title prop으로 전달됩니다.' },
    debugHint: '컴포넌트 호출에 자식이 읽는 title prop이 실제로 전달됐는지 확인하세요.',
  },
  '2-2': {
    choice: { prompt: '자식 컴포넌트가 부모로부터 받은 title prop을 기본값으로 바꾸고 싶다면 올바른 원칙은?', options: [
      ['받은 prop 객체의 title 필드를 직접 변경한다', 'prop을 직접 바꾸면 부모가 전달한 입력 계약을 훼손합니다. 필요한 변경은 부모 상태를 갱신하게 요청해야 합니다.'],
      ['prop을 읽기 전용으로 두고 부모가 새 값을 전달하게 한다', 'props는 해당 렌더의 입력입니다. 값 변경은 소유한 부모 상태를 통해 전달합니다.'],
      ['모듈 전역 title 변수에 값을 저장한다', '전역 변수는 컴포넌트별 입력과 렌더 갱신 흐름을 보장하지 않습니다.'],
    ], answer: 1, hint: '데이터를 전달한 쪽과 그 상태를 소유한 쪽이 어디인지 구분하세요.', explanation: '자식은 prop을 읽고 표시할 수 있지만 직접 수정하지 않습니다. 상위 값 변경이 필요하면 부모가 소유한 상태를 갱신해야 합니다.' },
    trace: { prompt: 'CourseTitle은 title prop을 그대로 h2 안에 표시합니다. 부모가 "React"를 전달하면 h2의 텍스트는 무엇인가요?', answers: ['React', '"React"'], hint: '자식은 title을 바꾸지 않고 JSX 표현식으로 읽어 표시합니다.', explanation: '부모가 전달한 읽기 전용 title prop의 값 React가 자식 h2의 텍스트로 표시됩니다.' },
    debugHint: 'prop을 받은 컴포넌트 안에서 재대입하거나 prop 객체를 변경하는 줄을 찾으세요.',
  },
  '2-3': {
    choice: { prompt: 'Badge의 level이 생략됐을 때 "기초"를 사용하고, 명시한 값은 유지하는 선언은?', options: [
      ['`function Badge({ level = null })`', '생략된 level에 null을 넣으므로 "기초" 기본값 요구를 만족하지 않습니다.'],
      ['`function Badge({ level }) { level = "기초"; }`', '컴포넌트 본문에서 prop을 다시 대입하므로 입력을 직접 바꿉니다.'],
      ['`function Badge({ level = "기초" })`', '구조 분해 기본값은 level이 생략되거나 undefined일 때 적용됩니다.'],
    ], answer: 2, hint: '구조 분해 매개변수의 기본값 문법을 사용하고 null과 undefined도 구별하세요.', explanation: '기본값은 prop이 누락되거나 undefined일 때 적용됩니다. 명시적인 null은 기본값으로 대체되지 않습니다.' },
    trace: { prompt: 'Badge를 level prop 없이 호출합니다. 구조 분해 기본값을 적용한 level은 무엇인가요?', answers: ['기초', '"기초"'], hint: '누락된 prop은 undefined로 전달된 것처럼 기본값을 적용합니다.', explanation: 'level이 누락되면 구조 분해 기본값인 기초가 사용됩니다. null을 명시하면 이 기본값은 적용되지 않습니다.' },
    debugHint: '기본값 선언 위치가 함수 매개변수 구조 분해인지, prop을 본문에서 수정하는지 살펴보세요.',
  },
  '2-4': {
    choice: { prompt: 'CourseMeta가 title과 minutes 두 prop을 표시합니다. 부모 계약에 두 필드를 명시적으로 전달하는 JSX는?', options: [
      ['`<CourseMeta title={course.title} />`', 'minutes prop이 없어 CourseMeta가 두 정보를 표시할 수 없습니다.'],
      ['`CourseMeta.title = course.title`', '컴포넌트 함수에 속성을 대입해도 React 요소를 만들거나 prop을 전달하지 않습니다.'],
      ['`<CourseMeta title={course.title} minutes={course.minutes} />`', '자식이 표시할 title과 minutes를 각각 같은 이름의 prop으로 전달합니다.'],
    ], answer: 2, hint: '자식의 구조 분해 목록과 부모가 전달하는 JSX 속성을 하나씩 대조하세요.', explanation: '컴포넌트가 읽는 title과 minutes를 각각 JSX 속성으로 전달해야 합니다.' },
    trace: { prompt: 'title은 "React", minutes는 30입니다. CourseMeta의 p 요소에 표시되는 텍스트는 무엇인가요?', answers: ['React · 30분'], hint: 'JSX의 두 표현식과 가운데 구분 문자를 순서대로 이어 보세요.', explanation: 'title 값, 가운데 점 구분자, minutes 값과 분 단위를 이어 `React · 30분`을 표시합니다.' },
    debugHint: '컴포넌트가 구조 분해하는 title과 minutes 중 호출에서 빠진 prop이 있는지 확인하세요.',
    repairHint: 'title은 유지하고 minutes prop을 p의 표시식에 추가하세요.',
  },
  '2-5': {
    choice: { prompt: '부모가 `<Panel>수강 목록</Panel>`로 전달한 children을 일반 React node로 표시하는 JSX는?', options: [
      ['`{children()}`', 'children이 함수라고 보장되지 않습니다. 문자열이나 요소를 함수처럼 호출하면 오류가 날 수 있습니다.'],
      ['`{children}`', 'children은 부모가 태그 사이에 넣은 React node 값이므로 그대로 JSX에 배치합니다.'],
      ['`<children />`', 'children은 내장 태그 이름이 아니라 컴포넌트 prop입니다.'],
    ], answer: 1, hint: 'children의 값이 함수라는 계약이 있는지 먼저 확인하세요.', explanation: '중첩 JSX는 children prop으로 전달되며, 일반 React node라면 `{children}`으로 렌더링합니다.' },
    trace: { prompt: 'Panel은 children을 section 안에서 그대로 렌더링합니다. 부모가 넣은 자식 텍스트는 무엇인가요?', answers: ['수강 목록'], hint: '여는 컴포넌트 태그와 닫는 태그 사이의 콘텐츠를 확인하세요.', explanation: '태그 사이의 `수강 목록`이 children으로 전달되고 section 안에 표시됩니다.' },
    debugHint: 'children이 React node인데 함수 호출 구문 `()`을 붙였는지 확인하세요.',
    repairHint: 'children을 호출하지 말고 section 안의 JSX 자식 값으로 배치하세요.',
  },
  '3-1': {
    choice: { prompt: '저장 함수 save를 렌더 도중 실행하지 않고 버튼 클릭 때 실행하려면?', options: [
      ['`onClick={save}`', '함수 참조를 등록하므로 React가 클릭 이벤트가 왔을 때 호출합니다.'],
      ['`onClick={save()}`', 'JSX를 계산하는 동안 save를 즉시 호출한 반환값을 전달합니다.'],
      ['`onClick="save"`', '문자열은 React 이벤트 처리 함수가 아닙니다.'],
    ], answer: 0, hint: '이벤트 속성에 함수 호출 결과가 아니라 함수 자체를 전달하세요.', explanation: 'React 이벤트 처리기에는 함수 참조를 전달합니다. 렌더링 중 실행하려면 `save()`가 되므로 쓰지 않습니다.' },
    trace: { prompt: 'onClick에 save 함수 참조를 등록했습니다. 렌더링만으로 save가 실행되나요? 실행 시점을 답하세요.', answers: ['아니요. 클릭할 때 실행', '렌더링 중에는 실행되지 않고 버튼을 클릭할 때 실행', '아니요, 클릭 이벤트가 발생할 때 실행'], versioned: true, hint: '렌더 단계에서 함수 참조를 전달하는 것과 실제 이벤트 호출 시점을 구분하세요.', explanation: '함수 참조를 등록하는 것만으로 호출되지는 않습니다. 버튼 클릭 이벤트가 발생하면 React가 처리기를 호출합니다.' },
    debugHint: 'JSX 렌더 시점에 함수 호출 괄호가 실행되는지 확인하세요.',
  },
  '3-2': {
    choice: { prompt: 'course.id를 삭제 함수에 전달하되 렌더 중 호출하지 않는 이벤트 처리는?', options: [
      ['`onClick={remove(course.id)}`', '렌더링 중 remove를 즉시 호출한 반환값을 이벤트 처리기로 넣습니다.'],
      ['`onClick={course.id}`', 'id 문자열은 클릭 처리 함수가 아닙니다.'],
      ['`onClick={() => remove(course.id)}`', '화살표 함수 참조를 전달하고, 클릭 시점에 현재 course.id로 remove를 호출합니다.'],
    ], answer: 2, hint: '추가 인자를 넘길 때 이벤트 시점까지 호출을 미루는 함수를 전달하세요.', explanation: '화살표 함수는 클릭할 때 실행되며 그 안에서 remove에 course.id를 전달합니다.' },
    trace: { prompt: 'course.id가 "react"일 때 버튼 클릭으로 remove에 전달되는 인자는 무엇인가요?', answers: ['react', '"react"'], hint: '클릭 처리 함수 안에서 `remove(course.id)`의 인자 표현식을 대입하세요.', explanation: 'course.id 값 `react`가 이벤트 시점에 remove의 인자로 전달됩니다.' },
    debugHint: 'remove 호출이 컴포넌트 렌더 시점인지, 새 화살표 함수가 실행되는 클릭 시점인지 따져 보세요.',
  },
  '3-3': {
    choice: { prompt: '같은 클릭에서 count를 두 번 늘려야 합니다. 각 갱신이 직전 큐 값을 사용하게 하는 방법은?', options: [
      ['`setCount(count + 1)`을 두 번 호출', '같은 렌더의 count 스냅샷을 두 호출이 읽으므로 두 번 증가를 보장하지 않습니다.'],
      ['`setCount((current) => current + 1)`을 두 번 호출', '업데이트 큐가 각 함수에 직전 결과를 전달하므로 두 갱신이 이어집니다.'],
      ['`count += 2`로 지역 값을 변경', '지역 변수 변경은 React state를 갱신하지 않아 다음 렌더를 요청하지 않습니다.'],
    ], answer: 1, hint: '현재 렌더의 고정된 count와 큐에서 직전 값을 받는 updater를 구분하세요.', explanation: '함수형 updater는 큐에서 직전 state를 받아 계산합니다. 두 번 넣으면 증가가 순서대로 적용됩니다.' },
    trace: { prompt: '현재 count가 4이고 `setCount(current => current + 1)`을 한 번 호출합니다. 큐가 처리된 뒤 값은?', answers: ['5'], hint: 'updater가 받은 4에 1을 더하세요.', explanation: '함수형 updater는 이전 값 4를 받아 5를 반환하므로 다음 state가 5가 됩니다.' },
    debugHint: '같은 렌더의 count를 두 번 읽는지, 각 updater가 이전 큐 값을 받는지 확인하세요.',
    repairHint: 'count의 이전 값에 의존하는 setter를 함수형 updater로 바꾸어 직전 값을 기준으로 증가시키세요.',
  },
  '3-4': {
    choice: { prompt: 'count가 0일 때 한 이벤트 안에서 아래 updater를 두 번 큐에 넣습니다. 다음 렌더의 count는?', options: [
      ['1', '두 updater가 각각 이전 큐 결과를 받아 0→1→2로 계산하므로 1은 최종값이 아닙니다.'],
      ['2', '각 함수형 updater가 큐 앞선 결과를 받아 두 단계로 증가합니다.'],
      ['0', 'setter 호출은 다음 렌더를 요청합니다. 두 updater의 반환값은 버려지지 않습니다.'],
    ], answer: 1, hint: '첫 updater가 반환한 값을 두 번째 updater의 입력으로 사용하세요.', explanation: '큐의 첫 함수는 0에서 1, 두 번째 함수는 1에서 2를 반환합니다. 다음 렌더의 count는 2입니다.' },
    trace: { prompt: '초기 count가 0입니다. 함수형 updater 두 개가 각각 1을 더하면 다음 렌더에 표시될 숫자는?', answers: ['2'], hint: '큐를 0→첫 updater 결과→두 번째 updater 결과 순으로 계산하세요.', explanation: '첫 updater 결과는 1이고, 다음 updater는 그 값을 받아 2를 반환합니다.' },
    debugHint: '두 번 호출된 setter가 같은 스냅샷을 사용하는지, updater 함수인지 확인하세요.',
    repairHint: '한 번의 click에서 두 번 갱신하므로 두 setter 모두 함수형 updater로 직전 큐 값을 증가시키세요.',
    repairId: 'react-w3-d4-repair-v2',
  },
  '3-5': {
    choice: { prompt: '삭제 버튼이 카드 내부에 있습니다. 삭제는 실행하되 카드의 부모 클릭 handler는 실행하지 않게 하려면?', options: [
      ['삭제 handler에서 `event.preventDefault()`를 호출', '기본 브라우저 동작은 막지만 부모로의 이벤트 전파를 멈추지는 않습니다.'],
      ['handler에서 `return false`를 반환', 'React handler에서 false를 반환해도 부모 handler까지 이벤트 전파는 계속됩니다.'],
      ['삭제 handler에서 `event.stopPropagation()`을 호출', '현재 클릭 이벤트가 부모 handler까지 전파되는 것을 막습니다.'],
    ], answer: 2, hint: '기본 동작 취소와 이벤트 전파 중 어떤 동작을 막아야 하는지 구분하세요.', explanation: '`stopPropagation`은 부모 handler로의 전파를 막습니다. `preventDefault`는 링크 이동 같은 기본 동작을 취소합니다.' },
    trace: { prompt: '삭제 handler는 stopPropagation을 호출한 뒤 remove를 실행합니다. 클릭 시 삭제와 부모 카드 처리는 각각 어떻게 되나요?', answers: ['삭제는 실행되고 부모 카드 처리는 실행되지 않음', 'remove만 실행되고 부모 handler는 실행되지 않음', '부모 handler는 실행되지 않고 삭제는 실행'], versioned: true, hint: 'stopPropagation 호출 앞뒤의 handler와 이벤트의 부모 전파를 따로 추적하세요.', explanation: '이벤트는 부모로 전파되지 않지만 같은 삭제 handler 안의 후속 remove 호출은 계속 실행됩니다.' },
    debugHint: '요구가 막으려는 것은 브라우저 기본 동작인지 부모 handler로의 전파인지 구분하세요.',
    repairHint: '이벤트 처리기 안에서 전파를 먼저 중단하고, 이어서 해당 id를 remove에 전달하세요.',
    repairId: 'react-w3-d5-repair-v2',
  },
  '4-1': {
    choice: { prompt: 'profile가 `{ name: "민", level: 2 }`일 때 name만 "수"로 바꾸고 level을 보존하는 새 state 값은?', options: [
      ['`{ ...profile, name: "수" }`', '기존 필드를 복사하고 변경할 name만 덮어쓴 새 객체를 만듭니다.'],
      ['`profile.name = "수"`', '기존 렌더가 참조하는 state 객체를 직접 변경하며 setter에도 전달하지 않습니다.'],
      ['`{ name: "수" }`', 'name은 바뀌지만 기존 객체의 다른 필드인 level을 버립니다.'],
    ], answer: 0, hint: '새 객체를 만들면서 바뀌지 않은 필드를 어떤 방식으로 가져오는지 살펴보세요.', explanation: '전개 문법으로 기존 필드를 복사하고 name만 덮어쓰면 새 참조와 유지되어야 할 level을 함께 보존합니다.' },
    trace: { prompt: 'name을 "수"로 바꾸되 나머지 필드를 복사한 객체에서 `next.level`은 무엇인가요?', answers: ['2'], hint: '전개 문법은 덮어쓴 name 외의 기존 필드를 복사합니다.', explanation: 'name 속성만 새 값으로 덮어쓰고 level은 기존 값 2가 복사됩니다.' },
    debugHint: '기존 state 객체의 필드에 직접 대입하는지, 복사된 새 객체를 setter에 전달하는지 확인하세요.',
  },
  '4-2': {
    choice: { prompt: '기존 courses 배열을 유지하면서 course 하나를 추가하는 state updater는?', options: [
      ['`current.push(course)` 뒤 같은 current를 반환', 'push는 기존 배열을 바꾸고 같은 참조를 다시 사용합니다.'],
      ['`[...current, course]`', '기존 원소를 복사한 새 배열의 끝에 course를 추가합니다.'],
      ['`course`만 반환', '기존 목록 전체를 새 단일 원소로 바꿔 기존 항목을 잃습니다.'],
    ], answer: 1, hint: '이전 배열의 원소를 보존하면서 새 배열 참조를 만드는 표현을 고르세요.', explanation: '함수형 setter 안의 `[...current, course]`는 최신 배열을 복사하고 새 항목을 덧붙입니다.' },
    trace: { prompt: 'current가 `["JS"]`입니다. 아래 코드가 출력하는 한 줄은?', code: 'const current = ["JS"];\nconst next = [...current, "React"];\nconsole.log(current.join(",") + " / " + next.join(","));', answers: ['JS / JS,React'], idVersion: 3, versioned: true, hint: '전개 구문은 current를 바꾸지 않고 새 배열 next를 만듭니다. 두 배열을 join한 값을 차례로 읽으세요.', explanation: 'current는 `JS`, next는 `JS,React`이므로 출력은 `JS / JS,React`입니다. React state를 갱신할 때도 기존 배열 대신 새 배열을 전달합니다.' },
    debugHint: 'push가 기존 배열을 바꾸는지와 setter에 전달하는 배열 참조가 새 값인지 함께 살펴보세요.',
  },
  '4-3': {
    choice: { prompt: 'id가 "react"인 과정만 제거하고 나머지를 남기는 filter 조건은?', options: [
      ['`course.id === id`', 'filter 조건이 참인 삭제 대상만 결과에 남아 제거가 일어나지 않습니다.'],
      ['`courses.pop()`', '마지막 원소 하나를 순서와 관계없이 기존 배열에서 제거합니다.'],
      ['`course.id !== id`', '삭제할 id와 다른 과정만 새 배열에 남기므로 해당 항목을 제외할 수 있습니다.'],
    ], answer: 2, hint: 'filter는 조건이 참인 항목을 보존하므로 지우고 싶은 항목과 조건을 반대로 잡으세요.', explanation: '`course.id !== id` 조건은 지정한 id를 제외한 모든 항목을 새 배열에 남깁니다.' },
    trace: { prompt: 'id 순서가 `js,react,python`일 때 `course.id !== "react"`로 필터링한 결과는?', answers: ['js,python', 'js, python', 'js react python에서 react만 제외'], hint: '조건이 참인 js와 python은 남고 react는 제외됩니다.', explanation: '조건이 참인 항목은 js와 python이므로 결과 배열은 `js,python`입니다.' },
    debugHint: '삭제 대상과 일치하는 요소를 남기는 조건인지, 그 요소만 제외하는 조건인지 확인하세요.',
  },
  '4-4': {
    choice: { prompt: 'courses에서 id가 같은 과정만 done:true로 바꾸고 다른 과정 객체는 그대로 보존하는 방식은?', options: [
      ['`map`에서 일치한 항목만 `{ ...course, done: true }`로 반환', '새 배열을 만들고 변경된 항목만 새 객체로 교체합니다.'],
      ['각 course의 `done`에 직접 대입한 뒤 원래 배열 반환', '기존 배열 안의 state 객체를 직접 변경합니다.'],
      ['목록 전체를 `{ done: true }` 하나로 바꾸기', '과정 배열 구조와 항목별 title·id 정보를 모두 잃습니다.'],
    ], answer: 0, hint: '배열과 바뀌는 항목의 객체 참조를 각각 새로 만드는지 확인하세요.', explanation: '`map`은 새 배열을 반환하고, 일치한 항목에서 전개 문법을 사용하면 해당 객체도 새 참조로 교체합니다.' },
    trace: { prompt: 'react와 js 두 항목이 모두 done:false입니다. react만 복사해 true로 바꾸면 두 항목 상태는?', answers: ['react:true,js:false', 'react true, js false'], hint: 'id가 일치하는 항목만 새 객체를 반환하고 나머지는 원래 항목을 반환합니다.', explanation: 'react 항목만 새 객체에서 true가 되고 js 항목은 false 그대로 남습니다.' },
    debugHint: 'map 안에서 일치한 기존 course 객체의 필드에 직접 대입하지 않는지 살펴보세요.',
    repairHint: 'setCourses의 함수형 updater 안에서 map을 사용하고 id가 일치한 항목만 전개 복사해 done을 true로 설정하세요.',
    repairId: 'react-w4-d4-repair-v2',
  },
  '4-5': {
    choice: { prompt: 'count가 4인 렌더에서 handler가 `setCount(count + 1)`을 호출한 직후 같은 handler에서 읽는 count는?', options: [
      ['5로 즉시 바뀐다', 'setter 호출은 현재 handler의 렌더 snapshot을 즉시 다시 쓰지 않습니다.'],
      ['4', '현재 handler의 count는 그 handler를 만든 렌더의 snapshot인 4입니다.'],
      ['항상 0으로 초기화된다', 'state setter는 초기값으로 돌아가는 동작이 아닙니다.'],
    ], answer: 1, hint: 'state 업데이트 요청과 현재 함수가 닫아 둔 렌더 값을 구분하세요.', explanation: 'setter는 다음 렌더를 요청하지만 현재 handler의 count 변수는 계속 4입니다. 다음 렌더에서 새 값 5를 받습니다.' },
    trace: { prompt: '렌더에서 count가 4입니다. handler가 1을 더하도록 setter를 호출한 뒤 다시 렌더되기 전에 count를 기록하면 무엇이 나오나요?', answers: ['4'], hint: 'handler는 자신을 만든 렌더의 count snapshot을 계속 읽습니다.', explanation: '현재 handler에서 읽는 값은 4이며 setter가 예약한 다음 state 5는 다음 렌더에서 전달됩니다.' },
    debugHint: 'setter 호출 뒤 현재 handler의 `count`가 즉시 바뀐다고 가정한 줄을 찾으세요.',
    repairHint: '한 번의 이벤트에서 두 번 더하려는 요구라면 각각의 setter가 큐 직전 값을 받도록 함수형 updater를 사용하세요.',
    repairId: 'react-w4-d5-repair-v2',
  },
  '5-1': {
    choice: { prompt: 'title state를 입력창에 표시하고 사용자가 입력한 새 값도 바로 반영하는 제어 입력은?', options: [
      ['`<input value={title} />`', 'value는 고정되지만 바뀐 값을 state로 돌려보낼 handler가 없습니다.'],
      ['`<input defaultValue={title} onChange={...} />`', 'defaultValue는 초기값만 제공해 이후 값을 React state가 제어하지 않습니다.'],
      ['`<input value={title} onChange={(event) => setTitle(event.target.value)} />`', '현재 state를 표시하고 동기 onChange에서 사용자 입력으로 state를 갱신합니다.'],
    ], answer: 2, hint: '현재 값을 표시하는 prop과 사용자의 새 입력을 state로 반영하는 handler가 모두 있는지 확인하세요.', explanation: 'controlled input은 `value`를 state와 연결하고 입력 이벤트에서 같은 입력값을 `onChange`로 동기적으로 state에 돌려보냅니다.' },
    trace: { prompt: 'title의 현재 값이 "React"이고 사용자가 "React UI"를 입력합니다. onChange가 setTitle(event.target.value)를 호출한 뒤 다음 렌더의 title은?', answers: ['React UI', '"React UI"'], hint: 'event.target.value가 입력한 전체 문자열을 반환합니다.', explanation: 'handler가 입력값 `React UI`를 state에 저장하므로 다음 렌더에서 value와 title이 그 문자열로 맞춰집니다.' },
    debugHint: 'value prop은 있지만 입력 변경 때 새 값을 저장하는 onChange가 빠지지 않았는지 확인하세요.',
  },
  '5-2': {
    choice: { prompt: 'label의 htmlFor가 "course-title"일 때 연결되는 입력은?', options: [
      ['`<input id="course-title" />`', 'htmlFor 값과 id 값이 같아 label이 입력과 연결됩니다.'],
      ['`<input name="course-title" />`', 'name은 폼 제출 이름이며 htmlFor가 가리키는 id를 대신하지 않습니다.'],
      ['`<input key="course-title" />`', 'key는 React 목록의 정체성에 쓰이며 DOM label 연결 속성이 아닙니다.'],
    ], answer: 0, hint: 'label의 htmlFor가 입력 요소의 어떤 속성을 참조하는지 확인하세요.', explanation: 'label의 `htmlFor`는 같은 값을 가진 input의 `id`와 연결됩니다.' },
    trace: { prompt: 'htmlFor="course-title"인 label의 화면 텍스트가 "과정 이름"입니다. 연결된 input은 어떤 accessible name을 받나요?', answers: ['과정 이름', '"과정 이름"'], hint: '연결된 label의 텍스트가 input의 이름으로 제공됩니다.', explanation: 'label이 input과 연결되어 있으므로 보이는 `과정 이름` 텍스트가 해당 입력의 accessible name이 됩니다.' },
    debugHint: 'label의 htmlFor 값과 input의 id 값이 철자까지 같은지 대조하세요.',
  },
  '5-3': {
    choice: { prompt: '정렬 가능한 과정 목록에서 key로 사용할 안정적인 값은?', options: [
      ['현재 배열 index', '앞 항목을 추가하거나 순서를 바꾸면 다른 과정을 가리킬 수 있습니다.'],
      ['`course.id`', '목록 위치와 독립적인 데이터 식별자를 사용합니다.'],
      ['렌더마다 새로 생성한 random 값', '렌더마다 바뀌어 항목의 기존 정체성이 유지되지 않습니다.'],
    ], answer: 1, hint: '항목의 화면 위치가 아니라 항목 자체를 계속 식별하는 값을 고르세요.', explanation: '변하지 않는 고유 `course.id`는 중간 삽입과 정렬 뒤에도 같은 항목을 식별합니다.' },
    trace: { prompt: 'courses가 id 순서 js, react이고 map에서 key={course.id}를 사용합니다. 렌더되는 key 순서는?', answers: ['js,react', 'js react'], hint: '각 항목의 id 값이 같은 순서로 key에 전달됩니다.', explanation: 'map은 배열 순서대로 처리하므로 key 순서도 js, react입니다.' },
    debugHint: '정렬이나 삽입 뒤에도 같은 항목을 식별할 데이터 id 대신 위치값을 key로 사용했는지 확인하세요.',
  },
  '5-4': {
    choice: { prompt: '제출 시 브라우저의 기본 페이지 이동을 막은 뒤 제목 저장을 실행하는 handler는?', options: [
      ['`save(title); event.preventDefault();`', '저장을 먼저 실행하고 기본 제출 동작을 취소하므로 순서를 요구와 다르게 표현합니다.'],
      ['`event.stopPropagation(); save(title);`', '부모로의 전파만 막고 form의 기본 제출 동작은 취소하지 않습니다.'],
      ['`event.preventDefault(); save(title);`', '기본 제출 동작을 취소한 뒤 앱의 저장 동작을 호출합니다.'],
    ], answer: 2, hint: '페이지 기본 동작 취소와 이벤트 전파 중단은 서로 다른 동작입니다.', explanation: '`preventDefault()`는 폼의 기본 제출/페이지 이동을 막고, 이어서 저장 동작을 호출할 수 있게 합니다.' },
    trace: { prompt: 'submit handler가 preventDefault() 다음 save("React")를 호출합니다. 폼의 브라우저 기본 이동은 일어나며 save에는 어떤 값이 전달되나요?', answers: ['이동하지 않음; React', '기본 이동 없음, React 저장', 'React 저장, 페이지 이동 없음'], hint: 'preventDefault는 기본 동작을 취소하고 이후 handler 코드는 계속 실행합니다.', explanation: '기본 페이지 이동은 취소되고 handler의 다음 문장인 `save("React")`는 실행됩니다.' },
    debugHint: 'form onSubmit handler가 save 전에 event.preventDefault()를 호출하는지 확인하세요.',
    repairHint: 'submit handler에서 event.preventDefault()를 먼저 호출하고 제목을 trim한 값을 save에 전달하세요.',
    repairId: 'react-w5-d4-repair-v2',
  },
  '5-5': {
    choice: { prompt: '사용자가 입력 오류를 해당 입력과 함께 알 수 있도록 안내를 연결하는 JSX 조합은?', options: [
      ['입력의 `aria-describedby`에 오류 문단 id를 지정하고 오류 문단에 같은 id 사용', '참조하는 설명 id와 실제 오류 문단 id가 일치하면 보조 기술이 관계를 따라갈 수 있습니다.'],
      ['오류 문단만 렌더링하고 입력과 연결하지 않기', '문단이 입력의 설명으로 연결되지 않아 어느 필드의 오류인지 알기 어렵습니다.'],
      ['input에 오류 문구를 placeholder로만 넣기', 'placeholder는 지속적인 레이블이나 연결된 오류 안내를 대신하지 않습니다.'],
    ], answer: 0, hint: '입력 요소가 어느 오류 설명을 참조하는지 id 연결을 확인하세요.', explanation: '`aria-describedby`가 오류 문단의 id를 참조하면 입력 설명에 오류 내용을 연결할 수 있습니다. 레이블은 별도로 유지해야 합니다.' },
    trace: { prompt: 'input의 aria-describedby가 "course-title-error"를 가리킵니다. 연결된 오류 문단의 id는 무엇이어야 하나요?', code: '<input aria-describedby="course-title-error" /><p id="title-error">이름을 입력하세요.</p>', answers: ['course-title-error', '"course-title-error"'], versioned: true, hint: 'input이 참조하는 문자열과 문단의 id를 일치시키세요.', explanation: 'input은 `course-title-error`를 찾지만 현재 문단 id는 `title-error`라 연결되지 않습니다. 문단 id를 `course-title-error`로 바꾸면 됩니다.' },
    debugHint: 'aria-describedby가 가리키는 id가 실제 오류 안내 요소에 존재하는지 확인하세요.',
    repairHint: '기존 label과 입력값 변경 handler를 유지하면서, 오류가 있을 때 입력이 오류 문단 id를 aria-describedby로 참조하고 문단에도 그 id를 부여하세요.',
    repairId: 'react-w5-d5-repair-v2',
  },
  '6-1': {
    choice: { prompt: 'roomId 변경과 컴포넌트 종료에 맞춰 채팅 연결을 만들고 해제하는 React Hook은?', options: [
      ['`useMemo`로 connection 객체를 계산', '메모 계산은 연결의 외부 lifecycle을 설정하고 정리하지 않습니다.'],
      ['`useEffect`에서 연결하고 반환 cleanup에서 disconnect', 'Effect는 외부 시스템과 동기화하고 cleanup은 다시 실행되기 전·언마운트 때 정리합니다.'],
      ['`useState`만으로 연결을 보관', 'state 보관 자체가 외부 연결의 setup과 teardown을 실행하지 않습니다.'],
    ], answer: 1, hint: '외부 시스템의 setup과 cleanup을 담당하는 Hook을 떠올리세요.', explanation: 'Effect 본문이 연결을 만들고 반환된 cleanup은 roomId가 달라져 Effect가 다시 실행되기 전, 그리고 컴포넌트 종료 때 연결을 해제합니다.' },
    trace: { prompt: 'roomId가 "study-1"에서 "study-2"로 바뀌고 Effect가 setup/cleanup을 올바르게 반환합니다. 순서대로 일어나는 일은?', answers: ['study-1 해제 후 study-2 연결', '이전 연결 해제 후 새 roomId 연결', '이전 cleanup 다음 새 연결'], hint: 'React는 의존성이 바뀐 Effect를 다시 실행하기 전에 이전 render의 cleanup을 호출합니다.', explanation: '이전 room 연결을 먼저 해제한 다음 새 roomId로 다시 연결합니다.' },
    debugHint: 'connection을 만들기만 하고 이전 연결과 컴포넌트 종료 때 실행될 정리 함수를 반환하지 않았는지 확인하세요.',
  },
  '6-2': {
    choice: { prompt: 'courses에서 done인 항목만 그릴 때 먼저 할 올바른 처리는?', options: [
      ['Effect가 visible state를 복사하게 만들기', '현재 입력에서 계산 가능한 파생값을 별도 state로 복제합니다.'],
      ['DOM을 직접 삭제해 목록을 필터링하기', 'React가 관리하는 렌더 상태 흐름을 우회합니다.'],
      ['렌더링 중 `courses.filter((course) => course.done)` 계산하기', '현재 props/state에서 파생 목록을 계산해 중복 state를 피합니다.'],
    ], answer: 2, hint: '필터 결과를 독립적으로 편집하지 않는다면 원본 목록에서 바로 계산할 수 있습니다.', explanation: '완료 목록은 현재 courses에서 직접 도출할 수 있으므로 Effect와 별도 state 없이 렌더 중 filter로 계산하면 됩니다.' },
    trace: { prompt: 'courses의 done 값이 `[true,false,true]`일 때 filter 결과의 항목 수는?', answers: ['2', '두 개', '2개'], hint: 'done이 true인 항목만 세세요.', explanation: '첫 번째와 세 번째 과정만 조건을 만족하므로 두 항목이 남습니다.' },
    debugHint: '기존 courses에서 바로 계산되는 visible 목록을 다시 state로 저장하는 Effect가 있는지 살펴보세요.',
  },
  '6-3': {
    choice: { prompt: 'Effect 안에서 search(query)를 호출하고 query가 바뀌면 다시 검색하려면 의존성 배열은?', options: [
      ['`[]`', '빈 배열은 query 변경을 이 Effect의 재동기화 신호로 포함하지 않습니다.'],
      ['`[query]`', 'Effect가 사용하는 query가 바뀔 때 검색을 다시 동기화합니다.'],
      ['`[setQuery]`만', 'Effect가 읽는 반응형 값은 query이며 setter만 넣으면 query 변경과 일치하지 않습니다.'],
    ], answer: 1, hint: 'Effect 본문에서 읽는 반응형 값을 마지막 배열과 대조하세요.', explanation: 'Effect가 query를 읽으므로 `[query]`에 넣어 검색어 변경을 반영해야 합니다.' },
    trace: { prompt: '개발용 Strict Mode의 추가 실행은 세지 않습니다. query가 "react"에서 "react state"로 바뀌고 dependency에 query가 있습니다. Effect setup은 몇 번 실행되며 두 번째 검색어는?', answers: ['두 번; react state', '2회; react state', '초기 실행과 변경 뒤 실행; react state'], versioned: true, hint: '첫 렌더 setup 한 번과 query 변경 뒤 setup 한 번을 셉니다. 개발용 Strict Mode 검사는 조건에서 제외했습니다.', explanation: 'Strict Mode의 개발용 추가 setup/cleanup을 제외하면 첫 렌더에서 한 번, query 변경 뒤 한 번 실행됩니다. 두 번째 실행에는 `react state`가 전달됩니다.' },
    debugHint: 'Effect 본문에서 읽는 query가 의존성 목록에 빠져 있는지 확인하세요.',
  },
  '6-4': {
    choice: { prompt: '검색 query가 바뀌기 전에 이전 fetch 요청을 종료시킬 수 있도록 Effect에서 해야 할 일은?', options: [
      ['Effect cleanup에서 요청에 연결한 AbortController를 abort', '요청 signal과 연결된 controller를 정리하면 이전 fetch를 취소할 수 있습니다.'],
      ['결과 배열을 비우기만 하기', '화면 데이터만 바꾸며 이미 진행 중인 네트워크 요청을 취소하지 않습니다.'],
      ['React state setter를 두 번 호출', 'state 업데이트 횟수는 네트워크 요청의 취소와 관계가 없습니다.'],
    ], answer: 0, hint: 'fetch에 전달한 signal의 생명주기를 관리하는 controller를 cleanup에서 정리하세요.', explanation: 'AbortController.signal을 요청에 전달하고 cleanup에서 abort하면 query가 바뀌거나 화면이 종료될 때 이전 요청을 취소할 수 있습니다.' },
    trace: { prompt: 'query A 요청에 controller.signal을 전달했습니다. query가 B로 바뀌어 이전 Effect cleanup이 controller.abort()를 부르면 A 요청의 signal 상태는?', answers: ['aborted', '중단됨', 'true'], hint: 'AbortController.abort()가 signal에 표시하는 상태를 확인하세요.', explanation: 'abort 호출 뒤 signal의 `aborted` 값은 true가 되어 연결된 요청을 중단할 수 있습니다.' },
    debugHint: 'fetch가 AbortController.signal을 받는지와 cleanup에서 해당 controller를 abort하는지 함께 확인하세요.',
    repairHint: 'query별 controller를 만들고 fetch에 signal을 전달한 다음 Effect cleanup에서 abort하세요. query는 dependency에 유지하세요.',
    repairId: 'react-w6-d4-repair-v2',
  },
  '6-5': {
    choice: { prompt: '현재 courses와 query로 화면에 보일 제목 목록을 만들 때 stale한 별도 state를 피하는 방법은?', options: [
      ['query마다 visible state를 Effect에서 따로 동기화', '원본과 복제 값 사이에 한 렌더 이상 어긋날 수 있는 중복 상태를 만듭니다.'],
      ['마지막 query 결과를 전역 변수에 저장', '컴포넌트 렌더와 React state 흐름 밖에서 값을 보관합니다.'],
      ['렌더 중 `courses.filter((course) => course.title.includes(query))` 계산', '현재 입력에서 직접 파생해 별도 state 동기화 단계를 없앱니다.'],
    ], answer: 2, hint: '사용자가 따로 수정하지 않는 표시 목록인지, 외부 시스템 값인지 구분하세요.', explanation: 'visibleCourses는 현재 courses와 query에서 계산되므로 렌더 중 filter하는 것이 원본과 복제 상태의 불일치를 피합니다.' },
    trace: { prompt: '과정 제목이 React, JavaScript이고 query가 "Java"일 때 제목에 includes(query)를 적용한 목록은?', answers: ['JavaScript', 'JavaScript만', 'JavaScript 과정'], hint: '대소문자를 구분해 각 title.includes("Java") 결과를 확인하세요.', explanation: 'React는 문자열을 포함하지 않고 JavaScript는 포함하므로 결과에는 JavaScript만 남습니다.' },
    debugHint: '원본 courses 또는 query 변경 뒤에도 이전 visible state를 계속 반환하는지 확인하세요.',
    repairHint: 'useState 복제 목록을 제거하고 courses와 query를 받아 현재 조건에 맞는 새 목록을 반환하세요.',
  },
  '7-1': {
    choice: { prompt: 'reducer가 `{ open: false }`를 받았을 때 open action을 처리하면서 원래 객체를 보존하는 반환은?', options: [
      ['`state.open = true; return state;`', '원본 reducer state를 직접 바꾸고 같은 참조를 반환합니다.'],
      ['`return { ...state, open: true };`', '새 객체에 기존 필드를 복사하고 open만 바꾸므로 reducer 입력을 보존합니다.'],
      ['`return { open: true };`', '새 객체지만 다른 state 필드를 복사하지 않아 기존 값을 잃을 수 있습니다.'],
    ], answer: 1, hint: '기존 객체를 유지하고 바뀐 필드만 새 객체에 반영하세요.', explanation: '순수 reducer는 입력 state를 직접 변경하지 않습니다. 전개 복사 후 바뀐 필드만 덮어쓰면 다른 필드를 보존하는 새 상태를 반환합니다.' },
    trace: { prompt: 'state가 `{ open: false, query: "React" }`이고 reducer가 `{ ...state, open: true }`를 반환합니다. next.query 값은 무엇인가요?', answers: ['React', '"React"'], hint: '전개 문법으로 복사한 필드 가운데 open 외의 값이 어떻게 되는지 확인하세요.', explanation: '전개 문법이 기존 query를 복사하고 open만 덮어쓰므로 next.query는 `React`입니다.' },
    debugHint: 'reducer의 입력 state를 직접 대입하는지, 다음 상태용 새 객체를 반환하는지 확인하세요.',
  },
  '7-2': {
    choice: { prompt: '완료 처리 action이 courseReducer에 전달해야 하는 값은?', options: [
      ['`course.id` 문자열만 전달', '어떤 상태 전이를 수행할지 설명하는 action 정보가 없습니다.'],
      ['`{ type: "course/complete", id: course.id }`처럼 동작 종류와 대상 id', 'type은 전이를, id는 변경할 항목을 식별합니다.'],
      ['React DOM의 `<li>` 요소 자체', 'reducer에는 화면 노드가 아니라 상태 변경을 표현하는 일반 데이터 action을 전달합니다.'],
    ], answer: 1, hint: 'reducer가 무엇을 할지와 어느 과정을 대상으로 삼을지 알 수 있어야 합니다.', explanation: 'action의 `type`은 완료 동작을 구분하고 `id`는 그 동작의 대상을 지정합니다. 두 값이 있으면 reducer가 구체적인 다음 상태를 계산할 수 있습니다.' },
    trace: { prompt: 'action은 `{ type: "course/complete", id: "react" }`이고 현재 course는 `{ id: "js" }`입니다. `course.id === action.id`의 결과는?', answers: ['false', '거짓', '아니요'], hint: 'course와 action의 id 문자열을 비교하세요. 두 값이 같은지 확인하면 됩니다.', explanation: '현재 course의 id는 `js`, action 대상 id는 `react`이므로 두 값이 다릅니다. 이 course에 대한 완료 조건은 false입니다.' },
    debugHint: 'dispatch에 원시 id만 보내는지, action type과 변경 대상 id를 함께 전달하는지 확인하세요.',
  },
  '7-3': {
    choice: { prompt: 'Provider의 theme 값이 바뀔 때 Header가 최신 값을 표시하려면 컴포넌트에서 무엇을 해야 하나요?', options: [
      ['`ThemeContext`에서 `useContext`로 값을 읽기', 'Context를 읽는 소비자가 Provider가 제공하는 최신 값을 사용합니다.'],
      ['같은 글자를 JSX에 고정하기', '고정 문자열은 Provider 값 변경을 구독하거나 반영하지 않습니다.'],
      ['theme을 전역 변수에 복사하기', 'React Context 소비 관계와 렌더 흐름을 우회합니다.'],
    ], answer: 0, hint: '자식이 전달 경로를 직접 받지 않아도 값을 구독할 수 있는 React API를 떠올리세요.', explanation: '`useContext(ThemeContext)`는 가장 가까운 Provider 값을 읽고 그 값이 바뀔 때 소비 컴포넌트가 최신 데이터를 사용하게 합니다.' },
    trace: { prompt: '가장 가까운 ThemeContext Provider가 `dark`를 제공합니다. `const theme = useContext(ThemeContext)` 다음의 theme 값은 무엇인가요?', answers: ['dark', '"dark"'], hint: 'useContext는 기본값보다 현재 적용되는 가장 가까운 Provider 값을 우선 읽습니다.', explanation: 'Provider가 `dark`를 제공하므로 소비자가 읽는 theme도 `dark`입니다.' },
    debugHint: 'Provider를 선언했는지만 보지 말고 Header가 useContext로 실제 값을 읽는지 확인하세요.',
  },
  '7-4': {
    choice: { prompt: '검색 조건과 완료 항목처럼 함께 바뀌는 과정 화면 상태를 한 곳에서 관리할 때 무엇이 도움 되나요?', options: [
      ['각 하위 컴포넌트에 별도의 같은 state를 만들기', '형제 컴포넌트 상태가 따로 움직여 검색과 목록이 서로 맞지 않을 수 있습니다.'],
      ['관련 전이를 소유한 가까운 부모의 `useReducer`', '부모가 상태와 전이 규칙을 소유하고 필요한 값과 dispatch를 하위에 전달할 수 있습니다.'],
      ['Context로 reducer와 상태 변경 책임을 모두 없애기', 'Context는 값을 전달하며 상태 전이 로직 자체를 대신 만들지 않습니다.'],
    ], answer: 1, hint: '같이 갱신되어야 하는 값을 어느 경계에서 한 번 관리할지 생각하세요.', explanation: '함께 바뀌는 데이터와 전이를 가까운 소유 컴포넌트의 reducer에 두면 하위 화면은 같은 상태와 dispatch를 사용할 수 있습니다.' },
    trace: { prompt: 'reducer의 query가 `React`이고 `{ type: "query", value: "React 19" }` action이 처리됩니다. action 뒤 query는 무엇인가요?', answers: ['React 19', '"React 19"'], hint: 'query action이 새 값으로 바꾸는 필드는 query입니다.', explanation: 'reducer는 action.value인 `React 19`를 다음 state의 query에 넣습니다.' },
    debugHint: '하위 UI마다 따로 보관해 불일치하는 값이 있는지, 화면에서 함께 써야 하는 상태가 공통 소유자에 모였는지 확인하세요.',
    repairHint: 'query 변경과 과정 완료 action을 reducer 한 곳에서 처리하고, 바꾸지 않은 query·courses 필드는 새 상태에도 보존하세요.',
    repairId: 'react-w7-d4-repair-v2',
  },
  '7-5': {
    choice: { prompt: 'ThemeContext Provider 바깥에서 소비자가 사용할 기본 theme을 정하는 곳은?', options: [
      ['소비 컴포넌트의 전역 DOM 검색', 'DOM 조회는 Context가 Provider 없이 제공하는 기본값을 정하지 않습니다.'],
      ['`createContext("light")`의 기본값 인자', '가까운 Provider가 없을 때 useContext가 반환할 기본값입니다.'],
      ['각 `useContext` 호출 뒤 직접 대입', 'useContext 결과를 다시 지정하면 Provider 소비 규칙을 우회합니다.'],
    ], answer: 1, hint: 'Provider가 없을 때 Context 객체를 만들며 지정한 값이 어떻게 쓰이는지 살펴보세요.', explanation: '`createContext("light")`는 일치하는 Provider가 없는 트리에서 `useContext`가 반환할 기본값을 지정합니다.' },
    trace: { prompt: 'ThemeContext는 `createContext("light")`로 만들었고 현재 소비자 위에 Provider가 없습니다. useContext가 반환할 값은?', answers: ['light', '"light"'], hint: '가장 가까운 Provider가 없으므로 Context 선언의 기본값을 사용합니다.', explanation: 'Provider가 없을 때는 선언한 기본값인 `light`가 반환됩니다.' },
    debugHint: 'ThemeContext 선언의 기본값이 Provider 밖 소비자의 기대값과 일치하는지 확인하세요.',
    repairHint: 'ThemeContext를 useContext로 읽은 뒤 현재 값을 JSX에 표시하고 기본값 문자를 고정하지 마세요.',
    repairId: 'react-w7-d5-repair-v2',
  },
  '8-1': {
    choice: { prompt: '상태와 Effect를 사용하는 재사용 React Hook으로 알맞은 이름은?', options: [
      ['`getDisclosure`', 'get으로 시작하므로 Hook 사용을 식별하는 소문자 use 접두사가 없습니다.'],
      ['`UseDisclosure`', '대문자 U는 소문자 use 접두사와 일치하지 않습니다.'],
      ['`useDisclosure`', '소문자 use로 시작해 사용자 정의 Hook임을 드러냅니다.'],
    ], answer: 2, hint: 'React custom Hook의 이름은 소문자 use로 시작해야 합니다.', explanation: '사용자 정의 Hook은 `use`로 시작하고 뒤에 이름을 붙입니다. 이 규칙으로 개발자와 lint 도구가 Hook 호출 위치를 판별할 수 있습니다.' },
    trace: { prompt: '`hookName`이 `"useDisclosure"`일 때 `hookName.startsWith("use")`의 결과는?', code: 'const hookName = "useDisclosure";\nconsole.log(hookName.startsWith("use"));', answers: ['true', '참', '예'], idVersion: 3, versioned: true, hint: '문자열의 처음 세 글자와 전달한 접두사를 그대로 비교하세요.', explanation: '`useDisclosure`는 소문자 `use`로 시작하므로 startsWith("use")는 true입니다.' },
    debugHint: 'Hook을 사용하는 재사용 함수의 이름이 소문자 use 접두사로 시작하는지 살펴보세요.',
  },
  '8-2': {
    choice: { prompt: '조건부 early return이 있는 컴포넌트에서 Hook 호출 순서를 안정적으로 유지하려면 어디에 Hook을 둘까요?', options: [
      ['컴포넌트 함수 최상위, early return보다 앞', '모든 렌더에서 같은 순서로 Hook이 호출됩니다.'],
      ['조건이 참일 때만 실행하는 분기 안', '조건 결과가 바뀌면 Hook 호출 여부가 달라집니다.'],
      ['클릭 handler 안', '이벤트마다 Hook을 호출하면 컴포넌트 렌더의 Hook 순서를 보장하지 못합니다.'],
    ], answer: 0, hint: '컴포넌트가 매 렌더마다 같은 Hook 호출 순서를 갖는 위치를 고르세요.', explanation: 'Hook은 컴포넌트 함수 최상위에서 early return보다 먼저 호출해야 조건 변화와 관계없이 순서가 유지됩니다.' },
    trace: { prompt: 'Panel은 첫 줄에서 useState를 호출한 뒤 enabled가 false이면 null을 반환합니다. 그 렌더에서 useState는 호출되나요?', answers: ['호출된다', '예', '항상 먼저 호출된다'], hint: 'Hook은 early return을 만나기 전에 컴포넌트 본문 최상위에서 실행됩니다.', explanation: 'useState가 early return 앞에 있으므로 enabled 값과 관계없이 그 렌더에서 먼저 호출됩니다.' },
    debugHint: '조건문이나 early return 앞에서 Hook이 같은 순서로 먼저 실행되는지 줄을 따라가세요.',
  },
  '8-3': {
    choice: { prompt: 'useDisclosure 호출자가 열림 상태를 표시하고 열기·닫기 동작을 사용할 수 있는 반환 계약은?', options: [
      ['`open` 값 하나만 반환', '현재 값만 읽을 수 있고 호출자가 상태를 바꿀 API가 없습니다.'],
      ['DOM의 전역 요소 반환', 'DOM 참조는 Hook 상태와 동작을 표현하는 반환 계약을 대신하지 않습니다.'],
      ['`{ open, show, hide }` 객체 반환', '현재 상태와 의도를 드러내는 동작을 호출자에게 함께 제공합니다.'],
    ], answer: 2, hint: '화면 상태를 읽는 값과 상태 전이를 요청할 동작을 함께 돌려주세요.', explanation: '호출자가 화면을 표시하고 상태를 바꾸도록 open 값과 show/hide API를 함께 반환하면 계약이 분명합니다.' },
    trace: { prompt: '`controls`가 `{ open: false, show() {}, hide() {} }`일 때 `Object.keys(controls).join(",")`의 결과는?', answers: ['open,show,hide'], hint: '객체 literal에 선언된 open, show, hide 키를 순서대로 읽으세요.', explanation: '객체 키가 open, show, hide 순서로 선언되어 결과는 `open,show,hide`입니다.' },
    debugHint: 'Hook이 값을 반환하더라도 호출자가 필요한 setter나 명시적 show/hide 동작을 함께 받을 수 있는지 확인하세요.',
  },
  '8-4': {
    choice: { prompt: 'Hook 내부 Effect가 source에 구독하고 onChange callback을 읽을 때 필요한 정리와 의존성은?', options: [
      ['cleanup에서 unsubscribe를 호출하고 `[source, onChange]`를 의존성에 둡니다.', '구독을 닫고 Effect가 읽는 반응형 값이 바뀌면 다시 동기화합니다.'],
      ['구독을 정리하지 않고 빈 의존성 배열만 둡니다.', '오래된 callback이 남고 컴포넌트 종료 뒤 구독이 누수될 수 있습니다.'],
      ['렌더 본문에서 매번 subscribe하고 의존성 배열을 생략합니다.', '렌더 중 부작용을 만들고 반복 렌더마다 구독을 누적할 수 있습니다.'],
    ], answer: 0, hint: '구독 설정에는 해제 동작이, callback 변경에는 최신 구독이 필요합니다.', explanation: 'Effect cleanup은 이전 구독을 해제하고 `[source, onChange]`는 두 입력 중 하나가 바뀔 때 최신 callback으로 다시 구독하게 합니다.' },
    trace: { prompt: 'onChange가 바뀌어 Effect를 다시 실행하기 전 React가 처리하는 첫 구독 단계는 무엇인가요?', answers: ['이전 Effect cleanup에서 기존 구독 해제', '기존 unsubscribe 호출', '이전 구독 해제'], hint: 'Effect 재실행은 지난 설정의 cleanup을 먼저 처리합니다.', explanation: '새 callback의 구독을 만들기 전에 이전 Effect cleanup이 기존 source 구독을 해제합니다.' },
    debugHint: '구독이 해제되지 않은 채 쌓이는지, cleanup 뒤 Effect가 읽는 source와 onChange로 다시 구독하는지 확인하세요.',
  },
  '8-5': {
    choice: { prompt: '서로 다른 컴포넌트가 같은 useDisclosure Hook을 호출할 때 상태 관계는?', options: [
      ['Hook 호출마다 각 컴포넌트가 독립된 open state를 가집니다.', 'Hook은 로직을 공유하지만 state 저장소를 자동으로 하나로 합치지 않습니다.'],
      ['이름이 같으므로 모든 컴포넌트가 같은 open state를 가집니다.', '같은 함수 사용만으로 컴포넌트 사이 state가 공유되지는 않습니다.'],
      ['두 번째 호출은 첫 번째 호출의 setter를 이어받습니다.', '각 호출은 자신이 만든 state와 setter를 사용합니다.'],
    ], answer: 0, hint: 'state 자체를 공유해야 한다면 custom Hook 호출만으로 충분한지 생각하세요.', explanation: 'custom Hook은 상태 로직을 재사용합니다. 각 호출은 독립된 state와 Effect를 가지며 실제 공유 state가 필요하면 공통 소유자로 올려야 합니다.' },
    trace: { prompt: '첫 번째 열기 버튼을 누른 뒤 두 번째 패널의 `right.open` 값은?', code: 'import { useState } from "react";\n\nfunction useDisclosure() {\n  const [open, setOpen] = useState(false);\n  return { open, show: () => setOpen(true) };\n}\n\nfunction Pair() {\n  const left = useDisclosure();\n  const right = useDisclosure();\n  return (\n    <>\n      <button type="button" onClick={left.show}>첫 번째 열기</button>\n      <p>첫 번째: {left.open ? "열림" : "닫힘"}</p>\n      <p>두 번째: {right.open ? "열림" : "닫힘"}</p>\n    </>\n  );\n}', answers: ['false', '닫힘', '열리지 않음'], versioned: true, hint: 'useDisclosure가 두 번 호출되며, 각 호출은 useState(false)로 자기 상태를 만듭니다.', explanation: '첫 번째 버튼은 left의 show만 호출합니다. right는 별도의 useDisclosure 호출에서 만든 state라 false(닫힘)로 남습니다.' },
    debugHint: 'Hook 내부의 state가 모듈 변수나 DOM 값으로 공유되는지, 각 호출의 useState로 만들어지는지 확인하세요.',
    repairHint: '모듈 전역 open 값을 제거하고 useState를 Hook 안에서 호출해 각 호출의 open과 setter를 반환하세요.',
    repairId: 'react-w8-d5-repair-v2',
  },
  '9-1': {
    choice: { prompt: '요청 화면의 준비·진행·성공·실패를 서로 모순되지 않게 저장하는 모델은?', options: [
      ['독립된 loading과 error boolean 여러 개', '두 boolean이 동시에 true가 되는 표현을 만들 수 있습니다.'],
      ['`idle | loading | success | error` 중 하나의 status 값', '현재 요청 단계가 단일 값이라 화면 분기를 명확히 합니다.'],
      ['요청마다 새 React 컴포넌트 타입 생성', '상태값 모델링 대신 타입을 바꾸면 요청 진행 단계가 분명해지지 않습니다.'],
    ], answer: 1, hint: '한 시점에 요청이 어떤 단계인지 한 값으로 표현하세요.', explanation: '구별된 단일 status는 요청 단계들을 서로 배타적으로 표현해 loading과 error 같은 모순 조합을 예방합니다.' },
    trace: { prompt: '`fetchCourses`가 응답 전까지 끝나지 않는다고 가정합니다. `loadCourses`가 호출된 뒤 응답을 받기 전 `status` 값은?', code: 'async function loadCourses(query, fetchCourses, setStatus) {\n  setStatus("loading");\n  try {\n    const courses = await fetchCourses(query);\n    setStatus("success");\n    return courses;\n  } catch (error) {\n    setStatus("error");\n    throw error;\n  }\n}', answers: ['loading', '"loading"', '불러오는 중'], versioned: true, hint: '요청 전에 status를 바꾸고, 응답 뒤에야 success 또는 error로 갱신합니다.', explanation: 'fetchCourses가 끝나기 전에는 await 다음 줄에 도달하지 않으므로 `loading`이 유지됩니다.' },
    debugHint: '하나의 요청 단계가 단일 status 값인지, 서로 동시에 참이 될 boolean으로 흩어져 있는지 확인하세요.',
  },
  '9-2': {
    choice: { prompt: '목록 요청을 시작한 뒤 응답을 기다리는 동안 사용자에게 표시할 UI는?', options: [
      ['전 요청의 결과를 새 응답인 것처럼 표시', '현재 검색과 다른 데이터일 수 있으므로 새 요청 진행 상태를 설명하지 못합니다.'],
      ['현재 요청이 진행 중임을 나타내는 loading 상태', '요청을 기다리는 동안 사용자가 작업 진행을 이해할 수 있습니다.'],
      ['요청 완료 여부와 무관하게 오류 상태로 표시', '요청을 시작했다는 이유만으로 오류가 난 것은 아닙니다.'],
    ], answer: 1, hint: '요청을 await하기 전 status가 어떤 값으로 전환되는지 확인하세요.', explanation: '요청 시작 시 loading으로 바꾸면 응답을 기다리는 동안 로딩 UI를 표시하고 응답 후 성공·빈 결과·오류를 분기할 수 있습니다.' },
    trace: { prompt: 'loadCourses가 먼저 `setStatus("loading")`을 호출한 뒤 await fetchCourses(query)를 실행합니다. Promise가 아직 pending일 때 화면의 요청 상태는?', answers: ['loading', '불러오는 중', '진행 중'], hint: '요청 결과가 오기 전 설정한 단계가 유지됩니다.', explanation: 'Promise가 아직 pending이므로 가장 최근 요청 상태인 loading이 유지됩니다.' },
    debugHint: 'await fetch 전에 상태를 loading으로 바꾸는지, 완료 뒤에야 처음 진행 상태를 표시하는지 확인하세요.',
  },
  '9-3': {
    choice: { prompt: 'query가 바뀌어 요청이 새로 시작될 때 이전 응답이 화면을 덮지 않게 하려면?', options: [
      ['cleanup에서 이전 요청을 abort하거나 오래된 결과를 무시합니다.', '이전 Effect 결과가 최신 query state를 바꾸지 못하게 합니다.'],
      ['모든 응답을 도착할 때마다 그대로 setCourses합니다.', '오래된 응답이 새 query 결과 뒤에 도착해 화면을 덮을 수 있습니다.'],
      ['요청을 두 번 더 복제합니다.', '요청 수만 늘리고 완료 순서 경계는 해결하지 않습니다.'],
    ], answer: 0, hint: '응답 완료 순서가 요청 시작 순서와 달라질 수 있음을 고려하세요.', explanation: 'AbortController로 이전 fetch를 취소하거나 cleanup에서 이전 결과가 state를 갱신하지 못하게 무시하면 stale response를 막을 수 있습니다.' },
    trace: { prompt: '이 모의 요청에서 query A 처리 중 query B가 시작되어 A의 cleanup이 `abort()`를 부릅니다. 취소된 A가 화면 `result`를 바꿀 수 있나요?', code: 'function load(query, signal) {\n  return new Promise((resolve) => {\n    const timer = setTimeout(() => resolve("검색 결과: " + query), 150);\n    signal.addEventListener("abort", () => clearTimeout(timer), { once: true });\n  });\n}\n\nfunction SearchResults({ query }) {\n  const [result, setResult] = useState("검색 대기");\n  useEffect(() => {\n    const controller = new AbortController();\n    load(query, controller.signal).then((value) => {\n      if (!controller.signal.aborted) setResult(value);\n    });\n    return () => controller.abort();\n  }, [query]);\n  return <p>{result}</p>;\n}', answers: ['아니요', '아니오', '바꾸지 못한다'], versioned: true, hint: 'cleanup에서 A의 timer를 지우며, 결과 반영 전에도 `signal.aborted`를 확인합니다.', explanation: '이 예시에서는 cleanup이 A의 timer를 취소해 응답 값을 만들지 않습니다. 결과를 반영할 때도 `signal.aborted`를 확인하므로 취소된 A가 화면 `result`를 덮지 않습니다. 실제 fetch에서는 signal을 요청에 전달하고 취소 오류도 처리해야 합니다.' },
    debugHint: '새 query가 생긴 뒤 이전 fetch가 여전히 성공 handler에서 setCourses를 호출할 수 있는지 살펴보세요.',
  },
  '9-4': {
    choice: { prompt: '검색 요청이 성공했지만 결과 배열이 비어 있는 경우 실패와 구분해 보여 줄 문구는?', options: [
      ['검색 결과가 없습니다', '정상 성공 응답에 일치 항목이 없는 empty 상태를 설명합니다.'],
      ['서버 요청에 실패했습니다', '결과가 비었다는 사실만으로 요청 실패를 뜻하지는 않습니다.'],
      ['불러오는 중', '요청이 성공해 끝났으므로 loading 상태 설명은 맞지 않습니다.'],
    ], answer: 0, hint: '요청은 성공했지만 조건과 일치하는 항목이 없는 상태입니다.', explanation: 'success와 빈 배열은 정상적인 empty 결과입니다. error는 요청에 실패한 상태이므로 둘을 다른 안내로 표시해야 합니다.' },
    trace: { prompt: '`status === "success"`이고 `courses.length === 0`입니다. 요청은 실패했나요, 정상적인 빈 결과인가요?', answers: ['정상적인 빈 결과', '빈 결과', '성공한 빈 목록'], hint: 'status는 요청 성공을 나타내고 length는 일치 항목이 없음을 나타냅니다.', explanation: '요청 상태는 success이며 배열만 비었으므로 실패가 아니라 정상적인 검색 결과 없음입니다.' },
    debugHint: 'error 분기와 성공한 빈 목록 분기를 각각 두어 서로 다른 상황을 안내하는지 확인하세요.',
    repairHint: 'loading, error, 성공 빈 목록, 성공 데이터가 있는 목록을 각각 표시하고 map에는 course.id를 안정된 key로 사용하세요.',
    repairId: 'react-w9-d4-repair-v2',
  },
  '9-5': {
    choice: { prompt: '성공 응답과 빈 배열이 모두 도착했을 때 오류나 loading 대신 결과 없음 안내를 내보내는 조건은?', options: [
      ['`status === "loading"`일 때', '요청이 진행 중인 화면 분기로, 이미 성공한 빈 결과에는 해당하지 않습니다.'],
      ['`status === "error"`일 때', '요청 실패는 정상적인 빈 결과와 다른 화면입니다.'],
      ['`status === "success" && courses.length === 0`일 때', '정상 응답은 받았지만 일치하는 결과가 없다는 뜻입니다.'],
    ], answer: 2, hint: '요청 결과가 정상 완료된 상태와 배열의 비어 있음 조건을 함께 사용하세요.', explanation: 'success가 true이고 배열 길이가 0이면 요청은 실패하지 않았고 정상 검색 결과만 없는 상태입니다.' },
    trace: { prompt: 'status가 success이고 courses 길이가 2입니다. `status === "success" && courses.length === 0` 조건의 결과는?', answers: ['false', '거짓', '아니요'], hint: 'success는 참이지만 길이가 0이 아니라 2입니다.', explanation: '논리곱의 두 번째 조건 `2 === 0`이 거짓이므로 전체 조건도 false입니다.' },
    debugHint: '요청 전·진행·오류·성공 빈 결과·성공 목록의 분기 순서와 각 조건이 겹치지 않는지 살펴보세요.',
    repairHint: 'loading·error를 먼저 분기하고, success에서 빈 배열과 항목이 있는 배열을 구분해 각기 안내하세요.',
    repairId: 'react-w9-d5-repair-v2',
  },
  '10-1': {
    choice: { prompt: '과정 상세 주소를 열어야 하는 조작에 목적지와 브라우저 기본 동작을 제공하는 요소는?', options: [
      ['`<button onClick={openCourse}>React</button>`', '버튼은 현재 화면의 작업을 실행하는 데 적합하며 주소 목적지를 나타내지 않습니다.'],
      ['`<a href="/tracks/react">React</a>`', 'href가 있는 링크는 목적지를 표현하고 키보드·새 탭 등 기본 링크 동작을 제공합니다.'],
      ['`<span onClick={openCourse}>React</span>`', '클릭 처리만 있는 span은 링크 의미와 기본 키보드 동작이 없습니다.'],
    ], answer: 1, hint: '사용자가 목적지를 미리 보거나 새 탭에서 열 수 있어야 하는지 생각하세요.', explanation: '다른 주소로 이동할 때는 목적지가 있는 링크를 사용합니다. 버튼은 주소 이동 대신 현재 화면의 동작을 실행합니다.' },
    trace: { prompt: '예시 링크를 클릭하면 브라우저가 이동할 href 값은 무엇인가요?', answers: ['/tracks/react', '"/tracks/react"'], versioned: true, hint: 'a 요소의 href 속성에 지정된 경로를 그대로 읽으세요. 맨 앞의 슬래시도 확인하세요.', explanation: '목적지는 `/tracks/react`입니다. 앞의 `/`가 빠진 `tracks/react`는 현재 주소를 기준으로 하는 상대 경로라 다른 주소가 됩니다.' },
    debugHint: '목적지 주소가 요소에 선언되어 있는지, 클릭 이벤트만으로 이동을 흉내 내는지 확인하세요.',
  },
  '10-2': {
    choice: { prompt: '“설명 펼치기”처럼 현재 화면의 상태를 바꾸는 조작에 알맞은 요소는?', options: [
      ['`<a href="/details">설명 펼치기</a>`', '이 사례의 동작은 다른 주소 이동이 아니라 현재 화면 상태를 바꾸는 작업입니다.'],
      ['`<button type="button" onClick={toggle}>설명 펼치기</button>`', '버튼은 키보드로 실행할 수 있는 현재 화면의 동작을 의미합니다.'],
      ['`<span onClick={toggle}>설명 펼치기</span>`', 'span은 클릭 이벤트만으로 기본 버튼 역할과 키보드 조작을 얻지 않습니다.'],
    ], answer: 1, hint: '주소로 이동하는지, 현재 화면에서 명령을 실행하는지 구분하세요.', explanation: '화면 상태 변경은 button, 주소 이동은 href가 있는 a로 표현하면 역할과 기본 조작이 분명합니다.' },
    trace: { prompt: '아래 사례에서 클릭 이벤트 때 호출되는 함수 이름은 무엇인가요?', answers: ['toggle', '`toggle`'], hint: 'onClick prop에 전달된 함수 참조를 확인하세요.', explanation: 'onClick에 `toggle` 함수가 연결되어 있어 사용자가 버튼을 누를 때 해당 동작이 호출됩니다.' },
    debugHint: '클릭 가능한 요소가 브라우저 기본 키보드 조작을 제공하는 button인지 살펴보세요.',
  },
  '10-3': {
    choice: { prompt: '클라이언트 화면이 바뀐 뒤 키보드 사용자가 새 위치를 바로 알도록 도울 방법은?', options: [
      ['이전 버튼에 포커스를 둔 채 제목만 시각적으로 바꾼다', '화면만 바뀌고 현재 키보드 위치가 남으면 새 콘텐츠가 시작된 위치를 놓칠 수 있습니다.'],
      ['새 화면 제목을 programmatic focus 대상에 연결하고 이동 후 focus한다', '초점을 새 콘텐츠 제목으로 옮기면 키보드 위치도 화면 전환을 따라갈 수 있습니다.'],
      ['본문 전체를 매번 aria-hidden 처리한다', '본문을 접근성 트리에서 숨기면 새 화면을 읽거나 조작할 수 없습니다.'],
    ], answer: 1, hint: '화면 스크롤과 키보드의 현재 초점은 같은 상태가 아닙니다.', explanation: '라우트가 바뀐 뒤 새 제목을 초점 가능하게 만들고 실제 focus를 옮기면 위치 변화를 키보드 사용자에게 안내할 수 있습니다.' },
    trace: { prompt: '예시의 `headingRef.current?.focus()`가 실행되면 현재 브라우저 키보드 초점은 어느 요소로 이동하나요?', answers: ['headingRef가 가리키는 제목', '새 화면 제목', 'h1 제목'], hint: 'ref가 연결된 h1이 focus() 호출의 대상입니다.', explanation: 'ref가 새 화면의 제목을 가리키므로 focus() 호출은 그 제목으로 초점을 옮깁니다. 실제 라우터 전환은 예시 코드만으로 실행하지 않습니다.' },
    debugHint: 'scrollIntoView는 화면을 스크롤하지만 키보드 focus 자체를 바꾸지 않는다는 차이를 확인하세요.',
  },
  '10-4': {
    choice: { prompt: '현재 경로가 `/tracks/react`일 때 React 탐색 링크만 현재 페이지로 표시하는 값은?', options: [
      ['`aria-current="page"`를 React 링크에만 둔다', '현재 경로와 일치하는 링크 하나에 현재 위치 의미를 제공할 수 있습니다.'],
      ['모든 트랙 링크에 `aria-current="page"`를 둔다', '모든 항목을 현재 페이지로 표시하면 실제 위치를 구분할 수 없습니다.'],
      ['현재 위치를 색상으로만 표현한다', '색상만으로는 보조 기술에 현재 페이지 정보를 전달하지 않습니다.'],
    ], answer: 0, hint: '비교 대상은 현재 주소와 각 링크의 목적지입니다.', explanation: '`aria-current="page"`는 현재 페이지에 해당하는 링크에만 설정하고 다른 링크에는 생략해야 합니다.' },
    trace: { prompt: 'pathname이 `/tracks/react`일 때 예시 조건식이 `aria-current`에 반환하는 문자열은 무엇인가요?', answers: ['page', '"page"', 'aria-current page'], hint: '두 경로가 같으므로 삼항식의 참 분기를 읽으세요.', explanation: '현재 경로와 React 링크 주소가 같아 참 분기인 `page`가 반환됩니다.' },
    debugHint: '현재 경로를 비교하는 대상이 화면에 표시한 React 링크의 href와 같은지 확인하세요.',
    repairHint: 'pathname과 React 링크 주소를 비교하고 일치할 때만 aria-current="page"를 지정하세요.',
    repairId: 'react-w10-d4-repair-v2',
  },
  '10-5': {
    choice: { prompt: '존재하지 않는 과정 주소에 도착했을 때 학습자가 다시 이동할 수 있도록 보여 줄 조합은?', options: [
      ['오류 안내 제목과 유효한 과정 목록 링크', '문제 상황을 알리고 실제 존재하는 탐색 경로를 제공합니다.'],
      ['아무 내용도 없는 화면', '무엇이 잘못됐는지와 다음 행동을 알려 주지 않습니다.'],
      ['존재하지 않는 주소를 가리키는 링크', '잘못된 목적지를 반복하면 오류 화면에서 빠져나오기 어렵습니다.'],
    ], answer: 0, hint: '오류를 알아차리고 유효한 경로로 돌아갈 수 있어야 합니다.', explanation: '찾을 수 없는 상태를 제목과 설명으로 알리고, `/tracks`처럼 검증된 과정 목록 링크를 함께 제공합니다.' },
    trace: { prompt: '이 예시에서 찾지 못한 과정을 안내하는 h1의 문구는 무엇인가요?', answers: ['과정을 찾을 수 없습니다', '"과정을 찾을 수 없습니다"'], hint: 'main 안에서 가장 먼저 표시되는 제목을 읽으세요.', explanation: '페이지 제목은 `과정을 찾을 수 없습니다`입니다. 이어서 과정 목록으로 돌아갈 유효한 링크를 제공해야 합니다.' },
    debugHint: 'fallback 링크의 목적지가 실제 과정 목록인지, 같은 잘못된 과정 경로를 가리키는지 확인하세요.',
    repairHint: '찾을 수 없다는 안내 뒤에 `/tracks`를 목적지로 가진 과정 목록 링크를 추가하세요.',
    repairId: 'react-w10-d5-repair-v2',
  },
  '11-1': {
    choice: { prompt: '접근성 트리에서 “저장”이라는 이름의 버튼을 찾는 테스트 쿼리는?', options: [
      ['`screen.getByRole("button", { name: "저장" })`', '버튼 역할과 사용자에게 노출된 이름을 함께 조회합니다.'],
      ['`screen.getByTestId("save")`', 'test id는 내부 식별자라 사용자에게 버튼 역할과 이름이 제공되는지 확인하지 않습니다.'],
      ['`container.querySelector(".save")`', 'CSS 선택자는 스타일 구현에 기대며 접근성 의미를 확인하지 않습니다.'],
    ], answer: 0, hint: '사용자가 컨트롤을 식별할 때 이용하는 역할과 이름을 사용하세요.', explanation: '`getByRole`에 button 역할과 name을 지정하면 사용자에게 보이는 의미를 기준으로 찾습니다.' },
    trace: { prompt: '예시 쿼리에서 `name` 조건으로 찾는 accessible name은 무엇인가요?', answers: ['저장', '"저장"', '저장 버튼'], hint: 'role 조건과 별도로 중괄호 안 name 문자열을 읽으세요.', explanation: '쿼리는 `button` 역할이면서 이름이 `저장`인 요소를 찾습니다.' },
    debugHint: 'test id로만 요소를 찾아 역할이나 화면 이름이 없어도 검사가 통과하는지 살펴보세요.',
  },
  '11-2': {
    choice: { prompt: '저장 버튼 클릭 뒤 사용자 관점에서 기능 완료를 확인하는 assertion은?', options: [
      ['내부 save 함수가 호출된 횟수만 검사한다', '호출은 구현 동작을 확인하지만 사용자에게 보이는 완료 결과를 보장하지 않습니다.'],
      ['화면에 “저장했어요” 메시지가 나타났는지 검사한다', '사용자가 실제로 확인하는 결과를 직접 검증합니다.'],
      ['버튼이 렌더된 횟수를 검사한다', '렌더 횟수만으로 저장 결과나 안내 문구를 알 수 없습니다.'],
    ], answer: 1, hint: '이 주차의 기준은 내부 구현보다 화면에 드러나는 결과입니다.', explanation: '상호작용 뒤 `저장했어요`가 표시되는지 확인하면 사용자가 경험하는 결과를 검증합니다.' },
    trace: { prompt: '예시에서 버튼을 눌렀을 때 user-event에 전달되는 역할과 이름은?', answers: ['저장 버튼', 'button 저장', 'button, 저장'], hint: 'getByRole의 첫 인자와 name 옵션을 읽으세요.', explanation: '쿼리는 “저장” 이름을 가진 button을 찾은 다음 user.click이 해당 버튼의 사용자 동작을 수행합니다.' },
    debugHint: '테스트가 함수를 불렀다는 사실만 확인하고, 성공 안내가 화면에 나타나는지 빠뜨리지 않았는지 확인하세요.',
  },
  '11-3': {
    choice: { prompt: '프로파일 결과 계산 비용이 28ms이고 입력 의존성이 안정적인 목록 필터에서 검증해 볼 최적화는?', options: [
      ['프로파일 결과와 관계없이 모든 값에 useMemo 추가', '일괄 적용은 필요성과 효과를 확인하지 않고 코드 복잡도를 늘립니다.'],
      ['필요한 입력을 모두 의존성으로 둔 useMemo를 적용한 뒤 같은 상호작용을 다시 측정', '비용과 의존성을 확인한 계산만 캐시하고 효과를 비교합니다.'],
      ['React 상태를 직접 DOM class로 바꾸기', 'DOM 변경은 계산 비용을 줄이지 않고 React 렌더 흐름도 우회합니다.'],
    ], answer: 1, hint: '계산이 실제로 느린지와 값이 언제 달라지는지 모두 반영하세요.', explanation: '28ms처럼 측정된 병목이라면 모든 reactive dependency를 명시해 useMemo를 적용하고, 같은 상호작용에서 실제 개선 여부를 비교합니다.' },
    trace: { prompt: 'courses와 query가 모두 바뀔 수 있는 계산에서 useMemo가 다시 실행되도록 필요한 입력 둘은 무엇인가요?', answers: ['courses와 query', '[courses, query]'], hint: '계산 함수 안에서 참조하는 reactive 값을 모두 확인하세요.', explanation: '필터 계산은 `courses`와 `query`를 모두 읽으므로 두 값이 의존성에 포함되어야 합니다.' },
    debugHint: 'filterCourses가 읽는 reactive 값과 의존성 배열의 항목을 하나씩 대조하세요.',
  },
  '11-4': {
    choice: { prompt: '프로파일에서 0.02ms로 측정되고 캐시 참조를 소비하는 곳도 없는 문자열 결합은 어떻게 작성하는 편이 나을까요?', options: [
      ['매 렌더에서 직접 계산한다', '측정된 계산이 매우 가볍고 참조 안정성도 필요 없으므로 단순 계산이 읽기 쉽습니다.'],
      ['useMemo로 무조건 감싼다', '주어진 조건에서는 캐시 관리 비용과 Hook 복잡도만 더할 수 있습니다.'],
      ['Effect에서 state로 복사한다', '파생 문자열을 Effect state에 복사하면 불필요한 상태와 추가 렌더가 생깁니다.'],
    ], answer: 0, hint: '계산 시간뿐 아니라 memoized child나 Hook dependency로 참조를 넘기는지도 확인하세요.', explanation: '이 사례에서는 계산 비용이 무시할 정도이고 참조 동일성을 요구하는 소비자도 없습니다. `useMemo`보다 직접 계산하는 편이 간단합니다.' },
    trace: { prompt: 'courses 길이가 3일 때 `const label = `${courses.length}개 과정``이 만드는 문자열은?', answers: ['3개 과정', '"3개 과정"'], hint: '길이 숫자를 문자열 템플릿 안에 넣으세요.', explanation: '길이 3이 문자열 안에 삽입되어 `3개 과정`이 됩니다.' },
    debugHint: '주어진 profile 수치와 이 값의 소비처를 읽고 useMemo가 실제 이점을 제공하는지 판단하세요.',
    repairHint: '계산 시간과 참조 소비자를 고려해 useMemo를 제거하고 길이 기반 문자열을 직접 계산하세요.',
    repairId: 'react-w11-d4-repair-v2',
  },
  '11-5': {
    choice: { prompt: '아이콘 저장 버튼의 접근성 회귀를 사용자 관점으로 확인하는 쿼리는?', options: [
      ['역할이 button이고 이름이 “과정 저장”인지 조회', '버튼 역할과 accessible name이 실제로 제공되는지 검증합니다.'],
      ['svg 요소가 존재하는지 조회', '아이콘 존재만으로 버튼 기능 이름이 제공되는지는 알 수 없습니다.'],
      ['버튼에 임의 test id가 있는지 조회', 'test id는 접근성 이름 누락을 놓칠 수 있습니다.'],
    ], answer: 0, hint: '시각 장식 아이콘이 아니라 버튼 자체가 전달하는 역할과 이름을 검사하세요.', explanation: '`getByRole("button", { name: "과정 저장" })`는 이름 있는 버튼이 접근성 트리에 노출되는지 확인합니다.' },
    trace: { prompt: '예시 아이콘에는 aria-hidden="true"가 있습니다. 그 대신 버튼 기능을 이름으로 제공하는 속성은 무엇인가요?', answers: ['aria-label', 'aria-label="과정 저장"'], hint: '장식 SVG는 숨겼으므로 부모 버튼에 제공된 이름을 확인하세요.', explanation: '버튼의 `aria-label="과정 저장"`이 아이콘만 있는 컨트롤의 accessible name을 제공합니다.' },
    debugHint: '장식용 SVG가 숨겨져 있을 때 부모 button에도 보이는 이름이나 aria-label이 있는지 확인하세요.',
    repairHint: '버튼에 “과정 저장” accessible name을 제공하고 장식 SVG는 보조 기술에서 숨기세요.',
    repairId: 'react-w11-d5-repair-v2',
  },
  '12-1': {
    choice: { prompt: '최근 답안 목록의 펼침 상태를 다른 화면이 공유하지 않고 해당 섹션에서만 사용한다면 둘 위치는?', options: [
      ['RecentAnswers 컴포넌트 내부의 로컬 state', '표시 상태를 사용하는 컴포넌트 가까이에 두어 소유 범위를 명확히 합니다.'],
      ['앱 전체 전역 상태', '공유 요구가 없는데 전역으로 올리면 관계없는 화면도 상태 구조에 결합됩니다.'],
      ['DOM을 매번 직접 읽는 값', 'DOM 조작은 React state와 선언형 갱신 흐름을 우회합니다.'],
    ], answer: 0, hint: '상태를 실제로 읽고 변경하는 가장 가까운 컴포넌트를 찾으세요.', explanation: '최근 답안 섹션만 쓰는 펼침 여부는 그 섹션의 로컬 state로 두는 편이 데이터 흐름과 책임이 분명합니다.' },
    trace: { prompt: '예시에서 최근 답안의 `expanded` state 초깃값은 무엇인가요?', answers: ['false', '닫힘'], hint: 'useState에 전달된 초기값과 첫 화면의 열림 여부를 함께 확인하세요.', explanation: '`useState(false)`로 시작하므로 첫 렌더에서는 목록이 닫힌 상태입니다.' },
    debugHint: '화면 한 곳에서만 쓰는 expanded 값을 최상위 페이지가 소유하는지 살펴보세요.',
  },
  '12-2': {
    choice: { prompt: '최근 답안을 펼치거나 접고 실제 상태도 보조 기술에 전달하는 컨트롤은?', options: [
      ['href가 없는 `<a>`에 onClick을 붙인다', '링크 의미를 제공하지 않으며 상태 변경 버튼과 역할도 다릅니다.'],
      ['button에 onClick과 현재값에 맞는 aria-expanded를 제공한다', '버튼은 화면 안 동작을 수행하고 aria-expanded는 접힘 상태를 전달합니다.'],
      ['aria-expanded만 있는 정적 문단', '속성만 붙여도 키보드로 실행할 동작이 생기지는 않습니다.'],
    ], answer: 1, hint: '실행 가능한 의미 요소와 열림 상태를 전달하는 속성을 함께 고려하세요.', explanation: '버튼은 disclosure 동작을 실행하고 `aria-expanded`는 현재 펼침 상태를 보조 기술에 알립니다.' },
    trace: { prompt: '버튼을 누르기 전 expanded가 false입니다. setExpanded(current => !current) 뒤 다음 값은?', answers: ['true', '참'], hint: '함수형 updater는 현재 값의 반대를 반환합니다.', explanation: '현재값 false를 반전하므로 다음 expanded 값은 true이고 aria-expanded도 true가 되어야 합니다.' },
    debugHint: 'href 없는 a로 상태를 바꾸는지, 버튼 의미와 aria-expanded 상태가 함께 연결됐는지 살펴보세요.',
  },
  '12-3': {
    choice: { prompt: '최근 답안 배열이 비었을 때 다음 학습으로 이어지는 빈 상태는 무엇을 제공해야 하나요?', options: [
      ['아무것도 렌더링하지 않는다', '화면이 비어 있으면 데이터가 없는지 로딩에 실패했는지 알 수 없습니다.'],
      ['빈 기록 안내와 학습을 계속할 링크', '현재 상태를 설명하고 유효한 다음 행동을 제공합니다.'],
      ['성공 데이터를 임의로 한 줄 만든다', '없는 기록을 만들어 표시하면 실제 저장 상태와 화면이 어긋납니다.'],
    ], answer: 1, hint: '상태 설명과 사용자가 선택할 수 있는 다음 경로를 함께 생각하세요.', explanation: '빈 상태는 답안이 없다는 사실을 알려야 하며 과정 목록이나 이어 학습 같은 실제 경로를 제공합니다.' },
    trace: { prompt: 'answers.length가 0인 경우 예시가 사용자에게 보여 주는 안내 문구는?', answers: ['아직 답안이 없습니다', '"아직 답안이 없습니다"'], hint: 'answers 길이가 0일 때 실행되는 분기의 반환값을 읽으세요.', explanation: '빈 결과 안내는 `아직 답안이 없습니다`입니다. 제품 화면에서는 이 안내와 다음 학습 링크를 함께 제공하는 것이 목표입니다.' },
    debugHint: '빈 배열이 반환될 때 null이나 빈 ul만 보이지 않고 이유와 다음 경로를 제공하는지 확인하세요.',
  },
  '12-4': {
    choice: { prompt: '브라우저 저장소 쓰기가 실패했을 때 사용자의 답안 초안을 안전하게 다루는 방법은?', options: [
      ['실패를 알리고 초안을 보존한 채 다시 시도 또는 내보내기를 안내한다', '저장되지 않은 사실을 밝히고 복구 가능한 기록을 남깁니다.'],
      ['저장 완료라고 표시한 뒤 초안을 삭제한다', '실패를 숨기고 유일한 답안 초안까지 잃게 합니다.'],
      ['오류 문구 없이 화면을 비운다', '사용자가 기록 보존 여부와 다음 행동을 알 수 없습니다.'],
    ], answer: 0, hint: '저장 실패와 작성 중인 메모리 초안은 같은 상태가 아닙니다.', explanation: '실패 상태를 알리고 작성한 답안을 지우지 않은 채 재시도나 백업 내보내기를 안내해야 합니다.' },
    trace: { prompt: 'saveState가 `error`일 때 예시의 role="alert" 문구가 알려 주는 핵심은 무엇인가요?', answers: ['기록을 저장하지 못함', '저장 실패', '기록이 저장되지 않음'], hint: '오류 상태에서 반환하는 문장의 사실을 짧게 정리하세요.', explanation: '저장 실패 alert는 기록을 보존하지 못했다는 사실을 사용자에게 즉시 알리는 역할입니다.' },
    debugHint: 'error 상태인데 성공 문구를 보여 주거나 오류를 조용히 숨기는 분기가 있는지 살펴보세요.',
    repairHint: 'error일 때 role="alert" 실패 안내를 반환하고, 그 외 상태의 성공 UI와 구분하세요.',
    repairId: 'react-w12-d4-repair-v2',
  },
  '12-5': {
    choice: { prompt: '저장한 단원 ID가 삭제되어 현재 카탈로그에 없을 때 이어 학습 동작은 어디로 보내야 하나요?', options: [
      ['검증된 과정 선택 경로', '학습자가 실제 존재하는 단원을 다시 고를 수 있습니다.'],
      ['삭제된 lesson의 이전 href', '없는 단원 주소를 계속 열어 복구할 수 없습니다.'],
      ['브라우저 저장소 전체 초기화', '잘못된 재개 대상 하나 때문에 다른 기록까지 지울 이유가 없습니다.'],
    ], answer: 0, hint: '재개 대상의 존재 여부를 확인한 뒤 유효한 다음 경로를 제공하세요.', explanation: '저장된 단원이 없거나 제거되었으면 현재 카탈로그의 과정 선택 경로로 안전하게 안내해야 합니다.' },
    trace: { prompt: 'lesson이 null일 때 예시 조건식이 사용자에게 보여 주는 링크 목적지 경로는?', answers: ['/tracks', '"/tracks"'], hint: '삼항식의 false 분기 href 값을 확인하세요.', explanation: 'lesson이 없으면 false 분기를 선택하여 과정 선택 경로인 `/tracks`를 사용합니다.' },
    debugHint: 'lesson 또는 lesson.href가 없을 때 존재하지 않는 주소를 가진 a를 만들지 않는지 확인하세요.',
    repairHint: '유효한 lesson.href가 있을 때만 이어 학습 링크를 렌더링하고 없으면 /tracks 링크를 반환하세요.',
    repairId: 'react-w12-d5-repair-v2',
  },
  '13-1': {
    choice: { prompt: '요청 화면에서 loading과 error가 동시에 true가 되는 상태 조합을 원천적으로 줄이는 모델은?', options: [
      ['`idle | loading | success | empty | error` 중 하나의 status', '한 시점에 하나의 상태만 저장하므로 진행과 실패가 동시에 선택되지 않습니다.'],
      ['loading, empty, error boolean을 각각 저장', '독립 boolean은 여러 값이 동시에 참인 조합을 허용합니다.'],
      ['현재 DOM 문구를 읽어 state를 추측', '화면 표현을 원본 상태로 역산하면 상태 전이 규칙을 명확히 관리할 수 없습니다.'],
    ], answer: 0, hint: '동시에 참이 될 수 있는 여러 flag 대신 가능한 단계 하나를 저장하세요.', explanation: '단일 status 값은 각 요청 상태를 배타적으로 표현합니다. 빈 결과는 success 상태와 빈 데이터로 계산할지 별도 상태로 둘지 팀 계약에 맞춰 정하되, 중복 플래그는 피해야 합니다.' },
    trace: { prompt: '예제의 request.status가 `error`일 때 화면 상태를 나타내는 값은 무엇인가요?', answers: ['error', '오류'], hint: '객체의 status 속성 값을 그대로 읽으세요.', explanation: 'request 객체의 status 속성은 `error`입니다. 메시지 필드와 별개인 요청 상태값입니다.' },
    debugHint: 'loading과 error를 서로 따로 저장하는 상태 선언을 찾으세요. 두 값이 동시에 참이 될 수 있는지 살펴보세요.', debugId: 'react-w13-d1-debug-v2',
  },
  '13-2': {
    choice: { prompt: '현재 loading 상태에서 요청 성공 action을 받았을 때 reducer가 반환해야 하는 것은?', options: [
      ['오류 상태로 바꾼 새 객체', '성공 action의 의미와 다음 상태가 서로 반대입니다.'],
      ['성공 상태와 응답 데이터를 담은 새 객체', 'reducer는 현재 상태를 직접 바꾸지 않고 action에 맞는 다음 상태를 반환합니다.'],
      ['DOM 노드 또는 화면 제목 문자열', 'reducer 결과는 정의한 앱 상태 구조여야 합니다.'],
    ], answer: 1, hint: 'action의 type이 나타내는 결과와 반환 상태를 같은 의미로 맞추세요.', explanation: '성공 action은 status를 success로 만들고 응답 데이터를 포함한 다음 상태를 반환해야 합니다. 기존 상태 객체는 직접 수정하지 않습니다.' },
    trace: { prompt: '예제에서 `succeeded` action을 받은 loading 상태의 다음 status는 무엇인가요?', answers: ['success', '"success"'], hint: 'reducer의 첫 조건이 참이므로 반환 객체의 status 값을 읽으세요.', explanation: 'action type이 `succeeded`이므로 spread로 기존 값을 보존한 새 객체에 status `success`를 넣어 반환합니다.' },
    debugHint: 'succeeded action 분기에서 반환하는 status가 error로 뒤집혀 있지 않은지 확인하세요.', debugId: 'react-w13-d2-debug-v2',
  },
  '13-3': {
    choice: { prompt: '요청 성공 결과가 빈 배열일 때 표시할 상태는 무엇인가요?', options: [
      ['error', '요청은 성공했으므로 빈 데이터만으로 통신 실패라고 볼 수 없습니다.'],
      ['loading', '요청이 이미 끝나 빈 배열이 확인된 상태입니다.'],
      ['empty', '정상 요청의 완료와 표시할 데이터가 없다는 사실을 함께 표현합니다.'],
    ], answer: 2, hint: '요청 성공 여부와 반환 배열의 길이를 순서대로 확인하세요.', explanation: 'ok가 true이고 courses가 빈 배열이므로 결과는 정상적인 `empty`입니다. 요청 실패인 `error`와 다릅니다.' },
    trace: { prompt: 'statusFor(true, [])의 반환값은 무엇인가요?', answers: ['empty', '"empty"'], hint: '실패 조건을 통과한 뒤 빈 courses 배열 분기를 평가하세요.', explanation: '첫 조건을 통과하고 빈 배열 분기의 `empty` 문자열을 반환합니다.' },
    debugHint: '실패 여부를 빈 배열 여부와 혼합했는지, 실패와 성공한 빈 결과를 각각 분기했는지 확인하세요.', debugId: 'react-w13-d3-debug-v2',
  },
  '13-4': {
    choice: { prompt: '요청 B가 먼저 시작되고 요청 A가 늦게 끝날 때 A 결과를 무시할 조건은?', options: [
      ['A가 시작된 시간이 더 빠르면 반영', '시작 순서가 빠르다는 사실만으로 A가 현재 검색 결과라는 뜻은 아닙니다.'],
      ['배열 길이가 현재 결과와 같을 때 반영', '같은 길이의 서로 다른 요청을 구분할 수 없습니다.'],
      ['응답 ID가 현재 활성 요청 ID와 같을 때만 반영', '요청 식별자를 비교하면 오래된 응답의 상태 덮어쓰기를 막습니다.'],
    ], answer: 2, hint: '현재 화면이 기다리는 요청과 끝난 응답이 같은 작업인지 비교하세요.', explanation: 'query B가 활성 요청이라면 A의 responseId는 activeId와 다르므로 적용하지 않습니다. 실제 앱에서는 취소나 요청 ID 검증을 함께 사용할 수 있습니다.' },
    trace: { prompt: 'activeId가 8이고 늦게 도착한 responseId가 7일 때 `shouldApplyResponse`는 무엇을 반환하나요?', answers: ['false', '거짓', '적용하지 않음'], hint: '7과 8이 strict equality로 같은 값인지 비교하세요.', explanation: 'responseId 7은 현재 activeId 8과 다르므로 false를 반환해 오래된 결과를 적용하지 않습니다.' },
    debugHint: 'query가 바뀐 뒤에도 응답 완료 handler가 무조건 state를 갱신하는지 확인하세요.', repairHint: '현재 요청 ID와 응답에 함께 전달된 ID를 strict equality로 비교해 boolean을 반환하세요.', repairId: 'react-w13-d4-repair-v2', debugId: 'react-w13-d4-debug-v2',
  },
  '13-5': {
    choice: { prompt: '상태 전이 검토에서 성공·오류가 끝난 상태인지 가장 정확히 확인하는 사례는?', options: [
      ['기본 상태만 한 번 확인', 'idle만 검사하면 나머지 종료 상태와 진행 상태를 구분할 수 없습니다.'],
      ['각 허용 status에서 결과·화면 안내와 허용/거부 전이를 검사', '상태 값과 다음 action의 계약을 함께 확인해 누락된 분기를 찾습니다.'],
      ['모든 독립 boolean을 동시에 true로 설정', '불가능한 상태를 만든 채 전이 계약을 확인하지 않습니다.'],
    ], answer: 1, hint: '유효한 상태 목록과 각 상태의 다음 동작을 표로 대조하세요.', explanation: '상태별 데이터와 안내, 허용되는 전이와 거부되는 전이를 확인해야 종료 판정과 실패 복구가 모두 검증됩니다.' },
    trace: { prompt: 'statuses 배열에 선언된 허용 상태는 몇 개인가요?', answers: ['5', '5개'], hint: 'idle, loading, success, empty, error 항목을 세세요.', explanation: '요청 전·진행·성공 데이터 있음·성공 빈 결과·실패의 다섯 상태가 있습니다.' },
    debugHint: '반환값이 항상 같은지 살펴보고 success와 error일 때만 종료 상태로 판정하는지 확인하세요.',
  },
  '14-1': {
    choice: { prompt: '호출자가 `<Card><CourseList /></Card>`로 전달한 화면 조각을 Card가 받는 prop은?', options: [
      ['key', 'key는 목록 항목 식별에 쓰이며 중첩 JSX 내용을 받는 prop이 아닙니다.'],
      ['children', '태그 사이에 중첩한 JSX는 children prop으로 전달됩니다.'],
      ['ref만', 'ref는 대상에 대한 참조이며 기본적인 중첩 콘텐츠 계약이 아닙니다.'],
    ], answer: 1, hint: '여는 태그와 닫는 태그 사이에 둔 JSX가 들어가는 기본 prop 이름을 떠올리세요.', explanation: 'JSX 태그 안에 중첩된 요소는 호출 컴포넌트의 `children`으로 전달됩니다. Card는 그 노드를 wrapper 안에서 그대로 렌더링할 수 있습니다.' },
    trace: { prompt: '예제에서 Card가 전달받은 children 값은 무엇인가요?', answers: ['과정 목록'], hint: 'cardProps 객체의 children 속성 값을 읽으세요.', explanation: '부모가 Card 태그 사이에 넣은 `과정 목록`이라는 JSX/내용은 children prop으로 전달됩니다.' },
    debugHint: 'children을 함수처럼 호출하고 있지 않은지 살펴보세요. 일반 React node는 함수 계약을 별도로 정하지 않았다면 그대로 렌더링합니다.', debugId: 'react-w14-d1-debug-v2',
  },
  '14-2': {
    choice: { prompt: 'CourseCard가 제목과 예상 학습 시간을 각각 사용하도록 전달하는 계약은?', options: [
      ['이름 있는 `title`과 `minutes` props', '컴포넌트가 사용하는 입력이 드러나고 호출 지점에서 값을 확인할 수 있습니다.'],
      ['전역 변수에서 제목을 읽고 시간을 DOM에서 검색', '입력이 숨겨져 호출 관계와 테스트 조건을 추적하기 어렵습니다.'],
      ['title만 전달하고 분은 컴포넌트 이름에서 추측', '필요한 minutes 입력을 전달하지 않아 계약이 완성되지 않습니다.'],
    ], answer: 0, hint: '컴포넌트가 실제로 읽는 두 값을 호출자와 자식 사이에 명시하세요.', explanation: '이름 있는 props로 `title`과 `minutes`를 전달하면 재사용 컴포넌트의 입력 계약이 분명해집니다.' },
    trace: { prompt: 'courseLabel 예제의 반환 문자열은 무엇인가요?', answers: ['React · 20분'], hint: 'title과 minutes를 템플릿 문자열에 각각 대입하세요.', explanation: 'title은 React이고 minutes는 20이므로 반환값은 `React · 20분`입니다.' },
    debugHint: '화면에 필요한 minutes prop을 받아 놓고 반환 결과에서 버리지 않는지 확인하세요.', debugId: 'react-w14-d2-debug-v2',
  },
  '14-3': {
    choice: { prompt: '재사용 Layout이 상단 제목과 호출자 본문을 함께 표시할 책임을 만족하는 구현은?', options: [
      ['header만 렌더링하고 children은 버린다', '호출자가 넣은 본문 콘텐츠가 반환 화면에서 사라집니다.'],
      ['header와 children을 각각 의미 있는 영역에 배치한다', '레이아웃은 화면 공통 골격과 호출자 콘텐츠를 조합합니다.'],
      ['부모의 내부 state를 직접 수정한다', '조합 책임과 무관한 내부 상태 변경은 컴포넌트 경계를 깨뜨립니다.'],
    ], answer: 1, hint: 'Layout이 받은 두 슬롯이 반환 JSX 안에 모두 있는지 확인하세요.', explanation: 'header와 children을 각 영역에 배치하면 공통 레이아웃을 재사용하면서 실제 페이지 콘텐츠는 호출자가 선택할 수 있습니다.' },
    trace: { prompt: '예제 객체에서 레이아웃이 표시할 본문 값은 무엇인가요?', answers: ['수업 목록'], hint: 'layout 객체의 children 속성에 저장된 문자열을 확인하세요.', explanation: '호출자가 넣은 본문은 `children` 슬롯에 담겨 `수업 목록` 값으로 전달됩니다.' },
    debugHint: 'return JSX에 header만 있고 section 안의 children 슬롯이 빠져 있지 않은지 확인하세요.', debugId: 'react-w14-d3-debug-v2',
  },
  '14-4': {
    choice: { prompt: '삽입과 정렬이 가능한 과정 목록에서 React key로 가장 적절한 값은?', options: [
      ['배열의 현재 index', '순서가 바뀌면 같은 index가 다른 과정에 연결됩니다.'],
      ['렌더할 때마다 만드는 무작위 값', '매번 정체성이 바뀌어 기존 항목 상태를 보존하기 어렵습니다.'],
      ['과정 데이터의 안정된 고유 id', '재정렬 뒤에도 동일한 데이터 항목을 가리킵니다.'],
    ], answer: 2, hint: '배열 순서와 무관하게 항목 자신을 식별하는 값을 고르세요.', explanation: 'key는 같은 형제 목록 안에서 항목 identity를 추적하므로 과정의 고유하고 안정적인 id를 사용해야 합니다.' },
    trace: { prompt: '예제 목록의 key를 순서대로 연결하면 어떤 문자열이 되나요?', answers: ['react,python'], hint: 'map이 읽는 각 객체의 id를 배열 순서대로 적으세요.', explanation: '첫 id는 react, 둘째는 python이므로 결과는 `react,python`입니다.' },
    debugHint: 'course.id 대신 map의 index를 key에 넣은 줄을 찾으세요. 삽입이나 정렬 뒤 index는 항목 정체성을 보장하지 않습니다.', repairHint: 'index 매개변수를 제거하고 각 li의 key에 course.id를 연결하세요.', repairId: 'react-w14-d4-repair-v2', debugId: 'react-w14-d4-debug-v2',
  },
  '14-5': {
    choice: { prompt: '화면 안에서 save 동작을 수행하며 키보드 기본 동작도 제공해야 할 때 사용할 요소는?', options: [
      ['onClick만 붙인 span', '마우스 handler만으로는 button의 기본 키보드 동작과 역할을 제공하지 않습니다.'],
      ['목적지 href가 없는 a', '주소 이동이 아닌 현재 화면의 동작을 링크로 표현하면 의미가 맞지 않습니다.'],
      ['실제 button', 'button은 동작 요소의 역할과 기본 키보드 상호작용을 제공합니다.'],
    ], answer: 2, hint: '화면 안에서 실행하는 동작인지 다른 주소로 이동하는지 먼저 구분하세요.', explanation: '저장처럼 현재 화면의 동작은 실제 button으로 표시해야 키보드 사용자와 보조 기술에도 기본 의미를 제공합니다.' },
    trace: { prompt: 'SaveAction에서 button의 onClick에 전달되는 함수 prop 이름은 무엇인가요?', code: 'function save() {}\n\nfunction SaveAction({ save }) {\n  const buttonProps = { type: "button", onClick: save };\n  return buttonProps.onClick.name;\n}\n\nconsole.log(SaveAction({ save }));', answers: ['save'], versioned: true, hint: 'onClick 속성에 연결된 함수가 SaveAction의 어떤 prop에서 왔는지 확인하세요.', explanation: 'SaveAction이 받은 `save` 함수를 button의 onClick에 전달합니다. 이 예제는 전달 관계와 함수 이름을 확인하며, 버튼 동작을 실행하지는 않습니다.' },
    debugHint: '저장 동작이 span의 클릭에만 의존하는지 확인하고 버튼 semantics를 사용하는지 살펴보세요.', repairHint: 'span을 type="button"인 button으로 바꾸고 기존 save handler를 onClick에 연결하세요.', repairId: 'react-w14-d5-repair-v2', debugId: 'react-w14-d5-debug-v2',
  },
  '15-1': {
    choice: { prompt: '여러 깊이의 하위 화면에서 공통 테마를 읽고 prop 전달만으로 연결하기 번거로운 경우 고려할 도구는?', options: [
      ['모든 값을 모듈 전역 변수에 저장', 'React 렌더 흐름을 벗어난 가변 전역 값은 변경 구독과 테스트 경계를 제공하지 않습니다.'],
      ['필요한 하위 트리 범위의 Context', '공통으로 필요한 값을 Provider가 감싼 하위 소비자에게 전달할 수 있습니다.'],
      ['각 자식에 서로 다른 복사본 유지', '복제된 값은 갱신 때 서로 어긋날 수 있습니다.'],
    ], answer: 1, hint: '공유 범위가 실제로 넓은지와 단순 prop 전달보다 Context가 나은지 비교하세요.', explanation: '여러 깊은 하위 컴포넌트가 같은 설정을 읽을 때 Context가 prop 전달 단계를 줄일 수 있습니다. 가까운 한두 자식만 쓰면 props가 더 단순할 수 있습니다.' },
    trace: { prompt: '예제에서 기본 theme 값은 무엇인가요?', answers: ['light', '밝은 화면'], hint: 'themeContextDefault 상수에 대입된 기본 문자열을 확인하세요.', explanation: 'theme 기본값은 문자열 `light`입니다. 이 예제는 데이터 값만 보이며 React Context Provider를 실행하지 않습니다.' },
    debugHint: 'Page가 theme을 받았는데 Toolbar에 전달하지 않아 중간에서 값이 끊기는지 확인하세요.', debugId: 'react-w15-d1-debug-v2',
  },
  '15-2': {
    choice: { prompt: 'Context 객체의 기본값을 정하는 createContext 호출 위치와 역할은?', options: [
      ['컴포넌트 바깥에서 한 번 생성하고 Provider가 없을 때의 정적 대안을 전달', 'Context identity를 안정적으로 유지하며 기본값은 가까운 Provider가 없을 때 쓰입니다.'],
      ['렌더마다 컴포넌트 안에서 새 객체를 만들고 계속 갱신', '매번 Context를 만들면 Provider와 소비자가 같은 identity를 공유하지 못할 수 있습니다.'],
      ['각 useContext 결과에 값을 직접 대입', '소비 결과를 직접 바꾸는 방식은 Context Provider 계약이 아닙니다.'],
    ], answer: 0, hint: 'Context identity와 Provider 미존재 시 값을 각각 고려하세요.', explanation: 'createContext는 일반적으로 모듈 수준에서 한 번 호출합니다. defaultValue는 일치하는 Provider가 위에 없을 때 쓰이는 정적 대체값이며 Provider 변경을 대신하지 않습니다.' },
    trace: { prompt: '예제에서 defaultTheme 변수의 실제 값은 무엇인가요?', answers: ['light', '밝은 화면'], hint: 'defaultTheme 상수의 대입 문자열을 그대로 확인하세요.', explanation: 'defaultTheme은 `light`입니다. 실제 React 기본값 계약은 createContext 인자와 Provider 유무로 정해집니다.' },
    debugHint: 'ThemeContext를 provider 렌더 때마다 생성해 consumer가 가져온 객체와 달라지지 않는지 확인하세요.', debugId: 'react-w15-d2-debug-v2',
  },
  '15-3': {
    choice: { prompt: '컴포넌트 안에서 가장 가까운 위쪽 ThemeContext Provider의 값을 읽고 변경을 구독하는 Hook은?', options: [
      ['useRef(ThemeContext)', 'ref는 Context 소비 API가 아니며 Provider 변경 구독을 제공하지 않습니다.'],
      ['useMemo(ThemeContext)', 'useMemo는 계산값 캐시 Hook이지 Context 값을 읽는 API가 아닙니다.'],
      ['useContext(ThemeContext)', 'useContext는 위쪽 Provider에서 현재 값을 읽고 해당 값이 바뀌면 소비 컴포넌트를 다시 렌더합니다.'],
    ], answer: 2, hint: 'React가 Context 값을 제공하는 가장 가까운 조상을 찾게 하는 Hook을 고르세요.', explanation: 'useContext(ThemeContext)는 같은 Context 객체를 사용하는 가장 가까운 상위 Provider 값을 돌려줍니다. Provider가 없으면 createContext의 기본값을 사용합니다.' },
    trace: { prompt: 'themeLabel("dark")가 반환하는 표시 문구는 무엇인가요?', answers: ['어두운 화면'], hint: '조건식 theme === "dark"의 참 분기를 읽으세요.', explanation: 'theme이 dark이므로 참 분기인 `어두운 화면`을 반환합니다. 이 순수 함수 추적은 useContext 실행 자체를 검증하지 않습니다.' },
    debugHint: 'ThemeLabel이 Context 값을 읽지 않고 고정 문구만 반환하는지 확인하세요.', debugId: 'react-w15-d3-debug-v2',
  },
  '15-4': {
    choice: { prompt: 'React 19에서 ThemeContext를 사용하는 하위 소비자에게 테마를 제공하려면 무엇을 함께 지정해야 하나요?', options: [
      ['children만 두고 value 생략', 'Context Provider에 공급할 값이 없어 소비자가 의도한 theme을 받지 못합니다.'],
      ['value={theme}와 소비자를 포함한 하위 children', 'value가 읽을 값을 전달하고 Provider가 감싼 영역의 descendants가 이를 읽습니다.'],
      ['ThemeContext를 함수 안에서 새로 createContext', '새 객체 생성은 기존 consumer가 사용하는 Context와 identity가 달라질 수 있습니다.'],
    ], answer: 1, hint: 'Provider의 값 prop과 소비자가 Provider보다 아래 있는지 확인하세요.', explanation: 'Provider는 `value`로 현재 테마를 공급하고, 그 Context를 읽는 소비자를 하위 트리 안에 둬야 합니다.' },
    trace: { prompt: 'ThemeProvider의 Context value로 전달해야 할 prop 이름은 무엇인가요?', answers: ['theme'], hint: 'ThemeProvider 입력 중 현재 Context 값에 해당하는 prop을 고르세요.', explanation: '현재 테마 prop인 `theme`을 Context의 value에 넣어야 자식 소비자가 받을 수 있습니다.' },
    debugHint: 'ThemeContext provider opening tag에 value prop이 빠져 있는지 확인하세요.', repairHint: 'React 19 방식으로 ThemeContext에 value={theme}를 주고 children을 감쌉니다.', repairId: 'react-w15-d4-repair-v2', debugId: 'react-w15-d4-debug-v2',
  },
  '15-5': {
    choice: { prompt: 'Provider value가 새 값으로 바뀔 때 React가 갱신하는 대상에 대한 설명은?', options: [
      ['해당 Context를 읽는 하위 소비자이며, memo만으로 새 Context 값을 차단하지 못한다', '소비자는 최신 Context 값을 받으며 이전/새 값은 Object.is 기준으로 비교됩니다.'],
      ['Context를 읽지 않는 모든 페이지와 다른 탭까지', 'Context는 해당 React 트리의 Provider/소비자 연결 범위에서 동작합니다.'],
      ['memo로 감싼 소비자는 절대로 다시 렌더되지 않는다', 'memo는 부모 prop 비교를 최적화하지만 Context 값 변경은 소비자에 전달됩니다.'],
    ], answer: 0, hint: '현재 ThemeContext를 실제로 읽는 컴포넌트가 무엇인지 추적하세요.', explanation: 'Provider value가 Object.is 기준으로 바뀌면 해당 Context 소비자가 최신 값을 받습니다. memo는 Context update를 막지 않습니다.' },
    trace: { prompt: 'labelForTheme("dark")가 반환하는 값은 무엇인가요?', answers: ['어두운 화면'], hint: 'theme이 dark일 때 선택되는 분기의 문자열을 확인하세요.', explanation: '입력 값이 dark라 반환 문자열은 `어두운 화면`입니다. Context 재렌더 동작은 별도 React 실행으로 검증하지 않았습니다.' },
    debugHint: 'ThemeLabel이 useContext 값을 읽은 뒤에도 반환 JSX가 그 값을 사용하지 않고 고정 문구를 표시하는지 확인하세요.', repairHint: '같은 ThemeContext를 useContext로 읽고 theme 값에 따라 두 문구 중 하나를 렌더링하세요.', repairId: 'react-w15-d5-repair-v2', debugId: 'react-w15-d5-debug-v2',
  },
};

Object.assign(foundationExerciseOverrides, {
  '16-1': {
    choice: { prompt: 'React 19.3에서 ViewTransition의 enter/exit 애니메이션을 상태 변경과 연결하는 방식은?', options: [
      ['전환 대상 트리를 ViewTransition으로 감싸고 상태 업데이트를 startTransition 안에서 표시한다', 'React의 ViewTransition 경계가 Transition으로 표시된 UI 변경에 참여합니다.'],
      ['저장 API가 성공했다고 가정해 화면 전환만 시작한다', '화면 애니메이션은 저장 요청의 성공이나 데이터 영속성을 보장하지 않습니다.'],
      ['각 목록 key를 렌더 때마다 새 난수로 바꾼다', '불안정한 key는 항목 identity를 잃게 하고 전환 품질도 악화시킬 수 있습니다.'],
    ], answer: 0, hint: 'React UI 경계와 전환으로 표시하는 상태 업데이트가 모두 있는지 확인하세요.', explanation: 'ViewTransition은 전환 경계의 시각 변경에 참여하고, startTransition은 해당 state update를 긴급하지 않은 전환으로 표시합니다.' },
    trace: { prompt: 'open이 false일 때 예제 조건식이 고르는 값은 무엇인가요?', answers: ['null'], hint: 'open ? "CourseDetail" : null에서 false 분기를 읽으세요.', explanation: 'open이 false이므로 조건식의 false 분기인 null을 고릅니다.' },
    debugHint: 'setOpen 호출이 startTransition 안에서 실행되는지, 전환 대상 ViewTransition 경계가 있는지 확인하세요.', debugId: 'react-w16-d1-debug-v2',
  },
  '16-2': {
    choice: { prompt: '화면 전환 애니메이션이 학습 기록 저장 상태에 대해 보장하는 것은?', options: [
      ['요청 성공과 데이터 저장 완료', '화면 표시 효과만으로 저장 요청 결과를 확인할 수 없습니다.'],
      ['성공 여부와 무관하게 서버 응답을 저장', '전환 API는 서버 상태나 응답을 저장하지 않습니다.'],
      ['아무것도 보장하지 않으며 저장 결과는 별도로 기다려 처리한다', '시각 전환과 외부 데이터 작업은 서로 다른 계약입니다.'],
    ], answer: 2, hint: '전환 API가 화면 표현을 다루는지 저장 요청을 다루는지 구분하세요.', explanation: '저장 성공은 save 결과로 확인하고, 성공한 뒤 화면 이동을 시작해야 상태 안내와 애니메이션을 혼동하지 않습니다.' },
    trace: { prompt: 'saveBeforeNavigate에서 save 결과가 { ok: false }일 때 함수가 반환하는 값은?', answers: ['false'], idVersion: 3, versioned: true, hint: 'result.ok 검사가 실패하면 다음 줄의 startTransition 전에 반환합니다.', explanation: 'result.ok가 false이면 즉시 false를 반환하므로 페이지 전환을 시작하지 않습니다.' },
    debugHint: 'startTransition 호출을 저장 확인보다 먼저 하거나, 실제 save 결과와 관계없이 성공을 반환하는지 확인하세요.', debugId: 'react-w16-d2-debug-v2',
  },
  '16-3': {
    choice: { prompt: '목록이 삽입·정렬되어도 같은 항목을 React가 식별하도록 할 key는?', options: [
      ['Math.random()으로 생성한 값', '매 렌더마다 달라 항목의 기존 identity와 상태를 보존하기 어렵습니다.'],
      ['항목 데이터의 안정적이고 형제 사이에서 고유한 id', '순서가 바뀌어도 같은 데이터 항목을 가리킵니다.'],
      ['정렬 전 배열의 현재 index', '삽입이나 정렬 뒤 같은 index가 다른 항목을 가리킬 수 있습니다.'],
    ], answer: 1, hint: '배열의 위치가 바뀌어도 해당 과정 자체와 함께 유지되는 값을 고르세요.', explanation: '안정적인 course.id는 재정렬 뒤에도 React가 같은 항목을 추적하게 합니다. key는 같은 형제 집합 안에서 고유해야 합니다.' },
    trace: { prompt: '예제 ids.map((item) => item.id).join(",")이 출력하는 문자열은 무엇인가요?', answers: ['react,python'], hint: 'ids 배열의 각 item.id를 순서대로 쉼표로 연결하세요.', explanation: '첫 id react와 다음 id python을 쉼표로 연결한 결과는 react,python입니다.' },
    debugHint: 'key가 매 렌더마다 만들어지거나 배열 순서에만 기대고 있지 않은지 확인하세요.', debugId: 'react-w16-d3-debug-v2',
  },
  '16-4': {
    choice: { prompt: '애니메이션 설정과 별개로 화면 안의 다음 동작에 필요한 기본 UI 계약은?', options: [
      ['클릭 handler만 붙은 span', 'span은 키보드 조작과 버튼 역할을 자동 제공하지 않습니다.'],
      ['href가 없는 a', '목적지 없는 링크는 이동 계약이 없으므로 주소를 지정해야 합니다.'],
      ['보이는 이름과 기본 키보드 동작을 가진 button', 'button은 동작 의미와 키보드 실행을 기본 제공합니다.'],
    ], answer: 2, hint: '애니메이션 여부와 HTML 요소의 동작 의미는 별개로 확인하세요.', explanation: '다음 과정을 현재 화면 안에서 여는 동작은 이름이 있는 button으로 표현합니다. 실제 다른 주소로 이동하면 유효한 href가 있는 a를 사용합니다.' },
    trace: { prompt: 'NextAction이 사용자 동작에 연결하는 prop 이름은 무엇인가요?', answers: ['onNext'], hint: 'button의 onClick 중괄호 안에 전달된 값을 읽으세요.', explanation: 'onClick에 onNext prop을 전달하므로 버튼 동작이 호출자 handler에 연결됩니다.' },
    debugHint: 'span이 동작을 받으며 키보드 사용자가 같은 동작을 실행할 수 없는지 확인하세요.', repairHint: 'span을 type="button" button으로 바꾸고 기존 onNext를 onClick에 유지하세요.', repairId: 'react-w16-d4-repair-v2', debugId: 'react-w16-d4-debug-v2',
  },
  '16-5': {
    choice: { prompt: 'ViewTransition을 도입하기 전에 호환성 검토에서 확인해야 할 조합은?', options: [
      ['React 19.3 이상과 지원되는 DOM renderer인지 확인한다', '공식 React 19.3 출시 자료는 안정 API와 DOM 한계를 함께 명시합니다.'],
      ['CSS 지원만 보면 모든 React renderer에서 작동한다고 결론낸다', '브라우저 CSS만으로 React API의 renderer 지원을 증명할 수 없습니다.'],
      ['React 버전을 확인하지 않고 react-native에서 사용한다', '현재 공식 ViewTransition 지원은 DOM으로 한정됩니다.'],
    ], answer: 0, hint: 'React 패키지 버전과 실제 renderer 지원을 각각 확인하세요.', explanation: 'React 공식 19.3 출시 자료는 ViewTransition을 안정 기능으로 소개하지만 현재 renderer 범위를 DOM으로 한정합니다.' },
    trace: { prompt: '예제 runtime 객체에 적힌 React 버전 값은 무엇인가요?', answers: ['19.3'], hint: 'runtime 객체에서 react 속성 값을 읽으세요.', explanation: '예시 runtime의 react 속성은 19.3입니다. 실제 프로젝트에서 사용 가능한지는 package와 renderer를 확인해야 합니다.' },
    repairHint: '현재 패키지와 renderer를 확인하고 제목을 ViewTransition 경계 안에 두세요.', repairId: 'react-w16-d5-repair-v2',
  },
  '17-1': {
    choice: { prompt: 'Error Boundary가 일반적으로 fallback으로 전환하는 오류는?', options: [
      ['사용자가 클릭한 뒤 이벤트 handler에서 던진 오류 모두', '이벤트 handler 오류는 boundary가 일반적으로 포착하지 않습니다.'],
      ['하위 React 트리가 렌더링되는 동안 던진 오류', 'Error Boundary는 하위 렌더 오류에 대해 대체 UI를 제공합니다.'],
      ['브라우저의 모든 네트워크와 타이머 오류', '비동기 실패는 발생한 작업 흐름에서 별도로 처리해야 합니다.'],
    ], answer: 1, hint: '오류가 렌더링 중인지 이벤트나 비동기 작업 뒤인지 나누세요.', explanation: 'Error Boundary는 하위 컴포넌트 렌더 중 발생한 오류를 처리합니다. 이벤트 handler와 일반 Promise reject는 해당 작업 흐름에서 처리합니다.' },
    trace: { prompt: '예제 boundaryState 객체에서 failed 값은 무엇인가요?', answers: ['false'], hint: '객체에 넣은 failed boolean 값을 읽으세요.', explanation: '예제 객체의 failed 값은 false입니다. 실제 Error Boundary는 렌더 오류를 받은 뒤 이 값을 true로 바꾸어 fallback 분기로 이동합니다.' },
    debugHint: '문제가 렌더 오류인지 클릭·네트워크 처리에서 나온 오류인지 확인하고 경계의 범위를 적용하세요.', debugId: 'react-w17-d1-debug-v2',
  },
  '17-2': {
    choice: { prompt: '하위 렌더링 오류 뒤 fallback이 사용자에게 제공해야 할 것은?', options: [
      ['빈 화면만 반환해 원인을 숨긴다', '사용자는 실패와 다음 선택을 알 수 없으므로 상태와 복구 방법을 안내해야 합니다.'],
      ['항상 작업이 저장됐다는 성공 문구', '실패 뒤 성공을 주장하면 데이터 상태를 오해하게 합니다.'],
      ['실패 사실과 가능한 다음 행동을 명확히 알린다', 'fallback은 안전한 복구 흐름으로 사용자를 안내해야 합니다.'],
    ], answer: 2, hint: '화면이 중단된 사실뿐 아니라 사용자가 이어서 할 수 있는 행동을 함께 보세요.', explanation: 'fallback은 실패 사실을 숨기지 않고 필요한 경우 다시 시도 등 현실적인 다음 행동을 안내합니다.' },
    trace: { prompt: 'fallback 객체에서 사용자에게 보여 줄 제목은 무엇인가요?', answers: ['과정을 불러오지 못했습니다'], hint: 'fallback.title의 점 뒤 title 속성에 저장된 문자열을 그대로 읽으세요.', explanation: 'fallback의 title은 과정을 불러오지 못했습니다입니다. 실제 Error Boundary 렌더링은 이 데이터 추적으로 실행하지 않습니다.' },
    debugHint: '오류 상태에서 null 또는 성공 UI만 반환해 실패 사실이 사라지는지 확인하세요.', debugId: 'react-w17-d2-debug-v2',
  },
  '17-3': {
    choice: { prompt: 'fetch Promise가 reject될 때 이를 사용자 오류 상태로 바꾸는 위치는?', options: [
      ['요청을 시작한 Effect나 async 작업의 catch 분기', '비동기 실패와 loading/success state를 시작한 흐름이 함께 알고 있습니다.'],
      ['Error Boundary가 모든 reject를 자동 포착한다고 기대', '일반 비동기 callback 오류는 Error Boundary의 기본 포착 범위가 아닙니다.'],
      ['console에만 쓰고 성공 UI를 계속 표시', '개발자 로그만으로 사용자 화면의 잘못된 성공 상태가 해결되지 않습니다.'],
    ], answer: 0, hint: 'Promise의 성공·실패 결과를 알고 있는 요청 코드에서 상태를 바꾸세요.', explanation: '비동기 요청 흐름에서 reject를 잡아 error 상태를 기록해야 합니다. Effect 안에서 catch하거나 호출자에게 reject를 전달해 명시적으로 처리합니다.' },
    trace: { prompt: '예제에서 load 함수의 typeof 결과는 무엇인가요?', answers: ['function'], hint: 'async function 선언의 자료형을 확인하세요.', explanation: 'async function도 JavaScript 함수이므로 typeof load는 function입니다. 이것은 네트워크 요청을 실행한 결과가 아닙니다.' },
    debugHint: 'Promise에 실패 처리 경로가 있는지 확인하세요. Error Boundary가 일반 reject를 대신 처리하지 않습니다.', debugId: 'react-w17-d3-debug-v2',
  },
  '17-4': {
    choice: { prompt: '요청 실패 화면의 다시 시도 button에 연결할 동작은?', options: [
      ['오류 문구만 숨기고 아무 요청도 하지 않는다', '보이는 실패를 감추는 것만으로 데이터가 복구되지는 않습니다.'],
      ['실패했던 요청을 다시 실행하는 handler', '다시 시도는 실패 작업을 실제로 다시 시작해야 합니다.'],
      ['실패 결과를 성공 데이터로 직접 바꾼다', '응답을 받지 않고 성공으로 꾸미면 화면 상태가 거짓이 됩니다.'],
    ], answer: 1, hint: '버튼을 눌렀을 때 실제 요청 흐름이 무엇을 다시 수행하는지 확인하세요.', explanation: 'onClick은 호출자가 넘긴 retry를 실행해 실패했던 요청을 다시 시작합니다. 재시도 후 결과도 성공·실패 상태로 다시 확인해야 합니다.' },
    trace: { prompt: 'RequestError의 다시 요청 button 클릭 시 호출하도록 연결된 prop은 무엇인가요?', answers: ['retry'], hint: 'button의 onClick에 전달된 함수를 읽으세요.', explanation: 'button의 onClick은 retry prop을 호출해 요청 재시도 동작을 시작합니다.' },
    debugHint: '다시 시도 button에 handler가 연결되어 있고 그 handler가 실패 작업을 다시 실행하는지 확인하세요.', repairHint: '오류를 role="alert"로 표시하고 type="button"의 onClick에 retry를 연결하세요.', repairId: 'react-w17-d4-repair-v2', debugId: 'react-w17-d4-debug-v2',
  },
  '17-5': {
    choice: { prompt: '잘못된 이메일 입력과 컴포넌트 렌더 예외를 서로 다른 방식으로 다루는 이유는?', options: [
      ['입력 오류는 필드 수정 안내, 렌더 오류는 Error Boundary fallback으로 복구한다', '각 원인과 사용자가 취할 수 있는 복구 행동이 다릅니다.'],
      ['모든 입력 오류를 throw해 Error Boundary에 맡긴다', '사용자가 값을 고칠 수 있는 일반 검증 실패를 화면 오류와 혼동합니다.'],
      ['입력 오류를 숨기고 제출을 계속한다', '필요한 수정 안내가 없어 사용자는 제출 실패 이유를 알 수 없습니다.'],
    ], answer: 0, hint: '사용자가 수정할 수 있는 값 오류인지 컴포넌트 실행을 중단하는 렌더 실패인지 구분하세요.', explanation: '이메일 형식은 필드 옆 검증 메시지와 aria-invalid로 안내하고 렌더링 실패는 boundary fallback으로 분리합니다.' },
    trace: { prompt: '예제에서 email 값이 비어 있으면 invalid는 무엇인가요?', answers: ['false'], hint: 'email.length > 0 조건이 false이면 && 전체 결과를 계산하세요.', explanation: '빈 문자열은 길이가 0이므로 email.length > 0가 false이고 invalid도 false입니다.' },
    debugHint: '수정 가능한 필드 값을 렌더 도중 throw로 바꿔 Error Boundary를 호출하지 않는지 살펴보세요.', repairHint: '잘못된 입력은 throw하지 말고 aria-invalid와 해당 입력에 연결된 오류 문구로 표시하세요.', repairId: 'react-w17-d5-repair-v2', debugId: 'react-w17-d5-debug-v2',
  },
  '18-1': {
    choice: { prompt: '렌더링 성능을 최적화하기 전에 가장 먼저 할 일은?', options: [
      ['Profiler로 실제 느린 상호작용과 측정값을 확인한다', '병목 위치와 최적화 전 비용을 알아야 효과를 비교할 수 있습니다.'],
      ['모든 컴포넌트에 memo와 useMemo를 추가한다', '불필요한 복잡성이 생기고 병목이 개선된다는 근거가 없습니다.'],
      ['필요한 state 변경을 모두 막는다', '기능 동작을 희생하고 측정 가능한 성능 원인을 해결하지 않습니다.'],
    ], answer: 0, hint: '최적화 대상과 전후 효과를 판단할 관찰값이 먼저 필요한지 생각하세요.', explanation: 'Profiler는 하위 트리 렌더 비용 측정에 도움을 줍니다. 실제 사용자 상호작용에서 병목을 찾고 변경 전후를 비교하세요.' },
    trace: { prompt: '예제 actualDuration 배열에서 가장 큰 값은 몇 ms인가요?', answers: ['14', '14ms'], hint: 'actualDuration 배열의 가장 큰 수를 찾으세요.', explanation: '12, 14, 13 가운데 가장 큰 값은 14입니다. 이 배열은 예시 데이터이며 실제 Profiler가 만든 기록은 아닙니다.' },
    debugHint: '프로파일 측정 없이 최적화를 적용했거나 측정 전에 빠른 계산부터 캐시하는지 확인하세요.', debugId: 'react-w18-d1-debug-v2',
  },
  '18-2': {
    choice: { prompt: 'React Compiler가 적용되지 않은 구성에서 수동 useMemo를 사용할 때 dependencies에 포함할 것은?', options: [
      ['계산 함수가 읽는 모든 반응형 값', '모든 의존성이 바뀔 때 계산 결과가 최신 상태로 다시 계산됩니다.'],
      ['계산에 쓰이지 않는 값 하나만', '실제 입력이 변해도 재계산하지 않아 오래된 결과가 됩니다.'],
      ['항상 빈 배열', '컴포넌트가 읽는 courses와 query 변경을 무시합니다.'],
    ], answer: 0, hint: '계산 callback 안에서 읽는 props와 state를 하나씩 확인하세요.', explanation: '수동 useMemo는 callback이 읽는 courses와 query를 모두 dependencies에 포함해야 합니다. React Compiler를 사용하면 수동 메모이제이션이 불필요한 경우가 많으므로 구성과 측정에 따라 선택합니다.' },
    trace: { prompt: '예제에서 courses 3개와 일치 항목 1개가 주어지면 visibleCourses.length는 얼마인가요?', answers: ['1', '1개'], hint: '예제 입력에서 query와 일치하는 제목을 한 개 찾으세요.', explanation: '세 과정 중 검색어에 맞는 과정이 하나이므로 결과 배열의 길이는 1입니다.' },
    debugHint: '수동 useMemo callback이 읽지만 dependency array에서 빠진 값을 찾으세요.', debugId: 'react-w18-d2-debug-v2',
  },
  '18-3': {
    choice: { prompt: '수동 useCallback을 검토할 근거가 가장 분명한 경우는?', options: [
      ['모든 handler의 선언 줄 수를 줄이고 싶을 때', '함수 참조를 캐시해도 가독성이나 실행 비용이 자동 개선되지는 않습니다.'],
      ['Profiler와 memo 소비자 경계에서 함수 참조 변경이 반복 렌더 원인으로 확인됐을 때', '측정된 참조 안정성 요구에 한해 캐시를 평가할 수 있습니다.'],
      ['React Compiler가 있는지 확인하지 않고 모든 컴포넌트에 추가할 때', 'Compiler는 함수와 컴포넌트를 자동 memoize할 수 있어 중복 수동 캐시가 필요 없을 수 있습니다.'],
    ], answer: 1, hint: '참조 변경이 실제 소비자에 영향을 주는지 측정하고 compiler 설정도 확인하세요.', explanation: '측정된 memo 소비자 경계 등에서 함수 identity가 실제로 필요할 때 useCallback을 검토합니다. callback이 읽는 reactive 값은 dependencies에 포함해야 합니다.' },
    trace: { prompt: 'Object.is에 각각 새 화살표 함수를 전달하면 결과는 무엇인가요?', answers: ['false', '거짓'], hint: '각 화살표 표현식이 별개의 함수 객체를 만드는지 확인하세요.', explanation: '두 함수는 코드 모양이 같아도 별도 객체이므로 Object.is는 false를 반환합니다.' },
    debugHint: 'save prop을 callback에서 읽는데 dependency에 빠뜨렸는지, 수동 캐시가 실제로 필요한지 확인하세요.', debugId: 'react-w18-d3-debug-v2',
  },
  '18-4': {
    choice: { prompt: 'Profiler에서 빈번히 바뀌는 Context가 무관한 소비자까지 갱신한다고 확인한 경우 검토할 일은?', options: [
      ['각 컴포넌트에서 전역 변수로 값을 복사한다', '복사본은 값 흐름을 분리하고 최신 Context 갱신을 놓칠 수 있습니다.'],
      ['측정 없이 모든 Context를 가능한 한 잘게 나눈다', '불필요한 provider 복잡성이 생기며 효과가 확인되지 않았습니다.'],
      ['서로 다른 책임과 변경 빈도에 맞춰 소비 범위를 나누고 다시 측정한다', '원인에 맞게 provider 경계를 조정하고 최적화 효과를 확인합니다.'],
    ], answer: 2, hint: '확인된 불필요한 Context 갱신만 줄이고 변경 후에도 같은 상호작용을 측정하세요.', explanation: '상태 책임과 실제 변경 빈도에 따라 Context를 분리할 수 있습니다. 모든 앱에서 분리가 자동으로 빠르다는 뜻은 아니며 Profiler로 효과를 확인합니다.' },
    trace: { prompt: 'App에서 Page가 받는 두 Context 값 이름은 무엇인가요?', answers: ['theme, typing', 'theme과 typing'], hint: 'ThemeContext와 TypingContext에 각각 전달한 값을 읽으세요.', explanation: '첫 Context는 theme, 중첩된 두 번째 Context는 typing을 전달합니다.' },
    debugHint: '안정된 설정과 매 입력마다 바뀌는 값을 한 Context value 객체로 함께 전달하는지 확인하세요.', repairHint: '가정된 두 Context로 값을 분리하고 Page를 둘 다의 하위에 둡니다. 실제 이득은 Profiler로 확인해야 합니다.', repairId: 'react-w18-d4-repair-v2', debugId: 'react-w18-d4-debug-v2',
  },
  '18-5': {
    choice: { prompt: '실측에서 목록 DOM 크기가 주요 병목으로 나타났을 때 검토할 해결은?', options: [
      ['목록 전체를 계속 렌더링하고 key를 무작위로 바꾼다', '렌더 작업을 줄이지 않고 항목 identity까지 불안정하게 만듭니다.'],
      ['병목 여부와 접근성·초점 흐름을 확인하며 페이지네이션 또는 가상화를 적용한다', '화면에 필요한 범위를 줄일 수 있지만 사용자 이동·초점 요구도 함께 확인해야 합니다.'],
      ['실측 없이 모든 목록에 외부 가상화 의존성을 추가한다', '작은 목록에 불필요한 의존성과 운영 복잡성만 더할 수 있습니다.'],
    ], answer: 1, hint: '측정으로 병목이 확인된 뒤 사용자에게 필요한 목록 구간만 표시하는 방법을 고르세요.', explanation: '페이지네이션 또는 가상화는 렌더 범위를 줄일 수 있습니다. 결과 목록은 데이터 id처럼 안정된 key를 유지하고 키보드·접근성 흐름을 검증해야 합니다.' },
    trace: { prompt: 'courses에서 start 1, pageSize 1인 화면 구간의 첫 항목은 무엇인가요?', answers: ['Python'], hint: 'slice(1, 2)는 index 1 하나만 반환합니다.', explanation: '배열의 두 번째 항목은 Python이며 이 호출은 그 항목 하나만 반환합니다.' },
    debugHint: '큰 목록을 전부 화면에 그리고 있거나 key를 배열 index·무작위 값으로 주는지 살펴보세요.', repairHint: 'start부터 start + pageSize 직전까지만 자르고 잘린 배열을 반환하세요.', repairId: 'react-w18-d5-repair-v2', debugId: 'react-w18-d5-debug-v2',
  },
});

for (const [key, code] of Object.entries({
  '16-1': 'const open = false;\nconst rendered = open ? "CourseDetail" : null;\nconsole.log(rendered);',
  '16-2': 'async function saveBeforeNavigate(save, startTransition, setPage) {\n  const result = await save();\n  if (!result.ok) return false;\n  startTransition(() => setPage("next"));\n  return true;\n}\n\nconst result = await saveBeforeNavigate(async () => ({ ok: false }), () => {}, () => {});\nconsole.log(result);',
  '16-3': 'const ids = [{ id: "react" }, { id: "python" }];\nconsole.log(ids.map((item) => item.id).join(","));',
  '16-5': 'const runtime = { react: "19.3", renderer: "DOM" };\nconsole.log(runtime.react);',
  '17-1': 'const boundaryState = { failed: false };\nconsole.log(boundaryState.failed);',
  '17-2': 'const fallback = { title: "과정을 불러오지 못했습니다" };\nconsole.log(fallback.title);',
  '17-3': 'async function load() {\n  return "ok";\n}\nconsole.log(typeof load);',
  '17-5': 'const email = "";\nconst invalid = email.length > 0 && !email.includes("@");\nconsole.log(invalid);',
  '18-1': 'const actualDuration = [12, 14, 13];\nconsole.log(Math.max(...actualDuration));',
  '18-2': 'const courses = ["React", "Python", "Java"];\nconst query = "Python";\nconst visibleCourses = courses.filter((course) => course.includes(query));\nconsole.log(visibleCourses.length);',
  '18-3': 'const same = Object.is(() => 1, () => 1);\nconsole.log(same);',
})) {
  foundationExerciseOverrides[key].trace.code = code;
}

Object.assign(foundationExerciseOverrides, {
  '19-1': { debugHint: 'label의 htmlFor와 input의 id가 같은 문자열인지 대조하세요. placeholder는 accessible name을 대신하지 않습니다.', trace: { prompt: 'field.id와 field.labelFor가 같으면 표현식은 무엇을 출력하나요?', answers: ['true'], hint: 'email 두 문자열이 같은지 strict equality를 계산하세요.', explanation: '양쪽 값이 모두 email이므로 비교 결과는 true입니다. 실제 JSX에서는 label의 htmlFor와 input의 id를 같은 고유 식별자에 연결합니다.' } },
  '19-2': { debugHint: 'value prop이 현재 값을 고정하는지 확인한 다음, onChange에서 event.target.value를 상태 갱신 함수에 전달하는지 살펴보세요.', trace: { prompt: 'nextValue가 event에서 반환하는 입력 문자열은 무엇인가요?', answers: ['새 값'], hint: '함수가 event.target.value를 그대로 반환합니다.', explanation: '전달한 event의 target.value가 새 값이므로 함수도 새 값을 반환합니다. 실제 controlled input은 이 값을 onChange에서 상태로 반영해야 편집이 유지됩니다.' } },
  '19-3': { debugHint: 'aria-describedby가 가리키는 id가 실제 오류 문구 요소에 있는지 확인하고, input의 id와는 역할이 다른 점도 구분하세요.', trace: { prompt: 'props 객체의 aria-describedby 값은 무엇인가요?', answers: ['email-error'], hint: 'props에서 aria-describedby 키를 대괄호로 조회한 문자열 값을 읽으세요.', explanation: '객체에서 aria-describedby 키의 값은 email-error입니다. 연결된 DOM 요소에도 같은 id가 있어야 보조 기술이 오류 설명을 찾습니다.' } },
  '19-4': { debugHint: '각 오류 요약 항목에 안정된 key가 있는지 확인하고, 링크의 fragment가 실제 잘못된 input id와 일치하는지 추적하세요.', repairHint: '오류마다 key={error.id}를 주고 href fragment를 해당 input의 id로 연결해 바로 이동할 수 있게 하세요.' },
  '19-5': { debugHint: 'input 묶음을 form 안에 두고 제출 버튼의 type이 submit인지 확인하세요. Enter 제출을 임의 keydown handler로 재구현하지 않습니다.', trace: { prompt: 'submitLabel 함수가 반환하는 버튼 문구는 무엇인가요?', answers: ['저장'], hint: 'return 문이 반환하는 문자열을 그대로 읽으세요.', explanation: '함수는 저장 문자열을 반환합니다. 실제 폼의 기본 제출 동작은 form과 submit button으로 표현할 수 있습니다.' } },
  '20-1': { debugHint: '외부 문자열을 React 자식 텍스트로 전달하는지 dangerouslySetInnerHTML 같은 raw HTML 경로로 보내는지 구분하세요.', trace: { prompt: 'console.log가 출력하는 comment 문자열을 그대로 적으세요.', answers: ['<b>안전</b>'], hint: '문자열 안의 꺾쇠괄호와 태그 문자도 값의 일부입니다.', explanation: '출력 값은 <b>안전</b> 문자열입니다. 이를 React 자식 텍스트로 렌더링하면 태그 문자를 표시하며 HTML로 실행하지 않습니다.' } },
  '20-2': { debugHint: 'href가 내부 hash 경로인지 외부 URL인지 파싱한 뒤 허용 scheme·origin·경로 정책을 확인하세요. 문자열 앞부분만 비교하지 마세요.', trace: { prompt: 'path가 "#/"로 시작하는지 출력 결과를 적으세요.', answers: ['true'], hint: 'path 문자열의 첫 두 글자가 #/인지 확인하세요.', explanation: 'path의 첫 두 문자가 #/이므로 startsWith 결과는 true입니다. 이 문자열 검사는 예시 출력일 뿐 임의 외부 URL의 안전성 검증을 대신하지 않습니다.' } },
  '20-3': { debugHint: 'URL parser가 만든 protocol과 canonical origin을 allowlist에 대조하세요. 임의 host를 그대로 img src로 넘기지 말고 대체 이미지도 준비하세요.', trace: { prompt: 'HTTPS protocol과 허용 origin을 모두 통과하면 출력되는 boolean은 무엇인가요?', answers: ['true'], hint: 'protocol은 https:이고 parsed.origin은 허용 집합의 한 항목입니다.', explanation: '두 조건이 모두 참이라 true입니다. 이 예시는 URL allowlist 판정만 계산하며 실제 이미지 요청이나 개인정보 영향을 실행 검증하지 않습니다.' } },
  '20-4': { debugHint: '원본 html을 직접 __html에 넣는지 확인하세요. 서식이 꼭 필요 없다면 text child로 출력하고, 필요하면 유지 관리되는 sanitizer를 거친 결과만 전달합니다.', trace: { prompt: 'allowedTags 배열에 허용한 태그는 몇 개인가요?', answers: ['3'], hint: 'p, strong, em의 세 항목을 세세요.', explanation: '배열에는 p, strong, em 세 항목이 있어 길이는 3입니다. 이 배열 자체는 HTML sanitizer가 아니며 정책 예시일 뿐입니다.' } },
  '20-5': { debugHint: 'JSX text child와 raw HTML 삽입 경로를 비교하세요. formatter가 꼭 필요하다는 근거가 없다면 HTML 해석 경로를 제거하세요.', repairHint: 'comment를 <p>{comment}</p>처럼 텍스트 자식으로 출력하세요. 서식이 필수라면 별도 검증 sanitizer를 적용한 경우만 raw HTML 경로를 사용합니다.' },
  '21-1': { debugHint: '문자열 타입만 보지 말고 허용 ID 집합과 데이터 카탈로그에 실제 항목이 있는지도 검증하세요.', trace: { prompt: 'allowed 집합에 js가 있을 때 has("js") 결과는 무엇인가요?', answers: ['true'], hint: 'Set.has는 같은 값이 집합에 들어 있는지 boolean으로 돌려줍니다.', explanation: 'js가 집합의 항목이므로 결과는 true입니다. 실제 라우트는 허용 여부와 학습 단원 존재 여부를 둘 다 확인해야 합니다.' } },
  '21-2': { debugHint: 'decodeURIComponent가 throw할 수 있는 입력인지 확인하세요. malformed percent escape는 안전한 not-found 또는 입력 오류로 변환합니다.', trace: { prompt: 'readId("%")가 decode 실패를 잡은 뒤 반환하는 값은 무엇인가요?', answers: ['null'], hint: '단독 %는 완성된 percent escape가 아니므로 catch 분기를 탑니다.', explanation: '디코딩에서 URIError가 나고 catch가 null을 반환합니다. 라우팅 코드에서는 이 실패를 잡아 잘못된 경로 화면으로 안내해야 합니다.' } },
  '21-3': { debugHint: '다른 주소로 이동하는 요소가 유효한 href를 가진 a인지 살펴보세요. 화면 안 상태 변경 button과 목적지 링크를 서로 바꾸지 않습니다.', trace: { prompt: 'link 객체의 href 문자열은 무엇인가요?', answers: ['#/track/react'], hint: '객체의 href property 값을 그대로 읽으세요.', explanation: 'href에는 #/track/react가 저장돼 있습니다. 실제 문서에서는 목적지가 있는 a 요소에 연결해야 기본 키보드와 기록 탐색이 보존됩니다.' } },
  '21-4': { debugHint: 'loading 뒤 분기 순서를 확인하세요. 요청 error와 정상 not-found를 성공 Lesson 렌더링보다 먼저 분리해야 합니다.', repairHint: 'loading, error와 retry, lesson 없음, 성공 내용을 독립 분기해 잘못된 성공 화면을 막으세요.' },
  '21-5': { debugHint: '이동 요소에 목적지 href가 있는지 확인하세요. a 링크는 브라우저 뒤로 가기·앞으로 가기와 키보드 기본 동작을 제공합니다.', repairHint: '다음 단원 주소를 href prop으로 받는 a 요소로 표시하세요.' },
  '22-1': { debugHint: 'localStorage는 일반 객체를 그대로 보존하지 않습니다. 저장 호출에 전달하기 전에 JSON 문자열로 직렬화했는지 확인하세요.', trace: { prompt: 'progress를 JSON 문자열로 바꿔 출력하면 무엇인가요?', answers: ['{"done":3}'], hint: 'done 속성 이름과 값 3을 JSON 표기로 감싸고 공백은 없는 stringify 결과를 적으세요.', explanation: 'JSON.stringify({ done: 3 })는 {"done":3} 문자열을 만듭니다. 브라우저 저장소의 setItem에는 객체가 아니라 직렬화된 문자열을 전달해야 합니다.' } },
  '22-2': { debugHint: '저장값이 없을 때와 JSON.parse가 실패할 때를 분리해 안전한 기본값을 반환하는지 확인하세요.', trace: { prompt: '잘못된 JSON "{"을 파싱한 결과에서 lessons 배열 길이는 몇인가요?', answers: ['0'], hint: 'JSON.parse가 예외를 내면 catch가 빈 lessons 기본 객체를 반환합니다.', explanation: '손상된 입력은 catch에서 { version: 1, lessons: [] }로 바뀌므로 길이는 0입니다. 파싱 실패가 앱 전체 오류가 되지 않도록 복구 경계를 둡니다.' } },
  '22-3': { debugHint: 'JSON 문법만 통과했다고 화면에 바로 넘기지 말고 저장된 version과 lessons 자료형을 확인하세요.', trace: { prompt: 'saved.lessons가 배열인지 검사한 결과는 무엇인가요?', answers: ['true'], hint: 'Array.isArray는 lessons가 배열이면 true를 반환합니다.', explanation: 'lessons 값은 빈 배열이므로 결과는 true입니다. 실제 복원에서는 필요한 필드와 형식을 검증한 기록만 초기 상태로 사용하세요.' } },
  '22-4': { debugHint: '저장 호출이 예외를 던질 수 있다는 전제에서 성공 반환과 실패 반환을 분리하세요. 현재 화면 메모리의 답안은 저장 성공으로 간주하지 않습니다.', repairHint: 'storage.setItem을 try/catch 안에서 실행하고 { ok: true } 또는 { ok: false, error }처럼 결과를 나누세요.', repairId: 'react-w22-d4-repair-v2', trace: { prompt: '이 격리된 가짜 저장소가 실패를 던질 때 persist 결과 상태는 무엇인가요?', answers: ['error'], hint: '예제의 setItem은 항상 예외를 던지고 persist는 catch에서 error를 반환합니다.', explanation: '출력은 error입니다. 이 코드는 브라우저 저장소를 건드리지 않는 가짜 storage로 예외 경로만 시험하며, 실제 앱에서는 실패 안내를 보여 주고 현재 메모리 초안을 유지해야 합니다.' } },
  '22-5': { debugHint: '브라우저 저장소는 같은 출처 스크립트에서 읽힐 수 있습니다. 진도와 초안 중에도 비밀번호·인증 토큰 같은 비밀이 섞이지 않았는지 살펴보세요.', trace: { prompt: 'record.completed를 출력하면 어떤 값인가요?', answers: ['true'], hint: '객체의 completed 속성에 지정된 boolean 값을 읽으세요.', explanation: 'record.completed는 true입니다. 학습 위치처럼 민감하지 않은 값만 저장하고 인증 비밀이나 결제 정보는 로컬 진도에 두지 않습니다.' } },
  '23-1': { debugHint: 'lazy에 넘긴 함수가 화면 모듈을 동적으로 import하는지 확인하세요. 실제 화면 렌더링과 모듈 다운로드가 실행된 예로 오해하지 않습니다.', trace: { prompt: 'screenName 상수에 저장된 화면 이름은 무엇인가요?', answers: ['PracticePage'], hint: 'screenName 상수의 문자열 값을 그대로 답으로 적으세요.', explanation: '값은 PracticePage입니다. 이 문자열 추적은 실행 가능한 React 렌더링이 아니라 이름 확인용 예이며, 실제 지연 로드는 모듈 수준 lazy와 동적 import로 구성합니다.' } },
  '23-2': { debugHint: 'Suspense fallback은 lazy 자식이 대기하는 동안 표시할 실제 사용자 안내여야 합니다. 오류 UI와 로딩 UI를 혼동하지 마세요.', trace: { prompt: 'fallback 안내 문자열의 길이가 0보다 크면 결과는 무엇인가요?', answers: ['true'], hint: '문자열에 안내 문자가 있으므로 length > 0을 계산하세요.', explanation: '안내 문자열이 비어 있지 않아 true입니다. 실제 화면에서는 Suspense fallback으로 진행 중임을 알리고 실패는 별도의 오류 경계가 처리합니다.' } },
  '23-3': { debugHint: 'Suspense는 로딩 중 대기를 표현합니다. 동적 import 거부는 별도 오류 상태와 재시도 안내로 이어지는지 확인하세요.', trace: { prompt: 'loadState에 오류가 전달되면 어떤 상태를 반환하나요?', answers: ['error'], hint: 'error가 truthy이면 삼항식의 첫 번째 문자열을 선택합니다.', explanation: '오류 객체가 전달되어 error 상태를 반환합니다. fallback은 대기 중 UI이고 import 실패를 복구하는 오류 경계와는 역할이 다릅니다.' } },
  '23-4': { debugHint: 'React.lazy로 만든 컴포넌트를 사용할 때 부모 경계에 fallback이 있는지 확인하세요. lazy 선언 자체는 실제 프레임워크 앱에서 검증해야 합니다.', repairHint: '모듈 경계에서 lazy 컴포넌트를 선언하고 Suspense fallback을 포함한 JSX로 감싸세요.', repairId: 'react-w23-d4-repair-v2' },
  '23-5': { debugHint: '사전 로딩은 React.lazy가 자동으로 결정한다고 가정하지 마세요. 실제 진입 가능성과 추가 전송량, 데이터 절약 설정 같은 제품 조건을 함께 따져 보세요.', repairHint: '동적 import 자식의 렌더링을 Suspense fallback으로 감싸고, 불러오기 실패 UI는 Error Boundary 등 별도 경계에서 다루세요.', choice: { prompt: '화면 코드를 미리 불러올 때 성능과 데이터 비용을 함께 고려한 결정은?', options: [
    ['다음 화면 진입 가능성과 전송 비용을 보고 필요한 경우만 요청한다', '진입 가능성이 높고 데이터 절약 설정이 아닐 때 미리 요청하는 제품 정책 예입니다.'],
    ['첫 화면에서 모든 지연 화면을 미리 내려받는다', '초기 전송량과 사용하지 않는 코드 다운로드 비용을 무시합니다.'],
    ['렌더링마다 같은 화면 코드를 다시 요청한다', '반복 요청을 유발하며 필요한 화면 경계와 캐시 정책을 고려하지 않습니다.'],
  ], answer: 0, hint: '다음 화면의 진입 가능성과 추가 다운로드 비용을 함께 비교하세요.', explanation: '필요할 가능성이 높은 화면에만 제품·라우터·번들러의 로딩 정책을 적용합니다. React.lazy가 자동 사전 로딩을 보장한다고 가정하지 않습니다.' }, trace: { prompt: '진입 가능성이 높고 데이터 절약 모드가 아닐 때 이 정책은 사전 로딩을 허용하나요?', answers: ['true'], hint: 'true && !false의 결과를 계산하세요.', explanation: '두 조건이 모두 충족되어 true입니다. 이 순수 정책 함수는 번들러나 라우터의 실제 preload API를 호출하지 않으며, 선요청 이득과 전송 비용을 비교하는 판단 예입니다.' } },
  '24-1': { debugHint: '현재 상태와 action을 reducer 입력으로 보고 허용 전이를 정의하세요. 기존 state 객체를 직접 바꾸지 않습니다.', trace: { prompt: 'idle 상태에 start action을 적용한 새 상태는 무엇인가요?', answers: ['loading'], hint: 'reducer의 첫 조건이 참이면 새 status가 loading인 객체를 반환합니다.', explanation: 'idle과 start 조합은 loading으로 전이합니다. 나머지 조합은 기존 state를 그대로 반환해 상태 변경을 명시적 규칙 안에 둡니다.' } },
  '24-2': { debugHint: '등록되지 않은 action에 대한 기본 분기가 기존 state를 그대로 반환하는지 확인하세요.', trace: { prompt: '알 수 없는 action 뒤의 status는 무엇인가요?', answers: ['error'], hint: 'reset 조건이 아니므로 reducer의 기본 return state가 실행됩니다.', explanation: '기존 객체의 status가 error이므로 결과도 error입니다. 알려지지 않은 action을 성공이나 undefined로 바꾸지 않고 기존 상태를 유지합니다.' } },
  '24-3': { debugHint: 'loading/error/success를 독립 boolean으로 두지 않고 하나의 유한한 status 값으로 제한했는지 확인하세요.', trace: { prompt: 'state.status 값은 무엇인가요?', answers: ['error'], hint: '객체에서 status 속성의 문자열 값을 읽으세요.', explanation: '현재 status는 error입니다. 하나의 상태 값으로 표현하면 loading과 error가 동시에 true인 모순 조합을 만들 수 없습니다.' } },
  '24-4': { debugHint: '전이표에서 현재 상태의 허용 목적 목록을 조회해 허용·거부를 나눕니다. 정의되지 않은 상태도 안전하게 처리하세요.', repairHint: 'transitions[from]이 없으면 빈 배열로 보고 includes(to) 결과를 반환하세요.', repairId: 'react-w24-d4-repair-v2', trace: { prompt: 'error에서 success로 가는 전이는 거부되고 loading으로 복구하는 전이는 허용됩니다. 두 결과는 무엇인가요?', answers: ['false true'], hint: 'error 목록은 ["loading"]이므로 success와 loading을 각각 includes로 검사하세요.', explanation: '결과는 false true입니다. 오류에서 바로 성공으로 건너뛰는 대신 다시 loading으로 진입한 뒤 요청 결과를 받도록 전이표가 제한합니다.' } },
  '24-5': { debugHint: '회귀 테스트는 현재 상태와 action의 각 허용·거부 조합을 검사해야 합니다. 상태 머신 예시의 전이 목록이 어떤 경우를 허용하는지 셉니다.', repairHint: 'transitions[from]이 없으면 빈 배열로 처리하고 허용 목록에 to가 있는 경우에만 true를 반환하세요.', trace: { prompt: 'loading에서 허용된 다음 상태는 몇 개인가요?', answers: ['2'], hint: 'success와 error 두 항목의 개수를 세어 답으로 적으세요.', explanation: 'loading은 success와 error 두 전이를 허용합니다. 테스트는 이 두 정상 결과와 목록에 없는 전이가 거부되는 경우를 함께 다룹니다.' } },
  '25-1': { debugHint: '열기부터 제출·피드백·기록 결과까지 한 사용자 흐름을 따라가며 빠진 단계를 찾으세요.', trace: { prompt: '학습 단계 이름을 화살표로 연결하면 어떤 순서가 되나요?', answers: ['open -> answer -> feedback -> save'], hint: '배열의 네 문자열을 배열 순서대로 " -> " 사이에 넣으세요.', explanation: '출력은 open -> answer -> feedback -> save입니다. 학습 화면의 정상 경로는 문항 표시만으로 끝나지 않고 답 제출, 결과 안내, 진도 반영까지 이어져야 합니다.' } },
  '25-2': { debugHint: 'exercises 배열이 비었을 때 map 결과만 반환하는지, 학습자가 이유와 다음 경로를 알 수 있는지 확인하세요.', trace: { prompt: 'emptyMessage([])는 어떤 안내 문구를 반환하나요?', answers: ['아직 문항이 없습니다'], hint: '빈 배열의 length가 0이므로 삼항식의 첫 번째 문장을 선택합니다.', explanation: '반환값은 아직 문항이 없습니다입니다. 제품 화면에서는 빈 이유와 과정 선택 등 유효한 다음 행동도 함께 제공해야 합니다.' } },
  '25-3': { debugHint: '저장 실패 시 초안과 저장 상태를 분리해 보존하는지 확인하세요. 실패를 숨기거나 성공 문구로 바꾸지 않습니다.', trace: { prompt: 'saveStatus가 error일 때 state.draft의 값은 무엇인가요?', answers: ['답안'], hint: 'state 객체의 draft 속성에 저장된 문자열을 그대로 읽으세요.', explanation: 'draft는 답안입니다. 저장 실패여도 controlled 초안을 유지하고 오류를 알려야 학습자가 재시도할 수 있습니다.' } },
  '25-4': { debugHint: '키보드로 제출할 수 있는 form submit 버튼, 진행 중 상태, 결과를 읽을 수 있는 안내를 확인하세요.', repairHint: 'button type="submit"과 진행 중 disabled 상태를 사용하고 결과 문구는 role="status"로 알려 주세요.', repairId: 'react-w25-d4-repair-v2', choice: { prompt: '답안을 키보드로 제출하고 결과 안내를 받는 흐름에 필요한 것은?', options: [
    ['클릭 가능한 문단과 숨긴 focus outline', '기본 버튼 키보드 동작과 초점 위치를 잃게 합니다.'],
    ['Tab 초점·실제 submit 버튼·읽을 수 있는 결과 안내', '기본 폼 키보드 동작과 진행·결과 상태를 학습자에게 제공합니다.'],
    ['제출 뒤 결과 영역을 제거', '학습자가 성공이나 실패 결과를 확인할 수 없습니다.'],
  ], answer: 1, hint: '시각 초점, 키보드 제출, 결과를 읽는 세 경계를 함께 확인하세요.', explanation: '기본 submit button은 form의 키보드 제출 경로를 제공하고 결과 상태는 보조 기술로도 알 수 있어야 합니다.' } },
  '25-5': { debugHint: '정상·loading·error·빈 목록을 순서에 맞게 분기하고 저장 결과는 성공·실패로 알리세요. 실패에서는 controlled draft를 성공 처리처럼 비우지 않습니다.', repairHint: '각 불러오기 상태를 나누고 오류에는 재시도를, 비어 있지 않은 결과에는 답안 입력과 저장 성공·실패 안내를 제공하세요. onSubmit에서 기본 페이지 이동도 막으세요.', repairId: 'react-w25-d5-repair-v2', choice: { prompt: '작은 학습 화면의 통합 완료 기준으로 알맞은 것은?', options: [
    ['성공 화면 한 번만 확인한다', '빈 목록과 저장 실패에서 초안 손실이나 막힌 흐름을 놓칩니다.'],
    ['시각 애니메이션만 확인한다', '문항 제출·피드백·저장·키보드 동작은 검증되지 않습니다.'],
    ['정상·빈 상태·저장 실패·키보드 제출을 각기 확인한다', '대표 경로와 중요한 복구·접근성 경계를 함께 검증합니다.'],
  ], answer: 2, hint: '정상 동작 외에 빈 결과, 저장 오류, 키보드 경계를 체크리스트로 확인하세요.', explanation: '작은 캡스톤은 정상 경로뿐 아니라 빈 결과와 저장 실패 복구, 키보드로 제출하고 결과를 읽는 흐름까지 보여야 합니다.' }, trace: { prompt: 'checks에 넣은 완료 조건은 몇 개인가요?', answers: ['4'], hint: '정상, 빈 상태, 저장 실패, 키보드의 네 항목을 세세요.', explanation: '조건은 네 가지입니다. 단일 정상 예제만 통과해도 빈 상태·저장 실패·키보드 이용성이 보장되는 것은 아니므로 각 경계를 검토해야 합니다.' } },
  '26-1': { debugHint: '저장된 ID가 현재 과정 목록의 항목으로 해석되지 않을 때 오래된 주소 대신 복구 가능한 과정 선택 경로를 제공하세요.', trace: { prompt: 'lesson이 null일 때 resumeTarget은 어떤 경로를 반환하나요?', answers: ['#/tracks'], hint: 'null에 optional chaining을 적용하면 href가 undefined여서 null 병합 오른쪽 값이 선택됩니다.', explanation: '반환값은 #/tracks입니다. 저장한 단원이 삭제되었거나 알 수 없으면 존재하지 않는 수업 주소 대신 과정 선택으로 안내합니다.' } },
  '26-2': { debugHint: '파싱 실패를 복구해도 손상 기록을 정상 기록이라고 표시하지 마세요. 안전한 기본 진입과 복구 안내를 구분합니다.', trace: { prompt: 'read("{")가 잘못된 JSON을 처리한 뒤 반환하는 값은 무엇인가요?', answers: ['null'], hint: 'JSON.parse가 예외를 내면 catch의 반환값을 읽으세요.', explanation: '반환값은 null입니다. 호출자는 이를 정상 복원 데이터로 취급하지 말고 안전한 초기화나 사용자가 선택할 수 있는 복구 안내를 제공해야 합니다.' } },
  '26-3': { debugHint: '저장소 호출이 성공한 뒤에만 성공 UI를 선택하는지 확인하고 예외를 성공 반환으로 덮지 마세요.', trace: { prompt: 'markSaved(false)가 저장 실패를 어떤 문자열로 나타내나요?', answers: ['저장 실패'], hint: 'ok가 false이므로 삼항식의 두 번째 분기를 선택합니다.', explanation: '반환값은 저장 실패입니다. 실제 저장소 예외를 잡아 성공·실패 결과를 받은 뒤 안내해야 클릭만으로 성공을 단정하지 않습니다.' } },
  '26-4': { debugHint: '화면 이동은 href가 있는 a로 표현하세요. href는 부모가 현재 과정 카탈로그에서 검증한 대상만 전달하고, 없으면 선택 화면으로 복구합니다.', repairHint: '검증된 href가 있을 때 a 링크를 렌더링하고 없으면 /tracks로 가는 과정 선택 링크를 제공하세요.', repairId: 'react-w26-d4-repair-v2' },
  '26-5': { debugHint: '백업 복원 뒤 테마 하나만 보존하지 말고 학습 위치·완료 기록·작성 중 초안이 실제로 이어지는지 확인하세요.', repairHint: '저장된 lesson과 유효한 href를 확인해 이어 학습 링크를 만들고 값이 없으면 /tracks를 안내하세요.', trace: { prompt: '복원 데이터의 completed 개수는 몇 개인가요?', answers: ['4'], hint: 'restored 객체의 completed 숫자 값을 그대로 읽으세요.', explanation: '완료 기록은 4개입니다. 이어 학습을 제공할 때는 위치뿐 아니라 완료 문항과 작성 중 초안 등 필요한 진행 데이터도 함께 보존되는지 확인합니다.' } },
});

const advancedDailyCaseSpecs = {
  13: [
    ['상태를 하나로 표현', '로딩과 오류가 동시에 참인 모순을 줄이는 상태 표현은?', 'loading | success | empty | error 중 하나를 저장한다', 'isLoading과 isError boolean을 각각 바꾼다', '화면 상태를 DOM에서 추측한다', 'const state = { status: "success", courses: ["React"] };\nconsole.log(state.status);', 'success', ['function Courses({ loading, error }) {', '  const status = loading ? "loading" : "ready";', '  return error ? <ErrorNotice /> : <CourseList status={status} />;', '}'], 2, '2번 줄은 error와 loading 조합을 단일 값으로 축약해 일부 조합을 잃습니다. 허용되는 상태를 하나의 명시적 값으로 관리하세요.'],
    ['action 전이', '비동기 요청 결과를 reducer에 전달할 action에서 필요한 구분은?', '요청 시작·성공·실패를 구별하는 type', '화면 제목 문자열만 전달', '현재 DOM 노드 전달', 'const action = { type: "success", courses: ["JS"] };\nconsole.log(action.courses.length);', '1', ['function reducer(state, action) {', '  if (action.type === "success") return { status: "error" };', '  return state;', '}'], 2, '2번 줄은 성공 action을 error 상태로 바꿔 입력 의미를 뒤집습니다. action 종류와 다음 상태 전이를 일치시키세요.'],
    ['빈 결과 상태', '요청은 성공했고 courses가 빈 배열일 때 표시할 상태는?', 'empty', 'loading', 'error', 'function statusFor(ok, courses) {\n  if (!ok) return "error";\n  return courses.length === 0 ? "empty" : "success";\n}\nconsole.log(statusFor(true, []));', 'empty', ['function statusFor(ok, courses) {', '  if (!ok) return "empty";', '  return courses.length ? "success" : "loading";', '}'], 2, '2번 줄은 실패를 빈 성공 상태로 분류하고 성공한 빈 배열은 loading으로 남깁니다. 결과 유무와 요청 성공 여부를 분리하세요.'],
    ['오래된 완료 차단', '요청 두 개가 역순으로 끝날 때 오래된 결과를 막는 조건은?', '요청 식별자가 현재 요청과 같을 때만 반영한다', '먼저 시작한 응답을 항상 반영한다', '배열 길이가 같은지만 비교한다', 'const latest = 2;\nconst responseId = 1;\nconsole.log(responseId === latest);', 'false', ['useEffect(() => {', '  fetchCourses(query).then(setCourses);', '}, [query]);'], 2, '2번 줄은 이전 검색 요청이 늦게 끝나도 결과를 덮어씁니다. 취소 또는 요청 id로 현재 요청만 반영하세요.'],
    ['상태 조합 검토', '상태 모델의 모순을 찾는 테스트로 가장 좋은 것은?', '각 상태에서 허용되는 데이터와 안내를 확인한다', '모든 boolean을 true로 설정한다', '기본 상태만 한 번 렌더링한다', 'const allowed = ["loading", "success", "empty", "error"];\nconsole.log(new Set(allowed).size);', '4', ['const [loading, setLoading] = useState(false);', 'const [error, setError] = useState(false);', 'const [empty, setEmpty] = useState(false);'], 2, '2번 줄은 독립 boolean 조합을 늘려 동시에 참인 모순 상태를 만들 수 있습니다. 명시한 각 상태를 표로 검사하세요.'],
  ],
  14: [
    ['children 슬롯', 'Card 안에 호출자가 전달한 화면 조각을 표시할 prop은?', 'children', 'key', 'ref만', 'function Card({ children }) { return children; }\nconsole.log(typeof Card);', 'function', ['function Card({ children }) {', '  return <section>{children()}</section>;', '}'], 2, '2번 줄은 일반 JSX children을 함수로 가정해 호출합니다. 전달된 React 노드를 그대로 중괄호 안에 렌더링하세요.'],
    ['명시적 props', '카드마다 제목과 본문 슬롯을 분리해 전달하려면?', 'title과 children을 명시적으로 받는다', '전역 변수에서 제목을 읽는다', 'DOM의 innerText를 직접 바꾼다', 'function Card({ title, children }) {\n  return { title, children };\n}\nconsole.log(Card({ title: "과정", children: "내용" }).title);', '과정', ['function Card({ title, children }) {', '  return <section>{title}</section>;', '}'], 2, '2번 줄은 children을 버려 호출자가 전달한 본문이 화면에 나타나지 않습니다. 명시적 prop과 children을 모두 배치하세요.'],
    ['레이아웃 조합', '상단 제목과 본문을 가진 재사용 영역을 만드는 React 방식은?', '작은 컴포넌트를 children과 props로 조합한다', '부모 컴포넌트의 내부 state를 자식이 직접 바꾼다', '모든 화면을 하나의 조건식에 넣는다', 'function Layout({ header, children }) {\n  return { header, body: children };\n}\nconsole.log(Layout({ header: "과정", children: "목록" }).body);', '목록', ['function Layout({ header, children }) {', '  return <main>{header}</main>;', '}'], 2, '2번 줄은 전달된 children을 렌더링하지 않습니다. 레이아웃 경계가 받아들인 콘텐츠 슬롯을 포함해야 합니다.'],
    ['목록 key', 'courses.map으로 각 CourseCard를 그릴 때 필요한 안정 식별자는?', '각 항목의 고유 id를 key로 사용한다', '배열 전체의 길이를 key로 사용한다', '매 렌더마다 Math.random()을 사용한다', 'const courses = [{ id: "js" }, { id: "py" }];\nconsole.log(courses.map((course) => course.id).join(","));', 'js,py', ['function CourseList({ courses }) {', '  return courses.map((course) => <CourseCard key={Math.random()} course={course} />);', '}'], 2, '2번 줄은 렌더마다 key가 바뀌어 React가 항목을 안정적으로 추적하지 못합니다. 데이터의 고유 id를 사용하세요.'],
    ['동작 요소 의미', '화면 안 저장 동작을 재사용 카드에서 제공할 요소는?', 'type="button"인 button', 'onClick만 붙인 span', '목적지 없는 a', 'function SaveAction({ save }) {\n  return { element: "button", onClick: save };\n}\nconsole.log(SaveAction({ save() {} }).element);', 'button', ['function SaveAction({ save }) {', '  return <span onClick={save}>저장</span>;', '}'], 2, '2번 줄의 span은 기본 키보드 조작과 버튼 의미가 없습니다. 동작에는 실제 button 요소를 사용하세요.'],
  ],
  15: [
    ['공유 설정 범위', '여러 중첩 컴포넌트가 공통 테마를 읽어야 할 때 적절한 도구는?', '필요한 하위 트리에 둔 Context', '모든 값을 무조건 전역 변수에 저장', '각 하위 컴포넌트에서 서로 다른 복사본 유지', 'const theme = { mode: "dark" };\nconsole.log(theme.mode);', 'dark', ['const ThemeContext = createContext("light");', 'function Toolbar() { return <button>저장</button>; }'], 2, '2번 줄은 Context를 소비하지 않아 Provider 값이 바뀌어도 화면에 반영되지 않습니다. 필요한 소비자에서 값을 읽으세요.'],
    ['Context 기본값', 'Context를 컴포넌트 밖에서 한 번 생성할 때 필요한 함수는?', 'createContext', 'useContext를 컴포넌트 밖에서 호출', 'useState를 모듈 전역에서 호출', 'const defaultTheme = "light";\nconsole.log(defaultTheme);', 'light', ['function ThemeProvider() {', '  const ThemeContext = createContext("light");', '  return <ThemeContext value="dark">...</ThemeContext>;', '}'], 2, '2번 줄은 렌더링 때마다 Context 객체를 새로 만들 수 있습니다. Context는 모듈 수준에서 한 번 생성하고 React 19 provider로 값을 공급하세요.'],
    ['소비자 구독', 'Context 값이 갱신될 때 소비자가 최신 theme을 얻는 Hook은?', 'useContext(ThemeContext)', 'useRef(ThemeContext)', 'useMemo(ThemeContext)', 'function ThemeLabel() {\n  const theme = useContext(ThemeContext);\n  return theme;\n}\nconsole.log(typeof ThemeLabel);', 'function', ['function ThemeLabel() {', '  return <span>기본 테마</span>;', '}'], 2, '2번 줄은 Context 값을 읽지 않고 고정 문구만 렌더링합니다. useContext로 Provider의 값을 구독하세요.'],
    ['Provider 범위', 'Context Provider가 감싸야 하는 범위는?', '그 값을 실제로 읽는 하위 소비자들', '애플리케이션의 무관한 모든 화면', '다른 브라우저 탭', 'const consumers = ["Header", "Settings"];\nconsole.log(consumers.length);', '2', ['<ThemeContext value={theme}>', '  <Header />', '</ThemeContext>', '<Settings />'], 4, '4번 줄의 Settings는 Provider 바깥에 있어 해당 theme 값을 받을 수 없습니다. 실제 소비자까지 필요한 범위를 감싸세요.'],
    ['Context 갱신 범위', 'Context value 객체가 바뀔 때 영향을 받는 우선 대상은?', '해당 Context를 읽는 하위 소비자', '사이트의 다른 출처 문서', '모든 React 앱', 'const value = { mode: "dark" };\nconsole.log(value.mode);', 'dark', ['function ThemeLabel() {', '  const theme = useContext(ThemeContext);', '  return <span>{theme.mode}</span>;', '}'], 2, '2번 줄이 Context를 읽기 때문에 Provider 값 변경의 영향을 받습니다. 무관한 다른 출처나 앱까지 공유되는 전역 상태는 아닙니다.'],
  ],
  16: [
    ['전환 경계', 'ViewTransition으로 시각 전환을 적용할 때 감싸는 대상은?', '전환할 화면 요소를 포함하는 React 경계', 'fetch 요청 자체', 'localStorage 키', 'const feature = "ViewTransition";\nconsole.log(feature);', 'ViewTransition', ['function Page({ title }) {', '  return <h1>{title}</h1>;', '}'], 2, '2번 줄은 전환 대상 경계가 없어 제목이 일반 렌더링으로만 처리됩니다. 지원되는 React 버전과 문서화된 전환 API를 확인해 요소를 감싸세요.'],
    ['시각과 데이터 분리', '화면 전환 애니메이션이 보장하지 않는 것은?', '서버 데이터 저장의 성공', '화면 간 시각 변화', '전환 대상 요소의 표현', 'const status = { saved: false, transition: "running" };\nconsole.log(status.saved);', 'false', ['function saveAndTransition() {', '  startViewTransition(() => setPage("next"));', '  return true;', '}'], 3, '3번 줄은 시각 전환 시작을 데이터 저장 성공으로 오해합니다. 저장 결과는 별도로 기다리고 처리해야 합니다.'],
    ['대상 안정성', '목록 항목이 전환 중에도 올바르게 대응되게 할 기반은?', '안정적인 데이터 id와 명확한 전환 경계', '각 렌더마다 새 무작위 key', '항목의 배열 위치만 영구 식별자로 사용', 'const item = { id: "course-js" };\nconsole.log(item.id);', 'course-js', ['function CourseList({ courses }) {', '  return courses.map((course) => <article key={Math.random()}>{course.title}</article>);', '}'], 2, '2번 줄은 매 렌더마다 identity가 바뀌어 항목 대응이 불안정합니다. 실제 항목 id와 적절한 전환 경계를 유지하세요.'],
    ['접근성 동작', '애니메이션 전환이 있어도 반드시 유지할 사용자 동작은?', '키보드 초점과 의미 있는 상태 안내', '마우스만 가능한 조작', '전환 중 오류 안내 제거', 'const prefersReducedMotion = true;\nconsole.log(prefersReducedMotion);', 'true', ['function NextAction({ onNext }) {', '  return <span onClick={onNext}>다음</span>;', '}'], 2, '2번 줄은 키보드로 실행하기 어려운 span을 동작으로 사용합니다. 애니메이션과 별개로 실제 button 의미와 초점 흐름을 유지하세요.'],
    ['버전 경계 확인', '프로젝트에서 ViewTransition을 쓰기 전에 확인할 것은?', '설치·렌더러 버전과 공식 지원 범위', '모든 React 버전에서 같은 기능이라고 가정', '브라우저 CSS만으로 React API 존재를 단정', 'const requirement = "React 19.3";\nconsole.log(requirement);', 'React 19.3', ['function Page() {', '  return <ViewTransition><h1>과정</h1></ViewTransition>;', '}'], 2, '2번 줄은 ViewTransition이 모든 React 버전에 제공된다고 가정합니다. 실제 프로젝트의 React·렌더러 버전과 공식 지원 범위를 확인하세요.'],
  ],
  17: [
    ['Error Boundary 범위', 'Error Boundary가 주로 포착하는 오류는?', '자식의 렌더링 중 발생한 오류', '이벤트 처리기에서 나중에 던진 오류', '모든 네트워크 실패 자동 처리', 'const boundary = { fallback: "화면을 다시 불러오세요" };\nconsole.log(boundary.fallback);', '화면을 다시 불러오세요', ['function SaveButton() {', '  return <button onClick={() => { throw new Error("저장 실패"); }}>저장</button>;', '}'], 2, '2번 줄의 이벤트 처리기에서 발생한 오류는 일반적인 Error Boundary 렌더링 포착 범위와 다릅니다. 이벤트 오류는 처리기에서 직접 다루세요.'],
    ['대체 UI', '하위 렌더링 오류 뒤 Error Boundary가 제공할 UI는?', '기능 중단을 알리는 명확한 fallback', '빈 화면만 반환', '성공 메시지', 'function fallback(error) {\n  return "화면을 표시하지 못했습니다";\n}\nconsole.log(fallback(new Error()).length > 0);', 'true', ['function ErrorView() {', '  return null;', '}'], 2, '2번 줄은 오류 뒤 아무 설명도 제공하지 않습니다. 사용자가 상황과 다음 행동을 이해할 fallback을 렌더링하세요.'],
    ['비동기 요청 실패', 'fetch Promise reject를 사용자에게 보여 주는 위치는?', '요청을 시작한 비동기 흐름의 catch와 오류 상태', 'Error Boundary가 자동으로 모두 처리한다고 가정', 'console.log에만 기록하고 성공 화면 유지', 'async function load() {\n  try { return await Promise.resolve("ok"); }\n  catch { return "error"; }\n}\nconsole.log(typeof load);', 'function', ['useEffect(() => {', '  fetch("/courses").then(setCourses);', '}, []);'], 2, '2번 줄은 reject된 Promise를 오류 상태로 변환하지 않습니다. 요청 흐름에서 실패를 처리해 사용자에게 알리세요.'],
    ['실패 후 재시도', '오류 화면에 다시 시도 버튼을 제공할 때 연결할 동작은?', '실패한 작업 또는 경계를 의도적으로 다시 실행한다', '현재 오류 메시지를 지운 뒤 아무 작업도 하지 않는다', '잘못된 데이터를 성공으로 바꾼다', 'function retry(load) {\n  return load();\n}\nconsole.log(typeof retry);', 'function', ['function ErrorNotice({ retry }) {', '  return <p role="alert">실패했습니다</p>;', '}'], 2, '2번 줄은 오류만 알리고 전달받은 재시도 동작을 제공하지 않습니다. 실패한 작업을 다시 시작할 수 있는 버튼을 연결하세요.'],
    ['오류 유형 분리', '렌더링 예외와 입력 검증 오류를 화면에서 구분하는 이유는?', '원인에 맞는 복구 행동을 제공하기 위해', '모든 오류를 성공 상태로 표시하기 위해', '오류 메시지를 숨기기 위해', 'const errors = ["렌더링 실패", "잘못된 입력"];\nconsole.log(errors.length);', '2', ['function Form() {', '  if (!email.includes("@")) throw new Error("잘못된 입력");', '  return <EmailField />;', '}'], 2, '2번 줄은 사용자 입력 문제를 렌더 오류로 던져 오류 경계를 깨우려 합니다. 폼 검증은 필드 안내로 표시하고 렌더 실패와 분리하세요.'],
  ],
  18: [
    ['측정 후 최적화', '렌더링 성능을 개선하기 전 우선할 일은?', 'Profiler와 실제 느린 상호작용을 측정한다', '모든 컴포넌트에 memo를 추가한다', '상태 변경을 모두 막는다', 'const measurements = [12, 14, 13];\nconsole.log(Math.max(...measurements));', '14', ['const visible = useMemo(() => filterCourses(courses, query), []);', 'return <CourseList courses={visible} />;'], 1, '1번 줄은 courses와 query를 쓰면서 의존성을 비워 오래된 결과를 유지합니다. 필요성이 측정된 뒤 올바른 의존성으로 최적화하세요.'],
    ['useMemo 의존성', '계산이 courses와 query 두 값을 읽을 때 의존성 배열은?', '[courses, query]', '[courses]만', '빈 배열', 'const deps = ["courses", "query"];\nconsole.log(deps.length);', '2', ['const visible = useMemo(() => filterCourses(courses, query), [courses]);', 'return <CourseList courses={visible} />;'], 1, '1번 줄은 query가 바뀌어도 다시 계산하지 않아 검색 결과가 오래될 수 있습니다. 읽는 모든 반응형 값을 포함하세요.'],
    ['useCallback 필요성', '함수 identity를 캐시할 이유가 생기는 대표 상황은?', 'memo된 자식의 prop 비교 등 측정된 경계', '모든 이벤트 핸들러', '함수 선언을 줄 수로 줄이고 싶을 때', 'const same = Object.is(() => 1, () => 1);\nconsole.log(same);', 'false', ['const onSave = useCallback(() => save(), []);', 'return <SaveButton onSave={onSave} />;'], 1, '1번 줄은 save를 사용하지만 의존성에서 누락합니다. 함수 캐시가 필요하더라도 최신 값을 읽도록 의존성을 정확히 선언하세요.'],
    ['Context 분할', '변경 빈도가 다른 값이 한 Context에 섞여 불필요한 렌더가 생기면?', '값의 책임과 변경 주기에 맞춰 Provider 범위를 나눈다', 'Context 값을 매번 무작위 생성한다', '소비자의 상태 읽기를 제거한다', 'const settings = { theme: "dark", locale: "ko" };\nconsole.log(settings.theme);', 'dark', ['function App({ theme, typing }) {', '  return <AppContext.Provider value={{ theme, typing }}><Page /></AppContext.Provider>;', '}'], 2, '2번 줄은 자주 바뀌는 입력 상태와 안정된 설정을 같은 값으로 전달합니다. 측정 결과에 따라 소비자 범위나 Context 책임을 분리하세요.'],
    ['큰 목록 렌더링', '화면에 보이는 항목 수보다 목록이 훨씬 클 때 검토할 방법은?', '측정 후 페이지네이션 또는 가상화', 'DOM에 모든 항목을 계속 렌더링', '각 항목의 key를 랜덤으로 바꾸기', 'const visible = courses.slice(0, 20);\nconsole.log(visible.length);', '20', ['function CourseList({ courses }) {', '  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '}'], 2, '2번 줄은 전체 목록을 렌더링합니다. 큰 목록이 실제 병목이면 페이지네이션이나 가상화로 화면 작업을 줄이세요.'],
  ],
  19: [
    ['label 연결', '입력과 보이는 설명을 보조 기술에 연결하는 속성 조합은?', 'label htmlFor와 input id가 일치한다', 'placeholder만 설정한다', 'input의 name을 label text로 둔다', 'const field = { id: "email", labelFor: "email" };\nconsole.log(field.id === field.labelFor);', 'true', ['function EmailField() {', '  return <><label>이메일</label><input /></>;', '}'], 2, '2번 줄의 label에는 for 연결이 없고 입력에도 id가 없습니다. htmlFor와 id를 연결해 이름을 제공합니다.'],
    ['제어 입력 갱신', 'value prop을 주는 입력에서 사용자가 수정할 수 있게 할 것은?', 'onChange에서 새 값을 상태로 반영한다', 'onBlur에서 DOM을 직접 수정한다', 'value 속성을 제거하고 defaultValue만 쓴다', 'function nextValue(event) {\n  return event.target.value;\n}\nconsole.log(nextValue({ target: { value: "새 값" } }));', '새 값', ['function SearchBox({ query }) {', '  return <input value={query} />;', '}'], 2, '2번 줄은 value를 제어하면서 onChange가 없어 입력을 수정할 수 없습니다. 상태 갱신 함수를 연결하세요.'],
    ['오류 문구 연결', '입력 오류 문구를 해당 input의 설명으로 연결하는 속성은?', 'aria-describedby', 'aria-hidden', 'role="presentation"', 'const props = { "aria-describedby": "email-error" };\nconsole.log(props["aria-describedby"]);', 'email-error', ['function EmailField({ error }) {', '  return <><input id="email" /><p>{error}</p></>;', '}'], 2, '2번 줄의 오류 문구는 input id와 연결되지 않습니다. id를 부여하고 aria-describedby로 설명을 참조하게 하세요.'],
    ['제출 후 포커스', '여러 필드 오류가 난 뒤 키보드 사용자를 돕는 흐름은?', '요약으로 포커스를 옮기거나 첫 오류에 초점을 둔다', '포커스를 문서 맨 위로 무조건 초기화한다', '오류 텍스트를 숨긴다', 'const firstError = "email";\nconsole.log(firstError);', 'email', ['function ErrorSummary({ errors }) {', '  return <ul>{errors.map((error) => <li>{error}</li>)}</ul>;', '}'], 2, '2번 줄은 오류 요약 항목에 key를 제공하지 않고 초점 이동 경로도 없습니다. 요약 링크나 첫 오류 입력으로 이동을 제공하세요.'],
    ['폼 제출 의미', 'Enter 키로 제출할 수 있는 입력 묶음의 기본 요소는?', 'form과 submit 버튼', '각 input에 임의의 div 클릭만 연결', '본문 전체의 onKeyDown', 'function submitLabel() {\n  return "저장";\n}\nconsole.log(submitLabel());', '저장', ['function SaveForm({ save }) {', '  return <div><input /><span onClick={save}>저장</span></div>;', '}'], 2, '2번 줄은 폼 제출 의미와 키보드 기본 동작을 제공하지 않습니다. form과 실제 submit 버튼을 사용하세요.'],
  ],
};

Object.assign(advancedDailyCaseSpecs, {
  20: [
    ['텍스트 렌더링', '사용자 댓글을 HTML로 실행하지 않고 보여 주는 JSX 방식은?', '문자열을 일반 React 자식으로 렌더링한다', 'dangerouslySetInnerHTML에 그대로 넣는다', 'eval로 문자열을 실행한다', 'const comment = "<b>안전</b>";\nconsole.log(comment);', '<b>안전</b>', ['function Comment({ text }) {', '  return <div dangerouslySetInnerHTML={{ __html: text }} />;', '}'], 2, '2번 줄은 외부 댓글을 HTML로 파싱합니다. 태그 실행이 필요 없는 댓글은 일반 텍스트 자식으로 렌더링하세요.'],
    ['링크 입력 경계', '외부에서 온 이동 주소를 화면 링크로 사용하기 전에 필요한 것은?', '허용 scheme과 내부 경로 정책을 검증한다', '모든 문자열을 href로 바로 전달한다', '입력값을 대문자로만 바꾼다', 'const path = "#/track/react";\nconsole.log(path.startsWith("#/"));', 'true', ['function ProfileLink({ href }) {', '  return <a href={href}>프로필</a>;', '}'], 2, '2번 줄은 javascript: 같은 위험한 scheme도 링크로 사용할 수 있습니다. 경로 형식과 허용 origin을 확인하세요.'],
    ['외부 이미지 URL 정책', '외부에서 받은 아바타 주소를 img src에 넣기 전에 검토할 것은?', '허용한 HTTPS origin과 자산 경로, 실패 시 대체 이미지를 확인한다', '모든 값을 HTML로 해석한다', 'React가 모든 외부 URL을 자동 검증한다고 가정한다', 'const allowedOrigins = new Set(["https://images.example"]);\nconst source = "https://images.example/profile.png";\nconst parsed = new URL(source);\nconsole.log(parsed.protocol === "https:" && allowedOrigins.has(parsed.origin));', 'true', ['function Avatar({ source }) {', '  return <img src={source} alt="프로필" />;', '}'], 2, '2번 줄은 외부 origin을 허용 목록과 대조하지 않습니다. React는 속성 값을 렌더링하지만 외부 호스트 정책이나 개인정보 노출 여부까지 대신 검증하지 않습니다.'],
    ['외부 HTML 필요성', '서식 있는 외부 콘텐츠가 꼭 필요할 때의 안전한 선택은?', '검증된 sanitizer와 제한된 허용 요소를 사용한다', '정규식 하나로 모든 HTML을 안전하게 만든다', '입력을 그대로 dangerouslySetInnerHTML에 전달한다', 'const allowedTags = ["p", "strong", "em"];\nconsole.log(allowedTags.length);', '3', ['function RichText({ html }) {', '  return <article dangerouslySetInnerHTML={{ __html: html }} />;', '}'], 2, '2번 줄은 원본 HTML을 그대로 신뢰합니다. 필요성이 입증되면 검증된 sanitizer와 제한된 태그 정책을 적용하세요.'],
    ['위험 출력 검토', 'UI 보안 검토에서 먼저 찾을 코드 패턴은?', '신뢰하지 않는 값의 HTML 해석 경로', '정적 텍스트 제목', '불변 배열 복사', 'const text = "일반 문장";\nconsole.log(text.length);', '4', ['function Preview({ body }) {', '  return <div>{body}</div>;', '}'], 2, '2번 줄은 일반 React 텍스트 렌더링이므로 HTML로 해석하지 않습니다. 위험 여부는 실제 HTML 삽입 경로를 확인해 판단하세요.'],
  ],
  21: [
    ['매개변수 검증', '주소에서 읽은 courseId로 단원을 열기 전에 확인할 것은?', '허용된 식별자와 실제 단원 존재 여부', '값이 문자열이면 어떤 경로든 허용', '주소 길이만 확인', 'const allowed = new Set(["js", "react"]);\nconsole.log(allowed.has("js"));', 'true', ['function routeFor(courseId) {', '  return "#/lesson/" + decodeURIComponent(courseId);', '}'], 2, '2번 줄은 디코딩한 임의 값을 검증 없이 경로로 만듭니다. 허용된 식별자와 실제 단원 존재를 확인하세요.'],
    ['디코딩 오류', 'malformed percent escape가 포함된 route를 처리할 때 필요한 경계는?', 'decodeURIComponent를 try/catch하고 안전한 경로로 보낸다', '화면 렌더 중 파싱 오류를 방치한다', '문자열을 다시 인코딩해 무조건 연다', 'function readId(value) {\n  try { return decodeURIComponent(value); }\n  catch { return null; }\n}\nconsole.log(readId("%"));', 'null', ['function routeId(value) {', '  return decodeURIComponent(value);', '}'], 2, '2번 줄은 잘못된 escape에서 URIError가 발생해 전체 라우트를 중단시킬 수 있습니다. 파싱 실패 경계를 두세요.'],
    ['링크와 동작 구분', '다른 학습 주소로 이동하는 요소에 사용할 HTML 요소는?', 'href가 있는 a', 'onClick만 붙인 div', '초점 없는 span', 'const link = { tag: "a", href: "#/track/react" };\nconsole.log(link.href);', '#/track/react', ['function LessonLink({ open }) {', '  return <div onClick={open}>단원 열기</div>;', '}'], 2, '2번 줄은 주소 목적지와 기본 키보드·새 탭 동작을 제공하지 않습니다. 주소 이동에는 href가 있는 a를 사용하세요.'],
    ['로딩과 오류 데이터', '주소는 유효하지만 단원 요청에 실패한 경우의 화면은?', '오류 안내와 재시도 선택을 제공한다', '없는 단원 화면으로 바꿔치기한다', '무한 loading으로 유지한다', 'function routeState(found, failed) {\n  if (!found) return "not-found";\n  if (failed) return "error";\n  return "ready";\n}\nconsole.log(routeState(true, true));', 'error', ['function LessonPage({ loading, error, lesson }) {', '  if (loading) return <Spinner />;', '  return <Lesson lesson={lesson} />;', '}'], 3, '3번 줄은 loading만 끝나면 오류가 있어도 lesson을 렌더링합니다. 실패 상태와 성공 데이터를 따로 분기하세요.'],
    ['이동 기록 흐름', '브라우저 뒤로 가기와 앞으로 가기를 유지하는 링크 동작은?', '기본 anchor navigation 또는 라우터 링크를 쓴다', 'location을 매번 강제로 새 창에 연다', '클릭 가능한 문단으로 대체한다', 'const destination = "#/lesson/js";\nconsole.log(destination.startsWith("#/lesson/"));', 'true', ['function NextLesson({ navigate }) {', '  return <p onClick={() => navigate("#/lesson/js")}>다음</p>;', '}'], 2, '2번 줄은 링크 의미와 키보드 동작이 빠진 문단입니다. 기록 탐색을 지원하는 링크 요소를 사용하세요.'],
  ],
  22: [
    ['진도 직렬화', '브라우저에 학습 객체를 문자열로 저장하는 방법은?', 'JSON.stringify(progress)', 'String(progress)', 'JSON.parse(progress)', 'const progress = { done: 3 };\nconsole.log(JSON.stringify(progress));', '{"done":3}', ['function save(progress) {', '  localStorage.setItem("progress", progress);', '}'], 2, '2번 줄은 일반 객체를 문자열화하지 않아 유효한 JSON 기록을 만들지 않습니다. stringify 결과를 저장하세요.'],
    ['손상 JSON 복구', '이전 기록이 잘렸거나 손상됐을 때 필요한 처리는?', '파싱 예외를 잡고 기존 데이터를 보존한 안전 기본값 제공', '파싱 오류를 성공으로 간주', '앱 초기화 시 무조건 새 값으로 덮기', 'function parse(raw) {\n  try { return JSON.parse(raw); }\n  catch { return { version: 1, lessons: [] }; }\n}\nconsole.log(parse("{").lessons.length);', '0', ['function parse(raw) {', '  return JSON.parse(raw);', '}'], 2, '2번 줄은 손상 데이터에서 예외를 던집니다. 파싱 실패와 유효 기록을 구별하고 기존 상태를 무조건 덮어쓰지 마세요.'],
    ['초기 상태 복원', '저장된 JSON을 React 초기 상태로 불러올 때 유효하지 않은 값의 기본 경계는?', '검증을 통과한 저장 데이터만 사용한다', '파싱 결과의 모양을 확인하지 않고 화면에 전달한다', 'Hook 밖에서 조건부 Hook을 호출한다', 'const saved = { version: 1, lessons: [] };\nconsole.log(Array.isArray(saved.lessons));', 'true', ['function useProgress(raw) {', '  const saved = JSON.parse(raw);', '  if (!saved.lessons) return useState({ lessons: [] });', '}'], 3, '3번 줄은 Hook을 조건부로 호출해 호출 순서를 깨뜨립니다. 초기화 경계에서 값을 검증하고 Hook은 항상 같은 순서로 호출하세요.'],
    ['저장 예외 알림', 'localStorage 쓰기가 실패했을 때 사용자에게 필요한 결과는?', '실패를 알리고 현재 메모리 상태와 구분한다', '저장이 완료됐다고 표시한다', '실패한 데이터를 조용히 버린다', 'function persist(storage, key, value) {\n  try { storage.setItem(key, JSON.stringify(value)); return "saved"; }\n  catch { return "error"; }\n}\nconst unavailableStorage = { setItem() { throw new Error("quota"); } };\nconsole.log(persist(unavailableStorage, "progress", { done: 2 }));', 'error', ['function persist(value) {', '  localStorage.setItem("progress", JSON.stringify(value));', '  return "저장 완료";', '}'], 2, '2번 줄은 쓰기 예외를 처리하지 않아 성공 문구까지 도달하지 못할 수 있습니다. 성공과 실패를 구분해 안내하세요.'],
    ['민감 데이터 범위', '계정 없이 기기에 남길 진도로 적절한 범위는?', '학습 위치·답안 요약 등 민감하지 않은 값', '비밀번호나 인증 비밀값', '결제 카드 정보', 'const record = { lessonId: "js-array", completed: true };\nconsole.log(record.completed);', 'true', ['function persistSession(token) {', '  localStorage.setItem("auth-token", token);', '  return true;', '}'], 2, '2번 줄은 스크립트에서 읽을 수 있는 브라우저 저장소에 인증 비밀을 둡니다. 비밀정보는 로컬 진도 데이터와 분리하세요.'],
  ],
  23: [
    ['지연 로드 모듈', '화면을 필요할 때 불러오는 React API 조합은?', 'lazy와 동적 import', 'useMemo와 JSON.parse', 'createContext와 setTimeout', 'const screenName = "PracticePage";\nconsole.log(screenName);', 'PracticePage', ['const PracticePage = lazy(() => import("./PracticePage.js"));', 'function App() { return <PracticePage />; }'], 2, '2번 줄은 lazy 컴포넌트를 렌더링하지만 로딩 중 fallback 경계가 없습니다. Suspense를 함께 배치하세요.'],
    ['Suspense 대기 UI', 'lazy 컴포넌트가 내려오는 동안 화면이 제공해야 하는 것은?', 'Suspense fallback', '빈 컴포넌트만', '영구 오류 문구', 'const fallback = "학습 화면을 불러오는 중";\nconsole.log(fallback.length > 0);', 'true', ['function App() {', '  return <Suspense><PracticePage /></Suspense>;', '}'], 2, '2번 줄은 대기 중 사용자에게 보여 줄 fallback이 없습니다. 읽을 수 있는 로딩 안내를 지정하세요.'],
    ['로딩 오류 구분', '동적 import 자체가 실패한 뒤 대체할 UI 경계는?', '오류 상태를 처리하는 Error Boundary', 'Suspense의 loading 상태만 영원히 유지', '성공한 화면처럼 빈 요소 반환', 'function loadState(error) {\n  return error ? "error" : "ready";\n}\nconsole.log(loadState(new Error()));', 'error', ['function App() {', '  return <Suspense fallback={<p>불러오는 중</p>}><LazyPage /></Suspense>;', '}'], 2, 'Suspense는 대기 상태를 보여 줍니다. import 실패 뒤에는 오류 안내와 재시도 정책도 별도로 필요합니다.'],
    ['분할 경계 선택', '코드 분할 단위를 정할 때 기준으로 삼을 것은?', '독립적으로 늦게 필요한 화면 흐름', '모든 작은 아이콘 하나씩', '컴포넌트 이름의 길이', 'const route = { path: "/practice", loadsOnVisit: true };\nconsole.log(route.loadsOnVisit);', 'true', ['const Icon = lazy(() => import("./TinyIcon.js"));', 'function Header() { return <Suspense fallback={null}><Icon /></Suspense>; }'], 1, '1번 줄은 공통 화면의 작은 요소까지 나누어 추가 로딩 경계가 생깁니다. 실제 전송량과 화면 경계를 기준으로 분할하세요.'],
    ['사전 로딩 판단', '지연 로드 화면을 미리 요청할지 결정할 때 함께 고려할 것은?', '화면 진입 가능성과 추가 전송량·데이터 절약 설정', '모든 화면을 첫 요청에서 미리 내려받기', '네트워크 조건과 무관하게 매 화면을 반복 요청', 'const likelyNavigation = true;\nconst saveData = false;\nconst shouldPreload = likelyNavigation && !saveData;\nconsole.log(shouldPreload);', 'true', ['function shouldPreload(route, saveData) {', '  return !saveData;', '}'], 2, '2번 줄은 모든 route를 미리 요청해 실제 진입 가능성을 고려하지 않습니다. 이 판단은 React.lazy의 내장 API가 아니라 제품·라우터·번들러 계층의 비용 정책 예시입니다.'],
  ],
  24: [
    ['허용 전이', '상태 머신에서 현재 상태와 action으로 다음 상태를 정하는 위치는?', 'reducer의 명시적 전이 규칙', '각 버튼에서 state 객체 직접 변경', '렌더 중 임의 전역 변수 변경', 'function reducer(state, action) {\n  if (state.status === "idle" && action.type === "start") return { status: "loading" };\n  return state;\n}\nconsole.log(reducer({ status: "idle" }, { type: "start" }).status);', 'loading', ['function reducer(state, action) {', '  state.status = action.type;', '  return state;', '}'], 2, '2번 줄은 허용 전이를 확인하지 않고 기존 state 객체를 직접 바꿉니다. reducer에서 입력 상태와 action 조합을 검증하세요.'],
    ['알 수 없는 action', 'reducer가 모르는 action을 받았을 때 안전한 동작은?', '기존 state를 그대로 반환한다', 'state를 undefined로 반환한다', '무조건 성공 상태로 바꾼다', 'function reducer(state, action) {\n  if (action.type === "reset") return { status: "idle" };\n  return state;\n}\nconsole.log(reducer({ status: "error" }, { type: "unknown" }).status);', 'error', ['function reducer(state, action) {', '  return transitions[action.type](state);', '}'], 2, '2번 줄은 등록되지 않은 action에서 undefined 함수를 호출할 수 있습니다. 알 수 없는 action은 기존 state를 반환하도록 처리하세요.'],
    ['상태 수 축소', 'loading과 error가 동시에 true인 조합을 없애는 모델은?', '하나의 status union 값', '서로 독립인 boolean 세 개', '화면 텍스트에서 상태 추측', 'const state = { status: "error" };\nconsole.log(state.status);', 'error', ['const [loading, setLoading] = useState(false);', 'const [error, setError] = useState(false);', 'const [success, setSuccess] = useState(false);'], 2, '2번 줄은 각 상태를 독립 boolean으로 두어 서로 모순될 수 있습니다. 가능한 상태를 한 값으로 제한하세요.'],
    ['전이 검증', 'error 상태에서 success로 바로 갈 수 없는 제품 규칙을 표현하려면?', '허용된 from-to 전이 표를 검사한다', '모든 action을 허용한다', '화면 문구만 바꾼다', 'const transitions = { idle: ["loading"], loading: ["success", "error"], error: ["loading"] };\nconsole.log(transitions.error.includes("success"));', 'undefined', ['function canMove(from, to) {', '  return true;', '}'], 2, '2번 줄은 현재 상태와 무관하게 모든 전이를 허용합니다. 전이 표를 조회해 규칙 밖의 이동을 막으세요.'],
    ['전이 중심 테스트', '상태 머신 회귀 테스트에서 가장 직접적인 단위는?', '각 현재 상태와 action의 다음 상태', '컴포넌트 함수 이름만', 'CSS 클래스의 개수', 'const next = { loading: ["success", "error"] };\nconsole.log(next.loading.length);', '2', ['function reducer(state, action) {', '  if (action.type === "success") return { ...state, status: "success" };', '  return state;', '}'], 2, '2번 줄은 현재 상태가 success로 전환 가능한지 확인하지 않습니다. 전이 규칙의 허용·거부 쌍을 각각 검사하세요.'],
  ],
  25: [
    ['정상 경로 통합', '학습 화면의 정상 경로 검토에서 확인할 순서는?', '단원 열기·답 제출·정답 피드백·기록 갱신', '색상 토큰만 확인', '페이지 새로고침만 반복', 'const flow = ["open", "answer", "feedback", "save"];\nconsole.log(flow.join(" -> "));', 'open -> answer -> feedback -> save', ['function Lesson({ exercises }) {', '  return <QuestionList exercises={exercises} />;', '}'], 2, '2번 줄은 단원 목록만 보여 줍니다. 답 제출 이후 피드백과 기록 저장까지 이어지는 흐름을 확인하세요.'],
    ['빈 목록 화면', '문항 목록이 비었을 때 필요한 결과는?', '비어 있는 이유와 과정 선택 방법을 안내한다', '오류 없이 빈 흰 화면', '계속 도는 spinner', 'function emptyMessage(exercises) {\n  return exercises.length === 0 ? "아직 문항이 없습니다" : "문항";\n}\nconsole.log(emptyMessage([]));', '아직 문항이 없습니다', ['function ExerciseList({ exercises }) {', '  return <ul>{exercises.map((item) => <li key={item.id}>{item.title}</li>)}</ul>;', '}'], 2, '2번 줄은 빈 목록에서 아무 설명도 렌더링하지 않습니다. 빈 상태와 다음 이동 경로를 제공하세요.'],
    ['오류 경계 통합', '답안 저장이 실패한 경우 학습자가 잃지 않아야 할 것은?', '작성한 답안 초안과 재시도 경로', '답안 텍스트와 오류 정보 모두', '기록을 성공했다고 표시', 'const state = { draft: "답안", saveStatus: "error" };\nconsole.log(state.draft);', '답안', ['function Feedback({ status }) {', '  return status === "error" ? null : <p>저장 완료</p>;', '}'], 2, '2번 줄은 오류 상태에서 아무 메시지도 제공하지 않고 사용자가 다음 행동을 알 수 없습니다. 실패 안내와 재시도를 제공하세요.'],
    ['키보드 통합 검토', '답안 선택 후 결과에 접근하기 위한 키보드 흐름은?', 'Tab 순서와 초점 표시, 상태 안내를 확인한다', '마우스 클릭만 확인한다', 'outline을 모두 숨긴다', 'const interaction = ["tab", "select", "submit", "read-feedback"];\nconsole.log(interaction.length);', '4', ['function Submit({ onSubmit }) {', '  return <div onClick={onSubmit}>제출</div>;', '}'], 2, '2번 줄은 기본 키보드 실행이 가능한 submit 버튼이 아닙니다. 버튼 의미와 초점 흐름을 함께 점검하세요.'],
    ['작은 캡스톤 범위', '작은 학습 화면을 완성했다고 판단할 최소 기준은?', '정상·빈 상태·저장 실패·키보드 흐름이 동작한다', '정상 응답 한 번만', '화면 애니메이션만', 'const checks = ["정상", "빈 상태", "저장 실패", "키보드"];\nconsole.log(checks.length);', '4', ['function App() {', '  return <main><h1>학습</h1><LessonList /></main>;', '}'], 2, '2번 줄은 화면 뼈대만 보여 줍니다. 경계 상태와 사용 가능한 상호작용까지 확인해야 완료 기준을 충족합니다.'],
  ],
  26: [
    ['유효한 재개 대상', '저장한 lessonId가 삭제되었거나 알 수 없을 때 보여 줄 곳은?', '과정 선택 화면', '존재하지 않는 단원 주소', '성공 피드백', 'function resumeTarget(lesson) {\n  return lesson?.href ?? "#/tracks";\n}\nconsole.log(resumeTarget(null));', '#/tracks', ['function ResumeLink({ lesson }) {', '  return <a href={lesson.href}>이어 학습</a>;', '}'], 2, '2번 줄은 lesson이 없을 때도 속성을 읽어 예외가 납니다. 저장된 단원을 검증하고 없으면 과정 선택으로 안내하세요.'],
    ['기록 파싱 경계', '저장된 JSON 파싱 실패 뒤 화면을 복구하는 방법은?', '오류를 기록하고 안전한 초기 진도 흐름 제공', '예외를 던져 앱 전체를 중단', '손상 데이터를 성공으로 간주', 'function read(raw) {\n  try { return JSON.parse(raw); }\n  catch { return null; }\n}\nconsole.log(read("{"));', 'null', ['function read(raw) {', '  return JSON.parse(raw);', '}'], 2, '2번 줄은 손상 데이터에서 예외를 그대로 던집니다. 파싱 실패를 잡고 재시작 또는 복구 안내를 제공하세요.'],
    ['저장 성공 확인', '진도 저장 후 화면에서 성공으로 표시하기 전에 필요한 것은?', '저장 작업 결과가 성공했는지 확인한다', '버튼 클릭 즉시 성공 상태 확정', 'localStorage 사용 여부를 추측', 'function markSaved(ok) {\n  return ok ? "저장 완료" : "저장 실패";\n}\nconsole.log(markSaved(false));', '저장 실패', ['function saveProgress(progress) {', '  localStorage.setItem("progress", JSON.stringify(progress));', '  return "저장 완료";', '}'], 2, '2번 줄은 저장소 예외 가능성을 처리하지 않습니다. 실제 저장 결과를 확인하고 성공·실패를 구분하세요.'],
    ['resume 접근성', '이어 학습 동작을 키보드와 보조 기술에 맞게 제공하는 요소는?', '목적지 href가 있는 a와 분명한 이름', 'onClick만 있는 span', 'aria-hidden인 버튼', 'const link = { href: "#/lesson/java", label: "Java 변수 이어 학습" };\nconsole.log(link.label);', 'Java 변수 이어 학습', ['function Resume({ href }) {', '  return <span onClick={() => location.hash = href}>이어 학습</span>;', '}'], 2, '2번 줄의 span은 링크 semantics와 기본 키보드·열기 기능이 없습니다. href와 목적지 이름을 가진 링크를 제공하세요.'],
    ['복원 이후 연속성', '백업을 복원한 뒤 가장 중요한 사용자 확인은?', '최근 단원·완료 문제·초안이 이어지는지 확인한다', '테마만 맞는지 확인한다', '저장 파일 이름만 확인한다', 'const restored = { lessonId: "js-map", completed: 4, draft: "Map key" };\nconsole.log(restored.completed);', '4', ['function restore(data) {', '  return { theme: data.theme };', '}'], 2, '2번 줄은 테마만 복원하고 학습 위치·완료 문제·작성 초안을 버립니다. 복원 뒤 실제 학습을 계속할 수 있는지 확인하세요.'],
  ],
});

const advancedDailyCases = Object.fromEntries(Object.entries(advancedDailyCaseSpecs).flatMap(([week, cases]) =>
  cases.map(([title, prompt, correctOption, wrongOptionA, wrongOptionB, traceCode, traceOutput, errorCodeLines, errorLine, errorExplanation], index) => {
    const answer = (Number(week) + index) % 3;
    const options = [];
    options[answer] = correctOption;
    options[(answer + 1) % 3] = wrongOptionA;
    options[(answer + 2) % 3] = wrongOptionB;
    return [String(week) + '-' + (index + 1), [title, prompt, options, answer, traceCode, [traceOutput], errorCodeLines, errorLine, errorExplanation]];
  }),
));

advancedDailyCases['18-5'][4] = 'const courses = [1, 2, 3];\nconst visible = courses.slice(0, 2);\nconsole.log(visible.length);';
advancedDailyCases['18-5'][5] = ['2'];
advancedDailyCases['20-3'][4] = 'const allowedOrigins = new Set(["https://images.example"]);\nconst source = "https://images.example/profile.png";\nconst parsed = new URL(source);\nconsole.log(parsed.protocol === "https:" && allowedOrigins.has(parsed.origin));';
advancedDailyCases['20-3'][5] = ['true'];
advancedDailyCases['20-5'][5] = ['5'];
advancedDailyCases['13-1'][6] = [
  'function RequestState() {',
  '  const [loading, setLoading] = useState(false);',
  '  const [error, setError] = useState(false);',
  '  return { loading, error };',
  '}',
];
advancedDailyCases['13-1'][7] = [2, 3];
advancedDailyCases['13-1'][8] = '2–3번 줄은 loading과 error를 독립적으로 저장해 두 값이 동시에 true인 표현을 허용합니다. 하나의 status 값으로 상호 배타적인 요청 단계를 표현하세요.';
advancedDailyCases['13-2'][6] = [
  'function requestReducer(state, action) {',
  '  if (action.type === "succeeded") return { ...state, status: "error" };',
  '  return state;',
  '}',
];
advancedDailyCases['13-2'][7] = 2;
advancedDailyCases['13-2'][8] = '2번 줄은 succeeded action을 error 상태로 바꿔 성공 결과를 실패로 뒤집습니다. 성공 상태와 payload를 포함한 새 객체를 반환하세요.';
advancedDailyCases['13-3'][6] = [
  'function statusFor(ok, courses) {',
  '  if (!ok) return "empty";',
  '  return courses.length ? "success" : "loading";',
  '}',
];
advancedDailyCases['13-3'][7] = 2;
advancedDailyCases['13-3'][8] = '2번 줄은 요청 실패를 빈 성공으로 분류합니다. 실패는 error로, 성공한 빈 배열은 empty로 분리하세요.';
advancedDailyCases['13-4'][6] = [
  'function applyCourseResponse(response, setCourses) {',
  '  setCourses(response.courses);',
  '}',
];
advancedDailyCases['13-4'][7] = 2;
advancedDailyCases['13-4'][8] = '2번 줄은 응답이 현재 활성 요청의 결과인지 확인하지 않아 늦게 도착한 오래된 검색 결과가 화면을 덮을 수 있습니다.';
advancedDailyCases['16-1'][6] = [
  'function TogglePage({ setShow }) {',
  '  return <button onClick={() => setShow((show) => !show)}>과정</button>;',
  '}',
];
advancedDailyCases['16-1'][7] = 2;
advancedDailyCases['16-1'][8] = '2번 줄은 상태 갱신을 긴급 업데이트로 실행합니다. 이 ViewTransition 경계의 진입·이탈 애니메이션을 트리거하려면 상태 변경을 startTransition으로 표시하세요.';
advancedDailyCases['16-2'][6] = [
  'function saveAndTransition(setPage) {',
  '  startTransition(() => setPage("next"));',
  '  return { saved: true };',
  '}',
];
advancedDailyCases['16-2'][7] = 3;
advancedDailyCases['16-2'][8] = '3번 줄은 화면 전환 예약을 저장 성공으로 오해합니다. ViewTransition과 startTransition은 화면 갱신을 조정할 뿐 데이터 저장 성공을 보장하지 않습니다.';
advancedDailyCases['13-5'][6] = [
  'function RequestState() {',
  '  const [loading, setLoading] = useState(false);',
  '  const [error, setError] = useState(false);',
  '  const [empty, setEmpty] = useState(false);',
  '}',
];
advancedDailyCases['13-5'][7] = [2, 3, 4];
advancedDailyCases['13-5'][8] = '2–4번 줄은 독립 boolean으로 여러 상태 조합을 만들 수 있습니다. 정의된 상태·전이표와 대조해 불가능한 조합을 없애세요.';
advancedDailyCases['15-5'][6] = [
  'function ThemeLabel() {',
  '  const theme = useContext(ThemeContext);',
  '  return <span>기본 테마</span>;',
  '}',
];
advancedDailyCases['15-5'][7] = 3;
advancedDailyCases['15-5'][8] = '3번 줄은 useContext로 읽은 theme을 버리고 고정 문구를 표시합니다. Provider value가 달라질 때 현재 값에 맞는 문구를 렌더링하세요.';
advancedDailyCases['14-1'][6] = [
  'function Card({ children }) {',
  '  return <section>{children()}</section>;',
  '}',
];
advancedDailyCases['14-1'][7] = 2;
advancedDailyCases['14-1'][8] = '2번 줄은 일반 React node인 children을 함수라고 가정해 호출합니다. 호출자가 전달한 JSX 조각을 그대로 중괄호 안에 렌더링하세요.';
advancedDailyCases['14-2'][6] = [
  'function courseLabel({ title, minutes }) {',
  '  return `${title}`;',
  '}',
];
advancedDailyCases['14-2'][7] = 2;
advancedDailyCases['14-2'][8] = '2번 줄은 계약으로 받은 minutes prop을 표시하지 않습니다. 제목과 예상 시간을 함께 반환하세요.';
advancedDailyCases['14-3'][6] = [
  'function PageLayout({ header, children }) {',
  '  return <main><header>{header}</header></main>;',
  '}',
];
advancedDailyCases['14-3'][7] = 2;
advancedDailyCases['14-3'][8] = '2번 줄은 전달받은 children 슬롯을 반환하지 않아 호출자의 본문 콘텐츠가 사라집니다. 공통 header와 children을 모두 배치하세요.';
advancedDailyCases['14-4'][6] = [
  'function CourseList({ courses }) {',
  '  return courses.map((course, index) => <li key={index}>{course.title}</li>);',
  '}',
];
advancedDailyCases['14-4'][7] = 2;
advancedDailyCases['14-4'][8] = '2번 줄은 항목 정체성 대신 배열 위치를 key로 사용합니다. 삽입·정렬이 가능하면 안정된 course.id를 연결하세요.';
advancedDailyCases['15-1'][6] = [
  'function Page({ theme }) {',
  '  return <Toolbar />;',
  '}',
  'function Toolbar({ theme }) {',
  '  return <SaveButton theme={theme} />;',
  '}',
];
advancedDailyCases['15-1'][7] = 2;
advancedDailyCases['15-1'][8] = '2번 줄은 theme prop을 Toolbar에 전달하지 않아 값의 흐름이 끊깁니다. 넓은 하위 트리에 설정을 공유할 때는 Context 사용도 검토할 수 있습니다.';
advancedDailyCases['15-2'][6] = [
  'const ThemeContext = createContext("light");',
  'function ThemeProvider({ children }) {',
  '  const ThemeContext = createContext("dark");',
  '  return <ThemeContext value="dark">{children}</ThemeContext>;',
  '}',
];
advancedDailyCases['15-2'][7] = 3;
advancedDailyCases['15-2'][8] = '3번 줄은 렌더마다 별도의 Context identity를 만들어 바깥에서 가져온 ThemeContext 소비자와 연결을 끊을 수 있습니다. Context 객체는 컴포넌트 바깥에서 한 번 생성하세요.';
advancedDailyCases['15-3'][6] = [
  'function ThemeLabel() {',
  '  return <span>기본 테마</span>;',
  '}',
];
advancedDailyCases['15-3'][7] = 2;
advancedDailyCases['15-3'][8] = '2번 줄은 ThemeContext를 읽지 않고 고정 문구만 반환합니다. useContext(ThemeContext)로 상위 Provider의 현재 값을 소비하세요.';
advancedDailyCases['15-4'][6] = [
  'function ThemeProvider({ theme, children }) {',
  '  return <ThemeContext>{children}</ThemeContext>;',
  '}',
];
advancedDailyCases['15-4'][7] = 2;
advancedDailyCases['15-4'][8] = '2번 줄은 React 19 Context provider의 value를 지정하지 않아 theme을 하위 소비자에게 공급하지 않습니다.';
advancedDailyCases['23-4'][6] = [
  'function Header() {',
  '  const TinyIcon = lazy(() => import("./TinyIcon.js"));',
  '  return <TinyIcon />;',
  '}',
];
advancedDailyCases['23-4'][7] = 2;
advancedDailyCases['23-4'][8] = '2번 줄은 렌더링마다 새 lazy 컴포넌트 타입을 만들어 불필요한 재마운트와 로딩 경계를 일으킬 수 있습니다. lazy 선언은 모듈 경계에 둡니다.';
advancedDailyCases['22-4'][4] = 'function persist(storage, key, value) {\n  try { storage.setItem(key, JSON.stringify(value)); return "saved"; }\n  catch { return "error"; }\n}\nconst unavailableStorage = { setItem() { throw new Error("quota"); } };\nconsole.log(persist(unavailableStorage, "progress", { done: 2 }));';
advancedDailyCases['22-4'][5] = ['error'];
advancedDailyCases['24-4'][4] = 'const transitions = { idle: ["loading"], loading: ["success", "error"], error: ["loading"] };\nconst canTransition = (from, to) => (transitions[from] ?? []).includes(to);\nconsole.log(canTransition("error", "success"), canTransition("error", "loading"));';
advancedDailyCases['24-4'][5] = ['false true'];
advancedDailyCases['24-3'][6] = [
  'function stateFor(loading, error) {',
  '  return { loading, error };',
  '}',
];
advancedDailyCases['24-3'][7] = 2;
advancedDailyCases['24-3'][8] = '2번 줄은 독립 boolean으로 서로 모순되는 loading·error 조합을 허용합니다. 상태 머신에서는 유효한 상태 중 하나만 표현하세요.';
advancedDailyCases['25-1'][6] = [
  'async function submit(answer) {',
  '  setDraft("");',
  '  await save(answer);',
  '}',
];
advancedDailyCases['25-1'][7] = 2;
advancedDailyCases['25-1'][8] = '2번 줄은 저장 성공을 확인하기 전에 초안을 지웁니다. 저장 실패 때 답안을 보존하고 성공 뒤에만 비우세요.';
advancedDailyCases['25-5'][6] = [
  'function App({ status, courses }) {',
  '  if (status === "loading") return <Spinner />;',
  '  return <CourseList courses={courses} />;',
  '}',
];
advancedDailyCases['25-5'][7] = 3;
advancedDailyCases['25-5'][8] = '3번 줄은 error와 성공한 빈 목록을 구분하지 않아 실패 원인이나 다음 행동을 알리지 못합니다. 오류·빈 상태·성공 상태를 각각 렌더링하세요.';

Object.assign(advancedDailyCases, {
  '16-1': ['전환 업데이트', 'Transition으로 표시된 화면 상태 변경', '전환 대상 ViewTransition 경계와 startTransition 업데이트를 확인한다', '전환 상태 갱신을 별도 화면 API 호출과 구분한다', 'const update = { kind: "transition", saved: false };\nconsole.log(update.kind);', ['transition'], ['function showCourse(setOpen) {', '  setOpen(true);', '}'], 2, '2번 줄은 상태를 긴급 업데이트로 실행합니다. ViewTransition enter/exit 애니메이션을 트리거할 전환은 startTransition 안에서 상태를 갱신해야 합니다.'],
  '16-2': ['시각과 저장 분리', '애니메이션은 외부 저장 결과를 대신하지 않는다', '시각 전환과 Promise 저장 결과를 별도로 확인한다', '성공 여부와 관계없이 이동 상태를 저장한다', 'const result = { saved: false, transition: "running" };\nconsole.log(result.saved);', ['false'], ['async function saveAndNavigate(save, startTransition, setPage) {', '  startTransition(() => setPage("next"));', '  return true;', '}'], 3, '3번 줄은 save 결과를 호출하거나 기다리지 않았는데 성공을 반환합니다. 저장 성공 확인 뒤에야 이동을 시작하세요.'],
  '16-3': ['안정된 항목 정체성', '정렬해도 유지되는 목록 항목의 key', '안정된 id가 삽입·정렬 뒤 같은 항목을 식별하는지 확인한다', '항목별 key 값을 구분한다', 'const ids = ["react", "python"];\nconsole.log(ids.join(","));', ['react,python'], ['function CourseList({ courses }) {', '  return courses.map((course) => <article key={Math.random()}>{course.title}</article>);', '}'], 2, '2번 줄은 매 렌더마다 key가 바뀌어 같은 과정의 identity를 보존하지 못합니다. 안정된 course.id를 사용하세요.'],
  '16-4': ['키보드와 동작 의미', '전환과 독립된 button/anchor 의미', '화면 동작을 키보드로 실행할 실제 button인지 확인한다', '버튼이 전달받는 handler를 확인한다', 'function NextAction({ onNext }) {\n  return onNext ? "다음 과정" : "없음";\n}\nconsole.log(NextAction({ onNext() {} }));', ['다음 과정'], ['function NextAction({ onNext }) {', '  return <span onClick={onNext}>다음 과정</span>;', '}'], 2, '2번 줄의 span은 기본 키보드 실행과 button 의미를 제공하지 않습니다. 화면 안 동작은 이름 있는 실제 button으로 표시하세요.'],
  '16-5': ['React 19.3 지원 경계', '공식 React 버전과 renderer 한정', 'React 19.3 출시 자료와 프로젝트 renderer 범위를 확인한다', '미지원 renderer에 API를 가정하지 않는다', 'const version = "React 19.3";\nconsole.log(version);', ['React 19.3'], ['// 프로젝트 React는 18.3입니다.', 'function MotionHeading({ title }) {', '  return <ViewTransition><h1>{title}</h1></ViewTransition>;', '}'], 3, '3번 줄은 React 18.3 프로젝트에서 React 19.3에 안정 공개된 ViewTransition을 사용할 수 있다고 가정합니다. 프로젝트 버전을 올리거나 지원되는 기능을 선택하세요.'],
  '17-1': ['렌더 오류 경계', 'Error Boundary가 포착하는 렌더링 오류 범위', '렌더링 중 오류와 event handler 오류를 구분한다', '클릭 handler 예외를 처리할 위치를 선택한다', 'const failure = { phase: "render", caughtByBoundary: true };\nconsole.log(failure.caughtByBoundary);', ['true'], ['function SaveButton() {', '  return <button onClick={() => { throw new Error("저장 실패"); }}>저장</button>;', '}'], 2, '2번 줄은 이벤트 handler에서 나중에 던진 예외입니다. Error Boundary는 이를 포착하지 않으므로 handler에서 직접 처리해야 합니다.'],
  '17-2': ['복구 fallback', '하위 렌더 오류 뒤 대체 UI가 알려야 할 사실', '실패를 숨기거나 성공으로 잘못 표시하지 않는지 확인한다', 'fallback의 사용자 안내 문장을 확인한다', 'const fallback = { title: "과정을 불러오지 못했습니다", action: "다시 시도" };\nconsole.log(fallback.title);', ['과정을 불러오지 못했습니다'], ['function ErrorFallback() {', '  return null;', '}'], 2, '2번 줄은 하위 렌더 실패 뒤 아무 설명도 제공하지 않습니다. 실패 사실과 가능한 복구 행동을 안내하는 fallback을 표시하세요.'],
  '17-3': ['비동기 실패 상태', 'Promise reject를 요청 흐름에서 사용자 오류로 전환', 'fetch의 실패를 Error Boundary가 자동 처리한다고 가정하지 않는다', '오류 처리 handler와 status 갱신을 찾는다', 'const request = { status: "error", message: "offline" };\nconsole.log(request.status);', ['error'], ['useEffect(() => {', '  fetchCourses().then(setCourses);', '}, []);'], 2, '2번 줄은 Promise reject 처리 경로를 제공하지 않아 실패가 사용자 error 상태로 바뀌지 않습니다. 요청 흐름에서 catch하고 실패 상태를 기록하세요.'],
  '17-4': ['요청 다시 시도', '오류 UI의 handler가 원래 실패 작업을 실행', 'button에 retry handler가 연결되었는지 확인한다', '재시도 후 요청 결과도 다시 판정한다', 'const request = { status: "error", retryLabel: "다시 요청" };\nconsole.log(request.retryLabel);', ['다시 요청'], ['function RequestError({ message, retry }) {', '  return <div role="alert"><p>{message}</p><button type="button">다시 요청</button></div>;', '}'], 2, '2번 줄의 button에는 재시도 handler가 연결되지 않았습니다. onClick에 retry를 전달하세요.'],
  '17-5': ['입력 오류와 렌더 오류', '필드 검증과 Error Boundary의 별도 복구 경로', '사용자가 수정할 수 있는 입력 실패를 throw로 만들지 않는다', '입력 검증이 렌더 오류 대신 필드 안내인지 확인한다', 'const email = "learner.example";\nconsole.log(email.includes("@"));', ['false'], ['function EmailField({ email, onEmailChange }) {', '  if (!email.includes("@")) throw new Error("잘못된 입력");', '  return <input type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />;', '}'], 2, '2번 줄은 수정 가능한 입력 오류를 렌더 예외로 던집니다. 오류는 필드 상태로 표현하고, controlled 입력은 onChange로 사용자가 값을 고칠 수 있게 하세요.'],
  '18-1': ['실측 후 최적화', 'Profiler callback으로 commit별 하위 트리 비용을 관찰', 'Profiler에 id와 onRender를 전달하는지 확인한다', '측정값은 실제 사용 동작에서 수집한다', 'const actualDuration = [12, 14, 13];\nconsole.log(Math.max(...actualDuration));', ['14'], ['function CourseTree({ children, onRender }) {', '  return <Profiler id="course-tree">{children}</Profiler>;', '}'], 2, '2번 줄은 Profiler에 필수 onRender callback을 전달하지 않습니다. 측정 경계에서 기록 처리 함수를 연결하세요.'],
  '18-2': ['계산 의존성', '수동 useMemo의 모든 반응형 의존성', 'callback이 courses와 query 두 값을 읽는지 확인한다', 'query 변경 때 오래된 결과가 남는지 추적한다', 'const courses = ["React", "Python", "Java"];\nconst query = "Python";\nconsole.log(courses.filter((course) => course.includes(query)).length);', ['1'], ['function CourseFilter({ courses, query }) {', '  const visible = useMemo(() => courses.filter((course) => course.title.includes(query)), [courses]);', '  return <CourseList courses={visible} />;', '}'], 2, '2번 줄은 계산이 읽는 query를 dependencies에서 빼 검색어가 바뀌어도 오래된 결과를 재사용할 수 있습니다. 수동 memo가 필요하다면 [courses, query]를 선언하세요.'],
  '18-3': ['함수 참조 안정성', '수동 useCallback callback의 정확한 dependency', 'save를 closure 안에서 읽는지 확인한다', 'Compiler와 측정된 memo 소비자 경계도 고려한다', 'const same = Object.is(() => 1, () => 1);\nconsole.log(same);', ['false'], ['function SaveAction({ save }) {', '  const onSave = useCallback(() => save(), []);', '  return <SaveButton onSave={onSave} />;', '}'], 2, '2번 줄은 save prop을 읽지만 dependency array에서 빠뜨립니다. 수동 useCallback이 필요하면 최신 save를 읽도록 [save]를 포함하세요.'],
  '18-4': ['Context 소비 범위', '변경 빈도와 측정 결과에 따른 Context 경계', '빈번히 바뀌는 입력 값과 안정 설정이 하나의 Context value에 섞였는지 확인한다', '분리 뒤 같은 사용자 상호작용을 다시 측정한다', 'const appSettings = { theme: "dark", typing: "React" };\nconsole.log(appSettings.theme);', ['dark'], ['import { createContext } from "react";', 'const AppContext = createContext({ theme: "light", typing: "" });', 'function App({ theme, typing }) {', '  return <AppContext value={{ theme, typing }}><Page /></AppContext>;', '}'], 4, '4번 줄은 theme과 매 입력마다 바뀌는 typing을 하나의 Context 값으로 전달합니다. Profiler로 불필요한 갱신을 확인했다면 책임과 변경 주기에 따라 분리하고 다시 측정하세요.'],
  '18-5': ['큰 목록 비용', '화면 렌더 구간 축소와 key 안정성', '전체 항목 대신 요청된 페이지 구간을 반환하는지 확인한다', '렌더 크기 개선과 키보드 이동을 함께 검증한다', 'const courses = ["React", "Python", "Java"];\nconsole.log(courses.slice(1, 2)[0]);', ['Python'], ['function CourseList({ courses }) {', '  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '}'], 2, '2번 줄은 실측 병목 여부를 고려하지 않고 전체 목록을 모두 렌더링합니다. 실제 큰 목록 병목이면 페이지 구간 계산이나 가상화를 검토하고 안정된 id key와 접근성 흐름을 유지하세요.'],
});

const foundationErrorVariants = {
  '1-4': [['function OpenPanel({ isOpen }) {', '  return isOpen ? null : <section>과정</section>;', '}'], 2, '2번 줄은 삼항식의 분기를 거꾸로 두어 닫힌 상태에서 section을 렌더링합니다. isOpen이 참일 때 section을 반환하고 거짓일 때 null을 반환해야 합니다.'],
  '1-5': [['function CourseList({ courses }) {', '  return courses.map((course, index) => <li key={index}>{course.title}</li>);', '}'], 2, '2번 줄의 index는 삽입·정렬 뒤 다른 항목을 가리킬 수 있습니다. 안정된 course.id를 key로 사용하세요.'],
  '2-4': [['function CourseMeta({ title, minutes }) {', '  return <p>{title}</p>;', '}'], 2, '2번 줄은 컴포넌트 계약에 있는 minutes를 표시하지 않습니다. title과 minutes를 함께 표현해야 합니다.'],
  '2-5': [['function Panel({ children }) {', '  return <section>{children()}</section>;', '}'], 2, '2번 줄은 일반 React node인 children을 함수로 호출합니다. 함수 children 계약이 없다면 `{children}`을 그대로 렌더링하세요.'],
  '3-4': [['function addTwice(count, setCount) {', '  setCount(count + 1);', '  setCount(count + 1);', '}'], [2, 3], '2번과 3번 줄은 같은 클릭 handler가 받은 count 스냅샷에서 같은 값으로 갱신합니다. 각각 함수형 updater를 넣어 큐의 직전 결과를 사용해야 합니다.'],
  '3-5': [['function DeleteButton({ remove, id }) {', '  function onDelete(event) {', '    remove(id);', '  }', '  return <button onClick={onDelete}>삭제</button>;', '}'], 3, '3번 줄에서 remove는 실행하지만 전파를 중단하지 않아 부모 카드 handler도 실행됩니다. 삭제 전 event.stopPropagation()을 호출하세요.'],
  '4-4': [['function markCourse(courses, id) {', '  return courses.map((course) => {', '    if (course.id === id) course.done = true;', '    return course;', '  });', '}'], 3, '3번 줄은 map에서 원래 state 항목 객체의 done을 직접 변경합니다. 일치한 항목만 전개 복사한 새 객체로 반환하세요.'],
  '4-5': [['function AddTwice({ count, setCount }) {', '  setCount(count + 1);', '  setCount(count + 1);', '  return count;', '}'], [2, 3], '2번과 3번 줄은 같은 handler의 count snapshot을 읽어 같은 다음 값을 예약합니다. 각 updater가 큐의 직전 값을 사용하도록 함수형 updater로 바꾸세요.'],
  '5-1': [['function TitleInput({ title, setTitle }) {', '  return <input value={title} />;', '}'], 2, '2번 줄은 value를 지정하지만 입력 변경을 state에 반영할 onChange가 없습니다. handler에서 event.target.value를 setter에 전달하세요.'],
  '5-4': [['function handleSubmit(event, title, save) {', '  save(title.trim());', '}'], 2, '2번 줄이 실행되기 전에 event.preventDefault()가 없어 브라우저가 form 기본 제출과 페이지 이동을 할 수 있습니다.'],
  '6-1': [['useEffect(() => {', '  const connection = connect(roomId);', '}, [roomId]);'], 2, '2번 줄은 외부 연결을 만들지만 cleanup을 반환하지 않습니다. roomId가 바뀌거나 컴포넌트가 사라질 때 disconnect하도록 정리 함수를 반환하세요.'],
  '6-2': [['function CompletedCourses({ courses }) {', '  const [visible, setVisible] = useState([]);', '  useEffect(() => setVisible(courses.filter((course) => course.done)), [courses]);', '  return <CourseList courses={visible} />;', '}'], [2, 3], '2–3번 줄은 courses에서 바로 계산 가능한 목록을 중복 state와 Effect로 복사합니다. 렌더링 중 filter로 파생값을 계산하세요.'],
  '6-4': [['useEffect(() => {', '  fetchCourses(query).then(setCourses);', '}, [query]);'], 2, '2번 줄은 query 변경 뒤 이전 fetch가 계속 진행되어 늦은 결과가 새 화면을 덮을 수 있습니다. AbortController signal을 전달하고 cleanup에서 abort하세요.'],
  '7-4': [['function CoursePage() {', '  const [query, setQuery] = useState("");', '  return <CourseList query={query} />;', '}', 'function CourseList({ query }) {', '  const [localQuery, setLocalQuery] = useState(query);', '  return <p>{localQuery}</p>;', '}'], 6, '6번 줄은 부모가 전달한 query를 별도 state로 복제해 이후 부모 검색어와 어긋날 수 있습니다. 목록은 prop을 직접 읽고, 편집 상태가 필요하다면 공통 소유와 저장 시점을 명시하세요.'],
  '8-4': [['function useSubscription(source, onChange) {', '  useEffect(() => {', '    const unsubscribe = source.subscribe(onChange);', '    return () => {};', '  }, [source, onChange]);', '  return null;', '}'], 4, '4번 줄의 cleanup이 비어 있어 Effect를 다시 실행하거나 화면을 닫아도 구독이 남습니다. 반환받은 unsubscribe를 cleanup 안에서 실제 호출하세요.'],
  '9-1': [['function RequestFlags() {', '  const [loading, setLoading] = useState(false);', '  const [error, setError] = useState(false);', '  return { loading, error };', '}'], [2, 3], '2–3번 줄은 독립 boolean으로 요청 진행과 실패를 각각 보관해 둘 다 true인 모순 상태를 허용합니다. idle·loading·success·error 중 하나를 status로 저장하세요.'],
  '9-2': [['async function loadCourses(query) {', '  const response = await fetchCourses(query);', '  setStatus("loading");', '  const items = await response.json();', '  setCourses(items);', '}'], 3, '3번 줄은 응답을 기다린 뒤에야 loading으로 바꿉니다. 요청을 시작하기 직전에 상태를 바꿔 대기 중인 화면을 먼저 표시하세요.'],
  '9-3': [['useEffect(() => {', '  const controller = new AbortController();', '  fetchCourses(query, { signal: controller.signal }).then(setCourses);', '  return () => {};', '}, [query]);'], 4, '4번 줄의 cleanup은 이전 요청의 controller를 abort하지 않습니다. query가 바뀌거나 화면이 사라질 때 controller.abort()를 호출해야 합니다.'],
  '9-4': [['function Courses({ status, courses }) {', '  if (status === "loading") return <p>불러오는 중</p>;', '  return <ul>{courses.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;', '}'], 3, '3번 줄은 error 상태를 분기하지 않아 실패 뒤 빈 목록으로 보일 수 있습니다. 오류 안내를 성공·빈 결과와 따로 렌더링하세요.'],
  '10-1': [['function CourseLink({ navigate }) {', '  return <div onClick={() => navigate("/tracks/react")}>React</div>;', '}'], 2, '2번 줄의 div는 주소 이동 링크의 기본 키보드 동작과 목적지 의미를 제공하지 않습니다. href가 있는 a 요소를 사용하세요.'],
  '10-2': [['function ExpandDetails({ open }) {', '  return <span onClick={open}>설명</span>;', '}'], 2, '2번 줄의 span은 버튼 역할과 키보드 동작이 없습니다. 화면 안 동작에는 button을 사용하세요.'],
  '10-3': [['function CoursePage({ course, pathname }) {', '  const headingRef = useRef(null);', '  useEffect(() => { headingRef.current?.scrollIntoView(); }, [pathname]);', '  return <h1 ref={headingRef} tabIndex={-1}>{course.title}</h1>;', '}'], 3, '3번 줄은 제목을 화면 안으로 스크롤할 뿐 키보드 포커스를 이동하지 않습니다. 라우트 변경 뒤 새 제목을 안내하려면 headingRef.current?.focus()를 호출하세요.'],
  '10-4': [['function CourseNav({ pathname }) {', '  return <nav>', '    <a href="/tracks/react" aria-current={pathname === "/tracks/python" ? "page" : undefined}>React</a>', '  </nav>;', '}'], 3, '3번 줄은 React 링크의 href와 다른 Python 경로를 현재 페이지로 비교합니다. aria-current="page"는 현재 링크의 목적지와 일치할 때만 설정하세요.'],
  '10-5': [['function MissingCoursePage() {', '  return <main>', '    <h1>과정을 찾을 수 없습니다</h1>', '    <a href="/tracks/missing">과정 목록</a>', '  </main>;', '}'], 4, '4번 줄은 과정 목록이라는 이름과 달리 다시 존재하지 않는 경로로 이동합니다. 유효한 /tracks 경로로 연결하세요.'],
  '11-1': [['test("저장", async () => {', '  render(<SaveAction save={save} />);', '  await user.click(screen.getByTestId("save"));', '  expect(save).toHaveBeenCalled();', '});'], 3, '3번 줄은 구현 전용 test id만 확인합니다. 사용자가 찾는 버튼 역할과 이름으로 상호작용을 검증하세요.'],
  '11-2': [['function SaveAction({ save }) {', '  return <span onClick={save}>저장</span>;', '}'], 2, '2번 줄은 마우스 클릭만 가능한 span입니다. button 의미를 사용하면 키보드와 접근성 도구에서 동작을 사용할 수 있습니다.'],
  '11-3': [['function CourseFilter({ courses, query }) {', '  const visible = useMemo(() => filterCourses(courses, query), [courses]);', '  return <CourseList courses={visible} />;', '}'], 2, '2번 줄의 계산은 query도 읽지만 의존성 배열에서 빠뜨렸습니다. 검색어가 바뀌면 이전 필터 결과가 남을 수 있습니다.'],
  '11-2': [['test("저장 결과", async () => {', '  render(<SaveAction save={save} />);', '  await user.click(screen.getByRole("button", { name: "저장" }));', '  expect(save).toHaveBeenCalled();', '});'], 4, '4번 줄은 내부 save 호출만 확인하고 사용자에게 보여야 할 성공 문구를 확인하지 않습니다. 저장 뒤 화면에 나타나는 안내를 검증하세요.'],
  '11-3': [['function CourseCount({ courses }) {', '  // profile: 0.02ms; no memoized consumer', '  const label = useMemo(() => `${courses.length}개`, [courses.length]);', '  return <p>{label}</p>;', '}'], 3, '3번 줄은 0.02ms로 측정된 가벼운 계산을 참조 안정성 소비자도 없이 메모이제이션합니다. 이 조건에서는 직접 계산하는 편이 단순합니다.'],
  '11-4': [['function CourseCount({ courses }) {', '  const label = useMemo(() => `${courses.length}개 과정`, [courses.length]);', '  return <p>{label}</p>;', '}'], 2, '2번 줄은 측정 결과 가벼운 문자열 결합을 캐시합니다. 유의미한 비용이나 참조 안정성 요구가 없다면 직접 계산하세요.'],
  '11-5': [['function SaveIconButton({ save }) {', '  return <button type="button" onClick={save}><SaveIcon aria-hidden="true" /></button>;', '}'], 2, '2번 줄의 버튼은 장식 SVG를 숨겼지만 버튼 자체에 보이는 이름이나 aria-label이 없습니다. accessible name을 제공하세요.'],
  '12-1': [['function ProgressActions({ toggle }) {', '  return <button onClick={toggle}>최근 답안</button>;', '}'], 2, '2번 줄은 펼침 상태를 화면이나 aria-expanded에 반영하지 않습니다. 상태를 연결해 사용자와 보조 기술에 열림 여부를 제공하세요.'],
  '12-2': [['function RecentAnswers({ expanded, toggle }) {', '  return <a href="#" onClick={toggle}>최근 답안</a>;', '}'], 2, '2번 줄은 화면 상태 변경을 주소 이동 요소로 표현합니다. href 링크 대신 aria-expanded를 상태와 연결한 button을 사용하세요.'],
  '12-3': [['function RecentAnswers({ answers }) {', '  if (answers.length === 0) return null;', '  return <ul>{answers.map((answer) => <li key={answer.id}>{answer.text}</li>)}</ul>;', '}'], 2, '2번 줄은 빈 기록에서 아무 안내도 렌더링하지 않습니다. 답안 없음 문구와 다음 학습 경로를 제공하세요.'],
  '12-4': [['function SaveStatus({ saveState }) {', '  if (saveState === "error") return <p>저장되었습니다.</p>;', '  return null;', '}'], 2, '2번 줄은 error 상태를 저장 성공으로 안내해 사용자가 답안을 잃었다는 사실을 알지 못하게 합니다. role="alert"로 실패를 분명히 알려 주세요.'],
  '12-5': [['function ResumeLink({ lesson }) {', '  return <a href={lesson.href}>이어 학습</a>;', '}'], 2, '2번 줄은 lesson이 없거나 href가 비어 있어도 잘못된 링크를 만듭니다. 유효한 주소를 확인하고 없으면 과정 선택으로 안내하세요.'],
};

const phaseFor = (week) => phases.find((phase) => week >= phase.startWeek && week <= phase.endWeek).id;
const difficultyFor = (week) => (week <= 4 ? '입문' : week <= 8 ? '기초' : week <= 16 ? '중급' : week <= 21 ? '고급' : '실전');

const reactConceptHints = {
  '19-1': 'label의 htmlFor와 input의 id가 같은 식별자를 가리키는지 대조하세요.',
  '19-2': 'value가 state에서 오면 입력 이벤트의 새 값을 어디에 반영해야 하는지 보세요.',
  '19-3': '입력 요소가 오류 문구의 id를 설명 대상으로 참조하는지 확인하세요.',
  '19-4': '오류가 여러 개일 때 요약 안내와 키보드 초점이 어디로 가는지 살펴보세요.',
  '19-5': 'Enter 제출과 버튼 의미를 제공하는 기본 form 요소를 떠올리세요.',
  '20-1': '외부 문자열을 JSX 자식으로 넣는 방식과 HTML로 해석시키는 방식을 구분하세요.',
  '20-2': '주소의 scheme과 목적지가 제품의 허용 경로에 포함되는지 확인하세요.',
  '20-3': '이미지 주소의 HTTPS origin 허용 여부와 로드 실패 뒤 화면을 함께 살펴보세요.',
  '20-4': 'HTML이 꼭 필요하다면 삽입 전에 어떤 내용만 통과시킬지 정해야 해요.',
  '20-5': '신뢰하지 않는 문자열을 브라우저가 HTML로 해석하는 코드가 있는지 찾아보세요.',
  '21-1': '주소에서 얻은 문자열이 허용된 ID이고 실제 과정에도 존재하는지 확인하세요.',
  '21-2': '잘못된 percent 인코딩은 디코딩에서 예외가 날 수 있으므로 안전한 실패 경로를 찾아보세요.',
  '21-3': '이동 목적지는 링크로, 현재 화면 안 동작은 버튼으로 표현하는지 구분하세요.',
  '21-4': '주소가 유효해도 요청이 실패한 상태를 빈 성공 화면과 따로 알려야 해요.',
  '21-5': '기본 링크 이동이나 라우터 링크가 브라우저 방문 기록을 유지하는지 확인하세요.',
  '22-1': '객체를 저장소에 넣기 전 문자열로 직렬화하는 함수를 찾으세요.',
  '22-2': '파싱 예외를 처리하고 기존 유효 기록을 지킬 복구 방법을 살펴보세요.',
  '22-3': '읽어 온 문자열을 파싱한 뒤 구조 검증을 통과한 값만 초기 상태에 쓰세요.',
  '22-4': '저장소 쓰기가 실패할 수 있으니 메모리의 변경과 영구 저장 성공을 구분하세요.',
  '22-5': '기기 안 학습 진도에 꼭 필요하지 않은 인증 정보나 민감한 값을 넣지 마세요.',
  '23-1': '화면을 나중에 불러올 때 React의 지연 import 조합을 확인하세요.',
  '23-2': '지연 import가 완료되기 전 사용자에게 보여 줄 대기 UI가 있는지 살펴보세요.',
  '23-3': '불러오는 중과 모듈을 불러오지 못한 뒤의 상태를 구분하세요.',
  '23-4': '첫 화면부터 쓰지 않고 특정 흐름에서만 필요한 화면인지 판단하세요.',
  '24-1': '현재 상태와 action을 받아 다음 상태를 반환하는 순수한 위치를 찾으세요.',
  '24-2': '처리 규칙이 없는 action에서 새로운 상태를 만들지 않고 기존 상태를 유지하는지 보세요.',
  '24-3': '서로 모순되는 boolean 조합을 하나의 상태 값으로 줄이는 방법을 떠올리세요.',
  '24-4': '현재 상태에서 다음 상태로 이동할 수 있는지 전이 규칙표로 검사하세요.',
  '24-5': '각 상태와 action 조합에 대해 reducer가 반환하는 다음 상태를 확인하세요.',
  '25-1': '화면 진입부터 답 제출, 피드백, 저장까지 학습자의 전체 순서를 따라가세요.',
  '25-2': '목록이 비었을 때 이유와 유효한 다음 행동을 함께 안내하는지 보세요.',
  '25-3': '저장 실패가 작성 중인 답안을 지우지 않고 재시도를 제공하는지 확인하세요.',
  '26-1': '저장된 단원 ID가 현재 목록에 없을 때 유효한 시작 위치를 안내하세요.',
  '26-2': 'JSON 파싱 실패 뒤 오류 안내와 안전한 초기 학습 경로가 있는지 살펴보세요.',
  '26-3': '저장 완료 표시가 실제 저장 성공 결과를 확인한 뒤 나오는지 보세요.',
  '26-4': '목적지를 알 수 있는 링크 이름과 키보드로 이동할 수 있는 기본 요소를 확인하세요.',
  '26-5': '복원 뒤 최근 단원, 완료 기록, 작성 중 답안이 이어지는지 확인하세요.',
};

const reactRepairGuidance = {
  '8-4': {
    hint: 'subscribe가 반환하는 정리 함수를 Effect에서 반환하고, source와 onChange가 바뀔 때 다시 구독하는지 확인하세요.',
    explanation: '구독을 시작한 Effect는 같은 구독의 해제 함수를 cleanup으로 반환해야 합니다. source와 onChange를 의존성 목록에 넣어 둘 중 하나가 바뀌면 다시 구독합니다.',
  },
  '13-5': {
    hint: '요청 상태 값 중 성공과 실패를 나타내는 값이 무엇인지 확인해 종료 상태를 판정하세요.',
    explanation: '요청이 성공한 상태와 실패한 상태는 모두 종료됐지만, 진행 중이거나 시작 전인 상태는 아직 완료되지 않았습니다.',
  },
  '19-5': {
    hint: '안내 문구에 id를 지정하고 `role="alert"`로 오류 안내임을 알리는지 확인하세요.',
    explanation: '안내 요소에 전달받은 id를 지정하고 `role="alert"`를 붙이면 연결할 수 있고 오류 안내로 전달할 수 있습니다.',
  },
  '20-4': {
    hint: '입력 문자열을 HTML로 해석하는 속성을 제거하고 JSX 텍스트 자리에 렌더링하세요.',
    explanation: 'JSX의 `{comment}`는 문자열을 텍스트로 렌더링합니다. `dangerouslySetInnerHTML`은 입력을 HTML로 해석하므로 여기서는 사용하지 않습니다.',
  },
  '22-5': {
    hint: 'raw가 없는 경우를 먼저 처리하고 JSON.parse가 실패하는 경우에는 catch에서 기본 객체를 반환하세요.',
    explanation: '저장값이 없거나 JSON 문법이 손상된 경우에도 파싱 오류를 화면까지 전파하지 않고 기본 진도 객체를 반환합니다.',
  },
};

const advancedDayObjectives = {
  13: [
    'loading·success·error를 하나의 status 값으로 나눠요.',
    '각 action에 맞는 다음 요청 상태를 reducer가 반환하게 해요.',
    '요청 실패와 성공한 빈 목록을 따로 보여 줘요.',
    '현재 요청과 응답의 ID가 다르면 오래된 결과를 반영하지 않아요.',
    '요청 상태마다 가능한 전이와 종료 시점을 구분해요.',
  ],
  14: [
    '부모가 태그 사이에 넣은 화면 조각을 children으로 받아요.',
    '컴포넌트가 필요한 값을 이름이 분명한 props로 받아요.',
    '레이아웃에 전달된 header와 children을 모두 표시해요.',
    '목록을 다시 정렬해도 항목의 고유 ID로 같은 요소를 찾게 해요.',
    '화면 이동은 링크로, 화면 안 동작은 button으로 표현해요.',
  ],
  15: [
    '여러 단계의 하위 화면이 함께 쓰는 값에 Context를 고려해요.',
    'Provider가 없을 때 쓰이는 Context 기본값을 정해요.',
    'useContext로 가장 가까운 Provider의 값을 읽어요.',
    '값을 공유해야 하는 화면만 Provider 범위에 넣어요.',
    'Provider 값이 바뀌면 그 값을 읽는 화면도 새 값을 반영해요.',
  ],
  16: [
    'startTransition으로 표시한 상태 변경을 ViewTransition에 연결해요.',
    '화면 전환 애니메이션과 저장 성공 여부를 따로 확인해요.',
    '목록이 바뀌어도 안정된 key로 같은 항목을 식별해요.',
    '화면을 옮긴 뒤에도 링크·버튼과 키보드 조작을 유지해요.',
    'React 19.3의 ViewTransition 지원 범위를 확인해요.',
  ],
  17: [
    'Error Boundary가 처리하는 렌더 오류와 다른 실패를 구분해요.',
    '오류 화면에서 원인과 다시 시도할 방법을 알려 줘요.',
    '요청 실패는 요청을 실행한 흐름에서 직접 처리해요.',
    '다시 시도 버튼이 실패한 요청을 실제로 다시 실행하게 해요.',
    '입력 오류는 렌더 오류와 분리해 입력 가까이에 알려 줘요.',
  ],
  18: [
    'Profiler로 실제 병목을 확인한 뒤 최적화를 검토해요.',
    'useMemo 계산이 읽는 모든 값을 의존성에 넣어요.',
    'useCallback의 의존성을 맞추고 필요한 경우에만 사용해요.',
    'Context를 나눠 불필요하게 많은 화면이 다시 그려지지 않게 해요.',
    '목록이 느려지는 조건을 측정하고 필요한 항목만 표시해요.',
  ],
  19: [
    'label의 htmlFor와 입력의 id를 연결해요.',
    'input의 value와 onChange를 함께 관리해요.',
    '오류 문구를 입력에 연결하고 잘못된 값을 알려 줘요.',
    '제출이 실패하면 첫 오류 입력으로 초점을 옮겨요.',
    '폼 제출은 form과 submit 동작으로 처리해요.',
  ],
  20: [
    '사용자가 입력한 문자열을 HTML이 아닌 텍스트로 보여 줘요.',
    '주소에 넣기 전 링크의 형식과 허용된 경로를 확인해요.',
    '이미지 주소의 HTTPS 여부와 허용된 출처를 검사해요.',
    '외부 HTML 삽입이 꼭 필요한지와 정화 경계를 확인해요.',
    '신뢰하지 않는 입력이 위험한 HTML로 실행되지 않는지 살펴봐요.',
  ],
  21: [
    '주소에서 받은 ID를 데이터 조회 전에 검사해요.',
    '잘못된 percent 인코딩으로 생기는 디코딩 오류를 처리해요.',
    '이동 목적지는 링크로, 현재 화면의 동작은 버튼으로 표현해요.',
    '요청 실패와 성공한 빈 결과를 다른 화면 상태로 보여 줘요.',
    '라우터 이동 뒤에도 브라우저 방문 기록을 이어 가요.',
  ],
  22: [
    '객체를 localStorage에 넣기 전에 JSON 문자열로 바꿔요.',
    'JSON 파싱 오류를 처리하고 복구할 방법을 안내해요.',
    '저장한 값을 읽은 뒤 구조를 확인하고 상태로 복원해요.',
    '저장 실패를 알리고 화면의 변경 내용은 보존해요.',
    '브라우저 진도에 비밀번호나 인증 비밀값을 저장하지 않아요.',
  ],
  23: [
    '화면이 필요할 때 lazy와 동적 import로 불러와요.',
    '화면 코드를 불러오는 동안 Suspense fallback을 보여 줘요.',
    '불러오는 중과 모듈을 가져오지 못한 상태를 구분해요.',
    '독립적으로 늦게 필요한 화면을 기준으로 코드를 나눠요.',
    '화면을 미리 불러올 때 접속 가능성과 데이터 절약을 함께 봐요.',
  ],
  24: [
    'reducer가 현재 상태와 action으로 다음 상태를 정하게 해요.',
    '알 수 없는 action에는 기존 상태를 그대로 돌려줘요.',
    '서로 모순되는 여러 boolean을 하나의 status로 줄여요.',
    '현재 상태에서 허용된 다음 상태로만 이동하게 해요.',
    '상태와 action 조합마다 reducer 결과를 테스트해요.',
  ],
  25: [
    '수업 열기부터 답 제출·피드백·진도 저장까지 이어지는지 확인해요.',
    '기록이 없을 때 이유와 다음에 할 일을 함께 알려 줘요.',
    '저장 실패 뒤에도 답안을 남기고 다시 시도할 수 있게 해요.',
    '키보드로 모든 조작을 할 수 있고 이름도 알 수 있게 해요.',
    '정상·빈 값·실패 흐름에 필요한 작은 기능만 묶어 만들어요.',
  ],
  26: [
    '저장한 단원 ID가 현재 과정에 있는지 확인한 뒤 이어 가요.',
    '손상된 기록을 읽지 못해도 안전한 시작 화면을 보여 줘요.',
    '저장 함수가 실패하지 않고 끝난 뒤에만 완료 메시지를 표시해요.',
    '이어 학습 링크에 목적지와 알아보기 쉬운 이름을 넣어요.',
    '기록을 복원한 뒤 학습 위치·완료 상태·작성 중 답을 확인해요.',
  ],
};

const advancedWeekObjectives = {
  13: 'loading·success·error가 서로 모순되지 않도록 화면 상태를 표현해요.',
  14: 'children과 필요한 props를 조합해 다시 쓸 수 있는 레이아웃을 만들어요.',
  15: 'Context를 쓸 범위와 값의 변경 흐름을 정해요.',
  16: 'ViewTransition이 화면에 미치는 효과와 지원 범위를 확인해요.',
  17: '화면을 그리다 생긴 오류와 요청·입력 오류를 나눠 처리해요.',
  18: '측정 결과를 바탕으로 꼭 필요한 렌더링만 최적화해요.',
  19: '폼의 이름·오류 안내·초점 이동을 키보드와 함께 점검해요.',
  20: '사용자 입력을 안전한 텍스트로 보여 주고 외부 주소를 확인해요.',
  21: '주소 값과 데이터 요청 결과를 각각 검증하고 안내해요.',
  22: '브라우저에 진도를 저장하고 손상되거나 저장할 수 없는 경우를 처리해요.',
  23: '필요한 화면만 나눠 불러오고 대기·실패 상태를 보여 줘요.',
  24: '상태와 action에 따라 가능한 전이를 정하고 테스트해요.',
  25: '학습 기록 화면의 정상·빈·실패 흐름을 작게 묶어 점검해요.',
  26: '저장한 진도를 확인해 안전하게 이어서 학습할 수 있는지 살펴봐요.',
};

const reactSpecificChoiceReasons = {
  1: {
    'label htmlFor와 input id가 일치한다': 'htmlFor와 id가 같은 값을 가리키면 보이는 label이 입력과 연결돼요.',
    'input의 name을 label text로 둔다': 'name은 폼을 보낼 때 쓰는 필드 이름이에요. label과 입력은 htmlFor와 id로 연결해야 해요.',
    'placeholder만 설정한다': 'placeholder는 입력 칸 안에 잠깐 보이는 안내라 label을 대신하거나 입력과 연결되지 않아요.',
  },
  2: {
    'onChange에서 새 값을 상태로 반영한다': '제어 입력의 value는 React 상태에서 오므로 onChange에서 새 값을 상태에 넣어야 입력이 갱신돼요.',
    'onBlur에서 DOM을 직접 수정한다': 'DOM만 바꾸면 React 상태의 value는 그대로예요. 다음 렌더에서 기존 값이 다시 표시될 수 있어요.',
    'value 속성을 제거하고 defaultValue만 쓴다': 'defaultValue는 처음 값만 정하는 비제어 입력이에요. 현재 value를 상태로 관리하는 제어 입력의 갱신 방법이 아니에요.',
  },
  3: {
    'aria-hidden': 'aria-hidden은 요소를 보조 기술의 읽기 흐름에서 제외하므로 오류 설명을 input에 전달하지 못해요.',
    'aria-describedby': 'aria-describedby에 오류 문구의 id를 연결하면 보조 기술이 그 설명을 input과 함께 읽을 수 있어요.',
    'role="presentation"': 'presentation은 요소의 의미를 보조 기술에 전달하지 않으므로 입력 설명을 연결하는 역할을 하지 않아요.',
  },
  4: {
    '요약으로 포커스를 옮기거나 첫 오류에 초점을 둔다': '오류가 난 위치로 초점을 옮기면 키보드 사용자가 바로 수정할 수 있어요.',
    '오류 텍스트를 숨긴다': '오류를 숨기면 사용자가 제출이 왜 막혔는지 알기 어려워요.',
    '포커스를 문서 맨 위로 무조건 초기화한다': '문서 맨 위로 보내면 실제 오류 위치를 찾으려 다시 이동해야 해요.',
  },
  5: {
    '각 input에 임의의 div 클릭만 연결': 'div 클릭만으로는 폼 제출 의미와 키보드 제출 동작을 함께 제공하지 못해요.',
    'form과 submit 버튼': 'form의 submit 동작은 버튼 클릭과 키보드 제출을 같은 흐름으로 처리해요.',
    '본문 전체의 onKeyDown': '본문 전체의 키 입력을 가로채면 입력과 버튼의 기본 키보드 동작을 방해할 수 있어요.',
  },
  20: {
    1: {
      '문자열을 일반 React 자식으로 렌더링한다': 'React 자식 문자열은 HTML로 해석되지 않아 태그 모양의 댓글도 글자로 보여요.',
      'dangerouslySetInnerHTML에 그대로 넣는다': '검증하지 않은 HTML을 그대로 해석하면 댓글에 포함된 스크립트나 위험한 요소가 실행될 수 있어요.',
      'eval로 문자열을 실행한다': 'eval은 문자열을 코드로 실행해 사용자 댓글의 내용을 실행할 위험이 있어요.',
    },
    2: {
      '허용 scheme과 내부 경로 정책을 검증한다': '주소가 허용된 방식과 목적지 규칙에 맞는지 확인한 뒤 링크로 써야 해요.',
      '모든 문자열을 href로 바로 전달한다': '입력에는 의도하지 않은 외부 주소나 javascript: 같은 위험한 scheme이 들어갈 수 있어요.',
      '입력값을 대문자로만 바꾼다': '대소문자를 바꿔도 주소의 scheme이나 목적지가 안전해지는 것은 아니에요.',
    },
    3: {
      '허용한 HTTPS origin과 자산 경로, 실패 시 대체 이미지를 확인한다': '신뢰할 출처와 이미지 경로를 제한하고 요청 실패 때 보여 줄 대체 화면도 준비해요.',
      'React가 모든 외부 URL을 자동 검증한다고 가정한다': 'React는 외부 이미지 주소의 출처나 안전한 허용 목록을 대신 검증하지 않아요.',
      '모든 값을 HTML로 해석한다': '이미지 주소 검증과 HTML 해석은 다른 문제예요. HTML로 바꾸면 오히려 위험이 커져요.',
    },
    4: {
      '검증된 sanitizer와 제한된 허용 요소를 사용한다': '필요한 태그만 허용하는 검증 도구로 정화한 뒤 제한된 경로에서만 표시해요.',
      '정규식 하나로 모든 HTML을 안전하게 만든다': 'HTML은 중첩과 인코딩 등 문법이 복잡해 정규식 하나만으로 모든 위험을 막기 어려워요.',
      '입력을 그대로 dangerouslySetInnerHTML에 전달한다': '정화하지 않은 외부 HTML을 그대로 넣으면 브라우저가 위험한 마크업을 해석할 수 있어요.',
    },
    5: {
      '신뢰하지 않는 값의 HTML 해석 경로': '외부 값을 실제 HTML로 해석하는 지점을 우선 찾아 검증·정화 여부를 확인해요.',
      '정적 텍스트 제목': '고정된 제목은 신뢰하지 않는 값을 HTML로 바꾸지 않으므로 우선 위험 경로가 아니에요.',
      '불변 배열 복사': '배열 복사 자체는 문자열을 HTML로 해석하지 않으므로 이 보안 검토의 핵심이 아니에요.',
    },
  },
  21: {
    1: {
      '허용된 식별자와 실제 단원 존재 여부': '주소값이 허용 목록에 있고 그에 해당하는 단원이 실제로 있는지 모두 확인해요.',
      '값이 문자열이면 어떤 경로든 허용': '문자열이라는 형식만으로 경로가 유효하거나 허용됐다고 판단할 수 없어요.',
      '주소 길이만 확인': '길이가 짧아도 존재하지 않거나 허용되지 않은 단원 ID일 수 있어요.',
    },
    2: {
      'decodeURIComponent를 try/catch하고 안전한 경로로 보낸다': '잘못된 퍼센트 인코딩은 예외를 만들 수 있어 처리하고 복구 경로를 제공해야 해요.',
      '문자열을 다시 인코딩해 무조건 연다': '재인코딩은 원래 입력의 유효성이나 접근 권한을 확인해 주지 않아요.',
      '화면 렌더 중 파싱 오류를 방치한다': '렌더 중 예외가 나면 화면 전체가 깨질 수 있어 경로 경계에서 처리해야 해요.',
    },
    3: {
      'href가 있는 a': 'a 요소는 목적지를 나타내고 브라우저 방문 기록과 키보드 이동을 지원해요.',
      'onClick만 붙인 div': 'div는 링크 의미나 기본 키보드 동작이 없어 목적지 이동에 적합하지 않아요.',
      '초점 없는 span': 'span은 링크 역할이나 키보드 초점을 제공하지 않아 이동 요소가 될 수 없어요.',
    },
    4: {
      '오류 안내와 재시도 선택을 제공한다': '주소는 맞지만 요청이 실패했으므로 실패 사실과 다시 시도할 방법을 보여 줘요.',
      '없는 단원 화면으로 바꿔치기한다': '요청 실패는 단원이 실제로 없는 경우와 다르므로 두 상태를 구분해야 해요.',
      '무한 loading으로 유지한다': '실패 뒤 계속 기다리게 두면 사용자는 결과나 복구 방법을 알 수 없어요.',
    },
    5: {
      '기본 anchor navigation 또는 라우터 링크를 쓴다': '링크 동작을 사용하면 브라우저 뒤로·앞으로 기록이 자연스럽게 유지돼요.',
      '클릭 가능한 문단으로 대체한다': '문단은 링크 의미와 키보드로 이동하는 기본 동작을 제공하지 않아요.',
      'location을 매번 강제로 새 창에 연다': '새 창을 강제로 열면 현재 탭의 자연스러운 방문 기록 흐름을 끊을 수 있어요.',
    },
  },
  22: {
    1: {
      'JSON.stringify(progress)': 'JSON.stringify는 객체를 브라우저 저장소에 넣을 수 있는 문자열로 바꿔요.',
      'JSON.parse(progress)': 'JSON.parse는 JSON 문자열을 객체로 읽는 함수라 객체를 문자열로 저장할 때 쓰지 않아요.',
      'String(progress)': '일반 String 변환은 객체 내용을 JSON 구조로 보존하지 않고 보통 [object Object]가 돼요.',
    },
    2: {
      '파싱 예외를 잡고 기존 데이터를 보존한 안전 기본값 제공': '손상된 기록을 구분해 알리고 기존 백업을 덮어쓰지 않는 복구 방법을 제공해요.',
      '파싱 오류를 성공으로 간주': 'JSON.parse가 실패했는데 성공처럼 다루면 기록을 복원하지 못한 사실이 숨겨져요.',
      '앱 초기화 시 무조건 새 값으로 덮기': '기존 기록을 먼저 살피지 않고 덮으면 복구할 수 있는 학습 내용도 사라질 수 있어요.',
    },
    3: {
      '검증을 통과한 저장 데이터만 사용한다': '파싱된 값의 버전과 필수 필드·자료형을 확인한 뒤 화면 상태에 넣어야 해요.',
      '파싱 결과의 모양을 확인하지 않고 화면에 전달한다': '잘못된 구조의 값은 화면 오류를 만들 수 있으므로 사용 전 검증이 필요해요.',
      'Hook 밖에서 조건부 Hook을 호출한다': 'Hook 호출 순서는 렌더마다 같아야 하므로 조건에 따라 호출 위치를 바꾸면 안 돼요.',
    },
    4: {
      '실패를 알리고 현재 메모리 상태와 구분한다': '저장 실패를 알려야 화면에 남은 변경과 브라우저에 기록된 내용을 구별할 수 있어요.',
      '실패한 데이터를 조용히 버린다': '조용히 버리면 사용자는 답안이나 진도가 사라진 이유를 알 수 없어요.',
      '저장이 완료됐다고 표시한다': '쓰기 실패 뒤 성공으로 표시하면 사용자가 기록이 보존됐다고 잘못 믿게 돼요.',
    },
    5: {
      '학습 위치·답안 요약 등 민감하지 않은 값': '계정이 없는 학습 기록에는 다시 이어가는 데 필요한 최소한의 비민감 정보만 둬요.',
      '비밀번호나 인증 비밀값': '브라우저 저장소는 스크립트에서 읽힐 수 있으므로 비밀번호나 토큰을 두면 안 돼요.',
      '결제 카드 정보': '결제 정보는 학습 진도에 필요하지 않고 민감하므로 브라우저 진도에 저장하지 않아요.',
    },
  },
  23: {
    1: {
      'lazy와 동적 import': 'React.lazy와 동적 import는 컴포넌트 코드를 필요할 때 불러오도록 연결해요.',
      'useMemo와 JSON.parse': 'useMemo는 계산값을 재사용하고 JSON.parse는 문자열을 읽으므로 코드 분할 API가 아니에요.',
      'createContext와 setTimeout': 'Context는 값을 공유하고 setTimeout은 시간을 예약하므로 화면 코드를 나누지 않아요.',
    },
    2: {
      'Suspense fallback': '분할된 컴포넌트가 준비되기 전 Suspense가 보여 줄 대기 화면이에요.',
      '빈 컴포넌트만': '빈 화면만 보이면 사용자가 화면이 불러와지는 중인지 알기 어려워요.',
      '영구 오류 문구': '불러오는 동안에는 오류가 확정되지 않았으므로 대기 화면과 오류 화면을 구분해야 해요.',
    },
    3: {
      '오류 상태를 처리하는 Error Boundary': '동적 import가 거절되면 Error Boundary 등 오류 경계에서 실패를 알려야 해요.',
      '성공한 화면처럼 빈 요소 반환': '빈 요소는 로드 실패를 숨겨 사용자가 문제와 복구 방법을 알 수 없게 해요.',
      'Suspense의 loading 상태만 영원히 유지': 'Suspense는 대기 UI를 보여 주며 실패 원인을 처리하거나 재시도하지는 않아요.',
    },
    4: {
      '독립적으로 늦게 필요한 화면 흐름': '코드 분할은 사용자가 나중에 여는 독립 화면처럼 실제로 지연할 가치가 있는 경계에 적용해요.',
      '모든 작은 아이콘 하나씩': '작은 아이콘까지 나누면 요청과 관리 경계만 늘고 화면 단위 지연 이점이 작아요.',
      '컴포넌트 이름의 길이': '이름 길이는 화면이 언제 필요하고 전송량이 얼마인지 알려 주지 않아요.',
    },
    5: {
      '다음 화면 진입 가능성과 전송 비용을 보고 필요한 경우만 요청한다': '예상되는 다음 이동과 추가 전송량을 함께 보고 미리 불러올 범위를 정해요.',
      '첫 화면에서 모든 지연 화면을 미리 내려받는다': '모든 화면 코드를 처음에 받으면 사용하지 않을 코드까지 첫 화면 전송에 더해져요.',
      '렌더링마다 같은 화면 코드를 다시 요청한다': '동적 import 모듈은 캐시될 수 있어 렌더 횟수로 요청을 가정하지 말고, 실제 진입 시점과 비용을 기준으로 정해야 해요.',
    },
  },
  24: {
    1: {
      'reducer의 명시적 전이 규칙': 'reducer가 현재 상태와 action을 받아 허용된 다음 상태를 한곳에서 정해요.',
      '각 버튼에서 state 객체 직접 변경': '객체를 직접 바꾸면 변경 추적과 예측 가능한 상태 갱신을 해치기 쉬워요.',
      '렌더 중 임의 전역 변수 변경': '렌더 중 전역 값을 바꾸면 컴포넌트 상태 전이와 화면 결과가 분리돼요.',
    },
    2: {
      '기존 state를 그대로 반환한다': '모르는 action은 상태를 바꾸지 않고 기존 값을 돌려주는 것이 안전한 기본값이에요.',
      '무조건 성공 상태로 바꾼다': '알 수 없는 요청을 성공으로 바꾸면 근거 없는 상태 전이가 생겨요.',
      'state를 undefined로 반환한다': 'undefined는 이후 화면 코드가 예상하지 못한 오류를 만들 수 있어요.',
    },
    3: {
      '하나의 status union 값': 'idle·loading·success·error 중 하나만 선택하면 동시에 참인 상태 조합을 막을 수 있어요.',
      '서로 독립인 boolean 세 개': 'boolean을 여러 개 두면 loading과 error가 동시에 참인 불가능한 조합이 생길 수 있어요.',
      '화면 텍스트에서 상태 추측': '문구를 읽어 상태를 판단하면 표시 언어가 바뀔 때 로직도 흔들려요.',
    },
    4: {
      '허용된 from-to 전이 표를 검사한다': '현재 상태에서 다음 상태로 가는 규칙을 표로 두면 금지된 전이를 막을 수 있어요.',
      '모든 action을 허용한다': '모든 이동을 열어두면 error에서 success처럼 허용되지 않은 전이를 막지 못해요.',
      '화면 문구만 바꾼다': '문구만 바꾸면 내부 상태가 바뀌지 않아 화면과 실제 동작이 어긋날 수 있어요.',
    },
    5: {
      '각 현재 상태와 action의 다음 상태': '상태 전이 함수에 입력을 주고 다음 상태가 규칙과 맞는지 직접 검증해요.',
      'CSS 클래스의 개수': 'CSS 클래스 수는 상태 전이의 허용·금지 규칙을 확인하지 못해요.',
      '컴포넌트 함수 이름만': '이름만 확인해서는 reducer가 실제로 어떤 다음 상태를 반환하는지 알 수 없어요.',
    },
  },
  25: {
    1: {
      '단원 열기·답 제출·정답 피드백·기록 갱신': '사용자가 실제로 지나가는 열기부터 답안 저장까지 흐름을 처음부터 확인해요.',
      '페이지 새로고침만 반복': '새로고침만으로는 답 제출과 결과 안내, 진도 갱신이 제대로 이어지는지 알 수 없어요.',
      '색상 토큰만 확인': '색만 확인해서는 화면의 주요 동작이나 오류 복구가 끝까지 이어지는지 검증할 수 없어요.',
    },
    2: {
      '비어 있는 이유와 과정 선택 방법을 안내한다': '문항이 없는 이유와 다른 과정을 고르는 다음 행동을 안내해요.',
      '오류 없이 빈 흰 화면': '빈 화면만 보이면 콘텐츠가 없는지 로딩에 실패했는지 알기 어려워요.',
      '계속 도는 spinner': '목록이 실제로 비었는데 spinner를 계속 보여 주면 대기 상태에서 벗어날 수 없어요.',
    },
    3: {
      '작성한 답안 초안과 재시도 경로': '저장 실패 중에도 작성한 답을 유지하고 다시 저장할 방법을 제공해야 해요.',
      '답안 텍스트와 오류 정보 모두': '오류가 나도 초안은 보존하고 실패 원인을 알려야 하므로 두 정보를 모두 지우면 안 돼요.',
      '기록을 성공했다고 표시': '저장이 실패했는데 성공으로 표시하면 학습자가 기록을 잃었다는 사실을 늦게 알게 돼요.',
    },
    4: {
      'Tab 초점·실제 submit 버튼·읽을 수 있는 결과 안내': '키보드로 버튼에 도달하고 제출한 뒤 결과를 보조 기술에서도 확인할 수 있어야 해요.',
      '클릭 가능한 문단과 숨긴 focus outline': '문단은 버튼의 키보드 동작이 없고 초점 표시까지 숨기면 위치를 알기 어려워요.',
      '제출 뒤 결과 영역을 제거': '결과를 없애면 제출이 성공했는지 실패했는지 확인할 수 없어요.',
    },
    5: {
      '정상·빈 상태·저장 실패·키보드 제출을 각기 확인한다': '통합 완료는 정상 경로뿐 아니라 빈 목록·실패 복구·키보드 제출도 확인해야 해요.',
      '성공 화면 한 번만 확인한다': '성공만 확인하면 빈 상태나 오류 상황에서 멈추는 결함을 놓칠 수 있어요.',
      '시각 애니메이션만 확인한다': '애니메이션은 화면 흐름·저장 결과·키보드 조작이 맞는지 보장하지 않아요.',
    },
  },
  26: {
    1: {
      '과정 선택 화면': '저장한 단원이 더는 없으면 사용자가 다른 과정을 고를 수 있는 화면으로 안내해요.',
      '존재하지 않는 단원 주소': '삭제된 단원 주소로 보내면 다시 찾을 수 없는 오류 화면만 남아요.',
      '성공 피드백': '복구할 수 없는 재개 대상이 없으므로 완료 성공처럼 표시하면 안 돼요.',
    },
    2: {
      '오류를 기록하고 안전한 초기 진도 흐름 제공': '손상 기록은 진단 가능하게 알리고 앱이 멈추지 않도록 안전한 시작 방법을 제공해요.',
      '예외를 던져 앱 전체를 중단': '파싱 예외를 처리하지 않으면 기록 화면 전체가 열리지 않을 수 있어요.',
      '손상 데이터를 성공으로 간주': '깨진 JSON은 유효한 학습 기록이 아니므로 성공한 복원처럼 취급하면 안 돼요.',
    },
    3: {
      '저장 작업 결과가 성공했는지 확인한다': '브라우저 저장 호출이 오류 없이 끝난 뒤에만 저장 성공을 알려요.',
      'localStorage 사용 여부를 추측': '저장소가 있는지만으로 실제 쓰기 성공이나 용량 초과 여부를 알 수 없어요.',
      '버튼 클릭 즉시 성공 상태 확정': '클릭은 저장 시도일 뿐이므로 결과를 기다리지 않고 성공으로 바꾸면 안 돼요.',
    },
    4: {
      '목적지 href가 있는 a와 분명한 이름': 'a 요소의 목적지와 이름은 키보드·보조 기술 사용자에게 이동 결과를 알려 줘요.',
      'onClick만 있는 span': 'span은 링크 의미와 기본 초점·키보드 동작이 없어 이어하기에 적합하지 않아요.',
      'aria-hidden인 버튼': 'aria-hidden 요소는 보조 기술에서 제외되므로 버튼의 목적과 조작을 알 수 없어요.',
    },
    5: {
      '최근 단원·완료 문제·초안이 이어지는지 확인한다': '복원 뒤 실제 학습 위치와 완료 기록, 작성 중이던 답이 돌아왔는지 살펴봐요.',
      '테마만 맞는지 확인한다': '테마가 복원돼도 학습 진도와 답안이 이어진다는 뜻은 아니에요.',
      '저장 파일 이름만 확인한다': '파일 이름은 백업 내부의 기록이 올바르게 복원됐는지 보여 주지 않아요.',
    },
  },
};

function exercisesFor(week, day, exampleOverride) {
  const [baseTopic, objective, example, baseChoicePrompt, baseOptionText, baseCorrect, baseTraceCode, baseTraceAnswer, baseCodeLines, baseBadLine, baseBadWhy, baseFunctionName, baseStarterCode, baseRepairBody, baseRepairRequirement] = specs[week - 1];
  const variant = foundationRepairVariants[`${week}-${day}`];
  const [functionName, starterCode, repairBody, repairRequirement, allowExistingRepairBody] = variant ?? [baseFunctionName, baseStarterCode, baseRepairBody, baseRepairRequirement];
  const reviewed = reviewedCases[week]?.[day - 1];
  const editorial = foundationExerciseOverrides[`${week}-${day}`];
  const dailyCase = foundationDailyCases[`${week}-${day}`] ?? advancedDailyCases[`${week}-${day}`];
  const [topic, choicePrompt, optionText, correct, traceCode, traceAnswer, baseCodeLinesForDay, baseBadLineForDay, baseBadWhyForDay] = dailyCase ?? [baseTopic, baseChoicePrompt, baseOptionText, baseCorrect, baseTraceCode, baseTraceAnswer, baseCodeLines, baseBadLine, baseBadWhy];
  const errorVariant = foundationErrorVariants[String(week) + '-' + day];
  const [codeLines, badLine, badWhy] = errorVariant ?? [baseCodeLinesForDay, baseBadLineForDay, baseBadWhyForDay];
  const [caseTitle, baseCaseObjective, caseExample] = reviewed ?? (dailyCase
    ? [dailyCase[0], `${dailyCase[0]}의 핵심 조건과 실패 경계를 확인해요.`, dailyCase[4]]
    : [topic, objective, example]);
  const caseObjective = advancedDayObjectives[week]?.[day - 1] ?? baseCaseObjective;
  const exampleForDay = exampleOverride ?? caseExample;
  const answerLines = Array.isArray(badLine) ? badLine : [badLine];
  const concept = editorial?.choice
    ? choice(`react-w${week}-d${day}-concept-v2`, `${caseTitle} · 판단`, `${editorial.choice.prompt}\n\n예제: \`${exampleForDay}\``, editorial.choice.options, editorial.choice.answer, editorial.choice.hint, editorial.choice.explanation)
    : choice(`react-w${week}-d${day}-concept`, `${caseTitle} · 판단`, `${choicePrompt}\n\n예제: \`${exampleForDay}\``, optionText.map((text, index) => [text, index === correct
      ? `이 선택이 맞아요. ${caseObjective}`
      : `이 선택은 요구와 맞지 않아요. ${caseObjective}`]), correct, reactConceptHints[`${week}-${day}`] ?? '예제의 입력과 요구사항을 차례로 대조해 보세요.', `정답은 “${optionText[correct]}”예요. ${caseObjective}`);
  if (week >= 19 && week <= 26) {
    const reasonsByText = week === 19 ? reactSpecificChoiceReasons[day] : reactSpecificChoiceReasons[week][day];
    for (const option of concept.choices) concept.choiceExplanations[option.id] = reasonsByText[option.text];
  }
  const traceId = `react-w${week}-d${day}-trace-v${editorial?.trace?.idVersion ?? 2}`;
  const traceTitle = `${caseTitle} · 코드 이해`;
  const tracePrompt = editorial?.trace
    ? `${editorial.trace.prompt}\n\n\`${editorial.trace.code ?? caseExample}\``
    : '';
  const traceAnswers = editorial?.trace?.answers ?? [];
  const caseSensitiveTrace = /결과|반환값|출력|typeof/.test(editorial?.trace?.prompt ?? '')
    && /[A-Za-z]/.test(traceAnswers.join(' '));
  const defaultTraceId = `react-w${week}-d${day}-trace`;
  const defaultTracePrompt = `아래 개념 코드의 결과를 적으세요. 이 예시는 원리 설명용이며 실행 환경 설정을 뜻하지 않습니다.\n\n\`${traceCode}\``;
  const caseSensitiveDefaultTrace = /[A-Za-z]/.test(traceAnswer.join(' '));
  const versionedTrace = caseSensitiveTrace || editorial?.trace?.versioned === true;
  const trace = editorial?.trace
    ? versionedTrace
      ? versionedShortAnswer(traceId, traceTitle, tracePrompt, traceAnswers, editorial.trace.hint, editorial.trace.explanation, caseSensitiveTrace ? 'case-sensitive' : 'default')
      : shortAnswer(traceId, traceTitle, tracePrompt, traceAnswers, editorial.trace.hint, editorial.trace.explanation)
    : reviewed
      ? shortAnswer(`react-w${week}-d${day}-trace`, `${caseTitle} · 코드 읽기`, `아래 사례가 다루는 주제 이름을 적으세요.\n\n\`${caseExample}\``, [caseTitle], '코드에서 JSX, props, 이벤트, state, 접근성 속성 중 무엇이 핵심인지 살펴보세요.', `이 사례는 ${caseTitle}을 다룹니다. ${caseObjective}`)
      : caseSensitiveDefaultTrace
        ? versionedShortAnswer(defaultTraceId, `${topic} · 코드 추적`, defaultTracePrompt, traceAnswer, '표현식이 만드는 값과 콘솔에 전달되는 값을 차례대로 읽어 보세요.', `각 문장을 순서대로 적용하면 ${traceAnswer[0]}이 됩니다. JSX와 Hook은 여기서 개념 코드로만 사용됩니다.`, 'case-sensitive')
        : shortAnswer(defaultTraceId, `${topic} · 코드 추적`, defaultTracePrompt, traceAnswer, '표현식이 만드는 값과 콘솔에 전달되는 값을 차례대로 읽어 보세요.', `각 문장을 순서대로 적용하면 ${traceAnswer[0]}이 됩니다. JSX와 Hook은 여기서 개념 코드로만 사용됩니다.`);
  const debug = locateError(editorial?.debugId ?? `react-w${week}-d${day}-debug`, `${caseTitle} · 오류 찾기`, `요구사항: ${caseObjective}\n\n기준 예제: \`${exampleForDay}\`\n\n아래 코드에서 요구사항을 어기는 줄을 고르세요.`, 'React', codeLines, answerLines, editorial?.debugHint ?? `${caseTitle}에 필요한 prop, state, Hook 규칙, HTML 의미 중 무엇이 깨지는지 줄별로 확인하세요.`, badWhy);
  const repairGuidance = reactRepairGuidance[`${week}-${day}`];
  const repair = repairCode({ id: editorial?.repairId ?? `react-w${week}-d${day}-repair`, title: `${caseTitle} · 코드 수정`, prompt: `\`${functionName}\`을 요구사항에 맞게 고치세요. ${repairRequirement} 자동 평가는 실행하지 않고 전체 함수 구조와 핵심 JSX/표현식을 검사합니다.`, language: 'React', starterCode, solutionPatterns: [repairedReactPattern(functionName, starterCode, repairBody, allowExistingRepairBody)], acceptanceCriteria: { requirements: [repairRequirement], constraints: ['함수 이름과 전달받는 props를 유지한다.', '기존 state나 prop을 직접 변경하지 않는다.'], examples: [{ input: '문항의 대표 props/상태', output: '요구사항에 맞는 화면 또는 반환값' }], tests: [{ input: '경계 props/상태', expected: '요구사항에 맞는 결과' }] }, gradingNote: '자동 평가는 코드를 실행하거나 브라우저를 열지 않습니다. 구조 패턴만 검사하므로 실제 앱에서는 렌더링·접근성 테스트가 추가로 필요합니다.', hint: editorial?.repairHint ?? repairGuidance?.hint ?? '입력, 상태 갱신, JSX 반환 중 요구사항이 바꾸는 부분만 먼저 표시하세요.', explanation: editorial?.repairExplanation ?? repairGuidance?.explanation ?? repairRequirement });
  if (day === 1) return [concept, trace, debug];
  if (day === 2) return [trace, debug, concept];
  if (day === 3) return [debug, concept, trace];
  if (day === 4) return [concept, debug, repair];
  return [repair, concept, trace];
}

function sessionsFor(week) {
  const [topic, baseObjective, example, , , , traceCode, , debugLines, , , , starterCode, repairBody] = specs[week - 1];
  const objective = advancedWeekObjectives[week] ?? baseObjective;
  const dailyGoals = [
    '핵심 규칙과 필요한 이유를 이해해요.',
    '예제 값을 따라가며 화면 결과를 예측해요.',
    '요구사항과 다르게 동작하는 코드를 찾아요.',
    '기존 컴포넌트 구조를 유지하며 코드를 고쳐요.',
    '정상·빈 값·실패 상황을 나눠 확인해요.',
  ];
  const header = starterCode.match(/^\s*(?:async\s+)?function\s+\w+\s*\([^\n]*\)\s*\{/m)?.[0];
  if (!header) throw new Error(`Cannot build repaired React example for week ${week}`);
  const repairedExample = `${header}\n  ${repairBody}\n}\n// 대표 입력과 빈 상태도 확인하세요.`;
  const dayFiveRepair = foundationRepairVariants[`${week}-5`];
  const dayFiveHeader = dayFiveRepair?.[1].match(/^\s*(?:async\s+)?function\s+\w+\s*\([^\n]*\)\s*\{/)?.[0];
  if (week >= 13 && !dayFiveHeader) throw new Error(`Cannot build a distinct day-five React repair for week ${week}`);
  const dayFiveExample = dayFiveRepair
    ? `${dayFiveHeader}\n  ${dayFiveRepair[2]}\n}\n// 대표 입력과 빈 상태도 확인하세요.`
    : repairedExample;
  const errorExampleOverrides = {
    20: 'function CommentPreview({ comment }) {\n  const markup = comment;\n  return <div dangerouslySetInnerHTML={{ __html: markup }} />;\n}',
    26: 'function ResumeAction({ lessonId }) {\n  const path = `#/lesson/${lessonId}`;\n  return <div onClick={() => openLesson(path)}>이어 학습</div>;\n}',
  };
  const examples = [example, traceCode, errorExampleOverrides[week] ?? debugLines.join('\n'), starterCode, dayFiveExample];
  return [1, 2, 3, 4, 5].map((day) => {
    const reviewed = reviewedCases[week]?.[day - 1];
    const dailyCase = foundationDailyCases[`${week}-${day}`] ?? advancedDailyCases[`${week}-${day}`];
    const dailyExample = dailyCase
      ? day === 3 ? dailyCase[6].join('\n') : day === 5 ? dayFiveExample : day === 4 ? starterCode : dailyCase[4]
      : examples[day - 1];
    const fallback = dailyCase
      ? [dailyCase[0], `${dailyCase[0]}: ${dailyGoals[day - 1]}`, dailyExample]
      : [`${topic} · ${['판단', '실행 추적', '오류 찾기', '요구사항 수정', '경계 검증'][day - 1]}`, `${topic}: ${dailyGoals[day - 1]}`, dailyExample];
    const [dayTitle, fallbackObjective, dayExample] = reviewed ?? fallback;
    const dayObjective = advancedDayObjectives[week]?.[day - 1] ?? fallbackObjective;
    const intro = week < 13 && reviewed
      ? `${dayObjective} 아래 코드는 React 기본 규칙을 설명하는 최소 사례입니다.`
      : '';
    return studySession(day, dayTitle, dayObjective, intro, dayExample, exercisesFor(week, day, dayExample));
  });
}

const newLessons = specs.slice(12).map((spec, offset) => {
  const week = offset + 13;
  return weeklyLesson({ id: `react-week-${week}`, topicId: phaseFor(week), week, title: spec[0], objective: advancedWeekObjectives[week], intro: '', points: [], example: spec[2], sessions: sessionsFor(week), difficulty: difficultyFor(week) });
});

const foundationLegacySupplements = {
  '1-1': ['react-w1-d1-trace-v2', 'react-w1-d1-debug'],
  '2-1': ['react-w2-d1-trace-v2', 'react-w2-d1-debug'],
  '2-3': ['react-w2-d3-concept-v2', 'react-w2-d3-trace-v2'],
  '3-1': ['react-w3-d1-trace-v2', 'react-w3-d1-debug'],
  '4-2': ['react-w4-d2-trace-v2', 'react-w4-d2-debug'],
  '4-3': ['react-w4-d3-concept-v2', 'react-w4-d3-trace-v2'],
  '5-1': ['react-w5-d1-trace-v2', 'react-w5-d1-debug'],
  '5-2': ['react-w5-d2-concept-v2', 'react-w5-d2-debug'],
  '5-3': ['react-w5-d3-concept-v2', 'react-w5-d3-trace-v2'],
  '6-1': ['react-w6-d1-trace-v2', 'react-w6-d1-debug'],
  '6-2': ['react-w6-d2-concept-v2', 'react-w6-d2-debug'],
  '6-3': ['react-w6-d3-concept-v2', 'react-w6-d3-trace-v2'],
  '7-1': ['react-w7-d1-trace-v2', 'react-w7-d1-debug'],
  '7-2': ['react-w7-d2-concept-v2', 'react-w7-d2-debug'],
  '7-3': ['react-w7-d3-concept-v2', 'react-w7-d3-trace-v2'],
  '8-1': ['react-w8-d1-trace-v2', 'react-w8-d1-debug'],
  '8-2': ['react-w8-d2-concept-v2', 'react-w8-d2-debug'],
  '8-3': ['react-w8-d3-concept-v2', 'react-w8-d3-trace-v2'],
  '9-1': ['react-w9-d1-trace-v2', 'react-w9-d1-debug'],
  '9-2': ['react-w9-d2-concept-v2', 'react-w9-d2-debug'],
  '9-3': ['react-w9-d3-concept-v2', 'react-w9-d3-trace-v2'],
  '10-1': ['react-w10-d1-trace-v2', 'react-w10-d1-debug'],
  '10-2': ['react-w10-d2-concept-v2', 'react-w10-d2-debug'],
  '10-3': ['react-w10-d3-concept-v2', 'react-w10-d3-trace-v2'],
  '11-1': ['react-w11-d1-trace-v2', 'react-w11-d1-debug'],
  '11-2': ['react-w11-d2-concept-v2', 'react-w11-d2-debug'],
  '11-3': ['react-w11-d3-concept-v2', 'react-w11-d3-trace-v2'],
  '12-1': ['react-w12-d1-trace-v2', 'react-w12-d1-debug'],
  '12-2': ['react-w12-d2-concept-v2', 'react-w12-d2-debug'],
  '12-3': ['react-w12-d3-concept-v2', 'react-w12-d3-trace-v2'],
};

function legacyFoundationExercises(week, session) {
  const selectedIds = foundationLegacySupplements[`${week}-${session.number}`];
  if (!selectedIds) return session.exercises.slice(0, session.number <= 3 ? 2 : 3);
  const selected = selectedIds.map((id) => session.exercises.find((exercise) => exercise.id === id || exercise.legacyIds?.includes(id)));
  if (selected.some((exercise) => !exercise)) throw new Error(`Missing React foundation supplement for week ${week}, day ${session.number}`);
  return selected;
}

export const reactCourseExpansion = {
  phases,
  lessonOrder: [...legacyIds, ...newLessons.map((lesson) => lesson.id)],
  existingWeeks: Object.fromEntries(legacyIds.map((lessonId, index) => {
    const week = index + 1;
    return [lessonId, { week, phaseId: phaseFor(week), sessions: sessionsFor(week).map((session) => ({ ...session, exercises: legacyFoundationExercises(week, session) })) }];
  })),
  lessons: newLessons,
  reviewedWeeks: Array.from({ length: 26 }, (_, index) => index + 1),
};
