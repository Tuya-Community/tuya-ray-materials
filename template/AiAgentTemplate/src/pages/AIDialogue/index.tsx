import React, { FC, useCallback, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  router,
  showToast,
  ScrollView,
  hideLoading,
  showLoading,
  Image,
} from '@ray-js/ray';
import Strings from '@/i18n';
import { getAIAgentRoles, bindAIAgentRoles, deleteAIAgentRoles } from '@/api/index_highway';
import { useSelector } from 'react-redux';
import { TopBarProps } from '@/components/TopBar';
import { Button, Loading, SwipeCell, BottomSheet, Slider, NavBar } from '@ray-js/smart-ui';
import { emitter, getDevId, getTheme, generateAdjacentGradients } from '@/utils';
import { Icon } from '@ray-js/svg';
import { AgentListItem } from '@/types';
import { initRoleList, updateRoleList, selectRoleList } from '@/redux/modules/roleListSlice';
import { updateSingleAgent, resetSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { imgDelete, icons } from '@/res';
import { volumeSetCode } from '@/constant/dpCodes';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { DialogConfirm, AICard, NoData } from '@/components';
import { devices } from '@/devices';
import { resetAgentInfo } from '@/redux/modules/agentInfoSlice';
import throttle from 'lodash/throttle';
import PerfText from '@ray-js/components-ty-perf-text';
import styles from './index.module.less';
import store from '../../redux';

const AIDialogue: FC = () => {
  const { dispatch } = store;
  const actions = useActions();
  const { screenHeight } = useSelector(selectSystemInfo);
  const dpVolumeSet = useProps(props => props[volumeSetCode]);
  const [topBarProps, setTopBarProps] = useState<TopBarProps>({});
  const deviceName = useDevice(device => device.devInfo.name)

  const { list } = useSelector(selectRoleList);
  const [tag, setTag] = useState('dialog');
  const [themeColor, setThemeColor] = useState(getTheme());
  const [generateThemeColor, setGenerateThemeColor] = useState(
    generateAdjacentGradients(themeColor)
  );
  const [isShowUnbindConfirm, setIsShowUnbindConfirm] = useState(false);
  const [isShowVolumeSlider, setIsShowVolumeSlider] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [unbindId, setUnbindId] = useState('-1');
  const [topId, setTopId] = useState('');
  const [sourceList, setSourceList] = useState([]);
  const [volumeSetValue, setVolumeSetValue] = useState(dpVolumeSet);
  const [isReady, setIsReady] = React.useState(false);
  const [refresherTriggeredState, setRefresherTriggeredState] = useState(false);
  const { language } = useSelector(selectSystemInfo);

  const {
    property: { min, max, step },
  } = useMemo(
    () => devices.common.getDpSchema()[volumeSetCode] || { property: { min: 0, max: 100 } },
    []
  );

  useEffect(() => {
    setSourceList(list);
  }, [list]);

  const getBoundAgentsFunc = async () => {
    getAIAgentRoles()
      .then((res: any) => {
        const { list: boundAgentList } = res;
        console.log('==55boundAgentList', boundAgentList);
        initLoading && setInitLoading(false);
        dispatch(updateRoleList([...boundAgentList]));
        setRefresherTriggeredState(false);
      })
      .catch(err => {
        setInitLoading(false);
        console.log('getBoundAgentsFunc::err::', err);
        setRefresherTriggeredState(false);
      });
  };

  useLayoutEffect(() => {
    setTopBarProps({ backgroundColor: '#daecf6' });
    emitter.on('refreshDialogData', () => getBoundAgentsFunc());

    return () => {
      setTopBarProps({ backgroundColor: '#fff' });
      emitter.off('refreshDialogData');
    };
  }, []);

  // 页面数据初始化
  useEffect(() => {
    getBoundAgentsFunc();
  }, []);

  const goToDialogHistory = (item: AgentListItem, tagKey: string) => {
    dispatch(updateSingleAgent({ ...item, tagKey }));
    setTimeout(() => {
      router.push(`/dialogHistory`);
    }, 300);
  };

  const goToCustomAgentEdit = (roleId: string) => {
    // fix: 一次编辑声音后创建还能编辑声音
    dispatch(resetAgentInfo());
    dispatch(resetSingleAgent());
    if (sourceList.length >= 10) {
      showToast({
        title: Strings.getLang('dsc_roles_num_limit'),
        icon: 'none',
      });
    } else {
      router.push(`/customAgentEdit?roleId=${roleId}`);
    }
  };

  const bindAIRole = (roleId: string, inBind: boolean) => {
    if (inBind) return;
    showLoading({
      title: '',
    });
    bindAIAgentRoles(roleId)
      .then(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_binding_success'),
          icon: 'success',
        });
        emitter.emit('refreshDialogData', '');
      })
      .catch(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_binding_fail'),
          icon: 'error',
        });
      });
  };

  const deleteAIRole = (roleId: string) => {
    showLoading({
      title: '',
    });
    deleteAIAgentRoles(roleId)
      .then(() => {
        hideLoading();
        showToast({
          title: Strings.getLang('dsc_delete_success'),
          icon: 'success',
        });
        emitter.emit('refreshDialogData', '');
      })
      .catch(err => {
        hideLoading();
        console.log('deleteAIAgentRoles::err::', err);
        showToast({
          title: Strings.getLang('dsc_delete_fail'),
          icon: 'error',
        });
      });
    setUnbindId('-1');
    setIsShowUnbindConfirm(false);
  };

  const handleAfterChange = useMemo(
    () =>
      throttle((value: number) => {
        actions[volumeSetCode]?.set(value), { debounce: 200 };
      }, 200),
    [actions]
  );

  const handleDeleteAIRole = (roleId: string, inBind: boolean) => {
    if (!inBind) {
      setUnbindId(roleId);
      setIsShowUnbindConfirm(true);
    } else {
      showToast({
        title: Strings.getLang('dsc_delete_bind'),
        icon: 'none',
      });
    }
  };

  const finalLanguage = useMemo(() => {
    let finalLang = '';
    if (language.includes('zh')) {
      finalLang = 'zh';
    } else if (language.includes('en')) {
      finalLang = 'en';
    } else {
      finalLang = 'en';
    }
    return finalLang;
  }, [language]);

  return (
    <View className={styles.view}>
      <NavBar customStyle={{ width: '100vw' }} leftText={deviceName} leftTextType="home" />
      {sourceList?.length > 0 ? (
        <ScrollView
          className={styles.rolesBox}
          scrollY
          onScroll={() => {
            setTopId('');
          }}
          scrollIntoView={topId}
          refresherEnabled
          refresherTriggered={refresherTriggeredState}
          refresherBackground="transparent"
          onRefresherrefresh={e => {
            setRefresherTriggeredState(true);
            getBoundAgentsFunc();
          }}
        >
          {sourceList.map((item, index) => {
            const {
              roleId,
              roleName,
              roleImgUrl,
              bgColor,
              useLangName,
              useTimbreName,
              useLlmName,
              inBind,
            } = item;
            return (
              <View key={roleId} className={styles.singleItem}>
                <SwipeCell
                  key={roleId}
                  rightWidth={75}
                  slot={{
                    right: (
                      <View className={styles.imgDeleteBtn}>
                        <Image
                          src={imgDelete}
                          className={styles.imgDeleteIcon}
                          onClick={() => handleDeleteAIRole(roleId, inBind)}
                        />
                      </View>
                    ),
                  }}
                  asyncClose
                >
                  <AICard
                    key={roleId}
                    name={roleName}
                    introduce={`${useTimbreName}(${useLangName})`}
                    circleColor={themeColor}
                    bodyBgColor={`linear-gradient(282deg, ${generateThemeColor.left} -8%, ${generateThemeColor.right} 116%)`}
                    onClickCard={() => goToDialogHistory(item, tag)}
                    logoUrl={roleImgUrl}
                    style={{
                      marginTop: index === 0 ? '0.34rem' : '0',
                    }}
                    editText={Strings.getLang(
                      inBind ? 'dsc_bind_device_success' : 'dsc_bind_device'
                    )}
                    handleEdit={() => bindAIRole(roleId, inBind)}
                    wakeWord={inBind}
                    creator={useLlmName}
                    enableLongPress={!inBind}
                    handleLongPress={() => handleDeleteAIRole(roleId, inBind)}
                    {...item}
                  />
                </SwipeCell>
              </View>
            );
          })}
        </ScrollView>
      ) : initLoading ? (
        <Loading type="spinner" color={themeColor} />
      ) : (
        <View className={styles.noDataBox}>
          <NoData tip={Strings.getLang('dsc_no_dialog_agent')} style={{ marginTop: '300rpx' }} />
        </View>
      )}

      <View className={styles.bottomBtn}>
        <Button
          color={themeColor}
          customClass={styles.bottomCreate}
          onClick={() => goToCustomAgentEdit('')}
        >
          {Strings.getLang('create_character')}
        </Button>

        <Button
          customClass={styles.bottomVolume}
          onClick={() => {
            setIsShowVolumeSlider(true);
          }}
        >
          <Icon d={icons.volume} color={themeColor} />
        </Button>
      </View>

      <BottomSheet
        show={isShowVolumeSlider}
        onClose={() => setIsShowVolumeSlider(false)}
        onAfterEnter={() => setIsReady(true)}
      >
        <View className={styles.sliderVolume}>
          <View className={styles.textContainer}>
            <Text className={styles.text}>{Strings.getLang('dsc_volume')}</Text>
            <PerfText
              className={styles.textPencent}
              eventName="sliderMove"
              style={{
                color: themeColor,
              }}
            />
            <Text
              className={styles.textPencent}
              style={{
                color: themeColor,
              }}
            >
              %
            </Text>
          </View>

          {isReady && (
            <Slider
              maxTrackHeight="8px"
              minTrackHeight="8px"
              thumbHeight="28px"
              thumbWidth="28px"
              min={min}
              max={max}
              value={dpVolumeSet}
              minTrackColor={themeColor}
              onAfterChange={handleAfterChange}
              moveEventName="sliderMove"
            />
          )}
        </View>
      </BottomSheet>

      <DialogConfirm
        visible={isShowUnbindConfirm}
        title={Strings.getLang('dsc_delete_role')}
        subTitle={Strings.getLang('dsc_delete_role_tips')}
        onConfirm={() => deleteAIRole(unbindId)}
        onClose={() => setIsShowUnbindConfirm(false)}
      />
    </View>
  );
};

export default AIDialogue;
