import { navigateBack, showModal, View } from '@ray-js/ray';

import { TopBar } from '@/components';
import Strings from '@/i18n';
import { deleteRecord } from '@/redux/action';
import Res from '@/res';
import { getThemeColor } from '@/utils';
import styles from './index.module.less';

interface Props {
  title: string;
  uuid: string;
}

const EditDataTopBar = ({ title, uuid }: Props) => {
  const themeColor = getThemeColor();

  const handleDelete = () => {
    showModal({
      title: '',
      content: Strings.getLang('dsc_deleteDtaTips'),
      cancelText: Strings.getLang('dsc_cancel'),
      confirmText: Strings.getLang('dsc_confirm'),
      confirmColor: themeColor,
      success: async ({ confirm, cancel }) => {
        if (confirm) {
          if (uuid) {
            await deleteRecord(uuid);
          }
          navigateBack();
        }
      },
    });
  };

  const right = () => (
    <View
      className={styles.deleteIcon}
      style={{ WebkitMaskImage: `url(${Res.deletUser})` }}
      onClick={handleDelete}
    />
  );

  return <TopBar right={right()} title={title} />;
};

export default EditDataTopBar;
