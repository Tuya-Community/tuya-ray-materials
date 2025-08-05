// example无法跨src调用外部组件
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { View } from '@ray-js/components';
import Slider from '@ray-js/components-ty-slider/lib/SjsSlider';
import { toStyle } from '@ray-js/components-ty-slider';

import { defaultProps, IProps } from './props';

function LampColorSlider(props: IProps) {
  const preHue = useRef(-1);
  const lastHue = useRef(-1);
  const timer = useRef(null);
  const timer1 = useRef(null);
  const {
    value: hue,
    trackStyle = {},
    thumbStyle = {},
    disable,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    enableTouch = true,
    useCustomThumbStyle,
    useCustomTrackStyle,
  } = props;

  const startRefVal = useRef(-1);
  const handleTouchStart = ({ detail }) => {
    if (!onTouchStart || disable) {
      return;
    }
    if (detail.end === startRefVal.current) {
      return;
    }
    onTouchStart && onTouchStart(detail.end);
    startRefVal.current = detail.end;
  };

  const handTouchMove = ({ detail }) => {
    if (!onTouchMove || disable) {
      return;
    }
    lastHue.current = detail.end;
    if (detail.end === preHue.current) {
      return;
    }
    if (timer.current) {
      return;
    }
    const touchMoveDelay = 50; // 移动更新的频率
    const touchMoveEndDelay = 200; // 移动结束后多久进行更新
    timer.current = setTimeout(() => {
      onTouchMove && onTouchMove(detail.end);
      preHue.current = detail.end;
      clearTimeout(timer.current);
      timer.current = null;

      clearTimeout(timer1.current);
      timer1.current = null;
      timer1.current = setTimeout(() => {
        if (lastHue.current !== preHue.current) {
          onTouchMove && onTouchMove(lastHue.current);
        }
      }, touchMoveEndDelay);
    }, touchMoveDelay);
  };
  const endRefVal = useRef(-1);
  const handleTouchEnd = ({ detail }) => {
    if (!onTouchEnd || disable) {
      return;
    }
    if (detail.end === endRefVal.current) {
      return;
    }
    onTouchEnd && onTouchEnd(detail.end);
    endRefVal.current = detail.end;
  };
  const min = 0;
  const max = 359;
  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-10)}`
  );
  const [controllerHue, setControllerHue] = useState(-1);

  useEffect(() => {
    if (preHue.current !== hue) {
      setControllerHue(hue);
    }
  }, [hue]);

  const bg =
    'linear-gradient(to right, hsl(0, 100%, 50%) 0%, hsl(36, 100%, 50%) 10%, hsl(72, 100%, 50%) 20%, hsl(108, 100%, 50%) 30%,hsl(144, 100%, 50%) 40%, hsl(180, 100%, 50%) 50%, hsl(216, 100%, 50%) 60%, hsl(223, 100%, 50%) 62%, hsl(234, 100%, 50%) 65%,  hsl(244, 100%, 50%) 68%, hsl(252, 100%, 50%) 70%,  hsl(288, 100%, 50%) 80%, hsl(324, 100%, 50%) 90%, hsl(0, 100%, 50%) 100%)';
  return (
    <View style={{ position: 'relative' }}>
      <Slider
        instanceId={props.instanceId || instanceId.current}
        min={min}
        max={max}
        disable={disable}
        end={controllerHue}
        step={1}
        hidden={props.hidden}
        bindstart={handleTouchStart}
        enableTouch={enableTouch}
        endEventName={props.endEventName}
        startEventName={props.startEventName}
        moveEventName={props.moveEventName}
        bindmove={handTouchMove}
        bindend={handleTouchEnd}
        trackStyle={toStyle({
          width: `${646}rpx`,
          height: `${88}rpx`,
          borderRadius: `${28}rpx`,
          ...trackStyle,
          background: useCustomTrackStyle ? trackStyle?.background : bg,
        })}
        barStyle={toStyle({
          background: 'transparent',
        })}
        thumbStyle={toStyle({
          width: '32rpx',
          height: '104rpx',
          border: `9rpx solid #fff`,
          borderRadius: '28rpx',
          background: `${disable ? '#000' : 'transparent'}`,
          ...thumbStyle,
        })}
        thumbStyleRenderFormatter={
          useCustomThumbStyle
            ? (thumbStyle as any)
            : {
                background: 'hsl(valuedeg 100% 50%)',
              }
        }
      />
    </View>
  );
}

LampColorSlider.defaultProps = defaultProps;

export default LampColorSlider;
