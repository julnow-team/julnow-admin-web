import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import RequireAuth from './components/RequireAuth'
import LoginPage from './pages/login/LoginPage'
import MfaPage from './pages/login/MfaPage'
import PlaceholderPage from './pages/PlaceholderPage'
import OverviewPage from './pages/overview/OverviewPage'
import UsersPage from './pages/users/UsersPage'

// The demo page is only for developers. In a production build this line is removed.
const ComponentsDemo = import.meta.env.DEV ? lazy(() => import('./pages/dev/ComponentsDemo')) : null

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/verify" element={<MfaPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="listings" element={<PlaceholderPage titleKey="nav.listings" task="T38" />} />
          <Route path="subscriptions" element={<PlaceholderPage titleKey="nav.subscriptions" />} />
          <Route path="reports" element={<PlaceholderPage titleKey="nav.reports" task="T61" />} />
          <Route path="analytics" element={<PlaceholderPage titleKey="nav.analytics" />} />
          <Route path="settings" element={<PlaceholderPage titleKey="nav.settings" />} />
          {ComponentsDemo && (
            <Route
              path="dev/components"
              element={
                <Suspense fallback={null}>
                  <ComponentsDemo />
                </Suspense>
              }
            />
          )}
        </Route>
      </Route>
    </Routes>
  )
}
