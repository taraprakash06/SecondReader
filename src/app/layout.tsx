import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { AuthButton } from "@/components/AuthButton";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Reader",
  description: "Second Reader helps writers find trusted critique partners and build lasting relationships.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers session={session}>
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-8 w-36">
                  <Image
                    src="/second-reader-logo.svg"
                    alt="Second Reader"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
              <nav className="flex items-center gap-2">
                <Link
                  className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
                  href="/readers"
                >
                  Readers
                </Link>
                <Link
                  className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
                  href="/writer"
                >
                  Writer
                </Link>
                <Link
                  className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
                  href="/reader"
                >
                  Reader
                </Link>
                <AuthButton />
              </nav>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
