import { useSelector } from '@/redux';
import { getAvatarPath } from '@/utils';

/**
 * 根据性别获取默认用户头像路径
 * @param sex 性别
 * @returns 头像路径
 */
const useDefaultAvatarPath = (sex: number) => {
  const avatars = useSelector(state => state.uiState.avatars);
  // avatar9: 默认男性头像, avatar3: 默认女性头像
  const avatar = avatars.find(item => item?.key === `avatar${sex === 1 ? '3' : '9'}`)?.fullUrl;
  return getAvatarPath(avatar);
};

export default useDefaultAvatarPath;
