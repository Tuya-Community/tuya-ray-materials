import React, { useEffect, useMemo } from 'react';
import {
  router,
  View,
  getAiFilterTemplates,
  showLoading,
  showToast,
  hideLoading,
} from '@ray-js/ray';
import { ActionSheet, Button, Icon, SmartTouchEvent } from '@ray-js/smart-ui';
import { useBoolean } from 'ahooks';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import { getFileNameAndExtension } from '@/utils';
import {
  MAX_CHOOSE_IMAGE_NUM,
  MAX_CHOOSE_VIDEO_NUM,
  MAX_EDIT_VIDEO_NUM,
  THEME_COLOR,
} from '@/constant';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { Layout, PhotoList } from '@/components';
import { SelectData } from '@/components/PhotoList/index.type';
import { addPhotosAsync, selectIsInitialized, selectPhotos } from '@/redux/modules/albumSlice';
import {
  authorizeAsync,
  chooseMediaAsync,
  compressImageAsyncBatch,
  fetchImageThumbnailBatch,
} from '@/api/nativeApi';
import {
  initAiFilterData,
  selectImgCheckedList,
  selectImgConfigData,
  selectVideoCheckedList,
  updateImgCheckedList,
  updateVideoCheckedList,
  updateImgCheckedListMap,
} from '@/redux/modules/imgSlice';
import { getResolution } from '@/utils/getResolution';
import TopBar from '@/components/TopBar';
import { emptyIcon } from '@/res/iconsvg';
import styles from './index.module.less';

type ImgType = {
  url: string;
  type: 'image' | 'video';
  duration: number;
};

export function SelectImage() {
  const dispatch = useAppDispatch();
  const [showSelect, { setFalse: setSelectFalse, setTrue: setSelectTrue }] = useBoolean(false);
  const isInitialized = useSelector(selectIsInitialized);
  const photos = useSelector(selectPhotos);

  const { devInfo } = useDevice();
  const imgCheckedList = useSelector(selectImgCheckedList);
  const videoCheckedList = useSelector(selectVideoCheckedList);

  const { skill } = useSelector(selectImgConfigData);

  const maxImageNum = 20;

  // 从手机获取图片时 需要传入当前分辨率进行转换
  const { resolution = '' } = skill || {};
  const currentVideo = React.useRef(null);

  useEffect(() => {
    // 拉取滤镜类型数据
    getAiFilterTemplates()
      .then(res => {
        console.log('~ getAiFilterTemplateData res ~', res);
        const tempRes = {};
        res.forEach(item => {
          tempRes[item.style] = item.templates;
        });
        console.log('~ getAiFilterTemplateData tempRes ~', tempRes);

        dispatch(initAiFilterData(tempRes));
      })
      .catch(err => {
        console.log('~ getAiFilterTemplateData ~', err);
      });
  }, []);

  const handleSelect = React.useCallback(
    (evt: SmartTouchEvent<SelectData>) => {
      const detail: Partial<SelectData> = evt.detail ?? {};
      if (detail.activeType === 'video') {
        currentVideo.current = detail.id - 1;
        return;
      }

      const offset = 1;
      const { activeMap } = detail;
      const _imgCheckedList = Object.keys(activeMap).map(i => {
        const current = photos[Number(i) - offset];
        // eslint-disable-next-line no-self-compare
        if (+i !== +i) {
          throw new Error('the id of img must be number');
        }
        if (!current) {
          console.error('current?.tempFilePath is null');
        }
        const { fileFullName } = getFileNameAndExtension(current?.tempFilePath || '') || {};
        return {
          id: i, // 图片id
          src: current?.tempFilePath, // 图片路径
          originUrl: current?.originUrl,
          thumbnail: current?.thumbTempFilePath,
          fileName: fileFullName,
          fileType: current?.fileType,
          title: '', // 标题
        };
      });
      const _imgCheckedListPath = _imgCheckedList.map(d => d.src);
      fetchImageThumbnailBatch(_imgCheckedListPath, [])
        .then(res => {
          const _imgCheckedListRes = _imgCheckedList.map((d, index) => {
            return {
              ...d,
              thumbnail: (res[index] || '') as string,
            };
          });
          dispatch(updateImgCheckedList(_imgCheckedListRes));
        })
        .catch(err => {
          console.error('~ fetchImageThumbnailBatch ~', err);
        });
    },
    [photos]
  );

  const handleAdd = React.useCallback(
    (type: string) => {
      authorizeAsync({ scope: 'scope.writePhotosAlbum' })
        .then(() => {
          return chooseMediaAsync({
            count: type === 'image' ? MAX_CHOOSE_IMAGE_NUM : MAX_CHOOSE_VIDEO_NUM,
            mediaType: type,
            sourceType: ['album'],
            isFetchVideoFile: false,
            isGetAlbumFileName: true,
          });
        })
        .then(res => {
          showLoading({ title: Strings.getLang('loadingTip') });
          const newPhotos = res.tempFiles.map(d => ({
            ...d,
            fileType: d.fileType as 'image' | 'video',
          }));
          // 筛选出 newPhotos 与 photos 相同的照片
          const filterPhotos = newPhotos.filter(d =>
            photos.find(p => p.tempFilePath === d.tempFilePath || p.originUrl === d.tempFilePath)
          );
          if (filterPhotos?.length) {
            showToast({ title: Strings.getLang('samePhotoTip'), icon: 'none' });
          }
          const _newPhotos = newPhotos
            .filter(
              d =>
                !photos.find(
                  p => p.tempFilePath === d.tempFilePath || p.originUrl === d.tempFilePath
                )
            )
            .map(d => ({ ...d, originUrl: d.tempFilePath }));
          if (!_newPhotos?.length) {
            hideLoading();
            return;
          }
          if (type === 'image') {
            // 图片压缩
            const { width, height } = getResolution(resolution);
            const _newPhotosPath = _newPhotos.map(d => d.tempFilePath);
            compressImageAsyncBatch(_newPhotosPath, width, height)
              .then(res => {
                hideLoading();
                const { fileList = [] } = (res || {}) as { fileList: string[] };
                const _newPhotosRes = _newPhotos.map((d, index) => {
                  return {
                    ...d,
                    tempFilePath: fileList[index],
                  };
                });
                dispatch(addPhotosAsync(_newPhotosRes));

                // 处理默认选中，并弹窗
                const _imgCheckedList = _newPhotosRes.map((current, i) => {
                  const { fileFullName } =
                    getFileNameAndExtension(current?.tempFilePath || '') || {};
                  return {
                    id: i + 1, // 图片id
                    src: current?.tempFilePath, // 图片路径
                    originUrl: current?.originUrl,
                    thumbnail: current?.thumbTempFilePath,
                    fileName: fileFullName,
                    fileType: current?.fileType,
                    title: '', // 标题
                  };
                });
                const _imgCheckedListPath = _imgCheckedList.map(d => d.src);
                fetchImageThumbnailBatch(_imgCheckedListPath, [])
                  .then(res => {
                    const _imgCheckedListRes = _imgCheckedList.map((d, index) => {
                      return {
                        ...d,
                        thumbnail: (res[index] || '') as string,
                      };
                    });
                    dispatch(updateImgCheckedList(_imgCheckedListRes));
                  })
                  .catch(err => {
                    console.error('~ fetchImageThumbnailBatch ~', err);
                  });
              })
              .catch(err => {
                hideLoading();
                console.error('=== compressImageAsyncBatch err', err);
                showToast({ title: Strings.getLang('addImageError'), icon: 'none' });
              });
            return;
          }
          hideLoading();
          // 视频不做压缩
          dispatch(addPhotosAsync(_newPhotos));
        })
        .catch(err => {
          hideLoading();
          console.log('=== authorizeAsync or chooseMediaAsync err', err);
        });
    },
    [photos, resolution]
  );

  const handleSelectType = React.useCallback(
    evt => {
      const type = evt.detail?.type ?? 'image';
      dispatch(updateImgCheckedList([]));
      dispatch(updateVideoCheckedList([]));
      dispatch(updateImgCheckedListMap({}));
      handleAdd(type);
    },
    [photos, resolution]
  );

  const handleNextStep = React.useCallback(() => {
    if (imgCheckedList?.length === 0 && videoCheckedList?.length === 0) return;
    if (videoCheckedList?.length > 0) {
      router.push(`/video-edit?idx=${currentVideo.current}`);
      return;
    }
    router.push('/aiFilter');
  }, [imgCheckedList, videoCheckedList]);

  const isEmpty = photos?.length === 0;

  const photoList = useMemo<ImgType[]>(() => {
    return photos?.map((d, idx) => ({
      url: d.tempFilePath || `${idx + 1}`,
      thumbnail: d.thumbTempFilePath,
      duration: d.duration,
      originUrl: d.originalVideoPath || d.originUrl, // 原始路径
      type: d.fileType,
    }));
  }, [photos]);

  if (!devInfo) {
    return null;
  }

  const nextDisabled =
    videoCheckedList?.length > MAX_EDIT_VIDEO_NUM ||
    imgCheckedList?.length > maxImageNum ||
    (imgCheckedList?.length === 0 && videoCheckedList?.length === 0);

  const isDisableOtherImg = imgCheckedList?.length >= maxImageNum;
  return (
    <Layout active={null}>
      <TopBar />
      <View className={styles.header}>
        <Button
          customClass="dropdown-menu-album-button"
          type="info"
          disabled={nextDisabled}
          onClick={() => handleNextStep()}
          color={THEME_COLOR}
        >
          {imgCheckedList?.length > 0
            ? `${Strings.getLang('nextStep')} ${imgCheckedList?.length}/${maxImageNum}`
            : Strings.getLang('nextStep')}
        </Button>
      </View>
      {isInitialized && (
        <View className={styles.main} style={{ alignItems: isEmpty ? 'center' : 'flex-start' }}>
          {isEmpty ? (
            <View className={styles.emptyBox}>
              <Icon name={emptyIcon} size="200rpx" color="pink" customClass={styles.emptyImage} />
              <Button
                customClass="smart-empty__button"
                type="info"
                onClick={setSelectTrue}
                color={THEME_COLOR}
              >
                {Strings.getLang('addPhoto')}
              </Button>
            </View>
          ) : (
            <PhotoList
              isDisableOtherImg={isDisableOtherImg}
              maxCount={MAX_CHOOSE_IMAGE_NUM}
              dataSource={photoList}
              onSelect={handleSelect}
              onAdd={setSelectTrue}
            />
          )}
        </View>
      )}
      <ActionSheet
        show={showSelect}
        actions={[
          // @ts-ignore，TODO: 优化 typing
          { type: 'image', name: Strings.getLang('selectImg') },
          // @ts-ignore
          { type: 'video', name: Strings.getLang('selectVideo') },
        ]}
        onSelect={handleSelectType}
        onClose={setSelectFalse}
        onCancel={setSelectFalse}
      />
    </Layout>
  );
}

export default SelectImage;
