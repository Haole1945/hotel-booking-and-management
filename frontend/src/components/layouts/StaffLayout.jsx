import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardHeader from '../common/DashboardHeader'
import StaffSidebar from '../common/StaffSidebar'

const StaffLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <StaffSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StaffLayout
