import React, { FC } from 'react';
import dayjs from 'dayjs';
import { View, Image } from '@ray-js/ray';
import { SwipeCell } from '@ray-js/smart-ui';
import { showToast } from '@/utils/ipc';
import Strings from '@/i18n';
// import { imgPlay } from '@/res';
import { RECORD_DATA_TYPE } from '@/constant';
import styles from './index.module.less';

const FILE_TYPE = {
  image: 'image',
  media: 'media',
};

interface IProps {
  type: number;
  data: Partial<any> & { time: number; desc: string };
  encryptionKey: string;
  onDelete: (no: string) => void;
  loadInstance: any;
}

const RecordItem: FC<IProps> = ({ type, data, encryptionKey, onDelete, loadInstance }) => {
  const { devId, recordTime, fileType, fileDisplay, videoCoverDisplay, videoPrefix, time, desc } =
    data;

  // 是否存在图片，fileType 类型不同判断的字段不同
  const hasImage =
    (fileType === FILE_TYPE.image && fileDisplay) ||
    (fileType === FILE_TYPE.media && videoCoverDisplay);

  const url = loadInstance.getImageData(
    fileType === FILE_TYPE.media ? videoCoverDisplay : fileDisplay
  )?.imageUrl;

  const handleClick = async () => {
    // 出粮记录无点击事件
    if (type === RECORD_DATA_TYPE.feedReport) {
      return;
    }

    // 宠物行为（检测、进食）跳转到ipc 视频消息播放页面，支持图片、视频，不同媒体类型传参不一样
    const nativeUrl = 'msg_media_play';
    let finaleUrl = `thingSmart://${nativeUrl}?devId=${devId}&msgTimeInterval=${
      recordTime / 1000
    }&msgTitle=${Strings.getLang('dsc_media_play_title')}&showDelete=${false}`;
    if (fileType === FILE_TYPE.media) {
      // 视频时，mediaUrl字段无用
      finaleUrl += `&type=${0}&prefix=${videoPrefix}&eventTime=${
        recordTime / 1000 // 毫秒转成秒
      }&mediaUrl=test&supportMultiFragments=${true}`;
    } else {
      finaleUrl += `&type=${2}&mediaUrl=${encodeURIComponent(fileDisplay)}`;
    }
    console.log('===finaleUrl==', finaleUrl);
    ty.canIUseRouter({
      url: nativeUrl,
      success: res => {
        if (res.result) {
          ty.router({
            url: finaleUrl,
            success: d => {
              console.log(d);
            },
            fail: e => {
              showToast();
              console.log(e);
            },
          });
        } else {
          showToast();
        }
      },
      fail: err => {
        console.log(err);
        showToast();
      },
    });
  };

  const handleDelete = () => {
    if (type === RECORD_DATA_TYPE.feedReport) {
      return;
    }
    onDelete(data.recordNo);
  };

  return (
    <SwipeCell
      rightWidth={65}
      disabled={type === RECORD_DATA_TYPE.feedReport}
      slot={{
        right: (
          <View className={styles.delete} onClick={handleDelete}>
            {Strings.getLang('delete')}
          </View>
        ),
      }}
    >
      <View className={styles.assistantItem} onClick={handleClick}>
        <View className={styles.time}>{dayjs(time).format('HH:mm')}</View>
        <View className={styles.detail}>
          <View className={styles.desc}>{desc}</View>
          <View className={styles.imageWrapper}>
            {hasImage ? (
              <Image
                key={`${type}-${time}`}
                src={url}
                className={styles.img}
                style={{ width: '160rpx', height: '92rpx' }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </SwipeCell>
  );
};

export default RecordItem;
