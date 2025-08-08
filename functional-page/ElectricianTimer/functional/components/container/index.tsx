import React, { FC, useMemo } from 'react';
import { getSystemInfoSync, useQuery, View } from '@ray-js/ray';
import styles from './index.module.less';

const state = {
  bgImgUrl: '',
};

const Container: FC = (props) => {
  const query = useQuery();

  // 这里要同步取到 bgImgUrl， useConfig是异步的，所以这里直接从query取
  const style = useMemo<React.CSSProperties>(() => {
    state.bgImgUrl = state.bgImgUrl || decodeURIComponent(query.bgImgUrl);

    if (!/^http/.test(state.bgImgUrl)) {
      return {};
    }
    const system = getSystemInfoSync();
    const isDark = system?.theme === 'dark';

    const darkStyle = {
      '--container-bg-color': '#587287',
      '--popup-background-color': '#587287',
      '--popup-cell-item-color': 'transparent',
      '--action-sheet-item-background': 'transparent',
    };
    const lightStyle = {
      '--container-bg-color': '#c0c0c05e',
      '--popup-background-color': '#c0c0c05e',
      '--popup-cell-item-color': 'transparent',
      '--action-sheet-item-background': 'transparent',
    };

    return {
      backgroundImage: `url("${state.bgImgUrl}")`,
      ...(isDark ? darkStyle : lightStyle),
    };
  }, [query?.bgImgUrl]);

  return (
    <View className={styles.container} style={style}>
      {props.children}
    </View>
  );
};

export default Container;
