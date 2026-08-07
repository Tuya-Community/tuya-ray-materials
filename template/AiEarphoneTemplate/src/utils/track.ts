import { event } from '@ray-js/ray';

const PROJECT_TYPE = 'ai_note';

/**
 * @description: 埋点
 * @param {string} eventId 事件ID
 * @param {string} eventType 事件类型
 * @param {*} extraData 额外数据
 * @return {*}
 */
export const trackEvent = (eventId: string, eventType: string, extraData = {}) => {
  const pageInstances = getCurrentPages();
  const currentPage = pageInstances[pageInstances.length - 1];
  let fromPageRoute = '';

  if (pageInstances.length > 1) {
    fromPageRoute = pageInstances[pageInstances.length - 2]?.route || '';
  }

  const eventParam = {
    eventId,
    event: {
      business_event_type: eventType,
      project_type: PROJECT_TYPE,
      page_item: {
        from_page_url: fromPageRoute,
        curr_page_url: currentPage?.route || '',
      },
      ...extraData,
    },
    success: () => {
      console.info('埋点上报成功========>', eventParam);
    },
  };

  event(eventParam);
};
