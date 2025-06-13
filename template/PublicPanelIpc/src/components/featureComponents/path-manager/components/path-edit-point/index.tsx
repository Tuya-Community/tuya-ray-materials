import React, { useState, useContext, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { View, showLoading, hideLoading, showModal, showToast, ScrollView } from '@ray-js/ray';
import { useProps, useActions } from '@ray-js/panel-sdk';
import { useThrottleFn } from 'ahooks';
import { useSelector } from 'react-redux';
import Ptz from '@ray-js/ipc-ptz-zoom';
import DecryptImage from '@ray-js/ray-ipc-decrypt-image';
import { Button } from '@ray-js/smart-ui';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import { PopupTitle } from '@/components/popup-title';
import { path } from '@/api';
import { IconFont } from '@/components/icon-font';
import { getFileNameByUrl, isIphoneX } from '@/utils';
import { useCreatePoint, useDeletePointByPath, useFinishSavePath } from '@/features';
import { Point } from '@/entities/path/interface';
import Strings from '@/i18n';
import { PathManagerSceneContext } from '../../context';

import styles from './index.module.less';

export interface PathListProps {
  devId: string;
}

export function PathEditPoint(props: PathListProps) {
  const { devId } = props;
  const { backPrevScene, currentEditPathInfo, setCurrentEditPathInfo } =
    useContext(PathManagerSceneContext);
  const actions = useActions();
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  const pointList = useMemo(() => {
    return currentEditPathInfo.pointList;
  }, [currentEditPathInfo]);
  const state = useProps();
  const maxPointNum = state.ipc_mobile_pathnum || 3;
  const [recording, setRecording] = useState(false);
  const createPointInstance = useCreatePoint(currentEditPathInfo.pathId);
  const deletePointInstance = useDeletePointByPath();
  const finishSavePathInstance = useFinishSavePath();
  const prevRotate = useRef('');

  const searchAndUpdatePathInfo = async (pathId: number) => {
    const pathList = await path.getPathList({
      devId,
    });
    console.log(pathList, 'pathList');
    const targetPath = pathList.pathList.find(item => item.pathId === pathId);
    setCurrentEditPathInfo(targetPath);
  };

  const handDeletePoint = (pathId: number, point: Point) => {
    showModal({
      title: Strings.getLang('confirmToDeleteNodeTitle'),
      cancelText: Strings.getLang('cancelText'),
      confirmText: Strings.getLang('confirmText'),
      success: async ({ confirm }) => {
        if (confirm) {
          showLoading({
            title: '',
          });
          const ret = await deletePointInstance.start(pathId, point.id);
          hideLoading();
          if (ret) {
            searchAndUpdatePathInfo(pathId);
          }
        }
      },
    });
  };

  const renderPointList = () => {
    const ret = [];
    if (pointList.length) {
      pointList.forEach(item => {
        ret.push(
          <View key={item.id} className={styles.imgBox}>
            <DecryptImage
              className={styles.img}
              src={item.pic}
              key={item.id}
              errView={<View className={styles.img} />}
              deviceId={devId}
              fileName={getFileNameByUrl(item.pic)}
              encryptKey={item.encryption.key}
            />
          </View>
        );
      });
    }
    if (ret.length < maxPointNum) {
      ret.push(
        <View
          key="addButton"
          onClick={handAddPoint}
          className={clsx(styles.imgBox, styles.emptyImgBox)}
        >
          <IconFont icon="cross-add" otherClassName={styles.addImgIcon} />
        </View>
      );
    }
    return ret;
  };

  const handAddPoint = async () => {
    setRecording(true);
    showLoading({
      title: '',
    });
    try {
      const mpId = await createPointInstance.start();
      if (mpId > 0) {
        // 查询且更新路径信息
        searchAndUpdatePathInfo(currentEditPathInfo.pathId);
      }
    } catch (err) {
      //
    } finally {
      createPointInstance.end();
      setRecording(false);
      hideLoading();
    }
  };

  const sendDpValueFn = (value: string) => {
    if (value === prevRotate.current) return;
    actions.ipc_direction_control.set(value);
    prevRotate.current = value;
  };

  const { run: sendDpValue } = useThrottleFn(sendDpValueFn, {
    wait: 500,
    leading: true,
    trailing: true,
  });

  const handPtzStart = e => {
    const value = e.type;
    if (value === 'bottom') {
      showToast({
        icon: 'none',
        title: Strings.getLang('addPointPtzBottomErrorTip'),
      });
      return;
    }
    // 361 362 363 364 上下左右 -2 代表停止
    const map = {
      top: '361',
      right: '362',
      bottom: '363',
      left: '364',
    };
    sendDpValue(map[value]);
  };

  const handPtzEnd = () => {
    sendDpValue('-2');
  };

  const handClickSaveBtn = async (pathId: number) => {
    showLoading({
      title: '',
    });
    await finishSavePathInstance.start(pathId);
    hideLoading();
    backPrevScene();
  };

  return (
    <>
      <PopupTitle
        leftIcon="left-arrow"
        leftIconStyle={{ fontSize: 40 }}
        onClose={backPrevScene}
        title={currentEditPathInfo.name}
      />
      <View className={styles.saveBtn} onClick={() => handClickSaveBtn(currentEditPathInfo.pathId)}>
        {Strings.getLang('saveText')}
      </View>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.box}>
          {!pointList.length && (
            <View className={styles.tip}>{Strings.getLang('addPathPointFirstTip')}</View>
          )}
          {pointList.length > 0 && pointList.length < maxPointNum && (
            <View className={styles.tip}>{Strings.getLang('addPathPointNextTip')}</View>
          )}
          {pointList.length >= maxPointNum && (
            <View className={styles.tip}>{Strings.getLang('addPathPointMaxTip')}</View>
          )}
          <ScrollView scrollX className={styles.pointListWrap}>
            <View className={styles.imgBoxWrap}>{renderPointList()}</View>
          </ScrollView>
          <View className={styles.ipcPtzWarp}>
            <Ptz
              zoomSize="0"
              brandColor={brandColor}
              zoomWrapClassName={styles.zoomWrapClassName}
              ptzSize="412"
              onTouchPtzStart={handPtzStart}
              onTouchPtzEnd={handPtzEnd}
            />
          </View>
        </View>
      </ScrollView>
      {pointList?.length < maxPointNum && (
        <View className={styles.addButtonBox} style={{ marginBottom: isIphoneX ? '40px' : '20px' }}>
          <Button
            onClick={handAddPoint}
            plain
            type="primary"
            className={styles.addButton}
            size="small"
            block
            disabled={recording || pointList?.length >= maxPointNum}
          >
            {Strings.getLang('recordCurrentPlaceToPoint')}
          </Button>
        </View>
      )}
    </>
  );
}
