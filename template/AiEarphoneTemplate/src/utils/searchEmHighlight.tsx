import React, { useMemo } from 'react';
import { Text } from '@ray-js/components';
import EllipsisText from '@/components/EllipsisText';

/**
 * 约定：服务端在「普通字符串」里用字面量 `<em>...</em>` 标记要高亮的片段，
 * 并非 HTML，不按标签解析；仅识别这一对固定子串，其余字符原样展示。
 */
const EM_MARK_RE = /<em>([\s\S]*?)<\/em>/g;

export type EmSegment = { type: 'text' | 'em'; text: string };

/**
 * 按字面量 `<em>...</em>` 拆成普通段与高亮段；区段外内容不做任何 HTML 剥离。
 */
export function parseEmSegments(raw: string | undefined | null): EmSegment[] {
  if (!raw) {
    return [];
  }
  const s = String(raw);
  const parts: EmSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(EM_MARK_RE.source, EM_MARK_RE.flags);
  const matches = Array.from(s.matchAll(re));
  matches.forEach(m => {
    const idx = m.index ?? 0;
    if (idx > lastIndex) {
      const text = s.slice(lastIndex, idx);
      if (text.length > 0) {
        parts.push({ type: 'text', text });
      }
    }
    const inner = m[1] ?? '';
    if (inner.length > 0) {
      parts.push({ type: 'em', text: inner });
    }
    lastIndex = idx + m[0].length;
  });
  if (lastIndex < s.length) {
    const text = s.slice(lastIndex);
    if (text.length > 0) {
      parts.push({ type: 'text', text });
    }
  }
  if (parts.length === 0) {
    parts.push({ type: 'text', text: s });
  }
  return parts;
}

export interface EmRichTextProps {
  /** 普通字符串，可含字面量 `<em>...</em>` 标记 */
  content: string | undefined | null;
  className?: string;
  /** 与 @ray-js/components Text 一致 */
  numberOfLines?: number;
  highlightClassName?: string;
}

/**
 * 将 `<em>...</em>` 包裹的子串高亮显示，其余子串原样渲染（嵌套 Text 以兼容小程序）
 */
export const EmRichText: React.FC<EmRichTextProps> = ({
  content,
  className,
  numberOfLines,
  highlightClassName,
}) => {
  const parts = useMemo(() => parseEmSegments(content), [content]);
  const text = useMemo(() => {
    return parts.map((seg, i) => {
      if (!seg.text) {
        return null;
      }
      if (seg.type === 'em') {
        return (
          <Text className={highlightClassName} style={{ display: 'inline' }}>
            {seg.text}
          </Text>
        );
      }
      return <Text style={{ display: 'inline' }}>{seg.text}</Text>;
    });
  }, [parts]);
  if (parts.length === 0) {
    return <></>;
  }
  return <EllipsisText className={className} numberOfLines={numberOfLines} text={text} />;
};
