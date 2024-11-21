import { router, View } from '@ray-js/ray';

import { TopBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import styles from './index.module.less';

const StatisticsTopBar = () => {
  const handleClick = () => {
    router.push('/record');
  };

  const right = () => (
    <View
      className={styles.icon}
      style={{ WebkitMaskImage: `url(${Res.toRecord})` }}
      onClick={handleClick}
    />
  );

  return <TopBar root right={right()} title={Strings.getLang('dsc_statistics')} />;
};

export default StatisticsTopBar;
