/**
 * Utility functions for user data handling
 */

/**
 * Get display name from user object with multiple fallbacks
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Người dùng'
  
  // Try different name fields in order of preference
  const possibleNames = [
    user.hoTen,
    user.tenNhanVien,
    user.tenKhachHang,
    user.name,
    user.fullName,
    user.ten,
    `${user.ho || ''} ${user.ten || ''}`.trim(),
    `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    user.email?.split('@')[0]
  ]
  
  // Return first non-empty name
  for (const name of possibleNames) {
    if (name && name.trim() && name.trim() !== 'undefined undefined') {
      return name.trim()
    }
  }
  
  // Final fallback based on role
  switch (user.role) {
    case 'ADMIN':
      return 'Quản lý'
    case 'EMPLOYEE':
      return 'Lễ tân'
    case 'CUSTOMER':
      return 'Khách hàng'
    default:
      return 'Người dùng'
  }
}

/**
 * Get role display name in Vietnamese
 * @param {string} role - User role
 * @returns {string} Role display name
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản lý'
    case 'EMPLOYEE':
      return 'Lễ tân'
    case 'CUSTOMER':
      return 'Khách hàng'
    default:
      return 'Người dùng'
  }
}

/**
 * Normalize user data from different backend responses
 * @param {Object} userData - Raw user data from backend
 * @param {string} role - User role
 * @returns {Object} Normalized user object
 */
export const normalizeUserData = (userData, role) => {
  if (!userData) return null
  
  const displayName = getUserDisplayName(userData)
  
  return {
    ...userData,
    role: role || userData.role || 'CUSTOMER',
    hoTen: displayName,
    email: userData.email || '',
    username: userData.username || '',
    id: userData.id || userData.idNv || userData.maNhanVien || userData.maKhachHang || userData.userId,
    idNv: userData.idNv || userData.maNhanVien || userData.id,
    maNhanVien: userData.maNhanVien || userData.idNv || userData.id,
    cccd: userData.cccd || userData.id,
    soDienThoai: userData.soDienThoai || userData.phone || userData.phoneNumber || '',
    diaChi: userData.diaChi || userData.address || '',
    ngaySinh: userData.ngaySinh || userData.dateOfBirth || userData.birthDate || '',
    gioiTinh: userData.gioiTinh || userData.gender || ''
  }
}
