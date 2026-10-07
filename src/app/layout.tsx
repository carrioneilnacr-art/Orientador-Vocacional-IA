import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StudentSessionBanner } from "@/components/auth/StudentSessionBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orientador Vocacional IA",
  description: "Descubre la carrera ideal para tu futuro profesional con nuestro orientador vocacional potenciado por Inteligencia Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Banner de sesión escolar: solo visible cuando el alumno se autenticó con su código */}
        <StudentSessionBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
