declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.jpg' {
  const url: string;
  export default url;
}
