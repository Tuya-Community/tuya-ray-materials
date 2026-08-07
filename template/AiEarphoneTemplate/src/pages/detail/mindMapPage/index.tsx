import React, { FC, useEffect } from 'react';
import { View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import MarkmapRender from '@/components/MarkmapRender';

const MindMapView: FC = () => {
  const { theme } = useSelector(selectSystemInfo);
  const tempMarkdownText = useSelector(selectUiStateByKey('tempMarkdownText'));

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  return (
    <View
      style={{
        width: '100vw',
        height: '65vh',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
      }}
    >
      <MarkmapRender markdown={tempMarkdownText} theme={theme} />
    </View>
  );
};

export default React.memo(MindMapView);
