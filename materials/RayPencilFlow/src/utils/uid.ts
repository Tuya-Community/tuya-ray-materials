/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

interface UID {
  _nextID: number;
  get: () => number;
}

const UID: UID = {
  _nextID: 0,
  get: function () {
    return UID._nextID++;
  },
};

export default UID;
