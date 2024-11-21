import { useCallback, useEffect, useRef, useState } from 'react';
import { utils } from '@ray-js/panel-sdk';
import { ScrollView, showModal, showToast, Text, View } from '@ray-js/ray';
import { Checkbox, Popup } from '@ray-js/smart-ui';
import moment from 'moment';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { deleteUnallocatedData, getUnallocatedData, reportUnallocatedData } from '@/redux/action';
import { Notification, TouchableOpacity } from '../common';
import styles from './index.module.less';

const { hex2rgbString } = utils;

const OfflineDataSelector = () => {
  const [visibleSelectData, setVisibleSelectData] = useState(false);
  const [notificationShow, setNotificationShow] = useState(false);
  const { datas: allUnallocatedData } = useSelector(({ uiState }) => uiState.allUnallocatedData); // 获取未分配数据
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const themeColor2 = hex2rgbString(themeColor, 0.4);
  const [selectedList, setSelectedList] = useState([]);
  const { datas, hasNext } = useSelector(({ uiState }) => uiState.allUnallocatedData);

  const pageNo = useRef(0);

  useEffect(() => {
    const isClose = allUnallocatedData.length > 0;

    setNotificationShow(isClose);
  }, [allUnallocatedData]);

  const getUnallocatedDataList = async (pageNum: number, isFirstLoad: boolean) => {
    await getUnallocatedData(pageNum, isFirstLoad);
  };

  const getMoreData = () => {
    if (!hasNext) return;

    pageNo.current++;
    getUnallocatedDataList(pageNo.current, false);
  };

  const handleData = async (handleType: string) => {
    const selectedData = datas.filter((item: any) => selectedList.indexOf(item.uuid) !== -1);
    console.log('selectedData ==>', handleType, selectedList, selectedData);
    if (selectedData.length === 0) {
      showToast({ title: Strings.getLang('dsc_please_chose_data') });
    } else if (handleType === 'report') {
      await reportUnallocatedData(selectedData);
      handlePressCancel();
    } else {
      await deleteUnallocatedData(selectedData);
      handlePressCancel();
    }
  };

  const handleNotificationClose = useCallback(() => {
    showModal({
      title: '',
      content: Strings.getLang('dsc_deleteOfflineDtaTips'),
      cancelText: Strings.getLang('dsc_cancel'),
      confirmText: Strings.getLang('dsc_confirm'),
      confirmColor: themeColor,
      success: ({ confirm, cancel }) => {
        if (confirm) {
          deleteUnallocatedData(allUnallocatedData);
          setNotificationShow(false);
        }

        if (cancel) {
          setNotificationShow(false);
        }
      },
    });
  }, [allUnallocatedData]);

  const handleNotificationClick = useCallback(() => {
    setVisibleSelectData(true);
  }, []);

  const handlePressCancel = () => {
    setVisibleSelectData(false);
  };

  const renderItem = ({ item }) => {
    const handleCheckedChange = (keyCode: string) => {
      const res = selectedList;
      if (res.indexOf(keyCode) === -1) {
        res.push(keyCode);

        setSelectedList([...res]);
      } else {
        const idx = res.indexOf(keyCode);
        res.splice(idx, 1);
        setSelectedList([...res]);
      }
    };

    return (
      <TouchableOpacity className={styles.renderContainer} key={item.id}>
        <View>
          <View className={styles.threeValueBox}>
            <View className={styles.dataBox}>
              <Text className={styles.dataType}>{Strings.getDpLang('systolic_bp')}</Text>
              <Text className={styles.dataNumber}>{item.sys}</Text>
            </View>
            <View className={styles.dataBox}>
              <Text className={styles.dataType}>{Strings.getDpLang('diastolic_bp')}</Text>
              <Text className={styles.dataNumber}>{item.dia}</Text>
            </View>
            <View className={styles.dataBox}>
              <Text className={styles.dataType}>{Strings.getDpLang('pulse')}</Text>
              <Text className={styles.dataNumber}>{item.pulse}</Text>
            </View>
          </View>
          <View className={styles.timerAndArr}>
            <Text className={styles.measureDate}>{moment(item.time).format('YYYY-M-D  H:ma')}</Text>
            {item.arr && <Text className={styles.arr}>{Strings.getLang('dsc_arr')}</Text>}
          </View>
        </View>
        <View className={styles.checkBox}>
          <Checkbox
            checkedColor={themeColor}
            iconSize="36rpx"
            value={selectedList.indexOf(item.uuid) !== -1}
            onChange={() => handleCheckedChange(item.uuid)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Notification
        message={Strings.getLang('dsc_offlineDataTips')}
        show={notificationShow}
        type="warning"
        onClose={handleNotificationClose}
        onHandle={handleNotificationClick}
      />
      <Popup position="bottom" show={visibleSelectData} onClose={handlePressCancel}>
        <View className={styles.container}>
          <View className={styles.headBox}>
            <View className={styles.emptyBox} />
            <Text className={styles.headTitle}>{Strings.getLang('dsc_selectData')}</Text>
            <View onClick={handlePressCancel}>
              <Text className={styles.cancel}>{Strings.getLang('dsc_cancel')}</Text>
            </View>
          </View>
          <View className={styles.flatListBox}>
            <ScrollView scrollY style={{ height: '700rpx' }} onScrollToLower={getMoreData}>
              {datas.map(item => renderItem({ item }))}
              <View className={styles.flatListFooter}>
                <Text className={styles.noData}>
                  {hasNext
                    ? Strings.getLang('dsc_getMoreDta')
                    : Strings.getLang('dsc_showAllOffline')}
                </Text>
              </View>
            </ScrollView>
          </View>
          <View className={styles.footerBox}>
            <View onClick={() => handleData('delete')}>
              <View className={styles.textbox}>
                <Text className={styles.footText} style={{ color: 'rgba(0,0,0,0.8)' }}>
                  {Strings.getLang('dsc_delete')}
                </Text>
              </View>
            </View>
            <View className={styles.columnLine} />
            <View onClick={() => handleData('report')}>
              <View className={styles.textbox}>
                <Text
                  className={styles.footText}
                  style={{ color: selectedList.length === 0 ? themeColor2 : themeColor }}
                >
                  {Strings.getLang('dsc_assign')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Popup>
    </>
  );
};

export default OfflineDataSelector;
