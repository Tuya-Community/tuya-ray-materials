/*
 * @Author: hkc
 * @Date: 2026-01-27 11:33:52
 * @Description:
 * @LastEditTime: 2026-02-05 18:25:32
 * @LastEditors: hkc
 */
import { useState, useEffect, useMemo } from 'react';
import { DetailTabType, GENERATE_TYPE_TO_TAB_MAP } from '../constants';
import { GenerateType } from '@/redux/modules/fileDetailSlice';
import Strings from '@/i18n';

/**
 * Tab页签管理Hook
 * 负责管理Tab的切换、激活状态和Tab列表
 *
 * @param initialTab - 初始Tab类型（来自路由参数）
 * @returns {Object} Tab管理状态和方法
 * @property {DetailTabType} activeTab - 当前激活的Tab
 * @property {Function} setActiveTab - 设置激活的Tab
 * @property {Array} tabList - Tab列表配置
 * @property {Function} setActiveTabByGenerateType - 根据生成类型设置Tab
 */
export const useTabManagement = (initialTab?: string) => {
  const [activeTab, setActiveTab] = useState<DetailTabType>(DetailTabType.Summarize);

  // 根据路由参数初始化Tab
  useEffect(() => {
    if (initialTab && Object.values(DetailTabType).includes(initialTab as DetailTabType)) {
      setActiveTab(initialTab as DetailTabType);
    }
  }, [initialTab]);

  // Tab列表配置
  const tabList = useMemo(
    () => [
      {
        title: Strings.getLang('tab_transcribe'),
        key: DetailTabType.Transcribe,
      },
      {
        title: Strings.getLang('tab_summarize'),
        key: DetailTabType.Summarize,
      },
      {
        title: Strings.getLang('tab_mind'),
        key: DetailTabType.MindMap,
      },
    ],
    []
  );

  /**
   * 根据生成类型设置对应的Tab
   * @param type - 生成类型
   */
  const setActiveTabByGenerateType = (type: GenerateType) => {
    const targetTab = GENERATE_TYPE_TO_TAB_MAP[type];
    if (!targetTab) return;
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  };

  return {
    activeTab,
    setActiveTab,
    tabList,
    setActiveTabByGenerateType,
  };
};
