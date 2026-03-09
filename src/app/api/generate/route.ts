import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const objLabels: Record<string, string> = {
  pdkt: 'PDKT & pendekatan santai',
  flirt: 'flirt & playful banter',
  date: 'ajak kencan',
  nembak: 'ungkapin perasaan / nembak',
}

const toneLabels: Record<string, string> = {
  Balanced: 'seimbang antara manis dan natural',
  Sweet: 'manis dan hangat',
  Witty: 'cerdas dan sedikit playful',
  Chill: 'santai dan low-effort tapi tetap engaging',
  Intense: 'dalam dan penuh perasaan',
}

export async function POST(req: NextRequest) {
  try {
    const { objective, tone, herMessage, context } = await req.json()

    if (!herMessage?.trim()) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 })
    }

    const prompt = `Kamu adalah seorang dating coach yang jago banget soal texting dan komunikasi romantis dalam konteks Indonesia.

Situasi:
- Objective: ${objLabels[objective] || objective}
- Gaya yang diinginkan: ${toneLabels[tone] || tone}
${context?.trim() ? `- Konteks: ${context.trim()}` : ''}
- Pesan terakhir dari dia: "${herMessage.trim()}"

Tugasmu: Buat TEPAT 3 opsi balasan chat siap copas dalam bahasa Indonesia yang natural dan sesuai cara ngobrol anak muda Indonesia sekarang.

Format respons HARUS persis seperti ini (tidak ada teks lain):

[PLAYFUL]
{balasan opsi 1 - lebih ringan, bercanda, atau playful}

[ROMANTIC]
{balasan opsi 2 - lebih manis, hangat, atau personal}

[BOLD]
{balasan opsi 3 - lebih berani, direct, atau berkesan}

Rules:
- Setiap balasan 1-3 kalimat, natural seperti orang beneran ngetik
- JANGAN terlalu formal atau kaku
- JANGAN pakai template gombal klise yang norak
- Boleh pakai emoji tapi jangan berlebihan (max 1-2 per balasan)`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (message.content[0] as { text: string }).text

    const playful = raw.match(/\[PLAYFUL\]\s*([\s\S]*?)(?=\[ROMANTIC\]|\[BOLD\]|$)/i)?.[1]?.trim()
    const romantic = raw.match(/\[ROMANTIC\]\s*([\s\S]*?)(?=\[BOLD\]|\[PLAYFUL\]|$)/i)?.[1]?.trim()
    const bold = raw.match(/\[BOLD\]\s*([\s\S]*?)(?=\[PLAYFUL\]|\[ROMANTIC\]|$)/i)?.[1]?.trim()

    return NextResponse.json({
      replies: [
        { type: 'PLAYFUL', label: '😄 Playful', text: playful || '' },
        { type: 'ROMANTIC', label: '💗 Romantic', text: romantic || '' },
        { type: 'BOLD', label: '⚡ Bold', text: bold || '' },
      ].filter(r => r.text)
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
