import dpParser from './parsers';
import { lampSchemaMap } from '../schema';

const { power_memory, colour_data, control_data } = lampSchemaMap;

export const protocols = {
  [power_memory.code]: dpParser.PowerMemoryTransformer,
  [colour_data.code]: dpParser.ColourTransformer,
  [control_data.code]: dpParser.ControlDataTransformer,
};
