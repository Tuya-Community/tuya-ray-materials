import React, { useEffect, useState } from 'react';
import { pickBy, isEmpty } from 'lodash';
import { View, Image, location, setNavigationBarTitle } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { CellGroup, Cell } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { getCarImgUrl } from '@/api/atop';
import { selectCarInfoByKey } from '@/redux/modules/carInfoSlice';
import styles from './index.module.less';

const InfoDetailPage = React.memo(() => {
  const { key } = location?.query;
  const detail = useSelector(selectCarInfoByKey(key));
  const [imgUrl, setUrl] = useState('');

  useEffect(() => {
    getImg();
    setNavigationBarTitle({ title: Strings.getLang(`carInfo_${key}`) });
  }, []);

  const getImg = () => {
    const info = detail;
    const filterOj = pickBy(info, item => item.isPic === true);
    if (!isEmpty(filterOj)) {
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
      title: Strings.getLang(`${key}_${i}`),
      label: transformedVcuInfo[i],
    }));
    return listData;
  };

  return (
    <View className={styles.container}>
      {imgUrl !== '' && (
        <View className={styles.imageView}>
          <Image src={imgUrl} mode="aspectFit" />
        </View>
      )}
      {getInfoDetail().map(item => {
        return (
          <View className={styles.settingItem} key={item.key}>
            <CellGroup inset>
              <Cell title={item.title} label={item.label} />
            </CellGroup>
          </View>
        );
      })}
    </View>
  );
});
export default InfoDetailPage;
