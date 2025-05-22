import React, { FC } from 'react';
import { ScrollView, View } from '@ray-js/ray';
import clsx from 'clsx';
import { themeColor } from '@/constant';
import Tag from '../Tag';
import styles from './index.module.less';

interface TagsItem {
  text: string;
  key: string;
}

interface Props {
  tags: Array<TagsItem>;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  tagStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  activeUnderlineColor?: string;
  underlineColor?: string;
  isShowUnderline?: boolean;
  scrollToIdKey?: string;
  onChange?: (tag: string, text: string) => void;
}

const TagBar: FC<Props> = ({
  tags,
  value,
  className,
  style,
  tagStyle,
  activeStyle = {},
  activeUnderlineColor = themeColor,
  underlineColor = '#D8D8D8',
  isShowUnderline,
  containerStyle,
  scrollToIdKey,
  onChange,
}) => {
  return (
    <ScrollView
      scrollX
      className={clsx(styles.scroll, className)}
      style={style}
      scrollIntoView={scrollToIdKey}
      scrollWithAnimation
    >
      <View
        id="topView"
        style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
      />
      <View className={styles.container} style={containerStyle}>
        {tags?.map((tag, index) => {
          const { text, key } = tag;
          const styleObj = value === key ? activeStyle : tagStyle;
          const lineColor = value === key ? activeUnderlineColor : underlineColor;
          return (
            <Tag
              key={key}
              text={text}
              style={{
                flexShrink: 0,
                // marginLeft: index === 0 ? '32rpx' : 0,
                marginRight: index < tags.length - 1 ? '16rpx' : 0,
                ...styleObj,
              }}
              type={value === key ? 'primary' : 'default'}
              tagKey={key}
              tagStyle={tagStyle}
              onClick={() => onChange(key, text)}
              underlineStyle={{
                backgroundColor: lineColor,
              }}
              isShowUnderline={isShowUnderline}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default TagBar;
