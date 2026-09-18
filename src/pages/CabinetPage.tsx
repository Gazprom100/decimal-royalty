import { Link, useNavigate } from 'react-router-dom'
import {
  cabinetHistory,
  formatCompact,
  formatNumber,
  myProjects,
} from '../data/mock'

export function CabinetPage() {
  const navigate = useNavigate()
  const totalIncome = myProjects.reduce((sum, p) => sum + (p.myReward || 0), 0)

  return (
    <div className="page-shell">
      <div className="container">
        <h1 className="page-title">Личный кабинет</h1>
        <p className="page-sub">
          Ваша экономика в DecimalChain Tokenization: проекты, доли, делегирование и
          выплаты.
        </p>

        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          <div className="income-hero">
            <span className="label">Ваш доход</span>
            <span className="value">{formatNumber(totalIncome)} DEL</span>
            <span style={{ color: 'var(--text-soft)' }}>
              Сумма вознаграждений по всем вашим проектам
            </span>
          </div>
          <div className="panel-flat" style={{ display: 'grid', gap: '0.85rem' }}>
            <div className="inline-row">
              <span className="live-dot" />
              <strong>Быстрые действия</strong>
            </div>
            <Link to="/create" className="btn btn-primary">
              Зарегистрировать токен
            </Link>
            <Link to="/token/BLOG" className="btn btn-ghost">
              Открыть публичную страницу BLOG
            </Link>
            <p className="section-sub">
              Здесь вы видите не кнопку «создать», а результат участия в экономике
              проектов.
            </p>
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="section-kicker">Портфель</div>
            <h2>Мои проекты</h2>
          </div>
        </div>

        <div className="table-wrap" style={{ marginBottom: '1.75rem' }}>
          <table>
            <thead>
              <tr>
                <th>Проект</th>
                <th>Токен</th>
                <th>Кошельки</th>
                <th>Делегировано</th>
                <th>Вознаграждение</th>
              </tr>
            </thead>
            <tbody>
              {myProjects.map((p) => (
                <tr
                  key={p.id}
                  className="clickable"
                  onClick={() => navigate(`/token/${p.symbol}`)}
                >
                  <td>{p.name}</td>
                  <td>
                    <Link
                      className="token-link"
                      to={`/token/${p.symbol}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {p.symbol}
                    </Link>
                  </td>
                  <td>{formatNumber(p.wallets)}</td>
                  <td>{formatCompact(p.delegated)}</td>
                  <td>{formatNumber(p.myReward || 0)} DEL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-2">
          <div>
            <div className="section-head">
              <div>
                <div className="section-kicker">Активность</div>
                <h2>История</h2>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Тип</th>
                    <th>Проект</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {cabinetHistory.map((row) => (
                    <tr key={`${row.date}-${row.type}-${row.project}`}>
                      <td>{row.date}</td>
                      <td>{row.type}</td>
                      <td>{row.project}</td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="section-head">
              <div>
                <div className="section-kicker">Детали</div>
                <h2>Мои доли</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {myProjects.map((p) => {
                const me =
                  p.participants.find((x) => x.name === 'You') || p.participants[0]
                return (
                  <div className="panel-flat" key={p.id}>
                    <strong>
                      {p.symbol} · {me?.role}
                    </strong>
                    <p className="section-sub" style={{ marginTop: 6 }}>
                      Доля {me?.share}% · wallet {me?.wallet.slice(0, 8)}…
                    </p>
                    <div className="split-track" style={{ marginTop: 10 }}>
                      <div className="split-fill" style={{ width: `${me?.share || 0}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
