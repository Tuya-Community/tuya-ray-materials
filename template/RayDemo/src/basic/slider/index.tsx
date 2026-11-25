import React, { Fragment } from 'react';

import Header from '@/common/Header';
import Code from '@/common/Code';
import Demo0 from '@/components/Slider/basic';
import Demo1 from '@/components/Slider/step';
import Demo2 from '@/components/Slider/value';
import Demo3 from '@/components/Slider/max';
import Demo4 from '@/components/Slider/color';
import DemoWrapper from '@/common/DemoWrapper';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='Slider' description={I18n.t('slider')} />
      <Code title={I18n.t('basicUsage')}>{`<Slider />`}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>
      <Code title={I18n.t('setStep')}>{`<Slider step={5} />`}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>
      <Code title={I18n.t('showValue')}>{`<Slider step={5} showValue />`}</Code>
      <DemoWrapper>
        <Demo2 />
      </DemoWrapper>
      <Code title={I18n.t('setRange')}>{`<Slider min={50} max={200} showValue />`}</Code>
      <DemoWrapper>
        <Demo3 />
      </DemoWrapper>
      <Code title={I18n.t('sliderColors')}>{`<Slider step={5} showValue activeColor="ogange" blockColor="pink" />`}</Code>
      <DemoWrapper>
        <Demo4 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
