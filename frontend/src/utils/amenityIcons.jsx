import {
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  Bed,
  Phone,
  Refrigerator,
  Microwave,
  Shirt,
  Snowflake,
  Sun,
  Moon,
  Clock,
  MapPin,
  Star,
  Heart,
  Home,
  Users,
  Zap,
  Leaf,
  Music,
  Camera,
  Gift,
  Sofa,
  ShowerHead,
  Building,
  Volume2,
  Briefcase,
  Eye,
  Armchair
} from 'lucide-react'

// Danh sách đầy đủ các icons cho tiện ích khách sạn
export const AMENITY_ICONS = [
  // Tiện ích cơ bản từ CSV
  { value: 'wifi', label: 'Wi-Fi', icon: Wifi, category: 'basic' },
  { value: 'tv', label: 'TV', icon: Tv, category: 'basic' },
  { value: 'ac', label: 'Air Conditioner', icon: Wind, category: 'basic' },
  { value: 'fridge', label: 'Mini Fridge', icon: Refrigerator, category: 'basic' },

  // TV các loại
  { value: 'tv-32', label: 'TV 32 inch', icon: Tv, category: 'entertainment' },
  { value: 'tv-42', label: 'TV 42 inch', icon: Tv, category: 'entertainment' },
  { value: 'tv-50', label: 'TV 50 inch', icon: Tv, category: 'entertainment' },

  // Nội thất
  { value: 'single-sofa', label: 'Single sofa', icon: Armchair, category: 'furniture' },
  { value: 'double-sofa', label: 'Double sofa', icon: Sofa, category: 'furniture' },
  { value: 'work-table', label: 'Work Table', icon: Briefcase, category: 'furniture' },

  // Phòng tắm
  { value: 'bathtub', label: 'Bathtub', icon: Bath, category: 'bathroom' },
  { value: 'shower', label: 'Separate shower', icon: ShowerHead, category: 'bathroom' },
  { value: 'jacuzzi', label: 'Jacuzzi', icon: Waves, category: 'bathroom' },

  // Tiện ích phòng
  { value: 'balcony', label: 'Private balcony', icon: Building, category: 'room' },
  { value: 'living-room', label: 'Separate living room', icon: Home, category: 'room' },
  { value: 'dining-area', label: 'Private dining area', icon: Utensils, category: 'room' },
  { value: 'city-view', label: 'City/Pool view', icon: Eye, category: 'room' },

  // Đồ uống & Ăn uống
  { value: 'coffee-machine', label: 'Coffee machine', icon: Coffee, category: 'dining' },
  { value: 'coffee-set', label: 'Coffee set', icon: Coffee, category: 'dining' },
  { value: 'mini-bar', label: 'Mini bar', icon: Refrigerator, category: 'dining' },

  // Giải trí
  { value: 'bluetooth-speaker', label: 'Bluetooth speaker', icon: Volume2, category: 'entertainment' },

  // Các tiện ích khác (giữ lại từ trước)
  { value: 'parking', label: 'Bãi đỗ xe', icon: Car, category: 'basic' },
  { value: 'bed', label: 'Giường thoải mái', icon: Bed, category: 'basic' },
  { value: 'restaurant', label: 'Nhà hàng', icon: Utensils, category: 'dining' },
  { value: 'microwave', label: 'Lò vi sóng', icon: Microwave, category: 'dining' },
  { value: 'gym', label: 'Phòng tập gym', icon: Dumbbell, category: 'entertainment' },
  { value: 'pool', label: 'Hồ bơi', icon: Waves, category: 'entertainment' },
  { value: 'music', label: 'Hệ thống âm thanh', icon: Music, category: 'entertainment' },
  { value: 'security', label: 'An ninh 24/7', icon: Shield, category: 'service' },
  { value: 'phone', label: 'Điện thoại', icon: Phone, category: 'service' },
  { value: 'laundry', label: 'Dịch vụ giặt ủi', icon: Shirt, category: 'service' },
  { value: 'reception-24h', label: 'Lễ tân 24h', icon: Clock, category: 'service' },
  { value: 'concierge', label: 'Dịch vụ concierge', icon: Users, category: 'service' },
  { value: 'heating', label: 'Hệ thống sưởi', icon: Sun, category: 'comfort' },
  { value: 'cooling', label: 'Hệ thống làm mát', icon: Snowflake, category: 'comfort' },
  { value: 'night-service', label: 'Dịch vụ đêm', icon: Moon, category: 'comfort' },
  { value: 'location', label: 'Vị trí thuận lợi', icon: MapPin, category: 'location' },
  { value: 'eco-friendly', label: 'Thân thiện môi trường', icon: Leaf, category: 'special' },
  { value: 'luxury', label: 'Dịch vụ cao cấp', icon: Star, category: 'special' },
  { value: 'family-friendly', label: 'Thân thiện gia đình', icon: Heart, category: 'special' },
  { value: 'business', label: 'Tiện ích kinh doanh', icon: Zap, category: 'business' },
  { value: 'photography', label: 'Dịch vụ chụp ảnh', icon: Camera, category: 'special' },
  { value: 'gift-shop', label: 'Cửa hàng quà tặng', icon: Gift, category: 'shopping' }
]

// Mapping từ database icon names sang frontend icon values
const ICON_MAPPING = {
  // Database icons -> Frontend values (matching SQL file amenity IDs)
  'TN01': 'wifi',           // Wi-Fi
  'TN02': 'tv',             // TV
  'TN03': 'ac',             // Air Conditioner
  'TN04': 'fridge',         // Mini Fridge
  'TN06': 'tv-32',          // TV 32 inch
  'TN07': 'tv-42',          // TV 42 inch
  'TN08': 'tv-50',          // TV 50 inch
  'TN09': 'single-sofa',    // Single sofa
  'TN10': 'double-sofa',    // Double sofa
  'TN11': 'bathtub',        // Bathtub
  'TN12': 'shower',         // Separate shower
  'TN13': 'balcony',        // Private balcony
  'TN14': 'coffee-machine', // Coffee machine
  'TN15': 'coffee-set',     // Coffee set
  'TN16': 'city-view',      // City/Pool view
  'TN17': 'living-room',    // Separate living room
  'TN18': 'jacuzzi',        // Jacuzzi
  'TN19': 'mini-bar',       // Mini bar
  'TN20': 'bluetooth-speaker', // Bluetooth speaker
  'TN22': 'dining-area',    // Private dining area
  'TN23': 'work-table',     // Work Table

  // Icon name mappings
  'wifi': 'wifi',
  'tv': 'tv',
  'ac': 'ac',
  'fridge': 'fridge',
  'tv-32': 'tv-32',
  'tv-42': 'tv-42',
  'tv-50': 'tv-50',
  'single-sofa': 'single-sofa',
  'double-sofa': 'double-sofa',
  'bathtub': 'bathtub',
  'shower': 'shower',
  'balcony': 'balcony',
  'coffee-machine': 'coffee-machine',
  'coffee-set': 'coffee-set',
  'city-view': 'city-view',
  'living-room': 'living-room',
  'jacuzzi': 'jacuzzi',
  'mini-bar': 'mini-bar',
  'bluetooth-speaker': 'bluetooth-speaker',
  'dining-area': 'dining-area',
  'work-table': 'work-table',

  // Fallback mappings for old data
  '/icons/wifi.png': 'wifi',
  '/icons/tv.png': 'tv',
  '/icons/ac.png': 'ac',
  '/icons/fridge.png': 'fridge',
  '/icons/safe.png': 'security'
}

// Lấy icon component từ tên (fallback cho LONGBLOB)
export const getAmenityIcon = (iconName, className = "w-5 h-5") => {
  // Map database icon name to frontend value
  const mappedIconName = ICON_MAPPING[iconName] || iconName

  const iconOption = AMENITY_ICONS.find(option => option.value === mappedIconName)
  if (iconOption) {
    const IconComponent = iconOption.icon
    return <IconComponent className={className} />
  }

  // Fallback icon với tooltip hiển thị tên icon không tìm thấy
  return (
    <div
      className={`${className} bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600`}
      title={`Icon not found: ${iconName}`}
    >
      ?
    </div>
  )
}

// Lấy icon từ LONGBLOB data hoặc fallback
export const getAmenityIconFromBlob = (blobData, iconName, className = "w-5 h-5") => {
  // Nếu có blob data, render SVG từ base64
  if (blobData) {
    try {
      // Convert blob data to base64 string if needed
      let base64String = blobData
      if (blobData instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(blobData)
        base64String = btoa(String.fromCharCode.apply(null, uint8Array))
      }

      // Decode base64 to SVG string
      const svgString = atob(base64String)

      // Create SVG element with proper styling
      return (
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: svgString }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        />
      )
    } catch (error) {
      console.warn('Failed to render blob icon:', error)
      // Fall back to mapped icon
    }
  }

  // Fallback to mapped icon
  return getAmenityIcon(iconName, className)
}

// Lấy label từ tên icon
export const getAmenityLabel = (iconName) => {
  const iconOption = AMENITY_ICONS.find(option => option.value === iconName)
  return iconOption ? iconOption.label : iconName
}

// Lấy icons theo category
export const getIconsByCategory = (category) => {
  return AMENITY_ICONS.filter(icon => icon.category === category)
}

// Lấy tất cả categories
export const getCategories = () => {
  const categories = [...new Set(AMENITY_ICONS.map(icon => icon.category))]
  return categories.map(cat => ({
    value: cat,
    label: getCategoryLabel(cat)
  }))
}

// Mapping category labels
const getCategoryLabel = (category) => {
  const categoryLabels = {
    basic: 'Tiện ích cơ bản',
    dining: 'Ăn uống',
    entertainment: 'Giải trí',
    service: 'Dịch vụ',
    comfort: 'Tiện nghi',
    location: 'Vị trí',
    special: 'Đặc biệt',
    business: 'Kinh doanh',
    shopping: 'Mua sắm',
    furniture: 'Nội thất',
    bathroom: 'Phòng tắm',
    room: 'Tiện ích phòng'
  }
  return categoryLabels[category] || category
}
