import Complaint from "../models/Complaint.js"
import User from "../models/User.js"

export const createComplaint = async (req, res, next) => {
  try {
    const { images, ...rest } = req.body
    const complaint = await Complaint.create({
      ...rest,
      attachments: images || [],
      student: req.user.id || req.user._id,
      timeline: [
        {
          stage: 'Registered',
          note: 'Complaint submitted',
          department: 'System',
          updatedBy: req.user.id || req.user._id
        }
      ]
    })
    res.status(201).json(complaint)
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

export const getMyComplaints = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id
    const complaints = await Complaint.find({ student: userId }).sort('-createdAt')
    // Map attachments to images for frontend compatibility
    const mappedComplaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject()
      complaintObj.images = complaintObj.attachments || []
      return complaintObj
    })
    res.json(mappedComplaints)
  } catch (error) {
    next(error)
  }
}

export const getAllComplaints = async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {}
    const complaints = await Complaint.find(filter).populate('student', 'name email').sort('-createdAt')
    // Map attachments to images for frontend compatibility
    const mappedComplaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject()
      complaintObj.images = complaintObj.attachments || []
      return complaintObj
    })
    res.json(mappedComplaints)
  } catch (error) {
    next(error)
  }
}

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, note, assignedDepartment } = req.body
    const complaint = await Complaint.findById(id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    if (status) {
      complaint.status = status
      complaint.stage = status
    }
    if (assignedDepartment) {
      complaint.assignedDepartment = assignedDepartment
    }
    complaint.timeline.push({
      stage: complaint.status,
      note: note || 'Status updated',
      department: assignedDepartment || complaint.assignedDepartment,
      updatedBy: req.user.id || req.user._id
    })
    await complaint.save()
    const complaintObj = complaint.toObject()
    complaintObj.images = complaintObj.attachments || []
    res.json(complaintObj)
  } catch (error) {
    next(error)
  }
}

export const addFeedback = async (req, res, next) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id || req.user._id
    const complaint = await Complaint.findOne({ _id: id, student: userId })
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    complaint.feedback = { rating, comment, submittedBy: userId }
    await complaint.save()
    const complaintObj = complaint.toObject()
    complaintObj.images = complaintObj.attachments || []
    res.json(complaintObj)
  } catch (error) {
    next(error)
  }
}

export const getDashboardStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments()
    const active = await Complaint.countDocuments({ status: { $in: ['Registered', 'In Progress'] } })
    const resolved = await Complaint.countDocuments({ status: { $in: ['Resolved', 'Closed'] } })
    const departments = await Complaint.aggregate([
      { $group: { _id: '$assignedDepartment', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    res.json({ total, active, resolved, departments })
  } catch (error) {
    next(error)
  }
}

export const getDepartmentStatus = async (req, res, next) => {
  try {
    // Define all departments that should always be shown
    const allDepartments = ['Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']
    
    // Get stats for departments that have complaints (including null/undefined)
    const departmentStats = await Complaint.aggregate([
      {
        $group: {
          _id: { 
            $ifNull: ['$assignedDepartment', 'Pending Assignment']
          },
          total: { $sum: 1 },
          registered: {
            $sum: { $cond: [{ $eq: ['$status', 'Registered'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] }
          }
        }
      }
    ])
    
    // Create a map of existing stats
    const statsMap = {}
    departmentStats.forEach(dept => {
      const deptName = dept._id || 'Pending Assignment'
      statsMap[deptName] = {
        _id: deptName,
        total: dept.total || 0,
        registered: dept.registered || 0,
        inProgress: dept.inProgress || 0,
        resolved: dept.resolved || 0
      }
    })
    
    // Ensure all departments are included, even with 0 complaints
    const completeStats = allDepartments.map(deptName => {
      if (statsMap[deptName]) {
        return statsMap[deptName]
      }
      return {
        _id: deptName,
        total: 0,
        registered: 0,
        inProgress: 0,
        resolved: 0
      }
    })
    
    // Also include "Pending Assignment" if there are any unassigned complaints
    if (statsMap['Pending Assignment']) {
      completeStats.push(statsMap['Pending Assignment'])
    }
    
    // Sort: All main departments first (in order), then Pending Assignment at the end
    const sortedStats = []
    allDepartments.forEach(deptName => {
      const dept = completeStats.find(d => d._id === deptName)
      if (dept) sortedStats.push(dept)
    })
    
    // Add Pending Assignment at the end if it exists
    const pendingDept = completeStats.find(d => d._id === 'Pending Assignment')
    if (pendingDept) {
      sortedStats.push(pendingDept)
    }
    
    res.json(sortedStats)
  } catch (error) {
    next(error)
  }
}
