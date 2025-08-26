import { dpCodes } from './dpCodes';

export type DpRule = {
  name: string;
  length: number;
  default: number;
};

export type SwitchGradientData = {
  version: number;
  fade_in_duration: number;
  fade_out_duration: number;
};

export const dpRules = {
  [dpCodes.switch_gradient]: [
    {
      name: 'version',
      length: 2,
      default: 0,
    },
    {
      name: 'fade_in_duration',
      length: 6,
      default: 800, // ms
    },
    {
      name: 'fade_out_duration',
      length: 6,
      default: 800, // ms
    },
  ] as DpRule[],
};
