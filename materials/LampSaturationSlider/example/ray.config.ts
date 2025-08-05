// 提供给 cli 构建使用的文件，使用 cjs 语法

const path = require('path');

const config = {
  resolveAlias: {
    '@ray-js/lamp-color-slider': path.resolve(__dirname, '../src/'),
  },
  rn: {
    sourceRoot: process.cwd(), // 项目根目录，可选配置，一般不需要配置。
    // outputRoot: process.cwd() + '/bundle', //RN包存放目录
    output: {
      // 打包时输出的bundle包的名称
      android: 'main.jsbundle',
      ios: 'main.jsbundle',
    },
    defineConstants: {
      // 全局变量声明，使用babel进行运行时替换，如下述变更在代码中直接使用 RAY_RN_PLATFORM 在运行时会被替换为 native
      RAY_RN_PLATFORM: 'native',
    },
    alias: {
      // 别名配置，可直接在resolveAlias中配置，若不能满足差异化要求，也可在这里配置
    },
    env: {
      // 全局变量声明，类似于defineConstants，但使用时要用 process.env.XXX，同样是运行时替换原则，并非改变global下的process.env变量
      debug: false,
      path: __dirname,
    },
    plugins: [], // 添加所需plugins 如： babel-plugin-global-define（默认已包含）。
    presets: [], // 添加自定义presets 如： module:metro-react-native-babel-preset（默认已包含）。
    entry: '', // 自定义入口文件，默认入口文件为@ray/main.native.tsx， 可通过该参数进行自定义

    postcss: {
      scalable: true, // 是否支持缩放 css-to-react-native中的配置
    },
    transformer: null, // 自定义metro transformer
    babelPlugin: require.resolve('@ray-js/rn-transformer-helper'), // 自定义metro babelPlugin
    enableMultipleClassName: true, // 是否支持多className定义，如： <View className="aaa bbb"/>
    enableMergeStyle: true, // 是否需要合并样式表，默认为true,
  },
};
module.exports = config;
