package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.Phong;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.TrangThai;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.KieuPhong;
import com.dev.Hotel.entity.LoaiPhong;
import com.dev.Hotel.entity.CtPhieuDat;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhongRepository;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.TrangThaiRepository;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.CtPhieuDatRepository;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.repo.KieuPhongRepository;
import com.dev.Hotel.repo.LoaiPhongRepository;
import com.dev.Hotel.service.interfac.IPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PhongService implements IPhongService {
    
    @Autowired
    private PhongRepository phongRepository;
    
    @Autowired
    private HangPhongRepository hangPhongRepository;
    
    @Autowired
    private TrangThaiRepository trangThaiRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private PhieuDatRepository phieuDatRepository;

    @Autowired
    private CtPhieuDatRepository ctPhieuDatRepository;

    @Autowired
    private KieuPhongRepository kieuPhongRepository;

    @Autowired
    private LoaiPhongRepository loaiPhongRepository;
    
    @Override
    public Response getAllPhong() {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongById(String soPhong) {
        Response response = new Response();
        try {
            Phong phong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(phong));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhongDetails(String soPhong) {
        Response response = new Response();
        try {
            // Sử dụng query với EAGER loading để lấy đầy đủ thông tin
            List<Phong> phongList = phongRepository.findAllWithTrangThai();
            Phong phong = phongList.stream()
                .filter(p -> p.getSoPhong().equals(soPhong))
                .findFirst()
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(phong));
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin chi tiết phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response createPhong(Phong phong) {
        Response response = new Response();
        try {
            if (phongRepository.existsById(phong.getSoPhong())) {
                throw new OurException("Số phòng đã tồn tại: " + phong.getSoPhong());
            }
            
            Phong savedPhong = phongRepository.save(phong);
            response.setStatusCode(200);
            response.setMessage("Tạo phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(savedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updatePhong(String soPhong, Phong phong) {
        Response response = new Response();
        try {
            Phong existingPhong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            existingPhong.setTang(phong.getTang());
            existingPhong.setHangPhong(phong.getHangPhong());
            existingPhong.setTrangThai(phong.getTrangThai());
            
            Phong updatedPhong = phongRepository.save(existingPhong);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(updatedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response deletePhong(String soPhong) {
        Response response = new Response();
        try {
            phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            phongRepository.deleteById(soPhong);
            response.setStatusCode(200);
            response.setMessage("Xóa phòng thành công");
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getAvailableRooms() {
        Response response = new Response();
        try {
            List<Phong> availableRooms = phongRepository.findAvailableRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(availableRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng trống: " + e.getMessage());
        }
        return response;
    }

    public Response getOccupiedRooms() {
        Response response = new Response();
        try {
            List<Phong> occupiedRooms = phongRepository.findOccupiedRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(occupiedRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đã có khách: " + e.getMessage());
        }
        return response;
    }

    public Response getMaintenanceRooms() {
        Response response = new Response();
        try {
            List<Phong> maintenanceRooms = phongRepository.findMaintenanceRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(maintenanceRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đang bảo trì: " + e.getMessage());
        }
        return response;
    }

    public Response getCleaningRooms() {
        Response response = new Response();
        try {
            List<Phong> cleaningRooms = phongRepository.findCleaningRooms();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(cleaningRooms));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng đang dọn dẹp: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getAvailableRoomsByDateRange(LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            // Lấy TẤT CẢ phòng với eager loading cho trangThai
            List<Phong> allRooms = phongRepository.findAllWithTrangThai();

            if (checkIn == null || checkOut == null) {
                // Nếu không có ngày, trả về tất cả phòng với trạng thái hiện tại
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setPhongList(EntityDTOMapper.mapPhongListToDTO(allRooms));
                return response;
            }

            // Đếm số phòng cần đặt theo kiểu phòng + loại phòng trong khoảng thời gian
            Map<String, Integer> bookingsByCategory = countBookingsByRoomCategoryInDateRange(checkIn, checkOut);

            // Tạo danh sách phòng với trạng thái được cập nhật theo khoảng thời gian
            List<Phong> roomsWithUpdatedStatus = new ArrayList<>();

            // Phân loại phòng trống theo kiểu phòng + loại phòng
            Map<String, List<Phong>> availableRoomsByCategory = new HashMap<>();
            for (Phong phong : allRooms) {
                if ("Trống".equals(phong.getTrangThai().getTenTrangThai())) {
                    String categoryKey = phong.getHangPhong().getKieuPhong().getIdKp() + "_" +
                                       phong.getHangPhong().getLoaiPhong().getIdLp();
                    availableRoomsByCategory.computeIfAbsent(categoryKey, k -> new ArrayList<>()).add(phong);
                }
            }

            for (int i = 0; i < allRooms.size(); i++) {
                Phong phong = allRooms.get(i);

                // Clone phòng để không thay đổi entity gốc
                Phong roomCopy = new Phong();
                roomCopy.setSoPhong(phong.getSoPhong());
                roomCopy.setTang(phong.getTang());
                roomCopy.setHangPhong(phong.getHangPhong());

                // Kiểm tra trạng thái phòng hiện tại
                String currentStatus = phong.getTrangThai() != null ? phong.getTrangThai().getTenTrangThai() : "Unknown";
                String categoryKey = phong.getHangPhong().getKieuPhong().getIdKp() + "_" +
                                   phong.getHangPhong().getLoaiPhong().getIdLp();

                // Kiểm tra xem phòng này có cần mark là "Đã đặt" không
                boolean shouldMarkAsBooked = false;
                if ("Trống".equals(currentStatus) && bookingsByCategory.containsKey(categoryKey)) {
                    List<Phong> availableRoomsOfCategory = availableRoomsByCategory.get(categoryKey);
                    int bookedCountForCategory = bookingsByCategory.get(categoryKey);

                    if (availableRoomsOfCategory != null) {
                        int roomIndexInCategory = availableRoomsOfCategory.indexOf(phong);
                        shouldMarkAsBooked = roomIndexInCategory >= 0 && roomIndexInCategory < bookedCountForCategory;
                    }
                }

                if (shouldMarkAsBooked) {
                    // Tạo trạng thái "Đã đặt" tạm thời
                    TrangThai bookedStatus = new TrangThai();
                    bookedStatus.setIdTt("TT02"); // ID cho "Đã đặt"
                    bookedStatus.setTenTrangThai("Đã đặt");
                    roomCopy.setTrangThai(bookedStatus);
                } else {
                    // Giữ nguyên trạng thái hiện tại
                    roomCopy.setTrangThai(phong.getTrangThai());
                }

                roomsWithUpdatedStatus.add(roomCopy);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(roomsWithUpdatedStatus));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByHangPhong(Integer idHangPhong) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByHangPhongId(idHangPhong);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo hạng phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByTang(Integer tang) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByTang(tang);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo tầng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getPhongByTrangThai(String idTrangThai) {
        Response response = new Response();
        try {
            List<Phong> phongList = phongRepository.findByTrangThaiId(idTrangThai);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(phongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phòng theo trạng thái: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response updateRoomStatus(String soPhong, String idTrangThai) {
        Response response = new Response();
        try {
            Phong phong = phongRepository.findById(soPhong)
                .orElseThrow(() -> new OurException("Phòng không tồn tại"));
            
            var trangThai = trangThaiRepository.findById(idTrangThai)
                .orElseThrow(() -> new OurException("Trạng thái không tồn tại"));
            
            phong.setTrangThai(trangThai);
            Phong updatedPhong = phongRepository.save(phong);
            
            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái phòng thành công");
            response.setPhong(EntityDTOMapper.mapPhongToDTO(updatedPhong));
            
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái phòng: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getRoomsByType(String idKieuPhong) {
        Response response = new Response();
        try {
            // This would require a custom query
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response getRoomsByCategory(String idLoaiPhong) {
        Response response = new Response();
        try {
            // This would require a custom query
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response searchRooms(String keyword) {
        Response response = new Response();
        try {
            // Implementation for room search
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response filterRooms(Integer tang, String idHangPhong, String idTrangThai) {
        Response response = new Response();
        try {
            // Implementation for room filtering
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public boolean isRoomAvailable(String soPhong, LocalDate checkIn, LocalDate checkOut) {
        try {
            // Implementation for checking room availability
            return true; // Placeholder
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Response checkRoomAvailability(String soPhong, LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            boolean isAvailable = isRoomAvailable(soPhong, checkIn, checkOut);
            response.setStatusCode(200);
            response.setMessage(isAvailable ? "Phòng có sẵn" : "Phòng không có sẵn");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra tình trạng phòng: " + e.getMessage());
        }
        return response;
    }

    // Helper method để đếm số phòng cần đặt theo kiểu phòng + loại phòng trong khoảng thời gian
    private Map<String, Integer> countBookingsByRoomCategoryInDateRange(LocalDate checkIn, LocalDate checkOut) {
        Map<String, Integer> bookingsByCategory = new HashMap<>();

        try {
            // Đếm booking theo PhieuDat (tạm thời, sau này sẽ dùng CtPhieuDat khi có dữ liệu)
            List<PhieuDat> confirmedBookings = phieuDatRepository.findByTrangThai("Xác nhận");

            for (PhieuDat booking : confirmedBookings) {
                if (booking.getNgayBdThue() != null && booking.getNgayDi() != null) {
                    // Kiểm tra overlap: (start1 < end2) && (start2 < end1)
                    if (booking.getNgayBdThue().isBefore(checkOut) && checkIn.isBefore(booking.getNgayDi())) {
                        // Tạo key từ kiểu phòng + loại phòng (giả sử có trong booking)
                        // Tạm thời dùng logic đơn giản, sau này sẽ lấy từ CtPhieuDat
                        String categoryKey = "DEFAULT"; // Sẽ được thay thế bằng logic thực tế
                        bookingsByCategory.put(categoryKey, bookingsByCategory.getOrDefault(categoryKey, 0) + 1);
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error counting bookings by room category: " + e.getMessage());
        }

        return bookingsByCategory;
    }

    @Override
    public Response getAvailableRoomsByDateRange(LocalDate checkIn, LocalDate checkOut, String idKp, String idLp) {
        Response response = new Response();
        try {
            // Get all rooms
            List<Phong> allRooms = phongRepository.findAllWithTrangThai();

            // Filter by KieuPhong and LoaiPhong if provided
            if (idKp != null && !idKp.trim().isEmpty()) {
                allRooms = allRooms.stream()
                    .filter(phong -> phong.getHangPhong().getKieuPhong().getIdKp().equals(idKp))
                    .collect(java.util.stream.Collectors.toList());
            }

            if (idLp != null && !idLp.trim().isEmpty()) {
                allRooms = allRooms.stream()
                    .filter(phong -> phong.getHangPhong().getLoaiPhong().getIdLp().equals(idLp))
                    .collect(java.util.stream.Collectors.toList());
            }

            if (allRooms.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Không có phòng nào phù hợp với tiêu chí lọc");
                response.setPhongList(new ArrayList<>());
                return response;
            }

            // Apply the same booking logic as the original method
            Map<String, Integer> bookingsByCategory = countBookingsByRoomCategoryInDateRange(checkIn, checkOut);
            List<Phong> roomsWithUpdatedStatus = new ArrayList<>();

            // Phân loại phòng trống theo kiểu phòng + loại phòng
            Map<String, List<Phong>> availableRoomsByCategory = new HashMap<>();
            for (Phong phong : allRooms) {
                if ("Trống".equals(phong.getTrangThai().getTenTrangThai())) {
                    String categoryKey = phong.getHangPhong().getKieuPhong().getIdKp() + "_" +
                                       phong.getHangPhong().getLoaiPhong().getIdLp();
                    availableRoomsByCategory.computeIfAbsent(categoryKey, k -> new ArrayList<>()).add(phong);
                }
            }

            // Mark phòng theo hạng phòng dựa trên booking
            for (Phong phong : allRooms) {
                // Clone phòng để không thay đổi entity gốc
                Phong roomCopy = new Phong();
                roomCopy.setSoPhong(phong.getSoPhong());
                roomCopy.setTang(phong.getTang());
                roomCopy.setHangPhong(phong.getHangPhong());

                // Kiểm tra trạng thái phòng hiện tại
                String currentStatus = phong.getTrangThai() != null ? phong.getTrangThai().getTenTrangThai() : "Unknown";
                String categoryKey = phong.getHangPhong().getKieuPhong().getIdKp() + "_" +
                                   phong.getHangPhong().getLoaiPhong().getIdLp();

                // Kiểm tra xem phòng này có cần mark là "Đã đặt" không
                boolean shouldMarkAsBooked = false;
                if ("Trống".equals(currentStatus) && bookingsByCategory.containsKey(categoryKey)) {
                    List<Phong> availableRoomsOfCategory = availableRoomsByCategory.get(categoryKey);
                    int bookedCountForCategory = bookingsByCategory.get(categoryKey);

                    if (availableRoomsOfCategory != null) {
                        int roomIndexInCategory = availableRoomsOfCategory.indexOf(phong);
                        shouldMarkAsBooked = roomIndexInCategory >= 0 && roomIndexInCategory < bookedCountForCategory;
                    }
                }

                if (shouldMarkAsBooked) {
                    // Tạo trạng thái "Đã đặt" tạm thời
                    TrangThai bookedStatus = new TrangThai();
                    bookedStatus.setIdTt("TT02"); // ID cho "Đã đặt"
                    bookedStatus.setTenTrangThai("Đã đặt");
                    roomCopy.setTrangThai(bookedStatus);
                } else {
                    // Giữ nguyên trạng thái hiện tại
                    roomCopy.setTrangThai(phong.getTrangThai());
                }

                roomsWithUpdatedStatus.add(roomCopy);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(roomsWithUpdatedStatus));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng có sẵn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateRoomTypeAndCategory(String soPhong, String idKieuPhong, String idLoaiPhong) {
        Response response = new Response();
        try {
            Phong phong = phongRepository.findById(soPhong).orElse(null);
            if (phong != null) {
                // Validate that both idKieuPhong and idLoaiPhong are provided
                if (idKieuPhong == null || idKieuPhong.trim().isEmpty() ||
                    idLoaiPhong == null || idLoaiPhong.trim().isEmpty()) {
                    response.setStatusCode(400);
                    response.setMessage("Cần cung cấp cả kiểu phòng và loại phòng");
                    return response;
                }

                // Find KieuPhong and LoaiPhong
                KieuPhong kieuPhong = kieuPhongRepository.findById(idKieuPhong).orElse(null);
                LoaiPhong loaiPhong = loaiPhongRepository.findById(idLoaiPhong).orElse(null);

                if (kieuPhong == null) {
                    response.setStatusCode(404);
                    response.setMessage("Không tìm thấy kiểu phòng với ID: " + idKieuPhong);
                    return response;
                }

                if (loaiPhong == null) {
                    response.setStatusCode(404);
                    response.setMessage("Không tìm thấy loại phòng với ID: " + idLoaiPhong);
                    return response;
                }

                // Find existing HangPhong with the new KieuPhong and LoaiPhong combination
                List<HangPhong> existingHangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(idKieuPhong, idLoaiPhong);

                HangPhong targetHangPhong;
                if (!existingHangPhongList.isEmpty()) {
                    // Use existing HangPhong
                    targetHangPhong = existingHangPhongList.get(0);
                } else {
                    // Create new HangPhong
                    HangPhong newHangPhong = new HangPhong();
                    newHangPhong.setKieuPhong(kieuPhong);
                    newHangPhong.setLoaiPhong(loaiPhong);
                    targetHangPhong = hangPhongRepository.save(newHangPhong);
                }

                // Update the room's HangPhong
                phong.setHangPhong(targetHangPhong);
                Phong updatedPhong = phongRepository.save(phong);

                response.setStatusCode(200);
                response.setMessage("Cập nhật kiểu phòng và loại phòng thành công");
                response.setPhong(EntityDTOMapper.mapPhongToDTO(updatedPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phòng với số phòng: " + soPhong);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phòng: " + e.getMessage());
        }
        return response;
    }
}
