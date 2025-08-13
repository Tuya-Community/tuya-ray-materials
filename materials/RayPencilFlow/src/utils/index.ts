/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function loadImage(url: string, canvas: TMiniCanvas) {
  return new Promise((resolve, reject) => {
    const image = canvas.createImage();
    image.src = url;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function (error: Error) {
      reject(error);
    };
  });
}
