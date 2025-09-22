package com.dev.Hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingReportDTO {
    private Integer idPd;
    private LocalDate ngayDat;
    private LocalDate ngayBdThue;
    private LocalDate ngayDi;
    private Integer soNgayO;
    private String trangThaiGoc;
    private BigDecimal soTienCoc;
    private String cccdKhach;
    private String hoTenKhach;
    private String sdtKhach;
    private String emailKhach;
    private String idNvDat;
    private String hoTenNvDat;
    private Integer idPt;
    private LocalDate ngayCheckInThucTe;
    private Integer soPhongDat;
    private String chiTietPhong;
    private BigDecimal tongTienPhong;

    // Constructors
    public BookingReportDTO() {}

    public BookingReportDTO(Integer idPd, LocalDate ngayDat, LocalDate ngayBdThue, LocalDate ngayDi,
                           Integer soNgayO, String trangThaiGoc, BigDecimal soTienCoc, String cccdKhach,
                           String hoTenKhach, String sdtKhach, String emailKhach, String idNvDat,
                           String hoTenNvDat, Integer idPt, LocalDate ngayCheckInThucTe, Integer soPhongDat,
                           String chiTietPhong, BigDecimal tongTienPhong) {
        this.idPd = idPd;
        this.ngayDat = ngayDat;
        this.ngayBdThue = ngayBdThue;
        this.ngayDi = ngayDi;
        this.soNgayO = soNgayO;
        this.trangThaiGoc = trangThaiGoc;
        this.soTienCoc = soTienCoc;
        this.cccdKhach = cccdKhach;
        this.hoTenKhach = hoTenKhach;
        this.sdtKhach = sdtKhach;
        this.emailKhach = emailKhach;
        this.idNvDat = idNvDat;
        this.hoTenNvDat = hoTenNvDat;
        this.idPt = idPt;
        this.ngayCheckInThucTe = ngayCheckInThucTe;
        this.soPhongDat = soPhongDat;
        this.chiTietPhong = chiTietPhong;
        this.tongTienPhong = tongTienPhong;
    }

    // Getters and Setters
    public Integer getIdPd() { return idPd; }
    public void setIdPd(Integer idPd) { this.idPd = idPd; }

    public LocalDate getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDate ngayDat) { this.ngayDat = ngayDat; }

    public LocalDate getNgayBdThue() { return ngayBdThue; }
    public void setNgayBdThue(LocalDate ngayBdThue) { this.ngayBdThue = ngayBdThue; }

    public LocalDate getNgayDi() { return ngayDi; }
    public void setNgayDi(LocalDate ngayDi) { this.ngayDi = ngayDi; }

    public Integer getSoNgayO() { return soNgayO; }
    public void setSoNgayO(Integer soNgayO) { this.soNgayO = soNgayO; }

    public String getTrangThaiGoc() { return trangThaiGoc; }
    public void setTrangThaiGoc(String trangThaiGoc) { this.trangThaiGoc = trangThaiGoc; }

    public BigDecimal getSoTienCoc() { return soTienCoc; }
    public void setSoTienCoc(BigDecimal soTienCoc) { this.soTienCoc = soTienCoc; }

    public String getCccdKhach() { return cccdKhach; }
    public void setCccdKhach(String cccdKhach) { this.cccdKhach = cccdKhach; }

    public String getHoTenKhach() { return hoTenKhach; }
    public void setHoTenKhach(String hoTenKhach) { this.hoTenKhach = hoTenKhach; }

    public String getSdtKhach() { return sdtKhach; }
    public void setSdtKhach(String sdtKhach) { this.sdtKhach = sdtKhach; }

    public String getEmailKhach() { return emailKhach; }
    public void setEmailKhach(String emailKhach) { this.emailKhach = emailKhach; }

    public String getIdNvDat() { return idNvDat; }
    public void setIdNvDat(String idNvDat) { this.idNvDat = idNvDat; }

    public String getHoTenNvDat() { return hoTenNvDat; }
    public void setHoTenNvDat(String hoTenNvDat) { this.hoTenNvDat = hoTenNvDat; }

    public Integer getIdPt() { return idPt; }
    public void setIdPt(Integer idPt) { this.idPt = idPt; }

    public LocalDate getNgayCheckInThucTe() { return ngayCheckInThucTe; }
    public void setNgayCheckInThucTe(LocalDate ngayCheckInThucTe) { this.ngayCheckInThucTe = ngayCheckInThucTe; }

    public Integer getSoPhongDat() { return soPhongDat; }
    public void setSoPhongDat(Integer soPhongDat) { this.soPhongDat = soPhongDat; }

    public String getChiTietPhong() { return chiTietPhong; }
    public void setChiTietPhong(String chiTietPhong) { this.chiTietPhong = chiTietPhong; }

    public BigDecimal getTongTienPhong() { return tongTienPhong; }
    public void setTongTienPhong(BigDecimal tongTienPhong) { this.tongTienPhong = tongTienPhong; }
}
