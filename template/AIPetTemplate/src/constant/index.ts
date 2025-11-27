import dayjs from 'dayjs';
import { iconBoy, iconGirl, iconSterilizedBoy, iconSterilizedGirl } from '@/res/iconsvg';
import Strings from '@/i18n';
import { getCdnPath } from '@/utils';

// 智能体 ID，修改为产品配置的智能体 ID
export const AGENT_ID = 'xxx';

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const THEME_COLOR = '#FFD974';

export const GAME_BTN_MAP = {
  top: {
    img: getCdnPath('gameBtnTop.png'),
    imgPressed: getCdnPath('gameBtnTopPressed.png'),
    value: '0',
  },
  right: {
    img: getCdnPath('gameBtnRight.png'),
    imgPressed: getCdnPath('gameBtnRightPressed.png'),
    value: '2',
  },
  bottom: {
    img: getCdnPath('gameBtnBottom.png'),
    imgPressed: getCdnPath('gameBtnBottomPressed.png'),
    value: '4',
  },
  left: {
    img: getCdnPath('gameBtnLeft.png'),
    imgPressed: getCdnPath('gameBtnLeftPressed.png'),
    value: '6',
  },
  play: {
    img: getCdnPath('gameBtnPlay.png'),
    imgPressed: getCdnPath('gameBtnPlayPressed.png'),
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
    imgCat: getCdnPath('catNormal.png'),
    imgDog: getCdnPath('dogNormal.png'),
  },
  {
    code: 2,
    text: Strings.getLang('pet_activeness_active'),
    imgCat: getCdnPath('catActive.png'),
    imgDog: getCdnPath('dogActive.png'),
  },
  {
    code: 0,
    text: Strings.getLang('pet_activeness_lazy'),
    imgCat: getCdnPath('catLazy.png'),
    imgDog: getCdnPath('dogLazy.png'),
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

// 上传类型
// AI助手上传 eg: 聊天问诊
export const COMMON_BIZ_TYPE = 'pet_assistant';
// 分析上传 eg: 正面照分析
export const ANALYTICS_BIZ_TYPE = 'pet_frontal_image';
/**
 * 视频或图片标题的最大长度
 */
export const MAX_TITLE_NUM = 16;

/**
 * 视频的最大裁剪时长
 */
export const VIDEO_CLIP_MAX_TIME = 30;
/**
 * 从 App 相册中可选择的最大图片数量
 */
export const MAX_CHOOSE_IMAGE_NUM = 20;

/**
 * 从 App 相册中可选择的最大视频数量
 */
export const MAX_CHOOSE_VIDEO_NUM = 1;

/**
 * 可同时编辑发送的最大图片数量
 * 直接获取云端配置
 */
// export const MAX_EDIT_IMAGE_NUM = 20;

/**
 * 可同时编辑发送的最大视频数量
 */
export const MAX_EDIT_VIDEO_NUM = 1;
