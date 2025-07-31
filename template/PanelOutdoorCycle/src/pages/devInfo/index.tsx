import React, { useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { View } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import { useDevice } from '@ray-js/panel-sdk';
import { TopBar } from '@/components';
import { router } from 'ray';
import List from '@ray-js/components-ty-cell';
import Strings from '@/i18n';
import store from '@/redux';
import { getCarInfo } from '@/api/atop';
import { updateCarInfo } from '@/redux/modules/carInfoSlice';
import styles from './index.module.less';

export function DevInfoPage() {
  const { dispatch } = store;
  const devInfo = useDevice(device => device.devInfo);
  const { devId } = devInfo;
  const [data, setData] = useState([]);

  useEffect(() => {
    ty.hideMenuButton();
    getData();
  }, []);

  const getData = () => {
    ty.showLoading({
      title: 'Loading...',
      mask: true,
    });
    getCarInfo(devId)
      .then(res => {
        if (res) {
          const transformedData = res.reduce((acc, item) => {
            const childObj = item.childList.reduce((childAcc, childItem) => {
              childAcc[childItem.key] = {
                ...childItem,
              };
              return childAcc;
            }, {});

            acc[item.key] = childObj;
            return acc;
          }, {});
          setData(transformedData);
          dispatch(updateCarInfo(transformedData));
        }
        ty.hideLoading();
      })
      .catch(err => {
        ty.hideLoading();
      });
  };

  const getList = useCallback(() => {
    let list = [];
    if (Object.keys(data).length > 0) {
      list = Object.keys(data).map(i => ({
        key: `carInfo_${i}`,
        title: Strings.getLang(`carInfo_${i}` as any),
        onclick: () => {
          router.push(`/infoDetail?key=${i}&devId=${devId}`);
        },
      }));
    }
    return list;
  }, [data]);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('infoTitle')} />
      <List
        style={{
          marginTop: '19px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        rowKey={(_, i) => i}
        dataSource={getList()}
        empty={Strings.getLang('noData')}
        renderItem={item => (
          <List.Item
            gap="5px"
            className={styles.listItem}
            title={item.title}
            titleStyle={{ color: 'var(--app-B1-N1)', fontSize: '16px', fontWeight: 500 }}
            onClick={item.onclick}
            content={<Icon type="icon-right" color="var(--app-B1-N4)" size={18} />}
          />
        )}
      />
    </View>
  );
}

export default DevInfoPage;
