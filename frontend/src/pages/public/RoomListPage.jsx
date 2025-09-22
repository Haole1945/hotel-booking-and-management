import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import RoomSearch from '../../components/common/RoomSearch'
import RoomResult from '../../components/common/RoomResult'
import Pagination from '../../components/common/Pagination'
import { roomService } from '../../services/roomService'

const RoomListPage = () => {
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(9)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAvailableRooms()
      if (response.statusCode === 200) {
        setRooms(response.phongList || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchResult = (searchResults) => {
    setRooms(searchResults)
    setCurrentPage(1)
  }

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Danh sách phòng</h1>

      {/* Search Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tìm kiếm phòng</h2>
        <RoomSearch handleSearchResult={handleSearchResult} />
      </div>

      {/* Results Section */}
      <div className="mb-6">
        <p className="text-gray-600">
          Hiển thị {currentRooms.length} trong tổng số {rooms.length} phòng
        </p>
      </div>

      {/* Room Results */}
      {rooms.length > 0 ? (
        <>
          <RoomResult roomSearchResults={currentRooms} />
          <Pagination
            itemsPerPage={roomsPerPage}
            totalItems={rooms.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy phòng nào</p>
        </div>
      )}
    </div>
  )
}

export default RoomListPage
