/* eslint-disable no-case-declarations */
import { FC, useCallback, useRef, useState } from 'react';
import { Image, View } from '@ray-js/ray';
import { ActionSheet, DateTimePicker } from '@ray-js/smart-ui';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { useThemeColor } from '@/hooks';
import Strings from '@/i18n';
import { updateUserInformation, UserInformation } from '@/redux/modules/userInformationSlice';
import Res from '@/res';
import { cmToInchUnit } from '@/utils/unit';
import { Modal, Text, TouchableOpacity } from '../common';
import HeightUnitPicker from '../HeightUnitPicker';
import WeightUnitPicker from '../WeightUnitPicker';
import styles from './index.module.less';

const getuserSingleInformation = (key: string, value: UserInformation) => {
  switch (key) {
    case 'sex':
      return Strings.getLang(value[key] === 0 ? 'dsc_Male' : 'dsc_Female');
    case 'birthday':
      return moment(value[key]).format('YYYY-MM-DD');
    case 'height':
      const heightValue = cmToInchUnit(value[key], value.heightUnit);
      return +value[key] ? heightValue : '';
    case 'weight':
      return +value[key] ? `${value[key]}${Strings.getLang(`${value.weightUnit}Unit`)}` : '';
    default:
      return '';
  }
};

interface Props {
  item: 'sex' | 'birthday' | 'height' | 'weight';
  value: UserInformation;
}
const SingleInformation: FC<Props> = props => {
  const { item, value } = props;

  const [showModal, setShowModal] = useState(false);
  const [showSexModal, setShowSexModal] = useState(false);
  const themeColor = useThemeColor();

  const valueSelect = useRef([value[item]]);

  const dispatch = useDispatch();

  const sexData = [
    {
      name: Strings.getLang('dsc_Male'),
      val: 0,
      checked: valueSelect.current[0] === 0,
    },
    {
      name: Strings.getLang('dsc_Female'),
      val: 1,
      checked: valueSelect.current[0] === 1,
    },
  ];

  const onPressAction = (keyCode: string) => {
    switch (keyCode) {
      case 'sex':
        setShowSexModal(true);
        break;
      case 'birthday':
        setShowModal(true);
        break;
      case 'height':
        setShowModal(true);
        break;
      case 'weight':
        setShowModal(true);
        break;
      default:
        break;
    }
  };
  // 体重 / 身高选择
  const pickerChange = useCallback(val => {
    valueSelect.current = val;
  }, []);
  // 关闭弹窗
  const onCloseModal = () => {
    setShowModal(false);
  };
  const handleSelect = evt => {
    const { val } = evt.detail;
    valueSelect.current = [val];
    dispatch(updateUserInformation({ ...value, [item]: val }));
  };

  return (
    <View className={styles.container}>
      <TouchableOpacity className={styles.buttonBox} onClick={() => onPressAction(item)}>
        <Text className={styles.title}>{Strings.getLang(`dsc_${item}`)}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text className={styles.text}>{getuserSingleInformation(item, value)}</Text>
          <Image className={styles.arrow} src={Res.arrow7x12} />
        </View>
      </TouchableOpacity>
      <ActionSheet
        round
        actions={sexData}
        activeColor={themeColor}
        cancelText={Strings.getLang('dsc_cancel')}
        show={showSexModal}
        onCancel={() => setShowSexModal(false)}
        onClose={() => setShowSexModal(false)}
        onSelect={handleSelect}
      />
      <Modal
        show={showModal}
        title={Strings.getLang(`dsc_${item}`)}
        onCancel={onCloseModal}
        onConfirm={() => {
          dispatch(updateUserInformation({ ...value, [item]: valueSelect.current[0] }));
          onCloseModal();
        }}
      >
        {item === 'birthday' && (
          <DateTimePicker
            maxDate={new Date().getTime()}
            minDate={moment(new Date()).add(-200, 'year').valueOf()}
            showToolbar={false}
            type="date"
            value={valueSelect.current[0]}
            onInput={({ detail }) => pickerChange([detail])}
          />
        )}
        {item === 'weight' && (
          <WeightUnitPicker
            defaultValue={[value[item], value.weightUnit || 'kg']}
            rangeConfig={{ min: 1, max: 300, step: 1, point: true }}
            showTab={false}
            onChange={pickerChange}
          />
        )}
        {item === 'height' && (
          <HeightUnitPicker
            defaultValue={[value[item], value.heightUnit || 'cm']}
            rangeConfig={{ min: 1, max: 300, step: 1 }}
            showTab={false}
            onChange={pickerChange}
          />
        )}
      </Modal>
    </View>
  );
};

export default SingleInformation;
