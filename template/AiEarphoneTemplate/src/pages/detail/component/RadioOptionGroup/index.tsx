import React from 'react';
import { Radio, RadioGroup, CellGroup, Cell } from '@ray-js/smart-ui';
import styles from './index.module.less';

export interface RadioOption {
  name: string;
  label: string;
  disabled?: boolean;
}

interface RadioOptionGroupProps {
  value: string;
  options: RadioOption[];
  onChange: (name: string) => void;
  allowDeselect?: boolean; // 是否允许取消选中，默认 false
}

/**
 * 可复用的单选选项组组件
 */
const RadioOptionGroup: React.FC<RadioOptionGroupProps> = ({
  value,
  options,
  onChange,
  allowDeselect = false,
}) => {
  const handleClick = (event: any) => {
    const { name } = event.currentTarget.dataset;

    // 如果允许取消选中，且点击的是当前选中项，则取消选中（传递空字符串或 undefined）
    if (allowDeselect && name === value) {
      onChange('');
      return;
    }

    onChange(name);
  };

  return (
    <RadioGroup value={value}>
      <CellGroup customClass={styles.cellGroup} inset insetBorderRadius={12}>
        {options.map(option => (
          <Cell
            key={option.name}
            titleClass={styles.cellTitle}
            title={option.label}
            clickable
            data-name={option.name}
            onClick={handleClick}
          >
            <Radio name={option.name} disabled={option.disabled ?? false} />
          </Cell>
        ))}
      </CellGroup>
    </RadioGroup>
  );
};

export default RadioOptionGroup;
