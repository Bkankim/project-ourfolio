# project-ourfolio 에이전트 지침

이 파일이 리포 지침의 실물이다. `CLAUDE.md`는 이 파일을 임포트하는 한 줄이다.
구조·절차·결정은 여기에 옮겨 적지 않고 `README.md`에 둔다.

## 목표
OurFolio(`https://ourfolio.bkan.dev`)는 수익화 SaaS가 아니라 포트폴리오 전시용으로 운영하는 포트폴리오 빌더다.
그래서 처음 보는 사람이 랜딩, `/demo`, 소스를 보고 "실제로 동작하고 근거가 있다"고 느끼게 하는 일을 먼저 고른다.
- 랜딩과 README에 쓰는 기능·수치는 스키마(`src/db/schema.ts`), 시드(`scripts/seed-demo.ts`), 코드에 실제로 있는 것만 쓴다.
- 랜딩 첫 화면 문구(`lpEyebrow`, `lpLead`)는 제품 종류("포트폴리오 빌더")를 먼저 말한다. 문구를 고쳐도 이 점은 유지한다.

## 확인 명령
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## README 길잡이
`README.md`는 자동으로 실리지 않는다. 아래 일을 하기 전에 해당 절을 직접 읽는다.
- 로컬에서 띄우거나 환경 변수를 다룰 때: "로컬 실행"
- 배포, CI, 스키마·마이그레이션, 의존성을 바꿀 때: "배포와 CI"
- 의존성 보안 패치나 원격 리포를 다룰 때: "결정과 절충"
- 작업을 마치고 남은 일이 바뀌었을 때: "한계와 다음"을 고친다

## 코드가 오해를 부르는 곳
- 원격이 둘이다. 원본은 `origin`(`Bkankim/project-ourfolio`)이고 Vercel도 이쪽 `master`를 빌드한다.<br>`bkan-hq` 원격에 push해도 배포되지 않는다.
- `src/middleware.ts`는 Next.js 16에서 폐기 예정 규약이라 빌드가 경고를 낸다(2026-11-13). 새 요청 가로채기 코드를 같은 방식으로 늘리지 않는다.
- 이 Next.js(16)는 기억 속 버전과 API·규약이 다를 수 있다. `src/app/`을 고치기 전에 `node_modules/next/dist/docs/`에서 해당 가이드를 읽는다.
- i18n 문구는 `src/lib/i18n-translations.ts`의 ko와 en에 같은 키로 함께 넣는다. `tests/i18n.test.ts`가 두 키 집합이 같은지 본다.
- 스키마(`src/db/schema.ts`)를 바꾸면 `pnpm db:generate`로 만든 `drizzle/` 마이그레이션을 같이 커밋한다. 빠지면 PR의 마이그레이션 검사가 실패한다.
- 간접 의존성 고정은 `pnpm-workspace.yaml`의 `overrides`에만 둔다. `package.json`에 같은 것을 두지 않는다.
- `pnpm db:seed`와 `pnpm db:migrate`는 `.env.local`의 `DATABASE_URL`이 가리키는 DB에 쓴다. 이 값이 원격 DB일 수 있으니 확인 명령으로 돌리지 않는다.
- `.env.local`은 읽지 않는다. 필요한 키 이름은 `.env.example`과 README "로컬 실행"에 있다.
