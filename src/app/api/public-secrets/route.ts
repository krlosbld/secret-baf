// src/app/api/public-secrets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Secret } from "@prisma/client";

export async function GET() {
  try {
    const secrets = await prisma.secret.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        content: true,
        revealed: true,
        points: true,
        createdAt: true, // on le garde pour trier, mais on NE l’envoie pas
      },
    });

    // IMPORTANT : on typpe bien s: Secret pour éviter "implicitly any"
    const publicSecrets = secrets.map((s: Secret) => ({
      id: s.id,
      content: s.content,
      revealed: s.revealed,
      // Le nom ne sort que si le secret est révélé
      name: s.revealed ? s.name : "Anonyme",
      // Optionnel : si tu veux afficher les points côté public, garde-le.
      // Sinon supprime la ligne suivante.
      points: s.points,
    }));

    return NextResponse.json({ secrets: publicSecrets });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur serveur (public-secrets)." },
      { status: 500 }
    );
  }
}