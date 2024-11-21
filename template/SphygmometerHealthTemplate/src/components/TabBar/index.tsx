import { utils } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';
import { SmartEvent, Tabbar, TabbarItem } from '@ray-js/smart-ui';
import { Icon } from '@ray-js/svg';

import { grayColor } from '@/config';
import { TabType } from '@/constant';
import Strings from '@/i18n';
import icons from '@/icons';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import styles from './index.module.less';

const TabBar = () => {
  const tab = useSelector(({ uiState }) => uiState.tab);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const themeColor2 = utils.hex2rgbString(themeColor, 0.4);

  const tabs = [
    {
      name: Strings.getLang('dsc_measure'),
      type: TabType.Measure,
      icon: icons.measure,
      activeColor: [themeColor, themeColor2, themeColor],
      inactiveColor: ['#a8b3b4', '#e6e6e6', '#a8b3b4'],
    },
    {
      name: Strings.getLang('dsc_statistics'),
      type: TabType.Statistics,
      icon: icons.statistics,
      activeColor: [themeColor, themeColor2],
      inactiveColor: ['#a8b3b4', '#e6e6e6'],
    },
    {
      name: Strings.getLang('dsc_me'),
      type: TabType.Me,
      icon: icons.me,
      activeColor: [themeColor, themeColor2],
      inactiveColor: ['#a8b3b4', '#e6e6e6'],
    },
  ];

  const onChange = (e: SmartEvent<TabType>) => {
    updateUI({ tab: e.detail });
  };

  return (
    <Tabbar
      placeholder
      safeAreaInsetBottom
      active={tab}
      activeColor={themeColor}
      inactiveColor={grayColor}
      onChange={onChange}
    >
      {tabs.map(tab => (
        <TabbarItem key={tab.type} name={tab.type}>
          {/* @ts-ignore */}
          <View slot="icon-active">
            <Icon className={styles.icon} color={tab.activeColor} d={tab.icon} />
          </View>
          {/* @ts-ignore */}
          <View slot="icon">
            <Icon className={styles.icon} color={tab.inactiveColor} d={tab.icon} />
          </View>
          {tab.name}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};

export default TabBar;
