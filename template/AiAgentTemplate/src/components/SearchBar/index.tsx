import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { View, Image, Text } from '@ray-js/ray';
import Input from '@ray-js/components-ty-input';
import { TouchableOpacity } from '@/components';
import { imgSearchIcon2 } from '@/res';
import Strings from '@/i18n';
import styles from './index.module.less';
import { getTheme } from '@/utils';

interface Props {
  defaultText?: string;
  disable?: boolean;
  outerSearchText?: string;
  containerStyle?: CSSProperties;
  onPressSearch: () => void;
  editSearchText?: ((str: string) => void) | null;
}

const SearchBar: FC<Props> = ({
  disable,
  defaultText,
  outerSearchText = '',
  containerStyle,
  onPressSearch,
  editSearchText,
}) => {
  const [themeColor, setThemeColor] = useState(getTheme());
  const [searchText, setSearchText] = useState(outerSearchText);

  useEffect(() => {
    setSearchText(outerSearchText);
  }, [outerSearchText]);

  const onChangeTextFunc = (text: string) => {
    editSearchText && editSearchText(text);
    setSearchText(text);
  };
  return (
    <View className={styles.container} style={containerStyle}>
      <Image src={imgSearchIcon2} className={styles.searchIcon} />
      <Input
        wrapStyle={{ flex: 1 }}
        className={styles.input}
        placeholder={defaultText ?? Strings.getLang('searchTips')}
        placeholderStyle={{ fontSize: '28rpx', color: '#C5C5C5' }}
        value={searchText}
        // @ts-ignore
        onInput={e => onChangeTextFunc(e.value)}
        onConfirm={onPressSearch}
        disabled={disable}
      />
      <TouchableOpacity className={styles.searchBtn} onClick={onPressSearch} disabled={disable}>
        <View className={styles.verticalLine} style={{
          backgroundColor: themeColor
        }} />
        <Text className={styles.searchText} style={{
          color: themeColor
        }}>{Strings.getLang('search')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
