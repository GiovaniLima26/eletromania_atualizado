import { NextRequest, NextResponse } from 'next/server'

// Estas variáveis NÃO têm prefixo NEXT_PUBLIC_, então só existem aqui no servidor.
// O navegador nunca tem acesso a esses valores.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'eletromaniadistribuidora@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Eletro@2025'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}