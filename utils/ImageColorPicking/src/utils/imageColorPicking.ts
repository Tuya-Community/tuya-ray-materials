/*
 * @Author: mjh
 * @Date: 2024-12-31 17:32:43
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-02 15:57:50
 * @Description:
 */

import { ImgCanvasProps } from '@/props';

function getContext() {
  // @ts-ignore
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

const defaultOption = {
  selector: '#image-color-picking',
};
interface ImageColorPickingOption extends Omit<ImgCanvasProps, 'onColorsChange'> {
  /** 组件的id */
  selector?: string;
  /** 原生小程序方式使用时 传 this；ray方式使用时 不需要传 */
  context?: any;
}
let queue = [];
export const imageColorPicking = (currOptions: ImageColorPickingOption = {}): Promise<string[]> => {
  const options = {
    ...defaultOption,
    ...currOptions,
    canvasId: `${(currOptions.selector || defaultOption.selector).replace('#', '')}-canvas`,
  };
  return new Promise((resolve, reject) => {
    const context =
      (typeof options.context === 'function' ? options.context() : options.context) || getContext();
    const selector = options.selector as string;
    const picker = context.selectComponent(options.selector as string);

    if (queue?.length > 0 && queue?.[0]?.id === picker?.id) {
      console.warn(`相同选择器的 picker 调用过于频繁，${picker.id} 已忽略重复调用`);
      reject();
      return;
    }

    delete options.context;
    delete options.selector;

    if (picker) {
      const optionsWithInputValue = {
        ...options,
      };
      picker.setData({
        callback: res => {
          queue = [];
          resolve(res.colors);
        },
        ...optionsWithInputValue,
      });

      queue.push(picker);
    } else {
      console.warn(
        `未找到 ${(selector ?? '#image-color-picking').replace(
          '#',
          ''
        )} 节点，请确认 selector 及 context 是否正确`
      );
      reject();
    }
  });
};
