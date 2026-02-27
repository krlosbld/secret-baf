export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const secrets = await prisma.secret.findMany({
      where: { revealed: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true
      }
    })

    return NextResponse.json(secrets)
  } catch (e: any) {
    console.error('[api/public-secrets GET]', e?.message || e)
    return NextResponse.json(
      { error: e?.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}