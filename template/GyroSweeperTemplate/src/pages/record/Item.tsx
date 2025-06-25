import React, { FC, memo } from 'react';
import { router, Text, View } from 'ray';
import { Icon, SwipeCell } from '@ray-js/smart-ui';
import {
  iconAngleRight,
  iconChecked,
  iconCleanArea,
  iconCleanTime,
  iconDelete,
  iconUnchecked,
} from '@/res/iconsvg';
import Strings from '@/i18n';
import { THEME_COLOR } from '@/constant';

import styles from './index.module.less';

type Props = {
  data: CleanRecord;
  isDeleteMode: boolean;
  selected: boolean;
  onDelete?: (recordId: string) => void;
  onSelect?: (recordId: string) => void;
};

const Item: FC<Props> = ({
  data: { recordId, parsedData },
  isDeleteMode,
  selected,
  onDelete,
  onSelect,
}) => {
  const { timeDate, date, area, time, subRecordId, timestamp } = parsedData;

  const handleDelete = () => {
    onDelete?.(recordId);
  };

  const handleClick = () => {
    if (isDeleteMode) {
      onSelect?.(recordId);
      return;
    }

    router.push(`/map?subRecordId=${subRecordId}&area=${area}&time=${time}&timestamp=${timestamp}`);
  };

  return (
    <SwipeCell
      rightWidth={64}
      slot={{
        right: (
          <View className={styles.delete} hoverClassName="touchable" onClick={handleDelete}>
            <Icon name={iconDelete} size="24px" color="#fff" />
          </View>
        ),
      }}
    >
      <View className={styles.item} onClick={handleClick}>
        {isDeleteMode && (
          <View style={{ marginRight: '32rpx' }}>
            <Icon
              name={selected ? iconChecked : iconUnchecked}
              size="72rpx"
              color={selected ? THEME_COLOR : 'rgba(0, 0, 0, 0.2)'}
            />
          </View>
        )}
        <View className={styles.itemContent}>
          <Text>
            <Text className={styles.date}>{date}</Text>
            <Text className={styles.date}>{timeDate}</Text>
          </Text>
          <View className={styles.bottom}>
            <Icon name={iconCleanArea} size="36rpx" color="rgba(0, 0, 0, 0.7)" />
            <Text className={styles.label}>{Strings.getLang('recordArea')}</Text>
            <Text className={styles.value}>
              {area} {Strings.getDpLang('clean_area', 'unit')}
            </Text>
            <View className={styles.divider} />
            <Icon name={iconCleanTime} size="36rpx" color="rgba(0, 0, 0, 0.7)" />
            <Text className={styles.label}>{Strings.getLang('recordTime')}</Text>
            <Text className={styles.value}>
              {time} {Strings.getDpLang('clean_time', 'unit')}
            </Text>
          </View>
        </View>
        {!isDeleteMode && <Icon name={iconAngleRight} size="44rpx" color="rgba(0, 0, 0, 0.5)" />}
      </View>
    </SwipeCell>
  );
};

export default memo(Item);
