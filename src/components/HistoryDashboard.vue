<template>
  <div>
    <div class="content-header">
      <h2>历史数据看板</h2>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- User List Section -->
      <div class="table-section">
        <h3 class="section-title">用户信息列表</h3>
        <div class="user-list-container">
          <table class="user-table">
            <thead>
              <tr>
                <th style="width: 50%;">用户账号</th>
                <th style="width: 50%;">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userList" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Data Query Section -->
      <div class="table-section">
        <div class="query-header">
          <h3 class="section-title">用户历史数据</h3>
          <div class="query-controls">
            <label>选择用户：</label>
            <select v-model="selectedUserId" @change="handleUserChange" class="user-select">
              <option value="">请选择用户</option>
              <option v-for="user in userList" :key="user.id" :value="user.id">
                {{ user.id }} - {{ user.remark || '无备注' }}
              </option>
            </select>
            <button class="query-btn" @click="queryUserData" :disabled="!selectedUserId">
              查询
            </button>
          </div>
        </div>

        <!-- User Data Table (will be populated based on API you provide) -->
        <div v-if="selectedUserId && userData.length > 0" class="data-result">
          <p class="result-info">查询到 {{ userData.length }} 条数据</p>
          <!-- Placeholder for user data table -->
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>开仓时间</th>
                  <th>平仓时间</th>
                  <th>买卖方向</th>
                  <th>成交量</th>
                  <th>盈亏</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in userData" :key="item.orderId">
                  <td>{{ item.orderId }}</td>
                  <td>{{ item.openingTime }}</td>
                  <td>{{ item.closingTime || '-' }}</td>
                  <td>{{ item.direction }}</td>
                  <td>{{ item.volume }}</td>
                  <td :class="item.inoutPrice >= 0 ? 'profit' : 'loss'">
                    {{ item.inoutPrice }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="selectedUserId && queriedOnce" class="empty-state">
          <p>暂无数据</p>
        </div>
        <div v-else class="placeholder-state">
          <p>请选择用户并点击查询</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAllUser } from '@/api/user'

export default {
  name: 'HistoryDashboard',
  setup() {
    const userList = ref([])
    const selectedUserId = ref('')
    const userData = ref([])
    const queriedOnce = ref(false)

    // Fetch all users
    const fetchUserList = async () => {
      try {
        const response = await getAllUser()
        if (response.data.code === 200) {
          userList.value = response.data.data || []
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    }

    // Handle user selection change
    const handleUserChange = () => {
      userData.value = []
      queriedOnce.value = false
    }

    // Query user data (API to be provided)
    const queryUserData = async () => {
      if (!selectedUserId.value) return
      
      queriedOnce.value = true
      
      // TODO: Call API to fetch user data
      // const response = await getUserHistory({ userId: selectedUserId.value })
      // userData.value = response.data.data || []
      
      console.log('Querying data for user:', selectedUserId.value)
      // Temporary mock data
      userData.value = []
    }

    onMounted(() => {
      fetchUserList()
    })

    return {
      userList,
      selectedUserId,
      userData,
      queriedOnce,
      handleUserChange,
      queryUserData
    }
  }
}
</script>

<style scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.content-header h2 {
  margin: 0;
  color: #2c3e50;
}

.main-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  align-items: start;
}

.table-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #3498db;
}

.user-list-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  text-align: left;
  padding: 15px;
  border-bottom: 2px solid #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.user-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #34495e;
}

.user-table tr:hover {
  background: #f8f9fa;
}

.query-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.query-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.query-controls label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.user-select {
  padding: 8px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  font-size: 14px;
  color: #2c3e50;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.user-select:focus {
  outline: none;
  border-color: #3498db;
}

.query-btn {
  padding: 8px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.query-btn:hover:not(:disabled) {
  background: #2980b9;
}

.query-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.data-result {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-info {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 14px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 15px;
  border-bottom: 2px solid #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #34495e;
  white-space: nowrap;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.profit {
  color: #27ae60;
  font-weight: 600;
}

.loss {
  color: #e74c3c;
  font-weight: 600;
}

.empty-state {
  background: white;
  border-radius: 10px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin: 0;
  color: #95a5a6;
  font-size: 16px;
}

.placeholder-state {
  background: white;
  border-radius: 10px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.placeholder-state p {
  margin: 0;
  color: #bdc3c7;
  font-size: 16px;
}
</style>
