package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.TienNghiRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.TienNghiDTO;
import com.dev.Hotel.entity.TienNghi;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.TienNghiRepository;
import com.dev.Hotel.service.interfac.ITienNghiService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TienNghiService implements ITienNghiService {

    @Autowired
    private TienNghiRepository tienNghiRepository;

    @Override
    public Response getAllTienNghi() {
        Response response = new Response();
        try {
            List<TienNghi> tienNghiList = tienNghiRepository.findAll();
            List<TienNghiDTO> tienNghiDTOList = EntityDTOMapper.mapTienNghiListToDTO(tienNghiList);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setTienNghiList(tienNghiDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách tiện ích: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getTienNghiById(String id) {
        Response response = new Response();
        try {
            TienNghi tienNghi = tienNghiRepository.findById(id)
                    .orElseThrow(() -> new OurException("Tiện ích không tồn tại"));

            TienNghiDTO tienNghiDTO = EntityDTOMapper.mapTienNghiToDTO(tienNghi);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setTienNghi(tienNghiDTO);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin tiện ích: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response addTienNghi(TienNghiRequest request) {
        Response response = new Response();
        try {
            // Auto-generate ID if not provided
            String newId = request.getIdTn();
            if (newId == null || newId.trim().isEmpty()) {
                newId = generateNextTienNghiId();
            } else {
                // Check if manually provided ID already exists
                if (tienNghiRepository.existsById(newId)) {
                    throw new OurException("ID tiện ích đã tồn tại: " + newId);
                }
            }

            TienNghi tienNghi = new TienNghi();
            tienNghi.setIdTn(newId);
            tienNghi.setTenTn(request.getTenTn());
            tienNghi.setIcon(request.getIcon());

            TienNghi savedTienNghi = tienNghiRepository.save(tienNghi);
            TienNghiDTO tienNghiDTO = EntityDTOMapper.mapTienNghiToDTO(savedTienNghi);

            response.setStatusCode(200);
            response.setMessage("Thêm tiện ích thành công với ID: " + newId);
            response.setTienNghi(tienNghiDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi thêm tiện ích: " + e.getMessage());
        }
        return response;
    }

    private String generateNextTienNghiId() {
        try {
            // Tìm ID lớn nhất hiện tại
            String maxId = tienNghiRepository.findMaxTienNghiId();

            if (maxId == null) {
                return "TN001";
            }

            // Trích xuất số từ ID (ví dụ: TN001 -> 001)
            String numberPart = maxId.substring(2);
            int nextNumber = Integer.parseInt(numberPart) + 1;

            // Format lại thành TN + 3 chữ số
            return String.format("TN%03d", nextNumber);
        } catch (Exception e) {
            // Fallback nếu có lỗi
            return "TN001";
        }
    }

    @Override
    public Response updateTienNghi(String id, TienNghiRequest request) {
        Response response = new Response();
        try {
            TienNghi tienNghi = tienNghiRepository.findById(id)
                    .orElseThrow(() -> new OurException("Tiện ích không tồn tại"));

            tienNghi.setTenTn(request.getTenTn());
            tienNghi.setIcon(request.getIcon());

            TienNghi updatedTienNghi = tienNghiRepository.save(tienNghi);
            TienNghiDTO tienNghiDTO = EntityDTOMapper.mapTienNghiToDTO(updatedTienNghi);

            response.setStatusCode(200);
            response.setMessage("Cập nhật tiện ích thành công");
            response.setTienNghi(tienNghiDTO);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật tiện ích: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteTienNghi(String id) {
        Response response = new Response();
        try {
            TienNghi tienNghi = tienNghiRepository.findById(id)
                    .orElseThrow(() -> new OurException("Tiện ích không tồn tại"));

            tienNghiRepository.delete(tienNghi);

            response.setStatusCode(200);
            response.setMessage("Xóa tiện ích thành công");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa tiện ích: " + e.getMessage());
        }
        return response;
    }
}
