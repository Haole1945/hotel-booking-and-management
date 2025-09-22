import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import PayPalPayment from './PayPalPayment';

const PaymentStep = ({ bookingData, onBack, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setPaymentSuccess(true);
    setIsProcessing(false);
    
    // Here you would typically send the booking data to your backend
    console.log('Payment successful:', paymentDetails);
    console.log('Booking data:', bookingData);
    
    // Show success message for a moment then close
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const handlePaymentError = (error) => {
    setIsProcessing(false);
    console.error('Payment error:', error);
    alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h3 className="text-2xl font-bold text-green-600 mb-2">Đặt phòng thành công!</h3>
        <p className="text-gray-600 mb-4">
          Cảm ơn bạn đã đặt phòng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-green-700">
            Mã đặt phòng của bạn sẽ được gửi qua email và SMS.
          </p>
        </div>
      </div>
    );
  }

  // Check if booking data is valid
  if (!bookingData || !bookingData.room || !bookingData.customerInfo) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
        <h3 className="text-xl font-bold text-red-600 mb-2">Thiếu thông tin đặt phòng</h3>
        <p className="text-gray-600 mb-4">
          Vui lòng quay lại các bước trước để điền đầy đủ thông tin.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Thông tin thanh toán</h3>
            <div className="space-y-2 text-blue-700 text-sm">
              <p>• Bạn chỉ cần thanh toán 20% tổng tiền phòng để đặt cọc</p>
              <p>• Số tiền còn lại sẽ thanh toán khi nhận phòng</p>
              <p>• Tiền cọc sẽ được hoàn lại nếu hủy phòng trước 24h</p>
              <p>• Sau khi thanh toán, nhân viên sẽ gọi xác nhận trong 15 phút</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4">Chi tiết đặt phòng</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Phòng:</span>
            <span className="font-medium">{bookingData.room.tenKieuPhong} - {bookingData.room.tenLoaiPhong}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số lượng:</span>
            <span className="font-medium">{bookingData.roomQuantity || 1} phòng</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Khách hàng:</span>
            <span className="font-medium">{bookingData.customerInfo?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số điện thoại:</span>
            <span className="font-medium">{bookingData.customerInfo?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium">{bookingData.checkIn?.toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium">{bookingData.checkOut?.toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số đêm:</span>
            <span className="font-medium">{bookingData.nights} đêm</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="font-bold text-blue-600">{formatPrice(bookingData.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-orange-600 font-medium">Tiền đặt cọc:</span>
            <span className="font-bold text-orange-600">{formatPrice(bookingData.depositAmount)}</span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            ({((bookingData.depositAmount / bookingData.totalAmount) * 100).toFixed(1)}% tổng tiền)
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h4 className="font-semibold text-lg mb-4">Phương thức thanh toán</h4>
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PayPal</span>
              </div>
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-sm text-gray-500">Thanh toán an toàn với PayPal</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              disabled
              className="mr-3"
            />
            <div className="flex items-center space-x-3">
              <CreditCard className="text-gray-400" size={32} />
              <div>
                <div className="font-medium text-gray-400">Thẻ tín dụng/ghi nợ</div>
                <div className="text-sm text-gray-400">Sắp ra mắt</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <Shield size={16} />
        <span>Thông tin thanh toán của bạn được bảo mật với mã hóa SSL 256-bit</span>
      </div>

      {/* PayPal Payment Component */}
      {paymentMethod === 'paypal' && (
        <PayPalPayment
          amount={bookingData.depositAmount}
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Quay lại
        </button>
        {paymentMethod !== 'paypal' && (
          <button
            disabled={isProcessing}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatPrice(bookingData.depositAmount)}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
