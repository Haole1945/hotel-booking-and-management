import React, { useState, useEffect } from 'react'
import AmenityIcon from '../common/AmenityIcon.jsx'
import { amenityService } from '../../services/amenityService.js'

/**
 * Component test để kiểm tra hiển thị amenity icons từ LONGBLOB
 */
const AmenityIconTest = () => {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock data với base64 SVG từ SQL file
  const mockAmenities = [
    {
      ID_TN: 'TN01',
      TEN_TN: 'Wi-Fi',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMiAyMGguMDEiLz48cGF0aCBkPSJNMiA4LjgyYTE1IDE1IDAgMCAxIDIwIDAiLz48cGF0aCBkPSJNNSAxMi44NTlhMTAgMTAgMCAwIDEgMTQgMCIvPjxwYXRoIGQ9Ik04LjUgMTYuNDI5YTUgNSAwIDAgMSA3IDAiLz48L3N2Zz4='
    },
    {
      ID_TN: 'TN02',
      TEN_TN: 'TV',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxNSIgeD0iMiIgeT0iNyIgcng9IjIiIHJ5PSIyIi8+PHBvbHlsaW5lIHBvaW50cz0iMTcsMiAxMiw3IDcsMiIvPjwvc3ZnPg=='
    },
    {
      ID_TN: 'TN03',
      TEN_TN: 'Air Conditioner',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNy43IDcuN2EyLjUgMi41IDAgMSAxIDEuOCA0LjNIMiIvPjxwYXRoIGQ9Ik05LjYgNC42QTIgMiAwIDEgMSAxMSA4SDIiLz48cGF0aCBkPSJNMTIuNiAxOS40QTIgMiAwIDEgMCAxNCAxNkgyIi8+PC9zdmc+'
    },
    {
      ID_TN: 'TN04',
      TEN_TN: 'Mini Fridge',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik01IDZhNCA0IDAgMCAxIDQtNGg2YTQgNCAwIDAgMSA0IDR2MTRhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWNloiLz48cGF0aCBkPSJNNSAxMGgxNCIvPjxwYXRoIGQ9Ik0xNSA3djYiLz48L3N2Zz4='
    },
    {
      ID_TN: 'TN11',
      TEN_TN: 'Bathtub',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yIDEyaDIwIi8+PHBhdGggZD0iTTIgMTJ2NmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTYiLz48cGF0aCBkPSJNNCA4VjZhMiAyIDAgMCAxIDItMmgyIi8+PHBhdGggZD0iTTQgMjJ2LTIiLz48cGF0aCBkPSJNMjAgMjJ2LTIiLz48L3N2Zz4='
    },
    {
      ID_TN: 'TN14',
      TEN_TN: 'Coffee machine',
      ICON: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMCAydjIwIi8+PHBhdGggZD0iTTE0IDJ2MjAiLz48cGF0aCBkPSJNNSA4aDE0Ii8+PHBhdGggZD0iTTE5IDh2MTBhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWOCIvPjxwYXRoIGQ9Ik0yMiA4aC0zIi8+PC9zdmc+'
    }
  ]

  useEffect(() => {
    // Simulate loading amenities from API
    const loadAmenities = async () => {
      try {
        setLoading(true)
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Use mock data for now
        setAmenities(mockAmenities)
        setError(null)
      } catch (err) {
        setError('Failed to load amenities')
        console.error('Error loading amenities:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAmenities()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Amenity Icons Test</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Amenity Icons Test</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Amenity Icons Test</h2>
      <p className="text-gray-600 mb-6">
        Testing LONGBLOB SVG icons from database with different sizes and tooltip functionality.
      </p>

      {/* Small Icons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Small Icons (w-4 h-4)</h3>
        <div className="flex flex-wrap gap-3">
          {amenities.map((amenity) => (
            <div key={amenity.ID_TN} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
              <AmenityIcon amenity={amenity} className="w-4 h-4" />
              <span className="text-sm">{amenity.TEN_TN}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Icons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Medium Icons (w-6 h-6)</h3>
        <div className="flex flex-wrap gap-3">
          {amenities.map((amenity) => (
            <div key={amenity.ID_TN} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded">
              <AmenityIcon amenity={amenity} className="w-6 h-6 text-blue-600" />
              <span className="text-sm">{amenity.TEN_TN}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Large Icons with Tooltips */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Large Icons with Tooltips (w-8 h-8)</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.ID_TN} className="flex flex-col items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <AmenityIcon 
                amenity={amenity} 
                className="w-8 h-8 text-gray-700" 
                showTooltip={true} 
              />
              <span className="text-xs text-center mt-2 text-gray-600">{amenity.TEN_TN}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Large Icons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Extra Large Icons (w-12 h-12)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {amenities.map((amenity) => (
            <div key={amenity.ID_TN} className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <AmenityIcon 
                amenity={amenity} 
                className="w-12 h-12 text-indigo-600" 
                showTooltip={true} 
              />
              <span className="text-sm font-medium text-center mt-3 text-gray-800">{amenity.TEN_TN}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Display */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Raw Data (for debugging)</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-xs text-gray-700">
            {JSON.stringify(amenities, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default AmenityIconTest
