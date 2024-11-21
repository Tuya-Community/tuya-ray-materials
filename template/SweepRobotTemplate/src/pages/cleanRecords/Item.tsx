import React, { FC, useEffect } from 'react';
import { View, Text, getDevInfo, showLoading, hideLoading, router } from '@ray-js/ray';
import { useActions } from '@ray-js/panel-sdk';
import moment from 'moment';
import { Cell, SwipeCell } from '@ray-js/smart-ui';
import { parseDataFromString } from '@/utils';

import styles from './index.module.less';

type Props = {
  data: CleanRecord;
  onDeleted: (id: number) => void;
};

const Item: FC<Props> = ({ data, onDeleted }) => {
  const { id, devId, extend } = data;
  const { timeStamp, time, area } = parseDataFromString(extend);

  const handleDetail = () => {
    router.push(`/cleanRecordDetail?id=${id}`);
  };

  const handleDelete = async () => {
    try {
      showLoading({ title: '删除中...' });
      await ty.deleteCleaningRecord({
        devId,
        fileIds: [id],
      });

      onDeleted?.(id);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <SwipeCell
      rightWidth={65}
      slot={{
        right: (
          <View
            style={{
              display: 'flex',
              width: '65px',
              height: '100%',
              fontSize: '15px',
              color: '#fff',
              backgroundColor: '#ee0a24',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={handleDelete}
          >
            删除
          </View>
        ),
      }}
    >
      <Cell
        title={moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')}
        label={`${time} 分钟 | ${area} 平方米`}
        border={false}
        isLink
        onClick={handleDetail}
      />
    </SwipeCell>
  );
};

export default Item;
