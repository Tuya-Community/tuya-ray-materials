/* eslint-disable no-console */
import { Text, View, Image } from '@ray-js/ray';
// eslint-disable-next-line import/no-unresolved
import { router } from 'ray';
import React, { useEffect, ReactNode, useState } from 'react';
import './index.less';
import { useSafeArea } from '../../hooks';
import Res from '../../res';
import Button from '../Button';

interface propsParam {
  theme: 'light' | 'dark';
  background: string;
  color: string;
  title: string;
  showBack?: boolean;
  rightView?: ReactNode;
  onCancel?: () => void;
}

function TopHeader(props: propsParam) {
  const { title, showBack = true, rightView, background, color, theme, onCancel } = props;
  const [_showBack, setShowBack] = useState(showBack);
  const safeArea = useSafeArea();
  useEffect(() => {
    const routes = router?.scheduler?.$pathMap || [];
    setShowBack(routes.length >= 2);

    ty.hideMenuButton();
  }, []);

  const back = () => {
    if (!onCancel) {
      router.back();
    }
    onCancel && onCancel();
  };

  return (
    <View className="topHeader" style={{ background, color, height: `${safeArea + 44}px` }}>
      <View
        style={{
          height: `${safeArea}px`,
        }}
      />
      <View className="topBar">
        <View className="topBarLeft" onClick={back}>
          {showBack && _showBack && (
            <Button onClick={back}>
              <Image
                src={theme === 'dark' ? Res.iconArrowLeft : Res.iconArrowLeftWhite}
                style={{
                  width: '24px',
                  height: '24px',
                  position: 'relative',
                  top: '5.5px',
                  left: '2px',
                }}
              />
            </Button>
          )}
        </View>
        <Text className="text">{title}</Text>
        <View className="topBarRight">{rightView}</View>
      </View>
    </View>
  );
}

TopHeader.defaultProps = {
  showBack: true,
  rightView: null,
  onCancel: null,
};

export default TopHeader;
