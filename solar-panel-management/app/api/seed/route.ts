import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST() {
  try {
    console.log("🌱 Iniciando seed de datos...");

    // Limpiar BD existente
    await prisma.workHours.deleteMany({});
    await prisma.materialsInProject.deleteMany({});
    await prisma.projectTeamAssignment.deleteMany({});
    await prisma.inventoryMovement.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.material.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.team.deleteMany({});

    // 1. CREAR EQUIPOS (4 equipos de trabajo)
    const teams = await Promise.all([
      prisma.team.create({
        data: {
          name: "Equipo A",
          description: "Especializado en instalaciones residenciales",
          hourlyRate: 45.0,
        },
      }),
      prisma.team.create({
        data: {
          name: "Equipo B",
          description: "Especializado en instalaciones comerciales",
          hourlyRate: 48.0,
        },
      }),
      prisma.team.create({
        data: {
          name: "Equipo C",
          description: "Mantenimiento y servicios",
          hourlyRate: 42.0,
        },
      }),
      prisma.team.create({
        data: {
          name: "Equipo D",
          description: "Proyectos grandes e industriales",
          hourlyRate: 50.0,
        },
      }),
    ]);

    // 2. CREAR MATERIALES (Productos)
    const materials = await Promise.all([
      prisma.material.create({
        data: {
          name: "Panel Solar 450W",
          code: "PANEL-450W",
          category: "paneles_solares",
          description: "Monocristalino de alta eficiencia",
          unitPrice: 180.0,
        },
      }),
      prisma.material.create({
        data: {
          name: "Panel Solar 550W",
          code: "PANEL-550W",
          category: "paneles_solares",
          description: "Monocristalino última generación",
          unitPrice: 220.0,
        },
      }),
      prisma.material.create({
        data: {
          name: "Inversor Híbrido 8kW",
          code: "INV-8KW",
          category: "inversores",
          description: "Con almacenamiento en batería",
          unitPrice: 2500.0,
        },
      }),
      prisma.material.create({
        data: {
          name: "Cable Solar 4mm²",
          code: "CABLE-4MM",
          category: "cables",
          description: "Rojo/Negro, metro",
          unitPrice: 2.5,
        },
      }),
      prisma.material.create({
        data: {
          name: "Soporte Aluminio",
          code: "SOPORTE-ALU",
          category: "soportes",
          description: "Sistema de fijación para tejado",
          unitPrice: 45.0,
        },
      }),
      prisma.material.create({
        data: {
          name: "Batería Litio 10kWh",
          code: "BATT-10KWH",
          category: "baterias",
          description: "Sistema de almacenamiento",
          unitPrice: 4500.0,
        },
      }),
    ]);

    // 3. CREAR INVENTARIO
    await Promise.all([
      prisma.inventoryItem.create({
        data: {
          materialId: materials[0].id,
          quantity: 150,
          location: "A-1",
          minThreshold: 20,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          materialId: materials[1].id,
          quantity: 85,
          location: "A-2",
          minThreshold: 15,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          materialId: materials[2].id,
          quantity: 25,
          location: "B-1",
          minThreshold: 5,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          materialId: materials[3].id,
          quantity: 2000,
          location: "C-1",
          minThreshold: 500,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          materialId: materials[4].id,
          quantity: 300,
          location: "D-1",
          minThreshold: 50,
        },
      }),
      prisma.inventoryItem.create({
        data: {
          materialId: materials[5].id,
          quantity: 12,
          location: "B-2",
          minThreshold: 3,
        },
      }),
    ]);

    // 4. CREAR CLIENTES
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

    // 5. CREAR PROYECTOS
    const now = new Date();
    const projects = await Promise.all([
      // COMPLETADOS
      prisma.project.create({
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
      prisma.project.create({
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
      prisma.project.create({
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
      prisma.project.create({
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
      prisma.project.create({
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
      prisma.project.create({
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
      prisma.project.create({
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
    ]);

    // 6. ASIGNAR EQUIPOS A PROYECTOS
    await Promise.all([
      prisma.projectTeamAssignment.create({
        data: { projectId: projects[0].id, teamId: teams[0].id, role: "principal" },
      }),
      prisma.projectTeamAssignment.create({
        data: { projectId: projects[1].id, teamId: teams[1].id, role: "principal" },
      }),
      prisma.projectTeamAssignment.create({
        data: { projectId: projects[1].id, teamId: teams[2].id, role: "soporte" },
      }),
      prisma.projectTeamAssignment.create({
        data: { projectId: projects[2].id, teamId: teams[0].id, role: "principal" },
      }),
      prisma.projectTeamAssignment.create({
        data: { projectId: projects[3].id, teamId: teams[3].id, role: "principal" },
      }),
    ]);

    // 7. CREAR REGISTROS DE HORAS
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      await prisma.workHours.create({
        data: {
          teamId: teams[Math.floor(Math.random() * 4)].id,
          projectId: projects[Math.floor(Math.random() * 2)].id,
          hoursWorked: 6 + Math.random() * 4,
          date: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
          description: "Trabajos de instalación y montaje",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Base de datos sembrada exitosamente",
      data: {
        teams: teams.length,
        materials: materials.length,
        clients: clients.length,
        projects: projects.length,
      },
    });
  } catch (error) {
    console.error("❌ Error en seed:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
