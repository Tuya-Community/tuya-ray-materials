import { CustomLogger } from './logger';

/**
 * 单例管理器：为每个 devId 维护一个 CustomLogger 实例
 */
export class LoggerSingleton {
  private static instances: Map<string, CustomLogger> = new Map();

  /**
   * 获取或创建指定 devId 的日志器实例
   * @param devId 设备ID
   * @returns CustomLogger 实例
   */
  static async getInstance(devId: string): Promise<CustomLogger> {
    if (!this.instances.has(devId)) {
      try {
        // 首次创建，保存配置并创建实例
        const logger = new CustomLogger(devId);
        await logger.initialize(); // 确保异步初始化完成
        this.instances.set(devId, logger);
      } catch (error) {
        console.error('[CUSTOM-LOG] Failed to get instance:', error);
      }

    }
    return this.instances.get(devId)!;
  }

  /**
   * 检查指定 devId 的实例是否存在
   * @param devId 设备ID
   * @returns 是否存在实例
   */
  static hasInstance(devId: string): boolean {
    return this.instances.has(devId);
  }

  /**
   * 异步获取实例，如果不存在则创建（不自动初始化）
   * @param devId 设备ID
   * @param config 配置
   * @returns 未初始化的实例
   */
  static getInstanceSync(devId: string): CustomLogger {
    if (!this.instances.has(devId)) {
      // 首次创建，保存配置并创建实例（不同步初始化）
      this.instances.set(devId, new CustomLogger(devId));
    }
    return this.instances.get(devId)!;
  }

  /**
   * 移除指定 devId 的实例（用于清理）
   * @param devId 设备ID
   */
  static removeInstance(devId: string): void {
    this.instances.delete(devId);
  }

  /**
   * 清除所有实例
   */
  static clearAll(): void {
    this.instances.clear();
  }

  /**
   * 获取所有已创建的实例数量
   */
  static getInstanceCount(): number {
    return this.instances.size;
  }

  /**
   * 获取所有实例（用于清理）
   */
  static getAllInstances(): CustomLogger[] {
    return Array.from(this.instances.values());
  }
}

