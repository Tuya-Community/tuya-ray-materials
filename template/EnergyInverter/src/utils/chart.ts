export const getPercent = (a, b) => {
  if (a <= 0) return 0;
  if (b === 0) return 0;
  return Math.round((a * 100) / b);
};
