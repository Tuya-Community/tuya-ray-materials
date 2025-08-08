import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, navigateTo, showToast } from '@ray-js/ray';
import { useCloudTimers } from '@ray-js/electrician-timing-sdk/lib/hooks';
import React, { FC, useCallback, useEffect } from 'react';
import { Dialog, Toast, ToastInstance } from '@ray-js/smart-ui';
import ConflictModal from '@/components/conflict';
import { checkAddEnabled, debounce } from '@/utils';
import { FuncType } from '@/constant';
import { useConfig } from '@/hooks/useConfig';
import { isLANOnline } from '@ray-js/electrician-timing-sdk';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { useDevice } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import List from './List';

const Schedule: FC = () => {
  useConfig();
  const { list, loading } = useCloudTimers();
  const devInfo = useDevice((d) => d.devInfo);

  // 根据dp过滤掉不需要显示的开关
  const data = useSwitchFilter(list);
  const handleAdd = useCallback(
    debounce(async () => {
      if (!devInfo.isOnline) {
        // 设备不在线，不能添加
        showToast({
          icon: 'error',
          title: Strings.getLang('ret_schedule_offline_tip'),
        });
        return;
      }
      // 如果是局域网情况，则提示不支持
      const lanOnline = await isLANOnline();
      if (lanOnline) {
        showToast({
          icon: 'error',
          title: Strings.getLang('ret_schedule_lan_tip'),
        });
        return;
      }
      if (checkAddEnabled(list.length, FuncType.normal)) {
        navigateTo({ url: '../add/index' });
      }
    }),
    [list.length, devInfo.isOnline],
  );

  useEffect(() => {
    if (loading) {
      ToastInstance.loading({
        duration: 0,
        forbidClick: true,
      });
    } else {
      ToastInstance.clear();
    }
  }, [loading]);

  return (
    <Container>
      <TopBar title={Strings.getLang('ret_schedule_title')} />
      {data.length === 0 && (
        <View className={styles.empty}>
          <View className={styles.emptyText}>{Strings.getLang('ret_no_data')}</View>
          <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
            {Strings.getLang('ret_add')}
          </View>
        </View>
      )}
      {/* 列表 */}
      {data.length > 0 && (
        <>
          <View className={styles.timerTips}>{Strings.getLang('ret_timer_tips')}</View>
          <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
            <List relativePath="../../" />
          </ScrollView>
          {/* 添加按钮 */}
          <View className={styles.bottom}>
            <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
              {Strings.getLang('ret_add')}
            </View>
          </View>
        </>
      )}
      <Toast id="smart-toast" />
      <Dialog id="smart-dialog" />
      <ConflictModal />
    </Container>
  );
};

export default Schedule;
