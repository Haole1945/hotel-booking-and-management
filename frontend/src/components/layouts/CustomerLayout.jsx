import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardHeader from '../common/DashboardHeader'
import CustomerSidebar from '../common/CustomerSidebar'

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout
