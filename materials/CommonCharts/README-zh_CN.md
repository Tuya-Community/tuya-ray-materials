[English](./README.md) | 简体中文

# 通用统计图表

- 底层使用了 echarts 库，如果你对 echarts 比较熟悉，使用它更容易上手

## 安装

```bash
npm install @ray-js/common-charts
# 或者
yarn add @ray-js/common-charts
```

## 使用

### 基础用法

```jsx
import CommonCharts from '@ray-js/common-charts';

<CommonCharts
  unit="℃" // 数据单位
  option={{
    backgroundColor: '#fff',
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {},
    series: [
      {
        name: '测试样例',
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line', // 这里同时支持 bar line pie 等
      },
    ],
  }} // Echarts 配置项
/>;
```

### 自定义类名

```jsx
<CommonCharts
    option={{ backgroundColor: 'transparent', ...lineOption } as EChartsOption}
    customClass={styles['my-chart']}
  />
```

### notMerge 不进行组件的默认合并行为(v0.0.4 支持)

当开发者想要完全定制化 echarts 的样式和交互能力的时候，可以开启本选项，开启后组件将不会对传入的 option 数据进行修改和调整

> 注意！由于参数数据不支持传入 function，将导致 option 的定制化较为困难，请视情况开启

```jsx
<CommonCharts
  ...
  option={完整的echarts.option数据}
  notMerge={true}
/>
```

### 主题支持

提供了两套主题 dark 和 light

```jsx
<CommonCharts
  ...
  theme="dark" // 支持 dark light
/>
```

### 使用 echarts 的 option 能力，如非合并策略

```jsx
<CommonCharts
    opts={{ notMerge: true }}
    option={updatedOption as EChartsOption}
    customStyle={{
      width: '100%',
      height: '300px',
    }}
  />
```

### 全屏开关能力

> 未实现阻止默认底层滑动, 可以考虑自行 通过 ty.onWindowResize 监听屏幕方向进行页面适配

```jsx
<CommonCharts
  ...
  supportFullScreen={true} // 是否支持全屏展示
/>
```

### 错误提示

自定义错误提示

```jsx
<CommonCharts
option={{} as EChartsOption}
errMsg={Strings.getLang('errorMsg')} />
```

### Loading 支持

在图表加载时，可以自定义 loading 文案

```jsx
<CommonCharts
  ...
  loadingText="Loading..."
/>
```

### 设置 unit 单位

使用默认的 tooltip 样式时，可以快捷设置 unit 单位

```jsx
<CommonCharts
  ...
  unit="米"
/>
```

### tooltip 使用 html 方式进行渲染（v0.1.3）

```jsx
<CommonCharts
  option={{
    ...lineChartOption, // echarts option
    tooltip: {
      // 进阶使用中了解 string function
      formatter: `function (params) {
          var text = _.reduce(params, function (acc, cur, idx) {
            var lineText = "<div style='font-size: 10px;'>" + cur.marker + cur.seriesName + ": " + cur.value + "</div>";
            return acc + lineText;
          }, "");

          return "<div style='color: red;text-align: center;'>" + dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</div>" + text;
        }`,
      renderMode: 'html',
      confine: true, // 限制tooltip在组件内
    },
  }}
/>
```

### on echarts 事件监听 (v0.0.3 支持)

```jsx
<CommonCharts
  ...
  on={{
    click(e) {
      console.log("e", e);
    }
  }}
/>
```

### getEchartsProxy echarts 获取 instance，进行方法调用(v0.0.3 支持)

```jsx
<CommonCharts
  getEchartsProxy={echarts => {
    echarts.showLoading();
  }}
/>
```

### 使用 onLoad onRender 执行 Echarts 一些初始化操作(v0.1.2 支持)

```jsx
<CommonCharts
  onLoad={`
    function() {
      console.log("echarts onloaded, it will run after first setOption");
      // 关联group
      myChart.group = "chart";
      Echarts.connect("chart")
    }
  `}
  onRender={`
      function() {
        console.log("echarts onRender, it will always run after setOption");

      }
    `}
/>
```

### 聚焦失焦事件支持 (v0.1.5)

```jsx
<Charts
    option={lineOption as EChartsOption}
    blurAutoHideTooltip={true}
    customStyle={{
      width: '100%',
      height: '300px',
      outline: isFocus ? '1px solid black' : 'none',
    }}
    onBlur={() => {
      console.log("onblur");
      setIsFocus(false);
    }
    }
    onFocus={() => {
      console.log("onfocus");
      setIsFocus(true);
    }
    }
  />
```

## 进阶使用（v0.1.0 启用）

1. 传入函数

- 不支持箭头函数
- 仅支持 es5 语法

**内置的环境变量**
|变量|说明|
|:----|:----|
|\_|[lodash](https://www.lodashjs.com/)|
|myChart|echarts 实例|
|option|传入的 option 参数|
|Echarts|echarts 类|
|dayjs|dayjs|
|unit|传入的单位|
|theme|传入的主题|
|自定义扩展|通过传入的 injectVars|

```js
// @example
{
  tooltip: {
    // 注意 只能用es5 \n 需要转译
    formatter: `function (params) {
      var text = _.reduce(params, function (acc, cur, idx) {
        var lineText = cur.marker + cur.seriesName + ": " + cur.value;
        return 0 === idx ?  (acc + lineText) : (acc + "\\n" + lineText);
      }, "");
      
      return params[0].name + "\\n" + text;
    }`;
  }
}
```

2. 本组件默认启用的是 echarts 基础能力，如需使用增强能力可以启用 usingPlugin

> 1. 启用 usingPlugin 需要自行引入 echarts 插件

```bash
npm install echarts
```

2. 开启参数 usingPlugin

```jsx
<CommonCharts usingPlugin={true}></CommonCharts>
```

3. 小程序配置 usingPlugins [参考文档](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro)

在 global.config.ts 文件中通过 usingPlugins 字段声明插件名称，具体名称由官方提供，具体请查看以下列表。

```ts
{
  "usingPlugins": ["rjs://echarts"]
}
```

## FAQ

1. option 中使用 function 没有效果

   由于配置了在 js->rjs 传输中仅支持数据传输，故此默认阻止了函数的传输，如需定制 formatter 请使用字符串模板，在 v0.1.0 版本以上增加了字符串函数的解析

   具体细节可以参考 [进阶使用](#进阶使用)

2. 监听 charts 事件的回调参数中有些数据是 null？

   由于在 echarts 的回调中部分数据存在循环引用或者使用了 getter 函数，无法使用数据序列化传输，所以在传输序列化数据前，对数据进行了一波处理

3. 为什么在 getEchartsProxy 拿到的 echarts 实例，方法没有返回值？

   因为 echarts 实例保存在 rjs 中，实际上开发者拿到的 echarts 实例仅仅是一个反射器，用来触发事件通知使用，在线程通讯中无法获取返回结果。

4. 如果我只想使用组件的样式合并能力，自己通过 rjs 插件来完成 echarts 渲染可以吗？

   当然可以！组件暴露了 autoInject 方法 通过引入路径 import { autoInject } from "@tuya-miniapp/common-charts/lib/core/inject.js"
   echarts 的渲染能力就依赖我们小程序提供的[插件系统](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro)

5. 我想不用组件的合并能力，完全定制化自己的样式怎么办？

   在 v0.0.4 版本开放了 notMerge 参数，开启后，将会停止所有的 echarts option 数据修改，但是由于参数数据不支持传入 function，将导致 option 的定制化较为困难，请视情况开启

6. 有些效果在组件中在 Echarts 官网生效了，但是小程序没有生效怎么办  
   首先排查是否用了 html 模式的写法，还有就是有没有使用`function`，function 的解决方案，请参考 FAQ 1 的解释。
