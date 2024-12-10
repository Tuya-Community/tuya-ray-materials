import React, { FC, useState } from 'react';
import { router, usePageEvent } from 'ray';
import { ScrollView, showLoading, hideLoading } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';
import { get } from 'lodash';

import Empty from '@/components/Empty';
import Strings from '@/i18n';
import { Api } from '@/api';
import { usePanelStore } from '@/hooks';
import RecordItem from './component/RecordItem';

import styles from './index.module.less';

const Index: FC = () => {
  const [userData, setUserData] = useState([]);

  const { user } = usePanelStore();

  usePageEvent('onShow', () => {
    run();
  });

  const { run } = useRequest(() => Api.apis.fetchUserList(get(user, 'allOpenDps')), {
    onBefore: () => showLoading({ title: '', mask: true }),
    onSuccess(data) {
      setUserData(data);
      hideLoading();
    },
    onError() {
      hideLoading();
    },
    manual: true,
  });

  return (
    <>
      <NavBar
        title={Strings.getLang('title_family')}
        fixed
        placeholder
        leftArrow
        onClickLeft={() => router.back()}
      />
      <ScrollView refresherTriggered scrollY className={styles.container}>
        {userData.length > 0 &&
          userData.map(item => <RecordItem key={item.userId} {...item} currentUserInfo={user} />)}
        {userData.length === 0 && <Empty />}
      </ScrollView>
    </>
  );
};

export default Index;
