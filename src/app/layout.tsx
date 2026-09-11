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
  title: "OurFolio - 온라인 포트폴리오 빌더",
  description: "개발자와 디자이너를 위한 포트폴리오 빌더. 프로젝트를 올리면 링크 하나가 생겨요.",
  metadataBase: new URL("https://ourfolio.bkan.dev"),
  openGraph: {
    title: "OurFolio - 온라인 포트폴리오 빌더",
    description: "개발자와 디자이너를 위한 포트폴리오 빌더. 프로젝트를 올리면 링크 하나가 생겨요.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OurFolio",
    title: "OurFolio - 온라인 포트폴리오 빌더",
    description: "개발자와 디자이너를 위한 포트폴리오 빌더. 프로젝트를 올리면 링크 하나가 생겨요.",
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
