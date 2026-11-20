const activity = (time, title, prompt) => ({ time, title, prompt });
const choice = (id, title, prompt, options, answer, choiceExplanations, hint, explanation) => ({
  id, type: 'choice', title, prompt,
  choices: options.map(([optionId, text]) => ({ id: optionId, text })),
  answer, choiceExplanations, hint, explanation,
});
const shortAnswer = (id, title, prompt, acceptedAnswers, hint, explanation) => ({
  id, type: 'short-answer', title, prompt, acceptedAnswers, hint, explanation,
});
const locate = (id, title, prompt, codeLines, answerLines, hint, explanation) => ({
  id, type: 'locate-error', title, prompt, codeLines, answerLines, hint, explanation,
});

const week03Days = [
  {
    number: 1,
    title: '저장소와 작업 폴더',
    objective: 'Git 저장소, 현재 작업 폴더, 커밋 이력의 관계를 그림으로 설명해요.',
    intro: '저장소에는 변경 이력과 설정이 있고, 작업 폴더에는 지금 열어 수정하는 파일이 있어요. 아직 커밋하지 않은 수정은 이력에 자동으로 들어가지 않아요.',
    example: '저장소 이력: A → B\n작업 폴더: B에서 파일을 수정한 상태\n아직 새 커밋은 없음',
    activities: [
      activity('15분', '저장소 그림 그리기', '작업 폴더와 커밋 이력을 서로 다른 상자로 그리고 연결해요.'),
      activity('25분', '변경 전·후 추적', '수정이 생겼을 때 현재 파일과 마지막 커밋이 각각 무엇을 담는지 표시해요.'),
      activity('20분', '기록 여부 설명하기', '커밋하지 않은 변경이 이력에서 보이는지 근거를 들어 설명해요.'),
    ],
    exercises: [
      choice('foundation-w03-d01-q01', '작업 폴더의 역할', 'Git 작업 폴더(working tree)는 무엇을 가리키나요?', [
        ['a', '현재 파일을 열고 수정하는 체크아웃된 폴더'], ['b', '원격 서버에 저장된 복사본만'], ['c', '커밋 메시지 목록만'],
      ], 'a', {
        a: '작업 폴더에는 지금 편집하고 확인하는 파일이 있어요.',
        b: '원격은 공유 저장소를 가리키는 별도 개념이에요.',
        c: '커밋 메시지는 이력의 일부지만 작업 폴더 자체는 아니에요.',
      }, '현재 편집기에서 파일을 수정하는 위치를 생각해 보세요.', '작업 폴더는 저장소에서 체크아웃한 파일을 직접 읽고 수정하는 위치예요.'),
      shortAnswer('foundation-w03-d01-q02', '미커밋 수정의 상태', '파일을 저장했지만 `git add`와 `git commit`을 아직 하지 않았습니다. 이 수정은 마지막 커밋 이력에 이미 들어갔나요?', ['아니요', '아니오', '들어가지 않았다', '아직 들어가지 않았다'], '파일 저장과 Git 커밋 기록은 서로 다른 동작이에요.', '파일을 저장해도 커밋을 만들기 전에는 마지막 커밋 이력이 바뀌지 않아요.'),
      locate('foundation-w03-d01-q03', '기록 시점을 잘못 말한 줄', 'Git 저장소의 개념 설명 중 사실과 다른 줄을 고르세요.', [
        '작업 폴더에는 체크아웃된 파일이 있다.',
        '파일을 저장하면 마지막 커밋 내용도 자동으로 바뀐다.',
        '커밋은 저장소의 이력에 변경 묶음을 기록한다.',
      ], [2], '파일 편집과 이력 기록이 자동으로 같은 순간에 일어나는지 확인해요.', '2번 줄이 틀렸어요. 작업 파일을 저장해도 커밋을 만들기 전의 저장소 이력은 그대로예요.'),
    ],
  },
  {
    number: 2,
    title: '수정·추가·삭제 상태 읽기',
    objective: '`git status`에서 추적 중인 파일과 새 파일의 상태를 구분해요.',
    intro: '`git status`는 커밋되지 않은 변경과 다음 커밋에 포함될 준비 상태를 보여 줘요. 추적 중인 파일의 수정과 Git이 아직 관리하지 않는 새 파일을 따로 살펴봅니다.',
    example: 'Changes not staged for commit:\n  modified:   src/app.js\n\nUntracked files:\n  notes.txt',
    activities: [
      activity('15분', '상태표 색칠하기', '수정 파일과 새 파일을 `modified`, `untracked`로 나누어 표시해요.'),
      activity('25분', '요구사항과 상태 대조', '요구한 파일이 모두 변경 목록에 있는지 하나씩 확인해요.'),
      activity('20분', '누락된 변경 찾기', '새 파일이 목록에 나타나지 않을 때 확인 순서를 정리해요.'),
    ],
    exercises: [
      choice('foundation-w03-d02-q01', '새 파일 상태 알아보기', '`notes.txt`를 만들었지만 한 번도 Git에 추가하지 않았다면 `git status`는 보통 어떤 상태로 표시하나요?', [
        ['a', 'untracked'], ['b', 'committed'], ['c', 'merged'],
      ], 'a', {
        a: 'Git이 아직 관리 대상으로 등록하지 않은 새 파일은 untracked예요.',
        b: '커밋에 포함되려면 먼저 staging과 commit이 필요해요.',
        c: 'merge는 서로 다른 이력을 통합할 때 쓰는 별도 과정이에요.',
      }, '파일이 저장소의 추적 대상으로 등록된 적이 있는지 보세요.', '아직 `git add`하지 않은 새 파일은 추적되지 않는 파일로 표시돼요.'),
      choice('foundation-w03-d02-q02', '추적 파일 변경 상태', '마지막 커밋에 들어간 `src/app.js`를 수정했지만 `git add`하지 않았습니다. 이 변경은 어느 상태에 있나요?', [
        ['a', '작업 폴더의 unstaged 변경'], ['b', 'staging area에만 있는 변경'], ['c', '새 커밋에 기록된 변경'],
      ], 'a', {
        a: '파일은 수정됐지만 index에 추가하지 않아 작업 폴더 변경으로 남아 있어요.',
        b: '`git add`를 실행해야 staging area의 변경이 돼요.',
        c: '`git commit` 전이므로 새 커밋에는 포함되지 않았어요.',
      }, '아직 실행하지 않은 명령이 `git add`와 `git commit`이라는 점을 확인하세요.', '추적 파일 수정은 `git add` 전까지 unstaged 작업 폴더 변경이에요.'),
      locate('foundation-w03-d02-q03', '새 파일 누락 이유 찾기', '요구사항은 `src/app.js` 수정과 `notes.txt` 추가입니다. 기록을 확인할 때 새 파일을 놓치게 하는 줄을 고르세요.', [
        'git status --short',
        ' M src/app.js',
        '확인할 파일: src/app.js만',
        '?? notes.txt',
      ], [3], '`git status` 결과에는 파일이 있지만, 확인 대상 목록은 같은 파일을 모두 포함하는지 비교해요.', '3번 줄이 `notes.txt`를 확인 대상에서 빼고 있어요. 상태표의 `?? notes.txt`도 함께 검토해야 해요.'),
    ],
  },
  {
    number: 3,
    title: '스테이징 영역과 선택하기',
    objective: '`git add`가 다음 커밋에 넣을 변경을 staging area에 준비하는 것을 익혀요.',
    intro: 'Git의 index(staging area)는 다음 커밋에 포함할 파일 상태를 선택하는 중간 단계예요. 여러 파일을 수정했다면 필요한 파일만 선택해 커밋을 만들 수 있어요.',
    example: '작업 폴더 수정: src/app.js, notes.txt\ngit add src/app.js\n스테이징: src/app.js\n아직 unstaged: notes.txt',
    activities: [
      activity('15분', '세 영역 연결하기', '작업 폴더, staging area, 커밋 이력을 세 칸으로 그려요.'),
      activity('25분', '파일별 선택 연습', '요구사항에 필요한 파일만 staging에 올리는 명령을 작성해요.'),
      activity('20분', '커밋 전 목록 확인', 'staged와 unstaged 변경이 각각 무엇인지 구분해요.'),
    ],
    exercises: [
      choice('foundation-w03-d03-q01', '스테이징 영역의 뜻', '다음 커밋에 넣을 파일 변경을 선택해 두는 Git 영역은 무엇인가요?', [
        ['a', 'index (staging area)'], ['b', '원격 origin'], ['c', '현재 브랜치 이름'],
      ], 'a', {
        a: 'index는 다음 커밋에 기록할 변경을 준비하는 영역이에요.',
        b: 'origin은 흔히 원격 저장소 이름으로 쓰여요.',
        c: '브랜치는 커밋 이력의 진행 위치를 가리켜요.',
      }, '작업 폴더와 커밋 사이의 선택 단계를 찾아보세요.', '스테이징 영역(index)에 올린 변경이 다음 커밋에 포함될 준비를 마쳐요.'),
      shortAnswer('foundation-w03-d03-q02', '파일 하나를 스테이징하기', '`src/app.js` 변경만 staging area에 올리는 기본 명령을 적어 보세요.', ['git add src/app.js', 'git add -- src/app.js'], '`git add` 뒤에 staging할 경로를 전달해요.', '`git add src/app.js`는 그 파일의 현재 변경을 스테이징해요.'),
      locate('foundation-w03-d03-q03', '커밋에서 빠질 수정 찾기', '`src/app.js`와 `notes.txt`를 모두 커밋하려고 합니다. 명령 기록에서 `notes.txt`가 다음 커밋에서 빠지는 원인을 고르세요.', [
        'git add src/app.js',
        'git status --short',
        'git commit -m "update app"',
      ], [1], '커밋은 staging area에 준비한 변경을 기록한다는 점을 떠올리세요.', '1번 줄은 `src/app.js`만 staging해요. `notes.txt`도 포함하려면 그 파일을 별도로 `git add`해야 해요.'),
    ],
  },
  {
    number: 4,
    title: '커밋과 메시지',
    objective: '스테이징한 변경만 커밋으로 기록하고 메시지로 목적을 설명해요.',
    intro: '커밋은 staging area에 준비된 변경을 저장소 이력의 새 지점으로 기록해요. 명확한 메시지는 어떤 의도로 바뀌었는지 나중에 찾도록 도와줍니다.',
    example: 'git add src/app.js\ngit commit -m "fix empty input handling"\n\n커밋에는 staging area에 준비한 변경이 기록돼요.',
    activities: [
      activity('15분', '커밋 대상 확인', 'status 표의 staged 파일만 다음 커밋에 들어가는지 확인해요.'),
      activity('25분', '메시지 고쳐 쓰기', '모호한 메시지를 변경 목적이 드러나는 문장으로 바꿔요.'),
      activity('20분', '이력 카드 만들기', '커밋 목적, 변경 파일, 확인한 테스트를 한 줄씩 기록해요.'),
    ],
    exercises: [
      choice('foundation-w03-d04-q01', '커밋이 기록하는 변경', '`git commit`이 기본적으로 기록하는 변경은 무엇인가요?', [
        ['a', 'staging area에 준비된 변경'], ['b', '작업 폴더의 모든 미저장 파일'], ['c', '모든 원격 브랜치의 변경'],
      ], 'a', {
        a: '기본 커밋은 index에 준비한 스냅샷을 이력에 기록해요.',
        b: '아직 staging되지 않은 변경은 커밋에 자동 포함되지 않아요.',
        c: '원격 변경은 fetch/pull 등 별도 동기화 흐름이 필요해요.',
      }, '직전 단계의 staging area가 커밋에 어떤 역할을 하는지 생각하세요.', '커밋은 다음 기록 대상으로 준비된 staging area의 변경을 저장해요.'),
      shortAnswer('foundation-w03-d04-q02', '커밋 목적을 짧게 쓰기', '`빈 입력에서 오류가 나지 않게 고쳤다`는 변경 목적을 드러내는 커밋 메시지의 핵심 표현을 간단히 적어 보세요.', ['빈 입력 처리 수정', '빈 입력 처리 개선', 'fix empty input', 'handle empty input'], '파일 이름만 쓰기보다 무엇을 바꿨는지 동사로 표현해요.', '커밋 메시지는 변경 목적을 구체적으로 나타내면 나중에 이력을 읽기 쉬워요.'),
      locate('foundation-w03-d04-q03', 'staging하지 않은 변경 찾기', '`src/app.js` 수정과 `notes.txt` 새 파일을 둘 다 기록하려 합니다. 다음 명령 목록에서 누락된 파일을 찾아 스테이징하지 않은 줄을 고르세요.', [
        'git add src/app.js',
        'git status --short',
        'git commit -m "update app"',
        '확인할 파일: src/app.js, notes.txt',
      ], [1], '현재 명령에는 staging할 경로가 무엇인지 하나씩 표시해 보세요.', '1번 줄은 `src/app.js`만 staging해요. 새 파일 `notes.txt`를 커밋하려면 이 파일도 staging해야 해요.'),
    ],
  },
  {
    number: 5,
    title: '변경에서 커밋까지 한 흐름',
    objective: '상태 확인, 변경 선택, 커밋, 이력 확인을 안전한 순서로 연결해요.',
    intro: '작은 변경도 상태를 먼저 확인하고, 필요한 파일만 선택한 뒤, 목적이 보이는 메시지로 커밋하고 결과를 다시 확인하면 실수를 줄일 수 있어요.',
    example: 'git status --short\ngit add src/app.js\ngit diff --staged\ngit commit -m "fix app title"\ngit log -1 --oneline',
    activities: [
      activity('15분', '명령 순서 카드 놓기', '상태 확인부터 이력 검증까지 다섯 단계를 시간순으로 배열해요.'),
      activity('25분', '시나리오 파일 선택', '요구한 파일과 관계없는 파일을 구별하고 필요한 것만 준비해요.'),
      activity('20분', '완료 근거 남기기', '커밋이 만들어졌는지 확인할 명령과 예상 정보를 적어요.'),
    ],
    exercises: [
      choice('foundation-w03-d05-q01', '안전한 기본 순서', '한 파일의 변경을 커밋하려는 상황에서 적절한 기본 순서는 무엇인가요?', [
        ['a', 'status 확인 → add → staged diff 검토 → commit → log 확인'],
        ['b', 'commit → add → status 확인'],
        ['c', 'reset --hard → push → 파일 수정'],
      ], 'a', {
        a: '대상을 확인하고 선택된 변경을 검토한 다음 기록 결과를 확인하는 순서예요.',
        b: '`git commit`은 staging 전의 변경을 포함하지 않아요.',
        c: '`reset --hard`는 변경을 버릴 수 있고 제시된 순서도 목표와 맞지 않아요.',
      }, '변경 대상을 먼저 확인하고, 커밋 전에 staging 내용을 읽는 순서로 생각하세요.', 'status → add → diff → commit → log는 대상과 결과를 각 단계에서 확인하는 안전한 흐름이에요.'),
      shortAnswer('foundation-w03-d05-q02', '새 커밋 확인 명령', '가장 최근 커밋을 한 줄로 확인하는 Git 명령을 적어 보세요.', ['git log -1 --oneline', 'git log --oneline -1'], '`git log`에 최신 항목 하나만 표시하도록 제한해요.', '`git log -1 --oneline`은 최근 커밋을 한 줄로 표시해요.'),
      locate('foundation-w03-d05-q03', '커밋 누락 원인 줄', '`src/app.js`의 변경이 커밋되지 않은 이유를 명령 순서에서 고르세요.', [
        'git status --short',
        'git diff -- src/app.js',
        'git commit -m "fix app"',
        'git log -1 --oneline',
      ], [2], '파일 차이를 확인하는 것과 커밋 대상으로 준비하는 것은 다른 동작이에요.', '2번 줄의 `git diff`는 변경을 보여 줄 뿐 staging하지 않아요. 커밋 전 `git add src/app.js`가 필요해요.'),
    ],
  },
];

const week04Days = [
  {
    number: 1,
    title: 'status와 diff 읽기',
    objective: '현재 변경 상태와 기준 파일의 차이를 검토해요.',
    intro: '`git status`는 변경이 어느 단계에 있는지 보여 주고, `git diff`는 unstaged 파일 차이를 보여 줘요. 명령 결과를 함께 읽으면 무엇을 검토해야 하는지 알 수 있어요.',
    example: 'git status --short\ngit diff -- src/app.js\n\nstatus는 상태를, diff는 줄 단위 변경을 보여 줘요.',
    activities: [activity('15분', 'status 표 읽기', '수정, 삭제, 새 파일 표기를 요구사항과 대조해요.'), activity('25분', 'diff 앞뒤 문맥 보기', '변경 줄 앞뒤를 읽고 목적과 맞는지 확인해요.'), activity('20분', '검토 메모 작성', '확인한 변경과 더 조사할 위험을 따로 적어요.')],
    exercises: [
      choice('foundation-w04-d01-q01', 'status의 역할', '`git status`를 실행하는 주된 이유는 무엇인가요?', [
        ['a', '작업 폴더와 staging area의 변경 상태를 살펴본다'], ['b', '코드를 자동으로 수정한다'], ['c', '모든 변경을 원격 저장소로 보낸다'],
      ], 'a', { a: 'status는 커밋되지 않은 변경과 staging 상태를 알려 줘요.', b: '상태 확인 명령은 파일을 수정하지 않아요.', c: '원격에 올리는 동작은 `git push`와 관련돼요.' }, '파일을 변경하는지, 상태를 보여 주는지 구분하세요.', '`git status`는 Git 변경 상태를 요약해 보여 주는 읽기 명령이에요.'),
      shortAnswer('foundation-w04-d01-q02', '특정 파일 diff 확인', '`src/app.js`의 unstaged 변경을 확인하는 명령을 적어 보세요.', ['git diff -- src/app.js', 'git diff src/app.js'], '일반 `git diff` 뒤에 파일 경로를 지정할 수 있어요.', '`git diff -- src/app.js`는 해당 경로의 unstaged 차이를 확인해요.'),
      locate('foundation-w04-d01-q03', '변경 내용을 보여 주지 않는 명령', '요구사항은 `src/app.js`의 줄 단위 변경을 읽는 것입니다. 목적과 맞지 않는 명령을 고르세요.', ['git status --short', 'git diff -- src/app.js', 'git show HEAD:src/app.js'], [1], '`status` 요약과 줄 단위 변경 비교가 같은 정보인지 살펴보세요.', '1번 줄은 상태만 요약해요. 변경된 줄 자체는 `git diff`로 확인해야 해요.'),
    ],
  },
  {
    number: 2,
    title: 'staged와 unstaged 비교',
    objective: '`git diff`와 `git diff --staged`가 비교하는 기준을 구분해요.',
    intro: '일반 `git diff`는 작업 폴더와 staging area의 차이를 보여 줘요. `git diff --staged`는 staging area와 마지막 커밋 사이의 차이를 보여 줍니다.',
    example: '작업 폴더 ── git diff ── staging area\nstaging area ── git diff --staged ── HEAD',
    activities: [activity('15분', '비교 기준선 표시', '각 diff 명령의 양쪽에 놓인 상태를 그림으로 표시해요.'), activity('25분', 'staged 내용 검토', '다음 커밋에 들어갈 차이가 요구사항만 포함하는지 읽어요.'), activity('20분', '실수 방지 질문', '원하는 내용을 보기 위해 어떤 diff 명령을 쓸지 골라요.')],
    exercises: [
      choice('foundation-w04-d02-q01', '다음 커밋 diff', '다음 커밋에 들어갈 staged 변경을 확인하는 명령은 무엇인가요?', [
        ['a', '`git diff --staged`'], ['b', '`git diff`'], ['c', '`git status --branch`'],
      ], 'a', { a: '이 명령은 index와 HEAD 사이, 즉 staged된 변경을 보여 줘요.', b: '기본 `git diff`는 unstaged 작업 폴더 변경을 보여 줘요.', c: 'branch 상태 표시는 변경 줄의 내용을 보여 주지 않아요.' }, '커밋 직전 내용은 staging area에 있으므로 HEAD와 비교하세요.', '`git diff --staged`는 다음 커밋에 준비된 내용을 검토하는 명령이에요.'),
      choice('foundation-w04-d02-q02', 'add 후 수정한 파일', '`src/app.js`를 `git add`한 다음 다시 수정했습니다. 기본 `git diff -- src/app.js`가 주로 보여 주는 것은 무엇인가요?', [
        ['a', '마지막 add 이후 작업 폴더에 추가로 생긴 차이'], ['b', 'staging area와 HEAD 사이의 전체 staged 변경'], ['c', '원격 저장소의 파일 목록'],
      ], 'a', { a: '기본 diff는 index와 현재 작업 파일 사이의 unstaged 부분을 비교해요.', b: 'staged 차이는 `git diff --staged`로 확인해요.', c: '기본 diff는 원격 파일을 읽지 않아요.' }, 'staging 이후 파일을 다시 수정했는지 기억해 보세요.', '첫 번째 수정은 index에 있고, 그 뒤에 생긴 변경이 기본 `git diff`에 나타나요.'),
      locate('foundation-w04-d02-q03', '검토 기준을 잘못 고른 줄', '목표는 다음 커밋에 들어갈 staged 변경을 모두 검토하는 것입니다. 잘못된 명령을 쓴 줄을 고르세요.', ['git status --short', 'git diff -- src/app.js', 'git commit -m "ship change"'], [2], '기본 diff는 staged가 아니라 아직 staging되지 않은 차이에 초점을 둬요.', '2번 줄의 기본 `git diff`는 unstaged 변경을 보여 줘요. staged 내용을 검토하려면 `git diff --staged`가 필요해요.'),
    ],
  },
  {
    number: 3,
    title: '커밋 이력과 log',
    objective: '커밋 식별자, 메시지, 부모 관계를 요약 이력에서 읽어요.',
    intro: '`git log`는 커밋의 순서와 메시지, 작성 정보를 보여 줘요. 짧은 이력은 변경이 언제 어떤 목적의 기록으로 남았는지 빠르게 파악하게 해줍니다.',
    example: 'a1b2c3d fix empty input\n9e8d7c6 add form validation\n\n각 행은 커밋의 짧은 식별자와 메시지를 나타내요.',
    activities: [activity('15분', '최신 커밋 찾기', 'log 목록에서 가장 최근 기록을 표시해요.'), activity('25분', '메시지로 의도 추적', '커밋 메시지와 변경 파일을 함께 보고 목적을 추론해요.'), activity('20분', '확인 가능한 사실 적기', '로그가 알려 주는 사실과 로그만으로 알 수 없는 사실을 나눠요.')],
    exercises: [
      choice('foundation-w04-d03-q01', '한 줄 이력의 정보', '`git log --oneline` 결과의 한 행에서 일반적으로 직접 확인할 수 있는 것은 무엇인가요?', [
        ['a', '짧은 커밋 식별자와 커밋 메시지'], ['b', '모든 파일의 전체 diff'], ['c', '다음 배포의 성공 여부'],
      ], 'a', { a: 'oneline 형식은 커밋을 짧은 요약 행으로 표시해요.', b: '변경 줄은 `git show`나 `git diff`로 따로 봐요.', c: 'Git 이력만으로 실제 배포 결과를 알 수 없어요.' }, '요약된 log 한 행에 실제 출력되는 정보를 떠올리세요.', '한 줄 log는 커밋 식별자와 메시지 등을 간결하게 보여 주며 diff 전체를 포함하지 않아요.'),
      shortAnswer('foundation-w04-d03-q02', '최근 커밋 두 개만 보기', '요약 형식으로 최근 커밋 두 개만 표시하는 명령을 적어 보세요.', ['git log -2 --oneline', 'git log --oneline -2'], 'log의 개수 제한 옵션으로 표시할 커밋 수를 정해요.', '`git log -2 --oneline`은 최신 두 커밋을 한 줄씩 보여 줘요.'),
      locate('foundation-w04-d03-q03', '로그로 알 수 없는 사실', '다음 보고에서 `git log` 출력만으로 확인할 수 없는 내용을 고르세요.', ['최근 커밋 메시지', '커밋 식별자', '원격 배포 사이트에서 변경이 실제 동작하는지'], [3], '저장소 이력과 외부 배포 환경은 서로 다른 증거예요.', '3번 줄은 로그만으로 알 수 없어요. 실제 배포 결과는 배포 환경에서 따로 확인해야 해요.'),
    ],
  },
  {
    number: 4,
    title: '복원과 되돌리기 구분',
    objective: '`restore`, `revert`, `reset`의 대상과 위험을 구분해요.',
    intro: '파일 수정 취소, 이미 만든 커밋의 반대 변경, 브랜치 기록 위치 이동은 서로 다른 작업이에요. 무엇을 보존해야 하는지 확인하기 전에는 덮어쓰거나 이력을 움직이는 명령을 실행하지 않습니다.',
    example: 'unstaged 파일 되돌리기: git restore -- src/app.js\nstaged 상태 풀기:      git restore --staged -- src/app.js\n커밋 취소용 새 기록:   git revert <commit>',
    activities: [activity('15분', '대상 세 가지 분류', '작업 파일, index, 커밋 이력 가운데 각 명령이 다루는 대상을 표시해요.'), activity('25분', '보존 조건 먼저 읽기', '수정 사항을 버려도 되는지, 공유 이력인지 조건을 적어요.'), activity('20분', '안전한 대안 고르기', '모호한 상태에서는 무엇을 먼저 확인해야 하는지 선택해요.')],
    exercises: [
      choice('foundation-w04-d04-q01', 'staged 해제', '파일 내용은 그대로 보존하면서 `src/app.js`를 staging area에서만 내리는 명령은 무엇인가요?', [
        ['a', '`git restore --staged -- src/app.js`'], ['b', '`git restore --worktree -- src/app.js`'], ['c', '`git reset --hard`'],
      ], 'a', { a: '`--staged`는 index의 준비 상태를 취소하면서 작업 파일은 남겨 둬요.', b: 'worktree 복원은 파일 내용을 index 기준으로 바꿀 수 있어요.', c: '`--hard` reset은 작업 폴더와 index 변경을 버릴 수 있어요.' }, '요구사항은 staged 상태만 해제하고 파일 내용은 보존하는 거예요.', '`git restore --staged`로 index에서 내리면 수정 내용은 작업 폴더에 남아요.'),
      choice('foundation-w04-d04-q02', '공유 커밋 되돌리기', '이미 다른 사람과 공유한 커밋의 변경을 취소하는 새 이력을 남기려면 일반적으로 어떤 명령을 검토하나요?', [
        ['a', '`git revert <commit>`'], ['b', '`git reset --hard <commit>`'], ['c', '`git clean -fd`'],
      ], 'a', { a: '`revert`는 지정한 커밋을 반대하는 새 커밋을 만들어 공유 이력을 보존해요.', b: '`reset --hard`는 브랜치와 파일 변경을 옮기거나 버릴 수 있어 공유 이력을 다룰 때 위험해요.', c: '`clean`은 추적되지 않는 파일을 삭제할 수 있어요.' }, '공유 이력을 지우지 않고 취소 내용을 새 기록으로 남기는 방식을 찾아보세요.', '공유한 커밋을 되돌리는 일반적인 방법은 `git revert`로 반대 변경을 새 커밋에 기록하는 거예요.'),
      locate('foundation-w04-d04-q03', '수정 내용을 버릴 위험 줄', '목표는 `src/app.js`의 unstaged 상태만 보존하면서 staged 준비를 취소하는 것입니다. 파일 수정을 잃게 할 수 있는 줄을 고르세요.', ['git status --short', 'git restore --staged -- src/app.js', 'git restore --worktree -- src/app.js', 'git diff -- src/app.js'], [3], '작업 파일을 복원하는 명령은 index에 없는 수정 내용을 덮어쓸 수 있어요.', '3번 줄은 작업 폴더 파일을 복원하므로 저장하지 않은 내용을 바꿀 수 있어요. 이 목표에는 staged만 취소하는 2번 줄이 맞아요.'),
    ],
  },
  {
    number: 5,
    title: '복구 시나리오 종합',
    objective: '변경을 먼저 조사하고 보존 조건에 맞는 복구 절차를 선택해요.',
    intro: '문제가 생겼을 때 바로 reset이나 삭제를 실행하기보다 현재 상태와 diff, 이력, 공유 여부를 먼저 확인하세요. 복구 목표를 한 파일 또는 한 커밋으로 좁히면 불필요한 손실을 줄일 수 있어요.',
    example: '1. git status --short\n2. git diff -- src/app.js\n3. 보존해야 할 수정인지 확인\n4. 선택한 파일만 복원하거나 revert 검토\n5. git status와 diff로 결과 확인',
    activities: [activity('15분', '복구 조건 체크', '파일 수정 보존 여부와 커밋 공유 여부를 각각 표시해요.'), activity('25분', '명령 선택 비교', '파일 단위 restore와 커밋 단위 revert의 영향을 비교해요.'), activity('20분', '검증 단계 쓰기', '복구 뒤 상태와 diff로 무엇을 재확인할지 정리해요.')],
    exercises: [
      choice('foundation-w04-d05-q01', '모호할 때 첫 행동', '변경을 보존해야 하는지 모르는 상태에서 가장 안전한 첫 행동은 무엇인가요?', [
        ['a', '`git status`와 `git diff`로 현재 상태를 확인한다'], ['b', '`git reset --hard`를 실행한다'], ['c', '`git clean -fd`로 폴더를 비운다'],
      ], 'a', { a: '현재 상태와 실제 수정 내용을 조사한 뒤 보존/복구 방법을 골라야 해요.', b: '`--hard`는 아직 커밋하지 않은 파일 수정까지 버릴 수 있어요.', c: '`clean -fd`는 추적되지 않는 파일과 폴더를 삭제할 수 있어요.' }, '상태가 불명확할수록 정보를 보존하는 읽기 명령부터 사용해요.', 'status와 diff는 변경을 버리지 않고 현재 상태를 살펴보는 읽기 명령이에요.'),
      shortAnswer('foundation-w04-d05-q02', '공유 커밋 되돌리기 명령', '공유된 커밋의 반대 변경을 새 커밋으로 남기는 명령 이름을 적어 보세요.', ['git revert', 'revert'], '브랜치 기록을 과거 위치로 옮기기보다 새 취소 기록을 만드는 명령이에요.', '`git revert`는 기존 커밋을 보존하고 반대 변경을 새 커밋으로 기록해요.'),
      locate('foundation-w04-d05-q03', '복원 뒤 staging 상태 재확인 누락', '한 파일의 수정 내용을 보존한 채 staging만 해제하려 합니다. 복원 전후 기록에서 복원 뒤 `git status` 확인 없이 끝내는 줄을 고르세요.', [
        'git status --short  # 복원 전',
        'git restore --staged -- src/app.js',
        'git diff -- src/app.js',
        '검토 종료 — 복원 후 git status는 확인하지 않음',
      ], [4], '복원 전 `status`와 복원 뒤 `status`가 모두 있는지 확인해요. `diff`는 상태 요약을 대신하지 않아요.', '4번 줄이 복원 후 `git status` 없이 끝내요. 3번 `git diff`는 파일 차이를 보여 주지만 staging 상태를 요약하지 않으므로, 복원 뒤 `git status --short`로 staged/unstaged 상태도 확인해야 해요.'),
    ],
  },
];

const makeLesson = (week, days, details) => ({
  id: `foundation-w${String(week).padStart(2, '0')}`,
  trackId: 'foundations',
  topicId: 'foundations-git',
  title: details.title,
  objective: details.objective,
  intro: details.intro,
  difficulty: '입문',
  duration: '5일',
  week,
  number: week,
  stage: 1,
  referenceVersion: 'Git 2.56.0 공식 CLI 문서 · Pro Git',
  versionReviewedAt: '2026-10-16',
  contentReviewStatus: '문항 검수 완료',
  prerequisiteLessonIds: [`foundation-w${String(week - 1).padStart(2, '0')}`],
  points: details.points,
  example: days[0].example,
  studyDays: days,
  sessions: days,
  exercises: days.flatMap((day) => day.exercises),
});

export const foundationsWeeks03And04 = [
  makeLesson(3, week03Days, {
    title: 'Git 저장소·스테이징·커밋',
    objective: '작업 폴더, staging area, 커밋 이력을 구분하고 작은 변경을 안전하게 기록합니다.',
    intro: '2주차에서 익힌 터미널 명령을 Git의 상태 모델과 연결해요. 실제 저장소에 연결하지 않는 고정 시나리오로 파일 변경이 커밋에 들어가는 과정을 따라갑니다.',
    points: ['작업 폴더는 현재 파일을 읽고 수정하는 위치예요.', '저장소 이력은 커밋으로 기록된 상태를 유지해요.', '`git add`는 다음 커밋에 넣을 현재 파일 내용을 staging area에 준비해요.', '`git commit`은 staging area의 변경을 이력으로 기록해요.', '필요한 파일만 선택하고 status와 diff로 커밋 전후를 확인해요.'],
  }),
  makeLesson(4, week04Days, {
    title: 'Git 상태·비교·안전한 복구',
    objective: 'status·diff·log로 변경을 검토하고 보존 조건에 맞는 복구 명령을 고릅니다.',
    intro: '3주차의 상태 모델을 바탕으로 Git이 보여 주는 차이와 이력을 읽고 파일 또는 커밋을 복구해요. 변경이 불분명하면 먼저 읽기 명령으로 조사하고, 파괴적 동작은 피하도록 연습합니다.',
    points: ['`git status`는 변경의 단계와 파일 상태를 요약해요.', '기본 `git diff`는 unstaged, `git diff --staged`는 staged 변경을 비교해요.', '`git log`는 커밋의 순서와 메시지를 보여 줘요.', '`git restore`는 파일/index 상태를 복원할 수 있고, 지정에 따라 수정 내용을 바꿀 수 있어요.', '`git revert`는 공유 커밋을 취소하는 반대 변경을 새 커밋으로 남겨요.'],
  }),
];
