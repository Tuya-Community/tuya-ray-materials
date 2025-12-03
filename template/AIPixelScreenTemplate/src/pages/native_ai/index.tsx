import React, { useState, useEffect } from 'react';
import Strings from '@/i18n';
import { View, Image, showToast, router } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { getCdnPath } from '@/utils/getCdnPath';
import LabelSelect from '@/components/LabelSelect';
import MessageList from '@/components/MessageList';
import { pixelImageInit, fetchPixelImageCategoryInfo, generationPixelImage } from '@/api/nativeApi';
import { useDevInfo } from '@ray-js/panel-sdk';
import globalStorage from '@/redux/storage';
import { globalLoading } from '@/utils';
import { MessageListProps } from '@/types';
import { useSelector, useStore } from 'react-redux';
import {
  selectMessageList,
  updateMessagesAsync,
  selectLabelData,
  updateLabelAsync,
  setHasModelInit,
  selectHasModelInit,
} from '@/redux/modules/messageSlice';
import { useAppDispatch } from '@/redux';
import { mockMessageList, mockLabelList } from '@/pages/native_ai/mock';
import styles from './index.module.less';

const emptyIcon = getCdnPath('images/empty_native.png');
const maxMessageCount = 50;

function NativeAI() {
  const devInfo = useDevInfo();
  const dispatch = useAppDispatch();
  const store = useStore();
  const messages = useSelector(selectMessageList);
  const labelData = useSelector(selectLabelData);
  // const messages = mockMessageList;
  // const labelData = mockLabelList;
  const hasModelInit = useSelector(selectHasModelInit);
  const [isLoading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(10000000);
  console.log('messageList from redux', messages, labelData);

  const initLabels = async () => {
    const labelInfo = await fetchPixelImageCategoryInfo({});
    console.log('pixelImageInit labelInfo', labelInfo);
    dispatch(updateLabelAsync(labelInfo));
  };

  const init = async () => {
    try {
      globalLoading.show('初始化中...', false);
      const isInit = await pixelImageInit({});
      dispatch(setHasModelInit(true));
      console.log('pixelImageInit isInit', isInit);
      initLabels();
      setTimeout(() => {
        globalLoading.hide();
      }, 500);
    } catch (error) {
      setTimeout(() => {
        globalLoading.hide();
      }, 500);
      console.log('pixelImageInit error', error);
    }
  };

  useEffect(() => {
    if (hasModelInit) {
      initLabels();
    } else {
      init();
    }
  }, []);

  const updateMessages = (newMessages: MessageListProps['messages']) => {
    // 如果消息数量超过最大限制，裁剪到最大数量
    const finalMessages =
      newMessages.length > maxMessageCount
        ? newMessages.slice(newMessages.length - maxMessageCount)
        : newMessages;

    dispatch(updateMessagesAsync(finalMessages));
  };

  const handleSelectLabel = async (label, isRegenerate = false) => {
    if (isLoading) {
      showToast({
        title: Strings.getLang('cannotClickDuringImageGeneration'),
        icon: 'none',
      });
      return;
    }
    try {
      const addMsg = [];
      const currentTime = Date.now();

      if (!isRegenerate) {
        addMsg.push({
          id: currentTime, // 使用时间戳确保唯一性
          role: 'user' as const,
          content: { text: Strings.getLang(label) },
          timestamp: currentTime,
        });
      }
      addMsg.push({
        id: currentTime + 1, // 确保assistant消息的ID不同
        role: 'assistant' as const,
        content: {
          text: 'image',
        },
        path: '',
        type: 'image' as const,
        isLoaded: false,
        label,
        timestamp: currentTime,
      });

      // 使用统一的消息更新函数
      const newMessageList = [...messages, ...addMsg];
      updateMessages(newMessageList);
      setLoading(true);

      // 只有当消息较多时才立即滚动到底部
      if (messages.length > 2) {
        setTimeout(() => {
          setScrollTop(prev => prev + 5000);
        }, 50);
      }
      const localPath = globalStorage.getLocalPath();
      console.log('localPath---', localPath);
      const imageResult = await generationPixelImage({
        deviceId: devInfo.devId,
        label,
        imageWidth: 462,
        imageHeight: 462,
        outImagePath: localPath,
      });
      handleGenerationImage(imageResult);
    } catch (error) {
      handleImageFail();
      setLoading(false);
    }
  };

  const handleGenerationImage = result => {
    console.log('generationPixelImage imageResult', result);
    if (result.success) {
      // 获取最新的消息状态
      const currentMessages = selectMessageList(store.getState());
      const newMsgList = currentMessages.slice();
      console.log('handleGenerationImage---', newMsgList);
      const lastMsg = newMsgList[newMsgList.length - 1];

      if (!lastMsg || lastMsg.isLoaded) {
        // 如果没有未加载的消息，不做处理
        return;
      }

      const updatedMessages = [
        ...newMsgList.slice(0, newMsgList.length - 1),
        {
          ...lastMsg,
          isLoaded: true,
          path: result?.imagePath || '',
          type: 'image' as const,
        },
      ];
      updateMessages(updatedMessages);
      setLoading(false);
    } else {
      handleImageFail();
      setLoading(false);
    }
  };

  const handleImageFail = () => {
    // 获取最新的消息状态
    const currentMessages = selectMessageList(store.getState());
    const newMsgList = currentMessages.slice();
    const lastMsg = newMsgList[newMsgList.length - 1];
    console.log('handleImageFail---', newMsgList, lastMsg);

    if (!lastMsg || lastMsg.isLoaded) {
      // 如果没有未加载的消息，不做处理
      return;
    }

    const updatedMessages = [
      ...newMsgList.slice(0, newMsgList.length - 1),
      {
        id: lastMsg.id,
        role: lastMsg.role,
        content: {
          text: Strings.getLang('imageGenerationFailedPleaseTryAgain'),
        },
        timestamp: Date.now() - 2000,
        type: 'text' as const,
        label: lastMsg.label,
      },
    ];
    console.log('handleImageFail updatedMessages', updatedMessages);
    updateMessages(updatedMessages);
  };

  useEffect(() => {
    // 当消息列表发生变化时，只有当消息较多时才滚动到底部
    // 使用 setTimeout 确保 DOM 更新完成后再滚动
    if (messages.length > 3) {
      // 当消息超过3条时才自动滚动到底部
      setTimeout(() => {
        setScrollTop(prev => prev + 10000);
      }, 100);
    }
  }, [messages]);

  const handleRegenerate = label => {
    handleSelectLabel(label, true);
  };

  return (
    <View className={styles.pageWrap}>
      <NavBar
        customClass={styles.navBar}
        title={Strings.getLang('aiDrawing')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <View className={styles.tips}>{Strings.getLang('ai_tips')}</View>

      <View className={styles.pageContainer}>
        <View className={styles.freeChatContainer}>
          {messages.length ? (
            <View className={styles.messageListContainer}>
              <MessageList
                messages={messages}
                scrollTop={scrollTop}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
              />
            </View>
          ) : (
            <View className={styles.emptyBox}>
              <Image className={styles.emptyImg} src={emptyIcon} mode="aspectFit" />
              <View className={styles.emptyText}>
                {Strings.getLang('clickOnTheTagsAndTheImageWillAppearImmediately')}
              </View>
            </View>
          )}
          <LabelSelect labelData={labelData} onSelect={handleSelectLabel} />
        </View>
      </View>
    </View>
  );
}

export default NativeAI;
