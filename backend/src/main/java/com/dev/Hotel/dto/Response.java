package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import com.dev.Hotel.entity.TrangThai;
import com.dev.Hotel.entity.BoPhan;
import com.dev.Hotel.entity.NhomQuyen;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmationCode;

    // Legacy fields removed - using new entity DTOs

    // New entity DTOs
    private NhanVienDTO nhanVien;
    private KhachHangDTO khachHang;
    private PhongDTO phong;
    private PhieuDatDTO phieuDat;
    private PhieuThueDTO phieuThue;
    private HangPhongDTO hangPhong;

    // Simple DTOs for check-in responses
    private PhieuDatSimpleDTO phieuDatSimple;
    private PhieuThueSimpleDTO phieuThueSimple;

    // New entity lists
    private List<NhanVienDTO> nhanVienList;
    private List<KhachHangDTO> khachHangList;
    private List<PhongDTO> phongList;
    private List<PhieuDatDTO> phieuDatList;
    private List<PhieuThueDTO> phieuThueList;
    private List<HangPhongDTO> hangPhongList;
    private List<KieuPhongDTO> kieuPhongList;
    private List<LoaiPhongDTO> loaiPhongList;
    private List<GiaHangPhongDTO> giaHangPhongList;
    private List<GiaPhuThuDTO> giaPhuThuList;

    // Single entities
    private KieuPhongDTO kieuPhong;
    private LoaiPhongDTO loaiPhong;

    // Service and surcharge DTOs
    private DichVuDTO dichVu;
    private PhuThuDTO phuThu;
    private List<DichVuDTO> dichVuList;
    private List<PhuThuDTO> phuThuList;

    // Amenity DTOs
    private TienNghiDTO tienNghi;
    private List<TienNghiDTO> tienNghiList;

    // Promotion DTOs
    private KhuyenMaiDTO khuyenMai;
    private List<KhuyenMaiDTO> khuyenMaiList;
    private PromotionsByRentalDTO promotionsByRental;

    // Hot Hang Phong DTOs
    private List<HotHangPhongDTO> hotHangPhongList;

    // Service and surcharge usage DTOs
    private CtDichVuDTO ctDichVu;
    private CtPhuThuDTO ctPhuThu;
    private List<CtDichVuDTO> ctDichVuList;
    private List<CtPhuThuDTO> ctPhuThuList;
    private List<CtPhieuThueDTO> ctPhieuThueList;

    // Dashboard data
    private Object stats;
    private Object activities;
    private Object tasks;

    // CT Khach O data
    private Object guestList;
    private Object roomGuests;

    // Room pricing data
    private BigDecimal roomPrice;
    private BigDecimal minDeposit;
    private List<Object> priceSegments;

    // Invoice data
    private HoaDonDTO hoaDon;
    private List<HoaDonDTO> hoaDonList;
    private HoaDonDetailsDTO hoaDonDetails;

    // Detailed rental info
    private PhieuThueDetailsDTO phieuThueDetails;

    // Available rooms by hang phong
    private List<AvailableRoomsByHangPhongDTO> availableRoomsByHangPhongList;

    // Room change related DTOs
    private DoiPhongDTO doiPhong;
    private List<DoiPhongDTO> doiPhongList;
    private RoomChangeEligibilityDTO roomChangeEligibility;
    private RoomChangeFeeCalculationDTO roomChangeFeeCalculation;

    // Statistics
    private List<Object[]> statistics;

    // BoPhan and NhomQuyen
    private BoPhan boPhan;
    private List<BoPhan> boPhanList;
    private NhomQuyen nhomQuyen;
    private List<NhomQuyen> nhomQuyenList;

    // Getters and Setters
    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(String expirationTime) {
        this.expirationTime = expirationTime;
    }

    public NhanVienDTO getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVienDTO nhanVien) {
        this.nhanVien = nhanVien;
    }

    public KhachHangDTO getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHangDTO khachHang) {
        this.khachHang = khachHang;
    }

    public PhongDTO getPhong() {
        return phong;
    }

    public void setPhong(PhongDTO phong) {
        this.phong = phong;
    }

    public PhieuDatDTO getPhieuDat() {
        return phieuDat;
    }

    public void setPhieuDat(PhieuDatDTO phieuDat) {
        this.phieuDat = phieuDat;
    }

    public PhieuThueDTO getPhieuThue() {
        return phieuThue;
    }

    public void setPhieuThue(PhieuThueDTO phieuThue) {
        this.phieuThue = phieuThue;
    }

    public HangPhongDTO getHangPhong() {
        return hangPhong;
    }

    public void setHangPhong(HangPhongDTO hangPhong) {
        this.hangPhong = hangPhong;
    }

    public PhieuDatSimpleDTO getPhieuDatSimple() {
        return phieuDatSimple;
    }

    public void setPhieuDatSimple(PhieuDatSimpleDTO phieuDatSimple) {
        this.phieuDatSimple = phieuDatSimple;
    }

    public PhieuThueSimpleDTO getPhieuThueSimple() {
        return phieuThueSimple;
    }

    public void setPhieuThueSimple(PhieuThueSimpleDTO phieuThueSimple) {
        this.phieuThueSimple = phieuThueSimple;
    }

    public List<NhanVienDTO> getNhanVienList() {
        return nhanVienList;
    }

    public void setNhanVienList(List<NhanVienDTO> nhanVienList) {
        this.nhanVienList = nhanVienList;
    }

    public List<KhachHangDTO> getKhachHangList() {
        return khachHangList;
    }

    public void setKhachHangList(List<KhachHangDTO> khachHangList) {
        this.khachHangList = khachHangList;
    }

    public List<PhongDTO> getPhongList() {
        return phongList;
    }

    public void setPhongList(List<PhongDTO> phongList) {
        this.phongList = phongList;
    }

    public List<PhieuDatDTO> getPhieuDatList() {
        return phieuDatList;
    }

    public void setPhieuDatList(List<PhieuDatDTO> phieuDatList) {
        this.phieuDatList = phieuDatList;
    }

    public List<PhieuThueDTO> getPhieuThueList() {
        return phieuThueList;
    }

    public void setPhieuThueList(List<PhieuThueDTO> phieuThueList) {
        this.phieuThueList = phieuThueList;
    }

    public List<HangPhongDTO> getHangPhongList() {
        return hangPhongList;
    }

    public void setHangPhongList(List<HangPhongDTO> hangPhongList) {
        this.hangPhongList = hangPhongList;
    }

    public List<KieuPhongDTO> getKieuPhongList() {
        return kieuPhongList;
    }

    public void setKieuPhongList(List<KieuPhongDTO> kieuPhongList) {
        this.kieuPhongList = kieuPhongList;
    }

    public List<LoaiPhongDTO> getLoaiPhongList() {
        return loaiPhongList;
    }

    public void setLoaiPhongList(List<LoaiPhongDTO> loaiPhongList) {
        this.loaiPhongList = loaiPhongList;
    }

    public KieuPhongDTO getKieuPhong() {
        return kieuPhong;
    }

    public void setKieuPhong(KieuPhongDTO kieuPhong) {
        this.kieuPhong = kieuPhong;
    }

    public LoaiPhongDTO getLoaiPhong() {
        return loaiPhong;
    }

    public void setLoaiPhong(LoaiPhongDTO loaiPhong) {
        this.loaiPhong = loaiPhong;
    }

    public Object getStats() {
        return stats;
    }

    public void setStats(Object stats) {
        this.stats = stats;
    }

    public Object getActivities() {
        return activities;
    }

    public void setActivities(Object activities) {
        this.activities = activities;
    }

    public Object getTasks() {
        return tasks;
    }

    public void setTasks(Object tasks) {
        this.tasks = tasks;
    }

    // Service and surcharge getters/setters
    public DichVuDTO getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVuDTO dichVu) {
        this.dichVu = dichVu;
    }

    public PhuThuDTO getPhuThu() {
        return phuThu;
    }

    public void setPhuThu(PhuThuDTO phuThu) {
        this.phuThu = phuThu;
    }

    public List<DichVuDTO> getDichVuList() {
        return dichVuList;
    }

    public void setDichVuList(List<DichVuDTO> dichVuList) {
        this.dichVuList = dichVuList;
    }

    public List<PhuThuDTO> getPhuThuList() {
        return phuThuList;
    }

    public void setPhuThuList(List<PhuThuDTO> phuThuList) {
        this.phuThuList = phuThuList;
    }

    public BigDecimal getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(BigDecimal roomPrice) {
        this.roomPrice = roomPrice;
    }

    public BigDecimal getMinDeposit() {
        return minDeposit;
    }

    public void setMinDeposit(BigDecimal minDeposit) {
        this.minDeposit = minDeposit;
    }

    public List<Object> getPriceSegments() {
        return priceSegments;
    }

    public void setPriceSegments(List<Object> priceSegments) {
        this.priceSegments = priceSegments;
    }

    // TrangThai fields
    private TrangThai trangThai;
    private List<TrangThai> trangThaiList;

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public List<TrangThai> getTrangThaiList() {
        return trangThaiList;
    }

    public void setTrangThaiList(List<TrangThai> trangThaiList) {
        this.trangThaiList = trangThaiList;
    }

    public HoaDonDTO getHoaDon() {
        return hoaDon;
    }

    public void setHoaDon(HoaDonDTO hoaDon) {
        this.hoaDon = hoaDon;
    }

    public List<HoaDonDTO> getHoaDonList() {
        return hoaDonList;
    }

    public void setHoaDonList(List<HoaDonDTO> hoaDonList) {
        this.hoaDonList = hoaDonList;
    }

    public HoaDonDetailsDTO getHoaDonDetails() {
        return hoaDonDetails;
    }

    public void setHoaDonDetails(HoaDonDetailsDTO hoaDonDetails) {
        this.hoaDonDetails = hoaDonDetails;
    }

    public PhieuThueDetailsDTO getPhieuThueDetails() {
        return phieuThueDetails;
    }

    public void setPhieuThueDetails(PhieuThueDetailsDTO phieuThueDetails) {
        this.phieuThueDetails = phieuThueDetails;
    }

    public List<AvailableRoomsByHangPhongDTO> getAvailableRoomsByHangPhongList() {
        return availableRoomsByHangPhongList;
    }

    public void setAvailableRoomsByHangPhongList(List<AvailableRoomsByHangPhongDTO> availableRoomsByHangPhongList) {
        this.availableRoomsByHangPhongList = availableRoomsByHangPhongList;
    }

    // Generic data field for reports and other complex data
    private Object data;

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public List<HotHangPhongDTO> getHotHangPhongList() {
        return hotHangPhongList;
    }

    public void setHotHangPhongList(List<HotHangPhongDTO> hotHangPhongList) {
        this.hotHangPhongList = hotHangPhongList;
    }

    public List<GiaPhuThuDTO> getGiaPhuThuList() {
        return giaPhuThuList;
    }

    public void setGiaPhuThuList(List<GiaPhuThuDTO> giaPhuThuList) {
        this.giaPhuThuList = giaPhuThuList;
    }

    public BoPhan getBoPhan() {
        return boPhan;
    }

    public void setBoPhan(BoPhan boPhan) {
        this.boPhan = boPhan;
    }

    public List<BoPhan> getBoPhanList() {
        return boPhanList;
    }

    public void setBoPhanList(List<BoPhan> boPhanList) {
        this.boPhanList = boPhanList;
    }

    public NhomQuyen getNhomQuyen() {
        return nhomQuyen;
    }

    public void setNhomQuyen(NhomQuyen nhomQuyen) {
        this.nhomQuyen = nhomQuyen;
    }

    public List<NhomQuyen> getNhomQuyenList() {
        return nhomQuyenList;
    }

    public void setNhomQuyenList(List<NhomQuyen> nhomQuyenList) {
        this.nhomQuyenList = nhomQuyenList;
    }
}
