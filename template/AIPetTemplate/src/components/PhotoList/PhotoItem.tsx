import React from 'react';
import { Image, Text, View } from '@ray-js/ray';
import { Checkbox, GridItem } from '@ray-js/smart-ui';
import { utils } from '@ray-js/panel-sdk';
import './photoItem.less';
import { getCdnPath } from '@/utils';
import { THEME_COLOR } from '@/constant';

type TProps = {
  d: {
    url: string;
    originUrl: string; // 原始路径
    thumbnail: string;
    type: 'image' | 'video' | 'add';
    duration: number;
  };
  idx: number;
  fileSuccessMap: Record<string, boolean>;
  activeImageMap: Record<number, boolean>;
  activeVideo: number;
  isDisableOtherImg?: boolean;
  onClick: (d) => void;
  onPreview: (d) => void;
};

const PhotoItem = React.memo((props: TProps) => {
  const {
    d,
    idx,
    fileSuccessMap,
    isDisableOtherImg,
    activeImageMap,
    activeVideo,
    onClick,
    onPreview,
  } = props;

  const handleCheck = evt => {
    evt?.origin?.stopPropagation();
    onClick && onClick(evt);
  };

  const activeImageNum = React.useMemo(
    () => Object.keys(activeImageMap)?.length ?? 0,
    [activeImageMap]
  );
  if (!d) {
    return null;
  }

  const dataType = d.type;
  const isVideo = dataType === 'video';
  const successKey = d.originUrl;
  let disabled = false;
  // 如果是图片，那么在选中视频后，图片不可选
  if (dataType === 'image' && activeVideo !== -1) {
    disabled = true;
  }
  // 如果是视频，那么在选中图片后，视频不可选
  if (isVideo && activeImageNum > 0) {
    disabled = true;
  }
  const currentDisabled = isDisableOtherImg ? !activeImageMap[idx] : false;
  let children: React.ReactNode;
  if (dataType === 'add') {
    children = (
      <View className="grid-item-photo-list__add-box">
        <Image className="grid-item-photo-list__add-icon" src={getCdnPath('add_icon.png')} />
      </View>
    );
  } else {
    const [, m, s] = utils.parseSecond(d?.duration ?? 0);
    const durationTxt = [m, s].map(v => v.toString().padStart(2, '0')).join(':');
    children = (
      <>
        {dataType === 'video' && (
          <View className="grid-item-photo-list__duration">
            <Image src="/images/icon-play-mini.png" />
            <Text>{durationTxt}</Text>
          </View>
        )}
        <Image
          className="grid-item-photo-list__image"
          src={d?.thumbnail || d?.url}
          mode="aspectFill"
        />
        <View
          data-id={idx}
          data-type={dataType}
          data-prefix="checkbox"
          className="checkbox-wrapper"
          onClick={handleCheck}
        >
          <Checkbox
            customClass="grid-item-photo-list__checkbox"
            value={!!activeImageMap[idx] || activeVideo === idx}
            checkedColor={THEME_COLOR}
          />
        </View>
      </>
    );
  }
  const _disabled = disabled || currentDisabled;
  return (
    <GridItem
      key={d?.url}
      data-id={idx}
      data-type={dataType}
      customClass="grid-item-photo-list"
      contentClass="grid-item-photo-list__content"
      useSlot
    >
      <View
        data-id={idx}
        data-type={dataType}
        onClick={onPreview}
        style={{
          opacity: _disabled ? 0.4 : 1,
          pointerEvents: _disabled ? 'none' : 'inherit',
          width: '220rpx',
          height: '220rpx',
          overflow: 'hidden',
          borderRadius: '7px',
          position: 'relative',
        }}
      >
        {children}
      </View>
    </GridItem>
  );
});

export default PhotoItem;
