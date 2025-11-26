import { Router } from "express"
import { 
  getActiveNotices, 
  getAllNotices,
  getFAQs, 
  getAllFAQs,
  createNotice, 
  createFAQ,
  updateNotice,
  deleteNotice,
  updateFAQ,
  deleteFAQ
} from "../controllers/contentController.js"
import { protect, authorizeRoles } from "../middleware/auth.js"

const router = Router()

// Public routes
router.get('/notices', getActiveNotices)
router.get('/faqs', getFAQs)

// Admin routes for notices
router.get('/notices/all', protect, authorizeRoles('admin'), getAllNotices)
router.post('/notices', protect, authorizeRoles('admin'), createNotice)
router.put('/notices/:id', protect, authorizeRoles('admin'), updateNotice)
router.delete('/notices/:id', protect, authorizeRoles('admin'), deleteNotice)

// Admin routes for FAQs
router.get('/faqs/all', protect, authorizeRoles('admin'), getAllFAQs)
router.post('/faqs', protect, authorizeRoles('admin'), createFAQ)
router.put('/faqs/:id', protect, authorizeRoles('admin'), updateFAQ)
router.delete('/faqs/:id', protect, authorizeRoles('admin'), deleteFAQ)

export default router
