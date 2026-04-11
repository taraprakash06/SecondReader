import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { AuthButton } from "@/components/AuthButton";
import { NotificationsLink } from "@/components/NotificationsLink";
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
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
              <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
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
              <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-1.5 sm:flex-none sm:justify-end">
                <Link
                  className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
                  href="/pieces"
                >
                  Browse Pieces
                </Link>
                <Link
                  className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
                  href="/readers"
                >
                  Browse Readers
                </Link>
                <Link
                  className="hidden min-h-9 max-w-[5.75rem] items-center justify-center rounded-xl px-2 text-center text-[10px] font-semibold leading-tight text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex sm:max-w-none sm:px-3 sm:text-xs sm:leading-snug"
                  href="/writer"
                >
                  Submit Your Work
                </Link>
                <Link
                  className="hidden min-h-9 max-w-[6.25rem] items-center justify-center rounded-xl px-2 text-center text-[10px] font-semibold leading-tight text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex sm:max-w-none sm:px-3 sm:text-xs sm:leading-snug"
                  href="/reader"
                >
                  become a reader
                </Link>
                <NotificationsLink />
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
