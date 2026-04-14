import { PrismaClient } from "./.prisma/client/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando BD...");
  
  // Limpiar
  await prisma.workHours.deleteMany({});
  await prisma.materialsInProject.deleteMany({});
  await prisma.projectTeamAssignment.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.team.deleteMany({});

  // Equipos
  const teams = await Promise.all([
    prisma.team.create({ data: { name: "Equipo A", hourlyRate: 45 } }),
    prisma.team.create({ data: { name: "Equipo B", hourlyRate: 48 } }),
    prisma.team.create({ data: { name: "Equipo C", hourlyRate: 42 } }),
    prisma.team.create({ data: { name: "Equipo D", hourlyRate: 50 } }),
  ]);

  console.log("✅ Seeding completado!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
