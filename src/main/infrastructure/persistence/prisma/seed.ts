import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.workedDay.deleteMany({});
  await prisma.salary.deleteMany({});
  await prisma.lawyer.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.legalCase.deleteMany({});
  await prisma.firebaseUser.deleteMany({});
  await prisma.user.deleteMany({});

  const client = await prisma.client.create({
    data: {
      sex: "male",
      first_name: "John",
      last_name: "Doe",
      user: {
        create: {
          email: "john@doe.com",
          user_type: "lawyer",
        },
      },
    },
  });

  const client2 = await prisma.client.create({
    data: {
      sex: "female",
      first_name: "Lorem",
      last_name: "Ipsum",
      user: {
        create: {
          email: "lorem@ipsum.com",
          user_type: "lawyer",
        },
      },
    },
  });

  const client3 = await prisma.client.create({
    data: {
      sex: "female",
      first_name: "PO",
      last_name: "Fleck",
      user: {
        create: {
          email: "po@fleck.com",
          user_type: "lawyer",
        },
      },
    },
  });

  const lawyer = await prisma.lawyer.create({
    data: {
      user: {
        create: {
          email: "charlotte@avocado.fr",
          user_type: "lawyer",
        },
      },
    },
  });

  const legalCase = await prisma.legalCase.create({
    data: {
      lawyer_id: lawyer.user_id,
      client_id: client.user_id,
      weekly_hours: 35,
      starts_at: new Date(),
      ends_at: new Date(),
      base_monthly_salary: 1000,
      magic_link_token: "token",
    },
  });

  const salary = await prisma.salary.create({
    data: {
      legal_case_id: legalCase.id,
      date: new Date(),
      amount: 1000,
    },
  });

  const legalCase2 = await prisma.legalCase.create({
    data: {
      lawyer_id: lawyer.user_id,
      client_id: client2.user_id,
      weekly_hours: 35,
      starts_at: new Date(),
      ends_at: new Date(),
      base_monthly_salary: 1000,
      magic_link_token: "token",
    },
  });

  const legalCase3 = await prisma.legalCase.create({
    data: {
      lawyer_id: lawyer.user_id,
      client_id: client3.user_id,
      weekly_hours: 35,
      starts_at: new Date(),
      ends_at: new Date(),
      base_monthly_salary: 1000,
      magic_link_token: "token",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
