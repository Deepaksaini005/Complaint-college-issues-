import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'boxicons/css/boxicons.min.css'
import './index.css'
import App from './App.jsx'

// Google Client ID - Replace with your actual Google OAuth Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
const rawGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
const ENABLE_GOOGLE_LOGIN = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true'
const isClientConfigured = Boolean(
  rawGoogleClientId &&
  rawGoogleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
  rawGoogleClientId !== 'dummy-client-id-for-development'
)

if (ENABLE_GOOGLE_LOGIN && !isClientConfigured && import.meta.env.DEV) {
  console.warn('⚠️ Google login is enabled but VITE_GOOGLE_CLIENT_ID is missing.')
  console.warn('Set VITE_GOOGLE_CLIENT_ID in your .env to turn on Google OAuth.')
}

// Always wrap with GoogleOAuthProvider to avoid hook errors.
// When Google login is disabled or not configured we pass a harmless dummy ID.
const clientId = isClientConfigured 
  ? rawGoogleClientId 
  : 'dummy-client-id-for-development'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
