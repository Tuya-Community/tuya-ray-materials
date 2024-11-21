const type = val => {
  return Object.prototype.toString.call(val);
};

export const diff = (d1, d2) => {
  if (type(d1) !== type(d2)) {
    return true;
  }
  const typeRes = type(d1);
  const typeMap = {
    '[object Array]': (a1, a2) => {
      if (a1.length !== a2.length) {
        return true;
      }
      for (let i = 0; i < a1.length; i++) {
        const isDiff = diff(a1[i], a2[i]);
        if (isDiff) {
          return true;
        }
      }
      return false;
    },
    '[object Object]': (o1, o2) => {
      if (!o1 || !o2) {
        return true;
      }
      if (Object.keys(o1).length !== Object.keys(o2).length) {
        return true;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(o1)) {
        const isDiff = diff(o1[key], o2[key]);
        if (isDiff) {
          return true;
        }
      }
      return false;
    },
    '[object String]': (s1, s2) => {
      return s1 !== s2;
    },
    '[object Number]': (s1, s2) => {
      return s1 !== s2;
    },
    '[object Boolean]': (b1, b2) => {
      return b1 !== b2;
    },
  };
  if (!typeMap[typeRes]) {
    return true;
  }
  return typeMap[typeRes](d1, d2);
};

export default diff;
