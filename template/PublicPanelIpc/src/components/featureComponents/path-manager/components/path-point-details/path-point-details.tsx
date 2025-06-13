import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import {
  View,
  ScrollView,
  Text,
  showToast,
  showModal,
  showLoading,
  hideLoading,
} from '@ray-js/ray';
import { ActionSheet, Cell, CellGroup, Empty } from '@ray-js/smart-ui';
import { PopupTitle } from '@/components/popup-title';
import { IconFont } from '@/components/icon-font';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { useDeletePath, usePlayPoint, useUpdatePathName, useCurrentPlayPoint } from '@/features';
import { useTheme } from '@/hooks';
import { DialogInstance } from '@/components/enhance-dialog';
import Strings from '@/i18n';
import { isIphoneX, rgbaToHex, getThemeInfo } from '@/utils';
import emptyImageLight from '@/res/image/pathListEmpty.png';
import emptyImageDark from '@/res/image/pathListEmptyDark.png';
import { Path, Point } from '@/entities/path/interface';
import { PointItem } from './point-item';
import { PathManagerSceneContext, Scene } from '../../context';
import { DELETE_PATH } from '../../eventName';

import styles from './path-point-details.module.less';

export type PathPointDetailsProps = {
  devId: string;
};

export function PathPointDetails(props: PathPointDetailsProps) {
  const {
    backPrevScene,
    pushSceneTask,
    currentEditPathInfo,
    setCurrentEditPathId,
    setCurrentEditPathInfo,
  } = useContext(PathManagerSceneContext);
  const theme = useTheme();
  const { recharge } = useProps(props => ({
    recharge: props.ipc_auto_recharge,
  }));
  const actions = useActions();
  const deletePathInstance = useDeletePath();
  const updatePathNameInstance = useUpdatePathName();
  const { startPlay, endPay, running } = usePlayPoint();
  const { playing, currentPlayId } = useCurrentPlayPoint();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const handRecharge = () => {
    actions.ipc_auto_recharge.toggle();
  };

  const handDeletePath = async (pathId: number) => {
    DialogInstance.confirm({
      title: Strings.getLang('confirmDeletePathTitle'),
      confirmButtonText: Strings.getLang('confirmText'),
      cancelButtonText: Strings.getLang('cancelText'),
      beforeClose: async action => {
        if (action === 'confirm') {
          await deletePathInstance.start(pathId);
          backPrevScene();
        }
        return true;
      },
    }).catch(err => null);
  };

  const handClickEdit = () => {
    // setShowActionSheet(true);
    // 先去掉编辑路径节点的口子
    handClickUpdatePathName();
  };

  const handClickUpdatePathName = () => {
    const themeInfo = getThemeInfo();
    showModal({
      title: Strings.getLang('editPathBtnTitle'),
      // @ts-ignore
      isShowGlobal: true,
      // confirmColor: brandColor,
      modalStyle: 1,
      inputAttr: {
        placeholder: Strings.getLang('ipc_collect_name_placeholder'),
        placeHolderColor: rgbaToHex(themeInfo['--app-B3-N7']),
        backgroundColor: rgbaToHex(themeInfo['--app-B3']),
        textColor: rgbaToHex(themeInfo['--app-B3-N2']),
      },
      confirmText: Strings.getLang('saveText'),
      cancelText: Strings.getLang('cancelText'),
      success: async res => {
        if (res.confirm) {
          // @ts-ignore
          const value = res?.inputContent;
          showLoading({ title: '' });
          const ret = await updatePathNameInstance.start(currentEditPathInfo.pathId, value);
          hideLoading();
          if (ret) {
            const newData = {
              ...currentEditPathInfo,
              name: value,
            };
            setCurrentEditPathInfo(newData);
            setShowActionSheet(false);
          }
        }
      },
    });
    // DialogInstance.input({
    //   title: Strings.getLang('editPathBtnTitle'),
    //   value: '',
    //   beforeClose: async (action, value) => {
    //     if (action === 'confirm') {
    //       const ret = updatePathNameInstance.start(currentEditPathInfo.pathId, value);
    //       if (ret) {
    //         const newData = {
    //           ...currentEditPathInfo,
    //           name: value,
    //         };
    //         setCurrentEditPathInfo(newData);
    //         setShowActionSheet(false);
    //       }
    //       return true;
    //     }
    //     return true;
    //   },
    // }).catch(err => {
    //   //
    // });
  };

  const handClickEditPath = (path: Path) => {
    setCurrentEditPathId(path.pathId);
    setCurrentEditPathInfo(path);
    pushSceneTask(Scene.EDIT_PATH_POINT);
  };

  const handPlayPoint = async (pathId: number, point: Point) => {
    // 为什么要兼取 running 的值 ?
    // playing 状态是由 dp 点上报取出来的， running 的值是单次操作中的记录
    // playing 的值依赖 dp 上报是异步的
    // 这里兼取 running 的值，规避用户快速点击两个节点的情况
    const currentPlaying = running || playing;
    if (currentPlaying && point.id !== currentPlayId) {
      showToast({
        icon: 'none',
        title: Strings.getLang('clickPlayOnPlayingToastTitle'),
      });
    } else if (currentPlaying && point.id === currentPlayId) {
      await endPay(pathId, point.id);
    } else {
      await startPlay(pathId, point.id);
    }
  };

  const renderContent = () => {
    if (!currentEditPathInfo.pointList.length) {
      return (
        <View
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // @ts-ignore
            '--empty-image-width': '138rpx',
            '--empty-image-height': '138rpx',
          }}
        >
          <Empty
            image={theme === 'light' ? emptyImageLight : emptyImageDark}
            title={Strings.getLang('pathPointEmptyTitle')}
          />
        </View>
      );
    }
    return (
      <ScrollView style={{ flex: 1 }} scrollY>
        <View className={styles.listWarp}>
          {currentEditPathInfo.pointList.map((item, idx) => (
            <View
              key={item.id}
              className={clsx(styles.listItem)}
              onClick={() => handPlayPoint(currentEditPathInfo.pathId, item)}
            >
              <View className={styles.nodeHeader}>
                {Strings.formatString(Strings.getLang('pathNodeTitle'), String(idx + 1))}
              </View>
              <PointItem
                imageSrc={item.pic}
                secret={item.encryption.key}
                devId={props.devId}
                className={styles.item}
                playing={playing && currentPlayId === item.id}
                // onClickPlayPoint={() => handPlayPoint(currentEditPathInfo.pathId, item)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <ActionSheet
        show={showActionSheet}
        cancelText={Strings.getLang('cancelText')}
        title={Strings.getLang('editText')}
        onCancel={() => setShowActionSheet(false)}
        onClickOverlay={() => setShowActionSheet(false)}
      >
        <CellGroup>
          <Cell
            title={Strings.getLang('editPathNameBtnTitle')}
            isLink
            onClick={handClickUpdatePathName}
          />
          <Cell
            title={Strings.getLang('editPathBtnTitle')}
            onClick={() => handClickEditPath(currentEditPathInfo)}
            border={false}
            isLink
          />
        </CellGroup>
      </ActionSheet>
      <View className={styles.editBtn} onClick={handClickEdit}>
        <IconFont icon="edit" otherClassName={styles.editIcon} />
      </View>
      <PopupTitle
        leftIcon="left-arrow"
        leftIconStyle={{ fontSize: 40 }}
        onClose={backPrevScene}
        title={currentEditPathInfo.name}
      />
      <View className={styles.content}>
        <View className={styles.tip}>{Strings.getLang('moveToPointTip')}</View>
        {renderContent()}
        <View className={styles.buttonWarp} style={{ marginBottom: isIphoneX ? '40px' : '20px' }}>
          <View style={{ marginRight: '22rpx' }} className={styles.button} onClick={handRecharge}>
            <IconFont
              otherClassName={clsx(styles.btnIcon, {
                [styles.active]: recharge,
              })}
              style={{ fontSize: 44 }}
              icon="recharge-1"
            />
            <Text className={styles.btnTitle}>{Strings.getLang('rechargeBtnText')}</Text>
          </View>
          <View
            onClick={() => handDeletePath(currentEditPathInfo.pathId)}
            className={clsx(styles.button, styles.deleteBtn)}
          >
            <View className={styles.deleteBtnMask} />
            <IconFont otherClassName={styles.btnIcon} icon="delete" />
            <Text className={clsx(styles.btnTitle)}>{Strings.getLang('deleteText')}</Text>
          </View>
        </View>
      </View>
    </>
  );
}
