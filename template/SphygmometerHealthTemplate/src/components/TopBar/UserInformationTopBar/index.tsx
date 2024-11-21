import { FC } from 'react';
import { router, showModal, View } from '@ray-js/ray';

import { TopBar } from '@/components';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { deleteUser } from '@/redux/action';
import Res from '@/res';
import { checkDpExist, getThemeColor } from '@/utils';
import styles from './index.module.less';

interface Props {
  title: string;
  userId: string;
  type: string;
}

const UserInformationTopBar: FC<Props> = ({ title, userId, type }) => {
  const { userSetCode } = dpCodes;
  const themeColor = getThemeColor();
  const ishaveUserSet = checkDpExist(userSetCode);

  const targetUserInfo = useSelector(({ uiState }) =>
    uiState.userList?.find(it => it.id === userId)
  );

  const handleDelete = () => {
    showModal({
      title: '',
      content: Strings.getLang('dsc_deleteTips'),
      cancelText: Strings.getLang('dsc_cancel'),
      confirmText: Strings.getLang('dsc_confirm'),
      confirmColor: themeColor,
      success: ({ confirm, cancel }) => {
        if (confirm) {
          deleteUser(userId);
          router.back();
        }
      },
    });
  };

  const right = () =>
    !ishaveUserSet && type === 'edit' && targetUserInfo?.userType !== 1 ? (
      <View
        className={styles.icon}
        style={{ WebkitMaskImage: `url(${Res.deletUser})` }}
        onClick={handleDelete}
      />
    ) : (
      <View />
    );

  return <TopBar right={right()} theme="dark" title={title} />;
};

export default UserInformationTopBar;
