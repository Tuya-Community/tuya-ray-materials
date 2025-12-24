English | [简体中文](./README-zh_CN.md)

# @ray-js/robot-custom-log

[![latest](https://img.shields.io/npm/v/@ray-js/robot-custom-log/latest.svg)](https://www.npmjs.com/package/@ray-js/robot-custom-log) [![download](https://img.shields.io/npm/dt/@ray-js/robot-custom-log.svg)](https://www.npmjs.com/package/@ray-js/robot-custom-log)

> Custom Logger for Developers - Powerful log management and encryption for Ray.js applications

## Project Overview

`@ray-js/robot-custom-log` is an enterprise-grade logging library designed for Ray.js mini-programs, providing comprehensive log recording, storage, encryption, and sharing capabilities. Perfect for robot control, IoT device management, and scenarios requiring local log persistence.

### ✨ Key Features

- 📝 **Multi-Type Logging**: Supports map, path, and custom log types
- 🔄 **Smart File Management**: Max 5MB per file, up to 5 files with automatic rotation
- 🔒 **AES Encryption**: Built-in AES-256-CBC encryption for sensitive log data
- 📤 **Easy Sharing**: One-click log file sharing, single or batch mode
- 🎯 **Singleton Pattern**: Automatic instance management to prevent duplication
- ⚡ **Async Initialization**: Ensures file system readiness before writing
- 🛠️ **Flexible API**: Both class-based and functional APIs available
- 📊 **Batch Writing**: Supports batch log operations for better performance
- 🔔 **Change Callbacks**: File change monitoring for real-time status tracking

### 🎯 Use Cases

- 🤖 Robot path planning and map data recording
- 🏠 Smart home device operation tracking
- 📱 Mini-program user behavior analysis
- 🐛 Production debugging and troubleshooting
- 📈 Device operation data collection and analysis

### 🏗️ Technical Architecture

```
┌─────────────────────────────────────────┐
│         User Layer                       │
│  - Class API (CustomLogger)             │
│  - Functional API (logMapData, etc.)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Core Layer                       │
│  - Log Formatting (formatLogData)       │
│  - Singleton Management                  │
│  - Encryption (LogEncryptor)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Storage Layer                      │
│  - File Management (LogFileManager)     │
│  - File Rotation (Auto/Manual)          │
│  - Space Management (5MB × 5 files)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Platform Layer                     │
│  - Ray.js File System API               │
│  - Permission Management                 │
│  - File Sharing                          │
└─────────────────────────────────────────┘
```

## Installation

```sh
$ npm install @ray-js/robot-custom-log
# or
$ yarn add @ray-js/robot-custom-log
```

## Quick Start

### Basic Usage - Functional API

```typescript
import { logMapData, logPathData, logCustomData } from '@ray-js/robot-custom-log';

// Log map data
await logMapData('device123', 'Robot reached coordinates (100, 200)');

// Log path data
await logPathData('device123', 'Route planning completed, ETA 5 minutes');

// Log custom data
await logCustomData('device123', 'Battery level: 85%');
```

### Advanced Usage - Class API

```typescript
import { CustomLogger } from '@ray-js/robot-custom-log';

// Create logger instance
const logger = new CustomLogger('device123');

// Initialize (optional, auto-initialized on first write)
await logger.initialize();

// Write logs
await logger.writeLog('map', 'Map update completed');
await logger.writeLog('path', 'Navigation path generated');
await logger.writeLog('custom', 'User started cleaning task');

// Batch write
await logger.logBatch([
  { type: 'map', message: 'Map data 1' },
  { type: 'path', message: 'Path data 1' },
  { type: 'custom', message: 'Custom data 1' },
]);

// Share log file
await logger.shareLogFile(0);
```

## Core Features

### 1. Log Recording

```typescript
// Single log
await logMapData('device123', 'Map data');
await logPathData('device123', 'Path data');
await logCustomData('device123', 'Custom data');

// Batch logs (better performance)
const logger = new CustomLogger('device123');
await logger.logBatch([
  { type: 'map', message: 'Message 1' },
  { type: 'path', message: 'Message 2' },
]);
```

### 2. File Management

```typescript
const logger = new CustomLogger('device123');

// Get all log files
const files = await logger.getAllLogFiles();

// Clean all logs
await logger.cleanAllLogFiles();

// Get log file info
const fileInfo = await logger.getLogFileInfo(0);
```

### 3. Log Sharing

```typescript
import { shareLogFile, shareLatestLogFile } from '@ray-js/robot-custom-log';

// Share specific file
await shareLogFile('device123', 0);

// Share latest file
await shareLatestLogFile('device123');
```

### 4. Instance Management

```typescript
import { getLogger, removeLogger, clearAllLoggers } from '@ray-js/robot-custom-log';

// Get logger instance
const logger = await getLogger('device123');

// Remove specific instance
removeLogger('device123');

// Clear all instances
clearAllLoggers();
```

## Documentation

- [Complete Usage Guide](./USAGE.md) - Detailed API documentation and examples
- [Singleton Pattern Guide](./SINGLETON_USAGE.md) - Singleton manager usage
- [Quick Start Guide](./QUICK_START.md) - Getting started tutorial

## FAQ

### Q: Where are log files stored?

A: Logs are stored in `${USER_DATA_PATH}/customLog` directory, with filename format `{devId}_customLog_{index}.txt`

### Q: How much space do log files use?

A: Max 5MB per file, up to 5 files, total max 25MB. Automatically rotates when exceeded.

### Q: How to view encrypted logs?

A: Use `decryptLog` function or `LogEncryptor.decryptLog` method to decrypt

### Q: Which platforms are supported?

A: All Ray.js platforms including Tuya mini-programs, WeChat mini-programs, etc.

## License

MIT

## Maintainers

tuya_npm
