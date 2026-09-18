import { Link, useParams } from 'react-router-dom'
import {
  formatCompact,
  formatNumber,
  getTokenBySymbol,
  marketingRewardPercent,
} from '../data/mock'

export function TokenPage() {
  const { symbol = 'BLOG' } = useParams()
  const token = getTokenBySymbol(symbol)

  if (!token) {
    return (
      <div className="page-shell">
        <div className="container">
          <h1 className="page-title">Токен не найден</h1>
          <p className="page-sub">В демо-реестре нет тикера {symbol.toUpperCase()}.</p>
          <Link to="/" className="btn btn-primary">
            На главную
          </Link>
        </div>
      </div>
    )
  }

  const short = (addr: string) => `${addr.slice(0, 8)}…${addr.slice(-4)}`

  return (
    <div className="page-shell">
      <div className="container">
        <div className="inline-row" style={{ marginBottom: '0.5rem' }}>
          <span className="live-dot" />
          <span className="section-kicker" style={{ margin: 0 }}>
            Публичная страница токена
          </span>
        </div>
        <h1 className="page-title">{token.symbol}</h1>
        <p className="page-sub">
          {token.description}. Владелец подтверждён ончейн; бюджет делится только между
          помощниками.
        </p>

        <div className="section-head">
          <div>
            <div className="section-kicker">Статистика</div>
            <h2>{token.name}</h2>
          </div>
          <Link to="/create" className="btn btn-ghost btn-sm">
            Зарегистрировать токен
          </Link>
        </div>

        <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
          <div className="stat">
            <div className="stat-value">{formatNumber(token.wallets)}</div>
            <div className="stat-label">Кошельков</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {formatNumber(token.delegated)} {token.symbol}
            </div>
            <div className="stat-label">Делегировано</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {formatNumber(token.unbonding)} {token.symbol}
            </div>
            <div className="stat-label">Анбондится</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {formatNumber(token.activeDelegated)} {token.symbol}
            </div>
            <div className="stat-label">Активно делегировано</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatNumber(token.paidDel)} DEL</div>
            <div className="stat-label">Выплачено помощникам</div>
          </div>
          <div className="stat">
            <div className="stat-value">{marketingRewardPercent}%</div>
            <div className="stat-label">Marketing Reward (система)</div>
          </div>
        </div>

        <div className="panel-flat" style={{ marginBottom: '1.75rem' }}>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-label">Владелец (без доли в бюджете)</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {short(token.ownerWallet)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Смарт-контракт</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {short(token.contract)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="section-head">
              <div>
                <div className="section-kicker">Прозрачность</div>
                <h2>Помощники (доли бюджета)</h2>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Участник</th>
                    <th>Роль</th>
                    <th>Wallet</th>
                    <th>Доля</th>
                  </tr>
                </thead>
                <tbody>
                  {token.participants.map((p) => (
                    <tr key={p.wallet}>
                      <td>{p.name}</td>
                      <td>{p.role}</td>
                      <td>{short(p.wallet)}</td>
                      <td>{p.share}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: '0.75rem' }}>Распределение при 1 000 DEL</h3>
            <div className="mech-split">
              {token.participants.map((p) => (
                <div className="split-bar" key={p.wallet}>
                  <span>{p.name}</span>
                  <div className="split-track">
                    <div className="split-fill" style={{ width: `${p.share}%` }} />
                  </div>
                  <strong>{Math.round((1000 * p.share) / 100)} DEL</strong>
                </div>
              ))}
            </div>
            <p className="section-sub" style={{ marginTop: '1rem' }}>
              Объём: {formatCompact(token.delegated)} делегировано ·{' '}
              {formatCompact(token.paidDel)} DEL выплачено помощникам.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.65rem',
                flexWrap: 'wrap',
                marginTop: '1rem',
              }}
            >
              <Link to="/cabinet" className="btn btn-primary btn-sm">
                В кабинет
              </Link>
              <Link to="/admin" className="btn btn-ghost btn-sm">
                Админ: реестр
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
