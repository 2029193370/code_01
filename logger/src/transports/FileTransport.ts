import { LogEntry, FileTransportConfig } from '../types';
import { Transport } from './Transport';
import { Formatter } from '../formatters';

/**
 * 模拟的文件写入函数
 * 
 * 在实际应用中，这里会调用 Node.js 的 fs 模块
 * 或浏览器端的 File System Access API
 * 
 * @param filePath 文件路径
 * @param buffer 要写入的内容
 */
function NativeFileWriteSync(filePath: string, buffer: string): void {
  console.log(`[File IO ${filePath}] ${buffer}`);
}

/**
 * 模拟的文件追加函数
 * 
 * @param filePath 文件路径
 * @param buffer 要追加的内容
 */
function NativeFileAppendSync(filePath: string, buffer: string): void {
  console.log(`[File Append ${filePath}] ${buffer}`);
}

/**
 * File Transport
 * 
 * 将日志写入文件
 * 支持覆盖写入和追加写入模式
 * 
 * 注意：当前使用模拟实现，实际使用时需替换为真实的文件 I/O
 */
export class FileTransport extends Transport {
  private readonly filePath: string;
  private readonly append: boolean;
  private isFirstWrite: boolean = true;

  /**
   * @param config File Transport 配置
   * @param formatter 可选的自定义格式化器
   */
  constructor(config: FileTransportConfig, formatter?: Formatter) {
    super(config, formatter);
    this.filePath = config.filePath;
    this.append = config.append ?? true;
  }

  /**
   * 将消息写入文件
   * @param message 格式化后的消息
   * @param _entry 原始日志条目（未使用）
   */
  protected write(message: string, _entry: LogEntry): void {
    const line = message + '\n';

    if (this.append || !this.isFirstWrite) {
      NativeFileAppendSync(this.filePath, line);
    } else {
      NativeFileWriteSync(this.filePath, line);
      this.isFirstWrite = false;
    }
  }

  /**
   * 获取当前文件路径
   */
  getFilePath(): string {
    return this.filePath;
  }
}

