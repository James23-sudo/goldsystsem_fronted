<template>
  <div>
    <div class="content-header">
      <h2>查看价格</h2>
    </div>

    <!-- Price Query Form -->
    <div class="query-section">
      <div class="query-form">
        <div class="form-group">
          <label>价格日期</label>
          <input 
            v-model="queryForm.priceDate" 
            type="date" 
            placeholder="请选择日期"
          />
        </div>
        <div class="form-group">
          <label>交易时段</label>
          <select v-model="queryForm.isSelectAm">
            <option value="">全部</option>
            <option value="1">上午(am)</option>
            <option value="0">下午(pm)</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="query-btn" @click="handleQuery">查询</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>
    </div>

    <!-- Price Data Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="price-table">
          <thead>
            <tr>
              <th>价格日期</th>
              <th>买入价格</th>
              <th>卖出价格</th>
              <th>交易时段</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="priceData.length === 0">
              <td colspan="6" class="no-data">暂无数据</td>
            </tr>
            <tr v-for="item in priceData" :key="item.id">
              <td>{{ item.priceDate }}</td>
              <td class="price-buy">{{ item.buyPrice }}</td>
              <td class="price-sell">{{ item.sellPrice }}</td>
              <td>
                <span :class="['period-tag', item.isSelectAm === '1' ? 'am' : 'pm']">
                  {{ item.isSelectAm === '1' ? '上午(am)' : '下午(pm)' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { queryPrice } from '@/api/price'

export default {
  name: 'PriceDashboard',
  setup() {
    const queryForm = reactive({
      priceDate: '',
      isSelectAm: ''
    })

    const priceData = ref([])

    // Fetch price data
    const fetchPriceData = async () => {
      try {
        const params = {}
        
        if (queryForm.priceDate) {
          params.priceDate = queryForm.priceDate
        }
        
        if (queryForm.isSelectAm !== '') {
          params.isSelectAm = queryForm.isSelectAm
        }

        const response = await queryPrice(params)
        
        if (response.data.code === 200) {
          priceData.value = response.data.data || []
        } else {
          console.error('查询失败:', response.data.msg)
          alert('查询失败：' + (response.data.msg || '未知错误'))
        }
      } catch (error) {
        console.error('查询价格数据失败:', error)
        alert('查询失败：' + (error.response?.data?.msg || error.message || '网络错误'))
      }
    }

    // Handle query button click
    const handleQuery = () => {
      fetchPriceData()
    }

    // Handle reset button click
    const handleReset = () => {
      queryForm.priceDate = ''
      queryForm.isSelectAm = ''
      fetchPriceData()
    }

    // Initialize data on mount
    onMounted(() => {
      fetchPriceData()
    })

    return {
      queryForm,
      priceData,
      handleQuery,
      handleReset
    }
  }
}
</script>

<style scoped>
.content-header {
  margin-bottom: 30px;
}

.content-header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
}

.query-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.query-form {
  display: flex;
  gap: 20px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 16px;
  font-weight: 500;
  color: #34495e;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.query-btn,
.reset-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.query-btn {
  background: #3498db;
  color: white;
}

.query-btn:hover {
  background: #2980b9;
}

.reset-btn {
  background: #95a5a6;
  color: white;
}

.reset-btn:hover {
  background: #7f8c8d;
}

.table-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.table-container {
  overflow-x: auto;
}

.price-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.price-table thead {
  background: #f8f9fa;
}

.price-table th {
  padding: 14px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 16px;
}

.price-table td {
  padding: 14px;
  border-bottom: 1px solid #e9ecef;
  color: #34495e;
}

.price-table tbody tr:hover {
  background: #f8f9fa;
}

.no-data {
  text-align: center;
  padding: 40px 12px;
  color: #95a5a6;
  font-size: 16px;
}

.price-buy {
  color: #27ae60;
  font-weight: 500;
}

.price-sell {
  color: #e74c3c;
  font-weight: 500;
}

.period-tag {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.period-tag.am {
  background: #e3f2fd;
  color: #1976d2;
}

.period-tag.pm {
  background: #fff3e0;
  color: #f57c00;
}
</style>
