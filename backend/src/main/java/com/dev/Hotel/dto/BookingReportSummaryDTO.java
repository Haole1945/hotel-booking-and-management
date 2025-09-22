package com.dev.Hotel.dto;

import java.math.BigDecimal;

public class BookingReportSummaryDTO {
    private String loaiBaoCao;
    private Long tongSoPhieu;
    private String tongTienCoc;
    private String tongTienPhong;
    private Long tongSoPhongDat;
    private Double soNgayOTb;

    // Constructors
    public BookingReportSummaryDTO() {}

    public BookingReportSummaryDTO(String loaiBaoCao, Long tongSoPhieu, String tongTienCoc, 
                                  String tongTienPhong, Long tongSoPhongDat, Double soNgayOTb) {
        this.loaiBaoCao = loaiBaoCao;
        this.tongSoPhieu = tongSoPhieu;
        this.tongTienCoc = tongTienCoc;
        this.tongTienPhong = tongTienPhong;
        this.tongSoPhongDat = tongSoPhongDat;
        this.soNgayOTb = soNgayOTb;
    }

    // Getters and Setters
    public String getLoaiBaoCao() { return loaiBaoCao; }
    public void setLoaiBaoCao(String loaiBaoCao) { this.loaiBaoCao = loaiBaoCao; }

    public Long getTongSoPhieu() { return tongSoPhieu; }
    public void setTongSoPhieu(Long tongSoPhieu) { this.tongSoPhieu = tongSoPhieu; }

    public String getTongTienCoc() { return tongTienCoc; }
    public void setTongTienCoc(String tongTienCoc) { this.tongTienCoc = tongTienCoc; }

    public String getTongTienPhong() { return tongTienPhong; }
    public void setTongTienPhong(String tongTienPhong) { this.tongTienPhong = tongTienPhong; }

    public Long getTongSoPhongDat() { return tongSoPhongDat; }
    public void setTongSoPhongDat(Long tongSoPhongDat) { this.tongSoPhongDat = tongSoPhongDat; }

    public Double getSoNgayOTb() { return soNgayOTb; }
    public void setSoNgayOTb(Double soNgayOTb) { this.soNgayOTb = soNgayOTb; }
}
