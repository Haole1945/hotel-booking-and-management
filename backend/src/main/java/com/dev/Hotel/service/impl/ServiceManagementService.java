package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.CtDichVu;
import com.dev.Hotel.entity.CtDichVuId;
import com.dev.Hotel.entity.CtPhuThu;
import com.dev.Hotel.entity.CtPhuThuId;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.entity.*;
import com.dev.Hotel.repo.CtDichVuRepository;
import com.dev.Hotel.repo.CtPhuThuRepository;
import com.dev.Hotel.repo.CtPhieuThueRepository;
import com.dev.Hotel.repo.DichVuRepository;
import com.dev.Hotel.repo.PhuThuRepository;
import com.dev.Hotel.service.interfac.IServiceManagementService;
import com.dev.Hotel.service.impl.PriceService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ServiceManagementService implements IServiceManagementService {

    @Autowired
    private CtDichVuRepository ctDichVuRepository;

    @Autowired
    private CtPhuThuRepository ctPhuThuRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private PhuThuRepository phuThuRepository;

    @Autowired
    private PriceService priceService;

    @Override
    public Response getAllServiceUsage() {
        Response response = new Response();
        try {
            List<CtDichVu> ctDichVuList = ctDichVuRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(ctDichVuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách sử dụng dịch vụ: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentActiveServices() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();
            List<CtDichVu> ctDichVuList = ctDichVuRepository.findCurrentActiveServices(currentDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(ctDichVuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách dịch vụ đang sử dụng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getServiceUsageByRoom(String soPhong) {
        Response response = new Response();
        try {
            // Get current stays for this room
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhongSoPhong(soPhong);
            
            // Get all service usage for these stays
            List<CtDichVu> allServices = ctDichVuRepository.findAllWithDetails();
            List<CtDichVu> roomServices = allServices.stream()
                .filter(cd -> ctPhieuThueList.stream()
                    .anyMatch(ct -> ct.getIdCtPt().equals(cd.getCtPhieuThue().getIdCtPt())))
                .toList();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(roomServices));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy dịch vụ theo phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getServiceUsageByCustomer(String cccd) {
        Response response = new Response();
        try {
            List<CtDichVu> allServices = ctDichVuRepository.findAllWithDetails();
            List<CtDichVu> customerServices = allServices.stream()
                .filter(cd -> cd.getCtPhieuThue().getPhieuThue().getKhachHang().getCccd().equals(cccd))
                .toList();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(customerServices));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy dịch vụ theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getServiceUsageByDate(String startDate, String endDate) {
        Response response = new Response();
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate start = LocalDate.parse(startDate, formatter);
            LocalDate end = LocalDate.parse(endDate, formatter);
            
            List<CtDichVu> ctDichVuList = ctDichVuRepository.findByNgaySuDungBetween(start, end);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(ctDichVuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy dịch vụ theo ngày: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllSurchargeUsage() {
        Response response = new Response();
        try {
            List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(ctPhuThuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách sử dụng phụ thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentActiveSurcharges() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();
            List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findCurrentActiveSurcharges(currentDate);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(ctPhuThuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phụ thu đang sử dụng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getSurchargeUsageByRoom(String soPhong) {
        Response response = new Response();
        try {
            // Get current stays for this room
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhongSoPhong(soPhong);
            
            // Get all surcharge usage for these stays
            List<CtPhuThu> allSurcharges = ctPhuThuRepository.findAllWithDetails();
            List<CtPhuThu> roomSurcharges = allSurcharges.stream()
                .filter(cp -> ctPhieuThueList.stream()
                    .anyMatch(ct -> ct.getIdCtPt().equals(cp.getCtPhieuThue().getIdCtPt())))
                .toList();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(roomSurcharges));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phụ thu theo phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getSurchargeUsageByCustomer(String cccd) {
        Response response = new Response();
        try {
            List<CtPhuThu> allSurcharges = ctPhuThuRepository.findAllWithDetails();
            List<CtPhuThu> customerSurcharges = allSurcharges.stream()
                .filter(cp -> cp.getCtPhieuThue().getPhieuThue().getKhachHang().getCccd().equals(cccd))
                .toList();
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(customerSurcharges));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy phụ thu theo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getServiceAndSurchargeReport() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();
            
            // Get current active services and surcharges
            List<CtDichVu> activeServices = ctDichVuRepository.findCurrentActiveServices(currentDate);
            List<CtPhuThu> activeSurcharges = ctPhuThuRepository.findCurrentActiveSurcharges(currentDate);
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(activeServices));
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(activeSurcharges));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy báo cáo dịch vụ và phụ thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCurrentActiveBookingsWithServices() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();
            List<CtPhieuThue> currentStays = ctPhieuThueRepository.findCurrentStays(currentDate);
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtPhieuThueList(EntityDTOMapper.mapCtPhieuThueListToDTO(currentStays));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phiếu thuê đang hoạt động: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRevenueByServiceAndSurcharge() {
        Response response = new Response();
        try {
            // This would require more complex calculations
            // For now, return basic data
            List<CtDichVu> allServices = ctDichVuRepository.findAll();
            List<CtPhuThu> allSurcharges = ctPhuThuRepository.findAll();

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(allServices));
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(allSurcharges));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy doanh thu dịch vụ và phụ thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDashboardData() {
        Response response = new Response();
        try {
            LocalDate currentDate = LocalDate.now();

            // Get all rooms with status TT002 (occupied), regardless of checkout date
            List<CtPhieuThue> currentStays = ctPhieuThueRepository.findAllOccupiedRooms();

            // Manually fetch services and surcharges for each CtPhieuThue to avoid Cartesian product
            for (CtPhieuThue ctPhieuThue : currentStays) {
                try {
                    // Fetch services
                    List<CtDichVu> services = ctDichVuRepository.findByCtPhieuThueId(ctPhieuThue.getIdCtPt());
                    ctPhieuThue.setDanhSachDichVu(services);

                    // Fetch surcharges
                    List<CtPhuThu> surcharges = ctPhuThuRepository.findByCtPhieuThueId(ctPhieuThue.getIdCtPt());
                    ctPhieuThue.setDanhSachPhuThu(surcharges);
                } catch (Exception e) {
                    // If error fetching services/surcharges, set empty lists
                    ctPhieuThue.setDanhSachDichVu(new ArrayList<>());
                    ctPhieuThue.setDanhSachPhuThu(new ArrayList<>());
                }
            }

            // Get current active services and surcharges using existing methods
            List<CtDichVu> currentActiveServices = ctDichVuRepository.findCurrentActiveServices(currentDate);
            List<CtPhuThu> currentActiveSurcharges = ctPhuThuRepository.findCurrentActiveSurcharges(currentDate);

            // Stats are now calculated on frontend side

            // Set all data in response
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setCtDichVuList(EntityDTOMapper.mapCtDichVuListToDTO(currentActiveServices));
            response.setCtPhuThuList(EntityDTOMapper.mapCtPhuThuListToDTO(currentActiveSurcharges));
            response.setCtPhieuThueList(EntityDTOMapper.mapCtPhieuThueListToDTO(currentStays));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy dữ liệu dashboard: " + e.getMessage());
        }
        return response;
    }



    @Override
    public Response addServiceToBooking(Integer idCtPt, String idDv, Integer soLuong) {
        Response response = new Response();
        try {
            // Validate inputs
            if (idCtPt == null || idDv == null || soLuong == null || soLuong <= 0) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtPhieuThue
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt).orElse(null);
            if (ctPhieuThue == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy chi tiết phiếu thuê");
                return response;
            }

            // Find DichVu
            DichVu dichVu = dichVuRepository.findById(idDv).orElse(null);
            if (dichVu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy dịch vụ");
                return response;
            }

            // Get current price of service
            BigDecimal currentPrice = getCurrentServicePrice(idDv);

            // Create CtDichVu with composite key
            CtDichVuId ctDichVuId = new CtDichVuId(idCtPt, idDv);
            CtDichVu ctDichVu = new CtDichVu();
            ctDichVu.setId(ctDichVuId);
            ctDichVu.setNgaySuDung(LocalDate.now());
            ctDichVu.setDonGia(currentPrice);
            ctDichVu.setSoLuong(soLuong);
            ctDichVu.setTtThanhToan("Chưa thanh toán");
            ctDichVu.setCtPhieuThue(ctPhieuThue);
            ctDichVu.setDichVu(dichVu);

            CtDichVu savedCtDichVu = ctDichVuRepository.save(ctDichVu);

            response.setStatusCode(200);
            response.setMessage("Thêm dịch vụ thành công");
            response.setCtDichVu(EntityDTOMapper.mapCtDichVuToDTO(savedCtDichVu));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm dịch vụ: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response addSurchargeToBooking(Integer idCtPt, String idPhuThu, Integer soLuong) {
        Response response = new Response();
        try {
            // Validate inputs
            if (idCtPt == null || idPhuThu == null || soLuong == null || soLuong <= 0) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtPhieuThue
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt).orElse(null);
            if (ctPhieuThue == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy chi tiết phiếu thuê");
                return response;
            }

            // Find PhuThu
            PhuThu phuThu = phuThuRepository.findById(idPhuThu).orElse(null);
            if (phuThu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
                return response;
            }

            // Get current price of surcharge
            BigDecimal currentPrice = getCurrentSurchargePrice(idPhuThu);

            // Create CtPhuThu with composite key
            CtPhuThuId ctPhuThuId = new CtPhuThuId(idPhuThu, idCtPt);
            CtPhuThu ctPhuThu = new CtPhuThu();
            ctPhuThu.setId(ctPhuThuId);
            ctPhuThu.setTtThanhToan("Chưa thanh toán");
            ctPhuThu.setDonGia(currentPrice);
            ctPhuThu.setSoLuong(soLuong);
            ctPhuThu.setPhuThu(phuThu);
            ctPhuThu.setCtPhieuThue(ctPhieuThue);

            CtPhuThu savedCtPhuThu = ctPhuThuRepository.save(ctPhuThu);

            response.setStatusCode(200);
            response.setMessage("Thêm phụ thu thành công");
            response.setCtPhuThu(EntityDTOMapper.mapCtPhuThuToDTO(savedCtPhuThu));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm phụ thu: " + e.getMessage());
        }
        return response;
    }

    // Helper method to get current service price
    private BigDecimal getCurrentServicePrice(String idDv) {
        return priceService.getLatestServicePrice(idDv)
                .orElse(new BigDecimal("100000")); // Default price if not found
    }

    // Helper method to get current surcharge price
    private BigDecimal getCurrentSurchargePrice(String idPhuThu) {
        return priceService.getLatestSurchargePrice(idPhuThu)
                .orElse(new BigDecimal("50000")); // Default price if not found
    }

    @Override
    public Response updateServicePaymentStatus(Integer idCtPt, String idDv, String newStatus) {
        Response response = new Response();
        try {
            // Validate inputs
            if (idCtPt == null || idDv == null || newStatus == null) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtDichVu
            CtDichVu ctDichVu = ctDichVuRepository.findByIdCtPtAndIdDv(idCtPt, idDv);
            if (ctDichVu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy dịch vụ");
                return response;
            }

            // Update payment status
            ctDichVu.setTtThanhToan(newStatus);
            ctDichVuRepository.save(ctDichVu);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thanh toán dịch vụ thành công");
            response.setCtDichVu(EntityDTOMapper.mapCtDichVuToDTO(ctDichVu));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái thanh toán dịch vụ: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateSurchargePaymentStatus(String idPhuThu, Integer idCtPt, String newStatus) {
        Response response = new Response();
        try {
            // Validate inputs
            if (idPhuThu == null || idCtPt == null || newStatus == null) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtPhuThu
            CtPhuThu ctPhuThu = ctPhuThuRepository.findByIdPhuThuAndIdCtPt(idPhuThu, idCtPt);
            if (ctPhuThu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
                return response;
            }

            // Update payment status
            ctPhuThu.setTtThanhToan(newStatus);
            ctPhuThuRepository.save(ctPhuThu);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thanh toán phụ thu thành công");
            response.setCtPhuThu(EntityDTOMapper.mapCtPhuThuToDTO(ctPhuThu));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái thanh toán phụ thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateRoomPaymentStatus(Integer idCtPt, String newStatus) {
        Response response = new Response();
        try {
            // Validate inputs
            if (idCtPt == null || newStatus == null) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtPhieuThue
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt).orElse(null);
            if (ctPhieuThue == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy chi tiết phiếu thuê");
                return response;
            }

            // Update payment status
            ctPhieuThue.setTtThanhToan(newStatus);
            ctPhieuThueRepository.save(ctPhieuThue);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái thanh toán phòng thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái thanh toán phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteServiceFromBooking(Integer idCtPt, String idDv) {
        Response response = new Response();
        try {
            // Validate input
            if (idCtPt == null || idDv == null) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtDichVu
            CtDichVu ctDichVu = ctDichVuRepository.findByIdCtPtAndIdDv(idCtPt, idDv);
            if (ctDichVu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy dịch vụ");
                return response;
            }

            // Check if already paid
            if ("Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                response.setStatusCode(400);
                response.setMessage("Không thể xóa dịch vụ đã thanh toán");
                return response;
            }

            // Delete the service
            ctDichVuRepository.delete(ctDichVu);

            response.setStatusCode(200);
            response.setMessage("Xóa dịch vụ thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa dịch vụ: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteSurchargeFromBooking(String idPhuThu, Integer idCtPt) {
        Response response = new Response();
        try {
            // Validate input
            if (idPhuThu == null || idCtPt == null) {
                response.setStatusCode(400);
                response.setMessage("Thông tin không hợp lệ");
                return response;
            }

            // Find CtPhuThu
            CtPhuThu ctPhuThu = ctPhuThuRepository.findByIdPhuThuAndIdCtPt(idPhuThu, idCtPt);
            if (ctPhuThu == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
                return response;
            }

            // Check if already paid
            if ("Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                response.setStatusCode(400);
                response.setMessage("Không thể xóa phụ thu đã thanh toán");
                return response;
            }

            // Delete the surcharge
            ctPhuThuRepository.delete(ctPhuThu);

            response.setStatusCode(200);
            response.setMessage("Xóa phụ thu thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phụ thu: " + e.getMessage());
        }
        return response;
    }
}
