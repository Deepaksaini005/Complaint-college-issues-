import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/public/HomePage'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import FAQ from './pages/public/FAQ'
import Policy from './pages/public/Policy'
import Login from './pages/public/Login'
import Signup from './pages/public/Signup'
import ComplaintsPage from './pages/public/ComplaintsPage'
import Auth from './pages/student/Auth'
import StudentDashboard from './pages/student/StudentDashboard'
import AdminPortal from './pages/admin/AdminPortal'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/AdminDashboard'
import ViewComplaints from './pages/admin/ViewComplaints'
import AdminManagement from './pages/admin/AdminManagement'
import HostelAdminLogin from './pages/admin/HostelAdminLogin'
import MaintenanceAdminLogin from './pages/admin/MaintenanceAdminLogin'
import CafeteriaAdminLogin from './pages/admin/CafeteriaAdminLogin'
import LibraryAdminLogin from './pages/admin/LibraryAdminLogin'
import TransportAdminLogin from './pages/admin/TransportAdminLogin'
import RoleBasedDashboard from './pages/admin/RoleBasedDashboard'
import AdminNotifications from './pages/admin/AdminNotifications'
import DepartmentStatus from './pages/admin/DepartmentStatus'
import NoticeManagement from './pages/admin/NoticeManagement'
import UserDetails from './pages/admin/UserDetails'
import FAQManagement from './pages/admin/FAQManagement'
import { authAPI } from './services/apiClient'

const STUDENT_TOKEN_KEY = 'campuscare_token'
const ADMIN_TOKEN_KEY = 'campuscare_admin_token'
const STUDENT_SESSION_KEY = 'campuscare_student_session'
const ADMIN_SESSION_KEY = 'campuscare_admin_session'
const DEPARTMENT_ROLES = ['hostel', 'maintenance', 'cafeteria', 'library', 'transport']

function App() {
  const [studentUser, setStudentUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const restoreSession = async (tokenKey, sessionKey) => {
    const cachedSession = localStorage.getItem(sessionKey)
    const token = localStorage.getItem(tokenKey)

    if (!token) {
      return cachedSession ? JSON.parse(cachedSession) : null
    }

    try {
      const profile = await authAPI.getProfile(tokenKey)
      localStorage.setItem(sessionKey, JSON.stringify(profile))
      return profile
    } catch (error) {
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(sessionKey)
      return cachedSession ? JSON.parse(cachedSession) : null
    }
  }

  useEffect(() => {
    const loadSessions = async () => {
      const [studentProfile, adminProfile] = await Promise.all([
        restoreSession(STUDENT_TOKEN_KEY, STUDENT_SESSION_KEY),
        restoreSession(ADMIN_TOKEN_KEY, ADMIN_SESSION_KEY)
      ])
      setStudentUser(studentProfile)
      setAdminUser(adminProfile)
      setAuthLoading(false)
    }

    loadSessions()
  }, [])

  const handleLogin = (user, token) => {
    const isStudent = user.role === 'student'
    const tokenKey = isStudent ? STUDENT_TOKEN_KEY : ADMIN_TOKEN_KEY
    const sessionKey = isStudent ? STUDENT_SESSION_KEY : ADMIN_SESSION_KEY

    if (token) {
      localStorage.setItem(tokenKey, token)
    }
    localStorage.setItem(sessionKey, JSON.stringify(user))

    if (isStudent) {
      setStudentUser(user)
      window.location.href = '/student/dashboard'
    } else {
      setAdminUser(user)
      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard'
      } else if (DEPARTMENT_ROLES.includes(user.role)) {
        window.location.href = '/admin/role-based-dashboard'
      } else {
        window.location.href = '/admin/dashboard'
      }
    }
  }

  const handleLogout = (role = 'all') => {
    if (role === 'all' || role === 'student') {
      localStorage.removeItem(STUDENT_TOKEN_KEY)
      localStorage.removeItem(STUDENT_SESSION_KEY)
      setStudentUser(null)
    }
    if (role === 'all' || role === 'admin') {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      localStorage.removeItem(ADMIN_SESSION_KEY)
      setAdminUser(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] text-[#292929] font-['Poppins']">
        <p className="text-lg font-semibold">Loading Campus Care...</p>
      </div>
    )
  }

  const isAdminLoggedIn = Boolean(adminUser)
  const adminRole = adminUser?.role || 'student'
  const isSuperAdmin = adminRole === 'admin'

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F8F8]">
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<HomePage />} />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaints" element={<ComplaintsPage />} />

          {/* Student Portal Route - Redirect to dashboard if logged in, otherwise show login */}
          <Route
            path="/student"
            element={
              studentUser ? (
                <Navigate to="/student/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* Student Dashboard Route */}
          <Route
            path="/student/dashboard"
            element={
              studentUser ? (
                <StudentDashboard onLogout={() => handleLogout('student')} user={studentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Admin Login Route */}
          <Route
            path="/adminpannel"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminPortal onLogin={handleLogin} />
              )
            }
          />

          {/* Admin Register Route */}
          <Route
            path="/admin/register"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminRegister />
              )
            }
          />

          {/* Admin Dashboard Route */}
          <Route
            path="/admin/dashboard"
            element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* View Complaints Route */}
          <Route
            path="/admin/complaints"
            element={
              isAdminLoggedIn ? (
                <ViewComplaints onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Admin Management Route */}
          <Route
            path="/admin/manage"
            element={
              isSuperAdmin ? (
                <AdminManagement onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Admin Notifications Route */}
          <Route
            path="/admin/notifications"
            element={
              isAdminLoggedIn ? (
                <AdminNotifications onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Department Status Route */}
          <Route
            path="/admin/department-status"
            element={
              isSuperAdmin ? (
                <DepartmentStatus onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Notice Management Route */}
          <Route
            path="/admin/notice-management"
            element={
              isSuperAdmin ? (
                <NoticeManagement onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* User Details Route */}
          <Route
            path="/admin/user-details"
            element={
              isSuperAdmin ? (
                <UserDetails onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* FAQ Management Route */}
          <Route
            path="/admin/faq-management"
            element={
              isSuperAdmin ? (
                <FAQManagement onLogout={() => handleLogout('admin')} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Hostel Admin Login */}
          <Route
            path="/admin/hostel/login"
            element={
              adminRole === 'hostel' ? (
                <Navigate to="/admin/hostel/dashboard" replace />
              ) : (
                <HostelAdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Hostel Admin Dashboard */}
          <Route
            path="/admin/hostel/dashboard"
            element={
              adminRole === 'hostel' ? (
                <RoleBasedDashboard userRole="Hostel Admin" onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/admin/hostel/login" replace />
              )
            }
          />

          {/* Maintenance Admin Login */}
          <Route
            path="/admin/maintenance/login"
            element={
              adminRole === 'maintenance' ? (
                <Navigate to="/admin/maintenance/dashboard" replace />
              ) : (
                <MaintenanceAdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Maintenance Admin Dashboard */}
          <Route
            path="/admin/maintenance/dashboard"
            element={
              adminRole === 'maintenance' ? (
                <RoleBasedDashboard userRole="Maintenance Admin" onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/admin/maintenance/login" replace />
              )
            }
          />

          {/* Cafeteria Admin Login */}
          <Route
            path="/admin/cafeteria/login"
            element={
              adminRole === 'cafeteria' ? (
                <Navigate to="/admin/cafeteria/dashboard" replace />
              ) : (
                <CafeteriaAdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Cafeteria Admin Dashboard */}
          <Route
            path="/admin/cafeteria/dashboard"
            element={
              adminRole === 'cafeteria' ? (
                <RoleBasedDashboard userRole="Cafeteria Admin" onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/admin/cafeteria/login" replace />
              )
            }
          />

          {/* Library Admin Login */}
          <Route
            path="/admin/library/login"
            element={
              adminRole === 'library' ? (
                <Navigate to="/admin/library/dashboard" replace />
              ) : (
                <LibraryAdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Library Admin Dashboard */}
          <Route
            path="/admin/library/dashboard"
            element={
              adminRole === 'library' ? (
                <RoleBasedDashboard userRole="Library Admin" onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/admin/library/login" replace />
              )
            }
          />

          {/* Transport Admin Login */}
          <Route
            path="/admin/transport/login"
            element={
              adminRole === 'transport' ? (
                <Navigate to="/admin/transport/dashboard" replace />
              ) : (
                <TransportAdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Transport Admin Dashboard */}
          <Route
            path="/admin/transport/dashboard"
            element={
              adminRole === 'transport' ? (
                <RoleBasedDashboard userRole="Transport Admin" onLogout={() => handleLogout('admin')} />
              ) : (
                <Navigate to="/admin/transport/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App