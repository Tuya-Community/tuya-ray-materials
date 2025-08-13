
支持涂鸦小程序 Canvas (type="2d") 的渲染引擎

## 特性

- 高性能且松耦合的渲染架构
- 超轻量级的代码体积
- 支持 Canvas 元素管理
- 支持 Canvas 元素事件体系
- 完备的 group 嵌套体系
- 支持可以变形的 clip 裁剪体系
- 内置文本、位图、绘图对象和多种矢量绘制对象
- 内置图片加载器
---

## 性能
- 经测试在安卓中端机可以同时渲染 1000+ 支持拖动的图形，拖动图形时 fps 保持在40+;
---

## 一分钟入门

在 page 或者 component 中使用

在 tyml 里声明主 canvas 和点击事件判断的辅助 canvas元素
- 注意⚠️：
  - 1. 如果一个页面上需要多个元素时需要保证 canvas id 不相同
  - 2. 建议在同一页面中不要使用超过3个 canvas 组件, 否则可能产生性能问题，如果需要多个，可以从交互入手，防止多个 canvas 同时存在 

### 绘制一个带交互的圆形，代码示例如下
```tyml
<view class='ray-js_pencil_flow-container' style="position: relative;">
	<canvas class='ray-js_pencil_flow-canvas' canvas-id='{{ canvasId }}' style='width:{{width}}px;height:{{height}}px; border:1px solid rgb(173, 140, 90);' disable-scroll="true" type='2d'></canvas>
	<canvas class='ray-js_pencil_flow-hit-canvas' canvas-id='{{ hitCanvasId }}' style='width:{{width}}px;height:{{height}}px; position: absolute; left: 100000px;' disable-scroll="true" type='2d'></canvas>
</view>
```

```tyss
.ray-js_pencil_flow-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ray-js_pencil_flow-canvas {
  position: relative;
}
.ray-js_pencil_flow-hit-canvas {
  position: relative;
}
```

```js
// index.rjs
import pencilFlow, { init } from '@ray-js/pencil-flow';
const { Stage, Group, Graphics, Rect, Circle, Bitmap, Text } = pencilFlow;

export default Render({
  renderCanvas(canvasId, hitCanvasId, pixelRatio) {
    init(canvasId, hitCanvasId, { pixelRatio }).then(({ stage }) => {
      const r = 50;
      const circle = new Circle(r, {
        gradientPoints: [
          { x: -r, y: r },
          { x: r, y: r },
        ],
        fillGradient: ['#ff0000', '#0000ff', '#ffff00'],
        id: 'circle',
      });
      circle.alpha = 1;
      circle.x = 200;
      circle.y = 200;
      circle.on('drag', function (event) {
        circle.x += event.dx;
        circle.y += event.dy;
        stage.update();
      });

      const circle1 = new Circle(50, {
        fillStyle: 'blue',
        id: 'circle1',
      });
      circle1.alpha = 0.5;
      circle1.x = 200;
      circle1.y = 50;

      circle1.on('drag', function (event) {
        circle1.x += event.dx;
        circle1.y += event.dy;
        stage.update();
      });

      const group = new Group();

      group.x = 20;
      group.y = 20;
      group.add(circle);
      group.add(circle1);

      stage.add(group);
      stage.update();
    });
  },
});
```

```js
// index.js
import Render from './index.rjs';

const randomId = () => Math.random().toString(36).slice(2);

Component({
  properties: {
    width: {
      type: Number,
      value: 300,
    },
    height: {
      type: Number,
      value: 300,
    },
  },
  data: {
    canvasId: `canvas_${randomId()}`,
    hitCanvasId: `hitCanvas_${randomId()}`,
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
    },
    ready() {
      const { canvasId, hitCanvasId } = this.data;
      const { pixelRatio = 1 } = ty.getSystemInfoSync();
      this.render.renderCanvas(canvasId, hitCanvasId, pixelRatio);
    },
  },
});
```

### 安装
```bash
yarn add @ray-js/pencil-flow
```

在 js 中引入并初始化项目

```JavaScript
import pencilFlow, { init } from '@ray-js/pencil-flow';
const { Stage, Group, Graphics, Rect, Circle, Shape } = pencilFlow;

```

## 内置对象

### Group
用于分组，group 也可以嵌套 group，父容器的属性会叠加在子属性上, 例如：

- group 的 x 是 100, group 里的 bitmap 的 x 是 200， 最后 bitmap 渲染到 stage 上的 x 是 300
- group 的 alpha 是 0.7, group 里的 bitmap 的 alpha 是 0.6, 最后 bitmap 渲染到 stage 上的 alpha 是 0.42

```JavaScript
const group = new Group();
const rect = new Rect(100, 100, {
  fillStyle: 'red'
});
group.add(rect);
stage.add(group);
stage.update();
```

group 拥有常用的 add 和 remove 方法进行元素的增加和删除。先 add 的会先绘制，所有后 add 的会盖在先 add 的上面。

#### Group 方法

##### add

添加对象

```JavaScript
group.add(child);
```

##### remove

移除对象

```JavaScript
group.remove(child);
```

##### empty

清空子对象

```JavaScript
group.empty();
```

##### replace

使用一个对象替代子对象

```JavaScript
group.replace(current, pre);
```

### Stage

最大的顶层容器，继承自 Group，所以 Group 拥有的方法它全都有

#### Stage 方法

##### update

任何元素添加到 Stage 上是看不到的，须要执行 update 方法
任何元素属性的修改需要执行 stage.update() 来更新渲染

```JavaScript
const rect = new Rect(100, 100, {
  fillStyle: 'red'
});

rect.on('drag', (event) => {
  rect.x += event.dx;
  rect.y += event.dy;
  stage.update();
})
stage.add(rect);
// 渲染
stage.update();



```

##### setHitCanvas

- `init`方法中已内置，如果使用init方法不调用`setHitCanvas`
- 设置模拟虚拟 canvas，接受一个参数 canvas 对象，用于计算像素级的 touch 事件目标

```JavaScript

const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const hitCanvas = await getCanvasById('xxxId');
stage.setHitCanvas(hitCanvas);
```

##### getTextWidth

获取要渲染文字的宽度，两个参数，第一个参数是 `text: String`，待绘制的文字，第二个参数是`font： String`，设置的文字的样式。

##### loadImage

Stage 内置图片加载器，接受一个参数`url: string`，返回一个 Promise 对象。

Promise 执行结果是 Image 对象，用于 bitmap 绘制。

```JavaScript
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const imgObj2 = await stage.loadImage('../logo.png');

const bitmap = new Bitmap(imgObj2);
stage.add(bitmap);
stage.update();
```

### Bitmap

Bitmap 接受一个参数，Image 对象的实例，不能使用 url 或者本地路径，bitmap 为同步，无回调方法。

```JavaScript
const bitmap = new Bitmap(img);
stage.add(bitmap);
stage.update()
```

可以设置图片裁剪显示区域，和其他 transform 属性:

```JavaScript
const bitmap = new Bitmap(img);
bitmap.x=50;
stage.add(bitmap);

const clipPath = new Graphics();
clipPath.rect(0, 0, 100, 200);
clipPath.x = 0;
clipPath.y = 50;
bitmap.clip(clipPath);
stage.add(bitmap);
stage.update()
```

### Text

文本对象

```JavaScript
const textVal = '这是测试文本';
const fontSize = 18;
const text = new Text(textVal, {
  strokeStyle: 'red',
  size: fontSize,
  id: 'text',
});
```


##### getWidth

获取文本宽度

```JavaScript
stage.getTextWidth();
```


### Graphics

绘图对象，用于使用基本的连缀方式的 Canvas 指令绘制图形。

```JavaScript
const graphics = new Graphics();
graphics
  .beginPath()
  .arc(0, 0, 10, 0, Math.PI * 2)
  .closePath()
  .fillStyle('#f4862c')
  .fill()
  .strokeStyle('black')
  .stroke();

graphics.x = 100;
graphics.y = 200;

stage.add(graphics);
```

特别注意，如果你在某个循环中执行 graphics 连缀绘制操作，请务必加上 clear() 方法，不然路径叠加到你的浏览器不堪重负:

```JavaScript
setInterval(function () {
  graphics
    .clear()
    .beginPath()
    .arc(0, 0, 10, 0, Math.PI * 2)
    .stroke();
}, 16);
```

### Shape
#### Rect

```JavaScript
const rect = new Rect(200, 100, {
  fillStyle: 'red'
});
```

#### Circle

```JavaScript
const r = 50;
const circle = new Circle(r, {
  gradientPoints: [
    { x: -r, y: r },
    { x: r, y: r },
  ],
  fillGradient: ['#ff0000', '#0000ff', '#ffff00'],
  id: 'circle',
});
```

#### Ellipse

```JavaScript
const width = 100;
const height = 50;
const ellipse = new Ellipse(width, height, {
  gradientPoints: [
    { x: 0, y: height / 2 },
    { x: width, y: height / 2 },
  ],
  fillGradient: ['#ff0000', 'pink', '#ffff00'],
  id: 'ellipse',
});
```

#### Polygon

```js
const num = 6;
const r = 50;
const vertex = [
  [0, 0],
  [50, 0],
  [50, 50],
];
const polygon1 = new Polygon(vertex, {
  gradientPoints: [
    { x: vertex[0][0], y: vertex[0][1] },
    { x: vertex[2][0], y: vertex[2][1] },
  ],
  fillGradient: ['red', 'green', 'blue'],
  id: 'Polygon',
});
```


#### EquilateralPolygon

```js
const num = 6;
const r = 50;
const equilateralPolygon1 = new EquilateralPolygon(num, r, {
  gradientPoints: [
    { x: -r, y: r },
    { x: r, y: r },
  ],
  fillGradient: ['red', 'green', 'blue'],
  id: 'equilateralPolygon1',
});
```


#### Ring

```js
const r = 40;
const ring1 = new Ring(r, {
  strokeGradient: ['#4374f1', '#5ec7c7', '#f9d387', '#f1a88f', '#e78a86'],
  // strokeGradient: ['#4374f1'], // 单色
  lineWidth: 20, 
  percent: 0.7,
  lineCap: 'round',
  id: `ring1`,
});
```

#### RoundedRect

```js
const width = 100;
const height = 40;
const roundedRect2 = new RoundedRect(width, height, radius, {
  fillStyle: 'blue',
  id: 'Polygon2',
});
```

### Stage

| Name  | Describe             |
| ----- | -------------------- |
| stage | 或者自己所在的 stage |

使用方式:

```js
obj.stage;
```

## 属性 (对所有图形、文字、Group 以及 Stage 都生效)

### Transform

| 属性名   | 描述                            |
| -------- | ------------------------------- |
| x        | 水平偏移                        |
| y        | 竖直偏移                        |
| scaleX   | 水平缩放                        |
| scaleY   | 竖直缩放                        |
| scale    | 同时设置或读取 scaleX 和 scaleY |
| rotation | 旋转                            |
| skewX    | 歪斜 X                          |
| skewY    | 歪斜 Y                          |
| regX     | 旋转基点 X                      |
| regY     | 旋转基点 Y                      |

### Alpha

| 属性名 | 描述         |
| ------ | ------------ |
| alpha  | 元素的透明度 |

如果父子都设置了 alpha 会进行乘法叠加。

### Gradient

| 属性名 | 描述         |
| ------ | ------------ |
| gradientPoints  | 渐变线段的开始和结束点 |
| fillGradient | 线性填充渐变颜色值 |
| strokeGradient | 线性轮廓渐变颜色值 |


### compositeOperation

| 属性名             | 描述                             |
| ------------------ | -------------------------------- |
| compositeOperation | 源图像绘制到目标图像上的叠加模式 |

注意这里如果自身没有定义 compositeOperation 会进行向上查找，找到最近的定义了 compositeOperation 的父容器作为自己的 compositeOperation。

### Shadow

| 属性名 | 描述 |
| ------ | ---- |
| shadow | 阴影 |

使用方式:

```JavaScript
const rect = new Rect(200, 100, {
  fillStyle: 'red'
});

rect.shadow = {
  color: '#42B035',
  offsetX: -5,
  offsetY: 5,
  blur: 10
};

stage.add(rect);
stage.update();
```
### hitBox
- 如果要使用元素的矩形区域为点击区域，则需要设置设置元素的 hitBox 
```js
const rect = new Rect(100, 100, {
  fillStyle: 'red'
});

rect.hitBox = [0, 0, 120, 40];

```


## 方法

### destroy

销毁群组或 stage 下的所有元素(包含自己)

```js
// 销毁群组下的所有元素
group.destroy();

// 销毁 stage 下的所有元素
stage.destroy();
```

### empty

清空群组或 stage 下的所有元素（不包含自己）

```js
// 清空群组下的所有元素
group.empty();

// 清空 stage 下的所有元素
stage.empty();
```

## 事件

| 事件名     | 描述               |
| ---------- | ------------------ |
| tap        | 手指触摸后马上离开 |
| touchstart | 手指触摸动作开始   |
| touchmove  | 手指触摸后移动     |
| touchend   | 手指触摸动作结束   |
| drag       | 拖拽               |

事件触发精确到像素级。如果要使用元素的矩形区域为点击区域，则需要设置设置元素的 hitBox 。

## 裁剪

```JavaScript
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const bitmap = new Bitmap(imgObj2);

const clipPath = new Graphics();
clipPath.arc(40, 40, 25, 0, Math.PI * 2);
bitmap.clip(clipPath);

stage.add(bitmap);
```

使用下面的代码可以得到同样的效果:

```JavaScript
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const bitmap = new Bitmap(imgObj2);

const clipPath = new Graphics();
clipPath.x = 40;
clipPath.y = 40;
clipPath.arc(0, 0, 25, 0, Math.PI * 2);
bitmap.clip(clipPath);

stage.add(bitmap);
```

裁剪区域同样支持所有 transform 属性(x,y,scaleX,scaleY,rotation,skewX,skewY,regX,regY)。

## 自定义对象

### 自定义 Shape

自定义 Shape 继承自 Shape:

```JavaScript
class Sector extends Shape {
  [x: string]: any;
  option: optionInterface;

  constructor(radius: number, startAngle: number, endAngle: number, option: optionInterface) {
    super();

    this.option = option || {};
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  draw() {
    const {
      gradientPoints = [
        { x: -this.radius, y: this.radius },
        { x: this.radius, y: this.radius },
      ],
      fillGradient,
      strokeGradient,
      anticlockwise,
    } = this.option;

    this.beginPath()
      .moveTo(0, 0)
      .arc(0, 0, this.radius, this.startAngle, this.endAngle, anticlockwise)
      .closePath();

    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    if (this.option.strokeStyle) {
      if (this.option.lineWidth !== undefined) {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeStyle(this.option.strokeStyle);
      this.stroke();
    }

    if (fillGradient && fillGradient.length) {
      const [point1, point2] = gradientPoints;
      const grad = this.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
      // 可能有多个
      if (this.option.fillGradient.length > 1) {
        for (let i = 0; i < this.option.fillGradient.length; i++) {
          grad.addColorStop(i / (this.option.fillGradient.length - 1), this.option.fillGradient[i]);
        }
      } else {
        grad.addColorStop(0, this.option.fillGradient[0]);
        grad.addColorStop(1, this.option.fillGradient[0]);
      }

      this.fillGradient();
      this.fill();
    }
    if (strokeGradient && strokeGradient.length) {
      const [point1, point2] = gradientPoints;
      const grad = this.createLinearGradient(point1.x, point1.y, point2.x, point2.y);

      if (this.option.strokeGradient.length > 1) {
        for (let i = 0; i < this.option.strokeGradient.length; i++) {
          grad.addColorStop(
            i / (this.option.strokeGradient.length - 1),
            this.option.strokeGradient[i]
          );
        }
      } else {
        grad.addColorStop(0, this.option.strokeGradient[0]);
        grad.addColorStop(1, this.option.strokeGradient[0]);
      }
      if (typeof this.option.lineWidth === 'number') {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeGradient();
      this.stroke();
    }
  }
}
```

使用 Shape:

```JavaScript
const radius = 50;
const startAngle = 0;
const endAngle = (Math.PI * 2) / 4;
const sector = new Sector(radius, startAngle, endAngle, {
  fillStyle: 'blue',
  id: 'sector',
});
stage.add(sector)
stage.update()
```

### 自定义 Element

自定义 Element 继承自 Group:

```JavaScript
class Button extends Group {
  constructor(stage, option) {
    super();
    const fontSize = option.fontSize || 20;
    const font = option.font || `${fontSize}px Arial`;
    const padding = 8;
    const textWidth = Math.floor(stage.getTextWidth(option.text, font)) + padding * 2;
    this.width = option.width || textWidth;
    this.height = option.height || 40;
    this.r = option.r || 8;
    this.roundedRect = new RoundedRect(this.width, this.height, this.r, {
      strokeStyle: option.color,
    });
    this.text = new Text(option.text, {
      strokeStyle: option.color,
      font: font,
      size: fontSize,
      id: 'text',
    });
    this.text.x = padding;
    this.text.y = 10;
    this.add(this.roundedRect, this.text);
  }
}

export default Button
```

使用:

```JavaScript
const customElement = new Button(stage, {
  text: '自定义元素',
  id: 'customElement',
  color: 'red',
  fontSize: 20,
});
```

一般情况下，稍微复杂组合体都建议使用继承自 Group，这样利于扩展也方便管理自身内部的元件。

## 图片加载器

图片加载器返回 Promise

```JavaScript
const { loadImage } = pencilFlow;

// canvas参数为获取的canvas 2d对象实例
const imgObj = await loadImage('../logo.png', canvas);

// stage的图片加载方法
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const imgObj2 = await stage.loadImage('../logo.png');

const bitmap = new bitMap(imgObj2);
stage.add(bitmap);
stage.update();
```

## 注意事项
对手势相关事件有良好的支持，内置拖拽功能，支持矩形边界和像素级边界两种选择方式。

项目对 canvas 的初始化采用显示设置宽高和通过缩放适应像素密度，显示高清

对于较为复杂的项目，建议通过类开发组件，即每一组件是一个类，类中包含自己的布局和更新方法，这样可以开发出高度复用的组件，后续也便于维护


## 参考鸣谢

- mini-program-rc: 本项目是在 https://github.com/fyuanz/mini-program-rc 项目基础上进行二次开发的

## License
[MIT](https://opensource.org/license/MIT)
