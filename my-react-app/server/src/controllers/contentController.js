import Notice from "../models/Notice.js"
import FAQ from "../models/FAQ.js"

export const getActiveNotices = async (req, res, next) => {
  try {
    const now = new Date()
    const notices = await Notice.find({
      status: 'Active',
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }]
    }).sort('-createdAt')
    res.json(notices)
  } catch (error) {
    next(error)
  }
}

export const getFAQs = async (req, res, next) => {
  try {
    const filters = { status: 'Active' }
    if (req.query.category && req.query.category !== 'All') {
      filters.category = req.query.category
    }
    const faqs = await FAQ.find(filters).sort('order')
    res.json(faqs)
  } catch (error) {
    next(error)
  }
}

export const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create(req.body)
    res.status(201).json(notice)
  } catch (error) {
    next(error)
  }
}

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body)
    res.status(201).json(faq)
  } catch (error) {
    next(error)
  }
}

export const getAllNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort('-createdAt')
    res.json(notices)
  } catch (error) {
    next(error)
  }
}

export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params
    const notice = await Notice.findByIdAndUpdate(id, req.body, { new: true })
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' })
    }
    res.json(notice)
  } catch (error) {
    next(error)
  }
}

export const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params
    const notice = await Notice.findByIdAndDelete(id)
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' })
    }
    res.json({ message: 'Notice deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort('order')
    res.json(faqs)
  } catch (error) {
    next(error)
  }
}

export const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params
    const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true })
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' })
    }
    res.json(faq)
  } catch (error) {
    next(error)
  }
}

export const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params
    const faq = await FAQ.findByIdAndDelete(id)
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' })
    }
    res.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    next(error)
  }
}
