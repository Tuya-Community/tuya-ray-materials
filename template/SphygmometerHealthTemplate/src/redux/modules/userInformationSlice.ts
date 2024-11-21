import { createSlice } from '@reduxjs/toolkit';

import { HeightUnit, WeightUnit } from '@/utils/unit';

export interface UserInformation {
  userName: string;
  sex: number;
  birthday: number;
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  avatar?: string;
  userTypeCode?: string;
}

const userInformationSlice = createSlice({
  name: 'userInformation',
  initialState: {
    userName: '',
    sex: 0,
    birthday: 0,
    weight: 0,
    height: 0,
    userTypeCode: '',
    avatar: '',
    heightUnit: 'cm',
    weightUnit: 'kg',
  } as UserInformation,
  reducers: {
    updateUserInformation(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { actions } = userInformationSlice;
export const { updateUserInformation } = userInformationSlice.actions;
export default userInformationSlice.reducer;
