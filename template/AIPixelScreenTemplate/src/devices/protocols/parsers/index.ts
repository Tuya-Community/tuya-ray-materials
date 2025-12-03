import GifProFormatter from './GifProFormatter';
import PicProFormatter from './PicProFormatter';
import PixelDoodleFormatter from './PixelDoodleFormatter';

export const GifProTransformer = new GifProFormatter();
export const PicProTransformer = new PicProFormatter();
export const PixelDoodleTransformer = new PixelDoodleFormatter();

export default {
  GifProTransformer,
  PicProTransformer,
  PixelDoodleTransformer,
};
