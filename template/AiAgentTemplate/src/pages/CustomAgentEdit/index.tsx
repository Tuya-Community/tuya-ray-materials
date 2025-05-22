import React, { FC, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  router,
  showToast,
  hideLoading,
  location,
  navigateBack,
  Label
} from '@ray-js/ray';
import { TopBar, TouchableOpacity, DialogPicker, AvatarBar } from '@/components';
import PickerItem from '@/components/PickerItem';
import Strings from '@/i18n';
import { icons, imgAvatarDefault } from '@/res';
import { useSelector, useDispatch } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { emitter, getTheme, removeSpecialChars } from '@/utils';
import useAgentLanguages from '@/hooks/useAgentLanguages';
import { selectSingleAgent } from '@/redux/modules/singleAgentSlice';
import { selectRoleInfo, updateRoleInfo } from '@/redux/modules/roleInfoSlice';
import { Icon } from '@ray-js/svg';
import {
  getAgentModels,
  createRole,
  updateRole,
  getAIAgentRoleDetail,
  getAIAgentRolesTemplateList,
  getAIAgentRolesTemplatesDetail,
  getStandardVoiceList,
} from '@/api/index_highway';
import { Button, Field } from '@ray-js/smart-ui';
import clsx from 'clsx';
import styles from './index.module.less';

const MAX_NAME_LENGTH = 20;
const MAX_INTRO_LENGTH = 2000;
const MAX_MEMORY_LENGTH = 2000;

const CustomAgentEdit: FC = () => {
  const dispatch = useDispatch();
  const { roleId: initRoleId } = location.query as any;
  const {
    id = 0,
  } = useSelector(selectSingleAgent);
  const { language } = useSelector(selectSystemInfo);

  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState(initRoleId);
  const [introduction, setIntroduction] = useState('');
  const [selectedSupportLangs, setSelectedSupportLangs] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModelName, setSelectedModelName] = useState('');
  const [roleImgUrl, setRoleImgUrl] = useState('');
  const [useTimbreId, setUseTimbreId] = useState('');
  const [memoryInfo, setMemoryInfo] = useState('');
  const [isShowLanguageDialog, setIsShowLanguageDialog] = useState(false);
  const [isShowModelDialog, setIsShowModelDialog] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [themeColor, setThemeColor] = useState(getTheme());
  const [modelList, setModelList] = useState<Array<{ key: string; dataString: string }>>([]);
  const [templateList, setTemplateList] = useState<Array<any>>([]);
  const [templateRoleId, setTemplateRoleId] = useState('');
  const { langRangeList } = useAgentLanguages(id);
  const [nameErrorMessage, setNameErrorMessage] = useState('');


  const roleInfo = useSelector(selectRoleInfo);


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

  const [selectedLanguageCode, setSelectedLanguageCode] = useState(finalLanguage);
  const [selectedLanguageName, setSelectedLanguageName] = useState(finalLanguage === 'zh' ? Strings.getLang('dsc_language_zh') : Strings.getLang('dsc_language_en'));

  useEffect(() => {
    let finalLang = '';
    if (language.includes('zh')) {
      finalLang = 'zh';
    } else if (language.includes('en')) {
      finalLang = 'en';
    } else {
      finalLang = 'en';
    }

    setSelectedLanguageCode(finalLang);
  }, [language]);


  const getTemplateList = async () => {
    getAIAgentRolesTemplateList()
      .then((res: any) => {
        console.log('==getTemplateList', res);
        setTemplateList(res);
        if (res?.length > 0) {
          setTemplateRoleId(res[0].roleId);
        }
      })
      .catch(err => {
        console.log('getTemplateList::err::', err);
      });
  };

  const getTemplateListDetail = async (roleId: string) => {
    getAIAgentRolesTemplatesDetail(roleId)
      .then((res: any) => {
        console.log('==getTemplateListDetail', res);
        initRoleData(res);
        initRoleInfoData();
      })
      .catch(err => {
        console.log('getTemplateListDetail::err::', err, roleId);
      });
  };

  const getAgentRoleDetail = async (roleId: string) => {
    getAIAgentRoleDetail(roleId)
      .then((res: any) => {
        console.log('==getAIAgentRoleDetail', res);
        initRoleData(res);
        initRoleInfoData();
      })
      .catch(err => {
        console.log('getAIAgentRoleDetail::err::', err);
      });
  };

  const initRoleData = (data: any) => {
    setName(data.roleName);
    setAvatar(data.roleImgUrl)
    setIntroduction(data.roleIntroduce);
    setSelectedVoice(data.useTimbreName);
    setSelectedVoiceId(data.useTimbreId);
    setSelectedLanguageName(data.useLangName);
    data.useLangCode && setSelectedLanguageCode(data.useLangCode);
    data.useTimbreSupportLangList?.length && setSelectedSupportLangs(data.useTimbreSupportLangList);
    setSelectedModel(data.useLlmId);
    setSelectedModelName(data.useLlmName)
    setRoleImgUrl(data.roleImgUrl)
    setUseTimbreId(data.useTimbreId)
    setMemoryInfo(data.memoryInfo)
  }

  const initRoleInfoData = () => {
    dispatch(updateRoleInfo({
      roleImgUrl: '',
      voiceId: '',
      voiceName: '',
      useLang: '',
      useLangId: '',
      roleTemplateId: '',
    }));
  }

  const handleSelectImage = () => {
    router.push(`/avatarSelect?templateRoleId=${templateRoleId}`);
  };

  const handleNameChange = e => {
    const value = e.detail;
    if (value.length > MAX_NAME_LENGTH) {
      showToast({
        title: Strings.getLang('max_length_reached'),
        icon: 'none',
      });
      return;
    }
    setName(value);

  };

  // fix: 回显时无法出校验问题
  useEffect(() => {
    if (name !== removeSpecialChars(name)) {
      setNameErrorMessage(Strings.getLang('clone_name_tip_new'));
    } else {
      setNameErrorMessage('');
    }
  }, [name])

  const handleIntroChange = e => {
    const value = e.detail;
    if (value.length > MAX_INTRO_LENGTH) {
      showToast({
        title: Strings.getLang('max_length_reached'),
        icon: 'none',
      });
      return;
    }
    setIntroduction(value);
  };

  const handleMemoryChange = e => {
    const value = e.detail;
    if (value.length > MAX_MEMORY_LENGTH) {
      showToast({
        title: Strings.getLang('max_length_reached'),
        icon: 'none',
      });
      return;
    }
    setMemoryInfo(value);
  };

  const handleSave = async () => {
    if (!name || nameErrorMessage) {
      showToast({
        title: `${Strings.getLang('please_complete')}${Strings.getLang('role_name')}`,
        icon: 'error',
      });
      return;
    }
    if (!introduction) {
      showToast({
        title: `${Strings.getLang('please_complete')}${Strings.getLang('introduction')}`,
        icon: 'error',
      });
      return;
    }
    if (!roleInfo?.voiceId && !selectedVoiceId) {
      showToast({
        title: `${Strings.getLang('please_complete')}${Strings.getLang('role_voice')}`,
        icon: 'error',
      });
      return;
    }
    if (!selectedModel) {
      showToast({
        title: `${Strings.getLang('please_complete')}${Strings.getLang('model')}`,
        icon: 'error',
      });
      return;
    }

    const params = {
      roleName: name,
      roleIntroduce: introduction,
      roleImgUrl: roleInfo?.roleImgUrl || roleImgUrl,
      useLangCode: roleInfo?.useLangId || selectedLanguageCode,
      useTimbreId: roleInfo?.voiceId || selectedVoiceId,
      useLlmId: selectedModel,
      memoryInfo: memoryInfo,
    }

    console.log('add params:::', params);

    try {
      if (roleId) {
        params.roleId = roleId
        await updateRole(params);
      } else {
        await createRole(params);
      }
      hideLoading();
      showToast({
        title: Strings.getLang('save_success'),
        icon: 'success',
      });

      emitter.emit('refreshDialogData', '');
      navigateBack({ delta: 9999 });
    } catch (error) {
      console.log('createRole/updateRole:::', error);
      hideLoading();
      showToast({
        title: Strings.getLang('save_failed'),
        icon: 'error',
      });
    }
  };


  const fetchSupportedModels = async () => {
    try {
      const response = await getAgentModels();
      console.log('getAgentModels:::', response);
      if (response) {
        const models = response?.map(model => ({
          key: model.llmId,
          dataString: model.llmName,
        }));
        setModelList(models);
      }
    } catch (error) {
      console.error('Failed to fetch supported models:', error);
    }
  };

  useEffect(() => {
    templateRoleId && getTemplateListDetail(templateRoleId);
  }, [templateRoleId]);

  useEffect(() => {
    console.log("========", roleId)
    roleId && getAgentRoleDetail(roleId);
  }, [roleId]);

  useEffect(() => {
    fetchSupportedModels();
    !roleId && getTemplateList();
    return () => {
      // 组件卸载时清空状态
      console.log('---------')
      initRoleInfoData();
    };
  }, []);


  const renderRequireTitle = (title) => {
    return <View style={{ display: 'flex' }}><Text style={{ color: 'red', fontSize: '32rpx', marginTop: '6rpx' }}>*</Text><Label style={{ fontWeight: '500', fontSize: '32rpx', marginLeft: '10rpx' }}>{title}</Label></View>
  }

  return (
    <View className={styles.view}>
      <TopBar
        title={Strings.getLang('custom_agent_edit')}
        backgroundColor="#daecf6"
      />
      <View className={styles.content}>
        {
          templateList?.length ?
            <AvatarBar
              tags={templateList}
              value={templateRoleId}
              roleInfo={roleInfo}
              className={styles.avatarBarBox}
              onClick={(templateId: string, isChecked: boolean) => {
                if (isChecked) {
                  handleSelectImage()
                } else {
                  setTemplateRoleId(templateId)
                  dispatch(updateRoleInfo({ roleTemplateId: templateRoleId }));
                }
              }} />
            :
            <TouchableOpacity className={styles.avatarBox} onClick={handleSelectImage}>
              <Image src={roleInfo?.roleImgUrl || avatar || imgAvatarDefault} className={styles.avatar} />
              <View className={styles.avatarPlus} style={{ backgroundColor: themeColor }} >
                <Icon d={icons.plus} color={"#FFFFFF"} />
              </View>
            </TouchableOpacity>
        }

        <View className={styles.formItemCommon}>
          <Field
            value={name}
            labelClass={styles.inputLabel}
            label={Strings.getLang('role_name')}
            placeholder={Strings.getLang('please_input_name')}
            onInput={handleNameChange}
            maxlength={MAX_NAME_LENGTH}
            customStyle={{ width: '100%', borderRadius: '32rpx', padding: '32rpx 32rpx' }}
            inputClass={`${styles.input}`}
            errorMessage={nameErrorMessage}
            showWordLimit
            required
          />
        </View>

        <View className={clsx(styles.formItemCommon, styles.textArea)}>
          <Field
            value={introduction}
            labelClass={styles.inputLabel}
            label={Strings.getLang('introduction')}
            type="textarea"
            placeholder={Strings.getLang('please_input_introduction')}
            maxlength={MAX_INTRO_LENGTH}
            onInput={handleIntroChange}
            disabled={isOptimizing}
            customStyle={{ width: '100%', borderRadius: '32rpx', padding: '32rpx 32rpx' }}
            required
          />

        </View>

        <View className={styles.formItemPicker}>
          <PickerItem
            width="100%"
            height="108rpx"
            title={renderRequireTitle(Strings.getLang('role_voice'))}
            subTitle={`${roleInfo?.voiceId || selectedVoiceId}`.includes('clone_') ? `${roleInfo?.voiceName || selectedVoice || Strings.getLang('navigate_to_edit')}` : `${roleInfo?.voiceName || selectedVoice || Strings.getLang('navigate_to_edit')}`}
            isDiySubTitle={false}
            outerContainerStyle={{ borderRadius: '32rpx 32rpx 0rpx 0rpx' }}
            onClick={() => router.push(`/voiceSquare?lang=${roleInfo?.useLangId || selectedLanguageCode}&squareEntry=role&selectedVoiceId=${roleInfo?.voiceId || selectedVoiceId}`)}
          />
        </View>
        <View className={styles.formItemPicker}>
          <PickerItem
            width="620rpx"
            height="108rpx"
            title={renderRequireTitle(Strings.getLang('dsc_language_type'))}
            subTitle={
              selectedLanguageName ||
              Strings.getLang(
                selectedLanguageCode === 'zh' ? 'dsc_language_zh' : 'dsc_language_en'
              )
            }
            isDiySubTitle={false}
            innerContainerStyle={{ padding: '0' }}
            outerContainerStyle={{ borderRadius: '0rpx', padding: 0 }}
            onClick={() => setIsShowLanguageDialog(true)}
          />
        </View>

        <View className={styles.formItemPicker}>
          <PickerItem
            width="100%"
            height="108rpx"
            title={renderRequireTitle(Strings.getLang('model'))}
            subTitle={
              selectedModelName || Strings.getLang('please_select_model')
            }
            isDiySubTitle={false}
            outerContainerStyle={{ borderRadius: '0rpx 0rpx 32rpx 32rpx', marginBottom: '24rpx' }}
            onClick={() => setIsShowModelDialog(true)}
          />
        </View>

        <View className={clsx(styles.formItemCommon, styles.textArea)}>
          <Field
            value={memoryInfo}
            labelClass={styles.inputLabel}
            label={Strings.getLang('memory')}
            type="textarea"
            placeholder={Strings.getLang('please_input_memory')}
            maxlength={MAX_MEMORY_LENGTH}
            onInput={handleMemoryChange}
            disabled={isOptimizing}
          />
        </View>
      </View>

      <Button color={themeColor} customClass={styles.bottomBtn} onClick={handleSave}>
        {Strings.getLang('save')}
      </Button>

      <DialogPicker
        visible={isShowModelDialog}
        onClose={() => setIsShowModelDialog(false)}
        title={Strings.getLang('model')}
        rangeList={modelList}
        onConfirm={(modelKey: string) => {
          console.log('modelKey:::modelList:::', modelKey, modelList);
          setSelectedModel(modelKey);
          setSelectedModelName(modelList.find(item => `${item.key}` === `${modelKey}`)?.dataString);
          setIsShowModelDialog(false);
        }}
        defaultValue={selectedModel}
        isDataStringName
        isKeyValue
      />

      <DialogPicker
        visible={isShowLanguageDialog}
        onClose={() => setIsShowLanguageDialog(false)}
        title={Strings.getLang('dsc_language_select')}
        rangeList={langRangeList}
        onConfirm={(langKey: string) => {
          // 当语种更换，清空音色并回显去编辑
          // 语种发生变化再切换
          if (selectedLanguageCode !== langKey) {
            setSelectedVoice('');
            setSelectedVoiceId('');
            dispatch(updateRoleInfo({ voiceId: '', voiceName: '', supportLangs: '' }));
          }

          setSelectedLanguageCode(langKey);
          setSelectedLanguageName(langRangeList.find(item => item.key === langKey)?.dataString);
          setIsShowLanguageDialog(false);
        }}
        defaultValue={selectedLanguageCode}
        isDataStringName
        isKeyValue
      />
    </View>
  );
};

export default CustomAgentEdit;
