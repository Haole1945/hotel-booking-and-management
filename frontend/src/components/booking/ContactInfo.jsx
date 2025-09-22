import React, { useState, useEffect } from 'react';
import { Phone, User, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ContactInfo = ({ bookingData, setBookingData, onNext, onBack }) => {
  const { user } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    idCard: ''
  });

  const [errors, setErrors] = useState({});

  // Tự động điền thông tin từ tài khoản đã đăng nhập
  useEffect(() => {
    if (user) {
      console.log('User data for auto-fill:', user); // Debug log

      setCustomerInfo({
        fullName: user.hoTen || user.tenKhachHang || user.fullName || user.name || '',
        phone: user.sdt || user.soDienThoai || user.phone || user.phoneNumber || '',
        email: user.email || '',
        idCard: user.cccd || user.cmnd || user.idCard || user.identityCard || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.fullName || !customerInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!customerInfo.phone || !customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    if (!customerInfo.email || !customerInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!customerInfo.idCard || !customerInfo.idCard.trim()) {
      newErrors.idCard = 'Vui lòng nhập CCCD/CMND';
    } else if (!/^[0-9]{9,12}$/.test(customerInfo.idCard.trim())) {
      newErrors.idCard = 'CCCD/CMND không hợp lệ (9-12 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContinue = () => {
    // Validate booking data first
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.totalAmount) {
      alert('Thông tin đặt phòng không đầy đủ. Vui lòng quay lại bước trước để kiểm tra.');
      return;
    }

    if (validateForm()) {
      const updatedBookingData = {
        ...bookingData,
        customerInfo
      };
      setBookingData(updatedBookingData);

      // Small delay to ensure state is updated
      setTimeout(() => {
        onNext();
      }, 100);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Hotel Contact Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Thông tin liên lạc khách sạn</h3>
            <div className="space-y-2 text-yellow-700">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="font-medium">Hotline: 1900-1234</span>
              </div>
              <p className="text-sm">
                <strong>Lưu ý quan trọng:</strong> Sau khi điền thông tin, vui lòng chú ý nghe máy.
                Nhân viên khách sạn sẽ gọi để xác nhận đặt phòng và hướng dẫn thanh toán trong vòng 15 phút.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Tóm tắt đặt phòng</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Phòng:</span>
            <span className="ml-2 font-medium">{bookingData.room.tenKieuPhong} - {bookingData.room.tenLoaiPhong}</span>
          </div>
          <div>
            <span className="text-gray-600">Số lượng:</span>
            <span className="ml-2 font-medium">{bookingData.roomQuantity || 1} phòng</span>
          </div>
          <div>
            <span className="text-gray-600">Số đêm:</span>
            <span className="ml-2 font-medium">{bookingData.nights} đêm</span>
          </div>
          <div>
            <span className="text-gray-600">Nhận phòng:</span>
            <span className="ml-2 font-medium">{bookingData.checkIn?.toLocaleDateString('vi-VN')}</span>
          </div>
          <div>
            <span className="text-gray-600">Trả phòng:</span>
            <span className="ml-2 font-medium">{bookingData.checkOut?.toLocaleDateString('vi-VN')}</span>
          </div>
          <div>
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="ml-2 font-medium text-blue-600">{formatPrice(bookingData.totalAmount)}</span>
          </div>
          <div>
            <span className="text-gray-600">Đặt cọc:</span>
            <span className="ml-2 font-medium text-orange-600">{formatPrice(bookingData.depositAmount)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
          {user && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Đã điền từ tài khoản của bạn
            </div>
          )}
        </div>


        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Họ và tên *
            </label>
            <input
              type="text"
              value={customerInfo.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CCCD/CMND *
            </label>
            <input
              type="text"
              value={customerInfo.idCard}
              onChange={(e) => handleInputChange('idCard', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.idCard ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số CCCD/CMND"
            />
            {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;
