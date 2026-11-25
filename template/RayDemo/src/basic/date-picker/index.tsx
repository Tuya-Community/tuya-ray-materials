import React, { Fragment } from 'react';

import Header from '@/common/Header';
import Code from '@/common/Code';
import Demo0 from '@/components/DatePicker/basic';
import Demo1 from '@/components/DatePicker/startend';
import Demo2 from '@/components/DatePicker/disabled';
import Demo3 from '@/components/DatePicker/month';

import DemoWrapper from '@/common/DemoWrapper';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='DatePicker' description={I18n.t('datePicker')} />
      <Code title={I18n.t('selectDate')}>{`
<DatePicker onChange={handlePickerChange}>
  <View>${I18n.t('datePicker')}</View>
</DatePicker>
      `}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>

      <Code title={I18n.t('selectDateRange')}>{`
<DatePicker onChange={handlePickerChange} start={'2021-1-1'} end={'2021-12-12'}>
  <View>${I18n.t('selectDateRange')}</View>
</DatePicker>
      `}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>

      <Code title={I18n.t('selectDateDisabled')}>{`
<DatePicker onChange={handlePickerChange} start={'2021-1-1'} end={'2021-12-12'} disabled>
  <View>${I18n.t('selectDateDisabled')}</View>
</DatePicker>
      `}</Code>
      <DemoWrapper>
        <Demo2 />
      </DemoWrapper>

      <Code title={I18n.t('dateGranularity')}>{`
<DatePicker onChange={handlePickerChange} start={'2021-1-1'} end={'2021-12-12'} fields="month">
  <View>${I18n.t('selectMonth')}</View>
</DatePicker>
      `}</Code>
      <DemoWrapper>
        <Demo3 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
