import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const isTeacher = user?.role === 'TEACHER'
  const isAdmin = user?.role === 'ADMIN'

  const { data: pendingDevices } = useQuery({
    queryKey: ['pendingDevicesCount'],
    queryFn: async () => {
      const { data } = await api.get('/devices')
      return data.data?.length || 0
    },
    refetchInterval: 30000,
    enabled: isAdmin, // Only fetch for admins
  })

  // Admin gets full access
  const adminNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/students', label: 'Students', icon: '🎓' },
    { path: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { path: '/classes', label: 'Classes', icon: '🏛️' },
    { path: '/fees', label: 'Fee Management', icon: '💰' },
    { path: '/grades', label: 'Grades & Reports', icon: '📝' },
    { path: '/timetable', label: 'Timetable', icon: '📅' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/devices', label: 'Device Approvals', icon: '📱', badge: pendingDevices },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  // Teacher gets limited access - only their teaching functions
  const teacherNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/grades', label: 'Enter Grades', icon: '📝' },
    { path: '/attendance', label: 'Mark Attendance', icon: '✅' },
    { path: '/timetable', label: 'My Timetable', icon: '📅' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  const navItems = isTeacher ? teacherNavItems : adminNavItems

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-navy-600">
          <h1 className="text-2xl font-heading">🏫 SchoolMS</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-6 py-3 hover:bg-navy-600 transition ${
                location.pathname === item.path ? 'bg-navy-600 border-l-4 border-accent' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </span>
              {item.badge > 0 && (
                <span className="bg-danger text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-600">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navy-600 rounded transition"
          >
            <span>🚪</span>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <input
                type="search"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-input focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
