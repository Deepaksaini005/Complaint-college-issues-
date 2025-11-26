import { useState, useEffect } from 'react'
import './NoticesSection.css'
import { contentAPI } from '../services/apiClient'

const NoticesSection = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await contentAPI.notices()
        const sorted = [...data].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setNotices(sorted)
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
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

  const formatDate = (value) => {
    if (!value) return ''
    try {
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return value
    }
  }

  if (loading) {
    return (
      <div className="notices-section">
        <p className="notice-text">Loading important notices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="notices-section">
        <p className="notice-text error-text">{error}</p>
      </div>
    )
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
          <div key={notice._id || notice.id} className={`notice-item ${getPriorityClass(notice.priority)}`}>
            <div className="notice-priority-indicator"></div>
            <div className="notice-content-wrapper">
              <div className="notice-title-row">
                <h3>{notice.title}</h3>
                <span className="notice-date">{formatDate(notice.createdAt)}</span>
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
                    Expires: {formatDate(notice.expiresAt)}
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

