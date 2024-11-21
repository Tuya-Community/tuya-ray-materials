import { getDevInfo } from '@ray-js/ray';

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
    const response = await ty.getSweeperStorageConfig({
      type: 'Common',
      devId: getDevInfo().devId,
    });

    this.modelConfig = response;
    return response.bucket;
  };

  /**
   * 获取完整oss下载链接
   * @param {string} bucket 权限验证
   * @param {string} filePath 文件相对路径
   * @returns {Promise<string>} fileUrl 文件的Url
   */
  getCloudFileUrl = (bucket: string, filePath: string): Promise<string> => {
    try {
      if (!this.modelConfig) {
        return Promise.resolve('');
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
          success: (data: { signedUrl: string }) => {
            const { signedUrl } = data;
            let cloudFileUrl = signedUrl;
            if (signedUrl.indexOf('http') === -1) {
              cloudFileUrl = `https://${signedUrl}`;
            }
            resolve(cloudFileUrl);
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
