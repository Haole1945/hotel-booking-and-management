package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.*;
import com.dev.Hotel.entity.*;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.*;
import com.dev.Hotel.service.interfac.IDoiPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DoiPhongService implements IDoiPhongService {

    @Autowired
    private DoiPhongRepository doiPhongRepository;
    
    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;
    
    @Autowired
    private PhongRepository phongRepository;
    
    @Autowired
    private TrangThaiRepository trangThaiRepository;
    
    @Autowired
    private RoomPricingService roomPricingService;
    
    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;
    
    @Autowired
    private PhuThuRepository phuThuRepository;
    
    @Autowired
    private CtPhuThuRepository ctPhuThuRepository;

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Autowired
    private CTKhachORepository ctKhachORepository;

    @Autowired
    private CtDichVuRepository ctDichVuRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Response getAllDoiPhong() {
        Response response = new Response();
        try {
            List<DoiPhong> doiPhongList = doiPhongRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(doiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDoiPhongById(Integer idCtPt, String soPhongMoi) {
        Response response = new Response();
        try {
            DoiPhongId id = new DoiPhongId(idCtPt, soPhongMoi);
            DoiPhong doiPhong = doiPhongRepository.findById(id)
                    .orElseThrow(() -> new OurException("Không tìm thấy thông tin đổi phòng"));
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhong(mapDoiPhongToDTO(doiPhong));
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response changeRoom(DoiPhongRequest request) {
        Response response = new Response();
        try {
            System.out.println("=== BẮT ĐẦU ĐỔI PHÒNG ===");
            System.out.println("ID CT PT: " + request.getIdCtPt());
            System.out.println("Số phòng mới: " + request.getSoPhongMoi());

            // Validate request
            Response validationResponse = validateRoomChange(request);
            if (validationResponse.getStatusCode() != 200) {
                System.out.println("Validation failed: " + validationResponse.getMessage());
                return validationResponse;
            }
            System.out.println("Validation passed");

            // Get chi tiết phiếu thuê
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(request.getIdCtPt())
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));
            System.out.println("Found CT Phieu Thue: " + ctPhieuThue.getIdCtPt());

            // Get phòng mới
            Phong phongMoi = phongRepository.findById(request.getSoPhongMoi())
                    .orElseThrow(() -> new OurException("Không tìm thấy phòng mới"));
            System.out.println("Found phong moi: " + phongMoi.getSoPhong());

            // Get phòng cũ
            Phong phongCu = ctPhieuThue.getPhong();
            System.out.println("Phong cu: " + phongCu.getSoPhong());

            // Kiểm tra phòng mới có trống không
            if (!"TT001".equals(phongMoi.getTrangThai().getIdTt())) {
                throw new OurException("Phòng " + request.getSoPhongMoi() + " không trống");
            }

            // Lưu số phòng cũ trước khi cập nhật
            String soPhongCu = ctPhieuThue.getPhong().getSoPhong();
            LocalDate ngayDoiPhong = request.getNgayDen() != null ? request.getNgayDen() : LocalDate.now();

            // GIẢI PHÁP MỚI: Tách CtPhieuThue thành 2 giai đoạn
            // 1. Kết thúc giai đoạn phòng cũ
            ctPhieuThue.setNgayDi(ngayDoiPhong);
            CtPhieuThue savedOldCtPhieuThue = ctPhieuThueRepository.save(ctPhieuThue);
            System.out.println("Kết thúc giai đoạn phòng cũ: " + soPhongCu + " đến ngày " + ngayDoiPhong);

            // 2. Tạo CtPhieuThue mới cho phòng mới
            CtPhieuThue newCtPhieuThue = new CtPhieuThue();
            newCtPhieuThue.setPhieuThue(ctPhieuThue.getPhieuThue());
            newCtPhieuThue.setPhong(phongMoi);
            newCtPhieuThue.setNgayDen(ngayDoiPhong);
            newCtPhieuThue.setNgayDi(request.getNgayDi()); // Có thể null nếu chưa checkout
            newCtPhieuThue.setGioDen(LocalTime.now());

            // Lấy giá phòng mới
            BigDecimal giaPhongMoi = getCurrentRoomPrice(phongMoi.getHangPhong().getIdHangPhong());
            newCtPhieuThue.setDonGia(giaPhongMoi);
            newCtPhieuThue.setTtThanhToan("Chưa thanh toán");

            CtPhieuThue savedNewCtPhieuThue = ctPhieuThueRepository.save(newCtPhieuThue);
            System.out.println("Tạo giai đoạn phòng mới: " + phongMoi.getSoPhong() + " từ ngày " + ngayDoiPhong);

            // Copy khách hàng từ CtPhieuThue cũ sang mới
            copyGuestsToNewCtPhieuThue(ctPhieuThue, savedNewCtPhieuThue);

            // Copy dịch vụ và phụ thu chưa thanh toán
            copyServicesAndSurchargesToNewCtPhieuThue(ctPhieuThue, savedNewCtPhieuThue);

            // Tạo đối tượng đổi phòng để lưu lịch sử
            DoiPhong doiPhong = new DoiPhong();
            DoiPhongId doiPhongId = new DoiPhongId(savedNewCtPhieuThue.getIdCtPt(), request.getSoPhongMoi());
            doiPhong.setId(doiPhongId);
            doiPhong.setCtPhieuThue(savedNewCtPhieuThue);
            doiPhong.setPhongMoi(phongMoi);
            doiPhong.setSoPhongCu(soPhongCu);
            doiPhong.setNgayDen(ngayDoiPhong);
            doiPhong.setNgayDi(request.getNgayDi());

            // Lưu thông tin đổi phòng
            System.out.println("Saving DoiPhong record...");
            DoiPhong savedDoiPhong = doiPhongRepository.save(doiPhong);
            entityManager.flush(); // Đảm bảo dữ liệu được lưu ngay lập tức
            System.out.println("DoiPhong saved with ID: " + savedDoiPhong.getId().getIdCtPt() + ", " + savedDoiPhong.getId().getSoPhongMoi());

            // Cập nhật trạng thái phòng
            System.out.println("Updating room statuses...");
            updateRoomStatuses(phongCu, phongMoi);
            System.out.println("Room statuses updated");

            // Tính phí chênh lệch nếu cần (áp dụng cho CtPhieuThue mới)
            if (request.getAutoCalculateFee()) {
                calculateAndApplyRoomChangeFee(savedNewCtPhieuThue, phongMoi, ngayDoiPhong);
            }

            response.setStatusCode(200);
            response.setMessage("Đổi phòng thành công từ " + phongCu.getSoPhong() + " sang " + phongMoi.getSoPhong() +
                              ". Đã tách thành 2 giai đoạn tính tiền riêng biệt.");
            response.setDoiPhong(mapDoiPhongToDTO(savedDoiPhong));

            System.out.println("=== ĐỔI PHÒNG THÀNH CÔNG ===");
            System.out.println("Từ phòng: " + phongCu.getSoPhong() + " sang phòng: " + phongMoi.getSoPhong());

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response requestRoomChange(DoiPhongRequest request) {
        Response response = new Response();
        try {
            // Chỉ validate yêu cầu, không thực hiện đổi phòng
            Response validationResponse = validateRoomChange(request);
            if (validationResponse.getStatusCode() != 200) {
                return validationResponse;
            }

            response.setStatusCode(200);
            response.setMessage("Yêu cầu đổi phòng hợp lệ. Có thể tiến hành đổi phòng.");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xử lý yêu cầu đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkRoomChangeEligibility(Integer idCtPt) {
        Response response = new Response();
        try {
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));

            RoomChangeEligibilityDTO eligibility = new RoomChangeEligibilityDTO();
            eligibility.setIdCtPt(idCtPt);
            eligibility.setSoPhongHienTai(ctPhieuThue.getPhong().getSoPhong());
            eligibility.setNgayDen(ctPhieuThue.getNgayDen());
            eligibility.setNgayDi(ctPhieuThue.getNgayDi());
            eligibility.setTenKhachHang(ctPhieuThue.getPhieuThue().getKhachHang().getTen());
            eligibility.setCccd(ctPhieuThue.getPhieuThue().getKhachHang().getCccd());

            List<String> reasons = new ArrayList<>();
            LocalDate currentDate = LocalDate.now();

            // Kiểm tra thời gian thuê còn hiệu lực
            if (ctPhieuThue.getNgayDi() != null && ctPhieuThue.getNgayDi().isBefore(currentDate)) {
                reasons.add("Thời gian thuê đã hết hạn");
            }

            // Kiểm tra ngày hiện tại có nằm trong khoảng NGAY_DEN - NGAY_DI không
            if (ctPhieuThue.getNgayDen() != null && ctPhieuThue.getNgayDen().isAfter(currentDate)) {
                reasons.add("Chưa đến ngày nhận phòng");
            }

            // Kiểm tra đã đổi phòng lần nào chưa
            List<DoiPhong> existingChanges = doiPhongRepository.findByCtPhieuThueId(idCtPt);
            if (!existingChanges.isEmpty()) {
                reasons.add("Khách hàng đã đổi phòng cho lần thuê này, không thể đổi lần nữa");
            }

            // Nếu có lỗi thì trả về không đủ điều kiện
            if (!reasons.isEmpty()) {
                eligibility.setEligible(false);
                eligibility.setReason(String.join(", ", reasons));
                eligibility.setHanChe(reasons); // Sử dụng trường hanChe để lưu danh sách lý do
                response.setStatusCode(200);
                response.setMessage("Không đủ điều kiện đổi phòng");
                response.setRoomChangeEligibility(eligibility);
                return response;
            }

            // Tính số ngày còn lại
            if (ctPhieuThue.getNgayDi() != null) {
                long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(currentDate, ctPhieuThue.getNgayDi());
                eligibility.setSoNgayConLai((int) daysRemaining);
                eligibility.setThoiGianHopLe(daysRemaining > 0);
            }

            // Lấy danh sách phòng có thể đổi
            List<Phong> availableRooms = phongRepository.findAvailableRooms();
            eligibility.setDanhSachPhongCoTheDoiPhong(EntityDTOMapper.mapPhongListToDTO(availableRooms));

            eligibility.setEligible(true);
            eligibility.setReason("Đủ điều kiện đổi phòng");

            response.setStatusCode(200);
            response.setMessage("Kiểm tra điều kiện đổi phòng thành công");
            response.setRoomChangeEligibility(eligibility);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra điều kiện đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response calculateRoomChangeFee(Integer idCtPt, String soPhongMoi) {
        Response response = new Response();
        try {
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));

            Phong phongMoi = phongRepository.findById(soPhongMoi)
                    .orElseThrow(() -> new OurException("Không tìm thấy phòng mới"));

            RoomChangeFeeCalculationDTO calculation = calculateFeeDetails(ctPhieuThue, phongMoi, LocalDate.now());

            response.setStatusCode(200);
            response.setMessage("Tính phí đổi phòng thành công");
            response.setRoomChangeFeeCalculation(calculation);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tính phí đổi phòng: " + e.getMessage());
        }
        return response;
    }

    // Helper methods will be added in the next part due to length limit
    private void updateRoomStatuses(Phong phongCu, Phong phongMoi) {
        try {
            System.out.println("Updating room statuses...");
            System.out.println("Phong cu: " + phongCu.getSoPhong() + " - Current status: " + phongCu.getTrangThai().getIdTt());
            System.out.println("Phong moi: " + phongMoi.getSoPhong() + " - Current status: " + phongMoi.getTrangThai().getIdTt());

            // Cập nhật trạng thái phòng cũ thành "Đang dọn dẹp" (TT003)
            TrangThai cleaningStatus = trangThaiRepository.findById("TT003")
                    .orElseThrow(() -> new OurException("Không tìm thấy trạng thái 'Đang dọn dẹp'"));
            phongCu.setTrangThai(cleaningStatus);
            phongRepository.save(phongCu);
            System.out.println("Updated phong cu to: " + cleaningStatus.getIdTt());

            // Cập nhật trạng thái phòng mới thành "Đang sử dụng" (TT002)
            TrangThai occupiedStatus = trangThaiRepository.findById("TT002")
                    .orElseThrow(() -> new OurException("Không tìm thấy trạng thái 'Đang sử dụng'"));
            phongMoi.setTrangThai(occupiedStatus);
            phongRepository.save(phongMoi);
            System.out.println("Updated phong moi to: " + occupiedStatus.getIdTt());

            entityManager.flush(); // Đảm bảo dữ liệu được lưu ngay lập tức
        } catch (Exception e) {
            System.err.println("Error updating room statuses: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private RoomChangeFeeCalculationDTO calculateFeeDetails(CtPhieuThue ctPhieuThue, Phong phongMoi, LocalDate ngayDoiPhong) {
        RoomChangeFeeCalculationDTO calculation = new RoomChangeFeeCalculationDTO();
        
        calculation.setIdCtPt(ctPhieuThue.getIdCtPt());
        calculation.setSoPhongCu(ctPhieuThue.getPhong().getSoPhong());
        calculation.setSoPhongMoi(phongMoi.getSoPhong());
        calculation.setNgayDoiPhong(ngayDoiPhong);

        // Tính số ngày còn lại
        if (ctPhieuThue.getNgayDi() != null) {
            long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(ngayDoiPhong, ctPhieuThue.getNgayDi());
            calculation.setSoNgayConLai((int) Math.max(0, daysRemaining));
        }

        // Lấy giá phòng hiện tại và phòng mới
        BigDecimal giaPhongCu = roomPricingService.getPriceForDate(ctPhieuThue.getPhong().getHangPhong().getIdHangPhong(), ngayDoiPhong);
        BigDecimal giaPhongMoi = roomPricingService.getPriceForDate(phongMoi.getHangPhong().getIdHangPhong(), ngayDoiPhong);
        
        calculation.setGiaPhongCu(giaPhongCu);
        calculation.setGiaPhongMoi(giaPhongMoi);
        
        // Tính chênh lệch giá
        BigDecimal chenhLech = giaPhongMoi.subtract(giaPhongCu);
        calculation.setChenhLechGiaMotNgay(chenhLech);
        
        if (calculation.getSoNgayConLai() != null) {
            BigDecimal tongChenhLech = chenhLech.multiply(BigDecimal.valueOf(calculation.getSoNgayConLai()));
            calculation.setTongChenhLechGia(tongChenhLech);
            calculation.setTongTienTruocKhuyenMai(tongChenhLech);
            calculation.setTongTienSauKhuyenMai(tongChenhLech);
            
            if (tongChenhLech.compareTo(BigDecimal.ZERO) > 0) {
                calculation.setSoTienKhachCanTra(tongChenhLech);
                calculation.setLoaiGiaoDich("THU_THEM");
            } else if (tongChenhLech.compareTo(BigDecimal.ZERO) < 0) {
                calculation.setSoTienKhachDuocHoan(tongChenhLech.abs());
                calculation.setLoaiGiaoDich("HOAN_TIEN");
            } else {
                calculation.setLoaiGiaoDich("KHONG_THAY_DOI");
            }
        }

        calculation.setCoPhiPhatSinh(chenhLech.compareTo(BigDecimal.ZERO) != 0);
        
        return calculation;
    }

    private void calculateAndApplyRoomChangeFee(CtPhieuThue ctPhieuThue, Phong phongMoi, LocalDate ngayDoiPhong) {
        RoomChangeFeeCalculationDTO calculation = calculateFeeDetails(ctPhieuThue, phongMoi, ngayDoiPhong);

        // Nếu có phí phát sinh và là upgrade (giá cao hơn), tạo phụ thu
        if (calculation.getCoPhiPhatSinh() && calculation.getTongChenhLechGia() != null &&
            calculation.getTongChenhLechGia().compareTo(BigDecimal.ZERO) > 0) {

            // Tạo phụ thu đổi phòng với tổng tiền chênh lệch
            createRoomChangeExtraFee(ctPhieuThue, calculation.getTongChenhLechGia());
        }
    }

    private void createRoomChangeExtraFee(CtPhieuThue ctPhieuThue, BigDecimal totalAmount) {
        try {
            // Lấy thông tin hạng phòng cũ và mới
            Integer hangPhongCu = ctPhieuThue.getPhong().getHangPhong().getIdHangPhong();

            // Tìm phòng mới từ DoiPhong đã lưu
            List<DoiPhong> doiPhongList = doiPhongRepository.findByCtPhieuThueId(ctPhieuThue.getIdCtPt());
            if (doiPhongList.isEmpty()) {
                return;
            }

            DoiPhong latestDoiPhong = doiPhongList.get(0); // Lấy đổi phòng mới nhất
            Integer hangPhongMoi = latestDoiPhong.getPhongMoi().getHangPhong().getIdHangPhong();

            // Tính số ngày còn lại
            LocalDate currentDate = LocalDate.now();
            LocalDate ngayDi = ctPhieuThue.getNgayDi();
            int soNgayConLai = 1; // Mặc định 1 ngày

            if (ngayDi != null && ngayDi.isAfter(currentDate)) {
                soNgayConLai = (int) java.time.temporal.ChronoUnit.DAYS.between(currentDate, ngayDi);
            }

            // Tạo ID phụ thu theo format của bạn
            String idPhuThu = generatePhuThuId(hangPhongCu, hangPhongMoi);

            // Tìm phụ thu trong database
            Optional<PhuThu> phuThuOpt = phuThuRepository.findById(idPhuThu);
            if (phuThuOpt.isPresent()) {
                PhuThu phuThu = phuThuOpt.get();

                // Tạo chi tiết phụ thu
                CtPhuThu ctPhuThu = new CtPhuThu();
                CtPhuThuId ctPhuThuId = new CtPhuThuId();
                ctPhuThuId.setIdPhuThu(phuThu.getIdPhuThu());
                ctPhuThuId.setIdCtPt(ctPhieuThue.getIdCtPt());

                ctPhuThu.setId(ctPhuThuId);
                ctPhuThu.setPhuThu(phuThu);
                ctPhuThu.setCtPhieuThue(ctPhieuThue);
                ctPhuThu.setDonGia(totalAmount.divide(BigDecimal.valueOf(soNgayConLai), 2, java.math.RoundingMode.HALF_UP)); // Đơn giá = tổng tiền / số ngày
                ctPhuThu.setSoLuong(soNgayConLai); // Số lượng = số ngày còn lại
                ctPhuThu.setTtThanhToan("Chưa thanh toán");

                ctPhuThuRepository.save(ctPhuThu);
            } else {
                System.err.println("Không tìm thấy phụ thu với ID: " + idPhuThu);
            }
        } catch (Exception e) {
            // Log error but don't fail the room change
            System.err.println("Lỗi khi tạo phụ thu đổi phòng: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void updateRoomPriceInCtPhieuThue(CtPhieuThue ctPhieuThue, Phong phongMoi) {
        try {
            System.out.println("Updating room price for hang phong: " + phongMoi.getHangPhong().getIdHangPhong());

            // Lấy giá hiện tại của hạng phòng mới
            BigDecimal giaPhongMoi = getCurrentRoomPrice(phongMoi.getHangPhong().getIdHangPhong());
            BigDecimal giaPhongCu = ctPhieuThue.getDonGia();

            System.out.println("Giá phòng cũ: " + giaPhongCu);
            System.out.println("Giá phòng mới: " + giaPhongMoi);

            if (giaPhongMoi != null) {
                // Cập nhật đơn giá trong ct_phieu_thue
                ctPhieuThue.setDonGia(giaPhongMoi);
                System.out.println("Đã cập nhật giá phòng từ " + giaPhongCu + " thành " + giaPhongMoi);
            } else {
                System.out.println("Không tìm thấy giá phòng mới, giữ nguyên giá cũ");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật giá phòng: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private BigDecimal getCurrentRoomPrice(Integer idHangPhong) {
        try {
            // Tìm giá hiện tại của hạng phòng
            LocalDate currentDate = LocalDate.now();

            // Query để lấy giá hiện tại
            Optional<GiaHangPhong> giaOpt = giaHangPhongRepository.findLatestPriceByHangPhong(idHangPhong, currentDate);

            if (giaOpt.isPresent()) {
                return giaOpt.get().getGia();
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy giá hạng phòng: " + e.getMessage());
        }
        return null;
    }

    private String generatePhuThuId(Integer hangPhongCu, Integer hangPhongMoi) {
        // Tạo ID phụ thu theo bảng mapping của bạn
        if (hangPhongCu >= hangPhongMoi) {
            return null; // Không có phụ thu khi downgrade
        }

        // Mapping theo bảng phụ thu của bạn
        String key = "H" + hangPhongCu + "_H" + hangPhongMoi;

        switch (key) {
            // H1 lên các hạng khác
            case "H1_H2": return "PT004";
            case "H1_H3": return "PT005";
            case "H1_H4": return "PT006";
            case "H1_H5": return "PT007";
            case "H1_H6": return "PT008";
            case "H1_H7": return "PT009";
            case "H1_H8": return "PT010";

            // H2 lên các hạng khác
            case "H2_H3": return "PT011";
            case "H2_H4": return "PT012";
            case "H2_H5": return "PT013";
            case "H2_H6": return "PT014";
            case "H2_H7": return "PT015";
            case "H2_H8": return "PT016";

            // H3 lên các hạng khác
            case "H3_H4": return "PT017";
            case "H3_H5": return "PT018";
            case "H3_H6": return "PT019";
            case "H3_H7": return "PT020";
            case "H3_H8": return "PT021";

            // H4 lên các hạng khác
            case "H4_H5": return "PT022";
            case "H4_H6": return "PT023";
            case "H4_H7": return "PT024";
            case "H4_H8": return "PT025";

            // H5 lên các hạng khác
            case "H5_H6": return "PT026"; // Bạn thiếu PT026 trong danh sách
            case "H5_H7": return "PT027";
            case "H5_H8": return "PT028";

            // H6 lên các hạng khác
            case "H6_H7": return "PT029";
            case "H6_H8": return "PT030";

            // H7 lên H8
            case "H7_H8": return "PT031";

            default:
                System.err.println("Không tìm thấy phụ thu cho: " + key);
                return null;
        }
    }

    @Override
    public Response validateRoomChange(DoiPhongRequest request) {
        Response response = new Response();
        List<String> errors = new ArrayList<>();

        try {
            // Kiểm tra thông tin cơ bản
            if (request.getIdCtPt() == null) {
                errors.add("ID chi tiết phiếu thuê không được để trống");
            }

            if (request.getSoPhongMoi() == null || request.getSoPhongMoi().trim().isEmpty()) {
                errors.add("Số phòng mới không được để trống");
            }

            if (!errors.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Dữ liệu không hợp lệ: " + String.join(", ", errors));
                return response;
            }

            // Kiểm tra chi tiết phiếu thuê tồn tại
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(request.getIdCtPt())
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));

            // Kiểm tra thời gian thuê còn hiệu lực
            LocalDate currentDate = LocalDate.now();
            if (ctPhieuThue.getNgayDi() != null && ctPhieuThue.getNgayDi().isBefore(currentDate)) {
                errors.add("Thời gian thuê đã hết hạn, không thể đổi phòng");
            }

            // Kiểm tra ngày hiện tại có nằm trong khoảng NGAY_DEN - NGAY_DI không
            if (ctPhieuThue.getNgayDen() != null && ctPhieuThue.getNgayDen().isAfter(currentDate)) {
                errors.add("Chưa đến ngày nhận phòng, không thể đổi phòng");
            }

            // Kiểm tra đã đổi phòng lần nào chưa (kiểm tra bảng doiphong)
            List<DoiPhong> existingChanges = doiPhongRepository.findByCtPhieuThueId(request.getIdCtPt());
            if (!existingChanges.isEmpty()) {
                errors.add("Khách hàng đã đổi phòng cho lần thuê này, không thể đổi lần nữa");
            }

            // Kiểm tra phòng mới tồn tại
            Phong phongMoi = phongRepository.findById(request.getSoPhongMoi())
                    .orElse(null);
            if (phongMoi == null) {
                errors.add("Phòng mới không tồn tại");
            } else {
                // Kiểm tra phòng mới có trống không
                if (!"TT001".equals(phongMoi.getTrangThai().getIdTt())) {
                    errors.add("Phòng " + request.getSoPhongMoi() + " không trống");
                }

                // Kiểm tra không đổi sang cùng phòng
                if (phongMoi.getSoPhong().equals(ctPhieuThue.getPhong().getSoPhong())) {
                    errors.add("Không thể đổi sang cùng phòng hiện tại");
                }
            }

            if (!errors.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Không thể đổi phòng: " + String.join(", ", errors));
                return response;
            }

            response.setStatusCode(200);
            response.setMessage("Dữ liệu hợp lệ");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra dữ liệu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDoiPhongByCtPhieuThue(Integer idCtPt) {
        Response response = new Response();
        try {
            List<DoiPhong> doiPhongList = doiPhongRepository.findByCtPhieuThueId(idCtPt);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(doiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRoomChangeHistory(Integer idCtPt) {
        return getDoiPhongByCtPhieuThue(idCtPt);
    }

    @Override
    public Response getAvailableRoomsForChange(Integer idCtPt) {
        Response response = new Response();
        try {
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));

            // Lấy danh sách phòng trống
            List<Phong> availableRooms = phongRepository.findAvailableRooms();

            // Loại bỏ phòng hiện tại
            availableRooms.removeIf(phong -> phong.getSoPhong().equals(ctPhieuThue.getPhong().getSoPhong()));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhongList(EntityDTOMapper.mapPhongListToDTO(availableRooms));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng có thể đổi: " + e.getMessage());
        }
        return response;
    }

    // Helper method to map DoiPhong to DTO
    private DoiPhongDTO mapDoiPhongToDTO(DoiPhong doiPhong) {
        DoiPhongDTO dto = new DoiPhongDTO();
        dto.setIdCtPt(doiPhong.getId().getIdCtPt());
        dto.setSoPhongMoi(doiPhong.getId().getSoPhongMoi());
        dto.setNgayDen(doiPhong.getNgayDen());
        dto.setNgayDi(doiPhong.getNgayDi());

        // Thông tin phòng cũ - lấy từ trường soPhongCu đã lưu
        dto.setSoPhongCu(doiPhong.getSoPhongCu());

        // Tìm thông tin phòng cũ để lấy hạng phòng
        Phong phongCu = null;
        if (doiPhong.getSoPhongCu() != null) {
            phongCu = phongRepository.findById(doiPhong.getSoPhongCu()).orElse(null);
        }
        if (phongCu != null && phongCu.getHangPhong() != null) {
            if (phongCu.getHangPhong().getKieuPhong() != null) {
                dto.setTenKieuPhongCu(phongCu.getHangPhong().getKieuPhong().getTenKp());
            }
            if (phongCu.getHangPhong().getLoaiPhong() != null) {
                dto.setTenLoaiPhongCu(phongCu.getHangPhong().getLoaiPhong().getTenLp());
            }
        }

        // Thông tin phòng mới
        Phong phongMoi = doiPhong.getPhongMoi();
        if (phongMoi.getHangPhong() != null) {
            if (phongMoi.getHangPhong().getKieuPhong() != null) {
                dto.setTenKieuPhongMoi(phongMoi.getHangPhong().getKieuPhong().getTenKp());
            }
            if (phongMoi.getHangPhong().getLoaiPhong() != null) {
                dto.setTenLoaiPhongMoi(phongMoi.getHangPhong().getLoaiPhong().getTenLp());
            }
        }

        // Thông tin khách hàng
        if (doiPhong.getCtPhieuThue().getPhieuThue() != null &&
            doiPhong.getCtPhieuThue().getPhieuThue().getKhachHang() != null) {
            KhachHang khachHang = doiPhong.getCtPhieuThue().getPhieuThue().getKhachHang();
            dto.setTenKhachHang(khachHang.getHo() + " " + khachHang.getTen());
            dto.setCccd(khachHang.getCccd());
            dto.setSdtKhachHang(khachHang.getSdt());
        }

        return dto;
    }

    private List<DoiPhongDTO> mapDoiPhongListToDTO(List<DoiPhong> doiPhongList) {
        List<DoiPhongDTO> dtoList = new ArrayList<>();
        for (DoiPhong doiPhong : doiPhongList) {
            dtoList.add(mapDoiPhongToDTO(doiPhong));
        }
        return dtoList;
    }

    // Remaining interface methods with basic implementations
    @Override
    public Response createDoiPhong(DoiPhongRequest request) {
        return requestRoomChange(request);
    }

    @Override
    public Response updateDoiPhong(Integer idCtPt, String soPhongMoi, DoiPhongRequest request) {
        // Implementation for updating room change details
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng cập nhật đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response deleteDoiPhong(Integer idCtPt, String soPhongMoi) {
        // Implementation for canceling room change
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng hủy đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response getDoiPhongByPhongMoi(String soPhongMoi) {
        Response response = new Response();
        try {
            List<DoiPhong> doiPhongList = doiPhongRepository.findByPhongMoiSoPhong(soPhongMoi);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(doiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử đổi phòng theo phòng mới: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDoiPhongByKhachHang(String cccd) {
        Response response = new Response();
        try {
            List<DoiPhong> doiPhongList = doiPhongRepository.findByKhachHangCccd(cccd);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(doiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử đổi phòng theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDoiPhongByDateRange(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<DoiPhong> doiPhongList = doiPhongRepository.findByNgayDenBetween(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(doiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử đổi phòng theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response approveRoomChange(Integer idCtPt, String soPhongMoi) {
        // Implementation for approving room change
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng phê duyệt đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response cancelRoomChange(Integer idCtPt, String soPhongMoi, String reason) {
        // Implementation for canceling room change
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng hủy đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response completeRoomChange(Integer idCtPt, String soPhongMoi) {
        // Implementation for completing room change
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng hoàn thành đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response getRoomChangeStatistics(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            List<Object[]> statistics = doiPhongRepository.getRoomChangeStatistics(startDate, endDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStatistics(statistics);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê đổi phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentRoomChanges() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();
            List<DoiPhong> currentChanges = doiPhongRepository.findByNgayDenBetween(currentDate, currentDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDoiPhongList(mapDoiPhongListToDTO(currentChanges));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách đổi phòng hiện tại: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchDoiPhong(String keyword) {
        // Implementation for searching room changes
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng tìm kiếm đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response filterDoiPhong(LocalDate startDate, LocalDate endDate, String cccd) {
        // Implementation for filtering room changes
        Response response = new Response();
        response.setStatusCode(501);
        response.setMessage("Chức năng lọc đổi phòng chưa được triển khai");
        return response;
    }

    @Override
    public Response debugCtPhieuThue(Integer idCtPt) {
        Response response = new Response();
        try {
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy chi tiết phiếu thuê"));

            StringBuilder debug = new StringBuilder();
            debug.append("=== DEBUG CT PHIEU THUE ===\n");
            debug.append("ID CT PT: ").append(ctPhieuThue.getIdCtPt()).append("\n");
            debug.append("So Phong: ").append(ctPhieuThue.getPhong().getSoPhong()).append("\n");
            debug.append("Ngay Den: ").append(ctPhieuThue.getNgayDen()).append("\n");
            debug.append("Ngay Di: ").append(ctPhieuThue.getNgayDi()).append("\n");
            debug.append("Don Gia: ").append(ctPhieuThue.getDonGia()).append("\n");

            // Kiểm tra lịch sử đổi phòng
            List<DoiPhong> doiPhongList = doiPhongRepository.findByCtPhieuThueId(idCtPt);
            debug.append("So lan doi phong: ").append(doiPhongList.size()).append("\n");

            for (DoiPhong dp : doiPhongList) {
                debug.append("- Doi phong: ").append(dp.getSoPhongCu()).append(" -> ").append(dp.getId().getSoPhongMoi()).append("\n");
                debug.append("  Ngay doi: ").append(dp.getNgayDen()).append("\n");
            }

            response.setStatusCode(200);
            response.setMessage(debug.toString());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi debug: " + e.getMessage());
        }
        return response;
    }

    /**
     * Copy khách hàng từ CtPhieuThue cũ sang CtPhieuThue mới khi đổi phòng
     */
    private void copyGuestsToNewCtPhieuThue(CtPhieuThue oldCtPhieuThue, CtPhieuThue newCtPhieuThue) {
        try {
            // Lấy danh sách khách từ CtPhieuThue cũ
            List<CtKhachO> oldGuests = ctKhachORepository.findByIdCtPt(oldCtPhieuThue.getIdCtPt());

            // Copy sang CtPhieuThue mới
            for (CtKhachO oldGuest : oldGuests) {
                CtKhachO newGuest = new CtKhachO();

                // Set các trường ID (CtKhachO sử dụng @IdClass)
                newGuest.setIdCtPt(newCtPhieuThue.getIdCtPt());
                newGuest.setCccd(oldGuest.getCccd());
                newGuest.setCtPhieuThue(newCtPhieuThue);
                newGuest.setKhachHang(oldGuest.getKhachHang());

                ctKhachORepository.save(newGuest);
            }

            System.out.println("Đã copy " + oldGuests.size() + " khách hàng sang CtPhieuThue mới");

        } catch (Exception e) {
            System.err.println("Lỗi khi copy khách hàng: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Copy dịch vụ và phụ thu chưa thanh toán từ CtPhieuThue cũ sang mới
     */
    private void copyServicesAndSurchargesToNewCtPhieuThue(CtPhieuThue oldCtPhieuThue, CtPhieuThue newCtPhieuThue) {
        try {
            // Copy dịch vụ chưa thanh toán
            List<CtDichVu> oldServices = ctDichVuRepository.findByCtPhieuThue(oldCtPhieuThue);
            for (CtDichVu oldService : oldServices) {
                if (!"Đã thanh toán".equals(oldService.getTtThanhToan())) {
                    CtDichVu newService = new CtDichVu();

                    // Tạo composite key mới
                    CtDichVuId newServiceId = new CtDichVuId();
                    newServiceId.setIdCtPt(newCtPhieuThue.getIdCtPt());
                    newServiceId.setIdDv(oldService.getId().getIdDv());

                    newService.setId(newServiceId);
                    newService.setNgaySuDung(oldService.getNgaySuDung());
                    newService.setDonGia(oldService.getDonGia());
                    newService.setSoLuong(oldService.getSoLuong());
                    newService.setTtThanhToan("Chưa thanh toán");
                    newService.setCtPhieuThue(newCtPhieuThue);
                    newService.setDichVu(oldService.getDichVu());

                    ctDichVuRepository.save(newService);

                    // Xóa dịch vụ cũ để tránh trùng lặp
                    ctDichVuRepository.delete(oldService);
                }
            }

            // Copy phụ thu chưa thanh toán
            List<CtPhuThu> oldSurcharges = ctPhuThuRepository.findByCtPhieuThue(oldCtPhieuThue);
            for (CtPhuThu oldSurcharge : oldSurcharges) {
                if (!"Đã thanh toán".equals(oldSurcharge.getTtThanhToan())) {
                    CtPhuThu newSurcharge = new CtPhuThu();

                    // Tạo composite key mới
                    CtPhuThuId newSurchargeId = new CtPhuThuId();
                    newSurchargeId.setIdPhuThu(oldSurcharge.getId().getIdPhuThu());
                    newSurchargeId.setIdCtPt(newCtPhieuThue.getIdCtPt());

                    newSurcharge.setId(newSurchargeId);
                    newSurcharge.setDonGia(oldSurcharge.getDonGia());
                    newSurcharge.setSoLuong(oldSurcharge.getSoLuong());
                    newSurcharge.setTtThanhToan("Chưa thanh toán");
                    newSurcharge.setCtPhieuThue(newCtPhieuThue);
                    newSurcharge.setPhuThu(oldSurcharge.getPhuThu());

                    ctPhuThuRepository.save(newSurcharge);

                    // Xóa phụ thu cũ để tránh trùng lặp
                    ctPhuThuRepository.delete(oldSurcharge);
                }
            }

            System.out.println("Đã copy dịch vụ và phụ thu chưa thanh toán sang CtPhieuThue mới");

        } catch (Exception e) {
            System.err.println("Lỗi khi copy dịch vụ và phụ thu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
