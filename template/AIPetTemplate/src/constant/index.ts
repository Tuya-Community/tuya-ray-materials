import dayjs from 'dayjs';
import {
  imgGameBtnBottom,
  imgGameBtnBottomPressed,
  imgGameBtnLeft,
  imgGameBtnLeftPressed,
  imgGameBtnPlay,
  imgGameBtnPlayPressed,
  imgGameBtnRight,
  imgGameBtnRightPressed,
  imgGameBtnTop,
  imgGameBtnTopPressed,
  imgCatNormal,
  imgDogNormal,
  imgCatActive,
  imgDogActive,
  imgCatLazy,
  imgDogLazy,
} from '@/res';
import { iconBoy, iconGirl, iconSterilizedBoy, iconSterilizedGirl } from '@/res/iconsvg';
import Strings from '@/i18n';

// 智能体 ID，修改为产品配置的智能体 ID
export const AGENT_ID = 'xxx';

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const THEME_COLOR = '#FFD974';

export const GAME_BTN_MAP = {
  top: {
    img: imgGameBtnTop,
    imgPressed: imgGameBtnTopPressed,
    value: '0',
  },
  right: {
    img: imgGameBtnRight,
    imgPressed: imgGameBtnRightPressed,
    value: '2',
  },
  bottom: {
    img: imgGameBtnBottom,
    imgPressed: imgGameBtnBottomPressed,
    value: '4',
  },
  left: {
    img: imgGameBtnLeft,
    imgPressed: imgGameBtnLeftPressed,
    value: '6',
  },
  play: {
    img: imgGameBtnPlay,
    imgPressed: imgGameBtnPlayPressed,
  },
} as const;

// 看宠助手数据类型
export const RECORD_DATA_TYPE = {
  feed: 1, // 宠物进食记录
  feedReport: 2, // 出粮记录
  detect: 3, // 宠物监测
} as const;

export const SEXS = [
  {
    code: 1,
    text: Strings.getLang('pet_sex_boy'),
    icon: iconBoy,
  },
  {
    code: 0,
    text: Strings.getLang('pet_sex_girl'),
    icon: iconGirl,
  },
  {
    code: 3,
    text: Strings.getLang('pet_sex_sterilized_boy'),
    icon: iconSterilizedBoy,
  },
  {
    code: 2,
    text: Strings.getLang('pet_sex_sterilized_girl'),
    icon: iconSterilizedGirl,
  },
] as const;

export const ACTIVENESSES: {
  code: number;
  text: string;
  imgCat: any;
  imgDog: any;
  styleCat?: React.CSSProperties;
  styleDog?: React.CSSProperties;
}[] = [
  {
    code: 1,
    text: Strings.getLang('pet_activeness_normal'),
    imgCat: imgCatNormal,
    imgDog: imgDogNormal,
  },
  {
    code: 2,
    text: Strings.getLang('pet_activeness_active'),
    imgCat: imgCatActive,
    imgDog: imgDogActive,
  },
  {
    code: 0,
    text: Strings.getLang('pet_activeness_lazy'),
    imgCat: imgCatLazy,
    imgDog: imgDogLazy,
    styleCat: {
      height: '320rpx',
      width: '340rpx',
      alignSelf: 'flex-start',
    },
    styleDog: {
      height: '210rpx',
      width: '354rpx',
      alignSelf: 'flex-start',
      position: 'relative',
      top: '74rpx',
    },
  },
] as const;

export const WEIGHT_COLUMN_0 = new Array(100).fill(1).map((x, i) => i);
export const WEIGHT_COLUMN_1 = new Array(10).fill(1).map((x, i) => i);
export const MIN_BIRTH_DAY = dayjs().subtract(20, 'year').valueOf();
export const MAX_BIRTH_DAY = dayjs().subtract(1, 'day').valueOf();
