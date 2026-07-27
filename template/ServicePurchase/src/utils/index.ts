/**
 * @file utils/index.ts
 * @brief Shared utility functions: app info, device detection,
 *        time formatting, haptics, and local storage wrapper.
 */

export { getCurrencySignFromCode } from "./currency";
import { subscriptionUnitText } from "@/constants";
import { IPeriodUnit, SubscriptionDuration } from "@/types";

interface I18nOptions {
  defaultValue?: string;
  [key: string]: string | number | undefined;
}

/** i18n helper with template variable substitution. Not a React Hook — safe to call anywhere. */
export const getI18nHelper = (): { t: (code: string, options?: I18nOptions) => string } => {
  return {
    t: (code: string, options?: I18nOptions): string => {
      let string: string = I18n.t(code);
      if (string === code && options?.defaultValue) {
        string = options.defaultValue || string;
      }
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (key === "defaultValue") return;
          string = string.replace(new RegExp(`{{\\s*${key}\\s*}}`, "ig"), String(value));
        });
      }
      return string;
    },
  };
};

interface AppInfo {
  serverTimestamp: number;
  appVersion: string;
  language: string;
  countryCode: string;
  regionCode: string;
  appName: string;
  appIcon: string;
  appEnv?: number;
  appBundleId: string;
  appScheme: string;
  appId: string;
  clientId?: string;
}

/** Get app information from the Tuya runtime */
export async function getAppInfo(): Promise<AppInfo> {
  return new Promise((resolve, reject) => {
    ty.getAppInfo({
      success(res) {
        resolve(res as AppInfo);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/** Get user information */
export function getUserInfo(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    ty.getUserInfo({
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/** Get current home ID */
export function getCurrentHomeId(): Promise<string | null> {
  return new Promise((resolve) => {
    ty.home.getCurrentHomeInfo({
      success: (params) => {
        resolve(params.homeId);
      },
      fail: () => {
        resolve(null);
      },
    });
  });
}

/** Check if current platform is Android */
export function isAndroid(): boolean {
  const { platform } = ty.getSystemInfoSync();
  return platform === "android";
}

/** Format a timestamp into a date string */
export const formatTime = (time: number | string, format = "YYYY-MM-DD"): string => {
  if (time && !isNaN(Number(time)) && Number(time)) {
    const d = new Date(time);

    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    const ymd = [year, month, day].join("-");

    switch (format) {
      case "YYYY-MM-DD": {
        return ymd;
      }
      case "YYYY-MM-DD HH:mm:ss": {
        let hour = "" + d.getHours();
        let minute = "" + d.getMinutes();
        let second = "" + d.getSeconds();
        if (hour.length < 2) hour = "0" + hour;
        if (minute.length < 2) minute = "0" + minute;
        if (second.length < 2) second = "0" + second;
        const hms = [hour, minute, second].join(":");
        return `${ymd} ${hms}`;
      }
      default:
        return ymd;
    }
  }
  return "";
};

/** Trigger a light haptic vibration */
export const lightVibrateShort = (): void => {
  try {
    ty.vibrateShort({
      type: "light",
    });
  } catch {
    // Vibration may not be supported on all devices
  }
};

/** Typed wrapper around the miniapp storage API */
export const localStorage = {
  setItem: (key: string, data: string): void => {
    try {
      ty.setStorageSync({
        key,
        data,
      });
    } catch {
      // Storage write may fail on some platforms
    }
  },
  getItem: (key: string): string => {
    return ty.getStorageSync({ key }) as string;
  },
  removeItem: (key: string): void => {
    ty.removeStorageSync({ key });
  },
  keys: {
    mockPaySuccess: "mockPaySuccess",
  },
};

/**
 * Get the localized subscription unit label (e.g. "Monthly", "Quarterly").
 * Maps special multi-month values to named durations.
 */
export const getSubscriptionUnitText = (periodUnit: IPeriodUnit, periodValue: number): string => {
  const { t } = getI18nHelper();
  let subUnit: SubscriptionDuration = periodUnit as any;
  let subValue = periodValue;
  if (periodUnit === IPeriodUnit.month && periodValue === 3) {
    subUnit = SubscriptionDuration.quarterYear;
    subValue = 1;
  } else if (periodUnit === IPeriodUnit.month && periodValue === 6) {
    subUnit = SubscriptionDuration.halfYear;
    subValue = 1;
  }

  const pluralKeys = {
    [SubscriptionDuration.year]: "sub.plural.year",
    [SubscriptionDuration.month]: "sub.plural.month",
    [SubscriptionDuration.day]: "sub.plural.day",
    [SubscriptionDuration.week]: "sub.plural.week",
    [SubscriptionDuration.halfYear]: "sub.plural.halfYear",
    [SubscriptionDuration.quarterYear]: "sub.plural.quarterYear",
  };

  if (subValue > 1) {
    return t(pluralKeys[subUnit], { count: subValue });
  }
  return I18n.t(subscriptionUnitText[subUnit]);
};
