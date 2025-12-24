# CustomLogger 快速开始

## 最简单的使用方式

### 1. 导入 CustomLogger

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';
```

### 2. 创建日志器实例

```typescript
const logger = new CustomLogger('your_device_id');
```

### 3. 记录日志

```typescript
// 记录地图数据
await logger.logMapData('Robot reached point A');

// 记录路径数据
await logger.logPathData('Path optimized successfully');

// 记录自定义数据
await logger.logCustomData('Battery level: 85%');
```

## 完整示例

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

// 创建日志器
const logger = new CustomLogger('robot001');

// 在业务代码中使用
async function startRobot() {
  // 记录开始日志
  await logger.logCustomData('Robot started');

  // 记录地图数据
  await logger.logMapData('Loading map...');

  // 记录路径数据
  await logger.logPathData('Calculating route...');

  // 执行业务逻辑
  // ...

  // 记录完成日志
  await logger.logCustomData('Robot finished');
}

// 分享日志文件
async function shareLogs() {
  await logger.shareCurrentLogFile({
    title: '机器人运行日志',
    content: '本次运行的完整日志',
  });
}
```

## 在 React 组件中使用

```typescript
import React, { useState } from 'react';
import { CustomLogger } from '@ray-js/robot-custom-log';

function MyComponent() {
  const [logger] = useState(() => new CustomLogger('device123'));

  const handleClick = async () => {
    await logger.logCustomData('Button clicked');
  };

  return <button onClick={handleClick}>点击我</button>;
}
```

## 在类中使用

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

class RobotService {
  private logger: CustomLogger;

  constructor(deviceId: string) {
    this.logger = new CustomLogger(deviceId);
  }

  async performTask() {
    await this.logger.logMapData('Task started');
    // 执行任务...
    await this.logger.logPathData('Task completed');
  }
}
```

## 函数式 API（无需创建实例）

```typescript
import { logMapData, logPathData, logCustomData } from '@ray-js/robot-custom-log';

// 直接使用，每次调用会创建临时实例
await logMapData('device123', 'Robot reached point A');
await logPathData('device123', 'Path optimized');
await logCustomData('device123', 'Battery level: 85%');
```

## 注意事项

1. **所有方法都是异步的**，需要使用 `await` 或 `.then()`
2. **同一个设备 ID 的所有日志类型都会写入同一个文件**
3. **日志文件会自动保存在临时目录**
4. **建议在应用启动时创建一个 logger 实例，在整个应用生命周期中复用**
