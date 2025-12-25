import React, { useMemo, useCallback, useState } from 'react';
import { navigateToMiniProgram, openURL, router, View } from '@ray-js/ray';
import {
  useActions,
  useSupport,
  useProps,
  useStructuredProps,
  usePanelConfig,
} from '@ray-js/panel-sdk';
import { lampStandardDpCodes } from '@ray-js/panel-sdk/lib/utils';
import Card from '@/components/card';
import Strings from '@/i18n';
import { LayerDialog } from '@/components/layer-dialog';
import { useDebugPerf } from '@/hooks/useDebugPerf';
import { dpCodes } from '@/constant/dpCodes';

import { isHarmony, navToSchedule } from '@/utils/navToSchedule';
import { devices } from '@/devices';

import styles from './index.module.less';

type TProps = {
  alwaysShow?: boolean;
};

const getJumpConfig = config => {
  const isSupportJumpUrl = config?.bic?.jump_url?.selected;
  if (!isSupportJumpUrl) {
    return {
      supported: false,
      jumpUrl: '',
      title: '',
    };
  }
  const jumpUrl = JSON.parse(config?.bic?.jump_url?.value)?.[0];
  if (!jumpUrl) {
    return {
      supported: false,
      jumpUrl: '',
      title: '',
    };
  }
  const { name, value } = jumpUrl;
  return {
    supported: true,
    jumpUrl: value,
    title: name,
  };
};

export function More(props?: TProps) {
  const { alwaysShow } = props;
  useDebugPerf(More);
  const do_not_disturb = useProps(p => p.do_not_disturb);
  const power = useProps(p => p.switch_led);
  const power_memory = useStructuredProps(p => p.power_memory);
  const actions = useActions();
  const support = useSupport();
  const devInfo = devices.common.getDevInfo();

  const handleJumpStripLength = useCallback(() => {
    const { devId = '', groupId = '' } = devInfo;
    if (isHarmony) {
      navigateToMiniProgram({
        appId: 'tyqkx1mxn6xo0ofypt',
        path: `pages/home/index?deviceId=${devId || ''}&groupId=${groupId || ''}`,
      });
    } else {
      // 灯带裁剪功能页
      const jumpUrl = `functional://rayStripClipFunctional/home?deviceId=${devId || ''}&groupId=${
        groupId || ''
      }`;
      ty.navigateTo({
        url: jumpUrl,
        success(e) {
          console.log(e);
        },
        fail(e) {
          console.log(e);
        },
      });
    }
  }, [devInfo]);

  const isSupportTimer = support.isSupportCloudTimer();
  const config = usePanelConfig();
  const isSupportCloudTimerSelected = config?.bic?.timer?.selected;
  const isSupportCloudTimer = isSupportTimer || isSupportCloudTimerSelected;

  const { supported: isSupportJumpUrl, jumpUrl, title } = getJumpConfig(config);

  const handleJumpLineSequence = useCallback(() => {
    router.push('/LineSequence');
  }, []);

  const handleJumpToAdjustment = () => {
    router.push('/Adjustment');
  };

  const handleJumpUrl = () => {
    openURL({
      url: jumpUrl,
      success(e) {
        console.log(e);
      },
      fail(e) {
        console.error('openURL', e);
      },
    });
  };

  const functionalList = useMemo(() => {
    const list = [
      {
        title: Strings.getLang('scheduleTitle'),
        cardType: 'arrow',
        onClick: () => {
          navToSchedule(devInfo as any);
        },
        visible: isSupportCloudTimer || support.isSupportDp(lampStandardDpCodes.rtcTimerCode),
      },
      {
        title: Strings.getLang('disturbTitle'),
        cardType: 'switch',
        checked: do_not_disturb,
        onClickTitleTips() {
          setIsShowDisturb(true);
        },
        onSwitchChange() {
          actions.do_not_disturb.toggle();
        },
        visible: support.isSupportDp(dpCodes?.do_not_disturb),
      },
      {
        title: Strings.getLang('applyAdjustment'),
        cardType: 'arrow',
        onClick: handleJumpToAdjustment,
        visible:
          support.isSupportDp(dpCodes?.led_number_set) ||
          support.isSupportDp(dpCodes?.segment_num_set),
      },
      {
        title: Strings.formatValue('jumpUrlTitle', title),
        cardType: 'arrow',
        onClick: handleJumpUrl,
        visible: isSupportJumpUrl,
      },
      {
        title: Strings.getLang('stripLenTitle'),
        cardType: 'arrow',
        onClick: handleJumpStripLength,
        visible: support.isSupportDp(dpCodes?.light_pixel) && power,
      },
      {
        title: Strings.getLang('lineSortTitle'),
        cardType: 'arrow',
        onClick: handleJumpLineSequence,
        visible: support.isSupportDp(dpCodes?.light_bead_sequence),
      },
    ];
    return list.filter(i => i.visible);
  }, [do_not_disturb, power_memory, devInfo, power, isSupportCloudTimer]);

  const [isShowPowerMemory, setIsShowPowerMemory] = useState(false);
  const [isShowDisturb, setIsShowDisturb] = useState(false);

  const onClickPowerMemory = useCallback(() => {
    setIsShowPowerMemory(false);
  }, []);
  const renderPowerMemory = useMemo(() => {
    const title = Strings.getLang('powerMemoryTitle');
    const content = Strings.getLang('powerMemoryContent');
    return (
      <LayerDialog
        isShow={isShowPowerMemory}
        title={title}
        content={content}
        bgImg="/images/bg-power-memory.png"
        onClick={onClickPowerMemory}
      />
    );
  }, [isShowPowerMemory]);

  const onClickDisturb = useCallback(() => {
    setIsShowDisturb(false);
  }, []);

  const renderDisturb = useMemo(() => {
    const title = Strings.getLang('disturbTitle');
    const content = Strings.getLang('disturbContent');
    return (
      <LayerDialog
        isShow={isShowDisturb}
        title={title}
        content={content}
        bgImg="/images/bg-disturb.png"
        onClick={onClickDisturb}
      />
    );
  }, [isShowDisturb]);

  const styleWrapper = alwaysShow
    ? {}
    : {
        transition: 'all 0.6s linear',
        opacity: !power ? 1 : 0,
        height: !power ? 'auto' : 0,
      };
  return (
    <View className={styles.moreComponentWrapper} style={styleWrapper}>
      <View className={styles.moreComponentContent}>
        {functionalList.map((i, idx) => {
          return <Card key={idx} {...i} />;
        })}
      </View>
      {renderPowerMemory}
      {renderDisturb}
    </View>
  );
}

export default More;
