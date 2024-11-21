import { FC } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import moment from 'moment';

import Strings from '@/i18n';
import Res from '@/res';
import { getDataModuleColor } from '@/utils';
import styles from './index.module.less';

export interface DataModuleProps {
  sys: number;
  dia: number;
  pulse: number;
  bpLevel: 'WHO_LV0' | 'WHO_LV1' | 'WHO_LV2' | 'WHO_LV3' | 'WHO_LV4' | 'WHO_LV5';
  arr: boolean;
  time: Date;
  remark: '';
}

const DataModule: FC<DataModuleProps> = props => {
  const { sys, dia, pulse, bpLevel, arr, time, remark } = props;
  // 获取组件主题色
  const moduleColor = getDataModuleColor(bpLevel);
  // 拆分心率不齐提示的Title和正文，赋予不同样式
  const arrTitle = <Text className={styles.textTitle}>{Strings.getLang('dsc_arrTitle')}</Text>;
  const arrExplan = <Text className={styles.textExplan}>{Strings.getLang('dsc_arrExplan')}</Text>;
  // 拆分备注的Title和正文，赋予不同样式
  const remarkTitle = (
    <Text className={styles.textTitle}>{Strings.getLang('dsc_remarkTitle')}</Text>
  );
  const remarExplan = <Text className={styles.textExplan}>{remark}</Text>;

  return (
    <View className={styles.container}>
      <View className={styles.colorBox} style={{ backgroundColor: moduleColor }} />
      <View className={styles.contentBox}>
        <View className={styles.contentUp}>
          <View className={styles.headTitleBox}>
            <Text className={styles.headTitle} style={{ color: moduleColor }}>
              {Strings.getLang(`dsc_${bpLevel}`)}
            </Text>
          </View>
          <View className={styles.timeBox}>
            <Text className={styles.measureDate}>{moment(time).format('YYYY-M-D  HH:mm')}</Text>
          </View>
        </View>

        <View className={styles.contentDown}>
          <View className={styles.dataBox}>
            <Text className={styles.dataNumber}>{sys}</Text>
            <Text className={styles.dataType}>{Strings.getDpLang('systolic_bp')}</Text>
          </View>
          <View className={styles.columnLine} />
          <View className={styles.dataBox}>
            <Text className={styles.dataNumber}>{dia}</Text>
            <Text className={styles.dataType}>{Strings.getDpLang('diastolic_bp')}</Text>
          </View>
          <View className={styles.columnLine} />
          <View className={styles.dataBox}>
            <Text className={styles.dataNumber}>{pulse}</Text>
            <Text className={styles.dataType}>{Strings.getDpLang('pulse')}</Text>
          </View>
        </View>
        {arr && (
          <View className={styles.textBox}>
            <View className={styles.rowLine} />
            <View className={styles.textContent}>
              <Text style={{ lineHeight: '34rpx' }}>
                <>
                  {arrTitle}
                  {arrExplan}
                </>
              </Text>
            </View>
          </View>
        )}
        {remark !== '' && (
          <View className={styles.textBox}>
            <View className={styles.rowLine} />
            <View className={styles.textContent}>
              <Text style={{ lineHeight: '34rpx' }}>
                <>
                  {remarkTitle}
                  {remarExplan}
                </>
              </Text>
            </View>
          </View>
        )}
      </View>
      <View className={styles.arrowBox}>
        <Image src={Res.arrow16x16} style={{ height: '32rpx', width: '32rpx' }} />
      </View>
    </View>
  );
};

export default DataModule;
