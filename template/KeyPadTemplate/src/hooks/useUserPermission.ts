import { UserType } from '@ray-js/lock-sdk';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectCurrentUser } from '@/redux/modules/lockHomeSlice';

export interface UserPermission {
  /** 用户信息是否已加载 */
  loaded: boolean;
  /** 当前用户 ID */
  currentUserId?: string;
  /** 拥有者 */
  isOwner: boolean;
  /** 分享成员 */
  isShare: boolean;
  /** 管理员（拥有者或管理员） */
  isManager: boolean;
  /** 普通成员 */
  isMember: boolean;
}

const handle = (user: Record<string, any> | null): UserPermission => {
  const userType = Number(user?.userType);
  const isOwner = userType === UserType.OWNER;
  const isAdmin = userType === UserType.ADMIN;
  const isShare = userType === UserType.SHARE;
  return {
    loaded: !!user,
    currentUserId: user?.userId,
    isOwner,
    isShare,
    isManager: isOwner || isAdmin,
    isMember: userType === UserType.MEMBER,
  };
};

/** 当前用户由配件 SDK 初始化后获取，按 OWNER/ADMIN/MEMBER/SHARE 派生权限。 */
const useUserPermission = (): UserPermission => {
  const currentUser = useSelectorWithEquality(selectCurrentUser);
  return handle(currentUser);
};

export default useUserPermission;
