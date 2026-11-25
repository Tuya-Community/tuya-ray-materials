import React, { Fragment } from 'react';

import Header from '@/common/Header';
import DemoWrapper from '@/common/DemoWrapper';
import Demo0 from '@/components/PickerView/basic';
import Demo1 from '@/components/PickerView/multi';
import Code from '@/common/Code';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='PickerView' description={I18n.t('scrollingPicker')} />
      <Code title={I18n.t('basic')}>{`const [current, setCurrent] = React.useState(0);

  const handlePickerChange = (e) => {
    setCurrent(e.value);
  };

  const range = ['${I18n.t('brazil')}', '${I18n.t('china')}', '${I18n.t('japan')}', '${I18n.t('usa')}'];

  return <PickerView onChange={handlePickerChange} range={range} value={current}></PickerView>;
      `}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>
      <Code title={I18n.t('basic')}>{`const [current, setCurrent] = React.useState(0);

  const handlePickerChange = (e) => {
    setCurrent(e.value);
  };

  const range = [
    ['${I18n.t('brazil')}', '${I18n.t('china')}', '${I18n.t('japan')}', '${I18n.t('usa')}'],
    ['${I18n.t('orange')}', '${I18n.t('apple')}', '${I18n.t('banana')}', '${I18n.t('watermelon')}'],
  ];

  return <PickerView onChange={handlePickerChange} range={range} value={current}></PickerView>;
      `}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
