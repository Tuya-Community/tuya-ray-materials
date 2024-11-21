import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, usePageEvent, Icon } from '@ray-js/ray';
import { updateCommonInfo, commonCheckInfo } from '@/redux/modules/commonInfoSlice';
import { getCServicesAbility, setCServicesPop } from '@/api/request';
import store from '@/redux';
import Strings from '@/i18n';
import styles from './index.module.less';

export const ServiceToast = ({ devId, theme, statusBarHeight }) => {
  const { dispatch } = store;
  const commonInfo = useSelector(commonCheckInfo);
  const { inService, isPidHadVAS, commodityUrl } = commonInfo;

  usePageEvent('onShow', () => {
    checkServiceAbility();
  });

  // C端续费能力判断 （未购买增值服务或服务已过期 弹窗提示）
  const checkServiceAbility = () => {
    getCServicesAbility(devId)
      .then(async res => {
        const { inService, isPidHadVAS, commodityUrl, hadPopup } = res;
        dispatch(updateCommonInfo({ inService, isPidHadVAS, commodityUrl: commodityUrl || '' }));
        if (!hadPopup && isPidHadVAS && inService) {
          // 品牌方有配置C端用户续费套餐有赠送
          if (commodityUrl && commodityUrl !== '') {
            ty.showModal({
              title: '',
              content: Strings.getLang('serviceActive'),
              confirmText: Strings.getLang('goCheck'),
              cancelText: Strings.getLang('confirm'),
              showCancel: true,
              cancelColor: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              success: ({ confirm, cancel }) => {
                if (confirm) {
                  // 跳转详情
                  ty.openInnerH5({ url: commodityUrl });
                }
              },
            });
          } else {
            // 涂鸦默认赠送
            ty.showModal({
              title: '',
              content: Strings.getLang('serviceActive'),
              showCancel: false,
              confirmText: Strings.getLang('confirm'),
            });
          }
          await setCServicesPop(devId);
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <>
      {!inService && isPidHadVAS ? (
        <View
          className={styles.toastView}
          style={{ background: 'var(--app-B4)', top: `${statusBarHeight + 39}px` }}
        >
          <View className={styles.toastLeft}>
            <Icon size={22} type="icon-warning" color="#FF4444" />
            <Text className={styles.toastText} style={{ color: 'var(--app-B1-N1)' }}>
              {commodityUrl && commodityUrl !== ''
                ? Strings.getLang('serviceExpire')
                : Strings.getLang('serviceExpireBrand')}
            </Text>
          </View>
          <View>
            {commodityUrl && commodityUrl !== '' && (
              <View
                className={styles.toastBtnText}
                onClick={() => ty.openInnerH5({ url: commodityUrl })}
              >
                {Strings.getLang('clickRenew')}
              </View>
            )}
          </View>
        </View>
      ) : null}
    </>
  );
};
