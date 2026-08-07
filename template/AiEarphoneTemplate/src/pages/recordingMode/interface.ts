export interface SwitchAudioSource {
  /**
   * 设备id
   */
  deviceId: string;

  /**
   * recordType
   * 0: 电话
   * 1: 现场录音+实时转录+同声传译
   * 2: 面对面（Pro版）
   * 3: 面对面
   */
  recordType: number;

  /**
   * 音频输入源，见AudioSource枚举值
   * //系统音频源 0-19
   * SYSTEM_BLUETOOTH_16K_MONO(0),//系统蓝牙 16KHz单声道
   * SYSTEM_PHONE_MIC_16K_MONO(1),//系统MIC 16Hz单声道
   *
   * //耳机输入源 20-39
   * EARPHONE_PRO_16K_MONO(20),//耳机16KHz单声道
   * EARPHONE_PRO_16K_STEREO(21),//耳机16KHz双声道
   * EARPHONE_PRO_32K_MONO(22),//卡片32KHz单声道
   *
   * //卡片输入源40-59
   * NOTE_16K_MONO(40),//卡片16KHz单声道
   * NOTE_16K_STEREO(41),//卡片16KHz双声道
   */
  audioSource: number;
}
