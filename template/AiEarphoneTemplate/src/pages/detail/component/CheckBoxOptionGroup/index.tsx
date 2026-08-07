import { Checkbox, CheckboxGroup, CellGroup, Cell } from '@ray-js/smart-ui';
import React, { useState } from 'react';
import { getCurrentPages } from '@ray-js/ray';
import styles from './index.module.less';
import TranscriptionConfigPopup from '../ShareTranscriptConfigPopup';

interface Props {
  options: {
    name: string;
    label: string;
    disabled?: boolean;
    disabledTip?: string;
    component?: React.ReactNode;
  }[];
  shareType: string[];
  setShareType: (types: string[]) => void;
  onChange: (event: any) => void;
  isSpeakerLabelAvailable: boolean;
  isTranslateAvailable: boolean;
}

const CheckBoxOptionGroup = ({
  options,
  onChange,
  shareType,
  setShareType,
  isSpeakerLabelAvailable,
  isTranslateAvailable,
}: Props) => {
  const [showTranscriptionConfigPopup, setShowTranscriptionConfigPopup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const toggle = index => {
    const pages = getCurrentPages();
    const pageInstall = pages[pages.length - 1];
    const checkbox = pageInstall.selectComponent(`#checkboxes-${index}`);
    checkbox.toggle();
  };

  const onSelectChange = (e: any) => {
    // 只有点击的是 trans 的 checkbox 时才弹出弹窗
    const { value = [], detail = [] } = e || {};
    const prev = shareType || [];
    const next = Array.isArray(detail) ? detail : value;
    const changedItem = next.find(x => !prev.includes(x)) || prev.find(x => !next.includes(x));
    if (changedItem === 'trans') {
      setShowTranscriptionConfigPopup(true);
      return;
    }
    onChange(e);
  };

  return (
    <>
      <CheckboxGroup key={refreshKey} value={shareType} onChange={onSelectChange}>
        <CellGroup customClass={styles.cellGroup} inset insetBorderRadius={12}>
          {options.map((item, index) => {
            return (
              <Cell
                key={item.name}
                title={item.label}
                border={false}
                clickable
                useLabelSlot
                titleClass={styles.cellTitle}
                slot={{
                  label: item.component ? item.component : <></>,
                }}
                onClick={() => {
                  if (item.disabled) {
                    ty.showToast({
                      title: item.disabledTip,
                      icon: 'none',
                    });
                    return;
                  }
                  toggle(index);
                }}
              >
                <Checkbox
                  disabled={item.disabled ?? false}
                  id={`checkboxes-${index}`}
                  name={item.name}
                  dataName={item.name}
                />
              </Cell>
            );
          })}
        </CellGroup>
      </CheckboxGroup>
      <TranscriptionConfigPopup
        show={showTranscriptionConfigPopup}
        onClose={() => setShowTranscriptionConfigPopup(false)}
        onSuccess={() => {
          // 配置成功后，手动更新组件
          setRefreshKey(prev => {
            return prev + 1;
          });
        }}
        isSpeakerLabelAvailable={isSpeakerLabelAvailable}
        isTranslateAvailable={isTranslateAvailable}
        setShareType={setShareType}
        shareType={shareType}
      />
    </>
  );
};

export default CheckBoxOptionGroup;
