import React, { useEffect, useState } from 'react';
import { List } from '@ray-js/components-ty-cell';
import { Switch, NavBar, ConfigProvider } from '@ray-js/smart-ui';
import { Image, router, View } from '@ray-js/ray';
import i18n from '../../i18n';
import res from '../../res';
import className from './index.modules.less';
import { AppQuery } from '../../functional';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { useHideMenuButton } from '../../hooks/useHideMenuButton';
import { useThrottleFn } from 'ahooks';
import { usePresetData } from '../../hooks/usePresetData';

const Home = () => {
  const dpActions = useActions();
  const presetData = usePresetData() || {};
  const currPresetData = {
    ...AppQuery,
    ...presetData,
  };

  const doNotDisturb = useProps((props) => {
    if (currPresetData.dpCode) {
      return props[currPresetData.dpCode];
    }
    return props.do_not_disturb;
  });

  useHideMenuButton();

  const [switchValue, setSwitchValue] = useState(!!doNotDisturb);
  useEffect(() => {
    setSwitchValue(!!doNotDisturb);
  }, [doNotDisturb]);

  const handleBack = () => {
    router.back();
  };

  const onHandleSave = useThrottleFn(
    () => {
      if (currPresetData.dpCode) {
        if (dpActions[currPresetData.dpCode]) {
          console.log(`[Deliver DP]`, currPresetData.dpCode, switchValue);
          dpActions[currPresetData.dpCode].set(switchValue, { throttle: 300 });
          handleBack();
          return;
        }
      }

      if (!dpActions.do_not_disturb.set) {
        console.error('Product is not configured with a Do Not Disturb During Power Outage DP!');
        return;
      }
      console.log(`[Deliver DP]`, switchValue);
      dpActions.do_not_disturb.set(switchValue, { throttle: 300 });
      handleBack();
    },
    { wait: 100 },
  ).run;

  return (
    <ConfigProvider
      themeVars={{
        navBarBackgroundColor: '#0b0909',
        navBarTitleTextColor: 'white',
        navBarIconColor: 'white',
        navBarArrowColor: 'white',
        hairlineColor: 'transparent',
        cellBackgroundColor: 'rgba(255, 255, 255, 0.10)',
        ...(presetData.smartUIThemeVars || {}),
      }}
    >
      <View className={className.homeWrapper} style={currPresetData.bgStyle}>
        <NavBar
          title={currPresetData.title || i18n.getLang('lndf_functionTitle')}
          leftArrow
          onClickLeft={handleBack}
          slot={{
            right: (
              <View className={className.rightBtn} style={{ color: currPresetData.activeColor }} onClick={onHandleSave}>
                {currPresetData.saveText || i18n.getLang('lndf_save')}
              </View>
            ),
          }}
        ></NavBar>
        <View className={className.content}>
          <View className={className.box} style={currPresetData.imgBoxStyle}>
            <Image mode="aspectFit" className={className.boxImg} src={currPresetData.boxImgUrl || res.lamp} style={currPresetData.imgStyle} />
          </View>
          <View className={className.description} style={currPresetData.descStyle}>
            {currPresetData.boxDesc || i18n.getLang('lndf_desc')}
          </View>
          <View style={{ flexGrow: 1 }} />
        </View>
        <List.Row
          className={className.controls}
          rowKey={(item) => item.className}
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            ...(currPresetData.cardStyle || {}),
          }}
          dataSource={[
            {
              className: className.controlItem,
              title: (
                <View className={className.itemHeader}>
                  <View className={className.itemTitle} style={currPresetData.cardTitleStyle}>
                    {currPresetData.buttonTitle || i18n.getLang('lndf_itemTitle')}
                  </View>
                  <View className={className.itemDesc} style={currPresetData.cardDescStyle}>
                    {currPresetData.buttonDesc || i18n.getLang('lndf_itemDesc')}
                  </View>
                </View>
              ),
              content: (
                <Switch
                  checked={switchValue}
                  onChange={(event) => {
                    setSwitchValue(event.detail);
                  }}
                  activeColor={currPresetData.activeColor}
                />
              ),
            },
          ]}
        ></List.Row>
      </View>
    </ConfigProvider>
  );
};

export default Home;
