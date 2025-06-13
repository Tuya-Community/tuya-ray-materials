import { useRef, useState, useEffect, useCallback } from 'react';
import { getBoundingClientRect, getElementById } from '@ray-js/ray';

interface UseContainerDimensions {
  height: number;
  width: number;
}
interface ExtraData {
  [key: string]: any;
}

const useContainerDimensions = (id: string, extraData: ExtraData): UseContainerDimensions => {
  const idRef = useRef(id);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const element = await getElementById(idRef.current);
      if (element) {
        const rect = await getBoundingClientRect(element);
        setHeight(rect.height);
        setWidth(rect.width);
      } else {
        throw new Error(`Element with id ${idRef.current} not found.`);
      }
    } catch (error) {
      console.error('Error getting size:', error);
    }
  }, [extraData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, idRef.current]);

  return { width, height };
};

export default useContainerDimensions;
