import React, { useState } from 'react';
import { Cell, CellGroup, NavBar } from '@ray-js/smart-ui';
import { router, View } from 'ray';
import Strings from '@/i18n';
import styles from './index.module.less';
import { Enum, EnumPopup } from './Enum';

export function More() {
  const [enumDpCode, setEnumDpCode] = useState('');
  const [enumShow, setEnumShow] = useState(false);

  const handleEnumClick = dpCode => {
    setEnumDpCode(dpCode);
    setEnumShow(true);
  };

  return (
    <View className={styles.container}>
      <NavBar leftArrow title={Strings.getLang('more')} onClickLeft={router.back} />

      <CellGroup inset customClass={styles.cellGroup}>
        <Enum dpCode="suction" onClick={handleEnumClick} />
        <Enum dpCode="water_control" onClick={handleEnumClick} />
      </CellGroup>

      <CellGroup inset customClass={styles.cellGroup}>
        <Cell
          title={Strings.getDpLang('clean_record')}
          isLink
          onClick={() => {
            router.push('/record');
          }}
        />
      </CellGroup>

      <EnumPopup
        dpCode={enumDpCode}
        show={enumShow}
        onHide={() => {
          setEnumShow(false);
        }}
      />
    </View>
  );
}

export default More;
