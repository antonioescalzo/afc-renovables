// This script populates the database with realistic demo data
// Run with: npx prisma db seed

import { PrismaClient } from "../lib/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.workHours.deleteMany({});
  await prisma.materialsInProject.deleteMany({});
  await prisma.projectTeamAssignment.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.team.deleteMany({});

  // 1. CREATE TEAMS (4 equipos)
  console.log("📍 Creating teams...");
  const teamA = await prisma.team.create({
    data: {
      name: "Equipo A",
      description: "Equipo especializado en instalaciones residenciales",
      hourlyRate: 45.0,
    },
  });

  const teamB = await prisma.team.create({
    data: {
      name: "Equipo B",
      description: "Equipo especializado en instalaciones comerciales",
      hourlyRate: 48.0,
    },
  });

  const teamC = await prisma.team.create({
    data: {
      name: "Equipo C",
      description: "Equipo de mantenimiento y servicios",
      hourlyRate: 42.0,
    },
  });

  const teamD = await prisma.team.create({
    data: {
      name: "Equipo D",
      description: "Equipo de proyectos grandes",
      hourlyRate: 50.0,
    },
  });

  // 2. CREATE MATERIALS (Productos)
  console.log("🔧 Creating materials...");
  const panelSolar450 = await prisma.material.create({
    data: {
      name: "Panel Solar 450W",
      code: "PANEL-450W",
      category: "paneles_solares",
      description: "Monocristalino de alta eficiencia",
      unitPrice: 180.0,
    },
  });

  const panelSolar550 = await prisma.material.create({
    data: {
      name: "Panel Solar 550W",
      code: "PANEL-550W",
      category: "paneles_solares",
      description: "Monocristalino última generación",
      unitPrice: 220.0,
    },
  });

  const inversor = await prisma.material.create({
    data: {
      name: "Inversor Híbrido 8kW",
      code: "INV-8KW",
      category: "inversores",
      description: "Con almacenamiento en batería",
      unitPrice: 2500.0,
    },
  });

  const cable4mm = await prisma.material.create({
    data: {
      name: "Cable Solar 4mm²",
      code: "CABLE-4MM",
      category: "cables",
      description: "Rojo/Negro, metro",
      unitPrice: 2.5,
    },
  });

  const soporte = await prisma.material.create({
    data: {
      name: "Soporte Aluminio",
      code: "SOPORTE-ALU",
      category: "soportes",
      description: "Sistema de fijación para tejado",
      unitPrice: 45.0,
    },
  });

  const bateria = await prisma.material.create({
    data: {
      name: "Batería Litio 10kWh",
      code: "BATT-10KWH",
      category: "baterias",
      description: "Sistema de almacenamiento",
      unitPrice: 4500.0,
    },
  });

  // 3. CREATE INVENTORY (Stock inicial)
  console.log("📦 Creating inventory...");
  await prisma.inventoryItem.createMany({
    data: [
      { materialId: panelSolar450.id, quantity: 150, location: "A-1", minThreshold: 20 },
      { materialId: panelSolar550.id, quantity: 85, location: "A-2", minThreshold: 15 },
      { materialId: inversor.id, quantity: 25, location: "B-1", minThreshold: 5 },
      { materialId: cable4mm.id, quantity: 2000, location: "C-1", minThreshold: 500 },
      { materialId: soporte.id, quantity: 300, location: "D-1", minThreshold: 50 },
      { materialId: bateria.id, quantity: 12, location: "B-2", minThreshold: 3 },
    ],
  });

  // 4. CREATE CLIENTS (Clientes)
  console.log("👥 Creating clients...");
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Residencial García López",
        email: "garcia@example.com",
        phone: "612345678",
        address: "Calle Mayor 123",
        city: "Madrid",
        province: "Madrid",
        postalCode: "28001",
      },
    }),
    prisma.client.create({
      data: {
        name: "Empresa Construcción ABC",
        email: "contacto@abc-construccion.com",
        phone: "913456789",
        address: "Polígono Industrial Sur",
        city: "Barcelona",
        province: "Barcelona",
        postalCode: "08001",
      },
    }),
    prisma.client.create({
      data: {
        name: "Agrícola Fernández",
        email: "info@agricola.es",
        phone: "722345678",
        address: "Finca El Olivar",
        city: "Córdoba",
        province: "Córdoba",
        postalCode: "14001",
      },
    }),
    prisma.client.create({
      data: {
        name: "Hotel Costa Blanca",
        email: "gerencia@hotelcosta.es",
        phone: "965123456",
        address: "Paseo Marítimo 45",
        city: "Benidorm",
        province: "Alicante",
        postalCode: "03580",
      },
    }),
    prisma.client.create({
      data: {
        name: "Fábrica Textil López",
        email: "admin@fabricatextil.es",
        phone: "934567890",
        address: "Avenida Industrial 78",
        city: "Tarrasa",
        province: "Barcelona",
        postalCode: "08222",
      },
    }),
  ]);

  // 5. CREATE PROJECTS (Proyectos variados)
  console.log("🏗️ Creating projects...");
  const now = new Date();

  const projects = [
    // COMPLETADOS
    await prisma.project.create({
      data: {
        name: "Instalación Residencial García - 6kW",
        description: "Vivienda unifamiliar con 12 paneles",
        clientId: clients[0].id,
        status: "completado",
        location: "Calle Mayor 123, Madrid",
        estimatedHours: 16,
        actualHours: 17.5,
        estimatedCost: 8500,
        actualCost: 8900,
        startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    }),
    await prisma.project.create({
      data: {
        name: "Edificio Comercial ABC - 25kW",
        description: "Techo empresa construcción + 50 paneles",
        clientId: clients[1].id,
        status: "completado",
        location: "Polígono Industrial Sur",
        estimatedHours: 64,
        actualHours: 62,
        estimatedCost: 32000,
        actualCost: 31500,
        startDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
      },
    }),

    // EN CURSO
    await prisma.project.create({
      data: {
        name: "Sistema Agrícola Fernández - 12kW",
        description: "Instalación en explotación agrícola",
        clientId: clients[2].id,
        status: "en_curso",
        location: "Finca El Olivar, Córdoba",
        estimatedHours: 32,
        actualHours: 18,
        estimatedCost: 15000,
        actualCost: 8200,
        startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),
    await prisma.project.create({
      data: {
        name: "Hotel Costa Blanca - 40kW",
        description: "Sistema con almacenamiento en batería",
        clientId: clients[3].id,
        status: "en_curso",
        location: "Paseo Marítimo 45, Benidorm",
        estimatedHours: 80,
        actualHours: 35,
        estimatedCost: 50000,
        actualCost: 22000,
        startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),

    // PLANIFICADOS
    await prisma.project.create({
      data: {
        name: "Fábrica Textil López - 30kW",
        description: "Cubiertas industriales, instalación fase 1",
        clientId: clients[4].id,
        status: "planificado",
        location: "Avenida Industrial 78, Tarrasa",
        estimatedHours: 60,
        actualHours: 0,
        estimatedCost: 38000,
        actualCost: 0,
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),
    await prisma.project.create({
      data: {
        name: "Residencial Nueva Andalucía - 8kW",
        description: "Vivienda moderna con almacenamiento",
        clientId: clients[0].id,
        status: "planificado",
        location: "Marbella, Málaga",
        estimatedHours: 24,
        actualHours: 0,
        estimatedCost: 12000,
        actualCost: 0,
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),
    await prisma.project.create({
      data: {
        name: "Oficinas Tecnológicas - 15kW",
        description: "Centro de datos con sistema de respaldo",
        clientId: clients[1].id,
        status: "planificado",
        location: "Madrid Tech Hub",
        estimatedHours: 40,
        actualHours: 0,
        estimatedCost: 22000,
        actualCost: 0,
        startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),
    await prisma.project.create({
      data: {
        name: "Granja Solar Tenerife - 50kW",
        description: "Proyecto invernadero agrícola",
        clientId: clients[2].id,
        status: "planificado",
        location: "Tenerife, Islas Canarias",
        estimatedHours: 100,
        actualHours: 0,
        estimatedCost: 60000,
        actualCost: 0,
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: null,
      },
    }),
  ];

  // 6. ASSIGN TEAMS TO PROJECTS
  console.log("👨‍💼 Assigning teams to projects...");
  await Promise.all([
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[0].id, teamId: teamA.id, role: "principal" },
    }),
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[1].id, teamId: teamB.id, role: "principal" },
    }),
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[1].id, teamId: teamC.id, role: "soporte" },
    }),
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[2].id, teamId: teamA.id, role: "principal" },
    }),
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[3].id, teamId: teamD.id, role: "principal" },
    }),
    prisma.projectTeamAssignment.create({
      data: { projectId: projects[3].id, teamId: teamB.id, role: "soporte" },
    }),
  ]);

  // 7. CREATE WORK HOURS (Historial de horas)
  console.log("⏰ Creating work hours records...");
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    await prisma.workHours.create({
      data: {
        teamId: [teamA.id, teamB.id, teamC.id, teamD.id][Math.floor(Math.random() * 4)],
        projectId: projects[Math.floor(Math.random() * 2)].id,
        hoursWorked: 6 + Math.random() * 4,
        date: date,
        description: "Trabajos de instalación y montaje",
      },
    });
  }

  // 8. CREATE MATERIALS USAGE
  console.log("🔌 Creating material usage records...");
  await Promise.all([
    prisma.materialsInProject.create({
      data: {
        projectId: projects[0].id,
        materialId: panelSolar450.id,
        quantityUsed: 12,
      },
    }),
    prisma.materialsInProject.create({
      data: {
        projectId: projects[0].id,
        materialId: cable4mm.id,
        quantityUsed: 150,
      },
    }),
    prisma.materialsInProject.create({
      data: {
        projectId: projects[1].id,
        materialId: panelSolar550.id,
        quantityUsed: 50,
      },
    }),
    prisma.materialsInProject.create({
      data: {
        projectId: projects[1].id,
        materialId: inversor.id,
        quantityUsed: 2,
      },
    }),
    prisma.materialsInProject.create({
      data: {
        projectId: projects[2].id,
        materialId: panelSolar450.id,
        quantityUsed: 24,
      },
    }),
  ]);

  // 9. CREATE INVENTORY MOVEMENTS (Historial)
  console.log("📊 Creating inventory movements...");
  await Promise.all([
    prisma.inventoryMovement.create({
      data: {
        materialId: panelSolar450.id,
        type: "entrada",
        quantity: 50,
        reason: "Compra proveedor Q-Energy",
        reference: "PO-2026-001",
        date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.inventoryMovement.create({
      data: {
        materialId: panelSolar550.id,
        type: "entrada",
        quantity: 85,
        reason: "Compra proveedor SolarTech",
        reference: "PO-2026-002",
        date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.inventoryMovement.create({
      data: {
        materialId: panelSolar450.id,
        type: "salida",
        quantity: 12,
        reason: "Uso proyecto residencial",
        reference: projects[0].id,
        date: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`✨ Created ${projects.length} projects`);
  console.log(`👥 Created 4 teams`);
  console.log(`📦 Created 6 materials with inventory`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
