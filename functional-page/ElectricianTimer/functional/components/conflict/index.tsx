import React, { FC, useMemo } from 'react';
import { ConflictPopup } from '@ray-js/electrician-timing-sdk/lib/components';
import { Locale } from '@ray-js/electrician-timing-sdk/lib/interface';
import Strings from '@/i18n';
import { FuncType } from '@/constant';
import { config } from '@/config';
import { ConflictItem } from '@/interface';
import { useCommon } from '@/redux/modules/commonSlice';

interface Props {
  conflictList: ConflictItem[];
  sourceType?: FuncType;
}

export const ConflictInstance: {
  show: (props: Props) => Promise<{ action: 'close'; data?: any } | { action: 'confirm'; data: ConflictItem[] }>;
} = {
  show: async (props: Props) => {
    console.warn('should add ConflictModal View at root of page');
    return Promise.resolve({ action: 'close' });
  },
};

const ConflictModal: FC = () => {
  const { dpNames } = useCommon();
  const locale = useMemo(() => {
    const data = {
      holdTime: Strings.getLang('ret_cycle_holdtime'),
      onHoldTime: Strings.formatValue('ret_cycle_onholdtime', '{hour}', '{minute}'),
      offHoldTime: Strings.formatValue('ret_cycle_offholdtime', '{hour}', '{minute}'),
      am: Strings.getLang('ret_am'),
      pm: Strings.getLang('ret_pm'),
      action: Strings.getLang('ret_action'),
      countdown: Strings.formatValue('ret_countdown_hour_action', '{hour}', '{minute}', '{action}'),
      conflictFailure: Strings.getLang('ret_replace_error'),
      countdownLabel: Strings.getLang('ret_tag_countdown'),
      cycleLabel: Strings.getLang('ret_tag_cycle'),
      randomLabel: Strings.getLang('ret_tag_random'),
      inchingLabel: Strings.getLang('ret_tag_inching'),
      cloudTimeLabel: Strings.getLang('ret_tag_normal'),
      inchingTime: Strings.formatValue('ret_inching_label_minute_second', '{minute}', '{second}'),
      mon: Strings.getLang('ret_mon'),
      tue: Strings.getLang('ret_tues'),
      wed: Strings.getLang('ret_wed'),
      thu: Strings.getLang('ret_thur'),
      fri: Strings.getLang('ret_fri'),
      sat: Strings.getLang('ret_sat'),
      sun: Strings.getLang('ret_sun'),
      everyday: Strings.getLang('ret_everyday'),
      weekend: Strings.getLang('ret_weekend'),
      workday: Strings.getLang('ret_workday'),
      onlyOnce: Strings.getLang('ret_once_time'),
    } as Locale;

    config.switchDps.forEach((item) => {
      data[item.code] = dpNames[item.code] || Strings.getDpLang(item.code);
      data[`${item.code}_on`] = Strings.getDpLang(item.code, true);
      data[`${item.code}_off`] = Strings.getDpLang(item.code, false);
    });
    config.countdownCodes.forEach((code) => {
      data[code] = Strings.getDpLang(code);
    });
    return data;
  }, [dpNames]);

  return (
    <ConflictPopup
      title={Strings.getLang('ret_conflict_title')}
      description={Strings.getLang('ret_conflict_subtitle')}
      id="smart-conflict-popup"
      locale={locale}
      cancelText={Strings.getLang('cancel')}
      okText={Strings.getLang('confirm')}
    />
  );
};

export default ConflictModal;
