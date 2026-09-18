import { Link, useParams } from 'react-router-dom'
import { formatCompact, formatNumber } from '../data/mock'
import { shortAddr } from '../lib/decimalApi'
import { useStore } from '../lib/store'

export function TokenPage() {
  const { symbol = '' } = useParams()
  const { findToken, marketingPercent } = useStore()
  const token = findToken(symbol)

  if (!token) {
    return (
      <div className="page-shell">
        <div className="container">
          <h1 className="page-title">Токен не найден</h1>
          <p className="page-sub">
            Токена «{symbol.toUpperCase()}» пока нет в системе. Возможно, его ещё не
            добавили.
          </p>
          <Link to="/create" className="btn btn-primary">
            Добавить токен
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="container">
        <div className="inline-row" style={{ marginBottom: '0.5rem' }}>
          <span className="live-dot" />
          <span className="section-kicker" style={{ margin: 0 }}>
            Открытая страница токена
          </span>
        </div>
        <h1 className="page-title">{token.symbol}</h1>
        <p className="page-sub">
          {token.description}. Здесь видно, как растёт проект и кто получает долю за
          помощь.
        </p>

        <div className="section-head">
          <div>
            <div className="section-kicker">Цифры</div>
            <h2>{token.name}</h2>
          </div>
          <Link to="/create" className="btn btn-ghost btn-sm">
            Добавить свой токен
          </Link>
        </div>

        <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
          <div className="stat">
            <div className="stat-value">{formatNumber(token.wallets)}</div>
            <div className="stat-label">Людей с токеном</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatCompact(token.delegated)}</div>
            <div className="stat-label">Вложено · {token.symbol}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatCompact(token.unbonding)}</div>
            <div className="stat-label">Сейчас выводят · {token.symbol}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatCompact(token.activeDelegated)}</div>
            <div className="stat-label">Активно вложено · {token.symbol}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatCompact(token.paidDel)}</div>
            <div className="stat-label">Выплачено помощникам · DEL</div>
          </div>
          <div className="stat">
            <div className="stat-value">{marketingPercent}%</div>
            <div className="stat-label">Доля помощникам</div>
          </div>
        </div>

        <div className="panel-flat" style={{ marginBottom: '1.75rem' }}>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-label">Владелец (без доли в бюджете)</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {shortAddr(token.ownerWallet)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Смарт-контракт</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {shortAddr(token.contract)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="section-head">
              <div>
                <div className="section-kicker">Кто помогает</div>
                <h2>Доли вознаграждения</h2>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Человек</th>
                    <th>Роль</th>
                    <th>Кошелёк</th>
                    <th>Доля</th>
                  </tr>
                </thead>
                <tbody>
                  {token.participants.map((p) => (
                    <tr key={p.wallet}>
                      <td>{p.name}</td>
                      <td>{p.role}</td>
                      <td>{shortAddr(p.wallet)}</td>
                      <td>{p.share}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: '0.75rem' }}>Если пришло 1 000 DEL</h3>
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
              Вложено: {formatCompact(token.delegated)} · выплачено помощникам:{' '}
              {formatCompact(token.paidDel)} DEL
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
                В мой кабинет
              </Link>
              <Link to="/create" className="btn btn-ghost btn-sm">
                Добавить токен
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
