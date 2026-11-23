import { Route, Routes } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<PlaceholderPage title="Overview" task="T50" />} />
        <Route path="users" element={<PlaceholderPage title="Users" task="T37" />} />
        <Route path="listings" element={<PlaceholderPage title="Listings" task="T38" />} />
        <Route path="subscriptions" element={<PlaceholderPage title="Subscriptions" task="a later task" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports & Risk" task="T61" />} />
        <Route path="analytics" element={<PlaceholderPage title="Analytics" task="a later task" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" task="a later task" />} />
      </Route>
    </Routes>
  )
}
