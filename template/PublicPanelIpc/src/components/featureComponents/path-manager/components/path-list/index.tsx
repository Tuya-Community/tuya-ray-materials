import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, showToast, showModal, showLoading, hideLoading } from '@ray-js/ray';
import { useRequest } from 'ahooks';
import { Empty, Button } from '@ray-js/smart-ui';
import { useProps } from '@ray-js/panel-sdk';
import { path } from '@/api';
import { PopupTitle } from '@/components/popup-title';
import { useCreatePath, usePlayPath, useCurrentPlayPath } from '@/features';
import { useTheme } from '@/hooks';
import { Path } from '@/entities/path/interface';
import Strings from '@/i18n';
import { isIphoneX, rgbaToHex, getThemeInfo } from '@/utils';
import emptyImageLight from '@/res/image/pathListEmpty.png';
import emptyImageDark from '@/res/image/pathListEmptyDark.png';
import { PathManagerSceneContext, Scene } from '../../context';
import { PathItem } from './path-item';

import styles from './index.module.less';

export interface PathListProps {
  devId: string;
}

const MAX_PATH_COUNT = 3;

export function PathList(props: PathListProps) {
  const [isInit, setIsInit] = useState(false);
  const theme = useTheme();
  const { wireless_powermode } = useProps(state => ({
    wireless_powermode: state.wireless_powermode,
  }));
  const { setCurrentEditPathId, pushSceneTask, setCurrentEditPathInfo, backPrevScene } =
    useContext(PathManagerSceneContext);
  const createPathInstance = useCreatePath();
  const { startPlay, endPay, running } = usePlayPath();
  const { currentPlayId, playing } = useCurrentPlayPath();
  const {
    data = null,
    runAsync,
    loading,
  } = useRequest(path.getPathList, {
    manual: true,
    onSuccess() {
      setIsInit(true);
    },
  });
  useEffect(() => {
    runAsync({
      devId: props.devId,
    });
  }, [props.devId]);

  const handCreatePath = () => {
    if (data?.pathList?.length >= MAX_PATH_COUNT) {
      showToast({
        title: Strings.getLang('maximumPathLimitTip'),
        icon: 'none',
      });
      return;
    }
    // 校验是否在充电底座上
    if (wireless_powermode !== '1') {
      showToast({
        title: Strings.getLang('canNotCreatePathTip_no_in_origin'),
        icon: 'none',
      });
      return;
    }

    const themeInfo = getThemeInfo();
    showModal({
      title: Strings.getLang('inputPathNameConfirmTitle'),
      // @ts-ignore
      isShowGlobal: true,
      // confirmColor: brandColor,
      modalStyle: 1,
      inputAttr: {
        placeholder: Strings.getLang('ipc_path_name_placeholder'),
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
          const pathId = await createPathInstance.start(value);
          hideLoading();
          createPathInstance.end();
          if (pathId > 0) {
            setCurrentEditPathId(pathId);
            // 初次创建的路径，给出默认数据
            setCurrentEditPathInfo({
              pathId,
              name: value,
              pointList: [],
            });
            pushSceneTask(Scene.EDIT_PATH_POINT);
          }
        }
      },
    });
    // DialogInstance.input({
    //   title: Strings.getLang('inputPathNameConfirmTitle'),
    //   zIndex: 500,
    //   value: '',
    //   beforeClose: async (action, value) => {
    //     if (action === 'confirm') {
    //       const pathId = await createPathInstance.start(value);
    //       createPathInstance.end();
    //       if (pathId > 0) {
    //         setCurrentEditPathId(pathId);
    //         // 初次创建的路径，给出默认数据
    //         setCurrentEditPathInfo({
    //           pathId,
    //           name: value,
    //           pointList: [],
    //         });
    //         pushSceneTask(Scene.EDIT_PATH_POINT);
    //       }
    //       return true;
    //     }
    //     return true;
    //   },
    // }).catch(err => {
    //   //
    // });
  };

  const playPath = async (path: Path) => {
    if (!path.pointList?.length) {
      showToast({
        icon: 'none',
        title: Strings.getLang('clickPlayOnPathNodeEmptyToastTitle'),
      });
      return;
    }
    const { pathId } = path;
    // 为什么要兼取 running 的值 ?
    // playing 状态是由 dp 点上报取出来的， running 的值是单次操作中的记录
    // playing 的值依赖 dp 上报是异步的
    // 这里兼取 running 的值，规避用户快速点击两条路径的情况
    const pathPlaying = running || playing;
    if (pathPlaying && pathId !== currentPlayId) {
      // 路径 a 还在播放的时候点击了路径 b
      showToast({
        icon: 'none',
        title: Strings.getLang('clickPlayOnPlayingToastTitle'),
      });
    } else if (pathPlaying && pathId === currentPlayId) {
      endPay(pathId);
      setCurrentEditPathId(undefined);
    } else {
      startPlay(pathId);
    }
  };

  const jumpToPathDetails = (path: Path) => {
    setCurrentEditPathId(path.pathId);
    setCurrentEditPathInfo(path);
    pushSceneTask(Scene.PATH_POINT_DETAILS);
  };

  const renderContent = () => {
    if (!isInit) return null;
    if (!data.pathList?.length) {
      return (
        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Empty
            image={theme === 'light' ? emptyImageLight : emptyImageDark}
            title={Strings.getLang('pathListEmptyTitle')}
            description={Strings.getLang('pathListEmptyDesc')}
          />
        </View>
      );
    }
    return (
      <>
        <View className={styles.tip}>{Strings.getLang('pathListPageTip')}</View>
        <ScrollView scrollY style={{ flex: 1, marginTop: 32 }}>
          {data.pathList.map(item => {
            const pointItem = item.pointList?.length ? item.pointList[0] : null;
            return (
              <PathItem
                imageSrc={pointItem?.pic}
                secret={pointItem?.encryption?.key}
                key={item.pathId}
                title={item.name}
                playing={currentPlayId === item.pathId && playing}
                desc={Strings.formatString(Strings.getLang('pathPointCountDesc'), [
                  item.pointList.length,
                ])}
                onBtnClick={() => playPath(item)}
                onContentClick={() => jumpToPathDetails(item)}
                devId={props.devId}
                showBtn={item.pointList?.length > 0}
              />
            );
          })}
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <PopupTitle onClose={backPrevScene} title={Strings.getLang('pathManagerPopTitle')} />
      <View
        style={{
          // @ts-ignore
          '--empty-image-width': '138rpx',
          '--empty-image-height': '138rpx',
          marginBottom: isIphoneX ? '40px' : '20px',
        }}
        className={styles.content}
      >
        {renderContent()}
        {isInit && (
          <Button
            disabled={data?.pathList?.length >= MAX_PATH_COUNT}
            round
            type="primary"
            size="small"
            block
            // @ts-ignore
            onTap={handCreatePath}
          >
            {Strings.getLang('createPathBtnTitle')}
          </Button>
        )}
      </View>
    </>
  );
}
