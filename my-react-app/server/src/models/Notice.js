import mongoose from "mongoose"

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    targetAudience: { type: String, default: 'All Students' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    expiresAt: Date
  },
  { timestamps: true }
)

const Notice = mongoose.model('Notice', noticeSchema)
export default Notice
