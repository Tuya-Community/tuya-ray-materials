import React, { FC, useState } from 'react';
import { ScrollView, View, Image } from '@ray-js/ray';
import { TouchableOpacity } from '@/components';
import clsx from 'clsx';
import styles from './index.module.less';
import { icons, imgAvatarPlus } from '@/res';
import { Icon } from '@ray-js/svg';
import { getTheme } from '@/utils';

interface TagsItem {
  roleId: string;
  roleName: string;
  roleIcon: string;
}

interface Props {
  tags: Array<TagsItem>;
  value?: string;
  className?: string;
  isCenter?: boolean;
  roleInfo?: any,
  onClick?: (roleId: string, isChecked: boolean) => void;
}

const AvatarBar: FC<Props> = ({
  tags,
  value,
  className,
  isCenter,
  roleInfo,
  onClick,
}) => {
  const [themeColor, setThemeColor] = useState(getTheme());
  const taglist = [...tags];
  if (isCenter && tags[0].roleId !== 'none') {
    taglist.unshift({roleId: 'none', roleIcon: 'none', roleName: 'none'});
  }
  
  if (taglist.length > 3) {
    return (
      <ScrollView
        scrollX
        className={clsx(styles.scroll, className)}
        scrollWithAnimation
      >
        {taglist?.map((tag) => {  
          const { roleId, roleIcon } = tag;
          const { roleTemplateId, roleImgUrl} = roleInfo;
          if (roleId === 'none') { 
            return <View key={roleId} className={styles.none}/>;
          } else {
            const isCurrent = value === roleId;
            return (
              <TouchableOpacity key={roleId} className={styles.avatarBox} onClick={() => onClick(roleId, isCurrent)}>
                <Image src={(isCurrent && roleTemplateId === roleId) ? roleImgUrl : roleIcon} className={isCurrent ? styles.avatarChecked : styles.avatar } />
                {isCurrent && 
                  <View  className={styles.avatarPlus} style={{ backgroundColor: themeColor}} >
                    <Icon d={icons.plus} color={"#FFFFFF"} />
                  </View>
                }
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    );
  }

  return (
    <View
      className={clsx(styles.scroll, className)}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {taglist?.map((tag) => {  
        const { roleId, roleIcon } = tag;
        const { roleTemplateId, roleImgUrl} = roleInfo;
        if (roleId === 'none') { 
          return <View key={roleId} className={styles.none}/>;
        } else {
          const isCurrent = value === roleId;
          return (
            <TouchableOpacity key={roleId} className={styles.avatarBox} onClick={() => onClick(roleId, isCurrent)}>
              <Image src={(isCurrent && roleTemplateId === roleId) ? roleImgUrl : roleIcon} className={isCurrent ? styles.avatarChecked : styles.avatar } />
              {isCurrent && <Image src={imgAvatarPlus} className={styles.avatarPlus} />}
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );  
};

export default AvatarBar;
