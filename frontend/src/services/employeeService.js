import {api} from './api'

export const employeeService = {
  // Get employee by email or username (smart detection)
  getEmployeeByEmail: async (emailOrUsername) => {
    try {
      let endpoint
      if (emailOrUsername && emailOrUsername.includes('@')) {
        // Đăng nhập bằng email
        endpoint = `/api/nhanvien/my-info/${encodeURIComponent(emailOrUsername)}`
      } else {
        // Đăng nhập bằng username
        endpoint = `/api/nhanvien/get-by-username/${encodeURIComponent(emailOrUsername)}`
      }

      const response = await api.get(endpoint)
      return response.data
    } catch (error) {
      console.error('Error fetching employee by email:', error)
      throw error
    }
  },

  // Get employee by ID
  getEmployeeById: async (idNv) => {
    try {
      const response = await api.get(`/api/nhanvien/get-by-id/${idNv}`)
      return response.data
    } catch (error) {
      console.error('Error fetching employee by ID:', error)
      throw error
    }
  },

  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get('/api/nhanvien/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all employees:', error)
      throw error
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/api/nhanvien/register', employeeData)
      return response.data
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  },

  // Get all departments (bo phan)
  getAllDepartments: async () => {
    try {
      const response = await api.get('/api/bo-phan/all')
      return response.data
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Get all roles (nhom quyen)
  getAllRoles: async () => {
    try {
      const response = await api.get('/api/nhom-quyen/all')
      return response.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  }
}
