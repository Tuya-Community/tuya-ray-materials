import * as LampTranformers from '@ray-js/panel-sdk/lib/protocols/lamp';

import { dpCodes } from '@/constant/dpCodes';
import DreamMicMusicTransformer from '@/standModel/musicModel/LocalMusic/dpParser/localMusic__dreamlightmic_music_data';

import PowerMemory from './powerMemoryParser';
import PaintColour1 from './paintColour1';
import RgbicLinerlightSceneFormater from './RgbicLinerlightSceneFormater';
import DiySceneFormatter from './DiySceneFormatter';

// @ts-ignore

export const protocols = {
  [dpCodes.paint_colour_1]: new PaintColour1(),
  [dpCodes.colour_data]: new LampTranformers.ColourTransformer(dpCodes.colour_data),
  [dpCodes.music_data]: new LampTranformers.MusicTransformer(dpCodes.music_data),
  [dpCodes.dreamlightmic_music_data]: new DreamMicMusicTransformer(),
  [dpCodes.power_memory]: new PowerMemory(dpCodes.power_memory),
  [dpCodes.rgbic_linerlight_scene]: new RgbicLinerlightSceneFormater(
    dpCodes.rgbic_linerlight_scene
  ),
  [dpCodes.diy_scene]: new DiySceneFormatter(dpCodes.diy_scene),
};
