import { Toast } from '@ray-js/smart-ui';
import React, { useRef, useState } from 'react';

export interface UseToastOps {
  show: boolean;
  content?: React.ReactNode;
  duration?: number;
}

export const useToast = () => {
  const [data, setData] = useState({
    show: false,
    content: null,
    duration: 2000,
  });

  const ref = useRef(-1);

  return {
    modal: (
      <Toast
        // @ts-ignore
        show={data.show}
        onClose={() =>
          setData({
            ...data,
            show: false,
          })
        }
        duration={data.duration}
      >
        {data.content}
      </Toast>
    ),
    show(ops: UseToastOps) {
      if (ref.current !== -1) {
        clearTimeout(ref.current);
      }

      setData({
        ...data,
        ...ops,
      });
      // @ts-ignore
      ref.current = setTimeout(() => {
        setData({
          ...data,
          show: false,
        });
      }, ops.duration || 2000);
    },
  };
};
