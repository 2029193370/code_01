/**
 * 日志等级枚举
 * 按严重程度从低到高排列
 */
export enum LogLevel {
  VERBOSE = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

/**
 * 日志等级名称映射
 */
export const LogLevelNames: Record<LogLevel, string> = {
  [LogLevel.VERBOSE]: 'VERBOSE',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARNING]: 'WARNING',
  [LogLevel.ERROR]: 'ERROR',
};

/**
 * 日志条目接口
 * 包含日志的所有元数据
 */
export interface LogEntry {
  /** 日志等级 */
  level: LogLevel;
  /** 日志消息 */
  message: string;
  /** 时间戳 */
  timestamp: Date;
  /** 可选的上下文信息 */
  context?: string;
  /** 可选的额外数据 */
  meta?: Record<string, unknown>;
}

/**
 * Logger 配置接口
 */
export interface LoggerConfig {
  /** 最低日志等级，低于此等级的日志将被忽略 */
  minLevel?: LogLevel;
  /** 上下文标识（如模块名） */
  context?: string;
}

/**
 * Transport 配置基础接口
 */
export interface TransportConfig {
  /** 该 Transport 的最低日志等级 */
  minLevel?: LogLevel;
}

/**
 * 文件 Transport 配置接口
 */
export interface FileTransportConfig extends TransportConfig {
  /** 文件路径 */
  filePath: string;
  /** 是否追加模式（默认 true） */
  append?: boolean;
}

/**
 * Console Transport 配置接口
 */
export interface ConsoleTransportConfig extends TransportConfig {
  /** 是否使用颜色输出 */
  colorize?: boolean;
}

/**
 * 可序列化为字符串的类型
 */
export type Serializable = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | { toString(): string }
  | Record<string, unknown>;

