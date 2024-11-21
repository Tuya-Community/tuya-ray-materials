import { FC, useEffect, useState } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';

import { useSelector } from '@/redux';
import { Tab, Tabs } from '@ray-js/smart-ui';
import styles from './index.module.less';

const getTabRadios = (arr: ItemProps[]) => {
  return arr.map(v => ({
    key: v.key,
    title: v.title,
    tabStyle: { alignItems: 'center', backgroundColor: '#A699FF' },
    textStyle: { fontSize: 16 },
  }));
};

interface ItemProps {
  key: string;
  title: string;
}
export enum UnitType {
  'height' = 'height',
  'width' = 'width',
}
export interface Props {
  data: ItemProps[];
  value: string;
  className?: string;
  onChange: (unit: string) => void;
}

const UnitTab: FC<Props> = ({ data, value, onChange, className }) => {
  const [unit, setUnit] = useState(value);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const tabs = getTabRadios(data);

  useEffect(() => {
    setUnit(value);
  }, [value]);

  return (
    <View className={clsx(styles.container, className)}>
      <Tabs
        animated
        active={unit}
        color={themeColor}
        navClass={styles.nav}
        tabClass={styles.tab}
        titleActiveColor="#fff"
        titleInactiveColor="#000"
        type="card"
        wrapClass={styles.tabWrap}
        onChange={({ detail }) => {
          const { name } = detail;
          setUnit(name);
          onChange && onChange(name);
        }}
      >
        {tabs.map(v => (
          <Tab key={v.key} name={v.key} title={v.title} titleStyle={{ fontSize: '32rpx' }} />
        ))}
      </Tabs>
    </View>
  );
};

export default UnitTab;
