import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SimpleChart } from '../components/SimpleChart'
import {
  adminStats,
  delegationSeries,
  formatCompact,
  formatNumber,
  payoutsSeries,
  tokensCreatedSeries,
  walletsSeries,
} from '../data/mock'
import { useStore } from '../lib/store'

type AdminTab = 'overview' | 'params' | 'registry'

export function AdminPage() {
  const { registry, marketingPercent, rewardHistory, setMarketingPercent } = useStore()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [query, setQuery] = useState('')
  const [draftPercent, setDraftPercent] = useState(marketingPercent)
  const [showModal, setShowModal] = useState(false)
  const [chart, setChart] = useState<'tokens' | 'delegation' | 'wallets' | 'payouts'>(
    'tokens',
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return registry
    return registry.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.ownerWallet.toLowerCase().includes(q) ||
        t.participants.some((p) => p.wallet.toLowerCase().includes(q)),
    )
  }, [query, registry])

  const applyPercent = () => {
    setMarketingPercent(draftPercent)
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
    chart === 'delegation'
      ? ' млн DEL'
      : chart === 'wallets'
        ? ' тыс.'
        : chart === 'payouts'
          ? ' тыс. DEL'
          : ''

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
        <h1 className="page-title">Админка</h1>
        <p className="page-sub">
          Общая картина системы: сколько токенов, сколько выплат и какой процент
          получают помощники.
        </p>

        <div className="tabs">
          {(
            [
              ['overview', 'Обзор'],
              ['params', 'Процент выплат'],
              ['registry', 'Все токены'],
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
                <div className="stat-label">Токенов добавлено</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatNumber(adminStats.tokensActive)}</div>
                <div className="stat-label">Сейчас активны</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatNumber(adminStats.walletsTotal)}</div>
                <div className="stat-label">Людей с кошельками</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {formatCompact(adminStats.delegatedVolume)}
                </div>
                <div className="stat-label">Вложено в сеть</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatCompact(adminStats.unbondVolume)}</div>
                <div className="stat-label">Выводят из сети</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {formatCompact(adminStats.paidConsultants)}
                </div>
                <div className="stat-label">Выплачено помощникам</div>
              </div>
              <div className="stat">
                <div className="stat-value">{marketingPercent}%</div>
                <div className="stat-label">Доля помощникам</div>
              </div>
            </div>

            <div className="grid-2 admin-charts">
              <div className="panel">
                <div className="tabs">
                  {(
                    [
                      ['tokens', 'Новые токены'],
                      ['delegation', 'Вложения'],
                      ['wallets', 'Люди'],
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
                <h3 style={{ marginBottom: '0.75rem' }}>Рост за 2026 год</h3>
                <SimpleChart data={chartData} unit={chartUnit} color={chartColor} />
              </div>

              <div className="panel-flat" style={{ display: 'grid', gap: '0.85rem' }}>
                <h3>Коротко</h3>
                <div className="stat">
                  <div className="stat-label">Активных из всех</div>
                  <div className="stat-value">
                    {Math.round(
                      (adminStats.tokensActive / adminStats.tokensCreated) * 100,
                    )}
                    %
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">В реестре сейчас</div>
                  <div className="stat-value">{registry.length}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setDraftPercent(marketingPercent)
                    setTab('params')
                  }}
                >
                  Изменить процент выплат
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'params' && (
          <div className="grid-2">
            <div className="panel">
              <div className="section-kicker">Настройка</div>
              <h2 style={{ marginBottom: '1rem' }}>Сколько получают помощники</h2>
              <div className="stat" style={{ marginBottom: '1rem' }}>
                <div className="stat-value">{marketingPercent.toFixed(2)} %</div>
                <div className="stat-label">Сейчас</div>
              </div>
              <div className="field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="reward">Новое значение, %</label>
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
                disabled={draftPercent === marketingPercent}
              >
                Сохранить
              </button>
              <p className="section-sub" style={{ marginTop: '1rem' }}>
                Это внутренний параметр системы. На сайте мы не обещаем фиксированный
                доход.
              </p>
            </div>

            <div>
              <div className="section-head">
                <div>
                  <div className="section-kicker">Журнал</div>
                  <h2>Кто менял процент</h2>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Было</th>
                      <th>Стало</th>
                      <th>Кто</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardHistory.map((row) => (
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
                placeholder="Найти по токену, проекту или кошельку"
              />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Токен</th>
                    <th>Проект</th>
                    <th>Людей</th>
                    <th>Вложено</th>
                    <th>Выводят</th>
                    <th>Выплачено</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
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
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Подтвердите изменение</h3>
            <p>Сейчас: {marketingPercent}%</p>
            <p>Будет: {draftPercent}%</p>
            <p>Новый процент начнёт действовать для следующих расчётов.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
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
