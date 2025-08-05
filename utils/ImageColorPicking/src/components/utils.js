/* eslint-disable no-loop-func */
import { hsv2rgb, rgb2hsv } from './color';
/**
 * @name: 获取像素点颜色
 * @desc:
 * @param {*} pixels 所有像素点
 * @param {*} numColors 提取的颜色数量
 * @param {*} isPrimary 是否保持原色
 * @return {*}
 */
export function extractColors(pixels, numColors, isPrimary) {
  // 收集采样点
  const pre = Math.round(pixels.length / 278000);
  const sampleFrequency = Math.max(1, pre);
  let data = [];
  for (let i = 0; i < pixels.length; i += sampleFrequency) {
    data.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  }

  // 使用kmeans
  const colors = kmeans(data, numColors);
  const maxSColors = colors.map(item => {
    const rgb = item
      .replace('rgba(', '')
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map(lit => Number(lit.trim()));
    const hsv = rgb2hsv(...rgb);
    const value = isPrimary ? hsv[2] : hsv[2] > 40 ? hsv[2] + 15 : 40;
    const color = hsv2rgb(hsv[0], hsv[1], value);
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  });
  return maxSColors;
}

function kmeans(data, k) {
  const centroids = initializeCentroids(data, k);
  let clusters = new Array(k);
  let oldCentroids;
  let changed = true;

  while (changed) {
    clusters = Array.from({ length: k }, () => []);
    data.forEach(point => {
      let closestCentroidIndex = -1;
      let minDistance = Infinity;

      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          closestCentroidIndex = index;
          minDistance = distance;
        }
      });
      if (clusters[closestCentroidIndex]) {
        clusters[closestCentroidIndex].push(point);
      }
    });

    oldCentroids = centroids.slice();
    centroids.forEach((centroid, index) => {
      if (clusters[index].length > 0) {
        const mean = calculateMean(clusters[index]);
        centroids[index] = mean;
      }
    });
    changed = !centroidsEqual(oldCentroids, centroids);
  }

  return centroids.map(centroid => `rgb(${centroid.r}, ${centroid.g}, ${centroid.b})`);
}

function initializeCentroids(data, k) {
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const randIndex = Math.floor(Math.random() * data.length);
    centroids.push({ ...data[randIndex] });
  }
  return centroids;
}

function euclideanDistance(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function calculateMean(cluster) {
  let r = 0;
  let g = 0;
  let b = 0;
  cluster.forEach(point => {
    r += point.r;
    g += point.g;
    b += point.b;
  });
  const { length } = cluster;
  return { r: Math.round(r / length), g: Math.round(g / length), b: Math.round(b / length) };
}

function centroidsEqual(oldCentroids, newCentroids) {
  for (let i = 0; i < oldCentroids.length; i++) {
    if (
      oldCentroids[i].r !== newCentroids[i].r ||
      oldCentroids[i].g !== newCentroids[i].g ||
      oldCentroids[i].b !== newCentroids[i].b
    ) {
      return false;
    }
  }
  return true;
}
