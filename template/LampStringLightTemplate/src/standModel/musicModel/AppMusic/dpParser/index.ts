/* eslint-disable no-shadow */
import MusicDataParser from './localMusic__music_data';
import { EMusicDpCode } from '../types';
export class MusicParser {
  static MusicDataParser: typeof MusicDataParser;

  private dpCode: string;
  private ins: MusicDataParser;

  constructor(lampSchemaMap) {
    const isStr = typeof lampSchemaMap === 'string';
    this.dpCode = lampSchemaMap;
    if (!isStr) {
      // TODO: 如果设备中定义的音乐 dp code 不存在，添加其他 dp code
      const dpCode = lampSchemaMap[EMusicDpCode.music_data]?.code;
      this.dpCode = dpCode;
    }
    if (!this.dpCode) {
      throw new Error('dpCode is empty, please set dpCode');
    }
    switch (this.dpCode) {
      case EMusicDpCode.music_data:
        this.ins = new MusicDataParser() as MusicDataParser;
        break;
      // TODO: 如果设备中定义的音乐 dp code 不存在，添加音乐解析函数
      default:
        throw new Error(`${JSON.stringify(this.dpCode)}, dpCode is not supported`);
    }
  }

  parser(dpStr) {
    return this.ins.parser(dpStr);
  }

  formatter(dpData) {
    return this.ins.formatter(dpData);
  }
}

MusicParser.MusicDataParser = MusicDataParser;

export default MusicParser;
