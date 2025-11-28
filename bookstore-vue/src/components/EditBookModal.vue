<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useDispatch } from '../composables/useRedux';
import { updateBook, deleteBook } from '../store';
import type { Book } from '../types/Book';
import BaseModal from './BaseModal.vue';

interface Props {
  book: Book;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const dispatch = useDispatch();

const CATEGORIES = ['编程', '科幻', '历史', '文学', '经济', '哲学', '其他'];

const formData = reactive({
  title: props.book.title,
  price: props.book.price.toString(),
  category: props.book.category,
  description: props.book.description,
});

const errors = ref<Record<string, string>>({});

/**
 * 表单验证
 */
const validate = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = '请输入书名';
  }

  const price = parseFloat(formData.price);
  if (!formData.price || isNaN(price) || price <= 0) {
    newErrors.price = '请输入有效的价格';
  }

  if (!formData.category) {
    newErrors.category = '请选择分类';
  }

  if (!formData.description.trim()) {
    newErrors.description = '请输入描述';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

/**
 * 处理保存
 */
const handleSubmit = () => {
  if (!validate()) {
    return;
  }

  dispatch(updateBook({
    id: props.book.id,
    title: formData.title.trim(),
    price: parseFloat(formData.price),
    category: formData.category,
    description: formData.description.trim(),
  }));

  emit('close');
};

/**
 * 处理删除
 */
const handleDelete = () => {
  if (window.confirm(`确定要删除《${props.book.title}》吗？`)) {
    dispatch(deleteBook(props.book.id));
    emit('close');
  }
};

/**
 * 清除错误
 */
const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
};
</script>

<template>
  <BaseModal title="编辑书籍" @close="emit('close')">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="edit-title">书名 *</label>
        <input
          type="text"
          id="edit-title"
          v-model="formData.title"
          @input="clearError('title')"
          placeholder="请输入书名"
        />
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="edit-price">价格 *</label>
        <input
          type="number"
          id="edit-price"
          v-model="formData.price"
          @input="clearError('price')"
          placeholder="请输入价格"
          min="0"
          step="0.01"
        />
        <span v-if="errors.price" class="error-text">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label for="edit-category">分类 *</label>
        <select
          id="edit-category"
          v-model="formData.category"
          @change="clearError('category')"
        >
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <span v-if="errors.category" class="error-text">{{ errors.category }}</span>
      </div>

      <div class="form-group">
        <label for="edit-description">描述 *</label>
        <textarea
          id="edit-description"
          v-model="formData.description"
          @input="clearError('description')"
          placeholder="请输入书籍描述"
          rows="3"
        ></textarea>
        <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-danger" 
          @click="handleDelete"
        >
          删除
        </button>
        <button type="button" class="btn btn-secondary" @click="emit('close')">
          取消
        </button>
        <button type="submit" class="btn btn-primary">
          保存
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #e94560;
  background: rgba(233, 69, 96, 0.05);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.form-group select option {
  background: #252538;
  color: #fff;
}

.error-text {
  display: block;
  color: #ff4757;
  font-size: 0.8125rem;
  margin-top: 0.375rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.form-actions .btn {
  flex: 1;
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>

