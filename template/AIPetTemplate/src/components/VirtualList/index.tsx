/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';
import { Loading, Grid } from '@ray-js/smart-ui';
import { ScrollView, View, Text } from '@ray-js/ray';
import { getSystemInfoResult } from '@/utils/systemInfo';
import RecycleView from '@/components/Recycleview';
import { fetchImageThumbnailBatch } from '@/api/nativeApi';
import { chunkArray } from '@/utils/historyFun';
import Strings from '@/i18n';
import styles from './index.module.less';

type PageDeviceType = {
  current: number;
  page: number;
};

type ImgType = {
  url: string;
  thumbnail: string; // 缩略图
  originUrl?: string; // 原始路径
  type: 'image' | 'video';
  duration: number;
};

type TProps = {
  containerHeight: number;
  gradProps?: any; // Grid 组件属性，可配置每行显示几个
  list: any[];
  className?: string;
  itemHeight: number;
  childrenProps: any;
  children: React.ReactNode;
};

const VirtualList = (props: TProps) => {
  const { windowWidth } = getSystemInfoResult();
  const {
    gradProps = {},
    containerHeight = 667,
    itemHeight,
    list,
    children,
    childrenProps,
    className,
  } = props;
  const realItemHeight = (windowWidth / 375) * itemHeight;
  const Component = children;
  const { columnNum = 1 } = gradProps;

  const [sourceData, setSourceData] = useState<ImgType[][]>([]);
  const [listDatas, setListDatas] = useState<ImgType[][]>([]);
  const setListDatasCompose = (_list: ImgType[], isInit = false, index = 0) => {
    if (isInit) {
      setListDatas([_list]);
      return;
    }
    const _listDatas = [...listDatas];
    _listDatas[index] = _list;
    setListDatas(_listDatas);
  };
  const photos = list;
  const setThumbnailListDatas = (fileList: ImgType[] = [], isInit = false, index = 0) => {
    const urlList = fileList.map(i => i.url).filter(i => i && i.length >= 3);
    const fileRealListLen = fileList.filter(i => i.url && i.url.length < 3)?.length || 0;
    const videoIndexList = fileList
      .filter(i => i.url && i.url.length >= 3)
      .map((i, idx) => {
        if (i.type === 'video') {
          return idx;
        }
        return -1;
      })
      .filter(i => i !== -1);
    fetchImageThumbnailBatch(urlList, videoIndexList)
      .then(res => {
        const newRes = fileList.map((i, idx) => {
          return {
            ...i,
            thumbnail:
              i.type === 'video' ? i.thumbnail : ((res[idx - fileRealListLen] || '') as string),
          };
        });
        setListDatasCompose(newRes, isInit, index);
      })
      .catch(err => {
        console.log('=== setThumbnailListDatas err', err);
      });
  };

  const rowNum = Math.ceil(containerHeight / realItemHeight);
  // 获取分页器
  const PageDevice = useRef<PageDeviceType>({
    current: 0,
    page: rowNum * columnNum,
  });

  // 进行拼接程列表渲染数据
  useEffect(() => {
    // 图片数量有变化 说明需要删除或者新增，重置分页器
    PageDevice.current = {
      current: 0,
      page: rowNum * columnNum,
    };
    const result = chunkArray(photos, PageDevice.current.page);
    setSourceData(result);
    if (result.length > 0) {
      const isInit = true;
      setThumbnailListDatas(result[0], isInit);
      PageDevice.current.current++;
    }
  }, [photos]);

  const getItemView = (item: ImgType, idx: number) => {
    return <Component d={item} key={item.url} idx={idx} {...childrenProps} />;
  };

  const _getMoreList = () => {
    if (PageDevice.current.current < sourceData.length) {
      listDatas[listDatas.length] = sourceData[PageDevice.current.current];
      setThumbnailListDatas(
        sourceData[PageDevice.current.current],
        false,
        PageDevice.current.current
      );
      PageDevice.current.current++;
    }
  };

  const onLower = () => {
    // 加载更多
    _getMoreList();
  };

  const loadingRender = () => {
    if (listDatas.length === 0) {
      return null;
    }
    if (PageDevice.current.current >= sourceData.length - 1) {
      return null;
    }

    return (
      <View className={styles.loadingWrapper}>
        <Loading size="24rpx" type="spinner" color="#FFD974">
          <Text style={{ fontSize: '24rpx', color: '#cccccc' }}>
            {Strings.getLang('loadingTip')}
          </Text>
        </Loading>
      </View>
    );
  };

  const bottomEndRender = () => {
    if (listDatas.length === 0) {
      return null;
    }
    if (PageDevice.current.current < sourceData.length) {
      return null;
    }
    return (
      <View className={styles.bottomEndWrapper}>
        <Text style={{ fontSize: '24rpx', color: '#cccccc' }}>{Strings.getLang('endTip')}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ height: `calc(100vh - 123px)` }}
      scrollY
      className={className}
      refresherTriggered={false}
      onScrollToLower={onLower}
    >
      <Grid
        {...gradProps}
        className={listDatas?.length >= 2 ? styles.gridWrapper : styles.gridWrapperLimit}
      >
        {listDatas.map((item, index) => {
          const key = item.map(i => i.url.slice(-8).slice(0, 5)).join('-');
          return (
            <RecycleView key={key} chunkId={`_chunk_id_${index}`} showLogInfo>
              {item.map((i, idx) => {
                return getItemView(i, index * PageDevice.current.page + idx);
              })}
            </RecycleView>
          );
        })}
      </Grid>
      {loadingRender()}
      {bottomEndRender()}
    </ScrollView>
  );
};
export default VirtualList;
