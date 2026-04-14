import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        projects: { select: { id: true, status: true, actualCost: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      clients.map((c) => ({
        ...c,
        totalInvestment: c.projects.reduce((sum, p) => sum + p.actualCost, 0),
        projectCount: c.projects.length,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
