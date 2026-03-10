import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data.data
    },
  })

  const isTeacher = user?.role === 'TEACHER'
  const isAdmin = user?.role === 'ADMIN'

  console.log('Dashboard - User:', user)
  console.log('Dashboard - isTeacher:', isTeacher)
  console.log('Dashboard - isAdmin:', isAdmin)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  // TEACHER DASHBOARD
  if (isTeacher) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-primary mb-2">
            {greeting()}, {user?.firstName}! 👨‍🏫
          </h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Classes</h3>
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats?.totalClasses || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Classes assigned</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-4xl font-bold text-success">{stats?.totalStudents || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Across all classes</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats?.subjects?.length || 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.subjects && stats.subjects.length > 0 ? stats.subjects.join(', ') : 'None assigned'}
            </p>
          </div>
        </div>

        {/* Teacher Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/attendance" className="card p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-700">Mark Attendance</h3>
            <p className="text-sm text-gray-500 mt-1">Record student attendance</p>
          </Link>
          <Link to="/grades" className="card p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-700">Enter Grades</h3>
            <p className="text-sm text-gray-500 mt-1">Record student scores</p>
          </Link>
          <Link to="/timetable" className="card p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-700">View Timetable</h3>
            <p className="text-sm text-gray-500 mt-1">Check your schedule</p>
          </Link>
        </div>

        {/* Info Card */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Portal</h3>
          <p className="text-gray-600 mb-4">
            Welcome to your teacher dashboard. Here you can manage attendance, enter grades, and view your class schedules.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Use the Attendance page to quickly mark students present, absent, or late. 
              Use the Grades page to enter and update student scores.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ADMIN DASHBOARD
  if (isAdmin) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-primary mb-2">
            {greeting()}, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats?.totalStudents || 0}</p>
            <p className="text-sm text-success mt-1">+12 this term</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Teachers</h3>
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats?.totalTeachers || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active staff</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-success">{stats?.attendanceRate || 0}%</p>
            <p className="text-sm text-success mt-1">This term</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Fee Collected</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-accent">{stats?.feeCollection || 0} RWF</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-danger">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Pending Device Approvals</h3>
                <p className="text-3xl font-bold text-danger mt-2">{stats?.pendingDevices || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Tap to review</p>
              </div>
              <Link to="/devices" className="btn btn-danger">
                Review
              </Link>
            </div>
          </div>

          <div className="card p-6 border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Outstanding Withdrawals</h3>
                <p className="text-3xl font-bold text-accent mt-2">{stats?.pendingWithdrawals || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Awaiting action</p>
              </div>
              <Link to="/fees" className="btn bg-accent text-white hover:bg-amber-600">
                Review
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Feed */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b">
                <span className="text-lg">🟢</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">New device login detected</p>
                  <p className="text-xs text-gray-400 mt-1">2 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <span className="text-lg">💰</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Fee deposit: 50,000 RWF</p>
                  <p className="text-xs text-gray-400 mt-1">5 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <span className="text-lg">✅</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Device approved</p>
                  <p className="text-xs text-gray-400 mt-1">12 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <span className="text-lg">📝</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Grades updated: Mathematics</p>
                  <p className="text-xs text-gray-400 mt-1">1 hr ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Failed login attempt</p>
                  <p className="text-xs text-gray-400 mt-1">2 hrs ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Device verifications</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                  {stats?.pendingDevices || 0} pending
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Withdrawal requests</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                  {stats?.pendingWithdrawals || 0} pending
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">New registrations</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">0 new</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
