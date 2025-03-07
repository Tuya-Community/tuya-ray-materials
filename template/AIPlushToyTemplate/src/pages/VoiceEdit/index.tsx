import React, { FC, useState } from 'react';
import {
  View,
  Image,
  Text,
  location,
  router,
  hideLoading,
  showToast,
  showLoading,
} from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { imgPencilIcon, imgVoicePlayIcon } from '@/res';
import { TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import DialogConfirm from '@/components/DialogConfirm';
import { emitter } from '@/utils';
import DialogInput from '@/components/DialogInput';
import { selectAgentInfo, updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { updateCloneInfo } from '@/redux/modules/cloneInfoSlice';
import { editAgentInfo, getAgentInfo, renameCloneVoice, deleteCloneVoice } from '@/api';

import { AgentInfo } from '@/types';
import store from '../../redux';
import SliderValueItem from './SliderValueItem';
import styles from './index.module.less';

interface RouterSource {
  remainTimes: string;
}

const VoiceEdit: FC = () => {
  const { dispatch } = store;
  const routerSource = location.query as RouterSource;
  const { remainTimes } = routerSource;

  const agentInfo = useSelector(selectAgentInfo);
  const {
    voiceId = '',
    voiceName = '',
    lang = 'zh',
    speed = 33,
    tone = 33,
    endpointAgentId,
  } = agentInfo;

  const [isShowDialog, setIsShowDialog] = useState(false);

  const [nameText, setNameText] = useState(voiceName);
  const [isShowTextInput, setIsShowTextInput] = useState(false);

  const handleDeleteClone = () => {
    showLoading({
      title: '',
    });
    deleteCloneVoice(voiceId)
      .then(async () => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_delete_success'),
          icon: 'success',
        });
        const agentInfo = (await getAgentInfo(Number(endpointAgentId))) as AgentInfo;
        dispatch(updateAgentInfo({ ...agentInfo, endpointAgentId: Number(endpointAgentId) }));
        emitter.emit('refreshVoiceData', '');
        setTimeout(() => {
          router.back();
        }, 300);
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_delete_fail'),
          icon: 'error',
        });
      });
  };

  const onChangeToneOrSpeed = (typeKey: 'speed' | 'tone', value: number) => {
    showLoading({
      title: '',
    });
    const editObj = {
      voiceId: agentInfo?.voiceId,
      speed: agentInfo?.speed,
      tone: agentInfo?.tone,
      keepChat: agentInfo?.keepChat,
      isMain: agentInfo?.isMain ? 1 : 0,
    };
    editAgentInfo({ ...editObj, [typeKey]: value, endpointAgentId })
      .then(async () => {
        setTimeout(async () => {
          const agentInfo = (await getAgentInfo(Number(endpointAgentId))) as AgentInfo;
          dispatch(updateAgentInfo({ ...agentInfo, endpointAgentId: Number(endpointAgentId) }));
        }, 300);
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_edit_success'),
          icon: 'success',
        });
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_edit_fail'),
          icon: 'error',
        });
      });
  };

  const deleteClone = () => {
    setIsShowDialog(true);
  };

  const editCloneName = (text: string) => {
    showLoading({
      title: '',
    });
    renameCloneVoice(voiceId, text)
      .then(async res => {
        console.log('renameCloneVoice:::res', res);
        setTimeout(async () => {
          const agentInfo = (await getAgentInfo(Number(endpointAgentId))) as AgentInfo;
          dispatch(updateAgentInfo({ ...agentInfo, endpointAgentId: Number(endpointAgentId) }));
        }, 300);

        hideLoading();
        setNameText(text);
        showToast({
          title: Strings.getLang('dsc_edit_success'),
          icon: 'success',
        });
        emitter.emit('refreshVoiceData', '');
      })
      .catch(err => {
        console.log('renameCloneVoice:::err', err);
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_edit_fail'),
          icon: 'error',
        });
      });
  };

  const editClone = () => {
    router.push(`/cloneSetting?remainTimes=${remainTimes}`);
    dispatch(updateCloneInfo({ voiceId, lang }));
  };

  return (
    <View className={styles.view}>
      <TopBar title={Strings.getLang('dsc_edit')} backgroundColor="#daecf6" />

      <View className={styles.content}>
        <View className={styles.logoBox}>
          <Image src={imgVoicePlayIcon} className={styles.logo} />
        </View>
        <View className={styles.textBox}>
          <Text className={styles.aiName}>{nameText}</Text>
          {remainTimes !== 'undefined' && (
            <View className={styles.pencilBtn}>
              <TouchableOpacity onClick={() => setIsShowTextInput(true)}>
                <Image src={imgPencilIcon} className={styles.pencilIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className={styles.sliderBox}>
          <SliderValueItem
            title={Strings.getLang('dsc_tone')}
            defaultValue={tone}
            onValueChange={(value: number) => {
              onChangeToneOrSpeed('tone', value);
            }}
          />
          <SliderValueItem
            title={Strings.getLang('dsc_speech_rate')}
            defaultValue={speed}
            onValueChange={(value: number) => {
              onChangeToneOrSpeed('speed', value);
            }}
          />
        </View>
        {remainTimes !== 'undefined' && (
          <TouchableOpacity
            className={styles.btn}
            style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
            onClick={editClone}
          >
            <Text className={styles.btnText} style={{ color: '#427FF7' }}>
              {Strings.getLang('dsc_reset_voice')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {remainTimes !== 'undefined' && (
        <View className={styles.bottomContent}>
          <TouchableOpacity
            className={styles.btn}
            style={{
              backgroundColor: 'rgba(240, 76, 76, 0.1)',
              marginBottom: '60rpx',
            }}
            onClick={deleteClone}
          >
            <Text className={styles.btnText} style={{ color: '#F04C4C' }}>
              {Strings.getLang('dsc_delete_voice')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <DialogConfirm
        visible={isShowDialog}
        title={Strings.getLang('dsc_attention')}
        subTitle={Strings.getLang('dsc_delete_clone_tips')}
        onConfirm={handleDeleteClone}
        onClose={() => setIsShowDialog(false)}
      />
      <DialogInput
        defaultValue={nameText}
        onChange={editCloneName}
        visible={isShowTextInput}
        onClose={() => setIsShowTextInput(false)}
      />
    </View>
  );
};

export default VoiceEdit;
