package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.LoaiPhong;
import com.dev.Hotel.repo.LoaiPhongRepository;
import com.dev.Hotel.service.interfac.ILoaiPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiPhongService implements ILoaiPhongService {

    @Autowired
    private LoaiPhongRepository loaiPhongRepository;

    @Override
    public Response getAllLoaiPhong() {
        Response response = new Response();
        try {
            List<LoaiPhong> loaiPhongList = loaiPhongRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setLoaiPhongList(EntityDTOMapper.mapLoaiPhongListToDTO(loaiPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getLoaiPhongById(String id) {
        Response response = new Response();
        try {
            LoaiPhong loaiPhong = loaiPhongRepository.findById(id).orElse(null);
            if (loaiPhong != null) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setLoaiPhong(EntityDTOMapper.mapLoaiPhongToDTO(loaiPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy loại phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createLoaiPhong(LoaiPhong loaiPhong) {
        Response response = new Response();
        try {
            LoaiPhong savedLoaiPhong = loaiPhongRepository.save(loaiPhong);
            response.setStatusCode(200);
            response.setMessage("Tạo loại phòng thành công");
            response.setLoaiPhong(EntityDTOMapper.mapLoaiPhongToDTO(savedLoaiPhong));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateLoaiPhong(String id, LoaiPhong loaiPhong) {
        Response response = new Response();
        try {
            LoaiPhong existingLoaiPhong = loaiPhongRepository.findById(id).orElse(null);
            if (existingLoaiPhong != null) {
                existingLoaiPhong.setTenLp(loaiPhong.getTenLp());
                existingLoaiPhong.setMoTa(loaiPhong.getMoTa());
                LoaiPhong updatedLoaiPhong = loaiPhongRepository.save(existingLoaiPhong);
                response.setStatusCode(200);
                response.setMessage("Cập nhật loại phòng thành công");
                response.setLoaiPhong(EntityDTOMapper.mapLoaiPhongToDTO(updatedLoaiPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy loại phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteLoaiPhong(String id) {
        Response response = new Response();
        try {
            if (loaiPhongRepository.existsById(id)) {
                loaiPhongRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("Xóa loại phòng thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy loại phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa loại phòng: " + e.getMessage());
        }
        return response;
    }
}
