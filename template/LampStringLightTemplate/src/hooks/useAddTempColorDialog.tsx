import Strings from '@/i18n';
import { Dialog } from '@ray-js/smart-ui';
import { hideLoading, Input, showLoading, Text, View, router } from '@ray-js/ray';
import { CLOUD_KEY_MYTEMPCOLORS } from '@/constant';
import React, { useState } from 'react';
import { getArray } from '@/utils/kit';
import { useCloudStorageList } from './useCloudStorageList';
import { parseTempColorItem } from './useTempColorList';

export interface UseAddTempColorDialogOps {
  temp: number;
  onSave(): void;
  onDuplicated?(): void;
}

export const useAddTempColorDialog = ({ temp, onSave, onDuplicated }: UseAddTempColorDialogOps) => {
  const storage = useCloudStorageList(CLOUD_KEY_MYTEMPCOLORS);

  const [name, setName] = useState<string>();
  const [show, setShow] = useState(false);

  const saveName = async (name: string, temp: number) => {
    const list = await storage.refresh();
    const hasItem = getArray(list)
      .map(parseTempColorItem)
      .find(item => item.temp === temp);

    if (hasItem) {
      onDuplicated && onDuplicated();
      return;
    }

    showLoading({ title: '', mask: true });
    await storage.addItem(`${name}_${temp}`);
    hideLoading();
    onSave();
    setShow(false);
    router.back();
  };

  return {
    modal: (
      <Dialog
        useSlot
        title={Strings.getLang('sceneName')}
        showCancelButton
        showConfirmButton
        confirmButtonText={Strings.getLang('save')}
        cancelButtonText={Strings.getLang('cancel')}
        show={show}
        onClose={() => setShow(false)}
        onConfirm={() => {
          if (name) {
            saveName(name, temp);
          }
        }}
      >
        <Input
          style={{
            paddingLeft: '24px',
          }}
          value={name}
          // @ts-ignore
          onInput={e => setName(e.value)}
        />
      </Dialog>
    ),
    setShow,
  };
};
