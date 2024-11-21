import { getSystemInfoSync, View } from '@ray-js/ray';
import { Icon } from '@ray-js/svg';

import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';
import styles from './index.module.less';

const icons = {
  close:
    'M329.557333 281.9072a32.8704 32.8704 0 0 1 0.887467 0.853333l177.527467 178.449067 161.6896-171.281067a33.1776 33.1776 0 0 1 47.581866-0.682666l0.682667 0.682666a34.133333 34.133333 0 0 1 0.682667 47.581867l-162.474667 172.100267 162.269867 163.157333a34.133333 34.133333 0 0 1 0.750933 47.377067l-0.853333 0.9216a32.8704 32.8704 0 0 1-46.455467 1.604266l-0.887467-0.853333-161.6896-162.577067-155.7504 165.034667a33.1776 33.1776 0 0 1-46.865066 1.365333l-1.365334-1.365333a34.133333 34.133333 0 0 1-0.682666-47.581867l156.501333-165.853866L282.999467 331.776a34.133333 34.133333 0 0 1-0.750934-47.342933l0.853334-0.9216a32.8704 32.8704 0 0 1 46.455466-1.604267z',
  success:
    'M512 0c282.7776 0 512 229.2224 512 512s-229.2224 512-512 512S0 794.7776 0 512 229.2224 0 512 0z m279.04 362.8032a51.2 51.2 0 0 0-72.3968 0l-253.44 253.3888-108.6464-108.544a51.2 51.2 0 0 0-72.3968 72.3456l144.2304 144.1792 0.6144 0.6656a51.2 51.2 0 0 0 72.3968 0L791.04 435.2a51.2 51.2 0 0 0 0-72.3968z',
  warning:
    'M512 0c282.7776 0 512 229.2224 512 512s-229.2224 512-512 512S0 794.7776 0 512 229.2224 0 512 0z m0 665.6a76.8 76.8 0 1 0 0 153.6 76.8 76.8 0 0 0 0-153.6z m0-460.8a72.192 72.192 0 0 0-71.9872 76.6464l17.6128 281.856a54.4768 54.4768 0 0 0 108.7488 0l17.6128-281.856A72.192 72.192 0 0 0 512 204.8z',
  error:
    'M512 0c282.7776 0 512 229.2224 512 512s-229.2224 512-512 512S0 794.7776 0 512 229.2224 0 512 0zM403.4048 330.9568A51.2 51.2 0 0 0 330.9568 403.456l108.6464 108.544-108.6464 108.6464a51.2 51.2 0 0 0 72.448 72.448L512 584.3968l108.5952 108.6464a51.2 51.2 0 0 0 72.448-72.448L584.3968 512l108.6464-108.5952a51.2 51.2 0 1 0-72.448-72.448l-108.544 108.5952z',
};

const colors = {
  success: 'rgb(25, 137, 250)',
  warning: 'rgb(250 174 23)',
  error: 'rgb(255, 68, 68)',
};

const { statusBarHeight } = getSystemInfoSync();
const topBarHeight = 46;

interface Props {
  show: boolean;
  type?: 'success' | 'warning' | 'error';
  message: string;
  onHandle?: () => void;
  onClose?: () => void;
}

const Notification = ({
  show = false,
  type = 'success',
  message = '',
  onHandle,
  onClose,
}: Props) => {
  if (!show) return null;

  return (
    <View className={styles.container} style={{ top: `${statusBarHeight + topBarHeight}px` }}>
      <Icon color={colors[type]} d={icons[type]} size="40rpx" />
      <Text className={styles.message} numberOfLines={1} onClick={onHandle}>
        {message}
      </Text>
      <TouchableOpacity style={{ display: 'flex' }} onClick={onClose}>
        <Icon color="#81828B" d={icons.close} size="48rpx" />
      </TouchableOpacity>
    </View>
  );
};

export default Notification;
