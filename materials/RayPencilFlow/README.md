
Supports the rendering engine of the Tuya canvas (type="2d")

## Feature

- High performance and loosely coupled rendering architecture
- Lightweight code volume
- Supports canvas element management
- Supports the canvas element event system
- A complete group nesting system
- Supports deformable clip clipping system
- Built-in text, bitmaps, drawing objects and a variety of vector drawing objects
- Built-in image loader
---

## Performance
- After testing, the Android mid-end machine can render 1000+ draggable graphics at the same time, and the fps is kept at 40+ when dragging graphics;
---

## One minute to get started

Used in page or component

Declare the primary canvas and the secondary canvas elements for click event judgment in tyml
- Attention ⚠️ :
  - 1. If multiple elements are required on a page, ensure that the canvas ids are different
  - 2. You are advised not to use more than three canvas components on the same page. Otherwise, performance problems may occur. If multiple canvas components are required, you can interact with each other to prevent multiple canvas components from existing at the same time

### Draw an interactive circle with the following code example
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

### Install
```bash
yarn add @ray-js/pencil-flow
```

Introduce and initialize the project in js

```JavaScript
import pencilFlow, { init } from '@ray-js/pencil-flow';
const { Stage, Group, Graphics, Rect, Circle, Shape } = pencilFlow;

```

## Built-in object

### Group
Used for grouping, group can also be nested in group, and the properties of the parent container will be superimposed on the child properties, for example:

- The x of the group is 100, the x of the bitmap in the group is 200, and the x of the final bitmap rendered to the stage is 300
- The alpha of the group is 0.7, the alpha of the bitmap in the group is 0.6, and the alpha of the final bitmap rendered to the stage is 0.42

```JavaScript
const group = new Group();
const rect = new Rect(100, 100, {
  fillStyle: 'red'
});
group.add(rect);
stage.add(group);
stage.update();
```

The group has the usual add and remove methods for adding and removing elements. The first to add will be drawn first, and all the later to add will be on top of the first to add.
#### Group Methods

##### add

Add object

```JavaScript
group.add(child);
```

##### remove

Remove object

```JavaScript
group.remove(child);
```

##### empty

Clearing child object

```JavaScript
group.empty();
```

##### replace

Use an object instead of a sub-object

```JavaScript
group.replace(current, pre);
```

### Stage

The largest top-level container inherits from the group, so it has all the methods that the group has

#### Stage Methods

##### update
Any elements added to the Stage cannot be seen, and the update method needs to be executed.
Modification of any element attributes requires executing stage.update() to update the rendering

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

- The `init` method has been built in. If you use the init method, `setHitCanvas` will not be called.
- Set up a simulated virtual canvas, accepting a parameter canvas object, used to calculate pixel-level touch event targets

```JavaScript

const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const hitCanvas = await getCanvasById('xxxId');
stage.setHitCanvas(hitCanvas);
```

##### getTextWidth
Get the width of the text to be rendered, two parameters, the first parameter is `text: String`, the text to be drawn, the second parameter is `font: String`, the style of the text to be set.

##### loadImage

stage has a built-in image loader that takes a parameter 'url: string' and returns a promise object.

The result of the promise execution is the image object, which is used for bitmap drawing.

```JavaScript
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const imgObj2 = await stage.loadImage('../logo.png');

const bitmap = new Bitmap(imgObj2);
stage.add(bitmap);
stage.update();
```

### Bitmap
bitmap accepts one parameter, an instance of an image object, and cannot use a url or local path. bitmap is synchronous and has no callback method.

```JavaScript
const bitmap = new Bitmap(img);
stage.add(bitmap);
stage.update()
```

You can set the image crop display area, and other transform properties:

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

Text object

```JavaScript
const textVal = 'This is the test text';
const fontSize = 18;
const text = new Text(textVal, {
  strokeStyle: 'red',
  size: fontSize,
  id: 'text',
});
```


##### getWidth

Get text width

```JavaScript
stage.getTextWidth();
```


### Graphics

Drawing object, used to draw graphics using the basic concatenated Canvas command

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

Special note, if you perform graphics continuous drawing operations in a loop, be sure to add the clear() method, otherwise the path will be superimposed and your browser will be overwhelmed:

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

#### Ring
```js
const r = 80;
const ring = new Ring(r, {
  strokeGradient: ['#4374f1', '#5ec7c7', '#f9d387', '#f1a88f', '#e78a86'],
  lineWidth: 15,
  strokeGradientPercent: 0.7,
  percent: 0.1,
  id: `ring`,
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
| stage | The stage you're on |

Usage:

```js
obj.stage;
```

## property (valid for all graphics, text, group, and stage)

### Transform

| Attribute Name| Description |
| -------- | ------------------------------- |
| x        | Horizontal migration                        |
| y        | Vertical migration                        |
| scaleX   | Horizontal scaling                        |
| scaleY   | Vertical scaling                        |
| scale    | Set or read scale x and scale y simultaneously |
| rotation | rotate                            |
| skewX    | skew X                          |
| skewY    | skew Y                          |
| regX     | Rotation base point X                      |
| regY     | Rotation base point Y                      |

### Alpha

| Attribute Name| Description |
| ------ | ------------ |
| alpha  | Transparency of element |

If alpha is set for both parent and child, multiply and stack.

### Gradient

| Attribute Name| Description |
| ------ | ------------ |
| gradientPoints  | The start and end points of a gradient line segment |
| fillGradient | Linear fill gradient color values |
| strokeGradient | Linear outline gradient color value |


### compositeOperation

| Attribute Name     | Description                      |
| ------------------ | -------------------------------- |
| compositeOperation | Overlay mode where the source image is drawn onto the target image |

Note that if compositeOperation is not defined here, it will search upwards and find the nearest parent container that defines compositeOperation as its own compositeOperation.

### Shadow

| Attribute name | Description |
| ------ | ---- |
| shadow | shadow |

Usage:

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

## Methods

### destroy

Destroy all elements in a group or stage (including yourself)

```js
// Destroy all elements under the group
group.destroy();

// Destroy all elements under stage
stage.destroy();
```

### empty

Empty all elements in a group or stage (excluding itself)

```js
// Clear all elements under the group
group.empty();

// Empty all elements under stage
stage.empty();
```

## Event

| EventName     | Description               |
| ---------- | ------------------ |
| tap        | Touch the finger and leave immediately |
| touchstart | Finger touch motion begins   |
| touchmove  | Fingers touch and move     |
| touchend   | Finger touch action is over   |
| drag       | drag               |

Events trigger down to the pixel level. If you want to use the rectangular area of the element as the click area, you need to set the hit box of the setting element

## Clip

```JavaScript
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const bitmap = new Bitmap(imgObj2);

const clipPath = new Graphics();
clipPath.arc(40, 40, 25, 0, Math.PI * 2);
bitmap.clip(clipPath);

stage.add(bitmap);
```

Use the following code to get the same effect:

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

The clipping area also supports all transform properties (x,y,scale x,scale y,rotation,skew x,skew y,reg x,reg y).

## Custom object

### Custom Shape

Custom shape inherits from shape:

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

Shape Usage:

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

### Custom Element

A custom element inherits from a group:

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

Usage:

```JavaScript
const customElement = new Button(stage, {
  text: 'Custom Element',
  id: 'customElement',
  color: 'red',
  fontSize: 20,
});
```

In general, it is recommended to use inheritance from groups for slightly more complex assemblies, which is easy to extend and manage their own internal components

## Picture loader

The image loader returns a promise

```JavaScript
const { loadImage } = pencilFlow;

// The canvas parameter is the obtained canvas 2d object instance
const imgObj = await loadImage('../logo.png', canvas);

// stage image loading method
const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
const imgObj2 = await stage.loadImage('../logo.png');

const bitmap = new bitMap(imgObj2);
stage.add(bitmap);
stage.update();
```

## Matters needing attention
It has good support for gesture-related events, built-in drag and drop function, and supports two options of rectangular boundary and pixel-level boundary

The canvas initialization of the project adopts display setting width and height and ADAPTS pixel density by scaling to display HD

For more complex projects, it is recommended to develop components through classes, that is, each component is a class, and the class contains its own layout and update methods, so that you can develop highly reusable components, and then easy to maintain


## Reference acknowledgements

- mini-program-rc: This project is on the https://github.com/fyuanz/mini-program-rc project based on secondary development

## License
[MIT](https://opensource.org/license/MIT)

