import React, { FC } from 'react';
import { Text } from '@ray-js/ray';
import { Grid, GridItem } from '@ray-js/smart-ui';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { useSelector } from 'react-redux';
import { selectCleanRecordsTotal } from '@/redux/modules/cleanRecordsSlice';

import styles from './index.module.less';

const Item: FC<{
  dpCode: string;
  value?: number;
}> = ({ dpCode, value }) => {
  const dpValue = useProps(props => props[dpCode]);
  return (
    <GridItem useSlot>
      <Text
        style={{
          fontSize: '40rpx',
          fontWeight: '700',
          marginBottom: '16rpx',
        }}
      >
        {value ?? dpValue}
      </Text>
      <Text style={{ textAlign: 'center', fontSize: '24rpx', color: 'rgba(0, 0, 0, 0.5)' }}>
        {Strings.getDpLang(dpCode)}({Strings.getDpLang(dpCode, 'unit')})
      </Text>
    </GridItem>
  );
};
const Header = () => {
  const cleanTimesTotal = useSelector(selectCleanRecordsTotal);

  return (
    <>
      <Grid columnNum={3} border={false} customClass={styles.grid}>
        <Item dpCode="clean_time_total" />
        <Item dpCode="clean_area_total" />
        <Item dpCode="clean_count_total" value={cleanTimesTotal} />
      </Grid>
    </>
  );
};

export default Header;
