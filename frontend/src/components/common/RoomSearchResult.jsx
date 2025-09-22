import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAmenityIcon } from '../../utils/amenityIcons.jsx';
import AmenityIcon from './AmenityIcon.jsx';
import BookingModal from '../booking/BookingModal';
import { formatPrice, getDisplayPrice, formatPriceSegments } from '../../utils/priceUtils.js';
import { useAuth } from '../../contexts/AuthContext';

const RoomSearchResult = ({ searchResults, searchDates, isPublic = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Handle book room
  const handleBookRoom = (room) => {
    const userAuthenticated = isAuthenticated();
    console.log('🔍 handleBookRoom called with:', {
      room,
      isPublic,
      userAuthenticated,
      searchDates
    });

    if (!userAuthenticated) {
      console.log('📝 User not authenticated, saving booking data and redirecting to login');
      // Save booking data and redirect to login
      const bookingData = {
        room: room,
        searchDates: searchDates,
        returnUrl: '/booking'
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      console.log('💾 Saved booking data:', bookingData);
      navigate('/login?redirect=booking');
    } else {
      console.log('✅ User authenticated, opening booking modal');
      setSelectedRoom(room);
      setShowBookingModal(true);
    }
  };

  // Handle view detail
  const handleViewDetail = (room) => {
    setDetailRoom(room);
    setShowDetailModal(true);
  };

  // Format giá tiền - now using utility function

  // Render tiện nghi với icon
  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) {
      return (
        <div className="mt-2">
          <span className="text-sm text-gray-400">Chưa có thông tin tiện nghi</span>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tiện nghi:</h4>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span key={index} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <AmenityIcon amenity={amenity} className="w-3.5 h-3.5" />
              {amenity.tenTn}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render khuyến mãi
  const renderPromotions = (promotions) => {
    if (!promotions || promotions.length === 0) return null;

    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Khuyến mãi:</h4>
        {promotions.map((promotion, index) => (
          <div key={index} className="bg-red-50 border border-red-200 rounded p-2 mb-1">
            <span className="text-red-600 font-medium text-sm">
              🎉 {promotion.moTaKm}
              {promotion.phanTramGiam && ` - Giảm ${promotion.phanTramGiam}%`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có kết quả tìm kiếm</p>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = searchResults.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Kết quả tìm kiếm */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết quả tìm kiếm</h2>
        <p className="text-gray-600">
          Tìm thấy {searchResults.length} hạng phòng phù hợp
          {totalPages > 1 && (
            <span className="ml-2 text-sm">
              (Trang {currentPage} / {totalPages})
            </span>
          )}
        </p>
      </div>

      {/* Grid layout - 3 hạng phòng trên một hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentRooms.map((room, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {/* Hình ảnh */}
            <div className="relative">
              {room.danhSachAnhUrl && room.danhSachAnhUrl.length > 0 ? (
                <img
                  src={room.danhSachAnhUrl[0]}
                  alt={`${room.tenKieuPhong} - ${room.tenLoaiPhong}`}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Không có hình ảnh</span>
                </div>
              )}


            </div>

            {/* Nội dung card */}
            <div className="p-4">
              {/* Tên hạng phòng */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {room.tenKieuPhong} - {room.tenLoaiPhong}
              </h3>

              {/* Giá */}
              <div className="text-right mb-3">
                {(() => {
                  const displayPrice = getDisplayPrice(room);
                  if (!displayPrice) return null;

                  return (
                    <div>
                      {displayPrice.prefix && (
                        <div className="text-sm text-gray-600 mb-1">{displayPrice.prefix}</div>
                      )}
                      <div className="text-xl font-bold text-blue-600">
                        {formatPrice(displayPrice.price)}
                      </div>
                      <div className="text-xs text-gray-500">{displayPrice.label}</div>
                    </div>
                  );
                })()}
              </div>



              {/* Mô tả ngắn */}
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                {room.moTaKieuPhong}
              </p>

              {/* Tiện nghi */}
              {room.danhSachTienNghi && room.danhSachTienNghi.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.danhSachTienNghi.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border">
                      <AmenityIcon amenity={amenity} className="w-3 h-3" />
                      {amenity.tenTn}
                    </span>
                  ))}
                  {room.danhSachTienNghi.length > 3 && (
                    <span className="text-xs text-gray-500">+{room.danhSachTienNghi.length - 3}</span>
                  )}
                </div>
              )}

              {/* Số phòng trống */}
              <div className="text-green-600 font-medium text-xs mb-3">
                {room.soPhongTrong}/{room.tongSoPhong} phòng trống
              </div>

              {/* Nút action */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                onClick={() => handleViewDetail(room)}
              >
                Xem Chi Tiết & Đặt Phòng
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current page
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Sau
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          searchDates={searchDates}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Detail Modal - 2 Column Layout */}
      {showDetailModal && detailRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {detailRoom.tenKieuPhong} - {detailRoom.tenLoaiPhong}
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailRoom(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="flex h-[calc(90vh-80px)]">
              {/* Left Column - Room Details */}
              <div className="flex-[2] p-6 overflow-y-auto">
                {/* Hero Image */}
                {detailRoom.danhSachAnhUrl && detailRoom.danhSachAnhUrl.length > 0 && (
                  <div className="mb-6">
                    <img
                      src={detailRoom.danhSachAnhUrl[0]}
                      alt={detailRoom.tenKieuPhong}
                      className="w-full h-72 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Room Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Thông tin hạng phòng</h3>
                    <p className="text-gray-600 mb-3">{detailRoom.moTaKieuPhong}</p>
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {detailRoom.soPhongTrong}/{detailRoom.tongSoPhong} phòng trống
                    </div>
                  </div>

                  {/* Amenities */}
                  {detailRoom.danhSachTienNghi && detailRoom.danhSachTienNghi.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Tiện nghi</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {detailRoom.danhSachTienNghi.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <AmenityIcon amenity={amenity} className="w-4 h-4 text-blue-500" showTooltip={true} />
                            <span className="text-sm text-gray-700">{amenity.tenTn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promotions */}
                  {detailRoom.danhSachKhuyenMai && detailRoom.danhSachKhuyenMai.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Khuyến mãi</h3>
                      <div className="space-y-2">
                        {detailRoom.danhSachKhuyenMai.map((promo, idx) => (
                          <div key={idx} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-red-700 font-medium">
                                🎉 {promo.moTaKm}
                              </span>
                              {promo.phanTramGiam && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  -{promo.phanTramGiam}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  {detailRoom.danhSachAnhUrl && detailRoom.danhSachAnhUrl.length > 1 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Hình ảnh khác</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {detailRoom.danhSachAnhUrl.slice(1, 9).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`${detailRoom.tenKieuPhong} - ${index + 2}`}
                            className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Pricing & Booking */}
              <div className="flex-1 bg-gray-50 p-6 flex flex-col min-w-[320px] max-w-[400px]">
                <div className="flex-1">
                  {/* Price Card */}
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Giá hạng phòng</h3>

                    <div className="text-center mb-6">
                      {detailRoom.priceSegments && detailRoom.priceSegments.length > 0 ? (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết giá</h4>
                          <div className="space-y-2">
                            {formatPriceSegments(detailRoom.priceSegments).map((segment, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-left">
                                  <div className="text-sm font-medium text-gray-700">
                                    {segment.formattedDateRange}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {segment.nightsText}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-blue-600">
                                    {segment.formattedPrice}
                                  </div>
                                  <div className="text-xs text-gray-500">/đêm</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {detailRoom.totalPrice && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                  {formatPrice(detailRoom.totalPrice)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : detailRoom.totalPrice ? (
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {formatPrice(detailRoom.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">tổng cộng</div>
                          {detailRoom.averagePrice && (
                            <div className="text-sm text-gray-600">
                              {formatPrice(detailRoom.averagePrice)} / đêm
                            </div>
                          )}
                        </div>
                      ) : detailRoom.giaHienTai ? (
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {formatPrice(detailRoom.giaHienTai)}
                          </div>
                          <div className="text-sm text-gray-500">/ đêm</div>
                        </div>
                      ) : null}
                    </div>

                    {/* Booking Button */}
                    <button
                      onClick={() => {
                        console.log('🔘 Booking button clicked!', { isPublic, detailRoom });
                        setShowDetailModal(false);
                        handleBookRoom(detailRoom);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg shadow-lg"
                    >
                      {!isAuthenticated() ? 'Đăng nhập để đặt phòng' : 'Đặt hạng phòng ngay'}
                    </button>

                    {/* Trust Signals */}
                    <div className="mt-4 space-y-2 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Miễn phí hủy trong 24h</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Xác nhận ngay lập tức</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Thanh toán an toàn</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setDetailRoom(null);
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSearchResult;
