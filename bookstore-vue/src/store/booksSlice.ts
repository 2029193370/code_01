import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book, NewBook, UpdateBook, SortConfig } from '../types/Book';

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 初始书籍数据
 */
const initialBooks: Book[] = [
  {
    id: generateId(),
    title: 'JavaScript 高级程序设计',
    price: 129.00,
    category: '编程',
    description: '一本全面深入学习 JavaScript 的权威指南，涵盖 ES6+ 新特性。',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: generateId(),
    title: '深入浅出 Vue.js',
    price: 89.00,
    category: '编程',
    description: '从零开始学习 Vue.js，包含 Composition API、Pinia 等核心概念。',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: generateId(),
    title: '三体',
    price: 68.00,
    category: '科幻',
    description: '刘慈欣著作的科幻小说，讲述人类与三体文明的故事。',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: generateId(),
    title: '人类简史',
    price: 59.00,
    category: '历史',
    description: '以全新的视角审视人类历史，探讨人类如何成为地球的主宰。',
    createdAt: Date.now() - 86400000,
  },
];

/**
 * 书籍状态接口
 */
export interface BooksState {
  /** 书籍列表 */
  books: Book[];
  /** 排序配置 */
  sortConfig: SortConfig;
  /** 选中的书籍 ID（用于批量删除） */
  selectedIds: string[];
}

/**
 * 初始状态
 */
const initialState: BooksState = {
  books: initialBooks,
  sortConfig: {
    field: 'createdAt',
    direction: 'desc',
  },
  selectedIds: [],
};

/**
 * 书籍 Slice
 */
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    /**
     * 添加书籍
     */
    addBook: (state, action: PayloadAction<NewBook>) => {
      const newBook: Book = {
        ...action.payload,
        id: generateId(),
        createdAt: Date.now(),
      };
      state.books.push(newBook);
    },

    /**
     * 更新书籍
     */
    updateBook: (state, action: PayloadAction<UpdateBook>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1 && state.books[index]) {
        const { title, price, category, description } = action.payload;
        const book = state.books[index]!;
        if (title !== undefined) book.title = title;
        if (price !== undefined) book.price = price;
        if (category !== undefined) book.category = category;
        if (description !== undefined) book.description = description;
      }
    },

    /**
     * 删除单本书籍
     */
    deleteBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },

    /**
     * 批量删除书籍
     */
    deleteBooks: (state, action: PayloadAction<string[]>) => {
      const idsToDelete = new Set(action.payload);
      state.books = state.books.filter(book => !idsToDelete.has(book.id));
      state.selectedIds = [];
    },

    /**
     * 切换书籍选中状态
     */
    toggleSelectBook: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },

    /**
     * 全选/取消全选
     */
    toggleSelectAll: (state) => {
      if (state.selectedIds.length === state.books.length) {
        state.selectedIds = [];
      } else {
        state.selectedIds = state.books.map(book => book.id);
      }
    },

    /**
     * 清空选择
     */
    clearSelection: (state) => {
      state.selectedIds = [];
    },

    /**
     * 设置排序
     */
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  addBook,
  updateBook,
  deleteBook,
  deleteBooks,
  toggleSelectBook,
  toggleSelectAll,
  clearSelection,
  setSortConfig,
} = booksSlice.actions;

export default booksSlice.reducer;

