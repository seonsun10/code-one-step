import { curriculumAdditions } from './curriculum-additions.js';

export const exerciseTypes = new Set([
  'choice',
  'short-answer',
  'locate-error',
  'repair-code',
  'coding',
]);

export const tracks = [
  {
    id: 'javascript',
    title: 'JavaScript',
    short: 'JS',
    category: '프로그래밍 언어',
    level: '처음부터',
    tone: 'yellow',
    accent: '#f2b847',
    description: '변수부터 조건, 반복, 함수와 배열까지 익혀요.',
    objective: '조건과 반복부터 함수와 배열까지 JavaScript 기초를 단계별로 익혀요.',
    prerequisites: ['없음 — 처음 시작해도 따라올 수 있어요.'],
    lessons: [
      {
        id: 'js-variables',
        topicId: 'javascript-values',
        title: '변수와 상수',
        difficulty: '기초',
        duration: '6분',
        objective: '값이 바뀌는 데이터와 바뀌지 않는 데이터를 구분해요.',
        intro:
          '프로그램은 이름표가 붙은 상자에 값을 담아 사용해요. `const`는 다시 다른 값을 담지 않을 때, `let`은 실행 중 값이 달라질 때 선택합니다.',
        points: [
          '`const`로 만든 이름에는 새 값을 다시 할당할 수 없어요.',
          '`let`은 다시 할당할 수 있지만 같은 블록에서 같은 이름을 또 선언할 수는 없어요.',
          '기본값은 `const`로 두고, 실제로 다시 할당해야 할 때 `let`을 사용하면 의도가 분명해져요.',
        ],
        example: 'const course = "JavaScript";\nlet lessonsDone = 0;\nlessonsDone = lessonsDone + 1;',
        exercise: {
          id: 'js-variables-choice',
          type: 'choice',
          title: '어떤 선언이 맞을까요?',
          prompt: '학습 코스 이름은 한 번 정하면 바뀌지 않습니다. 어떤 선언을 쓰는 게 가장 알맞을까요?',
          choices: [
            { id: 'a', text: '`let course = "JavaScript"`' },
            { id: 'b', text: '`const course = "JavaScript"`' },
            { id: 'c', text: '`var course = "JavaScript"`' },
          ],
          choiceExplanations: {
            a: '`let`은 값을 다시 대입할 수 있어요. 고정할 이름이라는 의도에는 `const`가 더 알맞아요.',
            b: '다시 대입할 필요가 없는 이름에는 `const`를 사용해 실수로 값이 바뀌지 않게 할 수 있어요.',
            c: '`var`도 값을 담지만 범위와 재선언 규칙이 다릅니다. 이 예제에는 재할당을 제한하는 `const`가 더 분명해요.',
          },
          answer: 'b',
          hint: '다시 할당하지 않을 이름에는 어떤 선언을 먼저 고려하면 좋을까요?',
          explanation:
            '`const`는 재할당을 막아 값이 바뀌면 안 되는 의도를 표현합니다. 나중에 변수 선언을 다시 읽을 때도 데이터의 역할을 쉽게 알 수 있어요.',
        },
      },
      {
        id: 'js-arrays',
        topicId: 'javascript-functions',
        title: '배열을 다루는 함수',
        difficulty: '기초',
        duration: '10분',
        objective: '배열의 값을 입력으로 받아 원하는 결과를 반환해요.',
        intro:
          '배열은 여러 값을 순서대로 모아 둔 자료형이에요. 함수에 배열을 전달하고, 반복문이나 배열 메서드로 각 값을 다뤄 보세요.',
        points: [
          '배열의 첫 번째 위치는 0번 인덱스예요.',
          '`reduce`는 여러 값을 하나의 결과로 모을 때 쓸 수 있어요.',
          '함수가 결과를 돌려줘야 테스트 코드가 값을 비교할 수 있어요.',
        ],
        example: 'const total = [2, 3, 4].reduce((sum, value) => sum + value, 0);',
        exercise: {
          id: 'js-sum-coding',
          type: 'coding',
          title: '숫자 배열의 합 구하기',
          prompt: '숫자가 담긴 배열을 받아 모든 숫자의 합을 반환하는 `sumNumbers` 함수를 작성하세요. 빈 배열의 합은 0입니다.',
          entryPoint: 'sumNumbers',
          starterCode: 'function sumNumbers(numbers) {\n  // 배열에 담긴 모든 숫자를 더해 반환하세요.\n  return 0;\n}',
          tests: [
            { input: [[2, 3, 4]], expected: 9 },
            { input: [[-1, 6]], expected: 5 },
            { input: [[]], expected: 0 },
          ],
          hint: '`reduce`의 두 번째 인자로 시작값 0을 전달할 수 있어요.',
          explanation:
            '각 숫자를 누적값에 더하고, 누적의 시작값을 0으로 두면 빈 배열도 자연스럽게 처리할 수 있어요. 예를 들면 `numbers.reduce((sum, number) => sum + number, 0)`입니다.',
        },
      },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    short: 'Py',
    category: '프로그래밍 언어',
    level: '처음부터',
    tone: 'blue',
    accent: '#6387e8',
    description: '조건과 반복부터 함수와 리스트까지 익혀요.',
    objective: '조건과 반복을 익히고 함수로 리스트 데이터를 처리해요.',
    prerequisites: ['없음 — 처음 시작해도 따라올 수 있어요.'],
    lessons: [
      {
        id: 'py-lists',
        topicId: 'python-functions',
        title: '리스트의 평균',
        difficulty: '기초',
        duration: '7분',
        objective: '리스트의 합과 원소 수로 평균을 설명해요.',
        intro:
          'Python의 리스트는 여러 값을 한 곳에 순서대로 담습니다. 평균은 원소를 모두 더한 뒤 원소의 개수로 나누어 구해요.',
        points: [
          '`sum(scores)`는 숫자 리스트의 합을 구해요.',
          '`len(scores)`는 리스트에 들어 있는 원소 수를 돌려줘요.',
          '빈 리스트를 나누기 전에 어떻게 다룰지 먼저 정하는 것이 좋아요.',
        ],
        example: 'scores = [70, 80, 90]\naverage = sum(scores) / len(scores)',
        exercise: {
          id: 'py-average-short',
          type: 'short-answer',
          title: '평균을 어떻게 구할까요?',
          prompt: '`scores`가 비어 있지 않은 숫자 리스트일 때 평균을 계산하는 Python 표현식을 적어 보세요.',
          answerNormalization: 'python-expression',
          acceptedAnswers: [
            'sum(scores) / len(scores)',
            'sum(scores)/len(scores)',
          ],
          hint: '리스트의 합과 리스트 길이를 각각 구하는 내장 함수가 있어요.',
          explanation:
            '`sum(scores) / len(scores)`가 평균을 계산합니다. 실제 프로그램에서는 리스트가 비어 있지 않은지도 확인해야 0으로 나누는 오류를 피할 수 있어요.',
        },
      },
    ],
  },
  {
    id: 'java',
    title: 'Java',
    short: 'Jv',
    category: '프로그래밍 언어',
    level: '기초',
    tone: 'coral',
    accent: '#ec846a',
    description: '자료형과 제어 흐름부터 메서드와 객체까지 배워요.',
    objective: '타입과 제어 흐름을 익히고 메서드와 객체로 코드를 구성해요.',
    prerequisites: ['없음 — 처음 시작해도 따라올 수 있어요.'],
    lessons: [
      {
        id: 'java-loops',
        topicId: 'java-control',
        title: '반복문의 범위 확인',
        difficulty: '기초',
        duration: '8분',
        objective: '배열 인덱스의 범위를 벗어나는 조건을 찾아 고쳐요.',
        intro:
          '배열 인덱스는 0부터 시작하고 마지막 인덱스는 길이보다 1 작아요. 반복문의 종료 조건을 잘못 쓰면 존재하지 않는 위치에 접근할 수 있습니다.',
        points: [
          '길이가 3인 배열의 인덱스는 0, 1, 2예요.',
          '반복문 조건이 `i <= values.length`라면 마지막에 범위를 벗어나요.',
          '`i < values.length`처럼 길이보다 작은 동안 반복하면 모든 원소를 한 번씩 방문해요.',
        ],
        example: 'int[] values = {2, 3, 4};\nint total = 0;\nfor (int i = 0; i < values.length; i++) {\n    total += values[i];\n}',
        exercise: {
          id: 'java-loop-locate',
          type: 'locate-error',
          title: '오류가 있는 줄을 찾아보세요',
          prompt: '배열을 모두 합산하려는 코드입니다. 배열의 범위를 벗어날 수 있는 줄을 선택하세요.',
          codeLines: [
            'int[] values = {2, 3, 4};',
            'int total = 0;',
            'for (int i = 0; i <= values.length; i++) {',
            '    total += values[i];',
            '}',
          ],
          answerLines: [3],
          hint: '배열 길이가 3이면 마지막으로 사용할 수 있는 인덱스는 3일까요, 2일까요?',
          explanation:
            '3번 줄에서 `i <= values.length`는 `i`가 길이와 같은 경우까지 반복합니다. `i < values.length`로 고치면 마지막 인덱스까지만 접근해요.',
        },
      },
    ],
  },
  {
    id: 'spring',
    title: 'Spring Boot',
    short: 'Sp',
    category: '프레임워크',
    level: '입문',
    tone: 'green',
    accent: '#51a77b',
    description: '의존성 주입, HTTP 요청, 서비스 역할을 단계별로 익혀요.',
    objective: '의존성 주입부터 웹 요청 처리와 입력 검증까지 살펴봐요.',
    prerequisites: ['Java 클래스와 생성자 기초'],
    lessons: [
      {
        id: 'spring-injection',
        topicId: 'spring-foundation',
        title: '의존성 주입 이해하기',
        difficulty: '입문',
        duration: '9분',
        objective: 'Spring이 객체 사이의 의존성을 연결하는 이유를 설명해요.',
        intro:
          '서비스가 다른 객체를 직접 만들면 생성과 교체가 서로 얽힐 수 있어요. Spring은 필요한 객체를 컨테이너에서 관리하고 생성자 등을 통해 전달할 수 있습니다.',
        points: [
          '의존성 주입은 객체가 사용할 협력 객체를 바깥에서 전달하는 방식이에요.',
          '생성자 주입은 필수 의존성을 객체 생성 시점에 분명하게 보여 줘요.',
          '테스트에서는 실제 구현 대신 대체 객체를 주입하기가 쉬워져요.',
        ],
        example: '@Service\nclass CourseService {\n    private final CourseRepository repository;\n\n    CourseService(CourseRepository repository) {\n        this.repository = repository;\n    }\n}',
        exercise: {
          id: 'spring-injection-choice',
          type: 'choice',
          title: '생성자 주입의 장점은 무엇일까요?',
          prompt: '서비스 객체에 필요한 저장소를 생성자 주입으로 전달할 때 얻는 대표적인 이점은 무엇인가요?',
          choices: [
            { id: 'a', text: '필수 의존성이 생성 시점에 드러나고 테스트 대체가 쉬워진다' },
            { id: 'b', text: '데이터베이스가 없어도 저장 데이터가 자동으로 보존된다' },
            { id: 'c', text: '모든 객체가 전역 변수로 바뀌어 어디서나 직접 수정할 수 있다' },
          ],
          choiceExplanations: {
            a: '필수 협력 객체가 생성자 매개변수에 드러나고, 테스트에서는 대체 객체를 전달할 수 있어요.',
            b: '의존성 주입은 객체를 연결하는 방식이에요. 데이터를 저장하거나 데이터베이스를 대신하지 않아요.',
            c: '생성자 주입은 전역 변수를 만들지 않아요. 필요한 객체를 명시적으로 전달해 결합을 낮춰요.',
          },
          answer: 'a',
          hint: '객체를 만들 때 필요한 협력 객체를 명시적으로 전달한다는 점을 떠올려 보세요.',
          explanation:
            '생성자에 필수 의존성이 명시되므로 객체가 준비된 시점을 분명히 알 수 있고, 테스트에서는 가짜 저장소를 전달해 동작을 검증할 수 있습니다.',
        },
      },
    ],
  },
  {
    id: 'react',
    title: 'React',
    short: 'Re',
    category: '프레임워크',
    level: '입문',
    tone: 'cyan',
    accent: '#46aebc',
    description: '컴포넌트와 props부터 이벤트와 상태 업데이트까지 익혀요.',
    objective: '컴포넌트와 props부터 이벤트와 상태 업데이트까지 익혀요.',
    prerequisites: ['JavaScript 함수와 객체 기초'],
    lessons: [
      {
        id: 'react-state',
        topicId: 'react-state',
        title: '상태 업데이트 고치기',
        difficulty: '입문',
        duration: '8분',
        objective: '상태를 직접 바꾸지 않고 새 값으로 업데이트해요.',
        intro:
          'React 상태는 화면을 다시 그리는 기준이에요. 상태 객체를 직접 바꾸면 React가 변경을 놓칠 수 있으므로, 새 객체를 만들어 setter에 전달합니다.',
        points: [
          '현재 상태 객체의 속성을 바로 덮어쓰지 않아요.',
          '전개 문법으로 기존 필드를 복사한 새 객체를 만들 수 있어요.',
          '`setProfile({ ...profile, name: nextName })`처럼 변경할 값만 덮어써요.',
        ],
        example: 'setProfile({ ...profile, name: nextName });',
        exercise: {
          id: 'react-state-repair',
          type: 'repair-code',
          title: '상태 업데이트를 수정하세요',
          prompt: '아래 코드는 상태 객체를 직접 바꿉니다. 두 문장을 기존 필드를 보존한 새 객체를 전달하는 한 문장으로 바꾸세요.',
          language: 'React',
          solutionPatterns: [
            String.raw`^[ \t]*function[ \t]+rename[ \t]*\([ \t]*nextName[ \t]*\)[ \t]*\{[ \t\r\n]*setProfile[ \t\r\n]*\([ \t\r\n]*\{[ \t\r\n]*\.\.\.[ \t\r\n]*profile[ \t\r\n]*,[ \t\r\n]*name[ \t\r\n]*:[ \t\r\n]*nextName[ \t\r\n]*\}[ \t\r\n]*\)[ \t]*;?[ \t\r\n]*\}[ \t]*$`,
          ],
          starterCode: 'function rename(nextName) {\n  profile.name = nextName;\n  setProfile(profile);\n}',
          acceptanceCriteria: {
            requirements: ['기존 `profile` 필드를 모두 보존해요.', '`name`만 `nextName`으로 바꾼 새 객체를 setter에 전달해요.'],
            constraints: ['기존 상태 객체를 직접 수정하지 않아요.', '두 문장을 한 번의 `setProfile` 호출로 바꿔요.'],
            examples: [{ input: "profile={name:'Mina', role:'editor'}, nextName='Jin'", output: "새 상태={name:'Jin', role:'editor'}; 기존 상태는 유지" }],
            tests: [
              { input: "profile={name:'Mina', role:'editor'}, nextName='Jin'", expected: "새 객체의 name은 'Jin', role은 'editor'; 기존 profile은 변경되지 않음" },
              { input: "profile={name:'Sol', theme:'dark'}, nextName='Ara'", expected: "새 객체의 name은 'Ara', theme은 'dark'; 기존 profile은 변경되지 않음" },
            ],
          },
          gradingNote: '실행형 채점은 아니며, 함수에서 새 객체를 한 번 전달하는 구조를 확인해요. 공백·줄바꿈과 선택 세미콜론은 허용합니다.',
          hint: '기존 객체를 복사하고 `name` 값만 덮어쓰는 새 객체를 만들어 보세요.',
          explanation:
            '`setProfile({ ...profile, name: nextName })`는 기존 필드를 복사한 새로운 객체를 전달합니다. React가 새 참조를 확인하고 화면을 갱신할 수 있어요.',
        },
      },
    ],
  },
];

for (const track of tracks) {
  const progression = curriculumAdditions[track.id];
  if (!progression) throw new Error(`Missing reviewed curriculum for ${track.id}`);

  const lessonById = new Map([...track.lessons, ...progression.lessons].map((item) => [item.id, item]));
  track.lessons = progression.lessonOrder.map((id) => lessonById.get(id));
  if (track.lessons.some((item) => !item) || track.lessons.length !== lessonById.size) {
    throw new Error(`Curriculum sequence does not match lessons for ${track.id}`);
  }
  track.topics = progression.topics;
  track.contentReview = {
    status: '검수 완료',
    reviewedAt: progression.reviewedAt,
    version: progression.version,
    versionContext: progression.versionContext,
    sources: progression.sources,
  };
  track.lessons.forEach((item, index) => {
    const topic = track.topics.find((candidate) => candidate.id === item.topicId);
    if (!topic) throw new Error(`Missing topic for ${track.id}/${item.id}: ${item.topicId}`);
    item.number = index + 1;
    item.stage = topic.stage;
    item.referenceVersion = progression.version;
    item.reviewedAt = progression.reviewedAt;
    item.prerequisiteLessonIds = index ? [track.lessons[index - 1].id] : [];
  });
}

export const lessons = tracks.flatMap((track) =>
  track.lessons.map((lesson, index) => ({ ...lesson, trackId: track.id, trackTitle: track.title, number: index + 1 })),
);

export function getTrack(trackId) {
  return tracks.find((track) => track.id === trackId) ?? null;
}

export function getLesson(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export function findLessonForExercise(exerciseId) {
  return lessons.find((lesson) => lesson.exercise.id === exerciseId) ?? null;
}

export function getTopic(topicId) {
  for (const track of tracks) {
    const topic = track.topics.find((item) => item.id === topicId);
    if (topic) {
      return {
        topic,
        track,
        lessons: topic.lessonIds.map((lessonId) => getLesson(lessonId)).filter(Boolean),
      };
    }
  }
  return null;
}
