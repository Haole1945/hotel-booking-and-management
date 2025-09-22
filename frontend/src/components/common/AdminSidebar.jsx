import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Building, Users, Settings, BarChart3, Coffee, Star, DollarSign, Plus, Database, TrendingUp } from 'lucide-react'

const AdminSidebar = () => {
  const menuItems = [
    {
      path: '/admin',
      icon: Home,
      label: 'Dashboard',
      end: true
    },
    {
      path: '/admin/rooms',
      icon: Building,
      label: 'Quản lý phòng'
    },
    {
      path: '/admin/staff',
      icon: Users,
      label: 'Quản lý nhân viên'
    },
    {
      path: '/admin/services',
      icon: Coffee,
      label: 'Quản lý dịch vụ'
    },
    {
      path: '/admin/amenities',
      icon: Star,
      label: 'Quản lý tiện nghi'
    },
    {
      path: '/admin/room-prices',
      icon: DollarSign,
      label: 'Quản lý giá phòng'
    },
    {
      path: '/admin/surcharges',
      icon: Plus,
      label: 'Quản lý phụ thu'
    },
    {
      path: '/admin/reports',
      icon: BarChart3,
      label: 'Báo cáo & Thống kê'
    },
    {
      path: '/admin/revenue-report',
      icon: TrendingUp,
      label: 'Báo cáo doanh thu'
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

export default AdminSidebar
