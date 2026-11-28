import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getNavCounts } from '../../api/navigation'
import { useAuth } from '../../lib/auth'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [counts, setCounts] = useState({ flaggedListings: 0, openCases: 0 })

  useEffect(() => {
    getNavCounts().then(setCounts)
  }, [])

  function handleLogout() {
    logout()
    // Go to /login ourselves, so after the next login the admin lands on Overview and not on this page
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar counts={counts} admin={admin} onLogout={handleLogout} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar admin={admin} hasNotifications />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
