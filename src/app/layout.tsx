import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notificationsUnread";
import { AuthButton } from "@/components/AuthButton";
import { MobileNavMenu } from "@/components/MobileNavMenu";
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
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const unreadNotifications =
    session?.user?.id != null ? await getUnreadNotificationCount(session.user.id) : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers session={session}>
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
                <div className="relative h-8 w-32 min-[360px]:w-36">
                  <Image
                    src="/second-reader-logo.svg"
                    alt="Second Reader"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
                <nav className="hidden min-w-0 items-center justify-end gap-x-1 md:flex md:gap-x-2">
                  <Link
                    className="inline-flex min-h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
                    href="/pieces"
                  >
                    Browse Pieces
                  </Link>
                  <Link
                    className="inline-flex min-h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
                    href="/readers"
                  >
                    Browse Readers
                  </Link>
                  <Link
                    className="inline-flex min-h-9 max-w-[7rem] items-center justify-center rounded-xl px-2 text-center text-[10px] font-semibold leading-tight text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] lg:max-w-none lg:px-3 lg:text-xs lg:leading-snug"
                    href="/writer"
                  >
                    Submit Your Work
                  </Link>
                  <Link
                    className="inline-flex min-h-9 max-w-[7rem] items-center justify-center rounded-xl px-2 text-center text-[10px] font-semibold leading-tight text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] lg:max-w-none lg:px-3 lg:text-xs lg:leading-snug"
                    href="/reader"
                  >
                    Become a Reader
                  </Link>
                </nav>
                <NotificationsLink unread={unreadNotifications} />
                <AuthButton />
                <MobileNavMenu />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-xs text-[color:var(--ink-muted)] sm:px-6">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <Link
                  href="/privacy"
                  className="font-medium text-[color:var(--ink)] underline decoration-[color:var(--brand-magenta)]/35 underline-offset-2 hover:text-[color:var(--brand-magenta)] hover:decoration-[color:var(--brand-magenta)]"
                >
                  Privacy Policy
                </Link>
                <span className="hidden text-zinc-300 sm:inline" aria-hidden>
                  |
                </span>
                <Link
                  href="/terms"
                  className="font-medium text-[color:var(--ink)] underline decoration-[color:var(--brand-magenta)]/35 underline-offset-2 hover:text-[color:var(--brand-magenta)] hover:decoration-[color:var(--brand-magenta)]"
                >
                  Terms of Service
                </Link>
              </div>
              <div>
                <p>© 2026 Second Reader™</p>
                <p className="mt-1">A Write to Right initiative</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
