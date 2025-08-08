import { RayConfig } from "@ray-js/types";
import path from "path";

function resolveRoot(s: string) {
  return path.resolve(__dirname, s);
}

const config: RayConfig = {
  debug: false,
  functionalRoot: "./functional", // 固定的设置
  // @ts-ignore
  resolveAlias: {
    // '@ray-js/electrician-timing-sdk': resolveRoot("../../sdk/ray-electrician-timing-sdk/packages/timer-sdk/src"),
  },
  plugins: [
    {
      name: "nextjs",
      // @ts-ignore
      configWebpack({ config, addCSSRule }) {
        addCSSRule({
          name: "scss",
          test: /\.scss(\?.*)?$/,
          // loader: require.resolve("sass-loader"),
          options: {},
        });
        config.resolve.alias.set("@styles", resolveRoot("./src/styles"));
      },
    },
  ],
};

export default config;
