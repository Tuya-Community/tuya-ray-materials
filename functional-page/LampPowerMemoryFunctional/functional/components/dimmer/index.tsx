import React, { useEffect } from 'react';
import { DpState, useSupport } from '@ray-js/panel-sdk';
import { useCreation } from 'ahooks';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
import { CollectColors } from '../collect-colors';
import { Box } from '../box';
import { TabBar } from '../tab-bar';
import { White } from './White';
import { Colour } from './Colour';

interface IColour {
  hue: number;
  saturation: number;
  value: number;
}

type WorkMode = 'white' | 'colour';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  contentClassName?: string;
  showTitle?: boolean;
  mode: WorkMode;
  temperature: number;
  brightness: number;
  colour: IColour;
  validWorkMode?: WorkMode[];
  fontColor?: string;
  themeColor?: string;
  background?: string;
  collectBorderColor?: string;
  onModeChange?: (v: string) => void;
  /**
   * 收藏彩光颜色选中或色温、亮度、彩光色相、饱和度、亮度选中回调
   */
  onRelease: (code: string, value: any) => void;
  /**
   * 收藏白光选中回调
   */
  onReleaseWhite: (cmd: DpState) => void;
  /**
   * 彩光色相、饱和度、亮度或白光的色温、亮度变更的回调
   */
  onChange?: (isColor: boolean, value: any) => void;
  setScrollEnabled?: (v: boolean) => void;
}

export const Dimmer = React.memo((props: IProps) => {
  const {
    collectBorderColor,
    background,
    showTitle,
    mode,
    themeColor,
    fontColor,
    style,
    className,
    contentClassName,
    temperature,
    brightness,
    colour,
    validWorkMode = ['white', 'colour'],
    onModeChange,
    onRelease,
    onChange,
    onReleaseWhite,
    setScrollEnabled,
  } = props;

  const support = useSupport();

  // 如果模式不在调光，自动切成白/彩光
  useEffect(() => {
    if (!workModeTabs.includes(mode)) {
      onModeChange(workModeTabs[0]);
    }
  }, [mode]);

  // 根据支持的路数生成 tabBar
  const workModeTabs = useCreation(() => {
    const tabs = [];
    if ((support.isSupportTemp() || support.isSupportBright()) && validWorkMode.includes('white')) {
      tabs.push('white');
    }
    if (support.isSupportColour() && validWorkMode.includes('colour')) {
      tabs.push('colour');
    }
    return tabs;
  }, []);

  const handleChooseColor = (data: COLOUR & WHITE) => {
    const { hue, saturation, value, brightness: bright, temperature: temp } = data;
    if (mode === 'colour') {
      onRelease?.(dpCodes.colour_data, { hue, saturation, value });
    } else {
      onReleaseWhite?.({ [dpCodes.bright_value]: bright, [dpCodes.temp_value]: temp });
    }
  };

  const DimmerContent = useCreation(() => {
    const commonProps = { onChange, onRelease, setScrollEnabled };
    const genStyle = (m: WorkMode) => {
      return {
        visibility: mode === m ? 'visible' : 'hidden',
        position: mode === m ? 'relative' : 'absolute',
        top: 0,
      } as React.CSSProperties;
    };
    return (
      <>
        <Colour
          {...commonProps}
          fontColor={fontColor}
          themeColor={themeColor}
          background={background}
          style={genStyle('colour')}
          colour={props.colour}
        />
        <White
          {...commonProps}
          style={genStyle('white')}
          fontColor={fontColor}
          background={background}
          themeColor={themeColor}
          brightness={props.brightness}
          temperature={props.temperature}
        />
      </>
    );
  }, [mode, props.brightness, props.temperature, props.colour]);

  return (
    <Box
      style={style}
      className={className}
      contentClassName={contentClassName}
      title={showTitle ? Strings.getLang('lpmf_dimming') : ''}
    >
      {workModeTabs.length > 1 && (
        <TabBar
          itemWidth={`${100 / (workModeTabs.length ?? 2)}%`}
          itemHeight={56}
          fontColor={fontColor}
          background={background}
          themeColor={themeColor}
          value={['colour', 'white'].includes(mode) ? mode : 'white'}
          tabList={workModeTabs}
          onClick={v => onModeChange?.(v)}
        />
      )}
      {['white', 'colour'].indexOf(mode) !== -1 && (
        <CollectColors
          style={{ justifyContent: 'start', width: '100%', margin: '32rpx 0' }}
          isColor={mode === 'colour'}
          colourData={colour}
          collectBorderColor={collectBorderColor}
          brightness={brightness}
          temperature={temperature}
          chooseColor={data => handleChooseColor?.(data)}
        />
      )}
      {DimmerContent}
    </Box>
  );
});
