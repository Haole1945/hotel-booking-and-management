import React, { useState, useEffect } from 'react'
import { Calendar, DollarSign, Plus, Edit, Search, Filter, Eye, Calculator } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { api } from '../../services/api'

const RoomPriceManagement = () => {
  const [hangPhongList, setHangPhongList] = useState([])
  const [selectedHangPhong, setSelectedHangPhong] = useState(null)
  const [priceList, setPriceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCalculatorModal, setShowCalculatorModal] = useState(false)
  const [priceForm, setPriceForm] = useState({
    ngayApDung: '',
    gia: '',
    idNv: 'NV01' // Default employee ID
  })
  const [calculatorForm, setCalculatorForm] = useState({
    checkIn: '',
    checkOut: ''
  })
  const [calculationResult, setCalculationResult] = useState(null)

  useEffect(() => {
    fetchHangPhongList()
  }, [])

  const fetchHangPhongList = async () => {
    try {
      const response = await api.get('/api/hang-phong/all')
      if (response.data.statusCode === 200) {
        setHangPhongList(response.data.hangPhongList || [])
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách hạng phòng')
    } finally {
      setLoading(false)
    }
  }

  const fetchPriceList = async (idHangPhong) => {
    try {
      const response = await api.get(`/api/hang-phong/${idHangPhong}/prices`)
      if (response.data.statusCode === 200) {
        setPriceList(response.data.giaHangPhongList || [])
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giá')
    }
  }

  const handleSelectHangPhong = (hangPhong) => {
    setSelectedHangPhong(hangPhong)
    fetchPriceList(hangPhong.idHangPhong)
  }

  const handleAddPrice = async (e) => {
    e.preventDefault()

    // Validate ngày áp dụng phải là tương lai
    if (!isDateInFuture(priceForm.ngayApDung)) {
      toast.error('Ngày áp dụng phải là ngày trong tương lai')
      return
    }

    try {
      const response = await api.post(`/api/hang-phong/${selectedHangPhong.idHangPhong}/prices`, priceForm)
      if (response.data.statusCode === 200) {
        toast.success('Thêm giá thành công!')
        fetchPriceList(selectedHangPhong.idHangPhong)
        setShowAddModal(false)
        setPriceForm({ ngayApDung: '', gia: '', idNv: 'NV01' })
      } else {
        toast.error(response.data.message || 'Thêm giá thất bại')
      }
    } catch (error) {
      toast.error('Lỗi khi thêm giá')
    }
  }

  const handleUpdatePrice = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(
        `/api/hang-phong/${selectedHangPhong.idHangPhong}/prices?ngayApDung=${priceForm.ngayApDung}`,
        { gia: priceForm.gia, idNv: priceForm.idNv }
      )
      if (response.data.statusCode === 200) {
        toast.success('Cập nhật giá thành công!')
        fetchPriceList(selectedHangPhong.idHangPhong)
        setShowEditModal(false)
        setPriceForm({ ngayApDung: '', gia: '', idNv: 'NV01' })
      } else {
        toast.error(response.data.message || 'Cập nhật giá thất bại')
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật giá')
    }
  }



  const handleCalculatePrice = async (e) => {
    e.preventDefault()
    try {
      const response = await api.get(
        `/api/hang-phong/${selectedHangPhong.idHangPhong}/price-for-dates?checkIn=${calculatorForm.checkIn}&checkOut=${calculatorForm.checkOut}`
      )
      if (response.data.statusCode === 200) {
        setCalculationResult(response.data)
      } else {
        toast.error(response.data.message || 'Tính giá thất bại')
      }
    } catch (error) {
      toast.error('Lỗi khi tính giá')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const isDateInFuture = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý giá hạng phòng</h1>
          <p className="text-gray-600 mt-2">Quản lý giá theo ngày áp dụng cho từng hạng phòng</p>
        </div>
        {selectedHangPhong && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCalculatorModal(true)}
              className="btn-outline"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Tính giá
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm giá mới
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách hạng phòng */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Danh sách hạng phòng</h3>
            </div>
            <div className="card-body p-0">
              <div className="max-h-96 overflow-y-auto">
                {hangPhongList.map((hangPhong) => (
                  <div
                    key={hangPhong.idHangPhong}
                    onClick={() => handleSelectHangPhong(hangPhong)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedHangPhong?.idHangPhong === hangPhong.idHangPhong
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {hangPhong.tenKp} - {hangPhong.tenLp}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {hangPhong.idHangPhong}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách giá */}
        <div className="lg:col-span-2">
          {selectedHangPhong ? (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">
                  Giá của {selectedHangPhong.tenKp} - {selectedHangPhong.tenLp}
                </h3>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Lưu ý:</strong> Giá phòng không thể xóa để đảm bảo tính toán chính xác cho các booking đã tồn tại.
                    Chỉ có thể sửa giá cho ngày áp dụng trong tương lai để tránh ảnh hưởng đến các booking đã có.
                  </p>
                </div>
              </div>
              <div className="card-body">
                {priceList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày áp dụng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày thiết lập
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nhân viên
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sửa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {priceList.map((price) => (
                          <tr key={price.ngayApDung} className={!isDateInFuture(price.ngayApDung) ? 'bg-gray-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <span>{formatDate(price.ngayApDung)}</span>
                                {!isDateInFuture(price.ngayApDung) && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                    Đã áp dụng
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(price.gia)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(price.ngayThietLap)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {price.idNv}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {isDateInFuture(price.ngayApDung) ? (
                                <button
                                  onClick={() => {
                                    setPriceForm({
                                      ngayApDung: price.ngayApDung,
                                      gia: price.gia,
                                      idNv: price.idNv
                                    })
                                    setShowEditModal(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                  title="Sửa giá"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Sửa</span>
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">Không thể sửa</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có giá nào</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Bắt đầu bằng cách thêm giá đầu tiên cho hạng phòng này.
                    </p>
                    <p className="mt-2 text-xs text-blue-600">
                      Mỗi giá sẽ áp dụng từ ngày được chỉ định cho đến khi có giá mới.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn hạng phòng</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chọn một hạng phòng từ danh sách bên trái để xem và quản lý giá.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Price Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm giá mới</h3>
              <form onSubmit={handleAddPrice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày áp dụng
                  </label>
                  <input
                    type="date"
                    value={priceForm.ngayApDung}
                    onChange={(e) => setPriceForm({ ...priceForm, ngayApDung: e.target.value })}
                    className="input"
                    min={getTomorrowDate()}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ có thể chọn ngày trong tương lai
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    value={priceForm.gia}
                    onChange={(e) => setPriceForm({ ...priceForm, gia: e.target.value })}
                    className="input"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sửa giá</h3>
              <form onSubmit={handleUpdatePrice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày áp dụng
                  </label>
                  <input
                    type="date"
                    value={priceForm.ngayApDung}
                    className="input bg-gray-100"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    value={priceForm.gia}
                    onChange={(e) => setPriceForm({ ...priceForm, gia: e.target.value })}
                    className="input"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Price Calculator Modal */}
      {showCalculatorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tính giá theo khoảng thời gian</h3>
              <form onSubmit={handleCalculatePrice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày check-in
                  </label>
                  <input
                    type="date"
                    value={calculatorForm.checkIn}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, checkIn: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày check-out
                  </label>
                  <input
                    type="date"
                    value={calculatorForm.checkOut}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, checkOut: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                {calculationResult && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Kết quả tính giá:</h4>
                    <div className="space-y-1 text-sm">
                      <div>Tổng tiền: <span className="font-medium">{formatPrice(calculationResult.roomPrice)}</span></div>
                      <div>Số đêm: <span className="font-medium">{calculationResult.stats?.numberOfNights}</span></div>
                      <div>Giá trung bình/đêm: <span className="font-medium">{formatPrice(calculationResult.stats?.averagePricePerNight)}</span></div>
                      <div>Có thay đổi giá: <span className="font-medium">{calculationResult.stats?.hasPriceChanges ? 'Có' : 'Không'}</span></div>
                      <div>Tiền cọc tối thiểu: <span className="font-medium">{formatPrice(calculationResult.minDeposit)}</span></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCalculatorModal(false)
                      setCalculationResult(null)
                    }}
                    className="btn-outline"
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn-primary">
                    Tính giá
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomPriceManagement
