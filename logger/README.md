# Logger 日志系统

一个灵活、可扩展的 TypeScript 日志记录系统，专为 Web 应用设计。

## 特性

- ✅ **四种日志等级**: `verbose`、`info`、`warning`、`error`
- ✅ **统一接口**: 简洁的 API 设计，易于使用
- ✅ **可扩展架构**: 基于 Transport 和 Formatter 的插件化设计
- ✅ **多输出支持**: 同时输出到 Console、File 等多个目标
- ✅ **格式化器**: 支持默认格式和 JSON 格式，可自定义
- ✅ **上下文支持**: 支持模块/组件级别的上下文标识
- ✅ **子 Logger**: 创建继承父配置的子 Logger
- ✅ **类型安全**: 完整的 TypeScript 类型定义

## 安装

```bash
cd logger
npm install
npm run build
```

## 快速开始

### 基本使用

```typescript
import { Logger } from '@mdn-exam/logger';

// 创建 Logger 实例
const logger = new Logger({ context: 'MyApp' });

// 记录不同等级的日志
logger.verbose('调试信息');
logger.info('应用程序已启动');
logger.warning('内存使用率较高');
logger.error('数据库连接失败');
```

### 带元数据的日志

```typescript
logger.info('用户登录成功', { 
  userId: 12345, 
  username: 'john_doe' 
});

logger.error('API 请求失败', {
  endpoint: '/api/users',
  statusCode: 500
});
```

### 设置最低日志等级

```typescript
import { Logger, LogLevel } from '@mdn-exam/logger';

// 生产环境只记录 WARNING 及以上级别
const logger = new Logger({ 
  context: 'Production',
  minLevel: LogLevel.WARNING
});

logger.info('这条不会显示');  // 被过滤
logger.warning('这条会显示');
```

### 创建子 Logger

```typescript
const mainLogger = new Logger({ context: 'Server' });
const dbLogger = mainLogger.child('Database');
const authLogger = mainLogger.child('Auth');

dbLogger.info('数据库连接成功');
// 输出: [2024-01-15T10:30:00.000Z] [INFO   ] [Server:Database] 数据库连接成功
```

### 添加文件输出

```typescript
import { Logger, FileTransport } from '@mdn-exam/logger';

const logger = new Logger({ context: 'MyApp' });

// 添加文件 Transport
logger.addTransport(new FileTransport({ 
  filePath: './logs/app.log',
  minLevel: LogLevel.INFO
}));

logger.info('这条日志会同时输出到控制台和文件');
```

### 使用 JSON 格式化器

```typescript
import { Logger, ConsoleTransport, JsonFormatter } from '@mdn-exam/logger';

const logger = new Logger({ context: 'API' });
const transport = new ConsoleTransport({ colorize: false });
transport.setFormatter(new JsonFormatter(true));
logger.setTransport(transport);

logger.info('Request received', { path: '/api/users' });
// 输出 JSON 格式的日志
```

## 架构设计

### 设计理念

本 Logger 系统采用 **分层架构** 设计，遵循 **单一职责原则** 和 **开闭原则**：

```
┌─────────────────────────────────────────────────────────┐
│                        Logger                           │
│  - 提供统一的日志记录接口                                 │
│  - 管理日志等级过滤                                      │
│  - 协调多个 Transport                                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Transport                          │
│  - 负责将日志输出到特定目标                               │
│  - ConsoleTransport: 输出到控制台                        │
│  - FileTransport: 输出到文件                            │
│  - 可扩展: HTTP、数据库等                                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Formatter                          │
│  - 负责格式化日志条目                                    │
│  - DefaultFormatter: 人类可读格式                        │
│  - JsonFormatter: JSON 格式                             │
│  - 可扩展: 自定义模板等                                  │
└─────────────────────────────────────────────────────────┘
```

### 核心组件

1. **Logger**: 主类，提供 `verbose`、`info`、`warning`、`error` 方法
2. **Transport**: 抽象基类，定义日志输出目标的接口
3. **Formatter**: 抽象基类，定义日志格式化的接口
4. **LogEntry**: 日志条目数据结构，包含所有日志元数据

### 日志流程

```
用户调用 logger.info("message") 
    ↓
Logger 创建 LogEntry 对象
    ↓
检查日志等级是否满足最低要求
    ↓
遍历所有 Transport
    ↓
每个 Transport 使用其 Formatter 格式化消息
    ↓
Transport 将格式化后的消息写入目标位置
```

## 如何扩展

### 添加新的 Transport

```typescript
import { Transport, LogEntry, TransportConfig } from '@mdn-exam/logger';

// 例如：HTTP Transport
class HttpTransport extends Transport {
  private readonly endpoint: string;

  constructor(config: TransportConfig & { endpoint: string }) {
    super(config);
    this.endpoint = config.endpoint;
  }

  protected write(message: string, entry: LogEntry): void {
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, ...entry })
    });
  }
}

// 使用
logger.addTransport(new HttpTransport({ 
  endpoint: 'https://logs.example.com/ingest' 
}));
```

### 添加新的 Formatter

```typescript
import { Formatter, LogEntry, LogLevelNames } from '@mdn-exam/logger';

// 例如：简洁格式化器
class SimpleFormatter extends Formatter {
  format(entry: LogEntry): string {
    return `${LogLevelNames[entry.level]}: ${entry.message}`;
  }
}

// 使用
const transport = new ConsoleTransport();
transport.setFormatter(new SimpleFormatter());
```

### 真实文件 I/O 实现

当前 `FileTransport` 使用模拟实现。在实际 Node.js 环境中，可以替换为真实的文件操作：

```typescript
import * as fs from 'fs';

class RealFileTransport extends Transport {
  private readonly filePath: string;
  private readonly stream: fs.WriteStream;

  constructor(config: FileTransportConfig) {
    super(config);
    this.filePath = config.filePath;
    this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
  }

  protected write(message: string, _entry: LogEntry): void {
    this.stream.write(message + '\n');
  }

  close(): void {
    this.stream.end();
  }
}
```

## 文件结构

```
logger/
├── src/
│   ├── index.ts              # 导出入口
│   ├── Logger.ts             # Logger 主类
│   ├── types.ts              # 类型定义
│   ├── transports/
│   │   ├── index.ts          # Transport 导出
│   │   ├── Transport.ts      # Transport 抽象基类
│   │   ├── ConsoleTransport.ts
│   │   └── FileTransport.ts
│   └── formatters/
│       ├── index.ts          # Formatter 导出
│       ├── Formatter.ts      # Formatter 抽象基类
│       ├── DefaultFormatter.ts
│       └── JsonFormatter.ts
├── examples/
│   └── basic.ts              # 使用示例
├── package.json
├── tsconfig.json
└── README.md
```

## API 参考

### Logger

| 方法 | 说明 |
|------|------|
| `verbose(message, meta?)` | 记录 VERBOSE 等级日志 |
| `info(message, meta?)` | 记录 INFO 等级日志 |
| `warning(message, meta?)` | 记录 WARNING 等级日志 |
| `error(message, meta?)` | 记录 ERROR 等级日志 |
| `addTransport(transport)` | 添加 Transport |
| `setTransport(transport)` | 设置唯一 Transport |
| `clearTransports()` | 清除所有 Transport |
| `child(context)` | 创建子 Logger |

### LogLevel

| 等级 | 值 | 说明 |
|------|-----|------|
| VERBOSE | 0 | 详细调试信息 |
| INFO | 1 | 一般信息 |
| WARNING | 2 | 警告信息 |
| ERROR | 3 | 错误信息 |

## 运行示例

```bash
cd logger
npm install
npx ts-node examples/basic.ts
```

## License

MIT

