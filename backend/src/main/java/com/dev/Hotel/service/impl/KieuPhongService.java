package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KieuPhong;
import com.dev.Hotel.repo.KieuPhongRepository;
import com.dev.Hotel.service.interfac.IKieuPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KieuPhongService implements IKieuPhongService {

    @Autowired
    private KieuPhongRepository kieuPhongRepository;

    @Override
    public Response getAllKieuPhong() {
        Response response = new Response();
        try {
            List<KieuPhong> kieuPhongList = kieuPhongRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setKieuPhongList(EntityDTOMapper.mapKieuPhongListToDTO(kieuPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getKieuPhongById(String id) {
        Response response = new Response();
        try {
            KieuPhong kieuPhong = kieuPhongRepository.findById(id).orElse(null);
            if (kieuPhong != null) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setKieuPhong(EntityDTOMapper.mapKieuPhongToDTO(kieuPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy kiểu phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createKieuPhong(KieuPhong kieuPhong) {
        Response response = new Response();
        try {
            KieuPhong savedKieuPhong = kieuPhongRepository.save(kieuPhong);
            response.setStatusCode(200);
            response.setMessage("Tạo kiểu phòng thành công");
            response.setKieuPhong(EntityDTOMapper.mapKieuPhongToDTO(savedKieuPhong));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateKieuPhong(String id, KieuPhong kieuPhong) {
        Response response = new Response();
        try {
            KieuPhong existingKieuPhong = kieuPhongRepository.findById(id).orElse(null);
            if (existingKieuPhong != null) {
                existingKieuPhong.setTenKp(kieuPhong.getTenKp());
                existingKieuPhong.setMoTa(kieuPhong.getMoTa());
                KieuPhong updatedKieuPhong = kieuPhongRepository.save(existingKieuPhong);
                response.setStatusCode(200);
                response.setMessage("Cập nhật kiểu phòng thành công");
                response.setKieuPhong(EntityDTOMapper.mapKieuPhongToDTO(updatedKieuPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy kiểu phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteKieuPhong(String id) {
        Response response = new Response();
        try {
            if (kieuPhongRepository.existsById(id)) {
                kieuPhongRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("Xóa kiểu phòng thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy kiểu phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa kiểu phòng: " + e.getMessage());
        }
        return response;
    }
}
