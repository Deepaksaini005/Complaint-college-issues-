import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import complaintRoutes from "./routes/complaintRoutes.js"
import contentRoutes from "./routes/contentRoutes.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js"

dotenv.config()

const app = express()
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(helmet())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/content', contentRoutes)

app.use(notFound)
app.use(errorHandler)

// Connect to database and start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
