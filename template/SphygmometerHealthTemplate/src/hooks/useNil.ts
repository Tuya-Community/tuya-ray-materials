export default (...arg: any) => {
  for (let i = 0; i < arg.length; i++) {
    if (!arg[i]) {
      return [true];
    }
  }
  return [false];
};
