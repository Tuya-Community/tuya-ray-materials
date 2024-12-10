import { FC, useState } from 'react';
import { ScrollView, useQuery, showLoading, hideLoading, router } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';
import { get } from 'lodash';
import { usePageEvent } from 'ray';

import Strings from '@/i18n';
import { Api } from '@/api';
import { usePanelStore } from '@/hooks';

import Header from './component/Header';
import RecordItem from './component/RecordItem';
import styles from './index.module.less';

const Index: FC = () => {
  const [userInfo, setUserInfo] = useState({});
  const query = useQuery();
  const { user } = usePanelStore();

  usePageEvent('onShow', () => {
    run();
  });

  const { run } = useRequest(() => Api.apis.fetchUserList(get(user, 'allOpenDps')), {
    onBefore: () => showLoading({ title: '', mask: true }),
    onSuccess(data) {
      if (query && query.userId) {
        const detailData = data.find((item: Record<string, any>) => item.userId === query.userId);
        setUserInfo(detailData);
      }
      hideLoading();
    },
    onError() {
      hideLoading();
    },
    manual: true,
  });

  if (Object.keys(userInfo).length === 0) {
    return null;
  }

  return (
    <>
      <NavBar
        title={Strings.getLang('title_user_detail')}
        leftArrow
        fixed
        placeholder
        onClickLeft={() => router.back()}
      />
      <ScrollView refresherTriggered scrollY className={styles.container}>
        <Header {...userInfo} currentUserInfo={user} />
        <RecordItem {...userInfo} currentUserInfo={user} />
      </ScrollView>
    </>
  );
};

export default Index;
