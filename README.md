# 코드한걸음 (Code One Step)

사람들이 프로그래밍 언어와 프레임워크를 배우고, 여러 유형의 문제를 풀며, 자신의 학습 진도를 이어갈 수 있는 학습 사이트를 만들기 위한 프로젝트입니다.

## 현재 상태

- 공개 사이트는 [Cloudflare Pages](https://code-one-step.pages.dev/)에서 이용할 수 있습니다. 2026-10-16 다시 확인한 공개 앱 카탈로그는 다섯 트랙의 23개 단원입니다. 현재 작업 폴더에는 이후 로컬 변경이 포함되어 있어 공개 화면과 다를 수 있습니다. 배포 상태와 근거는 [진척 관리](docs/plan/progress.md)와 [출시 점검 기록](docs/plan/release-checklist.md)을 확인하세요.
- 현재 작업 폴더에는 G10의 5단계·60개 단원·180개 문제와 기존 다섯 트랙 G11의 26주·650회 학습 세션·1,950개 연습이 있습니다. CP 추가 과정은 TypeScript 26주·390문항, PostgreSQL 39주·585문항, FastAPI 30주·450문항, Next.js 33주·495문항, Kotlin·Android 31주·465문항, C#·.NET 35주·525문항입니다. AI·LLM 기초와 활용 과정은 27주·405문항이며 전체 문항 검수를 완료했습니다. 이 과정은 외부 AI API를 호출하지 않습니다. 전체 로컬 목록은 12개 트랙·351주·5,265개 연습입니다. 과정별 총량을 기존 다섯 트랙 G11 수치에 합산하지 않습니다. 이 교육과정과 실행기 개선은 공개 사이트에 배포하지 않은 로컬 변경입니다. [단계·버전·공식 출처](docs/plan/content-roadmap.md)
- 로컬 앱에는 JavaScript·TypeScript·PostgreSQL·FastAPI의 자동 실행·결과 채점 문제를 각각 50개씩 제공합니다. TypeScript는 TypeScript 6.0.3으로 JavaScript에 변환하고 정적 타입 검사는 하지 않습니다. PostgreSQL 학습 기준은 18.6 안정판이며 브라우저에 포함한 PGlite 0.5.8 엔진은 PostgreSQL 18.3 기반입니다. SQL과 FastAPI는 Worker에서 실행하며 서버나 원격 DB에 접속하지 않습니다. Python·Java·React·Spring Boot·Next.js·Kotlin·Android·C#·.NET 과정은 코드 읽기·개념 연습용이며 사이트 안에서 코드나 앱을 실행하지 않습니다.
- 초기 버전은 모두가 무료로 이용할 수 있도록 설계합니다.
- 서버, 데이터베이스, 외부 AI API, 결제 연동 없이 시작합니다.
- 코드 편집기에는 MIT 라이선스 CodeMirror 6을 사용합니다. 공식 npm 레지스트리에서 잠금 파일에 따라 개발 도구로 설치하며, 사이트 배포 파일에는 편집기를 로컬 번들로 포함합니다. 실행 중 CDN이나 원격 편집기 서버에 접속하지 않습니다.
- 학습 진도는 사용자 기기의 브라우저에 저장하고, 내보내기·가져오기로 백업 및 복원을 지원합니다.
- 공개 학습 콘텐츠는 정적 사이트 파일로 제공됩니다. 개인의 진도·풀이 기록·코드 초안은 브라우저에만 저장됩니다. 같은 브라우저에서 재개하며, 다른 기기에서는 백업 파일을 직접 옮겨야 합니다.

## 로컬에서 실행

Node.js 18 이상이 설치된 환경에서 의존성을 한 번 설치한 뒤 다음 명령을 사용할 수 있습니다. 패키지는 로컬 개발·빌드에만 쓰며 정적 사이트 실행에는 서버 패키지나 API 의존성이 없습니다.

```bash
npm ci
npm run dev
npm test
npm run build
npm run check:release
npm run preview
```

`npm ci`는 `package-lock.json`에 고정된 공식 npm 패키지를 설치합니다. `npm run dev`는 사이트를 먼저 빌드하고 `http://127.0.0.1:4173`에서 엽니다. `npm run build`는 정적 사이트와 타사 라이선스 고지를 `dist/`에 만듭니다. `npm run check:release`는 다시 빌드한 뒤 비밀 설정·개발 파일·서버 함수·학습 백업이 배포 파일에 포함되지 않았는지, 원격 코드·스타일 출처가 없는지와 호스트 파일 한도를 검사합니다.

## 문서 안내

- [제품 원칙](docs/rules/product.md)
- [기술 및 구조 규칙](docs/rules/architecture.md)
- [코드 작성 규칙](docs/rules/coding.md)
- [디자인 규칙](docs/rules/design.md)
- [학습 콘텐츠 규칙](docs/rules/content.md)
- [개인정보 및 보안 규칙](docs/rules/privacy-security.md)
- [진척률 및 단계별 상태](docs/plan/progress.md)
- [결정 사항, 오류, 도움 요청](docs/plan/decisions-and-help.md)
- [무료 공개 및 출시 체크리스트](docs/plan/release-checklist.md)
- [단계별 콘텐츠·버전 로드맵](docs/plan/content-roadmap.md)
- [코딩 문제·공통 실무 기초 확장 계획](docs/plan/coding-practice-and-foundations.md)
- [코딩 문제·공통 실무 기초 실행 순서](.omx/plans/coding-practice-and-foundations.md)
- [전체 학습 콘텐츠 품질 감사·개선 계획](docs/plan/content-quality-audit.md)
- [AI 시대 학습 역량과 제품 재설계 계획](docs/plan/learning-platform-redesign.md)
- [GitHub 문제 제보](https://github.com/seonsun10/code-one-step/issues)
