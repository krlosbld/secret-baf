import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name = (body?.name ?? "").toString().trim();
  const content = (body?.content ?? "").toString().trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Nom trop court." }, { status: 400 });
  }
  if (content.length < 5) {
    return NextResponse.json({ error: "Secret trop court." }, { status: 400 });
  }
  if (name.length > 80 || content.length > 1000) {
    return NextResponse.json({ error: "Texte trop long." }, { status: 400 });
  }

  await prisma.secret.create({
    data: { name, content },
  });

  return NextResponse.json({ ok: true });
}