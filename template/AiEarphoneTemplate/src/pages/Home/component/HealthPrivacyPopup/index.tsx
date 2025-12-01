import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@ray-js/components';
import Strings from '@/i18n';
import CustomPopup from '@/components/CustomPopup';
import { useSelector } from 'react-redux';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { selectUserInfo } from '@/redux/modules/userInfoSlice';
// @ts-ignore
import styles from './index.module.less';

const HealthPrivacyPopup: FC = () => {
  const { devId } = useSelector(selectDevInfo);
  const [privacyUrl, setPrivacyUrlUrl] = useState('');
  const [show, setShow] = useState(false);
  const { regionCode } = useSelector(selectUserInfo);
  const region = regionCode === 'AY' ? 'cn_' : '';
  useEffect(() => {
    // atopProtocolRecord({ devId }).then(d => {
    //   if (!d) {
    //     setShow(true);
    //   }
    // });
    // atopGetPrivacyUrl({ devId }).then((d: any) => {
    //   if (d?.privacyUrl) {
    //     setPrivacyUrlUrl(d?.privacyUrl);
    //   }
    // });
  }, []);

  const handleClickOverlay = () => {
    ty.exitMiniProgram();
  };

  const handleClickConfirm = () => {
    // atopProtocolAgree({ devId }).then(d => {
    //   setShow(false);
    // });
    setShow(false);
  };

  const handleOpenUrl = () => {
    ty.openURL({ url: privacyUrl });
  };

  return (
    <CustomPopup
      title={Strings.getLang(`privacy_title`)}
      show={show}
      hideBottomBtn
      onClickOverlay={handleClickOverlay}
    >
      <View className={styles.container}>
        <ScrollView refresherTriggered={false} scrollY className={styles.scrollView}>
          <Text className={styles.text}>{Strings.getLang(`privacy_part1`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`${region}privacy_part2`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part2_child1`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part2_child2`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part3`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part3_child1`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part3_child2`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part3_child3`)}</Text>
          <Text className={styles.text}>{Strings.getLang(`privacy_part3_child4`)}</Text>
          <View className={styles.text}>
            {Strings.getLang('privacy_promise_1')}
            <Text
              className={styles.inlineText}
              style={{ color: 'rgba(54, 120, 227, 1)' }}
              onClick={handleOpenUrl}
            >
              {Strings.getLang('privacy_promise_2')}
            </Text>
            <Text className={styles.inlineText}>{Strings.getLang('privacy_promise_3')}</Text>
          </View>
          <Text className={styles.text}>{Strings.getLang('privacy_promise_child1')}</Text>
          <Text className={styles.text}>{Strings.getLang('privacy_promise_child2')}</Text>
          <Text className={styles.text}>{Strings.getLang('privacy_promise_child3')}</Text>
          <Text className={styles.text}>{Strings.getLang('privacy_last_var')}</Text>
          <Text className={styles.text}>{Strings.getLang('privacy_thanks')}</Text>
        </ScrollView>
        <View className={styles.bottom}>
          <View
            className={styles.cancelBtn}
            style={{ marginRight: '12px' }}
            onClick={handleClickOverlay}
          >
            <Text className={styles.cancelBtnText}>{Strings.getLang('privacy_cancel')}</Text>
          </View>
          <View className={styles.confirmBtn} onClick={handleClickConfirm}>
            <Text className={styles.confirmBtnText}>{Strings.getLang('privacy_agree')}</Text>
          </View>
        </View>
      </View>
    </CustomPopup>
  );
};

export default React.memo(HealthPrivacyPopup);
