import { uncompress } from './binding';
import { Buffer } from 'buffer';

export const lz4Uncompress = (bytes: any[], size = 1024 * 1024): Buffer | null => {
  const input = Buffer.from(bytes);
  const oneG = 1073741824; // 最大分配1G内存
  let finalSize = size;
  if (size > oneG) {
    finalSize = oneG;
    console.warn('uncompress所需空间过大，强制设定为1G', size);
    return null;
  }
  let uncompressed = Buffer.alloc(finalSize);
  const uncompressedSize = uncompress(input, uncompressed);
  uncompressed = uncompressed.slice(0, uncompressedSize);
  return uncompressed;
};
