import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  getCdnUrl,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  router,
  useQuery,
  hideMenuButton,
} from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { NavBar } from '@ray-js/smart-ui';
import { getFitInvalidPwdList, clearFitInvalidPwd } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import { getPswIcon, getRepeatStrByNumber, parseTimer, formatTime } from '../pswUtils';
import styles from './index.module.less';

/**
 * 无效开锁方式列表页。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/failurePsw.js（FailurePswList）：
 * - 进入即拉取失效开锁方式列表（getFitInvalidPwdList，对齐 RN getFailurePwdList）；
 * - 分页无限滚动（limit/offset，对齐 RN loadMore / hasNextPage）；
 * - 顶部右上角「清空」入口，二次确认后一次性清空（clearFitInvalidPwd，对齐 RN clearAllFailurePsw）；
 * - 按 opModeType 分派四种列表项渲染（临时密码 / 离线密码 / 蓝牙钥匙 / 其它）。
 * 仅蓝牙钥匙、密码两类列表的底部入口会跳转本页（其余列表 RN 已注释「不需要无效列表入口」）。
 */

/** 每页拉取数量（对齐 RN pageSize=50） */
const PAGE_SIZE = 50;

const cdn = (name: string) => getCdnUrl(name, cdnImage);

/** 短信通知 DP（对齐 RN Config.uiConfig.dpMessage，lock-sdk dpCodes.message） */
const DP_MESSAGE = 'message';

/**
 * opModeType -> 图标（对齐 RN renderOthersItem 的 opModeMap）。
 * 5=指纹 6=卡 10=人脸 11=掌静脉
 */
const OP_MODE_ICON_MAP: Record<number, string> = {
  10: 'littleFace.png',
  11: 'littleHand.png',
  6: 'littleCard.png',
  5: 'littleFinger.png',
};

/**
 * 失效记录项（对齐 SDK RawPasswordItem）。
 * revokedPwd* 为 RN failurePsw.js renderPswItem 用到、但 SDK 未声明的云端下发字段，此处补声明。
 */
interface InvalidItem {
  unlockBindingId: number;
  opModeType: number;
  opModeSubType: number;
  name: string;
  userName?: string;
  mobile?: string;
  effectiveTime?: number;
  invalidTime?: number;
  devNameList?: string[];
  scheduleDetails?: Array<{
    allDay?: boolean;
    workingDay?: number;
    effectiveTime?: number;
    invalidTime?: number;
  }>;
  /** 撤销密码名称（opModeSubType===8 时展示，云端下发但 SDK 未声明） */
  revokedPwdName?: string;
  revokedPwdEffectiveTime?: number;
  revokedPwdInvalidTime?: number;
}

/** 容错 JSON 解析（对齐 RN typeof e === 'string' ? JSON.parse(e) : e） */
function safeParse(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

/** 清空成功 Toast（对齐 RN Toast.Success）。showToast 不带 onFinish，用 setTimeout 兜底隐藏。 */
function ToastBridge({ onFinished }: { onFinished: () => void }) {
  useEffect(() => {
    showToast({ title: Strings.getLang('deleteSuccess'), icon: 'success' });
    const t = setTimeout(onFinished, 1500);
    return () => clearTimeout(t);
  }, [onFinished]);
  return null;
}

export function FailurePswList() {
  const { title, opMode } = useQuery() as { title?: string; opMode?: string };
  /** 对齐 RN defaultProps opMode='1'（密码） */
  const opModeValue = opMode || '1';
  const { themeColor } = templateConfig;
  /** 设备是否支持短信通知 DP（对齐 RN Boolean(Config.uiConfig.dpMessage)） */
  const schema = useDevice(d => d.devInfo?.schema);
  const hasMessageDp = React.useMemo(
    () => (schema || []).some((s: any) => s.code === DP_MESSAGE),
    [schema]
  );

  const [list, setList] = useState<InvalidItem[]>([]);
  /** 首帧是否完成（对齐 RN startRender，未完成不渲染空态避免闪现） */
  const [started, setStarted] = useState(false);
  /** 清空成功提示（对齐 RN showClearSuccess） */
  const [showSuccess, setShowSuccess] = useState(false);

  const offsetRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const loadingRef = useRef(false);

  /**
   * 拉取一页失效记录（对齐 RN getLogs）。
   * @param append true=追加下一页；false=首屏/刷新替换
   */
  const fetchList = useCallback(
    async (append: boolean) => {
      if (loadingRef.current) return;
      if (append && !hasNextPageRef.current) return;
      loadingRef.current = true;
      try {
        const res: any = await getFitInvalidPwdList({
          limit: PAGE_SIZE,
          offset: offsetRef.current,
          opMode: opModeValue,
        });
        if (res === undefined) {
          // 对齐 RN：返回 undefined 视为空
          if (!append) setList([]);
          hasNextPageRef.current = false;
        } else {
          const datas: InvalidItem[] = res.datas || [];
          // 追加时按 unlockBindingId 去重（对齐 RN _.uniq 合并）
          setList(prev => {
            const base = append ? prev : [];
            const seen = new Set(base.map(i => i.unlockBindingId));
            return [...base, ...datas.filter(i => !seen.has(i.unlockBindingId))];
          });
          hasNextPageRef.current = offsetRef.current + PAGE_SIZE < res.totalCount;
          if (hasNextPageRef.current) {
            offsetRef.current += PAGE_SIZE;
          }
        }
      } catch (e) {
        // 对齐 RN：异常弹窗提示错误信息
        const err: any = typeof e === 'string' ? safeParse(e) : e;
        const msg = err?.message || err?.errorMsg || err;
        showModal({
          title: typeof msg === 'string' ? msg : '',
          content: typeof msg === 'string' ? '' : Strings.getLang('loadFailed'),
          showCancel: false,
          confirmText: Strings.getLang('confirm'),
        });
      } finally {
        loadingRef.current = false;
        setStarted(true);
        hideLoading();
      }
    },
    [opModeValue]
  );

  // 进入即 loading 并拉取首页（对齐 RN constructor: showLoading + getLogs(false)）
  useEffect(() => {
    showLoading({ title: '' });
    offsetRef.current = 0;
    hasNextPageRef.current = true;
    fetchList(false);
    hideMenuButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 滚动到底部：加载下一页（对齐 RN loadMore） */
  const onScrollToLower = useCallback(() => {
    fetchList(true);
  }, [fetchList]);

  /** 清空所有失效记录（对齐 RN clearAll） */
  const onClear = useCallback(() => {
    showModal({
      title: '',
      content: Strings.getLang('confirmClearFailurePswTip'),
      confirmText: Strings.getLang('confirm'),
      cancelText: Strings.getLang('cancel'),
      success: res => {
        if (res.confirm) {
          clearFitInvalidPwd({ opMode: opModeValue })
            .then(() => {
              setShowSuccess(true);
              offsetRef.current = 0;
              hasNextPageRef.current = true;
              fetchList(false);
            })
            .catch(err => console.warn('=== clearFitInvalidPwd error', err));
        }
      },
    });
  }, [fetchList, opModeValue]);

  // ===== 四种列表项渲染（对齐 RN renderCustomItem 按 opModeType 分派）=====

  /** opModeType 1/2：临时/周期密码（对齐 RN renderTimePswItem） */
  const renderTimePswItem = (item: InvalidItem) => {
    const {
      devNameList,
      userName,
      name,
      mobile,
      opModeSubType,
      opModeType,
      effectiveTime,
      invalidTime,
    } = item;
    const s = formatTime(effectiveTime);
    const e = formatTime(invalidTime);
    const icon = cdn(getPswIcon(item));
    const phoneText =
      !mobile || mobile === ''
        ? Strings.getLang('noPhone')
        : `${Strings.getLang('acceptPhone')}: +${mobile}`;
    return (
      <View className={styles.item} key={item.unlockBindingId}>
        <View className={styles.itemTop}>
          <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
            <Image className={styles.icon} src={icon} />
          </View>
          <Text className={styles.title}>{name}</Text>
        </View>
        {opModeType !== 2 && <Text className={styles.time}>{`${s} ~ ${e} `}</Text>}
        {hasMessageDp && opModeType !== 2 && (opModeSubType === 0 || opModeSubType === 1) && (
          <Text className={styles.phone}>{phoneText}</Text>
        )}
        {!!userName && userName !== '' && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleUser.png')} />
            <Text className={styles.userName}>{` ${userName}`}</Text>
          </View>
        )}
        {devNameList && devNameList.length > 0 && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleLock.png')} />
            <Text className={styles.lockName}>{devNameList.join(',')}</Text>
          </View>
        )}
      </View>
    );
  };

  /** opModeType 3：离线密码（对齐 RN renderPswItem） */
  const renderPswItem = (item: InvalidItem) => {
    const {
      devNameList,
      name,
      mobile,
      opModeSubType,
      effectiveTime,
      invalidTime,
      revokedPwdName,
      scheduleDetails,
      revokedPwdEffectiveTime,
      revokedPwdInvalidTime,
    } = item;
    const s = formatTime(effectiveTime);
    const e = formatTime(invalidTime);
    const revokedS = formatTime(revokedPwdEffectiveTime);
    const revokedE = formatTime(revokedPwdInvalidTime);
    const icon = cdn(getPswIcon(item));
    // 周期重复文案（对齐 RN：仅取首条 schedule 的 workingDay）
    const repeatTime =
      scheduleDetails && scheduleDetails.length > 0 && scheduleDetails[0].allDay
        ? ''
        : scheduleDetails && scheduleDetails.length > 0
        ? getRepeatStrByNumber(scheduleDetails[0].workingDay)
        : '';
    return (
      <View className={styles.item} key={item.unlockBindingId}>
        <View className={styles.itemTop}>
          <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
            <Image className={styles.icon} src={icon} />
          </View>
          <Text className={styles.title}>{name}</Text>
          {(opModeSubType === 8 || opModeSubType === 9) && (
            <View
              className={styles.hasSetClearBtn}
              style={opModeSubType === 8 ? { backgroundColor: 'rgba(35,156,142,0.1)' } : undefined}
            >
              <Text
                className={styles.clearBtnText}
                style={opModeSubType === 8 ? { color: '#239C8E' } : undefined}
              >
                {Strings.getLang(`clearCode_${opModeSubType}`)}
              </Text>
            </View>
          )}
        </View>
        {opModeSubType === 0 && <Text className={styles.time}>{`${s} ~ ${e} ${repeatTime}`}</Text>}
        {opModeSubType !== 0 && (
          <Text className={styles.time}>
            {Strings.formatString(
              Strings.getLang('pswFailureTime'),
              Strings.getLang(`pswLogType${opModeSubType}` as any)
            )}
          </Text>
        )}
        {devNameList && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleLock.png')} />
            <Text className={styles.lockName}>{Strings.getLang('canOpenAllDoor')}</Text>
          </View>
        )}
        {/* mobile 仅占位对齐 RN 字段，离线密码不展示手机号 */}
        {Boolean(mobile) && null}
        {opModeSubType === 8 && (
          <View className={styles.revokedPwdView}>
            <Text className={styles.revokedPwdTitle}>{Strings.getLang('lookClearTitle')}</Text>
            <View className={styles.revokedPswWarp}>
              <Text className={styles.revokedPwdName}>{revokedPwdName}</Text>
              <Text className={styles.revokedPwdTime}>{`${revokedS} ~ ${revokedE}`}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  /** opModeType 4：蓝牙钥匙（对齐 RN renderKeyItem） */
  const renderKeyItem = (item: InvalidItem) => {
    const {
      name,
      opModeSubType,
      userName,
      devNameList,
      effectiveTime,
      invalidTime,
      scheduleDetails,
    } = item;
    const s = formatTime(effectiveTime);
    const e = formatTime(invalidTime);
    const icon = opModeSubType === 10 ? 'permanentKey.png' : 'temporaryKey.png';
    const repeatTime =
      scheduleDetails && scheduleDetails.length > 0 && scheduleDetails[0].allDay
        ? ''
        : scheduleDetails && scheduleDetails.length > 0
        ? `${getRepeatStrByNumber(scheduleDetails[0].workingDay)} ${parseTimer(
            (scheduleDetails[0].effectiveTime || 0) * 60
          )} - ${parseTimer(
            (scheduleDetails[0].invalidTime || 0) * 60 -
              (scheduleDetails[0].invalidTime === 1440 ? 1 : 0)
          )}`
        : '';
    return (
      <View className={styles.item} key={item.unlockBindingId}>
        <View className={styles.itemTop}>
          <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
            <Image className={styles.icon} src={cdn(icon)} />
          </View>
          <Text className={styles.title}>{name}</Text>
        </View>
        {opModeSubType === 10 && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleUser.png')} />
            <Text className={styles.userName}>{userName}</Text>
          </View>
        )}
        {devNameList && devNameList.length > 0 && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleLock.png')} />
            <Text className={styles.itemText}>{devNameList[0]}</Text>
          </View>
        )}
        {opModeSubType !== 10 && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleTime.png')} />
            <Text className={styles.itemText}>{`${s} ~ ${e} ${repeatTime}`}</Text>
          </View>
        )}
      </View>
    );
  };

  /** opModeType 5/6/10/11：指纹/卡/人脸/掌静脉（对齐 RN renderOthersItem） */
  const renderOthersItem = (item: InvalidItem) => {
    const { devNameList, userName, name, opModeType } = item;
    const icon = OP_MODE_ICON_MAP[opModeType];
    return (
      <View className={styles.item} key={item.unlockBindingId}>
        <View className={styles.itemTop}>
          <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
            <Image className={styles.icon} src={cdn(icon)} />
          </View>
          <Text className={styles.title}>{name}</Text>
        </View>
        {!!userName && userName !== '' && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleUser.png')} />
            <Text className={styles.userName}>{userName}</Text>
          </View>
        )}
        {devNameList && devNameList.length > 0 && (
          <View className={styles.itemCenter}>
            <Image className={styles.subIcon} src={cdn('littleLock.png')} />
            <Text className={styles.itemText}>{devNameList.join(',')}</Text>
          </View>
        )}
      </View>
    );
  };

  /** 按 opModeType 分派（对齐 RN renderCustomItem） */
  const renderItem = (item: InvalidItem) => {
    switch (item.opModeType) {
      case 1:
      case 2:
        return renderTimePswItem(item);
      case 3:
        return renderPswItem(item);
      case 4:
        return renderKeyItem(item);
      case 5:
      case 6:
      case 10:
      case 11:
        return renderOthersItem(item);
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (!started) return <View className={styles.flex} />;
    if (list.length === 0) {
      return (
        <View className={styles.empty}>
          <Image className={styles.noneIcon} src={cdn('none.png')} />
          <Text className={styles.tip}>{Strings.getLang('noFailureRecords')}</Text>
        </View>
      );
    }
    return (
      <ScrollView
        className={styles.scroll}
        scrollY
        lowerThreshold={50}
        onScrollToLower={onScrollToLower}
      >
        {list.map(renderItem)}
      </ScrollView>
    );
  };

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={title || Strings.getLang('failurePsw')}
        leftArrow
        onClickLeft={() => router.back()}
        {...(list.length > 0
          ? { rightText: Strings.getLang('clearPsw'), onClickRightText: onClear as any }
          : {})}
      />
      {renderContent()}
      {showSuccess && (
        <ToastBridge
          onFinished={() => {
            setShowSuccess(false);
          }}
        />
      )}
    </View>
  );
}

export default FailurePswList;
