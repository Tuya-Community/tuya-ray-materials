import React, { useEffect, useState } from 'react';
import { View, setNavigationBarTitle, showLoading, hideLoading, router } from '@ray-js/ray';
import { CellGroup, Cell, Empty } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
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
    setNavigationBarTitle({ title: Strings.getLang('infoTitle') });
    getData();
  }, []);

  const getData = () => {
    showLoading({
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

          dispatch(updateCarInfo(transformedData));

          let list = [];
          if (Object.keys(transformedData).length > 0) {
            list = Object.keys(transformedData).map(i => ({
              key: `carInfo_${i}`,
              title: Strings.getLang(`carInfo_${i}` as any),
              onclick: () => {
                router.push(`/infoDetail?key=${i}&devId=${devId}`);
              },
            }));
          }
          setData(list);
        }
        hideLoading();
      })
      .catch(err => {
        hideLoading();
      });
  };

  return (
    <View className={styles.container}>
      {data.length > 0 ? (
        data.map(item => {
          return (
            <View
              className={styles.settingItem}
              key={item.key}
              onClick={() => item.onclick && item.onclick()}
            >
              <CellGroup inset>
                <Cell title={item.title} value="" isLink />
              </CellGroup>
            </View>
          );
        })
      ) : (
        <Empty title={Strings.getLang('noData')} />
      )}
    </View>
  );
}

export default DevInfoPage;
