import { dpCodes } from '@/constant/dpCodes';
import { devices } from '@/devices';
import { protocols } from '@/devices/protocols';

export const getSceneMode = (work_mode: string) => {
  if (work_mode !== 'scene') return work_mode;

  const devInfo = devices.common.getDevInfo();

  const dpsTime = devInfo?.dpsTime;
  const codeIds = devInfo?.codeIds;

  const rgbic_linerlight_scene_time = +dpsTime?.[codeIds?.[dpCodes.rgbic_linerlight_scene]];
  const diy_scene_time = +dpsTime?.[codeIds?.[dpCodes.diy_scene]];

  if (diy_scene_time > rgbic_linerlight_scene_time) {
    return 'diy';
  }

  const rgbic_linerlight_scene = devices.common.getDpState()?.rgbic_linerlight_scene;

  const rgbic_linerlight_scene_data =
    protocols.rgbic_linerlight_scene.parser(rgbic_linerlight_scene);

  if (rgbic_linerlight_scene_data?.key === 100) {
    return 'diy';
  }

  return 'scene';
};
