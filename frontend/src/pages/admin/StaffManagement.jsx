import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Shield,
  User
} from 'lucide-react'
import { api } from '../../services/api'
import { employeeService } from '../../services/employeeService'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { formatCurrency } from '../../utils/formatters'

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [staffPerPage] = useState(10)
  const [filters, setFilters] = useState({
    searchTerm: '',
    role: '',
    status: '',
    department: ''
  })

  // Data for dropdowns
  const [departments, setDepartments] = useState([])
  const [roles, setRoles] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffForm, setStaffForm] = useState({
    ho: '',
    ten: '',
    email: '',
    sdt: '',
    diaChi: '',
    ngaySinh: '',
    phai: '',
    username: '',
    password: '',
    idBp: '',
    idNq: ''
  })

  useEffect(() => {
    fetchStaff()
    fetchDepartments()
    fetchRoles()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế thay vì mock data
      const response = await api.get('/api/nhanvien/all')
      const staffData = response.data.nhanVienList || []

      setStaff(staffData)
      setFilteredStaff(staffData)
    } catch (error) {
      console.error('Error fetching staff:', error)
      // Có thể hiển thị thông báo lỗi cho user
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await employeeService.getAllDepartments()
      if (response.statusCode === 200) {
        setDepartments(response.boPhanList || [])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      toast.error('Không thể tải danh sách bộ phận. Vui lòng kiểm tra kết nối backend.')
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await employeeService.getAllRoles()
      if (response.statusCode === 200) {
        setRoles(response.nhomQuyenList || [])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Không thể tải danh sách nhóm quyền. Vui lòng kiểm tra kết nối backend.')
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...staff]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(member =>
        (member.ho + ' ' + member.ten).toLowerCase().includes(searchLower) ||
        (member.email && member.email.toLowerCase().includes(searchLower)) ||
        (member.sdt && member.sdt.includes(searchLower)) ||
        (member.tenNq && member.tenNq.toLowerCase().includes(searchLower)) ||
        (member.tenBp && member.tenBp.toLowerCase().includes(searchLower))
      )
    }

    // Filter by role (using tenBp)
    if (currentFilters.role) {
      filtered = filtered.filter(member => member.tenBp === currentFilters.role)
    }

    // Filter by status (skip for now since we don't have status field)
    if (currentFilters.status) {
      // filtered = filtered.filter(member => member.trangThai === currentFilters.status)
    }

    // Filter by department (using tenBp)
    if (currentFilters.department) {
      filtered = filtered.filter(member => member.tenBp === currentFilters.department)
    }

    setFilteredStaff(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      role: '',
      status: '',
      department: ''
    })
    setFilteredStaff(staff)
    setCurrentPage(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'suspended': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Nghỉ việc'
      case 'suspended': return 'Tạm nghỉ'
      default: return 'Không xác định'
    }
  }

  const getRoleColor = (tenBp) => {
    switch (tenBp) {
      case 'Quản lý': return 'text-purple-600 bg-purple-100'
      case 'Lễ tân': return 'text-blue-600 bg-blue-100'
      case 'Nhà hàng': return 'text-green-600 bg-green-100'
      case 'Kế toán': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleText = (tenBp) => {
    return tenBp || 'Không xác định'
  }

  const handleAddStaff = () => {
    setStaffForm({
      ho: '',
      ten: '',
      email: '',
      sdt: '',
      diaChi: '',
      ngaySinh: '',
      phai: '',
      username: '',
      password: '',
      idBp: '',
      idNq: ''
    })
    setShowAddModal(true)
  }

  const handleEditStaff = (member) => {
    setSelectedStaff(member)
    setStaffForm({
      ho: member.ho,
      ten: member.ten,
      email: member.email,
      soDienThoai: member.soDienThoai,
      diaChi: member.diaChi,
      ngaySinh: member.ngaySinh,
      gioiTinh: member.gioiTinh,
      chucVu: member.chucVu,
      phongBan: member.phongBan,
      luong: member.luong.toString(),
      ngayVaoLam: member.ngayVaoLam,
      trangThai: member.trangThai
    })
    setShowEditModal(true)
  }

  const handleViewStaff = (member) => {
    setSelectedStaff(member)
    setShowDetailModal(true)
  }

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        // TODO: Call API to delete staff
        setStaff(prev => prev.filter(member => member.id !== staffId))
        setFilteredStaff(prev => prev.filter(member => member.id !== staffId))
        toast.success('Xóa nhân viên thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa nhân viên')
      }
    }
  }

  const handleSaveStaff = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal) {
        // TODO: Implement update staff API
        toast.error('Chức năng cập nhật nhân viên chưa được triển khai')
      } else {
        // Create new staff
        const response = await employeeService.createEmployee(staffForm)
        if (response.statusCode === 200) {
          toast.success('Thêm nhân viên thành công!')
          fetchStaff() // Refresh the list
        } else {
          toast.error(response.message || 'Có lỗi xảy ra khi thêm nhân viên')
        }
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedStaff(null)
    } catch (error) {
      console.error('Error saving staff:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên')
    }
  }

  // Get current staff for pagination
  const indexOfLastStaff = currentPage * staffPerPage
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600 mt-2">Thêm, sửa, xóa và quản lý nhân viên khách sạn</p>
        </div>
        <button
          onClick={handleAddStaff}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang làm việc</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quản lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.tenBp === 'Quản lý').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.tenBp !== 'Quản lý').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên, email, SĐT, chức vụ..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Lễ tân">Lễ tân</option>
              <option value="Nhà hàng">Nhà hàng</option>
              <option value="Kế toán">Kế toán</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Nghỉ việc</option>
              <option value="suspended">Tạm nghỉ</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phòng ban
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Lễ tân">Lễ tân</option>
              <option value="Nhà hàng">Nhà hàng</option>
              <option value="Kế toán">Kế toán</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách nhân viên ({filteredStaff.length})
          </h2>
        </div>

        {filteredStaff.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStaff.map((member, index) => (
                    <tr key={member.idNv || member.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.ho} {member.ten}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.idNv}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {member.sdt || 'Không xác định'}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {member.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.tenNq || 'Chưa xác định'}</div>
                          <div className="text-sm text-gray-500">{member.tenBp || 'Chưa phân bộ phận'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.tenBp)}`}>
                          {getRoleText(member.tenBp)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800`}>
                          Hoạt động
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewStaff(member)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditStaff(member)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={staffPerPage}
              totalItems={filteredStaff.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có nhân viên nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy nhân viên nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Staff Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedStaff(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={staffForm.username}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, username: e.target.value }))}
                      className="input"
                      placeholder="Tên đăng nhập"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                      className="input"
                      placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                      minLength="6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={staffForm.ho}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ho: e.target.value }))}
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
                      value={staffForm.ten}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ten: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
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
                      value={staffForm.sdt}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, sdt: e.target.value }))}
                      className="input"
                      pattern="[0-9]{10,11}"
                      placeholder="0901234567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={staffForm.phai}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, phai: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={staffForm.ngaySinh}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, ngaySinh: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={staffForm.diaChi}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, diaChi: e.target.value }))}
                      className="input"
                      placeholder="Địa chỉ nhà"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bộ phận
                    </label>
                    <select
                      value={staffForm.idBp}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, idBp: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn bộ phận</option>
                      {departments.map(dept => (
                        <option key={dept.idBp} value={dept.idBp}>
                          {dept.tenBp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhóm quyền
                    </label>
                    <select
                      value={staffForm.idNq}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, idNq: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn nhóm quyền</option>
                      {roles.map(role => (
                        <option key={role.idNq} value={role.idNq}>
                          {role.tenNq}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedStaff(null)
                    }}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {showEditModal ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      {showDetailModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết nhân viên
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.hoTen}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.gioiTinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.ngaySinh}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.soDienThoai}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.diaChi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.chucVu}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.phongBan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.ngaySinh || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedStaff.tenBp)}`}>
                      {getRoleText(selectedStaff.tenBp)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800`}>
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn-outline"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEditStaff(selectedStaff)
                  }}
                  className="btn-primary"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffManagement
