/* eslint-disable no-unused-expressions */
import React, { useCallback, useEffect, useState } from 'react';
import { View } from '@ray-js/ray';
import { Picker } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import { cmToFt, cmToInch, getDatasourceByRange, HeightUnit, inchToCm } from '@/utils/unit';
import UnitTab from '../UnitTab';

const heightUnits = [
  { key: HeightUnit.cm, title: Strings.getLang('cmUnit') },
  { key: HeightUnit.inch, title: Strings.getLang('inchUnit') },
];

interface IProps {
  onChange?: (val: any[]) => void;
  rangeConfig?: { min: number; max: number; step: number };
  defaultValue?: any[];
  showTab?: boolean;
}

// 身高选择数据
const HeightUnitTabPicker: React.FC<IProps> = ({
  onChange,
  rangeConfig = { min: 0, max: 300, step: 1 },
  defaultValue = ['170', 'cm'],
  showTab = true,
}) => {
  const _heightUnit = defaultValue[1];
  const { min, max, step } = rangeConfig;
  const cmDatasource = getDatasourceByRange(min, max, step);
  const ftDatasource = getDatasourceByRange(cmToFt(min), cmToFt(max), 1);
  const inchDatasource = getDatasourceByRange(0, 12, 1);
  const [unit, setUnit] = useState(_heightUnit);
  const [value, setValue] = useState(
    defaultValue[1] === HeightUnit.inch
      ? [cmToFt(defaultValue[0]), cmToInch(defaultValue[0])]
      : [defaultValue[0]]
  );

  const getIndex = (arr, value) => {
    return arr.findIndex(item => Number(item.value) === Number(value));
  };

  /**
   * 单位切换 渲染 Picker 数据源配置获取
   */
  const getPickerConfig = (unit: string, value: number[]) => {
    let config: {
      values: { value: number; label: string }[];
      unit: string;
      activeIndex?: number;
    }[] = [];
    switch (unit) {
      case HeightUnit.cm:
        config = [
          {
            values: cmDatasource,
            unit: Strings.getLang('cmUnit'),
            activeIndex: getIndex(cmDatasource, value[0]),
          },
        ];
        break;
      case HeightUnit.inch:
        config = [
          {
            values: ftDatasource,
            unit: Strings.getLang('ftUnit'),
            activeIndex: getIndex(ftDatasource, value[0]),
          },
          {
            values: inchDatasource,
            unit: Strings.getLang('inchUnit'),
            activeIndex: getIndex(inchDatasource, value[1]),
          },
        ];
        break;
      default:
        break;
    }
    return config;
  };
  const [pickerConfig, setPickerConfig] = useState(getPickerConfig(_heightUnit, value));
  /**
   * 单位切换
   */
  const onUnitChange = useCallback(
    v => {
      if (v === HeightUnit.cm && unit === HeightUnit.inch) {
        const cmValue = inchToCm(value[0], value[1]);
        setValue([cmValue]);
        onChange && onChange([cmValue, v]);
        setPickerConfig(getPickerConfig(v, [cmValue]));
      } else if (v === HeightUnit.inch) {
        const ftValue = cmToFt(value[0]);
        const inValue = cmToInch(value[0]);
        onChange && onChange([value[0], v]);
        setValue([ftValue, inValue]);
        setPickerConfig(getPickerConfig(v, [ftValue, inValue]));
      }
      setUnit(v);
    },
    [unit, value]
  );

  const handlePickerChange = useCallback(event => {
    const { value } = event.detail;
    if (unit === HeightUnit.inch) {
      setValue([value[0].value, value[1].value]);
      onChange && onChange([inchToCm(value[0].value, value[1].value), unit]);
    } else {
      setValue([value[0].value]);
      onChange && onChange([value[0].value, unit]);
    }
  }, []);

  return (
    <View style={{ width: '100%' }}>
      {showTab && (
        <UnitTab className="m-b-40" data={heightUnits} value={unit} onChange={onUnitChange} />
      )}
      <Picker
        columns={pickerConfig}
        id="picker"
        toolbarPosition="bottom"
        valueKey="label"
        onChange={handlePickerChange}
      />
    </View>
  );
};

export default HeightUnitTabPicker;
