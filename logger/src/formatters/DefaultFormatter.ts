import { LogEntry, LogLevelNames } from '../types';
import { Formatter } from './Formatter';

/**
 * 默认格式化器
 * 
 * 输出格式: [TIMESTAMP] [LEVEL] [CONTEXT] MESSAGE
 * 示例: [2024-01-15T10:30:00.000Z] [INFO] [UserService] User logged in
 */
export class DefaultFormatter extends Formatter {
  /**
   * 格式化日志条目为可读字符串
   * @param entry 日志条目
   * @returns 格式化后的字符串
   */
  format(entry: LogEntry): string {
    const timestamp = this.formatTimestamp(entry.timestamp);
    const level = LogLevelNames[entry.level].padEnd(7);
    const context = entry.context ? `[${entry.context}] ` : '';
    const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
    
    return `[${timestamp}] [${level}] ${context}${entry.message}${meta}`;
  }

  /**
   * 格式化时间戳
   * @param date 日期对象
   * @returns ISO 格式的时间字符串
   */
  private formatTimestamp(date: Date): string {
    return date.toISOString();
  }
}

