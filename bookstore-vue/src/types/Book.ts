/**
 * 书籍接口定义
 */
export interface Book {
  /** 唯一标识符 */
  id: string;
  /** 书名 */
  title: string;
  /** 价格 */
  price: number;
  /** 分类 */
  category: string;
  /** 描述 */
  description: string;
  /** 创建时间 */
  createdAt: number;
}

/**
 * 新增书籍时的数据（不含 id 和 createdAt）
 */
export type NewBook = Omit<Book, 'id' | 'createdAt'>;

/**
 * 更新书籍时的数据
 */
export type UpdateBook = Partial<NewBook> & { id: string };

/**
 * 排序字段
 */
export type SortField = 'title' | 'price' | 'category' | 'createdAt';

/**
 * 排序方向
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 排序配置
 */
export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

