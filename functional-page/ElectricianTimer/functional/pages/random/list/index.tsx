import Container from '@/components/container';
import TopBar from '@/components/topBar';
import Strings from '@/i18n';
import { ScrollView, View, navigateTo } from '@ray-js/ray';
import React, { FC, useCallback } from 'react';
import ConflictModal from '@/components/conflict';
import { Dialog, Toast } from '@ray-js/smart-ui';
import { checkAddEnabled, debounce } from '@/utils';
import { useConfig } from '@/hooks/useConfig';
import { useEleRandom } from '@ray-js/electrician-timing-sdk/lib/hooks';
import { useSwitchFilter } from '@/hooks/useSwitchFilter';
import { FuncType } from '@/constant';
import styles from './index.module.less';
import RandomList from './List';

const ListPage: FC = () => {
  useConfig();
  const allList = useEleRandom();
  const list = useSwitchFilter(allList);

  const handleAdd = useCallback(
    debounce(() => {
      if (checkAddEnabled(allList.length, FuncType.random)) {
        navigateTo({ url: '../add/index' });
      }
    }),
    [allList.length],
  );
  return (
    <Container>
      <TopBar title={Strings.getLang('ret_random_title')} />
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
          <View className={styles.timerTips}>{Strings.getLang('ret_timer_tips')}</View>
          <ScrollView scrollY className={styles.scroll} refresherTriggered={false}>
            <RandomList relativePath="../../" />
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
