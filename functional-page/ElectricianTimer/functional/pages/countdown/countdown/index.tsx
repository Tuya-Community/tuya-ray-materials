/**
 * 单 dp 倒计时
 */

import { config } from '@/config';
import { useDevice } from '@ray-js/panel-sdk';
import { View, exitMiniProgram, router, showToast, usePageEvent, useQuery } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Strings from '@/i18n';
import TopBar from '@/components/topBar';
import CountdownPicker from '@/components/countdown-picker';
import Clock from '@/components/clock';
import { Button, Dialog, DialogInstance, Loading } from '@ray-js/smart-ui';
import ConflictModal from '@/components/conflict';
import { useConfig } from '@/hooks/useConfig';
import { debounce } from '@/utils';
import { useCountdown } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { cancelCountdown, createCountdown } from '@ray-js/electrician-timing-sdk';
import styles from './index.module.less';

const Countdown: FC = () => {
  useConfig();
  let { dpCode } = useQuery();
  // 未指定dp，则默认取配置中的第一个倒计时
  dpCode = dpCode || config.countdownCodes[0];
  //   倒计时状态，0 为加载中，1为未设置， 2为设置中，3为执行中
  const [status, setStatus] = useState(0);

  // 当前倒计时的信息，开启前端自动倒计时
  const { countdown: countdownData, cancelAutoCountdown } = useCountdown(dpCode, true);

  const [time, setTime] = useState(60);

  const countdownSchema = useDevice((d) => d.dpSchema[dpCode]);

  const handleReset = useCallback(() => {
    setStatus(2);
    setTime(countdownData.leftTime < 60 ? 60 : Math.floor(countdownData.leftTime / 60) * 60);
  }, [countdownData.leftTime]);

  const handleOK = useCallback(
    debounce(async () => {
      if (status === 3) {
        DialogInstance.confirm({
          title: Strings.getLang('ret_tips'),
          message: Strings.getLang('ret_countdown_close_tips'),
          confirmButtonText: Strings.getLang('confirm'),
          cancelButtonText: Strings.getLang('cancel'),
          beforeClose: async (action) => {
            if (action === 'confirm') {
              try {
                await cancelCountdown(dpCode);
                setTime(60);
                setStatus(1);
              } catch {
                showToast({ icon: 'error', title: Strings.getLang('ret_countdown_close_error') });
              }
            }
            return Promise.resolve(true);
          },
        }).catch(() => {
          // 不处理
        });
      } else {
        // 倒计时对应的开关
        const res = await createCountdown(dpCode, time, { useDefaultModal: true });
        if (res === 'success') {
          if (config.countdownSuccessAction === 'hold') {
            setStatus(3);
          } else {
            // 回退上一页，如无上一页，则退出功能页
            const pages = getCurrentPages();
            if (pages.length === 1) {
              exitMiniProgram();
            } else {
              router.back();
            }
          }
        }
      }
    }),
    [time, status],
  );

  const handleChangeTime = useCallback((v) => {
    setTime(v);
  }, []);

  useEffect(() => {
    if (status === 1 || status === 0) {
      // 当前是否有倒计时
      setStatus(countdownData.leftTime ? 3 : 1);
    } else if (status === 3 && countdownData.leftTime <= 0) {
      setStatus(1);
    }
  }, [status, countdownData.leftTime]);

  useEffect(() => {
    if (!countdownSchema) {
      DialogInstance.alert({
        title: Strings.getLang('ret_countdown_not_support'),
        confirmButtonText: Strings.getLang('confirm'),
        beforeClose: () => {
          router.back();
          return true;
        },
      });
    }
  }, []);

  usePageEvent('onUnload', () => {
    console.log('cancel auto countdown');
    cancelAutoCountdown();
  });
  return (
    <View className={styles.page}>
      <TopBar title={Strings.getLang('ret_countdown_title')} />
      <View className={styles.tips}>{Strings.getLang('ret_countdown_tips')}</View>
      {status === 0 ? (
        <View className={styles.main}>
          <Loading />
        </View>
      ) : (
        <>
          <View className={styles.main}>
            {status === 3 && <Clock total={countdownData.total} value={countdownData.leftTime} onReset={handleReset} />}
            {(status === 1 || status === 2) && (
              <View className={styles.picker}>
                <CountdownPicker
                  value={time}
                  // 最小要设置 1 分钟
                  min={60}
                  max={countdownSchema?.property?.max}
                  step={1}
                  itemHeight={64}
                  onChange={handleChangeTime}
                />
              </View>
            )}
          </View>
          <View className={styles.footer}>
            <Button round customClass={styles.btn} onClick={handleOK}>
              {Strings.getLang(status === 1 || status === 2 ? 'confirm' : 'ret_countdown_close')}
            </Button>
          </View>
        </>
      )}

      <Dialog id="smart-dialog" />
      <ConflictModal />
    </View>
  );
};

export default Countdown;
