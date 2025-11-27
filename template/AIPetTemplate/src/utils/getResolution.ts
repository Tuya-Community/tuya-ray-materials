export const getResolution = (resolution: string) => {
  if (!resolution) {
    return {
      width: 375,
      height: 375,
    };
  }
  const [width, height] = resolution.split('*');
  return {
    width: Number(width),
    height: Number(height),
  };
};
export default getResolution;
