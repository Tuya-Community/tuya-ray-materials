import React from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';
import './index.less';
import { defaultProps, IProps } from './props';

/**
 * TODO: 发布前，请务必修改类名前缀和组件名
 */
const classPrefix = 'rayui-template';

const Template: React.FC<IProps> = props => {
  const { className, style } = props;
  return <View className={clsx(classPrefix, className)} style={style}>Template</View>;
};

Template.defaultProps = defaultProps;
Template.displayName = 'Template';

export default Template;
