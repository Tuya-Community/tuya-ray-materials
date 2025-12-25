/*
 * @Author: mjh
 * @Date: 2024-09-14 11:49:22
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-12 09:37:35
 * @Description:
 */
import React, { useMemo } from 'react';
import { useScrollControl } from '@/hooks/useScrollControl';
import { rpx2px } from '@/utils/utils';
import { IProps, defaultProps } from './props';
import Component from './components';

const classPrefix = 'point-light-belt';
const PointLightBelt = (props: IProps) => {
  const {
    selectList,
    style,
    eventChannelName,
    lightColorMaps,
    length,
    mode,
    className,
    bright,
    onSelectChange,
    onChannel,
    maxSelect,
    onMaxSelectTrigger,
    instanceId,
    initWait,
    eventSliderMoveName,
  } = props;
  const bindSelectChange = e => {
    onSelectChange?.(e.detail);
  };

  const { scrollTop } = useScrollControl();

  const rpx2pxOne = useMemo(() => {
    return rpx2px(1);
  }, []);
  return (
    <Component
      mode={mode}
      initWait={initWait}
      eventChannelName={eventChannelName}
      selectList={selectList}
      bright={bright}
      contentStyle={style}
      className={className}
      maxSelect={maxSelect}
      length={length}
      lightColorMaps={lightColorMaps}
      instanceId={instanceId}
      bindselectchange={bindSelectChange}
      bindchannel={onChannel}
      bindselectmaxchange={onMaxSelectTrigger}
      eventSliderMoveName={eventSliderMoveName}
      scrollTop={scrollTop}
      rpx2px={rpx2pxOne}
    />
  );
};

PointLightBelt.defaultProps = defaultProps;
PointLightBelt.displayName = classPrefix;
export default PointLightBelt;
