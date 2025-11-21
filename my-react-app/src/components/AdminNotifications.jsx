import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './AdminNotifications.css'

// Mock complaints data - in real app, this would come from API
const mockComplaints = [
  { id: 1, priority: 'High', status: 'Pending', department: null, updatedAt: new Date() },
  { id: 2, priority: 'Medium', status: 'Pending', department: null, updatedAt: new Date() },
  { id: 3, priority: 'High', status: 'Resolved', department: 'Maintenance', updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 4, priority: 'Low', status: 'Pending', department: null, updatedAt: new Date() }
]

const AdminNotifications = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Generate notifications based on complaints
    const generateNotifications = () => {
      const notifs = []
      const now = new Date()
      
      // High priority pending complaints
      const highPriorityPending = mockComplaints.filter(
        c => c.priority === 'High' && c.status === 'Pending'
      )
      if (highPriorityPending.length > 0) {
        notifs.push({
          id: 1,
          type: 'urgent',
          title: `${highPriorityPending.length} High Priority Complaint${highPriorityPending.length > 1 ? 's' : ''} Pending`,
          message: `You have ${highPriorityPending.length} high priority complaint${highPriorityPending.length > 1 ? 's' : ''} that need immediate attention.`,
          time: 'Just now',
          icon: 'bx-error-circle',
          read: false
        })
      }

      // Unassigned complaints
      const unassigned = mockComplaints.filter(c => !c.department)
      if (unassigned.length > 0) {
        notifs.push({
          id: 2,
          type: 'warning',
          title: `${unassigned.length} Unassigned Complaint${unassigned.length > 1 ? 's' : ''}`,
          message: `${unassigned.length} complaint${unassigned.length > 1 ? 's' : ''} need${unassigned.length === 1 ? 's' : ''} to be assigned to a department.`,
          time: '5 min ago',
          icon: 'bx-user-x',
          read: false
        })
      }

      // Recent resolved
      const recentResolved = mockComplaints.filter(
        c => c.status === 'Resolved' && new Date(c.updatedAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      )
      if (recentResolved.length > 0) {
        notifs.push({
          id: 3,
          type: 'success',
          title: `${recentResolved.length} Complaint${recentResolved.length > 1 ? 's' : ''} Resolved Today`,
          message: `Great work! ${recentResolved.length} complaint${recentResolved.length > 1 ? 's have' : ' has'} been resolved in the last 24 hours.`,
          time: '1 hour ago',
          icon: 'bx-check-circle',
          read: false
        })
      }

      // Department-specific notifications
      if (userRole !== 'Super Admin') {
        const deptComplaints = mockComplaints.filter(
          c => c.department === userRole.replace(' Admin', '')
        )
        const deptPending = deptComplaints.filter(c => c.status === 'Pending')
        if (deptPending.length > 0) {
          notifs.push({
            id: 4,
            type: 'info',
            title: `${deptPending.length} Pending in Your Department`,
            message: `You have ${deptPending.length} pending complaint${deptPending.length > 1 ? 's' : ''} in your department.`,
            time: '10 min ago',
            icon: 'bx-time',
            read: false
          })
        }
      }

      setNotifications(notifs)
    }

    generateNotifications()
  }, [userRole])

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="admin-notifications-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="notifications-wrapper">
        <header className="notifications-header">
          <div className="header-content">
            <div>
              <h1>Notifications</h1>
              <p className="header-subtitle">
                Stay updated with important alerts and updates
                {unreadCount > 0 && (
                  <span className="unread-badge">{unreadCount} unread</span>
                )}
              </p>
            </div>
            <div className="header-actions">
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>
                  <i className="bx bx-check-double"></i>
                  Mark All as Read
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <i className="bx bx-bell-off"></i>
              <h2>No Notifications</h2>
              <p>You're all caught up! No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon">
                    <i className={`bx ${notif.icon}`}></i>
                  </div>
                  <div className="notification-content">
                    <h3>{notif.title}</h3>
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                  <div className="notification-actions">
                    {!notif.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => markAsRead(notif.id)}
                        title="Mark as read"
                      >
                        <i className="bx bx-check"></i>
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete notification"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications
