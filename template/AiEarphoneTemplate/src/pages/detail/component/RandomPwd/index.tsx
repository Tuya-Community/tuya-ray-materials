import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import { CellGroup, Cell, Switch } from '@ray-js/smart-ui';
import { randomPwd } from '@/utils/randomPwd';
import { tttSetClipboardData } from '@/api/ttt';
import Strings from '@/i18n';
import Res from '@/res';

import styles from './index.module.less';

interface Props {
  password: string;
  setPassword: (password: string) => void;
}

const RandomPwd = ({ password, setPassword }: Props) => {
  const [enablePassword, setEnablePassword] = useState(false);
  const userClosedRef = useRef(false); // 标记用户是否主动关闭过开关

  const handleEnablePasswordChange = e => {
    const val = e?.detail;
    setEnablePassword(val);

    if (!val) {
      // 用户主动关闭开关
      userClosedRef.current = true;
      setPassword('');
    } else {
      // 用户主动开启开关
      userClosedRef.current = false;
      if (!password) {
        setPassword(randomPwd());
      }
    }
  };

  const handleRefreshPwd = () => {
    setPassword(randomPwd());
  };

  // 复制链接
  const handlePwd = useCallback(async () => {
    if (!password) return;
    try {
      await tttSetClipboardData(password);
      ty.showToast({
        title: Strings.getLang('share_modal_copy_success_toast'),
        icon: 'success',
      });
    } catch (error) {
      console.error('复制失败', error);
    }
  }, [password]);

  // 根据 password 的变化自动设置 enablePassword
  useEffect(() => {
    if (password) {
      // 有密码时，如果用户没有主动关闭过，就开启开关
      if (!userClosedRef.current) {
        setEnablePassword(true);
      }
    } else {
      // 没有密码时，关闭开关（但不标记为用户主动关闭）
      setEnablePassword(false);
    }
  }, [password]);

  return (
    <CellGroup border={false} inset insetBorderRadius={12} customClass={styles.passwordCellGroup}>
      <Cell title={Strings.getLang('share_link_modal_password')} border={false}>
        <Switch checked={enablePassword} onChange={handleEnablePasswordChange} />
      </Cell>
      {enablePassword && (
        <Cell
          border={false}
          slot={{
            title: (
              <View className={styles.pwdItem}>
                <Text className={styles.pwdText}>{password}</Text>
                <Image
                  className={styles.refreshPwdIcon}
                  src={Res.refreshPwdIcon}
                  onClick={handleRefreshPwd}
                />
              </View>
            ),
          }}
        >
          <Text className={styles.blueText} onClick={handlePwd}>
            {Strings.getLang('web_version_copy_btn')}
          </Text>
        </Cell>
      )}
    </CellGroup>
  );
};

export default RandomPwd;
