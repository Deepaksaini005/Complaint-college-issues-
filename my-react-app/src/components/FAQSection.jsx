import { useState } from 'react'
import './FAQSection.css'

// This will be shared state or context in real app
const mockFAQs = [
  {
    id: 1,
    question: 'How do I submit a complaint?',
    answer: 'You can submit a complaint by logging into the student portal and clicking on "Submit Complaint". Fill in the required details and submit.',
    category: 'General',
    order: 1
  },
  {
    id: 2,
    question: 'How long does it take to resolve a complaint?',
    answer: 'The resolution time depends on the priority and nature of the complaint. High priority complaints are usually resolved within 24-48 hours, while others may take 3-5 business days.',
    category: 'General',
    order: 2
  },
  {
    id: 3,
    question: 'Can I track the status of my complaint?',
    answer: 'Yes, you can track the status of your complaint in the "My Complaints" section of your student dashboard. You will see real-time updates on the status.',
    category: 'General',
    order: 3
  },
  {
    id: 4,
    question: 'What should I do if my room AC is not working?',
    answer: 'Submit a complaint under the Hostel category with High priority. Include photos if possible. The maintenance team will be assigned to fix it.',
    category: 'Hostel',
    order: 1
  }
]

const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'General', 'Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']
  const activeFAQs = mockFAQs.filter(faq => faq.status !== 'Inactive')
  const filteredFAQs = selectedCategory === 'All' 
    ? activeFAQs 
    : activeFAQs.filter(faq => faq.category === selectedCategory)

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our services</p>
      </div>

      <div className="faq-categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="faqs-list">
        {filteredFAQs.length === 0 ? (
          <div className="no-faqs">
            <i className="bx bx-info-circle"></i>
            <p>No FAQs available in this category</p>
          </div>
        ) : (
          filteredFAQs.map(faq => (
            <div key={faq.id} className="faq-item">
              <button
                className="faq-question-btn"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="faq-icon">
                  <i className={`bx ${expandedFAQ === faq.id ? 'bx-chevron-down' : 'bx-chevron-right'}`}></i>
                </span>
                <span className="faq-text">{faq.question}</span>
                <span className="faq-category-tag">{faq.category}</span>
              </button>
              {expandedFAQ === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FAQSection

