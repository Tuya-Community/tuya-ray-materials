import React, { Fragment } from 'react';

import Header from '@/common/Header';
import Code from '@/common/Code';
import Demo0 from '@/components/Radio/basic';
import Demo1 from '@/components/Radio/checked';
import Demo2 from '@/components/Radio/disabled';
import Demo3 from '@/components/Radio/group';
import Demo4 from '@/components/Radio/groupDisabled';

import DemoWrapper from '@/common/DemoWrapper';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='Radio' description='Radio' />
      <Code title={I18n.t('basicUsage')}>{`<Radio color='#ff0000' />`}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>

      <Code title={I18n.t('defaultSelected')}>{`<Radio checked/>`}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>

      <Code title={I18n.t('disabled')}>{`<Radio disabled/>`}</Code>
      <DemoWrapper>
        <Demo2 />
      </DemoWrapper>

      <Code title={I18n.t('dataGroup')}>{`
const changeRadio = (e) => {
  console.log('RadioGroup onChange fired', e);
};
let options = [
  { label: 'Apple', value: 'Apple', color: '#ff00ff' },
  { label: 'Pear', value: 'Pear', checked: true },
  { label: 'Orange', value: 'Orange', disabled: true, checked: true },
];
return <RadioGroup onChange={changeRadio} options={options} />;
      `}</Code>
      <DemoWrapper>
        <Demo3 />
      </DemoWrapper>

      <Code title={I18n.t('allDisabled')}>{`
let options = [
  { label: 'Apple', value: 'Apple', color: '#ff00ff' },
  { label: 'Pear', value: 'Pear', checked: true },
  { label: 'Orange', value: 'Orange', disabled: true },
];
return <RadioGroup disabled options={options} />;
      `}</Code>
      <DemoWrapper>
        <Demo4 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
