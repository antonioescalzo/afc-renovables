import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        workHours: { select: { hoursWorked: true, date: true } },
        projectAssignments: { select: { project: { select: { name: true, status: true } } } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      teams.map((team) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        hourlyRate: team.hourlyRate,
        totalHoursWorked: team.workHours.reduce((sum, wh) => sum + wh.hoursWorked, 0),
        projectCount: team.projectAssignments.length,
        activeProjects: team.projectAssignments
          .filter((pa) => pa.project.status === "en_curso")
          .map((pa) => pa.project.name),
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
