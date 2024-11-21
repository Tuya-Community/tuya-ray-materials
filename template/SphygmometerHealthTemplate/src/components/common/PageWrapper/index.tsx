import { memo } from 'react';
import { ViewProps } from '@ray-js/components/lib/View';
import { getSystemInfoSync, View } from '@ray-js/ray';
import clsx from 'clsx';

import styles from './index.module.less';

const { safeArea } = getSystemInfoSync();
const topBarHeight = 46;
const tabBarHeight = 55;

const getWrapperHeight = (hasTopBar: boolean, hasTabBar: boolean) =>
  safeArea.height - (hasTabBar ? tabBarHeight + 16 : 0) - (hasTopBar ? topBarHeight : 0);

interface Props extends ViewProps {
  hasTopBar?: boolean;
  hasTabBar?: boolean;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  paddingTop?: string;
}

const PageWrapper = ({
  hasTopBar = true,
  hasTabBar = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  className,
  style,
  children,
  ...otherProps
}: Props) => {
  return (
    <View
      className={clsx(styles.container, className)}
      style={{
        height: `${getWrapperHeight(hasTopBar, hasTabBar)}px`,
        top: `${safeArea.top + (hasTopBar ? topBarHeight : 0)}px`,
        justifyContent,
        alignItems,
        ...style,
      }}
      {...otherProps}
    >
      {children}
    </View>
  );
};

export default memo(PageWrapper);
