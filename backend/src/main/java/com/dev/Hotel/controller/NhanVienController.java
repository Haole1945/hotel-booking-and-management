package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.service.interfac.INhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "*")
public class NhanVienController {

    @Autowired
    private INhanVienService nhanVienService;

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> register(@RequestBody Map<String, Object> requestData) {
        Response response = nhanVienService.registerFromMap(requestData);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllNhanVien() {
        Response response = nhanVienService.getAllNhanVien();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getNhanVienById(@PathVariable("idNv") String idNv) {
        Response response = nhanVienService.getNhanVienById(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-email/{email}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getNhanVienByEmail(@PathVariable("email") String email) {
        Response response = nhanVienService.getNhanVienByEmail(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-username/{username}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getNhanVienByUsername(@PathVariable("username") String username) {
        Response response = nhanVienService.getNhanVienByUsername(username);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> updateNhanVien(@PathVariable("idNv") String idNv, @RequestBody NhanVien nhanVien) {
        Response response = nhanVienService.updateNhanVien(idNv, nhanVien);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteNhanVien(@PathVariable("idNv") String idNv) {
        Response response = nhanVienService.deleteNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/change-password/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> changePassword(
            @PathVariable("idNv") String idNv,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) {
        Response response = nhanVienService.changePassword(idNv, oldPassword, newPassword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-profile/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> updateProfile(@PathVariable("idNv") String idNv, @RequestBody NhanVien nhanVien) {
        Response response = nhanVienService.updateProfile(idNv, nhanVien);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/my-info/{email}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getMyInfo(@PathVariable("email") String email) {
        Response response = nhanVienService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/by-bo-phan/{idBp}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getNhanVienByBoPhan(@PathVariable("idBp") String idBp) {
        Response response = nhanVienService.getNhanVienByBoPhan(idBp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/activate/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> activateNhanVien(@PathVariable("idNv") String idNv) {
        Response response = nhanVienService.activateNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/deactivate/{idNv}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deactivateNhanVien(@PathVariable("idNv") String idNv) {
        Response response = nhanVienService.deactivateNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
