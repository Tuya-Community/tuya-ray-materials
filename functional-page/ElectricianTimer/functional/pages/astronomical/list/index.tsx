/**
 * 天文定时
 */
import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, navigateTo, showToast, usePageEvent } from '@ray-js/ray';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Dialog, ActionSheet, Toast, ToastInstance } from '@ray-js/smart-ui';
import { useAstronomical, useAstronomicalList } from '@/redux/modules/astronomicalSlice';
import { config } from '@/config';
import { FuncType } from '@/constant';
import TimerTypeItem from '@/components/timer-type-item';
import { useDevice } from '@ray-js/panel-sdk';
import { isLocalOnline } from '@ray-js/electrician-timing-sdk';
import { checkAddEnabled, debounce } from '@/utils';
import { useConfig } from '@/hooks/useConfig';
import styles from './index.module.less';
import AstronomicalList from './List';

const ListPage: FC = () => {
  useConfig();
  const [visible, setVisible] = useState(false);
  const devInfo = useDevice((d) => d.devInfo);
  const astronomical = useAstronomical();
  const options = useMemo(() => {
    return config.functions.filter((item) => {
      if (item.key === FuncType.sunrise) {
        return astronomical.list.every((x) => x.astronomicalType !== 0);
      }
      if (item.key === FuncType.sunset) {
        return astronomical.list.every((x) => x.astronomicalType !== 1);
      }
      return false;
    });
  }, [astronomical.list, visible]);
  const list = useAstronomicalList();
  const handleAdd = useCallback(() => {
    setVisible(true);
  }, []);

  const handleSelection = useCallback(
    debounce(async (item: FunctionData) => {
      setVisible(false);
      if (!devInfo.isOnline) {
        // 设备不在线，不能添加
        showToast({
          icon: 'error',
          title: Strings.getLang('ret_schedule_offline_tip'),
        });
        return;
      }
      // 如果是本地连接情况，则提示不支持
      const localOnline = await isLocalOnline();
      if (localOnline) {
        showToast({
          icon: 'error',
          title: Strings.getLang('ret_schedule_local_tip'),
        });
        return;
      }
      if (checkAddEnabled(astronomical.list.length, item.key === 'sunrise' ? FuncType.sunrise : FuncType.sunset)) {
        navigateTo({ url: `../add/index?type=${item.key}` });
      }
    }),
    [astronomical.list.length, devInfo.isOnline],
  );

  const handleHideSelection = useCallback(() => {
    setVisible(false);
  }, []);

  usePageEvent('onShow', function () {
    if (astronomical.status === 'loading') {
      ToastInstance.loading({
        // 这里的 this 为 当前页面的实例
        context: this,
        duration: 0,
        forbidClick: true,
      });
    }
  });

  useEffect(() => {
    if (astronomical.status !== 'loading') {
      ToastInstance.clear();
    }
  }, [astronomical.status]);
  return (
    <Container>
      <TopBar title={Strings.getLang('ret_astronomical_title')} />
      {list.length === 0 && (
        <View className={styles.empty}>
          <View className={styles.emptyText}>{Strings.getLang('ret_no_data')}</View>
          <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
            {Strings.getLang('ret_add')}
          </View>
        </View>
      )}
      {/* 列表 */}
      {list.length > 0 && (
        <>
          <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
            <AstronomicalList relativePath="../../" />
          </ScrollView>
          {/* 添加按钮 */}
          {options.length > 0 && (
            <View className={styles.bottom}>
              <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
                {Strings.getLang('ret_add')}
              </View>
            </View>
          )}
        </>
      )}
      <ActionSheet
        show={visible}
        title={Strings.getLang('ret_select_timer')}
        cancelText={Strings.getLang('cancel')}
        onClose={handleHideSelection}
        onCancel={handleHideSelection}
      >
        <>
          {options.map((item) => {
            return <TimerTypeItem key={item.key} item={item} onSelect={handleSelection} />;
          })}
        </>
      </ActionSheet>
      <Dialog id="smart-dialog" />
      <Toast id="smart-toast" />
    </Container>
  );
};

export default ListPage;
