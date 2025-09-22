import {
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Wrench,
  CheckCircle,
  Home,
  Sparkles,
  FileText
} from 'lucide-react'

const StaffStatsCards = ({ stats }) => {
  const statsCards = [
    // Hàng 1: Hoạt động hôm nay
    {
      title: 'Phiếu đặt mới hôm nay',
      value: stats.todayBookings || 0,
      icon: FileText,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Phiếu đặt nhận trong ngày'
    },
    {
      title: 'Check-in hôm nay',
      value: stats.checkInsToday || 0,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Check-out hôm nay',
      value: stats.checkOutsToday || 0,
      icon: Clock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },

    // Hàng 2: Tình trạng phòng
    {
      title: 'Phòng còn trống',
      value: stats.availableRooms || 0,
      icon: CheckCircle,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Phòng đã có khách',
      value: stats.occupiedRooms || 0,
      icon: Home,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Phòng đang dọn dẹp',
      value: stats.cleaningRooms || 0,
      icon: Sparkles,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },

    // Hàng 3: Đặt phòng và bảo trì
    {
      title: 'Đặt phòng khả dụng',
      value: stats.totalReservations || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Đã xác nhận, chưa check-in'
    },
    {
      title: 'Đặt phòng chờ xử lý',
      value: stats.pendingReservations || 0,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Chờ xác nhận'
    },
    {
      title: 'Phòng đang bảo trì',
      value: stats.maintenanceRooms || 0,
      icon: Wrench,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div key={index} className={`card ${card.bgColor}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value.toLocaleString()}
                </p>
                {card.description && (
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StaffStatsCards
