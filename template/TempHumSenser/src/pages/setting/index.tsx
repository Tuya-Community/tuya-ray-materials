import React, { Fragment } from 'react';
import { View } from '@ray-js/ray';
import { Card } from '@/components/card';
import Strings from '@/i18n';
import { Empty } from '@ray-js/smart-ui';
import { Layout } from '@/components/layout';
import { PopupView } from '@/components/popup';
import { useConfig } from './useConfig';
import { Title } from './components/title';
import Styles from './index.module.less';

export function Setting() {
  const config = useConfig();

  return (
    <Layout title={Strings.getLang('setting')} showBack>
      <View className={Styles.wrapper}>
        {!config || (!config.length && <Empty description={Strings.getLang('noData')} />)}
        {config &&
          config.map((item, index) => (
            <Fragment key={index}>
              <Title title={item.title} style={{ marginTop: index > 0 ? '24rpx' : '' }} />
              {item.content.map((content, index) => {
                return (
                  <Card style={{ marginTop: index > 0 ? '24rpx' : '' }} key={index}>
                    {content.map(({ component, ...props }, index) => {
                      return (
                        <Fragment key={props.dpCode}>
                          {React.createElement(component, { ...props })}
                          {index !== content.length - 1 && (
                            <View className="h-[1px] bg-black opacity-[0.05]" />
                          )}
                        </Fragment>
                      );
                    })}
                  </Card>
                );
              })}
            </Fragment>
          ))}
      </View>
      <PopupView />
    </Layout>
  );
}

export default Setting;
