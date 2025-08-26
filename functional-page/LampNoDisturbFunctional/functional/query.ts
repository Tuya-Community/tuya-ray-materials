/*
 * @Author: mjh
 * @Date: 2024-12-05 14:34:46
 * @LastEditors: mjh
 * @LastEditTime: 2024-12-09 10:49:30
 * @Description: 
 */
export interface Query {
  /**
   * @description 设备id deviceId或groupId必须取其一
  */
  deviceId?: string
  /**
   * @description 设备群组id deviceId或groupId必须取其一
  */
  groupId?: string,

  /** 
   * @description 样式主题 JSON string
  */
  theme?: string 
}

export interface Theme {
  /** 
   * @description switch 开关开启后的原色
   * @default rgba(0, 190, 155, 1)
  */
  switchCheckedColor?: string
  /** 
   * @description 页面背景色
   * @default '#0b0909'
  */
  background?: string
}

export const defaultTheme: Theme = {
  switchCheckedColor: 'rgba(0, 190, 155, 1)',
  background: '#0b0909'
}