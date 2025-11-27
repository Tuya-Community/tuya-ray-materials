import { ai, env } from '@ray-js/ray';

export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

type EnhanceImage = {
  /**
   * 图片路径
   * Image path
   */
  src: string;
  /**
   * 增强类型
   * Enhance type
   * enhance: 清晰度增强 （clarity enhancement）
   * correct: 畸变校正（distortion correction）
   */
  type: 'enhance' | 'correct';
  resolve: (src: string) => void;
  reject: (error: any) => void;
};

const enhanceImages: EnhanceImage[] = [];
let doEnhance = false;

/**
 * 摄像头畸变参数
 * Camera distortion parameters
 * 注意：不同摄像头畸变参数不同，需根据实际摄像头参数进行调整
 * Note: Different camera distortion parameters are different, and the actual camera parameters need to be adjusted
 */
const distortionOptions = {
  interpolationType: 2,
  ratio: 100,
  fCx: 3.108605878126431e2,
  fCy: 6.257166314880553e2,
  fFx: 7.084082701155164e2,
  fFy: 7.065142640307738e2,
  fK1: -0.291356681546637,
  fK2: 0.083781361060513,
  fK3: -0.011253071088971,
  fP1: 3.256053844769221e-4,
  fP2: 4.136029216106517e-4,
};

/**
 * 处理增强图像
 * Process enhanced image
 * @param data EnhanceImage 增强图像数据
 * @returns
 */
const handleEnhance = (data: EnhanceImage) => {
  if (doEnhance) {
    return;
  }
  doEnhance = true;
  ai.enhanceClarityForImage({
    inputImagePath: data.src,
    outputImagePath: `${env.USER_DATA_PATH}/ai_enhanced_image`,
    enhanceType: 5,
    success: res => {
      // 是否需要畸变校正
      // Whether to correct distortion
      if (data.type === 'correct') {
        ai.enhanceCalibrationForImage({
          inputImagePath: res.outputImagePath,
          outputImagePath: `${env.USER_DATA_PATH}/ai_enhanced_image`,
          ...distortionOptions,
          success: res1 => {
            data.resolve(res1.outputImagePath);
          },
          fail: error => {
            data.reject(error);
          },
          complete: () => {
            doEnhance = false;
            if (enhanceImages.length > 0) {
              handleEnhance(enhanceImages.shift());
            }
          },
        });
      } else {
        data.resolve(res.outputImagePath);
        doEnhance = false;
        if (enhanceImages.length > 0) {
          handleEnhance(enhanceImages.shift());
        }
      }
    },
    fail: error => {
      data.reject(error);
      doEnhance = false;
      if (enhanceImages.length > 0) {
        handleEnhance(enhanceImages.shift());
      }
    },
  });
};

/**
 * 增强图像
 * Enhance image
 * @param src 图片路径 （Image path）
 * @param type 增强类型，enhance: 清晰度增强，correct: 畸变校正（Enhance type, enhance: clarity enhancement, correct: distortion correction）
 * @returns
 */
export const enhanceImage = (src: string, type: 'enhance' | 'correct') => {
  return new Promise<string>((resolve, reject) => {
    enhanceImages.push({
      src,
      type,
      resolve,
      reject,
    });
    if (!doEnhance) {
      handleEnhance(enhanceImages.shift());
    }
  });
};
