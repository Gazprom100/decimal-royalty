import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SimpleChart } from '../components/SimpleChart'
import {
  adminStats,
  delegationSeries,
  formatCompact,
  formatNumber,
  payoutsSeries,
  registryTokens,
  rewardHistory,
  tokensCreatedSeries,
  walletsSeries,
} from '../data/mock'

type AdminTab = 'overview' | 'params' | 'registry'

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [query, setQuery] = useState('')
  const [percent, setPercent] = useState(adminStats.marketingPercent)
  const [draftPercent, setDraftPercent] = useState(adminStats.marketingPercent)
  const [showModal, setShowModal] = useState(false)
  const [history, setHistory] = useState(rewardHistory)
  const [chart, setChart] = useState<'tokens' | 'delegation' | 'wallets' | 'payouts'>(
    'tokens',
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return registryTokens
    return registryTokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.participants.some((p) => p.wallet.toLowerCase().includes(q)),
    )
  }, [query])

  const applyPercent = () => {
    const today = new Date()
    const date = today.toLocaleDateString('ru-RU')
    setHistory((prev) => [
      { date, from: percent, to: draftPercent, admin: 'Admin' },
      ...prev,
    ])
    setPercent(draftPercent)
    setShowModal(false)
  }

  const chartData =
    chart === 'tokens'
      ? tokensCreatedSeries
      : chart === 'delegation'
        ? delegationSeries
        : chart === 'wallets'
          ? walletsSeries
          : payoutsSeries

  const chartUnit =
    chart === 'delegation' ? 'M DEL' : chart === 'wallets' ? 'K' : chart === 'payouts' ? 'K DEL' : ''

  const chartColor =
    chart === 'tokens'
      ? '#2ee6a6'
      : chart === 'delegation'
        ? '#3db8e8'
        : chart === 'wallets'
          ? '#7ec4d6'
          : '#f0b429'

  return (
    <div className="page-shell">
      <div className="container">
        <h1 className="page-title">DecimalChain Tokenization — Admin</h1>
        <p className="page-sub">
          Полная экономика системы: метрики, динамика, процент вознаграждения и реестр
          токенов.
        </p>

        <div className="tabs">
          {(
            [
              ['overview', 'Обзор'],
              ['params', 'Параметры'],
              ['registry', 'Реестр токенов'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`tab${tab === id ? ' active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="stat">
                <div className="stat-value">{formatNumber(adminStats.tokensCreated)}</div>
                <div className="stat-label">Создано токенов</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatNumber(adminStats.tokensActive)}</div>
                <div className="stat-label">Активных токенов</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatNumber(adminStats.walletsTotal)}</div>
                <div className="stat-label">Всего кошельков</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {formatCompact(adminStats.delegatedVolume)}
                </div>
                <div className="stat-label">Объём делегирования</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatCompact(adminStats.unbondVolume)}</div>
                <div className="stat-label">Объём анбонда</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {formatCompact(adminStats.paidConsultants)}
                </div>
                <div className="stat-label">Выплачено консультантам</div>
              </div>
              <div className="stat">
                <div className="stat-value">{percent}%</div>
                <div className="stat-label">Маркетинговый процент</div>
              </div>
            </div>

            <div className="grid-2 admin-charts">
              <div className="panel">
                <div className="tabs">
                  {(
                    [
                      ['tokens', 'Созданные токены'],
                      ['delegation', 'Делегирование'],
                      ['wallets', 'Кошельки'],
                      ['payouts', 'Выплаты'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={`tab${chart === id ? ' active' : ''}`}
                      onClick={() => setChart(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <h3 style={{ marginBottom: '0.75rem' }}>Динамика · 2026</h3>
                <SimpleChart data={chartData} unit={chartUnit} color={chartColor} />
              </div>

              <div className="panel-flat" style={{ display: 'grid', gap: '0.85rem' }}>
                <h3>Фокус руководства</h3>
                <p className="section-sub">
                  Админка — отдельный продукт: видно рост экосистемы, не только список
                  токенов.
                </p>
                <div className="stat">
                  <div className="stat-label">Конверсия в активные</div>
                  <div className="stat-value">
                    {Math.round(
                      (adminStats.tokensActive / adminStats.tokensCreated) * 100,
                    )}
                    %
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Выплаты / делегирование</div>
                  <div className="stat-value" style={{ fontSize: '1.35rem' }}>
                    {(
                      (adminStats.paidConsultants / adminStats.delegatedVolume) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setTab('params')}
                >
                  Управление процентом
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'params' && (
          <div className="grid-2">
            <div className="panel">
              <div className="section-kicker">Параметры системы</div>
              <h2 style={{ marginBottom: '1rem' }}>Marketing Reward</h2>
              <div className="stat" style={{ marginBottom: '1rem' }}>
                <div className="stat-value">{percent.toFixed(2)} %</div>
                <div className="stat-label">Текущее значение</div>
              </div>
              <div className="field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="reward">Новый процент</label>
                <input
                  id="reward"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={draftPercent}
                  onChange={(e) => setDraftPercent(Number(e.target.value))}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
                disabled={draftPercent === percent}
              >
                Изменить процент
              </button>
              <p className="section-sub" style={{ marginTop: '1rem' }}>
                Процент — параметр админки. На публичном сайте он не обещается как
                фиксированная доходность.
              </p>
            </div>

            <div>
              <div className="section-head">
                <div>
                  <div className="section-kicker">Аудит</div>
                  <h2>История изменений</h2>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Было</th>
                      <th>Стало</th>
                      <th>Администратор</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={`${row.date}-${row.from}-${row.to}`}>
                        <td>{row.date}</td>
                        <td>{row.from}%</td>
                        <td>{row.to}%</td>
                        <td>{row.admin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'registry' && (
          <>
            <div className="search-bar">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск токена / проекта / wallet"
              />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Project</th>
                    <th>Wallets</th>
                    <th>Delegated</th>
                    <th>Unbonding</th>
                    <th>Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="clickable">
                      <td>
                        <Link className="token-link" to={`/token/${t.symbol}`}>
                          {t.symbol}
                        </Link>
                      </td>
                      <td>{t.name}</td>
                      <td>{formatNumber(t.wallets)}</td>
                      <td>{formatCompact(t.delegated)}</td>
                      <td>{formatCompact(t.unbonding)}</td>
                      <td>{formatCompact(t.paidDel)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="section-sub" style={{ marginTop: '0.85rem' }}>
              Нажмите на токен — откроется полная публичная аналитика.
            </p>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Подтверждение изменения</h3>
            <p>Текущее значение: {percent}%</p>
            <p>Новое значение: {draftPercent}%</p>
            <p>
              Изменение применяется к новым расчётам согласно правилам системы.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Отмена
              </button>
              <button type="button" className="btn btn-primary" onClick={applyPercent}>
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
