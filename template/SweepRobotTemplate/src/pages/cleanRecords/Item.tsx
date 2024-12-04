import React, { FC } from 'react';
import { View, showLoading, hideLoading, router, deleteCleaningRecord } from '@ray-js/ray';
import moment from 'moment';
import { Cell, SwipeCell } from '@ray-js/smart-ui';
import { parseDataFromString } from '@/utils';
import Strings from '@/i18n';

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
      showLoading({ title: Strings.getLang('dsc_cleaning_record_delete') });
      await deleteCleaningRecord({
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
            {Strings.getLang('dsc_delete')}
          </View>
        ),
      }}
    >
      <Cell
        title={moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')}
        label={`${time} ${Strings.getLang('dsc_minute')} | ${area} ${Strings.getLang(
          'dsc_square_meter'
        )}`}
        border={false}
        isLink
        onClick={handleDetail}
      />
    </SwipeCell>
  );
};

export default Item;
