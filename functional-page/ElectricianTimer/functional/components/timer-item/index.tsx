import React, { useMemo, FC, useCallback } from 'react';
import { View, Text } from '@ray-js/ray';
import { FuncType } from '@/constant';
import { SwipeCell, Switch } from '@ray-js/smart-ui';
import { formatWeeks } from '@/utils';
import { Icon } from '../icon';
import styles from './index.module.less';

type LabelType =
  | string
  | number
  | {
      text: string;
      size: 'num' | 'txt';
    };

interface Props {
  type: FuncType;
  id: string | number;
  label: LabelType[];
  switches?: string;
  action?: string;
  weeks?: number[];
  status?: boolean;
  hideSwitch?: boolean;
  onClick: (id: string | number, type: FuncType) => void;
  onStatus?: (id: string | number, type: FuncType, status: boolean) => void;
  onDelete: (id: string | number, type: FuncType) => void;
}

const TimerItem: FC<Props> = ({
  weeks,
  switches,
  action,
  status,
  label,
  id,
  type,
  onStatus,
  hideSwitch,
  onClick,
  onDelete,
}) => {
  const loops = useMemo(() => {
    if (!weeks) {
      return '';
    }
    return formatWeeks(weeks);
  }, [weeks?.join('')]);
  const labelText = useMemo(() => {
    return label.map((item, i) => {
      let isNumber: boolean;
      let isDot = false;
      if (typeof item === 'object') {
        isNumber = item.size === 'num';
      } else {
        isNumber = typeof item === 'number' || /\d+/.test(item);
        isDot = item === '-';
      }
      return (
        <Text key={i} className={isNumber ? styles.number : isDot ? styles.dot : styles.txt}>
          {typeof item === 'object' ? item.text : item}
        </Text>
      );
    });
  }, [label.join('')]);
  const handleClick = useCallback(() => {
    onClick(id, type);
  }, [id, type, onClick]);
  const handleDelete = useCallback(
    (event) => {
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          onDelete(id, type);
          instance.close();
          break;
        default:
      }
    },
    [id, type, onDelete],
  );
  const handleStatus = useCallback(
    (event) => {
      onStatus && onStatus(id, type, event.detail);
    },
    [id, type, onStatus],
  );

  return (
    <SwipeCell
      rightWidth={60}
      slot={{
        right: (
          <View className={styles.right}>
            <Icon type="remove" fill="#fff" />
          </View>
        ),
      }}
      asyncClose
      onClose={handleDelete}
    >
      <View className={styles.row}>
        <View className={styles.infos} style={{ opacity: status ? 1 : 0.5 }} onClick={handleClick}>
          <View className={styles.label}>{labelText}</View>
          <View className={styles.loops}>{loops}</View>
          {!!switches && <View className={styles.switches}>{switches}</View>}
          {!!action && <View className={styles.action}>{action}</View>}
        </View>
        {!hideSwitch && <Switch checked={status} onChange={handleStatus} />}
      </View>
    </SwipeCell>
  );
};

export default TimerItem;
