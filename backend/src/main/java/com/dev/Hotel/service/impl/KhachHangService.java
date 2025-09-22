package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.repo.PhieuDatRepository;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.service.interfac.IKhachHangService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService implements IKhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private PhieuDatRepository phieuDatRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response getAllKhachHang() {
        Response response = new Response();
        try {
            List<KhachHang> khachHangList = khachHangRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setKhachHangList(EntityDTOMapper.mapKhachHangListToDTO(khachHangList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKhachHangById(String cccd) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findById(cccd);
            if (khachHangOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(khachHangOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với CCCD: " + cccd);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKhachHangByEmail(String email) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findByEmail(email);
            if (khachHangOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(khachHangOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với email: " + email);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKhachHangBySdt(String sdt) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findBySdt(sdt);
            if (khachHangOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(khachHangOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với số điện thoại: " + sdt);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createKhachHang(KhachHang khachHang) {
        Response response = new Response();
        try {
            // Validate khách hàng
            Response validationResponse = validateKhachHang(khachHang);
            if (validationResponse.getStatusCode() != 200) {
                return validationResponse;
            }

            // Check if CCCD already exists
            if (khachHangRepository.existsById(khachHang.getCccd())) {
                throw new OurException("CCCD đã tồn tại: " + khachHang.getCccd());
            }

            // Check if email already exists
            if (khachHang.getEmail() != null && khachHangRepository.existsByEmail(khachHang.getEmail())) {
                throw new OurException("Email đã được sử dụng: " + khachHang.getEmail());
            }

            // Check if phone number already exists
            if (khachHang.getSdt() != null && khachHangRepository.existsBySdt(khachHang.getSdt())) {
                throw new OurException("Số điện thoại đã được sử dụng: " + khachHang.getSdt());
            }

            KhachHang savedKhachHang = khachHangRepository.save(khachHang);
            response.setStatusCode(200);
            response.setMessage("Tạo khách hàng thành công");
            response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(savedKhachHang));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateKhachHang(String cccd, KhachHang khachHang) {
        Response response = new Response();
        try {
            Optional<KhachHang> existingKhachHangOptional = khachHangRepository.findById(cccd);
            if (existingKhachHangOptional.isPresent()) {
                KhachHang existingKhachHang = existingKhachHangOptional.get();

                // Update fields
                if (khachHang.getHo() != null)
                    existingKhachHang.setHo(khachHang.getHo());
                if (khachHang.getTen() != null)
                    existingKhachHang.setTen(khachHang.getTen());
                if (khachHang.getSdt() != null)
                    existingKhachHang.setSdt(khachHang.getSdt());
                if (khachHang.getEmail() != null)
                    existingKhachHang.setEmail(khachHang.getEmail());
                if (khachHang.getDiaChi() != null)
                    existingKhachHang.setDiaChi(khachHang.getDiaChi());
                if (khachHang.getMaSoThue() != null)
                    existingKhachHang.setMaSoThue(khachHang.getMaSoThue());

                KhachHang updatedKhachHang = khachHangRepository.save(existingKhachHang);
                response.setStatusCode(200);
                response.setMessage("Cập nhật khách hàng thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(updatedKhachHang));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với CCCD: " + cccd);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteKhachHang(String cccd) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findById(cccd);
            if (khachHangOptional.isPresent()) {
                khachHangRepository.deleteById(cccd);
                response.setStatusCode(200);
                response.setMessage("Xóa khách hàng thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với CCCD: " + cccd);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKhachHangBookingHistory(String cccd) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findById(cccd);
            if (khachHangOptional.isPresent()) {
                KhachHang khachHang = khachHangOptional.get();

                // Get booking history
                List<PhieuDat> phieuDatList = phieuDatRepository.findByKhachHangCccd(cccd);
                List<PhieuThue> phieuThueList = phieuThueRepository.findByKhachHangCccd(cccd);

                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(khachHang));
                response.setPhieuDatList(EntityDTOMapper.mapPhieuDatListToDTO(phieuDatList));
                response.setPhieuThueList(EntityDTOMapper.mapPhieuThueListToDTO(phieuThueList));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với CCCD: " + cccd);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchKhachHang(String keyword) {
        Response response = new Response();
        try {
            // Use repository search method for better performance
            List<KhachHang> filteredKhachHang = khachHangRepository.searchByKeyword(keyword);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setKhachHangList(EntityDTOMapper.mapKhachHangListToDTO(filteredKhachHang));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKhachHangByEmailOrSdt(String emailOrSdt) {
        Response response = new Response();
        try {
            Optional<KhachHang> khachHangOptional = khachHangRepository.findByEmailOrSdt(emailOrSdt, emailOrSdt);
            if (khachHangOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKhachHang(EntityDTOMapper.mapKhachHangToDTO(khachHangOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy khách hàng với email hoặc số điện thoại: " + emailOrSdt);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response validateKhachHang(KhachHang khachHang) {
        Response response = new Response();
        try {
            if (khachHang.getCccd() == null || khachHang.getCccd().trim().isEmpty()) {
                throw new OurException("CCCD không được để trống");
            }
            if (khachHang.getHo() == null || khachHang.getHo().trim().isEmpty()) {
                throw new OurException("Họ không được để trống");
            }
            if (khachHang.getTen() == null || khachHang.getTen().trim().isEmpty()) {
                throw new OurException("Tên không được để trống");
            }

            response.setStatusCode(200);
            response.setMessage("Validation thành công");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    public boolean existsByEmail(String email) {
        return khachHangRepository.existsByEmail(email);
    }

    @Override
    public boolean existsBySdt(String sdt) {
        return khachHangRepository.existsBySdt(sdt);
    }

    @Override
    public Response changePassword(String cccd, String oldPassword, String newPassword) {
        Response response = new Response();
        try {
            KhachHang khachHang = khachHangRepository.findById(cccd)
                    .orElseThrow(() -> new OurException("Khách hàng không tồn tại"));

            if (!passwordEncoder.matches(oldPassword, khachHang.getMatKhau())) {
                throw new OurException("Mật khẩu cũ không đúng");
            }

            if (oldPassword.equals(newPassword)) {
                throw new OurException("Mật khẩu mới không được trùng với mật khẩu cũ");
            }

            khachHang.setMatKhau(passwordEncoder.encode(newPassword));
            khachHangRepository.save(khachHang);

            response.setStatusCode(200);
            response.setMessage("Đổi mật khẩu thành công");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi đổi mật khẩu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateProfile(String cccd, KhachHang khachHang) {
        Response response = new Response();
        try {
            KhachHang existingKhachHang = khachHangRepository.findById(cccd)
                    .orElseThrow(() -> new OurException("Khách hàng không tồn tại"));

            // Update only allowed fields (not password or CCCD)
            if (khachHang.getHo() != null) {
                existingKhachHang.setHo(khachHang.getHo());
            }
            if (khachHang.getTen() != null) {
                existingKhachHang.setTen(khachHang.getTen());
            }
            if (khachHang.getEmail() != null) {
                existingKhachHang.setEmail(khachHang.getEmail());
            }
            if (khachHang.getSdt() != null) {
                existingKhachHang.setSdt(khachHang.getSdt());
            }
            if (khachHang.getDiaChi() != null) {
                existingKhachHang.setDiaChi(khachHang.getDiaChi());
            }
            if (khachHang.getMaSoThue() != null) {
                existingKhachHang.setMaSoThue(khachHang.getMaSoThue());
            }

            KhachHang updatedKhachHang = khachHangRepository.save(existingKhachHang);

            response.setStatusCode(200);
            response.setMessage("Cập nhật thông tin thành công");
            response.setKhachHang(EntityDTOMapper.mapKhachHangListToDTO(List.of(updatedKhachHang)).get(0));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật thông tin: " + e.getMessage());
        }
        return response;
    }
}
