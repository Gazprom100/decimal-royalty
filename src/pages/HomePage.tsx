import { Link } from 'react-router-dom'
import { marketingRewardPercent } from '../data/mock'

const flow = [
  'Блогер / Проект',
  'Новый токен',
  'Сообщество',
  'Делегирование',
  'Вознаграждение',
  'Участники проекта',
]

const splits = [
  { name: 'Консультант', pct: 60, amount: 600 },
  { name: 'Маркетолог', pct: 40, amount: 400 },
]

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="brand-hero">DecimalChain</div>
            <h1>Создавайте токены для проектов. Получайте вознаграждение за их развитие.</h1>
            <p className="hero-lead">
              Помогайте блогерам, предпринимателям, сообществам и проектам запускать
              собственные токены в DecimalChain.
            </p>
            <p className="hero-note">
              Чем больше развивается токен и его экосистема — тем больше возможностей
              для участников проекта.
            </p>
            <div className="hero-cta">
              <Link to="/create" className="btn btn-primary">
                Зарегистрировать токен
              </Link>
              <a href="#how" className="btn btn-ghost">
                Узнать, как это работает
              </a>
            </div>

            <div className="flow-chain" aria-label="Цепочка ценности">
              {flow.map((step, i) => (
                <div className="flow-step" key={step}>
                  <span className="flow-pill">{step}</span>
                  {i < flow.length - 1 && <span className="flow-arrow">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Ключевая механика</div>
              <h2>Помогайте создавать токены — и становитесь частью их экономики</h2>
              <p className="section-sub">
                Бюджет вознаграждения — для тех, кто помогает запускать токены. Владелец
                токена может о нём не знать: от него нужны только адрес, токен и
                транзакция-подтверждение. Процент задаётся в админке.
              </p>
            </div>
          </div>

          <div className="grid-2">
            <div className="panel mech-example">
              <div className="inline-row">
                <span className="live-dot" />
                <strong>Пример: токен BLOG</strong>
              </div>
              <p className="section-sub">
                Помощник регистрирует свежий токен (≤ 72 ч), указывает владельца и
                долевых участников. Все подтверждают участие ончейн-транзакциями.
              </p>
              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-label">Владелец (без бюджета)</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem' }}>
                    0x71C7…976F
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Консультант · 60%</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem' }}>
                    0xAb84…5cb2
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Маркетолог · 40%</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem' }}>
                    0x4B20…02db
                  </div>
                </div>
              </div>
              <div className="note">
                Marketing Reward: <strong>{marketingRewardPercent}%</strong> — только
                помощникам. Владелец бюджет не видит. При 1 000 DEL доли делятся так:
              </div>
              <div className="mech-split">
                {splits.map((s) => (
                  <div className="split-bar" key={s.name}>
                    <span>{s.name}</span>
                    <div className="split-track">
                      <div className="split-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                    <strong>
                      {s.amount} DEL · {s.pct}%
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-flat" style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              <h3>Три уровня продукта</h3>
              <div className="stat">
                <div className="stat-label">1. Публичный сайт</div>
                <p>Идея: создавайте токены для реальных проектов и участвуйте в их экономике.</p>
              </div>
              <div className="stat">
                <div className="stat-label">2. Кабинет пользователя</div>
                <p>Проекты, доли, делегирование, анбондинг, начисления и выплаты.</p>
              </div>
              <div className="stat">
                <div className="stat-label">3. Admin Dashboard</div>
                <p>Вся экономика системы: метрики, процент, реестр, журнал изменений.</p>
              </div>
              <Link to="/cabinet" className="btn btn-ghost">
                Открыть кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <h2>Вы нашли проект, которому нужен токен?</h2>
          <p>
            Предложите ему DecimalChain. Помогите создать токен, настройте участников
            проекта и получите предусмотренное системой вознаграждение за своё участие.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/create" className="btn btn-primary">
              Зарегистрировать токен
            </Link>
            <Link to="/token/BLOG" className="btn btn-ghost">
              Смотреть публичную страницу BLOG
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
