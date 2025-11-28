import { LogEntry } from '../types';

/**
 * Formatter 抽象基类
 * 
 * 负责将日志条目格式化为字符串
 * 可扩展以支持不同的输出格式（如 JSON、自定义模板等）
 */
export abstract class Formatter {
  /**
   * 格式化日志条目
   * @param entry 日志条目
   * @returns 格式化后的字符串
   */
  abstract format(entry: LogEntry): string;
}

