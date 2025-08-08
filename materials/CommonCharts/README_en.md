# Smart Mini Program Chart Component

## How to use it

1. Installation

```bash
npm install @tuya-miniapp/common-charts
```

2. Declare Configuration ` usingComponents`

```json
{
  "usingComponents": {
    "commonCharts": "@tuya-miniapp/common-charts"
  }
}
```

3. Use tags

```html
<commonCharts option="{{option}}"></commonCharts>
```

## Advanced use （v0.2.0）
1. use function
* not support arrow function
* only support es5

**contexts variables**
|var|detail|
|:----|:----|
|_|[lodash](https://www.lodashjs.com/)|
|myChart|echarts instance|
|option|echarts option|
|Echarts|echarts class|
|unit|unit properties|
|theme|theme|
|dayjs|dayjs|

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
    }`
  }
}
```

### 2. This component defaults to using echarts basic capabilities. If you need to use enhanced capabilities, you can enable usingPlugin

1. To enable the usingPlugin, you need to introduce the echarts plugin yourself
```bash
npm install echarts
```

2. set props usingPlugin
```jsx
<commonCharts usingPlugin="{{true}}"></commonCharts>
```

3. config app.json usingPlugins [document](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro)

```json
{
  "usingPlugins": [
    "rjs://echarts"
  ]
}
```

3. use `notMerge` disable built-in default styles for components and configure options on your own
```jsx
<commonCharts notMerge="{{true}}"></commonCharts>
```

4. Use the opts parameter to configure optional configuration options for echarts settings
```jsx
// Note that 'notMerge' here refers to the configuration parameters of echarts, with the previous one being the properties of the component
// Here 'notMerge' refers to the fact that every time the option echarts is set, the merging of data will be stopped, and the component will be destroyed and recreated
// Usually, when the length of a series changes, notMerge needs to be enabled
<commonCharts opts="{{{ notMerge: true }}}"></commonCharts>
```

### 3. custom tooltip use htmlmode

```js
// example
{
  tooltip: {
    formatter: `function (params) {

      var text = _.reduce(params, function (acc, cur, idx) {
        var lineText = "<div style='font-size: 10px;'>" + cur.marker + cur.seriesName + ": " + cur.value + "</div>";
        return acc + lineText;
      }, "");

      return "<div style='color: red;text-align: center;'>" + dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</div>" + text;
    }`,
    renderMode: 'html',
    confine: true
  }
}
```

## Basic attributes
Basic attributes refer to the official Echarts documentation
> This plugin has an official style chart style built-in, and the chart type range includes line/bar/pie/auge/line area. Other types of charts need to be implemented by developers themselves

```ts
/**
*Option attribute for drawing charts, refer to the official Echarts documentation（ https://echarts.apache.org/zh/option.html ）

*Required
* @example {
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
                type: 'line',
              },
            ],
          }
// use functional string
  * @example {
  title: {
    text: '阅读书籍分布',
    left: 'center',
    textStyle: {
      color: '#999',
      fontWeight: 'normal',
      fontSize: 14
    }
  },
  series: {
    type: 'pie',
    radius: [20, 60],
    height: '33.33%',
    left: 'center',
    width: 300,
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    label: {
      alignTo: 'edge',
      formatter: '{name|{b}}\n{time|{c} 小时}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        time: {
          fontSize: 10,
          color: '#999'
        }
      }
    },
    labelLine: {
      length: 15,
      length2: 0,
      maxSurfaceAngle: 80
    },
    labelLayout: `function (params) {
        var isLeft = params.labelRect.x < myChart.getWidth() / 2;
        var points = params.labelLinePoints;
        // Update the end point.
        points[2][0] = isLeft
          ? params.labelRect.x
          : params.labelRect.x + params.labelRect.width;
        return {
          labelLinePoints: points
        };
      }`,
    data: [
      { name: 'name6', value: 5.6 },
      { name: 'name5', value: 1 },
      { name: 'name4', value: 0.8 },
      { name: 'name3', value: 0.5 },
      { name: 'name2', value: 0.5 },
      { name: 'name1', value: 3.8 }
    ]
  }
}

*/

type option=Object // Required for setting up canvas drawing


/**
 * charts style
 * Optional
 */

type customStyle = string;

/**
* The unit information of the chart is used for formatting some prompt information in TooTip
*Display of y-axis coordinate system units
*
* Optional, if not transmitted, manual implementation of formatter formatting capability may be required
*   string: render by y axis and all series will use the same unit
*   array: if you want use the diffrent series unit you will want use array unit to apply charts
*/
type unit = string | string[];


/**
 * Whether to execute the default style injection capability of the chart
 * Note: After setting this option, the style and behavioral characteristics of this component will be blocked, and all developers will take over the option!
 * Optional default to false, default injection behavior, style features
 * */
type notMerge = boolean;


/**
 * opts echarts setOption second arguments
 * https://echarts.apache.org/en/api.html#echartsInstance.setOption
 * */

type opts = Object

/**
* Does it support full screen and non full screen conversion
*/
type supportFullScreen=boolean// Default false

/**
* Loading text
* Optional
*/
type loadingText = string;


/**
 * is loading
 * Joint judgment, internal loading judgment+current loading status
 * Optional default false
 */
type loading = boolean;

/**
 * is usingPlugin
 * learn from Advanced use
 * Optional default false
 */ 
type usingPlugin = boolean;

/**
*Chart theme, default light has an impact on text, lines, and other colors
*/
type theme = 'light' | 'dark';


/**
 * echarts event listen
 * Optional
 * 
 * Doc https://echarts.apache.org/zh/api.html#events
 * @example on = { click(params) { console.log("on echarts click"); } }
 * @example on = { 
 *            click:{
 *              query: 'series.line',
 *              callback(params) { console.log('click series.line...')}
 *            } 
 *          }
 */
type on = Object;

/**
 * when you use the string function,the injectVars will inject your custom variables to your string function;
 * 
 * @tips you should use the planObject
 */
type injectVars = Object;


/**
 * getEchartsProxy get echarts proxy 
 * Optional (Experience)
 * Usually, you don't need to use the method of using echarts instances. Here, the proxy exposes the calling ability of echarts instances
 * However, you cannot obtain the return value of the method call!
 * 
 * @example getEchartsProxy(echarts) { echarts.showLoading(); }
 */

type getEchartsProxy = (e: EchartsProxy) => void;
```


### Precautions
``Attention``: Due to the limitation of transferring data in the mini program with js=>rjs, it is not allowed to transfer data of type ``Function`` by default!
<br>
If you need to use the custom function of formatter in the option, you can Use string template format  or learn [how to use function](##Advanced use (v0.2.0))

```js
option={
  tooltip: {
	    formatter: `'{b0}: {c0}{b1}: {c1}'`
	}
}
```

``Attention``: Due to data transmission limitations, the response parameters for event listening in Echarts will be blocked, such as loop referenced data, function data, getter data, etc.