import { FC, useState } from 'react';
import { router, View } from '@ray-js/ray';
import { useDispatch } from 'react-redux';

import { HeightUnitPicker, PageWrapper, Text, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import styles from './index.module.less';

const RegisterHeight: FC = () => {
  const dispatch = useDispatch();
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const userInformation = useSelector(state => state.userInformation);
  const [height, setHeight] = useState(['170', 'cm']);
  const onPressPre = () => {
    router.replace('/registerBirthday');
  };

  const heightPickerChange = (value: any[]) => {
    setHeight(value);
  };

  const onPressNext = () => {
    dispatch(
      updateUserInformation({
        ...userInformation,
        height: parseInt(height[0], 10),
        heightUnit: height[1],
      })
    );
    router.replace('/registerWeight');
  };
  return (
    <>
      <TopBar root right={<View />} title={Strings.getLang('dsc_registerTopbar1')} />
      <PageWrapper>
        <View style={{ flex: 1 }}>
          <View className={styles.textBox}>
            <Text className={styles.headTitle}>{Strings.getLang('dsc_userHeight')}</Text>
            <Text className={styles.subTitle}>{Strings.getLang('dsc_userHeightTips')}</Text>
          </View>
          <View className={styles.pickerBox}>
            <HeightUnitPicker
              defaultValue={['170', 'cm']}
              rangeConfig={{ min: 1, max: 300, step: 1 }}
              onChange={heightPickerChange}
            />
          </View>
        </View>
        <View className={styles.buttonBox}>
          <TouchableOpacity
            className={styles.bottomButton}
            style={{ backgroundColor: themeColor }}
            onClick={onPressPre}
          >
            <Text className={styles.buttonText}>{Strings.getLang('dsc_buttonPre')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={styles.bottomButton}
            style={{ backgroundColor: themeColor }}
            onClick={onPressNext}
          >
            <Text className={styles.buttonText}>{Strings.getLang('dsc_buttonNext')}</Text>
          </TouchableOpacity>
        </View>
      </PageWrapper>
    </>
  );
};

export default RegisterHeight;
