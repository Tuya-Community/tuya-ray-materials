import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  location,
  router,
  showLoading,
  hideLoading,
  showToast,
} from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { imgPencilIcon, imgVoicePlayIcon } from '@/res';
import { TopBar, TouchableOpacity } from '@/components';
import Strings from '@/i18n';
import DialogConfirm from '@/components/DialogConfirm';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import {
  deleteCloneVoice,
  renameCloneVoice,
  getAgentInfo,
  updateRole,
  getAIAgentRoleDetail,
  localResetToDefaultVoice,
} from '@/api/index_highway';
import { emitter, getTheme, iOSExtractErrorMessage } from '@/utils';
import DialogInput from '@/components/DialogInput';
import { selectAgentInfo, updateAgentInfo } from '@/redux/modules/agentInfoSlice';
import { AgentInfo } from '@/typings/api';
import { updateCloneInfo } from '@/redux/modules/cloneInfoSlice';
import styles from './index.module.less';
import store from '../../redux';
import SliderValueItem from './SliderValueItem';

interface RouterSource {
  remainTimes: string;
  lang: string;
}

const VoiceSetting: FC = () => {
  const { dispatch } = store;
  const routerSource = location.query as RouterSource;
  const { remainTimes, lang, voiceId, voiceName } = routerSource;
  const { platform } = useSelector(selectSystemInfo);

  const agentInfo = useSelector(selectAgentInfo);
  const { speed = 0, tone = 0 } = agentInfo;

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [themeColor, setThemeColor] = useState(getTheme());
  const [nameText, setNameText] = useState(voiceName);
  const [speedValue, setSpeedValue] = useState(remainTimes !== 'undefined' ? 33 : speed);
  const [toneValue, setToneValue] = useState(remainTimes !== 'undefined' ? 33 : tone);
  const [isShowTextInput, setIsShowTextInput] = useState(false);
  const { roleId } = useSelector(selectSingleAgent);
  const speedKey = 'speed';
  const toneKey = 'tone';

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
        const agentCloudInfo = (await getAgentInfo(Number(roleId))) as AgentInfo;
        updateAgentInfo({ ...agentCloudInfo, roleId });
        emitter.emit('refreshVoiceData', '');
        setTimeout(() => {
          router.back();
        }, 300);
      })
      .catch(error => {
        hideLoading();
        if (platform === 'android' && error?.innerError?.errorCode === '138903140') {
          showToast({
            title: error?.innerError?.errorMsg,
            icon: 'error',
          });
        } else if (platform === 'ios') {
          showToast({
            title: iOSExtractErrorMessage(error?.innerError?.errorMsg),
            icon: 'error',
          });
        } else {
          showToast({
            title: Strings.getLang('dsc_delete_fail'),
            icon: 'error',
          });
        }
      });
  };

  const onChangeToneOrSpeed = (sv: number, tv: number) => {
    showLoading({
      title: '',
    });
    updateRole({ roleId, [speedKey]: `${sv}`, [toneKey]: `${tv}` })
      .then(async res => {
        sv >= 0 && setSpeedValue(sv);
        tv >= 0 && setToneValue(tv);
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

  const onChangeToneOrSpeedReset = () => {
    showLoading({
      title: '',
    });
    localResetToDefaultVoice({ roleId })
      .then(async res => {
        const sv = res?.speed;
        const tv = res?.tone;
        sv >= 0 && setSpeedValue(sv);
        tv >= 0 && setToneValue(tv);
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

  const getAgentRoleDetail = async () => {
    getAIAgentRoleDetail(roleId)
      .then((res: any) => {
        setSpeedValue(res.speed);
        setToneValue(res.tone);
      })
      .catch(err => {
        console.log('getAIAgentRoleDetail::err::', err);
      });
  };

  useEffect(() => {
    getAgentRoleDetail();
  }, []);

  const editCloneName = (text: string) => {
    showLoading({
      title: '',
    });
    renameCloneVoice(voiceId, text)
      .then(async res => {
        setTimeout(async () => {
          const agentCloudInfo = (await getAgentInfo(Number(roleId))) as AgentInfo;
          updateAgentInfo({ ...agentCloudInfo, roleId });
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
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_edit_fail'),
          icon: 'error',
        });
      });
  };

  const editClone = () => {
    router.push(
      `/cloneVoice?remainTimes=${remainTimes}&cloneEntry=reset&lang=${lang}&voiceId=${voiceId}`
    );
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
            instanceId="dsc_speech_rate"
            title={Strings.getLang('dsc_speech_rate')}
            defaultValue={speedValue}
            onValueChange={(value: number) => {
              onChangeToneOrSpeed(value, toneValue);
            }}
          />
        </View>

        <TouchableOpacity
          className={`${styles.btn} ${styles.btnResetSetting}`}
          style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
          onClick={() => {
            onChangeToneOrSpeedReset();
          }}
        >
          <Text className={styles.btnText} style={{ color: themeColor }}>
            {Strings.getLang('dsc_reset_voice_setting')}
          </Text>
        </TouchableOpacity>
        {remainTimes !== 'undefined' && (
          <TouchableOpacity
            className={styles.btn}
            style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
            onClick={editClone}
          >
            <Text className={styles.btnText} style={{ color: themeColor }}>
              {Strings.getLang('dsc_reset_voice')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <DialogConfirm
        visible={isShowDialog}
        title={Strings.getLang('dsc_attention')}
        subTitle={Strings.getLang('dsc_delete_clone_tips')}
        onConfirm={handleDeleteClone}
        onClose={() => setIsShowDialog(false)}
      />
      <DialogInput
        title={Strings.getLang('dsc_name')}
        defaultValue={nameText}
        onChange={editCloneName}
        visible={isShowTextInput}
        onClose={() => setIsShowTextInput(false)}
        tipText={`${Strings.getLang('tip')} ${Strings.getLang('dsc_less_than_4')}`}
        maxLength={4}
      />
    </View>
  );
};

export default VoiceSetting;
