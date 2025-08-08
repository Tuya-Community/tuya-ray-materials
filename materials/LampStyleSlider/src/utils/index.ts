interface PercentOption {
  min?: number;
  max?: number;
  minPercent?: number;
}

export const formatPercent = (
  value = 0,
  { min = 0, max = 1000, minPercent = 0 }: PercentOption = {}
): number => {
  return Math.min(100, Math.round(((100 - minPercent) * (value - min)) / (max - min) + minPercent));
};
