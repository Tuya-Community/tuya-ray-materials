import React from 'react';
import { Image, Text, View } from '@ray-js/ray';
import { splitArray } from '@/utils/kit';
import styles from './index.module.less';

export interface RowListProps<T> {
  current: number;
  onChange(id: number, item: T, index: number): void;
  dataSource: T[];
}

export function RowList<
  T extends {
    id: number;
    title?: string;
    name?: string;
    icon: string;
  }
>({ dataSource, current, onChange }: RowListProps<T>) {
  const list = splitArray(dataSource, 4);
  return (
    <View className={styles.list}>
      {list.map((row, i) => (
        <View className={styles.row} key={i} style={{ marginTop: i > 0 ? '48rpx' : '0' }}>
          {row.map((item, i) => {
            return (
              <View
                key={item.id}
                style={{
                  marginLeft: i > 0 ? '52rpx' : '0',
                  alignSelf: 'flex-start',
                  flexShrink: 0,
                }}
                hoverClassName="button-hover"
                onClick={() => {
                  onChange(item.id, item, i);
                }}
              >
                <Image
                  style={{
                    border: +current === +item.id ? '2px solid #1082FE' : '2px solid transparent',
                  }}
                  className={styles.icon}
                  src={item.icon}
                />
                <Text className={styles.label}>{item.title || item.name}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
