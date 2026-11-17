declare namespace SmartMiniprogram.Component {
  type Instance<
    TData extends DataOption,
    TProperty extends PropertyOption,
    TMethod extends Partial<MethodOption>,
    TCustomInstanceProperty extends IAnyObject = {},
    TIsPage extends boolean = false,
  > = InstanceProperties &
    InstanceMethods<TData> &
    TMethod &
    (TIsPage extends true ? Page.ILifetime : {}) &
    TCustomInstanceProperty & {
      
      data: TData & PropertyOptionToData<TProperty>;
      
      properties: TData & PropertyOptionToData<TProperty>;
    };
  type TrivialInstance = Instance<IAnyObject, IAnyObject, IAnyObject, IAnyObject>;
  type TrivialOption = Options<IAnyObject, IAnyObject, IAnyObject, IAnyObject>;
  type Options<
    TData extends DataOption,
    TProperty extends PropertyOption,
    TMethod extends MethodOption,
    TCustomInstanceProperty extends IAnyObject = {},
    TIsPage extends boolean = false,
  > = Partial<Data<TData>> &
    Partial<Property<TProperty>> &
    Partial<Method<TMethod, TIsPage>> &
    Partial<OtherOption> &
    Partial<Lifetimes> &
    ThisType<Instance<TData, TProperty, TMethod, TCustomInstanceProperty, TIsPage>>;

  interface Constructor {
    <
      TData extends DataOption,
      TProperty extends PropertyOption,
      TMethod extends MethodOption,
      TCustomInstanceProperty extends IAnyObject = {},
      TIsPage extends boolean = false,
    >(
      options: Options<TData, TProperty, TMethod, TCustomInstanceProperty, TIsPage>,
    ): string;
  }

  type DataOption = Record<string, any>;
  type PropertyOption = Record<string, AllProperty>;
  type MethodOption = Record<string, Function>;

  interface Data<D extends DataOption> {
    
    data?: D;
  }

  interface Property<P extends PropertyOption> {
    
    properties: P;
  }

  interface Method<M extends MethodOption, TIsPage extends boolean = false> {
    
    methods: M & (TIsPage extends true ? Partial<Page.ILifetime> : {});
  }

  type PropertyType =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | null;
  type ValueType<T extends PropertyType> = T extends null
    ? any
    : T extends StringConstructor
      ? string
      : T extends NumberConstructor
        ? number
        : T extends BooleanConstructor
          ? boolean
          : T extends ArrayConstructor
            ? any[]
            : T extends ObjectConstructor
              ? IAnyObject
              : never;
  type FullProperty<T extends PropertyType> = {
    
    type: T;
    
    value?: ValueType<T>;
    
    observer?: string | ((newVal: ValueType<T>, oldVal: ValueType<T>, changedPath: Array<string | number>) => void);
    
    optionalTypes?: ShortProperty[];
  };
  type AllFullProperty =
    | FullProperty<StringConstructor>
    | FullProperty<NumberConstructor>
    | FullProperty<BooleanConstructor>
    | FullProperty<ArrayConstructor>
    | FullProperty<ObjectConstructor>
    | FullProperty<null>;
  type ShortProperty =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | null;
  type AllProperty = AllFullProperty | ShortProperty;
  type PropertyToData<T extends AllProperty> = T extends ShortProperty
    ? ValueType<T>
    : FullPropertyToData<Exclude<T, ShortProperty>>;
  type FullPropertyToData<T extends AllFullProperty> = ValueType<T['type']>;
  
  type PropertyOptionToData<P extends PropertyOption> = {
    [name in keyof P]: PropertyToData<P[name]>;
  };

  interface InstanceProperties {
    
    is: string;
    
    id: string;
    
    dataset: Record<string, string>;
  }

  interface InstanceMethods<D extends DataOption> {
    
    setData(
      
      data: Partial<D> & IAnyObject,
      
      callback?: () => void,
    ): void;

    
    hasBehavior(behavior: Behavior.BehaviorIdentifier): void;

    
    triggerEvent<DetailType = any>(name: string, detail?: DetailType, options?: TriggerEventOption): void;

    
    createSelectorQuery(): SelectorQuery;

    
    createIntersectionObserver(options: CreateIntersectionObserverOption): IntersectionObserver;

    
    selectComponent(selector: string): TrivialInstance;

    
    selectAllComponents(selector: string): TrivialInstance[];

    
    selectOwnerComponent(): TrivialInstance;

    
    getRelationNodes(relationKey: string): TrivialInstance[];

    
    groupSetData(callback?: () => void): void;

    
    getTabBar(): TrivialInstance;

    
    getPageId(): string;

    
    animate(selector: string, keyFrames: KeyFrame[], duration: number, callback?: () => void): void;

    
    animate(
      selector: string,
      keyFrames: ScrollTimelineKeyframe[],
      duration: number,
      scrollTimeline: ScrollTimelineOption,
    ): void;

    
    clearAnimation(selector: string, callback: () => void): void;

    
    clearAnimation(selector: string, options?: ClearAnimationOptions, callback?: () => void): void;

    
    getOpenerEventChannel(): EventChannel;
  }

  interface ComponentOptions {
    
    multipleSlots?: boolean;
    
    addGlobalClass?: boolean;
    
    styleIsolation?: 'isolated' | 'apply-shared' | 'shared';
    
    pureDataPattern?: RegExp;
  }

  interface TriggerEventOption {
    
    bubbles?: boolean;
    
    composed?: boolean;
    
    capturePhase?: boolean;
  }

  interface RelationOption {
    
    type: 'parent' | 'child' | 'ancestor' | 'descendant';
    
    target?: string;

    
    linked?(target: TrivialInstance): void;

    
    linkChanged?(target: TrivialInstance): void;

    
    unlinked?(target: TrivialInstance): void;
  }

  interface PageLifetimes {
    
    show(): void;

    
    hide(): void;

    
    resize(size: Page.IResizeOption): void;
  }

  type DefinitionFilter = <T extends TrivialOption>(
    
    defFields: T,
    
    definitionFilterArr?: DefinitionFilter[],
  ) => void;

  interface Lifetimes {
    
    lifetimes: Partial<{
      
      created(): void;
      
      attached(): void;
      
      ready(): void;
      
      moved(): void;
      
      detached(): void;
      
      error(err: Error): void;
    }>;
  }

  interface OtherOption {
    
    behaviors: Behavior.BehaviorIdentifier[];
    
    observers: Record<string, (...args: any[]) => any>;
    
    relations: {
      [componentName: string]: RelationOption;
    };
    
    externalClasses?: string[];
    
    pageLifetimes?: Partial<PageLifetimes>;
    
    options: ComponentOptions;

    
    definitionFilter?: DefinitionFilter;
    
    
    
  }

  interface KeyFrame {
    
    offset?: number;
    
    ease?: string;
    
    transformOrigin?: string;
    
    backgroundColor?: string;
    
    bottom?: number | string;
    
    height?: number | string;
    
    left?: number | string;
    
    width?: number | string;
    
    opacity?: number | string;
    
    right?: number | string;
    
    top?: number | string;
    
    matrix?: number[];
    
    matrix3d?: number[];
    
    rotate?: number;
    
    rotate3d?: number[];
    
    rotateX?: number;
    
    rotateY?: number;
    
    rotateZ?: number;
    
    scale?: number[];
    
    scale3d?: number[];
    
    scaleX?: number;
    
    scaleY?: number;
    
    scaleZ?: number;
    
    skew?: number[];
    
    skewX?: number;
    
    skewY?: number;
    
    translate?: Array<number | string>;
    
    translate3d?: Array<number | string>;
    
    translateX?: number | string;
    
    translateY?: number | string;
    
    translateZ?: number | string;
  }

  interface ClearAnimationOptions {
    
    transformOrigin?: boolean;
    
    backgroundColor?: boolean;
    
    bottom?: boolean;
    
    height?: boolean;
    
    left?: boolean;
    
    width?: boolean;
    
    opacity?: boolean;
    
    right?: boolean;
    
    top?: boolean;
    
    matrix?: boolean;
    
    matrix3d?: boolean;
    
    rotate?: boolean;
    
    rotate3d?: boolean;
    
    rotateX?: boolean;
    
    rotateY?: boolean;
    
    rotateZ?: boolean;
    
    scale?: boolean;
    
    scale3d?: boolean;
    
    scaleX?: boolean;
    
    scaleY?: boolean;
    
    scaleZ?: boolean;
    
    skew?: boolean;
    
    skewX?: boolean;
    
    skewY?: boolean;
    
    translate?: boolean;
    
    translate3d?: boolean;
    
    translateX?: boolean;
    
    translateY?: boolean;
    
    translateZ?: boolean;
  }

  interface ScrollTimelineKeyframe {
    composite?: 'replace' | 'add' | 'accumulate' | 'auto';
    easing?: string;
    offset?: number | null;

    [property: string]: string | number | null | undefined;
  }

  interface ScrollTimelineOption {
    
    scrollSource: string;
    
    orientation?: string;
    
    startScrollOffset: number;
    
    endScrollOffset: number;
    
    timeRange: number;
  }
}

declare let Component: SmartMiniprogram.Component.Constructor;
