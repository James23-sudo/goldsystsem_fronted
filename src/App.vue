<template>
  <div class="admin-container">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <h1>BillionGold <span class="currency">统一交易单位:USD</span></h1>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <div 
            v-for="item in menuItems" 
            :key="item.id"
            :class="['menu-item', { active: activeMenu === item.id }]"
            @click="activeMenu = item.id"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-text">{{ item.text }}</span>
          </div>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="content">
        <UserDashboard v-if="activeMenu === 'dashboard'" />
        <HistoryDashboard v-if="activeMenu === 'history'" />
        <PriceDashboard v-if="activeMenu === 'price'" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import UserDashboard from './components/UserDashboard.vue'
import HistoryDashboard from './components/HistoryDashboard.vue'
import PriceDashboard from './components/PriceDashboard.vue'

export default {
  name: 'App',
  components: {
    UserDashboard,
    HistoryDashboard,
    PriceDashboard
  },
  setup() {
    const activeMenu = ref('dashboard')
    
    const menuItems = [
      { id: 'dashboard', icon: '📊', text: '用户数据看板' },
      { id: 'history', icon: '📈', text: '历史数据看板' },
      { id: 'price', icon: '💰', text: '查看价格' }
    ]

    return {
      activeMenu,
      menuItems
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: #fff;
  padding: 0 30px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

.currency {
  color: #e74c3c;
  font-size: 18px;
  margin-left: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 70px);
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  padding: 20px 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 15px 30px;
  color: #ecf0f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.menu-item:hover {
  background: #34495e;
}

.menu-item.active {
  background: #3498db;
  border-left: 4px solid #2980b9;
}

.menu-icon {
  font-size: 20px;
}

.menu-text {
  font-size: 16px;
}

.content {
  flex: 1;
  padding: 30px;
}
</style>
