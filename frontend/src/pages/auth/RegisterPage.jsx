import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Phone, MapPin } from 'lucide-react'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cccd: '',
    ho: '',
    ten: '',
    sdt: '',
    email: '',
    diaChi: '',
    maSoThue: '',
    matKhau: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.cccd.trim()) newErrors.cccd = 'CCCD/CMND là bắt buộc'
    if (!formData.ho.trim()) newErrors.ho = 'Họ là bắt buộc'
    if (!formData.ten.trim()) newErrors.ten = 'Tên là bắt buộc'
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc'
    if (!formData.sdt.trim()) newErrors.sdt = 'Số điện thoại là bắt buộc'
    if (!formData.matKhau) newErrors.matKhau = 'Mật khẩu là bắt buộc'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'

    // CCCD validation
    const cccdRegex = /^[0-9]{9,12}$/
    if (formData.cccd && !cccdRegex.test(formData.cccd)) {
      newErrors.cccd = 'CCCD/CMND phải có 9-12 chữ số'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/
    if (formData.sdt && !phoneRegex.test(formData.sdt)) {
      newErrors.sdt = 'Số điện thoại phải có 10-11 chữ số'
    }

    // Password validation
    if (formData.matKhau && formData.matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    // Confirm password validation
    if (formData.matKhau !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...registerData } = formData

      const response = await authService.register(registerData)

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* CCCD Field */}
            <div>
              <label htmlFor="cccd" className="block text-sm font-medium text-gray-700">
                CCCD/CMND *
              </label>
              <div className="mt-1 relative">
                <input
                  id="cccd"
                  name="cccd"
                  type="text"
                  value={formData.cccd}
                  onChange={handleChange}
                  className={`input ${errors.cccd ? 'border-red-500' : ''}`}
                  placeholder="Nhập số CCCD/CMND"
                />
                <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.cccd && <p className="mt-1 text-sm text-red-600">{errors.cccd}</p>}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ho" className="block text-sm font-medium text-gray-700">
                  Họ *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="ho"
                    name="ho"
                    type="text"
                    value={formData.ho}
                    onChange={handleChange}
                    className={`input ${errors.ho ? 'border-red-500' : ''}`}
                    placeholder="Nhập họ"
                  />
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.ho && <p className="mt-1 text-sm text-red-600">{errors.ho}</p>}
              </div>

              <div>
                <label htmlFor="ten" className="block text-sm font-medium text-gray-700">
                  Tên *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="ten"
                    name="ten"
                    type="text"
                    value={formData.ten}
                    onChange={handleChange}
                    className={`input ${errors.ten ? 'border-red-500' : ''}`}
                    placeholder="Nhập tên"
                  />
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.ten && <p className="mt-1 text-sm text-red-600">{errors.ten}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Nhập email"
                />
                <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="sdt" className="block text-sm font-medium text-gray-700">
                Số điện thoại *
              </label>
              <div className="mt-1 relative">
                <input
                  id="sdt"
                  name="sdt"
                  type="tel"
                  value={formData.sdt}
                  onChange={handleChange}
                  className={`input ${errors.sdt ? 'border-red-500' : ''}`}
                  placeholder="Nhập số điện thoại"
                />
                <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.sdt && <p className="mt-1 text-sm text-red-600">{errors.sdt}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="diaChi" className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <div className="mt-1 relative">
                <input
                  id="diaChi"
                  name="diaChi"
                  type="text"
                  value={formData.diaChi}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nhập địa chỉ"
                />
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Tax Code */}
            <div>
              <label htmlFor="maSoThue" className="block text-sm font-medium text-gray-700">
                Mã số thuế
              </label>
              <div className="mt-1 relative">
                <input
                  id="maSoThue"
                  name="maSoThue"
                  type="text"
                  value={formData.maSoThue}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nhập mã số thuế (tùy chọn)"
                />
                <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>



            {/* Password */}
            <div>
              <label htmlFor="matKhau" className="block text-sm font-medium text-gray-700">
                Mật khẩu *
              </label>
              <div className="mt-1 relative">
                <input
                  id="matKhau"
                  name="matKhau"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.matKhau}
                  onChange={handleChange}
                  className={`input ${errors.matKhau ? 'border-red-500' : ''}`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.matKhau && <p className="mt-1 text-sm text-red-600">{errors.matKhau}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Chính sách bảo mật
              </Link>{' '}
              của chúng tôi.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
