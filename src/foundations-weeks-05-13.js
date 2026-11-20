const activity = (time, title, prompt) => ({ time, title, prompt });

const choice = (id, title, prompt, options, answer, choiceExplanations, hint, explanation) => ({
  id,
  type: 'choice',
  title,
  prompt,
  choices: options.map(([optionId, text]) => ({ id: optionId, text })),
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

const day = (week, number, data) => ({
  number,
  title: data.title,
  objective: data.objective,
  intro: data.intro,
  example: data.example,
  activities: [
    activity('15분', data.activities[0][0], data.activities[0][1]),
    activity('25분', data.activities[1][0], data.activities[1][1]),
    activity('20분', data.activities[2][0], data.activities[2][1]),
  ],
  exercises: [
    choice(`foundation-w${String(week).padStart(2, '0')}-d${String(number).padStart(2, '0')}-q01`, data.questions[0].title, data.questions[0].prompt, (() => {
      const options = data.questions[0].options;
      const correct = options.find((option) => option[0] === data.questions[0].answer);
      const distractors = options.filter((option) => option[0] !== data.questions[0].answer);
      const target = (week + number) % options.length;
      distractors.splice(target, 0, correct);
      return distractors;
    })(), data.questions[0].answer, data.questions[0].feedback, data.questions[0].hint, data.questions[0].explanation),
    shortAnswer(`foundation-w${String(week).padStart(2, '0')}-d${String(number).padStart(2, '0')}-q02`, data.questions[1].title, data.questions[1].prompt, data.questions[1].answers, data.questions[1].hint, data.questions[1].explanation),
    locate(`foundation-w${String(week).padStart(2, '0')}-d${String(number).padStart(2, '0')}-q03`, data.questions[2].title, data.questions[2].prompt, data.questions[2].lines, data.questions[2].answerLines ?? [data.questions[2].answerLine], data.questions[2].hint, data.questions[2].explanation),
  ],
});

const makeWeek = (week, title, objective, intro, points, days) => {
  const sessions = days.map((data, index) => day(week, index + 1, data));
  return {
    id: `foundation-w${String(week).padStart(2, '0')}`,
    trackId: 'foundations',
    topicId: week <= 9 ? 'foundations-git-collaboration' : week <= 12 ? 'foundations-debugging' : 'foundations-testing',
    title,
    objective,
    intro,
    difficulty: '입문',
    duration: '5일',
    week,
    number: week,
    stage: 1,
    referenceVersion: week >= 10 && week <= 13 ? 'Chrome DevTools Console · Node.js 26.12.0 test runner 공식 문서' : 'Git 2.56.0 공식 문서 · Pro Git · GitHub Docs',
    versionReviewedAt: week <= 13 ? '2026-10-16' : '2026-10-13',
    contentReviewStatus: '문항 검수 완료',
    prerequisiteLessonIds: [`foundation-w${String(week - 1).padStart(2, '0')}`],
    points,
    example: sessions[0].example,
    studyDays: sessions,
    sessions,
    exercises: sessions.flatMap((session) => session.exercises),
  };
};

const makeGitWeek = (week, title, objective, intro, points, entries) => makeWeek(week, title, objective, intro, points, entries);

export const foundationsWeeks05To13 = [
  makeGitWeek(5, 'Git 브랜치와 독립 작업', '브랜치가 커밋을 가리키는 방식과 분기·전환·작업 흐름을 이해합니다.', '브랜치는 커밋 이력에서 작업 위치를 가리키는 이름이에요. 브랜치를 만든 것과 작업 폴더를 그 브랜치로 전환한 것은 서로 다른 동작입니다. 고정된 커밋 그래프를 읽으며 기능 작업이 어디서 시작하고 기록되는지 연습해요.', [
    '브랜치는 커밋을 가리키는 이동 가능한 이름이고, 작업 파일과 같은 개념은 아니에요.',
    '`git branch <name>`은 브랜치를 만들지만 현재 작업 위치를 바꾸지 않아요.',
    '`git switch <name>`은 현재 작업 위치를 선택한 브랜치로 전환해요.',
    '기능 브랜치에서 만든 커밋은 병합되기 전까지 현재 기본 브랜치 이력을 자동으로 바꾸지 않아요.',
  ], [
    {
      title: '브랜치와 커밋 포인터', objective: '브랜치 이름이 파일 복사본이 아니라 커밋을 가리키는 이름임을 설명해요.', intro: '커밋은 부모 커밋과 연결된 기록이고 브랜치 이름은 그중 한 커밋을 가리켜요. 새 커밋을 만들면 현재 브랜치 포인터가 앞으로 이동합니다.', example: 'A---B  main\n     \\ feature → B\n\n두 이름은 지금 같은 커밋 B를 가리켜요.', activities: [['포인터 표시', '각 브랜치 이름이 가리키는 커밋을 그래프에 표시해요.'], ['기록 이동 따라가기', 'feature에서 새 커밋 C를 만들었을 때 어느 이름이 이동하는지 따라가요.'], ['파일 복사 오해 고치기', '브랜치와 별도 파일 복사본의 차이를 말로 설명해요.']], questions: [
        { title: '브랜치가 가리키는 대상', prompt: 'Git에서 `main`이나 `feature` 같은 브랜치 이름이 직접 가리키는 것은 무엇인가요?', options: [['a', '특정 커밋을 가리키는 참조'], ['b', '프로젝트 파일 전체의 별도 복사본'], ['c', '원격 서버 연결 자체']], answer: 'a', feedback: { a: '브랜치 이름은 커밋을 가리키는 참조이며 새 커밋 때 이동할 수 있어요.', b: '브랜치마다 독립된 전체 디렉터리 복사본을 뜻하지 않아요.', c: '원격과 로컬 브랜치는 별개의 참조예요.' }, hint: '커밋 그래프에서 브랜치 이름이 붙는 위치를 떠올려 보세요.', explanation: '브랜치 이름은 커밋을 가리키는 이동 가능한 참조예요.' },
        { title: '브랜치 끝 커밋 읽기', prompt: '그래프가 `A---B---C main`과 `A---B feature`라면 `main`은 어떤 커밋을 가리키나요?', answers: ['C'], hint: '브랜치 이름이 붙어 있는 끝점을 읽으세요.', explanation: '`main` 이름이 C 옆에 있으므로 현재 C를 가리켜요.' },
        { title: '포인터를 파일 복사로 설명한 줄', prompt: '브랜치 설명에서 개념을 잘못 말한 줄을 고르세요.', lines: ['main은 커밋 B를 가리킨다.', 'feature는 다른 커밋을 가리킬 수 있다.', '브랜치를 만들면 모든 프로젝트 파일의 별도 복사본이 만들어진다.', '새 커밋은 현재 브랜치의 끝을 이동시킨다.'], answerLine: 3, hint: '브랜치가 저장하는 것은 프로젝트 복사본인지, 커밋을 가리키는 이름인지 구분하세요.', explanation: '3번은 브랜치를 별도 작업 폴더 복사본으로 설명해 틀렸어요. 브랜치 이름은 커밋 참조예요.' },
      ] },
    {
      title: '만들기와 전환 구별', objective: '`branch` 생성 명령과 `switch` 전환 명령의 결과를 구분해요.', intro: '`git branch topic`은 새 이름을 현재 커밋에 만들 뿐 작업 위치를 바꾸지 않아요. `git switch topic`으로 그 브랜치로 이동해야 이후 커밋이 해당 브랜치에 기록됩니다.', example: '현재: main → B\ngit branch topic  → topic도 B를 가리킴, 현재는 main\ngit switch topic  → 현재 브랜치가 topic', activities: [['명령 결과 표 만들기', '브랜치 생성과 전환 명령 뒤의 현재 브랜치를 각각 적어요.'], ['안전한 순서 구성', '새 이름을 만들고 그 브랜치에서 작업하기까지 필요한 순서를 배열해요.'], ['현재 위치 검토', '`git status --short --branch` 결과로 현재 브랜치를 확인해요.']], questions: [
        { title: '생성만 하는 명령', prompt: '현재 `main`에 머무르면서 현재 커밋에 `feature`라는 새 브랜치만 만들려면 어떤 명령을 쓰나요?', options: [['a', '`git branch feature`'], ['b', '`git switch feature`'], ['c', '`git merge feature`']], answer: 'a', feedback: { a: '`branch` 생성 명령은 새 브랜치를 만들고 현재 위치는 유지해요.', b: '이미 존재하는 브랜치로 작업 위치를 옮기는 명령이에요.', c: '현재 브랜치에 다른 브랜치를 통합하는 명령이에요.' }, hint: '문제는 브랜치 생성만 하고 현재 위치를 그대로 두는 상황이에요.', explanation: '`git branch feature`는 새 브랜치를 만들지만 자동으로 전환하지 않아요.' },
        { title: '새 브랜치에서 작업 시작', prompt: '`feature`를 만든 뒤 그 브랜치에서 작업하려 합니다. 생성 뒤 실행할 전환 명령을 적어 보세요.', answers: ['git switch feature'], hint: '브랜치 이름을 선택해 작업 위치를 바꾸는 명령을 사용해요.', explanation: '`git switch feature`로 현재 작업 위치를 새 브랜치로 옮겨요.' },
        { title: '생성 후 전환을 빠뜨린 줄', prompt: '`feature`에서 새 커밋을 만들려고 합니다. 현재 위치가 계속 `main`에 남는 원인이 되는 줄을 고르세요.', lines: ['git status --short --branch', 'git branch feature', 'git commit -m "add feature"', 'git log --oneline --decorate'], answerLine: 2, hint: '새 이름을 만든 명령이 곧바로 현재 이름을 바꾸는지 생각해 보세요.', explanation: '2번 줄은 브랜치만 생성하고 현재 브랜치를 전환하지 않아요. 커밋 전에 `git switch feature`가 필요해요.' },
      ] },
    {
      title: 'HEAD와 현재 브랜치', objective: 'HEAD와 브랜치가 가리키는 커밋 관계를 읽어요.', intro: '보통 HEAD는 현재 체크아웃한 브랜치를 가리키고, 그 브랜치 이름은 현재 커밋을 가리켜요. 브랜치를 전환하면 다음 커밋이 이동할 기준도 바뀝니다.', example: 'HEAD → main → B\ngit switch feature\nHEAD → feature → B', activities: [['참조 화살표 그리기', 'HEAD에서 현재 브랜치와 커밋까지 화살표를 그려요.'], ['전환 전후 비교', '브랜치 전환 전후에 HEAD가 가리키는 이름을 적어요.'], ['커밋 위치 예측', 'feature로 전환한 뒤 C를 커밋했을 때 이동하는 이름을 찾어요.']], questions: [
        { title: '일반적인 HEAD 관계', prompt: '브랜치 `main`을 체크아웃한 보통 상태에서 HEAD는 무엇을 가리키나요?', options: [['a', '현재 브랜치 이름 `main`'], ['b', '항상 원격 저장소 `origin`'], ['c', '작업 폴더의 모든 파일 내용']], answer: 'a', feedback: { a: '일반적인 브랜치 체크아웃 상태에서 HEAD는 현재 브랜치를 가리켜요.', b: '원격 이름과 현재 checkout 참조는 같은 것이 아니에요.', c: 'HEAD는 참조이지 파일 내용 자체가 아니에요.' }, hint: 'HEAD는 현재 선택한 브랜치와 연결된 참조예요.', explanation: '일반적인 상태에서는 HEAD가 현재 브랜치를 가리키고 브랜치가 커밋을 가리켜요.' },
        { title: '전환 후 다음 커밋 위치', prompt: 'HEAD가 `feature`를 가리키고 있을 때 커밋 `C`를 만들면 어느 브랜치 끝이 이동하나요?', answers: ['feature', 'feature 브랜치'], hint: '현재 선택한 브랜치가 다음 커밋의 기준점이에요.', explanation: '현재 HEAD가 연결된 `feature` 브랜치가 새 커밋 C를 가리키게 돼요.' },
        { title: '커밋이 main을 이동시킨다는 오해', prompt: '현재 `feature`로 전환한 상태에서 커밋을 추가합니다. 잘못된 설명이 있는 줄을 고르세요.', lines: ['HEAD는 feature를 가리킨다.', 'feature는 현재 작업 기준 커밋을 가리킨다.', '새 커밋은 자동으로 main 브랜치 끝을 이동시킨다.', '커밋 후 feature가 새 커밋을 가리킬 수 있다.'], answerLine: 3, hint: '현재 선택된 이름과 기본 브랜치 이름을 구별하세요.', explanation: '3번은 현재 브랜치가 `feature`인데 `main`이 움직인다고 해 틀렸어요.' },
      ] },
    {
      title: '기능 변경 격리하기', objective: '기능 브랜치에서 작업을 나누고 기본 브랜치 변경과 구별해요.', intro: '작은 기능 브랜치에서 관련 변경을 기록하면 기본 브랜치의 현재 상태와 작업 내용을 비교하기 쉬워요. 아직 병합하지 않은 변경이 기본 브랜치에 포함된 것처럼 설명하지 않도록 해요.', example: 'A---B main\n     \\ C feature\n\nC는 feature에서만 기록됐고 main은 B에 머물러 있어요.', activities: [['작업 범위 분리', '기능에 필요한 파일과 무관한 파일을 구분해요.'], ['브랜치 차이 읽기', '각 참조가 가리키는 끝점으로 통합 전 변경을 찾습니다.'], ['커밋 메시지 점검', '한 커밋에 한 목적이 담겼는지 검토해요.']], questions: [
        { title: '아직 병합하지 않은 변경', prompt: '`feature`에서 C를 만들었고 `main`은 여전히 B를 가리킵니다. 어느 설명이 맞나요?', options: [['a', 'C는 feature에 있고 main에는 아직 통합되지 않았다'], ['b', '브랜치가 있으니 C가 자동으로 main에도 들어갔다'], ['c', 'C를 만들면 원격 저장소에도 자동으로 올라간다']], answer: 'a', feedback: { a: '브랜치 끝이 서로 다르면 아직 해당 변경이 자동 통합된 것은 아니에요.', b: '브랜치 간 변경은 merge 등으로 통합해야 해요.', c: '로컬 commit은 자동 push를 뜻하지 않아요.' }, hint: 'main과 feature가 가리키는 커밋이 다르다는 조건을 사용하세요.', explanation: 'feature의 C는 병합 전까지 main의 이력에 자동 포함되지 않아요.' },
        { title: '현재 브랜치 확인 명령', prompt: '작업 커밋을 만들기 전 현재 브랜치와 변경 상태를 함께 확인하는 명령을 적어 보세요.', answers: ['git status --short --branch', 'git status --branch'], hint: '현재 브랜치 표시와 변경 상태를 함께 출력하는 `status` 옵션을 사용해요.', explanation: '`git status --short --branch`와 `git status --branch`는 현재 브랜치와 변경 상태를 함께 보여 줘요. `git branch --show-current`는 브랜치 이름만 출력해 변경 상태는 알려 주지 않아요.' },
        { title: '병합 전에 이미 반영됐다고 한 줄', prompt: '커밋 그래프에서 feature의 C는 있지만 main은 B를 가리킵니다. 사실과 다른 줄을 고르세요.', lines: ['main은 B를 가리킨다.', 'feature는 C를 가리킨다.', 'C는 main에 병합되기 전이다.', 'feature 변경은 별도 통합 없이 이미 main의 이력에 들어갔다.'], answerLine: 4, hint: 'main의 끝점이 B인데 C가 그 이력에 포함될 수 있는지 보세요.', explanation: '4번은 서로 다른 브랜치 끝점을 무시해요. C를 main에 반영하려면 통합 작업이 필요해요.' },
      ] },
    {
      title: '브랜치 작업 흐름 복습', objective: '기능 브랜치를 시작하고 결과를 확인하는 순서를 완성해요.', intro: '작업 시작 전에 상태를 확인하고, 새 브랜치를 만든 뒤 전환해 작업하며, 커밋 직전 diff와 상태를 다시 읽는 흐름을 익혀요. 이 주에는 원격 서버나 실제 저장소 연결 없이 그래프와 명령 결과를 해석합니다.', example: 'git status --short --branch\ngit switch -c feature/profile\n# 수정과 확인\ngit diff\ngit add src/profile.js\ngit diff --staged\ngit commit -m "add profile view"', activities: [['순서 카드 놓기', '상태 확인·분기·전환·diff·commit을 순서대로 배열해요.'], ['현재 이름 검증', '커밋 직전 브랜치 표시가 목표 기능 브랜치인지 확인해요.'], ['다음 주 준비', 'feature 변경이 main에 들어가려면 다음에 필요한 단계를 설명해요.']], questions: [
        { title: '작업 시작의 첫 점검', prompt: '새 기능 브랜치를 만들기 전에 현재 변경을 덮어쓰지 않도록 먼저 확인할 내용은 무엇인가요?', options: [['a', '`git status`와 필요하면 `git diff`로 기존 변경을 확인한다'], ['b', '`git reset --hard`로 변경을 모두 지운다'], ['c', '`git push --force`로 원격을 덮어쓴다']], answer: 'a', feedback: { a: '먼저 현재 상태와 작업을 조사해야 보존 여부를 결정할 수 있어요.', b: '이 명령은 작업 내용을 잃게 할 수 있어요.', c: '강제 push는 공유 이력을 덮을 위험이 있고 질문의 목표와 무관해요.' }, hint: '새 작업 전에는 상태를 지우기보다 읽어서 기준을 확인하세요.', explanation: '기존 변경을 보존해야 할 수 있으므로 읽기 명령으로 상태를 먼저 확인해요.' },
        { title: '한 번에 브랜치 생성·전환', prompt: '`feature/profile`을 만들고 즉시 그 브랜치로 이동하는 명령을 적어 보세요.', answers: ['git switch -c feature/profile', 'git switch --create feature/profile'], hint: '`switch`의 새 브랜치 생성 옵션을 함께 사용해요.', explanation: '`git switch -c feature/profile`은 브랜치를 만들고 바로 전환해요.' },
        { title: '잘못된 현재 위치에서 commit', prompt: '목표 브랜치가 `feature/profile`입니다. 기록에서 기능 변경이 main에 들어갈 수 있는 원인을 고르세요.', lines: ['git status --short --branch  # 현재: main', 'git branch feature/profile', 'git add src/profile.js', 'git commit -m "add profile view"'], answerLine: 2, hint: '`branch` 생성만으로 현재 위치가 바뀌는지 확인하세요.', explanation: '2번 줄은 브랜치만 생성하고 현재는 main에 남아요. 전환하지 않고 commit하면 main에 기록될 수 있어요.' },
      ] },
  ]),
  makeGitWeek(6, '공통 기준점과 병합 결과', '공통 조상과 fast-forward 및 merge commit이 커밋 그래프에 만드는 결과를 읽습니다.', '두 브랜치가 같은 기준에서 출발해 각각 커밋을 만들 수 있어요. 병합 결과는 현재 체크아웃한 브랜치와 커밋 그래프 관계에 따라 달라집니다. 고정 그래프에서 어떤 기록이 합쳐지는지 확인하고 병합 후 diff와 상태도 살펴봅니다.', [
    '공통 조상은 두 이력이 갈라지기 전에 함께 가리키던 커밋이에요.',
    '현재 브랜치가 다른 쪽 끝점의 조상이면 fast-forward로 포인터만 앞으로 이동할 수 있어요.',
    '이력이 갈라졌으면 merge commit으로 두 부모 관계를 기록할 수 있어요.',
    '`git merge topic`은 현재 브랜치에 `topic`의 변경을 통합해요.',
  ], [
    {
      title: '공통 조상 찾기', objective: '두 브랜치 이력이 나뉘기 전 함께 거친 커밋을 찾습니다.', intro: '커밋 그래프는 각 기록의 부모 관계를 보여 줘요. 두 브랜치가 다른 커밋을 만든 경우에도 분기 전의 공통 커밋을 따라갈 수 있습니다.', example: '      C--- feature\n     /\nA---B\n     \\ D---main\n\n공통 조상: B', activities: [['부모 관계 따라가기', '각 브랜치에서 부모 방향으로 이동해요.'], ['공통 지점 표시', '두 경로가 처음 만나는 커밋을 표시해요.'], ['변경 묶음 비교', '공통 지점 이후 각 브랜치에 생긴 커밋을 비교해요.']], questions: [
        { title: '공통 기준점', prompt: '그래프에서 `feature`의 C와 `main`의 D가 모두 B를 부모 경로로 공유합니다. 공통 조상은 무엇인가요?', options: [['a', 'B'], ['b', 'C만'], ['c', 'D만']], answer: 'a', feedback: { a: 'B는 두 브랜치 경로에 모두 포함된 공통 커밋이에요.', b: 'C는 feature에만 있는 뒤쪽 변경이에요.', c: 'D는 main에만 있는 뒤쪽 변경이에요.' }, hint: '각 끝점에서 부모 쪽으로 거슬러 올라가 두 경로에 함께 있는 커밋을 찾아요.', explanation: '두 이력이 갈라지기 전 공통으로 포함된 마지막 커밋은 B예요.' },
        { title: '분기 뒤 커밋 수', prompt: '`main`과 `feature`가 B에서 갈라진 뒤 각각 D와 C를 하나씩 만들었습니다. B 이후 각 브랜치만의 커밋은 모두 몇 개인가요?', answers: ['2', '2개'], hint: 'feature 쪽 한 개와 main 쪽 한 개를 세어요.', explanation: 'B 이후 feature의 C와 main의 D, 총 두 커밋이 있어요.' },
        { title: '한쪽 변경만 세어 누락한 줄', prompt: 'B에서 갈라진 두 이력의 변경을 조사합니다. 잘못된 설명이 있는 줄을 고르세요.', lines: ['feature 쪽에는 C가 추가됐다.', 'main 쪽에는 D가 추가됐다.', 'B가 두 이력의 공통 기준점이다.', '합칠 변경은 feature의 C만 있고 main의 D는 조사할 필요가 없다.'], answerLine: 4, hint: '두 브랜치 모두 B 이후에 커밋을 만들었는지 확인하세요.', explanation: '4번은 main 쪽 D를 누락해요. 각 브랜치에서 공통 조상 뒤에 추가된 변경을 모두 비교해야 해요.' },
      ] },
    {
      title: 'fast-forward 가능한 그래프', objective: '현재 브랜치가 다른 쪽 끝점의 조상일 때 포인터 이동 결과를 예측합니다.', intro: '현재 브랜치 끝점이 합칠 브랜치의 조상이라면 새 분기 커밋 없이 현재 브랜치 이름을 앞쪽 끝점으로 이동할 수 있어요. 이를 fast-forward라고 합니다.', example: 'A---B main\n     \\ C---D feature\n\nmain에서 feature를 병합하면 main 포인터를 D로 이동할 수 있어요.', activities: [['조상 관계 확인', '현재 끝점이 다른 브랜치의 부모 경로에 있는지 확인해요.'], ['병합 뒤 위치 예측', 'fast-forward 뒤 main이 가리킬 커밋을 표시해요.'], ['새 커밋 여부 확인', '새 merge commit이 생기는 경우와 비교해요.']], questions: [
        { title: 'fast-forward 결과', prompt: '`main`은 B에 있고 `feature`는 B의 뒤쪽 D까지 이어져 있습니다. main에서 feature를 병합할 때 fast-forward가 가능하다면 결과는 무엇인가요?', options: [['a', 'main 포인터가 D로 이동한다'], ['b', 'feature가 자동으로 삭제된다'], ['c', 'B 이전의 커밋이 사라진다']], answer: 'a', feedback: { a: '현재 main 끝점을 뒤쪽 D로 옮기면 이력을 그대로 포함할 수 있어요.', b: '브랜치 삭제는 별도의 명령이에요.', c: 'fast-forward는 이전 기록을 삭제하지 않아요.' }, hint: '현재 끝점이 목표 끝점의 조상인 단순한 그래프예요.', explanation: 'fast-forward는 새 병합 커밋 없이 현재 브랜치 포인터를 D까지 앞으로 이동해요.' },
        { title: 'fast-forward 전제', prompt: 'fast-forward가 가능한 관계에서 현재 `main` 끝점 B는 `feature` 끝점 D의 이력에서 어떤 위치인가요?', answers: ['조상', '부모 경로에 있다', 'D의 조상'], hint: 'main이 feature보다 오래된 공통 선상에 있어야 해요.', explanation: 'B가 D의 조상이므로 main 포인터를 D로 전진시킬 수 있어요.' },
        { title: 'fast-forward와 삭제를 혼동한 줄', prompt: 'fast-forward 설명 중 틀린 줄을 고르세요.', lines: ['main이 현재 B를 가리킨다.', 'feature는 B 뒤의 D를 가리킨다.', 'main에서 feature를 fast-forward하면 main이 D를 가리킬 수 있다.', 'fast-forward는 feature 브랜치와 이전 커밋을 자동 삭제한다.'], answerLine: 4, hint: 'fast-forward는 참조 이동인지 브랜치 삭제인지 구분하세요.', explanation: '4번은 틀렸어요. fast-forward는 현재 브랜치 참조를 이동시키며 feature 삭제를 자동으로 하지 않아요.' },
      ] },
    {
      title: '갈라진 이력과 merge commit', objective: '양쪽에 새 커밋이 있는 그래프의 병합 기록을 읽어요.', intro: '공통 조상 뒤에 두 브랜치가 각각 커밋을 만들면 단순히 한쪽 끝으로 이동할 수 없어요. 충돌이 없으면 merge commit이 두 이력의 연결을 기록할 수 있습니다.', example: '      C---D feature\n     /       \\ \nA---B         M main\n     \\       /\n      E---F', activities: [['양쪽 진행 확인', '공통 조상 이후 각 줄의 커밋을 표시해요.'], ['병합 기록 특징', 'merge commit의 부모가 어느 이력 끝점을 포함하는지 읽어요.'], ['결과 검토', '병합 뒤 status와 diff 확인 항목을 적어요.']], questions: [
        { title: '갈라진 뒤 통합 기록', prompt: '공통 조상 뒤 `main`과 `feature`가 각각 고유 커밋을 만들었고 fast-forward할 수 없습니다. 양쪽 이력을 연결하는 일반적인 통합 결과는 무엇인가요?', options: [['a', '양쪽을 부모로 기록하는 merge commit'], ['b', 'feature의 모든 변경을 버리는 새 커밋'], ['c', '공통 조상을 삭제하는 동작']], answer: 'a', feedback: { a: '갈라진 이력을 병합하면 merge commit이 두 부모를 연결할 수 있어요.', b: '변경을 무조건 버리는 동작이 아니에요.', c: '공통 조상은 이력의 일부로 남아요.' }, hint: '두 브랜치 끝점의 관계를 하나의 연결 기록에 담는 방법을 떠올려요.', explanation: '갈라진 이력을 merge하면 merge commit이 양쪽 부모를 연결할 수 있어요.' },
        { title: '병합 대상과 현재 브랜치', prompt: '현재 `main`에서 `feature`의 변경을 합치는 명령을 적어 보세요.', answers: ['git merge feature'], hint: '`merge` 뒤에 현재 브랜치가 아니라 통합할 쪽 이름을 씁니다.', explanation: '현재 main에서 `git merge feature`를 실행하면 feature 변경을 main에 통합해요.' },
        { title: '반대쪽에서 병합한 줄', prompt: 'feature의 변경을 main에 통합하려 합니다. 현재 브랜치가 main이어야 한다는 조건을 어긴 줄을 고르세요.', lines: ['git switch main', 'git status --short --branch', 'git switch feature', 'git merge feature'], answerLine: 3, hint: 'merge 대상이 되는 현재 브랜치와 가져올 feature를 구분해요.', explanation: '3번 줄은 현재 브랜치를 feature로 바꿔요. 그 상태에서 merge feature는 자기 자신을 대상으로 하게 됩니다.' },
      ] },
    {
      title: '병합 방향과 현재 브랜치', objective: 'merge가 현재 체크아웃한 브랜치를 대상으로 동작함을 익혀요.', intro: '`git merge <name>`은 현재 브랜치에 지정한 브랜치의 변경을 통합해요. 같은 명령이라도 먼저 어디로 전환했는지에 따라 결과를 기록할 대상이 달라집니다.', example: 'git switch main\ngit merge feature\n→ feature 변경을 main에 통합', activities: [['명령 방향 표시', '현재 브랜치와 merge 인자를 서로 다른 기호로 표시해요.'], ['목표 브랜치 확인', '명령 전에 현재 브랜치를 조회해요.'], ['잘못된 방향 바로잡기', '통합 대상이 뒤집힌 시나리오를 수정해요.']], questions: [
        { title: '통합 결과를 받을 곳', prompt: '`git merge feature`를 실행할 때 변경을 통합받는 브랜치는 무엇인가요?', options: [['a', '현재 체크아웃된 브랜치'], ['b', '항상 main'], ['c', '항상 origin']], answer: 'a', feedback: { a: 'merge는 현재 브랜치에 지정한 다른 브랜치를 통합해요.', b: '현재 브랜치가 main일 때에만 main이 대상이에요.', c: '원격 이름은 현재 브랜치를 자동 결정하지 않아요.' }, hint: 'merge 명령을 실행하기 전에 switch한 브랜치를 확인하세요.', explanation: 'merge 결과는 현재 체크아웃한 브랜치에 기록돼요.' },
        { title: '기본 브랜치로 전환', prompt: '`feature`의 변경을 `main`에 합치기 직전 main으로 이동하는 명령을 적어 보세요.', answers: ['git switch main'], hint: '기존 브랜치 이름으로 전환하는 명령을 사용하세요.', explanation: '`git switch main`으로 이동한 다음 `git merge feature`를 실행해요.' },
        { title: 'merge 대상이 뒤집힌 줄', prompt: 'feature 변경을 main에 통합하는 순서에서 잘못된 줄을 고르세요.', lines: ['git status --short --branch', 'git switch feature', 'git merge main', 'git status --short --branch'], answerLine: 3, hint: '현재 feature에서 `merge main`을 하면 무엇을 어디에 합치나요?', explanation: '3번은 현재 feature에 main을 통합해요. 목표가 feature를 main에 넣는 것이라면 main으로 전환하고 `git merge feature`를 실행해야 해요.' },
      ] },
    {
      title: '병합 후 변경 검증', objective: '병합이 끝난 뒤 상태·기록·테스트 결과를 확인해요.', intro: '명령이 성공 메시지를 반환해도 결과물이 요구사항을 만족하는지 확인해야 해요. status, 그래프, diff와 관련 테스트로 병합 뒤 상태를 읽습니다.', example: 'git status --short\ngit log --oneline --graph --decorate -8\ngit diff HEAD^ HEAD\n# 관련 테스트 결과 확인', activities: [['결과 점검표 작성', '작업 폴더 상태, 그래프, 변경 내용을 나누어 확인해요.'], ['요구사항 대조', '병합 결과가 기능 요구를 충족하는지 테스트 목록과 대조해요.'], ['보고 문장 쓰기', '확인한 결과와 아직 확인하지 않은 영역을 분리해요.']], questions: [
        { title: '병합 후 필수 확인', prompt: 'merge 명령이 끝난 뒤 변경 파일과 남은 충돌 상태를 확인하는 시작점으로 적절한 것은 무엇인가요?', options: [['a', '`git status`와 필요 시 diff·테스트 확인'], ['b', '아무 확인 없이 원격에 강제 push'], ['c', '모든 브랜치를 즉시 삭제']], answer: 'a', feedback: { a: '상태와 실제 변경, 요구사항별 테스트를 확인해야 해요.', b: '강제 push는 안전하지 않고 병합 검증을 대신하지 못해요.', c: '브랜치 삭제는 검증 방법이 아니에요.' }, hint: '성공 메시지 외에 저장소의 현재 상태와 결과물을 읽어 보세요.', explanation: 'status와 diff, 관련 테스트를 확인해 병합 결과가 요구사항에 맞는지 검증해요.' },
        { title: '그래프 표시 옵션', prompt: '커밋 그래프를 한 줄 요약·브랜치 장식과 함께 확인하는 명령을 적어 보세요.', answers: ['git log --oneline --graph --decorate', 'git log --graph --oneline --decorate'], hint: '`log`에 graph, oneline, decorate 옵션을 함께 사용할 수 있어요.', explanation: '`git log --oneline --graph --decorate`는 짧은 그래프와 브랜치 참조를 표시해요.' },
        { title: '검증 없이 완료 보고한 줄', prompt: '병합 완료 보고에서 근거가 부족한 줄을 고르세요.', lines: ['git status로 남은 변경을 확인했다.', '요구사항 관련 테스트 결과를 확인했다.', '그래프에서 main이 병합 결과를 가리키는지 확인했다.', 'merge 성공 문구만 보았으므로 기능과 테스트도 모두 정상이라고 단정한다.'], answerLine: 4, hint: '명령이 성공한 것과 프로그램 요구사항이 확인된 것은 같은 증거인지 생각해요.', explanation: '4번은 실제 기능·테스트를 확인하지 않고 결과를 단정해요. 검증한 사실만 보고해야 해요.' },
      ] },
  ]),
  makeGitWeek(7, '충돌 이해와 안전한 해결', '충돌 표시를 읽고 양쪽 요구를 살려 결과를 편집·검증합니다.', '서로 다른 브랜치에서 같은 부분을 고치면 Git이 자동으로 하나를 선택할 수 없어요. 충돌 표시는 양쪽 내용을 알려 줄 뿐 어느 쪽이 정답인지 판단해 주지 않습니다. 의도를 비교해 최종 내용을 직접 결정하고 표시를 제거한 뒤 검사합니다.', [
    '충돌 블록의 HEAD 쪽과 구분선 아래 쪽은 서로 다른 변경 후보예요.',
    '표시가 있다고 한쪽을 무조건 선택하면 다른 요구사항을 잃을 수 있어요.',
    '최종 파일에서 충돌 표시를 제거하고 양쪽의 필요한 변경을 결합해요.',
    '해결 후 diff와 테스트를 확인하고, staging 및 merge 완료 절차를 이어가요.',
  ], [
    {
      title: '충돌 표시 구성', objective: '충돌 마커가 가리키는 두 변경 영역을 구분해요.', intro: '일반적인 merge 충돌 영역에는 `<<<<<<<` 아래 현재 쪽, `=======` 아래 상대 변경, `>>>>>>>` 끝 표시가 나타나요. 표식 자체는 결과 코드로 남으면 안 됩니다.', example: '<<<<<<< HEAD\n현재 브랜치 내용\n=======\n합칠 브랜치 내용\n>>>>>>> feature', activities: [['세 영역 나누기', '시작·구분·끝 표식이 각각 어느 위치를 표시하는지 적어요.'], ['양쪽 의도 읽기', '각 줄이 해결하려는 요구사항을 파악해요.'], ['최종 결과 초안', '필요한 내용을 합친 결과를 별도 줄로 작성해요.']], questions: [
        { title: '현재 쪽을 표시하는 시작', prompt: '일반적인 충돌 블록에서 `=======` 위의 내용을 시작하는 표식은 무엇인가요?', options: [['a', '`<<<<<<< HEAD`'], ['b', '`>>>>>>> feature`'], ['c', '`git status`']], answer: 'a', feedback: { a: '충돌 시작 표시 다음에 현재 쪽 내용이 나와요.', b: '이 표시는 보통 상대 변경 영역을 끝내요.', c: 'status는 충돌 파일 상태를 보여 주는 명령이에요.' }, hint: '현재 쪽 내용 바로 위에서 충돌 블록을 여는 표식을 찾으세요.', explanation: '`<<<<<<< HEAD`가 현재 쪽 영역의 시작을 표시해요.' },
        { title: '구분 표식 쓰기', prompt: '충돌 블록에서 두 변경 영역을 나누는 표식 한 줄을 적어 보세요.', answers: ['======='], hint: '등호 기호가 반복된 한 줄이에요.', explanation: '`=======`가 현재 쪽과 합칠 쪽 내용을 구분해요.' },
        { title: '최종 파일에서 제거할 충돌 표식', prompt: '충돌을 해결한 뒤 최종 파일에 남기지 말아야 할 충돌 표식 줄을 모두 고르세요.', lines: ['function getLabel(name) {', '<<<<<<< HEAD', '  return "방문자";', '=======', '  return name;', '>>>>>>> feature', '}'], answerLines: [2, 4, 6], hint: '현재 쪽 시작, 두 변경 사이 구분, 상대 쪽 끝 표식이 모두 남지 않아야 해요.', explanation: '2·4·6번 줄은 충돌 블록 표식이에요. 최종 코드를 만들 때 세 표식을 제거하고 요구사항에 맞는 반환 로직을 하나로 정리해야 해요.' },
      ] },
    {
      title: '양쪽 변경 의도 비교', objective: '두 변경의 목적을 읽고 단순 선택 대신 요구사항을 확인해요.', intro: '충돌은 코드가 동시에 바뀌었다는 신호예요. 현재 쪽과 합치는 쪽 중 어느 것이 옳은지 이름만 보고 결정할 수 없으므로 각 변경의 의도와 사용자 요구를 함께 읽습니다.', example: '현재 쪽: 기본 인사 문구\n합칠 쪽: 이름이 있을 때 사용자 이름 표시\n요구: 이름이 있으면 이름을, 없으면 기본 문구를 보여 준다', activities: [['변경 의도 카드', '두 쪽이 추가한 동작을 각각 한 문장으로 적어요.'], ['요구사항 확인', '두 조건 모두 필요한지 요구사항과 비교해요.'], ['해결 결과 작성', '두 조건을 보존하는 하나의 결과를 만들어요.']], questions: [
        { title: '두 조건을 만족하는 해결', prompt: '현재 쪽은 이름이 없을 때 기본 문구를, 합칠 쪽은 이름이 있을 때 개인화 문구를 추가했습니다. 두 요구를 모두 충족하는 해결 방식은 무엇인가요?', options: [['a', '이름이 있으면 개인화하고 없으면 기본 문구를 반환하도록 결합한다'], ['b', 'HEAD 쪽을 무조건 선택한다'], ['c', '합칠 쪽을 무조건 선택하고 기본 문구를 없앤다']], answer: 'a', feedback: { a: '양쪽 변경의 요구 조건을 함께 구현하는 결과예요.', b: '현재 쪽만 선택하면 개인화 요구를 잃을 수 있어요.', c: '합칠 쪽만 선택하면 기본 동작 요구를 잃을 수 있어요.' }, hint: '각 분기가 해결하려던 서로 다른 조건을 함께 만족시키세요.', explanation: '양쪽 요구가 모두 필요하므로 이름 유무에 따른 조건을 결과 코드에 결합해야 해요.' },
        { title: '먼저 대조할 근거', prompt: '두 변경 중 하나를 선택하기 전에 가장 먼저 대조할 자료는 무엇인가요?', answers: ['요구사항', '기능 요구사항', '요구사항과 변경 의도'], hint: '브랜치 이름만 보지 말고 어떤 동작을 만들려던 것인지 확인해요.', explanation: '요구사항과 양쪽 변경의 의도를 대조한 뒤 어떤 코드를 보존할지 결정해요.' },
        { title: '한쪽을 무조건 버린 줄', prompt: '주어진 요구사항을 모두 보존해야 합니다. 잘못된 해결 기록이 있는 줄을 고르세요.', lines: ['현재 쪽 변경 목적을 적었다.', '합칠 쪽 변경 목적을 적었다.', '요구사항과 두 변경을 대조했다.', '충돌이므로 이유를 검토하지 않고 한쪽 전체를 삭제했다.'], answerLine: 4, hint: '충돌 상황만으로 한쪽 변경이 불필요하다고 결론 낼 수 있는지 보세요.', explanation: '4번은 요구와 목적을 확인하지 않고 한 변경을 버려요. 필요한 조건을 모두 만족하는 최종 결과를 편집해야 해요.' },
      ] },
    {
      title: '충돌을 편집해 해결', objective: '표식을 제거하고 요구를 반영한 최종 파일을 구성해요.', intro: '마커 사이에서 최종 파일에 남길 코드를 결정하고 블록 표식을 삭제합니다. 해결 파일은 단순히 표식이 없는 것뿐 아니라 두 요구사항을 모두 만족해야 합니다.', example: '요구: 빈 이름이면 "방문자", 그 외에는 입력 이름\n최종: const label = name || "방문자";', activities: [['최종 내용만 적기', '충돌 표식이 없는 최종 코드만 별도 작성해요.'], ['양쪽 요구 확인', '현재·상대 쪽에서 필요한 동작이 결과에 있는지 체크해요.'], ['경계 입력 생각하기', '빈 값과 일반 값을 각각 대입해 결과를 예측해요.']], questions: [
        { title: '최종 파일의 기준', prompt: '충돌 해결 후 저장할 파일에는 무엇이 있어야 하나요?', options: [['a', '요구사항을 반영한 하나의 최종 내용과 제거된 마커'], ['b', '두 버전 전체와 마커를 그대로 둔 내용'], ['c', '충돌이 난 파일을 무조건 빈 파일로 만든 결과']], answer: 'a', feedback: { a: '최종 파일은 코드로 사용할 하나의 결과를 담고 표식은 없어야 해요.', b: '마커는 Git 작업 표시라 결과 소스에 남길 수 없어요.', c: '필요한 기능을 버리는 방식이에요.' }, hint: '해결 단계는 후보를 남기는 것이 아니라 사용할 최종 파일을 결정하는 작업이에요.', explanation: '요구사항을 반영한 단일 최종 내용을 편집하고 충돌 마커를 제거해야 해요.' },
        { title: '최종 코드 한 줄', prompt: '`name`은 문자열입니다. 빈 문자열이면 `"방문자"`, 비어 있지 않으면 그 이름을 반환하는 JavaScript 표현식을 적어 보세요.', answers: ['name || "방문자"', "name || '방문자'"], hint: '논리 OR는 왼쪽이 falsy일 때 기본 값을 선택해요. 여기서는 `name`이 문자열이라는 조건을 사용하세요.', explanation: '`name`이 문자열로 한정되므로 `name || "방문자"`는 빈 문자열일 때 기본 문구를, 비어 있지 않은 문자열일 때 이름을 선택해요.' },
        { title: '마커만 제거하고 내용도 삭제한 줄', prompt: '충돌 마커를 정리하면서 필요한 기능까지 잃게 하는 해결 줄을 고르세요.', lines: ['<<<<<<< HEAD', 'const message = "방문자";', '=======', 'const message = name;', '>>>>>>> feature', '최종 파일: 빈 파일로 저장'], answerLine: 6, hint: '마커를 제거한 뒤에도 앱이 요구된 결과를 만들 코드가 있어야 해요.', explanation: '6번은 파일을 비워 두어 기본 문구와 개인화 기능 모두 잃어요. 요구에 맞는 하나의 최종 표현식을 작성해야 해요.' },
      ] },
    {
      title: '해결 결과와 충돌 마커 확인', objective: '모든 충돌 파일과 마커 제거 여부, 변경 내용을 확인해요.', intro: '파일 하나를 해결했더라도 저장소의 다른 충돌이 남을 수 있어요. 상태를 확인하고 결과 diff에서 마커가 빠졌는지, 의도한 코드가 들어갔는지 살펴보세요.', example: 'git status --short\n# conflicted paths 확인\nrg "^(<<<<<<<|=======|>>>>>>>)" src\ngit diff -- src/profile.js', activities: [['미해결 목록 확인', '`git status`에서 unmerged 경로를 찾습니다.'], ['마커 검색 결과 검토', '충돌 표식이 실제 소스에 남아 있는지 확인해요.'], ['diff에서 양쪽 요구 대조', '최종 변경에 필요한 양쪽 동작이 포함됐는지 확인해요.']], questions: [
        { title: '미해결 파일 확인', prompt: '아직 해결되지 않은 merge 충돌 경로를 확인하는 적절한 첫 명령은 무엇인가요?', options: [['a', '`git status`'], ['b', '`git log -1`만 실행'], ['c', '`git branch -d --all`']], answer: 'a', feedback: { a: 'status는 충돌 및 작업 트리 상태를 요약해요.', b: '최근 커밋 하나만으로 충돌 파일 상태를 확인할 수 없어요.', c: '브랜치 삭제는 충돌 확인에 맞지 않아요.' }, hint: '현재 저장소에서 해결할 파일 목록을 보여 주는 명령을 고르세요.', explanation: '`git status`가 충돌 중인 경로와 미해결 상태를 표시해요.' },
        { title: '병합 계속 전 명령', prompt: '충돌 해결 파일을 staging한 뒤 현재 merge를 마무리하는 명령을 적어 보세요.', answers: ['git merge --continue'], hint: '해결된 파일을 add한 다음 merge의 이어 하기 옵션을 사용해요.', explanation: '충돌 파일을 staging한 뒤 `git merge --continue`로 병합을 계속할 수 있어요.' },
        { title: '검증 없이 staging한 줄', prompt: '해결 후 표식 제거와 결과 검토를 빠뜨린 줄을 고르세요.', lines: ['충돌 파일의 요구사항을 대조한다.', '최종 파일에서 충돌 표식을 검색한다.', 'git diff로 해결 결과를 읽는다.', '결과를 읽지 않고 모든 파일을 git add한다.'], answerLine: 4, hint: 'staging 전에 최종 내용이 요구를 반영하는지 확인해야 해요.', explanation: '4번은 해결 내용과 마커 제거를 검토하지 않고 진행해 오류를 놓칠 수 있어요.' },
      ] },
    {
      title: '충돌 해결 후 테스트와 완료', objective: '해결 파일을 확인·검사·기록하는 안전한 순서를 익혀요.', intro: '충돌 표시를 없앤 것만으로 해결이 끝난 것은 아니에요. diff와 테스트로 양쪽 요구를 확인하고 해결된 파일만 staging한 다음 merge를 완료합니다.', example: '1. 최종 내용 저장\n2. 충돌 마커 확인\n3. git diff --check\n4. 관련 테스트 실행\n5. git add <resolved-path>\n6. git merge --continue', activities: [['완료 순서 배열', '편집·마커 검사·테스트·staging·계속 순서를 정해요.'], ['범위 확인', '해결한 파일만 staging했는지 살펴요.'], ['통합 결과 복습', '병합 뒤 상태와 그래프를 확인합니다.']], questions: [
        { title: 'staging 전 검사', prompt: '충돌 해결 파일을 staging하기 전 가장 적절한 확인 조합은 무엇인가요?', options: [['a', 'diff와 관련 테스트를 확인한다'], ['b', '검사 없이 merge 완료를 선언한다'], ['c', '충돌이 나면 테스트를 생략한다']], answer: 'a', feedback: { a: '변경 내용과 요구 동작을 확인하고 테스트로 결과를 검사해야 해요.', b: '근거 없는 완료 선언이에요.', c: '충돌 해결이 기능 회귀를 만들 수 있으므로 관련 테스트가 필요해요.' }, hint: '마커 정리와 실제 기능 동작을 각각 검사하세요.', explanation: 'diff는 편집 내용을, 관련 테스트는 예상 동작을 확인하는 데 도움을 줘요.' },
        { title: '충돌 해결 결과 조사', prompt: '파일의 공백 오류나 충돌 표시가 남았는지 빠르게 확인하는 diff 검사를 적어 보세요.', answers: ['git diff --check'], hint: '`diff`에 검사 옵션을 붙여 공백 오류를 확인할 수 있어요.', explanation: '`git diff --check`는 변경에서 공백 오류를 찾는 데 사용할 수 있어요.' },
        { title: '확인 전에 완료 선언한 줄', prompt: '충돌 완료 절차에서 순서가 잘못된 줄을 고르세요.', lines: ['충돌 요구사항을 대조한다.', '최종 파일의 마커를 확인한다.', '관련 테스트와 diff를 검토한다.', '검사 전에 merge 완료를 선언하고 해결 내용을 확인하지 않는다.'], answerLine: 4, hint: '검증 결과보다 완료 선언이 먼저 나오는지 살펴보세요.', explanation: '4번은 실제 diff와 테스트를 보기 전에 완료를 선언하므로 검증 순서를 거꾸로 했어요.' },
      ] },
  ]),
  makeGitWeek(8, '원격 저장소와 공유 흐름', 'remote, origin, fetch, pull, push의 대상과 동기화 결과를 구분합니다.', '원격 저장소는 로컬 Git과 별도로 공유되는 저장소 위치예요. 이 과정은 고정 그래프와 출력 예시만 사용하며 계정, 토큰, 실제 인터넷 연결을 요청하지 않습니다. fetch는 원격 정보를 가져와 추적 참조를 갱신하고, pull은 가져온 뒤 선택된 통합 방식을 적용합니다.', [
    'remote 이름 `origin`은 관례적으로 많이 쓰이지만 반드시 그 이름일 필요는 없어요.',
    '`git fetch`는 원격 커밋과 추적 참조를 갱신하지만 현재 브랜치에 자동 통합하지 않아요.',
    '`git pull`은 fetch 후 설정 또는 옵션에 따른 통합을 수행해요.',
    '`git push`는 로컬 커밋을 원격으로 전송하며 non-fast-forward 거부는 먼저 이력을 확인하라는 신호예요.',
  ], [
    {
      title: 'remote와 origin 이름', objective: '원격 저장소 위치와 로컬 remote 이름을 구분해요.', intro: 'Git은 원격 저장소에 별칭을 붙여 관리할 수 있어요. `origin`은 흔한 기본 이름이지만 Git에 반드시 고정된 이름은 아닙니다.', example: 'remote 이름: origin\nURL 별칭: https://example.invalid/team/app.git\n로컬 브랜치: main', activities: [['이름과 URL 나누기', 'remote 별칭과 저장소 위치 문자열을 구분해요.'], ['원격 목록 읽기', '`git remote -v` 출력에서 fetch/push 위치를 확인해요.'], ['관례와 규칙 구별', '`origin`이 관례인지 필수 키워드인지 설명해요.']], questions: [
        { title: 'origin의 의미', prompt: 'Git 저장소에서 `origin`은 보통 무엇을 가리키나요?', options: [['a', '사용자가 설정한 원격 저장소 별칭'], ['b', '항상 로컬 main 브랜치'], ['c', '모든 Git 설치에 고정된 서버 주소']], answer: 'a', feedback: { a: 'origin은 원격 저장소에 흔히 붙이는 별칭이에요.', b: '로컬 브랜치 이름과 원격 별칭은 달라요.', c: '별칭과 URL은 저장소마다 설정할 수 있어요.' }, hint: '원격 이름으로 관례적으로 널리 쓰이는 값이에요.', explanation: '`origin`은 보통 원격 저장소를 가리키는 별칭이며 이름은 변경할 수 있어요.' },
        { title: '원격별 주소 보기', prompt: 'remote 별칭과 fetch/push URL을 확인하는 명령을 적어 보세요.', answers: ['git remote -v'], hint: '`remote`에 verbose 옵션을 함께 사용해요.', explanation: '`git remote -v`는 remote 별칭과 연결된 주소를 표시해요.' },
        { title: '관례 이름을 필수로 표현한 줄', prompt: 'remote 설명 중 잘못된 줄을 고르세요.', lines: ['origin은 흔히 쓰는 원격 별칭이다.', 'remote 별칭은 저장소마다 다를 수 있다.', 'git remote -v로 별칭과 URL을 확인할 수 있다.', '모든 Git 저장소는 반드시 origin이라는 별칭을 사용해야 한다.'], answerLine: 4, hint: '흔한 기본 이름과 Git이 강제하는 이름을 구분하세요.', explanation: '4번은 틀렸어요. `origin`은 관례이지 반드시 사용해야 하는 이름은 아니에요.' },
      ] },
    {
      title: 'fetch는 통합하지 않음', objective: '`git fetch` 뒤의 원격 추적 참조와 현재 브랜치를 구분해요.', intro: '`git fetch origin`은 원격 정보를 내려받고 `origin/main` 같은 원격 추적 참조를 갱신할 수 있어요. 일반적으로 현재 로컬 브랜치의 내용을 자동으로 합치는 명령은 아닙니다.', example: 'fetch 전: main A, origin/main A\n원격에 B 추가\nfetch 후: main A, origin/main B', activities: [['두 포인터 상태표', 'fetch 전후 main과 origin/main이 어디를 가리키는지 적어요.'], ['통합 여부 판정', '원격 추적 참조가 움직인 것과 로컬 파일 변경을 구분해요.'], ['비교 절차 구성', 'fetch 후 양쪽 커밋을 비교할 다음 명령을 정리해요.']], questions: [
        { title: 'fetch 직후 로컬 main', prompt: '원격에 새 커밋 B가 생긴 뒤 `git fetch origin`을 했습니다. 별도 통합 전 로컬 `main`은 보통 어떻게 되나요?', options: [['a', '그대로 두고 origin/main 같은 추적 참조만 갱신한다'], ['b', '무조건 원격 B까지 자동 merge한다'], ['c', '로컬 커밋을 삭제한다']], answer: 'a', feedback: { a: 'fetch는 정보를 가져와 원격 추적 참조를 갱신하고 현재 브랜치에 통합하지 않아요.', b: '가져온 정보를 통합하는 동작은 별도로 해야 해요.', c: 'fetch는 로컬 커밋 삭제 명령이 아니에요.' }, hint: '원격 정보를 확인하는 단계와 작업 브랜치에 통합하는 단계를 구분하세요.', explanation: '`git fetch` 뒤에도 별도 merge/rebase 전까지 로컬 main은 그대로일 수 있어요.' },
        { title: '가져온 뒤 비교', prompt: '원격 변경을 가져온 뒤 현재 커밋 그래프를 짧게 비교해 볼 명령을 적어 보세요.', answers: ['git log --oneline --graph --decorate --all', 'git log --all --oneline --graph --decorate'], hint: '전체 참조를 포함해 그래프를 보여 주는 log 옵션을 추가해요.', explanation: '`git log --oneline --graph --decorate --all`로 로컬과 원격 추적 참조를 함께 비교할 수 있어요.' },
        { title: 'fetch가 파일을 자동 덮는다고 한 줄', prompt: 'fetch 설명 중 실제 동작과 다른 줄을 고르세요.', lines: ['fetch는 원격에서 정보를 가져온다.', '원격 추적 참조가 새 커밋을 가리킬 수 있다.', '현재 브랜치는 별도 통합 전까지 유지될 수 있다.', 'fetch는 항상 현재 작업 파일을 원격 내용으로 즉시 덮어쓴다.'], answerLine: 4, hint: '가져오기와 현재 브랜치로 통합하기는 다른 단계예요.', explanation: '4번은 틀렸어요. fetch는 원격 정보를 가져오지만 보통 현재 작업 파일을 즉시 덮어쓰지 않아요.' },
      ] },
    {
      title: 'pull과 통합 방식', objective: '`git pull`이 fetch 뒤 선택된 통합 방식을 적용함을 이해해요.', intro: '`git pull`은 원격 변경을 가져온 뒤 merge 또는 설정·옵션에 따른 rebase 같은 통합을 수행할 수 있어요. 항상 같은 종류의 커밋이 생긴다고 단정하지 말고 저장소 설정과 명령 옵션을 확인하세요.', example: 'git pull origin main\n= fetch + 설정/옵션에 따른 통합\n\n통합 방식은 설정이나 명령 옵션에 따라 달라질 수 있어요.', activities: [['pull 두 단계 분해', '원격 가져오기와 통합 부분을 나누어 표시해요.'], ['설정 확인 이유', '같은 pull 명령의 결과가 다를 수 있는 조건을 적어요.'], ['작업 전 안전 확인', '미커밋 변경과 현재 브랜치를 먼저 살펴요.']], questions: [
        { title: 'pull의 구성', prompt: '`git pull`을 가장 정확하게 설명한 것은 무엇인가요?', options: [['a', 'fetch 후 설정/옵션에 따른 통합을 수행한다'], ['b', '원격 URL만 출력한다'], ['c', '언제나 fast-forward merge만 한다']], answer: 'a', feedback: { a: 'pull은 가져오기와 선택된 통합 방식을 이어서 수행해요.', b: '주소 확인은 remote 명령 영역이에요.', c: 'pull 통합 방식은 설정과 옵션에 따라 달라질 수 있어요.' }, hint: 'fetch 다음에 로컬 브랜치 반영 단계가 이어져요.', explanation: '`git pull`은 fetch 후 merge/rebase 등 설정 또는 옵션에 따른 통합을 적용할 수 있어요.' },
        { title: '미커밋 상태 확인', prompt: 'pull 전에 현재 브랜치와 미커밋 변경을 확인할 명령을 적어 보세요.', answers: ['git status --short --branch', 'git status --branch'], hint: '현재 위치와 변경 상태를 함께 요약하는 status 옵션을 사용하세요.', explanation: '`git status --short --branch`로 pull 전에 현재 브랜치와 작업 변경을 살펴봐요.' },
        { title: '항상 merge라고 단정한 줄', prompt: 'pull 결과를 정확히 설명하지 않은 줄을 고르세요.', lines: ['pull은 원격 변경을 fetch한다.', 'pull은 설정/옵션에 따른 통합을 수행할 수 있다.', '실행 전 미커밋 작업 상태를 확인하면 도움이 된다.', '모든 git pull은 설정과 관계없이 반드시 merge commit을 만든다.'], answerLine: 4, hint: 'fast-forward, merge 설정, rebase 설정 등 결과가 달라질 수 있어요.', explanation: '4번은 틀렸어요. pull이 항상 merge commit을 만드는 것은 아니며 설정과 이력 관계에 따라 달라져요.' },
      ] },
    {
      title: 'push와 원격 갱신', objective: '로컬 commit과 원격 공유를 구분하고 안전하게 push 결과를 해석해요.', intro: '`git push`는 로컬에 만든 커밋을 원격 저장소로 전송하려는 동작이에요. 원격에 별도 이력이 있어 업데이트가 거부되면 무작정 강제 전송하지 말고 양쪽 로그와 공유 상태를 먼저 확인합니다.', example: '로컬 main: A---B\n원격 main: A---C\npush 거부: 원격에 로컬에 없는 C가 있음\n→ fetch 후 차이를 검토', activities: [['로컬/원격 비교', '각 쪽에만 있는 커밋을 찾아요.'], ['거부 원인 분류', 'non-fast-forward 상황에서 필요한 조사 단계를 적어요.'], ['강제 옵션 위험', '강제 push가 공유 이력에 미치는 영향을 설명해요.']], questions: [
        { title: 'push 목적', prompt: '`git push origin main`의 일반적인 목적은 무엇인가요?', options: [['a', '로컬 main의 커밋을 origin의 main으로 전송한다'], ['b', '원격 커밋을 로컬에 가져오기만 한다'], ['c', '로컬 작업 폴더를 새 브랜치로 전환한다']], answer: 'a', feedback: { a: 'push는 로컬에서 원격으로 커밋을 보내는 방향이에요.', b: '원격에서 가져오는 동작은 fetch/pull이에요.', c: '브랜치 전환은 switch 명령이에요.' }, hint: '데이터가 로컬에서 원격으로 향하는 명령을 떠올리세요.', explanation: '`git push`는 지정한 로컬 커밋을 원격 브랜치로 공유하는 동작이에요.' },
        { title: 'push 거부 뒤 안전한 다음 행동', prompt: 'non-fast-forward push가 거부되고 원격 커밋을 보존해야 합니다. 먼저 할 안전한 다음 행동을 간단히 적어 보세요.', answers: ['fetch하고 양쪽 이력을 비교한다', 'git fetch 후 비교', '원격 변경을 fetch해 검토한다'], hint: '원격에만 있는 커밋을 조사한 뒤 통합 계획을 세워요.', explanation: '먼저 fetch해 원격 이력을 가져오고 양쪽 차이를 검토해야 해요. 강제 push로 덮지 않습니다.' },
        { title: '거부를 강제로 덮으라는 줄', prompt: '공유 이력을 보존해야 하는 push 거부 대응에서 위험한 줄을 고르세요.', lines: ['push 거부 메시지를 읽는다.', 'fetch 후 양쪽 커밋을 비교한다.', '필요한 변경을 통합하고 테스트한다.', '원인을 확인하지 않고 git push --force로 원격 기록을 덮는다.'], answerLine: 4, hint: '다른 사람이 올린 원격 이력을 보존하는 조건을 확인하세요.', explanation: '4번은 원격 기록을 강제로 덮을 위험이 있어요. 거부 이유를 조사하고 변경을 통합한 뒤 다시 push해야 해요.' },
      ] },
    {
      title: '계정 없이 동기화 흐름 종합', objective: '가상 원격 그래프에서 fetch·비교·통합·push 순서를 선택해요.', intro: '실제 원격 주소나 자격 증명 없이 고정된 그래프와 명령 결과로 공유 흐름을 연습해요. 원격에만 있는 커밋, 로컬에만 있는 커밋, 현재 작업 변경을 각각 보존하는 것이 목표입니다.', example: '1. git status --short --branch\n2. git fetch origin\n3. git log --graph --oneline --decorate --all\n4. 차이 통합 계획\n5. 테스트 후 git push origin main', activities: [['상태 카드 분류', '로컬·원격 추적 참조·작업 파일을 구분해요.'], ['동기화 순서 완성', '상태 확인부터 push까지 안전한 순서를 구성해요.'], ['인증 없이 설명하기', '계정 없이도 학습할 수 있는 시뮬레이션 결과를 검토해요.']], questions: [
        { title: '공유 전에 먼저 조사', prompt: '원격에 새 커밋이 있는지 모르고 로컬 변경도 남아 있습니다. 공유 전에 가장 안전한 순서는 무엇인가요?', options: [['a', '로컬 상태를 확인하고 fetch로 원격을 읽은 뒤 차이를 검토한다'], ['b', '즉시 강제 push한다'], ['c', '원격 이름을 지우고 이력을 초기화한다']], answer: 'a', feedback: { a: '로컬 작업과 원격 이력을 조사한 뒤 통합 여부를 결정해야 해요.', b: '강제 push는 원격 변경을 잃게 할 수 있어요.', c: '정보를 보존하지 않는 위험한 행동이에요.' }, hint: '공유 전 양쪽 변경을 읽고 보존 조건부터 확인하세요.', explanation: '먼저 status로 로컬 상태를 보고 fetch한 뒤 원격과 로컬 이력을 비교해요.' },
        { title: '로컬 커밋 공유 명령', prompt: '검증을 마친 로컬 `main`을 `origin`의 `main`으로 보내는 명령을 적어 보세요.', answers: ['git push origin main'], hint: 'push 뒤 원격 별칭과 브랜치 이름을 순서대로 적어요.', explanation: '`git push origin main`은 로컬 main을 원격 origin의 main에 전송해요.' },
        { title: '실제 인증을 요구한 줄', prompt: '이 과정은 고정된 시뮬레이션으로 실습합니다. 계정 없이 따라올 수 없게 만드는 줄을 고르세요.', lines: ['가상 원격 그래프를 읽는다.', 'fetch 결과 포인터를 표에 기록한다.', '변경 사례를 로컬에서 비교한다.', '학습 시작 전에 개인 GitHub 토큰을 입력해야 한다.'], answerLine: 4, hint: '실무 개념을 배우기 위해 실제 자격 증명을 요구할 필요가 있는지 생각하세요.', explanation: '4번은 학습 목표에 필요 없는 계정 자격 증명을 요구해요. 이 주는 고정된 로컬 시나리오로 진행합니다.' },
      ] },
  ]),
  makeGitWeek(9, '요구사항부터 리뷰 제안까지', '작업 범위를 정하고 변경 제안, 리뷰 의견, 병합 준비를 가상 PR로 연습합니다.', 'Pull request(PR)는 한 브랜치의 변경을 다른 브랜치에 반영해 달라고 제안하고 비교·검토·토론하는 협업 흐름이에요. 실제 GitHub 계정이나 원격 저장소 없이 이슈와 diff, 리뷰 댓글이 담긴 텍스트 사례로 목적·범위·검증 근거를 작성합니다.', [
    '좋은 변경 제안은 해결하려는 문제와 범위를 분명히 설명해요.',
    'PR 본문에는 무엇을 바꾸었는지, 왜 바꾸었는지, 어떻게 확인했는지 적어요.',
    '리뷰 의견은 요구사항·근거·위험을 확인하고 수정 또는 설명으로 응답해요.',
    '병합 준비는 상태, 충돌, 필수 검사와 승인 조건을 확인한 뒤 판단해요.',
  ], [
    {
      title: '이슈를 작업으로 나누기', objective: '요구사항을 검증 가능한 작은 변경과 제외 범위로 분해해요.', intro: '기능 요청을 구현하기 전에 사용자 문제, 기대 결과, 경계 조건, 변경 파일 범위를 적으면 불필요한 수정이 줄어요. 이번 예제는 가상의 이슈 텍스트를 사용합니다.', example: '요구: 빈 검색어에서는 전체 결과를 보여 준다.\n성공 기준: 입력값이 공백뿐일 때 기본 목록이 유지된다.\n범위: 검색 필터 함수와 테스트.', activities: [['문제 문장 추출', '요구에서 사용자 문제와 기대 결과를 표시해요.'], ['범위/제외 나누기', '필요한 파일과 이번 변경에서 다루지 않는 내용을 구분해요.'], ['완료 기준 작성', '결과를 확인할 수 있는 관찰 가능한 조건을 적어요.']], questions: [
        { title: '검증 가능한 완료 기준', prompt: '“검색을 더 좋게 만든다”를 검증 가능한 완료 기준으로 바꾼 것은 무엇인가요?', options: [['a', '공백만 입력하면 전체 기본 목록을 보여 주고 사례 테스트가 통과한다'], ['b', '코드를 많이 수정한다'], ['c', '나중에 사용자가 괜찮다고 할 것이다']], answer: 'a', feedback: { a: '입력과 기대 결과를 관찰하고 테스트할 수 있어요.', b: '수정량은 성공 기준이 아니에요.', c: '구체적인 결과나 검사 방법이 없어요.' }, hint: '입력 조건과 화면/함수의 기대 결과가 분명한지 확인해요.', explanation: '공백 입력이라는 조건과 기본 목록 결과를 명시해 검증할 수 있어요.' },
        { title: 'PR 범위 설명 한 줄', prompt: '이번 변경이 검색 필터와 테스트만 수정하고 화면 레이아웃은 건드리지 않는다면, PR 범위를 한 문장으로 적어 보세요.', answers: ['검색 필터의 공백 입력 처리를 수정하고 관련 테스트를 추가한다', '검색 필터 공백 입력과 관련 테스트만 수정한다', '검색 필터에서 공백 입력을 처리하도록 수정하고 관련 테스트를 추가한다', '공백 검색어 처리를 수정하고 테스트를 추가한다'], hint: '변경 대상과 변경 목적을 함께 적고 하지 않은 큰 작업을 끼워 넣지 마세요.', explanation: '범위에 해당하는 필터 동작과 관련 테스트를 명확히 설명하면 검토하기 쉬워요.' },
        { title: '요구와 무관한 범위 추가', prompt: '검색 입력 문제만 해결하는 이슈입니다. 범위를 불필요하게 키우는 줄을 고르세요.', lines: ['빈 입력 조건과 기대 결과를 적는다.', '검색 필터와 테스트를 변경 대상으로 잡는다.', '레이아웃 재설계를 이번 범위에서 제외한다.', '관련 없는 인증 시스템과 결제 화면도 함께 전면 재작성한다.'], answerLine: 4, hint: '사용자 요구를 해결하는 데 필요하지 않은 변경을 찾아요.', explanation: '4번은 검색 이슈와 관계없는 인증·결제 재작성으로 범위를 키워 검토 위험을 늘려요.' },
      ] },
    {
      title: 'diff 검토와 PR 설명', objective: '변경 내용과 의도, 검사 결과를 연결해 짧은 PR 설명을 작성해요.', intro: 'PR은 코드 차이와 설명을 함께 검토하는 제안이에요. 설명은 변경 목적, 주요 구현, 실행한 검사, 알려진 제한을 사실대로 전달해야 합니다.', example: '문제: 공백 검색어가 빈 결과를 만들었음\n변경: 입력을 trim한 뒤 빈 경우 기본 목록 반환\n검사: 공백·일반 검색어 사례 테스트', activities: [['diff에서 핵심 변경 찾기', '요구와 관계없는 줄이 섞였는지 확인해요.'], ['설명 항목 채우기', '문제·수정·검사·제한을 각각 적어요.'], ['근거 확인', '실행하지 않은 테스트를 통과했다고 쓰지 않아요.']], questions: [
        { title: '정확한 PR 테스트 보고', prompt: '테스트를 실행하지 않았다면 PR에 어떻게 적는 것이 정확한가요?', options: [['a', '테스트 미실행이라고 기록하고 필요한 확인을 남긴다'], ['b', '변경이 작으므로 테스트 통과라고 쓴다'], ['c', '검사 결과를 아예 숨긴다']], answer: 'a', feedback: { a: '확인한 것과 하지 않은 것을 구분해요.', b: '실행하지 않은 검사를 통과했다고 말하면 부정확해요.', c: '리뷰어가 위험을 판단할 근거가 줄어요.' }, hint: '보고 문장은 실행한 검증 근거와 일치해야 해요.', explanation: '실행하지 않은 테스트는 미실행으로 쓰고 후속 확인을 알려야 해요.' },
        { title: 'PR 설명 필수 요약', prompt: '리뷰어가 변경을 이해하도록 PR 설명에 포함할 기본 항목 두 가지를 적어 보세요.', answers: ['변경 이유와 변경 내용', '문제와 수정 내용', '무엇을 왜 바꿨는지'], hint: '문제의 배경과 실제 코드 변경을 연결해요.', explanation: '무엇을 왜 바꿨는지 설명하면 diff의 목적을 검토할 수 있어요. 검사 결과도 별도 기록하면 좋아요.' },
        { title: '검사하지 않은 결과를 꾸민 줄', prompt: 'PR 설명의 정확성 기준에 어긋나는 줄을 고르세요.', lines: ['검색 공백 처리의 변경 목적을 설명했다.', '수정한 파일을 요약했다.', '실행한 테스트 결과를 실제대로 적었다.', '실행하지 않은 전체 테스트가 모두 통과했다고 기록했다.'], answerLine: 4, hint: '검증 근거가 없는 성공 주장이 포함됐는지 살펴요.', explanation: '4번은 수행하지 않은 검사를 성공했다고 허위로 보고해요.' },
      ] },
    {
      title: '리뷰 의견 분류와 응답', objective: '리뷰 피드백을 요구사항·정확성·선호 의견으로 구분하고 근거 있게 응답해요.', intro: '리뷰 의견에는 버그 위험, 요구사항 누락, 추가 근거 요청, 선택 가능한 스타일 제안이 섞일 수 있어요. 모두 같은 우선순위로 처리하지 말고 근거와 영향 범위를 확인합니다.', example: '의견 A: 공백만 있을 때 조건이 실패하는 반례가 있어요.\n의견 B: 변수 이름을 더 짧게 해도 좋겠습니다.\n→ A는 경계 동작 확인, B는 팀 규칙과 가독성에 따라 논의', activities: [['의견 분류', '정확성·요구·설명·선호 제안으로 태그해요.'], ['재현 조건 쓰기', '문제를 확인할 입력과 기대 결과를 적어요.'], ['응답 초안', '수정, 근거 설명 또는 질문으로 답해요.']], questions: [
        { title: '재현 반례가 있는 리뷰', prompt: '리뷰어가 “공백 문자열에서도 기본 목록을 보여야 하는데 현재는 빈 결과가 나옵니다”라고 지적했습니다. 가장 적절한 대응은 무엇인가요?', options: [['a', '해당 입력으로 재현하고 요구사항과 비교해 수정·테스트한다'], ['b', '리뷰 댓글을 삭제한다'], ['c', '근거 없이 현재 동작이 맞다고 답한다']], answer: 'a', feedback: { a: '입력과 결과를 검증한 뒤 수정 또는 근거를 제시해야 해요.', b: '문제 해결을 돕지 않아요.', c: '반례에 대한 근거나 테스트가 없어요.' }, hint: '관찰 가능한 입력을 만들어 현재 동작을 재현해요.', explanation: '공백 문자열로 재현하고 요구에 따라 조건을 고친 뒤 회귀 테스트를 추가하는 게 적절해요.' },
        { title: '리뷰 응답의 근거', prompt: '의견이 타당해 보이지만 바로 판단할 수 없을 때 응답에 포함할 근거 하나를 적어 보세요.', answers: ['재현 입력과 실제 결과', '관련 테스트 결과', '요구사항과 비교한 결과'], hint: '주장을 검증할 입력, 요구사항, 검사 결과 가운데 하나를 제시해요.', explanation: '재현 입력이나 테스트 결과를 제시하면 수정 여부를 투명하게 판단할 수 있어요.' },
        { title: '선호와 오류를 혼동한 줄', prompt: '리뷰 의견을 근거에 따라 처리하지 않은 줄을 고르세요.', lines: ['재현 가능한 경계 오류는 테스트로 확인한다.', '요구사항과 코드 결과를 비교한다.', '스타일 의견은 팀 규칙과 가독성을 고려해 답한다.', '모든 리뷰 의견을 이유 없이 무시한다.'], answerLine: 4, hint: '리뷰 내용마다 근거와 영향이 다를 수 있어요.', explanation: '4번은 오류와 선호 제안을 구분하거나 근거를 답하지 않고 모두 무시해요.' },
      ] },
    {
      title: '변경 범위와 위험 검토', objective: 'diff에서 불필요한 수정, 민감정보, 누락된 검증 위험을 찾습니다.', intro: '리뷰에서는 기능 동작뿐 아니라 변경 범위, 비밀값, 오류 처리, 테스트, 데이터 영향도 확인해야 해요. 공개될 수 있는 PR이나 저장소에는 토큰·개인정보를 넣지 않습니다.', example: 'diff 검토: 요구와 관련 없는 설정 변경?\n토큰/비밀번호?\n경계 입력 테스트?\n파일 삭제·데이터 변경 위험?', activities: [['변경 파일 지도', '각 diff가 어떤 요구사항을 해결하는지 연결해요.'], ['민감정보 찾기', '예제 키와 가짜 값이 구분되는지 검사해요.'], ['영향 테스트', '정상·경계·실패 동작을 나눠 확인해요.']], questions: [
        { title: '저장소에 넣지 말아야 할 값', prompt: '가상 PR diff에서 발견하면 제거하고 노출 대응을 검토해야 하는 항목은 무엇인가요?', options: [['a', '실제 접근 토큰이나 개인 비밀값'], ['b', '테스트용 공개 문자열'], ['c', '변수 이름 변경']], answer: 'a', feedback: { a: '비밀값은 공개 diff나 저장소에 남기지 않아야 해요.', b: '가짜 값임이 분명한 테스트 자료는 실제 자격 증명이 아니에요.', c: '일반 코드 이름 변경은 비밀정보가 아니에요.' }, hint: '공유되면 계정 접근에 사용될 수 있는 값을 찾으세요.', explanation: '실제 토큰이나 비밀번호는 diff에서 제거하고 이미 유출됐다면 교체 등 대응을 검토해야 해요.' },
        { title: '정상·경계·실패 테스트 구분', prompt: '변경한 기능을 확인할 테스트 종류 중 서로 다른 두 가지를 적어 보세요: 정상 입력, 경계 입력, 실패 입력.', answers: ['정상 입력과 경계 입력', '경계 입력과 정상 입력', '정상 입력과 실패 입력', '실패 입력과 정상 입력', '경계 입력과 실패 입력', '실패 입력과 경계 입력', '정상 입력, 경계 입력', '경계 입력, 정상 입력', '정상 입력, 실패 입력', '실패 입력, 정상 입력', '경계 입력, 실패 입력', '실패 입력, 경계 입력', '정상과 경계', '경계와 정상', '정상과 실패', '실패와 정상', '경계와 실패', '실패와 경계'], hint: '기대한 입력, 경계 조건, 실패를 유발하는 입력에서 두 종류를 고르면 돼요.', explanation: '정상 동작, 경계 조건, 실패 상황을 각각 확인하는 것이 유용해요. 답에는 이 중 서로 다른 두 종류가 있어야 해요.' },
        { title: '노출된 비밀값을 가리킨 줄', prompt: '아래 `[REAL_KEY_REDACTED]`는 diff에서 발견된 실제 접근 키를 가린 표시라고 가정합니다. 공개 전에 처리해야 할 줄을 고르세요.', lines: ['const exampleToken = "EXAMPLE_ONLY";', 'expect(search(" ")).toEqual(defaultItems);', 'const apiKey = "[REAL_KEY_REDACTED]"; // 실제 값은 표시하지 않음', 'README에 검사 명령을 설명한다.'], answerLine: 3, hint: '실제 값이 가려졌더라도 원래 이 줄에 접근 키를 직접 넣었다는 조건을 확인하세요.', explanation: '3번은 실제 접근 키가 코드에 하드코딩돼 있었다는 사례예요. 공개 전에 제거해야 하고, 이미 공유했다면 해당 키를 폐기하고 교체해야 해요. 예제에는 실제 키를 넣지 않고 가림표시만 사용했어요.' },
      ] },
    {
      title: '병합 준비와 PR 종합', objective: '변경, 리뷰, 충돌, 필수 검사 상태를 근거로 병합 준비를 판단해요.', intro: 'PR을 병합하기 전에는 목적과 범위, 승인·필수 검사, 해결되지 않은 리뷰, 충돌 상태를 확인해야 해요. 가상 사례에서는 팀 정책을 제공하므로 외부 계정이나 실제 branch 연결은 필요하지 않습니다.', example: '필수 검사: 실패\n리뷰: 요청 변경 사항 미반영\n충돌: 없음\n판정: 수정·검사 후 다시 검토', activities: [['준비 조건 목록화', '필수 검사와 해결되지 않은 리뷰를 찾습니다.'], ['판단과 근거', '준비/대기 결론을 각 조건에 연결해요.'], ['완료 보고', '확인된 검사와 미해결 항목을 분리해 보고해요.']], questions: [
        { title: '실패 검사가 있는 PR', prompt: '팀 정책상 필수 검사 하나가 실패했고 수정 요청도 남아 있습니다. 가장 적절한 병합 판단은 무엇인가요?', options: [['a', '대기하고 실패 원인과 요청 사항을 해결한 뒤 다시 확인한다'], ['b', '변경이 작으니 바로 병합한다'], ['c', '검사 기록을 지우고 준비 완료로 표시한다']], answer: 'a', feedback: { a: '정책상 필수 조건이 충족될 때까지 수정·검증해야 해요.', b: '규모가 작아도 실패 검사와 미해결 리뷰는 남아 있어요.', c: '검증 기록을 숨기는 것은 정확하지 않아요.' }, hint: '주어진 팀 정책에서 필수로 요구된 조건을 모두 확인하세요.', explanation: '필수 검사가 실패하고 요청 사항이 해결되지 않았으므로 수정 후 다시 검토해야 해요.' },
        { title: '병합 준비 확인 항목', prompt: '병합 준비를 판단할 때 다음 중 서로 다른 두 항목을 적어 보세요: 필수 검사 결과, 미해결 리뷰, 충돌 상태.', answers: ['필수 검사와 미해결 리뷰', '미해결 리뷰와 필수 검사', '충돌 상태와 필수 검사', '필수 검사와 충돌 상태', '미해결 리뷰와 충돌 상태', '충돌 상태와 미해결 리뷰'], hint: '정책에서 요구하는 자동 검사, 리뷰, 충돌 상태 중 두 가지를 골라요.', explanation: '필수 검사 결과, 미해결 리뷰, 충돌 상태를 각각 확인해요. 이 답안은 그중 두 항목을 말해야 해요.' },
        { title: '실패 상태를 숨기고 승인한 줄', prompt: '가상 PR의 병합 준비 상태에서 잘못된 결론을 고르세요.', lines: ['필수 검사 결과를 확인했다.', '미해결 리뷰 요청을 확인했다.', '충돌 여부를 확인했다.', '필수 검사 실패와 미해결 요청이 있지만 준비 완료로 보고한다.'], answerLine: 4, hint: '현재 상태와 결론이 일치하는지 대조하세요.', explanation: '4번은 실패 검사와 미해결 요청을 무시해요. 조건을 해결하기 전에는 병합 준비로 표시하면 안 돼요.' },
      ] },
  ]),
  makeGitWeek(10, '로그와 오류에서 단서 찾기', '오류 기록과 입력 정보를 살펴 확인한 내용, 가능한 원인, 다음에 확인할 일을 구분해요.', '오류 메시지는 문제가 드러난 곳을 알려 주는 단서이지, 항상 진짜 원인은 아니에요. 문제가 난 입력값과 그 값이 함수에 전달되기까지의 흐름을 함께 확인해요. 예제는 브라우저 개발자 도구와 Node.js 공식 문서의 로그·테스트 내용을 바탕으로 합니다.', [
    '로그에 적힌 오류 메시지와 위치는 확인된 내용이고, 원인은 더 조사해야 해요.',
    '함수 호출 기록(스택 추적)을 따라가면 오류가 어떤 함수들을 거쳤는지 알 수 있어요.',
    '오류가 난 입력값과 오류 직전 상태를 기록하면 같은 문제를 다시 확인하기 쉬워요.',
    '다음에는 가능한 원인 하나를 확인할 수 있는 간단한 검사를 해요.',
  ], [
    {
      title: '확인된 사실과 원인 후보 구분', objective: '오류 기록에 실제로 적힌 내용과 아직 확인되지 않은 원인을 나눠요.', intro: '로그에 `TypeError`(자료형 오류)와 파일·줄 번호가 적혀 있으면 오류 종류와 표시 위치까지는 확인할 수 있어요. 값이 왜 그렇게 됐는지는 입력과 데이터가 전달되는 과정을 살펴봐야 알 수 있어요.', example: '오류 메시지: `Cannot read properties of undefined`\n뜻: 값이 정해지지 않은 상태(undefined)에서 그 값 안의 정보를 읽으려 했다는 오류예요.\n확인된 위치: `renderCard` 함수의 18번째 줄\n가능한 원인: API 응답에 필요한 값이 빠졌을 수 있어요.\n다음에 확인할 것: 문제가 난 입력과 `renderCard`에 전달된 값을 살펴봐요.', activities: [['로그에서 확인한 것 찾기', '오류 메시지와 위치에 실제로 적힌 정보를 표시해요.'], ['확인한 내용과 원인 후보 나누기', '로그에 적힌 사실과 아직 확인하지 않은 내용을 나눠요.'], ['원인 후보 확인하기', '가능한 원인 하나를 확인할 자료를 골라요.']], questions: [
        { title: '로그에서 확인할 수 있는 내용', prompt: '로그에 `TypeError` 오류와 `renderCard.js`의 18번째 줄이 기록돼 있어요. 이 기록만으로 바로 알 수 있는 내용은 무엇인가요?', options: [['a', '자료형 오류(TypeError)가 renderCard.js의 18번째 줄에 기록됐다'], ['b', 'API 서버가 오류의 원인이다'], ['c', '코드를 고치면 모든 입력에서 문제가 해결된다']], answer: 'a', feedback: { a: '로그에 적힌 오류 종류와 위치예요.', b: '로그만으로 API 서버가 원인이라고 알 수 없어요.', c: '한 입력의 오류만으로 모든 입력에서 문제가 해결됐는지 알 수 없어요.' }, hint: '기록에 실제로 적힌 내용과 아직 확인하지 않은 원인을 나눠요.', explanation: '오류 종류와 파일·줄 번호는 로그에서 확인할 수 있어요. API 서버가 원인인지, 수정이 모든 입력에 효과가 있는지는 추가로 확인해야 해요.' },
        { title: '원인 후보를 적는 방법', prompt: '오류 기록에 `user` 값이 정해지지 않았다고 나와요. 아직 이유를 확인하지 않았다면 어떻게 적는 게 좋을까요?', answers: ['입력 자료에서 user가 빠졌을 수 있으니 확인한다', 'user 값이 빠졌는지 입력을 확인한다', '입력 자료에 user 값이 없는 것이 원인인지 살펴본다'], hint: '원인을 확정하지 말고, 가능한 원인과 확인할 내용을 함께 적어요.', explanation: '오류 기록만으로 입력 자료가 원인이라고 확정할 수 없어요. 입력에 user가 있는지와 값이 전달되는 과정을 확인해야 해요.' },
        { title: '로그에 없는 원인을 단정한 문장', prompt: '다음 중 오류 기록만으로 알 수 없는 내용을 사실처럼 단정한 문장은 무엇인가요?', lines: ['로그에 TypeError가 기록됐다.', '오류 위치는 renderCard.js의 18번째 줄이다.', '입력에 user 값이 있는지 확인한다.', '이 로그만으로 데이터베이스 오류가 원인이라고 결론 내린다.'], answerLine: 4, hint: '로그에 실제로 적히지 않은 원인까지 확정했는지 확인해요.', explanation: '4번은 오류 기록만 보고 데이터베이스를 원인으로 단정해요. 입력값과 코드 흐름 등 다른 정보도 살펴봐야 해요.' },
      ] },
    {
      title: '함수 호출 기록 읽기', objective: '오류가 어떤 함수를 거쳐 전달됐는지 읽어요.', intro: '함수 호출 기록(스택 추적)은 오류가 난 함수와 그 함수를 부른 함수들을 보여 줘요. 오류가 외부 라이브러리(가져다 쓰는 코드) 안에서 보이더라도, 우리 앱에서 어떤 값을 전달했는지 함께 봐야 고칠 곳을 찾을 수 있어요.', example: 'TypeError: invalid value (올바르지 않은 값)\n  at formatDate (date-lib.js:42)\n  at renderCard (src/card.js:18)\n  at renderPage (src/page.js:53)', activities: [['호출 순서 표시', '오류 문구와 함수·파일·줄 번호를 적어요.'], ['앱 코드 찾기', '앱 코드와 외부 라이브러리 코드를 나눠요.'], ['전달한 값 확인하기', '앱에서 외부 함수를 부를 때 어떤 값을 넘겼는지 살펴봐요.']], questions: [
        { title: '앱에서 확인할 위치', prompt: '오류 기록에 `formatDate (date-lib.js:42)`와 `renderCard (src/card.js:18)`이 있어요. 앱이 전달한 값을 확인하려면 어느 부분을 봐야 하나요?', options: [['a', '`src/card.js`에서 `formatDate`를 호출하는 부분'], ['b', '라이브러리 설치 폴더의 코드를 바로 수정'], ['c', '오류와 관계없는 CSS 파일']], answer: 'a', feedback: { a: '앱에서 어떤 값을 넘겼는지 확인할 수 있어요.', b: '외부 코드를 고치기 전에 앱에서 전달한 값을 먼저 봐야 해요.', c: '현재 오류 기록과 관계없는 파일이에요.' }, hint: '앱 코드에서 외부 함수를 호출하는 부분을 찾으세요.', explanation: '`src/card.js`에서 `formatDate`를 부를 때 어떤 값을 전달했는지 살펴보면 돼요.' },
        { title: '파일 경로 뒤 숫자의 뜻', prompt: '`renderPage (src/page.js:53)`에서 파일 경로 뒤의 `53`은 무엇을 뜻하나요?', answers: ['줄 번호', '53번째 줄', '해당 파일의 줄 번호'], hint: '파일 이름과 숫자 사이의 콜론 뒤에 적힌 숫자예요.', explanation: '`src/page.js:53`의 `53`은 `src/page.js` 파일의 53번째 줄을 가리켜요.' },
        { title: '라이브러리부터 고치려는 문장', prompt: '앱 오류를 조사할 때 먼저 할 일로 적절하지 않은 문장은 무엇인가요?', lines: ['앱에서 어떤 값을 전달했는지 확인한다.', '입력값이 예상한 형태인지 살펴본다.', '같은 입력으로 오류가 다시 나는지 확인한다.', '호출 경로를 살펴보기 전에 외부 라이브러리 코드를 무조건 고친다.'], answerLine: 4, hint: '외부 코드가 문제인지, 앱에서 잘못된 값을 보냈는지 먼저 살펴봐야 해요.', explanation: '4번은 앱의 입력과 함수 호출을 살펴보기 전에 외부 코드를 고치려 해요.' },
      ] },
    {
      title: '오류가 난 곳과 호출한 곳 구분', objective: '오류가 난 위치와 그 함수를 부른 앱 코드를 구분해요.', intro: '오류 기록에는 실제 오류가 난 함수와 그 함수를 부른 앱 쪽 위치가 함께 나올 수 있어요. 오류가 표시된 줄만 보고 원인을 정하지 말고, 앞뒤 함수와 전달된 값을 확인해요.', example: 'at parseValue (parser.js:9)     ← 오류가 표시된 곳\nat readSetting (src/config.js:24) ← 앱에서 호출한 곳\nat start (src/main.js:7)          ← readSetting을 부른 곳', activities: [['오류 위치 표시하기', '오류가 난 함수와 그 함수를 부른 곳을 나눠요.'], ['전달한 값 확인하기', '문제가 난 줄에 어떤 값이 전달됐는지 살펴봐요.'], ['다음에 볼 곳 고르기', '오류가 난 함수 바로 위의 앱 코드를 찾아요.']], questions: [
        { title: '앱에서 다음으로 볼 위치', prompt: '오류가 난 함수는 `parseValue`이고, 앱 코드의 `readSetting (src/config.js:24)`이 그 함수를 불렀어요. 앱에서 다음으로 살펴볼 곳은 어디인가요?', options: [['a', '`src/config.js:24`에서 `parseValue`에 전달한 값'], ['b', '모든 외부 라이브러리를 한꺼번에 업데이트'], ['c', '오류와 관계없는 화면 색상 설정']], answer: 'a', feedback: { a: '앱에서 파서에 어떤 값을 전달했는지 확인할 수 있어요.', b: '한꺼번에 업데이트하면 오류 원인을 찾기 어려워요.', c: '현재 오류 기록과 관계없는 설정이에요.' }, hint: '외부 함수를 부르는 앱 코드와 그때 전달한 값을 확인하세요.', explanation: '`src/config.js:24`에서 `parseValue`에 어떤 값을 전달했는지 확인해요.' },
        { title: '오류가 난 줄에서 먼저 확인할 것', prompt: '`parseValue` 함수에서 올바르지 않은 값 오류가 났습니다. 먼저 확인할 내용 하나를 적어 보세요.', answers: ['parseValue에 전달된 입력 값', '호출 전에 값이 어떻게 바뀌었는지', '입력 값의 형식'], hint: '오류가 난 함수에 전달된 값을 살펴봐요.', explanation: '함수에 전달된 값과 그 전에 값이 바뀐 과정을 확인하면 문제가 어디서 생겼는지 좁힐 수 있어요.' },
        { title: '오류 위치만 보고 원인을 단정한 문장', prompt: '다음 중 오류가 표시된 위치만으로 원인을 단정한 문장은 무엇인가요?', lines: ['오류가 parseValue에서 기록됐다.', 'readSetting이 parseValue를 불렀다.', 'src/config.js에서 전달한 값을 확인한다.', '오류가 파서에서 났으므로 외부 라이브러리의 문제라고 결론 내린다.'], answerLine: 4, hint: '오류가 표시된 곳과 잘못된 값이 만들어진 곳이 같은지 살펴봐요.', explanation: '4번은 오류가 표시된 위치만 보고 외부 라이브러리가 원인이라고 단정해요. 앱에서 전달한 값도 확인해야 해요.' },
      ] },
    {
      title: '입력과 상태 연결', objective: '실패 입력과 직전 상태를 기록해 재현 가능한 오류 보고를 만들어요.', intro: '오류가 발생한 입력, 기대 결과, 실제 결과, 앱 상태와 재현 순서를 기록하면 다른 사람이 문제를 확인할 수 있어요. 민감 정보는 제거하고 같은 조건으로 재현되는지 확인합니다.', example: '입력: { userId: null }\n기대: 기본 프로필 표시\n실제: TypeError at card.js:18\n직전 상태: 새 세션에서 프로필을 연 직후\n비밀값: 포함하지 않음', activities: [['재현 정보 채우기', '입력·기대·실제·순서를 기록해요.'], ['민감 값 제거', '실제 개인정보와 키를 예시 값으로 바꿔요.'], ['상태 비교', '성공 입력과 실패 입력의 차이를 찾습니다.']], questions: [
        { title: '재현에 필요한 기록', prompt: '오류를 재현해 원인을 좁히는 데 가장 도움이 되는 보고 정보는 무엇인가요?', options: [['a', '실패 입력, 기대/실제 결과, 재현 단계와 관련 상태'], ['b', '“안 돼요”라는 한 문장만'], ['c', '실제 비밀번호와 계정 토큰']], answer: 'a', feedback: { a: '같은 조건을 되살리고 기대와 차이를 확인할 수 있어요.', b: '재현 조건과 결과가 없어 원인을 좁히기 어려워요.', c: '민감 정보를 공유할 필요가 없고 오히려 위험해요.' }, hint: '문제를 다시 만들 수 있는 비밀 없는 정보를 선택하세요.', explanation: '입력·기대/실제 결과·단계·상태는 재현에 도움이 되고 비밀값은 제거해야 해요.' },
        { title: '민감정보 제거', prompt: '오류 보고의 URL 쿼리에 `token=real-secret`이 들어 있었습니다. 공유하기 전에 무엇을 해야 하는지 한 가지 적어 보세요.', answers: ['토큰을 삭제하거나 가짜 값으로 치환한다', '비밀값을 제거한다', '토큰을 redacted로 바꾼다'], hint: '재현에 필요한 구조만 보존하고 실제 자격 증명은 공유하지 않아요.', explanation: '공유 로그에서 토큰을 제거하거나 `REDACTED` 같은 가짜 값으로 바꿔요.' },
        { title: '재현 정보를 누락한 줄', prompt: '오류 보고를 다시 만들기 어렵게 하는 누락 줄을 고르세요.', lines: ['문제가 난 입력을 기록한다.', '기대한 결과와 실제 결과를 적는다.', '재현 순서와 직전 상태를 남긴다.', '재현 단계나 입력은 기록하지 않고 오류 이름만 적는다.'], answerLine: 4, hint: '동일한 실패를 다시 만들 정보가 있는지 살펴요.', explanation: '4번만으로는 입력과 절차를 알 수 없어 재현하기 어려워요.' },
      ] },
    {
      title: '다음에 확인할 일을 작게 정하기', objective: '가능한 원인 하나를 확인할 간단한 관찰이나 테스트를 골라요.', intro: '여러 값을 한 번에 바꾸면 무엇 때문에 결과가 달라졌는지 알기 어려워요. 한 번에 하나의 원인을 확인하도록 로그나 입력 비교, 단위 테스트를 선택해요. 결과를 보고 다음에 확인할 일을 정해요.', example: '가능한 원인: user 값이 없는 입력에서만 실패해요.\n확인 방법: user가 있는 입력과 없는 입력으로 renderCard 실행\n살펴볼 결과: 어떤 입력에서 실패하는지와 오류 위치\n다음 확인: 데이터 변환 과정에서 user가 빠지는지 살펴봐요.', activities: [['확인할 원인 하나 고르기', '무엇이 문제인지 가능한 원인을 하나 적어요.'], ['두 입력 비교하기', '한 가지 조건만 다른 입력 두 개를 만들어요.'], ['결과에 따라 다음 단계 정하기', '결과를 보고 다음에 확인할 내용을 골라요.']], questions: [
        { title: '입력에 user가 없는 경우 확인하기', prompt: '`user`가 없는 입력에서만 화면 표시가 실패해요. 이 원인을 확인하기 위한 가장 간단한 방법은 무엇인가요?', options: [['a', '`user`가 있는 입력과 없는 입력을 같은 경로에 넣고 결과를 비교한다'], ['b', '프로젝트의 모든 코드를 한 번에 고친다'], ['c', '오류 메시지를 확인하지 않고 바로 배포한다']], answer: 'a', feedback: { a: 'user가 있는지만 다르게 한 두 입력을 비교하면 이 조건이 문제인지 확인할 수 있어요.', b: '여러 곳을 동시에 바꾸면 무엇이 영향을 줬는지 알기 어려워요.', c: '오류가 해결됐는지 확인하지 않은 상태예요.' }, hint: '`user`가 있는지 없는지만 다르게 한 두 입력을 비교해요.', explanation: '두 입력에서 `user`의 존재 여부만 다르면, 그 차이가 화면 표시 실패와 관련 있는지 확인할 수 있어요.' },
        { title: '한 번에 한 조건씩 확인하기', prompt: '원인을 확인할 때 한 번에 바꾸고 비교할 조건은 몇 가지가 적절한가요?', answers: ['하나', '1', '한 가지'], hint: '한 번에 한 조건만 바꾸면 결과가 달라진 이유를 찾기 쉬워요.', explanation: '한 번에 한 조건만 확인해야 어떤 변화가 결과에 영향을 줬는지 알 수 있어요.' },
        { title: '무엇이 원인인지 알기 어려운 조사 방법', prompt: '오류 원인을 찾기 가장 어렵게 만드는 방법은 무엇인가요?', lines: ['실패한 입력을 기록한다.', '가능한 원인을 하나 적는다.', '한 가지 조건만 바꿔 결과를 비교한다.', '입력·설정·코드를 한 번에 모두 바꾸고 결과를 비교한다.'], answerLine: 4, hint: '여러 조건을 동시에 바꾸면 어떤 변화가 결과에 영향을 줬는지 알 수 없어요.', explanation: '4번은 여러 조건을 한꺼번에 바꿔 무엇이 원인인지 구분하기 어렵게 만들어요. 한 번에 하나씩 확인해야 해요.' },
      ] },
  ]),
  makeGitWeek(11, '실패를 최소 재현으로 줄이기', '복잡한 실패를 같은 결과가 유지되는 가장 작은 입력과 절차로 축소합니다.', '재현 가능한 작은 사례는 원인 후보를 하나씩 확인하는 데 도움이 돼요. 아직 확인하지 않은 원인 후보를 ‘가설’이라고 해요. 성공 사례와 실패 사례를 비교해 문제에 영향을 주는 입력·단계·상태만 남기고, 관계없는 환경 정보는 제외해요.', [
    '최소 재현은 문제를 계속 만드는 데 필요한 입력과 절차만 남긴 사례예요.',
    '한 번에 한 요소씩 줄이고 실패가 유지되는지 매번 다시 확인해요.',
    '성공 사례와 실패 사례의 차이를 비교하면 경계 조건을 찾기 쉬워요.',
    '재현 보고에는 환경·입력·단계·기대 결과·실제 결과를 필요한 만큼 기록해요.',
  ], [
    {
      title: '실패 입력과 성공 입력 비교', objective: '실패와 성공 사례가 달라지는 입력 조건을 찾아요.', intro: '같은 실행 경로에서 성공 사례와 실패 사례를 비교하면 입력이나 상태의 차이가 드러날 수 있어요. 먼저 관찰한 차이를 적고, 원인은 확인하기 전까지 가능한 설명으로 남겨 둬요.', example: '성공: { name: "Mina" } → "Mina님"\n실패: { name: "" } → 화면 오류\n확인할 차이: name이 빈 문자열인지', activities: [['사례 차이표', '성공·실패 입력에서 다른 필드만 표시해요.'], ['결과 비교', '기대한 결과와 실제 결과를 나란히 적어요.'], ['원인 후보 확인', '입력 차이가 오류와 관련 있는지 다시 확인해요.']], questions: [
        { title: '먼저 비교할 차이', prompt: '성공 입력 `{ name: "Mina" }`와 실패 입력 `{ name: "" }`만 있을 때 가장 먼저 비교할 조건은 무엇인가요?', options: [['a', '`name` 값이 비어 있는지 여부'], ['b', '화면의 글꼴 색상'], ['c', '관련 없는 저장소 브랜치 이름']], answer: 'a', feedback: { a: '두 사례에서 명시적으로 다른 입력 조건이에요.', b: '입력 두 개의 차이로 주어지지 않았어요.', c: '실행 실패의 입력 차이를 설명하지 않아요.' }, hint: '성공·실패 입력에서 달라진 필드를 확인해요.', explanation: '현재 사례의 핵심 차이는 `name`이 빈 문자열인지 여부예요.' },
        { title: '실패 경계 입력', prompt: '일반 이름과 비교해 빈 이름 처리 오류를 재현할 입력 값을 적어 보세요.', answers: ['빈 문자열', '""', "''", 'name이 빈 문자열'], hint: '오류가 난 경계 조건을 그대로 다시 전달해요.', explanation: '빈 문자열 입력을 사용하면 경계 조건의 오류를 재현할 수 있어요.' },
        { title: '비교 조건을 바꿔 버린 줄', prompt: '성공과 실패 사례의 원인을 비교하는 과정에서 잘못된 줄을 고르세요.', lines: ['같은 화면과 같은 실행 경로를 사용한다.', '성공/실패 입력에서 name 값 차이를 기록한다.', '같은 코드로 두 입력의 결과를 비교한다.', '입력과 실행 코드와 브라우저를 동시에 바꾼 뒤 원인을 단정한다.'], answerLine: 4, hint: '여러 조건을 한꺼번에 바꾸면 어떤 차이가 원인인지 판단할 수 없어요.', explanation: '4번은 입력·코드·환경을 동시에 바꿔 원인 후보를 분리하지 못해요.' },
      ] },
    {
      title: '실패가 유지되는 최소 입력', objective: '실패에 필요 없는 입력 필드와 데이터 행을 하나씩 줄여요.', intro: '복잡한 객체나 큰 목록에서 오류가 나면 입력을 단계적으로 축소합니다. 한 번에 필드나 행 하나만 제거하고 여전히 같은 오류가 발생하는지 검사하세요.', example: '처음: { id: 3, name: "", role: "member", flags: [1, 2] }\n후보 축소: { name: "" }\n매번 같은 화면 오류가 나는지 재확인', activities: [['불필요 필드 후보', '실패 결과에 관여하지 않을 필드를 표시해요.'], ['한 가지 제거', '한 번에 필드나 행 한 개만 지워요.'], ['최소 크기 확인', '현재 남은 입력으로 같은 실패가 나는지 기록해요.']], questions: [
        { title: '안전한 축소 순서', prompt: '큰 입력에서 실패를 줄일 때 적절한 방법은 무엇인가요?', options: [['a', '한 번에 항목 하나를 줄이고 매번 같은 실패인지 확인한다'], ['b', '모든 입력을 삭제하고 오류 원인을 추측한다'], ['c', '입력과 코드와 브라우저를 함께 바꾼다']], answer: 'a', feedback: { a: '축소 뒤에도 같은 실패가 유지되는지 각 단계에서 확인해야 해요.', b: '실패를 재현하는 데 필요한 입력까지 모두 없어질 수 있어요.', c: '변경 요인을 분리하지 못해요.' }, hint: '작게 바꾼 후 실패가 계속 재현되는지 검사해요.', explanation: '한 번에 하나를 줄이고 동일한 실패를 확인하면 필요한 최소 조건을 찾을 수 있어요.' },
        { title: '최소 객체 예시', prompt: '오류가 오직 빈 `name` 값에서 재현된다면 최소 입력 객체를 JSON처럼 적어 보세요.', answers: ['{"name":""}', '{"name": ""}'], hint: '다른 필드를 제거하고 실패를 만드는 필드만 남겨요.', explanation: '`{"name":""}`처럼 실패 조건에 필요한 필드만 남기는 것이 최소 사례 후보예요.' },
        { title: '한 번에 전부 줄인 줄', prompt: '최소 재현의 원인을 확인하기 어렵게 만드는 축소 절차를 고르세요.', lines: ['필드 하나를 제거한다.', '동일한 입력으로 다시 실행한다.', '오류 종류와 출력이 유지되는지 적는다.', '모든 필드와 행을 동시에 없애고 원래 실패와 같다고 간주한다.'], answerLine: 4, hint: '원래 실패를 만드는 조건이 남아 있는지 검증해야 해요.', explanation: '4번은 축소 입력에서 원래 실패가 재현되는지 확인하지 않아 같은 문제라고 볼 수 없어요.' },
      ] },
    {
      title: '실패에 영향을 주는 단계 분리', objective: '단계가 긴 절차에서 실패가 시작되는 최소 구간을 찾습니다.', intro: '여러 동작으로 구성된 절차는 중간 상태를 기록해 실패가 발생하는 구간을 좁힐 수 있어요. 한 단계씩 제거하거나 중간 결과를 비교하며 문제가 생기기 전후를 찾습니다.', example: '입력 파싱 → 정규화 → 저장 → 화면 표시\n관찰: 정규화 결과까지 정상, 저장 이후 name 누락\n조사 범위: 저장 직전/직후 데이터', activities: [['절차 단계 지도', '입력부터 실제 오류까지 단계를 적어요.'], ['중간 결과 기록', '각 단계 전후에 값이 보존되는지 비교해요.'], ['첫 실패 경계 찾기', '정상 결과와 잘못된 결과가 갈리는 구간을 표시해요.']], questions: [
        { title: '첫 실패 구간 좁히기', prompt: '파싱과 정규화 결과는 정상이고 저장 직후 `name`이 사라집니다. 다음으로 비교할 위치는 어디인가요?', options: [['a', '저장 호출 직전과 직후 데이터'], ['b', '무관한 화면의 CSS'], ['c', '모든 파일의 최신 커밋 메시지']], answer: 'a', feedback: { a: '관찰된 정상/실패 경계가 저장 전후예요.', b: '단서와 관련이 없어요.', c: '커밋 메시지만으로 값 변경 지점을 찾을 수 없어요.' }, hint: '마지막으로 정상인 단계와 처음 실패한 단계 사이를 살펴요.', explanation: '저장 직전과 직후의 값을 비교하면 필드가 사라지는 경계를 좁힐 수 있어요.' },
        { title: '비교 지점 이름', prompt: '정상 단계와 실패 단계가 갈리는 지점을 찾기 위해 기록할 값 두 시점을 간단히 적어 보세요.', answers: ['저장 전과 저장 후', '호출 직전과 직후', '단계 전후 입력/출력'], hint: '경계가 되는 동작을 기준으로 앞과 뒤를 비교해요.', explanation: '호출 직전과 직후의 입력/출력을 비교하면 값이 바뀐 단계를 찾을 수 있어요.' },
        { title: '중간 결과를 건너뛴 줄', prompt: '실패가 시작된 단계를 정확히 찾기 어렵게 하는 조사 줄을 고르세요.', lines: ['각 단계의 입력과 출력을 기록한다.', '저장 직전/직후의 name을 비교한다.', '첫 정상 결과와 첫 실패 결과의 경계를 찾는다.', '중간 값은 보지 않고 최종 화면만 보고 저장 단계가 원인이라고 단정한다.'], answerLine: 4, hint: '원인을 특정하려면 단계별 관찰 근거가 필요해요.', explanation: '4번은 중간 데이터를 비교하지 않은 채 저장을 원인으로 단정해요.' },
      ] },
    {
      title: '재현 환경과 절차 기록', objective: '문제를 다시 만들 수 있도록 필요한 환경·단계·입력만 기록해요.', intro: '브라우저, 런타임, 운영체제, 앱 버전이 결과에 영향을 주는지 확인합니다. 모든 환경 정보를 무작정 모으기보다 재현에 필요한 값과 정확한 실행 순서를 기록하고 민감 정보는 제거해요.', example: '환경: Chrome 안정 버전, 앱 빌드 날짜\n순서: 새 세션 → 프로필 열기 → 이름 빈 상태 저장\n기대/실제: ...\n세션 토큰: 보고서에서 제거', activities: [['재현 단계 번호 매기기', '시작 상태부터 오류까지 행동을 순서대로 적어요.'], ['환경 영향 판단', '결과 차이에 관련 있을 환경만 표시해요.'], ['공유용 보고 정리', '계정·토큰·개인정보를 제거하고 결과를 요약해요.']], questions: [
        { title: '재현 보고서 구성', prompt: '다른 사람이 같은 실패를 재현하기 쉽게 만드는 정보 조합은 무엇인가요?', options: [['a', '영향 있는 환경, 단계, 입력, 기대/실제 결과'], ['b', '오류 이름만'], ['c', '공유된 실제 계정 암호']], answer: 'a', feedback: { a: '실패를 반복하고 관찰할 수 있는 정보예요.', b: '재현 조건이 부족해요.', c: '보안상 공유하지 않아야 하는 정보예요.' }, hint: '문제를 다시 만들고 결과를 비교할 수 있는 정보만 고르세요.', explanation: '관련 환경, 재현 단계, 입력, 기대와 실제 결과가 필요하며 민감정보는 제거해야 해요.' },
        { title: '재현 단계 첫 줄', prompt: '보고서의 재현 단계는 오류가 발생하기 전 어떤 상태부터 적어야 하나요?', answers: ['시작 상태', '초기 상태', '앱의 시작 상태'], hint: '같은 행동을 시작할 기준 상태를 기록해요.', explanation: '초기 상태가 있어야 다른 사람이 같은 절차를 반복할 수 있어요.' },
        { title: '비밀값을 포함한 보고 줄', prompt: '공유 전에 삭제하거나 마스킹해야 하는 줄을 고르세요.', lines: ['브라우저와 앱 버전을 적는다.', '새 세션에서 화면을 연 순서를 적는다.', '실패 입력과 기대/실제 결과를 적는다.', '재현 URL에 실제 session token 전체를 그대로 붙인다.'], answerLine: 4, hint: '계정 접근이나 사용자 식별에 사용될 수 있는 값을 찾아요.', explanation: '4번의 세션 토큰은 민감 정보이므로 공유 보고서에서 제거하거나 마스킹해야 해요.' },
      ] },
    {
      title: '최소 재현 보고와 복습', objective: '최소 입력, 실행 순서, 결과와 아직 확인하지 않은 원인을 오류 보고에 정리해요.', intro: '최소 재현에는 가장 작은 테스트 입력뿐 아니라 짧은 실행 순서와 기대한 결과·실제 결과도 포함해요. 무엇을 줄였고 같은 실패가 계속되는지 기록하면 다음 조사에 도움이 됩니다.', example: '최소 입력: { name: "" }\n절차: 새 세션 → 프로필 표시\n기대: 기본 이름 표시\n실제: TypeError\n확인하지 않은 것: 다른 브라우저에서의 동작', activities: [['보고 내용 채우기', '최소 입력·단계·결과를 한곳에 모아요.'], ['처음 실패와 비교', '줄인 입력에서도 같은 오류가 나는지 확인해요.'], ['아직 확인하지 않은 점 적기', '검사하지 않은 조건을 따로 기록해요.']], questions: [
        { title: '최소 재현의 완료 판단', prompt: '입력을 줄인 뒤 최소 재현이 성립했다고 말할 수 있는 조건은 무엇인가요?', options: [['a', '축소된 입력과 짧은 절차로 같은 실패 결과가 다시 발생한다'], ['b', '원래 입력이 아주 길다'], ['c', '오류를 다시 실행하지 않았다']], answer: 'a', feedback: { a: '원래와 같은 실패가 축소 사례에서도 재현돼야 해요.', b: '긴 입력은 축소 목표와 반대예요.', c: '재현 여부를 확인하지 않았어요.' }, hint: '같은 입력·절차로 동일한 실패가 유지되는지 확인해야 해요.', explanation: '축소된 입력과 절차로 원래 문제와 같은 실패를 반복할 수 있어야 최소 재현이에요.' },
        { title: '보고서에 남길 미확인 사항', prompt: '다른 브라우저에서 아직 확인하지 않았다면 보고서에 그 상태를 어떻게 표현할지 적어 보세요.', answers: ['다른 브라우저는 미확인', '확인하지 않음', '아직 검사하지 않았다'], hint: '수행한 확인과 하지 않은 확인을 구분해 적어요.', explanation: '다른 브라우저에서 검사하지 않았다면 미확인이라고 기록해야 해요.' },
        { title: '같은 실패인지 확인하지 않은 줄', prompt: '최소 재현을 확정하기에 부족한 줄을 고르세요.', lines: ['입력을 줄였다.', '실행 절차를 한두 단계로 정리했다.', '기대 결과와 실제 오류를 기록했다.', '축소 뒤 다시 실행하지 않고 원래 실패와 같은 문제라고 표시했다.'], answerLine: 4, hint: '줄인 입력에서도 다시 실행해 같은 오류가 나는지 확인해야 해요.', explanation: '4번은 축소 사례의 재현 여부를 검사하지 않아 최소 재현이라고 확정할 근거가 없어요.' },
      ] },
  ]),
  makeGitWeek(12, '디버깅 가설과 한 번에 하나씩 검사', '원인 가설마다 관찰 가능한 예측을 만들고 작은 검사로 확인합니다.', '원인 후보를 고친 뒤 결과를 보는 대신 먼저 가설이 맞을 때 나타날 예측을 적습니다. 한 조건만 바꾸는 검사를 수행하고 관찰 결과에 따라 가설을 좁히거나 버립니다.', [
    '가설은 관찰 가능한 원인 후보와 확인할 조건을 담아야 해요.',
    '각 가설에서 예상되는 결과를 미리 적으면 검사 뒤 판단을 비교할 수 있어요.',
    '한 번에 하나의 조건이나 변경만 검사해 원인과 결과를 분리해요.',
    '수정 후에는 같은 재현 사례와 관련 회귀 테스트를 다시 실행해요.',
  ], [
    {
      title: '검증 가능한 가설', objective: '증상, 원인 후보, 검사 방법이 포함된 가설을 작성해요.', intro: '“코드가 이상하다”는 검증하기 어려워요. “name 필드가 없는 입력에서 기본값 처리 전에 `name.trim()`을 호출해 오류가 난다”처럼 입력 상태, 원인 후보, 관찰할 결과를 구체적으로 적습니다.', example: '가설: name이 없는 입력에서 fallback보다 먼저 name.trim()을 호출해 TypeError가 발생한다.\n검사: { name: "Mina" }와 {}를 같은 함수에 전달해 결과를 비교한다.', activities: [['증상과 원인 분리', '관찰한 현상과 원인 후보를 따로 적어요.'], ['검사 가능한 문장', '입력 조건과 예상 결과를 포함해 가설을 써요.'], ['반례 준비', '가설이 틀렸음을 보일 수 있는 입력을 골라요.']], questions: [
        { title: '검증 가능한 가설 고르기', prompt: '다음 중 입력 조건과 확인 결과가 구체적인 가설은 무엇인가요?', options: [['a', 'name 필드가 없는 입력에서 기본값 처리 전에 trim()을 호출해 TypeError가 나는지 비교한다'], ['b', '어딘가 로직이 나쁘다'], ['c', '컴퓨터 문제 같다']], answer: 'a', feedback: { a: 'name이 빠진 입력과 trim 호출 순서를 지정해 결과를 비교할 수 있어요.', b: '원인 위치와 관찰 방법이 구체적이지 않아요.', c: '검사할 조건을 알 수 없어요.' }, hint: '입력값, 코드 경계, 관찰 결과를 구체적으로 읽어 보세요.', explanation: 'name 누락이라는 조건과 기본값 처리 전 trim() 호출의 TypeError를 관찰하므로 검증할 수 있어요.' },
        { title: '가설 한 문장', prompt: 'JavaScript에서 `items` 배열이 비어 있을 때 `items[0].name` 접근이 실패한다는 가설을 짧게 적어 보세요.', answers: ['빈 배열에서는 items[0]이 undefined여서 .name 접근에서 오류가 난다', 'items[0]이 undefined라 name 속성 접근이 실패한다', '배열이 비어 있어 첫 요소가 없고 name을 읽을 때 오류가 난다', '빈 items에서 items[0].name 접근이 실패한다'], hint: '`items[0]` 자체는 `undefined`를 돌려주고, 그 값의 `.name`을 읽는 단계에서 오류가 나는지 구분해요.', explanation: '빈 배열에서 `items[0]`만 읽으면 `undefined`이며 그 자체로 예외가 나지는 않아요. 이어서 `items[0].name`을 읽을 때 undefined의 속성에 접근하므로 TypeError가 발생해요.' },
        { title: '관찰 방법이 없는 추정', prompt: '검증할 조건과 결과가 빠진 가설을 고르세요.', lines: ['빈 배열 입력을 사용한다.', '첫 요소 접근 결과를 기록한다.', '예상과 실제 오류를 비교한다.', '그냥 코드 구조가 마음에 들지 않는다고 원인으로 확정한다.'], answerLine: 4, hint: '검사 가능한 입력과 관찰 결과가 있는지 확인해요.', explanation: '4번은 검증 가능한 조건이나 결과를 제시하지 않아 원인 가설로 확인할 수 없어요.' },
      ] },
    {
      title: '가설별 예측 세우기', objective: '검사 전 가설이 맞거나 틀릴 때 나타날 결과를 예측해요.', intro: '예측을 검사 전에 적으면 결과를 본 뒤 원인을 끼워 맞추는 일을 줄일 수 있어요. 두 입력을 비교하고 어느 결과가 가설을 지지하는지 명확하게 정합니다.', example: '가설: 빈 배열의 첫 요소가 없어 items[0].name 접근이 실패한다.\n예측: 일반 배열의 객체는 name 값을 반환하고, 빈 배열에서는 items[0]이 undefined라 .name 접근이 TypeError를 낸다.\n다른 결과면 이 가설을 다시 검토', activities: [['검사 전 예측', '각 입력에서 예상할 결과를 미리 적어요.'], ['지지/반박 조건', '가설을 지지하거나 반박하는 관찰을 나눠요.'], ['결과와 예측 비교', '실제 출력이 예상과 다른 부분을 표시해요.']], questions: [
        { title: '예측을 미리 적는 이유', prompt: '테스트를 실행하기 전에 예상 결과를 적어 두는 이유는 무엇인가요?', options: [['a', '관찰 결과를 사후 해석에 맞추지 않고 가설을 판정하기 위해'], ['b', '테스트를 실행하지 않아도 성공을 보장하기 위해'], ['c', '모든 다른 가설을 자동으로 없애기 위해']], answer: 'a', feedback: { a: '사전에 정한 예측과 실제 관찰을 비교할 수 있어요.', b: '예측은 실행과 검증을 대신하지 않아요.', c: '다른 가설은 별도로 검토해야 해요.' }, hint: '실행 전과 실행 후의 판단을 비교하는 기준이 필요해요.', explanation: '예측을 미리 정하면 실제 결과가 가설을 지지하는지 덜 편향되게 비교할 수 있어요.' },
        { title: '빈 배열 검사 예측', prompt: 'JavaScript에서 `items[0]`만 조사할 때 빈 배열의 첫 항목은 어떤 값으로 읽히는지 적어 보세요.', answers: ['undefined'], hint: '배열에 원소가 하나도 없으면 0번 위치에 값이 없어요.', explanation: '빈 배열에서 `items[0]`은 `undefined`를 반환하며, 인덱스 조회만으로는 예외가 나지 않아요.' },
        { title: '결과를 보고 예측을 바꾼 줄', prompt: '가설 검증 기록에서 순서가 잘못된 줄을 고르세요.', lines: ['검사 전에 예상 결과를 기록한다.', '같은 입력 조건으로 실행한다.', '실제 결과를 예상과 비교한다.', '결과를 본 다음 처음부터 예상했다고 기록한다.'], answerLine: 4, hint: '예측은 실행 전에 작성해야 관찰 결과와 비교할 수 있어요.', explanation: '4번은 결과를 본 뒤 예측을 바꿔 검증 기록을 신뢰하기 어렵게 만들어요.' },
      ] },
    {
      title: '관찰 지점과 임시 계측', objective: '가설을 구분할 로그·중단점·테스트 관찰 지점을 선택해요.', intro: '관찰은 문제 원인과 연결되는 값이 흐르는 경계에 둡니다. 로그를 지나치게 늘리기보다 입력 전후 값, 함수 호출 여부, 반환 결과처럼 가설을 판정할 정보를 선택하세요.', example: '값 누락 가설\n관찰 1: normalizeProfile 입력\n관찰 2: 반환된 profile.name\n민감 데이터는 기록하지 않음', activities: [['가설과 값 연결', '원인 후보를 확인할 변수나 함수 경계를 적어요.'], ['필요한 정보만 기록', '민감정보와 무관한 로그를 제외해요.'], ['계측 뒤 정리', '임시 로그를 제거하거나 목적에 맞게 정리해요.']], questions: [
        { title: '가설을 가르는 관찰값', prompt: '`normalizeProfile`에서 name이 사라진다는 가설을 확인하려면 가장 직접적인 관찰은 무엇인가요?', options: [['a', '함수 호출 전 입력과 반환된 name을 비교한다'], ['b', '관련 없는 버튼 색을 기록한다'], ['c', '모든 사용자 비밀번호를 로그로 남긴다']], answer: 'a', feedback: { a: '변환 함수의 입력/출력이 필드 손실 여부를 보여 줘요.', b: '가설과 관계없는 값이에요.', c: '민감한 비밀을 수집하는 것은 부적절해요.' }, hint: '값이 변환되는 경계의 전후를 비교하세요.', explanation: '함수 입력과 반환 객체의 name을 비교하면 해당 경계에서 값이 사라지는지 알 수 있어요.' },
        { title: '민감정보 없이 추적', prompt: '실제 사용자 이름 전체 대신 로그에 남길 수 있는 안전한 확인 정보를 한 가지 적어 보세요.', answers: ['name 필드가 존재하는지 여부', '이름 필드의 존재 여부', '마스킹된 값'], hint: '값 전체가 아니라 존재 여부나 유형처럼 필요한 최소 정보만 기록해요.', explanation: '필드 존재 여부만 기록하면 실제 개인정보 노출 없이 변환 여부를 확인할 수 있어요.' },
        { title: '불필요한 비밀 로그 줄', prompt: '가설 확인에 필요하지 않고 개인정보 위험을 만드는 줄을 고르세요.', lines: ['함수 반환 객체에 name 키가 있는지 기록한다.', '오류 발생 여부와 호출 단계를 기록한다.', '테스트 입력에 가짜 이름을 사용한다.', '실제 사용자의 비밀번호와 전체 프로필을 콘솔에 남긴다.'], answerLine: 4, hint: '필요 이상으로 민감한 데이터를 기록하고 있는지 살펴요.', explanation: '4번은 가설 확인에 불필요한 비밀과 개인정보를 노출해요.' },
      ] },
    {
      title: '한 번에 한 조건 검사', objective: '조건 하나만 바꾸는 실험으로 원인 후보를 분리해요.', intro: '입력·설정·브라우저를 한꺼번에 바꾸면 성공했더라도 어느 변화가 영향을 줬는지 알 수 없어요. 동일한 환경에서 의심 조건 한 가지만 바꾸고 결과를 비교합니다.', example: '기준: name="" → 오류\n변경: name="Mina"만 바꿈 → 정상\n관찰: name 조건이 결과와 연관될 가능성', activities: [['기준 사례 고정', '실패 조건과 실행 환경을 유지해요.'], ['한 조건만 변경', '입력값 하나만 바꿔 실행해요.'], ['결과 비교 기록', '두 결과와 차이를 나란히 적어요.']], questions: [
        { title: '변수 하나만 바꾸기', prompt: '입력 이름과 브라우저 설정이 원인 후보입니다. 입력 조건 영향을 먼저 검사하려면 어떻게 해야 하나요?', options: [['a', '브라우저는 유지하고 이름 값만 바꾼다'], ['b', '이름과 브라우저와 앱 코드를 모두 바꾼다'], ['c', '입력은 그대로 두고 결과를 추측한다']], answer: 'a', feedback: { a: '한 조건만 바꾸어 입력의 영향을 분리해요.', b: '여러 변화를 섞으면 원인을 알기 어려워요.', c: '관찰이 없어 가설을 검사할 수 없어요.' }, hint: '의심 조건 하나만 바꾸고 나머지는 고정하세요.', explanation: '같은 브라우저에서 이름 값만 변경해 결과를 비교해야 입력 영향이 분리돼요.' },
        { title: '고정할 나머지 조건', prompt: '한 번에 입력 조건을 비교할 때 바뀌지 않게 유지할 환경 한 가지를 적어 보세요.', answers: ['브라우저', '코드 버전', '실행 환경'], hint: '검사하는 조건 외의 조건은 동일하게 두세요.', explanation: '브라우저나 코드 버전 등 다른 조건을 고정해야 입력 차이를 비교할 수 있어요.' },
        { title: '조건을 섞어 바꾼 줄', prompt: '원인을 구분할 수 없는 실험 기록을 고르세요.', lines: ['동일한 빌드에서 입력 이름만 변경했다.', '두 결과의 오류 여부를 비교했다.', '실행 전후 입력을 기록했다.', '입력, 브라우저, 설정, 코드를 모두 바꿔 한 번 실행했다.'], answerLine: 4, hint: '결과 변화가 어떤 조건과 연결되는지 알 수 있어야 해요.', explanation: '4번은 여러 조건을 동시에 바꿔 어떤 것이 결과에 영향을 줬는지 분리할 수 없어요.' },
      ] },
    {
      title: '수정 전후 가설 검증', objective: '최소 재현을 수정 전 실패·수정 후 성공으로 반복해 회귀 여부를 확인해요.', intro: '가설에 맞춘 변경을 한 뒤에는 처음의 최소 재현 사례를 그대로 다시 실행하세요. 동시에 기존 정상 사례와 관련 회귀 테스트도 확인해 수정이 다른 동작을 깨지 않았는지 살핍니다.', example: '수정 전: 빈 name → 오류\n수정: 빈 값일 때 기본 문구 반환\n수정 후: 빈 name/일반 name 두 사례와 회귀 테스트 실행', activities: [['수정 전 기록 유지', '변경 전 실패 입력과 결과를 보존해요.'], ['수정 후 같은 사례 실행', '입력·환경을 같게 유지해 재검사해요.'], ['회귀 범위 확인', '기존 정상 동작에도 변화가 없는지 확인해요.']], questions: [
        { title: '수정 후 가장 중요한 재검사', prompt: '최소 재현으로 원인을 확인하고 코드를 수정했습니다. 수정 후 우선 할 확인은 무엇인가요?', options: [['a', '같은 최소 재현을 다시 실행하고 관련 정상/경계 테스트도 확인한다'], ['b', '이제 오류가 없을 것이라 추측하고 종료한다'], ['c', '처음 입력을 잊고 전체 코드를 다시 작성한다']], answer: 'a', feedback: { a: '처음 문제 해결과 주변 동작 회귀를 함께 확인해요.', b: '수정 효과를 확인한 근거가 없어요.', c: '불필요한 재작성으로 원인을 흐릴 수 있어요.' }, hint: '처음 실패하던 입력을 같은 조건으로 다시 사용하세요.', explanation: '같은 최소 재현이 해결됐는지와 정상·경계 동작이 유지되는지 확인해야 해요.' },
        { title: '변경 결과 요약', prompt: '수정 결과를 보고할 때 함께 기록할 두 결과를 적어 보세요.', answers: ['최소 재현 결과와 관련 테스트 결과', '실패 입력 재검사와 회귀 테스트', '수정 전후 동작과 테스트 결과'], hint: '원래 실패가 해결됐는지, 기존 동작이 유지되는지 나눠요.', explanation: '최소 실패 입력과 기존 회귀 사례의 결과를 같이 기록하면 변경 영향을 설명할 수 있어요.' },
        { title: '수정만 하고 검증하지 않은 줄', prompt: '가설 수정 흐름에서 완료 근거가 부족한 줄을 고르세요.', lines: ['최소 재현 입력을 보존한다.', '수정 뒤 같은 입력을 다시 실행한다.', '관련 정상/경계 회귀 사례도 검사한다.', '코드를 고쳤으니 검사를 하지 않고 해결 완료로 표시한다.'], answerLine: 4, hint: '수정은 가설의 검증이 아니라 검증할 새 결과를 만드는 단계예요.', explanation: '4번은 수정 후 동일 사례와 회귀 테스트를 확인하지 않아 해결을 증명하지 못해요.' },
      ] },
  ]),
  makeGitWeek(13, '단위 테스트와 경계 사례', '작은 함수의 정상·경계·실패 동작을 명시적인 테스트로 확인합니다.', '단위 테스트는 작은 동작을 입력과 기대 결과로 확인하는 자동 검사예요. 성공 입력만 반복하지 않고 경계와 실패 사례를 포함해 테스트가 증명하는 범위를 정확히 표현합니다. 과정 예제는 Node.js test runner의 일반적인 테스트 개념을 참고하고 실제 서버나 외부 패키지 설치를 요구하지 않습니다.', [
    '테스트는 한 가지 동작을 분명한 입력과 기대 결과로 표현해요.',
    '정상·경계·잘못된 입력을 나누어 다루고 필요한 오류 동작도 확인해요.',
    'assertion은 실제값이 기대 조건과 같은지 검사해요.',
    '버그 재현 테스트는 수정 뒤에도 같은 문제가 다시 생기지 않도록 남겨요.',
  ], [
    {
      title: '단위 테스트의 입력과 기대 결과', objective: '테스트 코드에서 준비·실행·기대값 검증을 찾아요.', intro: '작은 함수 테스트는 구체적인 입력으로 함수를 실행하고 반환값이 예상한 값과 같은지 검사합니다. 테스트 이름도 어떤 동작을 확인하는지 설명해야 해요.', example: 'test("sum adds two values", () => {\n  assert.equal(sum(2, 3), 5);\n});', activities: [['테스트 세 부분 표시', '테스트 이름·입력 실행·assertion을 표시해요.'], ['기대 결과 계산', '입력과 실제 함수 동작에 맞는 반환값을 계산해요.'], ['실패 사례 설명', 'assertion이 실패하면 어떤 차이를 알 수 있는지 적어요.']], questions: [
        { title: 'assertion 역할', prompt: '`assert.equal(sum(2, 3), 5)`가 직접 확인하는 것은 무엇인가요?', options: [['a', '`sum(2, 3)`의 결과가 기대값 5와 같은지'], ['b', '모든 가능한 숫자 입력이 맞는지'], ['c', '프로그램 배포가 성공했는지']], answer: 'a', feedback: { a: '해당 한 입력에서 실제 결과와 기대 결과를 비교해요.', b: '한 사례가 모든 입력을 증명하지는 않아요.', c: '단위 assertion은 배포 상태를 확인하지 않아요.' }, hint: '괄호 안의 실제 표현식과 기대 상수 값을 읽어요.', explanation: '이 assertion은 입력 2와 3의 합 결과가 5인지 확인해요.' },
        { title: '단일 기대값', prompt: '`multiply(4, 3)`의 결과가 12인지 확인할 때 기대 숫자를 적어 보세요.', answers: ['12'], hint: '곱셈 결과를 계산해요.', explanation: '4와 3을 곱한 실제 반환값 12가 기대값 12와 같아요.' },
        { title: '검사 범위를 과장한 줄', prompt: '한 테스트 결과가 증명하는 범위를 넘어선 줄을 고르세요.', lines: ['sum(2, 3)의 결과를 확인했다.', '기대값 5와 실제값을 비교했다.', '실패하면 이 입력에서 동작이 다름을 알 수 있다.', '이 한 사례가 모든 가능한 배열의 정답을 증명한다.'], answerLine: 4, hint: '하나의 입력을 확인했는지 모든 입력 영역을 검사했는지 구분하세요.', explanation: '4번은 한 입력 사례만으로 전체 입력의 정확성을 주장해 테스트 범위를 과장해요.' },
      ] },
    {
      title: '정상·경계 입력 고르기', objective: '요구 동작의 일반 입력과 최소·최대 경계를 분리해 테스트합니다.', intro: '경계 사례는 입력 범위의 가장자리나 빈 상태처럼 실수가 생기기 쉬운 조건이에요. 정상 입력만 확인하면 빈 배열, 길이 1, 한계값의 오류를 놓칠 수 있습니다.', example: '함수: 첫 항목 반환\n정상: ["a", "b"] → "a"\n경계: ["a"] → "a"\n경계: [] → 명시된 빈 결과', activities: [['입력 구간 나누기', '일반·최소·빈 입력을 분류해요.'], ['기대값 계산', '각 경계의 요구 결과를 적어요.'], ['누락 사례 찾기', '현재 테스트 묶음에서 빠진 경계를 찾습니다.']], questions: [
        { title: '빈 배열 경계', prompt: '배열 첫 항목을 다루는 함수에서 빈 배열 오류를 놓치지 않으려면 어떤 사례를 추가해야 하나요?', options: [['a', '빈 배열 `[]`'], ['b', '항상 길이가 10인 배열만'], ['c', '배열이 아닌 관련 없는 화면 색 값']], answer: 'a', feedback: { a: '빈 배열은 첫 항목이 없는 경계 조건이에요.', b: '길이가 고정된 정상 사례만으로 빈 입력을 검사하지 못해요.', c: '함수 입력과 관계없는 값이에요.' }, hint: '요소가 0개인 상태를 직접 테스트해요.', explanation: '`[]`을 넣어 빈 배열에서의 명시된 기대 동작을 검사해야 해요.' },
        { title: '길이 1 사례', prompt: '빈 배열과 여러 원소 사례 사이에서 최소 정상 배열 경계를 확인하려면 배열 길이는 몇이어야 하나요?', answers: ['1', '한 개', '원소 하나'], hint: '첫 항목은 존재하지만 다음 항목은 없는 최소 비어 있지 않은 배열이에요.', explanation: '길이 1인 배열은 첫 원소만 있는 최소 정상 사례예요.' },
        { title: '경계 입력이 빠진 테스트', prompt: '빈 배열 동작이 요구된 함수의 테스트 계획에서 경계 검사를 누락한 줄을 고르세요.', lines: ['길이 3 배열에서 첫 값 확인', '길이 1 배열 결과 확인', '빈 배열에서 정한 기본 결과 확인', '배열이 비어 있을 때는 테스트 대상에서 제외한다.'], answerLine: 4, hint: '요구사항이 빈 상태를 다룬다면 그 입력도 명시해야 해요.', explanation: '4번은 빈 배열이라는 중요한 경계 사례를 검사하지 않아요.' },
      ] },
    {
      title: '잘못된 입력과 오류 기대', objective: '허용되지 않는 입력을 안전하게 거부하는 동작을 테스트해요.', intro: '입력 계약에서 허용 범위를 정했다면 그 밖의 값이 어떻게 처리되는지도 확인해야 해요. 함수가 오류를 던지는지, 오류 값을 반환하는지 계약을 먼저 읽고 일치하는 assertion을 작성합니다.', example: '계약: count는 0 이상의 정수\n정상: 0, 3\n거부: -1, "3"\n오류 형식은 함수 계약에 맞춰 확인', activities: [['계약 허용 범위 표시', '유효·무효 입력 조건을 읽어요.'], ['실패 결과 예상', '잘못된 값에 반환 오류 또는 예외 중 무엇인지 확인해요.'], ['assertion 선택', '계약에 맞는 거부 동작 검사를 정리해요.']], questions: [
        { title: '계약 밖 입력', prompt: '`count`가 0 이상의 정수여야 한다는 계약에서 음수 `-1`은 어떻게 다뤄야 하나요?', options: [['a', '계약에 정한 오류 방식으로 거부한다'], ['b', '정상 입력이라고 가정하고 조용히 성공 처리한다'], ['c', '검사하지 않고 임의 결과를 반환한다']], answer: 'a', feedback: { a: '음수는 허용 범위 밖이므로 명시된 오류 정책을 따라야 해요.', b: '유효 범위 조건을 위반했어요.', c: '기대 동작이 정해지지 않아 결과를 신뢰할 수 없어요.' }, hint: '정수 조건뿐 아니라 0 이상 조건도 만족해야 해요.', explanation: '`-1`은 0 이상 정수가 아니므로 입력 계약에 따라 거부돼야 해요.' },
        { title: '유효 입력 경계', prompt: '0 이상의 정수 중 계약 경계의 가장 작은 유효 값을 적어 보세요.', answers: ['0'], hint: '0 이상에서 가장 작은 정수는 0이에요.', explanation: '0은 0 이상의 정수 조건을 만족하는 최솟값이에요.' },
        { title: '유효 범위를 검사하지 않은 줄', prompt: 'count 계약의 무효 입력 테스트에서 누락된 검사를 고르세요.', lines: ['count가 -1일 때 오류 정책 확인', 'count가 "3"일 때 형식 처리 확인', 'count가 0일 때 정상 결과 확인', '모든 숫자를 유효하다고 보고 음수 입력을 검사하지 않는다.'], answerLine: 4, hint: '음수는 숫자이지만 0 이상 조건을 만족하지 않아요.', explanation: '4번은 숫자 형식만 보고 0 미만 값의 계약 위반을 검사하지 않아요.' },
      ] },
    {
      title: 'assertion 정확도와 테스트 이름', objective: '실제 조건을 좁게 검사하고 테스트 이름을 행동 중심으로 작성해요.', intro: '테스트가 성공해도 assertion이 너무 넓거나 조건이 잘못되면 버그를 찾지 못합니다. 테스트 이름은 어떤 입력과 동작을 확인하는지 보여 주고 assertion은 정확한 기대값을 비교해야 해요.', example: 'test("empty list returns no first item", () => {\n  assert.equal(first([]), undefined);\n});', activities: [['테스트 이름 검토', '무엇이 성공해야 하는지 이름에서 확인해요.'], ['너무 넓은 assertion 찾기', 'truthy 여부만 검사하는 사례를 구체화해요.'], ['정확한 기대값 작성', '요구 결과와 타입까지 맞는 검사를 선택해요.']], questions: [
        { title: '구체적인 assertion', prompt: '`first([])`가 계약상 `undefined`를 반환해야 합니다. 가장 구체적인 검사는 무엇인가요?', options: [['a', '`assert.equal(first([]), undefined)`'], ['b', '`assert.ok(true)`'], ['c', '함수를 호출하지 않는다']], answer: 'a', feedback: { a: '실제 함수 결과를 명시된 기대값과 비교해요.', b: '함수 결과와 무관한 항상 참인 검사예요.', c: '동작을 검사하지 않아요.' }, hint: '실제 호출 결과와 계약 기대값을 직접 비교하세요.', explanation: '호출 결과가 `undefined`인지 직접 검사해야 요구를 확인할 수 있어요.' },
        { title: '행동 중심 테스트 이름', prompt: '`first([])`가 요소 없는 결과를 돌려주는 테스트 이름을 짧게 적어 보세요.', answers: ['빈 배열이면 undefined를 반환한다', '빈 배열에서 첫 항목은 없다', 'empty array returns undefined'], hint: '입력 조건과 기대 동작이 모두 드러나게 이름을 써요.', explanation: '테스트 이름은 빈 배열 조건과 기대 동작을 함께 알려 줘요.' },
        { title: '항상 참인 assertion', prompt: '함수 결과가 잘못돼도 통과할 수 있는 검사를 고르세요.', lines: ['assert.equal(first([]), undefined)', 'assert.equal(first(["a"]), "a")', 'assert.equal(first([]), null)', 'assert.ok(true)'], answerLine: 4, hint: '테스트 대상의 반환값을 사용하지 않는 assertion이 있는지 찾아요.', explanation: '4번은 상수 true만 검사해 함수가 어떤 결과를 내도 통과해요.' },
      ] },
    {
      title: '회귀 테스트와 테스트 범위', objective: '발견한 버그를 재현하는 사례를 남기고 무엇을 증명하는지 설명해요.', intro: '버그를 수정한 뒤 동일한 실패 입력을 테스트로 남기면 이후 변경에서 다시 깨지는 것을 발견할 수 있어요. 관련 정상·경계 사례도 함께 실행하되 테스트 묶음이 모든 가능한 입력을 증명한다고 과장하지 않습니다.', example: '버그: 빈 목록에서 첫 항목 접근 예외\n회귀: first([]) 기대값 확인\n보완: 길이 1, 일반 배열 사례\n범위: 작성한 사례만 확인', activities: [['버그 재현 assertion', '수정 전 실패하던 입력을 테스트에 남겨요.'], ['관련 동작 회귀', '인접 경계와 정상 사례를 추가해요.'], ['검증 범위 보고', '검사한 입력과 미확인 범위를 분리해요.']], questions: [
        { title: '회귀 테스트의 목적', prompt: '버그를 수정한 뒤 원래 실패 입력을 테스트로 남기는 주된 이유는 무엇인가요?', options: [['a', '같은 문제가 다시 생기면 자동으로 발견하도록'], ['b', '모든 가능한 버그가 영원히 사라졌음을 증명하도록'], ['c', '제품 설명을 대신하도록']], answer: 'a', feedback: { a: '회귀 테스트는 이미 발견한 동작이 다시 깨지는지 확인해요.', b: '유한한 사례가 모든 미래 버그를 증명하지는 않아요.', c: '테스트는 제품 안내 문서가 아니에요.' }, hint: '수정 전 실패하던 조건을 다음 변경에서도 확인하는 목적이에요.', explanation: '회귀 테스트는 고친 버그가 이후 변경으로 다시 나타날 때 감지하게 해요.' },
        { title: '테스트 범위 보고', prompt: '빈 배열·길이 1 배열 두 사례만 검사했다면 완료 보고에 범위를 어떻게 표현해야 하나요?', answers: ['빈 배열과 길이 1 사례를 확인했다', '작성한 두 사례만 통과했다', '검사한 입력 사례를 명시한다'], hint: '실제로 실행한 사례만 정확히 나열해요.', explanation: '두 입력 사례를 검사했다고 쓰고 모든 가능한 입력을 보장한다고 주장하지 않아요.' },
        { title: '사례 두 개로 전체를 보장한 줄', prompt: '테스트 결과를 과장하는 줄을 고르세요.', lines: ['빈 배열 사례가 통과했다.', '길이 1 사례가 통과했다.', '두 경계 사례에서 지정 결과를 확인했다.', '두 사례가 통과했으므로 모든 배열 입력에서 오류가 없다고 보장한다.'], answerLine: 4, hint: '검사한 표본 수와 입력 전체 범위를 비교해요.', explanation: '4번은 일부 사례 결과를 모든 배열 입력의 보장으로 확대해 말해요.' },
      ] },
  ]),
];
