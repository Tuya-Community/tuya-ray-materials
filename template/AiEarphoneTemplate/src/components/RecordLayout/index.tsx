import React from 'react';
import { View } from '@ray-js/components';
import TopBar from '@/components/TopBar';

const Index = ({ children, title, handleBack, slot }) => {
  return (
    <>
      <TopBar title={title} onBack={handleBack} leftIconType="down" slot={slot} />
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: 'var(--color-bg-page)',
        }}
      >
        {children}
      </View>
    </>
  );
};

export default Index;
