import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function NotificationsLink() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const unread = await db.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <Link
      className="hidden h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] sm:inline-flex"
      href="/notifications"
    >
      Notifications{unread > 0 ? ` (${unread})` : ""}
    </Link>
  );
}
