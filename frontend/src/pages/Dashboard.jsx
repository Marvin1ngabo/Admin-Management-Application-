import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data.data
    },
    enabled: false,
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-primary mb-2">Good morning, Mr. Kalisa 👋</h1>
        <p className="text-gray-600">{currentDate}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <span className="text-2xl">🎓</span>
          </div>
          <p className="text-4xl font-bold text-primary">{stats?.totalStudents || 847}</p>
          <p className="text-sm text-success mt-1">+12 this term</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Teachers</h3>
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <p className="text-4xl font-bold text-primary">{stats?.totalTeachers || 42}</p>
          <p className="text-sm text-gray-500 mt-1">3 pending approval</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-4xl font-bold text-success">{stats?.attendanceRate || '94.2'}%</p>
          <p className="text-sm text-success mt-1">↑ 2.1% vs last week</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Fee Collected (MTD)</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-accent">{stats?.feeCollection || '4.2M'} RWF</p>
          <p className="text-sm text-gray-500 mt-1">78% of monthly target</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-danger">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pending Device Approvals</h3>
              <p className="text-3xl font-bold text-danger mt-2">3</p>
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
              <h3 className="text-lg font-semibold text-gray-700">Outstanding Refunds</h3>
              <p className="text-3xl font-bold text-accent mt-2">2</p>
              <p className="text-sm text-gray-600 mt-1">Awaiting action</p>
            </div>
            <Link to="/fees" className="btn bg-accent text-white hover:bg-amber-600">
              Review
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Fee Collection (Last 6 Months)</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart: Deposits vs Withdrawals</p>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Trend (Last 30 Days)</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart: Daily Attendance %</p>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b">
              <span className="text-lg">🟢</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Amina Uwimana logged in from new device</p>
                <p className="text-xs text-gray-400 mt-1">2 min ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <span className="text-lg">💰</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Fee deposit: 50,000 RWF — Jean-Paul Nkurunziza</p>
                <p className="text-xs text-gray-400 mt-1">5 min ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <span className="text-lg">✅</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Device approved: Teacher Eric Habimana</p>
                <p className="text-xs text-gray-400 mt-1">12 min ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <span className="text-lg">📝</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Grades updated: S3A — Mathematics — Mr. Mutesi</p>
                <p className="text-xs text-gray-400 mt-1">1 hr ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Failed login attempt: unknown@email.com</p>
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
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">3 pending</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Withdrawal requests</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">2 pending</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Teacher applications</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">1 new</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
