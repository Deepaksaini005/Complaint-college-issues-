import { useState } from 'react';
import './StudentDashboard.css';

const StudentDashboard = ({ onLogout }) => {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [complaints, setComplaints] = useState([
    { 
      id: 1, 
      title: 'Water leakage in Block A', 
      category: 'Water Issue', 
      status: 'In Progress', 
      stage: 'In Progress',
      date: '2024-01-15',
      department: 'Maintenance Department',
      description: 'Severe water leakage from the ceiling in Block A, Room 101',
      location: 'Block A, Room 101',
      priority: 'High',
      timeline: [
        { stage: 'Registered', date: '2024-01-15', time: '10:30 AM', department: 'System' },
        { stage: 'In Progress', date: '2024-01-16', time: '09:15 AM', department: 'Maintenance Department' }
      ]
    },
    { 
      id: 2, 
      title: 'Fan not working in Room 205', 
      category: 'Fan Problem', 
      status: 'Resolved', 
      stage: 'Resolved',
      date: '2024-01-10',
      department: 'Maintenance Department',
      description: 'Ceiling fan stopped working completely',
      location: 'Block B, Room 205',
      priority: 'Medium',
      timeline: [
        { stage: 'Registered', date: '2024-01-10', time: '02:45 PM', department: 'System' },
        { stage: 'In Progress', date: '2024-01-11', time: '10:00 AM', department: 'Maintenance Department' },
        { stage: 'Resolved', date: '2024-01-12', time: '03:30 PM', department: 'Maintenance Department' },
        { stage: 'Closed', date: '2024-01-13', time: '11:00 AM', department: 'System' }
      ],
      resolutionNotes: 'Fan was replaced with a new one. Tested and working properly. Issue resolved successfully.',
      resolvedDate: '2024-01-12',
      resolvedTime: '03:30 PM',
      feedback: {
        rating: 5,
        comment: 'Excellent service! The issue was resolved quickly and efficiently.',
        submittedDate: '2024-01-13'
      }
    },
    { 
      id: 3, 
      title: 'Electricity issue in Lab 3', 
      category: 'Electricity Problem', 
      status: 'Pending', 
      stage: 'Registered',
      date: '2024-01-18',
      department: 'Electrical Department',
      description: 'Power sockets not working in Lab 3',
      location: 'Lab Building, Lab 3',
      priority: 'Urgent',
      timeline: [
        { stage: 'Registered', date: '2024-01-18', time: '09:00 AM', department: 'System' }
      ]
    },
    {
      id: 4,
      title: 'Plaster falling in Hostel Room',
      category: 'Plaster Issue',
      status: 'In Progress',
      stage: 'In Progress',
      date: '2024-01-20',
      department: 'Hostel Admin',
      description: 'Plaster is falling from the wall in hostel room',
      location: 'Hostel Block C, Room 305',
      priority: 'High',
      timeline: [
        { stage: 'Registered', date: '2024-01-20', time: '11:20 AM', department: 'System' },
        { stage: 'In Progress', date: '2024-01-21', time: '08:30 AM', department: 'Hostel Admin' }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
    images: []
  });

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@college.edu',
    registrationNumber: 'REG2024001',
    phoneNumber: '+91 98765 43210',
    department: 'Computer Science',
    profileImage: null
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@college.edu',
    registrationNumber: 'REG2024001',
    phoneNumber: '+91 98765 43210',
    department: 'Computer Science',
    profileImage: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const getStageOrder = (stage) => {
    const stages = { 'Registered': 1, 'In Progress': 2, 'Resolved': 3, 'Closed': 4 };
    return stages[stage] || 0;
  };

  const getStagePercentage = (complaint) => {
    const currentStage = getStageOrder(complaint.stage);
    return (currentStage / 4) * 100;
  };

  const statistics = {
    total: complaints.length,
    pending: complaints.filter(c => c.stage === 'Registered' || c.stage === 'In Progress').length,
    resolved: complaints.filter(c => c.stage === 'Resolved' || c.stage === 'Closed').length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const remainingSlots = 5 - formData.images.length;
      if (remainingSlots <= 0) {
        alert('Maximum 5 images allowed');
        e.target.value = '';
        return;
      }
      
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      const imageUrls = filesToAdd.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      if (imageFiles.length > remainingSlots) {
        alert(`Only ${remainingSlots} image(s) added. Maximum 5 images allowed.`);
      }
      
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[index]);
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newComplaint = {
      id: complaints.length + 1,
      title: formData.title,
      category: formData.category,
      status: 'Pending',
      stage: 'Registered',
      date: formattedDate,
      department: 'Pending Assignment',
      description: formData.description,
      location: formData.location,
      priority: formData.priority,
      timeline: [
        { stage: 'Registered', date: formattedDate, time: formattedTime, department: 'System' }
      ]
    };
    setComplaints([...complaints, newComplaint]);
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      priority: 'Medium',
      images: []
    });
    setShowComplaintForm(false);
    alert('Complaint filed successfully!');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
    }
    e.target.value = '';
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Check if any data has changed
    const hasChanges = 
      profileData.name !== originalProfileData.name ||
      profileData.email !== originalProfileData.email ||
      profileData.registrationNumber !== originalProfileData.registrationNumber ||
      profileData.phoneNumber !== originalProfileData.phoneNumber ||
      profileData.department !== originalProfileData.department ||
      profileData.profileImage !== originalProfileData.profileImage;

    if (!hasChanges) {
      alert('No changes detected. Please update at least one field.');
      return;
    }

    // Update original data
    setOriginalProfileData({ ...profileData });
    alert('Profile updated successfully!');
    setShowProfile(false);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      alert('Please enter your current password');
      return;
    }

    if (!passwordData.newPassword) {
      alert('Please enter a new password');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      alert('New password must be different from current password');
      return;
    }

    // Simulate password update
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordSection(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === feedbackComplaint.id) {
        return {
          ...complaint,
          feedback: {
            rating: rating,
            comment: feedbackComment,
            submittedDate: currentDate
          }
        };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    alert('Thank you for your feedback!');
    setShowFeedback(false);
    setRating(0);
    setFeedbackComment('');
    setFeedbackComplaint(null);
  };

  const openFeedbackModal = (complaint) => {
    if (complaint.feedback) {
      setRating(complaint.feedback.rating);
      setFeedbackComment(complaint.feedback.comment || '');
    } else {
      setRating(0);
      setFeedbackComment('');
    }
    setFeedbackComplaint(complaint);
    setShowFeedback(true);
  };

  const pendingComplaints = complaints.filter(c => c.stage === 'Registered' || c.stage === 'In Progress');
  const resolvedComplaints = complaints.filter(c => c.stage === 'Resolved' || c.stage === 'Closed');

  // Filter and sort complaints for history
  const getFilteredAndSortedComplaints = () => {
    let filtered = [...complaints];

    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(c => c.category === filterCategory);
    }

    // Filter by status
    if (filterStatus !== 'All') {
      if (filterStatus === 'Active') {
        filtered = filtered.filter(c => c.stage === 'Registered' || c.stage === 'In Progress');
      } else if (filterStatus === 'Resolved') {
        filtered = filtered.filter(c => c.stage === 'Resolved' || c.stage === 'Closed');
      } else {
        filtered = filtered.filter(c => c.stage === filterStatus);
      }
    }

    // Sort complaints
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === 'status') {
        comparison = getStageOrder(a.stage) - getStageOrder(b.stage);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredComplaints = getFilteredAndSortedComplaints();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome! Manage your complaints and track their status</p>
          </div>
          <button className="profile-btn" onClick={() => setShowProfile(true)}>
            <i className="bx bx-user-circle"></i>
            Profile
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="bx bx-list-ul"></i>
          </div>
          <div className="stat-content">
            <h3>{statistics.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="bx bx-time"></i>
          </div>
          <div className="stat-content">
            <h3>{statistics.pending}</h3>
            <p>Pending Complaints</p>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">
            <i className="bx bx-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{statistics.resolved}</h3>
            <p>Resolved Complaints</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary" 
            onClick={() => setShowComplaintForm(true)}
          >
            <i className="bx bx-plus-circle"></i>
            File New Complaint
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setShowComplaintForm(false)}
          >
            <i className="bx bx-search-alt"></i>
            View Status
          </button>
          <button 
            className="action-btn tertiary"
            onClick={() => setShowHistory(true)}
          >
            <i className="bx bx-history"></i>
            Complaint History
          </button>
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="modal-overlay" onClick={() => setShowComplaintForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>File New Complaint</h2>
              <button className="close-btn" onClick={() => setShowComplaintForm(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="complaint-form">
              <div className="form-group">
                <label htmlFor="title">Complaint Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Water leakage in Block A"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Issue Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Water Issue">Water Issue</option>
                  <option value="Electricity Problem">Electricity Problem</option>
                  <option value="Fan Problem">Fan Problem</option>
                  <option value="Plaster Issue">Plaster Issue</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Internet/Network">Internet/Network</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Block A, Room 205, Lab 3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Issue/Problem Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue or problem in detail..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="images">Upload Images (Optional)</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="images" className="file-input-label">
                    <i className="bx bx-image-add"></i>
                    <span>Choose Images</span>
                  </label>
                  <p className="file-hint">You can upload multiple images (Max 5 images)</p>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="image-preview-container">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="image-preview">
                        <img src={imageUrl} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowComplaintForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaints List */}
      {!showComplaintForm && (
        <div className="complaints-section">
          <h2>Your Complaints</h2>
          
          {pendingComplaints.length > 0 && (
            <div className="complaints-list">
              <h3 className="section-title pending-title">Active Complaints</h3>
              {pendingComplaints.map(complaint => (
                <div key={complaint.id} className="complaint-card pending-card" onClick={() => setSelectedComplaint(complaint)}>
                  <div className="complaint-header">
                    <h4>{complaint.title}</h4>
                    <span className={`status-badge ${complaint.stage === 'Registered' ? 'registered-badge' : 'inprogress-badge'}`}>
                      {complaint.stage}
                    </span>
                  </div>
                  <div className="complaint-details">
                    <p><i className="bx bx-category"></i> {complaint.category}</p>
                    <p><i className="bx bx-calendar"></i> {complaint.date}</p>
                    <p><i className="bx bx-building"></i> {complaint.department}</p>
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${getStagePercentage(complaint)}%` }}></div>
                    </div>
                    <div className="progress-stages">
                      <span className={`stage-dot ${getStageOrder(complaint.stage) >= 1 ? 'active' : ''}`}>Registered</span>
                      <span className={`stage-dot ${getStageOrder(complaint.stage) >= 2 ? 'active' : ''}`}>In Progress</span>
                      <span className={`stage-dot ${getStageOrder(complaint.stage) >= 3 ? 'active' : ''}`}>Resolved</span>
                      <span className={`stage-dot ${getStageOrder(complaint.stage) >= 4 ? 'active' : ''}`}>Closed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resolvedComplaints.length > 0 && (
            <div className="complaints-list">
              <h3 className="section-title resolved-title">Resolved Complaints</h3>
              {resolvedComplaints.map(complaint => (
                <div key={complaint.id} className="complaint-card resolved-card">
                  <div className="complaint-header">
                    <h4 onClick={() => setSelectedComplaint(complaint)} style={{ cursor: 'pointer' }}>{complaint.title}</h4>
                    <span className={`status-badge ${complaint.stage === 'Resolved' ? 'resolved-badge' : 'closed-badge'}`}>
                      {complaint.stage}
                    </span>
                  </div>
                  <div className="complaint-details">
                    <p><i className="bx bx-category"></i> {complaint.category}</p>
                    <p><i className="bx bx-calendar"></i> {complaint.date}</p>
                    <p><i className="bx bx-building"></i> {complaint.department}</p>
                  </div>
                  {complaint.feedback && (
                    <div className="feedback-display">
                      <div className="feedback-rating-display">
                        <span>Your Rating: </span>
                        <div className="star-rating-display">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i 
                              key={star} 
                              className={`bx ${star <= complaint.feedback.rating ? 'bxs-star' : 'bx-star'}`}
                              style={{ color: star <= complaint.feedback.rating ? '#ffc107' : '#ddd' }}
                            ></i>
                          ))}
                        </div>
                      </div>
                      {complaint.feedback.comment && (
                        <p className="feedback-comment-display">"{complaint.feedback.comment}"</p>
                      )}
                    </div>
                  )}
                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div className="progress-bar completed" style={{ width: '100%' }}></div>
                    </div>
                    <div className="progress-stages">
                      <span className="stage-dot active">Registered</span>
                      <span className="stage-dot active">In Progress</span>
                      <span className="stage-dot active">Resolved</span>
                      <span className={`stage-dot ${complaint.stage === 'Closed' ? 'active' : ''}`}>Closed</span>
                    </div>
                  </div>
                  <button 
                    className="feedback-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFeedbackModal(complaint);
                    }}
                  >
                    <i className="bx bx-star"></i>
                    {complaint.feedback ? 'Update Feedback' : 'Give Feedback'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {complaints.length === 0 && (
            <div className="no-complaints">
              <i className="bx bx-inbox"></i>
              <p>No complaints filed yet. Click "File New Complaint" to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Complaint History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint History</h2>
              <button className="close-btn" onClick={() => setShowHistory(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <div className="history-filters">
              <div className="filter-group">
                <label htmlFor="filter-category">Filter by Category</label>
                <select
                  id="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Water Issue">Water Issue</option>
                  <option value="Electricity Problem">Electricity Problem</option>
                  <option value="Fan Problem">Fan Problem</option>
                  <option value="Plaster Issue">Plaster Issue</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Internet/Network">Internet/Network</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-status">Filter by Status</label>
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Registered">Registered</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-by">Sort By</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="date">Date</option>
                  <option value="category">Category</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-order">Order</label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="filter-select"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="history-content">
              <div className="history-stats">
                <p>Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> complaints</p>
              </div>

              {filteredComplaints.length > 0 ? (
                <div className="history-list">
                  {filteredComplaints.map(complaint => (
                    <div 
                      key={complaint.id} 
                      className="history-item"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowHistory(false);
                      }}
                    >
                      <div className="history-item-header">
                        <div className="history-item-title">
                          <h4>{complaint.title}</h4>
                          <div className="history-badges">
                            <span className={`status-badge ${complaint.stage === 'Registered' ? 'registered-badge' : complaint.stage === 'In Progress' ? 'inprogress-badge' : complaint.stage === 'Resolved' ? 'resolved-badge' : 'closed-badge'}`}>
                              {complaint.stage}
                            </span>
                            {complaint.priority && (
                              <span className={`priority-badge ${complaint.priority?.toLowerCase()}`}>
                                {complaint.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="history-item-details">
                        <div className="history-detail-row">
                          <span><i className="bx bx-category"></i> {complaint.category}</span>
                          <span><i className="bx bx-map"></i> {complaint.location}</span>
                          <span><i className="bx bx-building"></i> {complaint.department}</span>
                        </div>
                        <div className="history-detail-row">
                          <span><i className="bx bx-calendar"></i> Filed: {complaint.date}</span>
                          {complaint.resolvedDate && (
                            <span><i className="bx bx-check-circle"></i> Resolved: {complaint.resolvedDate} at {complaint.resolvedTime}</span>
                          )}
                        </div>
                      </div>

                      {complaint.resolutionNotes && (
                        <div className="history-resolution">
                          <strong>Resolution Notes:</strong>
                          <p>{complaint.resolutionNotes}</p>
                        </div>
                      )}

                      <div className="history-timeline-preview">
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${getStagePercentage(complaint)}%` }}></div>
                        </div>
                        <div className="progress-stages">
                          <span className={`stage-dot ${getStageOrder(complaint.stage) >= 1 ? 'active' : ''}`}>R</span>
                          <span className={`stage-dot ${getStageOrder(complaint.stage) >= 2 ? 'active' : ''}`}>IP</span>
                          <span className={`stage-dot ${getStageOrder(complaint.stage) >= 3 ? 'active' : ''}`}>RS</span>
                          <span className={`stage-dot ${getStageOrder(complaint.stage) >= 4 ? 'active' : ''}`}>C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <i className="bx bx-search-alt"></i>
                  <p>No complaints found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content complaint-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button className="close-btn" onClick={() => setSelectedComplaint(null)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="complaint-detail-content">
              <div className="detail-section">
                <h3>{selectedComplaint.title}</h3>
                <div className="detail-badges">
                  <span className={`status-badge ${selectedComplaint.stage === 'Registered' ? 'registered-badge' : selectedComplaint.stage === 'In Progress' ? 'inprogress-badge' : selectedComplaint.stage === 'Resolved' ? 'resolved-badge' : 'closed-badge'}`}>
                    {selectedComplaint.stage}
                  </span>
                  <span className={`priority-badge ${selectedComplaint.priority?.toLowerCase()}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              <div className="detail-info-grid">
                <div className="info-item">
                  <i className="bx bx-category"></i>
                  <div>
                    <label>Category</label>
                    <p>{selectedComplaint.category}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="bx bx-map"></i>
                  <div>
                    <label>Location</label>
                    <p>{selectedComplaint.location}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="bx bx-building"></i>
                  <div>
                    <label>Handled By</label>
                    <p>{selectedComplaint.department}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="bx bx-calendar"></i>
                  <div>
                    <label>Date Filed</label>
                    <p>{selectedComplaint.date}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <label>Description</label>
                <p className="description-text">{selectedComplaint.description}</p>
              </div>

              <div className="detail-section">
                <h4>Complaint Timeline</h4>
                <div className="timeline-container">
                  {selectedComplaint.timeline?.map((item, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-stage">{item.stage}</span>
                          <span className="timeline-date">{item.date} at {item.time}</span>
                        </div>
                        <p className="timeline-department">{item.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="progress-section-detail">
                <label>Progress</label>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${getStagePercentage(selectedComplaint)}%` }}></div>
                </div>
                <div className="progress-stages">
                  <span className={`stage-dot ${getStageOrder(selectedComplaint.stage) >= 1 ? 'active' : ''}`}>
                    Registered
                  </span>
                  <span className={`stage-dot ${getStageOrder(selectedComplaint.stage) >= 2 ? 'active' : ''}`}>
                    In Progress
                  </span>
                  <span className={`stage-dot ${getStageOrder(selectedComplaint.stage) >= 3 ? 'active' : ''}`}>
                    Resolved
                  </span>
                  <span className={`stage-dot ${getStageOrder(selectedComplaint.stage) >= 4 ? 'active' : ''}`}>
                    Closed
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedComplaint(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && feedbackComplaint && (
        <div className="modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Rate Your Experience</h2>
              <button className="close-btn" onClick={() => setShowFeedback(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <div className="feedback-complaint-info">
                <h3>{feedbackComplaint.title}</h3>
                <p><i className="bx bx-category"></i> {feedbackComplaint.category}</p>
                <p><i className="bx bx-calendar"></i> Resolved on {feedbackComplaint.resolvedDate || feedbackComplaint.date}</p>
              </div>

              <div className="feedback-section">
                <label>How would you rate the resolution of this complaint? *</label>
                <div className="star-rating-container">
                  <div className="star-rating" data-rating={rating}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = star <= rating;
                      const isHovered = star <= hoverRating && hoverRating > 0;
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${isSelected ? 'active' : ''}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <i 
                            className={`bx ${isSelected || isHovered ? 'bxs-star' : 'bx-star'}`}
                          ></i>
                        </button>
                      );
                    })}
                  </div>
                  <p className="rating-text">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                </div>
              </div>

              <div className="feedback-section">
                <label htmlFor="feedback-comment">Additional Comments (Optional)</label>
                <textarea
                  id="feedback-comment"
                  name="feedback-comment"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience or any additional feedback..."
                  rows="5"
                  className="feedback-textarea"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowFeedback(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Profile</h2>
              <button className="close-btn" onClick={() => setShowProfile(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="profile-image-placeholder">
                      <i className="bx bx-user"></i>
                    </div>
                  )}
                  <label htmlFor="profile-image-upload" className="profile-image-upload-btn">
                    <i className="bx bx-camera"></i>
                    <span>Change Photo</span>
                  </label>
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="file-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationNumber">College Registration Number *</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={profileData.registrationNumber}
                  onChange={handleProfileChange}
                  placeholder="Enter registration number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Arts & Humanities">Arts & Humanities</option>
                  <option value="Science">Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Password Update Section */}
              <div className="password-update-section">
                <div className="password-section-header">
                  <h3>Change Password</h3>
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                  >
                    {showPasswordSection ? (
                      <>
                        <i className="bx bx-chevron-up"></i>
                        Hide
                      </>
                    ) : (
                      <>
                        <i className="bx bx-chevron-down"></i>
                        Change Password
                      </>
                    )}
                  </button>
                </div>

                {showPasswordSection && (
                  <div className="password-form-section">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password *</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password *</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 8 characters)"
                        required
                        minLength="8"
                      />
                      <small className="password-hint">
                        Password must be at least 8 characters long
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-update-password"
                      onClick={handlePasswordUpdate}
                    >
                      <i className="bx bx-lock"></i>
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowProfile(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
                {onLogout && (
                  <button type="button" className="btn-logout" onClick={onLogout}>
                    <i className="bx bx-log-out"></i>
                    Logout
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

