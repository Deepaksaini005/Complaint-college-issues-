import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './ViewComplaints.css'

// Mock complaints data
const mockComplaints = [
  {
    id: 1,
    studentName: 'Rajesh Kumar',
    studentId: 'STU001',
    category: 'Hostel',
    priority: 'High',
    status: 'Pending',
    date: '2024-01-15',
    description: 'Room AC not working properly, making loud noise. The AC unit in room 205 has been making loud rattling sounds since yesterday evening. It also leaks water occasionally.',
    department: null,
    assignedTo: null,
    location: 'Hostel Block A, Room 205',
    images: ['https://via.placeholder.com/400x300?text=AC+Issue', 'https://via.placeholder.com/400x300?text=Water+Leakage'],
    resolutionNotes: [],
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    studentName: 'Priya Sharma',
    studentId: 'STU002',
    category: 'Maintenance',
    priority: 'Medium',
    status: 'In-progress',
    date: '2024-01-14',
    description: 'Water leakage in bathroom, needs urgent repair. The tap in the bathroom is continuously dripping and the floor is getting wet. Please fix this as soon as possible.',
    department: 'Maintenance',
    assignedTo: 'Maintenance Team A',
    location: 'Hostel Block B, Room 312, Bathroom',
    images: ['https://via.placeholder.com/400x300?text=Water+Leakage'],
    resolutionNotes: [
      { note: 'Technician assigned to check the issue', addedBy: 'Maintenance Team A', date: '2024-01-14T14:00:00' }
    ],
    createdAt: '2024-01-14T09:15:00',
    updatedAt: '2024-01-14T14:00:00'
  },
  {
    id: 3,
    studentName: 'Amit Singh',
    studentId: 'STU003',
    category: 'Cafeteria',
    priority: 'Low',
    status: 'Resolved',
    date: '2024-01-10',
    description: 'Food quality issue, stale food served. The rice served during lunch was stale and had an unpleasant smell. Several students complained about it.',
    department: 'Cafeteria',
    assignedTo: 'Cafeteria Manager',
    location: 'Main Cafeteria, Counter 3',
    images: ['https://via.placeholder.com/400x300?text=Food+Quality'],
    resolutionNotes: [
      { note: 'Investigated the issue and found the rice was from previous day. Replaced with fresh batch.', addedBy: 'Cafeteria Manager', date: '2024-01-10T15:30:00' },
      { note: 'Issue resolved. Fresh food served. Apologies for the inconvenience.', addedBy: 'Cafeteria Manager', date: '2024-01-10T16:00:00' }
    ],
    createdAt: '2024-01-10T12:00:00',
    updatedAt: '2024-01-10T16:00:00'
  },
  {
    id: 4,
    studentName: 'Sneha Patel',
    studentId: 'STU004',
    category: 'Library',
    priority: 'Medium',
    status: 'Pending',
    date: '2024-01-16',
    description: 'WiFi not working in library reading area. Unable to connect to the campus WiFi network in the reading hall. This is affecting my online classes.',
    department: null,
    assignedTo: null,
    location: 'Central Library, Reading Hall, Section 2',
    images: [],
    resolutionNotes: [],
    createdAt: '2024-01-16T11:20:00',
    updatedAt: '2024-01-16T11:20:00'
  },
  {
    id: 5,
    studentName: 'Vikram Reddy',
    studentId: 'STU005',
    category: 'Transport',
    priority: 'High',
    status: 'In-progress',
    date: '2024-01-13',
    description: 'Bus route timing issue, bus arriving late. Route 5 bus has been consistently arriving 15-20 minutes late for the past week, causing students to miss classes.',
    department: 'Transport',
    assignedTo: 'Transport Coordinator',
    location: 'Bus Stop 3, Route 5',
    images: [],
    resolutionNotes: [
      { note: 'Investigating the delay issue with Route 5. Checking driver schedules and traffic patterns.', addedBy: 'Transport Coordinator', date: '2024-01-13T13:00:00' }
    ],
    createdAt: '2024-01-13T08:00:00',
    updatedAt: '2024-01-13T13:00:00'
  },
  {
    id: 6,
    studentName: 'Anjali Mehta',
    studentId: 'STU006',
    category: 'Hostel',
    priority: 'High',
    status: 'Pending',
    date: '2024-01-17',
    description: 'Room cleaning not done properly. The cleaning staff has not been cleaning the room thoroughly. Dust and dirt are accumulating in corners.',
    department: null,
    assignedTo: null,
    location: 'Hostel Block C, Room 108',
    images: ['https://via.placeholder.com/400x300?text=Cleaning+Issue'],
    resolutionNotes: [],
    createdAt: '2024-01-17T09:00:00',
    updatedAt: '2024-01-17T09:00:00'
  },
  {
    id: 7,
    studentName: 'Rohit Verma',
    studentId: 'STU007',
    category: 'Maintenance',
    priority: 'Medium',
    status: 'Resolved',
    date: '2024-01-08',
    description: 'Elevator not working on 3rd floor. The elevator gets stuck between 2nd and 3rd floor. This is a safety concern.',
    department: 'Maintenance',
    assignedTo: 'Maintenance Team B',
    location: 'Academic Block, Elevator 2, 3rd Floor',
    images: ['https://via.placeholder.com/400x300?text=Elevator+Issue'],
    resolutionNotes: [
      { note: 'Technician called for inspection. Found issue with the motor.', addedBy: 'Maintenance Team B', date: '2024-01-08T10:00:00' },
      { note: 'Motor replaced and elevator tested. Now working properly.', addedBy: 'Maintenance Team B', date: '2024-01-08T16:00:00' }
    ],
    createdAt: '2024-01-08T08:30:00',
    updatedAt: '2024-01-08T16:00:00'
  },
  {
    id: 8,
    studentName: 'Kavita Nair',
    studentId: 'STU008',
    category: 'Cafeteria',
    priority: 'Low',
    status: 'In-progress',
    date: '2024-01-15',
    description: 'Request for more vegetarian options. The current menu has limited vegetarian choices. Please add more variety in vegetarian dishes.',
    department: 'Cafeteria',
    assignedTo: 'Cafeteria Manager',
    location: 'Main Cafeteria',
    images: [],
    resolutionNotes: [
      { note: 'Reviewing the menu and will add more vegetarian options starting next week.', addedBy: 'Cafeteria Manager', date: '2024-01-15T14:00:00' }
    ],
    createdAt: '2024-01-15T12:30:00',
    updatedAt: '2024-01-15T14:00:00'
  }
]

const ViewComplaints = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState(mockComplaints)
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints)
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

  const departments = ['Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']
  const priorities = ['High', 'Medium', 'Low']
  const statuses = ['Pending', 'In-progress', 'Resolved']

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

  const handleAssignSubmit = () => {
    if (!assignDepartment) {
      alert('Please select a department')
      return
    }

    setComplaints(prev =>
      prev.map(c =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              department: assignDepartment,
              status: 'In-progress',
              assignedTo: `${assignDepartment} Team`,
              updatedAt: new Date().toISOString()
            }
          : c
      )
    )

    setShowAssignModal(false)
    setSelectedComplaint(null)
    setAssignDepartment('')
  }

  const handleStatusUpdate = () => {
    if (!newStatus) {
      alert('Please select a status')
      return
    }

    if (newStatus === selectedComplaint.status) {
      return
    }

    setComplaints(prev =>
      prev.map(c =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              status: newStatus,
              updatedAt: new Date().toISOString()
            }
          : c
      )
    )

    if (resolutionNote.trim()) {
      handleAddResolutionNote()
    }

    alert('Status updated successfully!')
  }

  const handleAddResolutionNote = () => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note')
      return
    }

    const newNote = {
      note: resolutionNote,
      addedBy: userRole,
      date: new Date().toISOString()
    }

    setComplaints(prev =>
      prev.map(c =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              resolutionNotes: [...(c.resolutionNotes || []), newNote],
              updatedAt: new Date().toISOString()
            }
          : c
      )
    )

    setResolutionNote('')
    alert('Resolution note added successfully!')
  }

  const handleTransferComplaint = () => {
    if (!transferDepartment) {
      alert('Please select a department to transfer to')
      return
    }

    if (transferDepartment === selectedComplaint.department) {
      alert('Cannot transfer to the same department')
      return
    }

    setComplaints(prev =>
      prev.map(c =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              department: transferDepartment,
              assignedTo: `${transferDepartment} Team`,
              resolutionNotes: [
                ...(c.resolutionNotes || []),
                {
                  note: `Complaint transferred from ${selectedComplaint.department || 'Unassigned'} to ${transferDepartment}`,
                  addedBy: userRole,
                  date: new Date().toISOString()
                }
              ],
              updatedAt: new Date().toISOString()
            }
          : c
      )
    )

    setTransferDepartment('')
    alert('Complaint transferred successfully!')
  }

  const handleMarkResolved = (complaintId) => {
    if (window.confirm('Are you sure you want to mark this complaint as resolved?')) {
      setComplaints(prev =>
        prev.map(c =>
          c.id === complaintId ? { ...c, status: 'Resolved' } : c
        )
      )
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending'
      case 'In-progress':
        return 'status-in-progress'
      case 'Resolved':
        return 'status-resolved'
      default:
        return ''
    }
  }

  const getPriorityBadgeClass = (priority) => {
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
              <h1>View Complaints</h1>
              <p className="header-subtitle">
                Manage and track all student complaints
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
                {filteredComplaints.length === 0 ? (
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
                          {complaint.status !== 'Resolved' && (
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
                    <option value="Pending">Pending</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Resolved">Resolved</option>
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

