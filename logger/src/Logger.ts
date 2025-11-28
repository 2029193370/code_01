import { LogLevel, LoggerConfig, LogEntry, Serializable } from './types';
import { Transport, ConsoleTransport } from './transports';

/**
 * Logger 主类
 * 
 * 提供统一的日志记录接口，支持多种日志等级和多个输出目标
 * 
 * @example
 * ```typescript
 * // 创建基本 logger
 * const logger = new Logger({ context: 'MyApp' });
 * logger.info('Application started');
 * 
 * // 创建带文件输出的 logger
 * const fileLogger = new Logger({ context: 'FileLogger' });
 * fileLogger.addTransport(new FileTransport({ filePath: './app.log' }));
 * fileLogger.error('An error occurred', { errorCode: 500 });
 * ```
 */
export class Logger {
  private readonly transports: Transport[] = [];
  private readonly context?: string;
  private readonly minLevel: LogLevel;

  /**
   * 创建 Logger 实例
   * @param config Logger 配置
   */
  constructor(config: LoggerConfig = {}) {
    this.context = config.context;
    this.minLevel = config.minLevel ?? LogLevel.VERBOSE;
    
    // 默认添加 Console Transport
    this.transports.push(new ConsoleTransport());
  }

  /**
   * 添加 Transport
   * @param transport Transport 实例
   * @returns 当前 Logger 实例（支持链式调用）
   */
  addTransport(transport: Transport): Logger {
    this.transports.push(transport);
    return this;
  }

  /**
   * 移除所有 Transport
   * @returns 当前 Logger 实例
   */
  clearTransports(): Logger {
    this.transports.length = 0;
    return this;
  }

  /**
   * 设置唯一的 Transport（移除现有的所有 Transport）
   * @param transport Transport 实例
   * @returns 当前 Logger 实例
   */
  setTransport(transport: Transport): Logger {
    this.clearTransports();
    this.transports.push(transport);
    return this;
  }

  /**
   * 记录 VERBOSE 等级日志
   * @param message 日志消息
   * @param meta 可选的元数据
   */
  verbose(message: Serializable, meta?: Record<string, unknown>): void {
    this.log(LogLevel.VERBOSE, message, meta);
  }

  /**
   * 记录 INFO 等级日志
   * @param message 日志消息
   * @param meta 可选的元数据
   */
  info(message: Serializable, meta?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * 记录 WARNING 等级日志
   * @param message 日志消息
   * @param meta 可选的元数据
   */
  warning(message: Serializable, meta?: Record<string, unknown>): void {
    this.log(LogLevel.WARNING, message, meta);
  }

  /**
   * 记录 ERROR 等级日志
   * @param message 日志消息
   * @param meta 可选的元数据
   */
  error(message: Serializable, meta?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * 创建子 Logger（继承当前配置但可覆盖上下文）
   * @param context 新的上下文标识
   * @returns 新的 Logger 实例
   */
  child(context: string): Logger {
    const childLogger = new Logger({
      context: this.context ? `${this.context}:${context}` : context,
      minLevel: this.minLevel,
    });
    
    // 清除默认的 ConsoleTransport，使用父 Logger 的 transports
    childLogger.clearTransports();
    this.transports.forEach(transport => childLogger.addTransport(transport));
    
    return childLogger;
  }

  /**
   * 核心日志记录方法
   * @param level 日志等级
   * @param message 日志消息（支持可序列化类型）
   * @param meta 可选的元数据
   */
  private log(
    level: LogLevel, 
    message: Serializable, 
    meta?: Record<string, unknown>
  ): void {
    // 检查是否应该记录此等级
    if (level < this.minLevel) {
      return;
    }

    // 将消息转换为字符串
    const messageStr = this.serializeMessage(message);

    // 创建日志条目
    const entry: LogEntry = {
      level,
      message: messageStr,
      timestamp: new Date(),
      context: this.context,
      meta,
    };

    // 通过所有 Transport 输出日志
    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        // Transport 错误不应影响其他 Transport
        console.error('Transport error:', error);
      }
    });
  }

  /**
   * 将可序列化数据转换为字符串
   * @param data 可序列化数据
   * @returns 字符串表示
   */
  private serializeMessage(data: Serializable): string {
    if (data === null) return 'null';
    if (data === undefined) return 'undefined';
    if (typeof data === 'string') return data;
    if (typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }
    if (typeof data === 'object') {
      if ('toString' in data && typeof data.toString === 'function') {
        const str = data.toString();
        // 避免使用默认的 [object Object]
        if (str !== '[object Object]') {
          return str;
        }
      }
      return JSON.stringify(data);
    }
    return String(data);
  }
}

