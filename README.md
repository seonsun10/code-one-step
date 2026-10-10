# Study Web

사람들이 프로그래밍 언어와 프레임워크를 배우고, 여러 유형의 문제를 풀며, 자신의 학습 진도를 이어갈 수 있는 학습 사이트를 만들기 위한 프로젝트입니다.

## 현재 상태

- G1–G7 구현·검증과 추가 교육과정 G9를 마쳤습니다. G8의 로컬 공개 준비는 완료했으며 실제 배포 URL과 피드백 저장소 연결은 외부 선택이 남아 있습니다. [진척 관리 문서](docs/plan/progress.md)와 [오류·도움 기록](docs/plan/decisions-and-help.md)을 확인하세요.
- JavaScript 5개, Python 5개, Java 5개, Spring Boot 4개, React 4개로 총 23개 학습 단원이 있습니다. 각 트랙은 3단계로 구성됩니다. [단계·버전·공식 출처](docs/plan/content-roadmap.md)
- 객관식, 주관식, 오류 줄 찾기, 코드 수정 문제를 제공합니다. JavaScript 문제는 브라우저에서 실행할 수 있습니다. Python·Java·프레임워크 코드는 현재 학습·분석용이며 사이트 안에서 실행하지 않습니다.
- 초기 버전은 모두가 무료로 이용할 수 있도록 설계합니다.
- 서버, 데이터베이스, 외부 AI API, 결제 연동 없이 시작합니다.
- 학습 진도는 사용자 기기의 브라우저에 저장하고, 내보내기·가져오기로 백업 및 복원을 지원합니다.
- 공개 학습 콘텐츠는 정적 사이트 파일로 제공됩니다. 개인의 진도·풀이 기록·코드 초안은 브라우저에만 저장됩니다. 같은 브라우저에서 재개하며, 다른 기기에서는 백업 파일을 직접 옮겨야 합니다.

## 로컬에서 실행

Node.js 18 이상이 설치된 환경에서 다음 명령을 사용할 수 있습니다. 런타임·개발 패키지 의존성은 없습니다.

```bash
npm run dev
npm test
npm run build
npm run check:release
npm run preview
```

`npm run dev`는 `http://127.0.0.1:4173`에서 앱을 열고, `npm run build`는 정적 사이트를 `dist/`에 만듭니다. `npm run check:release`는 다시 빌드한 뒤 비밀 설정·개발 파일·서버 함수·학습 백업이 배포 파일에 포함되지 않았는지와 호스트 파일 한도를 검사합니다.

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
