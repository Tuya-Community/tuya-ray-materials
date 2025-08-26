/*
 * @Author: mjh
 * @Date: 2024-12-25 16:51:19
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-09 18:05:56
 * @Description:
 */
import { protocols } from '@ray-js/panel-sdk';
import PowerMemoryFormatter from './PowerMemoryFormatter';
import ControlDataFormatter from './ControlDataTransformer';

export const PowerMemoryTransformer = new PowerMemoryFormatter();
export const ControlDataTransformer = new ControlDataFormatter();
export const ColourTransformer = new protocols.ColourTransformer();
export default {
  PowerMemoryTransformer,
  ColourTransformer,
  ControlDataTransformer,
};
