<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.prop" 
              :style="{ width: column.width }" 
              :class="column.fixed ? 'fixed-column' : ''"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item[rowKey]">
            <td 
              v-for="column in columns" 
              :key="column.prop" 
              :class="[column.fixed ? 'fixed-column' : '', getCellClass(column, item)]"
            >
              <slot :name="`column-${column.prop}`" :row="item" :column="column">
                {{ formatCell(column.prop, item) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="pagination-container" v-if="showPagination">
      <div class="pagination-info">
        共{{ total }}条
      </div>
      <div class="pagination-controls">
        <select v-model="currentPageSize" @change="handlePageSizeChange" class="page-size-select">
          <option :value="5">5条/页</option>
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
          <option :value="50">50条/页</option>
          <option :value="100">100条/页</option>
        </select>
        <button 
          class="page-btn" 
          :disabled="!canGoPrev" 
          @click="handlePageChange(currentPageNum - 1)"
        >
          上一页
        </button>
        <span class="page-number">{{ currentPageNum }} / {{ totalPages }}</span>
        <button 
          class="page-btn" 
          :disabled="!canGoNext" 
          @click="handlePageChange(currentPageNum + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DataTable',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  emits: ['page-change', 'page-size-change'],
  setup(props, { emit }) {
    const currentPageNum = ref(props.currentPage)
    const currentPageSize = ref(props.pageSize)

    const totalPages = computed(() => {
      if (props.total === 0) return 1
      return Math.ceil(props.total / currentPageSize.value)
    })

    const canGoNext = computed(() => {
      return currentPageNum.value < totalPages.value && props.total > 0
    })

    const canGoPrev = computed(() => {
      return currentPageNum.value > 1
    })

    watch(() => props.currentPage, (newVal) => {
      currentPageNum.value = newVal
    })

    watch(() => props.pageSize, (newVal) => {
      currentPageSize.value = newVal
    })

    const handlePageChange = (page) => {
      currentPageNum.value = page
      emit('page-change', page)
    }

    const handlePageSizeChange = () => {
      currentPageNum.value = 1
      emit('page-size-change', currentPageSize.value)
    }

    const formatCell = (prop, item) => {
      const value = item[prop]
      return value !== null && value !== undefined ? value : '-'
    }

    const getCellClass = (column, item) => {
      if (column.cellClass) {
        return typeof column.cellClass === 'function' 
          ? column.cellClass(item) 
          : column.cellClass
      }
      return ''
    }

    return {
      currentPageNum,
      currentPageSize,
      totalPages,
      canGoNext,
      canGoPrev,
      handlePageChange,
      handlePageSizeChange,
      formatCell,
      getCellClass
    }
  }
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-wrapper {
  overflow-x: auto;
  position: relative;
}

.data-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  position: relative;
}

.data-table th {
  text-align: left;
  padding: 15px;
  border-bottom: 2px solid #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
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

.fixed-column {
  position: sticky;
  right: 0;
  background: white;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.data-table thead th.fixed-column {
  background: white;
}

.data-table tbody tr:hover td.fixed-column {
  background: #f8f9fa;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.pagination-info {
  color: #2c3e50;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-select {
  padding: 6px 10px;
  border: 1px solid #dfe6e9;
  border-radius: 4px;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  background: white;
}

.page-size-select:focus {
  outline: none;
  border-color: #3498db;
}

.page-btn {
  padding: 6px 15px;
  background: white;
  border: 1px solid #dfe6e9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.page-btn:disabled {
  background: #ecf0f1;
  color: #95a5a6;
  cursor: not-allowed;
  border-color: #ecf0f1;
}

.page-number {
  color: #2c3e50;
  font-size: 14px;
  min-width: 80px;
  text-align: center;
}
</style>
