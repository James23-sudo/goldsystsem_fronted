import axios from 'axios'

/**
 * Get trader list
 * @param {Object} params - Query parameters
 * @param {string} params.isOk - Processing status (0=pending, 1=completed) - REQUIRED
 * @param {string} params.userId - User ID filter (optional)
 * @param {number} params.page - Page number (optional)
 * @param {number} params.size - Page size (optional)
 * @returns {Promise} API response
 */
export const getTraderList = (params) => {
  // Transform pageSize to size for backend compatibility
  const backendParams = { ...params }
  if (backendParams.pageSize !== undefined) {
    backendParams.size = backendParams.pageSize
    delete backendParams.pageSize
  }
  return axios.get('/api/trader/list', { params: backendParams })
}

/**
 * Add trader data
 * @param {Object} data - Trader data
 * @returns {Promise} API response
 */
export const addTraderData = (data) => {
  return axios.post('/api/trader/addTrader', data)
}

/**
 * Update trader data
 * @param {Object} data - Trader data
 * @returns {Promise} API response
 */
export const updateTraderData = (data) => {
  return axios.post('/api/trader/updateTrader', data)
}
