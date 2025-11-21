import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './FAQManagement.css'

const FAQManagement = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'How do I submit a complaint?',
      answer: 'You can submit a complaint by logging into the student portal and clicking on "Submit Complaint". Fill in the required details and submit.',
      category: 'General',
      status: 'Active',
      order: 1
    },
    {
      id: 2,
      question: 'How long does it take to resolve a complaint?',
      answer: 'The resolution time depends on the priority and nature of the complaint. High priority complaints are usually resolved within 24-48 hours, while others may take 3-5 business days.',
      category: 'General',
      status: 'Active',
      order: 2
    },
    {
      id: 3,
      question: 'Can I track the status of my complaint?',
      answer: 'Yes, you can track the status of your complaint in the "My Complaints" section of your student dashboard. You will see real-time updates on the status.',
      category: 'General',
      status: 'Active',
      order: 3
    },
    {
      id: 4,
      question: 'What should I do if my room AC is not working?',
      answer: 'Submit a complaint under the Hostel category with High priority. Include photos if possible. The maintenance team will be assigned to fix it.',
      category: 'Hostel',
      status: 'Active',
      order: 1
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: faqs.length + 1
  })
  const [errors, setErrors] = useState({})

  const categories = ['General', 'Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required'
    } else if (formData.answer.trim().length < 10) {
      newErrors.answer = 'Answer must be at least 10 characters'
    }

    return newErrors
  }

  const handleCreateFAQ = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (editingFAQ) {
      // Update existing FAQ
      setFaqs(prev =>
        prev.map(faq =>
          faq.id === editingFAQ.id
            ? { ...faq, ...formData }
            : faq
        )
      )
      setEditingFAQ(null)
    } else {
      // Create new FAQ
      const newFAQ = {
        id: faqs.length + 1,
        ...formData,
        status: 'Active'
      }
      setFaqs(prev => [...prev, newFAQ])
    }

    setShowCreateModal(false)
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length + 1
    })
    setErrors({})
    alert(editingFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!')
  }

  const handleEdit = (faq) => {
    setEditingFAQ(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    })
    setShowCreateModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setFaqs(prev =>
      prev.map(faq =>
        faq.id === id
          ? { ...faq, status: faq.status === 'Active' ? 'Inactive' : 'Active' }
          : faq
      )
    )
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  return (
    <div className="faq-management-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="faq-wrapper">
        <header className="faq-header">
          <div className="header-content">
            <div>
              <h1>FAQ Management</h1>
              <p className="header-subtitle">
                Create and manage frequently asked questions for students
              </p>
            </div>
            <div className="header-actions">
              <button
                className="create-faq-btn"
                onClick={() => {
                  setEditingFAQ(null)
                  setFormData({
                    question: '',
                    answer: '',
                    category: 'General',
                    order: faqs.length + 1
                  })
                  setShowCreateModal(true)
                }}
              >
                <i className="bx bx-plus"></i>
                Create FAQ
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="faq-content">
          <div className="faqs-container">
            <div className="table-header">
              <h2>All FAQs ({faqs.length})</h2>
            </div>

            <div className="faqs-list">
              {faqs.length === 0 ? (
                <div className="no-data">
                  No FAQs found. Create your first FAQ.
                </div>
              ) : (
                faqs.map(faq => (
                  <div key={faq.id} className="faq-card">
                    <div className="faq-card-header">
                      <div>
                        <span className="faq-order">#{faq.order}</span>
                        <span className="category-badge">{faq.category}</span>
                        <span className={`status-badge ${faq.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {faq.status}
                        </span>
                      </div>
                      <div className="faq-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(faq)}
                          title="Edit FAQ"
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          className="toggle-status-btn"
                          onClick={() => handleToggleStatus(faq.id)}
                          title={faq.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`bx ${faq.status === 'Active' ? 'bx-pause' : 'bx-play'}`}></i>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(faq.id)}
                          title="Delete FAQ"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="faq-question">
                      <i className="bx bx-help-circle"></i>
                      <h3>{faq.question}</h3>
                    </div>

                    <div className="faq-answer">
                      <i className="bx bx-info-circle"></i>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit FAQ Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCreateModal(false)
          setEditingFAQ(null)
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}</h2>
              <button className="close-btn" onClick={() => {
                setShowCreateModal(false)
                setEditingFAQ(null)
              }}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form className="create-faq-form" onSubmit={handleCreateFAQ}>
              <div className="form-group">
                <label>Question *</label>
                <input
                  type="text"
                  name="question"
                  placeholder="Enter the question"
                  value={formData.question}
                  onChange={handleInputChange}
                />
                {errors.question && <span className="error-message">{errors.question}</span>}
              </div>

              <div className="form-group">
                <label>Answer *</label>
                <textarea
                  name="answer"
                  placeholder="Enter the answer..."
                  value={formData.answer}
                  onChange={handleInputChange}
                  rows="6"
                />
                {errors.answer && <span className="error-message">{errors.answer}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowCreateModal(false)
                  setEditingFAQ(null)
                }}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FAQManagement

