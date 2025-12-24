# 单例模式使用说明

## 问题背景

在之前的实现中，函数式 API 每次调用都会创建新的 `CustomLogger` 实例，这会导致：

1. **状态丢失**：`fileCounter` 和 `filePath` 等状态会被重置
2. **文件路径丢失**：分享功能无法找到正确的文件路径
3. **配置不一致**：每次调用可能使用不同的配置

## 解决方案

现在所有函数式 API 都使用**单例模式**，确保同一个 `devId` 只创建一个 `CustomLogger` 实例，状态和配置都会被正确保持。

## 使用方式

### 函数式 API（自动单例）

```typescript
import {
  logMapData,
  logPathData,
  logCustomData,
  shareCurrentLogFile,
} from '@ray-js/robot-custom-log';

// 第一次调用会创建实例
await logMapData('device123', 'Robot reached point A');

// 后续调用会复用同一个实例，状态不会丢失
await logPathData('device123', 'Path optimized');
await logCustomData('device123', 'Battery level: 85%');

// 分享功能可以正确找到文件路径
await shareCurrentLogFile('device123', {
  title: '日志文件',
  content: '完整的日志记录',
});
```

### 配置（仅在首次创建时生效）

```typescript
// 第一次调用时传入配置，会创建实例并应用配置
await logMapData('device123', 'First log', {
  enableConsole: true,
  logPrefix: '[MY-APP]',
});

// 后续调用即使传入配置，也不会生效（使用已存在的实例）
await logPathData('device123', 'Second log', {
  enableConsole: false, // 这个配置不会生效
});
```

### 获取单例实例

```typescript
import { getLogger } from '@ray-js/robot-custom-log';

// 获取指定 devId 的单例实例
const logger = getLogger('device123', {
  enableConsole: true,
  logPrefix: '[MY-APP]',
});

// 后续调用 getLogger 会返回同一个实例
const sameLogger = getLogger('device123');
console.log(logger === sameLogger); // true

// 使用实例方法
await logger.logMapData('Robot started');
await logger.logPathData('Route calculated');
```

### 管理单例实例

```typescript
import { removeLogger, clearAllLoggers } from '@ray-js/robot-custom-log';

// 移除指定 devId 的实例
removeLogger('device123');

// 清除所有实例（用于清理或测试）
clearAllLoggers();
```

## 类式 API vs 函数式 API

### 类式 API（手动管理）

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

// 需要手动创建和管理实例
const logger = new CustomLogger('device123', {
  enableConsole: true,
});

// 在整个应用生命周期中复用
await logger.logMapData('Robot started');
await logger.logPathData('Route calculated');
```

**优点**：

- 完全控制实例的创建和销毁
- 可以随时更新配置
- 适合在类或组件中使用

**缺点**：

- 需要手动管理实例
- 如果创建多个实例，状态会分散

### 函数式 API（自动单例）

```typescript
import { logMapData, logPathData } from '@ray-js/robot-custom-log';

// 无需管理实例，自动使用单例
await logMapData('device123', 'Robot started');
await logPathData('device123', 'Route calculated');
```

**优点**：

- 使用简单，无需管理实例
- 自动保证状态一致性
- 适合在函数或工具类中使用

**缺点**：

- 配置仅在首次创建时生效
- 无法直接访问实例方法（需要通过 `getLogger`）

## 最佳实践

### 1. 在 React 组件中

```typescript
import React, { useState } from 'react';
import { getLogger } from '@ray-js/robot-custom-log';

function MyComponent() {
  // 使用 getLogger 获取单例，确保整个组件使用同一个实例
  const logger = useState(() =>
    getLogger('device123', {
      enableConsole: true,
      logPrefix: '[MY-COMPONENT]',
    })
  )[0];

  const handleClick = async () => {
    await logger.logCustomData('Button clicked');
  };

  return <button onClick={handleClick}>点击我</button>;
}
```

### 2. 在业务服务类中

```typescript
import { getLogger } from '@ray-js/robot-custom-log';

class RobotService {
  private logger = getLogger('device123', {
    enableConsole: true,
    logPrefix: '[ROBOT-SERVICE]',
  });

  async performTask() {
    await this.logger.logMapData('Task started');
    // 执行任务...
    await this.logger.logPathData('Task completed');
  }
}
```

### 3. 在工具函数中

```typescript
import { logMapData, logPathData } from '@ray-js/robot-custom-log';

// 直接使用函数式API，自动单例
export async function handleMapUpdate(deviceId: string, data: any) {
  await logMapData(deviceId, `Map updated: ${JSON.stringify(data)}`);
}

export async function handlePathUpdate(deviceId: string, path: string) {
  await logPathData(deviceId, `Path updated: ${path}`);
}
```

## 注意事项

1. **配置仅在首次创建时生效**：如果需要在运行时更新配置，使用类式 API 或通过 `getLogger` 获取实例后调用 `updateConfig()`

2. **不同 devId 使用不同实例**：每个 `devId` 都有独立的单例实例

3. **内存管理**：如果不再需要某个设备的日志器，可以调用 `removeLogger(devId)` 清理

4. **测试场景**：在测试中可以使用 `clearAllLoggers()` 清除所有实例，确保测试隔离

## API 参考

### 单例管理函数

- `getLogger(devId: string, config?: LoggerConfig): CustomLogger` - 获取或创建单例实例
- `removeLogger(devId: string): void` - 移除指定实例
- `clearAllLoggers(): void` - 清除所有实例

### 函数式 API（自动使用单例）

- `logMapData(devId: string, message: string, config?: LoggerConfig): Promise<void>`
- `logPathData(devId: string, message: string, config?: LoggerConfig): Promise<void>`
- `logCustomData(devId: string, message: string, config?: LoggerConfig): Promise<void>`
- `log(type: LogType, devId: string, message: string, config?: LoggerConfig): Promise<void>`
- `shareLogFile(devId: string, fileIndex: number, shareConfig?: ShareConfig): Promise<void>`
- `shareCurrentLogFile(devId: string, shareConfig?: ShareConfig): Promise<void>`
- `shareAllLogFiles(devId: string, shareConfig?: ShareConfig): Promise<void>`
