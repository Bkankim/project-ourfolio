import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const OG_IMAGE = "/og.png";

export const metadata: Metadata = {
  title: "OurFolio - 근거가 붙은 포트폴리오",
  description: "프로젝트를 문제, 해결, 결과 순서로 정리하고 수치를 붙여 주소 하나로 공개합니다.",
  metadataBase: new URL("https://ourfolio.bkan.dev"),
  openGraph: {
    title: "OurFolio - 근거가 붙은 포트폴리오",
    description: "프로젝트를 문제, 해결, 결과 순서로 정리하고 수치를 붙여 주소 하나로 공개합니다.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OurFolio",
    title: "OurFolio - 근거가 붙은 포트폴리오",
    description: "프로젝트를 문제, 해결, 결과 순서로 정리하고 수치를 붙여 주소 하나로 공개합니다.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
