import { usePageEvent } from "@ray-js/ray";

type CB = (res: { scrollTop: number }) => void;

const usePageScroll = (cb: CB): void => {
  usePageEvent("onPageScroll", cb);
};

export default usePageScroll;
