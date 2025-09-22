import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import { customerService } from '../../services/customerService'

const CustomerProfile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    ho: '',
    ten: '',
    email: '',
    sdt: '',
    diaChi: '',
    maSoThue: '',
    cccd: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile()
  }, [])



  const fetchProfile = async () => {
    try {
      setLoading(true)

      // Nếu có user từ context, sử dụng CCCD để lấy thông tin chi tiết
      if (user?.cccd || user?.id) {
        const cccd = user.cccd || user.id
        const response = await customerService.getCustomerById(cccd)

        if (response.statusCode === 200 && response.khachHang) {
          const customerData = response.khachHang
          setFormData({
            ho: customerData.ho || '',
            ten: customerData.ten || '',
            email: customerData.email || '',
            sdt: customerData.sdt || '',
            diaChi: customerData.diaChi || '',
            maSoThue: customerData.maSoThue || '',
            cccd: customerData.cccd || ''
          })
        }
      } else {
        // Fallback: sử dụng dữ liệu từ user context
        setFormData({
          ho: user?.ho || '',
          ten: user?.ten || '',
          email: user?.email || '',
          sdt: user?.sdt || user?.soDienThoai || '',
          diaChi: user?.diaChi || '',
          maSoThue: user?.maSoThue || '',
          cccd: user?.cccd || user?.id || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Không thể tải thông tin cá nhân')

      // Fallback: sử dụng dữ liệu từ user context
      setFormData({
        ho: user?.ho || '',
        ten: user?.ten || '',
        email: user?.email || '',
        sdt: user?.sdt || user?.soDienThoai || '',
        diaChi: user?.diaChi || '',
        maSoThue: user?.maSoThue || '',
        cccd: user?.cccd || user?.id || ''
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Chuẩn bị dữ liệu để gửi
      const updateData = {
        ho: formData.ho,
        ten: formData.ten,
        email: formData.email,
        sdt: formData.sdt,
        diaChi: formData.diaChi,
        maSoThue: formData.maSoThue
      }

      console.log('Updating profile with data:', updateData)
      console.log('User CCCD:', formData.cccd)

      // Gọi API để cập nhật thông tin
      const response = await customerService.updateProfile(formData.cccd, updateData)

      if (response.statusCode === 200) {
        toast.success('Cập nhật thông tin thành công!')
        setIsEditing(false)

        // Cập nhật user context với thông tin mới
        const updatedUserInfo = {
          ho: updateData.ho,
          ten: updateData.ten,
          email: updateData.email,
          sdt: updateData.sdt,
          diaChi: updateData.diaChi,
          maSoThue: updateData.maSoThue,
          hoTen: `${updateData.ho} ${updateData.ten}`.trim()
        }

        console.log('Updating user context with:', updatedUserInfo)
        updateUser(updatedUserInfo)

        // Refresh profile data
        await fetchProfile()
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật thông tin')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('Mật khẩu mới không được trùng với mật khẩu cũ')
      return
    }

    try {
      setLoading(true)

      const changePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }

      console.log('Changing password for user:', formData.cccd)

      // Gọi API để đổi mật khẩu
      const response = await customerService.changePassword(formData.cccd, changePasswordData)

      if (response.statusCode === 200) {
        toast.success('Đổi mật khẩu thành công!')
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi đổi mật khẩu')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      if (error.response?.status === 400) {
        toast.error('Mật khẩu hiện tại không đúng')
      } else {
        toast.error('Có lỗi xảy ra khi đổi mật khẩu')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline"
              disabled={loading}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CCCD
                  </label>
                  <input
                    type="text"
                    name="cccd"
                    value={formData.cccd}
                    disabled={true}
                    className="input bg-gray-50"
                    placeholder="Số CCCD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    name="maSoThue"
                    value={formData.maSoThue}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input"
                    placeholder="Mã số thuế (tùy chọn)"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {formData.ho} {formData.ten}
            </h3>
            <p className="text-gray-500">{formData.email}</p>
            <button className="btn-outline mt-4">
              Thay đổi ảnh đại diện
            </button>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            </div>

            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-outline w-full"
              >
                Đổi mật khẩu
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="btn-outline flex-1"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile
