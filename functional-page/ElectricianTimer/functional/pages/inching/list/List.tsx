import Strings from '@/i18n';
import { navigateTo, showToast } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { formatLabels, formatSwitches, removeTimer } from '@/utils';
import { DialogInstance, ToastInstance } from '@ray-js/smart-ui';
import { useEleInching } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { electri } from '@ray-js/electrician-timing-sdk';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  relativePath: string;
}

const InchingList: FC<Props> = ({ relativePath }) => {
  const timers = useEleInching();
  const { dpNames } = useCommon();
  const list = useSwitchFilter(timers);
  const handleEdit = useCallback((id: string | number, type: FuncType) => {
    navigateTo({ url: `${relativePath}inching/add/index?id=${id}` });
  }, []);
  const handleStatus = useCallback(
    async (id: string | number, type: FuncType, status: boolean) => {
      try {
        await electri.inching.updateStatus(+id, status, { useDefaultModal: true });
      } catch {
        showToast({
          icon: 'error',
          title: Strings.getLang(status ? 'ret_open_failure' : 'ret_forbbiden_failure'),
        });
      }
    },
    [timers],
  );
  const handleDelete = useCallback(async (id: string | number, type: FuncType) => {
    DialogInstance.confirm({
      title: Strings.getLang('ret_tips'),
      message: Strings.getLang('ret_delete_timer_tips'),
      confirmButtonText: Strings.getLang('confirm'),
      cancelButtonText: Strings.getLang('cancel'),
      beforeClose: async (action) => {
        if (action === 'confirm') {
          try {
            await removeTimer(+id, timers, electri.inching.update, electri.inching.remove);
          } catch {
            showToast({
              icon: 'error',
              title: Strings.getLang('ret_delete_failure'),
            });
          }
        }
        return Promise.resolve(true);
      },
    });
  }, []);
  return (
    <>
      {list.map((item) => {
        const minute = Math.floor(item.time / 60);
        const second = item.time % 60;
        // dp处理
        const switches = formatSwitches(item.actions, dpNames);
        let labels: Array<string | number> = [];
        if (minute > 0 && second > 0) {
          labels = formatLabels(Strings.getLang('ret_inching_label_minute_second'), minute, second);
        } else if (minute > 0) {
          labels = formatLabels(Strings.getLang('ret_inching_label_minute'), minute);
        } else {
          labels = formatLabels(Strings.getLang('ret_inching_label_second'), second);
        }

        return (
          <TimerItem
            key={item.id}
            type={FuncType.normal}
            id={item.id}
            label={labels}
            status={item.status}
            switches={switches.join('、')}
            onClick={handleEdit}
            onStatus={handleStatus}
            onDelete={handleDelete}
          />
        );
      })}
    </>
  );
};

export default InchingList;
