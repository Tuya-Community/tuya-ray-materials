/*
 * @Author: hkc
 * @Date: 2026-01-27 19:18:30
 * @Description:
 * @LastEditTime: 2026-02-02 19:22:47
 * @LastEditors: hkc
 */
/**
 * SttContent 组件的常量配置
 */

// ============= 分段渲染配置 =============
/** 每个 chunk 的列表项数量 */
export const SEGMENT_NUM = 12;

// ============= 滚动相关配置 =============
/** 滚动防抖等待时间 (ms) */
export const SCROLL_DEBOUNCE_WAIT = 400;

/** 滚动状态重置延迟 (ms) */
export const SCROLL_RESET_DELAY = 500;

/** 滚动到视图时的首次延迟 (ms) */
export const SCROLL_INTO_VIEW_FIRST_DELAY = 200;

/** 强制触发滚动的延迟 (ms) */
export const SCROLL_FORCE_TRIGGER_DELAY = 50;

// ============= 节点检测配置 =============
/** 节点检测最大重试次数 */
export const NODE_CHECK_RETRY_MAX = 8;

/** 节点检测重试间隔 (ms) */
export const NODE_CHECK_RETRY_INTERVAL = 100;

// ============= 可视章节更新配置 =============
/** 可视章节更新防抖等待时间 (ms) */
export const VISIBLE_CHAPTER_UPDATE_WAIT = 200;

/** 更新可视章节时间的延迟 (ms) */
export const VISIBLE_CHAPTER_UPDATE_DELAY = 100;

/** 可视章节更新最小触发间隔 (ms) */
export const VISIBLE_CHAPTER_UPDATE_MIN_INTERVAL = 300;

// ============= 其他配置 =============
/** 滚动容器 ID 前缀 */
export const WRAPPER_ID = 'stt-scroll-wrapper';

/** 大纲组件 ID */
export const OUTLINE_COMPONENT_ID = 'stt-outline-component';
