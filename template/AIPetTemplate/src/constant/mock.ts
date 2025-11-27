export const PHOTOS = [
  '/video/613_1720340774.mp4',
  '/images/5861720320424_.pic.jpg',
  '/images/5871720320426_.pic.jpg',
  '/images/5881720320426_.pic.jpg',
  '/images/5891720320427_.pic.jpg',
  '/images/5901720320428_.pic.jpg',
  '/images/5921720320430_.pic.jpg',
  '/images/5931720320430_.pic.jpg',
  '/images/5941720320431_.pic.jpg',
  '/images/5951720321501_.pic.jpg',
  '/images/5961720321502_.pic.jpg',
].map(d => {
  const width = Math.random() * 1000;
  const height = width;
  const isImage = d.startsWith('/images');
  return {
    height,
    thumbTempFilePath: isImage ? d : '/images/5931720320430_.pic.jpg',
    width,
    size: width * height,
    duration: isImage ? 0 : Math.random() * 255,
    tempFilePath: isImage ? d : '',
    fileType: isImage ? 'image' : 'video',
  };
});
