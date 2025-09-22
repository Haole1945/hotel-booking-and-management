import React, { useState } from 'react'
import RoomChangeHistory from '../../components/staff/RoomChangeHistory'

const RoomChangeManagement = () => {
  const [activeTab, setActiveTab] = useState('current')

  const tabs = [
    { id: 'current', label: 'Đổi phòng hiện tại', icon: '🔄' },
    { id: 'history', label: 'Lịch sử đổi phòng', icon: '📋' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý đổi phòng</h1>
        <p className="text-gray-600">Theo dõi và quản lý các yêu cầu đổi phòng của khách hàng</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'current' && (
            <RoomChangeHistory showAll={false} />
          )}

          {activeTab === 'history' && (
            <RoomChangeHistory showAll={true} />
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomChangeManagement
