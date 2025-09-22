package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhuThu;
import com.dev.Hotel.entity.GiaPhuThu;
import com.dev.Hotel.entity.GiaPhuThuId;
import com.dev.Hotel.repo.PhuThuRepository;
import com.dev.Hotel.repo.GiaPhuThuRepository;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PhuThuService {

    @Autowired
    private PhuThuRepository phuThuRepository;

    @Autowired
    private GiaPhuThuRepository giaPhuThuRepository;

    public Response getAllPhuThu() {
        Response response = new Response();
        try {
            List<PhuThu> phuThuList = phuThuRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhuThuList(EntityDTOMapper.mapPhuThuListToDTO(phuThuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response getPhuThuById(String idPhuThu) {
        Response response = new Response();
        try {
            Optional<PhuThu> phuThu = phuThuRepository.findById(idPhuThu);
            if (phuThu.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(phuThu.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response createPhuThu(PhuThu phuThu) {
        Response response = new Response();
        try {
            // Check if ID already exists
            if (phuThuRepository.existsById(phuThu.getIdPhuThu())) {
                response.setStatusCode(400);
                response.setMessage("Mã phụ thu đã tồn tại");
                return response;
            }

            PhuThu savedPhuThu = phuThuRepository.save(phuThu);
            response.setStatusCode(201);
            response.setMessage("Tạo phụ thu thành công");
            response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(savedPhuThu));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response updatePhuThu(String idPhuThu, PhuThu phuThu) {
        Response response = new Response();
        try {
            Optional<PhuThu> existingPhuThu = phuThuRepository.findById(idPhuThu);
            if (existingPhuThu.isPresent()) {
                phuThu.setIdPhuThu(idPhuThu);
                PhuThu updatedPhuThu = phuThuRepository.save(phuThu);
                response.setStatusCode(200);
                response.setMessage("Cập nhật phụ thu thành công");
                response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(updatedPhuThu));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response deletePhuThu(String idPhuThu) {
        Response response = new Response();
        try {
            if (phuThuRepository.existsById(idPhuThu)) {
                phuThuRepository.deleteById(idPhuThu);
                response.setStatusCode(200);
                response.setMessage("Xóa phụ thu thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response addPhuThuPrice(String idPhuThu, LocalDate ngayApDung, BigDecimal gia, String idNv) {
        Response response = new Response();
        try {
            // Check if surcharge exists
            if (!phuThuRepository.existsById(idPhuThu)) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy phụ thu");
                return response;
            }

            GiaPhuThu giaPhuThu = new GiaPhuThu();
            GiaPhuThuId id = new GiaPhuThuId();
            id.setIdPhuThu(idPhuThu);
            id.setNgayApDung(ngayApDung);
            
            giaPhuThu.setId(id);
            giaPhuThu.setGia(gia);
            giaPhuThu.setIdNv(idNv);

            giaPhuThuRepository.save(giaPhuThu);
            response.setStatusCode(201);
            response.setMessage("Thêm giá phụ thu thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm giá phụ thu: " + e.getMessage());
        }
        return response;
    }

    public Response getPhuThuPrices(String idPhuThu) {
        Response response = new Response();
        try {
            List<GiaPhuThu> prices = giaPhuThuRepository.findByIdPhuThuOrderByNgayApDungDesc(idPhuThu);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setGiaPhuThuList(EntityDTOMapper.mapGiaPhuThuListToDTO(prices));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy lịch sử giá phụ thu: " + e.getMessage());
        }
        return response;
    }

    public BigDecimal getCurrentPrice(String idPhuThu) {
        Optional<GiaPhuThu> latestPrice = giaPhuThuRepository.findLatestPriceByPhuThu(idPhuThu, LocalDate.now());
        return latestPrice.map(GiaPhuThu::getGia).orElse(BigDecimal.ZERO);
    }
}
