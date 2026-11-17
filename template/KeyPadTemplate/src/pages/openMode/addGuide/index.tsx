import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, getCdnUrl, router, useQuery } from '@ray-js/ray';
import { NavBar, Overlay, Loading } from '@ray-js/smart-ui';
import type { UnlockMethodType } from '@ray-js/lock-sdk';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import styles from './index.module.less';

/**
 * 录入引导页（指纹 / 门卡 / 人脸 / 掌静脉）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/others/addGuideView.js（AddGuideView）：
 * - 顶部按 type 展示标题（guideTitle + 类型名）与副标题（guideSubTitle_<type>）+ 引导大图；
 * - 底部「开始采集」：先校验网络/蓝牙在线（离线 reConnectBle），再进入设备录入态，
 *   设备就绪后跳转对应录制页（addFinger/addCard/addFace/addHand）。
 *
 * RN 的录入态是手写 DP 协议：`utilPutData` 拼 createMode(`unlock_method_create`) 报文 + putDpData，
 * 再在 dpDataChange 里解析阶段（fd 失败 / 00 就绪带 addTimes）。lock-sdk 已把这套 BLE 多阶段流程
 * 封装为 fitStartAddUnlockMethod / onFitAddUnlockMethod / fitCancelAddUnlockMethod，本页不直接下发。
 *
 * 「开始采集」：先校验蓝牙在线（离线走 reConnectBle，成功后需再次点击，对齐 openMode/index.tsx），
 * 在线则跳转录制页 `/addRecord`（透传 type + 选中成员 + 选中门锁），由录制页启动 SDK 录入流程。
 *
 * 引导大图 `<type>Guide.png` 通过 cdn/cdnImage.json 映射；缺少映射时显示占位块。
 */

const GUIDE_TYPES: readonly UnlockMethodType[] = ['finger', 'card', 'face', 'hand'];

const cdn = (name: string) => getCdnUrl(name, cdnImage);

export function AddGuide() {
  // type：开锁方式类型（finger/card/face/hand）；userId：选中成员；lockDevId：选中门锁
  const {
    type: rawType,
    userId = '',
    lockDevId = '',
  } = useQuery() as { type?: string; userId?: string; lockDevId?: string };
  // 非法/缺失 type 兜底到指纹，保证文案与引导图 key 有效
  const type: UnlockMethodType = GUIDE_TYPES.includes(rawType as UnlockMethodType)
    ? (rawType as UnlockMethodType)
    : 'finger';

  const { themeColor } = templateConfig;
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);
  // 蓝牙重连倒计时弹框（受控，由 reConnectBle 的 onTick 回调驱动），对齐 openMode/index.tsx
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  const typeName = Strings.getLang(type as any);
  const title = Strings.formatValue('guideTitle', typeName);
  const subTitle = Strings.getLang(`guideSubTitle_${type}` as any);

  // 缺少引导图映射时显示占位块。
  const guideKey = `${type}Guide.png`;
  const hasGuideImg = useMemo(
    () => Object.prototype.hasOwnProperty.call(cdnImage, guideKey),
    [guideKey]
  );

  /**
   * 开始采集（对齐 RN startCollect）：
   * 1. 蓝牙离线 → reConnectBle（受控倒计时弹框），连上后需用户再次点击（对齐 openMode/index.tsx）；
   * 2. 在线 → 跳转录制页 /addRecord，透传 type + 选中成员 userId + 选中门锁 lockDevId，
   *    录制页负责 fitStartAddUnlockMethod + onFitAddUnlockMethod 驱动 UI。
   */
  const startCollect = useCallback(async () => {
    if (!deviceOnline) {
      try {
        await reConnectBle({ onTick: sec => setReconnectSeconds(sec) });
      } catch {
        // 连接失败已由 reConnectBle 内部 Toast 提示
      } finally {
        setReconnectSeconds(0);
      }
      return;
    }
    router.push(
      `/addRecord?type=${encodeURIComponent(type)}` +
        `&userId=${encodeURIComponent(userId)}&lockDevId=${encodeURIComponent(lockDevId)}`
    );
  }, [deviceOnline, type, userId, lockDevId]);

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.formatValue('collectOpenMode', typeName)}
        leftArrow
        onClickLeft={() => router.back()}
      />

      <View className={styles.top}>
        <Text className={styles.topTitle}>{title}</Text>
        <Text className={styles.topSubTitle}>{subTitle}</Text>
      </View>

      <View className={styles.imageWrap}>
        {hasGuideImg ? (
          <Image className={styles.image} mode="aspectFit" src={cdn(guideKey)} />
        ) : (
          <View className={styles.imagePlaceholder} />
        )}
      </View>

      <View className={styles.footer}>
        <View className={styles.btn} style={{ backgroundColor: themeColor }} onClick={startCollect}>
          <Text className={styles.btnText}>{Strings.getLang('startCollect')}</Text>
        </View>
      </View>

      {/* 蓝牙重连倒计时（对齐 openMode/index.tsx）：Overlay 遮罩 + 居中 Loading + 秒数 */}
      <Overlay show={reconnectSeconds > 0}>
        <View className={styles.reconnectBox}>
          <Loading type="circular" color="#ffffff" size="36px" />
          <Text className={styles.reconnectText}>
            {Strings.formatValue('connectBle', String(reconnectSeconds))}
          </Text>
        </View>
      </Overlay>
    </View>
  );
}

export default AddGuide;
