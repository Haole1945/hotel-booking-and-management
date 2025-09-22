import React, { useState } from 'react'
import { FileText, CreditCard, Banknote, QrCode, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const InvoiceComponent = ({
  selectedGuest,
  bill,
  promotionData,
  checkOutData,
  onCheckOut,
  onCancel,
  loading
}) => {
  const [showQRCode, setShowQRCode] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  // Tính toán số tiền cần thanh toán - đã bao gồm khuyến mãi trong bill.total
  const remainingAmount = Math.max(0, bill.total - (selectedGuest?.depositAmount || 0))

  // Tạo QR code cho chuyển khoản
  const generateQRCode = () => {
    const amount = remainingAmount
    const addInfo = `Thanh toan hoa don ${selectedGuest?.maPhieuThue || ''}`
    return `https://img.vietqr.io/image/MB-0818181948-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}`
  }




  // Xử lý checkout theo phương thức thanh toán
  const handlePaymentMethodCheckout = () => {
    if (checkOutData?.paymentMethod === 'transfer') {
      if (!paymentConfirmed) {
        toast.error('Vui lòng xác nhận đã nhận tiền chuyển khoản')
        return
      }
    }
    onCheckOut()
  }

  return (
    <div className="space-y-6">
      {/* Thông tin hóa đơn */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Hóa đơn thanh toán</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tiền phòng:</span>
            <span>{bill.roomCharges?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span>Dịch vụ:</span>
            <span>{bill.serviceCharges?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span>Phụ thu:</span>
            <span>{(bill.surcharges || 0)?.toLocaleString('vi-VN')} VNĐ</span>
          </div>

          {/* Hiển thị khuyến mãi nếu có */}
          {bill.promotionDiscount > 0 && (
            <>
              <div className="border-t pt-2">
                <div className="flex justify-between text-red-600">
                  <span>Khuyến mãi:</span>
                  <span>-{bill.promotionDiscount?.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                {/* Chi tiết khuyến mãi */}
                {promotionData?.discountDetails && promotionData.discountDetails.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {promotionData.discountDetails.map((detail, index) => (
                      <div key={index} className="text-xs text-gray-600 ml-4">
                        • {detail.promotionName}: -{detail.discountAmount?.toLocaleString('vi-VN')} VNĐ
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Hiển thị giảm giá thủ công nếu có */}
          {bill.manualDiscount > 0 && (
            <div className="border-t pt-2">
              <div className="flex justify-between text-orange-600">
                <span>Khuyén mãi:</span>
                <span>-{bill.manualDiscount?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Tổng cộng:</span>
            <span>{bill.total?.toLocaleString('vi-VN')} VNĐ</span>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-green-600">
              <span>Tiền đặt cọc:</span>
              <span>{(selectedGuest?.depositAmount || 0)?.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-red-600 text-lg">
              <span>Số tiền phải trả:</span>
              <span>{remainingAmount?.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Phương thức thanh toán</h4>
        
        {checkOutData?.paymentMethod === 'cash' && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <Banknote className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">Thanh toán tiền mặt</p>
              <p className="text-sm text-green-600">
                Khách hàng cần thanh toán: <span className="font-bold">{remainingAmount?.toLocaleString('vi-VN')} VNĐ</span>
              </p>
            </div>
          </div>
        )}

        {checkOutData?.paymentMethod === 'transfer' && (
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Thanh toán chuyển khoản</p>
                <p className="text-sm text-blue-600">
                  Số tiền: <span className="font-bold">{remainingAmount?.toLocaleString('vi-VN')} VNĐ</span>
                </p>
              </div>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                <QrCode className="w-4 h-4 mr-1" />
                {showQRCode ? 'Ẩn QR' : 'Hiện QR'}
              </button>
            </div>

            {showQRCode && (
              <div className="text-center p-4 bg-white border rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Quét mã QR để chuyển khoản</p>
                <img 
                  src={generateQRCode()} 
                  alt="QR Code chuyển khoản" 
                  className="mx-auto mb-3 max-w-xs"
                />
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Ngân hàng: MB Bank</p>
                  <p>Số TK: 0818181948</p>
                  <p>Số tiền: {remainingAmount?.toLocaleString('vi-VN')} VNĐ</p>
                  <p>Nội dung: Thanh toán hóa đơn {selectedGuest?.maPhieuThue}</p>
                </div>
              </div>
            )}

            {/* Xác nhận đã nhận tiền */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-yellow-800">
                  Xác nhận đã nhận tiền chuyển khoản từ khách hàng
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="btn-outline flex-1"
        >
          Hủy
        </button>
        <button
          onClick={handlePaymentMethodCheckout}
          disabled={loading || !checkOutData?.actualCheckOut || (checkOutData?.paymentMethod === 'transfer' && !paymentConfirmed)}
          className="btn-primary flex-1"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : null}
          Hoàn tất Check-out
        </button>
      </div>
    </div>
  )
}

export default InvoiceComponent
