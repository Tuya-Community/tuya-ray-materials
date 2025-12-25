import { dpCodes } from '@/constant/dpCodes';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';
import { getArray } from '@/utils/kit';
import { useProps, useStructuredActions } from '@ray-js/panel-sdk';
import { PublishDpsOptions } from '@ray-js/panel-sdk/lib/kit';

export const useCutDrawDiySceneSet = () => {
  const ledNumber = useProps(p => p[dpCodes.led_number_set]);
  const structuredActions = useStructuredActions();

  return (data: DiySceneData, options?: PublishDpsOptions) => {
    const newData = { ...(data || ({} as DiySceneData)) };
    const segments = getArray(newData?.segments);
    if (ledNumber) {
      if (segments.length >= ledNumber) {
        newData.segments = segments.slice(0, ledNumber);
      } else {
        const defaultColor: DiySceneData['segments'][0] = {
          isWhite: false,
          hue: 0,
          saturation: 1000,
          value: 1000,
          brightness: 0,
          temperature: 0,
        };
        newData.segments = segments.concat(
          ...new Array(ledNumber - segments.length).fill(0).map(() => defaultColor)
        );
      }
    }
    structuredActions.diy_scene.set(newData, options);
  };
};
