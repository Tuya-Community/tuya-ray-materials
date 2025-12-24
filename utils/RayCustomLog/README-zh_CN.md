[English](./README.md) | 简体中文

# @ray-js/robot-custom-log

[![latest](https://img.shields.io/npm/v/@ray-js/robot-custom-log/latest.svg)](https://www.npmjs.com/package/@ray-js/robot-custom-log) [![download](https://img.shields.io/npm/dt/@ray-js/robot-custom-log.svg)](https://www.npmjs.com/package/@ray-js/robot-custom-log)

> 开发者自定义日志工具 - 为 Ray.js 应用提供强大的日志管理和加密功能

## 项目概述

`@ray-js/robot-custom-log` 是一个专为 Ray.js 小程序设计的企业级日志管理库，提供完整的日志记录、存储、加密和分享功能。适用于机器人控制、IoT 设备管理等需要本地日志持久化的场景。

### ✨ 核心特性

- 📝 **多类型日志支持**：支持地图（map）、路径（path）、自定义（custom）三种日志类型
- 🔄 **智能文件管理**：单文件最大 5MB，支持最多 5 个文件循环覆盖，自动管理存储空间
- 🔒 **AES 加密**：内置 AES-256-CBC 加密算法，保护敏感日志数据
- 📤 **便捷分享**：一键分享日志文件，支持分享单个文件或批量分享
- 🎯 **单例模式**：自动管理日志实例，避免重复初始化和资源浪费
- ⚡ **异步初始化**：确保文件系统就绪后才进行写入，保证数据安全
- 🛠️ **灵活 API**：提供类式 API 和函数式 API 两种使用方式
- 📊 **批量写入**：支持批量日志写入，提高性能
- 🔔 **变化回调**：支持文件变化监听，实时掌握日志状态

### 🎯 适用场景

- 🤖 机器人应用的路径规划和地图数据记录
- 🏠 智能家居设备的运行日志追踪
- 📱 小程序应用的用户行为分析
- 🐛 生产环境问题排查和调试
- 📈 设备运行数据采集和分析

### 🏗️ 技术架构

```
┌─────────────────────────────────────────┐
│         使用层（User Layer）               │
│  - 类式 API (CustomLogger)               │
│  - 函数式 API (logMapData, logPathData)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       核心层（Core Layer）                │
│  - 日志格式化（formatLogData）            │
│  - 单例管理（LoggerSingleton）            │
│  - 加密处理（LogEncryptor）               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     存储层（Storage Layer）               │
│  - 文件管理（LogFileManager）             │
│  - 文件轮转（自动/手动）                   │
│  - 空间管理（5MB × 5 files）              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     平台层（Platform Layer）              │
│  - Ray.js File System API               │
│  - 文件读写权限管理                        │
│  - 文件分享功能                           │
└─────────────────────────────────────────┘
```

## 安装

```sh
$ npm install @ray-js/robot-custom-log
# 或者
$ yarn add @ray-js/robot-custom-log
```

## 快速开始

### 基础使用 - 函数式 API

```typescript
import { logMapData, logPathData, logCustomData } from '@ray-js/robot-custom-log';

// 记录地图数据
await logMapData('device123', '机器人到达坐标 (100, 200)');

// 记录路径数据
await logPathData('device123', '路径规划完成，预计耗时 5 分钟');

// 记录自定义数据
await logCustomData('device123', '电池电量: 85%');
```

### 高级使用 - 类式 API

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

// 创建日志实例
const logger = new CustomLogger('device123');

// 初始化（可选，首次写入时会自动初始化）
await logger.initialize();

// 写入日志
await logger.writeLog('map', '地图更新完成');
await logger.writeLog('path', '导航路径已生成');
await logger.writeLog('custom', '用户启动清扫任务');

// 批量写入
await logger.logBatch([
  { type: 'map', message: '地图数据 1' },
  { type: 'path', message: '路径数据 1' },
  { type: 'custom', message: '自定义数据 1' },
]);

// 分享日志文件
await logger.shareLogFile(0);
```

### 日志加密

```typescript
import { encryptLog, decryptLog, LogEncryptor } from '@ray-js/robot-custom-log';

// 方式 1：使用便捷函数
const encrypted = encryptLog({ message: '敏感数据', deviceId: '123' });
const decrypted = decryptLog(encrypted);

// 方式 2：使用加密类
const encrypted = LogEncryptor.encryptLog('敏感日志内容');
const decrypted = LogEncryptor.decryptLog(encrypted);

// 批量加密
const logs = ['日志1', '日志2', '日志3'];
const encryptedLogs = LogEncryptor.encryptLogs(logs);
```

## 核心功能

### 1. 日志记录

```typescript
// 单条日志
await logMapData('device123', '地图数据');
await logPathData('device123', '路径数据');
await logCustomData('device123', '自定义数据');

// 批量日志（提升性能）
const logger = new CustomLogger('device123');
await logger.logBatch([
  { type: 'map', message: '消息1' },
  { type: 'path', message: '消息2' },
]);
```

### 2. 文件管理

```typescript
const logger = new CustomLogger('device123');

// 获取所有日志文件
const files = await logger.getAllLogFiles();

// 清理所有日志
await logger.cleanAllLogFiles();

// 获取日志文件信息
const fileInfo = await logger.getLogFileInfo(0);
```

### 3. 日志分享

```typescript
import { shareLogFile, shareLatestLogFile } from '@ray-js/robot-custom-log';

// 分享指定文件
await shareLogFile('device123', 0);

// 分享最新文件
await shareLatestLogFile('device123');
```

### 4. 实例管理

```typescript
import { getLogger, removeLogger, clearAllLoggers } from '@ray-js/robot-custom-log';

// 获取日志实例
const logger = await getLogger('device123');

// 移除指定实例
removeLogger('device123');

// 清空所有实例
clearAllLoggers();
```

## 文档

- [完整使用指南](./USAGE.md) - 详细的 API 文档和使用示例
- [单例模式说明](./SINGLETON_USAGE.md) - 单例管理器的使用方法
- [快速开始](./QUICK_START.md) - 快速上手教程

## 常见问题

### Q: 日志文件会占用多少空间？

A: 单个文件最大 5MB，最多 5 个文件，总计最大 25MB，超出后自动循环覆盖

## License

MIT

## 维护者

tuya_npm
