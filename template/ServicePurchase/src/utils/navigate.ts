export const goToPay = (orderId: string): void => {
  ty.navigateTo({
    url: `/pages/payment/index?orderId=${orderId}`,
  });
};

export const goToProductV1 = (): void => {
  ty.navigateTo({
    url: `/pages/product-v1/index`,
  });
};

export const goToProductV2 = (): void => {
  ty.navigateTo({
    url: `/pages/product-v2/index`,
  });
};

export const goToOrderCenter = (): void => {
  ty.router({
    url: "thingsmart://miniApp?uniqueCode=entrygzashkeajybyu",
    fail: (err) => {
      console.log("ty.router err:", err);
    },
  });
};

export const routerBackClose = (delta = 1): void => {
  const pages = getCurrentPages();
  if (pages?.length <= delta) {
    ty.exitMiniProgram();
  } else {
    ty.navigateBack({
      delta,
      fail: () => {
        ty.exitMiniProgram();
      },
    });
  }
};
