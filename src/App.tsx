import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminPage } from './pages/AdminPage'
import { CabinetPage } from './pages/CabinetPage'
import { CreatePage } from './pages/CreatePage'
import { HomePage } from './pages/HomePage'
import { TokenPage } from './pages/TokenPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/token/:symbol" element={<TokenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
