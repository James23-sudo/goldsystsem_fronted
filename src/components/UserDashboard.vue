<template>
  <div>
    <div class="content-header">
      <h2>用户数据看板</h2>
      <button class="add-btn">+ Add New</button>
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
            <th>Actions</th>
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
import { ref } from 'vue'

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

    return {
      tableData
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
</style>
