import { useState } from 'react';
import NoticesSection from './NoticesSection';
import FAQSection from './FAQSection';

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

  const statusBadgeStyles = {
    Registered: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Closed: 'bg-neutral-100 text-neutral-700 border-neutral-200'
  };

  const priorityBadgeStyles = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    urgent: 'bg-red-50 text-red-700 border-red-200'
  };

  const getStatusBadgeClass = (stage) =>
    `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyles[stage] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`;

  const getPriorityBadgeClass = (priority = '') =>
    `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${priorityBadgeStyles[priority.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200'}`;

  const modalOverlayClass =
    'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4';
  const modalContentBase =
    'bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl';
  const modalContentWide = `${modalContentBase} max-w-5xl`;
  const inputClass =
    'w-full rounded-lg border-2 border-[#eeeeee] px-4 py-3 text-[15px] text-[#333] focus:border-[#e53935] outline-none transition';
  const textareaClass = `${inputClass} min-h-[120px] resize-vertical`;
  const selectClass = inputClass;
  const getStageDotClass = (active) =>
    `text-xs font-semibold px-3 py-1 rounded-full border transition ${
      active ? 'bg-[#ffc53a]/25 text-[#b45309] border-[#ffc53a]/40' : 'text-slate-500 border-slate-200'
    }`;

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
    <div className="min-h-screen bg-[#f5f5f5] font-['Poppins'] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-[1400px] mx-auto space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#333]">Student Dashboard</h1>
            <p className="text-base text-[#666]">Welcome! Manage your complaints and track their status</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-[#e53935] text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-[#e53935]/30 transition hover:-translate-y-0.5 hover:bg-[#c62828]"
            onClick={() => setShowProfile(true)}
          >
            <i className="bx bx-user-circle text-xl"></i>
            Profile
          </button>
        </div>

        <NoticesSection />
        <FAQSection />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-5 rounded-2xl bg-white px-6 py-6 shadow-sm border-l-4 border-[#CD201F]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CD201F] to-[#B34D3A] text-white flex items-center justify-center text-3xl">
              <i className="bx bx-list-ul"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#333]">{statistics.total}</h3>
              <p className="text-sm text-[#666] font-medium">Total Complaints</p>
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-2xl bg-white px-6 py-6 shadow-sm border-l-4 border-[#f59e0b]">
            <div className="w-16 h-16 rounded-2xl bg-[#f59e0b] text-white flex items-center justify-center text-3xl">
              <i className="bx bx-time"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#333]">{statistics.pending}</h3>
              <p className="text-sm text-[#666] font-medium">Pending Complaints</p>
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-2xl bg-white px-6 py-6 shadow-sm border-l-4 border-[#22c55e]">
            <div className="w-16 h-16 rounded-2xl bg-[#22c55e] text-white flex items-center justify-center text-3xl">
              <i className="bx bx-check-circle"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#333]">{statistics.resolved}</h3>
              <p className="text-sm text-[#666] font-medium">Resolved Complaints</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow px-6 sm:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold text-[#333]">Quick Actions</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#e53935] text-white px-5 py-3 font-semibold shadow-lg shadow-[#e53935]/30 transition hover:-translate-y-0.5 hover:bg-[#c62828]"
              onClick={() => setShowComplaintForm(true)}
            >
              <i className="bx bx-plus-circle text-xl"></i>
              File New Complaint
            </button>
            <button
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#e53935] text-[#e53935] px-5 py-3 font-semibold transition hover:bg-[#e53935] hover:text-white"
              onClick={() => setShowComplaintForm(false)}
            >
              <i className="bx bx-search-alt text-xl"></i>
              View Status
            </button>
            <button
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#1d4ed8] border-2 border-[#1d4ed8]/40 transition hover:bg-[#1d4ed8] hover:text-white"
              onClick={() => setShowHistory(true)}
            >
              <i className="bx bx-history text-xl"></i>
              Complaint History
            </button>
          </div>
        </section>

        {!showComplaintForm && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#333]">Your Complaints</h2>
            </div>

            {pendingComplaints.length > 0 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#b45309]">Active Complaints</h3>
                {pendingComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-white border border-amber-100 border-l-4 border-l-amber-400 rounded-2xl p-6 space-y-4 shadow-sm transition hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="text-lg font-semibold text-[#333]">{complaint.title}</h4>
                      <span className={getStatusBadgeClass(complaint.stage)}>{complaint.stage}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#555]">
                      <p className="flex items-center gap-2">
                        <i className="bx bx-category text-[#e53935]"></i>
                        {complaint.category}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="bx bx-calendar text-[#e53935]"></i>
                        {complaint.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="bx bx-building text-[#e53935]"></i>
                        {complaint.department}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ffc53a] to-[#f97316]"
                          style={{ width: `${getStagePercentage(complaint)}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className={getStageDotClass(getStageOrder(complaint.stage) >= 1)}>Registered</span>
                        <span className={getStageDotClass(getStageOrder(complaint.stage) >= 2)}>In Progress</span>
                        <span className={getStageDotClass(getStageOrder(complaint.stage) >= 3)}>Resolved</span>
                        <span className={getStageDotClass(getStageOrder(complaint.stage) >= 4)}>Closed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resolvedComplaints.length > 0 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#15803d]">Resolved Complaints</h3>
                {resolvedComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-white border border-emerald-100 border-l-4 border-l-emerald-500 rounded-2xl p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4
                        className="text-lg font-semibold text-[#333] cursor-pointer"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        {complaint.title}
                      </h4>
                      <span className={getStatusBadgeClass(complaint.stage)}>{complaint.stage}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#555]">
                      <p className="flex items-center gap-2">
                        <i className="bx bx-category text-[#10b981]"></i>
                        {complaint.category}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="bx bx-calendar text-[#10b981]"></i>
                        {complaint.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="bx bx-building text-[#10b981]"></i>
                        {complaint.department}
                      </p>
                    </div>
                    {complaint.feedback && (
                      <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-700 space-y-2">
                        <div className="flex items-center gap-2 font-semibold">
                          <span>Your Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`bx ${star <= complaint.feedback.rating ? 'bxs-star text-[#fbbf24]' : 'bx-star text-emerald-300'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        {complaint.feedback.comment && (
                          <p className="italic text-sm text-emerald-800">
                            “{complaint.feedback.comment}”
                          </p>
                        )}
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full"></div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className={getStageDotClass(true)}>Registered</span>
                        <span className={getStageDotClass(true)}>In Progress</span>
                        <span className={getStageDotClass(true)}>Resolved</span>
                        <span className={getStageDotClass(complaint.stage === 'Closed')}>Closed</span>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 text-emerald-600 px-4 py-2 font-semibold transition hover:bg-emerald-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFeedbackModal(complaint);
                      }}
                    >
                      <i className="bx bx-star text-lg"></i>
                      {complaint.feedback ? 'Update Feedback' : 'Give Feedback'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {complaints.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[#666] flex flex-col items-center gap-4">
                <i className="bx bx-inbox text-4xl text-[#e53935]"></i>
                <p>No complaints filed yet. Click “File New Complaint” to get started!</p>
              </div>
            )}
          </section>
        )}
      </div>

      {showComplaintForm && (
        <div className={modalOverlayClass} onClick={() => setShowComplaintForm(false)}>
          <div className={modalContentBase} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#333]">File New Complaint</h2>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 text-xl flex items-center justify-center hover:bg-[#e53935] hover:text-white"
                onClick={() => setShowComplaintForm(false)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="px-6 py-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-[#333] mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Water leakage in Block A"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-[#333] mb-2">
                  Issue Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className={selectClass}
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
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-[#333] mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Block A, Room 205, Lab 3"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-[#333] mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={selectClass}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#333] mb-2">
                  Issue/Problem Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue or problem in detail..."
                  rows="5"
                  required
                  className={textareaClass}
                ></textarea>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-2">
                    Upload Images (Optional)
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="images"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-600 cursor-pointer hover:border-[#e53935] hover:text-[#e53935]"
                    >
                      <i className="bx bx-image-add text-xl"></i>
                      Choose Images
                    </label>
                    <p className="text-xs text-slate-500">You can upload up to 5 images.</p>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img src={imageUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#e53935] text-white flex items-center justify-center shadow"
                          onClick={() => removeImage(index)}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowComplaintForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#e53935] text-white px-4 py-3 font-semibold shadow-lg shadow-[#e53935]/30 hover:bg-[#c62828]"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistory && (
        <div className={modalOverlayClass} onClick={() => setShowHistory(false)}>
          <div className={modalContentWide} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#333]">Complaint History</h2>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 text-xl flex items-center justify-center hover:bg-[#e53935] hover:text-white"
                onClick={() => setShowHistory(false)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]" htmlFor="filter-category">
                    Filter by Category
                  </label>
                  <select
                    id="filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={selectClass}
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]" htmlFor="filter-status">
                    Filter by Status
                  </label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={selectClass}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Registered">Registered</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]" htmlFor="sort-by">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={selectClass}
                  >
                    <option value="date">Date</option>
                    <option value="category">Category</option>
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]" htmlFor="sort-order">
                    Order
                  </label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={selectClass}
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-[#555]">
                Showing <strong>{filteredComplaints.length}</strong> of{' '}
                <strong>{complaints.length}</strong> complaints
              </div>
              {filteredComplaints.length > 0 ? (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="rounded-2xl border border-slate-200 p-5 bg-white hover:border-[#e53935]/40 transition cursor-pointer"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowHistory(false);
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-[#333]">{complaint.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={getStatusBadgeClass(complaint.stage)}>{complaint.stage}</span>
                            {complaint.priority && (
                              <span className={getPriorityBadgeClass(complaint.priority)}>
                                {complaint.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-[#555]">
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center gap-2">
                            <i className="bx bx-category text-[#e53935]"></i>
                            {complaint.category}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="bx bx-map text-[#e53935]"></i>
                            {complaint.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="bx bx-building text-[#e53935]"></i>
                            {complaint.department}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center gap-2">
                            <i className="bx bx-calendar text-[#e53935]"></i>Filed: {complaint.date}
                          </span>
                          {complaint.resolvedDate && (
                            <span className="flex items-center gap-2">
                              <i className="bx bx-check-circle text-[#22c55e]"></i>
                              Resolved: {complaint.resolvedDate} at {complaint.resolvedTime}
                            </span>
                          )}
                        </div>
                      </div>
                      {complaint.resolutionNotes && (
                        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600">
                          <strong className="text-slate-700">Resolution Notes: </strong>
                          {complaint.resolutionNotes}
                        </div>
                      )}
                      <div className="mt-4 space-y-2">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
                            style={{ width: `${getStagePercentage(complaint)}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-2 text-[11px] font-semibold text-slate-600">
                          <span className={getStageDotClass(getStageOrder(complaint.stage) >= 1)}>R</span>
                          <span className={getStageDotClass(getStageOrder(complaint.stage) >= 2)}>IP</span>
                          <span className={getStageDotClass(getStageOrder(complaint.stage) >= 3)}>RS</span>
                          <span className={getStageDotClass(getStageOrder(complaint.stage) >= 4)}>C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-[#666] flex flex-col items-center gap-3">
                  <i className="bx bx-search-alt text-4xl text-[#e53935]"></i>
                  <p>No complaints found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedComplaint && (
        <div className={modalOverlayClass} onClick={() => setSelectedComplaint(null)}>
          <div className={modalContentWide} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#333]">Complaint Details</h2>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 text-xl flex items-center justify-center hover:bg-[#e53935] hover:text-white"
                onClick={() => setSelectedComplaint(null)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-[#333]">{selectedComplaint.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={getStatusBadgeClass(selectedComplaint.stage)}>{selectedComplaint.stage}</span>
                  <span className={getPriorityBadgeClass(selectedComplaint.priority)}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <i className="bx bx-category text-xl text-[#e53935]"></i>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                    <p className="font-semibold text-[#333]">{selectedComplaint.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <i className="bx bx-map text-xl text-[#e53935]"></i>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
                    <p className="font-semibold text-[#333]">{selectedComplaint.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <i className="bx bx-building text-xl text-[#e53935]"></i>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Handled By</p>
                    <p className="font-semibold text-[#333]">{selectedComplaint.department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <i className="bx bx-calendar text-xl text-[#e53935]"></i>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Date Filed</p>
                    <p className="font-semibold text-[#333]">{selectedComplaint.date}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#333]">Description</label>
                <p className="text-[#555] leading-relaxed bg-slate-50 rounded-xl p-4">
                  {selectedComplaint.description}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#333]">Complaint Timeline</h4>
                <div className="space-y-4">
                  {selectedComplaint.timeline?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-[#e53935]"></span>
                        {index !== selectedComplaint.timeline.length - 1 && (
                          <span className="w-px flex-1 bg-[#e53935]/40"></span>
                        )}
                      </div>
                      <div className="flex-1 rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#333]">{item.stage}</span>
                          <span className="text-xs text-slate-500">{item.date} at {item.time}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{item.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#333]">Progress</label>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f97316] via-[#fbbf24] to-[#22c55e]"
                    style={{ width: `${getStagePercentage(selectedComplaint)}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className={getStageDotClass(getStageOrder(selectedComplaint.stage) >= 1)}>
                    Registered
                  </span>
                  <span className={getStageDotClass(getStageOrder(selectedComplaint.stage) >= 2)}>
                    In Progress
                  </span>
                  <span className={getStageDotClass(getStageOrder(selectedComplaint.stage) >= 3)}>
                    Resolved
                  </span>
                  <span className={getStageDotClass(getStageOrder(selectedComplaint.stage) >= 4)}>
                    Closed
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFeedback && feedbackComplaint && (
        <div className={modalOverlayClass} onClick={() => setShowFeedback(false)}>
          <div className={modalContentBase} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#333]">Rate Your Experience</h2>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 text-xl flex items-center justify-center hover:bg-[#e53935] hover:text-white"
                onClick={() => setShowFeedback(false)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="px-6 py-6 space-y-6">
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 space-y-1">
                <h3 className="text-lg font-semibold text-[#333]">{feedbackComplaint.title}</h3>
                <p className="text-sm text-[#555] flex items-center gap-2">
                  <i className="bx bx-category text-[#e53935]"></i>
                  {feedbackComplaint.category}
                </p>
                <p className="text-sm text-[#555] flex items-center gap-2">
                  <i className="bx bx-calendar text-[#e53935]"></i>
                  Resolved on {feedbackComplaint.resolvedDate || feedbackComplaint.date}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#333]">
                  How would you rate the resolution of this complaint? *
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = star <= rating;
                      const isHovered = star <= hoverRating && hoverRating > 0;
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`text-3xl transition ${isSelected || isHovered ? 'text-[#ffc107]' : 'text-slate-300'}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <i className={`bx ${isSelected || isHovered ? 'bxs-star' : 'bx-star'}`}></i>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="feedback-comment" className="text-sm font-semibold text-[#333] mb-2 block">
                  Additional Comments (Optional)
                </label>
                <textarea
                  id="feedback-comment"
                  name="feedback-comment"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience or any additional feedback..."
                  rows="5"
                  className={textareaClass}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#e53935] text-white px-4 py-3 font-semibold shadow-lg shadow-[#e53935]/30 hover:bg-[#c62828]"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfile && (
        <div className={modalOverlayClass} onClick={() => setShowProfile(false)}>
          <div className={modalContentBase} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#333]">My Profile</h2>
              <button
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 text-xl flex items-center justify-center hover:bg-[#e53935] hover:text-white"
                onClick={() => setShowProfile(false)}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="px-6 py-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <i className="bx bx-user text-4xl text-slate-400"></i>
                  )}
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow border border-slate-200 cursor-pointer"
                  >
                    <i className="bx bx-camera text-sm"></i>
                    Change
                  </label>
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Update your personal information and profile photo so that administrators can reach you quickly.
                </p>
              </div>

              {[
                { id: 'name', label: 'Full Name *', type: 'text', value: profileData.name },
                { id: 'email', label: 'Email Address *', type: 'email', value: profileData.email },
                { id: 'registrationNumber', label: 'College Registration Number *', type: 'text', value: profileData.registrationNumber },
                { id: 'phoneNumber', label: 'Phone Number *', type: 'tel', value: profileData.phoneNumber }
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-semibold text-[#333] mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={field.value}
                    onChange={handleProfileChange}
                    placeholder={`Enter your ${field.label.replace('*', '').toLowerCase()}`}
                    required
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-[#333] mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  required
                  className={selectClass}
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

              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#333]">Change Password</h3>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#e53935]"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                  >
                    <i className={`bx ${showPasswordSection ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                    {showPasswordSection ? 'Hide' : 'Change Password'}
                  </button>
                </div>
                {showPasswordSection && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-[#333] mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-semibold text-[#333] mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 8 characters)"
                        required
                        minLength="8"
                        className={inputClass}
                      />
                      <small className="text-xs text-slate-500">Password must be at least 8 characters long</small>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#333] mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        required
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#e53935] text-white px-4 py-2.5 font-semibold shadow hover:bg-[#c62828]"
                      onClick={handlePasswordUpdate}
                    >
                      <i className="bx bx-lock text-lg"></i>
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowProfile(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#22c55e] text-white px-4 py-3 font-semibold shadow-lg shadow-[#22c55e]/30 hover:bg-[#16a34a]"
                >
                  Save Changes
                </button>
                {onLogout && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold shadow hover:bg-slate-800 inline-flex items-center justify-center gap-2"
                    onClick={onLogout}
                  >
                    <i className="bx bx-log-out text-lg"></i>
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

