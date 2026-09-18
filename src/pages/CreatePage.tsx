import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Helper = {
  name: string
  role: string
  wallet: string
  share: number
  txHash: string
  confirmed: boolean
}

type LookupStatus = 'idle' | 'loading' | 'ok' | 'too_old' | 'not_found'

const emptyHelper = (): Helper => ({
  name: '',
  role: 'Консультант',
  wallet: '',
  share: 0,
  txHash: '',
  confirmed: false,
})

/** Демо: «свежий» токен — 18 ч назад */
const DEMO_TOKEN_AGE_HOURS = 18
const MAX_AGE_HOURS = 72

function shortHash(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return `0x${h.toString(16).padStart(8, '0')}…${(h ^ 0xabcdef).toString(16).slice(0, 6)}`
}

export function CreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [ownerWallet, setOwnerWallet] = useState(
    '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  )
  const [lookupMode, setLookupMode] = useState<'ticker' | 'contract'>('ticker')
  const [ticker, setTicker] = useState('BLOG')
  const [contract, setContract] = useState('')
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle')
  const [tokenMeta, setTokenMeta] = useState<{
    symbol: string
    contract: string
    createdAt: string
    ageHours: number
  } | null>(null)

  const [helpers, setHelpers] = useState<Helper[]>([
    {
      name: 'Alex',
      role: 'Консультант',
      wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
      share: 60,
      txHash: '',
      confirmed: false,
    },
    {
      name: 'Max',
      role: 'Маркетинг',
      wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
      share: 40,
      txHash: '',
      confirmed: false,
    },
  ])

  const [ownerTx, setOwnerTx] = useState('')
  const [ownerConfirmed, setOwnerConfirmed] = useState(false)
  const [done, setDone] = useState(false)

  const totalShare = useMemo(
    () => helpers.reduce((sum, p) => sum + (Number(p.share) || 0), 0),
    [helpers],
  )

  const allHelpersConfirmed = helpers.every((h) => h.confirmed)
  const canFinish = ownerConfirmed && allHelpersConfirmed && helpers.length > 0

  const updateHelper = (index: number, patch: Partial<Helper>) => {
    setHelpers((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  const removeHelper = (index: number) => {
    setHelpers((prev) => prev.filter((_, i) => i !== index))
  }

  const resolveToken = () => {
    setLookupStatus('loading')
    window.setTimeout(() => {
      const symbol = lookupMode === 'ticker' ? ticker.trim().toUpperCase() : 'BLOG'
      const query =
        lookupMode === 'ticker' ? ticker.trim() : contract.trim()

      if (!query || !ownerWallet.trim()) {
        setLookupStatus('not_found')
        setTokenMeta(null)
        return
      }

      // Демо-логика: тикер OLD → старше 72ч; иначе свежий
      if (symbol === 'OLD' || query.toLowerCase().includes('old')) {
        setLookupStatus('too_old')
        setTokenMeta({
          symbol: symbol || 'OLD',
          contract: '0xOLD000000000000000000000000000000000001',
          createdAt: '10.09.2026 14:20',
          ageHours: 196,
        })
        return
      }

      const resolvedContract =
        lookupMode === 'contract' && contract.trim()
          ? contract.trim()
          : `0x${symbol.padEnd(40, '0').slice(0, 40)}`

      setTokenMeta({
        symbol: symbol || 'TOKEN',
        contract: resolvedContract,
        createdAt: '17.09.2026 18:40',
        ageHours: DEMO_TOKEN_AGE_HOURS,
      })
      setLookupStatus('ok')
    }, 600)
  }

  const confirmOwner = () => {
    const hash = ownerTx.trim() || shortHash(`owner-${ownerWallet}-${Date.now()}`)
    setOwnerTx(hash)
    setOwnerConfirmed(true)
  }

  const confirmHelper = (index: number) => {
    const h = helpers[index]
    const hash = h.txHash.trim() || shortHash(`helper-${h.wallet}-${Date.now()}`)
    updateHelper(index, { txHash: hash, confirmed: true })
  }

  const finish = () => {
    setDone(true)
    window.setTimeout(() => navigate('/cabinet'), 1400)
  }

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="page-title">Регистрация токена в системе</h1>
        <p className="page-sub">
          Владелец токена подтверждает адрес и факт выпуска. Бюджет вознаграждения —
          только для помощников; владелец о нём может не знать.
        </p>

        {done && (
          <div className="success-banner">
            {tokenMeta?.symbol || ticker} зарегистрирован. Все подтверждения получены.
            Переходим в кабинет…
          </div>
        )}

        <div className="steps">
          {[
            [1, 'Владелец и токен'],
            [2, 'Помощники'],
            [3, 'Транзакции'],
          ].map(([n, label]) => (
            <span
              key={n}
              className={`step-chip${step === n ? ' active' : ''}${step > Number(n) ? ' done' : ''}`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="panel">
          {step === 1 && (
            <div className="form-grid">
              <div className="note">
                Нужны только <strong>адрес владельца</strong> и токен:{' '}
                <strong>тикер</strong> (поиск автоматически) или{' '}
                <strong>адрес смарт-контракта</strong>. Токен должен быть создан не
                более <strong>{MAX_AGE_HOURS} часов</strong> до регистрации.
              </div>

              <div className="field">
                <label htmlFor="owner">Адрес владельца (создателя токена)</label>
                <input
                  id="owner"
                  value={ownerWallet}
                  onChange={(e) => setOwnerWallet(e.target.value)}
                  placeholder="0x…"
                />
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={`tab${lookupMode === 'ticker' ? ' active' : ''}`}
                  onClick={() => setLookupMode('ticker')}
                >
                  По тикеру
                </button>
                <button
                  type="button"
                  className={`tab${lookupMode === 'contract' ? ' active' : ''}`}
                  onClick={() => setLookupMode('contract')}
                >
                  По смарт-контракту
                </button>
              </div>

              {lookupMode === 'ticker' ? (
                <div className="field">
                  <label htmlFor="ticker">Тикер</label>
                  <input
                    id="ticker"
                    value={ticker}
                    onChange={(e) => {
                      setTicker(e.target.value.toUpperCase().slice(0, 12))
                      setLookupStatus('idle')
                    }}
                    placeholder="BLOG"
                  />
                </div>
              ) : (
                <div className="field">
                  <label htmlFor="contract">Адрес смарт-контракта</label>
                  <input
                    id="contract"
                    value={contract}
                    onChange={(e) => {
                      setContract(e.target.value)
                      setLookupStatus('idle')
                    }}
                    placeholder="0x…"
                  />
                </div>
              )}

              <button
                type="button"
                className="btn btn-ghost"
                onClick={resolveToken}
                disabled={lookupStatus === 'loading'}
              >
                {lookupStatus === 'loading' ? 'Ищем токен…' : 'Найти токен в DecimalChain'}
              </button>

              {lookupStatus === 'ok' && tokenMeta && (
                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-label">Тикер</div>
                    <div className="stat-value">{tokenMeta.symbol}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Возраст</div>
                    <div className="stat-value" style={{ fontSize: '1.35rem' }}>
                      {tokenMeta.ageHours} ч
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Создан</div>
                    <div className="stat-value" style={{ fontSize: '1rem' }}>
                      {tokenMeta.createdAt}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Контракт</div>
                    <div className="stat-value" style={{ fontSize: '0.85rem' }}>
                      {tokenMeta.contract.slice(0, 10)}…{tokenMeta.contract.slice(-6)}
                    </div>
                  </div>
                </div>
              )}

              {lookupStatus === 'too_old' && tokenMeta && (
                <div className="note" style={{ borderColor: 'rgba(255,107,107,0.4)' }}>
                  Токен {tokenMeta.symbol} создан {tokenMeta.ageHours} ч назад — больше
                  лимита {MAX_AGE_HOURS} ч. Регистрация недоступна.
                </div>
              )}

              {lookupStatus === 'not_found' && (
                <div className="note" style={{ borderColor: 'rgba(255,107,107,0.4)' }}>
                  Укажите адрес владельца и тикер или контракт.
                </div>
              )}

              <p className="section-sub">
                Демо: тикер <code>OLD</code> — отказ по возрасту; любой другой — успех.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                disabled={lookupStatus !== 'ok'}
                onClick={() => setStep(2)}
              >
                Далее: помощники
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-grid">
              <div className="note">
                Здесь только те, кто <strong>помогает</strong> запускать токен. Доли
                делят маркетинговый бюджет системы. Владелец в этот список не входит и
                бюджет не видит.
              </div>

              <div className="stat">
                <div className="stat-label">Владелец (без доли в бюджете)</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>
                  {ownerWallet.slice(0, 10)}…{ownerWallet.slice(-6)} ·{' '}
                  {tokenMeta?.symbol}
                </div>
              </div>

              {helpers.map((p, i) => (
                <div className="participant-row" key={i}>
                  <div className="field">
                    <label>Имя</label>
                    <input
                      value={p.name}
                      onChange={(e) => updateHelper(i, { name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Роль</label>
                    <select
                      value={p.role}
                      onChange={(e) => updateHelper(i, { role: e.target.value })}
                    >
                      <option>Консультант</option>
                      <option>Маркетинг</option>
                      <option>Техподдержка</option>
                      <option>Участник</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Wallet</label>
                    <input
                      value={p.wallet}
                      onChange={(e) => updateHelper(i, { wallet: e.target.value })}
                      placeholder="0x…"
                    />
                  </div>
                  <div className="field">
                    <label>Доля %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={p.share}
                      onChange={(e) =>
                        updateHelper(i, { share: Number(e.target.value) })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeHelper(i)}
                    disabled={helpers.length <= 1}
                  >
                    Удалить
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setHelpers((prev) => [...prev, emptyHelper()])}
              >
                + Добавить помощника
              </button>

              <div className={`share-total ${totalShare === 100 ? 'ok' : 'bad'}`}>
                Сумма долей помощников: {totalShare}%{' '}
                {totalShare === 100 ? '✓' : '(нужно 100%)'}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                  Назад
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={totalShare !== 100 || helpers.some((h) => !h.wallet.trim())}
                  onClick={() => setStep(3)}
                >
                  Далее: подтверждение транзакциями
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-grid">
              <div className="note">
                Регистрация завершается только после ончейн-подтверждений: транзакция
                от кошелька <strong>владельца</strong> и транзакции от{' '}
                <strong>каждого долевого помощника</strong>. В демо можно «подписать»
                без реального Web3.
              </div>

              <div className="panel-flat">
                <div className="inline-row" style={{ marginBottom: '0.75rem' }}>
                  <span className={`live-dot${!ownerConfirmed ? '' : ''}`} />
                  <strong>1. Подтверждение владельца</strong>
                  {ownerConfirmed && (
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <p className="section-sub" style={{ marginBottom: '0.75rem' }}>
                  Кошелёк {ownerWallet.slice(0, 12)}… должен отправить служебную
                  транзакцию-подтверждение в систему.
                </p>
                <div className="field">
                  <label htmlFor="ownerTx">Tx hash (или сгенерировать демо)</label>
                  <input
                    id="ownerTx"
                    value={ownerTx}
                    disabled={ownerConfirmed}
                    onChange={(e) => setOwnerTx(e.target.value)}
                    placeholder="0x… или оставьте пустым для демо"
                  />
                </div>
                {!ownerConfirmed && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={confirmOwner}>
                    Подтвердить транзакцией владельца
                  </button>
                )}
                {ownerConfirmed && (
                  <a
                    className="token-link"
                    href={`https://explorer.decimalchain.com/transactions/${ownerTx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Смотреть в explorer →
                  </a>
                )}
              </div>

              <div className="panel-flat" style={{ display: 'grid', gap: '1rem' }}>
                <strong>2. Подтверждения долевых участников</strong>
                {helpers.map((h, i) => (
                  <div
                    key={h.wallet + i}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      background: 'rgba(6,20,28,0.4)',
                    }}
                  >
                    <div className="inline-row" style={{ marginBottom: '0.5rem' }}>
                      <strong>
                        {h.name || 'Помощник'} · {h.role} · {h.share}%
                      </strong>
                      {h.confirmed && (
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                    <p className="section-sub" style={{ marginBottom: '0.5rem' }}>
                      {h.wallet.slice(0, 12)}…
                    </p>
                    <div className="field">
                      <label>Tx hash</label>
                      <input
                        value={h.txHash}
                        disabled={h.confirmed}
                        onChange={(e) =>
                          updateHelper(i, { txHash: e.target.value, confirmed: false })
                        }
                        placeholder="0x… или пусто для демо"
                      />
                    </div>
                    {!h.confirmed ? (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => confirmHelper(i)}
                      >
                        Подтвердить транзакцией
                      </button>
                    ) : (
                      <a
                        className="token-link"
                        href={`https://explorer.decimalchain.com/transactions/${h.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Explorer →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-label">Токен</div>
                  <div className="stat-value">{tokenMeta?.symbol}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Владелец</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {ownerConfirmed ? 'подтверждён' : 'ожидает'}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Помощники</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {helpers.filter((h) => h.confirmed).length}/{helpers.length}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                  Назад
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!canFinish}
                  onClick={finish}
                >
                  Зарегистрировать в системе
                </button>
                {tokenMeta && (
                  <Link to={`/token/${tokenMeta.symbol}`} className="btn btn-ghost">
                    Страница токена
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
