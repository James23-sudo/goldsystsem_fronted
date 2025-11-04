import axios from 'axios'

/**
 * Get trader list
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Page size
 * @param {string} params.isOk - Processing status (0=pending, 1=completed)
 * @returns {Promise} API response
 */
export const getTraderList = (params) => {
  return axios.get('/api/trader/list', { params })
}

/**
 * Add trader data
 * @param {Object} data - Trader data
 * @returns {Promise} API response
 */
export const addTraderData = (data) => {
  return axios.post('/api/trader/addTrader', data)
}
