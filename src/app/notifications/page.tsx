import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { acceptReaderInvite, declineReaderInvite } from "@/app/notifications/actions";
import {
  acceptVolunteerReadRequest,
  declineVolunteerReadRequest,
} from "@/app/pieces/actions";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const items = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      invite: true,
      volunteerRequest: { include: { reader: true, submission: { select: { title: true } } } },
    },
    take: 100,
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Invites, reader requests, and updates. Accept to connect on a piece.
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        {items.map((n) => {
          const invitePending = n.invite?.status === "PENDING" && n.invite.readerId === userId;
          const volunteerPending =
            n.volunteerRequest?.status === "PENDING" && n.volunteerRequest.writerId === userId;

          return (
            <li
              key={n.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                n.read ? "border-zinc-200 bg-white" : "border-[color:var(--brand-magenta)]/30 bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-[color:var(--ink)]">{n.title}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">{n.body}</p>

              {invitePending && n.invite ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <form action={acceptReaderInvite.bind(null, n.invite.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                    >
                      Accept
                    </button>
                  </form>
                  <form action={declineReaderInvite.bind(null, n.invite.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
                    >
                      Decline
                    </button>
                  </form>
                </div>
              ) : null}

              {volunteerPending && n.volunteerRequest ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <form action={acceptVolunteerReadRequest.bind(null, n.volunteerRequest.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                    >
                      Accept request
                    </button>
                  </form>
                  <form action={declineVolunteerReadRequest.bind(null, n.volunteerRequest.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
                    >
                      Decline
                    </button>
                  </form>
                </div>
              ) : null}

              {n.type === "VOLUNTEER_ACCEPTED" && n.relatedAssignmentId ? (
                <div className="mt-4">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
                    href={`/critiques/${n.relatedAssignmentId}`}
                  >
                    Open piece &amp; leave feedback →
                  </Link>
                </div>
              ) : null}

              {n.type === "CRITIQUE_FEEDBACK_COMPLETE" && n.relatedAssignmentId ? (
                <div className="mt-4">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                    href={`/critiques/${n.relatedAssignmentId}`}
                  >
                    Open draft with feedback →
                  </Link>
                </div>
              ) : null}

              {!invitePending && !volunteerPending ? (
                <>
                  {n.invite?.status === "ACCEPTED" ? (
                    <p className="mt-3 text-xs font-medium text-emerald-800">Invite accepted</p>
                  ) : null}
                  {n.invite?.status === "DECLINED" ? (
                    <p className="mt-3 text-xs font-medium text-zinc-600">Invite declined</p>
                  ) : null}
                  {n.volunteerRequest?.status === "ACCEPTED" ? (
                    <p className="mt-3 text-xs font-medium text-emerald-800">Reader request accepted</p>
                  ) : null}
                  {n.volunteerRequest?.status === "DECLINED" ? (
                    <p className="mt-3 text-xs font-medium text-zinc-600">Reader request declined</p>
                  ) : null}
                </>
              ) : null}
            </li>
          );
        })}
      </ul>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-8 text-sm text-[color:var(--ink-muted)]">
          No notifications yet.
        </p>
      ) : null}
    </div>
  );
}
