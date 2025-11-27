import { getSid } from '@/utils/getSid';
import { toFixed } from '@ray-js/panel-sdk/lib/utils';
/**
 * 时间戳转字符串
 * @param timestamp
 * @returns
 */
export function timestampToString(timestamp: number | string) {
  if (!timestamp || Number(timestamp) === 0) return ' ';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();
  const dateString = `${year}/${month}/${day}`;
  return `${dateString}`;
  // const timeString = `${hours}:${minutes}:${seconds}`;
  // return `${dateString} ${timeString}`;
}

/**
 * 等同于原来的 parseSec
 * @example
 * parseSecond(111)
 * // ['00', '01', '51']
 * @example
 * parseSecond(3333333)
 * // ['25', '55', '33']
 * @param {Number} t, is a number stands second
 * @param {Number} n, is a number stands the string length to fixed, default value is 2
 * @returns {Array} a Array of String which each item is a string which length is `n`
 */
function parseSecond(t: number) {
  const h = Math.floor(t / 3600);
  const m = Math.floor(t / 60 - h * 60);
  const s = Math.floor(t - h * 3600 - m * 60);
  return [toFixed(h, 2), toFixed(m, 2), toFixed(s, 2)];
}

export function formatEndTimeText(data: { duration: number }) {
  const { duration } = data;
  // 由于从 chooseMedia TTT API 返回的时间都是抛弃小数点向下取整的，所以小程序这里也要统一，避免出现时间展示不一致的情况
  const durationArr = parseSecond(duration / 1000);
  const isExceed1Hour = +durationArr[0] > 0;
  return isExceed1Hour ? durationArr.join(':') : durationArr.slice(-2).join(':');
}

// 分割为二维数组
export function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
// 模拟 图片点赞记录返回数据
const TestFileLike = (list: string[]) => {
  const obj = {};
  list.forEach(item => {
    obj[item] = Math.floor(Math.random() * 3 + 1);
  });
  return obj;
};
// 16进制转是字符串
export const hexToStr = (hex: string) => {
  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return result;
};
/**
 * 模拟 发送中 成功 失败三个列表数据
 * @param length  长度
 * @param status  状态参考 HistoryStatus
 * @returns
 */
export const TestData = (length: number, status: any) => {
  const dataObj = {};
  // '/video/613_1720340774.mp4',
  const list = [
    '{0}/content-platform/hestia/17203411902f1a66224ff.mp4',
    '/images/5861720320424_.pic.jpg',
    '/images/5871720320426_.pic.jpg',
    '/images/5881720320426_.pic.jpg',
    '/images/5891720320427_.pic.jpg',
    '/images/5901720320428_.pic.jpg',
    '/images/5921720320430_.pic.jpg',
    '/images/5931720320430_.pic.jpg',
    '/images/5941720320431_.pic.jpg',
    '/images/5951720321501_.pic.jpg',
    '/images/5961720321502_.pic.jpg',
  ];

  new Array(length).fill(0).forEach((item, index) => {
    const ListItem = [];
    if (index % 3 === 0) {
      ListItem.push({
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        url: list[Math.floor(Math.random() * 10 + 1)],
        title: 'name' + Date.now(),
        filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 1),
        // mode: [],
      });
      ListItem.push({
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        url: list[Math.floor(Math.random() * 10 + 1)],
        title: 'name' + Date.now(),
        filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 10),
        // mode: [],
      });
      ListItem.push({
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        url: list[Math.floor(Math.random() * 10 + 1)],
        title: 'name' + Date.now(),
        filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 10),
        // mode: [],
      });
      ListItem.push({
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        url: list[Math.floor(Math.random() * 10 + 1)],
        title: 'name' + Date.now(),
        filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 10),
        // mode: [],
      });
    } else if (index % 3 === 1) {
      ListItem.push({
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        url: list[Math.floor(Math.random() * 10 + 1)],
        title: 'name' + Date.now(),
        filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 20),
        // mode: [3],
      });
    }
    ListItem.push({
      thumbnail: list[Math.floor(Math.random() * 10 + 1)],
      url: list[Math.floor(Math.random() * 10 + 1)],
      title: 'name' + Date.now(),
      filename: 'name' + Date.now() + Math.floor(Math.random() * 10 + 30),
      // mode: [1],
    });
    const ListVideoItem = [
      {
        url: list[0],
        thumbnail: list[Math.floor(Math.random() * 10 + 1)],
        title: 'video' + Date.now(),
        filename: 'video' + Date.now() + Math.floor(Math.random() * 10 + 40),
        // mode: [1],
      },
    ];
    dataObj[getSid('ceshidveId0000001') + Math.floor(Math.random() * 100 + 1)] = {
      list: index === 3 ? ListVideoItem : ListItem,
      type: index === 3 ? 'video' : 'image',
      status,
      timestamp: Date.now(),
    };
  });
  return dataObj;
};
