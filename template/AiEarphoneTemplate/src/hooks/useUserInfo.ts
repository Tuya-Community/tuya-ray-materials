import { useEffect } from 'react';
import store from '@/redux';
import { initializeUserInfo, updateUserInfo } from '@/redux/modules/userInfoSlice';
import { atopGetImageHost } from '@/api/common';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import Res from '@/res';

/**
 * 处理用户信息初始化的 hook
 */
export const useUserInfo = () => {
  useEffect(() => {
    ty.getUserInfo({
      success: async (d: any) => {
        const { avatarUrl } = d;
        store.dispatch(initializeUserInfo(d));
        try {
          const imageHost = (await atopGetImageHost()) as string;
          const imgUrl = avatarUrl
            ? /https/.test(avatarUrl)
              ? avatarUrl
              : `${imageHost}/${avatarUrl}`
            : Res.imgDefaultAvatar;
          store.dispatch(
            updateUserInfo({
              avatarUrl: imgUrl,
            })
          );
          store.dispatch(
            updateUiState({
              imageHost,
            })
          );
        } catch { }
      },
    });
  }, []);
};
