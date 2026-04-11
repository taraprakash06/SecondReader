import Link from "next/link";

export function NotificationsLink({ unread }: { unread: number | null }) {
  if (unread === null) return null;

  return (
    <Link
      className="inline-flex min-h-11 min-w-[2.75rem] shrink-0 items-center justify-center rounded-xl px-2.5 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:min-h-9 sm:px-3"
      href="/notifications"
    >
      Notifications{unread > 0 ? ` (${unread})` : ""}
    </Link>
  );
}
