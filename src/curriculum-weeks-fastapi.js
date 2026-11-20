import { choice, locateError, shortAnswer, studySession, weeklyLesson } from './curriculum-tools.js';
import {
  applyFastApiFoundationReview,
  applyFastApiStableVersionQuestionIdentity,
} from './fastapi-foundation-review.js';

const phases = [
  { id: 'fastapi-phase-1', number: 1, title: '입문 · HTTP와 첫 경로', startWeek: 1, endWeek: 4, objective: 'FastAPI 앱, 경로 작업, 경로·쿼리 입력을 읽고 작은 요청을 처리해요.' },
  { id: 'fastapi-phase-2', number: 2, title: '기초 · 데이터 계약과 응답', startWeek: 5, endWeek: 9, objective: 'Pydantic 모델과 제약, 응답 모델, 상태 코드로 API 계약을 명확히 해요.' },
  { id: 'fastapi-phase-3', number: 3, title: '중급 · 의존성과 애플리케이션 구조', startWeek: 10, endWeek: 14, objective: 'Depends 그래프와 정리 작업, APIRouter를 이용해 기능을 나눠요.' },
  { id: 'fastapi-phase-4', number: 4, title: '고급 · 비동기와 앱 생명주기', startWeek: 15, endWeek: 19, objective: '요청 수명, 미들웨어, 오류, 시작·종료, REST 상태 흐름을 설계해요.' },
  { id: 'fastapi-phase-5', number: 5, title: '심화 · 보안과 테스트', startWeek: 20, endWeek: 24, objective: '인증·권한을 분리하고 동기·비동기 테스트를 앱 수명주기와 함께 검증해요.' },
  { id: 'fastapi-phase-6', number: 6, title: '실전 · 성능과 운영 경계', startWeek: 25, endWeek: 30, objective: '페이지 나누기, 웹 경계, 백그라운드 작업, 운영 설정을 작은 API 설계로 통합해요.' },
];

// Each day has its own FastAPI decision, accepted form, and nearby misconception.
const plans = [
  { title: 'FastAPI 앱과 첫 응답', objective: 'FastAPI 앱이 ASGI(비동기 Python 웹 앱과 서버가 요청·응답을 주고받는 표준 규칙)에 따라 JSON 응답을 만드는 흐름을 이해해요.', intro: 'FastAPI()는 요청을 처리할 앱 객체를 만들어요. Uvicorn 같은 ASGI 서버가 요청을 이 앱에 전달하고, 앱이 만든 응답을 돌려줘요. 개발 서버와 운영 서버는 앱을 실행하는 별도 계층입니다.', example: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/health")\nasync def health():\n    return {"status": "ok"}', rule: 'FastAPI()가 만든 app에 경로 작업을 등록하고, Uvicorn 같은 ASGI 서버가 요청을 앱에 전달해요.', misconception: '함수 이름만으로 경로가 자동 등록되거나 브라우저가 Python 파일을 직접 실행하지는 않아요.', days: [
    ['앱 인스턴스 만들기', 'app = FastAPI()', 'app = fastapi()', 'app = FastAPI'],
    ['경로 작업 등록', '@app.get("/health")', '@app.route("/health")', '@app.post("/health")'],
    ['비동기 핸들러 선언', 'async def health():', 'async health():', 'def async health():'],
    ['JSON 객체 반환', 'return {"status": "ok"}', 'return "{"status": "ok"}"', 'print({"status": "ok"})'],
    ['앱과 서버 역할 구분', 'uvicorn.run("main:app")', 'python main.py가 app을 브라우저에서 실행', 'app.run()'],
  ] },
  { title: '경로 작업과 HTTP 메서드', objective: 'GET·POST·PUT·PATCH·DELETE의 의도와 경로 등록 순서를 구분해요.', intro: '경로 작업 데코레이터는 URL 경로와 HTTP 메서드를 함께 등록해요. 읽기와 변경 요청은 메서드 의미를 맞추고, 고정 경로를 넓은 매개변수 경로보다 먼저 두면 충돌을 피할 수 있습니다.', example: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses():\n    return {"items": []}', rule: '읽기 요청은 GET, 새 리소스 생성은 POST처럼 HTTP 메서드의 약속을 지켜요.', misconception: '모든 경로 작업에 POST를 쓰거나 함수 이름만 바꾸면 메서드가 바뀌지는 않아요.', days: [
    ['목록 조회 메서드', '@app.get("/courses")', '@app.post("/courses")', '@app.delete("/courses")'],
    ['새 리소스 생성 메서드', '@app.post("/courses")', '@app.get("/courses")', '@app.head("/courses")'],
    ['부분 변경 메서드', '@app.patch("/courses/{course_id}")', '@app.get("/courses/{course_id}")', '@app.options("/courses/{course_id}")'],
    ['고정 경로를 먼저 등록', '@app.get("/users/me")', '@app.get("/users/{user_id}") 먼저 등록', '@app.get("/users/{rest:path}") 먼저 등록'],
    ['지원하지 않는 메서드 응답', '405 Method Not Allowed', '404 Not Found', '422 Unprocessable Entity'],
  ] },
  { title: '형식이 있는 경로 매개변수', objective: '경로 템플릿과 Python 타입 힌트로 요청 값을 변환하고 검증해요.', intro: '경로 매개변수는 경로 템플릿에 이름을 적고 함수 매개변수와 같은 이름으로 받아요. `int`처럼 타입을 선언하면 잘못된 입력을 자동으로 검증합니다.', example: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return {"course_id": course_id}', rule: '경로의 중괄호 이름과 함수 매개변수 이름을 맞추고 Python 타입으로 입력을 선언해요.', misconception: 'URL은 처음에 문자열이므로 숫자 타입 힌트가 있어도 잘못된 숫자가 조용히 통과하지는 않아요.', days: [
    ['경로 이름 연결', 'async def read_course(course_id: int):', 'async def read_course(course: int):', 'async def read_course(course_id: str):'],
    ['숫자 변환과 검증', 'course_id: int', 'course_id: "int"', 'course_id: object'],
    ['UUID 경로 타입', 'item_id: UUID', 'item_id: "UUID"', 'item_id: bytes'],
    ['경로 문자열 형식', '"/items/{item_id}"', '"/items/item_id"', '"/items/:item_id"'],
    ['잘못된 정수 입력 결과', '422 Unprocessable Entity', '200 OK와 0', '500 Internal Server Error'],
  ] },
  { title: '쿼리 입력과 기본값', objective: '경로 뒤의 쿼리 입력을 필수·선택·기본값·검증 조건으로 구분해요.', intro: '경로 템플릿에 없는 함수 매개변수는 보통 쿼리 입력으로 처리돼요. `None` 기본값은 선택 입력을 나타내며 `Query`는 범위와 문서 설명을 더할 수 있습니다.', example: 'from fastapi import FastAPI, Query\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(limit: int = Query(default=20, ge=1, le=100)):\n    return {"limit": limit}', rule: '선택 쿼리에는 기본값을 주고 입력 범위는 Query의 검증 조건으로 표현해요.', misconception: '경로에 없는 매개변수가 자동으로 요청 본문이 되는 것은 아니에요.', days: [
    ['선택 문자열 기본값', 'q: str | None = None', 'q: str | None', 'q: str = "None"'],
    ['필수 분류 쿼리', 'category: str', 'category: str = "all"', 'category: str | None = None'],
    ['최솟값 제한', 'Query(default=20, ge=1)', 'Query(default=20, ge=0)', 'Query(default=20, gt=100)'],
    ['여러 같은 이름 값', 'tags: list[str] = Query(default=[])', 'tags: str = Query(default=[])', 'tags: list[str] = Body(default=[])'],
    ['경로 입력과 쿼리 입력 구분', '경로 템플릿에 없는 limit은 쿼리 입력', '모든 입력은 경로 문자열', '모든 입력은 JSON 본문'],
  ] },
  { title: 'Pydantic 요청 모델', objective: 'JSON 본문 모양을 Pydantic 모델로 선언해 타입 변환과 구조 검증을 받아요.', intro: 'POST·PUT 요청 본문은 Pydantic `BaseModel` 클래스로 표현할 수 있어요. 모델 필드와 Python 타입이 계약이 되며 필수 필드가 없거나 타입이 맞지 않으면 검증 오류가 돌아옵니다.', example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\nclass CourseCreate(BaseModel):\n    title: str\n\n@app.post("/courses")\nasync def create_course(course: CourseCreate):\n    return {"title": course.title}', rule: 'JSON 요청 객체는 BaseModel 하위 클래스에 필드를 선언해 받아요.', misconception: '요청 본문을 문자열로 직접 잘라 읽는 방식은 타입과 오류 문서를 자동으로 제공하지 않아요.', days: [
    ['모델 기반 요청 본문', 'class CourseCreate(BaseModel):', 'class CourseCreate:', 'class CourseCreate(BaseModel = True):'],
    ['생략 가능한 설명 필드', 'description: str | None = None', 'description: str | None', 'description: str = "None"'],
    ['필드의 Python 타입 지정', 'rating: float', 'rating = float', 'rating: "float"'],
    ['중첩 모델 재사용', 'address: Address', 'address: dict[Address]', 'address: Address()'],
    ['모델을 본문으로 받기', 'async def create_course(course: CourseCreate):', 'async def create_course(course: str):', 'async def create_course(course: Query):'],
  ] },
  { title: '입력 제약과 검증 오류', objective: 'Field 제약으로 경계 조건을 표현하고 잘못된 본문이 자동으로 거부되는 이유를 설명해요.', intro: 'Pydantic 필드에 최소·최대 길이와 수치 범위를 선언하면 입력을 경계에서 확인할 수 있어요. 검증이 실패할 때 FastAPI는 기본적으로 422 응답과 오류 위치를 반환합니다.', example: 'from pydantic import BaseModel, Field\n\nclass ItemCreate(BaseModel):\n    name: str = Field(min_length=1, max_length=80)\n    price: float = Field(gt=0)', rule: '값의 의미에 맞게 Field의 길이·범위 제약을 선언하고 경계값을 포함할지 결정해요.', misconception: '`gt=0`은 0을 허용하지 않고, 클라이언트 화면 검증만으로 API 입력 검증을 대신할 수 없어요.', days: [
    ['문자열 최소 길이', 'Field(min_length=1)', 'Field(min_length=0)', 'Field(max_length=0)'],
    ['양수 전용 수치', 'Field(gt=0)', 'Field(ge=0)', 'Field(lt=0)'],
    ['선택 설명과 길이 제한', 'description: str | None = Field(default=None, max_length=160)', 'description: str | None = Field(default=None)', 'description: str = Field(default="", max_length=160)'],
    ['숫자 최대 경계', 'Field(le=100)', 'Field(lt=1000)', 'Field(ge=1000)'],
    ['자동 입력 오류 상태', '422 Unprocessable Entity', '404 Not Found', '302 Found'],
  ] },
  { title: '응답 모델과 공개 필드', objective: 'response_model로 외부에 돌려줄 필드를 제한하고 응답 직렬화를 검증해요.', intro: '응답 모델은 반환할 데이터의 모양을 문서화하고 직렬화해요. 내부 객체에 추가 속성이 있어도 공개 응답 모델에 없는 필드는 기본 응답에서 제외됩니다.', example: 'class LearnerPublic(BaseModel):\n    name: str\n    level: int\n\n@app.get("/learners/{learner_id}", response_model=LearnerPublic)\nasync def read_learner(learner_id: int):\n    return {"name": "Mina", "level": 2, "token": "internal"}', rule: '공개 데이터 계약을 별도 response_model로 선언하고 민감한 내부 필드를 제외해요.', misconception: 'Python 함수가 딕셔너리를 반환한다는 이유만으로 모든 키를 API에 공개해야 하는 것은 아니에요.', days: [
    ['응답 모델 연결', '@app.get("/learners", response_model=LearnerPublic)', '@app.get("/learners", response_model=LearnerCreate)', '@app.get("/learners", response_model=None)'],
    ['응답 필드 제한', '공개 모델에 선언한 필드만 응답', '반환 객체의 모든 내부 속성 공개', '모델 필드가 모두 요청 쿼리로 전환'],
    ['선택적 응답 필드', 'nickname: str | None = None', 'nickname: str | None', 'nickname: None = "Mina"'],
    ['모델 속성 직렬화', 'Pydantic 응답 모델로 검증', 'JSON을 문자열로 수동 연결', 'print()로 응답 작성'],
    ['응답 형식 불일치', '응답 검증 오류로 서버 결함을 찾음', '요청 입력 오류 422로 자동 변경', '항상 200으로 강제 변환'],
  ] },
  { title: '상태 코드와 헤더 계약', objective: '성공·생성·삭제 상태 코드와 요청·응답 헤더의 역할을 구분해요.', intro: '경로 작업은 성공 응답의 기본 상태 코드가 있지만 새 리소스 생성·삭제 같은 동작에는 다른 코드가 적절할 수 있어요. 요청 헤더는 Header, 응답 헤더는 Response 또는 응답 객체로 설정합니다.', example: 'from fastapi import FastAPI, Response\napp = FastAPI()\n\n@app.post("/courses", status_code=201)\nasync def create_course():\n    return {"created": True}', rule: '생성은 보통 201, 내용 없는 성공은 204처럼 결과의 의미에 맞는 HTTP 상태 코드를 선택해요.', misconception: '요청 헤더와 응답 헤더는 방향이 다르므로 같은 매개변수 설정을 쓰지 않아요.', days: [
    ['리소스 생성 상태 코드', 'status_code=201', 'status_code=200', 'status_code=404'],
    ['내용 없는 성공 응답', 'status_code=204', 'status_code=422', 'status_code=302'],
    ['요청 헤더 받기', 'client_version: str = Header()', 'client_version: str = Query()', 'client_version: str = Body()'],
    ['응답 헤더 설정', 'response.headers["X-Mode"] = "study"', 'request.headers["X-Mode"] = "study"', 'Header["X-Mode"] = "study"'],
    ['삭제 결과 설명', '204 응답에는 JSON 본문을 두지 않음', '204 응답에 필수 JSON 본문 포함', 'DELETE는 반드시 302 반환'],
  ] },
  { title: 'Depends 의존성 주입 기초', objective: 'Depends가 공유 로직을 실행하고 그 반환값을 경로 작업 함수에 전달하는 흐름을 익혀요.', intro: '의존성은 `Depends`에 전달한 callable을 FastAPI가 호출해 반환값을 경로 작업 매개변수에 넣는 기능이에요. 필요한 입력은 의존성의 함수 매개변수로 선언할 수 있습니다.', example: 'from fastapi import Depends, FastAPI\napp = FastAPI()\n\ndef get_page_size(limit: int = 20):\n    return limit\n\n@app.get("/courses")\nasync def list_courses(limit: int = Depends(get_page_size)):\n    return {"limit": limit}', rule: 'Depends에 함수 자체를 전달해 FastAPI가 요청마다 필요한 값을 계산하고 주입하게 해요.', misconception: '의존성 함수를 직접 호출하면 요청 입력 분석과 의존성 그래프가 실행되지 않아요.', days: [
    ['의존성 함수 지정', 'Depends(get_page_size)', 'Depends(get_page_size())', 'Depends("get_page_size")'],
    ['주입값 받기', 'limit: int = Depends(get_page_size)', 'Depends(get_page_size): int', 'limit: Depends[int]'],
    ['공유 인증 사용자', 'user = Depends(get_current_user)', 'user = get_current_user', 'user = Query(get_current_user)'],
    ['의존성의 쿼리 입력', 'limit: int = 20', 'limit: "int" = "20"', 'limit: Body = 20'],
    ['재사용 가능한 검사', '경로 함수 바깥 의존성 함수로 분리', '경로마다 동일한 검사를 복사', '전역 가변 변수에 요청 사용자 저장'],
  ] },
  { title: 'Annotated와 의존성 그래프', objective: 'Annotated로 타입과 Depends 메타데이터를 묶고 하위 의존성이 조합되는 방식을 설명해요.', intro: 'Python `Annotated`는 타입 정보를 유지하면서 FastAPI의 의존성 메타데이터를 함께 지정할 수 있어요. 의존성이 또 다른 의존성을 사용하면 프레임워크가 그래프를 따라 값을 계산합니다.', example: 'from typing import Annotated\nfrom fastapi import Depends\n\nPageSize = Annotated[int, Depends(get_page_size)]\n\n@app.get("/courses")\nasync def list_courses(limit: PageSize):\n    return {"limit": limit}', rule: 'Annotated[타입, Depends(...)]로 타입과 FastAPI 의존성 메타데이터를 보존해요.', misconception: 'Annotated 자체가 값을 가져오거나 하위 함수를 직접 실행하지는 않아요.', days: [
    ['Annotated 가져오기', 'from typing import Annotated', 'from typing import Annotation', 'from fastapi import Annotated'],
    ['타입과 Depends 결합', 'Annotated[int, Depends(get_limit)]', 'Annotated[Depends(get_limit), int]', 'Annotated[int = Depends(get_limit)]'],
    ['의존성 재사용 별칭', 'PageSize = Annotated[int, Depends(get_limit)]', 'PageSize = Depends[Annotated(int)]', 'PageSize = Annotated(Depends(get_limit))'],
    ['하위 의존성 선언', 'def get_user(token: Token = Depends(read_token)):', 'def get_user(token = read_token()):', 'def get_user(token: Query(read_token)):'],
    ['요청별 그래프 계산', '요청 컨텍스트에서 의존성을 해결', '모듈 import 때 모든 요청 값 계산', '반환값 없이 전역으로 저장'],
  ] },
  { title: '요청별 의존성 재사용과 자원 정리', objective: 'yield 의존성으로 자원 종료 동작을 짝지어 표현하고 캐시 범위를 구분해요.', intro: '파일·세션 같은 자원을 열었다면 `yield` 뒤 정리 코드를 둘 수 있어요. 실행 범위와 종료 시점은 의존성 사용 방식에 따라 달라지므로 요청 수명주기와 함께 검토해야 합니다.', example: 'async def get_resource():\n    resource = await open_resource()\n    try:\n        yield resource\n    finally:\n        await resource.close()', rule: 'yield 앞에서 자원을 준비하고 finally에서 항상 정리해요.', misconception: 'yield 의존성이 앱 전체에서 하나의 전역 객체가 된다고 가정하면 요청 간 데이터가 섞일 수 있어요.', days: [
    ['자원 준비와 반환', 'yield resource', 'return resource 뒤에 정리 코드', 'print(resource)'],
    ['정리 코드를 항상 실행', 'try: yield resource / finally: close()', '예외가 나면 close() 생략', '요청마다 전역 자원 덮어쓰기'],
    ['비동기 자원 종료', 'await resource.close()', 'resource.close()를 await 반환값처럼 사용', 'asyncio.create_task(close())만 남김'],
    ['같은 요청에서 의존성 재사용', 'use_cache 설정을 범위 요구에 맞춤', '모든 의존성은 프로세스 전체에서 공유', '매 요청마다 캐시를 무조건 끔'],
    ['yield 자원 정리 시점', '경로 함수가 끝난 뒤 응답 전에 자원을 정리', '요청 뒤에도 자원을 무기한 보존', '브라우저 사용자 코드에서 DB 서버 접속'],
  ] },
  { title: 'APIRouter로 기능 나누기', objective: '기능별 APIRouter와 prefix·tags를 사용해 많은 경로를 읽기 쉽게 구성해요.', intro: 'APIRouter는 경로 작업을 기능 단위로 묶고 메인 앱에 포함할 수 있어요. prefix와 tags로 경로 묶음과 문서 표기를 구성하며 공통 의존성도 적용할 수 있습니다.', example: 'from fastapi import APIRouter, FastAPI\napp = FastAPI()\nrouter = APIRouter(prefix="/courses", tags=["courses"])\n\n@router.get("/")\nasync def list_courses():\n    return {"items": []}\n\napp.include_router(router)', rule: 'router에 경로를 등록한 뒤 app.include_router(router)로 앱에 포함해요.', misconception: 'APIRouter를 만들기만 하고 include_router를 빼면 앱 경로가 되지 않아요.', days: [
    ['라우터 인스턴스', 'router = APIRouter(prefix="/courses")', 'router = FastAPI(prefix="/courses")', 'router = app.route("/courses")'],
    ['라우터 경로 작업', '@router.get("/")', '@app.get("/")만 선언', '@router.path("/")'],
    ['라우터 앱에 포함', 'app.include_router(router)', 'app.include(router)', 'router.include_app(app)'],
    ['라우터 문서 태그', 'tags=["courses"]', 'tag="courses"', 'labels=["courses"]'],
    ['하위 경로 prefix', 'prefix="/courses"와 path="/{course_id}"', 'prefix와 path 모두 절대 URL로 중복', 'prefix를 app 객체 이름에 적기'],
  ] },
  { title: '동기·비동기 경로 선택', objective: 'await 가능한 I/O와 일반 동기 함수의 차이를 알고 이벤트 루프를 막지 않아요.', intro: 'async 함수 안에서 await 가능한 네트워크·비동기 라이브러리를 기다릴 수 있어요. 동기 I/O 함수는 실행 중 스레드를 점유하므로 비동기 함수 안에서 무심코 호출하면 동시 처리에 영향을 줍니다.', example: '@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    course = await repository.read(course_id)\n    return course', rule: 'await 가능한 비동기 API에는 await를 쓰고, 동기 라이브러리의 성격을 구분해요.', misconception: '함수에 async만 붙인다고 내부 동기 작업이 비동기로 바뀌지는 않아요.', days: [
    ['비동기 함수 선언', 'async def read_course():', 'async read_course():', 'def async read_course():'],
    ['비동기 I/O 기다리기', 'course = await repository.read(course_id)', 'course = repository.read(course_id)', 'await course = repository.read(course_id)'],
    ['동기 라이브러리 구분', '동기 I/O는 블로킹 가능성을 검토', 'async def 안의 모든 코드는 자동 비동기', 'CPU 루프는 await 없이도 협력적으로 양보'],
    ['CPU 작업 경계', '큰 CPU 작업은 별도 계산 경계를 설계', 'async 키워드로 CPU를 다른 코어에 분산', 'await print(value)'],
    ['비동기 결과 타입', 'await한 뒤 실제 결과를 사용', 'coroutine 객체를 JSON 응답으로 반환', 'coroutine을 str 타입으로 선언'],
  ] },
  { title: '요청 생명주기와 미들웨어', objective: '미들웨어가 요청 전·응답 후 흐름을 감싸는 방식과 순서 영향을 이해해요.', intro: '미들웨어는 경로 작업 앞뒤에서 모든 요청 또는 응답에 공통 정책을 적용해요. 요청 식별자나 측정 시간을 추가할 수 있지만 사용자 개인정보를 로그에 무심코 남기지 않아야 합니다.', example: '@app.middleware("http")\nasync def add_study_header(request, call_next):\n    response = await call_next(request)\n    response.headers["X-Study-App"] = "one-step"\n    return response', rule: '미들웨어는 call_next를 호출해 다음 처리로 넘기고 응답 객체를 반환해요.', misconception: '응답을 반환하지 않거나 call_next를 잘못 호출하면 요청 흐름이 끊길 수 있어요.', days: [
    ['HTTP 미들웨어 선언', '@app.middleware("http")', '@app.middleware("https")', '@app.router_middleware("http")'],
    ['요청을 다음 처리로 전달', 'response = await call_next(request)', 'response = call_next()', 'response = await request.call_next()'],
    ['응답 헤더 추가', 'response.headers["X-Study-App"] = "one-step"', 'request.headers["X-Study-App"] = "one-step"', 'Header["X-Study-App"] = "one-step"'],
    ['응답 객체 반환', 'return response', 'return request', 'print(response)'],
    ['미들웨어 순서 검토', '요청·응답 순서를 테스트로 확인', '등록 순서는 항상 무관', '모든 미들웨어를 하나의 전역 함수로 합침'],
  ] },
  { title: 'HTTP 오류와 예외 처리', objective: 'HTTPException과 예외 처리기를 사용해 실패 원인을 적절한 상태 코드로 설명해요.', intro: '요청한 자원이 없거나 권한이 없으면 성공 형태의 JSON을 가장하지 말고 의미 있는 HTTP 오류를 반환해야 해요. HTTPException은 경로 처리 중 상태 코드와 detail을 빠르게 표현합니다.', example: 'from fastapi import HTTPException\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    course = find_course(course_id)\n    if course is None:\n        raise HTTPException(status_code=404, detail="Course not found")\n    return course', rule: '요청을 처리할 수 없는 조건은 적절한 HTTPException 상태 코드로 끝내요.', misconception: '실패를 200 응답 본문에 문자열로 담으면 클라이언트와 모니터링이 실패를 알기 어려워요.', days: [
    ['없는 리소스 응답', 'raise HTTPException(status_code=404, detail="Not found")', 'return {"status": 404}', 'raise HTTPException(status_code=200, detail="Not found")'],
    ['인증되지 않은 요청', 'status_code=401', 'status_code=403', 'status_code=204'],
    ['권한 없는 요청', 'status_code=403', 'status_code=200', 'status_code=301'],
    ['사용자 정의 예외 처리기', '@app.exception_handler(DomainError)', '@app.error_handler(DomainError)', '@app.catch(DomainError)'],
    ['오류 detail 표기', 'raise HTTPException(..., detail="Course not found")', 'print("Course not found")', 'response.status = "missing"'],
  ] },
  { title: '검증 오류 응답 다루기', objective: '요청 검증 오류의 공개 계약을 이해하고 사용자 정의 처리 시 기본 세부사항을 안전하게 다뤄요.', intro: 'FastAPI와 Pydantic은 잘못된 입력을 경로 작업에 넘기기 전에 검증해요. 기본 422 응답에는 실패한 위치와 규칙이 담기며 이를 수정할 때 내부 값이나 민감한 데이터를 노출하지 않도록 확인해야 합니다.', example: 'from fastapi import Request\nfrom fastapi.responses import JSONResponse\nfrom fastapi.exceptions import RequestValidationError\n\n@app.exception_handler(RequestValidationError)\nasync def validation_error(request: Request, error: RequestValidationError):\n    return JSONResponse(status_code=422, content={"detail": "Invalid input"})', rule: '검증 실패를 문서화된 422 응답으로 유지하고 필요한 공개 정보만 응답해요.', misconception: '검증 오류를 모두 500으로 바꾸면 클라이언트 입력 문제와 서버 장애를 구분할 수 없어요.', days: [
    ['기본 검증 오류 상태', '422 Unprocessable Entity', '500 Internal Server Error', '200 OK'],
    ['검증 오류 타입', 'RequestValidationError', 'ResponseValidationError를 요청 오류로 처리', 'HTTPException을 Pydantic 모델로 사용'],
    ['JSONResponse 상태 지정', 'JSONResponse(status_code=422, content=payload)', 'JSONResponse(status=422, body=payload)', 'Response(json=payload)'],
    ['오류 응답 데이터 최소화', '필요한 오류 위치만 반환', '요청의 비밀번호와 전체 헤더를 오류 로그에 포함', '예외 문자열 전체를 사용자에게 공개'],
    ['요청·응답 검증 구분', '잘못된 입력 422와 잘못된 서버 응답을 구분', '둘 다 200으로 반환', '응답 모델 오류를 입력 검증 오류로 숨김'],
  ] },
  { title: 'Lifespan 시작과 종료', objective: 'lifespan 컨텍스트에서 준비와 정리를 짝짓고 앱 상태를 안전하게 읽어요.', intro: 'Lifespan 함수는 앱이 시작될 때 필요한 자원을 준비하고 종료할 때 정리할 위치를 제공해요. 이벤트 콜백보다 하나의 컨텍스트 안에 시작·종료를 짝지으면 자원 수명을 살피기 쉬워집니다.', example: 'from contextlib import asynccontextmanager\n\n@asynccontextmanager\nasync def lifespan(app):\n    app.state.ready = True\n    yield\n    app.state.ready = False\n\napp = FastAPI(lifespan=lifespan)', rule: 'asynccontextmanager에서 시작 작업 뒤 yield, 종료 정리를 뒤에 둬요.', misconception: '서버 시작 한 번과 각 요청을 같은 생명주기로 혼동하지 않아요.', days: [
    ['컨텍스트 매니저 가져오기', 'from contextlib import asynccontextmanager', 'from context import asynccontextmanager', 'from fastapi import asynccontextmanager'],
    ['Lifespan 함수 데코레이터', '@asynccontextmanager', '@contextmanager', '@app.lifecycle'],
    ['시작·종료 경계', 'yield 앞 준비, 뒤 정리', 'yield 뒤에만 앱 준비', '시작 때마다 요청 핸들러 직접 호출'],
    ['앱 상태 저장', 'app.state.ready = True', 'request.state.ready = True를 시작 때 사용', 'global ready = True'],
    ['새 Lifespan 연결', 'FastAPI(lifespan=lifespan)', 'FastAPI(startup=lifespan)', 'app.include_router(lifespan)'],
  ] },
  { title: 'REST 동작과 상태 전이', objective: '생성·조회·부분 수정·삭제의 의미와 응답 코드를 작은 경로 조합으로 모델링해요.', intro: 'REST API는 경로를 리소스 중심으로 구성하고 HTTP 메서드와 상태 코드로 동작의 의미를 드러낼 수 있어요. 이 주 과정의 실행기는 각 요청을 새 임시 앱에서 검증하므로 여러 요청 사이의 데이터가 저장된다고 가정하지 않습니다.', example: '@app.post("/courses", status_code=201)\nasync def create_course(course: CourseCreate):\n    return course\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return {"course_id": course_id}', rule: '리소스 경로와 HTTP 메서드·상태 코드를 맞추고 저장소 책임을 분리해요.', misconception: '메모리 딕셔너리는 서버 재시작 후에도 기록을 보존하지 않고 여러 요청 간 안전성을 보장하지 않아요.', days: [
    ['리소스 목록 경로', 'GET /courses', 'GET /getAllCourses', 'POST /courses/list'],
    ['리소스 단건 경로', 'GET /courses/{course_id}', 'GET /course?id={course_id}', 'GET /courses/course_id'],
    ['새 리소스 생성', 'POST /courses → 201 Created', 'GET /courses → 201 Created', 'DELETE /courses → 200 Created'],
    ['부분 변경', 'PATCH /courses/{course_id}', 'OPTIONS /courses/{course_id}', 'GET /courses/{course_id}/edit'],
    ['삭제 성공 상태', '204 No Content', '201 Created', '422 Unprocessable Entity'],
  ] },
  { title: '인증 방식과 Bearer 토큰', objective: 'HTTP Bearer 토큰 추출과 OAuth2 흐름 문서화를 구분하고 데모 인증의 한계를 알아요.', intro: '보안 의존성은 Authorization 헤더에서 Bearer 자격 정보를 읽고 API 문서에 인증 방식을 표현할 수 있어요. 이 과정의 브라우저 실습은 공개된 모의 토큰만 사용하며 실제 비밀 키나 계정을 저장하지 않습니다.', example: 'from fastapi import Depends, FastAPI\nfrom fastapi.security import HTTPAuthorizationCredentials, HTTPBearer\n\nbearer = HTTPBearer()\n\n@app.get("/me")\nasync def read_me(token: HTTPAuthorizationCredentials = Depends(bearer)):\n    return {"token_type": token.scheme}', rule: 'HTTPBearer 객체를 Depends로 주입받아 인증 스킴과 자격 정보를 읽어요.', misconception: '토큰 문자열을 받았다는 사실만으로 서명·만료·사용자 권한까지 검증되지는 않아요.', days: [
    ['Bearer 스킴 가져오기', 'from fastapi.security import HTTPBearer', 'from fastapi import HTTPBearer', 'from fastapi.security import BearerHeader'],
    ['보안 의존성 생성', 'bearer = HTTPBearer()', 'bearer = Depends(HTTPBearer)', 'bearer = Header("Bearer")'],
    ['경로에 보안 의존성 연결', 'Depends(bearer)', 'Depends(bearer())', 'Header(bearer)'],
    ['인증 정보 필드 읽기', 'credentials.scheme', 'credentials.authorization', 'credentials.header'],
    ['검증 범위 설명', '실습용 추출과 실제 토큰 검증을 구분', '토큰이 문자열이면 누구나 인증 완료', '브라우저에 실제 서명 비밀값 저장'],
  ] },
  { title: '인증과 권한 분리', objective: '현재 사용자를 확인하는 인증과 작업 가능 여부를 확인하는 권한 검사를 구분해요.', intro: '인증은 요청 주체가 누구인지 확인하고 권한 부여는 그 주체가 특정 동작을 할 수 있는지 결정해요. 경로별로 정책을 흩뜨리지 않고 의존성으로 공통 검사와 리소스별 검사를 조합할 수 있습니다.', example: 'async def require_editor(user = Depends(get_current_user)):\n    if "editor" not in user.roles:\n        raise HTTPException(status_code=403, detail="Forbidden")\n    return user', rule: '사용자 식별 뒤 역할·리소스 소유권을 별도로 확인하고 거부 시 403을 반환해요.', misconception: '401은 인증 정보가 없거나 유효하지 않은 경우, 403은 주체가 확인됐지만 권한이 없는 경우에 적절해요.', days: [
    ['인증 실패 상태', '401 Unauthorized', '403 Forbidden', '404 Created'],
    ['권한 거부 상태', '403 Forbidden', '401 Unauthorized', '201 Created'],
    ['현재 사용자 의존성', 'user = Depends(get_current_user)', 'user = get_current_user()', 'user = Query(get_current_user)'],
    ['리소스 소유권 비교', 'resource.owner_id == user.id', 'resource.owner_id = user.id', '모든 요청에서 소유권 검사 생략'],
    ['최소 권한 원칙', '요청 기능에 필요한 권한만 허용', '모든 로그인 사용자에게 관리자 권한', '역할 이름을 응답에 그대로 노출'],
  ] },
  { title: 'TestClient로 동기 테스트', objective: 'TestClient로 ASGI 경로를 호출하고 상태·JSON 계약을 테스트해요.', intro: 'Starlette TestClient는 앱을 실제 포트에 배포하지 않고 ASGI 경로 작업을 테스트할 수 있어요. 테스트 앱을 context manager로 열면 lifespan 시작·종료를 포함해 검증할 수 있습니다.', example: 'from fastapi.testclient import TestClient\n\nwith TestClient(app) as client:\n    response = client.get("/health")\n\nassert response.status_code == 200\nassert response.json() == {"status": "ok"}', rule: 'TestClient 응답의 상태 코드와 JSON 본문을 독립적으로 확인해요.', misconception: '테스트가 공개 예시 한 건을 통과했다고 모든 입력을 증명하지는 않아요.', days: [
    ['TestClient 가져오기', 'from fastapi.testclient import TestClient', 'from fastapi import TestClient', 'from httpx import TestClient'],
    ['앱으로 클라이언트 만들기', 'TestClient(app)', 'TestClient("app")', 'TestClient(app())'],
    ['lifespan 테스트', 'with TestClient(app) as client:', 'client = TestClient(app)만으로 lifespan 항상 실행', 'await TestClient(app)'],
    ['상태 코드 단언', 'assert response.status_code == 200', 'assert response.status == 200', 'assert response.code == 200'],
    ['JSON 본문 단언', 'response.json()', 'response.json', 'response.body.json'],
  ] },
  { title: '의존성 대체와 격리', objective: 'dependency_overrides로 외부 저장소·인증을 테스트 대역으로 바꾸고 원상 복구해요.', intro: '경로 작업이 Depends를 사용하면 앱의 `dependency_overrides`를 통해 테스트 전용 반환값으로 교체할 수 있어요. 테스트 사이에 변경 내용을 복원해야 다른 사례가 영향을 받지 않습니다.', example: 'app.dependency_overrides[get_repository] = get_fake_repository\ntry:\n    with TestClient(app) as client:\n        response = client.get("/courses")\nfinally:\n    app.dependency_overrides.clear()', rule: '실제 외부 자원 대신 대역 의존성을 주입하고 테스트가 끝날 때 overrides를 되돌려요.', misconception: '의존성 함수를 바꿔도 이미 고정된 전역 연결이나 외부 서버 호출은 자동으로 대체되지 않아요.', days: [
    ['의존성 대체 사전', 'app.dependency_overrides[original] = replacement', 'app.overrides[original] = replacement', 'Depends.override(original, replacement)'],
    ['테스트 저장소 대역', 'get_fake_repository', '실제 운영 DB 주소', '학습자 입력으로 받은 SQL 서버'],
    ['대체 원상 복구', 'app.dependency_overrides.clear()', '테스트 종료 뒤 대체를 계속 유지', '테스트마다 전역 app 새로 만들지 않음'],
    ['외부 요청 격리', '네트워크 의존성을 테스트 대역으로 교체', '네트워크 차단 없이 테스트 완료 주장', 'API 키를 테스트 코드에 작성'],
    ['테스트 데이터 분리', '각 사례에 독립된 저장소 대역 사용', '공유 변경 가능 전역 상태에 의존', '순서에 따라 정답이 바뀌도록 구성'],
  ] },
  { title: '비동기 ASGI 테스트와 lifespan', objective: 'HTTPX ASGITransport와 LifespanManager로 async 경로를 올바르게 검사해요.', intro: '비동기 테스트는 AsyncClient와 ASGITransport를 사용해 앱의 ASGI 호출을 직접 검증할 수 있어요. ASGITransport만으로 앱 lifespan이 자동 실행되지 않으므로 필요한 경우 lifespan manager를 함께 사용합니다.', example: 'async with LifespanManager(app):\n    transport = ASGITransport(app=app)\n    async with AsyncClient(transport=transport, base_url="http://test") as client:\n        response = await client.get("/health")', rule: '비동기 client 요청을 await하고 앱 시작·종료가 필요하면 LifespanManager로 감싸요.', misconception: 'ASGITransport가 포트를 열거나 모든 lifespan 이벤트를 자동으로 처리한다고 가정하지 않아요.', days: [
    ['ASGI 전송 어댑터', 'ASGITransport(app=app)', 'ASGITransport(url=app)', 'AsyncClient(app=app) 최신 방식'],
    ['비동기 HTTP client', 'AsyncClient(transport=transport, base_url="http://test")', 'AsyncClient(transport=app)', 'Client(transport=transport)'],
    ['비동기 요청 대기', 'response = await client.get("/health")', 'response = client.get("/health")', 'await response.status_code'],
    ['별도 lifespan 실행', 'async with LifespanManager(app):', 'ASGITransport가 자동으로 lifespan 호출', 'lifespan 함수를 import만 함'],
    ['테스트 base URL', 'base_url="http://test"', 'base_url=""', 'base_url=app'],
  ] },
  { title: '필터·페이지 나누기·정렬', objective: '유효한 범위의 limit·offset과 정렬 기준을 선언해 큰 목록 응답을 제한해요.', intro: '페이지 나누기는 결과 크기와 시작 위치를 명시해 전체 데이터를 한 번에 돌려주지 않도록 돕습니다. 범위를 검증하고 정렬 순서를 고정해야 다음 페이지 사이의 결과가 이해하기 쉬워요.', example: 'from fastapi import Query\n\n@app.get("/courses")\nasync def list_courses(limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0)):\n    return {"limit": limit, "offset": offset}', rule: 'limit과 offset을 경계 검증하고 결과를 정렬한 다음 페이지 구간을 계산해요.', misconception: '최대 limit을 제한하지 않거나 정렬 없이 offset을 쓰면 응답량과 페이지 결과가 불안정해질 수 있어요.', days: [
    ['페이지 크기 상한', 'limit: int = Query(20, ge=1, le=100)', 'limit: int = Query(20)', 'limit: int = Query(20, ge=1000)'],
    ['0부터 시작하는 offset', 'offset: int = Query(0, ge=0)', 'offset: int = Query(-1)', 'offset: str = Query(0)'],
    ['정렬 후 자르기', 'items.sort(key=...) 후 items[offset:offset + limit]', 'items[:limit + offset]만 사용', '정렬 없이 무작위 목록 반환'],
    ['필터 입력 안전성', '허용된 sort_by 이름만 선택', '사용자 입력 문자열을 코드로 실행', '모든 필드 정렬 옵션 허용'],
    ['다음 페이지 계산', 'next_offset = offset + limit', 'next_offset = offset - limit', 'next_offset = limit - offset'],
  ] },
  { title: 'CORS와 브라우저 출처', objective: '브라우저 출처 정책과 서버 인증·권한 및 CSP를 서로 다른 경계로 설명해요.', intro: 'CORS는 브라우저가 다른 출처로 보내는 요청의 응답을 읽을 수 있는지 제어합니다. 인증·권한을 대신하지 않으며 쿠키 인증에서 와일드카드 출처와 자격 정보를 함께 허용하면 안 됩니다.', example: 'app.add_middleware(\n    CORSMiddleware,\n    allow_origins=["https://study.example"],\n    allow_credentials=True,\n    allow_methods=["GET", "POST"],\n    allow_headers=["Authorization", "Content-Type"],\n)', rule: '필요한 출처·메서드·헤더만 허용하고 CORS가 인증을 대체하지 않음을 기억해요.', misconception: 'CORS 설정은 서버에서 들어오는 모든 클라이언트나 curl 요청을 보안상 차단하는 기능이 아니에요.', days: [
    ['CORS 미들웨어 가져오기', 'from fastapi.middleware.cors import CORSMiddleware', 'from fastapi import CORSMiddleware', 'from cors import FastAPI'],
    ['허용 출처 제한', 'allow_origins=["https://study.example"]', 'allow_origins=["*"]와 credentials=True', 'allow_origins=["file://"]'],
    ['필요한 메서드만 허용', 'allow_methods=["GET", "POST"]', 'allow_methods=["*"] 항상 사용', 'allow_methods=["READ"]'],
    ['CORS 보안 역할', '브라우저의 교차 출처 응답 읽기 정책', 'API 인증·권한 검증', '서버 방화벽이나 CSP'],
    ['인증과 별도 검증', '요청 경로에서 토큰과 권한을 검사', 'CORS 허용 목록이면 인증 완료', 'Origin 헤더만으로 사용자 권한 판단'],
  ] },
  { title: '백그라운드 작업의 경계', objective: 'BackgroundTasks가 응답 후 실행하는 작은 후속 작업임을 알고 중요한 작업의 내구성을 과장하지 않아요.', intro: 'BackgroundTasks는 현재 응답 뒤 작은 작업을 실행하기 쉽게 하지만 프로세스가 종료되면 작업도 잃을 수 있어요. 중요한 재시도·내구성이 필요한 작업은 별도 작업 큐나 운영 인프라가 필요합니다.', example: 'from fastapi import BackgroundTasks\n\ndef record_notice(message: str):\n    print(message)\n\n@app.post("/notices")\nasync def create_notice(background_tasks: BackgroundTasks):\n    background_tasks.add_task(record_notice, "created")\n    return {"queued": True}', rule: 'BackgroundTasks에 callable과 인자를 등록하고 중요도·내구성 요구를 따져요.', misconception: '이 기능만으로 영속 큐, 재시도, 서버 재시작 후 보존을 보장하지 않아요.', days: [
    ['BackgroundTasks 주입', 'background_tasks: BackgroundTasks', 'background_tasks: BackgroundTask', 'background_tasks: Depends(BackgroundTasks())'],
    ['작업 함수 등록', 'background_tasks.add_task(send_notice, message)', 'background_tasks.run(send_notice)', 'await background_tasks.add_task(send_notice)'],
    ['응답 뒤 후속 처리', '작은 부수 작업에 제한해 사용', '응답 전 장시간 핵심 작업 실행', '요청 전체를 백그라운드 큐로 보장'],
    ['작업 내구성 설명', '프로세스 종료 시 보존되지 않을 수 있음', '영구 저장과 재시도 보장', '작업 성공을 클라이언트에게 반드시 전달'],
    ['무거운 작업 대안', '별도 작업 큐와 운영 경계 검토', 'BackgroundTasks를 분산 워커로 간주', '요청 응답 worker에서 무기한 CPU 루프'],
  ] },
  { title: '설정과 비밀 정보 경계', objective: '설정값과 비밀 정보 공급 경로를 구분하고 브라우저 코드·로그에 비밀을 넣지 않아요.', intro: '실제 서버 앱은 환경별 설정과 비밀 저장을 분리해야 합니다. 이 사이트는 서버를 띄우지 않고 코드도 브라우저에서 실행하므로 비밀 키·운영 DB 주소를 예제에 넣거나 사용자 입력으로 수집하지 않습니다.', example: 'from pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    app_name: str = "Study API"\n\nsettings = Settings()', rule: '설정 이름·기본값·비밀 공급 경로를 구분하고 실제 자격 정보는 저장소에 커밋하지 않아요.', misconception: '환경 변수 읽기 예제가 브라우저에서 서버 환경 변수나 비밀 저장소에 접근한다는 뜻은 아니에요.', days: [
    ['설정 모델 선언', 'class Settings(BaseSettings):', 'class Settings(BaseSettings = True):', 'class Settings = BaseSettings()'],
    ['개발 기본값과 비밀값 분리', '공개 기본 설정만 코드에 기록', '실제 API 키를 문자열 기본값으로 지정', '비밀값을 응답 모델에 포함'],
    ['환경별 설정 전달', '운영 실행 환경에서 안전하게 주입', '사용자 브라우저 localStorage를 서버 비밀 저장소로 설명', 'Git 저장소에 .env 업로드'],
    ['설정 문서화', '값의 목적·필수 여부·보관 위치 기록', '비밀값을 문서 예제로 그대로 공유', '설정 이름을 모두 응답에 반환'],
    ['사이트 실습 한계', '외부 DB·자격 증명 없이 모의값 사용', '운영 자격 증명을 브라우저에서 테스트', '서버가 있다고 안내'],
  ] },
  { title: 'API 운영·오류·관찰 가능성', objective: '로그·상태 점검·오류 응답을 개인정보와 외부 서비스 조건에 맞춰 설계해요.', intro: '운영 관찰은 실패 원인을 찾도록 돕지만 토큰·비밀번호·요청 본문 같은 민감 데이터는 기록하지 않아야 합니다. 상태 점검 경로는 앱 생존과 필수 의존성 준비 중 어떤 범위를 검증하는지 분명해야 해요.', example: '@app.get("/health")\nasync def health():\n    return {"status": "ok"}', rule: '필요한 진단 정보만 기록하고 비밀·개인 식별 데이터를 제거해요.', misconception: '모든 요청을 저장하거나 단순 health 경로 하나가 DB·네트워크 전체 정상성을 증명하는 것은 아니에요.', days: [
    ['구조화 로그 최소화', 'request_id와 결과 코드만 필요한 범위에서 기록', 'Authorization과 전체 본문을 로그에 저장', '응답을 그대로 모든 로그에 복제'],
    ['생존 점검과 준비 점검', 'health와 readiness 목적을 나눠 설명', 'health 200이면 모든 종속 서비스 정상', '정기 로그 기록을 준비 상태로 대체'],
    ['오류 응답 공개 범위', '사용자에게 필요한 안전한 오류만 반환', '스택 추적과 파일 경로 공개', '비밀번호를 오류 detail에 포함'],
    ['계측 비용·보관 검토', '수집 항목·보관 기간·비용을 기록', '외부 분석 추적을 기본으로 추가', '무기한 사용자 요청 원문 보관'],
    ['무료 사이트 운영 경계', '로컬 학습 데모와 서버 운영 API를 구분', '정적 사이트가 서버 로그를 보유한다고 안내', '동의 없이 사용 기록 전송'],
  ] },
  { title: '버전 관리와 업그레이드', objective: 'FastAPI·Python·Starlette·Pydantic의 버전을 함께 기록하고 안정판 변경을 검토해요.', intro: 'FastAPI는 Starlette와 Pydantic을 사용하므로 주요 의존성 변경이 요청 검증과 테스트에 영향을 줄 수 있어요. 버전 문맥, 호환 범위, 실행 엔진 버전을 함께 적고 사전 공개·미리보기와 안정판을 분리합니다.', example: 'FastAPI 0.143.0\nPython 학습 범위: 3.10+\n사이트 실행기: Python 3.14.2 / Pyodide 314.0.7', rule: '패키지 잠금과 공식 변경 기록을 확인하고 버전이 검수된 날짜를 남겨요.', misconception: '최신 Python에서 동작했다는 사실만으로 모든 배포 환경의 동일 동작을 보장하지 않아요.', days: [
    ['FastAPI 안정 버전 표기', '0.143.0 (2026-10-08 안정판)', '가장 최근 미리보기 버전을 안정판으로 표시', '검수 날짜 없는 latest'],
    ['Python 호환 범위', '문서의 최소 버전과 사이트 실행 버전을 따로 기록', 'Python 3.14.2만 지원한다고 안내', '모든 Python 버전 완전 호환 주장'],
    ['의존성 변경 검토', 'FastAPI·Starlette·Pydantic 조합 테스트', 'FastAPI 버전만 올리고 검증 생략', '잠금 파일 삭제'],
    ['변경 사항 확인', '공식 FastAPI release notes 확인', '타사 블로그만으로 API 지원 확정', 'draft 문서를 안정판처럼 사용'],
    ['검수 날짜 갱신', '버전·출처 확인일을 데이터와 함께 기록', '현재 버전 문자열만 덮어쓰기', '오래된 테스트 결과를 최신으로 표시'],
  ] },
  { title: '종합 · 학습 과정 API 설계', objective: '목록·상세 조회, 등록, 오류 처리와 테스트를 작은 학습 과정 API에서 연결해요.', intro: '마지막 주에는 학습 과정 API의 경로, 요청·응답 형식, 실패 처리와 테스트를 함께 살펴봅니다. 예제는 코드 읽기용이며 FastAPI 서버를 실행하거나 배포하지 않습니다.', example: '# router prefix는 /courses이며 모델과 service provider는 앞에서 정의했다고 가정합니다.\n@router.get("", response_model=list[CoursePublic])\nasync def list_courses(service: CourseService = Depends(get_service)):\n    return await service.list()', rule: '경로·요청과 응답 자료형·의존성·오류·테스트 사례를 함께 확인해요.', misconception: '작동하는 데모 코드가 인증·저장·재시도·운영 장애 대응을 모두 해결했다고 표현하지 않아요.', days: [
    ['공개 목록 계약', '@router.get("", response_model=list[CoursePublic])', '@router.post("/courses")', '@router.get("/{course_id}")'],
    ['상세 조회 실패', 'raise HTTPException(status_code=404, detail="Course not found")', 'return {}', 'raise HTTPException(status_code=200)'],
    ['생성 입력과 결과 분리', 'payload: CourseCreate', 'payload: CoursePublic', 'payload: dict'],
    ['서비스 의존성 경계', 'service: CourseService = Depends(get_service)', 'service: CourseService = get_service()', 'service = CourseService()'],
    ['통합 테스트 계획', '목록 200·없는 ID 404·생성 201·잘못된 입력 422를 각각 검증', '성공 응답 하나만 검사', '응답 객체가 있다는 사실만 확인'],
  ],
    dailyExamples: [
      '# router prefix는 /courses이며 모델과 service provider는 앞에서 정의했다고 가정합니다.\n@router.get("", response_model=list[CoursePublic])\nasync def list_courses(service: CourseService = Depends(get_service)):\n    return await service.list()',
      '# 없는 코스는 성공한 빈 객체가 아니라 명시적 404로 응답합니다.\n@router.get("/{course_id}", response_model=CoursePublic)\nasync def read_course(course_id: int, service: CourseService = Depends(get_service)):\n    course = await service.get(course_id)\n    if course is None:\n        raise HTTPException(status_code=404, detail="Course not found")\n    return course',
      '# 요청 입력 모델과 공개 응답 모델을 분리합니다.\nclass CourseCreate(BaseModel):\n    title: str\n\nclass CoursePublic(BaseModel):\n    id: int\n    title: str\n\n@router.post("", response_model=CoursePublic, status_code=201)\nasync def create_course(payload: CourseCreate, service: CourseService = Depends(get_service)):\n    return await service.create(payload)',
      '# Depends가 요청 경계에서 테스트 대체가 가능한 service를 제공합니다.\n@router.get("/summary")\nasync def course_summary(service: CourseService = Depends(get_service)):\n    return {"count": len(await service.list())}',
      '# client는 router를 연결한 FastAPI 앱의 TestClient fixture입니다.\n@pytest.mark.parametrize(\n    "method,path,payload,status",\n    [\n        ("get", "/courses", None, 200),\n        ("get", "/courses/999", None, 404),\n        ("post", "/courses", {"title": "Python"}, 201),\n        ("post", "/courses", {}, 422),\n    ],\n)\ndef test_course_contract(client, method, path, payload, status):\n    request = getattr(client, method)\n    response = request(path, json=payload) if payload is not None else request(path)\n    assert response.status_code == status',
    ],
    dailyReasons: [
      'router의 prefix가 `/courses`이므로 빈 suffix가 컬렉션 목록 경로를 만듭니다. 응답 모델도 단일 코스가 아닌 목록으로 선언합니다.',
      '요청 형식은 맞지만 대상 코스가 없으면 정상 빈 객체 대신 404를 반환해야 호출자가 누락을 구분할 수 있습니다.',
      'CourseCreate는 클라이언트가 보낼 필드만 받고 CoursePublic은 서버가 반환할 공개 필드를 제한합니다.',
      'Depends는 요청마다 service를 제공하고 테스트에서 대체할 수 있게 하며, 기본 인자로 직접 호출하거나 함수 안에서 만들면 주입 경계가 사라집니다.',
      '성공 경로뿐 아니라 없는 ID와 잘못된 요청을 각각 보내 기대 상태 코드가 다른지 확인해야 계약의 경계를 검증할 수 있습니다.',
    ],
    dailyChoiceHints: [
      'prefix가 `/courses`일 때 빈 경로와 `/{course_id}`가 각각 어떤 자원을 가리키는지 보세요.',
      '조회 요청 형식이 맞더라도 해당 ID의 코스가 없을 때 어떤 HTTP 상태를 돌려줘야 하는지 확인하세요.',
      '클라이언트가 보내는 필드와 서버가 응답에 공개할 필드를 구분하세요.',
      '서비스를 경로 안에서 직접 만들지 않고 테스트에서 바꿀 수 있도록 전달하는 방식을 찾으세요.',
      '목록 조회, 없는 ID, 생성, 잘못된 입력의 상태 코드를 각각 대조하세요.',
    ],
    dailyWrongReasons: [
      ['POST 경로는 목록 조회가 아니라 새 코스 등록에 사용합니다.', '상세 경로는 한 코스를 돌려주므로 목록 응답 모델과 맞지 않습니다.'],
      ['빈 객체를 성공으로 돌려주면 호출자가 코스가 없다는 사실을 구분하지 못합니다.', '없는 자원은 성공 상태가 아니라 404로 알려야 합니다.'],
      ['공개 응답 모델에는 서버가 만든 id가 있어 생성 입력과 맞지 않습니다.', 'dict만 받으면 이 과정에서 요구하는 입력 필드와 검증 계약이 드러나지 않습니다.'],
      ['기본 인자에서 함수를 직접 호출하면 요청마다 의존성을 제공하는 FastAPI 경계를 사용하지 않습니다.', '경로 함수 안에서 직접 만들면 테스트에서 서비스를 대체하기 어렵습니다.'],
      ['성공 응답 하나만으로 없는 ID·생성·잘못된 입력의 계약을 확인할 수 없습니다.', '응답 객체가 있다는 사실만으로 상태 코드가 맞는지 알 수 없습니다.'],
    ],
    dailyDiagnosticHints: [
      '경로 장식자의 빈 suffix와 `/{course_id}` 중 목록 조회에 맞는 쪽을 확인하세요.',
      '조회 결과가 None인 분기에서 빈 객체를 성공 반환하는 줄을 찾으세요.',
      '요청 본문에는 CourseCreate, 응답에는 CoursePublic을 쓰는지 확인하세요.',
      '테스트에서 교체할 service를 제공하는 `Depends(get_service)`가 있는지 살펴보세요.',
      '새 코스 등록 성공 상태를 201로 기대하는지 확인하세요.',
    ],
    dailyChoiceExplanations: [
      'router의 prefix가 `/courses`이므로 빈 경로가 컬렉션을 나타내고, `list[CoursePublic]`은 목록 응답을 선언합니다.',
      '조회 결과가 없으면 404를 반환해야 호출자가 존재하지 않는 코스를 구분할 수 있습니다.',
      'CourseCreate는 요청 입력을 받고 CoursePublic은 서버가 응답에 공개할 필드를 제한합니다.',
      'Depends가 요청 경계에서 서비스를 제공하므로 테스트에서 대체 구현을 주입할 수 있습니다.',
      '목록 조회는 200, 없는 코스는 404, 새 코스 생성은 201, 필수 입력 누락은 422로 확인합니다.',
    ],
    dailyDiagnostics: [
      { prompt: '다음 목록 조회 코드에서 목록 경로 대신 상세 경로를 등록한 줄을 고르세요.', codeLines: ['@router.get("/{course_id}")', 'async def list_courses():', '    return []'], line: 1, explanation: '1번 줄은 상세 ID 경로를 등록하지만 함수는 목록을 반환합니다. 목록 라우트는 `@router.get("")`처럼 컬렉션 경로를 사용해야 합니다.' },
      { prompt: '다음 상세 조회 코드에서 없는 코스를 성공 응답으로 돌려보내는 줄을 고르세요.', codeLines: ['async def read_course(course_id: int, service):', '    course = await service.get(course_id)', '    return {}'], line: 3, explanation: '3번 줄은 없는 코스를 빈 객체로 성공 처리합니다. 결과가 없으면 HTTPException의 404 응답을 던져야 합니다.' },
      { prompt: '다음 등록 경로에서 요청 모델로 잘못 사용한 타입이 선언된 줄을 고르세요.', codeLines: ['@router.post("", response_model=CoursePublic, status_code=201)', 'async def create_course(payload: CoursePublic, service):', '    return await service.create(payload)'], line: 2, explanation: '2번 줄은 서버가 응답할 공개 모델을 클라이언트 요청 입력으로 받습니다. 생성 입력에는 CourseCreate를 사용하고 응답은 CoursePublic으로 제한합니다.' },
      { prompt: '다음 경로 함수에서 테스트 대체가 어려운 서비스 인스턴스를 직접 만드는 줄을 고르세요.', codeLines: ['async def course_summary():', '    service = CourseService()', '    return {"count": len(await service.list())}'], line: 2, explanation: '2번 줄은 경로 내부에서 service를 직접 만들어 의존성을 교체하기 어렵게 합니다. `Depends(get_service)`로 주입하면 테스트에서 대체할 수 있습니다.' },
      { prompt: '다음 생성 테스트에서 계약과 맞지 않는 상태 코드를 단언한 줄을 고르세요.', codeLines: ['def test_create_course(client):', '    response = client.post("/courses", json={"title": "Python"})', '    assert response.status_code == 200'], line: 3, explanation: '3번 줄은 생성 성공 상태를 200으로 기대합니다. 새 리소스 생성 계약은 여기서 201을 사용하며, 통합 검토에는 404와 422 사례도 포함해야 합니다.' },
    ],
    dailyShortPrompts: [
      null, null, null, null,
      '예제의 네 요청 순서대로 기대 HTTP 상태 코드를 적으세요: 목록 조회, 없는 강좌 ID, 강좌 생성, 잘못된 입력.',
    ],
    dailyAcceptedAnswers: [
      null, null, null, null,
      [
        '200, 404, 201, 422',
        '200/404/201/422',
        '목록 200, 없는 ID 404, 생성 201, 잘못된 입력 422',
      ],
    ],
  },
];

const fastApiVersionWeek = plans.find((week) => week.title === '버전 관리와 업그레이드');
if (!fastApiVersionWeek) throw new Error('FastAPI version review week is required.');
fastApiVersionWeek.example = 'FastAPI 문서 기준 최신 안정판: 0.162.0 (2026-10-23, 2026-11-02 확인)\nPython 학습 범위: 3.10+\n브라우저 실행기 검증 고정: FastAPI 0.143.0 / Python 3.14.2 / Pyodide 314.0.7';
fastApiVersionWeek.days[0][1] = '0.162.0 (2026-10-23 안정판)';
fastApiVersionWeek.dailyDiagnostics = [
  {
    prompt: '2026-11-02 공식 릴리스 확인 기준 안정판은 0.162.0이고 브라우저 실행기는 검증된 0.143.0으로 고정되어 있습니다. 최신 문서판을 잘못 안내한 줄을 찾으세요.',
    codeLines: ['DOCS_STABLE_VERSION = "0.143.0"', 'BROWSER_RUNNER_VERSION = "0.143.0"'],
    line: 1,
    explanation: '1번 줄은 현재 문서 안정판을 실행기 버전인 0.143.0으로 잘못 안내합니다. 2026-10-23에 나온 0.162.0과 실행기에서 검증한 0.143.0은 구분해야 합니다.',
  },
];

if (plans.length !== 30) throw new Error('FastAPI curriculum must contain 30 reviewed weeks.');

const lessons = plans.map((week, weekIndex) => {
  const weekNumber = weekIndex + 1;
  const phase = phases.find((item) => weekNumber >= item.startWeek && weekNumber <= item.endWeek);
  const sessions = week.days.map(([focus, target, wrong, alternative], dayIndex) => {
    const questionId = `fastapi-w${String(weekNumber).padStart(2, '0')}-d${dayIndex + 1}`;
    const example = weekNumber === 30
      ? week.dailyExamples[dayIndex]
      : `${week.example}\n\n# ${focus}\n# 핵심 표현: ${target}`;
    const correctIndex = (weekNumber + dayIndex) % 3;
    const options = [wrong, alternative, target].map((text, index) => [text, index === 2
      ? `${focus}에 맞는 표현이에요. ${week.dailyReasons?.[dayIndex] ?? week.rule}`
      : week.dailyWrongReasons?.[dayIndex]?.[index] ?? `${focus}에 \`${text}\`를 쓰면 목표와 어긋나요. ${week.misconception}`]);
    const orderedOptions = [...options.slice(2 - correctIndex), ...options.slice(0, 2 - correctIndex)];
    const answerId = ['a', 'b', 'c'][orderedOptions.findIndex((option) => option === options[2])];
    const diagnostic = week.dailyDiagnostics?.[dayIndex] ?? null;
    const codeLines = diagnostic?.codeLines ?? ['from fastapi import FastAPI', 'app = FastAPI()', wrong, 'async def endpoint():', '    return {"ok": True}'];
    return studySession(dayIndex + 1, focus,
      `${week.objective} 오늘은 “${focus}” 주제를 예제로 살펴봐요.`,
      `${focus}는 이번 주의 ${week.title} 목표에 필요한 결정이에요. ${week.rule}`,
      example,
      [
        choice(`${questionId}-select`, `${focus}: 알맞은 표현 고르기`, `FastAPI에서 “${focus}” 주제에 맞는 코드를 고르세요.`, orderedOptions, ['a', 'b', 'c'].indexOf(answerId),
          week.dailyChoiceHints?.[dayIndex] ?? `${week.objective}와 선택 코드의 역할을 비교해 보세요.`,
          week.dailyChoiceExplanations?.[dayIndex] ?? `${week.dailyReasons?.[dayIndex] ?? week.rule} ${week.misconception}`,
        ),
        shortAnswer(`${questionId}-write`, `${focus}: 핵심 표현 직접 쓰기`, week.dailyShortPrompts?.[dayIndex] ?? `${focus}에서 사용할 코드 또는 핵심 용어를 적어 보세요.`, [target, ...(week.dailyAcceptedAnswers?.[dayIndex] ?? [])],
          `예제의 ${focus} 표현을 다시 확인하세요.`, `${target}을 사용해요. ${week.dailyReasons?.[dayIndex] ?? week.rule}`, 'python-expression'),
        locateError(`${questionId}-locate`, `${focus}: 잘못된 줄 찾기`, diagnostic?.prompt ?? `다음 코드에서 ${focus} 목표와 다른 줄을 고르세요.`, 'python', codeLines, [diagnostic?.line ?? 3],
          week.dailyDiagnosticHints?.[dayIndex] ?? `오류가 있는 표현이 FastAPI 요청 처리에서 어떤 역할인지 비교해 보세요.`,
          diagnostic?.explanation ?? `3번 줄의 \`${wrong}\`는 ${focus} 목표와 맞지 않아요. \`${target}\`처럼 고쳐야 해요. ${week.misconception}`),
      ],
    );
  });
  if (weekNumber <= 29) applyFastApiFoundationReview(weekNumber, sessions);
  applyFastApiStableVersionQuestionIdentity(weekNumber, sessions);
  return weeklyLesson({
    id: `fastapi-week-${String(weekNumber).padStart(2, '0')}`,
    topicId: phase.id,
    week: weekNumber,
    title: week.title,
    objective: week.objective,
    intro: week.intro,
    points: [week.rule, week.misconception],
    example: week.example,
    sessions,
    difficulty: ['입문', '입문', '기초', '기초', '중급', '중급'][phase.number - 1],
  });
});

export const fastapiCourseExpansion = {
  phases: phases.map((phase) => ({ id: phase.id, number: phase.number, title: phase.title, objective: phase.objective })),
  lessonOrder: lessons.map((lesson) => lesson.id),
  existingWeeks: {},
  lessons,
  reviewedWeeks: Array.from({ length: 30 }, (_, index) => index + 1),
};
