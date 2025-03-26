import { getCdnUrlAsync } from '@ray-js/ray';
import cdnMap from '../../cdn/cdnImage.json';
import { useEffect, useState } from 'react';

export const useCdnImgUrl = (imgName: string) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    getCdnUrlAsync(imgName, cdnMap).then(newUrl => {
      setUrl(newUrl);
    });
  }, [imgName]);
  return url;
};

const getCdnImgUrlAsync = imgName => {
  return getCdnUrlAsync(imgName, cdnMap);
};

export default getCdnImgUrlAsync;
