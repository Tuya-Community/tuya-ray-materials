import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { hideLoading, Image, router, showLoading, showToast, Text, View } from '@ray-js/ray';
import { clearingContext, clearingHistoryRecord } from '@/api';
import { TopBar } from '@/components';
import PickerItem from '@/components/PickerItem';
import Strings from '@/i18n';
import { selectAgentInfo } from '@/redux/modules/agentInfoSlice';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { imgAILogo } from '@/res';
import { emitter } from '@/utils';
import styles from './index.module.less';

const AIAgentEdit: FC = () => {
  const { name = '', introduce = '', id = 0, logoUrl, isMain } = useSelector(selectSingleAgent);
  const agentInfo = useSelector(selectAgentInfo);
  const { voiceName = '' } = agentInfo;

  const goToVoicePage = () => {
    router.push(`/voiceSquare`);
  };

  const handleClearingContext = () => {
    showLoading({
      title: '',
    });
    clearingContext(id)
      .then(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_clearing_success'),
          icon: 'success',
        });
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_clearing_fail'),
          icon: 'error',
        });
      });
  };

  const handleClearingHistoryRecord = () => {
    showLoading({
      title: '',
    });
    clearingHistoryRecord(id)
      .then(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_clearing_success'),
          icon: 'success',
        });
        emitter.emit('refreshHistoryData', '');
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_clearing_fail'),
          icon: 'error',
        });
      });
  };

  return (
    <View className={styles.view}>
      <TopBar title={Strings.getLang('dsc_agent_edit')} backgroundColor="#daecf6" />
      <View className={styles.content}>
        <View className={styles.logoBox}>
          <Image
            src={logoUrl === '' ? imgAILogo : logoUrl}
            className={styles.logo}
            style={{ left: isMain === 1 ? '3rpx' : '0' }}
          />
          <View
            className={styles.circle}
            style={{
              backgroundColor: isMain === 1 ? '#FFFFFF' : '#2357F6',
            }}
          />
        </View>
        <View className={styles.textBox}>
          <Text className={styles.aiName}>{name}</Text>
          <Text className={styles.aiIntroduce}>{introduce}</Text>
        </View>
        <PickerItem
          width="620rpx"
          height="108rpx"
          title={Strings.getLang('dsc_voice')}
          innerContainerStyle={{ padding: '32rpx' }}
          isDiySubTitle={false}
          subTitle={voiceName}
          outerContainerStyle={{ borderRadius: '32rpx 32rpx 32rpx 32rpx', marginBottom: '24rpx' }}
          onClick={goToVoicePage}
        />
        <View
          className={styles.btn}
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={handleClearingContext}
        >
          <Text className={styles.btnText} style={{ color: '#427FF7' }}>
            {Strings.getLang('dsc_clearing_context')}
          </Text>
        </View>
      </View>
      <View
        className={styles.btn}
        style={{
          backgroundColor: 'rgba(240, 76, 76, 0.1)',
          marginBottom: '60rpx',
        }}
        onClick={handleClearingHistoryRecord}
      >
        <Text className={styles.btnText} style={{ color: '#F04C4C' }}>
          {Strings.getLang('dsc_delete_chat_history')}
        </Text>
      </View>
    </View>
  );
};

export default AIAgentEdit;
