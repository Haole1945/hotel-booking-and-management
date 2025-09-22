import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Calendar, UserCheck, UserX, Users, UserPlus, Building, Settings, CreditCard, FileText, RefreshCw } from 'lucide-react'

const StaffSidebar = () => {
  const menuItems = [
    {
      path: '/staff',
      icon: Home,
      label: 'Dashboard',
      end: true
    },
    {
      path: '/staff/reservations',
      icon: Calendar,
      label: 'Quản lý đặt phòng'
    },
    {
      path: '/staff/rentals',
      icon: Users,
      label: 'Quản lý thuê phòng'
    },

    {
      path: '/staff/checkin',
      icon: UserCheck,
      label: 'Check-in'
    },
    {
      path: '/staff/checkout',
      icon: UserX,
      label: 'Check-out'
    },
    {
      path: '/staff/invoices',
      icon: FileText,
      label: 'Quản lý hóa đơn'
    },
    {
      path: '/staff/walkin',
      icon: UserPlus,
      label: 'Walk-in Check-in'
    },
    {
      path: '/staff/rooms',
      icon: Building,
      label: 'Quản lý phòng'
    },
    {
      path: '/staff/room-changes',
      icon: RefreshCw,
      label: 'Quản lý đổi phòng'
    },
    {
      path: '/staff/services',
      icon: Settings,
      label: 'Dịch vụ & Phụ thu'
    }
  ]

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default StaffSidebar
