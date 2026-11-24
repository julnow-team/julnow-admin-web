import { Route, Routes } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import OverviewPage from './pages/overview/OverviewPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="users" element={<PlaceholderPage titleKey="nav.users" task="T37" />} />
        <Route path="listings" element={<PlaceholderPage titleKey="nav.listings" task="T38" />} />
        <Route path="subscriptions" element={<PlaceholderPage titleKey="nav.subscriptions" />} />
        <Route path="reports" element={<PlaceholderPage titleKey="nav.reports" task="T61" />} />
        <Route path="analytics" element={<PlaceholderPage titleKey="nav.analytics" />} />
        <Route path="settings" element={<PlaceholderPage titleKey="nav.settings" />} />
      </Route>
    </Routes>
  )
}
