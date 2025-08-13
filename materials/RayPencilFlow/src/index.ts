import Render from './render/index';

import Stage from './node/stage';
import Group from './node/group';
import Bitmap from './node/bitmap';
import Text from './node/text';
import Graphics from './node/graphics';
import Shape from './node/shape/shape';
import Rect from './node/shape/rect';
import Circle from './node/shape/circle';
import Ring from './node/shape/ring';
import RoundedRect from './node/shape/rounded-rect';
import Ellipse from './node/shape/ellipse';
import Polygon from './node/shape/polygon';
import Sector from './node/shape/sector';
import EquilateralPolygon from './node/shape/equilateral-polygon';

import * as utils from './utils';

const pencilFlow = {
  Render,
  Stage,
  Group,
  Bitmap,
  Text,
  Graphics,
  Shape,
  Rect,
  Circle,
  Ring,
  RoundedRect,
  Ellipse,
  Polygon,
  Sector,
  EquilateralPolygon,
  loadImage: utils.loadImage,
};

export const init = (
  canvasId: string,
  hitCanvasId: string,
  { pixelRatio = 1, canvasWidth = 300, canvasHeight = 300, throttle = 1, extraCanvasId }
): Promise<{
  stage: Stage;
  ctx: CanvasRenderingContext2D;
  canvas: TMiniCanvas;
  extraOption?: {
    extraCanvas: TMiniCanvas;
    extraStage: Stage;
  };
}> => {
  let timer = null;
  return new Promise((resolve, reject) => {
    getCanvasById(canvasId)
      .then((canvas: TMiniCanvas) => {
        getCanvasById(hitCanvasId)
          .then((_hitCanvas: TMiniCanvas) => {
            // 如果需要叠加 Canvas 元素需要传入 extraCanvasId
            if (extraCanvasId) {
              getCanvasById(extraCanvasId)
                .then((extraCanvas: TMiniCanvas) => {
                  const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
                  stage.setHitCanvas(_hitCanvas);
                  canvas.addEventListener('touchstart', e => {
                    stage.touchStartHandler(e);
                  });
                  canvas.addEventListener('touchmove', e => {
                    // 节流
                    if (timer) {
                      return;
                    }
                    timer = setTimeout(() => {
                      stage.touchMoveHandler(e);
                      timer = null;
                    }, throttle);
                  });
                  canvas.addEventListener('touchend', e => {
                    stage.touchEndHandler(e);
                  });
                  const ctx = canvas.getContext('2d');
                  let extraStage = null;
                  if (extraCanvas) {
                    extraStage = new Stage(extraCanvas, canvasWidth, canvasHeight, pixelRatio);
                  }
                  resolve({
                    stage,
                    ctx,
                    canvas,
                    extraOption: {
                      extraCanvas,
                      extraStage,
                    },
                  });
                })
                .catch(err => {
                  reject(err);
                });
              return;
            }
            const stage = new Stage(canvas, canvasWidth, canvasHeight, pixelRatio);
            stage.setHitCanvas(_hitCanvas);
            canvas.addEventListener('touchstart', e => {
              stage.touchStartHandler(e);
            });
            canvas.addEventListener('touchmove', e => {
              // 节流
              if (timer) {
                return;
              }
              timer = setTimeout(() => {
                stage.touchMoveHandler(e);
                timer = null;
              }, throttle);
            });
            canvas.addEventListener('touchend', e => {
              stage.touchEndHandler(e);
            });
            const ctx = canvas.getContext('2d');
            resolve({
              stage,
              ctx,
              canvas,
            });
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default pencilFlow;
