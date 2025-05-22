export function formatTime(seconds) {
  // 将秒数转换为两位字符串（不足补零）
  const formattedSeconds = String(seconds).padStart(2, '0');
  // 直接返回固定格式 00:秒数
  return `00:${formattedSeconds}`;
}
