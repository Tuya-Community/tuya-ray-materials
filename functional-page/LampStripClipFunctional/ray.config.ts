import { RayConfig } from "@ray-js/types";
import path from "path";

function resolveRoot(s: string) {
  return path.resolve(__dirname, s);
}

const config: RayConfig = {
  debug: false,
  functionalRoot: "./functional", // 固定的设置
  plugins: [
    {
      name: "nextjs",
      // @ts-ignore
      configWebpack({ config }) {
        config.resolve.alias.set("@styles", resolveRoot("./src/styles"));
      },
    },
  ],
};

export default config;
