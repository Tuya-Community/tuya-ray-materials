import { useRef } from "react";
import { usePageEvent } from "@ray-js/ray";

const usePageShow = (cb: (isFirst: boolean) => void): void => {
  const first = useRef(true);

  usePageEvent("onShow", () => {
    cb(first.current);
    first.current = false;
  });
};
export default usePageShow;
