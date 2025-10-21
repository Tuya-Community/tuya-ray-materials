import React, { useEffect } from 'react';
import { router, View } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux';
import {
  deleteCleanRecord,
  fetchCleanRecords,
  selectCleanRecords,
} from '@/redux/modules/cleanRecordsSlice';
import Strings from '@/i18n';
import { NavBar } from '@ray-js/smart-ui';

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
  }, []);

  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_clean_records')} leftArrow onClickLeft={router.back} />
      <Header />
      {records.map(record => (
        <Item key={record.id} data={record} onDeleted={handleDelete} />
      ))}
    </View>
  );
};

export default CleanRecords;
