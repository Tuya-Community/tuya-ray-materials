import { useCallback, useEffect, useRef, useState } from 'react';
import { useDevice } from '@ray-js/panel-sdk';
import { Image, router, ScrollView, showModal, showToast, usePageEvent, View } from '@ray-js/ray';
import { Loading } from '@ray-js/smart-ui';
import moment from 'moment';

import {
  AddManually,
  Battery,
  BleIcon,
  OfflineDataSelector,
  PageWrapper,
  SwitchUser,
  Text,
  TouchableOpacity,
  TrendLineChart,
  User,
} from '@/components';
import SingleDataItem from '@/components/SingleDataItem';
import TopBar from '@/components/TopBar';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { getLatestData, getLatestDetailedData, updateUI } from '@/redux/action';
import Res from '@/res';
import { checkDpExist } from '@/utils';
import styles from './index.module.less';

const { batteryLowCode, userMarkCode } = dpCodes;

const MainView = () => {
  const [loading, setLoading] = useState(true);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const userInfo = useSelector(({ uiState }) => uiState.userInfo);
  const currentUserType = useSelector(({ uiState }) => uiState.currentUserType);
  const isFirstLoading = useSelector(({ uiState }) => uiState.isFirstLoading);
  const userList = useSelector(({ uiState }) => uiState.userList);
  const addSuccess = useSelector(({ uiState }) => uiState.addSuccess);
  const { avgData, list } = useSelector(({ uiState }) => uiState.latestData);
  const saveUserSuccess = useSelector(({ uiState }) => uiState.saveUserSuccess);
  const isShowSwitchUser = useSelector(({ uiState }) => uiState.isShowSwitchUser);
  // 最近一天的数据
  const { datas: latestDatas = [], hasNext } = useSelector(
    ({ uiState }) => uiState.latestDetailedData
  );
  const devInfo = useDevice(device => device.devInfo);

  const pageNo = useRef(0);

  const latestDataDay = list?.length ? moment(list[0]?.time).format('YYYY-MM-DD') : '';
  const hasUserMark = checkDpExist(userMarkCode);
  const hasBatteryLow = checkDpExist(batteryLowCode);

  useEffect(() => {
    getTrendLineData();
  }, [userInfo]);

  useEffect(() => {
    if (!list?.length) {
      setLoading(false);
      return;
    }

    getFiltedData(0, true, latestDataDay)
      .then(() => {
        pageNo.current = 0;
        setLoading(false);
      })
      .catch(err => console.warn(err));
  }, [list]);

  useEffect(() => {
    if (
      hasUserMark &&
      userInfo?.userType !== currentUserType &&
      userInfo?.userType !== undefined &&
      !isFirstLoading
    ) {
      showModal({
        title: '',
        content: Strings.getLang('dsc_userDifferentTips'),
        cancelText: Strings.getLang('dsc_no'),
        confirmText: Strings.getLang('dsc_yes'),
        confirmColor: themeColor,
        success: ({ confirm, cancel }) => {
          if (confirm) {
            const index = userList.findIndex(item => item?.userType === currentUserType);

            updateUI({ userInfo: userList[index] });
          }
        },
      });
    }
  }, [currentUserType]);

  /**
   * 添加成功提示
   */
  usePageEvent('onShow', () => {
    if (addSuccess) {
      showToast({
        title: Strings.getLang('dsc_addSuccess'),
        icon: 'success',
        complete: () => updateUI({ addSuccess: false }),
      });
    }

    if (saveUserSuccess) {
      showToast({
        title: Strings.getLang('dsc_saveUserSuccess'),
        icon: 'success',
        complete: () => updateUI({ saveUserSuccess: false }),
      });
    }
  });

  const getFiltedData = async (pageNum: number, isFirstLoad: boolean, timerStr: string) => {
    await getLatestDetailedData(pageNum, isFirstLoad, timerStr);
  };

  const showSwitchUsers = useCallback(() => {
    updateUI({ isShowSwitchUser: true });
  }, []);

  const getTrendLineData = async () => {
    if (!userInfo?.id) return null;

    try {
      setLoading(true);
      return getLatestData(userInfo.id);
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  const getMoreData = () => {
    if (!hasNext) return;

    pageNo.current++;
    getFiltedData(pageNo.current, false, latestDataDay);
  };

  const hideUsers = useCallback(() => {
    updateUI({ isShowSwitchUser: false });
  }, []);

  const handleAddDataClick = useCallback(() => {
    router.push('/addData');
  }, []);

  const renderLatestData = () => {
    return (
      <ScrollView scrollY className={styles.listContainer} onScrollToLower={getMoreData}>
        <TrendLineChart isShowTody avgData={avgData} height={430} list={list} />
        {latestDatas.map(item => (
          <SingleDataItem item={item} key={item.id} />
        ))}
        {latestDatas.length > 0 && (
          <View className={styles.footerBox}>
            <Text className={styles.footerText}>
              {hasNext ? Strings.getLang('dsc_getMoreDta') : Strings.getLang('dsc_showAllData')}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <TopBar root title={devInfo.name} />
      <PageWrapper hasTabBar>
        <View className={styles.header}>
          <User onClick={showSwitchUsers} />
          <View className={styles.topIconBox}>
            {hasBatteryLow && (
              <View className={styles.batteryBox}>
                <Battery />
              </View>
            )}
            <BleIcon />
          </View>
        </View>
        <View className={styles.bloodPressureWrapper}>
          {list?.length !== 0 &&
            (loading ? <Loading className="to-center mg-t-60" /> : renderLatestData())}
          {list?.length === 0 && (
            <>
              <View className={styles.bloodPressureChart}>
                <Image className={styles.noDataPic} src={Res.noDataPic} />
                <Text className={styles.noDataTip} numberOfLines={2}>
                  {Strings.getLang('dsc_connectDevice')}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                className={styles.addManually}
                onClick={handleAddDataClick}
              >
                <AddManually />
              </TouchableOpacity>
            </>
          )}
        </View>
      </PageWrapper>

      <SwitchUser
        setErrorShow={() => {
          showToast({ title: Strings.getLang('dsc_onlyTen'), icon: 'error' });
        }}
        show={isShowSwitchUser}
        onHide={hideUsers}
      />

      <OfflineDataSelector />
    </>
  );
};

export default MainView;
