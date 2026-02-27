import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const secrets = await prisma.secret.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      revealed: true,
      name: true,
    },
  });

  // On anonymise : le nom ne sort que si revealed === true
  const publicSecrets = secrets.map((s) => ({
    id: s.id,
    content: s.content,
    createdAt: s.createdAt,
    revealed: s.revealed,
    name: s.revealed ? s.name : null,
  }));

  return NextResponse.json({ secrets: publicSecrets });
}