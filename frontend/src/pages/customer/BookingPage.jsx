import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomSearch from '../../components/common/RoomSearch'
import RoomSearchResult from '../../components/common/RoomSearchResult'
import Pagination from '../../components/common/Pagination'
import BookingModal from '../../components/booking/BookingModal'
import { roomService } from '../../services/roomService'
import { Search, MapPin } from 'lucide-react'

const BookingPage = () => {
  const navigate = useNavigate()
  const resultsRef = useRef(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(6)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchDates, setSearchDates] = useState({
    checkIn: null,
    checkOut: null
  })
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Load saved search results when component mounts
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem('bookingSearchData')
    if (savedSearchData) {
      try {
        const parsedData = JSON.parse(savedSearchData)
        setRooms(parsedData.rooms || [])
        setHasSearched(parsedData.hasSearched || false)

        // Convert date strings back to Date objects
        const savedSearchDates = parsedData.searchDates || { checkIn: null, checkOut: null }
        const convertedSearchDates = {
          checkIn: savedSearchDates.checkIn ? new Date(savedSearchDates.checkIn) : null,
          checkOut: savedSearchDates.checkOut ? new Date(savedSearchDates.checkOut) : null
        }
        setSearchDates(convertedSearchDates)
        setCurrentPage(parsedData.currentPage || 1)
      } catch (error) {
        console.error('Error loading saved search data:', error)
      }
    }

    // Check for pending booking from public page
    const pendingBooking = sessionStorage.getItem('pendingBooking')
    if (pendingBooking) {
      try {
        const bookingData = JSON.parse(pendingBooking)
        // Set the search results and dates from pending booking
        if (bookingData.room && bookingData.searchDates) {
          setRooms([bookingData.room])
          setHasSearched(true)

          // Convert date strings back to Date objects for pending booking
          const pendingSearchDates = {
            checkIn: bookingData.searchDates.checkIn ? new Date(bookingData.searchDates.checkIn) : null,
            checkOut: bookingData.searchDates.checkOut ? new Date(bookingData.searchDates.checkOut) : null
          }
          setSearchDates(pendingSearchDates)
          setCurrentPage(1)

          // Automatically open booking modal for the pending room
          setSelectedRoom(bookingData.room)
          setShowBookingModal(true)
        }
        // Clear the pending booking data
        sessionStorage.removeItem('pendingBooking')
      } catch (error) {
        console.error('Error loading pending booking:', error)
      }
    }
  }, [])

  const handleSearchResult = (searchResults, searchData) => {
    setRooms(searchResults)
    setCurrentPage(1)
    setHasSearched(true)

    // Lưu thông tin ngày tìm kiếm
    const newSearchDates = searchData ? {
      checkIn: searchData.startDate,
      checkOut: searchData.endDate
    } : { checkIn: null, checkOut: null }

    setSearchDates(newSearchDates)

    // Save search data to sessionStorage
    const searchDataToSave = {
      rooms: searchResults,
      hasSearched: true,
      searchDates: newSearchDates,
      currentPage: 1
    }
    sessionStorage.setItem('bookingSearchData', JSON.stringify(searchDataToSave))

    // Scroll xuống kết quả tìm kiếm sau một khoảng thời gian ngắn
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }



  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)

    // Update saved search data with new page
    const savedSearchData = sessionStorage.getItem('bookingSearchData')
    if (savedSearchData) {
      try {
        const parsedData = JSON.parse(savedSearchData)
        parsedData.currentPage = pageNumber
        sessionStorage.setItem('bookingSearchData', JSON.stringify(parsedData))
      } catch (error) {
        console.error('Error updating page in saved search data:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đặt phòng</h1>
          <p className="text-gray-600 mt-2">Tìm và đặt phòng phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <MapPin className="w-5 h-5" />
          <span>Hotel Booking</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm phòng</h2>
        </div>
        <RoomSearch handleSearchResult={handleSearchResult} />
      </div>


      {/* Results */}
      <div className="card" ref={resultsRef}>
        {hasSearched ? (
          rooms.length > 0 ? (
            <>
              <RoomSearchResult searchResults={currentRooms} searchDates={searchDates} />
              <Pagination
                itemsPerPage={roomsPerPage}
                totalItems={rooms.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy phòng nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi tiêu chí tìm kiếm
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tìm kiếm phòng lý tưởng
            </h3>
            <p className="text-gray-500">
              Vui lòng nhập thông tin tìm kiếm và bấm "Tìm phòng"
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          searchDates={searchDates}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedRoom(null)
          }}
        />
      )}
    </div>
  )
}

export default BookingPage
