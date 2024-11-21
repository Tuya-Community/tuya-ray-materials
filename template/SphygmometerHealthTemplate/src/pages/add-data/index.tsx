import { useCallback, useRef, useState } from 'react';
import { navigateBack, ScrollView, View } from '@ray-js/ray';
import { Button, Cell, CellGroup, Dialog, DialogInstance, Picker } from '@ray-js/smart-ui';
import moment from 'moment';

import { DateTimePickerPopup, PageWrapper, Text, TopBar } from '@/components';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { reportSingleData, updateUI } from '@/redux/action';
import { getDevId } from '@/utils';
import { bpPickerData } from '@/utils/constantData';
import styles from './index.module.less';

const AddData = () => {
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(({ uiState }) => uiState.userInfo);
  const sbpDbpHr = useRef([120, 80, 70]); // 收缩压 舒张压  心率

  const [date, setDate] = useState(new Date().getTime()); // 日期
  const [time, setTime] = useState(moment(new Date()).format('HH:mm')); // 时间

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [maxMinute, setMaxMinute] = useState(moment().minute());

  const formatDate = moment(date).format('YYYY-MM-DD');
  const timer = moment(`${formatDate} ${time}`).valueOf();
  const maxHour = moment().hour();

  const { systolicBpCode, diastolicBpCode, pulseCode } = dpCodes;
  const sbpPickerList = bpPickerData(systolicBpCode);
  const dbpPickerList = bpPickerData(diastolicBpCode);
  const pulsePickerList = bpPickerData(pulseCode);

  const totalData = [
    {
      key: 'sbp',
      values: [...sbpPickerList],
      defaultIndex: 119,
    },
    {
      key: 'dbp',
      values: [...dbpPickerList],
      defaultIndex: 79,
    },
    {
      key: 'pulse',
      values: [...pulsePickerList],
      defaultIndex: 69,
    },
  ];

  const handleDateCancelClick = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const handleTimeCancelClick = useCallback(() => {
    setTimePickerVisible(false);
  }, []);

  const handleDateConfirmClick = useCallback(({ detail }) => {
    setDatePickerVisible(false);
    setDate(detail);
  }, []);

  const handleTimeConfirmClick = useCallback(({ detail }) => {
    setTimePickerVisible(false);
    setTime(detail);
  }, []);

  const renderTitle = ({ pubTitle = '', subTitle = '' }) => {
    return (
      <View className={styles.title}>
        <Text size="32rpx">{pubTitle}</Text>
        <Text color="rgba(0, 0, 0, .45)">{subTitle}</Text>
      </View>
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const [sbp, dbp, hr] = sbpDbpHr.current || [];
      const params = {
        devId: getDevId(),
        userId: userInfo?.id,
        sys: sbp,
        dia: dbp,
        pulse: hr,
        time: timer,
        remark: remarkText,
      };
      const isSuccess = await reportSingleData(params);

      setLoading(false);

      if (isSuccess) {
        updateUI({ addSuccess: true });
        navigateBack();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handlePickerChange = useCallback(event => {
    const { value, index } = event.detail;
    sbpDbpHr.current = value.map(Number);
  }, []);

  const handleTimeInput = useCallback(({ detail }) => {
    const hour = detail.split(':')[0];
    setTime(detail);
    if (Number(hour) === maxHour) {
      setMaxMinute(moment().minute());
    } else {
      setMaxMinute(59);
    }
  }, []);

  return (
    <>
      <TopBar right={<View />} title={Strings.getLang('dsc_addData')} />
      <PageWrapper>
        <ScrollView scrollY className={styles.scroll}>
          <View className={styles.container}>
            <View className={styles.bloodPressureWrapper}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {renderTitle({
                  pubTitle: Strings.getDpLang(systolicBpCode),
                  subTitle: Strings.getLang('dsc_sysUnit'),
                })}
                {renderTitle({
                  pubTitle: Strings.getDpLang(diastolicBpCode),
                  subTitle: Strings.getLang('dsc_diaUnit'),
                })}
                {renderTitle({
                  pubTitle: Strings.getDpLang(pulseCode),
                  subTitle: Strings.getLang('dsc_pulUnit'),
                })}
              </View>
              <View className={styles.picker}>
                <Picker columns={totalData} onChange={handlePickerChange} />
              </View>
            </View>

            <CellGroup inset customClass={styles.cellGroupContainer}>
              <Cell
                isLink
                title={Strings.getLang('dsc_date')}
                value={formatDate}
                onClick={() => {
                  setDatePickerVisible(true);
                }}
              />
              <Cell
                isLink
                border={false}
                title={Strings.getLang('dsc_time')}
                value={time}
                onClick={() => {
                  setTimePickerVisible(true);
                }}
              />
            </CellGroup>

            <CellGroup inset customClass={styles.cellGroupContainer}>
              <Cell
                isLink
                border={false}
                title={Strings.getLang('dsc_remark')}
                value={remarkText}
                onClick={() => {
                  DialogInstance.input({
                    title: Strings.getLang('dsc_remark'),
                    value: remarkText,
                    placeholder: Strings.getLang('dsc_remarkFormat1'),
                    confirmButtonText: Strings.getLang('dsc_confirm'),
                    cancelButtonText: Strings.getLang('dsc_cancel'),
                    maxlength: -1,
                  })
                    .then(res => {
                      const curInputValue = res?.data?.inputValue;
                      setRemarkText(curInputValue);
                    })
                    .catch(() => {
                      console.log('=== cancel');
                    });
                }}
              />
            </CellGroup>
          </View>
        </ScrollView>
      </PageWrapper>

      <View className={styles.bottomButtonBg}>
        <Button
          round
          color={themeColor}
          loading={loading}
          size="large"
          type="primary"
          onClick={handleSubmit}
        >
          {Strings.getLang('dsc_confirm')}
        </Button>
      </View>
      <Dialog id="smart-dialog" />
      <DateTimePickerPopup
        cancelButtonText={Strings.getLang('dsc_cancel')}
        confirmButtonText={Strings.getLang('dsc_confirm')}
        maxDate={new Date().getTime()}
        minDate={moment(new Date()).add(-364, 'day').valueOf()}
        show={datePickerVisible}
        type="date"
        value={date}
        onCancel={handleDateCancelClick}
        onClose={handleDateCancelClick}
        onConfirm={handleDateConfirmClick}
      />
      <DateTimePickerPopup
        cancelButtonText={Strings.getLang('dsc_cancel')}
        confirmButtonText={Strings.getLang('dsc_confirm')}
        maxHour={maxHour}
        maxMinute={maxMinute}
        show={timePickerVisible}
        type="time"
        value={time}
        onCancel={handleTimeCancelClick}
        onClose={handleTimeCancelClick}
        onConfirm={handleTimeConfirmClick}
        onInput={handleTimeInput}
      />
    </>
  );
};

export default AddData;
