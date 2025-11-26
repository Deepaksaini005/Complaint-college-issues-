export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      error: err.toString()
    }),
    errors: err.data
  })
}
