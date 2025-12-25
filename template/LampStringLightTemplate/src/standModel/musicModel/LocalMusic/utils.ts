import { EMusicDpCode, ELocalMusicDp } from './types';

let _musicDpCode = null;
export const getMusicDpCode = () => {
  return _musicDpCode;
};

export const setMusicDpCode = dpSchema => {
  if (!dpSchema) {
    return _musicDpCode;
  }
  const code =
    dpSchema[ELocalMusicDp.dreamlightmic_music_data]?.code ||
    dpSchema[EMusicDpCode.music_data]?.code;
  _musicDpCode = code;
  return code;
};

export const getIconPrefix = (deviceInfo: DeviceInfo) => {
  if (!deviceInfo) {
    return '';
  }
  const { iconUrl = '' } = deviceInfo;
  const match = iconUrl.match(/^https:\/\/images\.\S+\.com/);
  const iconPrefix = match ? match[0] : '';
  return iconPrefix;
};
