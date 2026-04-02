import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
try {
  await p.$connect();
  const n = await p.user.count();
  console.log("connected, users:", n);
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await p.$disconnect();
}
