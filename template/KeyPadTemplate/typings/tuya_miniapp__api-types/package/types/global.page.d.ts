declare namespace SmartMiniprogram.Page {
  type Instance<TData extends DataOption, TCustom extends CustomOption> = OptionalInterface<ILifetime> &
    InstanceProperties &
    InstanceMethods<TData> &
    Data<TData> &
    TCustom;
  type Options<TData extends DataOption, TCustom extends CustomOption> = (TCustom &
    Partial<Data<TData>> &
    Partial<ILifetime> & { options?: Component.ComponentOptions }) &
    ThisType<Instance<TData, TCustom>>;
  type TrivialInstance = Instance<IAnyObject, IAnyObject>;

  interface Constructor {
    <TData extends DataOption, TCustom extends CustomOption>(options: Options<TData, TCustom>): void;
  }

  interface ILifetime {
    
    onLoad(query: Record<string, string | undefined>): void | Promise<void>;

    
    onShow(): void | Promise<void>;

    
    onReady(): void | Promise<void>;

    
    onHide(): void | Promise<void>;

    
    onUnload(): void | Promise<void>;

    
    onPullDownRefresh(): void | Promise<void>;

    
    onReachBottom(): void | Promise<void>;

    
    onPageScroll(options: IPageScrollOption): void | Promise<void>;

    
    onResize(options: IResizeOption): void | Promise<void>;
  }

  interface InstanceProperties {
    
    is: string;

    
    route: string;

    
    options: Record<string, string | undefined>;
  }

  type DataOption = Record<string, any>;
  type CustomOption = Record<string, any>;

  type InstanceMethods<D extends DataOption> = Component.InstanceMethods<D>;

  interface Data<D extends DataOption> {
    
    data: D;
  }

  interface IPageScrollOption {
    
    scrollTop: number;
  }

  interface IResizeOption {
    size: {
      
      windowWidth: number;
      
      windowHeight: number;
    };
  }

  interface IAddToFavoritesOption {
    
    webviewUrl?: string;
  }

  interface IAddToFavoritesContent {
    
    title?: string;
    
    imageUrl?: string;
    
    query?: string;
  }

  interface GetCurrentPages {
    (): Array<Instance<IAnyObject, IAnyObject>>;
  }
}


declare let Page: SmartMiniprogram.Page.Constructor;

declare let getCurrentPages: SmartMiniprogram.Page.GetCurrentPages;
