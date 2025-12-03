import React from 'react';
import { View, Text, ScrollView } from '@ray-js/ray';
import ImgCard from '@/components/ImgCard';
import { useDevInfo } from '@ray-js/panel-sdk';
import { MessageListProps } from '@/types';
import Strings from '@/i18n';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const imgBg = getCdnPath('images/imgBg3.gif');

const ImgCardBox = ({ message, devId }) => {
  const isLoading = !message.isLoaded;

  return (
    <View className={styles.imgCardBox}>
      {isLoading && (
        <View className={styles.loadingBox} style={{ backgroundImage: `url(${imgBg})` }}>
          <View className={styles.genIcon} />
          <Text className={styles.loadingText}>{Strings.getLang('imageGenerationInProgress')}</Text>
        </View>
      )}
      {!isLoading && <ImgCard cardData={message} devId={devId} />}
    </View>
  );
};

function MessageList(props: MessageListProps) {
  const { messages, onRegenerate, scrollTop, isLoading } = props;
  const devInfo = useDevInfo();

  const lastImageMsgIndex = messages
    .map((msg, index) => (msg.type === 'image' ? index : -1))
    .filter(index => index !== -1)
    .pop();
  return (
    <View className={styles.messageListWrapper}>
      {/* 消息列表 */}
      <ScrollView
        className={styles.messageList}
        scrollY
        scrollTop={scrollTop || 10000000}
        scrollWithAnimation={false}
      >
        <View className={styles.listBox}>
          {props.messages.map((msg, index) => {
            return (
              <View
                key={msg.id}
                className={`${styles.messageItem} ${
                  msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                } ${lastImageMsgIndex === index ? styles.lastImageMessage : ''}`}
              >
                <View className={styles.messageContent}>
                  <View className={styles.messageBubble}>
                    {msg.type === 'image' ? (
                      <ImgCardBox message={msg} devId={devInfo.devId} />
                    ) : (
                      <Text className={styles.messageText}>{msg.content.text}</Text>
                    )}
                  </View>
                  {lastImageMsgIndex === index && (
                    <View className={styles.actionBar}>
                      <View
                        className={`${styles.regenerate} ${isLoading ? styles.loading : ''}`}
                        onClick={() => onRegenerate(msg.label)}
                      >
                        <View className={styles.messageArrow} />
                        <View className={styles.action}>{Strings.getLang('regenerate')}</View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default MessageList;
