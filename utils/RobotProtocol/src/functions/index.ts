// import { getFeatureProtocolVersion } from '@/utils/command';
// import { getCmdStrFromStandardFeatureCommand } from '..';
// import { FEATURE_DECODE_MAP } from '@/constant/cmd';
// import * as standardFeatures from '@/standardFeatures';

// type StandardFeatureReturnTypes = {
//   [K in keyof typeof standardFeatures]: ReturnType<(typeof standardFeatures)[K]>;
// }[keyof typeof standardFeatures];

// // 没想好透不透出这个方法？有实际使用场景？ ts不好写
// const decodeFeature = (command: string): StandardFeatureReturnTypes | null => {
//   const cmdVersion = getFeatureProtocolVersion(command);
//   const cmd = getCmdStrFromStandardFeatureCommand(command, cmdVersion);

//   if (FEATURE_DECODE_MAP[cmd]) {
//     return standardFeatures[FEATURE_DECODE_MAP[cmd]]({
//       command,
//       version: cmdVersion,
//     });
//   }

//   return null;
// };

// export const decodeAreas = (command: string) => {
//   const cmdVersion = getFeatureProtocolVersion(command);
// };
