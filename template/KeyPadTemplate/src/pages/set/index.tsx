import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, showToast, router, openPanel } from '@ray-js/ray';
import {
  NavBar,
  Cell,
  CellGroup,
  Switch,
  ActionSheet,
  Overlay,
  Loading,
  type SmartAction,
} from '@ray-js/smart-ui';
import { useDevice, useProps, useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { templateConfig } from '@/config';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectBleOnline } from '@/redux/modules/lockHomeSlice';
import { reConnectBle } from '@/utils/reConnectBle';
import styles from './index.module.less';

/** DP schema 项（仅取设置页所需字段） */
interface DpSchemaItem {
  code: string;
  id: number | string;
  mode?: string;
  property?: {
    type: string;
    range?: string[];
  };
}

/** bool 开关类设置 DP（不含 unlock_switch，它走 Switch + 弹窗选择） */
const BOOL_DPS = ['special_control', 'verify_lock_switch', 'switch_verify_lock'];

/** enum 选择类设置 DP（不含 unlock_switch，unlock_switch 单独处理） */
const ENUM_DPS = [
  'special_function',
  'single_multiple',
  'doorbell_song',
  'doorbell_volume',
  'key_tone',
  'beep_volume',
  'language',
];

/** unlock_switch 的「非组合开锁」枚举值（Switch 选中态取反） */
const UNLOCK_SWITCH_SINGLE = 'single_unlock';

/** 操作引导 DP code（存在即视为设备支持操作引导，对齐 RN dpGuidePageAct） */
const GUIDE_DP = 'guide_page_act';

/** 配件设置：根据设备 Schema 展示 DP 行和操作引导。 */
export function Setting() {
  const devInfo = useDevice(d => d.devInfo);
  const { themeColor } = templateConfig;
  const dpState = useProps<any>();
  const actions = useActions<any>();
  // 配件蓝牙在线态（离线时下发/跳转前需先重连，对齐 RN deviceOnline 判定）
  const bleOnline = useSelectorWithEquality(selectBleOnline);
  // 蓝牙重连倒计时弹框：>0 时展示「蓝牙连接中 Xs」（由 reConnectBle 的 onTick 驱动）
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  const schema = (devInfo?.schema ?? []) as unknown as DpSchemaItem[];
  const devId = devInfo?.devId ?? '';
  const productId = devInfo?.productId ?? '';

  // schema code → schema 项（用于能力判定与 enum range）
  const schemaMap = useMemo(() => {
    const map: Record<string, DpSchemaItem> = {};
    schema.forEach(item => {
      if (item?.code) map[item.code] = item;
    });
    return map;
  }, [schema]);

  // ===== ActionSheet（enum 选择） =====
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetActions, setSheetActions] = useState<SmartAction[]>([]);
  const sheetTargetRef = React.useRef<{ code: string } | null>(null);

  /**
   * 确保配件蓝牙在线，离线则弹倒计时重连框。
   *
   * 对齐 RN(0000007ew6) setting-view.js：enum/引导在「打开面板/跳转前」、bool 在「切换前」
   * 都先判定 deviceOnline，离线则 await reConnectBle(11, false)（successToast=false、带倒计时 UI），
   * 成功才继续，失败即中断。这里用项目自有的 reConnectBle，其 onTick 回调驱动受控倒计时弹框。
   * @returns true 已在线或重连成功；false 重连失败（已 Toast）
   */
  const ensureConnected = async (): Promise<boolean> => {
    if (bleOnline) return true;
    try {
      await reConnectBle({
        successToast: false,
        onTick: sec => setReconnectSeconds(sec),
      });
      return true;
    } catch {
      return false;
    } finally {
      setReconnectSeconds(0);
    }
  };

  /** 打开 enum 选择面板（离线时先重连，连上才弹，对齐 RN changeList） */
  const openEnumSheet = async (code: string) => {
    const ok = await ensureConnected();
    if (!ok) return;
    const item = schemaMap[code];
    const range = item?.property?.range ?? [];
    setSheetTitle(Strings.getDpLang(code));
    setSheetActions(
      range.map(v => ({
        name: Strings.getDpLang(code, v),
        color: dpState[code] === v ? themeColor : undefined,
        // SmartAction 允许自定义字段，携带原始枚举值供选中回填
        dpValue: v,
      }))
    );
    sheetTargetRef.current = { code };
    setSheetVisible(true);
  };

  /** 确认 enum 选择并下发（select 事件 detail 为选中的 action 项；此时已在线） */
  const onSheetSelect = (e: { detail: SmartAction }) => {
    const code = sheetTargetRef.current?.code;
    const value = e?.detail?.dpValue as string | undefined;
    setSheetVisible(false);
    if (!code || value === undefined) return;
    (actions as any)[code]?.set(value).catch((err: unknown) => {
      console.log('=== set dp error', err);
      showToast({ title: Strings.getLang('loadFailed'), icon: 'none' });
    });
  };

  /** 切换 bool DP（离线时先弹倒计时重连，连上才下发，对齐 RN changeDp） */
  const toggleBoolDp = async (code: string, val: boolean) => {
    const ok = await ensureConnected();
    if (!ok) return;
    (actions as any)[code]?.set(val).catch((err: unknown) => {
      console.log('=== set dp error', err);
      showToast({ title: Strings.getLang('loadFailed'), icon: 'none' });
    });
  };

  /** 操作引导：离线时先弹倒计时重连，连上才跳转，对齐 RN goToGuideView */
  const goToGuideView = async () => {
    const ok = await ensureConnected();
    if (!ok) return;
    openPanel({
      deviceId: devId,
      extraInfo: {
        bizClientId: '0000009uve',
        productId,
        productVersion: '1.0.0',
        i18nTime: Date.now().toString(),
        uiType: 'RN',
      },
      initialProps: { productId },
    });
  };

  // ===== unlock_switch（Switch + 点击打开选择面板） =====
  // 仅判断设备 schema 是否包含该 DP：有就展示，没有就不展示（不校验可写性）
  const unlockSwitchExists = !!schemaMap.unlock_switch;
  const unlockSwitchValue = dpState.unlock_switch;
  const unlockSwitchChecked =
    unlockSwitchValue !== undefined && unlockSwitchValue !== UNLOCK_SWITCH_SINGLE;

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('tab_set')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <ScrollView className={styles.scroll} scrollY>
        <CellGroup>
          {/* unlock_switch — Switch + subTitle，点击打开选择面板（仅设备含该 DP 时展示） */}
          {unlockSwitchExists && (
            <Cell
              title={Strings.getDpLang('unlock_switch')}
              label={Strings.getLang('unlockSwitchTip')}
            >
              <Switch
                checked={unlockSwitchChecked}
                activeColor={themeColor}
                onChange={() => openEnumSheet('unlock_switch')}
              />
            </Cell>
          )}

          {/* bool 开关类 DP — 仅设备含该 DP 时展示 */}
          {BOOL_DPS.filter(code => !!schemaMap[code]).map(code => (
            <Cell key={code} title={Strings.getDpLang(code)} border>
              <Switch
                checked={!!dpState[code]}
                activeColor={themeColor}
                onChange={(e: any) => toggleBoolDp(code, e.detail)}
              />
            </Cell>
          ))}

          {/* enum 选择类 DP — 仅设备含该 DP 时展示 */}
          {ENUM_DPS.filter(code => !!schemaMap[code]).map(code => (
            <Cell
              key={code}
              title={Strings.getDpLang(code)}
              value={dpState[code] !== undefined ? Strings.getDpLang(code, dpState[code]) : ''}
              isLink
              onClick={() => openEnumSheet(code)}
            />
          ))}

          {/* 操作引导 — 仅 guide_page_act DP 存在时展示 */}
          {!!schemaMap[GUIDE_DP] && (
            <Cell title={Strings.getLang('guide')} isLink onClick={goToGuideView} />
          )}
        </CellGroup>
      </ScrollView>

      {/* enum 选择面板 */}
      <ActionSheet
        show={sheetVisible}
        title={sheetTitle}
        actions={sheetActions}
        cancelText={Strings.getLang('cancel')}
        safeAreaInsetBottom={false}
        onClose={() => setSheetVisible(false)}
        onSelect={onSheetSelect}
        onCancel={() => setSheetVisible(false)}
      />

      {/* 蓝牙重连倒计时：Overlay 仅作遮罩，盒子用 fixed 自居中，文案由 reconnectSeconds 驱动 */}
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

export default Setting;
