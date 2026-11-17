declare namespace SmartMiniprogram.Render {
  type MethodOption = Record<string, any>;

  type KeysOfFunction<T> = {
    [P in keyof T]: T[P] extends Function ? P : never;
  }[keyof T];

  type PickOnlyMethod<TMethod extends MethodOption> = Pick<TMethod, KeysOfFunction<TMethod>>;

  type Instance<TMethod extends Partial<MethodOption>> = MethodOption & InstanceMethods;

  type InstanceService<TMethod extends Partial<MethodOption>> = PickOnlyMethod<TMethod>;

  type InstanceMethods = {
    
    callMethod(name: string, ...args: any[]): void;

    instance: {
      
      callMethod(name: string, ...args: any[]): void;

      
      getCanvasById: (id: string) => Promise<HTMLCanvasElement>;

      
      getSystemInfo: () => SystemInfo;

      
      getBoundingClientRectById: () => DOMRect;

      
      createWorker: (path: string) => Worker;

      
      eventChannel: {
        emit: (eventName: string, ...args: any[]) => void;
        on: (eventName: string, callback: (...args: any[]) => void) => void;
      };

      
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
    
    screenWidth: Number; 
    
    screenHeight: Number;
    
    navbarHeight: Number;
    
    tabbarHeight: Number;
    
    platform: 'ios' | 'android';
    
    statusHeight: Number;
    
    pixelRatio: Number;
    
    orientation: 'landspape' | 'portrait';
  }

  
  type getCanvasById = (id: string) => Promise<HTMLCanvasElement>;

  type getSystemInfo = () => SystemInfo;
}

declare let Render: SmartMiniprogram.Render.Constructor;


declare let getCanvasById: SmartMiniprogram.Render.getCanvasById;


declare let getSystemInfo: SmartMiniprogram.Render.getSystemInfo;
