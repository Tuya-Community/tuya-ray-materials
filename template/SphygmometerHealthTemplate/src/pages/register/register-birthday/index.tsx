import { FC, useRef, useState } from 'react';
import { router, View } from '@ray-js/ray';
import { DateTimePicker } from '@ray-js/smart-ui';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { PageWrapper, Text, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import styles from './index.module.less';

const RegisterBirthday: FC = () => {
  const selectDate = useRef(moment(new Date()).add(-50, 'year').valueOf());
  const dispatch = useDispatch();
  const userInformation = useSelector(state => state.userInformation);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  const onPressPre = () => {
    router.replace('/registerSex');
  };

  const onPressNext = () => {
    dispatch(
      updateUserInformation({
        ...userInformation,
        birthday: selectDate.current,
      })
    );

    router.replace('/registerHeight');
  };

  return (
    <>
      <TopBar root right={<View />} title={Strings.getLang('dsc_registerTopbar1')} />
      <PageWrapper>
        <View style={{ flex: 1 }}>
          <View className={styles.textBox}>
            <Text className={styles.headTitle}>{Strings.getLang('dsc_userBirth')}</Text>
            <Text className={styles.subTitle}>{Strings.getLang('dsc_userBirthTips')}</Text>
          </View>
          <View className={styles.date}>
            <DateTimePicker
              maxDate={new Date().getTime()}
              minDate={moment().add(-200, 'year').valueOf()}
              showToolbar={false}
              type="date"
              value={selectDate.current}
              onInput={({ detail }) => {
                selectDate.current = detail;
              }}
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

export default RegisterBirthday;
