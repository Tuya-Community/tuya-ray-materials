# 光伏逆变器主页模块文档

## 功能概述

主页模块(`src/pages/home/index.tsx`)是光伏逆变器系统的核心页面，提供了设备状态监控、发电数据展示和快速导航功能。

## 主要功能

### 1. 设备状态展示
- 显示设备名称
- 实时展示设备在线/离线状态
- 工作模式显示

### 2. 性能指标
- 设备评分展示
- 净输出量显示（kWh）
- 发电流转图可视化

### 3. 收益信息
- 上网电价收益
- 当日收益统计
- 累计收益展示

### 4. 快速导航
- 光伏发电信息入口(`/pvInfo`)
  - 显示当日发电量(kWh)
- 储能信息入口(`/energyStorageInfo`)
  - 显示当前电池电量百分比

## 技术实现

### 数据管理
- 使用 Redux 进行状态管理
- 通过 `useSelector` 获取设备信息
- 使用 `useDevice` 获取设备名称

### 生命周期 
- 组件挂载时，通过 `useEffect` 获取设备信息
- 组件卸载时，通过 `useEffect` 清除设备信息

### 样式
- 使用 `styled-components` 进行样式封装
- 通过 `theme` 配置主题颜色

## 代码结构

```tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDevice } from 'hooks';
import { getDeviceInfo } from 'api';
import { setDeviceInfo } from 'store/actions';
```

## 注意事项

1. 性能优化
   - 使用 `useMemo` 缓存计算结果
   - 使用 `useCallback` 优化回调函数
   - 避免不必要的重渲染

2. 错误处理
   - 添加数据加载失败处理
   - 网络异常时显示提示信息
   - 支持手动刷新功能

3. 兼容性
   - 支持不同屏幕尺寸
   - 适配深色/浅色主题
   - 考虑离线模式支持

## 后续优化

1. 数据展示
   - 添加更多数据可视化图表
   - 优化数据更新频率
   - 支持自定义数据展示项

2. 用户体验
   - 添加动画效果
   - 优化加载状态展示
   - 增加操作引导

3. 功能扩展
   - 支持多设备切换
   - 添加告警信息展示
   - 集成天气信息
