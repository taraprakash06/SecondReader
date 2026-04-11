import { db } from "@/lib/db";

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return db.notification.count({
    where: { userId, read: false },
  });
}
