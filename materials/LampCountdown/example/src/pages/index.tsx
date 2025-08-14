import React, { useEffect } from 'react';
import { hideMenuButton, navigateTo, View } from '@ray-js/ray';

export default function Home() {
  const handleClick = () => {
    navigateTo({
      url: '/pages/countdown/index',
      type: 'half',
      topMargin: `${0}px`,
      success(params) {
        console.warn(params);
      },
      fail(params) {
        console.warn(params);
      },
    });
  };

  useEffect(() => {
    hideMenuButton();
    setTimeout(() => {
      handleClick();
    }, 100)
  }, []);

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100vw',
          height: '40px',
          lineHeight: '40px',
          color: '#fff',
          borderRadius: '20px',
          backgroundColor: '#4e80ef',
          marginBottom: '40px',
          textAlign: 'center',
        }}
        onClick={handleClick}
      >
        Countdown Show
      </View>
    </View>
  );
}
