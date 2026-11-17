declare namespace SmartMiniprogram {
  type RequestCloudOptions = {
    api: string;
    version: string;
    data: Record<string, any>;
    success?: (res: RequestResult) => void;
    fail?: (res: RequestError) => void;
    complete?: (res: RequestResult | RequestError) => void;
  };

  interface LaunchOptionsApp {
    path: string;
    query: Record<string, string>;
    scene: number;
  }

  type PageScrollToOptions = AsyncApiOptions<void, void> & {
    scrollTop?: number;
    duration?: number;
    selector?: string;
  };

  type SetPageStyleOptions = AsyncApiOptions<void, void> & {
    style: Record<string, string>;
  };

  type CreateAnimationOptions = {
    
    delay?: number;
    
    duration?: number;
    
    timingFunction?: 'linear' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end';
    transformOrigin?: string;
  };

  interface AnimationExportResult {
    actions: IAnyObject[];
  }

  interface Animation {
    
    export(): AnimationExportResult;

    
    backgroundColor(value: string): Animation;

    
    bottom(
      
      value: number | string,
    ): Animation;

    
    height(
      
      value: number | string,
    ): Animation;

    
    left(
      
      value: number | string,
    ): Animation;

    
    matrix(): Animation;

    
    matrix3d(): Animation;

    
    opacity(
      
      value: number,
    ): Animation;

    
    right(
      
      value: number | string,
    ): Animation;

    
    rotate(
      
      angle: number,
    ): Animation;

    
    rotate3d(
      
      x: number,
      
      y: number,
      
      z: number,
      
      angle: number,
    ): Animation;

    
    rotateX(
      
      angle: number,
    ): Animation;

    
    rotateY(
      
      angle: number,
    ): Animation;

    
    rotateZ(
      
      angle: number,
    ): Animation;

    
    scale(
      
      sx: number,
      
      sy?: number,
    ): Animation;

    
    scale3d(
      
      sx: number,
      
      sy: number,
      
      sz: number,
    ): Animation;

    
    scaleX(
      
      scale: number,
    ): Animation;

    
    scaleY(
      
      scale: number,
    ): Animation;

    
    scaleZ(
      
      scale: number,
    ): Animation;

    
    skew(
      
      ax: number,
      
      ay: number,
    ): Animation;

    
    skewX(
      
      angle: number,
    ): Animation;

    
    skewY(
      
      angle: number,
    ): Animation;

    
    step(option?: StepOption): Animation;

    
    top(
      
      value: number | string,
    ): Animation;

    
    translate(
      
      tx?: number,
      
      ty?: number,
    ): Animation;

    
    translate3d(
      
      tx?: number,
      
      ty?: number,
      
      tz?: number,
    ): Animation;

    
    translateX(
      
      translation: number,
    ): Animation;

    
    translateY(
      
      translation: number,
    ): Animation;

    
    translateZ(
      
      translation: number,
    ): Animation;

    
    width(
      
      value: number | string,
    ): Animation;
  }

  interface NodesRef {
    
    boundingClientRect(
      
      callback?: BoundingClientRectCallback,
    ): SelectorQuery;

    
    
    
    
    
    
    
    fields(fields: Fields, callback?: FieldsCallback): SelectorQuery;

    
    
    
    
    
    
    
    scrollOffset(
      
      callback?: ScrollOffsetCallback,
    ): SelectorQuery;
  }

  interface SelectorQuery {
    
    exec(callback?: (...args: any[]) => any): NodesRef;

    
    select(selector: string): NodesRef;

    
    selectAll(selector: string): NodesRef;

    
    selectViewport(): NodesRef;

    
    in(component: Component.TrivialInstance | Page.TrivialInstance): SelectorQuery;
  }

  interface CreateIntersectionObserverOption {
    
    initialRatio?: number;
    
    observeAll?: boolean;
    
    thresholds?: number[];
  }

  interface IntersectionObserverObserveCallbackResult {
    
    boundingClientRect: BoundingClientRectResult;
    
    dataset: Record<string, any>;
    
    id: string;
    
    intersectionRatio: number;
    
    intersectionRect: IntersectionRectResult;
    
    relativeRect: RelativeRectResult;
    
    time: number;
  }

  type IntersectionObserverObserveCallback = (result: IntersectionObserverObserveCallbackResult) => void;

  interface Margins {
    
    bottom?: number;
    
    left?: number;
    
    right?: number;
    
    top?: number;
  }

  interface IntersectionObserver {
    
    disconnect(): void;

    
    observe(targetSelector: string, callback: IntersectionObserverObserveCallback): void;

    
    relativeTo(selector: string, margins?: Margins): IntersectionObserver;

    
    relativeToViewport(margins?: Margins): IntersectionObserver;
  }

  
  type OnAppShowCallback = (options: LaunchOptionsApp) => void;
  
  type OffAppShowCallback = (res: GeneralCallbackResult) => void;
  
  type OnAppHideCallback = (res: GeneralCallbackResult) => void;

  type OnWindowResizeCallbackResult = {
    type: 'portrait' | 'landscape';
    size: { windowWidth: Number; windowHeight: Number };
  };
  type OnWindowResizeCallback = (res: OnWindowResizeCallbackResult) => void;

  type OnErrorResult = string;
  type OnErrorCallback = (res: OnErrorResult) => void;

  type OnAppEventCallbackResult = {
    key: string;
    text: string;
    iconPath: string;
  };
  type OnAppEventCallback = (res: OnAppEventCallbackResult) => void;
  type OnAppCloseCallback = (res: { pagePath: string }) => void;

  type OnThemeChangeCallbackResult = { theme: 'dark' | 'light' };
  type OnThemeChangeCallback = (res: OnThemeChangeCallbackResult) => void;

  type OnPageNotFoundCallback = (res: { url: string; query: Record<string, string> }) => void;

  type ThemeInfo = {
    '--app-B1': string;
    '--app-B1-N1': string;
    '--app-B1-N2': string;
    '--app-B1-N3': string;
    '--app-B1-N4': string;
    '--app-B1-N5': string;
    '--app-B1-N6': string;
    '--app-B1-N7': string;
    '--app-B1-N8': string;
    '--app-B1-N9': string;
    '--app-B1_2': string;
    '--app-B1_2-N1': string;
    '--app-B1_2-N2': string;
    '--app-B1_2-N3': string;
    '--app-B1_2-N4': string;
    '--app-B1_2-N5': string;
    '--app-B1_2-N6': string;
    '--app-B1_2-N7': string;
    '--app-B1_2-N8': string;
    '--app-B1_2-N9': string;
    '--app-B2': string;
    '--app-B2-N1': string;
    '--app-B2-N2': string;
    '--app-B2-N3': string;
    '--app-B2-N4': string;
    '--app-B2-N5': string;
    '--app-B2-N6': string;
    '--app-B2-N7': string;
    '--app-B2-N8': string;
    '--app-B2-N9': string;
    '--app-B2_2': string;
    '--app-B2_2-N1': string;
    '--app-B2_2-N2': string;
    '--app-B2_2-N3': string;
    '--app-B2_2-N4': string;
    '--app-B2_2-N5': string;
    '--app-B2_2-N6': string;
    '--app-B2_2-N7': string;
    '--app-B2_2-N8': string;
    '--app-B2_2-N9': string;
    '--app-B3': string;
    '--app-B3-N1': string;
    '--app-B3-N2': string;
    '--app-B3-N3': string;
    '--app-B3-N4': string;
    '--app-B3-N5': string;
    '--app-B3-N6': string;
    '--app-B3-N7': string;
    '--app-B3-N8': string;
    '--app-B3-N9': string;
    '--app-B3_2': string;
    '--app-B3_2-N1': string;
    '--app-B3_2-N2': string;
    '--app-B3_2-N3': string;
    '--app-B3_2-N4': string;
    '--app-B3_2-N5': string;
    '--app-B3_2-N6': string;
    '--app-B3_2-N7': string;
    '--app-B3_2-N8': string;
    '--app-B3_2-N9': string;
    '--app-B4': string;
    '--app-B4-N1': string;
    '--app-B4-N2': string;
    '--app-B4-N3': string;
    '--app-B4-N4': string;
    '--app-B4-N5': string;
    '--app-B4-N6': string;
    '--app-B4-N7': string;
    '--app-B4-N8': string;
    '--app-B4-N9': string;
    '--app-B4_2': string;
    '--app-B4_2-N1': string;
    '--app-B4_2-N2': string;
    '--app-B4_2-N3': string;
    '--app-B4_2-N4': string;
    '--app-B4_2-N5': string;
    '--app-B4_2-N6': string;
    '--app-B4_2-N7': string;
    '--app-B4_2-N8': string;
    '--app-B4_2-N9': string;
    '--app-B5': string;
    '--app-B5-N1': string;
    '--app-B5-N2': string;
    '--app-B5-N3': string;
    '--app-B5-N4': string;
    '--app-B5-N5': string;
    '--app-B5-N6': string;
    '--app-B5-N7': string;
    '--app-B5-N8': string;
    '--app-B5-N9': string;
    '--app-B5_2': string;
    '--app-B5_2-N1': string;
    '--app-B5_2-N2': string;
    '--app-B5_2-N3': string;
    '--app-B5_2-N4': string;
    '--app-B5_2-N5': string;
    '--app-B5_2-N6': string;
    '--app-B5_2-N7': string;
    '--app-B5_2-N8': string;
    '--app-B5_2-N9': string;
    '--app-B6': string;
    '--app-B6-N1': string;
    '--app-B6-N2': string;
    '--app-B6-N3': string;
    '--app-B6-N4': string;
    '--app-B6-N5': string;
    '--app-B6-N6': string;
    '--app-B6-N7': string;
    '--app-B6-N8': string;
    '--app-B6-N9': string;
    '--app-B6_2': string;
    '--app-B6_2-N1': string;
    '--app-B6_2-N2': string;
    '--app-B6_2-N3': string;
    '--app-B6_2-N4': string;
    '--app-B6_2-N5': string;
    '--app-B6_2-N6': string;
    '--app-B6_2-N7': string;
    '--app-B6_2-N8': string;
    '--app-B6_2-N9': string;
    '--app-C1_1': string;
    '--app-C1_2': string;
    '--app-C1_3': string;
    '--app-C2': string;
    '--app-C2_2': string;
    '--app-C2_3': string;
    '--app-C3_1': string;
    '--app-C3_2': string;
    '--app-C3_3': string;
    '--app-C3_4': string;
    '--app-I1': string;
    '--app-I2': string;
    '--app-I3': string;
    '--app-I4': string;
    '--app-I5': string;
    '--app-I6': string;
    '--app-I7': string;
    '--app-IC1': string;
    '--app-IC2': string;
    '--app-IC3': string;
    '--app-IC4': string;
    '--app-IC5': string;
    '--app-M1': string;
    '--app-M1-N1': string;
    '--app-M1-N2': string;
    '--app-M1-N3': string;
    '--app-M1-N4': string;
    '--app-M1-N5': string;
    '--app-M1-N6': string;
    '--app-M1-N7': string;
    '--app-M1-N8': string;
    '--app-M1-N9': string;
    '--app-M1_1': string;
    '--app-M1_1-N1': string;
    '--app-M1_1-N2': string;
    '--app-M1_1-N3': string;
    '--app-M1_1-N4': string;
    '--app-M1_1-N5': string;
    '--app-M1_1-N6': string;
    '--app-M1_1-N7': string;
    '--app-M1_1-N8': string;
    '--app-M1_1-N9': string;
    '--app-M1_2': string;
    '--app-M1_2-N1': string;
    '--app-M1_2-N2': string;
    '--app-M1_2-N3': string;
    '--app-M1_2-N4': string;
    '--app-M1_2-N5': string;
    '--app-M1_2-N6': string;
    '--app-M1_2-N7': string;
    '--app-M1_2-N8': string;
    '--app-M1_2-N9': string;
    '--app-M2': string;
    '--app-M2-N1': string;
    '--app-M2-N2': string;
    '--app-M2-N3': string;
    '--app-M2-N4': string;
    '--app-M2-N5': string;
    '--app-M2-N6': string;
    '--app-M2-N7': string;
    '--app-M2-N8': string;
    '--app-M2-N9': string;
    '--app-M2_1': string;
    '--app-M2_1-N1': string;
    '--app-M2_1-N2': string;
    '--app-M2_1-N3': string;
    '--app-M2_1-N4': string;
    '--app-M2_1-N5': string;
    '--app-M2_1-N6': string;
    '--app-M2_1-N7': string;
    '--app-M2_1-N8': string;
    '--app-M2_1-N9': string;
    '--app-M2_2': string;
    '--app-M2_2-N1': string;
    '--app-M2_2-N2': string;
    '--app-M2_2-N3': string;
    '--app-M2_2-N4': string;
    '--app-M2_2-N5': string;
    '--app-M2_2-N6': string;
    '--app-M2_2-N7': string;
    '--app-M2_2-N8': string;
    '--app-M2_2-N9': string;
    '--app-M3': string;
    '--app-M3-N1': string;
    '--app-M3-N2': string;
    '--app-M3-N3': string;
    '--app-M3-N4': string;
    '--app-M3-N5': string;
    '--app-M3-N6': string;
    '--app-M3-N7': string;
    '--app-M3-N8': string;
    '--app-M3-N9': string;
    '--app-M3_1': string;
    '--app-M3_1-N1': string;
    '--app-M3_1-N2': string;
    '--app-M3_1-N3': string;
    '--app-M3_1-N4': string;
    '--app-M3_1-N5': string;
    '--app-M3_1-N6': string;
    '--app-M3_1-N7': string;
    '--app-M3_1-N8': string;
    '--app-M3_1-N9': string;
    '--app-M3_2': string;
    '--app-M3_2-N1': string;
    '--app-M3_2-N2': string;
    '--app-M3_2-N3': string;
    '--app-M3_2-N4': string;
    '--app-M3_2-N5': string;
    '--app-M3_2-N6': string;
    '--app-M3_2-N7': string;
    '--app-M3_2-N8': string;
    '--app-M3_2-N9': string;
    '--app-M4': string;
    '--app-M4-N1': string;
    '--app-M4-N2': string;
    '--app-M4-N3': string;
    '--app-M4-N4': string;
    '--app-M4-N5': string;
    '--app-M4-N6': string;
    '--app-M4-N7': string;
    '--app-M4-N8': string;
    '--app-M4-N9': string;
    '--app-M4_1': string;
    '--app-M4_1-N1': string;
    '--app-M4_1-N2': string;
    '--app-M4_1-N3': string;
    '--app-M4_1-N4': string;
    '--app-M4_1-N5': string;
    '--app-M4_1-N6': string;
    '--app-M4_1-N7': string;
    '--app-M4_1-N8': string;
    '--app-M4_1-N9': string;
    '--app-M4_2': string;
    '--app-M4_2-N1': string;
    '--app-M4_2-N2': string;
    '--app-M4_2-N3': string;
    '--app-M4_2-N4': string;
    '--app-M4_2-N5': string;
    '--app-M4_2-N6': string;
    '--app-M4_2-N7': string;
    '--app-M4_2-N8': string;
    '--app-M4_2-N9': string;
    '--app-M5': string;
    '--app-M5-N1': string;
    '--app-M5-N2': string;
    '--app-M5-N3': string;
    '--app-M5-N4': string;
    '--app-M5-N5': string;
    '--app-M5-N6': string;
    '--app-M5-N7': string;
    '--app-M5-N8': string;
    '--app-M5-N9': string;
    '--app-P0': string;
    '--app-P1': string;
    '--app-P2': string;
    '--app-P3': string;
    '--app-P4': string;
    '--app-P5': string;
    '--app-P6': string;
    '--app-P7': string;
    '--app-P8': string;
    '--app-P9': string;
    '--app-T1-f': string;
    '--app-T1-h': string;
    '--app-T1-p': string;
    '--app-T2-f': string;
    '--app-T2-h': string;
    '--app-T2-p': string;
    '--app-T3-f': string;
    '--app-T3-h': string;
    '--app-T3-p': string;
    '--app-T4-f': string;
    '--app-T4-h': string;
    '--app-T4-p': string;
    '--app-T5-f': string;
    '--app-T5-h': string;
    '--app-T5-p': string;
    '--app-T6-f': string;
    '--app-T6-h': string;
    '--app-T6-p': string;
    '--app-T7-f': string;
    '--app-T7-h': string;
    '--app-T7-p': string;
    '--app-T8-f': string;
    '--app-T8-h': string;
    '--app-T8-p': string;
    '--app-T9-f': string;
    '--app-T9-h': string;
    '--app-T9-p': string;
    '--app-T10-f': string;
    '--app-T10-h': string;
    '--app-T10-p': string;
    '--app-T11-f': string;
    '--app-T11-h': string;
    '--app-T11-p': string;
    '--app-T12-f': string;
    '--app-T12-h': string;
    '--app-T12-p': string;
    '--app-T13-f': string;
    '--app-T13-h': string;
    '--app-T13-p': string;
  };

  interface SetWidgetHeightOptions {
    height: number;
  }

  type PresetFunctionalDataOptions = AsyncApiOptions<
    { errMsg: 'presetFunctionalData:ok' },
    { errMsg: 'presetFunctionalData:fail' }
  > & {
    url: string;
    data: Record<string, any>;
  };

  interface WebviewContext {
    postMessage(msg: { data: Record<string, any> }): void;
    reload(options?: { success?: () => void; fail?: () => void; complete?: () => void }): void;
  }

  interface TY {
    
    requestCloud<T extends RequestCloudOptions = RequestCloudOptions>(
      option: T,
    ): PromisifySuccessResult<T, RequestCloudOptions>;

    
    onAppReady(listener: OnAppReadyCallback): void;

    
    offAppReady(listener?: OnAppReadyCallback): void;

    
    onAppShow(listener: OnAppShowCallback): void;

    
    offAppShow(listener?: OffAppShowCallback): void;

    
    onAppHide(listener: OnAppHideCallback): void;

    
    offAppHide(listener: OnAppHideCallback): void;

    
    onWindowResize(listener: OnWindowResizeCallback): void;

    
    offWindowResize(listener: OnWindowResizeCallback): void;

    
    onError(listener: OnErrorCallback): void;

    
    offError(listener?: OnErrorCallback): void;

    
    onAppEvent(listener: OnAppEventCallback): void;

    
    offAppEvent(listener?: OnAppEventCallback): void;

    
    onAppClose(listener: OnAppCloseCallback): void;

    
    offAppClose(listener?: OnAppCloseCallback): void;

    
    onThemeChange(listener: OnThemeChangeCallback): void;

    
    offThemeChange(listener?: OnThemeChangeCallback): void;

    
    onPageNotFound(listener: OnPageNotFoundCallback): void;

    
    onUnhandledRejection(listener: OnUnhandledRejectionCallback): void;

    
    offUnhandledRejection(listener?: OnUnhandledRejectionCallback): void;

    
    pageScrollTo(options: PageScrollToOptions): void;

    
    setPageStyle(options: SetPageStyleOptions): void;

    
    createAnimation(options?: CreateAnimationOptions): Animation;

    
    createSelectorQuery(): SelectorQuery;

    
    createIntersectionObserver(component: IAnyObject, options?: CreateIntersectionObserverOption): IntersectionObserver;

    
    getThemeInfo(): ThemeInfo;

    

    nextTick(callback: () => void): void;

    
    canIUse(schema: string): boolean;

    
    setWidgetHeight(options: SetWidgetHeightOptions): void;

    presetFunctionalData(options: PresetFunctionalDataOptions): void;

    
    createWebviewContext(webviewId: string): WebviewContext;

    
    createIpcPlayerContext(deviceId: string): IpcContext;

    
    getCustomConfig<T = IAnyObject, O extends AsyncApiOptions<T> = AsyncApiOptions<T>>(
      options?: O,
    ): O extends
      | { success: (...args: unknown[]) => void }
      | { fail: (...args: unknown[]) => void }
      | { complete: (...args: unknown[]) => void }
      ? void
      : Promise<T>;
  }

  interface I18n {
    t(key: string): string;
  }

  
  interface IpcContext {
    connect(res?: Callback): void;
    disconnect(res?: Callback): void;
    startPreview(res?: any): void;
    stopPreview(res?: any): void;
    snapshot(res: Callback & { saveToAlbum?: number }): void;
    setMuted(res: Callback & { mute?: boolean }): void;
    setSoundMode(res: Callback & { mode?: 'speaker' | 'ear' }): void;
    setClarity(res: Callback & { clarity?: 'normal' | 'hd' }): void;
    startTalk(res: Callback): void;
    stopTalk(res: Callback & { saveToAlbum?: number }): void;
    isTalkBacking(res?: Callback & { success: { r: boolean } }): void;
    startRecord(res?: Callback & { saveToAlbum?: 0 | 1 }): void;
    stopRecord(res?: Callback & { saveToAlbum?: 0 | 1 }): void;
    isRecording(res?: Callback & { success: { r: boolean } }): void;
    setAvailableRockerDirections(
      res?: Callback & { left?: number; right?: number; top?: number; bottom?: number },
    ): void;
    setTrackingStatus(res?: Callback & { status?: boolean }): void;
    getVideoInfo(res?: Callback): void;
    isMuted(res: Callback & { success: (r: { isMuted: boolean }) => void }): void;
    setConfig(res: Callback & { config?: string }): void;
  }
}
