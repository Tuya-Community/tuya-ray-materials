import React, { FC, useEffect, useState } from 'react';
import {
  View,
  getStorageSecretByDeviceId,
  getPetBehavior,
  getPetBehaviorStatistics,
  getDevInfo,
} from '@ray-js/ray';
import CryptoJS from 'crypto-js';
import { useBatchLoadImage } from '@ray-js/ray-ipc-decrypt-image';
import styles from './index.module.less';
import RecordItem from './RecordItem';

const GetCameraCloudDemo: FC = () => {
  const { devId } = getDevInfo();
  const [secret, setSecret] = useState(null);
  const [fileList, setFileList] = useState([]);

  const loadInstance = useBatchLoadImage({
    shouldBatch: true, // 开启批量加载，默认为true
    maxConcurrencyLoadImage: 2, // 解密图片时的最大并发任务数，目的减小 App 侧压力
    defaultBatchTime: 300, // 每 300ms 内，解密成功的 url 会统一被更新，目的减少小程序侧 setData 次数
  });

  const formatPetAction = (list, encodeKey: string) => {
    return list.map(item => {
      const { recordTime, actionType, pets, fileType, videoCoverDisplay, fileDisplay } = item;
      const url = fileDisplay;
      const fileName = `${CryptoJS.MD5(url.split('?')[0]).toString()}-base.png`;
      loadInstance.addOriginData({
        fileUrl: url,
        decryptKey: encodeKey,
        deviceId: '6c9cd914edae30de10axek',
        fileName,
      });
      loadInstance.loadAllOriginData();
      return {
        ...item,
        time: recordTime,
      };
    });
  };

  const getSecret = async () => {
    const secretObj = await getStorageSecretByDeviceId({ devId });

    setSecret(secretObj.encryptKey);
    const petBehavior = await getPetBehavior({
      pageNo: 1,
      pageSize: 1,
      devId,
      startTime: 1754755200008,
      endTime: 1755504000000,
    });

    setFileList(formatPetAction(petBehavior.data, secretObj.encryptKey));

    const petBehaviorStatistics = await getPetBehaviorStatistics({
      indicatorCode: 'defecation',
      timeAggrType: 'NUM',
      dateType: 'week',
      beginDate: '2025081000',
      endDate: '2025081800',
      devId,
    });
  };

  useEffect(() => {
    getSecret();
  }, []);

  return (
    <View className={styles.container}>
      {fileList.map((item, index) => {
        return (
          <RecordItem
            key={`${item.type}-${index}`}
            type={item.type}
            data={item}
            encryptionKey={secret}
            onDelete={() => {
              console.log('do some thing');
            }}
            loadInstance={loadInstance}
          />
        );
      })}
    </View>
  );
};

export default GetCameraCloudDemo;
