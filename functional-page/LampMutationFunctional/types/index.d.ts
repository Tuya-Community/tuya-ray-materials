declare module '*.scss'
declare module '*.png'

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less?modules' {
  const classes: { [key: string]: string };
  export default classes;
}
