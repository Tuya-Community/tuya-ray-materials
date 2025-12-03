import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import {
  View,
  router,
  Image,
  MovableArea,
  MovableView,
  saveImageToPhotosAlbum,
  hideMenuButton,
} from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { selectPhotos } from '@/redux/modules/albumSlice';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { updateCropedFile } from '@/redux/modules/otherSlice';
import Strings from '@/i18n';
import { getImageInfoAsync, cropImageAsync } from '@/api/nativeApi';
import { getDeviceRealPx, readFileBase64 } from '@/utils';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const unionTopIcon = getCdnPath('images/union-top.png');
const unionBottomIcon = getCdnPath('images/union-bottom.png');

type CropImageList = {
  filePath?: string; //
  topLeftX: number; // 左上角坐标X
  topLeftY: number; // 左上角坐标Y
  bottomRightX: number; // 右下角坐标X
  bottomRightY: number; // 右下角坐标Y
}[];

// 判断图片在布局中的类型
enum ImgLayoutType {
  // 完全包裹在布局中
  All_IN,
  // 宽度包裹在布局中，高度超过布局高度
  WIDTH_IN,
  // 高度包裹在布局中，宽度超过布局宽度
  HEIGHT_IN,
  // 宽高都超过布局宽高
  BOTH_OUT,
}

export type ImgItem = {
  path: string; // 图片路径
  md5: string; // 图片md5
  width?: number; // 宽度
  height?: number; // 高度
  realWidth?: number; // 图片真实宽度
  realHeight?: number; // 图片真实高度
  scale?: number; // 缩放比例
  xOffset?: number; // x轴偏移量
  yOffset?: number; // y轴偏移量
  layoutType?: number; // 布局类型
};

export function Cropping(props) {
  const dispatch = useAppDispatch();
  const photos = useSelector(selectPhotos);
  const pixelRatio = useSelector(selectSystemInfoByKey('pixelRatio'));

  const getReal300 = useCallback(() => {
    return getDeviceRealPx(300);
  }, []);

  const real300 = getReal300();
  const deviceWidth = real300 * pixelRatio;
  const deviceHeight = real300 * pixelRatio;

  const [imgInfo, setImgInfo] = useState({
    width: 400,
    height: 400,
    path: '',
    md5: 'md50',
    xOffset: 0,
    yOffset: 0,
  } as any);

  // 判断图片在布局中的类型
  const checkImgLayoutType = (
    imgInfo: { width: number; height: number },
    wrapperInfo: { width: number; height: number }
  ): ImgLayoutType => {
    if (imgInfo.width > wrapperInfo.width && imgInfo.height > wrapperInfo.height) {
      return ImgLayoutType.BOTH_OUT;
    }
    if (imgInfo.width <= wrapperInfo.width && imgInfo.height > wrapperInfo.height) {
      return ImgLayoutType.WIDTH_IN;
    }
    if (imgInfo.width > wrapperInfo.width && imgInfo.height <= wrapperInfo.height) {
      return ImgLayoutType.HEIGHT_IN;
    }
    return ImgLayoutType.All_IN;
  };

  const moveDirection = useMemo(() => {
    const { layoutType } = imgInfo;
    if (layoutType === ImgLayoutType.WIDTH_IN) {
      return `vertical`;
    }
    if (layoutType === ImgLayoutType.HEIGHT_IN) {
      return `horizontal`;
    }
    if (layoutType === ImgLayoutType.All_IN) {
      const imgWidth = Math.ceil(imgInfo?.width / pixelRatio);
      const imgHeight = Math.ceil(imgInfo?.height / pixelRatio);
      const contentWidth = Math.floor(deviceWidth / pixelRatio);
      const contentHeight = Math.floor(deviceHeight / pixelRatio);
      if (imgWidth <= contentWidth && imgHeight >= contentHeight) {
        return `vertical`;
      }
      if (imgWidth >= contentWidth && imgHeight <= contentHeight) {
        return `horizontal`;
      }
    }
    return `all`;
  }, [imgInfo]);

  const calculateScale = (imgSize, deviceSize) => {
    return deviceSize / imgSize;
  };

  const getImgLayoutInfo = res => {
    const layoutType = checkImgLayoutType(res, { width: deviceWidth, height: deviceHeight });
    if (layoutType === ImgLayoutType.All_IN) {
      const wScale = calculateScale(res.width, deviceWidth);
      const hScale = calculateScale(res.height, deviceHeight);
      const scale = res.height >= res.width ? hScale : wScale;
      const showWidth = res.width * scale;
      const showHeight = res.height * scale;
      return {
        ...imgInfo,
        ...res,
        realWidth: res.width,
        realHeight: res.height,
        width: showWidth,
        height: showHeight,
        scale,
        layoutType,
        xOffset: 0,
        yOffset: 0,
      };
    }
    return {
      ...imgInfo,
      ...res,
      scale: 1,
      layoutType,
      xOffset: 0,
      yOffset: 0,
    };
  };

  useEffect(() => {
    hideMenuButton();
  }, []);

  useEffect(() => {
    const { md5 } = props.location.query;
    if (md5) {
      const photo = photos.find(item => item.md5 === md5) || { path: '' };
      getImageInfoAsync({
        src: photo.path,
      }).then(res => {
        const info = getImgLayoutInfo({
          ...photo,
          width: res.width,
          height: res.height,
          md5,
          xOffset: 0,
          yOffset: 0,
        });
        setImgInfo(info);
      });
    }
    // const res = {
    //   width: 400,
    //   height: 225,
    //   path: testGif,
    //   md5: 'md50',
    //   xOffset: 0,
    //   yOffset: 0,
    // };
    // const info = getImgLayoutInfo(res);
    // setImgInfo(info);
  }, [props]);

  // 获取裁剪区域位置坐标
  const getCropSize = (
    i: ImgItem
  ): {
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
    filePath: string;
    format: number;
    outputImageWidth: number;
    outputImageHeight: number;
    rotate: number;
  } => {
    const realWidth = i.realWidth || i.width;
    const realHeight = i.realHeight || i.height;
    let width32 = 0;
    let height32 = 0;
    let topLeftX = 0;
    let topLeftY = 0;
    if (i.layoutType === ImgLayoutType.All_IN) {
      width32 = realWidth;
      height32 = realHeight;
      topLeftX = Math.ceil((Math.abs(i.xOffset) * pixelRatio) / i.scale);
      topLeftY = Math.ceil((Math.abs(i.yOffset) * pixelRatio) / i.scale);
      const imgWidth = Math.ceil(i?.width / pixelRatio);
      const imgHeight = Math.ceil(i?.height / pixelRatio);
      const contentWidth = Math.floor(deviceWidth / pixelRatio);
      const contentHeight = Math.floor(deviceHeight / pixelRatio);
      if (imgWidth <= contentWidth && imgHeight >= contentHeight) {
        topLeftX = (realWidth - width32) / 2;
      }
      if (imgWidth >= contentWidth && imgHeight <= contentHeight) {
        topLeftY = (realHeight - height32) / 2;
      }
    }
    if (i.layoutType === ImgLayoutType.WIDTH_IN) {
      width32 = realWidth;
      height32 = deviceHeight;
      topLeftX = (realWidth - width32) / 2;
      topLeftY = Math.ceil(Math.abs(i.yOffset) * pixelRatio);
    }

    if (i.layoutType === ImgLayoutType.HEIGHT_IN) {
      width32 = deviceWidth;
      height32 = realHeight;
      topLeftX = Math.ceil(Math.abs(i.xOffset) * pixelRatio);
      topLeftY = (realHeight - height32) / 2;
    }

    if (i.layoutType === ImgLayoutType.BOTH_OUT) {
      width32 = deviceWidth;
      height32 = deviceHeight;
      topLeftX = Math.ceil(Math.abs(i.xOffset) * pixelRatio);
      topLeftY = Math.ceil(Math.abs(i.yOffset) * pixelRatio);
    }

    let bottomRightX = topLeftX + width32;
    let bottomRightY = topLeftY + height32;
    if (bottomRightX > realWidth) {
      topLeftX = realWidth - width32;
      bottomRightX = realWidth;
    }
    if (bottomRightY > realHeight) {
      topLeftY = realHeight - height32;
      bottomRightY = realHeight;
    }
    const isGIF = i.path.endsWith('.gif');
    return {
      filePath: i.path,
      topLeftX: topLeftX || 0,
      topLeftY: topLeftY || 0,
      bottomRightX: bottomRightX || realWidth,
      bottomRightY: bottomRightY || realHeight,
      format: isGIF ? 2 : 1, // 0: jpg, 1: png, 2: gif
      outputImageWidth: 32,
      outputImageHeight: 32,
      rotate: 0,
    };
  };

  // 保存到相册 本地调试使用
  const saveImageToPhotosAlbumAsync = cropedFileList => {
    cropedFileList.forEach(item => {
      saveImageToPhotosAlbum({
        filePath: item,
        success: res => {
          console.log('saveImageToPhotosAlbum', res);
        },
        fail: err => {
          console.log('saveImageToPhotosAlbum', err);
        },
      });
    });
  };

  const handleCrop = useCallback((params: { cropFileList: CropImageList }) => {
    return cropImageAsync(params as any)
      .then(res => {
        return res;
      })
      .catch(err => {
        console.warn('🚀 ~ handleCrop ~ err', err);
      });
  }, []);

  const save = () => {
    const data = getCropSize(imgInfo);
    console.log('🚀 ~ getCropSize ~ data', data);
    const cropParams = {
      cropFileList: [data],
    };
    handleCrop(cropParams).then(cropRes => {
      const { fileList: cropedFileList } = cropRes;
      // 保存到相册 本地调试使用
      // saveImageToPhotosAlbumAsync(cropedFileList);
      const tempFilePath = cropedFileList[0];
      const base64Data = readFileBase64(tempFilePath);
      const base64DataStr = imgInfo.path.endsWith('.gif')
        ? `data:image/gif;base64,${base64Data}`
        : `data:image/png;base64,${base64Data}`;
      dispatch(updateCropedFile(base64DataStr));
      router.push('/img-pixelation');
    });
  };

  const curPos = useRef({ x: 0, y: 0 });

  const handleTouchEnd = e => {
    const { x, y } = curPos.current;
    setImgInfo({
      ...imgInfo,
      xOffset: x,
      yOffset: y,
    });
  };
  const handleMove = e => {
    curPos.current = { x: e.detail.x, y: e.detail.y };
  };

  return (
    <View className={styles.pageWrap}>
      <NavBar
        customClass={styles.navBar}
        title={Strings.getLang('crop')}
        leftArrow
        onClickLeft={() => router.back()}
        rightText={Strings.getLang('save')}
        rightTextColor="#0D84FF"
        onClickRight={save}
      />
      <View className={styles.container}>
        <View
          id="editImgPreview"
          className={styles.editImgPreviewWrapper}
          onTouchEnd={handleTouchEnd}
        >
          <MovableArea
            className={styles.movableArea}
            style={{ height: `${real300}px`, width: `${real300}px` }}
          >
            <MovableView
              className={styles.movableView}
              style={{
                width: `${Math.ceil(imgInfo?.width / pixelRatio)}px`,
                height: `${Math.ceil(imgInfo?.height / pixelRatio)}px`,
              }}
              animation={false}
              direction={moveDirection}
              x={
                moveDirection === 'vertical'
                  ? (real300 - Math.ceil(imgInfo?.width / pixelRatio)) / 2
                  : imgInfo?.xOffset
              }
              y={
                moveDirection === 'horizontal'
                  ? (real300 - Math.ceil(imgInfo?.height / pixelRatio)) / 2
                  : imgInfo?.yOffset
              }
              onChange={handleMove}
            >
              <Image id="editImg" className={styles.editImg} src={imgInfo.path} mode="aspectFill" />
            </MovableView>
          </MovableArea>
          <View
            id="editImgMask"
            className={styles.editImgMask}
            style={{ height: `${real300}px`, width: `${real300}px` }}
          >
            <Image className={styles.unionTop} src={unionTopIcon} mode="aspectFill" />
            <Image className={styles.unionBottom} src={unionBottomIcon} mode="aspectFill" />
          </View>
        </View>
      </View>
    </View>
  );
}

export default Cropping;
