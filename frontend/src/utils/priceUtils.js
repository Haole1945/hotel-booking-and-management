/**
 * Utilities for handling price calculations and formatting
 */

/**
 * Format price in Vietnamese currency
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Format date range for price segments
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day, just show one date
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('vi-VN');
  }
  
  // If consecutive days, show range
  const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (dayDiff === 1) {
    return start.toLocaleDateString('vi-VN');
  }
  
  return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
};

/**
 * Calculate total nights from date range
 */
export const calculateNights = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Get price range from price segments
 */
export const getPriceRange = (priceSegments) => {
  if (!priceSegments || priceSegments.length === 0) {
    return null;
  }
  
  const prices = priceSegments.map(segment => segment.pricePerNight);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return {
    min: minPrice,
    max: maxPrice,
    isSamePrice: minPrice === maxPrice
  };
};

/**
 * Format price segments for display
 */
export const formatPriceSegments = (priceSegments) => {
  if (!priceSegments || priceSegments.length === 0) {
    return [];
  }
  
  return priceSegments.map(segment => ({
    ...segment,
    formattedDateRange: formatDateRange(segment.startDate, segment.endDate),
    formattedPrice: formatPrice(segment.pricePerNight),
    formattedTotal: formatPrice(segment.totalPrice),
    nightsText: segment.numberOfNights === 1 ? '1 đêm' : `${segment.numberOfNights} đêm`
  }));
};

/**
 * Get display price for room card
 */
export const getDisplayPrice = (room) => {
  // If has price segments, use them
  if (room.priceSegments && room.priceSegments.length > 0) {
    const priceRange = getPriceRange(room.priceSegments);
    
    if (priceRange.isSamePrice) {
      return {
        price: priceRange.min,
        label: '/đêm',
        type: 'single'
      };
    } else {
      return {
        price: priceRange.min,
        label: '/đêm',
        prefix: 'Từ',
        type: 'range'
      };
    }
  }
  
  // If has average price, use it
  if (room.averagePrice) {
    return {
      price: room.averagePrice,
      label: '/đêm',
      type: 'average'
    };
  }
  
  // If has total price, calculate average
  if (room.totalPrice && room.numberOfNights) {
    return {
      price: room.totalPrice / room.numberOfNights,
      label: '/đêm',
      type: 'calculated'
    };
  }
  
  // Fallback to current price
  if (room.giaHienTai) {
    return {
      price: room.giaHienTai,
      label: '/đêm',
      type: 'current'
    };
  }
  
  return null;
};

/**
 * Calculate total price from segments
 */
export const calculateTotalFromSegments = (priceSegments) => {
  if (!priceSegments || priceSegments.length === 0) {
    return 0;
  }
  
  return priceSegments.reduce((total, segment) => {
    return total + (segment.totalPrice || (segment.pricePerNight * segment.numberOfNights));
  }, 0);
};

/**
 * Validate price segments data
 */
export const validatePriceSegments = (priceSegments) => {
  if (!Array.isArray(priceSegments)) {
    return false;
  }
  
  return priceSegments.every(segment => 
    segment.startDate && 
    segment.endDate && 
    segment.pricePerNight && 
    segment.numberOfNights > 0
  );
};

/**
 * Group consecutive segments with same price
 */
export const groupConsecutiveSegments = (priceSegments) => {
  if (!priceSegments || priceSegments.length === 0) {
    return [];
  }
  
  const grouped = [];
  let currentGroup = { ...priceSegments[0] };
  
  for (let i = 1; i < priceSegments.length; i++) {
    const segment = priceSegments[i];
    
    // If same price and consecutive dates, merge
    if (segment.pricePerNight === currentGroup.pricePerNight &&
        new Date(segment.startDate).getTime() === new Date(currentGroup.endDate).getTime()) {
      currentGroup.endDate = segment.endDate;
      currentGroup.numberOfNights += segment.numberOfNights;
      currentGroup.totalPrice += segment.totalPrice;
    } else {
      // Different price or non-consecutive, start new group
      grouped.push(currentGroup);
      currentGroup = { ...segment };
    }
  }
  
  // Add the last group
  grouped.push(currentGroup);
  
  return grouped;
};

export default {
  formatPrice,
  formatDateRange,
  calculateNights,
  getPriceRange,
  formatPriceSegments,
  getDisplayPrice,
  calculateTotalFromSegments,
  validatePriceSegments,
  groupConsecutiveSegments
};
