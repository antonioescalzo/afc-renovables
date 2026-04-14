import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Obtener estadísticas para el dashboard
    const totalProjects = await prisma.project.count();
    const totalClients = await prisma.client.count();
    const totalTeams = await prisma.team.count();
    const totalMaterials = await prisma.material.count();

    // Proyectos por estado
    const projectsByStatus = await prisma.project.groupBy({
      by: ["status"],
      _count: true,
    });

    // Proyectos completados
    const completedProjects = await prisma.project.findMany({
      where: { status: "completado" },
      select: {
        actualCost: true,
        actualHours: true,
        estimatedCost: true,
        estimatedHours: true,
      },
    });

    // Calcular costos y eficiencia
    const totalRevenue = completedProjects.reduce((sum, p) => sum + p.actualCost, 0);
    const totalHoursWorked = completedProjects.reduce((sum, p) => sum + p.actualHours, 0);

    const projectsInCourse = await prisma.project.findMany({
      where: { status: "en_curso" },
      select: { actualCost: true, estimatedCost: true, actualHours: true, estimatedHours: true },
    });

    const projectedRevenue = projectsInCourse.reduce((sum, p) => sum + p.estimatedCost, 0);
    const projectedHours = projectsInCourse.reduce((sum, p) => sum + p.estimatedHours, 0);

    // Inventario bajo
    const lowInventory = await prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: prisma.inventoryItem.fields.minThreshold },
      },
      include: { material: true },
      take: 5,
    });

    // Equipos y horas
    const teamsData = await prisma.team.findMany({
      include: {
        workHours: {
          select: { hoursWorked: true },
        },
      },
    });

    const teamsStats = teamsData.map((team) => ({
      name: team.name,
      totalHours: team.workHours.reduce((sum, wh) => sum + wh.hoursWorked, 0),
      hourlyRate: team.hourlyRate,
    }));

    return NextResponse.json({
      metrics: {
        totalProjects,
        totalClients,
        totalTeams,
        totalMaterials,
        totalRevenue,
        totalHoursWorked,
        projectedRevenue,
        projectedHours,
      },
      projectsByStatus: projectsByStatus.map((ps) => ({
        status: ps.status,
        count: ps._count,
      })),
      lowInventory: lowInventory.map((item) => ({
        name: item.material.name,
        current: item.quantity,
        minimum: item.minThreshold,
        location: item.location,
      })),
      teamsStats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
