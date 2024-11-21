import React, { useEffect } from 'react';
import { View } from '@ray-js/ray';
import { useActions } from '@ray-js/panel-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux';
import {
  deleteCleanRecord,
  fetchCleanRecords,
  selectCleanRecords,
} from '@/redux/modules/cleanRecordsSlice';
import Strings from '@/i18n';

import styles from './index.module.less';
import Item from './Item';
import Header from './Header';

const CleanRecords = () => {
  const dispatch = useDispatch();
  const records = useSelector(selectCleanRecords);

  const handleDelete = (id: number) => {
    dispatch(deleteCleanRecord(id));
  };

  useEffect(() => {
    (dispatch as AppDispatch)(fetchCleanRecords());
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_clean_records'),
    });
  }, []);

  return (
    <View className={styles.container}>
      <Header />
      {records.map(record => (
        <Item key={record.id} data={record} onDeleted={handleDelete} />
      ))}
    </View>
  );
};

export default CleanRecords;
