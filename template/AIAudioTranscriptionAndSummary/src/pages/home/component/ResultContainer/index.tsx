import React, { FC } from 'react';
import { ScrollView } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';

interface Props {
  children: React.ReactNode;
}

const ResultContainer: FC<Props> = ({ children }) => {
  const {
    statusBarHeight,
    screenHeight,
    safeArea: { bottom },
  } = useSelector(selectSystemInfo);
  const topBarHeight = statusBarHeight + 44;
  const safeBottomHeight = screenHeight - bottom;
  return (
    <ScrollView
      style={{
        width: '100%',
        height: `${(screenHeight - safeBottomHeight - topBarHeight) * (2 / 3) - 40}px`,
      }}
      refresherTriggered={false}
      scrollY
    >
      {children}
    </ScrollView>
  );
};

export default ResultContainer;
