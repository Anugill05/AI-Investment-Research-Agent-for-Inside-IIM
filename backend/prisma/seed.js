import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@analyst.ai";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user already exists, skipping seed.");
    return;
  }

  const password = await bcrypt.hash("Demo@123", 10);
  const user = await prisma.user.create({
    data: { name: "Demo Analyst", email, password },
  });

  console.log(`Seeded demo user: ${user.email} / password: Demo@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
