/* eslint-disable no-param-reassign */

import { Point } from '..';

/**
 * 计算两点之间的距离
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const lineSpace = (x1: number, y1: number, x2: number, y2: number) => {
  let lineLength = 0;
  lineLength = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  return lineLength;
};

/**
 * 点到直线的最短距离的判断 点（x0,y0） 到由两点组成的线段（x1,y1） ,( x2,y2 )
 */
export const pointToLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x0: number,
  y0: number
) => {
  let space = 0;
  const a = lineSpace(x1, y1, x2, y2); // 线段的长度
  const b = lineSpace(x1, y1, x0, y0); // (x1,y1)到点的距离
  const c = lineSpace(x2, y2, x0, y0); // (x2,y2)到点的距离
  if (c <= 0.000001 || b <= 0.000001) {
    space = 0;
    return space;
  }
  if (a <= 0.000001) {
    space = b;
    return space;
  }
  if (c * c >= a * a + b * b) {
    space = b;
    return space;
  }
  if (b * b >= a * a + c * c) {
    space = c;
    return space;
  }
  const p = (a + b + c) / 2; // 半周长
  const s = Math.sqrt(p * (p - a) * (p - b) * (p - c)); // 海伦公式求面积
  space = (2 * s) / a; // 返回点到线的距离（利用三角形面积公式求高）
  return space;
};

/**
 * 判断两个区域是否相邻
 * @param list1
 * @param list2
 * @return
 */
export const isAdjacent = (
  list1: Array<{ x: number; y: number }>,
  list2: Array<{ x: number; y: number }>,
  threshold = 5
) => {
  if (list1.length < list2.length) {
    // 较长的数组转Map 较短的数组进行遍历
    [list1, list2] = [list2, list1];
  }
  const len1 = list1.length;
  const len2 = list2.length;

  const threshold2 = threshold * threshold;
  const hash = new Map();

  // 把所有list1中的点按照坐标分类存储
  for (let i = 0; i < len1; i++) {
    const { x, y } = list1[i];
    if (!hash.has(x)) {
      hash.set(x, new Map());
    }
    hash.get(x).set(y, i);
  }

  // 遍历list2中的所有点
  for (let i = 0; i < len2; i++) {
    const { x, y } = list2[i];
    // 在哈希表中查找附近的点是否属于list1
    for (let dx = -threshold; dx <= threshold; dx++) {
      for (let dy = -threshold; dy <= threshold; dy++) {
        const newX = x + dx;
        const newY = y + dy;
        if (hash?.get(newX)?.has(newY)) {
          const distance2 = Math.pow(newX - list2[i].x, 2) + Math.pow(newY - list2[i].y, 2);
          if (distance2 <= threshold2) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

/**
 * 判断两个区域是否接壤
 * @param points1
 * @param points2
 * @return
 */
export const isBorder = (
  points1: Array<{ x: number; y: number }>,
  points2: Array<{ x: number; y: number }>
) => {
  if (!Array.isArray(points1) || !Array.isArray(points2) || !points1.length || !points2.length) {
    return true;
  }
  const mapScale = 1;
  const maxDistance = 5;
  let count = 0;
  let dis: number;
  const len1 = points1.length;
  const len2 = points2.length;

  if (len1 > 0 && len2 > 0) {
    for (let j = 1; j < len1; j++) {
      for (let i = 0; i < len2; i++) {
        if (j === len1 - 1) {
          dis = pointToLine(
            points1[0].x * mapScale,
            points1[0].y * mapScale,
            points1[j].x * mapScale,
            points1[j].y * mapScale,
            points2[i].x * mapScale,
            points2[i].y * mapScale
          );
        } else {
          dis = pointToLine(
            points1[j - 1].x * mapScale,
            points1[j - 1].y * mapScale,
            points1[j].x * mapScale,
            points1[j].y * mapScale,
            points2[i].x * mapScale,
            points2[i].y * mapScale
          );
        }
        if (dis <= maxDistance) {
          count++;
          break;
        }
      }
    }
  }
  return count > 0;
};

interface Circle extends Point {
  radius: number;
}

type Polygon = Point[];

type Line = [Point, Point];

type Rect = [Point, Point, Point, Point];

const getLinesByRect = (rect: Rect): Line[] => {
  const { length } = rect;
  const lines = [];
  let prePoint;
  let curPoint;
  let first;

  for (let index = 0; index < length; index++) {
    curPoint = rect[index];
    if (index === 0) {
      first = curPoint;
    } else if (index > 0) {
      lines.push([prePoint, curPoint]);
    }

    if (index === length - 1) {
      lines.push([curPoint, first]);
    }
    prePoint = curPoint;
  }
  return lines;
};

const distanceOfPoints = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) => {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
};

const isCenterInsidePolygon = (p: Point, polygon: Polygon) => {
  const px = p.x;
  const py = p.y;
  let sum = 0;

  for (let i = 0, l = polygon.length, j = l - 1; i < l; j = i, i++) {
    const sx = polygon[i].x;
    const sy = polygon[i].y;
    const tx = polygon[j].x;
    const ty = polygon[j].y;

    // 点与多边形顶点重合或在多边形的边上
    if (
      (sx - px) * (px - tx) >= 0 &&
      (sy - py) * (py - ty) >= 0 &&
      (px - sx) * (ty - sy) === (py - sy) * (tx - sx)
    ) {
      return true;
    }

    // 点与相邻顶点连线的夹角
    let angle = Math.atan2(sy - py, sx - px) - Math.atan2(ty - py, tx - px);

    // 确保夹角不超出取值范围（-π 到 π）
    if (angle >= Math.PI) {
      angle -= Math.PI * 2;
    } else if (angle <= -Math.PI) {
      angle += Math.PI * 2;
    }

    sum += angle;
  }

  // 计算回转数并判断点和多边形的几何关系
  return Math.round(sum / Math.PI) !== 0;
};

export const lineInCircle = (circle: Circle, line1: Line, rect: Rect) => {
  // *  1:两个端点都在圆内, 一定不相交, 可以把两个点带入圆的方程判断 是否小于0
  // *  2:两个端点,一个在圆内,一个在圆外, 一定相交, 同样 点带入方程 判断
  // *  3:两个端点都在外面, 此时略微麻烦, 可以通过点到直线的距离来判断,但是当直线和圆心一条直线时,此时需要特别处理.光有距离判断是不行的. 要通过角度来判断.-->余弦方程 转
  const { radius: r } = circle;
  const cd = r ** 2;

  const d3 = pointToLine(line1[0].x, line1[0].y, line1[1].x, line1[1].y, circle.x, circle.y) ** 2;

  const disP1 = distanceOfPoints(circle, line1[0]);
  const disP2 = distanceOfPoints(circle, line1[1]);

  // 判断线段与圆的位置关系: 1.如果两端点都在圆内，那么线段在圆内, 2.如果一个在圆内，一个在圆外，那么线段与圆相交
  if (disP1 < cd || disP2 < cd) {
    return true;
  }

  // 3.如果两个端点都在圆外，那么计算圆心到线段的最小距离Hmin，如果Hmin小于半径，那么相交，否则线段在圆外。
  if (d3 < cd) {
    return true;
  }
  // 问题B：判断圆心与矩形的位置关系。如下所示有两种情况，可以通过计算圆心与端点之间夹角和来判断，等于360度则圆心在矩形内，小于360度则在矩形之外。

  return isCenterInsidePolygon(circle, rect);
};

/**
 * 判断圆是否与矩形相交
 *
 * @export
 * @param {Circle} circle
 * @param {Rect} rect
 * @returns {Boolean}
 */
export const circleIntersectRect = (circle: Circle, rect: Rect) => {
  const lines = getLinesByRect(rect);

  const { length } = lines;
  for (let index = 0; index < length; index++) {
    const line1 = lines[index];

    if (lineInCircle(circle, line1, rect)) {
      return true;
    }
  }
  return false;
};

/**
 * 判断线段是否与圆相交
 * @param {Circle} circle - 圆
 * @param {Line} line - 线段
 * @returns {Boolean} - 是否相交
 */
export const lineIntersectCircle = (circle: Circle, line: Line) => {
  const { radius: r } = circle;
  const cd = r ** 2;

  // 计算点到线段的距离的平方
  const d3 = pointToLine(line[0].x, line[0].y, line[1].x, line[1].y, circle.x, circle.y) ** 2;

  // 计算圆心到线段两端点的距离平方
  const disP1 = distanceOfPoints(circle, line[0]);
  const disP2 = distanceOfPoints(circle, line[1]);

  // 判断线段与圆的位置关系
  // 1. 如果任一端点在圆内，则相交
  if (disP1 < cd || disP2 < cd) {
    return true;
  }

  // 2. 如果两端点都在圆外，但圆心到线段的距离小于半径，则相交
  if (d3 < cd) {
    return true;
  }

  // 3. 其他情况不相交
  return false;
};
