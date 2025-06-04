import React, { FC, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import BeforeRecord from './BeforeRecord';
import AfterRecord from './AfterRecord';

type Props = {
  onHide: () => void;
};

const AddVoice: FC<Props> = ({ onHide }) => {
  const [recorded, setRecorded] = useState(false);
  const [file, setFile] = useState<string>();

  const handleRecorded = (newFile: string) => {
    setFile(newFile);
    setRecorded(true);
  };

  const handleRetry = () => {
    setFile(undefined);
    setRecorded(false);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View hoverClassName="touchable" onClick={onHide}>
          <Text className={styles.text}>{Strings.getLang('dsc_cancel')}</Text>
        </View>
        <Text className={styles.title}>
          {recorded ? Strings.getLang('dsc_audio_done') : Strings.getLang('dsc_add_audio')}
        </Text>
        <View style={{ opacity: 0 }}>
          <Text className={styles.text}>{Strings.getLang('dsc_cancel')}</Text>
        </View>
      </View>

      {recorded ? (
        <AfterRecord file={file} onRetry={handleRetry} onSave={onHide} />
      ) : (
        <BeforeRecord onRecorded={handleRecorded} />
      )}
    </View>
  );
};

export default AddVoice;
