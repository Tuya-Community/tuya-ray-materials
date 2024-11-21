/* eslint-disable no-unused-expressions */
import React, { useCallback, useState } from 'react';
import { View } from '@ray-js/ray';
import { Picker } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import {
  getDatasourceByRange,
  getDecimal,
  getPointDatasourceByRange,
  kgToOther,
  otherToKg,
  WeightUnit,
} from '@/utils/unit';
import UnitTab from '../UnitTab';

const widthUnits = [
  { key: 'kg', title: Strings.getLang('kgUnit') },
  { key: 'lb', title: Strings.getLang('lbUnit') },
  { key: 'st', title: Strings.getLang('stUnit') },
  { key: 'jin', title: Strings.getLang('jinUnit') },
];

interface IProps {
  onChange?: (val: any[]) => void;
  rangeConfig?: { min: number; max: number; step: number; point?: boolean };
  defaultValue?: any[];
  showTab?: boolean;
}

const WeightUnitPicker: React.FC<IProps> = ({
  onChange,
  rangeConfig = { min: 0, max: 300, step: 1, point: true },
  defaultValue = ['56', 'kg'],
  showTab = true,
}) => {
  const _weightUnit = defaultValue[1];
  const { min, max, step, point } = rangeConfig;
  const kgDatasource = getDatasourceByRange(min, max, step);
  const minLbConfig = kgToOther({ num: min, unit: WeightUnit.lb });
  const maxLbConfig = kgToOther({ num: max, unit: WeightUnit.lb });
  const lbDatasource = getDatasourceByRange(minLbConfig, maxLbConfig, step);
  const minStConfig = kgToOther({ num: min, unit: WeightUnit.st });
  const maxStConfig = kgToOther({ num: max, unit: WeightUnit.st });
  const stDatasource = getDatasourceByRange(minStConfig, maxStConfig, step);
  const minJinConfig = kgToOther({ num: min, unit: WeightUnit.jin });
  const maxJinConfig = kgToOther({ num: max, unit: WeightUnit.jin });
  const jinDatasource = getDatasourceByRange(minJinConfig, maxJinConfig, step);
  const [unit, setUnit] = useState(_weightUnit);
  const [value, setValue] = useState([Math.floor(defaultValue[0]), getDecimal(defaultValue[0])]);

  const getIndex = (arr, value) => {
    return arr.findIndex(item => Number(item.value) === Number(value));
  };

  /**
   * 单位切换 渲染 Picker 数据源配置获取
   */
  const getPickerConfig = useCallback(
    (unit: string, value: number[]) => {
      let config: {
        values: { value: number; label: string }[];
        unit?: string;
        activeIndex?: number;
      }[] = [];
      switch (unit) {
        case WeightUnit.kg:
          config = [
            {
              values: kgDatasource,
              activeIndex: getIndex(kgDatasource, value[0]),
            },
            {
              values: getPointDatasourceByRange(0, 0.9, 0.1),
              unit: Strings.getLang('kgUnit'),
              activeIndex: getIndex(getPointDatasourceByRange(0, 0.9, 0.1), value[1]),
            },
          ];
          break;
        case WeightUnit.lb:
          config = [
            { values: lbDatasource, activeIndex: getIndex(lbDatasource, value[0]) },
            {
              values: getPointDatasourceByRange(0, 0.8, 0.2),
              unit: Strings.getLang('lbUnit'),
              activeIndex: getIndex(getPointDatasourceByRange(0, 0.8, 0.2), value[1]),
            },
          ];
          break;
        case WeightUnit.st:
          config = [
            { values: stDatasource, activeIndex: getIndex(stDatasource, value[0]) },
            {
              values: getPointDatasourceByRange(0, 0.8, 0.2),
              unit: Strings.getLang('stUnit'),
              activeIndex: getIndex(getPointDatasourceByRange(0, 0.8, 0.2), value[1]),
            },
          ];
          break;
        case WeightUnit.jin:
          config = [
            { values: jinDatasource, activeIndex: getIndex(jinDatasource, value[0]) },
            {
              values: getPointDatasourceByRange(0, 0.9, 0.1),
              unit: Strings.getLang('jinUnit'),
              activeIndex: getIndex(getPointDatasourceByRange(0, 0.9, 0.1), value[1]),
            },
          ];
          break;
        default:
          break;
      }
      if (point === false) {
        config[0].unit = unit;
        config.pop();
      }
      return config;
    },
    [rangeConfig]
  );
  const [pickerConfig, setPickerConfig] = useState(getPickerConfig(_weightUnit, value));

  /**
   * 单位切换
   */
  const onUnitChange = (v: any) => {
    const otherToKgValue = otherToKg(+value[0] + +value[1], unit);
    const kgToOtherValue = kgToOther({ num: otherToKgValue, unit: v, scale: 1 });
    const [int, decimal] = kgToOtherValue.toString().split('.');
    setValue([Number(int), getDecimal(+decimal * 0.1) || 0]);
    setUnit(v);
    setPickerConfig(getPickerConfig(v, [Number(int), getDecimal(+decimal * 0.1) || 0]));
    onChange && onChange([Number(int) + getDecimal(+decimal * 0.1) || 0, v]);
  };

  const handlePickerChange = useCallback(event => {
    const { value } = event.detail;
    setValue([Number(value[0].value), Number(value[1].value)]);
    onChange && onChange([Number(value[0].value) + Number(value[1].value), unit]);
  }, []);

  return (
    <View>
      {showTab && (
        <UnitTab className="m-b-42" data={widthUnits} value={unit} onChange={onUnitChange} />
      )}
      <Picker
        columns={pickerConfig}
        toolbarPosition="bottom"
        valueKey="label"
        onChange={handlePickerChange}
      />
    </View>
  );
};

export default WeightUnitPicker;
