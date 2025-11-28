/**
 * Logger 使用示例
 * 
 * 运行: npx ts-node examples/basic.ts
 */

import { 
  Logger, 
  LogLevel, 
  ConsoleTransport, 
  FileTransport,
  JsonFormatter 
} from '../src';

// ============================================
// 示例 1: 基本使用
// ============================================
console.log('\n=== 示例 1: 基本使用 ===\n');

const logger = new Logger({ context: 'MyApp' });

logger.verbose('这是一条 verbose 日志');
logger.info('应用程序已启动');
logger.warning('内存使用率较高');
logger.error('数据库连接失败');

// ============================================
// 示例 2: 带元数据的日志
// ============================================
console.log('\n=== 示例 2: 带元数据的日志 ===\n');

logger.info('用户登录成功', { 
  userId: 12345, 
  username: 'john_doe',
  ip: '192.168.1.100'
});

logger.error('API 请求失败', {
  endpoint: '/api/users',
  statusCode: 500,
  duration: 1234
});

// ============================================
// 示例 3: 设置最低日志等级
// ============================================
console.log('\n=== 示例 3: 设置最低日志等级 ===\n');

const productionLogger = new Logger({ 
  context: 'Production',
  minLevel: LogLevel.WARNING  // 只记录 WARNING 及以上级别
});

productionLogger.verbose('这条不会显示');  // 被过滤
productionLogger.info('这条也不会显示');   // 被过滤
productionLogger.warning('这条会显示');
productionLogger.error('这条也会显示');

// ============================================
// 示例 4: 子 Logger
// ============================================
console.log('\n=== 示例 4: 子 Logger ===\n');

const mainLogger = new Logger({ context: 'Server' });
const dbLogger = mainLogger.child('Database');
const authLogger = mainLogger.child('Auth');

mainLogger.info('服务器启动中...');
dbLogger.info('数据库连接成功');
authLogger.warning('检测到可疑登录尝试');

// ============================================
// 示例 5: 自定义 Transport（文件输出）
// ============================================
console.log('\n=== 示例 5: 文件 Transport ===\n');

const fileLogger = new Logger({ context: 'FileExample' });
fileLogger.addTransport(new FileTransport({ 
  filePath: './logs/app.log',
  minLevel: LogLevel.INFO
}));

fileLogger.info('这条日志会同时输出到控制台和文件');
fileLogger.error('错误日志也会写入文件');

// ============================================
// 示例 6: 使用 JSON 格式化器
// ============================================
console.log('\n=== 示例 6: JSON 格式化器 ===\n');

const jsonLogger = new Logger({ context: 'JsonExample' });
const jsonTransport = new ConsoleTransport({ colorize: false });
jsonTransport.setFormatter(new JsonFormatter(true));  // pretty print
jsonLogger.setTransport(jsonTransport);

jsonLogger.info('这是 JSON 格式的日志', { 
  requestId: 'abc-123',
  duration: 45 
});

// ============================================
// 示例 7: 记录不同类型的数据
// ============================================
console.log('\n=== 示例 7: 记录不同类型的数据 ===\n');

const dataLogger = new Logger({ context: 'DataTypes' });

dataLogger.info('字符串消息');
dataLogger.info(12345);  // 数字
dataLogger.info(true);   // 布尔值
dataLogger.info({ name: 'Test', value: 100 });  // 对象

// 带 toString 的对象
class CustomError {
  constructor(public code: number, public message: string) {}
  toString() {
    return `Error[${this.code}]: ${this.message}`;
  }
}
dataLogger.error(new CustomError(404, 'Not Found'));

console.log('\n=== 示例结束 ===\n');

