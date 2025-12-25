import { DrawColor } from './type';

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const CLOUD_KEY_MYCOLORS = 'my_colors';
export const CLOUD_KEY_MYTEMPCOLORS = 'my_temp_colors';
export const CLOUD_KEY_APP_MUSIC_ID = 'app_mic_id';
export const CLOUD_KEY_LOCAL_MUSIC_ID = 'loc_mic_id';
export const CLOUD_KEY_LOCAL_MUSIC_SI = 'loc_mic_si';
export const CLOUD_KEY_SCENE_ID = 'scene_mic_id';
export const CLOUD_KEY_SCENE_DIY_ID = 'scene_mic_diy_id';
export const CLOUD_KEY_MUSIC_MODE = 'music_mode';
export const CLOUD_RANDOM_COLOR_ID = 'rdm_id';
export const CLOUD_KEY_DIY_SCENE = 'diy_scenes';
export const CLOUD_KEY_DIY_SCENE_P = 'diy_draws';
export const CLOUD_KEY_SCENE_PREVIEW = 'scenes_preview';

export const PRODUCT_CODE = 'LIGHT_SCENE_LIBRARY';

export const WORK_MODE_PRE_COLOR_MODE = 'color_mode';
export const WORK_MODE_SCENE_MODE = 'scene_mode';
export const WORK_MODE_SCENE_MODE_DIY = 'scene_mode_diy';

export const lightStripDataKey = 'lightStripDataList2'; // 灯带存储的key
export const ledNumberKey = 'ledNumber'; // 灯带存储的key

export const maxSelectedColorNum = 8; // 最大选中颜色数

export const CLEAR_COLOR: DrawColor = {
  hue: 0,
  saturation: 0,
  value: 0,
  brightness: 0,
  temperature: 0,
  isWhite: false,
};

export const drawDataListKey = 'drawDataList';
