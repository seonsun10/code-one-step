import { choice, locateError, outputTrace, repairCode, studySession } from './curriculum-tools.js';

const concept = (id, title, prompt, answer, distractors, hint, explanation) => choice(
  id,
  title,
  prompt,
  [[answer, explanation], ...distractors.map(([text, feedback]) => [text, feedback])],
  0,
  hint,
  explanation,
);

const trace = (id, title, code, answer, hint, explanation) => outputTrace(
  id,
  title,
  `아래 코드를 직접 추적해 결과를 입력하세요.\n\n${code}`,
  [answer],
  hint,
  explanation,
);

const repair = ({ id, title, starterCode, prompt, solutionPatterns, requirements, constraints, examples, tests, hint, explanation }) => repairCode({
  id,
  title: `${title} 함수 수정`,
  prompt: `${prompt}\n\n\`${starterCode}\``,
  language: 'Python',
  starterCode,
  solutionPatterns,
  acceptanceCriteria: { requirements, constraints, examples, tests },
  gradingNote: '실행 결과를 채점하는 문항은 아닙니다. 고정된 함수 구조를 검사하며, 아래 입력·기대 결과로 답을 직접 실행해 확인하세요. 제시한 풀이 구조를 지켜야 정답으로 인정됩니다.',
  hint,
  explanation,
});

const parseCountPattern = String.raw`^def\s+parse_count\s*\(\s*text\s*\)\s*:\s*\n[ \t]+try\s*:\s*\n[ \t]+return\s+int\s*\(\s*text\s*\)\s*\n[ \t]+except\s+ValueError\s*:\s*\n[ \t]+return\s+0\s*$`;

const atomicSavePattern = String.raw`^def\s+save_text_atomically\s*\(\s*path\s*,\s*text\s*\)\s*:\s*\n[ \t]+temporary_path\s*=\s*None\s*\n[ \t]+try\s*:\s*\n[ \t]+with\s+tempfile\.NamedTemporaryFile\s*\(\s*"w"\s*,\s*encoding\s*=\s*"utf-8"\s*,\s*dir\s*=\s*path\.parent\s*,\s*delete\s*=\s*False\s*\)\s+as\s+temporary\s*:\s*\n[ \t]+temporary_path\s*=\s*Path\s*\(\s*temporary\.name\s*\)\s*\n[ \t]+temporary\.write\s*\(\s*text\s*\)\s*\n[ \t]+os\.replace\s*\(\s*temporary_path\s*,\s*path\s*\)\s*\n[ \t]+except\s+OSError\s*:\s*\n[ \t]+if\s+temporary_path\s+is\s+not\s+None\s*:\s*\n[ \t]+temporary_path\.unlink\s*\(\s*missing_ok\s*=\s*True\s*\)\s*\n[ \t]+raise\s*$`;

const squaresGeneratorPattern = String.raw`^def\s+squares_until\s*\(\s*limit\s*\)\s*:\s*\n[ \t]+return\s*\(\s*number\s*\*\s*number\s+for\s+number\s+in\s+range\s*\(\s*limit\s*\)\s*\)\s*$`;
const squaresYieldPattern = String.raw`^def\s+squares_until\s*\(\s*limit\s*\)\s*:\s*\n[ \t]+for\s+number\s+in\s+range\s*\(\s*limit\s*\)\s*:\s*\n[ \t]+yield\s+number\s*\*\s*number\s*$`;

export const reviewedPythonWeeks7to9 = {
  7: {
    objective: '모듈의 이름 공간을 따라 기능을 가져오고, 예상한 입력 오류만 책임 있는 경계에서 처리해요.',
    intro: '기능을 모듈에 나누면 호출할 때 이름의 출처가 분명해집니다. 예외는 넓게 숨기지 말고 실제로 복구할 수 있는 범위에서 처리하며, 잡지 않은 예외는 호출한 경계까지 전달됩니다.',
    points: ['`import math`는 이름 `math`를 현재 이름 공간에 추가하므로 `math.sqrt(...)`처럼 호출해요.', '`except ValueError`는 변환할 수 없는 값만 처리하고 `TypeError` 같은 다른 오류는 숨기지 않아요.', '함수 내부에서 처리하지 않은 예외는 호출자 쪽으로 전파되어 더 적절한 경계에서 다룰 수 있어요.', '`finally`는 정상·예외 경로 모두에서 실행되며, 그 안의 `return`으로 원래 예외나 반환값을 덮어쓰면 안 돼요.', '수정 문제는 고정된 코드 형태를 확인하므로 안내된 입력 사례를 직접 실행해 결과도 확인해요.'],
    example: 'import math\n\nprint(math.isqrt(20))\nprint(math.sqrt(9))',
    sessions: [
      studySession(1, '모듈 이름으로 기능 사용', '가져온 모듈 이름과 모듈 안의 기능을 연결해 호출해요.', '모듈을 가져오면 그 모듈의 이름을 통해 기능을 찾습니다. 별칭을 지정했다면 원래 모듈 이름 대신 별칭을 사용하고, 함수 이름만 자동으로 현재 공간에 들어온다고 생각하지 마세요.', 'import math as maths\nprint(maths.isqrt(20))\nprint(maths.sqrt(9))', [
        concept('py-w07-d1-choice-v2', '별칭과 모듈 이름', '`import math as maths` 뒤에 제곱근 함수를 호출하는 방법은 무엇인가요?', '`maths.sqrt(9)`', [['`sqrt.maths(9)`', '모듈 이름을 함수 뒤에 붙이는 순서가 아닙니다.'], ['`math.sqrt(9)`', '가져온 모듈을 `maths`라는 별칭으로 부르기로 했으므로 이 코드에서는 별칭을 사용해야 합니다.']], 'import 줄에서 현재 코드에 생기는 이름이 `math`인지 `maths`인지 확인하세요.', '별칭을 지정한 import는 모듈을 `maths` 이름으로 참조하므로 `maths.sqrt(9)`를 호출합니다.'),
        trace('py-w07-d1-trace-v2', '정수 제곱근과 실수 제곱근', 'import math as maths\nprint(maths.isqrt(20))\nprint(maths.sqrt(9))', '4\n3.0', 'isqrt는 정수 제곱근, sqrt는 실수 결과를 주는 함수라는 점을 구분하세요.', '20의 정수 제곱근은 4이고, 9의 실수 제곱근은 3.0으로 출력됩니다.'),
      ]),
      studySession(2, '예상한 ValueError만 처리', '숫자로 바꿀 수 없는 문자열만 복구하고 다른 결함은 드러내요.', '예외 종류는 실패의 원인을 구분합니다. 입력 문자열을 정수로 바꿀 때의 `ValueError`는 기본값으로 복구할 수 있지만, 프로그래밍 오류나 잘못된 자료형까지 무조건 삼키면 원인을 찾기 어려워요.', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nprint(parse_count("12"), parse_count("three"))', [
        concept('py-w07-d2-choice-v2', '예외 범위를 좁히기', '정수 변환 실패만 0으로 바꾸고 나머지 오류는 호출자에게 알리려면 어떤 절이 맞나요?', '`except ValueError:`', [['`except:`', '모든 예외를 잡아 예상하지 못한 결함까지 조용히 감춥니다.'], ['`except Exception:`', 'ValueError보다 넓어 이 계약에 필요하지 않은 오류까지 처리합니다.']], '복구할 실패가 문자열을 정수로 바꾸지 못하는 한 종류인지 확인하세요.', '요구사항은 숫자 문자열 변환 실패만 다루므로 `ValueError`를 명시해야 합니다.'),
        trace('py-w07-d2-trace-v2', '유효·무효 숫자 입력', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nprint(parse_count("12"), parse_count("three"))', '12 0', '첫 입력은 변환에 성공하고, 둘째 입력만 ValueError 경로를 따릅니다.', '12는 정수로 반환되고, 변환할 수 없는 three는 ValueError가 처리되어 0이 됩니다.'),
      ]),
      studySession(3, '호출 경계와 예외 전파', '함수가 변환 오류를 복구하지 않을 때 호출자가 예외를 받는 흐름을 추적해요.', '함수가 특정 예외를 처리하지 않으면 호출이 실패한 채 호출 스택을 따라 전달됩니다. 입력을 받은 상위 경계가 오류를 사용자 메시지로 바꿀지, 다시 올릴지 결정할 수 있어요.', 'def parse_count(text):\n    return int(text)\n\ntry:\n    print(parse_count("three"))\nexcept ValueError as error:\n    print(type(error).__name__)', [
        concept('py-w07-d3-choice-v2', '처리되지 않은 변환 오류', '`parse_count`에 try/except가 없고 `int("three")`가 실패하면 호출자에서 관찰되는 것은 무엇인가요?', '`ValueError`가 호출한 위치까지 전달돼요.', [['함수가 자동으로 0을 반환해요.', '오류를 처리하거나 기본값을 반환하는 코드가 없으므로 자동 복구는 일어나지 않습니다.'], ['문자열이 그대로 정수인 척 반환돼요.', '`int` 변환이 실패하면 결과값 대신 예외가 발생합니다.']], '함수 내부에서 어떤 예외도 처리하지 않는지 확인하세요.', '변환 실패의 ValueError는 함수에서 처리되지 않아 호출자까지 전파됩니다.'),
        trace('py-w07-d3-trace-v2', '호출자에서 예외 이름 출력', 'def parse_count(text):\n    return int(text)\n\ntry:\n    print(parse_count("three"))\nexcept ValueError as error:\n    print(type(error).__name__)', 'ValueError', '호출 안에서 변환이 실패하고, 바깥 except가 예외 객체의 형식 이름을 출력합니다.', '호출자의 except가 ValueError를 받아 클래스 이름인 `ValueError`를 출력합니다.'),
      ]),
      studySession(4, 'finally 실행 순서', 'finally가 반환과 예외 뒤에서 실행되고 흐름을 덮어쓰지 않는지 확인해요.', 'finally는 성공·실패 여부와 관계없이 정리 코드를 실행합니다. 예외를 전달하기 전에 마지막으로 실행되지만, finally 안에서 return 하면 기존 반환값이나 예외를 가릴 수 있어요.', 'def parse_count(text):\n    try:\n        return int(text)\n    finally:\n        print("변환 시도 끝")\n\nprint(parse_count("8"))', [
        concept('py-w07-d4-choice-v2', 'finally와 반환 순서', '`parse_count("8")`에서 finally가 출력한 다음 반환되는 값은 무엇인가요?', '`8`이에요.', [['`None`이에요.', 'finally는 출력만 하고 return을 실행하지 않으므로 try의 반환값을 덮지 않습니다.'], ['`0`이에요.', '예외 복구 기본값을 계산하는 except 절이 없습니다.']], 'finally 안에 return이 있는지, try의 변환 결과가 유지되는지 살펴보세요.', 'finally가 정리 메시지를 출력한 뒤 try가 준비한 정수 8을 호출자에게 반환합니다.'),
        trace('py-w07-d4-trace-v2', 'finally와 함수 반환 출력', 'def parse_count(text):\n    try:\n        return int(text)\n    finally:\n        print("변환 시도 끝")\n\nprint(parse_count("8"))', '변환 시도 끝\n8', '함수 안 finally 출력이 먼저 실행된 뒤 바깥 print가 반환값을 출력합니다.', 'try의 return이 완료되기 직전에 finally 메시지가 나오고, 이어 반환된 8이 출력됩니다.'),
        locateError('py-w07-d4-locate-v2', 'finally가 결과를 덮는 줄', '정상 결과를 보존하면서 예외도 숨기지 않는 함수입니다. 반환값이나 예외를 덮어쓰는 줄을 고르세요.', 'Python', ['def parse_count(text):', '    try:', '        return int(text)', '    finally:', '        return 0'], [5], 'finally가 실행될 때 원래 return 또는 처리되지 않은 예외가 어떤 상태인지 보세요.', '5번 줄의 return이 정상적인 정수 결과를 0으로 덮고 변환 예외도 숨길 수 있습니다. finally에서는 정리 동작만 수행해야 합니다.'),
      ]),
      studySession(5, '입력 검증과 기본값', '문자열 숫자 형식 실패는 기본값으로 바꾸되 다른 자료형 오류는 그대로 드러내요.', '이 주에는 두 경계를 연결합니다. `ValueError`는 입력 형식의 실패로 정의된 기본값을 반환하고, 정수 변환 자체가 `TypeError`를 내면 기대하지 않은 호출이므로 그대로 전파합니다.', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nprint(parse_count("7"), parse_count("bad"))', [
        concept('py-w07-d5-choice-v2', '복구 가능한 입력 실패', '잘못된 숫자 문자열을 0으로 돌려주면서 의도치 않은 오류를 감추지 않는 구현은 무엇인가요?', '`try: int(text)` 뒤에서 `except ValueError:`만 처리해요.', [['모든 예외를 잡고 항상 0을 반환해요.', '넓은 예외 처리는 TypeError 같은 다른 결함도 숨깁니다.'], ['오류를 잡지 않고 모든 문자열을 0으로 취급해요.', '오류를 잡지 않는다면 잘못된 숫자 문자열의 ValueError가 호출자에게 전달됩니다.']], '실패 이유를 값 변환 불가 한 종류로 제한해 보세요.', 'ValueError만 처리하면 요구한 문자열 형식 실패는 복구하고 다른 예외는 호출자가 확인할 수 있습니다.'),
        trace('py-w07-d5-trace-v2', '변환 결과와 기본값', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nprint(parse_count("7"), parse_count("bad"))', '7 0', '첫 문자열의 정수 변환 결과와 두 번째 문자열의 ValueError 처리 결과를 구분하세요.', '7은 정수 7로 변환되고 bad는 ValueError가 처리되어 0이 출력됩니다.'),
        repair({
          id: 'py-w07-d5-repair-v2', title: '입력 검증과 기본값',
          starterCode: 'def parse_count(text):\n    try:\n        return int(text)\n    except:\n        return 0',
          prompt: '정수 문자열은 정수로 반환하고, 숫자 형식이 잘못되어 생긴 ValueError만 0으로 바꾸세요. 다른 예외는 처리하지 않아야 합니다.',
          solutionPatterns: [parseCountPattern],
          requirements: ['입력을 int로 변환해 반환해요.', 'ValueError만 처리해 0을 반환해요.'],
          constraints: ['bare except나 Exception으로 넓히지 않아요.', '출력하지 않고 값을 반환해요.'],
          examples: [{ input: '"12"', output: '12' }, { input: '"three"', output: '0' }],
          tests: [{ input: '"-4"', expected: '-4' }, { input: '""', expected: '0' }, { input: 'None', expected: 'TypeError가 전파됨' }],
          hint: 'except 뒤에 처리할 오류 이름을 정확히 적으세요. 변환이 TypeError를 낼 입력에서는 except 절이 실행되지 않아야 합니다.',
          explanation: '`int`가 문자열 숫자를 해석하지 못할 때의 ValueError만 기본값으로 바꿉니다. 다른 종류의 예외를 삼키지 않아 호출 계약과 디버깅 경계를 보존합니다.',
        }),
      ]),
    ],
  },
  8: {
    objective: '파일과 바이트 자원의 수명을 관리하고 텍스트 인코딩·줄 단위 읽기·임시 교체를 구분해요.',
    intro: '파일 작업에는 운영체제 자원과 인코딩이 함께 관여합니다. `with`로 수명을 제한하고, 텍스트와 바이트를 구분하고, 대체 저장이 제공하는 원자성의 범위도 확인합니다.',
    points: ['파일이나 스트림을 `with`로 열면 블록을 빠져나갈 때 예외 여부와 관계없이 닫혀요.', '텍스트를 쓸 때는 환경별 기본 인코딩에 기대지 말고 `encoding="utf-8"`을 명시해요.', '`read()`는 남은 내용을 한 번에 읽고, 파일 객체를 반복하면 한 줄씩 처리할 수 있어요.', '같은 디렉터리의 완성된 임시 파일을 `os.replace`로 바꾸면 POSIX에서는 이름 변경이 원자적이지만, 다른 파일시스템 간 이동과 내구성 보장까지 뜻하지는 않아요.', '이 과정의 수정 문항은 실행 채점이 아니므로 파일 생성·교체 실패 경계는 안내된 테스트로 따로 확인해요.'],
    example: 'from io import StringIO\n\nstream = StringIO("복습")\nwith stream as file:\n    print(file.read())\nprint(stream.closed)',
    sessions: [
      studySession(1, 'with 자원 수명', '컨텍스트 블록 안에서 읽고 블록 뒤 자원이 닫힌 상태를 확인해요.', '파일이나 메모리 스트림은 사용 뒤 정리해야 합니다. `with`는 정상 종료와 예외 종료 모두에서 정리를 실행하므로 닫는 코드를 잊을 위험을 줄여 줍니다.', 'from io import StringIO\n\nstream = StringIO("복습")\nwith stream as file:\n    print(file.read())\nprint(stream.closed)', [
        concept('py-w08-d1-choice-v2', '컨텍스트 블록 뒤 자원', '`with stream as file:` 블록을 벗어난 직후 `stream.closed` 값은 무엇인가요?', '`True`예요.', [['`False`예요.', '컨텍스트 관리자의 종료 처리가 블록을 벗어날 때 자원을 닫습니다.'], ['`None`이에요.', '`closed`는 닫힘 여부를 나타내는 Boolean 속성입니다.']], '블록을 정상 종료한 직후 실행되는 정리 동작을 떠올리세요.', 'StringIO도 컨텍스트 관리자로 사용할 수 있으며 블록 종료 뒤 닫혀 `closed`가 True가 됩니다.'),
        trace('py-w08-d1-trace-v2', '닫힘 전후 스트림 출력', 'from io import StringIO\n\nstream = StringIO("복습")\nwith stream as file:\n    print(file.read())\nprint(stream.closed)', '복습\nTrue', '블록 안에서 내용을 읽고, 다음 print는 블록이 끝난 뒤 실행됩니다.', '먼저 읽은 텍스트가 출력되고 컨텍스트 종료 후 스트림 닫힘 여부 True가 출력됩니다.'),
      ]),
      studySession(2, 'Path로 텍스트 읽기', 'Path 객체로 임시 폴더 안 파일을 만들고 UTF-8 텍스트를 읽어요.', '경로 조작을 문자열 덧셈으로 만들지 말고 `Path` 연산을 사용합니다. 텍스트 쓰기와 읽기 양쪽에서 인코딩을 명시하면 기본 인코딩이 다른 환경에서도 같은 텍스트가 유지됩니다.', 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "notes.txt"\n    path.write_text("복습", encoding="utf-8")\n    print(path.read_text(encoding="utf-8"))', [
        concept('py-w08-d2-choice-v2', '명시적 텍스트 인코딩', '경로 파일에 유니코드 텍스트를 저장하고 같은 텍스트로 읽는 조합은 무엇인가요?', '`write_text`와 `read_text` 모두에 `encoding="utf-8"`을 지정해요.', [['쓰기에서만 UTF-8을 지정하고 읽기는 기본값에 맡겨요.', '읽기 시스템의 기본 인코딩이 달라지면 해석 차이가 생길 수 있어 양쪽 모두 명시해야 합니다.'], ['Path에 `str()`을 적용한 뒤 `read()`를 호출해요.', '문자열 경로에는 파일 객체의 read 메서드가 없습니다. Path의 텍스트 API를 사용하세요.']], '텍스트를 파일 바이트로 바꾸는 쪽과 다시 문자로 해석하는 쪽을 각각 확인하세요.', '쓰기와 읽기가 같은 명시적 UTF-8 인코딩을 사용하면 환경의 기본 인코딩에 의존하지 않습니다.'),
        trace('py-w08-d2-trace-v2', 'Path로 저장한 유니코드 읽기', 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "notes.txt"\n    path.write_text("복습", encoding="utf-8")\n    print(path.read_text(encoding="utf-8"))', '복습', '임시 디렉터리 안 파일에 쓴 문자열과 읽어 출력한 문자열이 같습니다.', 'UTF-8로 저장한 텍스트를 같은 인코딩으로 읽으므로 `복습`이 출력됩니다.'),
      ]),
      studySession(3, '바이트와 UTF-8', '바이트 스트림에서 읽은 결과를 UTF-8로 명시적으로 문자열로 바꿔요.', '파일의 바이너리 모드는 `bytes`를 돌려주고 텍스트 인코딩 모드는 `str`을 다룹니다. 바이트를 사용자에게 보여 주는 텍스트로 사용할 때는 실제 인코딩을 알고 있어야 하며, 여기서는 UTF-8로 인코딩된 데이터를 같은 인코딩으로 디코딩합니다.', 'from io import BytesIO\n\nraw = "한글".encode("utf-8")\nwith BytesIO(raw) as file:\n    text = file.read().decode("utf-8")\nprint(text, type(raw).__name__)', [
        concept('py-w08-d3-choice-v2', 'bytes를 str로 디코딩', '`BytesIO.read()`가 반환한 UTF-8 바이트를 글자로 바꾸는 올바른 연산은 무엇인가요?', '`file.read().decode("utf-8")`', [['`file.read().encode("utf-8")`', 'read 결과는 이미 bytes이므로 encode가 아니라 bytes를 문자열로 해석하는 decode가 필요합니다.'], ['`str(file.read())`', '이 형태는 원래 한글이 아니라 bytes 표현을 포함한 문자열을 만들 수 있습니다.']], '현재 값은 bytes인지 str인지, 원하는 결과는 어느 자료형인지 확인하세요.', '바이트를 UTF-8 규칙으로 디코딩해야 원래 한글 문자열을 복원할 수 있습니다.'),
        trace('py-w08-d3-trace-v2', '인코딩·디코딩 자료형', 'from io import BytesIO\n\nraw = "한글".encode("utf-8")\nwith BytesIO(raw) as file:\n    text = file.read().decode("utf-8")\nprint(text, type(raw).__name__)', '한글 bytes', 'encode 이후 raw의 자료형 이름과, decode 이후 출력 문자열을 읽으세요.', 'raw는 bytes이고, decode한 text는 원래 한글 문자열이므로 `한글 bytes`가 출력됩니다.'),
      ]),
      studySession(4, '줄 단위 집계', '파일 전체를 문자열로 읽지 않고 한 줄씩 처리해 숫자 합계를 구해요.', '`file.read()`는 파일 전체를 문자열로 읽습니다. 큰 파일은 열린 파일 객체를 직접 반복해 한 줄씩 처리할 수 있어요. 이 예제는 임시 파일에 두 줄을 쓴 뒤 실제 파일을 순회합니다.', 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "scores.txt"\n    path.write_text("10\\n20\\n", encoding="utf-8")\n    with path.open(encoding="utf-8") as file:\n        total = 0\n        for line in file:\n            total += int(line)\nprint(total)', [
        concept('py-w08-d4-choice-v2', '파일을 한 줄씩 처리', '텍스트 전체를 추가 문자열로 읽지 않고 각 줄을 차례로 집계하려면 무엇을 반복하나요?', '파일 객체를 직접 반복해 각 `line`을 처리해요.', [['`file.read()` 결과 전체에 int를 적용해요.', '여러 줄 전체 문자열은 단일 정수로 변환할 수 없고 모든 줄을 한 번에 처리하려는 요구와도 다릅니다.'], ['`file.name` 문자열을 반복해요.', '파일 이름의 글자가 아니라 파일 객체가 제공하는 각 줄을 순회해야 합니다.']], '반복 대상이 파일 경로 문자열인지, 열린 파일 객체인지 확인하세요.', '텍스트 파일 객체를 반복하면 한 줄씩 얻어 변환과 집계를 이어갈 수 있습니다.'),
        trace('py-w08-d4-trace-v2', '줄별 숫자 누적', 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "scores.txt"\n    path.write_text("10\\n20\\n", encoding="utf-8")\n    with path.open(encoding="utf-8") as file:\n        total = 0\n        for line in file:\n            total += int(line)\nprint(total)', '30', '임시 파일에 쓴 두 줄을 파일 객체에서 하나씩 읽어 더합니다.', '10과 20을 차례대로 더하므로 최종 합계 30이 출력됩니다.'),
        locateError('py-w08-d4-locate-v2', '줄 단위 처리 대신 전체 읽기', '메모리 사용을 줄이기 위해 각 줄을 읽어 합하려고 합니다. 목적과 다른 줄을 고르세요.', 'Python', ['with open("scores.txt", encoding="utf-8") as file:', '    text = file.read()', '    total = sum(int(line) for line in text.splitlines())', '    print(total)'], [2], '`read()`가 전체 텍스트를 언제 메모리로 가져오는지 생각해 보세요.', '2번 줄은 전체 텍스트를 한 문자열로 읽습니다. 실제 파일 스트리밍이 목표라면 `for line in file:`로 열린 파일 객체를 직접 반복하세요. 마지막 줄은 계산한 합계가 예제 입력에서 30임을 확인하지만, 전체 파일을 메모리에 읽는 방식 문제를 해결하지는 않습니다.'),
      ]),
      studySession(5, '임시 파일 교체', '같은 디렉터리에 완성한 임시 파일을 두고 교체하되 실패하면 흔적을 정리해요.', '기존 내용을 직접 덮어쓰면 중간 쓰기 실패 때 파일이 부분적으로 남을 수 있습니다. 임시 파일을 같은 디렉터리에 완성한 뒤 `os.replace`로 교체하면 POSIX에서 성공한 이름 변경은 원자적입니다. 다른 파일시스템 간 교체와 전원 차단 후 내구성까지 보장한다는 뜻은 아니며, 이 패턴은 `Path.unlink(missing_ok=True)`를 사용해 Python 3.8 이상을 대상으로 합니다.', 'from pathlib import Path\nfrom tempfile import NamedTemporaryFile, TemporaryDirectory\nimport os\n\ndef save_text_atomically(path, text):\n    temporary_path = None\n    try:\n        with NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as temporary:\n            temporary_path = Path(temporary.name)\n            temporary.write(text)\n        os.replace(temporary_path, path)\n    except OSError:\n        if temporary_path is not None:\n            temporary_path.unlink(missing_ok=True)\n        raise\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "notes.txt"\n    path.write_text("이전", encoding="utf-8")\n    save_text_atomically(path, "완료")\n    print(path.read_text(encoding="utf-8"))', [
        concept('py-w08-d5-choice-v2', '임시 저장 위치와 교체 실패', '임시 파일 교체 실패 때 기존 파일과 임시 파일의 경계를 지키는 설명은 무엇인가요?', '목표 파일과 같은 디렉터리에 임시 파일을 만들고, 성공적으로 쓴 뒤 교체하며 실패 때 임시 파일을 정리하고 오류를 다시 올려요.', [['다른 디스크에 임시 파일을 만들고 교체 실패를 무시해요.', '파일시스템이 다르면 교체가 실패할 수 있고, 실패를 숨기면 저장되지 않은 상태를 정상처럼 보일 수 있습니다.'], ['목표 파일을 먼저 비운 뒤 내용을 나눠 써요.', '중간 쓰기 실패 때 이전 내용이 이미 없어져 복구할 수 없습니다.']], '임시 파일 위치, 교체 호출 시점, 실패 뒤 오류가 호출자에게 전달되는지를 모두 확인하세요.', '같은 디렉터리에서 새 내용을 완성한 후 교체하고, OSError 시 임시 파일을 정리한 뒤 오류를 다시 발생시켜야 실패를 숨기지 않습니다.'),
        trace('py-w08-d5-trace-v2', '기존 텍스트를 새 내용으로 교체', 'from pathlib import Path\nfrom tempfile import NamedTemporaryFile, TemporaryDirectory\nimport os\n\ndef save_text_atomically(path, text):\n    temporary_path = None\n    try:\n        with NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as temporary:\n            temporary_path = Path(temporary.name)\n            temporary.write(text)\n        os.replace(temporary_path, path)\n    except OSError:\n        if temporary_path is not None:\n            temporary_path.unlink(missing_ok=True)\n        raise\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "notes.txt"\n    path.write_text("이전", encoding="utf-8")\n    save_text_atomically(path, "완료")\n    print(path.read_text(encoding="utf-8"))', '완료', '임시 파일의 쓰기가 끝난 뒤 목표 경로를 교체하므로 마지막 read는 새 내용을 읽습니다.', '기존 파일을 새 임시 파일로 교체한 결과는 `완료`입니다.'),
        repair({
          id: 'py-w08-d5-repair-v2', title: '같은 디렉터리의 임시 파일 교체',
          starterCode: 'def save_text_atomically(path, text):\n    path.write_text(text, encoding="utf-8")',
          prompt: 'path는 pathlib.Path, text는 문자열입니다. 같은 디렉터리에 UTF-8 NamedTemporaryFile(delete=False)를 만들고 내용을 쓴 뒤 닫아 os.replace로 교체하세요. OSError가 나면 만든 임시 경로를 missing_ok=True로 정리한 뒤 예외를 다시 발생시키세요. 필요한 표준 라이브러리 이름 tempfile, Path, os는 이미 가져왔다고 가정합니다.',
          solutionPatterns: [atomicSavePattern],
          requirements: ['임시 파일은 목표와 같은 디렉터리에 둬요.', '파일을 닫은 뒤 os.replace로 경로를 교체해요.', '교체 실패 때 임시 파일을 지우고 OSError를 다시 발생시켜요.'],
          constraints: ['목표 파일의 내용을 직접 잘라 쓰지 않아요.', '교체 오류를 성공처럼 숨기지 않아요.'],
          examples: [{ input: '기존 파일 "old"에 "new" 저장', output: '파일에는 "new"가 남고 임시 파일은 없어야 함' }],
          tests: [{ input: '없는 목표 경로와 "한글"', expected: 'UTF-8 텍스트 파일 생성' }, { input: '기존 파일과 "new"', expected: '새 내용으로 교체' }, { input: 'os.replace가 OSError를 내도록 설정', expected: '기존 파일 유지, 임시 파일 제거, OSError 전파' }],
          hint: '임시 파일의 경로를 보관하고, 파일 컨텍스트를 벗어난 뒤 교체하세요. 예외 경로에서는 경로가 만들어졌을 때만 unlink하고, 다시 raise해야 합니다.',
          explanation: '교체가 성공하기 전까지 기존 경로는 그대로 남습니다. 같은 디렉터리의 별도 임시 파일을 닫은 뒤 `os.replace`하면 POSIX 이름 변경 원자성의 조건을 만족하고, 실패는 호출자가 알도록 다시 전파합니다. 이 보장은 교체 성공 시점의 이름 가시성에 한정되며 전원 손실 내구성을 뜻하지 않습니다.',
        }),
      ]),
    ],
  },
  9: {
    objective: '이터레이터 프로토콜, 일회성 제너레이터의 소진과 yield 재개를 추적하고 필요한 만큼만 지연 생성해요.',
    intro: '이터레이터는 다음 값을 요청할 때 상태를 한 단계 진행합니다. 제너레이터는 yield 지점에서 멈췄다가 다음 요청에 이어 실행되며, 한 번 끝까지 소비한 객체는 다시 사용할 수 없습니다.',
    points: ['`iter(container)`는 반복자를 만들고 `next(iterator)`가 다음 값 하나를 요청해요.', '제너레이터 객체는 한 번 소진되면 같은 객체의 다음 반복은 비어 있어요.', '`yield`는 값을 내보낸 뒤 함수 상태를 보존하고 다음 요청에서 다음 문장부터 재개해요.', '`itertools.islice`는 무한 이터레이터에서도 지정한 수만 소비하도록 경계를 둘 수 있어요.', '제너레이터 수정 문항은 실행 채점이 아닌 구조 검사이므로 소비·경계 사례를 직접 확인해요.'],
    example: 'from itertools import count, islice\n\nvalues = islice(count(10, 2), 3)\nprint(list(values))',
    sessions: [
      studySession(1, 'iter와 next', '반복 가능한 자료에서 반복자를 얻고 next로 한 값씩 꺼내요.', '리스트와 문자열 같은 반복 가능 객체에 `iter`를 적용하면 반복자가 만들어집니다. `next`는 현재 위치에서 다음 항목을 하나 반환하고 내부 위치를 전진시켜요.', 'items = iter([4, 7])\nprint(next(items))\nprint(next(items))', [
        concept('py-w09-d1-choice-v2', '반복자에서 한 항목 요청', '`items = iter([4, 7])` 이후 첫 `next(items)`가 돌려주는 값은 무엇인가요?', '`4`예요.', [['`7`예요.', '7은 두 번째 위치의 값이며 한 번 next한 뒤 요청해야 합니다.'], ['`[4, 7]` 목록 전체예요.', '`next`는 반복자의 다음 항목 하나만 반환합니다.']], '`iter`가 만든 반복자의 첫 현재 위치를 확인하세요.', '반복자는 첫 원소 4부터 시작하므로 처음 호출한 `next`는 4를 반환합니다.'),
        trace('py-w09-d1-trace-v2', '두 번의 next 결과', 'items = iter([4, 7])\nprint(next(items))\nprint(next(items))', '4\n7', '각 next 호출 뒤 반복자 위치가 한 칸 앞으로 이동합니다.', '첫 호출은 4, 두 번째 호출은 다음 항목인 7을 출력합니다.'),
      ]),
      studySession(2, '제너레이터 한 번 소진', '같은 제너레이터를 다시 반복할 때 새 값이 나오지 않는 이유를 설명해요.', '제너레이터 함수 호출은 결과 목록이 아니라 진행 상태를 가진 이터레이터를 돌려줍니다. 첫 반복에서 끝까지 소비했다면 같은 객체의 상태는 종료된 상태이므로 두 번째 반복은 비어 있어요.', 'numbers = (number * number for number in range(3))\nprint(list(numbers))\nprint(list(numbers))', [
        concept('py-w09-d2-choice-v2', '소진된 객체 다시 반복', '같은 generator 객체를 `list`로 두 번 소비한 뒤 두 번째 결과는 무엇인가요?', '`[]`예요.', [['`[0, 1, 4]`예요.', '새 제너레이터를 만들지 않고 이미 소진한 같은 객체를 다시 소비하고 있습니다.'], ['`StopIteration`이 list 호출 밖으로 나와요.', 'list 생성자는 반복 종료의 StopIteration을 정상적으로 처리하고 빈 목록을 돌려줍니다.']], '두 번째 호출이 새 generator 표현식을 만드는지 같은 변수 `numbers`를 쓰는지 확인하세요.', '첫 list 호출에서 모든 값을 소비하므로 같은 객체의 두 번째 결과는 빈 목록입니다.'),
        trace('py-w09-d2-trace-v2', '제너레이터 소비 상태', 'numbers = (number * number for number in range(3))\nprint(list(numbers))\nprint(list(numbers))', '[0, 1, 4]\n[]', '첫 list 호출이 몇 개 값을 소비했는지와 같은 iterator가 남았는지 보세요.', '첫 호출은 세 값을 소비하고, 소진된 반복자의 두 번째 목록은 비어 있습니다.'),
      ]),
      studySession(3, 'yield와 재개', 'yield에서 멈춘 뒤 다음 next 요청에 함수가 이어서 실행되는 순서를 추적해요.', '제너레이터 함수는 호출 즉시 본문을 전부 실행하지 않습니다. `next`마다 다음 yield까지 실행한 뒤 멈추며, 지역 변수와 실행 위치를 기억해 다음 요청에서 계속 진행합니다.', 'def steps():\n    yield "시작"\n    yield "계속"\n\nitems = steps()\nprint(next(items))\nprint(next(items))', [
        concept('py-w09-d3-choice-v2', 'yield 뒤 함수 상태', '`next(items)`가 첫 yield 값을 반환한 뒤 다음 호출은 어디서 재개되나요?', '첫 yield 다음 문장부터 실행해요.', [['제너레이터 함수를 처음부터 다시 실행해요.', '일반 함수와 달리 제너레이터는 실행 위치와 지역 상태를 기억합니다.'], ['함수를 종료하고 항상 None을 반환해요.', '아직 다음 yield가 남아 있으므로 다음 호출은 함수 실행을 계속합니다.']], '첫 next가 이미 소비한 yield와 아직 실행되지 않은 yield를 순서대로 표시하세요.', '제너레이터는 yield 지점에서 멈춰 상태를 유지하고 다음 호출 때 그 다음 문장부터 재개합니다.'),
        trace('py-w09-d3-trace-v2', '두 yield 값 추적', 'def steps():\n    yield "시작"\n    yield "계속"\n\nitems = steps()\nprint(next(items))\nprint(next(items))', '시작\n계속', '첫 next와 두 번째 next가 각각 만나는 yield 문자열을 확인하세요.', '첫 호출은 시작, 다음 호출은 이어 실행된 뒤 계속을 출력합니다.'),
      ]),
      studySession(4, 'itertools로 범위 제한', '무한 카운터에서 필요한 항목 수만 잘라 목록으로 확인해요.', '`itertools.count`처럼 끝이 없는 반복자도 있습니다. 무한 입력은 무심코 list로 모두 만들면 끝나지 않으므로 `islice`의 stop 경계로 소비량을 제한합니다.', 'from itertools import count, islice\n\nvalues = islice(count(10, 2), 3)\nprint(list(values))', [
        concept('py-w09-d4-choice-v2', '무한 이터레이터 제한', '`count(10, 2)`에서 첫 세 값만 소비하는 호출은 무엇인가요?', '`islice(count(10, 2), 3)`', [['`list(count(10, 2))`', '`count`는 무한히 값을 만들기 때문에 list가 끝나지 않습니다.'], ['`islice(count(10, 2), None)`', 'stop을 None으로 지정하면 입력이 끝날 때까지 진행하지만 count에는 끝이 없습니다.']], '입력 반복자가 끝이 있는지, islice의 stop 값이 몇 개인지 확인하세요.', 'stop 3을 준 islice는 처음 세 값만 내놓고 종료합니다.'),
        trace('py-w09-d4-trace-v2', '제한된 count 결과', 'from itertools import count, islice\n\nvalues = islice(count(10, 2), 3)\nprint(list(values))', '[10, 12, 14]', '시작값 10에서 간격 2인 수를 세 개만 읽으세요.', '세 항목은 10, 12, 14이며 stop 경계에서 소비가 멈춥니다.'),
        locateError('py-w09-d4-locate-v2', '무한 입력에서 종료 없는 수집', '카운터에서 세 값만 수집하려고 합니다. 종료 조건이 없어 프로그램이 끝나지 않는 줄을 고르세요.', 'Python', ['from itertools import count', 'values = list(count(10, 2))', 'print(values[:3])'], [2], '슬라이스가 실행되기 전에 list가 무한 입력을 모두 소비할 수 있는지 생각하세요.', '2번 줄이 무한 count를 끝까지 list로 소비하므로 다음 줄에 도달하지 못합니다. 생성 단계에서 islice로 소비량을 제한하세요.'),
      ]),
      studySession(5, '필요한 값만 지연 생성', '제곱값을 한꺼번에 목록으로 만들지 않고 generator로 차례로 전달해요.', '제너레이터 함수의 yield 루프와 제너레이터 표현식은 결과를 필요할 때 계산합니다. 소비자가 요청한 값까지만 진행하므로 메모리를 아낄 수 있지만, 다시 보려면 새 제너레이터를 만들어야 합니다.', 'def squares_until(limit):\n    for number in range(limit):\n        yield number * number\n\nprint(list(squares_until(4)))', [
        concept('py-w09-d5-choice-v2', '지연 계산과 재사용 계약', '제너레이터에서 값을 세 번 소비한 뒤 다시 처음부터 필요하다면 무엇을 해야 하나요?', '새 제너레이터를 만들거나 앞에서 목록으로 보관해야 해요.', [['같은 제너레이터를 다시 처음부터 반복해요.', '한 번 소진한 제너레이터는 종료 상태라 새 값을 내놓지 않습니다.'], ['`next`를 더 많이 호출해 첫 값으로 돌아가요.', '`next`는 앞으로만 진행하며 반복자를 초기화하지 않습니다.']], '상태를 기억하는 단일 반복자에 되감기 동작이 있는지 확인하세요.', '제너레이터는 일회성 반복자입니다. 재사용하려면 다시 생성하거나 결과를 저장하는 선택이 필요합니다.'),
        trace('py-w09-d5-trace-v2', '제곱 제너레이터의 값', 'def squares_until(limit):\n    for number in range(limit):\n        yield number * number\n\nprint(list(squares_until(4)))', '[0, 1, 4, 9]', 'range(4)의 0, 1, 2, 3을 각각 제곱한 결과를 순서대로 모으세요.', '각 값의 제곱을 yield하므로 0, 1, 4, 9가 차례로 만들어집니다.'),
        repair({
          id: 'py-w09-d5-repair-v2', title: '필요한 값만 지연 생성',
          starterCode: 'def squares_until(limit):\n    return [number * number for number in range(limit)]',
          prompt: 'range(limit)의 각 정수를 제곱한 값을 미리 목록으로 만들지 않고 지연 생성하세요. 제너레이터 표현식 또는 yield가 있는 for문을 사용할 수 있습니다. 음수와 0의 범위는 비어 있어야 합니다.',
          solutionPatterns: [squaresGeneratorPattern, squaresYieldPattern],
          requirements: ['각 값의 제곱을 순서대로 생성해요.', '함수 호출 때 전체 결과 목록을 미리 만들지 않아요.'],
          constraints: ['입력 limit은 정수예요.', '출력하지 않고 반복 가능한 generator를 돌려줘요.'],
          examples: [{ input: '4', output: '[0, 1, 4, 9] (list로 소비)' }],
          tests: [{ input: '0', expected: '소비 결과 []' }, { input: '-2', expected: '소비 결과 []' }, { input: '3', expected: '소비 결과 [0, 1, 4]' }, { input: '생성 결과를 두 번 소비', expected: '첫 소비만 값을 내고 같은 iterator의 두 번째 소비는 []' }],
          hint: '괄호 안의 generator expression은 각 항목을 요청할 때 계산합니다. 또는 for문 본문에서 값을 하나씩 yield하세요.',
          explanation: 'generator expression과 yield 함수는 범위를 한 번에 목록으로 만들지 않습니다. range가 비면 생성할 항목이 없고, 객체는 한 번 소비하면 소진됩니다.',
        }),
      ]),
    ],
  },
};
