import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import './ViewComplaints.css'
import { complaintAPI } from '../../services/apiClient'

const normalizeComplaint = (complaint) => ({
  ...complaint,
  id: complaint._id,
  studentName: complaint.student?.name || 'Student',
  studentId: complaint.student?.registrationNumber || complaint.student?._id?.slice(-6) || 'N/A',
  date: complaint.createdAt ? new Date(complaint.createdAt).toISOString().split('T')[0] : '',
  department: complaint.assignedDepartment || complaint.department || 'Pending Assignment',
  resolutionNotes: complaint.resolutionNotes || [],
  assignedTo: complaint.assignedDepartment ? `${complaint.assignedDepartment} Team` : complaint.assignedTo || ''
})

const ViewComplaints = ({ onLogout, userRole = 'admin' }) => {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  
  // Map backend roles to department names
  const roleToDepartment = {
    'admin': null, // Super admin sees all
    'hostel': 'Hostel',
    'maintenance': 'Maintenance',
    'cafeteria': 'Cafeteria',
    'library': 'Library',
    'transport': 'Transport'
  }
  
  const userDepartment = roleToDepartment[userRole]
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    studentName: '',
    date: ''
  })
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [assignDepartment, setAssignDepartment] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [resolutionNote, setResolutionNote] = useState('')
  const [transferDepartment, setTransferDepartment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const departments = ['Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']
  const priorities = ['Urgent', 'High', 'Medium', 'Low']
  const statuses = ['Registered', 'In Progress', 'Resolved', 'Closed']

  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true)
      const data = await complaintAPI.adminList()
      let normalized = data.map(normalizeComplaint)
      
      // Filter by department if user is a department admin
      if (userDepartment) {
        normalized = normalized.filter(complaint => 
          complaint.department === userDepartment || 
          complaint.assignedDepartment === userDepartment
        )
      }
      
      setComplaints(normalized)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userDepartment])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  useEffect(() => {
    let filtered = [...complaints]

    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category)
    }
    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority)
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters.studentName) {
      filtered = filtered.filter(c =>
        c.studentName.toLowerCase().includes(filters.studentName.toLowerCase())
      )
    }
    if (filters.date) {
      filtered = filtered.filter(c => c.date === filters.date)
    }

    setFilteredComplaints(filtered)
  }, [filters, complaints])

  // Update selected complaint when complaints change
  useEffect(() => {
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id)
      if (updated) {
        setSelectedComplaint(updated)
        setNewStatus(updated.status)
        setAssignDepartment(updated.department || '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaints])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAssign = (complaint) => {
    setSelectedComplaint(complaint)
    setShowAssignModal(true)
    setAssignDepartment(complaint.department || '')
  }

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint)
    setNewStatus(complaint.status)
    setAssignDepartment(complaint.department || '')
    setResolutionNote('')
    setTransferDepartment('')
    setShowDetailModal(true)
  }

  const handleAssignSubmit = async () => {
    if (!assignDepartment) {
      alert('Please select a department')
      return
    }

    try {
      await complaintAPI.adminUpdate(selectedComplaint.id, {
        assignedDepartment: assignDepartment,
        status: 'In Progress',
        note: `Assigned to ${assignDepartment} team`
      })
      await loadComplaints()
      setShowAssignModal(false)
      setSelectedComplaint(null)
      setAssignDepartment('')
      alert('Complaint assigned successfully!')
    } catch (error) {
      alert(error.message || 'Unable to assign complaint')
    }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      alert('Please select a status')
      return
    }

    if (newStatus === selectedComplaint.status) {
      return
    }

    try {
      await complaintAPI.adminUpdate(selectedComplaint.id, {
        status: newStatus,
        note: resolutionNote || `Status updated to ${newStatus}`
      })
      await loadComplaints()
      setResolutionNote('')
      alert('Status updated successfully!')
    } catch (error) {
      alert(error.message || 'Unable to update status')
    }
  }

  const handleAddResolutionNote = async () => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note')
      return
    }

    try {
      await complaintAPI.adminUpdate(selectedComplaint.id, {
        note: `${resolutionNote} — ${userRole}`
      })
      await loadComplaints()
      setResolutionNote('')
      alert('Resolution note added successfully!')
    } catch (error) {
      alert(error.message || 'Unable to add note')
    }
  }

  const handleTransferComplaint = async () => {
    if (!transferDepartment) {
      alert('Please select a department to transfer to')
      return
    }

    if (transferDepartment === selectedComplaint.department) {
      alert('Cannot transfer to the same department')
      return
    }

    try {
      await complaintAPI.adminUpdate(selectedComplaint.id, {
        assignedDepartment: transferDepartment,
        note: `Transferred from ${selectedComplaint.department || 'Unassigned'} to ${transferDepartment}`
      })
      await loadComplaints()
      setTransferDepartment('')
      alert('Complaint transferred successfully!')
    } catch (error) {
      alert(error.message || 'Unable to transfer complaint')
    }
  }

  const handleMarkResolved = async (complaintId) => {
    if (!window.confirm('Are you sure you want to mark this complaint as resolved?')) {
      return
    }
    try {
      await complaintAPI.adminUpdate(complaintId, {
        status: 'Resolved',
        note: `Marked resolved by ${userRole}`
      })
      await loadComplaints()
    } catch (error) {
      alert(error.message || 'Unable to mark resolved')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Registered':
        return 'status-pending'
      case 'In Progress':
        return 'status-in-progress'
      case 'Resolved':
        return 'status-resolved'
      case 'Closed':
        return 'status-closed'
      default:
        return ''
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'priority-urgent'
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  return (
    <div className="view-complaints">
      <AdminSidebar userRole={userRole} />
      
      <div className="complaints-wrapper">
        <header className="complaints-header">
          <div className="header-content">
            <div>
              <h1>{userDepartment ? `${userDepartment} Complaints` : 'View Complaints'}</h1>
              <p className="header-subtitle">
                {userDepartment 
                  ? `Manage and track ${userDepartment.toLowerCase()} department complaints`
                  : 'Manage and track all student complaints'}
              </p>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="complaints-content">
        {/* Filters Section */}
        <div className="filters-section">
          <h2>Filter Complaints</h2>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Student Name</label>
              <input
                type="text"
                placeholder="Search by student name"
                value={filters.studentName}
                onChange={(e) => handleFilterChange('studentName', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <button
                className="clear-filters-btn"
                onClick={() => setFilters({
                  category: '',
                  priority: '',
                  status: '',
                  studentName: '',
                  date: ''
                })}
              >
                <i className="bx bx-x"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="complaints-list-section">
          <div className="list-header">
            <h2>
              All Complaints ({filteredComplaints.length})
            </h2>
          </div>

          <div className="complaints-table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      Loading complaints...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="no-data error-text">
                      {error}
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No complaints found matching the filters
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td>#{complaint.id}</td>
                      <td>
                        <div className="student-info">
                          <strong>{complaint.studentName}</strong>
                          <span className="student-id">{complaint.studentId}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{complaint.category}</span>
                      </td>
                      <td>
                        <span className={`priority-badge ${getPriorityBadgeClass(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{complaint.date}</td>
                      <td>
                        {complaint.department ? (
                          <span className="department-assigned">{complaint.department}</span>
                        ) : (
                          <span className="department-unassigned">Not Assigned</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => handleViewDetails(complaint)}
                            title="View Details"
                          >
                            <i className="bx bx-show"></i>
                          </button>
                          {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
                            <>
                              {!complaint.department && (
                                <button
                                  className="assign-btn"
                                  onClick={() => handleAssign(complaint)}
                                  title="Assign to Department"
                                >
                                  <i className="bx bx-user-plus"></i>
                                </button>
                              )}
                              <button
                                className="resolve-btn"
                                onClick={() => handleMarkResolved(complaint.id)}
                                title="Mark as Resolved"
                              >
                                <i className="bx bx-check"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* Modal for Quick Assign */}
      {showAssignModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Complaint</h2>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="assign-section">
                <label>Assign to Department:</label>
                <select
                  value={assignDepartment}
                  onChange={(e) => setAssignDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="assign-submit-btn"
                onClick={handleAssignSubmit}
                disabled={!assignDepartment}
              >
                {selectedComplaint.department ? 'Reassign Department' : 'Assign Department'}
              </button>
              <button className="close-modal-btn" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Complaint Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint Details - #{selectedComplaint.id}</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="modal-body detail-modal-body">
              {/* Basic Information */}
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <label>Student Name:</label>
                    <span><strong>{selectedComplaint.studentName}</strong> ({selectedComplaint.studentId})</span>
                  </div>
                  <div className="detail-row">
                    <label>Category:</label>
                    <span className="category-badge">{selectedComplaint.category}</span>
                  </div>
                  <div className="detail-row">
                    <label>Priority:</label>
                    <span className={`priority-badge ${getPriorityBadgeClass(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusBadgeClass(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Date Submitted:</label>
                    <span>{selectedComplaint.date}</span>
                  </div>
                  <div className="detail-row">
                    <label>Assigned Department:</label>
                    <span>
                      {selectedComplaint.department || <span className="department-unassigned">Not Assigned</span>}
                      {selectedComplaint.assignedTo && ` - ${selectedComplaint.assignedTo}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {selectedComplaint.location && (
                <div className="detail-section">
                  <h3>Location Information</h3>
                  <div className="location-info">
                    <i className="bx bx-map"></i>
                    <span>{selectedComplaint.location}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="detail-section">
                <h3>Description</h3>
                <p className="description-text">{selectedComplaint.description}</p>
              </div>

              {/* Attached Images */}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div className="detail-section">
                  <h3>Attached Images ({selectedComplaint.images.length})</h3>
                  <div className="images-grid">
                    {selectedComplaint.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img 
                          src={image} 
                          alt={`Complaint evidence ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Notes/History */}
              {selectedComplaint.resolutionNotes && selectedComplaint.resolutionNotes.length > 0 && (
                <div className="detail-section">
                  <h3>Resolution Notes & History</h3>
                  <div className="notes-timeline">
                    {selectedComplaint.resolutionNotes.map((note, index) => (
                      <div key={index} className="note-item">
                        <div className="note-header">
                          <span className="note-author">{note.addedBy}</span>
                          <span className="note-date">
                            {new Date(note.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="note-text">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Administrative Actions */}
              <div className="detail-section actions-section">
                <h3>Administrative Actions</h3>
                
                {/* Update Status */}
                <div className="action-group">
                  <label>Update Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Registered">Registered</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button
                    className="action-btn status-btn"
                    onClick={handleStatusUpdate}
                    disabled={newStatus === selectedComplaint.status}
                  >
                    <i className="bx bx-edit"></i>
                    Update Status
                  </button>
                </div>

                {/* Add Resolution Note */}
                <div className="action-group">
                  <label>Add Resolution Note/Comment:</label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter resolution note or comment..."
                    rows="3"
                  />
                  <button
                    className="action-btn note-btn"
                    onClick={handleAddResolutionNote}
                    disabled={!resolutionNote.trim()}
                  >
                    <i className="bx bx-note"></i>
                    Add Note
                  </button>
                </div>

                {/* Transfer to Another Department */}
                {selectedComplaint.department && (
                  <div className="action-group">
                    <label>Transfer to Another Department:</label>
                    <select
                      value={transferDepartment}
                      onChange={(e) => setTransferDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments
                        .filter(dept => dept !== selectedComplaint.department)
                        .map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <button
                      className="action-btn transfer-btn"
                      onClick={handleTransferComplaint}
                      disabled={!transferDepartment}
                    >
                      <i className="bx bx-transfer"></i>
                      Transfer Complaint
                    </button>
                  </div>
                )}

                {/* Assign Department (if not assigned) */}
                {!selectedComplaint.department && (
                  <div className="action-group">
                    <label>Assign to Department:</label>
                    <select
                      value={assignDepartment}
                      onChange={(e) => setAssignDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <button
                      className="action-btn assign-btn-modal"
                      onClick={() => {
                        handleAssignSubmit()
                        setShowDetailModal(false)
                      }}
                      disabled={!assignDepartment}
                    >
                      <i className="bx bx-user-plus"></i>
                      Assign Department
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewComplaints

