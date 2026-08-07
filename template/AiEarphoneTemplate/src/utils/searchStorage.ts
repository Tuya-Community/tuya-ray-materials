/**
 * 搜索页本地存储：历史关键词、最近点击的 recordId（顺序即点击时间倒序）
 */
import { getStorageSync, setStorageSync } from '@ray-js/ray';

const STORAGE_KEY_HISTORY = 'ai_note_search_history_keywords_v1';
const STORAGE_KEY_RECENT_IDS = 'ai_note_search_recent_record_ids_v1';

/** 历史关键词最多条数 */
export const MAX_SEARCH_HISTORY = 30;
/** 最近搜索 recordId 最多条数 */
export const MAX_RECENT_RECORD_IDS = 10;
/** 搜索框最大字符数 */
export const MAX_SEARCH_INPUT_CHARS = 500;

function parseJsonArray<T>(raw: unknown, fallback: T[]): T[] {
  if (raw == null || raw === '') {
    return fallback;
  }
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/** 读取历史关键词（新在前） */
export function getSearchHistoryKeywords(): string[] {
  const raw = getStorageSync({ key: STORAGE_KEY_HISTORY });
  return parseJsonArray<string>(raw, []);
}

/**
 * 记录一次搜索关键词：先移除列表中相同词（重复搜索删旧），再插到队首，截断至 MAX_SEARCH_HISTORY
 */
export function addSearchHistoryKeyword(keyword: string): void {
  const k = keyword.trim();
  if (!k) {
    return;
  }
  const prev = getSearchHistoryKeywords();
  const filtered = prev.filter(item => item !== k);
  const next = [k, ...filtered].slice(0, MAX_SEARCH_HISTORY);
  setStorageSync({ key: STORAGE_KEY_HISTORY, data: JSON.stringify(next) });
}

export function clearSearchHistoryKeywords(): void {
  setStorageSync({ key: STORAGE_KEY_HISTORY, data: JSON.stringify([]) });
}

/** 最近搜索：recordId 数组，下标 0 为最近一次点击 */
export function getRecentSearchRecordIds(): string[] {
  const raw = getStorageSync({ key: STORAGE_KEY_RECENT_IDS });
  return parseJsonArray<string>(raw, []);
}

/**
 * 点击搜索结果：去掉已有同 recordId，再插到队首，截断至 MAX_RECENT_RECORD_IDS
 */
export function addRecentSearchRecordId(recordId: string): void {
  if (!recordId) {
    return;
  }
  const prev = getRecentSearchRecordIds();
  const filtered = prev.filter(id => id !== recordId);
  const next = [recordId, ...filtered].slice(0, MAX_RECENT_RECORD_IDS);
  setStorageSync({ key: STORAGE_KEY_RECENT_IDS, data: JSON.stringify(next) });
}

/** 覆盖最近搜索 recordId 列表（与首页列表对齐后剔除无效项时使用） */
export function setRecentSearchRecordIds(recordIds: string[]): void {
  const next = recordIds.slice(0, MAX_RECENT_RECORD_IDS);
  setStorageSync({ key: STORAGE_KEY_RECENT_IDS, data: JSON.stringify(next) });
}

/** 去掉 HTML/高亮标签，仅展示纯文本 */
export function stripSearchHighlightMarkup(s: string): string {
  if (!s) {
    return '';
  }
  return s.replace(/<[^>]*>/g, '').trim();
}
