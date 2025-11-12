import axios from 'axios'

/**
 * Save price data
 * @param {Object} data - Price data
 * @param {string} data.price_date - Price date in format YYYYMMDD (e.g., 20251107)
 * @param {number} data.buy_price - Buy price
 * @param {number} data.sell_price - Sell price
 * @param {string} data.is_select_am - Selection identifier (1=am, 0=pm)
 * @returns {Promise} API response
 */
export const savePriceData = (data) => {
  return axios.post('/api/price/save', data)
}

/**
 * Query price data
 * @param {Object} params - Query parameters
 * @param {string} params.priceDate - Price date in format yyyy-MM-dd (optional)
 * @param {string} params.isSelectAm - Selection identifier ("1"=am, "0"=pm) (optional)
 * @returns {Promise} API response
 */
export const queryPrice = (params) => {
  return axios.get('/api/price/list', { params })
}
