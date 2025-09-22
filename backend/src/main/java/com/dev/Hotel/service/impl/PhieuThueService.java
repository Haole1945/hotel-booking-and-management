package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.CheckInWalkInRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.PhieuThueDetailsDTO;
import com.dev.Hotel.entity.*;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.*;
import com.dev.Hotel.service.interfac.IPhieuDatService;
import com.dev.Hotel.service.interfac.IPhieuThueService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.dev.Hotel.dto.PhieuThueDTO;
import java.util.List;

@Service
public class PhieuThueService implements IPhieuThueService {

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private PhieuDatRepository phieuDatRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private PhongRepository phongRepository;

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Autowired
    private TrangThaiRepository trangThaiRepository;

    @Autowired
    private CTKhachORepository ctKhachORepository;

    @Autowired
    private IPhieuDatService phieuDatService;

    @Autowired
    private CtDichVuRepository ctDichVuRepository;

    @Autowired
    private CtPhuThuRepository ctPhuThuRepository;

    @Autowired
    private RoomPricingService roomPricingService;

    @Override
    public Response getAllPhieuThue() {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueById(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(phieuThue));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createPhieuThue(PhieuThue phieuThue) {
        Response response = new Response();
        try {
            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);
            response.setStatusCode(200);
            response.setMessage("Tạo phiếu thuê thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updatePhieuThue(Integer idPt, PhieuThue phieuThue) {
        Response response = new Response();
        try {
            PhieuThue existingPhieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            // Update fields (ngayDen và ngayDi giờ được quản lý trong CtPhieuThue)
            existingPhieuThue.setNgayLap(phieuThue.getNgayLap());
            existingPhieuThue.setKhachHang(phieuThue.getKhachHang());
            existingPhieuThue.setNhanVien(phieuThue.getNhanVien());
            existingPhieuThue.setPhieuDat(phieuThue.getPhieuDat());

            PhieuThue updatedPhieuThue = phieuThueRepository.save(existingPhieuThue);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phiếu thuê thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(updatedPhieuThue));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deletePhieuThue(Integer idPt) {
        Response response = new Response();
        try {
            phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            phieuThueRepository.deleteById(idPt);
            response.setStatusCode(200);
            response.setMessage("Xóa phiếu thuê thành công");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByKhachHang(String cccd) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findByKhachHangCccd(cccd);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByNhanVien(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            List<PhieuThue> phieuThueList = phieuThueRepository.findByNhanVien(nhanVien);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByPhieuDat(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            List<PhieuThue> phieuThueList = phieuThueRepository.findByPhieuDat(phieuDat);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentStays(LocalDate currentDate) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findCurrentStays(currentDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách đang ở: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInFromBooking(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            if (!"Xác nhận".equals(phieuDat.getTrangThai())) {
                throw new OurException("Phiếu đặt chưa được xác nhận");
            }

            // Create new PhieuThue from PhieuDat (ngayDen và ngayDi sẽ được set trong
            // CtPhieuThue)
            PhieuThue phieuThue = new PhieuThue();
            phieuThue.setNgayLap(LocalDate.now());
            phieuThue.setKhachHang(phieuDat.getKhachHang());
            phieuThue.setNhanVien(phieuDat.getNhanVien());
            phieuThue.setPhieuDat(phieuDat);

            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);

            // Note: Không cập nhật trạng thái phiếu đặt khi check-in
            // Phiếu đặt sẽ giữ nguyên trạng thái hiện tại

            response.setStatusCode(200);
            response.setMessage("Check-in thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-in: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInFromBookingWithRoom(com.dev.Hotel.dto.CheckInWithRoomRequest request) {
        Response response = new Response();
        try {
            // Find the booking
            PhieuDat phieuDat = phieuDatRepository.findById(request.getIdPhieuDat())
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            // Find the room
            Phong phong = phongRepository.findById(request.getSoPhong())
                    .orElseThrow(() -> new OurException("Phòng không tồn tại"));

            // Check if room is available (support both TT01 and TT001 formats)
            String roomStatus = phong.getTrangThai().getIdTt();
            if (!"TT01".equals(roomStatus) && !"TT001".equals(roomStatus)) {
                throw new OurException("Phòng không có sẵn. Trạng thái hiện tại: " + roomStatus);
            }

            // Create PhieuThue from PhieuDat (ngayDen và ngayDi sẽ được set trong
            // CtPhieuThue)
            PhieuThue phieuThue = new PhieuThue();
            phieuThue.setNgayLap(LocalDate.now());
            phieuThue.setNhanVien(phieuDat.getNhanVien());
            phieuThue.setKhachHang(phieuDat.getKhachHang());
            phieuThue.setPhieuDat(phieuDat);

            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);

            // Create CtPhieuThue for the specific room
            CtPhieuThue ctPhieuThue = new CtPhieuThue();
            ctPhieuThue.setPhieuThue(savedPhieuThue);
            ctPhieuThue.setPhong(phong);
            ctPhieuThue.setNgayDen(phieuDat.getNgayBdThue());
            ctPhieuThue.setNgayDi(phieuDat.getNgayDi());

            ctPhieuThueRepository.save(ctPhieuThue);

            // Update room status to occupied (try both TT02 and TT002 formats)
            TrangThai occupiedStatus = trangThaiRepository.findById("TT02")
                    .orElse(trangThaiRepository.findById("TT002")
                            .orElseThrow(() -> new OurException(
                                    "Trạng thái 'Đã có khách' không tồn tại (TT02 hoặc TT002)")));
            phong.setTrangThai(occupiedStatus);
            phongRepository.save(phong);

            // Note: Không cập nhật trạng thái phiếu đặt khi check-in
            // Phiếu đặt sẽ giữ nguyên trạng thái hiện tại (Xác nhận, Chờ xác nhận, hoặc Đã hủy)

            response.setStatusCode(200);
            response.setMessage("Check-in thành công vào phòng " + request.getSoPhong());
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-in: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInFromBookingWithMultipleRooms(com.dev.Hotel.dto.CheckInMultipleRoomsRequest request) {
        Response response = new Response();
        try {
            System.out.println("=== DEBUG: Check-in request received ===");
            System.out.println("Request ID: " + request.getIdPhieuDat());
            System.out.println("Request ngayDen: " + request.getNgayDen());
            System.out.println("Request rooms: " + request.getDanhSachSoPhong());

            // Validate request
            if (request.getIdPhieuDat() == null) {
                throw new OurException("ID phiếu đặt không được để trống");
            }

            if (request.getNgayDen() == null || request.getNgayDen().trim().isEmpty()) {
                throw new OurException("Ngày đến không được để trống");
            }

            // Validate rooms
            if (request.getDanhSachSoPhong() == null || request.getDanhSachSoPhong().isEmpty()) {
                throw new OurException("Danh sách phòng không được để trống");
            }

            // Find the booking
            PhieuDat phieuDat = phieuDatRepository.findById(request.getIdPhieuDat())
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại với ID: " + request.getIdPhieuDat()));

            System.out.println("Found booking with status: " + phieuDat.getTrangThai());

            if (!"Xác nhận".equals(phieuDat.getTrangThai())) {
                throw new OurException("Phiếu đặt chưa được xác nhận. Trạng thái hiện tại: " + phieuDat.getTrangThai());
            }

            // Check all rooms exist and are available
            List<Phong> roomsToCheckIn = new ArrayList<>();
            for (String soPhong : request.getDanhSachSoPhong()) {
                System.out.println("Checking room: " + soPhong);
                Phong phong = phongRepository.findById(soPhong)
                        .orElseThrow(() -> new OurException("Phòng không tồn tại: " + soPhong));

                System.out.println("Room " + soPhong + " status: " + phong.getTrangThai().getIdTt());
                // Check for both TT01 and TT001 formats for available status
                String roomStatus = phong.getTrangThai().getIdTt();
                if (!"TT01".equals(roomStatus) && !"TT001".equals(roomStatus)) {
                    throw new OurException("Phòng " + soPhong + " không có sẵn. Trạng thái hiện tại: " + roomStatus);
                }
                roomsToCheckIn.add(phong);
            }

            // Parse and validate date
            LocalDate ngayDen;
            try {
                ngayDen = LocalDate.parse(request.getNgayDen());
                System.out.println("Parsed date: " + ngayDen);
            } catch (Exception e) {
                throw new OurException("Định dạng ngày đến không hợp lệ: " + request.getNgayDen()
                        + ". Vui lòng sử dụng định dạng YYYY-MM-DD");
            }

            // Create PhieuThue (ngayDen và ngayDi sẽ được set trong CtPhieuThue)
            PhieuThue phieuThue = new PhieuThue();
            phieuThue.setNgayLap(LocalDate.now());
            phieuThue.setKhachHang(phieuDat.getKhachHang());
            phieuThue.setNhanVien(phieuDat.getNhanVien());
            phieuThue.setPhieuDat(phieuDat);

            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);

            // Create CtPhieuThue for each room and update room status
            // Try both TT02 and TT002 formats for occupied status
            TrangThai occupiedStatus = trangThaiRepository.findById("TT02")
                    .orElse(trangThaiRepository.findById("TT002")
                            .orElseThrow(() -> new OurException(
                                    "Trạng thái 'Đã có khách' không tồn tại (TT02 hoặc TT002)")));

            for (Phong phong : roomsToCheckIn) {
                // Create CtPhieuThue
                CtPhieuThue ctPhieuThue = new CtPhieuThue();
                ctPhieuThue.setPhieuThue(savedPhieuThue);
                ctPhieuThue.setPhong(phong);
                ctPhieuThue.setNgayDen(ngayDen); // Use the already parsed date
                ctPhieuThue.setGioDen(LocalTime.now());
                ctPhieuThue.setNgayDi(phieuDat.getNgayDi());

                // Get room price using new pricing service
                BigDecimal roomPrice = roomPricingService.getCurrentPrice(phong.getHangPhong().getIdHangPhong());
                ctPhieuThue.setDonGia(roomPrice);

                ctPhieuThue.setTtThanhToan("Chưa thanh toán");
                ctPhieuThueRepository.save(ctPhieuThue);

                // Update room status to occupied
                phong.setTrangThai(occupiedStatus);
                phongRepository.save(phong);
            }

            // Note: Không cập nhật trạng thái phiếu đặt khi check-in
            // Phiếu đặt sẽ giữ nguyên trạng thái hiện tại

            response.setStatusCode(200);
            response.setMessage("Check-in thành công cho " + request.getDanhSachSoPhong().size() + " phòng");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(savedPhieuThue));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi check-in: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkInWalkIn(CheckInWalkInRequest request) {
        System.out.println("=== checkInWalkIn called ===");
        System.out.println("Request: " + request);

        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();

            // Khóa cứng ngày check-in là hôm nay cho thuê phòng ngay
            request.setNgayDen(today);

            // Validate request
            if (request.getNgayDen() == null || request.getNgayDi() == null) {
                throw new OurException("Ngày đến và ngày đi không được để trống");
            }

            if (request.getNgayDi().isBefore(request.getNgayDen())) {
                throw new OurException("Ngày đi không thể trước ngày đến");
            }

            if (request.getNhanVien() == null || request.getNhanVien().getIdNv() == null
                    || request.getNhanVien().getIdNv().trim().isEmpty()) {
                throw new OurException("ID nhân viên không được để trống");
            }

            if (request.getKhachHang() == null || request.getKhachHang().getCccd() == null
                    || request.getKhachHang().getCccd().trim().isEmpty()) {
                throw new OurException("CCCD khách hàng không được để trống");
            }

            // Check if check-in is today or future
            boolean isImmediateCheckIn = request.getNgayDen().equals(today);

            if (isImmediateCheckIn) {
                // Case 1: Immediate check-in - Create PhieuThue
                response = createPhieuThueFromRequest(request);
            } else {
                // Case 2: Future check-in - Create PhieuDat
                response = createPhieuDatFromRequest(request);
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xử lý check-in walk-in: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    private Response createPhieuDatFromRequest(CheckInWalkInRequest request) {
        Response response = new Response();
        try {
            // Load or create customer
            KhachHang khachHang = getOrCreateKhachHang(request.getKhachHang());

            // Validate customer is not currently staying in another room
            validateCustomerNotCurrentlyStaying(khachHang.getCccd());

            // Load employee
            String employeeId = request.getNhanVien().getIdNv();
            System.out.println("Loading employee with ID: " + employeeId);
            NhanVien nhanVien = nhanVienRepository.findById(employeeId)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại với ID: " + employeeId));
            System.out.println("Employee loaded successfully: " + nhanVien.getIdNv() + " - " + nhanVien.getHo() + " "
                    + nhanVien.getTen());

            // Create PhieuDat
            PhieuDat phieuDat = new PhieuDat();
            phieuDat.setNgayDat(LocalDate.now());
            phieuDat.setNgayBdThue(request.getNgayDen());
            phieuDat.setNgayDi(request.getNgayDi());
            phieuDat.setTrangThai("Xác nhận");
            phieuDat.setSoTienCoc(BigDecimal.ZERO); // Can be set based on business rules
            phieuDat.setKhachHang(khachHang);
            phieuDat.setNhanVien(nhanVien);

            PhieuDat savedPhieuDat = phieuDatRepository.save(phieuDat);

            response.setStatusCode(200);
            response.setMessage("Tạo phiếu đặt thành công");
            response.setPhieuDatSimple(EntityDTOMapper.mapPhieuDatToSimpleDTO(savedPhieuDat));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu đặt: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    private Response createPhieuThueFromRequest(CheckInWalkInRequest request) {
        Response response = new Response();
        try {
            // Load or create customer
            KhachHang khachHang = getOrCreateKhachHang(request.getKhachHang());

            // Validate customer is not currently staying in another room
            validateCustomerNotCurrentlyStaying(khachHang.getCccd());

            // Load employee
            String employeeId = request.getNhanVien().getIdNv();
            System.out.println("Loading employee for rental with ID: " + employeeId);
            NhanVien nhanVien = nhanVienRepository.findById(employeeId)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại với ID: " + employeeId));
            System.out.println("Employee loaded for rental: " + nhanVien.getIdNv() + " - " + nhanVien.getHo() + " "
                    + nhanVien.getTen());

            // Create PhieuThue (ngayDen và ngayDi sẽ được set trong CtPhieuThue)
            PhieuThue phieuThue = new PhieuThue();
            phieuThue.setNgayLap(LocalDate.now());
            phieuThue.setKhachHang(khachHang);
            phieuThue.setNhanVien(nhanVien);
            phieuThue.setPhieuDat(null); // No booking for walk-in

            PhieuThue savedPhieuThue = phieuThueRepository.save(phieuThue);
            System.out.println("PhieuThue saved with employee ID: " + savedPhieuThue.getNhanVien().getIdNv());

            // Create CtPhieuThue for each room
            if (request.getDanhSachPhong() != null && !request.getDanhSachPhong().isEmpty()) {
                createCtPhieuThueFromRooms(savedPhieuThue, request);
            } else {
                // If no rooms specified, this is an error for check-in
                throw new OurException("Danh sách phòng không được để trống khi check-in");
            }

            response.setStatusCode(200);
            response.setMessage("Check-in walk-in thành công");
            response.setPhieuThueSimple(EntityDTOMapper.mapPhieuThueToSimpleDTO(savedPhieuThue));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu thuê: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public Response checkOut(Integer idPt) {
        // Method này đã deprecated - sử dụng HoaDonService.createInvoiceFromCheckout thay thế
        Response response = new Response();
        response.setStatusCode(400);
        response.setMessage("API này đã được thay thế bởi /api/hoa-don/create-from-checkout/{idPt}");
        return response;
    }

    // Method checkOutWithDate đã được xóa - sử dụng HoaDonService.createInvoiceFromCheckout thay thế

    @Override
    public Response extendStay(Integer idPt, LocalDate newCheckOut) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            // Lấy ngày check-out hiện tại từ CtPhieuThue
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            if (ctPhieuThueList.isEmpty()) {
                throw new OurException("Không tìm thấy chi tiết phiếu thuê");
            }

            LocalDate currentCheckOut = ctPhieuThueList.stream()
                    .map(ct -> ct.getNgayDi())
                    .filter(date -> date != null)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            if (currentCheckOut != null && newCheckOut.isBefore(currentCheckOut)) {
                throw new OurException("Ngày check-out mới phải sau ngày check-out hiện tại");
            }

            // Cập nhật ngày check-out trong tất cả CtPhieuThue
            for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
                ctPhieuThue.setNgayDi(newCheckOut);
                ctPhieuThueRepository.save(ctPhieuThue);
            }

            response.setStatusCode(200);
            response.setMessage("Gia hạn lưu trú thành công");
            response.setPhieuThue(EntityDTOMapper.mapPhieuThueToDTO(phieuThue));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi gia hạn lưu trú: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchPhieuThue(String keyword) {
        Response response = new Response();
        try {
            // This would require a custom query to search across multiple fields
            // For now, return all rental records
            List<PhieuThue> phieuThueList = phieuThueRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Tìm kiếm thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuThueByDateRange(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDenBetween(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu thuê theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckIns() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDenBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy check-in hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayCheckOuts() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuThue> phieuThueList = phieuThueRepository.findByNgayDiBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy check-out hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getOccupancyReport(LocalDate date) {
        Response response = new Response();
        try {
            // This would require complex calculations
            // For now, return a simple message
            response.setStatusCode(200);
            response.setMessage("Báo cáo công suất đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo công suất: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRevenueReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // This would require complex calculations with pricing
            // For now, return a simple message
            response.setStatusCode(200);
            response.setMessage("Báo cáo doanh thu đang được phát triển");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo doanh thu: " + e.getMessage());
        }
        return response;
    }

    private KhachHang getOrCreateKhachHang(CheckInWalkInRequest.KhachHangInfo khachHangInfo) {
        if (khachHangInfo == null || khachHangInfo.getCccd() == null || khachHangInfo.getCccd().trim().isEmpty()) {
            throw new OurException("CCCD không được để trống");
        }
        // Try to find existing customer, create if not exists
        return khachHangRepository.findById(khachHangInfo.getCccd())
                .orElseGet(() -> {
                    // Create new customer if not exists
                    KhachHang newKhachHang = new KhachHang();
                    newKhachHang.setCccd(khachHangInfo.getCccd());
                    newKhachHang.setHo(khachHangInfo.getHo());
                    newKhachHang.setTen(khachHangInfo.getTen());
                    newKhachHang.setSdt(khachHangInfo.getSdt());
                    newKhachHang.setEmail(khachHangInfo.getEmail());
                    newKhachHang.setDiaChi(khachHangInfo.getDiaChi());
                    return khachHangRepository.save(newKhachHang);
                });
    }

    private void createCtPhieuThueFromRooms(PhieuThue phieuThue, CheckInWalkInRequest request) {
        if (request.getDanhSachPhong() == null)
            return;

        for (CheckInWalkInRequest.PhongInfo phongInfo : request.getDanhSachPhong()) {
            // Load room
            Phong phong = phongRepository.findById(phongInfo.getSoPhong())
                    .orElseThrow(() -> new OurException("Phòng không tồn tại: " + phongInfo.getSoPhong()));

            // Get room price
            BigDecimal donGia = getRoomPrice(phong);

            // Create CtPhieuThue
            CtPhieuThue ctPhieuThue = new CtPhieuThue();
            ctPhieuThue.setNgayDen(request.getNgayDen());
            ctPhieuThue.setGioDen(LocalTime.now());
            ctPhieuThue.setNgayDi(request.getNgayDi());
            ctPhieuThue.setDonGia(donGia);
            ctPhieuThue.setTtThanhToan("Chưa thanh toán");
            ctPhieuThue.setPhieuThue(phieuThue);
            ctPhieuThue.setPhong(phong);

            CtPhieuThue savedCtPhieuThue = ctPhieuThueRepository.save(ctPhieuThue);

            // Update room status to occupied (TT002)
            TrangThai occupiedStatus = trangThaiRepository.findById("TT002")
                    .orElseThrow(() -> new OurException("Trạng thái 'Đã có khách' không tồn tại (TT002)"));
            phong.setTrangThai(occupiedStatus);
            phongRepository.save(phong);

            // Create CtKhachO for guests in this room
            if (phongInfo.getDanhSachKhachCccd() != null) {
                createCtKhachOFromGuests(savedCtPhieuThue, phongInfo.getDanhSachKhachCccd());
            }
        }
    }

    private BigDecimal getRoomPrice(Phong phong) {
        try {
            if (phong.getHangPhong() != null) {
                return roomPricingService.getCurrentPrice(phong.getHangPhong().getIdHangPhong());
            }
        } catch (Exception e) {
            System.err.println("Error getting room price: " + e.getMessage());
        }
        return BigDecimal.valueOf(500000); // Default price
    }

    private void createCtKhachOFromGuests(CtPhieuThue ctPhieuThue, List<String> guestCccds) {
        // Guest assignment to rooms - to be implemented when needed
    }

    @Override
    public Response getPhieuThueDetails(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            PhieuThueDetailsDTO dto = EntityDTOMapper.mapPhieuThueToDetailsDTO(phieuThue);

            // Get services for all rooms in this rental
            List<PhieuThueDetailsDTO.ServiceDetailDTO> services = new ArrayList<>();
            BigDecimal tongTienDichVu = BigDecimal.ZERO;

            for (CtPhieuThue ctPhieuThue : phieuThue.getChiTietPhieuThue()) {
                List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtDichVu ctDichVu : ctDichVuList) {
                    // Chỉ thêm các dịch vụ chưa thanh toán
                    if (!"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                        PhieuThueDetailsDTO.ServiceDetailDTO serviceDto = new PhieuThueDetailsDTO.ServiceDetailDTO();
                        // Set composite key info
                        if (ctDichVu.getId() != null) {
                            serviceDto.setIdCtPt(ctDichVu.getId().getIdCtPt());
                            serviceDto.setIdDv(ctDichVu.getId().getIdDv());
                        }

                        if (ctDichVu.getDichVu() != null) {
                            serviceDto.setIdDv(ctDichVu.getDichVu().getIdDv());
                            serviceDto.setTenDichVu(ctDichVu.getDichVu().getTenDv());
                        }

                        serviceDto.setGia(ctDichVu.getDonGia());
                        serviceDto.setSoLuong(ctDichVu.getSoLuong());
                        serviceDto.setNgaySD(ctDichVu.getNgaySuDung());

                        if (ctPhieuThue.getPhong() != null) {
                            serviceDto.setIdPhong(ctPhieuThue.getPhong().getSoPhong());
                            serviceDto.setTenPhong(ctPhieuThue.getPhong().getSoPhong());
                        }

                        if (ctDichVu.getDonGia() != null && ctDichVu.getSoLuong() != null) {
                            BigDecimal thanhTien = ctDichVu.getDonGia()
                                    .multiply(BigDecimal.valueOf(ctDichVu.getSoLuong()));
                            serviceDto.setThanhTien(thanhTien);
                            tongTienDichVu = tongTienDichVu.add(thanhTien);
                        }

                        services.add(serviceDto);
                    }
                }
            }

            // Get surcharges for all rooms in this rental
            List<PhieuThueDetailsDTO.SurchargeDetailDTO> surcharges = new ArrayList<>();
            BigDecimal tongTienPhuThu = BigDecimal.ZERO;

            for (CtPhieuThue ctPhieuThue : phieuThue.getChiTietPhieuThue()) {
                List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtPhuThu ctPhuThu : ctPhuThuList) {
                    // Chỉ thêm các phụ thu chưa thanh toán
                    if (!"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                        PhieuThueDetailsDTO.SurchargeDetailDTO surchargeDto = new PhieuThueDetailsDTO.SurchargeDetailDTO();
                        // Set composite key info
                        if (ctPhuThu.getId() != null) {
                            surchargeDto.setIdPhuThu(ctPhuThu.getId().getIdPhuThu());
                            surchargeDto.setIdCtPt(ctPhuThu.getId().getIdCtPt());
                        }

                        if (ctPhuThu.getPhuThu() != null) {
                            surchargeDto.setLoaiPhuThu(ctPhuThu.getPhuThu().getTenPhuThu());
                            surchargeDto.setMoTa(ctPhuThu.getPhuThu().getTenPhuThu()); // Use tenPhuThu as description
                        }

                        surchargeDto.setDonGia(ctPhuThu.getDonGia());
                        surchargeDto.setSoLuong(ctPhuThu.getSoLuong());
                        // Note: CtPhuThu doesn't have ngayPhatSinh field, using current date
                        surchargeDto.setNgayPhatSinh(LocalDate.now());

                        if (ctPhieuThue.getPhong() != null) {
                            surchargeDto.setIdPhong(ctPhieuThue.getPhong().getSoPhong());
                            surchargeDto.setTenPhong(ctPhieuThue.getPhong().getSoPhong());
                        }

                        if (ctPhuThu.getDonGia() != null && ctPhuThu.getSoLuong() != null) {
                            BigDecimal thanhTien = ctPhuThu.getDonGia()
                                    .multiply(BigDecimal.valueOf(ctPhuThu.getSoLuong()));
                            surchargeDto.setThanhTien(thanhTien);
                            tongTienPhuThu = tongTienPhuThu.add(thanhTien);
                        }

                        surcharges.add(surchargeDto);
                    }
                }
            }

            // Sắp xếp services theo phòng (ưu tiên) rồi đến ngày sử dụng
            services.sort((s1, s2) -> {
                // So sánh theo phòng trước
                int roomCompare = compareRoomNumbers(s1.getTenPhong(), s2.getTenPhong());
                if (roomCompare != 0)
                    return roomCompare;

                // Nếu cùng phòng, so sánh theo ngày sử dụng
                if (s1.getNgaySD() == null && s2.getNgaySD() == null)
                    return 0;
                if (s1.getNgaySD() == null)
                    return 1;
                if (s2.getNgaySD() == null)
                    return -1;
                return s1.getNgaySD().compareTo(s2.getNgaySD());
            });

            // Sắp xếp surcharges theo phòng (ưu tiên) rồi đến ngày phát sinh
            surcharges.sort((s1, s2) -> {
                // So sánh theo phòng trước
                int roomCompare = compareRoomNumbers(s1.getTenPhong(), s2.getTenPhong());
                if (roomCompare != 0)
                    return roomCompare;

                // Nếu cùng phòng, so sánh theo ngày phát sinh
                if (s1.getNgayPhatSinh() == null && s2.getNgayPhatSinh() == null)
                    return 0;
                if (s1.getNgayPhatSinh() == null)
                    return 1;
                if (s2.getNgayPhatSinh() == null)
                    return -1;
                return s1.getNgayPhatSinh().compareTo(s2.getNgayPhatSinh());
            });

            // Update DTO with services and surcharges
            dto.setServices(services);
            dto.setTongTienDichVu(tongTienDichVu);
            dto.setSurcharges(surcharges);
            dto.setTongTienPhuThu(tongTienPhuThu);

            // Recalculate total
            BigDecimal tongTien = dto.getTongTienPhong().add(tongTienDichVu).add(tongTienPhuThu);
            dto.setTongTien(tongTien);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueDetails(dto);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy chi tiết phiếu thuê: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updatePaymentStatus(Integer idPt, String trangThaiThanhToan) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Phiếu thuê không tồn tại"));

            // Update payment status for all CtPhieuThue
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
                ctPhieuThue.setTtThanhToan(trangThaiThanhToan);
                ctPhieuThueRepository.save(ctPhieuThue);
            }

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thanh toán thành công");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái thanh toán: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getActiveRentalsWithoutInvoice() {
        Response response = new Response();
        try {
            List<PhieuThue> phieuThueList = phieuThueRepository.findActiveRentalsWithoutInvoice();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu thuê chưa xuất hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getActiveRentalsWithOccupiedRoomsOnly() {
        Response response = new Response();
        try {
            // Get all occupied rooms (TT002 status) without invoice
            List<CtPhieuThue> occupiedRooms = ctPhieuThueRepository.findAllOccupiedRooms();

            // Group by PhieuThue to create rental list with only occupied rooms
            Map<Integer, List<CtPhieuThue>> groupedByPhieuThue = occupiedRooms.stream()
                .collect(Collectors.groupingBy(ct -> ct.getPhieuThue().getIdPt()));

            List<PhieuThueDTO> phieuThueDTOList = new ArrayList<>();

            for (Map.Entry<Integer, List<CtPhieuThue>> entry : groupedByPhieuThue.entrySet()) {
                List<CtPhieuThue> ctList = entry.getValue();
                if (!ctList.isEmpty()) {
                    PhieuThue phieuThue = ctList.get(0).getPhieuThue();
                    PhieuThueDTO dto = EntityDTOMapper.mapPhieuThueToDTO(phieuThue);

                    // Only include occupied rooms in chiTietPhieuThue
                    dto.setChiTietPhieuThue(EntityDTOMapper.mapCtPhieuThueListToDTO(ctList));

                    phieuThueDTOList.add(dto);
                }
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuThueList(phieuThueDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu thuê với phòng đang có khách: " + e.getMessage());
        }
        return response;
    }

    // Helper method để so sánh số phòng
    private int compareRoomNumbers(String room1, String room2) {
        if (room1 == null && room2 == null)
            return 0;
        if (room1 == null)
            return 1;
        if (room2 == null)
            return -1;

        try {
            Integer roomNum1 = Integer.parseInt(room1);
            Integer roomNum2 = Integer.parseInt(room2);
            return roomNum1.compareTo(roomNum2);
        } catch (NumberFormatException e) {
            // Nếu không parse được số, sắp xếp theo string
            return room1.compareTo(room2);
        }
    }

    // Helper method to validate customer is not currently staying in another room
    private void validateCustomerNotCurrentlyStaying(String cccd) throws OurException {
        List<CtKhachO> activeStays = ctKhachORepository.findActiveStaysByCccd(cccd);
        if (!activeStays.isEmpty()) {
            List<CtKhachO> activeStaysWithDetails = ctKhachORepository.findActiveStaysWithDetailsByCccd(cccd);
            if (!activeStaysWithDetails.isEmpty()) {
                CtKhachO activeStay = activeStaysWithDetails.get(0);
                String currentRoom = activeStay.getCtPhieuThue().getPhong().getSoPhong();
                throw new OurException("Khách hàng đang ở phòng " + currentRoom + " và chưa check-out. ");
            }
        }
    }
}
