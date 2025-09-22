package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.entity.BoPhan;
import com.dev.Hotel.entity.NhomQuyen;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.BoPhanRepository;
import com.dev.Hotel.repo.NhomQuyenRepository;
import com.dev.Hotel.service.EmailService;
import com.dev.Hotel.service.interfac.INhanVienService;
import com.dev.Hotel.utils.EntityDTOMapper;
import com.dev.Hotel.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@Service
public class NhanVienService implements INhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private BoPhanRepository boPhanRepository;

    @Autowired
    private NhomQuyenRepository nhomQuyenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();
        try {
            // Try to authenticate with username or email
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            var nhanVien = nhanVienRepository
                    .findByEmailOrUsername(loginRequest.getEmail(), loginRequest.getEmail())
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            var token = jwtUtils.generateToken(nhanVien);
            response.setStatusCode(200);
            response.setToken(token);

            // Determine role based on department
            String role = determineUserRole(nhanVien);
            response.setRole(role);
            response.setExpirationTime("7 Days");
            response.setMessage("Đăng nhập thành công");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi trong quá trình đăng nhập: " + e.getMessage());
            e.printStackTrace(); // Log the full exception for debugging
        }
        return response;
    }

    /**
     * Determine user role based on department
     */
    private String determineUserRole(NhanVien nhanVien) {
        try {
            // Get department name directly from database to avoid lazy loading issues
            String tenBoPhan = nhanVienRepository.findDepartmentNameByNhanVienId(nhanVien.getIdNv());

            if (tenBoPhan == null || tenBoPhan.trim().isEmpty()) {
                return "EMPLOYEE"; // Default role
            }

            // Check for admin/management roles
            String tenBoPhanLower = tenBoPhan.toLowerCase();
            if (tenBoPhanLower.contains("quản lý") ||
                    tenBoPhanLower.contains("admin") ||
                    tenBoPhanLower.contains("giám đốc")) {
                return "ADMIN";
            }

            // All other departments are employees
            return "EMPLOYEE";
        } catch (Exception e) {
            // If there's any issue, default to EMPLOYEE
            System.err.println("Error determining user role: " + e.getMessage());
            return "EMPLOYEE";
        }
    }

    private String generateNextEmployeeId() {
        // Lấy ID nhân viên lớn nhất hiện tại
        String maxId = nhanVienRepository.findMaxEmployeeId();

        if (maxId == null || maxId.isEmpty()) {
            return "NV01"; // ID đầu tiên
        }

        // Lấy số từ ID (bỏ prefix "NV")
        String numberPart = maxId.substring(2);
        int nextNumber = Integer.parseInt(numberPart) + 1;

        // Format với 2 chữ số, có leading zero
        return String.format("NV%02d", nextNumber);
    }

    @Override
    public Response register(NhanVien nhanVien) {
        Response response = new Response();
        try {
            if (nhanVien.getEmail() != null && nhanVienRepository.existsByEmail(nhanVien.getEmail())) {
                throw new OurException("Email đã tồn tại: " + nhanVien.getEmail());
            }
            if (nhanVien.getUsername() != null && nhanVienRepository.existsByUsername(nhanVien.getUsername())) {
                throw new OurException("Username đã tồn tại: " + nhanVien.getUsername());
            }

            // Tự động generate ID nhân viên
            String newEmployeeId = generateNextEmployeeId();
            nhanVien.setIdNv(newEmployeeId);

            // Set BoPhan and NhomQuyen objects if IDs are provided
            // Note: Frontend sends idBp and idNq as separate fields, need to create objects
            if (nhanVien.getBoPhan() != null && nhanVien.getBoPhan().getIdBp() != null) {
                BoPhan boPhan = boPhanRepository.findById(nhanVien.getBoPhan().getIdBp()).orElse(null);
                nhanVien.setBoPhan(boPhan);
            }

            if (nhanVien.getNhomQuyen() != null && nhanVien.getNhomQuyen().getIdNq() != null) {
                NhomQuyen nhomQuyen = nhomQuyenRepository.findById(nhanVien.getNhomQuyen().getIdNq()).orElse(null);
                nhanVien.setNhomQuyen(nhomQuyen);
            }

            nhanVien.setPassword(passwordEncoder.encode(nhanVien.getPassword()));
            NhanVien savedNhanVien = nhanVienRepository.save(nhanVien);

            response.setStatusCode(200);
            response.setMessage("Đăng ký nhân viên thành công với ID: " + newEmployeeId);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi trong quá trình đăng ký: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response registerFromMap(Map<String, Object> requestData) {
        Response response = new Response();
        try {
            // Create NhanVien object from Map
            NhanVien nhanVien = new NhanVien();

            // Set basic fields
            nhanVien.setHo((String) requestData.get("ho"));
            nhanVien.setTen((String) requestData.get("ten"));
            nhanVien.setEmail((String) requestData.get("email"));
            nhanVien.setSdt((String) requestData.get("sdt"));
            nhanVien.setDiaChi((String) requestData.get("diaChi"));
            nhanVien.setPhai((String) requestData.get("phai"));
            nhanVien.setUsername((String) requestData.get("username"));
            nhanVien.setPassword((String) requestData.get("password"));

            // Parse ngaySinh if provided
            String ngaySinhStr = (String) requestData.get("ngaySinh");
            if (ngaySinhStr != null && !ngaySinhStr.isEmpty()) {
                nhanVien.setNgaySinh(LocalDate.parse(ngaySinhStr));
            }

            // Validate required fields
            if (nhanVien.getUsername() == null || nhanVien.getUsername().trim().isEmpty()) {
                throw new OurException("Username không được để trống");
            }
            if (nhanVien.getPassword() == null || nhanVien.getPassword().trim().isEmpty()) {
                throw new OurException("Password không được để trống");
            }
            if (nhanVien.getHo() == null || nhanVien.getHo().trim().isEmpty()) {
                throw new OurException("Họ không được để trống");
            }
            if (nhanVien.getTen() == null || nhanVien.getTen().trim().isEmpty()) {
                throw new OurException("Tên không được để trống");
            }

            // Check for existing email and username
            if (nhanVien.getEmail() != null && nhanVienRepository.existsByEmail(nhanVien.getEmail())) {
                throw new OurException("Email đã tồn tại: " + nhanVien.getEmail());
            }
            if (nhanVienRepository.existsByUsername(nhanVien.getUsername())) {
                throw new OurException("Username đã tồn tại: " + nhanVien.getUsername());
            }

            // Auto-generate ID
            String newEmployeeId = generateNextEmployeeId();
            nhanVien.setIdNv(newEmployeeId);

            // Set BoPhan if provided
            String idBp = (String) requestData.get("idBp");
            if (idBp != null && !idBp.trim().isEmpty()) {
                BoPhan boPhan = boPhanRepository.findById(idBp).orElse(null);
                if (boPhan != null) {
                    nhanVien.setBoPhan(boPhan);
                } else {
                    throw new OurException("Không tìm thấy bộ phận với ID: " + idBp);
                }
            }

            // Set NhomQuyen if provided
            String idNq = (String) requestData.get("idNq");
            if (idNq != null && !idNq.trim().isEmpty()) {
                NhomQuyen nhomQuyen = nhomQuyenRepository.findById(idNq).orElse(null);
                if (nhomQuyen != null) {
                    nhanVien.setNhomQuyen(nhomQuyen);
                } else {
                    throw new OurException("Không tìm thấy nhóm quyền với ID: " + idNq);
                }
            }

            // Encode password and save
            nhanVien.setPassword(passwordEncoder.encode(nhanVien.getPassword()));
            nhanVienRepository.save(nhanVien);

            response.setStatusCode(200);
            response.setMessage("Đăng ký nhân viên thành công với ID: " + newEmployeeId);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi trong quá trình đăng ký: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllNhanVien() {
        Response response = new Response();
        try {
            List<NhanVien> nhanVienList = nhanVienRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVienList(EntityDTOMapper.mapNhanVienListToDTO(nhanVienList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getNhanVienById(String idNv) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getNhanVienByEmail(String email) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findByEmail(email)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getNhanVienByUsername(String username) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findByUsername(username)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(nhanVien));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateNhanVien(String idNv, NhanVien nhanVien) {
        Response response = new Response();
        try {
            NhanVien existingNhanVien = nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            // Update fields (excluding password and sensitive data)
            existingNhanVien.setHo(nhanVien.getHo());
            existingNhanVien.setTen(nhanVien.getTen());
            existingNhanVien.setPhai(nhanVien.getPhai());
            existingNhanVien.setNgaySinh(nhanVien.getNgaySinh());
            existingNhanVien.setDiaChi(nhanVien.getDiaChi());
            existingNhanVien.setSdt(nhanVien.getSdt());
            existingNhanVien.setEmail(nhanVien.getEmail());
            existingNhanVien.setHinh(nhanVien.getHinh());
            existingNhanVien.setBoPhan(nhanVien.getBoPhan());

            NhanVien updatedNhanVien = nhanVienRepository.save(existingNhanVien);

            response.setStatusCode(200);
            response.setMessage("Cập nhật nhân viên thành công");
            response.setNhanVien(EntityDTOMapper.mapNhanVienToDTO(updatedNhanVien));

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteNhanVien(String idNv) {
        Response response = new Response();
        try {
            nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            nhanVienRepository.deleteById(idNv);
            response.setStatusCode(200);
            response.setMessage("Xóa nhân viên thành công");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response changePassword(String idNv, String oldPassword, String newPassword) {
        Response response = new Response();
        try {
            NhanVien nhanVien = nhanVienRepository.findById(idNv)
                    .orElseThrow(() -> new OurException("Nhân viên không tồn tại"));

            if (!passwordEncoder.matches(oldPassword, nhanVien.getPassword())) {
                throw new OurException("Mật khẩu cũ không đúng");
            }

            nhanVien.setPassword(passwordEncoder.encode(newPassword));
            nhanVienRepository.save(nhanVien);

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
    public Response updateProfile(String idNv, NhanVien nhanVien) {
        return updateNhanVien(idNv, nhanVien);
    }

    @Override
    public Response getMyInfo(String email) {
        return getNhanVienByEmail(email);
    }

    @Override
    public Response getNhanVienByBoPhan(String idBp) {
        Response response = new Response();
        try {
            // This would require a custom query in repository
            response.setStatusCode(200);
            response.setMessage("Chức năng đang được phát triển");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response activateNhanVien(String idNv) {
        Response response = new Response();
        try {
            // Implementation for activating employee
            response.setStatusCode(200);
            response.setMessage("Kích hoạt nhân viên thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi kích hoạt nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deactivateNhanVien(String idNv) {
        Response response = new Response();
        try {
            // Implementation for deactivating employee
            response.setStatusCode(200);
            response.setMessage("Vô hiệu hóa nhân viên thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi vô hiệu hóa nhân viên: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response forgotPassword(String email) {
        Response response = new Response();
        try {
            // Tìm nhân viên theo email
            NhanVien nhanVien = nhanVienRepository.findByEmail(email).orElse(null);
            if (nhanVien == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy tài khoản với email này");
                return response;
            }

            // Tạo JWT token cho reset password (hết hạn sau 1 giờ)
            String resetToken = jwtUtils.generatePasswordResetToken(email);

            // Gửi email với link reset password
            emailService.sendPasswordResetEmail(email, resetToken);

            response.setStatusCode(200);
            response.setMessage("Link đặt lại mật khẩu đã được gửi đến email của bạn");
            response.setToken(resetToken); // Tạm thời trả về token để test

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xử lý yêu cầu đặt lại mật khẩu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response resetPassword(String token, String newPassword) {
        Response response = new Response();
        try {
            // Extract email từ JWT token
            String email;
            try {
                email = jwtUtils.extractUsername(token);
            } catch (Exception e) {
                response.setStatusCode(400);
                response.setMessage("Token không hợp lệ");
                return response;
            }

            // Validate token
            if (!jwtUtils.isPasswordResetTokenValid(token, email)) {
                response.setStatusCode(400);
                response.setMessage("Token không hợp lệ hoặc đã hết hạn");
                return response;
            }

            // Tìm nhân viên
            NhanVien nhanVien = nhanVienRepository.findByEmail(email).orElse(null);
            if (nhanVien == null) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy tài khoản");
                return response;
            }

            // Cập nhật mật khẩu
            nhanVien.setPassword(passwordEncoder.encode(newPassword));
            nhanVienRepository.save(nhanVien);

            response.setStatusCode(200);
            response.setMessage("Đặt lại mật khẩu thành công");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi đặt lại mật khẩu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public String extractEmailFromToken(String token) {
        return jwtUtils.extractUsername(token);
    }
}
