import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calendar, Users, Wifi, Car, Coffee, Dumbbell, MapPin, Phone, Mail, Award, Shield, Clock, Wine, Shirt, UtensilsCrossed, FileText } from 'lucide-react'
import RoomSearch from '../../components/common/RoomSearch'
import RoomSearchResult from '../../components/common/RoomSearchResult'
import { api } from '../../services/api'
import { roomService } from '../../services/roomService'
import { hangPhongService } from '../../services/hangPhongService'
import { promotionService } from '../../services/promotionService'
import toast from 'react-hot-toast'

const HomePage = () => {
  const navigate = useNavigate()
  const searchResultsRef = useRef(null)
  const searchSectionRef = useRef(null)
  const [roomSearchResults, setRoomSearchResults] = useState([])
  const [searchDates, setSearchDates] = useState({
    checkIn: null,
    checkOut: null
  })
  const [prefilledRoomData, setPrefilledRoomData] = useState(null)
  const [showPrefilledNotification, setShowPrefilledNotification] = useState(false)
  const [showGuidance, setShowGuidance] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Function to scroll to search section
  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  // Handle URL hash for scrolling to search section
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#search') {
        setTimeout(() => {
          scrollToSearch()
        }, 100)
      }
    }

    // Check hash on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Load saved search results when component mounts
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem('homeSearchData')
    if (savedSearchData) {
      try {
        const parsedData = JSON.parse(savedSearchData)
        setRoomSearchResults(parsedData.results || [])

        // Convert date strings back to Date objects
        const savedSearchDates = parsedData.searchDates || { checkIn: null, checkOut: null }
        const convertedSearchDates = {
          checkIn: savedSearchDates.checkIn ? new Date(savedSearchDates.checkIn) : null,
          checkOut: savedSearchDates.checkOut ? new Date(savedSearchDates.checkOut) : null
        }
        setSearchDates(convertedSearchDates)
      } catch (error) {
        console.error('Error loading saved search data:', error)
      }
    }
  }, [])

  const handleSearchResult = (results, searchData) => {
    setRoomSearchResults(results)

    // Lưu thông tin ngày tìm kiếm
    const newSearchDates = searchData ? {
      checkIn: searchData.startDate,
      checkOut: searchData.endDate
    } : { checkIn: null, checkOut: null }

    setSearchDates(newSearchDates)

    // Save search data to sessionStorage
    const searchDataToSave = {
      results: results,
      searchDates: newSearchDates
    }
    sessionStorage.setItem('homeSearchData', JSON.stringify(searchDataToSave))

    // Scroll xuống kết quả tìm kiếm sau một khoảng thời gian ngắn
    setTimeout(() => {
      if (searchResultsRef.current && results.length > 0) {
        searchResultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  // Handle featured room booking - scroll to search section and prefill data
  const handleFeaturedRoomBooking = (room) => {
    console.log('🚀 handleFeaturedRoomBooking called with room:', room)

    // Set prefilled data for the search form
    const prefilledData = {
      kieuPhong: room.type,
      loaiPhong: room.category
    }
    setPrefilledRoomData(prefilledData)

    console.log('📦 Set prefilled data:', prefilledData)
    console.log('📍 Scrolling to search section...')

    // Scroll to search section
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }

    // Show notification after scroll
    setTimeout(() => {
      setShowPrefilledNotification(true)
      // Auto hide notification after 8 seconds
      setTimeout(() => {
        setShowPrefilledNotification(false)
      }, 8000)
    }, 800) // Wait for scroll to complete
  }

  const [featuredRooms, setFeaturedRooms] = useState([])
  const [allHotRooms, setAllHotRooms] = useState([])
  const [showAllHotRooms, setShowAllHotRooms] = useState(false)

  useEffect(() => {
    fetchFeaturedRooms()
  }, [])

  const fetchFeaturedRooms = async () => {
    try {
      console.log('🔄 Fetching featured rooms...')
      // Gọi API để lấy TOP 3 hạng phòng hot nhất trong tháng từ stored procedure
      const response = await hangPhongService.getHotHangPhongThisMonth()
      console.log('📡 API response:', response)
      if (response.statusCode === 200 && response.hotHangPhongList) {
        // Map dữ liệu hạng phòng thành format hiển thị
        const featured = response.hotHangPhongList.map(hangPhong => ({
          id: hangPhong.idHangPhong,
          name: `${hangPhong.tenKp} - ${hangPhong.tenLp}`,
          type: hangPhong.tenKp || 'Standard',
          category: hangPhong.tenLp || 'Single',
          price: hangPhong.giaHienTai || 1000000,
          image: hangPhong.urlAnhDaiDien || '/api/placeholder/400/300',
          amenities: hangPhong.danhSachTienNghi || [], // Lấy tiện nghi từ API
          description: hangPhong.moTaKieuPhong || '', // Mô tả kiểu phòng từ API
          soLuotThue: hangPhong.soLuotThue || 0
        }))
        console.log('✅ Featured rooms from API:', featured)
        setAllHotRooms(featured) // Lưu tất cả phòng hot
        setFeaturedRooms(featured.slice(0, 3)) // Chỉ hiển thị 3 phòng đầu tiên
      } else {
        console.log('⚠️ No API data, using fallback')
        // Fallback data nếu API không có dữ liệu
        setFeaturedRooms([
          {
            id: 1,
            name: 'Standard - Single',
            type: 'Standard',
            category: 'Single',
            price: 1100000,

            image: '/api/placeholder/400/300',
            amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Minibar'],
            description: 'Phòng Standard với tiện nghi hiện đại và dịch vụ chất lượng cao',
            soLuotThue: 15
          },
          {
            id: 2,
            name: 'Standard - Double',
            type: 'Standard',
            category: 'Double',
            price: 1300000,
            image: '/api/placeholder/400/300',
            amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Minibar'],
            description: 'Phòng Standard với tiện nghi hiện đại và dịch vụ chất lượng cao',
            soLuotThue: 12
          },
          {
            id: 3,
            name: 'Superior - Double',
            type: 'Superior',
            category: 'Double',
            price: 1500000,
            image: '/api/placeholder/400/300',
            amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Minibar'],
            description: 'Phòng Superior với tiện nghi hiện đại và dịch vụ chất lượng cao',
            soLuotThue: 10
          }
        ])
        console.log('📋 Using fallback featured rooms')
      }
    } catch (error) {
      console.error('❌ Error fetching hot hang phong:', error)
      // Fallback to empty array if API fails
      setFeaturedRooms([])
    }
  }

  // Convert featured rooms data to RoomSearchResult format
  const convertToSearchResultFormat = (rooms) => {
    console.log('🔄 Converting rooms to search result format:', rooms)
    return rooms.map(room => {
      console.log('🔍 Converting room:', room)
      const converted = {
        idHangPhong: room.id || Math.floor(Math.random() * 10) + 1, // Use room.id or generate random for demo
        tenKieuPhong: room.type,
        tenLoaiPhong: room.category,
        moTaKieuPhong: room.description,
        giaHienTai: room.price,
        totalPrice: room.price * 2, // Giả sử 2 đêm
        averagePrice: room.price,
        soPhongTrong: Math.floor(Math.random() * 8) + 1, // Random cho demo
        tongSoPhong: Math.floor(Math.random() * 5) + 8,
        danhSachTienNghi: room.amenities || [],
        danhSachAnhUrl: [room.image],
        danhSachKhuyenMai: []
      }
      console.log('✅ Converted room:', converted)
      return converted
    })
  }

  // Handle show all hot rooms
  const handleShowAllHotRooms = () => {
    setShowAllHotRooms(true)
    console.log('🔄 Showing all hot rooms:', allHotRooms.length)
  }

  const handleShowLessHotRooms = () => {
    setShowAllHotRooms(false)
    console.log('🔄 Showing top 3 hot rooms')
  }

  const [services, setServices] = useState([])

  useEffect(() => {
    fetchServices()
  }, [])

  // Hàm để lấy icon phù hợp cho từng dịch vụ
  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase()
    if (name.includes('minibar') || name.includes('mini bar')) return Wine
    if (name.includes('giặt') || name.includes('ủi') || name.includes('laundry')) return Shirt
    if (name.includes('ẩm thực') || name.includes('restaurant') || name.includes('meal')) return UtensilsCrossed
    if (name.includes('điện thoại') || name.includes('phone')) return Phone
    if (name.includes('fax') || name.includes('gửi fax')) return FileText
    if (name.includes('wifi') || name.includes('internet')) return Wifi
    if (name.includes('gym') || name.includes('thể thao')) return Dumbbell
    if (name.includes('coffee') || name.includes('cà phê')) return Coffee
    if (name.includes('xe') || name.includes('car') || name.includes('parking')) return Car
    return Award // Default icon cho các dịch vụ khác
  }

  const fetchServices = async () => {
    try {
      // Gọi API để lấy danh sách dịch vụ
      const response = await api.get('/api/services/dich-vu')
      const dichVuList = response.data.dichVuList || []

      // Convert to homepage format
      const servicesData = dichVuList.slice(0, 6).map(dv => ({
        icon: getServiceIcon(dv.tenDv),
        title: dv.tenDv,
        description: dv.moTa || 'Dịch vụ chất lượng cao'
      }))

      setServices(servicesData)
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to default services if API fails
      setServices([
        {
          icon: Wifi,
          title: 'Wifi miễn phí',
          description: 'Kết nối internet tốc độ cao trong toàn bộ khách sạn'
        },
        {
          icon: Car,
          title: 'Bãi đỗ xe',
          description: 'Bãi đỗ xe rộng rãi, an toàn cho khách hàng'
        },
        {
          icon: UtensilsCrossed,
          title: 'Nhà hàng',
          description: 'Nhà hàng phục vụ các món ăn ngon, đa dạng'
        },
        {
          icon: Dumbbell,
          title: 'Phòng gym',
          description: 'Phòng tập gym hiện đại với đầy đủ thiết bị'
        },
        {
          icon: Wine,
          title: 'Minibar',
          description: 'Đồ uống và snack cao cấp trong phòng'
        },
        {
          icon: Award,
          title: 'Dịch vụ cao cấp',
          description: 'Các dịch vụ chăm sóc khách hàng chuyên nghiệp'
        }
      ])
    }
  }

  // Handle newsletter subscription
  const handleNewsletterSubscription = async (e) => {
    e.preventDefault()

    if (!newsletterEmail) {
      toast.error('Vui lòng nhập email')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      toast.error('Email không hợp lệ')
      return
    }

    setIsSubscribing(true)
    try {
      const response = await promotionService.subscribeToPromotions(newsletterEmail)

      if (response.statusCode === 200) {
        toast.success(response.message)
        setNewsletterEmail('') // Clear email input
      } else if (response.statusCode === 400) {
        // Email validation error
        toast.error(response.message)
      } else {
        toast.error(response.message || 'Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Có lỗi xảy ra khi đăng ký')
      }
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/home.webp"
            alt="Hotel Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
              Khách Sạn Sang Trọng
              <span className="block text-3xl md:text-5xl text-yellow-400 mt-2">
                Trải Nghiệm Đẳng Cấp
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Chào mừng bạn đến với không gian nghỉ dưỡng tuyệt vời, nơi sự thoải mái
              và dịch vụ chất lượng cao hòa quyện cùng thiết kế hiện đại
            </p>

            {/* Prefilled Notification Banner */}
            {showPrefilledNotification && (
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl p-6 shadow-2xl max-w-7xl mx-auto mb-6 animate-fadeInUp relative">
                <button
                  onClick={() => setShowPrefilledNotification(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl font-bold"
                >
                  ×
                </button>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">🎯 Đã tự động điền thông tin phòng!</h4>
                    <p className="text-green-100">
                      <strong>Kiểu phòng</strong> và <strong>loại phòng</strong> đã được điền sẵn. Vui lòng chọn <strong>ngày nhận phòng</strong> và <strong>ngày trả phòng</strong> để tìm kiếm.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-7xl mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}} ref={searchSectionRef} data-search-section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Tìm Kiếm Phòng Lý Tưởng
              </h3>
              <RoomSearch
                handleSearchResult={handleSearchResult}
                prefilledData={prefilledRoomData}
                onDataUsed={() => setPrefilledRoomData(null)}
              />
            </div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {roomSearchResults.length > 0 && (
        <section className="py-16 bg-gray-50" ref={searchResultsRef}>
          <div className="container">
            <RoomSearchResult searchResults={roomSearchResults} searchDates={searchDates} />
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Về Khách Sạn Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào mang đến
                cho quý khách những trải nghiệm nghỉ dưỡng đẳng cấp nhất. Từ thiết kế nội thất
                sang trọng đến dịch vụ chu đáo, mọi chi tiết đều được chăm chút tỉ mỉ.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Award className="w-6 h-6 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Chất lượng 5 sao</h4>
                    <p className="text-gray-600 text-sm">Được chứng nhận bởi các tổ chức uy tín</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">An toàn tuyệt đối</h4>
                    <p className="text-gray-600 text-sm">Hệ thống bảo mật hiện đại</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phục vụ 24/7</h4>
                    <p className="text-gray-600 text-sm">Luôn sẵn sàng hỗ trợ quý khách</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <MapPin className="w-6 h-6 text-rose-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Vị trí đắc địa</h4>
                    <p className="text-gray-600 text-sm">Trung tâm thành phố, giao thông thuận lợi</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/abouthotel.jpg"
                alt="Hotel Interior"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hạng Phòng Hot Trong Tháng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top 3 hạng phòng được khách hàng yêu thích và đặt nhiều nhất trong tháng
            </p>
          </div>

          {/* Hiển thị phòng hot */}
          <div className={`transition-all duration-500 ease-in-out ${showAllHotRooms ? 'opacity-100' : 'opacity-100'}`}>
            {!showAllHotRooms ? (
              // Hiển thị 3 phòng hot nhất
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                {featuredRooms.map((room, index) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-fadeInUp" style={{animationDelay: `${0.1 * index}s`}}>
                {/* Hình ảnh */}
                <div className="relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-56 object-cover"
                  />
                  {/* Hot Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    🔥 HOT
                  </div>
                </div>

                {/* Nội dung card */}
                <div className="p-4">
                  {/* Tên hạng phòng */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {room.name}
                  </h3>

                  {/* Giá */}
                  <div className="text-right mb-3">
                    <div className="text-xl font-bold text-blue-600">
                      {room.price?.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-xs text-gray-500">/đêm</div>
                  </div>

                  {/* Lượt thuê/đặt */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-semibold">
                      🔥 {room.soLuotThue} lượt thuê/đặt
                    </span>
                  </div>

                  {/* Mô tả kiểu phòng */}
                  {room.description && (
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  {/* Tiện nghi */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border">
                          {amenity.tenTn}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Nút action */}
                  <button
                    onClick={() => {
                      console.log('🔘 Button clicked for room:', room)
                      handleFeaturedRoomBooking(room)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Chọn thời gian và đặt phòng
                  </button>
                </div>
              </div>
                ))}
              </div>
            ) : (
              // Hiển thị tất cả phòng hot với phân trang
              <div className="animate-fadeIn">
                <RoomSearchResult
                  searchResults={convertToSearchResultFormat(allHotRooms)}
                  searchDates={{}}
                  isPublic={true}
                />
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            {!showAllHotRooms ? (
              <button
                onClick={handleShowAllHotRooms}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Xem Tất Cả Hạng Phòng
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleShowLessHotRooms}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white rounded-xl font-semibold transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Thu Gọn (Chỉ Hiển Thị Top 3)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch Vụ Đẳng Cấp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những tiện ích và dịch vụ cao cấp được thiết kế để mang lại trải nghiệm hoàn hảo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="group text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Sẵn Sàng Đặt Phòng?
              </h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt phòng với giá tốt nhất.
                Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ bạn 24/7.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Hotline</div>
                    <div className="text-primary-100">1900 1234 (24/7)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-primary-100">booking@hotel.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Địa chỉ</div>
                    <div className="text-primary-100">97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Đặt Phòng Ngay</h3>
              <div className="space-y-4">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-xl transition-colors duration-200 btn-glow">
                  Gọi Ngay: 1900 1234
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white text-white font-semibold py-4 rounded-xl transition-all duration-200 btn-glow">
                  Chat Trực Tuyến
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Ưu Đãi</h2>
            <p className="text-gray-400 mb-8">
              Nhận thông tin về các chương trình khuyến mãi và ưu đãi đặc biệt từ chúng tôi
            </p>
            <form onSubmit={handleNewsletterSubscription} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors duration-200 btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Đang xử lý...' : 'Đăng Ký'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
