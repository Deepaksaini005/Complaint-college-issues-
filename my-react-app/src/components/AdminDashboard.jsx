import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import AdminSidebar from './AdminSidebar'
import './AdminDashboard.css'

// Mock data - in a real app, this would come from an API
const mockComplaintsData = {
  total: 247,
  byDepartment: [
    { name: 'Hostel', count: 89, color: '#CD201F' },
    { name: 'Maintenance', count: 67, color: '#B34D3A' },
    { name: 'Cafeteria', count: 45, color: '#E94B4A' },
    { name: 'Library', count: 28, color: '#10b981' },
    { name: 'Transport', count: 18, color: '#f59e0b' }
  ],
  byStatus: [
    { name: 'Pending', value: 78, color: '#ffc658' },
    { name: 'In-progress', value: 95, color: '#8884d8' },
    { name: 'Resolved', value: 74, color: '#82ca9d' }
  ],
  trends: [
    { month: 'Jan', complaints: 45 },
    { month: 'Feb', complaints: 52 },
    { month: 'Mar', complaints: 48 },
    { month: 'Apr', complaints: 61 },
    { month: 'May', complaints: 55 },
    { month: 'Jun', complaints: 67 }
  ]
}

const AdminDashboard = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [complaintsData, setComplaintsData] = useState(mockComplaintsData)
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  // Calculate percentages
  const statusPercentage = {
    pending: ((complaintsData.byStatus[0].value / complaintsData.total) * 100).toFixed(1),
    inProgress: ((complaintsData.byStatus[1].value / complaintsData.total) * 100).toFixed(1),
    resolved: ((complaintsData.byStatus[2].value / complaintsData.total) * 100).toFixed(1)
  }

  const COLORS = ['#ffc658', '#8884d8', '#82ca9d']

  return (
    <div className="admin-dashboard">
      <AdminSidebar userRole={userRole} />
      
      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>Campus Complaints Analytics</h1>
              <p className="dashboard-subtitle">
                Comprehensive overview of campus complaint management
              </p>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card total">
            <div className="card-icon">
              <i className="bx bx-clipboard"></i>
            </div>
            <div className="card-content">
              <h3>Total Complaints</h3>
              <p className="card-value">{complaintsData.total}</p>
              <span className="card-label">All time</span>
            </div>
          </div>

          <div className="summary-card pending">
            <div className="card-icon">
              <i className="bx bx-time"></i>
            </div>
            <div className="card-content">
              <h3>Pending</h3>
              <p className="card-value">{complaintsData.byStatus[0].value}</p>
              <span className="card-label">{statusPercentage.pending}% of total</span>
            </div>
          </div>

          <div className="summary-card in-progress">
            <div className="card-icon">
              <i className="bx bx-loader-circle"></i>
            </div>
            <div className="card-content">
              <h3>In Progress</h3>
              <p className="card-value">{complaintsData.byStatus[1].value}</p>
              <span className="card-label">{statusPercentage.inProgress}% of total</span>
            </div>
          </div>

          <div className="summary-card resolved">
            <div className="card-icon">
              <i className="bx bx-check-circle"></i>
            </div>
            <div className="card-content">
              <h3>Resolved</h3>
              <p className="card-value">{complaintsData.byStatus[2].value}</p>
              <span className="card-label">{statusPercentage.resolved}% of total</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Department Breakdown - Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2>Complaints by Department</h2>
              <p className="chart-subtitle">Distribution across campus departments</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintsData.byDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <YAxis
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {complaintsData.byDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Breakdown - Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2>Status Breakdown</h2>
              <p className="chart-subtitle">Current complaint status distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintsData.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintsData.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trends Chart */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h2>Complaint Trends</h2>
            <p className="chart-subtitle">Monthly complaint volume over time</p>
            <div className="time-range-selector">
              <button
                className={selectedTimeRange === '3months' ? 'active' : ''}
                onClick={() => setSelectedTimeRange('3months')}
              >
                3 Months
              </button>
              <button
                className={selectedTimeRange === '6months' ? 'active' : ''}
                onClick={() => setSelectedTimeRange('6months')}
              >
                6 Months
              </button>
              <button
                className={selectedTimeRange === '1year' ? 'active' : ''}
                onClick={() => setSelectedTimeRange('1year')}
              >
                1 Year
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complaintsData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#ddd' }}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#ddd' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#CD201F"
                strokeWidth={3}
                dot={{ fill: '#CD201F', r: 5 }}
                activeDot={{ r: 7 }}
                name="Complaints"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Details Table */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h2>Department Breakdown Details</h2>
            <p className="chart-subtitle">Detailed view of complaints by department</p>
          </div>
          <div className="department-table">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Complaints</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {complaintsData.byDepartment.map((dept, index) => {
                  const deptTotal = dept.count
                  const percentage = ((deptTotal / complaintsData.total) * 100).toFixed(1)
                  // Mock distribution for each department
                  const pending = Math.floor(deptTotal * 0.3)
                  const inProgress = Math.floor(deptTotal * 0.4)
                  const resolved = deptTotal - pending - inProgress

                  return (
                    <tr key={index}>
                      <td>
                        <div className="dept-name">
                          <span
                            className="dept-color"
                            style={{ backgroundColor: dept.color }}
                          ></span>
                          {dept.name}
                        </div>
                      </td>
                      <td className="bold">{deptTotal}</td>
                      <td className="status-pending">{pending}</td>
                      <td className="status-in-progress">{inProgress}</td>
                      <td className="status-resolved">{resolved}</td>
                      <td>
                        <div className="percentage-bar">
                          <div
                            className="percentage-fill"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: dept.color
                            }}
                          ></div>
                          <span>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default AdminDashboard

