import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  showLoading,
  hideLoading,
  showToast,
  ai,
  fetchImageThumbnail as fetchImageThumbnailFunc,
} from '@ray-js/ray';
import { useMount } from 'ahooks';
import Strings from '@/i18n';
import { Toast } from '@ray-js/smart-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, GlobalToastInstance, Video } from '@/components';
import { normalizeFilePath } from '@/utils';
import { useDevice } from '@ray-js/panel-sdk';
import { UploadExtraData, UploadExtraFileData } from '@/types';
import {
  updateImgCheckedList,
  selectImgCheckedList,
  selectImgAiFilterData,
  updateImgCheckedListMap,
  selectImgCheckedListMap,
} from '@/redux/modules/imgSlice';
import {
  authorizeAsync,
  authorizeStatusAsync,
  uploadFileAsync,
  saveImageToPhotosAlbumAsync,
  saveVideoToPhotosAlbumAsync,
  fetchVideoThumbnailsAsync,
} from '@/api/nativeApi';
import { getSid } from '@/utils/getSid';
import { genHashUrl, genRealFn } from '@/utils/realFn';
import { modifyToCacheUrl } from '@/utils/cachePrefixMap';
import { clearAiFilterEventId } from '@/utils/aiFilterEvent';
import TopBar from '@/components/TopBar';
import styles from './index.module.less';

const {
  createForegroundVideoService,
  destroyForegroundVideoService,
  processPetForegroundMediaByTemplate,
} = ai;

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const AiFilter = () => {
  const dispatch = useDispatch();

  const imgCheckedListMap = useSelector(selectImgCheckedListMap);
  const aiFilterTypeList = useSelector(selectImgAiFilterData);
  const aiFilterTabs = Object.keys(aiFilterTypeList);

  const initTab = imgCheckedListMap?.currentTab || aiFilterTabs?.[1] || 'smartEffects';
  // const initTab = 'smartEffect';
  const imgCheckedList = useSelector(selectImgCheckedList);
  const [currentImgId, setCurrentImgId] = useState(
    imgCheckedListMap?.currentImgId || imgCheckedList[0]?.id
  );
  const [currentTab, setCurrentTab] = useState(initTab);
  const videoTitleRef = React.useRef('');
  const isStatic = currentTab === 'smartFilter'; // 只有 AI 滤镜为静态

  useEffect(() => {
    if (Object.keys(imgCheckedListMap).length > 0) {
      dispatch(
        updateImgCheckedListMap({
          ...imgCheckedListMap,
          ...{ [currentTab]: [...imgCheckedList], currentTab, currentImgId, isStatic },
        })
      );
    } else {
      const _imgCheckedListMap = { currentTab, currentImgId, isStatic };
      aiFilterTabs.forEach(tab => {
        _imgCheckedListMap[tab] = imgCheckedList;
      });

      dispatch(updateImgCheckedListMap(_imgCheckedListMap));
    }
  }, [imgCheckedList, currentTab, currentImgId]);

  useEffect(() => {
    clearAiFilterEventId();

    // 创建和销毁APP通道
    createForegroundVideoService();

    return () => {
      destroyForegroundVideoService();
    };
  }, []);

  const currentImg = useMemo(() => {
    if (currentImgId === undefined) {
      return imgCheckedList[0];
    }

    return imgCheckedList.find(item => Number(item.id) === Number(currentImgId));
  }, [imgCheckedList, currentImgId]);

  const filterCode = useMemo(() => {
    return currentImg?.filterCode;
  }, [currentImg]);

  const currentImgSrc = filterCode ? currentImg?.filterSrc || currentImg?.src : currentImg?.src;
  const isPic = currentImgSrc?.slice(-4) !== '.mp4';
  const writePhotosAlbumAuth = useCallback(() => {
    authorizeAsync({
      scope: 'scope.writePhotosAlbum',
    })
      .then(res => {
        console.log('~ writePhotosAlbum ~', res);
      })
      .catch(err => {
        console.log('~ writePhotosAlbum ~', err);
      });
  }, []);

  useMount(() => {
    writePhotosAlbumAuth();
  });

  const saveImg = useCallback(
    (filePath: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        saveImageToPhotosAlbumAsync({
          filePath,
        })
          .then(res => {
            console.log('~ saveImageToPhotosAlbum ~ res:', res);
            resolve(res);
          })
          .catch(err => {
            console.log('~ saveImageToPhotosAlbum ~ err:', err);
            reject(err);
          });
      });
    },
    [currentImg]
  );

  const saveVideo = useCallback(
    (filePath: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        saveVideoToPhotosAlbumAsync({
          filePath,
        })
          .then(res => {
            console.log('~ saveVideoToPhotosAlbum ~ res:', res);
            resolve(res);
          })
          .catch(err => {
            console.log('~ saveVideoToPhotosAlbum ~ err:', err);
            reject(err);
          });
      });
    },
    [currentImg]
  );

  const getAuthorize = useCallback(() => {
    return new Promise((resolve, reject) => {
      authorizeStatusAsync({
        scope: 'scope.writePhotosAlbum',
      })
        .then(data => {
          console.log('~ authorizeStatus writePhotosAlbum ~ data:', data);
          resolve(data);
        })
        .catch(err => {
          console.log('~ authorizeStatus writePhotosAlbum ~ err:', err);
          writePhotosAlbumAuth();
          reject(err);
        });
    });
  }, []);

  const handleSave = () => {
    if (!currentImgSrc) {
      return;
    }
    if (!filterCode) {
      return;
    }
    // 调用 app 方法保存
    getAuthorize()
      .then(() => {
        console.log('保存图片地址：', currentImgSrc);
        if (isPic) {
          return saveImg(currentImgSrc);
        }
        return saveVideo(currentImgSrc);
      })
      .then(() => {
        showToast({
          title: Strings.getLang('saveSuccess'),
        });
      })
      .catch(err => {
        console.log('保存失败', err);
        showToast({
          title: Strings.getLang('saveFail'),
        });
      });
  };

  const { devInfo } = useDevice();

  const changeAiFilterImg = (url: string, templateCode: string) => {
    if (!templateCode) {
      return;
    }
    let timer = null;
    GlobalToastInstance.loading({
      message: Strings.getLang('aiFilterTip'),
      duration: 0,
      forbidClick: true,
      onClose: () => {
        timer && clearTimeout(timer);
      },
    });
    timer = setTimeout(() => {
      GlobalToastInstance.clear();
      console.log('AI 生成超过30秒');
    }, 30000);
    const { devId } = devInfo || {};
    const fileList = [url];
    const extData = {
      type: 'ai-filter-upload',
    } as UploadExtraData;
    const fileMap = {} as Record<string, UploadExtraFileData>;
    imgCheckedList.forEach(item => {
      const realFn = genRealFn(item.fileName);
      const hasUrl = genHashUrl(item.fileName);
      fileMap[hasUrl] = {
        title: item.title,
        fileType: item.fileType,
        filename: realFn,
        url: modifyToCacheUrl(item.src),
        originUrl: modifyToCacheUrl(item.originUrl),
        thumbnail: modifyToCacheUrl(item.thumbnail),
      };
    });
    extData.fileMap = fileMap;
    extData.templateCode = templateCode;
    const params = {
      sid: getSid(devId),
      deviceId: devId,
      fileList,
      extData,
      businessType: 'frameStyle',
    };
    uploadFileAsync(params)
      .then(() => {
        // console.warn(res, 'uploadFileAsync');
      })
      .catch(err => {
        GlobalToastInstance.clear();
        console.error('uploadFileAsync', err);
      });
  };

  const changeAppAiFilterImg = (url: string, templateCode: string, aiFilter: any) => {
    if (!templateCode) {
      return;
    }

    showLoading({
      title: Strings.getLang('aiAppFilterTip'),
      mask: true,
    });

    processPetForegroundMediaByTemplate({
      templateObject: {
        effect: aiFilter,
        type: 'APP',
        outputType: 'image',
      },
      mediaSource: url,
      success(res) {
        console.log('createForegroundVideoService', res);
        const path = res.outputPath;
        hideLoading();
        const __tempCurrentImg = {
          ...currentImg,
          filterCode: templateCode,
          filterSrc: path,
        };
        updateCurrentImg(__tempCurrentImg);
        if (path?.slice(-4) === '.mp4') {
          fetchVideoThumbnail(path, __tempCurrentImg);
        } else {
          fetchImageThumbnail(path, __tempCurrentImg);
        }
      },
      fail(err) {
        console.log('createForegroundVideoService err', err);
        hideLoading();
        showToast({
          icon: 'error',
          // @ts-ignore
          title: Strings.getLang(`aiFilterFailed${Math.abs(err?.innerError?.errorCode) || ''}`),
        });
        // reject(err);
      },
    });
  };
  /**
   * 获取图片的缩略图
   */
  const fetchImageThumbnail = async (path: string, currentImg: any) => {
    return new Promise((resolve, reject) => {
      fetchImageThumbnailFunc({
        originPath: path,
        thumbWidth: 180,
        thumbHeight: 180,
        success(res) {
          console.log('fetchImageThumbnail ', res);
          updateCurrentImg({
            ...currentImg,
            thumbnail: res.thumbnailPath,
          });
          resolve(res);
        },
        fail(err) {
          console.log('fetchImageThumbnail err', err);
          reject(err);
        },
      });
    });
  };
  /**
   * 获取视频的缩略图
   */
  const fetchVideoThumbnail = (path: string, currentImg: any) => {
    // 生成缩略图
    const params = {
      filePath: normalizeFilePath(path),
      startTime: 0,
      endTime: 1000,
      thumbnailCount: 1,
      thumbnailWidth: 343 * 3,
      thumbnailHeight: 343 * 3,
    };
    fetchVideoThumbnailsAsync(params)
      .then(res => {
        console.log('fetchVideoThumbnailsAsync ', res);
        updateCurrentImg({
          ...currentImg,
          thumbnail: res.thumbnailsPath[0],
        });
      })
      .catch(err => {
        console.log('fetchVideoThumbnailsAsync err', err);
      });
  };

  const updateCurrentImg = (currentImg: any) => {
    const _imgList = [...imgCheckedList];
    const index = _imgList.findIndex(item => Number(item.id) === Number(currentImgId));
    index !== -1 && (_imgList[index] = currentImg);
    dispatch(updateImgCheckedList(_imgList));
  };

  if (!currentImg) {
    return null;
  }
  const handleAiFilterTypeClick = (aiFilter = { code: '' } as any) => {
    const { code, from } = aiFilter;
    const _currentImg = { ...currentImg, filterCode: code || '' };
    if (!code) {
      _currentImg.filterSrc = '';
    }
    updateCurrentImg(_currentImg);
    if (from === 'CLOUD') {
      changeAiFilterImg(_currentImg.src, code);
    } else {
      changeAppAiFilterImg(_currentImg.src, code, aiFilter);
    }
  };
  const renderDefaultAiFilter = () => {
    return (
      <View
        className={
          !filterCode ? styles.defaultAiFilterWrapperActive : styles.defaultAiFilterWrapper
        }
        onClick={() => handleAiFilterTypeClick()}
      >
        <View className={styles.defaultAiFilterMask} />
        <View className={styles.defaultAiFilterCircle} />
        <View className={styles.defaultAiFilterLine} />
      </View>
    );
  };

  const tabItem = () => {
    return (
      <View className={styles.aiFilterWrapper}>
        <TopBar.Sub title={Strings.getLang('ai_photo')} />
        <View className={styles.aiFilterTop}>
          <View className={styles.nextStep} onClick={handleSave}>
            {Strings.getLang('save')}
          </View>
        </View>
        {isPic ? (
          <Image className={styles.aiFilterImg} src={currentImgSrc} mode="aspectFit" />
        ) : (
          <Video
            id={`video-editor${currentTab}`}
            type="none"
            src={currentImgSrc}
            autoplay={false}
            showPlayPause
            poster={currentImg.thumbnail}
          />
        )}
        <View className={styles.aiFilterHandler}>
          <View className={styles.aiFilterContentWrapper}>{renderAiFilter()}</View>
        </View>
        <Toast id="smart-toast" />
      </View>
    );
  };

  const renderAiFilter = () => {
    return (
      <View className={styles.aiFilterTypeList}>
        {renderDefaultAiFilter()}
        {aiFilterTypeList[currentTab]?.map(item => {
          const isActive = item.code === filterCode;
          return (
            <View
              className={isActive ? styles.aiFilterItemActive : styles.aiFilterItem}
              key={item.code}
              onClick={() => handleAiFilterTypeClick(item)}
            >
              <Image className={styles.aiFilterItemImg} src={item.image} mode="aspectFill" />
              <Text className={styles.aiFilterItemTitle}>{item.name}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return <Layout>{tabItem()}</Layout>;
};

export default AiFilter;
