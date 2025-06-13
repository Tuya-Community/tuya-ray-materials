import { LayoutHeader } from '@/components';
import {
  ScrollView,
  View,
  offDpDataChange,
  onDpDataChange,
  publishDps,
  router,
  usePageEvent,
} from '@ray-js/ray';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import {
  getCollectionPointsInfo,
  updateCollectionPointsInfo,
  delCollectionPointsInfo,
} from '@ray-js/ray-ipc-utils';
import { useDevice } from '@ray-js/panel-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import CollectEdit, {
  IPropData as IPropCollectEdit,
  IPropData,
} from '@ray-js/ray-ipc-collect-edit';
import { IconFont } from '@/components/icon-font';
import DelayLoading from '@ray-js/delay-loading';
import _ from 'lodash';
import { getDpCodeByDpId, clickOutTime, clearPublishDpOutTime, rgbaToHex } from '@/utils';
import { devices } from '@/devices';
import Strings from '@/i18n';
import { updateCollect } from '@/redux/modules/collectSlice';
import Styles from './index.module.less';

const CollectEditPage = () => {
  const devInfo = useDevice(device => device.devInfo);
  const [datas, setDatas] = useState<IPropCollectEdit[]>([]);
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const [isShow, setIsShow] = useState(true);

  const dispatch = useDispatch();

  usePageEvent('onLoad', () => {
    ty.hideMenuButton();
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const id = devices.common.onDpDataChange(listenDpChange);
    return () => {
      devices.common.offDpDataChange(id);
    };
  }, []);

  const listenDpChange = data => {
    console.log('data', data);
    const { dps } = data;
    const dpsArray = Object.keys(dps);
    // 这里只需判定单DP上报的情况
    if (dpsArray.length === 1) {
      dpsArray.forEach(value => {
        const dpCode = getDpCodeByDpId(Number(value));
        console.log(dpCode, 'dpCode______');
        if (dpCode === 'memory_point_set') {
          clearPublishDpOutTime();
          const json = JSON.parse(dps[value] || '{}');
          const { type, data } = json || {};
          if (type === 2) {
            init();
          }
        }
      });
    }
  };

  const init = async () => {
    const res = await getCollectionPointsInfo(devInfo.devId);
    setIsShow(false);
    if (res.code === -1) {
      ty.showToast({ icon: 'error', title: res.msg });
      return;
    }
    const datas = res.data.map(data => {
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
    setDatas(datas);
  };

  const onLeftClick = () => {
    router.back();
  };

  const onEditBtn = async (data: IPropCollectEdit, index: number) => {
    const themeInfo = ty.getThemeInfo();
    ty.showModal({
      title: Strings.getLang('ipc_collect_name'),
      cancelColor: rgbaToHex(themeInfo['--app-B3-N7']),
      isShowGlobal: true,
      inputAttr: {
        placeholder: Strings.getLang('ipc_collect_name_placeholder'),
        placeHolderColor: rgbaToHex(themeInfo['--app-B3-N7']),
        // backgroundColor: rgbaToHex(themeInfo['--app-B3']),
        textColor: rgbaToHex(themeInfo['--app-B3-N2']),
      },
      confirmText: Strings.getLang('ipc_alert_save'),
      cancelText: Strings.getLang('ipc_alert_cancel'),
      modalStyle: 1,
      success: async res => {
        if (res.confirm) {
          try {
            clickOutTime();
            const result = await updateCollectionPointsInfo(
              data.deviceId,
              data.id,
              res?.inputContent
            );
            clearPublishDpOutTime();
            if (result.code === -1) {
              ty.showToast({ icon: 'error', title: result.msg });
              return;
            }
            const curDatas = _.cloneDeep(datas);
            curDatas[index].title = res?.inputContent;
            setDatas(curDatas);
            dispatch(updateCollect({ isUpdate: true }));
          } catch (err) {
            clearPublishDpOutTime();
          }
        }
      },
      fail: err => {
        console.log(err, 'err');
      },
    });
    // DialogInstance.input({
    //   title: Strings.getLang('ipc_collect_name'),
    //   value: data.title || '',
    //   selector: '#collectEdit',
    //   placeholder: Strings.getLang('ipc_collect_name_placeholder'),
    //   confirmButtonText: Strings.getLang('ipc_alert_save'),
    //   cancelButtonText: Strings.getLang('ipc_alert_cancel'),
    // })
    //   .then(async res => {
    //     const value = res.data.inputValue;
    //     clickOutTime();
    //     const result = await updateCollectionPointsInfo(data.deviceId, data.id, value);
    //     clearPublishDpOutTime();
    //     if (result.code === -1) {
    //       ty.showToast({ icon: 'error', title: result.msg });
    //       return;
    //     }
    //     const curDatas = _.cloneDeep(datas);
    //     curDatas[index].title = value;
    //     setDatas(curDatas);
    //     dispatch(updateCollect({ isUpdate: true }));
    //   })
    //   .catch(e => {
    //     // oncancel
    //   });
  };

  const onDeleteBtn = async (data: IPropCollectEdit) => {
    DialogInstance.confirm({
      message: Strings.getLang('is_delete_collect_desc'),
      selector: '#collectEdit',
      cancelButtonText: Strings.getLang('ipc_alert_cancel'),
      transition: 'fade',
    })
      .then(async res => {
        clickOutTime();
        const result = await delCollectionPointsInfo(data.deviceId, [
          { devId: data.id, mpId: data.mpId },
        ]);
        if (result.code === -1) {
          ty.showToast({ icon: 'error', title: result.msg });
          clearPublishDpOutTime();
        }
      })
      .catch(() => {
        ty.hideLoading();
      });
  };

  const onAddBtn = () => {
    router.back();
  };

  const onCollectImage = (data: IPropData) => {
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
    <View className={Styles.container}>
      <LayoutHeader
        title={Strings.getLang('ipc_edit_collect')}
        onLeftClick={onLeftClick}
        style={{ backgroundColor: 'transparent' }}
      />
      <ScrollView className={Styles.scrollView} scrollY>
        <DelayLoading
          isShow={isShow}
          loadingText={
            <View className={Styles.loading_text}>{Strings.getLang('ipc_trying_loading')}</View>
          }
        >
          <CollectEdit
            datas={datas}
            className={Styles.collect}
            classNameContent={Styles.collect_edit}
            classNameBox={Styles.collect_edit_box}
            imgBoxStyle={{ borderRadius: '8rpx', overflow: 'hidden' }}
            errView={
              <>
                <View style={{ width: '200rpx', height: '120rpx' }}>
                  {Strings.getLang('ipc_image_error')}
                </View>
              </>
            }
            mode="aspectFill"
            editBtn={<IconFont style={{ fontSize: '44rpx' }} icon="edit" />}
            deleteBtn={<IconFont style={{ fontSize: '44rpx', color: brandColor }} icon="delete" />}
            onEditBtn={onEditBtn}
            onDeleteBtn={onDeleteBtn}
            onAddBtn={onAddBtn}
            onCollectImage={onCollectImage}
          />
        </DelayLoading>
      </ScrollView>
      <Dialog id="collectEdit" />
    </View>
  );
};

export default CollectEditPage;
