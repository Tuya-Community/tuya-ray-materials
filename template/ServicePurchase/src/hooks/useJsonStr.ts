/**
 * @file useJsonStr.ts
 * @brief JSON parsing utilities — a React Hook for memoized parsing
 *        and a standalone helper for style-string conversion.
 */

import { useMemo } from "react";

function useJsonStr<T = Record<string, any>>(jsonStr = "{}"): T {
  const json = useMemo(() => {
    const setting = {} as T;
    try {
      const data = JSON.parse(jsonStr);
      Object.keys(data).forEach((key) => {
        setting[key] = data[key];
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return setting;
  }, [jsonStr]);

  return json;
}

export const parseJson = (
  styleStr: string,
  defaultData?: Record<string, any>,
): Record<string, any> => {
  const shouldAddPX = [
    "gap",
    "paddingTop",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
  ];

  let json = defaultData || {};
  try {
    json = {
      ...json,
      ...JSON.parse(styleStr),
    };
  } catch {
    // Gracefully fall back to defaultData when styleStr is not valid JSON
  }

  // Miniapp requires explicit px units for spacing properties
  Object.keys(json).forEach((key) => {
    if (shouldAddPX.includes(key)) {
      json[key] = json[key] === 0 ? 0 : `${json[key]}px`;
    }
  });

  return json;
};

export default useJsonStr;
