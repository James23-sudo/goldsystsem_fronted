<template>
  <div>
    <div class="content-header">
      <h2>历史数据看板</h2>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- User Data Query Section -->
      <div class="table-section">
        <div class="query-header">
          <h3 class="section-title">用户历史数据</h3>
          <div class="query-controls">
            <label>选择用户：</label>
            <input 
              list="history-user-list" 
              v-model="selectedUserId" 
              @change="handleUserChange"
              @input="handleUserChange"
              class="user-select"
              placeholder="请选择用户"
            />
            <datalist id="history-user-list">
              <option value="">请选择用户</option>
              <option v-for="user in allUsers" :key="user.id" :value="user.id">
                {{ user.id }} - {{ user.remark || '无备注' }}
              </option>
            </datalist>
            <button class="query-btn" @click="queryUserData" :disabled="!selectedUserId">
              查询
            </button>
          </div>
        </div>

        <!-- User Data Table with Pagination -->
        <div v-if="selectedUserId && hasQueried" class="data-result">
          <DataTable
            :columns="columns"
            :data="userData"
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <template #column-inoutPrice="{ row }">
              <span :class="row.inoutPrice >= 0 ? 'profit' : 'loss'">
                {{ row.inoutPrice }}
              </span>
            </template>
          </DataTable>
        </div>
        <div v-else class="placeholder-state">
          <p>请选择用户并点击查询</p>
        </div>
      </div>

      <!-- User List Section -->
      <div class="table-section">
        <h3 class="section-title">用户信息列表</h3>
        <DataTable
          :columns="userColumns"
          :data="userList"
          :total="userTotal"
          :current-page="userPage"
          :page-size="userPageSize"
          @page-change="handleUserPageChange"
          @page-size-change="handleUserPageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAllUser, getUserByPage } from '@/api/user'
import { getTraderList } from '@/api/trader'
import DataTable from './DataTable.vue'

export default {
  name: 'HistoryDashboard',
  components: {
    DataTable
  },
  setup() {
    const userList = ref([])
    const userPage = ref(1)
    const userPageSize = ref(10)
    const userTotal = ref(0)
    const allUsers = ref([]) // For datalist dropdown
    const selectedUserId = ref('')
    const userData = ref([])
    const hasQueried = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const userColumns = ref([
      { prop: 'id', label: '用户账号', width: '200px' },
      { prop: 'remark', label: '备注', width: 'auto' }
    ])

    const columns = ref([
      { prop: 'id', label: '账号', width: '80px' },
      { prop: 'orderId', label: '订单号', width: '80px' },
      { prop: 'openingTime', label: '开仓时间', width: '120px' },
      { prop: 'closingTime', label: '平仓时间', width: '120px' },
      { prop: 'direction', label: '买卖方向', width: '60px' },
      { prop: 'volume', label: '成交量(盎司)', width: '60px' },
      { prop: 'varieties', label: '交易品种', width: '60px' },
      { prop: 'openingPrice', label: '开仓价格', width: '60px' },
      { prop: 'closingPrice', label: '平仓价格', width: '60px' },
      { prop: 'overnightPrice', label: '隔夜费', width: '60px' },
      { prop: 'inoutPrice', label: '盈亏', width: '100px' },
      { prop: 'overPrice', label: '收盘价', width: '100px' },
      { prop: 'entryExit', label: '出入金', width: '100px' }
    ])

    // Format datetime helper function
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return ''
      return dateTimeStr.replace('T', ' ')
    }

    // Fetch all users for dropdown
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUser()
        if (response.data.code === 200) {
          allUsers.value = response.data.data || []
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    }

    // Fetch users by page for the table
    const fetchUserList = async () => {
      try {
        const response = await getUserByPage({
          page: userPage.value,
          size: userPageSize.value
        })
        if (response.data.code === 200) {
          userList.value = response.data.data.records || []
          userTotal.value = response.data.data.total || 0
        }
      } catch (error) {
        console.error('获取分页用户列表失败:', error)
      }
    }

    // Handle user selection change
    const handleUserChange = () => {
      userData.value = []
      hasQueried.value = false
      currentPage.value = 1
      total.value = 0
    }

    // Query user data
    const queryUserData = async () => {
      if (!selectedUserId.value) return
      
      hasQueried.value = true
      currentPage.value = 1
      await fetchUserData()
    }

    // Fetch user data with pagination
    const fetchUserData = async () => {
      if (!selectedUserId.value) return

      try {
        const response = await getTraderList({
          userId: selectedUserId.value,
          page: currentPage.value,
          pageSize: pageSize.value,
          isOk: '1' // Completed status for historical data
        })

        if (response.data.code === 200) {
          const records = response.data.data.records || []
          userData.value = records.map(record => ({
            ...record,
            openingTime: formatDateTime(record.openingTime),
            closingTime: formatDateTime(record.closingTime)
          }))
          total.value = response.data.data.total || 0
        }
      } catch (error) {
        console.error('获取用户历史数据失败:', error)
        userData.value = []
        total.value = 0
      }
    }

    // User list pagination handlers
    const handleUserPageChange = (page) => {
      userPage.value = page
      fetchUserList()
    }

    const handleUserPageSizeChange = (size) => {
      userPageSize.value = size
      userPage.value = 1
      fetchUserList()
    }

    // Pagination handlers
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchUserData()
    }

    const handlePageSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchUserData()
    }

    onMounted(() => {
      fetchAllUsers()
      fetchUserList()
    })

    return {
      userList,
      userPage,
      userPageSize,
      userTotal,
      userColumns,
      allUsers,
      selectedUserId,
      userData,
      hasQueried,
      currentPage,
      pageSize,
      total,
      columns,
      handleUserChange,
      queryUserData,
      handlePageChange,
      handlePageSizeChange,
      handleUserPageChange,
      handleUserPageSizeChange
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
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  margin-top: 20px;
}

.profit {
  color: #27ae60;
  font-weight: 600;
}

.loss {
  color: #e74c3c;
  font-weight: 600;
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
