import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const services = [
    {
      name: "Basic Wash",
      description: "Exterior hand wash and dry",
      priceCents: 2500,
      durationMins: 45
    },
    {
      name: "Deluxe Wash",
      description: "Exterior wash + tire shine + wax",
      priceCents: 4500,
      durationMins: 75
    },
    {
      name: "Interior Detail",
      description: "Interior vacuum, wipe-down, and windows",
      priceCents: 5500,
      durationMins: 90
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });