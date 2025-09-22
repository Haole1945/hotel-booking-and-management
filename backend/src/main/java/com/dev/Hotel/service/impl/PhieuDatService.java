package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.CreateBookingAtReceptionRequest;
import com.dev.Hotel.dto.CreateBookingRequest;
import com.dev.Hotel.dto.UpdateBookingRequest;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.CtPhieuDat;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.entity.CtPhieuDatId;
import com.dev.Hotel.entity.CtKhachO;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.repo.CtPhieuDatRepository;
import com.dev.Hotel.repo.CTKhachORepository;
import com.dev.Hotel.repo.KieuPhongRepository;
import com.dev.Hotel.repo.LoaiPhongRepository;
import com.dev.Hotel.service.interfac.IPhieuDatService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PhieuDatService implements IPhieuDatService {

    @Autowired
    private PhieuDatRepository phieuDatRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private HangPhongRepository hangPhongRepository;

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Autowired
    private CtPhieuDatRepository ctPhieuDatRepository;

    @Autowired
    private CTKhachORepository ctKhachORepository;

    @Autowired
    private KieuPhongRepository kieuPhongRepository;

    @Autowired
    private LoaiPhongRepository loaiPhongRepository;

    @Autowired
    private RoomPricingService roomPricingService;

    @Override
    public Response getAllPhieuDat() {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatById(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findByIdWithDetails(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(phieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createPhieuDat(PhieuDat phieuDat) {
        Response response = new Response();
        try {
            // Validate booking dates
            if (!isValidBookingPeriod(phieuDat.getNgayBdThue(), phieuDat.getNgayDi())) {
                throw new OurException("Ngày đặt không hợp lệ");
            }

            PhieuDat savedPhieuDat = phieuDatRepository.save(phieuDat);
            response.setStatusCode(200);
            response.setMessage("Tạo phiếu đặt thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(savedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updatePhieuDat(Integer idPd, PhieuDat phieuDat) {
        Response response = new Response();
        try {
            PhieuDat existingPhieuDat = phieuDatRepository.findByIdWithDetails(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            // Update fields
            existingPhieuDat.setNgayDat(phieuDat.getNgayDat());
            existingPhieuDat.setNgayBdThue(phieuDat.getNgayBdThue());
            existingPhieuDat.setNgayDi(phieuDat.getNgayDi());
            existingPhieuDat.setTrangThai(phieuDat.getTrangThai());
            existingPhieuDat.setSoTienCoc(phieuDat.getSoTienCoc());
            existingPhieuDat.setKhachHang(phieuDat.getKhachHang());
            existingPhieuDat.setNhanVien(phieuDat.getNhanVien());

            PhieuDat updatedPhieuDat = phieuDatRepository.save(existingPhieuDat);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phiếu đặt thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deletePhieuDat(Integer idPd) {
        Response response = new Response();
        try {
            phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            phieuDatRepository.deleteById(idPd);
            response.setStatusCode(200);
            response.setMessage("Xóa phiếu đặt thành công");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phiếu đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByKhachHang(String cccd) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByKhachHangCccd(cccd);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByNhanVien(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            List<PhieuDat> phieuDatList = phieuDatRepository.findByNhanVien(nhanVien);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByTrangThai(String trangThai) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByTrangThaiWithDetails(trangThai);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo trạng thái: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPhieuDatByDateRange(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phiếu đặt theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response confirmBooking(Integer idPd) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            phieuDat.setTrangThai("Xác nhận");
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);

            response.setStatusCode(200);
            response.setMessage("Xác nhận đặt phòng thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xác nhận đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response cancelBooking(Integer idPd, String reason) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            phieuDat.setTrangThai("Đã hủy");
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);

            response.setStatusCode(200);
            response.setMessage("Hủy đặt phòng thành công. Lý do: " + reason);
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi hủy đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateBookingStatus(Integer idPd, String trangThai) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findById(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            phieuDat.setTrangThai(trangThai);
            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateBookingSimple(Integer idPd, UpdateBookingRequest request) {
        Response response = new Response();
        try {
            PhieuDat phieuDat = phieuDatRepository.findByIdWithDetails(idPd)
                    .orElseThrow(() -> new OurException("Phiếu đặt không tồn tại"));

            // Update basic booking info
            if (request.getCheckIn() != null) {
                phieuDat.setNgayBdThue(request.getCheckIn());
            }
            if (request.getCheckOut() != null) {
                phieuDat.setNgayDi(request.getCheckOut());
            }
            if (request.getStatus() != null) {
                phieuDat.setTrangThai(request.getStatus());
            }
            if (request.getSoTienCoc() != null) {
                phieuDat.setSoTienCoc(request.getSoTienCoc());
            }

            // Update customer info
            if (phieuDat.getKhachHang() != null &&
                    (request.getCustomerName() != null || request.getCustomerPhone() != null
                            || request.getCustomerEmail() != null)) {

                KhachHang khachHang = phieuDat.getKhachHang();

                if (request.getCustomerName() != null) {
                    String[] nameParts = request.getCustomerName().trim().split("\\s+");
                    if (nameParts.length > 1) {
                        khachHang.setHo(String.join(" ", java.util.Arrays.copyOf(nameParts, nameParts.length - 1)));
                        khachHang.setTen(nameParts[nameParts.length - 1]);
                    } else {
                        khachHang.setTen(request.getCustomerName());
                    }
                }
                if (request.getCustomerPhone() != null) {
                    khachHang.setSdt(request.getCustomerPhone());
                }
                if (request.getCustomerEmail() != null) {
                    khachHang.setEmail(request.getCustomerEmail());
                }
            }

            // Update room info in CtPhieuDat if needed
            if (!phieuDat.getChiTietPhieuDat().isEmpty()) {
                CtPhieuDat ctPhieuDat = phieuDat.getChiTietPhieuDat().get(0);

                // Update số lượng phòng ở
                if (request.getSoLuongPhongO() != null) {
                    ctPhieuDat.setSoLuongPhongO(request.getSoLuongPhongO());
                }

                // Update kiểu phòng và loại phòng nếu có
                if (request.getKieuPhong() != null || request.getLoaiPhong() != null) {
                    // Lấy thông tin hiện tại của hạng phòng
                    HangPhong currentHangPhong = ctPhieuDat.getHangPhong();
                    String currentIdKp = currentHangPhong != null ? currentHangPhong.getKieuPhong().getIdKp() : null;
                    String currentIdLp = currentHangPhong != null ? currentHangPhong.getLoaiPhong().getIdLp() : null;

                    // Tìm kiểu phòng mới nếu có
                    String newIdKp = currentIdKp;
                    if (request.getKieuPhong() != null) {
                        var kieuPhong = kieuPhongRepository.findByTenKp(request.getKieuPhong());
                        if (kieuPhong.isPresent()) {
                            newIdKp = kieuPhong.get().getIdKp();
                        }
                    }

                    // Tìm loại phòng mới nếu có
                    String newIdLp = currentIdLp;
                    if (request.getLoaiPhong() != null) {
                        var loaiPhong = loaiPhongRepository.findByTenLp(request.getLoaiPhong());
                        if (loaiPhong.isPresent()) {
                            newIdLp = loaiPhong.get().getIdLp();
                        }
                    }

                    // Nếu kiểu phòng hoặc loại phòng thay đổi, cần tạo record mới
                    if ((newIdKp != null && !newIdKp.equals(currentIdKp)) ||
                            (newIdLp != null && !newIdLp.equals(currentIdLp))) {

                        // Tìm hạng phòng tương ứng với kiểu phòng và loại phòng mới
                        if (newIdKp != null && newIdLp != null) {
                            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(newIdKp,
                                    newIdLp);
                            if (!hangPhongList.isEmpty()) {
                                HangPhong newHangPhong = hangPhongList.get(0);

                                // Xóa record cũ
                                ctPhieuDatRepository.delete(ctPhieuDat);
                                phieuDat.getChiTietPhieuDat().remove(ctPhieuDat);

                                // Tạo record mới với hạng phòng mới
                                CtPhieuDat newCtPhieuDat = new CtPhieuDat();
                                CtPhieuDatId newId = new CtPhieuDatId();
                                newId.setIdPd(phieuDat.getIdPd());
                                newId.setIdHangPhong(newHangPhong.getIdHangPhong());

                                newCtPhieuDat.setId(newId);
                                newCtPhieuDat.setPhieuDat(phieuDat);
                                newCtPhieuDat.setHangPhong(newHangPhong);
                                newCtPhieuDat.setSoLuongPhongO(ctPhieuDat.getSoLuongPhongO());
                                newCtPhieuDat.setDonGia(ctPhieuDat.getDonGia());

                                // Cập nhật số lượng phòng nếu có
                                if (request.getSoLuongPhongO() != null) {
                                    newCtPhieuDat.setSoLuongPhongO(request.getSoLuongPhongO());
                                }

                                // Save record mới
                                ctPhieuDatRepository.save(newCtPhieuDat);
                                phieuDat.getChiTietPhieuDat().add(newCtPhieuDat);
                            }
                        }
                    }
                }
            }

            PhieuDat updatedPhieuDat = phieuDatRepository.save(phieuDat);

            response.setStatusCode(200);
            response.setMessage("Cập nhật đặt phòng thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(updatedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchPhieuDat(String keyword) {
        Response response = new Response();
        try {
            // This would require a custom query to search across multiple fields
            // For now, return all bookings
            List<PhieuDat> phieuDatList = phieuDatRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Tìm kiếm thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUpcomingBookings(LocalDate date) {
        Response response = new Response();
        try {
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(date, date.plusDays(7));
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy đặt phòng sắp tới: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTodayBookings() {
        Response response = new Response();
        try {
            LocalDate today = LocalDate.now();
            List<PhieuDat> phieuDatList = phieuDatRepository.findByNgayDatBetween(today, today);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy đặt phòng hôm nay: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response validateBookingDates(LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            boolean isValid = isValidBookingPeriod(checkIn, checkOut);
            response.setStatusCode(200);
            response.setMessage(isValid ? "Ngày đặt hợp lệ" : "Ngày đặt không hợp lệ");
            response.setStats(isValid);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra ngày đặt: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getConfirmedBookings() {
        Response response = new Response();
        try {
            // Lấy tất cả phiếu đặt đã xác nhận
            List<PhieuDat> allConfirmedBookings = phieuDatRepository.findByTrangThaiWithDetails("Xác nhận");

            // Lọc ra những phiếu đặt chưa có phiếu thuê (chưa check-in)
            List<PhieuDat> availableForCheckIn = allConfirmedBookings.stream()
                    .filter(pd -> {
                        // Kiểm tra xem phiếu đặt này đã có phiếu thuê chưa
                        List<PhieuThue> existingRentals = phieuThueRepository.findByPhieuDat(pd);
                        return existingRentals.isEmpty(); // Chỉ lấy những phiếu chưa có phiếu thuê
                    })
                    .collect(java.util.stream.Collectors.toList());

            // Sắp xếp theo ngày bắt đầu thuê
            availableForCheckIn.sort((a, b) -> {
                if (a.getNgayBdThue() == null && b.getNgayBdThue() == null)
                    return 0;
                if (a.getNgayBdThue() == null)
                    return 1;
                if (b.getNgayBdThue() == null)
                    return -1;
                return a.getNgayBdThue().compareTo(b.getNgayBdThue());
            });

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(availableForCheckIn));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách đặt phòng đã xác nhận: " + e.getMessage());
        }
        return response;
    }

    @Override
    public boolean isValidBookingPeriod(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            return false;
        }
        return checkIn.isBefore(checkOut) && !checkIn.isBefore(LocalDate.now());
    }

    @Override
    public Response createBookingAtReception(CreateBookingAtReceptionRequest request) {
        Response response = new Response();
        try {
            // Validate input - chỉ yêu cầu CCCD và SĐT
            if (request.getCccd() == null || request.getCccd().trim().isEmpty()) {
                throw new OurException("CCCD không được để trống");
            }
            if (request.getSdt() == null || request.getSdt().trim().isEmpty()) {
                throw new OurException("Số điện thoại không được để trống");
            }
            if (request.getNgayBdThue() == null || request.getNgayDi() == null) {
                throw new OurException("Ngày bắt đầu và ngày kết thúc không được để trống");
            }
            if (!isValidBookingPeriod(request.getNgayBdThue(), request.getNgayDi())) {
                throw new OurException("Khoảng thời gian đặt phòng không hợp lệ");
            }

            // Validate employee ID
            if (request.getIdNv() == null || request.getIdNv().trim().isEmpty()) {
                throw new OurException("ID nhân viên không được để trống");
            }

            // Validate room type and category
            if (request.getIdKp() == null || request.getIdLp() == null) {
                throw new OurException("Kiểu phòng và loại phòng không được để trống");
            }

            // Get room category and validate deposit
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(request.getIdKp(),
                    request.getIdLp());
            if (hangPhongList.isEmpty()) {
                throw new OurException("Không tìm thấy hạng phòng với kiểu phòng và loại phòng này");
            }

            HangPhong hangPhong = hangPhongList.get(0);

            // Calculate room price for the booking period using new pricing logic
            BigDecimal totalRoomPrice = roomPricingService.calculateTotalPriceForDateRange(
                    hangPhong.getIdHangPhong(),
                    request.getNgayBdThue(),
                    request.getNgayDi());

            // Calculate price per room per night (average)
            long numberOfNights = java.time.temporal.ChronoUnit.DAYS.between(request.getNgayBdThue(),
                    request.getNgayDi());
            BigDecimal roomPrice = numberOfNights > 0
                    ? totalRoomPrice.divide(BigDecimal.valueOf(numberOfNights), 2, java.math.RoundingMode.HALF_UP)
                    : roomPricingService.getCurrentPrice(hangPhong.getIdHangPhong());

            // Validate deposit amount (must be >= 20% of room price)
            BigDecimal minDeposit = roomPrice.multiply(BigDecimal.valueOf(0.2));
            if (request.getTienDatCoc() == null || request.getTienDatCoc().compareTo(minDeposit) < 0) {
                throw new OurException("Tiền đặt cọc phải ít nhất " + minDeposit.longValue() + " VNĐ (20% giá phòng)");
            }

            // Tìm khách hàng theo CCCD, nếu không có thì báo lỗi
            KhachHang khachHang = khachHangRepository.findById(request.getCccd())
                    .orElseThrow(() -> new OurException("Không tìm thấy khách hàng với CCCD: " + request.getCccd() +
                            ". Vui lòng tạo khách hàng trước khi đặt phòng."));

            // Cập nhật số điện thoại nếu có thay đổi
            if (request.getSdt() != null && !request.getSdt().trim().isEmpty()) {
                if (!request.getSdt().equals(khachHang.getSdt())) {
                    khachHang.setSdt(request.getSdt());
                    khachHang = khachHangRepository.save(khachHang);
                }
            }

            // Validate customer is not currently staying in another room
            validateCustomerNotCurrentlyStaying(khachHang.getCccd());

            // Create PhieuDat
            PhieuDat phieuDat = new PhieuDat();
            phieuDat.setNgayDat(LocalDate.now());
            phieuDat.setNgayBdThue(request.getNgayBdThue());
            phieuDat.setNgayDi(request.getNgayDi());
            phieuDat.setSoTienCoc(request.getTienDatCoc());
            phieuDat.setTrangThai("Xác nhận");
            phieuDat.setKhachHang(khachHang);

            // Set employee
            System.out.println("Setting employee with ID: " + request.getIdNv());
            NhanVien nhanVien = nhanVienRepository.findById(request.getIdNv())
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại với ID: " + request.getIdNv()));
            phieuDat.setNhanVien(nhanVien);
            System.out.println("Employee set successfully: " + nhanVien.getIdNv() + " - " + nhanVien.getHo() + " "
                    + nhanVien.getTen());

            PhieuDat savedPhieuDat = phieuDatRepository.save(phieuDat);
            System.out.println("PhieuDat saved with employee ID: " + savedPhieuDat.getNhanVien().getIdNv());

            // Create CtPhieuDat
            CtPhieuDat ctPhieuDat = new CtPhieuDat();
            CtPhieuDatId ctPhieuDatId = new CtPhieuDatId();
            ctPhieuDatId.setIdPd(savedPhieuDat.getIdPd());
            ctPhieuDatId.setIdHangPhong(hangPhong.getIdHangPhong());

            ctPhieuDat.setId(ctPhieuDatId);
            ctPhieuDat.setPhieuDat(savedPhieuDat);
            ctPhieuDat.setHangPhong(hangPhong);
            ctPhieuDat.setSoLuongPhongO(request.getSoLuongPhongO());
            ctPhieuDat.setDonGia(roomPrice);

            ctPhieuDatRepository.save(ctPhieuDat);

            response.setStatusCode(200);
            response.setMessage("Tạo đặt phòng tại quầy lễ tân thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(savedPhieuDat));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo đặt phòng: " + e.getMessage());
        }
        return response;
    }

    /**
     * Create booking from PayPal payment
     */
    @Override
    public Response createBookingFromPayPal(CreateBookingRequest request) {
        // Call non-transactional method to avoid rollback issues
        return createBookingFromPayPalInternal(request);
    }

    // Non-transactional internal method
    private Response createBookingFromPayPalInternal(CreateBookingRequest request) {
        Response response = new Response();
        try {
            // Debug logs
            System.out.println("=== PayPal Booking Request Debug ===");
            System.out.println("CheckIn: " + request.getCheckIn());
            System.out.println("CheckOut: " + request.getCheckOut());
            System.out.println("FullName: " + request.getFullName());
            System.out.println("Phone: " + request.getPhone());
            System.out.println("Email: " + request.getEmail());
            System.out.println("IdCard: " + request.getIdCard());
            if (request.getRoom() != null) {
                System.out.println("Room ID: " + request.getRoom().getIdHangPhong());
                System.out.println("Room Price: " + request.getRoom().getGiaPhong());
            }
            System.out.println("Total Amount: " + request.getTotalAmount());
            System.out.println("Deposit Amount: " + request.getDepositAmount());
            System.out.println("=====================================");

            // Validate request
            if (request.getCheckIn() == null || request.getCheckOut() == null) {
                throw new OurException("Ngày nhận phòng và trả phòng không được để trống");
            }

            System.out.println("Validating booking period...");
            System.out.println("CheckIn: " + request.getCheckIn() + ", CheckOut: " + request.getCheckOut());
            System.out.println("Today: " + LocalDate.now());

            if (!isValidBookingPeriod(request.getCheckIn(), request.getCheckOut())) {
                System.out.println("Booking period validation FAILED");
                throw new OurException("Ngày đặt không hợp lệ");
            }

            System.out.println("Booking period validation PASSED");

            // Find or create customer
            System.out.println("Finding or creating customer...");
            KhachHang khachHang;
            try {
                khachHang = findOrCreateCustomer(request);
                System.out.println("Customer found/created: " + khachHang.getCccd());
            } catch (Exception e) {
                System.out.println("ERROR in findOrCreateCustomer: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }

            // Create PhieuDat
            PhieuDat phieuDat = new PhieuDat();
            phieuDat.setNgayDat(LocalDate.now());
            phieuDat.setNgayBdThue(request.getCheckIn());
            phieuDat.setNgayDi(request.getCheckOut());
            phieuDat.setTrangThai("Chờ xác nhận");
            phieuDat.setSoTienCoc(request.getDepositAmount());
            phieuDat.setKhachHang(khachHang);
            // Note: nhanVien will be null for online bookings

            System.out.println("Saving PhieuDat...");
            PhieuDat savedPhieuDat = phieuDatRepository.save(phieuDat);
            System.out.println("PhieuDat saved with ID: " + savedPhieuDat.getIdPd());

            // Create CtPhieuDat
            if (request.getRoom() != null) {
                System.out.println("Looking for HangPhong with ID: " + request.getRoom().getIdHangPhong());

                HangPhong hangPhong = hangPhongRepository.findById(request.getRoom().getIdHangPhong())
                        .orElseThrow(() -> {
                            System.out.println("HangPhong not found with ID: " + request.getRoom().getIdHangPhong());
                            System.out.println("Available HangPhong IDs: ");
                            hangPhongRepository.findAll()
                                    .forEach(hp -> System.out.println("- ID: " + hp.getIdHangPhong()));
                            return new OurException(
                                    "Hạng phòng không tồn tại với ID: " + request.getRoom().getIdHangPhong());
                        });

                // Kiểm tra số lượng phòng trống
                int requestedQuantity = request.getRoom().getSoLuongPhongDat() != null
                        ? request.getRoom().getSoLuongPhongDat()
                        : 1;

                System.out.println("Found HangPhong: " + hangPhong.getIdHangPhong());

                CtPhieuDat ctPhieuDat = new CtPhieuDat();
                CtPhieuDatId ctId = new CtPhieuDatId();
                ctId.setIdPd(savedPhieuDat.getIdPd());
                ctId.setIdHangPhong(hangPhong.getIdHangPhong());

                ctPhieuDat.setId(ctId);
                ctPhieuDat.setPhieuDat(savedPhieuDat); // Set PhieuDat entity
                ctPhieuDat.setHangPhong(hangPhong); // Set HangPhong entity - THIS WAS MISSING!
                ctPhieuDat.setSoLuongPhongO(
                        request.getRoom().getSoLuongPhongDat() != null ? request.getRoom().getSoLuongPhongDat() : 1);

                // Lấy đơn giá từ totalAmount hoặc depositAmount
                BigDecimal donGia = request.getRoom().getGiaPhong();
                if (donGia == null && request.getTotalAmount() != null) {
                    // Tính đơn giá từ tổng tiền / (số đêm * số lượng phòng)
                    int nights = request.getNights() != null ? request.getNights() : 1;
                    int roomQuantity = request.getRoom().getSoLuongPhongDat() != null
                            ? request.getRoom().getSoLuongPhongDat()
                            : 1;
                    donGia = request.getTotalAmount().divide(
                            BigDecimal.valueOf(nights * roomQuantity), 2,
                            RoundingMode.HALF_UP);
                }

                System.out.println("Setting DON_GIA: " + donGia);
                ctPhieuDat.setDonGia(donGia);

                System.out.println("Saving CtPhieuDat with ID: " + ctId.getIdPd() + ", " + ctId.getIdHangPhong());
                ctPhieuDatRepository.save(ctPhieuDat);
                System.out.println("CtPhieuDat saved successfully");
            }

            response.setStatusCode(200);
            response.setMessage("Đặt phòng thành công");
            response.setPhieuDat(EntityDTOMapper.mapPhieuDatToDTO(savedPhieuDat));
            response.setBookingConfirmationCode("BOOKING_" + savedPhieuDat.getIdPd());

        } catch (OurException e) {
            System.out.println("OurException in createBookingFromPayPal: " + e.getMessage());
            e.printStackTrace();
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception in createBookingFromPayPal: " + e.getMessage());
            e.printStackTrace();
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo đặt phòng: " + e.getMessage());
        }
        return response;
    }

    private KhachHang findOrCreateCustomer(CreateBookingRequest request) {
        System.out.println("=== findOrCreateCustomer Debug ===");
        System.out.println("IdCard: " + request.getIdCard());
        System.out.println("FullName: " + request.getFullName());
        System.out.println("Phone: " + request.getPhone());
        System.out.println("Email: " + request.getEmail());

        // Validate required fields
        if (request.getIdCard() == null || request.getIdCard().trim().isEmpty()) {
            System.out.println("ERROR: CCCD is null or empty");
            throw new OurException("CCCD không được để trống");
        }
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            System.out.println("ERROR: FullName is null or empty");
            throw new OurException("Họ tên không được để trống");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            System.out.println("ERROR: Phone is null or empty");
            throw new OurException("Số điện thoại không được để trống");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            System.out.println("ERROR: Email is null or empty");
            throw new OurException("Email không được để trống");
        }
        System.out.println("All customer fields validation PASSED");

        // Try to find existing customer by CCCD
        System.out.println("Looking for existing customer with CCCD: " + request.getIdCard().trim());
        return khachHangRepository.findByCccd(request.getIdCard().trim())
                .orElseGet(() -> {
                    System.out.println("Customer not found, creating new customer...");
                    // Create new customer
                    KhachHang newCustomer = new KhachHang();
                    newCustomer.setCccd(request.getIdCard().trim());

                    // Parse full name into ho and ten
                    String fullName = request.getFullName().trim();
                    String[] nameParts = fullName.split("\\s+");
                    if (nameParts.length >= 2) {
                        newCustomer.setHo(nameParts[0]);
                        newCustomer
                                .setTen(String.join(" ", java.util.Arrays.copyOfRange(nameParts, 1, nameParts.length)));
                    } else {
                        newCustomer.setHo("");
                        newCustomer.setTen(fullName);
                    }

                    newCustomer.setSdt(request.getPhone().trim());
                    newCustomer.setEmail(request.getEmail().trim());

                    System.out.println("Saving new customer with CCCD: " + newCustomer.getCccd());
                    KhachHang savedCustomer = khachHangRepository.save(newCustomer);
                    System.out.println("New customer saved successfully");
                    return savedCustomer;
                });
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
