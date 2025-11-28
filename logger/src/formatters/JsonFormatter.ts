import { LogEntry, LogLevelNames } from '../types';
import { Formatter } from './Formatter';

/**
 * JSON 格式化器
 * 
 * 将日志条目输出为 JSON 格式，便于日志分析和处理
 */
export class JsonFormatter extends Formatter {
  private readonly pretty: boolean;

  /**
   * @param pretty 是否格式化 JSON 输出（默认 false）
   */
  constructor(pretty: boolean = false) {
    super();
    this.pretty = pretty;
  }

  /**
   * 格式化日志条目为 JSON 字符串
   * @param entry 日志条目
   * @returns JSON 格式的字符串
   */
  format(entry: LogEntry): string {
    const logObject = {
      timestamp: entry.timestamp.toISOString(),
      level: LogLevelNames[entry.level],
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.meta && { meta: entry.meta }),
    };

    return this.pretty 
      ? JSON.stringify(logObject, null, 2)
      : JSON.stringify(logObject);
  }
}

