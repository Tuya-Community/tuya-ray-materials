declare type TMiniCanvas = HTMLCanvasElement & {
  createImage: () => {
    onload: (event: any) => void;
    onerror: (event: any) => void;
    src: string;
  };
};

declare type TMiniCanvasCtx = CanvasRenderingContext2D;
