import Strings from '@/i18n';
import Res from '@/res';
import { Button, Image, Input, Text, View } from '@ray-js/ray';
import React, { FC, useEffect, useState } from 'react';
import { Popup } from '@ray-js/smart-ui';
import { stringToByte } from '@ray-js/robot-protocol';
import { THEME_COLOR } from '@/constant';

import styles from './index.module.less';

type Props = {
  show: boolean;
  onConfirm: (tag: string) => void;
  onCancel: () => void;
  tags: { text: string }[];
  defaultValue: string;
};

const RoomNamePopLayout: FC<Props> = ({ show, tags, onCancel, onConfirm, defaultValue }) => {
  const [tag, setTag] = useState('');
  const [errText, setErrText] = useState('');
  const [showErrText, setShowErrText] = useState(false);
  const iconColor = THEME_COLOR;

  const _onCancel = () => {
    onCancel && onCancel();
    setTag('');
  };

  const _onConfirm = () => {
    if (showErrText) return;
    onConfirm && onConfirm(tag);
  };

  const handleChangeText = e => {
    const { value } = e;
    if (stringToByte(value).length > 19) {
      setErrText(Strings.getLang('dsc_room_name_too_long'));
      setShowErrText(true);
      setTag(value);
      return;
    }
    setShowErrText(false);
    setTag(value);
  };

  useEffect(() => {
    if (show) {
      setTag(defaultValue || '');
    }
  }, [show]);

  return (
    <Popup
      show={show}
      position="center"
      round
      safeAreaInsetBottom={false}
      customStyle={{ marginBottom: 0, backgroundColor: 'transparent' }}
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      onClickOverlay={_onCancel}
      onClose={_onCancel}
    >
      <View className={styles.container}>
        <View
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '64rpx',
            marginLeft: '64rpx',
          }}
        >
          <Input
            type="text"
            placeholder={Strings.getLang('dsc_enter_room_name')}
            maxLength={20}
            onInput={handleChangeText}
            value={tag}
            style={{
              height: '96rpx',
              borderRadius: '32rpx',
              borderWidth: '1px',
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
          <Image
            src={Res.inputClose}
            style={{
              width: '40rpx',
              height: '40rpx',
              position: 'absolute',
              right: '32rpx',
              caretColor: iconColor,
              zIndex: 99,
            }}
            onClick={() => {
              setTag('');
            }}
          />
        </View>
        {showErrText && (
          <View>
            <Text
              style={{ marginRight: '64rpx', marginLeft: '64rpx', color: 'red', fontSize: '28rpx' }}
            >
              {errText}
            </Text>
          </View>
        )}
        <View className={styles.content}>
          {tags.map((item, index) => {
            return (
              <View
                key={index}
                className={styles.nameTag}
                onClick={() => {
                  setTag(item.text);
                }}
              >
                <Text className={styles.nameText}>{item.text}</Text>
              </View>
            );
          })}
        </View>
        <View className={styles.controlBarContent}>
          <Button
            className={styles.buttonCancel}
            style={{ borderWidth: 4, borderColor: iconColor, borderStyle: 'solid' }}
            onClick={_onCancel}
          >
            <Text style={{ color: iconColor }}>{Strings.getLang('dsc_cancel')}</Text>
          </Button>
          <Button
            className={styles.buttonConfirm}
            style={{ backgroundColor: iconColor }}
            onClick={_onConfirm}
          >
            <Text style={{ color: '#ffffff' }}>{Strings.getLang('dsc_confirm')}</Text>
          </Button>
        </View>
      </View>
    </Popup>
  );
};

export default RoomNamePopLayout;
