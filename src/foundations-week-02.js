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
    title: '명령과 인자 읽기',
    objective: '명령 이름, 옵션, 인자가 어떤 역할을 하는지 구분해요.',
    intro: '터미널 명령은 보통 실행할 명령과 그 뒤에 전달하는 옵션·인자로 이루어져요. 명령이 무엇을 실행하는지, 인자가 어떤 대상을 지정하는지 나누어 읽어 보세요.',
    example: "Get-ChildItem -LiteralPath 'src files'\n\n명령: Get-ChildItem\n옵션: -LiteralPath\n인자: src files",
    activities: [
      activity('15분', '명령 뼈대 나누기', '명령 이름과 옵션, 파일·폴더 인자를 서로 다른 색으로 표시해요.'),
      activity('25분', '실행 결과 예측', '명령이 무엇을 읽거나 보여 주는지 입력과 함께 문장으로 설명해요.'),
      activity('20분', '오타 검수', '명령 이름과 인자 순서를 한 항목씩 대조해 오류를 찾아요.'),
    ],
    exercises: [
      choice('foundation-w02-d01-q01', '명령 이름 찾기', 'PowerShell 명령 `Get-ChildItem -LiteralPath \'src files\'`에서 실제 명령 이름은 무엇인가요?', [
        ['a', '`Get-ChildItem`'], ['b', '`-LiteralPath`'], ['c', '`src files`'],
      ], 'a', {
        a: '`Get-ChildItem`이 실행할 작업을 지정하는 명령 이름이에요.',
        b: '`-LiteralPath`는 뒤의 인자가 경로라는 것을 지정하는 매개변수예요.',
        c: '`src files`는 명령에 전달되는 폴더 경로 인자예요.',
      }, '작업 동작을 가리키며 줄의 맨 앞에 오는 부분을 찾아보세요.', '`Get-ChildItem`이 폴더 항목을 나열하는 명령 이름이고, 나머지는 동작 대상을 지정해요.'),
      shortAnswer('foundation-w02-d01-q02', '인자 개수 세기', '`node app.js "two words"`에서 `node`를 실행한 뒤 전달되는 인자는 몇 개인가요? 따옴표 안의 두 단어는 하나의 값으로 다뤄요.', ['2', '2개', '두 개'], '실행 파일 이름 `node`는 빼고, `app.js`와 따옴표로 묶인 값의 개수를 세어 보세요.', '`app.js`가 첫 번째 인자이고 `two words` 전체가 두 번째 인자예요.'),
      locate('foundation-w02-d01-q03', '명령 이름 오타 찾기', '아래 명령 기록에서 의도한 폴더 목록을 얻지 못하게 하는 오타가 있는 줄을 고르세요.', [
        '현재 위치: /workspace/app',
        '목표 폴더: src',
        '명령: Get-ChidlItem -LiteralPath src',
        '예상: src 안의 항목 목록',
      ], [3], '명령의 이름을 PowerShell의 실제 명령 철자와 비교해 보세요.', '`Get-ChidlItem`의 철자 순서가 잘못됐어요. 올바른 명령은 `Get-ChildItem`이에요.'),
    ],
  },
  {
    number: 2,
    title: '공백이 있는 경로와 따옴표',
    objective: '공백 경로를 하나의 인자로 전달하고 셸별 따옴표 차이를 알아봐요.',
    intro: '공백은 셸에서 인자 경계로 쓰일 수 있어요. 경로 전체를 따옴표로 묶으면 하나의 경로 값으로 전달할 수 있습니다. 따옴표의 변수 해석 규칙은 PowerShell과 Bash에서 다르므로 셸 이름을 먼저 확인해요.',
    example: "PowerShell: Get-Content -LiteralPath 'project files/readme.md'\nBash: cat -- 'project files/readme.md'",
    activities: [
      activity('15분', '공백 경계 확인', '따옴표가 있을 때와 없을 때 셸이 인자를 나누는 위치를 비교해요.'),
      activity('25분', '변수 포함 문자열', 'PowerShell 작은따옴표와 큰따옴표의 변수 처리 차이를 확인해요.'),
      activity('20분', '셸별 안전한 명령 고르기', 'PowerShell 예제와 Bash 예제를 섞지 않고 각각 검토해요.'),
    ],
    exercises: [
      choice('foundation-w02-d02-q01', 'PowerShell 변수 해석', 'PowerShell에서 `$name` 변수 값을 문자열에 넣으려면 일반적으로 어떤 따옴표를 사용하나요?', [
        ['a', '큰따옴표 `"`'], ['b', '작은따옴표 `\'`'], ['c', '따옴표 없이 씁니다'],
      ], 'a', {
        a: 'PowerShell의 큰따옴표 문자열은 `$name` 같은 변수를 값으로 바꿔 넣어요.',
        b: '작은따옴표 문자열은 변수 표시를 그대로 문자로 남겨요.',
        c: '따옴표가 없으면 문자열이 아니라 명령의 식/인자로 해석될 수 있어요.',
      }, 'PowerShell 큰따옴표 문자열과 작은따옴표 문자열의 역할을 떠올려 보세요.', 'PowerShell은 큰따옴표 문자열에서 변수를 확장하고, 작은따옴표 문자열에서는 문자 그대로 보존해요.'),
      shortAnswer('foundation-w02-d02-q02', '공백 경로를 하나로 묶기', 'PowerShell에서 `project files/readme.md` 전체를 `-LiteralPath`에 하나의 경로 인자로 전달하도록 명령 끝부분을 적어 보세요.', ["-LiteralPath 'project files/readme.md'", '-LiteralPath "project files/readme.md"'], '공백 앞에서 인자가 갈라지지 않도록 전체 경로를 따옴표로 감싸세요.', '경로 전체를 작은따옴표나 큰따옴표로 감싸면 하나의 인자로 전달돼요.'),
      locate('foundation-w02-d02-q03', '공백 경로 인자 오류 찾기', '목표는 `Code One Step files`라는 하나의 폴더 경로를 표시하는 것입니다. PowerShell 명령에서 잘못된 줄을 고르세요.', [
        "$project = 'Code One Step'",
        'Get-ChildItem $project files',
        'Get-ChildItem -LiteralPath "$project files"',
      ], [2], '세 단어가 하나의 경로 값으로 전달되는지 확인하세요.', '2번 줄에서는 변수와 `files`가 따로 전달될 수 있어요. `"$project files"`처럼 전체 값을 큰따옴표로 묶어야 해요.'),
    ],
  },
  {
    number: 3,
    title: '정상 출력과 오류 읽기',
    objective: '화면에 보이는 결과와 오류 메시지, 명령 실패 근거를 구분해요.',
    intro: '터미널에는 정상 결과와 오류가 서로 다른 흐름으로 표시될 수 있어요. 오류 문구만 고치려 하지 말고, 어떤 파일·명령이 문제인지와 종료 상태를 함께 확인해요.',
    example: "PowerShell 정상 출력: Write-Output '완료'\nPowerShell 오류 기록: Write-Error '파일을 찾지 못함'\n\nBash는 오류 메시지를 표준 오류에 쓸 수 있어요.",
    activities: [
      activity('15분', '출력 종류 표시', '로그에서 정상 결과, 오류 설명, 종료 상태를 각각 분류해요.'),
      activity('25분', '오류 메시지에서 대상 찾기', '오류의 대상이 명령인지 파일인지 경로인지 구분해요.'),
      activity('20분', '환경 사실과 원인 후보 나누기', '로그에 직접 나타난 사실과 아직 확인하지 않은 원인 후보를 따로 적어요.'),
    ],
    exercises: [
      choice('foundation-w02-d03-q01', 'PowerShell 오류 기록 고르기', '다음 중 PowerShell 오류 스트림에 오류 레코드를 기록하는 명령은 무엇인가요?', [
        ['a', '`Write-Output \'완료\'`'], ['b', '`Write-Error \'파일을 찾지 못함\'`'], ['c', '`Get-ChildItem -LiteralPath .`'],
      ], 'b', {
        a: '`Write-Output`은 성공 출력 스트림에 값을 기록해요.',
        b: '`Write-Error`는 오류 레코드를 오류 스트림에 기록해요.',
        c: '`Get-ChildItem`은 지정한 경로의 항목을 가져오는 명령이에요.',
      }, '명령 이름에 `Error`가 들어간 PowerShell 출력 명령을 찾아보세요.', '`Write-Error`는 PowerShell에서 오류 레코드를 기록하는 명령이에요.'),
      shortAnswer('foundation-w02-d03-q02', 'Bash 명령 없음 상태', 'Bash에서 존재하지 않는 명령을 실행했을 때 일반적으로 반환되는 종료 상태 숫자는 무엇인가요?', ['127', '종료 코드 127', '127번'], 'Bash 설명서에서 command not found에 연결된 종료 상태를 떠올려 보세요.', '기본 동작에서는 명령을 찾지 못하면 상태 127을 반환해요. `command_not_found_handle`를 설정한 환경은 그 처리 함수의 결과를 반환할 수 있어요.'),
      locate('foundation-w02-d03-q03', '오류 원인 줄 찾기', '로그에 직접 기록된 누락 파일 이름을 알려 주는 줄을 고르세요.', [
        '명령: Get-Content -LiteralPath draft.txt',
        '오류: 경로를 찾을 수 없음: draft.txt',
        '현재 위치: /workspace/app',
        '종료 상태: 1',
      ], [2], '종료 상태는 실패 여부를 보여 주지만, 누락된 대상 이름은 오류 문구에서 확인할 수 있어요.', '2번 줄에 찾지 못한 경로와 파일 이름이 직접 표시돼 있어요. 이후 현재 위치와 실제 폴더 구조를 비교하면 원인을 좁힐 수 있어요.'),
    ],
  },
  {
    number: 4,
    title: '종료 상태 확인하기',
    objective: '셸마다 다른 성공 상태 표현을 구분하고, 직전 명령의 결과를 읽어요.',
    intro: 'Bash의 `$?`는 직전 명령의 숫자 종료 상태를 담아요. PowerShell의 `$?`는 성공 여부를 True/False로 나타내고, 네이티브 프로그램의 숫자 종료 상태는 `$LASTEXITCODE`에서 확인해요. 셸에 맞는 변수를 골라야 해요.',
    example: 'Bash: false\nprintf \'%s\\n\' "$?"   # 0이 아닌 상태\n\nPowerShell: node build.js\n$LASTEXITCODE      # 네이티브 프로그램의 숫자 상태',
    activities: [
      activity('15분', '성공과 실패 상태', '성공을 뜻하는 0과 실패를 나타내는 0이 아닌 상태를 표에 표시해요.'),
      activity('25분', 'PowerShell 변수 비교', '`$?`와 `$LASTEXITCODE`가 알려 주는 정보가 어떻게 다른지 비교해요.'),
      activity('20분', '실패 로그 정리', '어떤 셸에서 어떤 명령 다음에 상태를 확인했는지 적어요.'),
    ],
    exercises: [
      choice('foundation-w02-d04-q01', 'Bash의 직전 종료 상태', 'Bash에서 `false`를 실행한 바로 다음 `$?`는 어떤 정보를 담나요?', [
        ['a', '직전 명령의 0이 아닌 종료 상태'], ['b', '항상 성공을 나타내는 0'], ['c', '현재 폴더의 경로'],
      ], 'a', {
        a: '`false`는 실패 상태를 반환하고 `$?`가 직전 명령의 상태를 보여 줘요.',
        b: '0은 성공 상태예요. `false`는 0을 반환하지 않아요.',
        c: '현재 작업 위치는 종료 상태와 다른 정보예요.',
      }, 'Bash에서 `$?`가 어떤 시점의 어떤 값을 나타내는지 떠올려 보세요.', 'Bash의 `$?`는 직전에 실행된 명령의 종료 상태예요. `false`의 상태는 0이 아니에요.'),
      choice('foundation-w02-d04-q02', 'PowerShell 네이티브 종료 코드', 'PowerShell에서 방금 실행한 `node build.js`의 숫자 종료 코드를 확인하려면 어떤 변수를 읽어야 하나요?', [
        ['a', '`$?`'], ['b', '`$LASTEXITCODE`'], ['c', '`$PWD`'],
      ], 'b', {
        a: '`$?`는 마지막 명령의 성공 여부를 True/False로 알려 줘요.',
        b: '`$LASTEXITCODE`는 마지막으로 실행한 네이티브 프로그램의 종료 코드를 보관해요.',
        c: '`$PWD`는 현재 작업 위치를 나타내요.',
      }, '숫자 종료 코드와 True/False 성공 여부를 구분하세요.', '네이티브 프로그램의 숫자 종료 상태는 `$LASTEXITCODE`예요. `$?`는 성공 여부예요.'),
      locate('foundation-w02-d04-q03', '숫자 상태를 놓치는 줄', 'PowerShell에서 네이티브 명령의 숫자 종료 코드를 확인하려고 합니다. 원하는 정보를 주지 않는 줄을 고르세요.', [
        'node build.js',
        '$?       # True 또는 False 성공 여부',
        '$LASTEXITCODE  # 네이티브 프로그램의 숫자 상태',
      ], [2], '문제는 숫자 코드가 필요하므로 True/False만 나타내는 변수를 찾으세요.', '2번 줄의 `$?`는 성공 여부를 나타내요. 숫자 종료 코드는 3번 줄의 `$LASTEXITCODE`에서 읽어요.'),
    ],
  },
  {
    number: 5,
    title: '명령 기록 종합 진단',
    objective: '위치·인자·오류·종료 상태를 함께 읽고 다음 확인 단계를 정해요.',
    intro: '실무에서는 명령 한 줄만 보고 원인을 단정하지 않아요. 작업 위치와 전달한 경로, 출력된 오류를 함께 대조하고, 추측과 로그로 확인된 사실을 구분합니다.',
    example: "현재 위치: /workspace/app\n파일 트리: docs/release notes.md\n입력: Get-Content 'release notes.md'\n결과: 파일을 찾을 수 없음",
    activities: [
      activity('15분', '로그 순서 재구성', '현재 위치, 명령, 입력 인자, 결과의 시간 순서를 정리해요.'),
      activity('25분', '최소 수정 제안', '경로 한 부분만 바꾸어 목표 파일에 도달하는 명령을 만들어요.'),
      activity('20분', '진단 보고서 쓰기', '관찰된 사실과 확인해야 할 다음 행동을 한 문장씩 기록해요.'),
    ],
    exercises: [
      choice('foundation-w02-d05-q01', '경로와 공백 함께 고치기', '현재 위치가 프로젝트 루트이고 `docs/release notes.md`가 있습니다. PowerShell에서 파일 내용을 읽는 올바른 경로 인자는 무엇인가요?', [
        ['a', '`-LiteralPath docs/release notes.md`'], ['b', '`-LiteralPath \'docs/release notes.md\'`'], ['c', '`-LiteralPath \'release notes.md\'`'],
      ], 'b', {
        a: '공백이 있는 값 전체를 따옴표로 묶지 않아 인자가 분리될 수 있어요.',
        b: '프로젝트 루트 기준 하위 폴더와 파일을 모두 포함하고, 공백 경로를 하나로 묶었어요.',
        c: '공백은 묶었지만 실제 파일이 있는 `docs/` 폴더를 빠뜨렸어요.',
      }, '필요한 두 조건을 확인하세요: 경로 전체와 공백 묶기.', '`docs/`를 포함한 전체 경로를 따옴표로 묶으면 목표 파일을 가리켜요.'),
      shortAnswer('foundation-w02-d05-q02', '오류 진단의 다음 확인', '오류에 `draft.txt`를 찾지 못했다고 나왔고 현재 위치는 `/workspace/app`입니다. 원인을 확정하기 전에 실제 파일 위치와 현재 위치가 맞는지 비교할 정보는 무엇인가요?', ['파일 트리', '폴더 구조', '파일 목록', '실제 파일 경로'], '오류 문구만으로는 파일이 없다는 사실과 잘못된 기준 위치를 구분할 수 없어요.', '현재 위치에서 본 실제 폴더·파일 목록을 확인해 오류에 적힌 상대 경로가 맞는지 비교해야 해요.'),
      locate('foundation-w02-d05-q03', '종합 명령 오류 찾기', '파일 트리와 명령을 비교해 목표 파일을 읽지 못하는 줄을 고르세요.', [
        '현재 위치: /workspace/app',
        '파일 트리: /workspace/app/docs/release notes.md',
        "명령: Get-Content -LiteralPath 'release notes.md'",
        '결과: 파일을 찾을 수 없음',
      ], [3], '공백은 묶였지만 프로젝트 아래의 폴더 경로가 포함됐는지 살펴보세요.', '3번 줄은 `docs/` 폴더를 빠뜨렸어요. 전체 경로를 `docs/release notes.md`로 맞춰야 해요.'),
    ],
  },
];

export const foundationsWeek02Days = days;

export const foundationsWeek02 = {
  id: 'foundation-w02',
  trackId: 'foundations',
  topicId: 'foundations-tooling',
  title: '터미널 명령·인자·결과 읽기',
  objective: '명령, 옵션, 인자와 정상 출력·오류·종료 상태를 읽고 문제 원인을 좁힙니다.',
  intro: '첫 주에 익힌 파일 경로를 터미널 명령과 연결합니다. PowerShell과 Bash의 공통 개념과 다른 표기를 구분하고, 계정이나 실제 파일을 건드리지 않는 예제로 명령 결과를 해석해요.',
  difficulty: '입문',
  duration: '5일',
  week: 2,
  number: 2,
  stage: 1,
  referenceVersion: 'PowerShell 7.6 문서 · GNU Bash 5.3 설명서',
  versionReviewedAt: '2026-10-16',
  contentReviewStatus: '문항 검수 완료',
  prerequisiteLessonIds: ['foundation-w01'],
  points: [
    '명령 이름은 실행할 작업을, 옵션과 인자는 동작 대상이나 방식을 지정해요.',
    '공백이 있는 경로는 전체 값을 따옴표로 묶어 하나의 인자로 전달해요.',
    'PowerShell 큰따옴표는 변수를 확장하고 작은따옴표는 문자 그대로 보존해요.',
    'Bash `$?`, PowerShell `$?`, `$LASTEXITCODE`는 의미와 자료형이 같지 않아요.',
    '오류 문구와 종료 상태를 현재 작업 위치·실제 파일 구조와 함께 확인해요.',
  ],
  example: days[0].example,
  studyDays: days,
  sessions: days,
  exercises: days.flatMap((day) => day.exercises),
};
