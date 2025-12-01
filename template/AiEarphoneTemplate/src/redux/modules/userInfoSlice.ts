import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type UserInfo = {
  avatarUrl: string;
  isTemporaryUser: boolean;
  nickName: string;
  phoneCode: string;
  regionCode: string; // 国家地区码
  data: {
    [key: string]: string | number | boolean;
  };
};
type UserInfoKey = keyof UserInfo;

/**
 * Slice
 */
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    avatarUrl: '',
    isTemporaryUser: false,
    nickName: '',
    phoneCode: '',
  } as UserInfo,
  reducers: {
    initializeUserInfo(state, action: PayloadAction<UserInfo>) {
      return action.payload;
    },
    updateUserInfo(state, action: PayloadAction<Partial<UserInfo>>) {
      Object.assign(state, action.payload);
    },
  },
});

/**
 * Actions
 */

export const { initializeUserInfo, updateUserInfo } = userInfoSlice.actions;

/**
 * Selectors
 */
export const selectUserInfo = (state: ReduxState) => state.userInfo;

type SelectUserInfoByKey = <T extends UserInfoKey>(dpCode: T) => (state: ReduxState) => UserInfo[T];
export const selectUserInfoByKey: SelectUserInfoByKey = key => state => state.userInfo[key];

export default userInfoSlice.reducer;
