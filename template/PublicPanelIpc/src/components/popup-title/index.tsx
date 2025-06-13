import React from 'react';
import { Text, View } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectPanelInfoByKey } from '@/redux/modules/panelInfoSlice';
import clsx from 'clsx';
import { IconFont } from '@/components/icon-font';
import { changePanelInfoState } from '@/utils';
import Styles from './index.module.less';

type IconFontProps = React.ComponentProps<typeof IconFont>;

interface IProps {
  title: string;
  rightBtn?: React.ReactNode;
  rightStyle?: React.CSSProperties;
  onRightBtn?: () => void;
  onClose?: () => void;
  leftIcon?: IconFontProps['icon'];
  leftIconStyle?: React.CSSProperties;
}

export const PopupTitle: React.FC<IProps> = (props: IProps) => {
  const {
    title,
    rightBtn,
    rightStyle,
    onRightBtn,
    onClose: propsOnClose,
    leftIcon = 'close',
    leftIconStyle,
  } = props;

  const { popupData } = useSelector(selectPanelInfoByKey('showSmartPopup'));

  const onCurRightBtn = () => {
    onRightBtn && onRightBtn();
  };

  const onClose = () => {
    if (typeof propsOnClose === 'function') {
      propsOnClose();
      return;
    }
    changePanelInfoState('showSmartPopup', { status: false, popupData, title: null });
  };

  return (
    <View className={clsx(Styles.comContainer)}>
      <View className={Styles.comContainer_title}>
        <Text className={Styles.title}>{title}</Text>
      </View>

      <View className={clsx(Styles.comContainer_leftBtn)} onClick={onClose}>
        <IconFont style={leftIconStyle} icon={leftIcon} otherClassName={Styles.popIcon} />
      </View>
      {rightBtn && (
        <View className={Styles.comContainer_rightBtn} style={rightStyle} onClick={onCurRightBtn}>
          {rightBtn}
        </View>
      )}
    </View>
  );
};
