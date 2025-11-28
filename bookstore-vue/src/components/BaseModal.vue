<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  title: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLDivElement | null>(null);

/**
 * 处理点击外部关闭
 */
const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close');
  }
};

/**
 * 处理 ESC 键关闭
 */
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.body.style.overflow = 'hidden';
  modalRef.value?.focus();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div 
      class="modal" 
      ref="modalRef" 
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-header">
        <h2 class="modal-title">{{ props.title }}</h2>
        <button 
          class="modal-close"
          @click="emit('close')"
          aria-label="关闭"
        >
          ×
        </button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: linear-gradient(145deg, #1e1e2e 0%, #252538 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  line-height: 1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(233, 69, 96, 0.2);
  color: #e94560;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

@media (max-width: 480px) {
  .modal {
    max-height: 100vh;
    border-radius: 16px 16px 0 0;
    max-width: 100%;
  }

  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }
}
</style>

