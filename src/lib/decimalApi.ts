const COIN_ENDPOINTS = [
  (q: string) => `https://api.decimalchain.com/api/v1/coins/${encodeURIComponent(q)}`,
  (q: string) => `https://api.decimalchain.com/api/v1/coins?limit=1&q=${encodeURIComponent(q)}`,
]

export type FoundCoin = {
  symbol: string
  title: string
  creator: string
  contract: string
  createdAt: string
  ageHours: number
  txHash?: string
}

function hoursSince(iso: string): number {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY
  return Math.max(0, (Date.now() - t) / 3_600_000)
}

function formatRuDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalizeCoin(raw: Record<string, unknown>): FoundCoin | null {
  const symbol = String(raw.symbol || raw.ticker || '').toUpperCase()
  if (!symbol) return null
  const createdAtRaw = String(raw.createdAt || raw.created_at || raw.timestamp || '')
  const contract = String(
    raw.address || raw.contract || raw.evmAddress || raw.creator || symbol,
  )
  return {
    symbol,
    title: String(raw.title || raw.name || symbol),
    creator: String(raw.creator || ''),
    contract,
    createdAt: createdAtRaw ? formatRuDate(createdAtRaw) : '—',
    ageHours: createdAtRaw ? Math.round(hoursSince(createdAtRaw) * 10) / 10 : 0,
    txHash: raw.txHash ? String(raw.txHash) : undefined,
  }
}

export async function lookupCoinByTicker(ticker: string): Promise<FoundCoin | null> {
  const q = ticker.trim()
  if (!q) return null

  for (const makeUrl of COIN_ENDPOINTS) {
    try {
      const res = await fetch(makeUrl(q), { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = (await res.json()) as Record<string, unknown>
      if (data.symbol || data.ticker) return normalizeCoin(data)
      const list = (data.coins || data.result || data.data) as
        | Record<string, unknown>[]
        | undefined
      if (Array.isArray(list) && list[0]) {
        const found =
          list.find(
            (c) => String(c.symbol || '').toUpperCase() === q.toUpperCase(),
          ) || list[0]
        return normalizeCoin(found)
      }
    } catch {
      /* try next */
    }
  }
  return null
}

export function isTxHash(value: string): boolean {
  const v = value.trim()
  return /^0x[a-fA-F0-9]{16,}$/.test(v) || /^[a-fA-F0-9]{32,}$/.test(v)
}

export function shortAddr(addr: string): string {
  if (!addr || addr.length < 12) return addr || '—'
  return `${addr.slice(0, 8)}…${addr.slice(-4)}`
}
