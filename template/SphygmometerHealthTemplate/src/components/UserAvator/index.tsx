import { useEffect, useState } from 'react';
import { Image, ScrollView, View } from '@ray-js/ray';
import { Icon, Popup } from '@ray-js/smart-ui';
import { Icon as Svg } from '@ray-js/svg';
import CheckMarkIcon from '@tuya-miniapp/icons/dist/svg/Checkmark';

import strings from '@/i18n';
import icons from '@/icons';
import { useSelector } from '@/redux';
import { Text, TouchableOpacity } from '../common';
import styles from './index.module.less';

interface Props {
  size?: 'medium' | 'small' | number;
  d?: string; // icon 路径 传了优先展示
  path?: string;
  showDefault?: number; // 0 男生 1 女生 -1 不展示默认头像
  isSelect?: boolean; // 是否可选
  onSelect?: (path: string) => void; // 选择头像
}

const UserAvator = ({ size = 'medium', path, showDefault = 0, d, isSelect, onSelect }: Props) => {
  const sizeNum = typeof size === 'number' ? size : size === 'small' ? 64 : 120;
  const avatars = useSelector(state => state.uiState.avatars);
  const sizeStyle = {
    width: `${sizeNum}rpx`,
    height: `${sizeNum}rpx`,
    borderRadius: `${sizeNum / 2}`,
  };
  const [defaultPath, setDefaultPath] = useState('');
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectAvatarPath, setSelectAvatarPath] = useState('');
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  // 兼容头像路径
  const avatarPath = path?.includes('https://')
    ? path
    : avatars.find(item => item?.uri.trim() === path)?.fullUrl;

  useEffect(() => {
    // 默认头像显示
    if (!d && !path && showDefault !== -1) {
      const avatar = avatars.find(
        item => item?.key === `avatar${showDefault === 0 ? '9' : '3'}`
      )?.fullUrl;
      setDefaultPath(avatar);
    }
  }, [showDefault, path, d, avatars]);

  /**
   * 头像被点击，打开头像选择弹窗
   */
  const onAvatarPress = () => {
    if (!isSelect) return;
    setShowSelectModal(true);
  };
  /**
   * 完成头像选择
   */
  const onSelectAvatarDone = () => {
    selectAvatarPath && onSelect && onSelect(selectAvatarPath);
    setSelectAvatarPath('');
    setShowSelectModal(false);
  };

  return (
    <View>
      <View onTouchEnd={onAvatarPress}>
        {!d && (path || defaultPath) ? (
          <Image
            src={avatarPath || defaultPath}
            style={{
              height: `${sizeNum}rpx`,
              width: `${sizeNum}rpx`,
              borderRadius: `${sizeNum / 2}`,
            }}
          />
        ) : (
          <Svg d={d || icons.iconAvatar} size={`${sizeNum}rpx`} style={{ opacity: 0.5 }} />
        )}
      </View>
      <Popup position="bottom" show={showSelectModal} onClose={() => setShowSelectModal(false)}>
        <View className={styles.selectModalBox}>
          <View className={styles.selectModalHeaderBox}>
            <Text className={styles.selectModalHeaderTitleBox}>
              {strings.getLang('dsc_avatarTitle')}
            </Text>
            <TouchableOpacity
              className={styles.selectModalHeaderRightBox}
              onClick={onSelectAvatarDone}
            >
              <Text className={styles.selectModalHeaderRightText} color={themeColor}>
                {strings.getLang('dsc_avatarDone')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView scrollY>
            <View className={styles.selectModalContainerBox}>
              {avatars?.map(({ fullUrl }) => (
                <View
                  className={styles.selectModalContainerItemBox}
                  key={fullUrl}
                  onTouchEnd={() =>
                    setSelectAvatarPath(selectAvatarPath === fullUrl ? '' : fullUrl)
                  }
                >
                  <Image className={styles.selectModalContainerImageBox} src={fullUrl} />
                  {selectAvatarPath === fullUrl && (
                    <Icon
                      className={styles.selectModalContainerImageIcon}
                      color={themeColor}
                      name={CheckMarkIcon}
                      size="40rpx"
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Popup>
    </View>
  );
};

export default UserAvator;
