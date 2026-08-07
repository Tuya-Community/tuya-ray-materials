/**
 * 实时日志管理器
 */

/**
 * 日志消息格式
 */
export interface LogMessage {
  title: string;
  extra?: Record<string, unknown>;
}

interface RealtimeLogManager {
  info: (data: { message: string | LogMessage }) => void;
}

export class RealtimeLogService {
  private logManager: RealtimeLogManager | null = null;
  private tag = 'AI_Note_RealtimeLog';

  constructor(tag?: string) {
    if (tag) {
      this.tag = tag;
    }
    this.init();
  }

  /**
   * 初始化日志管理器
   */
  private init() {
    try {
      // @ts-ignore
      if (typeof ty !== 'undefined' && ty?.getRealtimeLogManager) {
        // @ts-ignore
        this.logManager = ty.getRealtimeLogManager({ tag: this.tag });
      }
    } catch (error) {
      console.warn('RealtimeLogService init failed:', error);
    }
  }

  /**
   * 记录信息日志
   * @param message 日志消息，可以是字符串或包含 title 和 extra 的对象
   */
  info(message: string | LogMessage) {
    if (message) {
      this.logManager?.info({ message });
    }
  }
}

export const realtimeLog = new RealtimeLogService();
