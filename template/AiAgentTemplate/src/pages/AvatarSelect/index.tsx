import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, router, location, showToast, navigateBack } from '@ray-js/ray';
import { TopBar, TouchableOpacity, NoData } from '@/components';
import Strings from '@/i18n';
import { getAIAvatars } from '@/api/index_highway';
import { updateRoleInfo } from '@/redux/modules/roleInfoSlice';
import store from '../../redux';
import styles from './index.module.less';

interface RouterSource {
  agentId: string;
}
const AvatarSelect: FC = () => {
  const { dispatch } = store;
  const routerSource = location.query as RouterSource;
  const [avatarList, setAvatarList] = useState([]);
  const { templateRoleId } = routerSource;

  const getBoundAgentsFunc = async () => {
    getAIAvatars()
      .then(res => {
        console.log('getAIAvatars::', res);
        setAvatarList(res);
      })
      .catch(err => {
        console.log('getAIAvatars::err::', err);
      });
  };

  useEffect(() => {
    getBoundAgentsFunc();
  }, []);

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      dispatch(updateRoleInfo({ roleImgUrl: avatarUrl, roleTemplateId: templateRoleId }));
      navigateBack({});
    } catch (error) {
      showToast({
        title: Strings.getLang('save_failed'),
        icon: 'error',
      });
    }
  };

  return (
    <View className={styles.view}>
      <TopBar title={Strings.getLang('select_avatar')} backgroundColor="#daecf6" />

      <View className={styles.content}>
        {avatarList?.length > 0 ? (
          <View className={styles.gridContainer}>
            {avatarList?.map((avatar, index) => (
              <TouchableOpacity
                key={avatar.avatarId || index}
                className={styles.avatarItem}
                onClick={() => handleSelectAvatar(avatar.url)}
              >
                <Image src={avatar.url} className={styles.avatarImage} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className={styles.noDataBox}>
            <NoData
              tip={Strings.getLang('no_data')}
              style={{ marginTop: '40rpx', marginBottom: '350rpx' }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AvatarSelect;
