import { useState } from 'react'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <StudentDashboard onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
import { useState } from 'react'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <StudentDashboard onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
import { useState } from 'react'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import AdminPortal from './components/AdminPortal'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activePortal, setActivePortal] = useState('student')

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const renderStudentPortal = () => {
    if (isAuthenticated) {
      return <StudentDashboard onLogout={handleLogout} />
    }

    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="App">
      <header className="app-header">
        <div>
          <p className="app-kicker">Campus Care</p>
          <h1>Unified Access Center</h1>
          <p className="app-subtitle">
            Switch between the student self-service experience and the secure
            management console for admin roles.
          </p>
        </div>

        <div className="portal-toggle">
          <button
            className={activePortal === 'student' ? 'active' : ''}
            onClick={() => setActivePortal('student')}
          >
            Student Portal
          </button>
          <button
            className={activePortal === 'admin' ? 'active' : ''}
            onClick={() => setActivePortal('admin')}
          >
            Admin Portal
          </button>
        </div>
      </header>

      <main className="app-content">
        {activePortal === 'student' ? renderStudentPortal() : <AdminPortal />}
      </main>
    </div>
  )
}

export default App

