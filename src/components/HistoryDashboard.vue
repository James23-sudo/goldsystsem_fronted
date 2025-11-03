<template>
  <div>
    <div class="content-header">
      <h2>历史数据看板</h2>
      <button class="export-btn">Export Data</button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-info">
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.title }}</p>
        </div>
      </div>
    </div>

    <!-- Historical Data Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Date</th>
            <th>Activity</th>
            <th>User</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historyData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.activity }}</td>
            <td>{{ item.user }}</td>
            <td>{{ item.amount }}</td>
            <td>
              <span :class="['type-badge', item.type]">
                {{ item.type }}
              </span>
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
  name: 'HistoryDashboard',
  setup() {
    const stats = ref([
      { title: 'Total Records', value: '5,234', icon: '📝' },
      { title: 'This Month', value: '892', icon: '📅' },
      { title: 'Last Month', value: '1,045', icon: '📊' },
      { title: 'Average Daily', value: '175', icon: '📈' }
    ])

    const historyData = ref([
      { id: 'H001', date: '2024-05-15', activity: 'User Registration', user: 'John Doe', amount: '$0', type: 'signup' },
      { id: 'H002', date: '2024-05-14', activity: 'Purchase', user: 'Jane Smith', amount: '$299', type: 'purchase' },
      { id: 'H003', date: '2024-05-14', activity: 'Login', user: 'Bob Johnson', amount: '$0', type: 'login' },
      { id: 'H004', date: '2024-05-13', activity: 'Purchase', user: 'Alice Brown', amount: '$149', type: 'purchase' },
      { id: 'H005', date: '2024-05-13', activity: 'Refund', user: 'Charlie Wilson', amount: '-$89', type: 'refund' },
      { id: 'H006', date: '2024-05-12', activity: 'User Registration', user: 'David Lee', amount: '$0', type: 'signup' },
      { id: 'H007', date: '2024-05-12', activity: 'Purchase', user: 'Emma Davis', amount: '$499', type: 'purchase' },
      { id: 'H008', date: '2024-05-11', activity: 'Login', user: 'Frank Miller', amount: '$0', type: 'login' }
    ])

    return {
      stats,
      historyData
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

.export-btn {
  padding: 10px 25px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.export-btn:hover {
  background: #8e44ad;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 40px;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
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

.type-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.signup {
  background: #d1ecf1;
  color: #0c5460;
}

.type-badge.purchase {
  background: #d4edda;
  color: #155724;
}

.type-badge.login {
  background: #e2e3e5;
  color: #383d41;
}

.type-badge.refund {
  background: #f8d7da;
  color: #721c24;
}
</style>
