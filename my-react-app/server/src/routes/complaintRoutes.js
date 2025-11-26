import { Router } from "express"
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  addFeedback,
  getDashboardStats,
  getDepartmentStatus
} from "../controllers/complaintController.js"
import { protect, authorizeRoles } from "../middleware/auth.js"

const router = Router()

router.post('/', protect, createComplaint)
router.get('/mine', protect, getMyComplaints)
router.post('/:id/feedback', protect, addFeedback)

router.get('/', protect, authorizeRoles('admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport'), getAllComplaints)
router.patch('/:id', protect, authorizeRoles('admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport'), updateComplaintStatus)
router.get('/stats/overview', protect, authorizeRoles('admin'), getDashboardStats)
router.get('/stats/department', protect, authorizeRoles('admin'), getDepartmentStatus)

export default router
