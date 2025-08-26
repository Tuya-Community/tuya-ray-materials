import { exitMiniProgram, router } from '@ray-js/ray';

export const backMini = () => {
  // @ts-ignore
  const pages = getCurrentPages();
  if (pages.length > 1) {
    router.back();
  } else {
    exitMiniProgram();
  }
};
