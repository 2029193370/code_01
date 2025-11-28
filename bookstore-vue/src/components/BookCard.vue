<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSelector, useDispatch } from '../composables/useRedux';
import { deleteBook, toggleSelectBook } from '../store';
import type { Book } from '../types/Book';
import EditBookModal from './EditBookModal.vue';

interface Props {
  book: Book;
}

const props = defineProps<Props>();

const dispatch = useDispatch();
const selectedIds = useSelector(state => state.books.selectedIds);
const showEditModal = ref(false);

const isSelected = computed(() => selectedIds.value.includes(props.book.id));

/**
 * 处理删除
 */
const handleDelete = (e: Event) => {
  e.stopPropagation();
  if (window.confirm(`确定要删除《${props.book.title}》吗？`)) {
    dispatch(deleteBook(props.book.id));
  }
};

/**
 * 处理选择
 */
const handleSelect = (e: Event) => {
  e.stopPropagation();
  dispatch(toggleSelectBook(props.book.id));
};

/**
 * 格式化价格
 */
const formatPrice = (price: number) => {
  return `¥${price.toFixed(2)}`;
};

/**
 * 获取分类颜色
 */
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    '编程': '#00d9ff',
    '科幻': '#ff6b9d',
    '历史': '#ffd93d',
    '文学': '#6bcb77',
    '经济': '#4d96ff',
    '哲学': '#c9b1ff',
  };
  return colors[category] || '#a0a0a0';
};

const categoryStyle = computed(() => {
  const color = getCategoryColor(props.book.category);
  return {
    backgroundColor: `${color}20`,
    color: color,
    borderColor: color,
  };
});
</script>

<template>
  <div 
    :class="['book-card', { selected: isSelected }]"
    @click="showEditModal = true"
  >
    <div class="book-card-checkbox" @click="handleSelect">
      <input
        type="checkbox"
        :checked="isSelected"
        @change="() => {}"
      />
      <span class="checkmark"></span>
    </div>

    <div class="book-card-content">
      <div class="book-card-header">
        <h3 class="book-title">{{ book.title }}</h3>
        <span 
          class="book-category"
          :style="categoryStyle"
        >
          {{ book.category }}
        </span>
      </div>

      <p class="book-description">{{ book.description }}</p>

      <div class="book-card-footer">
        <span class="book-price">{{ formatPrice(book.price) }}</span>
        <button 
          class="btn btn-danger btn-sm delete-btn"
          @click="handleDelete"
        >
          删除
        </button>
      </div>
    </div>
  </div>

  <EditBookModal 
    v-if="showEditModal"
    :book="book"
    @close="showEditModal = false" 
  />
</template>

<style scoped>
.book-card {
  background: linear-gradient(145deg, #1e1e2e 0%, #252538 100%);
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(233, 69, 96, 0.3);
}

.book-card.selected {
  border-color: #e94560;
  background: linear-gradient(145deg, #2a1f2d 0%, #2d2540 100%);
}

.book-card-checkbox {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.book-card-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.book-card-checkbox .checkmark {
  width: 22px;
  height: 22px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.book-card-checkbox:hover .checkmark {
  border-color: #e94560;
  background: rgba(233, 69, 96, 0.1);
}

.book-card-checkbox input:checked ~ .checkmark {
  background: #e94560;
  border-color: #e94560;
}

.book-card-checkbox input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.book-card-content {
  padding-left: 2rem;
}

.book-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.book-category {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  border: 1px solid;
  font-weight: 500;
  white-space: nowrap;
}

.book-description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e94560;
  letter-spacing: -0.02em;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.book-card:hover .delete-btn {
  opacity: 1;
}

@media (max-width: 640px) {
  .book-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .delete-btn {
    opacity: 1;
  }
}
</style>

