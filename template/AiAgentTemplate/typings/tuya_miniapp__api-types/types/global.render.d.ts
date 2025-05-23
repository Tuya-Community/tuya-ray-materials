declare namespace SmartMiniprogram.Render {
  type MethodOption = Record<string, any>;

  type KeysOfFunction<T> = {
    [P in keyof T]: T[P] extends Function ? P : never;
  }[keyof T];

  type PickOnlyMethod<TMethod extends MethodOption> = Pick<TMethod, KeysOfFunction<TMethod>>;

  type Instance<TMethod extends Partial<MethodOption>> = MethodOption & InstanceMethods;

  type InstanceService<TMethod extends Partial<MethodOption>> = PickOnlyMethod<TMethod>;

  type InstanceMethods = {
    /**
     * 调用宿主里的方法
     * @param name - 方法名
     * @param args - 参数列表
     * @deprecated - 请使用 `this.instance.callMethod` 替代
     */
    callMethod(name: string, ...args: any[]): void;

    instance: {
      /**
       * 调用宿主里的方法
       * @param name - 方法名
       * @param args - 参数列表
       */
      callMethod(name: string, ...args: any[]): void;

      /**
       * 获取 canvas 实例
       * @param id - canvas-id
       */
      getCanvasById: (id: string) => Promise<HTMLCanvasElement>;

      /**
       * 获取系统信息
       */
      getSystemInfo: () => SystemInfo;

      /**
       * 获取元素的位置信息
       */
      getBoundingClientRectById: () => DOMRect;

      /**
       * 创建一个新的 Worker 实例
       * @param path - Worker 的路径
       */
      createWorker: (path: string) => Worker;

      /**
       * eventChannel实例对象，用来进行 RJS 间或 RJS 和 SJS 的事件通信。
       * 需要注意 事件名唯一，避免事件冲突。 要求基础库版本大于 2.18.0
       */
      eventChannel: {
        emit: (eventName: string, ...args: any[]) => void;
        on: (eventName: string, callback: (...args: any[]) => void) => void;
      };

      /**
       * 获取 video 实例
       * @param id - 视频元素 ID
       */
      getVideoById: (id: string) => Promise<HTMLVideoElement>;
    };
  };

  type Options<TMethod extends MethodOption> = Partial<TMethod> & ThisType<Instance<TMethod>>;

  interface Constructor {
    <TMethod extends MethodOption>(
      options: Options<TMethod>,
    ): {
      new (): InstanceService<TMethod>;
    };
  }

  interface SystemInfo {
    /** 屏幕宽度 */
    screenWidth: Number; //
    /** 屏幕高度 */
    screenHeight: Number;
    /** 顶部导航栏高度 */
    navbarHeight: Number;
    /** 底部 tab 栏高度 */
    tabbarHeight: Number;
    /** 设备类型：android/ios */
    platform: 'ios' | 'android';
    /** 状态栏高度 */
    statusHeight: Number;
    /** 像素比 */
    pixelRatio: Number;
    /** 屏幕状态（横竖屏） */
    orientation: 'landspape' | 'portrait';
  }

  /**
   * 通过 canvas-id 获取 canvas 节点
   * id 必须以字母开口
   */
  type getCanvasById = (id: string) => Promise<HTMLCanvasElement>;

  type getSystemInfo = () => SystemInfo;
}
/** 注册一个 `Render` 渲染脚本，接受一个 `Object` 类型的参数。*/
declare let Render: SmartMiniprogram.Render.Constructor;

/**
 * 获取 Canvas 实例，仅在渲染脚本中可用。
 * @param id Canvas 组件的 canvas-id 属性
 * @returns Canvas 实例
 * @deprecated - 请使用 `this.instance.getCanvasById` 替代
 */
declare let getCanvasById: SmartMiniprogram.Render.getCanvasById;

/**
 * 获取系统信息，仅在渲染脚本中可用。
 * @returns 系统信息
 * @deprecated - 请使用 `this.instance.getSystemInfo` 替代
 */
declare let getSystemInfo: SmartMiniprogram.Render.getSystemInfo;
