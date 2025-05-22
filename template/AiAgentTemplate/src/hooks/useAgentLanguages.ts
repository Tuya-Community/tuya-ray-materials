import { useState, useEffect } from 'react';
import { getAgentLanguages } from '@/api/index_highway';

const useAgentLanguages = (id: number) => {
  const [langRangeList, setSupportLangs] = useState<Array<{ key: string; dataString: string }>>([]);

  useEffect(() => {
    const fetchSupportedLangs = async () => {
      try {
        const response = await getAgentLanguages();
        if (response) {
          setSupportLangs(
            response?.map(item => ({
              dataString: item?.langName,
              key: item?.langCode,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch supported languages:', error);
      }
    };

    fetchSupportedLangs();
  }, []);

  return { langRangeList };
};

export default useAgentLanguages;
