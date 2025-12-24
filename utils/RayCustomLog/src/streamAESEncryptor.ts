import CryptoJS from 'crypto-js';

class LogEncryptor {
  /**
   * 基于 devId 生成密钥和 IV
   * 直接使用 devId 作为密钥源，使用 MD5 哈希转换为固定长度的密钥和 IV（各16字节）
   * 这样每个 devId 都有唯一的密钥，且不需要设置主密钥
   * @param devId 设备ID
   * @returns { key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray }
   */
  private static deriveKeyAndIV(devId: string): { key: CryptoJS.lib.WordArray; iv: CryptoJS.lib.WordArray } {
    // 使用 devId 的 MD5 哈希作为密钥（16字节，正好是 AES-128 所需的长度）
    const key = CryptoJS.MD5(devId);
    
    // 使用 devId + 固定后缀的 MD5 哈希作为 IV，确保 IV 与密钥不同
    const iv = CryptoJS.MD5(devId + '_iv_salt');

    return {
      key: key,
      iv: iv
    };
  }

  /**
   * 快速加密单条日志
   * 使用 devId 作为密钥进行加密
   * @param devId 设备ID，将作为加密密钥使用
   * @param logData 要加密的日志数据
   */
  static encryptLog(devId: string, logData: any): string {
    try {
      // 如果日志是对象，转换为JSON字符串
      const dataString = typeof logData === 'object' 
        ? JSON.stringify(logData) 
        : String(logData);

      // 基于 devId 派生密钥和 IV
      const { key: derivedKey, iv: derivedIV } = this.deriveKeyAndIV(devId);

      const encrypted = CryptoJS.AES.encrypt(dataString, derivedKey, {
        iv: derivedIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.toString();
    } catch (error) {
      console.warn('日志加密失败，返回原始数据:', error);
      return logData; // 加密失败时返回原始数据
    }
  }

  /**
   * 解密日志（用于调试或查看）
   * 使用 devId 作为密钥进行解密
   * @param devId 设备ID，必须与加密时使用的 devId 相同（作为解密密钥）
   * @param encryptedLog 加密的日志数据
   */
  static decryptLog(devId: string, encryptedLog: string): string {
    try {
      // 基于 devId 派生密钥和 IV（必须与加密时相同）
      const { key: derivedKey, iv: derivedIV } = this.deriveKeyAndIV(devId);

      const decrypted = CryptoJS.AES.decrypt(encryptedLog, derivedKey, {
        iv: derivedIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.warn('日志解密失败:', error);
      return encryptedLog; // 返回原始加密数据
    }
  }
}

// 导出便捷的解密函数
export const decryptLog = (devId: string, encryptedLog: string): string => {
  return LogEncryptor.decryptLog(devId, encryptedLog);
};

// 导出便捷的加密函数
export const encryptLog = (devId: string, logData: any): string => {
  return LogEncryptor.encryptLog(devId, logData);
};

export default LogEncryptor;