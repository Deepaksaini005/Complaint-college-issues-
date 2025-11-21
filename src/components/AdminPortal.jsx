import { useState } from 'react'

const roleConfig = {
  hostel: {
    title: 'Hostel Admin',
    summary:
      'Focus on resident experience, room allocation, and occupancy health.',
    responsibilities: [
      'Approve and monitor room allocations',
      'Track occupancy, waitlists, and transfer requests',
      'Respond to resident escalation tickets within SLA windows'
    ]
  },
  maintenance: {
    title: 'Maintenance Admin',
    summary:
      'Keep facilities functional and compliant through proactive maintenance.',
    responsibilities: [
      'Dispatch technicians for breakdown and preventive jobs',
      'Review vendor quotes and work orders before approval',
      'Maintain audit-ready compliance documentation'
    ]
  },
  super: {
    title: 'Super Admin',
    summary: 'Oversee policy, analytics, and cross-campus governance.',
    responsibilities: [
      'Manage admin accounts and delegated approvals',
      'Audit operational activity and configuration changes',
      'Publish insights across hostels, transport, and facilities'
    ]
  }
}

const securityChecklist = [
  'Use only institution-issued admin accounts.',
  'Never reuse student passwords or share one-time keys.',
  'Rotate the security key every session.',
  'Always sign out from shared kiosks.'
]

const inputClass =
  'w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#1c9af5] focus:ring-2 focus:ring-[#1c9af5]/40 outline-none transition'

const AdminPortal = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    securityKey: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [activeRole, setActiveRole] = useState(null)

  const handleChange = ({ target }) => {
    const { name, value } = target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.email) {
      nextErrors.email = 'Admin email is required'
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      nextErrors.email = 'Enter a valid email'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters'
    }

    if (!formData.securityKey) {
      nextErrors.securityKey = 'Security key is required for admin login'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setStatus({
      state: 'processing',
      message: 'Validating credentials and MFA challenge...'
    })

    setTimeout(() => {
      setStatus({
        state: 'success',
        message: 'Multi-factor challenge passed. Session secured.'
      })
      setActiveRole(formData.role || 'hostel')
    }, 650)
  }

  const selectedRole = activeRole ? roleConfig[activeRole] : null

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 sm:px-6 lg:px-10 py-12 font-['Poppins']">
      <div className="max-w-[1100px] mx-auto grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#1a5d8f]">
              Management Portal
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-1">
              Admin Secure Login
            </h2>
            <p className="text-slate-500 mt-2">
              Restricted zone for Hostel, Maintenance, and Super Admin teams.
              Student credentials are automatically blocked.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Admin email
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@campus.edu"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Role (optional)
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select role for scoped access</option>
                <option value="hostel">Hostel Admin</option>
                <option value="maintenance">Maintenance Admin</option>
                <option value="super">Super Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                One-time security key
              </label>
              <input
                type="password"
                name="securityKey"
                placeholder="Enter rotating access key"
                value={formData.securityKey}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.securityKey && (
                <p className="text-sm text-red-600">{errors.securityKey}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#1c9af5] to-[#0e5bc5] text-white font-semibold py-3 shadow-lg shadow-[#0e5bc5]/30 hover:-translate-y-0.5 transition"
            >
              {status.state === 'processing' ? 'Authorizing…' : 'Secure Login'}
            </button>

            {status.state !== 'idle' && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  status.state === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-sky-50 text-sky-700 border border-sky-100'
                }`}
              >
                {status.message}
              </div>
            )}
          </form>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#1a5d8f]">
              Security Checklist
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              {securityChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          {selectedRole ? (
            <div className="space-y-5">
              <div>
                <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#1a5d8f]">
                  {selectedRole.title}
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-2">
                  {selectedRole.summary}
                </h3>
              </div>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 text-sm">
                {selectedRole.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
                Tip: Pick the role before logging in to auto-load the relevant
                dashboards right after authentication.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-slate-600">
              <h3 className="text-xl font-semibold text-slate-900">
                Preview responsibilities by selecting a role
              </h3>
              <p>
                Role selection is optional. Skipping it loads the default Hostel
                Admin view, and you can switch after signing in. Use the dropdown
                to preview what each role manages.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminPortal

