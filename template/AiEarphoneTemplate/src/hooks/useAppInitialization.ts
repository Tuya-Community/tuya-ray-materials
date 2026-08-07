import { useEffect, useState } from 'react';
import { home, initPanelEnvironment } from '@ray-js/ray';
import { kit } from '@ray-js/panel-sdk';
import store from '@/redux';
import { getAccountBenefits, getAllVasMallData } from '@/redux/modules/shopInfoSlice';
import { updateHomeInfo } from '@/redux/modules/homeInfoSlice';
import { devInfoChange } from '@/redux/modules/devInfoSlice';
import { formatDevSchema, getCustomDevType } from '@/utils';
import { MINI_PROGRAM_ID, TEMPLATE_SAMPLE_MINI_PROGRAM_ID } from '@/constant';

const { getCurrentHomeInfo } = home;
const { initDevInfo } = kit;

/** 开发态：未替换模板默认 MINI_PROGRAM_ID 时告警 */
const warnIfDefaultMiniProgramId = () => {
  if (process.env.NODE_ENV !== 'development') return;
  if (MINI_PROGRAM_ID !== TEMPLATE_SAMPLE_MINI_PROGRAM_ID) return;
  console.warn(
    '[panel] MINI_PROGRAM_ID 仍为模板默认值，请在 src/constant/index.ts 中替换为你的小程序 / 面板 ID，否则商城绑定与 Agent 渠道会指向示例配置。'
  );
};

/**
 * 设备面板初始化：initDevInfo + 家庭信息 + 商城数据
 */
export const useAppInitialization = () => {
  const [initialized, setInitialized] = useState(false);

  const getHomeInfo = () => {
    getCurrentHomeInfo({
      success: res => {
        store.dispatch(updateHomeInfo(res));
        store.dispatch(getAccountBenefits(res.homeId));
        const current = store.getState()?.devInfo;
        if (current?.devId && current.devId !== 'PHONE') {
          store.dispatch(devInfoChange({ homeId: res.homeId }));
        }
      },
    });
  };

  useEffect(() => {
    warnIfDefaultMiniProgramId();
    initPanelEnvironment({ useDefaultOffline: true });
    getHomeInfo();

    (async () => {
      try {
        const raw = await initDevInfo();
        if (raw) {
          const customDevType = getCustomDevType(raw);
          store.dispatch(
            devInfoChange(
              formatDevSchema({
                ...raw,
                customDevType,
              })
            )
          );
        }
      } catch (error) {
        console.warn('[panel] early initDevInfo failed', error);
      } finally {
        store.dispatch(
          getAllVasMallData({
            isSupportRealtime: true,
          })
        );
        setInitialized(true);
      }
    })();
  }, []);

  return { initialized };
};
