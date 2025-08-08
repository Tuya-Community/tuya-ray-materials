import Strings from '@/i18n';
import { navigateTo, usePageEvent } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { debounce, formatLabels } from '@/utils';
import { DialogInstance } from '@ray-js/smart-ui';
import { useCountdownList } from '@ray-js/electrician-timing-sdk/lib/hooks/countdown';
import { cancelCountdown } from '@ray-js/electrician-timing-sdk';
import { useCountdownFilter } from '@/hooks/useCountdownFilter';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  relativePath: string;
}

const CountdownList: FC<Props> = ({ relativePath }) => {
  const { list: allCountdown, cancelAutoCountdown } = useCountdownList(true);
  const { dpNames } = useCommon();
  const list = useCountdownFilter(allCountdown);
  const dpState = useProps((d) => d);
  const handleEdit = useCallback(
    debounce((id: string, type: FuncType) => {
      navigateTo({ url: `${relativePath}countdown/countdown/index?dpCode=${id}` });
    }),
    [],
  );

  const handleDelete = useCallback(async (id: string, type: FuncType) => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_delete_countdown_tips'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          await cancelCountdown(id);
        }
        return Promise.resolve(true);
      },
    });
  }, []);

  usePageEvent('onUnload', () => {
    console.log('cancel auto countdown');
    cancelAutoCountdown();
  });

  return (
    <>
      {list.map((item) => {
        const hour = Math.floor(item.leftTime / 3600);
        const minute = Math.ceil((item.leftTime % 3600) / 60);
        // dp处理
        let label = 'ret_countdown_minute_action';
        const args = [minute, Strings.getLang(dpState[item.effectCode] ? 'ret_off' : 'ret_on')];
        if (hour > 0) {
          label = 'ret_countdown_hour_action';
          args.splice(0, 0, hour);
        }
        const switches = [dpNames[item.effectCode] || Strings.getDpLang(item.effectCode)];
        // @ts-expect-error
        const labels: Array<string | number> = formatLabels(Strings.getLang(label), ...args);
        return (
          <TimerItem
            key={item.id}
            type={FuncType.countdown}
            id={item.id}
            label={labels}
            switches={switches.join('、')}
            onClick={handleEdit}
            hideSwitch
            status
            onDelete={handleDelete}
          />
        );
      })}
    </>
  );
};

export default CountdownList;
