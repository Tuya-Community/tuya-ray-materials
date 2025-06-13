import React from 'react';
import { useSelector } from 'react-redux';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';

export function useCSSVar() {
  const brandColor = useSelector(selectPanelInfoByKey('brandColor'));
  return {
    '--brandColor': brandColor,
    '--button-primary-color': '#fff',
    '--button-primary-background-color': brandColor,
    '--button-primary-border-color': brandColor,
  } as React.CSSProperties;
}
