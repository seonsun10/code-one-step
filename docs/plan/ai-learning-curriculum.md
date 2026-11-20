# AI·LLM 학습 과정 계획

## 목표

AI가 어떤 문제를 풀 수 있는지 판단하고, 머신러닝·딥러닝·대규모 언어 모델의 핵심 원리를 이해하며, 결과를 검증하고 안전하게 업무에 적용할 수 있는 27주 학습 경로를 제공한다.

## 현재 상태

- 2026-11-02 W1–W27의 순차 학습 흐름과 과정 종료 조건을 다시 확인했다. 27주·135회·405문항·6단계와 문항 ID 중복 없음을 확인했다. W7·W8·W9·W13의 설명 연결을 보완하고 W24–W27의 반복 활동 안내 20개를 주제별 가상 연습으로 바꿨다. 2026-10-28 사실·정답 검수는 재사용했으며 이번에는 전체 테스트를 반복하지 않았다. 빌드 통과. 상세: [콘텐츠 품질 감사](content-quality-audit.md).
- 과정은 로컬 사이트의 학습 경로와 주제별 화면에 연결되어 있다. 전체 27주·135회·405문항의 구성·채점 연결·화면 진입을 자동 검사했다.
- 내용 검수를 마쳤다. W1–W27의 전체 135일·405문항에 대해 예제, 질문, 정답, 오답 선택지와 피드백을 대조했다. 반복 해설·한국어 조사·퍼셉트론의 편향 조건·어텐션 계산·장애 시 사용자 안내를 보완했다. 이는 이 AI 과정에 한정된 편집 검수이며 다른 학습 트랙의 전체 감사 완료를 뜻하지 않는다.
- W19–W23의 반복적인 일반 안내를 문서 요약, 구조화 출력, 도구 권한, 자료 검색, 방법 비교, 이미지·음성 확인 등 25개의 선택 실습으로 구체화했다. 각 실습에 가상 입력과 결과 확인 기준을 넣었다. AI 도구가 있으면 직접 요청해 볼 수 있고, 도구 없이도 같은 사례를 검토할 수 있으며 개인정보·기밀 입력은 요구하지 않는다.
- 전체 테스트 437/437, 빌드, 152개 파일·최대 9.621 MiB 정적 릴리스 검사가 통과했다. 브라우저에서 W22·W23 학습 화면을 확인했다. 공개 사이트에는 배포하지 않았다.

## 대상과 경계

- 코딩 경험이 없어도 시작할 수 있다. 수학은 평균·비율·확률·벡터를 예제와 함께 설명하고, 미적분 기호를 외우게 하지 않는다.
- 이 사이트 안에서 외부 모델 API를 호출하거나 사용자의 프롬프트·문서·답안을 AI 서비스에 보내지 않는다.
- 실제 모델을 써 보는 활동은 학습자가 선택한 도구에서 직접 해 보는 선택 과제다. 비공개 문서·개인정보·회사 자료를 입력하지 않도록 안내한다.
- 특정 회사의 모델, API, 가격, 최신 성능 순위에 과정 내용을 묶지 않는다. 플랫폼 기능 설명은 독립된 개념으로 가르치고 바뀌는 세부 기능은 공식 문서를 참고 자료로 연결한다.
- 모든 예제는 교육용 정적 사례이며 모델을 실행하거나 성능을 측정한 것처럼 표시하지 않는다.

## 단계와 주차

| 단계 | 주차 | 다루는 내용 |
|---|---:|---|
| 1. AI와 데이터의 기초 | 1–5 | AI·머신러닝·생성형 AI, 문제 설정, 데이터와 편향, 확률·통계, 벡터·임베딩 직관 |
| 2. 머신러닝 핵심 이론 | 6–10 | 지도·비지도·강화 학습, 회귀·분류, 손실·경사 하강, 데이터 분리, 일반화·과적합, 기본 모델 선택 |
| 3. 신경망과 딥러닝 | 11–13 | 퍼셉트론, 층·활성화 함수, 역전파, 최적화, 임베딩, 순차 모델에서 Transformer로의 흐름 |
| 4. LLM 작동 원리 | 14–18 | 토큰, 문맥 창, 어텐션·Transformer, 다음 토큰 예측, 사전 학습·후속 조정, 생성 설정과 한계, 프롬프트 구성 |
| 5. AI 활용 방식 | 19–23 | 문서·업무 활용, 구조화된 출력과 도구 호출, 검색 결합 생성(RAG), 프롬프트·검색·미세 조정 선택, 이미지·음성 등 멀티모달 |
| 6. 품질·안전·실전 적용 | 24–27 | 평가 데이터와 기준, 환각·편향·보안·개인정보, 비용·속도·신뢰성, 사람 검토와 종합 적용 설계 |

주차마다 5일의 목표·설명·사례를 제공하고, 하루 세 문항으로 개념·적용·판단을 다룬다. 27주 동안 135회 학습일과 405문항을 제공한다. 마지막 주에는 해결할 업무, AI가 필요한 이유, 입력 자료, 실패 시 처리, 평가 기준과 사람의 검토 지점을 포함한 적용 계획을 만든다.

## 검증 기준

- 트랙에서 27주·135회 학습일·405문항·6단계가 맞고, 각 문항의 질문·정답·오답 설명이 서로 구분된다.
- 확률·평가지표·벡터 유사도·토큰/문맥·학습/추론 등 수치 및 용어 예제를 손으로 추적해 답과 대조한다.
- 외부 실행, 모델 호출, 계정, 유료 API, 데이터베이스, 사용자 콘텐츠 전송이 추가되지 않는다.
- 출처 목록은 기존 제품 규칙대로 접힌 상태로 제공한다.
- 자동 검사, 빌드, 릴리스 검사와 학습 목록·학습 단위의 화면 연결을 확인한다.

## 기준 자료

- Google for Developers, [Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course)
- Google for Developers, [Neural Networks](https://developers.google.com/machine-learning/crash-course/neural-networks)
- Google for Developers, [Introduction to Large Language Models](https://developers.google.com/machine-learning/crash-course/llm)
- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- Hugging Face, [LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- OpenAI, [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [Function calling](https://developers.openai.com/api/docs/guides/function-calling), [Retrieval](https://developers.openai.com/api/docs/guides/retrieval), [Model optimization](https://developers.openai.com/api/docs/guides/model-optimization), [Evals](https://developers.openai.com/api/docs/guides/evals)
- Google AI for Developers, [Image understanding](https://ai.google.dev/gemini-api/docs/image-understanding), [Audio understanding](https://ai.google.dev/gemini-api/docs/audio)
- NIST, [AI Risk Management Framework: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1)
- OWASP GenAI Security Project, [Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
