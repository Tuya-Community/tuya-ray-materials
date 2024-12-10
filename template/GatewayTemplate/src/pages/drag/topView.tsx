import React, { FC, useMemo } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import { SelectBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import { RoomItem, DevInfo } from '@/types';
import styles from './index.module.less';

interface IProps {
  roomList: RoomItem[];
  displayedDevList: DevInfo[];
  selectedIds: string[];
  isReachLimitation: boolean;
  bluLimitationNum: number;
  restSelectableNum: number;
  setSelectedIds: (v: string[]) => void;
  currentRoomId: number | string;
  setCurrentRoomId: (v: number | string) => void;
}

const TopView: FC<IProps> = ({
  roomList,
  displayedDevList,
  selectedIds,
  isReachLimitation,
  bluLimitationNum,
  restSelectableNum,
  setSelectedIds,
  currentRoomId,
  setCurrentRoomId,
}) => {
  const options = useMemo(() => {
    const transformedList = roomList.map(({ roomId, name }) => ({
      label: name,
      value: roomId,
    }));
    return [{ label: Strings.getLang('allDevices'), value: 0 }, ...transformedList];
  }, [roomList]);

  const isAllSelected = useMemo(
    () =>
      displayedDevList.filter(d => !d.disabled).every(({ devId }) => selectedIds.includes(devId)),
    [selectedIds, displayedDevList]
  );

  const canSelectMore = useMemo(
    () => !isAllSelected && !isReachLimitation,
    [isAllSelected, isReachLimitation]
  );

  const selectAll = () => {
    // 过滤掉已被禁选的设备项
    const selectableList = displayedDevList.filter(d => !d.disabled);
    if (restSelectableNum === Infinity) {
      setSelectedIds(selectableList.map(d => d.devId));
    } else {
      const list = [];
      let count = restSelectableNum;
      for (let i = 0; i < selectableList.length; i++) {
        const { devId } = selectableList[i];
        if (!selectedIds.includes(devId)) {
          list.push(devId);
          count--;
        }
        if (count === 0) {
          break;
        }
      }
      setSelectedIds([...selectedIds, ...list]);
    }
  };

  const deselectAll = () => {
    const newList = selectedIds.filter(
      item => !displayedDevList.find(({ devId }) => devId === item)
    );
    setSelectedIds(newList);
  };

  const renderSelectAll = () => {
    return (
      <View
        className={styles['select-all-container']}
        onClick={canSelectMore ? selectAll : deselectAll}
      >
        <Text className={styles['select-all-text']}>
          {Strings.getLang(canSelectMore ? 'selectAll' : 'deselectAll')}
        </Text>
        {restSelectableNum !== Infinity && (
          <Text
            className={styles['select-progress']}
          >{`(${selectedIds.length}/${bluLimitationNum})`}</Text>
        )}
        <Image
          className={styles['select-all-checkbox']}
          src={isAllSelected || isReachLimitation ? Res.checkboxChecked : Res.checkBoxUnchecked}
          mode="aspectFit"
        />
      </View>
    );
  };

  return (
    <SelectBar
      options={options}
      value={currentRoomId}
      onSelect={roomId => setCurrentRoomId(roomId)}
    >
      {displayedDevList.length ? renderSelectAll() : null}
    </SelectBar>
  );
};

export default TopView;
