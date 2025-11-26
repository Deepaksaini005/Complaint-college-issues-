import User from "../models/User.js"
import { generateToken } from "../utils/token.js"

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', registrationNumber, phone, department } = req.body
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required' 
      })
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Create user
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      role,
      registrationNumber: registrationNumber?.trim(),
      phone: phone?.trim(),
      department: department?.trim() || 'General'
    })
    
    const token = generateToken(user)
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationNumber: user.registrationNumber,
        phone: user.phone,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => ({ msg: e.message }))
      })
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    // Send more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Registration failed. Please try again.' 
      : error.message || 'Registration failed'
    res.status(500).json({ 
      message: errorMessage,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    })
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        registrationNumber: user.registrationNumber,
        phone: user.phone
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body
    delete updates.password
    delete updates.role // Prevent role changes via profile update
    
    const user = await User.findByIdAndUpdate(
      req.user.id || req.user._id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => ({ msg: e.message }))
      })
    }
    next(error)
  }
}

// Admin management functions
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ 
      role: { $in: ['admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport'] } 
    }).select('-password').sort('-createdAt')
    
    // Map roles to display names
    const roleMap = {
      'admin': 'Super Admin',
      'hostel': 'Hostel Admin',
      'maintenance': 'Maintenance Admin',
      'cafeteria': 'Cafeteria Admin',
      'library': 'Library Admin',
      'transport': 'Transport Admin'
    }
    
    const mappedAdmins = admins.map(admin => ({
      ...admin.toObject(),
      displayRole: roleMap[admin.role] || admin.role
    }))
    
    res.json(mappedAdmins)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt')
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body
    
    // Map display role to backend role
    const roleMap = {
      'Hostel Admin': 'hostel',
      'Maintenance Admin': 'maintenance',
      'Cafeteria Admin': 'cafeteria',
      'Library Admin': 'library',
      'Transport Admin': 'transport'
    }
    
    const backendRole = roleMap[role] || role
    
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: backendRole,
      department: department || role.replace(' Admin', '')
    })
    
    res.status(201).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      department: admin.department,
      createdAt: admin.createdAt
    })
  } catch (error) {
    console.error('Create admin error:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => ({ msg: e.message }))
      })
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    next(error)
  }
}

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    
    // Prevent deleting yourself
    if (id === req.user.id || id === req.user._id?.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }
    
    const admin = await User.findByIdAndDelete(id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    
    res.json({ message: 'Admin deleted successfully' })
  } catch (error) {
    next(error)
  }
}
