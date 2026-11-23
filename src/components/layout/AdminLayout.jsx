import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getCurrentAdmin, getNavCounts } from '../../api/navigation'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ flaggedListings: 0, openCases: 0 })
  const [admin, setAdmin] = useState({ fullName: '', roleName: '' })

  useEffect(() => {
    getNavCounts().then(setCounts)
    getCurrentAdmin().then(setAdmin)
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar counts={counts} admin={admin} onLogout={() => navigate('/login')} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar admin={admin} hasNotifications />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
