import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { View, Image, location, ScrollView } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { TopBar } from '@/components';
import List from '@ray-js/components-ty-cell';
import Strings from '@/i18n';
import { getCarImgUrl } from '@/api/atop';
import { selectCarInfoByKey } from '@/redux/modules/carInfoSlice';
import styles from './index.module.less';

const InfoDetailPage = React.memo(() => {
  const { key } = location?.query;
  const detail = useSelector(selectCarInfoByKey(key));
  const [imgUrl, setUrl] = useState('');

  useEffect(() => {
    ty.hideMenuButton();
    getImg();
  }, []);
  const getImg = () => {
    const info = detail;
    const filterOj = _.pickBy(info, item => item.isPic === true);
    if (!_.isEmpty(filterOj)) {
      ty.showLoading({
        title: 'Loading...',
        mask: true,
      });
      const { picBizKey } = Object.values(filterOj)[0];
      if (picBizKey) {
        getCarImgUrl(picBizKey)
          .then((res: string) => {
            res !== '' && setUrl(res);
            ty.hideLoading();
          })
          .catch(err => {
            ty.hideLoading();
          });
      }
    }
  };

  const getInfoDetail = () => {
    const transformedVcuInfo = Object.keys(detail).reduce((acc, k) => {
      if (!detail[k].isPic) {
        acc[k] = detail[k].value;
      }
      return acc;
    }, {});
    const listData = Object.keys(transformedVcuInfo).map(i => ({
      key: `${key}_${i}`,
      title: (
        <View>
          <View style={{ color: 'var(--app-B1-N1)', fontSize: '16px', fontWeight: 500 }}>
            {Strings.getLang(`${key}_${i}`)}
          </View>
          <View
            style={{
              color: 'var(--app-B1-N3)',
              fontSize: '14px',
              fontWeight: 400,
              marginTop: '6px',
            }}
          >
            {transformedVcuInfo[i]}
          </View>
        </View>
      ),
    }));
    return listData;
  };

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang(`carInfo_${key}`)} />
      <ScrollView scrollY>
        {imgUrl !== '' && (
          <View className={styles.imageView}>
            <Image src={imgUrl} mode="aspectFit" />
          </View>
        )}
        <List
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          rowKey={(_, i) => i}
          dataSource={getInfoDetail()}
          renderItem={item => (
            <List.Item gap="5px" className={styles.listItem} title={item.title} />
          )}
        />
      </ScrollView>
    </View>
  );
});
export default InfoDetailPage;
