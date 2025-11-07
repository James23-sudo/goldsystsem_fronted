<template>
  <div>
    <div class="content-header">
      <h2>用户数据看板</h2>
      <div class="button-group">
        <button class="add-btn" @click="showAddCustomerModal">+ 新增客户</button>
        <button class="add-btn data-btn" @click="showAddDataModal">+ 新增客户数据</button>
        <button class="add-btn price-btn" @click="showAddPriceModal">+ 新增价格</button>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <div v-if="isAddCustomerModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增客户</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>用户账号 <span class="required">*</span></label>
            <input 
              v-model="formData.userAccount" 
              type="text" 
              placeholder="请输入以66开头的6位数字"
              maxlength="6"
              @input="validateUserAccount"
            />
            <span v-if="errors.userAccount" class="error-msg">{{ errors.userAccount }}</span>
          </div>
          <div class="form-group">
            <label>备注 <span class="required">*</span></label>
            <textarea 
              v-model="formData.remarks" 
              placeholder="请输入备注（不超过64个字）"
              maxlength="64"
              rows="4"
              @input="validateRemarks"
            ></textarea>
            <span class="char-count">{{ formData.remarks.length }}/64</span>
            <span v-if="errors.remarks" class="error-msg">{{ errors.remarks }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="submit-btn" @click="submitAddCustomer" :disabled="isSubmitting">{{ isSubmitting ? '提交中...' : '确定' }}</button>
        </div>
      </div>
    </div>

    <!-- Add Price Modal -->
    <div v-if="isAddPriceModalVisible" class="modal-overlay" @click="closePriceModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增价格</h3>
          <button class="close-btn" @click="closePriceModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>日期 <span class="required">*</span></label>
            <input 
              v-model="priceForm.priceDate" 
              type="date" 
              @input="validatePriceForm"
            />
            <span v-if="priceErrors.priceDate" class="error-msg">{{ priceErrors.priceDate }}</span>
          </div>
          <div class="form-group">
            <label>买入价格 <span class="required">*</span></label>
            <input 
              v-model="priceForm.buyPrice" 
              type="number" 
              step="0.01"
              placeholder="请输入买入价格"
              @input="validatePriceForm"
            />
            <span v-if="priceErrors.buyPrice" class="error-msg">{{ priceErrors.buyPrice }}</span>
          </div>
          <div class="form-group">
            <label>卖出价格 <span class="required">*</span></label>
            <input 
              v-model="priceForm.sellPrice" 
              type="number" 
              step="0.01"
              placeholder="请输入卖出价格"
              @input="validatePriceForm"
            />
            <span v-if="priceErrors.sellPrice" class="error-msg">{{ priceErrors.sellPrice }}</span>
          </div>
          <div class="form-group">
            <label>选择标识 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="priceForm.isSelectAm" 
                  value="1"
                  @change="validatePriceForm"
                />
                <span>上午价格(am)</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="priceForm.isSelectAm" 
                  value="0"
                  @change="validatePriceForm"
                />
                <span>下午价格(pm)</span>
              </label>
            </div>
            <span v-if="priceErrors.isSelectAm" class="error-msg">{{ priceErrors.isSelectAm }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closePriceModal">取消</button>
          <button class="submit-btn" @click="submitAddPrice" :disabled="isSubmittingPrice">{{ isSubmittingPrice ? '提交中...' : '确定' }}</button>
        </div>
      </div>
    </div>

    <!-- Add Customer Data Modal -->
    <div v-if="isAddDataModalVisible" class="modal-overlay" @click="closeDataModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? '处理客户数据' : '新增客户数据' }}</h3>
          <button class="close-btn" @click="closeDataModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>选择用户 <span class="required">*</span></label>
              <input 
                list="modal-user-list" 
                v-model="dataForm.userId" 
                @change="validateDataForm"
                @input="validateDataForm"
                placeholder="请选择用户"
              />
              <datalist id="modal-user-list">
                <option value="">请选择用户</option>
                <option v-for="user in userList" :key="user.id" :value="user.id">
                  {{ user.id }} - {{ user.remark || '无备注' }}
                </option>
              </datalist>
              <span v-if="dataErrors.userId" class="error-msg">{{ dataErrors.userId }}</span>
            </div>
            <div class="form-group">
              <label>订单号 <span class="required">*</span></label>
              <input 
                v-model="dataForm.orderId" 
                type="text" 
                placeholder="请输入订单号"
                maxlength="64"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.orderId" class="error-msg">{{ dataErrors.orderId }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>买卖方向 <span class="required">*</span></label>
              <select v-model="dataForm.direction" @change="handleDirectionChange">
                <option value="">请选择</option>
                <option value="buy">buy</option>
                <option value="sell">sell</option>
                <option value="balance">balance</option>
              </select>
              <span v-if="dataErrors.direction" class="error-msg">{{ dataErrors.direction }}</span>
            </div>
            <div class="form-group" v-if="isTradeDirection">
              <label>交易时段 <span class="required">*</span></label>
              <select v-model="dataForm.traderSelect" @change="validateDataForm">
                <option value="">请选择</option>
                <option value="am">am</option>
                <option value="pm">pm</option>
              </select>
              <span v-if="dataErrors.traderSelect" class="error-msg">{{ dataErrors.traderSelect }}</span>
            </div>
            <div class="form-group" v-else-if="isBalance">
              <label>出入金 <span class="required">*</span></label>
              <input 
                v-model="dataForm.entryExit" 
                type="number" 
                step="0.01"
                placeholder="请输入出入金"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.entryExit" class="error-msg">{{ dataErrors.entryExit }}</span>
            </div>
            <div class="form-group" v-else>
              <!-- Empty space for layout -->
            </div>
          </div>

          <!-- Fields for buy/sell direction -->
          <div class="form-row" v-if="isTradeDirection">
            <div class="form-group">
              <label>成交量(盎司) <span class="required">*</span></label>
              <input 
                v-model="dataForm.volume" 
                type="number" 
                step="0.000001"
                placeholder="请输入成交量(盎司)"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.volume" class="error-msg">{{ dataErrors.volume }}</span>
            </div>
            <div class="form-group">
              <label>隔夜费比例(%) <span class="required">*</span></label>
              <input 
                v-model="dataForm.overnightProportion" 
                type="number" 
                step="0.01"
                placeholder="请输入隔夜费比例"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.overnightProportion" class="error-msg">{{ dataErrors.overnightProportion }}</span>
            </div>
          </div>

          <div class="form-row" v-if="isTradeDirection">
            <div class="form-group">
              <label>预定时间 <span class="required">*</span></label>
              <input 
                v-model="dataForm.scheduledTime" 
                type="datetime-local" 
                step="1"
                placeholder="请选择预定时间"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.scheduledTime" class="error-msg">{{ dataErrors.scheduledTime }}</span>
            </div>
            <div class="form-group">
              <label>开仓时间 <span class="required">*</span></label>
              <input 
                v-model="dataForm.openingTime" 
                type="datetime-local" 
                step="1"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.openingTime" class="error-msg">{{ dataErrors.openingTime }}</span>
            </div>
          </div>

          <div class="form-row" v-if="isTradeDirection">
            <div class="form-group">
              <label>平仓时间</label>
              <input 
                v-model="dataForm.closingTime" 
                type="datetime-local" 
                step="1"
              />
            </div>
            <div class="form-group">
              <label>交易品种</label>
              <input 
                v-model="dataForm.varieties" 
                type="text" 
                placeholder="默认: lbma"
                maxlength="64"
              />
            </div>
          </div>

          <div class="form-row" v-if="isTradeDirection">
            <div class="form-group">
              <label>开仓价格</label>
              <input 
                v-model="dataForm.openingPrice" 
                type="number" 
                step="0.01"
                placeholder="请输入开仓价格"
              />
            </div>
            <div class="form-group">
              <label>平仓价格</label>
              <input 
                v-model="dataForm.closingPrice" 
                type="number" 
                step="0.01"
                placeholder="请输入平仓价格"
              />
            </div>
          </div>

          <div class="form-row" v-if="isTradeDirection">
            <div class="form-group">
              <label>收盘价</label>
              <input 
                v-model="dataForm.overPrice" 
                type="number" 
                step="0.01"
                placeholder="请输入收盘价"
              />
            </div>
            <div class="form-group">
              <!-- Empty space for layout -->
            </div>
          </div>

          <!-- Fields for balance direction -->
          <div class="form-row" v-if="isBalance">
            <div class="form-group">
              <label>开仓时间 <span class="required">*</span></label>
              <input 
                v-model="dataForm.openingTime" 
                type="datetime-local" 
                step="1"
                @input="validateDataForm"
              />
              <span v-if="dataErrors.openingTime" class="error-msg">{{ dataErrors.openingTime }}</span>
            </div>
            <div class="form-group">
              <!-- Empty space for layout -->
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeDataModal">取消</button>
          <button class="submit-btn" @click="submitAddData" :disabled="isSubmittingData">{{ isSubmittingData ? '提交中...' : '确定' }}</button>
        </div>
      </div>
    </div>

    <!-- Pending Data Table -->
    <div class="table-section">
      <div class="table-header">
        <h3 class="section-title">待处理数据</h3>
        <div class="filter-controls">
          <label>交易时段：</label>
          <select v-model="pendingSelectedTraderSelect" @change="handlePendingTraderSelectChange" class="user-filter-select">
            <option value="">全部</option>
            <option value="am">am</option>
            <option value="pm">pm</option>
          </select>
          <label>选择用户：</label>
          <input 
            list="pending-user-list" 
            v-model="pendingSelectedUserId" 
            @change="handlePendingUserChange"
            @input="handlePendingUserChange"
            class="user-filter-select"
            placeholder="全部用户"
          />
          <datalist id="pending-user-list">
            <option value="">全部用户</option>
            <option v-for="user in userList" :key="user.id" :value="user.id">
              {{ user.id }} - {{ user.remark || '无备注' }}
            </option>
          </datalist>
        </div>
      </div>
      <DataTable
        :columns="columns"
        :data="pendingData"
        :total="pendingTotal"
        :current-page="pendingPage"
        :page-size="pendingPageSize"
        @page-change="handlePendingPageChange"
        @page-size-change="handlePendingPageSizeChange"
      >
        <template #column-inoutPrice="{ row }">
          <span :class="row.inoutPrice >= 0 ? 'profit' : 'loss'">
            {{ row.inoutPrice }}
          </span>
        </template>
        <template #column-actions="{ row }">
          <button class="action-btn process" @click="handleProcess(row)">处理</button>
        </template>
      </DataTable>
    </div>

    <!-- Completed Data Table -->
    <div class="table-section">
      <div class="table-header">
        <h3 class="section-title">已完成数据</h3>
        <div class="filter-controls">
          <label>交易时段：</label>
          <select v-model="completedSelectedTraderSelect" @change="handleCompletedTraderSelectChange" class="user-filter-select">
            <option value="">全部</option>
            <option value="am">am</option>
            <option value="pm">pm</option>
          </select>
          <label>选择用户：</label>
          <input 
            list="completed-user-list" 
            v-model="completedSelectedUserId" 
            @change="handleCompletedUserChange"
            @input="handleCompletedUserChange"
            class="user-filter-select"
            placeholder="全部用户"
          />
          <datalist id="completed-user-list">
            <option value="">全部用户</option>
            <option v-for="user in userList" :key="user.id" :value="user.id">
              {{ user.id }} - {{ user.remark || '无备注' }}
            </option>
          </datalist>
        </div>
      </div>
      <DataTable
        :columns="columns"
        :data="completedData"
        :total="completedTotal"
        :current-page="completedPage"
        :page-size="completedPageSize"
        @page-change="handleCompletedPageChange"
        @page-size-change="handleCompletedPageSizeChange"
      >
        <template #column-inoutPrice="{ row }">
          <span :class="row.inoutPrice >= 0 ? 'profit' : 'loss'">
            {{ row.inoutPrice }}
          </span>
        </template>
        <template #column-actions="{ row }">
          <button class="action-btn edit" @click="handleEdit(row)">编辑</button>
          <button class="action-btn delete" @click="handleDelete(row)">删除</button>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { addUser, getAllUser } from '@/api/user'
import { getTraderList, addTraderData, updateTraderData } from '@/api/trader'
import { savePriceData } from '@/api/price'
import DataTable from './DataTable.vue'

export default {
  name: 'UserDashboard',
  components: {
    DataTable
  },
  setup() {
    const columns = ref([
      { prop: 'id', label: '账号', width: '80px' },
      { prop: 'orderId', label: '订单号', width: '80px' },
      { prop: 'openingTime', label: '开仓时间', width: '120px' },
      { prop: 'direction', label: '买卖方向', width: '60px' },
      { prop: 'traderSelect', label: '交易时段', width: '60px' },
      { prop: 'volume', label: '成交量(盎司)', width: '60px' },
      { prop: 'varieties', label: '交易品种', width: '60px' },
      { prop: 'openingPrice', label: '开仓价格', width: '60px' },
      { prop: 'closingTime', label: '平仓时间', width: '120px' },
      { prop: 'closingPrice', label: '平仓价格', width: '60px' },
      { prop: 'overnightPrice', label: '隔夜费', width: '60px' },
      { prop: 'inoutPrice', label: '盈亏', width: '100px' },
      { prop: 'overPrice', label: '收盘价', width: '100px' },
      { prop: 'entryExit', label: '出入金', width: '100px' },
      { prop: 'actions', label: '操作', width: '120px', fixed: true }
    ])

    // Pending data list
    const pendingData = ref([])
    const pendingPage = ref(1)
    const pendingPageSize = ref(10)
    const pendingTotal = ref(0)
    const pendingSelectedUserId = ref('')
    const pendingSelectedTraderSelect = ref('')

    // Completed data list
    const completedData = ref([])
    const completedPage = ref(1)
    const completedPageSize = ref(10)
    const completedTotal = ref(0)
    const completedSelectedUserId = ref('')
    const completedSelectedTraderSelect = ref('')

    // Format datetime helper function
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return ''
      return dateTimeStr.replace('T', ' ')
    }

    // Fetch pending data
    const fetchPendingData = async () => {
      try {
        const params = {
          page: pendingPage.value,
          pageSize: pendingPageSize.value,
          isOk: '0' // Pending status
        }
        
        // Add userId filter if selected
        if (pendingSelectedUserId.value) {
          params.userId = pendingSelectedUserId.value
        }
        
        // Add traderSelect filter if selected
        if (pendingSelectedTraderSelect.value) {
          params.traderSelect = pendingSelectedTraderSelect.value
        }
        
        const response = await getTraderList(params)
        if (response.data.code === 200) {
          const records = response.data.data.records || []
          pendingData.value = records.map(record => ({
            ...record,
            openingTime: formatDateTime(record.openingTime),
            closingTime: formatDateTime(record.closingTime)
          }))
          pendingTotal.value = response.data.data.total || 0
        }
      } catch (error) {
        console.error('获取待处理数据失败:', error)
      }
    }

    // Fetch completed data
    const fetchCompletedData = async () => {
      try {
        const params = {
          page: completedPage.value,
          pageSize: completedPageSize.value,
          isOk: '1' // Completed status
        }
        
        // Add userId filter if selected
        if (completedSelectedUserId.value) {
          params.userId = completedSelectedUserId.value
        }
        
        // Add traderSelect filter if selected
        if (completedSelectedTraderSelect.value) {
          params.traderSelect = completedSelectedTraderSelect.value
        }
        
        const response = await getTraderList(params)
        if (response.data.code === 200) {
          const records = response.data.data.records || []
          completedData.value = records.map(record => ({
            ...record,
            openingTime: formatDateTime(record.openingTime),
            closingTime: formatDateTime(record.closingTime)
          }))
          completedTotal.value = response.data.data.total || 0
        }
      } catch (error) {
        console.error('获取已完成数据失败:', error)
      }
    }

    // Pending data pagination handlers
    const handlePendingPageChange = (page) => {
      pendingPage.value = page
      fetchPendingData()
    }

    const handlePendingPageSizeChange = (size) => {
      pendingPageSize.value = size
      pendingPage.value = 1
      fetchPendingData()
    }

    // Completed data pagination handlers
    const handleCompletedPageChange = (page) => {
      completedPage.value = page
      fetchCompletedData()
    }

    const handleCompletedPageSizeChange = (size) => {
      completedPageSize.value = size
      completedPage.value = 1
      fetchCompletedData()
    }

    // Handle user filter change for pending data
    const handlePendingUserChange = () => {
      pendingPage.value = 1
      fetchPendingData()
    }

    // Handle user filter change for completed data
    const handleCompletedUserChange = () => {
      completedPage.value = 1
      fetchCompletedData()
    }

    // Handle trader select filter change for pending data
    const handlePendingTraderSelectChange = () => {
      pendingPage.value = 1
      fetchPendingData()
    }

    // Handle trader select filter change for completed data
    const handleCompletedTraderSelectChange = () => {
      completedPage.value = 1
      fetchCompletedData()
    }

    // Action handlers
    const handleEdit = (row) => {
      console.log('编辑:', row)
      isEditMode.value = true
      editingRowId.value = row.id
      editingOrderId.value = row.orderId
      showAddDataModal()
      fillDataForm(row)
    }

    const handleProcess = (row) => {
      console.log('处理:', row)
      isEditMode.value = true
      editingRowId.value = row.id
      editingOrderId.value = row.orderId
      showAddDataModal()
      fillDataForm(row)
    }

    const handleDelete = async (row) => {
      if (!confirm('确定要删除该数据吗？')) {
        return
      }

      try {
        const response = await updateTraderData({
          id: row.id,
          orderId: row.orderId,
          status: '0'
        })

        if (response.data.code === 200 || response.data.success) {
          alert('删除成功！')
          fetchCompletedData()
        } else {
          alert('删除失败：' + (response.data.msg || '未知错误'))
        }
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败：' + (error.response?.data?.msg || error.msg || '网络错误'))
      }
    }

    // Initialize data on mount
    onMounted(() => {
      fetchUserList()
      fetchPendingData()
      fetchCompletedData()
    })

    const isAddCustomerModalVisible = ref(false)
    const isSubmitting = ref(false)
    
    const formData = reactive({
      userAccount: '',
      remarks: ''
    })

    const errors = reactive({
      userAccount: '',
      remarks: ''
    })

    const showAddCustomerModal = () => {
      isAddCustomerModalVisible.value = true
      resetForm()
    }

    const showAddDataModal = () => {
      isAddDataModalVisible.value = true
      fetchUserList()
      if (!isEditMode.value) {
        resetDataForm()
      }
    }

    const closeModal = () => {
      isAddCustomerModalVisible.value = false
      resetForm()
    }

    const closeDataModal = () => {
      isAddDataModalVisible.value = false
      isEditMode.value = false
      editingRowId.value = null
      editingOrderId.value = null
      resetDataForm()
    }

    const resetForm = () => {
      formData.userAccount = ''
      formData.remarks = ''
      errors.userAccount = ''
      errors.remarks = ''
    }

    const validateUserAccount = () => {
      const account = formData.userAccount
      if (!account) {
        errors.userAccount = '用户账号不能为空'
        return false
      }
      if (account.length !== 6) {
        errors.userAccount = '用户账号必须是6位数字'
        return false
      }
      if (!account.startsWith('66')) {
        errors.userAccount = '用户账号必须以66开头'
        return false
      }
      if (!/^\d+$/.test(account)) {
        errors.userAccount = '用户账号只能包含数字'
        return false
      }
      errors.userAccount = ''
      return true
    }

    const validateRemarks = () => {
      const remarks = formData.remarks
      if (!remarks) {
        errors.remarks = '备注不能为空'
        return false
      }
      if (remarks.length > 64) {
        errors.remarks = '备注不能超过64个字'
        return false
      }
      errors.remarks = ''
      return true
    }

    const submitAddCustomer = async () => {
      // Validate all fields
      const isAccountValid = validateUserAccount()
      const isRemarksValid = validateRemarks()

      if (!isAccountValid || !isRemarksValid) {
        return
      }

      isSubmitting.value = true

      try {
        const response = await addUser({
          id: formData.userAccount,
          remark: formData.remarks
        })

        if (response.data.code === 200 || response.data.success) {
          alert('客户添加成功！')
          closeModal()
          // Refresh pending data list
          fetchPendingData()
        } else {
          alert('添加失败：' + (response.data.msg || '未知错误'))
        }
      } catch (error) {
        console.error('添加客户失败:', error)
        alert('添加失败：' + (error.response?.data?.msg || error.msg || '网络错误'))
      } finally {
        isSubmitting.value = false
      }
    }

    // Add Customer Data Modal
    // Add Price Modal
    const isAddPriceModalVisible = ref(false)
    const isSubmittingPrice = ref(false)
    
    const priceForm = reactive({
      priceDate: '',
      buyPrice: '',
      sellPrice: '',
      isSelectAm: ''
    })

    const priceErrors = reactive({
      priceDate: '',
      buyPrice: '',
      sellPrice: '',
      isSelectAm: ''
    })

    const showAddPriceModal = () => {
      isAddPriceModalVisible.value = true
      resetPriceForm()
    }

    const closePriceModal = () => {
      isAddPriceModalVisible.value = false
      resetPriceForm()
    }

    const resetPriceForm = () => {
      priceForm.priceDate = ''
      priceForm.buyPrice = ''
      priceForm.sellPrice = ''
      priceForm.isSelectAm = ''
      
      priceErrors.priceDate = ''
      priceErrors.buyPrice = ''
      priceErrors.sellPrice = ''
      priceErrors.isSelectAm = ''
    }

    const validatePriceForm = () => {
      let isValid = true

      if (!priceForm.priceDate) {
        priceErrors.priceDate = '日期不能为空'
        isValid = false
      } else {
        priceErrors.priceDate = ''
      }

      if (!priceForm.buyPrice || parseFloat(priceForm.buyPrice) <= 0) {
        priceErrors.buyPrice = '买入价格必须大于0'
        isValid = false
      } else {
        priceErrors.buyPrice = ''
      }

      if (!priceForm.sellPrice || parseFloat(priceForm.sellPrice) <= 0) {
        priceErrors.sellPrice = '卖出价格必须大于0'
        isValid = false
      } else {
        priceErrors.sellPrice = ''
      }

      if (priceForm.isSelectAm === '') {
        priceErrors.isSelectAm = '请选择上午或下午价格'
        isValid = false
      } else {
        priceErrors.isSelectAm = ''
      }

      return isValid
    }

    const submitAddPrice = async () => {
      if (!validatePriceForm()) {
        return
      }

      isSubmittingPrice.value = true

      try {
        const requestData = {
          priceDate: priceForm.priceDate,
          buyPrice: parseFloat(priceForm.buyPrice),
          sellPrice: parseFloat(priceForm.sellPrice),
          isSelectAm: priceForm.isSelectAm
        }

        const response = await savePriceData(requestData)
        
        if (response.data.code === 200 || response.data.success) {
          alert('价格添加成功！')
          closePriceModal()
        } else {
          alert('添加失败：' + (response.data.msg || '未知错误'))
        }
      } catch (error) {
        console.error('添加价格失败:', error)
        alert('添加失败：' + (error.response?.data?.msg || error.msg || '网络错误'))
      } finally {
        isSubmittingPrice.value = false
      }
    }

    const isAddDataModalVisible = ref(false)
    const isSubmittingData = ref(false)
    const isEditMode = ref(false)
    const editingRowId = ref(null)
    const editingOrderId = ref(null)
    const userList = ref([])
    
    const dataForm = reactive({
      userId: '',
      orderId: '',
      direction: '',
      traderSelect: '',
      volume: '',
      entryExit: '',
      overnightProportion: '',
      scheduledTime: '',
      openingTime: '',
      closingTime: '',
      varieties: 'lbma',
      openingPrice: '',
      closingPrice: '',
      overPrice: ''
    })

    const dataErrors = reactive({
      userId: '',
      orderId: '',
      direction: '',
      traderSelect: '',
      volume: '',
      entryExit: '',
      overnightProportion: '',
      scheduledTime: '',
      openingTime: ''
    })

    // Check if direction is buy or sell (trade direction)
    const isTradeDirection = computed(() => {
      return dataForm.direction === 'buy' || dataForm.direction === 'sell'
    })

    // Check if direction is balance
    const isBalance = computed(() => {
      return dataForm.direction === 'balance'
    })

    // Handle direction change
    const handleDirectionChange = () => {
      // Clear validation errors
      dataErrors.traderSelect = ''
      dataErrors.volume = ''
      dataErrors.entryExit = ''
      dataErrors.overnightProportion = ''
      dataErrors.scheduledTime = ''
      
      // Reset fields based on direction
      if (isTradeDirection.value) {
        // For buy/sell, clear entryExit and balance-specific fields
        dataForm.entryExit = ''
      } else {
        // For balance, clear trade-specific fields
        dataForm.traderSelect = ''
        dataForm.volume = ''
        dataForm.overnightProportion = ''
        dataForm.closingTime = ''
        dataForm.varieties = 'lbma'
        dataForm.openingPrice = ''
        dataForm.closingPrice = ''
        dataForm.overPrice = ''
      }
      
      validateDataForm()
    }

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

    const resetDataForm = () => {
      dataForm.userId = ''
      dataForm.orderId = ''
      dataForm.direction = ''
      dataForm.traderSelect = ''
      dataForm.volume = ''
      dataForm.entryExit = ''
      dataForm.overnightProportion = ''
      dataForm.scheduledTime = ''
      dataForm.openingTime = ''
      dataForm.closingTime = ''
      dataForm.varieties = 'lbma'
      dataForm.openingPrice = ''
      dataForm.closingPrice = ''
      dataForm.overPrice = ''
      
      dataErrors.userId = ''
      dataErrors.orderId = ''
      dataErrors.direction = ''
      dataErrors.traderSelect = ''
      dataErrors.volume = ''
      dataErrors.entryExit = ''
      dataErrors.overnightProportion = ''
      dataErrors.scheduledTime = ''
      dataErrors.openingTime = ''
    }

    const fillDataForm = (row) => {
      // Helper to convert 'yyyy-MM-dd HH:mm:ss' to 'yyyy-MM-ddTHH:mm:ss' for datetime-local input
      const toDatetimeLocal = (dateTimeStr) => {
        if (!dateTimeStr) return ''
        return dateTimeStr.replace(' ', 'T')
      }

      dataForm.userId = row.id || ''
      dataForm.orderId = row.orderId || ''
      dataForm.direction = row.direction || ''
      dataForm.traderSelect = row.traderSelect || ''
      dataForm.volume = row.volume || ''
      dataForm.entryExit = row.entryExit || ''
      dataForm.overnightProportion = row.overnightProportion || ''
      dataForm.scheduledTime = toDatetimeLocal(row.scheduledTime)
      dataForm.openingTime = toDatetimeLocal(row.openingTime)
      dataForm.closingTime = toDatetimeLocal(row.closingTime)
      dataForm.varieties = row.varieties || 'lbma'
      dataForm.openingPrice = row.openingPrice || ''
      dataForm.closingPrice = row.closingPrice || ''
      dataForm.overPrice = row.overPrice || ''
    }

    const validateDataForm = () => {
      let isValid = true

      if (!dataForm.userId) {
        dataErrors.userId = '请选择用户'
        isValid = false
      } else {
        dataErrors.userId = ''
      }

      if (!dataForm.orderId) {
        dataErrors.orderId = '订单号不能为空'
        isValid = false
      } else {
        dataErrors.orderId = ''
      }

      if (!dataForm.direction) {
        dataErrors.direction = '请选择买卖方向'
        isValid = false
      } else {
        dataErrors.direction = ''
      }

      // Validate based on direction type
      if (isTradeDirection.value) {
        // For buy/sell: validate traderSelect, volume, overnightProportion and scheduledTime
        if (!dataForm.traderSelect) {
          dataErrors.traderSelect = '请选择交易时段'
          isValid = false
        } else {
          dataErrors.traderSelect = ''
        }

        if (!dataForm.volume || parseFloat(dataForm.volume) <= 0) {
          dataErrors.volume = '成交量必须大于0'
          isValid = false
        } else {
          dataErrors.volume = ''
        }

        if (!dataForm.overnightProportion || parseFloat(dataForm.overnightProportion) < 0) {
          dataErrors.overnightProportion = '隔夜费比例不能为空且不能为负'
          isValid = false
        } else {
          dataErrors.overnightProportion = ''
        }

        if (!dataForm.scheduledTime) {
          dataErrors.scheduledTime = '预定时间不能为空'
          isValid = false
        } else {
          dataErrors.scheduledTime = ''
        }
      } else {
        // For balance: validate entryExit
        if (dataForm.entryExit === '') {
          dataErrors.entryExit = '出入金不能为空'
          isValid = false
        } else {
          dataErrors.entryExit = ''
        }
      }

      if (!dataForm.openingTime) {
        dataErrors.openingTime = '开仓时间不能为空'
        isValid = false
      } else {
        dataErrors.openingTime = ''
      }

      return isValid
    }

    const submitAddData = async () => {
      if (!validateDataForm()) {
        return
      }

      isSubmittingData.value = true

      try {
        // Format datetime to 'yyyy-MM-dd HH:mm:ss'
        const formatDateTime = (dateTimeLocal) => {
          if (!dateTimeLocal) return null
          return dateTimeLocal.replace('T', ' ')
        }

        const requestData = {
          id: dataForm.userId,
          orderId: dataForm.orderId,
          openingTime: formatDateTime(dataForm.openingTime),
          direction: dataForm.direction,
          status: '1'
        }

        // Add fields based on direction type
        if (isTradeDirection.value) {
          // For buy/sell direction
          requestData.traderSelect = dataForm.traderSelect
          requestData.closingTime = dataForm.closingTime ? formatDateTime(dataForm.closingTime) : null
          requestData.volume = parseFloat(dataForm.volume)
          requestData.varieties = dataForm.varieties || 'lbma'
          requestData.openingPrice = dataForm.openingPrice ? parseFloat(dataForm.openingPrice) : null
          requestData.closingPrice = dataForm.closingPrice ? parseFloat(dataForm.closingPrice) : null
          requestData.overnightPrice = null
          requestData.inoutPrice = null
          requestData.overPrice = dataForm.overPrice ? parseFloat(dataForm.overPrice) : null
          requestData.entryExit = null
          requestData.overnightProportion = parseFloat(dataForm.overnightProportion)
          requestData.scheduledTime = dataForm.scheduledTime ? formatDateTime(dataForm.scheduledTime) : null
        } else {
          // For balance direction
          requestData.traderSelect = null
          requestData.closingTime = null
          requestData.volume = null
          requestData.varieties = null
          requestData.openingPrice = null
          requestData.closingPrice = null
          requestData.overnightPrice = null
          requestData.inoutPrice = null
          requestData.overPrice = null
          requestData.entryExit = parseFloat(dataForm.entryExit)
          requestData.overnightProportion = null
          requestData.scheduledTime = null
        }

        let response
        if (isEditMode.value) {
          // Update mode
          response = await updateTraderData(requestData)
        } else {
          // Add mode
          response = await addTraderData(requestData)
        }

        if (response.data.code === 200 || response.data.success) {
          alert(isEditMode.value ? '处理成功！' : '客户数据添加成功！')
          closeDataModal()
          // Refresh both pending and completed data lists
          fetchPendingData()
          fetchCompletedData()
        } else {
          alert((isEditMode.value ? '处理' : '添加') + '失败：' + (response.data.msg || '未知错误'))
        }
      } catch (error) {
        console.error((isEditMode.value ? '处理' : '添加') + '客户数据失败:', error)
        alert((isEditMode.value ? '处理' : '添加') + '失败：' + (error.response?.data?.msg || error.msg || '网络错误'))
      } finally {
        isSubmittingData.value = false
      }
    }

    return {
      columns,
      pendingData,
      pendingPage,
      pendingPageSize,
      pendingTotal,
      pendingSelectedUserId,
      pendingSelectedTraderSelect,
      completedData,
      completedPage,
      completedPageSize,
      completedTotal,
      completedSelectedUserId,
      completedSelectedTraderSelect,
      handlePendingPageChange,
      handlePendingPageSizeChange,
      handlePendingUserChange,
      handlePendingTraderSelectChange,
      handleCompletedPageChange,
      handleCompletedPageSizeChange,
      handleCompletedUserChange,
      handleCompletedTraderSelectChange,
      handleEdit,
      handleProcess,
      handleDelete,
      isAddCustomerModalVisible,
      isSubmitting,
      formData,
      errors,
      showAddCustomerModal,
      showAddDataModal,
      closeModal,
      closeDataModal,
      validateUserAccount,
      validateRemarks,
      submitAddCustomer,
      isAddPriceModalVisible,
      isSubmittingPrice,
      priceForm,
      priceErrors,
      showAddPriceModal,
      closePriceModal,
      validatePriceForm,
      submitAddPrice,
      isAddDataModalVisible,
      isSubmittingData,
      isEditMode,
      userList,
      dataForm,
      dataErrors,
      isTradeDirection,
      isBalance,
      handleDirectionChange,
      validateDataForm,
      submitAddData
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

.button-group {
  display: flex;
  gap: 10px;
}

.add-btn {
  padding: 10px 25px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #229954;
}

.add-btn.data-btn {
  background: #3498db;
}

.add-btn.data-btn:hover {
  background: #2980b9;
}

.add-btn.price-btn {
  background: #9b59b6;
}

.add-btn.price-btn:hover {
  background: #8e44ad;
}

.table-section {
  margin-bottom: 40px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #3498db;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-controls label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.user-filter-select {
  padding: 8px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  font-size: 14px;
  color: #2c3e50;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.user-filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.modal-large {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 10px;
}

.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  font-size: 14px;
  color: #2c3e50;
  box-sizing: border-box;
  transition: border-color 0.3s;
  background: white;
  cursor: pointer;
}

.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.modal-large {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 10px;
}

.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  font-size: 14px;
  color: #2c3e50;
  box-sizing: border-box;
  transition: border-color 0.3s;
  background: white;
}

.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.processed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.profit {
  color: #27ae60;
  font-weight: 600;
}

.loss {
  color: #e74c3c;
  font-weight: 600;
}

.action-btn {
  padding: 6px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-right: 8px;
  transition: opacity 0.3s;
}

.action-btn:hover {
  opacity: 0.8;
}

.action-btn.edit {
  background: #3498db;
  color: white;
}

.action-btn.delete {
  background: #e74c3c;
  color: white;
}

.action-btn.process {
  background: #27ae60;
  color: white;
}

.action-btn.view {
  background: #95a5a6;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 2px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  font-size: 14px;
  color: #2c3e50;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.error-msg {
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.char-count {
  display: block;
  text-align: right;
  color: #95a5a6;
  font-size: 12px;
  margin-top: 5px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 25px;
  border-top: 1px solid #ecf0f1;
}

.cancel-btn,
.submit-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s;
}

.cancel-btn {
  background: #ecf0f1;
  color: #2c3e50;
}

.cancel-btn:hover {
  opacity: 0.8;
}

.submit-btn {
  background: #27ae60;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.8;
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.radio-group {
  display: flex;
  gap: 30px;
  padding: 10px 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.radio-label input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.radio-label span {
  color: #2c3e50;
  font-size: 14px;
}
</style>
