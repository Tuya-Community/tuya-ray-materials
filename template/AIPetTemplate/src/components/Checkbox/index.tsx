import React, { FC } from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { iconTickSmall } from '@/res/iconsvg';

import './index.less';

const prefixCls = 'rayui-checkbox';

type Props = {
  checked: boolean;
  style?: React.CSSProperties;
  onChange: (checked: boolean) => void;
};

const Checkbox: FC<Props> = ({ checked, style, onChange }) => {
  return (
    <View
      hoverClassName="touchable"
      className={clsx(prefixCls, checked && 'checked')}
      style={style}
      onClick={() => onChange(!checked)}
    >
      <Icon
        name={iconTickSmall}
        size="24rpx"
        color="#fff"
        customClass={clsx(`${prefixCls}-tick`)}
      />
    </View>
  );
};

export default Checkbox;
