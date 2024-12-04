import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, View, Text, nativeDisabled } from '@ray-js/ray';
import { Divider, Popup } from '@ray-js/smart-ui';
import { StreamDataNotificationCenter } from '@ray-js/robot-data-stream';
import { decodeAiPicHDData } from '@ray-js/robot-protocol';
import Strings from '@/i18n';
import log4js from '@ray-js/log4js';

const useImgDialog = ({ waitTime = 3500 } = {}) => {
  const [show, setVisionImgDialogShow] = React.useState(false);
  // 用来配置定时
  const interval = useRef<any>(-1);
  const onClose = () => setVisionImgDialogShow(false);

  const [source, setImgSource] = useState('');

  const refId = useRef(0);

  useEffect(() => {
    const handleHDData = (str: string) => {
      if (refId.current !== 0) {
        // 解析AI 高清图图片, 转为base64/png
        const image = decodeAiPicHDData(str);

        log4js.info('receive data, and start to show', image.source);

        // 重置开关
        resetVisionImgTask();

        setImgSource(image.source);
        // 显示弹窗
        setVisionImgDialogShow(true);
      } else {
        // 数据报送已经超过了等待时间, 不做任何处理
        log4js.warn('receive data, but not in vision task');
      }
    };

    StreamDataNotificationCenter.on('receiveAIPicHDData', handleHDData);

    return () => {
      StreamDataNotificationCenter.off('receiveAIPicHDData', handleHDData);
    };
  }, []);

  const imgDialogElement = useMemo(() => {
    return (
      <Popup
        show={show}
        position="center"
        round
        safeAreaInsetBottom={false}
        customStyle={{ marginBottom: 0, backgroundColor: 'transparent' }}
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
        onClickOverlay={onClose}
        onClose={onClose}
      >
        <View style={{ background: '#fff' }}>
          <View
            style={{
              display: 'flex',
              height: '48px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{Strings.getLang('dsc_vision_data_hd_title')}</Text>
          </View>
          <Image src={source} />
          <Divider />
          <View
            style={{
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={onClose}
          >
            <Text>{Strings.getLang('dsc_confirm')}</Text>
          </View>
        </View>
      </Popup>
    );
  }, [show, source]);

  // 在展示弹窗的时候, 需要对<Webview />的手势进行启用和禁用
  useEffect(() => {
    nativeDisabled(show as any);
  }, [show]);

  const startVisionImgTask = () => {
    // 记录下开启的时间
    refId.current = new Date().getTime();
    ty.showLoading({
      title: Strings.getLang('dsc_vision_data_downloading'),
    });
    interval.current = setTimeout(() => {
      if (refId.current !== 0) {
        // 时间到后, 关闭
        ty.hideLoading();
        clearTimeout(interval.current);
        refId.current = 0;
        setTimeout(() => {
          ty.showToast({
            title: Strings.getLang('dsc_vision_data_downloading_timeout'),
            icon: 'warning',
          });
        }, 200);
      }
    }, waitTime);
  };

  const resetVisionImgTask = () => {
    refId.current = 0;
    ty.hideLoading();
    clearTimeout(interval.current);
  };

  return { imgDialogElement, startVisionImgTask };
};

export default useImgDialog;
