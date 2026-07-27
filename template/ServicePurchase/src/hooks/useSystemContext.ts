/**
 * @file useSystemContext.ts
 * @brief Provides system information (status bar height, theme, language)
 *        via React Context for layout and theming.
 */

import { createContext, useContext } from "react";

interface System extends ReturnType<typeof ty.getSystemInfoSync> {
  themeInfo: Record<string, string>;
}

const system = ty.getSystemInfoSync();
// @ts-expect-error ty.getThemeInfo is provided by the Tuya runtime but not in type definitions
const themeInfo = ty.getThemeInfo?.() ?? {};

export const initSystemData: System = {
  statusBarHeight: 20,
  theme: "light",
  language: "en",
  themeInfo,
  ...system,
} as System;

export const SystemContext = createContext<System>(initSystemData);

export default function useSystemContext(): System {
  const system = useContext(SystemContext);
  return system;
}
