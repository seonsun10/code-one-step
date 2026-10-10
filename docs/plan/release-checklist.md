# 무료 공개 준비 및 출시 체크리스트

최종 검토: 2026-10-10 (Asia/Seoul)

## 현재 배포 후보

Cloudflare Pages 무료 등급을 정적 호스팅 후보로 선택했다. 앱에 서버 기능이나 사용자 API가 필요하지 않으며, `npm run build`가 생성하는 `dist/`만 올린다. Git 연동을 쓰면 Cloudflare가 연결된 GitHub/GitLab 저장소의 변경을 자동 빌드·배포한다. 공개 GitHub 저장소 `seonsun10/code-one-step`를 사용하고, 원격 코드 푸시 및 Issues 경로 연결 상태는 아래 진척 기록과 함께 갱신한다. Cloudflare 계정 연결 전까지 공개 URL은 없다.

Cloudflare 공식 문서의 현재 Pages 무료 한도는 동시 빌드 1개, 월 500회 빌드, 사이트별 파일 20,000개, 파일당 25 MiB다. Pages의 정적 파일 요청은 무료·무제한으로 문서화되어 있다. 이 한도와 약관은 바뀔 수 있으므로 출시 때 다시 확인하며, 무료 영구 보장을 약속하지 않는다. Pages Functions를 추가하면 Workers 무료 사용량에 포함되므로 초기에는 사용하지 않는다.

로컬 공개 전에는 `npm run check:release`를 실행한다. 이 명령은 정적 빌드를 새로 만들고, 필수 `index.html`/`_headers`, Pages 파일 수·크기 제한, 서버/개발 폴더, 환경 설정, 학습 백업 및 일반·선택적·peer runtime 패키지 의존성의 부재를 검사한다. 배포 산출물의 CSP를 직접 읽어 루트 경로 `/` 정책 존재, 정책 제거 규칙 부재, 명시적 `connect-src 'self'`/`'none'`, 외부 스크립트 출처 부재를 확인한다. 현재 Pages 한도는 공식 자료를 확인한 2026-10-10 기준이며, 한도가 달라지면 `scripts/audit-release.mjs`의 상수와 이 문서를 함께 갱신한다.

이 프로젝트는 앞으로 멤버십을 검토할 계획이 있다. 무료 Pages 후보는 지금의 광고·결제·서버 기능 없는 공개 교육용 초기에만 검토한다. 구독이나 상업 기능을 붙이기 전 Cloudflare 이용 조건과 서비스 적합성을 다시 확인하고 호스트 결정을 새로 기록한다.

Cloudflare Pages Git 연동은 공개 저장소와 비공개 저장소를 지원하지만, Git 연동으로 만든 Pages 프로젝트는 나중에 Direct Upload 방식으로 바꿀 수 없다. 기본 경로는 Git 연동이며, 최초 Pages 프로젝트를 만들기 전에 방식을 확정한다. 직접 업로드를 선택하면 저장소 연결 없이 `dist/`를 수동으로 올릴 수 있지만, 업데이트도 직접 해야 한다. 배포 전 `git status`를 확인하고 미커밋 변경이 있으면 검증 후 커밋한다. `gh`와 `wrangler` CLI 및 Cloudflare 자격 증명은 이 환경에 없다. 현재 빌드 출력은 GitHub Pages보다 Cloudflare Pages에 맞춘 `_headers` 보안 헤더를 포함한다.

참고한 공식 자료:

- [Cloudflare Pages 무료 한도](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages 정적 파일 요금 및 한도](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Pages Git 연동과 Direct Upload 제한](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages 빌드 명령과 출력 폴더](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages 보안 헤더 파일](https://developers.cloudflare.com/pages/configuration/headers/)
- [GitHub Pages 이용 가능 저장소와 사이트 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages 사용 제한 및 SaaS 적합성](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## 계정과 저장소가 준비된 뒤 실행할 배포 순서

권장 경로는 비공개 소스 저장소에 자동 배포를 연결하고, 공개 Issues 저장소를 별도로 두는 방식이다. 정적 사이트로 빌드된 학습 콘텐츠는 모두 공개되며, 소스 저장소의 공개 여부와 무관하게 API·계정·DB 없이 동작한다.

### Git 연동(자동 배포)

1. 사용자가 GitHub 또는 GitLab에서 저장소 소유자와 공개 범위를 선택한다. 비공개 소스 + 공개 제보 저장소를 선택하면 제보 양식은 공개 저장소에 두고, 공개 Issues URL을 사이트에서 보이는 위치에 연결한다.
2. 현재 로컬 `main`의 커밋과 작업 트리를 확인하고, 미커밋 변경이 있으면 검증 후 로컬 커밋으로 기록한 다음 선택한 원격 저장소 URL에 연결해 푸시한다. 이 단계는 원격 URL과 계정 인증이 제공된 뒤 진행한다.
3. Cloudflare 대시보드에서 **Pages Git integration** 새 프로젝트를 만들고 해당 GitHub/GitLab 저장소와 production branch `main`을 연결한다.
4. Build command는 `npm run build`, build output directory는 `dist`로 설정한다. 환경 변수, Functions, Workers API, DB binding, 유료 옵션은 추가하지 않는다.
5. `*.pages.dev` 공개 URL에서 트랙 탐색, 문제 제출, 기록 재개, 백업/복원, `_headers` 보안 정책, 피드백 링크를 확인한다.

### 직접 업로드(수동 배포)

Git 원격 저장소 연결을 원하지 않으면 Pages 프로젝트를 **Direct Upload** 유형으로 생성하고 현재 `dist/`의 정적 파일을 업로드한다. 오늘 검증한 출력은 15개 파일, 최대 0.055 MiB로 대시보드 드래그 앤 드롭 한도보다 작다. 이 방식은 업데이트 때마다 새 `dist/`를 수동 업로드해야 하고, 같은 Pages 프로젝트를 Git 연동 방식으로 바꿀 수 없으므로 생성 전에 선택한다.

피드백 저장소가 정해지기 전에는 앱에 Issues URL을 넣지 않는다. 현재 이슈 양식은 저장소에 있지만 공개 학습 화면에서 외부 제보 링크로 연결되어 있지는 않다. URL을 받으면 개인정보·백업 파일을 올리지 말라는 안내와 함께 링크를 추가하고 키보드로 접근 가능한지 확인한다.

## 피드백 경로

출시 후보는 이메일을 받지 않는 GitHub Issues다. 이 저장소의 `.github/ISSUE_TEMPLATE/`에 학습 내용 오류와 접근성·사용성 문제 양식을 준비했다. 양식은 개인 정보나 학습 백업 파일을 올리지 않도록 안내한다. Issues를 쓰려면 공개 이슈 저장소와 GitHub 계정이 필요하다. 소스 저장소를 비공개로 유지하려면 이 양식을 별도 공개 피드백 저장소로 옮긴다. 사용자가 로그인 없이 제보할 경로는 아직 선택하지 않았다.

앱 자체에는 이메일 입력, 분석 스크립트, 광고, 쿠키, 서버 기록 전송 기능이 없다. 브라우저 기록과 코드 초안은 기기 안에 남는다. 호스트는 정적 사이트 접속 요청을 처리하므로, 공개 전에 호스트의 최신 개인정보 및 보안 조건도 확인한다.

## 공개 전 체크리스트

- [x] 로컬 Git 저장소를 초기화하고 빌드 결과, OMX 실행 상태, 로컬 설정 및 학습 백업 파일을 제외한다.
- [x] 다음 콘텐츠 후보와 단원 공개 검수 기준을 기록한다([콘텐츠 로드맵](content-roadmap.md)).
- [x] 정적 파일만 빌드하고 API, DB, 계정, 코드 서버, 유료 SDK를 포함하지 않는다.
- [x] `dist/`에는 배포 파일만 포함하고 소스 관리용 문서, 테스트, 로컬 백업 파일을 넣지 않는다.
- [x] 앱 및 격리 실행 프레임의 CSP와 기본 보안 응답 헤더를 `_headers`로 준비한다.
- [x] 콘텐츠 문제 및 접근성 문제를 위한 이메일 비수집 이슈 양식을 준비한다.
- [x] 현재 호스팅 후보의 무료 한도와 Git 연동 제약을 공식 자료로 확인한다.
- [x] 실제 `dist/` 산출물이 Pages 업로드 한도 안에 있고 서버 함수·환경 파일을 포함하지 않는지 검사한다(15개 파일, 최대 0.055 MiB, `_headers` 포함).
- [x] 로컬 실행 명령 `npm run check:release`로 위 산출물 경계 검사를 반복할 수 있도록 자동화한다.
- [x] 다섯 트랙의 23개 단원·세 단계 순서, 문제 풀이 데이터와 공식 버전 출처를 자동 검사한다.
- [x] 기기 설정/밝게/어둡게 표시 선택, 테마 저장, 대비와 모바일 핵심 화면을 확인한다.
- [x] 공개 소스 저장소와 함께 쓸 GitHub Issues 제보 경로를 학습 화면에 연결하고 로그인 필요를 알린다.
- [ ] 최초 공개 직전에 공식 기술 버전·호환 범위를 다시 확인하고 문서 검토일을 갱신한다.
- [x] 사용자가 공개 GitHub 저장소 `seonsun10/code-one-step`를 제공했다.
- [x] D-10 권고에 따라 Cloudflare Pages Git 연동을 배포 방식으로 선택했다. 저장소 원격 연결은 완료했고 Pages 계정 연결은 아래 단계에서 진행한다.
- [ ] 사용자가 Cloudflare 계정에서 해당 저장소 연결을 승인한다.
- [ ] 공개 사이트 게시 직전에 공개 대상으로 이 프로젝트를 노출하는 확인을 받는다.
- [ ] Cloudflare Pages Git 연동을 만들고 production branch, `npm run build`, `dist/`를 설정한다.
- [ ] 공개 URL에서 CSP, 코드 실행기, 반응형 화면, IndexedDB 재개, 백업 가져오기를 다시 확인한다.
- [ ] 공개 피드백 URL이 실제로 열리며 Issues 접근 권한이 기대와 맞는지 확인한다.
- [ ] 사용자에게 로컬 저장 범위, 백업 책임, 브라우저 실행기 한계를 공개 페이지에서 설명한다.
- [ ] 무료 한도 초과 시 과금되지 않도록 무료 등급 외 구독·유료 기능을 추가하지 않는다.

공개가 되기 전까지 이 문서는 준비 완료 기준이다. 공개 확인, 계정 연결 또는 접근 승인이 필요한 항목은 `docs/plan/decisions-and-help.md`의 H-06에 기록한다.
