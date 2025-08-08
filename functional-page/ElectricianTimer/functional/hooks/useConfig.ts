import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import { config, fetchChannelDps, setConfig } from '@/config';
import themeMap from '@/theme';
import { fetchAstronomicalList } from '@/redux/modules/astronomicalSlice';
import { getBrandColor, handleSupportFunctions } from '@/utils';
import { useDevice } from '@ray-js/panel-sdk';
import { queryDps, setNavigationBarColor, usePageEvent, useQuery } from '@ray-js/ray';
import { changeConfig, isLocalOnline } from '@ray-js/electrician-timing-sdk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAstronomicalEnabled } from '@/utils/astronomical';
import { sigMeshQueryDpTimers } from '@/utils/sigmesh';

const systemInfo = getCachedSystemInfo();

let routeCount = 0;

const handleTheme = (brand, theme) => {
  const themeConfig = {};
  console.log('change theme', theme);
  if (theme) {
    // @ts-expect-error
    setNavigationBarColor({ frontColor: theme === 'light' ? '#000000' : '#FFFFFF' });
    Object.assign(themeConfig, themeMap[theme]);
  }
  if (brand) {
    themeConfig['--app-M1'] = getBrandColor(config.brand);
  }
  // @ts-ignore
  ty.setPageStyle({
    style: themeConfig,
  });
};

/**
 * 获取配置，请在页面中使用，不要在组件中使用
 */
export const useConfig = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const { devInfo, dpSchema } = useDevice((d) => d);

  usePageEvent('onUnload', () => {
    routeCount--;
  });
  const [options] = useState(() => {
    const {
      deviceId,
      groupId,
      switchCodes, // 支持的开关
      countdownCodes, // 支持的倒计时，注意，由于开关与倒计时是配对出现，所以配置此属性，需要同时配置支持的开关
      supportCountdown = 'n', // 是否支持的倒计时,值可为： n,y，默认为不支持
      supportCycle, // 是否支持循环定时，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportRandom, // 是否支持随机定时，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportInching, // 是否支持延时开关，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportAstronomical, // 是否支持天文定时， 值可为： n,y，不传则根据设备的属性决定是否支持
      dpCodes, // 非开关性 dp 设置，多个的情况请以英文逗号隔开
      cycleCode,
      randomCode,
      inchingCode,
      is24Hour,
      category,
      brand, // 主题色
      theme, // 主题配色
      countdownSuccessAction = 'hold',
    } = query;
    console.log('query', query);
    console.log('params supportCountdown', supportCountdown);
    routeCount++;
    if (routeCount > 1) {
      handleTheme(config.brand, config.theme);

      return config;
    }
    // 配置信息保存
    const newConfig = {
      devId: deviceId || groupId,
      theme: theme || '',
      brand: brand || '',
      switchCodes: switchCodes ? switchCodes.split(',') : [],
      countdownCodes: countdownCodes ? countdownCodes.split(',') : [],
      // 支持的能力，只要配置则
      isSupportCountdown: supportCountdown,
      isSupportCycle: supportCycle,
      isSupportRandom: supportRandom,
      isSupportInching: supportInching,
      isSupportAstronomical: devInfo.groupId ? 'n' : supportAstronomical,
      cycleCode,
      randomCode,
      inchingCode,
      category,
      is24Hour: is24Hour ? is24Hour === 'y' : systemInfo.is24Hour, // 有设置则以设置为准，否则跟随系统
      countdownSuccessAction,
    };

    setConfig(newConfig);

    // @ts-ignore
    handleSupportFunctions(devInfo, dpSchema);

    handleTheme(config.brand, config.theme);

    changeConfig({
      type: 'ele',
      devId: deviceId,
      groupId,
      supportCloud: config.isSupportNormal ? config.isSupportNormal : 'auto',
      supportCycle: config.isSupportCycle ? config.isSupportCycle : 'auto',
      supportRandom: config.isSupportRandom ? config.isSupportRandom : 'auto',
      supportInching: config.isSupportInching ? config.isSupportInching : 'auto',
      cycleCode,
      randomCode,
      inchingCode,
      category,
      is24Hour: is24Hour ? is24Hour === 'y' : systemInfo.is24Hour,
      combineSameData: (switchCodes && switchCodes.indexOf(',') === -1) ? false : true,
    });

    fetchChannelDps(dpSchema)
    console.log('config-----', config);
    return config;
  });

  // useEffect(() => {
  //   console.log('panelConfig.themeInfo', panelConfig.themeInfo);
  //   if (panelConfig?.themeInfo && panelConfig.themeInfo['--app-B1']) {
  //     if (isDark(panelConfig.themeInfo['--app-B1'])) {
  //       setNavigationBarColor({ frontColor: '#FFFFFF' });
  //     } else {
  //       setNavigationBarColor({ frontColor: '#000000' });
  //     }
  //   }
  // }, [panelConfig?.themeInfo]);

  useEffect(() => {
    if (routeCount === 1) {
      // 第一次进入功能页，初始化数据
      // 天文定时支持
      if (config.isSupportAstronomical === 'y') {
        // 进入面板时，如果发现是天文定时，则直接不支持天文定时
        if (devInfo.isOnline) {
          isLocalOnline().then((res) => {
            // 本地连接情况下不支持天文定时
            res &&
              setConfig({
                isSupportAstronomical: 'n',
                functions: config.functions.filter((item) => item.key !== 'sunset' && item.key !== 'sunrise'),
              });
          });
        }

        getAstronomicalEnabled(devInfo.devId)
          .then((res) => {
            console.log('getAstronomicalEnabled', res, config.isSupportAstronomical);
            if (config.isSupportAstronomical === 'y') {
              const newConfig: any = { isSupportAstronomical: res ? 'y' : 'n' };
              if (newConfig.isSupportAstronomical === 'n') {
                newConfig.functions = config.functions.filter(
                  (item) => item.key !== 'sunset' && item.key !== 'sunrise',
                );
              } else {
                // 加载天文定时
                devInfo.devId && dispatch(fetchAstronomicalList(devInfo.devId));
              }
              setConfig(newConfig);
            }
          })
          .catch((err) => {
            console.log('getAstronomicalEnabled', err);
            setConfig({
              isSupportAstronomical: 'n',
              functions: config.functions.filter((item) => item.key !== 'sunset' && item.key !== 'sunrise'),
            });
          });
      }

      sigMeshQueryDpTimers();
    }
  }, []);

  return options;
};
