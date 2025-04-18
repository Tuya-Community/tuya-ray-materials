import React from 'react';
import { showToast, View } from '@ray-js/ray';
import { useCustomAlarm, useDevice } from '@ray-js/panel-sdk';
import { NavBar, Button, Slider, Switch, CellGroup, Cell, Loading } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { getCachedLaunchOptions } from '@/api/getCachedLaunchOptions';
import styles from './index.module.less';

const isGroup = !!getCachedLaunchOptions()?.query?.groupId;

const Section = ({ title, children }) => {
  return (
    <View className={styles.section}>
      <View className={styles.title}>{title}</View>
      {children}
    </View>
  );
};

export function Home() {
  const tempCurrentDpId = useDevice(device => device.devInfo.codeIds.temp_current);
  const tempCurrentSchema = useDevice(device => device.dpSchema.temp_current);
  const {
    data,
    loading,
    addCustomAlarm,
    getCustomAlarmList,
    setCustomAlarmStatus,
    deleteCustomAlarm,
  } = useCustomAlarm();

  React.useEffect(() => {
    getCustomAlarmList();
  }, []);

  const handleValueChange = React.useCallback(evt => {
    const [start, end] = evt.detail;
    addCustomAlarm({
      name: `${start}~${end}`,
      condition: [
        [tempCurrentDpId, '<', start],
        [tempCurrentDpId, '>=', end],
      ],
    })
      .then(data => {
        console.log('🚀 ~ addCustomAlarm ~ success:', data);
        showToast({ title: Strings.getLang('successTip'), icon: 'none' });
      })
      .catch(err => {
        console.log('🚀 ~ addCustomAlarm ~ failed:', err);
        showToast({ title: Strings.getLang('failedTip'), icon: 'error' });
      });
  }, []);

  const handleStatusChange = React.useCallback(
    evt => {
      const bindId = data?.[0]?.bindId;
      if (typeof bindId === 'undefined') {
        showToast({ title: Strings.getLang('warnTip'), icon: 'error' });
        return;
      }
      setCustomAlarmStatus({ bindId, enable: evt.detail })
        .then(data => {
          console.log('🚀 ~ setCustomAlarmStatus ~ success:', data);
          showToast({ title: Strings.getLang('successTip'), icon: 'none' });
        })
        .catch(err => {
          console.log('🚀 ~ setCustomAlarmStatus ~ failed:', err);
          showToast({ title: Strings.getLang('failedTip'), icon: 'error' });
        });
    },
    [data]
  );

  const handleDelete = React.useCallback(() => {
    const bindId = data?.[0]?.bindId;
    if (typeof bindId === 'undefined') {
      showToast({ title: Strings.getLang('warnTip'), icon: 'error' });
      return;
    }
    deleteCustomAlarm({ bindId })
      .then(data => {
        console.log('🚀 ~ deleteCustomAlarm ~ success:', data);
        showToast({ title: Strings.getLang('successTip'), icon: 'none' });
      })
      .catch(err => {
        console.log('🚀 ~ deleteCustomAlarm ~ failed:', err);
        showToast({ title: Strings.getLang('failedTip'), icon: 'error' });
      });
  }, [data]);

  const conds = data?.[0]?.triggerRuleVO?.conditions;
  const checked = data?.[0]?.triggerRuleVO?.enabled;
  const tempRangeValue = [conds?.[0]?.expr?.[0]?.[2] ?? 0, conds?.[1]?.expr?.[0]?.[2] ?? 10];

  return (
    <>
      <NavBar leftText="Alarm Ability Demo" leftTextType="home" />
      <View className={styles.view}>
        {isGroup ? (
          <View style={{ marginTop: '24px' }}>{Strings.getLang('groupNotSupportTip')}</View>
        ) : (
          <View className={styles.content}>
            <Section title={Strings.getLang('add')}>
              <View className={styles['slider-wrapper']}>
                {loading ? (
                  <Loading className={styles.loading} />
                ) : (
                  <Slider.RangeSlider
                    min={tempCurrentSchema.property.min ?? 0}
                    max={tempCurrentSchema.property.max ?? 100}
                    barHeight="4px"
                    value={tempRangeValue.map(v => +v)}
                    inActiveColor="#000000"
                    activeColor="#007AFF"
                    onChange={handleValueChange}
                  />
                )}
              </View>
            </Section>

            <Section title={Strings.getLang('enable')}>
              <Switch checked={checked} onChange={handleStatusChange} />
            </Section>

            <Section title={Strings.getLang('delete')}>
              <Button type="danger" onClick={handleDelete}>
                {Strings.getLang('deleteTip')}
              </Button>
            </Section>

            <Section title={Strings.getLang('view')}>
              {data?.length === 0 ? (
                <CellGroup>
                  <Cell
                    title={Strings.getLang('emptyTip')}
                    label={Strings.getLang('emptyTip2')}
                    isLink={false}
                  />
                </CellGroup>
              ) : (
                <CellGroup>
                  {data.map(d => {
                    const name = d?.triggerRuleVO?.name;
                    const conds = d?.triggerRuleVO?.conditions;
                    return (
                      <Cell
                        key={d.bindId}
                        title={name || `bindId: ${d.bindId}`}
                        label={Strings.formatValue(
                          'valueTip',
                          conds?.[0]?.expr?.[0]?.[2],
                          conds?.[1]?.expr?.[0]?.[2]
                        )}
                        value={
                          // @ts-ignore
                          d.enable ? Strings.getLang('enableTrue') : Strings.getLang('enableFalse')
                        }
                        isLink={false}
                      />
                    );
                  })}
                </CellGroup>
              )}
            </Section>
          </View>
        )}
      </View>
    </>
  );
}

export default Home;
