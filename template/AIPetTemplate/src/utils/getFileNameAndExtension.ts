/**
 * 如给定 file:///var/mobile/Media/DCIM/100APPLE/IMG_0562.MP4，
 * 则返回 IMG_0562.MP4 和 .mp4
 */
export function getFileNameAndExtension(
  filePath: string
): { fileName: string; fileType: string; fileFullName: string } | null {
  // 使用正则表达式匹配文件名和文件类型
  const match = (filePath || '').match(/([^/]+)\.([^.]+)$/);
  if (match) {
    const fileName = match[1];
    const fileType = match[2]?.toLowerCase() || '';
    return {
      fileName,
      fileType,
      fileFullName: `${fileName}.${fileType}`,
    };
  }
  return null;
}
