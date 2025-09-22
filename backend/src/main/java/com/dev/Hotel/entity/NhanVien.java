package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @NotBlank(message = "ID nhân viên không được để trống")
    @Size(max = 10, message = "ID nhân viên không được quá 10 ký tự")
    @Column(name = "ID_NV")
    private String idNv;

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 50, message = "Họ không được quá 50 ký tự")
    @Column(name = "HO")
    private String ho;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 50, message = "Tên không được quá 50 ký tự")
    @Column(name = "TEN")
    private String ten;

    @Pattern(regexp = "^(Nam|Nữ)$", message = "Phái phải là 'Nam' hoặc 'Nữ'")
    @Column(name = "PHAI")
    private String phai;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @Column(name = "NGAY_SINH")
    private LocalDate ngaySinh;

    @Size(max = 200, message = "Địa chỉ không được quá 200 ký tự")
    @Column(name = "DIA_CHI")
    private String diaChi;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    @Column(name = "SDT")
    private String sdt;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được quá 100 ký tự")
    @Column(name = "EMAIL")
    private String email;

    @Size(max = 200, message = "Đường dẫn hình ảnh không được quá 200 ký tự")
    @Column(name = "HINH")
    private String hinh;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    @Column(name = "USERNAME")
    private String username;

    @JsonIgnore
    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    @Column(name = "PASSWORD")
    private String password;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_BP")
    private BoPhan boPhan;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_NQ")
    private NhomQuyen nhomQuyen;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<PhieuDat> danhSachPhieuDat;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<PhieuThue> danhSachPhieuThue;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<HoaDon> danhSachHoaDon;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<GiaHangPhong> danhSachGiaHangPhong;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<GiaDichVu> danhSachGiaDichVu;

    @JsonIgnore
    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<GiaPhuThu> danhSachGiaPhuThu;

    // Manual getters and setters
    public String getIdNv() {
        return idNv;
    }

    public void setIdNv(String idNv) {
        this.idNv = idNv;
    }

    public String getHo() {
        return ho;
    }

    public void setHo(String ho) {
        this.ho = ho;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public LocalDate getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public BoPhan getBoPhan() {
        return boPhan;
    }

    public void setBoPhan(BoPhan boPhan) {
        this.boPhan = boPhan;
    }
}