import { useState } from 'react';
import { View } from '@ray-js/ray';
import { sortBy } from 'lodash-es';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import { Level } from '@/utils';
import { Modal, Text, TouchableOpacity } from '../common';
import styles from './index.module.less';

interface Props {
  show: boolean;
  selectorList: any;
  checkedList: any;
  onSelect: (data: any) => void;
  onHide: () => void;
}

const Filter = ({ show, selectorList, checkedList, onSelect, onHide }: Props) => {
  const [currentSelectorList, setCurrentSelectorList] = useState([...checkedList]);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  const handleConfirm = () => {
    if (selectorList.length > 2) {
      const newSelectorList = sortBy(currentSelectorList, function (item: string) {
        return parseInt(item.slice(-1), 10);
      });

      onSelect(newSelectorList.join(','));
      updateUI({ filterBp: newSelectorList.join(',') });
    } else if (currentSelectorList[0] === 'noRemarks' && currentSelectorList.length === 1) {
      onSelect('false');
      updateUI({ filterRemark: 'false' });
    } else if (currentSelectorList[0] === 'haveRemarks' && currentSelectorList.length === 1) {
      onSelect('true');
      updateUI({ filterRemark: 'true' });
    } else {
      onSelect;
      updateUI({ filterRemark: '' });
    }

    onHide();
  };

  return (
    <Modal
      show={show}
      title={Strings.getLang('dsc_selectBplevel')}
      onCancel={onHide}
      onConfirm={handleConfirm}
    >
      <View
        className={styles.selectorBox}
        style={{ justifyContent: selectorList.length > 2 ? 'space-between' : 'flex-start' }}
      >
        {selectorList.map((item: Level, index: number) => (
          <TouchableOpacity
            className={styles.singleSelector}
            key={item}
            style={{
              backgroundColor: currentSelectorList.includes(item) ? themeColor : '#F3F7FC',
              marginRight: selectorList.length > 2 ? 0 : '16rpx',
            }}
            onClick={() => {
              const res = [...currentSelectorList];
              if (currentSelectorList.indexOf(item) === -1) {
                res.push(item);
              } else {
                const idx = res.indexOf(item);
                res.splice(idx, 1);
              }
              setCurrentSelectorList(res);
            }}
          >
            <Text
              style={{
                fontSize: '28rpx',
                color: currentSelectorList.includes(item) ? '#FFFFFF' : 'rgba(0,30,62,0.7)',
                alignSelf: 'center',
              }}
            >
              {Strings.getLang(`dsc_${item}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default Filter;
