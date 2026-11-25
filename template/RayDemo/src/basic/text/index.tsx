import React, { Fragment } from 'react';

import Code from '@/common/Code';
import Header from '@/common/Header';

import Demo0 from '@/components/Text/simple';
import Demo1 from '@/components/Text/size';

import DemoWrapper from '@/common/DemoWrapper';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='Text' description={I18n.t('text')} />
      <Code>{`<Text>${I18n.t('rayDevelopment')}</Text>`}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>
      <Code>{`<Text style={{ fontSize: 24 }}>
 ${I18n.t('reactSyntax')}
</Text>`}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
