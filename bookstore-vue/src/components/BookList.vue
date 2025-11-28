<script setup lang="ts">
import { computed } from 'vue';
import { useSelector } from '../composables/useRedux';
import type { Book } from '../types/Book';
import BookCard from './BookCard.vue';

const books = useSelector(state => state.books.books);
const sortConfig = useSelector(state => state.books.sortConfig);

/**
 * 排序后的书籍列表
 */
const sortedBooks = computed(() => {
  const sorted = [...books.value];
  
  sorted.sort((a: Book, b: Book) => {
    let compareResult = 0;
    
    switch (sortConfig.value.field) {
      case 'title':
        compareResult = a.title.localeCompare(b.title, 'zh-CN');
        break;
      case 'price':
        compareResult = a.price - b.price;
        break;
      case 'category':
        compareResult = a.category.localeCompare(b.category, 'zh-CN');
        break;
      case 'createdAt':
        compareResult = a.createdAt - b.createdAt;
        break;
      default:
        compareResult = 0;
    }

    return sortConfig.value.direction === 'asc' ? compareResult : -compareResult;
  });

  return sorted;
});
</script>

<template>
  <div v-if="books.length === 0" class="empty-state">
    <div class="empty-icon">📚</div>
    <h3>暂无书籍</h3>
    <p>点击上方「添加书籍」按钮开始添加您的第一本书吧！</p>
  </div>

  <div v-else class="book-list">
    <BookCard 
      v-for="book in sortedBooks" 
      :key="book.id" 
      :book="book" 
    />
  </div>
</template>

<style scoped>
.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(145deg, #1e1e2e 0%, #252538 100%);
  border-radius: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state h3 {
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .book-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

