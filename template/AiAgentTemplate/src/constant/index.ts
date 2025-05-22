import {
  imgCloneDoneIcon,
  imgCloneRecordingIcon,
  imgCloneResetIcon,
  imgCloneStartIcon,
  imgCloneUpdateIcon,
} from '@/res';

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const themeColor = '#408CFF';

export const COLOR_MAP = {
  '1': {
    backgroundColor: 'linear-gradient(282deg, #2357F6 -8%, #26BBFF 116%)',
    circleColor: '#1270C4',
    pageCircleColor: '#2357F6',
  },
  '2': {
    backgroundColor: 'linear-gradient(107deg, #FFBC9E 18%, #FF8765 100%)',
    circleColor: '#F99A7A',
    pageCircleColor: '#FF8765',
  },
  '3': {
    backgroundColor: 'linear-gradient(103deg, #28DDC2 17%, #00CEE4 99%)',
    circleColor: '#1AC7B1',
    pageCircleColor: '#00CEE4',
  },
  '4': {
    backgroundColor: 'linear-gradient(103deg, #28BFDD 17%, #00A3E4 99%)',
    circleColor: '#09A9E2',
    pageCircleColor: '#00A3E4',
  },
  '5': {
    backgroundColor: 'linear-gradient(103deg, #9487F4 17%, #5671F7 99%)',
    circleColor: '#5F74F7',
    pageCircleColor: '#5671F7',
  },
  '6': {
    backgroundColor: 'linear-gradient(103deg, #F3CF6D 17%, #F7B148 99%)',
    circleColor: '#F7B54D',
    pageCircleColor: '#F7B148',
  },
};

/**
 * 小程序使用的App日志的tag，有需要可以自行更改，用于后期遇到线上问题，通过上传App日志检索该tag进行问题定位
 */
export const APP_LOG_TAG = 'AI_BOX_PANEL';

export const CLONE_ICON_MAP = {
  start: imgCloneStartIcon,
  update: imgCloneUpdateIcon,
  recording: imgCloneRecordingIcon,
  reset: imgCloneResetIcon,
  done: imgCloneDoneIcon,
};

export const CLONE_ZH_TIP =
  '小鸟叽叽喳喳地唱着动听的歌，五颜六色的花朵随风舞动，像是在跟我打招呼，真是太美妙啦！';
export const CLONE_EN_TIP =
  "The little birds are chirping beautiful songs, and the colorful flowers are dancing in the wind as if they are greeting me. It's truly wonderful!";
