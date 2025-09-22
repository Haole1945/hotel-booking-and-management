import React from 'react'
import { useParams } from 'react-router-dom'

const RoomDetailPage = () => {
  const { id } = useParams()
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Chi tiết phòng #{id}</h1>
      <p className="text-gray-600">Trang chi tiết phòng đang được phát triển...</p>
    </div>
  )
}

export default RoomDetailPage
