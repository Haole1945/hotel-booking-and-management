import React, { useState, useEffect } from 'react'
import doiPhongService from '../../services/doiPhongService'
import toast from 'react-hot-toast'

const RoomChangeHistory = ({ idCtPt, cccd, showAll = false }) => {
  const [roomChanges, setRoomChanges] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    cccd: cccd || ''
  })

  useEffect(() => {
    loadRoomChanges()
  }, [idCtPt, cccd, showAll])

  const loadRoomChanges = async () => {
    setLoading(true)
    try {
      let response
      
      if (idCtPt) {
        // Lấy lịch sử đổi phòng theo chi tiết phiếu thuê
        response = await doiPhongService.getRoomChangeHistory(idCtPt)
      } else if (cccd) {
        // Lấy lịch sử đổi phòng theo khách hàng
        response = await doiPhongService.getDoiPhongByKhachHang(cccd)
      } else if (showAll) {
        // Lấy tất cả lịch sử đổi phòng
        response = await doiPhongService.getAllDoiPhong()
      } else {
        // Lấy đổi phòng hiện tại
        response = await doiPhongService.getCurrentRoomChanges()
      }

      if (response.statusCode === 200) {
        setRoomChanges(response.doiPhongList || [])
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử đổi phòng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Vui lòng chọn khoảng thời gian')
      return
    }

    setLoading(true)
    try {
      const response = await doiPhongService.filterDoiPhong(filters)
      if (response.statusCode === 200) {
        setRoomChanges(response.doiPhongList || [])
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Lỗi khi lọc dữ liệu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {idCtPt ? 'Lịch sử đổi phòng' : 
           cccd ? 'Lịch sử đổi phòng của khách hàng' : 
           showAll ? 'Tất cả lịch sử đổi phòng' : 'Đổi phòng hiện tại'}
        </h3>
        <button
          onClick={loadRoomChanges}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Filters */}
      {showAll && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Bộ lọc</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CCCD khách hàng
              </label>
              <input
                type="text"
                value={filters.cccd}
                onChange={(e) => setFilters(prev => ({ ...prev, cccd: e.target.value }))}
                placeholder="Nhập CCCD..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : roomChanges.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Không có lịch sử đổi phòng</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin đổi phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng cũ → Phòng mới
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại phòng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomChanges.map((change, index) => (
                <tr key={`${change.idCtPt}-${change.soPhongMoi}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">ID: {change.idCtPt}</div>
                      <div className="text-gray-500">Phiếu thuê: {change.idPt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{change.tenKhachHang}</div>
                      <div className="text-gray-500">{change.cccd}</div>
                      {change.sdtKhachHang && (
                        <div className="text-gray-500">{change.sdtKhachHang}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <span className="font-medium text-red-600">{change.soPhongCu}</span>
                        <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-green-600">{change.soPhongMoi}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div><strong>Đến:</strong> {formatDate(change.ngayDen)}</div>
                      {change.ngayDi && (
                        <div><strong>Đi:</strong> {formatDate(change.ngayDi)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="text-gray-600">Cũ: {change.tenKieuPhongCu} - {change.tenLoaiPhongCu}</div>
                      <div className="text-gray-600">Mới: {change.tenKieuPhongMoi} - {change.tenLoaiPhongMoi}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {roomChanges.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Tổng cộng: {roomChanges.length} lần đổi phòng
        </div>
      )}
    </div>
  )
}

export default RoomChangeHistory
