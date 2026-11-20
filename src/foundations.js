import { foundationsWeek02 } from './foundations-week-02.js';
import { foundationsWeeks03And04 } from './foundations-weeks-03-04.js';
import { foundationsWeeks05To13 } from './foundations-weeks-05-13.js';
import { foundationsWeeks14And15 } from './foundations-weeks-14-15.js';
import { foundationsWeeks16And17 } from './foundations-weeks-16-17.js';
import { foundationsWeeks18To21 } from './foundations-weeks-18-21.js';
import { foundationsWeeks22To26 } from './foundations-weeks-22-26.js';

const activity = (time, title, prompt) => ({ time, title, prompt });

const choice = (id, title, prompt, choices, answer, choiceExplanations, hint, explanation) => ({
  id,
  type: 'choice',
  title,
  prompt,
  choices: choices.map(([optionId, text]) => ({ id: optionId, text })),
  answer,
  choiceExplanations,
  hint,
  explanation,
});

const shortAnswer = (id, title, prompt, acceptedAnswers, hint, explanation) => ({
  id,
  type: 'short-answer',
  title,
  prompt,
  acceptedAnswers,
  hint,
  explanation,
});

const locate = (id, title, prompt, codeLines, answerLines, hint, explanation) => ({
  id,
  type: 'locate-error',
  title,
  prompt,
  codeLines,
  answerLines,
  hint,
  explanation,
});

const days = [
  {
    number: 1,
    title: '절대 경로와 상대 경로',
    objective: '경로가 기준 위치에 따라 어떻게 해석되는지 구분해요.',
    intro: '절대 경로는 파일 시스템의 루트부터 시작하고, 상대 경로는 현재 작업 위치를 기준으로 해석해요. 예제의 `/workspace`는 POSIX 표기예요. Windows에서는 `C:\\workspace\\app\\src\\main.js`처럼 드라이브 문자를 포함해요. 화면에 표시된 작업 위치부터 확인해 보세요.',
    example: '현재 위치: /workspace/app\n상대 경로: src/main.js\n결과 위치: /workspace/app/src/main.js',
    activities: [
      activity('15분', '경로 카드 분류', '절대 경로와 상대 경로를 나누고 경로가 어디에서 시작하는지 표시해요.'),
      activity('25분', '기준 위치 바꾸기', '같은 상대 경로를 다른 현재 위치에서 해석해 결과가 달라지는지 비교해요.'),
      activity('20분', '작업 위치 점검', '명령 기록에서 현재 위치와 파일 경로를 함께 읽어 오류 원인을 찾아요.'),
    ],
    exercises: [
      choice('foundation-w01-d01-q01', '절대 경로 알아보기', '다음 중 파일 시스템의 루트부터 파일 위치를 나타내는 **절대 경로**는 무엇인가요?', [
        ['a', '`src/main.js`'], ['b', '`/workspace/app/src/main.js`'], ['c', '`../main.js`'],
      ], 'b', {
        a: '현재 작업 폴더에 따라 다른 위치를 가리킬 수 있는 상대 경로예요.',
        b: '이 POSIX 예제에서는 맨 앞의 `/`가 루트 디렉터리를 나타내므로 절대 경로예요.',
        c: '`..`을 사용해 현재 위치의 부모 폴더를 기준으로 이동하는 상대 경로예요.',
      }, '경로 맨 앞에서 기준 위치가 고정되는 표시가 있는지 살펴보세요.', 'POSIX 표기에서는 `/`, Windows 경로에서는 `C:\\` 같은 드라이브 루트에서 시작해요. 상대 경로는 현재 작업 위치에 따라 해석돼요.'),
      shortAnswer('foundation-w01-d01-q02', '파일까지의 상대 경로 쓰기', '현재 위치가 `/workspace/app`이고 파일이 그 안의 `src` 폴더에 있는 `main.js`예요. 현재 위치에서 파일까지의 상대 경로를 적어 보세요.', ['src/main.js', './src/main.js', 'src\\main.js', '.\\src\\main.js'], '현재 위치 아래에 있는 폴더 이름부터 순서대로 적으면 돼요.', '상대 경로는 현재 위치부터 시작하므로 `src/main.js`예요. 운영체제에 따라 `/` 대신 `\\`를 쓸 수도 있어요.'),
      choice('foundation-w01-d01-q03', '부모 폴더로 이동하기', '현재 위치가 `/workspace/app/src`일 때 경로 `..`으로 이동하면 어디에 도착하나요?', [
        ['a', '`/workspace/app`'], ['b', '`/workspace/app/src`'], ['c', '`/workspace`'],
      ], 'a', {
        a: '`..`은 현재 폴더의 바로 위 부모 폴더를 뜻해요.',
        b: '현재 위치를 그대로 적은 값이에요. `..`은 한 단계 위로 이동해요.',
        c: '두 단계 위의 위치예요. `/workspace/app/src`에서 한 번 이동하면 `/workspace/app`이에요.',
      }, '`..`은 여러 단계가 아니라 바로 위 폴더 하나를 가리켜요.', '현재 폴더 `src`의 부모가 `app`이므로 `/workspace/app`에 도착해요.'),
    ],
  },
  {
    number: 2,
    title: '폴더 트리에서 파일 찾기',
    objective: '폴더 구조를 읽고 파일까지 이어지는 경로를 만들어요.',
    intro: '폴더 트리는 파일이 어떤 폴더 안에 있는지 보여 줘요. 현재 위치에서 시작해 아래로 들어가거나 `..`으로 올라가는 순서를 확인해요.',
    example: 'app/\n├── docs/\n│   └── guide.md\n└── src/\n    └── main.js',
    activities: [
      activity('15분', '트리 구조 읽기', '들여쓰기와 선 모양으로 부모 폴더와 파일의 포함 관계를 표시해요.'),
      activity('25분', '파일 경로 조합', '프로젝트 기준 위치에서 목표 파일까지 폴더 이름을 순서대로 이어요.'),
      activity('20분', '경로 추적 연습', '`..` 이동과 하위 폴더 이동을 한 단계씩 따라가요.'),
    ],
    exercises: [
      choice('foundation-w01-d02-q01', '트리에서 전체 위치 찾기', '현재 위치가 `/workspace/app`일 때 `docs/guide.md`가 가리키는 전체 위치는 무엇인가요?', [
        ['a', '`/workspace/docs/guide.md`'], ['b', '`/workspace/app/docs/guide.md`'], ['c', '`/workspace/app/src/guide.md`'],
      ], 'b', {
        a: '`app` 폴더를 기준으로 삼아야 하는데 한 단계 위로 올라갔어요.',
        b: '현재 위치 아래 `docs` 폴더와 그 안의 `guide.md`를 이어 붙였어요.',
        c: '예제 트리에서 `guide.md`는 `src`가 아니라 `docs` 안에 있어요.',
      }, '현재 위치 뒤에 상대 경로의 폴더와 파일 이름을 차례로 붙여 보세요.', '현재 위치 `/workspace/app`에서 `docs/guide.md`를 열면 `/workspace/app/docs/guide.md`예요.'),
      shortAnswer('foundation-w01-d02-q02', '부모 폴더의 설정 파일 찾기', '현재 위치는 `/workspace/app/tests`예요. 한 단계 위인 프로젝트 폴더의 `package.json`까지 가는 상대 경로를 적어 보세요.', ['../package.json', '..\\package.json'], '`..`으로 `tests`에서 `app`으로 올라간 뒤 파일 이름을 붙여요.', '`tests`의 부모가 `app`이므로 `../package.json`이에요.'),
      choice('foundation-w01-d02-q03', '두 번 올라간 뒤 이동하기', '현재 위치 `/workspace/app/src/components`에서 `../../logs/build.txt`로 이동하면 어느 파일인가요?', [
        ['a', '`/workspace/app/src/logs/build.txt`'], ['b', '`/workspace/logs/build.txt`'], ['c', '`/workspace/app/logs/build.txt`'],
      ], 'c', {
        a: '`..`을 한 번만 적용한 위치예요. 경로에는 두 번 올라가라는 표시가 있어요.',
        b: '`..`을 세 번 적용한 결과예요. 두 번만 올라가야 해요.',
        c: 'components에서 src로 한 번, app으로 한 번 올라간 뒤 logs/build.txt로 이동해요.',
      }, '각 `..`을 순서대로 한 번씩 적용하고 나머지 경로를 따라가 보세요.', '두 단계 위인 `/workspace/app`에 도착한 다음 `logs/build.txt`로 이동해요.'),
    ],
  },
  {
    number: 3,
    title: '프로젝트의 시작 위치와 구조',
    objective: '프로젝트 루트를 찾고 루트 기준 경로를 구성해요.',
    intro: '프로젝트 루트는 프로젝트 파일이 모이는 기준 폴더예요. README나 빌드 설정 파일을 단서로 찾고, 그 위치에서 하위 경로를 읽어요.',
    example: 'course-app/\n├── package.json\n├── README.md\n└── src/\n    └── main.js',
    activities: [
      activity('15분', '루트 단서 찾기', '프로젝트의 안내 파일과 설정 파일이 모인 폴더를 찾아 표시해요.'),
      activity('25분', '루트에서 경로 만들기', '루트 폴더를 기준으로 소스 파일의 상대 경로를 적어요.'),
      activity('20분', '잘못된 기준 고치기', '다른 폴더에서 실행한 명령이 왜 파일을 찾지 못했는지 설명해요.'),
    ],
    exercises: [
      choice('foundation-w01-d03-q01', '프로젝트 루트 찾기', '예제 트리에서 프로젝트 루트는 어느 폴더인가요?', [
        ['a', '`course-app`'], ['b', '`src`'], ['c', '`main.js`'],
      ], 'a', {
        a: '프로젝트 폴더 전체의 시작이며 설정 파일과 README가 바로 안에 있어요.',
        b: '소스 코드가 들어 있는 하위 폴더예요.',
        c: '폴더가 아니라 파일 이름이에요.',
      }, 'README와 설정 파일을 바로 포함하는 가장 바깥 프로젝트 폴더를 찾아보세요.', '트리의 가장 바깥 폴더 `course-app`이 프로젝트 루트예요.'),
      choice('foundation-w01-d03-q02', '루트 기준 소스 파일 찾기', '현재 위치를 `course-app` 프로젝트 루트로 맞췄어요. `main.js`까지의 상대 경로는 무엇인가요?', [
        ['a', '`main.js`'], ['b', '`src/main.js`'], ['c', '`course-app/src/main.js`'],
      ], 'b', {
        a: '파일은 현재 위치 바로 안이 아니라 `src` 폴더 안에 있어요.',
        b: '루트 아래 `src` 폴더를 지나 `main.js`에 도착해요.',
        c: '이미 루트 안에 있으므로 루트 폴더 이름을 경로에 다시 붙이지 않아요.',
      }, '루트 이름을 반복하지 말고 루트 아래에 있는 폴더부터 적어 보세요.', '`course-app` 루트에서 `src/main.js`로 찾아가면 돼요.'),
      shortAnswer('foundation-w01-d03-q03', '소스 폴더에서 README로 돌아가기', '현재 위치가 `/work/course-app/src`이고 README가 `/work/course-app/README.md`에 있어요. README까지의 상대 경로를 적어 보세요.', ['../README.md', '..\\README.md'], '먼저 `src`에서 프로젝트 루트로 한 단계 올라가야 해요.', '`src`의 부모가 프로젝트 루트이므로 `../README.md`예요.'),
    ],
  },
  {
    number: 4,
    title: '현재 작업 디렉터리 바뀌기',
    objective: '`cd` 이동 뒤 현재 위치가 바뀌는 순서를 추적해요.',
    intro: '상대 경로를 읽을 때는 명령을 실행하는 현재 작업 디렉터리가 중요해요. `cd`로 이동한 뒤에는 다음 명령의 기준 위치도 달라집니다.',
    example: 'pwd → /work/course-app\ncd src\npwd → /work/course-app/src',
    activities: [
      activity('15분', '현재 위치 읽기', '기록된 `pwd` 결과를 작업 디렉터리로 적어요.'),
      activity('25분', '명령을 순서대로 실행해 보기', '`cd` 한 줄마다 경로를 다시 계산하고 다음 명령의 기준을 바꿔요.'),
      activity('20분', '잘못된 이동 진단', '현재 위치를 놓쳐 두 번 중첩된 폴더를 찾는 명령을 고쳐요.'),
    ],
    exercises: [
      choice('foundation-w01-d04-q01', '이동 뒤 현재 위치 추적', '다음 기록을 따라간 마지막 현재 위치는 어디인가요?\n\n`pwd → /work/course-app`\n`cd src`', [
        ['a', '`/work/course-app`'], ['b', '`/work/course-app/src`'], ['c', '`/src`'],
      ], 'b', {
        a: '`cd src`를 실행하기 전의 위치예요.',
        b: '프로젝트 위치 아래 `src` 폴더로 이동한 결과예요.',
        c: '상대 경로 `src`는 루트가 아니라 현재 위치인 `/work/course-app`을 기준으로 해석돼요.',
      }, '`cd` 뒤에는 현재 위치 아래의 `src`로 이동해요.', '이동 전 위치에 `src`를 붙인 `/work/course-app/src`가 마지막 위치예요.'),
      shortAnswer('foundation-w01-d04-q02', '프로젝트 루트로 돌아가기', 'Bash와 PowerShell에서 모두 사용할 수 있는 명령으로, 현재 위치 `/work/course-app/src`에서 프로젝트 루트 `/work/course-app`으로 돌아가는 이동 명령을 적어 보세요.', ['cd ..'], '`cd` 명령과 부모 폴더 표시 `..` 사이에 공백을 넣으세요.', '두 셸에서 `cd ..`은 현재 폴더 `src`의 부모인 프로젝트 루트로 이동해요.'),
      locate('foundation-w01-d04-q03', '존재하지 않는 중첩 경로 찾기', '트리에서 `src/components`는 프로젝트 루트 바로 아래에 있어요. 현재 위치가 프로젝트 루트일 때, 경로를 잘못 이어 붙인 줄을 선택하세요.', [
        'pwd → /work/course-app',
        'cd src',
        'cd src/components',
      ], [3], '`cd src` 뒤 현재 위치는 이미 `/work/course-app/src`예요. 다음 상대 경로를 다시 살펴보세요.', '3번째 줄은 현재 `src` 안에서 다시 `src/components`를 찾으므로 `/work/course-app/src/src/components`를 가리켜요. 루트에서 바로 실행할 경로와 혼동했어요. 현재 위치에서 `cd components`를 사용해야 해요.'),
    ],
  },
  {
    number: 5,
    title: '폴더 구조로 경로 종합하기',
    objective: '폴더 트리와 현재 위치를 함께 사용해 목표 파일까지 가요.',
    intro: '실제 작업에서는 프로젝트 루트, 현재 위치, 대상 파일의 경로를 한 번에 확인해야 해요. 이동 단계를 빠뜨리지 말고 하나씩 계산해 보세요.',
    example: 'study-site/\n├── README.md\n├── src/\n│   └── utils/\n│       └── format.js\n└── tests/\n    └── format.test.js',
    activities: [
      activity('15분', '프로젝트 구조 요약', '루트와 소스·테스트 폴더의 포함 관계를 간단한 그림으로 다시 그려요.'),
      activity('25분', '서로 다른 위치에서 파일 찾기', '현재 위치별로 같은 파일까지의 상대 경로를 계산해요.'),
      activity('20분', '하루 학습 정리', '절대·상대 경로와 현재 위치가 문제 해결에 미치는 영향을 짧게 설명해요.'),
    ],
    exercises: [
      choice('foundation-w01-d05-q01', '테스트 파일의 루트 기준 경로', '현재 위치가 `study-site` 프로젝트 루트예요. `format.test.js`까지의 상대 경로는 무엇인가요?', [
        ['a', '`tests/format.test.js`'], ['b', '`src/tests/format.test.js`'], ['c', '`format.test.js`'],
      ], 'a', {
        a: '프로젝트 루트 바로 아래 `tests` 안에 파일이 있어요.',
        b: '트리에서 `tests`는 `src` 안이 아니라 프로젝트 루트 바로 아래예요.',
        c: '파일이 루트 바로 아래 있지 않고 `tests` 폴더 안에 있어요.',
      }, '트리에서 `tests`의 들여쓰기가 루트 폴더 바로 아래인지 확인해요.', '`tests/format.test.js`로 이동하면 돼요.'),
      choice('foundation-w01-d05-q02', '소스 파일의 루트 기준 경로', '현재 위치가 프로젝트 루트예요. `format.js`까지의 상대 경로를 고르세요.', [
        ['a', '`utils/format.js`'], ['b', '`src/utils/format.js`'], ['c', '`src/format.js`'],
      ], 'b', {
        a: '`src` 폴더 단계를 빠뜨렸어요.',
        b: '`src` → `utils` 순서로 들어가면 파일에 도착해요.',
        c: '`utils` 하위 폴더 단계를 빠뜨렸어요.',
      }, '트리에서 루트 아래 첫 번째 폴더부터 파일까지 모두 이어 보세요.', '파일은 `src` 아래 `utils` 안에 있으므로 `src/utils/format.js`예요.'),
      shortAnswer('foundation-w01-d05-q03', '유틸리티 폴더에서 테스트 파일 찾기', '현재 위치가 `/study-site/src/utils`이고 목표 파일이 `/study-site/tests/format.test.js`예요. 현재 위치에서 시작하는 상대 경로를 적어 보세요.', ['../../tests/format.test.js', '..\\..\\tests\\format.test.js'], '먼저 `utils`에서 `src`로 올라가고, 한 번 더 올라가 프로젝트 루트로 가요.', '`../../`로 프로젝트 루트까지 올라간 뒤 `tests/format.test.js`로 들어가요.'),
    ],
  },
];

const lesson = {
  id: 'foundation-w01',
  trackId: 'foundations',
  topicId: 'foundations-tooling',
  title: '파일·폴더·경로 첫걸음',
  objective: '현재 위치와 폴더 구조를 읽고 필요한 파일까지의 경로를 정확히 찾습니다.',
  intro: '프로그램을 실행하거나 Git 명령을 쓰기 전에 파일이 어디에 있고 명령이 어느 위치에서 실행되는지 알아야 해요. 첫 주에는 폴더 트리와 경로를 읽고, 경로가 현재 위치를 기준으로 어떻게 바뀌는지 연습합니다.',
  difficulty: '입문',
  duration: '5일',
  week: 1,
  number: 1,
  stage: 1,
  referenceVersion: '운영체제 공통 파일·경로 개념',
  versionReviewedAt: '2026-10-16',
  contentReviewStatus: '문항 검수 완료',
  prerequisiteLessonIds: [],
  points: [
    'POSIX 절대 경로는 `/`에서, Windows 절대 경로는 `C:\\` 같은 드라이브 루트에서 시작해요.',
    '상대 경로는 현재 작업 위치를 기준으로 해석해요.',
    '`..`은 현재 위치의 부모 폴더 하나를 가리켜요.',
    '프로젝트 루트부터 경로를 계산할 때는 현재 위치가 루트인지 먼저 확인해요.',
  ],
  example: days[2].example,
  studyDays: days,
  sessions: days,
  exercises: days.flatMap((day) => day.exercises),
};

const topic = {
  id: 'foundations-tooling',
  stage: 1,
  title: '개발 환경과 도구',
  objective: '파일과 작업 위치를 이해한 뒤 터미널과 Git 학습으로 이어갑니다.',
  lessonIds: [lesson.id, foundationsWeek02.id],
};

const gitTopic = {
  id: 'foundations-git',
  stage: 1,
  title: 'Git 변경 기록과 복구',
  objective: '변경 상태를 살펴보고 필요한 파일만 기록한 뒤, 의도에 맞게 이력을 복구합니다.',
  lessonIds: foundationsWeeks03And04.map((week) => week.id),
};

const collaborationTopic = {
  id: 'foundations-git-collaboration',
  stage: 1,
  title: 'Git 브랜치와 협업',
  objective: '브랜치·병합·충돌·원격 공유·변경 리뷰 흐름을 순서대로 익힙니다.',
  lessonIds: foundationsWeeks05To13.filter((week) => week.week >= 5 && week.week <= 9).map((week) => week.id),
};

const debuggingTopic = {
  id: 'foundations-debugging',
  stage: 1,
  title: '로그와 오류 읽기',
  objective: '로그와 호출 경로를 근거로 재현 조건과 다음 확인을 찾습니다.',
  lessonIds: foundationsWeeks05To13.filter((week) => week.week >= 10 && week.week <= 12).map((week) => week.id),
};

const testingTopic = {
  id: 'foundations-testing',
  stage: 1,
  title: '테스트와 품질 확인',
  objective: '단위 테스트와 경계 사례로 요구된 동작과 수정 결과를 확인합니다.',
  lessonIds: [
    ...foundationsWeeks05To13.filter((week) => week.week === 13).map((week) => week.id),
    ...foundationsWeeks22To26.filter((week) => week.week === 24).map((week) => week.id),
  ],
};

const httpTopic = {
  id: 'foundations-http',
  stage: 2,
  title: 'HTTP 메시지와 캐시',
  objective: 'HTTP 요청·응답, 헤더, 상태와 조건부 캐시를 익힙니다.',
  lessonIds: foundationsWeeks14And15.map((week) => week.id),
};

const apiContractsTopic = {
  id: 'foundations-api-contracts',
  stage: 2,
  title: 'JSON·스키마·API 계약',
  objective: 'JSON 문법과 데이터 스키마, OpenAPI 요청·응답 계약을 연결합니다.',
  lessonIds: foundationsWeeks16And17.filter((week) => week.week === 16).map((week) => week.id),
};

const apiPracticeTopic = {
  id: 'foundations-api',
  stage: 2,
  title: 'REST API 실무',
  objective: '리소스·오류 응답·페이지네이션·재시도 흐름을 판단합니다.',
  lessonIds: foundationsWeeks16And17.filter((week) => week.week === 17).map((week) => week.id),
};

const sqlModelTopic = {
  id: 'foundations-sql-model', stage: 3, title: '관계형 데이터 모델',
  objective: '테이블·키·관계를 이해하고 데이터 중복과 제약을 줄입니다.',
  lessonIds: foundationsWeeks18To21.filter((week) => week.week === 18).map((week) => week.id),
};

const sqlQueryTopic = {
  id: 'foundations-sql-query', stage: 3, title: 'SQL 조회와 정렬',
  objective: 'SELECT·WHERE·ORDER BY·NULL 결과를 고정 표로 검산합니다.',
  lessonIds: foundationsWeeks18To21.filter((week) => week.week === 19).map((week) => week.id),
};

const sqlRelationsTopic = {
  id: 'foundations-sql-relations', stage: 3, title: 'SQL 집계와 조인',
  objective: '집계와 그룹 필터, INNER·LEFT JOIN 결과를 계산합니다.',
  lessonIds: foundationsWeeks18To21.filter((week) => week.week === 20).map((week) => week.id),
};

const sqlTransactionsTopic = {
  id: 'foundations-sql-transactions', stage: 3, title: 'SQL 변경과 트랜잭션',
  objective: '변경 영향 범위를 확인하고 커밋 전 롤백 가능성을 연습합니다.',
  lessonIds: foundationsWeeks18To21.filter((week) => week.week === 21).map((week) => week.id),
};

const securityTopic = {
  id: 'foundations-security', stage: 4, title: '설정·입력·보안 기초',
  objective: '비밀값과 외부 입력을 안전하게 다루고 신뢰 경계에서 검증합니다.',
  lessonIds: foundationsWeeks22To26.filter((week) => [22, 23].includes(week.week)).map((week) => week.id),
};

const deliveryTopic = {
  id: 'foundations-delivery', stage: 5, title: '리뷰와 출시 준비',
  objective: '요구사항·변경·검증 근거와 복구 계획을 리뷰합니다.',
  lessonIds: foundationsWeeks22To26.filter((week) => week.week === 25).map((week) => week.id),
};

const capstoneTopic = {
  id: 'foundations-capstone', stage: 5, title: '통합 캡스톤',
  objective: 'Git·테스트·API·SQL·보안을 연결해 가상 변경을 검토합니다.',
  lessonIds: foundationsWeeks22To26.filter((week) => week.week === 26).map((week) => week.id),
};

export const foundationsTrack = {
  id: 'foundations',
  title: '공통 실무 기초',
  category: '개발 실무',
  level: '처음부터',
  tone: 'mint',
  accent: '#4a9675',
  description: '언어에 상관없이 필요한 터미널, Git, 디버깅, HTTP, SQL과 테스트를 익혀요.',
  objective: '계정이나 설치를 요구하지 않는 실무 시나리오로 개발 작업의 기본 흐름을 연습해요.',
  prerequisites: ['없음 — 개발을 처음 시작해도 따라올 수 있어요.'],
  lessons: [lesson, foundationsWeek02, ...foundationsWeeks03And04, ...foundationsWeeks05To13, ...foundationsWeeks14And15, ...foundationsWeeks16And17, ...foundationsWeeks18To21, ...foundationsWeeks22To26],
  topics: [topic, gitTopic, collaborationTopic, debuggingTopic, testingTopic, httpTopic, apiContractsTopic, apiPracticeTopic, sqlModelTopic, sqlQueryTopic, sqlRelationsTopic, sqlTransactionsTopic, securityTopic, deliveryTopic, capstoneTopic],
  course: {
    weeks: 26,
    sessions: 130,
    questions: 390,
    phases: 8,
    contentStatus: '26주 전체 학습 가능 · 130회·390문항 검수 완료',
    reviewedWeeks: Array.from({ length: 26 }, (_, index) => index + 1),
  },
  contentReview: {
    status: '1–26주차 문항 검수 완료',
    reviewedAt: '2026-10-13',
    version: 'PowerShell 7.6 문서 · GNU Bash 5.3 · Git 2.56.0 · HTTP RFC 9110/9111 · RFC 9457 · OpenAPI 3.2.1 · PostgreSQL 18.6 · OWASP Cheat Sheets',
    versionContext: '파일·Git·디버깅·HTTP·SQL·입력 검증·테스트·리뷰를 실제 계정·원격 DB 없이 고정 사례로 연습합니다. PostgreSQL 18.6은 지원 중인 안정판이며 PostgreSQL 19 RC 1은 2026-10-15 발표된 정식 출시 전 후보입니다.',
    sources: [
      { label: 'PowerShell 7.6 경로 구문', url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax?view=powershell-7.6' },
      { label: 'POSIX.1-2024 절대·상대 경로 및 현재 작업 디렉터리', url: 'https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap03.html' },
      { label: 'PowerShell 7.6 따옴표 규칙', url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules?view=powershell-7.6' },
      { label: 'PowerShell 7.6 자동 변수', url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6' },
      { label: 'GNU Bash 설명서', url: 'https://www.gnu.org/software/bash/manual/bash.html' },
      { label: 'Git 공식 참고 문서', url: 'https://git-scm.com/docs' },
      { label: 'Git 사용자 설명서·최신 문서 갱신 2.56.0', url: 'https://git-scm.com/docs/user-manual' },
      { label: 'Git add: 다음 커밋 내용 준비', url: 'https://git-scm.com/docs/git-add' },
      { label: 'Git diff: 변경 내용 비교', url: 'https://git-scm.com/docs/git-diff' },
      { label: 'Git restore: 파일·스테이징 복원', url: 'https://git-scm.com/docs/git-restore' },
      { label: 'Git revert: 반대 커밋 만들기', url: 'https://git-scm.com/docs/git-revert' },
      { label: 'Pro Git 한국어판', url: 'https://git-scm.com/book/ko/v2' },
      { label: 'Git branch: 브랜치 관리', url: 'https://git-scm.com/docs/git-branch' },
      { label: 'Git switch: 브랜치 전환', url: 'https://git-scm.com/docs/git-switch' },
      { label: 'Git merge: 브랜치 통합', url: 'https://git-scm.com/docs/git-merge' },
      { label: 'Git fetch: 원격 정보 가져오기', url: 'https://git-scm.com/docs/git-fetch' },
      { label: 'Git pull: 가져오기와 통합', url: 'https://git-scm.com/docs/git-pull' },
      { label: 'Git push: 원격으로 보내기', url: 'https://git-scm.com/docs/git-push' },
      { label: 'GitHub Pull Request 참고', url: 'https://docs.github.com/en/pull-requests/reference/pull-requests' },
      { label: 'GitHub secret scanning', url: 'https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning' },
      { label: 'GitHub push protection', url: 'https://docs.github.com/en/code-security/concepts/secret-security/push-protection' },
      { label: 'Chrome DevTools Console', url: 'https://developer.chrome.com/docs/devtools/console' },
      { label: 'Node.js 26.12.0 test runner', url: 'https://nodejs.org/api/test.html' },
      { label: 'MDN JavaScript arrays and missing indexes', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Language_overview#arrays' },
      { label: 'HTTP Semantics (RFC 9110)', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
      { label: 'HTTP Caching (RFC 9111)', url: 'https://www.rfc-editor.org/rfc/rfc9111.html' },
      { label: 'JSON Data Interchange Format (RFC 8259)', url: 'https://www.rfc-editor.org/rfc/rfc8259' },
      { label: 'Problem Details for HTTP APIs (RFC 9457)', url: 'https://www.rfc-editor.org/rfc/rfc9457.html' },
      { label: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { label: 'OpenAPI Specification 3.2.1', url: 'https://spec.openapis.org/oas/v3.2.1.html' },
      { label: 'PostgreSQL supported versions', url: 'https://www.postgresql.org/support/versioning/' },
      { label: 'PostgreSQL 19 RC 1 release status', url: 'https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/' },
      { label: 'PostgreSQL 18.6 release notes', url: 'https://www.postgresql.org/docs/18/release-18-6.html' },
      { label: 'PostgreSQL 18 tutorial', url: 'https://www.postgresql.org/docs/18/tutorial.html' },
      { label: 'PostgreSQL SELECT and GROUP BY', url: 'https://www.postgresql.org/docs/18/sql-select.html' },
      { label: 'PostgreSQL table expressions and joins', url: 'https://www.postgresql.org/docs/18/queries-table-expressions.html' },
      { label: 'PostgreSQL aggregate functions', url: 'https://www.postgresql.org/docs/18/functions-aggregate.html' },
      { label: 'PostgreSQL comparisons and NULL', url: 'https://www.postgresql.org/docs/18/functions-comparison.html' },
      { label: 'PostgreSQL constraints', url: 'https://www.postgresql.org/docs/18/ddl-constraints.html' },
      { label: 'PostgreSQL transactions tutorial', url: 'https://www.postgresql.org/docs/18/tutorial-transactions.html' },
      { label: 'OWASP Secrets Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
      { label: 'OWASP CI/CD Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html' },
      { label: 'OWASP Input Validation Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' },
      { label: 'OWASP Authorization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      { label: 'OWASP Cross Site Scripting Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
      { label: 'GitHub Actions concepts', url: 'https://docs.github.com/en/actions/get-started/understand-github-actions' },
      { label: 'Docker container concepts', url: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/' },
      { label: 'npm package lock files', url: 'https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/' },
    ],
  },
};

export const foundationsWeeks = foundationsTrack.lessons;
