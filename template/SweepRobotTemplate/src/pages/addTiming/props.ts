/**
 * 定时清洁范围， auto为全屋清扫， selectRoom为选择房间清扫
 */
export enum ECleaningRange {
  auto = 'auto',
  selectRoom = 'selectRoom',
}

/**
 * 周是否重复， Week：代表执行星期，一个字节，按位表示，00为仅执行一次，低位为周一周重复
 */

export enum WeeklyRepeatMode {
  never = 'never',
  repeat = 'repeat',
}
