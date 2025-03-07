import React, { FC } from 'react';
import { Text, View, Image } from '@ray-js/ray';
import dayjs from 'dayjs';
import { imgVoiceIcon } from '@/res';

import Strings from '@/i18n';
import { TouchableOpacity } from '@/components';
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
}) => {
  return (
    <TouchableOpacity
      key={voiceId}
      className={styles.container}
      style={{
        border: isChecked ? '6rpx solid #408CFF' : '6rpx solid rgba(255,255,255,0)',
        ...style,
      }}
      onClick={handleChecked}
    >
      <View className={styles.rightBox}>
        <Image src={imgVoiceIcon} className={styles.icon} />
        <View className={styles.textBox}>
          <Text className={styles.voiceName}>{voiceName}</Text>
          {createTime && (
            <Text className={styles.createTime}>{`${dayjs(createTime).format(
              'YYYY/MM/DD HH:mm'
            )}`}</Text>
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
        onClick={() => {
          handleEdit();
        }}
        disabled={!isChecked}
        style={{ opacity: !isChecked ? 0.5 : 1 }}
      >
        <Text className={styles.editText}>{Strings.getLang('dsc_edit')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default VoiceItem;
