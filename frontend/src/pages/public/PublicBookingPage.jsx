import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import RoomSearch from '../../components/common/RoomSearch'
import RoomSearchResult from '../../components/common/RoomSearchResult'
import Pagination from '../../components/common/Pagination'

const PublicBookingPage = () => {
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
  const [prefilledData, setPrefilledData] = useState(null)

  // Load saved search results and prefilled data when component mounts
  useEffect(() => {
    const savedSearchData = sessionStorage.getItem('publicBookingSearchData')
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

    // Load prefilled data from featured room selection
    const savedPrefilledData = sessionStorage.getItem('bookingPrefilledData')
    if (savedPrefilledData) {
      try {
        const parsedPrefilledData = JSON.parse(savedPrefilledData)
        setPrefilledData(parsedPrefilledData)
        // Clear the prefilled data after using it
        sessionStorage.removeItem('bookingPrefilledData')
      } catch (error) {
        console.error('Error loading prefilled data:', error)
      }
    }
  }, [])

  // Save search data to sessionStorage whenever it changes
  useEffect(() => {
    if (hasSearched) {
      const searchData = {
        rooms,
        hasSearched,
        searchDates,
        currentPage
      }
      sessionStorage.setItem('publicBookingSearchData', JSON.stringify(searchData))
    }
  }, [rooms, hasSearched, searchDates, currentPage])

  const handleSearchResult = (searchResults, dates) => {
    setRooms(searchResults)
    setHasSearched(true)
    setSearchDates({
      checkIn: dates.startDate,
      checkOut: dates.endDate
    })
    setCurrentPage(1)

    // Scroll to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm phòng</h2>
          </div>
          <RoomSearch
            handleSearchResult={handleSearchResult}
            prefilledData={prefilledData}
            onDataUsed={() => setPrefilledData(null)}
          />
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6" ref={resultsRef}>
          {hasSearched ? (
            rooms.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kết quả tìm kiếm ({rooms.length} phòng)
                  </h3>
                  {searchDates.checkIn && searchDates.checkOut && (
                    <p className="text-gray-600">
                      Từ {searchDates.checkIn.toLocaleDateString('vi-VN')} đến {searchDates.checkOut.toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
                <RoomSearchResult 
                  searchResults={currentRooms} 
                  searchDates={searchDates}
                  isPublic={true} // Đánh dấu đây là trang public
                />
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
                Tìm kiếm phòng
              </h3>
              <p className="text-gray-500">
                Sử dụng form tìm kiếm ở trên để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicBookingPage
