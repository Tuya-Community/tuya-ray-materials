import { FC } from 'react';
import { stringifyJSON } from '@ray-js/panel-sdk/lib/utils';
import { Image, router, View } from '@ray-js/ray';
import { SwipeCell } from '@ray-js/smart-ui';

import DataModule from '@/components/DataModule';
import { deleteRecord } from '@/redux/action';
import Res from '@/res';
import { TouchableOpacity } from '../common';
import styles from './index.module.less';

interface Props {
  item: any;
}
const SingleDataItem: FC<Props> = ({ item }) => {
  return (
    <View className="m-b-24">
      <SwipeCell
        asyncClose
        rightWidth={30}
        slot={{
          right: (
            <TouchableOpacity className={styles.deleteBox} onClick={() => deleteRecord(item.uuid)}>
              <Image src={Res.deletUser} style={{ width: '32rpx', height: '36rpx' }} />
            </TouchableOpacity>
          ),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onClick={() => {
            router.push(`/editData?singleData=${stringifyJSON(item)}`);
          }}
        >
          <DataModule {...item} />
        </TouchableOpacity>
      </SwipeCell>
    </View>
  );
};

export default SingleDataItem;
