declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Properties<TLength = (string & Record<string, never>) | number> {
    [index: `--${string}`]: string | number;
  }
}
