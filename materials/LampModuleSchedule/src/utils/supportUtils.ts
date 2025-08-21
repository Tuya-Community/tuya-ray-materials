interface ISupports {
  isSupportLocalTimer: boolean;
  isSupportCloudTimer: boolean;
  isSupportCountdown: boolean;
}

let supports: ISupports = {
  isSupportLocalTimer: false,
  isSupportCloudTimer: false,
  isSupportCountdown: false,
};

export const setSupport = (_supports: any) => {
  supports = {
    ...supports,
    ...(_supports || {}),
  };
};

export const getSupport = (): ISupports => {
  return supports;
};
