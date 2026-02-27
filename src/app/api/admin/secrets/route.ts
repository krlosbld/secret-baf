import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return Boolean(process.env.ADMIN_CODE && token === process.env.ADMIN_CODE);
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const secrets = await prisma.secret.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ secrets });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const points = body?.points;
  const revealed = body?.revealed;

  if (!id) {
    return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  }

  const updated = await prisma.secret.update({
    where: { id },
    data: {
      ...(typeof points === "number" ? { points } : {}),
      ...(typeof revealed === "boolean" ? { revealed } : {}),
    },
  });

  return NextResponse.json({ updated });
}