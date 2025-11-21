import { useState, useEffect } from 'react'
import './NoticesSection.css'

// This will be shared state or context in real app
const mockNotices = [
  {
    id: 1,
    title: 'Hostel Maintenance Schedule',
    content: 'Scheduled maintenance work will be carried out in Block A from 10 AM to 2 PM on January 20th. Please cooperate.',
    priority: 'High',
    targetAudience: 'All Students',
    status: 'Active',
    createdAt: '2024-01-15',
    expiresAt: '2024-01-25'
  },
  {
    id: 2,
    title: 'Library Extended Hours',
    content: 'Library will remain open until 10 PM during exam period for your convenience.',
    priority: 'Medium',
    targetAudience: 'All Students',
    status: 'Active',
    createdAt: '2024-01-10',
    expiresAt: '2024-02-10'
  }
]

const NoticesSection = () => {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    // Filter active notices that haven't expired
    const now = new Date()
    const activeNotices = mockNotices.filter(notice => {
      if (notice.status !== 'Active') return false
      if (notice.expiresAt) {
        const expiryDate = new Date(notice.expiresAt)
        return expiryDate > now
      }
      return true
    })
    setNotices(activeNotices)
  }, [])

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high'
      case 'Medium':
        return 'priority-medium'
      case 'Low':
        return 'priority-low'
      default:
        return ''
    }
  }

  if (notices.length === 0) {
    return null
  }

  return (
    <div className="notices-section">
      <div className="notices-header">
        <h2>
          <i className="bx bx-bullhorn"></i>
          Important Notices
        </h2>
      </div>

      <div className="notices-list">
        {notices.map(notice => (
          <div key={notice.id} className={`notice-item ${getPriorityClass(notice.priority)}`}>
            <div className="notice-priority-indicator"></div>
            <div className="notice-content-wrapper">
              <div className="notice-title-row">
                <h3>{notice.title}</h3>
                <span className="notice-date">{notice.createdAt}</span>
              </div>
              <p className="notice-text">{notice.content}</p>
              <div className="notice-meta">
                <span className="notice-audience">
                  <i className="bx bx-user"></i>
                  {notice.targetAudience}
                </span>
                {notice.expiresAt && (
                  <span className="notice-expiry">
                    <i className="bx bx-time"></i>
                    Expires: {notice.expiresAt}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoticesSection

