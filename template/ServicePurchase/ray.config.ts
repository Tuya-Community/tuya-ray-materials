/**
 * @file ray.config.ts
 * @brief Ray CLI build configuration.
 *
 * Common options:
 *   - sourceMap: enable source maps for debugging
 *   - plugins: register Ray build plugins
 *   - webpack: customize underlying webpack config
 */

import { RayConfig } from "@ray-js/types";
import SmartUIAutoImport from "@ray-js/smart-ui/lib/auto-import";

const config: RayConfig = {
  importTransformer: [SmartUIAutoImport],
};

export default config;
