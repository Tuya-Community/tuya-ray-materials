import React, { ComponentProps, CSSProperties, FC } from 'react';
import { View, Text } from '@ray-js/ray';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectAgentList } from '@/redux/modules/agentListSlice';
import styles from './index.module.less';

type ViewProps = ComponentProps<typeof View>;

interface Props extends ViewProps {
  type?: 'primary' | 'default';
  tagKey: string;
  text: string;
  tagStyle?: CSSProperties;
  underlineStyle?: CSSProperties;
  isShowUnderline?: boolean;
}

const Tag: FC<Props> = ({
  type = 'default',
  tagKey,
  text,
  tagStyle,
  className,
  isShowUnderline,
  underlineStyle,
  ...otherProps
}) => {
  const { newNumber } = useSelector(selectAgentList);
  return (
    <View className={clsx(styles.tag, styles[type], className)} style={tagStyle} {...otherProps}>
      <Text className={styles.text}>{text}</Text>
      {isShowUnderline && (
        <View className={styles.underline} style={{ ...underlineStyle, width: tagStyle.width }} />
      )}
      {tagKey === 'dialog' && type === 'default' && newNumber > 0 && (
        <View className={styles.newTips}>
          <Text className={styles.newText}>{newNumber}</Text>
        </View>
      )}
    </View>
  );
};

export default Tag;
