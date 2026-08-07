declare global {
  interface Window {
    devToolsExtension?: () => any;
    __DEV__: boolean;
  }
}

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
