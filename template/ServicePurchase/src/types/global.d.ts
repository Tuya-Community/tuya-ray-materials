// 声明Less模块
declare module "*.module.less" {
  const classes: {
    [key: string]: string;
  };
  export default classes;
}

// 可选：如果还使用了普通Less文件（非module）
declare module "*.less" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.jpeg" {
  const content: any;
  export default content;
}
