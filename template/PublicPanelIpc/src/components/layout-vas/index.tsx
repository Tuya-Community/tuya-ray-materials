import React, { useMemo, useState, memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Image } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import isEmpty from 'lodash/isEmpty';
import * as Request from '@/api';
import { useMount, useRequest } from 'ahooks';
import HalfHorizontalDrag from '@ray-js/ray-ipc-half-horizontal-drag';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import Res from '@/res';
import { useHomeInfo, useSystemInfo } from '@/hooks';
import { goToMiniProgramByShortLink } from '@ray-js/ray-ipc-utils';
import qs from 'qs';
import Strings from '@/i18n';

import {
  ServiceHallPageType,
  ServiceStatus,
  ServiceFunctionName,
} from '@/entities/serviceHall/interface';

import { MINI_APP_ID } from './constant';
import Styles from './index.module.less';

interface Props {
  onVasDataLengthChange: (dataLength: number) => void;
}

export const LayoutVas = memo(({ onVasDataLengthChange }: Props) => {
  const devInfo = useDevice(device => device.devInfo);
  const homeInfo = useHomeInfo();
  const { theme = 'light' } = useSystemInfo() || {};
  const { data } = useRequest(
    () => {
      // eslint-disable-line
      if (homeInfo?.homeId && devInfo?.uuid) {
        return Request.serviceHall.getServiceHallSetting({
          homeId: homeInfo.homeId,
          instanceId: devInfo.uuid,
          type: 0,
        });
      }
      return null;
    },
    {
      refreshDeps: [devInfo?.uuid, homeInfo?.homeId],
    }
  );

  // 将vas数据长度传递给父组件
  useEffect(() => {
    if (data) {
      const dataLength = Array.isArray(data?.recommendServiceList)
        ? data?.recommendServiceList.length
        : 0;
      onVasDataLengthChange(dataLength);
    }
  }, [data, onVasDataLengthChange]);

  const list = useMemo(() => {
    if (!data || !data.recommendServiceList || !data.recommendServiceList.length) return [];
    return data.recommendServiceList;
  }, [data]);

  const getTag = (item: (typeof list)[number]) => {
    const txtMap: Partial<Record<ServiceStatus, string>> = {
      [ServiceStatus.EXPIRE]: Strings.getLang('service_expire'),
      [ServiceStatus.OPENED]: Strings.getLang('service_opened'),
    };
    const bgColor: Partial<Record<ServiceStatus, string>> = {
      [ServiceStatus.EXPIRE]: 'linear-gradient(2deg, #F02020 21%, #FF6C6C 104%)',
      [ServiceStatus.OPENED]: 'linear-gradient(349deg, #0BDB42 34%, #74FF6C 105%);',
    };
    const txtColor: Partial<Record<ServiceStatus, string>> = {
      [ServiceStatus.EXPIRE]: '#FEFFB8',
      [ServiceStatus.OPENED]: '#FFF6B8',
    };
    return {
      title: [ServiceHallPageType.MALL_HOME, ServiceHallPageType.MALL_H5_URL].includes(
        item.pageType
      )
        ? txtMap[item.serviceStatus]
        : '',
      color: txtColor[item.serviceStatus],
      bgColor: bgColor[item.serviceStatus],
    };
  };

  const goTo = (item: (typeof list)[number]) => {
    if (item.pageType === ServiceHallPageType.MALL_HOME) {
      const url = `godzilla://${MINI_APP_ID}?deviceId=${devInfo.uuid}&categoryCode=${item.categoryCode}`;
      goToMiniProgramByShortLink(url, 'bottom');
    } else if (item.pageType === ServiceHallPageType.MALL_H5_URL) {
      const url = `${item.pageLink}&homeId=${homeInfo.homeId}`;
      ty.openInnerH5({ url });
    } else if (item.pageType === ServiceHallPageType.CUSTOM_H5_URL) {
      ty.openInnerH5({ url: item.pageLink });
    } else if (item.pageType === ServiceHallPageType.MINI_MINI_APPID) {
      let pages = '';
      if (item.miniAppUrl) {
        pages = item.miniAppUrl.indexOf('/') === 0 ? item.miniAppUrl : `/${item.miniAppUrl}`;
      }
      const connect = pages.indexOf('?') > 0 ? '&' : '?';
      const url = `godzilla://${item.miniAppId}${pages}${connect}deviceId=${devInfo.uuid}&categoryCode=${item.categoryCode}`;
      goToMiniProgramByShortLink(url, 'bottom');
    } else if (item.pageType === ServiceHallPageType.MAIN_MINI_URL) {
      goToMiniProgramByShortLink(item.miniAppUrl, 'bottom');
    } else if (item.pageType === ServiceHallPageType.MAIN_FUTURE) {
      const pathMaps: Record<ServiceFunctionName, string> = {
        [ServiceFunctionName.MY_SERVICE]: 'pages/myService/index',
        [ServiceFunctionName.ORDER]: 'pages/myOrder/index',
        [ServiceFunctionName.REDEEM_CODE]: 'pages/redeemCode/index',
      };
      const query = qs.stringify({
        categoryCode: item.categoryCode,
        homeId: homeInfo.homeId,
        deviceId: devInfo.uuid,
      });
      const url = `godzilla://${MINI_APP_ID}/${pathMaps[item.mainFunctionCode]}?${query}`;
      goToMiniProgramByShortLink(url, 'bottom');
    }
  };

  const bannerData = useMemo(() => {
    if (!list || !list.length) return [];
    return list.map(item => {
      const tagInfo = getTag(item);
      return {
        title:
          item.pageType === ServiceHallPageType.MAIN_FUTURE
            ? item.serviceFunctionName || item.serviceName
            : item.serviceName,
        icon: <Image src={item.serviceIcon} style={{ width: '40rpx', height: '40rpx' }} />,
        tag: tagInfo.title || undefined,
        tagStyle: {
          color: tagInfo.color,
          background: tagInfo.bgColor,
        },
        style: {
          color: theme === 'light' ? item.serviceNameDayColor : item.serviceNameNightColor,
        },
        backgroundImage: item.deviceBackgroundColor,
        background: item.deviceBackgroundColor ? undefined : '#fff',
        onClick: () => goTo(item),
      };
    });
  }, [list, theme]);

  if (isEmpty(data)) {
    return null;
  }
  return (
    <View className={Styles.comContainer}>
      <HalfHorizontalDrag style={{ height: '110rpx', paddingLeft: '16rpx' }} data={bannerData} />
    </View>
  );
});
