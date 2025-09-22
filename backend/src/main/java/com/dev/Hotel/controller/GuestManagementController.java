package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.CtKhachO;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.repo.CTKhachORepository;
import com.dev.Hotel.repo.CtPhieuThueRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ct-khach-o")
@CrossOrigin(origins = "*")
public class GuestManagementController {

    @Autowired
    private CTKhachORepository ctKhachORepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    // Lấy danh sách khách trong một chi tiết phiếu thuê
    @GetMapping("/{idCtPt}")
    public ResponseEntity<Response> getRoomGuests(@PathVariable Integer idCtPt) {
        Response response = new Response();
        
        try {
            List<CtKhachO> ctKhachOList = ctKhachORepository.findByIdCtPtWithKhachHang(idCtPt);
            
            List<Map<String, Object>> guestList = new ArrayList<>();
            for (CtKhachO ct : ctKhachOList) {
                Map<String, Object> guest = new HashMap<>();
                guest.put("cccd", ct.getKhachHang().getCccd());
                guest.put("hoTen", ct.getKhachHang().getHo() + " " + ct.getKhachHang().getTen());
                guest.put("sdt", ct.getKhachHang().getSdt() != null ? ct.getKhachHang().getSdt() : "");
                guest.put("email", ct.getKhachHang().getEmail() != null ? ct.getKhachHang().getEmail() : "");
                guestList.add(guest);
            }
            
            response.setStatusCode(200);
            response.setMessage("Lấy danh sách khách thành công");
            response.setGuestList(guestList);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách: " + e.getMessage());
        }
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Thêm khách vào chi tiết phiếu thuê
    @PostMapping("/add")
    public ResponseEntity<Response> addGuestToRoom(@RequestBody Map<String, Object> request) {
        Response response = new Response();
        
        try {
            Integer idCtPt = (Integer) request.get("idCtPt");
            String cccd = (String) request.get("cccd");
            
            // Kiểm tra chi tiết phiếu thuê tồn tại
            CtPhieuThue ctPhieuThue = ctPhieuThueRepository.findById(idCtPt).orElse(null);
            if (ctPhieuThue == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy chi tiết phiếu thuê");
                return ResponseEntity.status(404).body(response);
            }
            
            // Kiểm tra khách hàng tồn tại - sử dụng method có sẵn
            List<KhachHang> khachHangList = khachHangRepository.findAll();
            KhachHang khachHang = null;
            for (KhachHang kh : khachHangList) {
                if (kh.getCccd().equals(cccd)) {
                    khachHang = kh;
                    break;
                }
            }
            
            if (khachHang == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với CCCD: " + cccd);
                return ResponseEntity.status(404).body(response);
            }
            
            // Kiểm tra khách đã có trong chi tiết phiếu thuê chưa
            boolean exists = ctKhachORepository.existsByIdCtPtAndCccd(idCtPt, cccd);
            if (exists) {
                response.setStatusCode(400);
                response.setMessage("Khách hàng đã có trong phòng này");
                return ResponseEntity.status(400).body(response);
            }

            // Kiểm tra khách hàng có đang ở phòng khác (chưa check-out) hay không
            List<CtKhachO> activeStays = ctKhachORepository.findActiveStaysByCccdExcludingRoom(cccd, idCtPt);
            if (!activeStays.isEmpty()) {
                // Lấy thông tin chi tiết về phòng khách đang ở
                List<CtKhachO> activeStaysWithDetails = ctKhachORepository.findActiveStaysWithDetailsByCccd(cccd);
                if (!activeStaysWithDetails.isEmpty()) {
                    CtKhachO activeStay = activeStaysWithDetails.get(0);
                    String currentRoom = activeStay.getCtPhieuThue().getPhong().getSoPhong();
                    response.setStatusCode(400);
                    response.setMessage("Khách hàng đang ở phòng " + currentRoom + " và chưa check-out."); 
                    return ResponseEntity.status(400).body(response);
                }
            }
            
            // Thêm khách vào chi tiết phiếu thuê
            CtKhachO ctKhachO = new CtKhachO();
            ctKhachO.setIdCtPt(idCtPt);
            ctKhachO.setCccd(cccd);
            ctKhachO.setCtPhieuThue(ctPhieuThue);
            ctKhachO.setKhachHang(khachHang);
            
            ctKhachORepository.save(ctKhachO);
            
            response.setStatusCode(200);
            response.setMessage("Thêm khách vào phòng thành công");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm khách vào phòng: " + e.getMessage());
        }
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Xóa khách khỏi chi tiết phiếu thuê
    @DeleteMapping("/remove/{idCtPt}/{cccd}")
    public ResponseEntity<Response> removeGuestFromRoom(
            @PathVariable Integer idCtPt,
            @PathVariable String cccd) {
        Response response = new Response();
        
        try {
            CtKhachO.CtKhachOId id = new CtKhachO.CtKhachOId(idCtPt, cccd);
            
            if (!ctKhachORepository.existsById(id)) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách trong phòng này");
                return ResponseEntity.status(404).body(response);
            }
            
            ctKhachORepository.deleteById(id);
            
            response.setStatusCode(200);
            response.setMessage("Xóa khách khỏi phòng thành công");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa khách khỏi phòng: " + e.getMessage());
        }
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Kiểm tra trạng thái khách hàng (có đang ở phòng khác hay không)
    @GetMapping("/check-customer-status/{cccd}")
    public ResponseEntity<Response> checkCustomerStatus(@PathVariable String cccd) {
        Response response = new Response();

        try {
            // Kiểm tra khách hàng có đang ở phòng nào không
            List<CtKhachO> activeStays = ctKhachORepository.findActiveStaysWithDetailsByCccd(cccd);

            Map<String, Object> statusData = new HashMap<>();

            if (activeStays.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Khách hàng hiện không ở phòng nào");
                statusData.put("isCurrentlyStaying", false);
                statusData.put("canAddToRoom", true);
            } else {
                // Khách hàng đang ở phòng
                CtKhachO activeStay = activeStays.get(0);
                String currentRoom = activeStay.getCtPhieuThue().getPhong().getSoPhong();
                LocalDate checkInDate = activeStay.getCtPhieuThue().getNgayDen();
                LocalDate expectedCheckOutDate = activeStay.getCtPhieuThue().getNgayDi();

                response.setStatusCode(200);
                response.setMessage("Khách hàng đang ở phòng " + currentRoom);
                statusData.put("isCurrentlyStaying", true);
                statusData.put("canAddToRoom", false);
                statusData.put("currentRoom", currentRoom);
                statusData.put("checkInDate", checkInDate.toString());
                statusData.put("expectedCheckOutDate", expectedCheckOutDate.toString());
                statusData.put("customerName", activeStay.getKhachHang().getHo() + " " + activeStay.getKhachHang().getTen());
            }

            // Tạo một list chứa statusData để phù hợp với cấu trúc Response
            List<Map<String, Object>> dataList = new ArrayList<>();
            dataList.add(statusData);
            response.setGuestList(dataList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra trạng thái khách hàng: " + e.getMessage());
        }

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Kiểm tra khách hàng có thể thêm vào phòng cụ thể hay không
    @GetMapping("/can-add-to-room/{cccd}/{idCtPt}")
    public ResponseEntity<Response> canAddCustomerToRoom(
            @PathVariable String cccd,
            @PathVariable Integer idCtPt) {
        Response response = new Response();

        try {
            Map<String, Object> validationData = new HashMap<>();

            // Kiểm tra khách đã có trong phòng này chưa
            boolean existsInRoom = ctKhachORepository.existsByIdCtPtAndCccd(idCtPt, cccd);
            if (existsInRoom) {
                response.setStatusCode(400);
                response.setMessage("Khách hàng đã có trong phòng này");
                validationData.put("canAdd", false);
                validationData.put("reason", "ALREADY_IN_ROOM");
                List<Map<String, Object>> dataList = new ArrayList<>();
                dataList.add(validationData);
                response.setGuestList(dataList);
                return ResponseEntity.status(400).body(response);
            }

            // Kiểm tra khách hàng có đang ở phòng khác hay không
            List<CtKhachO> activeStays = ctKhachORepository.findActiveStaysByCccdExcludingRoom(cccd, idCtPt);
            if (!activeStays.isEmpty()) {
                List<CtKhachO> activeStaysWithDetails = ctKhachORepository.findActiveStaysWithDetailsByCccd(cccd);
                if (!activeStaysWithDetails.isEmpty()) {
                    CtKhachO activeStay = activeStaysWithDetails.get(0);
                    String currentRoom = activeStay.getCtPhieuThue().getPhong().getSoPhong();

                    response.setStatusCode(400);
                    response.setMessage("Khách hàng đang ở phòng " + currentRoom + " và chưa check-out");
                    validationData.put("canAdd", false);
                    validationData.put("reason", "CURRENTLY_STAYING_OTHER_ROOM");
                    validationData.put("currentRoom", currentRoom);
                    List<Map<String, Object>> dataList = new ArrayList<>();
                    dataList.add(validationData);
                    response.setGuestList(dataList);
                    return ResponseEntity.status(400).body(response);
                }
            }

            // Có thể thêm khách vào phòng
            response.setStatusCode(200);
            response.setMessage("Có thể thêm khách hàng vào phòng");
            validationData.put("canAdd", true);
            List<Map<String, Object>> dataList = new ArrayList<>();
            dataList.add(validationData);
            response.setGuestList(dataList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kiểm tra: " + e.getMessage());
        }

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
