# CustomLogger 使用指南

## 安装

```bash
npm install @ray-js/robot-custom-log
# 或
yarn add @ray-js/robot-custom-log
```

## 导入

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';
// 或使用函数式API
import { logMapData, logPathData, logCustomData } from '@ray-js/robot-custom-log';
```

## 基础使用

### 方式一：类式 API（推荐）

#### 1. 创建日志器实例

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

// 基础用法
const logger = new CustomLogger('device123');

// 带配置的用法
const logger = new CustomLogger('device123', {
  enableConsole: true, // 是否输出到控制台，默认 true
  enableTimestamp: true, // 是否在消息中添加时间戳，默认 true
  logPrefix: '[ROBOT-LOG]', // 日志前缀，默认 '[CUSTOM-LOG]'
  maxFileSize: 5 * 1024 * 1024, // 最大文件大小（字节），默认 5MB
  maxFileCount: 10, // 最大文件数量，默认 10
});
```

#### 2. 记录日志

```typescript
// 记录地图数据
await logger.logMapData('Robot reached point A');
await logger.logMapData('Map updated successfully');

// 记录路径数据
await logger.logPathData('Path optimized: 10% shorter route');
await logger.logPathData('New route calculated');

// 记录自定义数据
await logger.logCustomData('Battery level: 85%');
await logger.logCustomData('System check completed');

// 使用通用方法
await logger.log('map', 'Robot started cleaning');
await logger.log('path', 'Route planning completed');
await logger.log('custom', 'User action: start button clicked');
```

#### 3. 批量记录日志

```typescript
await logger.logBatch([
  { type: 'map', message: 'Map data 1' },
  { type: 'path', message: 'Path data 1' },
  { type: 'custom', message: 'Custom data 1' },
  { type: 'map', message: 'Map data 2' },
]);
```

### 方式二：函数式 API

```typescript
import { logMapData, logPathData, logCustomData, log } from '@ray-js/robot-custom-log';

// 记录地图数据
await logMapData('device123', 'Robot reached point A');

// 记录路径数据
await logPathData('device123', 'Path optimized successfully');

// 记录自定义数据
await logCustomData('device123', 'Battery level: 85%');

// 通用日志函数
await log('map', 'device123', 'Robot started cleaning');
```

## 高级功能

### 1. 配置管理

```typescript
const logger = new CustomLogger('device123');

// 获取当前配置
const config = logger.getConfig();
console.log(config);

// 更新配置
logger.updateConfig({
  enableConsole: false, // 关闭控制台输出
  logPrefix: '[MY-APP]', // 修改日志前缀
});
```

### 2. 文件管理

```typescript
const logger = new CustomLogger('device123');

// 获取当前文件计数器
const counter = logger.getFileCounter();
console.log('Current file counter:', counter);

// 手动触发文件轮转
logger.rotateFile();

// 重置文件计数器
logger.resetFileCounter();

// 获取所有可能的日志文件名
const fileNames = logger.getAllLogFileNames();
console.log('All log file names:', fileNames);
```

### 3. 分享日志文件

```typescript
const logger = new CustomLogger('device123');

// 分享当前活跃的日志文件
await logger.shareCurrentLogFile({
  title: '机器人日志文件',
  content: '包含完整的机器人运行日志',
  success: res => {
    console.log('分享成功:', res);
  },
  fail: err => {
    console.error('分享失败:', err);
  },
});

// 分享指定索引的文件
await logger.shareLogFile(0, {
  title: '第一个日志文件',
  content: '设备123的第一个日志文件',
});

// 分享所有日志文件
await logger.shareAllLogFiles({
  title: '完整日志包',
  content: '设备123的所有日志文件',
});
```

## 完整示例

### React 组件中使用

```typescript
import React, { useEffect, useState } from 'react';
import { CustomLogger } from '@ray-js/robot-custom-log';

export default function RobotControl() {
  const [logger] = useState(
    () =>
      new CustomLogger('robot001', {
        enableConsole: true,
        logPrefix: '[ROBOT-CONTROL]',
      })
  );

  useEffect(() => {
    // 组件挂载时记录日志
    logger.logMapData('Robot control panel initialized');
  }, []);

  const handleStart = async () => {
    await logger.logCustomData('User clicked start button');
    await logger.logPathData('Starting route planning...');
    // 执行启动逻辑...
  };

  const handleShare = async () => {
    await logger.shareCurrentLogFile({
      title: '机器人运行日志',
      content: '包含机器人本次运行的所有日志数据',
    });
  };

  return (
    <div>
      <button onClick={handleStart}>开始</button>
      <button onClick={handleShare}>分享日志</button>
    </div>
  );
}
```

### 在业务逻辑中使用

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

class RobotService {
  private logger: CustomLogger;

  constructor(deviceId: string) {
    this.logger = new CustomLogger(deviceId, {
      enableConsole: true,
      logPrefix: '[ROBOT-SERVICE]',
    });
  }

  async startCleaning() {
    await this.logger.logCustomData('Cleaning service started');
    await this.logger.logMapData('Loading map data...');

    try {
      // 执行清理逻辑
      await this.performCleaning();

      await this.logger.logPathData('Cleaning path completed');
      await this.logger.logCustomData('Cleaning service finished successfully');
    } catch (error) {
      await this.logger.logCustomData(`Error: ${error.message}`);
      throw error;
    }
  }

  async performCleaning() {
    // 业务逻辑
    await this.logger.logPathData('Moving to start position');
    await this.logger.logMapData('Updating map with obstacles');
    // ...
  }

  async shareLogs() {
    await this.logger.shareCurrentLogFile({
      title: '清理任务日志',
      content: '本次清理任务的完整日志记录',
    });
  }
}
```

### 在事件处理中使用

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

const logger = new CustomLogger('device123');

// 地图更新事件
window.addEventListener('mapUpdate', async event => {
  await logger.logMapData(`Map updated: ${JSON.stringify(event.detail)}`);
});

// 路径规划事件
window.addEventListener('pathPlanned', async event => {
  await logger.logPathData(`Path planned: ${event.detail.pathLength}m`);
});

// 自定义事件
window.addEventListener('batteryLow', async event => {
  await logger.logCustomData(`Battery low: ${event.detail.level}%`);
});
```

## 日志文件格式

所有类型的日志都会写入同一个文件，格式为 JSON：

```json
{"type":"map","devId":"device123","message":"[2024-01-01T10:00:00.000Z] Robot reached point A","timestamp":1704067200000}
{"type":"path","devId":"device123","message":"[2024-01-01T10:01:00.000Z] Path optimized successfully","timestamp":1704067260000}
{"type":"custom","devId":"device123","message":"[2024-01-01T10:02:00.000Z] Battery level: 85%","timestamp":1704067320000}
```

## 注意事项

1. **异步操作**：所有日志记录方法都是异步的，需要使用 `await` 或 `.then()` 处理
2. **文件路径**：日志文件保存在临时目录，路径格式为 `{devId}_customLog`
3. **文件大小**：默认单个文件最大 5MB，超过后会自动创建新文件
4. **文件数量**：默认最多保留 10 个文件，超过后会循环覆盖
5. **设备 ID**：同一个设备 ID 的所有日志类型都会写入同一个文件

## API 参考

### CustomLogger 类

#### 构造函数

```typescript
new CustomLogger(devId: string, config?: LoggerConfig)
```

#### 方法

- `logMapData(message: string): Promise<void>` - 记录地图数据日志
- `logPathData(message: string): Promise<void>` - 记录路径数据日志
- `logCustomData(message: string): Promise<void>` - 记录自定义数据日志
- `log(type: LogType, message: string): Promise<void>` - 通用日志方法
- `logBatch(logs: Array<{type: LogType, message: string}>): Promise<void>` - 批量记录日志
- `updateConfig(newConfig: Partial<LoggerConfig>): void` - 更新配置
- `getConfig(): LoggerConfig` - 获取当前配置
- `getDevId(): string` - 获取设备 ID
- `getFileCounter(): number` - 获取文件计数器
- `rotateFile(): void` - 手动触发文件轮转
- `resetFileCounter(): void` - 重置文件计数器
- `getAllLogFileNames(): string[]` - 获取所有可能的日志文件名
- `shareLogFile(fileIndex: number, shareConfig?: ShareConfig): Promise<void>` - 分享指定文件
- `shareCurrentLogFile(shareConfig?: ShareConfig): Promise<void>` - 分享当前文件
- `shareAllLogFiles(shareConfig?: ShareConfig): Promise<void>` - 分享所有文件
