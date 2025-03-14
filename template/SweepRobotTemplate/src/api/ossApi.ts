import { getDevInfo, getSweeperStorageConfig } from '@ray-js/ray';
import { decode } from 'js-base64';

export class OssApi {
  layBin: string;

  routeBin: string;

  navBin: string;

  modelConfig: any;

  constructor() {
    this.layBin = '/layout/lay.bin';
    this.routeBin = '/route/rou.bin';
    this.navBin = '/route/nav.bin';
  }

  /**
   * 获取云存储配置
   * @param devId
   * @param type
   * @returns
   */
  updateAuthentication = async () => {
    try {
      const response = await getSweeperStorageConfig({
        type: 'Common',
        devId: getDevInfo().devId,
      });

      this.modelConfig = response;

      return response;
    } catch (err) {
      if (err instanceof TypeError) {
        console.warn('暂不支持ty.getSweeperStorageConfig，请将基础库升级到2.23.0或以上');

        /**
         * @deprecated 暂时兼容旧版本，后续将移除
         */
        return new Promise((resolve, reject) => {
          ty.apiRequestByAtop({
            api: decode('dHV5YS5tLmRldi5zdG9yYWdlLmNvbmZpZy5nZXQ='),
            postData: { type: 'Common', devId: getDevInfo().devId },
            version: '1.0',
            success: response => {
              this.modelConfig = response;

              resolve(response);
            },

            fail: err => {
              reject(err);
            },
          });
        });
      }
    }
  };

  /**
   * 获取完整oss下载链接
   * @param {string} bucket 权限验证
   * @param {string} filePath 文件相对路径
   * @returns {Promise<string>} fileUrl 文件的Url
   */
  getCloudFileUrl = (
    bucket: string,
    filePath: string
  ): Promise<{
    type: 'data' | 'url';
    data: string;
  }> => {
    try {
      if (!this.modelConfig) {
        return Promise.reject(new Error('未获取到云存储配置'));
      }

      return new Promise(resolve => {
        ty.ipc.generateSignedUrl({
          bucket,
          path: filePath,
          expiration: this.modelConfig.expiration,
          region: this.modelConfig.region,
          token: this.modelConfig.token,
          sk: this.modelConfig.sk,
          provider: this.modelConfig.provider,
          endpoint: this.modelConfig.endpoint,
          ak: this.modelConfig.ak,
          success: data => {
            if (typeof data === 'string') {
              // IDE下会尝试模拟该方法，并直接返回文件内的数据hex字符串
              resolve({
                type: 'data',
                data,
              });
              return;
            }

            const { signedUrl } = data;

            let cloudFileUrl = signedUrl;
            if (signedUrl.indexOf('http') === -1) {
              cloudFileUrl = `https://${signedUrl}`;
            }
            resolve({
              type: 'url',
              data: cloudFileUrl,
            });
          },
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

// 以实例化对象向外导出
const ossApiInstance = new OssApi();

export default ossApiInstance;
