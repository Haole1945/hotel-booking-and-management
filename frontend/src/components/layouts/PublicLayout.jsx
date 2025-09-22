import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicHeader from '../common/PublicHeader'
import Footer from '../common/Footer'

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
