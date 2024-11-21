import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { hex2rgbString } from '@ray-js/panel-sdk/lib/utils';
import { Image, router, showToast, View } from '@ray-js/ray';
import { ActionSheet, Field } from '@ray-js/smart-ui';
import { useDispatch } from 'react-redux';

import { PageWrapper, Text, TopBar, TouchableOpacity } from '@/components';
import { dpCodes } from '@/config';
import { useThemeColor } from '@/hooks';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import Res from '@/res';
import { checkDpExist, getDpSchema } from '@/utils';
import styles from './index.module.less';

const RegisterName: FC = () => {
  const dispatch = useDispatch();
  const themeColor = useThemeColor();
  const themeColor2 = hex2rgbString(themeColor, 0.4);
  const { userSetCode } = dpCodes;
  const ishaveUserSet = checkDpExist(userSetCode);
  const { range = [] } = getDpSchema(userSetCode) || {};
  const [userName, setUserName] = useState('');
  const [show, setShow] = useState(false);

  const userInformation = useSelector(state => state.userInformation);
  const userTypeCode = useRef(userInformation.userTypeCode || range[0] || '');

  const userList = range.map((item, index) => {
    return {
      name: Strings.getDpLang(userSetCode, item),
      val: item,
      checked: item === userTypeCode.current,
    };
  });

  const handleSelect = useCallback(
    evt => {
      const { val } = evt.detail;
      userTypeCode.current = val;
    },
    [userInformation]
  );

  // 点击下一页的触发事件
  const onPressNext = () => {
    if (userName === '') {
      showToast({ title: Strings.getLang('dsc_please_chose_name') });
    } else {
      dispatch(
        updateUserInformation({ ...userInformation, userName, userTypeCode: userTypeCode.current })
      );
      router.replace('/registerSex');
    }
  };

  const onInputName = (text: string) => {
    setUserName(text);
    dispatch(updateUserInformation({ ...userInformation, userName: text }));
  };

  return (
    <>
      <TopBar root right={<View />} title={Strings.getLang('dsc_registerTopbar1')} />
      <PageWrapper>
        <View className={styles.textBox}>
          <Text className={styles.headTitle}>{Strings.getLang('dsc_userNickname')}</Text>
          <Text className={styles.subTitle}>{Strings.getLang('dsc_userNmaeTips')}</Text>
        </View>

        <View className={styles.userBox}>
          <Field
            customStyle={{
              height: '80rpx',
              width: '456rpx',
              fontSize: '48rpx',
              borderColor: '#0000001A',
              borderBottomWidth: 1,
              textAlign: 'center',
              paddingTop: 0,
              paddingBottom: 0,
              color: 'rgba(0,0,0,0.84)',
              backgroundColor: 'transparent',
            }}
            maxlength={20}
            placeholder={Strings.getLang('dsc_registerNameTips1')}
            value={userName}
            onChange={({ detail }) => onInputName(detail)}
          />
          {ishaveUserSet && (
            <TouchableOpacity
              activeOpacity={1}
              className={styles.innerBox}
              onClick={() => setShow(true)}
            >
              <Text
                className={styles.userName}
                numberOfLines={1}
                style={{
                  color: userTypeCode.current === '' ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.9)',
                }}
              >
                {userTypeCode.current === ''
                  ? Strings.getLang('dsc_userTypeCode')
                  : Strings.getDpLang(userSetCode, userTypeCode.current)}
              </Text>
              <Image className={styles.iconExchange} src={Res.iconExchange} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className={styles.toNextButton}
          style={{ backgroundColor: userName === '' ? themeColor2 : themeColor }}
          onClick={onPressNext}
        >
          <Text className={styles.nextText}>{Strings.getLang('dsc_buttonNext')}</Text>
        </TouchableOpacity>
      </PageWrapper>
      <ActionSheet
        round
        actions={userList}
        activeColor={themeColor}
        cancelText={Strings.getLang('dsc_cancel')}
        show={show}
        title={Strings.getLang('dsc_userTypeCode')}
        onCancel={() => setShow(false)}
        onClose={() => setShow(false)}
        onSelect={handleSelect}
      />
    </>
  );
};

export default RegisterName;
