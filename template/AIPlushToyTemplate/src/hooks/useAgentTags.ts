import Strings from '@/i18n';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { getDevId } from '@/utils';
import { getAIAgentTagList } from '@ray-js/ray';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface TagListItem {
  code: string;
  name: string;
}
interface TagRes {
  list: Array<TagListItem>;
}

const useAgentTags = () => {
  const [tags, setTags] = useState([]);
  const { language } = useSelector(selectSystemInfo);

  useEffect(() => {
    const tags = [{ text: Strings.getLang('dsc_tags_dialog'), key: 'dialog' }];
    getAIAgentTagList({ params: { devId: getDevId(), lang: language } })
      .then((res: TagRes) => {
        const { list } = res || { list: [] };
        list.forEach(item => {
          const { name, code } = item;
          tags.push({ text: name, key: code });
        });
        setTags(tags);
      })
      .catch(err => {
        console.warn(`${JSON.stringify(err)}`);
      });
  }, []);

  return { tags, setTags };
};

export default useAgentTags;
