import { getEnumRangeIsValid } from '@/utils';

export const getZoomData = () => {
  return [
    {
      type: 'zoomIn',
      show: getEnumRangeIsValid('zoom_control', '0'),
      dpValue: '0',
      icon: 'zoom-in',
    },
    {
      type: 'zoomOut',
      show: getEnumRangeIsValid('zoom_control', '1'),
      dpValue: '1',
      icon: 'zoom-out',
    },
  ];
};

export const getPtzData = () => {
  return [
    { type: 'top', show: getEnumRangeIsValid('ptz_control', '0'), dpValue: '0', icon: 'ptz-arrow' },
    {
      type: 'right',
      show: getEnumRangeIsValid('ptz_control', '2'),
      dpValue: '2',
      icon: 'ptz-arrow',
    },
    {
      type: 'left',
      show: getEnumRangeIsValid('ptz_control', '6'),
      dpValue: '6',
      icon: 'ptz-arrow',
    },
    {
      type: 'bottom',
      show: getEnumRangeIsValid('ptz_control', '4'),
      dpValue: '4',
      icon: 'ptz-arrow',
    },
  ];
};
