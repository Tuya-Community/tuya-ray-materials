// @ts-ignore
/** 根据 regionCode 获取静态资源 CDN 域名 */
export const REGION_CDN = {
  AY: 'images.tuyacn.com',
  AZ: 'usimagesd1448c85ulz2o4.cdn5th.com',
  EU: 'euimagesd2h2yqnfpu4gl5.cdn5th.com',
  IN: 'inimagesd1jqokb9wptk2t.cdn5th.com',
  UE: 'ueimages58yny2.cdn5th.com',
  WE: 'weimages57vdxnr.cdn5th.com',
  RU: 'euimagesd2h2yqnfpu4gl5.cdn5th.com',
  SG: 'usimagesd1448c85ulz2o4.cdn5th.com',
};

/**
 * 新人引导视频（相对路径，拼接 REGION_CDN）
 * 接入时可替换为自有资源；路径需与 CDN 上实际文件一致
 */
export const GUIDE_VIDEO_1 =
  '/rms-static/a39d11e0-d41f-11f0-946a-f10d211a0860-1765189280254.mp4?tyName=guide_video_1.mp4';
export const GUIDE_VIDEO_2 =
  '/rms-static/71dee560-d592-11f0-9295-ddfc290a59b7-1765348540086.mp4?tyName=guide_video_2.mp4';
export const GUIDE_VIDEO_3 =
  '/rms-static/e3d58c50-d592-11f0-9295-ddfc290a59b7-1765348731285.mp4?tyName=guide_video_3.mp4';
