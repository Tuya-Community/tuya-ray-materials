import React, { FC, createContext, useState } from 'react';
import { Image, Text, View, showLoading, hideLoading, showToast } from '@ray-js/ray';
import { imgVoicePlaceholder } from '@/res';
import { Dialog, DialogInstance, Popup } from '@ray-js/smart-ui';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAudios, selectAudiosTotal } from '@/redux/modules/audiosSlice';
import { AppDispatch } from '@/redux';
import { authorizeRecord } from '@/utils';
import Strings from '@/i18n';

import styles from './index.module.less';
import Content from './Content';
import AddVoice from './AddVoice';

type Props = {
  ready: boolean;
  onClose: () => void;
};

export const VoiceContext = createContext<{
  edit: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}>(null);

const Voices: FC<Props> = ({ ready, onClose }) => {
  const dispatch = useDispatch();
  const audiosTotal = useSelector(selectAudiosTotal);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleAddVoice = async () => {
    try {
      await authorizeRecord();
      setShowAddPopup(true);
    } catch (err) {
      DialogInstance.alert({
        context: this,
        title: '语音需要使用麦克风',
        message: '请在“设置-隐私-麦克风”中开启App权限',
        confirmButtonText: '知道了',
        selector: '#smart-dialog-voice',
      });
    }
  };

  const handleEdit = async () => {
    if (audiosTotal === 0) return;
    if (edit) {
      try {
        if (selectedIds.length !== 0) {
          showLoading({
            title: '',
          });

          await (dispatch as AppDispatch)(deleteAudios(selectedIds)).unwrap();
        }
        setEdit(false);
        setSelectedIds([]);
      } catch (err) {
        showToast({
          title: Strings.getLang('dsc_delete_failed'),
          icon: 'fail',
        });
      } finally {
        hideLoading();
      }
    } else {
      setEdit(true);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View hoverClassName="touchable" onClick={onClose}>
          <Text className={styles.done}>{Strings.getLang('dsc_cancel')}</Text>
        </View>
        <Text className={styles.title}>{Strings.getLang('dsc_audio_file')}</Text>
        <View
          hoverClassName="touchable"
          onClick={handleEdit}
          style={{
            opacity: audiosTotal > 0 ? 1 : 0,
          }}
        >
          <Text className={styles.done}>
            {edit ? Strings.getLang('dsc_done') : Strings.getLang('dsc_delete')}
          </Text>
        </View>
      </View>
      {audiosTotal === 0 ? (
        <View className={styles.empty}>
          <Image src={imgVoicePlaceholder} className={styles.img} />
        </View>
      ) : (
        <VoiceContext.Provider value={{ edit, selectedIds, setSelectedIds }}>
          <Content ready={ready} />
        </VoiceContext.Provider>
      )}
      <View className={styles.addBtn} hoverClassName="touchable" onClick={handleAddVoice}>
        <Text className={styles.text}>{Strings.getLang('dsc_add')}</Text>
      </View>

      <Popup
        show={showAddPopup}
        position="bottom"
        round
        safeAreaInsetBottom={false}
        customStyle={{ height: '600rpx', marginBottom: 0 }}
        onClickOverlay={() => setShowAddPopup(false)}
        onClose={() => setShowAddPopup(false)}
      >
        {showAddPopup && <AddVoice onHide={() => setShowAddPopup(false)} />}
      </Popup>

      <Dialog id="smart-dialog-voice" />
    </View>
  );
};

export default Voices;
