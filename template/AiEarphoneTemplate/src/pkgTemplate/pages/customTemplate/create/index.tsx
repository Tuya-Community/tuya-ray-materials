import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  router,
  Image,
  onKeyboardHeightChange,
  offKeyboardHeightChange,
} from '@ray-js/ray';
import ThemedImage from '@/components/ThemedImage';
import { Button, Field } from '@ray-js/smart-ui';
// eslint-disable-next-line import/named
import { TopBar, DotsLoader } from '@/components';
import Strings from '@/i18n';
import clsx from 'clsx';
import { useSelector, AppDispatch } from '@/redux';
import { useDispatch } from 'react-redux';
import {
  saveCustomTemplate,
  fetchCustomTemplates,
  deleteCustomTemplate,
  fetchTemplateIconsIfNeeded,
  selectCustomTemplates,
} from '@/redux/modules/customTemplateSlice';
import { atopGetPromptPolishCount, atopPolishCustomTemplatePrompt } from '@/api/customTemplate';
import Res from '@/res';
import {
  CustomTemplateSaveErrorI18nKeyMap,
  CustomTemplatePromptPolishErrorI18nKeyMap,
} from '@/constant/enums';

import styles from './index.module.less';

const MAX_NAME = 20;
const MIN_PROMPT = 10;
const MAX_PROMPT = 500;
const POLISH_TOTAL_FALLBACK = 3;
/** 安卓键盘弹出时原生会把 fixed 底栏抬到键盘上沿，易挡住上方提示词；高于此像素视为键盘已打开，临时隐藏保存条 */
const MIN_KEYBOARD_VISIBLE_PX = 80;

const Index = (props: { location?: { query?: { id?: string } } }) => {
  const editId = props?.location?.query?.id || null;
  const isEdit = !!editId;

  const { statusBarHeight, topBarHeight, screenHeight, platform } = useSelector(
    state => state.systemInfo
  );
  const isAndroid = platform?.toLowerCase() === 'android';
  const { list, templateIconList } = useSelector(selectCustomTemplates);
  const dispatch = useDispatch<AppDispatch>();

  const editingItem = useMemo(
    () => (isEdit && editId ? list.find(item => item.templateId === editId) : null),
    [isEdit, editId, list]
  );

  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  /** 与 m.wearable.template.icon.list 的 objectKey 一致，提交给 create/update */
  const [iconObjectKey, setIconObjectKey] = useState('');
  const [polishing, setPolishing] = useState(false);
  const [polishRemaining, setPolishRemaining] = useState<number | null>(null);
  const [polishTotal, setPolishTotal] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  /** 失焦后再根据值是否为空决定红字报错，避免页面首次加载就飘红 */
  const [nameBlurred, setNameBlurred] = useState(false);
  const [promptBlurred, setPromptBlurred] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const unmountedRef = useRef(false);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    const onKb = (e: { height?: number }) => {
      const h = typeof e?.height === 'number' ? e.height : 0;
      setKeyboardHeight(h);
    };
    onKeyboardHeightChange(onKb);
    return () => offKeyboardHeightChange(onKb);
  }, []);

  const hideFixedSaveBarOnAndroidKb = isAndroid && keyboardHeight >= MIN_KEYBOARD_VISIBLE_PX;

  const nameError =
    nameBlurred && !name.trim() ? Strings.getLang('custom_template_name_required') : '';
  const promptError = promptBlurred
    ? !prompt.trim()
      ? Strings.getLang('custom_template_prompt_required')
      : prompt.trim().length < MIN_PROMPT
      ? Strings.getLang('custom_template_prompt_min_length').replace('{min}', String(MIN_PROMPT))
      : prompt.trim().length > MAX_PROMPT
      ? Strings.getLang('custom_template_prompt_max_length').replace('{max}', String(MAX_PROMPT))
      : ''
    : '';

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.templateName);
      setPrompt(editingItem.prompt);
      setIconObjectKey(editingItem.objectKey?.trim() || '');
    }
  }, [editingItem]);

  useEffect(() => {
    if (templateIconList.length === 0) {
      dispatch(fetchTemplateIconsIfNeeded());
    }
  }, [dispatch, templateIconList.length]);

  /** 新建时默认选中第一个图标（编辑态由 editingItem 回填） */
  useEffect(() => {
    if (editingItem || templateIconList.length === 0) return;
    setIconObjectKey(prev => prev || templateIconList[0].objectKey);
  }, [templateIconList, editingItem]);

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  const refreshPolishCount = async () => {
    try {
      const res = await atopGetPromptPolishCount();
      if (unmountedRef.current) return;
      const total = typeof res.totalCount === 'number' ? res.totalCount : POLISH_TOTAL_FALLBACK;
      const used = typeof res.usedCount === 'number' ? res.usedCount : 0;
      setPolishTotal(total);
      setPolishRemaining(Math.max(0, total - used));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshPolishCount();
  }, []);

  const scrollHeight = useMemo(() => {
    const height = screenHeight - statusBarHeight - topBarHeight;
    return `calc(${height}px - env(safe-area-inset-bottom))`;
  }, [statusBarHeight, topBarHeight, screenHeight]);

  const canSave =
    name.trim().length > 0 &&
    prompt.trim().length >= MIN_PROMPT &&
    prompt.trim().length <= MAX_PROMPT &&
    iconObjectKey.trim().length > 0 &&
    !saving;

  const handlePolish = async () => {
    if (polishing || !prompt.trim()) return;
    if (polishRemaining !== null && polishRemaining <= 0) return;
    setPolishing(true);
    try {
      const res = await atopPolishCustomTemplatePrompt({ prompt: prompt.trim() });
      if (unmountedRef.current) return;
      setPrompt(res.polishedPrompt || '');
      await refreshPolishCount();
    } catch (err: any) {
      const enumCode = err?.innerError?.errorCode;
      const i18nKey = enumCode
        ? CustomTemplatePromptPolishErrorI18nKeyMap[String(enumCode) as any]
        : '';

      ty.showToast({
        title:
          (i18nKey && Strings.getLang(i18nKey)) || Strings.getLang('custom_template_polish_fail'),
        icon: 'error',
      });
    } finally {
      if (!unmountedRef.current) {
        setPolishing(false);
      }
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await dispatch(
        saveCustomTemplate({
          ...(isEdit && editId ? { templateId: editId } : {}),
          templateName: name.trim(),
          prompt: prompt.trim(),
          ...(iconObjectKey ? { objectKey: iconObjectKey } : {}),
        })
      ).unwrap();
      if (unmountedRef.current) return;
      ty.showToast({
        title: Strings.getLang('custom_template_save_success'),
        icon: 'success',
      });
      dispatch(fetchCustomTemplates());
      router.back();
    } catch (err: any) {
      if (unmountedRef.current) return;
      const enumCode = err?.innerError?.errorCode;

      const i18nKey = enumCode ? CustomTemplateSaveErrorI18nKeyMap[String(enumCode) as any] : '';
      const title = i18nKey
        ? Strings.getLang(i18nKey)
        : Strings.getLang('custom_template_save_fail');
      ty.showToast({
        title,
        icon: 'error',
      });
      router.back();
    } finally {
      if (!unmountedRef.current) {
        setSaving(false);
      }
    }
  };

  const handleDelete = () => {
    if (!editId) return;
    const contentTpl = Strings.getLang('custom_template_delete_confirm');
    const content = contentTpl.replace('{name}', name.trim() || '-');
    ty.showModal({
      title: Strings.getLang('custom_template_delete_title'),
      content,
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('confirm'),
      success: res => {
        if (res.confirm) {
          dispatch(deleteCustomTemplate(editId)).then(() => {
            ty.showToast({
              title: Strings.getLang('custom_template_delete_success'),
              icon: 'success',
            });
            router.back();
          });
        }
      },
    });
  };

  const polishBase = Strings.getLang('custom_template_polish');
  const polishLabel =
    polishRemaining !== null
      ? `${polishBase} ${polishRemaining}/${polishTotal ?? POLISH_TOTAL_FALLBACK}`
      : polishBase;

  return (
    <View className={styles.container}>
      <TopBar
        title={Strings.getLang(isEdit ? 'custom_template_my' : 'custom_template_create')}
        rightText={isEdit ? Strings.getLang('delete') : ''}
        rightTextClass={styles.topBarDelete}
        onClickRight={() => {
          if (isEdit) handleDelete();
        }}
      />
      <ScrollView scrollY style={{ height: scrollHeight }}>
        <View className={styles.form}>
          {/* 模板名称 */}
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <View className={styles.cardHeaderLeft}>
                <Text className={styles.required}>*</Text>
                <Text className={styles.label}>{Strings.getLang('custom_template_name')}</Text>
              </View>
            </View>
            <View className={styles.fieldBox}>
              <Field
                className={styles.field}
                value={name}
                placeholder={Strings.getLang('custom_template_name_example')}
                maxlength={MAX_NAME}
                onChange={(e: any) => setName(e?.detail ?? '')}
                onBlur={() => setNameBlurred(true)}
              />
              {!!nameError && <Text className={styles.fieldErrorMsg}>{nameError}</Text>}
              <Text className={styles.counterInline}>
                {name.length}/{MAX_NAME}
              </Text>
            </View>
          </View>

          {/* 提示词 */}
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <View className={styles.cardHeaderLeft}>
                <Text className={styles.required}>*</Text>
                <Text className={styles.label}>{Strings.getLang('custom_template_prompt')}</Text>
              </View>
              <View
                className={clsx(
                  styles.polishBtn,
                  (polishing || (polishRemaining !== null && polishRemaining <= 0)) &&
                    styles.polishDisabled
                )}
                onClick={handlePolish}
              >
                <Image className={styles.polishStar} src={Res.starImg} mode="aspectFit" />
                <Text className={styles.polishText}>{polishLabel}</Text>
              </View>
            </View>
            <View className={styles.fieldBox}>
              <Field
                className={clsx(
                  styles.field,
                  styles.fieldTextarea,
                  polishing && styles.fieldHidden
                )}
                value={prompt}
                type="textarea"
                placeholder={Strings.getLang('custom_template_prompt_example')}
                maxlength={MAX_PROMPT}
                autosize
                onChange={(e: any) => setPrompt(e?.detail ?? '')}
                onBlur={() => setPromptBlurred(true)}
              />
              {!!promptError && <Text className={styles.fieldErrorMsg}>{promptError}</Text>}
              <View
                className={styles.polishLoader}
                style={polishing ? undefined : { visibility: 'hidden' }}
              >
                <DotsLoader canvasId="polishPromptDots" dotSize={8} gap={6} color="#3678E3" />
              </View>
              <Text className={styles.counterInline}>
                {prompt.length} / {MIN_PROMPT}～{MAX_PROMPT}
              </Text>
            </View>
          </View>

          {/* 模板图标 */}
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <Text className={styles.label}>{Strings.getLang('custom_template_icon')}</Text>
            </View>
            <View className={styles.iconGrid}>
              {templateIconList.map(row => (
                <View
                  key={row.objectKey}
                  className={clsx(
                    styles.iconItem,
                    iconObjectKey === row.objectKey && styles.iconActive
                  )}
                  onClick={() => setIconObjectKey(row.objectKey)}
                >
                  <ThemedImage
                    src={row.iconUrl}
                    className={`${styles.iconThumb} ${row?.needColorAdapt ? 'img-theme-bw' : ''}`}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className={styles.buttonWrapper}
        style={hideFixedSaveBarOnAndroidKb ? { display: 'none' } : undefined}
      >
        <Button
          customClass={styles.button}
          disabled={!canSave}
          loading={saving}
          onClick={handleSave}
          loadingText={Strings.getLang('custom_template_saving')}
        >
          {Strings.getLang('save')}
        </Button>
      </View>
    </View>
  );
};

export default Index;
