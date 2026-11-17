import React from 'react';
import { View, Text, Image, Input, getCdnUrl } from '@ray-js/ray';
import type { UnlockMethodType } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import styles from './index.module.less';

/**
 * 录制结果页（成功 / 失败·超时），四类开锁方式共用。
 *
 * 对齐 RN(0000007ew6) src/components/ResultView.js：
 * - 顶部圆形图标（成功主题色 addResultSuccess / 失败红色 addResultError）+ 结果文案；
 * - 成功：展示名称输入框（标题 nameTitle<code>），底部「完成」按钮 → onPrimary（改名并返回列表）；
 * - 失败/超时：展示「重试」按钮 → onPrimary（返回引导页重新采集）。
 */

const cdn = (name: string) => getCdnUrl(name, cdnImage);

export function ResultView({
  isSuccess,
  isTimeOut,
  errorText,
  code,
  themeColor,
  name,
  onNameChange,
  onPrimary,
}: {
  isSuccess: boolean;
  isTimeOut: boolean;
  errorText: string;
  code: UnlockMethodType;
  themeColor: string;
  name: string;
  onNameChange: (v: string) => void;
  onPrimary: () => void;
}) {
  const resultImg = isSuccess ? cdn('addResultSuccess.png') : cdn('addResultError.png');
  const imgBg = isSuccess ? themeColor : '#F56361';
  const resultText = isSuccess
    ? Strings.getLang('addSuccess')
    : isTimeOut
    ? Strings.getLang('addTimeOut')
    : errorText;

  return (
    <View className={styles.resultPage}>
      <View className={styles.resultContent}>
        <View className={styles.resultImgBg} style={{ backgroundColor: imgBg }}>
          <Image className={styles.resultImg} src={resultImg} />
        </View>
        <Text className={styles.resultText}>{resultText}</Text>

        {isSuccess ? (
          <View className={styles.nameView}>
            <Text className={styles.nameTitle}>{Strings.getLang(`nameTitle${code}` as any)}</Text>
            <Input
              className={styles.nameInput}
              value={name}
              maxLength={20}
              placeholder={Strings.getLang('nameInput')}
              onInput={(e: { detail: { value: string } }) => onNameChange(e.detail.value)}
            />
          </View>
        ) : (
          <View
            className={styles.resultBtn}
            style={{ backgroundColor: themeColor }}
            onClick={onPrimary}
          >
            <Text className={styles.resultBtnText}>{Strings.getLang('retry')}</Text>
          </View>
        )}
      </View>

      {isSuccess && (
        <View
          className={`${styles.resultBtn} ${styles.doneBtn}`}
          style={{ backgroundColor: themeColor }}
          onClick={onPrimary}
        >
          <Text className={styles.resultBtnText}>{Strings.getLang('done')}</Text>
        </View>
      )}
    </View>
  );
}

export default ResultView;
