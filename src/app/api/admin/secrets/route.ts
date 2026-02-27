export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const secrets = await prisma.secret.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(secrets)
  } catch (e: any) {
    console.error('[api/secrets GET]', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Erreur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { author, content } = await req.json().catch(() => ({}))
    const a = typeof author === 'string' ? author.trim() : ''
    const c = typeof content === 'string' ? content.trim() : ''

    if (!c) {
      return NextResponse.json({ error: 'content requis' }, { status: 400 })
    }

    const created = await prisma.secret.create({
      data: { author: a || null, content: c },
    })

    return NextResponse.json({ ok: true, secret: created })
  } catch (e: any) {
    console.error('[api/secrets POST]', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Erreur' }, { status: 500 })
  }
}