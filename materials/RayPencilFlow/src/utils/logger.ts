/* eslint-disable no-console */
const LEVELS = {
  VERBOSE: 4,
  SUCCESS: 3,
  INFO: 2,
  WARN: 1,
  FATAL: 0,
} as const;

const LEVELSReverse = {
  4: 'VERBOSE',
  3: 'SUCCESS',
  2: 'INFO',
  1: 'WARN',
  0: 'FATAL',
} as const;

type LEVEL = (typeof LEVELS)[keyof typeof LEVELS];

const DEFAULT_CONFIG = {
  name: 'default: ',
  level: LEVELS.INFO,
  isOpen: true, // 是否开启日志展示
};

type Logger = {
  verbose: (text: string, ...args: any) => void;
  info: (text: string, ...args: any) => void;
  warning: (text: string, ...args: any) => void;
  success: (text: string, ...args: any) => void;
  fatal: (text: string, ...args: any) => void;
  now: number;
};

type TCfg = {
  name?: string; // 名称
  level?: LEVEL; // 日志输出级别
  label?: string; // 日志标签
  isOpen?: boolean; // 是否开启日志展示
};

export const createLogger = (cfg: TCfg): Logger => {
  const config = { ...DEFAULT_CONFIG, ...cfg };
  if (!config.isOpen) {
    return {
      verbose: () => null,
      info: () => null,
      warning: () => null,
      success: () => null,
      fatal: () => null,
      now: 0,
    };
  }
  const levelWeight = LEVELS[config.level ?? 'INFO'];
  const colorMap = {
    VERBOSE: '#AAAAAA',
    SUCCESS: '#2DDA86',
    INFO: '#1989FA',
    WARN: '#FFA000',
    FATAL: '#F04C4C',
  };
  const strMap = {
    basic: {
      format: (level: LEVEL, timeStr: string) => {
        return `%c[${timeStr}] %c[${LEVELSReverse[level]}] %c${config.name}`;
      },
      styles: (level: LEVEL) => [
        'font-weight: bold;',
        `color: ${colorMap[LEVELSReverse[level]]}; font-weight: bold;`,
        'font-weight: bold;',
      ],
    },
    withLabel: {
      format: (level: LEVEL, timeStr: string) =>
        `%c[${timeStr}] %c[${LEVELSReverse[level]}] %c${config.name} %cby ${config.label}`,
      styles: (level: LEVEL) => [
        'font-weight: bold;',
        `color: ${colorMap[LEVELSReverse[level]]}; font-weight: bold;`,
        'font-weight: bold;',
      ],
    },
  };

  const format = config.label ? strMap.withLabel.format : strMap.basic.format;
  const styles = config.label ? strMap.withLabel.styles : strMap.basic.styles;
  const log = (level: LEVEL, text: string, ...args: any[]) => {
    const curLevelWeight = LEVELS[level];
    if (curLevelWeight > levelWeight) {
      return;
    }
    const date = new Date();
    const timeStr = `${date.toLocaleString()}.${`${date.getMilliseconds()}`.padStart(3, '0')}`;
    console.log &&
      console.log(
        `${format(level, timeStr)}: %c${JSON.stringify(text)}`,
        ...[...styles(level), 'font-weight: normal'],
        ...(args ?? [])
      );
  };
  function verbose(text: any, ...args: any[]) {
    log(LEVELS.VERBOSE, text, ...args);
  }
  function success(text: any, ...args: any[]) {
    log(LEVELS.SUCCESS, text, ...args);
  }
  function info(text: any, ...args: any[]) {
    log(LEVELS.INFO, text, ...args);
  }
  function warning(text: any, ...args: any[]) {
    log(LEVELS.WARN, text, ...args);
  }
  function fatal(text: any, ...args: any[]) {
    log(LEVELS.FATAL, text, ...args);
  }
  return {
    verbose,
    success,
    info,
    warning,
    fatal,
    now: +new Date(),
  };
};
const log = createLogger({
  name: 'MiniApp-Canvas',
});

export default log;
