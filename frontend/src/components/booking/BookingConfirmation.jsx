import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Plus, Minus } from 'lucide-react';
import { formatPrice, formatPriceSegments } from '../../utils/priceUtils.js';

const BookingConfirmation = ({ room, bookingData, setBookingData, searchDates, onNext, onClose }) => {
  const [checkIn, setCheckIn] = useState(searchDates?.checkIn || null);
  const [checkOut, setCheckOut] = useState(searchDates?.checkOut || null);
  const [nights, setNights] = useState(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const [depositPercentage, setDepositPercentage] = useState(20);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositInputType, setDepositInputType] = useState('percentage'); // 'percentage' or 'amount'

  // Tính số đêm khi component mount hoặc khi dates thay đổi
  useEffect(() => {
    if (checkIn && checkOut) {
      const nightCount = calculateNights(checkIn, checkOut);
      setNights(nightCount);
    }
  }, [checkIn, checkOut]);

  // formatPrice now imported from utils

  const calculateNights = (checkInDate, checkOutDate) => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getTotalAmount = () => {
    // Use totalPrice from backend if available (calculated with new pricing logic)
    if (room.totalPrice && roomQuantity) {
      return room.totalPrice * roomQuantity;
    }
    // Fallback to old calculation if totalPrice not available
    if (room.giaHienTai && nights > 0) {
      return room.giaHienTai * nights * roomQuantity;
    }
    return 0;
  };

  const getDepositAmount = () => {
    if (depositInputType === 'percentage') {
      return getTotalAmount() * (depositPercentage / 100);
    } else {
      return depositAmount;
    }
  };

  const getMinDepositAmount = () => {
    return getTotalAmount() * 0.2; // Minimum 20%
  };

  const validateDeposit = () => {
    const currentDeposit = getDepositAmount();
    const minDeposit = getMinDepositAmount();
    return currentDeposit >= minDeposit;
  };

  // Update deposit when total amount or percentage changes
  useEffect(() => {
    if (depositInputType === 'percentage') {
      const newDepositAmount = getTotalAmount() * (depositPercentage / 100);
      setDepositAmount(newDepositAmount);
    }
  }, [getTotalAmount(), depositPercentage, depositInputType]);

  const handleDepositPercentageChange = (value) => {
    const percentage = Math.max(20, Math.min(100, parseFloat(value) || 20));
    setDepositPercentage(percentage);
  };

  const handleDepositAmountChange = (value) => {
    const amount = Math.max(0, parseFloat(value) || 0);
    setDepositAmount(amount);
  };

  // Xử lý thay đổi số lượng phòng
  const handleQuantityChange = (newQuantity) => {
    setQuantityError('');

    if (newQuantity < 1) {
      setQuantityError('Số lượng phòng phải ít nhất là 1');
      return;
    }

    if (newQuantity > room.soPhongTrong) {
      setQuantityError(`Chỉ còn ${room.soPhongTrong} phòng trống`);
      return;
    }

    setRoomQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    handleQuantityChange(roomQuantity + 1);
  };

  const decreaseQuantity = () => {
    handleQuantityChange(roomQuantity - 1);
  };

  const handleContinue = () => {
    if (!checkIn || !checkOut) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (quantityError) {
      alert('Vui lòng kiểm tra lại số lượng phòng');
      return;
    }

    if (!validateDeposit()) {
      alert(`Tiền đặt cọc phải ít nhất ${formatPrice(getMinDepositAmount())} (20% tổng tiền)`);
      return;
    }

    const totalAmount = getTotalAmount();
    const finalDepositAmount = getDepositAmount();

    setBookingData({
      ...bookingData,
      checkIn,
      checkOut,
      nights,
      roomQuantity,
      totalAmount,
      depositAmount: finalDepositAmount
    });

    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Room Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Thông tin phòng đã chọn</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-lg text-gray-800">
              {room.tenKieuPhong} - {room.tenLoaiPhong}
            </h4>
            <p className="text-gray-600 mt-1">{room.moTaKieuPhong}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {room.moTaKieuPhong}
              </span>
              <span className="text-green-600 font-medium">
                {room.soPhongTrong}/{room.tongSoPhong} phòng trống
              </span>
            </div>
          </div>
          <div className="text-right">
            {room.priceSegments && room.priceSegments.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết giá</h4>
                <div className="space-y-1 mb-3">
                  {formatPriceSegments(room.priceSegments).map((segment, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {segment.formattedDateRange} ({segment.nightsText})
                      </span>
                      <span className="font-medium text-blue-600">
                        {segment.formattedPrice}
                      </span>
                    </div>
                  ))}
                </div>
                {room.totalPrice && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Tổng:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(room.totalPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : room.averagePrice ? (
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(room.averagePrice)}
                </div>
                <div className="text-sm text-gray-500">/ đêm (trung bình)</div>
                {room.totalPrice && (
                  <div className="text-sm text-gray-600 mt-1">
                    Tổng: {formatPrice(room.totalPrice)}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(room.giaHienTai)}
                </div>
                <div className="text-sm text-gray-500">/ đêm</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Lưu ý:</strong> Ngày nhận phòng và ngày trả phòng được lấy từ form tìm kiếm.
          Nếu muốn thay đổi ngày, vui lòng quay lại trang tìm kiếm để tìm lại phòng phù hợp.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Ngày nhận phòng
          </label>
          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            {checkIn ? checkIn.toLocaleDateString('vi-VN') : 'Chưa chọn ngày'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Ngày trả phòng
          </label>
          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            {checkOut ? checkOut.toLocaleDateString('vi-VN') : 'Chưa chọn ngày'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số đêm
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
            {nights} đêm
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng phòng
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={decreaseQuantity}
                disabled={roomQuantity <= 1}
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} />
              </button>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{roomQuantity}</div>
                <div className="text-xs text-gray-500">phòng</div>
              </div>

              <button
                onClick={increaseQuantity}
                disabled={roomQuantity >= room.soPhongTrong}
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-600">Phòng trống</div>
              <div className="text-sm font-semibold text-green-600">{room.soPhongTrong}</div>
            </div>
          </div>

          {quantityError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs">{quantityError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Summary */}
      {nights > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4">Tóm tắt chi phí</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              {room.totalPrice ? (
                <span>Giá phòng cho {nights} đêm x {roomQuantity} phòng</span>
              ) : (
                <span>{formatPrice(room.giaHienTai)} x {nights} đêm x {roomQuantity} phòng</span>
              )}
              <span>{formatPrice(getTotalAmount())}</span>
            </div>
            {room.totalPrice && room.averagePrice && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Giá trung bình: {formatPrice(room.averagePrice)} / đêm</span>
                <span></span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span className="text-xl text-blue-600">{formatPrice(getTotalAmount())}</span>
            </div>

            {/* Deposit Input Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">Tiền đặt cọc</span>
                <span className="text-sm text-gray-500">
                  (Tối thiểu: {formatPrice(getMinDepositAmount())})
                </span>
              </div>

              <div className="space-y-3">
                {/* Toggle between percentage and amount */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setDepositInputType('percentage')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      depositInputType === 'percentage'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Theo %
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositInputType('amount')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      depositInputType === 'amount'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Số tiền
                  </button>
                </div>

                {/* Input field */}
                <div className="flex items-center space-x-2">
                  {depositInputType === 'percentage' ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="number"
                        min="20"
                        max="100"
                        step="1"
                        value={depositPercentage}
                        onChange={(e) => handleDepositPercentageChange(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-gray-600">%</span>
                      <span className="text-sm text-gray-500 flex-1">
                        = {formatPrice(getTotalAmount() * (depositPercentage / 100))}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={depositAmount.toLocaleString('vi-VN')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleDepositAmountChange(value);
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded"
                        placeholder="Nhập số tiền"
                      />
                      <span className="text-gray-600">VNĐ</span>
                    </div>
                  )}
                </div>

                {/* Validation message */}
                {!validateDeposit() && (
                  <div className="text-red-600 text-sm">
                    Tiền đặt cọc phải ít nhất {formatPrice(getMinDepositAmount())} (20% tổng tiền)
                  </div>
                )}

                {/* Final deposit amount display */}
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Tiền đặt cọc:</span>
                  <span>{formatPrice(getDepositAmount())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleContinue}
          disabled={!checkIn || !checkOut || nights === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
