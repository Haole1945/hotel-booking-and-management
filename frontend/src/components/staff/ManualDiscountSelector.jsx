import React, { useState, useEffect } from 'react'
import { Percent, AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ManualDiscountSelector = ({ 
  selectedGuest, 
  onDiscountChange, 
  loading, 
  disabled = false,
  currentBill = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)

  // Reset khi chọn khách mới
  useEffect(() => {
    if (selectedGuest?.id) {
      setDiscountPercent(0)
      setDiscountAmount(0)
      setIsExpanded(false)
      // Callback để reset discount
      onDiscountChange({
        discountPercent: 0,
        discountAmount: 0,
        hasManualDiscount: false
      })
    }
  }, [selectedGuest?.id])

  // Tính toán số tiền giảm dựa trên phần trăm
  const calculateDiscountAmount = (percent) => {
    if (!percent || !currentBill.total) return 0
    
    // Tính giảm giá trên tổng bill trước khi trừ khuyến mãi
    const baseAmount = (currentBill.roomCharges || 0) + 
                      (currentBill.serviceCharges || 0) + 
                      (currentBill.surcharges || 0)
    
    return Math.round(baseAmount * (percent / 100))
  }

  // Xử lý thay đổi phần trăm giảm giá
  const handleDiscountPercentChange = (value) => {
    const percent = parseFloat(value) || 0
    
    // Validation
    if (percent < 0) {
      toast.error('Phần trăm giảm giá không thể âm')
      return
    }
    
    if (percent > 50) {
      toast.error('Phần trăm giảm giá không thể vượt quá 50%')
      return
    }

    const amount = calculateDiscountAmount(percent)
    
    setDiscountPercent(percent)
    setDiscountAmount(amount)
    
    // Callback để cập nhật parent component
    onDiscountChange({
      discountPercent: percent,
      discountAmount: amount,
      hasManualDiscount: percent > 0
    })
  }

  // Reset giảm giá
  const handleResetDiscount = () => {
    setDiscountPercent(0)
    setDiscountAmount(0)
    onDiscountChange({
      discountPercent: 0,
      discountAmount: 0,
      hasManualDiscount: false
    })
    toast.success('Đã xóa giảm giá thủ công')
  }

  // Tính toán lại khi bill thay đổi
  useEffect(() => {
    if (discountPercent > 0) {
      const newAmount = calculateDiscountAmount(discountPercent)
      setDiscountAmount(newAmount)
      onDiscountChange({
        discountPercent,
        discountAmount: newAmount,
        hasManualDiscount: true
      })
    }
  }, [currentBill.total, currentBill.roomCharges, currentBill.serviceCharges, currentBill.surcharges])

  if (!selectedGuest) return null

  return (
    <div className={`border rounded-lg p-4 ${disabled ? 'bg-gray-50 opacity-60' : 'bg-orange-50 border-orange-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Percent className={`w-5 h-5 mr-2 ${disabled ? 'text-gray-400' : 'text-orange-600'}`} />
          <h3 className={`font-semibold ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
            Giảm giá tổng bill
          </h3>
          {disabled && (
            <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" title="Đã có khuyến mãi hạng phòng" />
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className={`p-1 rounded transition-colors ${
            disabled
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-orange-100 text-orange-600'
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {disabled && (
        <div className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded mb-3">
          <AlertTriangle className="w-4 h-4 inline mr-1" />
          Không thể áp dụng giảm giá thủ công khi đã có khuyến mãi hạng phòng
        </div>
      )}

      {isExpanded && !disabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phần trăm giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={discountPercent || ''}
                onChange={(e) => handleDiscountPercentChange(e.target.value)}
                className="input"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 50%</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền giảm
              </label>
              <div className="input bg-gray-50 text-gray-600 flex items-center">
                {discountAmount.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
          </div>
          
          {discountPercent > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
              <div className="flex items-center">
                <Percent className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  Giảm {discountPercent}% tổng bill = {discountAmount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <button
                onClick={handleResetDiscount}
                className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors"
                disabled={loading}
              >
                <X className="w-3 h-3 mr-1" />
                Xóa
              </button>
            </div>
          )}

          {discountPercent > 20 && (
            <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Cảnh báo: Giảm giá cao</p>
                <p>Giảm giá trên 20% cần được phê duyệt bởi quản lý.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ManualDiscountSelector
