import { THEME_COLOR } from '@/constant';
import { cisternCode, cleanTimesCode, suctionCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { Text, View, Button, nativeDisabled } from '@ray-js/ray';
import { Popup, Radio, RadioGroup, Icon, Row, Col, Button as MButton } from '@ray-js/smart-ui';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { find, isUndefined } from 'lodash-es';

import styles from './index.module.less';

type Props = {
  show: boolean;
  onConfirm: (fanValue: string, waterValue: string, cleanCount: string) => void;
  onCancel: () => void;
  sweepCount: string;
  fan: string;
  water: string;
};

// 吸力
const SUCTION_MAP: Record<Suction, { code: Suction; icon: string; value: string }> = {
  closed: {
    value: '0',
    code: 'closed',
    icon: 'fan0',
  },
  gentle: {
    value: '1',
    code: 'gentle',
    icon: 'fan1',
  },
  normal: {
    value: '2',
    code: 'normal',
    icon: 'fan2',
  },
  strong: {
    value: '3',
    code: 'strong',
    icon: 'fan3',
  },
  max: {
    value: '4',
    code: 'max',
    icon: 'fan4',
  },
} as const;

// 水量
const CISTERN_MAP: Record<Cistern, { code: Cistern; icon: string; value: string }> = {
  closed: {
    value: '0',
    code: 'closed',
    icon: 'water0',
  },
  low: {
    value: '1',
    code: 'low',
    icon: 'water1',
  },
  middle: {
    value: '2',
    code: 'middle',
    icon: 'water2',
  },
  high: {
    value: '3',
    code: 'high',
    icon: 'water3',
  },
} as const;

const RoomPreferencePopLayout: FC<Props> = props => {
  const { show, onConfirm, onCancel, sweepCount, fan, water } = props;
  const [fanValue, setFanValue] = useState(fan || '0');
  const [waterValue, setWaterValue] = useState(water || '0');
  const [cleanCount, setCleanCount] = useState(sweepCount || '0');

  useEffect(() => {
    if (!isUndefined(fan)) {
      setFanValue(fan);
    }
    if (!isUndefined(water)) {
      setWaterValue(water);
    }
    if (!isUndefined(sweepCount)) {
      setCleanCount(sweepCount);
    }
  }, [fan, sweepCount, water]);

  const _onCancel = () => {
    onCancel && onCancel();
  };

  const _onConfirm = () => {
    onConfirm(fanValue, waterValue, cleanCount);
  };

  const renderFanSlider = useCallback(() => {
    const activeFan = find(SUCTION_MAP, { value: fanValue }) || SUCTION_MAP.closed;
    return (
      <View className={styles.modeBox}>
        <View className={styles.labelBox}>
          <Text className={styles.label}>{Strings.getDpLang(suctionCode)}</Text>
          <Icon classPrefix="iconfont" name={activeFan.icon} size="16px" />
        </View>
        <View className={styles.buttonRow}>
          {Object.keys(SUCTION_MAP).map(item => {
            const isActive = SUCTION_MAP[item].value === fanValue;
            return (
              <Button
                type="default"
                key={item}
                className={isActive ? styles.activeButton : styles.button}
                onClick={() => {
                  setFanValue(SUCTION_MAP[item].value);
                }}
              >
                {Strings.getDpLang(suctionCode, item)}
              </Button>
            );
          })}
        </View>
      </View>
    );
  }, [fanValue]);

  const renderCleanCount = useCallback(() => {
    return (
      <View className={styles.cleanCountRow}>
        <View className={styles.labelBox}>
          <Text className={styles.label}>{Strings.getDpLang(cleanTimesCode)}</Text>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RadioGroup
            value={cleanCount}
            onChange={e => {
              setCleanCount(e.detail);
            }}
            direction="horizontal"
          >
            <Radio name="1" customClass="demo-radio-inline" checkedColor={THEME_COLOR}>
              {Strings.getLang('dsc_timing_sweep_count1')}
            </Radio>
            <Radio name="2" customClass="demo-radio-inline" checkedColor={THEME_COLOR}>
              {Strings.getLang('dsc_timing_sweep_count2')}
            </Radio>
          </RadioGroup>
        </View>
      </View>
    );
  }, [cleanCount]);

  // 渲染水量
  const renderCistern = useCallback(() => {
    const activeCistern = find(CISTERN_MAP, { value: waterValue }) || CISTERN_MAP.closed;

    return (
      <View>
        <View className={styles.labelBox}>
          <Text className={styles.label}>{Strings.getDpLang(cisternCode)}</Text>
          <Icon classPrefix="iconfont" name={activeCistern.icon} size="16px" />
        </View>
        <View className={styles.buttonRow}>
          {Object.keys(CISTERN_MAP).map(item => {
            const isActive = CISTERN_MAP[item].value === waterValue;
            return (
              <Button
                type="default"
                key={item}
                className={isActive ? styles.activeButton : styles.button}
                onClick={() => {
                  setWaterValue(CISTERN_MAP[item].value);
                }}
              >
                {Strings.getDpLang(cisternCode, item)}
              </Button>
            );
          })}
        </View>
      </View>
    );
  }, [waterValue]);

  useEffect(() => {
    nativeDisabled(show as any);
  }, [show]);

  return (
    <Popup
      show={show}
      position="bottom"
      round
      safeAreaInsetBottom={false}
      customStyle={{ marginBottom: 0, backgroundColor: 'transparent', height: '450px' }}
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      onClickOverlay={_onCancel}
      onClose={_onCancel}
    >
      <View className={styles.container}>
        <View className={styles.contentBox}>
          {renderCleanCount()}
          {renderFanSlider()}
          {renderCistern()}
        </View>

        <View className={styles.footer}>
          <Row gutter={40}>
            <Col span={12}>
              <MButton block round onClick={onCancel} plain type="primary">
                {Strings.getLang('dsc_cancel')}
              </MButton>
            </Col>
            <Col span={12}>
              <MButton block round onClick={_onConfirm} type="primary">
                {Strings.getLang('dsc_confirm')}
              </MButton>
            </Col>
          </Row>
          {/* <Button className={styles.buttonCancel} onClick={_onCancel}>
            <Text style={{ color: '#000' }}>{Strings.getLang('dsc_cancel')}</Text>
          </Button>
          <Button className={styles.buttonConfirm} onClick={_onConfirm}>
            <Text style={{ color: '#ffffff' }}>{Strings.getLang('dsc_confirm')}</Text>
          </Button> */}
        </View>
      </View>
    </Popup>
  );
};

export default RoomPreferencePopLayout;
