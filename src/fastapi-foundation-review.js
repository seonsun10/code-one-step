const dailyReviews = {
  1: [
    {
      intro: 'FastAPI()는 요청을 받을 앱 객체를 만들어요. 이 객체를 경로 작업과 ASGI 서버가 함께 사용합니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/health")\nasync def health():\n    return {"status": "ok"}',
      choice: {
        prompt: '새 FastAPI 모듈의 app 객체를 만들 때 호출해야 하는 표현은 무엇인가요?',
        correct: 'app = FastAPI()',
        correctFeedback: 'FastAPI 클래스를 호출해 경로 작업과 서버에 전달할 앱 인스턴스를 만듭니다.',
        incorrect: [
          { text: 'app = fastapi()', feedback: '소문자 fastapi는 가져오지 않은 이름이고 FastAPI 클래스 이름과도 다릅니다.' },
          { text: 'app = FastAPI', feedback: '괄호가 없어 클래스 자체를 가리킬 뿐 앱 인스턴스를 만들지 않습니다.' },
        ],
        hint: '클래스 이름 뒤에 호출 괄호를 붙여 인스턴스를 만드세요.',
        explanation: 'app = FastAPI()가 앱 인스턴스를 만듭니다. app = FastAPI는 클래스 객체만 가리킵니다.',
      },
      short: {
        prompt: '경로 데코레이터에 전달할 FastAPI 앱 인스턴스를 만드는 한 줄을 적으세요.',
        answers: ['app = FastAPI()'],
        hint: 'FastAPI 클래스 이름 뒤에 괄호를 붙여 호출합니다.',
        explanation: 'app = FastAPI()가 인스턴스를 만듭니다. 괄호를 빼면 클래스 객체만 대입돼요.',
      },
      locate: {
        prompt: '다음 모듈에서 경로 데코레이터가 사용할 앱 인스턴스를 만들지 못하는 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI', '@app.get("/health")', 'async def health():', '    return {"status": "ok"}'],
        line: 2,
        hint: '이름에 괄호가 없으면 호출 결과가 아니라 클래스 자체가 대입됩니다.',
        explanation: '2번 줄은 FastAPI 클래스를 호출하지 않고 그대로 대입합니다. app = FastAPI()로 인스턴스를 만들어야 @app.get을 사용할 수 있어요.',
      },
    },
    {
      intro: '경로 작업은 HTTP 메서드와 URL 경로를 함께 등록해요. GET과 POST는 같은 경로라도 서로 다른 요청 계약입니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/health")\nasync def health():\n    return {"status": "ok"}\n\n@app.get("/version")\nasync def version():\n    return {"api": 1}',
      choice: {
        prompt: 'GET /health 요청을 처리할 health 함수를 등록하는 올바른 데코레이터는 무엇인가요?',
        correct: '@app.get("/health")',
        correctFeedback: '@app.get("/health")가 해당 경로의 GET 작업을 등록합니다.',
        incorrect: [
          { text: '@app.route("/health")', feedback: '이 FastAPI 앱 객체에는 Flask식 route 데코레이터가 없습니다.' },
          { text: '@app.post("/health")', feedback: 'POST 작업을 등록하므로 GET /health 요청과 일치하지 않습니다.' },
        ],
        hint: '클라이언트 요청의 HTTP 메서드와 데코레이터의 메서드를 비교하세요.',
        explanation: '경로 작업 데코레이터는 URL과 HTTP 메서드를 함께 등록합니다. 함수 이름만으로는 경로가 연결되지 않아요.',
      },
      short: {
        prompt: 'GET /health를 처리할 함수를 등록하는 한 줄을 적으세요.',
        answers: ['@app.get("/health")'],
        hint: '앱 객체의 get 데코레이터에 URL 경로를 전달합니다.',
        explanation: '@app.get("/health")가 /health의 GET 작업을 등록합니다.',
      },
      locate: {
        prompt: 'GET 요청에 응답해야 하는 경로 작업에서 잘못 고른 메서드를 등록한 줄을 찾으세요.',
        lines: ['app = FastAPI()', '@app.post("/health")', 'async def health():', '    return {"status": "ok"}'],
        line: 2,
        hint: 'health 기능은 조회입니다. 등록한 메서드가 읽기 요청과 맞는지 보세요.',
        explanation: '2번 줄은 POST 요청만 등록합니다. 계약이 GET /health라면 @app.get("/health")를 사용해야 해요.',
      },
    },
    {
      intro: 'FastAPI는 일반 def와 async def 경로 작업을 모두 지원해요. 이 사례는 함수 안에서 비동기 호출을 await할 때 async def가 필요한 이유를 다룹니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\nasync def load_courses():\n    return []\n\n@app.get("/courses")\nasync def list_courses():\n    courses = await load_courses()\n    return {"items": courses}',
      choice: {
        prompt: '경로 함수 본문에서 courses = await load_courses()를 실행하려면 어떤 함수 선언을 써야 하나요?',
        correct: 'async def list_courses():',
        correctFeedback: 'async def로 선언해야 함수 본문에서 await 가능한 작업을 기다릴 수 있습니다.',
        incorrect: [
          { text: 'async list_courses():', feedback: 'Python 함수 선언에는 def가 필요하므로 문법에 맞지 않습니다.' },
          { text: 'def async list_courses():', feedback: 'async와 def의 순서가 Python 함수 선언 문법과 다릅니다.' },
        ],
        hint: 'Python 비동기 함수 선언은 async와 def를 이 순서로 씁니다.',
        explanation: 'await를 사용하려면 async def 함수 안에 있어야 합니다. FastAPI 경로 함수가 항상 비동기여야 한다는 뜻은 아니며 일반 def도 지원합니다.',
      },
      short: {
        prompt: 'await load_courses()를 포함하는 경로 함수의 선언 머리 부분을 적으세요.',
        answers: ['async def list_courses():'],
        hint: 'Python 비동기 함수는 async와 def를 이 순서로 씁니다.',
        explanation: 'async def list_courses():처럼 선언해야 본문에서 await할 수 있습니다. 비동기 호출이 없는 경로에는 일반 def도 유효해요.',
      },
      locate: {
        prompt: 'await를 사용하는 본문과 함께 쓸 수 없어 Python 문법 오류가 나는 선언 줄을 찾으세요.',
        lines: ['@app.get("/courses")', 'def list_courses():', '    courses = await load_courses()', '    return {"items": courses}'],
        line: 2,
        hint: '본문에서 await를 쓰는데 함수 선언에 비동기 표시가 있는지 확인하세요.',
        explanation: '2번 줄이 일반 def라 본문의 await와 함께 사용할 수 없습니다. async def list_courses():로 바꾸세요. 비동기 호출이 없는 경로에는 일반 def도 유효합니다.',
      },
    },
    {
      intro: '경로 작업의 반환값은 응답 본문이 됩니다. 딕셔너리는 JSON 객체로 직렬화되지만 print()는 값을 반환하지 않아요.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/status")\nasync def status():\n    return {"status": "ok"}',
      choice: {
        prompt: '상태 확인 응답에 JSON 객체 {"status": "ok"}를 보내려면 어떤 코드를 사용하나요?',
        correct: 'return {"status": "ok"}',
        correctFeedback: '딕셔너리를 반환하면 FastAPI가 이를 JSON 응답으로 변환합니다.',
        incorrect: [
          { text: 'return \'{"status": "ok"}\'', feedback: '이 코드는 JSON 객체가 아니라 JSON 문자열 값을 응답 본문으로 보냅니다.' },
          { text: 'print({"status": "ok"})', feedback: 'print는 서버 쪽 출력만 하고 반환값은 None이므로 응답 본문에 객체가 담기지 않습니다.' },
        ],
        hint: '터미널 출력 함수가 아니라 응답으로 보낼 값을 반환해야 해요.',
        explanation: '터미널에 표시하는 동작과 클라이언트에 JSON 본문을 보내는 동작은 다릅니다. 경로 함수가 딕셔너리를 return해야 FastAPI가 응답 본문으로 직렬화해요.',
      },
      short: {
        prompt: '상태 확인 경로가 status 필드를 가진 JSON 객체를 응답하도록 반환문을 적으세요.',
        answers: ['return {"status": "ok"}'],
        hint: '딕셔너리를 return해야 응답 본문이 만들어집니다.',
        explanation: 'return {"status": "ok"}가 JSON 객체 응답을 만듭니다. print 결과를 반환하지 않으면 클라이언트가 이 객체를 받지 못해요.',
      },
      locate: {
        prompt: '상태 확인 JSON을 클라이언트에 반환하지 못하는 줄을 찾으세요.',
        lines: ['@app.get("/health")', 'async def health():', '    print({"status": "ok"})'],
        line: 3,
        hint: 'print가 출력하는 위치와 HTTP 응답 본문이 만들어지는 위치를 구분하세요.',
        explanation: '3번 줄은 서버 출력만 남기고 응답값을 반환하지 않습니다. return {"status": "ok"}로 딕셔너리를 반환해야 해요.',
      },
    },
    {
      intro: 'FastAPI 앱 객체가 요청을 처리하고 ASGI 서버가 네트워크 요청을 전달합니다. 여기서는 main.py의 app을 Uvicorn이 불러 실행합니다.',
      example: 'from fastapi import FastAPI\nimport uvicorn\n\napp = FastAPI()\n\n@app.get("/health")\nasync def health():\n    return {"status": "ok"}\n\nif __name__ == "__main__":\n    uvicorn.run("main:app", reload=True)',
      choice: {
        prompt: 'main.py에 app = FastAPI()가 있을 때, Uvicorn에 이 앱을 지정하는 호출은 무엇인가요?',
        correct: 'uvicorn.run("main:app")',
        correctFeedback: 'main:app은 main 모듈의 app 객체를 지정해 ASGI 서버가 불러옵니다.',
        incorrect: [
          { text: 'python main.py', feedback: 'python main.py는 파일을 실행하는 명령입니다. Uvicorn 호출에서 앱 경로를 지정하는 형식과 구분하세요.' },
          { text: 'uvicorn.run("main:health")', feedback: 'health 함수가 아니라 FastAPI 앱 인스턴스를 서버에 전달해야 합니다.' },
        ],
        hint: '콜론 앞에는 모듈, 뒤에는 그 모듈에서 불러올 FastAPI 객체 이름을 둡니다.',
        explanation: 'uvicorn.run("main:app")은 main 모듈의 app 객체를 Uvicorn에 전달합니다. Uvicorn은 ASGI 서버이고 FastAPI 객체는 요청 처리를 맡아요.',
      },
      short: {
        prompt: 'main.py의 FastAPI 객체 이름이 app일 때 uvicorn.run에 전달할 문자열을 적으세요.',
        answers: ['"main:app"', "'main:app'"],
        hint: '모듈 이름과 그 모듈의 앱 변수 이름을 콜론으로 연결합니다.',
        explanation: '"main:app"은 main.py의 app 객체를 찾으라는 import 경로입니다. Uvicorn은 서버 역할을 맡습니다.',
      },
      locate: {
        prompt: 'Uvicorn이 main.py의 FastAPI 객체 대신 경로 함수를 찾게 만든 인자를 전달한 줄을 찾으세요.',
        lines: ['import uvicorn', 'uvicorn.run("main:health")'],
        line: 2,
        hint: '콜론 뒤에서 지정한 이름이 FastAPI 인스턴스인지 확인하세요.',
        explanation: '2번 줄은 main 모듈의 health 함수를 앱 객체로 지정합니다. Uvicorn에는 "main:app"을 전달해야 해요.',
      },
    },
  ],
  2: [
    {
      intro: '컬렉션을 읽는 요청에는 보통 GET을 사용합니다. HTTP 메서드 관례는 클라이언트와 도구가 API 의도를 이해하도록 돕습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses():\n    return [{"id": 1, "title": "Python"}]',
      choice: {
        prompt: '등록된 강의 목록을 변경하지 않고 조회하는 경로 작업에 어울리는 선언은 무엇인가요?',
        correct: '@app.get("/courses")',
        correctFeedback: 'GET은 리소스 표현을 조회하며 이 요청 자체로 서버 상태를 바꾸려 하지 않습니다.',
        incorrect: [
          { text: '@app.post("/courses")', feedback: 'POST는 보통 새 리소스 생성이나 처리를 요청할 때 쓰므로 목록 조회와 맞지 않습니다.' },
          { text: '@app.delete("/courses")', feedback: 'DELETE는 리소스 제거 의도이므로 읽기 전용 목록 경로와 맞지 않습니다.' },
        ],
        hint: '목록을 읽되 서버 상태를 바꾸지 않는 요청의 메서드를 생각하세요.',
        explanation: 'GET은 조회 의도를 나타내며 안전한 메서드 관례가 있습니다. 함수 이름과 반환 데이터만으로 메서드가 결정되지는 않아요.',
      },
      short: {
        prompt: '/courses의 목록 조회 경로 작업을 등록하는 FastAPI 데코레이터를 적으세요.',
        answers: ['@app.get("/courses")'],
        hint: '변경 없이 읽는 API에 관례적으로 쓰는 HTTP 메서드입니다.',
        explanation: '@app.get("/courses")는 목록 조회 경로 작업을 등록합니다.',
      },
      locate: {
        prompt: '목록 조회 전용 API인데 변경 요청용 메서드로 등록한 줄을 찾으세요.',
        lines: ['@app.post("/courses")', 'async def list_courses():', '    return [{"id": 1, "title": "Python"}]'],
        line: 1,
        hint: '기능은 목록 반환입니다. 등록한 메서드가 읽기 의도와 맞는지 살펴보세요.',
        explanation: '1번 줄은 POST 작업으로 등록했지만 함수는 목록을 조회합니다. 읽기 전용 API라면 @app.get("/courses")가 맞아요.',
      },
    },
    {
      intro: '새 리소스 생성 요청은 보통 POST로 설계하고, 생성 성공에는 201 Created를 명시할 수 있어요. 저장소를 생략한 예제이므로 실제 영속 저장은 하지 않습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post("/courses", status_code=201)\nasync def create_course():\n    return {"id": 7, "title": "Python"}',
      choice: {
        prompt: '새 강의를 등록하는 /courses 경로의 생성 요청에 사용할 메서드는 무엇인가요?',
        correct: '@app.post("/courses")',
        correctFeedback: 'POST는 컬렉션에 새 항목을 제출하는 일반적인 API 설계입니다. 저장 코드는 별도로 필요해요.',
        incorrect: [
          { text: '@app.get("/courses")', feedback: 'GET은 조회 의도이므로 새 코스를 만드는 처리를 요청하지 않습니다.' },
          { text: '@app.head("/courses")', feedback: 'HEAD는 본문 없이 GET 응답 헤더를 확인하는 메서드이며 생성을 뜻하지 않습니다.' },
        ],
        hint: '컬렉션에 새 리소스를 제출하는 메서드 관례를 떠올리세요.',
        explanation: 'HTTP API 관례에서는 새 항목 생성에 POST를 자주 씁니다. FastAPI는 업무 의미를 강제로 보장하지 않으므로 API 설계자가 계약을 정해야 해요.',
      },
      short: {
        prompt: '새 강의를 등록하는 경로 작업의 HTTP 메서드 데코레이터를 적으세요.',
        answers: ['@app.post("/courses")'],
        hint: '컬렉션에 새 리소스를 제출할 때 일반적으로 사용하는 메서드입니다.',
        explanation: '@app.post("/courses")가 생성 요청을 등록합니다. 실제 영속 저장은 별도의 데이터 저장 로직이 필요해요.',
      },
      locate: {
        prompt: '새 강의 등록 API의 목적과 다른 읽기 메서드를 등록한 줄을 찾으세요.',
        lines: ['@app.get("/courses")', 'async def create_course():', '    return {"id": 7, "title": "Python"}'],
        line: 1,
        hint: '함수 이름보다 실제 등록된 HTTP 메서드가 요청 계약을 결정합니다.',
        explanation: '1번 줄은 GET 조회로 등록되어 있습니다. 생성 계약이면 @app.post("/courses")로 바꾸고 상태 코드와 저장 동작도 정의해야 해요.',
      },
    },
    {
      intro: 'PATCH는 기존 리소스의 일부를 바꾸려는 의도를 나타냅니다. 아래 코드는 메서드와 경로만 보여 주며 본문 처리와 실제 저장은 구현하지 않습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.patch("/courses/{course_id}")\nasync def partially_update_course(course_id: int):\n    return {"course_id": course_id, "changed": True}',
      choice: {
        prompt: '기존 강의의 일부 필드만 바꾸는 /courses/{course_id} 경로에 알맞은 메서드는 무엇인가요?',
        correct: '@app.patch("/courses/{course_id}")',
        correctFeedback: 'PATCH는 대상 리소스에 부분 수정 요청을 보내려는 의도를 나타냅니다.',
        incorrect: [
          { text: '@app.options("/courses/{course_id}")', feedback: 'OPTIONS는 경로에서 통신 가능한 메서드 등 통신 옵션을 확인하는 데 사용합니다.' },
          { text: '@app.get("/courses/{course_id}")', feedback: 'GET은 리소스를 읽을 뿐 부분 수정 작업을 요청하지 않습니다. 상태 변경 동작을 의미하지 않아요.' },
        ],
        hint: '전체 표현 교체인 PUT과 구분되는 부분 수정 메서드입니다.',
        explanation: 'PATCH는 부분 수정, PUT은 보통 전체 표현 교체 의도입니다. FastAPI가 저장이나 병합을 자동으로 해 주지는 않아요.',
      },
      short: {
        prompt: '기존 강의 일부를 수정하는 경로 작업에 사용할 HTTP 메서드 데코레이터를 적으세요.',
        answers: ['@app.patch("/courses/{course_id}")'],
        hint: '완전한 교체를 뜻하는 PUT과 구분되는 부분 수정 메서드입니다.',
        explanation: '@app.patch("/courses/{course_id}")가 부분 수정 의도를 나타냅니다. 실제 변경과 저장은 별도 코드가 필요해요.',
      },
      locate: {
        prompt: '일부 필드만 수정하는 계약인데 조회 메서드로 등록한 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def partially_update_course(course_id: int):', '    return {"course_id": course_id, "changed": True}'],
        line: 1,
        hint: '응답 내용이 아니라 요청이 읽기인지 일부 변경인지 따져 보세요.',
        explanation: '1번 줄은 GET 조회 작업입니다. 부분 수정 계약에는 PATCH를 사용하고 실제 변경 로직도 구현해야 해요.',
      },
    },
    {
      intro: 'FastAPI는 경로 작업을 등록된 순서로 검사합니다. 문자열 경로 변수는 me도 값으로 받을 수 있으므로 고정 경로를 먼저 둬야 합니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/users/me")\nasync def read_current_user():\n    return {"user_id": "current"}\n\n@app.get("/users/{user_id}")\nasync def read_user(user_id: str):\n    return {"user_id": user_id}',
      choice: {
        prompt: '/users/{user_id}가 /users/me도 잡을 수 있습니다. 현재 사용자 경로에 먼저 등록할 데코레이터는 무엇인가요?',
        correct: '@app.get("/users/me")',
        correctFeedback: '고정된 /users/me를 먼저 두면 동적 사용자 ID로 해석되는 것을 막습니다.',
        incorrect: [
          { text: '@app.get("/users/{user_id}")', feedback: '문자열 매개변수 경로를 먼저 두면 /users/me가 user_id="me"로 처리될 수 있습니다.' },
          { text: '@app.get("/users/{rest:path}")', feedback: '여러 경로 조각을 소비할 수 있는 포괄 경로라 고정 경로보다 앞에 두면 안 됩니다.' },
        ],
        hint: '문자열 {user_id}도 me를 받을 수 있으니 더 구체적인 경로를 앞에 둡니다.',
        explanation: 'FastAPI는 경로 작업을 순서대로 평가합니다. 고정된 /users/me를 동적 경로보다 먼저 등록해야 해요.',
      },
      short: {
        prompt: '예제와 같은 `@app.get("경로")` 형식으로 `/users/me`를 먼저 등록할 한 줄을 적으세요.',
        answers: ['@app.get("/users/me")'],
        hint: '문자열 경로 변수도 me를 값으로 받을 수 있습니다.',
        explanation: '@app.get("/users/me")를 먼저 등록해야 합니다. FastAPI는 경로 작업을 선언 순서로 검사해요.',
      },
      locate: {
        prompt: 'GET /users/me가 현재 사용자 핸들러에 도달해야 합니다. 순서상 잘못 먼저 등록된 줄을 찾으세요.',
        lines: ['@app.get("/users/{user_id}")', 'async def read_user(user_id: str):', '    return {"user_id": user_id}', '', '@app.get("/users/me")', 'async def read_current_user():', '    return {"user_id": "current"}'],
        line: 1,
        hint: '위에서부터 먼저 맞는 경로를 사용합니다. user_id: str은 me를 거부하지 않아요.',
        explanation: '1번 줄이 고정 경로보다 먼저여서 /users/me가 user_id="me"로 처리될 수 있습니다. 고정 경로 작업을 앞에 두세요.',
      },
    },
    {
      intro: '경로가 등록돼 있어도 요청 메서드가 등록된 작업과 다르면 성공하지 않아요. 경로가 없는 404와 경로는 있지만 메서드가 지원되지 않는 405를 구분합니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses():\n    return [{"id": 1}]',
      choice: {
        prompt: 'GET /courses만 등록했을 때 같은 /courses로 POST를 보내면 기본적으로 어떤 상태 코드를 받나요?',
        correct: '405 Method Not Allowed',
        correctFeedback: '경로는 존재하지만 POST 작업은 등록되지 않아 405가 발생합니다.',
        incorrect: [
          { text: '404 Not Found', feedback: '404는 일치하는 경로가 없는 경우를 구분합니다. 여기서는 같은 경로에 GET 작업이 있습니다.' },
          { text: '422 요청 본문 검증 오류', feedback: '이 상황은 본문 검증이 아니라 등록된 메서드와 요청 메서드가 다릅니다.' },
        ],
        hint: '경로 없음과 경로는 있지만 요청 메서드가 등록되지 않은 경우를 구분하세요.',
        explanation: '해당 경로는 있지만 POST 작업이 없어 405 Method Not Allowed에 해당합니다. 다른 경로 자체가 없으면 보통 404예요.',
      },
      short: {
        prompt: 'GET /courses만 있을 때 POST /courses 요청에 해당하는 상태 코드 번호를 적으세요.',
        answers: ['405', '405 Method Not Allowed'],
        hint: '경로는 있지만 해당 경로에 POST 작업이 등록되지 않은 상황입니다.',
        explanation: '405 Method Not Allowed입니다. 같은 경로라도 GET과 POST 작업은 별도로 등록돼야 합니다.',
      },
      locate: {
        prompt: '새 강의 생성 요청을 처리해야 하는데 읽기 작업으로 등록했습니다. 요청 목적과 다른 메서드를 지정한 줄을 찾으세요.',
        lines: ['@app.get("/courses")', 'async def create_course():', '    return {"created": True}'],
        line: 1,
        hint: '클라이언트가 보내려는 POST와 데코레이터의 GET이 일치하는지 보세요.',
        explanation: '1번 줄은 GET만 등록합니다. POST 생성 요청을 받으려면 POST 작업이 필요하며, GET만 있을 때 POST /courses는 405가 됩니다.',
      },
    },
  ],
  3: [
    {
      intro: '경로 템플릿의 {course_id}는 함수 매개변수 course_id에 연결됩니다. URL 값이 어느 인자로 전달될지 이름을 맞춰야 합니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return {"course_id": course_id}',
      choice: {
        prompt: '경로가 /courses/{course_id}이고 ID를 정수로 받을 때 사용할 함수 선언은 무엇인가요?',
        correct: 'async def read_course(course_id: int):',
        correctFeedback: '중괄호의 course_id와 함수 인자 이름이 같아 경로 값을 연결할 수 있습니다.',
        incorrect: [
          { text: 'async def read_course(course: int):', feedback: '경로 변수는 course_id라 이름이 다른 course 인자에 연결되지 않습니다.' },
          { text: 'async def read_course(course_id: str):', feedback: '이름은 연결되지만 이 질문의 정수 ID 계약과 타입이 맞지 않습니다.' },
        ],
        hint: 'URL 중괄호 안 이름과 함수 매개변수 이름을 비교하세요.',
        explanation: '경로의 ID를 함수에서 받으려면 중괄호 안과 같은 이름을 선언합니다. 이 예시의 course: int는 경로 값과 연결되지 않고 필수 쿼리 매개변수로 처리됩니다.',
      },
      short: {
        prompt: '/courses/{course_id} 경로 변수와 이름이 일치하는 함수 인자를 적으세요.',
        answers: ['async def read_course(course_id: int):', 'course_id: int'],
        hint: '중괄호 안 이름과 매개변수 이름을 같게 씁니다.',
        explanation: 'async def read_course(course_id: int):처럼 이름을 맞춰야 FastAPI가 경로 값을 전달합니다.',
      },
      locate: {
        prompt: '경로의 course_id를 함수에서 받지 못하고 대신 필수 쿼리 입력을 요구하는 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def read_course(course: int):', '    return {"course_id": course}'],
        line: 2,
        hint: 'URL의 중괄호 이름과 함수 시그니처의 인자 이름을 대조하세요.',
        explanation: '2번 줄의 course는 경로 이름과 달라 필수 쿼리 입력으로 처리됩니다. 경로 값을 받으려면 course_id로 선언하세요.',
      },
    },
    {
      intro: 'URL 경로 값은 문자열로 들어오지만 int 타입 힌트가 있으면 FastAPI가 정수 변환과 검증을 시도합니다. 성공하면 함수 안에서 정수로 사용할 수 있어요.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return {"course_id": course_id, "python_type": type(course_id).__name__}',
      choice: {
        prompt: 'GET /courses/42의 ID를 함수에서 정수로 받으려면 어떤 타입을 선언해야 하나요?',
        correct: 'course_id: int',
        correctFeedback: 'int 타입은 유효한 URL 숫자를 정수로 변환해 전달하고 잘못된 값은 거부합니다.',
        incorrect: [
          { text: 'course_id: object', feedback: 'object는 넓은 타입이라 숫자로 변환하고 유효성까지 검증하라는 계약을 선언하지 않습니다.' },
          { text: 'course_id: str', feedback: 'str은 경로 값을 문자열로 받으므로 정수 변환과 검증을 선언하지 않습니다.' },
        ],
        hint: '값 42를 문자열이 아닌 정수로 받도록 선언한 타입을 찾으세요.',
        explanation: 'course_id: int는 유효한 숫자를 정수로 변환합니다. 변환할 수 없는 값은 경로 함수에 전달되지 않고 입력 검증 오류가 돼요.',
      },
      short: {
        prompt: '문자열 URL 값이 정수로 변환·검증되도록 하는 course_id 타입을 적으세요.',
        answers: ['course_id: int', 'course_id: "int"', "course_id: 'int'"],
        hint: '숫자 ID에 사용할 Python 정수 타입 이름입니다.',
        explanation: 'course_id: int로 선언하면 /courses/42는 정수 42로 전달되고 /courses/abc는 검증 오류가 됩니다. 문자열 타입 표기 "int"도 해당 이름을 해석할 수 있으면 같은 정수 타입으로 처리됩니다.',
      },
      locate: {
        prompt: '숫자 강의 ID가 아닌 문자열도 그대로 처리하게 만드는 타입 선언 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def read_course(course_id: str):', '    return {"course_id": course_id}'],
        line: 2,
        hint: 'str은 abc도 허용합니다. 숫자 변환이 일어나도록 선언됐는지 보세요.',
        explanation: '2번 줄은 임의 문자열을 허용합니다. 숫자 ID라면 course_id: int로 선언해 변환과 검증을 받아야 해요.',
      },
    },
    {
      intro: 'UUID는 다른 값과 겹칠 가능성을 매우 낮추도록 만든 고유 식별자예요. Python 표준 라이브러리의 uuid.UUID 타입으로 경로 입력을 검증할 수 있고 JSON 응답에는 문자열로 변환해 넣어요.',
      example: 'from uuid import UUID\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: UUID):\n    return {"course_id": str(course_id)}',
      choice: {
        prompt: '경로의 코스 ID를 UUID 형식으로 검증할 때 사용할 타입은 무엇인가요?',
        correct: 'course_id: UUID',
        correctFeedback: 'uuid.UUID를 가져와 실제 타입으로 쓰면 FastAPI가 UUID 형식의 입력을 검증할 수 있습니다.',
        incorrect: [
          { text: 'course_id: str', feedback: 'str은 임의 문자열을 허용하므로 UUID 형식을 검증하지 않습니다.' },
          { text: 'course_id: bytes', feedback: 'bytes는 UUID 표준 문자열 형식의 경로 검증을 선언하지 않습니다.' },
        ],
        hint: 'uuid 표준 라이브러리에서 가져오는 실제 타입의 이름을 사용하세요.',
        explanation: 'UUID 타입으로 선언하면 올바른 UUID 형식인지 확인할 수 있어요. 예제는 from uuid import UUID로 가져옵니다.',
      },
      short: {
        prompt: 'UUID 경로 값을 검증할 함수 매개변수의 타입 표현을 적으세요.',
        answers: ['course_id: UUID', 'course_id: "UUID"', "course_id: 'UUID'"],
        hint: 'uuid 표준 라이브러리에서 가져오는 타입 이름입니다.',
        explanation: 'course_id: UUID로 선언하며 from uuid import UUID가 필요합니다. 문자열 표기 "UUID"도 이름을 해석할 수 있으면 같은 타입으로 처리됩니다. JSON 응답에는 str(course_id)로 문자열을 넣을 수 있어요.',
      },
      locate: {
        prompt: 'UUID 형식의 경로 ID를 검증하지 않고 임의 문자열로 받게 만든 매개변수 줄을 찾으세요.',
        lines: ['from uuid import UUID', '@app.get("/courses/{course_id}")', 'async def read_course(course_id: str):', '    return {"course_id": course_id}'],
        line: 3,
        hint: 'UUID를 가져왔지만 함수 인자에 실제로 선언한 타입을 확인하세요.',
        explanation: '3번 줄이 str이라 임의 문자열을 받습니다. UUID 형식 검증이 목표라면 course_id: UUID로 선언하세요.',
      },
    },
    {
      intro: 'FastAPI 경로 템플릿의 동적 값은 {name} 모양으로 선언합니다. 중괄호가 없으면 변수 자리가 아니라 문자 그대로의 경로가 됩니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def read_item(item_id: int):\n    return {"item_id": item_id}',
      choice: {
        prompt: '/items/23에서 23을 item_id로 받아들이는 FastAPI 경로 표기는 무엇인가요?',
        correct: '"/items/{item_id}"',
        correctFeedback: '중괄호는 해당 경로 구간이 동적이라는 표시이며, 내부 이름으로 함수 인자와 값을 연결합니다.',
        incorrect: [
          { text: '"/items/item_id"', feedback: '중괄호가 빠져 URL에 item_id라는 글자가 그대로 포함되어야만 일치하는 정적 경로입니다.' },
          { text: '"/items/:item_id"', feedback: '콜론 표기는 FastAPI 경로 템플릿의 동적 매개변수 문법이 아닙니다.' },
        ],
        hint: '경로 변수 이름을 중괄호 안에 넣어 URL 값을 함수 인자에 연결하세요.',
        explanation: '"/items/{item_id}"로 선언해야 /items/23의 23이 함수 인자로 전달됩니다. 중괄호를 빼면 정적 경로예요.',
      },
      short: {
        prompt: 'item_id가 동적으로 들어갈 FastAPI 경로 문자열을 적으세요.',
        answers: ['"/items/{item_id}"', "'/items/{item_id}'"],
        hint: '변수 이름을 중괄호 안에 넣어 URL 값과 함수 인자를 연결합니다.',
        explanation: '"/items/{item_id}"처럼 써야 /items/23의 23이 변수로 전달됩니다. 중괄호를 빼면 정적 경로예요.',
      },
      locate: {
        prompt: '/items/23을 받아야 하지만 item_id라는 글자가 있는 URL만 맞게 만든 선언 줄을 찾으세요.',
        lines: ['@app.get("/items/item_id")', 'async def read_item(item_id: int):', '    return {"item_id": item_id}'],
        line: 1,
        hint: '함수 인자를 동적으로 채우려면 경로 문자열에 중괄호가 필요합니다.',
        explanation: '1번 줄에는 중괄호가 없어 item_id가 정적 글자로 취급됩니다. /items/{item_id}로 바꾸세요.',
      },
    },
    {
      intro: '정수 경로 변수에 숫자로 바꿀 수 없는 값을 보내면 기본 입력 검증이 실패하고 FastAPI가 422를 반환합니다. 이는 없는 경로의 404나 서버 오류 500과 달라요.',
        example: '# GET /courses/42는 정수 ID를 받아요.\n# GET /courses/abc는 함수 실행 전 422 입력 검증 오류를 반환해요.\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return {"course_id": course_id}',
      choice: {
        prompt: 'course_id: int인 /courses/{course_id}에 /courses/abc를 요청했을 때 기본 검증 상태 코드는 무엇인가요?',
        correct: '422 Unprocessable Entity',
        correctFeedback: '경로는 맞지만 abc를 정수로 바꿀 수 없어 요청 검증이 422로 실패합니다.',
        incorrect: [
          { text: '500 Internal Server Error', feedback: '잘못된 요청 입력은 서버 내부 장애 500으로 취급하지 않습니다.' },
          { text: '200 OK와 0', feedback: 'FastAPI는 잘못된 경로 값을 임의의 숫자로 바꾸어 성공 응답하지 않습니다.' },
        ],
        hint: 'FastAPI 기본 요청 검증 실패에 사용하는 4xx 상태 코드를 떠올리세요.',
        explanation: 'FastAPI 기본 응답은 422 요청 검증 오류입니다. 함수 인자 타입과 맞지 않는 입력은 경로 함수에서 처리되지 않아요.',
      },
      short: {
        prompt: 'course_id: int에 abc처럼 정수로 변환할 수 없는 경로 값이 들어올 때 기본 상태 코드 번호를 적으세요.',
        answers: ['422', '422 요청 검증 오류', '422 Unprocessable Entity', '422 Unprocessable Content'],
        hint: '입력 형식이 선언한 정수 타입과 맞지 않을 때의 기본 응답 코드입니다.',
        explanation: '422 요청 검증 오류입니다. 경로는 매칭되지만 값이 int 형식과 맞지 않아 경로 함수에 전달되지 않아요.',
      },
      locate: {
        prompt: '숫자 경로 ID에 abc를 보냈을 때 검증 오류를 내려야 합니다. 잘못된 타입 선언 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def read_course(course_id: str):', '    return {"course_id": course_id, "received_as": type(course_id).__name__}'],
        line: 2,
        hint: 'str이면 abc도 유효합니다. 정수 변환을 선언하도록 필요한 타입을 생각하세요.',
        explanation: '2번 줄이 str이라 /courses/abc가 정상 문자열로 통과합니다. course_id: int로 선언하면 같은 요청이 기본 검증에서 422가 돼요.',
      },
    },
  ],
  4: [
    {
      intro: '검색어가 없어도 목록을 볼 수 있게 q에 기본값 None을 주면 선택 쿼리가 됩니다. q 이름은 경로에 없으므로 URL의 ?q=python에서 전달돼요.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(q: str | None = None):\n    return {"query": q}\n\n# GET /courses       -> {"query": null}\n# GET /courses?q=api -> {"query": "api"}',
      choice: {
        prompt: '검색어를 생략하면 전체 목록을 조회하고, 전달하면 검색하는 /courses 경로입니다. q를 선택 입력으로 선언한 줄은 무엇인가요?',
        correct: 'q: str | None = None',
        correctFeedback: 'None 허용 타입과 기본값을 함께 두어 쿼리 입력을 선택으로 만듭니다. 값을 주면 문자열 검색어로 전달돼요.',
        incorrect: [
          { text: 'q: str', feedback: '기본값이 없으므로 q는 필수 쿼리 입력입니다. /courses만 호출하면 검증 오류가 납니다.' },
          { text: 'q: str = "None"', feedback: '문자열 "None"이 기본 검색어가 되어 실제 None 값과 빈 입력을 구분할 수 없습니다.' },
        ],
        hint: '선택 문자열은 None 타입과 None 기본값을 선언하면 생략할 수 있습니다.',
        explanation: 'FastAPI는 경로 템플릿에 없는 스칼라 매개변수를 쿼리에서 읽습니다. `str | None = None`은 생략 가능하면서 값이 있으면 문자열로 검증하는 선언입니다.',
      },
      short: {
        prompt: '검색어를 생략해도 GET /courses가 성공하도록 q의 선택 문자열 선언을 적으세요.',
        answers: ['q: str | None = None', 'q: str | None = Query(default=None)', 'q: Optional[str] = None'],
        hint: 'None을 허용하는 타입과 같은 기본값을 함께 적으세요.',
        explanation: '`q: str | None = None`이면 q가 없는 요청에서 None을 받습니다. 기본값이 없으면 쿼리는 필수가 됩니다.',
      },
      locate: {
        prompt: '검색어 없이 GET /courses를 호출할 수 있어야 합니다. 현재 q가 필수 쿼리가 되게 한 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI()', '', '@app.get("/courses")', 'async def list_courses(q: str):', '    return {"query": q}'],
        line: 5,
        hint: '쿼리 매개변수에 기본값이 없으면 요청에서 반드시 전달해야 합니다.',
        explanation: '5번 줄의 q에는 기본값이 없어 필수 쿼리가 됩니다. `q: str | None = None`으로 바꾸면 검색어를 생략한 요청도 처리할 수 있어요.',
      },
    },
    {
      intro: '기본값이 없는 비경로 스칼라 category는 필수 쿼리입니다. 카테고리별 자료를 보여 주는 예제이며, 사용자가 보내는 필터 값은 인증이나 접근 권한을 증명하지 않습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(category: str):\n    return {"category": category, "items": []}\n\n# GET /courses?category=python -> category="python"\n# GET /courses                  -> 필수 category 누락 오류',
      choice: {
        prompt: '강의 자료를 분류하는 category를 반드시 쿼리로 받아야 합니다. 기본값 없이 필수로 만드는 선언은 무엇인가요?',
        correct: 'category: str',
        correctFeedback: '경로에 없는 문자열 매개변수에 기본값이 없으므로 FastAPI가 필수 쿼리로 문서화하고 누락을 검증합니다. 이 필터 값은 권한 검사가 아닙니다.',
        incorrect: [
          { text: 'category: str = "all"', feedback: '기본값이 생겨 category 쿼리가 선택 입력이 됩니다. 요청마다 분류를 명시해야 하는 계약과 달라요.' },
          { text: 'category: str | None = None', feedback: 'None을 허용하고 기본값도 주어 입력을 생략할 수 있게 됩니다. 필수 category 조건이 사라져요.' },
        ],
        hint: '필수 쿼리는 FastAPI 함수 매개변수 뒤에 기본값을 쓰지 않습니다.',
        explanation: '`category: str`은 URL 쿼리의 필수 문자열입니다. 기본값이나 None을 선언하면 빠진 값을 자동으로 채워 요청이 통과할 수 있습니다. 쿼리 필터를 실제 사용자 권한으로 취급해서는 안 돼요.',
      },
      short: {
        prompt: 'GET /courses에서 category 쿼리를 반드시 보내게 만드는 Python 매개변수 선언을 적으세요.',
        answers: ['category: str', 'category: str = Query()', 'category: Annotated[str, Query()]'],
        hint: '경로에 없는 스칼라 입력은 쿼리에서 읽습니다. 필수로 만들려면 기본값을 생략하세요.',
        explanation: '`category: str`은 필수 문자열 쿼리입니다. `category=python`을 보내야 하며 기본값을 붙이면 선택 입력이 됩니다. 이 값은 인증된 사용자를 식별하지 않습니다.',
      },
      locate: {
        prompt: '요청마다 분류를 명시해야 하는데 누락해도 all로 진행되게 만든 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI()', '', '@app.get("/courses")', 'async def list_courses(category: str = "all"):', '    return {"category": category, "items": []}'],
        line: 5,
        hint: '기본값이 있으면 클라이언트가 해당 쿼리를 보내지 않아도 됩니다.',
        explanation: '5번 줄의 기본값 때문에 category가 선택 입력입니다. 필수 분류 쿼리라면 `category: str`로 바꾸고 누락을 검증해야 합니다. 필터는 권한 검사를 대신하지 않아요.',
      },
    },
    {
      intro: '페이지 크기는 1 이상 100 이하로 제한하고 기본값 20을 둘 수 있습니다. `ge`는 경계값을 포함하며, `gt`는 지정값을 제외합니다.',
      example: 'from fastapi import FastAPI, Query\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(limit: int = Query(default=20, ge=1, le=100)):\n    return {"limit": limit}\n\n# /courses?limit=1   -> 허용\n# /courses?limit=101 -> 요청 검증 오류',
      choice: {
        prompt: '페이지 크기는 기본 20이고 1과 100을 포함한 범위만 허용합니다. 올바른 Query 선언은 무엇인가요?',
        correct: 'Query(default=20, ge=1, le=100)',
        correctFeedback: '`ge=1`과 `le=100`은 양 끝을 포함하고, default=20은 생략 요청의 값을 정합니다.',
        incorrect: [
          { text: 'Query(default=20, gt=1, lt=100)', feedback: '`gt`와 `lt`는 경계값을 제외하므로 1과 100도 거부합니다. 양 끝 값을 포함하지 않아요.' },
          { text: 'Query(default=0, ge=1, le=100)', feedback: '기본값 0이 선언한 최소값 1을 위반합니다. 기본값도 제약을 만족해야 합니다.' },
        ],
        hint: '경계값을 허용한다면 greater-than-or-equal, less-than-or-equal 조건을 쓰세요.',
        explanation: '`ge=1, le=100`은 1부터 100까지의 정수만 허용하고 양 끝을 포함합니다. 기본값 20은 그 범위 안에 있어야 해요.',
      },
      short: {
        prompt: '기본 limit 20을 유지하면서 허용 범위를 1부터 100까지 포함하도록 Query 식을 쓰세요.',
        answers: ['Query(default=20, ge=1, le=100)', 'Query(20, ge=1, le=100)'],
        hint: '`ge`와 `le`는 각 경계값을 포함하므로 최소·최댓값을 그대로 허용합니다.',
        explanation: '`Query(default=20, ge=1, le=100)`은 기본값과 양 끝 포함 범위를 함께 선언합니다. `gt`나 `lt`를 쓰면 경계가 제외돼요.',
      },
      locate: {
        prompt: 'limit=0은 거부하고 1은 허용해야 합니다. 최소값이 0도 받아들이게 만든 제약 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI, Query', 'app = FastAPI()', '', '@app.get("/courses")', 'async def list_courses(limit: int = Query(default=20, ge=0, le=100)):', '    return {"limit": limit}'],
        line: 5,
        hint: '`ge`는 그 값 자체를 허용합니다. 최소 허용값과 제약 숫자를 비교하세요.',
        explanation: '5번 줄의 `ge=0`은 limit=0을 허용합니다. 요구 범위가 1 이상이면 `ge=1`로 고쳐야 해요.',
      },
    },
    {
      intro: '같은 이름의 쿼리 매개변수를 여러 번 보내려면 list 타입과 Query 메타데이터로 다중값임을 선언합니다. 미전달 상태는 None으로 받고 빈 목록으로 다룰 수 있어요.',
      example: 'from typing import Annotated\nfrom fastapi import FastAPI, Query\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(tags: Annotated[list[str] | None, Query()] = None):\n    return {"tags": tags or []}\n\n# /courses?tags=python&tags=api -> ["python", "api"]',
      choice: {
        prompt: 'GET /courses?tags=python&tags=api에서 두 값을 모두 받으려면 어떤 선언을 사용해야 하나요?',
        correct: 'tags: Annotated[list[str] | None, Query()] = None',
        correctFeedback: '리스트 타입과 Query 메타데이터가 여러 값을 받는 쿼리 계약을 명시하고, None 기본값은 입력 생략을 허용합니다.',
        incorrect: [
          { text: 'tags: str | None = None', feedback: '스칼라 문자열 하나만 선언하므로 반복된 키를 리스트로 받는 계약이 아닙니다.' },
          { text: 'tags: Annotated[list[str] | None, Body()] = None', feedback: '본문에서 리스트를 읽도록 선언했으므로 URL 쿼리 매개변수가 아닙니다. JSON 본문을 요구해요.' },
        ],
        hint: '반복된 쿼리 키는 list 타입과 Query 메타데이터를 함께 사용하세요.',
        explanation: 'FastAPI가 리스트를 쿼리 입력으로 해석하도록 `Query()`를 표시해야 합니다. `Annotated`는 list 타입과 FastAPI 매개변수 메타데이터를 함께 전달합니다.',
      },
      short: {
        prompt: '반복된 tags 쿼리를 문자열 목록으로 받고 생략도 허용할 전체 매개변수 선언을 적으세요.',
        answers: ['tags: Annotated[list[str] | None, Query()] = None', 'tags: list[str] | None = Query(default=None)'],
        hint: 'typing.Annotated 안에 문자열 목록과 Query 메타데이터를 둡니다.',
        explanation: '`Annotated[list[str] | None, Query()] = None`은 반복 쿼리 값을 목록으로 받고, 매개변수가 없으면 None을 전달합니다.',
      },
      locate: {
        prompt: 'tags=python과 tags=api를 모두 목록으로 처리해야 합니다. 반복 입력을 스칼라 문자열로 축소하는 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import FastAPI, Query', 'app = FastAPI()', '', '@app.get("/courses")', 'async def list_courses(tags: Annotated[str | None, Query()] = None):', '    return {"tags": [tags] if tags else []}'],
        line: 6,
        hint: '두 값을 모두 보존할 타입은 str 하나가 아니라 문자열 목록입니다.',
        explanation: '6번 줄은 tags를 스칼라 문자열로 선언해 반복된 쿼리 값을 목록으로 표현하지 못합니다. `Annotated[list[str] | None, Query()]`로 바꾸세요.',
      },
    },
    {
      intro: '경로 템플릿과 일치하는 course_id는 path에서, 템플릿에 없는 include_lessons는 Query 메타데이터가 붙은 쿼리에서 받습니다.',
      example: 'from fastapi import FastAPI, Query\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int, include_lessons: bool = Query(default=False)):\n    return {"course_id": course_id, "include_lessons": include_lessons}\n\n# /courses/8?include_lessons=true',
      choice: {
        prompt: 'GET /courses/8?include_lessons=true에서 8은 경로에서, include_lessons는 쿼리에서 받아야 합니다. 명시적 쿼리 선언은 무엇인가요?',
        correct: 'include_lessons: bool = Query(default=False)',
        correctFeedback: '경로 템플릿에 없는 이 값은 쿼리 입력이며 Query로 기본값과 위치를 명확히 선언합니다.',
        incorrect: [
          { text: 'include_lessons: bool = Body(default=False)', feedback: 'Body는 JSON 본문에서 읽도록 표시합니다. URL의 ?include_lessons=... 입력과 다릅니다.' },
          { text: 'include_lessons: bool = Path(default=False)', feedback: '경로 입력은 템플릿에 매개변수가 있어야 하며 경로 매개변수에는 기본값을 둘 수 없습니다.' },
        ],
        hint: '경로 템플릿에 없는 URL 입력을 명시하는 FastAPI 도구를 선택하세요.',
        explanation: '`Query(default=False)`는 include_lessons를 선택 쿼리로 선언합니다. `course_id`는 경로 템플릿에 있으므로 FastAPI가 path에서 가져옵니다.',
      },
      short: {
        prompt: 'include_lessons를 URL 쿼리에서 선택적으로 받도록 기본값과 함께 선언하세요.',
        answers: ['include_lessons: bool = Query(default=False)', 'include_lessons: bool = False'],
        hint: '스칼라 bool 값의 출처를 Query로 명확히 표시하고 기본값을 주세요.',
        explanation: '`Query(default=False)`는 쿼리 누락 시 False를 사용합니다. 경로 값은 경로 템플릿과 이름을 맞추고, JSON 본문은 모델로 선언합니다.',
      },
      locate: {
        prompt: '클라이언트가 URL 쿼리로 include_lessons 값을 보냅니다. 이를 JSON 본문 값으로 바꾸는 줄을 찾으세요.',
        lines: ['from fastapi import Body, FastAPI', 'app = FastAPI()', '', '@app.get("/courses/{course_id}")', 'async def read_course(course_id: int, include_lessons: bool = Body(default=False)):', '    return {"course_id": course_id, "include_lessons": include_lessons}'],
        line: 5,
        hint: 'URL 뒤의 ?key=value에서 오는 값은 요청 본문이 아닙니다.',
        explanation: '5번 줄의 `Body`가 입력 출처를 JSON 본문으로 정합니다. URL 쿼리 계약이라면 `Query(default=False)`를 사용하세요.',
      },
    },
  ],
  5: [
    {
      intro: 'Pydantic BaseModel을 상속한 클래스는 요청 JSON의 필드와 타입을 선언합니다. 경로 작업 매개변수에 그 모델 타입을 적으면 본문을 검증해 전달해요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass CourseCreate(BaseModel):\n    title: str\n\n@app.post("/courses")\nasync def create_course(course: CourseCreate):\n    return {"title": course.title}\n\n# 요청 본문: {"title": "Python"}',
      choice: {
        prompt: 'POST /courses의 JSON 객체를 Pydantic 요청 모델로 검증하려 합니다. 모델 선언의 기반 클래스는 무엇인가요?',
        correct: 'class CourseCreate(BaseModel):',
        correctFeedback: 'BaseModel 상속이 필드 정의와 Pydantic 검증·변환·스키마 생성을 제공합니다.',
        incorrect: [
          { text: 'class CourseCreate:', feedback: '일반 Python 클래스일 뿐 Pydantic 모델의 검증·JSON 스키마 동작을 상속하지 않습니다.' },
          { text: 'class CourseCreate(FastAPI):', feedback: 'FastAPI 앱 클래스를 데이터 모델의 기반으로 사용할 수 없습니다. Pydantic BaseModel을 상속하세요.' },
        ],
        hint: '요청 데이터 모델은 FastAPI 앱 객체가 아니라 Pydantic의 클래스를 상속합니다.',
        explanation: '모델은 `pydantic.BaseModel`을 상속해야 요청 JSON이 필드 타입에 맞게 검증됩니다. 경로 함수 인자의 모델 타입은 본문 위치를 나타냅니다.',
      },
      short: {
        prompt: 'CourseCreate가 Pydantic 요청 모델이 되도록 클래스 선언 한 줄을 쓰세요.',
        answers: ['class CourseCreate(BaseModel):'],
        hint: '모델 클래스 이름 뒤 괄호에 Pydantic 기반 클래스를 넣습니다.',
        explanation: '`class CourseCreate(BaseModel):`이 필드 검증과 스키마를 제공하는 Pydantic 모델 선언입니다.',
      },
      locate: {
        prompt: 'CourseCreate가 요청 JSON을 검증해야 합니다. Pydantic 모델 기능을 받지 못하게 한 선언 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel', '', 'class CourseCreate:', '    title: str'],
        line: 3,
        hint: '필드 주석만 있는 일반 클래스는 Pydantic 검증 모델이 아닙니다.',
        explanation: '3번 줄에 BaseModel 상속이 빠졌습니다. `class CourseCreate(BaseModel):`로 선언해야 필드 타입 기반 검증을 사용할 수 있어요.',
      },
    },
    {
      intro: 'Pydantic v2에서는 필드 타입이 None을 허용하는 것과 값을 생략할 수 있는 것이 별도입니다. `str | None`만 쓰면 필수지만 null을 받을 수 있고 `= None`을 더해야 선택 필드가 됩니다.',
      example: 'from pydantic import BaseModel\n\nclass CourseCreate(BaseModel):\n    title: str\n    description: str | None = None\n\n# {"title": "Python"} -> description은 None\n# {"title": "Python", "description": null}도 허용',
      choice: {
        prompt: '설명(description)을 아예 보내지 않아도 되고, 보내면 문자열 또는 null을 허용하려 합니다. Pydantic v2 선언은 무엇인가요?',
        correct: 'description: str | None = None',
        correctFeedback: '타입의 None 허용과 None 기본값이 함께 있어 null을 받으며 필드 자체도 생략할 수 있습니다.',
        incorrect: [
          { text: 'description: str | None', feedback: '타입은 null을 허용하지만 기본값이 없어 Pydantic v2에서 필수 필드입니다.' },
          { text: 'description: str = "None"', feedback: '문자열 "None"이 기본값이며 JSON null이나 필드 생략의 계약이 아닙니다.' },
        ],
        hint: '필드 생략 허용은 타입만으로 정해지지 않습니다. 선언에 기본값이 있는지도 확인하세요.',
        explanation: 'Pydantic v2에서 `str | None`은 null 가능 여부만 나타냅니다. 필드를 생략 가능하게 하려면 `= None` 기본값도 지정해야 합니다.',
      },
      short: {
        prompt: '요청에서 생략 가능하고, 전달되면 문자열이나 null일 수 있는 description 필드 선언을 적으세요.',
        answers: ['description: str | None = None', 'description: Optional[str] = None', 'description: str | None = Field(default=None)'],
        hint: 'None을 허용하는 union 타입 뒤에 같은 기본값을 명시합니다.',
        explanation: '`description: str | None = None`은 생략 가능하고 null도 허용합니다. 기본값을 빼면 null은 가능해도 필수 입력이 됩니다.',
      },
      locate: {
        prompt: 'description을 생략할 수 있어야 합니다. null은 가능하지만 필드 누락은 거부하게 만든 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel', '', 'class CourseCreate(BaseModel):', '    title: str', '    description: str | None'],
        line: 5,
        hint: 'Pydantic v2에서 선택 필드는 기본값을 지정해야 합니다.',
        explanation: '5번 줄에 기본값이 없어 description은 필수이며 값으로 null을 허용할 뿐입니다. `= None`을 추가하면 생략도 가능해요.',
      },
    },
    {
      intro: '모델 필드의 Python 타입은 변환과 검증 계약을 만듭니다. 소수점 단위까지 표시하는 강의 평점 rating에는 float 주석을 적고, 기본값 대입과 타입 선언을 혼동하지 않아요.',
      example: 'from pydantic import BaseModel\n\nclass CourseCreate(BaseModel):\n    title: str\n    rating: float\n\n# {"title": "Python", "rating": 4.5} -> rating은 숫자로 검증',
      choice: {
        prompt: '강의 평점 rating은 4.5처럼 소수도 허용합니다. 정수로 제한하지 않는 Pydantic 필드 선언은 무엇인가요?',
        correct: 'rating: float',
        correctFeedback: 'float 타입 주석은 필드의 숫자 자료형을 설명해 소수점 평점 값을 검증·변환할 수 있습니다.',
        incorrect: [
          { text: 'rating = float', feedback: '타입 주석이 아니라 float 클래스 자체를 기본값으로 대입해 Pydantic 필드 선언이 아닙니다.' },
          { text: 'rating: int', feedback: 'int는 소수점 평점 계약과 맞지 않아 정수 입력만 허용합니다. 4.5 같은 값은 필드 타입과 다릅니다.' },
        ],
        hint: 'Pydantic 모델 필드는 이름 뒤 콜론으로 Python 타입을 적습니다.',
        explanation: '`rating: float`은 소수 값을 받는 타입 선언입니다. `rating = float`은 콜론이 없어 필드 타입이 아니고, int는 4.5 평점 계약과 다릅니다. 실제 통화 금액은 부동소수점 정밀도를 별도로 검토해야 합니다.',
      },
      short: {
        prompt: 'CourseCreate에서 소수점 평점을 검증하도록 rating 필드 한 줄을 쓰세요.',
        answers: ['rating: float'],
        hint: '필드명 뒤에 콜론과 소수를 표현할 Python 타입을 적습니다.',
        explanation: '`rating: float`은 Pydantic이 소수점 평점을 숫자 타입으로 검증하도록 선언합니다.',
      },
      locate: {
        prompt: 'rating을 float 필드로 검증해야 합니다. 타입 주석 대신 클래스 값을 대입한 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel', '', 'class CourseCreate(BaseModel):', '    title: str', '    rating = float'],
        line: 5,
        hint: 'Python 타입 주석에는 필드명과 타입 사이에 콜론이 있습니다.',
        explanation: '5번 줄은 `rating`에 float 타입을 주석으로 선언하지 않았습니다. `rating: float`로 바꾸면 요청 본문의 숫자 필드가 됩니다.',
      },
    },
    {
      intro: '중첩 JSON 객체는 그 모양을 표현하는 다른 Pydantic 모델을 필드 타입으로 재사용합니다. 부모 모델이 자식 필드의 구조와 타입 검증을 함께 설명해요.',
      example: 'from pydantic import BaseModel\n\nclass Instructor(BaseModel):\n    name: str\n    expertise: str\n\nclass CourseCreate(BaseModel):\n    title: str\n    instructor: Instructor\n\n# {"title":"API", "instructor":{"name":"Mina","expertise":"testing"}}',
      choice: {
        prompt: '요청 JSON의 instructor 객체 안에 name과 expertise가 있어야 합니다. 중첩 모델 필드 선언은 무엇인가요?',
        correct: 'instructor: Instructor',
        correctFeedback: 'Instructor 모델을 타입으로 사용하면 중첩 JSON 객체를 그 모델 규칙에 맞춰 검증합니다.',
        incorrect: [
          { text: 'instructor: dict[Instructor]', feedback: 'dict의 키/값 타입 지정은 Instructor 객체 모델과 같은 중첩 JSON 계약을 만들지 않습니다.' },
          { text: 'instructor: Instructor()', feedback: '필드 타입이 아니라 인스턴스를 클래스 본문 기본값으로 만들고 있습니다. 하위 모델 타입 검증이 되지 않아요.' },
        ],
        hint: '객체 내부 필드까지 검증하려면 그 객체를 표현하는 BaseModel을 필드 타입으로 둡니다.',
        explanation: '`Instructor`가 BaseModel이면 `instructor: Instructor`가 중첩 모델 필드가 됩니다. Pydantic은 들어온 JSON 객체를 Instructor 구조로 검증해요.',
      },
      short: {
        prompt: 'CourseCreate 안에서 instructor 객체를 Instructor 모델로 검증하는 필드 선언을 쓰세요.',
        answers: ['instructor: Instructor', "instructor: 'Instructor'"],
        hint: '중첩 모델을 생성자 호출이 아니라 타입으로 지정합니다.',
        explanation: '`instructor: Instructor`는 하위 JSON 객체를 Instructor 모델로 검증하고 구조화합니다.',
      },
      locate: {
        prompt: 'instructor JSON 객체 전체를 Pydantic 하위 모델로 검증해야 합니다. 모델 인스턴스를 기본값처럼 호출한 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel', '', 'class Instructor(BaseModel):', '    name: str', '', 'class CourseCreate(BaseModel):', '    instructor: Instructor()'],
        line: 7,
        hint: '다른 모델을 중첩 필드로 쓸 때 괄호를 붙여 인스턴스를 만들지 않습니다.',
        explanation: '7번 줄은 필드의 타입 위치에서 Instructor()를 호출합니다. `instructor: Instructor`처럼 클래스 자체를 타입으로 써야 합니다.',
      },
    },
    {
      intro: '하나의 경로 함수에서 경로 ID, Pydantic 본문, 선택 쿼리를 함께 받을 수 있습니다. 경로 템플릿과 모델 타입이 각각 입력 출처를 결정해요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass CourseUpdate(BaseModel):\n    title: str\n\n@app.put("/courses/{course_id}")\nasync def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):\n    return {"id": course_id, "title": payload.title, "notify": notify}\n\n# ID는 path, payload는 JSON, notify는 query',
      choice: {
        prompt: '강의 ID는 경로, 수정 필드는 JSON 본문, 알림 여부는 선택 쿼리로 받습니다. 올바른 경로 함수 선언은 무엇인가요?',
        correct: 'async def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):',
        correctFeedback: '경로 템플릿 이름, Pydantic 모델 본문, 기본값이 있는 스칼라 쿼리를 함께 선언했습니다.',
        incorrect: [
          { text: 'async def update_course(course_id: int, payload: str, notify: bool = False):', feedback: 'str 같은 스칼라 payload는 본문 모델이 아니라 쿼리로 해석됩니다.' },
          { text: 'async def update_course(course_id: int, payload: CourseUpdate, notify: bool):', feedback: 'notify에는 기본값이 없어 필수 쿼리가 됩니다. 문제의 선택 입력 계약과 다릅니다.' },
        ],
        hint: '경로 변수와 일치하는 인자, BaseModel 인자, 기본값이 있는 스칼라 인자를 구분하세요.',
        explanation: 'course_id는 path, Pydantic `CourseUpdate`는 body, 기본값이 있는 `notify`는 query입니다. FastAPI가 타입과 기본값을 바탕으로 각 위치를 해석합니다.',
      },
      short: {
        prompt: 'path의 course_id, JSON의 CourseUpdate, 선택 query notify를 받는 함수 선언 전체를 쓰세요.',
        answers: [
          'async def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):',
          'def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):',
          'async def update_course(payload: CourseUpdate, course_id: int, notify: bool = False):',
          'def update_course(payload: CourseUpdate, course_id: int, notify: bool = False):',
          'async def update_course(course_id: int, payload: CourseUpdate, notify: bool = Query(default=False)):',
        ],
        hint: 'Pydantic 모델을 인자로 받고 선택 쿼리에 기본값을 둡니다.',
        explanation: '경로에 포함된 course_id는 path, Pydantic 모델은 body, 기본값이 있는 bool은 query 입력이 됩니다.',
      },
      locate: {
        prompt: 'payload는 JSON 본문이어야 합니다. FastAPI가 문자열을 쿼리 매개변수로 분류하게 만든 함수 선언 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'from pydantic import BaseModel', '', 'class CourseUpdate(BaseModel):', '    title: str', '', 'app = FastAPI()', '', '@app.put("/courses/{course_id}")', 'async def update_course(course_id: int, payload: str):', '    return {"id": course_id, "title": payload}'],
        line: 10,
        hint: 'Pydantic 모델 인자는 요청 본문으로, 스칼라 문자열은 보통 쿼리로 해석됩니다.',
        explanation: '10번 줄의 `payload: str`은 본문 모델이 아니라 쿼리 문자열입니다. `payload: CourseUpdate`로 바꾸면 JSON 객체 본문을 검증합니다.',
      },
    },
  ],
  6: [
    {
      intro: '문자열 최소 길이와 최대 길이는 Pydantic Field의 검증 규칙입니다. min_length=1이면 빈 문자열은 막고 한 글자는 허용합니다.',
      example: 'from pydantic import BaseModel, Field\n\nclass CourseCreate(BaseModel):\n    title: str = Field(min_length=1, max_length=80)\n\n# "A" -> 허용\n# "" -> 요청 검증 오류',
      choice: {
        prompt: '강의 제목은 최소 한 글자여야 합니다. 빈 문자열을 거부하면서 길이 1을 허용하는 제약은 무엇인가요?',
        correct: 'Field(min_length=1)',
        correctFeedback: '`min_length=1`은 길이 1 이상을 허용하므로 빈 문자열만 최소 경계 아래에 남습니다.',
        incorrect: [
          { text: 'Field(min_length=0)', feedback: '길이 0도 최소값과 같아 허용하므로 빈 문자열을 거부하지 않습니다. 제목 필수 조건과 맞지 않아요.' },
          { text: 'Field(max_length=0)', feedback: '빈 문자열만 허용할 수 있어 한 글자 이상 제목을 받지 못합니다. 최대 길이만 지정하고 있어요.' },
        ],
        hint: '빈 문자열 길이는 0입니다. 허용할 최소 글자 수를 그보다 크게 설정하세요.',
        explanation: '`min_length=1`은 빈 제목을 거부하고 한 글자는 허용합니다. `min_length=0`이면 빈 문자열이 경계 조건을 만족합니다.',
      },
      short: {
        prompt: 'Pydantic 문자열 필드가 빈 값이 아닌 한 글자 이상이어야 하도록 Field 제약을 적으세요.',
        answers: ['Field(min_length=1)', 'Field(min_length=1, max_length=80)'],
        hint: '문자열 필드가 만족해야 할 최소 글자 수를 지정하세요.',
        explanation: '`Field(min_length=1)`은 빈 문자열을 거부합니다. 길이 1은 최소 경계에 포함되어 허용돼요.',
      },
      locate: {
        prompt: '빈 제목은 거부하고 한 글자는 받아야 합니다. 최소 길이를 0으로 둔 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel, Field', '', 'class CourseCreate(BaseModel):', '    title: str = Field(min_length=0, max_length=80)'],
        line: 4,
        hint: '빈 문자열 길이도 0이므로 최소 길이 0은 빈 값 자체를 거부하지 않습니다.',
        explanation: '4번 줄은 `min_length=0`으로 빈 제목을 허용합니다. `min_length=1`로 바꾸면 최소 한 글자를 요구합니다.',
      },
    },
    {
      intro: '실습 시간은 0보다 커야 하는 수치 필드입니다. `gt=0`은 엄격한 greater-than 조건이라 0은 포함하지 않고 양수만 허용해요.',
      example: 'from pydantic import BaseModel, Field\n\nclass LessonPlan(BaseModel):\n    study_hours: float = Field(gt=0)\n\n# 0.5 -> 허용\n# 0 -> 요청 검증 오류',
      choice: {
        prompt: '학습 시간 study_hours는 0보다 커야 하고 0은 허용하지 않습니다. 어떤 Field 경계 조건이 맞나요?',
        correct: 'Field(gt=0)',
        correctFeedback: '`gt`는 경계보다 커야 하므로 0은 거부되고 양수만 통과합니다. 0과 같은 값은 포함하지 않아요.',
        incorrect: [
          { text: 'Field(ge=0)', feedback: '`ge`는 0 이상을 허용하므로 0원이 통과합니다. 양수만 요구하는 계약과 달라요.' },
          { text: 'Field(lt=0)', feedback: '0보다 작은 음수를 요구해 양수 가격을 거부합니다. 부호 방향도 요구사항과 반대예요.' },
        ],
        hint: '0을 제외하고 그보다 큰 수만 허용하는 비교 연산자를 고르세요.',
        explanation: '`gt=0`은 strict greater-than 제약입니다. `ge=0`은 경계 0을 포함하므로 문제의 양수 시간 조건과 다릅니다.',
      },
      short: {
        prompt: 'study_hours가 0보다 큰 양수여야 하고 0은 거부하도록 Field 수치 제약을 적으세요.',
        answers: ['Field(gt=0)', 'Field(gt=0.0)'],
        hint: '경계값 자체를 허용하지 않는 greater-than 조건을 쓰세요.',
        explanation: '`Field(gt=0)`에서 gt는 0보다 엄격하게 커야 한다는 뜻이므로 0은 허용되지 않습니다.',
      },
      locate: {
        prompt: 'study_hours=0은 유효하지 않아야 합니다. 0도 허용하는 경계 연산자를 사용한 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel, Field', '', 'class LessonPlan(BaseModel):', '    study_hours: float = Field(ge=0)'],
        line: 4,
        hint: '`ge`는 greater-than-or-equal이라 경계와 같은 값도 통과시킵니다.',
        explanation: '4번 줄의 `ge=0`은 study_hours가 0인 입력을 허용합니다. 0보다 큰 시간만 받으려면 `gt=0`을 사용하세요.',
      },
    },
    {
      intro: '선택 설명에 Field 길이 제약을 더하면 값이 없거나 null인 요청은 허용하면서 문자열이 전달된 경우에는 최대 글자 수를 검증할 수 있습니다.',
      example: 'from pydantic import BaseModel, Field\n\nclass CourseCreate(BaseModel):\n    title: str\n    description: str | None = Field(default=None, max_length=160)\n\n# 설명 생략 또는 null -> 허용\n# 160자 초과 문자열 -> 요청 검증 오류',
      choice: {
        prompt: 'description을 생략하거나 null로 보내는 것은 허용하고, 문자열은 160자까지로 제한합니다. 올바른 선언은 무엇인가요?',
        correct: 'description: str | None = Field(default=None, max_length=160)',
        correctFeedback: 'None 기본값은 생략을 허용하고 nullable 타입은 null을 허용하며, max_length는 전달된 문자열 길이를 제한합니다.',
        incorrect: [
          { text: 'description: str | None = Field(default=None, max_length=161)', feedback: '생략과 null은 허용하지만 160자 초과 161자 문자열도 허용해 최대 길이 조건을 지키지 않습니다.' },
          { text: 'description: str = Field(default="", max_length=160)', feedback: '길이 제한은 적용하지만 str 타입이라 명시적 JSON null을 받을 수 없습니다.' },
        ],
        hint: 'Field의 default와 max_length를 살펴보고, 타입이 None도 허용하는지 확인하세요.',
        explanation: 'Pydantic v2에서 None 기본값은 필드 생략을 허용하고 nullable 타입은 명시적 null을 허용합니다. `max_length=160`은 값이 문자열일 때의 길이를 검증합니다.',
      },
      short: {
        prompt: '생략·null을 허용하면서 description 문자열을 최대 160자로 제한하는 필드 선언을 쓰세요.',
        answers: [
          'description: str | None = Field(default=None, max_length=160)',
          'description: str | None = Field(max_length=160, default=None)',
          'description: Optional[str] = Field(default=None, max_length=160)',
        ],
        hint: 'Field에 None 기본값과 최대 문자열 길이를 함께 지정하세요.',
        explanation: '`Field(default=None, max_length=160)`은 생략과 null을 허용하면서 값이 문자열이면 160자 제한을 검사합니다.',
      },
      locate: {
        prompt: 'description은 최대 160자여야 합니다. 문자열 제한을 생략해 더 긴 입력도 통과시키는 필드 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel, Field', '', 'class CourseCreate(BaseModel):', '    description: str | None = None'],
        line: 4,
        hint: '선택 필드와 문자열 길이 제한은 별도 규칙입니다. Field에 최대 길이가 있는지 확인하세요.',
        explanation: '4번 줄에는 `Field(max_length=160)`이 없어 임의 길이의 문자열이 통과할 수 있습니다. 선택 기본값을 유지하면서 최대 길이 메타데이터를 추가하세요.',
      },
    },
    {
      intro: '정수 수량의 최대값 100을 포함하려면 `le=100`을 씁니다. 100은 허용하고 101부터 거부하는 경계를 나타내요.',
      example: 'from pydantic import BaseModel, Field\n\nclass Enrollment(BaseModel):\n    seats: int = Field(ge=1, le=100)\n\n# 1과 100 -> 허용\n# 0과 101 -> 요청 검증 오류',
      choice: {
        prompt: '등록 가능 좌석 수는 1에서 100까지 포함합니다. 100은 허용하고 101은 거부할 최대 제약은 무엇인가요?',
        correct: 'Field(le=100)',
        correctFeedback: '`le`는 less-than-or-equal이므로 최대 경계 100을 허용합니다.',
        incorrect: [
          { text: 'Field(lt=100)', feedback: '`lt`는 100 미만을 요구해 좌석 100개를 거부합니다. 상한의 끝값을 포함하지 않아요.' },
          { text: 'Field(ge=100)', feedback: '`ge`는 100 이상을 요구해 1부터 99까지 정상 수량을 거부합니다. 상한이 아니라 하한 조건이에요.' },
        ],
        hint: '최댓값 자체도 유효해야 하므로 less-than-or-equal을 사용하세요.',
        explanation: '`le=100`은 100 이하를 허용합니다. `lt=100`은 엄격한 경계라 100을 포함하지 않습니다.',
      },
      short: {
        prompt: '좌석 수 상한은 100이고 100 자체는 유효합니다. 포함형 최대 Field 제약을 쓰세요.',
        answers: ['Field(le=100)', 'Field(ge=1, le=100)'],
        hint: '최대 경계를 포함하는 연산자는 less-than-or-equal입니다.',
        explanation: '`Field(le=100)`은 100 이하를 허용해 정확히 100인 좌석 수가 통과합니다.',
      },
      locate: {
        prompt: '정원 100명은 허용하고 101명부터 막아야 합니다. 경계값 100을 제외하게 만든 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel, Field', '', 'class Enrollment(BaseModel):', '    seats: int = Field(ge=1, lt=100)'],
        line: 4,
        hint: '`lt`는 경계와 같은 값도 제외하므로 상한 포함 조건과 달라요.',
        explanation: '4번 줄의 `lt=100`은 100을 거부합니다. 상한을 포함하려면 `le=100`으로 바꾸세요.',
      },
    },
    {
      intro: '경로 함수 인자를 Pydantic 요청 모델로 선언하면 FastAPI가 본문을 함수 호출 전에 검증합니다. 잘못된 본문은 기본 422 응답으로 거부되어 함수가 처리하지 않습니다.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI()\n\nclass Enrollment(BaseModel):\n    seats: int = Field(ge=1, le=100)\n\n@app.post("/enrollments")\nasync def create_enrollment(payload: Enrollment):\n    return {"seats": payload.seats}\n\n# seats=0 -> 기본 요청 검증 422',
      choice: {
        prompt: '잘못된 seats 값이 경로 함수에 도달하기 전에 모델 규칙으로 검증되게 할 매개변수 타입은 무엇인가요?',
        correct: 'payload: Enrollment',
        correctFeedback: 'Pydantic 모델 타입을 본문 인자로 받으면 FastAPI가 handler 실행 전에 형식과 Field 제약을 검증합니다.',
        incorrect: [
          { text: 'payload: dict', feedback: '임의 dict 타입은 Enrollment 필드 계약을 이 위치에서 검증하지 않습니다.' },
          { text: 'payload: str', feedback: '스칼라 문자열로 선언하면 JSON 객체 모델 검증이 적용되지 않습니다. 본문 계약의 필드 구조가 빠져요.' },
        ],
        hint: '유효성 규칙이 선언된 모델 자체를 요청 본문의 매개변수 타입으로 사용하세요.',
        explanation: '`payload: Enrollment`으로 받아야 seats의 ge/le 제약을 FastAPI 요청 경계에서 검사합니다. dict로 받으면 같은 모델 검증이 자동 적용되지 않아요.',
      },
      short: {
        prompt: 'Enrollment 필드 제약으로 요청 본문을 자동 검증하게 할 경로 함수 인자 선언을 적으세요.',
        answers: ['payload: Enrollment', 'payload: Annotated[Enrollment, Body()]'],
        hint: 'Pydantic 모델 이름을 매개변수 타입으로 지정합니다.',
        explanation: '`payload: Enrollment`은 모델을 JSON 본문으로 받고 FastAPI가 경로 함수 실행 전에 검증하게 합니다. 기본 검증 실패 응답은 422입니다.',
      },
      locate: {
        prompt: 'seats의 Enrollment 제약이 요청 경계에서 적용되어야 합니다. 모델 대신 임의 객체를 받는 선언 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'from pydantic import BaseModel, Field', '', 'class Enrollment(BaseModel):', '    seats: int = Field(ge=1, le=100)', '', 'app = FastAPI()', '', '@app.post("/enrollments")', 'async def create_enrollment(payload: dict):', '    return {"seats": payload["seats"]}'],
        line: 10,
        hint: '요청 매개변수에서 제약을 가진 Pydantic 모델 타입을 사용해야 합니다.',
        explanation: '10번 줄은 일반 dict를 받아 Enrollment 검증을 적용하지 않습니다. `payload: Enrollment`로 선언하면 잘못된 seats 입력이 handler 전에 검증됩니다.',
      },
    },
  ],
  7: [
    {
      intro: '응답 모델은 클라이언트에 공개할 필드 계약입니다. 반환 객체에 내부 메모가 더 있어도 `response_model`에 없는 필드는 기본 응답에서 필터링돼요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass CoursePublic(BaseModel):\n    title: str\n    level: int\n\n@app.get("/courses/{course_id}", response_model=CoursePublic)\nasync def read_course(course_id: int):\n    return {"title": "Python", "level": 2, "internal_note": "review pending"}\n\n# 응답 계약에는 title과 level만 포함',
      choice: {
        prompt: '강의 상세 응답의 문서화·검증·필드 필터링을 CoursePublic에 맡기려면 어떤 경로 선언이 필요하나요?',
        correct: '@app.get("/courses/{course_id}", response_model=CoursePublic)',
        correctFeedback: 'response_model이 반환 데이터의 응답 스키마와 검증·직렬화·필터링 기준을 정합니다.',
        incorrect: [
          { text: '@app.get("/courses/{course_id}", response_model=CourseCreate)', feedback: 'CourseCreate는 입력 계약입니다. 외부에 보여 줄 응답 모델을 분리해야 합니다.' },
          { text: '@app.get("/courses/{course_id}", response_model=None)', feedback: 'None은 FastAPI 응답 모델 생성을 끕니다. CoursePublic의 필드 검증과 필터링을 하지 않아요.' },
        ],
        hint: '요청 본문 모델과 응답으로 내보낼 모델을 구분해 경로 데코레이터에 연결하세요.',
        explanation: '`response_model=CoursePublic`은 응답에 필요한 공개 필드와 타입을 선언합니다. 실제 코드에서 이 응답 계약만으로 인증·권한 검사가 끝나는 것은 아니에요.',
      },
      short: {
        prompt: 'GET 강의 상세 응답을 CoursePublic으로 검증하고 문서화하는 데코레이터 한 줄을 적으세요.',
        answers: ['@app.get("/courses/{course_id}", response_model=CoursePublic)'],
        hint: 'HTTP 메서드와 경로 다음에 response_model 매개변수를 둡니다.',
        explanation: '`response_model=CoursePublic`은 응답 자료의 스키마·검증·직렬화·출력 필드 경계를 지정합니다.',
      },
      locate: {
        prompt: '응답은 CoursePublic 공개 모델을 따라야 합니다. 입력용 CourseCreate를 응답 모델로 연결한 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'from pydantic import BaseModel', '', 'class CourseCreate(BaseModel):', '    title: str', '', 'class CoursePublic(BaseModel):', '    title: str', '    level: int', '', 'app = FastAPI()', '@app.get("/courses", response_model=CourseCreate)', 'async def list_courses():', '    return [{"title": "Python", "level": 2}]'],
        line: 13,
        hint: '클라이언트에 내보낼 모델은 공개 응답 필드와 일치해야 합니다.',
        explanation: '13번 줄은 입력용 CourseCreate를 응답 모델로 사용합니다. 공개 목록 계약인 `response_model=list[CoursePublic]`로 바꾸세요.',
      },
    },
    {
      intro: '반환된 객체에 내부 필드가 있어도 `response_model`은 선언된 공개 필드만 출력하도록 검증·필터링합니다. 이 기능과 사용자 접근 권한 검사는 별도 경계예요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass AccountPublic(BaseModel):\n    name: str\n    email: str\n\n@app.get("/account", response_model=AccountPublic)\nasync def read_account():\n    return {"name": "Mina", "email": "m@example.com", "password_hash": "internal-only"}\n\n# 출력에는 password_hash가 포함되지 않음',
      choice: {
        prompt: '내부 계정 객체의 password_hash가 공개 응답 JSON에 포함되지 않게 제한할 선언은 무엇인가요?',
        correct: '@app.get("/account", response_model=AccountPublic)',
        correctFeedback: 'AccountPublic에 없는 password_hash는 응답 모델 출력에서 필터링됩니다. 접근 권한 검사는 별도로 필요해요.',
        incorrect: [
          { text: '@app.get("/account", response_model=AccountInternal)', feedback: '내부 해시 필드를 가진 모델을 공개 응답에 연결하면 그 필드가 응답 계약에 포함될 수 있습니다.' },
          { text: '@app.get("/account", response_model=None)', feedback: '응답 모델을 끄면 반환값을 공개 필드 계약으로 검증하거나 필터링하지 않아 password_hash가 그대로 노출될 수 있습니다.' },
        ],
        hint: '응답 모델에는 클라이언트에 공개해도 되는 필드만 선언합니다.',
        explanation: 'FastAPI는 `response_model`로 반환값을 변환·검증하고 선언된 필드만 응답에 내보냅니다. 데이터 접근 권한과 별도의 방어 계층으로 사용하세요.',
      },
      short: {
        prompt: 'password_hash가 없는 AccountPublic으로 반환값의 필드를 제한하는 응답 모델 선언을 적으세요.',
        answers: ['response_model=AccountPublic'],
        hint: '민감한 필드가 없는 모델을 경로 응답 계약으로 지정하세요.',
        explanation: '`response_model=AccountPublic`은 공개 모델 밖의 password_hash를 응답에서 제외합니다. 인증·소유권 검사는 별도 의존성이나 정책으로 구현해야 합니다.',
      },
      locate: {
        prompt: '응답에서 password_hash를 숨겨야 합니다. 내부 필드를 포함한 모델을 공개 응답으로 지정한 줄을 찾으세요.',
        lines: [
          'from fastapi import FastAPI',
          'from pydantic import BaseModel',
          '',
          'class AccountInternal(BaseModel):',
          '    name: str',
          '    password_hash: str',
          '',
          'class AccountPublic(BaseModel):',
          '    name: str',
          '    email: str',
          '',
          'app = FastAPI()',
          '@app.get("/account", response_model=AccountInternal)',
          'async def read_account():',
          '    return {"name": "Mina", "email": "m@example.com", "password_hash": "secret"}',
        ],
        line: 13,
        hint: '경로 선언이 연결한 모델에 password_hash가 포함되어 있는지 확인하세요.',
        explanation: '13번 줄은 내부 모델을 공개 응답 계약으로 사용합니다. 위에 정의된 `AccountPublic`은 password_hash를 담지 않으므로 response_model을 그 모델로 바꿔야 해요.',
      },
    },
    {
      intro: '응답 필드가 null일 수 있는지와 빠질 수 있는지는 모델 타입·기본값으로 표현합니다. `nickname: str | None = None`은 이름을 모르는 응답도 허용해요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass LearnerPublic(BaseModel):\n    name: str\n    nickname: str | None = None\n\n@app.get("/learners/{learner_id}", response_model=LearnerPublic)\nasync def read_learner(learner_id: int):\n    return {"name": "Mina"}\n\n# 응답은 nickname 없이도 유효',
      choice: {
        prompt: '학습자에게 별명이 없으면 응답에서 nickname이 없어도 되고, 있으면 문자열을 내보내도록 선언하세요.',
        correct: 'nickname: str | None = None',
        correctFeedback: 'None을 허용하는 타입과 None 기본값을 두어 응답 객체에서 이 필드를 생략할 수 있습니다.',
        incorrect: [
          { text: 'nickname: str | None', feedback: 'Pydantic v2에서 nullable 타입만으로 기본값이 생기지 않습니다. 응답 모델 생성 시 필수 필드입니다.' },
          { text: 'nickname: None = "Mina"', feedback: '타입은 None만 허용하는데 기본값은 문자열이라 선언한 필드 계약과 맞지 않습니다.' },
        ],
        hint: '응답 모델에서 문자열 또는 None을 허용하고, 기본값도 None으로 둡니다.',
        explanation: '`str | None = None`은 타입의 nullable 여부와 필드 생략 가능성을 함께 선언합니다. Pydantic v2에서는 타입 주석만으로 선택 필드가 되지 않아요.',
      },
      short: {
        prompt: '응답의 nickname 필드를 생략할 수 있고, 있으면 문자열 또는 null이 되도록 선언하세요.',
        answers: ['nickname: str | None = None'],
        hint: 'Pydantic v2의 선택 응답 필드에는 nullable 타입과 기본값이 필요합니다.',
        explanation: '`nickname: str | None = None`은 필드 누락과 명시적 null을 모두 허용합니다.',
      },
      locate: {
        prompt: 'nickname 없는 학습자 응답도 유효해야 합니다. 기본값이 없어 필드를 필수로 만든 줄을 찾으세요.',
        lines: ['from pydantic import BaseModel', '', 'class LearnerPublic(BaseModel):', '    name: str', '    nickname: str | None'],
        line: 5,
        hint: 'Pydantic v2 nullable 필드도 기본값 없이는 필수입니다.',
        explanation: '5번 줄에는 기본값이 없어 nickname이 필수입니다. `nickname: str | None = None`으로 선택 응답 필드를 만드세요.',
      },
    },
    {
      intro: '리스트 응답 모델을 선언하면 각 항목을 같은 CoursePublic 스키마로 검증하고 JSON 배열로 직렬화합니다. 단일 항목 모델과 목록 모델을 구분해요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass CoursePublic(BaseModel):\n    title: str\n    level: int\n\n@app.get("/courses", response_model=list[CoursePublic])\nasync def list_courses():\n    return [{"title": "Python", "level": 2}, {"title": "HTTP", "level": 1}]\n\n# 두 항목 모두 같은 공개 스키마로 변환',
      choice: {
        prompt: 'GET /courses가 CoursePublic 객체들의 JSON 배열을 반환합니다. 응답 모델 타입은 무엇인가요?',
        correct: 'response_model=list[CoursePublic]',
        correctFeedback: 'list[CoursePublic]은 배열의 각 원소가 공개 과정 모델의 형태를 따르게 합니다.',
        incorrect: [
          { text: 'response_model=CoursePublic', feedback: '단일 객체 모델만 선언했습니다. 리스트 전체 응답의 최상위 형태가 배열과 맞지 않습니다.' },
          { text: 'response_model=dict[str, CoursePublic]', feedback: 'dict 모델은 객체 키와 값을 뜻하므로 최상위 JSON 배열을 선언하지 않습니다.' },
        ],
        hint: '응답 최상위가 배열이면 원소 모델을 Python list 타입 매개변수로 지정합니다.',
        explanation: '`list[CoursePublic]`은 JSON 배열과 각 항목의 응답 구조를 모두 표현합니다. 단일 모델이나 dict 타입은 다른 최상위 응답 형태예요.',
      },
      short: {
        prompt: '각 배열 항목을 CoursePublic으로 검증하는 JSON 목록 응답 모델 식을 적으세요.',
        answers: ['response_model=list[CoursePublic]'],
        hint: '리스트의 타입 인자로 각 항목의 Pydantic 모델을 지정합니다.',
        explanation: '`response_model=list[CoursePublic]`은 FastAPI가 목록 응답의 각 항목을 해당 스키마로 처리하게 합니다.',
      },
      locate: {
        prompt: '경로가 강의 목록을 반환합니다. 한 개 CoursePublic만 선언해 목록 응답 형태와 다른 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'from pydantic import BaseModel', '', 'class CoursePublic(BaseModel):', '    title: str', '    level: int', '', 'app = FastAPI()', '@app.get("/courses", response_model=CoursePublic)', 'async def list_courses():', '    return [{"title": "Python", "level": 2}]'],
        line: 9,
        hint: '반환 최상위 값은 객체 하나가 아니라 객체들의 리스트입니다.',
        explanation: '9번 줄은 단일 CoursePublic 응답을 선언하지만 본문은 리스트입니다. `response_model=list[CoursePublic]`로 배열 계약을 표현하세요.',
      },
    },
    {
      intro: '응답 모델 필수 필드가 실제 반환값에 빠지면 요청 오류가 아니라 서버 구현 결함입니다. FastAPI는 잘못된 응답을 정상 데이터처럼 조용히 내보내지 않아요.',
      example: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass CoursePublic(BaseModel):\n    title: str\n    level: int\n\n@app.get("/courses/{course_id}", response_model=CoursePublic)\nasync def read_course(course_id: int):\n    return {"title": "Python"}  # 필수 level 누락\n\n# 이 반환 모델 불일치는 서버 쪽 수정 대상',
      choice: {
        prompt: 'CoursePublic의 필수 level을 경로 함수가 누락해 반환했습니다. 이 오류는 어느 쪽 결함이며 어떤 결과로 다뤄야 하나요?',
        correct: '응답 데이터 생성의 서버 결함이며 응답 검증 오류로 다룬다',
        correctFeedback: '클라이언트 입력이 아니라 서버가 선언한 응답 계약을 어겼으므로 서버 측 오류입니다.',
        incorrect: [
          { text: '요청 본문 오류이므로 422를 반환한다', feedback: '경로 함수가 만든 응답 값의 문제를 클라이언트 요청 본문 오류로 분류하면 원인과 상태가 뒤바뀝니다.' },
          { text: '기본값으로 level=0을 넣어 항상 200을 반환한다', feedback: '모델에 없는 기본값을 임의로 꾸며 내면 서버 결함을 숨기고 잘못된 데이터를 내보냅니다.' },
        ],
        hint: '응답 검증 실패는 이미 함수가 만든 서버 출력에서 발생했습니다.',
        explanation: 'FastAPI 문서는 잘못된 응답 모델이 서버 코드 결함이며 잘못된 응답을 내보내지 않는다고 설명합니다. 입력 검증 422와 구분해야 해요.',
      },
      short: {
        prompt: '응답 모델에 필수 level이 빠졌을 때 이를 422 요청 오류 대신 무엇으로 분류해야 하는지 적으세요.',
        answers: ['서버 응답 검증 오류', '서버 결함', '응답 계약 위반'],
        hint: '문제가 생긴 데이터는 클라이언트 입력이 아니라 경로 함수가 반환한 출력입니다.',
        explanation: '필수 응답 필드 누락은 서버가 선언한 계약을 지키지 못한 결함입니다. 요청 본문 입력 검증 오류와 같은 422로 보고하지 않아요.',
      },
      locate: {
        prompt: 'CoursePublic은 title과 level을 요구합니다. 응답 검증을 실패하게 하는 반환 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'from pydantic import BaseModel', '', 'class CoursePublic(BaseModel):', '    title: str', '    level: int', '', 'app = FastAPI()', '@app.get("/courses/{course_id}", response_model=CoursePublic)', 'async def read_course(course_id: int):', '    return {"title": "Python"}'],
        line: 11,
        hint: '응답 모델에서 필수로 선언한 두 필드가 반환 객체에 모두 있는지 비교하세요.',
        explanation: '11번 줄에는 필수 `level`이 빠졌습니다. 응답 데이터 생성 로직을 고쳐 CoursePublic 계약을 완성해야 해요.',
      },
    },
  ],
  8: [
    {
      intro: '새 강의 생성은 보통 201 Created를 반환합니다. 성공 상태 코드는 경로 데코레이터의 `status_code`에 두어 응답과 OpenAPI 설명에 반영해요.',
      example: 'from fastapi import FastAPI, status\n\napp = FastAPI()\n\n@app.post("/courses", status_code=status.HTTP_201_CREATED)\nasync def create_course():\n    return {"id": 12, "created": True}\n\n# 새 리소스를 만든 성공 응답은 201',
      choice: {
        prompt: 'POST /courses가 새 강의를 만들었음을 응답과 OpenAPI에 201 Created로 나타낼 설정은 무엇인가요?',
        correct: 'status_code=status.HTTP_201_CREATED',
        correctFeedback: '201 상수는 생성 성공 의미를 표현하며 데코레이터 설정이 응답 기본 상태와 OpenAPI 계약에 반영됩니다.',
        incorrect: [
          { text: 'status_code=status.HTTP_200_OK', feedback: '성공이긴 하지만 새 리소스가 만들어졌다는 201 계약을 표현하지 않습니다.' },
          { text: 'status_code=status.HTTP_404_NOT_FOUND', feedback: '404는 요청한 리소스를 찾지 못한 경우라 새 리소스 생성 성공과 반대입니다.' },
        ],
        hint: '상태 코드는 경로 함수 인자가 아니라 POST 데코레이터에 둡니다.',
        explanation: '`status_code=status.HTTP_201_CREATED`는 생성 성공 상태를 지정하고 API 문서에도 같은 상태 코드를 설명합니다.',
      },
      short: {
        prompt: 'POST 요청으로 새 강의 리소스를 만든 뒤 성공을 나타낼 HTTP 상태 코드 숫자를 적으세요.',
        answers: ['201', '201 Created'],
        hint: 'POST 생성 성공에 쓰는 2xx 상태를 떠올리세요.',
        explanation: '새 리소스 생성에는 보통 201 Created를 사용합니다. 응답 본문이 있는 생성 결과도 보낼 수 있어요.',
      },
      locate: {
        prompt: '새 강의 생성 성공은 201이어야 합니다. 조회 성공 기본 코드 200을 명시한 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI()', '', '@app.post("/courses", status_code=200)', 'async def create_course():', '    return {"id": 12}'],
        line: 4,
        hint: '새 리소스 생성 성공은 일반 조회 성공과 다른 상태 코드 관례가 있습니다.',
        explanation: '4번 줄은 생성 응답을 200으로 설정합니다. `status_code=201`로 새 리소스 생성 의미를 문서화하세요.',
      },
    },
    {
      intro: '삭제가 성공했지만 반환할 표현이 없으면 204 No Content를 사용할 수 있습니다. 204 응답에는 JSON 응답 본문을 포함하지 않아요.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\ncourse_ids = {7}  # 수업용 메모리 저장 자료\n\n@app.delete("/courses/{course_id}", status_code=204)\nasync def delete_course(course_id: int):\n    course_ids.remove(course_id)  # 이 예제에서는 /courses/7 삭제\n    return None\n\n# 성공 응답에는 본문이 없음',
      choice: {
        prompt: 'DELETE 처리는 성공했지만 클라이언트에 반환할 응답 본문이 없습니다. 어떤 상태 코드를 사용해야 하나요?',
        correct: 'status_code=204',
        correctFeedback: '204 No Content는 성공했지만 전송할 응답 표현이 없는 경우를 나타냅니다.',
        incorrect: [
          { text: 'status_code=201', feedback: '201은 새 리소스 생성 성공을 뜻하며 삭제 후 무본문 응답의 의미가 아닙니다.' },
          { text: 'status_code=422', feedback: '422는 요청 내용의 검증 실패에 쓰이며 삭제 성공 응답 코드가 아닙니다.' },
        ],
        hint: 'No Content는 성공 뒤에 응답 본문이 없다는 상태 의미를 가집니다.',
        explanation: '204 응답에는 콘텐츠 본문이 없어야 합니다. JSON 삭제 결과를 보내려면 본문을 허용하는 다른 성공 상태를 사용하세요.',
      },
      short: {
        prompt: '삭제는 성공했지만 클라이언트에 JSON 응답 본문을 전송하지 않는 경우의 HTTP 상태 코드 번호를 적으세요.',
        answers: ['204', '204 No Content'],
        hint: '이 코드 이름 자체가 콘텐츠가 없음을 나타냅니다.',
        explanation: '204 No Content는 성공 응답 본문이 없는 계약입니다. 204를 사용하면서 JSON을 반환하지 않도록 하세요.',
      },
      locate: {
        prompt: '204 응답에는 본문이 없어야 합니다. 성공 코드와 함께 JSON 본문을 반환하게 한 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI()', '', '@app.delete("/courses/{course_id}", status_code=204)', 'async def delete_course(course_id: int):', '    return {"deleted": True}'],
        line: 6,
        hint: '204의 상태 의미와 반환 값의 유무가 맞는지 살펴보세요.',
        explanation: '6번 줄은 JSON 본문을 반환하지만 경로는 204로 선언돼 있습니다. 성공 본문을 생략하거나 본문이 있는 상태 코드로 계약을 바꾸세요.',
      },
    },
    {
      intro: '요청 헤더는 `Header` 메타데이터로 받습니다. Python 변수 `client_version`의 밑줄은 기본 변환으로 HTTP 헤더 이름 `client-version`에 대응해요.',
      example: 'from typing import Annotated\nfrom fastapi import FastAPI, Header\n\napp = FastAPI()\n\n@app.get("/version-check")\nasync def version_check(client_version: Annotated[str | None, Header()] = None):\n    return {"client_version": client_version}\n\n# 클라이언트 요청 헤더: client-version: 1.4',
      choice: {
        prompt: '요청 헤더 `client-version`을 선택적으로 받으려 합니다. 헤더 위치를 명시한 매개변수 선언은 무엇인가요?',
        correct: 'client_version: Annotated[str | None, Header()] = None',
        correctFeedback: 'Header가 요청 헤더 입력임을 표시하며 underscore를 HTTP 헤더의 하이픈으로 자동 변환합니다.',
        incorrect: [
          { text: 'client_version: Annotated[str | None, Query()] = None', feedback: 'Query는 URL의 `?key=value`에서 값을 받습니다. 요청 헤더 위치를 선언하지 않아요.' },
          { text: 'client_version: Annotated[str | None, Body()] = None', feedback: 'Body는 요청 JSON 본문에서 값을 읽으므로 헤더 입력 계약과 다릅니다.' },
        ],
        hint: '요청의 헤더 영역에서 값을 가져오는 FastAPI 매개변수 도구를 선택하세요.',
        explanation: '`Header()`는 요청 헤더로 입력 위치를 지정합니다. 기본 자동 변환에서 Python의 `client_version` 이름은 HTTP의 `client-version`으로 매핑됩니다.',
      },
      short: {
        prompt: '요청 헤더 client-version을 선택적으로 받도록 Annotated 매개변수 한 줄을 적으세요.',
        answers: ['client_version: Annotated[str | None, Header()] = None', 'client_version: str | None = Header(default=None)'],
        hint: 'Header를 Annotated metadata로 지정하고 선택 입력의 기본값을 둡니다.',
        explanation: '`Header()`가 요청 헤더 위치를 지정하며 밑줄을 하이픈으로 변환합니다. `= None`은 헤더가 없는 요청을 허용해요.',
      },
      locate: {
        prompt: 'client-version은 요청 헤더로 보내집니다. URL 쿼리에서 읽도록 선언한 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import FastAPI, Query', 'app = FastAPI()', '', '@app.get("/version-check")', 'async def version_check(client_version: Annotated[str | None, Query()] = None):', '    return {"client_version": client_version}'],
        line: 6,
        hint: 'Header와 Query는 이름이 비슷한 입력 영역이 아니라 서로 다른 HTTP 위치입니다.',
        explanation: '6번 줄의 Query는 URL 쿼리에서 값을 받습니다. `Header()`로 바꾸면 요청의 client-version 헤더를 읽습니다.',
      },
    },
    {
      intro: '응답 헤더는 경로 함수에 주입되는 `Response` 객체의 headers에 설정합니다. 최종 응답은 설정한 헤더와 함수가 반환한 JSON 본문을 함께 담아요.',
      example: 'from fastapi import FastAPI, Response\n\napp = FastAPI()\n\n@app.get("/courses")\nasync def list_courses(response: Response):\n    response.headers["X-Result-Source"] = "catalog"\n    return {"items": []}\n\n# X-Result-Source는 응답에, items는 응답 본문에 포함',
      choice: {
        prompt: '목록을 반환하면서 X-Result-Source를 HTTP 응답 헤더로 설정하는 객체 속성은 무엇인가요?',
        correct: 'response.headers["X-Result-Source"] = "catalog"',
        correctFeedback: '주입된 Response의 headers에 쓰면 FastAPI가 헤더를 최종 응답으로 옮기고 반환 데이터도 직렬화합니다.',
        incorrect: [
          { text: 'request.headers["X-Result-Source"] = "catalog"', feedback: 'request.headers는 클라이언트가 보낸 요청 헤더를 읽는 영역이라 응답 헤더를 설정하지 않습니다.' },
          { text: 'Header["X-Result-Source"] = "catalog"', feedback: 'Header는 요청 매개변수 선언 도구이며 응답 헤더 저장 객체가 아닙니다.' },
        ],
        hint: '응답용 Response 객체를 매개변수로 받고 그 headers mapping을 수정하세요.',
        explanation: '`response.headers[...]`는 서버가 내보낼 HTTP 헤더입니다. 본문은 별도로 반환하며 response_model을 사용해도 반환 데이터 필터링은 유지돼요.',
      },
      short: {
        prompt: '주입된 response에서 X-Result-Source 응답 헤더를 설정하는 대입문을 쓰세요.',
        answers: ['response.headers["X-Result-Source"] = "catalog"'],
        hint: '요청 헤더 매핑이 아니라 Response 객체의 headers를 수정합니다.',
        explanation: '`response.headers["X-Result-Source"]`에 값을 대입하면 서버 응답에 사용자 정의 헤더가 붙습니다.',
      },
      locate: {
        prompt: '서버가 X-Result-Source 헤더를 클라이언트에 보내야 합니다. 응답이 아니라 요청 객체를 수정하는 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI, Request', 'app = FastAPI()', '', '@app.get("/courses")', 'async def list_courses(request: Request):', '    request.headers["X-Result-Source"] = "catalog"', '    return {"items": []}'],
        line: 6,
        hint: '요청 객체는 수신 정보이고 Response 객체가 서버가 보낼 헤더를 담습니다.',
        explanation: '6번 줄은 클라이언트 요청 헤더를 읽는 mapping에 씁니다. 경로 함수에 `response: Response`를 받고 `response.headers`를 설정해야 합니다.',
      },
    },
    {
      intro: '삭제 요청에서 대상이 없으면 404를 반환하고, 실제 삭제가 성공해 보낼 내용이 없을 때만 204를 선택합니다. 상태 코드는 처리 결과의 의미를 구분해요.',
      example: 'from fastapi import FastAPI, HTTPException, Response\n\napp = FastAPI()\ncourse_ids = {7}  # 수업용 메모리 fixture: 실제 서비스의 저장소가 아님\n\n@app.delete("/courses/{course_id}")\nasync def delete_course(course_id: int):\n    if course_id not in course_ids:\n        raise HTTPException(status_code=404, detail="Course not found")\n    course_ids.remove(course_id)\n    return Response(status_code=204)\n\n# 없는 ID -> 404, 실제 삭제 성공 -> 본문 없는 204',
      choice: {
        prompt: 'DELETE /courses/99의 강의가 존재하지 않아 삭제할 수 없습니다. 어떤 결과 상태 코드를 반환해야 하나요?',
        correct: '404 Not Found',
        correctFeedback: '요청한 리소스가 없으면 404를 반환하며, 204는 실제로 삭제가 완료된 경우에만 사용합니다.',
        incorrect: [
          { text: '204 No Content', feedback: '없는 항목에 삭제 성공을 나타내면 클라이언트가 결과 상태를 구분할 수 없습니다.' },
          { text: '201 Created', feedback: '201은 새 리소스가 생성된 상태라 존재하지 않는 항목을 삭제하지 못한 결과와 다릅니다.' },
        ],
        hint: '대상이 없다는 사실과 삭제 성공을 나타내는 상태를 구분하세요.',
        explanation: '없는 리소스 조회·삭제에는 404 Not Found가 적절합니다. 성공한 삭제의 무본문 204와는 다른 결과입니다.',
      },
      short: {
        prompt: '삭제 요청에서 대상 리소스를 찾지 못했을 때 반환할 HTTP 상태 코드 번호를 적으세요.',
        answers: ['404', '404 Not Found'],
        hint: 'HTTP에서 요청한 리소스를 찾을 수 없다는 응답입니다.',
        explanation: '404 Not Found는 대상 리소스가 없다는 의미입니다. 204는 삭제가 성공했고 본문이 없을 때만 사용합니다.',
      },
      locate: {
        prompt: '없는 course_id는 실패로 응답해야 합니다. 리소스 부재를 성공 204로 잘못 처리하는 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI, HTTPException, Response', 'app = FastAPI()', 'course_ids = {7}', '', '@app.delete("/courses/{course_id}")', 'async def delete_course(course_id: int):', '    if course_id not in course_ids:', '        return Response(status_code=204)', '    course_ids.remove(course_id)', '    return Response(status_code=204)'],
        line: 8,
        hint: '조건은 대상이 없다고 판정합니다. 그 분기의 상태 코드가 성공 삭제와 같은지 보세요.',
        explanation: '8번 줄은 리소스가 없는 경우에도 삭제 성공 204를 반환합니다. 해당 분기에 HTTPException 404를 발생시키세요.',
      },
    },
  ],
  9: [
    {
      intro: 'Depends에는 의존성 함수를 실행한 결과가 아니라 callable 자체를 넘깁니다. FastAPI가 요청 매개변수와 함께 함수를 호출하고 반환값을 경로 작업에 전달해요.',
      example: 'from fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_page_size():\n    return 20\n\n@app.get("/courses")\nasync def list_courses(limit: int = Depends(get_page_size)):\n    return {"limit": limit}\n\n# FastAPI가 요청마다 dependency callable을 해결',
      choice: {
        prompt: 'get_page_size를 FastAPI가 의존성으로 호출하게 하려면 Depends 안에 무엇을 전달해야 하나요?',
        correct: 'Depends(get_page_size)',
        correctFeedback: '괄호 없는 함수 객체를 넘기면 FastAPI가 dependency graph에서 매개변수를 해결하며 호출합니다.',
        incorrect: [
          { text: 'Depends(get_page_size())', feedback: '모듈이 경로를 등록할 때 함수를 먼저 실행해 결과값을 넘기므로 request dependency callable이 아닙니다.' },
          { text: 'Depends("get_page_size")', feedback: '문자열 이름은 Python 함수 callable이 아니며 FastAPI가 실행할 함수 참조가 아닙니다.' },
        ],
        hint: '함수를 지금 실행하지 말고 나중에 프레임워크가 부를 객체로 전달하세요.',
        explanation: '`Depends(get_page_size)`는 함수 객체를 넘깁니다. `get_page_size()`는 즉시 호출하므로 FastAPI가 요청별로 의존성을 해결하지 못해요.',
      },
      short: {
        prompt: 'get_page_size 함수를 FastAPI 의존성 callable로 전달하는 표현을 적으세요.',
        answers: ['Depends(get_page_size)'],
        hint: 'Depends 안에는 실행할 함수 객체를 전달하므로, 함수 이름 뒤에 호출 괄호를 붙이지 않습니다.',
        explanation: '`Depends(get_page_size)`가 callable을 등록합니다. FastAPI가 호출 시점에 의존성을 계산하고 반환값을 주입합니다.',
      },
      locate: {
        prompt: 'get_page_size는 요청을 해결할 때 FastAPI가 실행해야 합니다. 등록 즉시 함수를 호출한 줄을 찾으세요.',
        lines: ['from fastapi import Depends, FastAPI', 'app = FastAPI()', '', 'def get_page_size():', '    return 20', '', '@app.get("/courses")', 'async def list_courses(limit: int = Depends(get_page_size())):', '    return {"limit": limit}'],
        line: 8,
        hint: 'Depends에 함수 객체를 넘길지 이미 호출한 결과를 넘길지 살펴보세요.',
        explanation: '8번 줄은 `get_page_size()`를 즉시 실행합니다. `Depends(get_page_size)`로 바꾸면 FastAPI가 callable을 의존성으로 처리해요.',
      },
    },
    {
      intro: '경로 작업의 타입 주석은 주입된 값의 기대 타입을 설명하고 `Depends`는 값의 공급 함수를 지정합니다. FastAPI가 해결한 반환값은 매개변수에 들어와요.',
      example: 'from fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_page_size():\n    return 20\n\n@app.get("/courses")\nasync def list_courses(limit: int = Depends(get_page_size)):\n    return {"limit": limit}\n\n# handler 내부의 limit 값은 dependency 반환값',
      choice: {
        prompt: 'get_page_size의 반환값을 int limit 매개변수로 받아 응답에 쓰는 선언은 무엇인가요?',
        correct: 'limit: int = Depends(get_page_size)',
        correctFeedback: '매개변수 타입과 Depends callable을 함께 지정해 FastAPI가 해결한 반환값을 limit에 주입합니다.',
        incorrect: [
          { text: 'Depends(get_page_size): int', feedback: 'Python 매개변수 선언 순서가 아닙니다. 타입과 기본값 표현을 이름 뒤에 적어야 해요.' },
          { text: 'limit: Depends[int]', feedback: 'Depends는 generic 타입 생성자가 아니라 callable을 전달하는 함수입니다.' },
        ],
        hint: '일반 매개변수처럼 이름과 타입을 먼저 적고, 기본값 자리에 Depends를 둡니다.',
        explanation: '`limit: int = Depends(get_page_size)`에서 int는 주입값 타입, Depends는 값을 제공할 callable입니다. 함수 본문에서 limit은 그 반환값을 가집니다.',
      },
      short: {
        prompt: 'get_page_size 반환값을 정수 limit으로 주입받을 FastAPI 매개변수 선언을 적으세요.',
        answers: ['limit: int = Depends(get_page_size)', 'limit: Annotated[int, Depends(get_page_size)]'],
        hint: '기본값 위치에 Depends를 두어 공급 함수를 지정합니다.',
        explanation: 'FastAPI는 `get_page_size`를 해결한 뒤 반환값을 `limit` 매개변수에 전달합니다.',
      },
      locate: {
        prompt: 'limit은 get_page_size의 int 반환값이어야 합니다. Depends 반환값을 매개변수에 연결하지 못한 줄을 찾으세요.',
        lines: ['from fastapi import Depends, FastAPI', 'app = FastAPI()', '', 'def get_page_size():', '    return 20', '', '@app.get("/courses")', 'async def list_courses(limit: Depends(get_page_size)):', '    return {"limit": limit}'],
        line: 8,
        hint: '매개변수 이름, 타입, 기본값의 Python 선언 순서를 확인하세요.',
        explanation: '8번 줄은 `Depends(...)`를 타입 자리(콜론 뒤)에 적었습니다. `limit: int = Depends(get_page_size)`처럼 int는 타입으로, Depends는 기본값 자리에 두세요.',
      },
    },
    {
      intro: '현재 사용자를 제공하는 의존성을 경로에서 재사용할 수 있습니다. `Depends`는 함수를 호출하지만, 토큰 검증·사용자 신뢰 여부는 그 함수가 실제로 구현해야 해요.',
      example: 'from fastapi import Depends, FastAPI\nfrom auth import get_current_user  # 검증된 토큰을 사용자로 바꾸는 구현\n\napp = FastAPI()\n\n@app.get("/me")\nasync def read_me(user: dict = Depends(get_current_user)):\n    return {"name": user["name"]}\n\n# Depends 자체가 인증 로직을 만들어 주지는 않음',
      choice: {
        prompt: 'auth.get_current_user가 실제 토큰 검증을 맡고, /me 경로가 그 결과를 받도록 한 표현은 무엇인가요?',
        correct: 'user: dict = Depends(get_current_user)',
        correctFeedback: '경로 매개변수에서 검증 의존성의 반환값을 받아 재사용합니다. Depends만으로 검증 구현이 생기지는 않습니다.',
        incorrect: [
          { text: 'user = get_current_user', feedback: '함수를 직접 호출하지도 않고 FastAPI dependency graph에 등록하지도 않아 사용자 결과값이 아닙니다.' },
          { text: 'user = Query(get_current_user)', feedback: 'Query는 URL 쿼리 입력 메타데이터입니다. 인증 callable을 실행하지 않습니다.' },
        ],
        hint: '경로 매개변수에서 Depends에 검증 책임을 가진 callable을 넘깁니다.',
        explanation: '`Depends(get_current_user)`가 dependency callable을 실행해 반환값을 user에 주입합니다. 신뢰성은 실제 토큰 검증 구현과 별도 권한 검사에 달려요.',
      },
      short: {
        prompt: '인증 구현이 있는 get_current_user의 반환값을 user로 주입받는 선언을 적으세요.',
        answers: ['user: dict = Depends(get_current_user)', 'user: Annotated[dict, Depends(get_current_user)]'],
        hint: '사용자 정보를 제공하는 callable을 Depends에 전달합니다.',
        explanation: '`Depends`는 구현된 get_current_user를 실행하고 반환값을 user에 줍니다. 의존성 주입은 그 함수의 보안 동작을 대신 만들지 않아요.',
      },
      locate: {
        prompt: '검증된 사용자 객체가 필요합니다. get_current_user의 결과가 아니라 함수 객체만 user에 대입한 줄을 찾으세요.',
        lines: ['from fastapi import Depends, FastAPI', 'from auth import get_current_user', 'app = FastAPI()', '', '@app.get("/me")', 'async def read_me():', '    user = get_current_user', '    return {"name": user["name"]}'],
        line: 7,
        hint: '이 줄에는 함수 호출도 Depends를 통한 주입도 없습니다.',
        explanation: '7번 줄은 함수 객체를 user에 대입해 딕셔너리처럼 사용할 수 없습니다. 매개변수를 `user: dict = Depends(get_current_user)`로 선언하세요.',
      },
    },
    {
      intro: '의존성 callable도 경로 함수처럼 입력 매개변수를 선언할 수 있습니다. get_page_size의 limit은 URL 쿼리에서 검증되고 dependency 반환값으로 경로 작업에 전달돼요.',
      example: 'from fastapi import Depends, FastAPI, Query\n\napp = FastAPI()\n\ndef get_page_size(limit: int = Query(default=20, ge=1, le=100)):\n    return limit\n\n@app.get("/courses")\nasync def list_courses(limit: int = Depends(get_page_size)):\n    return {"limit": limit}\n\n# /courses?limit=25 -> 25를 주입',
      choice: {
        prompt: 'GET /courses?limit=25의 값을 dependency 함수가 받고, 생략 시 20을 쓰도록 할 선언은 무엇인가요?',
        correct: 'limit: int = Query(default=20, ge=1, le=100)',
        correctFeedback: '의존성 함수의 입력에도 Query 기본값과 범위 검증을 선언할 수 있고 FastAPI가 쿼리에서 값을 해결합니다.',
        incorrect: [
          { text: 'limit: "int" = "20"', feedback: '문자열 타입 표기는 int로 해석될 수 있지만 이 선언에는 요구한 Query 수치 경계가 없습니다.' },
          { text: 'limit: int = Body(default=20)', feedback: 'Body는 JSON 본문 위치입니다. `?limit=25` 쿼리를 읽지 않습니다.' },
        ],
        hint: '의존성 callable의 매개변수에도 Query를 적용할 수 있습니다.',
        explanation: '`Query(default=20, ge=1, le=100)`은 쿼리 출처·기본값·허용 범위를 선언합니다. FastAPI가 의존성을 해결할 때 요청에서 값을 읽어요.',
      },
      short: {
        prompt: 'dependency limit을 선택 쿼리로 받고 기본 20, 범위 1~100을 적용하는 선언을 적으세요.',
        answers: [
          'limit: int = Query(default=20, ge=1, le=100)',
          'limit: Annotated[int, Query(ge=1, le=100)] = 20',
        ],
        hint: '함수 매개변수에 Query의 기본값과 inclusive 범위를 지정합니다.',
        explanation: 'dependency도 경로 작업과 같은 방식으로 Query 입력을 선언하며 그 값을 반환해 다른 함수에 제공할 수 있습니다.',
      },
      locate: {
        prompt: 'limit은 1~100의 URL 쿼리로 받아야 합니다. JSON 본문에서 값을 읽도록 지정한 줄을 찾으세요.',
        lines: ['from fastapi import Body, Depends, FastAPI, Query', 'app = FastAPI()', '', 'def get_page_size(limit: int = Body(default=20)):', '    return limit', '', '@app.get("/courses")', 'async def list_courses(limit: int = Depends(get_page_size)):', '    return {"limit": limit}'],
        line: 4,
        hint: '클라이언트가 보내는 `?limit=...`는 JSON Body가 아니라 Query 입력입니다.',
        explanation: '4번 줄의 Body가 입력 위치를 본문으로 지정합니다. `Query(default=20, ge=1, le=100)`으로 쿼리 및 범위를 선언하세요.',
      },
    },
    {
      intro: '공통 페이지 크기 의존성을 여러 경로에서 재사용하면 기본값과 입력 정책을 한 곳에서 관리합니다. 각 경로의 Depends는 같은 callable을 참조해요.',
      example: 'from fastapi import Depends, FastAPI, Query\n\napp = FastAPI()\n\ndef get_page_size(limit: int = Query(default=20, ge=1, le=100)):\n    return limit\n\n@app.get("/courses")\nasync def list_courses(limit: int = Depends(get_page_size)):\n    return {"limit": limit, "items": []}\n\n@app.get("/lessons")\nasync def list_lessons(limit: int = Depends(get_page_size)):\n    return {"limit": limit, "items": []}',
      choice: {
        prompt: 'courses와 lessons 목록에서 같은 페이지 크기 규칙을 공유하려면 의존성은 어디에 정의하는 편이 좋은가요?',
        correct: '공통 get_page_size callable을 경로 함수 바깥에 두고 두 곳에서 Depends로 연결',
        correctFeedback: '입력 기본값과 범위 규칙을 한 callable에 모아 두 경로에서 같은 계약을 재사용합니다.',
        incorrect: [
          { text: '두 경로 본문에 Query 검증을 각각 복사', feedback: '중복 로직이 생겨 한 경로만 수정하면 동작과 문서가 서로 달라질 수 있습니다.' },
          { text: '모듈 전역 변수에 마지막 요청 limit을 저장', feedback: '동시 요청 사이에 값이 섞일 수 있어 사용자별 요청 상태를 전역 가변값에 두면 안 됩니다.' },
        ],
        hint: '여러 경로가 공유할 입력 규칙을 하나의 dependency callable로 정의합니다.',
        explanation: '공통 callable을 두 경로에서 `Depends(get_page_size)`로 사용하면 규칙을 한 곳에서 유지할 수 있습니다. 요청별 값을 전역 변수에 저장하지 마세요.',
      },
      short: {
        prompt: '여러 경로가 같이 호출해 재사용할 dependency 함수의 이름과 역할을 적으세요.',
        answers: ['get_page_size', '페이지 크기 의존성', '공통 페이지 크기 함수'],
        hint: '두 경로에서 같은 Query 기본값과 범위 검증을 제공하는 함수입니다.',
        explanation: '`get_page_size`가 공통 기본값·검증 규칙을 관리하고 각 경로는 Depends로 반환값을 받습니다.',
      },
      locate: {
        prompt: '공통 페이지 크기 의존성을 이미 정의했습니다. lessons 경로에서 그 정책 대신 Query 검증을 다시 선언한 줄을 찾으세요.',
        lines: ['from fastapi import Depends, FastAPI, Query', '', 'app = FastAPI()', '', 'def get_page_size(limit: int = Query(default=20, ge=1, le=100)):', '    return limit', '', '@app.get("/courses")', 'async def list_courses(limit: int = Depends(get_page_size)):', '    return {"limit": limit}', '', '@app.get("/lessons")', 'async def list_lessons(limit: int = Query(default=20, ge=1, le=100)):', '    return {"limit": limit}'],
        line: 13,
        hint: 'courses 경로의 Depends 사용과 lessons 경로의 입력 선언을 비교하세요.',
        explanation: '13번 줄은 lessons 경로에서 공통 Query 규칙을 다시 선언합니다. `Depends(get_page_size)`를 사용하면 두 경로가 같은 기본값과 범위를 공유합니다.',
      },
    },
  ],
  10: [
    {
      intro: 'Annotated는 기존 Python 타입을 보존하면서 FastAPI가 읽을 메타데이터를 함께 붙입니다. 먼저 typing에서 올바른 이름을 가져와야 타입 별칭과 의존성 선언을 사용할 수 있어요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_page_size() -> int:\n    return 20\n\nPageSize = Annotated[int, Depends(get_page_size)]\n\n@app.get("/courses")\nasync def list_courses(limit: PageSize):\n    return {"limit": limit}\n\n# Annotated는 Python typing 모듈에서 가져옴',
      choice: {
        prompt: '다음 FastAPI 경로에서 PageSize 타입 별칭을 선언하려고 합니다. 먼저 가져와야 하는 typing 이름은 무엇인가요?',
        correct: 'from typing import Annotated',
        correctFeedback: 'Annotated는 표준 typing 모듈의 타입 래퍼이며 FastAPI는 이 metadata를 읽어 의존성을 해석합니다.',
        incorrect: [
          { text: 'from typing import Annotation', feedback: '표준 typing에는 이 이름이 없습니다. 타입 메타데이터를 결합하는 실제 이름은 Annotated입니다.' },
          { text: 'from fastapi import Annotated', feedback: 'FastAPI는 Annotated를 제공하지 않습니다. Python 표준 typing 모듈에서 가져와야 해요.' },
        ],
        hint: '이 기능은 FastAPI 전용 import가 아니라 Python 표준 타입 주석 기능입니다.',
        explanation: '`from typing import Annotated`로 가져온 뒤 `Annotated[int, Depends(...)]`처럼 기본 타입과 FastAPI metadata를 함께 적습니다.',
      },
      short: {
        prompt: 'Python 표준 라이브러리에서 Annotated를 가져오는 완전한 import 문을 적으세요.',
        answers: ['from typing import Annotated'],
        hint: '모듈 이름은 fastapi가 아니라 Python의 typing입니다.',
        explanation: '`Annotated`는 표준 `typing` 모듈에 있습니다. FastAPI의 Depends 객체는 별도로 `fastapi`에서 가져옵니다.',
      },
      locate: {
        prompt: 'PageSize 선언에서 필요한 타입 메타데이터 이름을 찾을 수 없습니다. 잘못된 import 줄을 찾으세요.',
        lines: ['from typing import Annotation', 'from fastapi import Depends, FastAPI', '', 'app = FastAPI()', '', 'def get_page_size() -> int:', '    return 20', '', 'PageSize = Annotated[int, Depends(get_page_size)]', '', '@app.get("/courses")', 'async def list_courses(limit: PageSize):', '    return {"limit": limit}'],
        line: 1,
        hint: 'Annotated와 Annotation은 철자가 비슷하지만 typing 모듈의 실제 이름은 하나입니다.',
        explanation: '1번 줄은 존재하지 않는 `Annotation`을 import합니다. `from typing import Annotated`로 고쳐 타입 별칭의 이름을 정의하세요.',
      },
    },
    {
      intro: 'Annotated의 첫 항목은 정적 타입이고 두 번째 항목은 FastAPI metadata입니다. Depends는 계산할 함수를 연결하므로 이 둘의 순서를 뒤집지 않아요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_page_size() -> int:\n    return 20\n\nPageSize = Annotated[int, Depends(get_page_size)]\n\n@app.get("/courses")\nasync def list_courses(limit: PageSize):\n    return {"limit": limit}\n\n# 타입은 int, 의존성 metadata는 Depends',
      choice: {
        prompt: '재사용 타입 별칭 PageSize에 정수 반환 타입과 get_page_size 의존성을 올바른 순서로 묶은 식은 무엇인가요?',
        correct: 'Annotated[int, Depends(get_page_size)]',
        correctFeedback: 'Annotated의 첫 위치는 int 타입이고 뒤의 metadata 위치에 Depends callable을 둡니다.',
        incorrect: [
          { text: 'Annotated[Depends(get_page_size), int]', feedback: 'Depends 객체가 타입 위치에 들어가고 실제 값의 int 타입이 metadata 위치로 밀려 순서가 반대입니다.' },
          { text: 'Annotated[int = Depends(get_page_size)]', feedback: 'Annotated은 타입과 metadata를 쉼표로 나눕니다. 대괄호 안에 기본값 대입을 쓰지 않아요.' },
        ],
        hint: 'Annotated의 대괄호 안에서 타입을 먼저 쓰고 메타데이터를 쉼표 뒤에 둡니다.',
        explanation: '`Annotated[int, Depends(get_page_size)]`는 값의 타입 정보를 보존하면서 FastAPI가 호출할 dependency도 연결합니다.',
      },
      short: {
        prompt: 'PageSize가 int 타입을 유지하고 get_page_size 결과를 주입받도록 Annotated 별칭 한 줄을 적으세요.',
        answers: ['PageSize = Annotated[int, Depends(get_page_size)]'],
        hint: '정적 타입 뒤에 쉼표를 두고 Depends metadata를 지정합니다.',
        explanation: '별칭을 사용하면 여러 경로에서 같은 정적 타입과 의존성 선언을 재사용할 수 있습니다.',
      },
      locate: {
        prompt: 'PageSize는 정수 값에 의존성을 붙여야 합니다. 타입과 metadata 순서를 뒤집은 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import Depends, FastAPI', '', 'app = FastAPI()', '', 'def get_page_size() -> int:', '    return 20', '', 'PageSize = Annotated[Depends(get_page_size), int]', '', '@app.get("/courses")', 'async def list_courses(limit: PageSize):', '    return {"limit": limit}'],
        line: 9,
        hint: '정적 분석기가 값 타입으로 알아야 할 정보와 FastAPI가 읽을 metadata를 구별하세요.',
        explanation: '9번 줄은 Depends와 int의 위치가 뒤집혔습니다. `Annotated[int, Depends(get_page_size)]`로 타입을 앞에 적으세요.',
      },
    },
    {
      intro: '같은 의존성 매개변수를 여러 경로에서 쓸 때 Annotated 별칭을 만들어 중복을 줄일 수 있습니다. 별칭은 Python 타입 별칭이며 경로를 자동 등록하지는 않아요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_page_size() -> int:\n    return 20\n\nPageSize = Annotated[int, Depends(get_page_size)]\n\n@app.get("/courses")\nasync def list_courses(limit: PageSize):\n    return {"limit": limit, "items": []}\n\n@app.get("/lessons")\nasync def list_lessons(limit: PageSize):\n    return {"limit": limit, "items": []}',
      choice: {
        prompt: 'courses와 lessons가 같은 페이지 크기 의존성을 사용합니다. 두 경로의 매개변수 선언을 간결하게 공유하는 방법은 무엇인가요?',
        correct: 'PageSize = Annotated[int, Depends(get_page_size)]',
        correctFeedback: 'Annotated 타입 별칭을 한 번 정의하고 각 경로의 매개변수 타입으로 사용하면 선언이 일치합니다.',
        incorrect: [
          { text: 'PageSize = Depends(get_page_size)', feedback: '이 표현은 의존성 객체이지 int 타입 metadata를 보존하는 Annotated 별칭은 아닙니다.' },
          { text: 'PageSize = Annotated(Depends(get_page_size))', feedback: 'Annotated은 함수 호출이 아니라 타입과 metadata를 대괄호에 나열하는 generic 형식입니다.' },
        ],
        hint: '재사용할 것은 함수의 반환값이 아니라 타입과 Depends 선언을 묶은 별칭입니다.',
        explanation: '별칭을 두 경로의 매개변수 타입에 사용하면 Python 타입 정보가 유지되고 FastAPI도 같은 dependency를 해결합니다.',
      },
      short: {
        prompt: 'courses와 lessons 두 경로에서 공통 페이지 크기 의존성 별칭으로 사용할 타입 이름을 적으세요.',
        answers: ['PageSize'],
        hint: '예제에서 Annotated 타입 선언 왼쪽에 붙인 이름입니다.',
        explanation: '`PageSize`는 `Annotated[int, Depends(get_page_size)]`의 별칭으로 courses와 lessons에서 공통으로 사용합니다.',
      },
      locate: {
        prompt: '두 경로가 공통 타입 별칭을 재사용해야 합니다. lessons가 새 Depends 객체를 직접 선언한 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import Depends, FastAPI', '', 'app = FastAPI()', '', 'def get_page_size() -> int:', '    return 20', '', 'PageSize = Annotated[int, Depends(get_page_size)]', '', '@app.get("/courses")', 'async def list_courses(limit: PageSize):', '    return {"items": []}', '', '@app.get("/lessons")', 'async def list_lessons(limit: Annotated[int, Depends(get_page_size)]):', '    return {"items": []}'],
        line: 17,
        hint: 'courses는 PageSize 별칭을 쓰지만 lessons는 그 선언을 다시 적었습니다.',
        explanation: '17번 줄은 같은 metadata를 중복합니다. `limit: PageSize`로 바꾸면 두 경로가 한 곳에서 정의한 타입 계약을 공유합니다.',
      },
    },
    {
      intro: '의존성 함수도 다른 의존성의 결과를 매개변수로 받을 수 있습니다. 아래 토큰 값은 그래프 연결을 설명하는 fixture일 뿐 인증이나 서명 검증을 수행하지 않아요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef read_token() -> str:\n    return "demo-token"  # 학습용 fixture, 실제 인증 아님\n\ndef get_user(token: Annotated[str, Depends(read_token)]) -> dict:\n    return {"display_name": "Mina", "token_seen": bool(token)}\n\n@app.get("/profile")\nasync def read_profile(user: Annotated[dict, Depends(get_user)]):\n    return {"name": user["display_name"]}\n\n# read_token -> get_user -> read_profile 순으로 해결',
      choice: {
        prompt: 'get_user 안에서 read_token 반환 문자열을 token 매개변수로 주입받아야 합니다. 어떤 선언이 dependency graph를 연결하나요?',
        correct: 'token: Annotated[str, Depends(read_token)]',
        correctFeedback: '하위 의존성의 반환값이 get_user의 token에 주입되고 그 결과가 다시 경로에 전달됩니다.',
        incorrect: [
          { text: 'token: str = read_token()', feedback: '함수를 직접 실행하면 FastAPI가 하위 의존성으로 추적하거나 요청 그래프에서 해결하지 않습니다.' },
          { text: 'token: Annotated[Depends(read_token), str]', feedback: 'Annotated 첫 위치에는 token 값의 타입을 두고 Depends metadata는 뒤에 둡니다.' },
        ],
        hint: '의존성을 선언하는 곳도 경로 매개변수와 같은 Annotated 및 Depends 형식을 사용합니다.',
        explanation: '`get_user`가 `read_token`에 의존하고 경로가 `get_user`에 의존하므로 FastAPI가 안쪽부터 반환값을 주입합니다. 예제 token은 인증용이 아닙니다.',
      },
      short: {
        prompt: 'get_user의 token 매개변수에 read_token 결과를 Annotated로 주입하는 선언을 적으세요.',
        answers: ['token: Annotated[str, Depends(read_token)]'],
        hint: '문자열 타입을 먼저 두고 Depends(read_token)을 metadata로 연결합니다.',
        explanation: 'FastAPI가 read_token을 먼저 해결해 문자열을 넘깁니다. 의존성 graph 구성은 실제 토큰 검증이나 인증 정책을 구현하지 않습니다.',
      },
      locate: {
        prompt: '하위 의존성 반환값을 자동으로 넣어야 합니다. 경로 함수 안에서 read_token을 직접 호출한 줄을 찾으세요.',
        lines: ['from fastapi import Depends, FastAPI', 'app = FastAPI()', '', 'def read_token() -> str:', '    return "demo-token"', '', '@app.get("/profile")', 'async def read_profile():', '    token = read_token()', '    return {"token_seen": bool(token)}'],
        line: 9,
        hint: '요청 처리 함수 본문에서 직접 호출한 값과 Depends로 선언한 하위 의존성을 구분하세요.',
        explanation: '9번 줄은 경로 안에서 함수를 직접 호출합니다. token을 매개변수로 옮겨 `Annotated[str, Depends(read_token)]`로 선언해야 graph에 포함됩니다.',
      },
    },
    {
      intro: '의존성 그래프는 하위 함수의 결과를 바깥 의존성에 전달한 뒤 경로 작업에 제공합니다. 이는 요청마다 입력과 반환값을 연결하는 흐름이며 모듈 전역 상태 저장과 다릅니다.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef extract_query(q: str | None = None) -> str | None:\n    return q\n\ndef normalize_query(query: Annotated[str | None, Depends(extract_query)]):\n    return query.strip() if query else None\n\n@app.get("/courses")\ndef list_courses(query: Annotated[str | None, Depends(normalize_query)]):\n    return {"query": query}\n\n# extract_query -> normalize_query -> list_courses',
      choice: {
        prompt: 'extract_query가 입력을 읽고 normalize_query가 정리한 뒤 경로에 전달합니다. FastAPI가 해결하는 순서는 무엇인가요?',
        correct: 'extract_query → normalize_query → list_courses',
        correctFeedback: '의존성 그래프는 가장 안쪽 extract_query를 먼저 해결하고 반환값을 바깥 함수와 경로로 전달합니다.',
        incorrect: [
          { text: 'list_courses → normalize_query → extract_query', feedback: '경로 함수가 먼저 실행되는 것이 아니라 실행에 필요한 하위 의존성부터 해결해야 합니다.' },
          { text: '세 함수를 모듈 import 순간 모두 한 번 호출', feedback: '의존성 결과는 import 때 미리 계산하지 않고 요청마다 그래프 해결 과정에서 제공합니다.' },
        ],
        hint: '값을 만드는 안쪽 함수부터 그 값을 사용하는 바깥 함수로 따라가세요.',
        explanation: 'FastAPI는 `extract_query`의 결과를 `normalize_query`에 넣고 그 결과를 `list_courses`의 query에 주입합니다.',
      },
      short: {
        prompt: '세 단계 dependency graph에서 FastAPI가 가장 먼저 해결할 하위 의존성 함수 이름을 적으세요.',
        answers: ['extract_query'],
        hint: 'normalize_query가 Depends로 직접 참조하는 함수입니다.',
        explanation: '`extract_query`가 가장 안쪽 의존성이므로 반환값을 normalize_query에 전달한 다음 경로가 실행됩니다.',
      },
      locate: {
        prompt: 'normalize_query 결과가 경로에 주입되지 않습니다. 경로 함수에서 하위 함수를 직접 호출한 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import Depends, FastAPI', 'app = FastAPI()', '', 'def extract_query(q: str | None = None):', '    return q', '', 'def normalize_query(query: Annotated[str | None, Depends(extract_query)]):', '    return query.strip() if query else None', '', '@app.get("/courses")', 'def list_courses():', '    return {"query": normalize_query(None)}'],
        line: 13,
        hint: '직접 호출은 요청의 query 매개변수와 의존성 graph를 FastAPI에 알리지 않습니다.',
        explanation: '13번 줄은 normalize_query를 직접 호출하며 입력을 고정합니다. `query: Annotated[str | None, Depends(normalize_query)]`를 경로 매개변수로 선언하세요.',
      },
    },
  ],
  11: [
    {
      intro: 'yield 의존성은 yield 앞에서 자원을 준비하고 yield한 값을 경로에 제공합니다. 경로 작업 뒤 실행할 정리 코드는 finally에 두어 정상·오류 흐름을 함께 다룹니다.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\nclass Session:\n    def close(self) -> None:\n        pass  # 수업용 자원\n\ndef get_session():\n    session = Session()\n    try:\n        yield session\n    finally:\n        session.close()\n\n@app.get("/courses")\ndef list_courses(session: Annotated[Session, Depends(get_session)]):\n    return {"ready": session is not None}',
      choice: {
        prompt: 'get_session이 만든 session을 경로 함수에 전달하면서 뒤에서 정리하려면 함수에서 어떤 문장을 사용해야 하나요?',
        correct: 'yield session',
        correctFeedback: 'yield한 값은 의존성 반환값으로 주입되고, FastAPI는 요청 처리 후 generator의 정리 구간도 실행합니다.',
        incorrect: [
          { text: 'return session 후 finally에서 정리', feedback: 'return의 finally는 바로 실행되어 session이 경로 함수에 주입되기 전에 닫힐 수 있습니다. yield는 사용 뒤 정리합니다.' },
          { text: 'print(session)', feedback: '출력만 할 뿐 session 값을 의존성 반환값으로 전달하거나 자원 수명을 관리하지 않습니다.' },
        ],
        hint: '정리할 자원을 요청 처리에 넘긴 뒤 실행 흐름을 잠시 중단하는 generator 문장을 고르세요.',
        explanation: '`yield session`이 경로 매개변수에 값을 제공합니다. 함수의 나머지 부분은 요청이 처리된 뒤 정리 흐름으로 이어집니다.',
      },
      short: {
        prompt: 'get_session이 만든 객체를 FastAPI 의존성 값으로 넘기는 한 줄을 적으세요.',
        answers: ['yield session'],
        hint: '반환값 전달과 함수 종료를 동시에 하는 return 대신 generator를 사용합니다.',
        explanation: 'FastAPI는 yield 앞에서 준비한 값을 주입하고 의존성 수명주기에 맞춰 뒤쪽 정리 코드도 실행합니다.',
      },
      locate: {
        prompt: '경로가 session을 사용할 수 있어야 합니다. 의존성에서 값을 전달하지 않고 버리는 줄을 찾으세요.',
        lines: ['class Session:', '    def close(self):', '        pass', '', 'def get_session():', '    session = Session()', '    try:', '        return None', '    finally:', '        session.close()'],
        line: 8,
        hint: 'finally의 close는 유지하면서 요청에 전달할 객체를 yield해야 합니다.',
        explanation: '8번 줄은 None을 반환해 경로에 Session을 전달하지 않습니다. `yield session`으로 바꾸어 주입값을 제공하세요.',
      },
    },
    {
      intro: 'yield 뒤의 finally는 의존성의 정리 구간입니다. 예외가 발생해도 정리 코드를 실행하고, 예외를 직접 잡았다면 삼키지 말고 다시 올려야 오류 처리가 유지돼요.',
      example: 'class Resource:\n    def close(self) -> None:\n        pass\n\ndef get_resource():\n    resource = Resource()\n    try:\n        yield resource\n    finally:\n        resource.close()\n\n# 정상 완료와 예외 종료에서 close 호출',
      choice: {
        prompt: '경로가 정상 반환하거나 예외를 던져도 자원 닫기가 실행되어야 합니다. close 호출을 어디에 두어야 하나요?',
        correct: 'try: yield resource / finally: resource.close()',
        correctFeedback: 'finally 블록은 정상 처리와 예외 종료 양쪽에서 자원 정리 코드를 실행합니다.',
        incorrect: [
          { text: '예외를 처리하는 except 분기에만 close 배치', feedback: '정상 완료 경로에서는 except가 실행되지 않아 자원이 닫히지 않을 수 있습니다.' },
          { text: '요청마다 같은 전역 Resource 객체 덮어쓰기', feedback: '전역 자원을 요청마다 바꾸면 동시에 처리되는 요청 사이에 자원 상태가 섞일 수 있습니다.' },
        ],
        hint: '자원 사용 코드가 정상 종료되거나 실패한 어느 경우에도 실행할 Python 절을 생각하세요.',
        explanation: '`finally`에서 닫으면 요청 함수가 정상 반환하거나 예외를 발생시켜도 정리할 수 있습니다. 예외를 잡을 경우 다시 raise해야 합니다.',
      },
      short: {
        prompt: 'yield 자원을 정상·예외 종료 모두에서 닫는 Python 제어 구조를 적으세요.',
        answers: ['try/finally', 'try: yield resource / finally: resource.close()'],
        hint: '예외 여부와 상관없이 실행할 정리 구간을 만드는 두 키워드입니다.',
        explanation: '정리 호출을 finally에 두면 경로 작업의 성공·실패 흐름 뒤에 자원 종료를 수행합니다.',
      },
      locate: {
        prompt: 'finally가 실행되지만 실제 close 메서드가 불리지 않습니다. 함수 객체만 남긴 줄을 찾으세요.',
        lines: ['class Resource:', '    def close(self):', '        pass', '', 'def get_resource():', '    resource = Resource()', '    try:', '        yield resource', '    finally:', '        resource.close'],
        line: 10,
        hint: '메서드 이름에 접근하는 것과 괄호를 붙여 호출하는 것은 다릅니다.',
        explanation: '10번 줄은 bound method를 참조만 하고 호출하지 않습니다. `resource.close()`처럼 괄호를 붙여 정리 작업을 실행하세요.',
      },
    },
    {
      intro: '비동기 자원 준비와 종료는 둘 다 await 가능한 API라면 각각 await해야 합니다. 동기 close와 비동기 aclose를 구분하고 정리 작업을 기다리지 않고 버리지 않아요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\nclass AsyncResource:\n    async def aclose(self) -> None:\n        pass\n\nasync def open_resource() -> AsyncResource:\n    return AsyncResource()\n\nasync def get_resource():\n    resource = await open_resource()\n    try:\n        yield resource\n    finally:\n        await resource.aclose()\n\n@app.get("/status")\nasync def read_status(resource: Annotated[AsyncResource, Depends(get_resource)]):\n    return {"ready": resource is not None}',
      choice: {
        prompt: 'aclose가 coroutine을 반환하는 비동기 자원입니다. yield 의존성을 종료할 때 필요한 호출은 무엇인가요?',
        correct: 'await resource.aclose()',
        correctFeedback: '비동기 종료 coroutine을 await해야 close 작업이 완료된 뒤 의존성 정리가 끝납니다.',
        incorrect: [
          { text: 'resource.aclose()', feedback: 'coroutine을 만들기만 하고 기다리지 않아 자원 종료가 끝나지 않을 수 있습니다.' },
          { text: 'asyncio.create_task(resource.aclose())만 실행', feedback: '정리 완료를 기다리지 않는 task는 요청 수명 종료 시 완료가 보장되지 않습니다.' },
        ],
        hint: 'await 가능한 비동기 함수의 결과를 실제로 기다리는 Python 키워드를 포함하세요.',
        explanation: '`await resource.aclose()`는 cleanup coroutine을 기다립니다. 동기 close 메서드라면 await를 붙이지 않는 등 실제 API 성격도 확인해야 해요.',
      },
      short: {
        prompt: 'resource.aclose가 비동기 메서드일 때 finally에서 완료까지 기다리는 한 줄을 적으세요.',
        answers: ['await resource.aclose()'],
        hint: '비동기 함수의 coroutine을 기다리는 키워드를 호출 앞에 둡니다.',
        explanation: 'await 없이 만든 coroutine을 버리면 close가 실행되지 않을 수 있습니다. 정리 작업이 끝나도록 await해야 해요.',
      },
      locate: {
        prompt: '비동기 자원이 종료되지 않고 coroutine만 만들어집니다. await를 빠뜨린 줄을 찾으세요.',
        lines: ['async def get_resource():', '    resource = await open_resource()', '    try:', '        yield resource', '    finally:', '        resource.aclose()'],
        line: 6,
        hint: 'open_resource 준비와 aclose 종료가 모두 비동기 메서드인지 확인하세요.',
        explanation: '6번 줄은 aclose coroutine을 기다리지 않습니다. `await resource.aclose()`로 수정해 비동기 정리가 끝나게 하세요.',
      },
    },
    {
      intro: '공통 하위 의존성은 한 요청의 여러 경로 의존성이 함께 사용할 수 있습니다. 기본 cache는 해당 요청 안에서 재사용하며 프로세스 전체 요청 사이에 사용자 값을 공유하지 않아요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_locale() -> str:\n    return "ko"\n\ndef get_profile_view(locale: Annotated[str, Depends(get_locale)]):\n    return {"locale": locale, "view": "profile"}\n\ndef get_catalog_view(locale: Annotated[str, Depends(get_locale)]):\n    return {"locale": locale, "view": "catalog"}\n\n@app.get("/dashboard")\ndef dashboard(profile: Annotated[dict, Depends(get_profile_view)], catalog: Annotated[dict, Depends(get_catalog_view)]):\n    return {"profile": profile, "catalog": catalog}\n\n# 기본 cache는 같은 요청의 공통 하위 의존성을 재사용',
      choice: {
        prompt: '두 하위 의존성이 같은 get_locale을 참조합니다. FastAPI의 기본 의존성 cache 범위에 대한 설명은 무엇인가요?',
        correct: '같은 요청에서 공통 하위 의존성의 결과를 재사용한다',
        correctFeedback: '기본 설정에서는 같은 요청 그래프에서 같은 dependency의 반환값을 캐시해 중복 계산을 줄입니다.',
        incorrect: [
          { text: '앱 프로세스가 살아 있는 동안 모든 요청의 locale을 공유', feedback: 'dependency cache는 사용자 요청 간 전역 저장소가 아니므로 한 요청의 결과를 다음 요청에 공유하지 않습니다.' },
          { text: '경로에서 참조할 때마다 기본적으로 반드시 다시 실행', feedback: '같은 요청 안에서는 기본 use_cache 동작이 공통 dependency 반환값을 재사용합니다.' },
        ],
        hint: 'FastAPI dependency cache를 요청 단위와 앱 전체 수명 중 어디에 두는지 구별하세요.',
        explanation: '기본 cache는 한 요청의 dependency graph 안에서 같은 하위 의존성을 재사용합니다. 매번 새 값이 필요한 경우에만 use_cache 옵션을 검토하세요.',
      },
      short: {
        prompt: '기본 설정에서 같은 요청에 중복된 하위 의존성을 한 번 계산해 공유하는 FastAPI 옵션 이름을 적으세요.',
        answers: ['use_cache', 'use_cache=True'],
        hint: 'Depends 매개변수에서 dependency 결과 재사용을 제어하는 이름입니다.',
        explanation: '`use_cache=True`가 기본 동작입니다. 이는 요청 간 전역 캐시와 다르며 필요할 때 `use_cache=False`로 같은 요청 내 재계산을 요청할 수 있습니다.',
      },
      locate: {
        prompt: '이번 요청 안에서는 동일한 get_locale 결과를 공유해야 합니다. cache를 일부러 끈 dependency 선언 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import Depends', '', 'def get_locale() -> str:', '    return "ko"', '', 'def get_catalog_view(locale: Annotated[str, Depends(get_locale, use_cache=False)]):', '    return {"locale": locale}'],
        line: 7,
        hint: 'Depends의 use_cache 인자에서 기본 재사용을 꺼 놓았는지 살펴보세요.',
        explanation: '7번 줄은 `use_cache=False`로 같은 요청 그래프의 값을 다시 계산하게 합니다. 기본 공유가 목표라면 이 인자를 제거하거나 True로 설정하세요.',
      },
    },
    {
      intro: 'yield 의존성의 기본 request scope는 응답 전송이 끝난 뒤 정리합니다. 자원이 경로 함수 반환 뒤 더 이상 필요 없다면 function scope를 지정해 응답을 보내기 전에 정리할 수 있어요.',
      example: 'from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_label():\n    try:\n        yield "course-report"\n    finally:\n        print("resource cleanup")\n\n@app.get("/reports")\ndef read_report(label: Annotated[str, Depends(get_label, scope="function")]):\n    return {"label": label}\n\n# function scope cleanup은 경로 함수 뒤, 응답 전송 전에 실행',
      choice: {
        prompt: '경로 함수가 반환된 뒤 응답을 보내기 전에 yield 의존성을 정리해야 합니다. 어떤 scope를 지정하나요?',
        correct: 'Depends(get_label, scope="function")',
        correctFeedback: 'function scope는 경로 작업 함수가 끝난 직후, HTTP 응답을 전송하기 전에 종료 코드를 실행합니다.',
        incorrect: [
          { text: 'Depends(get_label, scope="request")', feedback: 'request scope는 응답 전송을 포함한 요청 수명에 걸쳐 자원을 유지하고 응답 뒤 정리합니다.' },
          { text: 'Depends(get_label, use_cache=False)', feedback: 'use_cache는 같은 요청의 dependency 결과 재사용을 제어하고 정리 시점을 지정하지 않습니다.' },
        ],
        hint: 'FastAPI 0.121.0 이상에서 yield 의존성의 종료 경계를 지정하는 Depends 옵션을 떠올리세요.',
        explanation: '`scope="function"`은 경로 함수 전후로 의존성을 감싸 응답을 보내기 전에 정리합니다. 응답 생성 중 자원을 써야 한다면 조기 정리가 안전한지 먼저 판단하세요.',
      },
      short: {
        prompt: 'yield 의존성을 경로 함수 종료 직후 정리하도록 지정하는 scope 값 하나를 적으세요.',
        answers: ['function', 'scope="function"'],
        hint: '요청 전체가 아니라 경로 작업 함수 실행 범위에 맞춰 자원을 정리하는 값입니다.',
        explanation: '`scope="function"`은 response 전송 전에 종료됩니다. 기본 request scope와 달리 응답 후에도 자원이 필요한지 고려해야 합니다.',
      },
      locate: {
        prompt: '응답 전송 전 정리가 요구됩니다. 기본 요청 scope를 그대로 사용한 의존성 매개변수 줄을 찾으세요.',
        lines: ['from typing import Annotated', 'from fastapi import Depends, FastAPI', 'app = FastAPI()', '', 'def get_label():', '    try:', '        yield "report"', '    finally:', '        print("closed")', '', '@app.get("/reports")', 'def read_report(label: Annotated[str, Depends(get_label)]):', '    return {"label": label}'],
        line: 12,
        hint: 'Depends에는 resource lifetime을 선택할 수 있는 scope 인자가 현재 빠져 있습니다.',
        explanation: '12번 줄은 default request scope를 사용합니다. 경로 함수 종료 뒤 응답 전에 정리해야 한다면 `Depends(get_label, scope="function")`로 선언하세요.',
      },
    },
  ],
  12: [
    {
      intro: 'APIRouter는 관련 경로 작업을 기능별로 묶습니다. 인스턴스의 prefix는 URL 시작 부분을, tags는 자동 API 문서의 묶음 이름을 지정해요.',
      example: 'from fastapi import APIRouter, FastAPI\n\napp = FastAPI()\nrouter = APIRouter(prefix="/courses", tags=["courses"])\n\n@router.get("/")\nasync def list_courses():\n    return {"items": []}\n\napp.include_router(router)\n\n# 경로는 /courses/ 이고 문서 tag는 courses',
      choice: {
        prompt: '강의 기능의 경로와 문서 그룹을 묶을 APIRouter 인스턴스를 올바르게 설정한 코드는 무엇인가요?',
        correct: 'router = APIRouter(prefix="/courses", tags=["courses"])',
        correctFeedback: 'APIRouter prefix는 경로 시작을 지정하고 tags는 OpenAPI 문서에서 해당 작업을 분류합니다.',
        incorrect: [
          { text: 'router = FastAPI(prefix="/courses")', feedback: 'FastAPI 앱 인스턴스와 기능 단위로 경로를 묶는 APIRouter는 다른 클래스입니다.' },
          { text: 'router = app.route("/courses")', feedback: '이 호출은 FastAPI의 APIRouter 인스턴스를 만들지 않으며 prefix 설정도 하지 않습니다.' },
        ],
        hint: '새 앱을 만드는 클래스가 아니라 기능 단위 라우터 클래스에 prefix와 tags를 둡니다.',
        explanation: '`APIRouter(prefix=..., tags=...)`를 만든 뒤 경로를 등록하고 마지막에 메인 앱에 포함해야 실제 경로가 됩니다.',
      },
      short: {
        prompt: '강의 경로 prefix와 OpenAPI 그룹 이름을 지정하는 APIRouter 생성 호출을 적으세요.',
        answers: ['APIRouter(prefix="/courses", tags=["courses"])'],
        hint: '경로 prefix와 문서 분류명은 APIRouter 생성자의 서로 다른 인자입니다.',
        explanation: 'prefix는 최종 URL에 들어가고 tags는 자동 API 문서의 분류에 사용됩니다. 둘 다 접근 권한을 설정하는 기능은 아닙니다.',
      },
      locate: {
        prompt: '강의 경로 기능을 라우터로 묶으려 합니다. APIRouter가 아닌 새 FastAPI 앱을 만든 줄을 찾으세요.',
        lines: ['from fastapi import APIRouter, FastAPI', 'app = FastAPI()', 'router = FastAPI(prefix="/courses")', '', '@router.get("/")', 'async def list_courses():', '    return {"items": []}', '', 'app.include_router(router)'],
        line: 3,
        hint: '메인 앱과 그 안에 포함할 기능별 라우터는 서로 다른 객체입니다.',
        explanation: '3번 줄은 FastAPI 클래스로 앱을 만들고 있습니다. `APIRouter(prefix="/courses")`로 기능 라우터를 생성하세요.',
      },
    },
    {
      intro: 'APIRouter에 등록한 경로는 메인 앱에 포함될 때 그 앱의 경로 목록에 추가됩니다. 라우터의 경로 작업 데코레이터를 사용해야 prefix와 기능 구성이 유지돼요.',
      example: 'from fastapi import APIRouter, FastAPI\n\napp = FastAPI()\nrouter = APIRouter(prefix="/courses")\n\n@router.get("/{course_id}")\nasync def read_course(course_id: int):\n    return {"id": course_id}\n\napp.include_router(router)\n\n# 최종 경로: GET /courses/{course_id}',
      choice: {
        prompt: 'course_id를 받는 조회 경로를 /courses prefix의 APIRouter에 등록하는 데코레이터는 무엇인가요?',
        correct: '@router.get("/{course_id}")',
        correctFeedback: 'router에 상대 경로를 등록하면 포함 시 prefix와 결합해 /courses/{course_id}가 됩니다.',
        incorrect: [
          { text: '@app.get("/{course_id}")', feedback: '메인 앱에 직접 등록하면 APIRouter의 prefix와 기능별 경로 구성을 사용하지 않습니다.' },
          { text: '@router.path("/{course_id}")', feedback: 'APIRouter에는 HTTP 메서드별 get·post 등의 경로 데코레이터를 사용합니다.' },
        ],
        hint: '경로 작업을 어느 객체에 등록해야 router prefix가 적용되는지 확인하세요.',
        explanation: '`@router.get("/{course_id}")`는 라우터 내부의 GET 경로를 만듭니다. 앱에 포함되면 prefix가 앞에 붙습니다.',
      },
      short: {
        prompt: 'course_id를 경로 변수로 받는 GET 작업을 APIRouter에 등록하는 한 줄을 적으세요.',
        answers: ['@router.get("/{course_id}")'],
        hint: '메인 app이 아니라 APIRouter 객체의 HTTP 메서드 데코레이터를 사용합니다.',
        explanation: 'router의 상대 경로 `/{course_id}`는 포함될 때 `/courses` prefix와 결합됩니다.',
      },
      locate: {
        prompt: '이 경로는 APIRouter prefix 아래에 있어야 합니다. 메인 앱에 직접 등록한 데코레이터 줄을 찾으세요.',
        lines: ['from fastapi import APIRouter, FastAPI', 'app = FastAPI()', 'router = APIRouter(prefix="/courses")', '', '@app.get("/{course_id}")', 'async def read_course(course_id: int):', '    return {"id": course_id}', '', 'app.include_router(router)'],
        line: 5,
        hint: 'prefix를 가진 객체와 경로 데코레이터의 소유자가 같은지 비교하세요.',
        explanation: '5번 줄은 메인 앱에 직접 경로를 등록하므로 router prefix가 적용되지 않습니다. `@router.get("/{course_id}")`로 고치세요.',
      },
    },
    {
      intro: 'APIRouter에 경로를 등록하는 것만으로 메인 FastAPI 앱에 자동 연결되지는 않습니다. app.include_router를 호출해야 그 라우터 경로가 앱의 API에 포함돼요.',
      example: 'from fastapi import APIRouter, FastAPI\n\napp = FastAPI()\nrouter = APIRouter(prefix="/courses")\n\n@router.get("/")\nasync def list_courses():\n    return {"items": []}\n\napp.include_router(router)\n\n# include_router가 경로를 메인 앱에 추가',
      choice: {
        prompt: 'router에 등록된 모든 경로를 main FastAPI app에서 서비스하도록 연결하는 호출은 무엇인가요?',
        correct: 'app.include_router(router)',
        correctFeedback: '메인 앱의 include_router에 APIRouter를 전달해야 해당 경로 작업이 app에 포함됩니다.',
        incorrect: [
          { text: 'app.include(router)', feedback: 'FastAPI 앱에서 라우터를 포함하는 메서드 이름은 include_router입니다.' },
          { text: 'router.include_app(app)', feedback: '포함 호출의 방향은 메인 app에서 router를 include_router로 받는 구조입니다.' },
        ],
        hint: '메인 앱 객체가 라우터를 자신의 경로 집합으로 가져오는 메서드를 떠올리세요.',
        explanation: '`app.include_router(router)`가 기능 라우터의 작업을 FastAPI 앱에 포함합니다. 이 호출이 없으면 단지 router 객체만 만들고 등록한 상태예요.',
      },
      short: {
        prompt: '만든 courses 라우터를 메인 FastAPI 앱에 포함하는 호출 한 줄을 적으세요.',
        answers: ['app.include_router(router)'],
        hint: '메인 app에서 router를 인자로 받는 포함 메서드를 호출합니다.',
        explanation: '라우터 경로가 서버 앱의 최종 경로 구성이 되려면 `app.include_router(router)`를 실행해야 합니다.',
      },
      locate: {
        prompt: '메인 앱과 router 객체를 연결하려 합니다. FastAPI에 없는 포함 메서드를 호출한 줄을 찾으세요.',
        lines: ['from fastapi import APIRouter, FastAPI', 'app = FastAPI()', 'router = APIRouter(prefix="/courses")', '', '@router.get("/")', 'async def list_courses():', '    return {"items": []}', '', 'app.include(router)'],
        line: 9,
        hint: 'FastAPI 앱의 메서드 이름은 include 뒤에 router가 붙는지 확인하세요.',
        explanation: '9번 줄의 `include`는 라우터를 앱에 등록하는 메서드가 아닙니다. `app.include_router(router)`로 수정하세요.',
      },
    },
    {
      intro: 'tags는 OpenAPI 기반 대화형 API 문서에서 관련 경로 작업을 한 묶음으로 보여 줍니다. URL 경로 prefix나 인증·권한을 변경하는 보안 설정은 아니에요.',
      example: 'from fastapi import APIRouter, FastAPI\n\napp = FastAPI()\nrouter = APIRouter(prefix="/courses", tags=["courses"])\n\n@router.get("/")\nasync def list_courses():\n    return {"items": []}\n\napp.include_router(router)\n\n# tags는 자동 API 문서에서 경로를 분류',
      choice: {
        prompt: 'OpenAPI 문서에서 과정 관련 경로를 courses 그룹으로 표시하려면 APIRouter에 어떤 설정을 두나요?',
        correct: 'tags=["courses"]',
        correctFeedback: 'tags 목록은 API 작업을 자동 생성 문서에서 관련 주제별로 분류합니다.',
        incorrect: [
          { text: 'tag="courses"', feedback: 'FastAPI의 APIRouter 인자는 단수 tag가 아니라 문서 그룹명을 받는 복수형 tags입니다.' },
          { text: 'labels=["courses"]', feedback: 'FastAPI의 APIRouter는 문서 그룹에 labels 인자를 지원하지 않습니다. OpenAPI 그룹을 지정하는 공식 이름은 tags입니다.' },
        ],
        hint: '경로 작업을 OpenAPI 문서에서 묶어 표시하는 APIRouter 인자를 찾으세요.',
        explanation: '`tags=["courses"]`는 문서 표시용 분류입니다. URL에는 prefix가 영향을 주고 접근 제어는 별도 dependency나 보안 정책으로 구현합니다.',
      },
      short: {
        prompt: '이 라우터의 API 문서 그룹을 courses로 설정하는 tags 인자의 값을 적으세요.',
        answers: ['tags=["courses"]'],
        hint: '문서 분류 이름은 문자열 하나 이상을 담는 리스트로 전달합니다.',
        explanation: 'tags는 자동 생성 API 문서의 분류에 사용됩니다. 경로 prefix, 인증 또는 권한을 정하지 않아요.',
      },
      locate: {
        prompt: 'API 문서 규칙에서 이 기능의 tag 이름은 courses입니다. 다른 이름을 지정한 설정 줄을 찾으세요.',
        lines: ['from fastapi import APIRouter, FastAPI', 'app = FastAPI()', 'router = APIRouter(prefix="/courses", tags=["course"])', '', '@router.get("/")', 'async def list_courses():', '    return {"items": []}', '', 'app.include_router(router)'],
        line: 3,
        hint: '경로 prefix는 맞습니다. tags 문자열이 명세의 복수형 이름과 같은지 비교하세요.',
        explanation: '3번 줄의 `course`는 요구된 문서 그룹 `courses`와 다릅니다. `tags=["courses"]`로 고치세요.',
      },
    },
    {
      intro: '라우터 prefix와 각 경로 작업의 상대 경로는 이어 붙여 최종 URL을 만듭니다. 경로 조각을 중복으로 넣지 말고 계산한 결과에만 변수 매개변수가 포함되는지 확인해요.',
      example: 'from fastapi import APIRouter, FastAPI\n\napp = FastAPI()\nrouter = APIRouter(prefix="/courses")\n\n@router.get("/{course_id}")\nasync def read_course(course_id: int):\n    return {"id": course_id}\n\napp.include_router(router)\n\n# 최종 경로는 GET /courses/{course_id}',
      choice: {
        prompt: 'prefix가 /courses이고 router 경로가 /{course_id}입니다. 두 경로 조각을 결합한 최종 경로는 무엇인가요?',
        correct: '"/courses" + "/{course_id}" → "/courses/{course_id}"',
        correctFeedback: '라우터 prefix에 경로 작업의 상대 경로가 한 번씩 결합되어 최종 경로가 됩니다.',
        incorrect: [
          { text: '"/courses" + "/{course_id}" → "/courses/courses/{course_id}"', feedback: '경로 조각을 결합하는 계산에 prefix의 courses를 한 번 더 중복해 넣었습니다.' },
          { text: '"/courses" + "/{course_id}" → "/{course_id}"', feedback: '최종 경로를 계산할 때 APIRouter의 prefix를 빠뜨리면 실제 경로가 달라집니다.' },
        ],
        hint: 'prefix와 route decorator의 path를 각각 한 번만 사용해 왼쪽에서 이어 보세요.',
        explanation: '`/courses`와 `/{course_id}`를 결합하면 `/courses/{course_id}`입니다. 두 곳에 같은 하위 prefix를 적으면 중복됩니다.',
      },
      short: {
        prompt: 'prefix /courses와 경로 /{course_id}를 결합한 최종 URL 경로를 적으세요.',
        answers: ['/courses/{course_id}'],
        hint: '라우터 경로가 prefix 뒤에 이어지는 한 개의 URL을 만듭니다.',
        explanation: '최종 경로는 `/courses/{course_id}`이며 `{course_id}`는 경로 매개변수입니다.',
      },
      locate: {
        prompt: '최종 URL에 /courses가 두 번 들어갑니다. prefix와 겹치는 경로 조각을 선언한 줄을 찾으세요.',
        lines: ['from fastapi import APIRouter, FastAPI', 'app = FastAPI()', 'router = APIRouter(prefix="/courses")', '', '@router.get("/courses/{course_id}")', 'async def read_course(course_id: int):', '    return {"id": course_id}', '', 'app.include_router(router)'],
        line: 5,
        hint: 'router가 이미 /courses로 시작하므로 decorator 경로는 그 뒤의 나머지 부분만 적어야 합니다.',
        explanation: '5번 줄도 `/courses`로 시작해 최종 URL이 중복됩니다. `@router.get("/{course_id}")`로 상대 경로를 사용하세요.',
      },
    },
  ],
  13: [
    {
      intro: 'FastAPI는 await가 필요한 비동기 라이브러리와 함께 쓸 경로 작업을 async def로 선언합니다. async만 붙인다고 동기 작업이 자동으로 비동기가 되지는 않습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\nclass CourseRepository:\n    async def read(self, course_id: int):\n        return {"id": course_id, "title": "Python"}\n\nrepository = CourseRepository()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    return await repository.read(course_id)',
      choice: {
        prompt: 'repository.read가 await 가능한 비동기 I/O 함수입니다. 경로 작업 정의를 시작하는 올바른 Python 선언은 무엇인가요?',
        correct: 'async def read_course(course_id: int):',
        correctFeedback: 'await를 사용하는 경로 작업은 async def로 선언해야 Python 문법과 FastAPI의 비동기 호출 흐름에 맞습니다.',
        incorrect: [
          { text: 'async read_course(course_id: int):', feedback: 'Python 함수 정의에는 async만 적지 않고 그 뒤에 def를 함께 써야 합니다.' },
          { text: 'def async read_course(course_id: int):', feedback: 'async는 def 앞에 와야 하며 이 순서는 Python 함수 선언 문법이 아닙니다.' },
        ],
        hint: 'Python에서 비동기 함수는 async와 def를 어떤 순서로 결합하는지 생각하세요.',
        explanation: '`async def`가 coroutine 함수를 정의합니다. 함수 안에서 비동기 I/O 결과를 기다리려면 여기에 await를 사용할 수 있습니다.',
      },
      short: {
        prompt: 'FastAPI 경로에서 await 가능한 작업을 사용하도록 함수 정의에 붙일 키워드 조합을 적으세요.',
        answers: ['async def'],
        hint: '비동기 함수 선언에서 async 다음에 Python의 함수 정의 키워드를 씁니다.',
        explanation: '`async def`로 선언하면 함수 안에서 await를 사용할 수 있습니다. 동기 함수를 async로 감싼다고 내부 I/O가 자동 비동기화되는 것은 아닙니다.',
      },
      locate: {
        prompt: 'repository.read를 await해야 합니다. async 함수 선언에 필요한 키워드 하나가 빠진 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI', 'app = FastAPI()', '', '@app.get("/courses/{course_id}")', 'def read_course(course_id: int):', '    return await repository.read(course_id)'],
        line: 5,
        hint: '함수 본문에 await가 있으면 정의 줄에도 비동기 표시가 있어야 합니다.',
        explanation: '5번 줄은 일반 def라 본문에서 await를 사용할 수 없습니다. `async def read_course(...)`로 바꾸세요.',
      },
    },
    {
      intro: 'async def 안에서는 await 가능한 I/O가 끝날 때까지 양보해 다른 작업이 진행될 수 있습니다. await를 빼면 결과 대신 coroutine 객체를 받습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\nclass CourseRepository:\n    async def read(self, course_id: int):\n        return {"id": course_id}\n\nrepository = CourseRepository()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    course = await repository.read(course_id)\n    return course\n\n# await가 읽기 결과를 기다림',
      choice: {
        prompt: 'repository.read는 coroutine을 돌려주는 비동기 메서드입니다. 실제 강의 자료를 기다려 변수에 받는 식은 무엇인가요?',
        correct: 'course = await repository.read(course_id)',
        correctFeedback: 'await가 coroutine을 실행해 완료를 기다리고 반환된 강의 값을 course에 넣습니다.',
        incorrect: [
          { text: 'course = repository.read(course_id)', feedback: '이 식은 강의 자료가 아니라 아직 기다리지 않은 coroutine 객체를 변수에 넣습니다.' },
          { text: 'course = await repository.read', feedback: '메서드를 호출하지 않아 coroutine을 만들지 않았습니다. course_id와 함께 호출해야 합니다.' },
        ],
        hint: '비동기 메서드 호출의 결과를 사용하려면 호출 표현식 앞에 대기 키워드를 둡니다.',
        explanation: '`await repository.read(course_id)`가 비동기 결과를 기다립니다. await를 생략하면 응답 직렬화에 쓸 실제 값이 아닌 coroutine이 남아요.',
      },
      short: {
        prompt: '비동기 repository에서 course_id의 값을 기다려 가져오는 대입문을 적으세요.',
        answers: ['course = await repository.read(course_id)'],
        hint: '비동기 메서드 호출 앞에 완료를 기다리는 Python 키워드를 붙입니다.',
        explanation: 'await가 끝난 뒤 course에는 repository.read의 반환 데이터가 들어옵니다. 호출 자체만 저장하면 coroutine 객체가 남습니다.',
      },
      locate: {
        prompt: '응답에 강의 객체가 아니라 coroutine이 반환됩니다. 비동기 호출 앞에서 await를 빠뜨린 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def read_course(course_id: int):', '    course = repository.read(course_id)', '    return course'],
        line: 3,
        hint: 'repository.read는 async def 메서드이므로 호출 결과가 즉시 자료 객체가 아닙니다.',
        explanation: '3번 줄은 coroutine을 그대로 course에 대입합니다. `await repository.read(course_id)`로 완료를 기다리세요.',
      },
    },
    {
      intro: 'FastAPI가 직접 호출하는 일반 def 경로 작업은 외부 threadpool에서 처리됩니다. 그러나 async 경로 안에서 직접 부르는 임의 동기 함수는 자동으로 threadpool로 옮겨지지 않습니다.',
      example: 'from fastapi import FastAPI\n\napp = FastAPI()\n\nclass SyncRepository:\n    def read(self, course_id: int):\n        return {"id": course_id, "title": "Python"}\n\nrepository = SyncRepository()\n\n@app.get("/courses/{course_id}")\ndef read_course(course_id: int):\n    return repository.read(course_id)\n\n# FastAPI는 일반 def 경로를 외부 threadpool에서 호출',
      choice: {
        prompt: '사용 중인 데이터베이스 드라이버가 동기 I/O만 제공합니다. blocking 호출을 이벤트 루프 안에서 직접 실행하지 않을 경로 선택은 무엇인가요?',
        correct: '일반 def 경로 작업에서 동기 repository를 호출',
        correctFeedback: 'FastAPI는 일반 def path operation을 외부 threadpool에서 실행해 동기 I/O가 이벤트 루프를 직접 점유하지 않게 합니다.',
        incorrect: [
          { text: 'async def 안에서 동기 repository를 바로 호출', feedback: 'FastAPI는 async 함수 내부의 임의 동기 호출을 자동으로 다른 스레드에 옮기지 않습니다.' },
          { text: '동기 repository 함수에 async만 앞에 붙임', feedback: '선언에 async를 붙여도 동기 드라이버 호출이 비동기 I/O로 바뀌지는 않습니다.' },
        ],
        hint: 'FastAPI가 직접 실행 방식을 구분하는 기준은 path operation이 일반 def인지 async def인지입니다.',
        explanation: '동기 라이브러리를 그대로 사용한다면 일반 def 경로가 threadpool 실행 대상입니다. async 함수가 동기 helper를 직접 부르는 경우는 자동 offload되지 않아요.',
      },
      short: {
        prompt: 'FastAPI의 외부 threadpool에서 동기 경로 작업을 실행하게 하는 함수 선언 방식의 이름을 적으세요.',
        answers: ['일반 def', '동기 def 경로', 'def'],
        hint: 'async를 붙이지 않은 표준 Python 함수 선언을 뜻합니다.',
        explanation: 'FastAPI는 일반 def path operation과 dependency를 외부 threadpool에서 실행합니다. 직접 호출하는 다른 helper까지 자동 offload하는 것은 아닙니다.',
      },
      locate: {
        prompt: '동기 driver.read가 이벤트 루프에서 실행됩니다. 일반 def로 바꾸어야 할 async 경로 선언 줄을 찾으세요.',
        lines: ['@app.get("/courses/{course_id}")', 'async def read_course(course_id: int):', '    return sync_repository.read(course_id)'],
        line: 2,
        hint: '이 예제에는 await 가능한 호출이 없고 repository 함수는 동기 I/O입니다.',
        explanation: '2번 줄의 async def 안에서 동기 driver를 직접 호출합니다. 일반 `def read_course(...)` 경로로 두면 FastAPI가 threadpool에서 처리합니다.',
      },
    },
    {
      intro: 'CPU를 오래 쓰는 계산도 async def 안에서 그대로 실행하면 await 지점이 없는 동안 이벤트 루프를 막습니다. 무거운 계산은 측정 후 별도 프로세스 작업 경계를 설계해야 해요.',
      example: 'import asyncio\nfrom concurrent.futures import ProcessPoolExecutor\n\n# process_pool은 앱 lifespan에서 만들고 종료 때 정리\ndef build_report(payload: bytes) -> int:\n    return sum(payload)\n\nasync def create_report(payload: bytes, process_pool: ProcessPoolExecutor):\n    loop = asyncio.get_running_loop()\n    return await loop.run_in_executor(process_pool, build_report, payload)\n\n# CPU-bound 계산을 event loop 밖 process pool로 전달',
      choice: {
        prompt: '큰 CPU-bound 계산이 이벤트 루프를 점유하지 않도록 별도 프로세스에서 실행하고 결과를 기다리는 방식은 무엇인가요?',
        correct: 'run_in_executor(process_pool, build_report, payload)',
        correctFeedback: 'process pool executor는 계산을 다른 프로세스로 보내고 await로 완료 결과를 비동기 흐름에 연결합니다.',
        incorrect: [
          { text: 'async def build_report(payload): pass', feedback: 'async def 선언만으로 CPU 연산이 다른 작업에 양보되거나 별도 프로세스에서 실행되지는 않습니다.' },
          { text: 'await build_report(payload)', feedback: 'await할 실제 I/O 지점이 없는 CPU 계산은 같은 이벤트 루프를 계속 점유할 수 있습니다.' },
        ],
        hint: 'CPU 병렬 계산을 별도 process executor로 보내는 asyncio 이벤트 루프 API를 떠올리세요.',
        explanation: '`run_in_executor`에 ProcessPoolExecutor를 넘겨 무거운 CPU 작업을 보냅니다. pool은 요청마다 만들지 말고 앱 수명에 맞춰 관리하며 비용과 작업 한도를 설계해야 합니다.',
      },
      short: {
        prompt: 'CPU-bound 함수를 별도 프로세스에 위임하는 Python executor 유형 하나를 적으세요.',
        answers: ['ProcessPoolExecutor'],
        hint: '이름에 Process와 Executor가 들어가는 concurrent.futures 유형입니다.',
        explanation: 'ProcessPoolExecutor는 CPU 계산을 별도 프로세스로 분리할 때 쓸 수 있습니다. 작업 직렬화 가능성, 프로세스 수와 수명주기도 설계해야 합니다.',
      },
      locate: {
        prompt: 'CPU 계산이 event loop 안에서 직접 실행됩니다. 별도 process executor로 전달하지 않은 줄을 찾으세요.',
        lines: ['async def create_report(payload: bytes):', '    result = build_report(payload)', '    return {"result": result}'],
        line: 2,
        hint: 'build_report는 동기 CPU 계산이고 본문에는 실행을 양보할 await가 없습니다.',
        explanation: '2번 줄은 CPU 함수를 현재 async 작업 안에서 직접 실행합니다. ProcessPoolExecutor와 run_in_executor를 검토해 계산 경계를 분리하세요.',
      },
    },
    {
      intro: 'async def 함수 호출은 즉시 최종 결과가 아니라 coroutine 객체를 만듭니다. await 가능한 호출자는 이를 기다려 함수가 반환한 일반 값을 받아야 해요.',
      example: 'async def fetch_course(course_id: int) -> dict:\n    return {"id": course_id, "title": "Python"}\n\nasync def read_course(course_id: int) -> dict:\n    course = await fetch_course(course_id)\n    return course\n\n# await 뒤에는 fetch_course가 반환한 dict가 있음',
      choice: {
        prompt: 'fetch_course는 async def 함수이고 dict를 반환합니다. read_course 안에서 결과 값을 받는 올바른 호출은 무엇인가요?',
        correct: 'await fetch_course(course_id)',
        correctFeedback: 'await가 fetch_course의 coroutine 실행 완료를 기다려 dict 반환값을 전달합니다.',
        incorrect: [
          { text: 'fetch_course(course_id)', feedback: 'await를 생략하면 dict가 아닌 coroutine 객체를 돌려받습니다.' },
          { text: 'await fetch_course', feedback: '함수 객체만 기다릴 수 없습니다. 인자로 호출해 coroutine을 만들어야 합니다.' },
        ],
        hint: 'async 함수 이름을 호출하고 그 앞에서 coroutine 완료를 기다리는 표현을 선택하세요.',
        explanation: 'async 함수 호출에는 괄호가 필요하고 그 결과를 일반 값으로 받으려면 await해야 합니다. await를 빼면 coroutine 객체가 남습니다.',
      },
      short: {
        prompt: 'fetch_course를 호출해 coroutine이 돌려주는 강의 결과까지 기다리는 표현을 적으세요.',
        answers: ['await fetch_course(course_id)'],
        hint: '호출 괄호로 coroutine을 만들고 await로 완료를 기다려야 합니다.',
        explanation: '`await fetch_course(course_id)`가 완료되면 함수가 반환한 실제 dict 값을 얻습니다. 괄호만 호출한 상태와 구별하세요.',
      },
      locate: {
        prompt: '경로가 dict가 아닌 coroutine을 반환합니다. async helper 호출을 기다리지 않은 줄을 찾으세요.',
        lines: ['async def fetch_course(course_id: int):', '    return {"id": course_id}', '', 'async def read_course(course_id: int):', '    course = fetch_course(course_id)', '    return course'],
        line: 5,
        hint: 'fetch_course도 async def이므로 호출 결과의 실제 타입을 살펴보세요.',
        explanation: '5번 줄은 coroutine 객체를 course에 대입합니다. `await fetch_course(course_id)`로 함수의 반환값을 기다리세요.',
      },
    },
  ],
  14: [
    {
      intro: 'HTTP 미들웨어는 특정 경로 작업 전 요청을 받고 응답 생성 뒤 반환 전에 다시 처리할 수 있습니다. FastAPI에는 HTTP 미들웨어를 등록하는 decorator가 있어요.',
      example: 'from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def add_study_header(request: Request, call_next):\n    response = await call_next(request)\n    response.headers["X-Study-App"] = "one-step"\n    return response\n\n# 모든 HTTP 요청과 응답을 감싸는 middleware',
      choice: {
        prompt: '모든 HTTP 요청·응답을 감싸는 FastAPI 함수형 middleware 등록 decorator는 무엇인가요?',
        correct: '@app.middleware("http")',
        correctFeedback: 'http 타입 decorator는 request와 call_next를 받는 middleware 함수를 FastAPI 앱에 등록합니다.',
        incorrect: [
          { text: '@app.route_middleware("http")', feedback: 'FastAPI 앱에는 route_middleware 등록 API가 없습니다. HTTP decorator 이름은 middleware입니다.' },
          { text: '@router.middleware("http")', feedback: '이 학습 방식은 FastAPI 애플리케이션 app에 middleware decorator를 등록합니다.' },
        ],
        hint: '앱 객체에서 middleware 함수를 장식하는 정확한 decorator 이름을 확인하세요.',
        explanation: '`@app.middleware("http")`로 등록한 함수는 경로 작업 전 request와 응답 후 response 흐름을 감쌉니다.',
      },
      short: {
        prompt: 'HTTP 요청과 응답을 감쌀 함수형 middleware의 FastAPI decorator 한 줄을 적으세요.',
        answers: ['@app.middleware("http")'],
        hint: 'FastAPI app의 middleware method에 처리 종류인 http를 문자열로 전달합니다.',
        explanation: '이 decorator 아래에 request와 call_next를 받는 middleware 함수를 정의합니다.',
      },
      locate: {
        prompt: '함수는 일반 Python decorator를 사용해 앱에 등록되지 않았습니다. HTTP middleware 목표와 다른 선언 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI, Request', 'app = FastAPI()', '', '@app.route_middleware("http")', 'async def add_study_header(request: Request, call_next):', '    response = await call_next(request)', '    return response'],
        line: 4,
        hint: 'FastAPI app에 있는 실제 decorator 이름인지 살펴보세요.',
        explanation: '4번 줄의 `route_middleware`는 존재하지 않는 등록 방식입니다. `@app.middleware("http")`로 고치세요.',
      },
    },
    {
      intro: 'call_next(request)는 나머지 middleware와 경로 처리를 진행한 뒤 생성된 Response를 돌려줍니다. middleware에서 요청을 넘길 때 이 비동기 호출을 await해야 해요.',
      example: 'from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def record_request(request: Request, call_next):\n    method = request.method\n    response = await call_next(request)\n    response.headers["X-Request-Method"] = method\n    return response\n\n# call_next 뒤에는 경로 응답 객체가 도착',
      choice: {
        prompt: '다음 middleware와 경로 작업을 실행하고 완성된 HTTP Response를 받는 핵심 대입문은 무엇인가요?',
        correct: 'response = await call_next(request)',
        correctFeedback: 'call_next에 요청을 전달하고 await하면 내부 경로 작업이 만든 Response를 받습니다.',
        incorrect: [
          { text: 'response = call_next(request)', feedback: 'await를 빼면 Response 대신 아직 완료되지 않은 coroutine 객체가 남습니다.' },
          { text: 'response = await call_next(response)', feedback: '다음 처리 단계에 넘길 값은 아직 만들어지지 않은 response가 아니라 현재 request입니다.' },
        ],
        hint: '이 단계에서 아직 받은 것은 request입니다. call_next 호출 결과를 기다려 response에 저장합니다.',
        explanation: '`await call_next(request)`가 하위 middleware와 path operation을 실행하고 Response를 돌려줍니다.',
      },
      short: {
        prompt: 'request를 다음 처리에 넘겨 완료된 response를 받는 middleware 대입문을 적으세요.',
        answers: ['response = await call_next(request)'],
        hint: 'call_next에는 현재 request를 주고 await 결과를 response에 저장합니다.',
        explanation: 'await를 통해 내부 경로 처리가 끝나고 만들어진 Response를 받아 후속 헤더 처리를 할 수 있습니다.',
      },
      locate: {
        prompt: '경로 작업이 실행되기 전에 response를 참조합니다. request를 call_next에 전달해야 할 줄을 찾으세요.',
        lines: ['@app.middleware("http")', 'async def record_request(request, call_next):', '    response = await call_next(response)', '    return response'],
        line: 3,
        hint: '다음 처리에 전달하는 입력은 이미 생성된 응답이 아니라 들어온 요청입니다.',
        explanation: '3번 줄은 아직 없는 response를 call_next에 넘깁니다. `await call_next(request)`로 바꾸세요.',
      },
    },
    {
      intro: 'call_next가 돌아온 뒤 response.headers에 서버 응답 헤더를 설정할 수 있습니다. 경로 함수가 만든 본문과 status code는 유지하고 응답을 다시 반환해요.',
      example: 'from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def add_source(request: Request, call_next):\n    response = await call_next(request)\n    response.headers["X-Request-Source"] = "course-api"\n    return response\n\n# 이 헤더는 클라이언트로 가는 응답에 추가됨',
      choice: {
        prompt: '내부 경로 응답을 받은 뒤 X-Request-Source를 클라이언트 응답에 붙이는 대입문은 무엇인가요?',
        correct: 'response.headers["X-Request-Source"] = "course-api"',
        correctFeedback: 'call_next가 만든 Response의 headers를 수정하므로 헤더가 반환되는 HTTP 응답에 포함됩니다.',
        incorrect: [
          { text: 'request.headers["X-Request-Source"] = "course-api"', feedback: 'request.headers는 클라이언트가 보낸 요청 값이며 서버가 보낼 응답 헤더가 아닙니다.' },
          { text: 'headers["X-Request-Source"] = "course-api"', feedback: '이름만 있는 headers 변수는 이 함수에서 정의되지 않았습니다. response.headers를 수정해야 합니다.' },
        ],
        hint: 'call_next 뒤에 받은 응답 객체에서 서버가 보낼 헤더 mapping을 찾으세요.',
        explanation: '`response.headers[...]`는 반환할 응답을 수정합니다. CORS 환경에서 브라우저 JavaScript가 읽게 하려면 expose_headers도 별도로 설정해야 할 수 있습니다.',
      },
      short: {
        prompt: 'FastAPI middleware에서 응답 source header를 response 객체에 추가하는 대입문을 적으세요.',
        answers: ['response.headers["X-Request-Source"] = "course-api"'],
        hint: '요청이 아닌 response 객체의 headers mapping에 값을 기록합니다.',
        explanation: 'middleware가 Response에 사용자 정의 헤더를 붙인 뒤 그 response를 반환하면 클라이언트로 전송됩니다.',
      },
      locate: {
        prompt: '서버가 응답으로 보낼 source 값을 설정해야 합니다. 클라이언트 요청 헤더를 바꾸려는 줄을 찾으세요.',
        lines: ['@app.middleware("http")', 'async def add_source(request, call_next):', '    response = await call_next(request)', '    request.headers["X-Request-Source"] = "course-api"', '    return response'],
        line: 4,
        hint: '요청 헤더는 수신 데이터이고 call_next가 돌려준 response는 송신 데이터입니다.',
        explanation: '4번 줄은 request.headers를 수정합니다. `response.headers["X-Request-Source"]`에 기록하세요.',
      },
    },
    {
      intro: 'middleware는 call_next가 반환한 응답을 필요에 따라 수정한 뒤 그대로 반환합니다. 응답 객체를 반환해야 경로의 본문·상태와 middleware에서 추가한 헤더가 유지돼요.',
      example: 'from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def add_study_header(request: Request, call_next):\n    response = await call_next(request)\n    response.headers["X-Study-App"] = "one-step"\n    return response\n\n# call_next의 반환 객체가 최종 응답',
      choice: {
        prompt: '응답 헤더를 추가한 후 원래 경로 응답 본문과 상태 코드를 클라이언트까지 전달하는 반환값은 무엇인가요?',
        correct: 'return response',
        correctFeedback: '수정한 Response를 돌려주어야 경로 작업의 본문과 상태, middleware 헤더가 함께 전송됩니다.',
        incorrect: [
          { text: 'return {"ok": True}', feedback: '새 dict를 반환하면 원래 Response의 상태·본문 계약이 대체될 수 있습니다.' },
          { text: 'return request', feedback: '요청 객체는 클라이언트에서 받은 입력이고 middleware 반환값은 응답이어야 합니다.' },
        ],
        hint: 'call_next가 생성했고 바로 위에서 수정한 객체를 그대로 반환합니다.',
        explanation: '`return response`로 call_next 결과를 반환해야 내부 경로 응답과 middleware 수정 사항이 최종 HTTP 응답에 남습니다.',
      },
      short: {
        prompt: '헤더 수정을 마친 middleware가 하위 경로의 HTTP 응답을 전달하는 반환문을 적으세요.',
        answers: ['return response'],
        hint: 'call_next로 받은 Response 객체 이름을 반환합니다.',
        explanation: '수정한 response를 반환하면 기존 경로 응답을 보존하며 client로 전달합니다.',
      },
      locate: {
        prompt: '헤더를 추가했지만 최종 요청 처리 결과가 응답으로 반환되지 않습니다. 잘못된 반환 줄을 찾으세요.',
        lines: ['@app.middleware("http")', 'async def add_study_header(request, call_next):', '    response = await call_next(request)', '    response.headers["X-Study-App"] = "one-step"', '    return request'],
        line: 5,
        hint: '함수의 매개변수 가운데 client로 돌려보낼 HTTP Response가 무엇인지 구별하세요.',
        explanation: '5번 줄은 수신 request를 반환합니다. 하위 경로에서 받은 `response`를 반환해야 본문과 상태가 전달됩니다.',
      },
    },
    {
      intro: '여러 middleware는 겹겹이 쌓인 래퍼가 됩니다. 마지막에 추가한 것이 요청에서 가장 먼저 실행되고 응답을 반환할 때는 가장 나중에 실행돼요.',
      example: 'from fastapi import FastAPI, Request\nfrom starlette.middleware.base import BaseHTTPMiddleware\n\napp = FastAPI()\n\nclass MiddlewareA(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        return await call_next(request)\n\nclass MiddlewareB(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        return await call_next(request)\n\napp.add_middleware(MiddlewareA)\napp.add_middleware(MiddlewareB)\n\n# 요청: B -> A -> route / 응답: route -> A -> B',
      choice: {
        prompt: 'MiddlewareA를 먼저, MiddlewareB를 나중에 추가했습니다. 요청과 응답의 처리 순서를 모두 맞게 나타낸 것은 무엇인가요?',
        correct: 'B → A → route → A → B',
        correctFeedback: '마지막 추가된 B가 요청을 먼저 감싸고 응답에서는 가장 바깥에서 끝까지 전달합니다.',
        incorrect: [
          { text: 'A → B → route → B → A', feedback: '추가 순서를 그대로 요청 순서로 읽었지만 실제로는 마지막 middleware가 바깥 래퍼입니다.' },
          { text: 'B → A → route → B → A', feedback: '요청은 맞지만 응답 순서를 뒤집지 않았습니다. 반환 시에는 안쪽 A가 먼저 실행됩니다.' },
        ],
        hint: '마지막에 추가된 미들웨어부터 요청이 들어가고 같은 스택을 거꾸로 응답이 나옵니다.',
        explanation: '요청은 B→A→route, 응답은 route→A→B 순서입니다. 오류 처리나 헤더 변경 위치를 설계할 때 이 순서를 고려하세요.',
      },
      short: {
        prompt: 'MiddlewareA 다음 MiddlewareB를 추가했을 때 요청과 응답의 전체 실행 순서를 적으세요.',
        answers: ['B → A → route → A → B'],
        hint: '요청의 바깥쪽에서 시작한 뒤 응답은 안쪽부터 바깥으로 나옵니다.',
        explanation: '마지막으로 추가한 B가 외부 래퍼입니다. 응답 때는 내부 A가 먼저 반환한 뒤 B가 마지막으로 처리합니다.',
      },
      locate: {
        prompt: '요청은 마지막 추가 B부터 시작해야 합니다. middleware를 요청의 반대 순서로 추가한 줄을 찾으세요.',
        lines: ['app = FastAPI()', 'app.add_middleware(MiddlewareB)', 'app.add_middleware(MiddlewareA)', '', '# 요청에서 B가 바깥쪽이어야 함'],
        line: 2,
        hint: 'Starlette middleware stack에서는 마지막 추가가 가장 바깥쪽입니다.',
        explanation: '2번 줄이 B를 먼저 추가하고 A를 나중에 추가하여 A가 요청 바깥쪽이 됩니다. A를 먼저, B를 나중에 추가해야 요청이 B→A 순서입니다.',
      },
    },
  ],
  15: [
    {
      intro: '요청 경로의 리소스가 존재하지 않으면 FastAPI HTTPException을 raise하고 404를 전달합니다. 예외를 return하는 것이 아니라 raise해야 나머지 처리를 중단해요.',
      example: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\ncourses = {7: {"title": "Python"}}\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    course = courses.get(course_id)\n    if course is None:\n        raise HTTPException(status_code=404, detail="Course not found")\n    return course\n\n# 없는 ID는 404 응답',
      choice: {
        prompt: 'courses mapping에 요청한 course_id가 없을 때 조회 실패를 표현하는 FastAPI 예외 코드는 무엇인가요?',
        correct: 'raise HTTPException(status_code=404, detail="Course not found")',
        correctFeedback: '존재하지 않는 리소스 조회는 404로 중단하고 안전한 설명을 detail에 담습니다.',
        incorrect: [
          { text: 'return HTTPException(status_code=404)', feedback: 'HTTPException 객체를 반환하는 대신 raise해야 경로 처리를 중단하고 오류 응답을 만듭니다.' },
          { text: 'raise HTTPException(status_code=200)', feedback: '200은 성공 상태라 리소스를 찾지 못한 조회 실패 의미와 맞지 않습니다.' },
        ],
        hint: '예외를 발생시키는 Python 문장과 없는 리소스 상태 코드를 함께 사용하세요.',
        explanation: '`raise HTTPException(404, ...)`는 경로 처리를 중단하고 Not Found 응답을 만듭니다. 200 성공을 반환하면 클라이언트가 부재를 알 수 없습니다.',
      },
      short: {
        prompt: 'course_id 조회 결과가 없을 때 404 Not Found 예외를 발생시키는 한 줄을 적으세요.',
        answers: ['raise HTTPException(status_code=404, detail="Course not found")'],
        hint: 'HTTPException을 return하지 말고 발생시키며 상태는 Not Found 값으로 둡니다.',
        explanation: 'FastAPI는 HTTPException을 처리해 404 오류 응답으로 변환합니다. detail에는 클라이언트가 이해할 안전한 설명을 넣습니다.',
      },
      locate: {
        prompt: 'course가 없을 때 예외가 응답으로 처리되지 않고 함수 반환값으로 남습니다. 잘못된 줄을 찾으세요.',
        lines: ['from fastapi import HTTPException', 'async def read_course(course_id: int):', '    course = None', '    if course is None:', '        return HTTPException(status_code=404, detail="Course not found")'],
        line: 5,
        hint: 'HTTPException은 반환 객체가 아니라 raise 대상인 Python 예외입니다.',
        explanation: '5번 줄은 예외 객체를 return합니다. `raise HTTPException(...)`으로 발생시켜 요청을 중단하세요.',
      },
    },
    {
      intro: '인증되지 않았거나 credential이 유효하지 않으면 401을 사용할 수 있습니다. Bearer 방식에서는 클라이언트가 인증 방식을 알도록 WWW-Authenticate challenge를 함께 보내야 해요.',
      example: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n@app.get("/private")\nasync def read_private():\n    # 실제 토큰 검증 dependency가 실패한 경우의 응답 예\n    raise HTTPException(\n        status_code=401,\n        detail="Authentication required",\n        headers={"WWW-Authenticate": "Bearer"},\n    )\n\n# 예외 응답 예시이며 인증 자체는 별도 구현',
      choice: {
        prompt: 'Bearer 자격 증명이 없거나 유효하지 않아 인증에 실패했습니다. challenge 헤더를 포함하는 응답 코드는 무엇인가요?',
        correct: '401 + WWW-Authenticate: Bearer',
        correctFeedback: '401은 인증 자격 증명 실패이며 WWW-Authenticate는 사용 가능한 인증 challenge를 알립니다.',
        incorrect: [
          { text: '403 + WWW-Authenticate: Bearer', feedback: '403은 인증된 주체가 작업 권한이 없을 때 쓰며 자격 증명 실패 401과 구별합니다.' },
          { text: '404 + Authorization: Bearer', feedback: 'Authorization은 요청에서 보내는 헤더 이름이며 오류 응답 challenge에는 WWW-Authenticate를 씁니다.' },
        ],
        hint: '아직 인증되지 않은 요청과 이미 인증됐지만 금지된 요청의 상태를 나누세요.',
        explanation: '401은 credential 인증 실패를 알리고 challenge를 제공할 수 있습니다. 이 예제는 오류 응답 형태만 보여 주며 토큰 검증은 별도 dependency가 해야 합니다.',
      },
      short: {
        prompt: 'Bearer 인증 실패에서 사용할 HTTP 상태 코드 숫자와 challenge 응답 헤더 이름을 함께 적으세요.',
        answers: ['401 + WWW-Authenticate', '401 WWW-Authenticate: Bearer'],
        hint: '401과 WWW-Authenticate를 답에 포함합니다.',
        explanation: '401은 인증되지 않은 요청이고 `WWW-Authenticate`는 클라이언트에 인증 방법을 알립니다. 실제 검증 로직은 HTTPException이 대신하지 않습니다.',
      },
      locate: {
        prompt: '인증 자격 증명이 실패했는데 권한 부족 상태를 반환하고 있습니다. 상태 코드를 지정한 줄을 찾으세요.',
        lines: ['from fastapi import HTTPException', 'def reject_credentials():', '    raise HTTPException(', '        status_code=403,', '        detail="Authentication required",', '        headers={"WWW-Authenticate": "Bearer"},', '    )'],
        line: 4,
        hint: '403은 권한 부족이며 여기서는 인증 자체가 되지 않았습니다.',
        explanation: '4번 줄은 인증 실패를 403으로 표시합니다. 자격 증명 부재·유효성 실패는 401로 구분하세요.',
      },
    },
    {
      intro: '요청자를 인증했지만 해당 강의에 대한 작업 권한이 없으면 403을 반환합니다. 401과 403은 권한 정책으로 구별해야 하며 HTTPException 자체가 사용자를 인증하지 않아요.',
      example: 'from fastapi import Depends, FastAPI, HTTPException\nfrom auth import User, get_current_user  # 실제 credential 검증 dependency\n\napp = FastAPI()\n\n@app.delete("/courses/{course_id}")\nasync def delete_course(course_id: int, user: User = Depends(get_current_user)):\n    if not user.can_edit_course(course_id):\n        raise HTTPException(status_code=403, detail="Not allowed to delete this course")\n    return {"deleted": course_id}\n\n# 인증 후 해당 객체 권한을 확인',
      choice: {
        prompt: '사용자 자격 증명은 검증됐지만 강의 수정 권한이 없습니다. 접근 거부를 구분하는 상태 코드는 무엇인가요?',
        correct: '403 Forbidden',
        correctFeedback: '403은 요청자를 알고 있지만 해당 작업을 허용하지 않는 권한 정책 결과입니다.',
        incorrect: [
          { text: '401 Unauthorized', feedback: '401은 credential이 없거나 유효하지 않은 인증 실패를 나타냅니다. 이 상황은 이미 인증된 사용자입니다.' },
          { text: '404 Not Found', feedback: '강의가 존재한다고 확인한 상황이라 리소스 부재를 뜻하는 404와 다릅니다.' },
        ],
        hint: '요청자를 이미 인증했는지, 요청한 객체가 없는지, 권한만 부족한지 구별하세요.',
        explanation: '인증된 사용자에게 허용된 작업이 아니면 403입니다. API가 리소스 존재 자체를 숨기는 별도 정책이 있으면 404를 선택할 수 있으므로 정책을 명시해야 합니다.',
      },
      short: {
        prompt: '인증은 통과했지만 특정 작업의 권한이 없을 때 반환하는 상태 코드와 이름을 적으세요.',
        answers: ['403 Forbidden', '403'],
        hint: '401 인증 실패와 구별되는 권한 거부 상태입니다.',
        explanation: '403은 인증된 주체가 요청은 이해했으나 권한 정책상 허용되지 않는 작업을 나타내는 상태입니다.',
      },
      locate: {
        prompt: 'user는 인증됐지만 삭제 권한이 없습니다. 권한 거부를 인증 실패 코드로 처리하는 줄을 찾으세요.',
        lines: ['from fastapi import HTTPException', 'async def delete_course(user, course_id: int):', '    if not user.can_edit_course(course_id):', '        raise HTTPException(status_code=401, detail="Not allowed")', '    return {"deleted": course_id}'],
        line: 4,
        hint: '사용자 신원은 이미 확인했고 검사하는 것은 해당 객체에 대한 허용 여부입니다.',
        explanation: '4번 줄은 권한 부족을 401로 처리합니다. 인증된 사용자의 거부된 작업은 정책상 403으로 표현하세요.',
      },
    },
    {
      intro: '예외 처리기는 특정 도메인 예외를 HTTP 응답으로 변환하는 앱 경계입니다. 등록한 예외 종류만 처리하고 의도하지 않은 서버 결함을 성공 응답으로 숨기지 않아요.',
      example: 'from fastapi import FastAPI, Request\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\nclass CourseConflict(Exception):\n    pass\n\n@app.exception_handler(CourseConflict)\nasync def handle_course_conflict(request: Request, exc: CourseConflict):\n    return JSONResponse(status_code=409, content={"detail": "Course already exists"})\n\n@app.post("/courses")\nasync def create_course():\n    raise CourseConflict()\n\n# CourseConflict만 409 JSON으로 변환',
      choice: {
        prompt: 'CourseConflict 예외만 받아 클라이언트에 409 JSON 응답을 제공하는 FastAPI 등록 decorator는 무엇인가요?',
        correct: '@app.exception_handler(CourseConflict)',
        correctFeedback: 'exception_handler에 처리할 예외 class를 지정하면 해당 예외가 발생했을 때 handler가 응답을 만듭니다.',
        incorrect: [
          { text: '@app.middleware("http")', feedback: 'middleware는 모든 요청·응답 흐름을 감싸며 특정 도메인 예외 class 처리기 등록 API가 아닙니다.' },
          { text: '@app.error_handler(CourseConflict)', feedback: 'FastAPI의 decorator 이름은 error_handler가 아니라 exception_handler입니다.' },
        ],
        hint: 'FastAPI 앱에 예외 class와 이를 처리할 함수를 연결하는 정확한 decorator를 고르세요.',
        explanation: '`@app.exception_handler(CourseConflict)`로 특정 예외 처리를 등록합니다. 반환하는 JSONResponse에는 계약에 맞는 상태 코드와 본문이 있어야 합니다.',
      },
      short: {
        prompt: 'CourseConflict class 전용 FastAPI 예외 처리기를 등록하는 decorator 한 줄을 적으세요.',
        answers: ['@app.exception_handler(CourseConflict)'],
        hint: '예외 class를 인자로 받는 app decorator입니다.',
        explanation: '이 decorator 아래 handler 함수는 CourseConflict 발생 때만 연결됩니다. 예외는 명시적인 409 JSON 응답으로 변환됩니다.',
      },
      locate: {
        prompt: 'CourseConflict용 등록 decorator가 FastAPI에 존재하지 않습니다. 사용자 정의 처리기와 다른 이름을 쓴 줄을 찾으세요.',
        lines: ['from fastapi import FastAPI, Request', 'from fastapi.responses import JSONResponse', 'app = FastAPI()', '', 'class CourseConflict(Exception):', '    pass', '', '@app.error_handler(CourseConflict)', 'async def handle_conflict(request: Request, exc: CourseConflict):', '    return JSONResponse(status_code=409, content={"detail": "conflict"})'],
        line: 9,
        hint: 'FastAPI에서 처리하는 대상이 error가 아니라 Python exception class인지 살펴보세요.',
        explanation: '9번 줄의 `error_handler`는 등록 API 이름과 다릅니다. `@app.exception_handler(CourseConflict)`로 고치세요.',
      },
    },
    {
      intro: 'HTTPException의 detail은 문자열이나 JSON으로 변환 가능한 값이 될 수 있습니다. 클라이언트에 필요한 안전한 오류 코드와 안내만 보내고 stack trace, SQL, credential 같은 내부 정보를 노출하지 않아요.',
      example: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n@app.get("/courses/{course_id}")\nasync def read_course(course_id: int):\n    course = None\n    if course is None:\n        raise HTTPException(\n            status_code=404,\n            detail={"code": "COURSE_NOT_FOUND", "message": "강의를 찾을 수 없습니다."},\n        )\n    return course\n\n# detail에는 안정된 공개 오류 정보만 포함',
      choice: {
        prompt: '없는 강의를 알리되 SQL 문장과 내부 저장소 정보를 숨겨야 합니다. 클라이언트에 공개할 detail 작성 방식은 무엇인가요?',
        correct: '안정된 오류 코드와 일반 안내 문구를 담은 JSON detail',
        correctFeedback: '공개 오류 계약에는 사용자가 처리할 code와 안전한 설명만 두고 내부 진단 정보는 서버 로그에 남깁니다.',
        incorrect: [
          { text: 'detail에 전체 SQL query와 database 연결 주소 포함', feedback: '내부 구현과 인프라 정보를 응답에 공개하면 공격 표면과 민감정보 노출 위험이 생깁니다.' },
          { text: 'detail에 예외 traceback과 access token 포함', feedback: 'traceback과 자격 증명은 공개 응답이 아니라 제한된 서버 진단 경계에서 관리해야 합니다.' },
        ],
        hint: '클라이언트가 복구에 필요한 정보와 운영자 내부 진단 기록을 나누세요.',
        explanation: 'HTTPException detail은 JSON 변환 가능 값을 지원하지만 공개용 안전한 계약만 보내야 합니다. SQL, 경로, stack trace, credential은 응답에 넣지 마세요.',
      },
      short: {
        prompt: 'API 오류 detail에 공개해도 안전하고 클라이언트가 처리할 수 있는 식별자 예시를 적으세요.',
        answers: ['COURSE_NOT_FOUND'],
        hint: '세부 내부 오류가 아니라 공개된 안정 오류 계약의 code 값입니다.',
        explanation: '`COURSE_NOT_FOUND` 같은 공개 코드와 일반 안내는 클라이언트 처리를 돕습니다. SQL·stack trace·token은 노출하지 않습니다.',
      },
      locate: {
        prompt: '오류 응답이 내부 SQL과 경로를 노출합니다. detail에 민감한 진단 정보를 넣은 줄을 찾으세요.',
        lines: ['def missing_course_error(sql_query: str):', '    raise HTTPException(', '        status_code=404,', '        detail={"message": "Not found", "query": sql_query, "db_path": "C:/data/courses.db"},', '    )'],
        line: 4,
        hint: 'message와 달리 query 및 db_path는 서비스 내부 구조를 밝힙니다.',
        explanation: '4번 줄은 SQL과 로컬 DB 경로를 공개합니다. detail에는 `COURSE_NOT_FOUND` 같은 안정 코드와 안전한 일반 안내만 남기세요.',
      },
    },
  ],
  16: [
    {
      intro: `FastAPI가 요청 본문을 검증하다 실패하면 기본 검증 응답 계약을 사용합니다. 입력값이 잘못됐다는 사실을 서버 장애와 구분해요.`,
      example: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CourseCreate(BaseModel):
    title: str

@app.post("/courses")
async def create_course(course: CourseCreate):
    return {"title": course.title}`,
      choice: {
        prompt: `요청 본문이 필수 title을 빠뜨려 FastAPI의 기본 요청 검증에서 거부될 때 반환되는 상태 코드는 무엇인가요?`,
        correct: `422 Unprocessable Entity`,
        correctFeedback: `FastAPI는 경로 작업을 호출하기 전에 입력을 검증하고, 기본 요청 검증 실패는 422 응답으로 전달합니다.`,
        incorrect: [
          { text: `500 Internal Server Error`, feedback: `500은 서버 내부 실패를 뜻합니다. 형식이 잘못된 입력을 서버 장애로 바꾸면 원인과 응답 계약이 뒤섞입니다.` },
          { text: `200 OK`, feedback: `검증에 실패한 요청을 성공으로 표시하면 클라이언트가 입력을 고칠 수 없고 성공 처리로 오인합니다.` },
        ],
        hint: `경로 함수가 실행되기 전 입력 자료를 확인할 때 기본으로 사용하는 클라이언트 오류 상태를 떠올리세요.`,
        explanation: `필수 title이 없는 본문은 요청 검증을 통과하지 못하므로 FastAPI 기본 처리에서 422가 반환됩니다. 서버 코드 자체의 예외인 500과 구별해야 합니다.`,
      },
      short: {
        prompt: `필수 요청 필드가 빠져 FastAPI 기본 입력 검증이 실패할 때 사용하는 HTTP 상태 코드를 적으세요.`,
        answers: [`422`],
        hint: `200번대 성공이나 500번대 서버 장애가 아닌 입력 검증 오류 상태입니다.`,
        explanation: `기본 요청 검증 실패는 422 Unprocessable Entity로 표현합니다. 앱이 예외 처리기를 바꾸면 공개 본문은 달라질 수 있어도 입력 실패와 서버 오류의 의미는 구별해야 합니다.`,
      },
      locate: {
        prompt: `필수 title이 없는 요청을 기본 검증 오류로 처리하지 못하게 만드는 잘못된 상태 코드 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `app = FastAPI()`, `status_code=500`, `@app.post("/courses")`, `async def create_course(payload: dict):`, `    return payload`],
        line: 3,
        hint: `입력 검증 실패를 서버 내부 오류로 분류하고 있는 상태인지 보세요.`,
        explanation: `3번 줄의 500은 서버 장애 상태입니다. 잘못된 요청 본문은 기본 검증 경로에서 422로 응답하며, 별도 계약을 만든다면 그 의미를 문서화해야 합니다.`,
      },
    },
    {
      intro: `RequestValidationError는 요청 자료의 검증 실패를 나타내요. 응답 데이터 검증 실패는 서버가 잘못된 결과를 만든 문제이므로 같은 사건으로 숨기지 않습니다.`,
      example: `from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def invalid_request(request: Request, error: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": "Invalid input"})`,
      choice: {
        prompt: `잘못된 입력 본문에 대한 사용자 정의 처리기를 등록할 때 FastAPI에서 지정해야 하는 예외 타입은 무엇인가요?`,
        correct: `RequestValidationError`,
        correctFeedback: `RequestValidationError는 클라이언트 요청의 자료가 입력 모델이나 매개변수 검증을 통과하지 못했을 때 사용합니다.`,
        incorrect: [
          { text: `ResponseValidationError`, feedback: `응답 검증 오류는 서버가 반환하려는 값이 선언한 응답 계약을 어긴 상황입니다. 잘못된 요청 데이터와 다릅니다.` },
          { text: `BaseModel`, feedback: `BaseModel은 Pydantic 모델의 기반 클래스이지, FastAPI 요청 검증 실패를 나타내는 예외 타입이 아닙니다.` },
        ],
        hint: `예외 이름에서 Request와 Response 중 어느 방향의 자료가 검증에 실패했는지 구분하세요.`,
        explanation: `요청 입력이 유효하지 않으면 RequestValidationError가 발생합니다. 응답 모델 검증 실패는 서버 측 계약 위반이므로 이를 요청 오류처럼 응답하면 진단을 숨길 수 있습니다.`,
      },
      short: {
        prompt: `FastAPI의 기본 요청 입력 검증에 실패했음을 나타내는 예외 클래스 이름을 적으세요.`,
        answers: [`RequestValidationError`],
        hint: `예외 이름 앞부분은 실패한 검증 방향인 Request를 가리킵니다.`,
        explanation: `RequestValidationError는 요청 본문·경로·쿼리 등 요청에서 온 값이 선언된 조건을 통과하지 못했을 때 사용합니다. 응답 데이터 오류와 구별합니다.`,
      },
      locate: {
        prompt: `클라이언트 요청의 입력 검증 실패를 처리해야 하는데 다른 방향의 예외를 등록한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI, Request`, `from fastapi.exceptions import ResponseValidationError`, `app = FastAPI()`, `@app.exception_handler(ResponseValidationError)`, `async def invalid_request(request: Request, error: ResponseValidationError):`, `    return JSONResponse(status_code=422, content={"detail": "Invalid input"})`],
        line: 4,
        hint: `요청을 처리하기 전에 거부된 입력인지, 서버가 만든 출력의 계약이 깨졌는지 구별하세요.`,
        explanation: `4번 줄은 ResponseValidationError를 등록해 응답 생성 실패를 잡습니다. 요청 입력 오류를 사용자 정의하려면 RequestValidationError를 등록하고, 응답 오류는 서버 결함으로 조사해야 합니다.`,
      },
    },
    {
      intro: `사용자 정의 예외 처리기는 Response 객체로 상태 코드와 본문을 함께 돌려줄 수 있어요. JSONResponse의 인자 이름은 status_code와 content입니다.`,
      example: `from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def invalid_request(request: Request, error: RequestValidationError):
    payload = {"detail": "Invalid input"}
    return JSONResponse(status_code=422, content=payload)`,
      choice: {
        prompt: `요청 검증 처리기에서 payload를 JSON 본문으로 보내고 422 상태를 지정하는 올바른 반환 코드는 무엇인가요?`,
        correct: `JSONResponse(status_code=422, content=payload)`,
        correctFeedback: `JSONResponse의 status_code는 HTTP 상태를, content는 JSON으로 직렬화할 본문 값을 지정합니다.`,
        incorrect: [
          { text: `JSONResponse(status=422, body=payload)`, feedback: `status와 body는 이 응답 클래스에서 사용할 인자 이름이 아닙니다. 상태는 status_code, 본문은 content로 지정해야 합니다.` },
          { text: `Response(json=payload, status=422)`, feedback: `Response는 json 인자로 자동 JSON 변환을 하지 않으며 status도 올바른 인자 이름이 아닙니다.` },
        ],
        hint: `JSON 응답 객체의 공식 인자 두 개를 각각 상태 코드와 직렬화할 값에 맞춰 쓰세요.`,
        explanation: `JSONResponse(status_code=422, content=payload)는 상태와 JSON 본문을 설정합니다. 응답 클래스의 생성 인자명을 임의로 바꾸면 응답 생성 단계에서 실패할 수 있어요.`,
      },
      short: {
        prompt: `payload를 JSON 본문으로 담고 HTTP 422를 설정하는 JSONResponse 호출을 적으세요.`,
        answers: [`JSONResponse(status_code=422, content=payload)`],
        hint: `상태 인자는 status_code이고, 응답에 직렬화할 값 인자는 content입니다.`,
        explanation: `JSONResponse(status_code=422, content=payload)가 지정한 상태와 본문을 함께 반환합니다. 별도 처리기에서도 HTTP 상태와 본문 계약을 맞춰야 해요.`,
      },
      locate: {
        prompt: `사용자 정의 오류 응답이 올바른 JSONResponse 인자명을 사용하지 못하는 줄을 찾으세요.`,
        lines: [`from fastapi.responses import JSONResponse`, `payload = {"detail": "Invalid input"}`, `return JSONResponse(status=422, body=payload)`],
        line: 3,
        hint: `응답 클래스가 상태와 본문에 사용하는 실제 매개변수 이름을 확인하세요.`,
        explanation: `3번 줄의 status와 body는 JSONResponse의 인자명이 아닙니다. status_code=422와 content=payload를 사용해야 합니다.`,
      },
    },
    {
      intro: `검증 오류를 사용자에게 보여 줄 때 입력 원문을 통째로 공개하지 마세요. 필요한 필드 위치와 오류 종류만 골라 공개할 수 있어요.`,
      example: `from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def invalid_request(request: Request, error: RequestValidationError):
    safe_errors = [{"loc": item["loc"], "type": item["type"]} for item in error.errors()]
    return JSONResponse(status_code=422, content={"detail": safe_errors})`,
      choice: {
        prompt: `검증 오류 응답을 유용하게 유지하면서 암호나 전체 요청 본문을 노출하지 않는 방법은 무엇인가요? 알맞은 공개 범위를 고르세요.`,
        correct: `필드 위치와 오류 종류처럼 필요한 최소 정보만 골라 반환`,
        correctFeedback: `필드 위치와 안정된 오류 종류만 선별하면 어떤 입력을 고칠지는 알려 주면서 원문 값 공개를 줄일 수 있습니다.`,
        incorrect: [
          { text: `error.body 전체를 그대로 응답`, feedback: `원문 요청 본문에는 비밀번호나 개인 입력이 포함될 수 있어 그대로 공개하면 정보 노출 위험이 있습니다.` },
          { text: `예외와 요청 헤더 전체를 응답과 로그에 복사`, feedback: `헤더에는 자격 정보가 포함될 수 있고 예외 문자열에도 내부 경로나 값이 섞일 수 있으므로 전체 복사는 피해야 합니다.` },
        ],
        hint: `학습자가 입력을 수정하는 데 꼭 필요한 오류 단서만 남기고 원본 값은 전달하지 마세요.`,
        explanation: `오류 위치와 규칙 종류는 수정에 도움을 주는 최소 정보입니다. 실제 응답에서는 요청 본문·인증 헤더·환경 값이나 traceback을 불필요하게 노출하지 않도록 선별하세요.`,
      },
      short: {
        prompt: `요청 원문을 공개하지 않으면서 검증 문제를 찾게 해 주는 응답 데이터 원칙을 짧게 적으세요.`,
        answers: [`필요한 오류 위치와 종류만 반환`, `오류 위치와 코드만 반환`],
        hint: `오류의 위치와 종류는 남기되 입력값 전체는 제외하는 원칙입니다.`,
        explanation: `필요한 오류 위치와 종류만 선별하면 사용자가 수정 지점을 알 수 있습니다. 입력 본문·암호·전체 헤더를 그대로 응답하는 것은 피해야 합니다.`,
      },
      locate: {
        prompt: `검증에 실패한 요청의 민감 입력값을 사용자에게 그대로 되돌려 보내는 줄을 찾으세요.`,
        lines: [`async def invalid_request(request: Request, error: RequestValidationError):`, `    return JSONResponse(status_code=422, content={"detail": error.body})`],
        line: 2,
        hint: `검증 실패 요청 안에 암호나 개인 정보가 있다면 이 반환 값이 이를 그대로 드러낼 수 있는지 보세요.`,
        explanation: `2번 줄은 입력 본문 전체를 detail로 공개합니다. 필요한 필드 위치와 오류 종류처럼 선별된 정보만 반환하고 원문 값을 포함하지 않도록 해야 합니다.`,
      },
    },
    {
      intro: `입력 검증 실패와 응답 검증 실패는 발생 방향이 달라요. 요청 입력은 클라이언트가 고칠 수 있지만 응답 계약 위반은 서버가 조사해야 합니다.`,
      example: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CoursePublic(BaseModel):
    title: str

@app.get("/courses/{course_id}", response_model=CoursePublic)
async def read_course(course_id: int):
    return {"title": "Python"}`, 
      choice: {
        prompt: `서버가 response_model의 필수 title을 빠뜨려 응답 검증이 실패한 경우, 이를 어떤 문제로 분류해야 하나요?`,
        correct: `서버가 선언한 응답 계약을 위반한 내부 오류`,
        correctFeedback: `응답 모델 검증 실패는 서버가 약속한 형식으로 데이터를 만들지 못한 것이므로 서버 측 문제로 조사해야 합니다.`,
        incorrect: [
          { text: `클라이언트 요청 입력 오류 422`, feedback: `요청 본문이나 매개변수가 잘못된 사건이 아닙니다. 서버가 만든 반환 값의 형식이 틀렸습니다.` },
          { text: `정상 응답 200으로 무시할 수 있는 선택 필드`, feedback: `response_model에 선언된 필수 필드가 빠지면 계약 위반입니다. 누락을 성공으로 조용히 반환하면 문제를 숨깁니다.` },
        ],
        hint: `오류를 일으킨 값이 요청에서 왔는지, 경로 함수가 서버에서 만든 출력인지 구별하세요.`,
        explanation: `필수 response_model 필드가 빠진 것은 서버가 공개 응답 계약을 깨뜨린 상황입니다. 클라이언트 입력 검증 오류로 처리하지 말고 서버 오류로 기록하고 고쳐야 합니다.`,
      },
      short: {
        prompt: `필수 response_model 필드가 서버 반환값에서 누락됐을 때 오류의 책임이 있는 쪽을 적으세요.`,
        answers: [`서버 응답 계약 위반`, `서버`],
        hint: `이번 사례는 요청을 보낸 사용자의 입력이 아니라 서버 경로 함수가 만든 출력입니다.`,
        explanation: `필수 응답 필드가 빠지면 서버가 선언한 응답 계약을 지키지 못한 것입니다. 이를 잘못된 사용자 입력 422로 덮지 말고 서버 측 결함으로 고칩니다.`,
      },
      locate: {
        prompt: `response_model 반환 검증 실패를 클라이언트 입력 오류로 바꿔 서버 결함을 숨기는 줄을 찾으세요.`,
        lines: [`@app.exception_handler(ResponseValidationError)`, `async def hide_server_error(request, error):`, `    return JSONResponse(status_code=422, content={"detail": "Invalid client input"})`],
        line: 3,
        hint: `응답 생성 실패를 요청자가 고칠 수 있는 문제로 표시하는 상태와 문구를 살펴보세요.`,
        explanation: `3번 줄은 서버의 응답 계약 위반을 클라이언트의 입력 오류 422라고 오인시킵니다. 응답 검증 실패는 서버 결함으로 조사해야 하며 요청 오류로 변환해 숨기면 안 됩니다.`,
      },
    },
  ],
  17: [
    {
      intro: `앱 전체에서 공유할 자원을 시작할 때 준비하고 종료할 때 정리하려면 Python 표준 라이브러리의 비동기 context manager를 사용합니다.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ready = True
    yield
    app.state.ready = False

app = FastAPI(lifespan=lifespan)`,
      choice: {
        prompt: `FastAPI lifespan 함수를 비동기 context manager로 만들 때 가져와야 하는 데코레이터 기반 도구는 무엇인가요?`,
        correct: `from contextlib import asynccontextmanager`,
        correctFeedback: `asynccontextmanager는 async generator의 yield 앞뒤를 비동기 자원의 진입과 종료 구간으로 감쌉니다.`,
        incorrect: [
          { text: `from contextlib import contextmanager`, feedback: `contextmanager는 동기 with 문을 위한 도구입니다. FastAPI lifespan은 비동기 context manager를 기대합니다.` },
          { text: `from fastapi import asynccontextmanager`, feedback: `asynccontextmanager는 FastAPI에서 가져오는 이름이 아니라 Python contextlib 표준 라이브러리에 있습니다.` },
        ],
        hint: `FastAPI 프레임워크가 아니라 Python의 context manager 도구가 정의된 표준 라이브러리 모듈을 떠올리세요.`,
        explanation: `asynccontextmanager는 contextlib에서 가져옵니다. 일반 contextmanager는 동기 문맥을 만들기 때문에 async lifespan 함수에 그대로 사용할 수 없습니다.`,
      },
      short: {
        prompt: `비동기 lifespan 함수에서 사용할 asynccontextmanager의 import 문을 적으세요.`,
        answers: [`from contextlib import asynccontextmanager`],
        hint: `모듈은 contextlib이고 가져올 이름은 asynccontextmanager입니다.`,
        explanation: `from contextlib import asynccontextmanager를 사용합니다. 이 도구가 async generator를 비동기 context manager로 감싸 줍니다.`,
      },
      locate: {
        prompt: `asynccontextmanager를 가져오려는 코드에서 모듈 경로를 잘못 지정한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `from fastapi import asynccontextmanager`, `app = FastAPI()`],
        line: 2,
        hint: `도구가 FastAPI 프레임워크 기능인지 Python 표준 라이브러리 도구인지 확인하세요.`,
        explanation: `2번 줄은 FastAPI에서 asynccontextmanager를 가져오려 합니다. 이 이름은 Python 표준 라이브러리 contextlib 모듈에서 가져와야 합니다.`,
      },
    },
    {
      intro: `@asynccontextmanager가 붙은 async generator의 첫 yield에서 앱 시작 준비가 끝나고, 함수가 다시 이어지는 종료 구간에서 정리 작업을 할 수 있어요.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.catalog = {"ready": True}
    yield
    app.state.catalog.clear()

app = FastAPI(lifespan=lifespan)`,
      choice: {
        prompt: `FastAPI lifespan에 전달할 async generator를 비동기 context manager로 바꾸는 올바른 데코레이터는 무엇인가요?`,
        correct: `@asynccontextmanager`,
        correctFeedback: `@asynccontextmanager가 yield 앞과 뒤를 진입·종료 구간으로 연결해 lifespan 계약에 맞는 context manager를 만듭니다.`,
        incorrect: [
          { text: `@contextmanager`, feedback: `이 데코레이터는 동기 context manager를 만듭니다. lifespan의 async generator에는 비동기 버전이 필요합니다.` },
          { text: `@app.middleware("http")`, feedback: `HTTP middleware는 요청마다 실행되는 계층입니다. 앱 시작·종료 때 한 번 실행되는 lifespan과 수명이 다릅니다.` },
        ],
        hint: `async generator를 비동기 context manager로 바꾸는 decorator 이름을 고르세요.`,
        explanation: `lifespan 함수는 시작 시 준비하고 첫 yield에서 요청 처리를 허용한 뒤 앱 종료 때 재개되어 자원을 정리합니다. 이 경계는 @asynccontextmanager로 만듭니다.`,
      },
      short: {
        prompt: `async def lifespan(...): 안에서 사용할 비동기 context manager 데코레이터를 적으세요.`,
        answers: [`@asynccontextmanager`],
        hint: `동기 이름 contextmanager 앞에 async가 붙는 비동기 버전입니다.`,
        explanation: `@asynccontextmanager가 async generator의 yield 앞뒤를 비동기 자원 수명으로 묶어 줍니다.`,
      },
      locate: {
        prompt: `비동기 lifespan 함수를 동기 context manager로 감싸 앱 시작 시점 연결에 맞지 않게 만드는 줄을 찾으세요.`,
        lines: [`from contextlib import contextmanager`, `@contextmanager`, `async def lifespan(app):`, `    yield`],
        line: 2,
        hint: `함수 선언은 async지만 위의 decorator가 동기 버전인지 확인하세요.`,
        explanation: `2번 줄의 @contextmanager는 동기 context manager를 만듭니다. 비동기 lifespan 함수에는 @asynccontextmanager를 사용해야 합니다.`,
      },
    },
    {
      intro: `lifespan은 yield 전 코드를 앱이 요청을 받기 전에 실행하고, yield 뒤 코드는 앱이 요청 처리를 마친 뒤 종료할 때 실행합니다.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI

events = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    events.append("startup")
    yield
    events.append("shutdown")

app = FastAPI(lifespan=lifespan)`,
      choice: {
        prompt: `FastAPI lifespan 컨텍스트에서 앱 시작 준비 코드는 첫 yield를 기준으로 어느 쪽에 작성해야 하나요?`,
        correct: `yield 이전`,
        correctFeedback: `yield 이전 구간은 앱이 요청을 받기 전에 실행되며, yield 이후 구간은 앱 종료 시 정리에 사용됩니다.`,
        incorrect: [
          { text: `yield 이후`, feedback: `yield 뒤는 앱이 요청 처리를 마치고 종료할 때 재개되는 정리 구간입니다. 시작 준비를 여기에 두면 시점이 늦습니다.` },
          { text: `yield가 반환한 값에 담기`, feedback: `lifespan yield 값의 상태 전달은 별도 기능이지만 시작·종료 코드를 yield 값에 넣는 방식은 아닙니다.` },
        ],
        hint: `컨텍스트에 진입하기 직전 구간과 앱이 종료하며 다시 이어지는 구간을 구별하세요.`,
        explanation: `FastAPI는 lifespan context manager에 진입할 때 yield 앞을 실행한 후 요청을 받습니다. 종료 시 yield 뒤 코드가 실행되므로 자원 준비와 해제를 각각 올바른 위치에 두세요.`,
      },
      short: {
        prompt: `앱이 요청을 받기 전에 실행할 lifespan 시작 준비 코드는 yield의 앞과 뒤 중 어디에 두나요?`,
        answers: [`yield 앞`, `yield 이전`],
        hint: `첫 yield에서 앱이 준비된 상태로 요청을 받기 시작합니다.`,
        explanation: `시작 준비는 yield 앞에 둡니다. yield 뒤는 모든 요청 처리가 끝나고 앱이 종료될 때 실행하는 정리 구간입니다.`,
      },
      locate: {
        prompt: `앱 상태를 준비하기 전에 yield하여 요청 수명 구간에 준비 작업을 두지 못한 줄을 찾으세요.`,
        lines: [`@asynccontextmanager`, `async def lifespan(app):`, `    yield`, `    app.state.ready = True`],
        line: 4,
        hint: `yield 이후 코드는 시작 준비가 아니라 앱 종료 때 재개되는 정리 구간입니다.`,
        explanation: `4번 줄은 yield 뒤에 있어 앱이 요청을 처리한 뒤 종료할 때 실행됩니다. 준비 표시는 yield 전에 설정해야 요청 처리 시작 시 사용할 수 있습니다.`,
      },
    },
    {
      intro: `앱 수명 동안 공유하는 설정과 자원은 app.state에 둘 수 있어요. 요청마다 새로 생기는 request.state와는 범위가 다릅니다.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI, Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.catalog = {"courses": 3}
    yield
    app.state.catalog.clear()

app = FastAPI(lifespan=lifespan)

@app.get("/count")
async def read_count(request: Request):
    return {"count": request.app.state.catalog["courses"]}`, 
      choice: {
        prompt: `앱 시작 때 한 번 준비해 여러 요청에서 읽을 공유 catalog를 설정하려면 어느 객체 상태에 저장해야 하나요?`,
        correct: `app.state.catalog`,
        correctFeedback: `app.state는 앱의 lifespan과 함께 관리할 앱 범위 상태입니다. 각 요청의 Request에서 request.app.state로 읽을 수 있어요.`,
        incorrect: [
          { text: `request.state.catalog`, feedback: `request.state는 개별 요청의 상태를 담습니다. 앱 시작 때 만들어 여러 요청이 공유하는 위치가 아닙니다.` },
          { text: `전역 변수에 자원을 만들고 정리하지 않기`, feedback: `모듈 전역 초기화는 테스트나 여러 앱 인스턴스의 수명과 분리하기 어렵고 종료 정리 시점도 명시하지 못합니다.` },
        ],
        hint: `요청마다 생성되는 객체가 아니라 FastAPI 앱 인스턴스 자체가 가진 상태를 선택하세요.`,
        explanation: `lifespan에서 app.state에 공유 자원을 배치하면 요청 함수가 request.app.state로 접근할 수 있습니다. request.state는 특정 요청에만 필요한 값을 위한 공간입니다.`,
      },
      short: {
        prompt: `lifespan에서 앱 범위로 저장해 요청 함수들이 공유할 catalog 상태의 속성 경로를 적으세요.`,
        answers: [`app.state.catalog`],
        hint: `앱 인스턴스의 state 속성 아래에 공유 자원 이름을 둡니다.`,
        explanation: `app.state.catalog는 앱 범위 상태입니다. 요청 함수에서는 Request 객체의 app 속성을 통해 같은 상태를 읽을 수 있어요.`,
      },
      locate: {
        prompt: `앱이 시작할 때 공유 설정을 요청별 상태에 저장하여 이후 요청의 상태 범위와 섞은 줄을 찾으세요.`,
        lines: [`@asynccontextmanager`, `async def lifespan(app):`, `    request.state.catalog = {"courses": 3}`, `    yield`],
        line: 3,
        hint: `lifespan 함수는 앱 시작 때 실행되므로 개별 Request 객체의 상태에 값을 넣는 구조인지 보세요.`,
        explanation: `3번 줄은 lifespan 안에서 request.state를 사용하지만 요청 객체는 이 시작 함수의 인자가 아닙니다. 공유 자원은 app.state.catalog에 보관하고 요청에서 request.app.state로 읽어야 합니다.`,
      },
    },
    {
      intro: `FastAPI(lifespan=...)은 권장되는 앱 시작·종료 연결 방식입니다. lifespan을 제공하면 예전 startup/shutdown event handler를 함께 실행하는 혼합 경로가 되지 않습니다.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI, Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ready = True
    yield
    app.state.ready = False

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health(request: Request):
    return {"ready": request.app.state.ready}`,
      choice: {
        prompt: `lifespan context manager를 만든 뒤 FastAPI 앱 시작·종료에 연결하는 올바른 앱 생성 코드는 무엇인가요?`,
        correct: `FastAPI(lifespan=lifespan)`,
        correctFeedback: `FastAPI 생성자의 lifespan 매개변수에 비동기 context manager 함수를 전달해 앱 수명과 연결합니다.`,
        incorrect: [
          { text: `FastAPI(startup=lifespan)`, feedback: `startup은 FastAPI 생성자의 lifespan 매개변수 이름이 아닙니다. 시작과 종료를 묶는 context manager를 lifespan으로 연결합니다.` },
          { text: `app.include_router(lifespan)`, feedback: `include_router는 APIRouter를 경로 구성에 포함합니다. 앱 시작·종료 함수 연결 용도가 아닙니다.` },
        ],
        hint: `앱의 경로 구성 함수가 아니라 앱 인스턴스 생성 시 수명 주기용으로 받는 매개변수를 사용하세요.`,
        explanation: `FastAPI(lifespan=lifespan)로 연결하면 앱 시작 전에 yield 앞 부분, 앱 종료 뒤에 yield 이후 부분이 실행됩니다. lifespan과 기존 startup/shutdown 이벤트를 동시에 구성하지 마세요.`,
      },
      short: {
        prompt: `lifespan context manager 함수가 lifespan인 경우 앱 인스턴스를 만드는 호출을 적으세요.`,
        answers: [`FastAPI(lifespan=lifespan)`],
        hint: `FastAPI 생성자에 lifespan이라는 이름의 인자로 함수 객체를 전달합니다.`,
        explanation: `FastAPI(lifespan=lifespan)가 context manager를 앱 전체 수명에 연결합니다. 구식 startup/shutdown 이벤트 처리기를 함께 실행한다고 가정하지 마세요.`,
      },
      locate: {
        prompt: `이미 lifespan을 앱에 연결했는데 동시에 사용하면 동작하지 않는 구식 startup 이벤트를 추가한 줄을 찾으세요.`,
        lines: [`app = FastAPI(lifespan=lifespan)`, `@app.on_event("startup")`, `async def initialize_again():`, `    app.state.ready = True`],
        line: 2,
        hint: `lifespan 매개변수가 설정되면 대체되는 이전 이벤트 API가 있는지 보세요.`,
        explanation: `2번 줄은 lifespan을 설정한 앱에 구식 startup event handler를 함께 추가합니다. FastAPI에서 lifespan을 제공하면 startup/shutdown event handler는 호출되지 않으므로 한 방식으로 구성하세요.`,
      },
    },
  ],
  18: [
    {
      intro: `REST 경로는 동작 이름보다 리소스 이름을 중심으로 둡니다. courses 목록은 복수 리소스 경로와 GET 메서드로 조회해요.`,
      example: `from fastapi import FastAPI

app = FastAPI()
courses = [{"id": 1, "title": "Python"}]

@app.get("/courses")
async def list_courses():
    return {"items": courses}`, 
      choice: {
        prompt: `등록된 강의 리소스 목록을 조회하는 REST 경로와 메서드 조합은 무엇인가요? 컬렉션 조회 계약에 맞춰 고르세요.`,
        correct: `GET /courses`,
        correctFeedback: `GET은 리소스를 조회하고 /courses는 컬렉션을 나타내는 경로입니다.`,
        incorrect: [
          { text: `GET /getAllCourses`, feedback: `경로에 동작 이름을 넣기보다 리소스를 나타내고 GET 메서드가 조회 동작을 표현하도록 구성합니다.` },
          { text: `POST /courses/list`, feedback: `POST는 보통 새 리소스 생성을 나타냅니다. 목록 조회를 생성 요청으로 바꾸지 마세요.` },
        ],
        hint: `목록이라는 리소스 경로와 읽기 메서드 GET을 조합하세요.`,
        explanation: `GET /courses는 강의 컬렉션을 읽습니다. 리소스 중심 경로를 사용하면 같은 /courses에서 POST 생성과 동작을 구분할 수 있습니다.`,
      },
      short: {
        prompt: `강의 컬렉션 전체를 읽는 REST 요청의 메서드와 경로를 적으세요. 리소스 이름은 복수형으로 둡니다.`,
        answers: [`GET /courses`],
        hint: `컬렉션 명사 경로에 조회용 HTTP 메서드를 붙입니다.`,
        explanation: `GET /courses가 강의 컬렉션 조회 계약입니다. 동작 이름을 path에 넣지 않고 HTTP 메서드로 동작을 구분합니다.`,
      },
      locate: {
        prompt: `강의 목록을 조회해야 하는데 GET 대신 생성용 메서드를 등록한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `app = FastAPI()`, `@app.post("/courses")`, `async def list_courses():`, `    return {"items": []}`],
        line: 3,
        hint: `목록 조회 계약의 HTTP 메서드가 현재 등록한 decorator와 같은지 비교하세요.`,
        explanation: `3번 줄은 POST /courses를 등록합니다. 목록 조회는 GET /courses로 등록해야 하며 POST는 보통 리소스 생성에 사용합니다.`,
      },
    },
    {
      intro: `컬렉션 안의 하나의 강의는 리소스 식별자를 경로에 둡니다. FastAPI는 중괄호 매개변수를 함수 인자로 검증해 전달해요.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()
courses = {7: {"id": 7, "title": "Python"}}

@app.get("/courses/{course_id}")
async def read_course(course_id: int):
    course = courses.get(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course`,
      choice: {
        prompt: `course_id가 7인 강의 리소스를 path parameter로 조회하는 REST 경로 모양은 무엇인가요?`,
        correct: `GET /courses/{course_id}`, 
        correctFeedback: `컬렉션 아래 리소스를 식별하는 값은 /courses/{course_id}처럼 경로 매개변수로 나타냅니다.`,
        incorrect: [
          { text: `GET /course?id={course_id}`, feedback: `쿼리 매개변수로 필터링할 수도 있지만 이 문제의 리소스 식별 경로 계약은 컬렉션 아래 path parameter입니다.` },
          { text: `GET /courses/course_id`, feedback: `중괄호가 없는 course_id는 고정 문자열 경로일 뿐 요청 값이 들어가는 path parameter가 아닙니다.` },
        ],
        hint: `컬렉션 경로 다음에 실제 식별자가 들어갈 중괄호 매개변수를 놓으세요.`,
        explanation: `GET /courses/{course_id}는 컬렉션 내 단일 강의를 식별합니다. 함수 인자 이름과 경로 매개변수 이름을 일치시켜 값이 전달되게 합니다.`,
      },
      short: {
        prompt: `식별자로 단일 강의를 조회하는 REST 메서드와 path parameter 경로를 적으세요.`,
        answers: [`GET /courses/{course_id}`],
        hint: `courses 컬렉션 아래에 식별자를 담는 중괄호 경로 매개변수를 붙이세요.`,
        explanation: `GET /courses/{course_id}가 한 리소스를 읽는 경로입니다. 중괄호 매개변수의 값은 경로 함수의 course_id 인자로 전달됩니다.`,
      },
      locate: {
        prompt: `단일 강의 식별자를 요청 경로에 넣어야 하는데 고정 문자열로 등록한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `app = FastAPI()`, `@app.get("/courses/course_id")`, `async def read_course(course_id: int):`, `    return {"id": course_id}`],
        line: 3,
        hint: `경로 일부가 요청마다 바뀌어야 한다면 변수 부분이 중괄호로 표시되어야 합니다.`,
        explanation: `3번 줄은 course_id를 고정된 path text로 등록합니다. /courses/{course_id}처럼 중괄호를 사용해야 실제 요청 경로 값이 함수 인자에 연결됩니다.`,
      },
    },
    {
      intro: `새 강의 리소스 생성은 컬렉션 경로에 POST로 요청하고, 생성 성공을 201 Created로 알립니다. 응답 본문에는 생성 결과를 담을 수 있어요.`,
      example: `from fastapi import FastAPI, status
from pydantic import BaseModel

app = FastAPI()

class CourseCreate(BaseModel):
    title: str

@app.post("/courses", status_code=status.HTTP_201_CREATED)
async def create_course(course: CourseCreate):
    return {"title": course.title}`, 
      choice: {
        prompt: `새 강의 리소스를 POST /courses로 만들었을 때 생성 성공을 나타내는 보통의 HTTP 상태 코드는 무엇인가요?`,
        correct: `POST /courses → 201 Created`,
        correctFeedback: `201 Created는 요청으로 새 리소스가 생성되었음을 나타냅니다. FastAPI decorator의 status_code로 문서화할 수 있어요.`,
        incorrect: [
          { text: `GET /courses → 201 Created`, feedback: `GET은 조회 동작입니다. 새 리소스 생성을 표현하려면 POST를 사용합니다.` },
          { text: `DELETE /courses → 200 Created`, feedback: `DELETE는 제거 동작이며 200 Created는 생성 의미와 맞지 않는 조합입니다.` },
        ],
        hint: `요청 메서드는 리소스 생성 동작이고 상태는 성공적인 새 생성 의미를 나타냅니다.`,
        explanation: `POST /courses 요청으로 새 리소스를 만들면 보통 201 Created를 반환합니다. status_code는 경로 함수 인자가 아니라 경로 decorator 설정입니다.`,
      },
      short: {
        prompt: `새 리소스를 만드는 POST /courses 요청의 일반적인 생성 성공 상태 코드를 적으세요.`,
        answers: [`201`, `201 Created`],
        hint: `200 OK와 구별되는 “새로 만들어짐”의 상태 코드입니다.`,
        explanation: `201 Created는 새 리소스가 만들어졌음을 나타냅니다. FastAPI는 @app.post(..., status_code=201)로 상태와 OpenAPI 계약을 함께 선언할 수 있어요.`,
      },
      locate: {
        prompt: `새 강의 생성을 선언하면서 조회에 쓰는 GET decorator를 연결한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `app = FastAPI()`, `@app.get("/courses", status_code=201)`, `async def create_course(payload: dict):`, `    return payload`],
        line: 3,
        hint: `상태가 201이어도 요청 decorator의 HTTP 메서드가 생성 목표와 맞는지 확인하세요.`,
        explanation: `3번 줄은 GET 요청을 등록합니다. 새 리소스 생성은 POST /courses로 표현하고 201 Created 상태를 선언해야 합니다.`,
      },
    },
    {
      intro: `PATCH는 제공된 필드만 바꾸는 부분 수정에 사용할 수 있어요. Pydantic의 model_dump(exclude_unset=True)는 요청에 실제로 포함된 필드만 뽑아냅니다.`,
      example: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
# 학습용 메모리 fixture; 서버 재시작 후에는 보존되지 않습니다.
courses = {7: {"title": "Python", "summary": "기초"}}

class CoursePatch(BaseModel):
    title: str | None = None
    summary: str | None = None

@app.patch("/courses/{course_id}")
async def patch_course(course_id: int, changes: CoursePatch):
    course = courses.get(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    update = changes.model_dump(exclude_unset=True)
    course.update(update)
    return course`,
      choice: {
        prompt: `PATCH 입력에서 보내지 않은 필드는 기존 값을 보존하면서 실제 전송된 값만 추출하려면 어떤 표현을 사용하나요?`,
        correct: `changes.model_dump(exclude_unset=True)`,
        correctFeedback: `exclude_unset=True는 사용자가 생략한 필드의 기본값까지 덮어쓰지 않도록 실제 입력에 포함된 필드만 추출합니다.`,
        incorrect: [
          { text: `changes.model_dump()`, feedback: `기본값이 들어 있는 필드까지 모두 직렬화하면 생략된 PATCH 필드가 기존 값을 덮어쓸 수 있습니다.` },
          { text: `changes.model_dump(exclude_none=True)`, feedback: `exclude_none는 명시적으로 null을 보낸 경우까지 제거해 생략과 null 입력의 차이를 잃게 합니다.` },
        ],
        hint: `기본값이 존재하더라도 클라이언트가 요청에서 보낸 필드만 구별하는 매개변수를 사용하세요.`,
        explanation: `model_dump(exclude_unset=True)는 제공된 필드만 업데이트 자료로 만듭니다. 명시적인 null과 생략을 구별할 수 있으며, 저장 반영 로직은 별도로 적용해야 합니다.`,
      },
      short: {
        prompt: `PATCH 모델에서 클라이언트가 실제로 보낸 필드만 딕셔너리로 얻는 Pydantic v2 호출을 적으세요.`,
        answers: [`model_dump(exclude_unset=True)`, `changes.model_dump(exclude_unset=True)`],
        hint: `Pydantic v2 모델의 dump 메서드에 exclude_unset 옵션을 켭니다.`,
        explanation: `model_dump(exclude_unset=True)는 요청에서 생략된 선택 필드의 기본값을 update 자료에서 빼 줍니다. exclude_none와 달리 명시적인 null 값은 보존합니다.`,
      },
      locate: {
        prompt: `부분 수정 요청에서 생략된 필드의 기본값까지 기존 데이터에 덮어쓸 수 있는 dump 줄을 찾으세요.`,
        lines: [`async def patch_course(course_id: int, changes: CoursePatch):`, `    update = changes.model_dump()`, `    courses[course_id].update(update)`, `    return courses[course_id]`],
        line: 2,
        hint: `PATCH의 부분 수정에서 보내지 않은 필드는 update 딕셔너리에 들어가면 안 됩니다.`,
        explanation: `2번 줄은 생략된 필드의 기본값까지 포함할 수 있습니다. model_dump(exclude_unset=True)로 실제 요청에 포함된 값만 추출해 기존 데이터를 수정하세요.`,
      },
    },
    {
      intro: `삭제 성공 뒤 반환할 본문이 없다면 204 No Content를 사용할 수 있습니다. 이 상태 코드 응답에는 본문을 보내지 않습니다.`,
      example: `from fastapi import FastAPI, status

app = FastAPI()
courses = {7: {"title": "Python"}}

@app.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: int) -> None:
    courses.pop(course_id, None)
    return None`,
      choice: {
        prompt: `삭제 요청이 성공했고 클라이언트에 돌려줄 응답 본문이 없을 때 선택할 HTTP 상태 코드는 무엇인가요?`,
        correct: `204 No Content`,
        correctFeedback: `204는 성공했지만 응답 본문은 없다는 뜻입니다. 삭제 결과 설명을 본문으로 보낼 필요가 없다면 적절합니다.`,
        incorrect: [
          { text: `201 Created`, feedback: `201은 새 리소스 생성 성공을 나타냅니다. 삭제 성공 의미에는 맞지 않습니다.` },
          { text: `422 Unprocessable Entity`, feedback: `422는 입력 검증 실패 응답입니다. 이 문항은 삭제가 성공한 상황이므로 HTTP 의미가 맞지 않습니다.` },
        ],
        hint: `“성공, 돌려줄 본문 없음”을 뜻하는 2xx 상태 코드 이름을 떠올리세요.`,
        explanation: `204 No Content는 요청 성공과 빈 본문을 함께 뜻합니다. 이 상태를 선언한 경로 함수는 JSON 성공 메시지를 반환하지 않아야 합니다.`,
      },
      short: {
        prompt: `본문 없이 삭제 성공을 나타낼 수 있는 HTTP 상태 코드를 숫자와 이름으로 적으세요.`,
        answers: [`204 No Content`, `204`],
        hint: `생성 상태 201과 다른, 응답 본문이 없다는 성공 코드입니다.`,
        explanation: `204 No Content는 성공 응답 본문이 없는 상태입니다. 응답 모델이나 반환 본문을 함께 선언하지 않도록 API 계약을 확인하세요.`,
      },
      locate: {
        prompt: `204 No Content 응답 계약을 선언한 삭제 함수에서 JSON 본문을 반환하게 만드는 줄을 찾으세요.`,
        lines: [`@app.delete("/courses/{course_id}", status_code=204)`, `async def delete_course(course_id: int):`, `    courses.pop(course_id, None)`, `    return {"deleted": True}`],
        line: 4,
        hint: `204 상태와 JSON 본문 반환이 서로 함께 성립할 수 있는지 살펴보세요.`,
        explanation: `4번 줄은 JSON 객체를 본문으로 반환하지만 204는 본문이 없는 응답입니다. 삭제 결과 본문이 불필요하면 반환하지 않고 상태 계약을 맞추세요.`,
      },
    },
  ],
  19: [
    {
      intro: `HTTPBearer는 Authorization 헤더에서 Bearer 자격 정보를 읽는 보안 도구예요. 토큰의 발급자·서명·사용자를 검증하는 기능과는 분리합니다.`,
      example: `from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
bearer = HTTPBearer()

@app.get("/profile")
async def profile(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    return {"scheme": credentials.scheme}`, 
      choice: {
        prompt: `Authorization 헤더의 Bearer 자격 정보를 FastAPI dependency로 읽을 때 사용해야 하는 보안 클래스를 고르세요.`,
        correct: `from fastapi.security import HTTPBearer`,
        correctFeedback: `HTTPBearer는 Bearer 인증 scheme을 읽는 FastAPI 보안 dependency입니다. 토큰의 서명이나 사용자 권한을 대신 검증하지는 않습니다.`,
        incorrect: [
          { text: `from fastapi import HTTPBearer`, feedback: `HTTPBearer는 fastapi 최상위 이름이 아니라 fastapi.security 모듈에서 가져오는 보안 유틸리티입니다.` },
          { text: `from fastapi.security import BearerHeader`, feedback: `이 모듈에는 BearerHeader라는 공개 클래스가 없습니다. 현재 코드에서 사용하는 도구는 HTTPBearer입니다.` },
        ],
        hint: `HTTP authentication의 bearer scheme 도구가 있는 FastAPI 모듈 경로를 찾으세요.`,
        explanation: `HTTPBearer는 fastapi.security에서 가져옵니다. 헤더에서 scheme과 credential을 전달하는 역할이며 실제 토큰 발급·서명·만료 검증은 별도로 구현해야 합니다.`,
      },
      short: {
        prompt: `FastAPI에서 HTTP Bearer 자격 증명을 읽는 클래스를 가져오는 import 문을 적으세요.`,
        answers: [`from fastapi.security import HTTPBearer`],
        hint: `모듈은 fastapi.security이고 클래스 이름은 HTTPBearer입니다.`,
        explanation: `from fastapi.security import HTTPBearer로 가져옵니다. 이 도구는 자격 정보를 전달할 뿐 실제 사용자 확인과 토큰 검증을 완료하지 않습니다.`,
      },
      locate: {
        prompt: `HTTPBearer 보안 클래스를 가져오려는 코드에서 잘못된 모듈 경로를 사용한 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `from fastapi import HTTPBearer`, `app = FastAPI()`],
        line: 2,
        hint: `FastAPI 보안 유틸리티가 정의된 하위 모듈 경로인지 확인하세요.`,
        explanation: `2번 줄은 FastAPI 최상위에서 HTTPBearer를 가져옵니다. from fastapi.security import HTTPBearer를 사용해야 합니다.`,
      },
    },
    {
      intro: `HTTPBearer()를 만들면 기본적으로 자격 정보가 없는 요청을 인증되지 않은 요청으로 처리합니다. 선택적 인증이면 auto_error 동작을 바꿀 수 있어요.`,
      example: `from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
optional_bearer = HTTPBearer(auto_error=False)

@app.get("/preview")
async def preview(credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer)):
    return {"has_credentials": credentials is not None}`, 
      choice: {
        prompt: `자격 정보가 없어도 요청을 경로 함수까지 전달하고 credentials를 None으로 확인하려면 어떤 HTTPBearer 옵션을 써야 하나요?`,
        correct: `HTTPBearer(auto_error=False)`,
        correctFeedback: `auto_error=False는 자격 정보가 없을 때 보안 dependency가 즉시 오류를 내는 기본 동작 대신 None을 반환하게 합니다.`,
        incorrect: [
          { text: `HTTPBearer(auto_error=True)`, feedback: `기본 동작처럼 자격 정보가 없을 때 dependency가 오류로 끝나므로 선택적 인증 경로에 맞지 않습니다.` },
          { text: `Depends(HTTPBearer())`, feedback: `이 호출은 기본 auto_error 동작을 유지하므로 누락된 자격 정보가 경로 함수에 None으로 전달된다고 보장하지 않습니다.` },
        ],
        hint: `선택적 자격 정보를 받으려면 누락 시 자동 오류를 내는 옵션을 비활성화하세요.`,
        explanation: `HTTPBearer(auto_error=False)는 자격 정보가 없을 때 None을 반환할 수 있어 선택적 인증을 구성합니다. 값이 존재하더라도 그 자체로 인증 성공을 의미하지는 않아요.`,
      },
      short: {
        prompt: `Bearer 정보가 빠졌을 때 즉시 오류를 내지 않고 선택적으로 처리하도록 만드는 HTTPBearer 설정을 적으세요.`,
        answers: [`HTTPBearer(auto_error=False)`],
        hint: `누락 자격 정보에서 자동으로 예외를 일으키는 동작을 끄는 인자입니다.`,
        explanation: `HTTPBearer(auto_error=False)는 자격 정보가 없을 때 None을 반환해 선택적 처리가 가능하게 합니다. 이후 경로가 허용되는지는 애플리케이션 정책으로 결정해야 합니다.`,
      },
      locate: {
        prompt: `Bearer 자격 정보를 선택적으로 받으려는데 누락 요청에서 자동 오류를 유지하는 설정 줄을 찾으세요.`,
        lines: [`from fastapi.security import HTTPBearer`, `optional_bearer = HTTPBearer(auto_error=True)`, `@app.get("/preview")`, `async def preview(credentials=Depends(optional_bearer)):`, `    return {"has_credentials": credentials is not None}`],
        line: 2,
        hint: `auto_error가 켜져 있으면 자격 정보가 없을 때 경로 함수까지 넘어오는지 생각해 보세요.`,
        explanation: `2번 줄의 auto_error=True는 자격 정보가 없으면 dependency가 오류를 냅니다. 선택적 인증 경로에는 HTTPBearer(auto_error=False)를 사용하세요.`,
      },
    },
    {
      intro: `보안 객체를 함수에서 직접 호출하지 말고 Depends에 객체를 전달해요. FastAPI가 요청 헤더를 분석해 결과를 매개변수에 주입합니다.`,
      example: `from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
bearer_scheme = HTTPBearer()

@app.get("/account")
async def read_account(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return {"scheme": credentials.scheme, "received": bool(credentials.credentials)}`, 
      choice: {
        prompt: `HTTPBearer 객체 bearer_scheme을 경로 매개변수에 FastAPI dependency로 연결하는 올바른 표현은 무엇인가요?`,
        correct: `Depends(bearer_scheme)`,
        correctFeedback: `Depends에 callable 보안 객체를 전달하면 FastAPI가 요청에서 자격 정보를 읽고 그 결과를 매개변수에 주입합니다.`,
        incorrect: [
          { text: `Depends(bearer_scheme())`, feedback: `먼저 객체를 직접 호출해 버립니다. Depends에는 보안 객체 자체를 전달해야 요청 분석이 dependency graph에서 처리됩니다.` },
          { text: `Header(bearer_scheme)`, feedback: `Header는 요청 헤더 값을 읽지만 HTTP Bearer scheme 파싱을 수행하는 보안 dependency를 대신하지 않습니다.` },
        ],
        hint: `요청 처리 시 FastAPI가 호출해야 할 객체를 Depends 인자로 넘기고 미리 실행하지 마세요.`,
        explanation: `Depends(bearer_scheme)는 보안 객체 자체를 dependency graph에 등록합니다. FastAPI가 각 요청의 Authorization 헤더에서 자격 정보를 추출해 credentials 인자로 전달합니다.`,
      },
      short: {
        prompt: `이미 만든 bearer_scheme 보안 객체를 함수 매개변수에서 dependency로 주입받는 표현을 적으세요.`,
        answers: [`Depends(bearer_scheme)`],
        hint: `객체를 직접 실행하지 않고 Depends 괄호 안에 전달합니다.`,
        explanation: `Depends(bearer_scheme)가 FastAPI에게 요청을 분석하고 결과를 주입하도록 합니다. bearer_scheme()를 미리 직접 호출하면 이 흐름이 달라집니다.`,
      },
      locate: {
        prompt: `보안 객체를 dependency로 등록하기 전에 직접 실행해 요청별 헤더 주입을 깨뜨린 줄을 찾으세요.`,
        lines: [`bearer_scheme = HTTPBearer()`, `@app.get("/account")`, `async def read_account(credentials=Depends(bearer_scheme())):`, `    return {"received": True}`],
        line: 3,
        hint: `Depends가 받아야 하는 값이 요청에서 실행될 callable인지 이미 실행된 결과인지 살펴보세요.`,
        explanation: `3번 줄은 bearer_scheme()를 먼저 호출한 뒤 그 결과를 Depends에 넣습니다. 보안 객체 자체를 Depends(bearer_scheme)로 전달해야 FastAPI가 요청별 처리를 수행합니다.`,
      },
    },
    {
      intro: `HTTPAuthorizationCredentials는 헤더의 scheme과 credential을 나눠 제공합니다. scheme 이름과 토큰 문자열은 서로 다른 필드예요.`,
      example: `from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
bearer_scheme = HTTPBearer()

@app.get("/session-info")
async def session_info(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return {"scheme": credentials.scheme, "token_present": bool(credentials.credentials)}`, 
      choice: {
        prompt: `Authorization 헤더에서 Bearer scheme 이름만 읽을 때 HTTPAuthorizationCredentials의 어떤 필드를 사용하나요?`,
        correct: `credentials.scheme`,
        correctFeedback: `scheme에는 Bearer와 같은 인증 방식 이름이 들어가고 credential 문자열은 별도의 credentials 필드에 들어갑니다.`,
        incorrect: [
          { text: `credentials.authorization`, feedback: `HTTPAuthorizationCredentials에는 authorization이라는 속성이 없습니다. scheme과 credentials 속성으로 나뉩니다.` },
          { text: `credentials.header`, feedback: `헤더 전체를 보관하는 header 속성은 없습니다. 파싱된 인증 방식 이름에는 scheme을 사용합니다.` },
        ],
        hint: `속성 이름이 복수형 credentials인 토큰 값과 인증 방식 이름 scheme을 구별하세요.`,
        explanation: `credentials.scheme은 Bearer 같은 방식을 담고 credentials.credentials는 헤더에서 읽은 자격 정보 값을 담습니다. 토큰 원문을 불필요하게 응답에 포함하지 마세요.`,
      },
      short: {
        prompt: `인증 방식 이름이 Bearer인지 확인할 HTTPAuthorizationCredentials 필드 접근을 적으세요.`,
        answers: [`credentials.scheme`],
        hint: `자격 문자열 자체가 아니라 인증 scheme을 나타내는 단일 필드입니다.`,
        explanation: `credentials.scheme으로 Bearer 같은 인증 방식 이름을 읽습니다. 실제 값은 credentials.credentials에 있지만 민감 정보이므로 응답이나 로그에 무심코 출력하지 않습니다.`,
      },
      locate: {
        prompt: `인증 방식 이름을 읽으려는데 존재하지 않는 HTTPAuthorizationCredentials 속성을 참조한 줄을 찾으세요.`,
        lines: [`async def session_info(credentials: HTTPAuthorizationCredentials):`, `    return {"scheme": credentials.authorization}`],
        line: 2,
        hint: `이 객체가 제공하는 분리된 두 필드의 실제 이름을 확인하세요.`,
        explanation: `2번 줄의 authorization은 이 객체에 없는 속성입니다. 인증 방식 이름은 credentials.scheme으로 읽습니다.`,
      },
    },
    {
      intro: `HTTPBearer로 문자열을 받았다는 사실은 토큰을 인증했다는 뜻이 아니에요. 서명·만료·발급자·사용자·권한을 검증하는 별도 단계가 필요합니다.`,
      example: `from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
bearer_scheme = HTTPBearer()

@app.get("/demo-token-status")
async def token_status(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return {"scheme": credentials.scheme, "token_received": bool(credentials.credentials)}`, 
      choice: {
        prompt: `HTTPBearer dependency가 자격 문자열을 반환한 뒤 실제 사용자를 인증하려면 무엇을 추가로 확인해야 하나요?`,
        correct: `토큰 서명·만료·발급자와 사용자 및 접근 권한`,
        correctFeedback: `헤더 파싱만으로는 토큰의 신뢰성이나 사용자 신원을 증명하지 않으므로 실제 검증 정책이 필요합니다.`,
        incorrect: [
          { text: `문자열이 비어 있지 않다는 사실만 확인`, feedback: `임의의 문자열도 비어 있지 않을 수 있습니다. 값이 존재한다는 사실만으로 서명이나 만료를 검증할 수 없습니다.` },
          { text: `OpenAPI 문서에 자물쇠 아이콘이 표시되는지 확인`, feedback: `문서에 인증 방식이 표시되는 것은 실제 요청 자격을 검증하거나 권한을 부여했다는 증거가 아닙니다.` },
        ],
        hint: `헤더를 파싱하는 기능과 토큰이 믿을 수 있고 해당 사용자에게 권한이 있는지 확인하는 기능을 구별하세요.`,
        explanation: `HTTPBearer는 Bearer scheme과 문자열을 추출할 뿐입니다. 안전한 인증은 서명과 만료 및 발급자 등의 조건을 확인하고, 인가 단계에서 리소스 권한을 확인해야 합니다.`,
      },
      short: {
        prompt: `Bearer 헤더 추출만으로 인증을 완료했다고 할 수 없는 이유를 검증해야 할 항목을 들어 적으세요.`,
        answers: [`토큰 서명·만료와 사용자 권한을 검증해야 함`, `서명과 만료 및 권한을 확인해야 함`],
        hint: `헤더 파싱 뒤 토큰의 진위·유효기간·주체 권한을 확인해야 합니다.`,
        explanation: `HTTPBearer는 자격 문자열을 추출하는 도구일 뿐입니다. 토큰 서명·만료·발급자와 실제 사용자 및 리소스 권한 검증이 있어야 인증·인가 결정을 내릴 수 있어요.`,
      },
      locate: {
        prompt: `헤더에서 임의의 문자열을 받았다는 이유만으로 신뢰된 사용자 인증을 완료했다고 선언하는 줄을 찾으세요.`,
        lines: [`async def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):`, `    if credentials.credentials:`, `        return {"authenticated": True}`, `    raise HTTPException(status_code=401)`],
        line: 3,
        hint: `자격 값의 존재만 검사했는지, 토큰 유효성과 사용자를 검증했는지 살펴보세요.`,
        explanation: `3번 줄은 문자열이 존재한다는 사실만으로 인증 성공을 선언합니다. 서명·만료·발급자와 사용자 정보 및 권한 검증 없이 토큰을 신뢰하면 안 됩니다.`,
      },
    },
  ],
  20: [
    {
      intro: `인증 자격이 없거나 유효하지 않아 요청 주체를 확인할 수 없다면 401을 반환하고, Bearer 방식의 WWW-Authenticate challenge를 보냅니다.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()

async def require_user(token: str | None):
    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"id": 7}`, 
      choice: {
        prompt: `Bearer 자격 정보가 없어서 요청 사용자를 인증할 수 없는 경우 알맞은 상태와 challenge 응답 계약은 무엇인가요?`,
        correct: `401 Unauthorized와 WWW-Authenticate: Bearer`,
        correctFeedback: `401은 유효한 인증 자격이 없음을 나타내며 HTTP challenge를 알려 주는 WWW-Authenticate 헤더를 포함합니다.`,
        incorrect: [
          { text: `403 Forbidden과 관리자 역할 요구`, feedback: `403은 요청을 이해했지만 거부할 때 사용합니다. 이 사례에서는 인증 자격이 없어 Bearer 인증을 요청해야 합니다.` },
          { text: `404 Not Found로 응답`, feedback: `404는 요청한 리소스를 찾지 못한 상태입니다. 인증 정보 부재를 표현하는 응답이 아닙니다.` },
        ],
        hint: `주체 확인이 되지 않은 인증 실패와 확인된 사용자의 권한 거부를 구분하고 challenge 헤더도 확인하세요.`,
        explanation: `인증 자격이 없거나 유효하지 않으면 401 Unauthorized를 사용하고 Bearer 방식이면 WWW-Authenticate: Bearer를 포함해야 합니다. 권한만 부족한 403과 구별합니다.`,
      },
      short: {
        prompt: `Bearer 인증 자격이 없어 사용자를 확인하지 못할 때 상태 코드와 challenge 헤더를 함께 적으세요.`,
        answers: [`401 + WWW-Authenticate: Bearer`, `401 Unauthorized + WWW-Authenticate: Bearer`],
        hint: `인증 challenge를 나타내는 응답 헤더 이름은 WWW-Authenticate입니다.`,
        explanation: `401 Unauthorized는 인증 정보를 요구하는 상태입니다. Bearer 인증에서는 WWW-Authenticate: Bearer를 함께 보내 클라이언트가 사용할 scheme을 알립니다.`,
      },
      locate: {
        prompt: `인증되지 않은 요청을 권한 거부로 잘못 분류해 challenge 응답을 제공하지 않는 줄을 찾으세요.`,
        lines: [`if token is None:`, `    raise HTTPException(status_code=403, detail="Forbidden")`],
        line: 2,
        hint: `권한 이전에 요청 주체를 확인할 자격 정보 자체가 없습니다.`,
        explanation: `2번 줄은 인증되지 않은 요청을 403으로 표시합니다. 자격 정보가 없거나 유효하지 않은 경우에는 401과 적절한 WWW-Authenticate challenge를 사용합니다.`,
      },
    },
    {
      intro: `사용자가 인증됐지만 해당 동작이나 리소스 권한이 없다면 403으로 거부해요. 로그인 여부만으로 필요한 권한이 생기지는 않습니다.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()

async def require_editor(user: dict):
    if "editor" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user`, 
      choice: {
        prompt: `요청 사용자는 인증됐지만 코스 편집 권한이 없어 변경 요청을 거부할 때 선택할 상태 코드는 무엇인가요?`,
        correct: `403 Forbidden`,
        correctFeedback: `403은 서버가 요청을 이해했지만 거부할 때 사용하며, 이 사례처럼 인증된 사용자에게 편집 권한이 없는 경우에도 적절합니다.`,
        incorrect: [
          { text: `401 Unauthorized`, feedback: `401은 유효한 인증 자격이 없거나 주체를 확인할 수 없는 상황을 나타냅니다. 여기서는 사용자가 이미 인증됐습니다.` },
          { text: `201 Created`, feedback: `201은 새 리소스 생성 성공 상태입니다. 권한이 없는 편집 요청을 성공으로 표시하면 안 됩니다.` },
        ],
        hint: `요청 주체는 확인됐고, 지금 확인해야 하는 것은 수행하려는 동작의 권한입니다.`,
        explanation: `인증된 사용자의 역할이나 리소스 소유권이 허용되지 않으면 403 Forbidden으로 거부합니다. 401 인증 실패와 생성 성공 201을 섞지 마세요.`,
      },
      short: {
        prompt: `주체 인증은 끝났지만 코스 편집 권한이 없어서 서버가 요청을 거부할 때의 상태 코드를 적으세요.`,
        answers: [`403 Forbidden`, `403`],
        hint: `401 인증 실패가 아니라 확인된 사용자의 권한이 부족한 사례입니다.`,
        explanation: `403 Forbidden은 서버가 요청을 이해했지만 거부했음을 뜻합니다. 이 사례에서는 인증된 사용자에게 편집 권한이 없어 403으로 응답합니다.`,
      },
      locate: {
        prompt: `인증된 편집 권한 없는 사용자의 권한 거부를 인증 실패 상태로 혼동한 줄을 찾으세요.`,
        lines: [`if "editor" not in user["roles"]:`, `    raise HTTPException(status_code=401, detail="Authentication required")`],
        line: 2,
        hint: `이미 사용자 정보를 확인했으므로 인증 부재 대신 권한 거부를 선택해야 합니다.`,
        explanation: `2번 줄은 확인된 사용자의 편집 권한 거부를 401로 표현합니다. 인증은 성공했으나 필요한 역할이 없으므로 403 Forbidden이 적절합니다.`,
      },
    },
    {
      intro: `현재 사용자 정보를 재사용하려면 경로에서 의존성 callable을 Depends에 전달합니다. 이를 직접 호출하면 FastAPI가 요청 인증 그래프를 해석하지 않습니다.`,
      example: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_current_user():
    return {"id": 7, "roles": ["reader"]}  # 학습용 사용자 fixture

@app.get("/me")
async def read_me(user: dict = Depends(get_current_user)):
    return {"user_id": user["id"]}`, 
      choice: {
        prompt: `FastAPI가 get_current_user 의존성을 요청 흐름에서 처리해 반환 사용자를 함수에 넣도록 하는 선언은 무엇인가요?`,
        correct: `user = Depends(get_current_user)`,
        correctFeedback: `Depends에 함수 자체를 전달하면 FastAPI가 의존성으로 실행하고 반환한 사용자 정보를 주입합니다.`,
        incorrect: [
          { text: `user = get_current_user()`, feedback: `경로가 등록될 때 함수를 직접 호출하게 되어 요청마다 dependency graph에서 실행되는 구조가 아닙니다.` },
          { text: `user = Query(get_current_user)`, feedback: `Query는 요청 쿼리 매개변수 메타데이터입니다. 사용자 조회 함수를 dependency로 등록하는 용도가 아닙니다.` },
        ],
        hint: `공통 사용자 확인 callable을 URL 입력값이 아니라 FastAPI dependency로 선언하세요.`,
        explanation: `user = Depends(get_current_user)는 FastAPI가 요청 의존성 흐름에서 함수를 호출하도록 합니다. 직접 괄호를 붙여 호출하면 사용자 인증 의존성의 요청 범위와 override 경로를 잃습니다.`,
      },
      short: {
        prompt: `경로 작업이 get_current_user의 반환 사용자 정보를 FastAPI를 통해 주입받는 매개변수 기본값을 적으세요.`,
        answers: [`Depends(get_current_user)`],
        hint: `FastAPI가 요청 처리 중 실행해야 할 callable을 함수 자체로 전달합니다.`,
        explanation: `Depends(get_current_user)는 사용자 확인을 dependency로 연결합니다. get_current_user()를 직접 호출하지 않아야 FastAPI가 의존성 그래프를 통해 요청마다 값을 주입합니다.`,
      },
      locate: {
        prompt: `사용자 확인 의존성을 요청 흐름에 등록하지 않고 경로 함수 정의 시 직접 호출하는 줄을 찾으세요.`,
        lines: [`@app.get("/me")`, `async def read_me(user: dict = get_current_user()):`, `    return {"user_id": user["id"]}`],
        line: 2,
        hint: `의존성 callable을 직접 실행하는지 Depends 안에 함수 객체로 넘기는지 확인하세요.`,
        explanation: `2번 줄은 함수 기본값에서 get_current_user()를 직접 실행합니다. Depends(get_current_user)를 사용해 FastAPI가 요청 때 의존성을 처리하고 결과를 주입하도록 해야 합니다.`,
      },
    },
    {
      intro: `인증된 사용자가 특정 강의의 소유자인지 비교해 리소스 권한을 확인해요. 객체 값을 대입하거나 확인 없이 반환하면 인가가 무력화됩니다.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()
course = {"owner_id": 7, "title": "Python"}

async def read_owned_course(user: dict):
    if course["owner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return course`, 
      choice: {
        prompt: `course의 owner_id가 현재 인증된 user의 id와 다른지 판단하는 비교 연산은 무엇인가요?`,
        correct: `course["owner_id"] != user["id"]`,
        correctFeedback: `소유자 식별자를 사용자 식별자와 비교해야 요청 주체가 해당 리소스의 소유자인지 판단할 수 있습니다.`,
        incorrect: [
          { text: `course["owner_id"] = user["id"]`, feedback: `등호 하나는 비교가 아니라 리소스의 소유자를 현재 사용자로 바꾸는 대입입니다. 권한 검사가 아닙니다.` },
          { text: `user["id"] == 7`, feedback: `특정한 사용자 번호를 상수로 검사합니다. 리소스마다 저장된 실제 owner_id와 비교해야 합니다.` },
        ],
        hint: `리소스의 owner_id와 현재 사용자의 id를 변경하지 말고 불일치 여부를 비교하세요.`,
        explanation: `course["owner_id"] != user["id"]는 소유자가 다른지 확인합니다. 불일치할 때 403을 내고, 값 대입이나 하드코딩한 사용자 ID로 검사하지 않습니다.`,
      },
      short: {
        prompt: `강의 소유자와 현재 사용자가 다를 때 권한을 거부하도록 하는 불일치 비교식을 적으세요.`,
        answers: [`course["owner_id"] != user["id"]`],
        hint: `두 식별자를 대입하지 말고 다름을 나타내는 비교 연산자로 확인합니다.`,
        explanation: `course["owner_id"] != user["id"]가 다른 사용자의 리소스인지 비교합니다. 조건이 참이면 403을 반환해 소유자만 접근하게 할 수 있습니다.`,
      },
      locate: {
        prompt: `소유권을 비교해야 하는데 요청 사용자를 리소스 소유자로 덮어써 검사 결과를 바꾼 줄을 찾으세요.`,
        lines: [`if course["owner_id"] != user["id"]:`, `    course["owner_id"] = user["id"]`, `return course`],
        line: 2,
        hint: `권한 검사는 리소스 데이터 값을 바꾸는 대신 두 소유자 식별자를 비교해야 합니다.`,
        explanation: `2번 줄은 소유자를 요청자로 변경하는 대입입니다. 원래 소유권과 사용자 ID가 일치하는지 비교하고 불일치하면 403으로 거부해야 합니다.`,
      },
    },
    {
      intro: `최소 권한 원칙은 작업에 필요한 역할만 허용하는 것입니다. 로그인한 모든 사용자에게 관리자 권한을 주는 것은 인증과 인가를 무너뜨려요.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()

async def require_course_write(user: dict):
    allowed_actions = set(user["permissions"])
    if "course:write" not in allowed_actions:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user`,
      choice: {
        prompt: `강의 수정 기능을 안전하게 열기 위해 적용해야 하는 최소 권한 원칙은 무엇인가요? 역할 검사 기준을 고르세요.`,
        correct: `요청 기능에 필요한 편집 권한만 허용`,
        correctFeedback: `기능에 필요한 권한만 부여하면 하나의 로그인으로 불필요한 관리자 기능까지 접근하는 것을 막습니다.`,
        incorrect: [
          { text: `로그인한 모든 사용자에게 관리자 역할 부여`, feedback: `인증 여부만으로 관리자 권한을 주면 일반 사용자와 운영자 권한 경계가 사라집니다.` },
          { text: `역할 이름을 응답 메시지와 URL에 그대로 노출`, feedback: `역할 정보를 노출하는 것은 권한 검사가 아닙니다. 실제 요청에서 해당 권한이 있는지 확인해야 합니다.` },
        ],
        hint: `사용자가 로그인했는지가 아니라 이 특정 기능을 수행하는 데 필요한 권한만 허용하세요.`,
        explanation: `편집 기능에는 편집 권한만 확인합니다. 로그인 사용자를 모두 관리자처럼 취급하거나 역할 이름을 노출하는 것은 최소 권한 검사와 다릅니다.`,
      },
      short: {
        prompt: `강의 편집에 필요한 권한만 주고 불필요한 관리자 권한을 제한하는 접근 제어 원칙을 적으세요.`,
        answers: [`최소 권한 원칙`, `필요한 권한만 허용`],
        hint: `각 사용자와 기능에 업무 수행에 필요한 범위만 부여하는 원칙입니다.`,
        explanation: `최소 권한 원칙에 따라 편집 기능에는 편집 권한만 허용합니다. 로그인 여부만으로 관리자 권한을 부여하지 말고 리소스별 접근을 검사합니다.`,
      },
      locate: {
        prompt: `강의를 수정할 권한을 확인하는 대신 로그인 사용자 모두에게 운영자 역할을 부여하는 줄을 찾으세요.`,
        lines: [`async def require_editor(user: dict):`, `    if user["id"]:`, `        user["roles"] = ["admin"]`, `    return user`],
        line: 3,
        hint: `사용자 역할을 검사해야 할 시점에 높은 권한을 직접 할당하고 있지 않은지 보세요.`,
        explanation: `3번 줄은 권한을 검증하지 않고 모든 요청 사용자에게 admin을 부여합니다. 요구 기능에 필요한 편집 역할이 있는지 확인하고 없으면 403으로 거부해야 합니다.`,
      },
    },
  ],
  21: [
    {
      intro: `FastAPI TestClient는 ASGI 앱에 동기식 테스트 요청을 보내는 도구입니다. 프로젝트의 테스트 환경에서 fastapi.testclient 모듈로 가져옵니다.`,
      example: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

client = TestClient(app)`, 
      choice: {
        prompt: `FastAPI 앱에 동기식 HTTP 테스트 요청을 보내는 TestClient의 올바른 import 경로는 무엇인가요?`,
        correct: `from fastapi.testclient import TestClient`,
        correctFeedback: `FastAPI는 Starlette TestClient를 fastapi.testclient에서 사용할 수 있도록 노출합니다.`,
        incorrect: [
          { text: `from fastapi import TestClient`, feedback: `TestClient는 FastAPI 최상위 모듈에서 직접 가져오는 클래스가 아니라 fastapi.testclient 경로에 있습니다.` },
          { text: `from fastapi.testing import TestClient`, feedback: `FastAPI에는 이 이름의 testing 하위 모듈이 없습니다. 테스트 클라이언트 모듈 경로를 구별하세요.` },
        ],
        hint: `테스트를 위한 HTTP client는 앱 생성자 자체가 아니라 FastAPI의 testclient 하위 모듈에 있습니다.`,
        explanation: `from fastapi.testclient import TestClient로 가져옵니다. TestClient는 테스트 설정에서 사용하며, 설치된 테스트 의존성과 실제 앱 구동 범위는 별도로 확인해야 합니다.`,
      },
      short: {
        prompt: `FastAPI의 TestClient를 가져올 때 사용해야 하는 전체 import 문을 적으세요.`,
        answers: [`from fastapi.testclient import TestClient`],
        hint: `모듈 경로 끝은 testclient이고 가져오는 클래스는 TestClient입니다.`,
        explanation: `from fastapi.testclient import TestClient가 올바른 import입니다. FastAPI 문서의 테스트 예제를 앱 런타임이 실행했다고 오해하지 않도록 테스트 환경을 분리합니다.`,
      },
      locate: {
        prompt: `FastAPI 테스트 클라이언트를 가져오려는 코드에서 최상위 모듈로 잘못 지정한 import 줄을 찾으세요.`,
        lines: [`from fastapi import FastAPI`, `from fastapi import TestClient`, `app = FastAPI()`],
        line: 2,
        hint: `테스트 클라이언트가 공개된 모듈 경로를 확인하세요.`,
        explanation: `2번 줄은 TestClient를 FastAPI 최상위에서 가져옵니다. 올바른 위치는 fastapi.testclient입니다.`,
      },
    },
    {
      intro: `TestClient 생성자는 테스트할 FastAPI 앱 객체를 받습니다. 문자열 앱 이름이나 URL이 아니라 ASGI 애플리케이션 자체를 전달해요.`,
      example: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/courses")
async def list_courses():
    return {"items": ["Python"]}

client = TestClient(app)
response = client.get("/courses")`, 
      choice: {
        prompt: `이미 만든 FastAPI 앱 객체 app으로 로컬 동기 테스트 클라이언트를 생성하는 코드는 무엇인가요?`,
        correct: `TestClient(app)`,
        correctFeedback: `TestClient에는 요청 대상인 FastAPI ASGI 앱 객체를 전달합니다.`,
        incorrect: [
          { text: `TestClient("app")`, feedback: `문자열 이름은 실행할 ASGI 애플리케이션 객체가 아닙니다. 실제 app 변수의 값을 넘겨야 합니다.` },
          { text: `TestClient("http://localhost:8000")`, feedback: `이 도구는 테스트 서버 URL만 받는 원격 HTTP 클라이언트가 아니라 앱 객체를 직접 호출하는 테스트 도구입니다.` },
        ],
        hint: `생성자에는 실제 경로 함수가 등록된 FastAPI 인스턴스를 전달하세요.`,
        explanation: `TestClient(app)은 인메모리에서 테스트할 앱 객체를 연결합니다. 문자열 이름 또는 배포 주소를 전달해 외부 서버 접속을 시작하는 방식이 아닙니다.`,
      },
      short: {
        prompt: `FastAPI 애플리케이션 객체 app으로 테스트 클라이언트를 만드는 호출을 적으세요.`,
        answers: [`TestClient(app)`],
        hint: `TestClient의 괄호 안에 앱 인스턴스 변수를 전달합니다.`,
        explanation: `TestClient(app)은 ASGI 앱을 대상으로 테스트 요청을 보낼 클라이언트를 구성합니다. 별도 URL이 아니라 FastAPI 인스턴스를 넘깁니다.`,
      },
      locate: {
        prompt: `테스트 앱 객체를 전달해야 하는데 문자열을 넣어 클라이언트 대상을 잘못 연결한 줄을 찾으세요.`,
        lines: [`app = FastAPI()`, `client = TestClient("app")`, `response = client.get("/courses")`],
        line: 2,
        hint: `따옴표 안의 글자가 아니라 위에서 만든 앱 변수를 전달해야 합니다.`,
        explanation: `2번 줄은 앱 변수 대신 문자열 "app"을 전달합니다. TestClient(app)처럼 실제 FastAPI 인스턴스를 넘겨야 테스트 요청이 해당 앱으로 전달됩니다.`,
      },
    },
    {
      intro: `lifespan 시작·종료 로직까지 시험할 때는 TestClient를 with 문으로 사용합니다. client 생명주기 안에서 앱이 시작되고 블록 종료 때 정리됩니다.`,
      example: `from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.testclient import TestClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ready = True
    yield
    app.state.ready = False

app = FastAPI(lifespan=lifespan)

def test_lifespan():
    with TestClient(app) as client:
        assert app.state.ready is True
    assert app.state.ready is False`, 
      choice: {
        prompt: `FastAPI lifespan의 시작과 종료 동작을 TestClient에서 실행하려면 클라이언트를 어떤 형태로 사용해야 하나요?`,
        correct: `with TestClient(app) as client:`,
        correctFeedback: `TestClient를 context manager로 사용하면 블록 진입·종료에 앱 lifespan 시작과 정리가 연결됩니다.`,
        incorrect: [
          { text: `client = TestClient(app)만 만들어 lifespan 실행을 가정`, feedback: `객체 생성만으로 lifespan이 항상 실행된다고 가정하면 안 됩니다. 시작·종료 테스트는 context manager를 사용합니다.` },
          { text: `with app.router.routes as client:`, feedback: `라우트 목록은 HTTP 테스트 클라이언트가 아니며 앱의 lifespan 수명도 관리하지 않습니다.` },
        ],
        hint: `TestClient 자체를 Python context manager 구문으로 감싸 블록 시작과 종료를 관리하세요.`,
        explanation: `with TestClient(app) as client:는 앱의 lifespan을 진입·종료합니다. 일반 요청 결과만 확인하는 테스트와 앱 시작·정리 자원까지 확인하는 테스트를 구별하세요.`,
      },
      short: {
        prompt: `lifespan 이벤트를 실행하며 테스트할 때 사용하는 TestClient context manager 선언을 적으세요.`,
        answers: [`with TestClient(app) as client:`],
        hint: `TestClient 객체가 with 블록 진입과 종료 시 앱 수명주기를 관리합니다.`,
        explanation: `with TestClient(app) as client: 문맥에서 lifespan 시작과 종료가 실행됩니다. 컨텍스트 밖에서는 자원 정리 이후의 상태를 검사할 수 있습니다.`,
      },
      locate: {
        prompt: `TestClient 객체를 만들기만 하면 lifespan이 반드시 실행된다고 잘못 가정한 줄을 찾으세요.`,
        lines: [`client = TestClient(app)`, `assert app.state.ready is True`, `response = client.get("/health")`],
        line: 1,
        hint: `Lifespan이 필요한 테스트에서는 TestClient를 context manager로 진입해야 합니다.`,
        explanation: `1번 줄은 객체를 만들 뿐 lifespan 진입을 명시하지 않습니다. with TestClient(app) as client:를 사용해 시작과 종료를 보장하는 테스트를 작성하세요.`,
      },
    },
    {
      intro: `TestClient 응답에서 HTTP 상태 코드는 status_code 속성으로 확인합니다. 응답 본문과 상태 속성을 혼동하지 않도록 정확한 이름을 사용해요.`,
      example: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

client = TestClient(app)
response = client.get("/health")
assert response.status_code == 200`, 
      choice: {
        prompt: `client.get("/health") 결과 response에서 HTTP 200 상태 코드를 검사할 속성은 무엇인가요?`,
        correct: `response.status_code`,
        correctFeedback: `HTTPX 기반 Response는 HTTP 상태 숫자를 status_code 속성으로 제공합니다.`,
        incorrect: [
          { text: `response.status`, feedback: `이 Response 객체의 공개 상태 속성은 status가 아니라 status_code입니다.` },
          { text: `response.json().status_code`, feedback: `json()은 본문을 파싱합니다. HTTP 응답 상태는 JSON 본문 필드가 아니라 Response 객체의 속성입니다.` },
        ],
        hint: `상태 코드가 HTTP 응답 메타데이터에 있는지 JSON 본문 내부에 있는지 구별하세요.`,
        explanation: `response.status_code는 HTTP 응답의 숫자 상태입니다. response.json()은 본문 데이터이므로 그 결과에서 HTTP 상태 속성을 찾지 않습니다.`,
      },
      short: {
        prompt: `TestClient 응답 response의 상태가 200인지 비교하는 올바른 assertion을 적으세요.`,
        answers: [`assert response.status_code == 200`],
        hint: `응답의 HTTP 상태 코드 속성은 status_code입니다.`,
        explanation: `assert response.status_code == 200은 요청이 기대한 HTTP 상태를 돌려줬는지 검사합니다. JSON 본문 값과 HTTP 상태 코드를 구분하세요.`,
      },
      locate: {
        prompt: `HTTP 상태 코드 200을 검사해야 하는데 응답 객체의 존재하지 않는 속성을 사용한 줄을 찾으세요.`,
        lines: [`response = client.get("/health")`, `assert response.status == 200`],
        line: 2,
        hint: `응답이 제공하는 상태 코드 속성 이름을 확인하세요.`,
        explanation: `2번 줄은 response.status를 사용합니다. TestClient의 응답은 HTTP 상태를 response.status_code로 제공합니다.`,
      },
    },
    {
      intro: `JSON 응답 본문은 response.json()을 호출해 Python 값으로 읽습니다. json 메서드 객체와 실행 결과를 혼동하지 않도록 괄호를 붙여요.`,
      example: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/courses")
async def courses():
    return {"items": ["Python"]}

client = TestClient(app)
response = client.get("/courses")
assert response.json() == {"items": ["Python"]}`, 
      choice: {
        prompt: `HTTP 응답 본문의 JSON 객체를 Python dict로 읽을 때 response에서 호출해야 하는 표현은 무엇인가요?`,
        correct: `response.json()`,
        correctFeedback: `json() 메서드를 호출하면 응답 본문을 JSON으로 파싱해 Python 값으로 돌려줍니다.`,
        incorrect: [
          { text: `response.json`, feedback: `괄호가 없으면 메서드 자체를 가리킬 뿐 본문 JSON을 파싱해 반환하지 않습니다.` },
          { text: `response.status_code`, feedback: `이 속성은 HTTP 상태 숫자이며 JSON 응답 본문 데이터가 아닙니다. 본문을 읽으려면 json()을 호출하세요.` },
        ],
        hint: `본문을 파싱하는 메서드는 참조만 하는 것이 아니라 호출 결과를 사용해야 합니다.`,
        explanation: `response.json()이 JSON 본문을 dict나 list 같은 Python 값으로 읽습니다. response.json만 사용하면 메서드 객체이므로 기대하는 본문 데이터와 비교할 수 없습니다.`,
      },
      short: {
        prompt: `TestClient 응답 response의 JSON 본문을 Python 값으로 얻는 메서드 호출을 적으세요.`,
        answers: [`response.json()`],
        hint: `메서드 이름 뒤에 괄호를 붙여 실제 JSON 파싱을 수행합니다.`,
        explanation: `response.json()은 응답 본문을 파싱한 Python 값을 돌려줍니다. 상태 코드와 본문 검사를 각각 status_code와 json()으로 분리하세요.`,
      },
      locate: {
        prompt: `응답 JSON 값을 비교해야 하는데 파싱 메서드를 호출하지 않은 줄을 찾으세요.`,
        lines: [`response = client.get("/courses")`, `assert response.json == {"items": ["Python"]}`],
        line: 2,
        hint: `JSON parsing 함수가 실행되어야 결과 객체를 얻을 수 있습니다.`,
        explanation: `2번 줄은 json 메서드를 괄호 없이 참조합니다. response.json()을 호출해야 JSON 본문이 Python 값으로 파싱되어 비교됩니다.`,
      },
    },
  ],
  22: [
    {
      intro: `FastAPI 앱은 dependency_overrides 사전에서 원래 dependency callable을 테스트 대역 callable에 연결합니다. 테스트 요청은 그 대체 값을 받습니다.`,
      example: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_repository():
    raise RuntimeError("production repository must not run in this test")

def get_fake_repository():
    return {"titles": ["Python"]}

app.dependency_overrides[get_repository] = get_fake_repository

@app.get("/courses")
async def list_courses(repository: dict = Depends(get_repository)):
    return repository`,
      choice: {
        prompt: `테스트에서 FastAPI가 원래 repository dependency 대신 get_fake_repository를 호출하게 연결하는 방법은 무엇인가요?`,
        correct: `app.dependency_overrides[get_repository] = get_fake_repository`,
        correctFeedback: `dependency_overrides는 원래 dependency 함수를 키로, 대체 callable을 값으로 보관하는 사전입니다.`,
        incorrect: [
          { text: `app.overrides[get_repository] = get_fake_repository`, feedback: `FastAPI 앱에는 overrides라는 해당 속성이 없습니다. 공식 대체 사전 이름은 dependency_overrides입니다.` },
          { text: `app.dependency_overrides[get_fake_repository] = get_repository`, feedback: `키와 값이 뒤바뀌었습니다. 원래 dependency를 키로 지정해야 경로 그래프가 그것을 대체할 수 있습니다.` },
        ],
        hint: `대체 사전의 키는 교체할 기존 함수이고 값은 요청에서 대신 실행할 함수입니다.`,
        explanation: `app.dependency_overrides[get_repository] = get_fake_repository는 원래 dependency를 찾아 대체 callable로 연결합니다. 함수 결과를 직접 대입하는 것이 아닙니다.`,
      },
      short: {
        prompt: `get_repository dependency를 테스트용 get_fake_repository 함수로 교체하는 대입문을 적으세요.`,
        answers: [`app.dependency_overrides[get_repository] = get_fake_repository`],
        hint: `앱의 dependency_overrides에서 원본 callable을 key로 사용합니다.`,
        explanation: `원래 dependency callable을 key로, 테스트용 대체 callable을 value로 설정합니다. 이렇게 하면 요청 시 원래 저장소 연결 코드를 실행하지 않습니다.`,
      },
      locate: {
        prompt: `테스트 저장소로 대체하려는 FastAPI 앱에서 존재하지 않는 overrides 속성을 사용한 줄을 찾으세요.`,
        lines: [`app = FastAPI()`, `app.overrides[get_repository] = get_fake_repository`],
        line: 2,
        hint: `FastAPI 앱이 의존성 대체를 제공하는 공식 속성 이름을 확인하세요.`,
        explanation: `2번 줄의 overrides는 FastAPI 앱 속성이 아닙니다. app.dependency_overrides를 사용해 원래 dependency를 대체해야 합니다.`,
      },
    },
    {
      intro: `외부 DB와 연결하는 repository dependency를 테스트에서 가짜 구현으로 바꿀 수 있어요. 실제 운영 연결은 호출하지 않고 기대 데이터를 반환합니다.`,
      example: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_repository():
    return ProductionRepository()

def get_fake_repository():
    return FakeRepository([{"id": 1, "title": "Python"}])

app.dependency_overrides[get_repository] = get_fake_repository

@app.get("/courses")
async def list_courses(repository=Depends(get_repository)):
    return repository.list_courses()`,
      choice: {
        prompt: `테스트에서 운영 DB에 접속하지 않고 고정 강의 데이터를 제공하도록 원래 repository 의존성을 무엇으로 대체하나요?`,
        correct: `get_fake_repository`,
        correctFeedback: `테스트 대역 함수는 고정 입력을 돌려줘 외부 저장소 연결 없이 API가 데이터를 처리하는 경로를 확인합니다.`,
        incorrect: [
          { text: `실제 운영 DB 주소를 반환하는 repository`, feedback: `이 대체는 운영 저장소에 접속할 수 있어 테스트를 외부 상태와 비용에 의존하게 만듭니다.` },
          { text: `앱의 dependency_overrides를 비운 채 실제 repository를 사용`, feedback: `대체가 없으면 원래 dependency가 호출되어 운영 DB나 외부 자원으로 연결될 수 있습니다.` },
        ],
        hint: `네트워크나 외부 데이터베이스를 사용하지 않고 테스트가 예측 가능한 fixture를 받도록 하세요.`,
        explanation: `get_fake_repository는 정해 둔 테스트 데이터를 제공합니다. dependency_overrides로 원래 repository를 교체해 외부 DB의 주소·계정·상태와 분리합니다.`,
      },
      short: {
        prompt: `운영 저장소 대신 고정된 테스트 데이터를 반환하는 가짜 repository 의존성 함수 이름을 적으세요.`,
        answers: [`get_fake_repository`],
        hint: `함수 이름은 fake repository를 반환하는 테스트 대역이라는 의미입니다.`,
        explanation: `get_fake_repository가 외부 DB에 접속하지 않고 테스트 데이터를 반환합니다. 원래 함수와 연결하는 대체 사전 설정도 테스트에서 함께 해야 합니다.`,
      },
      locate: {
        prompt: `외부 저장소와 접속하지 않는 격리 테스트에 운영 데이터베이스 주소를 직접 넣은 줄을 찾으세요.`,
        lines: [`def get_repository():`, `    return Repository("postgresql://production-db/course")`],
        line: 2,
        hint: `테스트 대역이어야 하는 함수가 운영 DB 위치와 연결되어 있는지 확인하세요.`,
        explanation: `2번 줄은 운영 DB 주소를 사용합니다. 테스트에서는 가짜 repository와 고정 fixture를 연결해 외부 저장소를 호출하지 않아야 합니다.`,
      },
    },
    {
      intro: `dependency_overrides는 앱에 저장되는 mutable 상태예요. 테스트가 끝날 때 원래 override 사전을 복구해 다음 테스트로 설정이 새지 않게 합니다. 같은 앱 인스턴스의 override를 동시에 바꾸면 사례끼리 간섭할 수 있어요.`,
      example: `previous = app.dependency_overrides.copy()
try:
    app.dependency_overrides[get_repository] = get_fake_repository
    run_repository_test()
finally:
    app.dependency_overrides.clear()
    app.dependency_overrides.update(previous)`,
      choice: {
        prompt: `테스트 종료 뒤 다른 사례에 대체 설정이 새지 않게 원래 override 사전을 복구하는 정리 동작은 무엇인가요?`,
        correct: `기존 override를 저장하고 finally에서 원래 사전을 복구`,
        correctFeedback: `finally에서 복구하면 테스트 성공·실패와 관계없이 앱의 기존 override 상태를 되돌립니다.`,
        incorrect: [
          { text: `테스트 종료 뒤 대체를 계속 유지`, feedback: `공유 앱 인스턴스에 변경이 남으면 실행 순서에 따라 다른 테스트가 예상하지 못한 fake dependency를 받습니다.` },
          { text: `테스트 함수가 성공했을 때만 override 삭제`, feedback: `assertion 실패 등 예외가 발생하면 정리 코드가 건너뛰어 대체 상태가 남을 수 있습니다.` },
        ],
        hint: `실패해도 실행되는 Python 정리 구문 안에서 이전 설정을 다시 적용하세요.`,
        explanation: `이전 override를 복사하고 finally에서 사전을 비운 뒤 이전 값을 복구하면 실패 경로도 격리됩니다. 무조건 clear만 하면 테스트 전 설정을 잃을 수 있어요.`,
      },
      short: {
        prompt: `테스트 성공 여부와 상관없이 dependency override 복구 코드가 실행되도록 사용하는 Python 키워드를 적으세요.`,
        answers: [`finally`],
        hint: `try 블록이 예외로 끝나도 실행되는 정리 절입니다.`,
        explanation: `finally 블록에서 override 상태를 복구하면 assertion 실패가 있어도 다음 테스트에 대체 dependency가 남지 않습니다.`,
      },
      locate: {
        prompt: `테스트용 대체 dependency를 설정한 뒤 후속 요청에 계속 영향을 주도록 복구하지 않는 줄을 찾으세요.`,
        lines: [`app.dependency_overrides[get_repository] = get_fake_repository`, `client.get("/courses")`, `# 테스트 종료 뒤 대체를 계속 유지`],
        line: 3,
        hint: `공유 앱의 테스트 상태는 테스트가 끝날 때 이전 값으로 복원해야 합니다.`,
        explanation: `3번 줄은 정리 없이 대체를 유지하라고 합니다. try/finally를 사용해 테스트가 끝나거나 실패해도 기존 dependency override 상태를 복구해야 합니다.`,
      },
    },
    {
      intro: `외부 네트워크 dependency도 테스트 callable로 대체할 수 있어요. 네트워크 요청이 테스트 중 실제로 나가지 않도록 실행 경계를 고정합니다.`,
      example: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_remote_catalog():
    return RemoteCatalogClient("https://catalog.example")

def get_fake_catalog():
    return {"items": [{"id": 1, "title": "Python"}]}

app.dependency_overrides[get_remote_catalog] = get_fake_catalog`,
      choice: {
        prompt: `외부 catalog API를 호출하는 의존성에 대한 테스트에서 실제 네트워크 요청을 막으려면 무엇을 대체하나요?`,
        correct: `네트워크 의존성을 테스트 대역으로 교체`,
        correctFeedback: `dependency_overrides에 로컬 테스트 callable을 연결하면 실제 외부 서비스에 요청을 보내지 않고 응답 경로를 확인할 수 있습니다.`,
        incorrect: [
          { text: `네트워크 차단 없이 테스트 완료를 주장`, feedback: `외부 호출이 가능한 상태에서 실행 결과를 보장하면 테스트가 원격 상태·요금·접속 문제에 의존합니다.` },
          { text: `운영 API key를 fixture에 포함`, feedback: `자격 증명을 테스트 자료에 넣으면 정보 유출 위험이 생기고 외부 서비스 의존성도 해결되지 않습니다.` },
        ],
        hint: `테스트 환경은 외부 요청 함수 대신 예측 가능한 응답을 돌려주는 dependency를 사용해야 합니다.`,
        explanation: `외부 네트워크 dependency를 fake 응답 함수로 대체해 실제 요청을 차단합니다. 이 경로는 API 계약을 테스트하지만 원격 서비스의 실제 동작까지 검증하지는 않습니다.`,
      },
      short: {
        prompt: `테스트 도중 외부 서비스에 실제 요청이 나가지 않도록 원래 네트워크 dependency를 무엇으로 바꾸나요?`,
        answers: [`네트워크 dependency를 테스트 대역으로 교체`, `가짜 응답을 반환하는 로컬 dependency`],
        hint: `실제 네트워크 callable 대신 테스트가 직접 제어하는 로컬 응답 함수를 사용합니다.`,
        explanation: `dependency_overrides로 fake network dependency를 연결합니다. 외부 요청이 차단되어도 원격 서버의 통합 동작을 확인한 것은 아닙니다.`,
      },
      locate: {
        prompt: `실제 네트워크 요청을 막지 않고 테스트가 격리됐다고 잘못 선언한 줄을 찾으세요.`,
        lines: [`app.dependency_overrides[get_remote_catalog] = get_fake_catalog`, `# 실제 네트워크 요청을 차단하지 않아도 격리 검증을 완료했다`],
        line: 2,
        hint: `테스트 대체를 연결한 것과 실제 원격 주소로 요청이 나가는지 확인한 것은 다릅니다.`,
        explanation: `2번 줄은 실제 네트워크 가능성을 무시합니다. 운영 호출 dependency가 테스트에서 대체되는지 확인하고, fake 응답만으로 원격 서비스 통합을 검증했다고 말하지 않아야 합니다.`,
      },
    },
    {
      intro: `각 테스트 사례가 독립된 fake repository를 만들면 한 요청의 변경 데이터가 다음 사례로 번지지 않습니다. 공유 mutable fixture를 조심하세요.`,
      example: `def make_fake_repository(rows):
    return {"rows": [dict(row) for row in rows]}

def test_first_case():
    repository = make_fake_repository([{"id": 1, "title": "Python"}])
    repository["rows"].clear()
    assert repository["rows"] == []

def test_second_case():
    repository = make_fake_repository([{"id": 1, "title": "Python"}])
    assert len(repository["rows"]) == 1`,
      choice: {
        prompt: `테스트 한 사례의 수정이 뒤에 실행되는 사례의 입력 데이터에 영향을 주지 않게 하는 방법은 무엇인가요?`,
        correct: `각 사례에 독립된 저장소 대역을 생성`,
        correctFeedback: `팩토리에서 사례별 mutable 자료를 새로 만들면 한 테스트의 변경이 다른 테스트 상태를 오염시키지 않습니다.`,
        incorrect: [
          { text: `공유 변경 가능 전역 상태에 의존`, feedback: `전역 mutable 데이터는 실행 순서와 테스트 실패 여부에 따라 내용이 달라져 반복 가능한 결과를 해칩니다.` },
          { text: `앞선 테스트의 수정 결과를 다음 테스트가 사용`, feedback: `테스트 간 숨은 순서 의존이 생기므로 한 사례가 다른 사례의 준비 상태를 보장해야 하는 문제가 생깁니다.` },
        ],
        hint: `테스트마다 입력 객체를 새로 만들어 상태 변경을 다른 사례에서 보이지 않게 하세요.`,
        explanation: `각 테스트가 독립된 가짜 저장소를 만들면 실행 순서와 관계없이 정해진 초기 상태를 사용합니다. 공유 global mutable fixture는 사례 간 누수 위험이 있습니다.`,
      },
      short: {
        prompt: `서로 다른 테스트 사례 사이에서 fake 저장소의 변경이 섞이지 않도록 적용하는 격리 방법을 적으세요.`,
        answers: [`각 사례에 독립된 저장소 대역 사용`, `테스트마다 새 저장소 대역 생성`],
        hint: `각 사례마다 초기 입력 객체를 생성하는 구조입니다.`,
        explanation: `사례마다 fake repository를 새로 생성하면 수정된 데이터가 다른 테스트로 새지 않습니다. 전역 변경 가능 fixture를 공유하지 마세요.`,
      },
      locate: {
        prompt: `여러 테스트가 변경 가능한 같은 전역 repository를 공유해 실행 순서에 따라 결과가 달라지는 줄을 찾으세요.`,
        lines: [`shared_repository = {"rows": [{"id": 1}]}`, `def test_case():`, `    shared_repository["rows"].clear()`],
        line: 1,
        hint: `모든 테스트가 동일한 mutable 객체를 통해 상태를 공유하는지 확인하세요.`,
        explanation: `1번 줄의 전역 repository는 모든 테스트에서 공유됩니다. 사례마다 새 대역을 생성해 한 테스트의 clear나 update가 다른 사례의 초기 데이터에 영향을 주지 않게 하세요.`,
      },
    },
  ],
  23: [
    {
      intro: `외부 Python 개발 환경의 비동기 API 테스트에서는 HTTPX ASGITransport가 FastAPI 앱을 전송 대상으로 연결합니다. 이 사이트의 브라우저 실행기는 FastAPI·HTTPX 테스트 패키지를 설치하거나 실행하지 않습니다.`,
      example: `from fastapi import FastAPI
from httpx import ASGITransport

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

transport = ASGITransport(app=app)`,
      choice: {
        prompt: `HTTPX 비동기 테스트에서 요청이 전달될 FastAPI 앱 객체를 ASGI 전송 어댑터에 연결하는 코드는 무엇인가요?`,
        correct: `ASGITransport(app=app)`,
        correctFeedback: `ASGITransport의 app 매개변수로 앱 객체를 연결해 AsyncClient가 그 앱에 요청을 보냅니다.`,
        incorrect: [
          { text: `ASGITransport(url=app)`, feedback: `app 객체를 전달하는 매개변수는 url이 아니라 app입니다. URL은 AsyncClient의 base_url에서 설정합니다.` },
          { text: `ASGITransport(app="http://test")`, feedback: `문자열 테스트 주소는 ASGI 앱이 아닙니다. HTTPX transport에는 FastAPI app 객체를 전달해야 합니다.` },
        ],
        hint: `전송 대상 앱과 HTTP 요청의 기본 URL을 각각 어느 인자에서 받는지 살펴보세요.`,
        explanation: `ASGITransport(app=app)는 ASGI callable인 FastAPI 앱을 연결합니다. base_url은 별도로 AsyncClient에 전달해 상대 경로 요청의 기준을 설정합니다.`,
      },
      short: {
        prompt: `FastAPI ASGI app 객체를 HTTPX 전송 어댑터에 연결하는 생성 호출을 적으세요.`,
        answers: [`ASGITransport(app=app)`],
        hint: `ASGI 앱을 전달하는 생성자 인자의 이름은 app입니다.`,
        explanation: `ASGITransport(app=app)로 앱을 테스트 transport에 연결합니다. 문자열 base URL은 이 생성자 대신 AsyncClient에 설정합니다.`,
      },
      locate: {
        prompt: `ASGI 앱을 연결해야 하는데 앱 변수에 url 인자를 지정해 전달한 줄을 찾으세요.`,
        lines: [`app = FastAPI()`, `transport = ASGITransport(url=app)`],
        line: 2,
        hint: `transport가 받아야 하는 ASGI application 매개변수 이름을 확인하세요.`,
        explanation: `2번 줄은 앱 객체를 url에 전달합니다. ASGITransport(app=app)를 사용하고 요청 기준 URL은 AsyncClient base_url에 따로 설정합니다.`,
      },
    },
    {
      intro: `AsyncClient는 ASGITransport와 기본 URL을 함께 받아 비동기 테스트 요청을 보냅니다. HTTPX와 ASGITransport는 테스트 개발 의존성입니다.`,
      example: `from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

app = FastAPI()
transport = ASGITransport(app=app)

async def read_health():
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        return response`,
      choice: {
        prompt: `ASGITransport를 사용하면서 비동기 HTTP 요청의 기준 host를 http://test로 지정하는 client 생성은 무엇인가요?`,
        correct: `AsyncClient(transport=transport, base_url="http://test")`,
        correctFeedback: `AsyncClient는 사용할 ASGI transport와 상대 경로를 해석할 기본 URL을 인자로 받습니다.`,
        incorrect: [
          { text: `AsyncClient(transport=app)`, feedback: `AsyncClient의 transport에는 ASGITransport 객체를 전달해야 합니다. app은 transport를 만들 때 연결합니다.` },
          { text: `AsyncClient(base_url="", transport=transport)`, feedback: `빈 base_url은 이 예제의 상대 경로 요청에 사용할 기준 host를 제공하지 않습니다.` },
        ],
        hint: `클라이언트 생성자의 transport에는 adapter를, base_url에는 테스트 요청에 사용할 host를 설정하세요.`,
        explanation: `AsyncClient(transport=transport, base_url="http://test")는 transport와 기준 URL을 함께 설정합니다. 실제 서비스 host에 접속하는 테스트가 아니라 앱 객체에 전달되는 로컬 요청입니다.`,
      },
      short: {
        prompt: `transport와 테스트 기준 주소 http://test를 사용하는 HTTPX 비동기 클라이언트 생성 호출을 적으세요.`,
        answers: [`AsyncClient(transport=transport, base_url="http://test")`],
        hint: `transport 객체와 base_url 문자열을 각각 named argument로 전달합니다.`,
        explanation: `AsyncClient는 ASGITransport와 base_url을 받습니다. base_url은 상대 경로인 /health 요청을 테스트 주소에 붙이는 기준입니다.`,
      },
      locate: {
        prompt: `ASGITransport adapter를 연결해야 하는데 앱 객체를 transport에 직접 전달한 줄을 찾으세요.`,
        lines: [`app = FastAPI()`, `async with AsyncClient(transport=app, base_url="http://test") as client:`, `    response = await client.get("/health")`],
        line: 2,
        hint: `AsyncClient의 transport에는 ASGITransport 생성 결과가 필요합니다.`,
        explanation: `2번 줄은 app을 transport로 직접 넣습니다. ASGITransport(app=app)를 먼저 만든 뒤 그 transport 객체를 전달해야 합니다.`,
      },
    },
    {
      intro: `AsyncClient 요청은 비동기 함수이므로 await해야 응답을 얻습니다. await를 빼면 Response가 아니라 아직 실행되지 않은 coroutine을 사용하게 돼요.`,
      example: `from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

app = FastAPI()
transport = ASGITransport(app=app)

async def read_health():
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        return {"status": response.status_code}`, 
      choice: {
        prompt: `async test에서 HTTPX AsyncClient의 GET 요청을 보내고 Response를 받기 위해 필요한 코드는 무엇인가요?`,
        correct: `response = await client.get("/health")`,
        correctFeedback: `AsyncClient.get은 coroutine을 반환하므로 await해야 실제 요청을 실행하고 응답 객체를 얻습니다.`,
        incorrect: [
          { text: `response = client.get("/health")`, feedback: `await가 빠져 coroutine 객체를 변수에 저장합니다. HTTP 응답의 상태나 본문을 바로 읽을 수 없습니다.` },
          { text: `response = await client.get`, feedback: `메서드 참조만 기다리고 요청 경로를 넘기지 않았습니다. get을 호출하고 URL을 전달해야 합니다.` },
        ],
        hint: `비동기 요청 메서드의 결과가 coroutine인지 완료된 응답인지 await로 확인하세요.`,
        explanation: `await client.get("/health")가 coroutine을 실행하고 HTTP response를 받습니다. await가 없으면 response는 아직 요청하지 않은 coroutine이라 status_code를 읽을 수 없습니다.`,
      },
      short: {
        prompt: `AsyncClient에서 /health 요청을 실행하고 응답을 대입하는 한 줄을 적으세요.`,
        answers: [`response = await client.get("/health")`],
        hint: `비동기 GET 요청을 실제로 수행하는 await 키워드가 필요합니다.`,
        explanation: `response = await client.get("/health")는 비동기 요청을 기다린 뒤 응답 객체를 받습니다. await를 빼면 coroutine만 얻게 됩니다.`,
      },
      locate: {
        prompt: `비동기 GET 요청을 실행해야 하는데 결과 coroutine을 기다리지 않은 줄을 찾으세요.`,
        lines: [`async def read_health(client):`, `    response = client.get("/health")`, `    return response.status_code`],
        line: 2,
        hint: `AsyncClient 메서드가 돌려준 비동기 작업을 완료하려면 호출 앞에 어떤 키워드가 필요한가요?`,
        explanation: `2번 줄은 await 없이 coroutine을 변수에 담습니다. await client.get("/health")를 사용해야 Response가 반환된 뒤 status_code를 읽을 수 있습니다.`,
      },
    },
    {
      intro: `HTTPX ASGITransport는 FastAPI lifespan을 자동 실행하지 않습니다. LifespanManager로 앱을 감싼 뒤 AsyncClient 요청을 수행해야 해요.`,
      example: `from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

async def test_health(app):
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/health")
    assert response.status_code == 200`,
      choice: {
        prompt: `FastAPI lifespan을 사용하는 앱을 HTTPX ASGITransport로 비동기 테스트할 때 시작·종료를 맡기는 도구는 무엇인가요?`,
        correct: `async with LifespanManager(app):`,
        correctFeedback: `FastAPI 문서는 ASGITransport가 lifespan을 trigger하지 않으므로 asgi-lifespan의 LifespanManager를 사용하도록 안내합니다.`,
        incorrect: [
          { text: `ASGITransport가 자동으로 lifespan 호출`, feedback: `ASGITransport는 앱의 HTTP scope를 전달하지만 lifespan 이벤트를 자동 실행하지 않는다고 FastAPI 문서가 명시합니다.` },
          { text: `client.get("/health")만 한 번 호출`, feedback: `요청은 앱 lifespan 시작·종료 이벤트를 대체하지 않습니다. 자원 초기화가 필요한 테스트는 별도 관리해야 합니다.` },
        ],
        hint: `전송 어댑터와 별도로 앱 startup/shutdown 수명을 관리하는 외부 테스트 context manager가 있습니다.`,
        explanation: `FastAPI 공식 비동기 테스트 가이드는 ASGITransport가 lifespan을 실행하지 않는다고 설명하고 LifespanManager를 권합니다. 이는 추가 테스트 패키지이며 사이트 실행기에는 설치하지 않습니다.`,
      },
      short: {
        prompt: `ASGITransport 테스트에서 자동 실행되지 않는 앱 시작·종료 주기를 관리하는 context manager 선언을 적으세요.`,
        answers: [`async with LifespanManager(app):`],
        hint: `FastAPI 공식 문서가 asgi-lifespan에서 제공하는 도구로 안내합니다.`,
        explanation: `async with LifespanManager(app):가 앱 수명을 시작하고 종료합니다. ASGITransport는 HTTP 요청 transport일 뿐 lifespan을 trigger하지 않습니다.`,
      },
      locate: {
        prompt: `ASGITransport가 lifespan까지 시작한다고 잘못 가정한 줄을 찾으세요.`,
        lines: [`transport = ASGITransport(app=app)`, `# ASGITransport가 자동으로 lifespan 호출`, `response = await client.get("/health")`],
        line: 2,
        hint: `HTTP 전송과 ASGI lifespan 이벤트는 별개의 scope인지 확인하세요.`,
        explanation: `2번 줄의 주석은 잘못된 가정입니다. ASGITransport는 lifespan 이벤트를 실행하지 않으므로 LifespanManager로 앱을 감싸야 합니다.`,
      },
    },
    {
      intro: `HTTPX AsyncClient의 base_url은 상대 경로 요청이 붙을 host를 제공합니다. 빈 값이면 의도한 테스트 URL이 구성되지 않으므로 분명한 기준 주소를 둡니다.`,
      example: `from httpx import ASGITransport, AsyncClient

async def read_health(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        return response.url`,
      choice: {
        prompt: `client.get("/health") 같은 상대 경로를 테스트할 때 URL 기준 host를 지정하는 HTTPX 설정은 무엇인가요?`,
        correct: `base_url="http://test"`,
        correctFeedback: `base_url은 상대 경로를 완전한 테스트 URL로 해석할 기준 host를 제공합니다.`,
        incorrect: [
          { text: `base_url=""`, feedback: `빈 문자열은 명시적인 host 기준을 제공하지 않아 상대 URL을 의도한 테스트 주소로 완성하지 못합니다.` },
          { text: `transport="http://test"`, feedback: `transport에는 URL 문자열이 아니라 ASGITransport 같은 HTTP transport 객체를 전달합니다.` },
        ],
        hint: `앱 adapter를 지정한 뒤 상대 path의 시작 주소를 따로 설정하는 client 매개변수입니다.`,
        explanation: `base_url="http://test"는 /health 같은 상대 경로의 기준 주소입니다. ASGITransport는 연결된 앱 객체를 전달하는 별도 인자입니다.`,
      },
      short: {
        prompt: `AsyncClient가 상대 경로를 붙일 테스트 기준 주소로 지정할 base_url 값을 적으세요.`,
        answers: [`base_url="http://test"`],
        hint: `테스트에서 실제 네트워크가 아니라 transport로 라우팅할 임의의 test host를 사용합니다.`,
        explanation: `base_url="http://test"가 /health의 기준 주소가 됩니다. ASGITransport가 앱 객체를 처리하므로 외부 DNS 요청을 위해 이 host를 사용할 필요는 없습니다.`,
      },
      locate: {
        prompt: `상대 경로 요청에 기준 주소를 지정해야 하는 AsyncClient에서 빈 URL을 사용한 줄을 찾으세요.`,
        lines: [`async with AsyncClient(transport=transport, base_url="") as client:`, `    response = await client.get("/health")`],
        line: 1,
        hint: `client가 상대 경로를 만들 때 사용할 명시적인 테스트 host가 있는지 확인하세요.`,
        explanation: `1번 줄은 base_url이 비어 있습니다. base_url="http://test"처럼 테스트 기준 주소를 지정한 뒤 상대 경로를 요청하세요.`,
      },
    },
  ],
  24: [
    {
      intro: `페이지 크기 limit는 기본값과 최소·최대 범위를 함께 선언해야 요청이 지나치게 많은 행을 반환하지 않도록 제한할 수 있어요.`,
      example: `from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/courses")
async def list_courses(limit: Annotated[int, Query(ge=1, le=100)] = 20):
    return {"limit": limit}`, 
      choice: {
        prompt: `기본 페이지 크기를 20으로 하고 요청자가 1~100 사이의 limit만 사용할 수 있게 하는 선언은 무엇인가요?`,
        correct: `limit: Annotated[int, Query(ge=1, le=100)] = 20`,
        correctFeedback: `Query metadata로 최소 1, 최대 100을 검증하고 실제 기본값 20은 함수 매개변수에 둡니다.`,
        incorrect: [
          { text: `limit: int = Query(20)`, feedback: `이 선언은 기본값만 제공하고 음수·0이나 지나치게 큰 페이지 크기를 제한하지 않습니다.` },
          { text: `limit: Annotated[int, Query(ge=1)] = 20`, feedback: `최소값만 있고 상한이 없어 클라이언트가 매우 큰 페이지를 한 번에 요청할 수 있습니다.` },
        ],
        hint: `Annotated 안 Query에 ge와 le 경계를 모두 두고 기본값은 함수 인자에 지정하세요.`,
        explanation: `limit: Annotated[int, Query(ge=1, le=100)] = 20은 1보다 작거나 100보다 큰 입력을 검증에서 거부합니다. 상한은 과도한 결과 반환을 줄입니다.`,
      },
      short: {
        prompt: `FastAPI Query와 Annotated로 기본 20, 최소 1, 최대 100인 페이지 크기 매개변수를 적으세요.`,
        answers: [`limit: Annotated[int, Query(ge=1, le=100)] = 20`],
        hint: `ge와 le를 함께 선언하고 기본값은 함수 인자에 둡니다.`,
        explanation: `Annotated[int, Query(ge=1, le=100)] = 20은 범위 검증과 기본값을 함께 선언합니다.`,
      },
      locate: {
        prompt: `페이지 크기의 최소값과 최대값을 검증해야 하는데 기본값만 선언해 상한을 두지 않은 줄을 찾으세요.`,
        lines: [`async def list_courses(limit: int = Query(20)):` , `    return items[:limit]`],
        line: 1,
        hint: `0 이하 값뿐 아니라 지나치게 큰 요청을 거부할 제약도 있는지 확인하세요.`,
        explanation: `1번 줄은 Query 기본값만 지정합니다. Query(ge=1, le=100) 같은 경계와 Annotated 타입을 설정해 유효한 limit 범위를 제한해야 합니다.`,
      },
    },
    {
      intro: `offset은 목록의 시작 인덱스이므로 음수가 될 수 없어요. 음수 offset을 입력 검증 단계에서 거부하도록 Query 제약을 둡니다.`,
      example: `from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/courses")
async def list_courses(offset: Annotated[int, Query(ge=0)] = 0):
    return {"offset": offset}`, 
      choice: {
        prompt: `0번째 항목부터 세는 페이지 offset에 음수 값이 들어오지 않도록 하는 Query 제약은 무엇인가요?`,
        correct: `offset: Annotated[int, Query(ge=0)] = 0`,
        correctFeedback: `ge=0은 offset이 0 이상이어야 한다고 검증하고 0을 기본 시작 위치로 둡니다.`,
        incorrect: [
          { text: `offset: int = Query(-1)`, feedback: `기본값 자체가 음수이고 클라이언트가 다른 음수 값을 보내도 경계 검증이 없습니다.` },
          { text: `offset: Annotated[int, Query(le=0)] = 0`, feedback: `le=0은 0보다 큰 정상 페이지 위치를 막고 음수 값은 허용할 수 있습니다.` },
        ],
        hint: `offset은 첫 항목 앞의 음수가 아닌 건너뛸 항목 수이므로 최소값을 0으로 둡니다.`,
        explanation: `Query(ge=0)는 음수 offset을 거부합니다. offset을 0부터 시작하는 정수로 관리해야 페이지 경계가 일관됩니다.`,
      },
      short: {
        prompt: `목록 시작 위치 offset의 기본값은 0으로 두고 음수를 거부하는 Annotated 매개변수 선언을 적으세요.`,
        answers: [`offset: Annotated[int, Query(ge=0)] = 0`],
        hint: `최소값은 0이고 최대값 제한은 이 문제에서 요구하지 않습니다.`,
        explanation: `Annotated[int, Query(ge=0)] = 0은 offset을 음수가 아닌 정수로 검증합니다.`,
      },
      locate: {
        prompt: `offset이 음수일 수 없는데 음수 기본값을 설정한 줄을 찾으세요.`,
        lines: [`async def list_courses(offset: int = Query(-1)):` , `    return items[offset:offset + 20]`],
        line: 1,
        hint: `첫 페이지에서 건너뛸 항목 수는 0부터 시작해야 합니다.`,
        explanation: `1번 줄은 기본 offset을 -1로 설정해 목록을 뒤에서부터 자르는 등 잘못된 결과를 낼 수 있습니다. 기본 0과 ge=0 제약을 사용하세요.`,
      },
    },
    {
      intro: `페이지를 나누기 전 전체 후보를 먼저 결정적인 순서로 정렬하세요. 이 예제는 작은 메모리 목록이며, 운영 DB에서는 같은 정렬 조건을 ORDER BY에 적용한 뒤 LIMIT/OFFSET을 사용해야 합니다.`,
      example: `courses = [
    {"id": 3, "title": "TypeScript"},
    {"id": 1, "title": "Java"},
    {"id": 2, "title": "Python"},
]

def page_by_title(offset: int, limit: int):
    ordered = sorted(courses, key=lambda course: (course["title"], course["id"]))
    return ordered[offset:offset + limit]`,
      choice: {
        prompt: `페이지마다 전체 목록에서 일관된 정렬 순서를 유지하려면 sort와 slice 중 어느 순서로 적용해야 하나요?`,
        correct: `먼저 전체 목록을 정렬하고 그 결과를 offset/limit으로 자르기`,
        correctFeedback: `정렬을 먼저 해야 모든 페이지가 같은 전체 순서를 기준으로 나뉩니다. 정렬된 순서가 결정적이어야 합니다.`,
        incorrect: [
          { text: `먼저 첫 limit개를 자른 다음 해당 페이지 안에서만 정렬`, feedback: `이 순서는 전체 목록에서 정렬된 앞 페이지를 보장하지 않고 일부 원소가 다른 페이지에서 앞서야 할 수 있습니다.` },
          { text: `offset 위치에서 한 항목을 가져와 나머지 전체 목록에 합치기`, feedback: `이 방법은 page size를 지키지 않으며 정상적인 범위 슬라이스와도 다릅니다.` },
        ],
        hint: `정렬 범위가 현재 페이지뿐인지 전체 후보 목록인지 먼저 결정하세요.`,
        explanation: `전체 후보를 결정적인 정렬 순서로 정렬한 뒤 offset과 limit으로 slice해야 합니다. 페이지에 들어갈 집합을 먼저 자르면 전체 순서와 일치하지 않습니다.`,
      },
      short: {
        prompt: `정렬된 전체 컬렉션의 연속된 페이지를 만들기 위한 정렬과 slice의 올바른 순서를 적으세요.`,
        answers: [`정렬 후 items[offset:offset + limit]로 자르기`, `items.sort(key=...) 후 items[offset:offset + limit]`],
        hint: `전체 목록에서 순서를 정한 다음 원하는 구간만 가져옵니다.`,
        explanation: `정렬을 먼저 적용하고 items[offset:offset + limit]로 자르면 모든 페이지가 같은 정렬 결과의 구간을 가리킵니다.`,
      },
      locate: {
        prompt: `페이지의 정렬 순서를 보장해야 하는데 정렬 결과를 쓰지 않고 슬라이스만 수행한 줄을 찾으세요.`,
        lines: [`page = items[:limit + offset]`, `return page`],
        line: 1,
        hint: `slice 이전에 전체 후보를 정렬하는 처리가 있는지 살펴보세요.`,
        explanation: `1번 줄은 정렬 없이 첫 offset+limit개를 반환합니다. 전체 자료를 정렬한 뒤 offset:offset+limit 범위로 잘라야 해요.`,
      },
    },
    {
      intro: `sort_by 같은 정렬 이름을 사용자가 보내면 사전에서 허용된 키로 변환해요. 사용자 입력 문자열을 Python 코드나 SQL 조각으로 실행하지 않습니다.`,
      example: `courses = [{"id": 2, "title": "Python"}, {"id": 1, "title": "Java"}]
sort_keys = {
    "title": lambda course: course["title"],
    "id": lambda course: course["id"],
}

def sort_courses(sort_by: str):
    key = sort_keys.get(sort_by)
    if key is None:
        raise ValueError("Unsupported sort field")
    return sorted(courses, key=key)`,
      choice: {
        prompt: `클라이언트가 보낸 sort_by 값을 허용된 정렬 기준에만 안전하게 연결하는 검증 방식은 무엇인가요?`,
        correct: `허용된 sort_by 이름만 선택`,
        correctFeedback: `입력 문자열을 미리 정한 정렬 함수 사전의 키로 검사하면 허용된 필드만 사용할 수 있습니다.`,
        incorrect: [
          { text: `사용자 입력 문자열을 Python 코드로 실행`, feedback: `사용자 값을 실행 코드로 해석하면 명령 삽입과 임의 코드 실행 위험을 만듭니다.` },
          { text: `사용자 입력을 SQL order-by 문구에 그대로 이어 붙이기`, feedback: `필드 식별자를 문자열로 직접 붙이면 SQL 구조가 공격자 입력에 영향을 받을 수 있습니다.` },
        ],
        hint: `외부 입력은 제한된 선택지에 매핑하고 코드·SQL 구문으로 직접 실행하지 마세요.`,
        explanation: `허용 목록에서 sort_by를 찾아 미리 정의한 key function만 선택합니다. SQL을 사용할 경우도 식별자를 parameter binding으로 대체할 수 없으므로 사전 매핑을 해야 합니다.`,
      },
      short: {
        prompt: `사용자 sort_by 문자열을 사전에 정의한 안전한 정렬 기준에만 연결하는 검증 방법을 적으세요.`,
        answers: [`허용 목록`, `허용된 정렬 필드 목록`],
        hint: `모든 임의 문자열이 아니라 허용된 이름 집합에서 값을 선택합니다.`,
        explanation: `허용 목록에서 정렬 필드를 고릅니다. 입력을 코드로 실행하거나 데이터베이스 정렬 구문에 문자열로 이어 붙이면 안 됩니다.`,
      },
      locate: {
        prompt: `정렬 매개변수를 허용 목록으로 검증하지 않고 Python 표현식으로 실행하는 위험한 줄을 찾으세요.`,
        lines: [`def sort_courses(sort_by: str):`, `    return eval(sort_by)`],
        line: 2,
        hint: `외부 요청에서 받은 문자열을 코드로 실행하는 함수인지 확인하세요.`,
        explanation: `2번 줄의 eval은 사용자가 보낸 값을 Python 코드로 실행합니다. 허용된 필드명을 사전 key function에 매핑해 정렬해야 합니다.`,
      },
    },
    {
      intro: `limit만큼 현재 페이지를 제공했다면 다음 페이지 시작 offset은 현재 offset에 limit를 더해 계산합니다. 페이지 이동 수식의 부호를 확인하세요.`,
      example: `def next_page(offset: int, limit: int):
    next_offset = offset + limit
    return {"offset": next_offset, "limit": limit}

print(next_page(offset=20, limit=20))
# {'offset': 40, 'limit': 20}`,
      choice: {
        prompt: `offset 20에서 limit 20개의 다음 페이지가 offset 40에서 시작하도록 계산하는 식은 무엇인가요?`,
        correct: `next_offset = offset + limit`,
        correctFeedback: `현재 페이지가 소비한 limit만큼 시작 위치에 더하면 다음 구간의 첫 offset이 됩니다.`,
        incorrect: [
          { text: `next_offset = offset - limit`, feedback: `빼면 시작 위치가 앞으로 이동하거나 음수가 되어 앞 페이지를 다시 가리킵니다.` },
          { text: `next_offset = limit`, feedback: `이 식은 현재 시작 offset을 무시하므로 두 번째 페이지 이후에도 같은 구간을 반복합니다.` },
        ],
        hint: `현재 페이지에서 건너뛴 항목 수와 이번 페이지 크기를 더해 다음 시작점을 찾으세요.`,
        explanation: `next_offset = offset + limit은 현재 페이지 다음 위치를 계산합니다. 현재 offset을 버리거나 빼면 반복 또는 역방향 페이지 이동이 발생합니다.`,
      },
      short: {
        prompt: `현재 페이지 다음 구간의 시작 위치를 계산하는 offset과 limit의 수식을 적으세요.`,
        answers: [`next_offset = offset + limit`],
        hint: `다음 페이지는 현재 시작점에서 현재 페이지 크기만큼 뒤에 있습니다.`,
        explanation: `현재 offset에 limit를 더하면 다음 페이지의 시작 위치가 됩니다. 이 값을 그대로 limit로 쓰지 않습니다.`,
      },
      locate: {
        prompt: `다음 페이지 시작 인덱스를 계산하면서 현재 페이지 크기를 빼는 잘못된 줄을 찾으세요.`,
        lines: [`def next_page(offset, limit):`, `    next_offset = offset - limit`, `    return next_offset`],
        line: 2,
        hint: `페이지 이동은 목록 앞쪽으로 돌아가지 않도록 현재 page size를 더해야 합니다.`,
        explanation: `2번 줄은 limit를 빼 페이지 위치를 거꾸로 이동합니다. 다음 시작 offset은 현재 offset에 limit를 더해 계산합니다.`,
      },
    },
  ],
  25: [
    {
      intro: `FastAPI의 CORSMiddleware는 브라우저에서 실행된 코드가 다른 출처의 응답을 읽을 수 있는지 정하는 HTTP 정책을 설정합니다. 이것은 서버 사용자 인증을 대신하지 않습니다.`,
      example: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://learn.example"],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.get("/courses")
async def list_courses():
    return {"items": []}`,
      choice: {
        prompt: `FastAPI 앱에 브라우저 교차 출처 응답 정책을 구성할 때 CORSMiddleware를 가져오는 올바른 모듈 경로는 무엇인가요?`,
        correct: `from fastapi.middleware.cors import CORSMiddleware`,
        correctFeedback: `FastAPI는 편의 경로 fastapi.middleware.cors에서 Starlette CORS middleware를 가져올 수 있습니다.`,
        incorrect: [
          { text: `from fastapi import CORSMiddleware`, feedback: `CORSMiddleware는 fastapi 최상위 모듈에서 가져오는 이름이 아닙니다. middleware.cors 모듈 경로를 사용하세요.` },
          { text: `from fastapi.middleware import CORS`, feedback: `클래스 이름과 모듈 경로가 모두 다릅니다. 공식 예제의 이름은 CORSMiddleware입니다.` },
        ],
        hint: `공식 경로에는 FastAPI middleware 묶음 아래 cors 하위 모듈이 있습니다.`,
        explanation: `from fastapi.middleware.cors import CORSMiddleware가 올바른 import입니다. 가져온 뒤 app.add_middleware로 앱에 등록해야 브라우저 응답 정책이 설정됩니다.`,
      },
      short: {
        prompt: `FastAPI가 제공하는 CORS middleware 클래스를 가져오는 Python import 문을 적으세요.`,
        answers: [`from fastapi.middleware.cors import CORSMiddleware`],
        hint: `패키지 경로의 마지막 하위 모듈은 cors이고 클래스 이름은 CORSMiddleware입니다.`,
        explanation: `정확한 import는 from fastapi.middleware.cors import CORSMiddleware입니다. import만으로 정책이 적용되지는 않으며 앱 middleware 등록도 필요합니다.`,
      },
      locate: {
        prompt: `CORS middleware를 등록하는 예제에서 존재하지 않는 최상위 import 경로를 사용한 줄을 찾으세요.`,
        lines: [`from fastapi import CORSMiddleware`, `app.add_middleware(CORSMiddleware, allow_origins=["https://learn.example"])`],
        line: 1,
        hint: `공식 import가 fastapi 패키지의 어느 하위 모듈에 있는지 살펴보세요.`,
        explanation: `1번 줄은 CORSMiddleware를 FastAPI 최상위에서 가져오려 합니다. from fastapi.middleware.cors import CORSMiddleware를 사용해야 합니다.`,
      },
    },
    {
      intro: `Origin은 scheme·host·port의 조합이며 경로는 포함하지 않습니다. credential을 쓸 때는 요청 Origin을 검증 가능한 명시적 목록으로 제한하세요.`,
      example: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["https://learn.example", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)`,
      choice: {
        prompt: `쿠키 인증을 쓰는 개발 API에서 HTTPS 배포 화면과 localhost 개발 화면만 허용하려면 어떤 origin 설정이 적절한가요?`,
        correct: `allow_origins=["https://learn.example", "http://localhost:5173"]`,
        correctFeedback: `Origin은 scheme·host·port를 포함합니다. 필요한 두 출처를 정확한 값으로 나열해 경계를 명확히 합니다.`,
        incorrect: [
          { text: `allow_origins=["https://learn.example/courses"]`, feedback: `Origin 값에는 URL 경로가 포함되지 않습니다. 브라우저 출처는 scheme·host·port 기준으로 비교합니다.` },
          { text: `allow_origins=["https://learn.example:8443", "http://localhost:5173"]`, feedback: `배포 origin의 port는 443인데 8443을 허용하면 서로 다른 origin이므로 실제 브라우저 출처가 일치하지 않습니다.` },
        ],
        hint: `출처에는 protocol, domain, port가 들어가고 path는 들어가지 않습니다.`,
        explanation: `allow_origins에 실제 브라우저 출처를 적습니다. Origin은 scheme·host·port 조합이므로 경로를 붙이지 말고 개발·운영 주소를 구분해 검토하세요.`,
      },
      short: {
        prompt: `쿠키 인증을 허용하면서 learn.example HTTPS 화면만 허용하는 CORSMiddleware의 origin 목록을 적으세요.`,
        answers: [`allow_origins=["https://learn.example"]`],
        hint: `credentials를 켠 정책에서는 wildcard 대신 필요한 실제 출처를 나열합니다.`,
        explanation: `allow_origins=["https://learn.example"]는 해당 scheme과 host를 허용합니다. credentials 설정을 함께 쓴다면 다른 CORS 목록도 wildcard가 아니어야 합니다.`,
      },
      locate: {
        prompt: `출처 비교는 URL 경로가 아니라 scheme·host·port로 해야 합니다. 경로를 origin 목록에 넣은 줄을 찾으세요.`,
        lines: [`origins = ["https://learn.example", "http://localhost:5173"]`, `app.add_middleware(CORSMiddleware, allow_origins=origins)`, `bad_origin = "https://learn.example/courses"`],
        line: 3,
        hint: `Origin 문자열에는 /courses 같은 리소스 경로를 붙이지 않습니다.`,
        explanation: `3번 줄의 bad_origin은 path를 포함합니다. CORS 출처는 scheme·host·port 값으로 설정하고 URL의 개별 경로를 origin처럼 취급하지 않습니다.`,
      },
    },
    {
      intro: `CORS preflight는 브라우저가 실제 요청에 앞서 사용할 method와 header를 물을 수 있는 OPTIONS 교환입니다. allow_methods와 allow_headers는 이 브라우저 정책 목록입니다.`,
      example: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://learn.example"],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Browser preflight may request POST and Authorization.
# These settings do not decide which logged-in user may edit a course.`,
      choice: {
        prompt: `브라우저 preflight로 들어오는 POST와 Authorization header를 허용하려면 어느 두 목록에 값을 넣어야 하나요?`,
        correct: `allow_methods=["POST"]와 allow_headers=["Authorization"]`,
        correctFeedback: `HTTP method와 요청 header는 각각 allow_methods와 allow_headers에서 허용합니다.`,
        incorrect: [
          { text: `allow_origins=["POST", "Authorization"]`, feedback: `이 두 값은 브라우저 출처가 아니라 method와 header입니다. 각 값에 맞는 CORS 설정 목록을 사용하세요.` },
          { text: `allow_credentials=True만 설정`, feedback: `credential 허용은 method와 custom header preflight 허용을 대신하지 않습니다. 필요한 목록을 별도로 지정해야 합니다.` },
        ],
        hint: `요청 동사와 헤더 이름은 출처 목록이나 cookie 허용 값이 아니라 서로 다른 두 항목입니다.`,
        explanation: `POST는 allow_methods에, Authorization은 allow_headers에 둡니다. 이는 브라우저가 요청을 보낼 때 사용할 수 있는 CORS 범위이며 서버의 인증·인가 규칙은 별도로 적용됩니다.`,
      },
      short: {
        prompt: `POST 요청 method와 Authorization 요청 header를 모두 허용하는 설정 목록 두 개를 적으세요.`,
        answers: [`allow_methods=["POST"], allow_headers=["Authorization"]`, `allow_methods=["POST"]와 allow_headers=["Authorization"]`],
        hint: `HTTP 동사 목록과 요청 header 이름 목록은 서로 다른 설정입니다.`,
        explanation: `allow_methods=["POST"] 및 allow_headers=["Authorization"]처럼 각 정책 목록을 분리합니다. 이것만으로 endpoint의 사용자 권한이 허용되는 것은 아닙니다.`,
      },
      locate: {
        prompt: `Authorization은 method가 아니라 요청 header입니다. 잘못된 CORS allow_methods 항목을 담은 줄을 찾으세요.`,
        lines: [`app.add_middleware(CORSMiddleware,`, `    allow_methods=["GET", "Authorization"],`, `    allow_headers=["Content-Type"],`, `)`],
        line: 2,
        hint: `allow_methods에는 GET·POST 같은 HTTP method 이름이 들어갑니다.`,
        explanation: `2번 줄은 header 이름 Authorization을 method 목록에 넣었습니다. method는 allow_methods에, Authorization은 allow_headers에 설정하세요.`,
      },
    },
    {
      intro: `allow_credentials=True를 쓸 때 FastAPI의 CORSMiddleware는 allow_origins·allow_methods·allow_headers의 wildcard 목록을 허용하지 않습니다. 세 범위를 명시하세요.`,
      example: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://learn.example"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)`,
      choice: {
        prompt: `cookie credential을 허용하는 CORSMiddleware에서 origin·method·header 범위를 안전하게 선언한 구성은 무엇인가요?`,
        correct: `세 allow_* 목록에 필요한 실제 출처·method·header를 각각 명시`,
        correctFeedback: `credentials를 허용하면 FastAPI 안내에 따라 세 허용 목록을 wildcard로 둘 수 없고 명시해야 합니다.`,
        incorrect: [
          { text: `allow_credentials=True와 allow_origins=["*"]`, feedback: `credential을 포함한 응답에 모든 origin wildcard를 쓰는 조합은 이 middleware의 허용 조건에 맞지 않습니다.` },
          { text: `allow_credentials=True와 allow_headers=["*"]`, feedback: `credentials가 켜져 있을 때 header 허용 목록도 wildcard가 아니라 필요한 header를 구체적으로 지정해야 합니다.` },
        ],
        hint: `credentials를 켜면 출처뿐 아니라 method와 header 허용 범위도 제한 목록이어야 합니다.`,
        explanation: `allow_credentials=True와 함께 allow_origins, allow_methods, allow_headers 각각에 필요한 항목을 나열합니다. 세 목록 중 하나라도 wildcard로 두지 말고 실제 브라우저 요청을 기준으로 선택하세요.`,
      },
      short: {
        prompt: `예제에 나온 순서대로, wildcard로 둘 수 없는 CORSMiddleware 허용 목록 이름 세 개를 쉼표로 구분해 적으세요.`,
        answers: [`allow_origins, allow_methods, allow_headers`],
        hint: `브라우저 출처, HTTP 동사, 요청 header 이름에 대응하는 allow_* 설정입니다.`,
        explanation: `allow_origins, allow_methods, allow_headers는 credentials와 함께 wildcard 목록으로 둘 수 없으므로 필요한 값을 각각 명시합니다.`,
      },
      locate: {
        prompt: `credential 허용과 모든 origin wildcard를 동시에 선언한 잘못된 CORSMiddleware 설정 줄을 찾으세요.`,
        lines: [`app.add_middleware(CORSMiddleware,`, `    allow_origins=["*"],`, `    allow_credentials=True,`, `)`],
        line: 2,
        hint: `credential 허용은 origin 목록을 별표 하나로 열어 둘 수 없습니다.`,
        explanation: `2번 줄은 allow_origins wildcard를 사용합니다. credentials를 허용한다면 실제 origin을 명시하고 method·header 목록도 wildcard가 아닌 필요한 값으로 정하세요.`,
      },
    },
    {
      intro: `CORS는 브라우저 script가 cross-origin 응답을 읽을 수 있는지 제어하지만 서버 호출 자체의 사용자 권한 검사는 아닙니다. cookie 인증은 CSRF 방어도 별도로 검토해야 합니다.`,
      example: `from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()
# Assume get_current_user and find_course are defined by the application.

@app.post("/courses/{course_id}/publish")
async def publish_course(course_id: int, user=Depends(get_current_user)):
    course = find_course(course_id)
    if course.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"published": True}

# CORS only governs browser cross-origin response access.`,
      choice: {
        prompt: `CORS가 허용된 origin의 브라우저 요청이라도 서버에서 별도로 검사해야 하는 보안 조건은 무엇인가요?`,
        correct: `사용자 인증·리소스 권한과 cookie 사용 시 CSRF 방어`,
        correctFeedback: `CORS는 브라우저 응답 공유 경계이고 API의 인증·인가와 CSRF 보호를 대신하지 않습니다.`,
        incorrect: [
          { text: `Origin allowlist를 인증 성공으로 처리`, feedback: `Origin은 브라우저가 보내는 출처 정보이지 사용자의 신원이나 리소스 권한을 증명하는 자격 정보가 아닙니다.` },
          { text: `CORS에서 허용한 요청은 서버가 권한 검사 생략`, feedback: `CORS 헤더가 있어도 URL을 직접 호출하는 client가 있을 수 있고, 각 민감 endpoint에서 사용자 권한을 검사해야 합니다.` },
        ],
        hint: `브라우저가 응답을 읽을 수 있는지와 로그인 사용자가 작업 권한이 있는지는 별개의 질문입니다.`,
        explanation: `CORS는 브라우저가 cross-origin 응답을 script에 공개할지 제어합니다. 서버는 각 요청에서 인증과 리소스 인가를 검사해야 하며 cookie 자격 증명을 쓰면 CSRF도 별도로 설계하세요.`,
      },
      short: {
        prompt: `CORS allowlist만으로 해결되지 않아 API와 cookie 인증에서 별도로 처리할 보안 검사를 적으세요.`,
        answers: [`인증·인가와 CSRF 방어`, `사용자 인증 및 권한 검사, cookie 사용 시 CSRF 보호`],
        hint: `브라우저 응답 공유 정책, 사용자 신원, 사용자 권한, cookie 요청 위조는 각각 다른 경계입니다.`,
        explanation: `각 요청의 사용자 인증·인가를 계속 수행하고 cookie 인증이면 CSRF 방어도 둡니다. CORS 허용 origin은 인증 토큰이나 권한 증명이 아닙니다.`,
      },
      locate: {
        prompt: `Origin header가 허용 목록에 있다는 이유로 사용자를 인증된 것으로 처리한 잘못된 권한 검사 줄을 찾으세요.`,
        lines: [`origin = request.headers.get("Origin")`, `if origin in allowed_origins:`, `    return {"authorized": True}`],
        line: 3,
        hint: `요청 출처 문자열은 로그인 주체의 신원을 증명하지 않습니다.`,
        explanation: `3번 줄은 CORS origin을 권한 성공으로 사용합니다. 인증된 사용자를 식별하고 리소스별 권한을 확인하며 cookie 인증이면 CSRF 정책도 적용해야 합니다.`,
      },
    },
  ],
  26: [
    {
      intro: `FastAPI는 경로 함수의 BackgroundTasks 타입 매개변수를 찾아 요청별 객체를 주입합니다. 수동으로 새 객체를 만들어 함수에 넘기는 패턴이 아닙니다.`,
      example: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_audit(event: str):
    print(event)

@app.post("/events")
async def create_event(background_tasks: BackgroundTasks):
    background_tasks.add_task(write_audit, "event-created")
    return {"accepted": True}`,
      choice: {
        prompt: `FastAPI path operation에서 응답 뒤 처리할 task 등록 객체를 주입받는 타입 선언은 무엇인가요?`,
        correct: `background_tasks: BackgroundTasks`,
        correctFeedback: `FastAPI가 BackgroundTasks 타입 매개변수를 인식해 요청에 사용할 객체를 만들어 전달합니다.`,
        incorrect: [
          { text: `background_tasks = BackgroundTasks()를 endpoint 안에서 직접 생성`, feedback: `직접 생성한 별도 객체는 FastAPI가 응답 수명에 연결해 처리하는 주입 경로가 아닙니다. 타입 매개변수로 선언하세요.` },
          { text: `background_tasks: BackgroundTask`, feedback: `FastAPI 경로 매개변수로 주입받는 이름은 복수형 BackgroundTasks입니다. Starlette의 단일 BackgroundTask와 혼동하지 마세요.` },
        ],
        hint: `FastAPI 공식 tutorial이 path function 매개변수에 지정하는 plural 클래스입니다.`,
        explanation: `background_tasks: BackgroundTasks라고 선언하면 FastAPI가 요청 처리에 사용할 task 묶음을 주입합니다. 이 객체에 add_task를 등록해야 응답 후 실행 흐름에 연결됩니다.`,
      },
      short: {
        prompt: `FastAPI path operation이 백그라운드 task 등록 객체를 주입받도록 하는 매개변수 선언을 적으세요.`,
        answers: [`background_tasks: BackgroundTasks`],
        hint: `FastAPI가 알아서 제공하므로 함수 내부에서 BackgroundTasks 객체를 만들 필요가 없습니다.`,
        explanation: `background_tasks: BackgroundTasks 타입 매개변수를 선언합니다. FastAPI가 객체를 전달하며 이 객체는 add_task 호출에 사용됩니다.`,
      },
      locate: {
        prompt: `FastAPI가 관리하는 task collector를 주입받아야 하는데 endpoint 내부에서 별도 객체를 만든 줄을 찾으세요.`,
        lines: [`@app.post("/events")`, `async def create_event():`, `    tasks = BackgroundTasks()`, `    tasks.add_task(write_audit, "created")`],
        line: 3,
        hint: `경로 함수 매개변수의 타입 선언으로 주입받는지 확인하세요.`,
        explanation: `3번 줄은 FastAPI 요청 수명과 연결되지 않은 객체를 수동 생성합니다. ` + '`background_tasks: BackgroundTasks`' + ` 매개변수를 받아 그 객체에 task를 등록하세요.`,
      },
    },
    {
      intro: `add_task는 실행 callable과 그 callable에 전달할 인자를 등록합니다. 괄호를 붙여 path operation 안에서 직접 실행하지 않습니다.`,
      example: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_notice(course_id: int, message: str):
    print(course_id, message)

@app.post("/courses/{course_id}/publish")
async def publish_course(course_id: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_notice, course_id, message="published")
    return {"course_id": course_id, "status": "published"}`,
      choice: {
        prompt: `course_id와 keyword message를 write_notice에 넘기되 지금 직접 호출하지 않고 task로 등록하는 코드는 무엇인가요?`,
        correct: `background_tasks.add_task(write_notice, course_id, message="published")`,
        correctFeedback: `add_task에 callable을 먼저 전달하고 이후 위치 인자와 keyword 인자를 등록합니다.`,
        incorrect: [
          { text: `background_tasks.add_task(write_notice(course_id, "published"))`, feedback: `괄호 안 호출식이 먼저 실행되어 결과값이 add_task에 전달됩니다. 실행 함수 자체와 인자를 각각 전달해야 합니다.` },
          { text: `background_tasks.add_task("write_notice", course_id)`, feedback: `task에는 함수 이름 문자열이 아니라 호출 가능한 함수 객체를 넘겨야 합니다.` },
        ],
        hint: `add_task의 첫 인자는 호출 가능한 객체이며 이후 값은 실행할 때 전달할 인자입니다.`,
        explanation: `background_tasks.add_task(write_notice, course_id, message="published")는 함수 객체와 위치·keyword 인자를 등록합니다. write_notice(...)처럼 먼저 호출하면 응답 후 실행할 task가 아니라 즉시 계산한 결과를 넘깁니다.`,
      },
      short: {
        prompt: `write_notice 함수에 course_id와 message keyword 값을 넘기는 add_task 호출 한 줄을 적으세요.`,
        answers: [`background_tasks.add_task(write_notice, course_id, message="published")`],
        hint: `함수 이름 뒤 괄호를 붙이지 않고 callable 다음에 위치 및 keyword 인자를 씁니다.`,
        explanation: `add_task의 callable은 write_notice이고 course_id와 message는 나중에 함수로 전달할 값입니다.`,
      },
      locate: {
        prompt: `백그라운드 실행을 예약해야 하는데 함수가 endpoint 안에서 즉시 실행되도록 작성한 줄을 찾으세요.`,
        lines: [`async def publish(course_id, background_tasks):`, `    background_tasks.add_task(write_notice(course_id, "published"))`, `    return {"ok": True}`],
        line: 2,
        hint: `등록 시 함수 객체를 넘기는지 이미 실행한 결과를 넘기는지 구별하세요.`,
        explanation: `2번 줄은 write_notice를 즉시 호출합니다. ` + '`background_tasks.add_task(write_notice, course_id, "published")`' + `처럼 callable과 인자를 분리해서 등록하세요.`,
      },
    },
    {
      intro: `BackgroundTasks는 response 전송 뒤 같은 앱 응답 흐름에서 작은 후속 작업을 실행합니다. 클라이언트는 task 완료를 기다리는 API 응답 계약을 받지 않습니다.`,
      example: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_optional_receipt(receipt_id: str):
    print(receipt_id)

@app.post("/receipts")
async def create_receipt(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_optional_receipt, "receipt-42")
    return {"receipt_id": "receipt-42", "status": "created"}

# FastAPI sends the response before it runs this follow-up task.`,
      choice: {
        prompt: `클라이언트가 생성 응답을 먼저 받고 작은 후속 알림을 실행하는 BackgroundTasks의 시점은 언제인가요?`,
        correct: `응답을 보낸 뒤`,
        correctFeedback: `공식 기능은 응답 후 실행해 클라이언트가 그 작업 완료를 기다리지 않게 하는 용도입니다.`,
        incorrect: [
          { text: `응답 본문을 만들기 전에 반드시 끝남`, feedback: `경로 함수가 작업을 동기 호출하는 방식과 다릅니다. task는 response 뒤에 실행하도록 등록됩니다.` },
          { text: `다음 HTTP 요청이 올 때까지 대기`, feedback: `등록된 background task의 시작 조건은 다음 요청이 아니라 현재 response 처리의 후속 단계입니다.` },
        ],
        hint: `기능명보다 중요한 것은 response 전송과 후속 작업 사이의 순서입니다.`,
        explanation: `BackgroundTasks는 현재 응답이 전송된 뒤 작업을 처리합니다. 따라서 클라이언트의 201 응답은 성공할 수 있어도 후속 task가 끝났다는 뜻이나 durable 완료 증명은 아닙니다.`,
      },
      short: {
        prompt: `BackgroundTasks가 클라이언트 응답을 먼저 보내고 등록 작업을 실행하는 순서를 적으세요.`,
        answers: [`응답을 보낸 뒤`, `response 전송 후`],
        hint: `path operation이 응답을 반환한 시점 다음에 등록된 task가 실행됩니다.`,
        explanation: `작은 background task는 응답 전송 이후에 실행됩니다. 즉 response 완료 시점은 작업 완료를 보장하지 않습니다.`,
      },
      locate: {
        prompt: `BackgroundTasks가 response 뒤에 실행된다는 특징과 반대로 task 완료 후에만 응답을 반환하는 주석 줄을 찾으세요.`,
        lines: [`background_tasks.add_task(send_optional_receipt, receipt_id)`, `return {"receipt_id": receipt_id}`, `# task 완료 전에는 response를 전송하지 않는다`],
        line: 3,
        hint: `BackgroundTasks는 client가 후속 작업 완료까지 기다리지 않게 하는 API입니다.`,
        explanation: `3번 줄은 실행 순서를 거꾸로 설명합니다. 경로 함수는 response를 반환하고 FastAPI/Starlette가 response 전송 후 등록한 task를 실행합니다.`,
      },
    },
    {
      intro: `BackgroundTasks는 실행 프로세스 안의 작은 후속 작업 편의 기능이며 durable job queue가 아닙니다. 프로세스 종료·재시작 후 재처리와 성공 보장을 전제로 하면 안 됩니다.`,
      example: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_best_effort_notice(user_id: str):
    print(user_id)

@app.post("/welcome")
async def create_welcome(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_best_effort_notice, "user-17")
    return {"accepted": True}

# Do not treat this in-process task as a durable delivery record.`,
      choice: {
        prompt: `결제 확인 작업이 프로세스 종료 뒤에도 반드시 재시도되어야 한다면 어떤 내구성 경계를 추가해야 하나요?`,
        correct: `내구성 있는 작업 기록·재시도 경계를 가진 별도 작업 큐와 worker`,
        correctFeedback: `중요하고 내구성이 필요한 작업은 프로세스 메모리에만 의존하지 않는 별도 처리 경계가 필요합니다.`,
        incorrect: [
          { text: `BackgroundTasks에 등록하면 자동으로 영속화됨`, feedback: `FastAPI BackgroundTasks는 durable queue나 재시도 저장소가 아니므로 프로세스 종료 뒤 작업 복구를 자동 보장하지 않습니다.` },
          { text: `HTTP response가 202이면 job이 디스크에 저장됨`, feedback: `상태 코드만으로 큐 저장·worker 수행·재시도나 완료 내구성은 만들어지지 않습니다.` },
        ],
        hint: `응답 후 작업의 편의와 프로세스가 사라져도 남는 작업 기록은 다릅니다.`,
        explanation: `재시도와 worker 간 전달이 필요한 중요 작업은 durable queue와 저장 경계를 설계합니다. BackgroundTasks는 작은 same-process 후속 작업에 한정하고 response 코드를 내구성 약속으로 쓰지 마세요.`,
      },
      short: {
        prompt: `서버 프로세스가 종료되어도 중요 작업의 재시도와 보존을 책임지는 별도 처리 구조를 적으세요.`,
        answers: [`내구성 있는 작업 큐와 worker`, `작업 큐와 재시도 가능한 worker`],
        hint: `in-process 응답 후 task와 다중 프로세스에서 관리되는 job 저장 경계를 떠올리세요.`,
        explanation: `durable queue와 worker가 작업 보존·재시도 경계를 담당합니다. BackgroundTasks만으로 서버 재시작 뒤 작업 복구를 주장하면 안 됩니다.`,
      },
      locate: {
        prompt: `응답 후 task 등록만으로 서버 재시작 뒤 자동 재시도가 보장된다고 단정한 잘못된 설명 줄을 찾으세요.`,
        lines: [`background_tasks.add_task(send_best_effort_notice, user_id)`, `return {"accepted": True}`, `# 프로세스 재시작 뒤에도 task가 자동 복구된다`],
        line: 3,
        hint: `BackgroundTasks는 지속 저장소와 queue가 아니라 같은 앱 처리 경로의 후속 실행입니다.`,
        explanation: `3번 줄은 작업 내구성을 과장합니다. 재시작 후 보존·재시도가 필요하면 별도 queue와 worker를 설계해야 합니다.`,
      },
    },
    {
      intro: `작은 알림과 무거운 계산은 요구가 다릅니다. 대용량 보고서·CPU 작업·여러 서버 재시도가 필요하면 별도 worker 구조를 검토하되 운영 broker 비용과 장애 책임도 고려하세요.`,
      example: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_small_ready_notice(report_id: str):
    print(report_id)

@app.post("/reports")
async def request_report(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_small_ready_notice, "report-42")
    # Heavy report generation needs a separate execution design.
    return {"report_id": "report-42", "status": "requested"}

# The static study runner does not provision a queue or worker.`,
      choice: {
        prompt: `수 분 걸리는 대용량 보고서를 여러 worker에서 처리하고 재시도해야 할 때 검토할 방향은 무엇인가요?`,
        correct: `별도 job queue와 worker를 설계하고 broker·운영 요구도 함께 평가`,
        correctFeedback: `FastAPI 문서는 무거운 계산이나 다른 프로세스가 필요한 경우 더 큰 task 도구를 고려하도록 설명합니다.`,
        incorrect: [
          { text: `모든 보고서 계산을 BackgroundTasks 한 개에 등록`, feedback: `단일 앱 프로세스의 편의 기능은 장시간·분산·내구성 처리 요구를 충족한다고 보장하지 않습니다.` },
          { text: `async def로 바꾸면 자동으로 별도 worker와 재시도 제공`, feedback: `async 문법은 queue·다중 process·재시도·지속 저장을 제공하지 않습니다.` },
        ],
        hint: `같은 응답 프로세스에서 이어지는 작은 작업인지 분산 실행·재시도가 필요한 작업인지 비교하세요.`,
        explanation: `오래 걸리고 여러 worker·재시도가 필요한 작업은 별도 queue와 worker 경계를 검토합니다. 이 선택에는 broker·관찰·장애 복구 같은 운영 책임이 따르며 사이트 과정이 무료 worker를 제공한다는 의미는 아닙니다.`,
      },
      short: {
        prompt: `장시간 계산을 여러 프로세스에서 분리하고 재시도하려면 BackgroundTasks 밖에 어떤 실행 경계가 필요한가요?`,
        answers: [`별도 job queue와 worker`, `분산 작업 큐와 worker`],
        hint: `다른 프로세스나 여러 서버가 처리할 수 있도록 중간에 durable 작업 전달 경계를 둡니다.`,
        explanation: `별도 작업 queue와 worker가 분산 실행과 재시도 설계의 기반입니다. 필요한 broker와 운영 지원을 검토해야 합니다.`,
      },
      locate: {
        prompt: `대규모 분산 계산과 재시도까지 BackgroundTasks가 제공한다고 과장한 줄을 찾으세요.`,
        lines: [`background_tasks.add_task(send_small_ready_notice, report_id)`, `return {"status": "requested"}`, `# 이 한 줄이 다중 서버 실행과 durable 재시도를 보장한다`],
        line: 3,
        hint: `응답 후 로컬 작업 등록과 durable 분산 queue는 보장하는 범위가 다릅니다.`,
        explanation: `3번 줄은 보장 범위를 과장합니다. 여러 worker와 durable retry가 필요하면 별도 작업 전달 시스템을 설계하고 운영 조건을 검토해야 합니다.`,
      },
    },
  ],
  27: [
    {
      intro: `Pydantic Settings는 운영체제 환경 설정을 읽고 타입이 있는 Settings 객체로 검증하는 별도 패키지입니다. FastAPI route 실행이나 서버 환경은 브라우저에서 생기지 않습니다.`,
      example: `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Study API"
    items_per_user: int = 50

settings = Settings()

# pydantic-settings reads process environment when Settings is created.`,
      choice: {
        prompt: `Settings 모델에서 운영체제 환경변수를 읽는 BaseSettings는 어느 패키지에서 가져오나요?`,
        correct: `from pydantic_settings import BaseSettings`,
        correctFeedback: `FastAPI Settings guide는 Pydantic Settings 패키지의 BaseSettings를 사용하도록 안내합니다.`,
        incorrect: [
          { text: `from fastapi import BaseSettings`, feedback: `BaseSettings는 FastAPI의 최상위 import가 아닙니다. 별도 pydantic-settings 패키지에서 가져옵니다.` },
          { text: `from pydantic import BaseSettings`, feedback: `현재 FastAPI Settings 안내는 BaseSettings를 pydantic_settings 패키지에서 가져옵니다. 패키지 경계를 확인하세요.` },
        ],
        hint: `환경 변수 설정 패키지 이름은 FastAPI 자체나 BaseModel import 경로와 다릅니다.`,
        explanation: `from pydantic_settings import BaseSettings를 사용합니다. pydantic-settings는 별도 의존성이므로 이 개념 예제가 웹 사이트에 그 패키지가 설치됐다는 뜻은 아닙니다.`,
      },
      short: {
        prompt: `Pydantic Settings의 BaseSettings를 가져오는 정확한 Python import 문을 적으세요.`,
        answers: [`from pydantic_settings import BaseSettings`],
        hint: `최상위 import 모듈은 pydantic_settings입니다.`,
        explanation: `BaseSettings는 pydantic_settings 패키지에서 import합니다. 별도 Python 프로젝트에서 실행하려면 해당 dependency가 필요합니다.`,
      },
      locate: {
        prompt: `환경 변수 기반 설정 클래스를 선언하면서 FastAPI에 존재하지 않는 BaseSettings import를 쓴 줄을 찾으세요.`,
        lines: [`from fastapi import BaseSettings`, `class Settings(BaseSettings):`, `    app_name: str = "Study API"`],
        line: 1,
        hint: `환경 설정 관리 패키지와 API 프레임워크 패키지를 구분하세요.`,
        explanation: `1번 줄의 FastAPI import는 잘못되었습니다. from pydantic_settings import BaseSettings를 사용해야 하며 이 패키지는 별도 설치 대상입니다.`,
      },
    },
    {
      intro: `환경 변수 값은 외부에서 문자열로 들어와 Settings가 필드 타입으로 변환·검증합니다. 기본값이 없는 필수 설정은 실행 환경에서 제공되어야 합니다.`,
      example: `from pydantic import SecretStr
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: SecretStr
    max_connections: int = 10

# DATABASE_URL is supplied by the server environment.`,
      choice: {
        prompt: `database_url을 소스 기본값에 기록하지 않고 배포 환경에서 필수로 받으려면 어떤 선언이 적절한가요?`,
        correct: `database_url: SecretStr`,
        correctFeedback: `필드에 기본값이 없으므로 Settings 생성 시 해당 이름의 유효한 설정 값이 필요하고 SecretStr은 표시를 가립니다.`,
        incorrect: [
          { text: `database_url: str = "postgresql://user:password@host/db"`, feedback: `실제 자격 증명을 코드 기본값으로 커밋할 수 있고 일반 문자열 출력에서 비밀값을 가리는 보호도 없습니다.` },
          { text: `database_url: SecretStr = ""`, feedback: `빈 문자열 기본값을 두면 필수 환경 설정이 누락되어도 객체 생성 시 누락을 명확히 알리지 않을 수 있습니다.` },
        ],
        hint: `필수 비밀 설정은 기본값 없이 SecretStr 타입 필드로 선언할 수 있습니다.`,
        explanation: `database_url: SecretStr은 기본값이 없어 환경 등 설정 source에서 값을 공급해야 합니다. SecretStr은 출력 표현을 가리지만 암호화나 접근 권한 관리까지 제공하지 않으므로 비밀 공급 경계가 여전히 필요합니다.`,
      },
      short: {
        prompt: `기본값 없이 Settings에서 필수 데이터베이스 비밀을 표현하는 SecretStr 필드 선언을 적으세요.`,
        answers: [`database_url: SecretStr`],
        hint: `필수 필드는 기본값을 지정하지 않고 secret 타입을 붙입니다.`,
        explanation: `database_url: SecretStr은 기본값이 없는 필수 field입니다. SecretStr은 출력 마스킹을 돕지만 저장된 비밀을 암호화하는 것은 아닙니다.`,
      },
      locate: {
        prompt: `운영 데이터베이스 password를 소스 코드 문자열에 포함한 잘못된 설정 줄을 찾으세요.`,
        lines: [`class Settings(BaseSettings):`, `    database_url: str = "postgresql://learner:real-secret@db/course"`, `    max_connections: int = 10`],
        line: 2,
        hint: `운영 자격 증명을 version control에 남기는 literal 기본값인지 확인하세요.`,
        explanation: `2번 줄은 자격 증명 문자열을 코드에 포함합니다. 비밀은 운영 환경에서 공급하고 secret field와 안전한 출력·접근 정책을 함께 적용하세요.`,
      },
    },
    {
      intro: `SettingsConfigDict의 env_prefix로 환경 변수 이름 공간을 지정할 수 있습니다. 예를 들어 APP_ prefix는 app_name과 items_per_user 값을 구분해 배포합니다.`,
      example: `from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_")
    app_name: str = "Study API"
    items_per_user: int = 50

# APP_ITEMS_PER_USER=25 maps to items_per_user.`,
      choice: {
        prompt: `Settings의 필드 이름 앞에 APP_를 붙여 환경 변수 이름을 구성하는 Pydantic 설정은 무엇인가요?`,
        correct: `model_config = SettingsConfigDict(env_prefix="APP_")`,
        correctFeedback: `env_prefix는 Settings 필드에서 환경 변수 이름을 구성할 때 공통 prefix를 지정합니다.`,
        incorrect: [
          { text: `model_config = SettingsConfigDict(alias="APP_")`, feedback: `이름 prefix를 지정하는 옵션은 alias가 아니라 env_prefix이며, alias는 개별 필드 이름 매핑과 다른 용도입니다.` },
          { text: `model_config = SettingsConfigDict(env_file="APP_")`, feedback: `env_file은 dotenv 파일 경로를 지정하는 설정이지 모든 환경 변수 이름 앞의 prefix를 설정하지 않습니다.` },
        ],
        hint: `SettingsConfigDict에서 환경 변수의 공통 시작 문자열을 뜻하는 항목 이름을 찾으세요.`,
        explanation: `SettingsConfigDict(env_prefix="APP_")를 모델 설정으로 지정하면 app_name 같은 field에 대응하는 환경 변수에 APP_ 접두어가 적용됩니다. 실제 플랫폼 값은 서버 실행 환경이 공급합니다.`,
      },
      short: {
        prompt: `Pydantic Settings에서 모든 환경 변수 이름에 APP_ 접두어를 적용하는 model_config 선언을 적으세요.`,
        answers: [`model_config = SettingsConfigDict(env_prefix="APP_")`],
        hint: `파일 이름 대신 env 변수 name prefix를 지정하는 SettingsConfigDict 옵션입니다.`,
        explanation: `model_config = SettingsConfigDict(env_prefix="APP_")는 필드별 환경 변수 이름에 공통 접두어를 적용합니다.`,
      },
      locate: {
        prompt: `환경 변수 이름에 APP_를 붙이려는데 파일 이름 옵션에 prefix를 넣은 설정 줄을 찾으세요.`,
        lines: [`class Settings(BaseSettings):`, `    model_config = SettingsConfigDict(env_file="APP_")`, `    app_name: str = "Study API"`],
        line: 2,
        hint: `dotenv file 경로와 환경 변수 이름 prefix를 위한 설정 이름은 다릅니다.`,
        explanation: `2번 줄은 env_file을 prefix처럼 사용합니다. 공통 environment variable prefix는 SettingsConfigDict(env_prefix="APP_")로 선언하세요.`,
      },
    },
    {
      intro: `Field description은 설정값의 목적·단위·필수 조건을 문서화하는 데 도움을 줍니다. 기본값·환경변수 이름·비밀 공급 위치를 운영 문서에 따로 설명하세요.`,
      example: `from pydantic import SecretStr, Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = Field(default="Study API", description="공개 서비스 이름")
    database_url: SecretStr = Field(description="운영 환경에서 주입하는 DB 연결 문자열")

# Document required settings without publishing their values.`,
      choice: {
        prompt: `운영자가 설정 필드의 의미를 이해하게 하면서 실제 secret 값을 문서에 노출하지 않는 데 도움이 되는 표현은 무엇인가요?`,
        correct: `Field(description="설정의 용도와 공급 조건")`,
        correctFeedback: `Field의 description으로 목적과 의미를 설명하고 운영 문서에는 값이 아닌 이름·필수 여부·공급 경계를 기록합니다.`,
        incorrect: [
          { text: `Field(default="실제-운영-API-키")`, feedback: `실제 secret을 문서형 기본값에 포함하면 저장소·문서·오류 경로로 유출될 수 있습니다.` },
          { text: `설정의 type과 필요한 환경 변수를 전부 생략`, feedback: `운영자가 필수 값·자료형·공급 위치를 알 수 없어 환경을 안전하게 구성하거나 오류를 진단하기 어렵습니다.` },
        ],
        hint: `필드 metadata에는 사람에게 설명할 텍스트를 두고 credential 자체는 넣지 마세요.`,
        explanation: `Field(description=...)는 설정의 의미를 보태지만 secret 값을 안전하게 보관하거나 환경 설정 문서를 자동 완성하는 만능 비밀 관리 기능은 아닙니다. 이름·필수 여부·공급 위치를 문서화하고 값은 안전한 실행 환경으로 주입하세요.`,
      },
      short: {
        prompt: `Pydantic field의 의미를 설명하는 metadata를 선언할 때 사용하는 표준 helper 이름을 적으세요.`,
        answers: [`Field(description=...)`, `Field(description="설명")`],
        hint: `기본값과 field metadata를 선언하는 Pydantic 함수입니다.`,
        explanation: `Field(description=...)로 field 용도나 제한을 설명할 수 있습니다. secret 실제 값을 description이나 기본값에 기록하지 마세요.`,
      },
      locate: {
        prompt: `설정 문서를 만들면서 field 설명에 실제 API key 값을 넣은 위험한 줄을 찾으세요.`,
        lines: [`class Settings(BaseSettings):`, `    api_key: SecretStr = Field(description="예시 key 값: example-only-not-a-secret")`, `    app_name: str = Field(description="공개 API 이름")`],
        line: 2,
        hint: `description은 문서화 metadata이므로 secret 실제 값이 들어가면 안 됩니다.`,
        explanation: `2번 줄은 API key의 실제-looking 값을 설명 metadata에 포함합니다. 목적과 안전한 source만 문서화하고 비밀 값은 runtime 환경에 둡니다.`,
      },
    },
    {
      intro: `Settings 예제는 서버 프로세스 환경을 가정합니다. 정적 브라우저 앱에는 서버 환경 변수나 비밀 저장소가 없으므로 API key·DB 자격 정보를 내려 보내면 안 됩니다.`,
      example: `# Server-side Python only; the static browser page cannot read this value.
from pydantic import SecretStr
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_key: SecretStr

# Supply API_KEY through a protected server runtime, never frontend JavaScript.`,
      choice: {
        prompt: `브라우저 정적 사이트가 외부 API key를 필요로 할 때 secret을 보호할 올바른 책임 경계는 무엇인가요?`,
        correct: `키를 브라우저 bundle에 넣지 말고 보호된 서버 경계에서 공급`,
        correctFeedback: `브라우저가 받은 코드와 값은 방문자가 볼 수 있으므로 비밀 자격 증명은 서버 환경에서만 사용해야 합니다.`,
        incorrect: [
          { text: `SecretStr로 감싼 뒤 API key를 frontend bundle에 포함`, feedback: `SecretStr은 Python 표시를 가리는 타입일 뿐 브라우저에서 내려간 문자열·bundle을 비밀로 만들지 않습니다.` },
          { text: `운영 API key를 localStorage에 저장해 client에서 사용`, feedback: `브라우저 저장소는 사용자 기기의 client-accessible 데이터라 secret 보호용 서버 vault가 아닙니다.` },
        ],
        hint: `최종 사용자에게 전달된 브라우저 JavaScript와 저장값은 숨겨진 server environment가 아닙니다.`,
        explanation: `운영 secret은 보호된 서버 runtime이 읽고 필요에 따라 서버가 API를 호출해야 합니다. SecretStr·난독화·localStorage는 browser에 전달한 자격 증명을 기밀로 보관하지 못합니다.`,
      },
      short: {
        prompt: `정적 브라우저 bundle에 포함하지 않고 운영 API key를 공급할 올바른 실행 환경 경계를 적으세요.`,
        answers: [`보호된 서버 runtime 환경`, `서버 쪽 비밀 설정 경계`],
        hint: `사용자에게 내려가는 JavaScript가 아니라 환경변수를 읽는 server process입니다.`,
        explanation: `API key는 보호된 서버 실행 환경에서 공급해야 합니다. 이 프로젝트의 정적 웹 실행기에는 서버 secret 환경이나 backend 호출 대리 기능이 없습니다.`,
      },
      locate: {
        prompt: `서버 비밀 경계를 설명하면서 운영 자격 증명을 브라우저 localStorage로 전달하는 위험한 줄을 찾으세요.`,
        lines: [`settings = Settings()`, `api_key = settings.api_key.get_secret_value()`, `localStorage.setItem("api-key", api_key)`],
        line: 3,
        hint: `localStorage 값은 browser code와 사용자에게 노출될 수 있습니다.`,
        explanation: `3번 줄은 서버 secret을 브라우저에 저장합니다. key가 필요한 네트워크 작업은 보호된 서버 경계에서 수행하고 실제 secret을 frontend로 반환하지 마세요.`,
      },
    },
  ],
  28: [
    {
      intro: `운영 로그에는 요청 상관관계와 결과처럼 문제를 찾는 데 필요한 제한된 필드를 남기세요. Python logging extra는 record metadata를 보태며 JSON 직렬화는 handler formatter 설정이 맡습니다.`,
      example: `import logging

logger = logging.getLogger(__name__)

def log_course_result(request_id: str, status_code: int, item_count: int):
    logger.info(
        "courses.listed",
        extra={"request_id": request_id, "status_code": status_code, "item_count": item_count},
    )`,
      choice: {
        prompt: `요청을 진단할 수 있으면서 자격 증명과 사용자 원문을 로그에서 제외하는 제한된 log 필드 조합은 무엇인가요?`,
        correct: `request_id·status_code·결과 수처럼 최소 운영 필드만 기록`,
        correctFeedback: `상관관계 ID와 응답 결과 같은 제한된 메타데이터는 필요한 범위의 진단에 도움을 줍니다.`,
        incorrect: [
          { text: `Authorization header와 전체 요청 본문을 매 요청 저장`, feedback: `header에는 bearer token이 있고 본문에는 개인정보나 비밀 값이 있을 수 있어 원문 저장은 유출 영향을 키웁니다.` },
          { text: `모든 환경 변수와 전체 traceback을 일반 요청 로그에 포함`, feedback: `환경 변수와 traceback에는 credential·내부 경로·민감 데이터가 들어갈 수 있으므로 접근·마스킹·별도 오류 수집 정책이 필요합니다.` },
        ],
        hint: `요청 연결에 필요한 식별자와 처리 결과만 남기고 payload와 인증 자료는 제외하세요.`,
        explanation: `request_id, status_code, item_count처럼 진단 목적이 있는 제한 필드부터 선택합니다. authorization·본문은 민감할 수 있으며 logging extra만으로 JSON formatter나 비밀 마스킹이 자동 설정되지는 않습니다.`,
      },
      short: {
        prompt: `자격 증명이나 본문 원문 없이 요청을 추적할 두 가지 낮은 민감도 운영 필드 예시를 적으세요.`,
        answers: [`request_id와 status_code`, `request_id, status_code`],
        hint: `요청 상관관계와 결과 상태를 나타내는 필드 두 개를 쓰세요.`,
        explanation: `request_id와 status_code는 진단에 도움이 되는 메타데이터입니다. 값이 사용자 식별자로 쓰이지 않는지와 log formatter가 안전한지 별도로 검토하세요.`,
      },
      locate: {
        prompt: `구조화 로그에 요청 token과 전체 payload를 함께 기록하는 민감 정보 노출 줄을 찾으세요.`,
        lines: [`logger.info("request", extra={"request_id": request_id})`, `logger.info("incoming", extra={"authorization": token, "body": request_body})`],
        line: 2,
        hint: `access token과 사용자 원문이 log record에 저장되는지 살펴보세요.`,
        explanation: `2번 줄은 token과 전체 본문을 기록합니다. 요청 ID와 필요한 결과 코드만 남기고 민감 필드는 로깅 전에 제거하세요.`,
      },
    },
    {
      intro: `Liveness는 앱 진행 불가 상태에서 재시작 판단에, readiness는 트래픽을 받아도 되는지에 사용합니다. 시작이 오래 걸리면 startup probe를 둘 수 있으며 세 상태를 한 health 코드로 혼동하지 마세요.`,
      example: `from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    if not catalog_is_ready():
        raise HTTPException(status_code=503, detail="Not ready")
    return {"status": "ready"}

# catalog_is_ready is supplied by the application.`,
      choice: {
        prompt: `트래픽을 받을 준비가 끝났는지를 확인하려는 readiness probe의 목적을 올바르게 설명한 것은 무엇인가요?`,
        correct: `초기화·필수 준비가 끝나 요청을 받아도 되는지 판별`,
        correctFeedback: `Readiness 실패는 컨테이너가 아직 트래픽을 받을 준비가 되었는지 판단하는 신호입니다.`,
        incorrect: [
          { text: `실패할 때마다 프로세스를 무조건 재시작`, feedback: `반복 재시작은 liveness probe의 역할과 가깝습니다. readiness 실패는 보통 준비되지 않은 인스턴스로 트래픽을 보내지 않게 합니다.` },
          { text: `외부 DB 한 곳이 실패하면 liveness 실패로 앱을 재시작`, feedback: `공유 의존성 장애를 liveness로 연결하면 전체 replica가 재시작되어 장애와 트래픽 부하를 키울 수 있습니다.` },
        ],
        hint: `restart 판단, traffic 수신 준비, 최초 startup 완료는 각각 probe 역할이 다릅니다.`,
        explanation: `Readiness는 애플리케이션이 트래픽을 받아도 되는지 판단합니다. Liveness는 복구를 위해 재시작할 상태를 찾고 startup probe는 초기화 시간을 허용하므로 역할을 나누세요.`,
      },
      short: {
        prompt: `컨테이너가 서비스 트래픽을 받을 준비가 됐는지 판별하는 Kubernetes probe 이름을 적으세요.`,
        answers: [`readiness probe`, `Readiness`],
        hint: `Liveness는 restart 판단, Startup은 최초 초기화, 이 항목은 traffic 준비 상태입니다.`,
        explanation: `Readiness probe가 트래픽 수신 준비 여부를 판별합니다. endpoint 구현은 필수 준비 조건을 선택하되 모든 외부 장애를 restart 신호로 바꾸지 마세요.`,
      },
      locate: {
        prompt: `공유 catalog 장애를 readiness 상태가 아닌 liveness 실패로 연결해 모든 pod 재시작을 유발하는 잘못된 줄을 찾으세요.`,
        lines: [`@app.get("/health/live")`, `async def liveness():`, `    if not catalog_is_ready(): raise HTTPException(status_code=503)`],
        line: 3,
        hint: `외부 의존성 일시 장애와 애플리케이션의 진행 불가 상태를 나누세요.`,
        explanation: `3번 줄은 readiness 조건을 liveness에 넣습니다. 공유 서비스 장애에서 모든 인스턴스를 반복 재시작하지 않도록 traffic 준비 검사와 restart probe를 구별해야 합니다.`,
      },
    },
    {
      intro: `사용자에게 보이는 오류는 조치에 필요한 안전한 상태와 설명만 담고, 내부 예외·경로·query·자격 증명은 노출하지 않습니다. 서버 로그도 별도 접근·마스킹 정책을 둡니다.`,
      example: `from fastapi import HTTPException

async def read_course(course_id: int, request_id: str):
    try:
        return await catalog.get(course_id)
    except CatalogUnavailable:
        logger.error("catalog_unavailable", extra={"request_id": request_id})
        raise HTTPException(status_code=503, detail="Catalog temporarily unavailable")`,
      choice: {
        prompt: `내부 저장소 연결 오류가 났을 때 내부 비밀을 노출하지 않으면서 사용자 응답에 돌려줄 안전한 공개 정보의 범위는 무엇인가요?`,
        correct: `적절한 HTTP 상태와 내부 구현 비밀을 뺀 일반 설명`,
        correctFeedback: `외부 응답은 문제 이해에 필요한 정보만 주고 진단 세부는 접근을 제한한 server log로 다룹니다.`,
        incorrect: [
          { text: `exception 원문·DB host·stack trace를 detail에 그대로 포함`, feedback: `예외 원문은 credential·내부 네트워크 주소·파일 경로 등 공격에 도움 되는 정보를 포함할 수 있습니다.` },
          { text: `모든 장애를 200 상태와 성공 JSON으로 반환`, feedback: `성공 상태를 사용하면 client와 monitoring이 실패를 감지하고 적절히 복구하기 어려워집니다.` },
        ],
        hint: `클라이언트 안내와 운영 진단 정보를 같은 공개 응답에 섞지 마세요.`,
        explanation: `HTTP 상태와 “일시적으로 처리할 수 없음” 같은 안전한 detail을 공개하고, 제한된 운영 로그에 필요한 상관 정보만 남깁니다. raw exception과 traceback을 사용자 응답에 복사하지 마세요.`,
      },
      short: {
        prompt: `내부 오류에서 HTTP 상태는 유지하되 DB 주소·stack trace를 숨기는 응답 원칙을 적으세요.`,
        answers: [`안전한 일반 오류 설명만 공개`, `내부 구현 정보를 제외한 오류 설명`],
        hint: `문제 원인을 이해할 최소 문구와 내부 운영 진단 세부를 구분합니다.`,
        explanation: `사용자에게는 안전한 오류 설명과 적절한 상태 코드만 보이고 raw exception과 내부 주소는 제한된 진단 경로에 둡니다.`,
      },
      locate: {
        prompt: `DB 연결 예외 원문을 HTTP detail에 그대로 넣어 내부 정보를 공개할 수 있는 줄을 찾으세요.`,
        lines: [`try:`, `    return await catalog.get(course_id)`, `except CatalogUnavailable as exc:`, `    raise HTTPException(status_code=503, detail=str(exc))`],
        line: 4,
        hint: `예외 문자열이 host나 내부 메시지를 포함해 client에게 전달되는지 확인하세요.`,
        explanation: `4번 줄은 예외 원문을 공개 응답 detail로 반환합니다. 안전한 일반 문구를 쓰고 상세 원인은 접근이 제한된 server log에서 관리하세요.`,
      },
    },
    {
      intro: `로그 보관 기간·접근·수집 비용을 미리 정하고, metrics label에는 route template·상태처럼 값 종류가 제한된 차원을 사용합니다. user ID나 request ID는 cardinality를 크게 만들 수 있습니다.`,
      example: `route_template = "/courses/{course_id}"
metric_labels = {
    "route": route_template,
    "status_code": "200",
}

# Keep identifiers and raw query values out of metric labels.
log_retention_days = 14`,
      choice: {
        prompt: `요청별 metric 비용과 데이터 민감도 노출을 함께 줄이는 label 구성 원칙으로 알맞은 것은 무엇인가요?`,
        correct: `route template·status처럼 제한된 차원만 사용하고 user/request ID는 제외`,
        correctFeedback: `고정된 경로 형태와 상태 코드는 label 종류를 제한해 cardinality 증가를 억제합니다.`,
        incorrect: [
          { text: `각 metric에 user ID와 고유 request ID를 label로 추가`, feedback: `고유 ID마다 새 시계열이 만들어져 저장·조회 cardinality와 비용이 커지고 개인 연결 정보도 남길 수 있습니다.` },
          { text: `원시 query 문자열을 무제한 label로 사용`, feedback: `임의 query 값은 종류가 끝없이 늘 수 있어 집계와 저장 비용을 급격히 키울 수 있습니다.` },
        ],
        hint: `각 label 값의 가능한 고유 수가 제한되어 있는지 물어보세요.`,
        explanation: `route template와 소수의 status code처럼 제한된 label을 선택합니다. user ID·request ID·원시 query는 높은 cardinality와 민감도 위험 때문에 일반 metric label로 사용하지 마세요.`,
      },
      short: {
        prompt: `route 개별 ID를 제거하고 요청 지표에 사용할 안정적인 경로 표기 방식 이름을 적으세요.`,
        answers: [`route template`, `라우트 템플릿`],
        hint: `예를 들어 /courses/42 대신 /courses/{course_id}처럼 변수 모양을 씁니다.`,
        explanation: `route template을 쓰면 ID 값마다 별도 시계열이 만들어지는 문제를 줄이고 endpoint 단위로 결과를 집계할 수 있습니다.`,
      },
      locate: {
        prompt: `모든 사용자별로 새 metric series를 만들어 cardinality를 키우는 고유 ID label 줄을 찾으세요.`,
        lines: [`labels = {"route": "/courses/{course_id}", "status": "200"}`, `labels["user_id"] = str(user.id)`, `record_metric("http_requests", labels=labels)`],
        line: 2,
        hint: `요청마다 달라지는 식별자를 metric의 차원으로 저장하는지 확인하세요.`,
        explanation: `2번 줄의 고유 user ID는 높은 cardinality를 만듭니다. route template과 제한된 상태 코드처럼 집계 범위가 예측되는 label을 사용하세요.`,
      },
    },
    {
      intro: `FastAPI API health path는 서버 앱에 속하며 이 저장소의 정적 학습 화면에 실제 backend·로그·외부 관찰 시스템이 생기는 것은 아닙니다. 구현 예제와 운영 상태 증거를 분리하세요.`,
      example: `# This is a server-side FastAPI route, not a static-page health check.
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

# A real deployment still needs a server and an operator-defined probe.`,
      choice: {
        prompt: `FastAPI 과정에 /health 코드가 보일 때 무료 정적 학습 사이트의 운영 상태에 대해 무엇을 단정할 수 있나요?`,
        correct: `코드 예제만으로 실제 backend 서버나 배포 health 상태가 존재한다고 할 수 없음`,
        correctFeedback: `코드 조각은 server-side 개념을 설명할 뿐 정적 학습 웹사이트에 해당 API를 설치·배포하지 않습니다.`,
        incorrect: [
          { text: `예제를 열면 실제 서버와 로그 수집기가 자동 생성`, feedback: `정적 페이지에는 FastAPI process나 backend 관찰 서비스가 포함되지 않으며 예제는 실행·배포 증거가 아닙니다.` },
          { text: `브라우저에서 /health JSON을 읽으면 DB까지 정상이라고 증명`, feedback: `단일 endpoint는 구현자가 선택한 상태만 확인하고 DB·외부 서비스 전체의 운영 품질을 자동 증명하지 않습니다.` },
        ],
        hint: `교육용 코드 sample의 존재와 실제 서버에 실행 중인 endpoint의 존재를 구별하세요.`,
        explanation: `FastAPI /health는 해당 Python app을 서버에서 실행하고 배포한 경우에만 service endpoint입니다. 이 정적 사이트는 backend runtime이나 observability service를 provision하지 않으며, health의 범위도 직접 정의해야 합니다.`,
      },
      short: {
        prompt: `학습 페이지의 FastAPI 코드 예제가 실제 배포 server나 health endpoint 실행을 뜻하지 않는다는 경계를 적으세요.`,
        answers: [`정적 학습 사이트는 FastAPI server를 배포하거나 실행하지 않는다`, `코드 예제는 실제 backend 배포 증거가 아니다`],
        hint: `예제 표시와 서버 프로세스 운영은 별도의 단계입니다.`,
        explanation: `이 사이트는 정적 코드 학습 환경이므로 예제의 FastAPI route를 실제 backend나 운영 health check라고 안내하지 않습니다.`,
      },
      locate: {
        prompt: `정적 학습 사이트가 FastAPI route 예제를 실제 운영 API로 보유한다고 잘못 주장한 줄을 찾으세요.`,
        lines: [`example = "@app.get('/health')"`, `# This learning page deploys and monitors that FastAPI server.`, `print(example)`],
        line: 2,
        hint: `예제 문자열을 표시하는 것과 server process를 배포·monitoring하는 것은 다릅니다.`,
        explanation: `2번 줄은 정적 콘텐츠가 서버를 배포하고 monitoring한다고 오해하게 합니다. 코드 샘플은 학습 자료일 뿐 실제 backend 운영 증거가 아닙니다.`,
      },
    },
  ],
  29: [
    {
      intro: `버전 기록에는 공식 최신 안정판과 브라우저 실행기에서 검증한 버전을 따로 적어야 합니다. 2026-11-02 확인 기준 FastAPI 최신 안정판은 0.162.0이고, 실행기 고정 버전은 0.143.0입니다.`,
      example: `from fastapi import FastAPI, Form

app = FastAPI()

FASTAPI_DOCS_STABLE = "0.162.0 (2026-10-23)"
BROWSER_RUNNER_PIN = "0.143.0"
REVIEWED_AT = "2026-11-02"

@app.post("/courses/search")
async def search_courses(archived: bool = Form(False)):
    return {"archived": archived}  # 체크 안 한 항목은 요청에서 빠져도 False예요.`,
      choice: {
        prompt: `2026-11-02에 공식 릴리스 기록을 확인했을 때 가장 최신인 FastAPI 안정판은 무엇인가요?`,
        correct: `0.162.0 (2026-10-23 안정판)`,
        correctFeedback: `FastAPI 공식 릴리스의 최신 항목은 2026-10-23에 나온 0.162.0이에요. 브라우저 실행기에서 검증한 버전은 0.143.0으로 따로 관리해요.`,
        incorrect: [
          { text: `0.143.4 (2026-10-18 안정판)`, feedback: `0.143.4도 안정판이지만 2026-10-23에 더 새 버전인 0.162.0이 나왔습니다.` },
          { text: `0.143.0 (브라우저 실행기 검증 버전)`, feedback: `0.143.0은 사이트 실행기에서 검증한 버전이지, 현재 문서 안정판은 아닙니다.` },
        ],
        hint: `문서 확인 날짜와 release notes 맨 위의 버전 날짜를 대조하세요.`,
        explanation: `FastAPI 공식 릴리스에서 확인한 최신 버전은 0.162.0 (2026-10-23)예요. 실행기에서 검증한 0.143.0과 혼동하지 않도록 따로 표시해요.`,
      },
      short: {
        prompt: `FastAPI 0.162.0에서 HTML 체크박스를 선택하지 않아 값이 빠졌을 때 False로 처리하려면 폼 필드를 어떻게 선언하나요?`,
        answers: [`archived: bool = Form(False)`, `bool = Form(False)`, `Form(False)`],
        hint: `체크하지 않은 HTML 체크박스는 요청에 값이 아예 담기지 않아요.`,
        explanation: `FastAPI 0.162.0부터 생략된 bool 폼 필드는 선언한 기본값을 사용해요. 체크 해제 시 False가 되게 하려면 Form(False)처럼 기본값을 지정해야 해요.`,
      },
      locate: {
        prompt: `최신 안정 문서가 0.162.0인데 문서 버전 상수에 runner pin만 복사한 잘못된 줄을 찾으세요.`,
        lines: [`DOCS_STABLE_VERSION = "0.143.0"`, `BROWSER_RUNNER_PIN = "0.143.0"`, `REVIEWED_AT = "2026-11-02"`],
        line: 1,
        hint: `문서의 latest stable과 실행기의 tested pin은 서로 다릅니다.`,
        explanation: `1번 줄은 문서 안정판 대신 실행기 pin 0.143.0을 사용합니다. 최신 문서 안정판 0.162.0과 runner 0.143.0을 따로 기록하세요.`,
      },
    },
    {
      intro: `FastAPI의 Python 최소 지원 범위와 사이트 브라우저 실행기의 고정 Python 버전은 서로 다른 정보입니다. 학습 범위 3.10+라는 표기를 단일 실행 버전 보증으로 읽지 마세요.`,
      example: `FASTAPI_PYTHON_FLOOR = "3.10+"
BROWSER_RUNNER_PYTHON = "3.14.2"
PYODIDE_VERSION = "314.0.7"

# A minimum supported range does not certify every deployment stack.`,
      choice: {
        prompt: `FastAPI 과정에서 Python 학습 최소 범위와 실제 browser runner runtime을 정확히 구분한 표기는 무엇인가요?`,
        correct: `문서 학습 범위 3.10+와 browser runner Python 3.14.2를 분리 표기`,
        correctFeedback: `지원 하한과 특정 실행 환경의 고정 버전을 나란히 쓰되 같은 호환성 보장으로 합치지 않습니다.`,
        incorrect: [
          { text: `Python 3.14.2만이 FastAPI 학습 문법 지원`, feedback: `실행기의 특정 Python 버전은 FastAPI 학습에 허용되는 최소 범위를 뜻하지 않습니다.` },
          { text: `FastAPI 3.10+는 모든 Python·Starlette 조합 동작 보장`, feedback: `Python floor 표기만으로 dependency 조합이나 모든 runtime에서의 호환성이 증명되지는 않습니다.` },
        ],
        hint: `minimum version range와 한 개의 tested runtime build를 다른 항목으로 기록하세요.`,
        explanation: `학습 문서 범위는 Python 3.10+이고 browser runner는 Python 3.14.2/Pyodide 314.0.7로 고정되어 있습니다. 하나의 실행 결과가 모든 supported environment를 인증하지는 않습니다.`,
      },
      short: {
        prompt: `일반 학습 최소 Python 범위와 별도 browser runner 버전을 같은 항목으로 오해하지 않도록 구분하는 원칙을 적으세요.`,
        answers: [`지원 범위와 검증된 실행 버전을 분리 표기`, `minimum range와 runner pin을 따로 기록`],
        hint: `3.10+ 범위와 3.14.2처럼 하나의 고정 환경은 서로 다른 의미입니다.`,
        explanation: `지원 가능한 Python 범위와 실제 확인된 runner version을 분리해 적어야 학습 목표를 특정 브라우저 실행기에 한정하지 않습니다.`,
      },
      locate: {
        prompt: `runner Python 3.14.2 한 가지만 지원한다고 문서 최소 범위를 잘못 좁힌 줄을 찾으세요.`,
        lines: [`FASTAPI_PYTHON_FLOOR = "3.10+"`, `BROWSER_RUNNER_PYTHON = "3.14.2"`, `DOCS_PYTHON_SUPPORT = "3.14.2 only"`],
        line: 3,
        hint: `실행기 pin을 일반 지원 하한으로 복사했는지 확인하세요.`,
        explanation: `3번 줄은 특정 runner version으로 공식 문서 최소 범위를 대체합니다. Python 3.10+ 학습 범위와 3.14.2 tested runner를 별도 필드로 유지하세요.`,
      },
    },
    {
      intro: `FastAPI release가 지원하는 Starlette 범위와 앱이 고정한 FastAPI 버전을 함께 시험하세요. Starlette를 독립적으로 임의 pin하지 말고 resolved dependency와 Pydantic 조합을 회귀 검사합니다.`,
      example: `# Candidate version; adopt it only after compatibility and regression tests pass.
fastapi_version = "0.162.0"

# Let FastAPI resolve its compatible Starlette range.
# Run request, validation, and lifespan regression tests after upgrades.`,
      choice: {
        prompt: `FastAPI·Starlette·Pydantic 의존성을 업그레이드할 때 공식 버전 가이드에 맞는 접근은 무엇인가요?`,
        correct: `FastAPI 버전을 pin하고 호환 dependency 조합에서 앱 회귀 테스트 실행`,
        correctFeedback: `FastAPI가 요구하는 Starlette 범위를 따르게 하고 앱의 테스트로 새 resolved 조합을 확인합니다.`,
        incorrect: [
          { text: `FastAPI를 올린 뒤 Starlette를 임의 최신판으로 별도 강제`, feedback: `FastAPI가 지정한 지원 범위를 벗어난 Starlette 강제 pin은 호환되지 않는 조합을 만들 수 있습니다.` },
          { text: `설치가 성공하면 endpoint와 lifespan 검사를 생략`, feedback: `설치 해결은 앱의 request·validation·lifecycle 동작이 맞다는 회귀 증거가 아닙니다.` },
        ],
        hint: `framework가 기대하는 하위 dependency 버전과 실제 앱 테스트의 역할을 함께 생각하세요.`,
        explanation: `FastAPI 가이드는 동작이 확인된 FastAPI 버전을 고정하고 업그레이드 후 app tests를 실행하라고 합니다. Starlette는 FastAPI가 호환되는 버전 범위를 선택하게 두세요.`,
      },
      short: {
        prompt: `FastAPI를 업그레이드할 때 직접 호환성을 확인해야 하는 방법 두 부분을 적으세요.`,
        answers: [`FastAPI 버전을 pin하고 호환 dependency로 회귀 테스트`, `지원 조합을 유지하고 앱 테스트 실행`],
        hint: `버전 고정과 애플리케이션 회귀 확인을 함께 해야 합니다.`,
        explanation: `검증된 FastAPI 버전을 pin하고 그 버전이 허용하는 dependency 조합에서 app tests를 실행합니다. Starlette를 임의로 분리 pin하지 않습니다.`,
      },
      locate: {
        prompt: `FastAPI 0.162.0으로 올리면서 호환 범위를 확인하지 않고 Starlette 최신판을 강제로 지정한 줄을 찾으세요.`,
        lines: [`fastapi_version = "0.162.0"`, `starlette_version = "latest"  # force-install regardless of FastAPI constraints`, `run_regression_tests()`],
        line: 2,
        hint: `FastAPI가 허용하는 Starlette 범위를 무시하는 임의 override인지 보세요.`,
        explanation: `2번 줄은 FastAPI 호환 조건과 무관하게 Starlette latest를 강제합니다. FastAPI가 정한 범위에 맡기고 실제로 선택된 의존성 조합에서 회귀 테스트를 실행하세요.`,
      },
    },
    {
      intro: `FastAPI 0.143.0부터 OpenTelemetry exporter 자동 구성은 opt-in입니다. 이전 자동 구성에 의존한 앱만 설정을 명시해야 하며 자체 provider/exporter를 구성한 앱은 변경이 필요 없다고 release notes가 설명합니다.`,
      example: `# Deployment environment, only if relying on FastAPI auto-configuration:
# FASTAPI_OTEL_AUTO_CONFIGURE=true

# Equivalent explicit app configuration:
app = FastAPI(telemetry={"auto_configure": True})`,
      choice: {
        prompt: `FastAPI 0.143.0에서 OpenTelemetry exporter 자동 구성을 계속 써야 하는 기존 앱이 확인할 변경은 무엇인가요?`,
        correct: `자동 구성 opt-in을 설정하거나 telemetry auto_configure를 명시`,
        correctFeedback: `0.143.0부터 자동 exporter 설정이 opt-in이므로 이전 동작에 의존한 앱만 설정을 선택해야 합니다.`,
        incorrect: [
          { text: `OpenTelemetry를 사용하는 모든 앱이 반드시 코드를 삭제`, feedback: `자체 provider/exporter를 구성한 앱은 release notes상 이 자동 구성 전환으로 변경할 필요가 없습니다.` },
          { text: `FastAPI 0.143.1이 자동 계측을 제거하고 서버 로그를 모두 비활성화`, feedback: `0.143.1은 route metadata bug fix이며 자동 telemetry opt-in 변경은 0.143.0 notes에 있습니다.` },
        ],
        hint: `이전 자동 설정을 실제로 사용했는지와 자체 구성 여부를 분리하세요.`,
        explanation: `FastAPI 0.143.0부터 environment auto configure가 opt-in입니다. 기존 automatic setup이 필요하면 FASTAPI_OTEL_AUTO_CONFIGURE=true 또는 FastAPI(telemetry={"auto_configure": True})를 사용하고 자체 provider 설정은 그대로 유지할 수 있습니다.`,
      },
      short: {
        prompt: `FastAPI telemetry 자동 구성을 0.143.0 이후 명시적으로 켜는 environment variable을 적으세요.`,
        answers: [`FASTAPI_OTEL_AUTO_CONFIGURE=true`],
        hint: `FastAPI release notes의 OpenTelemetry 자동 구성 opt-in 이름을 확인하세요.`,
        explanation: `FASTAPI_OTEL_AUTO_CONFIGURE=true는 자동 설정이 필요한 경우의 명시적 선택입니다. 자체 provider/exporter를 관리하는 앱은 사용 여부를 따로 결정합니다.`,
      },
      locate: {
        prompt: `자동 구성 opt-in 전환 뒤에도 이전 OpenTelemetry 자동 설정이 항상 켜져 있다고 가정한 잘못된 주석 줄을 찾으세요.`,
        lines: [`# FastAPI 0.143.0 keeps OpenTelemetry exporter auto-configuration enabled by default.`, `app = FastAPI()`, `# Configure opt-in only if the application relied on automatic setup.`],
        line: 1,
        hint: `0.143.0 release note는 exporter 자동 구성을 opt-in으로 바꿨습니다.`,
        explanation: `1번 줄은 0.143.0 이후 자동 설정이 기본으로 계속 켜져 있다고 잘못 주장합니다. 이전 자동 구성 의존성이 있을 때만 environment나 app telemetry 설정을 명시하세요.`,
      },
    },
    {
      intro: `버전 검수 기록에는 확인 날짜·공식 출처·문서 안정판·실행기 pin·실제로 통과한 검사를 남깁니다. release note를 확인한 사실을 모든 배포 조합을 실행 검증한 것으로 확장하지 마세요.`,
      example: `version_review = {
    "docs_stable": "0.162.0",
    "runner_pin": "0.143.0",
    "source": "official FastAPI release notes",
    "checked_at": "2026-11-02",
    "runtime_tests": "not run for every deployment stack",
}`, 
      choice: {
        prompt: `공식 버전 자료를 확인한 편집 기록에서 날짜·출처와 실행 검증 범위를 함께 남기는 이유는 무엇인가요?`,
        correct: `정보 시점과 확인 사실을 재현하고 문서 대조와 실제 runtime 검증을 구분`,
        correctFeedback: `독자가 버전 사실이 언제·어디에서 왔는지와 실행까지 확인했는지 분리해서 판단할 수 있습니다.`,
        incorrect: [
          { text: `최신 숫자만 덮어쓰면 모든 호환성이 입증됨`, feedback: `버전 문자열은 실행 환경·dependency 조합이나 회귀 test 결과를 증명하지 않습니다.` },
          { text: `출처를 적으면 runner pin이 자동으로 갱신됨`, feedback: `문서 출처는 사실 확인 수단이고 project lock/runtime asset을 변경하는 동작은 아닙니다.` },
        ],
        hint: `확인 시점·공식 근거·실행한 검사를 별도 필드로 보존하세요.`,
        explanation: `버전 표시는 시간이 지나면 오래될 수 있으므로 날짜와 official source를 남깁니다. docs cross-check와 실제 환경 실행 검증은 서로 다른 evidence라 각각 정확히 기록해야 합니다.`,
      },
      short: {
        prompt: `버전 문서와 실행기 차이를 나중에 다시 확인할 수 있도록 반드시 기록할 출처 확인 metadata 두 가지를 적으세요.`,
        answers: [`공식 출처와 확인 날짜`, `source와 확인 날짜`],
        hint: `어떤 공식 문서를 언제 확인했는지 짧은 metadata로 남깁니다.`,
        explanation: `공식 source와 확인 날짜를 함께 적고, 별도로 어떤 runtime 테스트를 수행했는지도 기록합니다.`,
      },
      locate: {
        prompt: `공식 문서를 대조한 기록에서 실행기 버전을 지운 줄을 찾으세요.`,
        lines: [`DOCS_STABLE_VERSION = "0.162.0"`, `BROWSER_RUNNER_PIN = None`, `SOURCE_CHECKED_AT = "2026-11-02"`],
        line: 2,
        hint: `실행기 pin과 출처 확인일이 실제 값으로 보존되어 있는지 확인하세요.`,
        explanation: `2번 줄은 실행기 버전을 비웁니다. 문서 안정판·실행기 버전·출처 확인 날짜를 따로 적어 사실의 시점과 검증 범위를 다시 확인할 수 있게 하세요.`,
      },
    },
  ],
};

export function applyFastApiFoundationReview(weekNumber, sessions) {
  const reviews = dailyReviews[weekNumber];
  if (!reviews) return;
  if (!Array.isArray(sessions) || sessions.length !== reviews.length) {
    throw new TypeError('FastAPI foundation review needs five study days');
  }

  for (const [index, review] of reviews.entries()) {
    const session = sessions[index];
    const choice = session.exercises.find((exercise) => exercise.type === 'choice');
    const shortAnswer = session.exercises.find((exercise) => exercise.type === 'short-answer');
    const locate = session.exercises.find((exercise) => exercise.type === 'locate-error');
    if (!choice || !shortAnswer || !locate) {
      throw new TypeError('FastAPI foundation day must keep its three question types');
    }
    session.intro = review.intro;
    session.example = review.example;

    choice.prompt = review.choice.prompt;
    const incorrectIds = choice.choices.filter((option) => option.id !== choice.answer).map((option) => option.id);
    if (incorrectIds.length !== 2 || review.choice.incorrect.length !== 2) {
      throw new TypeError('FastAPI foundation choice must have one correct and two incorrect options');
    }
    let incorrectIndex = 0;
    choice.choices = choice.choices.map((option) => {
      if (option.id === choice.answer) return { ...option, text: review.choice.correct };
      return { ...option, text: review.choice.incorrect[incorrectIndex++].text };
    });
    choice.choiceExplanations = {
      [choice.answer]: review.choice.correctFeedback,
      [incorrectIds[0]]: review.choice.incorrect[0].feedback,
      [incorrectIds[1]]: review.choice.incorrect[1].feedback,
    };
    choice.hint = review.choice.hint;
    choice.explanation = review.choice.explanation;

    shortAnswer.prompt = review.short.prompt;
    shortAnswer.acceptedAnswers = review.short.answers;
    shortAnswer.hint = review.short.hint;
    shortAnswer.explanation = review.short.explanation;

    locate.prompt = review.locate.prompt;
    locate.codeLines = review.locate.lines;
    locate.answerLines = [review.locate.line];
    locate.hint = review.locate.hint;
    locate.explanation = review.locate.explanation;
    // These questions changed their displayed options or accepted answers;
    // keep earlier saved responses attached to the previous identities.
    if (weekNumber === 3 && index <= 2) {
      shortAnswer.id += '-v2';
      if (index > 0) choice.id += '-v2';
    }
    if (weekNumber >= 4 && weekNumber <= 29) {
      for (const exercise of session.exercises) {
        if (!exercise.id.endsWith('-v2')) exercise.id += '-v2';
      }
    }
    if (weekNumber === 29 && index === 4) locate.id = locate.id.replace(/-v2$/, '-v3');
  }
}

export function applyFastApiStableVersionQuestionIdentity(weekNumber, sessions) {
  if (weekNumber !== 29) return;
  for (const exercise of sessions[0].exercises) {
    if (exercise.id.startsWith('fastapi-w29-d1-') && exercise.id.endsWith('-v2')) {
      const previousId = exercise.id;
      const originalId = previousId.replace(/-v2$/, '');
      exercise.id = `${originalId}-v3`;
      exercise.legacyIds = [...new Set([...(exercise.legacyIds ?? []), originalId, previousId])];
      continue;
    }
    if (!exercise.id.endsWith('-v2')) exercise.id += '-v2';
  }
}
