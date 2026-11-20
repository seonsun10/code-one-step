import { choice, locateError, repairCode, shortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import { typescriptReviewedOpeningWeeks } from './curriculum-typescript-w1-w3-reviewed.js';
import { typescriptReviewedWeeksFourToSix } from './curriculum-typescript-w4-w6-reviewed.js';
import { typescriptReviewedWeeksSevenToNine } from './curriculum-typescript-w7-w9-reviewed.js';
import { typescriptReviewedWeeksTenToTwelve } from './curriculum-typescript-w10-w12-reviewed.js';
import { typescriptReviewedWeeksThirteenToFifteen } from './curriculum-typescript-w13-w15-reviewed.js';
import { typescriptReviewedWeeksSixteenToEighteen } from './curriculum-typescript-w16-w18-reviewed.js';
import { typescriptReviewedWeeksNineteenToTwentyOne } from './curriculum-typescript-w19-w21-reviewed.js';
import { typescriptReviewedWeeksTwentyTwoToTwentyFour } from './curriculum-typescript-w22-w24-reviewed.js';
import { typescriptReviewedWeeksTwentyFiveToTwentySix } from './curriculum-typescript-w25-w26-reviewed.js';

const typescriptReviewedWeeks = {
  ...typescriptReviewedOpeningWeeks,
  ...typescriptReviewedWeeksFourToSix,
  ...typescriptReviewedWeeksSevenToNine,
  ...typescriptReviewedWeeksTenToTwelve,
  ...typescriptReviewedWeeksThirteenToFifteen,
  ...typescriptReviewedWeeksSixteenToEighteen,
  ...typescriptReviewedWeeksNineteenToTwentyOne,
  ...typescriptReviewedWeeksTwentyTwoToTwentyFour,
  ...typescriptReviewedWeeksTwentyFiveToTwentySix,
};

const phases = [
  { id: 'typescript-phase-1', number: 1, title: '입문 · JavaScript에서 TypeScript로', startWeek: 1, endWeek: 4, objective: '값의 타입을 읽고, 추론과 기본 함수 계약을 설명해요.' },
  { id: 'typescript-phase-2', number: 2, title: '기초 · 객체와 유니온', startWeek: 5, endWeek: 8, objective: '객체 모양·유니온·좁히기·불변 입력을 표현해요.' },
  { id: 'typescript-phase-3', number: 3, title: '중급 · 재사용 가능한 타입', startWeek: 9, endWeek: 12, objective: '제네릭·키 연산·유틸리티 타입으로 데이터 계약을 재사용해요.' },
  { id: 'typescript-phase-4', number: 4, title: '고급 · 애플리케이션 경계', startWeek: 13, endWeek: 16, objective: '모듈·비동기·클래스·선언 파일의 경계를 설계해요.' },
  { id: 'typescript-phase-5', number: 5, title: '심화 · 타입 안전성과 도구', startWeek: 17, endWeek: 21, objective: '판별 유니온·조건부 타입·엄격 옵션·타입 테스트를 다뤄요.' },
  { id: 'typescript-phase-6', number: 6, title: '실전 · 통합 프로젝트', startWeek: 22, endWeek: 26, objective: '실행 시 검증과 정적 타입의 차이를 포함해 제품 흐름을 완성해요.' },
];

// Each week defines five deliberately different study days. Exercises use
// short, bounded examples: this site transpiles TypeScript but does not run
// the TypeScript type checker, so type-error questions are explicitly guided.
const weeks = [
  {
    title: '값·타입·TypeScript의 역할', objective: 'JavaScript 값과 TypeScript 정적 검사 시점을 구분해요.', days: ['타입 주석 읽기', '문자열·숫자·불리언', 'null과 undefined', '실행 시 값과 정적 타입', '첫 번째 타입 오류 읽기'],
    rule: '타입 주석은 작성 시점의 정적 검사 정보를 제공하며 JavaScript 실행 값으로 남지 않아요.', wrong: ['타입 주석이 실행 중 입력을 자동 검증해요.', '타입 주석을 쓰면 브라우저가 TypeScript를 그대로 실행해요.'],
    example: 'const learner: string = "Mina";\nconst dayNumber: number = __DAY__;\nconsole.log(learner.length + dayNumber);', answer: (day) => String(4 + day),
    bug: ['const learner: string = "Mina";', 'const dayNumber: number = "__DAY__";', 'console.log(dayNumber);'], line: 2, diagnosis: '2번 줄은 문자열을 number 변수에 넣고 있어요. 입력 값과 선언한 정적 타입을 일치시켜야 해요.',
    starter: 'const lessonCount: number = "26";', solution: 'const lessonCount: number = 26;',
  },
  {
    title: '추론·const와 let', objective: '초기값에서 타입이 추론되는 방식과 재할당을 구분해요.', days: ['초기값의 타입 추론', 'const 리터럴 추론', 'let 재할당 범위', '명시 주석이 필요한 경계', '불필요한 any 제거'],
    rule: '대부분의 변수는 초기값에서 타입을 추론하고, const와 let의 재할당 가능성에 따라 좁은 타입 범위가 달라져요.', wrong: ['모든 변수에는 타입 주석을 반드시 반복해서 써야 해요.', 'let으로 선언하면 값의 타입이 항상 any가 돼요.'],
    example: 'let completed = __DAY__;\ncompleted += 1;\nconsole.log(completed);', answer: (day) => String(day + 1),
    bug: ['const completed = __DAY__;', 'completed += 1;', 'console.log(completed);'], line: 2, diagnosis: '2번 줄은 const 바인딩을 다시 대입해요. 값이 바뀌어야 하면 let을 사용하고, 바뀌지 않으면 재대입을 제거하세요.',
    starter: 'const completed = 1; completed += 1;', solution: 'let completed = 1; completed += 1;',
  },
  {
    title: '함수 입력과 반환 타입', objective: '함수의 매개변수와 반환 계약을 타입으로 표현해요.', days: ['매개변수 타입', '반환 타입 추론', '명시적 반환 계약', '선택적 매개변수', '기본 매개변수'],
    rule: '매개변수 타입은 호출자가 전달할 값을 제한하고, 반환 타입은 함수가 내보낼 결과를 설명해요.', wrong: ['반환 타입은 호출 때마다 임의로 바뀌어도 돼요.', '매개변수 타입은 함수 본문만 검사하고 호출부에는 적용되지 않아요.'],
    example: 'function double(value: number) {\n  return value * __DAY__;\n}\nconsole.log(double(2));', answer: (day) => String(day * 2),
    bug: ['function double(value: number): string {', '  return value * 2;', '}'], line: 2, diagnosis: '2번 줄은 number를 반환하지만 선언은 string이에요. 실제 반환값에 맞춰 number로 바꾸거나 문자열을 반환해야 해요.',
    starter: 'function double(value: number): string { return value * 2; }', solution: 'function double(value: number): number { return value * 2; }',
  },
  {
    title: '배열·튜플·읽기 전용 값', objective: '동일한 원소 타입의 배열과 고정된 위치 의미의 튜플을 구분해요.', days: ['T[] 배열 표기', 'Array<T> 표기', '읽기 전용 배열', '튜플의 위치 타입', '배열 메서드의 반환 타입'],
    rule: '일반 배열은 같은 종류의 여러 값을 담고, 튜플은 위치마다 정해진 타입을 표현해요.', wrong: ['배열의 모든 위치는 서로 다른 타입이어야 해요.', 'readonly 배열도 push로 원본을 바꿀 수 있어요.'],
    example: 'const pair: [string, number] = ["unit", __DAY__];\nconsole.log(pair[1] + 1);', answer: (day) => String(day + 1),
    bug: ['const pair: [string, number] = ["unit", __DAY__];', 'pair[0] = 1;', 'console.log(pair);'], line: 2, diagnosis: '2번 줄은 tuple의 첫 위치에 number를 넣어요. 첫 칸은 string 계약이므로 타입을 맞춰야 해요.',
    starter: 'const pair: [string, number] = ["unit", "1"];', solution: 'const pair: [string, number] = ["unit", 1];',
  },
  {
    title: '객체 모양과 선택 속성', objective: '객체의 필수·선택 속성과 읽기 전용 속성을 모델링해요.', days: ['객체 속성 타입', '선택 속성 ?', 'readonly 속성', '중첩 객체', '구조적 타입 호환'],
    rule: '객체 타입은 필요한 속성의 모양을 설명하고, 선택 속성은 존재하지 않을 수 있어 사용할 때 확인해야 해요.', wrong: ['TypeScript 객체는 선언한 속성 외 값을 절대 가질 수 없어요.', '선택 속성은 사용 시 항상 존재한다고 보장돼요.'],
    example: 'type Lesson = { title: string; minutes?: number };\nconst lesson: Lesson = { title: "TS", minutes: __DAY__ };\nconsole.log(lesson.minutes ?? 0);', answer: (day) => String(day),
    bug: ['type Learner = { name: string; level?: number };', 'const learner: Learner = { level: 2 };', 'console.log(learner.name);'], line: 2, diagnosis: '2번 줄에서 필수 속성 name이 빠졌어요. 객체 값을 타입 계약에 맞게 채우거나 필드를 선택 속성으로 설계하세요.',
    starter: 'type Learner = { name: string }; const learner: Learner = { level: 2 };', solution: 'type Learner = { name: string }; const learner: Learner = { name: "Mina" };',
  },
  {
    title: '유니온과 리터럴 타입', objective: '허용 값의 집합을 유니온으로 제한하고 공통 연산을 찾어요.', days: ['string | number', '리터럴 유니온', 'type 별칭', '유니온 공통 속성', '상태 값 모델링'],
    rule: '유니온 타입은 나열된 여러 타입 중 하나의 값을 허용하며, 공통으로 안전한 연산만 좁히기 전 사용할 수 있어요.', wrong: ['유니온은 모든 구성 타입의 속성을 자동으로 합쳐요.', '리터럴 유니온은 목록 밖 문자열도 허용해요.'],
    example: 'type Status = "ready" | "paused";\nconst state: Status = __DAY__ % 2 === 0 ? "ready" : "paused";\nconsole.log(state);', answer: (day) => day % 2 === 0 ? 'ready' : 'paused',
    bug: ['type Status = "ready" | "paused";', 'const state: Status = "finished";', 'console.log(state);'], line: 2, diagnosis: '2번 줄의 finished는 선언한 리터럴 유니온에 없어요. 허용 상태를 추가하거나 기존 상태 중 하나를 사용하세요.',
    starter: 'type Status = "ready" | "paused"; const state: Status = "finished";', solution: 'type Status = "ready" | "paused"; const state: Status = "ready";',
  },
  {
    title: 'typeof·in으로 타입 좁히기', objective: '런타임 검사 결과를 이용해 유니온의 가능한 타입을 좁혀요.', days: ['typeof 문자열 좁히기', 'number와 null 별도 좁히기', 'in 속성 검사', '빈 문자열과 truthiness', 'nullish 값 명시 검사'],
    rule: 'typeof와 in 같은 JavaScript 조건은 참인 분기에서 TypeScript가 더 구체적인 타입을 추론하도록 도와요.', wrong: ['타입 단언은 런타임에 값을 검사해요.', 'if 문은 검사한 값의 타입을 좁히지 않아요.'],
    example: 'function label(value: string | number) {\n  return typeof value === "string" ? value.toUpperCase() : value.toFixed(__DAY__);\n}\nconsole.log(label("ts"));', answer: () => 'TS',
    bug: ['function label(value: string | number) {', '  return value.toUpperCase();', '}'], line: 2, diagnosis: '2번 줄에서는 value가 string 또는 number일 수 있어요. typeof 검사로 문자열인 경우를 먼저 좁혀야 해요.',
    starter: 'function label(value: string | number) { return value.toUpperCase(); }', solution: 'function label(value: string | number) { return typeof value === "string" ? value.toUpperCase() : value.toFixed(); }',
  },
  {
    title: '판별 유니온과 never', objective: '명시적인 판별 필드로 상태별 데이터와 빠진 분기를 확인해요.', days: ['리터럴 판별 필드', 'if로 상태별 payload 좁히기', 'switch와 never 완전성', '새 상태 추가와 분기 갱신', '비동기 화면 상태 모델'],
    rule: '공통 판별 필드가 서로 다른 리터럴 값을 가지면 각 분기 안에서 해당 변형만 안전하게 다룰 수 있어요.', wrong: ['판별 유니온은 모든 상태의 필드를 항상 선택 가능하게 해요.', 'never는 아직 모르는 입력이 올 수 있음을 뜻해요.'],
    example: 'type Reply = { kind: "ok"; value: number } | { kind: "error"; message: string };\nconst reply: Reply = { kind: "ok", value: __DAY__ };\nconsole.log(reply.kind);', answer: () => 'ok',
    bug: ['type Reply = { kind: "ok"; value: number } | { kind: "error"; message: string };', 'function render(reply: Reply) { return reply.message; }', 'console.log(render({ kind: "ok", value: 1 }));'], line: 2, diagnosis: '2번 줄에서 message는 error 변형에만 있어요. kind를 먼저 검사해 해당 상태로 좁힌 뒤 읽어야 해요.',
    starter: 'type Reply = { kind: "ok"; value: number } | { kind: "error"; message: string }; function read(reply: Reply) { return reply.message; }', solution: 'type Reply = { kind: "ok"; value: number } | { kind: "error"; message: string }; function read(reply: Reply) { return reply.kind === "error" ? reply.message : String(reply.value); }',
  },
  {
    title: '제네릭 함수와 타입 추론', objective: '입력 타입과 출력 타입의 관계를 타입 매개변수로 보존해요.', days: ['입력 타입을 보존하는 T', '배열 원소 타입 보존', '반환 객체의 타입 추론', '명시적 타입 인자', '여러 인자의 같은 T 관계'],
    rule: '제네릭은 입력에서 얻은 구체 타입을 출력과 연결해 재사용 가능한 함수 계약을 만들어요.', wrong: ['제네릭 T는 실행 중 특정 클래스를 생성해요.', '모든 반환값을 any로 바꾸는 것이 제네릭과 같아요.'],
    example: 'function identity<T>(value: T): T { return value; }\nconst result = identity(__DAY__);\nconsole.log(result + 1);', answer: (day) => String(day + 1),
    bug: ['function identity<T>(value: T): T {', '  return "done";', '}'], line: 2, diagnosis: '2번 줄은 임의의 T를 받으면서 string만 반환해요. 입력값을 그대로 반환하거나 제네릭 제약을 구체적으로 정해야 해요.',
    starter: 'function identity<T>(value: T): T { return "done"; }', solution: 'function identity<T>(value: T): T { return value; }',
  },
  {
    title: '제네릭 제약과 keyof', objective: 'extends 제약으로 허용 연산을 밝히고 객체 키와 값의 관계를 보존해요.', days: ['제네릭 extends', 'keyof 연산자', '키로 값 조회', '제약 조건의 역할', '잘못된 키 거부'],
    rule: 'T extends Constraint는 타입 매개변수가 필요한 구조를 갖도록 제한하고, keyof T는 그 구조의 키를 나타내요.', wrong: ['extends는 런타임 상속을 자동으로 수행해요.', 'keyof T는 객체의 값들을 유니온으로 반환해요.'],
    example: 'function getValue<T, K extends keyof T>(item: T, key: K): T[K] { return item[key]; }\nconst course = { weeks: __DAY__, title: "TS" };\nconsole.log(getValue(course, "weeks"));', answer: (day) => String(day),
    bug: ['function getValue<T, K extends keyof T>(item: T, key: K): T[K] {', '  return item["missing"];', '}'], line: 2, diagnosis: '2번 줄의 missing은 K가 보장하는 key 범위 밖이에요. 전달된 key를 사용하거나 제네릭 제약을 다시 설계하세요.',
    starter: 'function getValue<T, K extends keyof T>(item: T, key: K): T[K] { return item["missing"]; }', solution: 'function getValue<T, K extends keyof T>(item: T, key: K): T[K] { return item[key]; }',
  },
  {
    title: '유틸리티 타입으로 갱신 모델 만들기', objective: '기존 타입에서 필요한 부분집합·선택·변경 모델을 파생해요.', days: ['Partial과 점진 갱신', 'Pick으로 공개 필드 선택', 'Omit으로 내부 필드 제외', 'Required와 선택성', 'Record와 키 매핑'],
    rule: '타입 단언은 컴파일러에 책임을 넘기므로 실제 입력 검증을 대신하지 않아요. satisfies는 계약을 검사하면서 구체적인 추론을 보존할 수 있어요.', wrong: ['as는 실제 값을 변환하거나 검증해요.', 'satisfies는 모든 객체 속성 타입을 지워요.'],
    example: 'type Profile = { name: string; level: number };\ntype Patch = Partial<Profile>;\nconst patch: Patch = { level: __DAY__ };\nconsole.log(patch.level);', answer: (day) => String(day),
    bug: ['type Profile = { name: string; level: number; token: string };', 'type PublicProfile = Pick<Profile, "name" | "token">;', 'console.log("token must stay private");'], line: 2, diagnosis: '2번 줄은 공개 타입에 token을 포함해요. 노출할 필드만 Pick에 남겨야 해요.',
    starter: 'type Profile = { name: string; token: string }; type PublicProfile = Pick<Profile, "name" | "token">;', solution: 'type Profile = { name: string; token: string }; type PublicProfile = Pick<Profile, "name">;',
  },
  {
    title: '조건부·매핑 타입 기초', objective: '타입 조건과 키 순회를 이용해 변환 타입의 동작을 읽어요.', days: ['keyof 기반 매핑', 'readonly 매핑 수정자', '조건부 타입 extends', 'infer로 타입 추출', '유니온 분배와 타입 단순화'],
    rule: '매핑 타입은 기존 키를 순회해 각 속성을 변환하고, 조건부 타입은 타입 관계에 따라 결과 타입을 선택해요.', wrong: ['매핑 타입은 객체 값을 실행 시 순회해요.', '조건부 타입의 조건은 일반 Boolean 런타임 식이에요.'],
    example: 'type Box<T> = { value: T; label: string };\ntype ValueOf<T> = T extends Box<infer V> ? V : never;\ntype Result = ValueOf<Box<number>>;\nconst result: Result = __DAY__;\nconsole.log(result);', answer: (day) => String(day),
    bug: ['type Flags<T> = { [K in keyof T]: boolean };', 'type Source = { ready: string };', 'const state: Flags<Source> = { ready: "yes" };'], line: 3, diagnosis: '3번 줄의 ready는 Flags 변환으로 boolean이 되었어요. 문자열 대신 Boolean 값을 넣어야 해요.',
    starter: 'type Flags<T> = { [K in keyof T]: boolean }; type Source = { ready: string }; const state: Flags<Source> = { ready: "yes" };', solution: 'type Flags<T> = { [K in keyof T]: boolean }; type Source = { ready: string }; const state: Flags<Source> = { ready: true };',
  },
  {
    title: '모듈과 프로젝트 옵션', objective: 'import/export 경계와 모듈 해석·컴파일 옵션의 역할을 구분해요.', days: ['named export와 import', 'default export 선택', '모듈 해석 설정', 'target과 module', 'tsconfig의 strict'],
    rule: 'TypeScript 모듈 설정은 파일 간 import/export를 어떤 JavaScript 모듈 형식과 환경 규칙에 맞출지 정해요.', wrong: ['target은 import된 패키지를 브라우저에 자동 설치해요.', 'strict는 실행 시 데이터 검증을 수행해요.'],
    example: '// math.ts exports add; app.ts imports it from "./math.js".\nconst add = (a: number, b: number): number => a + b;\nconsole.log(add(__DAY__, 1));', answer: (day) => String(day + 1),
    bug: ['export function add(a: number, b: number) { return a + b; }', 'import { sum } from "./math.js";', 'console.log(sum(1, 2));'], line: 2, diagnosis: '1번 줄이 내보내는 이름은 add인데 2번 줄은 sum을 가져와요. export와 import의 이름을 일치시키세요.',
    starter: 'export function add(a: number, b: number) { return a + b; } import { sum } from "./math.js";', solution: 'export function add(a: number, b: number) { return a + b; } import { add } from "./math.js";',
  },
  {
    title: '비동기 함수와 Promise', objective: 'Promise 결과 타입과 await 이후 값의 타입을 따라가요.', days: ['Promise<T> 반환', 'async 반환 래핑', 'await 결과 값', '오류 처리 경계', 'Promise.all 결과 튜플'],
    rule: 'async 함수는 반환값을 Promise로 감싸며, await 표현식은 완료된 Promise의 값 타입을 나타내요.', wrong: ['await는 Promise의 거절을 자동으로 무시해요.', 'async 함수의 반환 타입에는 Promise가 포함되지 않아요.'],
    example: 'async function loadLevel(): Promise<number> { return __DAY__; }\nconst level = await loadLevel();\nconsole.log(level + 1);', answer: (day) => String(day + 1),
    bug: ['async function loadLevel(): Promise<number> {', '  return "high";', '}'], line: 2, diagnosis: '2번 줄은 문자열을 반환하지만 Promise<number> 계약과 맞지 않아요. 숫자를 반환하거나 계약을 수정하세요.',
    starter: 'async function loadLevel(): Promise<number> { return "high"; }', solution: 'async function loadLevel(): Promise<number> { return 3; }',
  },
  {
    title: '클래스·implements와 접근 범위', objective: '클래스 계약, 인스턴스 상태, 합성 관계를 구분해요.', days: ['implements 계약', 'public과 private', 'readonly 필드', '생성자 매개변수 속성', '합성과 상속 선택'],
    rule: 'implements는 클래스가 구조적 계약을 만족하는지 검사하며, 계약 선언만으로 메서드 구현이 생기지는 않아요.', wrong: ['implements는 메서드 본문을 자동 생성해요.', 'private 속성은 객체 사용자가 자유롭게 갱신할 수 있어요.'],
    example: 'interface Counter { value: number; increment(): number }\nclass LessonCounter implements Counter { value = __DAY__; increment() { this.value += 1; return this.value; } }\nconsole.log(new LessonCounter().increment());', answer: (day) => String(day + 1),
    bug: ['interface Counter { value: number; increment(): number }', 'class LessonCounter implements Counter { value = 0; }', 'console.log(new LessonCounter().value);'], line: 2, diagnosis: '2번 줄의 클래스는 Counter가 요구하는 increment 메서드를 구현하지 않았어요. 계약을 충족하는 메서드를 추가해야 해요.',
    starter: 'interface Counter { value: number; increment(): number } class LessonCounter implements Counter { value = 0; }', solution: 'interface Counter { value: number; increment(): number } class LessonCounter implements Counter { value = 0; increment() { this.value += 1; return this.value; } }',
  },
  {
    title: '타입 가드와 사용자 정의 술어', objective: '검증 함수가 Boolean과 타입 술어를 구분해요.', days: ['typeof 기반 가드', 'Array.isArray', 'in 가드', '타입 술어 is', '외부 데이터는 unknown'],
    rule: '타입 가드는 분기에서 타입을 좁혀요. 사용자 정의 술어는 반환 선언을 정확히 작성해야 하며 실제 값 검증도 수행해야 해요.', wrong: ['as SomeType은 입력 데이터의 모양을 런타임에 확인해요.', 'Boolean 반환 함수는 자동으로 모든 사용자 타입을 증명해요.'],
    example: 'function isText(value: unknown): value is string { return typeof value === "string"; }\nconst result = isText("day-__DAY__");\nconsole.log(result);', answer: () => 'true',
    bug: ['function isText(value: unknown): value is string {', '  return true;', '}'], line: 2, diagnosis: '2번 줄은 모든 값을 문자열이라고 거짓 주장해요. typeof 검사처럼 실제 런타임 검증을 수행해야 해요.',
    starter: 'function isText(value: unknown): value is string { return true; }', solution: 'function isText(value: unknown): value is string { return typeof value === "string"; }',
  },
  {
    title: 'unknown·any와 외부 입력', objective: '검증 전 데이터에서 unknown을 사용하고 안전한 경계 변환을 설계해요.', days: ['unknown의 안전한 기본값', 'any의 검사 우회', '타입 단언의 한계', 'JSON.parse 경계', '런타임 스키마 검증'],
    rule: 'unknown은 사용 전에 좁히기를 요구하고, any는 그 검사를 우회하므로 외부 입력 경계의 검증을 대신하지 못해요.', wrong: ['JSON.parse 반환값은 자동으로 선언한 인터페이스를 검증해요.', '타입 단언은 잘못된 입력을 런타임에서 거부해요.'],
    example: 'function describe(value: unknown) {\n  if (typeof value === "string") return value.toUpperCase();\n  return "not text";\n}\nconsole.log(describe("day-__DAY__"));', answer: (day) => `DAY-${day}`,
    bug: ['function describe(value: unknown) {', '  return value.toUpperCase();', '}'], line: 2, diagnosis: '2번 줄에서는 unknown을 문자열이라고 보장할 수 없어요. typeof 확인이나 데이터 파서로 먼저 검증해야 해요.',
    starter: 'function describe(value: unknown) { return value.toUpperCase(); }', solution: 'function describe(value: unknown) { return typeof value === "string" ? value.toUpperCase() : "not text"; }',
  },
  {
    title: '함수 오버로드와 콜백', objective: '호출 형태와 구현 시그니처, 콜백 인자의 관계를 설계해요.', days: ['오버로드 선언 순서', '구현 시그니처의 넓은 타입', '콜백 매개변수 추론', 'this 매개변수', '오버로드를 줄일 대안'],
    rule: '오버로드 호출 시그니처는 사용 가능한 호출 형태를 노출하고, 구현 시그니처는 그 형태를 모두 처리해야 해요.', wrong: ['구현 시그니처만 적으면 여러 반환 타입이 호출부에 보장돼요.', '콜백을 any로 선언하면 안전한 문맥 추론이 생겨요.'],
    example: 'function format(value: string): string;\nfunction format(value: number): string;\nfunction format(value: string | number) { return String(value); }\nconsole.log(format(__DAY__));', answer: (day) => String(day),
    bug: ['function format(value: string): string;', 'function format(value: number): number;', 'function format(value: string | number) { return String(value); }'], line: 2, diagnosis: '2번 줄의 오버로드는 number를 받으면 number를 반환한다고 약속하지만 구현은 string을 반환해요. 공개 계약을 구현에 맞추세요.',
    starter: 'function format(value: number): number; function format(value: number) { return String(value); }', solution: 'function format(value: number): string; function format(value: number) { return String(value); }',
  },
  {
    title: '선언 파일과 JavaScript 상호 운용', objective: '타입 선언이 설명하는 외부 API와 실제 JavaScript 동작을 맞춰요.', days: ['declare의 의미', 'd.ts 선언 역할', 'allowJs와 체크 경계', 'JSDoc 타입', '패키지 타입 탐색'],
    rule: '선언 파일은 JavaScript 구현의 타입 정보를 설명할 뿐 실행 코드를 제공하거나 실제 동작을 보증하지 않아요.', wrong: ['declare는 런타임 함수 구현을 만들어 줘요.', 'd.ts 선언이 있으면 API 응답 데이터도 자동 검증돼요.'],
    example: '// A declaration describes an external implementation; it does not create one.\ndeclare function getLessonCount(): number;\nconst declarationProvidesRuntime = false;\nconsole.log(declarationProvidesRuntime);', answer: () => 'false',
    bug: ['declare function getLessonCount(): number;', 'const count = getLessonCount();', 'console.log(count + 1);'], line: 1, diagnosis: '선언만으로 getLessonCount 함수가 실행 중 만들어지지 않아요. 실제 구현을 제공하는 모듈에서 가져와야 해요.',
    starter: 'declare function getLessonCount(): number; console.log(getLessonCount());', solution: 'function getLessonCount(): number { return 26; } console.log(getLessonCount());',
  },
  {
    title: 'strict 옵션과 null 안전성', objective: '엄격한 검사 옵션과 선택 값에서 생기는 경계를 처리해요.', days: ['strict의 범위', 'strictNullChecks', '선택 속성 검사', '비 null 단언 남용', '안전한 기본값'],
    rule: 'strict 계열 옵션은 더 많은 정적 오류를 찾도록 돕지만 런타임 입력을 검증하지는 않아요.', wrong: ['strict를 켜면 API 값이 자동으로 null이 아니게 바뀌어요.', '느낌표 non-null 단언은 실행 중 값 존재를 검사해요.'],
    example: 'type Learner = { nickname?: string };\nfunction greeting(item: Learner) { return item.nickname ?? "guest"; }\nconsole.log(greeting({ nickname: "day-__DAY__" }));', answer: (day) => `day-${day}`,
    bug: ['type Learner = { nickname?: string };', 'function greeting(item: Learner) { return item.nickname.toUpperCase(); }', 'console.log(greeting({}));'], line: 2, diagnosis: '2번 줄의 nickname은 없을 수 있어요. 기본값을 사용하거나 존재 여부를 확인한 뒤 메서드를 호출해야 해요.',
    starter: 'type Learner = { nickname?: string }; function greeting(item: Learner) { return item.nickname.toUpperCase(); }', solution: 'type Learner = { nickname?: string }; function greeting(item: Learner) { return (item.nickname ?? "guest").toUpperCase(); }',
  },
  {
    title: '타입 테스트와 회귀 검증', objective: '컴파일 시간 계약과 런타임 동작 테스트를 분리해요.', days: ['타입 수준 기대 검증', '정상 입력 테스트', '경계 입력 테스트', '오류 입력 테스트', '회귀 조건 고정'],
    rule: '타입 테스트는 컴파일러가 계약을 거부하는지 확인하고, 런타임 테스트는 실행 결과를 확인하므로 서로 대체하지 않아요.', wrong: ['타입 단언 한 줄이 런타임 정상 동작을 증명해요.', '런타임 테스트 하나가 모든 타입 조합을 확인해요.'],
    example: 'function count(items: readonly string[]): number { return items.length; }\nconst total = count(["a", "b"].slice(0, __DAY__ % 2 + 1));\nconsole.log(total);', answer: (day) => String(day % 2 + 1),
    bug: ['function count(items: readonly string[]): number {', '  items.push("new");', '  return items.length;', '}'], line: 2, diagnosis: '2번 줄은 읽기 전용 배열에 원소를 추가해요. 입력을 바꾸지 않는 계약이라면 복사본을 만들거나 변경을 제거하세요.',
    starter: 'function count(items: readonly string[]): number { items.push("new"); return items.length; }', solution: 'function count(items: readonly string[]): number { return items.length; }',
  },
  {
    title: '통합 프로젝트 요구사항과 타입 모델', objective: '학습 기록 도구의 요구를 식별자·상태·함수 계약으로 분해해요.', days: ['요구사항에서 명사 찾기', '도메인 타입 구분', '상태 변화 모델', '저장 경계 결정', '완료 조건 목록화'],
    rule: '타입 수준 표현이 지나치게 복잡하면 컴파일과 진단이 어려워질 수 있어 작은 별칭과 명시적 경계로 단순화하는 편이 좋아요.', wrong: ['모든 요구사항을 하나의 거대한 interface에 넣어요.', '상태 전이를 boolean 여러 개로 중복 저장해요.'],
    example: 'type LessonId = string;\nfunction findTitle(items: { id: LessonId; title: string }[], id: LessonId): string | undefined {\n  return items.find((item) => item.id === id)?.title;\n}\nconsole.log(findTitle([{ id: "ts", title: "TS" }], "ts") ?? "none");', answer: () => 'TS',
    bug: ['type Result<T> = T extends { data: infer D } ? D extends { value: infer V } ? V : never : never;', 'type Output = Result<{ data: { value: number } }>;', 'const result: Output = "one";'], line: 3, diagnosis: '3번 줄의 result는 중첩 조건부 타입에서 number로 추론돼요. 타입 오류를 감추지 말고 경계를 작은 별칭으로 나눠 확인하세요.',
    starter: 'type Output = number; const result: Output = "one";', solution: 'type Output = number; const result: Output = 1;',
  },
  {
    title: '통합 프로젝트 구현과 경계 검증', objective: '요청 입력·검증·도메인 계산·오류 결과를 분리해요.', days: ['입력 DTO 분리', '파싱과 검증 함수', '도메인 계산 순수 함수', '오류 반환 모델', '경계 테스트 작성'],
    rule: 'satisfies는 표현식이 계약을 만족하는지 검사하면서 표현식의 더 구체적인 추론을 보존할 수 있어요.', wrong: ['as는 실제 값을 변환하거나 검증해요.', 'satisfies는 모든 객체 속성 타입을 지워요.'],
    example: 'type Route = { path: string };\nconst routes = { home: { path: "/home" } } satisfies Record<string, Route>;\nconsole.log(routes.home.path);', answer: () => '/home',
    bug: ['type Route = { path: string };', 'const routes = { home: { path: 12 } } satisfies Record<string, Route>;', 'console.log(routes.home.path);'], line: 2, diagnosis: '2번 줄의 path는 Route가 요구하는 string이 아니라 number예요. 계약에 맞는 경로 문자열을 제공하세요.',
    starter: 'type Route = { path: string }; const route = { path: 12 } satisfies Route;', solution: 'type Route = { path: string }; const route = { path: "/home" } satisfies Route;',
  },
  {
    title: '모듈·프레임워크·버전 경계', objective: '모듈 해석, DOM·JSX 환경, 현재 TypeScript 버전의 지원 경계를 구분해요.', days: ['ESM import와 export', 'strict 컴파일 옵션', 'DOM null 경계', 'React JSX 타입 경계', 'TypeScript 6·7 API 차이'],
    rule: '현재 안정판 TypeScript 7.0은 컴파일러 API를 제공하지 않으며 API를 직접 쓰는 도구는 호환되는 6.0 API 경계를 확인해야 해요.', wrong: ['TypeScript 7.0은 6.0과 같은 컴파일러 API를 제공해요.', 'deprecated 옵션은 최신 버전에서도 아무 영향 없이 계속 지원돼요.'],
    example: 'type LessonSummary = { id: string; title: string };\nfunction summarize(item: LessonSummary) { return `${item.id}: ${item.title}`; }\nconsole.log(summarize({ id: "w__DAY__", title: "Types" }));', answer: (day) => `w${day}: Types`,
    bug: ['export type LessonSummary = { id: string; title: string; internalToken: string };', 'export function summarize(item: LessonSummary) { return item.title; }', 'console.log(summarize({ id: "w1", title: "Types" }));'], line: 1, diagnosis: '1번 줄은 외부 호출자에게 사용하지 않는 내부 비밀 필드까지 요구해요. 공개 계약에는 실제로 필요한 필드만 남겨야 해요.',
    starter: 'export type LessonSummary = { id: string; title: string; internalToken: string };', solution: 'export type LessonSummary = { id: string; title: string };',
  },
  {
    title: '저장·보안·의존성 경계', objective: '브라우저 저장 자료, 외부 입력, 권한과 패키지 공급 경계를 검증해요.', days: ['저장 스키마 버전', '누락 필드 복구', '외부 값 allowlist', '라이선스와 공급처 확인', '백업 복원 검증'],
    rule: '외부 문자열과 JSON은 정적 타입을 붙여도 런타임에 검증되지 않으므로 파싱·검증·변환 결과를 따로 다뤄요.', wrong: ['const data = JSON.parse(text) as Lesson은 필드를 검사해요.', '인터페이스 선언은 잘못된 HTTP 응답을 거부해요.'],
    example: 'function parseCount(raw: string): number | null {\n  const value = Number(raw);\n  return Number.isFinite(value) ? value : null;\n}\nconsole.log(parseCount("__DAY__"));', answer: (day) => String(day),
    bug: ['const payload = JSON.parse(text) as { count: number };', 'console.log(payload.count.toFixed(0));', ''], line: 1, diagnosis: '1번 줄의 as는 JSON 필드를 검사하지 않아요. 먼저 unknown으로 받고 객체·필드·값 타입을 확인해야 해요.',
    starter: 'const payload = JSON.parse(text) as { count: number };', solution: 'const payload: unknown = JSON.parse(text);',
  },
  {
    title: '통합 테스트·접근성·회고', objective: '프로젝트의 타입 계약, 실행 동작, 접근성과 버전 근거를 함께 검토해요.', days: ['타입 테스트와 런타임 테스트', '정상·경계·오류 사례', '키보드와 화면 흐름', '버전·공식 출처 확인', '회귀 리뷰와 다음 계획'],
    rule: '타입 검사는 프로그램 구조를, 런타임 테스트는 선택한 입력의 동작을 검사하며 키보드·접근성·버전 근거도 각각 확인해야 해요.', wrong: ['타입 검사가 통과하면 키보드 접근성 검수도 끝나요.', '컴파일이 성공하면 모든 입력에 대한 정답이 증명돼요.'],
    example: 'function average(values: readonly number[]): number {\n  if (values.length === 0) return 0;\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconsole.log(average([__DAY__, 2]));', answer: (day) => String((day + 2) / 2),
    bug: ['function average(values: readonly number[]): number {', '  return values.reduce((sum, value) => sum + value) / values.length;', '}', ''], line: 2, diagnosis: '2번 줄은 초기값 없는 reduce를 빈 배열에 호출하고 0 나눗셈도 가능해요. 빈 목록 정책과 누적 초기값을 테스트하고 구현하세요.',
    starter: 'function average(values: readonly number[]): number { return values.reduce((sum, value) => sum + value) / values.length; }', solution: 'function average(values: readonly number[]): number { if (values.length === 0) return 0; return values.reduce((sum, value) => sum + value, 0) / values.length; }',
  },
];

const finalReviewDays = [
  {
    example: 'function total(values: readonly number[]): number {\n  return values.reduce((sum, value) => sum + value, 0);\n}\nconsole.log(total([1, 2]));',
    answer: '3',
    rule: '정적 타입 검사는 선언된 계약을 확인하고, 실행 테스트는 선택한 입력의 실제 결과를 확인해요.',
    wrong: ['TypeScript 타입 표기는 외부 JSON의 값을 실행 중 자동 검증해요.', '몇 개 테스트가 통과하면 모든 입력의 동작이 증명돼요.'],
    bug: ['function total(values: readonly number[]): number {', '  return values[0];', '}'],
    line: 2,
    diagnosis: '2번 줄은 빈 배열에서 undefined를 반환해 number 계약을 깨뜨릴 수 있어요. 빈 입력을 포함한 실행 사례를 정해 확인하세요.',
  },
  {
    example: 'function average(values: readonly number[]): number | null {\n  if (values.length === 0) return null;\n  return values.reduce((sum, value) => sum + value, 0) / values.length;\n}\nconsole.log(average([]));',
    answer: 'null',
    rule: '정상·빈 경계·잘못된 외부 입력의 기대 결과를 각각 정하고, 타입 표기만으로 런타임 값이 검증된다고 가정하지 않아요.',
    wrong: ['빈 배열 평균은 0을 0으로 나눈 결과를 그대로 돌려줘요.', 'number 타입 표기가 실행 중 숫자가 아닌 JSON 값을 자동으로 거부해요.'],
    bug: ['function average(values: readonly number[]): number {', '  return values.reduce((sum, value) => sum + value) / values.length;', '}'],
    line: 2,
    diagnosis: '2번 줄은 빈 배열에 초기값 없는 reduce를 호출하고 0으로 나눌 수 있어요. 빈 입력 정책을 먼저 정하고 누적 초기값을 전달하세요.',
  },
  {
    example: 'const saveMarkup = \'<button type="button">저장</button>\';\nconsole.log(saveMarkup);',
    answer: '<button type="button">저장</button>',
    rule: 'TypeScript 타입 검사는 화면의 키보드 조작을 증명하지 않으므로 실제 브라우저에서 Tab·Enter·Space 흐름을 확인해요.',
    wrong: ['TypeScript 컴파일이 통과하면 버튼의 키보드 조작도 검증돼요.', '클릭 처리기가 있으면 div와 button의 키보드 의미가 같아요.'],
    bug: ['const save = document.createElement("div");', 'save.addEventListener("click", submit);'],
    line: 1,
    diagnosis: '1번 줄은 일반 div를 사용해 버튼의 기본 초점·키보드 동작을 제공하지 않아요. 의미가 있는 button 요소를 사용하고 실제 키보드 흐름을 확인하세요.',
  },
  {
    example: 'const verification = { typescript: "6.0.3", mode: "transpile-only" } as const;\nconsole.log(verification.typescript);',
    answer: '6.0.3',
    rule: '검수 버전·공식 출처·실행 범위를 함께 기록하고, 코드 변환 성공과 정적 타입 검사를 구분해요.',
    wrong: ['"latest"라고만 기록하면 같은 환경을 다시 만들 수 있어요.', '코드 변환이 성공하면 정적 타입 검사도 끝난 거예요.'],
    bug: ['const verification = { typescript: "latest", mode: "checked" };'],
    line: 1,
    diagnosis: '1번 줄은 이동 가능한 latest 표기를 사용하고 실제 실행기는 변환만 한다는 사실도 감춥니다. 확인한 버전과 실행 범위를 정확히 적으세요.',
  },
  {
    example: 'const regressionCases = ["normal", "empty", "invalid"];\nconsole.log(regressionCases.length);',
    answer: '3',
    rule: '새 동작뿐 아니라 기존 정상·경계·오류 사례를 함께 다시 실행하고, 남은 약점을 다음 계획으로 연결해요.',
    wrong: ['정상 입력 하나만 통과하면 회귀 검토가 끝나요.', '새 기능이 추가되면 이전 사례는 더 확인할 필요가 없어요.'],
    bug: ['const regressionCases = ["normal"];', 'console.log(regressionCases.length);'],
    line: 1,
    diagnosis: '1번 줄은 정상 사례만 담고 빈 값과 오류 사례를 빠뜨렸습니다. 변경 전 동작과 새 경계 사례를 함께 회귀 목록에 넣으세요.',
  },
];

const substitute = (text, day, topic) => text.replaceAll('__DAY__', String(day)).replaceAll('__TOPIC__', topic);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phaseFor = (week) => phases.find((phase) => week >= phase.startWeek && week <= phase.endWeek);
const difficultyFor = (week) => week <= 4 ? '입문' : week <= 8 ? '기초' : week <= 16 ? '중급' : week <= 21 ? '고급' : '실전';
const weekIntros = {
  22: '수업을 찾는 기준부터 상태와 저장 형식까지 차례로 정리해 학습 기록 도구의 설계도를 만들어요.',
  23: '요청을 앱에서 쓰는 자료로 바꾸고, 계산과 실패 처리까지 이어지는 핵심 기능을 구현해요.',
};

function makeExercises(week, day) {
  const plan = weeks[week - 1];
  const review = typescriptReviewedWeeks[week]?.[day - 1] ?? (week === 26 ? finalReviewDays[day - 1] : null);
  const title = plan.days[day - 1];
  const exerciseStem = 'ts-w' + String(week).padStart(2, '0') + '-d' + day;
  const idVersion = review?.idVersion ?? (typescriptReviewedWeeks[week] ? 2 : 1);
  const id = exerciseStem + '-v' + idVersion;
  const example = review?.example ?? `${substitute(plan.example, day, title)}\n// ${week}주차 ${day}일차 · ${title}`;
  const choices = [review?.rule ?? plan.rule, ...(review?.wrong?.map((item) => Array.isArray(item) ? item[0] : item) ?? plan.wrong)];
  const answerIndex = review?.answerIndex ?? (week + day) % choices.length;
  const correct = choices.shift();
  choices.splice(answerIndex, 0, correct);
  const conceptPrompt = review?.conceptPrompt ?? ('TypeScript ' + week + '주차 ' + day + '일차의 ' + title + ' 사례에서 맞는 설명을 고르세요.');
  const concept = choice(
    id + '-choice',
    title + ' 개념 확인',
    conceptPrompt + '\n\n' + example,
    choices.map((text) => [
      text,
      text === correct
        ? review?.correctExplanation ?? ('이 설명은 ' + title + '의 실제 TypeScript 규칙과 맞아요.')
        : review?.wrong?.find((item) => Array.isArray(item) && item[0] === text)?.[1] ?? ('“' + text + '”는 ' + title + '의 타입 계약과 맞지 않아요.'),
    ]),
    answerIndex,
    review?.conceptHint ?? '실제 값의 타입과 선언한 타입을 대조하세요.',
    review?.correctExplanation ?? (plan.rule + ' 예시 코드의 값과 타입 정보를 구분하면 판단할 수 있어요.'),
  );
  if (idVersion > 2) concept.legacyIds = [exerciseStem + '-v2-choice', exerciseStem + '-choice'];
  const traceAnswer = review?.answer ?? plan.answer(day);
  const trace = shortAnswer(
    exerciseStem + '-trace-v' + (review?.traceVersion ?? (idVersion > 2 ? 4 : 3)),
    title + ' 결과 추적',
    'TypeScript ' + week + '주차 ' + day + '일차 예제를 줄마다 읽고 마지막 결과를 입력하세요.\n\n' + example,
    [traceAnswer],
    review?.traceHint ?? '실제 값과 분기 조건, 호출 결과를 추적하세요.',
    review?.traceExplanation ?? ('이 예제의 출력은 ' + traceAnswer + '입니다. ' + title + ' 규칙을 코드의 평가 순서에 적용해 보세요.'),
    'exact-output',
  );
  trace.legacyIds = idVersion > 2
    ? [exerciseStem + '-trace-v3', exerciseStem + '-v2-trace', exerciseStem + '-trace']
    : [...new Set([id + '-trace', exerciseStem + '-trace'])];
  const codeLines = [...(review?.bug ?? plan.bug).map((line) => substitute(line, day, title)), `// ${week}주차 ${day}일차 · ${title}`];
  const explanation = review?.diagnosis ?? plan.diagnosis;
  const locatePrompt = review?.locatePrompt ?? (week === 26 && day === 3
    ? '다음 HTML 조각에서 기본 키보드 조작을 제공하지 않는 요소가 선언된 줄을 고르세요.'
    : week === 26 && day === 4
      ? '다음 검수 기록에서 버전과 실행 범위를 잘못 표현한 줄을 고르세요.'
      : (week + '주차 ' + title + ' 예제에서 선언한 타입 계약을 깨뜨리는 줄을 선택하세요.'));
  const third = day === 5
    ? repairCode({
      id: id + '-repair',
      title: title + ' 코드 수정',
      prompt: (review?.repairPrompt ?? (week + '주차 ' + title + ' 예제의 타입 계약 오류를 고쳐 아래 코드가 의도한 계약을 만족하게 만드세요.')) + '\n\n' + (typescriptReviewedWeeks[week] ? review.starter : substitute(plan.starter, day, title)),
      language: 'TypeScript',
      starterCode: typescriptReviewedWeeks[week] ? review.starter : substitute(plan.starter, day, title),
      solutionPatterns: ['^' + escapeRegExp(typescriptReviewedWeeks[week] ? review.solution : substitute(plan.solution, day, title)) + '$'],
      acceptanceCriteria: {
        requirements: [review?.rule ?? plan.rule],
        constraints: review?.constraints ?? ['타입 단언으로 오류를 감추지 않아요.'],
        examples: [typescriptReviewedWeeks[week]
          ? { input: review.starter, output: review.solution }
          : { input: 'TypeScript 타입 계약', output: '계약에 맞는 수정 코드' }],
        tests: typescriptReviewedWeeks[week]
          ? [{ input: review.starter, expected: '등록된 수정 패턴과 불일치' }, { input: review.solution, expected: '등록된 전체 수정 패턴과 일치' }]
          : [{ input: '정상 타입 계약', expected: '통과' }, { input: '잘못된 타입 계약', expected: '수정' }],
      },
      gradingNote: '코드 수정 답안은 등록된 전체 코드 패턴과 비교합니다. 이 사이트의 TypeScript 편집기는 코드를 변환해 실행하지만 정적 타입 검사를 제공하지 않습니다.',
      hint: review?.repairHint ?? '변수 선언, 함수 계약, 실제 값의 타입을 나란히 비교하세요.', explanation,
    })
    : locateError(id + '-locate', title + ' 오류 줄 찾기', locatePrompt, 'TypeScript', codeLines, [review?.line ?? plan.line], review?.locateHint ?? '값의 실제 타입과 변수·함수에 선언된 타입을 대조하세요.', explanation);
  if (idVersion > 2) third.legacyIds = [exerciseStem + '-v2-' + (day === 5 ? 'repair' : 'locate'), exerciseStem + '-' + (day === 5 ? 'repair' : 'locate')];
  return [concept, trace, third];
}

function makeSession(week, day) {
  const plan = weeks[week - 1];
  const review = typescriptReviewedWeeks[week]?.[day - 1] ?? (week === 26 ? finalReviewDays[day - 1] : null);
  const title = plan.days[day - 1];
  const example = review?.example ?? `${substitute(plan.example, day, title)}\n// ${week}주차 ${day}일차 · ${title}`;
  return studySession(day, day + '일차 · ' + title, review?.objective ?? (title + '의 정적 타입 규칙과 실행 시 값을 구분해요.'), '예제의 타입과 실제 값을 따라가며, 마지막 문제에서 오늘 규칙을 써 봐요.', example, makeExercises(week, day));
}

const lessons = weeks.map((plan, index) => {
  const week = index + 1;
  const phase = phaseFor(week);
  const sessions = [1, 2, 3, 4, 5].map((day) => makeSession(week, day));
  return weeklyLesson({
    id: `typescript-week-${String(week).padStart(2, '0')}`,
    topicId: phase.id,
    week,
    title: `${week}주차 · ${plan.title}`,
    objective: plan.objective,
    intro: week === 1
      ? '이 사이트는 TypeScript 코드를 JavaScript로 바꿔 실행해요. 정적 타입 오류를 확인하는 검사는 따로 하지 않아요. ' + plan.rule
      : weekIntros[week] ?? plan.rule,
    points: [],
    example: sessions[0].example,
    sessions,
    difficulty: difficultyFor(week),
  });
});

export const typescriptCourseExpansion = {
  phases,
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: 26 }, (_, index) => index + 1),
};
