/**
 * 循环定时列表
 */
import Strings from '@/i18n';
import { navigateTo, showToast } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { debounce, formatSwitches, formatTime, get24Time, removeTimer } from '@/utils';
import { DialogInstance } from '@ray-js/smart-ui';
import { useEleCycle } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { electri } from '@ray-js/electrician-timing-sdk';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  relativePath: string;
}

const CycleList: FC<Props> = ({ relativePath }) => {
  const timers = useEleCycle();
  const { dpNames } = useCommon();
  const list = useSwitchFilter(timers);

  const handleEdit = useCallback(
    debounce((id: string | number, type: FuncType) => {
      navigateTo({ url: `${relativePath}cycle/add/index?id=${id}` });
    }),
    [],
  );
  const handleStatus = useCallback(
    debounce(async (id: string | number, type: FuncType, status: boolean) => {
      try {
        await electri.cycle.updateStatus(id as number, status, { useDefaultModal: true });
      } catch {
        showToast({
          icon: 'error',
          title: Strings.getLang(status ? 'ret_open_failure' : 'ret_forbbiden_failure'),
        });
      }
    }),
    [],
  );
  const handleDelete = useCallback(
    async (id: string | number, type: FuncType) => {
      DialogInstance.confirm({
        title: Strings.getLang('ret_tips'),
        message: Strings.getLang('ret_delete_timer_tips'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        beforeClose: async (action) => {
          if (action === 'confirm') {
            try {
              await removeTimer(+id, timers, electri.cycle.update, electri.cycle.remove);
            } catch {
              showToast({
                icon: 'error',
                title: Strings.getLang('ret_delete_failure'),
              });
            }
          }
          return Promise.resolve(true);
        },
      }).catch(() => {
        // 不处理
      });
    },
    [timers],
  );
  return (
    <>
      {list.map((item) => {
        const startTime = formatTime(item.startTime);
        const endTime = formatTime(item.endTime);
        // dp处理
        const action = `${Strings.getLang('ret_cycle_holdtime')}：${Strings.formatValue(
          'ret_cycle_onholdtime',
          ...get24Time(item.onHoldTime),
        )}|${Strings.formatValue('ret_cycle_offholdtime', ...get24Time(item.offHoldTime))}`;
        const switches = formatSwitches(item.actions, dpNames);
        const labels: Array<string> = [];
        if (startTime.ampm) {
          // @ts-expect-error
          labels.push(Strings.getLang(`ret_${startTime.ampm}`));
        }
        labels.push(startTime.text);
        labels.push('-');
        if (endTime.ampm) {
          // @ts-expect-error
          labels.push(Strings.getLang(`ret_${endTime.ampm}`));
        }
        labels.push(endTime.text);

        return (
          <TimerItem
            key={item.id}
            type={FuncType.cycle}
            id={item.id}
            label={labels}
            weeks={item.week}
            status={item.status}
            switches={switches.join('、')}
            action={action}
            onClick={handleEdit}
            onStatus={handleStatus}
            onDelete={handleDelete}
          />
        );
      })}
    </>
  );
};

export default CycleList;
