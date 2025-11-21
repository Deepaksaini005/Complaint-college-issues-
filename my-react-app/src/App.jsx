import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import About from './components/About'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Policy from './components/Policy'
import Login from './components/Login'
import Signup from './components/Signup'
import ComplaintsPage from './components/ComplaintsPage'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import AdminPortal from './components/AdminPortal'
import AdminRegister from './components/AdminRegister'
import AdminDashboard from './components/AdminDashboard'
import ViewComplaints from './components/ViewComplaints'
import AdminManagement from './components/AdminManagement'
import HostelAdminLogin from './components/HostelAdminLogin'
import MaintenanceAdminLogin from './components/MaintenanceAdminLogin'
import CafeteriaAdminLogin from './components/CafeteriaAdminLogin'
import LibraryAdminLogin from './components/LibraryAdminLogin'
import TransportAdminLogin from './components/TransportAdminLogin'
import RoleBasedDashboard from './components/RoleBasedDashboard'
import AdminNotifications from './components/AdminNotifications'
import DepartmentStatus from './components/DepartmentStatus'
import NoticeManagement from './components/NoticeManagement'
import UserDetails from './components/UserDetails'
import FAQManagement from './components/FAQManagement'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminRole, setAdminRole] = useState('Super Admin')

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('campuscare_session')
  }

  const handleAdminLogin = (role = 'Super Admin') => {
    setIsAdminAuthenticated(true)
    setAdminRole(role)
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setAdminRole('Super Admin')
  }

  const renderStudentPortal = () => {
    // Check both state and localStorage for authentication
    const session = JSON.parse(localStorage.getItem('campuscare_session') || 'null')
    const isLoggedIn = isAuthenticated || (session && session.role === 'student')

    if (isLoggedIn) {
      return <StudentDashboard onLogout={handleLogout} />
    }

    return <Auth onLogin={handleLogin} />
  }

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaints" element={<ComplaintsPage />} />

          {/* Student Portal Route (Legacy - can be accessed via login) */}
          <Route
            path="/student"
            element={<>{renderStudentPortal()}</>}
          />

          {/* Admin Login Route */}
          <Route
            path="/adminpannel"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminPortal onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Admin Register Route */}
          <Route
            path="/admin/register"
            element={
              isAdminAuthenticated ? (
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
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <AdminDashboard onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* View Complaints Route */}
          <Route
            path="/admin/complaints"
            element={
              isAdminAuthenticated ? (
                <ViewComplaints onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Admin Management Route */}
          <Route
            path="/admin/manage"
            element={
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <AdminManagement onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Admin Notifications Route */}
          <Route
            path="/admin/notifications"
            element={
              isAdminAuthenticated ? (
                <AdminNotifications onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Department Status Route */}
          <Route
            path="/admin/department-status"
            element={
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <DepartmentStatus onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Notice Management Route */}
          <Route
            path="/admin/notice-management"
            element={
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <NoticeManagement onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* User Details Route */}
          <Route
            path="/admin/user-details"
            element={
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <UserDetails onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* FAQ Management Route */}
          <Route
            path="/admin/faq-management"
            element={
              isAdminAuthenticated && adminRole === 'Super Admin' ? (
                <FAQManagement onLogout={handleAdminLogout} userRole={adminRole} />
              ) : (
                <Navigate to="/adminpannel" replace />
              )
            }
          />

          {/* Hostel Admin Login */}
          <Route
            path="/admin/hostel/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/hostel/dashboard" replace />
              ) : (
                <HostelAdminLogin onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Hostel Admin Dashboard */}
          <Route
            path="/admin/hostel/dashboard"
            element={
              isAdminAuthenticated && adminRole === 'Hostel Admin' ? (
                <RoleBasedDashboard userRole="Hostel Admin" onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/hostel/login" replace />
              )
            }
          />

          {/* Maintenance Admin Login */}
          <Route
            path="/admin/maintenance/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/maintenance/dashboard" replace />
              ) : (
                <MaintenanceAdminLogin onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Maintenance Admin Dashboard */}
          <Route
            path="/admin/maintenance/dashboard"
            element={
              isAdminAuthenticated && adminRole === 'Maintenance Admin' ? (
                <RoleBasedDashboard userRole="Maintenance Admin" onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/maintenance/login" replace />
              )
            }
          />

          {/* Cafeteria Admin Login */}
          <Route
            path="/admin/cafeteria/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/cafeteria/dashboard" replace />
              ) : (
                <CafeteriaAdminLogin onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Cafeteria Admin Dashboard */}
          <Route
            path="/admin/cafeteria/dashboard"
            element={
              isAdminAuthenticated && adminRole === 'Cafeteria Admin' ? (
                <RoleBasedDashboard userRole="Cafeteria Admin" onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/cafeteria/login" replace />
              )
            }
          />

          {/* Library Admin Login */}
          <Route
            path="/admin/library/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/library/dashboard" replace />
              ) : (
                <LibraryAdminLogin onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Library Admin Dashboard */}
          <Route
            path="/admin/library/dashboard"
            element={
              isAdminAuthenticated && adminRole === 'Library Admin' ? (
                <RoleBasedDashboard userRole="Library Admin" onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/library/login" replace />
              )
            }
          />

          {/* Transport Admin Login */}
          <Route
            path="/admin/transport/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/transport/dashboard" replace />
              ) : (
                <TransportAdminLogin onLogin={handleAdminLogin} />
              )
            }
          />

          {/* Transport Admin Dashboard */}
          <Route
            path="/admin/transport/dashboard"
            element={
              isAdminAuthenticated && adminRole === 'Transport Admin' ? (
                <RoleBasedDashboard userRole="Transport Admin" onLogout={handleAdminLogout} />
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

