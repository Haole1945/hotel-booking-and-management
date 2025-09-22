import React from 'react'
import { getAmenityIcon, getAmenityIconFromBlob } from '../../utils/amenityIcons.jsx'
import { createSvgComponent } from '../../utils/blobUtils.js'

/**
 * Component để hiển thị icon tiện nghi
 * Hỗ trợ cả LONGBLOB data từ database và fallback icons
 */
const AmenityIcon = ({ 
  amenity, 
  className = "w-5 h-5", 
  showTooltip = false 
}) => {
  // Nếu amenity có ICON (LONGBLOB data)
  if (amenity?.ICON || amenity?.icon) {
    const iconData = amenity.ICON || amenity.icon
    const iconName = amenity.ID_TN || amenity.idTn || amenity.iconName

    // Thử render từ LONGBLOB data trước
    const svgComponent = createSvgComponent(iconData, className)

    if (svgComponent) {
      return (
        <div
          className={showTooltip ? "relative group" : ""}
          title={showTooltip ? amenity.TEN_TN || amenity.tenTn : undefined}
        >
          <div
            dangerouslySetInnerHTML={{ __html: svgComponent }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {amenity.TEN_TN || amenity.tenTn}
            </div>
          )}
        </div>
      )
    }

    // Fallback to getAmenityIconFromBlob
    return (
      <div
        className={showTooltip ? "relative group" : ""}
        title={showTooltip ? amenity.TEN_TN || amenity.tenTn : undefined}
      >
        {getAmenityIconFromBlob(iconData, iconName, className)}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {amenity.TEN_TN || amenity.tenTn}
          </div>
        )}
      </div>
    )
  }

  // Fallback to mapped icon
  const iconName = amenity?.iconName || amenity?.icon || 'wifi'
  return (
    <div 
      className={showTooltip ? "relative group" : ""}
      title={showTooltip ? amenity.TEN_TN || amenity.tenTn : undefined}
    >
      {getAmenityIcon(iconName, className)}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {amenity.TEN_TN || amenity.tenTn}
        </div>
      )}
    </div>
  )
}

export default AmenityIcon
