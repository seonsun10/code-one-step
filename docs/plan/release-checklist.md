# 무료 공개 배포 및 출시 점검 기록

최종 검토: 2026-10-10 (Asia/Seoul)

## 현재 공개 배포

Cloudflare Pages Git 연동으로 공개했다. 프로젝트 `code-one-step`은 `seonsun10/code-one-step`의 `main`을 감시하고, preset 없이 `npm run build`를 실행해 `dist/`를 배포한다. 실제 공개 주소는 [https://code-one-step.pages.dev/](https://code-one-step.pages.dev/)이며 2026-10-10에 배포 성공과 라이브 홈 화면을 확인했다. 서버 함수, 환경 변수, DB, 결제, 유료 기능은 구성하지 않았다. GitHub Issues 피드백 링크는 사이트에 표시되며 제보에는 GitHub 로그인이 필요하다고 안내한다.

Cloudflare 공식 문서의 현재 Pages 무료 한도는 동시 빌드 1개, 월 500회 빌드, 사이트별 파일 20,000개, 파일당 25 MiB다. Pages의 정적 파일 요청은 무료·무제한으로 문서화되어 있다. 이 한도와 약관은 바뀔 수 있으므로 출시 때 다시 확인하며, 무료 영구 보장을 약속하지 않는다. Pages Functions를 추가하면 Workers 무료 사용량에 포함되므로 초기에는 사용하지 않는다.

로컬 공개 전에는 `npm run check:release`를 실행한다. 이 명령은 정적 빌드를 새로 만들고, 필수 `index.html`/`_headers`, Pages 파일 수·크기 제한, 서버/개발 폴더, 환경 설정, 학습 백업 및 일반·선택적·peer runtime 패키지 의존성의 부재를 검사한다. 배포 산출물의 CSP를 직접 읽어 루트 경로 `/` 정책 존재, 정책 제거 규칙 부재, 명시적 `connect-src 'self'`/`'none'`, 외부 스크립트 출처 부재를 확인한다. 코드 실행기 경로 `/public/runner-frame.html`과 Cloudflare의 확장자 제거 경로 `/public/runner-frame`에는 각각 `connect-src 'none'`인 격리 CSP가 있는지 확인한다. 현재 Pages 한도는 공식 자료를 확인한 2026-10-10 기준이며, 한도가 달라지면 `scripts/audit-release.mjs`의 상수와 이 문서를 함께 갱신한다.

이 프로젝트는 앞으로 멤버십을 검토할 계획이 있다. 무료 Pages 후보는 지금의 광고·결제·서버 기능 없는 공개 교육용 초기에만 검토한다. 구독이나 상업 기능을 붙이기 전 Cloudflare 이용 조건과 서비스 적합성을 다시 확인하고 호스트 결정을 새로 기록한다.

Git 연동 프로젝트는 연결된 `main`의 새 커밋을 자동 빌드·배포한다. 실제 대시보드에서 배포 상태가 성공으로 표시되는 것을 확인했다. `gh`와 `wrangler` CLI는 설치하지 않았지만, Cloudflare 웹 대시보드에서 GitHub 연결과 프로젝트 생성을 완료했다. 현재 빌드 출력은 Cloudflare Pages에 맞춘 `_headers` 보안 헤더를 포함한다.

참고한 공식 자료:

- [Cloudflare Pages 무료 한도](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages 정적 파일 요금 및 한도](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Pages Git 연동과 Direct Upload 제한](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages 빌드 명령과 출력 폴더](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages 보안 헤더 파일](https://developers.cloudflare.com/pages/configuration/headers/)
- [GitHub Pages 이용 가능 저장소와 사이트 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages 사용 제한 및 SaaS 적합성](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## 배포 후 확인

2026-10-10에 공개 페이지를 열어 랜딩/홈 콘텐츠와 링크를 점검했다. 라이브 화면에서 다음을 확인했다.

- 다섯 트랙(JavaScript, Python, Java, Spring Boot, React)과 총 23개 단원 진도 표시
- 학습 이어하기, 전체 트랙, 트랙별 문제 링크, 오늘의 문제 링크
- 계정 없이 현재 브라우저에 기록을 저장한다는 설명과 학습 기록/백업 진입 링크
- GitHub Issues 피드백 링크와 GitHub 로그인이 필요하다는 접근 안내
- 기기 설정·밝게·어둡게 테마 선택

배포 후에는 `curl -I -L`로 코드 실행기의 `.html` 주소와 확장자 없는 최종 주소를 모두 확인하고, 최종 200 응답에도 `Content-Security-Policy`가 있으며 `connect-src 'none'`인지 검사한다. 앱 변경 배포 후에는 문제 풀이·로컬 진도 재개·백업 복원도 라이브 URL에서 스모크 점검한다.

## 피드백 경로

출시 후보는 이메일을 받지 않는 GitHub Issues다. 이 저장소의 `.github/ISSUE_TEMPLATE/`에 학습 내용 오류와 접근성·사용성 문제 양식을 준비했다. 양식은 개인 정보나 학습 백업 파일을 올리지 않도록 안내한다. Issues를 쓰려면 공개 이슈 저장소와 GitHub 계정이 필요하다. 소스 저장소를 비공개로 유지하려면 이 양식을 별도 공개 피드백 저장소로 옮긴다. 사용자가 로그인 없이 제보할 경로는 아직 선택하지 않았다.

앱 자체에는 이메일 입력, 분석 스크립트, 광고, 쿠키, 서버 기록 전송 기능이 없다. 브라우저 기록과 코드 초안은 기기 안에 남는다. 호스트는 정적 사이트 접속 요청을 처리하므로, 공개 전에 호스트의 최신 개인정보 및 보안 조건도 확인한다.

## 공개 배포 점검 체크리스트

- [x] 로컬 Git 저장소를 초기화하고 빌드 결과, OMX 실행 상태, 로컬 설정 및 학습 백업 파일을 제외한다.
- [x] 다음 콘텐츠 후보와 단원 공개 검수 기준을 기록한다([콘텐츠 로드맵](content-roadmap.md)).
- [x] 정적 파일만 빌드하고 API, DB, 계정, 코드 서버, 유료 SDK를 포함하지 않는다.
- [x] `dist/`에는 배포 파일만 포함하고 소스 관리용 문서, 테스트, 로컬 백업 파일을 넣지 않는다.
- [x] 앱 및 격리 실행 프레임의 CSP와 기본 보안 응답 헤더를 `_headers`로 준비한다.
- [x] 격리 실행 프레임의 `.html` 및 확장자 없는 실제 경로에 각각 CSP를 두고 배포 산출물 검사에 포함한다.
- [x] 콘텐츠 문제 및 접근성 문제를 위한 이메일 비수집 이슈 양식을 준비한다.
- [x] 현재 호스팅 후보의 무료 한도와 Git 연동 제약을 공식 자료로 확인한다.
- [x] 실제 `dist/` 산출물이 Pages 업로드 한도 안에 있고 서버 함수·환경 파일을 포함하지 않는지 검사한다(15개 파일, 최대 0.055 MiB, `_headers` 포함).
- [x] 로컬 실행 명령 `npm run check:release`로 위 산출물 경계 검사를 반복할 수 있도록 자동화한다.
- [x] 다섯 트랙의 23개 단원·세 단계 순서, 문제 풀이 데이터와 공식 버전 출처를 자동 검사한다.
- [x] 기기 설정/밝게/어둡게 표시 선택, 테마 저장, 대비와 모바일 핵심 화면을 확인한다.
- [x] 공개 소스 저장소와 함께 쓸 GitHub Issues 제보 경로를 학습 화면에 연결하고 로그인 필요를 알린다.
- [x] 최초 공개 직전에 공식 기술 버전·호환 범위를 다시 확인하고 문서 검토일을 갱신한다(2026-10-10).
- [x] 사용자가 공개 GitHub 저장소 `seonsun10/code-one-step`를 제공했다.
- [x] D-10 권고에 따라 Cloudflare Pages Git 연동을 선택하고 공개 저장소 `seonsun10/code-one-step`의 `main`을 연결했다.
- [x] Cloudflare Pages 프로젝트를 만들고 production branch, `npm run build`, `dist/`를 설정했다.
- [x] `https://code-one-step.pages.dev/`에서 배포된 사이트와 학습 홈 주요 흐름을 확인했다.
- [x] 공개 피드백 URL이 사이트에 연결되고, GitHub 로그인 필요 안내가 표시되는지 확인했다.
- [x] 사용자에게 브라우저 로컬 저장·계정 없음·기록 백업 진입을 공개 사이트에서 안내한다.
- [x] 서버, DB, 결제, 광고, 분석 수집기, 유료 기능 없이 공개했다.

공개 배포와 기본 홈 화면 점검을 완료했다. 후속 앱 변경에서 문제 풀이·백업/복원·모바일 실행을 라이브에서 다시 확인한다. 운영 중 발견된 오류·추가 도움 항목은 `docs/plan/decisions-and-help.md`에 기록한다.
