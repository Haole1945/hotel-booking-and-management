-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: khachsan
-- ------------------------------------------------------
-- Server version	8.0.31
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
--
-- Table structure for table `anh_hang_phong`
--
DROP TABLE IF EXISTS `anh_hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `anh_hang_phong` (
  `ID_ANH_HANG_PHONG` varchar(10) NOT NULL,
  `URL_ANH` varchar(100) DEFAULT NULL,
  `ID_HANG_PHONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_ANH_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `anh_hang_phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `anh_hang_phong`
--
LOCK TABLES `anh_hang_phong` WRITE;
/*!40000 ALTER TABLE `anh_hang_phong` DISABLE KEYS */
;
INSERT INTO `anh_hang_phong`
VALUES ('AHP01', 'https://surl.li/dpgwis', 1),
('AHP02', 'https://surli.cc/kbjjjt', 2),
('AHP03', 'https://surl.li/mzigza', 3),
('AHP04', 'https://surl.li/pfslrj', 4),
('AHP05', 'https://surl.lu/plrgvv', 5);
/*!40000 ALTER TABLE `anh_hang_phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `bo_phan`
--
DROP TABLE IF EXISTS `bo_phan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `bo_phan` (
  `ID_BP` varchar(10) NOT NULL,
  `TENBP` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_BP`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `bo_phan`
--
LOCK TABLES `bo_phan` WRITE;
/*!40000 ALTER TABLE `bo_phan` DISABLE KEYS */
;
INSERT INTO `bo_phan`
VALUES ('BP001', 'Quản lý'),
('BP002', 'Lễ tân'),
('BP003', 'Nhà hàng'),
('BP004', 'Kế toán');
/*!40000 ALTER TABLE `bo_phan` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ct_dich_vu`
--
DROP TABLE IF EXISTS `ct_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ct_dich_vu` (
  `ID_CT_PT` int NOT NULL,
  `ID_DV` varchar(10) NOT NULL,
  `NGAY_SU_DUNG` date DEFAULT NULL,
  `DON_GIA` decimal(10, 2) DEFAULT NULL,
  `SO_LUONG` int DEFAULT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`, `ID_DV`),
  KEY `ct_dich_vu_ibfk_2` (`ID_DV`),
  KEY `idx_ctdv_id_hd` (`ID_HD`),
  CONSTRAINT `ct_dich_vu_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ct_dich_vu_ibfk_2` FOREIGN KEY (`ID_DV`) REFERENCES `dich_vu` (`ID_DV`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctdv_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ct_dich_vu`
--
LOCK TABLES `ct_dich_vu` WRITE;
/*!40000 ALTER TABLE `ct_dich_vu` DISABLE KEYS */
;
INSERT INTO `ct_dich_vu`
VALUES (
    1,
    'DV01',
    '2025-07-30',
    200000.00,
    1,
    'HD01',
    'Chưa thanh toán'
  ),
(
    2,
    'DV02',
    '2025-07-31',
    150000.00,
    2,
    'HD02',
    'Chưa thanh toán'
  ),
(
    4,
    'DV04',
    '2025-07-30',
    10000.00,
    5,
    'HD04',
    'Chưa thanh toán'
  );
/*!40000 ALTER TABLE `ct_dich_vu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ct_phieu_thue`
--
DROP TABLE IF EXISTS `ct_phieu_thue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ct_phieu_thue` (
  `ID_CT_PT` int NOT NULL AUTO_INCREMENT,
  `NGAY_DEN` date DEFAULT NULL,
  `GIO_DEN` time DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  `DON_GIA` decimal(10, 2) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  `ID_PT` int DEFAULT NULL,
  `SO_PHONG` varchar(10) DEFAULT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`),
  KEY `ID_PT` (`ID_PT`),
  KEY `SO_PHONG` (`SO_PHONG`),
  KEY `idx_ctpt_id_hd` (`ID_HD`),
  CONSTRAINT `ct_phieu_thue_ibfk_1` FOREIGN KEY (`ID_PT`) REFERENCES `phieuthue` (`ID_PT`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `ct_phieu_thue_ibfk_2` FOREIGN KEY (`SO_PHONG`) REFERENCES `phong` (`SOPHONG`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_ctpt_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ct_phieu_thue`
--
LOCK TABLES `ct_phieu_thue` WRITE;
/*!40000 ALTER TABLE `ct_phieu_thue` DISABLE KEYS */
;
INSERT INTO `ct_phieu_thue`
VALUES (
    1,
    '2025-07-30',
    '14:00:00',
    '2025-08-01',
    1000000.00,
    'Đã thanh toán',
    1,
    NULL,
    'HD01'
  ),
(
    2,
    '2025-08-06',
    '15:00:00',
    '2025-08-10',
    2000000.00,
    'Chưa thanh toán',
    2,
    '307',
    'HD02'
  ),
(
    4,
    '2025-08-07',
    '16:00:00',
    '2025-08-11',
    2000000.00,
    'Chưa thanh toán',
    4,
    '308',
    'HD04'
  ),
(
    6,
    '2025-08-06',
    '15:00:00',
    '2025-08-10',
    2000000.00,
    'Chưa thanh toán',
    6,
    '309',
    NULL
  ),
(
    7,
    '2025-08-06',
    '15:00:00',
    '2025-08-10',
    2000000.00,
    'Chưa thanh toán',
    7,
    '306',
    NULL
  ),
(
    8,
    '2025-08-08',
    '15:30:00',
    '2025-08-14',
    2000000.00,
    'Chưa thanh toán',
    8,
    '305',
    NULL
  );
/*!40000 ALTER TABLE `ct_phieu_thue` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ct_phu_thu`
--
DROP TABLE IF EXISTS `ct_phu_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ct_phu_thu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `ID_CT_PT` int NOT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  `DON_GIA` decimal(10, 2) DEFAULT NULL,
  `SO_LUONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`, `ID_CT_PT`),
  KEY `ct_phu_thu_ibfk_2` (`ID_CT_PT`),
  KEY `idx_ctptt_id_hd` (`ID_HD`),
  CONSTRAINT `ct_phu_thu_ibfk_1` FOREIGN KEY (`ID_PHU_THU`) REFERENCES `phu_thu` (`ID_PHU_THU`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ct_phu_thu_ibfk_2` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctphuthu_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ct_phu_thu`
--
LOCK TABLES `ct_phu_thu` WRITE;
/*!40000 ALTER TABLE `ct_phu_thu` DISABLE KEYS */
;
INSERT INTO `ct_phu_thu`
VALUES ('PT01', 1, 'HD01', 'Chưa thanh toán', 200000.00, 1),
('PT02', 2, 'HD02', 'Chưa thanh toán', 300000.00, 1),
('PT04', 4, 'HD04', 'Chưa thanh toán', 150000.00, 1);
/*!40000 ALTER TABLE `ct_phu_thu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ctkhacho`
--
DROP TABLE IF EXISTS `ctkhacho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ctkhacho` (
  `ID_CT_PT` int NOT NULL,
  `CCCD` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_CT_PT`, `CCCD`),
  KEY `CMND` (`CCCD`),
  CONSTRAINT `ctkhacho_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctkhacho_ibfk_2` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ctkhacho`
--
LOCK TABLES `ctkhacho` WRITE;
/*!40000 ALTER TABLE `ctkhacho` DISABLE KEYS */
;
INSERT INTO `ctkhacho`
VALUES (1, '123456789001'),
(2, '123456789002'),
(4, '123456789004');
/*!40000 ALTER TABLE `ctkhacho` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ctkhuyenmai`
--
DROP TABLE IF EXISTS `ctkhuyenmai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ctkhuyenmai` (
  `ID_KM` varchar(10) NOT NULL,
  `ID_HANGPHONG` int NOT NULL,
  `PHAN_TRAM_GIAM` decimal(5, 2) DEFAULT NULL,
  PRIMARY KEY (`ID_KM`, `ID_HANGPHONG`),
  KEY `ID_HANGPHONG` (`ID_HANGPHONG`),
  CONSTRAINT `ctkhuyenmai_ibfk_1` FOREIGN KEY (`ID_KM`) REFERENCES `khuyenmai` (`ID_KM`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctkhuyenmai_ibfk_2` FOREIGN KEY (`ID_HANGPHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ctkhuyenmai`
--
LOCK TABLES `ctkhuyenmai` WRITE;
/*!40000 ALTER TABLE `ctkhuyenmai` DISABLE KEYS */
;
INSERT INTO `ctkhuyenmai`
VALUES ('KM01', 1, 10.00),
('KM02', 2, 15.00),
('KM03', 3, 20.00),
('KM04', 4, 25.00),
('KM05', 5, 30.00);
/*!40000 ALTER TABLE `ctkhuyenmai` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `ctphieudat`
--
DROP TABLE IF EXISTS `ctphieudat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `ctphieudat` (
  `ID_PD` int NOT NULL,
  `ID_HANG_PHONG` int NOT NULL,
  `SO_LUONG_PHONG_O` int DEFAULT NULL,
  `DON_GIA` decimal(10, 2) DEFAULT NULL,
  PRIMARY KEY (`ID_PD`, `ID_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `ctphieudat_ibfk_1` FOREIGN KEY (`ID_PD`) REFERENCES `phieudat` (`ID_PD`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctphieudat_ibfk_2` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `ctphieudat`
--
LOCK TABLES `ctphieudat` WRITE;
/*!40000 ALTER TABLE `ctphieudat` DISABLE KEYS */
;
INSERT INTO `ctphieudat`
VALUES (1, 1, 1, 1000000.00),
(3, 3, 2, 2000000.00),
(3, 4, 1, 3000000.00),
(5, 3, 1, 3000000.00),
(9, 1, 2, 2000000.00),
(10, 3, 2, 4400000.00),
(11, 3, 2, 4400000.00);
/*!40000 ALTER TABLE `ctphieudat` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `cttiennghi`
--
DROP TABLE IF EXISTS `cttiennghi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `cttiennghi` (
  `ID_TN` varchar(10) NOT NULL,
  `ID_HANG_PHONG` int NOT NULL,
  `SO_LUONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_TN`, `ID_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `cttiennghi_ibfk_1` FOREIGN KEY (`ID_TN`) REFERENCES `tiennghi` (`ID_TN`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cttiennghi_ibfk_2` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `cttiennghi`
--
LOCK TABLES `cttiennghi` WRITE;
/*!40000 ALTER TABLE `cttiennghi` DISABLE KEYS */
;
INSERT INTO `cttiennghi`
VALUES ('TN06', 1, 1),
('TN07', 2, 1),
('TN07', 4, 1),
('TN08', 3, 1),
('TN08', 5, 1),
('TN09', 2, 1),
('TN09', 4, 1),
('TN10', 3, 1),
('TN11', 3, 1),
('TN11', 4, 1),
('TN12', 3, 1),
('TN13', 3, 1),
('TN13', 4, 1),
('TN13', 5, 1),
('TN14', 3, 1),
('TN14', 5, 1),
('TN15', 2, 1),
('TN15', 4, 1),
('TN16', 2, 1),
('TN16', 4, 1),
('TN17', 3, 1),
('TN17', 5, 1),
('TN18', 5, 1),
('TN19', 5, 1),
('TN20', 5, 1),
('TN22', 5, 1),
('TN23', 1, 1);
/*!40000 ALTER TABLE `cttiennghi` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `dich_vu`
--
DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `dich_vu` (
  `ID_DV` varchar(10) NOT NULL,
  `TEN_DV` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  `DON_VI_TINH` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_DV`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `dich_vu`
--
LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */
;
INSERT INTO `dich_vu`
VALUES ('DV01', 'Minibar', 'Drinks and snacks', 'Lần'),
('DV02', 'Giặt ủi', 'Laundry service', 'Kg'),
('DV03', 'Ẩm thực', 'Restaurant meal', 'Bữa'),
('DV04', 'Điện thoại', 'Phone call service', 'Phút'),
('DV05', 'Gửi fax', 'Fax service', 'Trang');
/*!40000 ALTER TABLE `dich_vu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `doiphong`
--
DROP TABLE IF EXISTS `doiphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `doiphong` (
  `ID_CT_PT` int NOT NULL,
  `SOPHONGMOI` varchar(10) NOT NULL,
  `NGAY_DEN` date DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`, `SOPHONGMOI`),
  KEY `SOPHONGMOI` (`SOPHONGMOI`),
  CONSTRAINT `doiphong_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doiphong_ibfk_2` FOREIGN KEY (`SOPHONGMOI`) REFERENCES `phong` (`SOPHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `doiphong`
--
LOCK TABLES `doiphong` WRITE;
/*!40000 ALTER TABLE `doiphong` DISABLE KEYS */
;
INSERT INTO `doiphong`
VALUES (1, '102', '2025-07-31', '2025-08-01'),
(2, '203', '2025-08-01', '2025-08-02'),
(4, '405', '2025-07-31', '2025-08-01');
/*!40000 ALTER TABLE `doiphong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `gia_dich_vu`
--
DROP TABLE IF EXISTS `gia_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `gia_dich_vu` (
  `ID_DV` varchar(10) NOT NULL,
  `NGAY_AP_DUNG` date NOT NULL,
  `GIA` decimal(10, 2) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_DV`, `NGAY_AP_DUNG`),
  KEY `ID_DV` (`ID_DV`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `gia_dich_vu_ibfk_1` FOREIGN KEY (`ID_DV`) REFERENCES `dich_vu` (`ID_DV`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gia_dich_vu_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `gia_dich_vu`
--
LOCK TABLES `gia_dich_vu` WRITE;
/*!40000 ALTER TABLE `gia_dich_vu` DISABLE KEYS */
;
INSERT INTO `gia_dich_vu`
VALUES ('DV01', '2025-07-30', 200000.00, 'NV01'),
('DV02', '2025-07-30', 150000.00, 'NV01'),
('DV03', '2025-07-30', 500000.00, 'NV01'),
('DV04', '2025-07-30', 10000.00, 'NV01'),
('DV05', '2025-07-30', 50000.00, 'NV01');
/*!40000 ALTER TABLE `gia_dich_vu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `gia_hang_phong`
--
DROP TABLE IF EXISTS `gia_hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `gia_hang_phong` (
  `ID_HANG_PHONG` int NOT NULL,
  `NGAYAPDUNG` date NOT NULL,
  `GIA` decimal(10, 2) DEFAULT NULL,
  `NGAY_THIET_LAP` date DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_HANG_PHONG`, `NGAYAPDUNG`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `gia_hang_phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gia_hang_phong_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `gia_hang_phong`
--
LOCK TABLES `gia_hang_phong` WRITE;
/*!40000 ALTER TABLE `gia_hang_phong` DISABLE KEYS */
;
INSERT INTO `gia_hang_phong`
VALUES (1, '2025-07-30', 1000000.00, '2025-07-29', 'NV01'),
(1, '2025-08-12', 1100000.00, '2025-08-10', 'NV01'),
(2, '2025-07-30', 1500000.00, '2025-07-29', 'NV01'),
(3, '2025-07-30', 2000000.00, '2025-07-29', 'NV01'),
(3, '2025-08-01', 2200000.00, '2025-07-31', 'NV01'),
(4, '2025-07-30', 2500000.00, '2025-07-29', 'NV01'),
(4, '2025-08-02', 2700000.00, '2025-08-02', 'NV01'),
(5, '2025-07-30', 3000000.00, '2025-07-29', 'NV01');
/*!40000 ALTER TABLE `gia_hang_phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `giaphuthu`
--
DROP TABLE IF EXISTS `giaphuthu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `giaphuthu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `NGAY_AP_DUNG` date NOT NULL,
  `GIA` decimal(10, 2) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`, `NGAY_AP_DUNG`),
  KEY `ID_PHU_THU` (`ID_PHU_THU`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `giaphuthu_ibfk_1` FOREIGN KEY (`ID_PHU_THU`) REFERENCES `phu_thu` (`ID_PHU_THU`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `giaphuthu_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `giaphuthu`
--
LOCK TABLES `giaphuthu` WRITE;
/*!40000 ALTER TABLE `giaphuthu` DISABLE KEYS */
;
INSERT INTO `giaphuthu`
VALUES ('PT01', '2025-07-30', 200000.00, 'NV01'),
('PT02', '2025-07-30', 300000.00, 'NV01'),
('PT03', '2025-07-30', 500000.00, 'NV01'),
('PT04', '2025-07-30', 150000.00, 'NV01'),
('PT05', '2025-07-30', 100000.00, 'NV01');
/*!40000 ALTER TABLE `giaphuthu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `hang_phong`
--
DROP TABLE IF EXISTS `hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hang_phong` (
  `ID_HANG_PHONG` int NOT NULL AUTO_INCREMENT,
  `ID_KP` varchar(10) DEFAULT NULL,
  `ID_LP` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_HANG_PHONG`),
  KEY `ID_KP` (`ID_KP`),
  KEY `ID_LP` (`ID_LP`),
  CONSTRAINT `hang_phong_ibfk_1` FOREIGN KEY (`ID_KP`) REFERENCES `kieu_phong` (`ID_KP`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `hang_phong_ibfk_2` FOREIGN KEY (`ID_LP`) REFERENCES `loai_phong` (`ID_LP`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `hang_phong`
--
LOCK TABLES `hang_phong` WRITE;
/*!40000 ALTER TABLE `hang_phong` DISABLE KEYS */
;
INSERT INTO `hang_phong`
VALUES (1, 'KP01', 'LP01'),
(2, 'KP02', 'LP02'),
(3, 'KP03', 'LP03'),
(4, 'KP04', 'LP04'),
(5, 'KP05', 'LP05');
/*!40000 ALTER TABLE `hang_phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `hoa_don`
--
DROP TABLE IF EXISTS `hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hoa_don` (
  `ID_HD` varchar(10) NOT NULL,
  `NGAY_LAP` date DEFAULT NULL,
  `TONG_TIEN` decimal(12, 2) DEFAULT NULL,
  `TRANG_THAI` varchar(20) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  `ID_PT` int DEFAULT NULL,
  PRIMARY KEY (`ID_HD`),
  KEY `ID_NV` (`ID_NV`),
  KEY `ID_PT` (`ID_PT`),
  CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `hoa_don_ibfk_2` FOREIGN KEY (`ID_PT`) REFERENCES `phieuthue` (`ID_PT`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `hoa_don`
--
LOCK TABLES `hoa_don` WRITE;
/*!40000 ALTER TABLE `hoa_don` DISABLE KEYS */
;
INSERT INTO `hoa_don`
VALUES (
    'HD01',
    '2025-07-30',
    1200000.00,
    'Chưa thanh toán',
    'NV01',
    1
  ),
(
    'HD02',
    '2025-07-31',
    1800000.00,
    'Chưa thanh toán',
    'NV01',
    2
  ),
(
    'HD03',
    '2025-07-30',
    2500000.00,
    'Đã thanh toán',
    'NV01',
    NULL
  ),
(
    'HD04',
    '2025-07-30',
    2650000.00,
    'Chưa thanh toán',
    'NV01',
    4
  ),
(
    'HD05',
    '2025-08-02',
    3100000.00,
    'Chưa thanh toán',
    'NV01',
    NULL
  );
/*!40000 ALTER TABLE `hoa_don` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `khach_hang`
--
DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `khach_hang` (
  `CCCD` varchar(20) NOT NULL,
  `HO` varchar(50) DEFAULT NULL,
  `TEN` varchar(10) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `DIA_CHI` varchar(100) DEFAULT NULL,
  `MA_SO_THUE` varchar(20) DEFAULT NULL,
  `MAT_KHAU` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CCCD`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `khach_hang`
--
LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */
;
INSERT INTO `khach_hang`
VALUES (
    '123456789001',
    'Lee',
    'Hao',
    '0912345671',
    'haole@gmail.com',
    '50 Ba Trieu, Hanoi',
    'MST001',
    '$2a$10$CxznmpAHm5ujXsLa.a3NHOM7spGDhXfM6s9lHoNpwHsAsC.ZGdlEC'
  ),
(
    '123456789002',
    'Tran',
    'Lan',
    '0912345672',
    'lan.tran@gmail.com',
    '60 Ly Thuong Kiet, HCM',
    'MST002',
    'kh456'
  ),
(
    '123456789003',
    'Le',
    'Minh',
    '0912345673',
    'minh.le@gmail.com',
    '70 Nguyen Du, Hanoi',
    'MST003',
    'kh789'
  ),
(
    '123456789004',
    'Pham',
    'Ngoc',
    '0912345674',
    'ngoc.pham@gmail.com',
    '80 Vo Thi Sau, HCM',
    'MST004',
    'kh101'
  ),
(
    '123456789005',
    'Ho',
    'Quynh',
    '0912345675',
    'quynh.ho@gmail.com',
    '90 Tran Phu, Hanoi',
    'MST005',
    'kh202'
  );
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `khuyenmai`
--
DROP TABLE IF EXISTS `khuyenmai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `khuyenmai` (
  `ID_KM` varchar(10) NOT NULL,
  `MO_TA_KM` varchar(100) DEFAULT NULL,
  `NGAY_BAT_DAU` date DEFAULT NULL,
  `NGAY_KET_THUC` date DEFAULT NULL,
  PRIMARY KEY (`ID_KM`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `khuyenmai`
--
LOCK TABLES `khuyenmai` WRITE;
/*!40000 ALTER TABLE `khuyenmai` DISABLE KEYS */
;
INSERT INTO `khuyenmai`
VALUES (
    'KM01',
    'Summer Discount 10%',
    '2025-07-01',
    '2025-08-31'
  ),
(
    'KM02',
    'Family Package 15%',
    '2025-07-15',
    '2025-08-15'
  ),
('KM03', 'VIP Offer 20%', '2025-07-30', '2025-08-30'),
(
    'KM04',
    'Early Bird 25%',
    '2025-07-01',
    '2025-07-31'
  ),
('KM05', 'Long Stay 30%', '2025-08-01', '2025-08-31');
/*!40000 ALTER TABLE `khuyenmai` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `kieu_phong`
--
DROP TABLE IF EXISTS `kieu_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `kieu_phong` (
  `ID_KP` varchar(10) NOT NULL,
  `TEN_KP` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  `SO_LUONG_KHACH` int DEFAULT NULL,
  PRIMARY KEY (`ID_KP`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `kieu_phong`
--
LOCK TABLES `kieu_phong` WRITE;
/*!40000 ALTER TABLE `kieu_phong` DISABLE KEYS */
;
INSERT INTO `kieu_phong`
VALUES ('KP01', 'Single', 'One single bed', 1),
('KP02', 'Double', 'One double bed', 2),
('KP03', 'Twin', 'Two single beds', 2),
(
    'KP04',
    'Family',
    'One double and one single bed',
    3
  ),
('KP05', 'Suite', 'Luxury suite with king bed', 4);
/*!40000 ALTER TABLE `kieu_phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `loai_phong`
--
DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `loai_phong` (
  `ID_LP` varchar(10) NOT NULL,
  `TEN_LP` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_LP`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `loai_phong`
--
LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */
;
INSERT INTO `loai_phong`
VALUES ('LP01', 'Standard', 'Basic amenities'),
('LP02', 'Superior', 'Enhanced amenities with view'),
('LP03', 'VIP', 'Premium amenities and services'),
('LP04', 'Deluxe', 'Spacious with luxury features'),
(
    'LP05',
    'Executive',
    'Business-oriented with workspace'
  );
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `nhan_vien`
--
DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `nhan_vien` (
  `ID_NV` varchar(10) NOT NULL,
  `HO` varchar(50) DEFAULT NULL,
  `TEN` varchar(10) DEFAULT NULL,
  `PHAI` varchar(10) DEFAULT NULL,
  `NGAY_SINH` date DEFAULT NULL,
  `DIA_CHI` varchar(100) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `HINH` varchar(100) DEFAULT NULL,
  `USERNAME` varchar(50) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `ID_BP` varchar(10) DEFAULT NULL,
  `ID_NQ` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_NV`),
  KEY `ID_BP` (`ID_BP`),
  KEY `idx_nhan_vien_id_nq` (`ID_NQ`),
  CONSTRAINT `fk_nhan_vien_id_nq` FOREIGN KEY (`ID_NQ`) REFERENCES `nhom_quyen` (`ID_NQ`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`ID_BP`) REFERENCES `bo_phan` (`ID_BP`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `nhan_vien`
--
LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */
;
INSERT INTO `nhan_vien`
VALUES (
    'NV01',
    'Nguyen',
    'An',
    'Nam',
    '1990-05-15',
    '123 Le Loi, HCM',
    '0901234561',
    'an.nguyen@hotel.com',
    '/images/an.jpg',
    'admin',
    '$2a$12$fl0BAqKGZYvshyjlKsRGYeQ9SJqKIwpfjjgrmwD0hk1PUzKhfAjt2',
    'BP001',
    'NQ02'
  ),
(
    'NV02',
    'Tran',
    'Binh',
    'Nu',
    '1992-08-20',
    '456 Tran Hung Dao, HCM',
    '0901234562',
    'binh.tran@hotel.com',
    '/images/binh.jpg',
    'binhtran',
    'pass456',
    'BP002',
    'NQ03'
  ),
(
    'NV03',
    'Le',
    'Cuc',
    'Nu',
    '1988-03-10',
    '789 Nguyen Trai, HCM',
    '0901234563',
    'cuc.le@hotel.com',
    '/images/cuc.jpg',
    'cule',
    'pass789',
    'BP003',
    'NQ04'
  ),
(
    'NV04',
    'Pham',
    'Dung',
    'Nam',
    '1995-11-25',
    '101 Vo Van Tan, HCM',
    '0901234564',
    'dung.pham@hotel.com',
    '/images/dung.jpg',
    'dungpham',
    'pass101',
    'BP004',
    'NQ05'
  ),
(
    'NV05',
    'Le',
    'Tan',
    'Nam',
    '2003-10-16',
    '97 Man Thiên',
    '0123456788',
    'letan@gmail.com',
    NULL,
    'letan',
    '$2a$10$QJHrHRiFu33hiNBxG8H7M.P85SK/sKjMEUtIJQgsCqO/2123Kv0ZG',
    'BP002',
    'NQ02'
  );
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `nhom_quyen`
--
DROP TABLE IF EXISTS `nhom_quyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `nhom_quyen` (
  `ID_NQ` varchar(10) NOT NULL,
  `TEN_NQ` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_NQ`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `nhom_quyen`
--
LOCK TABLES `nhom_quyen` WRITE;
/*!40000 ALTER TABLE `nhom_quyen` DISABLE KEYS */
;
INSERT INTO `nhom_quyen`
VALUES ('NQ01', 'Admin'),
('NQ02', 'Receptionist'),
('NQ03', 'Housekeeping'),
('NQ04', 'Restaurant'),
('NQ05', 'Accounting');
/*!40000 ALTER TABLE `nhom_quyen` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `phieudat`
--
DROP TABLE IF EXISTS `phieudat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `phieudat` (
  `ID_PD` int NOT NULL AUTO_INCREMENT,
  `NGAY_DAT` date DEFAULT NULL,
  `NGAY_BD_THUE` date DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  `TRANG_THAI` varchar(20) DEFAULT NULL,
  `SO_TIEN_COC` decimal(10, 2) DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_PD`),
  KEY `CMND` (`CCCD`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `phieudat_ibfk_1` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `phieudat_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `phieudat`
--
LOCK TABLES `phieudat` WRITE;
/*!40000 ALTER TABLE `phieudat` DISABLE KEYS */
;
INSERT INTO `phieudat`
VALUES (
    1,
    '2025-07-28',
    '2025-07-30',
    '2025-08-01',
    'Xác nhận',
    500000.00,
    '123456789001',
    'NV01'
  ),
(
    3,
    '2025-07-30',
    '2025-08-13',
    '2025-08-15',
    'Xác nhận',
    700000.00,
    '123456789003',
    'NV01'
  ),
(
    5,
    '2025-07-31',
    '2025-08-14',
    '2025-08-17',
    'Xác nhận',
    900000.00,
    '123456789005',
    'NV01'
  ),
(
    9,
    '2025-08-02',
    '2025-08-07',
    '2025-08-08',
    'Chờ xác nhận',
    400000.00,
    '123456789001',
    NULL
  ),
(
    10,
    '2025-08-02',
    '2025-08-07',
    '2025-08-08',
    'Chờ xác nhận',
    880000.00,
    '123456789001',
    NULL
  ),
(
    11,
    '2025-08-02',
    '2025-08-07',
    '2025-08-08',
    'Chờ xác nhận',
    880000.00,
    '123456789001',
    NULL
  );
/*!40000 ALTER TABLE `phieudat` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `phieuthue`
--
DROP TABLE IF EXISTS `phieuthue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `phieuthue` (
  `ID_PT` int NOT NULL AUTO_INCREMENT,
  `NGAY_LAP` date DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `ID_PD` int DEFAULT NULL,
  PRIMARY KEY (`ID_PT`),
  UNIQUE KEY `uq_phieuthue_id_pd` (`ID_PD`),
  KEY `ID_NV` (`ID_NV`),
  KEY `CMND` (`CCCD`),
  CONSTRAINT `phieuthue_ibfk_1` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `phieuthue_ibfk_2` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `phieuthue_ibfk_3` FOREIGN KEY (`ID_PD`) REFERENCES `phieudat` (`ID_PD`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `phieuthue`
--
LOCK TABLES `phieuthue` WRITE;
/*!40000 ALTER TABLE `phieuthue` DISABLE KEYS */
;
INSERT INTO `phieuthue`
VALUES (1, '2025-07-30', 'NV01', '123456789001', 1),
(2, '2025-07-30', 'NV01', '123456789002', NULL),
(4, '2025-07-31', 'NV01', '123456789004', NULL),
(6, '2025-07-30', 'NV01', '123456789002', NULL),
(7, '2025-07-30', 'NV01', '123456789002', NULL),
(8, '2025-08-01', 'NV01', '123456789003', NULL);
/*!40000 ALTER TABLE `phieuthue` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `phong`
--
DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `phong` (
  `SOPHONG` varchar(10) NOT NULL,
  `TANG` int DEFAULT NULL,
  `ID_HANG_PHONG` int DEFAULT NULL,
  `ID_TT` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`SOPHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  KEY `ID_TT` (`ID_TT`),
  CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE
  SET NULL ON UPDATE CASCADE,
    CONSTRAINT `phong_ibfk_2` FOREIGN KEY (`ID_TT`) REFERENCES `trangthai` (`ID_TT`) ON DELETE
  SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `phong`
--
LOCK TABLES `phong` WRITE;
/*!40000 ALTER TABLE `phong` DISABLE KEYS */
;
INSERT INTO `phong`
VALUES ('101', 1, 1, 'TT001'),
('102', 1, 1, 'TT001'),
('202', 2, 2, 'TT004'),
('203', 2, 2, 'TT001'),
('301', 3, 3, 'TT001'),
('302', 3, 3, 'TT001'),
('303', 3, 3, 'TT001'),
('304', 3, 3, 'TT001'),
('305', 3, 3, 'TT002'),
('306', 3, 3, 'TT002'),
('307', 3, 3, 'TT002'),
('308', 3, 3, 'TT002'),
('309', 3, 3, 'TT002'),
('310', 3, 3, 'TT001'),
('404', 4, 4, 'TT001'),
('405', 4, 4, 'TT001'),
('505', 5, 5, 'TT005'),
('506', 5, 5, 'TT001');
/*!40000 ALTER TABLE `phong` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `phu_thu`
--
DROP TABLE IF EXISTS `phu_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `phu_thu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `TEN_PHU_THU` varchar(50) DEFAULT NULL,
  `LY_DO` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `phu_thu`
--
LOCK TABLES `phu_thu` WRITE;
/*!40000 ALTER TABLE `phu_thu` DISABLE KEYS */
;
INSERT INTO `phu_thu`
VALUES ('PT01', 'Late Check-out', 'Check-out after 12:00'),
('PT02', 'Extra Guest', 'Additional guest in room'),
('PT03', 'Room Damage', 'Damage to room property'),
('PT04', 'Extra bed', 'Extra bed in room'),
(
    'PT05',
    'Special Request',
    'Custom service request'
  );
/*!40000 ALTER TABLE `phu_thu` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `quan_ly`
--
DROP TABLE IF EXISTS `quan_ly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `quan_ly` (
  `ID_BP` varchar(10) NOT NULL,
  `NGAYBDQL` date DEFAULT NULL,
  `MANV` varchar(10) NOT NULL,
  PRIMARY KEY (`ID_BP`, `MANV`),
  KEY `MANV` (`MANV`),
  CONSTRAINT `quan_ly_ibfk_1` FOREIGN KEY (`ID_BP`) REFERENCES `bo_phan` (`ID_BP`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quan_ly_ibfk_2` FOREIGN KEY (`MANV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `quan_ly`
--
LOCK TABLES `quan_ly` WRITE;
/*!40000 ALTER TABLE `quan_ly` DISABLE KEYS */
;
INSERT INTO `quan_ly`
VALUES ('BP001', '2025-02-01', 'NV01'),
('BP002', '2025-03-01', 'NV02'),
('BP003', '2025-04-01', 'NV03'),
('BP004', '2025-05-01', 'NV04');
/*!40000 ALTER TABLE `quan_ly` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `tiennghi`
--
DROP TABLE IF EXISTS `tiennghi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tiennghi` (
  `ID_TN` varchar(10) NOT NULL,
  `TEN_TN` varchar(50) DEFAULT NULL,
  `ICON` longblob,
  `MO_TA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_TN`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `tiennghi`
--
LOCK TABLES `tiennghi` WRITE;
/*!40000 ALTER TABLE `tiennghi` DISABLE KEYS */
;
INSERT INTO `tiennghi`
VALUES (
    'TN01',
    'Wi-Fi',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.859a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/></svg>',
    'High-speed internet'
  ),
(
    'TN02',
    'TV',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17,2 12,7 7,2\"/></svg>',
    'Smart TV with streaming'
  ),
(
    'TN03',
    'Air Conditioner',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2\"/><path d=\"M9.6 4.6A2 2 0 1 1 11 8H2\"/><path d=\"M12.6 19.4A2 2 0 1 0 14 16H2\"/></svg>',
    'Climate control'
  ),
(
    'TN04',
    'Mini Fridge',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\"/><path d=\"M5 10h14\"/><path d=\"M15 7v6\"/></svg>',
    'Mini fridge with drinks'
  ),
(
    'TN06',
    'TV 32 inch',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17,2 12,7 7,2\"/></svg>',
    'TV 32 inch'
  ),
(
    'TN07',
    'TV 42 inch',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17,2 12,7 7,2\"/></svg>',
    'TV 42 inch'
  ),
(
    'TN08',
    'TV 50 inch',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17,2 12,7 7,2\"/></svg>',
    'TV 50 inch'
  ),
(
    'TN09',
    'Sofa đơn',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M12 4v9\"/></svg>',
    'Single sofa'
  ),
(
    'TN10',
    'Sofa đôi',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M8 4v9\"/><path d=\"M16 4v9\"/></svg>',
    'Double sofa'
  ),
(
    'TN11',
    'Bồn tắm nằm',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12h20\"/><path d=\"M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6\"/><path d=\"M4 8V6a2 2 0 0 1 2-2h2\"/><path d=\"M4 22v-2\"/><path d=\"M20 22v-2\"/></svg>',
    'Bathtub'
  ),
(
    'TN12',
    'Vòi sen tách biệt',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4h16v16H4z\"/><path d=\"M8 8v8\"/><path d=\"M12 8v8\"/><path d=\"M16 8v8\"/><circle cx=\"8\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"16\" cy=\"12\" r=\"1\"/></svg>',
    'Separate shower'
  ),
(
    'TN13',
    'Ban công riêng',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\"/><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\"/><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\"/><path d=\"M10 6h4\"/><path d=\"M10 10h4\"/><path d=\"M10 14h4\"/><path d=\"M10 18h4\"/></svg>',
    'Private balcony'
  ),
(
    'TN14',
    'Máy pha cà phê',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 2v20\"/><path d=\"M14 2v20\"/><path d=\"M5 8h14\"/><path d=\"M19 8v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8\"/><path d=\"M22 8h-3\"/></svg>',
    'Coffee machine'
  ),
(
    'TN15',
    'Bộ ấm trà/cafe',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 8h1a4 4 0 1 1 0 8h-1\"/><path d=\"M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z\"/><line x1=\"6\" x2=\"6\" y1=\"2\" y2=\"4\"/><line x1=\"10\" x2=\"10\" y1=\"2\" y2=\"4\"/><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"4\"/></svg>',
    'Kettle & tea/coffee set'
  ),
(
    'TN16',
    'View thành phố/hồ bơi',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/><path d=\"M17 18h1\"/><path d=\"M12 18h1\"/><path d=\"M7 18h1\"/></svg>',
    'City/Pool view'
  ),
(
    'TN17',
    'Phòng khách riêng',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg>',
    'Separate living room'
  ),
(
    'TN18',
    'Bồn tắm jacuzzi',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/></svg>',
    'Jacuzzi'
  ),
(
    'TN19',
    'Quầy bar mini',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\"/><path d=\"M5 10h14\"/><path d=\"M15 7v6\"/><circle cx=\"12\" cy=\"16\" r=\"2\"/></svg>',
    'Mini bar'
  ),
(
    'TN20',
    'Loa Bluetooth',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"11 5,6 9,2 9,2 15,6 15,11 19,11 5\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14\"/></svg>',
    'Bluetooth speaker'
  ),
(
    'TN22',
    'Phòng ăn riêng',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12h18l-2 9H5l-2-9Z\"/><path d=\"M3 5h18\"/><path d=\"M3 8h18\"/></svg>',
    'Private dining room'
  ),
(
    'TN23',
    'Bàn làm việc nhỏ',
    _binary '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"/><path d=\"M15 5l3 3\"/></svg>',
    'Compact work desk'
  );
/*!40000 ALTER TABLE `tiennghi` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `trangthai`
--
DROP TABLE IF EXISTS `trangthai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `trangthai` (
  `ID_TT` varchar(10) NOT NULL,
  `TEN_TRANG_THAI` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_TT`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `trangthai`
--
LOCK TABLES `trangthai` WRITE;
/*!40000 ALTER TABLE `trangthai` DISABLE KEYS */
;
INSERT INTO `trangthai`
VALUES ('TT001', 'Trống'),
('TT002', 'Đã có khách'),
('TT003', 'Đang dọn dẹp'),
('TT004', 'Đang bảo trì'),
('TT005', 'Đã đặt');
/*!40000 ALTER TABLE `trangthai` ENABLE KEYS */
;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;
-- Dump completed on 2025-08-14 21:47:14
-- Stored Procedure: GetAvailableRoomsByHangPhong (Updated)
-- Trừ các phòng đang dọn dẹp, đang bảo trì, và đã đặt
DELIMITER $$ CREATE DEFINER = `root` @`localhost` PROCEDURE `GetAvailableRoomsByHangPhong`(
  IN p_ngay_den DATE,
  IN p_ngay_di DATE
) BEGIN
SELECT hp.ID_HANG_PHONG,
  kp.TEN_KP AS TEN_KIEU_PHONG,
  lp.TEN_LP AS TEN_LOAI_PHONG,
  COUNT(p.SOPHONG) AS TONG_SO_PHONG,
  (
    COUNT(p.SOPHONG) - COALESCE(occupied.SO_PHONG_CHIEM, 0) - COALESCE(unavailable.SO_PHONG_KHONG_KHADUNG, 0)
  ) AS SO_PHONG_TRONG
FROM hang_phong hp
  LEFT JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
  LEFT JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
  LEFT JOIN phong p ON hp.ID_HANG_PHONG = p.ID_HANG_PHONG
  LEFT JOIN (
    SELECT hp_sub.ID_HANG_PHONG,
      SUM(phong_chiem) AS SO_PHONG_CHIEM
    FROM hang_phong hp_sub
      LEFT JOIN (
        SELECT ctpd.ID_HANG_PHONG,
          SUM(ctpd.SO_LUONG_PHONG_O) AS phong_chiem
        FROM phieudat pd
          INNER JOIN ctphieudat ctpd ON pd.ID_PD = ctpd.ID_PD
        WHERE pd.TRANG_THAI = 'Xác nhận'
          AND pd.NGAY_BD_THUE < p_ngay_di
          AND pd.NGAY_DI > p_ngay_den
        GROUP BY ctpd.ID_HANG_PHONG
        UNION ALL
        SELECT p_thue.ID_HANG_PHONG,
          COUNT(*) AS phong_chiem
        FROM ct_phieu_thue ctpt
          INNER JOIN phong p_thue ON ctpt.SO_PHONG = p_thue.SOPHONG
        WHERE ctpt.TT_THANH_TOAN = 'Chưa Thanh Toán'
          AND ctpt.NGAY_DEN < p_ngay_di
          AND ctpt.NGAY_DI > p_ngay_den
        GROUP BY p_thue.ID_HANG_PHONG
      ) AS occupied_rooms ON hp_sub.ID_HANG_PHONG = occupied_rooms.ID_HANG_PHONG
    GROUP BY hp_sub.ID_HANG_PHONG
  ) AS occupied ON hp.ID_HANG_PHONG = occupied.ID_HANG_PHONG
  LEFT JOIN (
    -- Trừ các phòng đang dọn dẹp, đang bảo trì, và đã đặt
    SELECT p_unavail.ID_HANG_PHONG,
      COUNT(*) AS SO_PHONG_KHONG_KHADUNG
    FROM phong p_unavail
      INNER JOIN trangthai tt ON p_unavail.ID_TT = tt.ID_TT
    WHERE tt.TEN_TRANG_THAI IN ('Đang dọn dẹp', 'Đang bảo trì', 'Đã đặt')
    GROUP BY p_unavail.ID_HANG_PHONG
  ) AS unavailable ON hp.ID_HANG_PHONG = unavailable.ID_HANG_PHONG
GROUP BY hp.ID_HANG_PHONG,
  kp.TEN_KP,
  lp.TEN_LP
ORDER BY hp.ID_HANG_PHONG;
END $$ DELIMITER;