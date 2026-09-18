import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/create', label: 'Добавить токен' },
  { to: '/cabinet', label: 'Мой кабинет' },
  { to: '/admin', label: 'Админка' },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <NavLink to="/" className="brand">
            <span className="brand-mark">D</span>
            <span>Decimal</span>
            <span style={{ color: 'var(--text-soft)', fontWeight: 560, fontSize: '0.92rem' }}>
              Tokenization
            </span>
          </NavLink>
          <nav className="nav-links" aria-label="Меню">
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
              Добавить токен
            </NavLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-row">
          <span>Decimal · Tokenization</span>
          <a
            href="https://decimalchain.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-soft)' }}
          >
            decimalchain.com
          </a>
        </div>
      </footer>
    </>
  )
}
