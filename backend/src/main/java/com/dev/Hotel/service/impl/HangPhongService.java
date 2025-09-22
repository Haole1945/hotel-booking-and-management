package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.TienNghiDTO;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.entity.TienNghi;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.repo.TienNghiRepository;
import com.dev.Hotel.service.interfac.IHangPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HangPhongService implements IHangPhongService {

    @Autowired
    private HangPhongRepository hangPhongRepository;

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Autowired
    private TienNghiRepository tienNghiRepository;

    @Autowired
    private RoomPricingService roomPricingService;

    @Override
    public Response getAllHangPhong() {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongById(Integer idHangPhong) {
        Response response = new Response();
        try {
            Optional<HangPhong> hangPhong = hangPhongRepository.findById(idHangPhong);
            if (hangPhong.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(hangPhong.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createHangPhong(HangPhong hangPhong) {
        Response response = new Response();
        try {
            HangPhong savedHangPhong = hangPhongRepository.save(hangPhong);
            response.setStatusCode(200);
            response.setMessage("Tạo hạng phòng thành công");
            response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(savedHangPhong));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateHangPhong(Integer idHangPhong, HangPhong hangPhong) {
        Response response = new Response();
        try {
            Optional<HangPhong> existingHangPhong = hangPhongRepository.findById(idHangPhong);
            if (existingHangPhong.isPresent()) {
                hangPhong.setIdHangPhong(idHangPhong);
                HangPhong updatedHangPhong = hangPhongRepository.save(hangPhong);
                response.setStatusCode(200);
                response.setMessage("Cập nhật hạng phòng thành công");
                response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(updatedHangPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteHangPhong(Integer idHangPhong) {
        Response response = new Response();
        try {
            if (hangPhongRepository.existsById(idHangPhong)) {
                hangPhongRepository.deleteById(idHangPhong);
                response.setStatusCode(200);
                response.setMessage("Xóa hạng phòng thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByKieuPhong(String idKp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongId(idKp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByLoaiPhong(String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByLoaiPhongId(idLp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByKieuAndLoai(String idKp, String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(idKp, idLp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo kiểu và loại phòng: " + e.getMessage());
        }
        return response;
    }

    // Method to get room price by idKp and idLp
    public Response getRoomPriceByKieuAndLoai(String idKp, String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(idKp, idLp);
            if (hangPhongList.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng với kiểu phòng và loại phòng này");
                return response;
            }

            // Get the first matching room category
            HangPhong hangPhong = hangPhongList.get(0);

            // Get current price using new pricing service
            BigDecimal roomPrice = roomPricingService.getCurrentPrice(hangPhong.getIdHangPhong());

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setRoomPrice(roomPrice);
            response.setMinDeposit(roomPrice.multiply(BigDecimal.valueOf(0.2))); // 20% minimum deposit

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy giá phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAvailableHangPhong() {
        // Implementation for available room categories
        return getAllHangPhong();
    }

    @Override
    public Response getHangPhongWithAvailableRooms() {
        // Implementation for room categories with available rooms
        return getAllHangPhong();
    }

    @Override
    public Response getHangPhongStatistics() {
        Response response = new Response();
        try {
            long totalHangPhong = hangPhongRepository.count();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStats(totalHangPhong);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchHangPhong(String keyword) {
        // Implementation for search functionality
        return getAllHangPhong();
    }

    @Override
    public Response filterHangPhong(String idKp, String idLp) {
        if (idKp != null && idLp != null) {
            return getHangPhongByKieuAndLoai(idKp, idLp);
        } else if (idKp != null) {
            return getHangPhongByKieuPhong(idKp);
        } else if (idLp != null) {
            return getHangPhongByLoaiPhong(idLp);
        } else {
            return getAllHangPhong();
        }
    }

    // ===== ROOM PRICE MANAGEMENT METHODS =====

    @Transactional(readOnly = true)
    public Response getRoomPrices(Integer idHangPhong) {
        Response response = new Response();
        try {
            List<GiaHangPhong> prices = giaHangPhongRepository.findByIdHangPhongOrderByNgayApDungDesc(idHangPhong);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setGiaHangPhongList(EntityDTOMapper.mapGiaHangPhongListToDTO(prices));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách giá: " + e.getMessage());
            e.printStackTrace(); // Log the full exception for debugging
        }
        return response;
    }

    @Transactional
    public Response addRoomPrice(Integer idHangPhong, Map<String, Object> request) {
        Response response = new Response();
        try {
            // Validate hang phong exists
            Optional<HangPhong> hangPhongOpt = hangPhongRepository.findById(idHangPhong);
            if (!hangPhongOpt.isPresent()) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
                return response;
            }

            LocalDate ngayApDung = LocalDate.parse(request.get("ngayApDung").toString());
            BigDecimal gia = new BigDecimal(request.get("gia").toString());
            String idNv = request.get("idNv").toString();

            // Kiểm tra ngày áp dụng phải là tương lai
            if (ngayApDung.isBefore(LocalDate.now()) || ngayApDung.isEqual(LocalDate.now())) {
                response.setStatusCode(400);
                response.setMessage("Ngày áp dụng phải là ngày trong tương lai");
                return response;
            }

            // Check if price already exists for this date
            Optional<GiaHangPhong> existingPrice = giaHangPhongRepository.findByIdHangPhongAndNgayApDung(idHangPhong,
                    ngayApDung);
            if (existingPrice.isPresent()) {
                response.setStatusCode(400);
                response.setMessage("Đã có giá cho ngày này");
                return response;
            }

            GiaHangPhong giaHangPhong = new GiaHangPhong();
            giaHangPhong.setIdHangPhong(idHangPhong);
            giaHangPhong.setNgayApDung(ngayApDung);
            giaHangPhong.setGia(gia);
            giaHangPhong.setNgayThietLap(LocalDate.now());
            giaHangPhong.setIdNv(idNv);

            giaHangPhongRepository.save(giaHangPhong);

            response.setStatusCode(200);
            response.setMessage("Thêm giá thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm giá: " + e.getMessage());
            e.printStackTrace(); // Log the full exception for debugging
        }
        return response;
    }

    @Transactional
    public Response updateRoomPrice(Integer idHangPhong, LocalDate ngayApDung, Map<String, Object> request) {
        Response response = new Response();
        try {
            // Kiểm tra ngày áp dụng phải là tương lai
            if (ngayApDung.isBefore(LocalDate.now()) || ngayApDung.isEqual(LocalDate.now())) {
                response.setStatusCode(400);
                response.setMessage("Chỉ có thể sửa giá cho ngày áp dụng trong tương lai");
                return response;
            }

            Optional<GiaHangPhong> giaHangPhongOpt = giaHangPhongRepository.findByIdHangPhongAndNgayApDung(idHangPhong,
                    ngayApDung);
            if (!giaHangPhongOpt.isPresent()) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy giá cho ngày này");
                return response;
            }

            GiaHangPhong giaHangPhong = giaHangPhongOpt.get();
            BigDecimal gia = new BigDecimal(request.get("gia").toString());
            String idNv = request.get("idNv").toString();

            giaHangPhong.setGia(gia);
            giaHangPhong.setNgayThietLap(LocalDate.now());
            giaHangPhong.setIdNv(idNv);

            giaHangPhongRepository.save(giaHangPhong);

            response.setStatusCode(200);
            response.setMessage("Cập nhật giá thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật giá: " + e.getMessage());
            e.printStackTrace(); // Log the full exception for debugging
        }
        return response;
    }

    public Response calculateRoomPriceForDateRange(Integer idHangPhong, LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            BigDecimal totalPrice = roomPricingService.calculateTotalPriceForDateRange(idHangPhong, checkIn, checkOut);
            BigDecimal averagePrice = roomPricingService.getAveragePricePerNight(idHangPhong, checkIn, checkOut);
            long numberOfNights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
            boolean hasPriceChanges = roomPricingService.hasPriceChanges(idHangPhong, checkIn, checkOut);

            // Get price segments for detailed breakdown
            List<RoomPricingService.PriceSegment> priceSegments = roomPricingService.getPriceSegments(idHangPhong,
                    checkIn, checkOut);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setRoomPrice(totalPrice);
            response.setMinDeposit(totalPrice.multiply(BigDecimal.valueOf(0.2))); // 20% deposit
            response.setPriceSegments(new ArrayList<>(priceSegments));

            // Add additional info
            Map<String, Object> priceDetails = new java.util.HashMap<>();
            priceDetails.put("totalPrice", totalPrice);
            priceDetails.put("numberOfNights", numberOfNights);
            priceDetails.put("averagePricePerNight", averagePrice);
            priceDetails.put("hasPriceChanges", hasPriceChanges);
            response.setStats(priceDetails);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tính giá: " + e.getMessage());
        }
        return response;
    }

    /**
     * Get all hang phong with current prices for homepage display
     */
    public Response getAllHangPhongWithPrices() {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findAllWithDetails();

            // Convert to HotHangPhongDTO format with current prices
            List<com.dev.Hotel.dto.HotHangPhongDTO> hotHangPhongList = new java.util.ArrayList<>();

            for (HangPhong hangPhong : hangPhongList) {
                com.dev.Hotel.dto.HotHangPhongDTO dto = new com.dev.Hotel.dto.HotHangPhongDTO();
                dto.setIdHangPhong(hangPhong.getIdHangPhong());
                dto.setMoTa(hangPhong.getKieuPhong().getTenKp() + " - " + hangPhong.getLoaiPhong().getTenLp());
                dto.setTenKp(hangPhong.getKieuPhong().getTenKp());
                dto.setTenLp(hangPhong.getLoaiPhong().getTenLp());
                dto.setSoLuotThue(0L); // Default value since we don't have booking count here

                // Get current price using pricing service
                BigDecimal currentPrice = roomPricingService.getCurrentPrice(hangPhong.getIdHangPhong());
                dto.setGiaHienTai(currentPrice);

                hotHangPhongList.add(dto);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHotHangPhongList(hotHangPhongList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách hạng phòng với giá: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public Response getHotHangPhongThisMonth() {
        Response response = new Response();
        try {
            // Gọi stored procedure để lấy tất cả hạng phòng hot trong tháng
            List<Object[]> results = hangPhongRepository.getHotHangPhongThisMonth();

            // Convert Object[] thành HotHangPhongDTO
            List<com.dev.Hotel.dto.HotHangPhongDTO> hotHangPhongList = new java.util.ArrayList<>();

            for (Object[] row : results) {
                com.dev.Hotel.dto.HotHangPhongDTO dto = new com.dev.Hotel.dto.HotHangPhongDTO();
                dto.setIdHangPhong((Integer) row[0]);
                dto.setMoTa((String) row[1]);
                dto.setTenKp((String) row[2]);
                dto.setTenLp((String) row[3]);
                dto.setSoLuotThue(((Number) row[4]).longValue());
                dto.setGiaHienTai((BigDecimal) row[5]);

                // Lấy hình ảnh đại diện và tiện nghi cho hạng phòng
                Optional<HangPhong> hangPhongOpt = hangPhongRepository.findByIdWithImages(dto.getIdHangPhong());
                if (hangPhongOpt.isPresent()) {
                    HangPhong hangPhong = hangPhongOpt.get();

                    // Lấy hình ảnh đại diện
                    if (hangPhong.getDanhSachAnhHangPhong() != null && !hangPhong.getDanhSachAnhHangPhong().isEmpty()) {
                        String urlAnhDaiDien = hangPhong.getDanhSachAnhHangPhong().get(0).getUrlAnh();
                        dto.setUrlAnhDaiDien(urlAnhDaiDien);
                    }

                    // Lấy mô tả kiểu phòng
                    if (hangPhong.getKieuPhong() != null && hangPhong.getKieuPhong().getMoTa() != null) {
                        dto.setMoTaKieuPhong(hangPhong.getKieuPhong().getMoTa());
                    }

                    // Lấy tiện nghi
                    try {
                        List<TienNghi> tienNghiList = tienNghiRepository.findByHangPhong(hangPhong);
                        if (!tienNghiList.isEmpty()) {
                            List<TienNghiDTO> tienNghiDTOList = new ArrayList<>();
                            for (TienNghi tn : tienNghiList) {
                                TienNghiDTO tnDTO = new TienNghiDTO();
                                tnDTO.setIdTn(tn.getIdTn());
                                tnDTO.setTenTn(tn.getTenTn());
                                tnDTO.setIcon(tn.getIcon());
                                tienNghiDTOList.add(tnDTO);
                            }
                            dto.setDanhSachTienNghi(tienNghiDTOList);
                        }
                    } catch (Exception e) {
                        System.out
                                .println("Skipping amenities for room " + dto.getIdHangPhong() + ": " + e.getMessage());
                        // Continue without amenities
                    }
                }

                hotHangPhongList.add(dto);
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHotHangPhongList(hotHangPhongList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng hot: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
}
