import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/BTAK62J0nVRCItOBe630g0dd1v43/social-images/social-1773028714155-20260309_125814.webp";

export const metadata: Metadata = {
  title: "OurFolio - 당신의 경험을 전문화하세요",
  description: "당신의 경험을 증거 기반 포트폴리오로 만들어보세요.",
  metadataBase: new URL("https://ourfolio.bkan.dev"),
  openGraph: {
    title: "OurFolio - 당신의 경험을 전문화하세요",
    description: "당신의 경험을 증거 기반 포트폴리오로 만들어보세요.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OurFolio",
    title: "OurFolio - 당신의 경험을 전문화하세요",
    description: "당신의 경험을 증거 기반 포트폴리오로 만들어보세요.",
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
      </body>
    </html>
  );
}
