declare module '*.less';
declare module '*.rjs';
declare module '*.png';
declare global {
  interface Window {
    devToolsExtension?: () => any;
    ty: Ty;
  }
}

interface Ty {
  [key]: any;
}

declare const ty: Ty;

type RGB = {
  r: number;
  g: number;
  b: number;
};

type RGBA = RGB & {
  a?: number;
};

type HS = {
  h: number;
  s: number;
};

type HSL = HS & {
  l: number;
};

type HSV = HS & {
  v: number;
};

type TDetail = {
  h: number;
  s: number;
};
