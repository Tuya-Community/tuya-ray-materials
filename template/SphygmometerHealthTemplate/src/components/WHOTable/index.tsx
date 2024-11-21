import { ScrollView, View } from '@ray-js/ray';
import { keys } from 'lodash-es';

import Strings from '@/i18n';
import { Text, TouchableOpacity } from '../common';
import styles from './index.module.less';

type KEY = 'type' | 'SBP' | 'DBP' | 'relation';
interface ITEM {
  type:
    | 'dsc_WHO_LV0'
    | 'dsc_WHO_LV1'
    | 'dsc_WHO_LV2'
    | 'dsc_WHO_LV3'
    | 'dsc_WHO_LV4'
    | 'dsc_WHO_LV5';
  SBP: string;
  relation: string;
  DBP: string;
}

const tableData = [
  {
    type: Strings.getLang('dsc_WHO_LV0'),
    SBP: '<120',
    relation: Strings.getLang('dsc_relation_and'),
    DBP: '<80',
  },
  {
    type: Strings.getLang('dsc_WHO_LV1'),
    SBP: '120~129',
    relation: Strings.getLang('dsc_relation_or'),
    DBP: '80~84',
  },
  {
    type: Strings.getLang('dsc_WHO_LV2'),
    SBP: '130~139',
    relation: Strings.getLang('dsc_relation_or'),
    DBP: '85~89',
  },
  {
    type: Strings.getLang('dsc_WHO_LV3'),
    SBP: '140~159',
    relation: Strings.getLang('dsc_relation_or'),
    DBP: '90~99',
  },
  {
    type: Strings.getLang('dsc_WHO_LV4'),
    SBP: '160~179',
    relation: Strings.getLang('dsc_relation_or'),
    DBP: '100~109',
  },
  {
    type: Strings.getLang('dsc_WHO_LV5'),
    SBP: '≧180',
    relation: Strings.getLang('dsc_relation_or'),
    DBP: '≧110',
  },
];

const WHOTable = () => {
  return (
    <View className={styles.container}>
      <View className={styles.columnBox}>
        <View className={styles.colBox}>
          <Text className={styles.colText} numberOfLines={2}>
            {Strings.getLang('dsc_WHOTable')}
          </Text>
        </View>
        <View className={styles.colBox}>
          <Text className={styles.colText} numberOfLines={2}>
            {Strings.getLang('dsc_SBP')}
          </Text>
        </View>
        <View className={styles.colBox}>
          <Text className={styles.colText} numberOfLines={2}>
            {Strings.getLang('dsc_relation')}
          </Text>
        </View>
        <View className={styles.colBox}>
          <Text className={styles.colText} numberOfLines={2}>
            {Strings.getLang('dsc_DBP')}
          </Text>
        </View>
      </View>
      <ScrollView scrollX>
        <TouchableOpacity activeOpacity={1} className={styles.container}>
          {tableData.map((item: ITEM) => (
            <View className={styles.columnBox} key={item.type}>
              {keys(item).map((key: KEY) => (
                <View className={styles.colBox} key={key}>
                  <Text
                    className={styles.colText}
                    numberOfLines={2}
                    style={{ color: key === 'type' ? 'rgba(0, 0, 0, 0.45)' : '#001E3E' }}
                  >
                    {item[key]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WHOTable;
