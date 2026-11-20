# 학습 콘텐츠 품질 감사·개선 계획

 최종 갱신: 2026-11-09 (Asia/Seoul)

## 2026-11-02 TypeScript W1–W26 순서 재확인과 과정 종료

- 기존 2026-10-15 TypeScript W1–W26의 주차별 정답·오답·타입 진단 검사와 2026-10-24의 130개 예제 출력·단답 비교 결과를 재사용했다. 이번에는 26주 전체 제목·주차 목표·날짜별 목표·문제 제목을 다시 연결해 보고, 6단계·130일·390문항과 고유 ID 및 객관식 정답 위치 분포를 확인했다.
- W22–W24에 제목·날짜별 목표·예제 사이의 실제 불일치를 찾았다. W22는 요구사항·학습 자료 모델, W23은 요청 분리·런타임 검증·순수 계산·실패 결과·경계 사례로 다시 맞췄다. 두 주에 걸쳐 연결되는 예제·질문·오류 찾기·코드 수정 30개를 작성했다. W24의 기존 모듈·컴파일 설정·DOM·JSX·TypeScript 버전 자료는 해당 주차로 옮겼고, 겹치던 저장·테스트 자료는 실행 데이터에서 제거했다. W25 저장·보안·의존성, W26 테스트·접근성·회고는 기존 해당 주차 내용을 유지했다.
- W22–W24 내용 변경은 새 선택·오류 찾기·수정 ID(v3)와 출력 추적 ID(v4)로 발행하고, 이전 ID를 `legacyIds`로 연결했다. 15개 변경 주차 예제를 TypeScript 6.0.3 변환기로 JavaScript로 바꿔 실행했으며 등록된 추적 답과 모두 일치했다. 전체 구조는 26주·6단계·130일·390문항, ID 중복 0건, 객관식 정답 위치 A/B/C 각 44/43/43이다.
- 사용자에게 반복 노출되던 주차별 공통 설명과 같은 학습 요점 두 개를 없애고, W1에서 실행기 범위만 한 번 안내하도록 줄였다. 나머지 주차는 해당 주의 핵심 규칙을 소개 문장으로 보여 준다. 매일의 안내도 짧게 다듬었다.
- TypeScript 7.0.2 안정판과 7.1 베타 상태는 [공식 릴리스 목록](https://github.com/microsoft/TypeScript/releases) 및 [TypeScript 7.1 베타 발표](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)에서 확인했다. 이 사이트의 편집기는 TypeScript 6.0.3으로 변환·실행하며 정적 타입 검사를 제공하지 않는다는 경계는 유지했다. 변환기와 정적 검사를 분리하는 근거는 [TypeScript 공식 문서](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html)와 대조했다.
- TypeScript 전용 `tests/typescript-course-quality.test.js` 19/19 통과, `npm run build` 통과, `git diff --check` 종료 코드 0(기존 작업 파일의 LF→CRLF 안내만 출력). 전체 사이트 테스트 모음이나 브라우저 화면 검사는 실행하지 않았고 공개 배포하지 않았다. TypeScript 과정 종료를 닫고 React W1–W4로 이동한다. 다른 과정이나 전체 사이트 콘텐츠 감사를 완료했다는 뜻은 아니다.

## 2026-11-02 AI·LLM W1–W3 개념·학습 흐름 재확인

- 기존 2026-10-28 AI 과정 W1–W27 사실·정답 검수 기록을 재사용하고, 이번 순서 작업에서는 W1–W3의 15일 학습 목표·예제·45문항 연결을 다시 읽었다. AI 안에 머신러닝, 머신러닝 안에 딥러닝이 포함된다는 관계와 생성형 AI의 “새 내용을 만드는 유형”이라는 구분 기준이 같은 단계처럼 보이던 설명을 분리했다. 특정 과제용 AI와 범용 AI 예시를 쉬운 말로 정리하고 `동물병 진단` 오기를 `동물병원 질병 진단`으로 바로잡았다. 사기 거래 예시에 오탐·미탐 뜻을 함께 적었고, 규칙만으로 충분한 입력 형식 검사는 주민등록번호 대신 주문 번호를 사용하도록 바꿨다.
- 사실 설명은 Google for Developers [Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course), Google Cloud [인공지능이란?](https://cloud.google.com/learn/what-is-artificial-intelligence), [생성형 AI 용어집](https://docs.cloud.google.com/docs/generative-ai/glossary)의 정의와 과정 구성을 대조했다. AI 안의 ML·DL 포함 관계와 “생성형” 분류는 서로 다른 기준이라는 설명은 이 정의들을 초보자에게 맞춰 종합한 것이다.
- 기존 검수에서 정답·해설·오답 선택지 일치가 확인된 기록을 재사용했다. 이번에는 해당 범위를 전체 재검사하거나 테스트하지 않았다. `npm run build`가 통과했고, `git diff --check`도 오류 없이 끝났다(기존 작업 파일의 줄바꿈 변환 안내만 출력). AI·LLM W1–W3 태스크를 닫고 다음 순서 W4–W5로 이동한다. 전체 과정 감사 완료를 뜻하지 않으며 공개 배포하지 않았다.

## 2026-11-02 AI·LLM W4–W27 흐름 재검수와 과정 종료 확인

- 2026-10-28에 기록한 AI W1–W27 135일·405문항 사실·정답·오답 근거 검수와 공식 자료 대조를 재사용했다. 이번 순차 작업에서는 W4–W27의 주차 목표, 120일의 예제·질문·정답 연결, 앞뒤 개념 순서를 다시 읽었다. 확률·벡터에서 머신러닝, 신경망·Transformer·LLM, 업무 적용·평가·안전·운영·최종 설계로 이어지는 순서는 자연스러웠다. W14–W27의 기존 선택 활동과 구체 사례도 그대로 재사용할 수 있었다.
- 새로 찾은 흐름·표현 문제를 고쳤다. W7의 검증 자료 용어를 그 자리에서 이해할 수 있게 풀었고, W8 혼동 행렬 예제에는 양성·음성의 뜻과 네 칸을 모두 적었다. W9 교차 검증에는 시간 순서 자료와 같은 사람의 기록이 분할을 넘나드는 경우를 덧붙였다. 시간 자료를 미래 방향으로 검증해야 하는 근거는 scikit-learn [교차 검증 공식 문서](https://scikit-learn.org/stable/modules/cross_validation.html)와 대조했다. W13 N-그램 예제는 명시한 한국어 토큰과 2-그램 결과가 일치하도록 고치고, 동음이의어 예시도 자연스럽게 다듬었다.
- W24–W27의 적용 활동 20개가 모두 “오늘 사례에 적용”이라는 같은 문장으로 반복돼 있었다. 평가 자료·채점 기준·실패 분석, 집단별 영향·개인정보·권한, 비용·장애·중단 기준, 최종 AI 적용 계획을 직접 정리하는 가상 활동으로 바꿨다. W26의 의료 사례는 진료 보조 결과를 전문가가 환자 자료와 함께 확인하는 표현으로 한정했다. W27 D4의 ‘사람에게 이관’ 답안 해설은 이 답에 맞는 설명으로 고쳤다.
- 과정 종료 확인에서 27주·6단계·135일·405문항, 모든 문항 ID가 서로 다른 점과 기초 개념에서 실제 적용 설계까지의 순서를 확인했다. 기존 정답 검수 기록을 재사용했으며, 이번 흐름 검수에서는 전체 테스트나 사이트 전역 회귀를 다시 실행하지 않았다. `npm run build` 통과, `git diff --check` 종료 코드 0(줄바꿈 변환 안내 34건만 출력), 내부 사이트 응답 200을 확인했다. AI 과정 종료 확인을 닫고 TypeScript W1–W4로 이동한다. 이는 다른 과정이나 전체 사이트 콘텐츠 감사를 마쳤다는 뜻이 아니며 공개 배포하지 않았다.

## 2026-10-29 저장·백업 복원 흐름 재검수

- 브라우저 저장소, 자동 저장 대기열, 백업 가져오기·내보내기, 실패 시 재시도와 JSON 검증을 다시 읽었다. 백업을 복원하는 동안 예약 자동 저장이 복원 기록을 덮을 수 있는 경합을 수정했다. 같은 브라우저에서 두 탭이 같은 기록을 읽고 저장하면 뒤 탭의 오래된 화면이 앞 탭의 답안을 덮는 재현도 확인했다. 브라우저 Web Locks로 저장을 직렬화하고 마지막으로 확인한 저장 시각보다 오래된 기록은 거부한다. 오래된 탭은 현재 변경을 백업하거나 최신 기록을 다시 불러오도록 안내한다. 복원 확인 후 예약 저장 타이머를 취소하고 백업을 메모리 상태로 먼저 반영하므로 복원 중 생긴 새 답안은 최신 상태에 이어진다.
- 저장·백업·화면 표적 검사 66/66, 전체 `npm test` 486/486, `npm run check:release` 152개 파일·최대 9.621 MiB 통과. 현재 작업 환경에서는 내부 브라우저를 열 수는 있지만 클릭·화면 캡처 인터페이스가 없어 파일 선택·다중 탭·저장 실패 상태를 직접 조작해 보지는 않았다. 로그인 없이 브라우저 로컬에 저장하는 결정은 유지했고 배포하지 않았다. 근거: [W3C Web Locks API](https://www.w3.org/TR/web-locks/).

## 2026-10-29 C# W4–W6 분기·반복·메서드 기초 재검수

- W4–W6 15일에 표시되는 45개 질문·정답·오답 피드백과 결과 추적 예제를 다시 대조했다. 비교 경계, `&&`의 단락 평가, 점수 분기 순서, 완전하지 않은 switch 식, `foreach` 순회 변수, 반복 종료 조건, 메서드 반환값, 참조형 인자를 값으로 전달하는 경우, 선택 매개변수와 이름 있는 인자의 설명이 예제와 일치했다. 점수 60 경계, 배열 길이와 같은 인덱스, 빈 범위, 종료 신호, 재할당 사례를 직접 계산하고 각 정답 위치 및 오답 피드백 회귀 조건도 확인했다. 이 범위에서 내용 오류나 정답 불일치는 찾지 못했다.
- 근거: Microsoft Learn [조건부 AND 연산자](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/and-operator), [switch 식의 누락 입력 경고와 런타임 동작](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/switch-expression), [for·foreach·while 반복문](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/iteration-statements), [메서드 매개변수와 값·참조 전달](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters), [이름·선택 인자](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments).
- C# 과정·예제 표적 검사 23/23, 전체 `npm test` 484/484, `npm run check:release` 152개 파일·최대 9.621 MiB 통과. 이는 W4–W6 표적 재검수이고 C# 나머지 주차나 전체 사이트의 콘텐츠 완전 검수를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-29 C# W7–W9 컬렉션·LINQ·null 처리 재검수

- W7–W9 15일의 45문항과 예제 결과를 다시 대조했다. 배열 길이, `List<T>` 중복과 순서, `Dictionary.TryAdd` 실패 및 인덱서 덮어쓰기, `HashSet<T>` 순서 비보장, Queue/Stack 꺼내는 순서를 확인했다. LINQ의 Where·Select·OrderBy·GroupBy 및 지연 실행 예제가 원본과 결과 시퀀스를 혼동하지 않도록 설명하며, null 어노테이션·`?.`·`??`·`??=`·`ThrowIfNull`의 컴파일 분석과 런타임 검증 경계가 맞는지 질문·정답·오답 근거까지 대조했다. 이 범위에서 출력 오류나 정답 불일치는 찾지 못했다.
- 근거: Microsoft Learn [HashSet<T> 순서·중복 계약](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1), [LINQ 쿼리와 지연 실행](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries), [GroupBy 그룹 순서와 실행 시점](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby), [nullable reference annotations의 컴파일·런타임 경계](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/nullable-reference-types).
- C# 과정·예제 표적 검사는 전체 `npm test` 486/486 안에서 통과했고 릴리스 감사 152개 파일·최대 9.621 MiB도 통과했다. 이는 W7–W9 표적 재검수이며 C# 나머지 주차나 전체 사이트 콘텐츠 검수를 완료했다는 뜻은 아니다. 공개 배포하지 않았다.

## 2026-10-29 C# W10–W12 객체 설계·캡슐화 재검수

- W10–W12의 record 동등성·얕은 복사, DTO 경계, `init`, 생성자·접근 제한자, C# 14 `field` 백킹 프로퍼티, 인터페이스·다형성·구성 사례의 결과와 설명을 대조했다. W11 D5 Wallet 예제는 지출액은 확인하지만 생성자의 초기 잔액을 검사하지 않아 `new Wallet(-1m)`로 음수 잔액을 만들 수 있었다. 생성자에 음수 초기값 거부를 추가하고, 정답에서 초기 잔액 조건과 이후 Spend 검증을 모두 설명하도록 맞췄다. W10–W12 관련 표적 검사에서 45개 문제 구조·정답·오답 거부와 C# 예제 문법 검사를 확인했다.
- 근거: Microsoft Learn [record 값 동등성·with 복사](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/records), [`init`과 참조된 객체의 수정 가능성](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/init), [C# 14 `field` 백킹 프로퍼티](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/field), [인터페이스 계약과 상속](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces).
- C# 과정·예제 표적 검사 23/23 통과. W10–W12 수정 반영 뒤 전체 `npm test` 486/486, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`가 통과했다. 이 결과는 W10–W12 범위만 다루며 다른 주차·전체 사이트의 완전 검수를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-29 C# W13–W18 제네릭·이벤트·예외·비동기·버전 재검수

- W13–W18의 30일 예제·문제에서 출력 추적, 정답, 오답 근거를 대조했다. 제네릭 제약과 `IReadOnlyList` 별칭, `IEnumerable` 공변성 및 `List<T>` 불변성, Func/Action과 캡처된 변수, 이벤트 중복 구독·해제, 예외 처리 순서와 `finally`, `TryParse` 실패, 내부 예외 보존, 응답에서 진단 정보 분리, 자원 정리와 경로·입력·복사 한계, Task·취소·동기 차단, C# 14 문법의 사례를 확인했다. 이 범위에서 계산 출력·정답·설명 불일치를 찾지 못했다.
- W18의 시점 의존 .NET 버전 정보는 2026-10-29 공식 다운로드 및 지원 자료와 대조했다. .NET 10.0.14와 SDK 10.0.403, C# 14, .NET 11 RC3의 표기는 확인한 날짜에 맞는다. 공식 자료: [제네릭·공변성](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics), [delegate·event](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/delegates-lambdas), [예외 처리](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/exception-handling-statements), [C# 14 null 조건부 대입](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/member-access-operators), [.NET 10 다운로드](https://dotnet.microsoft.com/en-us/download/dotnet/10.0), [.NET 릴리스 목록](https://dotnet.microsoft.com/en-us/download/dotnet).
- C# 과정·예제 표적 검사 23/23 통과. W10–W12 수정 뒤 실행한 전체 `npm test` 486/486, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`도 통과했다. 이는 W13–W18 범위의 재검수이며 C# 나머지 주차나 사이트 전체 콘텐츠 검수 완료를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-29 C# W19–W21 검사·도구·호스트 재검수

- W19–W21의 15일 예제·45문항에서 경계값·회귀·시간 대역, 실제 테스트 범위, SDK/runtime 구분, 솔루션·복원·패키지 잠금, Generic Host·DI 수명·설정 우선순위·비밀 값 로그 기준을 예제와 맞춰 추적했다. 단위·컴포넌트·통합 검증의 설명이 실제 실행한 경계보다 넓게 주장하지 않도록 구성되어 있고, 출력·답·오답 근거의 불일치는 찾지 못했다.
- 근거: Microsoft Learn [.NET Generic Host](https://learn.microsoft.com/en-us/dotnet/core/extensions/generic-host), [DI 수명](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes), [설정 공급자 우선순위](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration), [NuGet 잠금 파일](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files). C# 전 주차 품질 검사를 포함한 전체 `npm test` 486/486, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`가 통과했다. 이 결과는 W19–W21만 다루며 전체 C#·전체 사이트 콘텐츠 검수를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-29 C# W22–W24 관측·HTTP API 재검수

- W22–W24 15일의 예제 출력·문제·정답·오답 이유를 추적했다. 구조화 로그 속성, 로그 수준, 민감 정보, metric과 trace, Problem Details, endpoint 등록과 middleware 순서, route 형식·DI·요청 본문 결합, GET·PUT·POST 계약, 입력 오류와 권한 응답, OpenAPI metadata, 기존 client와 선택 JSON 필드 호환 설명을 확인했다. 이 범위에서 코드 추적 또는 개념 정답 불일치를 찾지 못했다.
- 근거: Microsoft Learn [구조화 로그](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging), [분산 추적](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing), [Minimal API 요청 처리](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0), [middleware 순서](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/middleware?view=aspnetcore-10.0), [OpenAPI 계약](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/aspnetcore-openapi), [HTTP method 의미](https://www.rfc-editor.org/rfc/rfc9110.html). C# 전 주차 품질 검사를 포함한 전체 `npm test` 486/486, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`가 통과했다. 이 결과는 W22–W24만 다루며 전체 C#·전체 사이트 검수 완료를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-29 C# W1–W35 규칙 힌트·버전 재검수

- C# 35주차의 규칙 질문과 화면에 연결되는 힌트 175개를 대조했다. 같은 날의 출력 추적 힌트를 가져온 사례 117개는 질문별로 다시 읽었다. 일부는 같은 개념을 보조해 그대로 둘 수 있었지만, 저장·취소·계층·재시도·호환성 질문에서 출력 결과만 가리키던 힌트는 규칙을 생각하게 하는 문장으로 바꿨다. W1–W3의 15개 규칙 힌트와 W31–W35 캡스톤 힌트도 같은 기준으로 확인했다.
- .NET 버전 안내는 2026-10-29 확인 결과 .NET 다운로드와 지원 정책이 함께 표시하는 최신 안정 LTS 패치 .NET 10.0.14, SDK 10.0.403, C# 14.0과 프리릴리스 .NET 11 RC3로 고쳤다. 10월 13일 .NET 10.0.13 기록은 해당 시점의 역사 자료로만 남겼다. 공식 근거: [공식 .NET 10 다운로드](https://dotnet.microsoft.com/en-us/download/dotnet/10.0), [.NET 지원 정책](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core), [.NET 10.0.14 릴리스 노트](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.14/10.0.14.md), [.NET 11 RC3 릴리스 노트](https://github.com/dotnet/core/blob/main/release-notes/11.0/preview/rc3/11.0.0-rc.3.md), [C# 언어 버전 정책](https://learn.microsoft.com/en-us/dotnet/csharp/language-versioning).
- C# 검사 22/22, 전체 `npm test` 483/483, 변경 C# 모듈·테스트 구문 검사, `git diff --check`, `npm run check:release`의 정적 자산 152개·최대 9.621 MiB 검사가 통과했다.
- 내부 브라우저 열기 요청은 대기 상태를 반환했다. 이번 확인은 화면을 직접 읽거나 조작한 시각 검수가 아니며 Computer Use도 사용하지 않았다. C# 과정은 정적 코드 읽기 학습으로 유지하며 C# 컴파일·ASP.NET·실제 DB를 실행했다고 표시하지 않는다. 전체 CQ는 열려 있고 공개 배포하지 않는다.

## 2026-10-29 Kotlin W28–W31 상황형 단답 채점 재검수

- 20일의 문항 설명·예제·기대 답·허용 답을 대조했다. W28 D3은 예제의 `suspend fun save(item: Progress)`와 정답의 `save(...)` 표기가 달랐고, W28 D4는 예제의 `Error(canRetry = true)` 공백을 정답 목록이 허용하지 않았다. 두 형식 모두 정답으로 인정하도록 추가했다.
- Kotlin W28–W31 회귀 검사를 확장해 20개 단답의 정답 연결, 모든 허용 답의 채점, 무관한 입력의 거부를 확인했다. Kotlin 표적 검사 16/16, 전체 `npm test` 483/483, `npm run check:release` 152개 파일·최대 9.621 MiB, 구문 검사와 `git diff --check`가 통과했다.
- 이 과정은 정적 검토이며 Compose·Android 앱 빌드, 기기·Room 검사는 수행하지 않았다. 전체 CQ는 계속 열려 있고 공개 배포하지 않는다.

## 2026-10-29 AI 과정 화면 확인 및 Kotlin W1–W27 출력 답안 채점 재검수

- AI 과정이 학습 목록에서 열리는 것을 다시 확인했다. AI와 데이터, 머신러닝, 신경망, Transformer·LLM, 업무 활용, 평가·안전까지 6개 구간·27주·135회·405문항이 보이고, 선수 지식 없이 시작할 수 있다. 1단계의 5개 주차·75문제와 1주차의 세 문항 진입점을 확인했다. 공식 문서 목록은 기본으로 접혀 있었다. 과정은 이미 연결되어 있어 중복 추가하지 않았다.
- Kotlin W1–W27의 결과 추적 단답 135개를 코드·화면 결과·정답과 대조했다. 기본 정규화가 대소문자를 무시하고 여러 공백을 하나로 합쳐 실제 출력과 다른 문자열도 정답 처리할 수 있음을 수정 전 재현했다. 특히 W1–W9의 불리언·영문 출력·목록, W7 D4의 내부 공백, W5 D5의 두 줄 결과 등록을 다시 확인했다.
- 결과 문자열의 대소문자와 내부 공백을 보존하고 Windows 줄바꿈(CRLF/LF)만 통일하는 `exact-output` 채점을 W1–W27의 결과 추적 문제에 적용했다. W5 D5는 두 줄 출력을 기본 정답으로 두고 문제에서 안내한 한 줄 형태도 대체 답으로 유지했다. 기존 진도 기록에 변경된 정답 판정을 소급 적용하지 않도록 135개 문제 ID를 내용 버전에 맞춰 올렸다. W28–W31은 답이 설계·상황 설명인 시나리오형이어서 유연한 문장 채점을 유지하고 회귀 검사로 경계를 고정했다.
- Kotlin 공식 문서에서 제네릭·Java null 처리·예외·코루틴·Flow, Android 문서에서 API 37·Compose 상태·수명 주기·접근성·근거리 통신망 권한을 대조했다. 예제는 여전히 코드 읽기 연습이며 Android/JVM 런타임에서 컴파일·실행했다고 표시하지 않는다.
- Kotlin/grading 표적 검사 28/28, 전체 `npm test` 456/456, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`, 변경한 JavaScript 구문 검사가 통과했다. AI 과정은 기존 경로와 화면 확인이며 전체 CQ를 완료 처리하지 않는다. 전체 콘텐츠 감사 완료율은 유지하고 공개 배포하지 않았다.

## 2026-10-29 Spring Boot W4–W6 두 번째 재검수

- W4–W6의 15일 목표·예제·문항·정답·피드백을 다시 맞춰 읽었다. 두 가지 당일 주제 불일치를 확인했다.
- W4 D3의 오류 찾기 문제는 `PathVariable` 학습일에 전날 `@RequestBody` 누락을 다시 물었다. 기존 기록은 보존하고 `spring-controller-locate-v2`로 바꿔 URL의 `{id}`와 매개변수 사이에 `@PathVariable("id")`가 빠진 실제 결함을 찾도록 했다.
- W5 D3 설명은 안전한 응답 DTO로 옮기라고 했지만 화면 예제는 출처가 없는 `errors` 변수를 사용하고 `FieldError` 객체 목록을 응답에 통째로 담았다. 질문도 `BindingResult` 경로를 생략했다. `MethodArgumentNotValidException.getBindingResult().getFieldErrors()`에서 공개할 필드명과 고정 안내 문구만 자체 `PublicFieldIssue` 형식으로 옮기는 예제로 고치고, 질문·정답 해설을 같은 흐름에 맞췄다. 거부된 입력값, 메시지 코드·인자 및 Spring 오류 객체는 공개 응답에서 제외한다.
- Spring Framework [요청 본문 검증](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html), [Validation 예외와 `MethodArgumentNotValidException`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html), [Framework 7.0.9 `FieldError` API](https://docs.spring.io/spring-framework/docs/7.0.9/javadoc-api/org/springframework/validation/FieldError.html)를 대조했다. FieldError는 거부된 값을 포함하며 기본 문자열 표현이 오류 속성을 노출할 수 있다.
- `tests/spring-curriculum-quality.test.js`에 W4·W5 불일치와 정답 채점 회귀를 먼저 추가해 수정 전 실패를 확인했다. 대상 Spring 검사 23/23, 전체 `npm test` 438/438, `npm run check:release` 빌드·152개 파일(최대 9.621 MiB), `git diff --check`가 통과했다. 브라우저 화면 검수는 Computer Use가 현재 주소를 판별하지 못해 마치지 못했다. 이번 표적 검수로 전체 CQ 완료율을 올리지 않으며 공개 배포하지 않는다.

## 2026-10-29 Spring Boot W10–W26 두 번째 재검수

- W10–W26의 85일 학습 목표·예제·문항·정답·오답 안내·단답 채점 범위를 다시 대조했다. 재시도·중복 실행, JPA 조회, 이벤트 소비, 보안 경계, 운영 설정과 API 변경 예제가 실제 표시 코드 및 전제와 일치하는지 확인했다.
- W10에서는 제한 시간 설정만 선언하고 실제 HTTP 요청에 적용하지 않던 예제와, 결제 재시도 중복 방지 조건이 빠진 설명을 맞췄다. 요청 상관관계 ID와 분산 추적 ID를 구분하고 구조화 로그 필드와 주석을 한국어로 정리했다. W13–W15에서는 여러 컬렉션 fetch join의 카테시안 결과 및 Bag 조합 예외를 명확히 하고, 페이지 조회·정렬 허용 목록·실행 조건을 구체화했다. W15의 Hibernate 통계는 `Statistics`의 `getPrepareStatementCount()`가 SessionFactory 전역 누적 카운터이며 SQL 실행 횟수와 다르다는 범위를 밝혔고, Boot 4.1.2가 관리하는 Hibernate 7.4 문서에 맞췄다.
- W16 소비 예제의 `existsById` 후 저장은 동시에 처리되면 중복 삽입을 막지 못했다. 고유 제약으로 보호되는 원자적 `insertIfAbsent`를 업무 트랜잭션 안에서 먼저 실행하도록 고쳤다. W18 Testcontainers 설정은 테스트 컨텍스트에 `@Import`가 빠져 있던 점을 보완했고, formatter 예제 출력과 질문의 정답 문자열을 일치시켰다.
- W19–W21에서는 JWT 발급자·대상·권한 확인과 CORS·CSRF 경계를 구분하고, 비동기 작업의 프록시 호출·Executor·예외·보안 문맥·취소 조건을 예제와 해설에 맞췄다. 겹치는 보안 출처와 중복 단답 허용값을 제거했다. W22–W24에서는 readiness 오류 줄을 실제 표시된 속성 위치에 맞추고 운영·컨테이너 예제의 영어 주석을 한국어로 바꿨다. W25–W26은 호환성·안전한 오류 응답·OpenAPI 계약을 점검하고, 회고 조치 예제의 누락된 담당자·기한·완료 기준을 코드와 문제에서 같은 네 필드로 보여 주도록 했다.
- Spring 공식 [REST 클라이언트](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html), [트랜잭션 이벤트](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html), [Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html), [Hibernate 7.4 HQL](https://docs.hibernate.org/orm/7.4/querylanguage/html_single/Hibernate_Query_Language.html)·[Statistics API](https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/stat/Statistics.html), Security [JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)·[CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)·[CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html), Boot [Actuator 엔드포인트](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), [OpenAPI 3.1.1 명세](https://spec.openapis.org/oas/v3.1.1.html), [Boot 4.1.2 요구 사항](https://docs.spring.io/spring-boot/system-requirements.html)을 기준으로 확인했다.
- W10–W26 Spring 표적 검사 61/61, 전체 `npm test` 445/445, `npm run check:release`의 정적 빌드·152개 파일(최대 9.621 MiB) 검사와 `git diff --check`가 통과했다. Spring 애플리케이션 컴파일·실행 및 이 묶음의 브라우저 화면 검수는 하지 않았다. 이 기록은 해당 주차의 정적 콘텐츠 재검수이며 전체 CQ 완료를 뜻하지 않고 공개 배포도 하지 않는다.

## 2026-10-29 Java W1–W15 단답 채점 범위 재검수

- Java 첫 15주에 있는 단답 60개를 질문·표시 예제·정답·해설과 대조했다. 코드 출력 질문은 실제 출력 문자열인지 계산된 값인지 다시 구분하고, API·키워드·호출 대상을 묻는 질문은 필요한 식별자를 답에 포함하는지 확인했다.
- W2 D1의 `int score` 60 이상 조건은 `score >= 60`과 띄어쓰기만 허용해 `60 <= score`, 괄호식, 같은 정수 조건인 `score > 59`를 오답 처리했다. 질문 전제를 명확히 하고 동등 답을 추가했다. W5 D2는 호출 괄호가 없는 `Course.createdCount`를 메서드 호출처럼 받아들였고 W5 D3는 정확한 호출식 대신 “getter”만 적어도 정답 처리했다. W6 D1도 키워드를 묻는데 `상속`이라는 설명어를 허용했다. 올바른 코드 표현은 허용하고 틀리거나 모호한 답은 정답에서 제외했다.
- W7 D5는 어떤 객체의 `remove`인지 빠진 답도 통과해 `iterator.remove()`를 묻게 고쳤다. W8 D3는 예외 순서를 묻는데 “하위 예외”라는 이름 없는 답이 통과했고, W8 D5는 API 호출 대신 “원인 읽기”라는 설명만으로도 통과했다. W11의 `join`, `incrementAndGet`, `countDown`에도 구체 메서드명을 요구하고, W12 D2는 `points.size()`가 알려 주는 목록 원소 수와 실제 JVM 메모리 할당을 분리했다. 워밍업 설명의 모호한 부정 표현도 “성능 향상을 보장하나요?”로 다듬었다.
- W13–W15의 출력 답안을 코드 결과와 다시 맞췄다. `첫 강의`의 공백, `read=Java`의 공백 없는 형식, 날짜·시각 API의 실제 문자열을 분명히 하고 다른 한국어 날짜 표기를 출력 결과인 것처럼 채점하지 않도록 했다. W15의 파싱·예외 문자열은 한국어로 바꿨다. `requirePositiveMinutes(30)`은 실패 사례만 보이던 예제에 실제 성공 호출을 추가해 문제의 전제를 화면에서 확인할 수 있게 했다. W15 D5에서 오류 문구 일부만 답해도 정답 처리하던 점도 수정했다.
- Java SE 21 공식 [JLS §15.20.1 비교 연산자](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.20.1), [`Iterator.remove`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Iterator.html), [`Throwable`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html), [`LocalDateTime`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDateTime.html), [`Objects.requireNonNull`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html)를 대조했다. 새 회귀 조건은 수정 전 실패를 재현한 뒤 수정했다.
- Java 과정과 공통 콘텐츠 검사 60/60 통과. 이번 기록은 W1–W15 단답 채점 범위 검수다. Java 전체 컴파일·실행 검증이나 모든 객관식·해설의 전수 검수를 뜻하지 않는다. 전체 회귀와 릴리스 검사는 연속 작업 마무리 때 다시 실행하며, CQ 완료율은 올리지 않고 공개 배포하지 않는다.

## 2026-10-29 Java W1–W3 단답 답안 범위 추가 재검수

- 첫 3주에 표시되는 단답 13개를 질문·예제·해설·허용 답안과 대조했다. 대부분 출력값, 코드에 실제로 나온 식별자, 핵심 개념처럼 답의 범위가 좁게 정해져 있었고 등록 답안은 그 질문을 충족했다.
- W2 D1은 `int score`가 60 이상인지 묻지만 `score >= 60`의 띄어쓰기 변형만 허용했다. 동등한 `(score >= 60)`, `60 <= score`, 괄호를 붙인 반대 방향 비교식과 정수 조건에서 같은 결과를 내는 `score > 59`가 실제 채점에서 오답 처리되는 것을 재현했다. 질문에 `int` 조건을 분명히 하고 이 동등 표현을 허용했으며 해설에도 같은 이유를 적었다. 근거: Java SE 21 [JLS §15.20.1 수치 비교 연산자](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.20.1).
- 새 회귀 검사는 수정 전 `60 <= score`에서 실패했고 수정 후 세 동등 표현이 모두 통과했다. Java 과정 및 공통 콘텐츠 대상 검사 56/56이 통과했다. 전체 회귀·정적 릴리스 검사는 이번 범위 후 재실행 예정이며, CQ 전체 완료율은 올리지 않고 공개 배포도 하지 않는다.

## 2026-10-28 AI W22–W23 선택 실습 구체화

- 프롬프트·검색·미세 조정 선택과 이미지·음성 활용을 다루는 10일의 기존 예제와 30문항을 재검토했다. 질문·답은 목표와 맞았지만 학습 순서의 적용 활동은 일반 안내여서 실제 입력·작업·검사 기준을 제공하지 못했다.
- 같은 공지에 다른 요청 조건 적용, 시행 문서와 예정 초안 구분, 합성 문의 분류 기준 만들기, 7.5시간 계산 검증, 동일 문의로 프롬프트와 문서 검색 비교를 구성했다. 멀티모달 주차에는 가상 영수증·직접 그린 그림·개인정보 없는 음성 문장·합성 음성 동의·사진 정보 가리기 연습을 넣었다. AI 도구는 선택이며 가상 사례를 직접 판단해도 된다.
- 공식 OpenAI [프롬프트 설계](https://developers.openai.com/api/docs/guides/prompt-engineering), [검색](https://developers.openai.com/api/docs/guides/retrieval), [모델 최적화](https://developers.openai.com/api/docs/guides/model-optimization), Google [이미지 이해](https://ai.google.dev/gemini-api/docs/image-understanding), [음성 이해](https://ai.google.dev/gemini-api/docs/audio) 문서를 대조했다. AI 전용 회귀 7/7, 전체 `npm test` 435/435, 빌드와 152개 파일·최대 9.621 MiB 정적 릴리스 검사가 통과했다. JavaScript 구문·`git diff --check`·수정 파일 공백 검사도 통과했다.
- AI 도구는 사이트에서 실행하거나 사용자 입력을 전송하지 않는다. 이 배치는 W22–W23의 활동 안내 개선이며 전체 콘텐츠 감사 완료로 합산하지 않고 공개 배포도 하지 않는다.

## 2026-10-28 AI 과정 W1–W27 재검수 완료

- W1–W27 전체 135일·405문항의 예제, 질문, 정답·허용 답, 오답 선택지와 피드백을 대조했다. 역전파·Transformer·토큰 생성·도구 호출·RAG·안전·운영·적용 설계의 정의와 적용 흐름을 확인하고 확률·회귀·어텐션 계산을 직접 다시 계산했다.
- W11 퍼셉트론 예제는 단순화 조건과 편향값 `b=0`을 밝히고, W14 어텐션 가중합은 `0.25×2 + 0.75×10 = 8`을 단계별로 설명했다. W26 D2의 “조용히 실패” 안내는 사용자에게 실패를 알리고 검증된 대체 절차나 담당자 경로를 안내하도록 수정했다. 반복 해설과 한국어 조사도 다듬었다.
- AI 과정의 27주를 문항 검수 완료로 표시했다. AI 전용·공통 콘텐츠 표적 검사 36/36, 전체 `npm test` 433/433, `npm run check:release`의 152개 정적 파일 검사, `git diff --check`가 통과했다. 브라우저에서 AI 경로, 첫 주 학습 화면, 접힌 공식 문서 목록을 확인했다.
- AI 과정 검수는 완료했으나 전체 감사는 열려 있다. 나머지 트랙·공통 콘텐츠의 전수 감사는 계속하며 전체 콘텐츠 완료율은 올리지 않았다. 공개 사이트에 배포하지 않았다.

## 목표와 현재 상태

- 목표: 학습자가 입문부터 고급·실전까지 정확하고 이해하기 쉬운 설명, 예제, 연습, 해설을 순서대로 접하도록 전체 콘텐츠를 다시 감사하고 발견한 결함을 작은 묶음으로 고친다.
- 이전 감사 상태: **2026-10-16에 CQ-0–CQ-7 100% 완료로 기록했으나, 이는 당시 검사 기록이며 오류가 없다는 보증이 아니다.** 2026-10-18 재검수에서 Java 질문·선택지 불일치, C# 컴파일 오류 등 실제 결함이 나와 기존의 완료 표시는 현재 콘텐츠 신뢰도 지표로 사용할 수 없다. 이전 배치 수와 테스트 기록은 감사 이력으로 보존한다.
- 현재 재검수 상태: **열림**. 2026-10-18부터 실제 오류를 추가로 찾아 수정하고 회귀 검사를 보강하고 있다. 새 AI 과정 27주는 별도 전수 편집 검수를 마쳤다. 나머지 11개 트랙·324주의 모든 문제 유형과 풀이를 새로 하나씩 검수한 것은 아니며, 미검수 범위와 채점 한계는 아래 결과에 정리한다. CQ 전체 완료율을 다시 100%로 표시하지 않는다.
- CQ-1에서 확인한 긴급 결함 E-91–E-95는 수정하고 회귀 검사를 통과했다. CQ-2 이후 기본 언어의 나머지 주차를 차례로 검수한다.
- 이 감사는 G10/G11/CP의 이전 완료 기록을 소급 삭제하거나 과거 배포를 되돌리지 않는다. 기존 `reviewedWeeks` 표시는 과거 승인 기록으로 보존하되, 이번 재감사의 완료 증거로 단독 사용하지 않는다.
- 범위는 무료·로컬에서 검수할 수 있는 콘텐츠다. 실행 환경이 없는 프레임워크에 결과 채점 문제를 강제하지 않는다. 실제 실행·컴파일을 하지 않은 예제는 그 사실을 명시한다.

## 감사 대상과 기준선

| 자산 | 현재 목록 | 수량·범위 | 감사 시 구분 |
|---|---|---:|---|
| 언어·프레임워크 장기 과정 | 12개 트랙, 351주, 주 5회 | 1,755회·5,265개 연습 | AI 27주·405문항 편집 검수 완료. 나머지 11개 트랙은 객관식·주관식·오류 찾기·코드 수정·실행 사례를 나눠 재검수 |
| 공통 실무 기초 | 26주 | 130회·390개 연습 | 언어 과정과 합산하지 않고 별도 감사 |
| 초기 카탈로그 과정 | G10의 60단원 | 180문항 | 현재 주차 과정과 중복되는 원본·연결 관계를 먼저 확인 |
| 결과 채점 코딩 문제 | JavaScript·TypeScript·PostgreSQL·FastAPI 각 50개 | 200문제·문제별 공개 테스트 사례 | 정답 구현을 실제 실행기에서 재실행하고 계약·사례·해설을 대조 |

기준선 검사에서 `npm test` **175/175 통과**를 확인했다. 이 검사는 데이터 구조, 정답 키, 여러 주차의 사례 연결, 실행 문제와 런타임 계약을 폭넓게 확인한다. 다만 모든 설명·예제가 학습 목표에 맞는지 전수 판정하지는 않는다. 예를 들어 Java 품질 검사는 W13–W26의 주제별 근거를 확인하지만, 이번 배치 전에는 W26 하루별 예제·적용 문제의 의미 연결이 충분하지 않았다([Java 검수 테스트](../../tests/java-curriculum-quality.test.js:57), [공통 콘텐츠 테스트](../../tests/content.test.js:86)).

### 기준선에서 확인한 문제와 위험 신호

| ID | 우선순위 | 확인 내용 | 근거·판정 |
|---|---|---|---|
| E-91 / CQ-F01 | 높음 | Java W26 D1은 ‘종합 복습과 다음 계획’ 주차의 ‘코드 읽기’ 날인데, 오늘의 예제가 `if (completed > 0) return completed;` 한 줄이다. `completed`의 선언·메서드 계약·입력과 결과가 없어 예제만으로 흐름을 학습하기 어렵다. | 주차 목표 [weekPlans 26](../../src/curriculum-weeks-java.js:66), 고정 예제 [dayKnowledge](../../src/curriculum-weeks-java.js:228), 제목만으로 공통 학습 자료를 고르는 생성기 [newSession](../../src/curriculum-weeks-java.js:370). 자동 검사는 길이·문항 수를 확인하지만 이 주차 의미 연결을 빠뜨렸다. |
| E-92 / CQ-F05 | 매우 높음 | PostgreSQL 과정 객관식 195개 중 130개가 정답 키로 오답 보기를 선택하고 있었다. 선택지는 그대로 두고 정답 ID만 바로잡았다. | 원인은 정답 보기를 회전한 뒤 항상 위치 0을 정답으로 기록한 생성 로직이다. 수정 후 모든 학습 주차에서 선택된 문구가 해당 날짜의 정답 근거와 일치하는지 검사한다. |
| E-93 / CQ-F06 | 높음 | JavaScript W26의 대표 예제는 선언되지 않은 `initial`을 쓰고 누적 함수가 항목을 무시했다. 하루별 예제도 해당 캡스톤 주제 대신 일반 코드 조각을 재사용했다. | 주간 예제를 빈 입력 초기값과 실제 합산을 가진 요약으로 고치고, 하루별 예제를 그날의 추적 문제와 맞췄다. |
| E-94 / CQ-F07 | 중간 | TypeScript W26은 평균 함수 하나를 접근성·버전·회귀 검토 5일에 반복하고, 정답 설명도 서로 다른 목표를 한 문장에 묶었다. | 5일을 타입/실행 검증, 경계 입력, 키보드 점검, 버전·실행 범위, 회귀 사례로 나누고 예제·정답·해설을 각각 맞췄다. |
| E-95 / CQ-F08 | 높음 | FastAPI W30은 5일 모두 같은 상세 GET 경로를 보여 주며 목록·등록·의존성·테스트 목표를 코드에서 볼 수 없었다. 오류 찾기 예제도 자연어 오답을 Python 코드 줄로 끼워 넣었다. | 하루별 목록·404·요청/응답 모델·Depends·TestClient 사례로 교체하고, 각 진단 사례를 문법이 유효한 Python 코드로 바꿨다. |
| CQ-F02 | 중간 | Java 생성 세션의 소개문은 날짜 주제에 관계없이 “실제 Java 코드의 전제와 실패 경로”라는 공통 문구를 덧붙인다. 일반 코드 읽기에는 일부 맞지만 마지막 주 복습 계획 등 일부 목표에는 지나치게 포괄적이다. | [Java session 생성](../../src/curriculum-weeks-java.js:381). 모든 트랙에서 공통 문구·템플릿 재사용 여부를 확인한다. |
| CQ-F03 | 점검 필요 | 짧은 코드 조각과 다른 주차에서 다시 쓰인 예제가 일부 있다. 짧거나 반복된다는 사실만으로 결함은 아니며, 학습 목적·맥락이 실제로 달라지는지 편집 검토가 필요하다. | 기준선 휴리스틱: 24자 미만 예제 57개(일부는 파일 경로·선언·간단한 연산이라 적절할 수 있음), 같은 트랙 안의 예제 재사용 18회. 후보 목록과 분류는 검수 배치별로 기록한다. |
| CQ-F04 | 프로세스 위험 | `reviewedWeeks`와 문항 수·상태 검사는 주차가 목록에 포함되고 필수 데이터가 있는지 확인한다. 그 자체로 예제와 목표의 의미 일치를 증명하지 않는다. | [검수 상태 검사](../../tests/content.test.js:55), 상태 연결 [content.js](../../src/content.js:423). 이번 감사에서는 구조 검사, 실행 검증, 편집 검수를 서로 다른 증거로 기록한다. |

## 편집 승인 기준

각 주차·문제 배치는 아래 기준을 모두 확인한 뒤 승인한다. 자동 검사를 통과해도 편집 검수 항목을 건너뛰지 않는다.

1. **목표와 문항 연결:** 주차 목표 → 하루 목표 → 설명 → 예제 → 세 문항 → 정답·힌트·해설이 같은 개념과 상황을 다룬다. 문항마다 평가하려는 동작을 한 문장으로 적을 수 있어야 한다.
2. **예제의 완결성과 맥락:** 언어 예제는 별도 표시가 없으면 실행 가능한 최소 단위로 작성한다. 일부 코드 조각을 쓰면 ‘일부 코드’라고 표시하고 필요한 타입·변수·호출 위치·입력 조건을 설명한다. 핵심 결과나 흐름은 주석 또는 사례로 보여 준다.
3. **정확성:** 답안은 문제의 조건에서 참이어야 한다. 객관식에는 중복·복수 정답·문맥에 따라 바뀌는 모호한 답이 없어야 한다. 주관식 허용 답은 학습 개념을 맞게 판정하고, 오류 줄은 실제 결함을 가리키며, 코드 수정 기준은 명시된 요구와 일치한다.
4. **가르치는 해설:** 정답을 반복하지 않고 이유와 적용 범위를 설명한다. 오답별 피드백과 힌트는 다음 추론을 돕되 정답을 무관하게 노출하지 않는다. 초심자가 모르는 용어는 처음 나올 때 풀어 쓴다.
5. **순서와 난이도:** 선수 개념이 앞에 있고 한 세션이 다음 세션의 근거를 제공한다. 쉬운 예에서 변형·경계·실패·설계 판단으로 난도가 단계적으로 오른다. 반복은 복습 목적과 다른 학습 동작을 명시한다.
6. **기술·버전 출처:** 버전에 민감한 API·문법·보안 주장은 공식 문서와 확인 날짜를 연결한다. 안정·LTS·미리보기·실험 기능을 구분한다. 실행 확인은 실제 검증 환경과 범위를 함께 기록한다.
7. **실행 경계의 정직성:** 실제 실행기를 통과한 경우에만 실행 결과 채점이라고 표시한다. 실행이 어려운 기술은 무료로 확인할 수 있는 코드 읽기·개념·설계 연습만 제공해도 승인 가능하다. 실행하지 않은 예제는 실행한 것으로 소개하지 않는다.
8. **화면에서의 이해 가능성:** 예제와 문항이 화면에서 같은 학습 단위에 보이고, 코드가 잘리지 않으며, 풀이 중 목표·입력·기대 결과를 찾을 수 있다. 작은 화면·키보드 사용도 확인한다.

각 항목은 `통과 / 수정 / 확인 불가`로 표시한다. 정확성·정답 기준·목표 연결·실행 경계가 `수정` 또는 `확인 불가`이면 해당 배치는 승인하지 않는다. 확인 불가 항목에는 이유와 후속 확인 방법을 적는다.

## 순차 진행과 가중 진척률

한 배치는 **2–4주 또는 최대 60문항**으로 나눈다. 각 배치에서 먼저 문제 목록과 공식 출처를 고정하고, 편집 검토 → 필요한 수정 → 검증 → 진척 기록 순으로 진행한다. 내용 ID는 기존 학습 기록과 백업 호환 때문에 가능한 한 유지한다.

| 순서 | 단계 | 가중치 | 범위·완료 조건 | 상태 |
|---:|---|---:|---|---|
| 0 | CQ-0 기준선·감사 운영 원칙 | 10% | 카탈로그 수량, 기존 검사 결과, 확인된 결함, 승인 기준과 배치 운영을 기록 | 완료 |
| 1 | CQ-1 긴급 결함·주차 마무리 점검 | 10% | Java W26 D1을 목표에 맞게 고치고 회귀 검사를 추가한다. 이어 모든 트랙 마지막 1–3주와 캡스톤을 비교해 급한 종합·출시 주제 불일치를 찾는다. | 완료 |
| 2 | CQ-2 기본 언어 전체 편집 검수 | 20% | Java, JavaScript, Python을 각각 W1부터 끝까지 2–4주 배치로 검수한다. 각 주의 예제·정답·오답·선수 난도를 확인한다. | 완료 — Java W1–W26, JavaScript W1–W26, Python W1–W26; 78/78주·1,170/1,170문항 |
| 3 | CQ-3 프레임워크 과정 검수 | 15% | Spring Boot, React, FastAPI, Next.js를 전체 주차별로 검수한다. 요청·상태·서버/브라우저 경계와 실제 실행 여부를 확인한다. | 완료 — 115/115주·1,725/1,725문항; Spring Boot·React·FastAPI·Next.js 전 과정 검수 |
| 4 | CQ-4 타입·모바일·런타임 없는 언어 검수 | 15% | TypeScript, Kotlin·Android, C#·.NET을 전체 주차별로 검수한다. 안정/시험 기능, 코드 조각의 전제, 실행 미지원 표시를 확인한다. | 완료 — 92/92주·1,380/1,380문항 |
| 5 | CQ-5 SQL 과정과 실행형 문제 은행 | 15% | PostgreSQL 39주·585문항과 네 실행형 문제 은행 200개·공개 사례를 검수한다. 사용 가능한 로컬 엔진에서 예제·정답·경계·오류 사례를 재실행한다. PostgreSQL은 3주씩 13개 배치, 각 문제 은행은 25개씩 8개 배치로 나눠 총 21개 배치의 승인율을 계산한다. | 완료 — PostgreSQL W1–W39 39/39주·585/585문항; 문제 은행 200/200개(JS·TypeScript·PostgreSQL·FastAPI 각 50개); 21/21 배치 |
| 6 | CQ-6 공통 실무·초기 카탈로그 검수 | 10% | 공통 실무 26주·390문항과 G10 60단원·180문항을 원본·중복 관계부터 확인해 전수 검수한다. | 완료 — 공통 실무 W1–W26 390/390문항·13/13 배치; G10 JavaScript·Python·Java·Spring Boot·React 각 12/12단원·36/36문항; CQ-6 570/570문항·33/33 배치 |
| 7 | CQ-7 전 트랙 통합 확인·승인 상태 정리 | 5% | 알려진 결함 해결, 전체 자동 검사, 출처·화면·저장 경로 확인, 주차별 감사 영수증 및 공개/로컬 구분을 마친다. | 완료 — 전체 회귀 365 통과·1 건너뜀·실패 0; release audit 149개 파일; 주요 로컬 화면·저장·공개 카탈로그 차이 확인 |
|  | **합계** | **100%** | 단계 가중치 × 해당 단계 내 승인된 배치 비율로 계산한다. |  |

### CQ-6 배치와 계산 기준

- 공통 실무 26주는 2주씩 13개 배치로 검수한다. 배치당 30문항이다.
- G10은 원본 단원·기존 문항·확장 문항의 연결과 중복을 먼저 대조한 뒤, JavaScript → Python → Java → Spring Boot → React 순으로 3단원씩 20개 배치(배치당 9문항)를 검수한다.
- CQ-6은 배치 개수를 단순 평균하지 않고 승인된 **원본 문항** 수를 분모 570으로 나눈다. 공통 실무 390문항과 G10 초기 카탈로그 180문항을 각각 기록한다. G11 주간 학습 경로는 G10 원본 문항을 보존·연결하면서 추가 연습 45개를 포함하지만 이 추가 연습은 CQ-6 분모 570에 포함되지 않는다. 이전 기록의 489/570은 Python 주간 추가 연습 36개를 초기 문항 승인 수에 잘못 더한 값이므로 453/570으로 바로잡았다. 전체 가중 진척은 기존 CQ-0–CQ-5 완료 85%에 `10% × 승인 원본 문항 / 570`을 더한다.
- 공통 실무 W1–W26 390/390문항과 G10 JavaScript·Python·Java·Spring Boot·React 각 1–12단원 36/36문항을 승인해 CQ-6 누계 570/570문항·33/33 배치를 완료했다. CQ-7의 5%도 자동·화면·저장·공개/로컬 검증과 기록까지 마쳤으므로 정밀 종합 진척은 `85% + 10% × 570/570 + 5% × 100/100 = 100.00%`다.

### 각 배치의 작업 기록

각 배치 완료 시 아래 내용을 이 문서의 감사 이력에 추가하고 `docs/plan/progress.md`와 `docs/plan/decisions-and-help.md`를 갱신한다.

- 트랙·주차·문항 ID와 리뷰한 공식 버전/출처
- 발견된 결함, 재현 가능한 화면 또는 입력, 심각도와 학습 영향
- 수정 전후의 설명·예제·정답 차이
- 정답·오답·경계 입력 검증 및 실행/비실행 경계
- 추가·수정한 회귀 검사, 실행한 명령과 결과
- 열린 항목, 확인 불가 사유, 사용자 결정이 실제 필요한지

## 이전 감사의 완료 기록 (역사 기록)

### CQ-0 — 기준선 및 초기 스캔 (완료, 10%)

- 11개 트랙의 324주·1,620회·4,860문항, 공통 실무 26주·390문항, G10 60단원·180문항, 실행형 200문제 카탈로그를 감사 범위에 등록했다.
- 현 저장소 전체 검사 `npm test`: 175 통과, 0 실패.
- Java W26의 오늘의 예제와 주간 복습 목표 불일치 및 테스트 범위 공백을 E-91로 기록했다.
- 짧거나 반복된 예제는 자동 결함으로 세지 않고 편집 확인 후보로만 분류했다.
- 당시에는 콘텐츠 수정 전 기준선을 기록했다. 후속 수정은 아래 CQ-1 완료 기록에 분리했다.

### CQ-1 — 긴급 결함 및 전 트랙 마지막 주차 점검 (완료, 누적 20%)

- JavaScript, Python, Java, FastAPI, Spring Boot, React, Next.js, Kotlin·Android, C#·.NET, TypeScript, PostgreSQL의 마지막 두 주차에서 주차 목표·하루 목표·예제·정답을 대조했다. 결함으로 보이는 예제가 실제로는 오류 찾기 연습인 경우도 정답·오류 줄·해설로 확인해 정상 예제와 구분했다.
- E-91: Java W26 D1을 입력 목록부터 완료 수 결과까지 따라갈 수 있는 전체 Java 예제로 바꾸고, 공통 소개문을 복습 목표에 맞췄다.
- E-92: PostgreSQL 객관식 195개 중 잘못된 정답 키 130개를 수정했다. 선택지 ID와 문구 연결은 그대로 유지했다. 회귀 검사는 모든 주차·일자의 표시 정답이 검수 데이터의 정답 설명과 일치하는지 확인한다.
- E-93: JavaScript W26의 미정의 `initial`과 항목을 무시하는 reduce 예제를 바로잡고, 다섯 일차의 예제를 해당 추적 문제와 같은 코드로 연결했다.
- E-94: TypeScript W26 다섯 일차의 예제·정답·설명을 타입/실행 테스트, 경계 입력, 키보드 검토, 버전과 변환 범위, 회귀 사례로 분리했다. 키보드 접근성과 정적 타입 검사를 코드가 자동으로 증명한다고 표현하지 않는다.
- E-95: FastAPI W30에 목록 조회, 404, 요청·응답 모델, 의존성 주입, 파라미터화 테스트 사례를 넣었다. 다섯 오류 진단 코드 조각과 다섯 수업 예제를 Pyodide에서 문법 검사했다.
- CQ-1에서 확인한 주차 예제·정답 키 회귀 검사를 추가했다. Spring Boot의 일부 잘못된 운영 예제와 React의 키보드 미지원 요소는 오류 찾기 문항의 실제 결함 줄·정답·해설이 맞아 의도된 진단 사례로 남겼다. Python, Next.js, Kotlin·Android, C#·.NET의 마지막 주차에서는 추가 수정이 필요한 의미 불일치를 찾지 못했다.
- 변경된 트랙 전용 검사 27/27 통과, `npm test` 179/179 통과, `npm run check:release` 통과(정적 파일 93개, 최대 9.621 MiB), FastAPI W30 코드 10개 문법 통과, `git diff --check` 오류 없음(기존 줄바꿈 경고만 확인).
- 이번 단계에서 비용 서비스, 서버, 클라우드 DB, 계정 동기화, 결제 또는 외부 공개 배포를 추가하지 않았다. 사용자 도움이나 결정이 필요한 항목은 없다.

### CQ-2 Java W1–W3 — 첫 배치 (완료; 전체 21%)

- 3주·15일·45문항을 주간 목표, 일일 목표, 객관식 정답과 피드백, 주관식 허용 답, 오류 줄, 코드 수정 기준까지 대조했다. 세 주의 다섯 일차 예제 15개가 선언되지 않은 변수와 실행 맥락 없는 코드 조각이어서 학습자가 입출력 흐름을 따라가기 어려운 점을 E-96에 기록했다.
- 오늘의 예제를 각각 실행 가능한 최소 `class`와 `main`으로 바꾸고 대표 입력값·처리·`System.out.println` 출력 및 예상 결과를 넣었다. 코드 문제의 ID와 객관식 선택지 ID/문구 연결은 변경하지 않았다.
- 자동 생성 질문의 조사 오류(예: `변수 선언과 초기화을`)와 코드 식별자 뒤에 잘못된 조사가 붙던 정답 해설을 문장 구조를 바꿔 바로잡았다. 주제별 정답과 오답 설명, 주관식 수용어, W1 D3·W3 D1의 실제 오류 줄, W1/W2/W3 D4 수정 기준을 확인했다.
- `node --test tests/java-curriculum-quality.test.js`: 7/7 통과. JDK 8에서 switch 표현식을 제외한 Java 예제 14개를 컴파일하고 실행해 주석의 예상 출력과 일치함을 확인했다. Java 트랙은 Java SE 25 기준이며 [Java SE 25 언어 명세 §15.28](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.28)이 switch 표현식을 규정한다. 이 환경에는 Java 25 컴파일러가 없어 해당 예제의 대상 버전 컴파일은 아직 확인하지 않았다. 웹사이트는 Java 코드를 실행한다고 표시하지 않는다.
- 이 배치의 3/78 기본 언어 주차를 검수했다. 비용 서비스·서버·클라우드 DB·계정·결제·공개 배포는 추가하지 않았다. 사용자 결정이 필요한 항목은 없다.

### CQ-2 Java W4–W6 — 두 번째 배치 (완료; 전체 22%)

- 추가 3주·15일·45문항에서 주간/일일 목표, 객관식 정답과 해설, 주관식 허용 답, 오류 진단 줄, 코드 수정 기준을 확인했다. 메서드·생성자·접근 제어·상속·재정의·추상 클래스·인터페이스의 오늘의 예제 15개를 전체 실행 흐름과 예상 출력이 보이도록 보완했다.
- W4 D4의 지역 변수 범위 수정 문항이 절댓값 계산을 요구했다. W5 D3의 객체 생성 문항은 접근 제어 목표와 맞지 않았고, W6 D1–D3의 인터페이스/record 문항은 상속·메서드 재정의·추상 클래스 목표와 맞지 않았다. W6 D4의 `Consumer.accept` 수정 문제도 해당 주에 배우는 `Notifier` 인터페이스 계약과 무관한 함수형 인터페이스를 선행 지식 없이 사용했다. 목표에 맞는 문제로 고치고, 학습 기록에 남아 있던 이전 문제 ID는 덮어쓰지 않도록 변경이 큰 문항에 새 `-v2` ID를 부여했다.
- W1–W6 코드 수정 문항의 생성 예제에서 `return`과 세미콜론을 문자열로 제거해 출력값을 만들던 결함도 확인했다. W1–W6의 정상·경계 사례를 실제 동작 기준의 입력/기대 결과로 바꾸고, Java 문항은 전체 메서드 형태를 검사할 뿐 코드를 실행하지 않는다고 표시했다.
- `node --test tests/java-curriculum-quality.test.js`: 8/8 통과. JDK 8에서 Java SE 25 switch 표현식을 제외한 W1–W6 예제 29/30개를 한 번에 컴파일·실행하고 모두 주석의 출력과 대조했다. switch 표현식은 공식 [Java SE 25 언어 명세 §15.28](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.28)과 대조했으나, 로컬에는 Java 25 컴파일러가 없어 대상 버전의 실제 컴파일은 미확인으로 남긴다.
- 전체 `npm test` 181/181 통과, `npm run check:release` 통과(93개 정적 파일, 최대 9.621 MiB). CQ-2 기본 언어 78주 중 6주를 검수했다. 가중 전체 진척은 21.54%이며 표시는 반올림해 22%다. 비용 서비스·서버·클라우드 DB·계정·결제·공개 배포를 추가하지 않았고 사용자 결정이 필요한 항목은 없다.

### CQ-2 Java W7–W9 — 세 번째 배치 (완료; 전체 22%)

- 추가 3주·15일·45문항에서 목표와 예제, 객관식 정답·오답 해설, 단답 허용 답, 오류 줄, 수정 기준을 대조했다. 컬렉션·예외·함수형 인터페이스에 관한 예제 15개를 `class`·`main`·대표 입력·출력이 있는 프로그램으로 만들었다.
- W7 D1 컬렉션 문제는 ‘중복 제거’ 요구가 `List와 순서` 목표와 맞지 않았고 선택된 답도 `Map`이었다. 입력 순서와 중복을 보존한다는 요구로 바꾸고 정답을 `List`로 고쳤다. W7 D3의 Map 예제 변수명은 단답 문제의 `minutesByCourse`와 맞췄다. W7 D4 수정 문제는 이전 단원의 `Set.contains`에서 `Comparable<T>` 경계와 최대값으로 바꿨다.
- W8 D2의 catch 순서 오류 문제를 checked 예외를 처리하지 않은 `readLine()` 오류 찾기로 바꾸고, W8 D3의 try-with-resources 단답은 구체 예외와 상위 예외의 순서 문제로 교체했다. W8 D4 수정 해법은 Java 8 형식의 리소스 별칭을 사용하고 `IOException` 선언을 포함한다.
- W9 D1의 스트림 `filter`, D2의 스트림 재사용, D3의 스트림 `map` 문제는 각각 람다·Predicate·Function의 당일 목표와 맞지 않았다. 목표에 맞는 Runnable 선택, Predicate 반환 형식 진단, 문자열 길이 Function 단답으로 교체해 의미 변경 문제에는 새 `-v2` ID를 부여했다.
- `node --test tests/java-curriculum-quality.test.js`: 9/9 통과. JDK 8에서 W7–W9 예제 15/15를 컴파일·실행하고 결과를 비교했다. 첫 전체 테스트에서 교체된 `java-stream-short`를 참조하던 기존 테스트 1건을 발견해 새 Function 단답으로 갱신한 뒤 전체 `npm test` 182/182 통과. `npm run check:release` 통과(93개 파일·최대 9.621 MiB), `git diff --check` 오류 없음(기존 LF→CRLF 경고만 확인).
- CQ-2 기본 언어 78주 중 9주를 검수했다. 가중 전체 진척은 22.31%이며 정수 표시는 22%다. 비용 서비스·서버·클라우드 DB·계정·결제·공개 배포를 추가하지 않았고 사용자 결정이 필요한 항목은 없다.

### CQ-2 Java W10–W12 — 네 번째 배치 (완료; 전체 23%)

- 스트림 파이프라인·동시성·JVM 성능의 3주·15일·45문항에서 예제와 오늘의 목표, 정답 키·오답 설명·오류 위치·단답·수정 기준을 대조했다. 코드 조각 15개를 실행 가능한 최소 클래스로 만들고, AtomicInteger와 동기화는 두 스레드가 동시에 갱신하는 동작 및 결정적인 결과를 보여 주도록 고쳤다.
- W10 D1의 공유 카운터 문제, D2의 경합 오류, D3의 `Thread.sleep` 단답은 스트림 학습 목표와 맞지 않았다. 각각 `filter` 의미, `map` 반환 타입 진단, `flatMap`의 목록 결과로 교체했다.
- W11 D1의 성능 측정 문제, D2의 경과 시간 부호 오류, D3의 preview 옵션 단답은 스레드·가시성·원자적 증가 목표와 맞지 않았다. 새 문제 ID로 교체하고, Java 25 기준의 플랫폼 스레드와 Java 21 이상 가상 스레드 맥락을 예제 주석에 연결했다. `volatile`은 단일 값의 가시성에는 쓸 수 있지만 복합 연산을 원자화하지 않는다고 명시했다.
- W12 D1의 Map 선택, D2의 빈 목록 오류, D3의 `O(n)` 단답은 힙/스택·할당·워밍업 목표를 다루지 않았다. 메모리 영역 판단, 반복 할당 지점 확인, 워밍업 의미로 교체했다. 할당 지점 확인은 자동으로 성능 결함이라고 단정하지 않으며 프로파일링 근거를 찾게 했다. p95 예제는 최근접 순위법을 쓴 20개 표본으로 고정하고 도구별 percentile 계산 방식이 다를 수 있음을 설명했다.
- 버전 확인: Java SE 25 공식 [Stream API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html)는 `Stream.toList()`가 Java 16부터 제공되고 encounter order를 유지하는 수정 불가 목록을 반환함을 확인했다. 공식 [Thread API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html)는 `Thread.ofVirtual()`과 가상 스레드 생성 API를 Java 21부터 제공하고, `new Thread(task)` 생성자는 플랫폼 스레드를 만든다고 확인했다. [AtomicInteger API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html)의 `incrementAndGet()` 원자적 동작도 대조했다.
- `node --test tests/java-curriculum-quality.test.js`: 10/10 통과. JDK 8에서 Java 8 호환 예제 14/14를 컴파일·실행해 출력과 비교했다. `Stream.toList()`가 들어간 1개는 Java 16 이상 API라 Java 8 컴파일 대상에서 제외하고 Java SE 25 API 문서로 검증했다. 전체 `npm test` 183/183, `npm run check:release` 통과(93개 파일·최대 9.621 MiB). 비용 서비스·서버·클라우드 DB·계정·결제·공개 배포를 추가하지 않았고 사용자 결정이 필요한 항목은 없다.
- CQ-2 기본 언어 78주 중 12주를 검수했다. 가중 전체 진척은 23.08%이며 정수 표시는 23%다.

### CQ-2 Java W13–W15 — 다섯 번째 배치 (완료; 전체 24%)

- 파일·경로, 날짜·시간, 입력 경계의 3주·15일·45문항에서 목표·예제·정답·오답 설명·수정 기준을 대조했다. 기존 한 줄 예제 15개를 선언, 대표 입력, 처리, 출력이 있는 전체 클래스로 바꿨다. 파일 예제는 임시 파일을 사용하고 종료 때 삭제하도록 했다. Instant 예제는 고정 시각을 사용해 출력이 환경에 따라 바뀌지 않게 했다.
- W15 제목이 직렬화를 다룬다고 표시했지만 실제 설명·문제는 파싱·입력 검증·DTO 경계만 가르쳤다. 제목을 `입력 검증과 DTO 경계`로 고쳤고 record가 그 자체로 JSON 직렬화를 수행하지 않는다는 설명과 오답을 추가했다.
- W15 DTO 수정 정답은 `CourseRequest(String title, int minutes)` record에 `title`만 넘기는 생성자 오류였다. `title`과 `minutes`를 모두 받는 메서드 계약과 결과 사례로 수정하고 변경된 정답에 `java-w15-d4-repair-v2`를 부여했다. 이전 잘못된 ID는 현재 문항 카탈로그에서 찾을 수 없는지 확인했다.
- 버전 확인: Java SE 25 공식 [Path API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Path.html)는 `Path.of`가 Java 11부터임을, [Files API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Files.html)는 `readString`·`writeString`이 Java 11부터임을, [Record API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html)는 record가 Java 16부터임을 명시한다. 따라서 현재 로컬 JDK 8에서 해당 API 예제나 record를 컴파일했다고 표시하지 않는다.
- `node --test tests/java-curriculum-quality.test.js`: 11/11 통과. JDK 8에서 호환되는 날짜·시간 및 입력 경계 예제 9/9를 별도 컴파일·실행해 출력을 비교했다. Java 11 파일 API 예제 5개와 Java 16 record 예제 1개는 공식 버전 문서와 구조 회귀로 확인했으나 대상 JDK 실행은 남아 있다. 전체 `npm test` 184/184, `npm run check:release` 통과(93개 파일·최대 9.621 MiB), `git diff --check` 통과(기존 LF→CRLF 안내만).
- CQ-2 기본 언어 78주 중 24주를 검수했다. 가중 전체 진척은 `10% + 10% + 20% × 24/78 = 26.15%`이며 정수 표시는 26%다. 추가 비용·계정·서비스·공개 배포나 사용자 결정은 필요하지 않다.

### CQ-2 Java W16–W18 — 여섯 번째 배치 (완료; 전체 24%)

- HTTP 요청, 테스트 설계, 객체 책임·의존성·명시적 계약의 3주·15일·45문항을 목표·예제·정답·오답 피드백과 비교했다. 네트워크 예제는 URI/요청을 구성하거나 고정 응답을 다루며 실제 외부 요청을 보내지 않는다. 요청 제한 시간 문제는 `HttpClient.connectTimeout`이 아닌 `HttpRequest.Builder.timeout`을 써야 함을 고쳤고, 테스트 이름 수정 문제는 빈 목록의 실제 합을 assertion하는 테스트 메서드로 바꿨다.
- Java SE 25 공식 [HttpRequest](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpRequest.html), [HttpRequest.Builder](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/HttpRequest.Builder.html), [HttpConnectTimeoutException](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpConnectTimeoutException.html) 문서에서 HTTP API/요청별 timeout은 Java 11+이고 연결 수립 제한은 별도라는 점을 확인했다. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)에서 2xx는 성공 상태 코드 범주로 대조했다.
- JDK 8에서 호환되는 테스트·설계 예제 10/10은 다음 배치의 합동 컴파일·실행에서 결과까지 확인했다. JDK 11+ HTTP Client 예제 5개는 로컬 JDK 8에서 컴파일하지 않았고, 공식 API 기준과 회귀 검사로만 확인했다. Java 전용 품질 회귀는 해당 배치 직후 12/12 통과했다.

### CQ-2 Java W19–W21 — 일곱 번째 배치 (완료; 전체 25%)

- 동등성·해시 규약·불변 키, 관찰 가능성·비밀값 마스킹, 리팩터링·작은 Git 커밋의 3주·15일·45문항을 검수했다. 일일 예제 15개를 입력·처리·출력 또는 재현 가능한 Git 흐름이 있는 예제로 보완했고 주간 예제도 첫날의 완성 예제와 맞췄다. Git 명령을 Java로 표시하던 예제는 `Git` 코드 예제로 분리했다.
- W20 D4의 기존 수정 답 `label.replace("token", "***")`는 `abc123` 같은 실제 토큰 값을 가리지 못했다. 원문을 반환하지 않고 전체 값을 마스킹하며 null 입력은 별도로 표시하도록 고쳤고, 변경 답은 `java-w20-d4-repair-v2`로 구분했다. 회귀 검사는 기존 부분 치환 답을 거부하고 전체 마스킹과 null 사례를 확인한다.
- Java SE 25 공식 [Record](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html), [List](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html), [LogRecord](https://docs.oracle.com/en/java/javase/25/docs/api/java.logging/java/util/logging/LogRecord.html), [Logger](https://docs.oracle.com/en/java/javase/25/docs/api/java.logging/java/util/logging/Logger.html) 문서에서 record는 Java 16+, `List.copyOf`는 Java 10+, 로그 매개 변수와 throwable이 LogRecord에 연결됨을 확인했다. `LogRecord` 예제는 record를 구성해 보여 줄 뿐 실제 저장 Handler로 보내지 않는다고 표시한다.
- JDK 8에서 W17–W21의 호환 Java 예제 22/22를 컴파일·실행해 예상 출력 일부와 비교했다. Java 10+ `List.copyOf` 1개와 Java 16+ record 1개는 대상 JDK 실행을 하지 않았다. 이번 배치 이후 Java·콘텐츠 회귀 39/39가 통과했으며 전 Java 3지선다 문항의 정답 위치 분포는 80/79/79다. 새 적용형 문항 ID `-apply-v2` 94개가 만들어졌고 이전 `-apply` ID는 현재 lookup에 남지 않았음을 확인했다.
- 정답 위치를 주차 일부에서 따로 균등하게 만들라는 종전 검사는 전체 트랙에 적용되는 실제 균형 정책과 어긋나 제거했다. 회귀는 전체 Java 트랙의 선택지를 대상으로 위치 차이가 1 이내인지 확인한다. 로컬 기록의 과거 문항 ID는 삭제하지 않으며 새 문항 답에 재사용하지 않는다.
- CQ-2 기본 언어 78주 중 21주를 검수했다. 가중 전체 진척은 25.38%이며 정수 표시는 25%다. 다음 배치는 Java W22–W24다.

### CQ-2 Java W22–W24 — 여덟 번째 배치 (완료; 전체 26%)

- 자료구조·탐색·재귀 3주·15일·45문항을 검수했다. 배열과 크기 조절 목록, LIFO/FIFO 순서, 해시 기반 조회, 정렬 전제, 선형·이진 탐색 비교, 정렬 비교자, 중복 검색 계약, 반개방 구간, 재귀 기저·호출·스택 깊이, 분할 정복, 반복 변환을 입력과 출력이 드러나는 전체 Java 클래스 15개로 구성했다.
- 재귀 깊이에 임의의 `100_000` 안전 한계를 제시하던 예를 실제 깊이 5의 유한한 실행으로 바꿨다. 실행 환경마다 스택 한계가 다르다는 점을 설명하고, 재귀/반복 factorial은 음수 입력을 거부한다. `Collections.binarySearch`의 중복 값 예제는 처음/마지막 인덱스를 보장하지 않는다는 주의를 추가하고 결과는 단일 위치 대신 존재 여부만 확인한다.
- `node --test tests/java-curriculum-quality.test.js tests/content.test.js`: 41/41 통과. JDK 8에서 W17–W24의 Java 호환 예제 37/37을 컴파일하고 실행 결과 일부를 대조했다. W16 HTTP Client(11+), W19 `List.copyOf`(10+)·record(16+)는 로컬 JDK 8로 검증할 수 없어 공식 문서 확인으로 경계를 기록했다. W21 D5는 Git 예제다.
- CQ-2 기본 언어 78주 중 24주를 검수했다. 가중 전체 진척은 26.15%이며 정수 표시는 26%다. 다음은 Java W25–W26이다.

### CQ-2 Java W25–W26 — 아홉 번째 배치 (완료; 전체 27%)

- 작은 기능 설계와 종합 복습의 2주·10일·30문항을 목표·예제·정답·오답 설명과 대조했다. 10개의 짧은 코드 조각을 입력, 처리, 결과가 드러나는 Java 클래스로 보완했다. W26 D1은 Java 8에서도 읽을 수 있도록 `List.of`를 `Arrays.asList`로 바꿨다.
- 적용 문항 10개는 앞 문항의 개념 보기를 되풀이하던 생성형 문구 대신 새로운 입력·호출 상황을 주고, 기대 결과를 추적해 답하도록 바꿨다. 주관식 회상도 단어만 요구하는 일반 문구를 개념을 설명하도록 구체화했다. 기존 문제 ID와 학습 기록 연결은 유지했다.
- W25 D2의 `record`는 Java 16부터 지원되는 문법이며 값 운반용 모델이지 자동 검증기가 아니라는 점을 자료와 문제에 표시했다. W26 D4의 `System.nanoTime()`은 벽시계가 아니며 같은 JVM 안에서 두 호출의 차이로 경과 시간만 구한다. 한 번의 예제 측정으로 성능 개선을 주장할 수 없다고 설명했다. Oracle 공식 [Java 16 Record JLS](https://docs.oracle.com/en/java/javase/16/docs/specs/records-jls.html)와 [Java SE 25 System API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.html)를 대조했다.
- `node --test tests/java-curriculum-quality.test.js tests/content.test.js` 42/42, 전체 `npm test` 189/189 통과. 로컬 JDK 8에서 호환 예제 9/9를 컴파일·실행하고 고정 출력과 대조했다. record 예제 1개는 JDK 8에서 실행하지 않고 공식 Java 16/25 문서로 버전 경계를 확인했다. `npm run check:release`는 93개 파일·최대 9.621 MiB로 통과했고 `npm ls --depth=0` 및 `git diff --check`도 통과했다.
- CQ-2 기본 언어 78주 중 26주를 검수했다. 가중 전체 진척은 `10% + 10% + 20% × 26/78 = 26.67%`이며 정수 표시는 27%다. 다음 배치는 JavaScript W1–W3이다.

| 2026-10-15 | CQ-2 | Java W25–W26 30문항의 목표·예제·질문을 대조했다. 입력/출력 없는 10개 조각을 전체 클래스로 바꾸고, 적용 문제를 실제 새 상황을 추론하도록 수정했다. Java 16 record 및 `nanoTime` 의미를 Oracle 공식 문서로 확인했다. Java+콘텐츠 회귀 42/42, 전체 테스트 189/189, JDK 8 호환 예제 9/9, 릴리스 검사 통과. 다음은 JavaScript W1–W3다. | 26% → 27% (CQ-2 26/78주; 가중 26.67%) |

### CQ-2 JavaScript W1–W3 — 열 번째 배치 (완료; 전체 27%)

- 변수·상수, 조건·논리, 배열 순회·누적의 3주·15일·45문항에서 일일 목표와 예제, 객관식 정답·오답 설명, 주관식 출력, 오류 위치, 코드 수정 기준을 다시 대조했다. 날짜별 자동 생성 문구를 구체 목표와 입력 상황으로 교체했다.
- 기존 예제 15개가 짧은 조각이거나 결과 출력을 보여 주지 않는 경우를 보완해 모든 예제를 입력·처리·호출·출력이 연결된 JavaScript로 구성했다. 주간 요약 예제도 실행 결과가 보이도록 수정했다. 배열 범위, 공백 문자열, 논리 조건, 누적 초기화, 빈 배열의 `reduce`를 경계 입력으로 확인한다.
- 심각한 채점 결함을 발견했다. 콘솔에서 두 값을 출력하는 문제에 정답을 `true`와 `false`로 따로 등록해 둘 중 하나만 입력해도 통과할 수 있었다. 여러 출력을 한 번의 명확한 콘솔 출력(`true false`, `12 0`)으로 제시하고 완전한 출력만 정답 처리하는 회귀 검사를 추가했다. 의미를 구체화한 생성 질문에는 `-v2` ID를 부여했으며 기존 브라우저 진도 데이터는 삭제하지 않는다.
- 새 `tests/javascript-react-quality.test.js` 검사는 W1–W3의 주간·일일 예제 18개와 생성형 코드 추적 질문의 실제 출력을 Node에서 실행해 기대값과 대조한다. 객관식은 정답·각 오답 및 선택별 해설을 확인하고, 오류 찾기와 코드 수정은 정답 키·수정 함수·시작 코드 오답 처리를 검사한다. `node --test tests/javascript-react-quality.test.js tests/content.test.js` 38/38, 전체 `npm test` 190/190 통과. `npm run check:release` 93개 파일·최대 9.621 MiB 통과, `npm ls --depth=0` 및 `git diff --check` 통과(줄바꿈 변환 알림만).
- CQ-2 기본 언어 78주 중 29주를 검수했다. 정확한 가중값은 `10% + 10% + 20% × 29/78 = 27.44%`이며 정수 표시는 반올림해 27%다. 이전 표시와 숫자는 같지만 실제 진척은 26.67%에서 27.44%로 증가했다. 추가 비용·외부 서비스·DB·계정·결제는 도입하지 않았고 사용자 결정이 필요한 항목은 없다. 다음 배치는 JavaScript W4–W6이다.

| 2026-10-15 | CQ-2 | JavaScript W1–W3 45문항과 예제 15개를 처음부터 대조했다. 불완전한 입출력 예제·일반 문구·부분 출력만으로 정답 처리되던 채점 오류를 고치고 각 날짜의 목표·예제·선택지 피드백·수정 해설을 구체화했다. 예제 18개와 코드 추적 답을 실행 검증했고 대상 회귀 38/38, 전체 테스트 190/190, release audit 통과를 확인했다. 다음은 JavaScript W4–W6이다. | 27% 유지 (CQ-2 29/78주; 가중 27.44%) |

### CQ-2 JavaScript W4–W6 — 열한 번째 배치 (완료; 전체 28%)

- 함수 반환·기본 인자, 배열 인덱스·추가·필터링·복사, 객체 속성·선택적 체이닝·불변 갱신의 3주·15일·45문항을 일일 목표와 예제, 정답·오답 이유, 수정 기준까지 비교했다. 클릭 콜백처럼 선수 흐름에 없는 문제, 배열 필터링과 맞지 않는 정렬 문제, 호출·출력이 없어 이해하기 어려운 코드 조각을 발견했다.
- 의미에 맞는 15개 완결 예제를 새로 연결했다. 매개변수와 반환값, 생략·undefined·null 기본 인자 경계, `push`의 반환값과 원본 변경, `map`과 `filter`, `sort`의 원본 변경, 빈 배열의 마지막 원소 처리, 객체 복사 후 필드 갱신을 단계적으로 다룬다. 주간 요약 예제에도 실제 출력이 있도록 보완했다.
- 주제 자체를 바꾼 옛 문제 4개는 `js-functions-return-value`, `js-functions-default-argument`, `js-arrays-append-immutable`, `js-arrays-filter-map`으로 새 ID를 부여했다. 기존 브라우저 학습 기록은 그대로 보존되지만 새 문항 완료 표시는 과거 ID에서 자동 상속되지 않는다.
- 기술 기준도 확인했다. Ecma International은 2026년 6월 ECMA-262 제17판을 승인했고, 현재 공식 언어 명세는 [ECMAScript 2026](https://262.ecma-international.org/17.0/)이다. 과정 기준과 날짜를 2026-10-15로 갱신했다. 예제 15개와 주간 예제 3개, 생성된 코드 추적 문제는 로컬 Node 실행 출력과 채점 키가 일치함을 확인했다. 브라우저별 실행 호환성을 검사한 것으로 간주하지 않는다.
- `node --test tests/javascript-react-quality.test.js tests/content.test.js` 38/38 및 전체 `npm test` 190/190 통과. `npm run check:release` 93개 파일·최대 9.621 MiB 통과, `npm ls --depth=0` 및 `git diff --check` 통과(줄바꿈 변환 알림만). CQ-2 기본 언어 78주 중 32주를 검수했다. 정확한 가중값은 `10% + 10% + 20% × 32/78 = 28.21%`이며 정수 표시는 28%다. 추가 비용·외부 서비스·DB·계정·결제나 사용자 결정은 없다. 다음 배치는 JavaScript W7–W9이다.

| 2026-10-15 | CQ-2 | JavaScript W4–W6의 45문항과 18개 일일·주간 예제를 검수했다. 선수 단계를 벗어난 콜백 문제, 목표와 맞지 않는 배열 질문, 결과 없는 예제를 교체했다. 완전 출력 추적과 정답·오답·오류 위치·수정 코드를 실행/회귀 검증했다. ECMAScript 2026 제17판 공식 기준 및 검수 날짜도 갱신했다. 대상 38/38, 전체 190/190, 릴리스 검사 통과. | 27% → 28% (CQ-2 32/78주; 가중 28.21%, 이전 27.44%) |

### CQ-2 JavaScript W7–W9 — 열두 번째 배치 (완료; 전체 29%)

- 범위·클로저, 모듈·오류·테스트, DOM·폼 입력의 3주·15일·45문항을 날짜 목표와 예제, 정답, 오답 이유, 오류 줄, 수정 기준까지 다시 확인했다. 블록 범위 문제의 같은 예제 중복, day title과 맞지 않던 클로저·모듈·DOM 질문, 반복적인 생성 피드백, 출력 없는 요약 코드, W7 D5의 요구사항을 이미 만족한 수정 시작 코드를 고쳤다.
- 날짜별 목표에 맞춰 15개 실행 예제를 완성했다. W7은 이름 가리기부터 독립 클로저와 공유 상태로 진행한다. W8은 named export/import, 별칭, 명시적 오류, 공백 입력·정수 경계, 검증 사례로 이어진다. W9는 submit 기본 동작, 입력 정규화, 안전한 텍스트 표시, 빈 제목 처리, 검증 결과 메시지 순서로 구성했다. 주간 예제도 출력 결과를 갖도록 했다.
- 의미가 바뀐 기존 문항 5개는 `js-scope-tdz`, `js-scope-function-return`, `js-modules-namespace-import`, `js-dom-normalized-save`, `js-dom-safe-text`로 교체했다. 새 질문과 코드 수정 문제에는 `-v2` ID를 사용했다. 기존 브라우저 진도 데이터는 보존되며 바뀐 ID의 완료 표시는 예전 ID에서 이어지지 않는다.
- 6개 코드 수정 문제를 수정해 시작 코드가 정답을 만족하지 않게 하고 요구 코드 모양과 예시 입력을 맞췄다. Node에서 W7–W9의 일일 예제 15개, 주간 예제 3개, 코드 추적 답 및 수정 답안의 실제 입력·출력을 확인했다. W8 모듈은 data URL named export/import로 로컬 실행했다. W9 DOM·이벤트 예제는 작은 객체 모형으로 코드 흐름만 검사했으며 실제 브라우저의 HTML 파싱, 이벤트 취소, 접근성 동작을 실행한 것은 아니다. 다만 `textContent`, `preventDefault`, submit 동작은 [WHATWG DOM Standard](https://dom.spec.whatwg.org/)와 [HTML Standard의 폼 제출 절차](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)에서 대조했다.
- [JavaScript 클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)와 [모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [export/import 구문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), 브라우저 [이벤트 처리](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) 설명을 검토했다. ECMAScript 과정의 최신 안정 명세는 ECMA-262 제17판 [ECMAScript 2026](https://262.ecma-international.org/17.0/) 기준을 유지했다.
- `node --test tests/javascript-react-quality.test.js tests/content.test.js` 38/38, 전체 `npm test` 190/190 통과. `npm run check:release` 93개 파일·최대 9.621 MiB 통과, `npm ls --depth=0`, `git diff --check` 통과(기존 LF→CRLF 줄바꿈 알림만). CQ-2 기본 언어 78주 중 35주를 검수했다. 가중값은 `10% + 10% + 20% × 35/78 = 28.97%`이며 29%로 반올림한다. 추가 비용·서비스·DB·계정·결제와 사용자의 결정은 없고, 실제 브라우저 DOM 검증은 후속 검증 범위로 기록한다.

| 2026-10-15 | CQ-2 | JavaScript W7–W9 45문항과 일일·주간 예제 18개를 다시 연결했다. 주차와 날짜가 어긋난 문제, 중복된 범위 질문, 출력 없는 코드, 정답과 같은 수정 시작 코드를 고쳤다. 클로저·모듈은 Node에서 실행했고 DOM 모형 예제는 브라우저 동작 주장과 분리했다. 대상 회귀 38/38, 전체 190/190, 릴리스 검사 통과. | 28% → 29% (CQ-2 35/78주; 가중 28.97%, 이전 28.21%) |

### CQ-2 JavaScript W10–W12 — 열세 번째 배치 (완료; 전체 30%)

- Promise·Fetch, 이벤트 루프, 작은 통계·학습 기록 통합의 3주·15일·45문항을 목표·예제·정답·피드백·수정 기준으로 다시 대조했다. 날짜 목표와 무관한 기존 질문, 출력이나 입력 맥락이 빠진 예제, 실행 흐름을 오해하게 하는 설명을 고쳤다.
- Fetch 예제는 네트워크 호출을 흉내 내는 응답 모형으로 HTTP 오류와 네트워크 거절을 분리한다. W11은 동기·마이크로태스크·타이머 순서, 렌더 요청, 작업 나누기를 연결하고, W12는 유한 점수 검증·빈 평균·불변 완료 기록·한 번 순회·요약 결과를 다룬다. 모형 실행은 실제 인터넷·브라우저 렌더러 동작 검증으로 간주하지 않는다.
- 응답 본문 파싱과 AbortSignal 전달, 타이머와 requestAnimationFrame, 코드 수정 정답 및 경계 입력을 회귀로 확인했다. 의미가 바뀐 항목에는 `-v2` 문항 ID를 부여해 기존 브라우저 기록을 보존한다. [Fetch 처리](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [Response.json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json), [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), [마이크로태스크](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide), [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)의 동작을 공식 문서와 대조했다.
- 이번 연속 검증에서 `node --test tests/javascript-react-quality.test.js tests/content.test.js` 40/40, 전체 `npm test` 192/192, 릴리스 검사 93개 파일·최대 9.621 MiB, `npm ls --depth=0`, `git diff --check`를 확인했다. CQ-2는 38/78주이며 가중 전체값은 29.74%로 30%다. 외부 서비스·DB·계정·결제는 추가하지 않았다.

### CQ-2 JavaScript W13–W15 — 열네 번째 배치 (완료; 전체 31%)

- 문자열 정규화, Date 시간대·경과 시간, Map/Set의 3주·15일·45문항을 다시 편집했다. 기존 예제는 선언된 입력·처리·출력이 없는 한 줄 조각이었고, 일부 힌트와 정답 피드백은 여러 날짜에서 반복됐다. W15의 Map 삽입 순서 수업에는 Set 존재 확인 코드가 연결되는 문항 불일치도 확인했다.
- 각 주차에 실행 가능한 주간 예제와 날짜별 출력 예제 15개를 구성했다. W13은 검색용 문자열 정규화와 표시 문자열 보존, 빈 검색, NFC 비교를 다룬다. W14는 명시적 오프셋, 밀리초 타임스탬프, 고정 시간대 표시, 잘못된 Date, 서머타임과 실제 경과 시간을 연결한다. W15는 Set 고유성, Map 빈도 집계, 객체 키 참조 동일성, Map 삽입 순서, 값 0과 키 존재를 구분한다.
- 수정 문제 6개는 빈 검색 함수, 태그 정규화, Date 유효성, 시간 차, Map 순회, Set 중복 제거에 각각 대응하며 시작 코드가 정답을 만족하지 않도록 했다. 교체한 의미는 `-v2` ID로 기록해 종전 진도·백업은 삭제하지 않는다. 정적 패턴 채점은 실제 코드 실행으로 안내하지 않는다.
- 주간·일일 예제와 모든 코드 추적 출력을 Node에서 실행하고, 선택지별 정오답·오류 줄·수정 패턴·경계 입력을 회귀 검증했다. `String.normalize()`의 정준/호환 형태는 [MDN String.normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize), 날짜 문자열의 오프셋·현지 시간 해석은 [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), 키 동일성·삽입 순서는 [MDN Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 및 [MDN keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections), 고유성은 [MDN Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)과 대조했다.
- 대상 콘텐츠 회귀 40/40, 전체 `npm test` 192/192, `npm run check:release` 93개 파일·최대 9.621 MiB, `npm ls --depth=0`, `git diff --check`를 통과했다. Node 실행으로 브라우저별 Intl 렌더링이나 실제 사용자 화면을 확인한 것은 아니다. CQ-2는 41/78주이며 `10% + 10% + 20% × 41/78 = 30.51%`, 정수 표시는 31%다. 다음은 JavaScript W16–W18이고 사용자 결정은 필요하지 않다.

### CQ-2 JavaScript W16–W18 — 열다섯 번째 배치 (완료; 전체 31%)

- 제너레이터와 iterator 결과, 클래스 캡슐화·합성·상속 계약, prototype 속성과 입력 허용 목록의 3주·15일·45문항을 주차·일차 목표와 대조했다. W16 오류 찾기에서 세 번째 `next()`의 완료 상태를 물으면서 `value`를 출력하는 줄을 오류로 잘못 표시했고, W17 주간 예제의 동작 조합 조각은 선언되지 않은 `save`, `validate`를 사용해 단독 실행이 되지 않았다. W18 요약 예제도 `profile` 전제가 없었다.
- 15개 일일 예제와 주간 요약을 실행 가능한 입력·출력 중심으로 구성했다. W16은 `yield`/`return` 결과, `done`, 지연 순회, 조기 종료 시 `finally` 정리를 구분한다. W17은 private 필드, 분리된 메서드의 `this`, 교체 가능한 합성, `super` 호출, 하위 타입 반환 계약을 연결한다. W18은 own/inherited 속성, shadowing, `Object.hasOwn`, 허용 목록으로 객체 키를 제한하는 방법을 다룬다.
- 의미가 달라진 문제에는 `-v2` ID를 사용해 기존 학습 기록을 삭제하지 않았다. 전체 함수 형태를 검사하는 코드 수정 문제는 정적 패턴 채점이며 실행 채점이 아님을 문항에 표시했다. 정답 구현은 회귀 검사에서 실제 대표 입력을 실행해 동작을 확인했다.
- 제너레이터의 순회와 완료 결과는 MDN [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators), [Generator.prototype.return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return), [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), 클래스와 `super`는 [Using classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes), [`super`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super), [Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements), 객체 속성은 [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)과 대조했다.
- 주간·일일 코드 추적 출력, 모든 선택지 피드백, 실제 오류 줄, 수정 패턴과 대표 경계 입력을 회귀에 추가했다. 대상 `node --test tests/javascript-react-quality.test.js tests/content.test.js` 41/41, 전체 `npm test` 193/193 통과. `npm run check:release`는 93개 파일·최대 9.621 MiB로 통과했고, `npm ls --depth=0`에서 기존 개발 의존성만 확인했다. `git diff --check`는 내용 오류 없이 기존 LF→CRLF 경고만 표시했다. 이번 콘텐츠 보완에 의존성·서비스·DB·사용자 결정은 추가하지 않았다. Node 검사만으로 실제 브라우저 DOM·키보드 흐름을 검증했다고 주장하지 않는다.
- CQ-2는 44/78주이며 `10% + 10% + 20% × 44/78 = 31.28%`, 정수 표시는 31%다. 다음은 JavaScript W19–W21이다.

### CQ-2 JavaScript W19–W21 — 열여섯 번째 배치 (완료; 전체 32%)

- 테스트 설계·디버깅·성능 측정의 3주·15일·45문항에서 주차 목표, 날짜별 초점, 예제 출력, 문제 정답·오류 줄·수정 기준을 대조했다. 기존 생성 세션은 W19 테스트 주차에 실행 오류 보존·성능 캐시 문항을 섞고, W20 디버깅 문항에 테스트/성능 문맥을 섞었으며, W21 마지막 측정 세션에 elapsed time보다 화면 목록 예제를 연결했다. 다수 문항의 상황·힌트·피드백이 “새 개념을 적용” 같은 템플릿 문장으로 반복됐다.
- 다섯 날의 구성을 다시 설계했다. W19는 Arrange/Act/Assert, 빈 입력 계약, 상태 격리, 비동기 완료 대기, 회귀 입력을 다룬다. W20은 최소 재현, 안전한 관찰 로그, 한 가설씩 검증, 오류 경계, 수정 후 재검증 순으로 구성했다. 민감한 원문을 로그에 복사하지 않도록 오류 맥락 예제도 제한했다. W21은 같은 고해상도 시계로 측정, 명세가 보장하는 Set 조회 비용 표현, 중복 계산 재사용, 비교 가능한 반복 측정, 목록 표시 범위를 연결한다.
- 각 주차의 15개 일일 예제는 결정적 출력을 갖도록 보완했다. 성능 시간 출력 테스트는 주입 시계로 고정해 실제 기기 벤치마크 결과처럼 가장하지 않는다. `slice` 예제는 표시 데이터 범위를 반환하며 실제 DOM 가상화 구현과 구분했다. 코드 수정 문제는 전체 함수 패턴 채점임을 알리고 `-v2` ID로 교체해 기존 브라우저 진도는 삭제하지 않았다.
- Node 내장 test runner에서 async test가 Promise를 반환하거나 기다려야 하는 점은 현재 [Node.js test runner 공식 문서](https://nodejs.org/download/release/v26.7.0/docs/api/test.html)와 대조했다. `performance.now()`의 고해상도 단조 시계·`Date.now()`와 다른 원점은 [MDN Performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)에서, Map/Set 평균 접근 시간의 sublinear 명세는 [ECMAScript 2026 §24.1–24.2](https://tc39.es/ecma262/2026/multipage/keyed-collections.html)에서 확인했다.
- 주간·일일 예제 출력, 15일의 코드 추적 정답, 객관식 정오답 피드백, 오류 위치와 새 코드 수정 답안을 회귀 테스트에 추가했다. 수정 함수는 대표 정상·경계 입력으로 실행 검증했다. 대상 `node --test tests/javascript-react-quality.test.js` 16/16, 전체 `npm test` 194/194 통과. `npm run check:release`는 93개 파일·최대 9.621 MiB로 통과했고, 의존성은 추가하지 않았다. `git diff --check`는 내용 오류 없이 기존 LF→CRLF 경고만 표시했다. 실제 브라우저 성능 비교·DOM 가상화 실행 검증은 하지 않았다.
- CQ-2는 52/78주이며 10% + 10% + 20% × 52/78 = 33.33%, 정수 표시는 33%다. 다음은 Python W1–W3이며 사용자 결정은 필요하지 않다.

### CQ-2 JavaScript W22–W24 — 열일곱 번째 배치 (완료; 전체 33%)

- 브라우저 저장소·네트워크 상태·동시 요청 제어의 3주·15일·45문항을 주차 목표, 일일 설명·예제, 질문·정답·오류 위치·수정 기준으로 대조했다. 자동 생성 내용에는 잘못 이스케이프된 JSON 문자열로 문법 오류가 나는 W22 예제, 문자열/기록 마이그레이션과 관계없는 일일 문제, 모듈/비동기 맥락 없이 await하는 W23 코드 조각, W24에서 AbortController를 signal 대신 요청 옵션에 전달하는 코드, Effect cleanup 누락, 디바운스와 연결되지 않은 수정 답이 있었다.
- 저장소 주차는 직렬화, 없는 키와 손상 JSON, 명시적 스키마 버전 변환, 저장 예외, 다른 탭의 storage 이벤트와 실제 null 삭제 값을 연결했다. 네트워크 주차는 HTTP 상태 확인, 성공한 빈 목록, fetch rejection, 비동기 JSON 본문·문법 오류, finally 로딩 정리를 분리했다. 요청 주차는 최신 요청 ID, AbortController.signal, React Effect 정리, 디바운스 예약, 취소와 최신 응답 검사의 역할을 단계별로 구성했다. 실행 가능한 사례는 메모리 storage·가짜 응답·가짜 timer를 주입하며 React 예제만 실행되지 않는 개념 스니펫이라고 표시했다.
- 저장소 객체의 문자열화와 할당량 오류는 MDN [Web Storage API 사용법](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API), 이벤트가 쓴 창에는 발생하지 않는 규칙은 MDN [Window: storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)와 대조했다. Fetch의 HTTP 오류 상태 처리, response JSON의 비동기·파싱 실패, AbortSignal 요청 연결·취소는 MDN [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)에서 확인했다. Effect cleanup 시점과 수동 Effect fetch의 한계는 최신 [React useEffect 공식 문서](https://react.dev/reference/react/useEffect)와 대조했다.
- 15개 일일 예제와 주간 요약의 문법·출력을 확인하고 React 개념 스니펫은 파싱만 확인해 브라우저/React 실행을 주장하지 않았다. 45문항 정답·피드백·오류 줄을 회귀 검사하고 여섯 수정 답은 저장 성공/예외, 삭제 이벤트/JSON, 빈 HTTP 목록/HTTP 실패, 성공·오류 시 로딩 해제, 가짜 timer 교체, 최신/이전 ID 입력에서 실제 실행 확인했다. 수정 문제 UI의 채점은 정적 패턴으로 동작하므로 이를 실행 채점이라고 안내하지 않았다.
- 대상 node --test tests/javascript-react-quality.test.js 17/17, 전체 npm test 195/195, npm run check:release 94개 파일·최대 9.621 MiB 통과. npm ls --depth=0에서 추가 의존성은 확인되지 않았고 git diff --check 내용 오류 없이 통과했다. 실제 다중 탭 브라우저 이벤트, 사용자 브라우저 저장 한도, live HTTP 서버, React 렌더·Effect 수명은 이 배치에서 실행하지 않았다. 외부 서비스·DB·비용·사용자 결정은 추가되지 않았다.
- CQ-2는 50/78주이며 10% + 10% + 20% × 50/78 = 32.82%, 정수 표시는 33%다. 다음은 JavaScript W25–W26이다.

### CQ-2 JavaScript W25–W26 — 열여덟 번째 배치 (완료; 전체 33%)

- 보안 경계와 캡스톤 2주·10일·30문항을 주간/일일 목표, 예제 출력, 정답, 오답 피드백, 오류 줄, 수정 기준까지 대조했다. W25는 textContent, URL 쿼리 값 인코딩, 내부 이동 허용 목록, 비밀 아닌 테마 설정, DOM 노드 모형 순으로 이어지고, W26은 빈 목록 계약, 오류와 빈 성공의 분리, 의미 있는 이동 링크, 상태 표, 통합 회귀로 구성했다.
- 기존 W25는 URL 인코딩 날에도 textContent 예제가 나오고, 여러 코드 조각에서 선언되지 않은 이름을 사용했다. 마지막 DOM 추적은 브라우저 전용 `document`를 Node에서 참조해 실행할 수 없었다. W26의 접근성 예제는 실제 DOM·키보드 테스트가 아니라 plain object를 `a`라고 이름 붙인 모형이었고, 일부 종합 문제는 당일 목표와 연결되지 않았다. 각 목표별 실행 사례와 독립 문항으로 고쳤다.
- MDN [Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) 및 [Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)에서 일반 텍스트 삽입과 HTML 파싱/XSS 경계를 확인했다. [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)의 URI 구성 요소 범위, [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), 탐색용 [a 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)와 동작용 [button 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)도 공식 설명과 대조했다.
- 10개 일일 예제와 두 주간 요약의 문법·출력, 짧은 답과 예제 코드 일치, 30문항의 정답·오답 피드백·오류 줄·수정 기준을 회귀 검사에 고정했다. 테마 저장 함수의 허용/거부/저장 예외, 주입한 DOM 자료 흐름, 오류/빈/정상 상태, 완료 플래그를 엄격히 세는 통합 결과를 대표 입력으로 직접 실행했다. DOM factory는 Node용 모형이며 실제 브라우저 XSS·키보드 시험이 아님을 소개문에 표시했다.
- 대상 콘텐츠 회귀 18/18, 전체 `npm test` 196/196, `npm run check:release` 94개 파일·최대 9.621 MiB 통과. 의존성·외부 서비스·DB·계정·비용 변경 없음. 실제 브라우저 XSS 실행과 키보드 이동은 이번 배치에서 검증하지 않았다.
- CQ-2는 52/78주이며 10% + 10% + 20% × 52/78 = 33.33%, 정수 표시는 33%다. 다음은 Python W1–W3이다.

### CQ-2 Python W1–W3 — 열아홉 번째 배치 (완료; 전체 34%)

- 입문 3주·15일·45문항의 주간/일일 목표, 예제, 정답·오답 설명, 주관식 출력, 오류 줄, 수리 조건을 대조했다. 기존 9개 초기 문항의 의미와 ID를 유지하면서 변수·자료형·나눗셈, 조건 범위·들여쓰기·분기, 리스트 전체 순회·`range`·누적 순서로 날짜 목표를 다시 배치했다.
- 자동 생성 도입문에서 `type은(는)` 같은 조사 오류와 모든 주제를 “한 가지 결정을 분명하게”라고 설명하던 문구를 발견했다. 첫 세 주는 별도 검수 데이터로 분리해 하루의 소개·예제·선택지 피드백·추적 답을 실제 당일 규칙에 맞췄다. 저장 의미가 바뀐 36개 보강 문항은 `-v2` ID로 발행해 이전 답을 새 문제 정답으로 자동 이어받지 않으며, 기존 로컬 데이터는 삭제하지 않는다.
- Python 주관식은 출력 일부만 적어도 통과하지 않게 했다. 특히 `print("left:", count)` 문제는 숫자 `0` 일부만 답으로 허용하던 기존 기준을 전체 출력 `left: 0`과 일치시켰다. 세 코드 수정 문제는 `parse_age`, `has_title`, `even_values`의 전체 함수 형태 패턴으로 판정하고, 정상·빈 값·경계·오류 입력 기준을 문제에 적었다. 이 수정 문제는 실제 실행 채점이 아니라고 화면에서 구분한다.
- Python 3.15.0 공식 [입문 자습서](https://docs.python.org/3.15/tutorial/introduction.html), [제어 흐름 자습서](https://docs.python.org/3.15/tutorial/controlflow.html), [자료 구조 자습서](https://docs.python.org/3.15/tutorial/datastructures.html)에서 대입, `/`·`//`·`%`, 문자열, 조건, `range` 끝 제외, 반복 동작을 대조했다. 전체 트랙 메타데이터는 아직 3.14.8 검수 기준을 표시하므로 Python W4–W26의 3.15 호환성은 각 다음 배치에서 이어 확인한다.
- 로컬 Python 3.12.10으로 15개 날짜 예제의 전체 출력을 주관식 정답과 대조하고 세 수리 답을 실제 실행해 정상·경계·오류 사례를 확인했다. 이것은 Python 3.15 런타임에서 실행한 검증을 뜻하지 않는다. `node --test tests/content.test.js tests/python-spring-quality.test.js` 31/31, 전체 `npm test` 197/197, `npm run check:release` 95개 정적 파일·최대 9.621 MiB 통과를 확인했다. `npm ls --depth=0`에서 기존 개발 도구만 확인했으며 패키지 의존성은 변경하지 않았다. `git diff --check`는 내용 오류 없이 통과했고 기존 CRLF 변환 안내만 출력했다.
- CQ-2는 55/78주이며 `10% + 10% + 20% × 55/78 = 34.10%`, 정수 표시는 34%다. 다음 배치는 Python W4–W6이다. 비용 서비스·DB·계정·결제·사용자 결정·공개 배포는 추가하지 않았다.

### CQ-2 Python W4–W6 — 스무 번째 배치 (완료; 전체 35%)

- W4–W6의 함수·리스트·딕셔너리 3주·15일·45문항에서 생성된 조사 오류, 질문의 날짜 주제 불일치, 예제와 주관식 답 분리, 설명이 개념을 실제로 가르치지 못하는 문제를 확인해 검수 데이터로 교체했다. 주별 목표와 다섯 일의 이름·소개·예제를 맞추고, 선택지별 피드백에 실제 오해 이유를 적었다.
- 기존 G10 문항 9개의 ID와 의미는 유지하면서 W4는 매개변수/반환값·기본/키워드 인자·None, W5는 평균과 빈 목록·인덱스/슬라이스·제자리 변경/새 목록, W6는 직접 조회·get·키 존재·items·중첩 필드에 각각 연결했다. 새 추적·개념 문항 36개는 `-v2` ID로 발행했다.
- 코드 수정은 반환값, 원본 보존, 누락 키 계약, 빈·경계 입력을 기준으로 명시했으며 실행형 채점으로 소개하지 않는다. W5는 `append`/`extend`/`+`, `sorted`/`sort`, 얕은 복사와 중첩 객체 공유를 구분한다. W6는 저장된 0과 키 부재, `required <= provided` 비교 방향을 다룬다.
- Python 3.15.0 공식 [함수·인자 문서](https://docs.python.org/3.15/tutorial/controlflow.html#defining-functions), [자료 구조 문서](https://docs.python.org/3.15/tutorial/datastructures.html), [복사 모듈 문서](https://docs.python.org/3.15/library/copy.html), [내장 자료형 문서](https://docs.python.org/3.15/library/stdtypes.html)와 대조했다. Python 3.12.10에서 15개 일일 예제의 전체 출력과 15개 함수 사례(정상·빈·경계·누락 키)를 실행했다. 이는 Python 3.15 런타임 실행을 뜻하지 않는다.
- W4–W6 전용 콘텐츠 회귀 `node --test --test-name-pattern "Python weeks four through six" tests/content.test.js` 1/1 통과. 전체 `npm test`는 198개 중 196개 통과했으며 다음 배치에서 고칠 W8의 반복 예제(E-115), W11의 예제/수정 과제 불일치(E-116) 두 건에서 실패했다. 릴리스 검사 95개 정적 파일·최대 9.621 MiB 통과, 의존성 추가 없음, `git diff --check` 통과(기존 줄바꿈 안내만).
- CQ-2는 58/78주이며 `10% + 10% + 20% × 58/78 = 34.87%`, 정수 표시는 35%다. 다음은 Python W7–W9다. 외부 서비스·DB·비용·계정·공개 배포 변경은 없다.

### CQ-2 Python W7–W9 — 스물한 번째 배치 (완료; 전체 36%)

- W7–W9의 모듈·예외 경계, 파일·경로·인코딩, 이터레이터·제너레이터를 각각 하루 목표 5개로 나누고 45문항을 구성했다. 기존 9문항 ID와 의미를 보존해 해당 일차에 연결했으며 새 문항 ID에는 `-v2`를 사용했다.
- W7은 모듈 별칭과 이름 공간, `ValueError`만 처리하기, 호출자까지의 예외 전파, `finally` 순서와 반환 덮어쓰기를 다룬다. W8은 `with` 정리, `Path`와 UTF-8, 바이트 디코딩, 한 줄씩 집계, 같은 디렉터리의 임시 파일 교체를 구분한다. 교체 사례는 POSIX의 성공한 이름 변경 원자성과 다른 파일시스템 간 실패, 내구성 미보장을 따로 명시하고 Python 3.8 이상 API 사용을 표시했다. W9는 `iter`/`next`, 한 번 소진되는 객체, `yield` 재개, 무한 입력의 `islice` 제한, 지연 생성을 단계적으로 연습한다.
- Python 3.15.0 공식 [모듈 자습서](https://docs.python.org/3.15/tutorial/modules.html), [예외·정리 자습서](https://docs.python.org/3.15/tutorial/errors.html), [입출력 자습서](https://docs.python.org/3.15/tutorial/inputoutput.html), [pathlib](https://docs.python.org/3.15/library/pathlib.html), [`os.replace`](https://docs.python.org/3.15/library/os.html#os.replace), [이터레이터 자습서](https://docs.python.org/3.15/tutorial/classes.html#iterators), [itertools](https://docs.python.org/3.15/library/itertools.html)를 대조했다. Python 3.12.10에서 일일 예제 15개의 출력과 수리 함수 3개의 정상·오류·파일 교체 실패·소진 경계를 직접 실행했다. 이는 3.15 런타임 실행 검증을 뜻하지 않는다.
- 전용 콘텐츠 회귀 `node --test --test-name-pattern "Python weeks seven through nine" tests/content.test.js` 1/1 통과. 현재 전체 콘텐츠 회귀에서 199개 중 197개가 통과하며 남은 두 실패는 다음 배치 W10의 반복 예제(E-117)와 W11 금요일의 `async` 예제/CPU 수정 문제 불일치(E-116)다. W8 반복 예제 오류(E-115)는 수정됐다. `npm run check:release`는 96개 정적 파일·최대 9.621 MiB로 통과, `npm ls --depth=0` 변경 없음, `git diff --check` 통과(기존 줄바꿈 안내만).
- CQ-2는 61/78주이며 `10% + 10% + 20% × 61/78 = 35.64%`, 정수 표시는 36%다. 다음은 Python W10–W12다. 외부 서비스·DB·비용·계정·공개 배포 변경은 없다.

### CQ-2 Python W10–W12 — 스물두 번째 배치 (완료; 전체 36%)

- W10–W12의 클래스·타입 힌트·비동기 처리·데이터 요약 45문항을 다섯 일별 목표에 맞춰 다시 구성했다. 기존 `__init__`, `self`, 반환 힌트, `await`, `async def`, 완료 집계·비율 문항은 ID와 의미를 유지했다. 각 문제를 그 날짜 목표에 놓기 위해 기존 문항의 일자 연결을 개별 지정하는 제한된 경로를 추가했다. 새 문제 ID는 `-v2`로 추가해 기존 기록 키를 보존했다.
- W10은 생성자, 클래스/인스턴스 상태, 메서드와 반환 힌트, 문자열 repr, 시계 조합 순서로 구성했다. W11은 타입 힌트가 런타임에 자동 강제되지 않는다는 점, None과 빈 문자열, 코루틴 생성, `gather` 결과 순서, CPU 프로세스 제출/Future/main guard를 구분한다. W12는 외부 입력 형태 확인, 실제 Boolean True 집계, 안정 정렬, 빈 평균 입력, 0 전체 수를 처리하는 완료율로 연결했다.
- Python 3.15 공식 [클래스 자습서](https://docs.python.org/3.15/tutorial/classes.html), [내장 함수의 repr/sorted 계약](https://docs.python.org/3.15/library/functions.html), [typing.Optional](https://docs.python.org/3.15/library/typing.html#typing.Optional), [코루틴·gather](https://docs.python.org/3.15/library/asyncio-task.html), [ProcessPoolExecutor 및 `__main__` 제약](https://docs.python.org/3.15/library/concurrent.futures.html)를 대조했다. Python 3.12.10에서 예제 13/15개 출력과 수정 함수 3개의 대표·경계 결과를 실행했고, W11 D4 비동기·D5 프로세스 예제는 구문 및 구조만 검사했다. 이 Windows 검증 환경에서 단순 `asyncio.run(...)` 확인이 10초 넘게 반환되지 않아 비동기 이벤트 루프나 프로세스 풀 결과를 실행 성공으로 주장하지 않는다.
- `node --test --test-name-pattern "Python weeks ten through twelve" tests/content.test.js` 1/1, 같은 파일의 승인 주차·금요일 수정 문제 정합성 검사 3/3, 전체 `npm test` 200/200 통과. `npm run check:release` 97개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`(기존 의존성만), `git diff --check` 통과(기존 줄바꿈 안내만).
- CQ-2는 64/78주이며 `10% + 10% + 20% × 64/78 = 36.41%`, 정수 표시는 36%다. 다음은 Python W13–W15다. 외부 서비스·DB·비용·계정·공개 배포 변경은 없다.

### CQ-2 Python W13–W15 — 스물세 번째 배치 (완료; 전체 37%)

- 문자열·정규식, 날짜·시간과 JSON, 경로·환경 설정의 3주·15일·45문항을 날짜별 목표와 대조했다. W13 D3 오류 찾기는 "v2"에서 숫자 정규식이 일치하는데도 오류 줄로 표시되어 있었고, W13 D5 예제는 문자열 동등 비교로 패턴 과용을 설명하지 못했다. 세 금요일 코드 수정 문제는 각각 시간대 변환, 파일 경로, 가변 데이터클래스 기본값으로 연결되어 당일 문자열·JSON·설정 목표와 달랐다. W14 D5 예제도 datetime 직렬화 오류를 보여주지 않았고, W15 경로 출력은 Windows에서 답안과 달랐으며 상대 경로 파일 상태에 의존하거나 실제 작업 폴더에 logs를 만드는 예제가 있었다.
- W13 D3 입력에 숫자가 없게 바꾸어 re.search 결과가 None인 실제 결함과 group() 호출 실패를 맞췄다. D5는 하이픈으로 나뉜 문자열에서 split()을 사용해 불필요한 정규식을 피하는 예제로 교체했다. W14 D5는 aware datetime을 isoformat() 문자열로 바꾼 뒤 JSON으로 직렬화하는 완결 예제로 만들었다. W15 경로 출력은 as_posix()로 구분자를 고정하고, 존재 여부·반복 디렉터리 만들기 예제와 오류 찾기는 임시 디렉터리 안에서만 실행되게 했다. 금요일 설정 함수는 값이 없을 때 10을 돌려주고 설정값 0도 보존하도록 바꿨다.
- 의미가 달라진 W13 D5·W14 D5 추적 문항과 W13–W15 금요일 수정 문항에는 -v2 ID를 부여했다. 다른 기존 문항 ID는 유지했다. Python 3.15 공식 [문자열 내장 타입](https://docs.python.org/3.15/builtins/stdtypes.html), [정규식](https://docs.python.org/3.15/library/re.html), [날짜·시간](https://docs.python.org/3.15/library/datetime.html), [JSON](https://docs.python.org/3.15/library/json.html), [pathlib](https://docs.python.org/3.15/library/pathlib.html), [환경 변수](https://docs.python.org/3.15/library/os.html#os.getenv), [임시 디렉터리](https://docs.python.org/3.15/library/tempfile.html) 문서와 대조했다.
- 각 일차의 정오답 피드백·출력 추적·실제 오류 줄, 금요일 수리 답안의 정적 구조 조건을 회귀 검사로 확인했다. Python 3.12.10에서 예제 출력 15/15, 세 수리 함수의 정상·경계 사례 7/7이 기준과 일치했다. 대상 콘텐츠 회귀 35/35, 전체 npm test 201/201, npm run check:release 97개 파일·최대 9.621 MiB 통과. npm ls --depth=0에 새 의존성이 없고 git diff --check 내용 오류는 없다(기존 LF→CRLF 안내만). Python 3.15 런타임 및 브라우저 화면 검증은 수행하지 않았다.
- CQ-2는 67/78주이며 10% + 10% + 20% × 67/78 = 37.18%, 정수 표시는 37%다. 다음은 Python W16–W18이다. 비용·외부 서비스·DB·계정·결제·공개 배포 변경은 없고 사용자 결정도 필요하지 않다.

### CQ-2 Python W16–W18 — 스물네 번째 배치 (완료; 전체 38%)

- 데이터클래스·불변성, 테스트와 경계값, 디버깅·로깅의 45문항에서 주제와 예제의 연결, 출력 답, 실제 수정 대상을 검토했다. W16 값 객체 수정 과제가 엉뚱한 함수 문제였고, W17 테스트·fixture 예제는 의도한 검증 동작을 분명히 보여 주지 못했으며, W18 재현·스택 추적·예외 연결·최소 수정 예제가 기록한 기대와 약하게 연결돼 있었다. W16–W18 금요일 과제를 당일 목표에 맞춰 다시 쓰고 의미 변경 문항은 `-v2` ID로 발행했다.
- Python 3.12.10에서 W16–W18 일일 예제 15/15, CourseId 필드 동결·빈 목록 회귀 assertion·문자열 정규화의 경계 조건 7/7을 확인했다. Python 3.15 공식 [데이터클래스](https://docs.python.org/3.15/library/dataclasses.html), [unittest](https://docs.python.org/3.15/library/unittest.html), [로깅](https://docs.python.org/3.15/library/logging.html), [traceback](https://docs.python.org/3.15/library/traceback.html), [예외 자습서](https://docs.python.org/3.15/tutorial/errors.html)를 대조했다. 이는 Python 3.15 런타임 실행 검증이나 전체 트랙 인증을 뜻하지 않는다.
- 대상 회귀 36/36, 전체 `npm test` 202/202, `npm run check:release` 정적 파일 97개·최대 9.621 MiB 통과, `npm ls --depth=0` 의존성 변경 없음, `git diff --check` 내용 오류 없음(줄바꿈 안내만). 전체 가중 진척은 `10% + 10% + 20% × 70/78 = 37.95%`, 표시 **38%**다. 다음 Python W19–W21이다. 외부 서비스·비용·계정·DB·결제·공개 배포 변경은 없고 사용자 결정도 필요하지 않다.

### CQ-2 Python W19–W21 — 스물다섯 번째 배치 (완료; 전체 39%)

- 자료구조 비용·HTTP 응답 경계·비동기 취소와 스레드/프로세스 동시성 45문항을 예제, 목표, 정답, 오답 설명, 오류 줄, 금요일 수리 과제까지 대조했다. 단일 반복을 이중 반복이라 부르던 예제를 실제 중첩 반복으로 바꾸고, 문장만 출력하던 측정 예제를 `timeit.timeit` 실행으로 교체했다. timeout 문제에는 값을 받는 로컬 모형 클라이언트를 연결하고 외부 네트워크 호출이 아님을 문제와 설명에 표시했다. 취소·gather·스레드 풀·프로세스 풀·잠금은 실제 표준 라이브러리 호출과 주제에 맞는 수정 문제로 다시 연결했다. 반복되던 코드 추적 답변과 객관식 피드백도 각 날짜의 값·제어 흐름에 맞췄다.
- Python 3.12.10에서 일일 예제 15/15를 출력까지 대조했다. asyncio 취소·gather와 ProcessPoolExecutor도 이 배치에서 제한 시간 안에 실행해 예상 결과를 확인했다. 금요일 수정 답은 timeit의 빈/비어 있지 않은 목록, 400·500·404 상태의 비밀 상세 미노출, 4개 스레드의 잠금 합계 400을 직접 실행했다. Python 3.15 공식 [timeit](https://docs.python.org/3.15/library/timeit.html), [asyncio 작업](https://docs.python.org/3.15/library/asyncio-task.html), [동시 실행](https://docs.python.org/3.15/library/concurrent.futures.html), [스레딩](https://docs.python.org/3.15/library/threading.html), [urllib timeout](https://docs.python.org/3.15/library/urllib.request.html), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)과 대조했다. timeout 부분은 표준 라이브러리 문서가 전송 단계 제한을 설명하는 참고이며, 수업 예제는 네트워크를 실제 호출하지 않는 모형이다.
- 대상 회귀 `tests/python-spring-quality.test.js`·`tests/content.test.js` 37/37, 전체 `npm test` 203/203, `npm run check:release` 97개 파일·최대 9.621 MiB 통과, `npm ls --depth=0` 의존성 목록 변화 없음. `git diff --check`는 내용 오류 없이 통과했고 기존 LF→CRLF 안내만 출력했다. Python 3.15 런타임은 이 환경에 없어 실행 호환성 인증은 하지 않았다. 기존 E-118은 별도 W11 사례의 실행 제한이며 이 배치의 성공으로 해결 처리하지 않는다. 외부 서비스·비용·계정·DB·결제·공개 배포 변경은 없다.
- CQ-2는 73/78주·1,095/1,170문항이다. 가중 계산 `10% + 10% + 20% × 73/78 = 38.72%`이며 정수 표시는 **39%**다. 다음 배치는 Python W22–W24다.

### CQ-2 Python W22–W24 — 스물여섯 번째 배치 (완료; 전체 39%)

- 명령행 도구·저장 데이터 검증과 복구·리팩터링 리뷰 45문항에서 예제·문제 목표·답·설명을 날짜별로 다시 맞췄다. W22 예제는 고정된 argparse 문자열이나 출력만 하던 코드에서 실제 argv 파싱, 표준 스트림 구분, 프로세스 종료 코드, 파서 사용 오류로 바꿨다. W23은 JSON 필드 자료형 검증, 격리 임시 디렉터리에서의 같은 폴더 파일 교체, 버전이 있는 백업 스키마, 오류와 성공 복구 건수의 구분으로 보완했다. W24의 작은 리뷰 예제를 실제 중복 분기 덮어쓰기 문제로 바꾸고, 금요일 수정 문제는 빈 제목을 검사한 다음에만 저장기를 호출하도록 일치시켰다. 주간·일별 자동 템플릿 문장 대신 각 예제 입력과 출력에 맞는 객관식 오답 이유와 추적 해설을 작성했다.
- Python 3.12.10에서 W22–W24 예제 15/15를 출력 및 종료 코드까지 확인했다. 금요일 수리 세 가지는 argparse의 필수 옵션/누락 인자, OSError 뒤 성공 보고 금지, None·공백·비문자열 제목에서 writer 미호출을 실행 확인했다. Python 3.15 공식 [argparse](https://docs.python.org/3.15/library/argparse.html), [sys와 표준 스트림·종료 상태](https://docs.python.org/3.15/library/sys.html), [출력 포착](https://docs.python.org/3.15/library/contextlib.html), [파일 교체](https://docs.python.org/3.15/library/os.html#os.replace), [dict 삽입 순서](https://docs.python.org/3.15/library/stdtypes.html#dict), [pathlib](https://docs.python.org/3.15/library/pathlib.html), [JSON](https://docs.python.org/3.15/library/json.html)를 대조했다. `os.replace` 예제는 임시 파일과 대상 파일을 같은 폴더에 두며, 원자 교체가 전원 손실 후 디스크 내구성까지 뜻한다고 안내하지 않는다.
- 대상 회귀 `tests/python-spring-quality.test.js`·`tests/content.test.js` 38/38, 전체 `npm test` 204/204, `npm run check:release` 97개 파일·최대 9.621 MiB 통과, `npm ls --depth=0`에 배치 신규 의존성 없음. `git diff --check`는 내용 오류 없이 통과하고 기존 LF→CRLF 안내만 출력했다. Python 3.15 런타임과 브라우저 화면은 검증하지 않았다. 사용자 결정이나 도움은 필요하지 않으며 외부 서비스·비용·계정·DB·결제·공개 배포 변경은 없다.
- CQ-2는 76/78주·1,140/1,170문항이다. 가중 계산 `10% + 10% + 20% × 76/78 = 39.49%`이며 정수 표시는 **39%**다. 다음은 기본 언어 마지막 묶음 Python W25–W26이다.

### CQ-2 Python W25–W26 — 스물일곱 번째 배치 (완료; 전체 40%)

- 기본 언어 과정의 마지막 30문항을 검수했다. W25 요구사항 분해·자료 모델·실패 조건·백업 시나리오·출시 준비 예제와 W26 완료 기준·회귀 점검·성능 측정·CLI 문서·다음 학습 계획을 서로 맞췄다. 이 과정에서 W25 D1 오류 찾기의 오래된 입력 검증 코드, W25 D5의 디버그 설정과 선택지 불일치, W26 D1의 실제 실패 검사 설명 오류, W26 D5의 예제 필드와 해설 불일치를 수정했다. W25 백업 사례는 정상·미지원 버전·필수 키 누락·잘못된 자료형 4개 입력을 확인하도록 보완했다.
- 금요일 정적 코드 수정은 출시 점검 보고와 구체적인 4주 복습 계획으로 바꿨다. 전체 함수 구조 자동 채점은 실행 검증을 뜻하지 않는다고 안내하고, 통과·실패·빈 입력 수리 사례를 별도로 실행해 확인했다.
- Python 3.15.0은 2026-10-09 정식 출시된 최신 안정판이어서 과정 공식 문서 기준을 갱신했다. [Python 3.15.0 릴리스](https://www.python.org/downloads/release/python-3150/), [3.15 변경 안내](https://docs.python.org/3.15/whatsnew/3.15.html), [timeit](https://docs.python.org/3.15/library/timeit.html), [unittest](https://docs.python.org/3.15/library/unittest.html), [argparse](https://docs.python.org/3.15/library/argparse.html)를 대조했다. 10개 예제 출력과 새 수리 답은 Python 3.12.10에서 확인했으며 Python 3.15 런타임 검증으로 표현하지 않는다.
- Python/콘텐츠 대상 회귀 39/39, 전체 `npm test` 205/205, `npm run check:release` 통과(97개 정적 파일, 최대 9.621 MiB). `npm ls --depth=0`에서 배치 추가 의존성은 없고 `git diff --check` 내용 오류도 없다(기존 LF→CRLF 안내만 출력). 외부 서비스·비용·계정·DB·결제·공개 배포 변경은 없다.
- CQ-2 기본 언어 검수는 78/78주·1,170/1,170문항이며 완료 상태다. CQ-3는 Spring Boot W1–W15의 15/115주·225/1,725문항을 검수했다. 전체 정밀 진척은 **41.96%**, 정수 표시는 **42%**다. 다음은 Spring Boot W16–W18이다.

### CQ-3 Spring Boot W1–W3 — 첫 프레임워크 배치 (완료; 전체 40%)

- Bean 생성자 의존성, 컨트롤러/서비스 경계, 외부 설정·프로파일의 3주·15일·45문항에서 목표·예제·질문·정답·해설과 실제 오류 줄을 대조했다. W1 D1의 생성자 주입 선택과 일일 질문이 같은 회상을 반복하던 문제, W1 D2의 final 반복, W2 D2의 일반 서비스 책임 반복, W3 D1의 비밀 외부 설정 반복을 구체적인 Bean 부재, 여러 생성자 협력자, 중복 제목 검사, Spring 환경 변수 이름 적용으로 나눴다. 의미가 바뀐 네 문항은 `-v2` ID로 발행해 기존 로컬 풀이 기록을 새 답안에 자동 연결하지 않는다.
- W2 D4의 예제에는 DTO 경계 결함 외에 선언되지 않은 `course` 반환값 오류가 같이 있어, 두 번째 오답을 제거하고 단일 결함을 가리키도록 고쳤다. W3 D4 설정 속성 유형은 단순히 어노테이션을 붙이는 것뿐 아니라 `@ConfigurationPropertiesScan` 또는 명시적 등록이 필요함을 보여 준다. W3 D5는 `@Min(1)` 제약만으로는 검증이 실행되지 않는 점을 보완해 `@Validated`, 설정 Bean 등록, 호환 Jakarta Validation 구현체 전제를 예제·문항에 나타냈다. 오류 찾기 질문과 힌트도 해당 줄의 실제 결함을 말하도록 구체화했다.
- Spring Boot 4.1.1 시스템 요구 사항에서 Framework 7.0.9 이상 및 Java 17–26 호환을 재확인했다. 공식 안정/미리보기 목록은 4.1.1을 안정판, 4.2.0-M2를 미리보기로 구분한다. [외부 설정 공식 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)는 환경 변수명을 점→밑줄, 하이픈 제거, 대문자 변환 규칙으로 만들며, `@ConfigurationProperties` 검증에는 `@Validated`와 classpath의 Jakarta Validation 구현체가 필요하다고 명시한다. [시스템 요구 사항](https://docs.spring.io/spring-boot/system-requirements.html), [버전 표](https://docs.spring.io/spring-boot/spring-projects.html).
- 이 트랙은 개념 스니펫 과정이므로 실제 Spring 앱을 컴파일·기동하거나 DB를 연결해 실행하지 않았다. 대상 회귀는 Spring/콘텐츠 W1–3 의미·문항·오류 줄 및 `-v2` 키를 검사한다. 추가 의존성·서버·DB·외부 서비스·비용·배포 변경은 없다.

### CQ-3 Spring Boot W4–W6 — 두 번째 프레임워크 배치 (완료; 전체 41%)

- MVC 요청 매핑·본문·경로 값·응답 상태, Bean Validation, REST 오류 계약의 3주·15일·45문항을 대조했다. W4 첫날의 반복 GET 매핑 질문을 안전성 의미로 분리하고 생성·누락 응답 오류 찾기에는 해당 API가 요구하는 201/404 계약을 질문에 적었다. W6 D2의 잘못 배치된 201 생성 상태 단답은 404 응답 의미로 새 `spring-errors-short-v2` ID를 발행했다. 검증 오류에는 기본 Spring MVC 동작인 400을 정확히 연결하되 앱의 advice가 본문 계약을 맞춤화할 수 있음을 설명했다.
- W6 D5 예제는 클라이언트가 정한 임의 `X-Trace-Id`를 tracing 문맥으로 신뢰하지 않고, Micrometer Tracing이 구성된 요청의 현재 span을 사용하는 흐름으로 바꿨다. 기존 오류 찾기는 답 줄 자체가 trace ID 없는 정상 객체 생성이라 실제 결함이 아니었고, 요청 헤더를 복사하는 결함 줄을 선택하도록 교체했다. W4–W6의 일반 템플릿 locate 힌트도 각 HTTP/검증 상황에 맞췄다. 의미가 달라진 질문은 `-v2` ID를 사용해 옛 완료 기록과 분리한다.
- Spring Boot 4.1.1 / Framework 7.0.9 안정 문서와 [요청 본문·기본 400 응답](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html), [MVC 검증](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html), [MVC 예외 처리](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html), [Boot tracing](https://docs.spring.io/spring-boot/reference/actuator/tracing.html), [Micrometer Tracing API](https://docs.micrometer.io/tracing/reference/api.html)를 대조했다. Spring 예시는 실행형 프로젝트가 아니므로 compiler·실제 Micrometer 구성·trace 전파를 런타임 검증했다고 주장하지 않는다.
- 전용 회귀 41/41, 전체 `npm test` 207/207, 정적 release audit 97개 파일·최대 9.621 MiB 통과. `npm ls --depth=0`에서 기존 의존성 목록을 확인했고 신규 서비스·실행기·비용·DB·계정·결제·배포는 추가하지 않았다. CQ-3 누적 6/115주·90/1,725문항, 전체 정밀 진척 40.78%(표시 41%); 다음은 Spring Boot W7–W9다.

### CQ-3 Spring Boot W7–W9 — 세 번째 프레임워크 배치 (완료; 전체 41%)

- 트랜잭션·보안·테스트의 3주·15일·45문항을 목표, 오늘의 예제, 질문, 정답, 설명, 실제 오류 줄까지 대조했다. W7은 DB 트랜잭션과 외부 이메일 발송의 경계를 명확히 하고, 기본 checked exception 롤백 규칙, 프록시 자기 호출, `readOnly`의 비보안 성격을 구분했다. 오류 찾기는 예외를 잡은 뒤 정상 반환해 롤백이 일어나지 않는 구체적인 줄을 가리키도록 고쳤다.
- W8은 `@PreAuthorize` 사용에 `@EnableMethodSecurity`가 필요함을 전제에 드러내고, `authenticated()`와 권한/역할 검사 및 `anyRequest()`가 나머지 경로에 적용되는 점을 따로 묻는다. W9는 순수 Java 단위 테스트와 MVC 슬라이스를 분리하고, `@WebMvcTest`에서 일반 서비스 빈이 자동 제공되지 않는 이유와 `@MockitoBean` 대체를 설명한다. `MockMvc.perform`, JSON `Content-Type`, API 계약에 따른 201 성공 상태를 각각 독립된 사례로 다룬다.
- 공식 근거: Framework [선언적 트랜잭션](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html), [트랜잭션 이벤트](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html), [테스트 컨텍스트 빈 재정의](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/bean-overriding.html); Security [메서드 보안](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html); Boot [애플리케이션 테스트와 `@WebMvcTest`](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html). 적용 버전 설명은 Spring Boot 4.1.1 / Framework 7.0.9 과정 기준에 맞췄다.
- 전용 `node --test tests/spring-curriculum-quality.test.js tests/content.test.js` 42/42, 전체 `npm test` 208/208, `npm run check:release` 통과(97개 파일·최대 9.621 MiB), `npm ls --depth=0`, `git diff --check`, 수정 파일 `node --check`를 확인했다. Spring 자료는 정적 개념 코드이므로 Spring 프로젝트 컴파일·실행, 실제 DB 트랜잭션·보안 필터·MockMvc 연동은 검증하지 않았다. 새 의존성·서비스·비용·DB·계정·결제·배포 변경은 없다.

### CQ-3 Spring Boot W10–W12 — 네 번째 프레임워크 배치 (완료; 전체 42%)

- 시간 제한·재시도·멱등성·캐시 일관성, 구조화 로그·메트릭 cardinality·trace 문맥, API 설계 캡스톤의 3주·15일·45문항을 일일 목표와 예제에 대조했다. W10의 캐시 키 단답은 locale 변형 결과를 구분하는 key dimension을 묻게 했고, 무효화 단답은 선택과 중복되던 답 대신 `@CacheEvict`를 묻게 고쳤다.
- W11에 남아 있던 “핵심 개념 이름” 반복 단답과 일반 선택 문항을 구조화 로그의 개별 필드, 활성 trace 문맥, 제한된 metric tag, Boot가 구성한 `RestClient.Builder`, 로그 인증 비밀 경계로 나눴다. 잘못 연결돼 있던 로그 비밀번호 찾기와 분산 추적 문제도 날짜 주제에 맞게 재배치했다. W12 D4/D5의 일반 오류 찾기는 관리자 역할 누락과 활성 tracing 문맥 대신 UUID 생성이라는 실제 결함을 찾도록 구체화했다. 의미가 달라진 질문에는 `-v2` ID를 붙였다.
- Spring Boot 4.1.1의 [구조화 로그](https://docs.spring.io/spring-boot/reference/features/logging.html), [관측·태그 cardinality](https://docs.spring.io/spring-boot/reference/actuator/observability.html), [REST client 자동 구성](https://docs.spring.io/spring-boot/reference/io/rest-client.html), [`RestClient.Builder` 자동 구성 API](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/restclient/autoconfigure/RestClientAutoConfiguration.html), Spring Framework의 [캐시 추상화](https://docs.spring.io/spring-framework/reference/integration/cache.html)를 대조했다. 보안 권한 판단은 Security 7.1.1의 기존 공식 버전 기준을 유지했다.
- 대상 `node --test tests/spring-curriculum-quality.test.js tests/content.test.js` 43/43 및 전체 `npm test` 209/209 통과. `npm run check:release`는 97개 파일·최대 9.621 MiB로 통과했고, `npm ls --depth=0` 의존성 목록 확인, 수정 JS 구문 검사, `git diff --check`도 통과했다(LF→CRLF 안내만). 예제는 정적 Spring 개념 코드여서 애플리케이션 컴파일·실행, 실제 HTTP 계측, 메트릭 수집기 동작, Spring Security 필터를 검증한 것이 아니다. 서비스·비용·DB·계정·결제·배포 변경은 없으며 다음 묶음은 W13–W15다.

### CQ-3 Spring Boot W13–W15 — 다섯 번째 프레임워크 배치 (완료; 전체 42%)

- 외부 설정·페이지네이션/정렬·JPA 조회 성능의 3주·15일·45문항을 목표, 코드 예제, 선택·단답·오류 찾기, 정답과 힌트까지 대조했다. W13에서는 문자열 설정을 요청 시 파싱하는 지연 실패, `@ConfigurationProperties` prefix 불일치, 검증 Bean/제공자 전제에서 빠진 `@Validated`, 저장소 이력에 남는 비밀값, 숫자형 `Duration` 기본 밀리초를 다뤘다. W14에서는 API별 최대 size 적용, 정렬 허용 목록, `@PageableDefault`, 양수·0 기반 페이지 조건, 안정된 응답 DTO의 메타데이터 보존을 구분했다. W15에서는 OSIV 비활성화 때의 지연 로딩, 병렬 to-many fetch join의 Cartesian product, 항목별 count N+1, DB 조회 projection, PreparedStatement 획득 수·경과 시간의 격리 측정을 검수했다.
- 기존의 반복 “핵심 개념 이름” 단답과 주차 목표에서 벗어난 일반 선택·오류 찾기 프롬프트를 15개 상황별 문항으로 바꾸고 의미가 달라진 단답·locate ID에 `-v2`를 붙였다. 오류 줄을 실제 제약 위반과 맞추고, 페이지 API 문항은 Spring Data가 `PageImpl`을 안정된 공개 JSON으로 직접 반환하는 방식을 권장하지 않는다는 점을 반영해 안정된 응답 DTO 또는 Spring Data `PagedModel` 사용을 설명했다. Hibernate의 `getPrepareStatementCount()`는 준비된 statement의 획득 수를 나타내므로 “실행 SQL 수”로 부풀려 표현하지 않도록 예제와 설명을 구체화했다.
- Boot [외부 설정·`@Validated` 검증·Duration](https://docs.spring.io/spring-boot/reference/features/external-config.html), Spring Data [Pageable 기본값·정렬 요청·Page 응답](https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html), [DTO projection](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html), Hibernate [fetch join Cartesian product](https://docs.hibernate.org/orm/7.0/querylanguage/html_single/) 및 [통계 설정](https://docs.hibernate.org/orm/7.1/introduction/html_single/)·[`Statistics` API](https://docs.hibernate.org/orm/7.1/javadocs/org/hibernate/stat/Statistics.html)를 공식 문서에서 확인했다.
- 전용 Spring·콘텐츠 회귀 **44/44**, W13–W15와 공통 콘텐츠 연계 검사 **52/52**, 전체 `npm test` **210/210** 통과. `npm run check:release`는 97개 파일·최대 9.621 MiB로 통과했고, `npm ls --depth=0`, 수정 JS 구문 검사, `git diff --check`도 통과했다(LF→CRLF 안내만). 정적 개념 예제는 Spring 앱·DB에서 컴파일하거나 실행하지 않았다. 통계 측정 예시는 Hibernate 통계를 격리 테스트 프로파일에만 켜고 표본·캐시·동시 요청을 통제한다. 다음 배치는 Spring Boot W19–W21이다.

### CQ-3 Spring Boot W16–W18 — 여섯 번째 프레임워크 배치 (완료; 전체 42%)

- 트랜잭션 이후 이벤트·outbox, 테스트 더블·재현 가능한 데이터베이스 테스트·통합 테스트 범위의 3주·15일·45문항을 예제, 선택·단답·오류 찾기, 힌트, 피드백까지 대조했다.
- AFTER_COMMIT 이벤트와 이메일/메시지 전달의 유실 경계, 중복 소비에 대한 멱등 키, `@MockitoBean`으로 의존성을 대체하는 슬라이스 테스트, JPA 테스트의 flush/clear 및 rollback, 실제 테스트 프로파일/마이그레이션 적용 조건을 구체화했다. Container lifecycle과 datasource 연결 설정을 혼동한 사례, Flyway migration을 실행하지 않은 `ddl-auto=validate` 사례, 병렬 테스트에서 공유되는 고정 ID, 단위 테스트에 과한 `@SpringBootTest`를 수정했다.
- Spring Boot 4.1.1·Framework 7.0.9 계열의 [transaction-bound events](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html), [테스트 슬라이스](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html), [`@MockitoBean`](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/bean-overriding.html), [Testcontainers 연결·수명주기](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html), [DB migration 초기화](https://docs.spring.io/spring-boot/how-to/data-initialization.html), [Testcontainers JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/) 공식 문서를 대조했다.
- 의미를 바꾼 단답에는 `-short-v2` ID를 부여했다. W16–W18 선택 정답의 위치는 A/B/C 각 5개로 균형화했고, 정답 선택과 단답 해설을 같은 학습 목표에 맞췄다. 전용·교차 회귀와 전체 테스트, 정적 출시 검사 결과는 아래 감사 이력에 기록한다. Spring 앱·컨테이너·DB에서 예제를 실제 컴파일·실행하지 않았다. 다음 배치는 W19–W21이다.

### CQ-3 Spring Boot W19–W21 — 일곱 번째 프레임워크 배치 (완료; 전체 43%)

- Resource Server JWT의 서명·issuer·audience·scope 권한 매핑과 401/403, browser CORS·credential·CSRF, Spring 비동기 proxy·제한된 executor·예외 전달·SecurityContext·취소 45문항을 실제 전제와 함께 검수했다.
- `issuer-uri`의 `iss` 검증과 API `aud` 검증을 분리하고, 기본 scope authority인 `SCOPE_...`와 `hasAuthority`를 맞췄다. CORS를 인증/인가로 오해하는 사례, credential wildcard, 쿠키 세션 CSRF, 필요한 method만 허용하는 정책을 명시했다. `@EnableAsync`·proxy mode·bounded queue 포화·void 작업 예외 처리·worker에 actor ID 전달·interrupt 복구를 각각 다른 적용 조건으로 설명했다.
- 정답 선택지를 A/B/C 각 5개로 배분하고 15개 단답을 적용 질문으로 바꾸었다. 선택 질문, 단답 해설, 오류 찾기의 문제 줄·힌트를 같은 day objective로 맞추고 의미 변경에는 `-short-v2`/`-locate-v2` ID를 사용했다.
- 점검 중 W16–W21의 “오늘의 예제”가 오류 수정 문제의 잘못된 코드와 같아 학습용 정답 예제로 오인될 수 있는 구조를 발견했다. 6주 30개 학습 예제를 올바른 Spring 사용 패턴으로 분리하고, 의도적인 결함은 choice/locate 자극 안에만 남겼다. Spring 코드는 개념 스니펫이므로 앱·보안 provider·실행기·DB·컨테이너를 컴파일·실행하지 않았다.
- Spring Security [JWT Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)·[CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html), Spring Framework [CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)·[task execution and `@Async`](https://docs.spring.io/spring-framework/reference/integration/scheduling.html), Spring Security [concurrency](https://docs.spring.io/spring-security/reference/servlet/integrations/concurrency.html) 공식 문서를 대조했다. 전용 Spring 회귀 13/13, 전체 `npm test` 210/210, release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사를 통과했다. 다음 배치는 W22–W24다.

### CQ-3 Spring Boot W22–W24 — 여덟 번째 프레임워크 배치 (완료; 전체 43%)

- Actuator 상태 확인·Kubernetes 프로브·안전한 메트릭 태그(W22), 컨테이너 이미지·환경 설정·빌드/실행 비밀 분리(W23), rolling 배포·스키마 호환·점진적 출시·운영 복구(W24)의 3주·15일·45문항을 목표·예제·선택·단답·오류 찾기까지 다시 대조했다.
- 기존 선택형 정답이 모두 A에 몰리고 단답 설명이 반복적인 “핵심 개념”이었으며 locate 힌트가 당일 결함을 찾지 못했다. 오류를 포함한 수정 자극이 “오늘의 예제”에도 그대로 노출돼 권장 코드로 오해될 수 있었다. 질문·피드백·힌트를 날짜별 실제 조건에 맞춰 바꾸고, 정답 위치를 A/B/C 각 5개로 분산했으며 의미가 바뀐 질문은 `-v2` ID로 분리했다. 15개 오늘의 예제는 수정 과제와 분리한 올바른 학습 코드로 만들고, 각 코드의 전제와 정적 개념 예제라는 범위를 주석에 남겼다.
- Actuator HTTP 공개 기본값은 health뿐이며 보안 의존성 및 사용자 정의 `SecurityFilterChain` 여부에 따라 보호 방식이 달라진다. Kubernetes liveness는 공유 DB 같은 외부 의존성에 연결하지 않고 readiness에서 DB를 확인할지는 가용성 정책으로 판단하도록 구분했다. Boot 4.1.1의 `add-additional-paths` 설정에서 `/livez`·`/readyz`를 앱 포트에 제공할 수 있다는 전제를 문항에 포함했다. metric tag는 고정된 저카디널리티 값으로 제한한다.
- Docker 예제는 exec-form `ENTRYPOINT`, `EXPOSE`와 실제 포트 공개의 차이, 빌드 비밀 마운트와 런타임 비밀 주입, digest 고정 및 의도적인 갱신을 구분했다. Kubernetes rolling update만으로 무중단이 보장된다고 표현하지 않고 readiness, surge/unavailable 한도와 DB expand/contract 호환을 함께 검토했다. 배포 뒤 롤백이 가능한 동안 파괴적 migration을 지연하고 p95·오류율·readiness를 관찰하도록 문제를 구체화했다.
- Boot [Actuator endpoint와 probe](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), [외부 설정·Duration](https://docs.spring.io/spring-boot/reference/features/external-config.html), [관측·메트릭 cardinality](https://docs.spring.io/spring-boot/reference/actuator/observability.html), Kubernetes [probe](https://kubernetes.io/docs/concepts/workloads/pods/probes/)·[rolling update](https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/), Docker [Dockerfile](https://docs.docker.com/reference/dockerfile)·[Build secrets](https://docs.docker.com/build/building/secrets)·[build best practices](https://docs.docker.com/build/building/best-practices/)를 2026-10-15 기준으로 확인했다. 이 날짜에 Spring Boot 4.1.1 및 Kubernetes 1.37.1이 공식 안정 문서의 현행 기준이었다.
- 전용 Spring·Python 교차 회귀 **22/22**, 전체 `npm test` **211/211**, `npm run check:release` 97개 파일·최대 9.621 MiB 통과. `npm ls --depth=0`, 세 변경 JS 파일 `node --check`, `git diff --check`도 종료 코드 0이었다(CRLF 변환 안내만 출력). Spring 스니펫은 정적 개념 자료이며 애플리케이션·컨테이너·Kubernetes·DB 배포 실행으로 검증하지 않았다. 다음 배치는 W25–W26이다.

### CQ-3 Spring Boot W25–W26 — 아홉 번째 프레임워크 배치 (완료; Spring Boot 전체 주차 검수 완료)

- API 버전과 하위 호환성·선택 요청 필드·폐기 안내·OpenAPI 오류 계약·응답 필드 호환(W25), 동시 정원 초과 방지·안전한 HTTP 오류·객체 단위 인가·메트릭 cardinality·실행 가능한 회고 조치(W26)의 2주·10일·30문항을 검수했다.
- W25–W26의 객관식 정답이 모두 A에 놓이고 반복되는 “핵심 개념” 단답과 기본 locate 질문이 코드를 진단하지 못했으며 “오늘의 예제”가 결함 수정 자극을 그대로 재사용했다. 10개 상황형 문항과 피드백·힌트를 다시 쓰고 정답을 A/B/C에 4/3/3으로 배분했다. 변경한 선택지 의미는 `-choice-v2`, 단답은 `-short-v2`, locate는 `-locate-v2` ID로 분리해 기존 응답 이력을 보존했다. 오늘의 예제 10개를 의도한 정답 패턴으로 따로 만들었다.
- 호환성 문항은 기존 v1 지원과 새 v2 병행, 새 필드의 선택성, OpenAPI 폐기 표시와 실제 지원 종료 공지의 차이, 404 오류 response와 기존 JSON 키 보존을 구분한다. 운영 캡스톤은 일반 `@Transactional`만으로 count-then-save 경쟁이 언제나 직렬화된다고 가정하지 않고 조건부 원자 갱신·행 수 확인·DB unique 제약의 역할을 명시했다. 로그인한 상태만으로 객체 접근이 허용되지 않으며 사용자-리소스 인가를 검사한다. 메트릭에는 제한된 outcome tag를 두고 요청 ID는 로그·trace로 연결한다.
- [OpenAPI 3.1.1 Operation Object](https://spec.openapis.org/oas/v3.1.1.html), [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html), Spring Security [method authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html), PostgreSQL 18 [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)·[UPDATE](https://www.postgresql.org/docs/18/sql-update.html), Micrometer [high-cardinality tags](https://docs.micrometer.io/micrometer/reference/concepts/high-cardinality-tags-detector.html)를 대조했다.
- Spring 전용 회귀 **23/23**, 전체 `npm test` **212/212**, `npm run check:release` 97개 파일·최대 9.621 MiB 통과. 수정 JavaScript 구문 검사, `npm ls --depth=0`, `git diff --check`도 확인했다. W25–W26 예제는 개념 스니펫이므로 실제 Spring API·인증·DB 동시성 동작을 실행해 검증하지 않았다. Spring Boot는 26/26주 완료했고 CQ-3의 다음 과정은 React W1–W3이다.

### CQ-3 React W1–W3 — 첫 React 배치 (완료)

- React 입문 과정의 JSX·컴포넌트와 props·조건부 렌더링·목록 key·이벤트·상태 snapshot을 3주·15일·45문항에 대조했다. 코드 예제는 부모에서 전달하는 값과 관찰 가능한 결과를 보이게 보완하고, 오류 찾기는 실제 JSX/props/state 결함을 가리키도록 고쳤다.
- 자동 생성 문항 중 “주제 이름을 말하라” 식의 단답과 날짜 사이에 반복되거나 목표에 맞지 않는 문항을 사례 기반으로 바꿨다. 학습자에게 보이는 하루 문항을 선택·추적·오류 찾기로 분리하고 객관식 정답 위치를 A/B/C 각 5개로 맞췄다. 기존 주간 문항과 합칠 때 같은 형식이 중복되던 W1D1·W2D1·W2D3·W3D1은 각 날짜의 기존 문항을 보완하는 생성 항목으로 바꿨다.
- 조건부 렌더링, 안정적인 목록 key, 누락된 `children`·prop, 이벤트 전파, React 상태 snapshot 및 업데이트 queue를 개별 사례로 확인했다. 수정 의미가 달라진 일일 문항은 `-v2` 식별자로 이력을 보존했다. 자동 수리 평가는 코드 실행이나 브라우저 렌더가 아니라 구조 패턴 확인임을 명시했다.
- [React 19.3 출시 기록](https://react.dev/blog/2026/09/09/react-19-3), [버전 표](https://react.dev/versions), [JSX](https://react.dev/learn/writing-markup-with-jsx), [props](https://react.dev/learn/passing-props-to-a-component), [이벤트](https://react.dev/learn/responding-to-events), [state snapshot](https://react.dev/learn/state-as-a-snapshot), [업데이트 queue](https://react.dev/learn/queueing-a-series-of-state-updates)를 2026-10-15 기준으로 대조했다. React 문서는 최신 안정판을 19.3으로 표시한다.
- React 전용·콘텐츠 회귀 **50/50**, 전체 `npm test` **213/213**, `npm run check:release` 97개 파일·최대 9.621 MiB 통과. 세 변경 JS 파일의 구문 검사, `npm ls --depth=0`, `git diff --check`도 통과했다. 문항은 로컬 생성기·채점기에서 확인했으며 React 앱 렌더·브라우저 DOM 동작은 실행하지 않았다. CQ-3 누적 29/115주·435/1,725문항, 전체 정밀 진척 43.78%(표시 44%)이며 다음은 React W4–W6이다.
### CQ-3 React W4–W6 — 상태·폼·Effect 배치 (완료)

- W4–W6 15일·45문항을 객체/배열 상태 불변 갱신, 제어 입력과 목록, Effect 외부 동기화·정리·파생값으로 나누어 일일 목표에 맞췄다. 매일 선택·코드 추적·오류 찾기 또는 코드 수리의 서로 다른 사고 동작을 유지하고 질문·예제·정답·힌트를 서로 대조했다.
- 상태 객체/배열 복사와 중첩 갱신, 안정된 key, `value`를 사용하는 입력의 동기식 `onChange`, 폼 기본 제출 취소, label·오류 설명 연결, 외부 연결 cleanup, 화면에서 계산 가능한 파생 목록, 오래된 요청 취소를 다룬다. 반복되거나 목표와 어긋난 레거시 질문을 교체하고 의미가 바뀐 항목은 새 `-v2` 식별자를 사용했다.
- 코드 수리 회귀에서 W5D4의 유효한 `preventDefault` 수정 코드가 수정 전의 올바른 저장·반환 문장을 유지한다는 이유로 오답 처리되는 것을 발견했다. 이미 유효한 본문을 유지하고 필요한 기본 동작 취소만 추가하는 답도 통과하도록 해당 문항의 구조 검사 옵션과 정답 예시를 조정했다. 대표 정답 및 미수정 시작 코드 판정을 확인했으며 React를 렌더링하지 않고 코드 구조만 검사한다.
- [객체 상태 갱신](https://react.dev/learn/updating-objects-in-state), [배열 상태 갱신](https://react.dev/learn/updating-arrays-in-state), [React `<input>`](https://react.dev/reference/react-dom/components/input), [Effect로 외부 시스템 동기화](https://react.dev/learn/synchronizing-with-effects), [불필요한 Effect 피하기](https://react.dev/learn/you-might-not-need-an-effect)을 2026-10-15 기준 공식 문서와 대조했다.
- React W4–W6 전용·콘텐츠 회귀 **51/51**, 전체 `npm test` **214/214**, `npm run check:release` 97개 파일·최대 9.621 MiB 통과. 의존성 목록과 JavaScript 구문도 확인했다. React DOM·실제 브라우저 입력·네트워크 Effect 실행은 미검증이다. CQ-3 누적 32/115주·480/1,725문항, 전체 정밀 진척 44.17%(표시 44%)이며 다음은 React W7–W9이다.

### CQ-3 React W7–W9 — reducer·custom Hook·요청 상태 배치 (완료)

- W7–W9 15일·45문항을 reducer의 순수 전이·action·Context 및 상태 소유, custom Hook 이름·호출 순서·반환 계약·구독 정리, 요청 진행·오래된 응답·빈 성공과 실패 구분으로 연결했다. 매일 객관식·주관식·오류 찾기/수리 조합을 살펴 같은 주 안에서 코드 진단 사례가 반복되지 않게 했다.
- W7D2의 기존 action 주관식은 선택·오류 문항과 type/id 기억을 중복해 알 수 없는 action의 기본 상태 반환으로 교체하고 새 `react-reducer-action-default-short-v3` ID를 발행했다. W8D1 레거시 선택 질문은 그날의 custom Hook 이름 목표로 정렬해 `react-hook-name-choice-v3`로 분리했다. W8D4 오류 찾기는 조건부 Hook 예제를 잘못 재사용하던 문제를 실제 구독 cleanup 누락 코드로 바꿨다. W7D4는 별도 상태 복제로 오래된 검색값이 남는 상황, W9D1–D4는 상태 boolean 모순·loading 갱신 순서·cleanup 취소 누락·빈 결과 분기를 각각 가리키게 했다. W9D5 오답 설명도 성공한 빈 결과와 진행 상태가 다른 이유를 구체화했다.
- 선택지별 오답 근거, 주관식 허용 답·힌트·해설, 오류 줄, 코드 수정 구조 패턴을 학습자에게 보이는 최종 세션 조합 기준으로 검사했다. W7D4/D5, W8D4/D5, W9D4/D5 대표 수리 답은 통과하고 변경 전 시작 코드는 거부하는 회귀 사례를 추가했다. 45개 질문은 프롬프트가 모두 다르고, 주당 locate 코드도 반복되지 않는다.
- React 공식 [reducer 추출](https://react.dev/learn/extracting-state-logic-into-a-reducer), [reducer와 Context](https://react.dev/learn/scaling-up-with-reducer-and-context), [Context 전달](https://react.dev/learn/passing-data-deeply-with-context), [Hook 규칙](https://react.dev/reference/rules/rules-of-hooks), [custom Hook 재사용](https://react.dev/learn/reusing-logic-with-custom-hooks), [Effect 동기화와 정리](https://react.dev/learn/synchronizing-with-effects)을 2026-10-15 기준으로 대조했다. 해당 예시는 설명용 React 개념 코드다.
- React 전용·콘텐츠 회귀 **52/52**, 전체 `npm test` **215/215**, release audit **97개 파일·최대 9.621 MiB**, 의존성 목록, 변경 JS 구문, `git diff --check`를 통과했다. `git diff --check`는 오류 없이 CRLF 변환 안내만 출력했다. React를 브라우저에서 렌더링하거나 실제 network Effect를 실행하지 않았다. CQ-3 누적 35/115주·525/1,725문항, 전체 정밀 진척 **44.57%(표시 45%)**이며 다음은 React W10–W12다.

### CQ-3 React W10–W12 — 내비게이션·테스트·학습 기록 (완료)

- 15일·45문항에서 주소 이동과 화면 안 동작의 링크/버튼 구분, route 후 제목 포커스와 `aria-current`, 사용자가 확인할 수 있는 Testing Library 검증, 실측 성능 최적화, 최근 기록의 빈·저장 실패·복구 상태를 확인했다. 반복 질문과 서로 다른 목표가 한 항목에 섞인 수리 과제를 교체하고 의미가 달라진 문항은 새 ID로 분리했다.
- 측정하지 않은 `useMemo`와 이름 없는 아이콘 버튼, 주소와 다른 `aria-current`, 실패를 성공으로 안내하는 기록 화면 및 잘못된 resume 경로를 일별 사례에 맞췄다. 문항별 선택 피드백, trace 출력, 오류 줄, 대표 수리 답을 다시 검증했다.
- [React input](https://react.dev/reference/react-dom/components/input), [common DOM components](https://react.dev/reference/react-dom/components/common), [Profiler](https://react.dev/reference/react/Profiler), [useMemo](https://react.dev/reference/react/useMemo), [React Testing Library의 역할 기반 쿼리](https://testing-library.com/docs/queries/about/)를 대조했다. 실제 React DOM·라우터·Testing Library 렌더는 실행하지 않았다.
- W10–W12 전용 회귀 23/23. 이후 React W13–W21을 포함한 현재 전체 `npm test` 219/219와 release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사를 통과했다. CQ-3 누적 38/115주·570/1,725문항, 전체 정밀 진척 44.96%(표시 45%); 다음은 W13–W15다.

### CQ-3 React W13–W15 — 요청 상태·조합·Context (완료)

- 요청 reducer 전이와 오래된 응답, `children`/props 조합, 목록의 안정 ID, React 19 Context 생성·제공·소비를 15일·45문항에 맞췄다. 반복 단답, 날짜 목표와 다른 오류 사례를 바꾸고 Context provider를 React 19의 `<ThemeContext value={theme}>` 표기로 정리했다.
- [React reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer), [Context 전달](https://react.dev/learn/passing-data-deeply-with-context), [React 19.3 release](https://react.dev/blog/2026/09/09/react-19-3)를 대조했다. W15 이전에 이미 확인된 React 18 호환 맥락과 React 19 전용 provider 표기를 구분하며 실제 React DOM 렌더는 실행하지 않았다.
- 전용 회귀 23/23, 이후 W16–W21을 포함한 전체 `npm test` 219/219. CQ-3 누적 41/115주·615/1,725문항, 전체 정밀 진척 45.35%(표시 45%); 다음은 W16–W18이다.

### CQ-3 React W16–W18 — 화면 전환·복구·성능 (완료)

- ViewTransition의 React 버전·DOM renderer 경계와 `startTransition`, 저장 성공 확인, Error Boundary가 다루는 렌더 오류와 비동기/입력 오류, Profiler 측정 뒤 필요한 최적화를 45문항의 사례·정답·오류 위치·수리 코드에 반영했다. 수리 가능성이 없는 read-only 폼을 수정 가능한 controlled input으로 바꾸고, Context 사용 예제의 생성/import 맥락을 보완했다.
- 정답 위치를 주차마다 분산하고, React 19.3 `ViewTransition`·Profiler import, React 19 Context value 전달, error fallback·retry의 실제 역할을 명시했다. 성능 선택은 React Compiler 적용 여부와 실측 조건을 넣어 모든 계산에 memo를 붙이라는 식의 지시를 제거했다.
- [React 19.3 release](https://react.dev/blog/2026/09/09/react-19-3), [ViewTransition](https://react.dev/reference/react/ViewTransition), [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary), [Profiler](https://react.dev/reference/react/Profiler), [useMemo](https://react.dev/reference/react/useMemo)를 대조했다. 실제 renderer·Transition·Profiler 성능은 실행 측정하지 않았다.
- 전용 React 회귀 24/24, 현재 전체 `npm test` 219/219와 release audit 97개 파일·최대 9.621 MiB 통과. CQ-3 누적 44/115주·660/1,725문항, 전체 정밀 진척 45.74%(표시 46%); 다음은 W19–W21이다.

### CQ-3 React W19–W21 — 접근성·안전한 출력·경로 경계 (완료)

- label 연결, controlled input의 수정 가능한 onChange, 오류 설명과 요약에서 잘못된 입력으로 이동, form 제출, 일반 text child와 원시 HTML, 외부 이미지 URL allowlist, URI decode 실패, loading/error/not-found/success 화면 및 브라우저 이동 기록을 45문항에 맞췄다.
- W19D4의 label 수리 문제를 오류 요약에 안정된 key와 해당 필드로 가는 링크를 주는 수리로 바꿨다. W21D4의 id 검증 수리 문제는 요청 상태별 fallback·retry·not-found 분기로, W21D5의 중복 id 검증은 목적지 `href`를 가진 anchor로 교체했다. W20D5 locate 예제가 route 링크를 가리키던 불일치를 제거하고 W20D4의 HTML 신뢰 경계를 복구했다. React의 attribute escaping은 URL host 정책 검증을 대신하지 않는다는 점을 구별했다.
- React [input](https://react.dev/reference/react-dom/components/input)·[form](https://react.dev/reference/react-dom/components/form)·[common components/`dangerouslySetInnerHTML`](https://react.dev/reference/react-dom/components/common), OWASP [XSS 방지](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet)·[허용 URL 검증](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)를 대조했다. React Router 특정 loader 통합이나 실제 DOM 포커스 이동은 이 정적 개념 과정에서 실행·주장하지 않는다.
- W19–W21 전용 회귀 25/25, 전체 `npm test` 219/219, `npm run check:release` 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 구문 검사, `git diff --check` 통과. CQ-3 누적 47/115주·705/1,725문항, 전체 정밀 진척 46.13%(표시 46%); 다음은 W22–W24다.

### CQ-3 React W22–W24 — 저장 복구·코드 분할·상태 전이 (완료)

- 저장값의 JSON 직렬화·손상 자료 파싱 복구·상태 초기화·쓰기 실패와 비밀정보 경계를, `lazy`/`Suspense`의 코드 대기와 import 오류, 상태 머신의 허용 전이 및 테스트에 맞춰 45문항을 검수했다. W22D4 저장 실패 수리 문제가 JSON 파싱을 다루던 불일치를 고쳤고, W23D5 사전 로딩 판단에서 요청 취소를 묻던 문제를 진입 가능성과 데이터 비용을 비교하는 정책 질문으로 바꿨다. 추적 문제의 반복 일반 해설과 힌트도 해당 날짜의 결과에 맞췄다.
- W22D4는 실제 `localStorage`를 건드리지 않는 가짜 storage로 예외 경로를 시뮬레이션한다고 명시한다. W23 선요청은 React API가 자동 제공한다고 주장하지 않고 제품·라우터·번들러의 정책 판단으로 한정했다. W24 repair는 현재 상태의 전이 목록에 있는 목적지로만 이동시킨다.
- MDN [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)·[저장 용량과 QuotaExceededError](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)·[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), React [`lazy`](https://react.dev/reference/react/lazy)·[`Suspense`](https://react.dev/reference/react/Suspense)·[reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)를 대조했다.
- W22–W24 회귀 26/26, 최종 React 품질 회귀 27/27, 전체 `npm test` 221/221, release audit 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 및 `git diff --check` 통과. CQ-3 누적 50/115주·750/1,725문항, 전체 정밀 46.52%(표시 47%); 브라우저 저장소·React renderer·라우터에서 실제 동작은 실행하지 않았다.

### CQ-3 React W25–W26 — 캡스톤·기록 이어하기 (완료)

- 정상 제출, 빈 문항, 불러오기 오류와 재시도, 저장 성공·실패, controlled draft 유지, 키보드 제출과 결과 알림을 작은 학습 화면에 통합했다. 기존 W25D4·D5 repair가 내보내기 버튼만 고치던 주제 밖 문제를 바꾸고 의미 변경 ID를 새 버전으로 발급했다. W26 이어 학습은 과정 카탈로그에서 확인한 `href`만 링크로 연결하고 없을 때 과정 선택으로 복구하게 했다.
- React `<form>`의 기본 제출 동작과 입력·submit 요소, 상태·draft를 보존하는 경계와 저장소 실패 사례를 공식 문서와 대조했다. 수리 코드는 정적 JSX 구조 패턴으로 평가한다. 실제 React DOM 렌더, 키보드·스크린 리더 사용, 저장소 쿼터/예외는 브라우저에서 실행 검증한 것이 아니다.
- React [`<form>`](https://react.dev/reference/react-dom/components/form)·[`<input>`](https://react.dev/reference/react-dom/components/input)·[state 보존과 초기화](https://react.dev/learn/preserving-and-resetting-state), MDN [저장 용량과 삭제 기준](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)을 대조했다.
- React W25–W26 회귀 27/27, 전체 `npm test` 221/221, `npm run check:release` 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, `node --check src/curriculum-weeks-react.js`, `git diff --check` 통과. CQ-3 누적 52/115주·780/1,725문항, 전체 정밀 46.78%(표시 47%); 다음은 FastAPI W1–W3이다.

### CQ-3 FastAPI W1–W3 — 요청·경로·검증 기초 (완료)

- 첫 세 주 45문항에서 주간 코드 예제를 여러 날 되풀이하고, 힌트·피드백이 날짜별 내용과 무관하게 복사된 결함을 수정했다. 요청 생성과 입력·출력, 경로 매개변수와 타입 검증을 각각의 당일 목표·예제·선택/단답/오류 진단으로 연결했다.
- “오류 찾기”에서 자연어 설명을 Python 코드 줄처럼 삽입하거나 서로 독립된 두 결함을 동시에 넣어 유일한 답이 없던 사례를 실제로 분석 가능한 코드로 바꿨다. 하나의 목표 결함과 정확한 줄 번호, 수정 이유, 당일 개념과 연계된 힌트·오답 피드백을 보강했다. 의미가 변경된 문항은 새 버전 ID를 발급해 학습 기록의 과거 답과 분리했다.
- FastAPI 공식 [첫 단계](https://fastapi.tiangolo.com/tutorial/first-steps/), [경로 매개변수](https://fastapi.tiangolo.com/tutorial/path-params/), [추가 데이터 타입](https://fastapi.tiangolo.com/tutorial/extra-data-types/), [요청 본문](https://fastapi.tiangolo.com/tutorial/body/) 및 [릴리스 노트](https://fastapi.tiangolo.com/release-notes/)를 대조했다. 문서상 최신 안정판은 0.143.1(2026-10-14)이며, 사이트 브라우저 실행기에서 검증한 FastAPI 0.143.0은 업데이트하지 않고 고정판으로 별도 표시했다.
- W1–W3 회귀·콘텐츠 검사 41/41, 전체 `npm test` 223/223, `npm run check:release` 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문 및 `git diff --check` 검사를 통과했다. Python 3.12 AST로 30개 스니펫 중 29개가 구문 유효함을 확인했고, 나머지 한 개는 `def` 안에서 `await`를 사용하는 의도된 locate 진단 오류다. 실제 FastAPI 서버·브라우저 Worker 통합은 실행하지 않았다. CQ-3 누적 55/115주·825/1,725문항; 전체 정밀 47.17%(표시 47%); 다음은 FastAPI W4–W6이다.

### CQ-3 FastAPI W4–W6 — 쿼리·본문 모델·입력 제약 (완료)

- 다음 세 주 45문항에서 쿼리 선택/필수, inclusive 경계, 반복 쿼리 목록, 경로·쿼리·본문 입력 위치, BaseModel 및 중첩 모델, Pydantic v2의 nullable과 기본값 차이, Field 길이·수치 제약, 요청 경계의 기본 422 검증을 각각 다른 날짜 목표에 맞췄다.
- 주마다 같은 대표 코드와 문항 틀을 반복하던 생성 콘텐츠를 15개의 완결된 학습 예제로 바꾸고, 일반 문구 단답과 여러 날짜에 재사용된 단일 오류 스니펫을 실제 Python 구문 및 하나의 분석 가능한 결함으로 바꿨다. 쿼리의 category 값이 접근 권한 증명처럼 읽히던 문구를 고치고, 돈 예시에 부동소수점 `float`를 권하지 않도록 rating 예제로 수정했다. W6는 W5와 중복된 단순 nullable 설명 대신 선택 문자열의 `Field(max_length=160)` 검증을 연습한다. 변경된 뜻의 문제에는 `-v2` ID를 발급해 과거 답 기록과 구분했다.
- FastAPI 공식 [쿼리 매개변수](https://fastapi.tiangolo.com/tutorial/query-params/), [쿼리 검증 및 반복 목록](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/), [요청 본문](https://fastapi.tiangolo.com/tutorial/body/), [중첩 모델](https://fastapi.tiangolo.com/tutorial/body-nested-models/), [Field 제약](https://fastapi.tiangolo.com/tutorial/body-fields/)과 Pydantic 공식 [v2 필수·선택·nullable 필드](https://docs.pydantic.dev/latest/migration/#required-optional-and-nullable-fields)를 대조했다. FastAPI `Annotated` query list 문법과 Pydantic v2에서 `str | None`에 기본값이 없으면 여전히 필수인 점을 확인했다.
- FastAPI 전용 배치 테스트 4/4, 전체 `npm test` 224/224, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, JavaScript 구문 검사와 `git diff --check`가 통과했다. Python 3.12 AST에서 예제 및 locate 코드 30/30이 구문 유효하다. 실제 FastAPI 서버, HTTP 응답 또는 브라우저 Worker 실행은 검증하지 않았다. CQ-3 누적 58/115주·870/1,725문항, 전체 정밀 47.57%(표시 48%); 다음은 FastAPI W7–W9다.

### CQ-3 FastAPI W7–W9 — 응답·HTTP 경계·의존성 (완료)

- 다음 세 주 45문항을 응답 모델의 공개 필드·리스트 계약·nullable 및 필수 출력 필드, HTTP 생성/삭제 상태 코드·무본문 204, 요청/응답 헤더 구분, Depends callable 전달·반환값 주입·재사용으로 나눠 날짜별로 검수했다. 응답 필터링이 인증·권한 검사를 대신하지 않는다는 경계를 반복해 명시하고, 응답 검증 실패를 클라이언트 입력의 422와 구별했다.
- W8 삭제 예제의 집합은 수업용 메모리 fixture이며 지속 저장소가 아님을 코드에 표시했다. W9D5 오류 찾기는 여러 줄이 똑같이 잘못되어 정답이 모호하던 반복 Query 사례를 고쳐, courses 경로는 공통 dependency를 사용하고 lessons 경로의 중복 선언 한 줄만 수정 대상으로 남겼다. 단답 문구, 질문 길이, 피드백을 문제 목표에 맞게 보강하고 의미가 바뀐 문항은 `-v2` ID로 분리했다.
- FastAPI 공식 [응답 모델](https://fastapi.tiangolo.com/tutorial/response-model/), [응답 상태 코드](https://fastapi.tiangolo.com/tutorial/response-status-code/), [요청 헤더](https://fastapi.tiangolo.com/tutorial/header-params/), [응답 헤더](https://fastapi.tiangolo.com/advanced/response-headers/), [의존성](https://fastapi.tiangolo.com/tutorial/dependencies/) 및 [하위 의존성 재사용](https://fastapi.tiangolo.com/tutorial/dependencies/sub-dependencies/)을 대조했다.
- FastAPI 전용 회귀 파일 5/5, 전체 `npm test` 225/225, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST로 15개 학습 예제와 15개 오류 진단 코드가 모두 구문 유효함을 확인했다. 실제 FastAPI 서버·HTTP 요청·브라우저 Worker 실행은 하지 않았다. CQ-3 누적 61/115주·915/1,725문항, 전체 정밀 47.96%(표시 48%); 다음은 FastAPI W10–W12다.

### CQ-3 FastAPI W10–W12 — 의존성 그래프·정리·라우터 (완료)

- W10–W12의 45문항을 `Annotated` import/type alias와 재사용, 하위 의존성의 값 전달 순서, `yield` 자원 정리와 async close, 같은 요청 안의 dependency cache, function/request cleanup scope, APIRouter 등록·포함·prefix·OpenAPI tags로 나눠 다시 썼다. 날짜별 예제와 오류 찾기는 각각 다른 코드로 구성했고, W10의 token은 graph 설명용 fixture이며 인증·서명 검증을 제공하지 않는다고 명시했다.
- W11의 `use_cache`는 한 요청의 dependency graph 안에서 같은 하위 의존성 결과를 재사용하는 기본 동작으로 설명하고 프로세스 전체의 사용자 데이터 캐시와 구별했다. FastAPI 0.121.0부터 문서화된 `scope="function"`은 path operation 종료 후 응답 전송 전에 정리하는 경우에만 쓰도록 request 기본 scope와 대비했다. W12 tags는 문서 분류일 뿐 경로·권한 설정이 아님을 분리했다. 크게 변경된 학습 문항은 `-v2` ID로 분리했다.
- FastAPI 공식 [Depends와 Annotated](https://fastapi.tiangolo.com/tutorial/dependencies/), [하위 의존성 및 요청 내 cache](https://fastapi.tiangolo.com/tutorial/dependencies/sub-dependencies/), [yield 의존성](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/), [여러 모듈과 APIRouter](https://fastapi.tiangolo.com/tutorial/bigger-applications/) 문서를 대조했다.
- FastAPI 품질 회귀 파일 6/6, 전체 `npm test` 226/226, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST에서 학습 예제와 오류 진단 코드 30/30의 구문 유효성을 확인했다. FastAPI 앱·요청·yield 수명주기는 실제 실행하지 않았다. CQ-3 누적 64/115주·960/1,725문항, 전체 정밀 48.35%(표시 48%); 다음은 FastAPI W13–W15다.

### CQ-3 FastAPI W13–W15 — 비동기·미들웨어·HTTP 오류 (완료)

- W13의 async handler·await 결과·동기 드라이버 실행 경계·CPU-bound 계산, W14의 middleware 등록·`call_next`·응답 수정/반환·중첩 순서, W15의 404·401 challenge·403 권한 거부·도메인 예외 처리기·안전한 오류 detail을 날짜별 다른 예제와 45문항으로 재구성했다.
- FastAPI가 직접 호출하는 일반 `def` path operation/dependency의 threadpool 실행과 async handler가 직접 호출하는 임의 동기 helper가 자동 offload되지 않는다는 점을 구별했다. CPU-bound 작업은 async 문법만 붙여 해결되는 것처럼 보이지 않게 하고, 측정·수명주기 범위의 ProcessPoolExecutor 예를 들었다. Middleware 등록 순서와 response 처리 순서를 맞추고 CORS에서 브라우저가 사용자 정의 응답 헤더를 읽으려면 expose 설정이 필요할 수 있다고 덧붙였다. 401 인증 실패, 403 인증된 주체의 권한 실패, 404 리소스 부재 및 안전한 공개 오류 detail을 분리했다.
- FastAPI 공식 [async/await·동기 함수 실행](https://fastapi.tiangolo.com/async/), [middleware·순서](https://fastapi.tiangolo.com/tutorial/middleware/), [HTTPException·사용자 정의 예외 처리](https://fastapi.tiangolo.com/tutorial/handling-errors/), [HTTPException reference](https://fastapi.tiangolo.com/reference/exceptions/)를 대조했다. 실제 인증 구현이나 서버 오류를 middleware/handler 예제로 가장하지 않았다.
- FastAPI 품질 회귀 파일 7/7, 전체 `npm test` 227/227, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST에서 학습 예제 및 오류 진단 코드 30/30이 구문 유효함을 확인했다. FastAPI 서버·HTTP·CPU 작업·middleware 런타임은 실행하지 않았다. CQ-3 누적 67/115주·1,005/1,725문항, 전체 정밀 48.74%(표시 49%); 다음은 FastAPI W16–W18이다.

### CQ-3 FastAPI W16–W18 — 검증 오류·앱 수명주기·REST 상태 변경 (완료)

- W16–W18의 45문항에서 기본 요청 검증 422, RequestValidationError와 응답 검증 실패의 방향 차이, JSONResponse의 status_code/content, 오류 정보 최소 공개, lifespan의 asynccontextmanager와 yield 경계, app.state/request.state 범위, lifespan과 구식 이벤트 연결, 리소스 중심 경로, POST 201, PATCH 부분 입력, DELETE 204의 본문 없는 계약을 날짜별로 검수했다.
- 매일의 예제와 실제 오류 찾기를 분리해 완결 가능한 Python 코드로 만들었다. PATCH 예제는 메모리 fixture 및 재시작 시 보존되지 않는 범위를 명시하고, 누락 리소스의 404 및 `model_dump(exclude_unset=True)`를 포함해 생략 필드와 명시적 null을 구분한다. 수정 의미가 달라진 45문항은 `-v2` ID로 분리해 이전 학습 기록을 보존했다.
- FastAPI 공식 [오류 처리](https://fastapi.tiangolo.com/tutorial/handling-errors/), [예외 reference](https://fastapi.tiangolo.com/reference/exceptions/), [lifespan](https://fastapi.tiangolo.com/advanced/events/), [상태 코드](https://fastapi.tiangolo.com/tutorial/response-status-code/), [PUT/PATCH 업데이트](https://fastapi.tiangolo.com/tutorial/body-updates/) 문서를 대조했다.
- FastAPI 전용 회귀 파일 8/8, 전체 `npm test` 228/228, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST에서 학습 예제 및 오류 진단 코드 30/30이 구문 유효함을 확인했다. FastAPI 앱·HTTP 응답·lifespan·DB 실행은 하지 않았다. CQ-3 누적 70/115주·1,050/1,725문항, 전체 정밀 49.13%(표시 49%); 다음은 FastAPI W19–W21이다.

### CQ-3 FastAPI W19–W21 — Bearer·권한·TestClient (완료)

- W19–W21의 45문항에서 `HTTPBearer` import·`auto_error=False`·Depends 전달·scheme/credential 필드, 헤더에서 토큰을 읽는 것과 서명·만료·발급자·사용자·권한을 검증하는 과정의 분리, 인증 실패 401과 `WWW-Authenticate: Bearer`, 인증된 사용자의 권한 거부 403, 현재 사용자 dependency 재사용, 리소스 소유권 비교, 최소 권한, TestClient import·앱 객체 전달·lifespan context manager·status_code와 JSON 본문 읽기를 날짜별로 확인했다.
- 15개 학습 예제와 실제 잘못된 줄 진단을 다시 작성하고, 역할/소유권을 확인하지 않거나 Bearer 문자열을 곧바로 인증 성공으로 간주하는 오개념을 고쳤다. TestClient는 테스트용 HTTPX가 필요한 개발 맥락의 예제다. 저장소에 FastAPI/HTTPX 의존성 또는 테스트 서버를 추가하지 않았고, 웹 실행기에서 FastAPI 테스트를 제공한다고 안내하지 않는다. 의미가 바뀐 질문은 `-v2` ID로 분리했다.
- FastAPI 공식 [Security 첫 단계](https://fastapi.tiangolo.com/tutorial/security/first-steps/), [Simple OAuth2·Bearer](https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/), [현재 사용자](https://fastapi.tiangolo.com/tutorial/security/get-current-user/), [OAuth2 scopes](https://fastapi.tiangolo.com/advanced/security/oauth2-scopes/), [TestClient](https://fastapi.tiangolo.com/tutorial/testing/), [lifespan 테스트](https://fastapi.tiangolo.com/advanced/testing-events/) 문서를 확인했다.
- FastAPI 전용 회귀 파일 9/9, 전체 `npm test` 229/229, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST에서 학습 예제 및 오류 진단 코드 30/30이 구문 유효함을 확인했다. FastAPI 앱·인증·TestClient·HTTPX 실행은 하지 않았다. CQ-3 누적 73/115주·1,095/1,725문항, 전체 정밀 49.52%(표시 50%); 다음은 FastAPI W22–W24다.

### CQ-3 FastAPI W22–W24 — 격리 테스트·비동기 ASGI·페이지네이션 (완료)

- W22–W24의 45문항에서 dependency override 키/대체 callable, 가짜 저장소와 외부 호출 경계, override 복구·테스트 상태 격리, HTTPX `ASGITransport`·`AsyncClient`·`await`, 별도 lifespan 관리, 상대 요청의 `base_url`, Query의 최소/최대 검증, 정렬 후 페이지 자르기, allowlist 정렬, 다음 offset 계산을 날짜별 사례에 연결했다.
- 문제 설명의 짧거나 모호한 질문·피드백을 구체화하고, 진단 코드의 결함 줄을 실제로 특정하도록 고쳤다. 동시에 공유 앱의 dependency override 변경은 동시 테스트 간섭을 일으킬 수 있음을 명시했다. 비동기 테스트 예제는 외부 Python 개발 환경 전용이며 사이트 실행기가 FastAPI·HTTPX 테스트 패키지를 설치하거나 실행하는 것처럼 표시하지 않는다. 페이지 정렬 예제는 작은 인메모리 목록으로 한정하고 운영 DB에서는 같은 정렬 조건을 `ORDER BY`한 뒤 `LIMIT/OFFSET`을 적용한다고 설명한다.
- FastAPI 공식 [테스트 dependency 대체](https://fastapi.tiangolo.com/advanced/testing-dependencies/), [비동기 테스트](https://fastapi.tiangolo.com/advanced/async-tests/), [쿼리 매개변수](https://fastapi.tiangolo.com/tutorial/query-params/), [쿼리 검증](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/)과 HTTPX [ASGI transport](https://www.python-httpx.org/advanced/transports/#asgi-transport)를 대조했다. `ASGITransport`가 lifespan을 실행하지 않는 경계와 FastAPI 문서가 별도 lifespan manager를 안내하는 점을 유지했다.
- FastAPI 전용 회귀 10/10, 전체 `npm test` 230/230, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사와 `git diff --check`를 통과했다. Python AST에서 W22–W24의 학습 예제 및 진단 코드 30/30이 구문 유효함을 확인했다. FastAPI 앱·HTTPX·ASGI transport·LifespanManager·DB 통합을 실행하지 않았다. CQ-3 누적 76/115주·1,140/1,725문항, 전체 정밀 49.91%(표시 50%); 다음은 FastAPI W25–W27이다.

### CQ-3 FastAPI W25–W27 — CORS·후속 작업·설정 경계 (완료)

- W25–W27의 45문항에서 CORS middleware import·scheme/host/port origin 제한·preflight method/header·credential과 wildcard 제한·브라우저 응답 공유와 API 권한/CSRF 구별, `BackgroundTasks` 주입·callable 인자 등록·응답 뒤 실행·내구성 한계·별도 queue/worker 판단, Pydantic Settings import·필수 SecretStr·환경 변수 prefix·설정 문서 metadata·브라우저 secret 경계를 날짜별로 다시 구성했다.
- CORS를 서버 인증으로, `BackgroundTasks`를 재시도 큐로, `SecretStr`·`localStorage`를 브라우저 비밀 저장소로 오인하게 하는 수리 사례를 교정했다. 작은 업무 예제와 내구성·분산 처리가 필요한 업무를 분리했고 broker·운영 지원이 추가된다는 비용 경계도 명시했다. Pydantic Settings는 외부 Python 프로젝트용 별도 패키지이며 정적 학습 사이트가 환경 변수나 비밀 관리 기능을 제공한다고 표시하지 않는다.
- FastAPI 공식 [CORS](https://fastapi.tiangolo.com/tutorial/cors/), [Background Tasks와 무거운 작업 주의](https://fastapi.tiangolo.com/tutorial/background-tasks/), [Settings·환경 변수](https://fastapi.tiangolo.com/advanced/settings/), Pydantic [Secret Types](https://docs.pydantic.dev/latest/api/types/#pydantic.types.SecretStr)를 대조했다. CORS는 브라우저 script의 응답 접근 정책이고 CSRF·서버 인가를 대체하지 않는다는 MDN [CORS 설명](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)도 확인했다.
- FastAPI 전용 회귀 11/11, 전체 `npm test` 231/231, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사와 `git diff --check`를 통과했다. Python AST에서 W25–W27 학습 예제·진단 코드 30/30이 구문 유효함을 확인했다. FastAPI 서버·CORS browser flow·BackgroundTasks 런타임·Pydantic Settings 환경 로딩은 실행하지 않았다. CQ-3 누적 79/115주·1,185/1,725문항, 전체 정밀 50.30%(표시 50%); 다음은 FastAPI W28–W30이다.

### CQ-3 FastAPI W28–W30 — 운영·버전·종합 캡스톤 (완료)

- W28에서 구조화 로그, liveness/readiness/startup probe의 역할, 안전한 오류 응답, 낮은 cardinality 계측과 정적 학습 사이트의 서버 운영 경계를 실제 예제·문항에 맞췄다. 예외 원문에 민감 정보가 담길 수 있어 운영 로그 예제는 request ID 중심으로 제한했다. W29에서 공식 최신판과 runner pin, Python 지원 하한과 검증된 브라우저 실행기, FastAPI/Starlette 호환 범위, 0.143.0 telemetry 자동 설정 opt-in 변경과 버전 확인 기록을 구분했다. W30은 공개 목록·소유권 경계·생성 요청·의존성·TestClient capstone을 기존 기준으로 확인했다.
- FastAPI [릴리스 노트](https://fastapi.tiangolo.com/release-notes/), [버전 및 의존성 정책](https://fastapi.tiangolo.com/deployment/versions/), Kubernetes [probe 개념](https://kubernetes.io/docs/concepts/workloads/pods/probes/), OWASP [로그 관리](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), Python [logging](https://docs.python.org/3/library/logging.html)을 대조했다. 버전 회귀 검사의 옛 상수명 기대를 학습 코드의 `BROWSER_RUNNER_PIN`에 맞췄다.
- FastAPI 전용 회귀 12/12, 전체 `npm test` 232/232, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문 검사, `git diff --check`를 통과했다. W28–W30의 15개 학습 예제 Python AST 15/15. FastAPI 서버·Kubernetes·로그 수집기·HTTPX·DB 실행은 하지 않았고 새 서비스나 의존성도 추가하지 않았다. CQ-3 누적 82/115주·1,230/1,725문항, 전체 정밀 50.70%(표시 51%); 다음은 Next.js W1–W3이다.

### CQ-3 Next.js W1–W3 — 프레임워크·파일 경로·페이지와 레이아웃 (완료)

- 기존 문제는 15일 모두 “오늘 개념 이름을 답하기”와 거의 같은 템플릿을 사용해 URL, page/layout, 서버/브라우저 책임을 실제 사례로 구분하지 못했다. 15개 예제를 파일 경로, 명령 단계, 컴포넌트 코드, 배포 요구로 확장하고 각 날짜에 별도 목표를 적었다. 45문항을 각각 실제 요구·경로·상태를 묻는 상황형 객관식 또는 적용형 단답으로 다시 작성했으며 정답 위치를 a/b/c에 각각 5개씩 분산했다. 정적 학습기에 Next.js 서버를 추가하지 않았고, 의미가 달라진 문항은 `-v2` ID로 분리했다.
- Next.js 공식 [16.4 릴리스](https://nextjs.org/blog/next-16-4)와 [프로젝트 구조](https://nextjs.org/docs/app/getting-started/project-structure), [페이지와 레이아웃](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [링크와 탐색](https://nextjs.org/docs/app/getting-started/linking-and-navigating), [Server와 Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) 자료를 대조했다. 16.4의 create-next-app Cache Components 기본값은 메타데이터에 추가하고 실험 API 상태와 구분했다. `private folder`는 URL 생성을 피하는 파일 규칙이지 보안 접근 제어가 아님을 명시했다.
- Next.js 전용 회귀 4/4, 전체 `npm test` 233/233, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사, `git diff --check`를 통과했다. JSX/TSX 예제 구문 5/5. Next.js 서버·정적 export·브라우저 렌더는 실행하지 않았으며 이 과정의 예제는 코드 읽기용이다. CQ-3 누적 85/115주·1,275/1,725문항, 전체 정밀 51.09%(표시 51%); 다음은 Next.js W4–W6이다.

### CQ-3 Next.js W4–W6 — 링크·동적 경로·검색 URL 상태 (완료)

- W4–W6의 15개 예제를 날짜별 목표에 맞췄다. 내부 이동은 `Link`, 입력 경로는 allowlist와 개별 segment 인코딩, 뒤로 가기에는 직접 진입용 고정 Link 대안, 현재 경로에는 실제 활성 항목만 `aria-current="page"`, 외부 새 탭에는 `a`·rel·새 탭 안내를 사용한다. W5는 동적 segment 문자열, 현재 Promise `params`, 다중 segment, 일반/선택적 catch-all, 입력 형식·리소스 존재·인가 경계를 구분한다. W6는 Promise인 page `searchParams`와 plain object/중복 키 배열, URLSearchParams 직렬화, 공유 가능한 필터, query 수치 검증, URL의 비밀 정보 노출 위험을 다룬다.
- 세 주의 날짜별 목표를 구체화하고 45문항을 새 `-v2` ID로 작성했다. 매일 선택·개념 설명·새 상황 적용을 구분하고, 15개 객관식의 정답 위치를 a/b/c에 각각 5개씩 균형화했다. Next.js page `params`와 `searchParams`는 Promise이며 `searchParams` 값은 plain object의 string/string[] 형태라는 현재 계약을 반영했다. 실제 Next.js 서버나 navigation은 학습 사이트에서 실행하지 않는다.
- 공식 자료는 Next.js [16.4 릴리스](https://nextjs.org/blog/next-16-4), 당일 `latest` 태그로 공개된 Next.js 16.4.1 [npm 패키지](https://www.npmjs.com/package/next), 공식 [Link API](https://nextjs.org/docs/app/api-reference/components/link), [page API](https://nextjs.org/docs/app/api-reference/file-conventions/page), [dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router), [prefetching](https://nextjs.org/docs/app/guides/prefetching)를 대조했다. 당시 16.4.0에서 멈춰 있던 과정 버전 표기를 확인된 안정 최신판 16.4.1로 바꾸고 W23의 안정판 추적 예제도 갱신했다. 개별 API 계약은 패치 번호만으로 추정하지 않고 공식 문서에서 확인한다.
- Next.js 전용 회귀 5/5, 전체 `npm test` 234/234, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사, `git diff --check`를 통과했다. W4–W6의 실제 코드 형태로 작성된 TSX/JSX 예제 구문 12/12. Next.js 서버·브라우저 탐색·실제 HTTP 요청·정적 export는 실행하지 않았으며 이번 예제는 코드 읽기용이다. CQ-3 누적 88/115주·1,320/1,725문항, 전체 정밀 51.48%(표시 51%); 다음은 Next.js W7–W9이다.

### CQ-3 Next.js W7–W9 — 서버·클라이언트 경계와 데이터 전달 (완료)

- W7–W9의 15개 예제를 Server Component 기본 동작·서버 데이터·`server-only`·서버/클라이언트 합성, `use client` 지시문·state·이벤트·Effect·module graph, 직렬화 가능한 props·Server Function·최소 DTO·날짜 표현·hydration 초기값으로 나눴다. 45문항은 하루별 목표를 적용하는 선택·개념 설명·새 상황 질문으로 구성하고 정답 위치를 a/b/c에 각 5개씩 균형화했다. 민감 필드는 client payload가 만들어지기 전 서버 DTO에서 제외하며, 일반 함수와 명시적 `use server` 계약을 구분한다.
- Next.js 공식 [Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [서버·클라이언트 모듈 경계](https://nextjs.org/docs/app/guides/server-and-client-boundary), [`use client`](https://nextjs.org/docs/app/api-reference/directives/use-client), [데이터 보안·DTO·`server-only`](https://nextjs.org/docs/app/guides/data-security), React [Server Function과 직렬화 계약](https://react.dev/reference/rsc/use-server)을 대조했다. React 공식 도메인 출처를 Next.js 과정의 공식 교차 기술 출처 허용 목록에도 반영했다.
- Next.js 전용 회귀 6/6, W7–W9 TSX/JSX 구문 15/15, 전체 `npm test` 235/235, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문과 `git diff --check`를 통과했다. Next.js 앱·브라우저 렌더·hydration·Server Function 호출은 실행하지 않았으며 예제는 코드 읽기용이다. CQ-3 누적 91/115주·1,365/1,725문항, 전체 정밀 51.87%(표시 52%); 다음은 W10–W12다.

### CQ-3 Next.js W10–W12 — 데이터 요청·캐시·로딩·오류 경계 (완료)

- W10–W12의 15개 예제와 날짜별 목표를 실제 서버 데이터 흐름에 맞췄다. W10은 Server Component `fetch`, HTTP 오류는 `response.ok`로 직접 확인해야 하는 점, 같은 URL/options의 렌더 중 요청 메모이제이션과 지속 캐시를 분리했다. 독립 요청은 `Promise.all`로 병렬 시작할 수 있지만 하나가 거부되면 전체가 실패하는 점을 함께 다뤘다. Cache Components의 `use cache`·`cacheLife`와 이전 캐시 모델을 같은 설정처럼 섞지 않는다. W11은 route `loading.tsx`, `<Suspense>` 단위 로딩, `error.tsx` 오류 경계의 역할을 나누고, 스켈레톤이 실제 문서 콘텐츠나 접근성 상태를 대신하지 않음을 다뤘다. W12는 가장 가까운 client error boundary, Next.js 16.4.1의 `retry()`, 사용자에게 서버 내부 오류를 노출하지 않는 처리, `notFound()`의 스트리밍 전·후 상태 차이를 사례로 만들었다.
- 45문항은 하루별로 선택·개념 설명·새 상황 적용으로 구성하고 정답 위치를 a/b/c에 각 5개씩 균형화했다. 공식 문서는 Next.js [데이터 가져오기](https://nextjs.org/docs/app/getting-started/fetching-data), [`fetch` API](https://nextjs.org/docs/app/api-reference/functions/fetch), [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [Cache Components 없는 캐시 모델](https://nextjs.org/docs/app/guides/caching-without-cache-components), [`loading.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/loading), [`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error), [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found), React [Suspense](https://react.dev/reference/react/Suspense)다. 오류 경계의 재시도 계약은 16.4.1 현행 문서의 `retry()`를 기준으로 했다.
- Next.js 전용 회귀 7/7, W10–W12 TSX/JSX 구문 15/15, 전체 `npm test` 236/236, `npm run check:release` 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사 및 `git diff --check`를 통과했다. 예제는 TSX 문법 검증만 했으며 실제 Next.js 앱·HTTP fetch·서버 캐시·Suspense streaming·error boundary 동작은 실행하지 않았다. CQ-3 누적 94/115주·1,410/1,725문항, 전체 정밀 52.26%(표시 52%); 다음은 W13–W15다.

### CQ-3 Next.js W13–W15 — metadata·Route Handler·HTTP 계약 (완료)

- W13의 고정·동적 metadata, `metadataBase`·페이지별 canonical, 공개 Open Graph 정보, page와 metadata가 공유하는 fetch 범위를 15개 일일 예제와 15문항씩에 연결했다. W14는 화면 page와 HTTP endpoint, method export, status와 body, JSON parsing 뒤 schema 검증, 정적 export의 사전 생성 GET과 request-time 처리 한계를 분리했다. W15는 생성 201·Location, 본문 없는 204, runtime schema 검증, 제한된 cursor 페이지, POST 재시도와 앱 수준 멱등성, 공개 오류 envelope를 다뤘다.
- 45문항의 날짜별 선택·개념 설명·새 상황 적용을 검수하고 객관식 정답을 a/b/c 각각 5개로 균형화했다. 모든 수정 문항은 `-v2` ID를 써 과거 기록의 의미를 덮어쓰지 않았다. Next.js 공식 [`generateMetadata`와 metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Route Handler 파일 규칙](https://nextjs.org/docs/app/api-reference/file-conventions/route), [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend), [정적 export](https://nextjs.org/docs/app/guides/static-exports)와 HTTP [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)을 대조했다. 특히 `force-static` GET의 빌드 산출 가능성과 POST·요청별 cookie/header 동작에 필요한 서버 실행을 분리했다.
- W13–W15 배치 회귀 1/1, Next.js 품질 파일 9/9, 통합 콘텐츠 검사 40/40, 15개 TSX 구문, 전체 `npm test` 238/238, release audit 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 JS 문법 및 `git diff --check`를 통과했다. Next.js 앱·실 HTTP·정적 export 산출물·데이터 저장은 실행하지 않았다. CQ-3 누적 97/115주·1,455/1,725문항, 전체 정밀 52.65%(표시 53%); 다음은 W16–W18이다.

### CQ-3 Next.js W16–W18 — 폼·캐시 변경·요청 보안 (완료)

- W16의 Server Action 실행 경계, FormData·반복 입력 검증, action별 인증·자원 인가, `useActionState`·`useFormStatus`를 15개 예제·45문항에 맞췄다. W17은 필드 오류와 접근성 상태, optimistic UI와 실패 복귀, Server Action `updateTag`의 즉시 만료, `revalidatePath`와 `revalidateTag` 범위, 저장 뒤 갱신·redirect 순서를 다뤘다. W18은 비동기 `cookies()`·`headers()`, forwarded header 신뢰 경계, action 자체 권한 검사, `NEXT_PUBLIC_`와 secret 분리, 사용자별 데이터 공용 cache 노출 위험을 구체화했다.
- 새 문항 ID `-v2`, 객관식 정답 a/b/c 각 5개를 확인했다. 회귀 검증 중 W17 D1 예제에서 JSX 형제 요소가 한 루트 없이 나오는 문법 오류를 찾아 fragment로 감쌌다. 공식 Next.js [forms](https://nextjs.org/docs/app/guides/forms), [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath), [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies), [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers), [data security](https://nextjs.org/docs/app/guides/data-security)와 React [`useActionState`](https://react.dev/reference/react/useActionState), [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus), [`useOptimistic`](https://react.dev/reference/react/useOptimistic)를 대조했다.
- W16–W18 배치 회귀 1/1, Next.js 품질 파일 9/9, TSX 구문 15/15, 전체 `npm test` 238/238, release audit 98개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 JS 문법 및 `git diff --check`를 통과했다. Next.js 서버, 실제 Server Action·인증, 캐시 재검증, HTTP cookie/header, browser UI 동작은 실행하지 않았다. CQ-3 누적 100/115주·1,500/1,725문항, 전체 정밀 53.04%(표시 53%); 다음은 W19–W21이다.

### CQ-3 Next.js W19–W21 — 캐시·웹 보안·자산 경계 (완료)

- W19의 15개 예제와 45문항은 Cache Components 설정과 이전 캐시 모델의 구별, request-time `cookies()`를 cache scope 밖에서 읽는 방법, 공개 자료의 cacheLife/tag 정책, Server Action 전용 `updateTag`와 stale-while-revalidate `revalidateTag`, path와 tag 범위, 사용자별 기록 격리를 다룬다. W20은 React text child와 위험한 raw HTML sink, URL parser와 exact origin allowlist·userinfo 거부, Server Action의 Origin 보호와 action 내 인증·인가, nonce CSP의 동적 렌더 조건, 비밀값 없는 구조화 로그와 CR/LF 정제를 확인한다. W21은 정보/장식 이미지의 alt, 원격 이미지 remotePatterns 최소 허용, localFont 상대 경로·라이선스, fill 부모 레이아웃과 sizes, public 파일의 공개 범위를 다룬다.
- Next.js 공식 [이전 cache model](https://nextjs.org/docs/app/guides/caching-without-cache-components), [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), [Image](https://nextjs.org/docs/app/api-reference/components/image), [local fonts](https://nextjs.org/docs/app/getting-started/fonts), [CSP](https://nextjs.org/docs/app/guides/content-security-policy), [data security](https://nextjs.org/docs/app/guides/data-security) 및 OWASP [XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [redirect validation](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html), [logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)를 대조했다. 버전 문서상 Next.js 16.4.1을 기준으로 하며 `use cache`는 `cacheComponents` 설정 모델에서만 가르치고 이전 모델을 혼용하지 않는다.
- 배치 회귀 1/1, Next.js 품질 파일 10/10, 콘텐츠+Next.js 통합 검사 41/41, W19–W21 TSX 15/15, 전체 `npm test` 239/239, release audit 99개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사를 통과했다. 실제 Next.js 서버·Action·cache 재검증·브라우저 이미지 최적화/CSP 동작은 실행하지 않았다. 문항은 코드 읽기용으로 유지한다. CQ-3 누적 103/115주·1,545/1,725문항, 전체 정밀 53.43%(표시 53%); 다음은 W22–W24다.

### CQ-3 Next.js W22–W24 — 접근성·테스트 근거·측정 성능 (완료)

- W22는 main landmark와 제목 계층, label/id·도움말·오류 연결, `role="status"`와 적절한 초점 관리, `prefers-reduced-motion`과 보존되는 상태 텍스트를 다룬다. W23은 순수 함수 단위 검사, jsdom에서 접근성 역할과 사용자 이벤트를 확인하는 컴포넌트 검사, 실행 서버에 보내는 Route Handler 통합 요청, 브라우저 E2E, empty/loading/error/success 회귀 표를 분리했다. W24는 작은 Client Component 경계, 열기 동작 뒤 dynamic import, 화면 밖 이미지 lazy 로딩과 Next.js 16의 `preload` 이름, `useReportWebVitals`의 client·전송 경계, 같은 조건의 production-like 측정과 lab/field 증거 구분을 45문항·15개 예제로 연결했다.
- Next.js 공식 [접근성·제작 체크리스트](https://nextjs.org/docs/app/guides/production-checklist), [테스트 개요](https://nextjs.org/docs/app/guides/testing), [Jest 설정](https://nextjs.org/docs/app/guides/testing/jest), [`useReportWebVitals`](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals), [Image](https://nextjs.org/docs/app/api-reference/components/image), W3C WAI [폼 레이블](https://www.w3.org/WAI/tutorials/forms/labels/)·[status 알림 기법](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22), MDN [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), Testing Library [접근성 기반 쿼리](https://testing-library.com/docs/queries/about/), Node.js [test runner](https://nodejs.org/api/test.html), Playwright [재시도 assertion](https://playwright.dev/docs/test-assertions)를 확인했다. Next.js 공식 문서는 async Server Components의 unit test보다 E2E 권장을 명시하므로 두 증거를 섞지 않았다.
- 배치 회귀 1/1, Next.js 품질 파일 11/11, 콘텐츠+Next.js 통합 검사 42/42, W22–W24 TSX 구문 15/15, 전체 `npm test` 240/240, release audit 100개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 JS 구문 및 `git diff --check`를 통과했다. Next.js 서버·Jest/jsdom·실제 브라우저·Web Vitals field 수집은 실행하지 않았다. 예제는 코드 읽기 자료이며 실제 운영·수집 실행을 뜻하지 않는다. CQ-3 누적 106/115주·1,590/1,725문항, 전체 정밀 53.83%(표시 54%); 다음은 W25–W27이다.

### CQ-3 Next.js W25–W27 — React 경계·버전 호환성·오류 분류 (완료)

- W25의 15개 예제와 45문항은 Server Component에 데이터 조회를 두고 작은 Client Component에서 state/event를 처리하는 경계, Context Provider의 위치와 children 전달, Effect cleanup과 파생 상태 분리, browser `onClick`과 Server Action의 실행·인가 책임, lockfile에 고정된 Next/React 조합을 다룬다. W26은 확인 날짜·참조 안정판·lockfile resolved 버전 구별, 릴리스 개요와 API 안정성의 분리, Next.js 16 async params와 middleware→proxy 이전, deprecated `images.domains`의 `remotePatterns` 대체, integrity와 별도인 공급망·라이선스 검토를 다룬다. W27은 생성 `PageProps`와 `next typegen`, root layout build 오류, 없는 자료와 5xx 처리, 계정 간 개인 cache 재현, 비밀값을 제거한 최소 재현을 다룬다.
- Next.js 공식 [버전 16 업그레이드](https://nextjs.org/docs/app/guides/upgrading/version-16), [TypeScript·route helper](https://nextjs.org/docs/app/api-reference/config/typescript), [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [error boundary](https://nextjs.org/docs/app/api-reference/file-conventions/error), [`notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found)와 React [`useState`](https://react.dev/reference/react/useState), [`useContext`](https://react.dev/reference/react/useContext), [`useEffect`](https://react.dev/reference/react/useEffect), [`useActionState`](https://react.dev/reference/react/useActionState), [`useOptimistic`](https://react.dev/reference/react/useOptimistic)를 대조했다. Next.js 16에서 Promise params, middleware→proxy, `images.domains` deprecated 상태와 streaming 이후 HTTP 상태 제약을 구별했다.
- Next.js 품질 회귀 12/12, 콘텐츠+Next.js 검사 43/43, W25–W27 TSX 구문 15/15, 전체 `npm test` 241/241, `npm run check:release` (102개 파일·최대 9.621 MiB), `npm ls --depth=0`, 변경 JS 구문 및 `git diff --check`를 통과했다. Next.js 서버·빌드·browser·인증·실제 DB 통합은 실행하지 않았다. CQ-3 누적 109/115주·1,635/1,725문항, 전체 정밀 54.22%(표시 54%); 다음은 W28–W30이다.

### CQ-3 Next.js W28–W30 — 경로 검증·복구·저장소 경계 (완료)

- W28의 경로 테스트는 내부 이동·URL·뒤로 이동·직접 진입을 분리했다. W29는 오류 digest와 제한된 route context, 개인값을 제외한 관측, 일시 응답만 대상으로 하는 재시도 상한, `AbortController`의 browser 취소 범위, 예상 오류와 미처리 render 예외, 정적 host의 복구 한계를 예제·문항에 연결했다. W30은 server-only DAL과 최소 DTO, transaction의 all-or-nothing, 기존 row를 보존하는 nullable 추가·배포·backfill·검증·제약 강화 순서, 요청마다 대상 객체 권한 검사, 브라우저 진도와 수동 파일 백업의 차이를 다룬다.
- Next.js 공식 [오류 처리](https://nextjs.org/docs/app/getting-started/error-handling), [instrumentation](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation), [인증·DAL](https://nextjs.org/docs/app/guides/authentication), [정적 export](https://nextjs.org/docs/app/guides/static-exports), MDN [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), PostgreSQL 18 [transaction](https://www.postgresql.org/docs/18/tutorial-transactions.html)·[ALTER TABLE](https://www.postgresql.org/docs/18/ddl-alter.html), OWASP [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)를 대조했다. Next.js server/runtime 기능과 DB 실행이 없는 현재 제품 범위는 학습 예제에도 명시했다.
- 콘텐츠+Next.js 대상 검사 44/44, W28–W30 TSX 구문 15/15, 전체 `npm test` 242/242, `npm run check:release` 104개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JavaScript 구문과 `git diff --check`를 통과했다. 실제 Next 서버·Playwright 브라우저·PostgreSQL·인증 실행은 하지 않았다. CQ-3 누적 112/115주·1,680/1,725문항, 전체 정밀 54.61%(표시 55%); 다음은 W31–W33이다.

### CQ-3 Next.js W31–W33 — 정적 출시·종합 과정 (완료)

- W31은 `output: "export"` 산출물과 서버 runtime을 구별하고, request를 읽지 않는 GET Route Handler의 build-time 정적 생성 가능성과 request-dependent handler/Server Action의 미지원, `generateStaticParams()`의 사전 경로 집합, `useEffect` 이후 browser API 사용을 다룬다. W32는 `out/` 배포, 하위 경로 `basePath` 및 Link/Image 차이, 공개 환경변수의 browser bundle 노출과 build-time 고정, provider의 변경 가능한 무료 한도·약관 및 미리보기 검사를 다룬다. W33 capstone은 route·not-found·키보드·비동기 화면 상태, 정적 공개 강의와 browser-local 진도, 작은 Client Component, 검증 계획, 실행 증거/개념 예제/미지원 기능 구분으로 구성했다.
- Next.js 공식 [static exports](https://nextjs.org/docs/app/guides/static-exports), [environment variables](https://nextjs.org/docs/app/guides/environment-variables), [`basePath`](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath), [production checklist](https://nextjs.org/docs/app/guides/production-checklist)를 확인했다. 특히 정적 export의 GET 가능 여부는 HTTP method만으로 정하지 않고 Request·cookie 등 요청 시 값 사용 여부에 따라 설명했다. 공개 env 값이 bundle에 build-time inline된다는 점과 서버 비밀값을 client props로 넘기지 않는 점을 예제에 반영했다.
- W31–W33 전용·콘텐츠 검사 45/45, 정답 위치 A/B/C 각 5개, TSX 15/15, 전체 `npm test` 243/243, `npm run check:release` 106개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 및 `git diff --check`를 통과했다. Next.js 서버, 실제 provider preview, 공개 배포 경로는 실행하지 않았다. CQ-3 115/115주·1,725/1,725문항 완료; 전체 정밀 55.00%. 다음은 CQ-4 TypeScript W1–W3이다.

### CQ-4 TypeScript W1–W26·Kotlin/Android W1–W31·C#/.NET W1–W15 — 타입·플랫폼 과정 (진행 중)

- W1–W3의 45문항에서 값·주제만 바꾸어 재사용하던 예제, 날짜 목표와 맞지 않던 단서, any/unknown·nullish·타입 단언 경계의 부정확한 일반화를 확인했다. W4–W6에서는 T[]와 Array<T>, readonly 배열과 튜플, map 반환 타입, 객체 필수/선택·readonly 얕은 의미·중첩 구조·구조적 할당, 기본 유니온·리터럴·별칭·공통 속성을 각각 날짜별 코드로 연결했다. 선택 속성/readonly 설명이 서로 다른 개념을 합치거나 객체 오류에 다른 주차의 해설을 쓰던 결함도 제거했다.
- W1–W6 총 90문항 중 각 주차 15개 예제와 15개 코드 수정 답안을 작성 데이터에서 각각 엄격 타입 검사했다. 객관식 보기별 피드백·추적 정답·실제 결함 줄·수정 starter/solution을 테스트로 고정했고, W4–W6 정답 위치는 A/B/C 각 5개다. 의미가 달라진 문항에는 `-v2` ID를 발급해 기존 시도 기록을 보존했다.
- 버전 근거는 2026-10-15 확인한 TypeScript 7.0.2 안정판과, 7.0에서 컴파일러 API를 제거한 공식 안내를 기준으로 한다. 웹사이트의 로컬 TypeScript 6.0.3 어댑터는 구문 변환·실행을 제공할 뿐 정적 타입 진단을 제공하지 않는다. W1–W6 대상 TypeScript 예제는 개발 환경의 TypeScript 6.0.3로 엄격 검사했으며 이는 TypeScript 7 런타임/컴파일러 호환 검증이 아니다. [TypeScript 7.0 안내](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html), [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html), [Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html), [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)을 대조했다.
- W1–W3 회귀 7/7, W4–W6 대상 회귀 1/1, TypeScript 전용 파일 7/7, 전체 `npm test` 246/246, `npm run check:release` 108개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문과 `git diff --check`를 통과했다. 실제 TypeScript 7 컴파일러, 브라우저 UI와 추가 브라우저 조합은 실행하지 않았다. 비용 서비스·런타임 패키지·계정·DB·결제·공개 배포 변경은 없다.

#### TypeScript W7–W9 — 좁히기·판별 유니온·제네릭 입문 (완료)

- W7의 15개 예제는 typeof 기반 문자열/숫자 분기, `typeof null === "object"` 함정, `in` 속성 좁히기, 빈 문자열과 truthiness, null/undefined 비교를 분리했다. 빈 문자열을 null처럼 취급하는 결함은 실행 재현 회귀로 확인했다.
- W8의 15개 예제는 리터럴 판별 필드와 payload 연결, `if`/`switch` 좁히기, `never` 완전성 검사, 새 상태 추가 시 분기 갱신, 비동기 화면 상태를 다룬다. W9는 입력·배열 원소·반환 객체 사이의 T 관계, 호출 인자 추론, 명시 타입 인자와 다중 인자 타입 계약을 제네릭 제약/`keyof`에 앞서 소개한다.
- 기존 handbook의 Unions and Intersection Types 페이지가 대체 안내 상태인 것을 확인해 트랙 공식 출처를 현행 [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)으로 갱신했다. 제네릭 설명은 공식 [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), 타입 조회는 [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)를 대조했다. TypeScript 7.0.2/로컬 6.0.3 변환기 경계는 앞 묶음의 기준을 유지한다.
- W7–W9 전용 회귀 1/1, 오류 줄 14개 타입 진단 일치와 truthiness 결함 실행 재현, 15개 예제·15개 수리안 엄격 검사, 정답 위치 A/B/C 각 5개, 전체 `npm test` 247/247, release audit 109개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 검사를 통과했다. 다음 묶음은 TypeScript W10–W12다.

#### TypeScript W10–W12 — 제약·유틸리티·매핑/조건부 타입 (완료)

- W10은 제네릭 `extends`의 구조 제약, `keyof`의 키 이름, `T[K]`의 속성값 연결을 단계적으로 적용했다. 타입 제약이 실행 중 값을 검사하거나 변환하지 않는다는 점과 잘못된 키 진단을 분리했다.
- W11은 부분 업데이트의 `Partial`, 공개 필드 선택 `Pick`, 내부 필드 제외 `Omit`, 필수 속성 `Required`, 유한 키의 `Record`를 구체 객체로 연습했다. `Pick`/`Omit`은 타입 계약만 만들 뿐 실행 객체의 민감값을 제거하지 않는다는 사실을 예제와 검사에 포함했다.
- W12는 keyof 기반 매핑, 최상위 readonly 수정자, 조건부 타입의 true/false 선택, `infer`로 Promise 결과 타입을 읽기, bare T 유니온 분배를 구별했다. `string[] | number[]`와 `(string | number)[]`의 차이를 예제로 확인했다.
- TypeScript 공식 [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html), [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html), [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)를 대조했다.
- W10–W12 회귀 1/1, 정적 오류 줄 13개 검사, Pick/Omit 키 계약 확인, 예제·수리안 30개 엄격 검사, 정답 위치 A/B/C 각 5개, 전체 `npm test` 248/248, `npm run check:release` 110개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문 및 `git diff --check`를 통과했다. 전체 TypeScript W1–W12는 60개 예제와 60개 수리안의 엄격 타입 검사 및 출력 추적을 통과했다. TypeScript 7 컴파일러·브라우저 동작은 미검증이며 다음 묶음은 W13–W15다.

#### TypeScript W13–W15 — 모듈·비동기·클래스 경계 (완료)

- W13은 named/default export와 import 이름·문법, `moduleResolution`을 실행 host에 맞추는 기준, `target`과 `module`의 서로 다른 역할, `strict`의 정적 검사 경계를 다룬다. TypeScript 6.0에서 `classic` module resolution이 제거된 점은 공식 변경 안내와 대조했다.
- W14는 `Promise<T>`와 `await` 결과의 타입, async 반환값의 Promise 래핑, rejected Promise의 예외 흐름, `catch` 반환 계약, `Promise.all` 입력 순서와 튜플 위치를 구분한다.
- W15는 `implements`가 검사만 하고 구현을 만들지 않는 점, TypeScript `private`와 JavaScript `#private`, 얕은 `readonly`, 생성자 매개변수 속성, 합성과 상속의 관계를 예제로 확인한다.
- 이 사이트의 TypeScript 편집기는 단일 파일 변환·실행기이므로 W13의 서로 다른 파일 import/export는 일일 예제에 파일 경계 주석과 같은 계산을 확인하는 실행 가능한 동등 코드를 함께 표시한다. 잘못된 named/default import는 테스트에서 가상 파일을 구성해 TypeScript 6.0.3 모듈 해석으로 별도 진단했다. 이 결과는 사이트 편집기에서 다중 파일 프로젝트를 실행할 수 있다는 뜻이 아니다.
- TypeScript 공식 [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html), [Module Resolution](https://www.typescriptlang.org/docs/handbook/modules/reference.html), [TSConfig `moduleResolution`](https://www.typescriptlang.org/tsconfig/moduleResolution.html), [TypeScript 6.0 릴리스 노트](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html), [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)를 대조했다. `moduleResolution`은 TypeScript 해석기가 아니라 실제 Node.js/bundler의 경계에 맞춰야 한다는 공식 지침도 반영했다.
- W13–W15 전용 회귀 1/1, 가상 ESM 파일의 잘못된 import 진단 2건, 정적 결함 위치 13개, 예제·수리안 30개 엄격 타입 검사, 정답 위치 A/B/C 각 5개, 전체 TypeScript W1–W15의 예제 75개·수리안 75개 엄격 검사 및 출력 확인을 수행했다. 전체 `npm test` 249/249, `npm run check:release` 111개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 구문 검사와 `git diff --check`를 통과했다. TypeScript 7 컴파일, 제품 브라우저, 실제 다중 파일 프로젝트 실행은 미검증이다. 다음은 TypeScript W16–W18이다.

#### TypeScript W16–W18 — 좁히기·외부 입력·함수 호출 계약 (완료)

- W16의 15개 예제는 typeof, 배열 여부, `in` 속성 분기, 사용자 정의 type predicate, unknown 경계를 서로 다른 값 구조로 연습한다. Array.isArray가 배열 컨테이너를 구별해도 원소의 실제 값·스키마를 자동 검증하지 않는 점과, 명시적 `value is T` 함수의 true/false 주장을 구현자가 실제 조건으로 증명해야 하는 점을 다뤘다.
- W17은 unknown과 any의 정적 검사 차이, `as` 단언이 실행값을 변환하지 않는 사실, JSON 문법 parsing과 도메인 스키마 검증의 차이, 실행 시 필드/타입/범위를 검사하는 validator를 순서대로 가르친다. validator는 일부 필드만 확인한 뒤 전체 객체를 단언하지 않고 검증된 값만 새 객체로 반환한다.
- W18은 overload 선언 위치와 구현 호환성, overload 계약이 외부 호출에 보이는 방식, callback 문맥 타입 및 optional 매개변수의 호출 의미, `this` pseudo-parameter와 receiver 보존, union 인자로 인해 필요해지는 단순화 방법을 다룬다.
- TypeScript 공식 [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [TypeScript 4.9의 `in` 속성 좁히기](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html), [TypeScript 5.5의 type predicate 추론 및 명시적 predicate의 책임](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html), [Functions: overload·callback·this](https://www.typescriptlang.org/docs/handbook/2/functions.html)를 대조했다.
- W16–W18 회귀 1/1, 정적 타입 오류 줄 12개, 잘못된 predicate가 문자열의 `toFixed`를 실행해 실패하는 사례, `as number` 뒤에도 `typeof`가 string임을 보이는 사례를 실행 검증했다. 정답 위치 A/B/C 각 5개, 예제·수리안 30개 엄격 검사, 전체 W1–W18 예제 90개·수리안 90개 엄격 타입 검사 및 출력 추적을 수행했다. 전체 `npm test` 250/250, `npm run check:release` 112개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 구문 검사와 `git diff --check`를 통과했다. TypeScript 7/browser 동작은 미검증이다.

#### TypeScript W19–W21 — 선언·null 안전성·타입/실행 테스트 (완료)

- W19는 `declare`와 `.d.ts`가 외부 구현의 타입을 설명하지만 실행 함수를 만들거나 runtime 값을 검증하지 않는다는 경계를 다룬다. `allowJs`의 파일 포함, `checkJs`/`// @ts-check`의 정적 진단, JSDoc `@typedef`·`@param`, 패키지 타입 선언과 실제 JavaScript 실행 파일의 분리를 날짜별로 연습한다.
- W20은 `strict` 계열 설정과 `strictNullChecks`, 생략 가능한 속성, `find` 결과의 `undefined`, non-null `!` 단언의 컴파일 시간 의미, `||`와 `??`의 0 처리 차이를 다룬다. 정적 단언을 런타임 검사로 표현하지 않는다.
- W21은 `@ts-expect-error`의 기대 진단과 미사용 오류, 구현을 직접 호출하는 정상 테스트, 빈 목록 경계, 잘못된 외부 입력 거부, 이전 빈 배열 회귀 고정을 구분한다. 테스트 통과가 검사한 사례 범위에 한정된다는 설명을 넣었다.
- TypeScript 공식 [Declaration Files 소개](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html), [Modules `.d.ts` 양식](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html), [Declaration Consumption](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html), [Do’s and Don’ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html), [JavaScript 프로젝트와 TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html), [JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), [`checkJs`](https://www.typescriptlang.org/tsconfig/checkJs.html), [`strict`](https://www.typescriptlang.org/tsconfig/strict.html), [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/strictNullChecks.html), [TypeScript 3.9 `@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html)를 대조했다.
- W19–W21 대상 회귀는 객관식·해설·정답 위치 A/B/C 각 5개, 가상 JavaScript `checkJs` 진단, 미사용 `@ts-expect-error`의 TS2578, 구현 없는 선언의 실행 오류, non-null 단언·논리 기본값·빈 경계·NaN parser·회귀 테스트 사례를 확인한다. W1–W21의 TypeScript 예제와 수정 답은 엄격 타입 검사하고 W19 JavaScript/JSDoc 예제·수정 답은 `allowJs`·`checkJs`·`strict`로 별도 검사한다. 전체 예제 출력도 제품 TypeScript 변환 경계와 같은 방식으로 대조한다. 제품 편집기는 TypeScript 6.0.3으로 변환·실행하며 정적 타입 진단이나 다중 파일 패키지 실행을 제공하지 않는다. 전체 검사와 정적 출시 감사 결과는 아래 감사 이력에 기록한다. 다음은 W22–W24다.

#### Kotlin·Android W16–W18 — 제네릭·Java 경계·오류 모델 (완료)

- W16은 제네릭 함수의 타입 추론, 고정된 제네릭 클래스 계약, out 생산자와 in 소비자의 대입 방향, List<*> 읽기·쓰기 제약, 런타임 타입 소거를 출력 예제로 연결했다.
- W17은 어노테이션 없는 Java 반환의 platform type 위험, nullability 어노테이션과 별도 도메인 검증, Kotlin 2.4.0 기능 릴리스와 2.4.21 bug-fix 업데이트, context parameters의 안정 상태와 explicit context arguments의 실험 상태, collection literals의 opt-in과 listOf 대안을 구분했다.
- W18은 try/catch 결과와 finally 정리 경로, require와 check의 예외 구분, sealed 결과 타입과 완전한 when, runCatching의 Throwable 포착과 코루틴 취소 전파, 실패 원인별 재시도·멱등성 정책을 다뤘다.
- Kotlin 공식 [Generics](https://kotlinlang.org/docs/generics.html), [Java interoperability](https://kotlinlang.org/docs/java-interop.html), [Kotlin 2.4.0 변경 사항](https://kotlinlang.org/docs/whatsnew24.html), [릴리스 표](https://kotlinlang.org/docs/releases.html), [Exceptions](https://kotlinlang.org/docs/exceptions.html), [Result API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/), [runCatching API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/run-catching.html)를 대조했다.
- W16–W18의 새 예제 15개와 연결된 연습 45개를 전용 테스트에서 정답·오답 피드백·출력·예제 연결까지 확인했다. 코드 예제는 정적 코드 읽기 자료이며 로컬 Kotlin 컴파일러가 없어 실제 컴파일·실행하지 않았다. W1–W18은 31주 중 18주, 660/1,380문항을 CQ-4에서 검수했다.

#### Kotlin·Android W19–W21 — 코루틴·취소·Flow 상태 전달 (완료)

- W19은 suspend가 스레드 이동을 뜻하지 않는다는 경계, coroutineScope의 자식 완료, launch/Job과 async/Deferred의 반환 차이, await 예외 흐름, IO·Default dispatcher 선택을 날짜별 코드로 확인했다.
- W20은 부모 Job의 자식 취소 전파, CPU 반복의 협력 취소 검사, CancellationException 재전파, viewModelScope의 화면 수명과 process-death 보장 차이, timeout null과 정상 null의 구분을 검수했다.
- W21은 cold Flow의 collect 지연과 재수집, map/collect 역할, StateFlow의 현재값·중간 상태 conflation, SharedFlow replay 0의 late-subscriber 유실, Android lifecycle 수집과 upstream sharing scope의 분리를 설명했다.
- Kotlin 공식 [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html), [Coroutine context and dispatchers](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html), [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html), [Coroutine exception handling](https://kotlinlang.org/docs/exception-handling.html), [Flows](https://kotlinlang.org/docs/flow.html), [CoroutineScope API](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/), [launch](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html), [async](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html), [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/), Android [lifecycle-aware coroutines](https://developer.android.com/topic/libraries/architecture/coroutines)를 대조했다.
- W19–W21의 새 예제 15개·연결 연습 45개를 정답·오답 피드백·추적 출력·목표 연결 회귀로 확인했다. 로컬 Kotlin/Android 도구가 없어 예제 실행·기기 수명주기는 검증하지 않았고 제품의 Kotlin 실행 채점은 미지원이다. W1–W21은 31주 중 21주, 705/1,380문항을 CQ-4에서 검수했다.

#### Kotlin·Android W22–W24 — 코루틴 테스트·프로젝트·상태 보존 (완료)

- W22는 `runTest`가 제어하는 virtual time, `StandardTestDispatcher`의 예약 실행, advanceTimeBy/runCurrent 경계, 전역 `Dispatchers.setMain` 교체/복원, finite Flow 전체 수집과 무한 hot Flow 종료 조건을 테스트 예제로 연결했다. `Dispatchers.IO/Default`의 delay가 기본 test scheduler에 자동 포함되지 않는 점과 테스트 전용 `kotlinx-coroutines-test` 경계를 구분했다.
- W23은 Gradle module/source set 경로, Manifest 구성요소 및 exported 접근 경계, compileSdk/minSdk/targetSdk의 구별, API 37 개별 API 가용성 확인, build/unit/device 테스트 증거를 다룬다. Manifest 문자열 예제는 text 포함 여부만 검사하며 실제 manifest merger·APK·기기를 검증하는 것으로 표현하지 않았다.
- Android 12/API 31 이상을 대상으로 하는 앱에서는 intent-filter가 있는 Activity·service·receiver에 `android:exported`를 명시해야 한다. launcher 진입점은 external entry가 필요할 수 있지만 내부 전용 component를 일괄 공개하지 않도록 정답·오답 설명에 이 차이를 넣었다. 공식 [Intents and intent filters](https://developer.android.com/guide/components/intents-filters) 및 [App manifest overview](https://developer.android.com/guide/topics/manifest/manifest-intro.html)를 대조했다.
- W24는 Activity lifecycle과 구성 변경 재생성, Activity 필드·ViewModel·SavedStateHandle·로컬 영속 저장소의 서로 다른 수명을 코드 추적으로 비교했다. ViewModel은 메모리에서 구성 변경을 지원하지만 process death 이후 생존하지 않고, saved state는 작은 복원 상태, 큰 도메인 데이터는 적절한 저장소에서 읽는다는 기준을 명시했다.
- Kotlin 공식 [`kotlinx-coroutines-test` 1.11.0](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/), [`runTest`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/run-test.html), [`Dispatchers.setMain`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/kotlinx.coroutines.test/set-main.html) 및 Android [Projects](https://developer.android.com/studio/projects/), [Build configuration](https://developer.android.com/build), [Manifest uses-sdk](https://developer.android.com/guide/topics/manifest/uses-sdk-element.html), [Activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle), [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel), [Save UI states](https://developer.android.com/topic/libraries/architecture/saving-states), [Architecture recommendations](https://developer.android.com/topic/architecture/recommendations), [Android 17](https://developer.android.com/about/versions/17)를 대조했다.
- W22–W24의 새 예제 15개·연결 연습 45개는 목표/예제 연결, 정답·오답 설명, 코드 추적 답, 보기의 정답 위치 균형을 전용 회귀 10/10으로 검증했다. 전체 `npm test` 263/263, release audit 123개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 4개 변경 JS 파일 구문 및 `git diff --check`가 통과했다. Kotlin/Android SDK·에뮬레이터가 없어 Kotlin compile·Android build/lifecycle 동작은 실행 검증하지 않았다. W1–W24는 31주 중 24주, 750/1,380문항을 CQ-4에서 검수했다.

#### Kotlin·Android W25–W27 — Compose UI·상태·적응형 화면 (완료)

- 선언형 Composable·recomposition·Modifier 순서·LaunchedEffect key/취소, remember/rememberSaveable·state hoisting·단방향 event/state, LazyColumn key·Navigation 인자·adaptive window/pane을 15개 날짜별 예제와 45문항에 연결했다. 화면 흐름은 정적으로 추적하며 실제 Compose render 결과인 것처럼 표현하지 않는다.
- Android 공식 [Thinking in Compose](https://developer.android.com/develop/ui/compose/mental-model), [State](https://developer.android.com/develop/ui/compose/state), [Side effects](https://developer.android.com/develop/ui/compose/side-effects), [Modifiers](https://developer.android.com/develop/ui/compose/modifiers), [Lazy lists](https://developer.android.com/develop/ui/compose/lists), [Navigation](https://developer.android.com/guide/navigation), [Adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive)를 대조했다. Type-safe route 사례는 호환 Navigation Compose·Kotlin serialization 설정 전제를 밝힌다.
- 전용 Kotlin 회귀 11/11, 전체 `npm test` 264/264, release audit 124개 파일·최대 9.621 MiB, 의존성·JS 구문·diff 검사를 통과했다. Android SDK·Kotlin compiler·emulator가 없어 실제 build·render·기기 동작은 미검증이다.

#### Kotlin·Android W28–W30 — 데이터·접근성·보안·성능 (완료)

- W28은 Repository/source-of-truth·Room/DataStore 역할·Flow/read/write 경계·offline stale/error 구분·WorkManager 사용 조건을 학습 앱 흐름으로 만들었다. W29는 Compose semantics와 접근성 검사, 48×48 dp 터치 대상, 최소 runtime permission, APK 역분석 가능한 내장 API key 위험, Android 17(API 37)의 `ACCESS_LOCAL_NETWORK` 및 privacy-preserving picker 대안을 연결했다. W30은 측정 기반 성능·Compose/Room 테스트 계층·targetSdk별 behavior·API/device matrix·release evidence 경계를 다룬다.
- Android 공식 [architecture recommendations](https://developer.android.com/topic/architecture/recommendations), [data layer](https://developer.android.com/topic/architecture/data-layer), [Compose accessibility](https://developer.android.com/develop/ui/compose/accessibility), [accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults), [runtime permissions](https://developer.android.com/training/permissions/requesting), [security checklist](https://developer.android.com/privacy-and-security/security-tips), [Android 17 behavior changes](https://developer.android.com/about/versions/17/behavior-changes-17), [Macrobenchmark](https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview), [testing fundamentals](https://developer.android.com/training/testing/fundamentals)를 대조했다. Android 17의 LAN 권한은 앱이 API 37 이상을 target하는 조건과 system picker 대안을 문항에 명시했다.
- 15개 새 예제·45문항은 목표/예제 일치, trace 답, 객관식 정답·오답 피드백과 정답 위치를 검사했다. W28–W30 Kotlin 품질 검사 포함 전체 suite 266/266, release audit 126개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문, `git diff --check`를 통과했다. SDK·compiler·기기가 없어 DB migration·접근성 화면·permission prompt·benchmark·release build는 실행하지 않았다.

#### Kotlin·Android W31 — 학습 기록 앱 설계 캡스톤 (완료)

- offline progress 저장/재시작 복원 acceptance criteria, sealed Loading/Empty/Content/Error 상태, UI→ViewModel→Repository→Room 및 관찰 state 흐름, acceptance criteria와 unit/Compose/Room/device test 매핑, 정적 검토·미실행 build/device 항목을 보고하는 종합 캡스톤 5개 예제·15문항을 검수했다.
- Kotlin 전용 품질 검사 13/13에서 캡스톤 다섯 날짜의 예제·목표 연결, trace 정답, 객관식 채점·오답 피드백, ID 고유성·정답 위치 분산과 실행 범위 문구를 확인했다. 전체 `npm test` 266/266, `npm run check:release` 126개 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 JS 구문, `git diff --check`를 통과했다.
- Kotlin/Android는 31/31주·465/465문항을 CQ-4에서 검수했다. Kotlin compiler·Android SDK·emulator는 설치돼 있지 않아 APK build·Compose/device·Room process-restart test는 미실행이며, 학습 트랙도 이 코드를 실제 실행하거나 채점하지 않는다. CQ-4는 57/92주·855/1,380문항, 전체 감사 정밀 진척은 64.29%(표시 64%)다. 다음 순서는 C#·.NET W1–W3다.

#### C#·.NET W1–W3 — 언어/플랫폼·프로젝트·기초 값 (완료)

- W1은 C# 언어와 .NET 플랫폼 경계, `TargetFramework` 프로젝트 설정, 단일 진입점과 명령줄 인자, C# 14·.NET 10의 file-based app과 SDK 필요성, 개념 검토·build·실행 증거를 구분했다. W2는 명시 타입·`var`의 정적 추론·대입/비교·`const`와 실행 설정·값 타입과 참조 복사를 서로 다른 코드 결과로 추적한다. W3는 `checked`/`unchecked` 정수 경계, 넓은 타입 변환 순서, `char`/UTF-16 code unit과 grapheme 차이, 보간식 부수 효과, `decimal` 금액과 표시·반올림 경계를 검수했다.
- C# 공식 [프로그램 구조](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/), [top-level statements와 진입점](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/top-level-statements), [C# 14 새 기능](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14), [정수형 범위](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/integral-numeric-types), [checked/unchecked](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/checked-and-unchecked)와 .NET 공식 [10.0.13 릴리스 노트](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.13/10.0.13.md)를 대조했다. C# 14는 .NET 10에서 지원되는 최신 안정 언어이고 .NET 10.0.13은 2026-10-13 배포된 LTS 서비스 패치다.
- 전용 C# 회귀 3/3, 전체 `npm test` 267/267을 통과했다. 15개 예제의 목표·코드 연결, 45문항의 정답·trace 답·오답별 피드백, 새 ID, 답 위치 분산을 확인했다. 후속 통합 배치에서 로컬 .NET SDK 10.0.400·runtime 10.0.11로 12개 코드 스니펫과 별도 명시적 Main 프로젝트를 빌드·실행 확인했다. `net10.0` 대상의 file-based app은 필요한 ILCompiler/runtime 패키지가 로컬에 없어 오프라인 restore가 실패했다. 이 증거는 로컬 10.0.11의 일부 예제 검증이며 10.0.13 패치 호환성이나 사이트의 C# 실행 기능을 뜻하지 않는다. CQ-4는 당시 60/92주·900/1,380문항, 전체 진척은 64.78%(표시 65%)였다. 다음 배치는 C#·.NET W4–W6이다.

#### C#·.NET W4–W6 — 조건·반복·메서드 계약 (완료)

- 기존 자동 생성 문항은 연산자나 키워드 이름만 회상하고 입력 경계·분기 순서·호출자 결과를 추적하지 못했다. 비교식과 60점 경계, `&&` 단락 가드, `if/else if` 우선순위, 값 선택 `switch` 식·누락 팔, 타입 패턴과 별도 업무 검증, `for` 경계, `foreach` 변수, `while` 종료, `break`/`continue`, 배열 범위, 메서드 반환·`void`, 참조형 값 전달, 선택·이름 있는 인자를 15개 예제와 45개 상황형 문항으로 다시 구성했다.
- 각 날짜는 예제 결과 추적 단답 1개, 규칙 적용 객관식 1개, 실무 영향 객관식 1개로 분리했다. W4–W6 기존 문제 기록을 보존하도록 새 `-v2` ID를 발급하고 각 오답 설명과 선택 위치 분산을 검사했다. 사이트 과정 자체는 계속 정적 코드 읽기·설계 연습이며 컴파일·앱 실행·결과 채점을 제공하지 않는다.
- Microsoft 공식 [selection statements](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements), [switch expression 비완전 입력](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/switch-expression), [pattern matching](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/patterns/pattern-matching), [iteration statements](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/iteration-statements), [named and optional arguments](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments), [method parameter passing](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/passing-reference-type-parameters)를 대조했다. switch 식이 비완전하면 컴파일러가 경고할 수 있고 일치 팔이 없는 실행에서는 예외가 날 수 있음을 명시했다.
- C# 전용 회귀 4/4, 통합 콘텐츠·C# 검사 35/35 통과. 로컬 SDK 10.0.400·runtime 10.0.11의 `net10.0` 격리 프로젝트에서 W4–W6 예제 15개를 포함한 전체 검수 스니펫 27개를 빌드(경고·오류 0)하고 실행해 출력과 추적 답을 대조했다. 이 검증은 최신 .NET 10.0.13 runtime에서의 실행이나 브라우저 제품 지원을 인증하지 않는다.
- CQ-4는 63/92주·945/1,380문항이다. 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 63/92 = 65.27%`이며 표시값은 65%다. 다음 배치는 C#·.NET W7–W9다.

#### C#·.NET W7–W9 — 컬렉션·LINQ·널 안전성 (완료)

- 배열의 고정 길이, List의 순서·중복, Dictionary 키 충돌 정책, HashSet 고유성·열거 순서, Queue/FIFO와 Stack/LIFO를 입력·결과로 비교했다. LINQ Where/Select/OrderBy/GroupBy가 만드는 결과 형태와 지연 실행·재열거 시점을 일별로 분리했다. nullable reference annotations와 nullable-aware context, `?.`의 nullable 반환, `??`/`??=`의 null 전용 동작, `ThrowIfNull` runtime 경계 검증을 구분해 15개 예제·45문항을 구성했다.
- 기존 기록을 유지하려고 새 `-v2` 문제 ID를 사용했다. Microsoft 공식 [collections](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/collections), [.NET collection selection](https://learn.microsoft.com/en-us/dotnet/standard/collections/selecting-a-collection-class), [LINQ standard query operators](https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/), [nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/nullable-reference-types), [null-conditional operators](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-conditional-operators), [null-coalescing operators](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator), [.NET 10 `ThrowIfNull`](https://learn.microsoft.com/en-us/dotnet/api/system.argumentnullexception.throwifnull?view=net-10.0)를 대조했다. HashSet 열거 순서를 표시 계약으로 쓰지 않고, LINQ 조회 결과는 원본 수정과 구분했으며, nullable annotation 자체가 runtime validation이 아님을 명시했다.
- C# 전용 회귀 5/5, 통합 콘텐츠·C# 36/36, 전체 `npm test` 269/269, release audit 129개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 구문 검사 통과. 로컬 SDK 10.0.400·runtime 10.0.11의 격리된 `net10.0` 프로젝트에서 W1–W9의 42개 검수 스니펫을 빌드(경고·오류 0)하고 출력과 trace 답을 확인했다. file-based app restore 및 .NET 10.0.13 runtime은 미검증이며 제품은 여전히 C#을 실행하지 않는다.
- CQ-4는 66/92주·990/1,380문항이다. 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 66/92 = 65.76%`이며 표시값은 66%다. 다음 배치는 C#·.NET W10–W12다.

#### C#·.NET W10–W12 — 레코드·캡슐화·객체 설계 (완료)

- `record class`의 값 기반 동등성과 참조 동일성, `record struct`의 값 복사, `with`의 얕은 복사와 중첩 배열 공유, 응답 DTO의 공개 계약 경계, `init` 프로퍼티와 참조된 가변 목록을 15개 출력 추적 예제로 다뤘다.
- 생성자 초기 검증과 후속 변경 불변식, `private set`, C# 14 `field` 백킹 프로퍼티의 setter 정규화, 접근 한정자와 비밀 저장의 차이, 잔액 변경 경로 검증을 연결했다. 인터페이스의 계약 한계, 동일 계약의 대체 구현, 기반 클래스 대체 가능성, 수동 구성과 생성자 주입, SRP의 변경 이유 기준을 정적 코드 사례로 구성해 45문항을 갱신했다.
- 공식 Microsoft [records](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record), [constructors](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/using-constructors), [properties](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/using-properties), [access modifiers](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers), [inheritance and interfaces](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance), [is-a and can-do](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/inheritance)를 대조했다. C# 14 field-backed property가 최신 C# 14 문법이라는 점은 .NET 10 대상 프로젝트에서 컴파일해 확인했다.
- 전용 C# 회귀 6/6, C#+공통 콘텐츠 37/37을 통과했다. SDK 10.0.400/runtime 10.0.11의 오프라인 `net10.0` 프로젝트에서 W1–W12 예제 57개를 빌드하고 실행해 trace 출력을 대조했다(경고·오류 0). 이는 runtime 10.0.11에서의 스니펫 검증이며 .NET 10.0.13 runtime·file-based app restore·브라우저 제품 실행을 확인하지 않는다.
- CQ-4는 69/92주·1,035/1,380문항이다. 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 69/92 = 66.25%`이며 표시값은 66%다. 다음 배치는 C#·.NET W13–W15다.

#### C#·.NET W13–W15 — 제네릭·이벤트·예외 흐름 (완료)

- 제네릭 메서드의 타입 추론, `IComparable<T>` 제약의 실제 한계, `IReadOnlyList<T>`의 별칭 변경, `IEnumerable<out T>` 공변 읽기와 `List<T>` 불변 쓰기 안전성을 15개 출력 추적 사례로 연결했다.
- `Func`/`Action` 반환 계약, 람다 캡처와 동시성, event 발행 경계, 중복 handler 구독·부분 해제를 실제 invocation 횟수로 확인한다. 파생 예외 catch 순서·finally 정리·`TryParse` 입력 실패·InnerException 원인 보존·민감 예외의 안전한 사용자 응답을 45문항으로 갱신했다.
- 공식 Microsoft [generics and variance](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics), [generic constraints](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters), [lambda expressions](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions), [events](https://learn.microsoft.com/en-us/dotnet/csharp/events-overview), [exception statements](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/exception-handling-statements), [.NET exception best practices](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)를 대조했다.
- C# 전용 회귀 7/7, C#+공통 콘텐츠 38/38을 통과했다. SDK 10.0.400/runtime 10.0.11의 오프라인 `net10.0` 프로젝트에서 W1–W15 예제 72개를 빌드·실행해 trace 답을 확인했다(경고·오류 0). 이 증거는 runtime 10.0.11의 스니펫에 한정되며 제품 C# 실행, .NET 10.0.13 runtime, 외부 파일·HTTP 동작은 검증하지 않았다.
- CQ-4는 당시 72/92주·1,080/1,380문항이었다. 배치별 최신 값은 아래 기록을 따른다.

#### C#·.NET W19–W21 — 테스트·프로젝트 재현성·호스트 조립 (완료)

- W19에서 단위 계약과 외부 경계의 차이, 빈 입력·null 경계, 회귀 사례, 고정 clock 대역, 테스트 범위의 증거를 5일 사례와 15문항으로 연결했다.
- W20에서 SDK와 runtime, solution과 project, restore/build/test 순서, 선언된 패키지와 lock graph, patch 비교를 실제 출력과 선택 기준으로 구성했다. SDK 버전만으로 runtime patch가 자동 결정된다고 오해하지 않도록 분리했다.
- W21에서 Generic Host의 조립/수명 책임, 인터페이스 DI, Singleton/Scoped/Transient reference 비교, provider 우선순위, 비밀값을 노출하지 않는 관측을 가르친다. scope 수명 예제에 필요한 probe 타입 선언을 빠뜨린 것이 로컬 컴파일에서 드러나 예제에 완결된 타입 선언을 추가했다.
- 공식 Microsoft [unit testing](https://learn.microsoft.com/en-us/dotnet/core/testing/), [xUnit tutorial](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit), [integration testing](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0), [SDK version detection](https://learn.microsoft.com/en-us/dotnet/core/install/how-to-detect-installed-versions), [`dotnet restore`](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-restore), [package lock files](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files), [Generic Host](https://learn.microsoft.com/en-us/dotnet/core/extensions/generic-host), [DI usage](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/usage), [service lifetimes](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes), [configuration](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers), [options](https://learn.microsoft.com/en-us/dotnet/core/extensions/options)를 대조했다.
- 전용 C#·통합 콘텐츠 검사를 통과했고 전체 `npm test` 273/273, release audit 132개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사를 통과했다. SDK 10.0.400/runtime 10.0.11의 오프라인 net10.0 harness에서 W1–W21 예제 102개를 빌드(경고·오류 0)하고 W19–W21 출력 15/15를 정답과 대조했다. .NET 10.0.13 runtime, 실제 host/network/config secret store, 제품 내 C# 실행은 검증하지 않았으며 사이트는 C# 실행 채점을 제공하지 않는다.
- CQ-4는 78/92주·1,170/1,380문항이다. 당시 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 78/92 = 67.72%`였고 다음 배치는 W22–W24였다.

#### C#·.NET W22–W24 — 관측성·ASP.NET Core API·HTTP 계약 (완료)

- W22는 구조화 로그의 template/속성, 최소 로그 수준, 민감값 제외, `Meter`·`Activity`의 관측 범위, 내부 예외와 외부 오류 응답을 15개 추적 예제·45문항으로 연결했다. Problem Details 표준 형식은 RFC 9457 출처를 연결하되 응답에 내부 stack·경로를 노출하지 않는 원칙을 유지했다.
- W23은 Minimal API route 등록과 metadata, 요청 pipeline 순서, route constraint의 형식 경계, DI 등록, JSON body binding과 업무 검증의 차이를 확인한다. ASP.NET 앱은 metadata를 구성·읽는 코드 예제일 뿐 실제 서버나 네트워크 요청을 실행하지 않는다.
- W24는 HTTP method의 안전성·멱등성, 요청 검증 오류, 404와 403, OpenAPI endpoint metadata, nullable 응답 변경 호환을 검수했다. POST 멱등성을 단정하지 않고 애플리케이션 계약에서 보장하는지로 설명했다. OpenAPI metadata 검사도 문서 JSON 생성·UI 제공을 주장하지 않는다.
- Microsoft 공식 [logging](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging/overview), [OpenTelemetry observability](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel), [data redaction](https://learn.microsoft.com/en-us/dotnet/core/extensions/data-redaction), ASP.NET Core 10의 [middleware](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-10.0), [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0), [parameter binding](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding?view=aspnetcore-10.0), [API error handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0), [validation](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/validation?view=aspnetcore-10.0), [OpenAPI overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0), [HTTP semantics RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [Problem Details RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html)를 대조했다.
- W22–W24 전용 회귀·통합 콘텐츠 검사, 전체 `npm test` 274/274, release audit 133개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 JavaScript 구문 검사, `git diff --check`를 통과했다. SDK 10.0.400/runtime 10.0.11의 오프라인 `net10.0` harness에서 W1–W24 예제 117개를 빌드(경고·오류 0)하고 W22–W24 결과 15/15를 대조했다. 제품은 C#이나 ASP.NET API를 실행·채점하지 않으며 실제 HTTP·인증 서버·DB·OpenAPI 문서/UI도 실행하지 않았다.
- CQ-4는 81/92주·1,215/1,380문항이다. 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 81/92 = 68.21%`이며 표시값은 68%다. 다음 배치는 C#·.NET W25–W27이다.

#### C#·.NET W25–W27 — EF Core·보안 경계·측정 기반 성능 (완료)

- W25는 entity/DTO 공개 필드와 저장 모델을 구분하고, `IQueryable` 구성과 실행 시점, tracking/no-tracking, N+1 topology, `SaveChanges` 및 여러 호출의 transaction 경계를 다룬다. EF Core 10.0은 .NET 10 대상 LTS이며, 2026-10-16 Microsoft release plan은 EF Core 11 안정판을 2026년 11월 예정으로 표시해 10.0 안정판과 분리했다. 정확한 10.0.x patch는 새 프로젝트에서 공식 릴리스 정보를 재확인하도록 안내한다.
- W26은 identity 인증과 resource 권한을 분리하고 최소 권한, 입력형식과 ownership, credential 최소 로깅, 401/403과 존재를 숨길 때의 정책적 404를 판단한다. 404 숨김은 모든 API에 강제되는 규칙이 아니라 자원 공개 정책에 따라 일관되게 택하는 선택으로 설명한다.
- W27은 측정 전 추측 최적화를 경계하고 tenant/locale을 보존하는 cache key, 무효화와 다중 프로세스의 stale 범위, `ReadOnlySpan<char>` 수명/복사 경계, request/deadline 취소 전파를 다룬다. 예제의 성능 수치는 명시적으로 가상 입력이며 프로파일 결과라고 표시하지 않는다.
- Microsoft 공식 [EF Core releases and planning](https://learn.microsoft.com/en-us/ef/core/what-is-new/), [efficient querying](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying), [tracking](https://learn.microsoft.com/en-us/ef/core/querying/tracking), [single/split queries](https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries), [transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions), ASP.NET Core 10 [authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-10.0), [policy authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-10.0), [resource authorization](https://learn.microsoft.com/en-us/aspnet/core/mvc/security/authorization/resource-based?view=aspnetcore-10.0), [antiforgery](https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-10.0), .NET [caching](https://learn.microsoft.com/en-us/dotnet/core/extensions/caching)·ASP.NET Core 10 [HybridCache](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid?view=aspnetcore-10.0), [profiling](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/profilers), [Span performance guidance](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/performance/), [Memory/Span usage](https://learn.microsoft.com/en-us/dotnet/standard/memory-and-spans/memory-t-usage-guidelines)를 대조했다.
- 전용 C# 회귀 11/11, 전체 `npm test` 275/275, release audit 134개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 5개 변경 JavaScript 파일 구문 검사, `git diff --check`를 통과했다. SDK 10.0.400/runtime 10.0.11 offline `net10.0` harness에서 W1–W27 예제 132개를 빌드(경고·오류 0)하고 W16–W18, W19–W21, W22–W24, W25–W27 trace 출력 각각 15/15를 정답과 대조했다. EF API/SQL translation·실제 DB transaction, ASP.NET server/auth/HTTP, HybridCache 분산 동작과 실제 성능 개선은 실행하지 않았다. 이 사이트는 C# 실행 채점을 제공하지 않는다.
- CQ-4는 84/92주·1,260/1,380문항이다. 전체 가중 진척은 `10% + 10% + 20% + 15% + 15% × 84/92 = 68.70%`이며 표시값은 69%다. 다음 배치는 C#·.NET W28–W30이다.

#### C#·.NET W28–W30 — 동시성·운영·계층 설계 (완료)

- W28은 `IAsyncEnumerable<T>`의 지연 소비·열거 취소, 다중 필드 불변식을 보호하는 동기 `lock` 범위, `ConcurrentDictionary.GetOrAdd` factory의 경합 시 중복 호출, .NET 10 `BackgroundService.ExecuteAsync`의 시작 스레드 변경과 stopping token, 제한된 재시도와 idempotency를 다뤘다. snippet은 분산 취소·외부 부수 효과·실제 Host를 실행하지 않는다고 명시한다.
- W29는 provider 후순위 우선권과 `__` 환경 변수 키, liveness/readiness와 restart loop, 제한된 graceful drain, SDK build image와 ASP.NET runtime image·secret 분리, 이전 코드 rollback을 지원하는 expand-contract schema 순서를 판단한다. 컨테이너 이미지·운영 probe·실제 DB migration은 생성하거나 실행하지 않는다.
- W30은 관찰 가능한 Given/When/Then 수용 기준, stable ID와 진도 domain invariant, application service의 authorization/domain/repository 조정 및 HTTP 표현 분리, in-memory repository fake의 영속성 한계, 로딩·빈 상태·성공·실패 각각의 다음 행동을 연결했다.
- Microsoft 공식 [async streams and cancellation](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/generate-consume-asynchronous-stream), [thread-safe collections](https://learn.microsoft.com/en-us/dotnet/standard/collections/thread-safe/), [`ConcurrentDictionary.GetOrAdd`](https://learn.microsoft.com/en-us/dotnet/api/system.collections.concurrent.concurrentdictionary-2.getoradd), [.NET 10 BackgroundService behavior](https://learn.microsoft.com/en-us/dotnet/core/compatibility/extensions/10.0/backgroundservice-executeasync-task), [hosted service lifecycle](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-10.0), [HTTP resilience](https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience), [configuration precedence](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers), [health probes](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-10.0), [container images](https://learn.microsoft.com/en-us/dotnet/core/docker/container-images), [.NET architecture](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)를 대조했다.
- C# 전용 회귀 12/12, 전체 `npm test` 276/276, release audit 135개 정적 파일·최대 9.621 MiB를 통과했다. SDK 10.0.400/runtime 10.0.11 오프라인 net10.0 harness에서 W1–W30 예제 147개를 빌드(경고·오류 0)하고 W16–W30의 75개 최신 추적 출력이 답안과 일치함을 확인했다. `dotnet --info`에는 설치 프로그램 메타데이터 초기화 오류가 출력됐으나 설치된 SDK/runtime 정보와 독립 `dotnet build`는 정상 확인됐다. 실제 ASP.NET Host, HTTP, Docker, probe, DB migration/rollback 및 제품 내 C# 실행 채점은 확인하지 않았다.
- CQ-4는 87/92주·1,305/1,380문항이며 전체 진척은 `10% + 10% + 20% + 15% + 15% × 87/92 = 69.18%`(표시 69%)다. 다음 배치는 C#·.NET W31–W33이다.

#### C#·.NET W31–W33 — 코드 리뷰·요구 계약·캡스톤 검증 (완료)

- W31은 기능 변경 diff의 범위·응답 필드 호환·nullable annotation 변경 영향·상태 불변식·검증 보고의 증거 수준을 검수한다. 코드 검토, build, host 실행을 하나의 완료 주장으로 합치지 않는다.
- W32는 학습 기록의 성공/재진입/저장 실패 사용자 흐름, ID와 답안 경계 검증, 공개 response DTO, 400/401/403/409 오류 계약, 정적 설계와 실제 ASP.NET/DB 실행을 분리한다.
- W33은 HTTP adapter·application/domain policy·storage의 책임, 비동기 저장에 취소 전파와 durability 한계, 정상/부재/권한/중복 단위 사례, fake 통합과 실제 provider 차이, 자원 조회·수정 전 ownership 검사로 캡스톤을 이어 간다.
- Microsoft 공식 [.NET architectural principles](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles), [.NET unit testing best practices](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices), [ASP.NET Core 10 integration tests](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0), [API error handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0), [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html)를 대조했다.
- C# 회귀 13/13, 전체 `npm test` 277/277, release audit 136개 정적 파일·최대 9.621 MiB를 통과했다. SDK 10.0.400/runtime 10.0.11 offline `net10.0` harness에서 W1–W33의 162개 snippet이 경고·오류 없이 빌드됐고 W16–W33 출력 trace 90/90이 기대 답과 일치했다. 이는 snippet의 로컬 컴파일·계산 근거이며 사이트 내 C# 실행, ASP.NET server, 실제 database, 사용자 API 운영 검증이 아니다.
- CQ-4는 90/92주·1,350/1,380문항이고 전체는 `10% + 10% + 20% + 15% + 15% × 90/92 = 69.67%`(표시 70%)다. 마지막 배치는 C#·.NET W34–W35다.

#### C#·.NET W34–W35 — 복구 설계·최종 출시 캡스톤 (완료)

- W34는 같은 operation key를 통한 재시도와 부수 효과, 협력적 취소와 이미 commit된 저장의 차이, version/ETag 동시성 충돌, 검증 뒤 백업 교체, 민감 원문을 제외한 correlation 로그를 다섯 날에 연결했다. W35는 HTTP/application/domain/storage 추적, 영향 계약 기반 회귀 사례, credential·schema·rollback 출시 확인, 실제 C#/.NET/ASP.NET 실행 범위의 솔직한 보고, 공식 문서와 로컬 SDK 기반 다음 학습 계획을 다뤘다.
- Microsoft 공식 [EF Core concurrency](https://learn.microsoft.com/en-us/ef/core/saving/concurrency), [.NET architectural principles](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles), [.NET unit testing best practices](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices), [ASP.NET Core integration testing](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0)를 확인했다.
- 회귀 검사는 새 30문항의 예제·정답·오답별 피드백·정답 분포와 공식 출처 연결을 검사한다. SDK 10.0.400/runtime 10.0.11 오프라인 `net10.0` harness에서 W1–W35 예제 172개가 경고·오류 없이 빌드됐고 W16–W35 출력 100/100이 답안 trace와 일치했다. 사이트는 C#을 실행하지 않으며 실제 ASP.NET Host·HTTP·DB transaction·운영 배포는 검증하지 않았다.
- CQ-4는 92/92주·1,380/1,380문항으로 완료했다. CQ-0–CQ-4 완료분은 70.00%이며 다음 단계는 CQ-5 PostgreSQL 과정과 실행형 문제 은행이다.

### CQ-5 PostgreSQL 과정·실행형 문제 은행 (진행 중)

#### PostgreSQL W1–W3 — 표 조회·별칭·비교 경계 (완료)

- W1은 카탈로그의 실제 표 존재, 행·열 관계, 기본 키 제약 조회, 필요한 출력 열, 결과 집합과 정렬을 다룬다. W2는 FROM 자료 출처, 테이블 별칭, 결과 열 별칭, 계산 열, 표 별칭으로 한정한 열을 추적한다. W3는 동등·부등, 초과·이상, 미만·이하, 경계 포함, 양 끝이 포함되는 BETWEEN을 구분한다.
- 발견한 결함: 첫 세 주의 다섯 날짜가 매주 하나의 질의 틀에서 숫자만 바꿔 반복됐다. 주관식은 하루 목표와 관계 없는 키워드 회상이었고, 일부 오류 찾기는 그날 초점과 무관한 존재하지 않는 표·열·`= NULL`을 반복했다. 수정한 45문항에 새 `-v2` ID를 사용해 이전 완료 기록을 보존했다. 각 날짜를 고유 SQL·입력 행을 명시한 출력 추적·목표에 맞는 세 오답 피드백·실제 오류 또는 요구 불일치·작동하는 수정 질의로 연결했다.
- 버전 최신성 확인에서 기존 ‘PostgreSQL 19 Beta 4’ 표기가 뒤처진 것을 발견했다. PostgreSQL 공식 소식은 2026-10-15 RC 1 공개를 기록하므로 현행 학습 기준은 안정 18.6, 19 RC 1은 정식 배포 전 후보, 무료 PGlite 0.5.8 실행기는 PostgreSQL 18.3으로 구분했다. [PostgreSQL 18 SELECT](https://www.postgresql.org/docs/18/sql-select.html), [기본 키 제약](https://www.postgresql.org/docs/18/ddl-constraints.html), [ORDER BY](https://www.postgresql.org/docs/18/queries-order.html), [LIMIT/OFFSET](https://www.postgresql.org/docs/18/queries-limit.html), [비교와 BETWEEN](https://www.postgresql.org/docs/18/functions-comparison.html), [19 RC 1 안내](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/)를 대조했다.
- 로컬 PGlite 18.3에서 새 W1–W3 질의 15개가 기대 행·열을 반환하고, 전체 PostgreSQL 수업 예제 195개도 기존 fixture에서 실행됨을 확인했다. 전용 `tests/postgresql-quality.test.js` 6/6 통과, 전체 `npm test` 279/279, release audit 137개 정적 파일·최대 9.621 MiB 및 의존성·구문 검사는 성공했다. SQL editor는 공개 테스트 사례를 실행하고 숨은 서버 채점이나 PostgreSQL 18.6 production 호환을 보장하지 않는다.
- CQ-5의 계획 배치는 PostgreSQL 3주 묶음 13개와 JavaScript·TypeScript·PostgreSQL·FastAPI 문제 은행을 각각 25개씩 나눈 8개 묶음, 총 21개다. 현재 2/21 배치이며 CQ-5 완료율은 2/21, 전체 정밀 진척은 `70% + 15% × 2/21 = 71.43%`다. 다음은 PostgreSQL W7–W9다.

#### PostgreSQL W4–W6 — 논리 조건·NULL·정렬 결과 (완료)

- W4는 AND의 동시 조건, OR의 대안 조건, NOT, 괄호 우선순위와 실제 조건 분해를 다룬다. W5는 `IS NULL`과 `IS NOT NULL`, NULL과 빈 문자열의 차이, `COALESCE` 기본 표시, 산술식 NULL 전파, 비교 결과 UNKNOWN을 행 단위로 추적한다. W6는 ASC/DESC, 실제 동점 보조 키, NULLS LAST와 정렬 후 LIMIT이 고정하는 상위 행을 구분한다.
- 발견한 결함: 이 구간의 일별 쿼리는 조건 연산자나 LIMIT 수만 바뀌는 같은 틀을 반복했다. 객관식·용어 회상은 정답 근거가 오늘 예제와 연결되지 않았고, 일부 locate-error는 NULL·없는 표·열 오류를 되풀이해 목표와 무관했다. 45문항을 날짜별 고유 질의·입력 자료·예상 결과·오답별 피드백으로 바꾸고, 잘못된 질의가 다른 행을 반환하는 구체 요구 위반으로 진단했다. 새 `-v2` ID를 사용해 기존 완료 이력을 유지했다.
- 실행 회귀 fixture의 `attempts.review_note`를 선택적 NULL 가능 열로 추가해 NULL/빈 문자열/일반 문자열을 비교할 자료를 제공한다. PostgreSQL 공식 문서에서 [논리 연산과 3값 논리](https://www.postgresql.org/docs/18/functions-logical.html), [NULL 및 비교 연산](https://www.postgresql.org/docs/18/functions-comparison.html), [정렬 및 NULL 위치](https://www.postgresql.org/docs/18/queries-order.html)를 대조했다. PGlite 18.3에서 새 정답 질의 15개, 잘못된 질의 15개, 수정 질의 15개를 실행해 의도한 결과 차이를 검증했다. 전용 PostgreSQL 품질 검사 7/7, 전체 `npm test` 280/280, release audit 138개 정적 파일·최대 9.621 MiB 통과. 실제 PostgreSQL 18.6 서버 운영·확장 기능은 검증하지 않았다.
- CQ-5에는 PostgreSQL 13개 3주 배치와 네 문제 은행 8개 25문항 배치, 총 21개 배치가 있다. 현재 2/21, PostgreSQL W1–W6 6/39주·90/585문항, 정밀 전체 진척은 `70% + 15% × 2/21 = 71.43%`다. 다음은 PostgreSQL W7–W9다.

#### PostgreSQL W7–W9 — 페이지·문자열·날짜와 시간대 (완료)

- W7은 LIMIT 최대 행 수, OFFSET으로 건너뛸 행 수, 1부터 시작하는 페이지 번호의 `(페이지 - 1) × 크기` 계산, 정렬 후 자르기, 마지막 부분 페이지를 구분한다. W8은 LOWER/UPPER, 한글 LENGTH와 byte 길이 차이, POSITION의 1 기반·대소문자 구분, LIKE 와일드카드, locale에 따른 ILIKE를 실제 결과로 연습한다. W9는 DATE와 TIMESTAMP 자료형, 명시적 DATE 리터럴, 반열린 기간 `[시작, 다음 시작)`, INTERVAL, TIMESTAMPTZ와 UTC 변환을 다룬다.
- 발견한 결함: 다섯 날짜의 예제가 LIMIT/OFFSET 숫자·문자열 또는 날짜의 한 숫자만 바꾼 반복이었으며, 진단은 목표와 관계 없는 표/열/NULL 오류를 반복했다. W9는 DATE 열만 조회하는 예를 내며 시각·시간대를 가르치고, TIMESTAMPTZ가 입력 시간대를 계속 저장하는 것처럼 용어 정의를 제공했다. 날짜마다 새로운 출력 계약·결과 추적·다른 결과가 나오는 요구 위반·복구 질의를 추가하고 새 `-v2` ID로 완료 이력을 보존했다. timestamp-with-zone이 instant를 UTC로 보관하고 입력 시간대 이름을 보존하지 않는다는 공식 정의와 실제 PGlite 결과를 반영했다.
- 공식 PostgreSQL 18 [LIMIT/OFFSET](https://www.postgresql.org/docs/18/queries-limit.html), [문자열 함수](https://www.postgresql.org/docs/18/functions-string.html), [LIKE/ILIKE와 패턴](https://www.postgresql.org/docs/18/functions-matching.html), [날짜/시간 자료형](https://www.postgresql.org/docs/18/datatype-datetime.html), [날짜/시간 연산](https://www.postgresql.org/docs/18/functions-datetime.html)를 대조했다. PGlite 18.3에서 정답·오류·수정 질의 각각 15개를 실행했고 PostgreSQL 전용 검사 8/8, 전체 `npm test` 281/281, release audit 139개 정적 파일·최대 9.621 MiB 통과. 18.6 서버·실제 배포의 시간대 설정이나 locale 동작은 별도 미검증이다.
- CQ-5는 21개 배치 중 3개 완료다. PostgreSQL W1–W9 9/39주·135/585문항, 문제 은행 0/200개이며 전체 정밀 진척은 `70% + 15% × 3/21 = 72.14%`다. 다음은 PostgreSQL W10–W12다.

#### PostgreSQL W10–W12 — 중복·조건 결과·집계 (완료)

- W10은 단일 열 및 복합 열 DISTINCT, COUNT DISTINCT, 그룹별 반복 원인, DISTINCT ON의 정렬 우선 행을 구분한다. W11은 검색 CASE와 첫 TRUE 분기, 구체 조건 우선순위, NULL 대체, NULLIF로 0 나누기 방지, NULL·빈 문자열 분류를 입력 행별로 확인한다. W12는 COUNT(*)와 COUNT(열), SUM, AVG, 빈 입력의 count 0 및 sum NULL을 실제 결과로 비교한다.
- 발견한 결함: 일별 예제는 같은 topic/점수 틀에 숫자만 바꾸는 식으로 반복되고, 설명은 오늘 사례의 출력값을 추적하지 않았다. DISTINCT ON은 ORDER BY가 어떤 행을 선택하는지 보이지 않았고, COUNT·SUM·AVG는 NULL이 분모나 합계에 미치는 차이를 확인할 수 없었다. nullable `bonus_points`를 문제 은행의 무료 샘플 스키마에 추가하고 중복·동점·NULL 데이터로 45문항을 다시 썼다. 새로운 `-v2` 문항 ID로 과거 이력을 보존했다.
- PostgreSQL 18 공식 [SELECT·DISTINCT ON](https://www.postgresql.org/docs/18/sql-select.html), [CASE·COALESCE·NULLIF](https://www.postgresql.org/docs/18/functions-conditional.html), [aggregate functions](https://www.postgresql.org/docs/18/functions-aggregate.html)를 대조했다. 로컬 PGlite 18.3에서 정답·오류·수정 질의 각각 15개를 실행했다. PostgreSQL 전용 검사 9/9, 전체 `npm test` 282/282, release audit 140개 정적 파일·최대 9.621 MiB 통과. 실제 PostgreSQL 18.6 서버·외부 데이터 소스는 검증하지 않았다.
- CQ-5는 21개 배치 중 4개 완료다. PostgreSQL W1–W12 12/39주·180/585문항, 실행 문제 은행 0/200개이며 전체 정밀 진척은 `70% + 15% × 4/21 = 72.86%`다. 다음은 PostgreSQL W13–W15다.

#### PostgreSQL W13–W15 — 그룹·INNER JOIN·LEFT JOIN (완료)

- W13은 단일/복합 GROUP BY 키, WHERE가 집계 전에 적용되는 순서, HAVING의 집계 필터, 그룹 결과 행 수와 입력 행 수를 구분한다. W14는 learner PK와 attempts FK 관계, INNER JOIN의 일대다 결과, 테이블 별칭·열 출처·선택 열과 결합 결과 건수를 추적한다. W15는 왼쪽 행 보존, 오른쪽 NULL 확장 행, 일치 없음 진단, COUNT(*)와 COUNT(오른쪽 키)의 차이, ON과 WHERE의 외부 조인 결과 차이를 실제 행으로 확인한다.
- 발견한 결함: 초반 JOIN·집계 문제는 추상 정의와 같은 숫자만 바뀌는 예시가 많아 무엇이 결과 행을 만들거나 제거하는지 검증할 수 없었다. 기존 오류 찾기도 잘못된 표·열·NULL만 재사용했다. 별도 fixture에서 시도 6건·학습자 4명(시도 없는 learner 포함)을 연결하고 45문항을 관계·실제 반환 행·오답별 설명·다른 결과를 만드는 결함 및 복구 질의로 다시 구성했다. 기존 이력을 유지하도록 새 `-v2` ID를 사용했다.
- PostgreSQL 공식 [GROUP BY/HAVING·JOIN 및 외부 조인 동작](https://www.postgresql.org/docs/18/queries-table-expressions.html)과 [JOIN 튜토리얼](https://www.postgresql.org/docs/18/tutorial-join.html)을 대조했다. PGlite 18.3에서 정답·오류·수정 질의 각 15개를 실행하고 전용 PostgreSQL 검사 10/10, 전체 `npm test` 283/283, release audit 141개 정적 파일·최대 9.621 MiB를 통과했다. 실제 서버의 잠금·외부 데이터는 이 검증에 포함하지 않았다.
- CQ-5는 21개 배치 중 5개 완료다. PostgreSQL W1–W15 15/39주·225/585문항, 실행 문제 은행 0/200개이며 정밀 진척은 `70% + 15% × 5/21 = 73.57%`다. 다음은 PostgreSQL W16–W18이다.

#### PostgreSQL W16–W18 — 다대다 조인·하위 질의 (완료)

- W16은 연결 표의 다대다 행 확장, 태그별 고유 시도 수와 미사용 태그 보존, `EXISTS`로 점수 중복을 막는 집계, `COUNT(DISTINCT ...)`와 원본 건수, `HAVING` 경계값을 다섯 날에 연결했다. W17은 `IN` 열 수·일치 목록, `NOT IN`과 NULL의 UNKNOWN, 중복을 만들지 않는 `EXISTS`, 상관 존재 검사, `NOT EXISTS`로 조건에 맞는 행이 없는 경우를 구분한다. W18은 전체 평균 비교, 학습자별 상관 COUNT와 0건, 최신 단일 행 선택과 0행의 NULL, scalar subquery의 다중 행 오류, NULL 결과의 COALESCE 표시값을 다룬다.
- 발견한 결함: 기존 내용은 하위 질의 정의와 JOIN 설명만 있어 다대다 연결로 합계가 부풀거나 `NOT IN`이 NULL 때문에 빈 결과를 내는 실제 반례가 없었다. 문제 은행 예제 스키마에 `tags` 및 복합 기본 키/외래 키를 가진 `attempt_tags`를 추가했고, 기존 문제의 공개 기대 결과는 바꾸지 않았다. 45문항을 고유 fixture 행·정확한 출력·오답 근거·관찰 가능한 결함 및 수리 쿼리로 재구성해 `-v2` 문항 ID를 부여했다.
- PostgreSQL 공식 [table expressions와 JOIN](https://www.postgresql.org/docs/18/queries-table-expressions.html), [EXISTS·IN·NOT IN](https://www.postgresql.org/docs/18/functions-subquery.html), [scalar subquery의 단일 행 규칙](https://www.postgresql.org/docs/18/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES)을 대조했다. PGlite 18.3에서 새 정답·오류·수정 질의 각 15개, 기존 SQL 문제 은행 300개 공개 사례와 195개 기본 예제 실행을 확인했다. 전용 `tests/postgresql-quality.test.js` 11/11, 전체 `npm test` 284/284, `npm run check:release` 142개 정적 파일·최대 9.621 MiB 통과. PostgreSQL 18.6 서버 운영 호환은 검증하지 않았다.
- CQ-5는 21개 배치 중 6개 완료다. PostgreSQL W1–W18 18/39주·270/585문항, 실행 문제 은행 0/200개이며 정밀 진척은 `70% + 15% × 6/21 = 74.29%`다. 다음은 PostgreSQL W19–W21이다.

#### PostgreSQL W19–W21 — CTE·집합 연산·윈도 함수 (완료)

- W19는 CTE의 이름/열 범위, 여러 단계의 입력·출력, 한 CTE 재사용, 계산 열과 다음 조건, 단계별 필터·집계를 입력 행으로 추적한다. W20은 UNION의 중복 제거와 UNION ALL의 보존, 결과 열 호환, EXCEPT/INTERSECT의 집합 차이를 확인한다. W21은 OVER의 행 보존, PARTITION BY, 결정적인 ROW_NUMBER, RANK와 DENSE_RANK의 peer 순위, GROUP BY와 윈도 집계 차이를 사례로 다룬다.
- 기존 반복 예제를 결과가 보이는 15개 질의로 교체했다. CTE의 물리 저장 오해, UNION ALL 중복 보존, 윈도 함수의 행 유지 등 오답을 각 목표와 맞추고, 결함 질의는 다른 결과를 내거나 오류가 나도록 구성했다.
- PostgreSQL 공식 [WITH/CTE](https://www.postgresql.org/docs/18/queries-with.html), [UNION·INTERSECT·EXCEPT](https://www.postgresql.org/docs/18/queries-union.html), [window tutorial](https://www.postgresql.org/docs/18/tutorial-window.html), [window function reference](https://www.postgresql.org/docs/18/functions-window.html)를 대조했다. PGlite 18.3 전용 검사 12/12, 전체 `npm test` 285/285, release audit 143개 정적 파일·최대 9.621 MiB를 통과했다. PostgreSQL 18.6 운영 서버는 검증하지 않았다.
- CQ-5는 21개 배치 중 7개 완료다. PostgreSQL W1–W21 21/39주·315/585문항, 문제 은행 0/200개이며 전체 진척은 `70% + 15% × 7/21 = 75.00%`다. 다음은 W22–W24다.

#### PostgreSQL W22–W24 — 순위·윈도 프레임·제약 조건 (완료)

- W22는 RANK의 동점 순위 건너뜀, DENSE_RANK의 연속 순위, 결정적인 ROW_NUMBER, PARTITION BY별 순위, 윈도 계산 순서와 최종 출력 정렬을 분리한다. W23은 날짜/id 순서의 LAG·LEAD, 경계 기본값, 기본 RANGE 프레임의 peer 포함 누적합, 고유 tie-break를 둔 ROWS 누적합을 실행한다. W24는 PRIMARY KEY·FOREIGN KEY·복합 키, 행 단위 CHECK와 다른 행/표 제약의 한계, CHECK의 NULL 통과와 NOT NULL 역할을 구분한다.
- 최초 회귀에서 W22D4 기대 행 순서가 실제 `ORDER BY topic`과 달랐고, 동점 ROW_NUMBER 결함 예제가 우연히 같은 순서를 반환하는 문제가 발견됐다. 반환 순서를 정정하고 fault query에 반대 tie-break를 두어 오류를 재현 가능하게 고쳤다. W24 수정 DDL은 별도 PGlite 스키마에서 중복 키, 없는 참조, NULL 필수값, 음수 CHECK 입력을 각각 거부하는지 확인했다.
- PostgreSQL 공식 [window tutorial](https://www.postgresql.org/docs/18/tutorial-window.html), [window functions](https://www.postgresql.org/docs/18/functions-window.html), [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)을 대조했다. 전용 회귀 13/13, 전체 `npm test` 286/286, `npm run check:release` 144개 정적 파일·최대 9.621 MiB 통과. PGlite 18.3에서 195개 수업 SQL과 300개 공개 코딩 사례를 실행했다. PostgreSQL 18.6 운영 서버는 검증하지 않았다.
- 이 문단은 W25–W27 감사 전 상태를 기록한 과거 배치 설명이다. 최신 진척과 W25–W30 근거는 아래 감사 이력을 참조한다.

#### PostgreSQL W25–W27 — 정규화·DML·트랜잭션 복구 (완료)

- W25는 반복 사실과 갱신 이상, 관계 분리, 부분 함수 종속을 다룬다. 실제 `attempts` 기본 키가 `id`이므로 부분 함수 종속 예제의 관계는 논리 키 `(learner_id, topic)`을 가정한다고 표시했다. W26은 대상 행 제한·`RETURNING`·영향 행 확인을, W27은 원자성·COMMIT/ROLLBACK·SAVEPOINT 복구를 실행한다.
- W27에서 표시된 wallet 예제에 준비 자료가 빠졌거나 검증용 SQL이 화면 코드와 달라 학습자가 동일 결과를 재현할 수 없는 결함을 고쳤다. wallet fixture와 실패 경로를 두고 화면에 보이는 각 스크립트를 PGlite에서 실행했다.
- PostgreSQL 공식 [DML](https://www.postgresql.org/docs/18/dml.html), [RETURNING](https://www.postgresql.org/docs/18/dml-returning.html), [transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) 및 IBM [정규화 개요](https://www.ibm.com/think/topics/database-normalization)를 대조했다. W25–W27 전용 회귀 15/15, 전체 `npm test` 288/288, release audit 145개 파일을 통과했다. PostgreSQL 18.6 운영 서버는 검증하지 않았다.

#### PostgreSQL W28–W30 — 동시성·실행 계획·인덱스 (완료)

- W28은 READ COMMITTED의 문장별 스냅샷, REPEATABLE READ의 안정된 스냅샷, SERIALIZABLE의 40001 전체 재시도, `SELECT FOR UPDATE` 잠금 범위를 다룬다. 두 연결의 실행 순서와 필요한 표를 예제 안에 표시했다. 현재 학습 사이트는 두 DB 연결의 동시 실행을 제공하지 않으므로 PGlite에서는 격리 수준·잠금 문장만 검사하고 경쟁 상황은 개념 시나리오로 표시한다. 40001 문자열 조회는 실제 오류 생성이 아니라 재시도 절차를 설명하는 고정 예제다.
- W29는 B-tree 후보 조건, 실행 경로·예상 행·비용 단위, ANALYZE 통계, EXPLAIN ANALYZE의 실제 변경 효과와 롤백을 검수한다. 특정 Scan 노드를 정답으로 고정하지 않았고 UPDATE 측정은 폐기 가능한 PGlite DB에서 실행한 뒤 롤백해 값을 확인했다.
- W30은 복합 B-tree 열 순서, PostgreSQL 18 skip scan의 조건부 선택, 부분 인덱스 predicate 증명, 제외 행 검색과 완전 중복 인덱스 제거를 다룬다. 인덱스 사용 여부를 결과 정확성과 분리하고 계획이 자료 분포에 따라 달라진다고 밝혔다.
- 검수 중 잠금 예제의 테이블과 실제 fixture 불일치, 직렬화 시나리오의 정의되지 않은 표, 오류 쿼리에서 fixture의 점수 순서가 정렬 결함을 드러내지 못하는 경우, 날짜 결과의 JS/PGlite 형식 차이를 발견해 고쳤다. PostgreSQL 공식 [transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [EXPLAIN ANALYZE](https://www.postgresql.org/docs/18/sql-explain.html), [multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html), [partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html), [ANALYZE와 인덱스 조사](https://www.postgresql.org/docs/18/indexes-examine.html), [PostgreSQL 18 release notes](https://www.postgresql.org/docs/18/release-18.html)를 대조했다.
- W28–W30 전용 회귀 4/4, 전체 `npm test` 291/291, `npm run check:release` 146개 정적 파일·최대 9.621 MiB 통과. PGlite 18.3만 사용했으며 PostgreSQL 18.6 별도 서버나 실제 두 세션 동시성은 검증하지 않았다. CQ-5는 10/21 배치, PostgreSQL W1–W30 30/39주·450/585문항, 문제 은행 0/200개, 전체 정밀 진척 `70% + 15% × 10/21 = 77.14%`다. 다음은 PostgreSQL W31–W33이다.

### CQ-6 공통 실무 W23–W24 — 입력 검증·계약 테스트 (완료; 12/13 배치)

- W23 D1 오류 찾기는 role을 요청 본문에서 읽어만 두고 실제 저장 권한 우회가 드러나지 않았다. 코드를 클라이언트가 보낸 role 값으로 수정 여부를 결정하게 바꾸고, 인증 주체의 권한과 대상 레코드 접근 권한을 확인해야 한다고 설명했다. W23 D2는 허용 목록을 선언해도 문자열 검사만 하는 결함, D3는 100을 허용해야 하는 상한에서 100까지 거부하는 경계 오류를 보여 준다.
- W24 D1/D3 오류 찾기의 기존 문항은 응답 필드와 Content-Type을 이미 검사하면서도 해당 검사가 없다고 설명했다. D1은 name 형식 검사를 빠뜨리고 상태 코드를 다시 검사하는 예제로, D3는 body 객체 존재만 확인해 생성 ID를 빠뜨리는 예제로 고쳤다. D4 회귀 테스트가 빈 입력 대신 다른 입력을 assertion 하던 문제와 D5의 한 사례 결과를 전체 환경 보장으로 과장하던 결론도 확인했다.
- W23의 Authorization 헤더는 학습 자료에서 가림 표기만 사용한다. 인가·출력 인코딩·입력 검증의 공식 출처를 콘텐츠 메타데이터에 연결했다. W24 버전은 Node.js 26.12.0 test runner와 OpenAPI 3.2.1을 기준으로 기록했다.
- OWASP [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), Node.js [26.12.0 test runner](https://nodejs.org/api/test.html), OpenAPI [3.2.1](https://spec.openapis.org/oas/v3.2.1.html), HTTP [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)을 대조했다. OpenAPI 공식 명세는 3.2.1을 2026-09-10 버전으로 표시한다.
- `node --test tests/foundations-quality.test.js` 14/14, 수정 JS 구문 검사 통과. 이 배치는 정적 학습 예제이므로 실제 서버 접근 권한, HTTP 요청·응답, Node.js 학습용 예제를 제품에서 실행한 것은 아니다. 비용 서비스·계정·DB·공개 배포 변경은 없다.
- 공통 실무 W1–W24 24/26주·360/390문항, 12/13 배치다. CQ-6 전체 360/570문항·12/33 배치이며 전체 정밀 진척은 91.32%(표시 91%)다. 다음은 W25–W26이고 사용자 도움이 필요한 항목은 없다.

### CQ-6 공통 실무 W25–W26 — 리뷰·실무 통합 캡스톤 (완료; 13/13 공통 실무 배치)

- W25는 요구사항을 측정 가능한 수용 기준으로 바꾸기, diff 범위 검토, 재현 가능한 리뷰 의견, 실제 검사와 미검증 범위 구분, 사용자 기록 백업·복구를 다룬다. D2의 PR 예제에는 운영 token처럼 보이는 문자열이 있어 `[REDACTED_SECRET]`로 교체했고 실제 비밀값과 혼동하지 않도록 설명을 맞췄다.
- W26은 하나의 가상 검색 기능에서 입력·허용 목록·HTTP 결과·보안·CI 결정을 연결한다. D2 오류 찾기는 기존 코드에서 `return` 뒤에 잘못된 줄이 있어 실행 불가능했다. 허용된 topic을 처리하고 목록 밖 문자열은 전체 자료로 빠지는 기본 분기로 바꿔, 4번 오류가 입력 조건에서 실제 도달하도록 수정했다.
- W25–W26 날짜별 소개는 공통 문장 반복을 제거하고 각 날의 목표를 설명한다. Git 2.56.0 문서 갱신일(2026-09-28), Node.js 26.12.0 test runner, OpenAPI 3.2.1, PostgreSQL 18.6을 확인해 검토일을 2026-10-16으로 갱신했다. W25의 출처를 GitHub PR 및 OWASP CI/CD·Secrets Management로 바로잡았다.
- Git [사용자 설명서·2.56.0 문서 갱신 이력](https://git-scm.com/docs/user-manual), GitHub [Pull Requests](https://docs.github.com/en/pull-requests/reference/pull-requests), OWASP [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)·[Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), Node.js [26.12.0 test runner](https://nodejs.org/api/test.html), OpenAPI [3.2.1](https://spec.openapis.org/oas/v3.2.1.html), PostgreSQL [18.6 release notes](https://www.postgresql.org/docs/18/release-18-6.html), Docker [container concepts](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)를 대조했다.
- `node --test tests/foundations-quality.test.js` 15/15, 변경 JavaScript 파일 구문 검사 통과. 샘플 PR·CI·배포는 정적·가상 기록이며 GitHub 계정, 실제 Docker 이미지·서비스, 제품 서버와 HTTP 요청을 사용하지 않았다.
- 공통 실무 W1–W26은 26/26주·390/390문항, 13/13 배치로 완료했다. CQ-6 전체는 390/570문항·13/33 배치이며 전체 정밀 진척은 `85% + 10% × 390/570 = 91.84%`(표시 92%)다. 다음은 G10 초기 카탈로그 JavaScript 첫 3단원이며, 오류나 사용자 결정이 필요한 항목은 없다.

### CQ-6 G10 JavaScript 초기 카탈로그 1–3단원 — 변수·조건·반복 (완료; 14/33 전체 배치)

- 초기 카탈로그의 순서 `js-variables` → `js-conditionals` → `js-loops`를 확인했다. 이 ID는 JavaScript 26주 과정의 첫 12개 학습 경로와 같은 원본이며, 1–3단원의 초기 문항 9개가 기존 첫 3주에 각각 한 번씩 편성된다. 각 주차는 5일, 하루 3문항·전체 15문항으로 고유 ID가 유지되어 초기 문제를 별도 중복 단원으로 노출하지 않는다.
- 변수 단원은 `const`/`let` 선택과 재할당·선언 전 접근, 조건 단원은 60점 경계·논리 AND·비교 대신 대입하는 오류, 반복 단원은 배열 끝 경계·`for...of`·`break` 흐름을 다룬다. 선택지 정답 ID와 표시 문구, 모든 보기별 설명, 단답 허용값, 오류 줄과 수정 해설을 대조했다.
- `js-conditionals` 예제는 Node.js 24.14.0에서 `통과`, `js-loops` 예제는 `9`를 출력했다. 이는 해당 예제 실행 근거이며 2026년 ECMAScript 전체 기능이나 모든 브라우저 런타임의 호환 인증은 아니다. `js-variables` 원본 예제도 독립 선언·재할당·누적 결과로 읽어 확인했다.
- Ecma International 공식 페이지는 ECMAScript 2026을 ECMA-262 17판(2026년 6월)으로 표시한다. 안정 기본 문법이므로 preview 기능은 사용하지 않았다. [ECMA-262 17판](https://262.ecma-international.org/17.0/)과 [Ecma 발행 정보](https://ecma-international.org/publications-and-standards/standards/ecma-262/)를 대조하고 버전 검토일을 2026-10-16으로 갱신했다.
- `node --test tests/g10-javascript-curriculum-quality.test.js` 2/2 통과. 첫 3개 단원의 원본 ID·순서·주차 연결, 9문항 정답 채점과 일별 3문항 구성을 자동 검사하고, 조건·반복 예제의 콘솔 결과도 대조했다. 사용자 오류 제보나 추가 결정이 필요한 항목은 찾지 못했다.
- 공통 실무 390/390문항과 G10 JavaScript 3/60단원·9/180문항을 승인했다. CQ-6 전체 399/570문항·14/33 배치, 전체 정밀 진척 `85% + 10% × 399/570 = 92.00%`(표시 92%)다. 다음은 G10 JavaScript 4–6단원이다.

### CQ-6 G10 JavaScript 초기 카탈로그 4–6단원 — 함수·배열·객체 (완료; 15/33 전체 배치)

- 초기 카탈로그 순서 `js-functions` → `js-arrays` → `js-objects`가 JavaScript 26주 경로의 4–6주차와 일치하는지 확인했다. 각 원본 단원의 3개 문항 ID를 주간 학습에 한 번씩 보존하고, 다섯 날·하루 3문항·주 15개 고유 ID 연결을 검수했다.
- 함수는 매개변수·반환값·기본 인자의 생략/undefined/null 차이, 배열은 0 기반 경계·비파괴 추가·map/filter·sort 원본 변경·빈 배열 정책, 객체는 점 표기·선택적 체이닝·전개 복사·속성 형식·원본 보존을 다룬다. 정답 ID, 모든 선택지 설명, 단답 허용값, 코드 수정 채점 방식과 사례를 확인했다.
- 오류 찾기 세 항목에서 발견된 결함을 수정했다. 기본 매개변수 문제는 `||`가 null을 바꾸는 코드와 해설을 일치시켰다. 객체 전개 문제는 `name`을 복사하지 않는 줄을 답으로 만들었고, 객체 문자열 문제는 구분자와 단위가 빠진 반환식을 결함으로 제시했다. 사용되지 않는 주간 생성 사례의 객체 속성 문제도 실제 누락 속성을 가리키도록 정리했다.
- 반복형 선택지·실행 추적·오류 분석·코드 수정 힌트를 4–6주차 개념에 맞게 구체화하고, 실행 추적 해설에 계산 근거를 넣었다. 15개 일별 예제 출력, 오류 코드 출력 세 개, 답으로 선택한 줄의 실제 결함을 로컬 Node.js에서 확인했다. G10 및 JavaScript 회귀 테스트는 30/30 통과했다.
- Ecma International ECMAScript 2026 공식 언어 표준을 대조했다. `Array.prototype.sort`, `map`/`filter`, 기본 매개변수, optional chaining, 객체 속성 읽기 동작을 확인했으며 preview API는 사용하지 않았다. 실행 근거는 로컬 Node.js 예제 범위이며 모든 브라우저·런타임 호환 보증은 아니다. 사용자 결정이나 도움 요청 항목은 없다.
- 공통 실무 390/390문항과 G10 JavaScript 6/60단원·18/180문항을 승인했다. CQ-6 전체 408/570문항·15/33 배치, 전체 정밀 진척 `85% + 10% × 408/570 = 92.16%`(표시 92%)다. 다음은 G10 JavaScript 7–9단원이다.

### CQ-6 G10 JavaScript 초기 카탈로그 7–9단원 — 범위·모듈·DOM (완료; 16/33 전체 배치)

- 초기 카탈로그 순서 `js-scope-closures` → `js-modules-errors-tests` → `js-dom-forms`가 JavaScript 26주 경로의 7–9주차와 일치하는지 확인했다. 각 원본 단원의 3개 문항 ID를 보존하고 다섯 날·하루 3문항·단원당 15개 고유 문항의 구성을 검수했다.
- 범위·클로저는 블록 범위, 함수 반환, 클로저별 독립 상태와 공유 상태를 다룬다. 모듈·오류·테스트는 named import, alias, 필수 입력 오류, 공백·숫자 변환 경계를 연결했다. DOM·폼은 submit 기본 동작 취소, 정규화된 값 저장, `textContent`와 입력값 처리를 다룬다.
- 오류 위치와 설명의 연결이 부족한 네 문항을 고쳤다. W8 D3의 공백 검사, W8 D4의 `Number(raw)`, W9 D2의 원본 값 저장, W9 D4의 원본 입력 반환 해설이 각각 정답 줄과 수정 방향을 직접 설명하도록 했다. W8 D1의 모듈 개념 문항은 함수 변환까지 요구하는 듯한 질문을 가져오기 문법을 묻는 형태로 좁히고 기존 보기 문구와 정답 의미를 보존했다. 7–9단원 일별 문항에 개념별 힌트·출력 근거를 연결했다.
- ECMAScript 2026 (ECMA-262 17판) 표준을 범위·모듈 규칙과 대조했다. HTML·DOM 문항의 근거를 공식 [WHATWG HTML input 표준](https://html.spec.whatwg.org/multipage/input.html)과 [WHATWG DOM 표준](https://dom.spec.whatwg.org/)으로 보완했다. WHATWG HTML input 페이지의 갱신 표시는 2026-10-14다.
- 일별 JavaScript 예제 15개를 로컬 Node.js에서 실행해 출력과 대조했다. 11개 오류 찾기 문항의 선택 줄과 해설을 검사하고, 실행형 오류 사례도 실제 반환/예외와 비교했다. 폼 이벤트와 `textContent` 예제는 Node 일반 객체 모형이므로 브라우저의 submit·HTML parser 동작을 실행하거나 보안 검증한 것으로 보지 않는다. 모듈 data URL 예제는 import/export 동작을 실행했으나 실제 앱의 파일 경로·서버 MIME 설정 검증은 아니다. 코드 수정형 자동 평가는 계약에 따라 정적 구조 검사이며 코드를 실행하지 않는다.
- `node --test tests/g10-javascript-curriculum-quality.test.js tests/javascript-react-quality.test.js` 31/31 통과. JavaScript 데이터·메타데이터·테스트 파일 구문 검사와 변경 파일 `git diff --check`도 확인했다. 공통 실무 390/390문항과 G10 JavaScript 9/60단원·27/180문항을 승인했다. CQ-6 전체 417/570문항·16/33 배치, 전체 정밀 진척 `85% + 10% × 417/570 = 92.32%`(표시 92%)다. 다음은 G10 JavaScript 10–12단원이며 사용자 결정이나 도움 요청 항목은 없다.

### CQ-6 G10 JavaScript 초기 카탈로그 10–12단원 — 비동기 웹·이벤트 루프·캡스톤 (완료; 17/33 전체 배치)

- 초기 카탈로그 순서 `js-promises-fetch` → `js-event-loop` → `js-algorithms-capstone`가 26주 JavaScript 경로의 10–12주와 맞고, 원본 문항 9개가 각 주에 보존되는지 확인했다. 주 5일·하루 3문항·고유 ID 15개씩의 구성을 검수했다.
- Promise 본문 처리, `response.ok`와 네트워크 거부 구분, `AbortController.signal` 전달·취소, 동기 실행/microtask/timer 순서, requestAnimationFrame 경계, 긴 작업 나누기, 평균 빈 입력·불변 완료 기록·배열 경계를 날짜별 사례로 확인했다. 10–12주차 일별 예제 15개를 실행해 기대 출력과 비교했다.
- W11 D1의 오늘의 예제 출력과 원본 문항 정답이 일치하도록 동기·Promise·timer 사례를 정리했다. W11 D3 오류 찾기는 `log`를 선언하고도 호출 결과를 `.then`에 넘기는 결함으로 범위를 좁혀 정답 줄을 실행해 재현했다. W10 D5는 일반 객체 대신 `AbortController`를 쓰고 모형 fetch에 signal을 전달한 다음 `abort()` 뒤 `signal.aborted`를 확인한다. 실제 네트워크 요청·취소는 실행하지 않는다.
- G10 JavaScript 1–12단원 품질 회귀에 10–12단원 검사를 추가했다. 선택지 정답/오답 설명, 단답 허용값, 오류 답 줄과 설명, 대표 결함 코드의 결과, 정적 코드 수정 채점 경계를 확인했다. W12의 다섯 반복 소개를 구체적인 날짜별 목표로 교체했다.
- ECMAScript 2026 표준과 공식 [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/)(2026-10-06 갱신), [HTML 이벤트 루프](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops), [animation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)를 대조했다. Node에서 실행한 코드와 브라우저 실제 repaint·네트워크 행위를 구분했다.
- `node --test tests/g10-javascript-curriculum-quality.test.js tests/javascript-react-quality.test.js` 32/32 통과. 수정된 예제 출력 15/15, 오류 줄·해설 10개, 실제 결함 결과 7개, 모듈·DOM/화면 모형 범위를 확인했다. 로컬 Node 검증은 모든 브라우저 호환이나 실제 HTTP 요청 검증을 뜻하지 않는다.
- 공통 실무 390/390문항과 G10 JavaScript 12/60단원·36/180문항을 승인했다. CQ-6 전체 426/570문항·17/33 배치, 전체 정밀 진척 `85% + 10% × 426/570 = 92.47%`(표시 92%)다. 당시 후속 순서를 JavaScript 13–15단원으로 잘못 적었다. 초기 JavaScript 카탈로그가 12단원에서 끝나는 사실을 다시 확인해 다음 묶음을 Python 1–3단원으로 바로잡았다.

### CQ-6 G10 Python 초기 카탈로그 1–3단원 — 변수·조건·반복 (완료; 18/33 전체 배치)

- 초기 카탈로그 순서 `py-variables` → `py-conditions` → `py-loops`가 26주 Python 학습 경로의 첫 세 주와 일치하고, 원본 문항 9개가 각 주에 한 번씩 연결되는지 확인했다. 세 주 모두 5일·하루 3문항·15개 고유 ID를 유지한다.
- Python 3.15.0은 2026-10-09 공개된 최신 안정판임을 Python.org에서 확인했다. [입문 자습서](https://docs.python.org/3.15/tutorial/introduction.html)의 `/`, `//`, `%`, 문자열 연결 규칙과 [제어 흐름 자습서](https://docs.python.org/3.15/tutorial/controlflow.html)의 조건 분기·반복 규칙을 대조했다. 실행 검증은 로컬 Python 3.12.10이며, Python 3.15 런타임 실행·전체 호환성 인증은 아니다.
- W2 D4 오류 찾기는 빈 목록을 사용해 `if items is True`와 `if items`의 차이가 드러나지 않았다. 비어 있지 않은 목록으로 바꿔 잘못된 조건이 본문을 건너뛰는 동작을 재현했다. W3 D4는 정상 조건 줄을 답으로 지정하던 문항을 `count += 1` 결함 줄로 고치고, 안전상 무한 반복 코드는 실행하지 않은 채 선택 줄·해설을 정적으로 확인했다. `range(2, 5)` 오답별 설명도 끝 경계 규칙을 설명하도록 보완했다.
- `node --test tests/g10-python-curriculum-quality.test.js tests/content.test.js tests/python-spring-quality.test.js` 44/44 통과했다. 전용 회귀는 원본 ID·경로 순서·문항 채점 기준, 서로 다른 일별 목표 15개, 15개 예제 출력, 오류 찾기 결함 줄, 코드 수정 답안 6개 실행, 버전 출처를 확인한다. 이어 전체 `npm test` 325/325와 `npm run check:release` 149개 정적 파일 검사를 통과했다. Python을 사용할 수 없는 환경에서는 예제·수정 코드의 Python 실행만 건너뛴다.
- CQ-6 공통 실무 390/390문항과 G10 JavaScript 12/60단원·Python 3/60단원(총 45/180문항)을 승인했다. CQ-6 전체 435/570문항·18/33 배치이며 전체 정밀 진척은 `85% + 10% × 435/570 = 92.63%`(표시 93%)다. 다음은 G10 Python 4–6단원이다. 사용자 결정이나 도움 요청 항목은 없다.

### CQ-6 G10 Python 초기 카탈로그 4–6단원 — 함수·리스트·딕셔너리 (완료; 19/33 전체 배치)

- 초기 카탈로그 `py-functions` → `py-lists` → `py-dictionaries`를 26주 Python 경로의 4–6주와 맞춰 보고 원본 문항 9개 ID가 각각 한 번 유지되는지 확인했다. 하루 3문항·단원별 고유 15문항과 날짜별로 다른 소개를 검수했다.
- Python 3.15 공식 [제어 흐름·함수](https://docs.python.org/3.15/tutorial/controlflow.html), [자료 구조](https://docs.python.org/3.15/tutorial/datastructures.html), [딕셔너리와 삽입 순서](https://docs.python.org/3.15/library/stdtypes.html#mapping-types-dict)를 대조했다. 예제는 로컬 Python 3.12.10에서 실행했으며 Python 3.15 런타임을 확인한 것은 아니다.
- 오류 찾기 5개를 실행·정적 검사했다. 지역 `rate` 대입은 바깥 값을 바꾸지 않고, 목록 `+`와 `sorted()` 결과를 저장하지 않으면 원본 출력이 남으며, 빠진 키는 `KeyError`, 딕셔너리 키 문자열을 두 변수로 직접 풀면 `ValueError`가 난다. 정답 줄과 해설을 각각 연결했고, 딕셔너리 기존 문항 설명에 3번 줄을 명시했다.
- 코드 수정형 네 문항의 허용 답안 다섯 형태를 실행했다. `discounted` 경계 테스트에서 정수 인수를 넣은 `100 * 1` 결과는 `100.0`이 아니라 `100`이고, `100 * 0`도 `0`임을 확인해 기대값을 고쳤다. 문제는 실행 채점이 아니라 정적 함수 구조 채점임을 유지한다.
- 짧던 `greet()` 기본값·리스트 `items[0]` 오답 설명을 해당 규칙과 실제 값을 말하도록 보완했다. `node --test tests/g10-python-4-6-curriculum-quality.test.js tests/g10-python-curriculum-quality.test.js tests/content.test.js tests/python-spring-quality.test.js` 49/49 통과했다. Python이 없는 환경에서는 실행 확인만 건너뛴다.
- CQ-6 공통 실무 390/390문항과 G10 JavaScript 12/60단원·Python 6/60단원(총 54/180문항)을 승인했다. CQ-6 전체 444/570문항·19/33 배치이며 정밀 진척 `85% + 10% × 444/570 = 92.79%`(표시 93%)다. 다음은 G10 Python 7–9단원이다. 사용자 결정이나 도움 요청 항목은 없다.

### CQ-6 G10 Python 초기 카탈로그 7–9단원 — 모듈·파일·이터레이터 (완료; 20/33 전체 배치)

- 초기 카탈로그 `py-modules-errors` → `py-files-context` → `py-iterators-generators`가 Python 26주 경로의 7–9주와 일치하는지 확인했다. 원본 문항 9개를 각 주에 한 번씩 보존하고 5일·하루 3문항·단원별 15문항을 유지했다. 원본 모듈/제너레이터 선택지 설명 세 곳은 단순 오답 표시에서 호출 순서와 첫 `yield` 상태를 설명하도록 보강했다.
- Python 3.15 공식 [예외](https://docs.python.org/3.15/tutorial/errors.html), [파일 입출력](https://docs.python.org/3.15/tutorial/inputoutput.html), [이터레이터·제너레이터](https://docs.python.org/3.15/tutorial/classes.html), [itertools](https://docs.python.org/3.15/library/itertools.html), [pathlib](https://docs.python.org/3.15/library/pathlib.html), [임시 파일](https://docs.python.org/3.15/library/tempfile.html), [os.replace](https://docs.python.org/3.15/library/os.html#os.replace) 자료와 대조했다. Python.org의 [3.15.0 안정판](https://www.python.org/downloads/release/python-3150/)을 기준으로 했으며 실행은 로컬 Python 3.12.10이다.
- 일별 예제 15개의 출력과 코드 수리 답안 4개 구현을 확인했다. 오류 찾기는 `finally`의 `return`이 정상 반환값·변환 예외를 모두 덮는 사례와 파일 전체 읽기가 줄 단위 처리 목표를 어기는 사례를 줄 번호·설명에 맞췄다. 파일 읽기 예제는 계산된 합계 `30`도 보여 주도록 고쳤다. 무한 `count`를 `list()`로 소비하는 위험한 코드는 별도 Python 프로세스에 350ms 제한을 걸어 비종료를 확인한 뒤 중단했다.
- 임시 파일 수정 답안은 Windows의 프로젝트 내부 격리 폴더에서 교체 성공 시 새 내용이 보이고 `os.replace` 실패 시 기존 내용이 유지되며 임시 파일이 정리되는 경계를 확인했다. POSIX 원자성 보장을 다른 OS·파일시스템에 일반화하지 않으며, 전원 장애 후 디스크 내구성도 보증하지 않는다.
- `tests/g10-python-7-9-curriculum-quality.test.js` 5/5, Python 1–9단원·콘텐츠·기존 Python 회귀 54/54, 전체 `npm test` 335/335, `npm run check:release` 149개 정적 파일·최대 9.621 MiB 통과. Python 3.15 런타임·다른 OS의 파일 교체 동작은 인증하지 않는다.
- CQ-6 공통 실무 390/390문항과 G10 JavaScript 12/60단원·Python 9/60단원(총 63/180문항)을 승인했다. 직전 기록의 489에는 주간 보조 과정의 추가 문항 36개가 중복 합산되어 있어 CQ-6 원본 카탈로그 기준으로 453/570문항·20/33 배치, 정밀 진척 `85% + 10% × 453/570 = 92.95%`(표시 93%)로 바로잡았다. 당시 다음 단계는 G10 Python 10–12단원이다. 이 정정은 콘텐츠 승인 범위를 축소하지 않고 동일 문항의 중복 집계를 제거한다.

### CQ-6 G10 Python 초기 카탈로그 10–12단원 — 클래스·비동기·데이터 요약 (완료; 21/33 전체 배치)

- 초기 카탈로그 `py-classes-types` → `py-async-concurrency` → `py-data-capstone`의 9개 원본 문항이 Python 26주 과정 10–12주차에 한 번씩 연결되고, 매주 5일·15문항 구성이 유지되는지 대조했다. 클래스 상태와 메서드, 동기/비동기 작업 및 취소, 입력 집계와 빈 데이터 경계를 날짜별 목표에 맞춰 검수했다.
- Python 3.15 공식 자료에서 [클래스](https://docs.python.org/3.15/tutorial/classes.html), [asyncio](https://docs.python.org/3.15/library/asyncio.html), [동시성·TaskGroup](https://docs.python.org/3.15/library/asyncio-task.html), [통계](https://docs.python.org/3.15/library/statistics.html), [CSV](https://docs.python.org/3.15/library/csv.html) 계약과 대조했다. 실행 환경은 Python 3.12.10이며 최신 문서판과의 런타임 동등성은 주장하지 않는다.
- `tests/g10-python-10-12-curriculum-quality.test.js` 및 Python·콘텐츠 회귀로 원본 ID 유지, 일별 목표·정답 피드백, 입력 경계, 코드 수리 기준을 점검했다. 15개 예제 중 동시 gather 사례는 현재 Windows Node 기반 검사에서 제한 시간 안에 끝나지 않아 실행 통과로 세지 않았다. 해당 비동기 계약은 공식 API 자료와 정적 검사로 확인했다.
- 승인 범위는 G10 원본 9문항이다. 각 주에 연결된 추가 주간 연습 45문항은 CQ-6 분모 밖의 보조 콘텐츠이므로 원본 승인 수에 더하지 않는다. 결과는 462/570문항·21/33 배치, 전체 정밀 진척 `85% + 10% × 462/570 = 93.11%`(표시 93%)이며, 다음은 Python 주간 과정 13–15주차의 별도 보충 재감사다.

### Python 주간 과정 13–15주차 보충 재감사 — 문자열·직렬화·파일 경로 (CQ-6 분모 외)

- Python 3.15 공식 문서와 대조해 문자열 형식·직렬화·경로 처리의 일별 학습 목표, 예제·오류 위치·해설을 다시 봤다. Python 3.12.10으로 날짜별 예제 15개의 출력이 각 기대 결과와 일치하는지 실행했다.
- 실제 코드에서 재현되는 오류 위치 7건을 확인하고, 시작 코드 자체가 채점 기준과 맞지 않는 코드 수정 사례 2건을 바로잡았다. 이 보충 검토는 기존 G11 주차 문항의 품질 수정이며 G10 초기 카탈로그 원본 180문항을 늘리지 않아 CQ-6 수치에는 포함하지 않는다.
- 실행 결과는 이 로컬 Python 버전과 사례에 한정하며 Python 3.15 런타임 또는 다른 OS의 경로·직렬화 호환 인증을 뜻하지 않는다. 사용자 결정이나 추가 서비스는 필요하지 않았다.

### CQ-6 G10 Java 초기 카탈로그 1–3단원 — 변수·조건·반복 (완료; 22/33 전체 배치)

- 원본 초기 카탈로그 1–3단원의 9문항이 Java 주간 과정 첫 3주에 보존·연결되는지 확인했다. 15개 일별 예제, 개념 선택·구체 단답·수리 및 적용 문제의 학습 목표·오답 근거를 검수하고 날짜별 설명에서 범용 문구를 걷어냈다. 의미가 달라진 주간 질문은 새 버전 ID를 사용했다.
- Java SE 25 공식 [언어 명세](https://docs.oracle.com/javase/specs/jls/se25/html/)의 [기본 타입과 변수](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html), [형 변환](https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html), [표현식](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html), [문장·반복문](https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html)을 대조했다.
- `tests/g10-java-curriculum-quality.test.js`, `tests/java-curriculum-quality.test.js`, `tests/content.test.js` 합계 50/50 통과했다. 설치된 JDK 8에서 15개 예제 중 switch 표현식을 쓰는 1개를 제외한 14개를 컴파일·실행하고 출력을 대조했다. 제외 예제는 JDK 14 이상이 필요한 문법이므로 이 환경의 JDK 8로 컴파일할 수 없다. 이는 Java SE 25 컴파일러 검증이 아니다.
- 공통 실무 390/390문항과 G10 JavaScript 36, Python 36, Java 9문항을 승인해 CQ-6는 471/570문항·22/33 배치가 됐다. 전체 정밀 진척 `85% + 10% × 471/570 = 93.26%`(표시 93%)이며 다음은 G10 Java 4–6단원이다. 사용자 결정이나 도움 요청은 없다.

### CQ-6 G10 Java 초기 카탈로그 4–6단원 — 메서드·객체·상속과 다형성 (완료; 23/33 전체 배치)

- 초기 카탈로그의 9개 원본 문항과 Java 주간 4–6주의 45개 연결 연습을 구분해 검토했다. 메서드 매개변수·반환·오버로딩, 생성자·인스턴스 필드·접근 제어, 상속·재정의·인터페이스의 예제와 하루별 회상·오류 분석·수정·적용 질문에서 범용 안내, 답 근거 부족, 예제와 목표의 연결 부족을 보완했다. G10 원본 문제의 ID와 정답 의미는 보존했다.
- Java SE 25 JLS [§8.4 메서드](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4), [§8.8 생성자](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8), [§8 클래스](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [§9 인터페이스](https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html), [§15.12 메서드 호출](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12)을 대조했다.
- Java/G10/공통 콘텐츠 대상 테스트 52/52 통과. 설치된 JDK 8에서 UTF-8로 15개 일일 예제를 컴파일하고 예상 출력 15/15를 대조했다. 이는 Java 8에서 해당 예제의 동작을 확인한 것이며 Java SE 25 컴파일러·런타임 적합성 인증은 아니다.
- 원본 9문항을 승인해 CQ-6는 480/570문항·23/33 배치가 됐다. 정밀 진척 `85% + 10% × 480/570 = 93.42%`(표시 93%)이며 다음은 G10 Java 7–9단원이다. 사용자 결정·도움 요청 없음.

### CQ-6 G10 Java 초기 카탈로그 7–9단원 — 컬렉션·예외·함수형 인터페이스 (완료; 24/33 전체 배치)

- 초기 카탈로그의 원본 문항 `java-collections-choice-v2`, `java-generics-locate`, `java-map-short`, `java-exception-choice`, `java-checked-exception-locate-v2`, `java-catch-short-v2`, `java-lambda-choice-v2`, `java-predicate-locate-v2`, `java-function-short-v2`를 검수했다. 실제 앱에서 각 문제가 Java 7–9주차의 List/Set/Map, checked 예외·catch 순서, Runnable/Predicate/Function 예제에 맞는 첫 3일에 한 번씩 표시되고, 각 날의 총 3문항 구성·기존 ID·답 의미가 유지됨을 확인했다.
- Oracle Java SE 25 공식 [List](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html)·[Set](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Set.html)·[Map](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html)·[함수형 인터페이스](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/package-summary.html)와 [JLS 예외 명세](https://docs.oracle.com/javase/specs/jls/se25/html/jls-11.html)를 대조했다. Java SE 25 LTS를 과정 기준으로 두고 Java 27 기능 릴리스·preview 상태를 별도로 표시한다.
- `node --test tests/g10-java-curriculum-quality.test.js tests/java-curriculum-quality.test.js tests/content.test.js`에서 57/57 통과했다. 원본 문항은 개념·오류 위치·단답형이며 컴파일 가능한 독립 코드라고 표시하지 않는다. 별도 Java 컴파일은 이번 배치에서 하지 않았다.
- 원본 9문항을 승인해 CQ-6는 489/570문항·24/33 배치가 됐다. 정밀 진척은 `85% + 10% × 489/570 = 93.58%`(표시 94%)이며 다음은 G10 Java 10–12단원이다. 발견된 콘텐츠 결함, 사용자 결정, 도움 요청은 없다.

### CQ-6 G10 Java 초기 카탈로그 10–12단원 — 스트림·동시성·JVM (완료; 25/33 전체 배치)

- 초기 카탈로그 원본 문항 `java-filter-choice-v2`, `java-map-locate-v2`, `java-flatmap-short-v2`, `java-thread-choice-v2`, `java-visibility-locate-v2`, `java-atomic-short-v2`, `java-heap-choice-v2`, `java-allocation-locate-v2`, `java-warmup-short-v2`를 확인했다. 실제 앱 화면에서 이 문제가 각각 스트림 filter/map/flatMap, Thread·volatile·AtomicInteger, 힙·할당·워밍업을 다루는 10–12주차 첫 3일에 한 번씩 배치되고, 원본 ID·정답 의미·하루 세 문제를 유지한다.
- Oracle Java SE 25 공식 [Stream](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html)·[Thread](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html)·[AtomicInteger](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html)·[JVM 실행 데이터 영역](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.5)을 대조했다. `Stream.toList()`가 Java 16부터 제공되는 점과 현재 과정의 Java 25 LTS/Java 27 기능 릴리스 구분도 공식 출처에서 확인했다.
- 같은 Java/G10/content 회귀 57/57 통과. 전체 `npm test`는 352개 중 351 통과·실패 0·1 건너뜀(Windows sandbox에서 asyncio 예제가 3초 내 끝나지 않음)으로 완료됐고, `npm run check:release`는 정적 배포 자산 149개에서 통과했다. 기존 W10–W12 보충 예제의 JDK 8 실행은 앞선 검증 범위(14/15, Java 16 API 예제 1개 제외)로 기록한다. 원본 G10 질문 자체는 코드 실행 문제로 표시하지 않는다.
- 원본 9문항을 승인해 CQ-6는 498/570문항·25/33 배치가 됐다. 정밀 진척은 `85% + 10% × 498/570 = 93.74%`(표시 94%)이며 다음은 G10 Spring Boot 1–3단원이다. 사용자 결정이나 도움 요청은 없다.

### CQ-6 G10 Spring Boot 초기 카탈로그 1–3단원 — 의존성 주입·서비스 경계·외부 설정 (완료; 26/33 전체 배치)

- 초기 카탈로그의 원본 9문항 `spring-injection-choice`, `spring-injection-why-choice`, `spring-injection-locate`, `spring-service-choice`, `spring-service-boundary-choice`, `spring-service-short`, `spring-config-choice`, `spring-config-short`, `spring-config-locate`를 대조했다. 각각 실제 화면의 1–3주차 첫 3일에 한 번씩 배치되고, 기존 선택지 ID는 답 기록을 유지하며 ID가 가리키는 정답 문구가 맞는지 검사했다. 단답 허용 답과 오류 위치·수정 설명도 확인했다.
- `spring-service-choice` 정답 피드백은 기존 문장이 HTTP 컨트롤러의 책임을 충분히 설명하지 않아, 요청 수신→서비스 호출→응답 연결 흐름으로 고쳤다. 각 주에 5일·하루 세 문항이 있고 원본 문항 3개가 날짜별 추가 주간 연습과 함께 표시되는 구조를 유지했다.
- Spring 공식 [시스템 요구 사항](https://docs.spring.io/spring-boot/system-requirements.html)과 [버전 목록](https://docs.spring.io/spring-boot/spring-projects.html)을 2026-10-16에 다시 대조했다. Boot 4.1.1은 안정판, Java 17–26 및 Spring Framework 7.0.9 이상을 지원하며 4.2.0-M2는 미리보기다. 의존성 주입은 Spring Framework [협력 객체 문서](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html), 설정은 Boot [외부 설정 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)를 참조한다. 프레임워크 코드 조각은 로컬에서 컴파일·실행하지 않았다.
- `node --test tests/spring-curriculum-quality.test.js tests/content.test.js` 47/47 통과. 전체 `npm test` 355개 중 354 통과·실패 0·1 건너뜀, `npm run check:release` 149개 정적 자산 통과.
- 원본 9문항을 승인해 CQ-6는 507/570문항·26/33 배치가 됐다. 정밀 진척은 `85% + 10% × 507/570 = 93.89%`(표시 94%)이며 다음은 G10 Spring Boot 4–6단원이다. 사용자 결정이나 도움 요청은 없다.

### CQ-6 G10 Spring Boot 초기 카탈로그 4–6단원 — 웹 요청·검증·오류 응답 (완료; 27/33 전체 배치)

- 원본 문항 `spring-controller-choice`, `spring-controller-role-choice`, `spring-controller-locate`, `spring-validation-choice`, `spring-validation-server-choice`, `spring-validation-short`, `spring-errors-choice`, `spring-errors-short-v2`, `spring-errors-locate`를 4–6주차 첫 3일과 대조했다. 각 문항이 일자별 사례와 맞고 한 번만 보이며, 5일·하루 세 문제 흐름을 유지한다. GET 경로와 요청 본문 매핑, `@Valid`와 서버 검증, Bean Validation 제공자, 4xx·404·400 계약을 검수했다.
- 선택형은 순서가 화면 균형을 위해 바뀌므로 선택지 ID와 정답 문구를 함께 확인했다. 단답은 허용 답과 설명을, 오류 찾기는 정확한 코드 줄·실제 오류·설명된 수정 방향과 채점 결과를 확인했다. 컴파일 가능한 완성 프로젝트가 아니라는 표시를 유지한다.
- `node --test tests/spring-curriculum-quality.test.js tests/content.test.js` 48/48 통과. 정적 릴리스 검사 149개 파일 통과. 이 배치에서 추가 결함이나 사용자 결정은 발견하지 않았다.
- 원본 9문항을 승인해 CQ-6는 516/570문항·27/33 배치가 됐다. 정밀 진척은 `85% + 10% × 516/570 = 94.05%`(표시 94%)이며 다음은 G10 Spring Boot 7–9단원이다.

### CQ-6 G10 Spring Boot 초기 카탈로그 7–9단원 — 트랜잭션·보안·MVC 테스트 (완료; 28/33 전체 배치)

- 원본 문제 `spring-tx-choice-v2`, `spring-tx-short-v2`, `spring-tx-locate-v2`, `spring-security-choice`, `spring-security-short-v2`, `spring-security-locate`, `spring-test-choice-v2`, `spring-test-short-v2`, `spring-test-locate-v2`를 각 7–9주차 첫 3일과 대조했다. 트랜잭션과 외부 이메일 효과, 커밋 후 처리, 예외가 삼켜지는 rollback 경계, 인증과 인가, `@EnableMethodSecurity`, 관리자 접근 규칙, MockMvc 실행, MVC 테스트 슬라이스에 없는 서비스 의존성을 확인했다.
- 선택지의 표시는 순환하지만 정답 선택지 ID와 답 의미가 보존된다. 단답형 허용 답, 오류 줄, 수정 설명, 정답 채점을 확인했으며, 9주차 첫 문제는 작은 순수 Java 단위 테스트와 `@WebMvcTest` 범위의 차이를 묻는 비교 문항으로 해당 주의 테스트 경계를 소개한다.
- Spring Security 7.1.1 [메서드 보안 공식 문서](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)에서 `@EnableMethodSecurity`가 `@PreAuthorize` 등을 활성화한다는 점을 확인하고, [요청 경로 보안 문서](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)에서 요청 수준 접근 규칙 출처를 대조했다. 기존 Boot 4.1.1 시스템 요구 사항은 Java 17–26 / Framework 7.0.9+로 표시되며 코드 예제는 실행하지 않았다.
- `node --test tests/spring-curriculum-quality.test.js tests/content.test.js` 49/49 통과. 추가 콘텐츠 오류·도움이 필요한 결정은 발견하지 않았다.
- 원본 9문항을 승인해 CQ-6는 525/570문항·28/33 배치가 됐다. 정밀 진척은 `85% + 10% × 525/570 = 94.21%`(표시 94%)이며 다음은 G10 Spring Boot 10–12단원이다.

## 감사 이력

| 날짜 | 배치 | 결과 | 진척 |
|---|---|---|---:|
| 2026-10-14 | CQ-0 | 기준선 수량과 자동 검사 결과를 확인하고 Java W26 D1 결함(E-91), 전수 편집 검수 공백 및 품질 승인 기준을 기록 | 0% → 10% |
| 2026-10-14 | CQ-1 | 11개 트랙 마지막 두 주차를 대조하고 Java·JavaScript·TypeScript·FastAPI의 확인 결함과 PostgreSQL 130개 정답 키 오류를 수정했다. 선택 ID/문구 연결을 보존하고 트랙 회귀 검증과 전체 릴리스 점검을 통과했다. 다음은 CQ-2 Java W1–W3 검수다. | 10% → 20% |
| 2026-10-14 | CQ-2 | Java W1–W3 45문항과 목표·예제·정답·피드백을 검수하고 15개 맥락 없는 코드 조각 및 자동 생성 문구를 보완했다. JDK 8로 14개 예제의 컴파일·실행 출력을 확인하고 switch 표현식은 Java SE 25 공식 언어 명세와 대조했다. | 20% → 21% (CQ-2 3/78주) |
| 2026-10-14 | CQ-2 | Java W4–W6의 45문항과 예제 15개를 추가 검수했다. 학습 목표와 맞지 않던 레거시 문제 및 지역 변수 범위·인터페이스 수정 문제를 고쳤고, W1–W6의 코드 수정 입력/기대 결과를 실제 동작 기준으로 보완했다. JDK 8 컴파일·실행 29/30, 전체 테스트 181/181, 정적 릴리스 검사 통과를 확인했다. | 21% → 22% (CQ-2 6/78주; 가중 21.54%) |
| 2026-10-14 | CQ-2 | Java W7–W9의 45문항과 예제 15개를 검수했다. 컬렉션 선택의 잘못된 정답·주제 불일치, checked 예외·catch 순서 혼동, 람다·Predicate·Function 목표와 어긋난 스트림 문항을 고쳤다. JDK 8에서 예제 15/15 컴파일·실행 결과를 확인하고, Java 테스트 9/9·전체 테스트 182/182·release audit 통과를 기록했다. 다음은 Java W10–W12다. | 22% 유지 (CQ-2 9/78주; 가중 22.31%) |
| 2026-10-14 | CQ-2 | Java W10–W12의 스트림·동시성·JVM 성능 45문항과 예제 15개를 검수했다. 다른 주제에서 가져온 문제 9개를 당일 목표와 맞게 교체하고, Java 16 `Stream.toList()` 및 Java 21 가상 스레드 버전을 공식 API 문서와 대조했다. JDK 8에서 호환 예제 14/14 실행, Java 테스트 10/10·전체 테스트 183/183·release audit 통과. 다음은 Java W13–W15다. | 22% → 23% (CQ-2 12/78주; 가중 23.08%) |
| 2026-10-14 | CQ-2 | Java W13–W15 파일·날짜·입력 경계 45문항을 검수하고 예제 15개를 전체 클래스로 보완했다. 직렬화를 다루지 않는 W15 제목을 실제 내용에 맞게 바꾸고, 잘못된 DTO 생성자 수정 답을 새 ID로 교체했다. Java 11 파일 API·Java 16 record의 도입 버전을 공식 Java SE 25 API에서 확인하고 JDK 8 호환 예제 9/9를 실행했다. Java 테스트 11/11·전체 테스트 184/184·release audit 통과. 다음은 Java W16–W18이다. | 23% → 24% (CQ-2 15/78주; 가중 23.85%) |
| 2026-10-14 | CQ-2 | Java W16–W18 네트워크·테스트·설계 45문항의 목표와 정답을 검수했다. 15개 예제를 독립된 클래스로 만들고 HTTP 요청 timeout과 테스트 이름 수리 문제를 실제 API/테스트 동작에 맞췄다. Java SE 25 공식 API와 RFC 9110을 대조했다. 로컬 JDK 8은 HTTP Client Java 11 API를 지원하지 않아 해당 5개는 미실행으로 남겼고, 나머지 10개는 W17–W21 합동 실행에서 확인했다. | 24% 유지 (CQ-2 18/78주; 가중 24.62%) |
| 2026-10-14 | CQ-2 | Java W19–W21 동등성·로그·리팩터링 45문항을 검수하고 일일 예제 15개를 완성했다. 부분 문자열 치환으로 비밀값이 남던 수정 답을 전체 마스킹으로 교체하고 `-v2` 키와 경계 사례를 추가했다. Java SE 25 공식 Record·List·logging 문서로 기능 버전을 확인했다. JDK 8 호환 예제 22/22 실행, Java·콘텐츠 회귀 39/39 통과. 생성된 Java 적용형 질문 94개를 표시 예제에 연결되는 버전으로 교체하고 전체 정답 위치 분포 80/79/79를 확인했다. 다음은 Java W22–W24다. | 24% → 25% (CQ-2 21/78주; 가중 25.38%) |
| 2026-10-14 | CQ-2 | Java W22–W24 자료구조·탐색·재귀 45문항을 대조하고 예제 15개를 완결했다. `binarySearch` 중복 계약을 결과 위치 보장처럼 가르치지 않도록 정정하고, 스택 깊이의 임의 기준을 제거했다. Java+콘텐츠 테스트 41/41, JDK 8에서 현재 W17–W24 호환 예제 37/37 컴파일·실행. 다음은 Java W25–W26이다. | 25% → 26% (CQ-2 24/78주; 가중 26.15%) |

| 2026-10-15 | CQ-2 | Java W25–W26의 30문항을 입력/출력 있는 전체 예제로 만들고 적용 질문을 새 상황에 맞게 구체화했다. Java 16 record와 `nanoTime()`을 Oracle 문서로 대조하고, JDK 8 호환 예제 9/9 및 전체 테스트·릴리스 검사를 통과했다. | 26% → 27% (CQ-2 26/78주; 가중 26.67%) |
| 2026-10-15 | CQ-2 | JavaScript W1–W3의 45문항과 예제 15개에서 목표 불일치·입출력 누락·부분 출력만 받아도 정답 처리되는 채점 문제를 수정했다. Node 예제 출력, 주간 요약 및 정답 경로를 검증했다. | 27% 유지 (CQ-2 29/78주; 가중 27.44%) |
| 2026-10-15 | CQ-2 | JavaScript W4–W6의 함수·배열·객체 45문항과 예제 15개를 목표에 맞췄다. 불필요한 선수 개념, 잘못 연결된 선택지, 출력 없는 조각을 고치고 ECMAScript 2026 명세를 확인했다. | 27% → 28% (CQ-2 32/78주; 가중 28.21%) |
| 2026-10-15 | CQ-2 | JavaScript W7–W9에서 목표가 어긋난 문제, 반복 피드백, 출력 없는 예제, 이미 정답인 수정 시작 코드를 바꿨다. 클로저·모듈은 Node에서 실행하고 DOM/submit 모형을 실제 브라우저 동작과 구분했다. | 28% → 29% (CQ-2 35/78주; 가중 28.97%) |
| 2026-10-15 | CQ-2 | JavaScript W10–W12의 Promise/Fetch·이벤트 루프·통계 통합 예제와 45문항을 고쳤다. 네트워크·타이머 모형을 실제 브라우저 동작으로 오해하지 않게 구분하고 MDN 공식 자료와 대조했다. 최신 통합 검사 전체 192/192 및 릴리스 검사를 통과했다. | 29% → 30% (CQ-2 38/78주; 가중 29.74%) |
| 2026-10-15 | CQ-2 | JavaScript W13–W15의 문자열 정규화·Date·Map/Set 45문항과 일일/주간 예제를 보완했다. 날짜와 Map 순회에 맞지 않는 기존 코드 연결, 결과 없는 조각, 반복 힌트를 교체하고 MDN API 설명 및 출력 회귀를 확인했다. | 30% → 31% (CQ-2 41/78주; 가중 30.51%) |
| 2026-10-15 | CQ-2 | JavaScript W16–W18의 제너레이터·클래스와 상속·prototype 45문항과 실행 예제를 목표별로 다시 연결했다. 잘못 표시된 완료 상태 오류 줄과 단독 실행이 안 되는 주간 예제, 빠진 객체 전제를 고쳤으며 MDN 공식 설명과 대표 입력 실행을 회귀 검사했다. | 31% 유지 (CQ-2 44/78주; 가중 31.28%) |
| 2026-10-15 | CQ-2 | JavaScript W19–W21의 테스트·디버깅·성능 측정 45문항을 주제 흐름에 맞게 재작성했다. 날짜별 예제와 질문이 섞여 있던 문제, 반복 템플릿 피드백, 시간 측정과 목록 코드의 연결 오류를 고쳤다. Node test runner, Performance API, ECMAScript 2026 명세를 확인하고 결정적 대표 입력으로 수정 답을 실행 검증했다. | 31% → 32% (CQ-2 47/78주; 가중 32.05%) |
| 2026-10-15 | CQ-2 | JavaScript W22–W24 저장소·요청·비동기 취소 45문항을 검수하고 메모리 저장·가짜 응답·타이머로 수정 답의 성공·실패 경계를 실행 확인했다. MDN 및 React 공식 문서와 대조하고 실제 탭·HTTP·Effect 실행은 범위 밖으로 기록했다. | 32% → 33% (CQ-2 50/78주; 가중 32.82%) |
| 2026-10-15 | CQ-2 | JavaScript W25–W26 보안 경계·캡스톤 30문항과 일일·주간 예제 12개를 검수했다. textContent·URI 구성 요소 인코딩·허용 경로·비밀 아닌 저장·오류/빈 상태·의미 있는 링크·통합 회귀를 실행·출처와 대조했다. | 33% 유지 (CQ-2 52/78주; 가중 33.33%); 다음 Python W1–W3 |
| 2026-10-15 | CQ-2 Python W1–W3 | 45문항을 목표·예제·정답과 다시 연결했다. 매일의 코드 출력 전체를 단답 허용 답과 맞췄고, Python 3.15 공식 기초 문서와 대조했다. 로컬 Python 3.12.10으로 15개 예제와 세 수정 함수의 입력 경계를 실행 확인했다. 트랙 전체는 3.14.8 기준 표기를 유지하고 3.15 호환 점검은 Python 다음 배치에서 계속한다. | 34% (CQ-2 55/78주·825/1,170문항; 가중 34.10%); 다음 Python W4–W6 |
| 2026-10-15 | CQ-2 Python W4–W6 | 함수·리스트·딕셔너리 주차의 일별 목표, 45문항, 15개 출력, 수리 함수 입력 경계를 재검수하고 Python 3.15 공식 문서와 대조했다. | 35% (CQ-2 58/78주·870/1,170문항; 가중 34.87%); 다음 Python W7–W9 |
| 2026-10-15 | CQ-2 Python W7–W9 | 모듈·예외, 파일·경로·인코딩, 이터레이터·제너레이터의 45문항을 다시 연결했다. 15개 일일 예제와 세 수정 함수의 실패·경계 동작을 Python 3.12.10에서 확인하고 Python 3.15 공식 문서와 대조했다. E-115를 해결했다. | 36% (CQ-2 61/78주·915/1,170문항; 가중 35.64%); 다음 Python W10–W12; 전체 검사의 W10/W11 결함은 E-117/E-116으로 추적 |
| 2026-10-15 | CQ-2 Python W10–W12 | 클래스·타입 힌트·async/CPU 경계·데이터 요약의 45문항을 정렬하고 기존 질문 ID를 날짜에 맞게 배치했다. 13개 출력 예제와 세 수정 함수의 결과를 Python 3.12.10에서 확인했으며 비동기 루프와 프로세스 풀은 구문 확인만 했다. Python 3.15 공식 문서를 대조하고 E-116/E-117을 해결했다. | 36% 유지 (CQ-2 64/78주·960/1,170문항; 가중 36.41%); 전체 npm test 200/200, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Python W13–W15 |
| 2026-10-15 | CQ-2 Python W13–W15 | 문자열·정규식, 날짜/JSON 직렬화, 파일 경로·환경 설정 45문항에서 실제 오류가 아닌 정답 줄, 잘못된 금요일 수리 과제, 불안정한 OS 경로·파일 전제를 고쳤다. 정규식 실패를 재현하고, JSON에는 시간대 포함 datetime을 ISO 문자열로 변환하며, 파일 작업은 임시 디렉터리에 격리했다. Python 3.15 공식 문서와 대조했다. | 37% (CQ-2 67/78주·1,005/1,170문항; 가중 37.18%); 예제 15/15·수리 사례 7/7, 대상 35/35, 전체 npm test 201/201, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Python W16–W18 |
| 2026-10-15 | CQ-2 Python W16–W18 | 데이터클래스, 회귀 테스트·경계값, 디버깅·로깅 45문항을 정렬했다. 날짜와 무관했던 금요일 수리 문제를 해당 주제에 맞추고 unittest, fixture 격리, 재현·traceback·예외 원인 예제를 구체화했다. Python 3.12.10 출력 15/15·경계 7/7과 Python 3.15 공식 문서를 확인했다. | 38% (CQ-2 70/78주·1,050/1,170문항; 가중 37.95%); 대상 36/36, 전체 npm test 202/202, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Python W19–W21 |
| 2026-10-15 | CQ-2 Python W19–W21 | 자료구조 성능·HTTP 경계·동시성 45문항의 주제 연결을 바로잡고 구체적인 일별 설명, 실제 표준 라이브러리 예제, 측정·오류·잠금 수리 문제를 완성했다. Python 3.12.10에서 예제 15/15 및 세 수정 함수의 경계 사례를 실행 확인하고 Python 3.15 공식 문서·RFC 9110과 대조했다. | 39% (CQ-2 73/78주·1,095/1,170문항; 가중 38.72%); 대상 37/37, 전체 npm test 203/203, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Python W22–W24 |
| 2026-10-15 | CQ-2 Python W22–W24 | CLI 인자·표준 스트림·종료 상태, JSON 검증·임시 교체·오류 복구, 검증 뒤 저장을 실제 입력·출력과 연결했다. Python 3.12.10 예제 15/15와 필수 옵션·복구 실패·제목 경계 수리 문제를 실행하고 Python 3.15 공식 문서와 대조했다. | 39% (CQ-2 76/78주·1,140/1,170문항; 가중 39.49%); 대상 38/38, 전체 npm test 204/204, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Python W25–W26 |
| 2026-10-15 | CQ-2 Python W25–W26 | 요구사항 분해·실패/백업 경계·출시 점검·성능 측정·CLI 문서·복습 계획 30문항을 검수했다. Python 3.12.10 예제 10/10과 수리 함수 입력 경계를 확인하고 Python 3.15 공식 문서와 대조했다. | 40% (CQ-2 78/78주·1,170/1,170문항 완료; 정밀 40.00%); 대상 39/39, 전체 npm test 205/205, release audit 97개 파일·최대 9.621 MiB 통과; 다음 CQ-3 Spring Boot W1–W3 |
| 2026-10-15 | CQ-3 Spring Boot W1–W3 | 생성자 주입·서비스 책임·외부 설정의 45문항을 검토했다. 설정 환경 변수·속성 Bean 등록·검증 provider 전제를 코드와 설명에 맞추고, 의미 변경 문항은 새 `-v2` ID로 분리했다. Spring MVC 및 Boot 4.1.1 공식 문서를 대조했다. | 40% 유지 (CQ-3 3/115주·45/1,725문항; 가중 40.39%); Spring 회귀 40/40, 전체 npm test 206/206, release audit 97개 파일·최대 9.621 MiB 통과; Spring W4–W6 다음 |
| 2026-10-15 | CQ-3 Spring Boot W4–W6 | HTTP 안전성·요청 바인딩·상태 계약·Bean Validation·예외 응답·trace 문맥을 45문항에 연결했다. 거짓 중복 문항, 201/404 주제 불일치, 실제 결함이 아닌 오류 줄, 무관한 locate 힌트를 고쳤고 의미 변경에는 `-v2` ID를 썼다. Framework·Boot·Micrometer 공식 자료를 대조했다. | 41% (CQ-3 6/115주·90/1,725문항; 정밀 40.78%); 전용 41/41, 전체 npm test 207/207, release audit 97개 파일·최대 9.621 MiB 통과; 다음 Spring W7–W9 |
| 2026-10-15 | CQ-3 Spring Boot W7–W9 | 트랜잭션과 외부 부작용·롤백 규칙·프록시 자기 호출·읽기 전용 힌트, 메서드 보안 전제·경로 규칙, MVC 테스트 슬라이스·MockMvc 계약을 45문항에 맞췄다. 외부 이메일 발송 예제와 롤백 오개념, 실제 결함이 아닌 오류 줄, 테스트 격리 전제를 고쳤다. Framework·Security·Boot 공식 자료를 대조했다. | CQ-3 9/115주·135/1,725문항; 전용 42/42, 전체 `npm test` 208/208, release audit 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사 통과; 다음 Spring W10–W12 |
| 2026-10-15 | CQ-3 Spring Boot W10–W12 | 재시도·캐시·관측·API 설계 45문항의 주제 일치도를 검수했다. W11의 반복 단답과 주제 불일치 선택/오류 찾기를 구조화 로그·trace·cardinality·HTTP 관측·민감정보 경계로 바꾸고 W12 오류 찾기를 실제 권한/trace 결함에 맞췄다. Boot 4.1.1과 Framework 공식 문서를 대조했다. | CQ-3 12/115주·180/1,725문항; 대상 43/43, 전체 `npm test` 209/209, release audit 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사 통과; 정밀 진척 41.57%(표시 42%); 다음 Spring W13–W15 |
| 2026-10-15 | CQ-3 Spring Boot W13–W15 | 설정 바인딩·검증·Duration, Spring Data 페이지 기본값·정렬 허용 목록·안정된 페이지 응답, 지연 로딩·fetch join·N+1·DTO projection·성능 측정을 45문항과 예제에 대조했다. 모든 단답과 오류 찾기 질문을 날짜별 조건에 맞추고 Hibernate 통계의 prepared statement 획득 수를 SQL 실행 수와 혼동하지 않도록 표시했다. Boot·Spring Data·Hibernate 공식 문서를 대조했다. | CQ-3 15/115주·225/1,725문항; 전용 44/44, 연계 52/52, 전체 `npm test` 210/210, release audit 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사 통과. 정밀 진척 41.96%(표시 42%); 다음 Spring W16–W18; 앱·DB 실행은 미검증 |
| 2026-10-15 | CQ-3 Spring Boot W16–W18 | 트랜잭션 이후 이벤트·outbox, 테스트 슬라이스·`@MockitoBean`, JPA flush/clear·rollback, Testcontainers datasource 연결·수명주기, migration 검증 등 45문항을 시나리오에 맞췄다. 중복 전달·테스트 프로파일·공유 ID·과한 통합 테스트 전제를 명시하고 답·힌트·locate 및 단답 해설을 일치시켰다. Boot·Framework·Testcontainers 공식 문서를 대조했다. | CQ-3 18/115주·270/1,725문항; 전용 Spring 회귀 13/13, 전체 `npm test` 210/210, release audit 97개 파일·최대 9.621 MiB, 의존성·구문 검사 통과; 정밀 진척 42.35%(표시 42%); 다음 Spring W19–W21; 앱·컨테이너·DB 실행 미검증 |
| 2026-10-15 | CQ-3 Spring Boot W19–W21 | JWT decoder·issuer/audience·SCOPE authority, CORS origin/credentials/method, cookie CSRF, @Async proxy·bounded executor·예외·context 전달·interrupt를 45문항과 공식 문서에 대조했다. 반복 단답·무관한 locate 힌트를 상황별로 바꾸고 정답 위치를 A/B/C 각 5개로 균형화했다. 추가로 W16–W21의 30개 오늘의 예제를 의도된 정답 코드로 분리해 학습용 예제와 결함 찾기 자극을 구분했다. | CQ-3 21/115주·315/1,725문항; 전용 Spring 회귀 13/13, 전체 `npm test` 210/210, release audit 97개 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문 검사 통과; `git diff --check` 통과(줄바꿈 안내만). 정밀 진척 42.74%(표시 43%); 다음 Spring W22–W24; 실제 앱·컨테이너·DB 미검증 |
| 2026-10-15 | CQ-3 Spring Boot W22–W24 | Actuator·probe·메트릭, Docker 이미지·빌드/실행 비밀, rolling 배포·스키마 호환·복구 45문항과 15개 올바른 학습 예제를 보완했다. 반복 문항·정답 쏠림·무관한 locate 힌트를 날짜별 실제 운영 조건에 맞추고 Boot·Kubernetes·Docker 공식 문서를 대조했다. | CQ-3 24/115주·360/1,725문항; 대상 교차 회귀 22/22, 전체 `npm test` 211/211, release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. 정밀 진척 43.13%(표시 43%); 실제 Spring 앱·컨테이너·Kubernetes·DB 미실행; 다음 Spring W25–W26 |
| 2026-10-15 | CQ-3 Spring Boot W25–W26 | API 호환성·OpenAPI 계약과 운영 API capstone 30문항의 정답 쏠림·반복 문항·오류 예제 재사용을 고쳤다. 정원 경합·객체 인가·안전한 오류·메트릭 태그를 실제 조건에 맞추고 선택지 ID를 새 버전으로 분리했다. | Spring 26/26주 완료; CQ-3 26/115주·390/1,725문항; 대상 회귀 23/23, 전체 `npm test` 212/212, release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. 정밀 진척 43.39%(표시 43%); 앱·인증·DB 동시성 미실행; 다음 React W1–W3 |
| 2026-10-15 | CQ-3 React W1–W3 | JSX·컴포넌트·props·조건부 렌더링·목록 key·이벤트·state snapshot 45문항에서 주제명 반복 단답, 날짜 간 중복 문항, 실제 결함 줄과 어긋난 locate, 충분한 입력 맥락이 없던 코드를 고쳤다. 레거시 문항과 생성 문항의 형식 중복도 제거하고 React 19.3 및 공식 학습 문서를 대조했다. | React 전용·콘텐츠 회귀 50/50, 전체 `npm test` 213/213, release audit 97개 파일·최대 9.621 MiB, 구문·의존성·diff 검사 통과. CQ-3 29/115주·435/1,725문항; 정밀 진척 43.78%(표시 44%); React 렌더·브라우저 DOM 실행 미검증; 다음 React W4–W6; 제품·비용·서비스·DB·배포 변경 없음 |

| 2026-10-15 | CQ-3 React W7–W9 콘텐츠 품질 검수 | reducer/action/Context, custom Hook 계약·Effect cleanup, 비동기 요청 상태 45문항에서 action 단답 중복, 다른 날짜의 오류 코드 재사용, loading·빈 성공 분기 설명을 고쳤다. 새 의미에는 `-v3` ID를 분리하고 official reducer·Context·Hooks 문서를 대조했다. | React 전용 52/52, 전체 `npm test` 215/215, release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. CQ 44.17% → 44.57%(표시 45%, CQ-3 35/115주·525/1,725문항); 브라우저 렌더·network Effect 미검증; 다음 React W10–W12; 서비스·DB·계정·결제·비용·배포 변경 없음 |
| 2026-10-15 | CQ-3 React W22–W24 | 저장소 오류 복구, 코드 분할·Suspense 대기, 사전 로딩의 비용 정책, reducer 전이 45문항을 날짜 목표에 맞췄다. W22D4 repair와 W23D5 선택 문항의 주제 불일치를 수정하고 React/MDN 공식 문서와 대조했다. | 대상 26/26; 최종 전체 `npm test` 221/221, release audit 97개 파일·최대 9.621 MiB; CQ-3 50/115주·750/1,725문항, 정밀 46.52%; 실제 브라우저 저장·React renderer 미실행; 다음 React W25–W26 |
| 2026-10-15 | CQ-3 React W25–W26 | 키보드 submit, 저장 성공·실패와 draft 보존, 빈/error/loading 상태의 통합 capstone, 카탈로그에서 검증한 resume href를 검수했다. 주제 밖 repair를 새 버전으로 교체하고 성공 결과 피드백을 포함했다. | React 품질 회귀 27/27, 전체 `npm test` 221/221, release audit 97개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과; CQ-3 52/115주·780/1,725문항, 정밀 46.78%; 브라우저 DOM·키보드·localStorage 미실행; 다음 FastAPI W1–W3 |
| 2026-10-15 | CQ-3 FastAPI W1–W3 | 요청·경로 변수·타입 검증의 45문항, 주간/일간 예제 관계, 실제 코드 결함을 검수하고 복사된 단서·피드백과 잘못된 자연어 코드 진단을 고쳤다. 공식 FastAPI 0.143.1 문서 안정판과 검증 완료된 실행기 0.143.0을 구분했다. | 배치 41/41, 전체 `npm test` 223/223, release audit 98개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과; Python AST 29/30(1개는 의도적 문법 오류); 서버·브라우저 Worker 통합 미실행; CQ-3 55/115주·825/1,725문항, 전체 정밀 47.17%; 다음 FastAPI W4–W6 |
| 2026-10-15 | CQ-3 FastAPI W4–W6 | 반복 예제·힌트·오류 스니펫을 교체하고 쿼리 위치·다중값·Pydantic 모델·중첩 필드와 입력 경계 45문항을 맞췄다. Pydantic v2 nullable 규칙을 공식 자료로 확인하고 필터/권한 혼동 및 통화 `float` 예제를 없앴다. | 배치 4/4, 전체 `npm test` 224/224, release audit 98개 파일·최대 9.621 MiB, 구문·diff 검사 통과; AST 30/30; 서버·브라우저 Worker 미실행; CQ-3 58/115주·870/1,725문항, 전체 정밀 47.57%; 다음 FastAPI W7–W9 |
| 2026-10-15 | CQ-3 FastAPI W7–W9 | response_model의 공개 출력과 권한 분리, 응답 계약, 201/204/404, 헤더 방향, Depends callable·값 주입·공유 규칙 45문항을 검수했다. fixture 전제와 중복 결함으로 모호하던 locate 사례를 수정했다. | FastAPI 회귀 파일 5/5, 전체 `npm test` 225/225, release audit 98개 파일·최대 9.621 MiB, 의존성·구문·diff 통과; Python AST 30/30; 서버/Worker 미실행; CQ-3 61/115주·915/1,725문항, 전체 정밀 47.96%; 다음 FastAPI W10–W12 |
| 2026-10-15 | CQ-3 FastAPI W10–W12 | Annotated 별칭·하위 의존성, yield cleanup·비동기 close·요청 범위 cache와 scope, APIRouter URL 구성·OpenAPI tags 45문항을 날짜별로 재작성했다. | FastAPI 회귀 6/6, 전체 `npm test` 226/226, release audit 98개 파일·최대 9.621 MiB, 의존성·구문·diff 통과; Python AST 30/30; 앱/HTTP/Worker 미실행; CQ-3 64/115주·960/1,725문항, 전체 정밀 48.35%; 다음 FastAPI W13–W15 |
| 2026-10-15 | CQ-3 FastAPI W13–W15 | await와 blocking/CPU 경계, middleware request/response stack, 401·403·404 및 안전한 HTTP error 계약을 45문항의 예제와 locate 줄에 일치시켰다. | FastAPI 회귀 7/7, 전체 `npm test` 227/227, release audit 98개 파일·최대 9.621 MiB, 의존성·구문·diff 통과; Python AST 30/30; 서버/HTTP/Worker 실행 미검증; CQ-3 67/115주·1,005/1,725문항, 정밀 48.74%; 다음 FastAPI W16–W18 |
| 2026-10-15 | CQ-3 FastAPI W16–W18 | 요청·응답 검증 오류, lifespan 수명과 상태 범위, 리소스 경로·POST 201·PATCH 부분 수정·DELETE 204 45문항을 고쳤다. | 전용 회귀 8/8, 전체 `npm test` 228/228, release audit 98개 파일·최대 9.621 MiB, Python AST 30/30, 의존성·구문·diff 검사 통과; 앱/HTTP/lifespan/DB 미실행; CQ-3 70/115주·1,050/1,725문항, 정밀 49.13%; 다음 W19–W21 |
| 2026-10-15 | CQ-3 FastAPI W19–W21 | Bearer credential 추출·실제 검증 범위, 401 challenge·403 권한 검사·소유권·최소 권한, TestClient와 lifespan/status/json 사용 45문항을 날짜별 사례로 정리했다. | 전용 회귀 9/9, 전체 `npm test` 229/229, release audit 98개 파일·최대 9.621 MiB, Python AST 30/30, 의존성·구문·diff 검사 통과; FastAPI 인증/TestClient/HTTPX 미실행; CQ-3 73/115주·1,095/1,725문항, 정밀 49.52%; 다음 W22–W24 |
| 2026-10-15 | CQ-3 FastAPI W22–W24 | 테스트 dependency 대체·복구와 격리, HTTPX 비동기 ASGI와 lifespan 경계, 페이지 크기 검증·안전 정렬·offset 계산 45문항을 검수하고 모호한 질문·피드백을 수정했다. | 전용 회귀 10/10, 전체 `npm test` 230/230, release audit 98개 파일·최대 9.621 MiB, Python AST 30/30, 의존성·구문·diff 검사 통과; 앱·HTTPX·DB 미실행; CQ-3 76/115주·1,140/1,725문항, 정밀 49.91%; 다음 W25–W27 |
| 2026-10-15 | CQ-3 FastAPI W25–W27 | CORS 출처·preflight·인증 경계, BackgroundTasks 등록·응답 후 실행·내구성 한계, Settings·secret source를 45문항에서 구별하고 예제·오류 진단을 보완했다. | 전용 회귀 11/11, 전체 `npm test` 231/231, Python AST 30/30, release audit 98개 파일·최대 9.621 MiB; CQ-3 79/115주·1,185/1,725문항, 정밀 50.30%(표시 50%); 실제 앱/browser/설정 로딩 미실행; 다음 FastAPI W28–W30 |
| 2026-10-15 | CQ-3 FastAPI W28–W30 | 구조화 로그·민감 정보 경계, Kubernetes probe 역할, 안전한 오류와 계측, FastAPI 버전·호환성·telemetry 변경, 운영 API capstone 45문항을 검수했다. | FastAPI 회귀 12/12, 전체 `npm test` 232/232, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, Python AST 15/15, 구문·diff 검사 통과; 서버·Kubernetes·로그 수집기·HTTPX·DB 미실행; CQ-3 82/115주·1,230/1,725문항, 정밀 50.70%(표시 51%); 다음 Next.js W1–W3 |
| 2026-10-15 | CQ-3 Next.js W1–W3 | 프레임워크 책임, App Router 파일 경로·예약 파일, 개발/빌드/서버 실행, page·root/nested layout·route group·private folder 45문항의 반복 템플릿을 날짜별 요구와 적용 질문으로 교체했다. | Next.js 회귀 4/4, 전체 `npm test` 233/233, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, TSX 문법 5/5, 구문·diff 검사 통과; Next 서버·브라우저 렌더 미실행; CQ-3 85/115주·1,275/1,725문항, 정밀 51.09%(표시 51%); 다음 Next.js W4–W6 |
| 2026-10-15 | CQ-3 Next.js W4–W6 | Link와 외부 이동·history fallback·활성 경로 접근성, 비동기 route params와 catch-all 검증, 비동기 검색 query·반복 키·공개 URL 상태·안전한 페이지 숫자 45문항을 고쳤다. 공식 문서의 page prop 계약과 안정판 Next.js 16.4.1을 반영했다. | Next.js 회귀 5/5, 전체 `npm test` 234/234, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, TSX/JSX 구문 12/12, JS 구문·`git diff --check` 통과; 서버·브라우저 이동 미실행; CQ-3 88/115주·1,320/1,725문항, 정밀 51.48%(표시 51%); 다음 Next.js W7–W9 |
| 2026-10-15 | CQ-3 Next.js W7–W9 | Server Component와 좁은 client 경계, `server-only`, hydration, 직렬화 props·Server Function·최소 공개 DTO를 45문항의 일별 사례에 연결했다. | Next.js 회귀 6/6, TSX/JSX 구문 15/15, 전체 `npm test` 235/235, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문·`git diff --check` 통과; 서버 렌더·hydration·Server Function 미실행; CQ-3 91/115주·1,365/1,725문항, 정밀 51.87%(표시 52%); 다음 Next.js W10–W12 |
| 2026-10-15 | CQ-3 Next.js W10–W12 | Server Component 데이터 요청과 HTTP 오류 처리, 렌더 내 요청 메모이제이션·지속 캐시·Cache Components 모델 차이, `loading.tsx`·Suspense·오류 경계, Next.js 16.4.1의 `retry()`와 streaming `notFound()` 상태 한계를 45문항으로 연결했다. | Next.js 회귀 7/7, TSX/JSX 15/15, 전체 `npm test` 236/236, release audit 98개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문·`git diff --check` 통과; 실제 서버·HTTP·cache·streaming 미실행; CQ-3 94/115주·1,410/1,725문항, 정밀 52.26%(표시 52%); 다음 Next.js W13–W15 |
| 2026-10-15 | CQ-3 Next.js W13–W15 | metadata·canonical·OG 공유 경계, HTTP Route Handler와 static export 지원, 요청 schema·페이지 제한·멱등성·오류 상태를 45문항과 예제로 검수했다. Next.js 공식 metadata·route·BFF·static export 문서와 RFC 9110을 대조했다. | 배치 회귀 1/1, Next.js 품질 파일 9/9, 통합 콘텐츠 검사 40/40, TSX 15/15, 전체 `npm test` 238/238, release audit 98개 파일·최대 9.621 MiB, 의존성·JS 문법·diff 검사 통과; 앱·HTTP·정적 export 미실행; CQ-3 97/115주·1,455/1,725문항, 정밀 52.65%(표시 53%); 다음 W16–W18 |
| 2026-10-15 | CQ-3 Next.js W16–W18 | Server Action 폼·입력과 권한 검사, 캐시 변경 후 최신 화면 계약, cookie/header 신뢰·개인 데이터 cache 경계를 45문항으로 검수했다. 발견한 JSX 형제 요소 루트 오류를 fragment로 고치고 정답 분포를 균형화했다. | 배치 회귀 1/1, Next.js 품질 파일 9/9, TSX 15/15, 전체 `npm test` 238/238, release audit 98개 파일·최대 9.621 MiB, 의존성·JS 문법·diff 검사 통과; 실제 서버·Action·인증·캐시·browser 동작 미실행; CQ-3 100/115주·1,500/1,725문항, 정밀 53.04%(표시 53%); 다음 W19–W21 |
| 2026-10-15 | CQ-3 Next.js W19–W21 | Cache Components 설정과 이전 cache model, 데이터 owner·cache life·tag/path 재검증, XSS text/raw HTML, URL origin allowlist·userinfo, Server Action 권한·Origin 경계, nonce CSP와 정적 배포, 로그 비밀/개행 정제, 이미지 alt·remotePatterns·sizes·폰트 라이선스·public 공개 범위를 45문항과 15개 예제에 맞췄다. Next.js 공식 cache·security·image·font·CSP 자료 및 OWASP XSS·redirect·logging 자료를 대조했다. | 배치 회귀 1/1, Next.js 품질 파일 10/10, 콘텐츠+Next.js 검사 41/41, TSX 15/15, 전체 `npm test` 239/239, release audit 99개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 및 diff 검사 통과; 실제 Next 서버·cache·Action·브라우저 동작 미실행; CQ-3 103/115주·1,545/1,725문항, 정밀 53.43%(표시 53%); 다음 W22–W24 |

| 2026-10-15 | CQ-3 Next.js W22–W24 | landmark·제목 계층, label/error/status/focus, 움직임 축소, 네 테스트 범위와 UI 상태 회귀, client 경계·dynamic import, lazy/preload 이미지, Web Vitals·lab/field 비교를 45문항·15개 예제로 검수했다. | Next.js 회귀 11/11, 콘텐츠+Next.js 42/42, TSX 15/15, 전체 `npm test` 240/240, release audit 100개 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문·diff 통과; 앱/Jest/jsdom/browser/field 수집 미실행; CQ-3 106/115주·1,590/1,725문항, 정밀 53.83%(표시 54%); 다음 W25–W27 |
| 2026-10-15 | CQ-3 Next.js W25–W27 | React/Next 실행 경계·Context·Effect cleanup·Action 인가, version/lockfile·Next 16 migration, 타입/build/runtime 오류와 민감값 없는 최소 재현을 45문항·15개 예제로 보완했다. | 품질 회귀 12/12, 콘텐츠+Next.js 43/43, TSX 15/15, 전체 `npm test` 241/241, release audit 102개 파일·최대 9.621 MiB, 의존성·JS 구문 통과; Next 서버/runtime 미실행; CQ-3 109/115주·1,635/1,725문항, 정밀 54.22%; 다음 W28–W30 |
| 2026-10-15 | CQ-3 Next.js W28–W30 | 경로·browser navigation 검사, 제한 오류 관측·retry/cancel/error-boundary, static serverless 경계, DAL·transaction·점진 migration·object authorization·브라우저 백업 45문항과 15개 예제를 보완했다. | 전용+콘텐츠 44/44, TSX 15/15, 전체 `npm test` 242/242, release audit 104개 파일·최대 9.621 MiB, 의존성·구문·diff 통과; Next 서버·브라우저·PostgreSQL 실행 미검증; CQ-3 112/115주·1,680/1,725문항, 정밀 54.61%; 다음 W31–W33 |
| 2026-10-15 | CQ-3 Next.js W31–W33 | 정적 export GET/요청 runtime, 미리 생성 route, hydration과 browser API, 산출물·basePath·env 공개/고정, 무료 host 근거, 대시보드 capstone·검증 보고 45문항을 검수했다. | 대상 45/45, 정답 A/B/C 각 5개, TSX 15/15, 전체 `npm test` 243/243, release audit 106개 파일·최대 9.621 MiB, 의존성·구문·diff 통과; Next server/실제 preview 미검증; CQ-3 115/115주·1,725/1,725문항 완료; CQ 전체 55.00%; 다음 CQ-4 TypeScript W1–W3 |

| 2026-10-15 | CQ-4 TypeScript W1–W3 | 기본 타입, nullish 값, 변수 추론, 함수 매개변수·반환 계약의 예제 15개와 45문항을 날짜별 목표에 맞춰 다시 작성했다. TypeScript 7.0.2와 6.0.3 실행기 경계를 분리했다. | W1–W3 검수 완료, 대상 회귀·엄격 타입검사 통과; CQ-4 3/92주·45/1,380문항, 전체 정밀 55.49%; 다음 W4–W6 |
| 2026-10-15 | CQ-4 TypeScript W4–W6 | 배열 표기·readonly·튜플·map, 객체 필수/선택/얕은 readonly/중첩/구조적 호환, 기본·리터럴 유니온과 공통 속성을 45문항·15개 예제로 대조했다. A/B/C 정답은 각 5개다. | W4–W6 회귀, 전체 `npm test` 246/246, release audit 108개 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과; W1–W6 엄격 타입 진단과 출력 30개씩 확인; TypeScript 7 브라우저 실행·UI 미검증; CQ-4 6/92주·90/1,380문항, 전체 정밀 55.98%; 다음 W7–W9 |

| 2026-10-15 | CQ-4 TypeScript W7–W9 | typeof/in/명시적 null 검사, truthiness와 빈 문자열 정책, 판별 유니온·never, 제네릭 추론을 45문항·15개 날짜별 예제로 검수했다. 대체된 handbook 유니온 페이지 링크를 현행 Narrowing 문서로 교체했다. | W7–W9 회귀 1/1, fault line 타입 진단 14개 및 truthiness 재현 통과, 예제·수리안 30개 엄격 검사, 정답 A/B/C 각 5개, 전체 `npm test` 247/247, release audit 109개 파일·최대 9.621 MiB; TypeScript 7/browser 실행은 미검증; CQ-4 9/92주·135/1,380문항, CQ 전체 56.47%; 다음 W10–W12 |

| 2026-10-15 | CQ-4 TypeScript W10–W12 | 제네릭 제약·keyof·T[K], Partial/Pick/Omit/Required/Record, 매핑·readonly·조건부·infer·분배 타입을 45문항과 15개 예제로 연결했다. 타입 도우미와 실행 객체 변환을 분리했다. | W10–W12 회귀 1/1, 타입 오류 위치 13개, Pick/Omit 계약 확인, 엄격 타입/출력 30/30, 정답 A/B/C 각 5개, 전체 `npm test` 248/248, release audit 110개 파일·최대 9.621 MiB; TypeScript 7/browser 미검증; CQ-4 12/92주·180/1,380문항, CQ 전체 56.96%; 다음 W13–W15 |
| 2026-10-15 | CQ-4 TypeScript W13–W15 | named/default 모듈 경계와 resolver/target/module/strict 설정, Promise·await·catch·Promise.all 튜플, implements·private/#private·readonly·매개변수 속성·합성을 45문항·15개 예제로 검수했다. | W13–W15 회귀 1/1, 가상 모듈 import 오류 2건, 결함 위치 13개, 정답 A/B/C 각 5개, 예제·수리안 30개 엄격 검사; 전체 TypeScript 75/75 예제·75/75 수리안; 전체 `npm test` 249/249, release audit 111개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. CQ-4 15/92주·225/1,380문항, CQ 전체 57.45%; 다음 W16–W18 |
| 2026-10-15 | CQ-4 TypeScript W16–W18 | typeof/Array.isArray/in/predicate narrowing, unknown·any·JSON runtime validator, overload·callback·this와 union 입력을 45문항·15개 예제로 검수했다. | W16–W18 회귀 1/1, 실제 결함 타입 진단 12줄, 거짓 predicate 예외·type assertion runtime 문자열 재현, 예제/수리안 30개 엄격 검사, A/B/C 각 5개, W1–W18 예제·수리안 90개씩 엄격 검사 및 출력 추적, 전체 `npm test` 250/250, release audit 112개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. CQ-4 18/92주·270/1,380문항, CQ 전체 57.93%; 다음 W19–W21 |
| 2026-10-15 | CQ-4 TypeScript W19–W21 | `.d.ts`/declare와 runtime 구현, `allowJs`·`checkJs`·JSDoc, strict/nullish 경계, 타입 테스트와 정상·경계·오류·회귀 실행 테스트 45문항·15개 예제를 검수했다. | 전용 회귀·가상 패키지 `exports.types` 해석·미사용 `@ts-expect-error` 진단, W1–W21 예제/수리안 엄격 타입·JS checkJs·출력 검사 통과. 전체 `npm test` 251/251, release audit 113개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 파일 구문·`git diff --check` 통과. TypeScript 7 브라우저 실행·실제 다중 파일 제품 에디터는 미검증. CQ-4 21/92주·315/1,380문항, CQ 전체 58.42%; 다음 W22–W24; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |

| 2026-10-15 | CQ-4 TypeScript W22–W24 | type/value import, strict 부가 옵션·DOM null·JSX props, 저장 버전과 JSON 런타임 검증·allowlist·라이선스·백업 복원, 타입·실행·접근성·버전별 증거를 45문항·15개 예제로 다시 연결했다. | 전용 회귀에서 가상 ESM/TSX 진단, strict 설정별 오류, 잘못된 guard·라이선스 누락·조기 상태 교체·NaN·거짓 회귀 성공을 실행 확인. W1–W24 예제·수리안을 strict 검사하고 출력 대조. 전체 `npm test` 253/253, release audit 114개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 통과. 실제 TS 7 브라우저 UI·다중 파일 에디터는 미검증. CQ-4 24/92주·360/1,380문항, CQ 전체 58.91%; 다음 W25–W26; 외부 서비스·비용·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-15 | CQ-4 TypeScript W25–W26 | 버전별 저장 마이그레이션, unknown 복구, 정확한 허용 목록, 패키지·라이선스 검토, 검증 후 백업 교체와 통합 회귀·타입/실행 증거·키보드 점검을 30문항·10개 예제로 검수했다. | 전용 TypeScript 회귀 16/16, W1–W26의 예제/수리안 strict 진단과 출력, 비정상 JSON·미래 버전·부분 문자열·미검토 패키지·복원 전 상태 변경·NaN·좁은 테스트 범위를 실행 재현. 전체 `npm test` 255/255, release audit 115개 정적 파일·최대 9.621 MiB; 의존성·구문·diff 검사 통과. TypeScript 7 UI와 실제 DOM/화면 낭독기/키보드 실행은 미검증. TypeScript 26/26주·390/390문항 완료; CQ-4 26/92주·390/1,380문항, CQ 전체 59.24%; 다음 Kotlin·Android W1–W3; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-15 | CQ-4 Kotlin·Android W1–W3 | Kotlin 진입점·플랫폼 경계, val/var·타입 추론·초기화·컴파일 상수, 숫자 변환·오버플로·Double·Char·문자열 템플릿을 45문항·15개 날짜별 예제로 연결했다. 누락된 결과 힌트·해설 15개를 보완하고 Kotlin 공식 문서와 Android Activity 수명 주기 자료를 대조했다. | 전용 Kotlin 검사 3/3, 공통 콘텐츠+Kotlin 검사 34/34, 전체 `npm test` 256/256, `npm run check:release` 116개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사 통과. Kotlin 컴파일러가 없어 예제를 컴파일하지 않았으며 제품도 Kotlin/Android 실행을 지원하지 않음. CQ-4 29/92주·435/1,380문항, CQ 전체 59.73%; 다음 W4–W6; 서비스·DB·계정·결제·유료 의존성·공개 배포 변경 없음 |
| 2026-10-15 | CQ-4 Kotlin·Android W4–W6 | if/when의 완전성·단락 평가·enum 상태, 폐·반개구간 경계, collection 순회·감소 progression·종료 조건·withIndex, 함수 매개변수·반환·기본/이름 있는 인자·Unit을 45문항·15개 예제로 구성했다. | Kotlin 공식 [조건문·반복문](https://kotlinlang.org/docs/control-flow.html), [범위](https://kotlinlang.org/docs/ranges.html), [함수](https://kotlinlang.org/docs/functions.html) 문서와 대조했다. 전용 Kotlin 검사 4/4, 공통 콘텐츠+Kotlin 35/35, 전체 `npm test` 257/257, release audit 117개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. Kotlin 컴파일러가 없어 코드 실행은 미검증이고 제품은 Kotlin/Android 실행을 지원하지 않음. CQ-4 32/92주·480/1,380문항, CQ 전체 60.22%; 다음 W7–W9; 유료 서비스·DB·계정·결제·공개 배포 변경 없음 |

| 2026-10-16 | CQ-4 Kotlin·Android W7–W9 | 람다·고차 함수·it·후행 람다·클로저, List/Set/Map의 순서·중복·키·map/filter, 읽기 전용 별칭·새 컬렉션·Sequence의 지연·비용 선택을 45문항과 15개 날짜별 예제로 연결했다. | Kotlin 공식 [람다·고차 함수](https://kotlinlang.org/docs/lambdas.html), [컬렉션 구조](https://kotlinlang.org/docs/collections-overview.html), [연산 개요](https://kotlinlang.org/docs/collection-operations.html), [변환](https://kotlinlang.org/docs/collection-transformations.html), [filter](https://kotlinlang.org/docs/collection-filtering.html), [Map 연산](https://kotlinlang.org/docs/map-operations.html), [Sequence](https://kotlinlang.org/docs/sequences.html) 및 최신 안정판·Android 17 공식 정보를 대조했다. | 전용 Kotlin 회귀 5/5, 공통 콘텐츠+Kotlin 36/36, 전체 `npm test` 258/258, release audit 118개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 통과. 로컬 Kotlin 컴파일러가 없어 실제 Kotlin 실행은 하지 않았고 제품도 Kotlin/Android 실행 채점을 제공하지 않는다. CQ-4 35/92주·525/1,380문항, CQ 전체 60.71%; 다음 W10–W12; 서비스·DB·계정·결제·배포 변경 없음 |
| 2026-10-16 | CQ-4 Kotlin·Android W13–W15 | data class의 주 생성자 기반 동등성·구조 분해·얕은 복사, enum의 선언 순서와 안정 코드, sealed when 완전성, value class의 도메인 타입·boxing, 기본 final·open/override·인터페이스·구성·by 위임, 확장 함수의 접근·정적 해석과 nullable receiver, let/apply/run의 receiver·반환값을 45문항·15개 코드 추적 사례로 다시 연결했다. 변경된 문제는 기존 답 기록과 혼동하지 않도록 v2 ID를 사용했다. | Kotlin 공식 [data classes](https://kotlinlang.org/docs/data-classes.html), [enum classes](https://kotlinlang.org/docs/enum-classes.html), [sealed classes](https://kotlinlang.org/docs/sealed-classes.html), [inline value classes](https://kotlinlang.org/docs/inline-classes.html), [inheritance](https://kotlinlang.org/docs/inheritance.html), [interfaces](https://kotlinlang.org/docs/interfaces.html), [delegation](https://kotlinlang.org/docs/delegation.html), [extensions](https://kotlinlang.org/docs/extensions.html), [scope functions](https://kotlinlang.org/docs/scope-functions.html)를 대조했다. | 전용 Kotlin 회귀 7/7, 전체 `npm test` 260/260, `npm run check:release` 120개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 변경 JS 구문·`git diff --check` 통과. 로컬 Kotlin 컴파일러가 없어 실제 Kotlin 컴파일·실행은 하지 않았고 제품도 Kotlin/Android 실행 채점을 제공하지 않는다. CQ-4 41/92주·615/1,380문항, CQ 전체 61.68%; 다음 W16–W18; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |

| 2026-10-16 | CQ-4 Kotlin·Android W16–W18 콘텐츠 품질 검수 | 제네릭 함수·클래스 계약, out·in variance, star projection·타입 소거, Java platform type·nullability 어노테이션, Kotlin 2.4.0 안정·실험 기능과 2.4.21 patch, try/finally·require/check·sealed 결과·Result·재시도 안전성을 45문항·15개 추적 예제로 구성했다. | Kotlin 공식 Generics·Java interop·2.4.0 What's New·release table·exceptions·Result·runCatching 문서를 대조했다. 전용 Kotlin 회귀 8/8을 통과했다. 전체 테스트와 정적 출시 감사 결과는 진행 기록에 추가한다. Kotlin 컴파일러가 없어 실제 컴파일·실행하지 않았고 앱도 Kotlin 실행 채점을 제공하지 않는다. CQ-4 44/92주·660/1,380문항, CQ 전체 62.17%; 다음 W19–W21; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |

| 2026-10-16 | CQ-4 Kotlin·Android W19–W21 콘텐츠 품질 검수 | suspend와 스레드 전환 구분, coroutineScope·launch/Job·async/Deferred, dispatcher 용도, 부모 Job 취소·협력 취소·CancellationException 재전파·timeout/null, cold Flow 수집과 재수집, StateFlow 최신값, SharedFlow replay·lifecycle-aware collection을 45문항·15개 코드 추적으로 검수했다. | Kotlin coroutine basics·context/dispatchers·cancellation·exceptions·Flow·CoroutineScope·launch/async·StateFlow와 Android lifecycle 공식 자료를 대조했다. 전용 Kotlin 회귀 9/9를 통과했다. 전체 검증 수치는 진행 기록에 남겼다. Kotlin 컴파일러와 Android 실행 환경이 없어 코드 실행·기기 수명주기는 확인하지 않았고 사이트도 이를 실행 채점하지 않는다. CQ-4 47/92주·705/1,380문항, CQ 전체 62.66%; 다음 W22–W24; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 Kotlin·Android W22–W24 콘텐츠 품질 검수 | runTest 가상 시간과 dispatcher scheduler, StandardTestDispatcher 실행 시점, Main 대체 정리, Flow completion, Android module/source set·Manifest exported·SDK 세 값·API level guard·검증 계층, Activity 재생성·ViewModel·SavedStateHandle·영속 저장 경계를 45문항·15개 코드 추적으로 검수했다. | Kotlin coroutines-test 1.11.0과 Android Studio/build/Manifest/lifecycle/ViewModel/saving-state/architecture/Android 17 공식 문서를 대조했다. 전용 Kotlin 회귀 10/10, 전체 `npm test` 263/263, release audit 123개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문·`git diff --check` 통과. Kotlin compiler·Android SDK/device는 미설치라 Kotlin/Android 실행은 미검증. CQ-4 50/92주·750/1,380문항, CQ 전체 63.15%; 다음 Kotlin W25–W27; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 Kotlin·Android W25–W27 Compose UI·상태·적응형 화면 검수 | Composable의 선언형 입력과 재구성·부수 효과, Modifier 클릭 영역의 적용 순서, LaunchedEffect 키/취소, remember와 rememberSaveable의 보존 범위, state hoisting·단방향 event/state, LazyColumn 지연 구성·안정 key, type-safe navigation 인자, 현재 app window 기반 adaptive pane을 45문항·15개 코드 사례로 다시 연결했다. | Android 공식 [Thinking in Compose](https://developer.android.com/develop/ui/compose/mental-model), [State](https://developer.android.com/develop/ui/compose/state), [Side effects](https://developer.android.com/develop/ui/compose/side-effects), [Modifiers](https://developer.android.com/develop/ui/compose/modifiers), [Lazy lists](https://developer.android.com/develop/ui/compose/lists), [Navigation](https://developer.android.com/guide/navigation), [Adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive) 문서를 대조했다. W25–W27 전용 검사에서 45개 고유 문항·정답/오답 키·보기별 피드백·답 위치 분포와 표현 근거를 확인했다. | Kotlin 전용 회귀 11/11, 전체 `npm test` 264/264, release audit 124개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 4개 JS 구문 검사, `git diff --check` 통과. Kotlin compiler·Android SDK·emulator는 없어 Compose 빌드·렌더·기기 동작은 미검증이며 트랙은 정적 코드/UI 흐름 읽기다. CQ-4 53/92주·795/1,380문항, CQ 전체 63.64%; 다음 Kotlin W28–W30; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 Kotlin·Android W28–W31 데이터·접근성·실전 설계 검수 | W28–W30의 repository·Room/DataStore·Flow·offline 상태, semantics·터치 크기·최소 권한·비밀값·Android 17 LAN permission/picker, 성능·위험 기반 테스트·release evidence와 W31 학습 기록 앱 capstone을 60개 예제·180문항으로 연결했다. 최신 Android 17 API 37 LAN 동작과 Kotlin 2.4.21 안정 릴리스 및 Android architecture/accessibility/security/testing 지침을 공식 문서에서 대조했다. | Kotlin 전용 회귀 13/13, 전체 `npm test` 266/266, release audit 126개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, JS 구문 검사, `git diff --check` 통과. Android/Kotlin 도구 부재로 실제 compile/build/device/DB/permission/benchmark 검증은 미실행. CQ-4 57/92주·855/1,380문항, 전체 64.29%(표시 64%); Kotlin 전체 완료, 다음 C#·.NET W1–W3; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W1–W3 기초 문항 검수 | C#/.NET 경계·프로젝트 target·진입점/file-based app·정적 var·대입/비교·const·참조 공유·정수 overflow/변환·UTF-16·보간식 부수 효과·decimal 금액을 15개 예제·45문항으로 편집 검수했다. C# 14와 .NET 10.0.13 공식 자료를 대조했다. | 전용 C# 회귀 3/3, 전체 `npm test` 267/267. Version-source 검사는 GitHub 공식 dotnet/core release notes를 출처 목록으로 허용했다. C# compiler가 없어 예제 compile/run은 미실행. CQ-4 60/92주·900/1,380문항, 전체 64.78%(표시 65%); 다음 C#·.NET W4–W6; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W4–W6 제어 흐름·메서드 검수 | 조건 경계·단락 평가·switch/pattern, 반복 범위·종료·흐름 제어, 반환형·void·참조 전달·선택/이름 인자를 15개 예제와 45문항으로 편집하고 Microsoft 공식 문서와 대조했다. | 전용 4/4, 통합 콘텐츠·C# 35/35, 전체 `npm test` 268/268, release audit 128개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 검사 통과. SDK 10.0.400/runtime 10.0.11에서 스니펫 27개 빌드·실행(경고/오류 0); file-based restore는 필요한 runtime/ILCompiler 패키지가 오프라인에 없어 미확인. CQ-4 63/92주·945/1,380문항, CQ 전체 65.27%(표시 65%); 다음 C#·.NET W7–W9; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W7–W9 컬렉션·LINQ·널 안전성 검수 | 자료 구조의 중복·키·순서, LINQ 결과 형태와 지연 실행, nullable 분석·runtime guard를 15개 예제·45문항으로 검수했다. | Microsoft Learn 공식 collections/LINQ/null safety/ThrowIfNull 대조, C# 전용 5/5, 통합 36/36, 전체 `npm test` 269/269, release audit 129개 정적 파일·최대 9.621 MiB, 의존성·구문 검사 통과. 로컬 SDK 10.0.400/runtime 10.0.11에서 W1–W9 스니펫 42개를 빌드·실행(경고/오류 0). File-based restore와 .NET 10.0.13 runtime은 미확인. CQ-4 66/92주·990/1,380문항, CQ 전체 65.76%(표시 66%); 다음 C#·.NET W10–W12; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W10–W12 레코드·캡슐화·객체 설계 | record 값 동등성/얕은 복사, DTO·init, constructor·접근 제어·불변식, C# 14 field-backed property, interface·상속·구성·SRP를 15개 출력 예제·45문항으로 연결했다. | Microsoft Learn 공식 자료 대조, C# 전용 6/6, C#+콘텐츠 37/37, 전체 npm test 270/270, release audit 130개 정적 파일, SDK 10.0.400/runtime 10.0.11에서 W1–W12 스니펫 57개 빌드·실행(경고·오류 0). .NET 10.0.13 runtime·file-based restore·제품 C# 실행은 미검증/미지원. CQ-4 69/92주·1,035/1,380문항, 전체 CQ 66.25%(표시 66%); 다음 C# W13–W15; 유료·외부 서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W13–W15 제네릭·이벤트·예외 처리 | 제네릭 제약·공변성·읽기 별칭, lambda/delegate와 event 중복 구독, catch 순서·finally·TryParse·예외 원인·오류 응답을 15개 실행 예제와 45문항으로 검수했다. | Microsoft Learn 공식 generics/lambda/events/exception 문서 대조, C# 전용 7/7, 통합 38/38, 전체 npm test 271/271, release audit 131개 정적 파일, SDK 10.0.400/runtime 10.0.11에서 W1–W15 스니펫 72개 build/run·경고/오류 0. 외부 파일 시스템·서비스 동작 및 .NET 10.0.13 runtime은 미검증. CQ-4 72/92주·1,080/1,380문항, CQ 전체 66.74%(표시 67%); 다음 C# W16–W18; 비용·서비스·DB·계정·결제·공개 배포 변화 없음 |

| 2026-10-16 | CQ-4 C#·.NET W16–W18 자원·비동기·버전 기준 검수 | using/await using 정리와 저장 성공 차이, 경로·JSON·스트림 크기 경계, Task/await/async 반환·협력적 취소·동기 차단, C# 14 확장 멤버·null 조건 대입, .NET 10 LTS와 .NET 11 RC2 상태를 15개 실행 예제·45문항으로 검수했다. | Microsoft Learn async/TAP/cancellation/C# 14 자료와 공식 다운로드·릴리스 노트를 대조했다. 지원 정책 표는 10.0.12에 머물렀지만 더 최근 다운로드/서비스 표의 .NET 10.0.13(2026-10-13)을 최신 LTS patch로 적용하고, .NET 11.0.0-rc.2는 pre-release로 구분했다. C# 전용 8/8, 통합 콘텐츠 39/39, 전체 `npm test` 272/272, release audit 131개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사를 통과했다. SDK 10.0.400/runtime 10.0.11 오프라인 harness에서 W1–W18 예제 87개를 빌드하고 W16–W18 결과 15개를 정답 trace와 대조(경고·오류 0). file-based restore·외부 실제 파일/HTTP와 .NET 10.0.13 runtime, 제품 C# 실행은 미검증 또는 미지원. CQ-4 75/92주·1,125/1,380문항, CQ 전체 67.23%(표시 67%); 다음 C#·.NET W19–W21; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |

| 2026-10-16 | CQ-5 PostgreSQL W1–W3 표 조회·별칭·비교 경계 | 날짜마다 동일한 SQL 틀의 숫자만 바뀌는 반복, 목표와 무관한 어휘 회상·일반 오류 탐지, 오래된 19 Beta 4 버전 안내를 확인했다. 15개 입력 사례에 서로 다른 핵심 질의를 만들고 결과 추적·오답 해설·오류별 실행 수정안을 연결했다. | 공식 PostgreSQL 18 문서와 19 RC1 공지, PGlite 18.3에서 새 쿼리 15개 및 기존 전체 예제 195개 실행, 전용 6/6·전체 279/279·release audit 137개 파일 통과. CQ-5 1/21 배치, 정밀 전체 70.71%; 다음 PostgreSQL W4–W6. |

| 2026-10-16 | CQ-5 PostgreSQL W4–W6 논리·NULL·정렬 검수 | AND/OR/NOT과 괄호의 실제 포함 행, NULL과 빈 문자열·UNKNOWN·COALESCE, 동점과 NULL 정렬·LIMIT 경계를 날짜별 입력으로 재구성했다. 실행기 fixture에 선택적 메모 열을 추가하고 45문항의 오답 설명·오류 위치·작동 수정안을 교정했다. | 공식 PostgreSQL 18 논리·비교·정렬 문서를 대조했다. PGlite에서 정답·오류·수정 질의 각각 15개 실행, PostgreSQL 전용 검사 7/7, 전체 `npm test` 280/280, release audit 138개 정적 파일·최대 9.621 MiB 통과. CQ-5 2/21 배치·PostgreSQL 6/39주·90/585문항, 전체 정밀 71.43%; 다음 W7–W9. |

| 2026-10-16 | CQ-5 PostgreSQL W7–W9 페이지·문자열·날짜 검수 | 같은 쿼리의 LIMIT/OFFSET·날짜 숫자만 바뀌던 반복과 날짜 목표와 무관한 오류 찾기를 고쳤다. 마지막 부분 페이지, 한글 문자 길이, 1부터 시작하는 POSITION, LIKE와 ILIKE 차이, 반열린 날짜 범위, 날짜+간격, UTC 시간대 변환을 서로 다른 입력으로 추적한다. TIMESTAMPTZ 정의도 UTC instant 저장·입력 zone 미보존으로 바로잡았다. | PostgreSQL 18 공식 pagination·string/matching·datetime 문서, PGlite 18.3 결과; 정답/오류/복구 질의 45개 실행; PostgreSQL 전용 8/8·전체 `npm test` 281/281·release audit 139개 파일 통과. CQ-5 3/21 배치, PostgreSQL W1–W9 9/39주·135/585문항, 전체 72.14%; 다음 W10–W12. |

| 2026-10-16 | CQ-5 PostgreSQL W10–W12 중복·CASE·집계 검수 | 단일·복합 DISTINCT, COUNT DISTINCT, DISTINCT ON 최신 행, CASE 분기 순서, NULLIF, COUNT/SUM/AVG와 빈 입력 결과를 고유 데이터셋으로 연결했다. nullable bonus_points fixture를 추가하고 정답·오답 피드백·수정 SQL을 직접 검증했다. | PostgreSQL 18 SELECT·conditional·aggregate 공식 문서 대조, PGlite 정답·오류·수정 질의 각각 15개 실행, PostgreSQL 전용 9/9·전체 `npm test` 282/282·release audit 140개 통과. CQ-5 4/21 배치, PostgreSQL W1–W12 12/39주·180/585문항, 전체 72.86%; 다음 W13–W15. |

| 2026-10-16 | CQ-5 PostgreSQL W13–W15 그룹·조인 검수 | GROUP BY 키·WHERE/HAVING 순서·집계 그룹 수, PK/FK 기반 INNER JOIN, 별칭·일대다 결과, LEFT JOIN 미일치 행과 COUNT 차이·ON/WHERE 위치를 fixture 행으로 검수했다. | PostgreSQL 18 table expressions 및 JOIN 튜토리얼 대조, 정답/오류/복구 질의 45개 PGlite 실행, 전용 회귀 10/10·전체 `npm test` 283/283·release audit 141개 통과. CQ-5 5/21 배치, PostgreSQL W1–W15 15/39주·225/585문항, 전체 73.57%; 다음 W16–W18. |
| 2026-10-16 | CQ-5 PostgreSQL W16–W18 다대다·하위 질의 검수 | 중간 연결 표로 만드는 다대다 결과, 다중 태그 JOIN 집계의 중복, `NOT IN`과 NULL, `EXISTS`/`NOT EXISTS`, scalar subquery의 0행·여러 행을 실제 입력으로 구성했다. 문제 은행 공통 schema에 태그 차원·연결 표와 복합 키를 추가했다. | PostgreSQL 공식 18 table expressions·subquery·scalar expressions 자료 대조. PGlite 정답/결함/수정 질의 각 15개, SQL 문제 은행 300개 공개 사례·195개 기본 예제, 전용 회귀 11/11, 전체 `npm test` 284/284, release audit 142개 정적 파일·최대 9.621 MiB 통과. PostgreSQL 18.6 운영 서버 미검증. CQ-5 6/21 배치, PostgreSQL W1–W18 18/39주·270/585문항, 전체 74.29%; 다음 W19–W21. |

| 2026-10-16 | CQ-5 | PostgreSQL W19–W21 CTE 단계·결과 열 계약, 집합 연산 중복 정책, 윈도 행 유지와 순위 차이를 45문항·15개 결과 추적 질의로 검수했다. | 7/21 배치, PostgreSQL W1–W21 21/39주·315/585문항; 전용 12/12, 전체 285/285, release audit 143개 파일 통과; 다음 W22–W24 |
| 2026-10-16 | CQ-5 | PostgreSQL W22–W24 동점 순위·결정적 정렬, LAG/LEAD·RANGE/ROWS, 기본/외래/복합 키·CHECK·NOT NULL을 45문항으로 검수했다. 수정 DDL의 제약 효과도 실행해 확인했다. | 8/21 배치, PostgreSQL W1–W24 24/39주·360/585문항; 전용 13/13, 전체 286/286, release audit 144개 파일 통과; 다음 W25–W27 |
| 2026-10-16 | CQ-5 | PostgreSQL W25–W27 반복 사실·정규화 이상, 명시적 INSERT/UPDATE/DELETE·RETURNING, 트랜잭션·SAVEPOINT 복구를 날짜 목표·45문항에 연결했다. 부분 함수 종속 설명에 가상의 (learner_id, topic) 논리 키를 분명히 표시하고, 표시 예제와 별도 검증 SQL이 달랐던 트랜잭션 사례는 화면의 SQL 자체를 실행하도록 고쳐 정상·실패 경로를 대조했다. | PostgreSQL DML·RETURNING·트랜잭션·격리 수준 공식 문서 및 정규화 참고자료 대조. 전용 15/15, 전체 `npm test` 288/288, release audit 145개 파일·최대 9.621 MiB 통과. PGlite 18.3에서 W25–W27 출력·잘못된 경로와 195개 기본 질의/300개 공개 사례 확인; PostgreSQL 18.6 서버 운영은 미검증. 9/21 배치, W1–W27 27/39주·405/585문항, 전체 76.43%; 다음 W28–W30 |

| 2026-10-16 | CQ-5 PostgreSQL W28–W30 동시성·실행 계획·인덱스 검수 | READ COMMITTED/REPEATABLE READ/SERIALIZABLE 차이, 40001 전체 재시도, 행 잠금, EXPLAIN 비용·ANALYZE 통계·측정 중 실제 변경, 복합·부분 인덱스와 PostgreSQL 18 skip scan을 45문항으로 검수했다. 두 세션 동시 실행 한계와 고정 오류 코드 문자열의 범위를 밝혔고, 누락된 표·정렬 반례·날짜 결과 타입 불일치를 수정했다. | 공식 PostgreSQL transaction isolation·EXPLAIN·index·18 release 문서를 대조했다. 배치 검사 4/4, 전체 `npm test` 291/291, release audit 146개 정적 파일·최대 9.621 MiB 통과. PGlite 18.3으로 질의·인덱스·롤백 경계를 확인했다. 운영 PostgreSQL 18.6 및 두 세션 경쟁 동작은 미검증. CQ-5 10/21 배치, W1–W30 30/39주·450/585문항, 전체 77.14%; 다음 W31–W33. |
| 2026-10-16 | CQ-5 PostgreSQL W31–W33 뷰·자료형·SQL 입력 경계 검수 | 일반/구체화 뷰, 뷰 갱신과 CHECK OPTION, 기본 표 권한·security_invoker, CREATE OR REPLACE 열 계약, 정확/근사 수치·날짜/시간대·배열·JSONB, SQL injection·값 바인딩·동적 식별자 허용 목록을 45문항으로 검수했다. | PostgreSQL 18 공식 CREATE VIEW·views·privilege·numeric·array·JSON·prepare/libpq 문서를 대조했다. 15개 예제·권한 경계·공격 입력을 PGlite 18.3에서 확인했다. 대상 회귀 2/2, 전체 `npm test` 292/292, `npm run check:release` 147개 파일·최대 9.621 MiB, JS 구문 및 `git diff --check` 통과. PGlite의 CHECK OPTION 위반은 변경 0행으로 관찰했으며 PostgreSQL 서버의 오류 메시지 동작은 미검증이다. CQ-5 11/21 배치, W1–W33 33/39주·495/585문항, 전체 77.86%; 다음 W34–W36. |
| 2026-10-16 | CQ-5 PostgreSQL W34–W36 오류 진단·실행 계획·잠금 검수 | 구문 위치와 SQLSTATE 42601/23514/42703, NULL의 최소 재현, Seq/Index Scan 후보와 데이터 의존 계획·단위 없는 cost, EXPLAIN ANALYZE 실행 여부·DML 롤백, FOR UPDATE·잠금 순서·40P01·멱등 재시도를 서로 다른 사례로 구성했다. | 전용 회귀 2/2와 W1–W36 카탈로그 검사가 통과했다. PGlite에서 42601/23514/42703 실제 코드, EXPLAIN·actual rows/time, 특정 행 잠금 구문, 전체 업데이트 롤백과 같은 request key 재실행 결과를 확인했다. 전체 `npm test` 293/293, `npm run check:release` 148개 파일·최대 9.621 MiB, 구문·`git diff --check` 통과. 경쟁 두 세션·실제 교착은 시뮬레이션하지 않는다. CQ-5 12/21 배치, W1–W36 36/39주·540/585문항, 전체 78.57%; 다음 W37–W39. |
| 2026-10-16 | CQ-5 PostgreSQL W37–W39 통합·JSONB | JSONB `#>`/`#>>` 자료형, 구조 포함과 GIN·배열 연산자, 빈 집합 출력 계약, 실제 키 관계와 tag JOIN 행 증폭·사전 집계, cohort 요약을 15개 결과 추적 사례로 검수했다. 부정확한 잘못된 JOIN fixture는 실제 다른 learner를 돌려주도록 고쳤다. | PostgreSQL 18 JSON/GIN/operator class/array 공식 문서 대조. PGlite 18.3에서 15개 결과, 인덱스 정의·EXPLAIN 생성, faulty JOIN 오연결과 140 대 100 오집계, 최종 repair 결과를 확인했다. 대상 회귀 1/1; PostgreSQL W1–W39 39/39주·585/585문항, CQ-5 13/21 배치, 다음 JavaScript 은행. 실제 운영 서버 및 GIN plan 선택은 미검증. |
| 2026-10-16 | CQ-5 JavaScript 실행형 문제 1–25 | 함수별 배열·문자열·숫자 조건과 공개 예제·숨은 사례·정답 구현을 대조했다. 두 수 찾기의 범위를 Number 안전 정수로 명시하고 단일 항목 자기 재사용과 최대 안전 정수 경계를 추가했다. | JavaScript 전용 은행 검사·참조 구현 입력 불변성 검증. 첫 절반 25/25 문제, 예제/테스트 연결과 ECMAScript 2026 출처 확인; JavaScript 배치 회귀는 최종 행에 기록한다. CQ-5 14/21 배치, 누적 JS 25/50; 다음 JavaScript 26–50. |
| 2026-10-16 | CQ-5 JavaScript 실행형 문제 26–50 | 그룹 객체 순서 약속, boolean key 지원, 재시도 첫 상한, 배열 원소 null, 이메일 끝 개행, code point/조합 이모지 경계와 실제 결제에 쓰면 안 되는 Number 반올림 범위를 맞췄다. | MDN Number·Math.round 및 ECMAScript 2026 문서 확인. 전용 `coding-problem-quality.test.js` 9/9, 예제/사례 연결·50개 참조 구현 출력·입력 불변성 검증. CQ-5 JavaScript 50/50·전체 bank 50/200, 15/21 배치, 정밀 CQ 80.71%(표시 81%); 다음 TypeScript 문제 1–25. |
| 2026-10-16 | CQ-5 TypeScript 실행형 문제 1–25 | 문제별 목표·선수 순서·입출력 계약·공개 예제/채점 사례·정답 풀이·경계 사례를 대조했다. 예제 설명 3곳이 실제 입력과 달라 수정했고, 첫 글자 집계가 UTF-16 인덱싱으로 이모지를 분할하던 문제를 유니코드 문자 단위로 고치고 사례를 추가했다. | TypeScript Handbook의 Everyday Types·Object Types·Narrowing·Functions·Generics·Indexed Access 문서를 연결하고 2026-10-16 최신 안정판 기록을 재확인했다. 전용 `coding-problem-quality.test.js` 10/10, 문제 1–25 예제/사례 연결, TypeScript 6.0.3 `strict` 실제 컴파일 25/25, 전체 50개 참조 풀이 실행·입력 불변성 검증 통과. CQ-5 16/21 배치, 은행 75/200개(JS 50/50·TypeScript 25/50), 정밀 CQ 81.43%(표시 81%); 다음 TypeScript 26–50. |
| 2026-10-16 | CQ-5 TypeScript 실행형 문제 26–50 | 집계 설명·page chunk 설명·인덱스 예제 설명 세 곳이 입력 결과와 달라 수정했다. Record 출력의 `__proto__`/`constructor` 키 손실, 타입 제약이 인덱스 시그니처를 강제하던 제네릭, `in`의 상속 속성 판정, cleanTags 공개 예제 불일치를 보완했다. 금액 합산은 Number 반올림 한계를 밝히고 실결제에 쓰지 말도록 범위를 제한했다. | TypeScript 공식 Generics·Indexed Access·Utility Types와 MDN Object.create·Object.hasOwn·Number를 대조했다. 전용 `coding-problem-quality.test.js` 11/11, 예제/사례 연결, 특수 키·상속 이름 회귀, 50개 정답 풀이 실행·입력 불변성 통과. TypeScript 6.0.3 strict 컴파일 50/50 및 interface 기반 제네릭 호출 확인. 당시 17/21 배치, 은행 100/200개(JS 50/50·TypeScript 50/50), 정밀 CQ 82.14%(표시 82%); 다음 PostgreSQL 문제 1–25. |

#### PostgreSQL 실행형 문제 1–25 — 조회·정렬·집계·조인 기초 (완료)

- 첫 25문항의 실제 화면 텍스트, 예제 입력/기대 결과, 풀이·힌트·오답 설명과 참조 질의를 대조했다. 기존에는 서로 다른 문제들이 같은 포괄 문장을 사용하고 예제 설명도 “실행한 결과”만 반복했다. 각 문제에 필요한 열, 비교 경계, 필터, 정렬·LIMIT, 그룹 기준, JOIN 키를 명시하고 예제마다 결과 행을 직접 풀어 설명했다.
- 난도 변화가 단순히 숫자만 바꾸는 데 그치지 않도록 초급/기초 단계에서 전체 기록→활성 기록→추가 범위·최소 점수·CTE·고유 인원·기수 제외 조건으로 차이를 만들었다. LEFT JOIN은 미일치 학습자 보존과 `ON` 필터 위치를 명시하고, 평균 문제는 평균을 계산하는 모집단과 바깥 행 필터를 분리했다.
- 입문·기초 `topic-counts`는 시도 행을 세는데 제목과 예제가 고유 인원 수를 가리키던 오류를 바로잡았다. 제목을 단계별 계산에 맞추고 기록 수는 ‘건’, 고유 학습자 수는 ‘명’으로 설명한다. 같은 학습자가 같은 주제에 두 번 시도한 사례에서 `COUNT(*)`와 `COUNT(DISTINCT learner_id)`의 차이를 확인했다.
- 공통 결함으로 50개 PostgreSQL 문제의 시작 코드에 정답 질의가 그대로 포함되어 있었다. 모든 문제의 시작 코드를 정답 대신 TODO 안내로 바꾸었다.
- PostgreSQL 공식 [18.6 릴리스 노트](https://www.postgresql.org/docs/release/18.6/), [SELECT](https://www.postgresql.org/docs/18/sql-select.html), [비교 연산](https://www.postgresql.org/docs/18/functions-comparison.html), [집계 함수](https://www.postgresql.org/docs/18/functions-aggregate.html), [정렬](https://www.postgresql.org/docs/18/queries-order.html), [LIMIT](https://www.postgresql.org/docs/18/queries-limit.html), [CTE](https://www.postgresql.org/docs/18/queries-with.html), [JOIN](https://www.postgresql.org/docs/18/queries-table-expressions.html), [조건식](https://www.postgresql.org/docs/18/functions-conditional.html), [윈도 함수](https://www.postgresql.org/docs/18/functions-window.html)를 문제 주제별로 연결했다. 18.6은 관찰 시점의 안정판이며 PostgreSQL 19 RC1은 후보판으로만 표시한다. 채점 실행기는 PGlite 0.5.8 / PostgreSQL 18.3이다.
- `node --test --test-name-pattern="PostgreSQL problem bank has 50|all 300 SQL public cases|PostgreSQL problems 1–25" tests/postgresql-quality.test.js` 3/3 통과. 상세 배치 회귀는 문제 1–25의 150개 입력을 엔진에서 실행했고, 전체 은행 300개 공개 사례도 통과했다. `node --test tests/coding-problem-quality.test.js` 11/11 통과. 전체 `npm test`와 release audit은 나머지 문제 배치가 끝난 뒤 실행한다.

#### PostgreSQL 실행형 문제 26–50 — 집계·윈도·조인 조건 검수 (완료)

- 실전 단계의 예제가 초급 문제의 같은 간단한 질의를 되풀이하거나 목표의 주요 조건을 시험하지 않는 문제를 찾아 고쳤다. 점수 상위 결과는 주제별 최고 점수를 먼저 고르고, 주제별 학습자 수·기수 합계는 서로 다른 학습자가 둘 이상인 그룹으로 한정한다. 실전 LEFT JOIN은 기수 열도 보존하고, 평균 초과 목록은 평균 모집단을 유지하면서 후보 행 상한을 별도로 적용한다. `bonus_points IS NULL`은 미검토 상태로 구분하며, 순위 예제는 80·80·70 동점에서 `RANK`의 1·1·3과 `DENSE_RANK`의 1·1·2 차이를 실제로 드러낸다.
- 설명·요구조건·예제 출력 및 정답 풀이를 문제별 SQL 계약에 맞춰 확인했다. 모든 50문제의 편집기 시작 코드는 TODO 안내를 유지해 정답을 노출하지 않는다. PGlite 18.3에서 문제 26–50의 150개 공개 채점 사례를 재실행했고 문제 1–50 전체 300개가 통과했다. PostgreSQL 18.6 공식 문서가 학습 기준이고 브라우저 엔진은 PostgreSQL 18.3이므로, 실제 PostgreSQL 서버와 동시 연결 동작은 이 검증에 포함하지 않는다.
- `node --test --test-name-pattern="PostgreSQL problem bank has 50|PostgreSQL problems 1–25|PostgreSQL problems 26–50|all 300 SQL public cases" tests/postgresql-quality.test.js` 4/4, `node --test tests/coding-problem-quality.test.js` 11/11, 관련 파일 `node --check` 통과. 전체 `npm test`와 release audit은 CQ-5의 나머지 FastAPI 배치 뒤 실행한다. CQ-5는 19/21 배치, 실행형 은행 150/200개, 정밀 진척 83.57%(표시 84%)이며 다음은 FastAPI 문제 1–25다.

#### FastAPI 실행형 문제 1–25 — 요청·검증·응답 기초 (완료)

- 문제별 요청 계약, 기대 상태 코드와 JSON, 힌트·오답·정답 설명을 대조했다. 단순 공통 예제 설명을 실제 method/path/query/header/body와 결과 응답으로 바꾸고, 성공 예제에 치우쳤던 Enum·쿼리 범위·Pydantic Field 제약·의존성 입력에 422 경계 사례를 추가했다. 화면 예제도 첫 사례·중간 사례·마지막 경계 사례를 골라 유효 입력과 거부 응답을 함께 보여준다.
- APIRouter 문제의 limit=5 사례는 코드가 1–4로 제한하면서 기대값은 네 항목을 요청해 불가능했던 사례였다. 요청 범위를 문제 설명에 명시하고, 잘못된 사례를 유효한 1–4 범위로 교체했다. 이 변경은 오류를 덮지 않고 문제 계약과 실제 응답을 일치시켰다.
- FastAPI 공식 [0.143.1 릴리스 노트](https://fastapi.tiangolo.com/release-notes/), [경로 매개변수](https://fastapi.tiangolo.com/tutorial/path-params/), [쿼리 매개변수](https://fastapi.tiangolo.com/tutorial/query-params/), [요청 본문](https://fastapi.tiangolo.com/tutorial/body/), [응답 모델](https://fastapi.tiangolo.com/tutorial/response-model/), [의존성](https://fastapi.tiangolo.com/tutorial/dependencies/), [오류 처리](https://fastapi.tiangolo.com/tutorial/handling-errors/)를 대조했다. 학습 기준은 2026-10-14에 나온 0.143.1이고, 브라우저 실행 검증은 vendored FastAPI 0.143.0 / Starlette 1.0.0 / Pydantic 2.12.5 / Pyodide 314.0.7 / Python 3.14.2에서 수행했다. 학습 문서 기준판과 실행 검증판을 같은 버전이라고 표시하지 않는다.
- 변경 후 첫 25문제의 콘텐츠 검사와 12개 schema 검사, JavaScript 구문 검사가 통과했다. 고정 로컬 ASGI 실행 환경에서 전체 FastAPI 은행의 254개 사례가 통과했고 첫 25문제의 유효·오류 응답도 기대값과 일치했다. FastAPI 결과 채점은 외부 서버·DB 없이 브라우저 로컬에서 테스트한다. 외부 운영 인증이나 실제 데이터 저장은 이 은행의 범위가 아니다.
- 전체 `npm test`와 release audit은 CQ-5 잔여 배치가 끝난 뒤 수행한다. CQ-5는 20/21 배치, 은행 175/200개, 정밀 진척 84.29%(표시 84%)다. 다음은 FastAPI 문제 26–50이다.

#### PostgreSQL W31–W33 — 뷰·자료형·안전한 입력 (완료)

- W31은 일반 VIEW와 MATERIALIZED VIEW의 저장 차이, 같은 트랜잭션에서 원본 변경이 뷰 조회에 보이는 흐름과 ROLLBACK 복구, 단순 뷰의 자동 갱신과 `WITH CHECK OPTION`, 기본 뷰·`security_invoker`의 권한 검사, 기존 출력 열 순서를 지키는 뷰 계약을 다룬다. W32는 `NUMERIC`의 십진 정확성과 부동소수점 근사, DATE·TIMESTAMPTZ와 UTC, PostgreSQL 배열의 1 기반 첨자, JSONB `->`와 `->>` 결과 형식, 반복 관계를 연결 표로 정규화할 기준을 확인한다. W33은 문자열 결합 SQL injection, 작은따옴표·세미콜론·주석이 든 공격 입력, 값 매개변수와 SQL 식별자의 차이, 고정된 허용 목록 SQL 조각과 안전한 바인딩을 연습한다.
- 초안 통합 전 검사에서 W31 D5가 새 `learner_id` 열을 조회하면서 fixture view에는 그 열이 없던 재현 오류를 찾았다. 준비 SQL에 호환되는 `CREATE OR REPLACE VIEW`를 넣고 회귀에서 열 순서 변경은 거부되고 열 추가는 동작하는지 확인했다. W33 D2는 공격 입력에 작은따옴표가 빠져 세미콜론이 값 안에만 머물던 불완전한 예시를 발견해 실제 탈출 문자열로 바꾸고 바인드 버전이 행을 변경하지 않는지 검증했다. D4의 표시 코드가 SQL 화면에서 실행 가능한 척하지 않도록 애플리케이션 구현 대신 두 개의 사전 고정 SQL 조각을 보여 주도록 정리했다.
- PostgreSQL 공식 [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html), [views](https://www.postgresql.org/docs/18/rules-views.html), [권한](https://www.postgresql.org/docs/18/ddl-priv.html), [숫자 자료형](https://www.postgresql.org/docs/18/datatype-numeric.html), [날짜/시간](https://www.postgresql.org/docs/18/datatype-datetime.html), [배열](https://www.postgresql.org/docs/18/arrays.html), [JSON 자료형](https://www.postgresql.org/docs/18/datatype-json.html), [JSON 함수](https://www.postgresql.org/docs/18/functions-json.html), [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html), [libpq parameterized execution](https://www.postgresql.org/docs/18/libpq-exec.html) 자료를 대조했다. 학습 기준은 안정 PostgreSQL 18.6, 브라우저 실행기는 PGlite/PostgreSQL 18.3이며 운영 서버·실제 동시 세션은 이 검수에 포함하지 않는다.
- 전용 회귀는 15개 예제와 일반 뷰 결과, 읽기 권한 분리, `security_invoker` 거부, `WITH CHECK OPTION` 뒤 데이터 유지, 뷰 열 계약, 정확 수치·UTC·배열·JSONB·정규화 결과, 문자열 injection과 바인드 경계를 검사한다. PGlite에서는 CHECK OPTION 위반 시 수정 0행과 원본 값 유지를 관찰했으며 PostgreSQL 서버가 내는 구체 오류 응답을 재현했다고 주장하지 않는다. 배치 전용 회귀 2/2, 전체 `npm test` 292/292, release audit 147개 정적 파일·최대 9.621 MiB, JavaScript 구문 검사와 `git diff --check`가 통과했다.
- W34–W36 대상 회귀 2/2, 전체 `npm test` 293/293, `npm run check:release` 148개 파일·최대 9.621 MiB, JavaScript 구문 검사와 `git diff --check`가 통과했다.

#### PostgreSQL W34–W36 — 오류 진단·실행 계획·잠금과 복구 (완료)

- W34는 파서 오류 위치와 구문 수정, CHECK 위반 23514, 없는 열 42703, NULL 비교의 최소 재현, 수정 뒤 출력 계약 회귀를 다룬다. W35는 Seq Scan·Index Scan의 후보와 데이터 의존 선택, cost 추정치와 시간 단위, EXPLAIN과 EXPLAIN ANALYZE, 실제 DML 측정 뒤 테스트 트랜잭션 롤백을 구분한다. W36은 FOR UPDATE 범위·조인 잠금 대상, 일관된 다중 행 잠금 순서, 40P01 식별자와 실제 교착의 차이, 요청 ID를 활용한 중복 방지 재시도를 연습한다.
- fixture 실험에서 오류 코드는 구문 42601·CHECK 23514·없는 열 42703으로 확인했다. EXPLAIN plan은 5행 fixture에서 Seq Scan을 선택했고 인덱스를 추가해도 points 검색이 Index Scan을 보장하지 않았다. 이는 특정 노드를 강제로 요구하지 않는 문항 규칙과 일치한다. EXPLAIN ANALYZE COUNT에서 `actual rows`와 `Execution Time`이 나왔고, UPDATE는 BEGIN 안에서 실행 후 ROLLBACK해 기존 점수가 60으로 유지되는 것을 확인했다. 같은 idempotency key를 두 번 전송하면 첫 요청만 5점을 더하고 두 번째는 0행·최종 105를 유지했다.
- W36은 학습 사이트 PGlite가 단일 연결 기반인 점을 공개한다. `FOR UPDATE` 문법과 한 트랜잭션의 변경·롤백, 정렬된 행 결과, 안전한 단일 DB 재시도는 실행했지만 서로 다른 두 연결의 잠금 대기·교착이나 애플리케이션 재시도는 실행하지 않았다. `'40P01'` 결과는 고정 문자열일 뿐 교착 오류를 재현하지 않는다. PostgreSQL 공식 [SQLSTATE 표](https://www.postgresql.org/docs/18/errcodes-appendix.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)·[ANALYZE](https://www.postgresql.org/docs/18/sql-explain.html), [명시적 잠금](https://www.postgresql.org/docs/18/explicit-locking.html), [인덱스 사용 조사](https://www.postgresql.org/docs/18/indexes-examine.html)를 대조했다.
- 대상 회귀 2/2에서 각 15개 결과 예제, 세 오류 코드, 플랜 비용·actual rows, DML 롤백, request key 재전송을 확인했다. 이 배치 시점에 전체 `npm test` 293/293과 release audit 148개 파일·최대 9.621 MiB가 통과했다. CQ-5는 당시 12/21 배치, W1–W36 36/39주·540/585문항, 문제 은행 0/200개, 정밀 78.57%(표시 79%)였으며 다음은 W37–W39 통합·JSONB 과정이었다.

#### PostgreSQL W37–W39 — JSONB 검색·출력 계약·통합 집계 (완료)

- W37은 JSON/텍스트 경로 추출 `#>`·`#>>`, 구조 포함 `@>`, GIN과 연산자 클래스, 배열 `@>`·`&&`, 반복 태그의 연결 표 기준을 학습한다. W38은 반환 열·별칭·자료형·정렬 계약, 빈 집합에서 COUNT와 SUM/AVG, NULL/빈 문자열, assertion 경계를 구분한다. W39는 학습자별 LEFT JOIN·FILTER 요약, 식별자 FK를 따른 tag 집계, 다중 태그 조인에서 발생하는 합계 중복, 사전 집계·cohort 성과 통합까지 연결한다.
- PGlite 결과 비교 중 JSONB 숫자 경로 값은 SQL JSONB 수지만 드라이버는 JavaScript `number`로 제공한다는 점에 맞춰 기대값을 수정했다. W39 D2의 첫 결함 예제는 `attempt.id`와 `learner.id` 숫자가 우연히 같아도 결과가 맞아 보이는 입력이었다. 태그가 연결된 attempt 3을 써서 잘못된 직접 키 조인이 `하린`을 반환하고 실제 소유 learner `준`을 놓치는 fixture로 교체했다. D3의 잘못된 합계 질의도 PGlite에서 100점 대신 140점을 실제 반환하는지 검사한다.
- PostgreSQL 18 공식 [JSON 자료형·JSONB 인덱싱](https://www.postgresql.org/docs/18/datatype-json.html), [JSON 연산자](https://www.postgresql.org/docs/18/functions-json.html), [GIN 인덱스](https://www.postgresql.org/docs/18/gin.html), [GIN 기본 연산자 클래스](https://www.postgresql.org/docs/18/gin-builtin-opclasses.html), [배열 연산자](https://www.postgresql.org/docs/18/functions-array.html)를 대조했다. 대상 회귀에서 15개 결과 질의, GIN 정의·EXPLAIN 생성, 빈 집계, 잘못된 JOIN·140점 오집계, cohort 수리 질의를 확인했다. PGlite 18.3의 작은 표에서는 GIN이 실제 선택될 것을 강제하지 않으며 PostgreSQL 18.6 운영 서버·실제 업무 데이터의 성능은 검증 범위가 아니다.
- CQ-5 PostgreSQL은 W1–W39 39/39주·585/585문항을 마쳤다. 실행 문제 은행은 다음 순서인 TypeScript 1–25로 계속한다.

#### JavaScript 실행형 문제 1–25·26–50 — 50개 전체 검수 (완료)

- 첫 25개는 배열·숫자·문자열 기초에서 그룹 분류·정렬·이진 탐색까지, 나머지 25개는 고급 문자열·JSON 구조·구간 처리에서 검증·설정·페이지·트리·재시도·쿼리 문자열 유틸리티까지 순서를 따라 확인했다. 공개 예제와 채점 사례가 일치하는지, 빈 입력·경계·중복·순서·입력 불변 조건, 힌트·오답·정답 설명·복잡도, 선수 ID와 ECMAScript 2026 출처를 대조했다.
- `twoSumIndices`가 모든 소수를 입력으로 받는 것처럼 쓰여 있었지만 이진 부동소수 비교가 기대와 다를 수 있어 입력을 안전한 정수로 한정하고, 같은 위치 재사용 금지와 Number.MAX_SAFE_INTEGER 경계 사례를 추가했다. 객체 출력의 숫자 모양 키는 열거 순서가 첫 입력 순서와 같지 않을 수 있어 category/customer 결과의 순서 약속을 제거했다. `indexByKey`는 불리언 식별자를 이미 시험했지만 문서가 문자열·숫자만 허용한다고 적어 조건을 일치시켰다.
- `retryDelays`는 초기값이 상한을 넘으면 첫 값도 clamp했는데 설명은 항상 원래 초기값이라고 했다. 문구와 공개 사례를 상한 결과에 맞췄다. 쿼리 값 배열의 null 항목은 설명상 생략 대상이지만 코드가 `null` 문자열을 내던 결함을 고쳐 사례를 추가했다. 이메일 정규식의 `$`가 마지막 줄바꿈 앞에서 성공하는 경계를 trim 검사와 추가 사례로 막았다. 이모지 과제는 화면상 한 글자와 Unicode code point를 혼동하지 않도록 조합 이모지 범위를 밝혔다.
- 금액 예제는 JavaScript Number와 `Math.round`만으로 실제 결제 계산에 안전하다고 오해될 수 있었다. 문제의 범위를 교육용 Number 계산으로 제한하고, 십진 근사·실서비스용 정수 최소 화폐 단위 또는 십진 산술을 해설과 공식 [MDN Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [MDN Math.round](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) 출처에 명시했다.
- 배치 회귀는 예제/테스트 사례 연결, 기존 50개 기준 실행, 추가 경계 계약과 입력 불변성을 확인한다. 전용 `coding-problem-quality.test.js` 9/9 통과. 전체 회귀와 release audit 결과는 최종 검사 뒤 이 기록과 요약 행에 갱신한다. CQ-5는 그 시점에 15/21 배치였다. 현재는 TypeScript 1–25까지 전용 검사와 25개 정답 코드의 엄격 컴파일을 마쳤다. 아래 TypeScript 배치 절에서 범위와 증거를 이어서 기록한다.

#### TypeScript 실행형 문제 1–25 — 기초형·컬렉션·제네릭 입문 (완료)

- 25개는 string/number/boolean, 배열 길이·경계·`some`·`every`, 리터럴 유니온과 null 분기, 튜플, 선택 속성, 객체 배열 필터/집계, `interface`·`type`·`Record`, 제네릭 검색·`keyof`·`T[K]` 순서로 이어진다. 각 문항의 계약·세 공개 예제·추가 사례·힌트·오답·설명·복잡도·선수 ID와 화면 예제가 테스트하는 값을 확인했다.
- 예제 설명 세 곳이 기대값과 모순됐다. `firstEnabledLabel`은 결과가 null인데 B를 반환한다고 썼고, `formatDuration(59)`는 59분을 1시간 0분으로 계산했으며, `productIdsInRange`는 실제로 범위 밖인 가격을 하한과 같다고 설명했다. 각 설명을 주어진 입력·출력에 맞췄다.
- `countByFirstLetter`가 `word[0]`을 사용해 이모지처럼 UTF-16 코드 단위 두 칸인 문자를 분리했다. 계약을 첫 유니코드 문자로 명시하고 `[...word][0]`로 수정했으며 빈 문자열·공백·대소문자와 보조 평면 이모지 사례를 포함했다.
- 문제마다 TypeScript Handbook 주제 자료를 추가했다. 7.0.2는 공식 릴리스 목록에서 확인한 안정 릴리스이며 7.1 beta와 구분한다. 제품의 TypeScript 브라우저 어댑터는 여전히 타입 진단을 제공하지 않으므로, 별도 품질 확인에서만 설치된 TypeScript 6.0.3 컴파일러로 정답 구현을 `strict` 검사했다.
- 전용 `coding-problem-quality.test.js` 10/10, TypeScript 정답 구현 50개 변환·실행, 예제 연결, 입력 불변성 통과. 첫 25개 정답 구현은 TypeScript 6.0.3 `strict` 모드 컴파일 25/25다. 전체 `npm test`와 정적 release audit은 다음 배치 완료 뒤 새로 실행한다. CQ-5 16/21 배치, PostgreSQL 39/39주, 실행형 은행 75/200개, 정밀 81.43%(표시 81%); 다음은 TypeScript 26–50이다.

#### TypeScript 실행형 문제 26–50 — 유틸리티 타입·안전한 데이터 처리 (완료)

- 26–50번의 제네릭 원시 값 중복 제거, 구조적 객체 제약, Record 집계, 묶음 분할, Partial/Pick/Omit, 판별 유니온, unknown 입력 검사, 커서·최신 레코드 요약, 권한 조건과 유니온 배열 좁히기를 검수했다. 모든 공개 예제가 실제 추가 채점 사례와 같은 입력·기대값을 가지는지 확인하고, 각 문제를 공식 Handbook 주제 자료와 연결했다.
- 공개 해설 오류 세 곳을 고쳤다. `countByPriority`의 입력은 low인데 high가 한 번이라고 설명했고, `splitPages([1, 2], 2)` 설명은 없는 세 번째 원소를 언급했으며, 서로 다른 a/b id를 가진 `indexUsers` 예제를 중복 x key로 설명했다. `cleanTags`의 공백 제거 예제는 공백 문자열을 입력하지 않던 불일치를 고쳐 실제 공백과 유효 태그를 함께 보인다.
- 임의 문자열 Record는 `{}` 상속 속성과 `__proto__` 설정자를 데이터로 오해할 수 있다. 우선순위·키별 집계·사용자 인덱스·Pick 결과를 프로토타입 없는 객체로 만들고 해당 예약 이름을 사례에 추가했다. `countByKey`의 `Record<string, ...>` 제약은 일반 interface 객체를 거부할 수 있어 `T extends object`와 `K extends keyof T` 관계로 수정하고 interface 호출을 실제 컴파일했다. optional 키 조회는 `in`이 상속된 `toString`까지 찾는 사례가 있어 `Object.hasOwn`으로 변경했다.
- `paidTotal`은 금액을 JavaScript Number로 더하는 교육용 필터·누적 문제라고 표시한다. Number가 십진 소수를 정확히 표현하지 않을 수 있으므로 실제 결제에는 정수 최소 화폐 단위 또는 명시적 반올림 규칙의 십진 산술을 사용한다는 MDN 출처·해설을 추가했다.
- 전용 `coding-problem-quality.test.js` 11/11, 예제/사례 연결·예약 키·상속 속성·50개 정답 구현 출력과 입력 불변성 통과. TypeScript 6.0.3 `strict` 모드에서 50개 구현 전부 컴파일했고 interface 기반 generic key 호출도 통과했다. 제품 실행기는 타입 진단을 하지 않는다는 경계를 유지한다. 전체 `npm test`와 release audit은 나머지 배치 완료 뒤 실행한다. CQ-5 17/21 배치, PostgreSQL 39/39주, 실행형 은행 100/200개, 정밀 82.14%(표시 82%); 다음은 PostgreSQL 문제 1–25다.

| 2026-10-16 | CQ-6 공통 실무 W23–W24 입력 검증·계약 테스트 | 서버 인가 예제가 client role 신뢰 결함을 직접 보여주지 않았고, API 계약 오류 찾기의 설명이 이미 존재하는 필드 검사 누락을 주장했다. 해당 흐름을 실제 결함 사례로 바꾸고 공식 출처를 추가했다. | OWASP input validation·authorization·XSS prevention, Node.js 26.12.0 test runner, OpenAPI 3.2.1, RFC 9110 대조. 테스트 14/14·JS 문법 검사 통과. 서버 요청은 실행하지 않음. CQ-6 360/570문항·12/33 배치; 정밀 전체 91.32%(표시 91%); 다음 W25–W26; 도움 없음 |
| 2026-10-16 | CQ-6 공통 실무 W25–W26 리뷰·캡스톤 | PR 예제의 비밀값처럼 보이는 문구와 캡스톤 allowlist 오류 찾기의 도달 불가능한 결함 줄을 수정했다. W25의 범위에 맞지 않는 출처, W25–W26의 반복 일별 소개·검토 날짜도 고쳤다. | Git 2.56.0·GitHub PR·OWASP CI/CD/Secrets, Node.js 26.12.0, OpenAPI 3.2.1, PostgreSQL 18.6, Docker 공식 자료 대조. foundations 회귀 15/15 및 JS 구문 검사 통과. CQ-6 390/570문항·13/33 배치; 전체 91.84%(표시 92%); 다음 G10 JavaScript; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 JavaScript 초기 카탈로그 1–3단원 | 변수·조건·반복 9문항을 검수했다. 초기 질문 ID가 26주 경로의 첫 3주로 정확히 옮겨졌고 같은 주차의 새 질문과 합쳐 하루 세 문항을 유지해 중복 항목이 없었다. 콘텐츠 정확성 결함은 발견하지 못했다. | ECMAScript 2026 ECMA-262 17판 공식 자료 대조. G10 회귀 2/2, 조건/반복 예제 출력 일치, JS 구문 검사 통과. CQ-6 399/570문항·14/33 배치; 전체 92.00%(표시 92%); 다음 G10 JavaScript 4–6단원; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 JavaScript 초기 카탈로그 4–6단원 | 기본 인자 경계 코드·해설을 일치시키고, 객체 전개와 반환 문자열 오류 찾기에서 실제 결함 줄을 선택하게 고쳤다. 4–6주차 반복형 힌트를 개념에 맞게 구체화했다. | ECMAScript 2026 공식 표준 대조. G10·JavaScript 회귀 30/30, 구문·공백 검사 통과, 매일 예제 출력 15/15 및 오류 코드 출력 3개 대조. CQ-6 408/570문항·15/33 배치; 전체 92.16%(표시 92%); 다음 G10 JavaScript 7–9단원; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 JavaScript 초기 카탈로그 7–9단원 | 범위·클로저, 모듈·오류·테스트, DOM·폼을 검수하고 답 줄을 해설에서 지목하지 못한 오류 찾기 네 문항과 모듈 질문의 범위 모호성을 수정했다. WHATWG HTML·DOM 공식 출처를 추가했다. | ECMAScript 2026, WHATWG HTML Living Standard(2026-10-14), DOM Standard 대조. G10·JavaScript/React 회귀 31/31, 구문 검사, 변경 파일 diff 공백 검사 통과. 예제 15/15 실행, 정답 줄 11개 검사. DOM은 객체 모형 한계와 코드 수정형 정적 검사 범위를 명시했다. CQ-6 417/570문항·16/33 배치; 전체 92.32%(표시 92%); 다음 G10 JavaScript 10–12단원; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 JavaScript 초기 카탈로그 10–12단원 | Promise/fetch, 이벤트 루프, 학습 통계 캡스톤의 원본 문항 9개와 26주 경로 연결, 15개 예제, 해설·채점 기준을 검수했다. 본문 Promise 처리·HTTP 상태·취소 신호, 동기/microtask/timer 순서, 빈 평균·불변 배열·반복 경계를 확인했다. | WHATWG Fetch Standard(2026-10-06 갱신), HTML Living Standard 이벤트 루프/requestAnimationFrame, ECMAScript 2026 공식 자료 대조. G10·JavaScript/React 회귀 32/32, 구문 검사·diff 공백 검사 통과. 15개 예제 출력과 10개 오류 줄/해설, 오류 코드 7개의 실제 결과를 대조했다. CQ-6 426/570문항·17/33 배치; 전체 92.47%(표시 92%). 다음 카탈로그는 Python 1–3단원이다. |
| 2026-10-16 | CQ-6 G10 Python 초기 카탈로그 1–3단원 | 변수·조건·반복 9개 원본 문항과 첫 3주 경로, 15개 예제를 검수했다. 빈 목록 때문에 드러나지 않던 `is True` 결함과 정상 조건 줄을 답으로 지정한 무한 반복 문제를 수정하고 `range` 오답 피드백을 구체화했다. | Python 3.15.0 정식 릴리스·입문/제어 흐름 공식 문서 대조. Python 3.12.10 예제 15/15 및 코드 수정형 답안 6개 실행, G10·content·Python 회귀 44/44, 전체 `npm test` 325/325, `npm run check:release` 149개 파일 통과. Python 3.15 런타임 검증은 하지 않음. CQ-6 435/570문항·18/33 배치; 전체 92.63%(표시 93%); 다음 Python 4–6단원; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Python 초기 카탈로그 4–6단원 | 함수 반환·기본 인자·지역 범위, 리스트 합계·인덱스·슬라이스·정렬·얕은 복사, 딕셔너리 조회·기본값·순회를 검수했다. 짧은 보기 설명 두 곳, 오류 해설의 답 줄 누락, 정수 출력과 다른 할인 코드 수정 기대값을 수정했다. | Python 3.15 공식 제어 흐름·자료 구조·dict 문서 대조. Python 3.12.10 예제 15/15·오류 사례 5개·수정 답안 5개 확인, 회귀 49/49. CQ-6 444/570문항·19/33 배치; 전체 92.79%(표시 93%); 다음 Python 7–9단원; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Python 초기 카탈로그 7–9단원 | 모듈·예외 범위와 `finally`, 파일 수명·UTF-8·bytes·줄 단위 읽기·임시 파일 교체, iterator 상태·yield 재개·무한 입력 제한을 45문항에서 검수했다. 모듈·제너레이터의 짧은 오답 설명 세 곳을 보강하고, 오류 찾기 예제의 합계 출력 누락을 추가했다. | Python 3.15 공식 [예외](https://docs.python.org/3.15/tutorial/errors.html)·[파일 입출력](https://docs.python.org/3.15/tutorial/inputoutput.html)·[이터레이터/제너레이터](https://docs.python.org/3.15/tutorial/classes.html)·[itertools](https://docs.python.org/3.15/library/itertools.html) 문서와 대조했다. Python 3.12.10 예제 15/15·실행 가능한 오류 사례 2건 및 시간 제한한 무한 입력 1건·코드 수정 답안 4개를 확인했다. Python 전용 5/5, Python 관련 54/54, 전체 `npm test` 335/335, release audit 149개 파일·최대 9.621 MiB 통과. CQ-6는 주간 보조 문항을 제외한 G10 원본 기준 453/570문항·20/33 배치, 전체 92.95%(표시 93%)다. 다음 Python 10–12단원; Python 3.15 런타임 미실행, 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Python 초기 카탈로그 10–12단원 | 클래스·비동기·데이터 요약 원본 9문항과 주간 추가 연습 45개를 분리해 검수했다. Python 3.15 공식 자료 대조, Python 3.12.10 예제 출력 14/15를 확인했고 gather 사례 하나는 제한 시간 내 검증되지 않아 미실행으로 기록했다. | CQ-6 462/570·21/33 배치, 93.11%; 다음은 주간 Python 13–15 보충으로 G10 분모 외 |
| 2026-10-16 | Python 주간 과정 13–15주차 보충 재감사 | 15개 예제 출력과 오류 찾기 7건, 수정 시작값 2건을 보완했다. Python 3.12.10 실행 및 공식 3.15 자료 대조; G10 원본 집계는 변경하지 않았다. | CQ-6 수치 유지; G10 누계 462/570·21/33 배치 |
| 2026-10-16 | CQ-6 G10 Java 초기 카탈로그 1–3단원 | 변수·조건·반복 9개 원본 문항, 15개 예제와 설명·정답을 검수했다. | CQ-6 471/570·22/33 배치, 93.26%; 다음 Java 4–6 |
| 2026-10-16 | CQ-6 G10 Java 초기 카탈로그 4–6단원 | 메서드·생성자·접근 제어·상속·재정의·인터페이스의 설명과 연결 질문을 구체화하고 원본 9문항을 보존했다. Java SE 25 JLS 대조, Java 회귀 52/52, JDK 8 UTF-8 컴파일·출력 비교 15/15 통과. | CQ-6 480/570·23/33 배치, 93.42%; 다음 Java 7–9; Java SE 25 런타임 검증 아님 |
| 2026-10-16 | CQ-6 G10 Java 초기 카탈로그 7–9단원 | 컬렉션·제네릭·예외·람다 원본 문항 9개와 앱의 7–9주차 경로를 대조했다. 모든 원본 문항이 같은 목표의 실제 날짜 예제에 한 번씩 나타났고 기존 정답 ID·하루 문항 수를 유지했다. Oracle Java SE 25 API/JLS 대조, G10 Java·Java·content 회귀 57/57. | CQ-6 489/570·24/33 배치, 93.58%; 다음 Java 10–12; 오류·도움 요청 없음 |
| 2026-10-16 | CQ-6 G10 Java 초기 카탈로그 10–12단원 | 스트림·동시성·JVM 원본 문항 9개와 10–12주차의 화면 제목·날짜 예제·질문 배치를 대조했다. 원본 ID와 정답 계약을 보존하고 하루에 한 번씩 연결되는 테스트를 추가했다. Java 16 `Stream.toList()` 도입 버전, Java SE 25 공식 API/JVM 자료를 확인했다. | Java/G10/content 회귀 57/57; 전체 npm test 351통과·0실패·1건너뜀, release audit 149개 파일 통과. CQ-6 498/570·25/33 배치, 93.74%; 다음 Spring Boot 1–3; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Spring Boot 초기 카탈로그 1–3단원 | 원본 9문항과 Spring 주간 1–3주차 일별 질문을 대조하고 정답 선택지 ID·답 문구·단답·오류 줄을 확인했다. `spring-service-choice`의 컨트롤러 정답 해설을 요청-서비스-응답 흐름으로 명확히 했다. | Spring 공식 Boot 4.1.1 안정판·Java 17–26·Framework 7.0.9+ 및 4.2.0-M2 preview 상태 대조; 대상 회귀 47/47, 전체 npm test 354통과·실패 0·1건너뜀, release audit 149개 파일 통과. CQ-6 507/570·26/33 배치, 93.89%; 다음 Spring Boot 4–6; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Spring Boot 초기 카탈로그 4–6단원 | HTTP 매핑·Bean Validation·오류 상태 원본 9문항과 4–6주차 일별 흐름, ID 기반 정답, 단답, 실제 결함 줄을 대조했다. | Spring·콘텐츠 회귀 48/48; release audit 149개 파일 통과. 실행하지 않은 개념 예제를 실행했다고 표시하지 않음. CQ-6 516/570·27/33 배치, 94.05%; 다음 Spring Boot 7–9; 오류·사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Spring Boot 초기 카탈로그 7–9단원 | 트랜잭션·보안·테스트의 원본 문항 9개를 날짜·예제·정답 ID·단답·오류 줄·채점과 대조했다. Spring Security 7.1.1 메서드 보안과 요청 경계 공식 자료를 확인했다. | Spring·콘텐츠 회귀 49/49; CQ-6 525/570·28/33 배치, 94.21%; 다음 Spring Boot 10–12; 추가 결함·사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 Spring Boot 초기 카탈로그 10–12단원 | 복원력·관측 가능성·API 캡스톤 원본 9문항의 주차·일자 연결, 정답 ID와 의미, 단답 허용 답, 오류 줄, 채점을 확인했다. 주간 화면의 “오늘의 예제”가 잘못된 재시도·지역화 캐시 키 누락·trace 생성·고유 ID 메트릭 태그·비밀 로그·HTTP 오류·관리 권한 결함을 모범 패턴처럼 보여 주는 문제를 발견했다. 이를 올바른 개념 예제로 교체하고 의존성·요청 문맥·멱등 키·캐시 무효화·역할 매핑 가정을 intro에 적었다. 오류 코드는 별도 선택/오류 찾기 문제에 유지했다. | Spring Boot [구조화 로깅](https://docs.spring.io/spring-boot/reference/features/logging.html)·[추적 전파](https://docs.spring.io/spring-boot/reference/actuator/tracing.html)·[관측](https://docs.spring.io/spring-boot/reference/actuator/observability.html), Spring Framework [캐시 추상화](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html), Spring Security [요청 인가](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html), Java 25 [HttpRequest.Builder](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/HttpRequest.Builder.html), HTTP [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)를 대조했다. Spring·content 회귀 51/51, 전체 `npm test` 359개 중 358통과·실패 0·Windows asyncio bounded-time 검사 1건 건너뜀, release audit 149개 통과. 예제는 실행 앱에서 컴파일하지 않은 개념 스니펫이다. CQ-6 534/570·29/33 배치, 94.37%(표시 94%); 다음 React 1–3; 결함 해결, 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 React 초기 카탈로그 1–3단원 | 함수 컴포넌트 재사용·props 전달·이벤트 처리 원본 문항의 정답, 오답 피드백과 각 주 2일차 연결을 대조했다. 재사용 예제는 서로 다른 props로 같은 컴포넌트를 표시하고, props 예제는 부모의 호출을 포함하며, 이벤트 예제는 직접 전달과 추가 인자 전달을 함께 보이도록 보완했다. props 정답 설명도 부모에서 자식으로 전달되는 입력 객체와 갱신 흐름을 설명하도록 확장했다. | React 19.3 공식 [버전](https://react.dev/versions), [첫 컴포넌트](https://react.dev/learn/your-first-component), [props 전달](https://react.dev/learn/passing-props-to-a-component), [이벤트 응답](https://react.dev/learn/responding-to-events) 자료 대조. G10 React·콘텐츠 회귀 59/59 및 JS 구문 검사 통과. 정적 JSX 개념 스니펫은 React 앱에서 compile/run하지 않음. CQ-6 543/570·30/33 배치, 94.53%(표시 95%); 다음 React 4–6; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 React 초기 카탈로그 4–6단원 | 객체·배열 불변 갱신, 제어 입력·label·안정된 key, Effect·파생 목록의 원본 문항 9개를 해당 날짜에 연결했다. 목록 추가·제거는 변경 결과도 화면에 드러내도록 보강했다. 파생 목록 예제의 누락된 courses 입력을 props로 정의하고, 실제 없는 검색 모듈을 제거했다. 외부 연결과 검색 예제는 네트워크 없는 모형임을 명시했다. | React 19.3 공식 [버전](https://react.dev/versions), [객체 상태](https://react.dev/learn/updating-objects-in-state), [배열 상태](https://react.dev/learn/updating-arrays-in-state), [input](https://react.dev/reference/react-dom/components/input), [Effect 동기화](https://react.dev/learn/synchronizing-with-effects), [Effect 불필요 판단](https://react.dev/learn/you-might-not-need-an-effect), [useEffect](https://react.dev/reference/react/useEffect) 대조. React·content 회귀 60/60, JS 구문 검사 통과. React JSX 앱 compile/run 검증은 하지 않음. CQ-6 552/570·31/33 배치, 94.68%(표시 95%); 다음 React 7–9; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 React 초기 카탈로그 7–9단원 | reducer/action/Context, 사용자 정의 Hook, 비동기 요청 상태를 다루는 원본 문제 9개와 주간 첫 3일 예제를 대조했다. 각 예제를 입력·호출·결과가 보이는 함수나 컴포넌트로 보완하고, 요청 취소는 네트워크 없는 지연 모형으로 완성했다. 실제 fetch 구현에서는 signal 전달과 취소 오류 처리가 필요하다는 전제를 명시했다. | React 19.3 공식 [버전](https://react.dev/versions), [useReducer](https://react.dev/reference/react/useReducer), [사용자 정의 Hook](https://react.dev/learn/reusing-logic-with-custom-hooks), [Hook 규칙](https://react.dev/reference/rules/rules-of-hooks), [Effect 동기화](https://react.dev/learn/synchronizing-with-effects), [useEffect](https://react.dev/reference/react/useEffect) 대조. React·content 회귀 61/61 및 JS 구문 검사 통과. JSX 실행 검증은 하지 않음. CQ-6 561/570·32/33 배치, 94.84%(표시 95%); 다음 React 10–12; 사용자 도움 없음 |
| 2026-10-16 | CQ-6 G10 React 초기 카탈로그 10–12단원 | 라우팅 링크·버튼·이동 후 포커스, 역할 기반 조회·클릭·화면 결과 검증, 측정 기반 최적화와 학습 기록 화면의 원본 9문항을 각 목표 날짜에 연결했다. 테스트 의존성의 설정 전제를 설명하고 저장 성공은 테스트 안에서만 모의했다. React Compiler가 자동 memoization을 제공할 때 수동 `useMemo`를 무조건 권하지 않도록 조건을 표시했다. 빈 기록에 다음 경로를 추가하고 저장 오류에서는 재시도 동작을 제공했다. | React 19.3 공식 [버전](https://react.dev/versions), [useRef](https://react.dev/reference/react/useRef), [useMemo](https://react.dev/reference/react/useMemo), [Effect 없이 계산하기](https://react.dev/learn/you-might-not-need-an-effect), Testing Library [쿼리](https://testing-library.com/docs/queries/about/), [user-event](https://testing-library.com/docs/user-event/intro/) 대조. React·content 회귀 62/62 및 JS 구문 검사 통과. JSX·Testing Library 코드는 앱에서 compile/run하지 않음. CQ-6 570/570·33/33 배치 완료, 95.00%; 다음 CQ-7 통합 확인; 사용자 도움 없음 |

## CQ-7 전 트랙 통합 확인·최종 승인 (이전 감사 기록; 현재 재검수는 열림)

- 전체 회귀 `npm test`: 366개 중 365개 통과, 1개 건너뜀, 실패 0. 건너뜀은 Windows 환경에서 `asyncio.run` 테스트가 지정된 3초 제한 안에 끝나지 않은 1건이며 실패로 숨기지 않고 보고한다. 진행 저장, 백업 내보내기·가져오기, 복구와 기존 기록 호환 관련 검사도 전체 회귀에 포함됐다.
- `npm run check:release`: 정적 빌드 및 배포 감사 통과. 149개 파일, 최대 파일 9.621 MiB이며 외부 스크립트·스타일 출처, 런타임 패키지, 서버 파일, 학습자 데이터 포함을 탐지하지 않았다. 실행기 CSP와 same-origin 연결 경계도 유지됐다.
- 새 브라우저 탭에서 로컬 홈, React 과정, React W10–W12 및 기록/백업 화면을 읽기 전용 확인했다. React 주차 목표·일별 예제·문제 진입·React 19.3 출처가 화면에서 연결되고, 기록은 브라우저 안에 저장되며 백업 파일로 옮긴다는 설명이 나타난다. 문제를 제출하거나 사용자 데이터를 변경하지 않았다.
- 통합 확인 중 첫 방문의 빈 기록 화면이 저장소를 이미 읽을 수 있어도 “저장 준비 중”으로 남는 결함 E-257을 발견했다. 읽기 성공 여부를 저장 가능 위치 판정에 사용하고, 보조 localStorage 접근 오류는 저장소 경계 밖에 숨기지 않도록 수정했다. IndexedDB 가능·브라우저 보조 저장소 가능·두 저장소 모두 불가인 빈 기록을 각각 검사하는 회귀 3개를 추가했다. `tests/progress-storage.test.js` 10/10, 전체 회귀 365 통과·1 건너뜀·실패 0으로 확인했고, 신선한 로컬 첫 방문 화면에서 “이 기기에 저장” 안내를 검증했다.
- 공개 [Cloudflare Pages](https://code-one-step.pages.dev/)를 2026-10-16 읽기 전용으로 다시 확인했다. 현재 공개 카탈로그는 JavaScript·Python·Java 각 5단원, Spring Boot·React 각 4단원으로 5개 트랙·23단원이다. 공개본은 G10 60단원·180문항, G11 26주 과정과 CQ-6 확장, E-257 저장 표시 수정을 포함하지 않는다. 로컬 검수 완료와 공개 배포는 별개이며 이 단계에서 배포를 수행하지 않았다.
- 이 시점에는 CQ-0–CQ-7 정밀 종합 진척을 `85% + 10% × 570/570 + 5% × 100/100 = 100.00%`로 기록했다. 2026-10-18 재검수에서 이후 표에 적힌 결함을 추가로 확인했으므로, 이 완료 판정과 “미해결 문항 결함 없음” 문구는 현재 상태에서 철회한다. React JSX/Testing Library, 서버 프레임워크 앱, Android 앱처럼 지원 런타임이 없는 예제는 실행 검증 완료로 표시하지 않는다.

## 차단·도움

현재 사용자 결정이 없어도 콘텐츠 감사와 로컬 수정은 진행할 수 있다. 공식 문서에서 확인할 수 없는 버전 동작, 모호한 제품 학습 목표, 기존 기록과 충돌하는 문항 ID 변경이 발견되면 해당 항목만 차단 사유와 기본안을 기록한다. 유료 도구·외부 실행 서비스·계정·서버·DB는 도입하지 않는다.

## 기준 문서

- 품질 규칙: [학습 콘텐츠 규칙](../rules/content.md)
- 전체 단계 기록: [프로젝트 진척 관리](progress.md)
- 발견 오류·결정: [결정 사항과 도움 기록](decisions-and-help.md)
- 콘텐츠 구성과 버전 근거: [단계별 콘텐츠 로드맵](content-roadmap.md)
| 2026-10-16 | CQ-4 C#·.NET W22–W24 콘텐츠 품질 검수 | 구조화 로그·민감정보·Meter/Activity, ASP.NET Core 10 Minimal API metadata·middleware·DI·binding, HTTP 안전성·멱등성·ProblemDetails·OpenAPI 계약을 15개 예제·45문항으로 검수했다. | Microsoft 공식 logging/observability/API 문서와 RFC 9110·9457을 대조했다. W22–W24 전용 회귀와 통합 콘텐츠 검사, 전체 `npm test` 274/274, release audit 133개 정적 파일·최대 9.621 MiB, `npm ls --depth=0`, 구문·diff 검사 통과. SDK 10.0.400/runtime 10.0.11 offline harness에서 W1–W24 예제 117개 build·경고/오류 0, W22–W24 결과 15/15. ASP.NET host/request/DB/OpenAPI JSON과 제품 C# 실행은 미검증·미지원. CQ-4 81/92주·1,215/1,380문항, CQ 전체 68.21%(표시 68%); 다음 C# W25–W27; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W25–W27 콘텐츠 품질 검수 | EF Core 10 LTS query/change tracking/N+1/transaction 경계, 인증과 자원 권한·입력·비밀값·오류 은닉 정책, profile 기반 cache/Span/cancellation 설계를 15개 예제·45문항으로 편집했다. | Microsoft 공식 EF Core 10 지원계획·query/transaction, ASP.NET Core 10 security·antiforgery, HybridCache, diagnostics·Span 자료를 대조했다. 전용 C# 11/11, 전체 npm test 275/275, release audit 134개 정적 파일·최대 9.621 MiB, 의존성·구문·diff 통과. SDK 10.0.400/runtime 10.0.11에서 W1–W27 예제 132개 build·경고/오류 0, W25–W27 출력 15/15. 실제 EF provider/DB·ASP.NET 요청·cache 분산·benchmark는 미검증이며 제품 C# 실행 채점은 미지원. CQ-4 84/92주·1,260/1,380문항, 전체 CQ 68.70%(표시 69%); 다음 W28–W30; 비용·서비스·DB·계정·결제·공개 배포 변경 없음 |
| 2026-10-16 | CQ-4 C#·.NET W31–W33 코드 리뷰·캡스톤 계약 검수 | focused diff·API response 호환·nullable caller 영향·state invariant·검증 증거 보고, 학습 기록의 user flow·입력 경계·DTO·오류 계약·정적 설계 범위, domain/application/storage·취소·단위/통합 사례·resource ownership을 15개 snippet·45문항으로 검수했다. | Microsoft 공식 architecture·testing·ASP.NET integration/error 문서와 RFC 9457을 대조했다. 회귀 13/13, 전체 `npm test` 277/277, release audit 136개 정적 파일·최대 9.621 MiB. SDK 10.0.400/runtime 10.0.11 harness W1–W33 162개 build·경고/오류 0, W16–W33 trace 90/90. 실제 ASP.NET·DB·제품 C# runner 미실행/미지원. CQ-4 90/92주·1,350/1,380문항, CQ 전체 69.67%(표시 70%); 다음 W34–W35; 무료·로컬 범위 유지 |
| 2026-10-16 | CQ-4 C#·.NET W34–W35 복구·최종 출시 캡스톤 | 멱등 완료·취소 전파·동시 수정·검증 후 백업 교체·개인정보 최소 로그와 계층 통합·회귀 설계·출시 증거·지원 한계 보고·다음 학습 계획을 10개 추적 예제·30문항으로 검수했다. | EF Core concurrency 및 Microsoft architecture/testing 공식 자료 대조, C# 회귀 14/14, 전체 `npm test` 278/278, release audit 137개 정적 파일. SDK 10.0.400/runtime 10.0.11에서 W1–W35 예제 172개 컴파일·경고/오류 0, W16–W35 출력 100/100 일치. ASP.NET/DB/운영 배포와 제품 C# 실행은 검증하지 않았다. CQ-4 92/92주·1,380/1,380문항; CQ-0–CQ-4 70.00%, 다음 CQ-5 PostgreSQL·실행형 문제 은행 검수 |

#### FastAPI 실행형 문제 26–50 — 미들웨어·오류·통합 계약 (완료)

- 반복된 공개 테스트를 고쳤다. `fastapi-safe-sort-allowlist`는 title/rank 정렬과 잘못된 키의 422를 확인하는 세 사례로 줄였다. `fastapi-domain-error-code`의 중복 declined 요청은 cancelled/refunded 성공 경로로 바꾸었다. 잘못된 정렬 키는 문자열 Enum으로 제한하고 실패 응답을 명시했다.
- 실제 구현보다 뜻이 강했던 문항을 수정했다. HTTPBearer는 토큰 파싱을 `authenticated=true`로 나타내던 내용을 `token_present=true`로 바꾸고 서명·만료·권한 확인을 하지 않는다고 설명한다. 요청 ID 예제는 검증을 하지 않으므로 제목에서 ‘검증’을 제거했다. Lifespan 문항은 시작 때 설정한 값을 요청에서 읽는 내용으로 제목을 맞췄다. PATCH 요약에는 필드 생략/null/0 구분을 사례로 넣었다.
- CORS는 허용 출처의 GET·POST preflight와 금지 메서드·외부 출처를 실제 ASGI 요청으로 검사한다. 실행기가 응답 헤더나 브라우저의 차단 동작을 비교하지 않는다는 범위를 문제와 해설에 표시했다. 고정 JSON은 인증을 구현했다고 암시하지 않도록 정리했다.
- FastAPI 공식 [릴리스 노트](https://fastapi.tiangolo.com/release-notes/), [의존성](https://fastapi.tiangolo.com/tutorial/dependencies/), [미들웨어](https://fastapi.tiangolo.com/tutorial/middleware/), [Lifespan](https://fastapi.tiangolo.com/advanced/events/), [오류 처리](https://fastapi.tiangolo.com/tutorial/handling-errors/), [CORS](https://fastapi.tiangolo.com/tutorial/cors/), [Bearer 인증](https://fastapi.tiangolo.com/tutorial/security/first-steps/), [Lifespan 테스트](https://fastapi.tiangolo.com/advanced/testing-events/)를 대조했다. 학습 기준은 0.143.1(2026-10-14)이고 실제 실행은 로컬 고정판 FastAPI 0.143.0 / Starlette 1.0.0 / Pydantic 2.12.5 / Pyodide 314.0.7 / Python 3.14.2다.
- FastAPI 문제 1–50의 251개 공개 사례를 고정 ASGI 환경에서 다시 실행해 전부 통과했다. 콘텐츠 품질 검사 13/13, schema 검사 12/12, 변경 파일 구문 검사 통과. 전체 `npm test`와 release audit은 CQ-7 통합 단계에서 실행한다. CQ-5는 PostgreSQL 39/39주·585/585문항 및 실행형 문제 200/200개, 21/21 배치로 완료됐다.

#### 공통 실무 기초 W1–W2 — 파일 경로·터미널 명령 (완료)

- 10일·30문항을 주간/일일 목표, 보기별 피드백, 주관식 허용 답, 오류 줄과 해설까지 대조했다. W1의 “시스템의 시작 위치” 표현은 파일 시스템 루트의 뜻을 모호하게 만들 수 있어 POSIX `/`와 Windows 드라이브 루트(`C:\`)를 구분해 설명하도록 고쳤다. 예제의 `/workspace`가 POSIX식 표기라는 안내도 덧붙였다.
- W2 PowerShell 인자·따옴표, 변수 확장, Bash 및 PowerShell 종료 상태를 공식 문서와 대조했다. Bash 명령 없음 상태의 기본값이 127이며 `command_not_found_handle` 설정 시 결과가 달라질 수 있다는 경계를 해설에 명시했다. 객관식·주관식·오류 위치 정답과 문제 안의 경로/명령 흐름에서 추가 모순은 발견하지 않았다.
- 공식 자료: [PowerShell 7.6 경로 구문](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax?view=powershell-7.6), [POSIX.1-2024 경로 정의](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap03.html), [PowerShell 7.6 따옴표 규칙](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules?view=powershell-7.6), [자동 변수](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.6), [GNU Bash 5.3 설명서](https://www.gnu.org/software/bash/manual/bash.html).
- `tests/foundations-quality.test.js` 3/3 통과. 새 회귀 검사에서 경로 안내·정답 설명·POSIX 및 PowerShell 원문 링크를 확인한다. 이번 배치는 개념·출력 추적 문제이므로 앱에서 셸 명령을 실행하지 않는다. CQ-6 공통 실무 W1–W2 2/26주·30/390문항, 13개 중 1개 배치; G10 0/60단원·0/180문항; CQ-6 총 30/570문항·33개 중 1개 배치. 전체 CQ 정밀 진척 85.53%(표시 86%). 다음 공통 실무 W3–W4. 사용자 도움 없음.

#### 공통 실무 기초 W3–W4 — Git 변경·검토·복구 (완료)

- 저장소와 작업 폴더, untracked/unstaged/staged, `git add`·`commit`, diff·log, `restore`·`revert`의 대상과 위험을 30문항에서 추적했다. 대부분의 문항은 조건과 피드백이 맞았다. W4 D5 Q3은 사전 `status`, 복원, 이후 `diff`를 나열하면서도 “결과 상태를 다시 확인하지 않는다”고 설명해 `diff`와 `status`가 검증하는 정보를 혼동했다.
- 오류 사례를 “복원 뒤 `git status`를 실행하지 않고 끝낸다”로 구체화했다. 설명은 `git diff`가 파일 차이를 보일 뿐 staging 상태 요약을 대체하지 않으며, 복원 뒤 `git status --short`가 필요하다고 구분했다. 기존 문제 ID와 정답 줄 번호는 유지했다.
- Git 2.56.0 공식 CLI 문서와 Pro Git 출처를 대조했다. 회귀 검사로 문제 순서·사전 status·사후 diff·누락된 사후 status 기록과 정답 줄을 고정했다. `tests/foundations-quality.test.js` 4/4, 변경 JS 구문 검사, `git diff --check` 오류 없이 통과했다(기존 파일 줄바꿈 안내만 출력). 명령을 실제 저장소에서 실행하지 않고 정적 시나리오로 확인했다.
- CQ-6 공통 실무 W1–W4 4/26주·60/390문항, 13개 중 2개 배치; G10 0/60단원·0/180문항; CQ-6 총 60/570문항·33개 중 2개 배치. 전체 CQ 정밀 진척 86.05%(표시 86%). 다음 공통 실무 W5–W6. 사용자 도움 없음.

#### 공통 실무 기초 W5–W6 — 브랜치·병합 기초 (완료)

- W5는 브랜치 포인터·생성과 전환·HEAD·기능 변경 격리, W6은 공통 조상·fast-forward·분기 이력 merge·방향·병합 후 점검을 30문항에서 검수했다. 브랜치별 변경과 현재/원격 브랜치를 구분했고 고정 그래프의 답·오류 줄도 조건과 대조했다.
- W5 D4 Q2는 현재 브랜치와 변경 상태를 함께 확인하라고 했지만, 허용 정답에 브랜치 이름만 출력하는 `git branch --show-current`가 들어 있었다. 해당 답을 제거하고 `git status` 두 형태만 허용했으며, 설명에 제외 이유를 밝혔다. 문제 ID는 유지했다.
- `git status`의 `--branch`/`--short` 동작을 최신 공식 Git 문서에서 확인했다([git-status](https://git-scm.com/docs/git-status)). 회귀 검사에서 두 명령은 통과하고 `git branch --show-current`는 오답으로 남는지 확인했다. `tests/foundations-quality.test.js` 5/5, 변경 JS 구문 검사 및 `git diff --check` 통과(줄바꿈 경고만). 저장소에 Git 명령을 실제 실행하지 않고 공식 명세와 고정 문제 조건을 검수했다.
- CQ-6 공통 실무 W1–W6 6/26주·90/390문항, 13개 중 3개 배치; G10 0/60단원·0/180문항; CQ-6 총 90/570문항·33개 중 3개 배치. 전체 CQ 정밀 진척 86.58%(표시 87%). 다음 공통 실무 W7–W8. 사용자 도움 없음.

#### 공통 실무 기초 W7–W8 — 충돌 해결·원격 공유 (완료)

- W7 충돌 블록의 현재/상대 쪽 구분, 요구사항을 기준으로 한 해결, `status`, `merge --continue`, 테스트와 `diff --check`를 검토했다. 기존 Q3 예제는 완전한 충돌 구분선이 없고 실제로 제거해야 하는 시작·중간·끝 표식 세 줄 중 하나만 정답이었다. 예제를 올바른 충돌 블록으로 바꾸고 세 줄을 모두 선택하도록 수정했으며, 학습 데이터 생성기가 복수 정답 줄을 보존하도록 고쳤다.
- W7 최종 기본 문구 예제는 `name || ...`가 0·false·null도 바꿀 수 있는데 입력이 문자열인지 지정하지 않았다. 조건을 빈 문자열 또는 비어 있지 않은 문자열로 제한해 제시한 답이 요구와 일치하도록 했다. W8은 origin 관례, fetch/pull/push 방향, 공유 이력 보존을 고정 그래프와 대조했고 추가 정답 불일치를 찾지 못했다.
- Git 공식 문서의 최신 `2.56.0`(2026-09-28) 기준으로 [branch](https://git-scm.com/docs/git-branch), [switch](https://git-scm.com/docs/git-switch), [merge](https://git-scm.com/docs/git-merge), [fetch](https://git-scm.com/docs/git-fetch), [pull](https://git-scm.com/docs/git-pull), [push](https://git-scm.com/docs/git-push), [diff](https://git-scm.com/docs/git-diff) 동작을 확인했다. 회귀 검사는 완전한 표식 형태와 복수 라인 채점, 문자열 조건, 문서 검토일을 고정한다. `tests/foundations-quality.test.js` 6/6, 변경 파일 구문 검사 및 `git diff --check` 통과(줄바꿈 경고만). 실제 원격이나 저장소 명령은 실행하지 않았다.
- CQ-6 공통 실무 W1–W8 8/26주·120/390문항, 13개 중 4개 배치; G10 0/60단원·0/180문항; CQ-6 총 120/570문항·33개 중 4개 배치. 전체 CQ 정밀 진척 87.11%(표시 87%). 다음 공통 실무 W9–W10. 사용자 도움 없음.

#### 공통 실무 기초 W9–W10 — PR 협업·로그 디버깅 (완료)

- W9의 PR 범위·검증 보고·리뷰 응답·민감정보·병합 준비와 W10의 로그 사실/가설 구분·스택 추적·재현 정보·한 번에 한 조건을 확인하는 방법을 30문항 전체에서 일일 목표, 예제, 보기별 설명, 단답 답안, 오류 줄 및 정답 줄과 대조했다.
- W9 D4의 정상·경계·실패 테스트 단답이 일부 조합만 채점했고, 병합 준비 단답의 “두 항목” 조건이 세 항목을 한꺼번에 말하는 답까지 허용될 여지가 있었다. 세 테스트 종류의 모든 순서/표현 조합을 받을 수 있도록 답을 보강하고, 세 항목 답은 오답으로 남기는 회귀 검사를 추가했다. PR 범위 단답은 네 가지 의미가 같은 표현을 허용한다.
- 예제에 실제 자격 증명처럼 보이는 가짜 토큰 문자열이 있었다. 문항은 실제 비밀값을 포함하지 않도록 `[REAL_KEY_REDACTED]` 표기로 바꾸고, 해당 줄이 실제 키를 뜻한다는 가정을 문제에 명시했다. 노출 전에 제거하고 이미 공유했다면 폐기·교체하도록 설명한다.
- GitHub의 PR 목적·리뷰·필수 검사 문서, OWASP Secrets Management, Chrome DevTools Console, Node.js 26.12.0 test runner 공식 문서를 대조했다. W9는 Git 2.56.0 및 GitHub 문서, W10은 Chrome Console/Node.js test runner 자료를 2026-10-16 기준으로 표시한다. 오류 추적 사례는 도구가 실제 오류를 자동 수집한다고 주장하지 않는 개념 문제다.
- `tests/foundations-quality.test.js` 7/7, `node --check src/foundations-weeks-05-13.js`, `git diff --check` 통과. 회귀 검사는 26주·390문항 구조, 모든 W9–W10의 유형별 정답 채점, 18개 테스트 유형 답 표현, 다중 항목 수 제한, 비밀값 예시 표기, 출처 메타데이터를 확인한다. CLI/브라우저에서 실제 PR·로그 수집을 실행하지는 않았다.
- CQ-6 공통 실무 W1–W10 10/26주·150/390문항, 13개 중 5개 배치; G10 0/60단원·0/180문항; CQ-6 총 150/570문항·33개 중 5개 배치. 전체 CQ 정밀 진척 87.63%(표시 88%). 다음 공통 실무 W11–W12. 사용자 도움 없음.

#### 공통 실무 기초 W11–W12 — 최소 재현·가설 검증 (완료)

- W11의 성공/실패 입력 비교, 최소 입력 축소, 단계 전후 관찰, 재현 보고와 W12의 가설·예측·관찰값·단일 변수 검사·수정 뒤 회귀 확인을 30문항 전체에서 학습 목표, 예제, 선택지 설명, 단답 허용 답, 오류 줄 및 정답 줄과 대조했다.
- W12 D1의 빈 배열 사례가 `items[0]` 조회 자체를 실패로 묘사했지만 JavaScript는 인덱스가 없을 때 `undefined`를 반환한다. 그 뒤 `items[0].name`처럼 속성을 읽을 때 TypeError가 날 수 있도록 질문·예제·설명을 분리했다. 같은 날의 빈 문자열 `.trim()` 사례도 실제로는 빈 문자열이 반환되고 오류가 나지 않으므로, 누락된 `name`에 `.trim()`을 먼저 호출하는 경우로 바꿨다.
- W11–W12 메타데이터가 디버깅 주제를 Git 문서로 잘못 표기하고 검토 날짜도 과거 값에 머물러 있었다. Chrome DevTools Console, Node.js 26.12.0 test runner, MDN JavaScript 배열 자료를 W11–W12의 출처로 연결하고 검토일을 2026-10-16으로 바꿨다.
- `tests/foundations-quality.test.js` 8/8, 세 변경 JavaScript 파일의 `node --check` 통과. 로컬 Node.js v24.14.0에서 `[][0] === undefined`, `[][0].name`의 TypeError, `''.trim()`의 빈 문자열 결과, `{ }.name.trim()`의 TypeError를 확인했다. 안정 동작 확인은 현재 설치된 v24.14.0에서 했으며 문서 기준 v26.12.0 런타임 호환 테스트로 과장하지 않는다. 실제 웹 앱의 오류 수집은 실행하지 않았다.
- CQ-6 공통 실무 W1–W12 12/26주·180/390문항, 13개 중 6개 배치; G10 0/60단원·0/180문항; CQ-6 총 180/570문항·33개 중 6개 배치. 전체 CQ 정밀 진척 88.16%(표시 88%). 다음 공통 실무 W13–W14. 사용자 도움 없음.

#### 공통 실무 기초 W13–W14 — 단위 테스트·HTTP 메시지 (완료)

- W13의 assertion 범위·정상/경계/잘못된 입력·오류 계약·회귀 테스트, W14의 요청 구조·메서드·안전성/멱등성·상태 코드·응답 본문을 30문항 전체에서 목표·예제·정답·보기 설명·단답 허용 답·오류 줄과 대조했다.
- W13 메타데이터가 테스트 기초 주차임에도 Git 자료를 가리켜 Node.js 26.12.0 test runner 공식 문서 기준으로 고쳤다. W14 D1 Q1은 `POST`와 `/courses`를 구분하라고 하면서 정답 해설이 JSON Content-Type 헤더를 설명했고 힌트도 무관한 헤더 문법을 말하고 있었다. 메서드와 대상 경로의 의미로 맞췄다.
- W14 공통 문항 생성기에서 단일 `correctReason` 속성을 객관식 정답 설명과 오류 찾기 해설이 함께 사용해 마지막 값이 앞의 답 설명을 덮어쓰고 있었다. 두 속성을 `correctReason`/`locateReason`으로 나누어 W14 전체의 정답 선택지 피드백과 오류 줄 해설을 올바른 항목에 연결했다. 이 공통 수정은 W15 출력에도 적용됐으며 W15의 전체 콘텐츠는 다음 순번에서 별도 감사한다.
- HTTP 동작은 [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), JSON 미디어 형식은 [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html) 기준으로 확인했다. 4xx/5xx 범주, GET 안전성, PUT 멱등성, 응답 코드·본문이 항상 같아야 하는 것은 아니라는 점, 201 Created·204 No Content와 Content-Type을 대조했다.
- `tests/foundations-quality.test.js` 9/9, W13·W14 소스 및 테스트의 `node --check` 통과. 회귀 검사는 최신 메타데이터, W14 질문의 실제 정답과 같은 설명, JSON 헤더 오류 줄의 이유를 확인했다. 요청·응답은 RFC 문서와 고정 텍스트 사례로 검토했으며 실제 서버/네트워크 요청을 보내지 않았다.
- CQ-6 공통 실무 W1–W14 14/26주·210/390문항, 13개 중 7개 배치; G10 0/60단원·0/180문항; CQ-6 총 210/570문항·33개 중 7개 배치. 전체 CQ 정밀 진척 88.68%(표시 89%). 다음 공통 실무 W15–W16. 사용자 도움 없음.

#### 공통 실무 기초 W15–W16 — HTTP 캐시·API 계약 (완료)

- W15의 요청/응답 Content-Type과 Accept, JSON 형식, no-store/no-cache, ETag/If-None-Match·304, Vary를 15문항에서 대조했다. W16의 JSON 문법과 스키마, required/null/type 조건, OpenAPI paths·operation·responses, 예제 일치를 목표·자료·단답·보기·오류 위치와 함께 검토했다.
- W14–W15와 같은 형태로 W16–W17 생성 데이터에도 객관식 `correctReason` 키가 오류 찾기 해설에 의해 덮이는 중복 항목이 있었다. 중복 키를 제거해 W16 선택지 설명이 해당 정답을 설명하게 했고, W15 메타데이터를 2026-10-16으로 갱신했다. 이 공통 보정은 W17에도 반영됐으나 W17 전체 콘텐츠 감사는 다음 배치다.
- W16 D1의 유효 JSON 선택 힌트는 제시된 선택지에 없는 주석을 언급했고, D4의 정답 해설은 `/courses`·`get`을 찾는 질문 대신 `responses` 위치만 설명했다. D5 힌트도 타입 불일치 질문에서 required 키 개수를 세게 해 각각 해당 입력 조건으로 바꿨다. 출처 검토일은 2026-10-16으로 바꾸고 OpenAPI 고정 기준을 3.2.1로 표시했다.
- [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)에서 no-store와 no-cache 및 Vary 동작을 대조했고 [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)의 Content-Type, ETag 조건 요청과 304 의미를 참고했다. OpenAPI 3.2.1 공식 명세는 2026-09-10 버전임을 확인하고 [정식 버전 문서](https://spec.openapis.org/oas/v3.2.1.html)에서 paths, operation, responses 구조를 대조했다. [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html)과 [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html)는 W16–W17 다음 주제의 참고 기준으로 유지한다.
- `tests/foundations-quality.test.js` 10/10, 변경 JS 파일의 `node --check` 통과. 회귀 검사에서 W15 캐시·Accept 해설과 W16 paths operation 설명, 타입 힌트 및 출처 버전을 확인했다. 실제 HTTP 캐시나 서버 통신은 실행하지 않았다.
- CQ-6 공통 실무 W1–W16 16/26주·240/390문항, 13개 중 8개 배치; G10 0/60단원·0/180문항; CQ-6 총 240/570문항·33개 중 8개 배치. 전체 CQ 정밀 진척 89.21%(표시 89%). 당시 다음 공통 실무 W17–W18.

#### 공통 실무 기초 W17–W18 — REST 응답·관계형 데이터 모델 (완료)

- W17의 15문항에서 REST 메서드와 자원 경로, RFC 9457 Problem Details, cursor 페이지 응답, 재시도 안전성, 생성 응답 계약을 검토했다. DELETE `/courses/42` 문제의 힌트를 자원 식별자에 맞췄고, 현재 OpenAPI·RFC 기준일을 2026-10-16으로 갱신했다.
- W18은 기본키·외래키와 UNIQUE·NOT NULL·CHECK 역할을 대조했다. PostgreSQL 18.6을 안정 문서 기준으로 유지하고 PostgreSQL 19 RC 1은 2026-10-15에 발표된 사전 출시 후보로 표기했다. `CHECK (score >= 0)`만으로 NULL을 차단하지 않으므로 범위와 null 허용 여부를 질문에서 분리했다.
- PostgreSQL 공식 [버전 정책](https://www.postgresql.org/support/versioning/), [18.6 릴리스 노트](https://www.postgresql.org/docs/18/release-18-6.html), [19 RC 1 발표](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/), [제약 조건](https://www.postgresql.org/docs/18/ddl-constraints.html) 및 API의 RFC 9110·9457, OpenAPI 3.2.1 공식 문서를 대조했다. W18은 정적 개념 사례로만 검토했으며 실제 데이터베이스에 연결하지 않았다.
- W16–W17 공유 빌더의 정답 설명 덮어쓰기 구조는 앞 배치에서 제거했다. W17 힌트와 버전 상태까지 확인해 W1–W18 편집 감사를 닫았다. foundations 회귀 11/11과 변경 JavaScript 구문 검사 통과.
- 공통 실무 W1–W18은 18/26주·270/390문항, 9/13 배치다. CQ-6 전체는 270/570문항·9/33 배치, CQ 정밀 진척 89.74%(표시 90%)였다. 이어 W19–W20을 검수했다.

#### 공통 실무 기초 W19–W20 — SQL 조회·집계·JOIN (완료)

- W19의 SELECT 열과 WHERE 행 필터, 비교 경계, ORDER BY와 동률 보조 키, NULL의 unknown 결과 및 복합 조회를 검토했다. 잘못된 `name level` 주관식 허용 답을 제거하고 SQL NULL 표현을 명확히 했으며, 복합 오류 찾기에 빠진 `FROM students`를 추가하고 잘못된 정렬 줄 번호를 고쳤다.
- W20의 COUNT(*)/COUNT(column), GROUP BY, WHERE/HAVING, INNER/LEFT JOIN을 검토했다. GROUP BY 정답을 실행 가능한 전체 SELECT로 만들고 오류 찾기는 실제 `GROUP BY status`와 요구된 region 그룹 기준을 비교하도록 바꿨다. INNER JOIN 예제는 한 학생의 두 수강 행이 두 출력 행을 만든다는 일대다 결과를 구체적인 key로 보여 준다.
- PostgreSQL 18 공식 [SELECT와 GROUP BY/HAVING](https://www.postgresql.org/docs/18/sql-select.html), [집계 함수](https://www.postgresql.org/docs/18/functions-aggregate.html), [NULL 비교](https://www.postgresql.org/docs/18/functions-comparison.html), [테이블 JOIN](https://www.postgresql.org/docs/18/queries-table-expressions.html)을 대조했다. PGlite 0.5.8(내장 PostgreSQL 18.3)에서 SELECT·경계·정렬·NULL·COUNT·GROUP BY·HAVING·INNER JOIN·LEFT JOIN 결과 10개를 실제 표본과 비교했다. 이는 서버 PostgreSQL 18.6 전체 호환 인증은 아니다.
- `tests/foundations-quality.test.js` 12/12, PGlite 결과 비교 10개, 변경 JS 구문 검사와 대상 파일 `git diff --check`를 통과했다. 서버·외부 DB 연결은 하지 않았다.
- 공통 실무 W1–W20은 20/26주·300/390문항, 10/13 배치다. CQ-6 전체는 300/570문항·10/33 배치, CQ 정밀 진척 90.26%(표시 90%)다. 다음은 W21–W22이며 G10 초기 카탈로그 검수는 이후 순서다. 사용자 결정이나 도움이 필요한 항목은 없다.

#### 공통 실무 기초 W21–W22 — 변경 안전성·비밀값 보호 (완료)

- W21의 UPDATE 대상 제한, DELETE 전 SELECT 확인, BEGIN/COMMIT/ROLLBACK, 변경 전후 검산을 검토했다. D1 오류 찾기는 잘못 겹친 두 WHERE 대신 범위를 넓히는 유효한 `id = 2 OR id > 0` 조건을 보여 주도록 수정했다. D4 오류 찾기의 설명문 줄을 실제 UPDATE로 바꿔 한 건만 바꿔야 할 때 다른 양수 id가 함께 선택되는 결함을 짚게 했다.
- W22 출처 메타데이터가 비밀값 보호 주제와 관계가 약한 입력 검증 문서를 포함하고 있어 OWASP Secrets Management·CI/CD Security와 GitHub secret scanning/push protection 자료로 바로잡았다. 예제의 `sk-live-actual-token`, `prod-password-2026`, `abcd-real-secret`은 실제 자격 증명으로 오인될 수 있어 제거했다. 학습 예시는 `[REAL_TOKEN_REDACTED]`·`[REAL_PASSWORD_REDACTED]` 가림 표기를 사용하고, 원문에 실제 값이 있었다는 질문 맥락을 명시했다. 환경 변수와 비밀 저장소의 차이, fixture 데이터와 stub/mock 대역의 차이도 설명했다. 반복되던 다섯 날 공통 서문은 날마다 다른 설명으로 분리했다.
- PostgreSQL 18 공식 [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [BEGIN](https://www.postgresql.org/docs/18/sql-begin.html), [ROLLBACK](https://www.postgresql.org/docs/18/sql-rollback.html), OWASP [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) 및 [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), GitHub [secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)과 [push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)을 대조했다.
- PGlite 0.5.8(내장 PostgreSQL 18.3)에서 범위가 넓은 UPDATE 결과, ROLLBACK 후 원래 값, 제한된 UPDATE와 COMMIT 후 결과를 확인했다. `tests/foundations-quality.test.js` 13/13, PGlite 트랜잭션 결과, 변경 JS 구문 검사와 대상 `git diff --check`를 통과했다. 외부 DB 연결·GitHub 보호 설정 변경은 하지 않았다.
- 공통 실무 W1–W22는 22/26주·330/390문항, 11/13 배치다. CQ-6 전체는 330/570문항·11/33 배치, CQ 정밀 진척 90.79%(표시 91%)다. 다음은 W23–W24이며 사용자 결정이나 도움이 필요한 항목은 없다.

## 2026-10-18 재검수 — 확인된 결함과 남은 범위

사용자가 콘텐츠 정답·정보 정확성을 다시 확인해 달라고 요청해, 기존 완료 표시와 구조 검사만 믿지 않고 서로 다른 트랙을 나누어 재검수했다. 목표·예제·문제·정답·해설 연결, 실제 실행/컴파일이 가능한 일부 예제, 주관식 채점 기준을 확인했다. 이번 변경은 로컬 작업 트리에 있으며 공개 사이트에는 배포하지 않았다.

### 확인 후 수정한 결함

| 영역 | 확인된 문제와 수정 | 검증 근거 |
|---|---|---|
| Java W1–W12 | 표시 객관식 25개에서 질문이 묻는 값·코드·이유에 맞는 정답 선택지가 없거나 부족했다. 보기와 피드백을 질문에 답하게 고치고 변경 문항은 새 v3 ID를 부여했다. W1 D3의 존재하지 않는 재대입 줄 언급도 바로잡았다. | `tests/java-curriculum-quality.test.js`, Java/G10/공통 콘텐츠 검사 58/58. 예제 결과 및 선택지 연결을 확인했으며 Java 전체 390문항 전수 편집 검수는 아니다. 새 ID 문항의 이전 풀이 완료는 자동 이전되지 않는다. |
| Python W15–W26 및 W16–W18 | 환경 변수 예제의 기본값 설명, W26 회귀 예제의 실제 합계, W17 복수 정답으로 읽히는 선택지를 고쳤다. W17 D5는 바뀐 답 의미를 보존하도록 새 v2 ID를 부여했다. W16–W18 코드 추적 설명 15개를 예제별 실제 흐름에 맞게 다시 썼다. | Python·공통 품질 검사 45/45. Python 3.12.10에서 선택한 125개 일일 예제를 실행해 119개 정상 종료, 5개는 Windows 임시 폴더 정리 권한 문제, 1개는 의도한 `SystemExit(2)`였다. 비동기/프로세스 예제 5개는 이 실행에서 제외했다. |
| React W11 D3 | 목록 필터 성능이라는 학습 목표와 맞지 않고 D4와 중복되던 문자열 메모 문제를 `query` 의존성 누락 오류 찾기로 교체했다. 변경 문제는 새 ID를 부여했다. | `tests/javascript-react-quality.test.js`를 포함한 React/JavaScript 검사 32/32. |
| FastAPI | W3에서 타입 표기와 경로/쿼리 매개변수 설명 및 답안을 바로잡고, W29의 두 오류 중 하나만 정답으로 처리하던 예제를 하나의 실제 결함으로 정리했다. 403을 인증된 사용자에게만 해당한다고 일반화한 설명도 HTTP 정의에 맞게 고쳤다. | FastAPI 검사 15/15. [Python 타입 힌트](https://docs.python.org/3/library/typing.html#typing.get_type_hints), [FastAPI 쿼리 매개변수](https://fastapi.tiangolo.com/tutorial/query-params/), [RFC 9110 §15.5.4](https://www.rfc-editor.org/rfc/rfc9110.html#name-403-forbidden). |
| C#/.NET | 175개 예제를 Roslyn으로 검사해 최상위 실행문/형식 선언 순서 오류 CS8803 41개를 고쳤다. 진입점 설명도 실행 파일 문맥에 맞췄다. C# W1 D4/D5에 의미가 같은 주관식 답을 추가했다. | 수정 뒤 175개에서 CS8803 0개, C# 품질·구문 검사 16/16. W25 D3 한 예제를 .NET 10.0.400으로 빌드·실행해 `True/C#/LINQ` 출력 확인. 이는 C# 전체 빌드나 동작 검증이 아니다. [Microsoft 진입점 오류 문서](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-messages/entry-point-errors). |
| TypeScript | `readonly`가 호출자에게 주는 변경 제한과 얕은 읽기 전용의 범위를 더 정확하게 설명하도록 고쳤다. | 네 과정 품질 검사 66/66 통과. TypeScript 공개 예제 130개의 타입/출력 검사가 포함된다. |
| 공통 채점 안내 | 화면은 다른 표현도 자동 정답 처리한다고 약속했지만 실제 주관식 채점은 등록 답안과 정규화 후 완전 일치만 확인했다. 안내를 실제 동작에 맞게 고쳤다. | `tests/design.test.js` 22/22. 현재 채점의 한계와 후속 개선은 아래 남은 항목에 기록한다. |
| 통합 회귀·배포 경계 | 이번 수정 뒤 전체 회귀와 정적 배포 검사를 다시 실행했다. | `npm test`: 389개 중 388 통과·1 건너뜀·실패 0. 건너뜀은 Windows 제한 시간 내 끝나지 않은 G10 Python `asyncio.run` 예제 1개다. `npm run check:release`: 150개 파일 통과. `git diff --check` 통과(LF/CRLF 줄바꿈 안내만). |

### 남은 검수·개선 항목

| 우선순위 | 남은 점검 | 필요한 처리 |
|---|---|---|
| 높음 | 나머지 트랙의 문항별 의미 검수 | JavaScript G10 및 26주 과정과 Python 26주 경로의 표적 재검수를 마쳤다. Spring Boot, Next.js, Kotlin/Android, PostgreSQL, TypeScript, C#/.NET 및 Java는 기록된 표적 범위를 넘어 모든 설명·문제·정답·힌트를 일대일로 확인하지 않았다. 기존 자동 검사 통과는 의미 검수 증거로 계산하지 않는다. |
| 높음 | 코드 수정 문제의 정적 정답 판정 범위 | JavaScript W4–W6에서 설명한 요구를 충족하는 문자열 결합, 복사 정렬, 마지막 원소 조회, 새 객체 생성 방식이 기존 정규식 채점 패턴에서 거부됐다. 이번에 확인한 5개 문제는 대체 구현을 허용하도록 고쳤다. 나머지 JavaScript·다른 과정의 수정 문제도 조건을 만족하는 동등 구현이 부당하게 거부되지 않는지 표적 재검수한다. |
| 높음 | 주관식 답안 허용 범위의 의미 검토 | 자동 채점은 등록 답안과 정규화한 문자열의 완전 일치만 인정한다. 현재 대체 답안이 하나뿐인 단답은 JavaScript 91/97, Python 136/141, Java 8/115, FastAPI 101/150, Spring 26/140, React 53/104, Next.js 21/330, TypeScript 130/130, Kotlin 153/155, C# 151/175, PostgreSQL 192/195, 공통 실무 36/126이다. 이 수는 오류 개수가 아니라 검토 대상을 고르는 신호다. 2026-10-24 C# W1–W35 주관식 175개를 예제 출력·질문이 요구한 값·답안 형식에 대조해, 실제 콘솔 출력과 기존 정답 표기가 다른 21개 문항에 동등한 답안 표현을 추가했다. 남은 151개는 해당 검수에서 출력·값·식별자 계약을 충족하는 답으로 확인했으며 오류 수로 보지 않는다. FastAPI W30 D5처럼 여러 항목을 서술하게 하고 한 문장만 받던 자유 서술형은 별도로 검토한다. 다른 트랙도 결과 추적·정확한 식별자 요구·자유 서술형을 나누어 실제 오답 거부 위험이 있는 문항만 고친다. |
| 높음 | 나머지 트랙의 전수 의미 검수 | Spring Boot, Next.js, Kotlin/Android, PostgreSQL, TypeScript, C#/.NET은 이번에 수정한 사례·기존 검사 범위를 넘는 모든 설명·문제·정답·힌트의 일대일 의미 검수가 끝나지 않았다. 기존 검사 통과는 의미적 정확성 증거로 계산하지 않는다. |
| 중간 | Java/JavaScript 전체 해설 | JavaScript의 전체 문제 유형과 해설, Java의 일부 설명·오답 피드백을 문항별로 확인해야 한다. 기존 자동 검사는 의미 검수를 대신하지 않는다. |
| 중간 | 실제 실행 범위 | Python의 일부 비동기·프로세스 예제 5개와 Kotlin·Android 앱 빌드·기기 실행은 확인하지 않았다. C#·.NET 예제 172개는 .NET 10 SDK로 컴파일·실행했지만 ASP.NET 서버·실제 데이터베이스·서비스 배포는 실행하지 않았다. 프레임워크 과정도 개념 예제를 실제 서버에서 돌린 증거로 보지 않는다. |
| 중간 | 문항 ID 변경과 저장된 풀이 기록 | 의미가 바뀐 Java·Python·React·Spring·PostgreSQL·Next.js 문항은 새 ID 또는 답안 revision을 사용했다. 이 문항의 이전 답 기록과 완료 표시는 새 ID에 자동 연결되지 않는다. 다음 제품 점검에서 진도 이관 안내가 필요한지 확인한다. |

### 재검수 범위 판정

이번 재검수는 명확하게 재현된 오류를 수정하고 해당 오류의 회귀 검사를 추가한 **표적 재검수**다. 일부 기존 품질 검사에는 모든 보기·정답·예제 실행이 포함되지만, 전체 11개 트랙의 324주·4,860개 연습을 이번에 각각 다시 읽고 검증한 것은 아니다. 이전 문서의 100%는 과거 배치 완료 기록으로만 남기며, 위 남은 항목을 닫기 전에는 전체 의미 품질이 완료됐다고 표시하지 않는다.

## 2026-10-20 추가 표적 검수

후속 확인에서 정답 판정과 실제 운영 조건을 잘못 가르칠 수 있는 다섯 문제를 더 찾아 수정했다. 이번 범위도 해당 사례 중심이며 전체 과정 검수 완료를 뜻하지 않는다.

| 영역 | 확인 후 수정한 문제 | 회귀 근거 |
|---|---|---|
| C#/.NET W3 D5 | 계산 결과를 수학적 값으로 묻는데 `25.00`만 허용하던 단답을 `25`, `25.0`, `25.00`, `25.000`으로 보완했다. 다른 숫자값은 오답으로 남긴다. | `tests/csharp-curriculum-quality.test.js`에서 같은 decimal 값의 네 표기를 허용하고 잘못된 값은 거부하는지 확인. 근거: [Microsoft C# 부동소수점·decimal 자료](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types). |
| Spring Boot W2 D2 | 제목 중복을 사전 조회만으로 막을 수 있는 듯한 설명을 바로잡았다. 동시 요청은 조회를 모두 통과할 수 있으므로 DB 고유 제약과 제약 위반 처리가 함께 필요하다고 명시했다. | `tests/spring-curriculum-quality.test.js`에서 질문·답·해설의 동시 요청 및 DB 고유 제약을 확인. 바뀐 문항은 새 ID를 사용한다. 근거: [Spring Data JPA 쿼리 메서드 키워드](https://docs.spring.io/spring-data/jpa/reference/query-methods.html), [PostgreSQL 고유 제약](https://www.postgresql.org/docs/18/ddl-constraints.html). |
| PostgreSQL W28 D5 | 트랜잭션 커밋이나 outbox만으로 외부 메시지의 중복 전달이 사라지는 듯한 설명을 고쳤다. 안정된 멱등 키와 수신자 또는 전달 서비스의 중복 제거가 필요하다고 명시했다. | `tests/postgresql-quality.test.js`의 정답 및 중복 전달 경계 검사. 근거: PostgreSQL [직렬화 실패](https://www.postgresql.org/docs/18/transaction-iso.html)와 [전체 트랜잭션 재시도](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), AWS [트랜잭셔널 아웃박스](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html). |
| Next.js W31 D2 | 정적 export용 GET Route Handler 예제에 필요한 `dynamic = "force-static"` 조건을 넣고, 요청별 입력과 빌드 시 정적 응답의 차이를 설명했다. | `tests/nextjs-curriculum-quality.test.js`에서 코드·질문·해설 확인. 근거: [Next.js export mode](https://nextjs.org/docs/app/guides/backend-for-frontend#export-mode). |
| FastAPI W30 D5 | 네 가지 통합 테스트 사례를 묻는 단답이 예시 문장 하나만 허용해, 의미가 같은 목록을 써도 오답 처리할 수 있었다. 질문에 확인할 네 사례를 명시하고 성공 목록·없는 ID·생성·잘못된 입력을 빠짐없이 말하는 세 가지 표현을 추가했다. 일부 항목만 답하면 계속 오답이다. | `tests/fastapi-course-quality.test.js`에서 질문·허용 답 4개·불완전 답 거부를 확인. 근거: [FastAPI TestClient 테스트](https://fastapi.tiangolo.com/tutorial/testing/). |

앞선 네 영역의 대상 회귀 73/73과 FastAPI 과정 15/15가 통과했다. TypeScript 단답 130개도 검토해 모두 예제의 마지막 출력값을 묻고, 정답 값은 예제 실행·타입 회귀로 확인된 것을 대조했다. 새 FastAPI 답안 허용 범위를 포함한 통합 검사와 정적 출시 검사는 아래에서 최신 결과로 기록한다. 문항 의미가 바뀐 경우 새 ID 또는 revision을 사용했으므로 과거 풀이 기록은 새 문항으로 자동 이전되지 않는다. 이 결과도 전체 11개 트랙의 의미 검수가 끝났다는 뜻은 아니다.

### 공식 버전·오류 복구 API 재확인

- FastAPI 과정과 코딩 문제에 적힌 0.143.1은 10월 14일 당시 최신판이었지만 10월 20일 현재는 오래된 정보였다. [공식 릴리스 목록](https://github.com/fastapi/fastapi/releases)과 [0.143.4 릴리스](https://github.com/fastapi/fastapi/releases/tag/0.143.4)를 대조해 최신 안정판 0.143.4(10월 18일 공개)로 과정·단답 정답·출처·문제 설명을 고쳤다. 0.143.4는 선택 의존성으로 httpx2를 추가한다. 브라우저에서 검증한 실행기 FastAPI 0.143.0과 그 의존성은 바꾸지 않았다.
- Next.js 과정의 최신판 안내는 16.4.1에서 멈춰 있었다. [공식 npm 버전 목록](https://www.npmjs.com/package/next?activeTab=versions)과 [현재 error.js API 문서](https://nextjs.org/docs/app/api-reference/file-conventions/error)를 확인해 16.4.2로 갱신했다. 학습 예제에는 문서 확인 기준과 실제 프로젝트 lockfile 버전을 따로 적고, lockfile이 여전히 16.4.1인 예제는 일부러 유지해 최신 문서 확인이 설치 버전을 바꾸지 않는다는 점을 분명히 했다.
- Next.js W29–W30 예제 한 곳은 `unstable_retry`가 16.4.1의 현행 API라고 잘못 설명했다. 공식 문서의 버전 이력은 `unstable_retry`가 16.2.0에 추가되고 `retry`가 16.3.0에 안정화됐다고 적는다. 과정의 현재 예제·설명은 안정 API `retry()`로 통일하고 과거 이름은 오답 설명에서만 구분한다. 실제 Next.js 서버 실행 검증을 했다는 뜻은 아니다.
- 표적 회귀 73/73, 전체 `npm test` 394/394, `npm run check:release`가 모두 통과했다. 출시 검사는 정적 파일 150개(가장 큰 파일 9.621 MiB), same-origin 연결·스크립트, 격리 실행기 CSP, 서버 파일·런타임 패키지·학습자 데이터 미포함을 확인했다. `git diff --check`도 확인했으며 내용 오류는 없고 기존 LF→CRLF 줄바꿈 알림만 남았다.

## 2026-10-20 Python W16–W18 오답·출력 추가 재검수

- 세 주차의 객관식 15개에서 선택지별 피드백, 힌트, 풀이를 실제 예시와 대조했다. 같은 공통 문구를 반복하던 설명을 `@dataclass`, 기본값, `assert`, 테스트 입력 격리, 재현 정보, 로그 수준, traceback, 예외 원인, 최소 수정 사례에 맞춰 각각 고쳤다. 선택지 ID·정답 연결은 바꾸지 않았다.
- Python 3.15 기준 W16 D2의 `tags: list = []`는 인스턴스끼리 목록을 공유하는 예제가 아니라 `@dataclass`가 클래스 정의 중 `ValueError`를 내는 잘못된 선언이다. 오류 줄 설명과 이전 검사 fallback을 함께 바로잡았다. 올바른 기본값은 `field(default_factory=list)`이며 Python 3.12.10에서 잘못된 선언이 실제로 `ValueError`를 내는 것을 확인했다. 근거: [Python 3.15 dataclasses — mutable defaults](https://docs.python.org/3.15/library/dataclasses.html#mutable-default-values).
- W18 D2는 `logging.warning()` 로그와 `print()` 결과가 함께 나오는데 단답이 둘 중 무엇을 묻는지 분명하지 않았다. 질문에 표준 출력의 `print` 값만 답하고, 로그는 표준 오류와 분리된다고 적었다. 로그 수준의 심각도와 기본 출력 경계는 [Python Logging HOWTO](https://docs.python.org/3.15/howto/logging.html)와 대조했다.
- `assert`의 실패 동작과 최적화 시 제거 가능성은 [Python simple statements](https://docs.python.org/3.15/reference/simple_stmts.html#the-assert-statement), 예외 확인은 [unittest](https://docs.python.org/3.15/library/unittest.html), 예외 호출 경로는 [traceback](https://docs.python.org/3.15/library/traceback.html), 명시적 원인 연결은 [Python errors and exceptions](https://docs.python.org/3.15/tutorial/errors.html#exception-chaining)과 대조했다.
- `node --test tests/python-spring-quality.test.js` 13/13, 전체 `npm test` 396/396 통과. 이번 수정은 Python 15문항의 피드백과 한 오류 사례에 한정되며 전체 트랙 의미 검수 완료율을 올리지 않는다.

## 2026-10-20 Python W19–W21 예시·피드백 추가 재검수

- 성능·HTTP·동시성 세 주차의 객관식 15개와 예제·출력·오류 위치를 서로 대조했다. W19 D3은 한 번만 정렬하는 코드를 반복 정렬한다고 설명하던 문구를 실제 코드에 맞췄다. W19 D4는 `values` 정의가 빠져 실행하면 `NameError`가 나는 예제를 보완하고, 이중 반복의 실제 작업 증가 줄을 3번 줄로 지정했다.
- W20 D2의 `DemoClient`는 timeout 전달만 확인하는 모형이다. 실제 네트워크 요청을 하지 않는다는 안내를 답을 제출하기 전에 문제에 표시했다. 상태 201은 성공 계열이라는 설명과, 빈 목록에 `all(...)`을 적용하면 True가 된다는 사례를 확인했다.
- W21에서는 취소 뒤 `CancelledError`를 다시 전달하는 흐름, `gather(return_exceptions=True)` 결과의 예외 객체, I/O 대기용 스레드, `ProcessPoolExecutor`의 직렬화·`__main__` 조건, 공유 카운터 전체를 감싸는 Lock을 확인했다. 근거: [Python timeit](https://docs.python.org/3.15/library/timeit.html), [asyncio tasks](https://docs.python.org/3.15/library/asyncio-task.html#task-cancellation), [concurrent.futures](https://docs.python.org/3.15/library/concurrent.futures.html), [threading locks](https://docs.python.org/3.15/library/threading.html#lock-objects), [RFC 9110 status codes](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3).
- `tests/python-spring-quality.test.js` 14/14, 전체 `npm test` 397/397, 정적 출시 검사 150개 파일(최대 9.621 MiB) 통과. W19–W21 세 주차에 대한 이번 표적 검수이며 11개 트랙 전체 의미 검수 완료나 CQ 완료율에는 포함하지 않는다. 다음 검수 묶음은 Python W22–W24다.

## 2026-10-20 Python W22–W24 CLI·저장·설계 추가 재검수

- 세 주차의 객관식 15개와 실제 일일 예제·출력·오류 줄을 대조했다. W22 D5의 중첩 인용부호 f-string은 읽기 쉽고 구버전에서도 쓸 수 있도록 중간 변수로 나눴다.
- W23 D4 백업 검사에서 JSON `true`는 Python `True`로 변환되고 `bool`은 `int`의 하위형이라 `version == 1`만 검사하면 잘못된 백업이 통과할 수 있었다. bool 여부를 먼저 제외하도록 고쳤다. W24 D5 올바른 저장 예제도 수리 과제와 맞춰 제목이 문자열이며 공백뿐이 아닌지 확인한 뒤 writer를 호출한다. 근거: [Python JSON decoding table](https://docs.python.org/3.15/library/json.html#json-to-py-table), [Python bool type](https://docs.python.org/3.15/library/functions.html#bool).
- W22–W24의 실제 Python 예제 15개를 Python 3.12.10에서 실행했다. 출력 14개와 `SystemExit(2)` 종료 상태 한 개가 각 등록 답과 일치했다. `tests/python-spring-quality.test.js` 14/14, 전체 `npm test` 397/397, 정적 출시 검사 150개 파일(최대 9.621 MiB) 통과. 다음은 Python W25–W26의 캡스톤 문항이며 전체 트랙 의미 검수 완료나 CQ 완료율에는 포함하지 않는다.


## 2026-10-20 Python W25–W26 캡스톤·회귀 추가 재검수

- W25–W26의 목표, 선택지별 설명, 오류 찾기, 수리 문제, 예제 출력과 정답을 대조했다. W25 D4 백업 검증은 정상·버전 불일치·bool 버전·필수 필드 누락 네 사례로 검사해 4/4가 됨을 확인한다. W25 D5와 W26 D1–D5는 틀린 설명이 정답처럼 읽히거나 선택지와 해설의 연결이 맞지 않던 부분을 고쳐 단일 정답과 구체적인 오답 설명을 제공한다. 선택지 문구 의미를 바꾼 문제는 W25 D5와 W26 다섯 문항에 -v2 ID를 사용한다.
- Python 3.12.10에서 W25–W26 일일 예제 10개를 실행했다. 표준 출력 10개가 등록된 추적 답안과 모두 일치했다. 백업 version은 bool을 정수로 받아들이지 않도록 검사하며, CLI 도움말 문제는 argparse에 등록된 --backup 인자와 도움말 생성 동작을 확인한다. 공식 근거: [Python JSON 변환표](https://docs.python.org/3.15/library/json.html#json-to-py-table), [bool과 int의 관계](https://docs.python.org/3.15/library/functions.html#bool), [argparse 도움말 형식화](https://docs.python.org/3.15/library/argparse.html#argparse.ArgumentParser.format_help), [sum](https://docs.python.org/3.15/library/functions.html#sum), [sorted](https://docs.python.org/3.15/library/functions.html#sorted), [timeit](https://docs.python.org/3.15/library/timeit.html).
- tests/python-spring-quality.test.js 14/14, 전체 npm test 397/397, npm run check:release 150개 파일(최대 9.621 MiB) 통과. 이번 검수는 표적 검수이며 전체 트랙 의미 검수 완료나 완료율 상승으로 계산하지 않는다. 다음 검수는 JavaScript W1–W3 문제·정답·학습 흐름이다.

## 2026-10-20 JavaScript W1–W12 예제·답안 추가 재검수

- W1–W12의 오늘의 예제, 주요 문항의 정답·힌트·해설, 오류 위치와 코드 수정 판정을 다시 연결했다. W4 D4는 기본 매개변수 요구가 있어도 매개변수가 없거나 다른 함수 인자 목록을 가진 답안을 통과시키는 구조 채점 결함을 확인했다. 시작 코드의 함수 이름과 매개변수 선언까지 보존하도록 판정식을 좁히고, 기본값 누락·추가 인자 오답 회귀를 넣었다.
- W7 D3의 블록 범위 복습 문제를 범위 설명일인 D1로 옮겨 클로저 독립 상태를 다루는 D3의 문제 묶음을 정리했다. W9 D5 출력 해설은 다른 예제 문자열을 가리키고 있었고, W11 D1·D2·D5의 추적 해설·힌트도 질문의 실제 코드와 다른 실행 흐름을 설명해 각각 바로잡았다.
- W12 D2의 ‘오류’ 제목은 0으로 나눈 결과가 예외가 아니라 `NaN`이라는 코드 설명과 어긋나 ‘빈 배열 나눗셈’으로 고쳤다. D5 종합 예제는 앞선 점수 검증 목표를 실제 평균 함수에 연결해 잘못된 점수를 `RangeError`로 거부하는 흐름까지 보인다. 기존 정답 의미는 바꾸지 않았다.
- W1–W3 조건 문제 중복, W3 반복문에서 배우지 않은 `break`를 요구한 문제, W5 D3 중복 오류 찾기는 앞선 편집에서 서로 다른 사례와 필요한 문항 ID로 고쳤다. 변경 ID는 `js-conditionals-boolean-v2`, `js-loops-accumulation-trace-v2`, `js-w5-d3-debug-v3`다.
- JavaScript/React 관련 검사 41/41, 전체 `npm test` 398/398, `npm run check:release` 150개 정적 파일(최대 9.621 MiB) 통과. DOM·requestAnimationFrame은 Node 모형과 브라우저 실제 동작을 구분했다. 이 기록은 표적 재검수이며 전체 11개 트랙의 의미 검수 완료나 CQ 완료율 상승으로 계산하지 않는다. 다음 검수 묶음은 JavaScript W13–W15다.

## 2026-10-23 JavaScript W13–W15 추가 재검수

- 문자열 검색 정규화, 공백 접기, NFC 비교와 빈 검색어 처리, UTC 날짜·잘못된 날짜·서머타임 경계, JSON, Set/Map의 삽입 순서·객체 키 동일성·값 0 조회를 15개 예제와 45문항에서 다시 대조했다. 문제 목표, 출력 답, 오류 줄, 힌트·해설, 수리 기준이 맞으며 학습 내용 오류는 찾지 못했다.
- W14 D5는 2026년 뉴욕 서머타임 전환에서 현지 시계는 01:30에서 03:30으로 이동하지만 UTC 기준 실제 경과 시간은 1시간임을 확인한다. 공식 [NIST 2026 서머타임 일정](https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst)을 과정 출처에 추가하고 공식 출처 도메인 검사에도 반영했다.
- JavaScript/React 표적 회귀 41/41, 출처·콘텐츠 회귀 72/72, 전체 `npm test` 398/398, `npm run check:release` 150개 정적 파일(최대 9.621 MiB) 통과. 기존 CQ 완료율은 바꾸지 않는다. 다음 재검수 묶음은 JavaScript W16–W18이다.

## 2026-10-23 JavaScript W16–W18 추가 재검수

- 제너레이터의 `next()` 결과와 `return` 종료 값, 지연 순회 및 `for...of` 조기 종료 정리, 클래스 private 필드·`this` 바인딩·의존성 합성·`super`, 프로토타입 조회·자체 속성·허용 필드 검사를 15개 예제와 45문항에서 대조했다. 일일 출력과 객관식 근거, 오류 줄, 수리 답을 확인했다.
- W17 D5 수리 문제는 `MemoryStore`가 부모 `save`를 그대로 상속해도 계약을 만족하지만, 이전 정적 채점은 동일 메서드를 중복 작성한 답만 인정했다. 안내를 상속/재정의 두 경우로 분명히 하고, 둘 다 허용하도록 채점 패턴과 회귀 검사를 고쳤다. 문자열을 반환하는 기존 결함 답은 계속 거부한다.
- W16 D4·D5에서 `yield*`로 한 값이나 입력 iterable에 위임하는 올바른 답도 기존 `yield`/`for...of` 패턴만으로는 통과하지 못했다. 두 형태를 모두 채점하도록 넓히고 대표 입력에서 값과 순서가 같은지 확인했다.
- JavaScript/React 회귀 32/32, 전체 `npm test` 398/398, `npm run check:release` 150개 정적 파일(최대 9.621 MiB), 변경 JavaScript 구문 검사를 통과했다. CQ 완료율은 바꾸지 않는다. 다음 재검수 묶음은 JavaScript W19–W21이다.

## 2026-10-23 JavaScript W19–W21 테스트·디버깅·성능 추가 재검수

- 테스트의 경계·격리·비동기 완료 대기, 최소 재현·오류 전달, 단조 시계·Set 조회·계산 재사용·반복 측정·목록 범위를 15개 예제와 45문항에서 대조했다. 코드 출력과 목표, 정답 이유, 오류 줄, 실패/경계 사례가 맞으며 학습 내용 오류는 찾지 못했다.
- 정적 수리 채점의 좁은 범위를 고쳤다. W19 D4는 `await`와 Promise를 반환하는 `.then()`을, W21 D4는 `reduce`와 `for...of` 평균 계산을 허용한다. W21 D5는 동등한 inline 또는 임시 변수 `slice` 범위 계산도 받는다. 각 답은 빈 입력·정상 입력·범위 경계에서 직접 실행해 결과를 확인했다.
- JavaScript/React 회귀 32/32, 전체 `npm test` 398/398, `npm run check:release` 150개 정적 파일(최대 9.621 MiB), 변경 JavaScript 구문과 diff 검사를 통과했다. 전체 CQ 완료율은 바꾸지 않는다. 다음은 JavaScript W22–W24다.

## 2026-10-23 JavaScript W22–W24 저장·요청 흐름 추가 재검수

- W22–W24의 예제 15개와 문항 45개를 다시 대조했다. W22에는 완료 수를 숫자로 저장하는 예제와 완료 ID 배열을 쓰는 예제가 섞여 있었다. done을 문자열 ID 배열로 통일하고, 파싱된 JSON이 null이거나 배열 모양이 다르면 기본 진도로 복구하도록 읽기·마이그레이션 흐름을 보강했다. 마이그레이션은 v1/v2 자료 형태와 ID 값의 타입을 검사하고 알 수 없는 구조를 거부한다.
- storage 이벤트 예제는 특정 키 삭제뿐 아니라 localStorage.clear()의 key === null, 손상된 JSON, 잘못된 진도 모양도 처리한다. W23의 response.ok·빈 응답·네트워크/JSON 오류·finally 흐름과 W24의 최신 요청 검사, AbortController, Effect cleanup, 디바운스 흐름을 대조했다. React Effect cleanup은 [React 공식 문서](https://react.dev/reference/react/useEffect), HTTP 성공 범위는 [WHATWG Fetch](https://fetch.spec.whatwg.org/), 저장소 변경·전체 삭제 이벤트는 [WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)로 확인하고 JavaScript 과정의 출처에 추가했다.
- 정상·누락·손상·JSON null·잘못된 필드·구버전·미지원 버전, 특정 키 삭제 및 저장소 전체 비우기를 실행하는 회귀를 추가했다. 이 재검수는 표적 확인이며 전체 CQ 완료율을 바꾸지 않는다. 전체 트랙의 의미 검수는 계속 진행 중이다.
- 최종 확인: JavaScript/React 대상 32/32, 콘텐츠·G10 JavaScript 출처 및 단원 회귀 40/40, 전체 npm test 398/398, npm run check:release 통과(150개 파일, 최대 9.621 MiB). 문법 검사와 변경 파일 diff 점검도 통과했다.

## 2026-10-23 JavaScript W25–W26 안전한 화면 출력·최종 기능 추가 재검수

- W25–W26의 예제 10개와 문항 30개에서 사용자 입력 처리, 출력, 답·오답 설명, 코드 수정 기준과 마지막 통합 흐름을 대조했다. W25 D5는 일반 JavaScript 배열의 push를 실제 DOM 목록 요소에도 쓸 수 있는 것처럼 보여, browser DOM에서 사용할 수 있는 list.append(item)과 같은 동작을 하는 테스트 모형으로 바꿨다. 실제 브라우저 보안·키보드 동작을 검사했다고 표시하지 않는 경계 설명은 유지한다.
- W25 텍스트 표시·쿼리 값 인코딩·허용 경로·비밀정보 저장과 W26 함수 결과·오류/빈 상태·링크 의미·배포 전 점검의 정답 근거를 대조했다. 변경 내용은 기존 문항의 정답 의미를 바꾸지 않으며 CQ 완료율에는 반영하지 않는다.
- JavaScript/React 및 G10 JavaScript 회귀 41/41, 콘텐츠·공식 출처 검사 40/40, 전체 npm test 398/398, npm run check:release 통과(150개 파일, 최대 9.621 MiB). 전체 트랙의 의미 검수는 계속 진행 중이다.
- 최종 확인: JavaScript/React 및 G10 JavaScript 회귀 41/41, 콘텐츠·공식 출처 확인 40/40, 전체 npm test 398/398, npm run check:release 통과(150개 파일, 최대 9.621 MiB). 변경한 예제의 JavaScript 구문 검사도 통과했다. 전체 CQ 완료율은 변경하지 않는다.

## 2026-10-23 PostgreSQL 실행형 문제 26–50 추가 재검수

- 중급 후반부터 실전까지 25개 문제의 요구사항·SQL·답 설명·사례 결과를 확인했다. 고급 주제 순위 문제는 정답 SQL이 `RANK()`인데 설명은 동점 다음 순위를 건너뛰지 않는다고 잘못 안내했다. `RANK()`는 동점 뒤 순위를 건너뛰고, `DENSE_RANK()`는 건너뛰지 않도록 설명을 정답과 일치시켰다. PostgreSQL 공식 [윈도 함수 문서](https://www.postgresql.org/docs/18/functions-window.html)와 대조했다.
- 범위 밖의 초급 문제 1–2도 같이 확인했다. `COUNT(*)`로 시도 행 수를 세면서 출력 이름이 `learner_count`였던 부분을 `attempt_count`로 수정했다. 문제 설명은 반복 시도와 서로 다른 학습자를 구분해 읽기 쉬운 한국어로 고쳤다. PostgreSQL 공식 [집계 함수](https://www.postgresql.org/docs/18/functions-aggregate.html), [SELECT 출력 열 이름](https://www.postgresql.org/docs/18/queries-select-lists.html), [SQL 문서](https://www.postgresql.org/docs/18/sql.html)를 참고했다.
- 조인·CTE·하위 질의·조건식·정렬·LIMIT·비교 연산·제약 조건도 PostgreSQL 18 공식 문서와 대조했다. 2026-10-23 기준 공식 안내에서 18.6은 안정판이고 19 RC 1은 출시 후보이며, RC 2 예정일은 2026-11-12다. [18.6 릴리스 정보](https://www.postgresql.org/docs/release/18.6/), [19 RC 1 공식 안내](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/).
- PostgreSQL 전용 검사 23/23, 50개 문제의 공개 SQL 사례 300개를 PGlite / PostgreSQL 18.3에서 실행해 정답과 일치함을 확인했다. 전체 `npm test` 398/398, `npm run check:release` 150개 정적 파일 통과. 검수 날짜·출처 날짜는 이번에 확인한 문제에만 갱신했으며 CQ 전체 완료율은 변경하지 않는다.

## 2026-10-23 TypeScript 실행형 문제 26–50 추가 재검수

- 25개 문제의 요구사항·예제·정답 구현을 다시 연결하고, 타입 변환기에서 정답 함수가 50개 입력 사례를 반환하는지 검사했다. `isValidCount`는 유한한 정수 여부만 확인해 `Number.MAX_SAFE_INTEGER`보다 큰 값도 개수로 받아들이고 있었다. ECMAScript의 안전 정수 범위를 사용하도록 `Number.isSafeInteger`로 바꾸고 최대 안전 정수는 받고 그 다음 정수는 거부하는 공개 사례를 추가했다. 근거는 [ECMAScript 2022 Number.isSafeInteger 사양](https://tc39.es/ecma262/2022/multipage/numbers-and-dates.html#sec-number.issafeinteger)이다.
- `newestRecord`는 `createdAt: number` 안에 포함되는 `NaN`이나 무한대를 처리하지 않아, 잘못된 시간이 첫 항목이면 뒤의 유효한 기록을 비교하지 못했다. 유한하지 않은 시간을 건너뛰고 유효 기록이 없으면 null을 반환하도록 바꿨다. JSON 공개 사례는 NaN·무한대를 표현할 수 없으므로 별도 런타임 회귀로 이 경계를 확인했다.
- TypeScript 7.0.2 안정판과 TypeScript 7.1 Beta 시험판을 구분해 과정 및 문제 은행의 버전 설명을 갱신했다. 공식 TypeScript 팀의 [7.1 Beta 발표](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)와 [7.0 발표](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)를 대조했다. 사이트 실행기는 계속 TypeScript 6.0.3 구문 변환기이며 정적 타입 진단은 수행하지 않는다고 명시한다.
- TypeScript 표적 회귀 4/4, 전체 `npm test` 399/399, `npm run check:release` 정적 파일 150개 통과. 변경한 TypeScript·PostgreSQL 파일 문법과 `git diff --check`도 확인했다. 이 기록은 문제 26–50과 전역 버전 표시에 관한 표적 검수이며 TypeScript 첫 25개 문제 또는 전체 CQ 완료율을 승인하지 않는다.

## 2026-10-23 Python W1–W3 재검수·최신 안정판 안내

- 첫 3주·15일의 목표, 예제, 45문항, 오류 위치와 수정 조건을 다시 대조했다. `has_title` 문제에는 입력이 문자열 또는 `None`이라는 범위가 없어 이를 명시했다. `parse_age`라는 이름의 함수는 음수 문자열도 받아들여 증가시키면서 실제 나이 검증처럼 보였으므로, 정수 문자열 변환만 수행하도록 요구를 정리하고 `parse_integer` 함수와 새 문항 ID `py-w01-d5-repair-v2`를 발행했다. 이전 문항 ID의 풀이 기록은 새 문제로 옮기지 않는다.
- 양수 사례만 있던 `//` 설명에는 `-17 // 5 == -4`, `-17 % 5 == 3` 실행 예제를 더해 0 방향 버림과 내림을 혼동하지 않게 했다. `f-string`은 화면 제목에서 먼저 용도를 알 수 있게 쓰고, `falsy` 같은 영어 표현은 한국어 설명으로 바꿨다. 목록 컴프리헨션 설명과 수정 지시도 코드 문법을 풀어 쓰도록 고쳤다.
- 버전 안내를 Python 3.15.1로 갱신했다. Python.org는 3.15.1을 2026-10-21 공개된 3.15 계열 첫 유지보수판으로 기록한다. [공식 Python 3.15.1 릴리스](https://www.python.org/downloads/release/python-3151/), [조건·반복·range](https://docs.python.org/3.15/tutorial/controlflow.html), [문자열 출력 형식](https://docs.python.org/3.15/tutorial/inputoutput.html#formatted-string-literals), [참/거짓 판정](https://docs.python.org/3.15/library/stdtypes.html#truth-value-testing)을 대조했다. 실행 검증은 로컬 Python 3.12.10이며 3.15.1 런타임 검증은 아니다.
- Python 예제 출력 15/15, 대상 Python·카탈로그 회귀 52/52, 전체 `npm test` 399/399가 통과했다. `npm run check:release`도 정적 파일 150개에서 통과했다(최대 9.621 MiB, same-origin 연결, 격리 실행기 CSP, 서버·런타임 패키지·학습자 데이터 미포함). 이번 범위는 W1–W3와 Python 버전 표시에 한정되며 전체 과정 의미 검수 완료나 CQ 완료율 상승으로 계산하지 않는다.

## 2026-10-23 Python W4–W9 함수·자료구조·파일·반복자 추가 재검수

- W4–W6의 일별 예제 15개와 문항 45개에서 함수의 반환·기본값·지역 범위, 목록의 평균·인덱스·변경·정렬·복사, 딕셔너리 조회·포함 확인·순회가 코드와 답·해설에 맞는지 대조했다. W5 D5 수리 함수는 `filter_courses`라는 이름과 실제 입력인 분 목록 필터링이 맞지 않아 `filter_minutes`로 고치고 새 ID `py-w05-d5-repair-v3`를 발행했다. 같은 날 제목과 안내의 낯선 컴프리헨션 용어도 조건으로 새 목록을 만드는 방식이라고 풀어 썼다.
- W7–W9의 예외 전파와 좁은 예외 처리, 파일 인코딩·줄 단위 읽기·임시 교체, 이터레이터·제너레이터의 순서와 소진을 확인했다. W8 D4는 줄 단위 파일 처리를 설명하면서 메모리 안 `StringIO`를 사용해 목표 동작과 예제가 어긋났다. 실제 임시 텍스트 파일을 열고 파일 객체를 반복하는 예제로 바꿨다. 얕은 복사와 목록 생성, 복사 깊이의 설명은 Python 공식 [자료 구조 문서](https://docs.python.org/3.15/tutorial/datastructures.html) 및 [얕은·깊은 복사 문서](https://docs.python.org/3.15/library/copy.html)와 대조해 출처 목록도 보강했다.
- 수정 후 Python W4–W9 예제 출력 30/30, 대상 콘텐츠·회귀 검사 41/41, 전체 `npm test` 399/399, `npm run check:release` 150개 정적 파일(최대 9.621 MiB)이 통과했다. 실행은 로컬 Python 3.12.10이며 Python 3.15.1에서 직접 실행한 검증은 아니다. 이번 표적 검수는 전체 콘텐츠 감사 완료나 CQ 완료율로 계산하지 않는다.

## 2026-10-24 Python W10–W12와 문항 안내 문구 추가 검수

- W10 클래스 예제에서 `__init__` 대신 `_init_`를 쓴 문제는 이름만 저장되지 않는 것이 아니라 `Student("민아")` 생성 시 인자를 받을 생성자가 없어 `TypeError`가 난다. 오류와 풀이를 실제 동작에 맞췄다. W11 `asyncio.sleep` 예제는 기다림을 흉내 내며 실제 네트워크 요청은 하지 않는다고 표시했다. W12 캡스톤 선택 문항과 일일 예제에서 완료 필드가 `completed`/`done`으로 달랐던 부분은 새 ID `py-capstone-choice-v2`로 분리해 `done`으로 통일했다.
- Python 3.15 공식 [클래스 문서](https://docs.python.org/3.15/tutorial/classes.html), [asyncio 작업 문서](https://docs.python.org/3.15/library/asyncio-task.html), [자료 구조 문서](https://docs.python.org/3.15/tutorial/datastructures.html)와 대조했다. 실행 검증은 사용 가능한 로컬 Python 3.12.10 범위이며 3.15.1 런타임 실행을 뜻하지 않는다.
- 반복 안내 문구는 질문마다 과정·주차·일차·제목을 남기고 핵심 지시만 보이도록 줄였다. 개념은 “맞는 설명을 고르세요”, 결과 추적은 “실행 결과를 입력하세요”, 오류 찾기는 “요구사항과 맞지 않는 줄을 고르세요”로 통일했다. 오류 찾기 문항이 없는 수리 문제 날은 해당 검사를 건너뛰게 했다.
- 대상 콘텐츠·Python 회귀 69/69, 전체 `npm test` 399/399, `npm run check:release` 150개 파일(최대 9.621 MiB), 변경 JavaScript 구문 검사가 통과했다. `git diff --check`에는 내용 오류가 없고 기존 LF→CRLF 줄바꿈 알림만 있었다. 전체 CQ 완료율은 변경하지 않는다. 다음 Python 재검수는 W13–W15다.

## 2026-10-24 Python W13–W15 문자열·날짜·파일 경로 추가 검수

- 15개 일일 예제와 45문항에서 설명·정답·오답별 피드백·오류 줄·수정 조건을 대조했다. Python 3.12.10에서 15개 출력이 등록 답과 일치하고, 7개 오류 찾기 사례가 `AttributeError`, `IndexError`, `ValueError`, `JSONDecodeError`, `TypeError`, `FileNotFoundError`, `FileExistsError`를 각각 재현하는지 확인했다.
- 허용 수정안도 실행해 `course-004`의 접미사 `004` 보존, `+09:00` datetime JSON 직렬화, `LIMIT` 값 0·누락·None에서의 결과 0·10·10을 확인했다. 잘못된 숫자 설정은 `ValueError`를 전달한다. 정적 채점은 유효한 전체 함수는 받고 요구를 만족하지 않는 시작 답은 거부하는지 검사한다.
- W13 D5의 정답 피드백을 보기 반복에서 구분자 선택의 이유로 바꿨다. W14·W15 수리 문항 제목에서 반복 단어를 줄이고 W15 D5 안내에서 주제 중복을 제거했다. W15 D2는 `exists()` 확인이 나중의 읽기 성공을 보장하지 않음을 밝히고, 파일을 실제로 읽으며 `FileNotFoundError`를 처리하는 방법을 권했다.
- Python 3.15.1 공식 [정규식](https://docs.python.org/3.15/library/re.html), [날짜와 시간](https://docs.python.org/3.15/library/datetime.html), [JSON](https://docs.python.org/3.15/library/json.html), [파일 경로](https://docs.python.org/3.15/library/pathlib.html), [문자열 내장 타입](https://docs.python.org/3.15/builtins/stdtypes.html) 문서와 대조했다. 실제 실행은 로컬 Python 3.12.10에서 했으며 3.15.1 런타임 검증으로 표시하지 않는다.
- Python·콘텐츠 표적 회귀 70/70, 전체 `npm test` 400/400, `npm run check:release` 150개 파일(최대 9.621 MiB) 통과. 변경 파일 `node --check`도 통과했다. `git diff --check`는 내용 오류 없이 통과했으며 기존 LF→CRLF 줄바꿈 알림만 남았다. CQ 완료율은 변경하지 않는다.

## 2026-10-24 Java W1–W3 추가 의미 재검수

- Java 1–3주차 15일의 학습 목표·예제·45문항·보기별 설명·오류 줄·수정 기준을 다시 읽었다. W1 D1은 초기화 전 지역 변수를 읽는 결과를 물으면서 정답으로 `선언할 때 타입과 이름을 함께 적는다`를 표시해 질문에 맞는 정답이 없었다. 기존 답 의미를 덮어쓰지 않도록 새 ID `java-w1-d1-choice-v3`로 바꾸고, 초기화 전 읽기는 컴파일 오류라고 설명했다.
- W1 D4는 `char`를 아무 문자 하나로 오해할 수 있게 설명하고 실제 예제에는 `char` 값이 없었다. `char`가 UTF-16 코드 단위 하나를 담으며 일부 이모지는 두 단위가 필요하다는 점과 `String` 사용 범위를 짧게 추가하고, 문자 상태와 boolean 출력 예제를 넣었다. W3 D4 수정 문제의 사례 입력 `sumValues([2, 3])`와 `sumValues([])`는 Java 문법이 아니어서 `new int[] {2, 3}`과 `new int[0]`으로 고쳤다.
- Java SE 25 LTS를 학습 기준으로, JDK 27을 2026년 9월에 나온 비-LTS 기능 릴리스로 분리한 버전 설명을 Oracle의 [지원 로드맵](https://www.oracle.com/java/technologies/java-se-support-roadmap.html), [JDK 27 릴리스 정보](https://www.oracle.com/java/technologies/javase/27all-relnotes.html), [Java 27 언어 변경 안내](https://docs.oracle.com/en/java/javase/27/language/index.html)와 대조하고 출처·검토 날짜를 갱신했다. `char` 설명은 [Java SE 25 언어 명세의 타입 절](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html)과 대조했다.
- Java W1–W3 전용·메타데이터 회귀 60/60 통과. 로컬 JDK 8에서 Java 8 문법의 예제 14/14를 컴파일·실행해 주석 출력과 일치시켰고, 수정한 배열 합계 함수는 일반 입력 5·빈 배열 0을 반환했다. Java 25 컴파일러가 없어 Java 14부터 지원되는 switch 표현식 예제는 실행 검증하지 않았다. 전체 CQ 완료율은 변경하지 않으며 Java 나머지 주차와 타 트랙의 의미 검수는 계속한다.

## 2026-10-24 Java W1–W12 중복·정답 연결 추가 재검수

- W1–W9의 같은 날 질문 중 사실상 같은 답을 요구하던 쌍을 분리했다. 메서드의 조건 분기와 실제 반환 추적, 생성자와 클래스 호출, 인터페이스 메서드 역할, 컬렉션의 결과 값처럼 하루 학습 목표 안에서 서로 다른 판단을 하도록 바꿨다. 달라진 답 의미에는 새 문항 ID를 발행했다.
- W10 D1의 기존 문제는 “어떤 결과인가요?”라고 묻지만 정답은 결과 목록이 아니라 `filter`의 일반 역할을 설명했다. 기존 ID와 정답 문구 연결은 보존하고 질문을 역할 확인으로 고쳤으며, 새로 추가한 문제는 `[60, 85]` 출력과 중복값 보존을 각각 묻는다. W10 D3의 flatMap 결과 반복, W10 D5의 재사용 여부 반복도 출력 추적과 `count()` 확인으로 나눴다.
- W11은 `start`와 `run` 확인을 `join`, volatile의 가시성과 복합 증가의 원자성, latch의 `await()`와 `countDown()`으로 나눴다. W12는 객체 위치·지역 참조, 목록 크기와 실제 메모리 할당량, 워밍업 절차와 최적화 보장 여부, p95 출력과 선택 순위를 따로 확인한다. W12 D4 수리 문제는 `nanoTime()`으로 경과 시간을 구하는 코드인데 “프로파일링”을 구현하라는 설명과 어긋나, 실제 함수 계약과 병목 확인의 차이를 명시하도록 고쳤다.
- W10–W12 예제 15개를 로컬 JDK 17에서 `javac --release 16`으로 컴파일하고 실행해 표준 출력 15/15가 등록 결과와 일치함을 확인했다. 이는 Java 16 언어/API 기준 예제 검증이며 Java SE 25 런타임 검증은 아니다. Java·콘텐츠 표적 회귀 63/63, 전체 `npm test` 405/405, `npm run check:release` 150개 정적 파일(최대 9.621 MiB), 변경 파일 구문 검사와 `git diff --check`를 통과했다. Git의 기존 LF→CRLF 줄바꿈 알림 외 내용 오류는 없었다.
- 이번 범위는 Java W1–W12의 표적 의미 재검수다. Java W13–W26, 다른 트랙 전체, 자유형 답안의 허용 기준은 아직 새로 전수 검수하지 않았다. CQ 완료율은 변경하지 않는다. 다음 Java 묶음 W13–W15의 후속 결과는 아래 기록에 남겼다.

## 2026-10-24 Java W13–W15 파일·시간대·입력 검증 추가 재검수

- 15개 예제와 45문항을 다시 대조했다. 기존 문항은 제목만 바꾼 범용 질문, 같은 날 개념·응용 문항의 겹치는 정답, 영어 API 키워드만 적는 짧은 답에 치우쳐 있었다. 예제의 실제 파일·시간·입력값을 따라 답할 수 있도록 질문을 새로 썼다. 답 의미가 달라진 선택·응용 문항은 새 ID로 분리해 기존 풀이 기록을 보존했다.
- W13에서는 `Path.resolve`, UTF-8, 없는 파일과 입출력 예외, `Files.writeString`의 기본 덮어쓰기·UTF-8·반환값, 파일 확인 직후 상태가 바뀔 수 있는 흐름을 확인했다. 파일 확인과 실제 읽기 사이의 문제는 한국어 상황 설명부터 제시하고, 실제 작업의 예외 처리가 필요하다고 덧붙였다.
- W14에서는 `LocalDate`·`LocalDateTime`·`Instant`의 구분, 서울 시각 변환, 날짜 계산과 불변성을 확인했다. 시간대 규칙으로 빠진 시각은 해당 간격만큼 앞으로 이동하고 겹친 시각은 기본적으로 전환 전 오프셋을 선택하는 `atZone` 동작을 설명에 추가했다.
- W15에서는 `parseInt`의 잘못된 입력, `requireNonNull`의 예외, 양수 입력 경계, record가 데이터 값을 묶는 역할과 JSON 응답 변환의 차이, 비밀값을 오류에 노출하지 않는 원칙을 확인했다. DTO의 첫 노출은 ‘데이터 전달 객체’로 풀어 썼다.
- Oracle Java SE 25 공식 [Path](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Path.html), [Files](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Files.html), [날짜·시간 API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/package-summary.html), [ZonedDateTime](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/ZonedDateTime.html), [Integer](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Integer.html), [Objects](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html), [record 클래스 명세](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.10)를 과정 출처 목록에 추가했다.
- 로컬 JDK 17에서 15개 예제를 `javac --release 16`으로 컴파일·실행해 출력 15/15가 등록 답과 일치했다. 이는 Java 16 언어/API 기준 검사이며 Java SE 25 런타임 검증은 아니다. Java·콘텐츠 표적 회귀 51/51, 전체 `npm test` 406/406, `npm run check:release` 150개 정적 파일(최대 9.621 MiB), 변경 파일 구문 검사가 통과했다.
- 이 결과는 Java W13–W15의 표적 재검수다. W16–W26, 다른 트랙의 전체 의미 검수, 자유형 답안 허용 범위는 남아 있으며 CQ 완료율은 변경하지 않는다. 수정은 아직 공개 사이트에 배포하지 않았다.

## 2026-10-24 Java W16–W18 네트워크·테스트·설계 계약 재검수

- W16–W18의 15개 학습일과 45문항을 예제·정답·오답별 설명에 맞춰 대조했다. 기존에는 일반 문구를 바꿔 붙인 질문이 많고, 같은 날 개념과 응용 문제의 답도 겹쳤다. URI의 경로·쿼리, 요청 방식과 전송, 상태 코드 범위, 요청 제한 시간, 응답 본문, 테스트 경계·예외·독립성, 객체 책임·저장소 계약을 각각 따르는 질문으로 고쳤다. 새 답 의미는 새 문항 ID로 분리해 저장된 기존 풀이가 다른 뜻으로 채점되지 않게 했다.
- W16에서 주소나 `HttpRequest`를 만드는 단계는 실제 요청 전송이 아님을 문항과 설명에 넣었다. 응답 본문 예제의 `SampleResponse`가 코드에서 직접 만든 로컬 모형인 점도 밝혔다. 고정 상태 코드 204가 200 이상·300 미만 검사에 통과하는 것과 404가 통과하지 않는 것을 확인했고, 성공 응답 범위의 의미를 HTTP 표준과 대조했다.
- W17의 `assertEquals`와 `assertThrows`는 예제 안에 직접 쓴 작은 검증 함수이며 JUnit API나 테스트 러너를 사용한 것이 아니었다. 주차 안내에 이를 분명히 쓰고 실제 프로젝트에서 JUnit 테스트를 등록해 실행하는 것과 구분했다. W18에서는 id를 무시하고 Java 강의를 무조건 돌려주던 메모리 저장소를 Map 기반 조회로 바꿨다. 키가 없으면 `Optional.empty()`가 되고, 호출부는 값이 없어도 예외 없이 기본 문구를 표시한다. 변경 영향 예제의 무조건 `.get()` 호출도 제거하고, 수리 문제에서 존재·부재 두 조건을 확인하도록 했다.
- 공식 자료를 출처 목록에 추가하고 대조했다: Oracle Java SE 25 [URI](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/net/URI.html), [HttpRequest.Builder](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpRequest.Builder.html), [HttpResponse](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpResponse.html), [Optional](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html), [HTTP 2xx · RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-successful-2xx), [JUnit 사용자 안내](https://docs.junit.org/current/user-guide/).
- JDK 17에서 UTF-8·`--release 16`으로 W16–W18 예제 15개를 컴파일하고 실행해 등록된 출력 15/15가 일치했다. Java·콘텐츠 표적 검사 52/52, 전체 `npm test` 407/407, `npm run check:release` 150개 정적 파일(최대 9.621 MiB) 통과다. 이 실행은 Java SE 25 런타임 검증이 아니다.
- 이번 결과는 Java W16–W18의 표적 재검수이며 CQ 완료율을 바꾸지 않는다. Java W19–W26, 다른 트랙 전체, 자유형 답안 허용 범위는 계속 검수해야 한다. 공개 사이트에는 배포하지 않았다. 다음 Java 묶음은 W19–W21이다.

## 2026-10-24 Java W19–W21 테스트·컬렉션·정렬 재검수

- W19–W21의 15개 학습일과 45문항에서 질문이 실제 예제 코드의 조건과 결과를 묻는지, 선택 정답과 오답 설명이 일치하는지 다시 확인했다. 반복되던 범용 질문을 구체적인 코드와 사례를 따르는 질문으로 교체했고, 기존 풀이가 다른 의미로 채점되지 않도록 의미가 바뀐 문제는 새 문항 ID를 발급했다.
- W19는 재귀의 종료 조건과 음수 입력, 팩토리얼의 `long` 범위 및 `Math.multiplyExact` 오버플로, 작은 예제의 실행 출력, 재귀 깊이와 스택 한계를 구분했다. W20은 `equals`와 `hashCode` 계약, record의 얕은 불변성, 복사본과 원본의 변경, 변경 가능한 Map 키의 위험을 확인했다. W21은 `HashMap` 조회 성능이 해시 분산에 따라 달라지는 점, 정렬 안정성, `binarySearch` 전제 조건과 중복 값에서의 반환 위치, 반열린 구간 `[from, to)`를 문항·예제·설명에 맞췄다.
- W21의 이분 탐색 복구 예제는 입력이 오름차순으로 정렬되어 있어야 함을 명시했다. 찾지 못했을 때 음수 삽입 위치를 반환하는 규칙과, 같은 값이 여러 개면 어느 일치 위치가 반환될지 정해져 있지 않다는 점을 공식 문서와 대조했다. `HashMap`의 일반적인 상수 시간 동작은 해시 분산이 잘 되는 경우라는 조건을 함께 적었다. Oracle Java SE 25 [Collections](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Collections.html), [HashMap](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html), [Math](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Math.html), [StackOverflowError](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StackOverflowError.html)를 근거로 확인했다.
- JDK 17에서 `javac --release 16`으로 W19–W21의 Java 예제 14개를 컴파일·실행해 출력 14/14가 등록 답과 일치했다. Git 명령 흐름 예제는 실제 저장소에서 실행한 것이 아니라 정적 흐름으로 확인했다. 이 확인은 Java 16 언어/API 기준이며 Java SE 25 런타임 검증은 아니다.

## 2026-10-24 Java W22–W24 재귀·알고리즘 문제 재검수

- W22–W24의 15개 학습일과 45문항을 예제, 요구사항, 정답, 오답 설명 및 코드 수리 조건과 대조했다. 질문을 각 날짜의 실제 입력과 코드 흐름에 맞게 구체화하고, 답이 겹치거나 일반적인 표현만 바꿔 묻던 문항을 분리했다. 짧은 답은 여러 한국어 표현도 인정하고, 답이 왜 맞는지 설명을 보강했다.
- 재귀 예제는 음수와 종료 조건을 다루고, 팩토리얼 곱셈은 `long` 범위를 넘으면 `Math.multiplyExact`가 예외를 던지도록 했다. `sumTo`도 음수를 거부하며 큰 입력은 반복문이 적절하다는 범위를 밝혔다. 이분 탐색은 정렬된 입력이 전제이고, 중복 값의 일치 위치가 특정되지 않음을 설명했다. `mergeCount` 수리 문제는 `Math.addExact`로 합산 오버플로를 검출하지만, 이 조각만으로 전체 분할 정복 알고리즘을 완성했다고 오해하지 않도록 범위를 명시했다. Java의 `Exact` 산술 동작과 재귀 스택 한계를 공식 문서와 확인했다.
- JDK 17에서 `javac --release 16`으로 예제 15개를 컴파일·실행했고 출력 15/15가 등록 답과 일치했다. 수리·경계 사례 6개도 직접 실행했다. 표적 Java·콘텐츠 검사 54/54, 변경한 JavaScript 파일 구문 검사, 전체 `npm test` 409/409, `npm run check:release` 150개 정적 파일(최대 9.621 MiB) 통과다.

## 2026-10-24 Java W25–W26 후속 예제 계약 확인

- W25–W26의 10개 예제와 30문항을 다시 대조하면서 앞서 확인한 요구사항과 실제 예제 코드가 끝까지 일치하는지 확인했다. 다음 단계 계산 예제는 음수 입력 거부 및 오버플로 검출을 모두 보여주도록 고쳤고, 저장소 조회 예제는 `id`가 null이어도 비교 중 예외가 나지 않도록 문자열 상수 쪽에서 비교한다.
- JDK 17에서 `javac --release 16`으로 예제 10개를 컴파일하고 출력 10/10을 확인했다. 성능 시간 출력은 실행 한 번의 관찰값이며 벤치마크나 일반적인 성능 보장으로 설명하지 않는다.
- 이 재검수로 Java W1–W26의 표적 재확인은 마쳤다. 이는 Java 전 과정의 무결성 보증이 아니며, 다른 트랙의 의미 검수와 주관식 허용 답안 범위 확인은 계속 남아 있다. 이번 표적 Java·콘텐츠 검사 54/54, 전체 `npm test` 409/409, `npm run check:release` 150개 파일(최대 9.621 MiB)이 통과했다. CQ 완료율은 변경하지 않았고 수정은 공개 사이트에 배포하지 않았다.

## 2026-10-24 C# W1–W35 주관식 답안·예제 출력 추가 재검수

### C# W1–W3 — 변수·불리언·문자열 출력

- 15개 주관식의 요구 값, 출력 예시, 등록 답안을 대조했다. W2 D3·D5와 W3 D4는 질문이 요구한 값과 코드의 실제 출력이 같은 정보를 담는데도 구분 기호가 달라 실제 출력 그대로 제출하면 오답 처리될 수 있었다. 실제 출력 `2/True`, `4/5;2`, `상태:완료/1`을 동등 답으로 추가하고 W2 D4에는 한국어 답 `거짓`을 허용했다. 불리언 문자열의 대문자 표기는 Microsoft 공식 [Boolean.ToString](https://learn.microsoft.com/en-us/dotnet/api/system.boolean.tostring?view=net-10.0) 문서와 대조했다.

### C# W4–W6 — 조건·반복·메서드

- 15개 주관식에서 출력 요구와 정답의 범위를 비교했다. W6 D4의 두 `Console.WriteLine` 결과는 실제로는 두 줄인데, 기존 정답은 슬래시로 이어져 있었다. 답안 정규화가 줄바꿈을 공백으로 바꾸는 동작에 맞춰 `안녕하세요, 민서 반가워요, 민서` 형식도 허용했다. 분기명·상태값처럼 출력만으로 질문의 모든 요구를 답하지 못하는 문항은 전체 답을 요구하는 기존 기준을 유지했다.

### C# W7–W9 — 컬렉션·LINQ·null

- 15개 주관식에서 실제 출력과 답안을 맞췄다. 배열 길이·목록 개수와 원소 순서를 묻는 W7 D1·D2는 출력 `3/85`, `4/C#,API,LINQ,LINQ`도 질문에 답한다. W8 D4의 그룹 출력 두 줄 `A/2`, `B/1`도 줄바꿈을 공백으로 정규화한 형식으로 추가했다.

### C# W10–W12 — record·속성·객체 지향

- 15개 주관식 중 W10 D4·D5와 W11 D1·D2·D3·D5는 요청한 필드·상태가 콘솔 출력에 이미 들어 있었지만 답안에는 같은 값을 별도 항목으로 한 번 더 요구했다. 실제 출력 `7/반복문`, `C#/1`, `2`, `1`, `LINQ`, `70`도 인정하게 했다. W12 D2의 두 줄 출력은 정규화된 `C# [C#]` 형식도 받도록 했다.

### C# W13–W15 — 제네릭·delegate·예외

- 15개 주관식에서 W14 D2의 두 출력 줄 `4`, `log:완료`와 W15 D2의 `handled`, `cleanup`이 등록 답과 다른 구분 기호를 사용했다. 줄바꿈이 공백으로 정규화된 실제 출력 답안을 각각 추가했다. 나머지는 정확한 출력값 또는 질문이 요구하는 예외 형식·결과 조합과 일치했다.

### C# W16–W18 — 자원·비동기·버전

- 15개 주관식에서 W16 D1·D2와 W17 D3의 세 줄 출력은 `;`로 이어 쓴 답과 달랐다. 실제 줄 순서를 공백으로 정규화한 답도 인정했다. W16 D4의 업무 검증 결과 `invalid`도 전체 출력과 동등한 답으로 추가했다. 다른 단답은 예외·취소·API 결과와 일치했다.

### C# W19–W21 — 테스트·프로젝트·Host 구성

- 15개 주관식의 질문이 요청한 반환값·환경 사실·서비스 수명 범위와 등록 답을 대조했다. 실제 출력과 등록 답의 모양이 달라 생기는 오답 위험을 찾지 못했다.

### C# W22–W24 — 관측·HTTP 요청·응답 계약

- 15개 주관식의 구조화 로그 필드, 상태 코드·route metadata, 요청 계약 결과를 실제 코드 출력과 대조했다. 줄 순서·경로·요약 문자열과 정답이 일치해 별칭 수정은 필요하지 않았다.

### C# W25–W27 — EF Core·접근 권한·성능

- 15개 주관식에서 DTO 노출 필드, 읽기·쓰기 흐름, 권한 결과와 가상 성능 비교 입력을 확인했다. 측정하지 않은 숫자를 실측값으로 말하지 않는 설명이 유지되며 출력·등록 답 불일치는 찾지 못했다.

### C# W28–W30 — 동시성·운영·화면 상태

- 15개 주관식의 비동기 열거, 취소·재시도 결과, 설정·상태 분기를 대조했다. 실제 앱·네트워크·데이터베이스가 동작했다고 표현하지 않으며 출력 답도 예제와 일치했다.

### C# W31–W33 — 검토·통합·소유권

- 15개 주관식의 변경 목록, API 상태 분기, 진행 기록 접근 결과를 점검했다. 요구한 항목과 출력 문자열의 순서가 일치해 별칭 수정은 필요하지 않았다.

### C# W34–W35 — 복구·출시 캡스톤

- 10개 주관식의 중복 저장·버전 충돌·가져오기·출시 증거 흐름을 대조했다. 실제 운영 배포나 데이터베이스 검증을 암시하지 않고 출력과 등록 답이 일치해 답안 수정은 필요하지 않았다.

- 총 175개 단답의 질문·값·예제 출력 관계를 표적 검토했고, 실제로 답이 될 수 있는 출력·표현 21개를 새 허용 답으로 추가했다. 문항 ID와 정답 의미는 바꾸지 않았다. C#은 사이트에서 컴파일·실행하는 과정이 아니므로 이번에도 .NET 프로그램을 실행한 것으로 기록하지 않는다. CQ 전체 완료율은 바꾸지 않는다.

## 2026-10-24 Kotlin W1–W31 단답 질문·예제 연결 추가 재검수

- Kotlin·Android 31주차의 단답 155개를 질문, 당일 예제, 등록된 출력 답안과 대조했다. W1–W6에서 앞서 발견한 반복 질문을 구체화한 데 이어 W7–W24의 90개 질문도 람다·컬렉션·null 처리·클래스·제네릭·예외·코루틴·Flow·Android 설정과 상태 복원 예제에 맞게 작성했다. W25–W31의 35개 적용 질문은 별도 주제에 맞는 표현과 답안 연결을 확인했다. 전체 155개 질문은 서로 다르며 공통 “결과를 적어 보세요” 문구로 남은 항목이 없다.
- 등록된 답안은 코드 추적 결과와 대조했다. 선택지·정답 키와 주차별 답안 연결은 기존 품질 검사로 확인하고, 테스트에 155개 질문의 고유성 검사를 추가했다. Kotlin 2.4.0의 context parameters 안정화와 explicit context arguments·collection literals의 실험 상태는 [Kotlin 공식 2.4.0 변경 사항](https://kotlinlang.org/docs/whatsnew24.html), 2.4.21 최신 수정판은 [Kotlin 공식 릴리스 기록](https://kotlinlang.org/docs/releases.html)과 대조했다. Android 17 API 37과 LAN 접근 권한 흐름은 [Android 공식 API 수준 표](https://developer.android.com/guide/topics/manifest/uses-sdk-element) 및 [Android 17 동작 변경](https://developer.android.com/about/versions/17/behavior-changes-17)과 대조했다.
- Kotlin 전용 품질 검사와 콘텐츠 검사는 46/46 통과했다. **이번 검수는 화면에서 Kotlin 코드를 컴파일·실행한 검증이 아니다.** 로컬 Kotlin 컴파일러, Android SDK, 에뮬레이터가 없어 코드 출력은 정적 추적으로 확인했다. Kotlin 전 과정의 객관식·설명·모든 오답 선택지를 새로 의미 검수한 것은 아니며, 다른 트랙의 남은 검수도 계속한다. CQ 전체 완료율은 바꾸지 않았고 변경은 공개 사이트에 배포하지 않았다.

## 2026-10-24 문항별 안내·한국어 표현 추가 재검수

- **Java W25–W26:** 객관식 10개에 주제별 힌트·정답 근거·오답 설명을 추가했다. 주관식 8개는 한국어 답도 인정하도록 보완하고, 주차 목표와 소개를 실제 복습·설계 내용에 맞게 고쳤다.
- **Python W16–W26:** 출력 추적 힌트 55개, 오류 줄 찾기 힌트 44개, 객관식 힌트 40개를 각 문제 개념에 맞게 작성했다. W18 D2는 디스크 부족으로 쓰기가 실패한 상황과 로그 수준을 일치시켰다. W18 D4는 예외 변수 error를 실제로 바인딩해 안내한 수정 코드를 실행할 수 있게 했다.
- **FastAPI W30:** 어색한 조사와 자동 생성된 무관 문구를 걷어내고, 객관식·오류 찾기에 주제별 힌트와 정답 설명을 추가했다.
- **React:** useSubscription, 상태 판별, 도움말 컴포넌트, 댓글 출력, 저장 진행 복구 등 5개 수정 문제에서 무관한 공통 힌트·설명을 해당 문제에 맞게 바꿨다.
- 위 변경의 회귀 검사는 Java, Python, FastAPI, React 전용 품질 테스트에 추가했다. 표적 회귀 66/66과 전체 npm test 419/419가 통과했다. 릴리스 빌드와 150개 정적 파일 검사도 통과했다. git diff --check는 오류 없이 끝났고, 저장소의 LF→CRLF 변환 알림만 출력했다.
- 이 배치는 지정된 문항 안내·표현과 재현 가능한 결함을 대상으로 한 추가 검수다. 전 과정의 모든 설명·선택지·오답 해설·주관식 허용 답을 새로 대조한 것은 아니다. CQ는 계속 열어 두며 완료율을 올리지 않는다. 변경은 공개 사이트에 배포하지 않았다.

## 2026-10-24 TypeScript W1–W26 예제 출력과 답안 대조

- TypeScript 주간 과정 전체 130개 예제를 번들 TypeScript 변환기로 JavaScript로 바꿔 실행하고, 실제 console 출력과 주관식 등록 답을 비교했다.
- W18 D3은 배열 두 항목을 모두 출력하면서 답안은 둘째 줄만 등록한 불일치였다. 예제를 둘째 항목만 출력하도록 바꿔 콜백의 두 인자와 index 1이라는 학습 목표를 유지하고, 한 줄 출력 답안과 일치시켰다.
- 전 과정 출력 비교를 회귀 검사로 추가했다. tests/typescript-course-quality.test.js 18/18 통과.
- 이 확인은 예제 출력과 추적 답안의 일치 검사다. 객관식 선택지·오답 해설과 모든 수정 과제의 실제 요구 충족을 새로 전수 검수했다는 뜻은 아니다. CQ는 열려 있으며 전체 완료율을 바꾸지 않는다.

## 2026-10-24 Kotlin W1–W3 기초 개념·보기 의미 재검수

- 15일치 예제 추적 질문, 개념 선택 문제, 적용 질문과 각 오답 설명을 대조했다. 출력 답은 제시된 식의 순서·구분자와 맞고, 선택지와 피드백에서 개념을 뒤집어 설명하는 결함은 찾지 못했다.
- Kotlin 공식 문서의 숫자 안내에서 Int overflow 예시와 IEEE 754 부동소수점 범위, 문자 안내에서 Char의 UTF-16 코드 단위와 보조 평면 이모지 처리, 멀티플랫폼 공식 표에서 Kotlin/Wasm의 현재 안정성 표시를 확인했다. 과정은 Wasm을 가능한 대상으로만 말하고 안정판이라고 주장하지 않아 표현 수정은 필요하지 않았다.
- 이 과정은 이 환경에 Kotlin 컴파일러가 없어 이번에도 코드를 실행하지 않았다. 결과는 정적 추적과 공식 문서 대조이며, 나머지 Kotlin 과정의 선택지·설명 의미 검수는 계속 남아 있다. CQ 완료율은 바꾸지 않는다.

## 2026-10-24 JavaScript·Python 실행 결과 추가 대조

- **JavaScript:** 질문에 실행 코드가 포함된 출력형 단답 87개를 Node 격리 문맥에서 실행했다. 두 모듈 동적 import 문제는 격리 실행기 설정이 없어 제외했다. 실행한 87개 모두 질문 코드의 실제 출력과 허용 답이 일치했다.
- **Python:** Python 3.12.10에서 질문이 당일 예제 전체의 출력을 묻고 부작용이 제한된 예제 107개를 실행했다. 출력 또는 명시된 프로세스 종료 코드는 모두 등록 답과 일치했다. 질문이 예제 일부 표현만 묻는 7개와 파일·네트워크·프로세스·스레드 등 부작용이 있거나 별도 실행 경계가 필요한 16개는 일괄 실행에서 제외했다.
- 두 확인은 실행 가능한 추적 답의 대조다. 객관식 정보·오답 설명·오류 찾기·수정 과제의 모든 의미를 전수 검수했다는 뜻은 아니며 Python 3.15 전용 동작의 검증도 아니다. CQ는 열어 두고 완료율을 바꾸지 않는다.

## 2026-10-24 JavaScript W1–W3 선택 문제 힌트 추가 확인

- 격리 브라우저에서 실제 문제의 보기·오답 피드백·힌트·정답 설명을 확인했다. 첫 자료형 문제의 힌트가 함수 반환과 호출자를 언급해 주제와 무관했고, 전체 JavaScript 과정에서 같은 기본 문구를 사용하는 선택 문제를 11개 찾았다.
- 첫 3주차의 누적 대입·템플릿 문자열·반환값 저장·엄격 비교·공백 검사·논리 조건·재시도 제한·배열 인덱스·누적합·배열 끝·reduce 초기값에 맞춰 힌트를 구체화했다. 정답 설명은 typeof minutes의 결과가 자료형 이름 "number"를 담은 문자열임을 밝히고, 오답도 각각 문자열 자료형인 이유를 설명한다.
- tests/javascript-react-quality.test.js에 개별 힌트와 설명 회귀를 추가했다. 표적 디자인/JavaScript 회귀 59/59, 전체 npm test 423/423, npm run check:release 150개 파일, git diff --check 통과. 주간·일일 목록의 중복 참조를 한 번만 센 JavaScript 고유 문항 390개에서 해당 기본 힌트가 남지 않은 것을 확인했다. CQ 전체 완료율은 바꾸지 않으며 다른 과정의 모든 설명·정답 의미 검수로 확대 해석하지 않는다. 변경은 로컬 작업 트리에만 있다.

## 2026-10-24 JavaScript W4–W6 코드 수정 정답 판정 추가 검수

- W4–W6 15일·45문항의 목표, 설명, 실행 예제, 객관식 보기와 오답 피드백, 단답 허용 답, 오류 줄과 코드 수정 요구·기준을 대조했다. 다섯 코드 수정 문제에서 학습 목표의 전체 계약을 지키는 답이 정규식 자동 채점에서 거부되는 것을 재현했다: 문자열 결합으로 표시 문자열을 만들기, `slice()`·`toSorted()`·`Array.from()`으로 원본을 보존한 정렬, 빈 배열 가드와 `at(-1)`로 마지막 값 반환, 문자열 결합으로 요약 만들기, `Object.assign()`으로 원본을 바꾸지 않는 객체 갱신.
- 요구 사항과 해설은 결과와 입력 보존을 요구했지만 특정 템플릿 문자열 또는 전개 문법만 정답 패턴에 넣어 다른 올바른 구현을 오답 처리했다. `src/curriculum-expansion-javascript.js`에 계약을 만족하는 대체 패턴을 추가하고, W5 D4 소개·목표 및 W5 D5 수리 설명을 사용할 수 있는 API 선택지에 맞췄다. W5 D5 학습 목표도 검증 기준에 맞는 길이로 명확히 작성했다.
- 각 허용 구현을 `node:vm`에서 실행해 두 대표 입력·경계 사례가 요구한 값을 내는지 확인한다. 정렬 복사와 객체 갱신은 원본을 그대로 두는지도 검사한다. ECMAScript 2026의 공식 규격은 `Array.prototype.toSorted()`의 새 배열 반환 동작을 정의한다([ECMA-262 §23.1.3.34](https://tc39.es/ecma262/2026/multipage/indexed-collections.html#sec-array.prototype.tosorted)); `Object.assign()`은 제공된 target에 열거 가능한 속성을 복사하므로 새 객체를 넘기면 입력 객체를 바꾸지 않고 갱신 결과를 만들 수 있다([ECMA-262 §20.1.2.1](https://tc39.es/ecma262/2026/multipage/fundamental-objects.html#sec-object.assign)).
- `tests/grading.test.js`에 모든 허용 변형의 채점·실행·경계·원본 보존 및 불완전 답안 거부 검사를 추가했다. 관련 JavaScript·G10·콘텐츠·채점 검사 4개 파일이 통과했고, 수정 후 `tests/grading.test.js` 9개 검사도 통과했다. W4–W9 변경을 합친 전체 `npm test`가 실패 없이 종료했고, `npm run check:release`는 빌드와 150개 파일(최대 9.621 MiB)을 통과했다. `git diff --check`는 내용 오류 없이 끝났으며 LF→CRLF 줄바꿈 알림만 있었다.
- 이 배치는 JavaScript W4–W6의 표적 검수이며 전체 트랙의 모든 수리 문제 검수나 CQ 완료율 상승으로 계산하지 않는다. 후속 W7–W9 검수는 아래 기록에 남겼다.

## 2026-10-24 JavaScript W7–W9 클로저·입력 검증 추가 재검수

- W7–W9 15일·45문항의 예제 출력, 질문과 정답·오답 설명, 오류 위치, 수정 문제의 요구·힌트·해설을 다시 대조했다. W8 D4의 오답 설명은 Number("2.5")가 NaN이 된다고 잘못 안내했다. 실제로는 숫자 2.5로 변환되고 Number.isInteger(2.5)가 false라 null이 된다. "12.0"은 숫자 12로 변환되므로 통과한다. 문제·예제·설명·정답 출력을 이 규칙에 맞게 고쳐 "12 12 null null"을 보이도록 했다.
- W7 D4·D5, W8 D4·D5, W9 D4에서 요구 결과와 조건을 만족하는 조기 반환, count += 1 또는 일반 함수 형태, 작은따옴표, Boolean 검사, 정리한 문자열 반환 구현이 정적 채점에 거부되는 것을 확인했다. 동등한 대표 구현을 허용했고 Node 격리 실행에서 상태 공유, 정상·빈·비문자 입력, 함수 반환값을 실행해 요구 결과를 확인했다.
- ECMAScript 2026의 [StringToNumber 규칙](https://tc39.es/ecma262/2026/multipage/abstract-operations.html#sec-stringtonumber)은 숫자 문자열 변환과 공백 문자열의 0 변환을 정의하고, [Number.isInteger](https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html#sec-number.isinteger)는 Number 값이 정수 값인지 판정한다. 이 두 절을 과정의 접힌 공식 출처 목록에도 추가하고 검토 날짜를 2026-10-24로 갱신했다.
- JavaScript W7–W9 예제 출력과 문항 연결, 동등 구현·실제 실행, 공식 출처 날짜를 확인하는 회귀를 보강했다. tests/grading.test.js, tests/javascript-react-quality.test.js, tests/g10-javascript-curriculum-quality.test.js, tests/content.test.js 표적 검사 4개 파일이 통과했다. W4–W9 변경을 합친 전체 npm test가 실패 없이 종료했고, npm run check:release 빌드와 150개 파일(최대 9.621 MiB), git diff --check도 통과했다. diff 검사에서 기존 LF→CRLF 줄바꿈 알림만 확인했다.
- 이번에도 CQ 전체 완료율은 변경하지 않는다. JavaScript W7–W9와 W4–W6은 표적 재검수이며, 전체 과정의 모든 수정 답안이 동등한지 확인했다는 뜻은 아니다. 다음 검수 묶음은 JavaScript W10–W12다.

## 2026-10-24 JavaScript W10–W12 비동기·이벤트 루프·통합 문제 재검수

- W10–W12 15개 예제와 45문항의 요구, 정답·오답 설명, 코드 흐름, 추적 출력, 오류 줄, 코드 수정 기준을 대조했다. Fetch의 HTTP 오류와 네트워크 거절, JSON 본문 처리, 취소 신호 전달, 마이크로태스크·타이머·화면 갱신 예약, 빈 통계 입력, 중복 완료 기록의 동작이 예제와 일치했다. `fetch`와 화면 예약 예제는 실제 네트워크나 렌더러 실행이 아니라 모형으로 한정해 안내한다. 이 묶음에서는 내용상의 정답 오류를 찾지 못했다.
- 다만 W10 D4·D5, W11 D4·D5, W12 D4·D5의 코드 수정 자동 채점이 계약을 만족하는 흔한 대체 구현을 거부할 수 있었다. `async/await`, 요청 옵션 변수 전달, 이름 있는 callback, 예약 래퍼, 반복문 평균 계산, `indexOf`·`concat`을 이용한 불변 업데이트를 허용하도록 보완했다.
- `tests/grading.test.js`에서 허용 구현을 Node 격리 문맥에 넣어 실제 반환값, 예약 시점, 빈 입력, 원본 배열 보존, 중복일 때 같은 배열 참조 반환까지 확인하고 불완전한 시작 코드 변형은 계속 거부하는 회귀를 추가했다. 관련 표적 검사 4개 파일 통과, 전체 `npm test` 통과, `npm run check:release` 통과(150개 파일, 최대 9.621 MiB), `git diff --check` 통과.
- WHATWG Fetch 표준의 `Response.json()`, HTTP 상태와 `ok`, 요청의 `AbortSignal` 동작 및 HTML의 event loop·microtask·타이머 규칙과 대조했다. CQ 전체 완료율은 바꾸지 않는다. 이 표적 검수로 JavaScript 전체나 다른 과정의 모든 동등 답안이 검수된 것은 아니다. 다음 순서는 JavaScript W13–W15다.

## 2026-10-24 JavaScript W13–W15 문자열·시간·컬렉션 재검수

- W13–W15 예제 15개와 문항 45개의 출력, 정답·오답 근거, 오류 줄, 경계 입력과 코드 수정 요구를 ECMAScript 2026·ECMA-402 공식 명세와 대조했다. NFC 문자열 비교, 빈 검색어 정책, Date 시간대와 타임스탬프, DST 전환, 잘못된 Date, Map의 키 동일성·순회 순서와 Set의 중복 제거 결과는 등록 답과 일치했다. W14 DST 사례의 2026-03-08 날짜도 NIST 일정과 확인했다.
- `toLowerCase()`를 모든 언어의 완전한 대소문자 무시 검색처럼 읽을 수 있는 표현을 좁혔다. W13 목표와 첫 검색 예제는 영문 코스 이름에 적용하며, 다른 언어는 서비스별 문자 비교 규칙을 정해야 한다고 명시했다.
- W13 D4·D5, W14 D4·D5, W15 D4·D5 코드 수정 채점이 조건을 만족하는 지역 변수 사용, 지정 로케일 소문자 변환, 유효 Date의 유한값 검사, 시간 변환식, Map 직접 전개/`Array.from`, Set 기반 배열 변환을 거부할 수 있었다. 기존 함수 이름·인자와 요구 결과를 지키는 구현을 추가 허용했다.
- `tests/grading.test.js`에 대체 답안의 실행 검사를 더해 공백·분해형 악센트, 유효/무효 Date, 음수·0·양수 시간 차, Map 빈 입력·삽입 순서·원본 보존, Set 빈 입력·원본 보존을 확인했다. 잘못된 답은 계속 거부한다. W13–W15 예제 출력과 DST trace 검사를 포함한 JavaScript·콘텐츠 표적 검사 4개 파일이 통과했다. 이후 전체 `npm test`, `npm run check:release`(150개 파일, 최대 9.621 MiB), 변경 JavaScript 구문 검사도 통과했고 `git diff --check`에 내용 오류는 없었다.
- 접힌 과정 출처 목록에 ECMA-262 문자열 정규화·소문자 변환·Map/Set·Date와 ECMA-402 `Intl.DateTimeFormat` 근거를 추가했다. 전체 CQ 완료율은 바꾸지 않는다. JavaScript 나머지 주차와 다른 트랙의 전수 의미 검수는 계속 남아 있다. 다음 순서는 JavaScript W16–W18이다.

## 2026-10-24 JavaScript W16–W18 generator·클래스·prototype 재검수

- W16–W18의 15개 예제와 45문항을 모두 다시 읽고 예제 출력·정답·오답별 설명·오류 줄·경계 조건을 Node에서 확인했다. generator의 지연 실행, `next()`의 `value`/`done`, `yield`와 `return`, `for...of` 조기 종료 때 `finally`, private field, 분리한 메서드의 `this`, 의존성 합성, `super` 호출, 객체 자체 속성·prototype 조회·열거, 허용 필드 검사 결과는 ECMAScript 2026과 일치했다. 이 범위에서 개념상의 오답은 찾지 못했다.
- W17 D3은 선택 문제에서 “메모리 저장”을 말하지만 예제의 save 함수가 문자열만 돌려주는 점을 발견했다. 배열에 실제 저장하고 실패 입력은 저장하지 않도록 주간·일일 예제를 바꿔 설계 설명과 실행 결과를 맞췄다.
- W17 D4·D5, W18 D4·D5의 정적 코드 채점이 요구를 만족하는 템플릿 문자열, Boolean 동등식, `if` 블록·`continue` 형태를 거부할 수 있어 허용 패턴을 추가했다. 기존에 추가한 W16의 `yield*` 구현도 실제 결과 회귀로 확인했다. 대체 구현은 정상·빈·상속·허용되지 않은 키 경계에서 직접 실행했다.
- 접힌 공식 출처 목록에 ECMA-262 generator/iterator, class/private field, `super`, `Object.hasOwn`, `for...in` 관련 항목을 추가했다. 로컬 `#/lesson/js-week-17`에서 수정 예제의 표시와 일일 섹션을 확인했고, 출처가 처음에는 접혀 있으며 펼치면 새 공식 링크가 보이는 것도 확인했다.
- `tests/javascript-react-quality.test.js`와 `tests/content.test.js` 표적 검사 68/68, `npm run build` 성공. 전체 테스트·출시 검사 결과는 마지막 통합 검증 뒤 추가 기록한다. 이번 표적 재검수는 CQ 전체 완료율을 바꾸지 않으며 공개 사이트에는 배포하지 않는다. 다음 순서는 JavaScript W19–W21이다.

## 2026-10-24 JavaScript W19–W21 테스트·오류 분석·성능 추가 재검수

- W19–W21의 15개 예제와 45문항에서 테스트의 비동기 완료 조건, 빈 입력 정책, 고립된 테스트 데이터, 오류 재현·관찰, 안전한 오류 정보 기록, 단조 시계를 사용한 측정, 반복 횟수와 표본 평균, 목록 범위 자르기를 다시 대조했다. 등록된 답과 정답 근거 사이에서 개념 오류는 찾지 못했다. W19의 Promise 검사는 Node `node:test` 예시이고, W21의 성능 측정은 `performance.now()`의 단조 시계 특성을 사용한다.
- 여섯 코드 수정 문제(W19 D4·D5, W20 D4·D5, W21 D4·D5)에서 계약을 충족하는 인라인 `await`, 매개변수 구조 분해, 오류 재전달, 속성 단축 표기, 일반 인덱스 반복문, `Math.max` 인자 순서 변경 형태를 추가로 허용했다. 실행 회귀에서 정상/실패 Promise, 빈/비어 있지 않은 사례, 정상/잘못된 JSON, 오류 정보, 빈/비어 있지 않은 표본, 음수·범위 초과 목록 위치를 확인했다.
- 공식 출처를 접힌 JavaScript 참고 목록에 추가했다: [Node.js 18 test runner](https://nodejs.org/download/release/latest-v18.x/docs/api/test.html), [W3C High Resolution Time](https://www.w3.org/TR/hr-time-3/#dom-performance-now). 콘텐츠 출처 검사도 두 공식 도메인을 허용하도록 수정했다.
- `tests/javascript-react-quality.test.js`와 `tests/content.test.js` 표적 검사 68/68 통과. 최초 실행에서 새 공식 링크의 도메인이 기존 허용 목록에 없어 1건 실패했고, 출처 검사 목록을 보완한 뒤 재실행해 통과했다. 이번 추가 검수만으로 전체 CQ 완료율을 올리지 않으며, 통합 테스트·릴리스 검사 결과는 아직 기록하지 않는다. 화면 확인이나 공개 배포는 하지 않았다.

## 2026-10-30 JavaScript W17–W19 학습 흐름 보완

- 기존 W16–W18 클래스·합성·prototype 및 W19–W21 테스트·디버깅·성능 사실 검수 기록을 재사용했다. 클래스 상태와 `this`, 합성·상속 계약, 프로토타입 조회에서 테스트의 경계·격리·비동기 대기로 이어지는 주간 순서를 확인했다.
- W19 D5의 목표는 과거 실패 입력과 정상·경계 입력을 회귀 사례로 고정하는 것이었지만 예제에는 공백·대문자 입력과 일반 문자열만 있고 빈 문자열 사례가 빠져 있었다. `"", ""` 경계 사례를 넣고 출력 추적 질문을 두 결과에서 세 결과로 바꿨다. 기존 `js-w19-d5-trace-v3` 저장 기록은 새 v4 문항으로 연결되고, 옛 ID의 정답 기준도 유지된다.
- `tests/javascript-react-quality.test.js`의 W19–W21 표적 검사 1/1, `tests/content.test.js` 40/40 통과. `npm run build`, `git diff --check`, 변경 파일 공백 검사도 통과했다. 전체 프로젝트 회귀는 실행하지 않았다. W17–W19 태스크를 닫고 W20–W21로 이동한다. 전체 CQ 완료가 아니며 공개 배포하지 않았다.

## 2026-10-30 JavaScript W20–W21 학습 흐름 확인

- 기존 W19–W21 테스트·디버깅·성능 사실 검수와 W17–W19 작업 직후 실행한 표적 검사 1/1을 재사용했다. W20의 재현→관찰→가설 검증→오류 맥락 기록 뒤 W21에서 성능을 재고 자료 조회·화면용 목록으로 적용하는 순서를 확인했다. `Set`, 배열 필터링, 평균, `slice`는 앞에서 다룬 자료구조·배열 문법을 사용한다. 새 결함은 찾지 않았다.
- W20–W21 태스크를 닫고 다음 W22–W24로 이동한다. 이미 통과한 W19–W21 검사를 반복하지 않았고 빌드·전체 회귀도 재실행하지 않았다. 전체 CQ는 미완료이며 공개 배포하지 않았다.

## 2026-10-24 JavaScript W22–W24 브라우저 저장·요청·복구 추가 재검수

- W22–W24 15개 예제와 45문항의 목표·설명·코드·정답·오답 근거를 다시 대조했다. localStorage 문자열 변환, 깨진 JSON과 지원하지 않는 버전, `storage` 이벤트의 다른 문서 전달·삭제·전체 비우기, `fetch` HTTP 오류와 네트워크 거절의 구분, 성공한 빈 목록, `finally` 로딩 정리, AbortController의 요청별 signal, React Effect cleanup, 디바운스, 최신 응답 id 비교가 각 예제의 조건과 일치했다. 저장·네트워크·React 예제가 모형 또는 개념 코드라는 제한도 화면 내용에 표시되어 있다.
- 여섯 코드 수정 문제에서 직렬화 결과를 지역 변수로 저장하는 방식, `storage` 키 검사에 배열 `includes`를 사용하는 방식, 성공 응답 분기, 본문 결과 지역 변수, 중괄호를 쓴 HTTP 오류 분기, 이름 있는 함수 callback, 조건문으로 불리언을 반환하는 방식도 요구를 지키는 풀이로 허용했다. 각 답을 정상·실패·빈 값·손상 자료·범위 밖 입력에서 실행하는 회귀를 추가했다.
- Fetch와 Web Storage는 WHATWG 공식 문서와 연결되어 있고, React Effect 자료는 React 공식 출처로 연결된다. 실제 브라우저 탭 동기화·네트워크 요청·React 렌더링을 수행한 것으로 기록하지 않는다.
- `tests/javascript-react-quality.test.js`와 `tests/content.test.js` 68/68 통과. 수정 중 비수정 문항에 패턴 목록이 없는 경우를 발견해 대체 패턴을 코드 수정 문항에만 추가하도록 고친 뒤 재검사했다. CQ 전체 완료율은 바꾸지 않았고, 통합 테스트·릴리스 검사와 제품 저장 실패 UI 검증은 남아 있다. 공개 사이트에는 배포하지 않았다.

## 2026-10-30 JavaScript W22–W24 요청 실패 흐름 보완

- 기존 W22–W24 저장·HTTP·동시 요청 사실 검수 기록을 재사용하고 하루별 흐름과 문제 연결을 확인했다. W22의 저장→검증→마이그레이션→실패→다른 탭 흐름과 W24의 최신 응답→취소→Effect 정리→디바운스 흐름에는 새 오류가 없었다.
- W23 D3의 목표는 네트워크 Promise 거절, HTTP 실패 Response, JSON 본문 파싱 실패를 구분하는 것이었지만 예제는 연결 실패만 보여 줬다. 예제에 네트워크 거절·HTTP 503·손상된 JSON 응답을 모두 넣고, 각 처리 경로와 결과 문구를 비교하도록 고쳤다. 실행 추적 문항도 세 결과를 묻도록 바꾸고 `js-w23-d3-network-trace-v4`로 갱신해 이전 v3 저장 기록을 연결했다.
- `tests/javascript-react-quality.test.js`의 W22–W24 표적 검사 1/1, `tests/content.test.js` 40/40 통과. 새 예제와 추적 질문을 실행해 출력이 일치하는 것도 확인했다. `npm run build`, `git diff --check`, 변경 파일 공백 검사가 통과했다. 전체 회귀와 실제 네트워크·브라우저 요청은 실행하지 않았다. 다음은 JavaScript W25–W26이며 전체 CQ 완료를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-24 JavaScript W25–W26 보안 경계·종합 흐름 추가 재검수

- W25–W26의 10개 예제와 30문항에서 사용자 문구의 `textContent` 표시, URL 쿼리 값 인코딩, 허용한 내부 경로, 민감정보 저장 금지, DOM 요소 생성·추가, 빈 배열 요약 초기값, 오류·빈 성공·데이터 성공 분기, 링크 요소 의미를 대조했다. 등록된 정답·해설과 예제 출력에서 개념 오류를 찾지 못했다. DOM 모형과 React 예제가 실제 브라우저의 XSS·키보드 동작을 검증하지 않는다는 제한도 확인했다.
- 네 코드 수정 문제에서 `light/dark` 직접 비교와 named catch, 작은따옴표·다른 지역 변수 이름을 쓴 DOM 추가, 중첩 삼항 상태 계산, reduce에서 true를 조건식 1/0으로 누적하는 답을 추가 허용했다. 정상·빈·오류 입력, 저장 예외, 빈 문자열, 잘못된 테마와 원본 목록 보존을 실행 회귀로 확인했다.
- 접힌 JavaScript 공식 참고 자료에 ECMA-262 `encodeURIComponent`, WHATWG HTML 링크·초점, OWASP 안전한 텍스트 출력·브라우저 저장소·리디렉션 안내를 추가했다. 근거는 [ECMA-262](https://tc39.es/ecma262/2026/multipage/global-object.html#sec-encodeuricomponent-uricomponent), [HTML Standard](https://html.spec.whatwg.org/multipage/interaction.html#focus), [OWASP XSS 예방](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [OWASP HTML5 보안](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html), [OWASP 외부 이동 검증](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)이다.
- JavaScript·콘텐츠 표적 검사 68/68 통과. W25–W26 코드 예제와 채점은 로컬 실행 및 모형 검증 범위이며 실제 보안 테스트·브라우저 접근성 검증으로 계산하지 않는다. CQ 완료율은 그대로 두고 전체 앱·저장 실패 UI·IME·사용자 관찰 및 통합 테스트는 계속 확인한다. 변경은 미배포다.

## 2026-10-24 Kotlin W4–W6 조건·반복·함수 추가 재검수

- 15개 날짜의 목표·예제·45문항 보기와 답, 힌트·해설을 한 흐름으로 대조했다. W4 D5 목표가 `&&`를 포함했지만 예제는 단순 Boolean 분기만 보여 주던 불일치를 고쳤다. 숫자 `active = 1`과 `active == 1`을 보이고 추적 질문·설명을 그 값에 맞췄다. W4 D4의 `폐구간`은 양 끝을 모두 포함하는 범위라고 풀어 썼다.
- W5 D2의 인덱스 범위 설명과 W5 D3의 progression 용어를 쉬운 한국어로 바꿨다. W5 D4의 무한 반복은 CPU를 계속 쓰며 **앱 메인 스레드에서 돌 때 화면을 멈출 수 있다**고 조건을 밝혔다.
- W6 D3의 overload 용어를 별도 함수를 만드는 상황으로 풀었다. W6 D4에서 같은 객체에 `effectPrompt`, `effectCorrect`, `effectWrong` 등의 중복 속성이 있어 뒤의 값이 앞의 내용을 덮던 결함을 제거했다. 질문·힌트·정답·오답 설명을 모두 `durationLabel(unit = "분", value = 25)` 예제에 맞췄다. W6 D5의 순수 함수·부수 효과 표현도 반환값과 콘솔 출력의 차이를 직접 설명하도록 고쳤다.
- 공식 Kotlin [조건 흐름](https://kotlinlang.org/docs/control-flow.html), [참·거짓 값과 논리 연산](https://kotlinlang.org/docs/booleans.html), [범위](https://kotlinlang.org/docs/ranges.html), [함수와 이름 있는 인자](https://kotlinlang.org/docs/functions.html), [`withIndex` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html) 및 최신 안정판 [릴리스 기록](https://kotlinlang.org/docs/releases.html)을 대조했다. Kotlin 2.4.21이 2026-10-24 확인 기준 최신 안정판이다.
- 선택지 문구·정답 연결이 달라진 다섯 문제는 v3 ID로 분리해 기존 풀이 기록과 구분했다. `node --test --test-reporter=spec tests/kotlin-curriculum-quality.test.js` 15/15 통과, 변경 파일 `node --check`와 `git diff --check` 통과. 이는 개념 추적과 정적 데이터 검증이며 Kotlin 컴파일·Android 실행 검증으로 세지 않는다.
- CQ 전체 완료율은 변경하지 않는다. 이번 범위는 W4–W6 추가 재검수이며 Kotlin 전 과정의 모든 문항을 새로 검수했다는 뜻이 아니다. 다음 순서는 Kotlin W7–W9다.

## 2026-10-24 Kotlin W7–W9 람다·컬렉션·Sequence 추가 재검수

- 람다, 고차 함수, `it`, 후행 람다와 바깥 변수 사용, List·Set·Map, `map`·`filter`, 읽기 전용 List와 MutableList, 목록 복사, `+` 연산, Sequence의 지연 처리와 성능 선택을 다루는 15일·45문항을 검수했다. 각 목표와 예제, 예제 출력, 질문, 정답·오답 근거, 힌트를 같은 흐름으로 확인했다. 문항 정답과 코드 추적 출력 오류는 찾지 못했다. 다만 9주차 제목이 `불변 컬렉션`이라고 되어 있어 실제 주제인 `읽기 전용 List`와 맞지 않는 용어 오류를 찾아 고쳤다.
- 학습을 방해하는 영문·전문 표현을 쉬운 한국어로 풀었다. Set은 중복 제거와 순서가 다른 규칙임을 구분했고, Map에서 키가 없으면 `null`일 수 있다고 풀어썼다. List는 읽기 기능만 제공하는 타입이지 실제 객체를 고정하는 복사가 아니라는 점과 다른 변수가 같은 목록을 바꾸는 상황을 설명했다. Sequence는 결과를 요청하는 시점과 항목별 처리, 작은 목록에서 항상 빠르지 않다는 조건을 실제 예시 문구에 맞췄다.
- 선택지의 정답·오답 문구가 달라진 22개 선택형 문항은 v3 ID로 분리해 이전 풀이 기록을 보존한다. 주관식 출력 값과 질문의 의미는 유지했다. 주차 생성기에 `ruleVersion` 지원을 더해 문제 ID를 선택지별로 나눴다.
- 실제 W7–W9 화면도 브라우저에서 열어 확인했다. 버전 정보와 중복되던 “공식 자료 확인 날짜” 제작 메모를 학습자 화면에서 제거했고, 9주차 제목·개요를 `읽기 전용 목록과 Sequence`에 맞게 수정했다. W8의 Map·map·filter 목표도 더 쉬운 말로 풀었다. 공식 참고 문서 목록은 기본 접힘 상태였다.
- Kotlin [람다·고차 함수](https://kotlinlang.org/docs/lambdas.html), [List·Set·Map](https://kotlinlang.org/docs/collections-overview.html), [컬렉션 연산](https://kotlinlang.org/docs/collection-operations.html), [Sequence](https://kotlinlang.org/docs/sequences.html) 공식 자료와 대조했다. 대상 회귀 15/15, 수정 파일 구문 검사, TypeScript AST로 중복 객체 속성 확인, `git diff --check`가 통과했다. 이 환경에는 `kotlinc`가 없어 Kotlin 예제를 컴파일·실행하지 않았다. 앱도 해당 언어의 실행·채점을 지원하지 않는다.
- 전체 CQ 완료율은 변경하지 않으며 공개 사이트에 배포하지 않았다. 다음 범위는 Kotlin W10–W12이고, 나머지 과정의 문항별 의미 검수는 계속 열려 있다.

## 2026-10-28 Kotlin W10–W12 null 처리·타입 확인·생성자 추가 재검수

- 15일의 예제와 45문항에서 nullable 값, 안전 호출·Elvis·강제 단언, 타입 확인과 변환 실패, 생성자·초기화 검증·getter·접근 범위·`lateinit` 흐름을 대조했다. 코드 결과와 등록 정답의 불일치를 찾지 못했다. 이 검토는 Kotlin 코드를 정적으로 추적한 것으로 컴파일러 실행은 아니다.
- CQ 전체 완료율을 바꾸지 않는다. 공개 사이트에는 배포하지 않았다. 다음 묶음은 Kotlin W13–W15다.

## 2026-10-28 Kotlin W13–W15 자료형·상속·객체 조립 추가 재검수

- 15일의 예제와 45문항에서 data class의 동등성·복사, enum·sealed/value class, 상속·재정의·interface, 객체 조립과 위임, 확장 함수의 호출 위치·멤버 우선 규칙, nullable·빈 문자열 구분, scope 함수의 반환값과 수신 객체를 대조했다. 예제의 출력·조건과 정답 설명이 일치했고 추가로 고칠 개념·정답 오류를 찾지 못했다.
- CQ 전체 완료율을 바꾸지 않는다. 공개 사이트에는 배포하지 않았다. 다음 묶음은 Kotlin W16–W18이다.

## 2026-10-28 Kotlin W16–W18 제네릭·Java 경계·오류 처리 재검수

- 15일의 예제와 45문항을 다시 대조했다. W16 D5는 `List<*>`가 아니라 실제 변경 가능한 `MutableList<*>`여야 “원소 자료형을 모르면 값을 안전하게 추가할 수 없다”는 설명이 맞았다. 선언은 수정했다. W17 D1·D2는 기존 Kotlin 코드가 Java 상호운용 경계라고 소개하면서 실제 Java 메서드를 제시하지 않아, `.java`와 `.kt` 파일을 함께 보여 주도록 바로잡았다. W18 자원 안내에는 `finally`에 더해 Kotlin의 `.use()` 사용도 제시했다.
- W16–W18에 남아 있던 “feature line”, “platform type”, “context parameter”, “star projection” 등 학습 흐름을 막는 미번역 표현을 쉬운 한국어로 고쳤다. W16 D2는 한글을 대문자로 바꾸어도 화면 결과가 달라지지 않는 예제를 영문 입력으로 교체했다. `Any`도 “null이 아닌 모든 Kotlin 자료형의 값이 들어갈 수 있는 가장 넓은 자료형”이라고 먼저 설명하도록 보완했다.
- Kotlin 공식 [제네릭](https://kotlinlang.org/docs/generics.html), [Java 상호운용](https://kotlinlang.org/docs/java-interop.html), [2.4 변경 사항](https://kotlinlang.org/docs/whatsnew24.html), [예외 처리](https://kotlinlang.org/docs/exceptions.html), [코루틴 취소](https://kotlinlang.org/docs/cancellation-and-timeouts.html) 자료와 대조했다. 버전은 Kotlin 공식 [릴리스 목록](https://kotlinlang.org/docs/releases.html)을 확인했다. W17의 문맥 값 선언·호출과 대괄호 목록 표기는 각각 정식/실험 중인 범위를 구분했다.
- `tests/kotlin-curriculum-quality.test.js` 15/15, 전체 `npm test` 428/428, `npm run check:release`의 150개 정적 파일 검사가 통과했다. W17 화면에서 Java/Kotlin 예제와 기본 접힘 상태인 공식 문서 목록도 확인했다. 이 앱은 Kotlin 컴파일·Android 실행을 지원하지 않으며, 이 검수는 그 실행 검증으로 표시하지 않는다.
- CQ 전체 완료율을 바꾸지 않고 사이트에도 배포하지 않았다. 다음 순서는 Kotlin W19–W21이며, 다른 주차와 제품 흐름도 계속 검수한다.

## 2026-10-28 Kotlin W19–W21 코루틴·취소·Flow 추가 재검수

- 15일의 개념, 예제, 출력, 선택지와 각 오답 설명을 대조했다. W19 D4는 `async` 실패가 `await()`에서만 처리되는 것처럼 보여 일반 `coroutineScope`의 자식 실패가 부모 작업도 취소할 수 있다는 조건을 추가했다. 실패를 분리할 때 `supervisorScope`를 검토한다는 설명도 덧붙였다.
- W21 D5는 화면 상태 예제에 `uiState`의 정의와 출력값이 없어 답을 예제만으로 확인할 수 없었다. `flowOf("불러오는 중", "완료")`를 넣고 화면이 STARTED 상태를 유지하는 조건을 질문에 밝혔으며, 수집이 다시 시작되면 차가운 Flow가 다시 값을 보낸다는 설명을 추가했다. 현재 상태 보관과 과거 값 재전달을 혼동하지 않도록 StateFlow와 구분했다.
- Kotlin 공식 [코루틴 기본](https://kotlinlang.org/docs/coroutines-basics.html), [예외 처리](https://kotlinlang.org/docs/exception-handling.html), [취소](https://kotlinlang.org/docs/cancellation-and-timeouts.html), [Flow](https://kotlinlang.org/docs/flow.html), [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/), [SharedFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/), Android [생명주기와 코루틴](https://developer.android.com/topic/libraries/architecture/coroutines)을 대조했다.
- Kotlin 품질·진도·기초 과정·코딩 문제 회귀 65/65가 통과했다. 수정한 예제는 이 사이트에서 실행하거나 Kotlin 컴파일러로 검증하지 않았으며, 정적 설명과 정답 흐름만 검수했다. 전체 CQ 완료율은 유지하고 공개 배포하지 않는다. 다음 묶음은 Kotlin W22–W24다.

## 2026-10-28 학습 진도 결과 보관 상한 재점검

- 현재 과정에는 5,265개 학습 문제가 있지만 `exerciseResults` 상한은 5,000개였다. 서로 다른 문제를 오래 풀면 앞서 완료한 문제의 최신 정답 요약이 저장 단계에서 잘려 주차 완료 판단이 사라질 수 있었다.
- 결과 요약 상한을 10,000개로 올리고, 현재 351주보다 작았던 완료 주차 ID 상한도 1,000개로 올렸다. 최신 500개 답변 본문 제한은 유지한다. 백업 왕복 회귀에서 5,265개 결과와 기존 정답·최근 오답을 모두 보존하고, 앞 주차는 완료·최근 오답이 있는 주차는 미완료로 판단하는 것을 확인했다.
- 이 수정은 기존 버전 필드에 이미 있는 요약 데이터를 더 넉넉한 범위에서 보존하며 새 저장 형식을 추가하지 않는다. 표적 진도·기초 과정·코딩 문제 검사 65/65 통과. 전체 테스트와 릴리스 검사는 이어서 실행하고 결과를 진척 기록에 갱신한다.

## 2026-10-28 AI 과정 화면 연결 및 Kotlin W22–W27 재검수

- 로컬 학습 목록에서 AI·LLM 과정을 열어 6개 구간·27주·135회·405문항이 표시되고, 첫 주 학습 화면과 세 문제 진입점이 연결되는 것을 확인했다. 공식 문서 목록은 기본 접힘 상태다. AI 과정은 이미 로컬에 추가되어 있으므로 중복 과정을 만들지 않았으며 공개 배포는 하지 않았다.
- Kotlin W22–W24와 W25–W27의 30일·90문항에서 예제 조건·질문·정답·오답 피드백을 대조했다. `setMain()`과 `resetMain()`의 실험 API 표시 및 필요한 `@OptIn` 안내를 함께 적고, Activity 수명과 저장 상태 설명에서 불필요한 영어 표현을 한국어로 바꿨다. Navigation 타입 안전 경로는 2.8.0 이상과 Serialization plugin·graph 설정이 필요한 점을 추가했다. 적응형 화면은 현재 앱 창 기준을 유지하면서 낮은 창 높이가 두 화면 배치에 미치는 조건도 설명했다.
- Kotlin 공식 [`kotlinx.coroutines-test`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/), Android Compose [부수 효과](https://developer.android.com/develop/ui/compose/side-effects), [저장 상태](https://developer.android.com/develop/ui/compose/state-saving), Navigation [타입 안전 경로](https://developer.android.com/guide/navigation/design/type-safety), [창 크기 분류](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes) 문서를 대조했다. Kotlin 실행 환경은 없으므로 코드 예제를 컴파일·렌더한 것으로 표시하지 않는다.
- AI·Kotlin 표적 검사 20/20, 전체 `npm test` 433/433, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`, 수정한 7개 파일의 공백 검사가 통과했다. 로컬 화면에서 AI 과정과 Kotlin W27 제목·Navigation 설정 메모를 확인했고 공식 출처 목록도 접혀 있었다.
- 이번 수정으로 전체 CQ 완료율은 올리지 않는다. 전체 콘텐츠 의미 감사는 계속 진행하며, 저장 실패 안내는 2026-10-24 격리 브라우저에서 재현·복구까지 확인했다. Windows 한글 IME 조합은 이번 시도에서 브라우저 조작이 중단되어 미검증으로 남고, 실제 초보 학습자 관찰도 미실시다. 공개 사이트에는 배포하지 않았다.

## 2026-10-28 Kotlin W28–W30 저장·접근성·Android 17 재검수

- 15일·45문항의 설명, 예제, 질문, 정답과 오답 근거를 공식 Android 문서와 대조했다. W29 D1은 접근성 안내에서 번역 가능한 문자열 리소스를 설명하면서 예제에는 `contentDescription = "저장"`을 직접 넣어 둔 불일치를 확인했다. 예제를 `stringResource(R.string.save_action)`으로 바꾸고 한국어·영어 문자열 리소스 예시를 추가했다.
- W29 D5는 Android 17(API 37)에서 직접 로컬 네트워크 연결에 `ACCESS_LOCAL_NETWORK`가 필요한 조건과 시스템 선택기를 이용하는 흐름이 구분되지 않았다. Google Cast Output Switcher와 `NsdManager`의 mDNS 선택 흐름, 직접 검색의 권한 처리를 따로 설명하고 Output Switcher가 모든 Cast 사용 흐름에 적용되는 것은 아니라고 제한했다. 바뀐 질문·답을 가진 세 연습 ID만 v3로 올려 기존 답안 기록의 의미를 보존했다.
- Android 공식 [데이터 계층](https://developer.android.com/topic/architecture/data-layer), [Room](https://developer.android.com/training/data-storage/room), [DataStore](https://developer.android.com/topic/libraries/architecture/datastore), [Compose 접근성 기본값](https://developer.android.com/develop/ui/compose/accessibility/api-defaults), [Compose 접근성](https://developer.android.com/develop/ui/compose/accessibility), [Android 17 로컬 네트워크 권한](https://developer.android.com/privacy-and-security/local-network-permission), [보안 권장사항](https://developer.android.com/privacy-and-security/security-tips)과 대조했다. Compose/Kotlin 예제는 정적으로 추적했으며 Android 컴파일·기기 실행을 확인한 것은 아니다.
- 수정한 Kotlin 주차 검사 15/15, 전체 `npm test` 433/433, `npm run check:release` 152개 파일(최대 9.621 MiB), JavaScript 구문 검사와 `git diff --check`가 통과했다. CQ 전체 완료율은 변경하지 않고 공개 배포하지 않았다.

## 2026-10-28 Kotlin W31 종합 설계 한국어·검증 경계 재검수

- 요구사항·화면 상태·UI/ViewModel/Repository/Room 흐름·검사 단계·출시 보고를 연결한 5일·15문항을 다시 읽었다. 예제와 문항의 시작 조건·요구사항·검사 보고가 영어로만 적힌 부분을 찾아 학습자가 바로 이해할 수 있는 한국어로 바꿨다. `ViewModel`, `Room`, `Flow`, `Empty`처럼 코드에서 그대로 사용하는 이름은 유지하고 설명에서 뜻을 풀었다.
- Room 영구 저장은 앱을 종료·재실행한 뒤 다시 읽는 흐름에서 확인하고, Compose 접근성 정보는 화면 검사, 권한은 Android 기기/API 검사로 확인하도록 구분했다. 정적 문항 검토가 APK 빌드·Room 기기 테스트·출시 검증을 대신하지 않는다는 한계도 남겼다.
- Android [아키텍처 권장사항](https://developer.android.com/topic/architecture/recommendations), [오프라인 우선 설계](https://developer.android.com/topic/architecture/data-layer/offline-first), [Compose 화면 검사](https://developer.android.com/develop/ui/compose/testing), [Room 데이터베이스 검사](https://developer.android.com/training/data-storage/room/testing-db)와 대조했다. 한국어 예시의 혼합 영어 표현이 다시 들어오지 않도록 회귀 조건을 추가했다.
- Kotlin 표적 검사 15/15, 전체 `npm test` 433/433, `npm run check:release` 152개 파일(최대 9.621 MiB), `git diff --check` 통과. Android 빌드·에뮬레이터·기기 실행은 하지 않았고 CQ 완료율은 그대로 두며 공개 배포하지 않았다.
- 격리된 로컬 브라우저 탭에서 `#/lesson/kotlin-week-31`의 한국어 예제와 다섯 일차, `#/track/ai`의 AI 과정 제목·6개 구간·27주·선수 지식 없음을 확인했다. AI 과정은 이미 로컬에 존재해 중복 생성하지 않았다.

## 2026-10-28 AI W19–W21 실제 적용 연습 추가

- 범위: W19–W21, 15일·45문항의 목표·예제·질문·정답·피드백과 학습 순서 안내.
- 문항의 사례와 정답은 목표에 맞았지만 학습 순서의 세 번째 활동은 15일 모두 동일한 “실제 AI 도구 사용은 선택” 문구였다. 사용자가 따라 해 볼 입력·작업·검증 기준이 구체적으로 제시되지 않는다는 결함을 확인했다.
- 각 날짜에 맞게 가상 회의 메모 요약, 제한된 사실로 초안 작성, 근거 포함 정보 추출, JSON 구조 검사, 읽기 전용 도구 요청 설계, 권한·승인 검토, 실패 상태 안내, 문서 분할·후보 검색·근거 대조·최신성 판별·실패 단계 분류를 15개의 선택 실습으로 구성했다. 각 실습에 바로 써 볼 가상 입력과 결과 확인 기준이 있으며, AI 도구가 있으면 선택해 사용하고 도구 없이 직접 풀어도 된다. 개인정보·기밀을 요구하지 않으며 사이트에서 AI 서비스로 정보를 보내지 않는다.
- 수정 전 회귀 검사에서 15개 학습일의 적용 활동이 동일해 실패했고, 보완 뒤 W19–W21의 고유 실습·주제 핵심어 검사 6/6이 통과했다. `npm test` 434/434, `npm run build`, `npm run check:release` 152개 파일·최대 9.621 MiB, `git diff --check`가 통과했다. 로컬 브라우저에서 AI 트랙과 W19 학습 화면 진입을 확인했으며 실습 상세는 접힌 학습 순서 안에 제공된다.
- 판정: 이 3주 범위의 선택 실습이 실제 활용 연습으로 구체화됐다. 외부 모델 도구를 사이트에서 실행하거나 모델 품질을 측정한 것은 아니다. 전체 CQ는 열어 두며 완료율을 올리지 않고 공개 배포하지 않았다.

## 2026-10-28 Spring Boot W1–W3 설정·의존성 문항 재검수

- 첫 3주 15일·45문항과 15개 일일 예제의 질문, 정답, 오답 피드백, 단답 답안과 오류 줄을 다시 대조했다. 생성자 주입·서비스 경계·요청 DTO·Bean 기본 범위와 외부 설정 흐름을 기준으로 확인했다.
- W3 D1 단답은 `${DB_PASSWORD}`의 이름을 묻는데 URL의 `SPRING_DATASOURCE_URL`을 설명했다. 질문에 맞춰 placeholder 이름과 실제 값의 공급 경로를 설명하고 URL 덮어쓰기 변수와 구분했다. W3 D2의 `spring.config.activate.on-profile=prod`는 프로파일 자체를 켜는 설정이 아니라 prod가 이미 활성화됐을 때 해당 문서가 적용되는 조건임을 질문과 해설에 명시했다.
- W1 D5는 해설에서 `fake`도 정답이라고 설명하지만 채점 답안에 빠져 있어 `fake`, `가짜 객체`를 허용했다. W3 D5는 예제의 `course.max-size=20`과 질문의 `-1` 상황 사이 변경 조건을 질문에 명시했다.
- Spring Boot 공식 [외부 설정 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)의 placeholder 공급원, 환경 변수 이름 변환과 문서 활성 조건을 대조했다. Spring 회귀 22/22, 전체 `npm test` 437/437, 빌드·릴리스 검사 152개 파일(최대 9.621 MiB), 변경 파일 구문 검사와 `git diff --check`를 통과했다.
- 이번 기록은 Spring Boot W1–W3 표적 재검수다. 나머지 주차의 전체 문항 의미 검수를 완료한 것으로 보지 않으며 전체 CQ 완료율은 유지한다. 공개 사이트에는 배포하지 않았다.

## 2026-10-29 Spring Boot W7–W9 트랜잭션·보안·MVC 테스트 재검수

- W7–W9 15일의 학습 목표, 예제, 질문, 정답과 피드백을 같은 사례 흐름으로 대조했다. 외부 메일 전송과 DB 저장, 프록시를 통과하는 Bean 호출과 같은 객체 내부 호출, 읽기 전용 조회와 데이터 수정, MVC 슬라이스 테스트의 협력자 등록을 확인했다.
- W7 D2 예제는 DB 트랜잭션이 외부 메일을 되돌릴 수 있는 것처럼 보일 여지가 있었다. 저장 서비스에서 이벤트를 발행하고 `@TransactionalEventListener(phase = AFTER_COMMIT)`에서 메일을 보내도록 예제·질문을 맞췄다. W7 D4 질문에는 표시된 다른 Bean 호출과 `this.reserveCapacity()` 자기 호출의 차이를 명시했다. W7 D5는 `readOnly = true`가 변경을 보안상 차단하는 기능이 아니라 최적화 의도임을 설명하고 읽기 메서드와 제목 변경 메서드를 구분했다. W9 D3 MVC 슬라이스 예제에는 `@WebMvcTest`, `MockMvc`, `@MockitoBean CourseService`를 함께 보여 주도록 했다.
- 최신 공식 요구 사항도 다시 확인했다. Spring Boot 4.1.2가 안정판이며 Java 17–27 및 Spring Framework 7.0.10 이상을 지원한다. 호환 Security 기준은 7.1.2다. 과정의 버전 설명과 관련 주석을 갱신하고, `readOnly` 의미 및 Boot 보안 자동 설정 공식 문서를 출처 목록에 연결했다. 근거: [Spring Boot 시스템 요구 사항](https://docs.spring.io/spring-boot/system-requirements.html), [Boot 4.1.2 릴리스](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.2), Framework [트랜잭션 프록시](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)·[커밋 뒤 이벤트](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html)·[`readOnly` API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/TransactionDefinition.html), Boot [보안 자동 설정](https://docs.spring.io/spring-boot/reference/web/spring-security.html), Security [7.1.2 릴리스](https://github.com/spring-projects/spring-security/releases/tag/7.1.2), Boot [테스트 슬라이스](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html) 및 Framework [`@MockitoBean`](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/bean-overriding.html).
- Spring 표적 검사 24/24, 전체 `npm test` 439/439, `npm run check:release` 빌드 및 정적 자산 152개(최대 9.621 MiB) 검사를 통과했다. 전체 검사에서 과거 검수일과 영문 표현을 기대하던 테스트 두 곳을 찾아 현재 값·한국어 설명을 확인하도록 고친 뒤 재실행해 통과했다. `git diff --check`와 변경된 JavaScript·테스트 파일 4개의 `node --check`도 통과했다. 기존 파일의 LF→CRLF 알림만 있었다.
- 예제는 학습용 개념 코드로 Spring 프로젝트에서 컴파일·실행한 결과가 아니다. 브라우저 화면 확인은 이번 묶음에서 완료하지 못했다. 이 결과는 W7–W9 표적 검수이며 CQ 전체 완료율은 바꾸지 않고 공개 배포하지 않는다.

## 2026-10-29 Java 단답 출력 형식·용어 답안 재검수

- Java W13–W24에서 출력 줄을 그대로 쓰라고 한 단답형 문항의 질문, 예제 출력과 허용 답을 대조했다. 출력 앞에 “출력은”을 붙인 답, 공백·기호가 달라진 답, 일부 필드만 적은 요약이 통과하는 경우를 찾아 코드에 표시된 출력 한 줄만 정답으로 받도록 고쳤다. 해당 범위의 단답 회귀에서 바뀐 공백과 빠진 필드가 오답으로 처리되는 것을 확인했다.
- W25 D1의 `requirements`는 요구사항 분해를 특정하지 못했고, D2의 “보편 언어”는 도메인 참여자가 함께 쓰는 용어를 설명하기에 모호했다. D5의 입력·기대 결과 문항은 일반 `사례`나 `scenario`만 적어도 통과했다. 답 기준을 구체화하고 바뀐 문항은 `-v2` ID로 분리해 이전 기록과 섞이지 않게 했다.
- 검사 과정에서 W5 D3의 구체적 `course.getMinutes()` 답과 새 질문 문구를 기대값에 반영하지 않은 기존 검사가 발견됐다. 기존 검사 기대값을 현재 문항과 맞춘 뒤 Java·공통 콘텐츠 표적 검사 64/64, 전체 `npm test` 454/454, `npm run check:release` 빌드·정적 파일 152개(최대 9.621 MiB), `git diff --check`가 통과했다. JavaScript 구문 검사도 통과했다. 줄바꿈 형식 알림만 남았다.
- 이 기록은 Java 단답 답안과 표시 출력의 채점 범위에 대한 재검수다. Java 예제 전체를 `javac`로 컴파일·실행하지 않았고 다른 과정의 전체 의미 검수를 완료한 것으로 보지 않는다. CQ 완료율은 바꾸지 않고 공개 배포하지 않았다.

## 2026-10-29 결과형 단답 채점과 저장 진도 연결 재검수

- 저장 기록 검토 중 문제 ID를 버전 변경하면 기존 답안·결과·최근 위치·작성 중 초안이 현재 문항에서 고립될 수 있음을 확인했다. 콘텐츠 카탈로그에 이전 ID 별칭을 만들고 복구 때 답안, 결과, 위치, 초안 ID를 현재 ID로 옮긴다. 현재 문항 초안이 이전 문항 초안보다 우선한다.
- C#·.NET의 결과 추적 175개는 대소문자를 구분하면서 사용자가 띄어쓰기를 달리 입력하는 것은 허용하도록 바꿨다. 대체 답은 명시된 경우 그대로 인정한다. TypeScript의 130개 결과 추적은 130개 예제를 실제 변환·실행한 출력과 바깥 공백을 제외한 전체 문자열이 일치함을 확인하고, 정답 채점에도 같은 출력값을 사용하도록 검사했다.
- Kotlin W1–W27의 135개 출력 결과 문제와 C# 175개, TypeScript 130개의 이전 ID 연결을 검증했다. Kotlin/C#/TypeScript 모두 새 문항으로 저장 답안·진도·초안이 이동한다. Kotlin W28–W31의 설명형 문항은 이번 엄격 채점 범위에 포함하지 않았다.
- 저장 진도·콘텐츠·채점 표적 검사 105/105, 전체 npm test 462/462, npm run check:release 152개 파일·최대 9.621 MiB, git diff --check, 변경 JS 구문 검사가 통과했다. 전체 CQ 완료율은 변경하지 않았고 공개 배포하지 않았다. JavaScript·Python 및 나머지 트랙의 출력·답 허용 범위는 계속 검수한다.
- AI·LLM 과정은 이미 목록에 연결돼 있어 6개 구간·27주·135회·405문항 화면과 1주차 진입을 재확인했다. 중복 과정을 만들지 않았다.

- 저장 기록 보정: 이전 ID의 답안 원문은 남기되 현재 채점 규칙으로 다시 판정한다. 결과 요약만 남아 원문 답을 확인할 수 없는 문제는 현재 완료로 간주하지 않고 다시 확인하도록 한다. 과거 완료 목록은 기록에서 보존한다.

- 재채점 보정까지 포함한 최신 표적 검사 121/121, 전체 npm test 462/462, npm run check:release 152개 파일·최대 9.621 MiB가 통과했다. AI·LLM 과정 검사도 전체 묶음에 포함되어 통과했다.

## 2026-10-29 AI 과정 요청 재확인 및 JavaScript 출력 답안 재검수

- AI·LLM 과정은 새로 만들 필요가 없도록 로컬 학습 목록에 이미 연결되어 있었다. 27주·135회·405문항, 6개 단계에 AI 기초·확률/통계·머신러닝·신경망·Transformer/LLM·프롬프트·도구 호출·RAG·멀티모달·평가·안전·적용 설계가 포함되어 있다. 실제 AI 사용은 선택 실습이며 사이트가 프롬프트나 사용자 자료를 외부 서비스로 보내지 않는다. 기존 AI 전용 검사는 전체 커리큘럼과 실습·답안 기준을 확인했다.
- JavaScript 출력 추적형 주관식 88개는 이전의 일반 답안 정규화가 대소문자나 내부 공백이 다른 결과를 맞다고 처리할 수 있었다. 출력 문자열은 바깥 공백과 Windows 줄바꿈만 정리하고 나머지는 그대로 비교하도록 맞췄다. 문항 ID를 버전 처리하고 이전 ID를 별칭으로 등록해 기존 저장 기록을 현재 문제로 찾을 수 있게 했다.
- 회귀 검사에서 각 허용 답의 채점과 모든 구 ID 별칭 연결을 확인했다. 기존 JavaScript 주차 검사는 추적 문제의 코드를 실제 실행해 출력과 답을 대조한다. JavaScript·AI 표적 검사 87/87, 전체 `npm test` 463/463, `npm run check:release` 152개 정적 파일·최대 9.621 MiB 통과.
- 판정: AI 과정은 요청 범위를 이미 충족해 중복 추가하지 않았고, JavaScript 출력형 채점 결함은 수정했다. 이는 표적 재검수이며 전체 CQ 완료나 공개 배포를 뜻하지 않는다.

## 2026-10-29 Python 출력형 답안·진도 재검수

- Python 26주 과정의 코드 추적형 주관식 129개를 확인했다. 기본 채점은 대소문자를 무시하고 내부 공백을 하나로 합쳐 Python 출력 `False`와 `false`를 같은 답으로 처리했다. 실제 코드에서 나온 출력 문자열은 대소문자·내부 공백·줄 구분을 보존해 비교하도록 맞췄다. 두 줄 결과의 답안 검사도 실제 출력 줄바꿈과 같도록 고쳤다.
- 빈 컬렉션 예제에서 오답인 소문자 `false`를 허용 목록에서 제거했다. 출력 및 Python 문법상 대소문자가 중요한 `None`, `ValueError`, `file.read()`, `next(items)`, `async` 답도 기준을 좁혔다. 변경된 문제는 ID를 버전 처리하고 구 ID를 별칭으로 등록해 저장 답·결과·최근 문제·초안을 연결한다. 저장되어 있던 소문자 오답 `false`는 새 규칙으로 재채점되어 현재 오답이 되고, 올바른 `False` 답은 완료로 유지된다.
- JavaScript·Python에서 공통으로 쓰는 ID 버전 주관식 생성 도구를 분리해 출력 추적과 단답형 코드 토큰에 사용했다. Python·진도 표적 검사 98/98이 통과했다. 범위에는 Python 3.12.10으로 확인한 기존 회귀 검사와 W13–W15 예제 실행 검사가 포함되며, 모든 Python 예제를 새로 전체 실행했다는 뜻은 아니다.
- 전체 `npm test` 465/465, `npm run check:release` 152개 파일·최대 9.621 MiB가 통과했다. 판정: 답안 채점 및 이전 기록 연결 결함은 해결했다. 전체 CQ는 진행 중이며 공개 배포하지 않았다.

## 2026-10-29 Java 코드·출력 답안 및 저장 진도 재검수

- Java 주차별 답안을 다시 확인해 실제 결과, Java 리터럴, 메서드/API 이름의 대소문자를 무시하던 단답 47개를 대소문자 보존 방식으로 바꿨다. 예를 들어 `false`, `null`, `GET`, `IOException`, `AtomicInteger`는 표기된 Java 값·이름과 같은 경우에만 통과한다. 한국어 개념 설명이나 숫자 답은 불필요하게 엄격하게 바꾸지 않았다.
- 바뀐 문제 ID는 이전 버전 ID도 찾아오도록 별칭 처리했다. 이전 저장 답안은 현재 답안 규칙으로 재채점하고, 기존 답안 기록·현재 문제 위치·초안은 새 ID에 연결되도록 검사를 추가했다.
- Java·콘텐츠 표적 검사 82/82, 전체 `npm test` 467/467, `npm run check:release`의 정적 파일 검사 152개·최대 9.621 MiB 통과. 변경 JS 구문 검사와 `git diff --check`도 통과했다. 전체 콘텐츠 감사를 끝낸 것으로 보지 않으며 공개 배포하지 않았다.

## 2026-10-29 결과 답안 채점·AI 화면 추가 재검수

- 확인 범위: PostgreSQL 37개, React 19개, Kotlin Android 4개 결과형 주관식과 JavaScript 추가 4개 출력 답안, Next.js 37개 코드·API 식별자 답, Spring 34개 코드·API 식별자 답. 올바른 코드 결과의 대소문자와 출력 공백이 바뀌어도 통과하던 규칙을 좁히고, 문제 ID 별칭을 통해 저장 답안·기록·초안·최근 위치를 현재 질문으로 연결한다. Next.js의 특정 prop 및 Playwright locator 답 허용 문제도 수정했다.
- FastAPI는 이미 Python 식 표현에서 대소문자를 보존하므로 바꾸지 않았다. AI 용어 단답은 소프트맥스 등 실제로 통용되는 한글·영문 표기를 유지했다. 변경된 학습 결과를 과거 ID만으로 완료 처리하지 않고 현재 답 기준으로 재평가하도록 회귀 검사를 추가했다.
- AI 과정은 중복 생성하지 않았다. 이미 연결된 27주·135회·405문항에서 개념부터 Transformer·LLM·실무 활용·평가·안전까지의 흐름을 확인했다. Google LLM·신경망 자료, Hugging Face LLM 과정, Transformer 원문, OpenAI 프롬프트·도구 호출·검색·최적화·평가 안내, Gemini 이미지·음성 안내, NIST 생성형 AI 위험 프로필, OWASP LLM 위험 항목을 참고한다. 실제 AI 서비스 연동은 없고 실습은 선택이다.
- 화면 확인에서 불필요한 “제품·API 비종속” 표기와 날짜별 제목을 반복하는 목표·소개 문장을 찾았다. 해당 AI 화면에서만 이 반복 메타를 숨기고, 날짜 제목·예제·선택 실습·세 문제, 접힌 공식 문서와 데이터 처리 안내는 유지했다. 실제 문제를 제출하지 않아 브라우저 저장 기록은 변경하지 않았다.
- AI·Kotlin·콘텐츠·진도 회귀 검사는 전체 `npm test` 480/480에 포함되어 통과했다. `npm run check:release`의 152개 정적 파일·최대 9.621 MiB 검사, 변경 파일 구문 검사와 `git diff --check`도 통과했다.
- 한계와 다음 확인: 저장·백업은 자동 회귀 검증으로 확인했지만 이번 브라우저 작업에서 실제 답 제출과 백업 복원을 실행하지 않았다. Windows 한글 IME, 좁은 화면, 전체 과정 이동의 수동 확인이 남아 있다. 나머지 콘텐츠의 전수 의미 검수를 끝냈다고 보지 않으며 CQ 완료율을 올리지 않고 공개 배포하지 않는다.

## 2026-10-29 코드 실행 첫 준비 지연 및 진도 오기록 방지

- 새 격리 출처의 첫 코드 실행에서 화면과 Worker가 준비되는 시간이 1.8초 실행 제한에 포함돼, 사용자 코드가 시작되기 전에 시간 초과로 표시되는 문제를 재현했다.
- 실행 제한은 Worker 준비 완료 신호를 받은 뒤부터 시작하도록 바꾸고, 격리 실행 공간 준비에는 별도 5초 제한을 둔다.
- 실행 화면·Worker를 열지 못하면 작성한 코드를 초안으로 즉시 저장하고 진도·오답 답안은 추가하지 않는다. 사용자 코드의 구문 오류와 실행 제한 초과는 계속 결과로 표시한다.
- 검증: 실행기 검사 13/13, 전체 `npm test` 480/480, `npm run check:release` 통과(152개 파일·최대 9.621 MiB). 새 Chrome 출처의 첫 실행은 6/6 통과했고, 무한 반복은 제한 시간에 종료된 뒤 같은 화면에서 정상 코드 재실행 6/6을 확인했다. 공개 배포는 하지 않았다.

## 2026-10-29 C#·.NET 첫 3주차 규칙 힌트 재검수

- C#·.NET W1–W3의 규칙 문제 15개를 각 날짜의 결과 추적과 함께 대조했다. 기존에는 규칙 문제에도 출력 추적용 힌트가 연결되어 질문과 관계없는 변수를 확인하라고 안내하는 경우가 있었다. 문제별 규칙 힌트를 추가해 언어·플랫폼, 대상 프레임워크, 진입점, SDK 도구, 정적 검토와 실행 증거, 타입 추론, 갱신·비교, 상수, 값·참조 복사, 오버플로, 형 변환, UTF-16, 보간, decimal 주제를 각각 안내한다.
- 정답과 예제의 결과가 서로 맞지 않는 추가 결함은 이번 범위에서 확인하지 않았다. .NET 10 Roslyn 기반 C# 예제 구문 검사와 C# 전 주차 콘텐츠 검사 20개를 포함한 표적 검사 21/21, 전체 `npm test` 481/481, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 파일 두 개의 구문 검사와 `git diff --check`가 통과했다.
- 근거는 Microsoft Learn의 [C#·.NET 문자열 보간](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/strings/interpolation), [암시적 지역 변수](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/implicitly-typed-local-variables), [checked/unchecked](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/checked-and-unchecked), [문자열·UTF-16](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/strings/), [컴파일러 언어 기능 옵션](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-options/language), [최상위 문](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/top-level-statements), [파일 기반 앱](https://learn.microsoft.com/en-us/dotnet/core/sdk/file-based-apps) 및 [대상 프레임워크](https://learn.microsoft.com/en-us/dotnet/standard/frameworks)다.
- 이 결과는 첫 3주차 표적 재검수이며 C# 전체 또는 전체 사이트 내용의 완전성을 뜻하지 않는다. 전체 CQ를 닫지 않았고 공개 배포하지 않았다.

## 2026-10-29 Spring Boot W10–W12 신뢰성·관측·API 흐름 재검수

- W10–W12의 15일 동안 목표·설명·예제·45개 연습의 질문·정답·오답 설명을 대조했다. 요청 시간 제한, 제한된 재시도와 멱등 키, locale별 캐시 키와 무효화, 구조화 로그, 현재 trace 문맥, 메트릭 태그 cardinality, 자동 구성 `RestClient.Builder`, 로그에서 인증 비밀 제외, 201 생성 계약, 공개 오류 응답, 인증과 인가를 검토했다.
- W12 D5 예제는 추적 ID를 `ApiError`의 두 번째 인자로 전달했다. 같은 통합 과정의 W12 D3은 두 번째 필드에 사용자 안내 문구를 넣으므로 이 코드는 오류 메시지에 trace ID를 넣어 안내를 잃는 모순이 있었다. 수정 전 실패하는 회귀를 추가한 뒤 `ApiError(code, message, traceId)` 형태를 명시하고 안전한 안내와 trace ID를 별도 필드로 전달하도록 예제·세 문항의 코드 조각을 고쳤다. 기존 문항의 정답 의미는 유지해 저장된 답 기록 ID는 바꾸지 않았다.
- 확인 근거: Spring Framework [캐시 키·`@Cacheable`·`@CacheEvict`](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html), Spring Boot [관측·HTTP client 계측](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)·[구조화 로그](https://docs.spring.io/spring-boot/reference/features/logging.html), Spring Security [요청 인가](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html), [Micrometer Tracing API](https://docs.micrometer.io/tracing/reference/api.html), HTTP [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).
- Spring 과정 표적 검사 32/32, 전체 `npm test` 487/487, `npm run check:release`의 152개 파일·최대 9.621 MiB, `node --check` 두 파일, `git diff --check`가 통과했다. Git 줄바꿈 변환 안내만 있었다. 교육 예제는 정적 개념 스니펫이므로 Spring 앱 컴파일·기동·통합 실행은 확인하지 않았다. 내부 브라우저 화면 열기는 대기 상태를 반환했고 이 세션에는 브라우저 조작·캡처 수단이 없어 시각 확인을 주장하지 않는다. CQ 전체를 열어 두고 공개 배포하지 않았다.

## 2026-10-29 Spring Boot W13–W15 설정·페이지 조회·N+1 재검수

- W13–W15 15일·45문항의 목표, 예제, 질문, 정답·오답 피드백과 오류 줄을 다시 대조했다. 설정 타입 등록과 `@Validated` 검증 전제, 환경 변수 이름, 숫자형 `Duration` 단위, 0부터 시작하는 페이지 번호·기본 크기 20, 허용되지 않은 정렬 이름, 실제 적용되는 페이지 상한, 페이지 메타데이터, OSIV를 끈 뒤 직렬화하는 시점, 여러 목록 fetch join의 곱집합, 반복 count 조회, DTO projection, Hibernate 통계의 측정 범위를 확인했다.
- W13 D4는 예제 값 `change-me`가 자리표시자라고 안내하면서 문항은 실제 운영 비밀값이 이미 저장소 이력에 남았다고 서술해 모순됐다. 실제 값이 아니라 자리표시자라는 점을 질문·힌트·해설에 밝히고, `SPRING_DATASOURCE_PASSWORD` 또는 비밀 설정으로 운영 값을 주입하도록 바로잡았다. 정답 의미와 기존 ID는 유지했다. 수정 전 새 회귀가 실패하고 수정 후 통과하는 것을 확인했다.
- 공식 근거: Spring Boot [외부 설정·환경 변수·검증·Duration](https://docs.spring.io/spring-boot/reference/features/external-config.html), Spring Data Commons [웹 Pageable 기본값·정렬 입력](https://docs.spring.io/spring-data/commons/reference/repositories/core-extensions.html), Spring Data JPA [projection](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html), Hibernate ORM [fetch join·여러 컬렉션 조회](https://docs.hibernate.org/orm/7.4/querylanguage/html_single/), [Statistics API](https://docs.hibernate.org/orm/7.4/javadocs/org/hibernate/stat/Statistics.html).
- Spring 표적 검사 33/33, 전체 `npm test` 488/488, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 파일 구문 검사와 `git diff --check`가 통과했다. Spring 앱은 이 저장소에 없어 예제를 컴파일·기동하지 않았다. 내부 브라우저 열기 요청은 대기 상태를 반환해 이 묶음의 시각 검수는 완료로 기록하지 않는다. 전체 CQ는 계속 열어 두고 공개 배포하지 않았다.

## 2026-10-29 Spring Boot W16–W18 메시지 전달·테스트 격리 재검수

- W16–W18의 15일·45문항에서 트랜잭션 종료 뒤 이벤트 처리, 아웃박스와 중복 메시지, 불변 이벤트 데이터, 전송 실패 기록, 테스트 슬라이스와 테스트 DB 격리, Testcontainers 수명, 마이그레이션 적용, 병렬 테스트 데이터 구분을 예제·질문·정답·오답 설명에 맞춰 확인했다. 내용상 잘못된 답은 찾지 못했다.
- W16 D3의 중복 이벤트 처리는 이벤트 식별값의 DB 고유 제약과 영수증·업무 변경을 한 트랜잭션에 묶는 예제를 확인했다. W17의 JPA 재조회 전 flush/clear, 테스트 프로파일의 격리 데이터베이스, W18의 Spring 관리 컨테이너 및 운영과 같은 Flyway 적용도 함께 대조했다.
- 사용자 문장에 남아 있던 `transaction`, `rollback`, `broker`, `receipt`, `prod profile`, `primary key` 등의 불필요한 영어 혼용을 자연스러운 한국어로 고쳤다. 설명 코드 주석 3곳도 한국어로 바꾸고, 이후 영어 주석이 재발하지 않도록 예제·문제 코드까지 확인하는 회귀 검사를 추가했다. 정답 기준과 문항 ID는 유지했다.
- 공식 근거: Spring Framework [트랜잭션 이벤트](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html)·[테스트 빈 대체](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/bean-overriding.html), Spring Boot [Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html), Testcontainers [JUnit 5 지원](https://java.testcontainers.org/test_framework_integration/junit_5/).
- Spring 표적 검사 34/34, 전체 `npm test` 489/489, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 JS·검사 파일 구문 검사와 `git diff --check`가 통과했다. `git diff --check`에는 기존 LF→CRLF 변환 안내만 있었다. Spring 앱은 이 저장소에 없어 예제를 컴파일·기동하지 않았다. 내부 브라우저 열기는 다시 대기 상태를 반환했다. 화면을 조작해 확인하지 않았고 Computer Use도 사용하지 않았다. CQ는 열어 두며 공개 배포하지 않았다.

## 2026-10-29 Spring Boot W19–W21 보안·비동기 흐름 재검수

- W19–W21의 15일·45문항에서 JWT 서명·발급자·대상 API 검증, scope 권한 변환, 인증과 인가 상태, CORS 출처 허용·자격 증명·CSRF, `@Async` 프록시·대기열·예외·보안 문맥·취소를 예제·문제·정답·오답 설명과 대조했다. 기술 내용에서 잘못된 정답은 찾지 못했다.
- 학습자가 읽는 오류 코드에 남아 있던 영어 주석 두 곳을 한국어로 바꿨다. CORS·CSRF와 실행기 문제의 불필요한 영어 혼용도 줄였고, W19–W21의 개념 이름을 한국어 설명과 실제 API 이름으로 구분했다. 문항 ID와 정답 기준은 유지했으며, 주석과 주차 요약 문구가 다시 어긋나지 않도록 회귀 검사를 추가했다.
- 첫 화면의 W13–W26 목표 문장에는 `을(를)` 조사 오류가 있었고, 같은 세 안내 항목이 14주 동안 반복됐다. 목표와 소개를 주차별 학습 내용에 맞게 다시 쓰고 반복 목록을 제거했다.
- 공식 근거: Spring Security [JWT 검증·issuer·audience·scope](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html), Spring Boot [OAuth2 리소스 서버 설정](https://docs.spring.io/spring-boot/reference/security/oauth2.html), Spring Framework [비동기 실행·예외·대기열](https://docs.spring.io/spring-framework/reference/integration/scheduling.html), Spring Security [보안 문맥 전파](https://docs.spring.io/spring-security/reference/servlet/integrations/concurrency.html)·[CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)·[CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).
- Spring 표적 검사 36/36, 전체 `npm test` 491/491, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 JS·검사 파일 구문 검사와 `git diff --check`가 통과했다. Git 줄바꿈 변환 안내만 있었다. 예제는 정적 코드 스니펫으로 Spring 앱 실행은 하지 않았다. 내부 브라우저 열기는 대기 상태이고 시각 검수는 미완료다. CQ는 계속 열어 두고 공개 배포하지 않는다.

## 2026-10-29 Spring Boot W22–W24 배포·운영 흐름 재검수

- W22–W24의 15일·45문항에서 Actuator liveness/readiness와 Kubernetes probe, 메트릭 cardinality, 관리 endpoint 노출, Docker 신호 처리·환경별 설정·포트·비밀 주입·digest, rolling 배포·DB schema 호환·설정 검증·관측 기준을 예제·선택지·정답·오답 피드백에 대조했다.
- W23 D3의 오류 찾기 문항은 Dockerfile의 유효한 `EXPOSE` 줄만 두고 포트 공개를 잘못 안내한 줄을 찾게 해 정답 줄이 없었다. `EXPOSE`만으로 실행 컴퓨터의 포트가 열린다는 잘못된 주석을 사례에 추가해 질문·정답·해설을 일치시켰다.
- W23 D1 예제는 `CMD`로 `--spring.profiles.active=default`를 고정해, D2의 배포 환경 변수 주입을 덮을 수 있었다. Spring Boot에서 명령행 속성이 환경 변수보다 우선하는 기준과 Docker의 CMD/ENTRYPOINT 동작을 확인해 기본 인자를 없앴다. D2의 예제를 각 Kubernetes Deployment에서 프로파일 값을 설정하는 형태로 바꿨다. BuildKit 비밀 파일은 Gradle이 자동으로 읽지 않으므로 Gradle 저장소 인증 설정의 파일 읽기 전제와 secret 누락 시 빌드 실패를 명시했다.
- W24 D2는 컬럼 추가 뒤 구버전 종료·호환 버전의 양쪽 쓰기·기존 행 backfill·누락 확인·롤백 기간 종료·구 컬럼 제거 순서를 구체화했다. backfill 쿼리는 이전 컬럼을 기준으로 기존 값 전체를 옮기도록 했다. W24 D4에는 설정 검색 등록과 양수 `Duration` 예시를 넣고, 직접 생성자 검증과 별도 Bean Validation 의존 조건을 구분했다.
- 공식 근거: Spring Boot [Kubernetes probes와 Actuator](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)·[명령행·환경 변수 우선순위와 설정 검증](https://docs.spring.io/spring-boot/reference/features/external-config.html), Spring Boot [메트릭](https://docs.spring.io/spring-boot/reference/actuator/metrics.html), Docker [Dockerfile 명령·신호·EXPOSE·secret mount](https://docs.docker.com/reference/dockerfile)·[빌드 비밀 전달](https://docs.docker.com/build/building/secrets/)·[digest 고정](https://docs.docker.com/build/building/best-practices/), Kubernetes [probe 동작](https://kubernetes.io/docs/concepts/workloads/pods/probes/)·[RollingUpdate](https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/).
- Spring 표적 검사 39/39, 전체 `npm test` 494/494, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 JS·검사 구문 검사가 통과했다. `git diff --check`는 기록 업데이트 뒤 다시 실행한다. Spring 앱·Kubernetes·Docker를 실제 기동하지 않았다. 내부 브라우저 열기 요청은 대기 상태이고 Computer Use는 사용하지 않아 시각 검수는 미완료다. 전체 CQ는 열어 두고 공개 배포하지 않는다.

## 2026-10-29 Spring Boot W25–W26 API 호환성·운영 흐름 재검수

- W25–W26의 10일·30문항과 예제 10개를 API 버전 변경, 폐기 예정 표시, API 오류 응답, 접근 권한, 동시 등록, 메트릭 태그와 운영 점검 흐름에 맞춰 대조했다. 정답 기준과 예제 사이의 오류는 찾지 못했다.
- 학습 화면에서 `deprecation`, `schema`, `endpoint`, 소비자·엄격한 해석기, 주체·소유자/공유, 태그 카디널리티 같은 표현을 필요한 API 이름 외에는 자연스러운 한국어로 정리했다. W25–W26의 10개 세션 제목과 소개도 각 주제에 맞게 구체화하고 반복 안내 문구를 없앴다.
- W26의 좌석 등록 예제는 이미 존재하고 사용 권한을 확인한 강좌를 다루는 작은 예제라고 범위를 명시했다. PostgreSQL 18 `READ COMMITTED`에서 조건부 UPDATE를 사용하고, 갱신과 저장은 한 DB 트랜잭션이어야 하며, 중복 방지와 음수 좌석 방지는 실제 DB 제약으로 보장해야 한다고 설명했다. `REPEATABLE READ`·`SERIALIZABLE`에서 직렬화 오류가 날 수 있어 제한된 재시도가 필요하다는 점을 추가하고 동시 실행을 실제 검증한 것처럼 표현하지 않았다.
- 공식 근거: [OpenAPI 3.2](https://spec.openapis.org/oas/v3.2), [RFC 9457 문제 상세 오류 응답](https://www.rfc-editor.org/rfc/rfc9457.html), PostgreSQL 18 [UPDATE](https://www.postgresql.org/docs/18/sql-update.html)·[트랜잭션 격리](https://www.postgresql.org/docs/18/transaction-iso.html), OWASP [객체 수준 권한 검사](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), Micrometer [미터와 태그](https://docs.micrometer.io/micrometer/reference/concepts/meters.html).
- Spring 표적 검사 40/40, 전체 `npm test` 495/495, `npm run check:release` 152개 파일·최대 9.621 MiB, 변경 JS·검사 파일 구문 검사와 변경 기록을 포함한 `git diff --check`가 통과했다. 줄바꿈 변환 안내만 있었다. Spring 앱·PostgreSQL 동시 실행은 실제 구동하지 않았다. 내부 브라우저 열기 요청은 대기 상태로 남아 이번 화면 시각 검수는 미완료다. 전체 CQ는 진행 중이며 공개 배포하지 않는다.

## 2026-10-29 C#·.NET W25–W27 데이터·보안·성능 재검수

- 15일·45문항의 코드 결과, 정답 기준, 오답 설명을 확인했다. W25 EF Core의 응답 자료 분리·지연 조회·변경 추적·N+1·트랜잭션, W26 로그인 신원·자료별 권한·입력 검증·비밀 로그·HTTP 상태, W27 성능 측정·캐시 범위/갱신·Span·취소 신호를 대조했다. 이 범위에서 출력과 정답 불일치는 찾지 못했다.
- 초보자가 이해하기 어려운 `workload`, `baseline`, `profile`, `tenant`, `stale window`, `view`, `deadline`, `downstream` 등의 설명을 한국어로 풀었다. C# API 이름은 그대로 두되 처음 나오는 곳에 의미를 덧붙이고, 실제 실행하지 않은 EF Core·ASP.NET·성능 측정을 실행한 것처럼 보이지 않도록 예제 범위를 분명히 했다.
- 공식 근거: Microsoft Learn [효율적인 EF Core 조회](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying), [변경 추적과 읽기 전용 조회](https://learn.microsoft.com/en-us/ef/core/querying/tracking), [EF Core 트랜잭션](https://learn.microsoft.com/en-us/ef/core/saving/transactions), [ASP.NET Core 인증](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-10.0)·[자료별 권한 확인](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resource-based?view=aspnetcore-10.0), [HybridCache](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid?view=aspnetcore-10.0), [.NET 메모리·Span](https://learn.microsoft.com/en-us/dotnet/standard/memory-and-spans/), [.NET 성능 프로파일러](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/profilers), [비동기 취소](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/cancel-an-async-task-or-a-list-of-tasks), HTTP [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

## 2026-10-29 C#·.NET W28–W30 동시성·운영·계층 설계 재검수

- W28–W30의 15일·45문항에서 코드 예제 출력, 정답 기준, 오답 설명과 실제 운영에서의 한계를 대조했다. 설정 우선순위, 상태 확인과 종료, 컨테이너 비밀값, DB 구조 변경, 단원 ID와 진도, 권한·저장소 경계, 저장 실패 화면 상태를 포함한다.
- W28 재시도 예제는 다시 시도할 응답을 503으로 한정했다. 세 주차의 설명과 출력에서 불필요한 영어 혼용을 줄이고, 결제 중복·취소·메모리 저장·서비스 응답 같은 주제를 학습자가 이해할 수 있는 한국어로 정리했다.
- 공식 근거: Microsoft Learn [.NET 비동기 스트림](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/generate-consume-asynchronous-stream), [ConcurrentDictionary.GetOrAdd](https://learn.microsoft.com/en-us/dotnet/api/system.collections.concurrent.concurrentdictionary-2.getoradd?view=net-10.0), [.NET 10 BackgroundService](https://learn.microsoft.com/en-us/dotnet/core/compatibility/extensions/10.0/backgroundservice-executeasync-task), [설정 공급자](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers), [ASP.NET 상태 확인](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-10.0), [호스트 종료](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/generic-host?view=aspnetcore-10.0), [EF Core 마이그레이션](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying), Docker [빌드 비밀값](https://docs.docker.com/build/building/secrets/)·[`ARG`](https://docs.docker.com/reference/dockerfile#arg), Microsoft Learn [.NET 계층 구조](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures), [EF Core 테스트 전략](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy), W3C [상태 안내와 보조 기술](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22).
- C# 품질 검사 23/23과 예제 구조 검사 1/1을 포함한 표적 검사 24/24 및 변경 파일 구문 검사가 통과했다. .NET 10 SDK 10.0.400에서 W28–W30 예제 15개를 컴파일·실행해 출력 15/15가 기록된 정답과 일치했다. 전체 `npm test`와 릴리스 검사는 최종 통합 단계까지 보류한다. 실제 ASP.NET 호스트·HTTP·Docker 이미지·DB 통합, 사이트 화면의 저장 실패 흐름과 브라우저 시각 검수는 아직 수행하지 않았다. 내부 브라우저 탭 열기는 `queued`로만 반환됐다. 공개 배포하지 않았다.

## 2026-10-29 C#·.NET W31–W33 API·검증·권한 재검수

- W31–W33 15일의 예제, 질문, 정답, 오답 설명을 다시 대조했다. 예약 전부터 있던 수량을 계산에서 빠뜨리던 예제는 변경 전·후 수량을 모두 비교하도록 고쳤다. 요청 검증에는 null·빈 답·공백뿐인 답을 포함했고, 알려지지 않은 API 결과가 성공 코드 200으로 떨어지던 예제는 명시된 성공만 200, 알 수 없는 결과는 500이 되게 바로잡았다.
- 예제 출력의 `catalog`, `forbidden`, `route` 같은 한국어로 이해할 수 있는 상태 표기를 한글로 바꾸고 저장 작업 흉내 예제의 이름도 실제 저장을 보장하는 듯한 `SaveAsync`에서 `SimulateSaveAsync`로 고쳤다. API·C# 식별자는 유지하되 규칙과 해설에서 실행 중 입력 검사, 작업 취소, 기록 저장, 실제 데이터베이스 확인을 쉬운 말로 풀었다.
- 공식 근거: Microsoft Learn [ASP.NET Core API 오류 응답](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors), [자료별 접근 권한](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resource-based), [비동기 작업 취소](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/cancel-an-async-task-or-a-list-of-tasks), [실제 DB와 가짜 저장소 검사 비교](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy), IETF [Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html).
- C# 품질 검사와 예제 구조 검사를 포함한 표적 검사 24/24, 변경 JS 구문 검사, `git diff --check`가 통과했다. .NET 10 SDK 10.0.400에서 과정의 예제 172개를 컴파일·실행했고, W28–W33의 30개 출력이 기록된 정답과 일치했다. 전체 회귀와 릴리스 감사는 콘텐츠·사용자 흐름 검수 및 수정이 끝난 뒤 최종 통합 단계에서 한 번 실행한다. 실제 ASP.NET·데이터베이스 기동과 브라우저 시각 검수는 아직 미완료이며 공개 배포하지 않았다.

## 2026-10-29 C#·.NET W34–W35 복구·출시 과정 재검수

- W34–W35 10일의 예제, 질문, 정답, 오답 설명과 실제 출력 근거를 확인했다. 초보자가 바로 이해하기 어려운 `rollback`, `repository`, `schema`, `correlation ID`, `release check` 같은 설명을 쉬운 한국어로 풀고, 예제 출력에 남아 있던 영어 상태와 사례 이름을 한국어로 바꿨다. W34 취소·동시 저장·백업 복원·로그 최소화, W35 계층별 책임·기존 기능 회귀 확인·출시 전 점검·지원 범위와 다음 실습 순서를 다룬다.
- 백업 예제는 참과 거짓 대신 `가져옴` 또는 `거부`를 출력하게 했고, 현재 기록을 바꾸기 전 파일 크기·형식·필수 항목·값을 확인해야 한다는 한계를 설명했다. 계층 이름 나열이나 체크리스트 작성을 실제 서버·출시 검증으로 오해하지 않도록 각 예제의 실행 범위를 함께 표시했다.
- 공식 근거: Microsoft Learn [.NET 작업 취소](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/task-cancellation), [EF Core 동시 수정 감지](https://learn.microsoft.com/en-us/ef/core/saving/concurrency), [.NET 웹 애플리케이션 계층 구성](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures), [EF Core 검사 전략](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy), [ASP.NET Core 오류 응답](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors).
- C# 과정 품질 검사와 예제 구조 검사를 포함한 표적 검사 24/24가 통과했다. .NET 10 SDK 10.0.400에서 C# 예제 172개를 컴파일·실행했고 W28–W35의 출력 40개가 등록된 정답과 일치했다. 전체 `npm test`와 릴리스 감사는 아직 실행하지 않았다. 전체 콘텐츠·사용 흐름 검수가 계속 진행 중이며 실제 ASP.NET 호스트·데이터베이스 실행과 브라우저 시각 검수도 남아 있다. 공개 배포하지 않았다.

## 2026-10-29 Next.js W1–W3 기초·파일 경로 재검수

- W1–W3의 15일에서 주제, 코드 예제, 질문 45개, 정답과 피드백을 공식 Next.js 문서와 대조했다. React와 Next.js 역할, `page`·`layout`, `src/app`, `public`, `loading`, 루트 문서, 중첩 레이아웃, 경로 그룹, 밑줄 폴더의 범위에서 사실과 정답이 어긋난 항목은 찾지 못했다.
- 주관식 채점이 한 표현만 인정해 자연스러운 답을 거부할 수 있는 W1 홈 경로·명령·서버 실행 조건, 정적 호스팅 실행 위치, W3 문서 요소·화면 이동 답안에 동등 표현을 추가했다. 새 회귀 검사는 이 표현들을 정답으로 받아들이고 관련 없는 답은 계속 거부하는지 확인한다.
- 공식 근거: Next.js [파일 구조와 화면 경로](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [서버·브라우저 컴포넌트](https://nextjs.org/docs/app/getting-started/server-and-client-components), [프로젝트 구조와 정적 파일](https://nextjs.org/docs/app/getting-started/installation), [경로 그룹](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups), [밑줄 폴더](https://nextjs.org/docs/app/glossary), [정적 내보내기 제한](https://nextjs.org/docs/app/guides/static-exports), [지원 정책](https://nextjs.org/support-policy) 및 [16.4.3 릴리스 근거](https://github.com/vercel/next.js/releases).
- `nextjs-curriculum-quality`와 공통 콘텐츠 표적 검사 56/56, 변경한 Next.js 소스와 테스트 구문 검사가 통과했다. 이 트랙의 예제는 개념 읽기 자료이므로 이 배치에서 Next.js 서버를 실행하지 않았다. 전체 회귀와 릴리스 검사는 마지막 콘텐츠·사용 흐름 변경 뒤에 실행한다. 공개 배포하지 않았다.

## 2026-10-29 Next.js W4–W6 링크·경로·검색 매개변수 재검수

- 15일·45문항에서 Link와 브라우저 이동, 직접 주소 진입 때의 대체 경로, 현재 위치의 접근성 표시, 동적 경로 매개변수·catch-all, Next.js 16의 Promise형 `params`·`searchParams`, 반복 검색 키, URL 인코딩과 비밀값 제외 흐름을 확인했다. 공식 Next.js 문서와 대조한 결과 사실 오류나 답 키 불일치는 찾지 못했다.
- W5의 권한 문항은 URL만 안다고 권한을 얻지 못한다는 뜻이 맞더라도, 기존 짧은 답이 세 문장에 한정되어 “별도 접근 권한 확인이 필요하다”와 같은 자연스러운 한국어 답을 거부했다. 동등 답 두 개를 더 허용하고, 로그인 여부만으로 모든 강의 권한이 생긴다는 오답은 계속 거부하도록 회귀 검사를 보강했다.
- 근거: Next.js 공식 [Link와 이동](https://nextjs.org/docs/app/api-reference/components/link), [`useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router), [동적 경로](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [page의 `params`·`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page). 기준일의 과정 버전 Next.js 16.4.3은 [공식 릴리스 기록](https://github.com/vercel/next.js/releases)과 대조했다.
- 예제는 개념 읽기 자료이며 이 배치에서 Next.js 서버를 실행하지 않았다. 표적 검사는 마지막 변경 뒤 실행하고 전체 회귀·릴리스 감사는 남은 콘텐츠·제품 흐름 검수가 끝나는 통합 단계에서 한 번 실행한다. 공개 배포하지 않았다.

## 2026-10-29 Next.js W7–W9 서버·브라우저 경계와 데이터 전달 재검수

- 15일·45문항의 서버·브라우저 컴포넌트 경계, 비밀값 모듈, 상호작용 최소화, 부모 화면이 Client 컴포넌트 안에 자식을 넣는 방식, Server Function 입력 검증, 화면 DTO, 첫 화면 하이드레이션 조건을 확인했다. 주제와 정답 키의 기술적 모순은 찾지 못했다.
- 대소문자를 무시하는 주관식 채점 때문에 `useState`, `useEffect`, `toISOString` 같은 코드 이름을 잘못된 표기로 제출해도 정답 처리될 수 있음을 발견했다. 정확한 키워드·훅·메서드·인터페이스·타입을 묻는 문항은 영문 대소문자를 구분하고, 변경된 문항 ID에는 이전 ID 별칭을 둬 저장된 진도를 이어 준다.
- 근거: Next.js [서버·클라이언트 컴포넌트](https://nextjs.org/docs/app/getting-started/server-and-client-components), [모듈 경계](https://nextjs.org/docs/app/guides/server-and-client-boundary), [데이터 보안](https://nextjs.org/docs/app/guides/data-security), [`use client`](https://nextjs.org/docs/app/api-reference/directives/use-client), React [Server Functions](https://react.dev/reference/rsc/use-server), [`useState`](https://react.dev/reference/react/useState)·[`useEffect`](https://react.dev/reference/react/useEffect).
- Next.js 표적 품질·공통 콘텐츠 검사 56/56, 변경 모듈·검사 파일 구문 확인, `git diff --check`가 통과했다. 예제는 이 사이트에서 실행되지 않는 개념 자료다. 전체 회귀·릴리스 감사는 남은 콘텐츠·제품 흐름 검수가 끝나는 통합 단계에서 한 번 실행한다. 공개 배포하지 않았다.

## 2026-10-29 Next.js 16.4.3 최신 기준 반영

- 공식 릴리스 기록을 다시 확인해 Next.js 16.4.3이 2026-10-23 공개된 최신 안정판이고, 16.5 canary는 시험판임을 확인했다. 과정 개요, 과정 버전, 오류 재시도 설명, lockfile 예시와 호환성 연습의 기준 날짜를 16.4.3·2026-10-29로 맞췄다. 예제 프로젝트의 잠금 버전 16.4.1은 별개의 재현 설치 사례라 그대로 유지했다.
- W10–W12의 15일·45문항을 요청 오류와 취소, 요청 메모이제이션·지속 캐시 구분, `loading.tsx`·Suspense·streaming, `error.tsx`의 재시도, `notFound()`의 상태 코드 경계에 맞춰 재확인했다. 정답 키·예제 흐름과 현행 문서 사이에 새 기술 오류는 찾지 못했다. 서버 실행을 하지 않는 정적 설명 예제라는 범위도 유지한다.
- 공식 근거: [Next.js 공식 릴리스 기록](https://github.com/vercel/next.js/releases), [`fetch` 캐시 계약](https://nextjs.org/docs/app/api-reference/functions/fetch), [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [데이터 요청·스트리밍 안내](https://nextjs.org/docs/app/getting-started/fetching-data), [`error.tsx`의 `retry()`](https://nextjs.org/docs/app/api-reference/file-conventions/error), [`notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found).
- 콘텐츠·버전 변경 뒤 `nextjs-curriculum-quality`와 공통 콘텐츠 표적 검사 56/56이 통과했다. 변경된 소스·검사 구문과 `git diff --check`도 확인한다. 전체 회귀·릴리스 감사와 실제 화면의 저장·이동 확인은 아직 남아 있어 완료로 처리하지 않았다.

## 2026-10-29 Next.js W13–W15 페이지 정보·API·HTTP 계약 재검수

- 15일·45문항의 고정·동적 페이지 정보, 대표 주소와 공유 미리보기, Route Handler 파일·HTTP 요청 경계, 정적 내보내기의 GET 응답, 입력 검증·상태 코드·페이지 조회·중복 요청 방지·공개 오류 응답을 확인했다. 예제의 코드 흐름과 정답·오답 설명이 서로 충돌하는 부분은 찾지 못했다.
- 페이지 정보는 Server Component에서 선언하거나 `generateMetadata`가 반환하며, 같은 URL·옵션 fetch의 재사용 범위를 사용자 간 지속 저장으로 과장하지 않는다. Route Handler는 정적 파일 호스팅에서 POST 요청을 저장하지 않으며, 요청 body는 JSON 해석 뒤에도 서버에서 검증해야 한다. 페이지 크기·cursor 검증 및 사용자·작업별 중복 요청 기록 등 운영에서 필요한 경계도 문항과 예제에 연결돼 있다.
- 공식 근거: Next.js [페이지 정보 API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Route Handler 안내](https://nextjs.org/docs/app/guides/backend-for-frontend), [정적 내보내기](https://nextjs.org/docs/app/guides/static-exports), [Route Handler 파일 규약](https://nextjs.org/docs/app/api-reference/file-conventions/route), [공식 릴리스 기록](https://github.com/vercel/next.js/releases).
- 전체 Next.js 과정 품질·공통 콘텐츠 표적 검사 56/56은 최신 버전 기준 수정 뒤 통과했다. 이번 범위의 Route Handler는 이 정적 학습 사이트에서 실행하지 않는 개념 예제다. 전체 회귀는 남은 과정·제품 흐름 확인과 수정이 모두 끝난 뒤 실행한다.

## 2026-10-29 Next.js W16–W18 폼·캐시 갱신·요청 보안 재검수

- 공식 가이드와 15일·45문항을 대조했다. Cache Components가 켜진 Next.js 16 예제에서 `cookies()`·`headers()`를 읽는 화면에 `<Suspense>`가 없으면 정적 화면과 요청별 영역을 나눌 수 없었다. 두 예제에 대기 안내를 포함한 Suspense 경계를 넣고 관련 문항에 조건을 명시했다.
- `useOptimistic` 예제는 빈 제목을 막지 않고 저장 오류를 보여 주지 않아 실패 후 사용자가 상황을 알 수 없었다. 입력 이름, 임시 항목의 고유 키, 상태 안내를 추가하고 action의 오류 결과·예외를 표시하게 고쳤다. 캐시 무효화 예제에는 Server Action 실행 문맥을 표시했다.
- 공식 근거: Next.js [폼과 제출 대기 상태](https://nextjs.org/docs/app/guides/forms), [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), [인증과 권한](https://nextjs.org/docs/app/guides/authentication), [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies), [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers), [Cache Components에서 요청 데이터와 Suspense](https://nextjs.org/docs/messages/blocking-route).
- 이번 수정에 맞춰 품질 검사를 보강했다. Next.js와 공통 콘텐츠 표적 검사·예제 구문 확인은 통과했으며, 전체 회귀는 남은 과정과 학습·저장 화면 확인이 끝난 뒤 실행한다. 정적 사이트에서 Next.js Server Action은 실제로 실행되지 않는다.

## 2026-10-29 Next.js W19–W21 캐시·웹 보안·이미지 재검수

- 15일·45문항에서 공개·개인 데이터의 캐시 구분, Cache Components와 이전 fetch 정책, `updateTag`·`revalidatePath`·`revalidateTag`, 출력 인코딩·외부 이동 URL·Server Action 인가·CSP·로그·이미지와 폰트·공개 파일 범위를 확인했다.
- W19 D4의 개인 기록 예제는 `cookies()`를 직접 `page`에서 기다려 Cache Components 설정에서 필요한 `<Suspense>`가 빠져 있었다. 요청별 화면을 별도 컴포넌트로 분리하고 로딩 안내를 넣었다. W20 D3 Server Action은 FormData 값에 `String()`을 적용해 파일이나 누락 값을 문자열로 바꾸고, 제목 검증이 저장 함수 이름에만 숨겨져 있었다. 문자열 타입·빈 값·제목 유효성 검사를 명시한 뒤 소유권 확인과 저장을 하도록 고쳤다. W20 D5의 로그 정제 함수는 사용하지 않고 있었다. 꼭 필요한 비민감 보조값에 적용하고 비밀·본문은 기록하지 않도록 실제 흐름에 연결했다.
- 공식 근거: Next.js [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [Suspense 밖에서 요청 데이터 접근 오류](https://nextjs.org/docs/messages/blocking-route), [Server Action 인증·권한](https://nextjs.org/docs/app/guides/authentication), [서버 데이터 보안](https://nextjs.org/docs/app/guides/data-security), [이미지 출처·크기·alt](https://nextjs.org/docs/app/api-reference/components/image), [공식 정적 파일 공개 범위](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder), [CSP nonce의 동적 렌더 조건](https://nextjs.org/docs/14/app/building-your-application/configuring/content-security-policy).
- 수정 뒤 Next.js·공통 콘텐츠 표적 검사 56/56이 통과했다. 코드 예제는 수업용 개념 코드이며 Next 서버·DB·운영 로그는 이 사이트에서 실행하지 않았다. 전체 회귀·릴리스 감사·화면 흐름 확인은 최종 통합 단계에 남아 있다.

## 2026-10-29 Next.js W22–W24 접근성·검사·성능 재검수

- 15일·45문항의 문장, 선택지, 정답, 피드백과 코드 예제를 대조했다. landmark와 제목 구조, 폼 오류 연결과 초점, 상태 공지, 움직임 감소, 단위·컴포넌트·Route Handler·브라우저 검사 범위, 동적 불러오기, 이미지 로딩, Web Vitals, 성능 비교가 주차 목표와 일치했다. 확인한 범위에서 정답·예제의 기술 오류는 찾지 못했다.
- 공식 근거: W3C [ARIA status message](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)·[reduced motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39), Next.js [동적 불러오기](https://nextjs.org/docs/app/guides/lazy-loading)·[Image preload/lazy](https://nextjs.org/docs/app/api-reference/components/image)·[useReportWebVitals](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals), React [DOM ref로 요소 제어](https://react.dev/learn/manipulating-the-dom-with-refs).
- 이번 배치에서 코드·콘텐츠 수정은 필요하지 않았다. Next.js 표적 검사와 전체 회귀는 실행하지 않았다. 사이트 화면 흐름의 실제 브라우저 확인은 별도 단계에 남아 있다.

## 전체 회귀를 실행할 시점과 완료 조건

- 2026-10-30 기준 현재 수정 묶음은 전체 `npm test` 507/507, `npm run check:release` 통과로 검증했다. 격리된 내부 브라우저에서 주요 학습 흐름과 좁은 화면도 한 차례 확인했으므로, **현재 수정 묶음의 전체 회귀는 여기서 종료**한다.
- CQ 콘텐츠 감사 자체는 미검수 범위가 있어 계속 열려 있다. 완료된 배치마다 전체 회귀를 되풀이하지 않는다. 이후 각 배치에서는 바뀐 콘텐츠·기능의 표적 검사와 가능한 예제 실행만 한다.
- 미검수 콘텐츠 배치의 수정이 모두 끝나 출시 후보를 만들 때 전체 `npm test`와 `npm run check:release`를 한 번 실행한다. 현재 검증 이후 코드·콘텐츠가 바뀌면 영향을 받은 표적 검사를 실행하고, 마지막 전체 검사는 새 수정이 더 이상 없는 통합 단계에서만 한다. 배포는 별도 결정이며 회귀 통과만으로 자동 배포하지 않는다.

## 2026-10-29 Next.js W25–W27 React 경계·버전 변경·오류 진단 재검수

- 15일·45문항에서 예제 코드, 정답, 선택지와 피드백을 대조했다. React Context, Effect 정리, Server Action 호출, Next.js 16의 비동기 params·proxy 규약, 원격 이미지 허용 범위, 잠금 파일, 404·서비스 오류 구분, 계정 간 자료 격리, 안전한 오류 제보를 확인했다.
- Context 예제는 값을 바꿀 수 없는 상태였고 `setTheme`를 사용하지 않았다. theme 토글과 Provider 누락 검사를 추가했다. Server Action 예제에는 Client Component에서 가져오는 Action 파일의 `"use server"` 조건을 명시했다. 최신 문서 기준 16.4.3과 잠금 파일의 16.4.1 예제가 섞이고 실제 npm 잠금 파일 구조와도 달라, 최신 참조 버전과 설치 버전을 분리하고 npm v3의 `packages` 구조로 예제를 고쳤다. Next.js 16의 middleware→proxy 설명과 코드 주석은 쉬운 한국어로 정리했고, notFound 예제에 필요한 import를 넣었다.
- 공식 근거: Next.js [Server Action을 Client Component에서 쓰기](https://nextjs.org/docs/app/api-reference/directives/use-server), [Next.js 16 업그레이드](https://nextjs.org/docs/app/guides/upgrading/version-16), [PageProps와 비동기 params](https://nextjs.org/docs/app/api-reference/file-conventions/page), [원격 이미지 허용 규칙](https://nextjs.org/docs/app/api-reference/components/image), React [`createContext`](https://react.dev/reference/react/createContext)·[`useContext`](https://react.dev/reference/react/useContext), npm [`package-lock.json` 형식](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json).
- Next.js·공통 콘텐츠 표적 검사 56/56, 변경 JavaScript 구문 검사, `git diff --check`가 통과했다. 예제 15개는 테스트의 TSX 구문 진단을 통과했으나 Next.js 서버로 실행하지 않았다. 전체 회귀와 실제 브라우저 화면 흐름 확인은 남은 범위 점검 뒤 마지막 단계에 진행한다.

## 2026-10-29 Next.js W28–W30 테스트·오류 복구·저장 경계 재검수

- 15일·45문항에서 Playwright의 직접 경로 진입과 자동 대기, not-found와 streaming 상태, 폼 접근성, 가짜 저장소의 검증 범위, 오류 추적·재시도·요청 취소, 정적 배포의 한계, 서버 전용 데이터 접근 계층, 트랜잭션, 점진적 스키마 변경, 객체 소유권 검사, 수동 진도 백업을 예제·정답·피드백과 대조했다.
- 한국어 화면 예제에 영어 버튼·오류 문구가 섞여 있어 한국어로 고쳤다. 독립 예제에 필요한 Playwright `Page`·Node `assert` import와 `baseURL` 설정 조건을 덧붙이고, 가짜 저장소 검사가 실제 DB·권한을 확인하지 않는다는 범위를 코드에 드러냈다. W29 검색은 이전 검색 결과가 새 검색 화면에 보이거나 JSON 형식 오류를 놓칠 수 있어 요청별 상태와 응답 검증을 추가했다. W30 백업 복원은 잘못된 JSON이나 저장 실패가 처리되지 않던 흐름을 오류 결과로 반환하게 했다.
- 공식 근거: Next.js [요청 오류 관측](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation), [오류 경계](https://nextjs.org/docs/app/getting-started/error-handling), [데이터 접근 계층·Server-only](https://nextjs.org/docs/app/guides/data-security), [정적 export 제한](https://nextjs.org/docs/app/guides/static-exports), Playwright [자동 재시도 assertion](https://playwright.dev/docs/test-assertions), MDN [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- Next.js·공통 콘텐츠 표적 검사 56/56과 변경 파일 구문·공백 검사가 통과했다. 15개 예제의 TSX 구문 진단도 통과했지만 Playwright 브라우저·Next.js 서버·데이터베이스를 실제 실행하지 않았다. 실제 사이트의 학습·저장 화면 확인과 최종 전체 회귀는 남은 범위 검수 뒤 진행한다.

## 2026-10-29 Next.js W31–W33 정적 배포·출시·마무리 재검수

- 마지막 15일·45문항에서 static export와 정적 GET, 사전 생성 경로, browser 저장의 hydration, 하위 경로 배포, 비밀값 공개 범위, 빌드 시 환경값 고정, 배포 미리보기, 로컬 진도, 기능 범위 보고의 예제·정답·피드백을 확인했다.
- W32 D2 예제가 `next.config.ts` 안에 `next/link`·`next/image`를 불러 컴포넌트까지 내보내고 있었다. 설정과 `TrackNavigation.tsx` 예제를 파일 경계에 맞춰 분리했다. W32 D4의 공개 빌드 대상 값 `DEPLOY_TARGET`은 `NEXT_PUBLIC_` 접두사가 없어 브라우저 bundle에 들어가지 않는 설정이었다. 공개값을 `NEXT_PUBLIC_DEPLOY_TARGET`로 바꾸고 client 파일임을 표시했다. W31 D4의 예제는 저장하지 않으면서 `saved: true`를 반환하던 문구를 `received: true`로 바꾸고 실제 저장을 별도 서버 기능으로 설명했다. 한국어 화면 문구와 설명 주석을 정리했다.
- 공식 근거: Next.js [정적 export와 지원·미지원 기능](https://nextjs.org/docs/app/guides/static-exports), [정적 GET Route Handler](https://nextjs.org/docs/app/guides/backend-for-frontend#export-mode), [basePath와 이미지 경로](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath), [공개 환경 변수의 빌드 시 치환](https://nextjs.org/docs/pages/guides/environment-variables), React [Effect와 브라우저 API](https://react.dev/reference/react/useEffect).
- 전체 Next.js·공통 콘텐츠 표적 검사 56/56, 변경 파일 구문 검사와 `git diff --check`가 통과했다. 수업 예제의 TSX 구문 진단은 통과했지만 Next.js 서버·빌드·실제 호스트 미리보기는 실행하지 않았다. 실제 사이트 화면과 저장 동작을 내부 브라우저로 확인하는 단계가 남아 있다.

## 2026-10-29 최종 통합 회귀 완료

- 전체 `npm test` 498/498 통과(약 190초). 콘텐츠·채점·저장/복원·라우팅·접근성·격리 코드 실행·PostgreSQL 18.3 검증이 포함됐다.
- `npm run check:release`의 정적 빌드 및 배포 감사가 통과했다: 152개 산출 파일, 최대 9.621 MiB, same-origin 정책과 격리 실행기 CSP 확인.
- 이 기록으로 이번 전체 회귀 종료 조건을 충족했다. 이후 변경이 생기면 관련 표적 검사 후 다음 통합 시점에 전체 회귀를 실행한다.
- 별도 검수 한계는 Windows 한글 IME, 초보 학습자 관찰, 이번 세션의 운영체제 파일 선택창 동작이다. 이 항목은 테스트 통과로 대체하지 않는다. 공개 배포는 하지 않았다.

## 2026-10-30 공통 실무 기초 W1–W2 파일 경로·터미널 명령

- W1–W2 10일·30문항에서 목표→설명→예제→질문→정답·오답 근거의 연결을 확인했다. 절대/상대 경로와 POSIX·Windows 표기, 상위 경로 추적, 트리에서 실제 위치 계산, `cd` 이동 뒤 기준 위치, 옵션·인자·따옴표, 오류 메시지와 종료 상태의 범위가 서로 맞았다.
- 발견: W1 D4는 Bash와 PowerShell을 구별하지 않고 `cd..`도 정답 처리했다. PowerShell 파서는 `cd..`를 현재 환경에서 유효하게 처리했지만 Bash의 단순 명령은 공백으로 명령과 인자를 나눈다. 따라서 Bash·PowerShell 공통 사용법을 묻도록 범위를 밝히고 `cd ..`만 허용했다. `tests/foundations-quality.test.js`에서 `cd ..` 정답과 `cd..` 거부를 검증한다.
- W2 D1의 `node app.js "two words"` 문항은 Node 프로그램 안의 추가 스크립트 인자 수가 아니라 명령줄에서 `node` 뒤에 적힌 항목 수를 묻는다. 기존 힌트가 `app.js`와 따옴표 안 값 둘을 세도록 범위를 명시하고 있어 답 2와 모순되지 않았다. 다만 `process.argv`를 직접 묻는 문제로 읽히지 않도록 공식 Node 설명과 대조했다.
- 공식 근거: [POSIX pathname 정의](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap03.html), [PowerShell 7.6 경로](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax?view=powershell-7.6)·[명령 파싱](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing?view=powershell-7.6), [Bash 명령 구문](https://www.gnu.org/software/bash/manual/html_node/Shell-Commands.html)·[종료 상태](https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html), [Node.js `process.argv`](https://nodejs.org/api/process.html#processargv).
- 전용 과정 품질 검사 17/17과 변경 파일 공백 검사가 통과했다. 이 배치는 공통 실무 W1–W2만 다루며 전체 CQ 완료를 뜻하지 않는다. 공개 배포하지 않았다.

## 2026-10-30 공통 실무 W1–W2 수정 반영 통합 회귀

- W1 D4 답안 범위 수정과 전용 회귀 검사 추가 뒤 `npm test` 499/499가 116.9초에 통과했다. `npm run check:release`도 통과해 정적 산출물 152개, 최대 9.621 MiB와 same-origin 연결·격리 실행기 CSP·불필요한 서버 파일 및 학습자 데이터 미포함을 확인했다.
- 이번 변경의 통합 회귀는 종료했다. 새 코드·콘텐츠 변경이나 재현된 실패가 없으면 전체 회귀를 다시 실행하지 않고, CQ가 열려 있다는 이유로 이미 확인한 항목을 반복하지 않는다. 이후 새 수정은 표적 검사로 확인하고 다음 실제 통합 변경이 모였을 때 전체 회귀를 한 번 실행한다.
- Windows 한글 IME 조합과 초보 학습자 관찰은 이번 자동 검사로 확인하지 않았다. 내부 브라우저 탭을 조작할 수 있는 도구가 없어 새 화면 확인도 하지 않았다. 공개 배포하지 않았다.

## 2026-10-30 React W1–W3 단답의 질문 범위 재검수

- React 첫 3주차에서 단답 12개를 질문·예제·등록 답안·힌트·해설과 대조했다. W3 D1은 “렌더링 중 실행되는가”와 “언제 실행되는가” 두 가지를 물으면서 `아니요` 또는 `클릭할 때`만 적어도 정답 처리했다. W3 D5도 삭제 동작과 부모 카드 동작을 함께 물으면서 `삭제만 실행`만 적어도 정답 처리했다.
- 두 문항은 질문이 요구한 결과를 모두 말하는 답만 허용하도록 정리하고 v3 문항 ID를 부여했다. 이전 v2 ID는 새 문항을 가리키도록 유지했고, 주차 3의 두 학습일에 새 ID가 계속 표시되는 회귀 조건을 추가했다.
- 공식 근거: React [Responding to Events](https://react.dev/learn/responding-to-events)에서 함수 참조는 클릭 상호작용 때 호출되고 `stopPropagation()`은 부모 handler로의 전파를 막지만 현재 handler의 후속 코드는 계속 실행된다고 확인했다.
- `tests/javascript-react-quality.test.js` 38/38, 변경 파일 `git diff --check` 통과. 2026-10-30 전체 회귀 499/499와 release audit은 이 React 수정 전 결과이므로 최종 통합 시 다시 확인한다. 전체 CQ는 열어 두며 공개 배포하지 않았다.

## 2026-10-30 React W4–W6 단답의 예제·조건 재검수

- 단답 12개에서 질문, 함께 보이는 코드, 등록 답안의 범위만 확인했다. W4 D2의 질문 예시가 실제 React 목록 상태 코드와 맞지 않았고 허용 답도 실제 출력이 아닌 구분 기호까지 정답으로 받았다. 원본 배열과 새 배열을 출력하는 짧은 코드로 통일하고 실제 한 줄 출력만 정답으로 인정했다. 기존 W4 문항 ID v2·v3는 새 v4 문항을 가리키게 했다.
- W5 D5는 질문에서 `course-title-error` 연결을 물으면서 예시 코드가 이미 다른 id끼리 연결된 상태를 보여 줬다. 화면의 코드를 실제로 연결이 끊긴 상태로 고치고, 두 id를 같게 바꾸는 것이 해결이라고 설명했다. 기존 v2 ID는 v3 문항으로 연결했다.
- W6 D3은 첫 실행과 검색어 변경 뒤 실행을 세게 하면서 개발용 Strict Mode의 추가 실행을 제외한다는 조건이 없었다. 조건을 질문에 명시하고 v3 ID를 발행해 v2 저장 진도를 연결했다.
- 공식 근거: React [state 배열 갱신](https://react.dev/learn/updating-arrays-in-state), [Strict Mode](https://react.dev/reference/react/StrictMode), [Effect 동기화](https://react.dev/learn/synchronizing-with-effects), W3C [WAI-ARIA `aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby).
- `tests/javascript-react-quality.test.js` 39/39 통과. 새 회귀는 두 코드 예제와 기대 답을 확인하고, W4–W6의 이전 문항 ID 별칭 및 주차별 표시를 확인한다. `git diff --check`는 공백 오류 없이 통과했다(저장소 줄바꿈 변환 안내만 출력). 499/499 전체 회귀와 릴리스 검사는 이번 React 수정 전 결과이므로 남은 실제 수정이 끝난 최종 통합 단계에서 한 번 실행한다. 이미 확인한 범위는 새 결함 근거가 없으면 다시 열지 않는다. 전체 CQ는 미완료 상태로 유지하고 공개 배포하지 않았다.

## 2026-10-30 React W7–W9 단답의 질문·예제 일치 재검수

- 단답 12개에서 질문이 요구한 코드와 화면에 보이는 코드가 같은 상황인지 확인했다. W8 D1은 `hookName.startsWith("use")`를 물으면서 예시에는 `hookName` 변수가 없었다. 질문 식을 그대로 실행하는 짧은 코드로 바꾸고 새 v4 ID를 발행했으며 v2·v3 기록을 별칭으로 연결했다.
- W8 D5는 컴포넌트 사이에서 custom Hook 상태가 독립인지 묻지만, 기존 예시는 컴포넌트 밖의 `useState` 호출 두 개뿐이었다. Hook을 두 번 호출하는 `Pair` 컴포넌트와 첫 번째 패널만 여는 버튼을 보여 주도록 고쳤다. 새 v3 ID는 이전 v2 기록과 연결했다.
- W9 D1은 `await fetchCourses`가 대기 중일 때를 물으면서 별개의 클릭 상태 컴포넌트를 보여 줬다. `loadCourses`가 로딩 상태를 먼저 설정하고 응답 뒤 성공·실패 상태를 정하는 예시로 바꿨다. W9 D3은 질문의 `courses`와 코드의 `result`가 달랐고, “취소된다”가 예/아니오 질문의 직접 답으로 처리됐다. 질문을 코드의 `result`에 맞추고 직접 답하지 않는 허용 답을 제거했다. 두 문항도 v3 ID로 바꾸고 v2 저장 기록을 연결했다.
- 공식 근거: React [Hook 재사용과 호출별 상태](https://react.dev/learn/reusing-logic-with-custom-hooks), [Hook 호출 규칙](https://react.dev/reference/rules/rules-of-hooks), [`useState`](https://react.dev/reference/react/useState), [Effect에서 요청 취소·오래된 결과 무시](https://react.dev/learn/synchronizing-with-effects#fetching-data).
- React 표적 검사 40/40 통과. 회귀는 Hook 이름 코드 출력, 두 Hook 호출이 들어 있는 유효한 컴포넌트 구조, pending 요청의 상태 순서, abort된 타이머의 결과 미반영, 이전 ID 연결과 각 주차 표시를 확인한다. 변경 소스·검사 파일의 공백 검사는 통과했다. 전체 499/499와 릴리스 검사는 React W1–W9 수정 전 결과라 이후 실제 변경이 끝난 최종 통합 단계에서 한 번만 실행한다. 다른 주차를 반복 검수하지 않고 CQ는 미완료로 유지한다. 공개 배포하지 않았다.

## 2026-10-30 React W10–W12 단답의 허용 답 범위 재검수

- 12개 단답에서 질문이 요구하는 값·요소·상태와 등록 답을 대조했다. W10 D1은 href 값 `/tracks/react`를 묻는데 맨 앞 슬래시가 없는 `tracks/react`도 정답으로 허용해, 현재 주소 기준 상대 경로를 루트 기준 경로와 같게 채점했다. 이 허용 답을 제거하고 문항 v3 ID를 발행해 저장된 v2 답안을 새 문항으로 연결했다. 나머지 11개 답 범위는 예시 값과 어긋나지 않았다.
- 공식 근거: WHATWG [URL Standard](https://url.spec.whatwg.org/)는 `/`로 시작하는 경로와 `/` 없이 시작하는 상대 경로를 서로 다른 URL 경로 형태로 정의한다.
- `tests/javascript-react-quality.test.js` 41/41 통과. 회귀는 루트 경로 정답, 슬래시가 빠진 상대 경로 오답, 기존 ID 별칭과 주차 표시를 확인한다. URL 해석 차이도 Node `URL`로 비교했다. 전체 `npm test` 499/499와 릴리스 검사는 React W1–W12의 새 ID/답안 수정 전 결과라 남은 실제 변경이 끝난 뒤 한 번만 실행한다. 확인을 마친 범위는 새 결함 근거가 없으면 다시 열지 않는다. 공개 배포하지 않았다.

## 2026-10-30 React W13–W15 단답 예제·답안 재검수

- W13–W15의 단답 12개를 질문·실행 예제·등록 답안과 맞춰 봤다. W14 D5는 질문과 힌트가 버튼의 `onClick` 연결을 설명했지만, 예제에는 관련 prop이 나타나지 않았다. `SaveAction`이 받은 `save` 함수를 `button`의 `onClick` prop에 전달하는 실행 가능한 예제로 고치고 문항을 v3로 갱신해 기존 v2 풀이 ID를 연결했다. 나머지 11개 답은 예제와 일치했다.
- 근거: React [Responding to Events](https://react.dev/learn/responding-to-events)에서 이벤트 handler를 JSX 속성에 함수 참조로 전달하는 방식을 확인했다.
- `tests/javascript-react-quality.test.js` 42/42 통과. 새 회귀에서 단답 예제 전체의 실행 결과·채점, 이전 ID 별칭, 주차 표시와 `onClick` prop 연결을 확인한다. 전체 `npm test` 499/499와 릴리스 검사는 React W1–W15 수정 전 결과라 남은 실제 변경을 모두 마친 뒤 한 번만 실행한다. 공개 배포하지 않았다.

## 2026-10-30 React W16–W18 단답 예제·질문 범위 재검수

- W16–W18 단답 12개를 화면 질문과 실제 실행 코드에 대조했다. W16 D2는 `saveBeforeNavigate`의 실패 결과를 묻지만 다른 객체의 `saved` 값만 출력하고 있어 실제 함수·실패 흐름을 보여 주도록 바꿨다. 문항을 v4로 올리고 기존 v2·v3 풀이 ID를 연결했다.
- W16 D1·D3·D5, W17 D1, W18 D1은 답과 계산은 맞았지만 질문이 예제에 없는 컴포넌트 반환·React key·프로젝트 설정·Error Boundary 상태·Profiler 측정을 직접 확인하는 것처럼 표현돼 있었다. 각 질문을 코드에 실제로 적힌 조건식, 배열, 객체, 샘플 측정값에 맞춰 명확히 했다. W16 D3은 배열 요소를 연결한 정확한 출력 문자열을 묻도록 좁히면서 대소문자 구분 채점으로 바꾸고 v3 ID에 기존 v2 풀이를 연결했다. 나머지 단답도 예제와 등록 답이 일치했다.
- 공식 근거: React [19.3 출시와 ViewTransition 지원 범위](https://react.dev/blog/2026/09/09/react-19-3), [`startTransition`](https://react.dev/reference/react/startTransition), [`Profiler` 측정값](https://react.dev/reference/react/Profiler).
- `tests/javascript-react-quality.test.js` 44/44 통과. 실행 예제의 출력·채점, W16 D2·D3 이전 ID 별칭, 주차 배치와 조정한 질문 문구를 확인했다. 전체 회귀에서 기존 ID 개수 고정 검사가 새 W16 D3 정확 출력 문항을 반영하지 못하는 것을 발견해 19에서 20으로 고쳤다. 이를 포함해 최종 검사를 다시 실행한다. 이 추가 React 단답 검수는 W26까지 한 번씩만 진행하고, 이미 끝난 구간은 새 결함 근거가 없으면 다시 열지 않는다. 공개 배포하지 않았다.

## 2026-10-30 React W19–W24 단답 값·질문 대조

- W19–W24 단답 24개에서 질문에 나온 변수·조건과 예제 코드, 등록 답안을 대조했다. 입력·접근성 값, 문자열과 경로 검사, 허용 origin, JSON 복구, 비동기 상태 reducer와 사전 로딩 정책의 예제 출력 및 질문 범위가 서로 일치했다. 새 수정은 필요하지 않았다.
- 앞서 실행한 `tests/javascript-react-quality.test.js` 44/44의 단답 실행·출력 검사가 이 24개 예제도 포함한다. 이 구간을 다시 열거나 전체 회귀를 실행하지 않는다. 전체 회귀 499/499와 릴리스 검사는 React W1–W24 변경 전 기준이므로 W25–W26 확인 뒤 한 번만 실행한다. 공개 배포하지 않았다.

## 2026-10-30 React W25–W26 단답 답안·표현 재검수

- 마지막 8개 단답의 질문·코드·답을 대조했다. 실행 결과와 답은 모두 맞았다. W25 D1의 질문에만 불필요한 영어 `flow`가 있어 “학습 단계 이름”으로 고쳤다.
- `tests/content.test.js`와 `tests/javascript-react-quality.test.js` 85/85 통과. React W1–W26 추가 단답 재검수 104/104개를 마쳤다. 전체 회귀 507개 중 506개가 첫 통합 실행에서 통과했으며, 유일한 실패는 정확 출력 문항 ID 수를 고정한 오래된 기대값이었다. 이를 갱신한 뒤 전체 `npm test`와 `npm run check:release`를 확인하고 종료한다. 새 결함 근거 없이는 완료 구간을 다시 열지 않는다. 공개 배포하지 않았다.

## 2026-10-30 React 단답 추가 재검수 통합 종료

- ID 기대값 수정 뒤 전체 `npm test` 507/507 통과, `npm run check:release` 통과. 정적 산출물 152개, 최대 9.621 MiB, same-origin 정책, 격리 실행기 CSP, 서버·개발 파일 및 학습자 데이터 미포함을 확인했다.
- 추가 React 단답 검수는 104/104개에서 종료했다. 완료한 범위를 다시 열거나 전체 회귀를 반복하지 않는다. 기존 종합 콘텐츠 감사에서 미완료로 남긴 실제 브라우저 육안 확인, Windows 한글 IME, 초보 학습자 관찰은 이 자동·문항 대조 검사로 통과 처리하지 않는다. 공개 배포하지 않았다.

## 2026-10-30 FastAPI W4–W6 제목·단답 채점 확인 종료

- W4–W6의 표시 제목과 단답 답안 범위를 확인했다. W4 D2 제목은 필수 문자열 쿼리를 정수 기본값이라고 잘못 표시했고 W5 D2는 생략 가능한 nullable 설명 필드를 필수 필드라고 잘못 표시했다. 두 제목과 기본 일일 목표 예시를 고쳤다. W6 D3 제목도 선택 가능 여부와 최대 길이 조건을 함께 드러내도록 바꿨다.
- 같은 뜻의 유효한 FastAPI/Python 단답 표기를 정답으로 허용했다. `Query`를 명시하는 표현과 FastAPI가 쿼리로 추론하는 표현, `Optional`/union 표현, 동기·비동기 경로 함수, Pydantic nullable 필드 표현을 포함한다. 근거: FastAPI [쿼리 매개변수 검증](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/)·[요청 본문](https://fastapi.tiangolo.com/tutorial/body/), Pydantic [필드 기본값](https://docs.pydantic.dev/latest/concepts/fields/)·[필수·선택·null 허용 차이](https://docs.pydantic.dev/latest/concepts/fields/#default-values).
- `tests/fastapi-course-quality.test.js` 17/17 통과. 세 제목과 15개 단답의 기본 답, 추가로 허용한 동등 답안 채점을 검사했다. 이번 수정 뒤 전체 `npm test`와 릴리스 검사는 실행하지 않았다. 직전 507/507 결과는 이번 수정 전 결과다. 공개 배포하지 않았다.
- 이번 확인 묶음은 여기서 종료한다. 새 결함 근거 없이 이미 확인한 범위를 반복하지 않는다. 전체 CQ는 미완료로 남으며, 이후 검수는 아직 확인하지 않은 범위에서만 진행하고 묶음별 표적 검사 후 닫는다.

## 2026-10-30 FastAPI W7–W9 응답·상태·의존성 재검수

- 15일·45문항의 목표, 예제, 정답·오답 근거, 단답 허용 답과 오류 찾기 코드를 대조했다. W7 D2 오류 찾기 예제에는 설명이 참조하는 `AccountPublic` 모델이 없었고 그 모델이 요구할 이메일도 반환값에 없었다. 모델·필드를 보완하고 실제 잘못된 응답 모델 선언 줄을 표시하도록 고쳤다. W8 D2 예제의 정의되지 않은 `remove_course`를 수업용 메모리 저장 자료로 바꿔 삭제 동작을 예제 안에서 확인할 수 있게 했다. W8 D5 오류 찾기의 정답 수정에 필요한 `HTTPException` import를 추가했다.
- W9 D2 해설은 코드에 이미 있는 `limit` 매개변수가 없다고 잘못 설명하고, Python 문법상 유효한 어노테이션을 문법 오류라고 불렀다. 실제 오류는 `Depends`를 타입 위치에 둔 것이므로 그 차이를 정확히 설명했다. W9 D3·D4 오류 찾기 예제에도 정답 수정에 필요한 `Depends`·`Query` import를 추가했다. W8 D3·W9 D2–D4 단답에는 의미가 같은 유효한 `Header`·`Annotated` 표기를 더 허용했다.
- 공식 근거: FastAPI [응답 모델의 검증·출력 필터링](https://fastapi.tiangolo.com/tutorial/response-model/), [상태 코드와 204 본문 제한](https://fastapi.tiangolo.com/tutorial/response-status-code/), [헤더 이름 자동 변환](https://fastapi.tiangolo.com/tutorial/header-params/), [의존성 callable 및 Annotated 사용](https://fastapi.tiangolo.com/tutorial/dependencies/).
- `tests/fastapi-course-quality.test.js` 17/17 통과. 새 회귀는 공개 모델·필수 이메일·응답 줄 번호, 예제 저장 동작, 오류 찾기 예제의 필수 import, 수정된 의존성 해설, 동등 답안 채점을 확인한다. 이번 배치 뒤 전체 `npm test`·릴리스 검사는 실행하지 않았고 FastAPI 서버도 실행하지 않았다. 공개 배포하지 않았다.
- 이 배치에서 확인한 W7–W9를 닫고 다음 미확인 FastAPI 범위로 이동한다. 전체 CQ와 실제 서버 통합 검증은 미완료다. 새 근거가 없으면 W7–W9를 다시 열지 않는다.

## 2026-10-30 FastAPI W1–W3 첫 응답·경로 매개변수 재검수

- 15일·45문항에서 설명, 예제 코드, 선택형·단답형·오류 찾기 문제, 허용 답안, 힌트와 피드백의 사실 관계를 대조했다. W1 D5의 예제는 `if __name__ == "__main__"`에서 `uvicorn.run("main:app", reload=True)`를 호출하므로 `python main.py`로 실행하면 서버가 시작된다. 기존 오답 피드백은 그렇지 않다고 잘못 설명했다. 문제를 Uvicorn 앱 경로 호출을 묻도록 구체화하고, 파일 실행 명령과 앱 경로 표기를 구분하는 피드백으로 고쳤다.
- W1 과정 목표와 설명의 ASGI를 한국어로 풀어 썼고, Uvicorn이 ASGI 앱을 실행하는 서버라는 역할을 명확히 했다. W3 D3의 UUID 설명을 보완하고 W3 D5 코드 주석의 영어를 자연스러운 한국어로 바꿨다. 다른 문항에서 추가 정답·예제 모순은 발견하지 않았다.
- 공식 근거: FastAPI [Uvicorn과 앱 실행 경로](https://fastapi.tiangolo.com/deployment/manually/), [ASGI 규약](https://asgi.readthedocs.io/en/latest/specs/main.html), Python [`__main__` 실행 조건](https://docs.python.org/3/library/__main__.html) 및 [`uuid.UUID`](https://docs.python.org/3/library/uuid.html).
- `tests/fastapi-course-quality.test.js` 17/17 통과. 격리 내부 브라우저에서 W1 문제의 오답 피드백과 W3의 UUID 설명·한국어 예제 주석을 확인했다. 공식 문서 목록은 기본 접힘 상태였다. 전체 회귀 507/507은 이번 콘텐츠 수정 전 결과라 반복하지 않으며, 다음 전체 검사는 실제 남은 변경이 끝난 최종 통합 단계에서 한 번 실행한다. 전체 CQ 완료를 뜻하지 않고 공개 배포하지 않았다.

## 2026-10-30 FastAPI W11 제목·문제 연결 보정

- W11의 “의존성 정리와 공유 범위”와 “자원 경계 설명”이 화면에 표시되는 내용과 맞지 않았다. D4는 같은 요청 안에서 dependency 결과를 재사용하는 기본 cache를 묻고, D5는 데이터베이스 세션 생성이 아니라 `yield` 정리 scope를 묻는다. 주차 제목과 D4·D5 제목을 실제 질문에 맞게 고쳤다.
- FastAPI 공식 안내에 따르면 기본 `request` scope의 정리 코드는 응답 전송 뒤 실행되고, `scope="function"`은 경로 함수 종료 뒤 응답 전 실행된다. `scope="function"`은 FastAPI 0.121.0에서 추가됐다. 근거: [yield dependency scope](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/#early-exit-and-scope), [버전별 변경 사항](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/#dependencies-with-yield-http-exception-except-and-background-tasks).
- 회귀 검사에 표시 제목과 실제 D5 질문의 연결을 추가했다. FastAPI 표적 검사 17/17, `tests/design.test.js` 27/27, `tests/content.test.js` 40/40, 전체 `npm test` 508/508, `npm run check:release`(152개 파일·최대 9.621 MiB)가 모두 통과했다. 첫 전체 실행에서 드러난 공식 출처 허용 목록 누락에 ASGI·Python 공식 문서 도메인을 추가했다. 내부 브라우저에서 W11 제목과 질문이 맞는 것을 확인했다. W13–W30 등 완료 기록이 있는 구간은 새 결함 근거 없이 다시 열지 않는다.

## 2026-10-30 격리 내부 브라우저 학습·저장 흐름 확인

- 기존 사용자 기록과 분리된 빈 프로필에서 한국어 답안 초안 입력 후 새로고침해 복원되는 것을 확인했다. 정답 제출 피드백과 풀이 기록도 새로고침 후 유지됐다.
- 화면을 아래까지 내린 뒤 다음 문제로 이동했을 때 새 문제 화면의 스크롤 위치가 0으로 초기화됐다. 이는 화면 이동 뒤 이전 페이지 하단이 남던 문제의 브라우저 확인이다.
- 백업을 내보내고 같은 빈 테스트 프로필에 가져온 뒤 성공 안내, 기록 복원, 새로고침 후 유지까지 확인했다. 별도 테스트 데이터만 사용했고 임시 백업 파일과 로컬 테스트 서버를 정리했다.
- 브라우저 자동 입력으로 한글 문자열이 보존되는 것은 확인했지만, Windows 한글 IME의 실제 조합 입력을 확인한 것은 아니다. 실제 IME 조합만 수동 확인이 남았다. 초보 학습자 관찰은 선택 항목이며 참여자를 구하지 못하면 전문가 점검으로 기록한다. 전체 CQ를 열린 상태로 두는 사유는 실제 IME 확인이다. 전체 회귀 508/508과 릴리스 검사는 이 확인 시점에 통과했으며, 새 코드 변경이 없으므로 반복하지 않는다.

## 2026-10-30 제목·입출력 예제 줄바꿈 보정

- 내부 브라우저에서 긴 코딩 문제 제목이 한국어 어절 가운데 끊기고, 짧은 배열 예제가 원소마다 줄을 차지하며, 문제 안의 줄바꿈이 한 줄로 붙는 것을 재현했다. 한국어 문구는 어절 경계에서 줄을 바꾸고 짧은 JSON 값은 한 줄로 표시하도록 수정했다. 공통 인라인 문구 렌더러가 문제·힌트·해설·학습 문구의 명시적 줄바꿈도 유지한다.
- 내부 브라우저에서 FastAPI 긴 제목, JavaScript 예제 `[[2,3,4]]`, AI 문제의 세금 계산기·스팸 분류기 설명이 각각 분리되어 보이는 것을 확인했다. `npm run build` 통과. 전체 검사나 문제 전수 재검수는 반복하지 않았다.

## 2026-10-30 JavaScript W1–W4 학습 순서 보정

- 기존 JavaScript W1–W3의 사실·정답 검수 기록을 재사용하고 학습 순서만 다시 확인했다. W1에서 문자열 템플릿과 함수형 수선 문제가 나오고, W2에서 `trim`·`Boolean()`이 앞서며, W3에서 함수·`reduce`가 관련 주차보다 먼저 등장하는 흐름을 확인했다. W4 함수 기초의 기존 정확성 검수는 다시 열지 않았다.
- W1은 변수·값·문자열 연결, W2는 비교·논리·조건, W3은 반복·배열 순회·누적에 맞게 일일 목표·설명·예제·문제를 조정했다. 세 주차의 예제 15개는 실제 실행 출력과 대조했다. 문제는 개념 확인, 코드 읽기, 오류 찾기, 코드 작성이 이어지도록 구성했다. W1–W3 초반 문법만 쓰는 코드 수정 연습 6개를 남겼으며, 정적 코드 채점은 실행기가 아니므로 안내에 실행 채점이 아님을 표시했다.
- 의미가 달라진 문항은 새 ID를 발급하고 이전 ID 별칭을 보존했다. 검사에서 45개 현행 연습의 정답·채점 경로, 여섯 코드 수정 문제의 정답 제출, 변경된 과거 진도 ID 연결을 확인했다.
- 표적 검사 `tests/javascript-react-quality.test.js`, `tests/g10-javascript-curriculum-quality.test.js`, `tests/content.test.js` 95/95 통과. `npm run build` 통과. 전체 회귀는 이 묶음에서 반복하지 않았다. 화면 레이아웃 변경이 없어 내부 브라우저 확인은 필요하지 않았다.
- JavaScript W1–W4 태스크를 닫고 다음 미확인 범위 JavaScript W5–W8로 이동한다. 전체 콘텐츠 품질 감사는 계속 진행 중이며 공개 배포하지 않았다.

## 2026-10-30 JavaScript W5–W8 학습 흐름 보정

- 기존 JavaScript W4–W6 및 W7–W9의 사실·정답 검수 기록을 재사용했다. 이번 범위에서 새로 학습 순서를 확인하고 예제·문제 연결의 흐름만 살폈다.
- W6 D2 선택적 속성 예제와 질문이 아직 다루지 않은 `trim()`·`??`를 먼저 보여 주고 있었다. 이미 배운 `||`와 선택적 `length` 접근으로 바꾸고, 영향받는 오류 찾기·실행 추적 문항은 새 ID로 발행해 이전 ID 별칭을 연결했다.
- W8 과정 대표 예제와 D1–D2는 named export/import 및 별칭을 가르치면서 `await import(data:)`와 객체 구조 분해를 실제 import 예제처럼 보여 주고 있었다. 세 예제와 D2 오류 찾기를 `format.mjs`·`main.mjs` 두 파일의 정적 import로 맞췄다. 표적 검사에서 과정 개요와 일일 예제를 Node 하위 프로세스로 실제 실행해 `JavaScript`·`JS` 출력을 확인하고, 틀린 default import가 실패하는 것도 확인했다.
- W8 D5 예제에 정상 제목·공백 제목·숫자 입력의 기대 결과를 비교하는 회귀 사례를 넣어, 각 사례가 `통과`인지 직접 확인할 수 있게 했다. 함수 구현 문제와 출력 추적 문제는 유지했다.
- JavaScript W5–W8의 일일 예제 20개와 연습 60개의 채점 경로를 검사하고, 수정된 문항의 ID 연결·모듈 예제·오류 사례를 확인했다. `tests/javascript-react-quality.test.js`, `tests/g10-javascript-curriculum-quality.test.js`, `tests/content.test.js` 95/95 통과. `npm run build` 통과. 전체 회귀는 반복하지 않았다.
- JavaScript W5–W8 태스크를 닫고 JavaScript W9–W12로 이동한다. 이 기록은 W5–W8 기존 정답 검수를 다시 수행했다는 뜻이 아니며 전체 CQ 완료를 의미하지 않는다. 공개 배포하지 않았다.

## 2026-10-30 JavaScript W9–W12 학습 순서·DOM 실습 보완

- W9–W12 하루별 목표·예제·문제 연결을 다시 확인했다. W10–W12의 응답 상태·네트워크 실패·요청 취소, 이벤트 루프, 통합 과제의 사실·정답 검수는 기존 W10–W12 감사 기록을 재사용하고 주제 진행 순서를 확인했다.
- W9 D1 `submit 기본 동작 막기`에 기존 `js-dom-input-value` 문제가 끼어 있어 첫날 설명과 어긋났다. 저장 기록을 잇는 문제 ID는 그대로 두고 이 문제를 입력 요소를 다루는 D4로 이동했다. D4의 생성 문제 선택도 조정해 기존 코드 수정 연습이 빠지지 않도록 했다.
- W9 D1·D3–D5의 일반 객체 모형을 실제 `document.querySelector`, 폼의 `requestSubmit`, `input.value`, `textContent` 흐름으로 교체했다. 입력 정규화는 순수 함수로 남기고, 빈 제목과 태그 모양의 입력도 함께 보여 주도록 통합 예제를 구성했다. Node 검사에는 DOM 요소와 submit 이벤트의 필요한 동작만 모형으로 제공한다. 브라우저 자체 렌더링과 폼 검증을 실행한 것으로 주장하지 않는다.
- `tests/g10-javascript-curriculum-quality.test.js`, `tests/javascript-react-quality.test.js`, `tests/content.test.js` 표적 검사 95/95 통과. `npm run build`, `git diff --check`, 변경 파일 공백 검사가 통과했다. 전체 프로젝트 회귀와 실제 브라우저 검사는 실행하지 않았다. W9–W12 태스크를 닫고 다음 순서인 W13–W16으로 이동한다. 전체 CQ 완료를 뜻하지 않으며 공개 배포하지 않았다.

## 2026-10-30 JavaScript W13–W16 학습 흐름 확인

- 기존 W13–W15 문자열·시간·컬렉션 및 W16–W18 이터레이터·클래스·prototype 사실 검수 기록을 재사용했다. 하루별 흐름은 영문 검색어 정규화와 유니코드 비교, 날짜의 시간대·경과 계산, Set·Map, 제너레이터의 지연 실행·종료 정리 순으로 연결된다. 예제와 문제 제목이 각 날짜의 목표를 따르고 이미 배운 함수·배열·객체 문법 위에서 진행되는지 확인했다. 새 내용 결함은 찾지 않았다.
- `tests/javascript-react-quality.test.js`에서 W13–W15, W16–W18, 고급 JavaScript 일일 학습 사례 표적 검사 3/3 통과. 코드 변경이 없어 빌드·전체 회귀는 실행하지 않았다. JavaScript W13–W16 태스크를 닫고 W17–W19로 이동한다. 이는 전체 CQ 완료가 아니며 공개 배포하지 않았다.

## 2026-10-30 JavaScript W25–W26 및 과정 종료 검토

- 기존 W25–W26 사실 검수 기록을 재사용하고 하루별 목표·예제·문제 흐름을 다시 대조했다. 보안 주차의 댓글·목록 예제와 캡스톤의 이어하기 링크는 설명에서 실제 DOM API를 말하면서 코드에서는 일반 객체 모형만 사용하고 있었다. W25 개요·D1·D5와 W26 D3을 `document.createElement`, `textContent`, `append`, `href`를 쓰는 브라우저 코드로 맞췄다. 이어하기 URL은 앞 주차에서 배운 허용 목록을 거쳐 내부 경로로 만들게 했다. 출력 추적·코드 수정 요구사항·검사 모형도 같은 동작을 확인하게 갱신했다. 문항의 정답 의미와 기존 ID는 유지했다.
- JavaScript 과정 종료 검토에서 W1–W26이 6개 단계에 연속 배치되고 총 390문항인 것을 확인했다. 값·조건·반복에서 함수·자료구조, 브라우저·비동기, 테스트·디버깅·성능, 저장·네트워크·동시 요청, 보안·캡스톤으로 이어진다. 기존 사실 검수와 과정 전체 예제·정답·채점 경로 검사로 대조해 새 콘텐츠 결함은 추가로 찾지 않았다.
- W25–W26 표적 검사 1/1, JavaScript/React·G10·콘텐츠 표적 검사 95/95, 콘텐츠 구조 검사 40/40, 진도·저장·ID 마이그레이션 검사 40/40, 경로 검사 2/2, `npm run build`, 수정 파일 `node --check`, `git diff --check`가 통과했다. `git diff --check`에는 작업 파일 전반의 LF→CRLF 안내만 출력됐다. 전체 프로젝트 회귀와 내부 브라우저 클릭 여정은 실행하지 않았다. DOM 검사는 Node용 최소 DOM 모형이며 브라우저 XSS나 키보드 동작을 검증한 것은 아니다.
- JavaScript W1–W26의 8개 범위 태스크와 과정 종료 검토를 닫았다. 전체 콘텐츠 감사는 계속 진행 중이며 이번 검수로 전체 CQ 완료율을 올리지 않았다. 공개 배포하지 않았다. 다음 범위는 Python W1–W4다.

## 2026-10-30 Python W1–W4 학습 흐름 확인

- 기존 Python W1–W3·W4–W6의 사실·정답 검수와 Python 3.12.10 실행 근거를 재사용했다. 변수와 자료형, 조건·분기, 반복·누적, 함수·인자·반환 순서로 이어지는지와 날짜별 목표·예제·문제의 연결을 확인했다. W2 D5의 `.strip()`은 해당 날에 설명되는 새 문자열 조작으로, 앞에서 알고 있어야 하는 전제처럼 쓰이지 않는다. 새 학습 흐름 결함은 찾지 않았다.
- `tests/content.test.js`, `tests/g10-python-curriculum-quality.test.js`의 Python W1–W4 관련 표적 검사 4/4 통과. 기존 사실 검수를 다시 전부 실행하지 않았으며 코드 변경·빌드·전체 회귀는 하지 않았다. Python W1–W4 태스크를 닫고 다음 순서 Python W5–W8로 이동한다. 전체 CQ 완료율을 올리지 않았고 공개 배포하지 않았다.

## 2026-10-30 Python W5–W8 학습 순서 보완

- 기존 Python W4–W6·W7–W9의 사실 검수와 Python 3.12.10 실제 실행 근거를 재사용해 날짜별 개념 흐름을 확인했다. W5 D5의 예제가 리스트·얕은 복사를 가르치면서 아직 배우지 않은 딕셔너리를 먼저 사용했다. 중첩 리스트로 바꾸어 얕은 복사와 필터 결과의 공유를 같은 흐름에서 보여 주도록 했다. W5 D5 코드 수정 문제는 제목이 얕은 복사를 요구한다고 했지만 실제 요구사항은 시간 기준 필터링뿐이었다. 제목을 수행할 작업에 맞추고 원본 목록을 바꾸지 않는 조건을 prompt에도 적었다.
- W5 D5 출력이 바뀌어 단답 문항을 v4로 발행했다. 이전 v2·v3 ID를 별칭으로 유지하고, 저장된 과거 답의 ID·초안·위치는 보존하면서 새 출력에 맞춰 정답 여부가 다시 계산되는지 회귀 검사를 추가했다. 객관식은 얕은 복사 개념과 정답 보기 ID·의미를 유지했다.
- `tests/content.test.js`, `tests/g10-python-4-6-curriculum-quality.test.js`, `tests/progress.test.js` 75/75, `tests/g10-python-7-9-curriculum-quality.test.js` 및 콘텐츠 검사 45/45 통과. W7–W8 fact/API 세부 내용은 기존 검수 근거를 재사용하고 실제 Python 3.12.10 예제·복구 경계 검사를 다시 실행했다. 전체 프로젝트 회귀·출시 빌드는 실행하지 않았다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다. 다음 순서는 Python W9–W12다.

## 2026-10-30 Python W9–W12 흐름·예제 보완

- 기존 Python 사실·정답 검수 근거를 재사용하고 W9–W12의 선수 개념과 날짜별 문제 연결을 다시 확인했다. W9 D1은 아직 다루지 않은 `yield` 제너레이터를 질문에 먼저 보여 줘 `iter`/`next`로 바꾸었다. W11 D5는 `square(4)`처럼 CPU 작업을 설명하기에 지나치게 짧은 예제를 `sum_squares(1_000_000)` 제출로 바꾸고, Future와 완료 결과의 차이 및 프로세스 시작·직렬화 비용을 설명했다. W12 D5 오류 찾기 제목은 평균이 아니라 완료율 계산을 가리키도록 수정했다.
- 출력이 달라진 W11 D5 추적 문제는 v4로 발행하고 이전 v2·v3 ID를 별칭으로 보존했다. 저장 답변을 새 기준으로 재채점하고 답변 원문·초안·마지막 위치를 새 ID로 연결하는 회귀 검사를 추가했다. W10–W12 출력 검사가 현재 ID가 아닌 과거 ID 접미사만 검사해 최신 문제를 건너뛰던 조건도 별칭 기반으로 고쳤다.
- 표적 검사 `tests/g10-python-7-9-curriculum-quality.test.js`, `tests/g10-python-10-12-curriculum-quality.test.js`, `tests/content.test.js`, `tests/progress.test.js` 82/82 통과. W9–W12 예제·오류 찾기·코드 수정 검사와 W11 D5의 ProcessPoolExecutor 파일 실행 결과를 확인했다. 전체 프로젝트 회귀·출시 빌드·내부 브라우저 확인은 실행하지 않았다. 계획의 11/117 범위 태스크를 닫고 Python W13–W16으로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.

## 2026-10-30 Python W13–W16 흐름·학습 예제 보완

- 기존 Python W13–W15 정확성 검수 근거를 재사용하고 하루별 목표·예제·오류 사례를 표적 검사로 다시 확인했다. W16은 다섯 날짜의 목표·도입이 모두 일반 문구였고 D2 `default_factory` 예제는 한 객체의 빈 목록만 출력해 인스턴스마다 독립 목록이 생성되는 점을 보여 주지 못했다. 날짜별 목표·도입으로 바꾸고 두 객체를 만들어 첫 목록만 수정해 두 번째 목록이 그대로 비어 있는 결과를 보여 준다.
- 변경된 W16 D2 출력 문항은 v3 ID로 발행하고 기존 base·v2 ID를 별칭으로 보존했다. 저장 답은 새 출력 기준으로 재평가하고 원문·초안·마지막 위치를 보존하는 회귀 검사를 추가했다.
- 표적 검사 `tests/python-13-15-curriculum-quality.test.js`, `tests/python-spring-quality.test.js`, `tests/python-course-quality.test.js`, `tests/content.test.js`, `tests/progress.test.js` 94/94 통과. W13–W15 예제 15개와 W16의 새 default_factory 예제를 Python 3.12.10에서 실행했다. 전체 프로젝트 회귀·출시 빌드·브라우저 확인은 실행하지 않았다. 계획의 12/117 범위 태스크를 닫고 Python W17–W19로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.

## 2026-10-30 Python W17–W19 테스트·디버깅 흐름 보완

- 기존 W16–W18 테스트·디버깅 사실 검수와 W19–W21 자료구조·성능 검수 및 공식 문서 대조 기록을 재사용했다. 새로 확인한 W17–W18 다섯 날짜의 일반 목표·도입은 테스트와 오류 진단의 실제 과제에 맞춰 썼다. W18 D1은 오류 이름을 정적인 기록으로 적는 데서 그치지 않고, 잘못된 UTF-8 바이트를 실제로 디코딩해 `UnicodeDecodeError`를 만들고 입력·환경·조작·예상·실제 결과를 기록하게 했다. W18 D4의 원인 설명도 코드가 실제로 전달하는 `ValueError`에 맞췄다.
- W16 D5, W17 D5, W18 D5의 자동 생성 제목은 주제명이 중복됐고 W19 D5 제목은 실제 수리 작업보다 길었다. 명시 제목을 지원해 네 코드 수정 문제를 각각 `CourseId` 불변 데이터클래스, 빈 목록 합계 기대값, `None` 경계 처리, `timeit` 실행 시간 반환으로 알아보기 쉽게 했다. 문제 본문·정답 의미·저장 ID는 바꾸지 않았다.
- 기존 W16–W18 및 W19–W21 예제·문제 검수는 다시 전부 수행하지 않았다. W17–W19 예제 15개는 Python 3.12.10에서 실행해 각 추적 답과 일치함을 확인했다. `tests/python-course-quality.test.js`, `tests/python-spring-quality.test.js`, `tests/content.test.js`, `tests/progress.test.js` 93/93 통과. 전체 프로젝트 회귀·출시 빌드는 Python 과정 종료 확인에서 실행한다. 계획의 13/117 범위 태스크를 닫고 Python W20–W21로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.

## 2026-10-30 Python W20–W21 API·동시성 설명 보완

- 기존 W19–W21 정확성 검수, Python 3.12.10에서 15개 예제와 ProcessPoolExecutor를 실행한 기록, Python 3.15 공식 문서·RFC 대조를 재사용했다. 새로 확인한 공통 결함은 W13–W26의 주차 도입이 같은 일반 문장이었다는 점이다. 14개 도입을 각각 문자열·날짜·파일·데이터클래스, 테스트·디버깅·성능, HTTP·동시성, CLI·저장·리팩터링·프로젝트 설계 주제로 바꿨다.
- W21 D4에는 내부 검수 진행 상황을 가리키는 문구가 학습자 화면에 노출되고 있었다. 이를 제거하고 모듈 최상위 작업 함수, `__main__` 가드, 짧은 작업에서 프로세스 시작·데이터 전달 비용이 더 클 수 있다는 사용 조건으로 설명했다. 이 최소 예제의 출력만으로 속도 향상을 주장하지 않는다. W20–W21 문제·정답·예제는 바꾸지 않았다.
- `tests/python-course-quality.test.js`, `tests/python-spring-quality.test.js`, `tests/content.test.js`, `tests/progress.test.js` 94/94 통과. 이번 변경은 주차 소개와 사용자용 설명만 바꿔 기존 예제 실행 기록을 재사용했다. 전체 프로젝트 회귀·출시 빌드는 Python 과정 종료 확인에서 실행한다. 계획의 14/117 범위 태스크를 닫고 Python W22–W24로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.

## 2026-10-30 Python W22–W24 저장·도구 학습 흐름 확인

- 기존 W22–W24의 CLI 인자·출력 채널·종료 코드, JSON 자료형 검증·임시 파일 교체·버전 백업, 오류 복구 보고와 리팩터링·의존성 주입 사실 검수 및 Python 3.12.10 예제 15/15 실행 근거를 재사용했다. 새로 확인한 주차 소개는 각각 명령행 도구, 저장 데이터 복구, 함수 경계와 코드 리뷰를 가리킨다. 하루별 예제·문제 제목과 연결된 지식 흐름을 대조했으며 추가 결함은 찾지 않았다.
- `tests/python-course-quality.test.js`, `tests/python-spring-quality.test.js`, `tests/content.test.js`, `tests/progress.test.js` 94/94 통과. 기존 사실·예제 실행 검수를 반복하지 않았다. 전체 회귀·출시 빌드는 Python 과정 종료 확인에서 실행한다. 계획의 15/117 범위 태스크를 닫고 Python W25–W26 및 과정 종료 확인으로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.

## 2026-10-30 Python W25–W26 및 과정 종료 검토

- 기존 W25–W26 요구사항 분해·경계 검증·복구·회귀·측정·CLI·4주 계획의 사실·정답 검수와 Python 3.12.10 예제 10개·코드 수정 사례 실행 기록을 재사용했다. W25 D1의 처리 단계가 영어 `read -> validate -> apply`로만 보여 한국어 `읽기 -> 검증 -> 적용`으로 바꿨다. trace는 v4로 발행하고 이전 ID를 연결해 과거 영어 답이 오답으로 재평가되면서 답 원문·초안·마지막 위치는 보존되는지 검사했다. W25 D5 제목은 실제 동작에 맞춰 `배포 전 점검`으로 고쳤고 W26 4주 복습 계획의 항목도 한국어로 작성했다. 코드 수정 문제 제목은 W21·W23·W25·W26에서 반복되는 말을 걷어내 실제 수정 작업을 드러냈다.
- 과정 종료 기준에서 Python 26주·390문항·6개 단계 구성, 기초→자료구조→함수·클래스·표준 라이브러리→테스트·디버깅·성능→API·동시성→CLI·저장·리팩터링·프로젝트 계획 흐름을 확인했다. 수정된 W25 D1 예제를 Python 3.12.10에서 실행했다. 이전 단계의 예제 실행과 공식 문서 대조는 각 배치의 기록을 재사용했다.
- Python 전용·공통 콘텐츠·진도 표적 검사 9개 파일 120/120 통과, `npm run build` 통과. 과거 미실행 기록 E-118에 해당하는 W11 D4 `asyncio.run(gather(...))`와 D5 Windows `ProcessPoolExecutor` 파일 예제를 Python 3.12.10에서 다시 실행했고 `tests/g10-python-10-12-curriculum-quality.test.js` 6/6, 건너뜀 0건으로 출력이 등록된 답과 일치함을 확인했다. 전체 `npm test`와 `npm run check:release`는 전체 12개 트랙 통합 시점에 실행하며 브라우저 검사는 이번 콘텐츠 수정에 해당하지 않아 하지 않았다. Python W1–W26 범위 8개와 과정 종료 검토를 닫고 AI·LLM W1–W3으로 이동한다. 전체 CQ 완료율은 그대로이며 공개 배포하지 않았다.
## 2026-11-02 React W1–W26 과정 종료 검토

- W1–W12의 상세 질문·예제·답 검수와 W13–W26의 104개 단답 검수는 기존 2026-10-30 감사 기록을 재사용했다. 이번에는 현재 연결된 전체 과정의 순서·주제·날짜 목표와 노출되는 자동 생성 문구를 확인했다.
- W13–W26에서 화면 제목에 `n주차`가 이미 주차 안내에 있는데 제목에도 반복됐다. 제목에는 주제만 남겼다. 모든 주차에 똑같이 붙던 무관한 소개와 요점 3개, 날짜별로 되풀이되던 “최소 사례”, “대표 입력·실패·수정 전후” 문장은 화면에서 제거했다. 빈 소개는 문단 자체를 렌더링하지 않도록 했다.
- 70개 날짜 목표를 각 문항의 실제 주제에 맞는 자연스러운 해요체로 정리했다. 자동 생성 문항의 `핵심 개념을 읽으며`, `주간 복습에서` 같은 불필요한 앞머리와 선택지의 일반적인 조사 결합 오류·React 흐름과 무관한 수리 해설을 고쳤다. 질문의 의미, 정답, 보기, 코드, 390개 문항 ID는 바꾸지 않았다.
- 과정 전역 수치: 26주·6단계·130일·390문항, 고유 문항 ID 390개, 질문 문구 중복 0개. React 전용/JavaScript 품질 검사 47/47, `npm run build`, 변경 JavaScript·테스트 구문 검사 통과. 새 문구 회귀는 기존 상태에서 실패하는 것을 확인한 뒤 수정 후 통과했다. `git diff --check`는 오류 없이 끝났으며 CRLF 변환 안내만 있었다.
- React 19.3 및 ViewTransition의 안정판 주장은 React 공식 [19.3 릴리스 기록](https://react.dev/blog/2026/09/09/react-19-3)과 대조했다. 과정은 React DOM을 실제 렌더링하지 않는 정적 코드 읽기·개념 연습이므로 브라우저 렌더러 실행과 `npm run check:release`는 이번 범위에서 하지 않았다. 전체 `npm test`는 계획된 전체 통합 확인에 남기며 공개 배포하지 않았다.

## 2026-11-02 Next.js 33주 과정 재확인·화면 문구 정리

- W1–W33 기존 사실·정답 검수 기록과 주차별 검사 항목을 계획의 11개 범위 태스크에 연결해 재사용했다. 이번 변경 전용 검사는 먼저 추가해 이전 화면 문구와 버전 날짜에서 실패하는 것을 확인한 뒤 고쳤다.
- 사용자 화면에서 주차 번호가 상단 안내와 제목에 반복되고, 소개 문장이 아래 5일 학습 목록을 다시 나열했다. 날짜 설명 165개에도 목표를 되풀이하고 실행되지 않는다는 같은 안내를 붙이고 있었다. 숫자 접두사·중복 주차 소개·공통 요점은 제거했다. 날짜별 설명은 해당 주제의 구체적인 규칙으로 남기고, 실행 범위는 화면에 보이는 `Next.js 16.4.3 · 코드 읽기 과정` 표시와 과정 버전 안내에서 한 번만 밝힌다.
- 버전 안내는 2026-11-02 기준으로 갱신했다. [공식 릴리스 목록](https://github.com/vercel/next.js/releases)은 16.4.3을 최신 안정판, 16.5.0-canary를 시험판으로 표시한다. [지원 정책](https://nextjs.org/support-policy)은 16.x를 Active LTS로 표시한다. 관련 공식 링크를 과정 출처에 추가했으며 과정의 코드 읽기·개념 확인 범위와 서버 미실행 경계는 유지했다.
- 종료 확인에서 33주·7단계·165일·495문항, 고유 ID 495개, 정규화 질문 문구 495개, 주차 제목 33개를 확인했다. 7단계는 App Router 기초 → 라우팅·화면 → 데이터·렌더링 → 서버 기능 → 품질·보안·성능 → 테스트·운영·장애 대응 → 정적 배포·실전 설계로 이어진다. 정답·오답 이유·힌트·해설·기존 ID는 변경하지 않았다.
- `node --test tests/nextjs-curriculum-quality.test.js` 17/17 통과, `npm run build` 통과, 수정한 두 과정 파일과 전용 검사 파일의 `node --check` 통과. 사이트 전체 회귀 및 출시 검사는 마지막 전체 트랙 통합 단계에서 실행한다. 이 과정 자료는 정적 코드 읽기용이므로 Next.js 서버를 실행했다고 주장하지 않는다. UI 렌더 로직은 수정하지 않았고 공개 배포하지 않았다.
- 계획의 Next.js W1–W33 11개 범위 태스크와 과정 종료 확인을 완료했다. 전체 계획은 53/117 범위 태스크·6/12 과정 종료 확인이며 다음 범위는 FastAPI W1–W4다.
## FastAPI 30주 이어가기 계획

- 기존 30주 사실·정답 검수와 FastAPI 예제·문제 실행 기록을 다시 사용한다. 새 근거 없이 정답 검수를 처음부터 반복하지 않는다.
- 새로 확인된 결함은 문서의 안정판 정보가 FastAPI 0.143.4에 머물러 있고, 30주 요점에 주제와 무관한 같은 문장 `작은 계약을 직접 적고 공개 테스트로 확인해요.`가 매주 붙는 것이다.
- 공식 릴리스 기록을 기준으로 문서 버전·확인 날짜와 W29 버전 문항, 50개 코딩 문제 출처를 함께 갱신한다. 검증된 브라우저 실행기 FastAPI 0.143.0은 그대로 두고 문서 최신판과 구분한다.
- 수정 전 전용 검사를 추가해 이전 버전과 반복 문장이 걸리는지 확인한다. 수정 후 FastAPI 과정 검사, 코딩 문제 품질 검사, 관련 콘텐츠 메타데이터 검사, 빌드와 구문·공백 검사를 수행한다.
- 과정 종료 기준으로 30주·150일·450문항·고유 ID·중복 질문·6단계 흐름을 확인하고, 표적 증거를 재사용한다. 전체 `npm test`와 출시 검사는 12개 과정 통합 단계까지 미룬다.

### 2026-11-02 FastAPI W1–W30 완료와 과정 종료 확인

- FastAPI W1–W30을 계획의 11개 범위(W1–4, W5–7, W8–9, W10–12, W13–14, W15–17, W18–19, W20–22, W23–24, W25–27, W28–30)로 닫았다. 기존 상세 사실·정답 감사와 실행 기록을 재사용했고 전용 검사에서 날짜별 주제, 예제, 정답과 문제 흐름을 다시 대조했다.
- 새로 확인한 문제는 과정 요점 30곳에 주제와 무관한 문장이 반복된 점과 문서 기준 FastAPI 버전이 0.143.4에서 멈춘 점이다. 반복 문장을 빼고 요점은 주차별 규칙 두 개만 남겼다. 공식 [FastAPI 릴리스 노트](https://fastapi.tiangolo.com/release-notes/) 기준 0.162.0(2026-10-23 공개)을 2026-11-02 확인 정보로 반영했다. W29에는 체크하지 않은 HTML 체크박스가 제출에서 빠질 수 있으므로 `Form(False)`로 기본값을 명시하는 FastAPI 예제와 문항을 추가했다.
- W29 D1의 최신 버전 정답이 달라진 선택·단답·오류 찾기 문항은 v3 ID를 발행하고 원래 ID와 v2 ID를 별칭으로 연결했다. 과거 답은 새 ID에 연결되며 새 답 기준으로 다시 채점된다. W29 업그레이드 예제는 호환성·회귀 검사를 통과한 뒤 버전을 채택하라는 후보 버전 표기로 조정했다.
- 30주·150일·450문항, 고유 ID 450개, 정규화한 질문 450개, 검수 표시 주차 30개·6개 단계를 확인했다. `tests/fastapi-course-quality.test.js`, `tests/coding-problem-quality.test.js`, `tests/coding-problem-schema.test.js` 합계 44/44, `tests/content.test.js`의 공식 버전 출처 검사 1/1, `npm run build`, 수정 코드의 `node --check`가 통과했다. 사이트 실행기 0.143.0에서 새 버전의 폼 변경을 실행 검증하지 않았다.
- 초기 공통 콘텐츠 검사에서 FastAPI와 관계없는 React W13의 빈 소개 문구 가정과 React W19의 정답 보기 위치 검사가 실패했다. Next.js/FastAPI 버전 메타데이터 검사는 새 기준에 맞춰 통과한다. React 관련 두 실패는 최종 전체 트랙 통합 확인에 남긴다. 전체 회귀와 릴리스 검사는 반복하지 않았고 공개 배포하지 않았다.
- 범위 태스크 54–64와 FastAPI 과정 종료 확인을 완료했다. 누적 상태는 64/117 범위, 7/12 과정 종료 확인이며 다음은 Java W1–W4다.

## 2026-11-02 Java W1–W26 과정 종료 확인

- Java W1–W26의 기존 사실·정답·예제 검수 기록을 재사용하고, 전체 주차 순서와 학습 화면에 노출되는 소개·요점·제목을 다시 확인했다. 기존 390문항의 질문·정답·ID는 바꾸지 않았다.
- W1–W12 소개가 목표와 5일 제목을 되풀이하던 문구를 걷어내고 26개 소개를 각 주차의 핵심 규칙과 실무 맥락을 설명하도록 고쳤다. 26주에 반복되던 일반 요점 세 문장은 없앴다. W13–W26 제목에서 상단 주차 안내와 겹치는 주차 번호를 제거하고, 부정확한 조사 표현도 바로잡았다.
- Oracle 공식 [지원 로드맵](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)에서 Java 25가 LTS이고 Java 27이 비-LTS임을, [JDK 27 릴리스 노트](https://www.oracle.com/java/technologies/javase/27all-relnotes.html)에서 2026년 10월 업데이트를 확인했다. 수업 기준은 Java SE 25 LTS로 유지하고 검토 날짜를 2026-11-02로 갱신했다.
- 전체 구성은 26주·6단계·130일·390문항이며 고유 ID 390개, 서로 다른 질문 390개, 주차별 제목·소개 각각 26개를 확인했다. 남은 반복 요점 0개, 주차 접두사가 중복된 제목 0개다.
- `tests/java-curriculum-quality.test.js`와 `tests/g10-java-curriculum-quality.test.js` 47/47, `tests/content.test.js`의 버전·공식 출처 검사 1/1, `npm run build`, 변경 파일 `node --check`가 통과했다. `git diff --check`는 내용 오류 없이 종료됐고 기존 CRLF 변환 안내만 나왔다.
- 이번 세션의 시스템 Java는 8이어서 Java 25 런타임으로 새 예제를 실행하지 않았다. 기존 JDK 8·JDK 17 실행 결과는 앞선 날짜별 감사 기록의 범위 안에서만 재사용했다. 전체 `npm test`와 `npm run check:release`는 계획대로 전체 트랙 통합 때 실행하며 공개 배포하지 않았다.
- Java 범위 65–72와 과정 종료 확인 73을 마쳤다. 누적 상태는 72/117 범위, 8/12 과정 종료 확인이며 다음은 74번 Spring Boot W1–W3다.

## 2026-11-02 Spring Boot W1–W3 범위 완료

- 2026-10-15와 2026-10-28의 사실·정답·예제 검수 기록을 재사용했다. 이번에는 수업 화면의 흐름과 새로 드러난 소개 문구를 점검했으며, 기존 45문항의 정답·의미·ID는 변경하지 않았다.
- 15개 날짜 소개에 반복되던 같은 문장 틀과 실행 안내를 걷어내고, 각 날짜의 개념과 예제에 맞는 소개로 바꿨다. 실행 안내는 W1 주간 소개에 한 번만 남겼다. `@ConfigurationProperties` Bean 등록 방식과 `@Validated`·Jakarta Validation 구현체가 필요한 조건은 해당 수업 설명에 유지했다. W1–W3 주간 소개도 자연스러운 말투로 다듬었다.
- 공식 [Spring Boot 릴리스 목록](https://github.com/spring-projects/spring-boot/releases), [시스템 요구사항](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Framework 릴리스](https://github.com/spring-projects/spring-framework/releases), [Spring Security 릴리스](https://github.com/spring-projects/spring-security/releases), [외부 설정 문서](https://docs.spring.io/spring-boot/reference/features/external-config.html)를 대조했다. 2026-11-02 기준 Spring Boot 4.1.2는 안정판이고 4.2.0-RC1은 시험판이며, Boot 4.1.2는 Java 17–27과 Spring Framework 7.0.10 이상을 지원한다. 보안 참고 자료는 Spring Security 7.1.2 기준으로 확인하되, 실제 애플리케이션에서는 Spring Boot가 관리하는 호환 버전을 따라야 한다.
- 범위 구성은 3주·15일·45문항이며 기존 질문·정답·ID를 보존했다. 전체 과정은 26주·6단계·130일·390문항이고 고유 ID 390개, 중복 질문 0개다. 이번 변경으로 날짜별 소개는 각 주차마다 5개씩 서로 다르다.
- `tests/spring-curriculum-quality.test.js` 41/41, `tests/content.test.js`의 공식 버전 출처 검사 1/1, `npm run build`, 변경 JS·테스트 구문 검사, `git diff --check`가 통과했다. Spring 코드는 사이트에서 실행하는 앱이 아니므로 Spring 애플리케이션 컴파일·기동은 검증하지 않았다. 전체 `npm test`와 `npm run check:release`는 최종 통합 단계에 남겼으며 공개 배포하지 않았다.
- 범위 태스크 74를 마쳤다. 누적은 73/117 범위·8/12 과정 종료 확인이며 다음은 75번 Spring Boot W4–W6, 남은 범위는 44개다.

## 2026-11-02 Spring Boot 전체 과정 종료 확인

- W4–W26의 2026-10-29 주차별 감사를 다시 대조했다. W4–W6은 경로 매개변수와 요청 검증, 오류 응답에 실제 표시된 결함 줄과 안전한 공개 오류 형태가 맞는지 확인했다. W7–W9는 트랜잭션과 외부 효과, 프록시 경계·보안·MVC 테스트 전제를 점검했다. W10–W26은 재시도·캐시·관측, 설정·조회 성능, 이벤트 중복 방지와 테스트 격리, JWT·CORS·CSRF·비동기 처리, 운영·배포·API 호환성의 문제·예제·해설을 기존 주차별 기록과 대조했다.
- 수업 화면은 제목 위에서 이미 주차 번호를 보여 주는데 W13–W26 제목에도 `13주차 ·`처럼 번호가 반복됐다. 실패하는 회귀 검사를 먼저 확인한 뒤 제목에서 번호 접두사만 제거했다. 주차 번호는 화면의 기존 위치에 남고 문항 내용과 ID는 바꾸지 않았다.
- 전체 구성은 6단계·26주·130일·390문항이다. 모든 날짜에 세 문제씩 있고 고유 ID 390개, 중복 질문 0개다. 등록된 검수 주차는 1–26 전체이며, 단계 흐름은 객체·설정 기초 → 웹 API → 데이터·보안 → 확장·운영 → 신뢰성 → API 통합이다.
- `tests/spring-curriculum-quality.test.js` 42/42, `tests/content.test.js`의 공식 버전·출처 검사 1/1, `npm run build`, 변경 파일 `node --check`, `git diff --check`가 통과했다. `git diff --check`는 내용 오류 없이 끝났으며 저장소의 기존 LF→CRLF 안내만 출력했다. Spring 개념 코드는 실제 Spring 앱으로 컴파일·기동하지 않았다. 전체 `npm test`와 `npm run check:release`는 최종 통합 때 실행하고 공개 배포하지 않았다.
- 범위 태스크 74–82와 Spring 과정 종료 확인 83을 마쳤다. 누적은 81/117 범위·9/12 과정 종료 확인이며, 남은 범위는 36개·다른 과정 종료 확인은 3개다.

## 2026-11-02 Kotlin·Android W1–W31 과정 종료 확인

- 2026-10-15~28에 남긴 Kotlin W1–W31의 사실·정답·예제 검수 기록을 범위별로 다시 대조했다. 새 오류가 확인되지 않은 문항은 불필요하게 다시 쓰지 않았다.
- 공통 수업 화면에서 제목 위에 주차 번호가 표시되는 것을 확인하고, Kotlin 전체 31개 주차 제목에서 반복되는 주차 번호를 제거했다. 매주 똑같이 붙던 날짜 목록·실행 불가 안내도 주별 소개에서 감췄다. 주차 목표, 날짜별 학습 이름, 예제와 문제는 유지하고 실행 한계는 과정 버전 안내에 한 번만 남겼다.
- [Kotlin 공식 릴리스](https://kotlinlang.org/docs/releases.html)와 [Android 17 공식 발표](https://developer.android.com/blog/posts/android-17-is-here)를 대조했다. 2026-11-02 기준 Kotlin 최신 안정판은 2.4.21이며 Android 17(API 37)은 정식 출시됐다. 과정 메타데이터의 검토 날짜를 갱신했다.
- 구성은 6단계·31주·155일·465문항이다. 465개 ID와 질문이 모두 고유하며 전 주차가 검수 대상으로 등록돼 있다.
- `tests/kotlin-curriculum-quality.test.js` 17/17, 콘텐츠 표적 검사 2/2, `npm run build`, 변경 파일 구문 검사, `git diff --check`가 통과했다. 전체 `tests/content.test.js`는 39/40으로, Kotlin과 무관한 `react-w19-d1-concept` 선택지 해설 중복 검사에서 1건 실패했다. 해당 React 문제는 이번 범위에서 수정하지 않았다.
- Kotlin 컴파일러·Android SDK·에뮬레이터를 이용한 앱 컴파일이나 기기 실행은 하지 않았다. 전체 `npm test`와 `npm run check:release`는 모든 트랙을 마친 뒤 최종 통합 단계에서 진행하며 공개 배포하지 않았다.
- 언어별 태스크 84–94와 Kotlin 과정 종료 확인 95를 완료했다. 누적은 92/117 범위·10/12 과정 종료 확인이며 다음은 96번 C#·.NET W1–W3다. 남은 범위는 25개, 과정 종료 확인은 2개다.

## 2026-11-02 C#·.NET W1–W35 과정 종료 확인

- 2026-10-15~29에 남긴 W1–W35 문항·예제별 감사 기록을 다시 대조했다. 초기 값·흐름부터 자료구조, 객체 계약, 비동기, 웹 요청, 권한·데이터 경계, 운영·복구 캡스톤까지 35주 흐름과 기존에 수정된 결함의 반영 상태를 확인했다. 문항 정답과 코드 예제는 새 오류 근거가 없는 한 다시 바꾸지 않았다.
- 공통 수업 화면에서 제목 위에 주차 번호를 표시하므로 35개 제목에 중복된 번호를 뺐다. 모든 주차에 똑같이 붙던 다섯 날짜 목록과 세 가지 요점, 날짜 소개의 실행 한계 반복, 결과 추적 질문의 같은 안내 문장을 제거했다. 각 주차 목표와 하루별 고유한 규칙 설명·예제·문제는 보존했다. 실행 범위 안내는 과정 출처/버전 정보와 트랙의 `코드 읽기·설계 판단` 표시에서 확인할 수 있다.
- Microsoft 공식 자료를 2026-11-02 기준으로 재확인했다. [C# 언어 버전 표](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-versioning)는 .NET 10에서 C# 14를 기본으로 정하고, [.NET 10 다운로드](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)와 [지원 정책](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)은 10.0.14를 최신 LTS 패치, SDK 10.0.403을 최신 SDK로 표시한다. [.NET 11 RC3](https://github.com/dotnet/core/blob/main/release-notes/11.0/preview/rc3/11.0.0-rc.3.md)는 정식 출시 전 상태다. [EF Core 11 문서](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/whatsnew)는 EF11을 개발 중으로 표시하며, [EF Core 10 문서](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew)는 .NET 10을 요구하는 LTS 버전임을 명시한다.
- 과정은 6단계·35주·175일·525문항이다. ID 525개와 질문 525개가 모두 고유하고 전 주차가 검수 등록돼 있다.
- `tests/csharp-curriculum-quality.test.js`와 `tests/csharp-example-syntax.test.js` 24/24, `npm run build`, 변경 파일의 구문 검사, `git diff --check`가 통과했다. 예제 172개의 C# 컴파일·출력 검증은 기존 W1–W35 감사에서 .NET SDK 10.0.400으로 완료한 기록을 재사용했다. 이번에는 ASP.NET 앱·실제 데이터베이스를 실행하지 않았다.
- 언어별 태스크 96–108과 C# 과정 종료 확인 109를 마쳤다. 누적은 105/117 범위·11/12 과정 종료 확인이며 다음은 110번 SQL·PostgreSQL W1–W4다. 남은 범위는 12개, 과정 종료 확인은 1개다. 이미 확인된 React W19 해설 중복 1건은 별도 미해결로 남는다. 전체 회귀와 출시 검사는 모든 트랙을 마친 뒤 진행하고 공개 배포하지 않았다.

## 2026-11-02 SQL·PostgreSQL W1–W39 및 과정 종료 확인

- 기존 W1–W39 사실·정답 감사와 50개 실행형 문제·300개 공개 사례의 PGlite 실행 기록을 범위별로 재사용했다. 이번에는 주차 목표·날짜별 초점·예제·질문·정답 연결, 과정 단계 순서와 고유 ID를 전체 카탈로그에서 대조했다. 새로 전수 실행한 `tests/postgresql-quality.test.js`는 23/23 통과했고, 195개 학습 SQL 예제와 코딩 문제 300개 공개 사례가 PGlite / PostgreSQL 18.3에서 실행되어 기대 결과와 일치했다.
- 수업 화면에 이미 주차·일차가 표시되는 부분과 겹치는 번호를 제목에서 제거했다. 같은 날짜 목록을 되풀이하던 소개·요점은 숨겼고, 날짜별로 반복되던 내부 회귀 검증 문구는 실제 학습에 필요한 입력 설명만 남겼다. 문항 ID·정답은 바꾸지 않았다.
- [PostgreSQL 지원 버전 정책](https://www.postgresql.org/support/versioning/), [PostgreSQL 18.6 릴리스 노트](https://www.postgresql.org/docs/18/release-18-6.html), [PostgreSQL 19 RC 1 발표](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/), [PGlite 공식 npm 패키지](https://www.npmjs.com/package/%40electric-sql/pglite)를 대조했다. 2026-11-02 기준 18.6은 안정판, 19 RC 1은 시험판이며 PGlite 0.5.14가 최신 공개판이다. 사이트 실행기 0.5.8 / PostgreSQL 18.3은 그대로 유지했고 과정의 버전 안내에 차이를 명시했다.
- 과정은 6단계·39주·195일·585문항이다. 모든 주차가 검수 목록에 있고 문항 ID 585개가 고유하다. 50개 SQL 문제와 300개 공개 실행 사례의 기존 정확성 검수 기록은 유지했다.

## 2026-11-02 최종 통합 검사

- 모든 과정의 범위 117/117과 과정 종료 확인 12/12를 닫았다. 12개 트랙은 351주·1,755일·5,265문항이며, 각 과정의 하루 세 문제·고유 ID·단계 순서를 과정별 검사와 기존 감사 기록으로 확인했다. 과정별 이전 사실·정답 검수는 근거가 남은 기록을 재사용했고 새 결함을 발견한 범위만 수정했다.
- 통합 중 React W19–W26 선택지 40개에 같은 일반 오답 설명이 반복되는 문제를 고쳤다. 각 선택지가 왜 맞거나 틀리는지 내용에 맞춰 설명한다. 오래된 회귀 기대값은 현재 과정 문구·메뉴 동작과 맞추고, 별도 기능 변경은 하지 않았다.
- 전체 `npm test` 530/530 통과. `npm run check:release` 통과: 정적 파일 153개, 최대 9.621 MiB, same-origin 연결, 실행기 격리 정책, 서버·개발 파일과 학습자 데이터 미포함을 확인했다. 변경 JS·검사 파일 구문 확인과 `git diff --check`도 통과했다.
- 답안을 제출하거나 기존 진도를 바꾸지 않았다. 저장·이어하기·백업·복원·실패 저장·오래된 탭 보호는 `tests/progress.test.js`와 `tests/design.test.js`의 기존 회귀 검사로 확인했다. SQL 실행기는 고정 PGlite 0.5.8 / PostgreSQL 18.3이며 바꾸지 않았다. 공개 배포하지 않았다.

## 2026-11-09 내부 브라우저 확인

- 내부 브라우저에서 SQL·PostgreSQL 과정 → 1단계 → 1주차 수업으로 이동해 제목·예제·일일 문제 흐름과 공식 문서 접힘 상태를 확인했다. 390px 화면에서 문서 너비 375px, 뷰포트 390px로 가로 넘침이 없었고 키보드 Tab 초점도 이동했다. 수업의 긴 SQL 줄은 코드 영역 안에서 가로로 스크롤되며 페이지 자체는 잘리지 않았다. 화면을 확인한 뒤 기본 폭으로 되돌렸다.
