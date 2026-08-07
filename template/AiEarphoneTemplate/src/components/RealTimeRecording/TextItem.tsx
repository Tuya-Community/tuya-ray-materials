import React, { useMemo } from 'react';
import { View, Text } from '@ray-js/components';
// @ts-ignore
import styles from './index.module.less';

interface TextItemProps {
  item: {
    id: string;
    text: string;
  };
  isFirst: boolean;
  isLast: boolean;
  needTranslate: boolean;
}

// 🎯 优化点 1：提取高亮逻辑为纯函数
const getHighlightParts = (text: string, shouldHighlight: boolean) => {
  const highlightLength = 5;
  if (!shouldHighlight || text.length < highlightLength) {
    return { before: text, highlight: '' };
  }
  return {
    before: text.slice(0, -highlightLength),
    highlight: text.slice(-highlightLength),
  };
};

// 🎯 优化点 2：预定义样式类名（避免模板字符串）
const TEXT_CLASSES = {
  normalFirst: `${styles.lastRealTimeText} ${styles.firstLine}`,
  highlightFirst: `${styles.newChars} ${styles.originText}`,
  normal: styles.lastRealTimeText,
  highlight: `${styles.ogrinNewChars}`,
  origin: `${styles.lastRealTimeText} ${styles.originText}`,
  init: `${styles.lastRealTimeText} ${styles.initRealTimeText}`,
};

// 🎯 优化点 3：预定义样式对象（避免每次创建）
const MARGIN_STYLES = {
  first: { marginTop: '0' },
  normalGap: { marginTop: '12px' },
  translateGap: { marginTop: '24px' },
};

const TextItem: React.FC<TextItemProps> = ({ item, isFirst, isLast, needTranslate }) => {
  const text = item.text || '';

  // 🎯 优化点 4：使用 useMemo 缓存计算结果
  const marginStyle = useMemo(() => {
    if (isFirst) return MARGIN_STYLES.first;
    return needTranslate ? MARGIN_STYLES.translateGap : MARGIN_STYLES.normalGap;
  }, [isFirst, needTranslate]);

  const hasTranslation = text.includes('\n') && !text.endsWith('\n');
  if (hasTranslation) {
    const [originalText, translationText] = text.split('\n');
    const isTransWrap = text.startsWith('\n');
    const { before, highlight } = getHighlightParts(originalText, isLast);
    // 使用原始文本长度和内容作为 key，确保每次文本更新时都能重新触发动画
    const highlightKey = highlight ? `highlight-${item.id}-${originalText.length}-${highlight}` : '';

    return (
      <View id={item.id} className={styles.textGroup} style={marginStyle}>
        {/* 🎯 优化点 5：将高亮部分合并到一个 Text 中 */}
        <Text className={TEXT_CLASSES.normalFirst}>
          {before}
          {highlight && (
            <Text key={highlightKey} className={TEXT_CLASSES.highlightFirst}>
              {highlight}
            </Text>
          )}
          {'\n'}
        </Text>
        {translationText && (
          <Text
            className={TEXT_CLASSES.normal}
            style={{ whiteSpace: isTransWrap ? 'pre-wrap' : 'normal' }}
          >
            {isTransWrap ? `\n${translationText}` : translationText}
          </Text>
        )}
      </View>
    );
  }

  // 普通文本（无翻译）
  const { before, highlight } = getHighlightParts(text, isLast);
  const textClassName =
    needTranslate && !text.endsWith('\n') ? TEXT_CLASSES.origin : TEXT_CLASSES.init;
  // 使用文本长度和内容作为 key，确保每次文本更新时都能重新触发动画
  const highlightKey = highlight ? `highlight-${item.id}-${text.length}-${highlight}` : '';

  return (
    <View id={item.id} className={styles.textGroup} style={marginStyle}>
      <Text style={{ whiteSpace: 'pre-wrap' }} className={textClassName}>
        {before}
        {highlight && <Text key={highlightKey} className={TEXT_CLASSES.highlight}>{highlight}</Text>}
      </Text>
    </View>
  );
};

// 自定义比较函数：只在真正变化时重新渲染
export default React.memo(TextItem, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.text === nextProps.item.text &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.isFirst === nextProps.isFirst &&
    prevProps.needTranslate === nextProps.needTranslate
  );
});