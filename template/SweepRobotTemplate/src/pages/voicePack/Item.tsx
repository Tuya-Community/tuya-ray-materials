import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Cell, Icon, ToastInstance } from '@ray-js/smart-ui';
import playIcon from '@tuya-miniapp/icons/dist/svg/Play';
import pauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import { Text, View, createInnerAudioContext } from '@ray-js/ray';
import { emitter } from '@/utils';
import { useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { encodeVoice0x34 } from '@ray-js/robot-protocol';

type Props = {
  data: Voice;
  deviceVoice: {
    languageId?: number;
    status?: number;
    progress?: number;
  };
};

const Item: FC<Props> = ({ data, deviceVoice }) => {
  const { name, id, auditionUrl, officialUrl, extendData, desc } = data;
  const { extendId } = extendData;
  const { languageId, status, progress } = deviceVoice;
  const actions = useActions();
  const [isListening, setIsListening] = useState(false);
  const audioContext = useRef<ty.CreateInnerAudioContextTask>();

  const selected = extendId === languageId;
  const using = selected && status === 3;
  const downloading = selected && status === 1;

  useEffect(() => {
    audioContext.current = createInnerAudioContext();

    audioContext.current.onTimeUpdate(({ time }) => {
      console.log('onTimeUpdate', time);
      if (time === 1) {
        audioContext.current.stop({
          success: () => {
            setIsListening(false);
          },
        });
      }
    });

    const handleAudioPlay = ListeningId => {
      if (ListeningId !== id) {
        setIsListening(false);
      }
    };

    emitter.on('audioPlay', handleAudioPlay);

    return () => {
      audioContext.current.destroy({});

      emitter.off('audioPlay', handleAudioPlay);
    };
  }, []);

  const handlePlay = () => {
    if (isListening) {
      audioContext.current.stop({
        success: () => {
          setIsListening(false);
        },
      });
    } else {
      emitter.emit('audioPlay', id);

      audioContext.current.play({
        src: auditionUrl,
        autoplay: true,
        loop: false,
        success: () => {
          ToastInstance({
            message: Strings.getLang('dsc_start_listen'),
          });

          setIsListening(true);
        },
      });
    }
  };

  const handleUse = () => {
    actions.voice_data.set(
      encodeVoice0x34({
        id: extendData.extendId,
        url: officialUrl,
        md5: desc,
      })
    );
  };

  const rightJSX = (
    <Button
      loading={downloading}
      loadingText={`${progress}%`}
      size="small"
      type={selected ? 'primary' : 'default'}
      disabled={using}
      onClick={handleUse}
    >
      {using ? Strings.getLang('dsc_voice_pack_using') : Strings.getLang('dsc_voice_pack_use')}
    </Button>
  );

  return (
    <Cell
      border={false}
      slot={{
        title: (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon name={isListening ? pauseIcon : playIcon} size="48rpx" onClick={handlePlay} />
            <Text
              style={{
                marginLeft: '12rpx',
              }}
            >
              {name}
            </Text>
          </View>
        ),
        rightIcon: rightJSX,
      }}
    />
  );
};

export default Item;
