import { choice, locateError, outputTrace as baseOutputTrace, repairCode, shortAnswer as baseShortAnswer, studySession } from './curriculum-tools.js';

// CQ-2 reviewed content for browser persistence and asynchronous request lessons.
// Browser-specific cases use explicit in-memory inputs; no real site storage or network is accessed.
const wrapCodePrompt = (prompt) => {
  const divider = prompt.lastIndexOf('\n\n');
  if (divider < 0) return prompt;
  const fence = String.fromCharCode(96);
  const code = prompt.slice(divider + 2);
  return prompt.slice(0, divider + 2) + fence + code + fence;
};
const shortAnswer = (id, title, prompt, acceptedAnswers, hint, explanation) => baseShortAnswer(id, title, wrapCodePrompt(prompt), acceptedAnswers, hint, explanation);
const outputTrace = (id, title, prompt, acceptedAnswers, hint, explanation) => baseOutputTrace(id, title, wrapCodePrompt(prompt), acceptedAnswers, hint, explanation);

export const javascriptReviewedWeeks22To24 = {
  22: {
    objective: '문자열 저장, 손상·구버전 자료 복구, 저장 실패와 다른 탭 변경을 구분해 브라우저 진도를 안전하게 다룹니다.',
    intro: 'localStorage는 문자열을 저장하며 사용 가능 여부나 용량을 보장하지 않습니다. 일반 예제는 저장 동작을 재현하는 메모리 모형으로 실행합니다. 마지막 날의 이벤트 입력도 다른 탭 이벤트의 모양을 흉내 낸 값이며 실제 브라우저 간 통신을 실행하지 않습니다.',
    points: ['진도는 완료한 과정 ID의 배열로 관리하고 JSON.stringify로 문자열화해 저장합니다.', 'JSON 파싱에 성공해도 자료 모양이 맞는지 확인합니다. 기록 없음·손상된 자료·지원하는 옛 버전·알 수 없는 버전을 각각 처리합니다.', '저장 호출은 보안 설정이나 할당량 때문에 실패할 수 있으므로 성공을 단정하지 않습니다.', 'localStorage의 storage 이벤트는 같은 출처의 다른 창에서 바뀔 때 전달되고 변경한 창에는 전달되지 않습니다.'],
    overviewExample: 'function saveProgress(storage, value) {\n  try {\n    storage.setItem(\"progress\", JSON.stringify(value));\n    return true;\n  } catch {\n    return false;\n  }\n}\nconst values = new Map();\nconst storage = { setItem(key, value) { values.set(key, String(value)); }, getItem(key) { return values.get(key) ?? null; } };\nconsole.log(saveProgress(storage, { done: [\"js\"] }), storage.getItem(\"progress\")); // true {\"done\":[\"js\"]}',
    sessions: [
      studySession(1, '1일차 · 문자열 저장과 왕복', '저장소 API의 문자열 경계에서 객체를 직렬화하고 읽을 때 다시 파싱합니다.', '예제의 storage는 Node에서도 동작하도록 만든 메모리 모형입니다. 실제 localStorage API를 실행한 것은 아닙니다. 값이 저장소 안팎에서 어떤 타입인지 비교하세요.', 'function save(storage, key, value) {\n  storage.setItem(key, JSON.stringify(value));\n}\nconst values = new Map();\nconst storage = { setItem(key, value) { values.set(key, String(value)); }, getItem(key) { return values.get(key) ?? null; } };\nsave(storage, \"progress\", { done: [\"js\"] });\nconsole.log(storage.getItem(\"progress\")); // {\"done\":[\"js\"]}', [
        choice('js-w22-d1-string-boundary-v2', '객체 저장 전 변환', 'setItem이 저장하는 값은 문자열입니다. { done: [\"js\"] }를 나중에 다시 객체로 복원할 수 있게 저장하려면 어떤 값을 넘겨야 하나요?', [
          ['JSON.stringify({ done: [\"js\"] })', '객체를 JSON 문자열로 바꾸므로 다시 JSON.parse할 수 있습니다.'],
          ['객체를 그대로 전달한다', '문자열 변환 과정에서 일반 객체는 보통 [object Object]가 되어 필드 구조를 잃습니다.'],
          ['JSON.parse({ done: 2 })', 'JSON.parse는 JSON 문자열을 읽는 함수이며 객체를 저장용 문자열로 만들지 않습니다.'],
        ], 0, '저장소에 넣기 직전의 값이 문자열인지 확인하세요.', '저장소는 문자열 경계입니다. 객체를 그대로 넘기지 말고 JSON.stringify 결과를 저장해야 구조를 복원할 수 있습니다.'),
        outputTrace('js-w22-d1-string-type-v2', '직렬화 결과 타입 추적', '다음 코드가 출력하는 값을 적으세요.\n\nconst raw = JSON.stringify({ done: 2 });\nconsole.log(typeof raw);', ['string'], 'JSON.stringify의 결과와 원래 입력 객체의 타입을 비교하세요.', 'JSON.stringify는 JSON 표현을 담은 문자열을 반환합니다. 따라서 typeof raw는 string입니다.'),
        locateError('js-w22-d1-object-v2', '객체를 그대로 넘긴 줄 찾기', '저장 후 JSON.parse로 객체를 복원할 수 있어야 합니다. 문자열 변환을 빠뜨린 줄을 고르세요.', 'JavaScript', ['function saveProgress(storage, progress) {', '  storage.setItem(\"progress\", progress);', '}', 'const result = saveProgress(storage, { done: [\"js\"] });'], [2], 'setItem 두 번째 인수에 직렬화 결과가 전달되는지 확인하세요.', '2번 줄은 객체를 그대로 넘깁니다. JSON.stringify(progress)를 저장해야 JSON.parse로 객체를 복원할 수 있습니다.'),
      ]),
      studySession(2, '2일차 · 없는 값과 손상된 JSON', '키가 없거나 JSON 문법 또는 진도 자료 모양이 맞지 않을 때 안전한 기본값을 반환합니다.', 'getItem은 키가 없으면 null을 반환하고, 잘못된 JSON 문자열은 JSON.parse에서 SyntaxError를 냅니다. JSON 문법에 맞는 \"null\"도 읽은 뒤 자료 모양을 확인해야 합니다. 모든 실패 경로에서 같은 배열 구조의 기본값을 돌려주는지 살펴보세요.', 'function readProgress(raw) {\n  if (raw === null) return { done: [] };\n  try {\n    const saved = JSON.parse(raw);\n    if (saved === null || typeof saved !== \"object\" || !Array.isArray(saved.done) || !saved.done.every((id) => typeof id === \"string\")) {\n      return { done: [] };\n    }\n    return saved;\n  } catch {\n    return { done: [] };\n  }\n}\nconsole.log(readProgress(\"{\").done.length, readProgress(\"{\\\"done\\\":[\\\"js\\\",\\\"py\\\"]}\").done.length); // 0 2', [
        choice('js-w22-d2-corrupt-json-v2', '저장 기록 읽기', 'JSON 파싱 오류와 자료 모양 오류를 모두 화면에서 안전하게 처리하려면?', [
          ['파싱을 재시도해 언젠가 객체로 만든다', '입력 자체가 유효하지 않으면 반복 호출로 문법 오류가 해결되지 않습니다.'],
          ['JSON.parse를 try/catch로 감싸고, 파싱 뒤에도 필요한 배열 구조인지 확인한다', '문법 오류뿐 아니라 \"null\"이나 잘못된 필드 모양도 감지해 화면이 기대하는 자료만 사용합니다.'],
          ['문자열을 검사하지 않고 점 표기법으로 읽는다', '문자열에는 객체 필드가 없으므로 원하는 값이 나오지 않습니다.'],
        ], 1, '문법 오류와 JSON.parse가 반환한 값의 모양 오류를 따로 생각하세요.', '문법 오류는 catch에서, 문법에 맞지만 진도 배열이 없는 자료는 구조 검사에서 걸러 같은 기본값으로 복구합니다.'),
        outputTrace('js-w22-d2-parse-value-v2', 'JSON 문자열 파싱 추적', '다음 코드가 출력하는 값을 적으세요.\n\nconst saved = JSON.parse(\"{\\\"mode\\\":\\\"dark\\\"}\");\nconsole.log(saved.mode);', ['dark'], '바깥 문자열의 이스케이프가 제거된 뒤 파싱되는 JSON 필드를 확인하세요.', 'JSON 문자열에는 mode가 dark로 들어 있습니다. 파싱한 객체의 saved.mode는 dark입니다.'),
        locateError('js-w22-d2-uncaught-parse-v2', '복구 경계가 빠진 줄', '손상된 JSON 문자열을 읽어도 화면을 중단시키지 않고 완료 목록 배열을 돌려야 합니다. 누락된 처리가 있는 줄을 고르세요.', 'JavaScript', ['function readProgress(raw) {', '  if (raw === null) return { done: [] };', '  return JSON.parse(raw);', '}', 'readProgress(\"{\");'], [3], '파싱 실패와 파싱 성공 뒤 잘못된 자료 모양을 모두 다루는지 확인하세요.', '3번 줄은 잘못된 JSON에서 SyntaxError를 내고, \"null\"처럼 유효하지만 진도 객체가 아닌 값도 그대로 반환합니다. 파싱과 자료 모양을 확인한 뒤 기본값을 반환해야 합니다.'),
      ]),
      studySession(3, '3일차 · 저장 형식 마이그레이션', '저장 자료의 모양과 버전을 확인해 정상적인 구버전만 변환하고 지원하지 않는 자료는 거부합니다.', '이전 버전은 완료한 과정 ID를 done 배열에, 현재 버전은 completed 배열에 담는다고 가정합니다. JSON 파싱 결과가 null·숫자·배열일 수 있고 배열 안에도 문자열이 아닌 값이 들어올 수 있으므로, 필드 이름뿐 아니라 자료 모양도 확인하세요.', 'function migrate(saved) {\n  if (saved === null || typeof saved !== \"object\" || Array.isArray(saved)) {\n    throw new Error(\"Invalid progress data\");\n  }\n  if (saved.version === 1 && Array.isArray(saved.done) && saved.done.every((id) => typeof id === \"string\")) {\n    return { version: 2, completed: saved.done };\n  }\n  if (saved.version === 2 && Array.isArray(saved.completed) && saved.completed.every((id) => typeof id === \"string\")) {\n    return saved;\n  }\n  throw new Error(\"Unsupported progress version or shape\");\n}\nconsole.log(migrate({ version: 1, done: [\"js\"] }).completed.join(\",\")); // js', [
        choice('js-w22-d3-migration-v2', '옛 저장 구조 변환', 'version 1에는 done이 있고 version 2에는 completed가 있을 때 안전한 읽기 전략은?', [
          ['모든 버전에서 completed가 있다고 가정한다', 'version 1에는 해당 필드가 없어 곧바로 읽으면 데이터를 잃거나 오류가 납니다.'],
          ['버전 필드를 무시하고 저장 자료를 덮어쓴다', '저장 형식이 달라진 경우 어떤 변환이 필요한지 판별할 수 없습니다.'],
          ['버전 1은 done을 completed로 옮기고, 지원하지 않는 버전은 명시적으로 거부한다', '알고 있는 옛 구조만 의도적으로 마이그레이션하고 모르는 형식을 조용히 오해하지 않습니다.'],
        ], 2, '필드 이름뿐 아니라 저장값 자체가 객체인지, ID 목록이 문자열 배열인지 확인하세요.', '버전만 확인해서는 잘못된 값을 안전하게 읽을 수 없습니다. 올바른 구버전만 변환하고, 알 수 없는 버전이나 필드 모양은 오류로 알려 덮어쓰지 않습니다.'),
        outputTrace('js-w22-d3-migration-trace-v2', '마이그레이션 결과 추적', '다음 코드가 출력하는 값을 적으세요.\n\nfunction migrate(saved) {\n  return { version: 2, completed: saved.done ?? [] };\n}\nconsole.log(migrate({ version: 1, done: [\"js\"] }).completed.length);', ['1'], 'done 배열의 원소 개수를 변환된 completed에서 확인하세요.', '마이그레이션은 기존 done 배열 한 항목을 completed로 옮깁니다. 출력되는 길이는 1입니다.'),
        locateError('js-w22-d3-version-field-v2', '버전 1 필드 접근 오류', 'version 1 자료를 version 2 형태로 바꿔야 합니다. 변환 전에 존재하지 않는 필드를 읽는 줄을 고르세요.', 'JavaScript', ['function migrate(saved) {', '  if (saved.version === 1) {', '    return saved.completed.map((item) => item);', '  }', '  return saved;', '}'], [3], '문제에 제시된 version 1 자료에 completed가 실제로 있는지 확인하세요.', '3번 줄은 version 1에 없는 completed를 읽습니다. saved.done을 현재 필드로 옮기거나 안전한 빈 배열을 제공해야 합니다.'),
      ]),
      studySession(4, '4일차 · 저장 실패와 호출자 알림', '저장소 접근 예외를 잡고 성공과 실패를 구분한 결과를 호출자에게 돌려줍니다.', '저장 공간은 브라우저 설정이나 할당량 때문에 쓸 수 없을 수 있습니다. 이 예제의 저장 객체는 할당량 예외를 던지는 모형이고 실제 브라우저 저장 공간의 크기를 측정하지 않습니다.', 'function saveProgress(storage, key, progress) {\n  try {\n    storage.setItem(key, JSON.stringify(progress));\n    return true;\n  } catch {\n    return false;\n  }\n}\nconst fullStorage = { setItem() { throw new Error(\"quota\"); } };\nconsole.log(saveProgress(fullStorage, \"progress\", { done: [\"js\"] })); // false', [
        choice('js-w22-d4-storage-failure-v2', '저장 오류 처리 정책', 'setItem이 quota 또는 접근 예외를 던졌을 때 학습 진도 화면이 취할 동작으로 알맞은 것은?', [
          ['예외를 처리해 저장 실패를 반환하고 기존 기록을 조용히 지우지 않는다', '실패를 호출자에게 알려 사용자가 현재 진도를 잃었다고 오해하지 않게 합니다.'],
          ['예외를 무시한 뒤 저장에 성공했다고 표시한다', '실제로 쓰지 못한 값을 저장된 기록처럼 보여 사용자를 오도합니다.'],
          ['실패할 때마다 다른 키를 무한히 만들어 재시도한다', '할당량 또는 접근 제한을 해결하지 못하고 저장 공간 문제를 키웁니다.'],
        ], 0, '오류를 숨기지 말고 함수 결과가 성공 여부를 표현하는지 확인하세요.', '저장이 실패했는데 성공 표시를 하면 안 됩니다. 예외를 안전하게 처리해 실패를 알리고 사용자가 원래 데이터를 유지하도록 해야 합니다.'),
        locateError('js-w22-d4-false-success-v2', '실패를 성공으로 보고하는 경로', '저장 호출이 예외를 던졌을 때 false를 반환해야 합니다. 성공으로 잘못 보고하는 줄을 고르세요.', 'JavaScript', ['function save(storage, key, value) {', '  try {', '    storage.setItem(key, JSON.stringify(value));', '    return true;', '  } catch {', '    return true;', '  }', '}'], [6], '저장 예외를 받은 catch 분기가 어떤 값을 호출자에게 반환하는지 확인하세요.', '6번 줄은 저장 호출이 실패했는데도 true를 반환합니다. catch에서는 false를 반환해야 화면이 저장 실패를 올바르게 표시할 수 있습니다.'),
        repairCode({
          id: 'js-w22-d4-save-progress-v2', title: '저장 실패를 반환하는 함수', prompt: '아래 saveProgress를 고치세요. JSON 문자열로 저장한 뒤 true를 반환하고, 저장 호출이 예외를 던지면 false를 반환합니다. 평가는 코드를 실행하지 않고 전체 함수 구조를 검사합니다.',
          language: 'JavaScript', starterCode: 'function saveProgress(storage, key, progress) {\n  storage.setItem(key, progress);\n  return true;\n}',
          solutionPatterns: ['^\\s*function\\s+saveProgress\\s*\\(\\s*storage\\s*,\\s*key\\s*,\\s*progress\\s*\\)\\s*\\{\\s*try\\s*\\{\\s*storage\\.setItem\\(key\\s*,\\s*JSON\\.stringify\\(progress\\)\\)\\s*;?\\s*return\\s+true\\s*;?\\s*\\}\\s*catch\\s*\\{\\s*return\\s+false\\s*;?\\s*\\}\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['저장 값은 JSON 문자열이고 성공은 true, 저장 예외는 false로 반환한다.'], constraints: ['storage, key, progress 매개변수와 함수 이름을 유지한다.', '실패 시 저장 성공이라고 보고하지 않는다.'], examples: [{ input: '성공하는 storage, key, { done: [\"js\"] }', output: 'true 및 완료 ID 배열을 담은 JSON 문자열 저장' }], tests: [{ input: 'setItem이 quota 오류를 던지는 storage', expected: 'false' }] },
          gradingNote: '실행이 아닌 전체 함수 정규식 평가입니다. 아래 acceptance 사례 설명은 검토 기준이며 앱 안에서 예외 객체를 실제 주입해 채점하지 않습니다.',
          hint: '직렬화된 값으로 setItem을 호출하고, try 안의 성공 반환과 catch 안의 실패 반환을 분리하세요.',
          explanation: '성공 반환은 저장 호출이 끝난 뒤에만 도달합니다. 할당량·접근 예외는 catch에서 false로 바뀌므로 UI가 저장 실패를 알릴 수 있습니다.',
        }),
      ]),
      studySession(5, '5일차 · 다른 탭 변경 반영', 'storage 이벤트의 출처, 키 삭제, 저장소 전체 비우기와 손상된 기록을 처리합니다.', 'storage 이벤트는 localStorage를 바꾼 현재 창이 아니라 같은 출처의 다른 문서에서 발생합니다. 특정 키를 지우면 newValue가 null이고, localStorage.clear()로 모두 지우면 key도 null입니다. 여기서는 이벤트 모양의 입력을 함수에 전달하며 실제 탭 간 이벤트는 발생시키지 않습니다.', 'function progressFromStorageEvent(event) {\n  if (event.key !== \"progress\" && event.key !== null) return null;\n  if (event.newValue === null) return { done: [] };\n  try {\n    const progress = JSON.parse(event.newValue);\n    if (progress === null || typeof progress !== \"object\" || !Array.isArray(progress.done) || !progress.done.every((id) => typeof id === \"string\")) {\n      return { done: [] };\n    }\n    return progress;\n  } catch {\n    return { done: [] };\n  }\n}\nconst changed = progressFromStorageEvent({ key: \"progress\", newValue: \"{\\\"done\\\":[\\\"js\\\"]}\" });\nconst removed = progressFromStorageEvent({ key: \"progress\", newValue: null });\nconst cleared = progressFromStorageEvent({ key: null, newValue: null });\nconst malformed = progressFromStorageEvent({ key: \"progress\", newValue: \"{\" });\nconsole.log(changed.done.length, removed.done.length, cleared.done.length, malformed.done.length); // 1 0 0 0', [
        choice('js-w22-d5-storage-event-v2', 'storage 이벤트 수신 범위', '현재 탭이 localStorage.setItem을 호출했을 때 그 변경을 알리는 storage 이벤트는 어디에서 발생하나요?', [
          ['변경을 쓴 현재 창에만 발생한다', 'localStorage 변경을 쓴 창에서는 storage 이벤트가 발생하지 않습니다.'],
          ['같은 출처의 다른 창에서 발생한다', 'localStorage의 storage 이벤트는 공유 저장 공간을 보는 같은 출처의 다른 browsing context에 전달됩니다.'],
          ['모든 출처의 모든 탭에서 발생한다', '웹 출처 경계가 다른 문서는 해당 localStorage를 공유하지 않습니다.'],
        ], 1, '이벤트를 발생시킨 문서와 변경 사항을 받아야 할 문서를 구분하세요.', '같은 출처에서 다른 탭이 쓴 localStorage 변경은 현재 탭의 storage 이벤트로 전달됩니다. 쓰기를 한 현재 창에서는 이벤트가 발생하지 않습니다.'),
        locateError('js-w22-d5-remove-event-v2', '삭제 결과 처리 누락', '키가 다른 탭에서 삭제되면 화면은 빈 진도로 복원해야 합니다. 삭제 입력을 무조건 객체처럼 다루는 줄을 고르세요.', 'JavaScript', ['function update(event, render) {', '  if (event.key !== \"progress\") return;', '  const progress = JSON.parse(event.newValue);', '  render(progress.done);', '}'], [3], '키 삭제 이벤트에서는 event.newValue가 문자열이 아니라 null일 수 있습니다.', '3번 줄은 null에 JSON.parse를 적용해 null을 얻은 뒤 progress.done을 읽는 경로를 만듭니다. newValue가 null이면 빈 진도 객체를 만들고, 그 외에만 JSON을 파싱해야 합니다.'),
        repairCode({
          id: 'js-w22-d5-storage-event-repair-v2', title: '변경 이벤트의 진도 안전하게 읽기', prompt: '아래 progressFromStorageEvent를 고치세요. key가 progress도 null도 아니면 null을 반환합니다. key가 progress인데 삭제됐거나, 저장소 전체가 비워졌거나, JSON이 잘못됐거나, done이 문자열 배열이 아니면 { done: [] }을 반환합니다. 올바른 객체는 파싱해 반환합니다. 정적 패턴 채점입니다.',
          language: 'JavaScript', starterCode: 'function progressFromStorageEvent(event) {\n  return JSON.parse(event.newValue);\n}',
          solutionPatterns: ['^\\s*function\\s+progressFromStorageEvent\\s*\\(\\s*event\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*event\\.key\\s*!==\\s*\"progress\"\\s*&&\\s*event\\.key\\s*!==\\s*null\\s*\\)\\s*return\\s+null\\s*;?\\s*if\\s*\\(\\s*event\\.newValue\\s*===\\s*null\\s*\\)\\s*return\\s*\\{\\s*done\\s*:\\s*\\[\\s*\\]\\s*\\}\\s*;?\\s*try\\s*\\{\\s*const\\s+progress\\s*=\\s*JSON\\.parse\\(event\\.newValue\\)\\s*;\\s*if\\s*\\(\\s*progress\\s*===\\s*null\\s*\\|\\|\\s*typeof\\s+progress\\s*!==\\s*\"object\"\\s*\\|\\|\\s*!Array\\.isArray\\(progress\\.done\\)\\s*\\|\\|\\s*!progress\\.done\\.every\\(\\(id\\)\\s*=>\\s*typeof\\s+id\\s*===\\s*\"string\"\\)\\s*\\)\\s*return\\s*\\{\\s*done\\s*:\\s*\\[\\s*\\]\\s*\\}\\s*;?\\s*return\\s+progress\\s*;?\\s*\\}\\s*catch\\s*\\{\\s*return\\s*\\{\\s*done\\s*:\\s*\\[\\s*\\]\\s*\\}\\s*;?\\s*\\}\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['다른 키의 저장 변경은 이 화면에서 무시한다.', '특정 키 삭제와 저장소 전체 비우기는 빈 done 배열로 복구한다.', 'JSON 오류나 잘못된 자료 모양도 빈 배열로 복구하고 완료 ID 문자열 배열은 읽는다.'], constraints: ['이벤트 값을 변경하지 않는다.', '문자열 \"null\"과 실제 null을 같은 값으로 취급하지 않는다.'], examples: [{ input: '{ key: null, newValue: null }', output: '{ done: [] }' }], tests: [{ input: '{ key: \"other\", newValue: \"{}\" }', expected: 'null' }, { input: '{ key: \"progress\", newValue: \"JSON object string with done IDs\" }', expected: 'done array restored' }, { input: '{ key: \"progress\", newValue: \"{\" }', expected: '{ done: [] }' }, { input: '{ key: \"progress\", newValue: \"null\" }', expected: '{ done: [] }' }] },
          gradingNote: '코드를 실행하지 않는 정적 구조 검사이며 브라우저의 탭 간 storage 이벤트를 실제 발생시켜 평가하지 않습니다.',
          hint: '다른 키는 무시하되 key가 null인 전체 삭제도 처리하고, JSON 파싱 뒤 done이 문자열 배열인지 검사하세요.',
          explanation: '다른 키는 무시하지만 key가 null인 storage.clear() 이벤트는 현재 저장소 전체가 비워졌다는 뜻입니다. 삭제·손상 데이터·잘못된 모양은 모두 빈 목록으로 복구하고 정상 목록만 화면에 전달합니다.',
        }),
      ]),
    ],
  },
  23: {
    objective: 'Fetch의 HTTP 상태, 유효한 빈 응답, 네트워크 실패, JSON 파싱과 로딩 상태를 따로 처리합니다.',
    intro: 'Fetch는 HTTP 404/500 응답만으로 Promise를 reject하지 않으므로 response.ok를 확인해야 합니다. 예제는 고정된 가짜 fetch/Response 객체만 사용하며 실제 네트워크 요청을 보내지 않습니다.',
    points: ['HTTP 실패 응답도 Response로 도착하므로 response.ok 또는 status를 확인합니다.', 'HTTP 성공 뒤 빈 배열은 정상 결과일 수 있어 오류와 빈 상태를 별도 표시합니다.', '네트워크 실패와 응답 JSON 파싱 실패는 Promise rejection 경로입니다.', 'finally는 성공·실패 모두에서 실행되어 로딩 표시를 정리합니다.'],
    overviewExample: 'async function readCourses(fetcher) {\n  const response = await fetcher(\"/courses\");\n  if (!response.ok) throw new Error(\"HTTP \" + response.status);\n  return await response.json();\n}\nreadCourses(async () => ({ ok: true, json: async () => [] }))\n  .then((courses) => console.log(courses.length)); // 0: 성공한 빈 결과',
    sessions: [
      studySession(1, '1일차 · HTTP 상태 확인', 'Fetch 응답을 받았더라도 HTTP 성공 상태인지 response.ok로 검사합니다.', '가짜 응답 객체를 사용해 실행 결과를 고정합니다. fetch가 404 응답에서 보통 reject하지 않는다는 점과, response.ok가 상태 코드를 표현하는 점을 연결하세요.', 'function statusLabel(response) {\n  return response.ok ? \"success\" : \"HTTP \" + response.status;\n}\nconsole.log(statusLabel({ ok: false, status: 404 })); // HTTP 404', [
        choice('js-w23-d1-http-ok-v2', '404 응답 검사', 'fetch가 404 상태 Response를 반환했습니다. 실패를 구분하는 데 확인할 값은?', [
          ['response.json 함수가 있는지 여부', '본문 파싱 함수를 사용할 수 있어도 HTTP 상태가 성공이라는 뜻은 아닙니다.'],
          ['response.ok', 'ok는 응답 상태가 성공 범위인지 나타내므로 HTTP 오류를 별도로 처리할 수 있습니다.'],
          ['response.url의 문자열 길이', 'URL 길이는 상태 코드의 성공 여부와 관계가 없습니다.'],
        ], 1, '본문의 모양을 보기 전에 Response의 HTTP 상태를 확인하세요.', 'Fetch는 404 같은 HTTP 오류 응답도 Response로 돌려줄 수 있습니다. response.ok를 확인해 성공과 HTTP 실패를 분기해야 합니다.'),
        outputTrace('js-w23-d1-http-trace-v2', 'HTTP 실패 상태 추적', '다음 코드의 출력 문자열을 적으세요.\n\nfunction statusLabel(response) {\n  return response.ok ? \"success\" : \"HTTP \" + response.status;\n}\nconsole.log(statusLabel({ ok: false, status: 404 }));', ['HTTP 404'], 'ok가 false일 때 선택되는 문자열을 확인하세요.', 'ok가 false이므로 실패 경로가 선택되고 status 404가 이어져 HTTP 404가 됩니다.'),
        locateError('js-w23-d1-missing-ok-v2', '상태 검사 없이 성공하는 줄', 'HTTP 실패 응답이면 오류로 처리해야 합니다. 이 요구를 만족하지 못하는 줄을 고르세요.', 'JavaScript', ['async function readCourses(fetcher) {', '  const response = await fetcher(\"/courses\");', '  return response.json();', '}'], [3], '응답 본문 파싱이 HTTP 상태까지 검사하는지 확인하세요.', '3번 줄은 404 Response여도 본문 파싱을 진행합니다. response.ok를 확인하고 실패 상태를 먼저 처리해야 합니다.'),
      ]),
      studySession(2, '2일차 · 성공한 빈 목록 표시', '성공한 빈 배열과 요청 실패를 구분해 빈 상태와 오류 상태를 따로 표현합니다.', 'HTTP 200 응답의 JSON이 []이면 불러오기는 성공했지만 표시할 항목이 없는 상태입니다. 빈 결과를 네트워크 오류로 바꾸지 말고 화면 상태로 나누세요.', 'function listState(courses) {\n  return courses.length === 0 ? \"empty\" : \"items\";\n}\nconsole.log(listState([]), listState([\"JavaScript\"])); // empty items', [
        choice('js-w23-d2-empty-success-v2', '빈 결과와 오류 구분', 'HTTP 성공 응답에서 courses가 []라면 화면 상태를 어떻게 표현하는 것이 정확한가요?', [
          ['요청 실패 상태로 기록한다', '빈 배열이 정상 JSON으로 도착했다면 요청 자체는 성공한 것입니다.'],
          ['목록이 없다는 안내를 표시한다', '성공한 빈 목록은 오류와 구별되는 정상적인 빈 상태입니다.'],
          ['목록에 임의의 기본 항목을 넣는다', '서버가 보내지 않은 데이터를 만들어 실제 응답을 왜곡합니다.'],
        ], 1, '요청의 성공 여부와 응답 목록의 길이는 서로 다른 상태입니다.', '성공 여부는 HTTP 응답으로 판정하고, 배열이 비어 있는지는 별도 빈 상태로 표시합니다.'),
        outputTrace('js-w23-d2-empty-trace-v2', '빈 배열 화면 상태 추적', '다음 코드의 출력값을 적으세요.\n\nfunction listState(courses) {\n  return courses.length === 0 ? \"empty\" : \"items\";\n}\nconsole.log(listState([]));', ['empty'], '배열 길이가 0일 때 삼항식의 어느 갈래가 선택되는지 보세요.', '빈 배열은 length가 0이므로 listState는 empty를 반환합니다. 이 결과만으로 요청 실패라고 뜻하지는 않습니다.'),
        locateError('js-w23-d2-empty-as-error-v2', '정상 빈 응답을 오류로 바꾸는 줄', '정상적인 빈 목록에는 빈 상태 안내를 보여야 합니다. 이를 오류와 혼동하는 줄을 고르세요.', 'JavaScript', ['function showState(courses) {', '  if (courses.length === 0) throw new Error(\"request failed\");', '  return courses;', '}'], [2], '배열이 비었다는 사실과 fetch 자체가 reject됐다는 사실을 구분하세요.', '2번 줄은 유효한 빈 응답도 요청 실패로 바꿉니다. 빈 목록은 오류가 아니라 별도 empty UI 상태로 표현해야 합니다.'),
      ]),
      studySession(3, '3일차 · 네트워크 거절과 본문 오류', '네트워크 Promise rejection과 HTTP Response 및 JSON 본문 파싱 오류를 각각 구분합니다.', '연결 실패는 Response 없이 Promise가 reject되고, 503은 HTTP 오류 Response로 도착하며, 성공 응답의 잘못된 JSON은 본문을 읽을 때 실패합니다. 오류 객체마다 같은 속성이 있다고 가정하지 마세요.', 'async function requestLabel(fetcher) {\n  try {\n    const response = await fetcher(\"/courses\");\n    if (!response.ok) return \"HTTP \" + response.status;\n    try {\n      await response.json();\n      return \"body parsed\";\n    } catch {\n      return \"JSON parse failed\";\n    }\n  } catch {\n    return \"network rejected\";\n  }\n}\nconst results = Promise.all([\n  requestLabel(() => Promise.reject(new TypeError(\"offline\"))),\n  requestLabel(async () => ({ ok: false, status: 503 })),\n  requestLabel(async () => ({ ok: true, json: async () => { throw new SyntaxError(\"invalid JSON\"); } })),\n]);\nresults.then((labels) => console.log(labels.join(\", \"))); // network rejected, HTTP 503, JSON parse failed', [
        choice('js-w23-d3-fetch-rejection-v2', '네트워크 실패 경로', 'fetch 요청이 네트워크 문제로 reject됐을 때 Promise를 처리하는 곳은?', [
          ['catch 또는 try/catch', 'reject된 Promise는 await 중 예외로 이어져 catch에서 처리할 수 있습니다.'],
          ['response.ok를 읽는 성공 다음 줄만', 'reject가 나면 Response 값이 만들어지지 않아 해당 분기에 진입하지 않습니다.'],
          ['finally에서만 오류 내용을 만든다', 'finally는 정리 구간이지 실패 이유를 성공 응답처럼 판정하는 구간이 아닙니다.'],
        ], 0, '실패했을 때 Response가 이미 만들어져 있는지 먼저 구분하세요.', '연결 실패는 fetch Promise가 reject되어 Response를 받을 수 없습니다. 이 경로는 catch에서 처리해야 합니다.'),
        outputTrace('js-w23-d3-network-trace-v3', '네트워크·HTTP·본문 실패 결과', '다음 세 요청이 각각 어떤 결과 문자열을 만드는지 순서대로 적으세요.\n\nasync function requestLabel(fetcher) {\n  try {\n    const response = await fetcher(\"/courses\");\n    if (!response.ok) return \"HTTP \" + response.status;\n    try {\n      await response.json();\n      return \"body parsed\";\n    } catch {\n      return \"JSON parse failed\";\n    }\n  } catch {\n    return \"network rejected\";\n  }\n}\nconst results = Promise.all([\n  requestLabel(() => Promise.reject(new TypeError(\"offline\"))),\n  requestLabel(async () => ({ ok: false, status: 503 })),\n  requestLabel(async () => ({ ok: true, json: async () => { throw new SyntaxError(\"invalid JSON\"); } })),\n]);\nresults.then((labels) => console.log(labels.join(\", \")));', ['network rejected, HTTP 503, JSON parse failed'], 'fetch 실패, HTTP 상태가 실패인 응답, JSON 본문 파싱 실패를 각각 어느 처리 경로가 받는지 확인하세요.', 'fetch 거절은 바깥 catch, 503은 response.ok 분기, JSON 파싱 거절은 안쪽 catch에서 처리합니다. 출력은 network rejected, HTTP 503, JSON parse failed입니다.'),
        locateError('js-w23-d3-json-rejection-v2', '잘못된 JSON 본문 rejection 누락', '응답 상태가 성공이어도 본문 JSON이 손상되면 json()이 reject될 수 있습니다. 호출부에서 그 실패를 전달하지 못하는 줄을 고르세요.', 'JavaScript', ['async function loadData(response, render) {', '  const data = await response.json();', '  render(data);', '}', 'loadData(response, render);'], [5], 'response.json()은 본문 문법이 잘못되면 거절된 Promise를 만들 수 있습니다. 호출부가 이를 어떻게 처리하는지 확인하세요.', '5번 줄은 loadData가 반환한 Promise를 기다리거나 catch하지 않습니다. 손상된 JSON 파싱 오류가 처리되지 않은 rejection으로 남으므로 호출부 또는 함수 안에서 오류 상태를 안내해야 합니다.'),
      ]),
      studySession(4, '4일차 · HTTP 성공 뒤 JSON 파싱', '성공 상태를 확인한 뒤 Response.json을 기다리고 빈 배열을 포함한 실제 자료를 반환합니다.', 'Response.json은 비동기 본문 읽기입니다. HTTP 상태가 성공일 때만 파싱하도록 순서를 정하고, 빈 배열도 그대로 성공 데이터로 전달하세요.', 'async function courseList(response) {\n  if (!response.ok) return null;\n  return await response.json();\n}\ncourseList({ ok: true, json: async () => [] })\n  .then((result) => console.log(Array.isArray(result), result.length)); // true 0', [
        choice('js-w23-d4-json-await-v2', '비동기 JSON 본문 읽기', 'response.json()이 Promise를 반환할 때 async 함수에서 결과 배열을 얻으려면?', [
          ['response.json 프로퍼티만 반환한다', '함수 자체를 반환하면 파싱 완료된 JSON 자료가 아니라 메서드 참조를 다루게 됩니다.'],
          ['await response.json()으로 완료를 기다린다', '본문 파싱 Promise가 완료된 뒤 배열을 다음 처리 단계에 전달합니다.'],
          ['JSON.stringify(response)를 사용한다', 'Response 객체를 문자열화하는 일은 본문 JSON을 읽는 것과 다릅니다.'],
        ], 1, '본문 메서드가 완료되기 전에 호출자가 어떤 값을 받는지 생각하세요.', 'response.json()은 비동기이므로 await해야 파싱 결과인 배열을 얻습니다.'),
        locateError('js-w23-d4-json-order-v2', '상태 검사 순서 오류', 'HTTP 오류 본문을 성공 데이터로 다루지 않으려 합니다. 검사 순서를 어기는 줄을 고르세요.', 'JavaScript', ['async function courseList(response) {', '  const courses = await response.json();', '  if (!response.ok) return null;', '  return courses;', '}'], [2], 'HTTP 상태 확인과 응답 본문 처리가 어느 순서인지 살펴보세요.', '2번 줄은 실패 응답 본문부터 성공 자료로 파싱합니다. response.ok를 먼저 확인한 뒤 성공일 때만 json()을 기다려야 합니다.'),
        repairCode({
          id: 'js-w23-d4-course-list-v2', title: '성공 데이터와 HTTP 실패 구분', prompt: '아래 courseList를 고치세요. 이 과정의 목록 API는 성공할 때 JSON 배열을 반환합니다. response.ok가 false면 null, 성공이면 await response.json() 결과를 반환합니다. 따라서 성공한 []와 실패 null이 구별되어야 합니다. 정적 패턴 채점입니다.',
          language: 'JavaScript', starterCode: 'async function courseList(response) {\n  return response.json();\n}',
          solutionPatterns: ['^\\s*async\\s+function\\s+courseList\\s*\\(\\s*response\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*!response\\.ok\\s*\\)\\s*return\\s+null\\s*;?\\s*return\\s+await\\s+response\\.json\\(\\)\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['HTTP 실패는 null로, 성공은 비어 있더라도 JSON 파싱 결과를 반환한다.'], constraints: ['함수 이름과 response 매개변수를 유지한다.', '성공한 빈 배열을 오류 값으로 바꾸지 않는다.'], examples: [{ input: '{ ok: true, json: async () => [] }', output: '[]' }], tests: [{ input: '{ ok: false, json: async () => [\"ignored\"] }', expected: 'null' }] },
          gradingNote: '전체 함수 형태를 검사하는 정적 패턴입니다. 실제 fetch, HTTP 서버 또는 브라우저 본문은 실행하지 않습니다.',
          hint: 'ok가 false인 조기 반환을 먼저 두고, JSON Promise 결과를 기다려 반환하세요.',
          explanation: '이 과정의 목록 API 성공 본문은 배열이라는 계약입니다. 실패는 null, 성공은 파싱된 자료이므로 성공 자료가 []이어도 오류와 구별할 수 있습니다.',
        }),
      ]),
      studySession(5, '5일차 · 로딩 정리와 최종 상태', '요청 중 로딩 상태를 켜고 성공·HTTP 실패·네트워크 실패 모두에서 finally로 끕니다.', 'finally는 try가 정상 종료되거나 예외가 전파될 때 모두 실행됩니다. 이 예제는 고정된 성공 Response와 상태 콜백을 사용하며 실제 API에 연결하지 않습니다. 오류는 호출자에게 전파되므로 화면 안내는 호출부의 catch가 담당할 수 있습니다.', 'async function loadCourses(fetcher, setLoading) {\n  setLoading(true);\n  try {\n    const response = await fetcher(\"/courses\");\n    if (!response.ok) throw new Error(\"HTTP \" + response.status);\n    return await response.json();\n  } finally {\n    setLoading(false);\n  }\n}\nconst states = [];\nloadCourses(async () => ({ ok: true, json: async () => [\"JS\"] }), (value) => states.push(value))\n  .then((items) => console.log(items.length, states.join(\",\"))); // 1 true,false', [
        choice('js-w23-d5-finally-v2', '성공·실패 공통 정리', '요청 성공과 실패 모두에서 로딩 표시를 끄는 위치는?', [
          ['try 안의 return 다음 줄', 'return 또는 throw가 먼저 실행되면 일반적인 다음 줄이 실행되지 않습니다.'],
          ['catch에서만 실행한다', '성공한 경로에는 catch가 실행되지 않습니다.'],
          ['finally', 'finally는 try의 정상 완료와 예외 종료 양쪽에서 실행되어 공통 정리를 보장합니다.'],
        ], 2, '성공과 예외 두 경로가 공통으로 통과하는 정리 구간을 찾으세요.', 'finally에서 로딩을 끄면 요청 성공, HTTP 예외, 네트워크 rejection 어느 경로에서도 상태가 정리됩니다.'),
        locateError('js-w23-d5-no-finally-v2', '실패 때 남는 로딩 표시', '요청이 실패해도 로딩을 꺼야 합니다. 성공 흐름에서만 실행될 수 있는 줄을 고르세요.', 'JavaScript', ['async function load(fetcher, setLoading) {', '  setLoading(true);', '  const response = await fetcher(\"/courses\");', '  setLoading(false);', '  return response;', '}'], [4], '3번 줄이 reject하거나 response.ok 검사에서 throw하면 4번 줄에 도달하는지 생각하세요.', '4번 줄은 await가 reject되거나 중간에 throw되면 실행되지 않습니다. 성공·실패 공통 정리인 finally에 로딩 해제를 두세요.'),
        repairCode({
          id: 'js-w23-d5-finally-repair-v2', title: '항상 로딩을 정리하는 요청', prompt: '아래 loadCourses를 고치세요. 시작 때 setLoading(true), 성공 Response면 JSON 결과 반환, response.ok가 false면 HTTP Error를 던지고, 성공·실패 어느 쪽에서도 finally에서 setLoading(false)를 호출합니다. 정적 구조 채점입니다.',
          language: 'JavaScript', starterCode: 'async function loadCourses(fetcher, setLoading) {\n  const response = await fetcher(\"/courses\");\n  return response.json();\n}',
          solutionPatterns: ['^\\s*async\\s+function\\s+loadCourses\\s*\\(\\s*fetcher\\s*,\\s*setLoading\\s*\\)\\s*\\{\\s*setLoading\\(true\\)\\s*;?\\s*try\\s*\\{\\s*const\\s+response\\s*=\\s*await\\s+fetcher\\(\"/courses\"\\)\\s*;\\s*if\\s*\\(\\s*!response\\.ok\\s*\\)\\s*throw\\s+new\\s+Error\\([^)]*\\)\\s*;?\\s*return\\s+await\\s+response\\.json\\(\\)\\s*;?\\s*\\}\\s*finally\\s*\\{\\s*setLoading\\(false\\)\\s*;?\\s*\\}\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['요청 시작에 true, finally에서 false를 알린다.', 'HTTP 실패를 오류로 전달하고 HTTP 성공 본문을 비동기로 반환한다.'], constraints: ['함수 이름과 매개변수를 유지한다.', '오류 경로도 로딩 상태를 해제한다.'], examples: [{ input: '성공 Response와 상태 기록 함수', output: 'JSON 값 및 true,false 상태 순서' }], tests: [{ input: 'HTTP 503 Response', expected: '오류 전달 및 로딩 해제' }, { input: 'reject하는 fetcher', expected: 'rejection 전달 및 로딩 해제' }] },
          gradingNote: '자동 평가는 함수 구조 정규식만 확인하고 비동기 코드를 실행하지 않습니다. 예외·상태 사례는 편집 검토 기준입니다.',
          hint: '상태 시작 알림 뒤에 try를 두고, 응답 판정과 JSON 대기를 수행한 뒤 finally에서 종료 상태를 알려 주세요.',
          explanation: 'finally가 성공과 예외를 함께 정리합니다. JSON 결과는 await로 반환하고 HTTP·네트워크 오류는 호출부가 안내할 수 있도록 전파됩니다.',
        }),
      ]),
    ],
  },
  24: {
    objective: '검색어가 빠르게 바뀌어도 최신 응답만 반영하고 AbortController와 정리 함수를 연결합니다.',
    intro: '요청을 취소해 불필요한 작업을 줄여도 이미 도착했거나 다른 비동기 작업을 거친 응답이 화면에 반영될 수 있습니다. 취소와 최신 요청 식별은 서로 다른 보호 장치이며 이 주는 가짜 스케줄러·요청 객체를 사용합니다. React Effect 예제는 개념 스니펫이며 사이트 안에서 React나 네트워크를 실행하지 않습니다.',
    points: ['요청 번호로 오래된 응답이 현재 UI를 덮지 못하게 합니다.', 'fetch 옵션에는 AbortController 자체가 아니라 controller.signal을 전달합니다.', 'React Effect cleanup에서 현재 Effect가 만든 요청을 취소합니다.', '디바운스는 마지막 입력 이후 기다리고 이전 타이머를 지우며, 취소와 최신 응답 검사를 필요에 따라 함께 씁니다.', '수동 Effect 요청은 수명·취소 원리를 보여 주는 예제입니다. 실제 앱은 선택한 프레임워크의 데이터 요청 기능과 캐시도 검토합니다.'],
    overviewExample: 'function shouldApplyResult(requestId, latestRequestId) {\n  return requestId === latestRequestId;\n}\nconst oldRequest = 1;\nconst latestRequest = 2;\nconsole.log(shouldApplyResult(oldRequest, latestRequest), shouldApplyResult(latestRequest, latestRequest)); // false true',
    sessions: [
      studySession(1, '1일차 · 최신 응답만 반영', '새 요청이 시작된 뒤 늦게 도착한 이전 응답을 요청 식별자로 걸러냅니다.', '요청 시작 순서와 응답 도착 순서는 다를 수 있습니다. 숫자 요청 번호를 비교하는 작은 함수로 이전 결과가 화면을 덮지 못하는 조건을 확인하세요.', 'function shouldApplyResult(requestId, latestRequestId) {\n  return requestId === latestRequestId;\n}\nconsole.log(shouldApplyResult(1, 2), shouldApplyResult(2, 2)); // false true', [
        choice('js-w24-d1-latest-id-v2', '오래된 응답 거르기', '요청 7이 시작된 뒤 요청 8이 최신이 되었습니다. 7의 응답을 화면에 반영하지 않는 조건은?', [
          ['응답 id가 현재 최신 id와 정확히 같은지 확인한다', '현재 화면 상태를 갱신할 자격이 있는 요청만 허용합니다.'],
          ['먼저 시작한 응답을 우선한다', '요청 시작이 빠른 응답은 새 검색어의 결과가 아닐 수 있습니다.'],
          ['응답 배열의 길이만 비교한다', '서로 다른 검색어도 같은 길이의 배열을 반환할 수 있어 최신 요청을 증명하지 않습니다.'],
        ], 0, '응답 내용보다 어떤 검색어에서 시작한 요청인지 식별하세요.', '최신 요청 번호와 응답 요청 번호가 같을 때만 반영합니다. 이전 응답은 도착 순서와 관계없이 무시합니다.'),
        outputTrace('js-w24-d1-latest-trace-v2', '응답 번호 비교 추적', '다음 코드가 출력하는 값을 적으세요.\n\nfunction shouldApplyResult(requestId, latestRequestId) {\n  return requestId === latestRequestId;\n}\nconsole.log(shouldApplyResult(1, 2));', ['false'], '1과 최신 번호 2가 정확히 같은지 확인하세요.', '요청 id 1은 최신 id 2와 다르므로 결과를 적용하면 안 되고 false를 반환합니다.'),
        locateError('js-w24-d1-order-comparison-v2', '오래된 번호까지 허용하는 비교', '최신 요청과 id가 같은 응답만 반영해야 합니다. 이 조건을 위반하는 줄을 고르세요.', 'JavaScript', ['function shouldApplyResult(id, latestId) {', '  return id <= latestId;', '}', 'console.log(shouldApplyResult(1, 2));'], [2], '숫자가 작다는 것과 현재 id와 일치한다는 것이 같은 조건인지 확인하세요.', '2번 줄은 이전 id 1도 최신 id 2보다 작다는 이유로 허용합니다. 완전히 같은 요청만 적용하도록 ===를 사용해야 합니다.'),
      ]),
      studySession(2, '2일차 · AbortController와 signal', '새 AbortController를 요청별로 만들고 그 signal을 fetch 옵션에 전달합니다.', 'controller.abort()는 그 controller의 signal을 취소 상태로 만듭니다. 취소된 signal은 새 요청에 재사용하지 말고 요청마다 새 controller를 만들며, fetch에는 signal 속성을 전달합니다.', 'const controller = new AbortController();\nconst options = { signal: controller.signal };\nconsole.log(options.signal === controller.signal); // true\ncontroller.abort();\nconsole.log(controller.signal.aborted); // true', [
        choice('js-w24-d2-signal-v2', 'Fetch 취소 신호 연결', 'AbortController로 요청을 취소하려면 fetch 옵션에 전달할 값은?', [
          ['abort: controller.abort()', '이 호출은 즉시 취소를 실행하지만 fetch가 받을 signal 옵션은 전달하지 않습니다.'],
          ['controller: true', 'Fetch RequestInit에 controller라는 boolean 옵션을 전달해도 취소 신호가 연결되지 않습니다.'],
          ['signal: controller.signal', 'controller의 signal을 RequestInit에 전달하면 그 signal로 요청을 중단할 수 있습니다.'],
        ], 2, '취소 실행 메서드와 요청에 연결하는 취소 신호 객체를 구별하세요.', 'fetch는 RequestInit의 signal을 받습니다. controller.abort()는 그 signal을 aborted 상태로 바꾸는 호출입니다.'),
        outputTrace('js-w24-d2-aborted-v2', '취소 상태 확인', '다음 코드가 출력하는 값을 적으세요.\n\nconst controller = new AbortController();\ncontroller.abort();\nconsole.log(controller.signal.aborted);', ['true'], '취소 전과 후의 signal 상태를 비교하세요.', 'abort()를 호출하면 해당 signal의 aborted 값이 true가 됩니다. 이미 취소한 signal은 다른 새 요청에 재사용하지 말고 새 controller를 만드세요.'),
        locateError('js-w24-d2-controller-option-v2', '요청 취소 옵션 오류', 'fetch가 요청 취소를 받을 수 있어야 합니다. RequestInit 형식이 아닌 줄을 고르세요.', 'JavaScript', ['const controller = new AbortController();', 'fetch(\"/search\", { controller }).catch((error) => { if (error.name !== \"AbortError\") console.error(error); });', 'controller.abort();'], [2], 'fetch options 안에 AbortSignal이 전달되는지 확인하세요.', '2번 줄은 controller라는 알 수 없는 옵션을 넣습니다. { signal: controller.signal }을 전달해야 fetch와 취소 신호가 연결됩니다.'),
      ]),
      studySession(3, '3일차 · React Effect 요청 정리', 'Effect가 끝나거나 의존성이 바뀔 때 cleanup에서 현재 요청의 signal을 취소합니다.', '아래는 React useEffect 개념 스니펫입니다. React 패키지나 실제 fetch는 이 사이트에서 실행하지 않습니다. Effect 수명과 취소 원리를 보여 주는 예제이며, 실제 앱은 사용 중인 프레임워크의 데이터 요청 기능이나 클라이언트 캐시를 함께 검토합니다. AbortError는 사용자가 취소한 흐름으로 별도 취급하세요.', 'useEffect(() => {\n  const controller = new AbortController();\n  fetch(\"/search?q=\" + encodeURIComponent(query), { signal: controller.signal })\n    .then((response) => {\n      if (!response.ok) throw new Error(\"요청 실패\");\n      return response.json();\n    })\n    .then(setResults)\n    .catch((error) => {\n      if (error.name !== \"AbortError\") setError(error);\n    });\n  return () => controller.abort();\n}, [query]);', [
        choice('js-w24-d3-effect-cleanup-v2', 'Effect 자원 정리 시점', 'query가 바뀌어 검색 Effect가 다시 실행되거나 컴포넌트가 사라질 때 이전 요청을 정리하는 위치는?', [
          ['response.json이 완료된 뒤 새 요청이 끝날 때까지 기다린다', '이전 Effect가 수명을 마칠 때 자원을 정리할 시점을 놓칩니다.'],
          ['Effect가 반환하는 cleanup 함수', 'React는 Effect를 다시 실행하거나 정리할 때 이전 Effect의 cleanup을 호출합니다.'],
          ['렌더 함수 본문에서 매번 controller.abort()를 호출한다', '렌더링 도중 side effect를 수행하면 렌더 과정의 순수성을 깨뜨립니다.'],
        ], 1, 'Effect가 만든 요청을 소유한 범위와 그 범위가 끝나는 시점을 찾으세요.', 'controller를 만든 Effect의 반환 cleanup에서 abort하면 그 Effect가 끝날 때 해당 요청을 정리할 수 있습니다.'),
        outputTrace('js-w24-d3-cleanup-trace-v2', '정리 함수 호출 추적', '다음 코드를 실행한 뒤 controller.signal.aborted 값을 적으세요.\n\nfunction makeCleanup(controller) {\n  return () => controller.abort();\n}\nconst controller = new AbortController();\nconst cleanup = makeCleanup(controller);\ncleanup();\nconsole.log(controller.signal.aborted);', ['true'], '반환된 함수가 호출될 때 어떤 메서드를 실행하는지 따라가세요.', 'cleanup 함수가 controller.abort()를 호출해 signal.aborted를 true로 바꿉니다.'),
        locateError('js-w24-d3-missing-cleanup-v2', 'Effect 요청 정리 누락', 'Effect가 끝나면 이전 요청을 취소해야 합니다. 반환된 cleanup이 없는 줄을 고르세요.', 'JavaScript', ['useEffect(() => {', '  const controller = new AbortController();', '  fetch(url, { signal: controller.signal }).catch((error) => { if (error.name !== \"AbortError\") console.error(error); });', '}, [url]);'], [4], 'Effect 본문이 요청을 시작한 뒤 정리 함수를 반환하는지 확인하세요.', '4번 줄의 Effect callback은 cleanup을 반환하지 않습니다. return () => controller.abort()를 반환해야 의존성 변경과 정리 시 요청을 취소할 수 있습니다.'),
      ]),
      studySession(4, '4일차 · 디바운스로 입력 묶기', '새 입력마다 이전 타이머를 취소하고 마지막 입력 뒤 일정 시간이 지난 후 한 번 실행합니다.', '디바운스는 빠른 입력을 하나의 마지막 실행으로 묶습니다. 주입된 setTimer/clearTimer는 가짜 스케줄러이며 실제 250ms 대기나 브라우저 입력 이벤트를 만들지 않습니다.', 'function debounce(run, setTimer, clearTimer) {\n  let timer = null;\n  return (...args) => {\n    if (timer !== null) clearTimer(timer);\n    timer = setTimer(() => run(...args), 250);\n  };\n}\nconst pending = new Set();\nlet nextId = 0;\nconst scheduled = [];\nfunction setTimer(callback, delay) { const id = ++nextId; pending.add(id); scheduled.push({ id, callback, delay }); return id; }\nfunction clearTimer(id) { pending.delete(id); }\nconst search = debounce((term) => console.log(term), setTimer, clearTimer);\nsearch(\"ja\");\nsearch(\"javascript\");\nconsole.log([...pending].length, scheduled.filter((item) => pending.has(item.id))[0].delay); // 1 250', [
        choice('js-w24-d4-debounce-v2', '연속 입력 요청 줄이기', '검색어가 연달아 바뀔 때 디바운스가 실행하는 시점은?', [
          ['키 입력이 들어올 때마다 바로 실행한다', '이 동작은 입력마다 요청을 보내므로 요청 수를 줄이지 않습니다.'],
          ['처음 입력 뒤 일정 시간이 지나면 중간 입력과 관계없이 실행한다', '처음 호출만 유지하는 것은 이 과정에서 다루는 마지막 입력 기준의 디바운스와 다릅니다.'],
          ['이전 타이머를 지우고 마지막 입력 뒤 지연 시간이 지나면 실행한다', '대기 중 입력이 오면 예약을 다시 시작해 마지막 입력을 기준으로 실행합니다.'],
        ], 2, '연속 호출 중 앞의 예약을 어떻게 처리하는지 생각하세요.', '디바운스는 앞서 예약한 timer를 취소하고 마지막 호출을 기준으로 다시 지연을 둡니다.'),
        locateError('js-w24-d4-timer-order-v2', '잘못된 timer를 취소하는 줄', '연속 입력 후 새 timer 하나만 남겨야 합니다. 이전 timer를 남겨 두는 줄을 고르세요.', 'JavaScript', ['function schedule(run, setTimer, clearTimer, timer) {', '  const next = setTimer(run, 250);', '  if (timer !== null) clearTimer(next);', '  return next;', '}'], [3], 'clearTimer에 새 예약 id와 이전 예약 id 중 어느 값이 들어가는지 보세요.', '3번 줄은 방금 만든 next를 취소해 버리고 인수로 받은 이전 timer는 남깁니다. 기존 timer를 clear한 다음 새 예약 id를 저장해야 합니다.'),
        repairCode({
          id: 'js-w24-d4-debounce-repair-v2', title: '마지막 호출만 예약하기', prompt: '아래 debounce를 고치세요. 반환된 함수가 다시 불릴 때 이전 timer를 clearTimer로 취소하고, 마지막 인수들을 250ms 뒤 run에 전달합니다. setTimer와 clearTimer는 주입된 함수입니다. 정적 패턴 채점입니다.',
          language: 'JavaScript', starterCode: 'function debounce(run, setTimer, clearTimer) {\n  return (...args) => setTimer(() => run(...args), 250);\n}',
          solutionPatterns: ['^\\s*function\\s+debounce\\s*\\(\\s*run\\s*,\\s*setTimer\\s*,\\s*clearTimer\\s*\\)\\s*\\{\\s*let\\s+timer\\s*=\\s*null\\s*;?\\s*return\\s*\\(\\.\\.\\.args\\)\\s*=>\\s*\\{\\s*if\\s*\\(\\s*timer\\s*!==\\s*null\\s*\\)\\s*clearTimer\\(timer\\)\\s*;?\\s*timer\\s*=\\s*setTimer\\(\\(\\)\\s*=>\\s*run\\(\\.\\.\\.args\\)\\s*,\\s*250\\)\\s*;?\\s*\\}\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['마지막 호출의 인수와 250ms 지연으로 실행을 예약한다.', '새 예약 전에 이전 예약이 있으면 취소한다.'], constraints: ['run, setTimer, clearTimer 매개변수와 debounce 함수명을 유지한다.', '브라우저의 전역 timer에 의존하지 않는다.'], examples: [{ input: '가짜 scheduler에서 두 번 연속 호출', output: '첫 예약 취소, 두 번째 실행만 남음' }], tests: [{ input: '첫 호출 뒤 다시 호출', expected: '이전 timer id가 clearTimer에 전달됨' }] },
          gradingNote: '정규식 기반 정적 코드 평가이며 실제 timer나 시간 대기를 실행하지 않습니다.',
          hint: 'timer id를 클로저에 저장하고, null이 아니면 clear한 뒤 새 예약 id를 보관하세요.',
          explanation: '타이머 id를 클로저에 유지해야 연속 호출 사이에서 이전 예약을 취소할 수 있습니다. 마지막 호출의 args를 캡처해 새 타이머에서 전달합니다.',
        }),
      ]),
      studySession(5, '5일차 · 취소와 최신 결과 통합', '요청 취소를 시도하면서도 마지막 응답 id를 확인해 오래된 결과 적용을 한 번 더 막습니다.', 'abort는 불필요한 작업을 줄이는 수단이고 요청 id 비교는 화면 상태를 보호하는 조건입니다. 취소가 이미 늦었거나 응답을 다른 비동기 작업에 전달한 경우를 생각해 둘을 혼동하지 마세요.', 'function shouldApplyResult(requestId, latestRequestId) {\n  return requestId === latestRequestId;\n}\nconst pending = [1, 2];\nconst latest = 2;\nconsole.log(JSON.stringify(pending.filter((id) => shouldApplyResult(id, latest)))); // [2]', [
        choice('js-w24-d5-cancel-guard-v2', '취소와 최신 id의 역할', 'AbortController로 이전 fetch를 취소했어도 응답을 최신 id로 확인하는 조건을 둘 수 있는 이유는?', [
          ['취소 신호는 네트워크 이후 작업까지 모든 경합을 항상 막는 UI 상태 보증이기 때문이다', '취소는 요청 작업을 중단시키지만 이미 끝난 작업이나 별도 후속 처리가 오래된 상태를 반영하는지까지 보장하지 않습니다.'],
          ['응답마다 서로 다른 JSON 문법을 쓰기 때문이다', 'JSON 문법은 요청이 최신인지 판단하는 기준이 아닙니다.'],
          ['취소는 작업을 줄이고 id 비교는 오래된 결과 적용을 막는 서로 다른 보호 역할을 하기 때문이다', '두 장치는 중단 시도와 화면 갱신 자격 확인이라는 다른 위험을 다룹니다.'],
        ], 2, '불필요한 일을 중단하는 목적과 상태 변경을 허용하는 조건을 나눠 생각하세요.', 'abort는 요청을 중단해 자원을 절약합니다. 요청 id 비교는 늦게 도착한 오래된 결과가 현재 화면을 덮지 못하게 합니다. 서로 대체 관계가 아닙니다.'),
        locateError('js-w24-d5-unchecked-response-v2', '오래된 응답 덮어쓰기', '오래된 응답이 화면을 덮지 않게 해야 합니다. 최신 요청 id 검사와 다른 비교를 하는 줄을 고르세요.', 'JavaScript', ['function applyResponse(id, latestId, data, render) {', '  if (id <= latestId) render(data);', '  return true;', '}'], [2], '불일치면 먼저 반환해야 하는지, id가 작을 때 렌더링하는지 확인하세요.', '2번 줄은 이전 id도 최신 id보다 작다는 이유로 렌더링합니다. id가 최신 id와 같을 때만 반영하고 불일치면 먼저 반환해야 합니다.'),
        repairCode({
          id: 'js-w24-d5-latest-result-repair-v2', title: '최신 응답만 허용하기', prompt: '아래 shouldApplyResult를 고치세요. 요청 id가 latestId와 같을 때만 true를 반환하고, 이전·다른 id는 false를 반환합니다. 정적 패턴 채점입니다.',
          language: 'JavaScript', starterCode: 'function shouldApplyResult(requestId, latestId) {\n  return true;\n}',
          solutionPatterns: ['^\\s*function\\s+shouldApplyResult\\s*\\(\\s*requestId\\s*,\\s*latestId\\s*\\)\\s*\\{\\s*return\\s+requestId\\s*===\\s*latestId\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['requestId와 latestId가 같을 때만 true를 반환한다.'], constraints: ['함수 이름과 매개변수를 유지한다.', '전역 상태 또는 요청 내용에 의존하지 않는다.'], examples: [{ input: '1, 2', output: 'false' }], tests: [{ input: '2, 2', expected: 'true' }] },
          gradingNote: '전체 함수 구조를 보는 정적 패턴 평가로 비동기 응답을 직접 실행하지 않습니다.',
          hint: '최신 요청과 같은 id만 통과시키는 동등 비교를 반환하세요.',
          explanation: 'id가 같으면 최신 요청의 결과라 true이고, 이전 id면 false입니다. 이 검사는 abort 성공 여부와 별개로 UI 반영 조건을 보장합니다.',
        }),
      ]),
    ],
  },
};

const javascriptBrowserProgressAndRequestAlternativePatterns = new Map([
  ['js-w22-d4-save-progress-v2', [
    String.raw`^\s*function\s+saveProgress\s*\(\s*storage\s*,\s*key\s*,\s*progress\s*\)\s*\{\s*try\s*\{\s*const\s+serialized\s*=\s*JSON\.stringify\(progress\)\s*;?\s*storage\.setItem\(key\s*,\s*serialized\)\s*;?\s*return\s+true\s*;?\s*\}\s*catch\s*\(\s*error\s*\)\s*\{\s*return\s+false\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w22-d5-storage-event-repair-v2', [
    String.raw`^\s*function\s+progressFromStorageEvent\s*\(\s*event\s*\)\s*\{\s*if\s*\(\s*!\[\s*"progress"\s*,\s*null\s*\]\.includes\(event\.key\)\s*\)\s*return\s+null\s*;?\s*if\s*\(\s*event\.newValue\s*===\s*null\s*\)\s*return\s*\{\s*done\s*:\s*\[\s*\]\s*\}\s*;?\s*try\s*\{\s*const\s+saved\s*=\s*JSON\.parse\(event\.newValue\)\s*;?\s*if\s*\(\s*saved\s*===\s*null\s*\|\|\s*typeof\s+saved\s*!==\s*"object"\s*\|\|\s*Array\.isArray\(saved\)\s*\|\|\s*!Array\.isArray\(saved\.done\)\s*\|\|\s*!saved\.done\.every\(\s*id\s*=>\s*typeof\s+id\s*===\s*"string"\s*\)\s*\)\s*return\s*\{\s*done\s*:\s*\[\s*\]\s*\}\s*;?\s*return\s+saved\s*;?\s*\}\s*catch\s*\(\s*error\s*\)\s*\{\s*return\s*\{\s*done\s*:\s*\[\s*\]\s*\}\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w23-d4-course-list-v2', [
    String.raw`^\s*async\s+function\s+courseList\s*\(\s*response\s*\)\s*\{\s*if\s*\(\s*response\.ok\s*\)\s*\{\s*const\s+courses\s*=\s*await\s+response\.json\(\)\s*;?\s*return\s+courses\s*;?\s*\}\s*return\s+null\s*;?\s*\}\s*$`,
  ]],
  ['js-w23-d5-finally-repair-v2', [
    String.raw`^\s*async\s+function\s+loadCourses\s*\(\s*fetcher\s*,\s*setLoading\s*\)\s*\{\s*setLoading\(true\)\s*;?\s*try\s*\{\s*const\s+response\s*=\s*await\s+fetcher\("/courses"\)\s*;?\s*if\s*\(\s*!response\.ok\s*\)\s*\{\s*throw\s+new\s+Error\(\s*"HTTP "\s*\+\s*response\.status\s*\)\s*;?\s*\}\s*const\s+courses\s*=\s*await\s+response\.json\(\)\s*;?\s*return\s+courses\s*;?\s*\}\s*finally\s*\{\s*setLoading\(false\)\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w24-d4-debounce-repair-v2', [
    String.raw`^\s*function\s+debounce\s*\(\s*run\s*,\s*setTimer\s*,\s*clearTimer\s*\)\s*\{\s*let\s+timerId\s*=\s*null\s*;?\s*return\s+function\s*\(\.\.\.args\)\s*\{\s*if\s*\(\s*timerId\s*!==\s*null\s*\)\s*clearTimer\(timerId\)\s*;?\s*timerId\s*=\s*setTimer\(function\s*\(\s*\)\s*\{\s*run\(\.\.\.args\)\s*;?\s*\}\s*,\s*250\)\s*;?\s*\}\s*;?\s*\}\s*$`,
  ]],
  ['js-w24-d5-latest-result-repair-v2', [
    String.raw`^\s*function\s+shouldApplyResult\s*\(\s*requestId\s*,\s*latestId\s*\)\s*\{\s*if\s*\(\s*requestId\s*===\s*latestId\s*\)\s*return\s+true\s*;?\s*return\s+false\s*;?\s*\}\s*$`,
  ]],
]);

for (const week of Object.values(javascriptReviewedWeeks22To24)) {
  for (const session of week.sessions) {
    for (const exercise of session.exercises) {
      const alternatives = javascriptBrowserProgressAndRequestAlternativePatterns.get(exercise.id);
      if (alternatives) exercise.solutionPatterns.push(...alternatives);
    }
  }
}

// CQ-2 final JavaScript weeks focus on browser trust boundaries and a small, testable app contract.
// Node checks provide a minimal DOM stand-in; they do not prove browser security or keyboard behavior.
export const javascriptReviewedWeeks25To26 = {
  25: {
    objective: '신뢰하지 않는 문자열의 표시·URL 구성·내부 이동·저장 경계를 구분하고 안전한 기본값을 선택합니다.',
    intro: '브라우저에 입력한 문자는 자동으로 안전해지지 않습니다. 이번 주는 실제 DOM API를 써서 텍스트, URL 값, 내부 경로, 민감정보 저장을 구분합니다. 예제 실행 검사는 최소 DOM 모형으로 하므로 실제 브라우저의 보안 검증을 대신하지 않습니다.',
    points: ['일반 문구는 innerHTML 대신 textContent에 넣어 HTML로 해석되지 않게 합니다.', 'URL의 쿼리 값에는 encodeURIComponent를 적용하고 전체 URL 인코딩과 구분합니다.', '이동 대상은 허용한 내부 식별자로 직접 구성하고 임의 주소를 그대로 전달하지 않습니다.', '비밀번호와 비밀 토큰은 브라우저 저장소에 저장하지 않습니다. 허용한 비밀 아닌 설정만 저장합니다.'],
    overviewExample: 'function coursePath(id) {\n  const allowed = new Set(["js", "py", "react"]);\n  return allowed.has(id) ? "#/track/" + id : "#/tracks";\n}\nconst target = document.createElement("p");\ntarget.textContent = "<img src=x onerror=alert(1)>";\ndocument.body.append(target);\nconsole.log(target.textContent, coursePath("js"), coursePath("https://bad.test")); // <img src=x onerror=alert(1)> #/track/js #/tracks',
    sessions: [
      studySession(1, '1일차 · 입력을 텍스트로 표시하기', '외부 문자열을 HTML로 파싱하지 않고 화면 문구로 표시하는 속성을 구분합니다.', 'document.createElement로 문단을 만든 뒤 textContent에 댓글을 넣어 화면에 추가합니다. `<img>`처럼 보여도 브라우저가 HTML로 바꾸지 않고 글자로 다룹니다. Node 검사는 최소 DOM 모형으로 실행하며 실제 브라우저 보안 검증은 아닙니다.', 'const target = document.createElement("p");\nconst comment = "<img src=x onerror=alert(1)>";\ntarget.textContent = comment;\ndocument.body.append(target);\nconsole.log(target.textContent);', [
        choice('js-w25-d1-text-node-v3', '일반 문구 표시 경계', '사용자가 입력한 댓글을 태그로 실행하지 않고 그대로 문구로 보여 주려면 어느 속성을 기본으로 사용해야 하나요?', [
          ['element.textContent', '문자열을 텍스트로 설정하므로 `<img>` 같은 입력도 마크업으로 파싱하지 않습니다.'],
          ['element.innerHTML', '문자열을 HTML로 파싱하므로 입력을 마크업으로 해석할 수 있습니다.'],
          ['element.outerHTML', '요소 자체의 HTML을 바꾸므로 사용자 문구 삽입의 안전한 텍스트 API가 아닙니다.'],
        ], 0, '요구사항이 마크업 생성인지 일반 문구 표시인지 먼저 구분하세요.', '댓글은 HTML 템플릿이 아니라 사용자 문구입니다. textContent에 대입하면 태그 모양 문자열을 HTML로 실행하지 않고 텍스트로 둡니다.'),
        outputTrace('js-w25-d1-text-trace-v3', '태그 모양 문자열 추적', '다음 코드에서 textContent에 보관되어 출력되는 값을 그대로 적으세요.\n\nconst target = document.createElement("p");\nconst comment = "<img src=x onerror=alert(1)>";\ntarget.textContent = comment;\ndocument.body.append(target);\nconsole.log(target.textContent);', ['<img src=x onerror=alert(1)>'], 'textContent에 넣은 댓글 문자열이 출력됩니다.', '문단 요소의 textContent에 댓글을 넣었으므로 태그 기호를 포함한 `<img src=x onerror=alert(1)>`가 일반 문구로 출력됩니다. 이 검사는 최소 DOM 모형을 사용하며 실제 브라우저 보안 검증은 아닙니다.'),
        locateError('js-w25-d1-innerhtml-v3', 'HTML 파싱이 발생하는 줄 찾기', '요구사항은 입력된 댓글을 실행 가능한 마크업이 아닌 문구로 표시하는 것입니다. 요구사항과 다른 줄을 고르세요.', 'JavaScript', ['function showComment(element, comment) {', '  element.textContent = "댓글";', '  element.innerHTML = comment;', '  return element.textContent;', '}'], [3], '입력값을 HTML 파서에 넘기는 속성을 찾으세요.', '3번 줄의 innerHTML은 comment를 HTML로 해석합니다. 단순 문구라면 textContent만 사용해야 합니다.'),
      ]),
      studySession(2, '2일차 · URL 쿼리 값 인코딩', '쿼리 구분 문자와 사용자 검색어를 분리해 URL의 값 부분만 인코딩합니다.', 'encodeURIComponent는 URL 전체가 아니라 한 구성 요소의 값을 인코딩합니다. 예제는 검색어를 q 값으로 추가하며 공백과 &가 어떤 문자로 바뀌는지 확인합니다.', 'function searchUrl(query) {\n  return "/search?q=" + encodeURIComponent(query);\n}\nconsole.log(searchUrl("JS & React"));', [
        choice('js-w25-d2-query-value-v3', '검색어 값과 구분자 분리', '검색어 `JS & React`를 `q`의 한 값으로 보낼 때 올바른 방식은 무엇인가요?', [
          ['`"/search?q=" + encodeURIComponent(query)`로 값만 인코딩한다', '쿼리 구조를 유지하면서 검색어 안의 &가 새 매개변수 구분자로 오해되지 않게 합니다.'],
          ['query 전체를 HTML 이스케이프한 뒤 URL에 붙인다', 'HTML 문맥 처리와 URL 쿼리 구성 요소 처리는 서로 다른 인코딩 경계입니다.'],
          ['query를 그대로 문자열 연결한다', '검색어 안의 &가 쿼리 매개변수 구분자로 해석될 수 있습니다.'],
        ], 0, '검색어 안의 &가 사용자가 입력한 값인지 URL 구분자인지 구별해 보세요.', 'encodeURIComponent로 값 부분만 인코딩하면 `&`는 `%26`이 되어 검색어 안에 남고, 쿼리 구조를 깨지 않습니다.'),
        outputTrace('js-w25-d2-query-trace-v3', '인코딩된 검색 URL 계산', '다음 코드가 출력하는 전체 경로를 적으세요.\n\nfunction searchUrl(query) {\n  return "/search?q=" + encodeURIComponent(query);\n}\nconsole.log(searchUrl("JS & React"));', ['/search?q=JS%20%26%20React'], '공백은 `%20`, 검색어 속 앰퍼샌드는 `%26`이 됩니다.', '값 부분의 공백과 &를 encodeURIComponent가 인코딩합니다. 경로의 고정 구분자는 그대로 남아 `/search?q=JS%20%26%20React`가 출력됩니다.'),
        locateError('js-w25-d2-raw-query-v3', '예약 문자를 그대로 붙인 줄 찾기', '검색어 안의 &가 새 쿼리 매개변수로 오해되지 않아야 합니다. 이 조건을 어기는 줄을 고르세요.', 'JavaScript', ['function searchUrl(query) {', '  const normalized = query.trim();', '  return "/search?q=" + normalized;', '}', 'console.log(searchUrl("JS & React"));'], [3], '쿼리에 넣는 사용자 값을 인코딩하는 처리가 있는지 확인하세요.', '3번 줄은 query 값을 인코딩하지 않고 붙입니다. &와 같은 예약 문자가 값 경계를 바꾸지 않도록 encodeURIComponent(query)를 사용해야 합니다.'),
      ]),
      studySession(3, '3일차 · 허용한 내부 경로로 이동', '외부 문자열을 목적지로 직접 쓰지 않고 허용 목록에서 내부 경로를 구성합니다.', '경로 예제는 식별자 js, py만 통과시키며 알 수 없는 입력은 과정 목록으로 돌립니다. 허용 목록은 이동 정책이지 모든 URL 상황을 대신하는 범용 검증기가 아닙니다.', 'function coursePath(id) {\n  const allowed = new Set(["js", "py"]);\n  return allowed.has(id) ? "#/track/" + id : "#/tracks";\n}\nconsole.log(coursePath("admin"));', [
        choice('js-w25-d3-allowlist-v3', '내부 이동 대상을 정하는 정책', '사용자 입력으로 다음 학습 경로를 고를 때 안전한 기본 설계는 무엇인가요?', [
          ['허용된 과정 id만 받아 내부 경로를 직접 구성한다', '허용 목록 밖의 문자열이 임의 외부 주소가 되는 일을 막고 목적지 범위를 좁힙니다.'],
          ['입력 문자열을 검증 없이 location.href에 넣는다', '입력만으로 허용하지 않은 외부 목적지까지 열 수 있습니다.'],
          ['문자열 길이만 제한하고 임의 주소를 허용한다', '짧은 외부 주소도 가능하므로 길이 제한은 목적지 허용 정책이 아닙니다.'],
        ], 0, '입력 문자열을 정화할지보다 이동 가능한 목적지를 누가 정하는지 살펴보세요.', '앱이 허용한 id로 내부 경로를 구성하면 임의 주소를 전달하지 않습니다. 길이 제한만으로 목적지를 제한할 수는 없습니다.'),
        outputTrace('js-w25-d3-path-trace-v3', '허용되지 않은 과정 경로 추적', '다음 코드가 출력하는 경로를 적으세요.\n\nfunction coursePath(id) {\n  const allowed = new Set(["js", "py"]);\n  return allowed.has(id) ? "#/track/" + id : "#/tracks";\n}\nconsole.log(coursePath("admin"));', ['#/tracks'], '집합에 없는 id는 조건식의 거짓 경로를 선택합니다.', 'admin은 허용된 js, py 중 하나가 아니므로 기본 내부 경로 `#/tracks`를 반환합니다.'),
        locateError('js-w25-d3-location-v3', '임의 주소로 이동하는 대입 찾기', '사용자가 고를 수 있는 과정은 js와 py뿐입니다. 입력이 이동 목적지를 직접 통제하는 줄을 고르세요.', 'JavaScript', ['function nextLocation(input) {', '  const allowed = ["js", "py"];', '  if (!allowed.includes(input)) return "#/tracks";', '  return "#/track/" + input;', '}', 'function unsafeLocation(input) {', '  location.href = input;', '}'], [7], '허용 목록 결과를 무시하고 원본 문자열을 브라우저 목적지에 넘기는 줄을 찾으세요.', '7번 줄은 검증 없이 외부 입력을 location.href에 대입합니다. 실제 이동은 허용된 내부 식별자에서만 구성해야 합니다.'),
      ]),
      studySession(4, '4일차 · 저장해도 되는 값만 고르기', '비밀정보를 브라우저 저장소에 두지 않고 허용된 비민감 설정만 저장합니다.', 'localStorage는 비밀을 보관하는 금고가 아닙니다. 예제는 light/dark라는 두 가지 표시 설정만 저장하고, 지원하지 않는 값과 저장 예외를 실패로 처리합니다. 계정 비밀번호나 토큰을 브라우저 저장소에 넣지 않습니다.', 'function saveTheme(storage, theme) {\n  if (!["light", "dark"].includes(theme)) return false;\n  try {\n    storage.setItem("theme", theme);\n    return true;\n  } catch {\n    return false;\n  }\n}\nconst saved = new Map();\nconst storage = { setItem(key, value) { saved.set(key, value); } };\nconsole.log(saveTheme(storage, "dark"), saved.get("theme")); // true dark', [
        choice('js-w25-d4-secret-storage-v3', '비밀번호를 저장하지 않는 이유', '브라우저 학습 사이트가 사용자의 비밀번호를 localStorage에 저장하지 않아야 하는 핵심 이유는 무엇인가요?', [
          ['같은 출처의 스크립트나 기기 사용자가 값을 읽을 수 있기 때문이다', '웹 저장소는 비밀 전용 보관소가 아니므로 민감정보 저장 장소로 취급하면 안 됩니다.'],
          ['localStorage 값은 브라우저가 항상 자동 암호화하기 때문이다', '브라우저 저장소가 애플리케이션 비밀정보를 자동으로 보호한다고 가정할 수 없습니다.'],
          ['localStorage는 서버만 읽을 수 있기 때문이다', 'localStorage는 해당 브라우저의 페이지 스크립트에서 읽고 쓸 수 있습니다.'],
        ], 0, '브라우저에서 실행되는 코드와 기기의 사용자 중 누가 같은 출처 자료를 읽을 수 있는지 생각하세요.', 'localStorage는 브라우저의 스크립트가 접근할 수 있어 비밀번호나 비밀 토큰을 보관하면 안 됩니다. 이 예제는 비밀 아닌 테마 설정만 저장합니다.'),
        locateError('js-w25-d4-password-write-v3', '비밀번호 저장 호출 찾기', '이 앱은 민감한 비밀번호를 브라우저에 기록하면 안 됩니다. 위험한 저장 동작을 하는 줄을 고르세요.', 'JavaScript', ['function saveTheme(storage, theme) {', '  if (!["light", "dark"].includes(theme)) return false;', '  storage.setItem("theme", theme);', '}', 'function savePassword(storage, password) {', '  storage.setItem("password", password);', '}'], [6], '테마 선택값과 계정 비밀값은 같은 저장 허용 범위가 아닙니다.', '6번 줄은 비밀번호를 브라우저 저장소에 기록합니다. 비밀정보를 저장하지 말고 명시적으로 허용한 비민감 설정만 저장해야 합니다.'),
        repairCode({
          id: 'js-w25-d4-theme-storage-repair-v3', title: '허용된 테마만 저장하기', prompt: '아래 `saveTheme`을 고치세요. theme가 light 또는 dark일 때만 "theme" 키에 저장하고, 저장 성공은 true, 지원하지 않는 값이나 저장 예외는 false를 반환합니다. 이 문제는 전체 함수 정적 패턴 평가입니다.', language: 'JavaScript',
          starterCode: 'function saveTheme(storage, theme) {\n  storage.setItem("password", theme);\n  return true;\n}',
          solutionPatterns: ['^\\s*function\\s+saveTheme\\s*\\(\\s*storage\\s*,\\s*theme\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*!\\s*\\[\\s*"light"\\s*,\\s*"dark"\\s*\\]\\.includes\\(theme\\)\\s*\\)\\s*return\\s+false\\s*;?\\s*try\\s*\\{\\s*storage\\.setItem\\(\\s*"theme"\\s*,\\s*theme\\s*\\)\\s*;?\\s*return\\s+true\\s*;?\\s*\\}\\s*catch\\s*\\{\\s*return\\s+false\\s*;?\\s*\\}\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['light/dark만 theme 키로 저장한다.', '지원하지 않는 값과 setItem 예외는 false, 성공은 true를 반환한다.'], constraints: ['password나 임의 키에 저장하지 않는다.', 'storage와 theme 매개변수를 유지한다.'], examples: [{ input: '"dark"', output: 'true와 theme=dark' }], tests: [{ input: '"system"', expected: 'false, 기록 없음' }, { input: 'setItem이 예외를 던짐', expected: 'false' }] },
          gradingNote: '함수 전체를 확인하는 정적 패턴 채점입니다. 실제 저장은 실행되지 않으므로 사용 금지 데이터 정책은 별도 설계와 검토가 필요합니다.', hint: '허용된 두 테마만 먼저 통과시키고 저장 호출을 try/catch 안에 두세요.', explanation: '비밀번호나 토큰을 저장하는 범용 함수를 만들지 않고 비민감한 테마 값만 허용합니다. 저장소 예외도 성공으로 오인하지 않습니다.',
        }),
      ]),
      studySession(5, '5일차 · DOM 문구를 안전하게 추가하기', '외부 문구를 노드의 textContent로 기록한 뒤 실제 DOM 목록 API로 추가합니다.', '브라우저에서 ul 요소를 만들고 li 요소에 문구를 textContent로 넣은 뒤 append합니다. `<img>` 같은 문자열도 HTML로 파싱되지 않도록 요소와 문구를 따로 다룹니다. Node 검사는 최소 DOM 모형으로 실행하며 실제 브라우저 보안 검증은 아닙니다.', 'function appendPlainMessage(list, message) {\n  const item = document.createElement("li");\n  item.textContent = message;\n  list.append(item);\n  return item;\n}\nconst list = document.createElement("ul");\ndocument.body.append(list);\nconst item = appendPlainMessage(list, "<img>");\nconsole.log(item.tagName.toLowerCase(), item.textContent, list.children.length);', [
        repairCode({
          id: 'js-w25-d5-plain-dom-repair-v3', title: '메시지를 텍스트 노드 값으로 추가', prompt: '아래 `appendPlainMessage` 함수를 고치세요. `document.createElement("li")`로 항목을 만들고, message는 item.textContent에 넣은 뒤 list.append(item)으로 추가하고 item을 반환합니다. 전체 함수의 표현을 확인하는 정적 평가입니다.', language: 'JavaScript',
          starterCode: 'function appendPlainMessage(list, message) {\n  list.innerHTML += "<li>" + message + "</li>";\n}',
          solutionPatterns: ['^\\s*function\\s+appendPlainMessage\\s*\\(\\s*list\\s*,\\s*message\\s*\\)\\s*\\{\\s*const\\s+item\\s*=\\s*document\\.createElement\\(\\s*"li"\\s*\\)\\s*;?\\s*item\\.textContent\\s*=\\s*message\\s*;?\\s*list\\.append\\(item\\)\\s*;?\\s*return\\s+item\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['document.createElement으로 li 항목을 만든 뒤 textContent로 문구를 설정하고 list에 넣어 반환한다.'], constraints: ['innerHTML로 사용자 입력을 해석하지 않는다.', 'list와 message 매개변수를 유지한다.'], examples: [{ input: 'message="<img>", 빈 ul', output: 'textContent가 <img>인 li 항목 하나' }], tests: [{ input: '세션 문자열', expected: '그대로 textContent에 보존됨' }, { input: '빈 문자열', expected: '빈 textContent의 항목 하나가 목록에 추가됨' }] },
          gradingNote: '전체 함수 형태를 확인하는 정적 평가입니다. 자동 검사는 코드를 실행해 실제 브라우저 보안을 검증하지 않습니다.', hint: '문자열 HTML을 이어 붙이지 말고 li 요소를 만든 뒤 textContent를 설정하세요.', explanation: '실제 DOM 요소를 만든 뒤 사용자의 문장을 textContent에 넣으면 태그처럼 보이는 입력도 HTML로 해석되지 않습니다.',
        }),
        choice('js-w25-d5-safe-dom-review-v3', 'DOM 텍스트 경계 복습', '사용자 댓글을 목록에 추가하는 코드에서 가장 안전한 기본 흐름은 무엇인가요?', [
          ['요소를 만든 다음 textContent를 설정하고 요소를 추가한다', '태그 문자열을 조립하지 않고 입력을 일반 문구로 둡니다.'],
          ['사용자 문자열을 li 태그 문자열 안에 연결해 innerHTML에 넣는다', '입력에 포함된 마크업이 HTML로 파싱될 수 있습니다.'],
          ['입력 길이를 줄인 뒤 innerHTML에 넣는다', '짧은 입력도 실행 가능한 마크업일 수 있어 길이 제한은 HTML 해석 문제를 해결하지 않습니다.'],
        ], 0, '요소와 문구를 별도로 다루는지 확인하세요.', '요소를 만든 뒤 textContent에 문구를 넣으면 문자열이 HTML로 해석되지 않습니다. 길이 제한은 파싱 경계를 바꾸지 않습니다.'),
        outputTrace('js-w25-d5-dom-trace-v3', '목록에 추가한 DOM 결과 추적', '다음 코드의 출력 세 값을 공백으로 구분해 적으세요.\n\nfunction appendPlainMessage(list, message) {\n  const item = document.createElement("li");\n  item.textContent = message;\n  list.append(item);\n  return item;\n}\nconst list = document.createElement("ul");\ndocument.body.append(list);\nconst item = appendPlainMessage(list, "<img>");\nconsole.log(item.tagName.toLowerCase(), item.textContent, list.children.length);', ['li <img> 1'], '실제 요소 이름, 보존된 textContent, 목록 안의 자식 수 순서입니다.', 'li 요소가 만들어지고 `<img>` 문자열은 textContent로 저장됩니다. ul에 항목 하나를 추가했으므로 출력은 `li <img> 1`입니다.'),
      ]),
    ],
  },
  26: {
    objective: '작은 학습 기능의 입력·결과 계약, 로딩·오류·빈 상태, 의미 있는 조작 요소와 회귀 검사를 하나의 흐름으로 통합합니다.',
    intro: '마지막 주는 요구사항을 코드와 검사 항목으로 연결합니다. 예제의 DOM factory는 의미 선택 자료를 확인하는 Node용 모형일 뿐, 실제 브라우저 키보드 접근성을 증명하지 않습니다. 브라우저 동작은 사이트 배포 전 직접 확인해야 합니다.',
    points: ['함수 계약에는 정상 입력, 빈 입력, 반환 구조, 실패 동작을 적습니다.', '요청 오류, 성공한 빈 목록, 성공한 데이터는 서로 다른 UI 상태입니다.', '이동에는 href가 있는 a, 현재 화면에서 동작을 실행하는 데는 button을 선택합니다.', '모형 테스트와 실제 브라우저 키보드·스크린리더 확인을 구분합니다.', '배포 전에는 정상·빈 값·오류·키보드 조작을 분리해 재검사합니다.'],
    overviewExample: 'const lessons = [{ completed: true }, { completed: false }];\nconst summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + Number(lesson.completed === true) }), { total: 0, completed: 0 });\nconsole.log(JSON.stringify(summary)); // {"total":2,"completed":1}',
    sessions: [
      studySession(1, '1일차 · 기능 입력과 반환 계약', '완료 수 요약 함수의 입력, 결과 필드, 빈 목록 동작을 먼저 고정합니다.', 'completed가 true인 항목만 완료로 셉니다. reduce에 초기 객체를 주어 빈 목록에서도 같은 반환 구조가 유지되는지 실행 출력으로 확인하세요.', 'function summarizeLessons(lessons) {\n  return lessons.reduce((summary, lesson) => ({\n    total: summary.total + 1,\n    completed: summary.completed + Number(lesson.completed === true),\n  }), { total: 0, completed: 0 });\n}\nconsole.log(JSON.stringify(summarizeLessons([]))); // {"total":0,"completed":0}', [
        choice('js-w26-d1-contract-v3', '빈 입력까지 포함하는 함수 계약', '학습 완료 요약 함수의 계약에 가장 먼저 포함할 조건은 무엇인가요?', [
          ['입력 배열과 total/completed 결과, 빈 배열의 반환값을 명시한다', '호출자가 정상 입력과 빈 입력에서 같은 결과 구조를 예측할 수 있습니다.'],
          ['함수 이름만 정하고 나머지는 호출자가 추측하게 한다', '반환 구조와 경계 동작이 정해지지 않아 호출자마다 다른 해석을 하게 됩니다.'],
          ['정상 데이터 한 건만 설명하고 빈 목록은 무시한다', '빈 배열은 실제로 가능한 입력이며 reduce 초기값이 없으면 별도 실패 경로가 생깁니다.'],
        ], 0, '정상 데이터 외에 입력이 비었을 때도 반환값이 안정적인지 생각하세요.', '계약은 입력, 반환 필드, 빈 목록을 모두 정해야 합니다. reduce의 초기 객체는 비어 있어도 total과 completed를 숫자로 반환하게 합니다.'),
        outputTrace('js-w26-d1-contract-trace-v3', '빈 요약 결과 추적', '다음 함수가 빈 배열에 대해 출력하는 JSON 문자열을 적으세요.\n\nfunction summarizeLessons(lessons) {\n  return lessons.reduce((summary, lesson) => ({\n    total: summary.total + 1,\n    completed: summary.completed + Number(lesson.completed === true),\n  }), { total: 0, completed: 0 });\n}\nconsole.log(JSON.stringify(summarizeLessons([]))); // {"total":0,"completed":0}', ['{"total":0,"completed":0}'], 'reduce의 초기 객체가 콜백 호출 전 결과로 반환됩니다.', '빈 배열에서는 콜백을 실행하지 않고 초기 객체를 그대로 반환합니다. JSON 문자열은 `{"total":0,"completed":0}`입니다.'),
        locateError('js-w26-d1-reduce-init-v3', '빈 배열에서 깨지는 누적식 찾기', '요약 함수는 빈 배열에도 total과 completed를 포함해 반환해야 합니다. 이 계약을 깨는 줄을 고르세요.', 'JavaScript', ['function summarize(items) {', '  return items.reduce((state, item) => ({', '    total: state.total + 1,', '    completed: state.completed + Number(item.completed === true),', '  }));', '}'], [5], 'reduce의 callback 뒤에 초기 누적 결과가 전달되는지 확인하세요.', '5번 줄은 callback만 닫고 reduce 호출을 끝내며 초기 객체를 전달하지 않습니다. 빈 배열이면 TypeError가 나므로 두 번째 인수로 { total: 0, completed: 0 }을 줘야 합니다.'),
      ]),
      studySession(2, '2일차 · 로딩·오류·빈 결과 구분', '요청 결과가 실패인지 성공한 빈 목록인지 구분해 화면 상태를 계산합니다.', '요청 실패를 빈 목록으로 위장하면 기존 데이터 삭제로 오해할 수 있습니다. 먼저 실패를 확인한 다음 성공한 목록의 길이에 따라 empty와 ready를 나눕니다.', 'function learningStatus(ok, lessons) {\n  if (!ok) return "error";\n  return lessons.length === 0 ? "empty" : "ready";\n}\nconsole.log(learningStatus(false, []), learningStatus(true, []), learningStatus(true, [{ id: "js" }])); // error empty ready', [
        choice('js-w26-d2-empty-v3', '실패와 빈 성공 구분', '서버에서 요청은 성공했지만 과정이 하나도 없을 때와 요청 자체가 실패했을 때 올바른 UI 처리는?', [
          ['성공한 빈 상태와 오류 상태를 분리해 각각 안내한다', '데이터 없음과 데이터를 가져오지 못함은 원인과 다음 행동이 다릅니다.'],
          ['둘 다 빈 배열만 보여 아무 설명도 하지 않는다', '사용자는 요청 실패인지 실제로 결과가 없는지 알 수 없습니다.'],
          ['실패도 성공한 빈 상태로 기록에 덮어쓴다', '오류를 숨기고 기존 데이터를 잃었다고 오해하게 만들 수 있습니다.'],
        ], 0, '사용자가 다시 시도해야 하는 상태와 결과가 정말 없는 상태를 구분하세요.', 'error와 empty는 같은 배열 모양을 가질 수 있지만 원인이 다릅니다. 오류에는 재시도를, 성공한 빈 상태에는 검색·추가 안내를 줄 수 있습니다.'),
        outputTrace('js-w26-d2-status-trace-v3', '세 요청 상태 계산', '다음 세 결과에서 순서대로 출력되는 상태를 공백으로 적으세요.\n\nfunction learningStatus(ok, lessons) {\n  if (!ok) return "error";\n  return lessons.length === 0 ? "empty" : "ready";\n}\nconsole.log(learningStatus(false, []), learningStatus(true, []), learningStatus(true, [{ id: "js" }])); // error empty ready', ['error empty ready'], 'ok가 거짓이면 목록 길이 검사보다 먼저 error를 반환합니다.', '요청 실패는 error, 성공하면서 길이가 0이면 empty, 항목이 있으면 ready입니다.'),
        locateError('js-w26-d2-status-order-v3', '오류를 빈 결과로 숨기는 조건 찾기', '실패 응답은 empty가 아니라 error여야 합니다. 오류 여부를 검사하기 전에 빈 결과를 반환하는 줄을 고르세요.', 'JavaScript', ['function learningStatus(ok, lessons) {', '  if (lessons.length === 0) return "empty";', '  if (!ok) return "error";', '  return "ready";', '}'], [2], 'ok가 false이고 lessons가 빈 배열이면 어느 분기가 먼저 실행되는지 추적하세요.', '2번 줄이 먼저 실행되어 실패 응답도 empty가 됩니다. 3번 줄은 올바른 오류 검사지만, 앞선 반환 때문에 해당 입력에서는 실행되지 않습니다.'),
      ]),
      studySession(3, '3일차 · 이동과 동작의 의미 있는 요소', '이동 링크와 현재 화면 동작을 의미에 맞는 HTML 요소로 고릅니다.', '앞에서 허용 목록으로 만든 내부 경로를 실제 a 요소의 href에 넣고 화면에 추가합니다. 링크는 브라우저의 기본 키보드 조작을 사용할 수 있습니다. 이 Node 검사는 요소 값을 확인하며 실제 Tab 키 동작까지 시험하지는 않습니다.', 'function coursePath(id) {\n  const allowed = new Set(["js"]);\n  return allowed.has(id) ? "#/lesson/" + id : "#/tracks";\n}\nfunction resumeLink(href) {\n  const link = document.createElement("a");\n  link.href = href;\n  link.textContent = "이어서 학습";\n  return link;\n}\nconst link = resumeLink(coursePath("js"));\ndocument.body.append(link);\nconsole.log(link.tagName.toLowerCase(), link.getAttribute("href"), link.textContent); // a #/lesson/js 이어서 학습', [
        choice('js-w26-d3-semantic-v3', '이동에 맞는 HTML 요소', '사용자가 누르면 다른 학습 경로로 이동하는 UI를 만들 때 의미에 맞는 요소는?', [
          ['목적지 href를 가진 a 요소', '링크 의미와 목적지가 HTML에 표현되어 브라우저 기본 키보드 조작을 사용할 수 있습니다.'],
          ['onClick만 있는 span 요소', '일반 span에는 링크 의미나 기본 키보드 초점·활성화가 없습니다.'],
          ['동작과 관계없이 tabIndex를 붙인 div 요소', '초점만 추가해도 링크의 목적지와 기본 활성화 의미가 생기지 않습니다.'],
        ], 0, '초점을 받을 수 있는지뿐 아니라 요소 자체가 이동 목적지를 전달하는지도 보세요.', '이동은 href를 가진 a가 의미에 맞습니다. 별도 동작을 실행하는 UI에는 button을 사용하며 일반 span에 클릭 처리만 붙이는 방식은 피합니다.'),
        outputTrace('js-w26-d3-link-trace-v3', '링크 계약 값 확인', '앞에서 배운 허용 목록으로 경로를 만든 뒤 링크를 구성합니다. 다음 코드가 만든 요소의 이름, href, 문구를 순서대로 적으세요.\n\nfunction coursePath(id) {\n  const allowed = new Set(["js"]);\n  return allowed.has(id) ? "#/lesson/" + id : "#/tracks";\n}\nfunction resumeLink(href) {\n  const link = document.createElement("a");\n  link.href = href;\n  link.textContent = "이어서 학습";\n  return link;\n}\nconst link = resumeLink(coursePath("js"));\ndocument.body.append(link);\nconsole.log(link.tagName.toLowerCase(), link.getAttribute("href"), link.textContent); // a #/lesson/js 이어서 학습', ['a #/lesson/js 이어서 학습'], '허용된 내부 경로를 만든 다음 실제 DOM 요소에 넣습니다.', 'js는 허용 목록에 있어 `#/lesson/js`가 만들어집니다. a 요소와 문구를 화면에 추가하므로 출력은 `a #/lesson/js 이어서 학습`입니다. 이 Node 검사는 실제 Tab 키 동작까지 시험하지 않습니다.'),
        locateError('js-w26-d3-span-navigation-v3', '탐색에 일반 span을 쓴 줄 찾기', '이어 학습은 다른 경로로 이동해야 합니다. 링크 의미와 기본 키보드 조작이 없는 줄을 고르세요.', 'JavaScript', ['function resumeTarget(href, open) {', '  return { tag: "a", href, label: "이어서 학습" };', '}', 'function brokenTarget(href, open) {', '  return { tag: "span", onClick: () => open(href) };', '}'], [5], '반환된 요소의 tag와 href 존재 여부를 확인하세요.', '5번 줄은 일반 span에 click 처리만 둡니다. 화면 이동에는 실제 href가 있는 a 요소를 사용해야 브라우저의 의미와 기본 키보드 동작을 활용할 수 있습니다.'),
      ]),
      studySession(4, '4일차 · 화면 상태 함수 수정', '요청 실패·성공 빈 목록·성공 목록을 빠짐없이 분기하는 함수를 구현합니다.', '목록 길이만 확인하면 실패 응답과 빈 성공 응답이 합쳐집니다. 실패를 먼저 반환한 뒤 성공한 목록만 empty와 ready로 나누세요.', 'function learningStatus(ok, lessons) {\n  if (!ok) return "error";\n  return lessons.length === 0 ? "empty" : "ready";\n}\nconsole.log([learningStatus(false, []), learningStatus(true, []), learningStatus(true, [{ id: "js" }])].join(",")); // error,empty,ready', [
        choice('js-w26-d4-state-matrix-v3', '상태 분기 순서 선택', '세 결과를 모두 맞게 분류하는 분기 순서는 무엇인가요?', [
          ['먼저 !ok를 error로 처리하고, 성공이면 길이로 empty/ready를 나눈다', '실패의 빈 응답이 empty로 잘못 분류되지 않게 실패 조건을 우선합니다.'],
          ['먼저 길이가 0인지 확인하고, 나중에 실패를 확인한다', '실패한 요청의 빈 자료가 오류 분기보다 먼저 empty로 반환됩니다.'],
          ['목록 길이만 검사하고 요청 상태는 버린다', '요청 실패인지 성공한 빈 결과인지 구별할 수 없습니다.'],
        ], 0, '입력 ok=false, lessons=[]를 먼저 대입해 어떤 반환값이 나오는지 비교하세요.', '상태는 실패 여부를 우선 확인하고, 성공한 결과에만 목록 길이 정책을 적용해야 합니다.'),
        locateError('js-w26-d4-status-cases-v3', '요청 실패를 ready로 보내는 줄 찾기', '실패 요청은 error여야 하고, 성공한 빈 배열만 empty여야 합니다. 이 계약을 깨는 줄을 고르세요.', 'JavaScript', ['function learningStatus(ok, lessons) {', '  if (!ok) return "ready";', '  if (lessons.length === 0) return "empty";', '  return "ready";', '}'], [2], '실패 여부를 반환값과 연결하는 문자열을 확인하세요.', '2번 줄은 요청이 실패해도 ready를 반환합니다. 사용자에게 실패를 숨기지 않도록 error를 반환해야 합니다.'),
        repairCode({
          id: 'js-w26-d4-status-repair-v3', title: '실패와 빈 상태 분리 구현', prompt: '아래 `learningStatus`를 고치세요. ok가 false면 "error", 성공한 빈 목록이면 "empty", 성공한 목록에 항목이 있으면 "ready"를 반환합니다. 정적 패턴 평가입니다.', language: 'JavaScript',
          starterCode: 'function learningStatus(ok, lessons) {\n  return lessons.length === 0 ? "empty" : "ready";\n}',
          solutionPatterns: ['^\\s*function\\s+learningStatus\\s*\\(\\s*ok\\s*,\\s*lessons\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*!ok\\s*\\)\\s*return\\s+"error"\\s*;?\\s*return\\s+lessons\\.length\\s*===\\s*0\\s*\\?\\s*"empty"\\s*:\\s*"ready"\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['실패를 error, 성공 빈 목록을 empty, 성공 데이터 목록을 ready로 분류한다.'], constraints: ['실패 여부를 먼저 검사한다.', 'ok와 lessons 매개변수 및 함수 이름을 유지한다.'], examples: [{ input: 'true, []', output: 'empty' }], tests: [{ input: 'false, []', expected: 'error' }, { input: 'true, [{id:"js"}]', expected: 'ready' }] },
          gradingNote: '전체 함수 정적 패턴 검사이며 UI 렌더링은 실행하지 않습니다.', hint: '먼저 실패를 분리하고, 남은 성공 경로에서 배열 길이를 확인하세요.', explanation: '요청 실패와 성공한 빈 목록은 서로 다른 사용자 상태입니다. 실패를 먼저 분기하면 오류가 empty 화면으로 숨지 않습니다.',
        }),
      ]),
      studySession(5, '5일차 · 작은 학습 화면 통합 회귀', '요청 상태와 완료 요약을 한 계약으로 반환하고 정상·빈 값·오류를 확인합니다.', '통합 함수는 상태와 요약을 함께 반환합니다. 실패해도 완료 수 자료구조는 같은 모양으로 두고 상태를 error로 표시합니다. 출력 예제를 따라간 뒤 실제 앱에서는 키보드 동작도 따로 확인해야 합니다.', 'function buildReport(ok, lessons) {\n  const summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + Number(lesson.completed === true) }), { total: 0, completed: 0 });\n  const status = !ok ? "error" : lessons.length === 0 ? "empty" : "ready";\n  return { status, summary };\n}\nconsole.log(JSON.stringify(buildReport(true, [{ completed: true }, { completed: false }]))); // {"status":"ready","summary":{"total":2,"completed":1}}', [
        outputTrace('js-w26-d5-report-trace-v3', '통합 보고서 출력 추적', '다음 입력에서 반환된 보고서의 JSON 문자열을 적으세요.\n\nfunction buildReport(ok, lessons) {\n  const summary = lessons.reduce((state, lesson) => ({ total: state.total + 1, completed: state.completed + Number(lesson.completed === true) }), { total: 0, completed: 0 });\n  const status = !ok ? "error" : lessons.length === 0 ? "empty" : "ready";\n  return { status, summary };\n}\nconsole.log(JSON.stringify(buildReport(true, [{ completed: true }, { completed: false }]))); // {"status":"ready","summary":{"total":2,"completed":1}}', ['{"status":"ready","summary":{"total":2,"completed":1}}'], '두 항목 가운데 completed가 true인 것은 하나입니다.', '요청은 성공했고 항목은 두 개이므로 상태는 ready입니다. 완료가 true인 항목은 하나라 summary는 total 2, completed 1입니다.'),
        choice('js-w26-d5-regression-matrix-v3', '배포 전 회귀 범위 선택', '이 작은 학습 화면을 배포 전에 다시 확인할 최소 범위는 무엇인가요?', [
          ['정상 데이터, 빈 성공 결과, 요청 오류, 키보드 이동', '각각 다른 상태 분기와 기본 입력 수단을 검사해 통합 흐름의 실패를 찾습니다.'],
          ['홈 화면 한 번만 마우스로 열어 본다', '빈 값과 오류 상태 및 키보드 접근 경로를 확인하지 못합니다.'],
          ['콘솔에 출력된 총 문항 수만 본다', '요청 분기와 화면 상호작용이 올바른지 검증하지 않습니다.'],
        ], 0, '정상 경로뿐 아니라 사용자가 만나는 경계 상태와 입력 방식도 포함하세요.', '회귀 묶음에는 정상, 빈 결과, 오류, 키보드 동작이 각각 들어가야 합니다. 모형 테스트는 브라우저 접근성 검사를 대신하지 않습니다.'),
        repairCode({
          id: 'js-w26-d5-build-report-repair-v3', title: '통합 상태 보고서 반환', prompt: '아래 `buildReport`를 고치세요. 요청 실패는 error, 성공한 빈 배열은 empty, 성공한 목록은 ready로 분류하고, 초기값이 있는 reduce로 total과 completed(true인 항목 수)를 반환합니다. 정적 패턴 평가입니다.', language: 'JavaScript',
          starterCode: 'function buildReport(ok, lessons) {\n  return { status: "ready", summary: {} };\n}',
          solutionPatterns: ['^\\s*function\\s+buildReport\\s*\\(\\s*ok\\s*,\\s*lessons\\s*\\)\\s*\\{\\s*const\\s+summary\\s*=\\s*lessons\\.reduce\\(\\s*\\(state\\s*,\\s*lesson\\)\\s*=>\\s*\\(\\s*\\{\\s*total:\\s*state\\.total\\s*\\+\\s*1\\s*,\\s*completed:\\s*state\\.completed\\s*\\+\\s*Number\\(lesson\\.completed\\s*===\\s*true\\)\\s*\\}\\s*\\)\\s*,\\s*\\{\\s*total:\\s*0\\s*,\\s*completed:\\s*0\\s*\\}\\s*\\)\\s*;\\s*const\\s+status\\s*=\\s*!ok\\s*\\?\\s*"error"\\s*:\\s*lessons\\.length\\s*===\\s*0\\s*\\?\\s*"empty"\\s*:\\s*"ready"\\s*;\\s*return\\s+\\{\\s*status\\s*,\\s*summary\\s*\\}\\s*;?\\s*\\}\\s*$'],
          acceptanceCriteria: { requirements: ['요청 상태와 빈 목록 상태를 함께 반환한다.', 'summary.total 전체 수와 summary.completed true인 수를 계산한다.'], constraints: ['reduce의 초기값은 { total: 0, completed: 0 }이다.', '기존 배열을 변경하지 않는다.'], examples: [{ input: 'true, [{completed:true},{completed:false}]', output: '{status:"ready",summary:{total:2,completed:1}}' }], tests: [{ input: 'true, []', expected: 'empty, total 0, completed 0' }, { input: 'false, []', expected: 'error, total 0, completed 0' }] },
          gradingNote: '전체 함수 정적 패턴 평가입니다. 자동 채점은 코드를 실행하지 않으며 acceptance 사례는 구현 검수 시 사용합니다.', hint: '먼저 초기값 있는 누적으로 요약을 만들고, ok와 배열 길이로 상태를 분리한 뒤 한 객체로 반환하세요.', explanation: '이 함수는 상태와 요약을 결합합니다. 빈 배열에도 초기값이 있으므로 결과 모양이 안정적이고, 오류·빈 성공·데이터 성공이 구분됩니다.',
        }),
      ]),
    ],
  },
};

const javascriptSecurityAndCapstoneAlternativePatterns = new Map([
  ['js-w25-d4-theme-storage-repair-v3', [
    String.raw`^\s*function\s+saveTheme\s*\(\s*storage\s*,\s*theme\s*\)\s*\{\s*if\s*\(\s*theme\s*!==\s*"light"\s*&&\s*theme\s*!==\s*"dark"\s*\)\s*return\s+false\s*;?\s*try\s*\{\s*storage\.setItem\(\s*"theme"\s*,\s*theme\s*\)\s*;?\s*return\s+true\s*;?\s*\}\s*catch\s*\(\s*error\s*\)\s*\{\s*return\s+false\s*;?\s*\}\s*\}\s*$`,
  ]],
  ['js-w25-d5-plain-dom-repair-v3', [
    String.raw`^\s*function\s+appendPlainMessage\s*\(\s*list\s*,\s*message\s*\)\s*\{\s*const\s+item\s*=\s*document\.createElement\(\s*'li'\s*\)\s*;?\s*item\.textContent\s*=\s*message\s*;?\s*list\.append\(item\)\s*;?\s*return\s+item\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+appendPlainMessage\s*\(\s*list\s*,\s*message\s*\)\s*\{\s*const\s+created\s*=\s*document\.createElement\(\s*"li"\s*\)\s*;?\s*created\.textContent\s*=\s*message\s*;?\s*list\.append\(created\)\s*;?\s*return\s+created\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+appendPlainMessage\s*\(\s*list\s*,\s*message\s*,\s*createElement\s*\)\s*\{\s*const\s+item\s*=\s*createElement\(\s*'li'\s*\)\s*;?\s*item\.textContent\s*=\s*message\s*;?\s*list\.append\(item\)\s*;?\s*return\s+item\s*;?\s*\}\s*$`,
    String.raw`^\s*function\s+appendPlainMessage\s*\(\s*list\s*,\s*message\s*,\s*createElement\s*\)\s*\{\s*const\s+created\s*=\s*createElement\(\s*"li"\s*\)\s*;?\s*created\.textContent\s*=\s*message\s*;?\s*list\.append\(created\)\s*;?\s*return\s+created\s*;?\s*\}\s*$`,
  ]],
  ['js-w26-d4-status-repair-v3', [
    String.raw`^\s*function\s+learningStatus\s*\(\s*ok\s*,\s*lessons\s*\)\s*\{\s*return\s*!ok\s*\?\s*"error"\s*:\s*\(\s*lessons\.length\s*===\s*0\s*\?\s*"empty"\s*:\s*"ready"\s*\)\s*;?\s*\}\s*$`,
  ]],
  ['js-w26-d5-build-report-repair-v3', [
    String.raw`^\s*function\s+buildReport\s*\(\s*ok\s*,\s*lessons\s*\)\s*\{\s*const\s+summary\s*=\s*lessons\.reduce\(\s*\(state\s*,\s*lesson\)\s*=>\s*\(\s*\{\s*total:\s*state\.total\s*\+\s*1\s*,\s*completed:\s*state\.completed\s*\+\s*\(\s*lesson\.completed\s*===\s*true\s*\?\s*1\s*:\s*0\s*\)\s*\}\s*\)\s*,\s*\{\s*total:\s*0\s*,\s*completed:\s*0\s*\}\s*\)\s*;\s*const\s+status\s*=\s*!ok\s*\?\s*"error"\s*:\s*lessons\.length\s*===\s*0\s*\?\s*"empty"\s*:\s*"ready"\s*;\s*return\s*\{\s*status\s*,\s*summary\s*\}\s*;?\s*\}\s*$`,
  ]],
]);

for (const week of Object.values(javascriptReviewedWeeks25To26)) {
  for (const session of week.sessions) {
    for (const exercise of session.exercises) {
      const alternatives = javascriptSecurityAndCapstoneAlternativePatterns.get(exercise.id);
      if (alternatives) exercise.solutionPatterns.push(...alternatives);
    }
  }
}
