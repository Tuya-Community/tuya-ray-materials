import React, { FC } from 'react';
import { View, Text, Button, Image } from '@ray-js/components';
import { BottomSheet } from '@ray-js/smart-ui';
import res from '@/res';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import styles from './index.module.less';

interface Props {
  show: boolean;
  onClose: () => void;
  onAdd?: () => void;
  onLater?: () => void;
}

const AddToHomePopup: FC<Props> = ({ show, onClose, onAdd, onLater }) => {
  const { homeName } = useSelector(state => state.homeInfo);

  const handleAdd = () => {
    onAdd?.();
    onClose();
  };

  const handleLater = () => {
    onLater?.();
    onClose();
  };

  return (
    <BottomSheet
      customClass={styles.bottomSheet}
      show={show}
      round
      draggable
      closeOnClickOverlay
      onClose={onClose}
      midDragHeight={420}
      minDragHeight={420}
      maxDragHeight={420}
      closeDragHeight={420}
    >
      <View className={styles.container}>
        <View className={styles.previewContainer}>
          <View className={styles.phoneMockup}>
            <View className={styles.phoneScreen}>
              <Text className={styles.appTitle}>{homeName}</Text>
              <View className={styles.homeContainer}>
                <View className={styles.homeContainerItem} />
                <View className={styles.homeContainerItem} />
                <View className={styles.homeContainerItem} />
              </View>
              <View className={styles.aiNoteSection}>
                <View className={styles.aiNoteHeader}>
                  <View className={styles.aiNoteHeaderLeft}>
                    <Image className={styles.micIcon} src={res.addHomeIcon} />
                  </View>
                  <View className={styles.aiNoteHeaderRight}>
                    <Text className={styles.aiNoteTitle}>{Strings.getLang('aiEarPhone')}</Text>
                    <Text className={styles.aiNoteDesc}>
                      {Strings.getLang('addToHomePopup_subDesc')}
                    </Text>
                  </View>
                </View>
                <View className={styles.cardsContainer}>
                  <View className={styles.card}>
                    <Image className={styles.cardIcon} src={res.addHomeLiveRecordingIcon} />
                    <Text className={styles.cardSubText}>
                      {Strings.getLang('mode_title_meeting_recording')}
                    </Text>
                  </View>
                  <View className={styles.card}>
                    <Image className={styles.cardIcon} src={res.addHomeRealTimeIcon} />
                    <Text className={styles.cardSubText}>
                      {Strings.getLang('mode_title_live_trans')}
                    </Text>
                  </View>
                </View>
                <View className={styles.ellipseContainer}>
                  <View className={styles.ellipseActive} />
                  <View className={styles.ellipse} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.titleContainer}>
          <Text className={styles.title}>{Strings.getLang('addToHomePopup_title')}</Text>
        </View>

        <View className={styles.descContainer}>
          <Text className={styles.desc}>{Strings.getLang('addToHomePopup_desc')}</Text>
        </View>

        <View className={styles.buttonContainer}>
          <Button className={styles.addButton} onClick={handleAdd}>
            <Text className={styles.addButtonText}>
              {Strings.getLang('addToHomePopup_addButton')}
            </Text>
          </Button>
          <Button className={styles.laterButton} onClick={handleLater}>
            <Text className={styles.laterButtonText}>
              {Strings.getLang('addToHomePopup_laterButton')}
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

export default AddToHomePopup;
