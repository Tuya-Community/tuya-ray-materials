import React, { useEffect, useState } from 'react';

import { TopBar } from '@/components';
import { InputNameCard } from '@/components/input-name-card';
import { useAddTempColorDialog } from '@/hooks/useAddTempColorDialog';
import { useTempColorList } from '@/hooks/useTempColorList';
import Strings from '@/i18n';
import res from '@/res';
import { getDataId, isDataId } from '@/utils/getDataId';
import { getArray } from '@/utils/kit';
import { showConfirmBackModal } from '@/utils/showConfirmModal';
import WhitePicker from '@ray-js/lamp-circle-picker';
import { useToast } from '@/hooks/useToast';
import { Image, router, Text, useQuery, View } from '@ray-js/ray';

import styles from './index.module.less';

export interface AddTempPageProps {}

const AddTempPage: React.FC<AddTempPageProps> = ({}) => {
  const [value, onChange] = useState(0);
  const [name, setName] = useState('');

  const query = useQuery();
  const dataId = getDataId(query?.dataId);

  const { list, updateItem } = useTempColorList();
  const TipApi = useToast();

  useEffect(() => {
    const item = getArray(list).find(item => +item.id === +dataId);
    if (item) {
      onChange(item.temp);
      setName(item.name);
    }
  }, [list, dataId]);

  const api = useAddTempColorDialog({
    temp: value,
    onSave() {
      router.back();
    },
    onDuplicated() {
      TipApi.show({
        show: true,
        content: Strings.getLang('temp_dedup'),
      });
    },
  });

  return (
    <View className={styles.contain}>
      <TopBar
        isShowMenu={false}
        isShowLeft
        titleClassName={styles.title}
        cancelClassName={styles.cancel}
        title={Strings.getLang('add_color')}
        leftText={Strings.getLang('cancel')}
        disableLeftBack
        onLeftClick={showConfirmBackModal}
      />
      <View className={styles.content}>
        <View className={styles.inputWrap}>
          {isDataId(dataId) && <InputNameCard value={name} onChange={setName} />}
        </View>
        {/* picker */}
        <View className={styles.pickerWrap}>
          <WhitePicker desc={Strings.getLang('temperature')} value={value} onTouchEnd={onChange} />
        </View>
        {/* save */}
        <View className={styles.bottom}>
          <View
            className={styles.bottomBtn}
            onClick={async () => {
              if (isDataId(dataId)) {
                await updateItem(dataId, {
                  name,
                  temp: value,
                });
                router.back();
              } else {
                api.setShow(true);
              }
            }}
          >
            <Image src={res.save_icon} className={styles.bottomImg} />
            <Text className={styles.bottomText}>{Strings.getLang('save')}</Text>
          </View>
        </View>
      </View>
      {api.modal}
      {TipApi.modal}
    </View>
  );
};

export default AddTempPage;
