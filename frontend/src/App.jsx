import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'


// Public pages
import HomePage from './pages/public/HomePage'
import RoomListPage from './pages/public/RoomListPage'
import RoomDetailPage from './pages/public/RoomDetailPage'
import PublicBookingPage from './pages/public/PublicBookingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Common pages
import ProfilePage from './pages/common/ProfilePage'

// Customer pages
import BookingPage from './pages/customer/BookingPage'
import BookingHistory from './pages/customer/BookingHistory'
import CustomerProfile from './pages/customer/CustomerProfile'

// Staff pages (Lễ tân)
import StaffDashboard from './pages/staff/StaffDashboard'
import ReservationManagement from './pages/staff/ReservationManagement'
import CheckInPage from './pages/staff/CheckInPage'
import RentalManagement from './pages/staff/RentalManagement'

import CheckOutPage from './pages/staff/CheckOutPage'
import InvoicePage from './pages/staff/InvoicePage'
import WalkInCheckIn from './pages/staff/WalkInCheckIn'
import StaffRoomManagement from './pages/staff/RoomManagement'
import StaffServiceManagement from './pages/staff/ServiceManagement'
import RoomChangeManagement from './pages/staff/RoomChangeManagement'

// Admin pages (Quản lý)
import AdminDashboard from './pages/admin/AdminDashboard'
import RoomManagement from './pages/admin/RoomManagement'
import StaffManagement from './pages/admin/StaffManagement'
import ServiceManagement from './pages/admin/ServiceManagement'
import AmenitiesManagement from './pages/admin/AmenitiesManagement'
import RoomPriceManagement from './pages/admin/RoomPriceManagement'
import SurchargeManagement from './pages/admin/SurchargeManagement'
import ReportsPage from './pages/admin/ReportsPage'
import RevenueReport from './pages/admin/RevenueReport'

// Layout components
import PublicLayout from './components/layouts/PublicLayout'
import CustomerLayout from './components/layouts/CustomerLayout'
import StaffLayout from './components/layouts/StaffLayout'
import AdminLayout from './components/layouts/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomListPage />} />
            <Route path="rooms/:id" element={<RoomDetailPage />} />
            <Route path="booking" element={<PublicBookingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<BookingPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Staff Routes (Lễ tân) */}
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StaffDashboard />} />
            <Route path="reservations" element={<ReservationManagement />} />
            <Route path="checkin" element={<CheckInPage />} />
            <Route path="rentals" element={<RentalManagement />} />

            <Route path="checkout" element={<CheckOutPage />} />
            <Route path="invoices" element={<InvoicePage />} />
            <Route path="walkin" element={<WalkInCheckIn />} />
            <Route path="rooms" element={<StaffRoomManagement />} />
            <Route path="room-changes" element={<RoomChangeManagement />} />
            <Route path="services" element={<StaffServiceManagement />} />
          </Route>

          {/* Admin Routes (Quản lý) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="amenities" element={<AmenitiesManagement />} />
            <Route path="room-prices" element={<RoomPriceManagement />} />
            <Route path="surcharges" element={<SurchargeManagement />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="revenue-report" element={<RevenueReport />} />
          </Route>

          {/* Profile Route - Available for all authenticated users */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'EMPLOYEE', 'ADMIN']}>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Trang không tồn tại</p>
              </div>
            </div>
          } />
        </Routes>
      </div>

      {/* Global Components */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
