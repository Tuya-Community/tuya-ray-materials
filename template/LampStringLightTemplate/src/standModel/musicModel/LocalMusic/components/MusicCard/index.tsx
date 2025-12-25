import React from 'react';
import MusicCard1 from './MusicCard_1';

import { TMusicData } from '../../types';

type TProps = {
  type?: number;
  style?: React.CSSProperties;
  data: TMusicData;
  isActive: boolean; // 是否选中
  onClick: () => void;
};

const MusicCard = (props: TProps) => {
  const { type = 1 } = props;
  switch (type) {
    case 1:
      return <MusicCard1 {...props} />;
    default:
      return <MusicCard1 {...props} />;
  }
};

export default MusicCard;
