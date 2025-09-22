import React, { useState, useEffect } from 'react'
import { UserPlus, Save, X, MapPin, Calendar, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { customerService } from '../../services/customerService'
import { rentalService } from '../../services/rentalService'
import { roomService } from '../../services/roomService'
import { bookingService } from '../../services/bookingService'
import { hangPhongService } from '../../services/hangPhongService'
import { employeeService } from '../../services/employeeService'
import { useAuth } from '../../contexts/AuthContext'
import RoomMap from '../../components/staff/RoomMap'

const WalkInCheckIn = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Helper function to decode JWT token
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }

  // Helper function to get employee ID
  const getEmployeeId = async () => {
    if (!user) return null
    // Try different possible employee ID fields first
    let employeeId = user?.id ||
                     user?.idNv ||
                     user?.maNhanVien ||
                     user?.nhanVien?.idNv ||
                     user?.nhanVien?.maNhanVien ||
                     user?.nhanVien?.id ||
                     user?.userId ||
                     user?.employeeId

    if (employeeId) {
      return employeeId
    }

    // Try to get email from JWT token and fetch employee data
    let email = user?.email

    if (!email && user?.token) {
      const decoded = decodeJWT(user.token)
      email = decoded?.sub
    }

    if (!email) {
      const token = localStorage.getItem('token')
      if (token) {
        const decoded = decodeJWT(token)
        email = decoded?.sub
      }
    }

    if (email) {
      try {
        const response = await employeeService.getEmployeeByEmail(email)

        if (response.statusCode === 200 && response.nhanVien) {
          const employee = response.nhanVien
          employeeId = employee.idNv || employee.maNhanVien || employee.id

          // Update user context with employee data
          if (user && typeof user === 'object') {
            Object.assign(user, {
              id: employeeId,
              idNv: employee.idNv,
              maNhanVien: employee.maNhanVien,
              hoTen: employee.hoTen || employee.tenNhanVien || user.hoTen,
              soDienThoai: employee.soDienThoai || user.soDienThoai,
              diaChi: employee.diaChi || user.diaChi,
              employeeData: employee
            })
          }

          return employeeId
        }
      } catch (error) {
        console.error('Error fetching employee data:', error)
      }
    }

    // Use email as fallback ID if nothing else works
    if (!employeeId && email) {
      employeeId = email.replace('@hotel.com', '').replace('@', '_')
    }

    return employeeId
  }
  
  // Main option selection
  const [selectedOption, setSelectedOption] = useState('') // 'booking', 'rental', or 'customer'

  // Customer data
  const [customerData, setCustomerData] = useState({
    cccd: '',
    ho: '',
    ten: '',
    email: '',
    sdt: '',
    diaChi: ''
  })
  
  // Rental data (for immediate rental)
  const [rentalData, setRentalData] = useState({
    ngayDen: new Date().toISOString().split('T')[0],
    ngayDi: '',
    soLuongPhong: 1
  })
  
  // Booking data (for reception booking)
  const [bookingData, setBookingData] = useState({
    ngayBdThue: '',
    ngayDi: '',
    idKp: '',
    idLp: '',
    soLuongPhongO: 1, 
    tienDatCoc: '',
    ghiChu: ''
  })

  // Room pricing data
  const [roomPricing, setRoomPricing] = useState({
    roomPrice: 0,
    minDeposit: 0,
    pricePerRoom: 0,
    depositPerRoom: 0,
    numberOfNights: 0,
    totalRoomPrice: 0
  })
  
  // Room selection (only for rental)
  const [selectedRoom, setSelectedRoom] = useState(null) // For single room selection (if needed)
  const [selectedRooms, setSelectedRooms] = useState([]) // For multiple room selection
  const [showRoomMap, setShowRoomMap] = useState(false)
  const [roomDetails, setRoomDetails] = useState(null)
  
  // Filter options for room map
  const [roomFilters, setRoomFilters] = useState({
    idKp: '',
    idLp: ''
  })
  
  // Room types data
  const [roomTypes, setRoomTypes] = useState([])
  const [roomCategories, setRoomCategories] = useState([])

  // Available rooms notification state
  const [availableRoomsInfo, setAvailableRoomsInfo] = useState(null)
  const [loadingAvailableRooms, setLoadingAvailableRooms] = useState(false)

  // Load room types and categories on component mount
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        // Load room types (KieuPhong)
        const typesResponse = await roomService.getAllRoomTypes()
        if (typesResponse.statusCode === 200) {
          setRoomTypes(typesResponse.kieuPhongList || [])
        }
        
        // Load room categories (LoaiPhong)
        const categoriesResponse = await roomService.getAllRoomCategories()
        if (categoriesResponse.statusCode === 200) {
          setRoomCategories(categoriesResponse.loaiPhongList || [])
        }
      } catch (error) {
        console.error('Error loading room data:', error)
      }
    }
    
    loadRoomData()

  }, [])

  // Auto-fetch room price when all required fields are available
  useEffect(() => {
    if (bookingData.idKp && bookingData.idLp && bookingData.soLuongPhongO) {
      fetchRoomPrice(bookingData.idKp, bookingData.idLp, bookingData.soLuongPhongO)
    }
  }, [bookingData.idKp, bookingData.idLp, bookingData.soLuongPhongO, bookingData.ngayBdThue, bookingData.ngayDi])

  // Auto-check available rooms for booking when dates are selected (with optional filters)
  useEffect(() => {
    if (selectedOption === 'booking' && bookingData.ngayBdThue && bookingData.ngayDi) {
      checkAvailableRooms(bookingData.ngayBdThue, bookingData.ngayDi, bookingData.idKp, bookingData.idLp)
    }
  }, [selectedOption, bookingData.ngayBdThue, bookingData.ngayDi, bookingData.idKp, bookingData.idLp])

  // Auto-check available rooms for rental when dates are selected (with optional filters)
  useEffect(() => {
    if (selectedOption === 'rental' && rentalData.ngayDen && rentalData.ngayDi) {
      checkAvailableRooms(rentalData.ngayDen, rentalData.ngayDi, roomFilters.idKp, roomFilters.idLp)
    }
  }, [selectedOption, rentalData.ngayDen, rentalData.ngayDi, roomFilters.idKp, roomFilters.idLp])

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRentalDataChange = (field, value) => {
    setRentalData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset room selection when number of rooms changes
    if (field === 'soLuongPhong') {
      setSelectedRooms([])
    }
  }

  const handleBookingDataChange = async (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))

    // If kiểu phòng, loại phòng, or số lượng phòng changes, fetch room price
    if (field === 'idKp' || field === 'idLp' || field === 'soLuongPhongO') {
      const updatedData = { ...bookingData, [field]: value }
      if (updatedData.idKp && updatedData.idLp && updatedData.soLuongPhongO) {
        await fetchRoomPrice(updatedData.idKp, updatedData.idLp, updatedData.soLuongPhongO)
      }
    }
  }

  // Fetch room price and calculate minimum deposit
  const fetchRoomPrice = async (idKp, idLp, soLuongPhongO = 1) => {
    try {
      const response = await hangPhongService.getRoomPriceByKieuAndLoai(idKp, idLp)
      if (response.statusCode === 200) {
        // Calculate number of nights
        const numberOfNights = bookingData.ngayBdThue && bookingData.ngayDi
          ? Math.ceil((new Date(bookingData.ngayDi) - new Date(bookingData.ngayBdThue)) / (1000 * 60 * 60 * 24))
          : 1

        // Calculate total room price (price per room per night × number of nights × number of rooms)
        const totalRoomPrice = response.roomPrice * numberOfNights * soLuongPhongO

        // Calculate minimum deposit (20% of total room price)
        const totalMinDeposit = Math.round(totalRoomPrice * 0.2)

        setRoomPricing({
          roomPrice: response.roomPrice,
          minDeposit: totalMinDeposit,
          pricePerRoom: response.roomPrice,
          depositPerRoom: Math.round(response.roomPrice * numberOfNights * 0.2), // 20% of total price per room
          numberOfNights: numberOfNights,
          totalRoomPrice: totalRoomPrice
        })

        // Auto-fill minimum deposit if current deposit is less than minimum
        if (!bookingData.tienDatCoc || parseFloat(bookingData.tienDatCoc) < totalMinDeposit) {
          setBookingData(prev => ({
            ...prev,
            tienDatCoc: totalMinDeposit.toString()
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching room price:', error)
      toast.error('Không thể lấy thông tin giá phòng')
    }
  }

  const handleRoomFilterChange = (field, value) => {
    const updatedFilters = {
      ...roomFilters,
      [field]: value
    }

    setRoomFilters(updatedFilters)

    // Auto-check available rooms when filters change (for rental)
    if (selectedOption === 'rental' && rentalData.ngayDen && rentalData.ngayDi && (updatedFilters.idKp || updatedFilters.idLp)) {
      checkAvailableRooms(rentalData.ngayDen, rentalData.ngayDi, updatedFilters.idKp, updatedFilters.idLp)
    }
  }

  const validateCustomerForm = () => {
    // Chỉ yêu cầu CCCD và SĐT cho walk-in check-in
    if (!customerData.cccd || !customerData.cccd.trim()) {
      toast.error('Vui lòng nhập CCCD')
      return false
    }
    if (!customerData.sdt || !customerData.sdt.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return false
    }
    return true
  }

  // Tự động tìm khách hàng khi nhập CCCD
  const handleCccdChange = async (cccd) => {
    setCustomerData(prev => ({ ...prev, cccd }))

    if (cccd && cccd.trim().length >= 9) { // CCCD có ít nhất 9 số
      try {
        const response = await customerService.getCustomerById(cccd.trim())
        if (response.statusCode === 200 && response.khachHang) {
          const customer = response.khachHang
          // Tự động điền thông tin khách hàng đã có
          setCustomerData(prev => ({
            ...prev,
            cccd: customer.cccd,
            ho: customer.ho || '',
            ten: customer.ten || '',
            email: customer.email || '',
            sdt: customer.sdt || prev.sdt, // Giữ SĐT hiện tại nếu đang nhập mới
            diaChi: customer.diaChi || ''
          }))
          toast.success(`Đã tìm thấy khách hàng: ${customer.ho} ${customer.ten}`)
        }
      } catch (error) {
        // Không hiển thị lỗi nếu không tìm thấy khách hàng
        console.log('Customer not found:', error)
      }
    }
  }

  // Function to check available rooms and show notification
  const checkAvailableRooms = async (checkIn, checkOut, idKp = '', idLp = '') => {
    // Only check if we have both dates
    if (!checkIn || !checkOut) {
      setAvailableRoomsInfo(null)
      return
    }

    try {
      setLoadingAvailableRooms(true)
      const response = await roomService.getAvailableRoomsForStaff(checkIn, checkOut)

      if (response.statusCode === 200 && response.availableRoomsByHangPhongList) {
        // Filter by room type and category if specified
        let filteredRooms = response.availableRoomsByHangPhongList

        if (idKp || idLp) {
          const selectedRoomType = roomTypes.find(rt => rt.idKp === idKp)
          const selectedRoomCategory = roomCategories.find(rc => rc.idLp === idLp)

          filteredRooms = response.availableRoomsByHangPhongList.filter(room => {
            const matchKp = !idKp || room.tenKieuPhong === selectedRoomType?.tenKp
            const matchLp = !idLp || room.tenLoaiPhong === selectedRoomCategory?.tenLp
            return matchKp && matchLp
          })
        }

        setAvailableRoomsInfo(filteredRooms)
      } else {
        setAvailableRoomsInfo([])
      }
    } catch (error) {
      console.error('Error checking available rooms:', error)
      setAvailableRoomsInfo(null)
    } finally {
      setLoadingAvailableRooms(false)
    }
  }

  const validateRentalForm = async () => {
    if (!validateCustomerForm()) return false
    
    if (!rentalData.ngayDi) {
      toast.error('Vui lòng chọn ngày check-out')
      return false
    }
    // Validate room selection
    if (selectedRooms.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phòng')
      return false
    }

    if (selectedRooms.length !== rentalData.soLuongPhong) {
      toast.error(`Vui lòng chọn đúng ${rentalData.soLuongPhong} phòng`)
      return false
    }
    const employeeId = await getEmployeeId()
    if (!employeeId) {
      toast.error('Không thể xác định thông tin nhân viên. Vui lòng đăng nhập lại.')
      return false
    }
    return true
  }

  const validateBookingForm = async () => {
    if (!validateCustomerForm()) return false

    if (!bookingData.ngayBdThue || !bookingData.ngayDi) {
      toast.error('Vui lòng chọn ngày bắt đầu và ngày kết thúc')
      return false
    }
    if (!bookingData.idKp || !bookingData.idLp) {
      toast.error('Vui lòng chọn kiểu phòng và loại phòng')
      return false
    }
    if (!bookingData.tienDatCoc) {
      toast.error('Vui lòng nhập tiền đặt cọc')
      return false
    }

    // Validate employee ID
    const employeeId = await getEmployeeId()

    if (!employeeId) {
      toast.error('Không thể xác định thông tin nhân viên. Vui lòng đăng nhập lại.')
      return false
    }

    // Validate minimum deposit
    if (roomPricing.minDeposit > 0 && parseFloat(bookingData.tienDatCoc) < roomPricing.minDeposit) {
      toast.error(`Tiền đặt cọc phải ít nhất ${roomPricing.minDeposit.toLocaleString('vi-VN')} VNĐ (20% của tổng tiền phòng)`)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedOption === 'rental') {
      await handleRentalSubmit()
    } else if (selectedOption === 'booking') {
      await handleBookingSubmit()
    } else if (selectedOption === 'customer') {
      await handleCustomerSubmit()
    }
  }

  const handleRentalSubmit = async () => {
    if (!(await validateRentalForm())) return

    setLoading(true)
    try {
      // Check if customer exists first
      let customerExists = false
      try {
        const existingCustomer = await customerService.getCustomerById(customerData.cccd)
        customerExists = existingCustomer.statusCode === 200
      } catch (error) {
        customerExists = false
      }

      // For rental, assume customer already exists (no customer type selection)
      if (!customerExists) {
        throw new Error('Khách hàng chưa tồn tại trong hệ thống. Vui lòng tạo khách hàng mới trước.')
      }

      // Update existing customer information
      const customerResponse = await customerService.updateCustomer(customerData.cccd, customerData)
      if (customerResponse.statusCode !== 200) {
        throw new Error(customerResponse.message || 'Lỗi khi cập nhật thông tin khách hàng')
      }

      // Create rental
      const employeeId = await getEmployeeId()

      const rentalPayload = {
        ngayDen: rentalData.ngayDen,
        ngayDi: rentalData.ngayDi,
        khachHang: {
          cccd: customerData.cccd,
          ho: customerData.ho,
          ten: customerData.ten,
          sdt: customerData.sdt,
          email: customerData.email,
          diaChi: customerData.diaChi
        },
        nhanVien: {
          idNv: employeeId
        },
        danhSachPhong: selectedRooms.map(room => ({
          soPhong: room.soPhong,
          danhSachKhachCccd: [customerData.cccd]
        }))
      }



      const rentalResponse = await rentalService.checkInWalkIn(rentalPayload)
      if (rentalResponse.statusCode === 200) {
        const roomNumbers = selectedRooms.map(r => r.soPhong).join(', ')
        toast.success(`Check-in thành công cho ${customerData.ho} ${customerData.ten} vào phòng ${roomNumbers}!`)
        handleReset()
      } else {
        throw new Error(rentalResponse.message || 'Lỗi khi tạo phiếu thuê')
      }
    } catch (error) {
      console.error('Error in rental submission:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi check-in')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async () => {
    if (!(await validateBookingForm())) return

    setLoading(true)
    try {
      // Check if customer exists first
      let customerExists = false
      try {
        const existingCustomer = await customerService.getCustomerById(customerData.cccd)
        customerExists = existingCustomer.statusCode === 200
      } catch (error) {
        customerExists = false
      }

      // For booking, assume customer already exists (no customer type selection)
      if (!customerExists) {
        throw new Error('Khách hàng chưa tồn tại trong hệ thống. Vui lòng tạo khách hàng mới trước.')
      }

      // Update existing customer information
      const customerResponse = await customerService.updateCustomer(customerData.cccd, customerData)
      if (customerResponse.statusCode !== 200) {
        throw new Error(customerResponse.message || 'Lỗi khi cập nhật thông tin khách hàng')
      }

      // Create booking at reception
      const employeeId = await getEmployeeId()

      const bookingPayload = {
        cccd: customerData.cccd,
        ho: customerData.ho,
        ten: customerData.ten,
        sdt: customerData.sdt,
        email: customerData.email,
        diaChi: customerData.diaChi,
        isNewCustomer: false, // Always false since we assume existing customer
        ngayBdThue: bookingData.ngayBdThue,
        ngayDi: bookingData.ngayDi,
        idKp: bookingData.idKp,
        idLp: bookingData.idLp,
        soLuongPhongO: bookingData.soLuongPhongO, 
        tienDatCoc: parseFloat(bookingData.tienDatCoc),
        idNv: employeeId,
        ghiChu: bookingData.ghiChu
      }



      const bookingResponse = await bookingService.createBookingAtReception(bookingPayload)
      if (bookingResponse.statusCode === 200) {
        toast.success('Đặt phòng thành công!')
        handleReset()
      } else {
        throw new Error(bookingResponse.message || 'Lỗi khi tạo phiếu đặt')
      }
    } catch (error) {
      console.error('Error in booking submission:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi đặt phòng')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerSubmit = async () => {
    if (!validateCustomerForm()) return

    setLoading(true)
    try {
      // Check if customer already exists
      let customerExists = false
      try {
        const existingCustomer = await customerService.getCustomerById(customerData.cccd)
        customerExists = existingCustomer.statusCode === 200
      } catch (error) {
        customerExists = false
      }

      if (customerExists) {
        throw new Error('Khách hàng đã tồn tại trong hệ thống với CCCD này.')
      }

      // Create new customer
      const customerResponse = await customerService.createCustomer(customerData)
      if (customerResponse.statusCode === 200) {
        toast.success(`Tạo khách hàng mới thành công cho ${customerData.ho} ${customerData.ten}!`)
        handleReset()
      } else {
        throw new Error(customerResponse.message || 'Lỗi khi tạo khách hàng')
      }
    } catch (error) {
      console.error('Error in customer creation:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi tạo khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleRoomSelect = async (room) => {
    const maxRooms = rentalData.soLuongPhong || 1

    // Check if room is already selected
    const isSelected = selectedRooms.find(r => r.soPhong === room.soPhong)

    if (isSelected) {
      // Remove room if already selected
      setSelectedRooms(prev => prev.filter(r => r.soPhong !== room.soPhong))
    } else {
      // Add room
      if (selectedRooms.length < maxRooms) {
        setSelectedRooms(prev => [...prev, room])
      } else {
        // Replace oldest room if at max capacity
        setSelectedRooms(prev => [...prev.slice(1), room])
        toast.info(`Đã thay thế phòng cũ. Tối đa ${maxRooms} phòng.`)
      }
    }

    // Keep the old single room selection for backward compatibility
    setSelectedRoom(room)
    // Don't auto-close room map for multi-select
    // setShowRoomMap(false)

    try {
      const response = await roomService.getRoomDetails(room.soPhong)
      if (response.statusCode === 200) {
        setRoomDetails(response.phong)
      }
    } catch (error) {
      console.error('Error loading room details:', error)
      toast.error('Không thể tải thông tin chi tiết phòng')
    }
  }

  const handleRemoveRoom = (roomToRemove) => {
    setSelectedRooms(prev => prev.filter(r => r.soPhong !== roomToRemove.soPhong))
  }

  const handleReset = () => {
    setSelectedOption('')
    setCustomerData({
      cccd: '',
      ho: '',
      ten: '',
      email: '',
      sdt: '',
      diaChi: ''
    })
    setRentalData({
      ngayDen: new Date().toISOString().split('T')[0],
      ngayDi: '',
      soLuongPhong: 1
    })
    setBookingData({
      ngayBdThue: '',
      ngayDi: '',
      idKp: '',
      idLp: '',
      soLuongPhongO: 1,
      tienDatCoc: '',
      ghiChu: ''
    })
    setRoomPricing({
      roomPrice: 0,
      minDeposit: 0,
      pricePerRoom: 0,
      depositPerRoom: 0,
      numberOfNights: 0,
      totalRoomPrice: 0
    })
    setSelectedRoom(null)
    setSelectedRooms([])
    setRoomDetails(null)
    setShowRoomMap(false)
    setRoomFilters({
      idKp: '',
      idLp: ''
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Walk-in Service</h1>
      </div>

      {/* Option Selection */}
      {!selectedOption && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Chọn dịch vụ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Option */}
            <div
              onClick={() => setSelectedOption('booking')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Đặt phòng</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Đặt phòng trước cho khách hàng đã có trong hệ thống.
              </p>
            </div>

            {/* Rental Option */}
            <div
              onClick={() => {
                setSelectedOption('rental')
                setShowRoomMap(true)
                // Khóa cứng ngày check-in là hôm nay cho thuê phòng ngay
                setRentalData(prev => ({
                  ...prev,
                  ngayDen: new Date().toISOString().split('T')[0]
                }))
              }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
            >
              <div className="flex items-center mb-4">
                <CreditCard className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Thuê phòng ngay</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Check-in ngay lập tức cho khách hàng đã có trong hệ thống.
              </p>
            </div>

            {/* Customer Creation Option */}
            <div
              onClick={() => setSelectedOption('customer')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all"
            >
              <div className="flex items-center mb-4">
                <UserPlus className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Tạo khách hàng mới</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tạo hồ sơ khách hàng mới trong hệ thống.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      {selectedOption && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={() => {
                setSelectedOption('')
                setShowRoomMap(false)
                setSelectedRoom(null)
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Quay lại chọn dịch vụ
            </button>
          </div>

          {/* Service Information */}
          {selectedOption === 'customer' && (
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tạo khách hàng mới</h2>
            </div>
          )}

          {/* Customer Information */}
          <div className="card">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <UserPlus className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedOption === 'customer'
                    ? 'Thông tin khách hàng mới'
                    : 'Thông tin khách hàng'
                  }
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Căn cước công dân <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerData.cccd}
                  onChange={(e) => handleCccdChange(e.target.value)}
                  className="input"
                  placeholder="Nhập số căn cước công dân"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerData.sdt}
                  onChange={(e) => handleCustomerDataChange('sdt', e.target.value)}
                  className="input"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              {/* Hiển thị thông tin khách hàng đã tìm thấy (chỉ đọc) cho booking và rental */}
              {(selectedOption === 'booking' || selectedOption === 'rental') && customerData.ho && (
                <div className="col-span-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Thông tin khách hàng đã tìm thấy:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Họ tên:</span> {customerData.ho} {customerData.ten}</div>
                    <div><span className="font-medium">Email:</span> {customerData.email || 'Chưa có'}</div>
                    <div className="col-span-2"><span className="font-medium">Địa chỉ:</span> {customerData.diaChi || 'Chưa có'}</div>
                  </div>
                </div>
              )}

              {/* Chỉ hiển thị các trường khác khi tạo khách hàng mới */}
              {selectedOption === 'customer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerData.ho}
                      onChange={(e) => handleCustomerDataChange('ho', e.target.value)}
                      className="input"
                      placeholder="Nhập họ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerData.ten}
                      onChange={(e) => handleCustomerDataChange('ten', e.target.value)}
                      className="input"
                      placeholder="Nhập tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      className="input"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={customerData.diaChi}
                      onChange={(e) => handleCustomerDataChange('diaChi', e.target.value)}
                      className="input"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Booking Form (only for booking option) */}
          {selectedOption === 'booking' && (
            <div className="card">
              <div className="flex items-center mb-6">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Thông tin đặt phòng</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu thuê <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookingData.ngayBdThue}
                    onChange={(e) => handleBookingDataChange('ngayBdThue', e.target.value)}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookingData.ngayDi}
                    onChange={(e) => handleBookingDataChange('ngayDi', e.target.value)}
                    className="input"
                    min={bookingData.ngayBdThue || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kiểu phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookingData.idKp}
                    onChange={(e) => handleBookingDataChange('idKp', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Tất cả kiểu phòng</option>
                    {roomTypes.map(type => (
                      <option key={type.idKp} value={type.idKp}>
                        {type.tenKp} - {type.moTaKp} - {type.soLuongKhach} khách
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookingData.idLp}
                    onChange={(e) => handleBookingDataChange('idLp', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Tất cả loại phòng</option>
                    {roomCategories.map(category => (
                      <option key={category.idLp} value={category.idLp}>
                        {category.tenLp} - {category.moTaLp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng phòng ở <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={bookingData.soLuongPhongO}
                    onChange={(e) => handleBookingDataChange('soLuongPhongO', parseInt(e.target.value))}
                    className="input"
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiền đặt cọc <span className="text-red-500">*</span>
                    {roomPricing.minDeposit > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Tối thiểu: {roomPricing.minDeposit.toLocaleString('vi-VN')} VNĐ)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={bookingData.tienDatCoc}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^\d]/g, '')
                      handleBookingDataChange('tienDatCoc', value)
                    }}
                    className="input"
                    style={{
                      // Hide number input spinners
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'none',
                      margin: 0
                    }}
                    placeholder={roomPricing.minDeposit > 0 ? `Tối thiểu ${roomPricing.minDeposit.toLocaleString('vi-VN')} VNĐ` : "Nhập số tiền đặt cọc"}
                    required
                  />
                  {roomPricing.pricePerRoom > 0 && (
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Giá phòng: {roomPricing.pricePerRoom.toLocaleString('vi-VN')} VNĐ/đêm/phòng</p>
                      {roomPricing.numberOfNights > 0 && (
                        <p>Số đêm: {roomPricing.numberOfNights} đêm</p>
                      )}
                      {bookingData.soLuongPhongO > 1 && (
                        <p>Tổng giá ({bookingData.soLuongPhongO} phòng): {(roomPricing.pricePerRoom * bookingData.soLuongPhongO).toLocaleString('vi-VN')} VNĐ/đêm</p>
                      )}
                      {roomPricing.totalRoomPrice > 0 && (
                        <p className="font-medium text-gray-800">
                          Tổng tiền phòng: {roomPricing.totalRoomPrice.toLocaleString('vi-VN')} VNĐ
                          {roomPricing.numberOfNights > 1 && bookingData.soLuongPhongO > 1 && (
                            <span className="text-xs text-gray-500"> ({roomPricing.pricePerRoom.toLocaleString('vi-VN')} × {roomPricing.numberOfNights} đêm × {bookingData.soLuongPhongO} phòng)</span>
                          )}
                        </p>
                      )}
                      <p className="text-blue-600 font-medium">
                        Tiền cọc tối thiểu (20%): {roomPricing.minDeposit.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  )}
                </div>

                {/* Available Rooms Notification for Booking */}
                {selectedOption === 'booking' && (
                  <div className="col-span-2">
                    {loadingAvailableRooms && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-blue-700 text-sm">Đang kiểm tra phòng trống...</span>
                        </div>
                      </div>
                    )}

                    {!loadingAvailableRooms && availableRoomsInfo && availableRoomsInfo.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-green-800 font-medium mb-2">Thông tin phòng trống:</h4>
                        {availableRoomsInfo.map((room, index) => (
                          <div key={index} className="text-green-700 text-sm mb-1">
                            <span className="font-medium">{room.tenKieuPhong} - {room.tenLoaiPhong}:</span>
                            <span className="ml-2">Còn {room.soPhongTrong} phòng trống (Tổng: {room.tongSoPhong} phòng)</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!loadingAvailableRooms && availableRoomsInfo && availableRoomsInfo.length === 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <span className="text-red-700 text-sm">Không có phòng trống cho loại phòng đã chọn trong khoảng thời gian này.</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Rental Form (only for rental option) */}
          {selectedOption === 'rental' && (
            <>
              <div className="card">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin thuê phòng</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-in <span className="text-red-500">*</span>
                      <span className="text-xs text-blue-600 ml-2">(Tự động: Hôm nay)</span>
                    </label>
                    <input
                      type="date"
                      value={rentalData.ngayDen}
                      readOnly
                      disabled
                      className="input bg-gray-100 cursor-not-allowed text-gray-600"
                      title="Ngày check-in được khóa cứng là hôm nay cho thuê phòng ngay"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Thuê phòng ngay luôn check-in vào ngày hôm nay
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-out <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={rentalData.ngayDi}
                      onChange={(e) => handleRentalDataChange('ngayDi', e.target.value)}
                      className="input"
                      min={rentalData.ngayDen}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={rentalData.soLuongPhong}
                      onChange={(e) => handleRentalDataChange('soLuongPhong', parseInt(e.target.value) || 1)}
                      className="input"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                </div>
              </div>

              

              {/* Room Filters */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lọc phòng</h3>
                  {!showRoomMap && (
                    <button
                      onClick={() => setShowRoomMap(true)}
                      className="btn-primary"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Chọn phòng
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kiểu phòng
                    </label>
                    <select
                      value={roomFilters.idKp}
                      onChange={(e) => handleRoomFilterChange('idKp', e.target.value)}
                      className="input"
                    >
                      <option value="">Tất cả kiểu phòng</option>
                      {roomTypes.map(type => (
                        <option key={type.idKp} value={type.idKp}>
                          {type.tenKp} - {type.moTaKp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại phòng
                    </label>
                    <select
                      value={roomFilters.idLp}
                      onChange={(e) => handleRoomFilterChange('idLp', e.target.value)}
                      className="input"
                    >
                      <option value="">Tất cả loại phòng</option>
                      {roomCategories.map(category => (
                        <option key={category.idLp} value={category.idLp}>
                          {category.tenLp} - {category.moTaLp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Available Rooms Notification for Rental */}
                {selectedOption === 'rental' && rentalData.ngayDen && rentalData.ngayDi && (
                  <div className="mt-4">
                    {loadingAvailableRooms && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-blue-700 text-sm">Đang kiểm tra phòng trống...</span>
                        </div>
                      </div>
                    )}

                    {!loadingAvailableRooms && availableRoomsInfo && availableRoomsInfo.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-green-800 font-medium mb-2">Thông tin phòng trống:</h4>
                        {availableRoomsInfo.map((room, index) => (
                          <div key={index} className="text-green-700 text-sm mb-1">
                            <span className="font-medium">{room.tenKieuPhong} - {room.tenLoaiPhong}:</span>
                            <span className="ml-2">Còn {room.soPhongTrong} phòng trống (Tổng: {room.tongSoPhong} phòng)</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!loadingAvailableRooms && availableRoomsInfo && availableRoomsInfo.length === 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <span className="text-red-700 text-sm">Không có phòng trống cho loại phòng đã chọn trong khoảng thời gian này.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Room Selection */}
              <div className="card">
                <div className="flex items-center mb-6">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Chọn phòng</h2>
                </div>

              

                {/* Room Map */}
                {showRoomMap && (
                  <div className="card">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sơ đồ phòng - Chọn {rentalData.soLuongPhong} phòng
                      </h3>
                      <button
                        onClick={() => setShowRoomMap(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <RoomMap
                        onRoomSelect={handleRoomSelect}
                        selectedRoom={selectedRoom}
                        selectedRooms={selectedRooms}
                        checkInDate={rentalData.ngayDen}
                        checkOutDate={rentalData.ngayDi}
                        filters={roomFilters}
                        maxRooms={rentalData.soLuongPhong}
                        multiSelect={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Selected Rooms Display */}
              {selectedRooms.length > 0 && (
                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phòng đã chọn ({selectedRooms.length}/{rentalData.soLuongPhong})
                    </h3>
                    <button
                      onClick={() => setSelectedRooms([])}
                      className="btn-outline px-3"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Xóa tất cả
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedRooms.map((room) => (
                      <div key={room.soPhong} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="text-sm">
                            <div><span className="font-medium">Phòng:</span> {room.soPhong}</div>
                            <div><span className="font-medium">Tầng:</span> {room.tang}</div>
                            <div><span className="font-medium">Kiểu phòng:</span> {room.tenKp}</div>
                            <div><span className="font-medium">Loại phòng:</span> {room.tenLp}</div>
                            <div><span className="font-medium">Giá:</span> {room.gia?.toLocaleString('vi-VN')} VNĐ/đêm</div>
                          </div>
                          <button
                            onClick={() => handleRemoveRoom(room)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Total Price */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between font-medium text-sm">
                        <span>Tổng tiền phòng/đêm:</span>
                        <span>{selectedRooms.reduce((sum, room) => sum + (room.gia || 0), 0).toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn-outline"
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Đặt lại
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {selectedOption === 'booking' ? 'Đặt phòng' :
               selectedOption === 'rental' ? 'Check-in' : 'Tạo khách hàng'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default WalkInCheckIn
