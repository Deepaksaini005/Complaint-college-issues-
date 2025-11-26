import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now }
  },
  { _id: false }
)

const timelineSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    note: String,
    department: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
)

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Registered', 'In Progress', 'Resolved', 'Closed'],
      default: 'Registered'
    },
    stage: { type: String, default: 'Registered' },
    attachments: [{ type: String }],
    assignedDepartment: { type: String, default: 'Pending Assignment' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: feedbackSchema,
    timeline: [timelineSchema]
  },
  { timestamps: true }
)

const Complaint = mongoose.model('Complaint', complaintSchema)
export default Complaint
