import { Link, useNavigate } from 'react-router-dom'
import { formatCompact, formatNumber, cabinetHistory } from '../data/mock'
import { shortAddr } from '../lib/decimalApi'
import { useStore } from '../lib/store'

export function CabinetPage() {
  const navigate = useNavigate()
  const { projects, myIncome } = useStore()

  return (
    <div className="page-shell">
      <div className="container">
        <h1 className="page-title">Мой кабинет</h1>
        <p className="page-sub">
          Здесь видно, в каких проектах вы участвуете и сколько уже заработали.
        </p>

        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          <div className="income-hero">
            <span className="label">Ваш доход</span>
            <span className="value">{formatNumber(myIncome)} DEL</span>
            <span style={{ color: 'var(--text-soft)' }}>
              Сумма вознаграждений по всем проектам
            </span>
          </div>
          <div className="panel-flat" style={{ display: 'grid', gap: '0.85rem' }}>
            <strong>Что дальше?</strong>
            <Link to="/create" className="btn btn-primary">
              Добавить новый токен
            </Link>
            <p className="section-sub">
              Добавили токен — он появится в списке ниже. Нажмите на строку, чтобы
              открыть публичную страницу.
            </p>
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="section-kicker">Ваши проекты</div>
            <h2>Где вы получаете долю</h2>
          </div>
        </div>

        <div className="table-wrap" style={{ marginBottom: '1.75rem' }}>
          <table>
            <thead>
              <tr>
                <th>Проект</th>
                <th>Токен</th>
                <th>Людей</th>
                <th>Вложено в сеть</th>
                <th>Ваш доход</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5}>Пока нет проектов. Добавьте первый токен.</td>
                </tr>
              ) : (
                projects.map((p) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid-2">
          <div>
            <div className="section-head">
              <div>
                <div className="section-kicker">История</div>
                <h2>Последние операции</h2>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Что произошло</th>
                    <th>Токен</th>
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
                <div className="section-kicker">Ваши доли</div>
                <h2>Как делится доход</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {projects.map((p) => {
                const me =
                  p.participants.find((x) => x.name === 'You') || p.participants[0]
                return (
                  <div className="panel-flat" key={p.id}>
                    <strong>
                      {p.symbol} · {me?.role}
                    </strong>
                    <p className="section-sub" style={{ marginTop: 6 }}>
                      Ваша доля {me?.share}% · кошелёк {shortAddr(me?.wallet || '')}
                    </p>
                    <div className="split-track" style={{ marginTop: 10 }}>
                      <div
                        className="split-fill"
                        style={{ width: `${me?.share || 0}%` }}
                      />
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
