import React, { FC, useState } from 'react';
import { Text, View, Image } from '@ray-js/ray';
import { imgVoiceIcon } from '@/res';
import Strings from '@/i18n';
import dayjs from 'dayjs';
import { TouchableOpacity } from '@/components';
import { getTheme } from '@/utils';
import styles from './index.module.less';

interface Props {
  isChecked?: boolean;
  voiceName?: string;
  createTime?: string | number;
  voiceId: string;
  descTags?: Array<any>;
  style?: React.CSSProperties;
  handleEdit: () => void;
  handleChecked: () => void;
  isCanEdit?: boolean;
}

const VoiceItem: FC<Props> = ({
  isChecked,
  voiceName,
  createTime,
  voiceId,
  descTags,
  style,
  handleEdit,
  handleChecked,
  isCanEdit,
}) => {
  const [themeColor, setThemeColor] = useState(getTheme());

  return (
    <TouchableOpacity
      key={voiceId}
      className={styles.container}
      style={{
        border: isChecked ? `6rpx solid ${themeColor}` : '6rpx solid transparent',
        ...style,
      }}
      onClick={handleChecked}
    >
      <View className={styles.rightBox}>
        <Image src={imgVoiceIcon} className={styles.icon} />
        <View className={styles.textBox}>
          <Text className={styles.voiceName}>{voiceName}</Text>
          {createTime && (
            <Text className={styles.createTime}>
              {dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          )}
          {descTags && (
            <View className={styles.tagBox}>
              {descTags.map(item => {
                return (
                  <View key={item} className={styles.singleTag}>
                    <Text className={styles.tabText}>{item}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        className={styles.editBtn}
        onClick={e => {
          handleEdit();
        }}
        disabled={!isCanEdit}
        style={{
          opacity: !isCanEdit ? 0.5 : 1,
          backgroundColor: themeColor,
        }}
      >
        <Text className={styles.editText}>{Strings.getLang('dsc_edit_voice')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default VoiceItem;
