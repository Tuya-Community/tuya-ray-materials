import dpParser from './parsers';
import { lampSchemaMap } from '../schema';

const { switch_gradient } = lampSchemaMap;

export const protocols = {
  [switch_gradient.code]: dpParser.switchGradientTransformer,
};
