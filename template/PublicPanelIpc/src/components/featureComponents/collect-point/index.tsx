// PTZ 焦距组件
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, publishDps } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import CollectImg, { IPropData } from '@ray-js/ray-ipc-collect-img';
import { getCollectionPointsInfo, addCollectionPointsInfo } from '@ray-js/ray-ipc-utils';
import { Dialog } from '@ray-js/smart-ui';
import { getDpCodeByDpId, clickOutTime, clearPublishDpOutTime, rgbaToHex } from '@/utils';
import { devices } from '@/devices';
import { IconFont } from '@/components/icon-font';
import { useSystemInfo } from '@/hooks';
import Strings from '@/i18n';
import DelayLoading from '@ray-js/delay-loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectCollectKey, updateCollect } from '@/redux/modules/collectSlice';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import Styles from './index.module.less';

interface IProps {}

interface ICollectionPointsInfo {
  devId: string;
  encryption: any;
  name: string;
  pic: string;
  id: string;
}

export const CollectPoint: React.FC<IProps> = (props: IProps) => {
  const devInfo = useDevice(device => device.devInfo);
  const isUpdate = useSelector(selectCollectKey('isUpdate'));
  const isPreviewOn = useSelector(selectPanelInfoByKey('isPreviewOn'));
  const dispatch = useDispatch();
  const systemInfo = useSystemInfo();
  const selectDevDp = devInfo?.dpCodes || {};

  const [isAdmin, setIsAdmin] = useState(false);
  const [listData, setListData] = useState<IPropData[]>([]);
  const [imgHeight, setImgHeight] = useState('');
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    const height = `${(((systemInfo.windowWidth - 16 * 4) / 3) * 9) / 16}px`;
    setImgHeight(height);
  }, []);

  useEffect(() => {
    init();
    getIsAdmin();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      init();
      dispatch(updateCollect({ isUpdate: false }));
    }
  }, [isUpdate]);

  useEffect(() => {
    const id = devices.common.onDpDataChange(listenDpChange);
    return () => {
      devices.common.offDpDataChange(id);
    };
  }, []);

  const listenDpChange = data => {
    const { dps } = data;
    const dpsArray = Object.keys(dps);
    console.log(dpsArray, 'dpsArray=====');
    // 这里只需判定单DP上报的情况
    if (dpsArray.length === 1) {
      dpsArray.forEach(value => {
        const dpCode = getDpCodeByDpId(Number(value));
        console.log(dpCode, 'dpCode---');
        if (dpCode === 'memory_point_set') {
          clearPublishDpOutTime();
          const json = JSON.parse(dps[value] || '{}');
          const { type, data } = json || {};
          const error = data?.error || 0;
          if ((type === 1 && error <= 10000) || type === 2 || type === 4) {
            init();
          } else if (type === 1 && error === 10002) {
            ty.showToast({ icon: 'error', title: Strings.getLang('ipc_err_memory_point_cruise') });
          }
        }
      });
    }
  };

  const getIsAdmin = () => {
    ty.home.getCurrentHomeInfo({
      success: res => {
        const { admin = false } = res;
        setIsAdmin(admin);
      },
    });
  };

  const init = async () => {
    const res = await getCollectionPointsInfo<ICollectionPointsInfo[]>(devInfo.devId);
    setIsShow(false);
    if (res.code === -1) {
      ty.showToast({ icon: 'error', title: res.msg });
      return;
    }
    const listData = res.data.map(data => {
      let fileName = '';
      if (data.pic) {
        const paths = data.pic.split('?');
        fileName = paths[0].split('/').pop();
      }
      return {
        deviceId: data.devId,
        encryptKey: data.encryption.key,
        fileName,
        title: data.name,
        src: data.pic,
        id: data.id,
        mpId: data.mpId,
      };
    });
    setListData(listData);
  };

  const onAddCollect = async () => {
    if (!isPreviewOn) {
      return false;
    }
    const themeInfo = ty.getThemeInfo();
    ty.showModal({
      title: Strings.getLang('ipc_collect_name'),
      cancelColor: rgbaToHex(themeInfo['--app-B3-N3']),
      // cancelColor: '#dd6657',
      isShowGlobal: true,
      inputAttr: {
        placeholder: Strings.getLang('ipc_collect_name_placeholder'),
        placeHolderColor: rgbaToHex(themeInfo['--app-B3-N7']),
        // placeHolderColor: '#dd6657',
        // backgroundColor: rgbaToHex(themeInfo['--app-B3']),
        // backgroundColor: '#000000',
        textColor: rgbaToHex(themeInfo['--app-B3-N2']),
        // textColor: '#dd6657',
      },
      confirmText: Strings.getLang('ipc_alert_save'),
      cancelText: Strings.getLang('ipc_alert_cancel'),
      modalStyle: 1,
      success: async res => {
        if (res.confirm) {
          try {
            clickOutTime();
            const result = await addCollectionPointsInfo(devInfo.devId, res?.inputContent);
            //  成功后会上报两次，一次是type 1，一次是type4，监听到上报type 1 或 4就拉接口
            if (result.code === -1) {
              clearPublishDpOutTime();
              ty.showToast({ icon: 'error', title: result.msg });
              return;
            }
          } catch (err) {
            clearPublishDpOutTime();
          }
        }
      },
      fail: err => {
        console.log(err, 'err');
      },
    });
    return true;
    // nativeDisabled(true);
    // DialogInstance.input({
    //   title: Strings.getLang('ipc_collect_name'),
    //   selector: '#collectPoint',
    //   value: '',
    //   placeholder: Strings.getLang('ipc_collect_name_placeholder'),
    //   confirmButtonText: Strings.getLang('ipc_alert_save'),
    //   cancelButtonText: Strings.getLang('ipc_alert_cancel'),
    // })
    //   .then(async res => {
    //     ty.showLoading({ title: '' });
    //     nativeDisabled(false);
    //     await addCollectionPointsInfo(devInfo.devId, res.data.inputValue);
    //     //  成功后会上报两次，一次是type 1，一次是type4，监听到上报type 1 或 4就拉接口
    //     ty.hideLoading();
    //   })
    //   .catch(e => {
    //     // oncancel
    //   });
  };

  const onCollect = async (data: IPropData) => {
    publishDps({
      memory_point_set: JSON.stringify({
        type: 3,
        data: {
          mpId: data.mpId,
        },
      }),
    });
  };

  return (
    <View className={clsx(Styles.comContainer)}>
      <ScrollView className={Styles.contentWrapper} scrollY>
        <DelayLoading
          isShow={isShow}
          loadingText={
            <View className={Styles.loading_text}>{Strings.getLang('ipc_trying_loading')}</View>
          }
        >
          {listData.length === 0 && (
            <View
              className={clsx(Styles.emptyContainer, !isPreviewOn && Styles.disableEmptyAdd)}
              onClick={onAddCollect}
            >
              <IconFont icon="ptz_collect_add" otherClassName={Styles.emptyAddIcon} />
              <Text className={Styles.emptyAddTip}>
                {Strings.getLang('ipc_collect_empty_and_add_tip')}
              </Text>
            </View>
          )}

          {listData.length !== 0 && (
            <CollectImg
              datas={listData}
              addView={
                <>
                  <View>
                    <IconFont icon="add-collect" />
                  </View>
                  <View style={{ fontSize: '24rpx' }}>{Strings.getLang('ipc_add_collect')}</View>
                </>
              }
              className={Styles.CollectImg}
              titleStyle={{
                marginTop: '4rpx',
                display: 'flex',
                alignItems: 'center',
                height: '34rpx',
              }}
              addBoxStyle={{ height: imgHeight, borderRadius: '8rpx', overflow: 'hidden' }}
              errView={
                <>
                  <View style={{ fontSize: '24rpx' }}>{Strings.getLang('ipc_image_error')}</View>
                </>
              }
              mode="aspectFill"
              maxNum={6}
              onAddCollect={onAddCollect}
              onCollect={onCollect}
            />
          )}
        </DelayLoading>
      </ScrollView>
      <Dialog id="collectPoint" />
    </View>
  );
};
