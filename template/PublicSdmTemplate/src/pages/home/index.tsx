import React from 'react';
import { Text, View } from '@ray-js/ray';
import { NavBar, Button, Icon } from '@ray-js/smart-ui';
// import { useActions } from '@ray-js/panel-sdk';
import sunIcon from '@tuya-miniapp/icons/dist/svg/Sun';
import styles from './index.module.less';

export function Home() {
  // const actions = useActions();

  return (
    <>
      <NavBar leftText="Home" leftTextType="home" />
      <View className={styles.view}>
        <View
          className={styles.content}
          onClick={() => {
            // actions.switch_1.toggle();
          }}
        >
          <View className={styles['space-around']} style={{ marginTop: '50rpx' }}>
            <Text>Public SDM Template</Text>
            <Button type="primary">Smart UI Primary Button</Button>
            <Icon name={sunIcon} size={24} />
          </View>
        </View>
      </View>
    </>
  );
}

export default Home;
