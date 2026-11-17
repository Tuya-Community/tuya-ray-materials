import { nativeRouter, canIUseRouter, home } from '@ray-js/ray';

/**
 * App 原生页跳转（万能路由）。所用 scheme 均需在 global.config.ts 的 tuya.routers 中声明，
 * 未声明的路由 ty.router 会直接失败。
 */

/** 万能路由跳转，Promise 化 */
const jump = (url: string): Promise<void> =>
  new Promise((resolve, reject) => {
    nativeRouter({
      url,
      success: () => resolve(),
      fail: err => {
        console.log('=== nativeRouter fail', url, err);
        reject(err);
      },
    });
  });

/** 该路由 host 是否存在于当前 App（fail 一律按不支持处理） */
const isSupportLink = (link: string): Promise<boolean> =>
  new Promise(resolve => {
    canIUseRouter({
      url: link,
      success: res => resolve(!!res?.result),
      fail: () => resolve(false),
    });
  });

/**
 * v2.3 §6：跳 App 配网加设备入口（config_device，落到当前家庭）。
 * 对齐 RN addLockList gotoAddDevice：TYNative.jumpTo('tuyaSmart://config_device')。
 */
export const gotoAddDevice = (): Promise<void> => jump('tuyaSmart://config_device');

/**
 * v2.3 §7：跳 App 家庭添加成员页（配件家庭成员会自动绑定到主锁）。
 * 对齐 RN chooseUserList addUser：tuyaSmart://tysh_family_add_member_rn?homeId=；
 * OEM App 路由名可能是 thingsh_ 前缀，故先 canIUseRouter 探测再跳（同主锁 miniapp 工程做法）。
 */
export const gotoAddFamilyMember = async (): Promise<void> => {
  const homeInfo = await new Promise<{ homeId?: string } | null>(resolve => {
    home.getCurrentHomeInfo({
      success: res => resolve(res),
      fail: () => resolve(null),
    });
  });
  const homeId = homeInfo?.homeId ?? '';

  let link = (await isSupportLink('tysh_family_add_member_rn')) ? 'tysh_family_add_member_rn' : '';
  if (!link) {
    link = (await isSupportLink('thingsh_family_add_member_rn'))
      ? 'thingsh_family_add_member_rn'
      : '';
  }
  // 探测不可用时仍按默认路由尝试（部分 App 版本 canIUseRouter 对已声明路由误报 false）
  const finalLink = link || 'tysh_family_add_member_rn';
  return jump(`tuyaSmart://${finalLink}?homeId=${homeId}`);
};
