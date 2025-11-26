import { useEffect, useMemo, useState } from 'react'
import './FAQSection.css'
import { contentAPI } from '../services/apiClient'

const defaultCategories = ['All', 'General', 'Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']

const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true)
        const data = await contentAPI.faqs(selectedCategory)
        setFaqs(data)
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFaqs()
  }, [selectedCategory])

  const categories = useMemo(() => {
    const dynamic = new Set(defaultCategories)
    faqs.forEach((faq) => dynamic.add(faq.category))
    return Array.from(dynamic)
  }, [faqs])

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
        {loading ? (
          <div className="no-faqs">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Loading FAQs...</p>
          </div>
        ) : error ? (
          <div className="no-faqs">
            <i className="bx bx-error-circle"></i>
            <p>{error}</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="no-faqs">
            <i className="bx bx-info-circle"></i>
            <p>No FAQs available in this category</p>
          </div>
        ) : (
          faqs.map(faq => (
            <div key={faq._id || faq.id} className="faq-item">
              <button
                className="faq-question-btn"
                onClick={() => toggleFAQ(faq._id || faq.id)}
              >
                <span className="faq-icon">
                  <i className={`bx ${expandedFAQ === (faq._id || faq.id) ? 'bx-chevron-down' : 'bx-chevron-right'}`}></i>
                </span>
                <span className="faq-text">{faq.question}</span>
                <span className="faq-category-tag">{faq.category}</span>
              </button>
              {expandedFAQ === (faq._id || faq.id) && (
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

