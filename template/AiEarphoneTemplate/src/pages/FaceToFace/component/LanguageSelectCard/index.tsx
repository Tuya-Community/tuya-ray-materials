/*
 * @Author: hkc
 * @Date: 2025-07-10 14:48:47
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-23 20:55:30
 * @Description:
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { getStorageSync, setStorageSync, View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import triangleDownIcon from '@tuya-miniapp/icons/dist/svg/TriangleDown';
import clsx from 'clsx';
import ThemedImage from '@/components/ThemedImage';

import Strings from '@/i18n';
import Res from '@/res';
import { useSelector } from '@/redux';
import { useDispatch } from 'react-redux';
import { updateLangSelects } from '@/redux/modules/f2fLangSelectsSlice';
import { SYSTEM_LANGS } from '@/constant';
import { getDefaultLangs } from '@/utils';
import { trackEvent } from '@/utils/track';
import { getSupportLangText } from '@/utils/lang';

import styles from './index.module.less';

export enum ModeType {
  Normal = 'normal', // 正常模式
  PhoneEar = 'phoneEar', // 手机-耳机模式
  CallTranslation = 'callTranslation', // 通话翻译模式
}

interface IProps {
  mode?: ModeType; // 模式
  onLangClick?: (option: 'input' | 'output') => void; // 语言选择点击回调
}

const Index: React.FC<IProps> = props => {
  const { mode = ModeType.Normal, onLangClick } = props;
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.systemInfo);
  const { myLang, friendLang } = useSelector(state => state.f2fLangSelects);
  const supportLangList = useSelector(selectUiStateByKey('supportLangList')) || [];

  // card 点击
  const handleOptionClick = useCallback(
    (option: 'input' | 'output') => {
      // 埋点-点击语言选择
      trackEvent('ty_GTj0N6tRLDlM7MOEV6ccyCBOKdg790yL', 'card_click', {
        position_info: {
          position_type: option === 'input' ? 'my_lang' : 'friend_lang',
        },
      });

      onLangClick?.(option);
    },
    [onLangClick]
  );

  useEffect(() => {
    if (supportLangList?.length > 1) {
      // 优先使用缓存
      const storageOriginalLang = getStorageSync({ key: 'FTFOriginalLang' }) || '';
      const storageTargetLang = getStorageSync({ key: 'FTFTargetLang' }) || '';
      // 我的语言为空且缓存有值，则设置缓存的语言
      if (!myLang && storageOriginalLang) {
        dispatch(updateLangSelects({ myLang: storageOriginalLang as string }));
      }

      // 朋友的语言为空且缓存有值，则设置缓存的语言
      if (!friendLang && storageTargetLang) {
        dispatch(updateLangSelects({ friendLang: storageTargetLang as string }));
        return;
      }

      // 确定朋友的语言
      let initFriendLang = friendLang || storageTargetLang;
      // 我的语言直接用系统语言映射
      const initMyLang = myLang || SYSTEM_LANGS?.[language] || 'en'; // SYSTEM_LANGS已经跟supportLangList映射
      // 没有缓存，则使用默认值
      if (!initFriendLang || friendLang === myLang) {
        initFriendLang = getDefaultLangs(supportLangList, initMyLang);
      }

      dispatch(
        updateLangSelects({
          myLang: initMyLang,
          friendLang: initFriendLang,
        })
      );
    }
  }, [supportLangList, language, myLang, friendLang]);

  useEffect(() => {
    if (myLang) {
      setStorageSync({
        key: 'FTFOriginalLang',
        data: myLang,
      });
    }
    if (friendLang) {
      setStorageSync({
        key: 'FTFTargetLang',
        data: friendLang,
      });
    }
  }, [myLang, friendLang]);

  const leftLang = useMemo(() => {
    switch (mode) {
      case ModeType.CallTranslation:
        return Strings.getLang('call_translation_opposite_lang');
      case ModeType.PhoneEar:
        return Strings.getLang('ftf_phone');
      case ModeType.Normal:
        return Strings.getLang('ftf_friend_lang');
      default:
        return Strings.getLang('ftf_friend_lang');
    }
  }, [mode]);

  const rightLang = useMemo(() => {
    switch (mode) {
      case ModeType.CallTranslation:
        return Strings.getLang('call_translation_my_lang');
      case ModeType.PhoneEar:
        return Strings.getLang('ftf_earphone');
      case ModeType.Normal:
        return Strings.getLang('ftf_my_lang');
      default:
        return Strings.getLang('ftf_my_lang');
    }
  }, [mode]);

  return (
    <View className={styles.container}>
      <View className={styles.card}>
        <View className={clsx(styles.titleWrapper, styles.friend)}>
          {mode === ModeType.PhoneEar && <ThemedImage imageName="phoneGreenPng" src={Res.phoneGreenPng} className={styles.titleIcon} />}
          <View className={styles.title}>{leftLang}</View>
        </View>
        <View
          id="faceToface-friend-lang"
          className={styles.lang}
          onClick={() => handleOptionClick('input')}
        >
          {getSupportLangText(friendLang)}
          <Icon name={triangleDownIcon} className={styles.downIcon} />
        </View>
      </View>
      <View className={styles.card}>
        <View className={clsx(styles.titleWrapper, styles.my)}>
          {mode === ModeType.PhoneEar && <ThemedImage imageName="basicActiveIcon" src={Res.basicActiveIcon} className={styles.titleIcon} />}
          <View className={styles.title}>{rightLang}</View>
        </View>
        <View
          id="faceToface-my-lang"
          className={styles.lang}
          onClick={() => handleOptionClick('output')}
        >
          {getSupportLangText(myLang)}
          <Icon name={triangleDownIcon} className={styles.downIcon} />
        </View>
      </View>
    </View>
  );
};

export default Index;
