import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://vishu:NdO3hK4ShLCi4YKD@cluster0.4iukcq5.mongodb.net/campuscare'
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'campuscare'
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('❌ Mongo connection error:', error.message)
    throw error
  }
}

export default connectDB
