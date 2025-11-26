import { useEffect, useState } from 'react';
import NoticesSection from '../../components/NoticesSection';
import FAQSection from '../../components/FAQSection';
import { authAPI, complaintAPI } from '../../services/apiClient';

const StudentDashboard = ({ onLogout, user }) => {
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
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
    images: []
  });

  const baseProfile = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@college.edu',
    registrationNumber: user?.registrationNumber || 'REG2024001',
    phoneNumber: user?.phone || '+91 98765 43210',
    department: user?.department || 'Computer Science',
    profileImage: user?.profileImage || null
  };

  const [profileData, setProfileData] = useState(baseProfile);
  const [originalProfileData, setOriginalProfileData] = useState(baseProfile);

  useEffect(() => {
    const nextProfile = {
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@college.edu',
      registrationNumber: user?.registrationNumber || 'REG2024001',
      phoneNumber: user?.phone || '+91 98765 43210',
      department: user?.department || 'Computer Science',
      profileImage: user?.profileImage || null
    };
    setProfileData(nextProfile);
    setOriginalProfileData(nextProfile);
  }, [user]);

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

  const fetchComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const data = await complaintAPI.mine();
      setComplaints(data);
      setComplaintsError('');
    } catch (error) {
      setComplaintsError(error.message);
    } finally {
      setComplaintsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const statistics = {
    total: complaints.length,
    pending: complaints.filter(c => c.stage === 'Registered' || c.stage === 'In Progress').length,
    resolved: complaints.filter(c => c.stage === 'Resolved' || c.stage === 'Closed').length,
  };

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'resources', label: 'Resources' },
    { id: 'support', label: 'Support' }
  ];

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

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description || !formData.location) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      await complaintAPI.create({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        priority: formData.priority,
        images: formData.images || []
      });
      await fetchComplaints();
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
    } catch (error) {
      alert(error.message || 'Unable to file complaint');
    }
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

  const handleProfileSubmit = async (e) => {
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

    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
        registrationNumber: profileData.registrationNumber,
        phone: profileData.phoneNumber,
        department: profileData.department
      };
      const updatedUser = await authAPI.updateProfile(payload);
      setOriginalProfileData({
        name: updatedUser.name || profileData.name,
        email: updatedUser.email || profileData.email,
        registrationNumber: updatedUser.registrationNumber || profileData.registrationNumber,
        phoneNumber: updatedUser.phone || profileData.phoneNumber,
        department: updatedUser.department || profileData.department,
        profileImage: updatedUser.profileImage || profileData.profileImage
      });
      alert('Profile updated successfully!');
      setShowProfile(false);
    } catch (error) {
      alert(error.message || 'Unable to update profile');
    }
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    try {
      await complaintAPI.addFeedback(feedbackComplaint._id || feedbackComplaint.id, {
        rating,
        comment: feedbackComment
      });
      await fetchComplaints();
      alert('Thank you for your feedback!');
      setShowFeedback(false);
      setRating(0);
      setFeedbackComment('');
      setFeedbackComplaint(null);
    } catch (error) {
      alert(error.message || 'Unable to submit feedback');
    }
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
    <div className="min-h-screen bg-[#f4f7fb] text-[#1f2430] font-['Poppins']">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#6b0f12] via-[#b11216] to-[#e3222f] text-white">
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_55%)]"></div>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.15),_transparent_50%)]"></div>
        <div className="w-full px-6 sm:px-12 lg:px-20 py-12 flex flex-col gap-10 relative z-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-[0.3em]">
                <span className="w-2 h-2 rounded-full bg-[#ffd7d7]"></span>
                Campus Care
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                  Student Operations Dashboard
                </h1>
                <p className="text-white/80 text-base sm:text-lg">
                  Welcome back, {user?.name || 'Campus Champion'}!
                </p>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                  Monitor complaint progress, keep up with campus notices, and explore the self-service knowledge
                  base — all in one glance.
                </p>
              </div>
              <nav className="inline-flex flex-wrap gap-3 text-xs sm:text-sm font-semibold" aria-label="Dashboard navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="px-4 py-2 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white transition backdrop-blur"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 -left-10 hidden sm:block">
                <div className="h-full w-24 rounded-full bg-white/10 blur-3xl"></div>
              </div>
              <div className="rounded-3xl bg-white/12 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/30 p-6 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-white/85 m-0">Quick access</p>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-between gap-4 rounded-2xl bg-white text-[#8c0f16] px-5 py-3 font-semibold shadow-lg shadow-[#8c0f16]/15 transition hover:-translate-y-0.5"
                    onClick={() => setShowComplaintForm(true)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <i className="bx bx-edit-alt text-lg"></i>
                      New Complaint
                    </span>
                    <i className="bx bx-right-arrow-alt text-xl"></i>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#f7b7bd] to-[#f18892] border border-white/30 px-5 py-3 font-semibold text-white shadow-inner shadow-white/20"
                    onClick={() => setShowProfile(true)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <i className="bx bx-user-circle text-lg"></i>
                      Profile Center
                    </span>
                    <i className="bx bx-right-arrow-alt text-xl"></i>
                  </button>
                  {onLogout && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#c1363c] to-[#7b1115] border border-white/20 px-5 py-3 font-semibold text-white shadow-inner shadow-black/20"
                      onClick={onLogout}
                    >
                      <span className="inline-flex items-center gap-2">
                        <i className="bx bx-log-out text-lg"></i>
                        Logout
                      </span>
                      <i className="bx bx-right-arrow-alt text-xl"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-16 bg-[#f4f7fb]">
        <div className="w-full px-6 sm:px-10 lg:px-16 space-y-8 pt-10">
          <section id="overview" className="grid gap-5 md:grid-cols-3">
            <div className="flex items-center gap-5 rounded-3xl bg-white px-6 py-6 shadow-lg shadow-[#fcd34d40]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fde68a] to-[#f59e0b] text-white flex items-center justify-center text-3xl shadow">
                <i className="bx bx-list-ul"></i>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold">Total Complaints</p>
                <p className="text-3xl font-semibold text-[#111827] m-0">{statistics.total}</p>
                <span className="text-xs text-[#9ca3af]">All submissions to date</span>
              </div>
            </div>
            <div className="flex items-center gap-5 rounded-3xl bg-white px-6 py-6 shadow-lg shadow-[#fb923c33]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fcd34d] to-[#f97316] text-white flex items-center justify-center text-3xl shadow">
                <i className="bx bx-time-five"></i>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold">Active Cases</p>
                <p className="text-3xl font-semibold text-[#111827] m-0">{statistics.pending}</p>
                <span className="text-xs text-[#9ca3af]">Awaiting resolution</span>
              </div>
            </div>
            <div className="flex items-center gap-5 rounded-3xl bg-white px-6 py-6 shadow-lg shadow-[#34d39933]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6ee7b7] to-[#10b981] text-white flex items-center justify-center text-3xl shadow">
                <i className="bx bx-check-circle"></i>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold">Resolved</p>
                <p className="text-3xl font-semibold text-[#111827] m-0">{statistics.resolved}</p>
                <span className="text-xs text-[#9ca3af]">Closed with feedback</span>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-white shadow-xl p-6 sm:p-8" id="complaints">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold">Quick Actions</p>
                    <h2 className="text-2xl font-semibold text-[#0f172a] m-0">Stay on top of your tasks</h2>
                    <p className="text-sm text-[#6b7280]">
                      One tap access to your most frequent workflows.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#d61f29] text-white px-5 py-3 font-semibold shadow-lg shadow-[#d61f29]/30 hover:-translate-y-0.5 transition"
                      onClick={() => setShowComplaintForm(true)}
                    >
                      <i className="bx bx-plus-circle text-lg"></i>
                      File Complaint
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#d61f29]/30 px-5 py-3 font-semibold text-[#d61f29] hover:bg-[#fff3f4]"
                      onClick={() => setShowHistory(true)}
                    >
                      <i className="bx bx-history text-lg"></i>
                      History
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3 pt-6">
                  <button
                    type="button"
                    className="text-left rounded-2xl border border-[#fde68a] bg-[#fff7e6] px-4 py-5 shadow-sm hover:-translate-y-1 transition"
                    onClick={() => setShowComplaintForm(true)}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[#f59e0b] shadow">
                      <i className="bx bx-edit text-xl"></i>
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-[#b45309]">Log an issue</h3>
                    <p className="text-sm text-[#a16207]">
                      Submit a new complaint with attachments in under a minute.
                    </p>
                  </button>
                  <button
                    type="button"
                    className="text-left rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-5 shadow-sm hover:-translate-y-1 transition"
                    onClick={() => setShowHistory(true)}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#1d4ed8] shadow">
                      <i className="bx bx-line-chart text-xl"></i>
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-[#1d4ed8]">Complaint history</h3>
                    <p className="text-sm text-[#1e40af]">
                      Filter, sort, and export every submission you have made.
                    </p>
                  </button>
                  <button
                    type="button"
                    className="text-left rounded-2xl border border-[#c4b5fd] bg-[#f5f3ff] px-4 py-5 shadow-sm hover:-translate-y-1 transition"
                    onClick={() => setShowProfile(true)}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6d28d9] shadow">
                      <i className="bx bx-user-circle text-xl"></i>
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-[#6d28d9]">Profile center</h3>
                    <p className="text-sm text-[#5b21b6]">
                      Update contact details and manage password securely.
                    </p>
                  </button>
                </div>
              </div>

              {!showComplaintForm && (
                <section className="rounded-3xl bg-white shadow-xl p-6 sm:p-8 space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold m-0">Complaints</p>
                      <h2 className="text-2xl font-semibold text-[#111827] m-0">Your timeline</h2>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6]"
                      onClick={() => setShowComplaintForm(true)}
                    >
                      <i className="bx bx-plus"></i>
                      Add new
                    </button>
                  </div>

                  {complaintsLoading && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                      Fetching your latest complaints...
                    </div>
                  )}

                  {complaintsError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      {complaintsError}
                    </div>
                  )}

                  {pendingComplaints.length > 0 && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-[#b45309]">Active Complaints</h3>
                      {pendingComplaints.map((complaint) => (
                        <div
                          key={complaint._id || complaint.id}
                          className="bg-[#fff7ed] border border-amber-100 border-l-4 border-l-amber-400 rounded-2xl p-6 space-y-4 shadow-sm transition hover:-translate-y-1 cursor-pointer"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold text-[#92400e]">{complaint.title}</h4>
                            <span className={getStatusBadgeClass(complaint.stage)}>{complaint.stage}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-[#7c2d12]">
                            <p className="flex items-center gap-2">
                              <i className="bx bx-category text-[#ea580c]"></i>
                              {complaint.category}
                            </p>
                            <p className="flex items-center gap-2">
                              <i className="bx bx-calendar text-[#ea580c]"></i>
                              {complaint.date}
                            </p>
                            <p className="flex items-center gap-2">
                              <i className="bx bx-building text-[#ea580c]"></i>
                              {complaint.department}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#ffc53a] to-[#f97316]"
                                style={{ width: `${getStagePercentage(complaint)}%` }}
                              ></div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#a16207]">
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
                      <h3 className="text-xl font-semibold text-[#047857]">Resolved Complaints</h3>
                      {resolvedComplaints.map((complaint) => (
                        <div
                          key={complaint._id || complaint.id}
                          className="bg-[#ecfdf5] border border-emerald-100 border-l-4 border-l-emerald-500 rounded-2xl p-6 space-y-4 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4
                              className="text-lg font-semibold text-[#065f46] cursor-pointer"
                              onClick={() => setSelectedComplaint(complaint)}
                            >
                              {complaint.title}
                            </h4>
                            <span className={getStatusBadgeClass(complaint.stage)}>{complaint.stage}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-[#065f46]">
                            <p className="flex items-center gap-2">
                              <i className="bx bx-category text-[#059669]"></i>
                              {complaint.category}
                            </p>
                            <p className="flex items-center gap-2">
                              <i className="bx bx-calendar text-[#059669]"></i>
                              {complaint.date}
                            </p>
                            <p className="flex items-center gap-2">
                              <i className="bx bx-building text-[#059669]"></i>
                              {complaint.department}
                            </p>
                          </div>
                          {complaint.feedback && (
                            <div className="bg-white/80 rounded-xl p-4 text-sm text-[#15803d] space-y-2">
                              <div className="flex items-center gap-2 font-semibold">
                                <span>Your Rating:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`bx ${
                                        star <= complaint.feedback.rating ? 'bxs-star text-[#fbbf24]' : 'bx-star text-emerald-200'
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                              {complaint.feedback.comment && (
                                <p className="italic text-sm text-[#166534]">
                                  “{complaint.feedback.comment}”
                                </p>
                              )}
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-full"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#047857]">
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
                    <div className="bg-[#f8fafc] rounded-2xl border border-dashed border-[#e5e7eb] p-10 text-center text-[#475467] flex flex-col items-center gap-4">
                      <i className="bx bx-inbox text-4xl text-[#94a3b8]"></i>
                      <p>No complaints filed yet. Click “File Complaint” to get started!</p>
                    </div>
                  )}
                </section>
              )}
            </div>

            <div className="space-y-6" id="resources">
              <div className="rounded-3xl bg-white shadow-xl p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold m-0">
                      Campus Broadcast
                    </p>
                    <h3 className="text-xl font-semibold text-[#0f172a]">Live Notices</h3>
                    <p className="text-sm text-[#6b7280]">Stay updated with official announcements.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[#fef3c7] text-[#b45309] px-3 py-1 text-xs font-semibold">
                    Updated
                  </span>
                </div>
                <div className="mt-4">
                  <NoticesSection />
                </div>
              </div>

              <div className="rounded-3xl bg-white shadow-xl p-6 sm:p-8" id="support">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#6b7280] font-semibold m-0">
                      Need help?
                    </p>
                    <h3 className="text-xl font-semibold text-[#0f172a]">Student Knowledge Base</h3>
                    <p className="text-sm text-[#6b7280]">Most-asked questions curated for you.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <FAQSection />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

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
                      key={complaint._id || complaint.id}
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

