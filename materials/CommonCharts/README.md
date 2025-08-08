# 智能小程序图表组件

## 如何使用

1. 安装

```bash
npm install @tuya-miniapp/common-charts
```

2. 声明配置 `usingComponents`

```json
{
  "usingComponents": {
    "commonCharts": "@tuya-miniapp/common-charts"
  }
}
```

3. 使用标签

```jsx
<commonCharts option="{{option}}"></commonCharts>
```

## 进阶使用 （v0.2.0启用）
1. 传入函数
* 不支持箭头函数
* 仅支持es5语法

**内置的环境变量**
|变量|说明|
|:----|:----|
|_|[lodash](https://www.lodashjs.com/)|
|myChart|echarts实例|
|option|传入的option参数|
|Echarts|echarts类|
|unit|传入的单位|
|theme|传入的主题|
|dayjs|dayjs|

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
    }`
  }
}
```

### 2. 本组件默认启用的是echarts基础能力，如需使用增强能力可以启用 usingPlugin

1. 启用usingPlugin 需要自行引入echarts插件
```bash
npm install echarts
```

2. 开启参数 usingPlugin
```jsx
<commonCharts usingPlugin="{{true}}"></commonCharts>
```

3. 小程序配置 usingPlugins [参考文档](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro)

在 app.json 文件中通过 usingPlugins 字段声明插件名称，具体名称由官方提供，具体请查看以下列表。

```json
{
  "usingPlugins": [
    "rjs://echarts"
  ]
}
```

3. 使用 `notMerge` 禁用组件内置默认样式，自行配置option
```jsx
<commonCharts notMerge="{{true}}"></commonCharts>
```

4. 使用opts参数，配置echarts设置option时的可选配置项
```jsx
// 注意这里的notMerge指的是echarts的配置参数，前面那个是组件的属性
// 这里notMerge指的是每次设置option echarts将会停止合并数据，将会销毁组件重新创建
// 一般在series的长度会发生变化时 需要启用notMerge
<commonCharts opts="{{{ notMerge: true }}}"></commonCharts>
```

### 3. tooltip定制化，使用html渲染模式

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


## 基础属性

基础属性参考 Echarts 官方文档.

> 本插件内置了官方风格的图表样式，图表类型范围包含 line/bar/pie/gauge/line-area 其余类型的图表需要开发者自行实现

```ts
/**
 * 用于绘制图表的option属性, 参考[echarts官方文档](https://echarts.apache.org/zh/option.html)
 * 必填
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

  // 使用函数字符串作为函数形式加载option
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
      { name: '圣彼得堡来客', value: 5.6 },
      { name: '陀思妥耶夫斯基全集', value: 1 },
      { name: '史记精注全译（全6册）', value: 0.8 },
      { name: '加德纳艺术通史', value: 0.5 },
      { name: '表象与本质', value: 0.5 },
      { name: '其它', value: 3.8 }
    ]
  }
}
 */
type option = Object; // 必填 用于设置 绘制 canvas

/**
 * 图表的样式
 * 可选
 */

type customStyle = string;

type customClass = String;

/**
 * 图表的单位信息，用于tootip一些提示信息格式化使用
 * y轴坐标系单位显示
 * 
 * 可选，不传的话可能需要手动实现formatter格式化能力
 *  字符串：对所有的series使用同样的单位，同时Y轴也会出现单位
 *  数组：不同的series单位不同时，可能需要，将会按照series顺序添加单位
 */
type unit = string ｜ string[];

/**
 * 是否执行图表的默认样式注入能力
 * 注意：设置了此选项后，将屏蔽本组件的样式和行为特征，全部由开发者进行option接管！
 * 可选 默认为false，默认注入行为，样式特征
 * */
type notMerge = boolean;


/**
 * opts echarts设置option的第二个可选参数
 * https://echarts.apache.org/zh/api.html#echartsInstance.setOption
 * */

type opts = Object

/**
 * 是否支持全屏和非全屏转换
 * 可选
 */
type supportFullScreen = boolean; // 默认 false 

/**
 * 加载中文案
 * 可选
 */
type loadingText = string;

/**
 * 是否加载中
 * 联合判断，内部loading判断 + 当前loading状态
 * 可选 默认false
 */
type loading = boolean;

/**
 * 是否启用echarts插件
 * 详细使用方法参考 ## 进阶使用
 * 可选 默认false
 */ 
type usingPlugin = boolean;
/**
 * 图表主题, 默认 light 对文字, 线条等颜色有影响
 * 可选
 */
type theme = 'light' | 'dark';

/**
 * echarts 事件监听
 * 可选
 * 
 * 具体可监听的事件请参考 https://echarts.apache.org/zh/api.html#events
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
 * getEchartsProxy 获取echarts实例代理器 
 * 可选（实验选项，谨慎使用）
 * 一般你用不到使用echarts实例的方法，这里通过代理器暴露了echarts实例的调用能力
 * 但是，你无法得到方法调用的返回值！
 * 
 * @example getEchartsProxy(echarts) { echarts.showLoading(); }
 */

type getEchartsProxy = (e: EchartsProxy) => void;

/**
 * errMsg 异常信息
 * 用来展示异常信息
 */
type errMsg = String;

/**
 * iconError 用来展示异常的icon图表，可以传入url
 */
type iconError = String;

/**
 * iconLoading 用来展示加载中的icon图表，可以传入url
 */
type iconLoading = String;


/**
 * iconFullScreen 可以传入url
 */
type iconFullScreen = String;


/**
 * iconExitFullScreen 可以传入url
 */
type iconExitFullScreen = String;
```

### 样式修改怎么办
1. 可以使用customStyle修改最外层样式
2. 可以使用customClass增加类名去修改
3. 内置了变量，可以通过修改变量的值去修改



### 注意事项

``注意``：由于小程序中js=>rjs数据传输的``限制``，默认不允许传递``Function``类型的数据！
<br>
如果需要在option中使用formatter的自定义函数，可以使用字符串模版形式 或者 参考 [如何传入函数](##进阶使用)

```js
option={
  tooltip: {
	    formatter: `'{b0}: {c0}{b1}: {c1}'`
	}
}
```

``注意``：由于数据传输限制，echarts的事件监听的响应参数部分将会被屏蔽，如循环引用的数据，function数据，getter数据等。