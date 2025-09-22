import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomService } from '../../services/roomService';
import { formatDateToYMD } from '../../utils/dateUtils';

// CSS cho dual range slider và DatePicker
const sliderStyles = `
  .dual-range-slider {
    position: relative;
    height: 40px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    min-width: 120px;
  }

  /* DatePicker styles */
  .react-datepicker-wrapper {
    width: 100% !important;
  }

  .react-datepicker__input-container {
    width: 100% !important;
  }

  .react-datepicker__input-container input {
    width: 100% !important;
    min-width: 180px !important;
    padding: 12px !important;
    border: 1px solid #d1d5db !important;
    border-radius: 8px !important;
    font-size: 16px !important;
    height: 48px !important;
    box-sizing: border-box !important;
    background-color: white !important;
    color: #374151 !important;
  }

  .react-datepicker__input-container input::placeholder {
    color: #9ca3af !important;
    opacity: 1 !important;
  }

  .react-datepicker__input-container input:focus {
    outline: none !important;
    border-color: #3B82F6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }

  .react-datepicker {
    z-index: 9999 !important;
  }

  /* Responsive styles for mobile */
  @media (max-width: 768px) {
    .react-datepicker__input-container input {
      min-width: 100% !important;
      font-size: 16px !important;
    }
  }

  .dual-range-slider .slider-track {
    position: absolute;
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  .dual-range-slider .slider-range {
    position: absolute;
    height: 6px;
    background: linear-gradient(to right, #3B82F6, #10B981);
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .dual-range-slider input[type="range"] {
    position: absolute;
    width: 100%;
    height: 6px;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    pointer-events: none;
    outline: none;
    top: 50%;
    transform: translateY(-50%);
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb {
    pointer-events: all;
    position: relative;
    z-index: 10;
  }

  .dual-range-slider input[type="range"]::-moz-range-thumb {
    pointer-events: all;
    position: relative;
    z-index: 10;
  }

  .dual-range-slider input[type="range"]::-webkit-slider-track {
    background: transparent;
    border: none;
    height: 6px;
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
    position: relative;
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563EB;
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.15);
  }

  .dual-range-slider input[type="range"]::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
    -moz-appearance: none;
  }

  .dual-range-slider input[type="range"]::-moz-range-thumb:hover {
    background: #2563EB;
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
  }

  .dual-range-slider input[type="range"]::-moz-range-track {
    background: transparent;
    border: none;
    height: 6px;
  }

  .dual-range-slider input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .dual-range-slider .range-min::-webkit-slider-thumb {
    background: #10B981;
  }

  .dual-range-slider .range-min::-webkit-slider-thumb:hover {
    background: #059669;
  }

  .dual-range-slider .range-min::-moz-range-thumb {
    background: #10B981;
  }

  .dual-range-slider .range-min::-moz-range-thumb:hover {
    background: #059669;
  }

  .dual-range-slider .range-max::-webkit-slider-thumb {
    background: #EF4444;
  }

  .dual-range-slider .range-max::-webkit-slider-thumb:hover {
    background: #DC2626;
  }

  .dual-range-slider .range-max::-moz-range-thumb {
    background: #EF4444;
  }

  .dual-range-slider .range-max::-moz-range-thumb:hover {
    background: #DC2626;
  }

  /* Đảm bảo slider min có z-index thấp hơn */
  .dual-range-slider .range-min {
    z-index: 3;
  }

  /* Đảm bảo slider max có z-index cao hơn */
  .dual-range-slider .range-max {
    z-index: 5;
  }

  /* Khi giá trị min gần bằng max, ưu tiên max slider */
  .dual-range-slider .range-max::-webkit-slider-thumb {
    z-index: 6;
  }

  .dual-range-slider .range-max::-moz-range-thumb {
    z-index: 6;
  }

  /* Tooltip cho slider */
  .dual-range-slider input[type="range"]:hover::-webkit-slider-thumb::after {
    content: attr(data-value);
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const RoomSearch = ({ handleSearchResult, prefilledData, onDataUsed }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Giá từ 0 đến 10 triệu VND
  const [selectedKieuPhong, setSelectedKieuPhong] = useState(''); // Kiểu phòng filter
  const [selectedLoaiPhong, setSelectedLoaiPhong] = useState(''); // Loại phòng filter
  const [kieuPhongList, setKieuPhongList] = useState([]); // Danh sách kiểu phòng
  const [loaiPhongList, setLoaiPhongList] = useState([]); // Danh sách loại phòng
  const [error, setError] = useState('');
  const [activeSlider, setActiveSlider] = useState(null); // Track which slider is being dragged

  // Load danh sách kiểu phòng và loại phòng khi component mount
  useEffect(() => {
    const loadRoomTypesAndCategories = async () => {
      try {
        // Load kiểu phòng
        const kieuPhongResponse = await roomService.getAllRoomTypes();
        if (kieuPhongResponse.statusCode === 200) {
          setKieuPhongList(kieuPhongResponse.kieuPhongList || []);
        }

        // Load loại phòng
        const loaiPhongResponse = await roomService.getAllRoomCategories();
        if (loaiPhongResponse.statusCode === 200) {
          setLoaiPhongList(loaiPhongResponse.loaiPhongList || []);
        }
      } catch (error) {
        console.error('Error loading room types and categories:', error);
      }
    };

    loadRoomTypesAndCategories();
  }, []);

  // Handle prefilled data from featured rooms
  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.kieuPhong) {
        setSelectedKieuPhong(prefilledData.kieuPhong);
      }
      if (prefilledData.loaiPhong) {
        setSelectedLoaiPhong(prefilledData.loaiPhong);
      }
      // Call onDataUsed to clear the prefilled data
      if (onDataUsed) {
        onDataUsed();
      }
    }
  }, [prefilledData, onDataUsed]);

  // Tính toán vị trí và độ rộng của thanh khoảng giá
  const getSliderStyle = () => {
    const min = 0;
    const max = 10000000;
    const leftPercent = ((priceRange[0] - min) / (max - min)) * 100;
    const rightPercent = ((priceRange[1] - min) / (max - min)) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${rightPercent - leftPercent}%`
    };
  };

  // Inject CSS styles for dual range slider
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = sliderStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  /**This methods is going to be used to show errors */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  /**THis is going to be used to fetch avaailabe rooms from database base on seach data that'll be passed in */
  const handleInternalSearch = async () => {
    if (!startDate || !endDate) {
      showError('Vui lòng chọn ngày nhận phòng và ngày trả phòng');
      return false;
    }

    if (startDate >= endDate) {
      showError('Ngày trả phòng phải sau ngày nhận phòng');
      return false;
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      showError('Ngày nhận phòng không thể là ngày trong quá khứ');
      return false;
    }

    if (priceRange[0] >= priceRange[1]) {
      showError('Khoảng giá không hợp lệ');
      return false;
    }
    try {
      // Convert startDate to the desired format (avoid timezone issues)
      const formattedStartDate = formatDateToYMD(startDate);
      const formattedEndDate = formatDateToYMD(endDate);

      // Debug: Log search parameters
      console.log('Search parameters being sent to API:', {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        checkIn: formattedStartDate,
        checkOut: formattedEndDate,
        kieuPhong: selectedKieuPhong,
        loaiPhong: selectedLoaiPhong
      });

      // Call the API to fetch available rooms by price range and filters
      const response = await roomService.searchRoomsByPriceRange(
        formattedStartDate,
        formattedEndDate,
        priceRange[0],
        priceRange[1],
        selectedKieuPhong,
        selectedLoaiPhong
      );

      // Check if the response is successful
      if (response.statusCode === 200) {
        // Debug: Log the actual data received from API
        console.log('API Response Data:', response.availableRoomsByHangPhongList);

        if (response.availableRoomsByHangPhongList && response.availableRoomsByHangPhongList.length === 0) {
          showError('Không có phòng trống trong khoảng thời gian và mức giá này.');
          return
        }
        handleSearchResult(response.availableRoomsByHangPhongList || [], {
          startDate,
          endDate,
          priceRange,
          kieuPhong: selectedKieuPhong,
          loaiPhong: selectedLoaiPhong
        });
        setError('');
      }
    } catch (error) {
      showError("Có lỗi xảy ra: " + (error.message || 'Không thể tìm kiếm phòng'));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="space-y-4">
        {/* Hàng 1: Ngày nhận phòng, Ngày trả phòng và Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận phòng</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày nhận phòng"
              className="w-full"
              minDate={new Date()}
              showPopperArrow={false}
              popperPlacement="bottom-start"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả phòng</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày trả phòng"
              className="w-full"
              minDate={startDate || new Date()}
              showPopperArrow={false}
              popperPlacement="bottom-start"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </label>
            <div className="px-1" style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
              <div className="dual-range-slider" style={{ width: '100%' }}>
                {/* Track nền */}
                <div className="slider-track"></div>

                {/* Thanh hiển thị khoảng giá được chọn */}
                <div
                  className="slider-range"
                  style={getSliderStyle()}
                ></div>

                {/* Input slider cho giá tối thiểu */}
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="500000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    // Đảm bảo min không vượt quá max - 500000 (1 step)
                    const maxAllowed = priceRange[1] - 500000;
                    const finalMin = Math.min(newMin, maxAllowed);
                    setPriceRange([finalMin, priceRange[1]]);
                  }}
                  onMouseDown={() => setActiveSlider('min')}
                  onMouseUp={() => setActiveSlider(null)}
                  onTouchStart={() => setActiveSlider('min')}
                  onTouchEnd={() => setActiveSlider(null)}
                  className="range-min"
                  style={{
                    zIndex: activeSlider === 'min' ? 6 : (priceRange[0] > priceRange[1] - 1000000 ? 5 : 3)
                  }}
                />

                {/* Input slider cho giá tối đa */}
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="500000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    // Đảm bảo max không nhỏ hơn min + 500000 (1 step)
                    const minAllowed = priceRange[0] + 500000;
                    const finalMax = Math.max(newMax, minAllowed);
                    setPriceRange([priceRange[0], finalMax]);
                  }}
                  onMouseDown={() => setActiveSlider('max')}
                  onMouseUp={() => setActiveSlider(null)}
                  onTouchStart={() => setActiveSlider('max')}
                  onTouchEnd={() => setActiveSlider(null)}
                  className="range-max"
                  style={{ zIndex: activeSlider === 'max' ? 6 : 5 }}
                />
              </div>
            </div>

            {/* Hiển thị giá trị min/max */}
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
              <span>0đ</span>
              <span>10 triệu</span>
            </div>
          </div>
        </div>

        {/* Hàng 2: Kiểu phòng, Loại phòng và Nút tìm */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kiểu phòng</label>
            <select
              value={selectedKieuPhong}
              onChange={(e) => setSelectedKieuPhong(e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">Tất cả</option>
              {kieuPhongList.map((kp) => (
                <option key={kp.idKp} value={kp.tenKp}>
                  {kp.tenKp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
            <select
              value={selectedLoaiPhong}
              onChange={(e) => setSelectedLoaiPhong(e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="">Tất cả</option>
              {loaiPhongList.map((lp) => (
                <option key={lp.idLp} value={lp.tenLp}>
                  {lp.tenLp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button className="btn-primary w-full h-12 text-lg font-semibold" onClick={handleInternalSearch}>
              Tìm phòng
            </button>
          </div>
        </div>

      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );

};

export default RoomSearch;
