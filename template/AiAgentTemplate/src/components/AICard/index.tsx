import React, { FC, useState } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import { debounce } from 'lodash-es';
import { imgAICardArrowIcon, imgAILogo } from '@/res';
import { AIAgent } from '@/types';
import TouchableOpacity from '../TouchableOpacity';
import styles from './index.module.less';

interface Props extends AIAgent {
  className?: string;
  circleColor?: string;
  bodyBgColor?: string;
  isShowRightArrow: boolean;
  isShowRightEditor: boolean;
  enableLongPress?: boolean;
  editText: string;
  wakeWord?: string;
  style?: React.CSSProperties;
  onClickCard?: () => void;
  handleEdit?: (id: number) => void;
  handleLongPress?: () => void;
}

const AICard: FC<Props> = ({
  id,
  name,
  introduce,
  logoUrl,
  added,
  creator,
  className,
  wakeWord,
  style,
  circleColor = '#1270C4',
  bodyBgColor,
  isShowRightArrow,
  isShowRightEditor = true,
  editText,
  enableLongPress = false,
  onClickCard,
  handleEdit,
  handleLongPress,
}) => {
  const [topper, setTopper] = useState(false);

  const handleEditClick = event => {
    event.origin.stopPropagation();

    const debounceEdit = debounce(() => {
      if (added) {
        return;
      }
      setTopper(true);
      handleEdit && handleEdit(id);
    }, 300);

    debounceEdit();
  };

  return (
    <TouchableOpacity
      className={clsx(styles.container, topper && styles.topper, className)}
      style={{ ...style, background: bodyBgColor }}
      disabled={!onClickCard}
      onClick={onClickCard}
      onLongPress={() => {
        enableLongPress && handleLongPress();
      }}
    >
      <View className={styles.circle}>
        <Image src={logoUrl === '' ? '' : logoUrl} className={styles.logo} />
      </View>
      <View className={styles.textBox}>
        <View>
          <Text className={styles.aiName}>{name}</Text>
          <Text className={styles.aiIntroduce}>{introduce}</Text>
          {creator && (
            <Text className={styles.aiCreator}>
              {creator}
            </Text>
          )}
        </View>
      </View>
      {isShowRightEditor && (
        <View
          className={styles.editIconBox}
          style={{ color: circleColor }}
          onClick={handleEditClick}
        >
          <View
            className={styles.editIcon}
            style={{
              color: wakeWord ? '#FFFFFF' : circleColor,
              backgroundColor: wakeWord ? 'rgba(255, 255, 255, 0.2)' : '#FFFFFF',
              opacity: added ? 0.6 : 1,
            }}
          >
            <Text className={styles.editText}>{editText}</Text>
          </View>
        </View>
      )}

      {isShowRightArrow && <Image src={imgAICardArrowIcon} className={styles.rightArrow} />}
    </TouchableOpacity>
  );
};

export default AICard;
