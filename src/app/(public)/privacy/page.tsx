import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | OurFolio",
  description: "OurFolio 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-muted-foreground mb-10">
        시행일: 2026년 3월 13일 | 버전 1.0
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
        {/* ── 제1조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제1조 (개인정보의 수집 및 이용 목적)</h2>
          <p>OurFolio(이하 &quot;서비스&quot;)는 다음 목적을 위해 개인정보를 수집·이용합니다.</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>회원 가입 및 인증 (이메일/비밀번호 또는 Google OAuth)</li>
            <li>포트폴리오 생성·관리 (프로필, 프로젝트, 케이스 스터디)</li>
            <li>리드(문의) 수신 및 이메일 알림 발송</li>
            <li>서비스 이용 통계 분석 및 개선</li>
          </ol>
        </section>

        {/* ── 제2조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제2조 (수집하는 개인정보 항목)</h2>

          <h3 className="text-lg font-medium mt-4">1. 필수 항목 (회원가입)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>이메일 주소, 이름, 비밀번호 (해싱 저장)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">2. 선택 항목 (프로필 설정)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>프로필 사진, 자기소개, 직업, 소셜 링크</li>
            <li>프로젝트 정보 (제목, 설명, 이미지, 태그)</li>
            <li>케이스 스터디 (문제/해결/결과, 지표, 커버 이미지)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">3. 자동 수집 항목</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP 주소, User-Agent (BetterAuth 세션 관리)</li>
            <li>인증 세션 쿠키 (필수, 로그인 유지)</li>
            <li>
              <code>ourfolio_visitor_id</code> (localStorage, 비식별 방문자 분석용)
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4">4. 문의(리드) 항목</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>발신자 이름, 이메일 주소, 메시지, 예산 범위</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">5. Google OAuth 이용 시</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google 계정 이메일, 이름, 프로필 이미지 URL</li>
            <li>OAuth 액세스 토큰, 리프레시 토큰, ID 토큰 (보안 저장)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">6. 동의 이력</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>동의 유형, 정책 버전, 동의 일시</li>
          </ul>
        </section>

        {/* ── 제3조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제3조 (개인정보의 보유 및 이용 기간)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>회원 정보:</strong> 회원 자격 유지 기간. 탈퇴 시 즉시 삭제.
            </li>
            <li>
              <strong>리드(문의) 정보:</strong> 수집일로부터 3년 보유 후 파기.
            </li>
            <li>
              <strong>분석 이벤트:</strong> 비식별 통계 목적으로 보유, 회원 탈퇴 시 삭제.
            </li>
          </ul>
          <h3 className="text-lg font-medium mt-4">파기 방법</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>데이터베이스 레코드: SQL DELETE 명령으로 즉시 삭제</li>
            <li>업로드 파일 (이미지): Cloudflare R2 스토리지에서 삭제</li>
          </ul>
        </section>

        {/* ── 제4조 ── */}
        <section id="international-transfer">
          <h2 className="text-xl font-semibold">제4조 (개인정보의 국외 이전)</h2>
          <p>서비스 제공을 위해 다음 해외 서비스를 이용하며, 이에 따라 개인정보가 국외로 이전됩니다.</p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">이전받는 자</th>
                  <th className="text-left py-2 pr-4">이전 국가</th>
                  <th className="text-left py-2 pr-4">이전 항목</th>
                  <th className="text-left py-2">이전 목적</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4">Neon Inc.</td>
                  <td className="py-2 pr-4">미국</td>
                  <td className="py-2 pr-4">회원 정보, 포트폴리오 데이터</td>
                  <td className="py-2">PostgreSQL 데이터베이스 호스팅</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Cloudflare Inc.</td>
                  <td className="py-2 pr-4">미국 (글로벌 CDN)</td>
                  <td className="py-2 pr-4">업로드 이미지 파일</td>
                  <td className="py-2">R2 오브젝트 스토리지</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel Inc.</td>
                  <td className="py-2 pr-4">미국</td>
                  <td className="py-2 pr-4">요청 로그, IP 주소</td>
                  <td className="py-2">웹 애플리케이션 호스팅</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Resend Inc.</td>
                  <td className="py-2 pr-4">미국</td>
                  <td className="py-2 pr-4">이메일 주소, 이름</td>
                  <td className="py-2">리드 알림 이메일 발송</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Google LLC</td>
                  <td className="py-2 pr-4">미국</td>
                  <td className="py-2 pr-4">이메일, 이름, 프로필 이미지</td>
                  <td className="py-2">Google OAuth 소셜 로그인</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 제5조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제5조 (쿠키 및 로컬 스토리지)</h2>
          <h3 className="text-lg font-medium mt-4">1. 인증 세션 쿠키 (필수)</h3>
          <p>
            BetterAuth가 발행하는 세션 쿠키로, 로그인 상태 유지에 필수적입니다.
            비활성화 시 로그인 기능을 이용할 수 없습니다.
          </p>
          <h3 className="text-lg font-medium mt-4">2. ourfolio_visitor_id (분석)</h3>
          <p>
            브라우저 localStorage에 저장되는 비식별 방문자 식별자입니다.
            페이지 조회, CTA 클릭 등 익명 분석에 사용되며, 개인을 특정할 수 없습니다.
            브라우저 개발자 도구에서 삭제할 수 있습니다.
          </p>
        </section>

        {/* ── 제6조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제6조 (정보주체의 권리)</h2>
          <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>개인정보 열람 요청</li>
            <li>개인정보 정정 요청</li>
            <li>개인정보 삭제 요청</li>
            <li>개인정보 처리정지 요청</li>
          </ol>
          <h3 className="text-lg font-medium mt-4">행사 방법</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>계정 탈퇴:</strong> 서비스 내 설정 페이지에서 직접 삭제 가능
            </li>
            <li>
              <strong>데이터 내보내기:</strong> 설정 페이지에서 JSON 파일로 다운로드 가능
            </li>
            <li>
              <strong>이메일 요청:</strong> 아래 보호책임자 이메일로 요청 시 10일 이내 조치
            </li>
          </ul>
        </section>

        {/* ── 제7조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제7조 (14세 미만 아동의 개인정보)</h2>
          <p>
            서비스는 14세 미만 아동의 개인정보를 수집하지 않습니다.
            14세 미만으로 확인되는 경우 즉시 삭제합니다.
          </p>
        </section>

        {/* ── 제8조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제8조 (안전성 확보 조치)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>비밀번호: bcrypt 해싱 저장 (원문 저장 금지)</li>
            <li>통신 암호화: SSL/TLS (HTTPS) 적용</li>
            <li>파일 격리: Cloudflare R2에서 사용자별 폴더 분리</li>
            <li>접근 제어: 세션 기반 인증 및 사용자별 데이터 격리</li>
          </ul>
        </section>

        {/* ── 제9조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제9조 (개인정보처리방침의 변경)</h2>
          <p>
            본 방침이 변경되는 경우, 변경 사항을 서비스 내 공지사항을 통해 고지합니다.
            변경된 방침은 공지 후 7일 경과 시 효력이 발생합니다.
          </p>
        </section>

        {/* ── 제10조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제10조 (개인정보 보호책임자 및 고충처리)</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4 font-medium">성명</td>
                  <td className="py-2">김병관</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">직위</td>
                  <td className="py-2">대표</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">이메일</td>
                  <td className="py-2">chillbkan@gmail.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-medium mt-4">권익침해 구제</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
            <li>개인정보 분쟁조정위원회: 1833-6972 (kopico.go.kr)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
