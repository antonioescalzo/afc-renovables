import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      include: { material: true },
      orderBy: { material: { category: "asc" } },
    });

    return NextResponse.json(
      inventory.map((item) => ({
        id: item.id,
        name: item.material.name,
        code: item.material.code,
        category: item.material.category,
        quantity: item.quantity,
        location: item.location,
        unitPrice: item.material.unitPrice,
        totalValue: item.quantity * item.material.unitPrice,
        minThreshold: item.minThreshold,
        isLow: item.quantity <= item.minThreshold,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
