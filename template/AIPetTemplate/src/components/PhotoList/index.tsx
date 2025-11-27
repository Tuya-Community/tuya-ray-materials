import React, { useMemo } from 'react';
import { showToast, router } from '@ray-js/ray';
import VirtualList from '@/components/VirtualList';
import { getSystemInfoResult } from '@/utils/systemInfo';
import { useDispatch, useSelector } from 'react-redux';
import Strings from '@/i18n';
import { selectVideoCheckedList, updateVideoCheckedList } from '@/redux/modules/imgSlice';
import { Props } from './index.type';
import PhotoItem from './PhotoItem';

export const PhotoList: React.FC<Props> = ({
  dataSource,
  maxCount,
  isDisableOtherImg,
  onSelect,
  onAdd,
}) => {
  const maxImageNum = maxCount || 10;
  const [activeVideo = -1] = useSelector(selectVideoCheckedList);
  const photos = useSelector((state: any) => state.album.photos);
  const imgCheckedList = useSelector((state: any) => state.imgInfo.imgCheckedList);

  const activeImageMap = useMemo(() => {
    return (imgCheckedList || []).reduce((map, item) => {
      map[item.id] = true;
      return map;
    }, {});
  }, [imgCheckedList]);

  const dispatch = useDispatch();
  const onClick = React.useCallback(
    evt => {
      evt?.origin?.stopPropagation();
      const onSelectEvt = { ...evt };
      const { id, type } = evt?.origin?.currentTarget?.dataset ?? {};
      if (typeof id === 'undefined') {
        return;
      }
      if (type === 'video') {
        // 选中的视频是同一个，取消选中，否则切换选中的视频
        const activeVideoIdx = activeVideo === id ? -1 : id;
        const value = activeVideoIdx !== -1;
        onSelectEvt.detail = {
          id,
          value,
          activeType: 'video',
          activeMap: activeImageMap,
          activeNum: value ? 1 : 0,
        };
        if (activeVideoIdx === -1) {
          dispatch(updateVideoCheckedList([]));
        } else {
          dispatch(updateVideoCheckedList([activeVideoIdx]));
        }
        typeof onSelect === 'function' && onSelect(onSelectEvt);
        return;
      }
      let newActiveImageNum: number;
      const newActiveImageMap = { ...activeImageMap };
      if (activeImageMap[id]) {
        delete newActiveImageMap[id];
        newActiveImageNum = Object.keys(newActiveImageMap).length;
        onSelectEvt.detail = {
          id,
          value: false,
          activeType: 'image',
          activeMap: newActiveImageMap,
          activeNum: newActiveImageNum,
        };
      } else {
        newActiveImageMap[id] = true;
        newActiveImageNum = Object.keys(newActiveImageMap).length;
        onSelectEvt.detail = {
          id,
          value: true,
          activeType: 'image',
          activeMap: newActiveImageMap,
          activeNum: newActiveImageNum,
        };
      }
      if (newActiveImageNum > maxImageNum) {
        showToast({ title: Strings.formatValue('selectImgMaxTip', maxImageNum), icon: 'error' });
        return;
      }
      typeof onSelect === 'function' && onSelect(onSelectEvt);
    },
    [activeVideo, activeImageMap, maxImageNum, photos]
  );

  const onPreview = React.useCallback(evt => {
    const { type, id } = evt?.origin?.currentTarget?.dataset ?? {};
    if (type === 'add') {
      typeof onAdd === 'function' && onAdd(id === 0 ? 'image' : 'video');
      return;
    }
    if (type === 'video') {
      router.push(`/video-select?idx=${id - 1}`);
      return;
    }
    router.push(`/img-preview?id=${id}`);
  }, []);

  const dataSourceWithAdd = React.useMemo(() => {
    return [{ type: 'add', url: '0', duration: 0 }, ...dataSource];
  }, [dataSource]);

  const { windowHeight } = getSystemInfoResult();
  return (
    <VirtualList
      gradProps={{
        columnNum: 3,
        gutter: 7,
        border: false,
        clickable: true,
      }}
      className="photo-list-wrapper"
      containerHeight={windowHeight - 125}
      list={dataSourceWithAdd}
      itemHeight={110}
      childrenProps={{
        activeImageMap,
        activeVideo,
        isDisableOtherImg,
        onClick,
        onPreview,
      }}
    >
      {PhotoItem}
    </VirtualList>
  );
};
