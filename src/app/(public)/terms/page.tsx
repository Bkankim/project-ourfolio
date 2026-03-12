import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | OurFolio",
  description: "OurFolio 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">서비스 이용약관</h1>
      <p className="text-muted-foreground mb-10">
        시행일: 2026년 3월 13일 | 버전 1.0
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
        {/* ── 제1조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제1조 (목적)</h2>
          <p>
            본 약관은 OurFolio(이하 &quot;서비스&quot;)의 이용 조건 및 절차,
            이용자와 서비스 제공자 간의 권리·의무를 규정함을 목적으로 합니다.
          </p>
        </section>

        {/* ── 제2조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제2조 (서비스 내용)</h2>
          <p>서비스는 다음 기능을 제공합니다.</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>포트폴리오 프로필 생성 및 관리</li>
            <li>프로젝트 갤러리 및 케이스 스터디 작성</li>
            <li>공개 포트폴리오 페이지 제공</li>
            <li>리드(문의) 수신 및 관리</li>
            <li>방문자 분석 대시보드</li>
          </ol>
        </section>

        {/* ── 제3조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제3조 (이용자의 의무)</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>이용자는 14세 이상이어야 합니다.</li>
            <li>타인의 개인정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.</li>
            <li>서비스를 이용하여 불법적인 활동을 해서는 안 됩니다.</li>
            <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            <li>다른 이용자의 서비스 이용을 방해해서는 안 됩니다.</li>
          </ol>
        </section>

        {/* ── 제4조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제4조 (포트폴리오 콘텐츠 책임)</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>
              이용자가 업로드하는 포트폴리오 콘텐츠(프로젝트, 케이스 스터디, 이미지 등)에 대한
              저작권 및 법적 책임은 이용자에게 있습니다.
            </li>
            <li>
              타인의 저작물, 상표, 영업비밀 등을 무단으로 게시해서는 안 됩니다.
            </li>
            <li>
              서비스는 이용자 콘텐츠를 서비스 제공 목적(포트폴리오 표시, 리드 발송)
              외 용도로 사용하지 않습니다.
            </li>
          </ol>
        </section>

        {/* ── 제5조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제5조 (서비스의 제공 및 변경)</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>
              서비스는 연중무휴, 24시간 제공을 원칙으로 하나,
              시스템 점검이나 불가항력적 사유 발생 시 일시 중단될 수 있습니다.
            </li>
            <li>
              서비스 내용이 변경되는 경우, 변경 내용을 사전에 공지합니다.
            </li>
            <li>
              무료 서비스의 일부 또는 전부를 변경·중단할 수 있으며,
              이에 대해 별도의 보상을 하지 않습니다.
            </li>
          </ol>
        </section>

        {/* ── 제6조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제6조 (계정 탈퇴 및 데이터 삭제)</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>
              이용자는 언제든지 서비스 내 설정 페이지에서 계정을 삭제할 수 있습니다.
            </li>
            <li>
              계정 삭제 시 모든 개인정보, 포트폴리오 데이터, 업로드 파일이
              즉시 삭제되며 복구할 수 없습니다.
            </li>
            <li>
              이용자가 작성한 리드(문의) 데이터는 수신자의 데이터이므로,
              발신자의 계정 삭제와 무관하게 보유될 수 있습니다.
            </li>
          </ol>
        </section>

        {/* ── 제7조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제7조 (약관의 변경)</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>본 약관은 관련 법령에 위배되지 않는 범위 내에서 변경할 수 있습니다.</li>
            <li>약관이 변경되는 경우, 시행일 7일 전 서비스 내에서 공지합니다.</li>
            <li>
              변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고
              계정을 삭제할 수 있습니다.
            </li>
          </ol>
        </section>

        {/* ── 제8조 ── */}
        <section>
          <h2 className="text-xl font-semibold">제8조 (문의)</h2>
          <p>
            서비스 이용에 관한 문의는 아래 연락처로 보내주시기 바랍니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>이메일:</strong> chillbkan@gmail.com
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
