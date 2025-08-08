import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, navigateTo, router } from '@ray-js/ray';
import React, { FC, useCallback, useEffect } from 'react';
import { config } from '@/config';
import { Dialog, DialogInstance, Toast } from '@ray-js/smart-ui';
import { useConfig } from '@/hooks/useConfig';
import ConflictModal from '@/components/conflict';
import { useEleInching } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { checkAddEnabled } from '@/utils';
import { FuncType } from '@/constant';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import styles from './index.module.less';
import InchingList from './List';

const ListPage: FC = () => {
  useConfig();
  const timers = useEleInching();
  const list = useSwitchFilter(timers);

  const handleAdd = useCallback(() => {
    if (checkAddEnabled(timers.length, FuncType.inching)) {
      navigateTo({ url: '../add/index' });
    }
  }, [timers.length]);

  useEffect(() => {
    if (!config.inchingCode) {
      DialogInstance.alert({
        title: Strings.getLang('ret_not_support_inching'),
        confirmButtonText: Strings.getLang('confirm'),
        beforeClose: () => {
          router.back();
          return Promise.resolve(true);
        },
      });
    }
  }, []);
  return (
    <Container>
      <TopBar title={Strings.getLang('ret_inching_title')} />
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
            <InchingList relativePath="../../" />
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
      <Toast id="smart-toast" />
      <ConflictModal />
    </Container>
  );
};

export default ListPage;
