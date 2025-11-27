export const getSid = (devId: string) => {
  const now = Date.now();
  return `${devId}_${now}`;
};
