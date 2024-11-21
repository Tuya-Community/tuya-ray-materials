import { CoverView, View } from '@ray-js/ray';
import React from 'react';
import DrawMap from '../DrawMap';
import EmptyMap from '../EmptyMap';
import styles from './index.module.less';

type Props = {
  showLoading?: boolean | undefined;
  isLoading?: boolean;
  mapLoadEnd?: boolean;
  isEmpty?: boolean;
  isLite?: boolean; // 小菊花模式
  isHomeMap?: boolean; // 首页实时地图
};
const Loading: React.FC<Props> = ({ isLite, isLoading, isHomeMap, mapLoadEnd, isEmpty }) => {
  const Wrapper = isHomeMap ? CoverView : View;
  const renderLite = () => {
    if (!isEmpty && mapLoadEnd) return null;
    return <Wrapper className={styles.loading} />;
  };

  const renderLoading = () => {
    if (isLoading) {
      return (
        <Wrapper className={styles.loading}>
          <DrawMap isHomeMap={isHomeMap} />
        </Wrapper>
      );
    }
    if (isEmpty) {
      return (
        <Wrapper className={styles.loading}>
          <EmptyMap isHomeMap={isHomeMap} />
        </Wrapper>
      );
    }
    if (!mapLoadEnd) {
      return (
        <Wrapper className={styles.loading}>
          <DrawMap isHomeMap={isHomeMap} />
        </Wrapper>
      );
    }
    return null;
  };

  return isLite ? renderLite() : renderLoading();
};

export default Loading;
