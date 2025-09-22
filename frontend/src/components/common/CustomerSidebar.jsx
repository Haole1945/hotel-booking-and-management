import React from 'react'
import { NavLink } from 'react-router-dom'
import { Calendar, User, History } from 'lucide-react'

const CustomerSidebar = () => {
  const menuItems = [
    {
      path: '/customer',
      icon: Calendar,
      label: 'Đặt phòng',
      end: true
    },
    {
      path: '/customer/history',
      icon: History,
      label: 'Lịch sử đặt phòng'
    },
    {
      path: '/customer/profile',
      icon: User,
      label: 'Thông tin cá nhân'
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

export default CustomerSidebar
