declare namespace SmartMiniprogram.Widget {
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

    
    onRefresh(): void | Promise<void>;

    
    onPageScroll(options: IPageScrollOption): void | Promise<void>;

    
    onResize(options: IWidgetResizeOption): void | Promise<void>;
    
    onThemeChange(options: { theme: 'light' | 'dark' }): void | Promise<void>;
  }

  interface InstanceProperties {
    
    readonly route: string;

    
    readonly options: Record<string, string | undefined>;
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

  interface IWidgetResizeOption {
    
    height: number;
    
    width: number;
  }
}


declare let Widget: SmartMiniprogram.Widget.Constructor;
