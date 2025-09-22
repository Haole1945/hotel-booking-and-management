package com.dev.Hotel.utils;

import com.dev.Hotel.dto.*;
import com.dev.Hotel.entity.*;
import java.math.BigDecimal;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.service.impl.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDTOMapper {

    private static GiaHangPhongRepository giaHangPhongRepository;
    private static PriceService priceService;

    @Autowired
    public void setGiaHangPhongRepository(GiaHangPhongRepository giaHangPhongRepository) {
        EntityDTOMapper.giaHangPhongRepository = giaHangPhongRepository;
    }

    @Autowired
    public void setPriceService(PriceService priceService) {
        EntityDTOMapper.priceService = priceService;
    }

    // NhanVien mapping
    public static NhanVienDTO mapNhanVienToDTO(NhanVien nhanVien) {
        if (nhanVien == null)
            return null;

        NhanVienDTO dto = new NhanVienDTO();
        dto.setIdNv(nhanVien.getIdNv());
        dto.setHo(nhanVien.getHo());
        dto.setTen(nhanVien.getTen());
        dto.setPhai(nhanVien.getPhai());
        dto.setNgaySinh(nhanVien.getNgaySinh());
        dto.setDiaChi(nhanVien.getDiaChi());
        dto.setSdt(nhanVien.getSdt());
        dto.setEmail(nhanVien.getEmail());
        dto.setHinh(nhanVien.getHinh());
        dto.setUsername(nhanVien.getUsername());

        if (nhanVien.getBoPhan() != null) {
            dto.setIdBp(nhanVien.getBoPhan().getIdBp());
            dto.setTenBp(nhanVien.getBoPhan().getTenBp());
        }

        if (nhanVien.getNhomQuyen() != null) {
            dto.setIdNq(nhanVien.getNhomQuyen().getIdNq());
            dto.setTenNq(nhanVien.getNhomQuyen().getTenNq());
        }

        return dto;
    }

    // KhachHang mapping
    public static KhachHangDTO mapKhachHangToDTO(KhachHang khachHang) {
        if (khachHang == null)
            return null;

        KhachHangDTO dto = new KhachHangDTO();
        dto.setCccd(khachHang.getCccd());
        dto.setHo(khachHang.getHo());
        dto.setTen(khachHang.getTen());
        dto.setSdt(khachHang.getSdt());
        dto.setEmail(khachHang.getEmail());
        dto.setDiaChi(khachHang.getDiaChi());
        dto.setMaSoThue(khachHang.getMaSoThue());

        return dto;
    }

    // Phong mapping
    public static PhongDTO mapPhongToDTO(Phong phong) {
        if (phong == null)
            return null;

        PhongDTO dto = new PhongDTO();

        // Basic room info
        dto.setSoPhong(phong.getSoPhong());
        dto.setTang(phong.getTang());

        // Room category info
        if (phong.getHangPhong() != null) {
            dto.setIdHangPhong(phong.getHangPhong().getIdHangPhong());

            // Get current price from gia_hang_phong table
            if (giaHangPhongRepository != null) {
                try {
                    var giaHangPhong = giaHangPhongRepository.findLatestPriceByHangPhong(
                            phong.getHangPhong().getIdHangPhong(),
                            LocalDate.now());
                    if (giaHangPhong.isPresent()) {
                        Double price = giaHangPhong.get().getGia().doubleValue();
                        dto.setGiaPhong(price);
                        dto.setGia(price);
                    } else {
                        dto.setGiaPhong(500000.0); // Default price if not found
                        dto.setGia(500000.0);
                    }
                } catch (Exception e) {
                    dto.setGiaPhong(500000.0); // Default price on error
                    dto.setGia(500000.0);
                }
            } else {
                dto.setGiaPhong(500000.0); // Default price if repository not available
                dto.setGia(500000.0);
            }

            // Room type info (Kieu phong)
            if (phong.getHangPhong().getKieuPhong() != null) {
                dto.setIdKp(phong.getHangPhong().getKieuPhong().getIdKp());
                dto.setTenKp(phong.getHangPhong().getKieuPhong().getTenKp());
                dto.setMoTaKp(phong.getHangPhong().getKieuPhong().getMoTa());
                dto.setSoLuongKhachO(phong.getHangPhong().getKieuPhong().getSoLuongKhach());
            }

            // Bed type info (Loai phong)
            if (phong.getHangPhong().getLoaiPhong() != null) {
                dto.setIdLp(phong.getHangPhong().getLoaiPhong().getIdLp());
                dto.setTenLp(phong.getHangPhong().getLoaiPhong().getTenLp());
                dto.setMoTaLp(phong.getHangPhong().getLoaiPhong().getMoTa());
            }
        }

        // Status info
        if (phong.getTrangThai() != null) {
            dto.setIdTt(phong.getTrangThai().getIdTt());
            dto.setTenTrangThai(phong.getTrangThai().getTenTrangThai());
            dto.setIsAvailable("Trống".equals(phong.getTrangThai().getTenTrangThai()));
        }

        return dto;
    }

    // PhieuDat mapping
    public static PhieuDatDTO mapPhieuDatToDTO(PhieuDat phieuDat) {
        if (phieuDat == null)
            return null;

        PhieuDatDTO dto = new PhieuDatDTO();
        dto.setIdPd(phieuDat.getIdPd());
        dto.setNgayDat(phieuDat.getNgayDat());
        dto.setNgayBdThue(phieuDat.getNgayBdThue());
        dto.setNgayDi(phieuDat.getNgayDi());
        dto.setTrangThai(phieuDat.getTrangThai());
        dto.setSoTienCoc(phieuDat.getSoTienCoc());

        if (phieuDat.getKhachHang() != null) {
            dto.setCccd(phieuDat.getKhachHang().getCccd());
            dto.setHoTenKhachHang(phieuDat.getKhachHang().getHo() + " " + phieuDat.getKhachHang().getTen());
            dto.setSdtKhachHang(phieuDat.getKhachHang().getSdt());
            dto.setEmailKhachHang(phieuDat.getKhachHang().getEmail());
        }

        if (phieuDat.getNhanVien() != null) {
            dto.setIdNv(phieuDat.getNhanVien().getIdNv());
            dto.setHoTenNhanVien(phieuDat.getNhanVien().getHo() + " " + phieuDat.getNhanVien().getTen());
        }

        // Map chi tiet phieu dat (lay thong tin dau tien neu co nhieu)
        if (phieuDat.getChiTietPhieuDat() != null && !phieuDat.getChiTietPhieuDat().isEmpty()) {
            var ctPhieuDat = phieuDat.getChiTietPhieuDat().get(0); // Lay chi tiet dau tien
            dto.setSoLuongPhongO(ctPhieuDat.getSoLuongPhongO());
            dto.setIdHangPhong(ctPhieuDat.getHangPhong().getIdHangPhong());

            if (ctPhieuDat.getHangPhong() != null) {
                if (ctPhieuDat.getHangPhong().getKieuPhong() != null) {
                    dto.setTenKp(ctPhieuDat.getHangPhong().getKieuPhong().getTenKp());
                    dto.setIdKp(ctPhieuDat.getHangPhong().getKieuPhong().getIdKp());
                }
                if (ctPhieuDat.getHangPhong().getLoaiPhong() != null) {
                    dto.setTenLp(ctPhieuDat.getHangPhong().getLoaiPhong().getTenLp());
                    dto.setIdLp(ctPhieuDat.getHangPhong().getLoaiPhong().getIdLp());
                }
            }
        }

        return dto;
    }

    // PhieuThue mapping
    public static PhieuThueDTO mapPhieuThueToDTO(PhieuThue phieuThue) {
        if (phieuThue == null)
            return null;

        PhieuThueDTO dto = new PhieuThueDTO();
        dto.setIdPt(phieuThue.getIdPt());
        dto.setNgayLap(phieuThue.getNgayLap());

        // Lấy ngayDen và ngayDi từ chiTietPhieuThue
        if (phieuThue.getChiTietPhieuThue() != null && !phieuThue.getChiTietPhieuThue().isEmpty()) {
            // Lấy ngày đến sớm nhất và ngày đi muộn nhất từ tất cả chi tiết
            LocalDate ngayDenSomNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDen())
                    .filter(date -> date != null)
                    .min(LocalDate::compareTo)
                    .orElse(null);

            LocalDate ngayDiMuonNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDi())
                    .filter(date -> date != null)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            dto.setNgayDen(ngayDenSomNhat);
            dto.setNgayDi(ngayDiMuonNhat);
        }

        if (phieuThue.getKhachHang() != null) {
            dto.setCccd(phieuThue.getKhachHang().getCccd());
            dto.setHoTenKhachHang(phieuThue.getKhachHang().getHo() + " " + phieuThue.getKhachHang().getTen());
            dto.setSdtKhachHang(phieuThue.getKhachHang().getSdt());
            dto.setEmailKhachHang(phieuThue.getKhachHang().getEmail());
        }

        if (phieuThue.getNhanVien() != null) {
            dto.setIdNv(phieuThue.getNhanVien().getIdNv());
            dto.setHoTenNhanVien(phieuThue.getNhanVien().getHo() + " " + phieuThue.getNhanVien().getTen());
        }

        if (phieuThue.getPhieuDat() != null) {
            dto.setIdPd(phieuThue.getPhieuDat().getIdPd());
            dto.setSoTienCoc(phieuThue.getPhieuDat().getSoTienCoc()); // Thêm tiền đặt cọc
        }

        // Map chi tiet phieu thue if available
        if (phieuThue.getChiTietPhieuThue() != null) {
            dto.setChiTietPhieuThue(mapCtPhieuThueListToDTO(phieuThue.getChiTietPhieuThue()));
        }

        return dto;
    }

    // PhieuThue simple mapping (for check-in response)
    public static PhieuThueSimpleDTO mapPhieuThueToSimpleDTO(PhieuThue phieuThue) {
        if (phieuThue == null)
            return null;

        PhieuThueSimpleDTO dto = new PhieuThueSimpleDTO();
        dto.setIdPt(phieuThue.getIdPt());
        dto.setNgayLap(phieuThue.getNgayLap());

        // Lấy ngayDen và ngayDi từ chiTietPhieuThue
        if (phieuThue.getChiTietPhieuThue() != null && !phieuThue.getChiTietPhieuThue().isEmpty()) {
            LocalDate ngayDenSomNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDen())
                    .filter(date -> date != null)
                    .min(LocalDate::compareTo)
                    .orElse(null);

            LocalDate ngayDiMuonNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDi())
                    .filter(date -> date != null)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            dto.setNgayDen(ngayDenSomNhat);
            dto.setNgayDi(ngayDiMuonNhat);
        }

        if (phieuThue.getKhachHang() != null) {
            dto.setCccd(phieuThue.getKhachHang().getCccd());
        }

        if (phieuThue.getNhanVien() != null) {
            dto.setIdNv(phieuThue.getNhanVien().getIdNv());
        }

        if (phieuThue.getPhieuDat() != null) {
            dto.setIdPd(phieuThue.getPhieuDat().getIdPd());
        }

        return dto;
    }

    // PhieuDat simple mapping (for booking response)
    public static PhieuDatSimpleDTO mapPhieuDatToSimpleDTO(PhieuDat phieuDat) {
        if (phieuDat == null)
            return null;

        PhieuDatSimpleDTO dto = new PhieuDatSimpleDTO();
        dto.setIdPd(phieuDat.getIdPd());
        dto.setNgayDat(phieuDat.getNgayDat());
        dto.setNgayBdThue(phieuDat.getNgayBdThue());
        dto.setNgayDi(phieuDat.getNgayDi());
        dto.setTrangThai(phieuDat.getTrangThai());
        dto.setSoTienCoc(phieuDat.getSoTienCoc());

        if (phieuDat.getKhachHang() != null) {
            dto.setCccd(phieuDat.getKhachHang().getCccd());
        }

        if (phieuDat.getNhanVien() != null) {
            dto.setIdNv(phieuDat.getNhanVien().getIdNv());
        }

        return dto;
    }

    // CtPhieuThue mapping
    public static CtPhieuThueDTO mapCtPhieuThueToDTO(CtPhieuThue ctPhieuThue) {
        if (ctPhieuThue == null)
            return null;

        CtPhieuThueDTO dto = new CtPhieuThueDTO();
        dto.setIdCtPt(ctPhieuThue.getIdCtPt());
        dto.setNgayDen(ctPhieuThue.getNgayDen());
        dto.setGioDen(ctPhieuThue.getGioDen());
        dto.setNgayDi(ctPhieuThue.getNgayDi());
        dto.setDonGia(ctPhieuThue.getDonGia());
        dto.setTtThanhToan(ctPhieuThue.getTtThanhToan());

        if (ctPhieuThue.getPhieuThue() != null) {
            dto.setIdPt(ctPhieuThue.getPhieuThue().getIdPt());

            // Add customer information from PhieuThue
            if (ctPhieuThue.getPhieuThue().getKhachHang() != null) {
                dto.setTenKhachHang(ctPhieuThue.getPhieuThue().getKhachHang().getHo() + " " +
                        ctPhieuThue.getPhieuThue().getKhachHang().getTen());
                dto.setCccd(ctPhieuThue.getPhieuThue().getKhachHang().getCccd());
                dto.setSdtKhachHang(ctPhieuThue.getPhieuThue().getKhachHang().getSdt());
            }
        }

        if (ctPhieuThue.getPhong() != null) {
            dto.setSoPhong(ctPhieuThue.getPhong().getSoPhong());
            dto.setTang(ctPhieuThue.getPhong().getTang());

            if (ctPhieuThue.getPhong().getHangPhong() != null) {
                if (ctPhieuThue.getPhong().getHangPhong().getKieuPhong() != null) {
                    dto.setTenKieuPhong(ctPhieuThue.getPhong().getHangPhong().getKieuPhong().getTenKp());
                }
                if (ctPhieuThue.getPhong().getHangPhong().getLoaiPhong() != null) {
                    dto.setTenLoaiPhong(ctPhieuThue.getPhong().getHangPhong().getLoaiPhong().getTenLp());
                }
            }

            if (ctPhieuThue.getPhong().getTrangThai() != null) {
                dto.setTenTrangThai(ctPhieuThue.getPhong().getTrangThai().getTenTrangThai());
            }
        }

        // Map services (dich vu) for this CtPhieuThue
        if (ctPhieuThue.getDanhSachDichVu() != null && !ctPhieuThue.getDanhSachDichVu().isEmpty()) {
            dto.setDanhSachDichVu(ctPhieuThue.getDanhSachDichVu().stream()
                    .map(EntityDTOMapper::mapCtDichVuToDTO)
                    .collect(Collectors.toList()));
        }

        // Map surcharges (phu thu) for this CtPhieuThue
        if (ctPhieuThue.getDanhSachPhuThu() != null && !ctPhieuThue.getDanhSachPhuThu().isEmpty()) {
            dto.setDanhSachPhuThu(ctPhieuThue.getDanhSachPhuThu().stream()
                    .map(EntityDTOMapper::mapCtPhuThuToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // List mapping methods
    public static List<NhanVienDTO> mapNhanVienListToDTO(List<NhanVien> nhanVienList) {
        return nhanVienList.stream().map(EntityDTOMapper::mapNhanVienToDTO).collect(Collectors.toList());
    }

    public static List<KhachHangDTO> mapKhachHangListToDTO(List<KhachHang> khachHangList) {
        return khachHangList.stream().map(EntityDTOMapper::mapKhachHangToDTO).collect(Collectors.toList());
    }

    public static List<PhongDTO> mapPhongListToDTO(List<Phong> phongList) {
        return phongList.stream().map(EntityDTOMapper::mapPhongToDTO).collect(Collectors.toList());
    }

    public static List<PhieuDatDTO> mapPhieuDatListToDTO(List<PhieuDat> phieuDatList) {
        return phieuDatList.stream().map(EntityDTOMapper::mapPhieuDatToDTO).collect(Collectors.toList());
    }

    public static List<PhieuThueDTO> mapPhieuThueListToDTO(List<PhieuThue> phieuThueList) {
        return phieuThueList.stream().map(EntityDTOMapper::mapPhieuThueToDTO).collect(Collectors.toList());
    }

    public static List<CtPhieuThueDTO> mapCtPhieuThueListToDTO(List<CtPhieuThue> ctPhieuThueList) {
        return ctPhieuThueList.stream().map(EntityDTOMapper::mapCtPhieuThueToDTO).collect(Collectors.toList());
    }

    // KieuPhong mapping
    public static KieuPhongDTO mapKieuPhongToDTO(KieuPhong kieuPhong) {
        if (kieuPhong == null)
            return null;

        KieuPhongDTO dto = new KieuPhongDTO();
        dto.setIdKp(kieuPhong.getIdKp());
        dto.setTenKp(kieuPhong.getTenKp());
        dto.setMoTaKp(kieuPhong.getMoTa());
        dto.setSoLuongKhach(kieuPhong.getSoLuongKhach());
        return dto;
    }

    public static List<KieuPhongDTO> mapKieuPhongListToDTO(List<KieuPhong> kieuPhongList) {
        return kieuPhongList.stream().map(EntityDTOMapper::mapKieuPhongToDTO).collect(Collectors.toList());
    }

    // LoaiPhong mapping
    public static LoaiPhongDTO mapLoaiPhongToDTO(LoaiPhong loaiPhong) {
        if (loaiPhong == null)
            return null;

        LoaiPhongDTO dto = new LoaiPhongDTO();
        dto.setIdLp(loaiPhong.getIdLp());
        dto.setTenLp(loaiPhong.getTenLp());
        dto.setMoTaLp(loaiPhong.getMoTa());
        return dto;
    }

    public static List<LoaiPhongDTO> mapLoaiPhongListToDTO(List<LoaiPhong> loaiPhongList) {
        return loaiPhongList.stream().map(EntityDTOMapper::mapLoaiPhongToDTO).collect(Collectors.toList());
    }

    // CtDichVu mapping
    public static CtDichVuDTO mapCtDichVuToDTO(CtDichVu ctDichVu) {
        if (ctDichVu == null)
            return null;

        CtDichVuDTO dto = new CtDichVuDTO();

        // Set composite key fields
        if (ctDichVu.getId() != null) {
            dto.setIdCtPt(ctDichVu.getId().getIdCtPt());
            dto.setIdDv(ctDichVu.getId().getIdDv());
        }

        dto.setNgaySuDung(ctDichVu.getNgaySuDung());
        dto.setDonGia(ctDichVu.getDonGia());
        dto.setSoLuong(ctDichVu.getSoLuong());
        dto.setIdHd(ctDichVu.getIdHd());
        dto.setTtThanhToan(ctDichVu.getTtThanhToan());

        if (ctDichVu.getCtPhieuThue() != null) {

            // Add room info
            if (ctDichVu.getCtPhieuThue().getPhong() != null) {
                dto.setSoPhong(ctDichVu.getCtPhieuThue().getPhong().getSoPhong());
                if (ctDichVu.getCtPhieuThue().getPhong().getHangPhong() != null) {
                    if (ctDichVu.getCtPhieuThue().getPhong().getHangPhong().getKieuPhong() != null) {
                        dto.setTenKieuPhong(
                                ctDichVu.getCtPhieuThue().getPhong().getHangPhong().getKieuPhong().getTenKp());
                    }
                    if (ctDichVu.getCtPhieuThue().getPhong().getHangPhong().getLoaiPhong() != null) {
                        dto.setTenLoaiPhong(
                                ctDichVu.getCtPhieuThue().getPhong().getHangPhong().getLoaiPhong().getTenLp());
                    }
                }
            }

            // Add customer info
            if (ctDichVu.getCtPhieuThue().getPhieuThue() != null &&
                    ctDichVu.getCtPhieuThue().getPhieuThue().getKhachHang() != null) {
                dto.setTenKhachHang(ctDichVu.getCtPhieuThue().getPhieuThue().getKhachHang().getHo() + " " +
                        ctDichVu.getCtPhieuThue().getPhieuThue().getKhachHang().getTen());
                dto.setCccd(ctDichVu.getCtPhieuThue().getPhieuThue().getKhachHang().getCccd());
            }
        }

        if (ctDichVu.getDichVu() != null) {
            dto.setTenDv(ctDichVu.getDichVu().getTenDv());
            dto.setDonViTinh(ctDichVu.getDichVu().getDonViTinh());
        }

        return dto;
    }

    public static List<CtDichVuDTO> mapCtDichVuListToDTO(List<CtDichVu> ctDichVuList) {
        return ctDichVuList.stream().map(EntityDTOMapper::mapCtDichVuToDTO).collect(Collectors.toList());
    }

    // CtPhuThu mapping
    public static CtPhuThuDTO mapCtPhuThuToDTO(CtPhuThu ctPhuThu) {
        if (ctPhuThu == null)
            return null;

        CtPhuThuDTO dto = new CtPhuThuDTO();

        // Set composite key fields
        if (ctPhuThu.getId() != null) {
            dto.setIdPhuThu(ctPhuThu.getId().getIdPhuThu());
            dto.setIdCtPt(ctPhuThu.getId().getIdCtPt());
        }

        dto.setIdHd(ctPhuThu.getIdHd());
        dto.setTtThanhToan(ctPhuThu.getTtThanhToan());
        dto.setDonGia(ctPhuThu.getDonGia());
        dto.setSoLuong(ctPhuThu.getSoLuong());

        if (ctPhuThu.getCtPhieuThue() != null) {

            // Add room info
            if (ctPhuThu.getCtPhieuThue().getPhong() != null) {
                dto.setSoPhong(ctPhuThu.getCtPhieuThue().getPhong().getSoPhong());
                if (ctPhuThu.getCtPhieuThue().getPhong().getHangPhong() != null) {
                    if (ctPhuThu.getCtPhieuThue().getPhong().getHangPhong().getKieuPhong() != null) {
                        dto.setTenKieuPhong(
                                ctPhuThu.getCtPhieuThue().getPhong().getHangPhong().getKieuPhong().getTenKp());
                    }
                    if (ctPhuThu.getCtPhieuThue().getPhong().getHangPhong().getLoaiPhong() != null) {
                        dto.setTenLoaiPhong(
                                ctPhuThu.getCtPhieuThue().getPhong().getHangPhong().getLoaiPhong().getTenLp());
                    }
                }
            }

            // Add customer info
            if (ctPhuThu.getCtPhieuThue().getPhieuThue() != null &&
                    ctPhuThu.getCtPhieuThue().getPhieuThue().getKhachHang() != null) {
                dto.setTenKhachHang(ctPhuThu.getCtPhieuThue().getPhieuThue().getKhachHang().getHo() + " " +
                        ctPhuThu.getCtPhieuThue().getPhieuThue().getKhachHang().getTen());
                dto.setCccd(ctPhuThu.getCtPhieuThue().getPhieuThue().getKhachHang().getCccd());
            }
        }

        if (ctPhuThu.getPhuThu() != null) {
            dto.setTenPhuThu(ctPhuThu.getPhuThu().getTenPhuThu());
        }

        return dto;
    }

    public static List<CtPhuThuDTO> mapCtPhuThuListToDTO(List<CtPhuThu> ctPhuThuList) {
        return ctPhuThuList.stream().map(EntityDTOMapper::mapCtPhuThuToDTO).collect(Collectors.toList());
    }

    // DichVu mapping
    public static DichVuDTO mapDichVuToDTO(DichVu dichVu) {
        if (dichVu == null)
            return null;

        DichVuDTO dto = new DichVuDTO();
        dto.setIdDv(dichVu.getIdDv());
        dto.setTenDv(dichVu.getTenDv());
        dto.setMoTa(dichVu.getMoTa());
        dto.setDonViTinh(dichVu.getDonViTinh());

        // Get latest price from database using PriceService
        if (priceService != null) {
            try {
                priceService.getLatestServicePrice(dichVu.getIdDv())
                        .ifPresent(dto::setGiaHienTai);
                priceService.getLatestServicePriceDate(dichVu.getIdDv())
                        .ifPresent(dto::setNgayApDungGia);
            } catch (Exception e) {
                // If error getting price, set null
                dto.setGiaHienTai(null);
                dto.setNgayApDungGia(null);
            }
        } else {
            dto.setGiaHienTai(null);
            dto.setNgayApDungGia(null);
        }

        return dto;
    }

    public static List<DichVuDTO> mapDichVuListToDTO(List<DichVu> dichVuList) {
        return dichVuList.stream().map(EntityDTOMapper::mapDichVuToDTO).collect(Collectors.toList());
    }

    // PhuThu mapping
    public static PhuThuDTO mapPhuThuToDTO(PhuThu phuThu) {
        if (phuThu == null)
            return null;

        PhuThuDTO dto = new PhuThuDTO();
        dto.setIdPhuThu(phuThu.getIdPhuThu());
        dto.setTenPhuThu(phuThu.getTenPhuThu());
        dto.setLyDo(phuThu.getLyDo());

        // Lấy giá từ bảng giaphuthu thông qua priceService
        if (priceService != null) {
            try {
                priceService.getLatestSurchargePrice(phuThu.getIdPhuThu())
                        .ifPresent(dto::setGiaHienTai);
                priceService.getLatestSurchargePriceDate(phuThu.getIdPhuThu())
                        .ifPresent(dto::setNgayApDungGia);
            } catch (Exception e) {
                dto.setGiaHienTai(null);
                dto.setNgayApDungGia(null);
            }
        } else {
            dto.setGiaHienTai(null);
            dto.setNgayApDungGia(null);
        }

        return dto;
    }

    public static List<PhuThuDTO> mapPhuThuListToDTO(List<PhuThu> phuThuList) {
        return phuThuList.stream().map(EntityDTOMapper::mapPhuThuToDTO).collect(Collectors.toList());
    }

    // GiaPhuThu mapping
    public static GiaPhuThuDTO mapGiaPhuThuToDTO(GiaPhuThu giaPhuThu) {
        if (giaPhuThu == null)
            return null;

        GiaPhuThuDTO dto = new GiaPhuThuDTO();
        if (giaPhuThu.getId() != null) {
            dto.setIdPhuThu(giaPhuThu.getId().getIdPhuThu());
            dto.setNgayApDung(giaPhuThu.getId().getNgayApDung());
        }
        dto.setGia(giaPhuThu.getGia());
        dto.setIdNv(giaPhuThu.getIdNv());

        // Additional info
        if (giaPhuThu.getPhuThu() != null) {
            dto.setTenPhuThu(giaPhuThu.getPhuThu().getTenPhuThu());
        }

        if (giaPhuThu.getNhanVien() != null) {
            dto.setHoTenNhanVien(giaPhuThu.getNhanVien().getHo() + " " + giaPhuThu.getNhanVien().getTen());
        }

        return dto;
    }

    public static List<GiaPhuThuDTO> mapGiaPhuThuListToDTO(List<GiaPhuThu> giaPhuThuList) {
        return giaPhuThuList.stream().map(EntityDTOMapper::mapGiaPhuThuToDTO).collect(Collectors.toList());
    }

    // HangPhong mapping
    public static HangPhongDTO mapHangPhongToDTO(HangPhong hangPhong) {
        if (hangPhong == null)
            return null;

        HangPhongDTO dto = new HangPhongDTO();
        dto.setIdHangPhong(hangPhong.getIdHangPhong());

        // Kieu phong info
        if (hangPhong.getKieuPhong() != null) {
            dto.setIdKp(hangPhong.getKieuPhong().getIdKp());
            dto.setTenKp(hangPhong.getKieuPhong().getTenKp());
            dto.setMoTaKp(hangPhong.getKieuPhong().getMoTa());
            dto.setSoLuongKhachO(hangPhong.getKieuPhong().getSoLuongKhach());
        }

        // Loai phong info
        if (hangPhong.getLoaiPhong() != null) {
            dto.setIdLp(hangPhong.getLoaiPhong().getIdLp());
            dto.setTenLp(hangPhong.getLoaiPhong().getTenLp());
            dto.setMoTaLp(hangPhong.getLoaiPhong().getMoTa());
        }

        // Map danh sach phong if needed
        if (hangPhong.getDanhSachPhong() != null) {
            dto.setDanhSachPhong(mapPhongListToDTO(hangPhong.getDanhSachPhong()));
            dto.setTongSoPhong(hangPhong.getDanhSachPhong().size());

            // Count available rooms
            long soPhongTrong = hangPhong.getDanhSachPhong().stream()
                    .filter(phong -> phong.getTrangThai() != null &&
                            ("TT01".equals(phong.getTrangThai().getIdTt())
                                    || "TT001".equals(phong.getTrangThai().getIdTt())))
                    .count();
            dto.setSoPhongTrong((int) soPhongTrong);
        }

        return dto;
    }

    public static List<HangPhongDTO> mapHangPhongListToDTO(List<HangPhong> hangPhongList) {
        return hangPhongList.stream().map(EntityDTOMapper::mapHangPhongToDTO).collect(Collectors.toList());
    }

    // HoaDon mapping
    public static HoaDonDTO mapHoaDonToDTO(HoaDon hoaDon) {
        if (hoaDon == null)
            return null;

        HoaDonDTO dto = new HoaDonDTO();
        dto.setIdHd(hoaDon.getIdHd());
        dto.setNgayLap(hoaDon.getNgayLap());
        dto.setTongTien(hoaDon.getTongTien());
        dto.setSoTienGiam(hoaDon.getSoTienGiam());
        dto.setTrangThai(hoaDon.getTrangThai());

        // PhieuThue info
        if (hoaDon.getPhieuThue() != null) {
            dto.setIdPt(hoaDon.getPhieuThue().getIdPt());
            dto.setMaPhieuThue("PT" + hoaDon.getPhieuThue().getIdPt());

            // Lấy ngayDen và ngayDi từ chiTietPhieuThue
            if (hoaDon.getPhieuThue().getChiTietPhieuThue() != null
                    && !hoaDon.getPhieuThue().getChiTietPhieuThue().isEmpty()) {
                LocalDate ngayDenSomNhat = hoaDon.getPhieuThue().getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDen())
                        .filter(date -> date != null)
                        .min(LocalDate::compareTo)
                        .orElse(null);

                LocalDate ngayDiMuonNhat = hoaDon.getPhieuThue().getChiTietPhieuThue().stream()
                        .map(ct -> ct.getNgayDi())
                        .filter(date -> date != null)
                        .max(LocalDate::compareTo)
                        .orElse(null);

                dto.setNgayDen(ngayDenSomNhat);
                dto.setNgayDi(ngayDiMuonNhat);
            }

            // Customer info
            if (hoaDon.getPhieuThue().getKhachHang() != null) {
                dto.setCccdKhachHang(hoaDon.getPhieuThue().getKhachHang().getCccd());
                dto.setHoTenKhachHang(hoaDon.getPhieuThue().getKhachHang().getHo() + " " +
                        hoaDon.getPhieuThue().getKhachHang().getTen());
                dto.setSdtKhachHang(hoaDon.getPhieuThue().getKhachHang().getSdt());
                dto.setEmailKhachHang(hoaDon.getPhieuThue().getKhachHang().getEmail());
            }
        }

        // Employee info
        if (hoaDon.getNhanVien() != null) {
            dto.setIdNv(hoaDon.getNhanVien().getIdNv());
            dto.setHoTenNhanVien(hoaDon.getNhanVien().getHo() + " " + hoaDon.getNhanVien().getTen());
        }

        return dto;
    }

    public static List<HoaDonDTO> mapHoaDonListToDTO(List<HoaDon> hoaDonList) {
        return hoaDonList.stream().map(EntityDTOMapper::mapHoaDonToDTO).collect(Collectors.toList());
    }

    public static PhieuThueDetailsDTO mapPhieuThueToDetailsDTO(PhieuThue phieuThue) {
        PhieuThueDetailsDTO dto = new PhieuThueDetailsDTO();

        // Basic info
        dto.setIdPt(phieuThue.getIdPt());

        // Lấy ngayDen và ngayDi từ chiTietPhieuThue
        if (phieuThue.getChiTietPhieuThue() != null && !phieuThue.getChiTietPhieuThue().isEmpty()) {
            LocalDate ngayDenSomNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDen())
                    .filter(date -> date != null)
                    .min(LocalDate::compareTo)
                    .orElse(null);

            LocalDate ngayDiMuonNhat = phieuThue.getChiTietPhieuThue().stream()
                    .map(ct -> ct.getNgayDi())
                    .filter(date -> date != null)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            dto.setNgayDen(ngayDenSomNhat);
            dto.setNgayDi(ngayDiMuonNhat);
        }

        // Customer info
        if (phieuThue.getKhachHang() != null) {
            dto.setCccdKhachHang(phieuThue.getKhachHang().getCccd());
            dto.setHoTenKhachHang(phieuThue.getKhachHang().getHo() + " " + phieuThue.getKhachHang().getTen());
            dto.setSdtKhachHang(phieuThue.getKhachHang().getSdt());
            dto.setEmailKhachHang(phieuThue.getKhachHang().getEmail());
        }

        // Employee info
        if (phieuThue.getNhanVien() != null) {
            dto.setIdNv(phieuThue.getNhanVien().getIdNv());
            dto.setHoTenNhanVien(phieuThue.getNhanVien().getHo() + " " + phieuThue.getNhanVien().getTen());
        }

        // Booking info (PhieuDat)
        if (phieuThue.getPhieuDat() != null) {
            dto.setIdPd(phieuThue.getPhieuDat().getIdPd());
            dto.setSoTienCoc(phieuThue.getPhieuDat().getSoTienCoc());
        }

        // Initialize totals
        BigDecimal tongTienPhong = BigDecimal.ZERO;
        BigDecimal tongTienDichVu = BigDecimal.ZERO;
        BigDecimal tongTienPhuThu = BigDecimal.ZERO;

        // Map rooms (CtPhieuThue)
        List<PhieuThueDetailsDTO.RoomDetailDTO> rooms = new ArrayList<>();

        if (phieuThue.getChiTietPhieuThue() != null) {
            for (CtPhieuThue ctPhieuThue : phieuThue.getChiTietPhieuThue()) {
                // CHỈ HIỂN THỊ PHÒNG CHƯA THANH TOÁN (cho checkout)
                if (!"Đã thanh toán".equals(ctPhieuThue.getTtThanhToan())) {
                    PhieuThueDetailsDTO.RoomDetailDTO roomDto = new PhieuThueDetailsDTO.RoomDetailDTO();
                    roomDto.setIdCtPt(ctPhieuThue.getIdCtPt());

                    if (ctPhieuThue.getPhong() != null) {
                        roomDto.setIdPhong(ctPhieuThue.getPhong().getSoPhong());
                        roomDto.setTenPhong(ctPhieuThue.getPhong().getSoPhong());
                        if (ctPhieuThue.getPhong().getHangPhong() != null &&
                                ctPhieuThue.getPhong().getHangPhong().getLoaiPhong() != null) {
                            roomDto.setLoaiPhong(ctPhieuThue.getPhong().getHangPhong().getLoaiPhong().getTenLp());
                        }
                    }

                    roomDto.setDonGia(ctPhieuThue.getDonGia());
                    roomDto.setNgayDen(ctPhieuThue.getNgayDen());
                    roomDto.setNgayDi(ctPhieuThue.getNgayDi());
                    roomDto.setTrangThaiThanhToan(ctPhieuThue.getTtThanhToan());

                    // Calculate room charges
                    if (ctPhieuThue.getDonGia() != null && ctPhieuThue.getNgayDen() != null
                            && ctPhieuThue.getNgayDi() != null) {
                        long soNgay = java.time.temporal.ChronoUnit.DAYS.between(ctPhieuThue.getNgayDen(),
                                ctPhieuThue.getNgayDi());
                        soNgay = Math.max(1, soNgay);
                        roomDto.setSoNgay((int) soNgay);

                        BigDecimal thanhTien = ctPhieuThue.getDonGia().multiply(BigDecimal.valueOf(soNgay));
                        roomDto.setThanhTien(thanhTien);
                        tongTienPhong = tongTienPhong.add(thanhTien);
                    }

                    rooms.add(roomDto);
                } // Đóng block if cho phòng chưa thanh toán
            }
        }

        // Sắp xếp rooms theo số phòng từ nhỏ đến lớn
        rooms.sort((r1, r2) -> {
            if (r1.getIdPhong() == null && r2.getIdPhong() == null)
                return 0;
            if (r1.getIdPhong() == null)
                return 1;
            if (r2.getIdPhong() == null)
                return -1;
            try {
                Integer room1 = Integer.parseInt(r1.getIdPhong());
                Integer room2 = Integer.parseInt(r2.getIdPhong());
                return room1.compareTo(room2);
            } catch (NumberFormatException e) {
                // Nếu không parse được số, sắp xếp theo string
                return r1.getIdPhong().compareTo(r2.getIdPhong());
            }
        });

        dto.setRooms(rooms);
        dto.setTongTienPhong(tongTienPhong);

        // Map services (CtDichVu) - need to get from repository
        List<PhieuThueDetailsDTO.ServiceDetailDTO> services = new ArrayList<>();
        // This will be populated by the service layer
        dto.setServices(services);
        dto.setTongTienDichVu(tongTienDichVu);

        // Map surcharges (CtPhuThu) - need to get from repository
        List<PhieuThueDetailsDTO.SurchargeDetailDTO> surcharges = new ArrayList<>();
        // This will be populated by the service layer
        dto.setSurcharges(surcharges);
        dto.setTongTienPhuThu(tongTienPhuThu);

        // Calculate total
        BigDecimal tongTien = tongTienPhong.add(tongTienDichVu).add(tongTienPhuThu);
        dto.setTongTien(tongTien);

        return dto;
    }

    // GiaHangPhong mapping methods
    public static GiaHangPhongDTO mapGiaHangPhongToDTO(GiaHangPhong giaHangPhong) {
        if (giaHangPhong == null) {
            return null;
        }

        GiaHangPhongDTO dto = new GiaHangPhongDTO();
        dto.setIdHangPhong(giaHangPhong.getIdHangPhong());
        dto.setNgayApDung(giaHangPhong.getNgayApDung());
        dto.setGia(giaHangPhong.getGia());
        dto.setNgayThietLap(giaHangPhong.getNgayThietLap());
        dto.setIdNv(giaHangPhong.getIdNv());

        // Don't access lazy-loaded relationships to avoid transaction issues
        // Additional info can be loaded separately if needed

        return dto;
    }

    public static List<GiaHangPhongDTO> mapGiaHangPhongListToDTO(List<GiaHangPhong> giaHangPhongList) {
        if (giaHangPhongList == null) {
            return null;
        }
        return giaHangPhongList.stream()
                .map(EntityDTOMapper::mapGiaHangPhongToDTO)
                .collect(Collectors.toList());
    }

    // TienNghi mapping
    public static TienNghiDTO mapTienNghiToDTO(TienNghi tienNghi) {
        if (tienNghi == null) {
            return null;
        }

        TienNghiDTO dto = new TienNghiDTO();
        dto.setIdTn(tienNghi.getIdTn());
        dto.setTenTn(tienNghi.getTenTn());
        dto.setIcon(tienNghi.getIcon());
        return dto;
    }

    public static List<TienNghiDTO> mapTienNghiListToDTO(List<TienNghi> tienNghiList) {
        if (tienNghiList == null) {
            return null;
        }
        return tienNghiList.stream()
                .map(EntityDTOMapper::mapTienNghiToDTO)
                .collect(Collectors.toList());
    }

    // KhuyenMai mapping
    public static KhuyenMaiDTO mapKhuyenMaiToDTO(KhuyenMai khuyenMai) {
        if (khuyenMai == null) {
            return null;
        }

        KhuyenMaiDTO dto = new KhuyenMaiDTO();
        dto.setIdKm(khuyenMai.getIdKm());
        dto.setMoTaKm(khuyenMai.getMoTaKm());
        dto.setNgayBatDau(khuyenMai.getNgayBatDau());
        dto.setNgayKetThuc(khuyenMai.getNgayKetThuc());

        // Lấy phần trăm giảm từ chi tiết khuyến mãi (nếu có)
        try {
            if (khuyenMai.getChiTietKhuyenMai() != null && !khuyenMai.getChiTietKhuyenMai().isEmpty()) {
                // Lấy phần trăm giảm từ chi tiết đầu tiên
                CtKhuyenMai ctKhuyenMai = khuyenMai.getChiTietKhuyenMai().get(0);
                if (ctKhuyenMai != null && ctKhuyenMai.getPhanTramGiam() != null) {
                    dto.setPhanTramGiam(ctKhuyenMai.getPhanTramGiam());
                }
            }
        } catch (Exception e) {
            System.err.println("Error mapping KhuyenMai phanTramGiam: " + e.getMessage());
            // Set default value if error
            dto.setPhanTramGiam(java.math.BigDecimal.ZERO);
        }

        return dto;
    }

    public static List<KhuyenMaiDTO> mapKhuyenMaiListToDTO(List<KhuyenMai> khuyenMaiList) {
        if (khuyenMaiList == null) {
            return null;
        }
        return khuyenMaiList.stream()
                .map(EntityDTOMapper::mapKhuyenMaiToDTO)
                .collect(Collectors.toList());
    }

}
