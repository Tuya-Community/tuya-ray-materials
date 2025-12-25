import React from 'react';
import { Image, Text } from '@ray-js/ray';
import styles from './index.module.less';
import { Button } from '../../Button';
import { TMusicData } from '../../../types';

type Props = {
  style?: React.CSSProperties;
  data: TMusicData;
  isActive: boolean;
  onClick: () => void;
};

export const MusicCard = (props: Props) => {
  const { data, style, isActive, onClick } = props;
  const active = isActive ? styles.active : '';
  return (
    <Button onClick={onClick} className={`${styles.container} ${active}`} style={{ ...style }}>
      <Text className={styles.title}>{data.musicName}</Text>
      <Image className={styles.icon} src={data.musicIconUrl} />
    </Button>
  );
};

export default MusicCard;
