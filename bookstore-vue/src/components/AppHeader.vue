<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSelector, useDispatch } from '../composables/useRedux';
import { deleteBooks, toggleSelectAll, clearSelection, setSortConfig } from '../store';
import type { SortField, SortDirection } from '../types/Book';
import AddBookModal from './AddBookModal.vue';

const dispatch = useDispatch();
const books = useSelector(state => state.books.books);
const selectedIds = useSelector(state => state.books.selectedIds);
const sortConfig = useSelector(state => state.books.sortConfig);

const showAddModal = ref(false);

const hasSelection = computed(() => selectedIds.value.length > 0);
const isAllSelected = computed(() => 
  selectedIds.value.length === books.value.length && books.value.length > 0
);

/**
 * 处理批量删除
 */
const handleBatchDelete = () => {
  if (selectedIds.value.length > 0) {
    if (window.confirm(`确定要删除选中的 ${selectedIds.value.length} 本书籍吗？`)) {
      dispatch(deleteBooks([...selectedIds.value]));
    }
  }
};

/**
 * 处理排序变更
 */
const handleSortChange = (field: SortField) => {
  const newDirection: SortDirection = 
    sortConfig.value.field === field && sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  dispatch(setSortConfig({ field, direction: newDirection }));
};

/**
 * 获取排序图标
 */
const getSortIcon = (field: SortField) => {
  if (sortConfig.value.field !== field) return '↕';
  return sortConfig.value.direction === 'asc' ? '↑' : '↓';
};

/**
 * 处理全选
 */
const handleToggleSelectAll = () => {
  dispatch(toggleSelectAll());
};

/**
 * 清除选择
 */
const handleClearSelection = () => {
  dispatch(clearSelection());
};
</script>

<template>
  <header class="header">
    <div class="header-top">
      <div class="header-brand">
        <h1>📚 线上书店</h1>
        <span class="book-count">共 {{ books.length }} 本书籍</span>
      </div>
      <button 
        class="btn btn-primary add-btn"
        @click="showAddModal = true"
      >
        <span class="btn-icon">+</span>
        添加书籍
      </button>
    </div>

    <div class="header-controls">
      <div class="selection-controls">
        <label class="checkbox-wrapper">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="handleToggleSelectAll"
          />
          <span class="checkmark"></span>
          <span class="checkbox-label">
            {{ isAllSelected ? '取消全选' : '全选' }}
          </span>
        </label>
        
        <template v-if="hasSelection">
          <span class="selected-count">已选 {{ selectedIds.length }} 本</span>
          <button 
            class="btn btn-danger btn-sm"
            @click="handleBatchDelete"
          >
            批量删除
          </button>
          <button 
            class="btn btn-secondary btn-sm"
            @click="handleClearSelection"
          >
            取消选择
          </button>
        </template>
      </div>

      <div class="sort-controls">
        <span class="sort-label">排序：</span>
        <button 
          :class="['sort-btn', { active: sortConfig.field === 'title' }]"
          @click="handleSortChange('title')"
        >
          书名 {{ getSortIcon('title') }}
        </button>
        <button 
          :class="['sort-btn', { active: sortConfig.field === 'price' }]"
          @click="handleSortChange('price')"
        >
          价格 {{ getSortIcon('price') }}
        </button>
        <button 
          :class="['sort-btn', { active: sortConfig.field === 'category' }]"
          @click="handleSortChange('category')"
        >
          分类 {{ getSortIcon('category') }}
        </button>
        <button 
          :class="['sort-btn', { active: sortConfig.field === 'createdAt' }]"
          @click="handleSortChange('createdAt')"
        >
          添加时间 {{ getSortIcon('createdAt') }}
        </button>
      </div>
    </div>

    <AddBookModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
    />
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-brand {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.header-brand h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.book-count {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

.btn-icon {
  font-size: 1.25rem;
  font-weight: 300;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.selection-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-wrapper:hover .checkmark {
  border-color: #e94560;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: #e94560;
  border-color: #e94560;
}

.checkbox-wrapper input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.selected-count {
  color: #e94560;
  font-weight: 600;
  font-size: 0.9rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.sort-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sort-btn.active {
  background: rgba(233, 69, 96, 0.2);
  border-color: #e94560;
  color: #e94560;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-controls {
    flex-wrap: wrap;
  }
}
</style>

