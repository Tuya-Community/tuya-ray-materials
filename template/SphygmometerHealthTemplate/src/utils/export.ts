import { authorize, env, getFileSystemManager } from '@ray-js/ray';
import moment from 'moment';

import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { isIos } from '.';
import { cmToInchUnit } from './unit';

export const exportCsv = async (user: UserInfo, data: any) => {
  const { systolicBpCode, diastolicBpCode, pulseCode } = dpCodes;
  const rows: string[] = [];
  // Title
  rows.push(`${Strings.getLang('dsc_csvTitle')}`);
  rows.push('   ');

  // 用户信息
  rows.push(`${Strings.getLang('dsc_userInfo')}`);
  rows.push(
    `${Strings.getLang('dsc_name')},${Strings.getLang('dsc_Gender')},${Strings.getLang(
      'dsc_birthday'
    )},${Strings.getLang('dsc_height')},${Strings.getLang('dsc_weight')}`
  );
  rows.push(
    `${user.userName},${Strings.getLang(user.sex === 1 ? 'dsc_Female' : 'dsc_Male')},${moment(
      user.birthday
    ).format('YYYY-MM-DD')},${cmToInchUnit(user.height, user.heightUnit)},${
      user.weight
    }${Strings.getLang(`${user.weightUnit}Unit` as any)}`
  );
  rows.push('   ');

  // 血压数据
  rows.push(`${Strings.getLang('dsc_bpData')}`);
  rows.push(
    `${Strings.getLang('dsc_timer')},${Strings.getDpLang(systolicBpCode)}(${String(
      Strings.getLang(`dsc_sysUnit`)
    )}),${Strings.getDpLang(diastolicBpCode)}(${String(
      Strings.getLang(`dsc_diaUnit`)
    )}),${Strings.getDpLang(pulseCode)}(${String(
      Strings.getLang(`dsc_pulUnit`)
    )}),${Strings.getLang('dsc_remark')}`
  );
  data.forEach(item => {
    const { sys, dia, pulse, remark, time } = item || {};
    rows.push(`${moment(time).format('MM-DD-YYYY HH:mm')},${sys},${dia},${pulse},${remark}`);
  });

  const csvString = rows.join('\n');

  const fileRoot = env.USER_DATA_PATH;
  const pathToWrite = `${fileRoot}/bloodPresure_${+new Date()}.csv`;

  await writeFile(pathToWrite, csvString);

  return pathToWrite;
};

// 写入文件
const writeFile = async (filePath: string, data: string) => {
  const fileManager = await getFileSystemManager();

  // 安卓设备需要先授权
  if (!isIos) {
    return new Promise((resolve, reject) => {
      authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          console.log('authorize success');
          fileManager.writeFile({
            filePath,
            data,
            success: () => {
              resolve(filePath);
            },
            fail: err => {
              console.log(`文件写入失败`, err);
              reject(err);
            },
          });
        },
        fail: err => {
          console.log('authorize fail', err);
          reject(err);
        },
      });
    });
  }

  return new Promise((resolve, reject) => {
    fileManager.writeFile({
      filePath,
      data,
      success: () => {
        resolve(filePath);
      },
      fail: err => {
        console.log(`文件写入失败`, err);
        reject(err);
      },
    });
  });
};
