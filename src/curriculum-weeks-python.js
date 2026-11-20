import { choice, locateError, outputTrace, repairCode, studySession, weeklyLesson } from './curriculum-tools.js';
import { reviewedPythonFoundationWeeks } from './curriculum-expansion-python-reviewed.js';

// The first twelve entries extend the public G10 lessons.  Their original IDs
// and three questions remain in curriculum-expansion-python.js; this file only
// contributes the other twelve questions needed to turn each into a week.
const legacyIds = [
  'py-variables', 'py-conditions', 'py-loops', 'py-functions', 'py-lists', 'py-dictionaries',
  'py-modules-errors', 'py-files-context', 'py-iterators-generators', 'py-classes-types',
  'py-async-concurrency', 'py-data-capstone',
];

const phases = [
  { id: 'py-phase-1', number: 1, title: '기초 문법과 읽기', weeks: [1, 2, 3, 4], objective: '값, 분기, 반복, 함수를 읽고 작은 계산을 작성해요.' },
  { id: 'py-phase-2', number: 2, title: '자료구조와 입력 경계', weeks: [5, 6, 7, 8], objective: '목록과 딕셔너리를 선택하고 파일·예외를 안전하게 다뤄요.' },
  { id: 'py-phase-3', number: 3, title: '표현력 있는 Python', weeks: [9, 10, 11, 12], objective: '이터레이터, 객체, 타입 힌트와 비동기 흐름을 연결해요.' },
  { id: 'py-phase-4', number: 4, title: '표준 라이브러리와 설계', weeks: [13, 14, 15, 16], objective: '텍스트, 날짜, 경로, 데이터 모델을 작은 프로그램에 적용해요.' },
  { id: 'py-phase-5', number: 5, title: '품질과 문제 해결', weeks: [17, 18, 19, 20, 21], objective: '테스트, 디버깅, 복잡도, API 경계와 동시성을 점검해요.' },
  { id: 'py-phase-6', number: 6, title: '통합 프로젝트 연습', weeks: [22, 23, 24, 25, 26], objective: '파일 기반 도구를 설계하고 리뷰하며 다음 학습 계획을 세워요.' },
];

const weekTitles = [
  '값·표현식과 변수', '조건과 비교', '반복과 누적', '함수와 반환값', '리스트와 평균·변환', '딕셔너리와 집합으로 데이터 검증',
  '모듈·예외와 입력', '파일·경로와 자원', '이터레이터·제너레이터', '클래스와 데이터 모델', '타입 힌트와 비동기', '데이터 요약 미니 프로젝트',
  '문자열과 정규식 기초', '날짜·시간과 JSON', '경로·환경 설정', '데이터클래스와 불변성', '테스트와 경계값', '디버깅과 로깅',
  '알고리즘·복잡도', 'HTTP와 API 데이터', '동시성 선택과 취소', 'CLI 학습 기록 도구', '저장 형식과 오류 복구', '리팩터링과 코드 리뷰',
  '작은 프로젝트 설계', '통합 프로젝트와 회고',
];

const weekObjectives = [
  '값의 자료형과 대입이 만드는 상태를 설명해요.', '참·거짓 조건을 읽고 분기 누락을 찾아요.', '반복 범위와 누적값을 추적해요.', '입력과 반환값이 분명한 함수를 만들어요.',
  '평균·인덱싱·정렬과 복사 경계를 통해 순서 있는 데이터를 안전하게 다뤄요.', '딕셔너리와 집합으로 필수 키, 누락값, 중첩 데이터를 검증해요.', '모듈을 가져오고 예상 가능한 입력 실패만 처리해요.', '파일과 경로 자원을 예외가 나도 정리해요.',
  '값을 필요할 때 하나씩 만드는 흐름을 설명해요.', '상태와 동작을 클래스로 묶고 비교 규칙을 정해요.', '타입 힌트의 약속과 await의 경계를 구분해요.', '작은 기록 목록을 검증하고 요약해요.',
  '문자열을 정규화하고 패턴 탐색 결과를 해석해요.', '시간대와 직렬화 형식을 구분해 데이터를 보존해요.', '운영체제 경로 차이를 pathlib로 줄여요.', '데이터 클래스로 명확한 값 객체를 만들어요.',
  '작은 단위 테스트로 정상·경계·실패 입력을 나눠요.', '재현 가능한 로그와 예외 정보를 이용해 원인을 좁혀요.', '자료구조 선택과 시간 복잡도를 근거로 설명해요.', 'HTTP 응답 상태와 JSON 경계를 분리해 처리해요.',
  '작업 성격에 맞춰 asyncio·스레드·프로세스를 구분해요.', '명령행 인자와 파일 입력을 갖춘 도구를 구성해요.', '저장 전 검증과 손상된 입력 복구 정책을 정해요.', '중복을 줄이되 읽기 쉬운 함수 경계를 유지해요.',
  '요구사항을 데이터·기능·실패 조건으로 나눠 설계해요.', '작은 프로젝트를 검토하고 다음 학습을 측정 가능한 계획으로 정리해요.',
];

const advancedWeeklyIntros = [
  '문자열의 공백과 구분자를 정리하고 정규식 결과에서 필요한 값을 찾아요.',
  '날짜와 시간대를 구분해 표현하고, JSON으로 옮길 때 데이터 형식을 보존해요.',
  'pathlib로 경로와 디렉터리를 다루고 환경 설정의 기본값을 안전하게 정해요.',
  '데이터클래스의 자동 생성 기능을 살펴보고 인스턴스별 기본값과 불변 값 객체를 구분해요.',
  '테스트에서 정상·경계 입력과 예상한 예외 사례를 나누고, 고친 버그를 다시 잡을 검사 기준을 남겨요.',
  '오류를 다시 만들 정보를 기록하고 로그·호출 경로·예외 원인으로 실패 지점을 좁혀요.',
  '자료구조와 반복 횟수로 작업량을 살펴보고 측정 결과가 적용되는 조건을 구분해요.',
  'HTTP 응답 상태와 시간 제한, JSON, 데이터 검증, 공개 오류 메시지를 API 계약에 맞춰 다뤄요.',
  '작업을 취소·대기·계산·공유 데이터로 나눠 비동기·스레드·프로세스 중 알맞은 방식을 골라요.',
  '명령행 도구에서 입력을 받고 오류를 안내해 적절한 종료 코드로 끝내요.',
  '저장할 데이터와 버전을 검증하고 임시 파일과 복구 결과 보고로 손상에 대비해요.',
  '함수의 책임을 나누고 중복을 줄여 변경 범위를 좁혀요. 작은 함수로 바꾼 뒤에도 입력·출력 계약이 유지되는지 리뷰해요.',
  '요구사항을 데이터·기능·실패 조건으로 나누고 구현 전에 확인할 사례를 정해요.',
  '완료 기준과 회귀 사례로 프로젝트를 검토하고 측정 가능한 다음 4주 계획을 세워요.',
];

// Five daily concepts per week.  Each item is deliberately a separate study
// conversation rather than a long flat question list: read -> trace -> find a
// defect -> apply the idea.
const daily = [
  ['대입과 재대입', '문자열 값과 자료형', '정수 몫과 나머지', '문자열에 변수 값 넣기 (f-string)', '입력값을 정수로 바꾸기'],
  ['AND로 조건 범위 확인', 'if·else 들여쓰기', 'if·elif·else 분기', '빈 값의 참거짓', '가드 절로 입력 먼저 거르기'],
  ['리스트 전체를 순회하기', 'range의 시작과 끝 경계', 'for 반복으로 합계 누적하기', 'while 반복을 끝내기', '조건으로 새 목록 만들기'],
  ['매개변수와 반환값', '기본·키워드 인자', 'return과 None', '스코프와 지역 이름', '작은 함수로 책임 나누기'],
  ['평균과 빈 목록', '인덱스와 슬라이스', 'append·extend와 새 목록', '정렬 결과와 원본', '얕은 복사와 조건으로 새 목록 만들기'],
  ['키로 값 찾기', 'get으로 기본값 지정', '키 존재와 기본값 구분', 'items로 키와 값 순회', '중첩 데이터와 필수 키'],
  ['모듈 이름으로 기능 사용', '예상한 ValueError만 처리', '호출 경계와 예외 전파', 'finally 실행 순서', '입력 검증과 기본값'],
  ['with 자원 수명', 'Path로 텍스트 읽기', '바이트와 UTF-8', '줄 단위 집계', '임시 파일 교체'],
  ['iter와 next', '제너레이터 한 번 소진', 'yield와 재개', 'itertools로 범위 제한', '필요한 값만 지연 생성'],
  ['__init__', '인스턴스와 클래스 속성', '메서드와 반환 타입', '__repr__', '상속보다 조합'],
  ['타입 힌트 읽기', 'Optional 경계', 'async def', 'await와 gather', 'CPU 작업 분리'],
  ['입력 형태 확인', '필터와 집계', '정렬 기준', '빈 데이터', '완료율 반환'],
  ['strip·split', 'f-string', '정규식 검색', '정규식 그룹', '패턴 과용 피하기'],
  ['date와 datetime', 'timezone 인식 값', 'isoformat', 'json dump/load', '직렬화 오류'],
  ['Path 결합', '존재 여부', '디렉터리 만들기', '환경 변수', '설정 기본값'],
  ['@dataclass', 'default_factory', 'frozen', '값 비교', '도메인 값 객체'],
  ['assert 기대값', '경계값', '예외 테스트', 'fixture 역할', '회귀 테스트'],
  ['재현 단계', 'logging 레벨', '스택 트레이스', '예외 체이닝', '최소 수정'],
  ['list와 set', 'dict 조회', '정렬 비용', '이중 반복', '측정과 가정'],
  ['상태 코드', 'timeout', 'JSON 파싱', '응답 검증', '오류 메시지'],
  ['코루틴 취소', 'gather 예외', '스레드 I/O', '프로세스 CPU', '공유 상태'],
  ['argparse', '표준 입출력', '명확한 종료 코드', '작은 명령', '사용법 오류'],
  ['JSON 스키마 감각', '임시 파일', '누락 필드', '백업', '복구 보고'],
  ['함수 이름', '중복 제거', '의존성 주입', '작은 리뷰', '읽기 순서'],
  ['요구사항 분해', '데이터 모델', '실패 조건', '수동 시나리오', '배포 전 점검'],
  ['완료 기준', '회귀 점검', '성능 가정', '문서화', '다음 4주 계획'],
];

const difficultyFor = (week) => (week <= 4 ? '입문' : week <= 8 ? '기초' : week <= 16 ? '중급' : week <= 21 ? '고급' : '실전');
const phaseFor = (week) => phases.find((phase) => phase.weeks.includes(week));

const advancedDailyExamples = {
  13: [['text = "  python,java  "\nprint(text.strip().split(","))', "['python', 'java']"], ['name = "Mina"\nprint(f"Hi, {name}")', 'Hi, Mina'], ['import re\nprint(bool(re.search(r"\\d+", "v2")))', 'True'], ['import re\nprint(re.search(r"(\\w+)-(\\d+)", "py-3").group(2))', '3'], ['slug = "python-course-17"\nprint(slug.split("-")[-1])', '17']],
  14: [['from datetime import date\nprint(date(2026, 1, 2).year)', '2026'], ['from datetime import datetime, timezone\nprint(datetime(2026, 1, 2, tzinfo=timezone.utc).tzinfo is not None)', 'True'], ['from datetime import datetime, timezone\nprint(datetime(2026, 1, 2, tzinfo=timezone.utc).isoformat())', '2026-01-02T00:00:00+00:00'], ['import json\nprint(json.loads("{\\"done\\": true}")["done"])', 'True'], ['from datetime import datetime, timezone\nimport json\nvalue = datetime(2026, 1, 2, tzinfo=timezone.utc)\nprint(json.dumps({"at": value.isoformat()}))', '{"at": "2026-01-02T00:00:00+00:00"}']],
  15: [['from pathlib import Path\nprint((Path("data") / "notes.txt").as_posix())', 'data/notes.txt'], ['from pathlib import Path\nfrom tempfile import TemporaryDirectory\nwith TemporaryDirectory() as folder:\n    candidate = Path(folder) / "missing.txt"\n    print(candidate.exists())', 'False'], ['from pathlib import Path\nfrom tempfile import TemporaryDirectory\nwith TemporaryDirectory() as folder:\n    logs = Path(folder) / "logs"\n    logs.mkdir()\n    logs.mkdir(exist_ok=True)\n    print("ready")', 'ready'], ['import os\nprint(os.getenv("STUDY_MODE", "local"))', 'local'], ['def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10\nprint(read_limit({}))', '10']],
  16: [
    ['from dataclasses import dataclass\n@dataclass\nclass Course: title: str\nprint(Course("Python").title)', 'Python'],
    ['from dataclasses import dataclass, field\n@dataclass\nclass Course: tags: list = field(default_factory=list)\nfirst = Course()\nsecond = Course()\nfirst.tags.append("Python")\nprint(first.tags, second.tags)', "['Python'] []"],
    ['from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Code: value: str\nprint(Code("py").value)', 'py'],
    ['from dataclasses import dataclass\n@dataclass\nclass Code: value: str\nprint(Code("py") == Code("py"))', 'True'],
    ['from dataclasses import dataclass\n@dataclass(frozen=True)\nclass CourseId: value: int\nprint(CourseId(1))', 'CourseId(value=1)'],
  ],
  17: [['def double(value): return value * 2\nassert double(3) == 6\nprint("ok")', 'ok'], ['def first(items): return items[0] if items else None\nprint(first([]))', 'None'], ['import unittest\nwith unittest.TestCase().assertRaises(ValueError):\n    int("bad")\nprint("expected")', 'expected'], ['def make_record():\n    return {"done": False}\nfirst_test = make_record()\nsecond_test = make_record()\nfirst_test["done"] = True\nprint(second_test["done"])', 'False'], ['def total(values): return sum(values)\nassert total([]) == 0\nprint(total([1, 2]))', '3']],
  18: [['raw = b"\\xff"\ntry:\n    raw.decode("utf-8")\nexcept UnicodeDecodeError as error:\n    report = {"input": repr(raw), "environment": "UTF-8", "action": "decode bytes", "expected": "Python", "actual": type(error).__name__}\nprint(report["actual"])', 'UnicodeDecodeError'], ['import logging\nlogging.warning("missing record")\nprint("warning")', 'warning'], ['import traceback\ndef calculate():\n    return 1 / 0\ntry:\n    calculate()\nexcept ZeroDivisionError as error:\n    print(traceback.extract_tb(error.__traceback__)[-1].name)', 'calculate'], ['def parse_minutes(raw):\n    try:\n        return int(raw)\n    except ValueError as error:\n        raise ValueError("minutes must be an integer") from error\ntry:\n    parse_minutes("x")\nexcept ValueError as error:\n    print(type(error.__cause__).__name__)', 'ValueError'], ['def normalize(name):\n    if name is None:\n        return ""\n    return name.strip()\nprint(repr(normalize(None)))', "''"]],
  19: [['values = ["py", "js", "py"]\nseen = set()\nunique = []\nfor value in values:\n    if value not in seen:\n        seen.add(value)\n        unique.append(value)\nprint(unique)', "['py', 'js']"], ['minutes = {"py": 40}\nprint(minutes.get("java", 0))', '0'], ['print(sorted([3, 1, 2]))', '[1, 2, 3]'], ['count = 0\nfor left in [1, 2]:\n    for right in [10, 20]:\n        count += 1\nprint(count)', '4'], ['import timeit\nelapsed = timeit.timeit("7 in values", setup="values = list(range(10))", number=100)\nprint(type(elapsed).__name__)', 'float']],
  20: [['status = 201\nprint(200 <= status < 300)', 'True'], ['class DemoClient:\n    def get(self, path, *, timeout):\n        return {"path": path, "timeout": timeout}\nresult = DemoClient().get("/courses", timeout=2)\nprint(result["timeout"])', '2'], ['import json\nprint(json.loads("{\\"count\\": 2}")["count"])', '2'], ['payload = {"items": []}\nitems = payload.get("items")\nprint(isinstance(items, list) and all(isinstance(item, dict) for item in items))', 'True'], ['def public_error(status):\n    if status == 400:\n        message = "입력값을 확인해 주세요."\n    elif status >= 500:\n        message = "잠시 후 다시 시도해 주세요."\n    else:\n        message = "요청을 처리할 수 없습니다."\n    return {"status": status, "message": message}\nprint(public_error(500)["message"])', '잠시 후 다시 시도해 주세요.']],
  21: [['import asyncio\nasync def worker(events):\n    try:\n        await asyncio.sleep(1)\n    except asyncio.CancelledError:\n        events.append("cleanup")\n        raise\nasync def main():\n    events = []\n    task = asyncio.create_task(worker(events))\n    await asyncio.sleep(0)\n    task.cancel()\n    try:\n        await task\n    except asyncio.CancelledError:\n        print(",".join(events + ["cancelled"]))\nasyncio.run(main())', 'cleanup,cancelled'], ['import asyncio\nasync def ok():\n    return "ok"\nasync def fail():\n    raise ValueError("missing")\nasync def collect():\n    return await asyncio.gather(ok(), fail(), return_exceptions=True)\nresults = asyncio.run(collect())\nprint(type(results[1]).__name__)', 'ValueError'], ['from concurrent.futures import ThreadPoolExecutor\nfrom time import sleep\ndef simulated_read(key):\n    sleep(0.01)  # blocking I/O 대기를 모형화\n    return f"{key}=ready"\nwith ThreadPoolExecutor(max_workers=2) as pool:\n    results = list(pool.map(simulated_read, ["a", "b"]))\nprint(", ".join(results))', 'a=ready, b=ready'], ['from concurrent.futures import ProcessPoolExecutor\ndef square(number):\n    return number * number\ndef main():\n    with ProcessPoolExecutor(max_workers=2) as pool:\n        print(list(pool.map(square, [2, 3])))\nif __name__ == "__main__":\n    main()', '[4, 9]'], ['from concurrent.futures import ThreadPoolExecutor\nfrom threading import Lock\ncounter = 0\nlock = Lock()\ndef increment_many(_):\n    global counter\n    for _ in range(100):\n        with lock:\n            counter += 1\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    list(pool.map(increment_many, range(4)))\nprint(counter)', '400']],
  22: [['import argparse\nparser = argparse.ArgumentParser(prog="study")\nparser.add_argument("--file", required=True, help="읽을 JSON 파일")\nargs = parser.parse_args(["--file", "notes.json"])\nprint(args.file)', 'notes.json'], ['import io\nimport sys\nfrom contextlib import redirect_stderr, redirect_stdout\nstdout = io.StringIO()\nstderr = io.StringIO()\nwith redirect_stdout(stdout), redirect_stderr(stderr):\n    print("record")\n    print("invalid input", file=sys.stderr)\nprint(f"stdout={stdout.getvalue().strip()}, stderr={stderr.getvalue().strip()}")', 'stdout=record, stderr=invalid input'], ['valid = False\nif not valid:\n    raise SystemExit(2)', '2'], ['def show_summary(records):\n    return f"records={len(records)}"\nprint(show_summary([{"id": 1}, {"id": 2}]))', 'records=2'], ['import argparse\nimport io\nfrom contextlib import redirect_stderr\nparser = argparse.ArgumentParser(prog="study")\nparser.add_argument("--file", required=True, help="읽을 JSON 파일")\nerrors = io.StringIO()\nwith redirect_stderr(errors):\n    try:\n        parser.parse_args([])\n    except SystemExit as error:\n        exit_code = error.code\nhelp_available = "--file" in parser.format_help()\nrequired = "--file" in errors.getvalue()\nprint(f"help={help_available}, exit={exit_code}, required={required}")', 'help=True, exit=2, required=True']],
  23: [['record = {"title": "Python", "minutes": 40}\nminutes = record.get("minutes")\nvalid = isinstance(record.get("title"), str) and bool(record["title"].strip()) and isinstance(minutes, int) and not isinstance(minutes, bool) and minutes >= 0\nprint(valid)', 'True'], ['import json\nimport os\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nwith TemporaryDirectory() as folder:\n    target = Path(folder) / "notes.json"\n    temporary = target.with_suffix(".json.tmp")\n    temporary.write_text(json.dumps({"records": [{"title": "Python"}]}), encoding="utf-8")\n    os.replace(temporary, target)\n    saved = json.loads(target.read_text(encoding="utf-8"))\n    print(saved["records"])', "[{'title': 'Python'}]"], ['record = {"title": "Py"}\nminutes = record.get("minutes")\nvalid = isinstance(record.get("title"), str) and isinstance(minutes, int) and not isinstance(minutes, bool) and minutes >= 0\nprint(valid)', 'False'], ['backup = {"version": 1, "records": []}\nversion = backup.get("version")\nvalid = isinstance(version, int) and not isinstance(version, bool) and version == 1 and isinstance(backup.get("records"), list)\nprint(valid)', 'True'], ['def recovery_report(records=None, error=None):\n    if error is not None:\n        return f"recovery=failed; reason={type(error).__name__}"\n    return f"recovery=success; count={len(records)}"\nprint(recovery_report(["py", "js"]))\nprint(recovery_report(error=OSError("disk unavailable")))', 'recovery=success; count=2\nrecovery=failed; reason=OSError']],
  24: [['def format_title(title): return title.strip().title()\nprint(format_title("python"))', 'Python'], ['items = ["py", "js", "py"]\nunique = list(dict.fromkeys(items))\nprint(unique)', "['py', 'js']"], ['def save(record, writer): return writer(record)\nprint(save({"id": 1}, lambda record: "saved"))', 'saved'], ['status = "done"\nresult = "pending"\nif status == "done":\n    result = "complete"\nif status == "done":\n    result = "retry"\nprint(result)', 'retry'], ['def save_course(record, writer):\n    title = record.get("title")\n    if not isinstance(title, str) or not title.strip():\n        return "invalid"\n    return writer(record)\nprint(save_course({"title": "Python"}, lambda record: "saved"))', 'saved']],
  25: [
    ['requirements = {"input": "백업 JSON", "output": "검증된 학습 기록", "failure": "지원하지 않는 버전 거부"}\nsteps = ["읽기", "검증", "적용"]\nprint(" -> ".join(steps))', '읽기 -> 검증 -> 적용'],
    ['record = {"title": "Python", "minutes": 40}\nvalid = isinstance(record.get("title"), str) and bool(record["title"].strip()) and isinstance(record.get("minutes"), int) and not isinstance(record.get("minutes"), bool) and record["minutes"] >= 0\nprint(valid)', 'True'],
    ['def load_backup(reader):\n    try:\n        return {"ok": True, "records": reader()}\n    except OSError:\n        return {"ok": False, "error": "read_failed"}\ndef unavailable():\n    raise OSError("disk unavailable")\nresult = load_backup(unavailable)\nprint(f"ok={result[\'ok\']}; error={result[\'error\']}")', 'ok=False; error=read_failed'],
    ['def valid_backup(payload):\n    if not isinstance(payload, dict):\n        return False\n    version = payload.get("version")\n    return isinstance(version, int) and not isinstance(version, bool) and version == 1 and isinstance(payload.get("records"), list)\ncases = [({"version": 1, "records": []}, True), ({"version": 2, "records": []}, False), ({"version": 1}, False), ({"version": True, "records": []}, False)]\npassed = sum(valid_backup(payload) == expected for payload, expected in cases)\nprint(f"{passed}/{len(cases)} scenarios passed")', '4/4 scenarios passed'],
    ['checks = {"tests": True, "backup_restore": False, "help": True}\nfailed = [name for name, passed in checks.items() if not passed]\nprint(f"ready={not failed}; failed={\',\'.join(failed)}")', 'ready=False; failed=backup_restore'],
  ],

  26: [
    ['required = ["examples", "questions", "backup"]\npassed = {"examples": True, "questions": True, "backup": False}\ncomplete = all(passed.get(name) is True for name in required)\nprint(complete)', 'False'],
    ['def total_minutes(records):\n    return sum(record.get("minutes", 0) for record in records)\ncases = [([{"minutes": 3}], 3), ([], 0), ([{}, {"minutes": 2}], 2)]\npassed = sum(total_minutes(records) == expected for records, expected in cases)\nprint(f"{passed}/{len(cases)} passed")', '3/3 passed'],
    ['import timeit\nvalues = list(range(100, 0, -1))\nelapsed = timeit.timeit(lambda: sorted(values), number=100)\nprint(f"items={len(values)}; runs=100; result={type(elapsed).__name__}")', 'items=100; runs=100; result=float'],
    ['import argparse\nparser = argparse.ArgumentParser(prog="study")\nparser.add_argument("--backup", required=True, metavar="PATH", help="백업 JSON 경로")\nhelp_text = parser.format_help()\nprint("--backup" in help_text and "PATH" in help_text)', 'True'],
    ['next_weeks = [{"week": 1, "topic": "저장 형식", "next_action": "지원 버전 검사 복습", "success": "지원하지 않는 버전을 거부"}, {"week": 2, "topic": "복구", "next_action": "임시 파일 교체 복습", "success": "저장 중 실패해도 원본 보존"}, {"week": 3, "topic": "회귀 검사", "next_action": "빈 입력 사례 복습", "success": "빈 입력 회귀 사례 통과"}, {"week": 4, "topic": "출시 점검", "next_action": "출시 확인표 복습", "success": "실패한 검사 모두 보고"}]\ncriteria = all(item["topic"] and item["next_action"] and item["success"] for item in next_weeks)\nprint(f"weeks={len(next_weeks)}; topics={len(next_weeks)}; criteria={criteria}")', 'weeks=4; topics=4; criteria=True'],
  ],
};

const advancedDailyLearningNotes = {
  13: [
    ['`strip()`은 양끝 공백만 지우고 `split()`은 구분자 사이를 나눠 새 문자열 목록을 만들어요.', '문자열은 불변이라 원본은 그대로입니다. 쉼표 뒤 항목에도 공백을 없애려면 각 조각에 `strip()`을 따로 적용해야 해요.'],
    ['f-string은 문자열을 만들 때 중괄호 안 표현식을 평가해 값을 삽입해요.', '앞의 `f`가 빠지면 `{name}`은 그대로 문자로 남습니다. 표현식은 문자열 안에서 왼쪽부터 읽으면 됩니다.'],
    ['`re.search()`는 문자열 어디에서든 첫 일치를 찾고, 못 찾으면 `None`을 반환해요.', '검색 결과가 항상 있다고 가정하지 말고 `if match is not None:`처럼 `group()` 호출 전에 확인하세요.'],
    ['정규식의 `group(0)`은 전체 일치이고 괄호로 만든 첫 그룹부터 1번이에요.', '두 괄호가 있으므로 `group(1)`은 py, `group(2)`는 3입니다. 없는 그룹 번호를 호출하면 IndexError가 납니다.'],
    ['고정된 구분자 뒤의 조각을 얻는 데는 `split()`이 정규식보다 간단해요.', '예제 입력에는 하이픈으로 나뉜 비어 있지 않은 접미사가 있다고 가정합니다. `split("-")[-1]`은 숫자 여부까지 검증하지 않아요.'],
  ],
  14: [
    ['`date`는 달력 날짜, `datetime`은 날짜와 시각을 함께 표현해요.', '달력에 없는 날짜는 객체를 만들 때 ValueError가 납니다. 월별 일수와 윤년 경계를 별도 입력으로 확인하세요.'],
    ['시간대 인식 datetime은 실제 UTC 오프셋을 통해 시각 기준을 정해요.', '`tzinfo`만 설정됐다고 항상 시간대 인식인 것은 아닙니다. `utcoffset()`이 None이 아닌지도 Python의 인식 판정에 필요해요.'],
    ['`datetime.isoformat()`은 객체를 ISO 8601 형식 문자열로 만들고 오프셋도 포함해요.', '메서드는 괄호를 붙여 호출해야 결과 문자열이 나옵니다. 시간대가 없는 datetime은 오프셋을 포함하지 않아요.'],
    ['`json.loads()`는 문법이 유효한 JSON 문자열을 Python 값으로 변환해요.', 'JSON의 참·거짓 표기는 소문자 `true`·`false`입니다. Python dict를 읽는 함수가 아니며, 잘못된 JSON은 JSONDecodeError를 냅니다.'],
    ['기본 `json.dumps()`는 datetime을 자동 변환하지 않으므로 문자열 표현을 먼저 정해야 해요.', '`isoformat()` 문자열로 저장하면 JSON은 유효하지만 다시 읽어도 값은 문자열입니다. datetime으로 복원하려면 별도 파싱이 필요해요.'],
  ],
  15: [
    ['`Path`의 `/` 연산자는 운영체제에 맞춰 경로 조각을 결합해요.', '`as_posix()`는 화면·교재용 경로 표기를 `/`로 정규화합니다. 실제 파일 접근 경로를 문자열로 직접 붙이는 동작은 아닙니다.'],
    ['`Path.exists()`는 확인 시점에 경로가 있는지 Boolean으로 알려 줘요.', '확인과 실제 열기 사이에 파일 상태가 바뀔 수 있으므로, 파일 작업은 `FileNotFoundError` 등도 처리해야 합니다.'],
    ['이미 있는 디렉터리에 다시 `mkdir()`을 호출하려면 `exist_ok=True`가 필요해요.', '`exist_ok=True`는 대상이 디렉터리일 때만 기존 경로 오류를 억제합니다. 없는 부모까지 만들려면 `parents=True`도 필요해요.'],
    ['`os.getenv()`는 환경 변수가 없을 때 기본값을 돌려주지만 소스 코드의 비밀값은 보호하지 못해요.', '변수가 설정되어 빈 문자열을 가진 경우에는 기본값 대신 빈 문자열이 반환됩니다. 배포 환경에서 필요한 값과 기본값 정책을 확인하세요.'],
    ['예제의 계약에서는 LIMIT가 없거나 None일 때만 기본값 10을 쓰고, 0은 그대로 변환해요.', '`or 10`은 유효한 0도 기본값으로 바꾸므로 피해야 합니다. 문자열이 정수가 아니면 ValueError가 발생한다는 입력 경계도 확인하세요.'],
  ],
  16: [
    ['`@dataclass`는 필드 선언을 바탕으로 생성자와 객체 표현을 자동으로 만들어요.', '`@dataclass`가 어떤 메서드를 자동으로 만드는지, 생성자의 인자가 필드에 어떻게 들어가는지 확인하세요. 타입 표시는 실행 중 자동 형식 검사가 아니에요.'],
    ['`default_factory`는 인스턴스마다 새 목록을 만들어요.', '가변 목록 기본값을 클래스 정의 때 하나만 만들면 객체끼리 공유할 수 있습니다. 각 객체에서 목록을 바꿔 다른 객체의 값이 그대로인지 비교하세요.'],
    ['`frozen=True`는 생성 뒤 필드에 다시 값을 대입하지 못하게 해요.', '객체를 처음 만들 때 값을 넣는 것과 이후 속성을 바꾸는 것은 다른 동작입니다. 필드 재대입이 `FrozenInstanceError`로 막히는지 확인하세요.'],
    ['데이터 클래스의 `==`는 같은 클래스에서 필드 값이 같은지 비교해요.', '값 비교와 객체 동일성은 다릅니다. 값 동등성은 `==`, 객체 동일성은 `is`로 각각 확인하세요.'],
    ['값 객체는 원시 값에 도메인의 의미와 입력 규칙을 붙여요.', '`CourseId`에 값을 넣는 것과 값이 유효한지 검사하는 책임을 구분하세요. 데이터베이스 저장은 값 객체의 역할이 아닙니다.'],
  ],
  17: [
    ['`assert`는 조건이 거짓일 때 `AssertionError`를 내고, 참이면 다음 줄로 진행해요.', 'assert는 테스트의 예상 결과를 확인하는 용도입니다. 사용자 입력 검증에 쓰면 안 돼요. 최적화 옵션 `-O`로 실행할 때 assert 문은 제거됩니다.'],
    ['빈 목록처럼 정상 입력과 다른 경계 입력에는 함수가 돌려줄 값을 정해야 해요.', '예제의 `first([])`는 `None`을 돌려줍니다. 빈 입력에서 `None`, 예외, 기본값 중 무엇을 택할지는 함수 계약과 호출자에 맞춰 정하세요.'],
    ['`assertRaises(ValueError)`는 지정한 코드에서 기대한 예외가 발생하는지 확인해요.', '예외를 넓게 잡아 테스트를 통과시키지 말고, 잘못된 입력이 실제로 ValueError를 내는지 확인하세요.'],
    ['테스트용 데이터 만드는 함수를 두면 테스트마다 새 dict를 받을 수 있어요.', '이 예제의 `make_record()`는 호출마다 새 dict를 돌려주는 도우미 함수입니다. pytest의 `@pytest.fixture` 기능을 사용하는 코드는 아니며, 테스트 사이에 가변 데이터를 공유하지 않는 방법을 보여 줍니다.'],
    ['회귀 테스트는 고쳤던 문제가 다시 생기는지 확인하도록 사례를 남겨요.', '`sum([])`는 0입니다. 빈 목록을 넣었을 때도 0이 나오는 테스트를 보존하면 합계 함수가 바뀐 뒤 같은 오류가 돌아왔는지 확인할 수 있어요.'],
  ],
  18: [
    ['재현 기록에는 입력, 실행 환경, 조작 순서, 예상 결과와 실제 결과가 필요해요.', '잘못된 UTF-8 바이트를 실제로 문자열로 바꾸려다 생긴 UnicodeDecodeError를 잡아 입력과 결과를 함께 기록합니다. 같은 입력으로 오류를 다시 확인할 수 있어요.'],
    ['로그 수준은 상황의 심각도에 맞춰 DEBUG, INFO, WARNING, ERROR를 골라요.', '예제에서 logging은 경고를 기본 stderr로 보내고 print는 stdout으로 보냅니다. 화면 출력과 로그 메시지가 다른 통로라는 점을 확인하세요.'],
    ['traceback의 프레임을 따라가면 예외가 어느 함수 호출에서 발생했는지 찾을 수 있어요.', '예제는 호출 목록의 함수 이름을 살펴봅니다. 실제 진단에서는 입력과 앞선 호출도 확인하고, 민감한 값이 담긴 전체 추적 정보를 사용자에게 그대로 보여 주지 마세요.'],
    ['예외를 다른 종류로 바꿔 전달할 때 `raise ... from error`로 원래 원인을 보존할 수 있어요.', '`int("x")`가 낸 ValueError를 설명이 담긴 새 ValueError로 연결합니다. 처리하는 쪽은 새 오류를 받고 `__cause__`에서 원래 오류도 확인할 수 있어요.'],
    ['필요한 입력 경계만 고치면 기존 문자열의 대소문자와 공백 처리 규칙을 보존할 수 있어요.', '`None`만 먼저 처리하고 나머지 값에는 `strip()`을 적용합니다. 이 함수는 대소문자까지 바꾸지 않습니다.'],
  ],
  19: [
    ['중복 값을 지우면서 set으로 확인하고 결과 목록으로 첫 등장 순서를 보존해요.', '같은 값이 다시 나오면 seen에 있는지 확인하고 건너뜁니다. 집합은 포함 확인에, 목록은 결과 순서 보존에 씁니다.'],
    ['dict.get은 키가 없을 때 기본값을 돌려주며 저장된 0과 구분해야 해요.', '기본값 0은 누락 키에만 적용됩니다. 실제 값이 0일 때와 키가 없을 때를 별도 사례로 확인하세요.'],
    ['sorted는 새 목록을 만들어 정렬하므로 입력을 바꾸지 않고 필요한 위치에서만 호출해요.', '정렬은 입력 크기에 따라 비용이 증가합니다. 반복문 안에서 같은 목록을 다시 정렬하지 말고 결과를 재사용하세요.'],
    ['중첩 반복의 작업 횟수는 바깥·안쪽 순회 횟수의 곱으로 셀 수 있어요.', '예제의 바깥 2회와 안쪽 2회가 만들어 내는 조합을 직접 세어 보세요. 큰 입력에서는 작업량이 곱으로 늘어납니다.'],
    ['timeit은 지정한 입력·반복 횟수·환경에서 실행 시간을 측정해요.', '측정값은 실행 환경과 입력에 따라 달라집니다. 예제는 시간 숫자를 정답으로 고정하지 않고 반환 형식만 확인합니다.'],
  ],
  20: [
    ['HTTP 2xx 응답은 성공 범위지만 요청별 의미와 응답 본문은 별도로 확인해요.', '201은 생성 성공 상태의 예입니다. 단일 200만 성공으로 보는 대신 API 계약에 맞는 상태 범위를 확인하세요.'],
    ['요청 제한 시간은 클라이언트 호출에 전달해야 하며 예제용 클라이언트는 네트워크를 보내지 않아요.', '모형 클라이언트가 받은 timeout 인자를 출력합니다. 실제 네트워크 대기나 클라이언트 라이브러리 동작을 검증한 예제는 아닙니다.'],
    ['json.loads는 JSON 텍스트를 Python 값으로 바꾸지만 형식 오류를 낼 수 있어요.', '문자열을 파싱한 뒤 필요한 키와 자료형을 별도로 확인하세요. JSON 문법이 맞는 것과 API 계약이 맞는 것은 다릅니다.'],
    ['응답 검증은 필요한 필드의 자료형과 내부 항목 구조까지 확인해요.', '빈 목록은 유효할 수 있습니다. 목록인지 먼저 확인하고 각 원소가 요구된 객체인지 검사하세요.'],
    ['공개 오류는 사용자가 고칠 안내만 남기고 비밀번호·토큰·스택 세부사항은 감춰야 해요.', '상태별로 안전한 메시지를 고정해 반환합니다. 내부 진단을 사용자 응답에 그대로 복사하지 마세요.'],
  ],
  21: [
    ['CancelledError는 취소 신호이며 정리 후 다시 올려 취소 상태를 보존해야 해요.', 'Task를 취소하면 대기 중 코루틴의 정리 코드가 실행되고, 취소 예외를 다시 올리면 호출자도 취소를 확인할 수 있습니다.'],
    ['gather(..., return_exceptions=True)는 결과 목록에 예외 객체를 넣으므로 각 결과를 구분해야 해요.', '성공값과 예외 객체가 같은 결과 목록에 올 수 있습니다. 코드는 실패 항목을 자동으로 다시 던진다고 가정하지 마세요.'],
    ['스레드 풀은 네트워크 응답처럼 기다리는 I/O 작업을 겹칠 때 쓸 수 있어요.', 'sleep은 실제 I/O가 아니라 대기를 흉내 내는 모형입니다. map은 입력 순서대로 결과를 모으므로 출력 순서가 일정합니다.'],
    ['프로세스 풀은 CPU 계산을 분리할 때 쓰며 작업 함수는 프로세스 사이에서 전달 가능해야 해요.', '함수는 모듈 최상위에 두고 실행 코드는 `__main__` 가드 안에 둬야 Windows의 자식 프로세스에서도 안전하게 가져올 수 있어요. 아주 작은 작업은 프로세스 시작·데이터 전달 비용이 계산보다 클 수 있으므로 이 예제만으로 속도가 빨라졌다고 결론 내리면 안 됩니다.'],
    ['공유 상태의 읽기·수정·쓰기를 하나의 잠금 범위로 보호해요.', '각 작업이 100회씩 4개 스레드에서 증가시키므로 잠금 아래 기대 합계는 400입니다. 잠금은 코드가 공유 상태를 실제로 다룰 때만 필요합니다.'],
  ],
  22: [
    ['argparse에 옵션의 이름·필수 여부·도움말을 등록하고 parse_args 결과에서 값을 읽어요.', '고정된 인자 목록을 주면 예제는 실제 터미널 입력 대신 `--file notes.json`을 결정적으로 파싱합니다.'],
    ['stdout에는 정상 결과를, stderr에는 진단을 보내 자동화가 둘을 분리해 읽게 해요.', 'StringIO로 두 출력을 안전하게 포착한 뒤 각 스트림의 내용을 표시합니다. 실제 파일이나 터미널에는 쓰지 않습니다.'],
    ['종료 상태 0은 성공이고 0이 아닌 값은 실패를 호출 환경에 전달해요.', '`SystemExit(2)`는 이 스크립트를 종료합니다. 콘솔에 2를 출력하는 예제가 아니라 프로세스 상태가 2가 됩니다.'],
    ['작은 CLI 명령은 한 책임을 함수로 분리해 입력 사례로 확인하기 쉽게 해요.', '두 기록을 넘기면 요약 함수는 `records=2`를 반환합니다. 화면 출력과 계산 책임을 나누면 검토가 쉽습니다.'],
    ['argparse는 사용법과 도움말을 제공하며 필수 옵션이 없으면 오류 코드로 종료해요.', '예제는 stderr를 포착해 `--file` 누락 메시지를 확인하고, 도움말에는 옵션 설명이 있는지 검사합니다.'],
  ],
  23: [
    ['JSON 파싱과 별개로 필수 필드의 자료형·내용·허용 범위를 검증해요.', 'title은 공백이 아닌 문자열이어야 하고 minutes는 음이 아닌 정수여야 합니다. bool은 int의 하위형이므로 따로 제외합니다.'],
    ['완성한 임시 파일을 목표 파일과 같은 폴더에 쓴 뒤 os.replace로 이름을 교체해요.', '임시 폴더에서 JSON을 기록·교체·다시 읽습니다. 교체 전 중단 시 원본 보존에 도움이 되지만 전원 손실 내구성까지 보장하지는 않습니다.'],
    ['필드 누락은 값 변환 전에 계약 위반으로 판단하고 기본값과 구분해요.', 'minutes 키가 없으므로 검증 결과는 False입니다. 누락을 무조건 0으로 바꿀지는 명시적 데이터 계약으로 정해야 합니다.'],
    ['백업을 적용하기 전에 지원 버전과 records 자료형을 모두 확인해요.', 'version이 1이고 records가 목록이라 이 백업 구조는 지원 가능한 형식입니다. 이 예제는 실제 사용자 기록을 변경하지 않습니다.'],
    ['복구 보고는 성공한 항목 수와 실패 상태를 구분하고 실패를 성공으로 포장하지 않아요.', '정상 입력은 개수를 보고하고 OSError가 있으면 실패와 예외 종류를 표시하며 복구 완료라고 말하지 않습니다.'],
  ],
  24: [
    ['함수와 매개변수 이름에 변환 의도와 대상 값이 드러나도록 정해요.', 'format_title(title)은 양끝 공백 제거 후 제목 표기로 바꾸고 Python을 출력합니다.'],
    ['중복 제거와 입력 순서 보존이 모두 필요하면 순서가 정의된 자료구조를 사용해요.', 'Python 3.7 이상에서 dict는 삽입 순서를 보장하므로 dict.fromkeys 결과는 첫 등장 순서를 보존합니다.'],
    ['writer를 인자로 받으면 저장 구현을 교체할 수 있고 테스트에서는 가짜 writer를 주입할 수 있어요.', '예제의 lambda는 디스크에 저장하지 않는 테스트 대역이며 save가 전달된 함수를 호출해 `saved`를 반환합니다.'],
    ['리뷰에서는 중복 조건과 앞선 결과를 덮어쓰는 분기를 찾아야 해요.', 'status가 done이라 두 조건이 연이어 참입니다. 두 번째 분기가 결과를 retry로 덮어씁니다.'],
    ['저장 전에 입력을 검증하고 실패한 입력은 writer에 넘기지 않아요.', '제목이 있는 경우에만 writer가 호출됩니다. 잘못된 입력의 검증과 저장 동작 순서를 코드에서 확인하세요.'],
  ],
  25: [
    ['요구사항을 순서가 있는 작업으로 나누고, 각 경계에 입력·출력 계약을 둬요.', '요구 목록을 읽기→검증→적용 순으로 정리하면 적용보다 검증이 먼저라는 규칙을 확인할 수 있습니다. 단계 이름만 나열한 것이므로 실제 서비스를 실행하거나 설계를 완성한 것은 아닙니다.'],
    ['입력 자료형을 확인할 때 bool이 int의 하위형이라는 Python 특성을 고려해요.', 'minutes는 음이 아닌 정수여야 하므로 isinstance(minutes, int)만 쓰면 True/False도 통과합니다. bool을 별도로 제외하고 경계값을 확인하세요.'],
    ['복구 실패를 빈 성공 결과와 구분해 호출자가 다음 행동을 선택할 수 있게 해요.', '예제 reader는 로컬 함수이며 네트워크나 실제 파일을 읽지 않습니다. OSError가 발생하면 ok=False와 제한된 오류 종류를 반환하고 오류 세부 메시지는 공개하지 않습니다.'],
    ['백업 검증은 정상·버전 불일치·bool 버전·필수 키 누락을 나눠 확인해요.', '네 입력을 각각 valid_backup에 넣어 4/4 통과 여부를 확인합니다. 이는 작은 함수의 경계 사례이며 실제 백업 파일 복구를 검증한 것은 아닙니다.'],
    ['공개 전 점검표는 각 검사 이름과 실패 상태를 그대로 결과에 남겨요.', '모든 검사가 통과해야 ready가 True입니다. 예제에서는 backup_restore가 실패하므로 출시 준비가 False이고 실패 항목에 표시됩니다.'],
  ],
  26: [
    ['완료는 선언값이 아니라 각 필수 기준의 결과를 모아 판단해요.', 'required 목록에 있는 모든 검사가 True일 때만 전체 상태가 통과합니다. 항목을 하나씩 대조하면 빠진 회귀 검사를 찾기 쉽습니다.'],
    ['회귀 검사는 정상 입력뿐 아니라 빈 목록과 필수 키 누락도 고정해요.', '세 입력의 합계는 차례로 3, 빈 목록 0, 마지막 입력 2입니다. 마지막 입력에서는 minutes가 없는 항목을 0으로 더합니다. 요구 정책을 바꾸면 이 기대값도 함께 검토해야 합니다.'],
    ['timeit 측정 결과는 환경에 따라 달라지므로 조건과 반복 횟수를 함께 기록해요.', '예제는 고정된 입력 크기와 100회 반복으로 측정하지만 실제 초 값은 출력하지 않습니다. 결과 자료형이 float임을 확인하며 기기 간 성능 우열을 단정하지 않습니다.'],
    ['명령 도움말은 파서가 실제 등록한 옵션에서 생성해 코드와 어긋남을 줄여요.', 'ArgumentParser가 --backup을 포함한 도움말을 만듭니다. 문자열로 오래된 명령을 따로 복사해 두는 대신 파서의 출력과 비교하세요.'],
    ['복습 계획은 주제별 다음 행동과 관찰 가능한 성공 기준을 함께 적어요.', '4개 주제마다 next_action과 success가 있어야 다음 주에 완료 여부를 확인할 수 있습니다. 학습 기간만 적는 것으로는 목표 달성을 판정할 수 없습니다.'],
  ],
};

const advancedDailyFeedback = {
  13: [
    { choice: ['`strip()`은 양끝만 정리하고 `split()`은 각 조각을 만들며 문자열 원본은 바뀌지 않습니다.', '문자열은 불변이라 메서드 호출 결과를 저장해도 원본이 제자리에서 바뀌지 않습니다.', '`strip()`은 가운데 공백을 지우지 않으므로 각 조각의 공백은 별도로 처리해야 합니다.'], summary: '양끝 공백을 먼저 지운 뒤 쉼표로 나누므로 출력은 [\'python\', \'java\']입니다.', trace: 'strip 결과를 쉼표로 나누면 첫 항목은 python이고 둘째 항목은 java입니다.', choiceHint: '쉼표 앞뒤 공백과 문자열 가운데 공백을 구분해 보세요.', traceHint: '`strip()` 결과를 먼저 쓰고, 그 문자열을 쉼표로 나눠 보세요.' },
    { choice: ['문자열 앞의 `f`가 중괄호 안 이름의 현재 값을 넣습니다.', '`{name}`은 f-string 안에서도 따옴표를 더 붙이지 않고 Python 표현식으로 읽습니다.', 'f-string에는 숫자·문자열 등 표현식 결과를 형식에 맞게 넣을 수 있습니다.'], summary: 'name에 들어 있는 Mina가 Hi, 뒤에 삽입되어 출력됩니다.', trace: 'f-string이 만들어질 때 `name`의 값이 들어가므로 출력은 `Hi, Mina`입니다.', choiceHint: '중괄호가 값을 끼워 넣으려면 문자열 접두사에 어떤 글자가 필요한지 확인하세요.', traceHint: '문자열을 만들 때 `name`의 현재 값을 대입해 보세요.' },
    { choice: ['`re.search()`는 부분 문자열에서도 첫 일치 객체를 돌려주며 일치하지 않으면 None입니다.', '`search`는 전체 문자열 일치만 요구하지 않습니다. 전체 일치 검사는 `fullmatch`가 담당합니다.', '검색 결과는 문자열이 아니라 Match 객체 또는 None이므로 그룹은 성공 여부를 먼저 확인해야 합니다.'], summary: 'v2 안에서 숫자 2가 찾아져 검색 결과가 존재하므로 bool 값은 True입니다.', trace: '`\\d+`가 `v2`의 `2`와 일치해 Match 객체가 나오므로 `bool(...)`은 True입니다.', choiceHint: '패턴이 문자열 전체와 같은지, 일부에만 있어도 되는지 보세요.', traceHint: '`v2`에서 `\\d+`가 찾는 위치가 있는지 확인하세요.' },
    { choice: ['첫 괄호 그룹 번호는 1이고 두 번째는 2입니다. 이 예제에서 group(2)의 값이 문자열 3입니다.', '괄호 없는 전체 일치는 group(0)이며 첫 포획 그룹은 group(1)입니다.', '이 패턴에는 숫자 그룹이 두 개뿐이므로 group(3)은 범위 밖입니다.'], summary: '두 번째 포획 그룹이 숫자 문자열 3을 돌려줘 출력은 3입니다.', trace: '첫 그룹은 `py`, 두 번째 그룹은 `3`이고 `group(2)`가 두 번째 괄호 값을 반환합니다.', choiceHint: '전체 일치 번호 0과 포획 괄호 그룹 번호를 분리해서 세세요.', traceHint: '괄호를 왼쪽부터 1, 2로 번호 매기세요.' },
    { choice: ['하이픈처럼 구분자가 고정되어 있으면 `split()`만으로 나눌 수 있어 의도가 바로 드러납니다.', '정규식은 반복 패턴이나 선택 조건에 유용하지만 모든 문자열 분할에서 더 명확한 것은 아닙니다.', '정규식도 입력과 패턴이 맞지 않으면 예상 결과를 못 낼 수 있습니다.'], summary: '하이픈으로 나뉜 접미사 17을 split으로 얻습니다. 이 고정 구분에는 정규식이 필요하지 않습니다.', trace: 'slug.split("-")가 세 조각을 만들고 마지막 문자열인 17을 출력합니다.', choiceHint: '입력 규칙이 고정된 구분자인지, 복잡한 패턴 규칙인지 판단하세요.', traceHint: '하이픈으로 나눈 조각 중 마지막 항목을 확인하세요.' },
  ],
  14: [
    { choice: ['`date`는 연·월·일을 보유하고 시각은 포함하지 않으며, `datetime`은 둘 다 표현합니다.', '`date`는 달력상의 연도·월·일을 저장하도록 만들어졌습니다.', '`datetime`도 timezone-aware 값을 표현할 수 있습니다.'], summary: 'date(2026, 1, 2).year는 날짜의 연도 2026을 돌려줍니다.', trace: 'date 객체의 year 속성은 생성자에 준 첫 값인 2026입니다.', choiceHint: '`date` 생성자에 전달한 세 정수가 각각 어떤 달력 필드인지 보세요.', traceHint: 'date 생성자의 첫 인수가 year입니다.' },
    { choice: ['UTC timezone이 연결되어 있으므로 이 datetime은 시간대 인식 값입니다.', '`tzinfo`는 시간대 없는 datetime에서 보통 None입니다.', '시간대는 오프셋 계산·비교에 영향을 주므로 표시만 바꾸는 정보가 아닙니다.'], summary: 'timezone.utc가 tzinfo에 있으므로 None이 아니며 출력은 True입니다.', trace: '생성 시 `timezone.utc`를 주었으므로 `tzinfo is not None`은 True입니다.', choiceHint: '이 예제는 단순 속성 검사이며 시간대 인식 판정에 utcoffset도 관여한다는 점을 구분하세요.', traceHint: '`tzinfo`에 전달한 객체가 None인지 확인하세요.' },
    { choice: ['`isoformat()`은 문자열을 반환하고 timezone-aware 값이면 오프셋도 표시합니다.', '직렬화 문자열을 만들 뿐 JSON 인코딩까지 수행하지 않습니다.', 'aware datetime의 `isoformat()`은 UTC 오프셋을 포함합니다.'], summary: '고정 datetime은 UTC 오프셋 +00:00을 포함한 ISO 문자열로 표시됩니다.', trace: '연·월·일과 시각 뒤에 UTC 오프셋이 붙어 `2026-01-02T00:00:00+00:00`이 출력됩니다.', choiceHint: '메서드가 실제 변환을 하려면 호출 괄호가 필요한지 확인하세요.', traceHint: '오프셋이 `+00:00`인 고정 시각을 ISO 형태로 적으세요.' },
    { choice: ['`json.loads`는 JSON의 true를 Python의 True로 바꿉니다.', 'Python dict를 직접 읽는 것이 아니라 JSON 문자열을 인수로 받습니다.', '파일 경로를 열지 않으므로 파일이면 `json.load(file)`을 써야 합니다.'], summary: 'JSON true가 Python Boolean True로 바뀌어 출력됩니다.', trace: 'json.loads가 JSON의 소문자 `true`를 Python Boolean `True`로 변환하므로 답은 True입니다.', choiceHint: 'JSON 표기와 Python 표기에서 참 값의 대소문자 차이를 살펴보세요.', traceHint: '파싱한 객체의 done 키에 들어가는 Python 값의 형식을 확인하세요.' },
    { choice: ['기본 인코더가 지원하지 않는 datetime을 ISO 문자열로 바꾸면 유효한 JSON 값으로 저장할 수 있습니다.', 'json.dumps는 지원하지 않는 객체를 기본 설정으로 모두 자동 변환하지 않습니다.', 'JSON은 문자열을 지원하므로 ISO 형식 텍스트를 값으로 저장할 수 있습니다.'], summary: 'datetime을 ISO 문자열로 바꾼 뒤 JSON 인코딩해 at 키가 있는 객체를 출력합니다.', trace: '`value.isoformat()`이 문자열을 만들고 `json.dumps`가 그 문자열을 JSON 텍스트로 인코딩합니다.', choiceHint: 'JSON이 지원하는 기본 자료형과 Python datetime 객체를 구분하세요.', traceHint: '먼저 ISO 문자열을 만들고 그 문자열이 든 dict를 JSON으로 출력하세요.' },
  ],
  15: [
    { choice: ['`Path("data") / "notes.txt"`는 경로 구성 요소를 결합하며 as_posix는 표시를 정규화합니다.', '`Path`는 문자열 경로 조각과 `/` 연산자로 결합할 수 있습니다.', '문자열 덧셈 대신 Path 연산을 사용하면 운영체제 경로 규칙에 맞출 수 있습니다.'], summary: '상위 경로와 파일 이름이 결합되어 `data/notes.txt`로 출력됩니다.', trace: 'Path의 `/` 연산으로 두 경로 조각을 결합하고 as_posix가 `data/notes.txt`로 표시합니다.', choiceHint: '경로 결합 연산자와 일반 문자열 덧셈을 구분하세요.', traceHint: 'Path 조각을 결합한 뒤 as_posix가 어떤 구분자로 보여 주는지 보세요.' },
    { choice: ['exists는 현재 경로 상태만 확인하고 생성은 하지 않습니다.', '없는 경로를 만들려면 `mkdir`이나 파일 쓰기 같은 별도 작업이 필요합니다.', 'exists는 경로의 존재만 확인하며 내용을 읽거나 검증하지 않습니다.'], summary: 'TemporaryDirectory 안에 missing.txt를 만들지 않았으므로 False입니다.', trace: '임시 폴더에 candidate 파일을 쓰지 않았으므로 exists() 결과는 False입니다.', choiceHint: '경로를 검사하는 메서드가 파일 생성까지 맡는지 구분하세요.', traceHint: 'candidate 경로에 앞서 파일을 만드는 코드가 있는지 확인하세요.' },
    { choice: ['첫 mkdir은 폴더를 만들고 두 번째는 `exist_ok=True`로 이미 있는 디렉터리를 허용합니다.', '`parents=True`가 없으면 누락된 부모 디렉터리는 자동으로 모두 만들어지지 않습니다.', '`Path.mkdir`은 디렉터리용이며 일반 파일은 파일 쓰기 API로 만듭니다.'], summary: '첫 mkdir 이후 두 번째 호출도 exist_ok=True라 예외 없이 실행되고 ready를 출력합니다.', trace: 'logs를 먼저 만든 뒤 존재를 허용하는 두 번째 mkdir이 성공하므로 `ready`가 출력됩니다.', choiceHint: '기본 mkdir의 기존 경로 동작과 exist_ok=True의 예외 처리를 보세요.', traceHint: '두 번째 호출의 exist_ok 설정과 마지막 print까지 흐름을 따라가세요.' },
    { choice: ['환경 변수를 읽으면 코드 밖에서 배포 설정을 전달할 수 있지만 secret을 소스에 두면 노출 위험이 있습니다.', '비밀값을 환경 변수로 옮겨도 저장소에 기록하면 노출되므로 안전한 비밀 주입 경로가 필요합니다.', 'os.getenv는 환경 변수 값을 읽을 수 있습니다.'], summary: 'os.getenv는 실행 환경에서 설정을 읽고 변수가 없으면 지정한 기본값을 반환합니다.', trace: 'STUDY_MODE가 설정되지 않았으므로 os.getenv는 기본값인 local을 반환하고 print가 이를 출력합니다.', choiceHint: '설정 주입과 비밀 저장 위치는 별개의 문제입니다.', traceHint: '환경 변수가 없을 때 os.getenv의 두 번째 인수가 어떤 역할을 하는지 확인하세요.' },
    { choice: ['LIMIT가 없거나 None이면 10, 문자열 0은 정수 0으로 변환됩니다.', '기본값은 누락된 값에만 적용하고 설정된 값은 형식과 허용 범위를 따로 확인해야 합니다.', '설정 문서는 기본값뿐 아니라 배포 환경에서 허용되는 값과 범위도 설명해야 합니다.'], summary: '빈 settings에는 LIMIT가 없어 기본값 10이 선택됩니다.', trace: 'settings.get은 키가 없어 None을 돌려주므로 조건식이 기본값 10을 반환합니다.', choiceHint: '키가 없는 경우와 값이 숫자 0인 경우를 나누어 보세요.', traceHint: 'settings에 LIMIT가 없을 때 get의 반환값과 조건식을 차례로 계산하세요.' },
  ],
  16: [
    { choice: ['`@dataclass`가 만든 생성자가 `title`을 받아 인스턴스를 만들고, `.title`을 읽으면 Python이 나옵니다.', '`@dataclass`는 필드를 전역 변수로 바꾸지 않습니다. `title`은 각 `Course` 인스턴스의 값입니다.', '`@dataclass`는 기본 생성자를 만들어 주므로 `Course("Python")`처럼 인스턴스를 만들 수 있습니다.'], summary: '`@dataclass`가 만든 생성자가 `title`을 받아 인스턴스를 만들고, `.title`을 읽으면 Python이 나옵니다.', choiceHint: '클래스의 `title: str` 선언과 `Course("Python")` 호출이 어떻게 이어지는지 따라가세요.' },
    { choice: ['`field(default_factory=list)`는 객체마다 새 목록을 만듭니다. 첫 객체에 항목을 추가해도 둘째 객체의 목록은 비어 있어요.', '목록 기본값을 각 인스턴스에 자동 복사하지 않습니다. 가변 기본값에는 새 목록을 만드는 방법이 필요합니다.', '`default_factory`는 인수 없이 호출할 수 있는 함수라 `list`처럼 새 목록을 만드는 함수에 쓸 수 있습니다.'], summary: '첫 Course의 tags에만 Python을 추가했으므로 첫 목록은 [\'Python\'], 둘째 목록은 []입니다.', choiceHint: '두 Course 객체의 tags가 같은 목록인지, 한쪽에 추가한 값이 다른 쪽에도 보이는지 확인하세요.' },
    { choice: ['`frozen=True` 데이터클래스는 필드 재대입을 막습니다. 생성한 `Code("py")`의 값을 읽는 것은 허용됩니다.', '`frozen=True`는 초기화를 막지 않습니다. 생성 뒤 `value`를 바꾸려 하면 `FrozenInstanceError`가 납니다.', 'frozen 데이터클래스도 안쪽의 가변 객체까지 얼리지는 않습니다. 예를 들어 목록 필드의 내용은 바뀔 수 있습니다.'], summary: '생성한 `Code("py")`의 `value`를 읽을 수 있어 출력은 py입니다. frozen은 필드를 다시 대입하지 못하게 할 뿐입니다.', choiceHint: '객체를 만드는 단계와 만든 뒤 속성을 다시 대입하는 단계를 나눠 보세요.' },
    { choice: ['기본 `eq=True` 데이터클래스는 같은 클래스의 필드 값을 비교하므로 두 객체의 `==`는 True입니다.', '데이터클래스의 기본 `==`는 객체 주소만 비교하지 않고 필드 값으로 동등성을 판단합니다.', '`eq`가 기본값인 데이터클래스는 `==` 비교를 지원합니다. 비교 메서드를 만들지 않으려면 `eq=False`를 지정합니다.'], summary: '두 객체는 모두 `Code`이고 `value`도 py이므로 기본 데이터클래스 비교 결과는 True입니다.', choiceHint: '`==`가 같은 객체인지 묻는지, 같은 클래스의 필드 값이 같은지 묻는지 구분하세요.' },
    { choice: ['`CourseId(1)`의 문자열 표현에는 클래스 이름과 `value`가 들어가므로 CourseId(value=1)이 출력됩니다.', '`CourseId`는 값에 의미를 붙이는 타입입니다. 데이터베이스 연결이나 저장 기능을 대신하지 않습니다.', '값 객체에도 생성 때 값의 범위나 형식을 검사하는 규칙을 둘 수 있습니다.'], summary: '`@dataclass`가 만든 표현식은 클래스 이름과 필드 값을 포함해 `CourseId(value=1)`을 표시합니다.', choiceHint: '`CourseId`가 어떤 값을 감싸는지와 데이터베이스 접근 역할을 맡는지 나눠 보세요.' },
  ],
  17: [
    { choice: ['`double(3)`은 6이라 assert를 통과하고, 뒤의 print가 ok를 출력합니다. 사용자 입력 검증에는 최적화 때 제거될 수 있는 assert를 쓰지 마세요.', '`assert`는 조건이 거짓이면 `AssertionError`를 내며, 참이면 다음 줄로 진행합니다.', '`assert`는 결과를 출력하는 명령이 아닙니다. 조건이 거짓이면 예외를 내고 참이면 조용히 지나갑니다.'], summary: '`double(3) == 6`이 참이므로 assert를 통과하고, 뒤의 print가 ok를 출력합니다.', choiceHint: '`double(3)`의 실제 값과 assert 오른쪽의 기대값을 비교하세요.' },
    { choice: ['이 함수는 빈 목록에서 조건식의 else를 골라 None을 돌려줍니다. 이 예제는 빈 입력의 동작을 계약으로 정한 경우입니다.', '경계값은 평균적인 입력만 반복하는 것이 아니라 빈 값·첫 값·마지막 값처럼 다른 분기로 이어지는 입력을 살핍니다.', '테스트마다 계약에 맞는 기대 결과나 예상 예외가 있어야 합니다. 경계 입력에도 확인 기준이 필요합니다.'], summary: '`first([])`는 빈 목록 분기에서 None을 반환합니다. 빈 입력에서 무엇을 돌려줄지는 함수 계약에 따라 정해야 합니다.', choiceHint: '`items`가 빈 목록일 때 조건식의 어느 쪽이 실행되는지 확인하고, 그 결과가 계약에 맞는지 보세요.' },
    { choice: ['잘못된 입력에서 예외가 나는지 확인하는 테스트는 실패 처리 계약을 검증하는 데 필요합니다.', '`except: pass`는 예외를 모두 숨겨 테스트가 실패했어야 하는 상황도 놓칠 수 있습니다.', '`assertRaises(ValueError)`처럼 예상한 종류만 확인하면 다른 예외가 잘못 발생한 경우도 드러납니다.'], summary: '`int("bad")`가 ValueError를 내면 `assertRaises`가 이를 확인하고, 테스트는 다음 줄의 expected를 출력합니다.', choiceHint: '이 입력에서 예상하는 예외 이름과 그 예외를 확인하는 문맥 관리자를 찾아보세요.' },
    { choice: ['두 `make_record()` 호출은 별도 딕셔너리를 만드므로 첫 번째를 바꿔도 두 번째 `done`은 False입니다.', '모든 테스트가 바꾸는 전역 목록은 실행 순서에 따라 상태가 남을 수 있어 테스트를 서로 오염시킵니다.', '테스트 입력은 함수 안에서 만들거나 `setUp` 같은 준비 단계로 둘 수 있습니다. 한 위치로 제한되지 않습니다.'], summary: '각 호출이 새 딕셔너리를 돌려줘 두 번째 기록은 그대로입니다. 출력은 False입니다.', choiceHint: '두 테스트 입력이 같은 딕셔너리를 공유하는지, `make_record()`가 호출마다 새 값을 만드는지 살펴보세요.' },
    { choice: ['회귀 테스트는 버그를 다시 만드는 입력과 기대값을 남깁니다. 버그가 돌아오면 테스트도 실패해야 합니다.', '한 번 통과한 회귀 테스트를 지우면 같은 오류가 다시 생겨도 알아차릴 기준이 없어집니다.', '빈 목록 합계의 기대값을 0으로 검사하면 이 사례의 회귀 기준이 분명해집니다.'], summary: '`sum([])`은 0이므로 그 값을 검사하는 테스트를 남겨 두면 잘못된 기대값이나 구현이 다시 들어왔을 때 발견할 수 있습니다.', choiceHint: '이 테스트가 어떤 입력에서 어떤 값을 확인하는지, 버그가 돌아오면 어떻게 알려 주는지 보세요.' },
  ],
  18: [
    { choice: ['이 예제는 기록의 `actual` 값인 UnicodeDecodeError를 출력합니다. 나머지 필드가 어떤 정보를 보태는지도 살펴보세요.', '재현 기록에는 입력·환경·행동뿐 아니라 예상 결과와 실제 결과를 함께 적어야 차이를 찾을 수 있습니다.', '오류를 고치기 전부터 재현 과정을 남겨야 수정 뒤 같은 입력으로 결과를 비교할 수 있습니다.'], summary: '기록에는 notes.md, UTF-8, 디코딩 행동, 예상 Python, 실제 UnicodeDecodeError가 들어 있고 출력은 실제 결과입니다.', choiceHint: '입력·환경·행동·예상·실제 항목 중 빠진 것이 없는지 보고, 실제 결과를 출력하는 키를 찾으세요.' },
    { choice: ['경고와 오류는 같은 뜻이 아닙니다. 경고는 문제가 생길 가능성을 알리고, 오류는 기능 수행에 실패했을 때 씁니다.', '메시지의 내용과 상황을 보고 심각도를 고릅니다. `missing record`가 기능 실패인지 확인하세요.', '로그 수준은 메시지 내용과 무관하게 정하지 않습니다. `missing record`가 어떤 문제인지에 따라 남길 수준이 달라집니다.'], summary: '`logging.warning` 호출은 로그 기록이고 `print("warning")`은 표준 출력입니다. 문제에서 묻는 것은 print가 쓰는 값입니다.', choiceHint: '로그 수준은 메시지의 심각도로 고르고, `logging.warning`과 `print`는 서로 다른 동작임을 확인하세요.' },
    { choice: ['`ZeroDivisionError`가 `calculate()` 안에서 발생하므로 스택 트레이스는 그 호출 위치를 찾는 데 직접 쓰입니다.', '스택 트레이스에는 예외가 발생하기까지의 호출 경로가 담깁니다. 내부 경로나 정보를 사용자에게 그대로 공개할 필요는 없습니다.', '`traceback.extract_tb()`는 예외에 연결된 호출 프레임을 읽습니다. 마지막 항목의 함수 이름은 calculate입니다.'], summary: '예외 traceback의 마지막 프레임이 `calculate`이므로 그 함수 이름을 출력합니다.', choiceHint: '예외가 난 함수와 그 함수를 호출한 경로를 따라가고, 마지막 프레임의 이름을 확인하세요.' },
    { choice: ['이 예제는 `int("x")`의 ValueError를 원인으로 연결하므로 `error.__cause__`의 형식 이름은 ValueError입니다.', '`raise ... from error`는 새 예외의 `__cause__`에 기존 예외를 기록합니다. 원인을 지우는 문법이 아닙니다.', '`return`은 값을 돌려줄 뿐 예외를 새로 일으키거나 원인 관계를 만들지 않습니다.'], summary: '새 ValueError의 명시적 원인이 기존 ValueError라 `type(error.__cause__).__name__`은 ValueError입니다.', choiceHint: '`raise ... from error`가 새 예외와 기존 예외 사이에 만드는 관계를 확인하세요.' },
    { choice: ['이 함수는 None에서 빈 문자열을 반환하고, 그 외에는 양끝 공백만 지우도록 요구합니다.', '문제가 난 모듈 전체를 다시 쓰기보다 재현한 입력 경로에 필요한 변경만 하는 것이 안전합니다.', '수정 뒤 None 입력과 일반 문자열 입력을 확인해야 새 처리와 기존 동작을 함께 지켰는지 알 수 있습니다.'], summary: 'None은 빈 문자열로 처리되고, 일반 문자열은 대소문자를 보존한 채 양끝 공백만 제거합니다.', choiceHint: 'None 처리와 일반 문자열 처리가 각각 무엇을 보존해야 하는지 요구사항을 대조하세요.' },
  ],
  19: [
    { choice: ['set은 포함 여부를 확인하고 결과 목록은 첫 등장 순서를 보존합니다.', 'set은 중복 원소를 하나로 합칩니다.', 'set도 `in`으로 포함 여부를 확인할 수 있습니다.'], summary: 'seen에 추가한 뒤 unique에만 넣어 첫 등장 순서를 유지합니다.', trace: 'py는 처음 한 번만 unique에 추가되고, js도 추가된 뒤 두 번째 py는 건너뛰어 두 값이 남습니다.' },
    { choice: ['키가 없을 때만 기본값 0을 돌려주며 실제 저장값 0과 구별해야 합니다.', 'dict 조회를 항상 선형 탐색이라고 단정할 수 없습니다.', '`get`은 키가 없을 때 기본값을 돌려주므로 KeyError를 피할 수 있습니다.'], summary: 'java 키가 없으므로 get의 기본값 0이 출력됩니다.', trace: '딕셔너리에 java가 없으므로 `get("java", 0)`은 0을 반환합니다.' },
    { choice: ['`sorted`는 정렬된 새 목록을 반환합니다. 같은 결과를 여러 번 쓸 때는 한 번 저장해 재사용할 수 있습니다.', '정렬 비용은 입력 크기와 데이터에 따라 달라지므로 필요한 횟수를 살펴야 합니다.', '정렬은 비교 기준에 따라 동작하며 `key`를 지정할 수도 있습니다.'], summary: '`sorted`가 정렬된 새 목록을 돌려주고 print가 그 목록을 표시합니다.', trace: '`sorted`가 새 목록 `[1, 2, 3]`을 만들고 print가 표시합니다.' },
    { choice: ['각 바깥 반복마다 안쪽 반복이 두 번 돌아 총 네 조합을 처리합니다.', '바깥 반복의 각 값에 안쪽 반복이 실행되므로 한 번으로 끝나지 않습니다.', '이 코드는 set 변환을 하지 않고 두 목록의 값을 순회합니다.'], summary: '2×2 조합을 세어 작업량이 두 순회의 곱으로 늘어남을 확인합니다.', trace: 'left가 두 번, 각 left마다 right가 두 번 바뀌므로 count는 4가 됩니다.' },
    { choice: ['`timeit.timeit`은 지정한 반복 횟수의 경과 시간을 초 단위 float으로 돌려줍니다.', '측정 시간은 실행 환경에 따라 달라지므로 항상 같은 숫자가 아닙니다.', '`number=100`이 반복 횟수를 정하므로 측정 설정의 일부입니다.'], summary: '목록 포함 확인을 100회 수행하고 반환값의 자료형 이름을 출력합니다.', trace: 'timeit은 실행 환경에 따라 달라지는 경과 시간을 float으로 반환합니다.' },
  ],
  20: [
    { choice: ['201도 2xx 성공 범위지만 생성 의미와 응답 본문은 API 계약으로 확인해야 합니다.', '201은 요청 형식 오류가 아니라 생성 성공을 나타내는 2xx 상태입니다.', '조건식은 status를 사용해 200 이상 300 미만인지 검사합니다.'], summary: '201은 2xx 범위에 들어가므로 비교식 결과는 True입니다.', trace: '201은 200 이상이고 300 미만이므로 조건식은 True입니다.' },
    { choice: ['실제 클라이언트 요청에 timeout을 전달해야 대기 경계를 설정할 수 있습니다.', 'timeout은 성공 여부와 관계없이 요청 대기 상한을 지정합니다.', 'timeout을 설정해도 응답 상태와 본문 검증은 별도로 필요합니다.'], summary: '모형 클라이언트가 전달받은 timeout 값 2를 돌려줍니다.', trace: '요청 모형에 `timeout=2`가 전달되며 실제 네트워크 통신은 일어나지 않습니다.' },
    { choice: ['JSON 파싱 전에 상태·본문 형식·파싱 실패 가능성을 처리해야 합니다.', '200 응답도 본문이 비어 있거나 JSON이 아닐 수 있습니다.', '`json.loads`는 문법이 잘못된 입력에서 JSONDecodeError를 낼 수 있습니다.'], summary: 'JSON 문자열에서 count 값을 읽어 정수 2를 출력합니다.', trace: '파싱한 객체에서 count 키의 값 2를 꺼냅니다.' },
    { choice: ['items가 목록인지 확인하고 원소마다 dict인지 검사해야 안전하게 순회할 수 있습니다.', '응답 객체만 있어도 내부 items가 목록이라고 보장되지는 않습니다.', '외부 응답의 구조와 자료형은 경계에서 검증해야 합니다.'], summary: 'items는 빈 목록이므로 목록 검사와 모든 원소 검사가 모두 True입니다.', trace: '빈 목록은 list이고 원소가 없으므로 `all(...)`도 True입니다.' },
    { choice: ['상태별로 허용한 안내를 만들고 내부 detail은 공개 응답에서 제외합니다.', '비밀번호와 스택 추적은 사용자에게 그대로 돌려주지 않습니다.', '오류 안내는 사용자가 취할 다음 행동을 알려야 합니다.'], summary: '500 응답에는 내부 세부정보 대신 재시도 안내를 반환합니다.', trace: 'status가 500이므로 재시도 메시지가 선택되고 내부 세부정보는 공개되지 않습니다.' },
  ],
  21: [
    { choice: ['취소를 처리해 정리했다면 다시 올려 호출자에게 취소 상태를 전달합니다.', 'Python 3.8 이후 CancelledError는 Exception이 아니라 BaseException 계열입니다.', '취소를 무시하면 호출자는 작업이 취소됐다는 사실을 알 수 없습니다.'], summary: '취소 때 정리 코드가 실행된 뒤 취소 예외가 호출자에게 전달됩니다.', trace: 'worker가 취소를 받고 cleanup을 기록한 뒤 예외를 다시 올려 main이 cancelled를 기록합니다.' },
    { choice: ['`return_exceptions=True`는 예외 객체를 결과 목록에 넣으므로 호출자가 확인해야 합니다.', '이 옵션은 결과로 들어온 예외 객체를 자동으로 다시 발생시키지 않습니다.', 'gather의 실패 취소 동작을 옵션과 실행 상태 없이 단정하지 마세요.'], summary: '두 번째 결과가 ValueError 객체이므로 형식 이름은 ValueError입니다.', trace: 'gather 결과의 두 번째 항목은 ValueError 객체이며, 코드가 그 형식 이름을 출력합니다.' },
    { choice: ['스레드는 I/O처럼 기다리는 동안 다른 작업을 진행할 때 겹쳐 쓸 수 있습니다.', '일반적인 CPython에서 스레드가 CPU 계산을 항상 빠르게 하지는 않습니다.', '스레드는 프로세스 안에서 공유 상태를 볼 수 있어 동기화가 필요할 수 있습니다.'], summary: '대기 시간을 겹치되 map은 입력 순서대로 결과를 모읍니다.', trace: '두 모의 작업이 a, b 결과를 반환하고 map이 원래 입력 순서를 보존합니다.', runtime: 'sleep은 실제 네트워크 I/O가 아니라 대기를 흉내 내며, 출력 순서는 map 계약으로 결정됩니다.' },
    { choice: ['CPU 작업은 프로세스 풀로 분리할 수 있지만 시작 비용과 직렬화 조건도 고려해야 합니다.', '프로세스 풀은 네트워크 대기를 없애는 기능이 아닙니다.', '일반 Python 객체가 프로세스 사이에서 자동으로 공유되지는 않습니다.'], summary: '모듈 수준 square 함수를 두 수에 적용해 결과를 출력합니다.', trace: '2와 3을 각각 제곱하므로 결과는 `[4, 9]`입니다.', runtime: '작업 함수는 모듈 수준에 있고 실행 진입점은 __main__ 가드로 보호됩니다.' },
    { choice: ['읽기·수정·쓰기를 같은 Lock 구역 안에 두면 증가 연산이 서로 겹치지 않습니다.', '여러 스레드가 counter를 바꿔도 동기화 없이 항상 안전하다고 보장할 수 없습니다.', 'Lock은 읽기만 막는 것이 아니라 잠금 구간 전체를 한 작업으로 제한합니다.'], summary: '4개 작업이 각각 100회 증가시켜 counter의 기대값은 400입니다.', trace: '네 작업이 각각 100회씩 증가를 마쳐 counter는 400이 됩니다.' },
  ],
  22: [
    { choice: ['옵션을 선언한 뒤 parse_args가 전달된 file 값을 Namespace에 담습니다.', 'argparse는 인자 형식만 정하며 파일 내용의 스키마까지 확인하지 않습니다.', 'parse_args는 잘못되거나 필수 인자가 빠진 입력에서 사용법 오류로 종료할 수 있습니다.'], summary: '고정 인자 목록을 파싱해 Namespace의 file 값 notes.json을 출력합니다.', trace: '파서가 `--file notes.json`을 읽어 args.file에 문자열 notes.json을 보관합니다.' },
    { choice: ['stdout은 정상 결과, stderr은 진단을 담아 두 흐름을 따로 수집합니다.', '오류 진단을 stdout에만 섞으면 자동화가 결과와 오류를 구분하기 어렵습니다.', 'stderr도 파일·파이프에 연결될 수 있는 별도 텍스트 스트림입니다.'], summary: '정상 텍스트와 오류 텍스트를 별도 버퍼에 모아 각 내용을 표시합니다.', trace: 'redirect 구간의 `record`는 stdout, `invalid input`은 stderr 버퍼에 들어가므로 합쳐 출력한 문구가 답입니다.' },
    { choice: ['SystemExit(2)는 비정상 종료를 나타내는 0이 아닌 프로세스 상태입니다.', '오류를 0으로 끝내면 호출 환경은 성공으로 해석할 수 있습니다.', '프로세스 종료 상태는 정수이며 설명 문자열 자체가 아닙니다.'], summary: '유효하지 않은 입력에서 SystemExit(2)가 발생해 프로세스 상태 2로 끝납니다.', trace: '이 코드는 출력 없이 SystemExit(2)로 끝나므로 실행한 부모 프로세스가 관찰하는 종료 상태는 2입니다.' },
    { choice: ['요약 함수 한 개가 기록 개수를 계산해 한 가지 책임을 맡습니다.', '파싱·저장·업로드·알림을 한 줄에 모으면 변경 이유가 섞입니다.', '작은 순수 함수는 입력과 반환값으로 독립 확인할 수 있습니다.'], summary: '두 기록을 전달하므로 요약 문자열은 records=2입니다.', trace: '목록 원소가 두 개라 len은 2이고 함수가 `records=2`를 반환합니다.' },
    { choice: ['argparse가 사용법 도움말을 만들고 필수 --file 누락을 오류 코드 2로 알립니다.', '알 수 없는 옵션이나 필수 옵션 누락은 항상 성공으로 끝나지 않습니다.', '도움말은 오류가 난 뒤에만 나타나는 것이 아니라 명시적으로 요청할 수도 있습니다.'], summary: '도움말에는 --file이 있고 누락 파싱은 코드 2와 필수 옵션 진단을 만듭니다.', trace: 'format_help에는 --file 설명이 포함되고 빈 인자 파싱은 SystemExit 2와 stderr 진단을 남깁니다.' },
  ],
  23: [
    { choice: ['키 존재 외에도 title과 minutes의 실제 자료형·범위를 확인해야 합니다.', 'JSON 파싱 성공은 모든 값이 앱 계약에 맞다는 뜻이 아닙니다.', '외부 입력은 필수 키 누락이나 잘못된 자료형으로 실패할 수 있습니다.'], summary: '제목이 유효한 문자열이고 minutes가 음이 아닌 정수여서 True입니다.', trace: 'title은 공백이 아닌 문자열이고 minutes는 bool이 아닌 정수 40이라 유효 판정은 True입니다.' },
    { choice: ['같은 폴더의 완성된 임시 파일을 os.replace로 바꿔 최종 파일의 부분 쓰기 위험을 줄입니다.', '최종 파일에 바로 쓰면 중단 때 기존 내용이 덮여 일부만 남을 수 있습니다.', '다른 파일 시스템에 있는 임시 파일은 교체가 항상 가능하지 않습니다.'], summary: '임시 JSON을 같은 디렉터리에서 교체한 뒤 레코드 목록을 다시 읽습니다.', trace: '임시 파일에 저장한 JSON이 notes.json으로 교체된 뒤 파싱되어 Python 레코드 목록으로 출력됩니다.' },
    { choice: ['minutes 키가 없으므로 자료형·범위 검증 전에 레코드는 유효하지 않습니다.', '누락 필드는 명시 계약 없이 0으로 바뀌지 않습니다.', 'bool은 int의 하위형이므로 정수 필드 검사에서는 별도로 제외해야 합니다.'], summary: 'record에 minutes가 없으므로 valid는 False입니다.', trace: 'get은 누락된 minutes에 None을 주고 int 조건이 실패하므로 False가 출력됩니다.' },
    { choice: ['현재 적용 전에 버전 1과 records 목록 구조가 모두 맞는지 검사합니다.', 'JSON object를 읽었다고 지원하지 않는 백업 버전도 안전한 것은 아닙니다.', '백업 내용은 복원 전에 필수 필드와 자료형을 검증해야 합니다.'], summary: 'version이 bool이 아닌 정수 1이고 records가 목록이어서 상위 구조 검사 결과는 True입니다.', trace: 'JSON의 version은 bool이 아닌 정수 1이고 records는 목록이라 valid는 True입니다.' },
    { choice: ['성공은 실제 복구 개수를 보고하고 오류가 있으면 실패 상태를 따로 알립니다.', '읽기 오류 뒤에 복구 완료라고 보고하면 실제 상태를 거짓으로 전달합니다.', '실패 상세에는 민감 데이터 대신 OSError 같은 제한된 오류 종류만 사용합니다.'], summary: '성공은 2건으로, 실패는 OSError 이유로 각각 보고됩니다.', trace: '정상 호출은 성공과 count 2를, OSError 호출은 실패와 오류 종류를 두 줄로 출력합니다.' },
  ],
  24: [
    { choice: ['함수 이름 format_title과 인자 title이 변환 의도와 입력을 설명합니다.', '짧은 do, x만으로는 변환 목적을 읽을 수 없습니다.', '구체적 이름은 호출자가 함수를 펼쳐 보지 않고 목적을 판단하게 합니다.'], summary: '양끝 공백을 정리한 python을 제목 표기로 바꿔 Python을 출력합니다.', trace: 'strip이 양끝 공백을 지우고 title이 첫 글자를 대문자로 만들어 Python을 돌려줍니다.' },
    { choice: ['dict.fromkeys는 삽입 순서를 보존하면서 중복 키를 하나로 줄입니다.', 'set을 목록으로 변환한다고 입력 순서를 보장하지는 않습니다.', 'dict는 키의 유일성과 삽입 순서를 이용해 중복 제거에 쓸 수 있습니다.'], summary: '첫 py와 js 순서를 유지하고 중복 py는 한 번만 남습니다.', trace: 'fromkeys는 입력 순서의 첫 py, js 키를 보존해 `py`, `js` 목록을 만듭니다.' },
    { choice: ['writer를 인자로 받으면 실제 저장기와 테스트 대역을 바꿔 끼울 수 있습니다.', '함수 안에서 파일 writer를 만들면 저장 구현과 테스트 환경이 고정됩니다.', '의존성 주입은 전역 상태를 추가하기보다 협력자를 명시적으로 전달합니다.'], summary: '주입된 lambda가 saved를 반환하고 save가 이를 호출자에게 돌려줍니다.', trace: 'save가 writer(record)를 호출하고 lambda가 saved를 반환합니다. 파일 저장은 일어나지 않습니다.' },
    { choice: ['중복된 done 조건이 두 번 참이 되어 두 번째 대입이 첫 결과를 덮어씁니다.', '앞 조건이 참이어도 독립된 두 번째 if는 별도로 평가됩니다.', '분기 순서와 중복 조건이 결과 상태를 바꿀 수 있습니다.'], summary: '두 번째 조건도 참이라 result가 complete에서 retry로 덮어써집니다.', trace: 'status가 done이라 두 if 본문이 모두 실행되고 마지막 값 retry가 출력됩니다.' },
    { choice: ['title 검증이 먼저 통과한 뒤에야 저장 writer를 호출합니다.', '먼저 저장하고 나중에 검증하면 잘못된 입력이 이미 기록될 수 있습니다.', '호출자 검증만 믿지 말고 저장 함수 자체에서도 입력 경계를 확인해야 합니다.'], summary: '유효한 제목을 확인한 뒤 writer를 호출해 saved를 반환합니다.', trace: 'title이 있으므로 검증을 통과하고 writer가 호출되어 saved를 돌려줍니다.' },
  ],
  25: [
    { choice: ['읽기와 검증을 끝낸 뒤에만 입력을 적용하는 순서를 명시합니다.', '적용을 먼저 하고 나중에 검사하면 잘못된 상태가 이미 반영될 수 있습니다.', '읽기·검증·적용 순서가 바뀌면 잘못된 입력이 먼저 반영될 수 있으므로 순서는 중요합니다.'], summary: '요구 목록은 읽기, 검증, 적용 순서입니다.', trace: 'steps의 세 항목을 차례로 합쳐 `읽기 -> 검증 -> 적용`이 됩니다.' },
    { choice: ['데이터 모델의 필드 이름과 자료형을 실제로 받고 저장할 값의 계약에 맞춰야 합니다.', '자료형은 화면 표시뿐 아니라 계산·저장·검증의 동작을 정하므로 모델에서 중요합니다.', '모든 값을 문자열로 저장하면 숫자 필드의 계산과 범위 검증 계약을 잃습니다.'], summary: 'title은 비지 않은 문자열이고 minutes는 bool이 아닌 0 이상 정수라 계약을 만족합니다.', trace: 'title과 minutes의 자료형·내용·범위 검사가 모두 참이어서 valid는 True입니다.' },
    { choice: ['OSError를 성공으로 위장하지 않고 오류 종류만 담은 실패 결과를 돌려줍니다.', '실패를 빈 목록으로 바꾸면 복구 성공과 저장소 장애를 구별할 수 없습니다.', '오류 메시지 전체를 공개하지 않아도 제한된 실패 종류는 진단에 남길 수 있습니다.'], summary: 'reader의 OSError는 ok=False와 read_failed 결과가 됩니다.', trace: '예외 경로에서 형식이 제한된 오류 결과를 반환하고 정상 경로의 records 읽기는 실행하지 않습니다.' },
    { choice: ['정상·버전 불일치·bool 버전·records 누락을 모두 확인합니다.', '정상 백업 하나만으로는 잘못된 버전이나 누락 필드를 찾아낼 수 없습니다.', '각 입력과 기대 결과를 기록해야 유효한 데이터인지 거부할 데이터인지 판정할 수 있습니다.'], summary: '네 시나리오 모두 기대한 검증 결과와 일치합니다.', trace: '정수 버전 1인 목록만 True이고 버전 2, bool 버전, records 누락은 False라 네 사례가 모두 통과합니다.' },
    { choice: ['필요한 검사 모두가 True일 때만 출시 준비를 완료로 보고합니다.', '검사 하나가 실패해도 다른 검사가 통과하면 준비 완료로 볼 수 없습니다.', '실패한 검사 이름이 없으면 다음에 어떤 점검을 고칠지 찾기 어렵습니다.'], summary: '유일한 실패 검사 backup_restore 때문에 ready=False입니다.', trace: '검사 목록을 훑어 backup_restore를 failed에 추가하고 실패 목록이 비어 있지 않아 ready가 False가 됩니다.' },
  ],
  26: [
    { choice: ['required 각 항목이 통과했는지 확인하므로 누락된 검사가 있으면 전체는 False입니다.', '완료를 무조건 True로 정하면 실제 검사 결과를 반영하지 못합니다.', 'required 목록만 완료 기준으로 확인하므로 목록 밖의 실패가 항상 전체 결과를 결정하지는 않습니다.'], summary: 'required 목록 중 backup이 False라 all 결과는 False입니다.', trace: 'examples와 questions는 True지만 backup은 False여서 모든 항목이 통과하지 않습니다.' },
    { choice: ['정상 합계·빈 입력·minutes 키 누락의 정책을 모두 회귀 사례로 고정합니다.', '이전 코드와 같더라도 요구사항에 맞지 않는 기대값은 바로잡아야 합니다.', 'Python의 sum([]) 결과는 0이므로 빈 목록의 기대값 1은 잘못됐습니다.'], summary: '세 입력의 합계는 각각 3, 0, 2이며 모두 기대값과 일치합니다.', trace: '첫 입력은 3, 빈 목록은 0, 마지막 입력은 누락된 minutes를 0으로 더해 2입니다. 세 결과가 모두 기대값과 같아 3/3 passed가 출력됩니다.' },
    { choice: ['입력 크기와 반복 횟수를 고정해 측정 조건을 기록하되 실제 시간은 환경별로 다릅니다.', '측정 결과 하나만으로 모든 입력 규모의 성능을 보장할 수 없습니다.', '반복 안에서 항목 수만큼 전체 정렬을 수행하므로 입력 크기에 따라 비용이 달라집니다.'], summary: '측정값은 100개 입력·100회 반복으로 얻은 float입니다.', trace: 'timeit.timeit은 경과 시간을 float으로 반환하고, 출력은 재현 가능한 조건과 형식만 표시합니다.' },
    { choice: ['파서에서 만들어 낸 help 출력은 등록된 --backup 옵션을 포함합니다.', 'format_help()에는 parser에 등록한 --backup 옵션과 PATH 설명이 포함됩니다.', 'format_help()는 parse_args()가 오류를 내기 전에도 등록된 옵션으로 도움말을 만듭니다.'], summary: '생성된 도움말에 --backup이 있어 옵션 검사는 True입니다.', trace: 'format_help 결과 안에서 등록한 --backup 문자열을 찾아 True를 출력합니다.' },
    { choice: ['각 계획에 다음 행동과 성공 조건이 모두 있어 네 주 뒤 확인할 수 있습니다.', '기간만 있는 막연한 목표로는 무엇을 완료해야 하는지 판정할 수 없습니다.', '각 주제에 다음 행동과 성공 조건을 적어야 나중에 계획 완료 여부를 확인할 수 있습니다.'], summary: '계획 4개 모두 topic, next_action, success를 가져 criteria=True입니다.', trace: '네 항목 모두 주제·다음 행동·성공 조건이 비어 있지 않아 criteria가 True가 됩니다.' },
  ],
};

// Editorially reviewed daily facts for the first advanced block.  Each row
// has one claim, two plausible-but-wrong alternatives, and a separate broken
// snippet for error location.  The examples above remain the trace stimulus.
const advancedDailyLocateHints = {
  13: [
    'strip을 호출했는지와 그 결과를 실제 출력에 사용했는지 살펴보세요.',
    '중괄호 치환이 일어나려면 문자열 앞에 어떤 접두사가 필요한지 확인하세요.',
    'search 결과가 None일 수 있는 입력인지, group 호출 전에 검사하는지 확인하세요.',
    '괄호가 두 쌍인지 세고 전체 일치 group(0)과 구분하세요.',
    '고정 구분자 하나를 나누기 위해 정규식 모듈이 필요한지 따져 보세요.',
  ],
  14: [
    '실제 달력에 해당 연도와 월의 날짜가 존재하는지 확인하세요.',
    'datetime에 tzinfo가 지정됐는지, 시스템 로컬 시간대에 암묵적으로 기대는지 살펴보세요.',
    'ISO 문자열을 얻으려면 메서드 이름만 참조하는지 실제로 호출하는지 확인하세요.',
    'JSON 문자열에서 키와 문자열은 큰따옴표로 쓰는지 확인하세요.',
    '기본 JSON 인코더가 직접 지원하는 자료형인지 먼저 확인하세요.',
  ],
  15: [
    'Path 객체와 문자열을 결합할 때 문자열 덧셈인지 경로 연산인지 확인하세요.',
    '임시 디렉터리에 candidate 파일을 생성한 적이 있는지 추적하세요.',
    '첫 mkdir 뒤에 같은 디렉터리를 다시 만들 때 어떤 옵션이 필요한지 보세요.',
    '값이 코드에 고정되어 있는지, 실행 환경에서 읽히는지 확인하세요.',
    '환경 변수가 없을 때 os.getenv가 반환하는 None을 int로 바꾸는지 확인하세요.',
  ],
  16: [
    'dataclass가 자동 생성해 주는 초기화 메서드가 클래스에 적용되도록 필요한 선언을 찾으세요.',
    '가변 목록을 필드 기본값으로 직접 두었는지, 인스턴스마다 새로 만드는지 확인하세요.',
    'frozen=True 객체가 만들어진 뒤 필드에 다시 대입하는 줄을 찾으세요.',
    '두 객체의 값이 같은지 확인할 때 `is`와 `==` 중 어떤 비교가 필요한지 살펴보세요.',
  ],
  17: [
    '함수 반환값을 직접 계산한 다음 assert의 기대값과 비교하세요.',
    '빈 목록에서 첫 원소 인덱스를 읽기 전에 빈 입력을 처리하는지 확인하세요.',
    '예외 객체를 반환하는 것과 `raise`로 실제 발생시키는 것을 구분하세요.',
    '테스트가 같은 전역 목록을 수정해 다음 테스트 상태에 영향을 주는지 살펴보세요.',
  ],
  18: [
    '실패를 다시 확인하는 데 필요한 입력, 행동, 기대값, 실제값이 기록되는지 보세요.',
    '디스크가 가득 찬 상황을 운영자가 알아차릴 수 있는 로그 수준으로 남겼는지 판단하세요.',
    '예외를 잡은 뒤 내부 로그에도 호출 경로가 남도록 기록하는 줄을 확인하세요.',
    '새 RuntimeError를 던질 때 원래 ValueError를 원인으로 연결하는지 살펴보세요.',
  ],
  19: [
    '목록의 포함 여부를 매번 훑는 구조인지, 중복 확인용 set을 사용하는지 확인하세요.',
    '딕셔너리에 없는 키를 대괄호로 직접 읽는 줄을 찾아 기본값 처리와 비교하세요.',
    '반복문 안에서 같은 전체 목록을 다시 정렬하는 호출이 있는지 보세요.',
    '각 바깥 반복마다 안쪽 반복이 전체 목록을 다시 도는 구조인지 살펴보세요.',
  ],
  20: [
    '성공 상태를 200 하나로만 제한해 다른 2xx 응답을 놓치는지 확인하세요.',
    '요청을 보낼 때 대기 시간을 제한하는 옵션이 전달되는지 찾으세요.',
    '상태 오류나 비JSON 응답에서도 본문을 바로 JSON으로 읽는 부분을 살펴보세요.',
    'items가 존재하고 실제 목록인지 확인하기 전에 순회하는 줄을 찾으세요.',
  ],
  21: [
    '작업 취소 예외까지 잡아 버리고 다시 전달하지 않는 처리 부분을 확인하세요.',
    'return_exceptions=True일 때 결과가 예외인지 먼저 확인하지 않고 dict처럼 읽는 줄을 찾으세요.',
    'CPU 중심 작업을 스레드 풀에 보낸 실행 경계를 확인하세요.',
    '프로세스 풀에 넘긴 lambda가 작업자 프로세스에 전달 가능한 형식인지 살펴보세요.',
  ],
  22: [
    '--file이 없을 때도 None 경로를 열 수 있는지, 필수 인자 검증이 있는지 확인하세요.',
    '오류 안내가 stdout이 아니라 stderr로 전달되는지 살펴보세요.',
    '잘못된 입력에 성공 코드 0을 반환하는 종료 지점을 찾으세요.',
    '파싱·저장·업로드·알림을 한 함수가 한꺼번에 맡고 있는 부분을 찾으세요.',
  ],
  23: [
    '필수 minutes 키를 읽기 전에 존재 여부와 값의 형식을 확인하는지 살펴보세요.',
    '최종 백업 파일을 직접 덮어쓰기 전에 임시 파일을 완성하는 흐름인지 보세요.',
    '문자열 "many"를 정수로 변환하기 전에 자료형과 허용 범위를 검사하는지 확인하세요.',
    'JSON 파싱 직후 백업 버전과 필수 구조를 검증한 다음 적용하는지 살펴보세요.',
  ],
  24: [
    '함수 이름과 매개변수만으로 정규화 동작과 입력을 알 수 있는지 확인하세요.',
    'set 변환이 입력 목록의 원래 순서를 보장한다고 잘못 가정하는 줄을 찾으세요.',
    '함수 안에서 FileWriter를 직접 만들어 저장 구현을 고정하는 줄을 살펴보세요.',
    '같은 status 조건을 두 번 검사해 앞에서 정한 결과를 덮어쓰는 부분을 확인하세요.',
  ],
  25: [
    '목록에 적힌 단계 순서가 검증보다 적용을 먼저 하도록 되어 있는지 확인하세요.',
    '분 단위 숫자를 문자열로 저장해 자료형 계약을 어기는 값을 찾으세요.',
    '저장 실패를 정상적인 빈 백업으로 돌려 호출자에게 숨기는 분기를 살펴보세요.',
    '정상 백업 외에 손상·누락·빈 입력을 확인하는 사례가 빠졌는지 보세요.',
  ],
  26: [
    '진행 기록을 검사하지 않고 완료를 무조건 True로 반환하는 줄을 찾으세요.',
    '빈 목록의 합계에 대해 테스트가 잘못된 기대값을 쓰는지 확인하세요.',
    '목록의 각 항목마다 전체 목록을 다시 정렬하는 호출 위치를 확인하세요.',
    '도움말에서 --backup을 안내하는지, 실제로 등록된 옵션과 이름이 맞는지 비교하세요.',
  ],
};

const advancedDailyReviewCases = {
  13: [
    ['`strip()`은 문자열 양끝의 공백을 제거한 새 문자열을 반환한다.', '`strip()`은 원본 문자열을 제자리에서 바꾼다.', '`strip()`은 가운데 공백도 모두 지운다.', ['text = "  py  "', 'text.strip', 'print(text)'], 2, '2번 줄은 메서드를 호출하지 않아 정리된 문자열을 만들지 않습니다. `text.strip()`가 필요합니다.'],
    ['f-string의 중괄호 안에서는 변수나 표현식의 값을 삽입할 수 있다.', 'f-string에서는 변수 이름을 따옴표로 감싸야 한다.', 'f-string은 숫자 값을 넣을 수 없다.', ['name = "Mina"', 'message = "Hi, {name}"', 'print(message)'], 2, '2번 줄은 일반 문자열입니다. 변수 값을 넣으려면 앞에 `f`를 붙여야 합니다.'],
    ['`re.search`는 문자열 안에서 패턴과 일치하는 첫 위치를 찾는다.', '`re.search`는 패턴과 전체 문자열이 같을 때만 찾는다.', '`re.search`는 항상 문자열을 반환한다.', ['import re', 'match = re.search(r"\\d+", "python")', 'print(match.group(0))'], 2, '2번 줄은 숫자 패턴을 숫자가 없는 문자열에서 찾습니다. 결과는 `None`이므로 3번 줄의 `group` 호출이 실패합니다. 패턴과 입력 조건을 맞추거나 결과가 없는 경우를 처리하세요.'],
    ['정규식 그룹은 괄호로 묶은 부분을 따로 읽게 한다.', '정규식 그룹은 괄호를 출력 문자로만 바꾼다.', '그룹 번호는 언제나 0부터 시작해 첫 괄호가 0이다.', ['import re', 'match = re.search(r"(\\w+)-(\\d+)", "py-3")', 'print(match.group(3))'], 3, '3번 줄의 그룹 3은 없습니다. 전체 일치는 0, 첫·둘째 괄호 그룹은 1과 2입니다.'],
    ['간단한 구분에는 문자열 메서드가 정규식보다 읽기 쉽다.', '정규식은 모든 문자열 문제에서 더 읽기 쉽다.', '정규식은 실패할 수 없으므로 검증이 필요 없다.', ['import re', 'text = "a,b"', 'parts = re.split(",", text)', 'print(parts)'], 3, '3번 줄은 이 단순 구분에 불필요하게 정규식을 사용합니다. `text.split(",")`이 더 직접적입니다.'],
  ],
  14: [
    ['`date`는 시각 없이 날짜를, `datetime`은 날짜와 시각을 표현한다.', '`date`에는 연·월·일을 저장할 수 없다.', '`datetime`은 시간대를 가질 수 없다.', ['from datetime import date', 'today = date(2026, 2, 30)', 'print(today)'], 2, '2번 줄의 2월 30일은 존재하지 않아 날짜를 만들 수 없습니다. 실제 달력의 날짜를 사용하세요.'],
    ['시간대 인식 datetime은 어느 시각 기준인지 함께 보존한다.', '시간대 인식 값은 `tzinfo`를 반드시 `None`으로 둔다.', '시간대는 문자열 표시만 바꾸고 시각에는 관계없다.', ['from datetime import datetime', 'created = datetime(2026, 1, 2)', 'print(created.astimezone())'], 2, '2번 줄은 시간대 없는 값을 만듭니다. 뒤의 `astimezone()`은 이를 현재 시스템 로컬 시간대로 해석하므로, 외부 시각에는 UTC 등 기준 `tzinfo`를 명시하세요.'],
    ['`isoformat()`은 날짜·시간을 교환하기 쉬운 문자열 형식으로 만든다.', '`isoformat()`은 datetime 객체를 JSON으로 자동 저장한다.', '`isoformat()`은 시간대 정보를 항상 제거한다.', ['from datetime import datetime, timezone', 'value = datetime.now(timezone.utc)', 'print(value.isoformat)'], 3, '3번 줄은 메서드 자체를 출력합니다. 문자열을 얻으려면 `isoformat()`으로 호출해야 합니다.'],
    ['`json.loads`는 JSON 문자열을 Python 값으로 읽는다.', '`json.loads`는 Python dict만 받을 수 있다.', '`json.loads`는 파일 경로를 자동으로 연다.', ['import json', 'payload = json.loads("{done: true}")', 'print(payload)'], 2, '2번 줄의 JSON 키는 큰따옴표로 감싸야 합니다. 올바른 JSON 문자열을 전달하세요.'],
    ['기본 JSON 인코더는 datetime 같은 객체를 바로 직렬화하지 못한다.', '`json.dumps`는 모든 Python 객체를 자동으로 저장한다.', 'JSON은 문자열을 저장할 수 없다.', ['import json', 'from datetime import datetime', 'print(json.dumps({"at": datetime.now()}))'], 3, '3번 줄은 datetime을 기본 인코더로 저장하려 합니다. ISO 문자열로 바꾸거나 인코더를 명시하세요.'],
  ],
  15: [
    ['`Path / "name"`은 운영체제에 맞게 경로 조각을 결합한다.', 'Path는 문자열 경로와 함께 쓸 수 없다.', '경로는 언제나 문자열 `+`로만 결합해야 한다.', ['from pathlib import Path', 'path = Path("data") + "/notes.txt"', 'print(path)'], 2, '2번 줄에서 Path와 문자열을 `+`로 더할 수 없습니다. `Path("data") / "notes.txt"`를 사용하세요.'],
    ['`Path.exists()`는 경로가 현재 존재하는지 Boolean으로 알려 준다.', '`exists()`는 없는 경로를 자동 생성한다.', '`exists()`는 파일 내용을 읽는다.', ['from pathlib import Path', 'from tempfile import TemporaryDirectory', 'with TemporaryDirectory() as folder:', '    candidate = Path(folder) / "notes.txt"', '    candidate.read_text()', '    print("checked")'], 5, '5번 줄은 만들지 않은 파일을 바로 읽어 `FileNotFoundError`를 냅니다. 읽기를 시도해 예외를 처리하는 편이 안전합니다. `exists()`는 확인한 순간의 상태만 알려 주므로 이후 읽기 성공을 보장하지 않습니다.'],
    ['`mkdir(exist_ok=True)`는 이미 있는 디렉터리에도 안전하게 사용할 수 있다.', '`mkdir`은 부모 디렉터리를 자동으로 모두 만든다.', '`mkdir`은 파일을 만드는 메서드다.', ['from pathlib import Path', 'from tempfile import TemporaryDirectory', 'with TemporaryDirectory() as folder:', '    logs = Path(folder) / "logs"', '    logs.mkdir()', '    logs.mkdir()'], 6, '6번 줄은 이미 생성된 임시 디렉터리를 기본 옵션으로 다시 만듭니다. 반복 실행이 가능하도록 `exist_ok=True`를 지정하세요.'],
    ['환경 변수는 배포 환경마다 달라지는 설정을 코드 밖에서 주입할 때 쓴다.', '환경 변수에는 비밀값을 직접 소스에 적어야 한다.', '환경 변수는 Python에서 읽을 수 없다.', ['import os', 'token = "production-secret"', 'print(token)'], 2, '2번 줄에 비밀값을 코드로 고정하면 저장소와 배포에 노출될 수 있습니다. 환경 변수나 비밀 관리 경계를 사용하세요.'],
    ['설정 기본값은 환경 변수가 없을 때도 예측 가능한 동작을 정한다.', '기본값은 입력 검증 없이 항상 안전하다.', '기본값이 있으면 설정 문서가 필요 없다.', ['import os', 'limit = int(os.getenv("LIMIT"))', 'print(limit)'], 2, '2번 줄은 LIMIT가 없으면 `int(None)`이 됩니다. 합리적 기본값과 범위 검증을 두세요.'],
  ],
  16: [
    ['`@dataclass`는 선언한 필드의 생성자와 비교 같은 반복 코드를 줄인다.', '`@dataclass`는 모든 필드를 전역 변수로 만든다.', '데이터클래스는 인스턴스를 만들 수 없다.', ['from dataclasses import dataclass', 'class Course:', '    title: str'], 2, '2번 줄에는 `@dataclass` 데코레이터가 빠져 있어 생성자 생성 규칙이 적용되지 않습니다. 클래스 위에 추가하세요.'],
    ['가변 기본값에는 `field(default_factory=list)`처럼 새 객체를 만드는 팩터리가 필요하다.', '목록 기본값 `[]`은 인스턴스마다 자동 복사된다.', 'default_factory는 불변 문자열에만 쓴다.', ['from dataclasses import dataclass', '@dataclass', 'class Course:', '    tags: list = []'], 4, '학습 기준 Python 3.15에서는 4번 줄의 목록 기본값 때문에 클래스 정의 중 ValueError가 납니다. `field(default_factory=list)`를 사용하세요.'],
    ['`frozen=True` 데이터클래스는 필드 재대입을 막아 값 객체에 유용하다.', 'frozen 객체는 생성할 수 없다.', 'frozen은 안쪽 가변 객체까지 자동으로 깊게 불변으로 만든다.', ['from dataclasses import dataclass', '@dataclass(frozen=True)', 'class Code: value: str', 'Code("py").value = "js"'], 4, '4번 줄은 frozen 값 객체의 필드를 다시 대입합니다. 새 객체를 만들거나 필요한 가변 상태를 분리하세요.'],
    ['데이터클래스의 기본 비교는 같은 필드 값을 가진 인스턴스를 같게 본다.', '데이터클래스 비교는 항상 객체 주소만 비교한다.', '데이터클래스는 `==`를 지원하지 않는다.', ['from dataclasses import dataclass', '@dataclass', 'class Code: value: str', 'print(Code("py") is Code("py"))'], 4, '4번 줄은 값 비교가 아닌 동일 객체 비교입니다. 값이 같은지 확인하려면 `==`를 사용하세요.'],
    ['도메인 값 객체는 식별자 같은 값을 의미 있는 타입으로 감싼다.', '값 객체는 모든 데이터베이스 연결을 대신한다.', '값 객체에는 어떤 검증도 둘 수 없다.', ['course_id = 1', 'print(courseId)'], 2, '2번 줄의 `courseId`는 정의되지 않았습니다. 값 객체나 일관된 이름을 사용해 의미와 표기를 맞추세요.'],
  ],
  17: [
    ['`assert`는 실제 결과와 기대값이 같은지 확인해 실패를 드러낸다.', '`assert`는 조건이 거짓이어도 다음 줄을 계속 실행한다.', '`assert`는 테스트 결과를 문자열로만 출력한다.', ['def double(value):', '    return value * 2', 'assert double(3) == 5'], 3, '3번 줄의 기대값이 잘못되었습니다. `double(3)`의 결과는 6이어야 합니다.'],
    ['경계값은 빈 값·첫 값·마지막 값처럼 일반 입력과 다른 경로를 확인한다.', '경계값은 평균적인 입력만 반복한다.', '경계값 테스트에는 기대값이 필요 없다.', ['def first(items):', '    return items[0]', 'print(first([]))'], 2, '2번 줄은 빈 목록에서 인덱스를 읽습니다. 빈 입력의 계약을 정하고 먼저 처리해야 합니다.'],
    ['예외 테스트는 예상한 예외 종류와 실패 조건을 함께 확인한다.', '예외 테스트는 모든 오류를 `except: pass`로 숨긴다.', '예외는 테스트에서 만들면 안 된다.', ['def positive(value):', '    if value < 0:', '        return ValueError("negative")'], 3, '3번 줄은 예외 객체를 반환할 뿐 발생시키지 않습니다. 실패 계약이면 `raise ValueError(...)`가 필요합니다.'],
    ['fixture는 테스트마다 필요한 입력 상태를 읽기 쉽게 준비한다.', 'fixture는 모든 테스트가 바꾸는 전역 목록이어야 한다.', 'fixture는 테스트 함수 밖에서만 쓸 수 있다.', ['records = [{"done": False}]', 'def test_done():', '    records[0]["done"] = True'], 3, '3번 줄은 공유 fixture를 바꿔 다른 테스트 순서에 영향을 줄 수 있습니다. 각 테스트에 새 입력을 제공하세요.'],
    ['회귀 테스트는 고친 버그가 다시 나타나는지 막는 구체적 사례를 남긴다.', '회귀 테스트는 수정한 버그가 다시 발생해도 실패하지 않아야 한다.', '회귀 테스트는 한 번 성공하면 삭제한다.', ['def total(values):', '    return sum(values)', 'assert total([]) == 1'], 3, '3번 줄의 빈 목록 합계 기대값이 틀렸습니다. Python의 `sum([])`은 0입니다.'],
  ],
  18: [
    ['재현 단계는 입력·환경·행동·실제 결과를 순서대로 기록해 원인을 좁힌다.', '재현 단계는 “안 됨”처럼 결과만 적으면 충분하다.', '재현 단계는 오류를 고친 뒤에만 쓸 수 있다.', ['def report_bug():', '    return "it fails"', 'print(report_bug())'], 2, '2번 줄은 재현에 필요한 입력과 기대·실제 결과가 없습니다. 관찰 가능한 단계를 기록하세요.'],
    ['로그 레벨은 정보의 심각도와 운영에서 필요한 주의를 구분한다.', '경고와 오류는 반드시 같은 레벨이어야 한다.', '로그 레벨은 메시지 내용과 무관하다.', ['import logging', 'logging.debug("write failed: disk is full")'], 2, '2번 줄은 디스크 공간 부족으로 저장 작업이 실제 실패했는데도 debug로 기록합니다. 운영자가 조치할 수 있도록 error 수준으로 남겨야 합니다.'],
    ['스택 트레이스는 예외가 어느 호출 경로에서 생겼는지 보여 준다.', '스택 트레이스는 사용자에게 항상 그대로 공개해야 한다.', '스택 트레이스는 예외 원인과 관계없다.', ['try:', '    1 / 0', 'except ZeroDivisionError:', '    print("failed")'], 4, '4번 줄은 예외 맥락을 버립니다. 내부 로그에는 `logging.exception` 등으로 스택 정보를 남기세요.'],
    ['예외 체이닝은 새 예외가 어떤 원인에서 나왔는지 `raise ... from ...`으로 보존한다.', '예외 체이닝은 원래 예외를 지우기 위해 쓴다.', '예외 체이닝은 `return`으로만 만든다.', ['try:', '    int("x")', 'except ValueError as error:', '    raise RuntimeError("bad input")'], 4, '4번 줄은 원인 예외를 명시적으로 연결하지 않습니다. 3번 줄에서 잡은 예외를 `raise RuntimeError(...) from error`로 연결해 추적성을 남기세요.'],
    ['최소 수정은 재현한 원인을 고치되 관계없는 동작 변경을 피한다.', '최소 수정은 문제가 난 모듈을 전부 다시 쓰는 것이다.', '최소 수정에는 확인 절차가 필요 없다.', ['def normalize(name):', '    return name.lower().strip()', 'print(normalize(None))'], 2, '2번 줄은 None 입력에서 실패합니다. 원인과 계약을 확인한 뒤 필요한 입력 검증만 추가하세요.'],
  ],
  19: [
    ['중복 제거와 포함 여부 확인에는 set이 목록보다 적합할 수 있다.', 'set은 중복 값을 모두 유지한다.', 'set에는 포함 여부를 확인할 수 없다.', ['seen = []', 'for value in [1, 2, 1]:', '    if value not in seen:', '        seen.append(value)'], 3, '3번 줄은 큰 입력에서 매번 목록을 탐색합니다. 순서가 중요하지 않다면 set으로 포함 확인을 하세요.'],
    ['dict의 `get`은 없는 키에 기본값을 주어 KeyError를 피할 수 있다.', 'dict 조회는 모든 키를 선형으로 탐색한다.', '`get`은 없는 키에서 항상 KeyError를 낸다.', ['minutes = {"py": 40}', 'print(minutes["java"])'], 2, '2번 줄은 없는 키를 직접 읽어 KeyError가 납니다. 기본값이 필요하면 `minutes.get("java", 0)`을 쓰세요.'],
    ['정렬은 비용이 있으므로 표시나 순서가 필요할 때만 수행한다.', '정렬은 입력 크기와 무관하게 항상 즉시 끝난다.', '정렬 결과는 비교 기준을 사용하지 않는다.', ['values = [3, 1, 2]', 'for value in sorted(values):', '    print(sorted(values))'], 3, '3번 줄은 반복마다 전체 목록을 다시 정렬합니다. 한 번 정렬한 결과를 재사용하세요.'],
    ['이중 반복은 입력 크기에 따라 작업 수가 빠르게 늘 수 있다.', '이중 반복은 항상 한 번만 실행된다.', '이중 반복은 set으로 바꾸면 항상 같은 순서를 보장한다.', ['values = [1, 2]', 'for left in values:', '    for right in values:', '        print(left + right)'], 3, '3번 줄은 각 바깥 반복마다 안쪽에서 모든 값을 다시 순회합니다. 값이 n개면 조합은 n×n개가 되므로 필요한 작업인지 확인하세요.'],
    ['성능 판단은 측정한 입력과 가정을 함께 기록해야 한다.', '작은 예제 하나로 모든 입력 성능을 확정할 수 있다.', '성능 측정에는 반복 횟수가 필요 없다.', ['elapsed = 0.01', 'print("always fast")'], 2, '2번 줄은 한 번의 시간만 보고 일반화합니다. 입력 크기·횟수·환경을 함께 기록하세요.'],
  ],
  20: [
    ['HTTP 상태 코드는 응답이 성공·클라이언트 오류·서버 오류인지 먼저 구분한다.', '201은 요청 형식 오류를 뜻한다.', '상태 코드는 응답 처리와 무관하다.', ['status = 404', 'if status == 200:', '    payload = {}'], 2, '2번 줄은 200만 성공으로 보지만 생성 성공 201 등 계약에 따른 2xx 범위를 처리하지 않습니다.'],
    ['네트워크 요청에는 무한 대기를 막는 timeout 경계가 필요하다.', 'timeout은 성공 응답에서만 설정한다.', 'timeout이 있으면 상태 코드를 확인할 필요 없다.', ['response = client.get(url)', 'payload = response.json()'], 1, '1번 줄의 요청에 timeout이 없어 연결 문제가 오래 멈출 수 있습니다. 클라이언트 API에 맞게 제한 시간을 지정하세요.'],
    ['JSON 파싱 전에는 응답 형식과 실패 가능성을 고려해야 한다.', '200 응답이면 본문은 항상 JSON이다.', 'JSON 파싱은 절대 예외를 내지 않는다.', ['response = client.get(url)', 'payload = response.json()', 'print(payload["items"])'], 2, '2번 줄은 비JSON 오류 본문에서도 파싱을 시도합니다. 상태·Content-Type·파싱 실패를 다루세요.'],
    ['응답 검증은 필요한 필드와 자료형이 계약에 맞는지 확인한다.', '응답 객체가 있으면 내부 필드는 모두 안전하다.', '자료형 검증은 네트워크 경계에서 금지된다.', ['payload = {"items": None}', 'for item in payload["items"]:', '    print(item)'], 2, '2번 줄은 items가 목록이라는 계약을 확인하지 않습니다. 누락·None·잘못된 형식을 검증하세요.'],
    ['오류 메시지는 사용자가 고칠 정보를 주되 비밀·내부 진단은 공개하지 않는다.', '오류 응답에는 비밀번호와 스택 트레이스를 넣어야 한다.', '사용자 메시지는 항상 빈 문자열이어야 한다.', ['password = "secret"', 'raise ValueError(f"login failed: {password}")'], 2, '2번 줄은 비밀값을 오류 메시지에 포함합니다. 공개 메시지와 제한된 내부 로그를 분리하세요.'],
  ],
  23: [
    ['필수 키와 자료형을 읽기 전에 검증하면 손상 입력을 설명 가능한 오류로 바꿀 수 있다.', 'JSON 파싱에 성공하면 모든 필드와 자료형도 유효하다.', '없는 숫자 필드는 무조건 0으로 바꾸는 것이 안전하다.', ['record = {"title": "Py"}', 'required = {"title", "minutes"}', 'minutes = record["minutes"]'], 3, '3번 줄은 필수 minutes 키가 있는지 확인하지 않고 읽어 KeyError를 낼 수 있습니다. 누락 키와 값의 자료형을 먼저 검증하세요.'],
    ['임시 파일에 완성한 뒤 같은 파일 시스템에서 교체하면 기존 파일의 부분 쓰기를 줄일 수 있다.', '기존 파일을 바로 덮어써도 중단 시 원본이 보존된다.', '임시 파일은 목표 파일과 다른 디렉터리에 둘수록 교체가 보장된다.', ['from pathlib import Path', 'target = Path("notes.json")', 'target.write_text(payload, encoding="utf-8")'], 3, '3번 줄은 최종 파일을 직접 열어 덮어씁니다. 같은 디렉터리의 임시 파일에 완성본을 쓴 뒤 `replace`하는 정책을 고려하세요.'],
    ['외부 저장값은 필수 키뿐 아니라 그 값의 자료형과 범위도 확인해야 한다.', 'JSON 숫자처럼 보이는 문자열은 자동으로 정수 계약을 만족한다.', '저장 데이터 검증은 복구를 방해하므로 하지 않는다.', ['record = {"minutes": "many"}', 'minutes = int(record["minutes"])'], 2, '2번 줄은 변환 전에 입력 형식을 검사하지 않아 ValueError를 냅니다. 오류를 보고할 수 있도록 자료형과 유효 범위를 검증하세요.'],
    ['백업은 버전과 필수 구조를 검사한 뒤 현재 기록에 적용해야 한다.', 'JSON으로 읽혔으면 어떤 버전이든 현재 기록에 바로 적용할 수 있다.', '백업은 일부 필드가 없어도 성공으로 표시해야 한다.', ['backup = json.loads(text)', 'apply_backup(backup)'], 2, '2번 줄은 형식 버전과 필수 필드를 검증하지 않고 현재 기록을 바꿉니다. 적용 전에 스키마와 복구 가능성을 확인하세요.'],
    ['복구 결과는 실제 성공 여부와 복구한 항목 수를 구분해 보고해야 한다.', '복구 중 오류가 나면 성공으로 표시하는 편이 사용자에게 안심을 준다.', '오류를 알리면 백업 기능은 사용할 수 없다.', ['try:', '    records = load_records()', 'except OSError:', '    print("recovered")'], 4, '4번 줄은 파일 읽기 실패 뒤에도 복구 완료라고 알립니다. 실패를 분명히 보고하고 원본을 보존해야 합니다.'],
  ],
  24: [
    ['함수 이름은 입력보다 의도와 결과를 먼저 드러내면 호출 지점을 읽기 쉽다.', '짧은 이름이면 동작과 관계없이 항상 더 명확하다.', '함수 이름은 호출자에게 보이지 않아 아무렇게나 정해도 된다.', ['def do(x):', '    return x.strip().title()'], 1, '1번 줄의 `do`와 `x`만으로는 정규화 의도를 알기 어렵습니다. `format_title(title)`처럼 동작과 입력을 설명하세요.'],
    ['중복을 제거하면서 원래 순서도 보존하려면 순서 보존 정책을 선택해야 한다.', 'set을 목록으로 바꾸면 언제나 입력 순서가 유지된다.', '중복 제거는 dict나 순서 목록으로 할 수 없다.', ['values = ["py", "js", "py"]', 'unique = list(set(values))'], 2, '2번 줄은 set 순회를 통해 입력 순서를 보존한다는 계약을 제공하지 않습니다. 순서가 필요하면 `dict.fromkeys` 등을 사용하세요.'],
    ['협력 객체를 매개변수로 받으면 저장 구현과 테스트 대역을 교체할 수 있다.', '함수 안에서 항상 실제 파일 writer를 직접 생성해야 테스트할 수 있다.', '의존성 주입은 전역 상태를 더 많이 만들기 위한 패턴이다.', ['def save(record):', '    writer = FileWriter()', '    return writer.write(record)'], 2, '2번 줄은 구체 저장 구현을 함수 안에 고정합니다. writer를 인자로 받으면 파일·메모리 구현을 선택할 수 있습니다.'],
    ['조건이 서로 겹치지 않는지 검토하면 중복 분기와 도달 불가능한 코드를 찾을 수 있다.', '같은 조건을 여러 번 두면 각 분기가 한 번씩 실행된다.', '분기 순서는 결과에 영향을 주지 않는다.', ['if status == "done":', '    result = True', 'if status == "done":', '    result = False'], 3, '3번 줄의 조건은 바로 앞 조건과 겹쳐 두 번째 분기가 첫 번째 결과를 덮어씁니다. 상호 배타적인 상태 조건을 정의하세요.'],
    ['검증을 저장 경계보다 뒤에 두면 잘못된 데이터가 먼저 기록될 수 있다.', 'return 뒤의 코드는 함수가 끝나도 자동 실행된다.', '호출자 검증이 있으면 함수 내부 입력 계약은 필요 없다.', ['def save(record):', '    return write_file(record)', '    validate_record(record)'], 2, '2번 줄에서 반환해 3번 줄 검증은 실행되지 않습니다. 검증을 쓰기 전에 수행하고 결과를 반환하세요.'],
  ],
  25: [
    ['요구사항의 처리 순서는 읽기·검증을 끝낸 다음 적용하도록 정의해야 한다.', '검증보다 적용을 먼저 해도 잘못된 입력이 반영되지 않는다.', '단계의 순서는 호출 결과에 영향을 주지 않는다.', ['steps = ["읽기", "적용", "검증"]', 'if steps.index("적용") < steps.index("검증"):', '    raise ValueError("검증 전에 적용할 수 없음")'], 1, '1번 줄은 처리 순서를 읽기, 검증, 적용이 아니라 읽기, 적용, 검증으로 둡니다. 적용보다 검증이 먼저 오도록 순서를 바로잡으세요.'],
    ['데이터 모델의 필드 이름과 자료형은 기능의 입력·출력 계약에 맞아야 한다.', '자료형은 화면 표시에만 쓰이므로 모델에서 중요하지 않다.', '같은 필드를 모든 사용 사례에서 검증 없이 문자열로 저장해야 한다.', ['record = {"title": "Python", "minutes": "40"}', 'save_record(record)'], 1, '1번 줄은 분 단위 숫자를 문자열로 저장합니다. 모델 경계에서 정수형과 허용 범위를 확인하세요.'],
    ['실패 조건은 정상적인 빈 결과와 구분해 호출자에게 전달해야 한다.', '읽기 실패는 빈 목록과 같으므로 성공 결과로 바꿔도 된다.', '예외를 잡았으면 진단이나 재전달은 필요 없다.', ['try:', '    return load_backup()', 'except OSError:', '    return []'], 4, '4번 줄은 저장소 장애를 정상적인 빈 백업처럼 보이게 합니다. 오류를 보고하거나 명시적인 실패 결과를 반환하세요.'],
    ['수동 시나리오는 정상 흐름뿐 아니라 손상·누락·빈 입력도 다뤄야 한다.', '유효한 백업 하나만 확인하면 복구 경계까지 검증된다.', '수동 시나리오는 입력과 기대 결과를 기록할 필요가 없다.', ['scenarios = ["valid backup"]', 'for scenario in scenarios:', '    import_backup(scenario)'], 1, '1번 줄에는 정상 백업만 있어 손상·누락·빈 파일의 반응을 확인할 수 없습니다. 실패 시나리오와 기대 안내를 추가하세요.'],
    ['출시 준비는 필요한 검사가 모두 통과한 경우에만 True로 보고해야 한다.', '검사 하나가 실패해도 다른 검사가 통과하면 준비 완료로 볼 수 있다.', 'ready가 False여도 실패한 점검 이름은 보고하지 않아도 된다.', ['checks = {"tests": True, "backup_restore": False}', 'ready = True', 'failed = []', 'print(f"ready={ready}; failed={failed}")'], 2, '2번 줄은 backup_restore 검사가 실패했는데도 준비 완료를 고정합니다. 모든 결과를 확인해 ready와 실패 항목을 함께 계산하세요.'],
  ],

  26: [
    ['완료 기준은 목표 문항 수와 실제 통과 결과처럼 측정 가능한 조건이어야 한다.', '완료 여부는 코드가 항상 True를 반환하도록 하면 측정할 필요가 없다.', '필수 목록 밖의 검사 하나가 실패해도 전체 완료 여부는 항상 False다.', ['def is_complete(progress):', '    return True'], 2, '2번 줄은 진행 기록을 확인하지 않고 항상 완료로 판정합니다. 정의한 통과 기준과 실제 결과를 비교하세요.'],
    ['회귀 테스트의 기대값은 실제 요구사항을 반영해야 한다.', '테스트는 틀린 기대값이어도 이전 코드와 같으면 통과시켜야 한다.', 'Python에서 빈 목록의 합은 1이다.', ['assert total_minutes([{"minutes": 3}]) == 3', 'assert total_minutes([]) == 1'], 2, '2번 줄은 빈 목록의 합을 1로 기대합니다. 빈 합계 정책을 정하고 그 계약에 맞는 값을 확인하세요.'],
    ['성능 판단은 입력 크기와 반복 횟수를 기록하고 대표 조건에서 측정해야 한다.', '한 번의 작은 입력 결과로 모든 규모의 성능을 보장할 수 있다.', '전체 목록 정렬은 입력 항목 수와 관계없이 같은 비용이 든다.', ['for item in items:', '    ordered = sorted(items)', '    process(item, ordered)'], 2, '2번 줄은 항목마다 전체 목록을 다시 정렬합니다. 필요한 정렬 횟수와 실제 입력 크기를 측정하세요.'],
    ['문서는 실제 CLI 옵션과 실패 동작을 코드와 같은 계약으로 보여야 한다.', 'format_help()는 등록한 --backup 옵션을 도움말에 넣지 않는다.', 'format_help()는 parse_args()가 오류를 낸 뒤에만 호출할 수 있다.', ['parser.add_argument("--backup")', 'usage = "python app.py --export"'], 2, '2번 줄의 `--export`는 선언된 `--backup` 옵션과 다릅니다. 도움말 예시를 실제 CLI 계약과 맞추세요.'],
    ['다음 학습 계획은 기간뿐 아니라 확인 가능한 목표와 성공 조건도 가져야 한다.', '막연한 목표는 기간을 정하면 측정 가능한 계획이 된다.', '주제와 기간만 정해 두면 다음 행동과 성공 조건 없이도 계획 완료를 확인할 수 있다.', ['plan = {"goal": "study more Python", "deadline": None}', 'print(plan["goal"])'], 1, '1번 줄에는 완료 시점과 관찰 가능한 결과가 없습니다. 다음 4주의 범위·산출물·완료 기준을 구체적으로 정하세요.'],
  ],
};

function advancedReviewCase(week, day) {
  const entry = advancedDailyReviewCases[week]?.[day - 1];
  const finalEntry = finalReviewCases[week]?.[day - 1];
  if (!entry && !finalEntry) return null;
  const selected = entry ?? finalEntry;
  const [correct, firstWrong, secondWrong, lines, answerLine, explanation] = selected;
  return { choice: [correct, firstWrong, secondWrong], locate: [lines, answerLine, explanation] };
}

// The final project block uses the same contract: each title owns a concrete
// rule and a failing line, instead of borrowing an earlier week's exercise.
const finalReviewCases = {
  21: [['취소 예외를 잡아 정리한다면 다시 올려 취소 신호를 보존해야 한다.','CancelledError는 Exception의 하위라 except Exception이 잡는다.','취소는 정리 없이 무시하는 것이 기본이다.',['import asyncio','async def run():','    try:','        await asyncio.sleep(1)','    except BaseException:','        pass'],5,'5번 줄은 CancelledError까지 잡을 수 있는 BaseException을 처리합니다. 정리 작업 뒤 취소 예외를 다시 올리거나, 취소를 삼키지 않는 범위로 처리하세요.'],['return_exceptions=True의 결과에는 예외 객체도 값처럼 들어오므로 호출자가 확인해야 한다.','return_exceptions=True는 예외를 자동으로 다시 던진다.','gather는 첫 실패 때 나머지 작업을 항상 취소한다.',['results = await asyncio.gather(load_a(), load_b(), return_exceptions=True)','print(results[0]["name"])'],2,'2번 줄은 첫 결과가 예외 객체일 수 있다는 점을 확인하지 않고 dict처럼 사용합니다. 각 항목의 예외 여부를 검사하세요.'],['I/O 대기는 스레드가 적합할 수 있다.','스레드는 CPU 작업을 항상 더 빠르게 한다.','스레드는 공유 상태가 없다.',['from concurrent.futures import ThreadPoolExecutor','pool = ThreadPoolExecutor()','pool.submit(cpu_heavy)'],3,'3번 줄은 CPU 중심 작업을 스레드로 보내고 있습니다. 실행 환경과 GIL 조건을 고려해 프로세스 또는 지원되는 병렬 실행 방식을 검토하세요.'],['CPU 중심 작업은 프로세스 경계가 적합할 수 있다.','프로세스는 I/O 대기를 없앤다.','프로세스는 공유 메모리만 쓴다.',['from concurrent.futures import ProcessPoolExecutor','pool = ProcessPoolExecutor()','pool.submit(lambda: 1)'],3,'3번 줄의 lambda는 프로세스 작업자에게 직렬화되지 않을 수 있습니다. 모듈 수준의 함수를 사용하세요.'],['공유 상태 변경은 동기화 또는 메시지 경계가 필요하다.','공유 상태는 동시에 바꿔도 항상 안전하다.','Lock은 읽기만 막는다.',['count = 0','def add():','    global count; count += 1'],3,'3번 줄의 읽기-수정-쓰기는 경쟁 상태가 될 수 있습니다. Lock 또는 메시지 전달을 쓰세요.']],
  22: [['argparse는 명령행 입력 형식과 도움말을 선언한다.','argparse는 파일 내용을 자동 검증한다.','argparse는 항상 성공으로 종료한다.',['parser.add_argument("--file")','args = parser.parse_args()','open(args.file)'],3,'3번 줄은 --file 누락을 처리하지 않습니다. required 또는 None 검증을 추가하세요.'],['표준 출력은 정상 결과에, 표준 오류는 진단에 쓴다.','오류도 표준 출력에만 쓴다.','표준 오류는 파일만 쓴다.',['import sys','print("invalid input")'],2,'2번 줄은 오류 진단을 stdout에 보냅니다. `print("invalid input", file=sys.stderr)`처럼 진단과 결과를 분리하세요.'],['종료 코드는 자동화가 성공과 실패를 구분하게 한다.','모든 실패는 0으로 끝낸다.','종료 코드는 설명 문자열이다.',['if invalid:','    raise SystemExit(0)'],2,'2번 줄은 입력 오류를 성공 코드로 끝냅니다. 실패 코드를 사용하세요.'],['작은 명령은 한 가지 책임을 가진다.','작은 명령은 모든 기능을 한 함수에 둔다.','작은 명령은 테스트할 수 없다.',['def command(args):','    parse(); save(); upload(); notify()'],2,'2번 줄은 여러 책임을 한 경계에 묶습니다. 파싱·저장·표시를 분리하세요.'],['사용법 오류에는 다음 행동을 알려 주는 메시지가 필요하다.','사용법 오류는 조용히 무시한다.','사용법은 성공 후에만 보인다.',['raise ValueError("bad")'],1,'1번 줄은 어떤 인자가 잘못됐는지 알려 주지 않습니다. 옵션과 예시를 포함한 도움말을 제공하세요.']],
};

function advancedExample(week, day) {
  const entry = advancedDailyExamples[week]?.[day - 1];
  return entry ? { code: entry[0], answer: entry[1] } : null;
}

function codeFor(week, day) {
  const advancedCase = advancedExample(week, day);
  if (advancedCase) return advancedCase.code;
  const number = week + day;
  const names = ['value', 'count', 'items', 'record', 'text'];
  const name = names[(week + day) % names.length];
  if (week === 1) return `raw = "${number}"\n${name} = int(raw)\nprint(${name} + 1)`;
  if (week === 2) return `score = ${number}\nif score >= 60:\n    result = "pass"\nelse:\n    result = "retry"`;
  if (week === 3) return `total = 0\nfor ${name} in range(1, 4):\n    total += ${name}\nprint(total)`;
  if (week === 4) return `def add_tax(price, rate=0.1):\n    return price * (1 + rate)\n\nprint(add_tax(${number}))`;
  if (week === 5) return `items = [3, 1, 2]\nresult = sorted(items)\nprint(result)`;
  if (week === 6) return `scores = {"mina": ${number}}\nprint(scores.get("jun", 0))`;
  if (week === 7) return `try:\n    ${name} = int("${number}")\nexcept ValueError:\n    ${name} = 0`;
  if (week === 8) return `from pathlib import Path\npath = Path("notes.txt")\nwith path.open(encoding="utf-8") as file:\n    text = file.read()`;
  if (week === 9) return `def squares(limit):\n    for ${name} in range(limit):\n        yield ${name} * ${name}`;
  if (week === 10) return `class Counter:\n    def __init__(self, value=0):\n        self.value = value\n\n    def increment(self):\n        self.value += 1`;
  if (week === 11) return `async def load_name(client):\n    response = await client.get("/name")\n    return response.text`;
  if (week === 12) return `def completed_count(records):\n    return sum(record.get("done") is True for record in records)`;
  if (week === 13) return `text = "  hello, python  "\nwords = text.strip().split(",")\nprint(words)`;
  if (week === 14) return `from datetime import datetime, timezone\nnow = datetime.now(timezone.utc)\nprint(now.isoformat())`;
  if (week === 15) return `from pathlib import Path\nconfig = Path.home() / ".study" / "config.json"`;
  if (week === 16) return `from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Course:\n    title: str`;
  if (week === 17) return `def double(value):\n    return value * 2\n\ndef test_double():\n    assert double(3) == 6`;
  if (week === 18) return `import logging\nlogging.info("records=%s", ${number})`;
  if (week === 19) return `seen = set()\nfor ${name} in [1, 2, 1]:\n    seen.add(${name})`;
  if (week === 20) return `if response.status_code == 200:\n    payload = response.json()`;
  if (week === 21) return `results = await asyncio.gather(load_a(), load_b())`;
  if (week === 22) return `parser.add_argument("--file", required=True)\nargs = parser.parse_args()`;
  if (week === 23) return `data = json.loads(text)\nif "records" not in data:\n    raise ValueError("records is required")`;
  if (week === 24) return `def format_title(title):\n    return title.strip().title()`;
  if (week === 25) return `def summarize(records):\n    return {"count": len(records)}`;
  return `def review_plan(days):\n    return [f"day {day}" for day in days]`;
}

const weekChecks = [
  ['`int(raw)`는 문자열을 정수로 바꾼다', '`int`는 문자열을 그대로 둔다', '`int`는 항상 부동소수점 값을 만든다'],
  ['조건이 거짓이면 `else` 블록이 실행된다', '`else`는 조건이 참일 때만 실행된다', '`if`는 비교 없이 항상 참이다'],
  ['`range(1, 4)`에는 1, 2, 3이 들어간다', '`range(1, 4)`에는 4도 들어간다', '`range`는 문자열만 만든다'],
  ['`return`은 호출자에게 값을 돌려준다', '`return`은 화면에만 값을 출력한다', '`return` 뒤의 값은 항상 전역 변수다'],
  ['`sorted(items)`는 정렬된 새 목록을 돌려준다', '`sorted(items)`는 언제나 원본만 바꾼다', '`sorted`는 숫자 목록을 처리할 수 없다'],
  ['`get`은 없는 키에 기본값을 줄 수 있다', '`get`은 없는 키에서 항상 KeyError를 낸다', '딕셔너리는 키가 아니라 위치만 쓴다'],
  ['`ValueError`는 값 형식 변환 실패를 좁게 다룬다', '`ValueError`는 모든 예외와 같은 뜻이다', '예외 처리는 오류의 원인을 자동으로 해결한다'],
  ['`with` 블록은 파일 사용 뒤 정리를 맡는다', '`with`는 파일을 영구적으로 메모리에 남긴다', 'Path는 텍스트 파일을 읽을 수 없다'],
  ['`yield`는 값을 하나 내놓고 다음 호출을 위해 상태를 남긴다', '`yield`는 즉시 목록 전체를 완성한다', '제너레이터는 두 번 반복해도 자동으로 되감긴다'],
  ['`self.value`는 현재 인스턴스의 상태다', '`self.value`는 항상 전역 변수다', '클래스는 메서드를 가질 수 없다'],
  ['`await`는 코루틴 결과가 필요할 때 사용한다', '`await`는 일반 함수를 병렬 CPU 실행으로 바꾼다', 'async 함수는 호출 즉시 결과 문자열을 돌려준다'],
  ['`sum`의 조건식은 True인 기록만 센다', 'Boolean 값은 숫자로 셀 수 없다', '집계 함수는 빈 목록에서만 쓸 수 있다'],
  ['`strip()`은 양끝 공백을 제거한 새 문자열을 만든다', '`strip()`은 문자열 가운데 공백만 제거한다', '문자열 메서드는 항상 원본을 직접 바꾼다'],
  ['timezone이 있는 datetime은 시각의 기준을 함께 보존한다', 'timezone은 날짜 형식에 영향을 주지 않는다', 'JSON은 datetime 객체를 자동으로 모두 보존한다'],
  ['`Path / "config.json"`은 경로 조각을 결합한다', '경로는 항상 문자열 `+`만으로 결합해야 한다', 'Path는 파일 존재 여부를 확인할 수 없다'],
  ['`frozen=True` 데이터클래스는 필드 재대입을 막는다', '데이터클래스는 생성자를 만들지 않는다', 'frozen 객체는 비교할 수 없다'],
  ['경계값은 정상값과 다른 결과를 낼 수 있어 따로 테스트한다', '테스트는 성공 사례 하나만 있으면 충분하다', 'assert는 예외 검증에 쓸 수 없다'],
  ['로그에는 문제를 재현하는 데 필요한 맥락을 남긴다', '로그는 예외를 조용히 없애는 문법이다', '스택 트레이스는 항상 무시해야 한다'],
  ['set은 중복 제거와 빠른 포함 확인에 알맞다', 'set은 삽입 순서를 인덱스로 조회하는 목록이다', 'dict 조회는 항상 선형 탐색이다'],
  ['성공 상태 코드여도 응답 JSON 구조는 별도로 검증한다', '200 응답이면 JSON 파싱은 절대 실패하지 않는다', 'HTTP 응답은 timeout이 필요 없다'],
  ['asyncio는 기다리는 I/O를 겹치는 데 유용하다', 'asyncio가 CPU 계산을 자동으로 여러 코어에 나눈다', '취소된 코루틴은 어떤 정리도 필요 없다'],
  ['CLI 인자는 실행 전 입력 경계를 명확하게 만든다', '명령행 도구는 실패해도 항상 0으로 종료해야 한다', 'argparse는 파일 내용을 자동 검증한다'],
  ['저장 전 필요한 필드를 검증하면 손상 데이터를 빨리 알 수 있다', '백업은 데이터가 손상된 뒤에만 필요하다', 'JSON 키가 없으면 항상 빈 문자열로 바꿔야 한다'],
  ['리팩터링은 동작을 유지한 채 구조를 읽기 쉽게 만든다', '리팩터링은 테스트 없이 이름만 바꾸는 일이다', '함수 이름은 짧을수록 항상 좋다'],
  ['요구사항에는 정상 흐름과 실패 흐름을 함께 적는다', '프로젝트 설계는 코드부터 쓰면 자동으로 끝난다', '데이터 모델은 화면을 만든 뒤에만 정한다'],
  ['완료 기준은 측정 가능한 동작으로 기록한다', '회고는 기억이 나지 않도록 세부를 빼야 한다', '다음 계획은 기간을 정할 필요가 없다'],
];

const traceAnswers = [
  (week, day) => String(week + day + 1), (week, day) => 'retry', () => '6', (week, day) => String((week + day) * 1.1),
  () => '[1, 2, 3]', () => '0', (week, day) => String(week + day), () => 'text', () => 'generator', () => 'Counter',
  () => 'load_title', () => 'completed_count', () => '["hello", " python"]', () => 'datetime', () => 'config.json', () => 'Course',
  () => 'test_double', () => 'logging.info', () => '{1, 2}', () => 'payload', () => 'results', () => 'args.file',
  () => 'data', () => 'format_title', () => 'summarize', () => 'review_plan',
];

const advancedDailyChoiceHints = {
  19: [
    '목록의 입력 순서를 보존하면서 이미 본 값을 어디에서 확인하는지 살펴보세요.',
    'java 키가 없을 때 대괄호 조회와 get의 기본값 처리가 어떻게 다른지 보세요.',
    'sorted가 새 목록을 만드는 시점과 정렬에 드는 비용을 구분하세요.',
    '바깥 반복 한 번마다 안쪽 반복이 몇 번 실행되는지 세어 보세요.',
    '같은 입력과 반복 횟수로 측정하더라도 시간값은 실행 환경에 따라 달라질 수 있어요.',
  ],
  20: [
    '이 API가 200뿐 아니라 다른 성공 응답도 돌려주는지 상태 코드 계약을 확인하세요.',
    '요청이 끝나지 않을 때 기다릴 수 있는 시간을 제한하는 설정을 찾으세요.',
    '응답 본문을 JSON 값으로 바꾼 뒤 count 키에서 어떤 값을 읽는지 따라가세요.',
    'all에 전달되는 원소가 하나도 없을 때 조건이 어떻게 판정되는지 확인하세요.',
    '내부 예외 문구와 사용자에게 보여 줄 안전한 안내를 구분하세요.',
  ],
  21: [
    '취소를 알리는 예외를 잡은 뒤 다시 전달하는지, 조용히 삼키는지 확인하세요.',
    'return_exceptions=True일 때 결과 목록의 각 원소가 예외 객체일 수도 있어요.',
    '작업이 CPU 중심인지 대기 중심인지에 따라 스레드 선택이 달라집니다.',
    '별도 프로세스에 넘길 함수와 인자가 직렬화 가능한지 확인하세요.',
    '여러 작업이 같은 값을 바꿀 때 읽기·더하기·저장을 보호하는 범위를 살펴보세요.',
  ],
  22: [
    '인자를 받지 않았을 때 parser가 어떤 값이나 오류를 만들지 확인하세요.',
    '정상 결과와 오류 안내가 각각 stdout과 stderr 중 어디로 가야 하는지 구분하세요.',
    '잘못된 입력으로 끝날 때 운영체제가 성공과 실패를 구별할 종료 코드를 확인하세요.',
    '한 함수가 명령 해석, 저장, 업로드, 알림을 모두 맡고 있는지 보세요.',
    'parser에 등록한 옵션 설명과 만들어진 도움말 출력이 어떻게 연결되는지 따라가세요.',
  ],
  23: [
    'JSON에서 읽은 minutes가 숫자인지, bool처럼 int의 하위 타입인 값인지 확인하세요.',
    '새 파일을 완성하기 전에 기존 파일을 덮어쓰는 경로가 있는지 보세요.',
    'minutes가 없을 때 get이 돌려주는 값과 정수 자료형 검사를 차례로 확인하세요.',
    '백업을 적용하기 전에 버전과 필수 필드를 검증하는지 살펴보세요.',
    '복구 성공과 실패에서 각각 상태와 원인이 어떻게 기록되는지 따라가세요.',
  ],
  24: [
    '함수 이름과 매개변수만 보고 입력과 수행 동작을 짐작할 수 있는지 살펴보세요.',
    'set으로 바꾸는 과정에서 원래 목록의 순서를 유지한다는 보장이 있는지 확인하세요.',
    '저장 구현을 함수 안에서 직접 만들지, 호출자가 전달하는지 구분하세요.',
    '두 조건이 겹칠 때 뒤쪽 대입이 앞선 결과를 덮어쓰는지 확인하세요.',
    '입력 검증을 먼저 마친 뒤 저장 함수를 호출하는 흐름인지 따라가세요.',
  ],
  25: [
    '읽기, 검증, 적용의 순서가 예제의 실제 계약과 일치하는지 확인하세요.',
    '저장 전에 제목과 분 값의 자료형, 값의 범위를 각각 살펴보세요.',
    '복구 실패를 정상적인 빈 자료처럼 반환하면 호출자가 구별할 수 있는지 생각하세요.',
    '정상 백업뿐 아니라 손상·누락·빈 입력에서 기대하는 결과도 포함됐는지 확인하세요.',
    '각 준비 검사가 통과했는지와 실패 항목이 남았는지를 따로 살펴보세요.',
  ],
  26: [
    '필수 점검 목록의 각 결과가 모두 통과해야 완료로 판정되는지 확인하세요.',
    '정상 합계, 빈 목록, minutes 누락의 기대값을 각각 실제 함수 결과와 대조하세요.',
    '입력 크기와 반복 횟수를 고정했는지, 시간값 자체를 보장한다고 오해하지 않았는지 확인하세요.',
    '도움말 문자열에 parser에 등록한 옵션 이름이 그대로 들어가는지 살펴보세요.',
    '각 주제에 다음 행동과 확인 가능한 성공 기준이 모두 있는지 확인하세요.',
  ],
};

function conceptQuestion(id, week, day, title, code) {
  const dailyCase = advancedReviewCase(week, day);
  const feedback = advancedDailyFeedback[week]?.[day - 1] ?? (week === 17 && day === 5 ? {
    choice: [
      '고친 버그를 재현하던 입력과 기대 결과를 남겨두면 같은 문제가 돌아왔을 때 발견할 수 있습니다.',
      '같은 버그가 다시 발생하면 회귀 테스트가 실패해야 문제를 알 수 있습니다.',
      '수정 후에도 테스트를 남겨두어 나중에 같은 문제가 생겼는지 확인합니다.',
    ],
    summary: '빈 목록의 합이 0인지 확인하는 사례는 같은 오류가 다시 생기는지 점검합니다.',
  } : undefined);
  const options = dailyCase?.choice ?? weekChecks[week - 1];
  const answerIndex = dailyCase ? 0 : (week + day) % options.length;
  const ordered = [...options];
  const [correct] = ordered.splice(0, 1);
  ordered.splice(answerIndex, 0, correct);
  const revisedChoice = (week === 17 && day === 5) || (week === 25 && day === 5) || week === 26;
  const choiceId = `${id}-choice${revisedChoice ? '-v2' : ''}`;
  return choice(choiceId, `${title} 개념 확인`, `Python ${week}주차 ${day}일 · ${title}: 맞는 설명을 고르세요.\n\n${code}`, ordered.map((text, index) => [text, feedback
    ? feedback.choice[index]
    : index === answerIndex
    ? `“${text}”는 ${title}의 실제 동작과 맞아 코드가 의도한 결과를 만듭니다.`
    : `“${text}”는 ${title}에서 필요한 입력·자료형·제어 흐름 중 하나를 놓칩니다.`]), answerIndex, feedback?.choiceHint ?? advancedDailyChoiceHints[week]?.[day - 1] ?? '코드에서 값을 만들고, 바꾸고, 반환하거나 기다리는 지점을 표시해 보세요.', feedback?.summary ?? `${ordered[answerIndex]} 예시를 문법 모양만 보고 판단하지 말고, 실제 값과 제어 흐름을 따라가면 확인할 수 있습니다.`);
}

const pythonTraceExplanations = {
  16: [
    'dataclass가 만든 생성자에 "Python"을 전달했으므로 title 속성은 Python입니다.',
    'default_factory=list가 객체마다 새 목록을 만듭니다. 첫 목록에 Python을 추가해도 둘째 목록은 []로 남아 출력은 [\'Python\'] []입니다.',
    'Code("py")의 value는 py입니다. frozen=True여도 생성한 필드 값을 읽을 수 있습니다.',
    '두 Code 객체는 같은 클래스이고 value가 모두 py이므로 dataclass의 기본 비교 결과가 True입니다.',
    'dataclass가 만든 문자열 표현에 클래스 이름과 필드 값이 표시되어 CourseId(value=1)이 출력됩니다.',
  ],
  17: [
    'double(3)은 6이므로 assert를 통과하고 다음 줄에서 ok를 출력합니다.',
    '빈 목록은 거짓으로 판단되어 조건식의 else가 선택되고 None이 반환됩니다.',
    'int("bad")가 예상한 ValueError를 발생시키므로 assertRaises를 통과한 뒤 expected를 출력합니다.',
    'make_record를 두 번 호출해 별도 딕셔너리를 만들었으므로 첫 번째를 바꿔도 두 번째 done은 False입니다.',
    '빈 목록 합계 0을 검사한 뒤 [1, 2]의 합인 3을 출력합니다.',
  ],
  18: [
    'report의 actual 키에 기록된 값은 UnicodeDecodeError이므로 그 문자열이 출력됩니다.',
    'logging.warning은 경고 로그를 남기고, 다음 print는 문자열 warning을 출력합니다.',
    'traceback의 마지막 항목은 0으로 나누기가 발생한 calculate 함수이므로 그 이름이 출력됩니다.',
    'int("x")의 ValueError를 새 예외의 원인으로 연결했으므로 __cause__의 타입 이름은 ValueError입니다.',
    '입력이 None이므로 normalize는 빈 문자열을 반환합니다. repr이 그 빈 문자열을 두 따옴표로 표시합니다.',
  ],
};

const advancedDailyTraceHints = {
  16: [
    'Course("Python")에 전달한 값이 생성된 인스턴스의 title에 들어갑니다.',
    '두 Course를 만든 뒤 첫 tags에만 항목을 추가하고 두 번째 tags가 그대로 비어 있는지 비교하세요.',
    'frozen은 필드 재대입을 막지만 생성된 value를 읽는 것은 허용합니다.',
    '두 값이 같은 클래스인지와 dataclass 필드 값이 같은지를 차례로 비교하세요.',
    'dataclass의 기본 문자열 표현에 클래스 이름과 필드 값이 어떻게 들어가는지 확인하세요.',
  ],
  17: [
    'double(3)의 반환값을 먼저 계산하고 assert가 통과하는지 확인하세요.',
    '빈 목록은 조건식에서 참인지 거짓인지 판단한 뒤 선택되는 반환값을 보세요.',
    'int 변환이 던지는 예외가 assertRaises의 기대 종류와 같은지 확인하세요.',
    'make_record를 두 번 부를 때 각 호출이 같은 딕셔너리를 돌려주는지 살펴보세요.',
    '빈 목록의 합과 [1, 2]의 합이 출력 순서대로 무엇인지 계산하세요.',
  ],
  18: [
    '출력식이 report에서 읽는 키가 무엇인지 확인하고 그 값만 답하세요.',
    'logging.warning의 로그와 print가 표준 출력에 쓰는 문자열을 구분하세요.',
    '예외에 연결된 프레임 목록에서 마지막 함수 이름을 확인하세요.',
    'raise ... from 구문이 새 예외에 연결한 원래 예외의 형식을 확인하세요.',
    'name이 None일 때 normalize의 분기와 repr이 빈 문자열을 표시하는 방식을 보세요.',
  ],
  19: [
    'seen에 이미 들어 있는 값은 건너뛰고 처음 만난 값만 unique에 추가됩니다.',
    '딕셔너리에 java 키가 있는지와 get의 두 번째 인수가 하는 일을 보세요.',
    'sorted가 만든 목록의 오름차순 값과 print의 반복 대상을 확인하세요.',
    '안쪽 반복은 바깥 반복마다 두 번 실행됩니다. count가 몇 번 증가하는지 세세요.',
    'timeit은 지정한 작업을 여러 번 재고 경과 시간을 실수형으로 돌려줍니다.',
  ],
  20: [
    '상태 코드 201이 200 이상 300 미만 조건을 만족하는지 계산하세요.',
    '모형 client가 실제 통신을 하지 않고 호출에 전달된 timeout을 어디에 보관하는지 보세요.',
    '응답 JSON의 count 키에 들어 있는 값을 따라가세요.',
    'payload["items"]의 자료형과 원소 개수를 확인하고 all의 결과를 판단하세요.',
    'status가 500일 때 내부 오류가 아닌 사용자 안내 분기가 선택되는지 확인하세요.',
  ],
  21: [
    '취소된 worker의 정리 기록 뒤 CancelledError가 다시 전달되는 순서를 추적하세요.',
    'gather의 두 번째 결과가 예외 객체인지 확인한 뒤 코드가 출력하는 형식 이름을 보세요.',
    '각 모형 작업이 돌려주는 값을 입력 순서대로 results에 담는지 확인하세요.',
    '각 입력을 square에 넣어 반환 목록을 차례로 계산하세요.',
    '네 작업이 각각 100번 증가시키고 잠금이 갱신을 보호하는지 확인하세요.',
  ],
  22: [
    '--file 뒤의 문자열이 parse_args 결과의 어느 속성에 들어가는지 보세요.',
    '두 버퍼에 각각 쓰인 문자열을 구분한 뒤 출력 순서대로 적으세요.',
    'SystemExit에 전달한 숫자는 출력이 아니라 프로세스 종료 코드입니다.',
    'records 목록의 길이를 구한 뒤 반환 문자열에 넣으세요.',
    'format_help의 옵션 설명과 빈 인자 실행에서 발생하는 종료 코드를 확인하세요.',
  ],
  23: [
    'title은 문자열이고 minutes는 bool이 아닌 정수인지 각각 검사하세요.',
    '임시 파일의 내용을 교체한 뒤 JSON으로 읽은 레코드가 무엇인지 확인하세요.',
    'minutes 키가 없을 때 get이 돌려주는 값이 정수 조건을 통과하는지 보세요.',
    'version이 정수 1인지, records가 목록인지 각각 확인하세요.',
    '성공 호출과 OSError 호출이 출력하는 상태·건수·실패 이유를 순서대로 적으세요.',
  ],
  24: [
    'strip 후 title 변환이 적용되는 입력 문자열을 따라가세요.',
    'dict.fromkeys가 첫 등장 순서를 유지한 채 중복 키를 하나로 만드는지 보세요.',
    'save가 writer(record)를 호출한 뒤 전달된 lambda가 무엇을 돌려주는지 확인하세요.',
    'status가 done일 때 두 if가 모두 실행되어 result를 어느 값으로 바꾸는지 보세요.',
    'title 검증 통과 후 writer가 호출되고 반환값이 어떻게 전달되는지 확인하세요.',
  ],
  25: [
    'steps 목록의 세 항목을 순서대로 화살표로 연결하세요.',
    'title과 minutes의 자료형, 내용, 허용 범위를 하나씩 검사한 결과를 확인하세요.',
    'OSError 분기에서 반환하는 상태와 정상 경로의 실행 여부를 구분하세요.',
    '네 시나리오 각각의 결과와 기대값을 비교한 뒤 통과 수를 세세요.',
    '모든 검사 결과 중 False가 하나라도 있으면 ready가 어떻게 되는지 확인하세요.',
  ],
  26: [
    'required 목록 중 False인 항목이 있는지 확인하고 all의 결과를 판단하세요.',
    '세 입력에 대한 합계가 각각 3, 0, 2인지 기대값과 비교하세요.',
    'timeit의 실행 조건과 반환 자료형을 보고 실제 경과 시간이 고정값인지 구분하세요.',
    'parser의 format_help 결과에 등록한 --backup이 포함되는지 확인하세요.',
    '네 계획 항목의 topic, next_action, success가 모두 채워졌는지 확인하세요.',
  ],
};

function traceQuestion(id, week, day, title, code) {
  const feedback = advancedDailyFeedback[week]?.[day - 1];
  const answer = advancedExample(week, day)?.answer ?? traceAnswers[week - 1](week, day);
  const acceptedAnswers = Array.isArray(answer) ? answer : [answer];
  const condition = week === 15 && day === 4
    ? '이 실행에서는 `STUDY_MODE` 환경 변수가 설정되지 않았다고 가정합니다.\n\n'
    : week === 18 && day === 2
      ? '표준 출력에서 `print`가 표시하는 값만 답하세요. `logging.warning`이 남기는 로그는 표준 오류에 따로 기록됩니다.\n\n'
      : week === 20 && day === 2
        ? '아래 DemoClient는 네트워크에 연결하지 않고 timeout 값 전달만 확인하는 모형입니다.\n\n'
      : '';
  const versionedTrace = (week === 13 && day === 5)
    || (week === 14 && day === 5)
    || (week === 16 && day === 2)
    || (week === 17 && day === 3)
    || (week === 18 && [1, 3, 4, 5].includes(day))
    || (week === 19 && [4, 5].includes(day))
    || (week === 20 && [2, 5].includes(day))
    || week === 21
    || week === 22
    || week === 23
    || (week === 24 && day >= 4)
    || week === 25
    || week === 26;
  const traceVersion = week === 25 && day === 1 ? '-v3' : versionedTrace ? '-v2' : '';
  const versionedId = `${id}-trace${traceVersion}`;
  const explanation = feedback?.trace ?? pythonTraceExplanations[week]?.[day - 1] ?? `이 예시의 기준 답은 ${acceptedAnswers[0]}입니다. ${title}에서는 값이 바뀌는 시점과 새 객체를 반환하는지 여부를 분리해서 읽어야 합니다.`;
  const runtimeContext = feedback?.runtime ? `${feedback.runtime}\n\n` : '';
  const exitStatusContext = week === 22 && day === 3 ? '이 코드는 `SystemExit(2)`로 종료합니다. 표준 출력 결과가 아니라 프로세스 종료 코드를 입력하세요.\n\n' : '';
  return outputTrace(versionedId, `${title} 코드 읽기`, `Python ${week}주차 ${day}일 · ${title}: 실행 결과를 입력하세요.\n\n${condition}${exitStatusContext}${runtimeContext}${code}`, acceptedAnswers, feedback?.traceHint ?? advancedDailyTraceHints[week]?.[day - 1] ?? '대입, 호출, 반환의 순서를 한 줄씩 표시하고 추측으로 답하지 마세요.', explanation);
}

const repairSpecs = [
  ['parse_age', 'def parse_age(raw):\n    return raw + 1', 'def parse_age(raw):\n    return int(raw) + 1', '문자열 나이를 정수로 바꾼 뒤 1을 더해 반환하세요.', '"17"', '18'],
  ['has_title', 'def has_title(title):\n    return True', 'def has_title(title):\n    return bool(title and title.strip())', 'None이나 공백뿐인 제목은 거부하고 실제 문자가 있을 때만 True를 반환하세요.', '"   "', 'False'],
  ['even_values', 'def even_values(values):\n    return values', 'def even_values(values):\n    return [value for value in values if value % 2 == 0]', '목록 컴프리헨션으로 짝수만 새 목록에 담으세요.', '[1, 2, 3, 4]', '[2, 4]'],
  ['discounted', 'def discounted(price, rate):\n    print(price * (1 - rate))', 'def discounted(price, rate):\n    return price * (1 - rate)', '계산한 할인 가격을 출력 대신 반환하세요.', '100, 0.2', '80.0'],
  ['filter_minutes', 'def filter_minutes(minutes, minimum):\n    return minutes', 'def filter_minutes(minutes, minimum):\n    return [value for value in minutes if value >= minimum]', '기준 시간 이상인 값만 새 목록으로 반환하세요.', '[45, 60, 80], 60', '[60, 80]'],
  ['nested_course_title', 'def nested_course_title(record):\n    return record["course"]["title"]', 'def nested_course_title(record):\n    course = record.get("course") or {}\n    return course.get("title", "제목 없음")', 'course 정보가 빠져도 기본 제목을 반환하도록 중첩 키를 안전하게 조회하세요.', '{"course": {"title": "Python"}}', 'Python'],
  ['parse_count', 'def parse_count(text):\n    try:\n        return int(text)\n    except:\n        return 0', 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0', '숫자 변환 실패만 처리하도록 예외 범위를 좁히세요.', '"three"', '0'],
  ['save_text_atomically', 'def save_text_atomically(path, text):\n    path.write_text(text, encoding="utf-8")', 'def save_text_atomically(path, text):\n    temporary = path.with_suffix(path.suffix + ".tmp")\n    temporary.write_text(text, encoding="utf-8")\n    temporary.replace(path)', '같은 디렉터리의 임시 파일을 먼저 완성한 뒤 목적 경로로 교체하세요.', 'Path("notes.txt"), "ready"', 'notes.txt에 ready 저장'],
  ['squares_until', 'def squares_until(limit):\n    return [number * number for number in range(limit)]', 'def squares_until(limit):\n    return (number * number for number in range(limit))', '모든 결과를 먼저 목록으로 만들지 않고 제곱값을 지연 생성하세요.', '3', '0, 1, 4를 차례로 생성하는 iterator'],
  ['StudySession', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return "now"', 'class StudySession:\n    def __init__(self, clock):\n        self.clock = clock\n    def label(self):\n        return self.clock.now()', '시계를 상속하지 않고 주입받은 객체의 now 동작에 위임하세요.', 'Clock.now() -> "09:00"', '09:00'],
  ['submit_cpu', 'def submit_cpu(executor, square, value):\n    return square(value)', 'def submit_cpu(executor, square, value):\n    return executor.submit(square, value)', 'CPU 작업 함수를 직접 실행하지 말고 executor에 제출해 Future를 반환하세요.', 'pool, square, 4', 'Future.result() -> 16'],
  ['completion_rate', 'def completion_rate(done, total):\n    return total / done * 100', 'def completion_rate(done, total):\n    if total == 0:\n        return 0\n    return done / total * 100', '완료 수를 전체 수로 나누고 전체가 0이면 0을 반환하세요.', '3, 5', '60.0'],
  ['course_number', 'import re\ndef course_number(label):\n    match = re.search(r"-(\\d+)$", label)\n    return match.group(1)', 'def course_number(label):\n    return label.split("-")[-1]', '고정된 하이픈 구분자로 마지막 조각을 얻을 때는 정규식 대신 문자열 분리를 사용하세요.', '"python-course-17"', '"17"'],
  ['serialize_event', 'import json\ndef serialize_event(value):\n    return json.dumps({"at": value})', 'def serialize_event(value):\n    return json.dumps({"at": value.isoformat()})', 'datetime 객체를 기본 JSON 인코더에 바로 넘기지 말고 ISO 형식 문자열로 변환한 다음 JSON 문자열을 반환하세요.', 'datetime(2026, 1, 2, tzinfo=timezone.utc)', '{"at": "2026-01-02T00:00:00+00:00"}'],
  ['read_limit', 'def read_limit(settings):\n    return int(settings["LIMIT"])', 'def read_limit(settings):\n    raw = settings.get("LIMIT")\n    return int(raw) if raw is not None else 10', '설정 LIMIT가 없으면 기본값 10을 반환하고 있으면 정수로 변환하세요. 0은 유효한 설정값입니다.', '{"LIMIT": "20"}', '20'],
  ['CourseId', 'from dataclasses import dataclass\n@dataclass\nclass CourseId:\n    value: int', 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass CourseId:\n    value: int', '식별자를 의미 있는 CourseId 데이터클래스로 감싸고, 값 객체의 필드 재대입을 막으세요.', 'CourseId(1)', 'CourseId(value=1)'],
  ['test_total_empty', 'def total(values):\n    return sum(values)\ndef test_total_empty():\n    assert total([]) == 1', 'def total(values):\n    return sum(values)\ndef test_total_empty():\n    assert total([]) == 0', '빈 목록 합계가 0이라는 회귀 테스트를 만들도록 잘못된 기대값을 고치세요.', 'total([])', 'assertion passes when total([]) is 0'],
  ['normalize', 'def normalize(name):\n    return name.lower().strip()', 'def normalize(name):\n    if name is None:\n        return ""\n    return name.strip()', 'None 입력은 빈 문자열로 처리하고, 다른 이름은 양끝 공백만 제거해 대소문자를 보존하세요.', 'None', '""'],
  ['read_json', 'def read_json(response):\n    return response.json', 'def read_json(response):\n    return response.json()', 'JSON 메서드를 호출해 파싱된 값을 반환하세요.', 'response', '파싱된 객체'],
  ['cancel_task', 'async def cancel_task(task):\n    task.cancel\n    return await task', 'async def cancel_task(task):\n    task.cancel()\n    return await task', '취소 메서드를 실제로 호출하세요.', 'task', '취소 요청'],
  ['read_options', 'def read_options(args):\n    return args.file', 'def read_options(args):\n    return Path(args.file)', '파일 인자를 경로 객체로 바꿔 이후 경로 연산을 명확하게 하세요.', 'Namespace(file="log.json")', 'Path("log.json")'],
  ['load_records', 'def load_records(data):\n    return data["records"]', 'def load_records(data):\n    if "records" not in data:\n        raise ValueError("records is required")\n    return data["records"]', '필수 키가 없을 때 의미 있는 오류를 내도록 검사하세요.', '{}', 'ValueError'],
  ['display_name', 'def display_name(name):\n    return name.lower().title()', 'def display_name(name):\n    return name.strip().title()', '이름의 대소문자보다 입력 양끝 공백 정리를 우선 적용하세요.', '"  mina  "', '"Mina"'],
  ['total_minutes', 'def total_minutes(records):\n    return sum(record["minutes"] for record in records)', 'def total_minutes(records):\n    return sum(record.get("minutes", 0) for record in records)', '누락된 minutes 키가 있어도 0분으로 집계하세요.', '[{"minutes": 10}, {}]', '10'],
  ['next_review', 'def next_review(done):\n    return [day for day in done]', 'def next_review(done):\n    return [day for day in range(1, 8) if day not in done]', '완료한 날이 아닌 다음 복습 후보일만 반환하세요.', '{1, 3}', '[2, 4, 5, 6, 7]'],
  ['review_plan', 'def review_plan(weak_topics):\n    return []', 'def review_plan(weak_topics):\n    return [f"다음 학습: {topic}" for topic in weak_topics]', '약점 주제마다 다음 학습 항목을 돌려주세요.', '["exceptions", "asyncio"]', '주제별 복습 항목 두 개'],
];

repairSpecs[18] = ['benchmark_contains', 'def benchmark_contains(values, target):\n    return target in values', 'import timeit\ndef benchmark_contains(values, target):\n    return timeit.timeit(lambda: target in values, number=100)', 'timeit으로 포함 확인을 100회 반복해 측정값을 반환하세요.', 'values=[1, 2, 3], target=3', 'non-negative float; varies by machine'];
repairSpecs[19] = ['public_error', 'def public_error(status, detail):\n    return {"status": status, "message": detail}', 'def public_error(status, detail):\n    if status == 400:\n        message = "입력값을 확인해 주세요."\n    elif status >= 500:\n        message = "잠시 후 다시 시도해 주세요."\n    else:\n        message = "요청을 처리할 수 없습니다."\n    return {"status": status, "message": message}', '상태별 안전 안내를 반환하고 내부 오류 상세를 숨기세요.', '500, "token=secret"', '{"status": 500, "message": "잠시 후 다시 시도해 주세요."}'];
repairSpecs[20] = ['increment_many', 'from concurrent.futures import ThreadPoolExecutor\nfrom threading import Lock\ncounter = 0\nlock = Lock()\ndef increment_many(_):\n    global counter\n    for _ in range(100):\n        counter += 1\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    list(pool.map(increment_many, range(4)))', 'from concurrent.futures import ThreadPoolExecutor\nfrom threading import Lock\ncounter = 0\nlock = Lock()\ndef increment_many(_):\n    global counter\n    for _ in range(100):\n        with lock:\n            counter += 1\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    list(pool.map(increment_many, range(4)))', '읽기·수정·쓰기 구간을 잠금으로 보호하세요.', '4 workers x 100 increments', '400'];
repairSpecs[21] = ['parse_file_option', 'import argparse\ndef parse_file_option(parser, argv):\n    return parser.parse_args(argv)', 'import argparse\ndef parse_file_option(parser, argv):\n    parser.add_argument("--file", required=True, help="읽을 JSON 파일")\n    return parser.parse_args(argv)', '필수 --file 옵션을 도움말과 함께 등록하고 전달된 인자 목록을 파싱하세요.', 'parser=ArgumentParser(prog="study"), argv=["--file", "notes.json"]', 'Namespace(file="notes.json"); missing option exits with code 2'];
repairSpecs[22] = ['recovery_report', 'def recovery_report(records, error):\n    return {"ok": True, "recovered": len(records)}', 'def recovery_report(records, error):\n    if error is not None:\n        return {"ok": False, "error": type(error).__name__}\n    return {"ok": True, "recovered": len(records)}', '오류가 있으면 실패 상태와 제한된 오류 종류만 반환하고 성공 개수는 보고하지 마세요.', 'records=["py", "js"], error=None; records=[], error=OSError("disk unavailable")', 'success count 2; failure reports OSError without recovered count'];
repairSpecs[23] = ['save_course', 'def save_course(record, writer):\n    result = writer(record)\n    if not record.get("title"):\n        return "invalid"\n    return result', 'def save_course(record, writer):\n    title = record.get("title")\n    if not isinstance(title, str) or not title.strip():\n        return "invalid"\n    return writer(record)', '제목이 없거나 공백뿐이면 저장하지 말고, 유효한 제목만 writer에 전달하세요.', 'record={"title": "Python"}, writer=test_double', 'valid title calls writer once; missing or whitespace-only title never calls writer'];
repairSpecs[24] = ['release_report', 'def release_report(checks):\n    return {"ready": True, "failed": []}', 'def release_report(checks):\n    if not checks:\n        return {"ready": False, "failed": ["no_checks"]}\n    failed = [name for name, passed in checks.items() if not passed]\n    return {"ready": not failed, "failed": failed}', '점검이 없으면 준비 완료로 표시하지 말고, 통과하지 못한 점검 이름을 반환하세요.', '{"tests": True, "backup_restore": False}', '{"ready": False, "failed": ["backup_restore"]}'];
repairSpecs[25] = ['review_plan', 'def review_plan(weak_topics):\n    return [{"topic": topic, "next_action": "study more", "success": None} for topic in weak_topics]', 'def review_plan(weak_topics):\n    return [{"topic": topic, "next_action": f"Review one {topic} example", "success": f"Solve a new {topic} case"} for topic in weak_topics]', '약점 주제마다 구체적인 다음 행동과 확인 가능한 성공 조건을 포함해 계획을 만드세요.', '["exceptions", "asyncio"]', '2 plans with topic, next_action, and measurable success'];

const locateSpecs = [
  [['raw = "12"', 'age = raw + 1', 'print(age)'], 2, '문자열과 정수는 바로 더할 수 없어요. `int(raw) + 1`로 변환해야 합니다.'],
  [['score = 60', 'if score > 60:', '    print("pass")', 'else:', '    print("retry")'], 2, '60점도 통과라면 비교는 `>= 60`이어야 합니다.'],
  [['total = 0', 'for number in range(1, 3):', '    total += number', 'print(total)'], 2, '상한 3은 포함되지 않아 1과 2만 더합니다. 1부터 3까지라면 `range(1, 4)`가 필요합니다.'],
  [['def label(score):', '    if score >= 60:', '        return "pass"', '    return "pass"'], 4, '4번 줄은 조건이 거짓이어도 pass를 반환합니다. 실패 분기에는 `return "retry"`가 필요합니다.'],
  [['items = ["a", "b"]', 'print(items[2])'], 2, '길이 2 목록의 마지막 인덱스는 1입니다. `items[-1]` 또는 `items[1]`을 사용하세요.'],
  [['scores = {"mina": 90}', 'print(scores["jun"])'], 2, '없는 키는 KeyError를 냅니다. `scores.get("jun", 0)`처럼 기본값을 정하세요.'],
  [['try:', '    count = int(text)', 'except:', '    count = 0'], 3, 'bare except는 프로그래밍 오류까지 숨깁니다. `except ValueError:`로 좁히세요.'],
  [['file = open("notes.txt")', 'return file.read()'], 1, '직접 연 파일은 예외가 나면 닫히지 않을 수 있습니다. `with open(...) as file:`을 사용하세요.'],
  [['numbers = (n for n in range(3))', 'for number in numbers:', '    print(number)', 'for number in numbers:', '    print(number)'], 4, '첫 반복 뒤 제너레이터는 소진됩니다. 새 제너레이터를 만들거나 목록으로 보관하세요.'],
  [['class User:', '    def _init_(self, name):', '        self.name = name'], 2, '생성자는 `_init_`이 아니라 양쪽 밑줄 두 개의 `__init__`입니다.'],
  [['async def title(client):', '    response = client.get("/title")', '    return response.text'], 2, '코루틴을 응답으로 쓰려면 `await client.get(...)`가 필요합니다.'],
  [['done = 3', 'total = 5', 'rate = total / total * 100'], 3, '완료율의 분자는 done입니다. `done / total * 100`으로 고치세요.'],
  [['text = "  python  "', 'print(text.strip)',], 2, '메서드 객체가 아니라 정리된 문자열이 필요합니다. `text.strip()`로 호출하세요.'],
  [['from datetime import datetime', 'now = datetime.now()', 'print(now.astimezone())'], 2, '시간대 없는 datetime은 기준 시각이 불명확합니다. timezone-aware 값을 만드세요.'],
  [['path = Path("data")', 'path.mkdir()', 'path.mkdir()'], 3, '이미 있는 디렉터리에서 오류가 날 수 있습니다. `exist_ok=True`를 사용하세요.'],
  [['@dataclass', 'class Course:', '    tags: list = []'], 3, 'Python 3.11 이상 dataclasses는 해시할 수 없는 가변 기본값을 거부해 클래스 정의 때 ValueError를 냅니다. `field(default_factory=list)`로 인스턴스마다 목록을 만드세요.'],
  [['def test_empty():', '    assert double(0) == 1'], 2, 'double(0)은 0이어야 합니다. 경계값 기대값을 바로잡으세요.'],
  [['try:', '    load_records()', 'except Exception:', '    pass'], 3, '오류를 조용히 버리면 원인을 찾을 수 없습니다. 처리하거나 로그와 함께 다시 올리세요.'],
  [['seen = []', 'for value in values:', '    if value not in seen:', '        seen.append(value)'], 3, '큰 목록에서 매번 목록 탐색은 느립니다. 포함 확인에는 set을 고려하세요.'],
  [['response = client.get(url)', 'payload = response.json()', 'return payload'], 1, '네트워크 요청에는 timeout과 상태 확인이 필요합니다.'],
  [['async def run():', '    return await cpu_heavy_work()'], 2, 'CPU 중심 동기 함수는 await할 수 없습니다. 프로세스/스레드 실행 경계를 정하세요.'],
  [['parser.add_argument("--file")', 'args = parser.parse_args()', 'open(args.file).read()'], 1, '필수 입력이라면 `required=True`를 지정하거나 None을 검증해야 합니다.'],
  [['data = json.loads(text)', 'records = data["records"]'], 2, '외부 데이터에는 키 누락이 있을 수 있습니다. 구조를 검증하고 오류를 설명하세요.'],
  [['def render(name):', '    return normalise(name)', 'def normalize(name):', '    return name.strip()'], 2, '2번 줄의 `normalise`는 정의되지 않았습니다. 함수 이름을 `normalize(name)`으로 맞춰 NameError를 고치세요.'],
  [['def save(records):', '    write_file(records)', '    return True'], 2, '저장 실패를 호출자에게 알리지 못합니다. 예외를 다루거나 실패 결과를 명확히 반환하세요.'],
  [['def complete(plan):', '    return True'], 2, '완료 기준을 확인하지 않고 항상 True를 반환합니다. 측정 가능한 검사를 추가하세요.'],
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '[\\s\\S]*');

const repairQuestionOverrides = {
  13: {
    titleSuffix: '구분자로 접미사 얻기',
    taskInstruction: 'label은 비어 있지 않은 하이픈 구분 접미사를 가진 유효한 과정 이름이라고 가정합니다. 정규식 대신 split으로 마지막 조각을 문자열로 반환하세요.',
    requirements: ['하이픈으로 나눈 마지막 조각을 반환해요.', '유효 입력의 접미사를 문자열로 보존해요.'],
    constraints: ['label 형식 검증이나 숫자 변환은 이 함수의 범위가 아니에요.', '전체 함수 구조를 정적으로 확인하며 사이트에서 Python을 실행하지 않아요.'],
    examples: [{ input: '"python-course-17"', output: '"17"' }],
    tests: [{ input: '"python-course-17"', expected: '"17"' }, { input: '"unit-python-27"', expected: '"27"' }, { input: '"course-004"', expected: '"004"' }],
    gradingNote: '실행 채점이 아닙니다. 전체 함수에서 고정 구분자 split 후 마지막 문자열 조각을 반환하는 구조를 정적으로 확인합니다. 형식이 잘못된 입력의 유효성 검사는 요구하지 않습니다.',
    hint: '정규식 Match를 만들 필요가 없습니다. `label.split("-")` 결과에서 마지막 항목을 선택하세요.',
    explanation: '접미사가 유효하다는 전제 아래 마지막 조각만 필요합니다. split은 숫자 문자열의 선행 0도 보존하며, 입력 형식 검증이 필요하다면 별도 책임으로 추가해야 합니다.',
  },
  14: {
    titleSuffix: '시간대 포함 ISO 형식',
    taskInstruction: 'value는 timezone-aware datetime이라고 가정합니다. 객체를 기본 JSON 인코더에 넘기지 말고 ISO 문자열로 바꾸어 at 키의 JSON 문자열을 반환하세요.',
    requirements: ['value.isoformat() 문자열을 at 값으로 사용해요.', 'json.dumps 결과인 문자열을 반환해요.'],
    constraints: ['value를 문자열로 먼저 바꾸고 timezone 오프셋을 보존해요.', '정적 함수 구조 검사이며 브라우저에서 Python 코드를 실행하지 않아요.'],
    examples: [{ input: '2026-01-02 00:00 UTC', output: '{"at": "2026-01-02T00:00:00+00:00"}' }],
    tests: [
      { input: 'datetime(2026, 1, 2, tzinfo=timezone.utc)', expected: '{"at": "2026-01-02T00:00:00+00:00"}' },
      { input: 'datetime(2026, 1, 2, 9, tzinfo=timezone(timedelta(hours=9)))', expected: '{"at": "2026-01-02T09:00:00+09:00"}' },
    ],
    gradingNote: '실행형 채점이 아닙니다. timezone-aware 입력의 오프셋을 보존하는 isoformat 호출과 json.dumps 결과 반환을 정적으로 확인합니다. 역직렬화까지 수행하는 문항은 아닙니다.',
    hint: 'JSON이 기본으로 아는 값으로 바꾸려면 datetime 객체에서 어떤 문자열 표현을 얻을지 확인하세요.',
    explanation: '기본 JSON 인코더는 datetime을 바로 처리하지 못합니다. isoformat은 오프셋을 포함하는 문자열을 만들고 json.dumps는 그 문자열을 JSON 텍스트로 인코딩합니다. 읽을 때 datetime으로 되돌리는 작업은 별개입니다.',
  },
  15: {
    titleSuffix: '경계 처리',
    promptPrefix: '',
    taskInstruction: 'LIMIT가 없거나 None이면 10을 반환하고, 그 외 값은 int로 변환하세요. 문자열 "0"은 유효한 0으로 보존해야 합니다.',
    requirements: ['키 누락과 None에는 기본값 10을 반환해요.', '0을 기본값으로 바꾸지 않고 정수 0을 반환해요.'],
    constraints: ['숫자가 아닌 설정의 ValueError는 이 함수에서 숨기지 않아요.', '정적 함수 구조 검사이며 Python 코드를 실행해 채점하지 않아요.'],
    examples: [{ input: '{"LIMIT": "20"}', output: '20' }, { input: '{"LIMIT": "0"}', output: '0' }, { input: '{}', output: '10' }],
    tests: [{ input: '{"LIMIT": "0"}', expected: 0 }, { input: '{}', expected: 10 }, { input: '{"LIMIT": None}', expected: 10 }, { input: '{"LIMIT": "many"}', expected: 'ValueError가 전파됨' }],
    gradingNote: '실행형 채점이 아닙니다. None을 기본값으로 분기하고 그 외 값을 int로 바꾸는 전체 함수 구조를 정적으로 확인합니다.',
    hint: '참거짓 검사 대신 값이 None인지 확인하면 숫자 0을 보존할 수 있어요.',
    explanation: '0은 유효한 설정값이므로 `raw or 10`은 맞지 않습니다. None만 기본값으로 보고 나머지를 int로 변환하며, 잘못된 숫자 문자열의 ValueError는 호출자에게 남깁니다.',
  },
  16: {
    exerciseTitle: 'CourseId 값 객체 정의 고치기',
    instruction: '아래 데이터클래스 정의를 요구사항에 맞춰 수정하세요.',
    requirements: ['CourseId를 값 객체로 선언해요.', 'frozen=True로 값을 초기화한 뒤 필드 재대입을 금지해요.'],
    constraints: ['value 필드와 생성자 형태를 보존해요.', '정적 구조 확인이며 사이트에서 Python 코드를 실행하지 않아요.'],
    examples: [{ input: 'CourseId(1)', output: 'CourseId(value=1)' }],
    tests: [
      { input: 'CourseId(1)', expected: 'dataclass with frozen=True and value field' },
      { input: 'CourseId(1).value = 2', expected: 'FrozenInstanceError at runtime; structure is not executed by this exercise' },
    ],
    gradingNote: '실행형 채점이 아닙니다. 완전한 CourseId 데이터클래스와 frozen=True 구조가 답안에 있는지 정적으로 확인합니다. 실제 불변성 동작은 로컬 예제로 확인해야 합니다.',
    hint: 'dataclass의 frozen 기본값은 False입니다. 클래스 정의에 어떤 설정을 명시해야 하는지 확인하세요.',
    explanation: 'CourseId는 숫자 그 자체보다 의미가 분명한 식별자 타입입니다. frozen=True는 속성 재대입을 막는 얕은 불변 동작을 제공하지만, 안쪽 객체까지 깊게 불변으로 만들지는 않습니다.',
  },
  17: {
    exerciseTitle: '빈 목록 합계 기대값 고치기',
    instruction: '아래 테스트의 잘못된 기대값을 수정하세요.',
    requirements: ['독립된 test_total_empty 함수를 유지해요.', '빈 목록의 합이 0임을 assert로 확인해요.'],
    constraints: ['total 함수의 구현은 변경하지 않고 테스트 조건을 바로잡아요.', '사이트는 테스트 코드를 실행하지 않고 요구 구조만 정적으로 검사해요.'],
    examples: [{ input: 'total([])', output: '0' }],
    tests: [
      { input: 'total([])', expected: 'assertion passes for 0' },
      { input: 'total([2, 3])', expected: '5' },
    ],
    gradingNote: '실행형 채점이 아닙니다. 테스트 함수 전체와 빈 목록에 대한 정확한 assertion 형태를 확인합니다. 테스트 실행 결과를 보장하지 않습니다.',
    hint: 'sum의 시작값은 빈 iterable에서 0입니다. 문제는 구현이 아니라 기대값에 있습니다.',
    explanation: '회귀 테스트는 관찰된 조건을 다시 검사할 수 있는 사례로 남깁니다. 빈 목록의 합을 1로 기대하면 정상 구현도 잘못 실패하므로 0을 검사해야 합니다.',
  },
  18: {
    exerciseTitle: 'None 입력 처리 함수 고치기',
    instruction: '아래 함수에 필요한 입력 경계 처리만 추가하세요.',
    requirements: ['None이면 빈 문자열을 반환해요.', '그 외 입력은 양끝 공백만 지우고 대소문자를 보존해요.'],
    constraints: ['입력 객체를 변경하지 않아요.', '정적 함수 구조 검사이며 브라우저에서 코드를 실행하지 않아요.'],
    examples: [{ input: 'None', output: '""' }, { input: '"  Mina  "', output: '"Mina"' }],
    tests: [
      { input: 'None', expected: '""' },
      { input: '"  Mina  "', expected: '"Mina"' },
      { input: '"Python"', expected: '"Python"' },
    ],
    gradingNote: '실행형 채점이 아닙니다. 전체 함수 정의, None 경계 분기, 반환값을 정적 패턴으로 확인합니다. 실제 입력별 결과는 직접 실행해 검토하세요.',
    hint: '메서드를 호출하기 전에 name이 None인지 확인하고, 그 외에는 기존 표기를 보존하세요.',
    explanation: '최소 수정은 재현된 None 입력 경로만 안전하게 처리하고 다른 입력의 대소문자 표기까지 바꾸지 않습니다.',
  },
  19: {
    exerciseTitle: '실행 시간 측정 함수 고치기',
    taskInstruction: 'timeit으로 포함 확인을 반복 측정하고 경과 시간을 반환하도록 수정하세요.',
    instruction: '아래 함수를 요구사항에 맞게 수정하세요.',
    requirements: ['timeit.timeit으로 포함 확인을 반복 실행해요.', 'number=100으로 반복 횟수를 제한해요.', '출력하지 말고 측정된 경과 시간을 반환해요.'],
    constraints: ['시간 결과는 환경에 따라 달라지므로 특정 숫자에 맞추지 않아요.', '정적 구조 확인이며 답안 코드는 실행하지 않아요.'],
    examples: [{ input: 'values=[1, 2, 3], target=3', output: '0 이상인 float; 실제 값은 환경에 따라 달라짐' }],
    tests: [{ input: 'values=[1, 2, 3], target=3', expected: 'non-negative float and 100 repetitions' }, { input: 'values=[], target=0', expected: 'non-negative float and 100 repetitions' }],
    gradingNote: '실행형 채점이 아닙니다. 함수 전체에서 timeit.timeit 호출, 포함 확인, number=100, 반환 흐름을 정적으로 확인합니다. 실제 측정 시간은 시스템에 따라 다릅니다.',
    hint: '한 번의 비교 결과가 아니라 같은 입력으로 포함 확인을 반복하도록 timeit에 호출을 전달하세요.',
    explanation: 'timeit은 작은 코드의 반복 실행 시간을 측정합니다. 결과는 입력·반복 설정·Python 구현·기기 상태에 따라 달라지므로 고정된 속도 숫자로 비교하지 않습니다.',
  },
  20: {
    taskInstruction: '오류 상세를 노출하지 않고 상태별 공개 안내를 반환하도록 수정하세요.',
    titleSuffix: '공개 오류 응답 고치기',
    instruction: '아래 함수가 상태별 안전한 안내를 반환하도록 수정하세요.',
    requirements: ['400 상태에는 입력 수정 안내를 반환해요.', '500 이상에는 잠시 후 재시도 안내를 반환해요.', '그 밖의 상태에는 일반 실패 안내를 반환해요.', 'status는 유지하되 detail은 공개 응답에 넣지 않아요.'],
    constraints: ['비밀번호·토큰·스택 정보를 메시지에 포함하지 않아요.', '전체 함수를 유지하고 정적 구조 확인으로 채점해요.'],
    examples: [{ input: '500, "token=secret"', output: '{"status": 500, "message": "잠시 후 다시 시도해 주세요."}' }, { input: '400, "invalid"', output: '{"status": 400, "message": "입력값을 확인해 주세요."}' }],
    tests: [{ input: '500, "password=secret"', expected: 'generic retry message with status 500; detail omitted' }, { input: '400, "bad input"', expected: 'input guidance with status 400' }, { input: '404, "private detail"', expected: 'generic failure message with status 404' }],
    gradingNote: '실행형 채점이 아닙니다. 세 상태 분기와 status 보존, 입력 detail이 반환 객체에 포함되지 않는 답안 구조를 정적으로 확인합니다.',
    hint: '외부 메시지는 detail에서 그대로 가져오지 말고 상태 코드별로 허용한 문구를 선택하세요.',
    explanation: '공개 응답은 사용자가 할 수 있는 다음 행동을 안내하고 내부 상세를 노출하지 않아야 합니다. 진단은 별도 내부 경계에서 다룹니다.',
  },
  21: {
    taskInstruction: '각 카운터 증가의 읽기·수정·쓰기 구간을 잠금으로 보호하세요.',
    exerciseTitle: '공유 카운터 증가를 Lock으로 보호하기',
    instruction: '아래 여러 작업의 공유 카운터 변경 구간을 수정하세요.',
    requirements: ['counter를 읽고 증가시키는 구간 전체를 lock으로 보호해요.', '4개 작업이 각각 100회 증가시키면 합계 기준은 400이에요.'],
    constraints: ['ThreadPoolExecutor와 모듈 전역 lock을 유지해요.', '정적 코드 구조 확인이며 경쟁 상태를 사이트에서 실행 시험하지 않아요.'],
    examples: [{ input: '4 workers × 100 increments', output: '400' }],
    tests: [{ input: '4 workers × 100 increments', expected: 'counter update occurs inside with lock' }, { input: 'one worker × 100 increments', expected: '100 increments remain protected' }],
    gradingNote: '실행형 채점이 아닙니다. 각 counter 증가가 with lock 임계 구역 안에 있는지 전체 함수 구조를 정적으로 검사하며 스레드 스케줄 결과를 실행 검증하지 않습니다.',
    hint: '공유 카운터를 바꾸는 한 줄만 따로 보지 말고 읽기·수정·쓰기 연산을 같은 잠금 범위에 두세요.',
    explanation: 'counter += 1은 공유 값을 읽고 계산하고 다시 쓰는 과정입니다. 잠금은 이 임계 구역이 한 번에 하나의 작업만 수행하게 합니다.',
  },
  22: {
    taskInstruction: 'ArgumentParser에 필수 --file 옵션과 도움말을 등록하고 전달된 argv만 파싱하도록 수정하세요.',
    titleSuffix: '필수 CLI 옵션 고치기',
    requirements: ['--file 옵션을 required=True로 등록해요.', '옵션 설명을 help 인자로 제공해요.', '전달된 argv를 parse_args에 넘겨 테스트 가능한 경계를 유지해요.'],
    constraints: ['기본 시스템 argv를 읽지 않아요.', '정적 구조 채점이며 argparse 프로세스를 브라우저에서 실행하지 않아요.'],
    examples: [{ input: '["--file", "notes.json"]', output: 'Namespace(file="notes.json")' }, { input: '[]', output: 'usage error; exit code 2' }],
    tests: [{ input: '["--file", "notes.json"]', expected: 'file is notes.json' }, { input: '[]', expected: 'required --file option fails with a nonzero parser exit' }],
    gradingNote: '실행형 채점이 아닙니다. required=True, 사용자 도움말, 전달된 argv의 parse_args 연결을 정적 구조로 확인합니다. 실제 CLI 실행 결과를 보장하지 않습니다.',
    hint: '옵션을 선언할 때 필수 여부와 사용자 설명을 같이 적고, 테스트 인자 목록을 파서에 전달하세요.',
    explanation: 'argparse가 옵션을 선언하고 검증하지만 파일 존재·JSON 스키마까지 자동 검증하지는 않습니다.',
  },
  23: {
    taskInstruction: '읽기에 성공한 개수만 복구 성공으로 보고하고 오류가 있으면 실패 상태만 반환하세요.',
    exerciseTitle: '복구 실패 상태 보고 고치기',
    requirements: ['error가 있으면 ok=False와 예외 형식만 반환해요.', '오류 결과에 recovered 성공 수를 넣지 않아요.', '오류가 없을 때만 복구된 항목 수를 반환해요.'],
    constraints: ['오류 메시지나 입력 레코드의 민감 세부정보를 노출하지 않아요.', '정적 구조 채점이며 파일 복구를 수행하지 않아요.'],
    examples: [{ input: 'records=["py", "js"], error=None', output: '{"ok": true, "recovered": 2}' }, { input: 'records=[], error=OSError(...)', output: '{"ok": false, "error": "OSError"}' }],
    tests: [{ input: 'successful two-record read', expected: 'ok true; recovered 2' }, { input: 'read raised OSError', expected: 'ok false; OSError; no recovered field' }],
    gradingNote: '실행형 채점이 아닙니다. 오류 분기가 성공 보고보다 먼저 실행되는지, 실패 객체에 복구 수가 없는지 정적으로 확인합니다.',
    hint: '오류 상태부터 반환하고, 그 뒤에만 성공 건수를 세어 반환하세요.',
    explanation: '복구가 실패한 상황에서 성공 수나 완료 메시지를 내면 실제 파일 상태와 다른 결과를 안내하게 됩니다.',
  },
  24: {
    taskInstruction: 'title을 검사한 뒤 유효한 경우에만 저장 함수를 호출하도록 순서를 바로잡으세요.',
    titleSuffix: '검증 순서 리뷰 고치기',
    requirements: ['title이 문자열이 아니거나 비어 있거나 공백뿐이면 writer 호출 없이 invalid를 반환해요.', '유효한 제목에서만 writer(record)를 한 번 호출해요.', '검증을 저장 효과보다 먼저 실행해요.'],
    constraints: ['writer는 인자로 주입된 함수로 유지해요.', '정적 코드 구조 채점이며 사이트에서 임의 코드를 실행하지 않아요.'],
    examples: [{ input: 'title="Python"', output: 'writer is called once' }, { input: 'title="   "', output: 'invalid; writer is not called' }, { input: 'missing title', output: 'invalid; writer is not called' }],
    tests: [{ input: 'valid title', expected: 'validation precedes one writer call' }, { input: 'missing, non-string, or whitespace-only title', expected: 'writer is not called' }],
    gradingNote: '실행형 채점이 아닙니다. 입력 검증 분기가 writer 호출보다 먼저 있고, 유효한 경로에서 writer를 반환하는 구조인지 확인합니다.',
    hint: 'writer 호출 전에 title이 문자열인지, 앞뒤 공백을 제외하고 글자가 있는지 확인하세요.',
    explanation: '저장 뒤 검증하는 코드는 잘못된 자료를 이미 쓴 다음 오류를 발견합니다. 순서가 계약의 일부입니다.',
  },
  25: {
    taskInstruction: '검사 결과를 읽어 실패 항목을 정확히 보고하는 release_report를 완성하세요.',
    exerciseTitle: '출시 점검 결과 보고 고치기',
    requirements: ['하나 이상의 점검에서 실패하면 ready=False로 보고하고 실패 이름을 모두 failed에 담아요.', '모든 점검이 통과할 때만 ready=True와 빈 failed 목록을 반환해요.', '점검이 비어 있으면 ready=False와 no_checks를 반환해요.'],
    constraints: ['배포나 외부 서비스 호출 없이 전달된 dict만 읽어요.', '정적 구조 채점이며 코드를 실행해 배포 안전을 보증하지 않아요.'],
    examples: [{ input: '{"tests": True, "backup_restore": False}', output: '{"ready": False, "failed": ["backup_restore"]}' }, { input: '{"tests": True, "release_audit": True}', output: '{"ready": True, "failed": []}' }, { input: '{}', output: '{"ready": False, "failed": ["no_checks"]}' }],
    tests: [{ input: 'all checks true', expected: 'ready true and no failures' }, { input: 'backup_restore false', expected: 'ready false and backup_restore listed' }, { input: 'empty mapping', expected: 'ready false and no_checks listed' }],
    gradingNote: '실행형 채점이 아닙니다. 전체 함수 형태와 빈 검사·전체 통과·부분 실패 분기를 정적으로 확인합니다. 이 문제는 실제 앱을 빌드하거나 배포하지 않습니다.',
    hint: '먼저 빈 점검 목록을 처리하고, 그다음 통과하지 않은 이름을 모아 준비 상태를 그 목록으로 계산하세요.',
    explanation: '준비 보고는 통과 여부를 낙관적으로 가정하지 않고 실제 검사 결과를 요약해야 합니다. 실패 이름이 남아야 다음에 고칠 작업을 찾을 수 있습니다.',
  },
  26: {
    taskInstruction: '각 약점 주제를 다음 학습 행동과 측정 가능한 성공 조건이 있는 항목으로 바꾸세요.',
    exerciseTitle: '다음 4주 복습 계획 고치기',
    requirements: ['입력 주제마다 topic, next_action, success 필드를 가진 계획 항목을 하나 만들어요.', 'next_action은 해당 주제 예제를 복습하도록 구체적으로 적어요.', 'success는 해당 주제의 새 사례를 풀어 확인하도록 적어요.', '빈 입력은 빈 계획을 반환해요.'],
    constraints: ['입력 목록 순서를 보존해요.', '계정·파일·네트워크를 사용하지 않는 정적 구조 연습이며 실제 학습 기록을 만들지 않아요.'],
    examples: [{ input: '["exceptions", "asyncio"]', output: '주제별 복습 계획 2개' }, { input: '[]', output: '[]' }],
    tests: [{ input: '["exceptions"]', expected: 'one item includes topic, concrete next_action, and observable success' }, { input: '["exceptions", "asyncio"]', expected: 'two items preserve input order and mention each topic' }, { input: '[]', expected: 'empty list' }],
    gradingNote: '실행형 채점이 아닙니다. 전체 함수 형태와 주제별 필드·행동·성공 조건을 정적으로 확인합니다. 이 문제는 실제 학습 기록이나 완료 상태를 저장하지 않습니다.',
    hint: '각 topic으로 반복해 같은 위치에 구체 행동과 새 문제를 풀었는지 확인할 성공 조건을 함께 만들어 보세요.',
    explanation: '“더 공부하기”는 실행할 행동도 완료 판정도 불분명합니다. 어떤 예제를 다시 볼지, 어떤 새 사례를 풀면 완료인지 항목마다 드러내야 계획을 점검할 수 있습니다.',
  },
};

function repairQuestion(id, week, day, title) {
  const [name, starterCode, solution, prompt, input, expected] = repairSpecs[week - 1];
  const override = repairQuestionOverrides[week];
  const taskInstruction = override?.taskInstruction ?? `${override?.instruction ?? '아래 함수를 수정하세요.'} ${prompt}`;
  const promptPrefix = override?.promptPrefix ?? `${weekTitles[week - 1]}의 ${title} 규칙을 만족하도록`;
  const versionedRepair = week >= 13 && week <= 26;
  return repairCode({
    id: `${id}-repair${versionedRepair ? '-v2' : ''}`,
    title: override?.exerciseTitle ?? `${title} ${override?.titleSuffix ?? '함수 고치기'}`,
    prompt: `${promptPrefix ? `${promptPrefix} ` : ''}${taskInstruction}\n\n\`${starterCode}\``,
    language: 'Python',
    starterCode,
    solutionPatterns: [`^[\\s\\S]*${escapeRegExp(solution)}[\\s\\S]*$`],
    acceptanceCriteria: override ? {
      requirements: override.requirements,
      constraints: override.constraints,
      examples: override.examples,
      tests: override.tests,
    } : {
      requirements: ['완전한 함수 또는 메서드 정의를 유지해요.', '문항의 입력에서 기대 결과를 만들어요.'],
      constraints: ['입력과 다른 전역 상태에 의존하지 않아요.', '출력만 하고 끝내지 않으며 호출자가 사용할 결과를 돌려줘요.'],
      examples: [{ input, output: expected }],
      tests: [{ input, expected }, ...(week === 13
        ? [{ input: '"unit-python-27"', expected: '"27"' }]
        : week === 14
          ? [{ input: 'datetime(2026, 1, 2, 9, 0, tzinfo=timezone(timedelta(hours=9)))', expected: '{"at": "2026-01-02T09:00:00+09:00"}' }]
          : week === 15
            ? [{ input: '{"LIMIT": "0"}', expected: 0 }, { input: '{}', expected: 10 }]
            : [{ input: '경계 입력도 같은 규칙으로 처리', expected: '요구한 함수 구조 유지' }])],
    },
    gradingNote: override?.gradingNote ?? '실행형 채점이 아닙니다. 이 문항은 전체 함수·메서드 구조와 요구한 수정이 함께 있는지 확인합니다. 공백과 줄바꿈은 허용하지만 일부 표현만 포함한 답은 정답 처리하지 않습니다.',
    hint: override?.hint ?? '현재 코드가 만든 값, 실제로 호출한 메서드, 호출자에게 돌려줄 값을 각각 확인하세요.',
    explanation: override?.explanation ?? `${title}에서는 ${prompt} 시작 코드를 고치면서 입력 경계와 반환값을 함께 확인해야 합니다.`,
  });
}

function locateQuestion(id, week, day, title) {
  const [codeLines, answerLine, explanation] = advancedReviewCase(week, day)?.locate ?? locateSpecs[week - 1];
  const hint = advancedDailyLocateHints[week]?.[day - 1] ?? '값의 자료형, 반복 범위, 자원 수명 또는 외부 입력 경계 중 무엇이 깨지는지 살펴보세요.';
  return locateError(`${id}-locate`, `${title} 고칠 줄 찾기`, `Python ${week}주차 ${day}일 · ${title}: 요구사항과 맞지 않는 줄을 고르세요.`, 'Python', codeLines, [answerLine], hint, explanation);
}

function sessionExercises(week, day, count) {
  const title = daily[week - 1][day - 1];
  const id = `py-w${String(week).padStart(2, '0')}-d${day}`;
  const code = codeFor(week, day);
  const questions = [conceptQuestion(id, week, day, title, code), traceQuestion(id, week, day, title, code), day === 5 ? repairQuestion(id, week, day, title) : locateQuestion(id, week, day, title)];
  return questions.slice(0, count);
}

function makeSession(week, day, count = 3) {
  const title = daily[week - 1][day - 1];
  const code = codeFor(week, day);
  const note = advancedDailyLearningNotes[week]?.[day - 1];
  if (note) return studySession(day, title, note[0], note[1], code, sessionExercises(week, day, count));
  const objective = title + '의 역할을 코드 예시와 작은 수정 문제로 설명해요.';
  const intro = title + '은(는) ' + weekTitles[week - 1] + '에서 한 가지 결정을 분명하게 만드는 도구입니다. 예제를 먼저 읽고, 값이 바뀌는 지점과 실패할 수 있는 지점을 표시한 뒤 문제를 풀어 보세요.';
  return studySession(day, title, objective, intro, code, sessionExercises(week, day, count));
}

const existingWeeks = Object.fromEntries(legacyIds.map((lessonId, index) => {
  const week = index + 1;
  const reviewed = reviewedPythonFoundationWeeks[week];
  return [lessonId, {
    week,
    phaseId: phaseFor(week).id,
    ...(reviewed?.legacyExerciseDays ? { legacyExerciseDays: reviewed.legacyExerciseDays } : {}),
    ...(reviewed ? {
      title: `${week}주차 · ${weekTitles[week - 1]}`,
      objective: reviewed.objective,
      intro: reviewed.intro,
      points: reviewed.points,
      example: reviewed.example,
      sessions: reviewed.sessions,
    } : {
      sessions: [makeSession(week, 1, 2), makeSession(week, 2, 2), makeSession(week, 3, 2), makeSession(week, 4, 3), makeSession(week, 5, 3)],
    }),
  }];
}));

const lessons = Array.from({ length: 14 }, (_, offset) => {
  const week = offset + 13;
  const phase = phaseFor(week);
  return weeklyLesson({
    id: `py-week-${String(week).padStart(2, '0')}`,
    topicId: phase.id,
    week,
    title: `${week}주차 · ${weekTitles[week - 1]}`,
    objective: weekObjectives[week - 1],
    intro: advancedWeeklyIntros[week - 13],
    points: [`이번 주에는 ${weekTitles[week - 1]}의 다섯 가지 작은 결정을 분리해 연습해요.`, '문제의 코드는 독립적인 최소 예시이며, 실제 파일·네트워크 접근을 실행하지 않아요.', '수정 문항은 실행 결과를 보장하지 않고 지정한 함수 구조만 확인해요.'],
    example: codeFor(week, 1),
    sessions: [makeSession(week, 1), makeSession(week, 2), makeSession(week, 3), makeSession(week, 4), makeSession(week, 5)],
    difficulty: difficultyFor(week),
  });
});

export const pythonCourseExpansion = {
  phases,
  lessonOrder: [...legacyIds, ...lessons.map((item) => item.id)],
  existingWeeks,
  lessons,
  reviewedWeeks: Array.from({ length: 26 }, (_, index) => index + 1),
};
