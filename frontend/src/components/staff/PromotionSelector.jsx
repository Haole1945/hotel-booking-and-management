import React, { useState, useEffect } from 'react'
import { Gift, Percent, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { promotionService } from '../../services/promotionService'

const PromotionSelector = ({ selectedGuest, onPromotionChange, loading, disabled = false, disabledReason = '' }) => {
  const [promotions, setPromotions] = useState(null)
  const [selectedPromotions, setSelectedPromotions] = useState({
    roomType: {}, // { idHangPhong: idKm } - chỉ 1 khuyến mãi cho mỗi hạng phòng
    invoice: [] // [idKm1, idKm2]
  })
  const [loadingPromotions, setLoadingPromotions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true) // State để thu gọn/mở rộng

  // Load promotions khi chọn khách
  useEffect(() => {
    if (selectedGuest?.id) {
      loadPromotions(selectedGuest.id)
    } else {
      setPromotions(null)
      setSelectedPromotions({ roomType: {}, invoice: [] })
    }
  }, [selectedGuest])

  const loadPromotions = async (rentalId) => {
    try {
      setLoadingPromotions(true)
      const data = await promotionService.getPromotionsByRental(rentalId)

      if (data.statusCode === 200) {
        setPromotions(data.promotionsByRental)
      } else {
        console.error('Error loading promotions:', data.message)
        setPromotions(null)
        toast.error(data.message || 'Không thể tải danh sách khuyến mãi')
      }
    } catch (error) {
      console.error('Error loading promotions:', error)
      toast.error('Không thể tải danh sách khuyến mãi')
      setPromotions(null)
    } finally {
      setLoadingPromotions(false)
    }
  }

  const handlePromotionToggle = (type, idHangPhong, idKm, checked) => {
    const newSelections = { ...selectedPromotions }

    if (type === 'roomType') {
      if (checked) {
        // Radio button: chỉ cho phép chọn 1 khuyến mãi cho mỗi hạng phòng
        newSelections.roomType[idHangPhong] = idKm
      }
      // Với radio button, không cần xử lý trường hợp uncheck vì radio tự động uncheck các option khác
    } else if (type === 'invoice') {
      if (checked) {
        if (!newSelections.invoice.includes(idKm)) {
          newSelections.invoice.push(idKm)
        }
      } else {
        newSelections.invoice = newSelections.invoice.filter(id => id !== idKm)
      }
    }

    setSelectedPromotions(newSelections)

    // Tính toán và callback
    const calculatedDiscounts = calculateDiscounts(newSelections)
    onPromotionChange(calculatedDiscounts)
  }

  const calculateDiscounts = (selections) => {
    if (!promotions) return { totalDiscount: 0, discountDetails: [] }

    let totalDiscount = 0
    const discountDetails = []

    // Tính khuyến mãi theo hạng phòng
    if (promotions.roomTypePromotions) {
      Object.entries(promotions.roomTypePromotions).forEach(([idHangPhong, roomTypeData]) => {
        const selectedPromoId = selections.roomType[idHangPhong] // Chỉ 1 khuyến mãi

        if (selectedPromoId) {
          const promotion = roomTypeData.availablePromotions.find(p => p.idKm === selectedPromoId)
          if (promotion && promotion.phanTramGiam) {
            const discountAmount = (roomTypeData.roomCharges * promotion.phanTramGiam) / 100
            totalDiscount += discountAmount

            discountDetails.push({
              type: 'roomType',
              idHangPhong: parseInt(idHangPhong),
              hangPhongName: `${roomTypeData.hangPhong.tenKieuPhong} ${roomTypeData.hangPhong.tenLoaiPhong}`,
              promotionName: promotion.moTaKm,
              percentage: promotion.phanTramGiam,
              originalAmount: roomTypeData.roomCharges,
              discountAmount: discountAmount,
              rooms: roomTypeData.rooms
            })
          }
        }
      })
    }

    // Tính khuyến mãi tổng hóa đơn
    if (promotions.invoicePromotions && selections.invoice.length > 0) {
      // Tính tổng tiền phòng để áp dụng khuyến mãi tổng hóa đơn
      const totalRoomCharges = Object.values(promotions.roomTypePromotions || {})
        .reduce((sum, roomData) => sum + (roomData.roomCharges || 0), 0)

      selections.invoice.forEach(idKm => {
        const promotion = promotions.invoicePromotions.find(p => p.idKm === idKm)
        if (promotion && promotion.phanTramGiam) {
          const discountAmount = (totalRoomCharges * promotion.phanTramGiam) / 100
          totalDiscount += discountAmount
          
          discountDetails.push({
            type: 'invoice',
            promotionName: promotion.moTaKm,
            percentage: promotion.phanTramGiam,
            originalAmount: totalRoomCharges,
            discountAmount: discountAmount
          })
        }
      })
    }

    return { totalDiscount, discountDetails }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định'
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}-${month}-${year}`
  }

  if (!selectedGuest) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-center text-gray-500">
          <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Chọn khách để xem khuyến mãi có sẵn</p>
        </div>
      </div>
    )
  }

  if (loadingPromotions) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Đang tải khuyến mãi...</p>
        </div>
      </div>
    )
  }

  if (!promotions || (!promotions.roomTypePromotions && (!promotions.invoicePromotions || promotions.invoicePromotions.length === 0))) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-center text-gray-500">
          <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Không có khuyến mãi nào khả dụng</p>
          <p className="text-xs mt-1">Phiếu thuê #{selectedGuest?.id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg ${disabled ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Gift className={`w-5 h-5 mr-2 ${disabled ? 'text-gray-400' : 'text-red-500'}`} />
          <h3 className={`font-semibold ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
            Khuyến mãi có sẵn
          </h3>
          {disabled && (
            <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              {disabledReason || 'Đã có giảm giá thủ công'}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className={`p-1 rounded transition-colors ${
            disabled
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nội dung khuyến mãi - chỉ hiển thị khi expanded */}
      {isExpanded && (
        <>
          {/* Khuyến mãi theo hạng phòng */}
          {promotions.roomTypePromotions && Object.entries(promotions.roomTypePromotions).map(([idHangPhong, roomTypeData]) => (
        <div key={idHangPhong} className="mb-4 border rounded-lg p-3 bg-white">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-blue-600">
              {roomTypeData.hangPhong.tenKieuPhong} {roomTypeData.hangPhong.tenLoaiPhong}
            </h4>
            <span className="text-sm text-gray-500 ml-2">
              ({roomTypeData.rooms.join(', ')})
            </span>
          </div>
          
          <div className="text-xs text-gray-600 mb-2">
            {roomTypeData.roomCount} phòng × {roomTypeData.nightCount} đêm = {formatCurrency(roomTypeData.roomCharges)}
          </div>
          
          {roomTypeData.availablePromotions && roomTypeData.availablePromotions.length > 0 ? (
            <>
              {/* Option không áp dụng khuyến mãi */}
              <label className={`flex items-start space-x-2 mb-2 p-2 rounded ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name={`promotion-room-${idHangPhong}`}
                  checked={!selectedPromotions.roomType[idHangPhong]}
                  onChange={() => {
                    if (disabled) return
                    const newSelections = { ...selectedPromotions }
                    delete newSelections.roomType[idHangPhong]
                    setSelectedPromotions(newSelections)
                    const calculatedDiscounts = calculateDiscounts(newSelections)
                    onPromotionChange(calculatedDiscounts)
                  }}
                  className="mt-1"
                  disabled={loading || disabled}
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Không áp dụng khuyến mãi</div>
                </div>
              </label>

              {/* Các khuyến mãi có sẵn */}
              {roomTypeData.availablePromotions.map(promo => (
              <label key={promo.idKm} className={`flex items-start space-x-2 mb-2 p-2 rounded ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name={`promotion-room-${idHangPhong}`}
                  checked={selectedPromotions.roomType[idHangPhong] === promo.idKm}
                  onChange={(e) => {
                    if (disabled) return
                    handlePromotionToggle('roomType', idHangPhong, promo.idKm, e.target.checked)
                  }}
                  className="mt-1"
                  disabled={loading || disabled}
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <Percent className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium text-red-600">
                      Giảm {promo.phanTramGiam}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{promo.moTaKm}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(promo.ngayBatDau)} - {formatDate(promo.ngayKetThuc)}
                  </div>
                </div>
              </label>
            ))}
            </>
          ) : (
            <div className="text-sm text-gray-500 italic">Không có khuyến mãi</div>
          )}
        </div>
      ))}
      
      {/* Khuyến mãi tổng hóa đơn */}
      {promotions.invoicePromotions && promotions.invoicePromotions.length > 0 && (
        <div className="border rounded-lg p-3 bg-white">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-green-600">Khuyến mãi tổng hóa đơn</h4>
          </div>
          
          {promotions.invoicePromotions.map(promo => (
            <label key={promo.idKm} className={`flex items-start space-x-2 mb-2 p-2 rounded ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
            }`}>
              <input
                type="checkbox"
                checked={selectedPromotions.invoice.includes(promo.idKm)}
                onChange={(e) => {
                  if (disabled) return
                  handlePromotionToggle('invoice', null, promo.idKm, e.target.checked)
                }}
                className="rounded border-gray-300 mt-1"
                disabled={loading || disabled}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    Giảm {promo.phanTramGiam}%
                  </span>
                </div>
                <div className="text-sm text-gray-700">{promo.moTaKm}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(promo.ngayBatDau)} - {formatDate(promo.ngayKetThuc)}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  )
}

export default PromotionSelector
