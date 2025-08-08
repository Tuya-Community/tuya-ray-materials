import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, navigateTo } from '@ray-js/ray';
import React, { FC, useCallback, useEffect } from 'react';
import { config } from '@/config';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useProps } from '@ray-js/panel-sdk';
import GlobalActionSheet, { ActionSheetInstance } from '@/components/action-sheet';
import { useConfig } from '@/hooks/useConfig';
import { useCommon } from '@/redux/modules/commonSlice';
import styles from './index.module.less';
import CountdownList from './List';

const ListPage: FC = () => {
  useConfig();
  const { dpNames } = useCommon();
  // @ts-ignore
  const hasCountdown = useProps((dpState) => {
    return config.countdownCodes.some((item) => {
      return Number(dpState[item]) > 0;
    });
  });
  const handleAdd = useCallback(() => {
    if (config.countdownCodes.length > 1) {
      ActionSheetInstance.show({
        title: Strings.getLang('ret_countdown_selection'),
        actions: config.switchCodes.map((item, i) => {
          return {
            name: dpNames[item] || Strings.getDpLang(item),
            value: config.countdownCodes[i],
          };
        }),
        onSelect: ({ detail }) => {
          navigateTo({ url: `../countdown/index?dpCode=${detail.value}` });
        },
      });
      return;
    }
    navigateTo({ url: '../countdown/index' });
  }, [dpNames]);

  useEffect(() => {
    if (config.countdownCodes.length === 0) {
      DialogInstance.alert({
        title: Strings.getLang('ret_not_support_countdown'),
        confirmButtonText: Strings.getLang('confirm'),
      });
    }
  }, []);
  return (
    <Container>
      <TopBar title={Strings.getLang('ret_countdown_title')} />
      {!hasCountdown && (
        <View className={styles.empty}>
          <View className={styles.emptyText}>{Strings.getLang('ret_no_data')}</View>
          <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
            {Strings.getLang('ret_add')}
          </View>
        </View>
      )}
      {/* 列表 */}
      {hasCountdown && (
        <>
          <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
            <CountdownList relativePath="../../" />
          </ScrollView>
          {/* 添加按钮 */}
          <View className={styles.bottom}>
            <View className={styles.addBtn} hoverClassName="hover" onClick={handleAdd}>
              {Strings.getLang('ret_add')}
            </View>
          </View>
        </>
      )}
      <Dialog id="smart-dialog" />
      <GlobalActionSheet />
    </Container>
  );
};

export default ListPage;
