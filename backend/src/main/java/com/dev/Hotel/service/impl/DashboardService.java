package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.PhongRepository;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.repo.HoaDonRepository;
import com.dev.Hotel.service.interfac.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DashboardService implements IDashboardService {

    @Autowired
    private PhieuDatRepository phieuDatRepository;
    
    @Autowired
    private PhieuThueRepository phieuThueRepository;
    
    @Autowired
    private PhongRepository phongRepository;
    
    @Autowired
    private NhanVienRepository nhanVienRepository;
    
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Override
    public Response getStaffStats() {
        Response response = new Response();
        try {
            Map<String, Object> stats = new HashMap<>();

            // Thống kê phòng sử dụng các method mới từ PhongRepository
            long totalRooms = phongRepository.count();
            long availableRooms = phongRepository.countAvailableRooms(); // Phòng trống
            long occupiedRooms = phongRepository.countOccupiedRooms(); // Phòng đã có khách
            long maintenanceRooms = phongRepository.countMaintenanceRooms(); // Phòng đang bảo trì
            long cleaningRooms = phongRepository.countCleaningRooms(); // Phòng đang dọn dẹp

            // Thống kê đặt phòng hôm nay
            LocalDate today = LocalDate.now();
            long todayBookings = phieuDatRepository.countByNgayDat(today); // Phiếu đặt mới nhận hôm nay
            // Sử dụng các trạng thái có thể có trong hệ thống
            long pendingBookings = phieuDatRepository.countByTrangThai("Chờ xác nhận");
            long confirmedBookings = phieuDatRepository.countByTrangThai("Xác nhận");

            long todayCheckIns = phieuDatRepository.countByNgayBdThueAndTrangThai(today, "Xác nhận");
            long todayCheckOuts = phieuThueRepository.countByNgayTraPhong(today);

            long occupancyRate = totalRooms > 0 ? Math.round((double) occupiedRooms / totalRooms * 100) : 0;

            // Đưa tất cả thống kê vào response
            stats.put("totalRooms", totalRooms);
            stats.put("availableRooms", availableRooms);
            stats.put("occupiedRooms", occupiedRooms);
            stats.put("maintenanceRooms", maintenanceRooms);
            stats.put("cleaningRooms", cleaningRooms);
            stats.put("occupancyRate", occupancyRate);
            stats.put("todayBookings", todayBookings);
            stats.put("pendingBookings", pendingBookings);
            stats.put("confirmedBookings", confirmedBookings);
            stats.put("todayCheckIns", todayCheckIns);
            stats.put("todayCheckOuts", todayCheckOuts);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStats(stats);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê staff: " + e.getMessage());
            e.printStackTrace(); // Log chi tiết lỗi để debug
        }
        return response;
    }

    @Override
    public Response getStaffActivities() {
        Response response = new Response();
        try {
            // Không dùng dữ liệu mẫu - trả về empty list
            List<Map<String, Object>> activities = new ArrayList<>();

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(activities);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hoạt động staff: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getStaffTasks() {
        Response response = new Response();
        try {
            // Không dùng dữ liệu mẫu - trả về empty list
            List<Map<String, Object>> tasks = new ArrayList<>();

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setTasks(tasks);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy nhiệm vụ staff: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAdminStats() {
        Response response = new Response();
        try {
            // Implementation for admin stats - placeholder for now
            Map<String, Object> stats = new HashMap<>();
            stats.put("message", "Admin stats endpoint - to be implemented");
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStats(stats);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê admin: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAdminTopPerformers() {
        Response response = new Response();
        try {
            // Implementation for admin top performers - placeholder for now
            List<Map<String, Object>> performers = new ArrayList<>();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(performers);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy top performers: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAdminRevenueData() {
        Response response = new Response();
        try {
            // Implementation for admin revenue data - placeholder for now
            List<Map<String, Object>> revenueData = new ArrayList<>();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(revenueData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy dữ liệu doanh thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCustomerStats(String cccd) {
        Response response = new Response();
        try {
            // Implementation for customer stats - placeholder for now
            Map<String, Object> stats = new HashMap<>();
            stats.put("message", "Customer stats endpoint - to be implemented");
            stats.put("cccd", cccd);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStats(stats);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRecentCustomers() {
        Response response = new Response();
        try {
            // Không dùng dữ liệu mẫu - trả về empty list
            List<Map<String, Object>> recentCustomers = new ArrayList<>();

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(recentCustomers);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách hàng gần đây: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckIns() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();

            // Lấy danh sách phiếu đặt có ngày bắt đầu thuê hôm nay và đã được xác nhận
            // NHƯNG chưa check-in (chưa có phiếu thuê)
            List<PhieuDat> allTodayBookings = phieuDatRepository.findByNgayBdThueAndTrangThai(today, "Xác nhận");

            // Lọc ra những phiếu đặt chưa có phiếu thuê (chưa check-in)
            // Kiểm tra xem có PhieuThue nào có ID_PD = phieuDat.idPd không
            List<PhieuDat> todayCheckInList = allTodayBookings.stream()
                .filter(pd -> {
                    // Kiểm tra xem phiếu đặt này đã có phiếu thuê chưa
                    List<PhieuThue> existingRentals = phieuThueRepository.findByPhieuDat(pd);
                    return existingRentals.isEmpty();
                })
                .collect(java.util.stream.Collectors.toList());

            List<Map<String, Object>> checkInData = new ArrayList<>();

            for (PhieuDat pd : todayCheckInList) {
                Map<String, Object> checkIn = new HashMap<>();
                checkIn.put("idPd", pd.getIdPd());
                checkIn.put("ngayBdThue", pd.getNgayBdThue());
                checkIn.put("ngayDi", pd.getNgayDi());
                checkIn.put("trangThai", pd.getTrangThai());

                // Thông tin khách hàng
                String hoTen = "";
                if (pd.getKhachHang() != null) {
                    String ho = pd.getKhachHang().getHo() != null ? pd.getKhachHang().getHo() : "";
                    String ten = pd.getKhachHang().getTen() != null ? pd.getKhachHang().getTen() : "";
                    hoTen = (ho + " " + ten).trim();
                }
                checkIn.put("hoTenKhachHang", hoTen);

                checkIn.put("sdtKhachHang", pd.getKhachHang() != null ? pd.getKhachHang().getSdt() : "");
                checkIn.put("emailKhachHang", pd.getKhachHang() != null ? pd.getKhachHang().getEmail() : "");
                checkIn.put("cccd", pd.getKhachHang() != null ? pd.getKhachHang().getCccd() : "");

                // Tính số ngày thuê
                int soNgayThue = 0;
                if (pd.getNgayBdThue() != null && pd.getNgayDi() != null) {
                    soNgayThue = (int) java.time.temporal.ChronoUnit.DAYS.between(pd.getNgayBdThue(), pd.getNgayDi());
                }
                checkIn.put("soNgayThue", soNgayThue);

                checkInData.add(checkIn);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(checkInData);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách check-in hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckOuts() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();

            // Lấy danh sách phiếu thuê có ngày trả phòng hôm nay
            // NHƯNG chưa xuất hóa đơn (chưa check-out)
            List<PhieuThue> allTodayCheckOuts = phieuThueRepository.findByNgayTraPhong(today);

            // Lọc ra những phiếu thuê chưa có hóa đơn (chưa check-out)
            List<PhieuThue> todayCheckOutList = allTodayCheckOuts.stream()
                .filter(pt -> {
                    // Kiểm tra xem phiếu thuê này đã có hóa đơn chưa
                    return hoaDonRepository.findByPhieuThue(pt).isEmpty();
                })
                .collect(java.util.stream.Collectors.toList());

            // Convert to Map để tránh lỗi EntityDTOMapper
            List<Map<String, Object>> checkOutData = new ArrayList<>();
            for (PhieuThue pt : todayCheckOutList) {
                Map<String, Object> checkOut = new HashMap<>();
                checkOut.put("idPt", pt.getIdPt());
                checkOut.put("ngayLap", pt.getNgayLap());
                // Lấy ngayDen và ngayDi từ CtPhieuThue
                LocalDate ngayDenSomNhat = null;
                LocalDate ngayDiMuonNhat = null;
                if (pt.getChiTietPhieuThue() != null && !pt.getChiTietPhieuThue().isEmpty()) {
                    ngayDenSomNhat = pt.getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDen())
                        .filter(date -> date != null)
                        .min(LocalDate::compareTo)
                        .orElse(null);

                    ngayDiMuonNhat = pt.getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDi())
                        .filter(date -> date != null)
                        .max(LocalDate::compareTo)
                        .orElse(null);
                }
                checkOut.put("ngayDen", ngayDenSomNhat);
                checkOut.put("ngayDi", ngayDiMuonNhat);
                checkOut.put("cccd", pt.getKhachHang() != null ? pt.getKhachHang().getCccd() : "");

                // Ghép họ và tên
                String hoTen = "";
                if (pt.getKhachHang() != null) {
                    hoTen = (pt.getKhachHang().getHo() != null ? pt.getKhachHang().getHo() : "") +
                           " " + (pt.getKhachHang().getTen() != null ? pt.getKhachHang().getTen() : "");
                    hoTen = hoTen.trim();
                }
                checkOut.put("hoTenKhachHang", hoTen);

                checkOut.put("sdtKhachHang", pt.getKhachHang() != null ? pt.getKhachHang().getSdt() : "");
                checkOut.put("emailKhachHang", pt.getKhachHang() != null ? pt.getKhachHang().getEmail() : "");

                // Tính số ngày thuê
                int soNgayThue = 0;
                if (ngayDenSomNhat != null && ngayDiMuonNhat != null) {
                    soNgayThue = (int) java.time.temporal.ChronoUnit.DAYS.between(ngayDenSomNhat, ngayDiMuonNhat);
                }
                checkOut.put("soNgayThue", soNgayThue);

                checkOutData.add(checkOut);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(checkOutData);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách check-out hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPendingReservations() {
        Response response = new Response();
        try {
            // Không dùng dữ liệu mẫu - trả về empty list
            List<Map<String, Object>> pendingReservations = new ArrayList<>();

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setActivities(pendingReservations);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách đặt phòng chờ xử lý: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentGuests() {
        Response response = new Response();
        try {
            // Lấy tất cả phiếu thuê đã có khách check-in (có ngày lập) nhưng chưa check-out
            // Bao gồm cả những phiếu đã quá ngày dự kiến (có thể thuê thêm)
            List<PhieuThue> currentRentals = phieuThueRepository.findByNgayLapIsNotNull();

            List<Map<String, Object>> currentGuestsList = new ArrayList<>();

            for (PhieuThue phieuThue : currentRentals) {
                Map<String, Object> guestInfo = new HashMap<>();
                guestInfo.put("idPhieuThue", phieuThue.getIdPt());
                // Thông tin khách hàng - sử dụng HashMap thay vì Map.of để tránh lỗi
                Map<String, Object> khachHang = new HashMap<>();
                if (phieuThue.getKhachHang() != null) {
                    khachHang.put("cccd", phieuThue.getKhachHang().getCccd());
                    khachHang.put("hoTen", phieuThue.getKhachHang().getHo() + " " + phieuThue.getKhachHang().getTen());
                    khachHang.put("sdt", phieuThue.getKhachHang().getSdt() != null ? phieuThue.getKhachHang().getSdt() : "");
                    khachHang.put("email", phieuThue.getKhachHang().getEmail() != null ? phieuThue.getKhachHang().getEmail() : "");
                }
                guestInfo.put("khachHang", khachHang);
                // Lấy ngayDen và ngayDi từ CtPhieuThue
                LocalDate ngayDenSomNhat = null;
                LocalDate ngayDiMuonNhat = null;
                if (phieuThue.getChiTietPhieuThue() != null && !phieuThue.getChiTietPhieuThue().isEmpty()) {
                    ngayDenSomNhat = phieuThue.getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDen())
                        .filter(date -> date != null)
                        .min(LocalDate::compareTo)
                        .orElse(null);

                    ngayDiMuonNhat = phieuThue.getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDi())
                        .filter(date -> date != null)
                        .max(LocalDate::compareTo)
                        .orElse(null);
                }

                guestInfo.put("ngayDen", ngayDenSomNhat);
                guestInfo.put("ngayDi", ngayDiMuonNhat);
                guestInfo.put("ngayLap", phieuThue.getNgayLap()); // Ngày check-in thực tế

                // Kiểm tra xem có quá ngày dự kiến không với logic mới
                LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
                boolean isOverdue = false;
                long overdueHours = 0;
                String overdueStatus = "";

                if (ngayDiMuonNhat != null) {
                    LocalDateTime expectedCheckOut = ngayDiMuonNhat.atTime(12, 0); // 12h trưa

                    if (now.isAfter(expectedCheckOut)) {
                        isOverdue = true;
                        overdueHours = ChronoUnit.HOURS.between(expectedCheckOut, now);

                        if (overdueHours < 24) {
                            overdueStatus = overdueHours + " giờ";
                        } else {
                            long days = overdueHours / 24;
                            long remainingHours = overdueHours % 24;
                            if (remainingHours > 0) {
                                overdueStatus = days + " ngày " + remainingHours + " giờ";
                            } else {
                                overdueStatus = days + " ngày";
                            }
                        }
                    }
                }

                guestInfo.put("isOverdue", isOverdue);
                guestInfo.put("overdueDays", overdueHours / 24); // Giữ nguyên field này cho backward compatibility
                guestInfo.put("overdueStatus", overdueStatus);

                // Lấy danh sách phòng
                if (phieuThue.getChiTietPhieuThue() != null) {
                    List<Map<String, Object>> rooms = new ArrayList<>();
                    for (var ct : phieuThue.getChiTietPhieuThue()) {
                        Map<String, Object> room = new HashMap<>();
                        room.put("soPhong", ct.getPhong().getSoPhong());
                        // Tạm thời bỏ qua loại phòng vì có vấn đề với entity mapping
                        room.put("tenLoaiPhong", "Phòng");
                        rooms.add(room);
                    }
                    guestInfo.put("danhSachPhong", rooms);
                }

                currentGuestsList.add(guestInfo);
            }

            response.setStatusCode(200);
            response.setMessage("Lấy danh sách khách đang lưu trú thành công");
            response.setActivities(currentGuestsList); // Sử dụng activities thay vì phieuThueList

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách đang lưu trú: " + e.getMessage());
        }
        return response;
    }
}
