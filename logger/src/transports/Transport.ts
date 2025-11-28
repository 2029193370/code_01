import { LogEntry, LogLevel, TransportConfig } from '../types';
import { Formatter, DefaultFormatter } from '../formatters';

/**
 * Transport 抽象基类
 * 
 * Transport 负责将格式化后的日志输出到目标位置
 * 可扩展以支持不同的输出目标（Console、File、HTTP、数据库等）
 */
export abstract class Transport {
  /** 格式化器 */
  protected formatter: Formatter;
  /** 最低日志等级 */
  protected minLevel: LogLevel;

  /**
   * @param config Transport 配置
   * @param formatter 可选的自定义格式化器
   */
  constructor(config: TransportConfig = {}, formatter?: Formatter) {
    this.minLevel = config.minLevel ?? LogLevel.VERBOSE;
    this.formatter = formatter ?? new DefaultFormatter();
  }

  /**
   * 设置格式化器
   * @param formatter 格式化器实例
   */
  setFormatter(formatter: Formatter): void {
    this.formatter = formatter;
  }

  /**
   * 检查日志等级是否应该被记录
   * @param level 日志等级
   * @returns 是否应该记录
   */
  shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  /**
   * 记录日志条目
   * @param entry 日志条目
   */
  log(entry: LogEntry): void {
    if (this.shouldLog(entry.level)) {
      const formattedMessage = this.formatter.format(entry);
      this.write(formattedMessage, entry);
    }
  }

  /**
   * 将格式化后的消息写入目标位置
   * 子类必须实现此方法
   * @param message 格式化后的消息
   * @param entry 原始日志条目（可用于额外处理）
   */
  protected abstract write(message: string, entry: LogEntry): void;
}

