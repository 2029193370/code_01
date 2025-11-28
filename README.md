# 佛山迈丹娜科技有限公司 - 综合开发者考试

本项目包含两个主要任务的实现：

1. **TypeScript Logger 日志系统** - 可扩展的日志记录器
2. **线上图书系统 SPA** - **Vue 3 + TypeScript + Redux** 单页面应用

## 项目结构

```
mdn-exam/
├── logger/                    # 任务一：Logger 日志系统
│   ├── src/
│   │   ├── index.ts          # 导出入口
│   │   ├── Logger.ts         # Logger 主类
│   │   ├── types.ts          # 类型定义
│   │   ├── transports/       # 传输层（输出目标）
│   │   │   ├── Transport.ts  # 抽象基类
│   │   │   ├── ConsoleTransport.ts
│   │   │   └── FileTransport.ts
│   │   └── formatters/       # 格式化器
│   │       ├── Formatter.ts  # 抽象基类
│   │       ├── DefaultFormatter.ts
│   │       └── JsonFormatter.ts
│   ├── examples/
│   │   └── basic.ts          # 使用示例
│   ├── README.md             # 详细文档
│   └── package.json
│
├── bookstore-vue/             # 任务二：线上图书系统（Vue + Redux）
│   ├── src/
│   │   ├── main.ts           # 应用入口
│   │   ├── App.vue           # 主组件
│   │   ├── store/            # Redux 状态管理
│   │   │   ├── index.ts      # Store 配置
│   │   │   └── booksSlice.ts # 书籍状态切片
│   │   ├── composables/      # Vue Composables
│   │   │   └── useRedux.ts   # Redux-Vue 集成
│   │   ├── components/       # Vue 组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── BookList.vue
│   │   │   ├── BookCard.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── AddBookModal.vue
│   │   │   └── EditBookModal.vue
│   │   └── types/
│   │       └── Book.ts
│   └── package.json
│
└── README.md                  # 本文件
```

---

## 任务一：Logger 日志系统

### 快速开始

```bash
cd logger
npm install
npx ts-node examples/basic.ts
```

### 主要特性

- ✅ 四种日志等级：`verbose`、`info`、`warning`、`error`
- ✅ 统一的日志记录接口
- ✅ 可扩展的 Transport 架构（Console、File）
- ✅ 可扩展的 Formatter 架构（Default、JSON）
- ✅ 支持子 Logger 和上下文
- ✅ 完整的 TypeScript 类型定义

### 使用示例

```typescript
import { Logger, LogLevel, FileTransport } from './src';

// 创建 Logger
const logger = new Logger({ context: 'MyApp' });

// 记录日志
logger.info('应用程序已启动');
logger.error('发生错误', { errorCode: 500 });

// 添加文件输出
logger.addTransport(new FileTransport({ 
  filePath: './app.log' 
}));
```

### 架构设计

详见 [logger/README.md](./logger/README.md)

---

## 任务二：线上图书系统（Vue 3 + Redux）

### 技术亮点：Vue + Redux 集成

本项目展示了如何在 **Vue 3** 中使用 **Redux Toolkit** 进行状态管理。

Redux 是一个**框架无关**的状态管理库，虽然通常与 React 配合使用，但也完全可以在 Vue 中使用。

#### Vue-Redux 集成方案

通过自定义 Vue Composables 实现类似 React-Redux 的 hooks API：

```typescript
// composables/useRedux.ts
export function useSelector<T>(selector: (state: RootState) => T): Readonly<Ref<T>>
export function useDispatch(): AppDispatch
```

使用方式：

```vue
<script setup lang="ts">
import { useSelector, useDispatch } from '../composables/useRedux';
import { addBook, deleteBook } from '../store';

// 类似 React 的 useSelector
const books = useSelector(state => state.books.books);

// 类似 React 的 useDispatch
const dispatch = useDispatch();

// 派发 action
dispatch(addBook({ title: '新书', price: 59, ... }));
</script>
```

### 快速开始

```bash
cd bookstore-vue
npm install
npm run dev
```

然后在浏览器访问 `http://localhost:5173`

### 主要功能

- ✅ 书籍列表展示（书名、价格、分类）
- ✅ 添加书籍（弹窗表单）
- ✅ 编辑书籍（点击书籍进入编辑）
- ✅ 删除书籍（单个删除 + 批量删除）
- ✅ 全选/取消全选
- ✅ 多字段排序功能
- ✅ **Redux Toolkit 状态管理**
- ✅ 响应式设计
- ✅ 现代化 UI 设计

### 技术栈

- **Vue 3** + **TypeScript**
- **Redux Toolkit** - 状态管理（框架无关）
- **Vite** - 构建工具
- **CSS3** - 样式（无第三方 UI 库）

### 部署到 GitHub Pages

```bash
cd bookstore-vue
npm run build
# 将 dist 目录部署到 GitHub Pages
```

---

## 项目亮点

### Logger 系统

1. **分层架构** - Logger → Transport → Formatter
2. **开闭原则** - 通过继承扩展，无需修改现有代码
3. **单一职责** - 每个类只负责一项功能
4. **模拟文件 I/O** - 展示扩展至真实文件系统的可能性

### 图书系统

1. **Vue + Redux** - 展示 Redux 的框架无关特性
2. **自定义 Composables** - 优雅地在 Vue 中使用 Redux
3. **类型安全** - 完整的 TypeScript 类型覆盖
4. **用户体验** - 动画效果、响应式设计、快捷键支持
5. **代码组织** - 清晰的文件结构，组件化开发

---

## 开发说明

### 环境要求

- Node.js >= 18
- npm >= 9

### 本地开发

```bash
# Logger 开发
cd logger
npm install
npm run build       # 编译 TypeScript
npm run example     # 运行示例

# Bookstore 开发
cd bookstore-vue
npm install
npm run dev         # 启动开发服务器
npm run build       # 构建生产版本
npm run preview     # 预览生产版本
```

---

## 许可证

MIT License

---

*佛山迈丹娜科技有限公司 综合开发者考试提交*
