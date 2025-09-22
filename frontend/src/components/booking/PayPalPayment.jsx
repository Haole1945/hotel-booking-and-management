import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PayPalButton from '../payment/PayPalButton';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const PayPalPayment = ({ amount, bookingData, onSuccess, onError, onBack }) => {
  const [processing, setProcessing] = useState(false);

  const handlePaymentSuccess = async (paymentData) => {
    setProcessing(true);
    try {
      console.log('PayPal payment successful, processing booking...');
      console.log('Payment data received:', paymentData);
      console.log('Booking data:', bookingData);
      console.log('Room data details:', bookingData.room);
      console.log('Room idHangPhong:', bookingData.room?.idHangPhong);
      console.log('All room properties:', Object.keys(bookingData.room || {}));

      // Gọi API để lưu booking với thông tin thanh toán
      const bookingPayload = {
        ...bookingData,
        paymentData,
        paymentStatus: 'PAID',
        paymentMethod: 'PAYPAL'
      };

      // Debug: Log original booking data
      console.log('Original bookingData:', bookingData);
      console.log('checkIn type:', typeof bookingData.checkIn, bookingData.checkIn);
      console.log('checkOut type:', typeof bookingData.checkOut, bookingData.checkOut);
      console.log('Customer info from bookingData:', {
        fullName: bookingData.fullName,
        phone: bookingData.phone,
        email: bookingData.email,
        idCard: bookingData.idCard
      });
      console.log('Customer info from customerInfo:', bookingData.customerInfo);

      // Convert dates to proper format (YYYY-MM-DD) in local timezone
      const formatDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) {
          // Use local timezone instead of UTC
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        if (typeof date === 'string') {
          const parsedDate = new Date(date);
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const day = String(parsedDate.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return null;
      };

      // Get customer data from customerInfo object
      const customerInfo = bookingData.customerInfo;

      // Validate customer data
      if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.email || !customerInfo.idCard) {
        throw new Error('Thông tin khách hàng không đầy đủ. Vui lòng kiểm tra lại.');
      }

      // Prepare booking data for API
      const apiPayload = {
        checkIn: formatDate(bookingData.checkIn),
        checkOut: formatDate(bookingData.checkOut),
        nights: bookingData.nights,
        fullName: customerInfo.fullName.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email.trim(),
        idCard: customerInfo.idCard.trim(),
        room: {
          idHangPhong: bookingData.room.idHangPhong,
          tenKieuPhong: bookingData.room.tenKieuPhong,
          tenLoaiPhong: bookingData.room.tenLoaiPhong,
          tenHangPhong: bookingData.room.tenHangPhong,
          giaPhong: bookingData.room.giaPhong,
          soLuongPhongDat: bookingData.roomQuantity || 1
        },
        totalAmount: bookingData.totalAmount,
        depositAmount: bookingData.depositAmount,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'PAID',
        paymentData: paymentData
      };

      console.log('Calling PayPal booking API with:', apiPayload);

      // Call API to create booking
      const response = await api.post('/api/phieu-dat/create-paypal', apiPayload);
      console.log('API response:', response.data);

      if (response.data.statusCode === 200) {
        toast.success('Đặt phòng thành công!');
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra khi tạo booking');
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      console.error('Error details:', error.response?.data || error.message);

      let errorMessage = 'Có lỗi xảy ra khi tạo đặt phòng';
      if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }

      toast.error(errorMessage);
      if (onError) {
        onError(error);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Có lỗi xảy ra khi thanh toán');
    if (onError) {
      onError(error);
    }
  };

  const handlePaymentCancel = (data) => {
    console.log('Payment cancelled:', data);
    toast('Thanh toán đã bị hủy', {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: 'white',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thanh toán PayPal</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} className="mr-1" />
            Quay lại
          </button>
        )}
      </div>

      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">Thông tin thanh toán</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Bạn chỉ cần thanh toán 20% tổng tiền phòng để đặt cọc</p>
          <p>• Số tiền còn lại sẽ thanh toán khi nhận phòng</p>
          <p>• Tiền cọc sẽ được hoàn lại nếu hủy phòng trước 24h</p>
          <p>• Sau khi thanh toán, nhân viên sẽ gọi xác nhận trong 15 phút</p>
        </div>
      </div>

      {/* PayPal Button */}
      <div className="bg-white border rounded-lg p-6">
        <PayPalButton
          amount={amount}
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
          disabled={processing}
        />
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-gray-500">
        <p>Bằng cách thanh toán, bạn đồng ý với điều khoản sử dụng của chúng tôi</p>
      </div>
    </div>
  );
};

export default PayPalPayment;
