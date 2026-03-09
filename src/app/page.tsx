'use client'

import { useState } from 'react'

const objectives = [
  { id: 'pdkt', icon: '🌱', label: 'PDKT / Deketin' },
  { id: 'flirt', icon: '🔥', label: 'Flirt / Playful' },
  { id: 'date', icon: '📅', label: 'Ajak Kencan' },
  { id: 'nembak', icon: '💍', label: 'Nembak / Ungkapin' },
]

const tones = ['Balanced', 'Sweet', 'Witty', 'Chill', 'Intense']
const toneEmoji: Record<string, string> = {
  Balanced: '⚖️', Sweet: '🍬', Witty: '😏', Chill: '😎', Intense: '💫'
}

const replyColors: Record<string, { color: string; bg: string }> = {
  PLAYFUL: { color: '#fbbf24', bg: 'rgba(251,191,36,0.07)' },
  ROMANTIC: { color: '#f472b6', bg: 'rgba(244,114,182,0.07)' },
  BOLD: { color: '#a78bfa', bg: 'rgba(167,139,250,0.07)' },
}

interface Reply { type: string; label: string; text: string }

export default function Home() {
  const [obj, setObj] = useState('pdkt')
  const [tone, setTone] = useState('Balanced')
  const [herMsg, setHerMsg] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const generate = async () => {
    if (!herMsg.trim()) { setError('Isi dulu pesan terakhir dari dia ya!'); return }
    setError(''); setReplies([]); setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: obj, tone, herMessage: herMsg, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal generate')
      setReplies(data.replies)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal generate, coba lagi!')
    } finally {
      setLoading(false)
    }
  }

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080610',
      color: '#f0e8f5',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: '36px 16px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 40% at 75% 0%, rgba(232,67,147,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 15% 90%, rgba(139,92,246,0.08) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(232,67,147,0.1)', border: '1px solid rgba(232,67,147,0.25)',
            borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 600,
            color: '#f9a8d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            💘 AI Texting Assistant
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 8vw, 3.8rem)', fontWeight: 900, lineHeight: 1.05,
            background: 'linear-gradient(135deg, #f0e8f5 15%, #e84393 55%, #a855f7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: 12,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            GombalAI
          </h1>
          <p style={{ color: '#6b5f7a', fontSize: 15, fontWeight: 300 }}>
            Bingung mau bales apa? Biar AI yang aturin 💬
          </p>
        </div>

        {/* Card */}
        <div className="fade-up-1" style={{
          background: '#110e1a', border: '1px solid #1e1830',
          borderRadius: 22, overflow: 'hidden',
        }}>

          {/* Objective */}
          <div style={{ padding: '22px 22px 20px', borderBottom: '1px solid #1e1830' }}>
            <SectionLabel>Tujuan lo ngechat dia</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {objectives.map(o => (
                <button key={o.id} onClick={() => setObj(o.id)} style={{
                  background: obj === o.id
                    ? 'linear-gradient(135deg, rgba(232,67,147,0.14), rgba(139,92,246,0.11))'
                    : '#18132280',
                  border: `1.5px solid ${obj === o.id ? '#e84393' : '#2a2040'}`,
                  borderRadius: 13, color: obj === o.id ? '#f0e8f5' : '#5a4e6a',
                  cursor: 'pointer', padding: '13px 14px', textAlign: 'left',
                  fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 9,
                  transition: 'all 0.2s',
                  boxShadow: obj === o.id ? '0 0 24px rgba(232,67,147,0.12)' : 'none',
                }}>
                  <span style={{ fontSize: 18 }}>{o.icon}</span> {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #1e1830', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <SectionLabel>Pesan terakhir dia ke lo</SectionLabel>
              <textarea
                value={herMsg}
                onChange={e => setHerMsg(e.target.value)}
                placeholder='Contoh: "Besok ada acara gak?"'
                rows={3}
                style={textareaStyle}
              />
            </div>
            <div>
              <SectionLabel>Konteks singkat <span style={{ color: '#3d3050', fontWeight: 400 }}>(opsional)</span></SectionLabel>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder='Contoh: "Kenal 2 minggu, match di Bumble"'
                rows={2}
                style={textareaStyle}
              />
            </div>
            <div>
              <SectionLabel>Gaya balasan</SectionLabel>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {tones.map(t => (
                  <button key={t} onClick={() => setTone(t)} style={{
                    background: tone === t ? 'rgba(232,67,147,0.12)' : '#18132280',
                    border: `1.5px solid ${tone === t ? '#e84393' : '#2a2040'}`,
                    borderRadius: 100, color: tone === t ? '#f9a8d4' : '#5a4e6a',
                    cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    padding: '6px 14px', transition: 'all 0.2s',
                  }}>
                    {toneEmoji[t]} {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate */}
          <div style={{ padding: '18px 22px', borderBottom: (replies.length > 0 || loading || error) ? '1px solid #1e1830' : 'none' }}>
            <button onClick={generate} disabled={loading} style={{
              background: loading ? 'rgba(232,67,147,0.25)' : 'linear-gradient(135deg, #e84393, #a855f7)',
              border: 'none', borderRadius: 13, color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 15, fontWeight: 600, padding: '15px 24px', width: '100%',
              transition: 'all 0.2s', letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(232,67,147,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? (
                <>
                  <div className="spinner" style={{
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: 'white', borderRadius: '50%',
                  }} />
                  Lagi mikirin balasan terbaik...
                </>
              ) : '✨ Generate Balasan'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              margin: '0 22px 16px', marginTop: 16,
              padding: '12px 14px', background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
              color: '#fca5a5', fontSize: 13, lineHeight: 1.5,
            }}>
              ❌ {error}
            </div>
          )}

          {/* Results */}
          {replies.length > 0 && (
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3d3050' }}>
                Pilih salah satu, copas, kirim 🚀
              </div>
              {replies.map((r, i) => {
                const cfg = replyColors[r.type] || replyColors.BOLD
                return (
                  <div key={i} style={{
                    background: '#16102280', border: '1px solid #2a2040',
                    borderRadius: 14, overflow: 'hidden',
                    animation: `fadeUp 0.35s ${i * 0.1}s ease both`,
                  }}>
                    <div style={{
                      padding: '8px 14px', fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: cfg.color, background: cfg.bg, borderBottom: '1px solid #2a2040',
                    }}>
                      {r.label}
                    </div>
                    <div style={{ padding: '14px 16px', fontSize: 14, lineHeight: 1.75, color: '#e0d4f0' }}>
                      {r.text}
                    </div>
                    <div style={{ padding: '10px 14px', borderTop: '1px solid #2a2040', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => copy(r.type, r.text)} style={{
                        background: 'transparent',
                        border: `1px solid ${copied === r.type ? '#4ade80' : '#2a2040'}`,
                        borderRadius: 8, color: copied === r.type ? '#4ade80' : '#5a4e6a',
                        cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        padding: '6px 14px', transition: 'all 0.2s',
                      }}>
                        {copied === r.type ? '✅ Tersalin!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>

        <p style={{ textAlign: 'center', color: '#2e2540', fontSize: 12, marginTop: 28, lineHeight: 1.7 }}>
          🔐 Chat kamu tidak disimpan di server manapun<br />
          Made with ❤️ by GombalAI
        </p>

      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#3d3050', marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

const textareaStyle: React.CSSProperties = {
  background: '#18132280', border: '1.5px solid #2a2040', borderRadius: 11,
  color: '#f0e8f5', fontFamily: 'inherit', fontSize: 14,
  padding: '12px 14px', outline: 'none', width: '100%',
  resize: 'vertical', lineHeight: 1.65, transition: 'border-color 0.2s',
}
