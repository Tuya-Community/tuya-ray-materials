import { View } from '@ray-js/ray';
import { TopBar } from '@/components';
import Strings from '@/i18n';

const RecordTopBar = () => {
  return <TopBar right={<View />} title={Strings.getLang('dsc_record')} />;
};

export default RecordTopBar;
