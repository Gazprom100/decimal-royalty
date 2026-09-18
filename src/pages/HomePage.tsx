import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'

const flow = [
  'Проект нуждается в токене',
  'Токен выпускают в DecimalChain',
  'Вы регистрируете его здесь',
  'Люди начинают пользоваться',
  'Помощники получают доход',
]

export function HomePage() {
  const { marketingPercent } = useStore()

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="brand-hero">DecimalChain</div>
            <h1>Помогите проекту запустить токен — и получайте за это вознаграждение</h1>
            <p className="hero-lead">
              Блогеру, бизнесу или сообществу нужен свой токен. Вы помогаете его
              запустить в DecimalChain и становитесь участником дохода от развития.
            </p>
            <p className="hero-note">
              Владелец токена может вообще не знать про бюджет вознаграждения — он
              только для тех, кто помогает.
            </p>
            <div className="hero-cta">
              <Link to="/create" className="btn btn-primary">
                Добавить токен
              </Link>
              <a href="#how" className="btn btn-ghost">
                Как это работает
              </a>
            </div>

            <div className="flow-chain" aria-label="Как устроен процесс">
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
              <div className="section-kicker">Простыми словами</div>
              <h2>Три шага — и вы в деле</h2>
              <p className="section-sub">
                Не нужно быть программистом. Нужен проект, свежий токен и люди,
                которые помогли его запустить.
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="panel-flat">
              <div className="section-kicker">Шаг 1</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Найдите свежий токен</h3>
              <p className="section-sub">
                Токен должен быть выпущен не раньше чем за 72 часа. Укажите адрес
                владельца и название токена.
              </p>
            </div>
            <div className="panel-flat">
              <div className="section-kicker">Шаг 2</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Укажите помощников</h3>
              <p className="section-sub">
                Кто помогал: консультант, маркетолог и другие. Между ними делите
                100% вознаграждения.
              </p>
            </div>
            <div className="panel-flat">
              <div className="section-kicker">Шаг 3</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Подтвердите из кошельков</h3>
              <p className="section-sub">
                Владелец и каждый помощник отправляют подтверждающую транзакцию —
                так система понимает, что все согласны.
              </p>
            </div>
          </div>

          <div className="grid-2">
            <div className="panel mech-example">
              <strong>Как делятся деньги (пример)</strong>
              <p className="section-sub" style={{ margin: '0.75rem 0' }}>
                Система выделяет помощникам долю от развития токена (сейчас{' '}
                <strong>{marketingPercent}%</strong> — это настраивает администратор).
                Если на вознаграждение пришло 1 000 DEL:
              </p>
              <div className="mech-split">
                <div className="split-bar">
                  <span>Консультант</span>
                  <div className="split-track">
                    <div className="split-fill" style={{ width: '60%' }} />
                  </div>
                  <strong>600 DEL</strong>
                </div>
                <div className="split-bar">
                  <span>Маркетолог</span>
                  <div className="split-track">
                    <div className="split-fill" style={{ width: '40%' }} />
                  </div>
                  <strong>400 DEL</strong>
                </div>
              </div>
              <div className="note" style={{ marginTop: '1rem' }}>
                Владелец токена в этом разделении не участвует. Ему достаточно
                подтвердить, что токен его.
              </div>
            </div>

            <div className="panel-flat" style={{ display: 'grid', gap: '1rem' }}>
              <h3>Где что смотреть</h3>
              <div className="stat">
                <div className="stat-label">Мой кабинет</div>
                <p>Ваши проекты, доли и сколько вы уже заработали.</p>
              </div>
              <div className="stat">
                <div className="stat-label">Страница токена</div>
                <p>Открытая статистика: сколько людей, сколько вложено, кто помощники.</p>
              </div>
              <div className="stat">
                <div className="stat-label">Админка</div>
                <p>Только для команды DecimalChain: общая картина и процент выплат.</p>
              </div>
              <Link to="/cabinet" className="btn btn-ghost">
                Открыть мой кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <h2>Знаете проект без своего токена?</h2>
          <p>
            Расскажите про DecimalChain, помогите запустить токен и получите долю
            от его развития — по правилам системы.
          </p>
          <Link to="/create" className="btn btn-primary">
            Добавить токен сейчас
          </Link>
        </div>
      </div>
    </>
  )
}
