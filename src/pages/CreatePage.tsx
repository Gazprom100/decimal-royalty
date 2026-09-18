import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isTxHash, lookupCoinByTicker, shortAddr } from '../lib/decimalApi'
import { useStore } from '../lib/store'
import type { TokenProject } from '../data/mock'

type Helper = {
  name: string
  role: string
  wallet: string
  share: number
  txHash: string
  confirmed: boolean
}

type LookupStatus = 'idle' | 'loading' | 'ok' | 'too_old' | 'not_found' | 'error'

const emptyHelper = (): Helper => ({
  name: '',
  role: 'Консультант',
  wallet: '',
  share: 0,
  txHash: '',
  confirmed: false,
})

const MAX_AGE_HOURS = 72

export function CreatePage() {
  const navigate = useNavigate()
  const { registerProject } = useStore()
  const [step, setStep] = useState(1)

  const [ownerWallet, setOwnerWallet] = useState('')
  const [lookupMode, setLookupMode] = useState<'ticker' | 'contract'>('ticker')
  const [ticker, setTicker] = useState('')
  const [contract, setContract] = useState('')
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle')
  const [lookupMessage, setLookupMessage] = useState('')
  const [tokenMeta, setTokenMeta] = useState<{
    symbol: string
    name: string
    contract: string
    createdAt: string
    ageHours: number
  } | null>(null)

  const [helpers, setHelpers] = useState<Helper[]>([emptyHelper()])
  const [ownerTx, setOwnerTx] = useState('')
  const [ownerConfirmed, setOwnerConfirmed] = useState(false)
  const [done, setDone] = useState(false)

  const totalShare = useMemo(
    () => helpers.reduce((sum, p) => sum + (Number(p.share) || 0), 0),
    [helpers],
  )

  const allHelpersConfirmed = helpers.every((h) => h.confirmed && isTxHash(h.txHash))
  const canFinish =
    ownerConfirmed &&
    isTxHash(ownerTx) &&
    allHelpersConfirmed &&
    helpers.length > 0 &&
    !!tokenMeta

  const updateHelper = (index: number, patch: Partial<Helper>) => {
    setHelpers((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  const removeHelper = (index: number) => {
    setHelpers((prev) => prev.filter((_, i) => i !== index))
  }

  const resolveToken = async () => {
    setLookupStatus('loading')
    setLookupMessage('')
    setTokenMeta(null)

    if (!ownerWallet.trim()) {
      setLookupStatus('not_found')
      setLookupMessage('Укажите адрес кошелька владельца токена.')
      return
    }

    if (lookupMode === 'contract') {
      const addr = contract.trim()
      if (addr.length < 20) {
        setLookupStatus('not_found')
        setLookupMessage('Введите полный адрес смарт-контракта.')
        return
      }
      const symbol = ticker.trim().toUpperCase() || 'TOKEN'
      setTokenMeta({
        symbol,
        name: symbol,
        contract: addr,
        createdAt: new Date().toLocaleString('ru-RU'),
        ageHours: 0,
      })
      setLookupStatus('ok')
      setLookupMessage(
        'Контракт принят. Убедитесь, что токен выпущен не более 72 часов назад.',
      )
      return
    }

    const symbol = ticker.trim().toUpperCase()
    if (!symbol) {
      setLookupStatus('not_found')
      setLookupMessage('Введите короткое название токена (тикер), например MYCOIN.')
      return
    }

    const coin = await lookupCoinByTicker(symbol)
    if (!coin) {
      setLookupStatus('error')
      setLookupMessage(
        'Не удалось найти такой токен в DecimalChain. Проверьте название или укажите адрес контракта.',
      )
      return
    }

    if (coin.ageHours > MAX_AGE_HOURS) {
      setLookupStatus('too_old')
      setTokenMeta({
        symbol: coin.symbol,
        name: coin.title,
        contract: coin.contract,
        createdAt: coin.createdAt,
        ageHours: coin.ageHours,
      })
      setLookupMessage(
        `Токен слишком старый: уже ${Math.round(coin.ageHours)} часов. Можно зарегистрировать только токен младше ${MAX_AGE_HOURS} часов.`,
      )
      return
    }

    setTokenMeta({
      symbol: coin.symbol,
      name: coin.title,
      contract: coin.contract,
      createdAt: coin.createdAt,
      ageHours: coin.ageHours,
    })
    if (coin.creator && ownerWallet && !ownerWallet.toLowerCase().includes(coin.creator.slice(0, 8).toLowerCase())) {
      setLookupMessage(
        'Токен найден. Проверьте, что адрес владельца совпадает с создателем токена в сети.',
      )
    } else {
      setLookupMessage('Токен найден и подходит по сроку.')
    }
    setLookupStatus('ok')
  }

  const confirmOwner = () => {
    if (!isTxHash(ownerTx)) {
      setLookupMessage('Вставьте номер подтверждающей транзакции владельца.')
      return
    }
    setOwnerConfirmed(true)
  }

  const confirmHelper = (index: number) => {
    const h = helpers[index]
    if (!isTxHash(h.txHash)) return
    updateHelper(index, { confirmed: true })
  }

  const finish = () => {
    if (!tokenMeta || !canFinish) return

    const project: TokenProject = {
      id: tokenMeta.symbol.toLowerCase(),
      symbol: tokenMeta.symbol,
      name: tokenMeta.name || tokenMeta.symbol,
      description: `Токен ${tokenMeta.symbol}`,
      ownerWallet: ownerWallet.trim(),
      contract: tokenMeta.contract,
      wallets: 0,
      delegated: 0,
      unbonding: 0,
      activeDelegated: 0,
      paidDel: 0,
      myReward: 0,
      participants: helpers.map((h) => ({
        name: h.name || 'Помощник',
        role: h.role,
        wallet: h.wallet.trim(),
        share: h.share,
      })),
    }

    registerProject(project)
    setDone(true)
    window.setTimeout(() => navigate(`/token/${project.symbol}`), 900)
  }

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="page-title">Добавить токен</h1>
        <p className="page-sub">
          Заполните три коротких шага. Владелец только подтверждает токен — доход
          получают помощники.
        </p>

        {done && (
          <div className="success-banner">
            Токен {tokenMeta?.symbol} добавлен. Открываем его страницу…
          </div>
        )}

        <div className="steps">
          {[
            [1, '1. Токен'],
            [2, '2. Помощники'],
            [3, '3. Подтверждения'],
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
                Нужны адрес владельца и название токена. Токен должен быть новым — не
                старше <strong>{MAX_AGE_HOURS} часов</strong>.
              </div>

              <div className="field">
                <label htmlFor="owner">Кошелёк владельца токена</label>
                <input
                  id="owner"
                  value={ownerWallet}
                  onChange={(e) => setOwnerWallet(e.target.value.trim())}
                  placeholder="Адрес кошелька, например 0x… или dx1…"
                />
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={`tab${lookupMode === 'ticker' ? ' active' : ''}`}
                  onClick={() => setLookupMode('ticker')}
                >
                  По названию
                </button>
                <button
                  type="button"
                  className={`tab${lookupMode === 'contract' ? ' active' : ''}`}
                  onClick={() => setLookupMode('contract')}
                >
                  По адресу контракта
                </button>
              </div>

              {lookupMode === 'ticker' ? (
                <div className="field">
                  <label htmlFor="ticker">Название токена (тикер)</label>
                  <input
                    id="ticker"
                    value={ticker}
                    onChange={(e) => {
                      setTicker(e.target.value.toUpperCase().slice(0, 12))
                      setLookupStatus('idle')
                    }}
                    placeholder="Например MYCOIN"
                  />
                </div>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="contract">Адрес смарт-контракта</label>
                    <input
                      id="contract"
                      value={contract}
                      onChange={(e) => {
                        setContract(e.target.value.trim())
                        setLookupStatus('idle')
                      }}
                      placeholder="0x…"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ticker2">Как назвать токен в системе</label>
                    <input
                      id="ticker2"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 12))}
                      placeholder="Короткое имя"
                    />
                  </div>
                </>
              )}

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => void resolveToken()}
                disabled={lookupStatus === 'loading'}
              >
                {lookupStatus === 'loading' ? 'Ищем…' : 'Проверить токен'}
              </button>

              {lookupMessage && (
                <div
                  className="note"
                  style={{
                    borderColor:
                      lookupStatus === 'ok'
                        ? 'rgba(46,230,166,0.35)'
                        : 'rgba(255,107,107,0.4)',
                  }}
                >
                  {lookupMessage}
                </div>
              )}

              {tokenMeta && (lookupStatus === 'ok' || lookupStatus === 'too_old') && (
                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-label">Токен</div>
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
                    <div className="stat-value" style={{ fontSize: '0.95rem' }}>
                      {shortAddr(tokenMeta.contract)}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary"
                disabled={lookupStatus !== 'ok'}
                onClick={() => setStep(2)}
              >
                Дальше — помощники
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-grid">
              <div className="note">
                Добавьте людей, которые помогали запускать токен. Между ними делите{' '}
                <strong>100%</strong> вознаграждения. Владельца сюда не добавляйте.
              </div>

              <div className="stat">
                <div className="stat-label">Владелец (без доли)</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>
                  {shortAddr(ownerWallet)} · {tokenMeta?.symbol}
                </div>
              </div>

              {helpers.map((p, i) => (
                <div className="participant-row" key={i}>
                  <div className="field">
                    <label>Имя</label>
                    <input
                      value={p.name}
                      onChange={(e) => updateHelper(i, { name: e.target.value })}
                      placeholder="Как зовут"
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
                      <option>Другое</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Кошелёк для выплат</label>
                    <input
                      value={p.wallet}
                      onChange={(e) => updateHelper(i, { wallet: e.target.value.trim() })}
                      placeholder="Адрес кошелька"
                    />
                  </div>
                  <div className="field">
                    <label>Доля, %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={p.share || ''}
                      onChange={(e) =>
                        updateHelper(i, { share: Number(e.target.value) || 0 })
                      }
                      placeholder="0"
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
                + Ещё помощник
              </button>

              <div className={`share-total ${totalShare === 100 ? 'ok' : 'bad'}`}>
                Сейчас набрано: {totalShare}% из 100%
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                  Назад
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    totalShare !== 100 ||
                    helpers.some((h) => !h.wallet.trim() || !h.name.trim())
                  }
                  onClick={() => setStep(3)}
                >
                  Дальше — подтверждения
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-grid">
              <div className="note">
                Каждый участник отправляет небольшую подтверждающую транзакцию из своего
                кошелька и вставляет сюда её номер (hash). Без этого регистрация не
                завершится.
              </div>

              <div className="panel-flat">
                <div className="inline-row" style={{ marginBottom: '0.75rem' }}>
                  <strong>Подтверждение владельца</strong>
                  {ownerConfirmed && (
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Готово ✓</span>
                  )}
                </div>
                <p className="section-sub" style={{ marginBottom: '0.75rem' }}>
                  Кошелёк {shortAddr(ownerWallet)}
                </p>
                <div className="field">
                  <label htmlFor="ownerTx">Номер транзакции владельца</label>
                  <input
                    id="ownerTx"
                    value={ownerTx}
                    disabled={ownerConfirmed}
                    onChange={(e) => {
                      setOwnerTx(e.target.value.trim())
                      setOwnerConfirmed(false)
                    }}
                    placeholder="Вставьте hash транзакции"
                  />
                </div>
                {!ownerConfirmed && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={!isTxHash(ownerTx)}
                    onClick={confirmOwner}
                  >
                    Подтвердить
                  </button>
                )}
                {ownerConfirmed && (
                  <a
                    className="token-link"
                    href={`https://explorer.decimalchain.com/transactions/${ownerTx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть в обозревателе сети →
                  </a>
                )}
              </div>

              <div className="panel-flat" style={{ display: 'grid', gap: '1rem' }}>
                <strong>Подтверждения помощников</strong>
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
                        {h.name} · {h.role} · {h.share}%
                      </strong>
                      {h.confirmed && (
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                          Готово ✓
                        </span>
                      )}
                    </div>
                    <p className="section-sub" style={{ marginBottom: '0.5rem' }}>
                      {shortAddr(h.wallet)}
                    </p>
                    <div className="field">
                      <label>Номер транзакции</label>
                      <input
                        value={h.txHash}
                        disabled={h.confirmed}
                        onChange={(e) =>
                          updateHelper(i, {
                            txHash: e.target.value.trim(),
                            confirmed: false,
                          })
                        }
                        placeholder="Вставьте hash транзакции"
                      />
                    </div>
                    {!h.confirmed ? (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={!isTxHash(h.txHash)}
                        onClick={() => confirmHelper(i)}
                      >
                        Подтвердить
                      </button>
                    ) : (
                      <a
                        className="token-link"
                        href={`https://explorer.decimalchain.com/transactions/${h.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Открыть в обозревателе →
                      </a>
                    )}
                  </div>
                ))}
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
                  Завершить регистрацию
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
