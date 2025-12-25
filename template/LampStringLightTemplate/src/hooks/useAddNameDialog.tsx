import React, { useEffect, useState } from 'react';

import Strings from '@/i18n';
import { Dialog } from '@ray-js/smart-ui';
import { Input, Text, View } from '@ray-js/ray';

export interface UseAddNameDialogOps {
  title: string;
  onSave(name: string): void;
  getDefaultName?: () => Promise<string>;
}

export const useAddNameDialog = ({ onSave, title, getDefaultName }: UseAddNameDialogOps) => {
  const [name, setName] = useState<string>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      getDefaultName().then(setName);
    }
  }, [show]);

  return {
    modal: (
      <Dialog
        useSlot
        showCancelButton
        showConfirmButton
        confirmButtonText={Strings.getLang('save')}
        cancelButtonText={Strings.getLang('cancel')}
        show={show}
        title={title}
        onCancel={() => setShow(false)}
        onConfirm={() => {
          if (name) {
            onSave(name);
          }
        }}
      >
        <Input
          style={{
            paddingLeft: '24px',
          }}
          value={name}
          onInput={e => setName(e.value)}
        />
      </Dialog>
    ),
    setShow,
  };
};
