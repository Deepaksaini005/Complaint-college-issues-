const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const STUDENT_TOKEN_KEY = 'campuscare_token'
const ADMIN_TOKEN_KEY = 'campuscare_admin_token'

const request = async (endpoint, { method = 'GET', data, token, headers, tokenKey = STUDENT_TOKEN_KEY } = {}) => {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {})
  }
  const authToken = token || (tokenKey ? localStorage.getItem(tokenKey) : null)
  if (authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: data ? JSON.stringify(data) : undefined
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const error = new Error(errorBody.message || 'Request failed')
    error.data = errorBody
    throw error
  }

  return response.json().catch(() => ({}))
}

export const authAPI = {
  register: (payload) => request('/auth/register', { method: 'POST', data: payload, tokenKey: null }),
  login: (payload) => request('/auth/login', { method: 'POST', data: payload, tokenKey: null }),
  getProfile: (tokenKey = STUDENT_TOKEN_KEY) => request('/auth/me', { tokenKey }),
  updateProfile: (payload, tokenKey = STUDENT_TOKEN_KEY) => request('/auth/me', { method: 'PUT', data: payload, tokenKey })
}

export const complaintAPI = {
  create: (payload) => request('/complaints', { method: 'POST', data: payload, tokenKey: STUDENT_TOKEN_KEY }),
  mine: () => request('/complaints/mine', { tokenKey: STUDENT_TOKEN_KEY }),
  addFeedback: (id, payload) => request(`/complaints/${id}/feedback`, { method: 'POST', data: payload, tokenKey: STUDENT_TOKEN_KEY }),
  adminList: () => request('/complaints', { tokenKey: ADMIN_TOKEN_KEY }),
  adminUpdate: (id, payload) => request(`/complaints/${id}`, { method: 'PATCH', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  stats: () => request('/complaints/stats/overview', { tokenKey: ADMIN_TOKEN_KEY })
}

export const contentAPI = {
  notices: () => request('/content/notices'),
  faqs: (category = 'All') => request(`/content/faqs?category=${encodeURIComponent(category)}`),
  getAllNotices: () => request('/content/notices/all', { tokenKey: ADMIN_TOKEN_KEY }),
  getAllFAQs: () => request('/content/faqs/all', { tokenKey: ADMIN_TOKEN_KEY }),
  createNotice: (payload) => request('/content/notices', { method: 'POST', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  updateNotice: (id, payload) => request(`/content/notices/${id}`, { method: 'PUT', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  deleteNotice: (id) => request(`/content/notices/${id}`, { method: 'DELETE', tokenKey: ADMIN_TOKEN_KEY }),
  createFAQ: (payload) => request('/content/faqs', { method: 'POST', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  updateFAQ: (id, payload) => request(`/content/faqs/${id}`, { method: 'PUT', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  deleteFAQ: (id) => request(`/content/faqs/${id}`, { method: 'DELETE', tokenKey: ADMIN_TOKEN_KEY })
}

export const adminAPI = {
  getAllAdmins: () => request('/auth/admins', { tokenKey: ADMIN_TOKEN_KEY }),
  getAllUsers: () => request('/auth/users', { tokenKey: ADMIN_TOKEN_KEY }),
  createAdmin: (payload) => request('/auth/admins', { method: 'POST', data: payload, tokenKey: ADMIN_TOKEN_KEY }),
  deleteAdmin: (id) => request(`/auth/admins/${id}`, { method: 'DELETE', tokenKey: ADMIN_TOKEN_KEY }),
  getDepartmentStatus: () => request('/complaints/stats/department', { tokenKey: ADMIN_TOKEN_KEY })
}

export default request
