import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { router, ScrollView, Text, View, Image } from '@ray-js/ray';
import {
  Button,
  Dialog,
  DialogInstance,
  Icon,
  NavBar,
  Toast,
  ToastInstance,
} from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { deleteCleanRecordsApi, fetchCleanRecordsApi } from '@/api/request';
import moment from 'moment';
import { scaleNumber } from '@/utils';
import { devices } from '@/devices';
import clsx from 'clsx';
import { CLEAN_RECORDS_PAGE_SIZE, THEME_COLOR } from '@/constant';
import { imgNoData } from '@/res';
import { iconChecked, iconUnchecked } from '@/res/iconsvg';
import styles from './index.module.less';
import Item from './Item';

function Record() {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [records, setRecords] = useState<CleanRecord[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true); // 添加初始加载状态

  const isSelectAll = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length === records.length;
  }, [selectedIds, records]);

  const { scale: areaScale } = useMemo(() => {
    return devices.common.getDpSchema().clean_area?.property ?? { scale: 1 };
  }, []);

  const { scale: timeScale } = useMemo(() => {
    return devices.common.getDpSchema().clean_time?.property ?? { scale: 1 };
  }, []);

  // 使用 useEffect 自动计算 hasMore
  useEffect(() => {
    setHasMore(records.length < total);
  }, [records, total]);

  const parseCleanLogData = (logData: CleanRecordResponse): ParsedCleanRecordData => {
    const { value, gmtCreate, versionV3 } = logData;

    // 默认使用创建时间作为日期
    const momentDate = moment(gmtCreate);
    let dayDate = momentDate.format('YYYY-MM-DD');
    let timeDate = momentDate.format('HH:mm');
    let timestamp = gmtCreate; // 默认使用gmtCreate作为时间戳

    let time: number;
    let area: number;
    let subRecordId = '';

    // 解析不同格式的value
    if (!versionV3) {
      if (value.length > 11) {
        // 新格式: YYYYMMDDHHmmTTTAAASSSS...
        // 其中 TTT 是时间，AAA 是面积，SSSS 是子记录ID
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        const hour = value.slice(8, 10);
        const minute = value.slice(10, 12);

        dayDate = `${year}-${month}-${day}`;
        timeDate = `${hour}:${minute}`;

        // 从value中解析出来的日期时间生成时间戳
        const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:00`;
        timestamp = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();

        time = scaleNumber(timeScale, parseInt(value.slice(12, 15), 10));
        area = scaleNumber(areaScale, parseInt(value.slice(15, 18), 10));
        subRecordId = value.slice(18, 23);
      } else {
        // 旧格式: TTTAAASSSS...
        // 其中 TTT 是时间，AAA 是面积，SSSS 是子记录ID
        time = parseInt(value.slice(0, 3), 10);
        area = parseInt(value.slice(3, 6), 10);
        subRecordId = value.length > 6 ? value.slice(6, 11) : '';
        // 旧格式使用gmtCreate作为时间戳，已在默认值设置
      }
    } else {
      // 新格式: YYYYMMDDHHmmTTTAAASSSS...
      // 其中 TTT 是时间，AAA 是面积，SSSS 是子记录ID
      const year = value.slice(0, 4);
      const month = value.slice(4, 6);
      const day = value.slice(6, 8);
      const hour = value.slice(8, 10);
      const minute = value.slice(10, 12);

      dayDate = `${year}-${month}-${day}`;
      timeDate = `${hour}:${minute}`;

      // 从value中解析出来的日期时间生成时间戳
      const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:00`;
      timestamp = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();

      time = scaleNumber(timeScale, parseInt(value.slice(12, 15), 10));
      area = scaleNumber(areaScale, parseInt(value.slice(15, 18), 10));
      subRecordId = value.slice(18, 33);
    }

    // 格式化简短日期（如 "5-28 17:00"）
    const shortDate = `${moment(dayDate, 'YYYY-MM-DD').format('M-D')}`;

    return {
      date: shortDate,
      dayDate,
      timeDate,
      time,
      area,
      subRecordId,
      timestamp, // 正确的时间戳
    };
  };

  const fetchCleanRecords = async (currentOffset: number) => {
    try {
      setLoading(true);
      const { datas, totalCount } = await fetchCleanRecordsApi(currentOffset);

      setTotal(totalCount);

      const newRecords = [
        ...records,
        ...datas.map(item => {
          return {
            ...item,
            parsedData: parseCleanLogData(item),
          };
        }),
      ];

      setRecords(newRecords);
      setOffset(currentOffset + CLEAN_RECORDS_PAGE_SIZE); // 更新offset为下一页
      // 不需要在这里设置hasMore，由useEffect自动处理
    } catch (err) {
      console.error('Error fetching clean records:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false); // 设置初始加载完成
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCleanRecords(0);
    }, 200);
  }, []);

  const handleReachBottom = () => {
    if (!loading && hasMore) {
      fetchCleanRecords(offset);
    }
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      // 如果已全选，则取消全选
      setSelectedIds([]);
    } else {
      // 如果未全选，则选择所有记录
      setSelectedIds(records.map(record => record.recordId));
    }
  };

  const handleSelect = useCallback((recordId: string) => {
    setSelectedIds(prevSelected => {
      if (prevSelected.includes(recordId)) {
        // 如果已选中，则取消选中
        return prevSelected.filter(id => id !== recordId);
      }
      // 如果未选中，则添加到选中列表
      return [...prevSelected, recordId];
    });
  }, []);

  const handleToggleDeleteMode = () => {
    setIsDeleteMode(prev => !prev);
    if (isDeleteMode) {
      // 退出删除模式时清空选中状态
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    try {
      await DialogInstance.confirm({
        message: Strings.getLang('deleteTip'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        confirmButtonColor: THEME_COLOR,
      });

      await deleteCleanRecordsApi(selectedIds);

      ToastInstance.success(Strings.getLang('deleteSuccessTip'));

      setRecords(prevRecords =>
        prevRecords.filter(record => !selectedIds.includes(record.recordId))
      );
      setTotal(prev => prev - selectedIds.length);
      // hasMore 将由 useEffect 自动更新

      setSelectedIds([]);
      setIsDeleteMode(false);
    } catch (err) {
      console.error('Error deleting selected records:', err);
    }
  };

  const handleDelete = useCallback(async (recordId: string) => {
    try {
      await DialogInstance.confirm({
        message: Strings.getLang('deleteTip'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
        confirmButtonColor: THEME_COLOR,
      });

      await deleteCleanRecordsApi([recordId]);

      ToastInstance.success(Strings.getLang('deleteSuccessTip'));

      setRecords(prevRecords => prevRecords.filter(record => record.recordId !== recordId));
      setTotal(prev => prev - 1);
      // hasMore 将由 useEffect 自动更新
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }, []);

  return (
    <View className={styles.container}>
      <NavBar
        leftArrow
        title={Strings.getLang('records')}
        onClickLeft={router.back}
        rightText={
          records.length > 0
            ? isDeleteMode
              ? Strings.getLang('exitManage')
              : Strings.getLang('manage')
            : undefined
        }
        rightTextClass={styles.rightText}
        onClickRight={handleToggleDeleteMode}
      />

      {!initialLoading && records.length === 0 ? (
        <View className={styles.noDataContainer}>
          <Image src={imgNoData} className={styles.noDataImage} />
          <Text className={styles.noDataText}>{Strings.getLang('emptyRecords')}</Text>
        </View>
      ) : (
        <ScrollView className={styles.content} scrollY onScrollToLower={handleReachBottom}>
          {records.map(record => {
            return (
              <Item
                key={record.recordId}
                data={record}
                selected={selectedIds.includes(record.recordId)}
                onDelete={handleDelete}
                onSelect={handleSelect}
                isDeleteMode={isDeleteMode}
              />
            );
          })}

          <View className={styles.loadingContainer}>
            {loading && (
              <Text className={styles.loadingText}>{Strings.getLang('dataLoading')}</Text>
            )}
            {!hasMore && records.length > 0 && (
              <Text className={styles.noMoreText}>{Strings.getLang('noMoreData')}</Text>
            )}
          </View>

          <View style={{ height: '256rpx' }} />
        </ScrollView>
      )}

      <View className={clsx(styles.footer, isDeleteMode && styles.show)}>
        <View className={styles.left} onClick={handleSelectAll}>
          <Icon
            name={isSelectAll ? iconChecked : iconUnchecked}
            color={isSelectAll ? THEME_COLOR : 'rgba(0, 0, 0, 0.2)'}
            size="72rpx"
          />
          <Text className={styles.footerLabel}>{Strings.getLang('allSelect')}</Text>
        </View>

        <Button
          disabled={selectedIds.length === 0}
          customClass={styles.button}
          onClick={handleDeleteSelected}
        >
          {Strings.formatValue('deleteNum', selectedIds.length)}
        </Button>
      </View>

      <Toast id="smart-toast" />
      <Dialog id="smart-dialog" />
    </View>
  );
}

export default Record;
