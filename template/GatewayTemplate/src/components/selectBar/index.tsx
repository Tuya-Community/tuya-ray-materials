import React, { FC, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Text, View, Image, ScrollView } from '@ray-js/components';
import Res from '@/res';
import styles from './index.module.less';

const prefix = 'select-bar';

interface Option {
  label: string;
  value: string | number;
}
interface SelectBarProps {
  className?: string;
  children?: React.ReactNode;
  options?: Option[];
  value: string | number;
  onSelect?: (value: string | number) => void;
}

const SelectBar: FC<SelectBarProps> = ({
  className,
  children,
  options,
  value: componentValue,
  onSelect,
}) => {
  const [isShowOptions, setIsShowOptions] = useState(false);

  const toggleList = () => {
    setIsShowOptions(pre => !pre);
  };

  const selectedItem = useMemo(() => {
    const item = options.find(({ value }) => value === componentValue);
    return item || ({} as Option);
  }, [options, componentValue]);

  const onMaskClick = () => {
    setIsShowOptions(false);
  };

  const selectItem = (value: string | number) => {
    setIsShowOptions(false);
    onSelect(value);
  };

  return (
    <View className={clsx(styles[`${prefix}`], className)}>
      <View
        className={clsx(styles[`${prefix}-mask`], !isShowOptions && styles[`${prefix}-hidden`])}
        onClick={onMaskClick}
      />

      <View className={styles[`${prefix}-content`]}>
        <View className={styles[`${prefix}-left`]} onClick={toggleList}>
          <Text className={styles[`${prefix}-value`]}>{selectedItem.label || componentValue}</Text>
          <View className={styles[`${prefix}-arrow-down`]} />
        </View>
        {React.isValidElement(children) ? children : null}

        <ScrollView
          className={clsx(
            styles[`${prefix}-options`],
            !isShowOptions && styles[`${prefix}-hidden`]
          )}
          style={
            isShowOptions
              ? { height: `calc(var(--item-height) * ${Math.min(5, options.length)})` }
              : { height: 0 }
          }
          scrollY
        >
          {options.map(({ label, value }) => (
            // 额外包一层是为了显示背景色
            <View className={styles[`${prefix}-options-item`]} key={value}>
              <View
                className={styles[`${prefix}-options-item-content`]}
                onClick={() => selectItem(value)}
              >
                <Text className={styles[`${prefix}-options-item-label`]}>{label}</Text>
                {value === componentValue && (
                  <Image
                    className={styles[`${prefix}-options-item-icon-check`]}
                    src={Res.iconCheck}
                    mode="aspectFit"
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

SelectBar.defaultProps = {
  className: '',
  children: null,
  options: [],
  onSelect: () => ({}),
};

export default SelectBar;
