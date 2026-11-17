import { getCdnUrl } from '@ray-js/ray';
import cdnImage from 'cdn/cdnImage.json';

/** 模板本地配置，开发者可按产品调整。 */
export const templateConfig = {
  themeColor: '#239C8E',
  themeImage: getCdnUrl('homeIcon.png', cdnImage),
  password: { minLength: 6, maxLength: 10 },
};
