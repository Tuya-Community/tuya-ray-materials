import React from 'react';
import clsx from 'clsx';
import { Text, View, Image } from '@ray-js/components';
import Res from '@/res';
import styles from './index.module.less';

const prefix = 'list';

interface ListProps {
  dataSource: ListItem[];
  className?: string;
}

interface ListItem {
  key: string | number;
  image?: string;
  title?: string;
  disabled?: boolean;
  isShowArrow?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  render?: () => React.ReactNode;
}

const List: React.FC<ListProps> = ({ dataSource, className }) => {
  const renderItem = ({
    key,
    image,
    title,
    isShowArrow,
    disabled,
    onClick,
    children,
    render,
  }: ListItem) => {
    const handleClick = () => {
      if (disabled) return;
      typeof onClick === 'function' && onClick();
    };

    if (render) {
      return render();
    }

    return (
      <View
        key={key}
        onClick={handleClick}
        className={clsx(
          styles[`${prefix}-item-container`],
          disabled && styles[`${prefix}-disabled-item`]
        )}
      >
        <View className={styles[`${prefix}-item-left`]}>
          {image && (
            <Image src={image} className={styles[`${prefix}-item-image`]} mode="aspectFit" />
          )}
          {title && <Text className={styles[`${prefix}-item-title`]}>{title}</Text>}
        </View>
        {React.isValidElement(children) ? (
          children
        ) : isShowArrow ? (
          <Image src={Res.arrow} mode="aspectFit" className={styles[`${prefix}-arrow`]} />
        ) : null}
      </View>
    );
  };

  return <View className={clsx(styles[`${prefix}`], className)}>{dataSource.map(renderItem)}</View>;
};

List.defaultProps = {
  className: '',
};

export default List;
