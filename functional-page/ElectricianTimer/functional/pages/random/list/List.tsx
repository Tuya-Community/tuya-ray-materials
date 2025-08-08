import Strings from '@/i18n';
import { navigateTo, showToast } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import TimerItem from '@/components/timer-item';
import { FuncType } from '@/constant';
import { formatSwitches, formatTime, removeTimer } from '@/utils';
import { DialogInstance } from '@ray-js/smart-ui';
import { useEleRandom } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { electri } from '@ray-js/electrician-timing-sdk';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  relativePath: string;
}

const RandomList: FC<Props> = ({ relativePath }) => {
  const allList = useEleRandom();
  const { dpNames } = useCommon();
  const list = useSwitchFilter(allList);
  const handleEdit = useCallback((id: string | number, type: FuncType) => {
    navigateTo({ url: `${relativePath}random/add/index?id=${id}` });
  }, []);
  const handleStatus = useCallback(async (id: number, type: FuncType, status: boolean) => {
    try {
      await electri.random.updateStatus(id, status, { useDefaultModal: true });
    } catch {
      showToast({
        icon: 'error',
        title: Strings.getLang(status ? 'ret_open_failure' : 'ret_forbbiden_failure'),
      });
    }
  }, []);
  const handleDelete = useCallback(
    async (id: number, type: FuncType) => {
      DialogInstance.confirm({
        title: Strings.getLang('ret_tips'),
        message: Strings.getLang('ret_delete_timer_tips'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        beforeClose: async (action) => {
          if (action === 'confirm') {
            try {
              await removeTimer(+id, allList, electri.random.update, electri.random.remove);
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
    [allList],
  );
  return (
    <>
      {list.map((item) => {
        const startTime = formatTime(item.startTime);
        const endTime = formatTime(item.endTime);
        // dp处理
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
            type={FuncType.random}
            id={item.id}
            label={labels}
            weeks={item.week}
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

export default RandomList;
