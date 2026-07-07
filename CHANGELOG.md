# Changelog

## [0.2.0](https://github.com/Bkankim/project-ourfolio/compare/project-ourfolio-v0.1.0...project-ourfolio-v0.2.0) (2026-07-07)


### ✨ 새로운 기능

* **auth:** 로그인 상태에서 랜딩페이지(/) → 대시보드 자동 리다이렉트 ([f81c33e](https://github.com/Bkankim/project-ourfolio/commit/f81c33e7b71ab636153c89ffc1af35d1e6bc6fab))
* **dashboard:** username 미설정 시 경고 callout 추가 ([e581753](https://github.com/Bkankim/project-ourfolio/commit/e58175342b248764cbd8d345a9bcc52a8d070147))
* **github:** W4 GitHub import wedge — link, repo pin/import, on-demand refresh ([d6fab94](https://github.com/Bkankim/project-ourfolio/commit/d6fab9446554e84fe6f6c437d217fb743a197024))
* initial commit ([e6dfdcb](https://github.com/Bkankim/project-ourfolio/commit/e6dfdcb2a9dea4628193bd28f472bb70b173616c))
* **ourfolio:** API hardening + Vercel deploy prep (Phase 4+5) ([c8d01f5](https://github.com/Bkankim/project-ourfolio/commit/c8d01f59104d7e3ebd815d0eaa62c97012cb0b48))
* **ourfolio:** implement Phase 2+3 — UI infra + all 8 pages with Drizzle CRUD ([8eb7181](https://github.com/Bkankim/project-ourfolio/commit/8eb7181b0ec82c418cff90bcbc4be8fe7bd180dc))
* **privacy:** 개인정보보호법 완전 준수 — 8단계 구현 ([5be3b64](https://github.com/Bkankim/project-ourfolio/commit/5be3b64827098d6f79e85dcf50a0fe78ef9921bd))
* scaffold Next.js 16 + Neon + Drizzle + BetterAuth project ([cd00364](https://github.com/Bkankim/project-ourfolio/commit/cd003641e0568a37b4cee41c0068f8ed2d3c8acf))
* **seo:** OG/Twitter 메타데이터 추가 — Lovable 소셜 이미지 동일 적용 ([b3f255e](https://github.com/Bkankim/project-ourfolio/commit/b3f255edbdf7221c4688fda7afd9a91ae8b586ec))
* **settings:** 프로필 사진 크롭 기능 추가 ([588c73b](https://github.com/Bkankim/project-ourfolio/commit/588c73b398f2f3fcbd1b716dfa50f5fdff4b2ce8))
* sharp 의존성 추가 + 로고 에셋 정리 ([4ea0202](https://github.com/Bkankim/project-ourfolio/commit/4ea020242094b4dae77d3bcd033ad637a62f202a))
* v1 launch refinement — schema migration, projects deep-dive, RSC perf, SEO/OG, tests, observability ([def256f](https://github.com/Bkankim/project-ourfolio/commit/def256fcbe0a89c2818db8b87e29fb24796231d2))


### 🐛 버그 수정

* auth UX improvements + code quality cleanup ([54bc97f](https://github.com/Bkankim/project-ourfolio/commit/54bc97fb99f2973abdd0dbf8969578f9e8296435))
* **auth:** __Secure- 쿠키 접두사 불일치 해결 + 핸들러 중복 제거 ([3502cbc](https://github.com/Bkankim/project-ourfolio/commit/3502cbcc6025cc7919103a87ae71e1b0e3499147))
* **auth:** add BetterAuth Drizzle schema + baseURL config ([7a715a6](https://github.com/Bkankim/project-ourfolio/commit/7a715a6ee47387f1759b1d89e801ab4ff854c9ab))
* **auth:** enable email/password auth + mobile UX improvements ([735ecf6](https://github.com/Bkankim/project-ourfolio/commit/735ecf635ef689d8083d8ff8375e4434822a8192))
* **auth:** signOut 후 리다이렉트 + signIn 에러 핸들링 수정 ([13e81ee](https://github.com/Bkankim/project-ourfolio/commit/13e81eee4be62af5c40dcc8560cf85271d4aa039))
* **auth:** 구글 로그인 콜백 에러 대응 — error boundary + callbackURL ([46b6e75](https://github.com/Bkankim/project-ourfolio/commit/46b6e7545a800257273cbf1821ea77929bb3acd1))
* **auth:** 로그인 무한루프 해결 — router.replace → window.location.href ([641cee9](https://github.com/Bkankim/project-ourfolio/commit/641cee9b1cb2d1d44675d92188f7bd7fd198a559))
* **auth:** 무한루프 근본 해결 — 인증 리다이렉트를 미들웨어 단일 제어로 통합 ([9e6b0b0](https://github.com/Bkankim/project-ourfolio/commit/9e6b0b0b6ed2a0c379f69b380660c773b7a54397))
* **ci:** actions/checkout@v6 → v4 + branches main → master ([16fcebb](https://github.com/Bkankim/project-ourfolio/commit/16fcebb3fe71c43f8722de782beb23f9f854e1a2))
* **ci:** add --archive=tgz to vercel deploy (free tier upload limit) ([ac0bfd7](https://github.com/Bkankim/project-ourfolio/commit/ac0bfd77b6273c6d4c67415d77797f728792224c))
* **ci:** add release-please config + new CI workflows + auth redirect fix ([57f04ad](https://github.com/Bkankim/project-ourfolio/commit/57f04adfc61c3f6631ee964709f9f339d3090819))
* **ci:** deploy.yml trigger branch main → master ([3cf14d9](https://github.com/Bkankim/project-ourfolio/commit/3cf14d9611f7148be1ccefd28119ee416025f645))
* **ci:** health check uses production domain, accepts non-5xx ([ba1b1d1](https://github.com/Bkankim/project-ourfolio/commit/ba1b1d10c64589aacbc5d0c3a6d7f5e6817c17d0))
* **ci:** migrate release-please to googleapis org (deprecated) ([48f1ca3](https://github.com/Bkankim/project-ourfolio/commit/48f1ca3364a1bcda74f5a3b67daa8159aec18309))
* **ci:** move secrets from workflow-level to job-level env ([cf89f40](https://github.com/Bkankim/project-ourfolio/commit/cf89f402c0cdbe057a4c36a9618ad88a0d3acfd9))
* **ci:** preview.yml에 pnpm cache 추가 ([b196743](https://github.com/Bkankim/project-ourfolio/commit/b196743f62dc39c25c01405d125e05b52daafeba))
* **ci:** remove bundle-size workflow (hashicorp action deleted) ([4e5f42d](https://github.com/Bkankim/project-ourfolio/commit/4e5f42dd8baa44a13dce0208b431320c8bf9e88b))
* **ci:** remove dependency-review workflow (requires GHAS) ([3b3e893](https://github.com/Bkankim/project-ourfolio/commit/3b3e8935179fd08ae563d0d4344b2bced25247fb))
* **ci:** remove pnpm cache from deploy workflows ([aa54047](https://github.com/Bkankim/project-ourfolio/commit/aa5404771301fad66b17ff94509942dae88b1373))
* **ci:** resolve 4 failing GitHub Actions workflows ([c398cd0](https://github.com/Bkankim/project-ourfolio/commit/c398cd0d9b56242fd0f7f71b0dc5437698a2edcd))
* **ci:** resolve remaining lint errors and remove CodeQL workflow ([c19429f](https://github.com/Bkankim/project-ourfolio/commit/c19429fae34a1fd9604fb2c7e1f9f955840dc7ff))
* **ci:** secrets context not available in step/job if conditions ([8e34d37](https://github.com/Bkankim/project-ourfolio/commit/8e34d3728fcc4769013833acb0d8f9fd6bdaf5b0))
* **ci:** simplify deploy workflow YAML ([9af94df](https://github.com/Bkankim/project-ourfolio/commit/9af94dfb6135ac187cb56f4e0529b93e5c7a9ba3))
* **ci:** skip deploy mirror on non-org repos (prevents self-mirror loop) ([17bc32a](https://github.com/Bkankim/project-ourfolio/commit/17bc32a2c7eb1b55a16a2c84e74f8d307d48e3bc))
* **ci:** switch deploy to SSH mirror → Vercel Git Integration ([3924cd3](https://github.com/Bkankim/project-ourfolio/commit/3924cd3bb30acb313bbf48054167a55883019f58))
* **deps:** add packages field to pnpm-workspace.yaml ([d29a51e](https://github.com/Bkankim/project-ourfolio/commit/d29a51e3fff71e3448d909a88e39cf173e1abeb6))
* **deps:** react-easy-crop 의존성 커밋 누락 수정 ([bbad6e1](https://github.com/Bkankim/project-ourfolio/commit/bbad6e1dcaca9a8575a7bc46556dd65ef344c6a3))
* **i18n:** 빈 문자열 번역값이 key 이름으로 노출되는 버그 수정 ([78ad66d](https://github.com/Bkankim/project-ourfolio/commit/78ad66d7db57e1aa138475f58cb434a36691030a))
* **lint:** resolve react-hooks/set-state-in-effect violations ([ddabf4d](https://github.com/Bkankim/project-ourfolio/commit/ddabf4dd54df32db9c095e474379b3196953f423))
* **lint:** use block-level eslint-disable for settings useEffect ([f867a1a](https://github.com/Bkankim/project-ourfolio/commit/f867a1a7c9399957992d5e424a0ea3a07b5c73d5))
* **ourfolio:** simplify review — after() + email subject escape ([d0f0283](https://github.com/Bkankim/project-ourfolio/commit/d0f02833ec1a58563694b9e5ccdb1a6c5a5169b6))
* **privacy:** 2-4회차 코드 리뷰 12건 수정 — R2 prefix 버그, 동의 안정성, 삭제 순서 ([1b3a5d4](https://github.com/Bkankim/project-ourfolio/commit/1b3a5d47976f57b0489bb0512990ad108f75b13b))
* **privacy:** 5-agent review 결과 반영 — 보안·품질·효율성 14건 수정 ([20ad487](https://github.com/Bkankim/project-ourfolio/commit/20ad4870fc4b0a1a4ca27c6278d07364e6929aef))
* **quality:** unify fetch logic and fix stale dialog key ([3688cca](https://github.com/Bkankim/project-ourfolio/commit/3688cca0c5104cee739287286bb4b3af3665ac3b))
* rename domain outfolio → ourfolio + split auth into login/signup pages ([7aa3d25](https://github.com/Bkankim/project-ourfolio/commit/7aa3d258791877abc4447e9b237f1fa58d04af04))
* **seo:** use NEXT_PUBLIC_APP_URL for sitemap base URL ([4d05d86](https://github.com/Bkankim/project-ourfolio/commit/4d05d8650b06c400334a4117cd36bb876a2c0e74))
* **settings:** 아바타 크롭 드래그 활성화 — Dialog 이벤트 충돌 해결 ([63c599e](https://github.com/Bkankim/project-ourfolio/commit/63c599e68d310c170b3c85b6eb5dc128ad0fc7c3))
* simplify review — auth guard + sentry workflow cleanup ([97ddceb](https://github.com/Bkankim/project-ourfolio/commit/97ddceb3ed3fe4c05e88877afc4d26c158492d58))
* **ui:** Lovable 원본 UI/UX 복원 — Tailwind v4 패치 + 컴포넌트 정렬 ([193c0ff](https://github.com/Bkankim/project-ourfolio/commit/193c0fff56b3f923e80625caf9feb3bbc701e628))
* **ui:** responsive improvements from simplify review ([bc90d34](https://github.com/Bkankim/project-ourfolio/commit/bc90d345f0d8e6388d4ba84be75bbadb25b8ca96))
* **ui:** simplify review — breakpoint alignment, CSS sync, auth guard ([879981e](https://github.com/Bkankim/project-ourfolio/commit/879981eb5db9f89ef11d3e0cf94b913902103592))
* **ui:** 로고 통일 (Briefcase → ourfolio-logo.svg) + 환영 메시지에 '님' 추가 ([bc4ca16](https://github.com/Bkankim/project-ourfolio/commit/bc4ca16e8bc9a6607b4d949b256f9ac2d4e76371))
* **ui:** 로고를 logo-120.svg로 교체 ([65a25e1](https://github.com/Bkankim/project-ourfolio/commit/65a25e1ed3504cc4b2451f1832246f47cc82bea2))
* **ui:** 파비콘을 보라색 가방 로고로 교체 ([fc6812e](https://github.com/Bkankim/project-ourfolio/commit/fc6812e954f3ba252157039dad4a0da1d22bc2c9))
* **ui:** 파비콘을 새 로고(logo-120)로 교체 ([85d4164](https://github.com/Bkankim/project-ourfolio/commit/85d41640c12127ea26eac6c79ac8426f1b37d6ee))


### ♻️ 리팩토링

* **ui:** Tailwind v4 → v3 다운그레이드 + shadcn v3 Radix 마이그레이션 ([be7cd0f](https://github.com/Bkankim/project-ourfolio/commit/be7cd0f77c856b110aaa40021e85636a494e5575))
