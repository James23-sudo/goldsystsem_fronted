<template>
  <div>
    <div class="content-header">
      <h2>用户数据看板</h2>
      <div class="button-group">
        <button class="add-btn" @click="showAddCustomerModal">+ 新增客户</button>
        <button class="add-btn data-btn" @click="showAddDataModal">+ 新增客户数据</button>
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

    <!-- Data Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>
              <span :class="['status-badge', item.status]">
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.date }}</td>
            <td>
              <button class="action-btn edit">Edit</button>
              <button class="action-btn delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import axios from 'axios'

export default {
  name: 'UserDashboard',
  setup() {
    const tableData = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', date: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', date: '2024-02-20' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', date: '2024-03-10' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', date: '2024-04-05' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'pending', date: '2024-05-12' }
    ])

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
      alert('新增客户数据功能开发中...')
    }

    const closeModal = () => {
      isAddCustomerModalVisible.value = false
      resetForm()
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
        const response = await axios.post('/api/user/add', {
          id: formData.userAccount,
          remark: formData.remarks
        })

        if (response.data.code === 200 || response.data.success) {
          alert('客户添加成功！')
          closeModal()
          // Optionally refresh table data here
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

    return {
      tableData,
      isAddCustomerModalVisible,
      isSubmitting,
      formData,
      errors,
      showAddCustomerModal,
      showAddDataModal,
      closeModal,
      validateUserAccount,
      validateRemarks,
      submitAddCustomer
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

.table-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
}

.data-table td {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #34495e;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
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
  margin-bottom: 20px;
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
</style>
