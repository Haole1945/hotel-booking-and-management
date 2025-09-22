import React, { useState, useEffect } from 'react'
import doiPhongService from '../../services/doiPhongService'
import toast from 'react-hot-toast'

const RoomChangeModal = ({ isOpen, onClose, ctPhieuThue, onSuccess }) => {
  const [step, setStep] = useState(1) // 1: Kiểm tra điều kiện, 2: Chọn phòng, 3: Xác nhận
  const [eligibility, setEligibility] = useState(null)
  const [availableRooms, setAvailableRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [feeCalculation, setFeeCalculation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    idCtPt: ctPhieuThue?.idCtPt || null,
    soPhongMoi: '',
    ngayDen: new Date().toISOString().split('T')[0],
    ngayDi: null,
    lyDo: '',
    ghiChu: '',
    autoCalculateFee: true,
    applyPromotion: true
  })

  useEffect(() => {
    if (isOpen && ctPhieuThue) {
      setFormData(prev => ({
        ...prev,
        idCtPt: ctPhieuThue.idCtPt,
        ngayDi: ctPhieuThue.ngayDi
      }))
      checkEligibility()
    }
  }, [isOpen, ctPhieuThue])

  const checkEligibility = async () => {
    if (!ctPhieuThue?.idCtPt) return

    setLoading(true)
    try {
      const response = await doiPhongService.checkRoomChangeEligibility(ctPhieuThue.idCtPt)
      if (response.statusCode === 200) {
        setEligibility(response.roomChangeEligibility)
        if (response.roomChangeEligibility.eligible) {
          loadAvailableRooms()
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Lỗi khi kiểm tra điều kiện đổi phòng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableRooms = async () => {
    try {
      const response = await doiPhongService.getAvailableRoomsForChange(ctPhieuThue.idCtPt)
      if (response.statusCode === 200) {
        setAvailableRooms(response.phongList || [])
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách phòng')
      console.error(error)
    }
  }

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room)
    setFormData(prev => ({ ...prev, soPhongMoi: room.soPhong }))
    
    // Tính phí đổi phòng
    try {
      const response = await doiPhongService.calculateRoomChangeFee(ctPhieuThue.idCtPt, room.soPhong)
      if (response.statusCode === 200) {
        setFeeCalculation(response.roomChangeFeeCalculation)
      }
    } catch (error) {
      console.error('Lỗi khi tính phí đổi phòng:', error)
    }
  }

  const handleSubmit = async () => {
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng muốn đổi')
      return
    }

    setLoading(true)
    try {
      // Thực hiện đổi phòng thay vì chỉ yêu cầu
      const response = await doiPhongService.changeRoom(formData)
      if (response.statusCode === 200) {
        toast.success('Đổi phòng thành công!')
        onSuccess && onSuccess()
        handleClose()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Lỗi khi đổi phòng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setEligibility(null)
    setAvailableRooms([])
    setSelectedRoom(null)
    setFeeCalculation(null)
    setFormData({
      idCtPt: null,
      soPhongMoi: '',
      ngayDen: new Date().toISOString().split('T')[0],
      ngayDi: null,
      lyDo: '',
      ghiChu: '',
      autoCalculateFee: true,
      applyPromotion: true
    })
    onClose()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Đổi phòng</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className="text-sm ml-2 mr-4">Kiểm tra</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <div className="text-sm ml-2 mr-4">Chọn phòng</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <div className="text-sm ml-2">Xác nhận</div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Step 1: Kiểm tra điều kiện */}
        {step === 1 && eligibility && !loading && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kiểm tra điều kiện đổi phòng</h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Thông tin phòng hiện tại:</h4>
              <p><strong>Phòng:</strong> {eligibility.soPhongHienTai}</p>
              <p><strong>Khách hàng:</strong> {eligibility.tenKhachHang}</p>
              <p><strong>CCCD:</strong> {eligibility.cccd}</p>
              <p><strong>Ngày đến:</strong> {new Date(eligibility.ngayDen).toLocaleDateString('vi-VN')}</p>
              <p><strong>Ngày đi:</strong> {new Date(eligibility.ngayDi).toLocaleDateString('vi-VN')}</p>
              {eligibility.soNgayConLai && (
                <p><strong>Số ngày còn lại:</strong> {eligibility.soNgayConLai} ngày</p>
              )}
            </div>

            <div className={`p-4 rounded-lg ${eligibility.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${eligibility.eligible ? 'text-green-800' : 'text-red-800'}`}>
                {eligibility.reason}
              </p>
              {eligibility.hanChe && eligibility.hanChe.length > 0 && (
                <ul className="mt-2 text-sm text-red-600">
                  {eligibility.hanChe.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              )}
            </div>

            {eligibility.eligible && (
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Tiếp tục
                </button>
              </div>
            )}

            {!eligibility.eligible && (
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        )}



        {/* Step 2: Chọn phòng */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chọn phòng mới</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.map((room) => (
                <div
                  key={room.soPhong}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRoom?.soPhong === room.soPhong
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <h4 className="font-semibold text-lg">Phòng {room.soPhong}</h4>
                  <p className="text-gray-600">Tầng {room.tang}</p>
                  <p className="text-gray-600">{room.tenKp}</p>
                  <p className="text-gray-600">{room.tenLp}</p>
                  {room.gia && (
                    <p className="text-blue-600 font-medium">{formatCurrency(room.gia)}/đêm</p>
                  )}
                </div>
              ))}
            </div>

            {selectedRoom && feeCalculation && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin phí đổi phòng:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Giá phòng cũ:</strong> {formatCurrency(feeCalculation.giaPhongCu)}/đêm</p>
                    <p><strong>Giá phòng mới:</strong> {formatCurrency(feeCalculation.giaPhongMoi)}/đêm</p>
                    <p><strong>Chênh lệch/đêm:</strong> {formatCurrency(feeCalculation.chenhLechGiaMotNgay)}</p>
                  </div>
                  <div>
                    <p><strong>Số ngày còn lại:</strong> {feeCalculation.soNgayConLai} ngày</p>
                    <p><strong>Tổng chênh lệch:</strong> {formatCurrency(feeCalculation.tongChenhLechGia || 0)}</p>
                    <p className="font-medium">
                      <strong>Loại giao dịch:</strong> {
                        feeCalculation.loaiGiaoDich === 'THU_THEM' ? 'Thu thêm' :
                        feeCalculation.loaiGiaoDich === 'HOAN_TIEN' ? 'Hoàn tiền' :
                        'Không thay đổi'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedRoom}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Xác nhận */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Xác nhận đổi phòng</h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tóm tắt đổi phòng:</h4>
              <p><strong>Từ phòng:</strong> {ctPhieuThue?.soPhong} → <strong>Sang phòng:</strong> {selectedRoom?.soPhong}</p>
              <p><strong>Ngày đổi:</strong> {new Date(formData.ngayDen).toLocaleDateString('vi-VN')}</p>
              {feeCalculation && feeCalculation.coPhiPhatSinh && (
                <p><strong>Phí phát sinh:</strong> {formatCurrency(feeCalculation.soTienKhachCanTra || feeCalculation.soTienKhachDuocHoan || 0)}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi phòng'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomChangeModal
