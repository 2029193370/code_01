import { LogEntry, LogLevel, ConsoleTransportConfig } from '../types';
import { Transport } from './Transport';
import { Formatter } from '../formatters';

/**
 * Console 颜色代码（ANSI）
 */
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 前景色
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

/**
 * 日志等级对应的颜色
 */
const LevelColors: Record<LogLevel, string> = {
  [LogLevel.VERBOSE]: Colors.gray,
  [LogLevel.INFO]: Colors.cyan,
  [LogLevel.WARNING]: Colors.yellow,
  [LogLevel.ERROR]: Colors.red,
};

/**
 * Console Transport
 * 
 * 将日志输出到控制台
 * 支持彩色输出（可选）
 */
export class ConsoleTransport extends Transport {
  private readonly colorize: boolean;

  /**
   * @param config Console Transport 配置
   * @param formatter 可选的自定义格式化器
   */
  constructor(config: ConsoleTransportConfig = {}, formatter?: Formatter) {
    super(config, formatter);
    this.colorize = config.colorize ?? true;
  }

  /**
   * 将消息输出到控制台
   * @param message 格式化后的消息
   * @param entry 原始日志条目
   */
  protected write(message: string, entry: LogEntry): void {
    const output = this.colorize 
      ? this.applyColor(message, entry.level)
      : message;

    // 根据日志等级使用不同的 console 方法
    switch (entry.level) {
      case LogLevel.VERBOSE:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARNING:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
      default:
        console.log(output);
    }
  }

  /**
   * 为消息添加颜色
   * @param message 消息内容
   * @param level 日志等级
   * @returns 带颜色代码的消息
   */
  private applyColor(message: string, level: LogLevel): string {
    const color = LevelColors[level] || Colors.white;
    return `${color}${message}${Colors.reset}`;
  }
}

