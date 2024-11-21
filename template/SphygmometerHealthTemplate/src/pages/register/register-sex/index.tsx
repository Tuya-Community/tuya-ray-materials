import { FC, useState } from 'react';
import { hex2rgbString } from '@ray-js/panel-sdk/lib/utils';
import { Image, router, ScrollView, showToast, View } from '@ray-js/ray';
import { useDispatch } from 'react-redux';

import { PageWrapper, Text, TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import Res from '@/res';
import styles from './index.module.less';

const RegisterSex: FC = () => {
  const dispatch = useDispatch();
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const themeColor2 = hex2rgbString(themeColor, 0.4);
  const userInformation = useSelector(state => state.userInformation);

  const [sex, setSex] = useState('');

  const windowHeight = useSelector(state => state.systemInfo.windowHeight);

  const onPressPre = () => {
    router.replace('/registerName');
  };
  const onPressNext = () => {
    if (sex === '') {
      showToast(Strings.getLang('dsc_please_chose_sex2'));
    } else {
      dispatch(
        updateUserInformation({
          ...userInformation,
          sex: sex === 'male' ? 0 : 1,
        })
      );
      router.replace('/registerBirthday');
    }
  };
  return (
    <>
      <TopBar root right={<View />} title={Strings.getLang('dsc_registerTopbar1')} />
      <PageWrapper>
        <ScrollView scrollY={windowHeight < 812} style={{ flex: 1 }}>
          <View className={styles.textBox}>
            <Text className={styles.headTitle}>{Strings.getLang('dsc_userSex')}</Text>
            <Text className={styles.subTitle}>{Strings.getLang('dsc_userSexTips1')}</Text>
          </View>
          <Image className={styles.registerBg} src={Res.registerBg} />
          <View
            className={styles.sexBox}
            style={{
              marginBottom: windowHeight > 812 ? 0 : windowHeight > 667 ? '40rpx' : '70rpx',
            }}
          >
            <View className={styles.sexModule}>
              <TouchableOpacity
                className={styles.sexImageBox}
                style={{ backgroundColor: sex === 'male' ? themeColor : 'rgba(0,0,0,0.1)' }}
                onClick={() => setSex('male')}
              >
                <Image className={styles.sexImage} src={Res.male} />
              </TouchableOpacity>
              <Text className={styles.sexText} style={{ color: 'rgba(0,0,0,0.3)' }}>
                {Strings.getLang('dsc_man3')}
              </Text>
            </View>
            <View className={styles.sexModule}>
              <TouchableOpacity
                className={styles.sexImageBox}
                style={{ backgroundColor: sex === 'female' ? themeColor : 'rgba(0,0,0,0.1)' }}
                onClick={() => setSex('female')}
              >
                <Image className={styles.sexImage} src={Res.female} />
              </TouchableOpacity>
              <Text className={styles.sexText} style={{ color: 'rgba(0,0,0,0.3)' }}>
                {Strings.getLang('dsc_woman3')}
              </Text>
            </View>
          </View>
          {sex !== '' && (
            <Image className={styles.portrait} src={sex === 'male' ? Res.man : Res.woman} />
          )}
        </ScrollView>
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
            style={{ backgroundColor: sex === '' ? themeColor2 : themeColor }}
            onClick={onPressNext}
          >
            <Text className={styles.buttonText}>{Strings.getLang('dsc_buttonNext')}</Text>
          </TouchableOpacity>
        </View>
      </PageWrapper>
    </>
  );
};

export default RegisterSex;
