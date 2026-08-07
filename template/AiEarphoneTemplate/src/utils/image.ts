import Res from '@/res';

// 获取模板图标
export const getTemplateIcon = (icon: string) => {
  if (!icon) {
    return Res.modeLiveRecordIcon;
  }
  // 如果是URL，直接使用
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon;
  }

  // 默认图标
  return Res.modeLiveRecordIcon;
};
