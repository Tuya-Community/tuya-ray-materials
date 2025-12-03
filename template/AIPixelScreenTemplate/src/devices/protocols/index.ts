import dpParser from './parsers';

export const protocols = {
  gif_pro: dpParser.GifProTransformer,
  pic_pro: dpParser.PicProTransformer,
  pixel_doodle: dpParser.PixelDoodleTransformer,
};
