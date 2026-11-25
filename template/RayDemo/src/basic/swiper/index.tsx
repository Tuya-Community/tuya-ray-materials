import React, { Fragment } from 'react';

import Header from '@/common/Header';

import Demo0 from '@/components/Swiper/simple';
import Demo1 from '@/components/Swiper/autoplay';
import Demo2 from '@/components/Swiper/circular';
import Demo3 from '@/components/Swiper/vertical';
import Demo4 from '@/components/Swiper/nested';

import DemoWrapper from '@/common/DemoWrapper';

const PagePreviewer: React.FC = () => {
  return (
    <Fragment>
      <Header title='Swiper' description={I18n.t('swiper')} />
      <DemoWrapper title={I18n.t('controlledMode')}>
        <Demo0 />
      </DemoWrapper>
      <DemoWrapper title='autoplay'>
        <Demo1 />
      </DemoWrapper>
      <DemoWrapper title={I18n.t('circularSwipe')}>
        <Demo2 />
      </DemoWrapper>
      <DemoWrapper title={I18n.t('verticalSwipe')}>
        <Demo3 />
      </DemoWrapper>
      <DemoWrapper title={I18n.t('nested')}>
        <Demo4 />
      </DemoWrapper>
    </Fragment>
  );
};

export default PagePreviewer;
