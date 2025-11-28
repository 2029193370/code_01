import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';

/**
 * Redux Store 配置
 * 
 * 注意：这是在 Vue 中使用 Redux 的示例
 * Redux 是一个框架无关的状态管理库
 */
export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

/**
 * RootState 类型
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch 类型
 */
export type AppDispatch = typeof store.dispatch;

// 导出 actions
export * from './booksSlice';

