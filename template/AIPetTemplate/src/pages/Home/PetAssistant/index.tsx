import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { find } from 'lodash-es';
import clsx from 'clsx';
import { View, Text, getDevInfo, ScrollView, getPetEatingList } from '@ray-js/ray';
import { selectAllPets } from '@/redux/modules/petsSlice';
import { selectHomeId } from '@/redux/modules/homeInfoSlice';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';
import Strings from '@/i18n';
import { RECORD_DATA_TYPE } from '@/constant';
import { mockData } from './data';
import RecordItem from './RecordItem';
import styles from './index.module.less';

const PetAssistant: FC = () => {
  const pets = useSelector(selectAllPets);
  const homeId = useSelector(selectHomeId());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPageNo, setCurrentPageNo] = useState(1); // 当前页码
  const [hasNext, setHasNext] = useState(true);
  const [eatingRecords, setEatingRecords] = useState([]);

  const isFull = useSelector(selectIpcCommonValue('isFull'));

  useEffect(() => {
    getData(1);
  }, []);

  const getData = async (pageNo: number, isFresh?: boolean) => {
    try {
      const day = dayjs();
      const startOfDay = day.clone().startOf('day').valueOf();
      const endOfDay = day.clone().endOf('day').valueOf();
      setRefreshing(!!isFresh);

      const eatParams = {
        ownerId: homeId,
        uuid: getDevInfo().uuid,
        startTime: startOfDay,
        endTime: endOfDay,
        pageNo,
        pageSize: 100,
        dataType: 'ai_pet_center',
      };
      const { pageNo: pageNumber, hasNext, data = [] } = await getPetEatingList(eatParams);
      setRefreshing(false);
      setHasNext(hasNext);
      setCurrentPageNo(pageNumber);

      const formattedEatingRecord = data.map(item => {
        const petName = Array.isArray(item.pets)
          ? item.pets.map(p => {
              return find(pets, { id: p.petId })?.name;
            })
          : Strings.getLang('pet');
        return {
          ...item,
          timeStamp: item.recordTime,
          time: dayjs(item.recordTime).format('HH:mm'),
          img: item.videoCoverDisplay,
          type: RECORD_DATA_TYPE.feed,
          desc: Strings.formatValue('dsc_feed_eating', petName),
        };
      });

      if (pageNo > 1) {
        setEatingRecords([...eatingRecords, ...formattedEatingRecord]);
      } else {
        setEatingRecords(formattedEatingRecord);
      }
    } catch (error) {
      setRefreshing(false);
      console.log('fetch error: ', error);
    }
  };

  const onRefresherrefresh = () => {
    getData(1, true);
  };

  const onScrollToLower = () => {
    if (!hasNext) {
      return;
    }
    getData(currentPageNo + 1);
  };

  return (
    <View className={clsx(styles['assistant-wrapper'], isFull && 'hide')}>
      <View className={styles['top-view']}>
        <Text className={styles.title}>{Strings.getLang('pet_sitting_assistant')}</Text>
      </View>

      <ScrollView
        scrollY
        refresherEnabled
        className={styles['assistant-content']}
        refresherTriggered={refreshing}
        onRefresherrefresh={onRefresherrefresh}
        onScrollToLower={onScrollToLower}
      >
        {/* 此处暂时使用mock数据，真实开发时，请替换为eatingRecords */}
        {mockData.map(item => {
          return <RecordItem key={item.id} data={item} />;
        })}
      </ScrollView>
    </View>
  );
};

export default PetAssistant;
