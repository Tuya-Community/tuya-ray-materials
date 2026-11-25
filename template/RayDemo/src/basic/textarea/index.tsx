import React, { Fragment } from 'react';

import Code from '@/common/Code';
import DemoWrapper from '@/common/DemoWrapper';
import Header from '@/common/Header';
import Demo0 from '@/components/Textarea/simple';
import Demo1 from '@/components/Textarea/autoHeight';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='Textarea' description={I18n.t('textarea')} />
      <Code>{`<Textarea
  style={{ fontSize: 40 }}
  value={'${I18n.t('defaultText')}'}
/>
`}</Code>
      <DemoWrapper>
        <Demo0 />
      </DemoWrapper>
      <Code title='autoHeight: true'>{`<Textarea autoHeight />
`}</Code>
      <DemoWrapper>
        <Demo1 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
