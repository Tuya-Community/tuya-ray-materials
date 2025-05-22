export const getUuid = (prefix = ''): string => {
  const id = `${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`;
  if (prefix) {
    return `${prefix}_${id}`;
  }
  return id;
};
