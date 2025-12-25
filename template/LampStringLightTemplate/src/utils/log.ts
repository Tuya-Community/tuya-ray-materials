/**
 * init log 本地调试日志是否开启
 * @param isOpen - whether to open log in production environment, default is false
 */
export const logInit = (isOpen = false) => {
  const { log } = console;
  const isDev = process.env.NODE_ENV === 'development';
  console.log = (...args: any[]) => {
    if (isDev || isOpen) {
      log(...args);
    }
  };
};

export default logInit;
