import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/create', label: 'Регистрация' },
  { to: '/cabinet', label: 'Кабинет' },
  { to: '/admin', label: 'Админ' },
  { to: '/token/BLOG', label: 'Пример токена' },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <NavLink to="/" className="brand">
            <span className="brand-mark">D</span>
            <span>Decimal Tokenization</span>
          </NavLink>
          <nav className="nav-links" aria-label="Основная навигация">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/create" className="btn btn-primary btn-sm">
              Регистрация
            </NavLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-row">
          <span>DecimalChain Tokenization — кликабельный прототип</span>
          <span>Демо-данные · не financial advice</span>
        </div>
      </footer>
    </>
  )
}
