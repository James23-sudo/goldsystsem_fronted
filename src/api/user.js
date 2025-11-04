import axios from 'axios'

/**
 * Add new customer
 * @param {Object} data - Customer data
 * @param {string} data.id - User account (6 digits starting with 66)
 * @param {string} data.remark - Remarks (max 64 characters)
 * @returns {Promise} API response
 */
export const addUser = (data) => {
  return axios.post('/api/user/add', data)
}

/**
 * Get user data list
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Page size
 * @param {string} params.is_ok - Processing status (0=pending, 1=completed)
 * @returns {Promise} API response
 */
export const getUserList = (params) => {
  return axios.get('/api/user/list', { params })
}

/**
 * Get all users
 * @returns {Promise} API response
 */
export const getAllUser = () => {
  return axios.get('/api/user/getAllUser')
}

/**
 * Add customer data
 * @param {Object} data - Customer data
 * @returns {Promise} API response
 */
export const addCustomerData = (data) => {
  return axios.post('/api/user/data/add', data)
}
