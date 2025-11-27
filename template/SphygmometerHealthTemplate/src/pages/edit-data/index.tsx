import { router, ScrollView, showToast, View } from '@ray-js/ray';
import { Button, Field } from '@ray-js/smart-ui';
import moment from 'moment';
import { FC, useState } from 'react';

import { ColorBar, PageWrapper, Text, TouchableOpacity, WHOTable } from '@/components';
import EditDataTopBar from '@/components/TopBar/EditDataTopBar';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { addRemark, getFiltedDataList } from '@/redux/action';
import styles from './index.module.less';

const { systolicBpCode, diastolicBpCode, pulseCode } = dpCodes;
type ITEM = 'sys' | 'dia' | 'pulse';

const bpUnit = {
  sys: {
    title: Strings.getDpLang(systolicBpCode),
    unit: Strings.getLang('dsc_sysUnit'),
  },
  dia: {
    title: Strings.getDpLang(diastolicBpCode),
    unit: Strings.getLang('dsc_diaUnit'),
  },
  pulse: {
    title: Strings.getDpLang(pulseCode),
    unit: Strings.getLang('dsc_pulUnit'),
  },
};
const bpMapSource = ['sys', 'dia', 'pulse'];

interface Props {
  location: { query: Record<string, any> };
}

const EditData: FC<Props> = props => {
  const [loading, setLoading] = useState(false);
  const type = useSelector(({ uiState }) => uiState.type);
  const filterBp = useSelector(({ uiState }) => uiState.filterBp);
  const filterRemark = useSelector(({ uiState }) => uiState.filterRemark);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  const singleData: any = props.location.query || {};

  console.log('===', singleData);

  const [remarkText, setRemarkText] = useState(singleData.remark);

  const onPressComfirm = async () => {
    setLoading(true);
    try {
      await addRemark(singleData?.uuid ?? '', remarkText);
      await getFiltedDataList(0, true, filterBp, filterRemark, type);
    } catch (error) {
      console.error('Error adding remark:', error);
    }

    setLoading(false);
    router.back();
  };

  return (
    <>
      <EditDataTopBar title={Strings.getLang('dsc_dataDetail')} uuid={singleData?.uuid} />
      <PageWrapper>
        <ScrollView scrollY className={styles.content}>
          <View className={styles.subContainer}>
            <View className={styles.dataBox}>
              <Text className={styles.timer}>
                {moment(Number(singleData.time)).format('YYYY.MM.DD')}
              </Text>
              <View className={styles.threeValueBox}>
                {bpMapSource.map((item: ITEM) => (
                  <View className={styles.itemBox} key={item}>
                    <Text className={styles.title} numberOfLines={1}>
                      {bpUnit[item].title}
                    </Text>
                    <Text className={styles.unit} numberOfLines={1}>
                      {bpUnit[item].unit}
                    </Text>
                    <Text className={styles.value} numberOfLines={1}>
                      {singleData[item]}
                    </Text>
                  </View>
                ))}
              </View>
              <ColorBar type={singleData?.bpLevel} />
            </View>
            <TouchableOpacity activeOpacity={0.9} className={styles.WHOTableBox}>
              <WHOTable />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} className={styles.addRemarkBox}>
              <Text className={styles.titleText}>{Strings.getLang('dsc_remark')}</Text>
              <Field
                border={false}
                center={false}
                className={styles.remarkText}
                maxlength={60}
                placeholder={Strings.getLang('dsc_remarkFormat1')}
                value={remarkText}
                onChange={({ detail }) => {
                  if (detail.length === 60) {
                    showToast({ title: Strings.getLang('dsc_remarkDefault') });
                  }
                  setRemarkText(detail);
                }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </PageWrapper>
      <View className={styles.bottomButtonBg}>
        <Button
          round
          color={themeColor}
          loading={loading}
          size="large"
          type="primary"
          onClick={onPressComfirm}
        >
          {Strings.getLang('dsc_confirm')}
        </Button>
      </View>
    </>
  );
};

export default EditData;
