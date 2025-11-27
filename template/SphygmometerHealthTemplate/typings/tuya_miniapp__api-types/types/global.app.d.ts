declare namespace SmartMiniprogram.App {
  interface ReferrerInfo {
    
    appId: string;
    
    extraData?: any;
  }

  type SceneValues = 10000;

  interface LaunchShowOption {
    
    path: string;
    
    query: IAnyObject;
    
    scene: SceneValues;
  }

  interface PageNotFoundOption {
    
    path: string;
    
    query: IAnyObject;
    
    isEntryPage: boolean;
  }

  interface Option {
    
    onUnhandledRejection: OnUnhandledRejectionCallback;
    
    onThemeChange: OnThemeChangeCallback;

    
    onLaunch(options: LaunchShowOption): void;

    
    onShow(options: LaunchShowOption): void;

    
    onHide(): void;

    
    onError( error: string): void;

    
    onPageNotFound(options: PageNotFoundOption): void;
  }

  type Instance<T extends IAnyObject> = Option & T;
  type Options<T extends IAnyObject> = Partial<Option> & T & ThisType<Instance<T>>;
  type TrivialInstance = Instance<IAnyObject>;

  interface Constructor {
    <T extends IAnyObject>(options: Options<T>): void;
  }

  interface GetAppOption {
    
    allowDefault?: boolean;
  }

  interface GetApp {
    <T extends IAnyObject = IAnyObject>(): Instance<T>;
  }
}

declare let App: SmartMiniprogram.App.Constructor;
declare let getApp: SmartMiniprogram.App.GetApp;
