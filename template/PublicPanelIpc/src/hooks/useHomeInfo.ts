import { useState, useRef } from 'react';

type HomeInfo = Parameters<Parameters<typeof ty.home.getCurrentHomeInfo>[0]['success']>[0];

export function useHomeInfo() {
  const [homeInfo, setHomeInfo] = useState<HomeInfo>();
  const init = useRef(false);
  if (!init.current) {
    ty.home.getCurrentHomeInfo({
      success(info) {
        init.current = true;
        setHomeInfo(info);
      },
    });
  }
  return homeInfo;
}
