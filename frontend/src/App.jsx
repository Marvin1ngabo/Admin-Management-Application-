import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import DevicePending from './pages/DevicePending'
import Users from './pages/Users'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Fees from './pages/Fees'
import Grades from './pages/Grades'
import Timetable from './pages/Timetable'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  // Admin app is only for ADMIN role
  // Redirect non-admins to client app
  if (isAuthenticated && user && user.role !== 'ADMIN') {
    window.location.href = 'http://localhost:3000'
    return null
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/device-pending" element={isAuthenticated ? <DevicePending /> : <Navigate to="/login" />} />
      
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="fees" element={<Fees />} />
        <Route path="grades" element={<Grades />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="devices" element={<Devices />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
