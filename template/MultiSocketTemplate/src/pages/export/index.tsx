import React, { FC, useState, useCallback, useRef } from 'react';
import { View, Text, Input, Button, Checkbox, showToast } from '@ray-js/ray';
import ActionSheet from '@ray-js/components-ty-actionsheet';
import List from '@ray-js/components-ty-cell';
import { DateActionSheet, TopBar } from '@/components';
import Strings from '@/i18n';
import { useDevice } from '@ray-js/panel-sdk';
import * as api from './api';

const types = ['hour', 'day', 'month'];

const exportFn = {
  hour: api.exportHour,
  day: api.exportDay,
  month: api.exportMonth,
};

const formDate = (date, format = 'YYYYMMDD') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return format
    .replace('YYYY', year)
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'));
};

const Page: FC = () => {
  const { devInfo, dpSchema } = useDevice(d => d);
  // const [unit, setUnit] = useState(false);
  const [type, setType] = useState('day');
  const [email, setEmail] = useState('');
  const isEnd = useRef(false);
  const [showList, setShowList] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleShowEnd = useCallback(() => {
    isEnd.current = true;
    setShowTime(true);
  }, []);
  const handleShowStart = useCallback(() => {
    isEnd.current = false;
    setShowTime(true);
  }, []);
  const handleSelectTime = useCallback(v => {
    setShowTime(false);
    if (isEnd.current) {
      setEndTime(v);
    } else {
      setStartTime(v);
    }
  }, []);

  const handleExport = useCallback(async () => {
    if (!email) {
      showToast({
        title: Strings.getLang('please_input_mail'),
        icon: 'error',
      });
      return;
    }
    const format = type === 'month' ? 'YYYYMM' : 'YYYYMMDD';
    const start = formDate(startTime, format);
    const end = formDate(startTime, format);
    const data: any = {
      title: Strings.getLang('export_title'),
      devId: devInfo.devId,
      email,
      dpExcelQuery: [
        {
          dpId: dpSchema.add_ele.id,
          name: Strings.getDpLang(dpSchema.add_ele.code),
        },
      ],
    };

    // eslint-disable-next-line default-case
    switch (type) {
      case 'hour':
        data.date = start;
        break;
      case 'day':
        data.startDay = start;
        data.endDay = end;
        break;
      case 'month':
        data.startMonth = start;
        data.endMonth = end;
        break;
    }
    try {
      await exportFn[type](data);

      showToast({
        icon: 'success',
        title: Strings.getLang('export_success'),
      });
    } catch {
      showToast({
        icon: 'error',
        title: Strings.getLang('export_error'),
      });
    }
  }, [type, email, startTime, endTime, devInfo?.devId]);

  return (
    <View>
      <TopBar title={Strings.getLang('export')} showBack />
      <List>
        <List.Item
          title={Strings.getLang('export_type')}
          onClick={() => setShowList(true)}
          content={<Text>{Strings.getLang(`export_${type}`)}</Text>}
        />
        <List.Item
          title={Strings.getLang(type === 'hour' ? 'export_time' : 'export_start_time')}
          onClick={handleShowStart}
          content={<Text>{formDate(startTime, type === 'month' ? 'YYYYMM' : 'YYYYMMDD')}</Text>}
        />
        {type !== 'hour' && (
          <List.Item
            title={Strings.getLang('export_start_time')}
            onClick={handleShowEnd}
            content={<Text>{formDate(endTime, type === 'month' ? 'YYYYMM' : 'YYYYMMDD')}</Text>}
          />
        )}

        <List.Item
          title={Strings.getLang('export_mail')}
          content={
            <Input
              placeholder={Strings.getLang('please_input')}
              value={email}
              onInput={e => setEmail(e.value)}
            />
          }
        />
      </List>
      <ActionSheet
        show={showList}
        header={Strings.getLang('export_select_type')}
        onCancel={() => setShowList(false)}
        cancelText={Strings.getLang('cancel')}
        okText=""
      >
        <View style={{ background: '#fff', padding: '2rpx 0' }}>
          <List.Row
            dataSource={types.map(key => {
              return {
                key,
                title: Strings.getLang(`export_${key}`),
                content: type === key ? <Checkbox checked /> : null,
                onClick: () => {
                  setType(key);
                  setShowList(false);
                },
              };
            })}
          />
        </View>
      </ActionSheet>
      <DateActionSheet
        visible={showTime}
        title={Strings.getLang('selectTime')}
        onCancel={() => setShowTime(false)}
        cancelText={Strings.getLang('cancel')}
        okText={Strings.getLang('confirm')}
        mode={type === 'month' ? 'month' : 'date'}
        onOk={handleSelectTime}
        onClickOverlay={() => setShowTime(false)}
      />
      <Button onClick={handleExport} style={{ marginTop: 32 }}>
        {Strings.getLang('export')}
      </Button>
    </View>
  );
};

export default Page;
