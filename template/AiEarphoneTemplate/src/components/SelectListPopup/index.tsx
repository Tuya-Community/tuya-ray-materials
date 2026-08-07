/*
 * @Author: hkc
 * @Date: 2025-07-11 20:04:22
 * @LastEditors: hkc
 * @LastEditTime: 2025-07-22 15:49:23
 * @Description: 选择弹窗
 */
import React, { useEffect, useMemo, useState } from 'react';
import { BottomSheet, Button, Icon } from '@ray-js/smart-ui';
import { ScrollView, View } from '@ray-js/ray';
import checkIcon from '@tuya-miniapp/icons/dist/svg/Check';
import { useSelector, useDispatch } from 'react-redux';
import { devInfoChange, selectDevInfo } from '@/redux/modules/devInfoSlice';
import Strings from '@/i18n';
import { isNumber } from 'lodash-es';
import clsx from 'clsx';
import { formatDevSchema } from '@/utils';

// @ts-ignore
import styles from './index.module.less';

type dataType = {
  [key: string]: any;
  label?: React.ReactNode;
  value?: string | number;
  disabled?: boolean;
};

interface IProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  extra?: React.ReactNode; // 标题右侧自定义内容
  height?: string | number;
  hiddenButton?: boolean; // 是否隐藏底部按钮
  selectedValue?: string | number;
  fieldNames?: {
    label?: string;
    value?: string | number;
  };
  dataSource?: dataType[];
  type?: 'activeDev' | 'devList'; // activeDev: 激活设备列表，devList: 设备列表
  onSave?: (value: string | number, originItem: dataType) => void;
}

const Index: React.FC<IProps> = props => {
  const {
    title,
    extra,
    show,
    onClose,
    height = '50vh',
    hiddenButton = false,
    selectedValue,
    dataSource = [],
    fieldNames,
    type = 'devList', // 默认是设备列表
    onSave,
  } = props;
  const dispatch = useDispatch();
  const { label = 'label', value = 'value' } = fieldNames || {};
  const [currentValue, setCurrentValue] = useState(selectedValue);
  const [selectedData, setSelectedData] = useState<dataType>();

  useEffect(() => {
    setCurrentValue(selectedValue);
    const item = dataSource.find(item => item?.[value] === selectedValue);
    if (type === 'devList') {
      // 更新选中的设备到redux
      item && dispatch(devInfoChange(formatDevSchema(item)));
    }

    setSelectedData(item);
  }, [selectedValue, dataSource]);

  // 列表项点击
  const handleClick = (item: dataType) => {
    if (item?.disabled) return;
    setSelectedData(item);
    if (type === 'devList') {
      // 更新选中的设备到redux
      item && dispatch(devInfoChange(formatDevSchema(item)));
    }
    setCurrentValue(item[value]);
  };

  // 保存
  const handleSave = () => {
    onSave?.(currentValue, selectedData);
    onClose();
  };

  return (
    <BottomSheet
      customClass={styles.bottomSheet}
      show={show}
      contentHeight={height}
      onClose={onClose}
    >
      <View className={styles.header}>
        <View className={styles.title}>{title || Strings.getLang('select_device')}</View>
        <View className={styles.extra}>{extra}</View>
      </View>
      <ScrollView
        scroll-y
        style={{
          height: `calc(${isNumber(height) ? `${height}px` : height} - ${hiddenButton ? 80 : 130
            }px - env(safe-area-inset-bottom))`,
        }}
        hideScrollbar={true}
        className={styles.list}
      >
        {dataSource.map(item => (
          <View
            key={item[value]}
            className={clsx(styles.listItem, {
              [styles.disabled]: item.disabled,
            })}
            onClick={() => handleClick(item)}
          >
            <View className={styles.label}>{item[label]}</View>
            <Icon
              name={checkIcon}
              color="var(--color-primary)"
              className={clsx(styles.checkIcon, {
                [styles.show]: currentValue === item[value],
              })}
            />
          </View>
        ))}
      </ScrollView>
      {!hiddenButton && (
        <Button customClass={styles.save} onClick={handleSave}>
          {Strings.getLang('save')}
        </Button>
      )}
    </BottomSheet>
  );
};

export default Index;
