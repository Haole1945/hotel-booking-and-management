package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.CreateInvoiceRequest;
import com.dev.Hotel.dto.HoaDonDetailsDTO;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.*;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.*;
import com.dev.Hotel.service.interfac.IHoaDonService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService implements IHoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private CtDichVuRepository ctDichVuRepository;

    @Autowired
    private CtPhuThuRepository ctPhuThuRepository;

    @Autowired
    private PhongRepository phongRepository;

    @Autowired
    private TrangThaiRepository trangThaiRepository;

    @Override
    public Response getAllHoaDon() {
        Response response = new Response();
        try {
            List<HoaDon> hoaDonList = hoaDonRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHoaDonById(String idHd) {
        Response response = new Response();
        try {
            Optional<HoaDon> hoaDonOptional = hoaDonRepository.findById(idHd);
            if (hoaDonOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(hoaDonOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hóa đơn");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createHoaDon(CreateInvoiceRequest request) {
        Response response = new Response();
        try {
            // Validate request
            if (request.getIdPt() == null) {
                throw new OurException("ID phiếu thuê không được để trống");
            }

            // Find PhieuThue
            PhieuThue phieuThue = phieuThueRepository.findById(request.getIdPt())
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            // Find NhanVien
            NhanVien nhanVien = null;
            if (request.getIdNv() != null) {
                nhanVien = nhanVienRepository.findById(request.getIdNv())
                        .orElseThrow(() -> new OurException("Không tìm thấy nhân viên"));
            }

            // Generate invoice ID
            String invoiceId = generateInvoiceId();

            // Create HoaDon
            HoaDon hoaDon = new HoaDon();
            hoaDon.setIdHd(invoiceId);
            hoaDon.setNgayLap(LocalDate.now());
            hoaDon.setTongTien(request.getTongTien());
            hoaDon.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Chưa thanh toán");
            hoaDon.setPhieuThue(phieuThue);
            hoaDon.setNhanVien(nhanVien);

            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Tạo hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(savedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response createInvoiceFromCheckout(Integer idPt, String actualCheckOut) {
        Response response = new Response();
        try {
            // Find PhieuThue
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            // Check if invoice already exists
            Optional<HoaDon> existingInvoice = hoaDonRepository.findByPhieuThue(phieuThue);
            if (existingInvoice.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Hóa đơn đã tồn tại");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(existingInvoice.get()));
                return response;
            }

            // THỰC HIỆN CHECKOUT TRƯỚC KHI TẠO HÓA ĐƠN
            LocalDate checkoutDate = actualCheckOut != null ?
                LocalDate.parse(actualCheckOut) : LocalDate.now();
            performCheckoutProcess(phieuThue, checkoutDate);

            // Calculate total amount (phòng + dịch vụ + phụ thu)
            BigDecimal totalAmount = calculateTotalAmount(phieuThue);

            // Trừ tiền đặt cọc để có số tiền phải trả thực tế
            BigDecimal depositAmount = BigDecimal.ZERO;
            if (phieuThue.getPhieuDat() != null && phieuThue.getPhieuDat().getSoTienCoc() != null) {
                depositAmount = phieuThue.getPhieuDat().getSoTienCoc();
            }

            // TONG_TIEN = Tổng chi phí - Tiền đặt cọc (số tiền phải trả)
            BigDecimal finalAmount = totalAmount.subtract(depositAmount);
            finalAmount = finalAmount.max(BigDecimal.ZERO); // Không âm

            System.out.println("Tính toán hóa đơn:");
            System.out.println("- Tổng chi phí: " + totalAmount);
            System.out.println("- Tiền đặt cọc: " + depositAmount);
            System.out.println("- Số tiền phải trả: " + finalAmount);

            // Generate invoice ID
            String invoiceId = generateInvoiceId();

            // Create HoaDon
            HoaDon hoaDon = new HoaDon();
            hoaDon.setIdHd(invoiceId);
            hoaDon.setNgayLap(LocalDate.now());
            hoaDon.setTongTien(finalAmount); // Sử dụng số tiền đã trừ cọc
            hoaDon.setTrangThai("Chưa thanh toán");
            hoaDon.setPhieuThue(phieuThue);
            hoaDon.setNhanVien(phieuThue.getNhanVien());

            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);

            // Cập nhật ID hóa đơn vào tất cả CtPhieuThue
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            System.out.println("Updating " + ctPhieuThueList.size() + " CtPhieuThue records with invoice ID: "
                    + savedHoaDon.getIdHd());

            for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
                // Chỉ cập nhật các phòng chưa thanh toán
                if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                    ctPhieuThue.setIdHd(savedHoaDon.getIdHd());
                    ctPhieuThue.setTtThanhToan("Đã thanh toán");
                    CtPhieuThue updated = ctPhieuThueRepository.save(ctPhieuThue);
                    System.out.println("Updated CtPhieuThue ID: " + updated.getIdCtPt() +
                        " with invoice ID: " + updated.getIdHd() + " - Status: Đã thanh toán");
                }

                // Cập nhật ID hóa đơn vào tất cả CtDichVu chưa thanh toán của CtPhieuThue này
                List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtDichVu ctDichVu : ctDichVuList) {
                    if (!"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                        ctDichVu.setIdHd(savedHoaDon.getIdHd());
                        ctDichVu.setTtThanhToan("Đã thanh toán");
                        ctDichVuRepository.save(ctDichVu);
                        System.out.println("Updated CtDichVu: " + ctDichVu.getId().getIdDv() +
                            " - Status: Đã thanh toán");
                    }
                }

                // Cập nhật ID hóa đơn vào tất cả CtPhuThu chưa thanh toán của CtPhieuThue này
                List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtPhuThu ctPhuThu : ctPhuThuList) {
                    if (!"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                        ctPhuThu.setIdHd(savedHoaDon.getIdHd());
                        ctPhuThu.setTtThanhToan("Đã thanh toán");
                        ctPhuThuRepository.save(ctPhuThu);
                        System.out.println("Updated CtPhuThu: " + ctPhuThu.getId().getIdPhuThu() +
                            " - Status: Đã thanh toán");
                    }
                }
            }

            response.setStatusCode(200);
            response.setMessage("Tạo hóa đơn từ checkout thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(savedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hóa đơn từ checkout: " + e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response createInvoiceFromCheckoutWithPromotions(Integer idPt, String actualCheckOut, BigDecimal promotionDiscount) {
        Response response = new Response();
        try {
            // Find PhieuThue
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            // Check if invoice already exists
            Optional<HoaDon> existingInvoice = hoaDonRepository.findByPhieuThue(phieuThue);
            if (existingInvoice.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Hóa đơn đã tồn tại");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(existingInvoice.get()));
                return response;
            }

            // THỰC HIỆN CHECKOUT TRƯỚC KHI TẠO HÓA ĐƠN
            LocalDate checkoutDate = actualCheckOut != null ?
                LocalDate.parse(actualCheckOut) : LocalDate.now();
            performCheckoutProcess(phieuThue, checkoutDate);

            // Calculate total amount (phòng + dịch vụ + phụ thu)
            BigDecimal totalAmount = calculateTotalAmount(phieuThue);

            // Áp dụng khuyến mãi
            BigDecimal discountAmount = promotionDiscount != null ? promotionDiscount : BigDecimal.ZERO;
            BigDecimal amountAfterDiscount = totalAmount.subtract(discountAmount);

            // Trừ tiền đặt cọc để có số tiền phải trả thực tế
            BigDecimal depositAmount = BigDecimal.ZERO;
            if (phieuThue.getPhieuDat() != null && phieuThue.getPhieuDat().getSoTienCoc() != null) {
                depositAmount = phieuThue.getPhieuDat().getSoTienCoc();
            }

            // TONG_TIEN = Tổng chi phí - Khuyến mãi - Tiền đặt cọc (số tiền phải trả)
            BigDecimal finalAmount = amountAfterDiscount.subtract(depositAmount);
            finalAmount = finalAmount.max(BigDecimal.ZERO); // Không âm

            System.out.println("Tính toán hóa đơn với khuyến mãi:");
            System.out.println("- Tổng chi phí: " + totalAmount);
            System.out.println("- Khuyến mãi: " + discountAmount);
            System.out.println("- Sau khuyến mãi: " + amountAfterDiscount);
            System.out.println("- Tiền đặt cọc: " + depositAmount);
            System.out.println("- Số tiền phải trả: " + finalAmount);

            // Generate invoice ID
            String invoiceId = generateInvoiceId();

            // Create HoaDon
            HoaDon hoaDon = new HoaDon();
            hoaDon.setIdHd(invoiceId);
            hoaDon.setNgayLap(LocalDate.now());
            hoaDon.setTongTien(finalAmount); // Sử dụng số tiền đã trừ cọc và khuyến mãi
            hoaDon.setSoTienGiam(discountAmount); // Lưu số tiền khuyến mãi
            hoaDon.setTrangThai("Chưa thanh toán");
            hoaDon.setPhieuThue(phieuThue);
            hoaDon.setNhanVien(phieuThue.getNhanVien());

            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);

            // Cập nhật ID hóa đơn vào tất cả CtPhieuThue (tương tự method gốc)
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
                if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                    ctPhieuThue.setIdHd(savedHoaDon.getIdHd());
                    ctPhieuThue.setTtThanhToan("Đã thanh toán");
                    CtPhieuThue updated = ctPhieuThueRepository.save(ctPhieuThue);
                    System.out.println("Updated CtPhieuThue ID: " + updated.getIdCtPt() +
                        " with invoice ID: " + updated.getIdHd() + " - Status: Đã thanh toán");
                }

                // Cập nhật ID hóa đơn vào tất cả CtDichVu chưa thanh toán của CtPhieuThue này
                List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtDichVu ctDichVu : ctDichVuList) {
                    if (!"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                        ctDichVu.setIdHd(savedHoaDon.getIdHd());
                        ctDichVu.setTtThanhToan("Đã thanh toán");
                        ctDichVuRepository.save(ctDichVu);
                        System.out.println("Updated CtDichVu: " + ctDichVu.getId().getIdDv() +
                            " - Status: Đã thanh toán");
                    }
                }

                // Cập nhật ID hóa đơn vào tất cả CtPhuThu chưa thanh toán của CtPhieuThue này
                List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtPhuThu ctPhuThu : ctPhuThuList) {
                    if (!"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                        ctPhuThu.setIdHd(savedHoaDon.getIdHd());
                        ctPhuThu.setTtThanhToan("Đã thanh toán");
                        ctPhuThuRepository.save(ctPhuThu);
                        System.out.println("Updated CtPhuThu: " + ctPhuThu.getId().getIdPhuThu() +
                            " - Status: Đã thanh toán");
                    }
                }
            }

            response.setStatusCode(200);
            response.setMessage("Tạo hóa đơn từ checkout với khuyến mãi thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(savedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hóa đơn từ checkout với khuyến mãi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getInvoiceDetails(String idHd) {
        Response response = new Response();
        try {
            // Find HoaDon
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            // Get PhieuThue from HoaDon
            PhieuThue phieuThue = hoaDon.getPhieuThue();

            // Create invoice details DTO
            HoaDonDetailsDTO invoiceDetails = new HoaDonDetailsDTO();
            invoiceDetails.setIdHd(hoaDon.getIdHd());
            invoiceDetails.setIdPt(phieuThue.getIdPt());
            invoiceDetails.setNgayLap(hoaDon.getNgayLap());
            invoiceDetails.setTongTien(hoaDon.getTongTien());
            invoiceDetails.setSoTienGiam(hoaDon.getSoTienGiam()); // Thêm số tiền khuyến mãi
            invoiceDetails.setTrangThai(hoaDon.getTrangThai());

            // Customer info
            if (phieuThue.getKhachHang() != null) {
                invoiceDetails.setCccdKhachHang(phieuThue.getKhachHang().getCccd());
                // Lấy cả họ và tên
                String hoTenKhachHang = (phieuThue.getKhachHang().getHo() != null ? phieuThue.getKhachHang().getHo() + " " : "") +
                                       (phieuThue.getKhachHang().getTen() != null ? phieuThue.getKhachHang().getTen() : "");
                invoiceDetails.setHoTenKhachHang(hoTenKhachHang.trim());
                invoiceDetails.setSdtKhachHang(phieuThue.getKhachHang().getSdt());
                invoiceDetails.setEmailKhachHang(phieuThue.getKhachHang().getEmail());
            }

            // Employee info
            if (hoaDon.getNhanVien() != null) {
                invoiceDetails.setIdNv(hoaDon.getNhanVien().getIdNv());
                // Lấy cả họ và tên nhân viên
                String hoTenNhanVien = (hoaDon.getNhanVien().getHo() != null ? hoaDon.getNhanVien().getHo() + " " : "") +
                                      (hoaDon.getNhanVien().getTen() != null ? hoaDon.getNhanVien().getTen() : "");
                invoiceDetails.setHoTenNhanVien(hoTenNhanVien.trim());
            }

            // Booking info - tiền đặt cọc và mã phiếu thuê
            if (phieuThue.getPhieuDat() != null) {
                invoiceDetails.setSoTienCoc(phieuThue.getPhieuDat().getSoTienCoc());
            }
            // Tạo mã phiếu thuê từ ID
            invoiceDetails.setMaPhieuThue("PT" + String.format("%06d", phieuThue.getIdPt()));

            // Tìm ngày check-in sớm nhất từ ctPhieuThue
            List<CtPhieuThue> allCtPhieuThue = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            LocalDate earliestCheckIn = allCtPhieuThue.stream()
                    .filter(ct -> ct.getNgayDen() != null)
                    .map(CtPhieuThue::getNgayDen)
                    .min(LocalDate::compareTo)
                    .orElse(null);
            invoiceDetails.setNgayCheckIn(earliestCheckIn);

            // Get PAID room details (có ID_HD và trạng thái "Đã thanh toán")
            List<CtPhieuThue> paidRooms = ctPhieuThueRepository.findByPhieuThue(phieuThue)
                    .stream()
                    .filter(ct -> idHd.equals(ct.getIdHd()) && "Đã thanh toán".equals(ct.getTtThanhToan()))
                    .toList();

            List<HoaDonDetailsDTO.RoomDetailDTO> roomDetails = new ArrayList<>();
            for (CtPhieuThue ctPhieuThue : paidRooms) {
                HoaDonDetailsDTO.RoomDetailDTO roomDto = new HoaDonDetailsDTO.RoomDetailDTO();
                roomDto.setIdCtPt(ctPhieuThue.getIdCtPt());
                roomDto.setSoPhong(ctPhieuThue.getPhong().getSoPhong());
                roomDto.setTenKieuPhong(ctPhieuThue.getPhong().getHangPhong().getKieuPhong().getTenKp());
                roomDto.setTenLoaiPhong(ctPhieuThue.getPhong().getHangPhong().getLoaiPhong().getTenLp());
                roomDto.setNgayDen(ctPhieuThue.getNgayDen());
                roomDto.setNgayDi(ctPhieuThue.getNgayDi());
                roomDto.setDonGia(ctPhieuThue.getDonGia());

                // Calculate days and total
                if (ctPhieuThue.getNgayDen() != null && ctPhieuThue.getNgayDi() != null) {
                    long days = java.time.temporal.ChronoUnit.DAYS.between(
                        ctPhieuThue.getNgayDen(), ctPhieuThue.getNgayDi());
                    days = Math.max(1, days);
                    roomDto.setSoNgay((int) days);
                    roomDto.setThanhTien(ctPhieuThue.getDonGia().multiply(BigDecimal.valueOf(days)));
                }

                roomDetails.add(roomDto);
            }
            invoiceDetails.setDanhSachPhong(roomDetails);

            // Get PAID service details (có ID_HD và trạng thái "Đã thanh toán")
            List<CtDichVu> paidServices = new ArrayList<>();
            for (CtPhieuThue ctPhieuThue : paidRooms) {
                List<CtDichVu> services = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue)
                        .stream()
                        .filter(dv -> idHd.equals(dv.getIdHd()) && "Đã thanh toán".equals(dv.getTtThanhToan()))
                        .toList();
                paidServices.addAll(services);
            }

            List<HoaDonDetailsDTO.ServiceDetailDTO> serviceDetails = new ArrayList<>();
            for (CtDichVu ctDichVu : paidServices) {
                HoaDonDetailsDTO.ServiceDetailDTO serviceDto = new HoaDonDetailsDTO.ServiceDetailDTO();
                serviceDto.setIdDv(ctDichVu.getId().getIdDv());
                serviceDto.setIdCtPt(ctDichVu.getId().getIdCtPt());
                serviceDto.setTenDv(ctDichVu.getDichVu().getTenDv());
                serviceDto.setDonViTinh(ctDichVu.getDichVu().getDonViTinh());
                serviceDto.setNgaySuDung(ctDichVu.getNgaySuDung());
                serviceDto.setDonGia(ctDichVu.getDonGia());
                serviceDto.setSoLuong(ctDichVu.getSoLuong());
                serviceDto.setThanhTien(ctDichVu.getDonGia().multiply(BigDecimal.valueOf(ctDichVu.getSoLuong())));

                // Thêm thông tin phòng
                serviceDto.setSoPhong(ctDichVu.getCtPhieuThue().getPhong().getSoPhong());
                serviceDetails.add(serviceDto);
            }
            invoiceDetails.setDanhSachDichVu(serviceDetails);

            // Get PAID surcharge details (có ID_HD và trạng thái "Đã thanh toán")
            List<CtPhuThu> paidSurcharges = new ArrayList<>();
            for (CtPhieuThue ctPhieuThue : paidRooms) {
                List<CtPhuThu> surcharges = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue)
                        .stream()
                        .filter(pt -> idHd.equals(pt.getIdHd()) && "Đã thanh toán".equals(pt.getTtThanhToan()))
                        .toList();
                paidSurcharges.addAll(surcharges);
            }

            List<HoaDonDetailsDTO.SurchargeDetailDTO> surchargeDetails = new ArrayList<>();
            for (CtPhuThu ctPhuThu : paidSurcharges) {
                HoaDonDetailsDTO.SurchargeDetailDTO surchargeDto = new HoaDonDetailsDTO.SurchargeDetailDTO();
                surchargeDto.setIdPhuThu(ctPhuThu.getId().getIdPhuThu());
                surchargeDto.setIdCtPt(ctPhuThu.getId().getIdCtPt());
                surchargeDto.setLoaiPhuThu(ctPhuThu.getPhuThu().getTenPhuThu());
                surchargeDto.setMoTa(ctPhuThu.getPhuThu().getLyDo());
                surchargeDto.setDonGia(ctPhuThu.getDonGia());
                surchargeDto.setSoLuong(ctPhuThu.getSoLuong());
                surchargeDto.setThanhTien(ctPhuThu.getDonGia().multiply(BigDecimal.valueOf(ctPhuThu.getSoLuong())));

                // Thêm thông tin phòng
                surchargeDto.setSoPhong(ctPhuThu.getCtPhieuThue().getPhong().getSoPhong());
                surchargeDetails.add(surchargeDto);
            }
            invoiceDetails.setDanhSachPhuThu(surchargeDetails);

            response.setStatusCode(200);
            response.setMessage("Lấy chi tiết hóa đơn thành công");
            response.setHoaDonDetails(invoiceDetails);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy chi tiết hóa đơn: " + e.getMessage());
        }
        return response;
    }

    /**
     * Thực hiện quá trình checkout: chỉ cập nhật ngày checkout và trạng thái phòng
     * KHÔNG đánh dấu "Đã thanh toán" ở đây (sẽ làm sau khi tạo hóa đơn)
     */
    private void performCheckoutProcess(PhieuThue phieuThue, LocalDate actualCheckOutDate) {
        List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);

        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            // Chỉ xử lý phòng chưa thanh toán
            if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                // KHÔNG cập nhật ngayDi - giữ nguyên ngày đi ban đầu
                // chỉ cập nhật trạng thái phòng về "Đang dọn dẹp"
                Phong phong = ctPhieuThue.getPhong();
                if (phong != null && phong.getTrangThai() != null) {
                    // Tìm trạng thái "Đang dọn dẹp"
                    Optional<TrangThai> trangThaiDonDep = trangThaiRepository.findByTenTrangThai("Đang dọn dẹp");
                    if (trangThaiDonDep.isPresent()) {
                        phong.setTrangThai(trangThaiDonDep.get());
                        phongRepository.save(phong);
                        System.out.println("Cập nhật phòng " + phong.getSoPhong() + " về trạng thái 'Đang dọn dẹp'");
                    }
                }

                if (phong != null) {
                    System.out.println("Checkout phòng " + phong.getSoPhong() +
                        ": Giữ nguyên ngayDi = " + ctPhieuThue.getNgayDi() +
                        ", Checkout thực tế = " + actualCheckOutDate);
                }
            }
        }

        System.out.println("Hoàn thành quá trình checkout cho PhieuThue ID: " + phieuThue.getIdPt());
    }

    private BigDecimal calculateTotalAmount(PhieuThue phieuThue) {
        BigDecimal total = BigDecimal.ZERO;

        // Add room charges - CHỈ TÍNH PHÒNG CHƯA THANH TOÁN
        List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            // CHỈ TÍNH PHÒNG CHƯA THANH TOÁN
            if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan()) && ctPhieuThue.getDonGia() != null) {
                // Tính tiền dựa trên số ngày đã đặt trước (ngayDen -> ngayDi trong CtPhieuThue)
                LocalDate checkInDate = ctPhieuThue.getNgayDen();
                LocalDate checkOutDate = ctPhieuThue.getNgayDi();

                // Nếu chưa có ngayDi (chưa đặt trước ngày checkout), báo lỗi
                if (checkOutDate == null) {
                    throw new OurException("Không thể tính hóa đơn: Phòng " +
                        ctPhieuThue.getPhong().getSoPhong() + " chưa có ngày checkout dự kiến. " +
                        "Vui lòng cập nhật ngày checkout trong chi tiết phiếu thuê.");
                }

                long days = java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
                days = Math.max(1, days); // At least 1 day

                total = total.add(ctPhieuThue.getDonGia().multiply(BigDecimal.valueOf(days)));
            }
        }

        // Add service charges - CHỈ TÍNH DỊCH VỤ CỦA PHÒNG CHƯA THANH TOÁN
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            // Chỉ tính dịch vụ của phòng chưa thanh toán
            if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtDichVu ctDichVu : ctDichVuList) {
                    if (ctDichVu.getDonGia() != null && ctDichVu.getSoLuong() != null
                            && !"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                        total = total.add(ctDichVu.getDonGia().multiply(BigDecimal.valueOf(ctDichVu.getSoLuong())));
                    }
                }
            }
        }

        // Add surcharges - CHỈ TÍNH PHỤ THU CỦA PHÒNG CHƯA THANH TOÁN
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            // Chỉ tính phụ thu của phòng chưa thanh toán
            if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtPhuThu ctPhuThu : ctPhuThuList) {
                    if (ctPhuThu.getDonGia() != null && ctPhuThu.getSoLuong() != null
                            && !"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                        total = total.add(ctPhuThu.getDonGia().multiply(BigDecimal.valueOf(ctPhuThu.getSoLuong())));
                    }
                }
            } // Đóng block if cho phòng chưa thanh toán
        }

        return total;
    }

    private String generateInvoiceId() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String prefix = "HD" + today;

        // Find the latest invoice for today
        List<HoaDon> todayInvoices = hoaDonRepository.findByIdHdStartingWithOrderByIdHdDesc(prefix);

        int nextNumber = 1;
        if (!todayInvoices.isEmpty()) {
            String lastId = todayInvoices.get(0).getIdHd();
            String numberPart = lastId.substring(prefix.length());
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%02d", nextNumber);
    }

    @Override
    public Response updateHoaDon(String idHd, CreateInvoiceRequest request) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            if (request.getTongTien() != null) {
                hoaDon.setTongTien(request.getTongTien());
            }
            if (request.getTrangThai() != null) {
                hoaDon.setTrangThai(request.getTrangThai());
            }

            HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Cập nhật hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(updatedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteHoaDon(String idHd) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            hoaDonRepository.delete(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Xóa hóa đơn thành công");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHoaDonByPhieuThue(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            Optional<HoaDon> hoaDonOptional = hoaDonRepository.findByPhieuThue(phieuThue);
            if (hoaDonOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(hoaDonOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hóa đơn cho phiếu thuê này");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateInvoiceStatus(String idHd, String trangThai) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            hoaDon.setTrangThai(trangThai);
            HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(updatedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getInvoicesByDateRange(String startDate, String endDate) {
        Response response = new Response();
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            List<HoaDon> hoaDonList = hoaDonRepository.findByNgayLapBetween(start, end);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getInvoicesByStatus(String trangThai) {
        Response response = new Response();
        try {
            List<HoaDon> hoaDonList = hoaDonRepository.findByTrangThai(trangThai);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn theo trạng thái: " + e.getMessage());
        }
        return response;
    }
}
