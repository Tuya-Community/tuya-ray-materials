import React from 'react';
import { router, Text } from '@ray-js/ray';
import { Card } from '@/components/card';
import { IconFont } from '@/components';
import Strings from '@/i18n';
import { useDevice } from '@ray-js/panel-sdk';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Layout } from '@/components/layout';
import { RootDevice } from './components/rootDevice';
import Styles from './index.module.less';

export function Home() {
  const devName = useDevice(d => d.devInfo.name);
  const { primaryColor } = useAppConfig();
  return (
    <Layout title={devName}>
      <RootDevice />
      <Card
        className={Styles.card}
        style={{ marginTop: '236rpx', padding: '48rpx 32rpx' }}
        hoverClassName={Styles.hover}
        onClick={() => router.push('/curve')}
      >
        <IconFont className={Styles.icon} style={{ background: primaryColor }} icon="curve" />
        <Text className={Styles.text}>{Strings.getLang('curve')}</Text>
      </Card>
      <Card
        className={Styles.card}
        hoverClassName={Styles.hover}
        style={{ padding: '48rpx 32rpx', marginTop: '48rpx' }}
        onClick={() => router.push('/setting')}
      >
        <IconFont className={Styles.icon} style={{ background: primaryColor }} icon="setting" />
        <Text className={Styles.text}>{Strings.getLang('setting')}</Text>
      </Card>
    </Layout>
  );
}

export default Home;
