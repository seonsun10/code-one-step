import assert from 'node:assert/strict';
import test from 'node:test';
import { getCurrentExerciseId, getExercise, tracks } from '../src/content.js';
import { gradeAnswer } from '../src/grading.js';

const track = tracks.find((item) => item.id === 'fastapi');

test('FastAPI type annotations allow resolvable string references without making them wrong choices', () => {
  const lesson = track.lessons.find((item) => item.week === 3);
  for (const [dayIndex, typeName] of [[1, 'int'], [2, 'UUID']]) {
    const [choice, written] = lesson.studyDays[dayIndex].exercises;
    assert.equal(choice.choices.some((option) => option.text === `course_id: "${typeName}"`), false);
    for (const answer of [`course_id: ${typeName}`, `course_id: "${typeName}"`, `course_id: '${typeName}'`]) {
      assert.equal(gradeAnswer(written, answer), true, `${written.id}: ${answer}`);
    }
    assert.equal(gradeAnswer(written, 'course_id: str'), false);
    assert.match(written.explanation, /해석할 수 있으면/);
  }
});

test('FastAPI path names are distinguished from required query parameters', () => {
  const [choice, written, locate] = track.lessons.find((item) => item.week === 3).studyDays[0].exercises;
  assert.match(choice.prompt, /정수/);
  assert.match(choice.explanation, /필수 쿼리/);
  assert.equal(written.id, 'fastapi-w03-d1-write-v2');
  assert.equal(gradeAnswer(written, 'course_id: int'), true);
  assert.match(locate.explanation, /필수 쿼리/);
});

test('FastAPI static-route recall specifies the expected answer format', () => {
  const written = track.lessons.find((item) => item.week === 2).studyDays[3].exercises.find((exercise) => exercise.type === 'short-answer');
  assert.match(written.prompt, /예제와 같은.*`@app\.get\("경로"\)` 형식/);
  assert.equal(gradeAnswer(written, '@app.get("/users/me")'), true);
});

test('FastAPI version review points to one missing field in the diagnostic example', () => {
  const lesson = track.lessons.find((item) => item.week === 29);
  const locate = lesson.studyDays[4].exercises.find((exercise) => exercise.type === 'locate-error');
  assert.equal(locate.id, 'fastapi-w29-d5-locate-v3');
  assert.deepEqual(locate.answerLines, [2]);
  assert.match(locate.codeLines[1], /None/);
  assert.match(locate.codeLines[2], /2026-11-02/);
  assert.equal(gradeAnswer(locate, [2]), true);
  assert.equal(gradeAnswer(locate, [3]), false);
});

test('FastAPI current documentation version stays distinct from the verified browser runner pin', () => {
  assert.equal(track.contentReview.reviewedAt, '2026-11-02');
  assert.match(track.contentReview.version, /문서 0\.162\.0/);
  assert.match(track.contentReview.version, /실행기 FastAPI 0\.143\.0/);

  const versionLesson = track.lessons.find((item) => item.week === 29);
  assert.match(versionLesson.example, /최신 안정판: 0\.162\.0 \(2026-10-23, 2026-11-02 확인\)/);
  assert.match(versionLesson.example, /실행기 검증 고정: FastAPI 0\.143\.0/);
  const day = versionLesson.studyDays[0];
  const [choice, shortAnswer, locate] = day.exercises;

  assert.match(day.example, /Form\(False\)/);
  assert.equal(choice.id, 'fastapi-w29-d1-select-v3');
  assert.ok(choice.legacyIds.includes('fastapi-w29-d1-select-v2'));
  assert.ok(choice.legacyIds.includes('fastapi-w29-d1-select'));
  for (const oldId of choice.legacyIds) {
    assert.equal(getCurrentExerciseId(oldId), choice.id);
    assert.equal(getExercise(oldId), choice);
  }
  assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, '0.162.0 (2026-10-23 안정판)');
  assert.equal(gradeAnswer(choice, choice.answer), true);
  assert.equal(shortAnswer.id, 'fastapi-w29-d1-write-v3');
  assert.ok(shortAnswer.legacyIds.includes('fastapi-w29-d1-write-v2'));
  assert.ok(shortAnswer.legacyIds.includes('fastapi-w29-d1-write'));
  for (const oldId of shortAnswer.legacyIds) {
    assert.equal(getCurrentExerciseId(oldId), shortAnswer.id);
    assert.equal(getExercise(oldId), shortAnswer);
  }
  assert.equal(shortAnswer.acceptedAnswers[0], 'archived: bool = Form(False)');
  assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true);
  assert.equal(locate.id, 'fastapi-w29-d1-locate-v3');
  assert.ok(locate.legacyIds.includes('fastapi-w29-d1-locate-v2'));
  assert.ok(locate.legacyIds.includes('fastapi-w29-d1-locate'));
  for (const oldId of locate.legacyIds) {
    assert.equal(getCurrentExerciseId(oldId), locate.id);
    assert.equal(getExercise(oldId), locate);
  }
  assert.deepEqual(locate.answerLines, [1]);
  assert.equal(locate.codeLines[1], 'BROWSER_RUNNER_PIN = "0.143.0"');
  assert.equal(gradeAnswer(locate, locate.answerLines), true);
});

test('FastAPI weekly learning points do not repeat an unrelated generic reminder', () => {
  const repeatedReminder = '작은 계약을 직접 적고 공개 테스트로 확인해요.';
  assert.equal(track.lessons.filter((lesson) => lesson.points.includes(repeatedReminder)).length, 0);
});

test('FastAPI weeks one through three connect each daily example and question to its request contract', () => {
  const expectedAnswers = {
    1: [
      'app = FastAPI()',
      '@app.get("/health")',
      'async def list_courses():',
      'return {"status": "ok"}',
      'uvicorn.run("main:app")',
    ],
    2: [
      '@app.get("/courses")',
      '@app.post("/courses")',
      '@app.patch("/courses/{course_id}")',
      '@app.get("/users/me")',
      '405 Method Not Allowed',
    ],
    3: [
      'async def read_course(course_id: int):',
      'course_id: int',
      'course_id: UUID',
      '"/items/{item_id}"',
      '422 Unprocessable Entity',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();

  for (let week = 1; week <= 3; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, 'FastAPI week exists');
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      const revisedTypes = week === 3 && (dayIndex === 1 || dayIndex === 2);
      assert.equal(choice.id, prefix + '-select' + (revisedTypes ? '-v2' : ''));
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 35, choice.id + '/' + option.id + ' explains its choice');
      }
      assert.ok(!choice.prompt.includes('목표에 맞는 코드를 고르세요'), choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 45, choice.id);

      assert.ok(!shortAnswer.prompt.includes('코드 또는 핵심 용어'), shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 35, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '모르겠습니다'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 45, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 40, prefix);
      assert.ok(day.example.length > 75, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });

});

test('FastAPI beginner lessons explain server terms and keep examples in Korean', () => {
  const week1 = track.lessons.find((item) => item.week === 1);
  assert.equal(week1.title, 'FastAPI 앱과 첫 응답');
  assert.match(week1.objective, /ASGI\(비동기 Python 웹 앱과 서버가 요청·응답을 주고받는 표준 규칙\)/);
  assert.match(week1.intro, /Uvicorn 같은 ASGI 서버/);

  const serverDay = week1.studyDays[4];
  const serverChoice = serverDay.exercises[0];
  const fileCommand = serverChoice.choices.find((option) => option.text === 'python main.py');
  assert.match(serverChoice.prompt, /Uvicorn에 이 앱을 지정하는 호출/);
  assert.match(serverDay.example, /if __name__ == "__main__":/);
  assert.match(serverChoice.choiceExplanations[fileCommand.id], /파일을 실행하는 명령/);
  assert.doesNotMatch(serverChoice.choiceExplanations[fileCommand.id], /서버가 시작되지는 않습니다/);

  const week3 = track.lessons.find((item) => item.week === 3);
  assert.match(week3.studyDays[2].intro, /UUID는.*고유 식별자/);
  const invalidIntegerExample = week3.studyDays[4].example;
  assert.match(invalidIntegerExample, /# GET \/courses\/42는 정수 ID를 받아요\./);
  assert.match(invalidIntegerExample, /# GET \/courses\/abc는 함수 실행 전 422 입력 검증 오류를 반환해요\./);
  assert.doesNotMatch(invalidIntegerExample, /returns an integer ID|fails request validation/);

  const sourceUrls = track.contentReview.sources.map((source) => source.url);
  assert.ok(sourceUrls.includes('https://fastapi.tiangolo.com/deployment/manually/'));
  assert.ok(sourceUrls.includes('https://asgi.readthedocs.io/en/latest/specs/main.html'));
  assert.ok(sourceUrls.includes('https://docs.python.org/3/library/__main__.html'));
  assert.ok(sourceUrls.includes('https://docs.python.org/3/library/uuid.html'));
});

test('FastAPI weeks four through six teach query and body validation with distinct daily evidence', () => {
  const expectedAnswers = {
    4: [
      'q: str | None = None',
      'category: str',
      'Query(default=20, ge=1, le=100)',
      'tags: Annotated[list[str] | None, Query()] = None',
      'include_lessons: bool = Query(default=False)',
    ],
    5: [
      'class CourseCreate(BaseModel):',
      'description: str | None = None',
      'rating: float',
      'instructor: Instructor',
      'async def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):',
    ],
    6: [
      'Field(min_length=1)',
      'Field(gt=0)',
      'description: str | None = Field(default=None, max_length=160)',
      'Field(le=100)',
      'payload: Enrollment',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();
  const equivalentAnswers = {
    'fastapi-w04-d1-write-v2': ['q: str | None = Query(default=None)', 'q: Optional[str] = None'],
    'fastapi-w04-d2-write-v2': ['category: str = Query()', 'category: Annotated[str, Query()]'],
    'fastapi-w04-d3-write-v2': ['Query(20, ge=1, le=100)'],
    'fastapi-w04-d4-write-v2': ['tags: list[str] | None = Query(default=None)'],
    'fastapi-w04-d5-write-v2': ['include_lessons: bool = False'],
    'fastapi-w05-d2-write-v2': ['description: Optional[str] = None', 'description: str | None = Field(default=None)'],
    'fastapi-w05-d4-write-v2': ["instructor: 'Instructor'"],
    'fastapi-w05-d5-write-v2': [
      'def update_course(course_id: int, payload: CourseUpdate, notify: bool = False):',
      'async def update_course(payload: CourseUpdate, course_id: int, notify: bool = False):',
      'def update_course(payload: CourseUpdate, course_id: int, notify: bool = False):',
      'async def update_course(course_id: int, payload: CourseUpdate, notify: bool = Query(default=False)):',
    ],
    'fastapi-w06-d1-write-v2': ['Field(min_length=1, max_length=80)'],
    'fastapi-w06-d2-write-v2': ['Field(gt=0.0)'],
    'fastapi-w06-d3-write-v2': [
      'description: str | None = Field(max_length=160, default=None)',
      'description: Optional[str] = Field(default=None, max_length=160)',
    ],
    'fastapi-w06-d4-write-v2': ['Field(ge=1, le=100)'],
    'fastapi-w06-d5-write-v2': ['payload: Annotated[Enrollment, Body()]'],
  };

  assert.equal(track.lessons.find((item) => item.week === 4).studyDays[1].title, '필수 분류 쿼리');
  assert.equal(track.lessons.find((item) => item.week === 5).studyDays[1].title, '생략 가능한 설명 필드');
  assert.equal(track.lessons.find((item) => item.week === 6).studyDays[2].title, '선택 설명과 길이 제한');

  for (let week = 4; week <= 6; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
  const shortAnswersById = new Map(track.lessons
    .filter((lesson) => lesson.week >= 4 && lesson.week <= 6)
    .flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer')
    .map((exercise) => [exercise.id, exercise]));
  for (const [exerciseId, answers] of Object.entries(equivalentAnswers)) {
    const exercise = shortAnswersById.get(exerciseId);
    assert.ok(exercise, exerciseId);
    for (const answer of answers) assert.equal(gradeAnswer(exercise, answer), true, exerciseId + ': ' + answer);
  }
});

test('FastAPI weeks seven through nine teach response contracts, headers, and reusable dependencies', () => {
  const expectedAnswers = {
    7: [
      '@app.get("/courses/{course_id}", response_model=CoursePublic)',
      '@app.get("/account", response_model=AccountPublic)',
      'nickname: str | None = None',
      'response_model=list[CoursePublic]',
      '응답 데이터 생성의 서버 결함이며 응답 검증 오류로 다룬다',
    ],
    8: [
      'status_code=status.HTTP_201_CREATED',
      'status_code=204',
      'client_version: Annotated[str | None, Header()] = None',
      'response.headers["X-Result-Source"] = "catalog"',
      '404 Not Found',
    ],
    9: [
      'Depends(get_page_size)',
      'limit: int = Depends(get_page_size)',
      'user: dict = Depends(get_current_user)',
      'limit: int = Query(default=20, ge=1, le=100)',
      '공통 get_page_size callable을 경로 함수 바깥에 두고 두 곳에서 Depends로 연결',
    ],
  };
  const expectedShortAnswers = {
    7: [
      '@app.get("/courses/{course_id}", response_model=CoursePublic)',
      'response_model=AccountPublic',
      'nickname: str | None = None',
      'response_model=list[CoursePublic]',
      '서버 응답 검증 오류',
    ],
    8: [
      '201',
      '204',
      'client_version: Annotated[str | None, Header()] = None',
      'response.headers["X-Result-Source"] = "catalog"',
      '404',
    ],
    9: [
      'Depends(get_page_size)',
      'limit: int = Depends(get_page_size)',
      'user: dict = Depends(get_current_user)',
      'limit: int = Query(default=20, ge=1, le=100)',
      'get_page_size',
    ],
  };
  const equivalentAnswers = {
    'fastapi-w08-d3-write-v2': ['client_version: str | None = Header(default=None)'],
    'fastapi-w09-d2-write-v2': ['limit: Annotated[int, Depends(get_page_size)]'],
    'fastapi-w09-d3-write-v2': ['user: Annotated[dict, Depends(get_current_user)]'],
    'fastapi-w09-d4-write-v2': ['limit: Annotated[int, Query(ge=1, le=100)] = 20'],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();

  for (let week = 7; week <= 9; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });

  const locateById = (id) => track.lessons
    .flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .find((exercise) => exercise.id === id);
  const accountLocate = locateById('fastapi-w07-d2-locate-v2');
  assert.ok(accountLocate.codeLines.includes('class AccountPublic(BaseModel):'));
  assert.ok(accountLocate.codeLines.includes('    email: str'));
  assert.equal(accountLocate.answerLines[0], 13);
  assert.ok(accountLocate.codeLines.at(-1).includes('"email": "m@example.com"'));

  const missingCourseLocate = locateById('fastapi-w08-d5-locate-v2');
  assert.ok(missingCourseLocate.codeLines[0].includes('HTTPException'));
  const deleteExample = track.lessons.find((item) => item.week === 8).studyDays[1].example;
  assert.match(deleteExample, /course_ids = \{7\}/);
  assert.match(deleteExample, /course_ids\.remove\(course_id\)/);
  assert.doesNotMatch(deleteExample, /remove_course\(/);

  const dependencyLocate = locateById('fastapi-w09-d2-locate-v2');
  assert.match(dependencyLocate.explanation, /타입 자리/);
  assert.doesNotMatch(dependencyLocate.explanation, /매개변수 이름이 없고/);
  assert.ok(locateById('fastapi-w09-d3-locate-v2').codeLines[0].includes('Depends'));
  assert.ok(locateById('fastapi-w09-d4-locate-v2').codeLines[0].includes('Query'));

  const shortAnswersById = new Map(track.lessons
    .filter((lesson) => lesson.week >= 7 && lesson.week <= 9)
    .flatMap((lesson) => lesson.studyDays.flatMap((day) => day.exercises))
    .filter((exercise) => exercise.type === 'short-answer')
    .map((exercise) => [exercise.id, exercise]));
  for (const [exerciseId, answers] of Object.entries(equivalentAnswers)) {
    const exercise = shortAnswersById.get(exerciseId);
    assert.ok(exercise, exerciseId);
    for (const answer of answers) assert.equal(gradeAnswer(exercise, answer), true, exerciseId + ': ' + answer);
  }
});

test('FastAPI weeks ten through twelve teach dependency graphs, cleanup scope, and APIRouter', () => {
  const expectedAnswers = {
    10: [
      'from typing import Annotated',
      'Annotated[int, Depends(get_page_size)]',
      'PageSize = Annotated[int, Depends(get_page_size)]',
      'token: Annotated[str, Depends(read_token)]',
      'extract_query → normalize_query → list_courses',
    ],
    11: [
      'yield session',
      'try: yield resource / finally: resource.close()',
      'await resource.aclose()',
      '같은 요청에서 공통 하위 의존성의 결과를 재사용한다',
      'Depends(get_label, scope="function")',
    ],
    12: [
      'router = APIRouter(prefix="/courses", tags=["courses"])',
      '@router.get("/{course_id}")',
      'app.include_router(router)',
      'tags=["courses"]',
      '"/courses" + "/{course_id}" → "/courses/{course_id}"',
    ],
  };
  const expectedShortAnswers = {
    10: [
      'from typing import Annotated',
      'PageSize = Annotated[int, Depends(get_page_size)]',
      'PageSize',
      'token: Annotated[str, Depends(read_token)]',
      'extract_query',
    ],
    11: [
      'yield session',
      'try/finally',
      'await resource.aclose()',
      'use_cache',
      'function',
    ],
    12: [
      'APIRouter(prefix="/courses", tags=["courses"])',
      '@router.get("/{course_id}")',
      'app.include_router(router)',
      'tags=["courses"]',
      '/courses/{course_id}',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();
  const shortAnswers = new Set();

  const cleanupLesson = track.lessons.find((item) => item.week === 11);
  assert.equal(cleanupLesson.title, '요청별 의존성 재사용과 자원 정리');
  assert.equal(cleanupLesson.studyDays[3].title, '같은 요청에서 의존성 재사용');
  assert.equal(cleanupLesson.studyDays[4].title, 'yield 자원 정리 시점');
  assert.match(cleanupLesson.studyDays[4].exercises[1].prompt, /경로 함수 종료 직후/);

  for (let week = 10; week <= 12; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);
      assert.ok(!shortAnswers.has(shortAnswer.acceptedAnswers[0]), shortAnswer.id + ' has its own answer');
      shortAnswers.add(shortAnswer.acceptedAnswers[0]);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks thirteen through fifteen teach async boundaries, middleware, and HTTP errors', () => {
  const expectedAnswers = {
    13: [
      'async def read_course(course_id: int):',
      'course = await repository.read(course_id)',
      '일반 def 경로 작업에서 동기 repository를 호출',
      'run_in_executor(process_pool, build_report, payload)',
      'await fetch_course(course_id)',
    ],
    14: [
      '@app.middleware("http")',
      'response = await call_next(request)',
      'response.headers["X-Request-Source"] = "course-api"',
      'return response',
      'B → A → route → A → B',
    ],
    15: [
      'raise HTTPException(status_code=404, detail="Course not found")',
      '401 + WWW-Authenticate: Bearer',
      '403 Forbidden',
      '@app.exception_handler(CourseConflict)',
      '안정된 오류 코드와 일반 안내 문구를 담은 JSON detail',
    ],
  };
  const expectedShortAnswers = {
    13: [
      'async def',
      'course = await repository.read(course_id)',
      '일반 def',
      'ProcessPoolExecutor',
      'await fetch_course(course_id)',
    ],
    14: [
      '@app.middleware("http")',
      'response = await call_next(request)',
      'response.headers["X-Request-Source"] = "course-api"',
      'return response',
      'B → A → route → A → B',
    ],
    15: [
      'raise HTTPException(status_code=404, detail="Course not found")',
      '401 + WWW-Authenticate',
      '403 Forbidden',
      '@app.exception_handler(CourseConflict)',
      'COURSE_NOT_FOUND',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();
  const shortAnswers = new Set();

  for (let week = 13; week <= 15; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);
      assert.ok(!shortAnswers.has(shortAnswer.acceptedAnswers[0]), shortAnswer.id + ' has its own answer');
      shortAnswers.add(shortAnswer.acceptedAnswers[0]);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks sixteen through eighteen teach validation errors, lifespan, and REST updates', () => {
  const expectedAnswers = {
    16: [
      '422 Unprocessable Entity',
      'RequestValidationError',
      'JSONResponse(status_code=422, content=payload)',
      '필드 위치와 오류 종류처럼 필요한 최소 정보만 골라 반환',
      '서버가 선언한 응답 계약을 위반한 내부 오류',
    ],
    17: [
      'from contextlib import asynccontextmanager',
      '@asynccontextmanager',
      'yield 이전',
      'app.state.catalog',
      'FastAPI(lifespan=lifespan)',
    ],
    18: [
      'GET /courses',
      'GET /courses/{course_id}',
      'POST /courses → 201 Created',
      'changes.model_dump(exclude_unset=True)',
      '204 No Content',
    ],
  };
  const expectedShortAnswers = {
    16: [
      '422',
      'RequestValidationError',
      'JSONResponse(status_code=422, content=payload)',
      '필요한 오류 위치와 종류만 반환',
      '서버 응답 계약 위반',
    ],
    17: [
      'from contextlib import asynccontextmanager',
      '@asynccontextmanager',
      'yield 앞',
      'app.state.catalog',
      'FastAPI(lifespan=lifespan)',
    ],
    18: [
      'GET /courses',
      'GET /courses/{course_id}',
      '201',
      'model_dump(exclude_unset=True)',
      '204 No Content',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();
  const shortAnswers = new Set();

  for (let week = 16; week <= 18; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);
      assert.ok(!shortAnswers.has(shortAnswer.acceptedAnswers[0]), shortAnswer.id + ' has its own answer');
      shortAnswers.add(shortAnswer.acceptedAnswers[0]);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks nineteen through twenty-one distinguish bearer parsing, authorization, and tests', () => {
  const expectedAnswers = {
    19: [
      'from fastapi.security import HTTPBearer',
      'HTTPBearer(auto_error=False)',
      'Depends(bearer_scheme)',
      'credentials.scheme',
      '토큰 서명·만료·발급자와 사용자 및 접근 권한',
    ],
    20: [
      '401 Unauthorized와 WWW-Authenticate: Bearer',
      '403 Forbidden',
      'user = Depends(get_current_user)',
      'course["owner_id"] != user["id"]',
      '요청 기능에 필요한 편집 권한만 허용',
    ],
    21: [
      'from fastapi.testclient import TestClient',
      'TestClient(app)',
      'with TestClient(app) as client:',
      'response.status_code',
      'response.json()',
    ],
  };
  const expectedShortAnswers = {
    19: [
      'from fastapi.security import HTTPBearer',
      'HTTPBearer(auto_error=False)',
      'Depends(bearer_scheme)',
      'credentials.scheme',
      '토큰 서명·만료와 사용자 권한을 검증해야 함',
    ],
    20: [
      '401 + WWW-Authenticate: Bearer',
      '403 Forbidden',
      'Depends(get_current_user)',
      'course["owner_id"] != user["id"]',
      '최소 권한 원칙',
    ],
    21: [
      'from fastapi.testclient import TestClient',
      'TestClient(app)',
      'with TestClient(app) as client:',
      'assert response.status_code == 200',
      'response.json()',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();
  const shortAnswers = new Set();

  for (let week = 19; week <= 21; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);
      assert.ok(!shortAnswers.has(shortAnswer.acceptedAnswers[0]), shortAnswer.id + ' has its own answer');
      shortAnswers.add(shortAnswer.acceptedAnswers[0]);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks twenty-two through twenty-four teach isolated async tests and safe pagination', () => {
  const expectedAnswers = {
    22: [
      'app.dependency_overrides[get_repository] = get_fake_repository',
      'get_fake_repository',
      '기존 override를 저장하고 finally에서 원래 사전을 복구',
      '네트워크 의존성을 테스트 대역으로 교체',
      '각 사례에 독립된 저장소 대역을 생성',
    ],
    23: [
      'ASGITransport(app=app)',
      'AsyncClient(transport=transport, base_url="http://test")',
      'response = await client.get("/health")',
      'async with LifespanManager(app):',
      'base_url="http://test"',
    ],
    24: [
      'limit: Annotated[int, Query(ge=1, le=100)] = 20',
      'offset: Annotated[int, Query(ge=0)] = 0',
      '먼저 전체 목록을 정렬하고 그 결과를 offset/limit으로 자르기',
      '허용된 sort_by 이름만 선택',
      'next_offset = offset + limit',
    ],
  };
  const expectedShortAnswers = {
    22: [
      'app.dependency_overrides[get_repository] = get_fake_repository',
      'get_fake_repository',
      'finally',
      '네트워크 dependency를 테스트 대역으로 교체',
      '각 사례에 독립된 저장소 대역 사용',
    ],
    23: [
      'ASGITransport(app=app)',
      'AsyncClient(transport=transport, base_url="http://test")',
      'response = await client.get("/health")',
      'async with LifespanManager(app):',
      'base_url="http://test"',
    ],
    24: [
      'limit: Annotated[int, Query(ge=1, le=100)] = 20',
      'offset: Annotated[int, Query(ge=0)] = 0',
      '정렬 후 items[offset:offset + limit]로 자르기',
      '허용 목록',
      'next_offset = offset + limit',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();

  for (let week = 22; week <= 24; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks twenty-five through twenty-seven distinguish CORS, task durability, and server settings', () => {
  const expectedAnswers = {
    25: [
      'from fastapi.middleware.cors import CORSMiddleware',
      'allow_origins=["https://learn.example", "http://localhost:5173"]',
      'allow_methods=["POST"]와 allow_headers=["Authorization"]',
      '세 allow_* 목록에 필요한 실제 출처·method·header를 각각 명시',
      '사용자 인증·리소스 권한과 cookie 사용 시 CSRF 방어',
    ],
    26: [
      'background_tasks: BackgroundTasks',
      'background_tasks.add_task(write_notice, course_id, message="published")',
      '응답을 보낸 뒤',
      '내구성 있는 작업 기록·재시도 경계를 가진 별도 작업 큐와 worker',
      '별도 job queue와 worker를 설계하고 broker·운영 요구도 함께 평가',
    ],
    27: [
      'from pydantic_settings import BaseSettings',
      'database_url: SecretStr',
      'model_config = SettingsConfigDict(env_prefix="APP_")',
      'Field(description="설정의 용도와 공급 조건")',
      '키를 브라우저 bundle에 넣지 말고 보호된 서버 경계에서 공급',
    ],
  };
  const expectedShortAnswers = {
    25: [
      'from fastapi.middleware.cors import CORSMiddleware',
      'allow_origins=["https://learn.example"]',
      'allow_methods=["POST"], allow_headers=["Authorization"]',
      'allow_origins, allow_methods, allow_headers',
      '인증·인가와 CSRF 방어',
    ],
    26: [
      'background_tasks: BackgroundTasks',
      'background_tasks.add_task(write_notice, course_id, message="published")',
      '응답을 보낸 뒤',
      '내구성 있는 작업 큐와 worker',
      '별도 job queue와 worker',
    ],
    27: [
      'from pydantic_settings import BaseSettings',
      'database_url: SecretStr',
      'model_config = SettingsConfigDict(env_prefix="APP_")',
      'Field(description=...)',
      '보호된 서버 runtime 환경',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();

  for (let week = 25; week <= 27; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      assert.equal(choice.id, prefix + '-select-v2');
      assert.equal(shortAnswer.id, prefix + '-write-v2');
      assert.equal(locate.id, prefix + '-locate-v2');
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  const credentialsAnswer = track.lessons.find((item) => item.week === 25).studyDays[3].exercises.find((exercise) => exercise.type === 'short-answer');
  assert.match(credentialsAnswer.prompt, /예제에 나온 순서대로.*쉼표로 구분/);
  assert.equal(gradeAnswer(credentialsAnswer, 'allow_origins, allow_methods, allow_headers'), true);
  assert.equal(gradeAnswer(credentialsAnswer, 'allow_headers, allow_methods, allow_origins'), false);

  assert.deepEqual(answerPositions, { a: 5, b: 5, c: 5 });
});

test('FastAPI weeks twenty-eight and twenty-nine teach operations and version-aware upgrades', () => {
  const expectedAnswers = {
    28: [
      'request_id·status_code·결과 수처럼 최소 운영 필드만 기록',
      '초기화·필수 준비가 끝나 요청을 받아도 되는지 판별',
      '적절한 HTTP 상태와 내부 구현 비밀을 뺀 일반 설명',
      'route template·status처럼 제한된 차원만 사용하고 user/request ID는 제외',
      '코드 예제만으로 실제 backend 서버나 배포 health 상태가 존재한다고 할 수 없음',
    ],
    29: [
      '0.162.0 (2026-10-23 안정판)',
      '문서 학습 범위 3.10+와 browser runner Python 3.14.2를 분리 표기',
      'FastAPI 버전을 pin하고 호환 dependency 조합에서 앱 회귀 테스트 실행',
      '자동 구성 opt-in을 설정하거나 telemetry auto_configure를 명시',
      '정보 시점과 확인 사실을 재현하고 문서 대조와 실제 runtime 검증을 구분',
    ],
  };
  const expectedShortAnswers = {
    28: [
      'request_id와 status_code',
      'readiness probe',
      '안전한 일반 오류 설명만 공개',
      'route template',
      '정적 학습 사이트는 FastAPI server를 배포하거나 실행하지 않는다',
    ],
    29: [
      'archived: bool = Form(False)',
      '지원 범위와 검증된 실행 버전을 분리 표기',
      'FastAPI 버전을 pin하고 호환 dependency로 회귀 테스트',
      'FASTAPI_OTEL_AUTO_CONFIGURE=true',
      '공식 출처와 확인 날짜',
    ],
  };
  const answerPositions = { a: 0, b: 0, c: 0 };
  const examples = new Set();
  const locateSnippets = new Set();

  for (let week = 28; week <= 29; week += 1) {
    const lesson = track.lessons.find((item) => item.week === week);
    assert.ok(lesson, `FastAPI week ${week} exists`);
    assert.equal(lesson.studyDays.length, 5);

    for (const [dayIndex, day] of lesson.studyDays.entries()) {
      const prefix = 'fastapi-w' + String(week).padStart(2, '0') + '-d' + (dayIndex + 1);
      const [choice, shortAnswer, locate] = day.exercises;
      assert.equal(day.exercises.length, 3, prefix);
      const versionAnswerChanged = week === 29 && dayIndex === 0;
      assert.equal(choice.id, prefix + (versionAnswerChanged ? '-select-v3' : '-select-v2'));
      assert.equal(shortAnswer.id, prefix + (versionAnswerChanged ? '-write-v3' : '-write-v2'));
      assert.equal(locate.id, prefix + (versionAnswerChanged || (week === 29 && dayIndex === 4) ? '-locate-v3' : '-locate-v2'));
      assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[week][dayIndex], choice.id);
      assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
      answerPositions[choice.answer] += 1;
      assert.equal(new Set(choice.choices.map((option) => option.text)).size, 3, choice.id);
      for (const option of choice.choices) {
        assert.ok(choice.choiceExplanations[option.id].length > 40, choice.id + '/' + option.id);
      }
      assert.ok(choice.prompt.length > 55, choice.id);
      assert.ok(choice.hint.length > 30, choice.id);
      assert.ok(choice.explanation.length > 55, choice.id);

      assert.ok(shortAnswer.prompt.length > 45, shortAnswer.id);
      assert.ok(shortAnswer.hint.length > 25, shortAnswer.id);
      assert.ok(shortAnswer.explanation.length > 45, shortAnswer.id);
      assert.equal(shortAnswer.acceptedAnswers[0], expectedShortAnswers[week][dayIndex], shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, shortAnswer.acceptedAnswers[0]), true, shortAnswer.id);
      assert.equal(gradeAnswer(shortAnswer, '임의 입력'), false, shortAnswer.id);

      assert.ok(locate.prompt.includes('줄'), locate.id);
      assert.ok(locate.hint.length > 25, locate.id);
      assert.ok(locate.explanation.length > 50, locate.id);
      assert.equal(locate.answerLines.length, 1, locate.id);
      assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
      assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);

      assert.ok(day.intro.length > 50, prefix);
      assert.ok(day.example.length > 100, prefix);
      assert.ok(!examples.has(day.example), prefix + ' has its own complete example');
      examples.add(day.example);
      const locateCode = locate.codeLines.join('\n');
      assert.ok(!locateSnippets.has(locateCode), prefix + ' has its own diagnostic case');
      locateSnippets.add(locateCode);
    }
  }

  assert.deepEqual(answerPositions, { a: 3, b: 3, c: 4 });
});

test('FastAPI final-week examples and diagnostic cases match all five capstone goals', () => {
  const lesson = track.lessons.find((item) => item.week === 30);
  assert.ok(lesson);
  assert.equal(lesson.title, '종합 · 학습 과정 API 설계');
  assert.match(lesson.intro, /코드 읽기용이며 FastAPI 서버를 실행하거나 배포하지 않습니다/);
  const expectedAnswers = [
    '@router.get("", response_model=list[CoursePublic])',
    'raise HTTPException(status_code=404, detail="Course not found")',
    'payload: CourseCreate',
    'service: CourseService = Depends(get_service)',
    '목록 200·없는 ID 404·생성 201·잘못된 입력 422를 각각 검증',
  ];
  assert.equal(new Set(lesson.studyDays.map((day) => day.example)).size, 5);

  for (const [index, day] of lesson.studyDays.entries()) {
    const [choice, shortAnswer, locate] = day.exercises;
    assert.equal(choice.choices.find((option) => option.id === choice.answer)?.text, expectedAnswers[index], day.title);
    assert.equal(gradeAnswer(choice, choice.answer), true, choice.id);
    assert.equal(shortAnswer.acceptedAnswers[0], expectedAnswers[index], shortAnswer.id);
    assert.equal(gradeAnswer(shortAnswer, expectedAnswers[index]), true, shortAnswer.id);
    assert.ok(choice.choiceExplanations[choice.answer].length > 45, choice.id);
    assert.doesNotMatch(choice.prompt, /계약를|계획를|구현할 때 목표에 맞는/);
    assert.doesNotMatch(choice.hint, /통합해요\.와|목록·상세·등록·응답 모델/);
    assert.doesNotMatch(choice.explanation, /인증·저장·재시도·운영 장애 대응/);
    assert.ok(choice.choices.every((option) => choice.choiceExplanations[option.id].length > 25), choice.id);
    assert.equal(locate.type, 'locate-error', locate.id);
    assert.equal(gradeAnswer(locate, locate.answerLines), true, locate.id);
    assert.ok(locate.codeLines[locate.answerLines[0] - 1]?.trim(), locate.id);
    assert.ok(locate.explanation.length > 30, locate.id);
    assert.doesNotMatch(locate.hint, /오류가 있는 표현이 FastAPI 요청 처리에서 어떤 역할/);
  }

  assert.match(lesson.studyDays[0].example, /@router\.get\(""/);
  assert.match(lesson.studyDays[1].example, /status_code=404/);
  assert.match(lesson.studyDays[2].example, /CourseCreate/);
  assert.match(lesson.studyDays[3].example, /Depends\(get_service\)/);
  assert.match(lesson.studyDays[4].example, /pytest\.mark\.parametrize/);

  const integrationPlan = lesson.studyDays[4].exercises[1];
  assert.match(integrationPlan.prompt, /네 요청 순서대로 기대 HTTP 상태 코드/);
  assert.deepEqual(integrationPlan.acceptedAnswers, [
    expectedAnswers[4],
    '200, 404, 201, 422',
    '200/404/201/422',
    '목록 200, 없는 ID 404, 생성 201, 잘못된 입력 422',
  ]);
  for (const answer of integrationPlan.acceptedAnswers) assert.equal(gradeAnswer(integrationPlan, answer), true, answer);
  assert.equal(gradeAnswer(integrationPlan, '200, 404, 200, 422'), false);
  assert.equal(gradeAnswer(integrationPlan, '목록 조회와 생성 성공만 검사'), false);
});
