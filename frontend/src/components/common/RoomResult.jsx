import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const RoomResult = ({ roomSearchResults }) => {
    const navigate = useNavigate();
    const isAdmin = authService.isAdmin();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomSearchResults && roomSearchResults.length > 0 && 
                roomSearchResults.map(room => (
                    <div key={room.soPhong} className="card hover:shadow-lg transition-shadow">
                        <img 
                            className='w-full h-48 object-cover rounded-lg mb-4' 
                            src={`/api/placeholder/400/300`} 
                            alt={room.tenKp || 'Room'} 
                        />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Phòng {room.soPhong}
                            </h3>
                            <p className="text-gray-600">
                                {room.tenKp} - {room.tenLp}
                            </p>
                            <p className="text-gray-600">
                                Tầng: {room.tang}
                            </p>
                            <p className="text-sm text-gray-500">
                                Trạng thái: {room.tenTrangThai}
                            </p>
                        </div>

                        <div className='mt-4'>
                            {isAdmin ? (
                                <button
                                    className="btn-secondary w-full"
                                    onClick={() => navigate(`/admin/rooms/edit/${room.soPhong}`)}
                                >
                                    Chỉnh sửa phòng
                                </button>
                            ) : (
                                <button
                                    className="btn-primary w-full"
                                    onClick={() => navigate(`/rooms/${room.soPhong}`)}
                                >
                                    Xem chi tiết / Đặt phòng
                                </button>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default RoomResult;
