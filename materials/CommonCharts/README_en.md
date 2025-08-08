English | [简体中文](./README-zh_CN.md)

# General statistical charts

Built in official style chart styles, developers can also override the default styles themselves.

Using this plugin, if you understand the configuration items of echarts, there is basically no learning curve.

## Installation

```bash
npm install @ray-js/common-charts
# or
yarn add @ray-js/common-charts
```

## Usage examples

### Display charts

```jsx
import CommonCharts from '@ray-js/common-charts';

<CommonCharts
  unit="℃" // unit
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
        name: 'demo',
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line', // Here, support is also provided for bar line pieces, etc
      },
    ],
  }} // Echarts configuration
/>;
```

### custom class

```jsx
<CommonCharts
    option={{ backgroundColor: 'transparent', ...lineOption } as EChartsOption}
    customClass={styles['my-chart']}
  />
```

### notMerge dont use the component style(v0.0.4 支持)

when you want use the custom echarts options, or run the merge case some error,you can use the props

```jsx
<CommonCharts
  ...
  option={full echarts.option}
  notMerge={true}
/>
```

### theme

dark or light

```jsx
<CommonCharts
  ...
  theme="dark" // support dark light
/>
```

### use echarts option，such as notMerge

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

### Full screen switching capability

> Not implemented to prevent default underlying sliding. Consider using ty.onWindowResize to monitor screen orientation for page adaptation on the business side

```Jsx
<CommonCharts
  ...
  SupportFullScreen={true} // Does it support full screen display
/>
```

### errorMessage

custom errorMessage

```jsx
<CommonCharts
  option={{} as EChartsOption}
  errMsg={Strings.getLang('errorMsg')} />
```

### Loading support

When loading charts, you can customize the loading text

```Jsx
<CommonCharts
  LoadingText="Loading..." // Custom loading text
/>
```

### event listen support (v0.0.3)

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

### echarts call method (v0.0.3)

```jsx
<CommonCharts
  getEchartsProxy={echarts => {
    echarts.showLoading();
  }}
/>
```

## Advanced use （v0.2.0）

1. use function

- not support arrow function
- only support es5

**contexts variables**
|var|detail|
|:----|:----|
|\_|[lodash](https://www.lodashjs.com/)|
|myChart|echarts instance|
|option|echarts option|
|Echarts|echarts class|
|unit|unit properties|
|theme|theme|

some vars from the properties injectVars

```js
// @example
{
  tooltip: {
    // only support es5
    formatter: `function (params) {
      var text = "";
      for(var i = 0; i < params.length; i++) {
        text += params[i].marker + params[i].seriesName + ": " + params[i].value;
        if (i !== params.length - 1) {
          text += "\\n";
        }
      }
      return params[0].name + "\\n" + text;
    }`;
  }
}
```

2. This component defaults to using echarts basic capabilities. If you need to use enhanced capabilities, you can enable usingPlugin

> 1. To enable the usingPlugin, you need to introduce the echarts plugin yourself

```bash
npm install echarts
```

2. set props usingPlugin

```jsx
<CommonCharts usingPlugin={true}></CommonCharts>
```

3. config global.config.ts usingPlugins [document](https://developer.tuya.com/en/miniapp/develop/miniapp/framework/plugin/intro)

```ts
{
  "usingPlugins": ["rjs://echarts"]
}
```

## FAQ

1. when prop option has function, it's invalid

   Due to the configuration that only data transfer is supported in js ->rjs transfer, function transfer is blocked by default. If you need to customize the formatter, please use a string template or you can use v0.1.0 version to use string function replace it.

2. Some data in the callback parameters for listening to charts events is null?

   Due to the existence of circular references or the use of getter functions in the callback of echarts, data serialization transmission cannot be used. Therefore, before transmitting serialized data, a wave of processing was performed on the data

3. Why do many methods fail to return a value for the echarts instance obtained from getEchartsProxy?

   Because the echarts instance is stored in rjs, in reality, the echarts instance that developers receive is only a reflector used to trigger event notifications, and cannot obtain return results in thread communication.

4. If I only want to use the style merging ability of the component, can I complete the echarts rendering myself through the rjs plugin?

   Certainly. The component exposed the autoInject method by introducing the path import {autoInject} from "@ tuya mini app/common characters/lib/core/inject. js"
   The rendering ability of echarts depends on the plugin system provided by our mini program [plugins](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro)

5. What if I want to completely customize my own style without the merging ability of components?

   In v0.0.4 version, the notMerge parameter is opened, which will stop all echarts option data modification. However, due to the parameter data not supporting passing in functions, it will be difficult to customize options. Please enable it according to the situation

6. Some effects have taken effect on the Echarts official website in the component, but the mini program has not taken effect. What should I do

Firstly, check if the HTML mode writing is used, and also if the `function` is used. Please refer to the explanation in FAQ 1 for the solution of 'function'
