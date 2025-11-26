import { Router } from "express"
import { body, validationResult } from "express-validator"
import { 
  loginUser, 
  registerUser, 
  getProfile, 
  updateProfile,
  getAllAdmins,
  getAllUsers,
  createAdmin,
  deleteAdmin
} from "../controllers/authController.js"
import { protect, authorizeRoles } from "../middleware/auth.js"

const router = Router()

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  registerUser
)

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  loginUser
)

router.get('/me', protect, getProfile)
router.put('/me', protect, updateProfile)

// Admin routes
router.get('/admins', protect, authorizeRoles('admin'), getAllAdmins)
router.get('/users', protect, authorizeRoles('admin'), getAllUsers)
router.post('/admins', protect, authorizeRoles('admin'), createAdmin)
router.delete('/admins/:id', protect, authorizeRoles('admin'), deleteAdmin)

export default router
