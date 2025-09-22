import React from 'react'
import { AlertCircle, Database } from 'lucide-react'

const DataNotAvailable = ({ 
  title = "Dữ liệu chưa sẵn sàng", 
  message = "Tính năng này đang được phát triển. Vui lòng liên hệ admin để biết thêm chi tiết.",
  showIcon = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      {showIcon && (
        <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Database className="w-8 h-8 text-yellow-600" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-600 text-center max-w-md mb-4">
        {message}
      </p>
      
      <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-md">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span>API endpoint đang được phát triển</span>
      </div>
    </div>
  )
}

export default DataNotAvailable
