import React from 'react';
import { View, Text, Image, getCdnUrl } from '@ray-js/ray';
import type { UnlockMethodType } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { FINGER_PATH_GROUPS, FINGER_VIEWBOX } from './fingerPaths';
import styles from './index.module.less';

/**
 * 录制中「采集视觉」区（对齐 RN 各 add*View.js 的 renderCenter），一个组件按 type 分支忠实还原：
 * - finger 指纹：SVG 指纹图按进度逐组点亮（RN renderPath）+ `step/total` 计数；
 * - card 门卡：SVG 圆环进度 + 门卡图标居中 + 倒计时秒数（RN SvgBackground + add_card）；
 * - face 人脸：人脸图标 + 倒计时秒数（RN addFace）；
 * - hand 掌静脉：手掌图标 + `step/total` 计数（RN addHand）。
 *
 * 指纹填充与门卡圆环无现成组件，miniapp 用 data-URI `<Image>` 承载动态 SVG（随进度/颜色重算）。
 */

const cdn = (name: string) => getCdnUrl(name, cdnImage);

/** 动态 SVG → data-URI（Tuya miniapp <Image> 可直接渲染 URL 编码的 svg+xml） */
const toSvgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

/**
 * 指纹填充 SVG（对齐 RN addFingerView.renderPath）：16 组路径按
 * `(组序号 * total) / 16 < step` 逐组点亮；错误态用红色，否则主题色，未点亮灰色。
 */
function buildFingerSvg(step: number, total: number, activeColor: string): string {
  const GRAY = '#E5E5E5';
  const safeTotal = total > 0 ? total : 1;
  const paths = FINGER_PATH_GROUPS.map((group, index) => {
    const lit = (index * safeTotal) / 16 < step;
    const color = lit ? activeColor : GRAY;
    return group
      .map(d => `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="0.5"/>`)
      .join('');
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${FINGER_VIEWBOX}" width="180" height="180">${paths}</svg>`;
}

/**
 * 门卡圆环进度 SVG（对齐 RN SvgBackground）：底色灰环 + 进度弧（自顶端顺时针）。
 * viewBox 240×240，半径 100，居中 (120,120)。
 */
function buildRingSvg(percent: number, color: string): string {
  const CX = 120;
  const R = 100;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - Math.max(0, Math.min(100, percent)) / 100);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">` +
    `<circle cx="${CX}" cy="${CX}" r="${R}" fill="none" stroke="#EAEAEA" stroke-width="2"/>` +
    `<circle cx="${CX}" cy="${CX}" r="${R}" fill="none" stroke="${color}" stroke-width="3" ` +
    `stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${offset}" ` +
    `transform="rotate(-90 ${CX} ${CX})"/>` +
    `</svg>`
  );
}

export function CollectVisual({
  type,
  step,
  total,
  seconds,
  percent,
  isError,
  themeColor,
}: {
  type: UnlockMethodType;
  /** 当前录入次数（finger/hand，来自 SDK step 事件） */
  step: number;
  /** 总录入次数（来自 fitStartAddUnlockMethod 的 total） */
  total: number;
  /** 剩余倒计时秒数（card/face 展示） */
  seconds: number;
  /** 门卡成功后圆环填充百分比 0~100（card 展示） */
  percent: number;
  isError: boolean;
  themeColor: string;
}) {
  const activeColor = isError ? '#F56361' : themeColor;

  // 指纹：动态填充 SVG + 计数
  if (type === 'finger') {
    const uri = toSvgUri(buildFingerSvg(step, total, activeColor));
    return (
      <View className={styles.visualWrap}>
        <Image className={styles.fingerImg} mode="aspectFit" src={uri} />
        <View className={styles.countRow}>
          <Text className={styles.countCurrent} style={{ color: themeColor }}>
            {String(step)}
          </Text>
          <Text className={styles.countTotal}>{`/${total}`}</Text>
        </View>
        <Text className={styles.tip}>{Strings.getLang('addFingerTip')}</Text>
      </View>
    );
  }

  // 门卡：圆环进度 + 门卡图标 + 倒计时
  if (type === 'card') {
    const uri = toSvgUri(buildRingSvg(percent, activeColor));
    return (
      <View className={styles.visualWrap}>
        <View className={styles.ringWrap}>
          <Image className={styles.ringImg} src={uri} />
          <Image className={styles.ringIcon} src={cdn('add_card.png')} />
        </View>
        <Text className={styles.seconds}>{`${seconds}s`}</Text>
        <Text className={styles.tip}>{Strings.getLang('addCardTip')}</Text>
      </View>
    );
  }

  // 人脸：人脸图标 + 倒计时
  if (type === 'face') {
    return (
      <View className={styles.visualWrap}>
        <Image className={styles.bigIcon} mode="aspectFit" src={cdn('faceAdd.png')} />
        <Text className={styles.seconds}>{`${seconds}s`}</Text>
        <Text className={styles.tip}>{Strings.getLang('addFaceTip')}</Text>
      </View>
    );
  }

  // 掌静脉：手掌图标 + 计数
  return (
    <View className={styles.visualWrap}>
      <Image className={styles.bigIcon} mode="aspectFit" src={cdn('handAdd.png')} />
      <View className={styles.countRow}>
        <Text className={styles.countCurrent} style={{ color: themeColor }}>
          {String(step)}
        </Text>
        <Text className={styles.countTotal}>{`/${total}`}</Text>
      </View>
      <Text className={styles.tip}>{Strings.getLang('addHandTip')}</Text>
    </View>
  );
}

export default CollectVisual;
