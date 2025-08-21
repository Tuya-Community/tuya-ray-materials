/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';

interface IProps {
  id?: string;
  img?: string;
  style?: any;
  text?: string;
  disabled?: boolean;
  className?: any;
  imgClassName?: any;
  textClassName?: any;
  onClick: () => void;
  children?: any;
  opacity?: number;
}
const Button = (props: IProps) => {
  const {
    img,
    id,
    text,
    disabled = false,
    className,
    style,
    children,
    imgClassName,
    textClassName,
    opacity = 0.5,
    onClick,
  } = props;
  const [click, setClick] = useState(false);
  useEffect(() => {
    if (click) {
      setTimeout(() => {
        setClick(false);
      }, 300);
    }
  }, [click]);
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick();
  };
  return (
    <View
      id={id}
      className={className}
      style={{ ...style, opacity: click ? opacity : 1 }}
      // @ts-ignore
      onTouchStart={() => !disabled && setClick(true)}
      onTouchEnd={() => !disabled && setClick(false)}
      onClick={e => {
        e.origin.stopPropagation();
        handleClick();
      }}
    >
      {img && <img src={img} className={imgClassName} alt="" />}
      {text && <Text className={textClassName}>{text}</Text>}
      {children}
    </View>
  );
};
export default Button;
