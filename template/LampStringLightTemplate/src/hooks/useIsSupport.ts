import { dpCodes } from '@/constant/dpCodes';
import { useSupport } from '@ray-js/panel-sdk';

export const useIsSupport = () => {
  const support = useSupport();
  const isSupportLocalMusic = support.isSupportDp(dpCodes.dreamlightmic_music_data);
  const isSupportAppMusic = support.isSupportDp(dpCodes.music_data);
  const isSupportMusic = isSupportLocalMusic || isSupportAppMusic;

  const isSupportWhite = support.isSupportDp(dpCodes.bright_value);
  const isSupportWhiteTemp = support.isSupportDp(dpCodes.temp_value);
  const isSupportColor = support.isSupportDp(dpCodes.colour_data);
  const isSupportLight = isSupportWhite || isSupportWhiteTemp || isSupportColor;

  const isSupportScene = support.isSupportDp(dpCodes.scene_data);

  const isSupportPaint = support.isSupportDp(dpCodes.paint_colour_1);

  return {
    isSupportLocalMusic,
    isSupportAppMusic,
    isSupportMusic,
    isSupportWhite,
    isSupportWhiteTemp,
    isSupportColor,
    isSupportLight,
    isSupportScene,
    isSupportPaint,
  };
};
