import { useEffect } from 'react';
import { useSelector } from '@/redux';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { fetchAiNoteCardDisplayStatus } from '@/redux/modules/aiNoteCardSlice';
import store from '@/redux';

/**
 * 获取 AI 笔记卡片显示状态的 hook
 * 在应用级别加载，避免每次进入详情页触发请求
 */
export const useAiNoteCardStatus = () => {
  const { homeId } = useSelector(selectDevInfo);
  useEffect(() => {
    if (!homeId) return;
    store.dispatch(fetchAiNoteCardDisplayStatus(homeId));
  }, [homeId]);
};
