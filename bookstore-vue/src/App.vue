<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import BookList from './components/BookList.vue';
</script>

<template>
  <div class="app">
    <div class="app-container">
      <AppHeader />
      <main class="main-content">
        <BookList />
      </main>
      <footer class="app-footer">
        <p>© 2024 线上书店 - 佛山迈丹娜科技有限公司 | Vue 3 + TypeScript + Redux</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  background-attachment: fixed;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.app-footer {
  text-align: center;
  padding: 2rem 0 1rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.app-footer p {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }
}
</style>
